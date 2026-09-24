import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Fully static site: HTML is generated at build time from the CMS API
  output: 'export',
  // Emit /san-pham/index.html instead of /san-pham.html so any static host can serve it
  trailingSlash: true,
  images: {
    // Image optimization needs a server; responsive variants come from Payload image sizes instead
    unoptimized: true,
  },
  reactStrictMode: true,
  turbopack: {
    // Workspace root, where pnpm hoists shared dependencies
    root: path.resolve(dirname, '../..'),
  },
}

export default nextConfig
