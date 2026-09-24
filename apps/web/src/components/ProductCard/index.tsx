import { cn } from '@/utilities/ui'
import { getProductPath } from '@/utilities/site'
import Link from 'next/link'
import React from 'react'

import type { Product } from '@cms/payload-types'

import { Media } from '@/components/Media'
import { ProductPrice } from '@/components/ProductPrice'

export type ProductCardData = Pick<
  Product,
  'slug' | 'title' | 'price' | 'compareAtPrice' | 'priceNote' | 'gallery'
>

export const ProductCard: React.FC<{
  className?: string
  doc: ProductCardData
}> = ({ className, doc }) => {
  const { gallery, slug, title } = doc
  const coverImage = gallery?.[0]

  return (
    <Link
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card transition duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10',
        className,
      )}
      href={getProductPath(slug)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {coverImage && typeof coverImage === 'object' ? (
          <Media
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
            resource={coverImage}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chưa có ảnh
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-bold leading-snug">{title}</h3>
        <ProductPrice className="mt-auto" {...doc} />
      </div>
    </Link>
  )
}
