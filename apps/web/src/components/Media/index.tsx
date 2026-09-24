/* eslint-disable @next/next/no-img-element -- static export has no image optimizer; responsive variants come from Payload image sizes */
import { cn } from '@/utilities/ui'
import React from 'react'

import type { Media as MediaType } from '@cms/payload-types'

// Payload image sizes that keep the original aspect ratio, used to build srcSet
const RESPONSIVE_SIZES = ['thumbnail', 'small', 'medium', 'large', 'xlarge'] as const

type Props = {
  alt?: string
  className?: string
  priority?: boolean
  resource: MediaType
  sizes: string
}

export const Media: React.FC<Props> = ({ alt, className, priority, resource, sizes }) => {
  const variants = RESPONSIVE_SIZES.map((name) => resource.sizes?.[name]).filter(
    (variant): variant is { url: string; width: number } =>
      Boolean(variant?.url && variant.width),
  )

  if (resource.url && resource.width && !variants.some((v) => v.width === resource.width)) {
    variants.push({ url: resource.url, width: resource.width })
  }

  const src = resource.sizes?.medium?.url || resource.url || ''
  if (!src) return null

  return (
    <img
      alt={alt ?? resource.alt ?? ''}
      className={cn(className)}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      height={resource.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes}
      src={src}
      srcSet={variants.map((variant) => `${variant.url} ${variant.width}w`).join(', ') || undefined}
      width={resource.width ?? undefined}
    />
  )
}
