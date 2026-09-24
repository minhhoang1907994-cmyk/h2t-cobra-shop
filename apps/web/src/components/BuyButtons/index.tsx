import { cn } from '@/utilities/ui'
import { MessageCircle, ShoppingBag } from 'lucide-react'
import React from 'react'

const buttonClassName =
  'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-none'

export const BuyButtons: React.FC<{
  className?: string
  facebookUrl?: string | null
  shopeeUrl?: string | null
}> = ({ className, facebookUrl, shopeeUrl }) => {
  if (!facebookUrl && !shopeeUrl) return null

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {shopeeUrl && (
        <a
          className={cn(buttonClassName, 'bg-[#ee4d2d] focus-visible:outline-[#ee4d2d]')}
          href={shopeeUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ShoppingBag aria-hidden className="size-5" />
          Mua trên Shopee
        </a>
      )}
      {facebookUrl && (
        <a
          className={cn(buttonClassName, 'bg-[#1877f2] focus-visible:outline-[#1877f2]')}
          href={facebookUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <MessageCircle aria-hidden className="size-5" />
          Đặt qua Facebook
        </a>
      )}
    </div>
  )
}
