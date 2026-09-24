import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Category } from '@/payload-types'

type CategoryItem = Pick<Category, 'id' | 'slug' | 'title'>

const chipClassName = (isActive: boolean) =>
  cn(
    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'border-blue-600 bg-blue-600 text-white'
      : 'border-border bg-card hover:border-blue-600 hover:text-blue-600',
  )

export const CategoryFilter: React.FC<{
  activeSlug?: string
  categories: CategoryItem[]
}> = ({ activeSlug, categories }) => {
  if (!categories.length) return null

  return (
    <nav aria-label="Danh mục sản phẩm" className="flex flex-wrap gap-2">
      <Link
        aria-current={!activeSlug ? 'page' : undefined}
        className={chipClassName(!activeSlug)}
        href="/san-pham"
      >
        Tất cả
      </Link>
      {categories.map((category) => {
        const isActive = category.slug === activeSlug

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={chipClassName(isActive)}
            href={`/danh-muc/${category.slug}`}
            key={category.id}
          >
            {category.title}
          </Link>
        )
      })}
    </nav>
  )
}
