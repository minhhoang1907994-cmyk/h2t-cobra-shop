import type { Category, Product, SiteSetting } from '@cms/payload-types'

const CMS_URL = (process.env.CMS_URL || 'http://localhost:3000').replace(/\/$/, '')

// The CMS runs on a Render free instance that sleeps when idle, so the first request
// of a build may wait for it to wake up (about a minute).
const MAX_ATTEMPTS = 6
const REQUEST_TIMEOUT_MS = 90_000
const RETRY_DELAY_MS = 10_000

// Unique per build process so Next.js never serves content cached by a previous build
const BUILD_STAMP = Date.now().toString()

class CmsHttpError extends Error {}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Media files are copied into public/media by scripts/download-media.mjs before the build,
// so the static site serves them itself instead of going through the (sleeping) CMS
const MEDIA_FILE_PATH = '/api/media/file/'

const resolveMediaUrls = (key: string, value: unknown) => {
  if (key !== 'url' || typeof value !== 'string') return value

  const mediaPathIndex = value.indexOf(MEDIA_FILE_PATH)
  if (mediaPathIndex !== -1) {
    return `/media/${value.slice(mediaPathIndex + MEDIA_FILE_PATH.length).split('?')[0]}`
  }

  return value.startsWith('/') ? `${CMS_URL}${value}` : value
}

async function cmsFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams({ ...params, _build: BUILD_STAMP })
  const url = `${CMS_URL}${path}?${query.toString()}`
  let lastError: unknown

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        cache: 'force-cache',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })

      if (res.ok) return JSON.parse(await res.text(), resolveMediaUrls) as T

      // 4xx will not fix itself; 5xx is expected while the instance is starting
      if (res.status < 500) throw new CmsHttpError(`CMS ${path} responded ${res.status}`)
      lastError = new Error(`CMS ${path} responded ${res.status}`)
    } catch (error) {
      if (error instanceof CmsHttpError) throw error
      lastError = error
    }

    if (attempt < MAX_ATTEMPTS) {
      console.warn(`[cms] ${path} failed (attempt ${attempt}/${MAX_ATTEMPTS}), retrying...`)
      await sleep(RETRY_DELAY_MS)
    }
  }

  throw new Error(`Cannot reach CMS at ${CMS_URL}${path}: ${String(lastError)}`)
}

type PaginatedDocs<T> = { docs: T[] }

// Memoized per build worker: every page reads from the same in-memory result
const memo = <T>(fn: () => Promise<T>) => {
  let promise: Promise<T> | undefined
  return () => (promise ??= fn())
}

export const getAllProducts = memo(async () => {
  const result = await cmsFetch<PaginatedDocs<Product>>('/api/products', {
    depth: '1',
    pagination: 'false',
    sort: '-publishedAt',
    'where[_status][equals]': 'published',
  })

  return result.docs
})

export const getCategories = memo(async () => {
  const result = await cmsFetch<PaginatedDocs<Category>>('/api/categories', {
    depth: '1',
    pagination: 'false',
    sort: 'sortOrder',
  })

  return result.docs
})

export const getSiteSettings = memo(() =>
  cmsFetch<SiteSetting>('/api/globals/site-settings', { depth: '1' }),
)

const getCategoryIds = (product: Product) =>
  (product.categories || []).map((category) =>
    typeof category === 'object' ? category.id : category,
  )

export const getProductBySlug = async (slug: string) =>
  (await getAllProducts()).find((product) => product.slug === slug) || null

export const getProductsByCategory = async (categoryId: number) =>
  (await getAllProducts()).filter((product) => getCategoryIds(product).includes(categoryId))

export const getFeaturedProducts = async (limit: number) => {
  const products = await getAllProducts()
  const featured = products.filter((product) => product.isFeatured)

  return (featured.length ? featured : products).slice(0, limit)
}

export const getRelatedProducts = async (product: Product, limit: number) => {
  const categoryIds = getCategoryIds(product)
  if (!categoryIds.length) return []

  return (await getAllProducts())
    .filter(
      (item) =>
        item.id !== product.id && getCategoryIds(item).some((id) => categoryIds.includes(id)),
    )
    .slice(0, limit)
}
