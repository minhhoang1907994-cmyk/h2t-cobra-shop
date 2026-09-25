import Link from 'next/link'
import { ShoppingBag, Sparkles } from 'lucide-react'
import React from 'react'

import { Media } from '@/components/Media'
import { ProductGrid } from '@/components/ProductGrid'
import { ZoomableImage } from '@/components/ZoomableImage'
import { getCategories, getFeaturedProducts, getSiteSettings } from '@/lib/cms'
import { getCategoryPath, SITE_DESCRIPTION } from '@/utilities/site'

const FEATURED_LIMIT = 8

// Default banner (apps/web/public/brand), used until an "Ảnh banner" is uploaded in the CMS
const BANNER_SRC_SET = [768, 1280, 1920, 2688].map((w) => `/brand/banner-${w}.webp ${w}w`).join(', ')

// Banner spans the full width with its original aspect ratio
const BANNER_CLASS = 'block h-auto w-full'

export default async function HomePage() {
  const [settings, categories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getFeaturedProducts(FEATURED_LIMIT),
  ])

  const { heroImage, heroSubtitle, heroTitle, highlights, shopeeUrl } = settings

  const heroMedia = heroImage && typeof heroImage === 'object' ? heroImage : null
  const bannerAlt = heroMedia?.alt || 'H2T Cobra — 3D Printing Solutions'
  const bannerZoomSrc = heroMedia?.sizes?.xlarge?.url || heroMedia?.url || '/brand/banner-2688.webp'

  return (
    <>
      <section className="bg-brand-dark">
        <ZoomableImage alt={bannerAlt} className="w-full" zoomSrc={bannerZoomSrc}>
          {heroMedia ? (
            <Media
              className={BANNER_CLASS}
              priority
              resource={heroMedia}
              sizes="100vw"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element -- static export has no image optimizer */
            <img
              alt={bannerAlt}
              className={BANNER_CLASS}
              fetchPriority="high"
              height={530}
              sizes="100vw"
              src="/brand/banner-1280.webp"
              srcSet={BANNER_SRC_SET}
              width={2688}
            />
          )}
        </ZoomableImage>
        <div aria-hidden className="h-1 bg-gradient-to-r from-brand via-sunny to-accent" />
      </section>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(30_143_255/0.16),transparent_55%),radial-gradient(ellipse_at_top_right,rgb(255_185_56/0.2),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgb(255_122_26/0.14),transparent_55%)]"
        />
        <div className="container relative flex flex-col items-center gap-6 py-12 text-center md:py-16">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">
            <Sparkles aria-hidden className="size-4 text-accent" />
            Mô hình in 3D Flexi • Khớp cử động
          </span>
          <h1 className="text-brand-gradient max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            {heroTitle || 'Biến mọi ý tưởng thành mô hình 3D'}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{heroSubtitle || SITE_DESCRIPTION}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-full bg-brand px-6 py-3 font-bold text-white shadow-lg shadow-brand/30 transition hover:brightness-110"
              href="/san-pham/"
            >
              Xem sản phẩm
            </Link>
            {shopeeUrl && (
              <a
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/30 transition hover:brightness-110"
                href={shopeeUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ShoppingBag aria-hidden className="size-5" />
                Mua trên Shopee
              </a>
            )}
          </div>
        </div>
      </section>

      {highlights && highlights.length > 0 && (
        <section className="container">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {highlights.map((highlight) => (
              <li
                className="flex flex-col gap-1 rounded-3xl border-2 border-border bg-card p-4 text-center transition-colors hover:border-accent/60"
                key={highlight.id}
              >
                <span className="font-black text-accent">{highlight.title}</span>
                {highlight.description && (
                  <span className="text-sm text-muted-foreground">{highlight.description}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {categories.length > 0 && (
        <section className="container mt-16">
          <h2 className="mb-6 text-2xl font-black md:text-3xl">Danh mục</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl"
                  href={getCategoryPath(category.slug)}
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {category.image && typeof category.image === 'object' && (
                      <Media
                        className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        resource={category.image}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <span className="p-4 text-center font-bold">{category.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container mt-16 mb-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black md:text-3xl">Sản phẩm nổi bật</h2>
          <Link className="shrink-0 font-bold text-brand hover:underline" href="/san-pham/">
            Xem tất cả →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </>
  )
}
