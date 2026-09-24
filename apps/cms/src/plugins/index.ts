import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Product } from '@/payload-types'
import { getDocPath, getWebURL, SITE_NAME } from '@/utilities/getDocPath'

const generateTitle: GenerateTitle<Product> = ({ doc }) => {
  return doc?.title ? `${doc.title} | ${SITE_NAME}` : SITE_NAME
}

const generateURL: GenerateURL<Product> = ({ doc, collectionConfig }) => {
  return `${getWebURL()}${getDocPath(collectionConfig?.slug, doc?.slug)}`
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  // Store media on a private Backblaze B2 bucket (S3-compatible). Files are served through
  // /api/media/file/...; the static web site copies them at build time.
  // Disabled when S3_BUCKET is not set, in which case uploads go to the local public/media directory.
  s3Storage({
    enabled: Boolean(process.env.S3_BUCKET),
    collections: {
      media: true,
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: true,
      // B2 does not support the default flexible checksums of recent AWS SDK versions
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    },
  }),
]
