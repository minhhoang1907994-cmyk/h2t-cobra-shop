import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { SITE_NAME } from './getDocPath'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Mô hình in 3D Flexi khớp cử động — H2T Cobra 3D Huế.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: SITE_NAME,
  title: SITE_NAME,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
