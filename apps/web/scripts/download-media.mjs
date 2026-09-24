// Downloads every media file (original + image sizes) from the CMS into public/media before
// `next build`, so the static site serves images itself. The B2 bucket stays private: files
// are read through the CMS proxy route (/api/media/file/...), which only needs to be awake
// during the build, not when visitors browse the site.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const CMS_URL = (process.env.CMS_URL || 'http://localhost:3000').replace(/\/$/, '')
const OUTPUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/media')

const MAX_ATTEMPTS = 6
const REQUEST_TIMEOUT_MS = 90_000
const RETRY_DELAY_MS = 10_000
const CONCURRENCY = 4

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Retries while the CMS free instance is waking up (5xx / network errors)
async function fetchWithRetry(url) {
  let lastError

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
      if (res.ok) return res
      if (res.status < 500) throw Object.assign(new Error(`${url} responded ${res.status}`), { fatal: true })
      lastError = new Error(`${url} responded ${res.status}`)
    } catch (error) {
      if (error.fatal) throw error
      lastError = error
    }

    if (attempt < MAX_ATTEMPTS) {
      console.warn(`[media] ${url} failed (attempt ${attempt}/${MAX_ATTEMPTS}), retrying...`)
      await sleep(RETRY_DELAY_MS)
    }
  }

  throw new Error(`Cannot download ${url}: ${String(lastError)}`)
}

const toAbsoluteUrl = (url) => (url.startsWith('/') ? `${CMS_URL}${url}` : url)

async function main() {
  const res = await fetchWithRetry(`${CMS_URL}/api/media?pagination=false&depth=0`)
  const { docs } = await res.json()

  const files = new Map()
  for (const doc of docs) {
    for (const file of [doc, ...Object.values(doc.sizes || {})]) {
      if (file?.url && file?.filename) files.set(file.filename, toAbsoluteUrl(file.url))
    }
  }

  await fs.rm(OUTPUT_DIR, { recursive: true, force: true })
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const queue = [...files.entries()]
  const worker = async () => {
    for (let item = queue.shift(); item; item = queue.shift()) {
      const [filename, url] = item
      const fileRes = await fetchWithRetry(url)
      await fs.writeFile(path.join(OUTPUT_DIR, filename), Buffer.from(await fileRes.arrayBuffer()))
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  console.log(`[media] Downloaded ${files.size} files from ${docs.length} media documents`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
