export const SITE_NAME = 'H2T Cobra'

export const getDocPath = (collection: string | undefined, slug: string | null | undefined) => {
  if (!slug) return '/'

  switch (collection) {
    case 'products':
      return `/san-pham/${slug}`
    case 'posts':
      return `/posts/${slug}`
    default:
      return slug === 'home' ? '/' : `/${slug}`
  }
}
