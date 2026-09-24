import type { Metadata } from 'next/types'

import { CategoryFilter } from '@/components/CategoryFilter'
import { productCardSelect } from '@/components/ProductCard'
import { ProductGrid } from '@/components/ProductGrid'
import { SITE_NAME } from '@/utilities/getDocPath'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const [products, categories] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 1,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
      select: productCardSelect,
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      overrideAccess: false,
      pagination: false,
      sort: 'sortOrder',
      select: {
        slug: true,
        title: true,
      },
    }),
  ])

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold md:text-4xl">Sản phẩm</h1>
        <CategoryFilter categories={categories.docs} />
      </div>

      <div className="container">
        <ProductGrid products={products.docs} />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Sản phẩm | ${SITE_NAME}`,
  }
}
