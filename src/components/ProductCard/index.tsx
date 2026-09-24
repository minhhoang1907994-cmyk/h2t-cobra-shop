import { cn } from '@/utilities/ui'
import { getDocPath } from '@/utilities/getDocPath'
import Link from 'next/link'
import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { ProductPrice } from '@/components/ProductPrice'

export type ProductCardData = Pick<
  Product,
  'slug' | 'title' | 'price' | 'compareAtPrice' | 'priceNote' | 'gallery'
>

// Fields needed to render a ProductCard, used as `select` in product queries
export const productCardSelect = {
  slug: true,
  title: true,
  price: true,
  compareAtPrice: true,
  priceNote: true,
  gallery: true,
} as const

export const ProductCard: React.FC<{
  className?: string
  doc: ProductCardData
}> = ({ className, doc }) => {
  const { gallery, slug, title } = doc
  const coverImage = gallery?.[0]

  return (
    <Link
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-200 hover:-translate-y-1 hover:shadow-lg',
        className,
      )}
      href={getDocPath('products', slug)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {coverImage && typeof coverImage === 'object' ? (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
            resource={coverImage}
            size="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chưa có ảnh
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug">{title}</h3>
        <ProductPrice className="mt-auto" {...doc} />
      </div>
    </Link>
  )
}
