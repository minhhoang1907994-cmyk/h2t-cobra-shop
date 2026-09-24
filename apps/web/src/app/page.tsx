import Link from 'next/link'
import { ShoppingBag, Sparkles } from 'lucide-react'
import React from 'react'

import { Media } from '@/components/Media'
import { ProductGrid } from '@/components/ProductGrid'
import { getCategories, getFeaturedProducts, getSiteSettings } from '@/lib/cms'
import { getCategoryPath, SITE_DESCRIPTION } from '@/utilities/site'

const FEATURED_LIMIT = 8

export default async function HomePage() {
  const [settings, categories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getFeaturedProducts(FEATURED_LIMIT),
  ])

  const { heroImage, heroSubtitle, heroTitle, highlights, shopeeUrl } = settings

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-background">
        <div className="container grid items-center gap-10 py-12 md:py-20 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-brand">
              <Sparkles aria-hidden className="size-4 text-accent" />
              Mô hình in 3D Flexi • Khớp cử động
            </span>
            <h1 className="text-4xl font-black leading-tight text-brand-dark md:text-6xl">
              {heroTitle || 'Cả đại dương trong lòng bàn tay'}
            </h1>
            <p className="max-w-xl text-lg text-foreground/80">{heroSubtitle || SITE_DESCRIPTION}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-brand px-6 py-3 font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
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

          {heroImage && typeof heroImage === 'object' && (
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl">
              <Media
                className="absolute inset-0 size-full object-cover"
                priority
                resource={heroImage}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </section>

      {highlights && highlights.length > 0 && (
        <section className="container -mt-4 md:-mt-8">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {highlights.map((highlight) => (
              <li
                className="flex flex-col gap-1 rounded-3xl border-2 border-border bg-card p-4 text-center shadow-sm"
                key={highlight.id}
              >
                <span className="font-black text-brand">{highlight.title}</span>
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
