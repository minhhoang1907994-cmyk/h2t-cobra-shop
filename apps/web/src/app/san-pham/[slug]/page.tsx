import type { Metadata } from 'next'

import { BuyButtons } from '@/components/BuyButtons'
import { ProductGallery } from '@/components/ProductGallery'
import { ProductGrid } from '@/components/ProductGrid'
import { ProductPrice } from '@/components/ProductPrice'
import { RichText } from '@/components/RichText'
import { getAllProducts, getProductBySlug, getRelatedProducts, getSiteSettings } from '@/lib/cms'
import {
  getCategoryPath,
  getProductPath,
  FACEBOOK_URL,
  getSiteURL,
  SITE_NAME,
  withPlaceholderParam,
} from '@/utilities/site'
import { Check, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import type { Category, Media, Product } from '@cms/payload-types'

// Static export: only products published at build time exist
export const dynamicParams = false

export async function generateStaticParams() {
  const products = await getAllProducts()

  return withPlaceholderParam(products.map(({ slug }) => ({ slug })))
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

const isMedia = (value: number | Media | null | undefined): value is Media =>
  typeof value === 'object' && value !== null

const isCategory = (value: number | Category): value is Category => typeof value === 'object'

const findProduct = async (slug: string) => getProductBySlug(decodeURIComponent(slug))

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await findProduct(slug)

  if (!product) notFound()

  const [siteSettings, relatedProducts] = await Promise.all([
    getSiteSettings(),
    getRelatedProducts(product, 4),
  ])

  const categories = (product.categories || []).filter(isCategory)
  const images = [
    ...product.gallery.filter(isMedia),
    ...(product.colors || []).map((color) => color.image).filter(isMedia),
  ]
  const facebookUrl =
    product.facebookUrl || siteSettings.messengerUrl || siteSettings.facebookUrl || FACEBOOK_URL

  return (
    <article className="container py-12 md:py-16">
      <script
        dangerouslySetInnerHTML={{ __html: buildProductJsonLd(product, images) }}
        type="application/ld+json"
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm font-semibold text-muted-foreground">
        <Link className="hover:text-brand" href="/san-pham/">
          Sản phẩm
        </Link>
        {categories[0] && (
          <>
            {' / '}
            <Link className="hover:text-brand" href={getCategoryPath(categories[0].slug)}>
              {categories[0].title}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={images} title={product.title} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-black leading-tight md:text-4xl">{product.title}</h1>
            <ProductPrice size="lg" {...product} />
          </div>

          {product.shortDescription && (
            <p className="whitespace-pre-line text-lg text-muted-foreground">
              {product.shortDescription}
            </p>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="font-bold">Màu sắc</h2>
              <ul className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <li
                    className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-3 py-1 text-sm font-semibold"
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
              <h2 className="font-bold">Video sản phẩm</h2>
              <ul className="flex flex-col gap-1">
                {product.videoUrls.map((video, index) => (
                  <li key={video.id}>
                    <a
                      className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
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
          <h2 className="mb-6 text-2xl font-black">Mô tả sản phẩm</h2>
          <RichText className="max-w-[48rem]" data={product.content} />
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-black">Sản phẩm liên quan</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await findProduct(slug)

  if (!product) return {}

  // Fall back to the first gallery image and short description when SEO fields are empty
  const title = product.meta?.title || product.title
  const description = product.meta?.description || product.shortDescription || undefined
  const image = isMedia(product.meta?.image) ? product.meta.image : product.gallery.find(isMedia)
  const ogImageUrl = image?.sizes?.og?.url || image?.url

  return {
    // meta.title from the CMS already contains the site name
    title: product.meta?.title ? { absolute: title } : title,
    description,
    alternates: {
      canonical: getProductPath(product.slug),
    },
    openGraph: {
      title,
      description,
      url: getProductPath(product.slug),
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  }
}

const buildProductJsonLd = (product: Product, images: Media[]) => {
  const siteUrl = getSiteURL()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription || product.meta?.description || undefined,
    image: images
      .map((image) => image.url)
      .filter(Boolean)
      .map((url) => (url?.startsWith('/') ? `${siteUrl}${url}` : url)),
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
            url: product.shopeeUrl || `${siteUrl}${getProductPath(product.slug)}`,
          },
        }
      : {}),
  }

  // Escape "<" so the JSON cannot close the surrounding script tag
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c')
}
