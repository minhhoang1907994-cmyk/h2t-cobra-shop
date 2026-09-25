import type { Metadata } from 'next'

import { Montserrat, Nunito } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSiteSettings } from '@/lib/cms'
import { getSiteURL, SITE_DESCRIPTION, SITE_NAME } from '@/utilities/site'

import './globals.css'

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-nunito',
  display: 'swap',
})

// Only used by the "H2TCOBRA" wordmark, to match the geometric lettering of the logo
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '800',
  variable: '--font-montserrat',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html className={`${nunito.variable} ${montserrat.variable}`} lang="vi">
      <body>
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { logo } = await getSiteSettings()

  // Tab icon follows the header logo: the "Logo" uploaded in Cài đặt chung, else the bundled one
  const logoIconUrl =
    logo && typeof logo === 'object' ? logo.sizes?.square?.url || logo.url : undefined

  return {
    ...metadata,
    icons: logoIconUrl ? { icon: logoIconUrl, apple: logoIconUrl } : metadata.icons,
  }
}

const metadata: Metadata = {
  metadataBase: new URL(getSiteURL()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
  },
}
