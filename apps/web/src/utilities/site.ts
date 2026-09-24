export const SITE_NAME = 'H2T Cobra'

export const SITE_DESCRIPTION = 'Mô hình in 3D Flexi khớp cử động — H2T Cobra 3D Huế.'

export const getSiteURL = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001').replace(/\/$/, '')

export const getProductPath = (slug: string) => `/san-pham/${slug}/`

export const getCategoryPath = (slug: string) => `/danh-muc/${slug}/`

// With `output: export`, a dynamic route must generate at least one page. When the shop has
// no products/categories yet, a placeholder page is generated and renders the 404 page.
export const PLACEHOLDER_SLUG = '_'

export const withPlaceholderParam = (params: { slug: string }[]) =>
  params.length ? params : [{ slug: PLACEHOLDER_SLUG }]
