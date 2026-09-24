import type { NextConfig } from 'next'

// The CMS only serves the admin panel and API, the public site is the static web app
export const redirects: NextConfig['redirects'] = async () => {
  return [
    {
      source: '/',
      destination: '/admin',
      permanent: false,
    },
  ]
}
