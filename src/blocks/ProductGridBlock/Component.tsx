import type { ProductGridBlock as ProductGridBlockProps } from '@/payload-types'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { productCardSelect, type ProductCardData } from '@/components/ProductCard'
import { ProductGrid } from '@/components/ProductGrid'

export const ProductGridBlockComponent: React.FC<
  ProductGridBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, heading, limit, populateBy, selectedProducts, showViewAll } = props

  let products: (ProductCardData & { id: number })[] = []

  if (populateBy === 'selection') {
    products = (selectedProducts || []).filter((product) => typeof product === 'object')
  } else {
    const payload = await getPayload({ config: configPromise })

    const categoryIds = (categories || []).map((category) =>
      typeof category === 'object' ? category.id : category,
    )

    let where: Where | undefined
    if (populateBy === 'featured') where = { isFeatured: { equals: true } }
    if (populateBy === 'category' && categoryIds.length) where = { categories: { in: categoryIds } }

    const result = await payload.find({
      collection: 'products',
      depth: 1,
      limit: limit || 8,
      overrideAccess: false,
      select: productCardSelect,
      sort: '-publishedAt',
      where,
    })

    products = result.docs
  }

  if (!products.length) return null

  return (
    <section className="container" id={`block-${id}`}>
      {(heading || showViewAll) && (
        <div className="mb-6 flex items-end justify-between gap-4">
          {heading && <h2 className="text-2xl font-bold md:text-3xl">{heading}</h2>}
          {showViewAll && (
            <Link
              className="shrink-0 font-semibold text-blue-600 hover:underline"
              href="/san-pham"
            >
              Xem tất cả →
            </Link>
          )}
        </div>
      )}
      <ProductGrid products={products} />
    </section>
  )
}
