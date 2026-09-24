import { cn } from '@/utilities/ui'
import { getCategoryPath } from '@/utilities/site'
import Link from 'next/link'
import React from 'react'

import type { Category } from '@cms/payload-types'

type CategoryItem = Pick<Category, 'id' | 'slug' | 'title'>

const chipClassName = (isActive: boolean) =>
  cn(
    'rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors',
    isActive
      ? 'border-brand bg-brand text-white'
      : 'border-border bg-card hover:border-brand hover:text-brand',
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
        href="/san-pham/"
      >
        Tất cả
      </Link>
      {categories.map((category) => {
        const isActive = category.slug === activeSlug

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={chipClassName(isActive)}
            href={getCategoryPath(category.slug)}
            key={category.id}
          >
            {category.title}
          </Link>
        )
      })}
    </nav>
  )
}
