import type { Metadata } from 'next'

import { BuyButtons } from '@/components/BuyButtons'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { productCardSelect } from '@/components/ProductCard'
import { ProductGallery } from '@/components/ProductGallery'
import { ProductGrid } from '@/components/ProductGrid'
import { ProductPrice } from '@/components/ProductPrice'
import RichText from '@/components/RichText'
import configPromise from '@payload-config'
import { Check, PlayCircle } from 'lucide-react'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Category, Media, Product } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getDocPath, SITE_NAME } from '@/utilities/getDocPath'
import { getServerSideURL } from '@/utilities/getURL'
import PageClient from '../page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return products.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const isMedia = (value: number | Media | null | undefined): value is Media =>
  typeof value === 'object' && value !== null

const isCategory = (value: number | Category): value is Category => typeof value === 'object'

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = getDocPath('products', decodedSlug)
  const product = await queryProductBySlug({ slug: decodedSlug })

  if (!product) return <PayloadRedirects url={url} />

  const siteSettings = await getCachedGlobal('site-settings', 0)()

  const categories = (product.categories || []).filter(isCategory)
  const images = [
    ...product.gallery.filter(isMedia),
    ...(product.colors || []).map((color) => color.image).filter(isMedia),
  ]
  const facebookUrl = product.facebookUrl || siteSettings.messengerUrl || siteSettings.facebookUrl
  const relatedProducts = await queryRelatedProducts(product)

  return (
    <article className="pt-24 pb-24">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <script
        dangerouslySetInnerHTML={{ __html: buildProductJsonLd(product, images, url) }}
        type="application/ld+json"
      />

      <div className="container">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <Link className="hover:text-blue-600" href="/san-pham">
            Sản phẩm
          </Link>
          {categories[0] && (
            <>
              {' / '}
              <Link className="hover:text-blue-600" href={`/danh-muc/${categories[0].slug}`}>
                {categories[0].title}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={images} title={product.title} />

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold leading-tight md:text-4xl">{product.title}</h1>
              <ProductPrice size="lg" {...product} />
            </div>

            {product.shortDescription && (
              <p className="whitespace-pre-line text-lg text-muted-foreground">
                {product.shortDescription}
              </p>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold">Màu sắc</h2>
                <ul className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <li
                      className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm"
                      key={color.id}
                    >
                      {color.hex && (
                        <span
                          aria-hidden
                          className="size-4 rounded-full border border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                      )}
                      {color.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li className="flex items-start gap-2" key={feature.id}>
                    <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-green-600" />
                    {feature.text}
                  </li>
                ))}
              </ul>
            )}

            <BuyButtons facebookUrl={facebookUrl} shopeeUrl={product.shopeeUrl} />

            {product.videoUrls && product.videoUrls.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold">Video sản phẩm</h2>
                <ul className="flex flex-col gap-1">
                  {product.videoUrls.map((video, index) => (
                    <li key={video.id}>
                      <a
                        className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                        href={video.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <PlayCircle aria-hidden className="size-5" />
                        Xem video {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {product.content && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Mô tả sản phẩm</h2>
            <RichText className="max-w-[48rem]" data={product.content} enableGutter={false} />
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Sản phẩm liên quan</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const product = await queryProductBySlug({ slug: decodedSlug })

  if (!product) return generateMeta({ doc: null })

  // Fall back to the first gallery image and short description when SEO fields are empty
  return generateMeta({
    doc: {
      ...product,
      meta: {
        ...product.meta,
        description: product.meta?.description || product.shortDescription,
        image: product.meta?.image || product.gallery[0],
      },
    },
    path: getDocPath('products', product.slug),
  })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 1,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryRelatedProducts = async (product: Product) => {
  const categoryIds = (product.categories || []).map((category) =>
    typeof category === 'object' ? category.id : category,
  )

  if (!categoryIds.length) return []

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 4,
    overrideAccess: false,
    select: productCardSelect,
    where: {
      and: [{ categories: { in: categoryIds } }, { id: { not_equals: product.id } }],
    },
  })

  return result.docs
}

const buildProductJsonLd = (product: Product, images: Media[], path: string) => {
  const serverUrl = getServerSideURL()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription || product.meta?.description || undefined,
    image: images.filter((image) => image.url).map((image) => `${serverUrl}${image.url}`),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    ...(typeof product.price === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'VND',
            url: product.shopeeUrl || `${serverUrl}${path}`,
          },
        }
      : {}),
  }

  // Escape "<" so the JSON cannot close the surrounding script tag
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c')
}
