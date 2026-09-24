import { MapPin, Phone } from 'lucide-react'
import React from 'react'

import type { SiteSetting } from '@cms/payload-types'

const SocialLink: React.FC<{ href?: string | null; label: string }> = ({ href, label }) =>
  href ? (
    <a
      className="rounded-full border-2 border-white/30 px-4 py-1.5 text-sm font-bold hover:bg-white hover:text-brand-dark"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
    </a>
  ) : null

export const Footer: React.FC<{ settings: SiteSetting }> = ({ settings }) => {
  const { address, facebookUrl, hashtags, phone, shopeeUrl, siteName, tagline, tiktokUrl, zalo } =
    settings

  return (
    <footer className="mt-auto bg-brand-dark text-white">
      <div className="container grid gap-8 py-12 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="text-2xl font-black">{siteName}</p>
          {tagline && <p className="text-white/80">{tagline}</p>}
          {hashtags && hashtags.length > 0 && (
            <p className="text-sm font-bold text-sunny">{hashtags.join('  ')}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          {(phone || zalo) && (
            <p className="flex items-center gap-2">
              <Phone aria-hidden className="size-4" />
              {phone && <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>}
              {zalo && (
                <a
                  href={`https://zalo.me/${zalo.replace(/\s/g, '')}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  (Zalo: {zalo})
                </a>
              )}
            </p>
          )}
          {address && (
            <p className="flex items-center gap-2">
              <MapPin aria-hidden className="size-4" />
              {address}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <SocialLink href={facebookUrl} label="Facebook" />
            <SocialLink href={shopeeUrl} label="Shopee" />
            <SocialLink href={tiktokUrl} label="TikTok" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">
        © {new Date().getFullYear()} {siteName}
      </div>
    </footer>
  )
}
