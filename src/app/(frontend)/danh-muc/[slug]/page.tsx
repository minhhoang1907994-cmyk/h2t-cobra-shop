import type { Metadata } from 'next'

import { CategoryFilter } from '@/components/CategoryFilter'
import { productCardSelect } from '@/components/ProductCard'
import { ProductGrid } from '@/components/ProductGrid'
import { SITE_NAME } from '@/utilities/getDocPath'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import PageClient from '../../san-pham/page.client'

export const revalidate = 600

export async function generateStaticParams() {
  const categories = await queryCategories()

  return categories.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const categories = await queryCategories()
  const category = categories.find((item) => item.slug === decodedSlug)

  if (!category) notFound()

  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    select: productCardSelect,
    where: {
      categories: {
        in: [category.id],
      },
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold md:text-4xl">{category.title}</h1>
        <CategoryFilter activeSlug={category.slug} categories={categories} />
      </div>

      <div className="container">
        <ProductGrid products={products.docs} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const category = (await queryCategories()).find((item) => item.slug === decodedSlug)

  return {
    title: category ? `${category.title} | ${SITE_NAME}` : SITE_NAME,
  }
}

const queryCategories = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    overrideAccess: false,
    pagination: false,
    sort: 'sortOrder',
    select: {
      slug: true,
      title: true,
    },
  })

  return result.docs
})
