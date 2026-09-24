import { cn } from '@/utilities/ui'
import React from 'react'

import { ProductCard, type ProductCardData } from '@/components/ProductCard'

export const ProductGrid: React.FC<{
  className?: string
  products: (ProductCardData & { id: number })[]
}> = ({ className, products }) => {
  if (!products.length) {
    return <p className="py-12 text-center text-muted-foreground">Chưa có sản phẩm nào.</p>
  }

  return (
    <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6', className)}>
      {products.map((product) => (
        <ProductCard doc={product} key={product.id} />
      ))}
    </div>
  )
}
