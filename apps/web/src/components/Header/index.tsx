import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import React from 'react'

import type { SiteSetting } from '@cms/payload-types'

import { Media } from '@/components/Media'
import { Wordmark } from '@/components/Wordmark'

export const Header: React.FC<{ settings: SiteSetting }> = ({ settings }) => {
  const { logo, shopeeUrl, siteName } = settings

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/85 shadow-[0_1px_20px_-8px] shadow-brand/30 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link aria-label={`${siteName} — Trang chủ`} className="flex items-center gap-3" href="/">
          {logo && typeof logo === 'object' ? (
            <Media
              className="size-12 rounded-xl object-cover shadow-md shadow-brand/30"
              priority
              resource={logo}
              sizes="48px"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element -- static export has no image optimizer */
            <img
              alt=""
              className="size-12 rounded-xl shadow-md shadow-brand/30"
              height={48}
              src="/brand/logo-square.webp"
              width={48}
            />
          )}
          <Wordmark className="hidden text-2xl sm:inline-flex" />
        </Link>

        <nav className="flex items-center gap-1 text-sm font-bold sm:gap-4 sm:text-base">
          <Link className="rounded-full px-2 py-2 transition-colors hover:text-brand sm:px-3" href="/">
            Trang chủ
          </Link>
          <Link className="rounded-full px-2 py-2 transition-colors hover:text-brand sm:px-3" href="/san-pham/">
            Sản phẩm
          </Link>
          <Link className="rounded-full px-2 py-2 transition-colors hover:text-brand sm:px-3" href="/gioi-thieu/">
            Giới thiệu
          </Link>
          {shopeeUrl && (
            <a
              className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-white shadow-lg shadow-accent/30 transition hover:brightness-110 sm:inline-flex"
              href={shopeeUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ShoppingBag aria-hidden className="size-4" />
              Shop Shopee
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
