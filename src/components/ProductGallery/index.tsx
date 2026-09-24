'use client'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

export const ProductGallery: React.FC<{
  images: MediaType[]
  title: string
}> = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? images[0]

  if (!activeImage) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        Chưa có ảnh
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
        <Media
          alt={activeImage.alt || title}
          fill
          imgClassName="object-cover"
          priority
          resource={activeImage}
          size="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              aria-label={`Xem ảnh ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={cn(
                'relative aspect-square overflow-hidden rounded-lg border-2 bg-muted transition',
                index === activeIndex
                  ? 'border-blue-600'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
              key={image.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <Media alt="" fill imgClassName="object-cover" resource={image} size="20vw" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
