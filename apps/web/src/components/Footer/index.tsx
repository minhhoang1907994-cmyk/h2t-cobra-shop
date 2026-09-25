import { Facebook, MapPin, Phone, ShoppingBag } from 'lucide-react'
import React from 'react'

import type { SiteSetting } from '@cms/payload-types'

import { Wordmark } from '@/components/Wordmark'
import { FACEBOOK_URL } from '@/utilities/site'
import { cn } from '@/utilities/ui'

const HEADING_CLASS = 'text-sm font-black uppercase tracking-wider text-brand-dark/70'

// lucide-react has no TikTok icon; drawn in the same stroke style
const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

// Square outlined icon button, like the social row of common shop footers
const SocialButton: React.FC<{
  children: React.ReactNode
  className?: string
  href?: string | null
  label: string
}> = ({ children, className, href, label }) => (
  <a
    aria-label={label}
    className={cn(
      'flex size-11 items-center justify-center rounded-xl border-2 border-brand-dark/25 bg-white/60 text-brand-dark shadow-sm transition hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:shadow-lg',
      className,
    )}
    href={href || '#'}
    title={label}
    {...(href ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
  >
    {children}
  </a>
)

export const Footer: React.FC<{ settings: SiteSetting }> = ({ settings }) => {
  const { address, facebookUrl, hashtags, phone, shopeeUrl, siteName, tagline, tiktokUrl, zalo } =
    settings

  return (
    <footer className="mt-auto bg-gradient-to-br from-[#fff4e2] via-[#fdecd0] to-[#f8d8a8] text-foreground">
      <div aria-hidden className="h-1 bg-gradient-to-r from-brand via-sunny to-accent" />
      <div className="container grid gap-10 py-12 md:grid-cols-3 md:gap-8">
        <div className="flex flex-col gap-3">
          <p>
            <Wordmark className="text-3xl" />
          </p>
          {tagline && <p className="text-muted-foreground">{tagline}</p>}
          {hashtags && hashtags.length > 0 && (
            <p className="text-sm font-bold text-accent">{hashtags.join('  ')}</p>
          )}
        </div>

        {(phone || zalo || address) && (
          <div className="flex flex-col gap-3">
            <h2 className={HEADING_CLASS}>Liên hệ</h2>
            {(phone || zalo) && (
              <p className="flex items-center gap-2">
                <Phone aria-hidden className="size-4 shrink-0 text-accent" />
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
              <p className="flex items-start gap-2">
                <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
                {address}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap content-start gap-3 md:col-start-3 md:justify-end">
          <SocialButton
            className="hover:bg-[#1877f2]"
            href={facebookUrl || FACEBOOK_URL}
            label="Facebook"
          >
            <Facebook aria-hidden className="size-5" />
          </SocialButton>
          {/* TODO: Shopee shop link not provided yet — the button stays inert until "Shopee" is set in Cài đặt chung */}
          <SocialButton className="hover:bg-[#ee4d2d]" href={shopeeUrl} label="Shopee">
            <ShoppingBag aria-hidden className="size-5" />
          </SocialButton>
          {tiktokUrl && (
            <SocialButton className="hover:bg-black" href={tiktokUrl} label="TikTok">
              <TikTokIcon className="size-5" />
            </SocialButton>
          )}
        </div>
      </div>
      <div className="border-t border-brand-dark/10 py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {siteName}
      </div>
    </footer>
  )
}
