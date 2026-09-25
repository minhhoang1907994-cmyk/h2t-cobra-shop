'use client'

import { X } from 'lucide-react'
import React, { useRef } from 'react'

import { cn } from '@/utilities/ui'

// Wraps an image so clicking it opens the full-size version in a modal dialog
export const ZoomableImage: React.FC<{
  alt: string
  children: React.ReactNode
  className?: string
  zoomSrc: string
}> = ({ alt, children, className, zoomSrc }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        aria-label="Phóng to ảnh"
        className={cn('block cursor-zoom-in', className)}
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        {children}
      </button>

      <dialog
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/80"
        onClick={() => dialogRef.current?.close()}
        ref={dialogRef}
      >
        <button
          aria-label="Đóng"
          className="fixed top-4 right-4 rounded-full bg-white/90 p-2 text-foreground shadow-lg transition hover:bg-white"
          type="button"
        >
          <X aria-hidden className="size-6" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export has no image optimizer */}
        <img
          alt={alt}
          className="block max-h-[90vh] w-auto max-w-[95vw] cursor-zoom-out rounded-xl"
          loading="lazy"
          src={zoomSrc}
        />
      </dialog>
    </>
  )
}
