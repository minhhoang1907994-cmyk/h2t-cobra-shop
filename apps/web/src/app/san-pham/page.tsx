import type { Metadata } from 'next'

import { CategoryFilter } from '@/components/CategoryFilter'
import { ProductGrid } from '@/components/ProductGrid'
import { getAllProducts, getCategories } from '@/lib/cms'
import React from 'react'

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()])

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-6">
        <h1 className="text-3xl font-black md:text-4xl">Sản phẩm</h1>
        <CategoryFilter categories={categories} />
      </div>

      <ProductGrid products={products} />
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Sản phẩm',
  alternates: {
    canonical: '/san-pham/',
  },
}
