import { cn } from '@/utilities/ui'
import { formatPrice } from '@/utilities/formatPrice'
import React from 'react'

import type { Product } from '@/payload-types'

type Props = Pick<Product, 'price' | 'compareAtPrice' | 'priceNote'> & {
  className?: string
  size?: 'sm' | 'lg'
}

export const ProductPrice: React.FC<Props> = ({
  className,
  compareAtPrice,
  price,
  priceNote,
  size = 'sm',
}) => {
  if (typeof price !== 'number') {
    if (!priceNote) return null

    return (
      <p
        className={cn(
          'font-semibold text-orange-600',
          size === 'lg' ? 'text-2xl' : 'text-base',
          className,
        )}
      >
        {priceNote}
      </p>
    )
  }

  const hasDiscount = typeof compareAtPrice === 'number' && compareAtPrice > price

  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2', className)}>
      <span className={cn('font-bold text-orange-600', size === 'lg' ? 'text-3xl' : 'text-lg')}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span
          className={cn('text-muted-foreground line-through', size === 'lg' ? 'text-lg' : 'text-sm')}
        >
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </p>
  )
}
