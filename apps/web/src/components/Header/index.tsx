import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import React from 'react'

import type { SiteSetting } from '@cms/payload-types'

import { Media } from '@/components/Media'

export const Header: React.FC<{ settings: SiteSetting }> = ({ settings }) => {
  const { logo, shopeeUrl, siteName } = settings

  return (
    <header className="sticky top-0 z-30 border-b border-brand/30 bg-brand-dark/85 shadow-[0_1px_24px_-8px] shadow-brand/40 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link aria-label={`${siteName} — Trang chủ`} className="flex items-center gap-3" href="/">
          {logo && typeof logo === 'object' ? (
            <Media className="h-12 w-auto" priority resource={logo} sizes="160px" />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export has no image optimizer */}
              <img alt="" className="size-12" height={48} src="/brand/logo.png" width={48} />
              <span className="hidden text-xl font-black tracking-tight sm:inline">
                <span className="text-brand">H2T</span>
                <span className="text-accent">COBRA</span>
              </span>
            </>
          )}
        </Link>

        <nav className="flex items-center gap-1 text-sm font-bold sm:gap-4 sm:text-base">
          <Link className="rounded-full px-3 py-2 transition-colors hover:text-brand" href="/">
            Trang chủ
          </Link>
          <Link className="rounded-full px-3 py-2 transition-colors hover:text-brand" href="/san-pham/">
            Sản phẩm
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
