import type { MetadataRoute } from 'next'

import { getSiteURL } from '@/utilities/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${getSiteURL()}/sitemap.xml`,
  }
}
