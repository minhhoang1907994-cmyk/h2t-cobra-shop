import type { MetadataRoute } from 'next'

import { getAllProducts, getCategories } from '@/lib/cms'
import { getCategoryPath, getProductPath, getSiteURL } from '@/utilities/site'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteURL()
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()])

  return [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/san-pham/`, changeFrequency: 'weekly', priority: 0.9 },
    ...categories.map((category) => ({
      url: `${siteUrl}${getCategoryPath(category.slug)}`,
      lastModified: category.updatedAt,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}${getProductPath(product.slug)}`,
      lastModified: product.updatedAt,
    })),
  ]
}
