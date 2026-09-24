export const SITE_NAME = 'H2T Cobra'

// Public URL of the static web site (apps/web), used for SEO previews and links
export const getWebURL = () => process.env.WEB_URL || 'http://localhost:3001'

export const getDocPath = (collection: string | undefined, slug: string | null | undefined) => {
  if (!slug) return '/'

  switch (collection) {
    case 'products':
      return `/san-pham/${slug}`
    case 'categories':
      return `/danh-muc/${slug}`
    default:
      return '/'
  }
}
