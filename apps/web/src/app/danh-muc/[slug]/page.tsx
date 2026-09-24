import type { Metadata } from 'next'

import { CategoryFilter } from '@/components/CategoryFilter'
import { ProductGrid } from '@/components/ProductGrid'
import { getCategories, getProductsByCategory } from '@/lib/cms'
import { getCategoryPath, withPlaceholderParam } from '@/utilities/site'
import { notFound } from 'next/navigation'
import React from 'react'

// Static export: only categories known at build time exist
export const dynamicParams = false

export async function generateStaticParams() {
  const categories = await getCategories()

  return withPlaceholderParam(categories.map(({ slug }) => ({ slug })))
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

const findCategory = async (slug: string) => {
  const decodedSlug = decodeURIComponent(slug)

  return (await getCategories()).find((category) => category.slug === decodedSlug)
}

export default async function CategoryPage({ params }: Args) {
  const { slug } = await params
  const category = await findCategory(slug)

  if (!category) notFound()

  const [categories, products] = await Promise.all([
    getCategories(),
    getProductsByCategory(category.id),
  ])

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-6">
        <h1 className="text-3xl font-black md:text-4xl">{category.title}</h1>
        <CategoryFilter activeSlug={category.slug} categories={categories} />
      </div>

      <ProductGrid products={products} />
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const category = await findCategory(slug)

  if (!category) return {}

  return {
    title: category.title,
    alternates: {
      canonical: getCategoryPath(category.slug),
    },
  }
}
