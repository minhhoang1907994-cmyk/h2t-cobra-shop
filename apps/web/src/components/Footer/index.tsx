import { Facebook, MapPin, Phone } from 'lucide-react'
import React from 'react'

import type { SiteSetting } from '@cms/payload-types'

import { Wordmark } from '@/components/Wordmark'
import { FACEBOOK_URL } from '@/utilities/site'

const SocialLink: React.FC<{ href?: string | null; label: string }> = ({ href, label }) =>
  href ? (
    <a
      className="rounded-full border-2 border-white/50 px-4 py-1.5 text-sm font-bold transition-colors hover:border-accent hover:bg-accent"
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
    <footer className="mt-auto bg-gradient-to-br from-brand-dark to-brand text-white">
      <div className="container grid gap-8 py-12 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p>
            <Wordmark className="text-3xl" />
          </p>
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
          <a
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold text-[#1877f2] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            href={facebookUrl || FACEBOOK_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Facebook aria-hidden className="size-5" />
            Theo dõi trên Facebook
          </a>
          <div className="flex flex-wrap gap-2">
            <SocialLink href={shopeeUrl} label="Shopee" />
            <SocialLink href={tiktokUrl} label="TikTok" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/20 py-4 text-center text-sm text-white/80">
        © {new Date().getFullYear()} {siteName}
      </div>
    </footer>
  )
}
