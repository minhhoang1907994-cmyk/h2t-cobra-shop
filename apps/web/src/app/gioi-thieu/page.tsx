import type { Metadata } from 'next'

import Link from 'next/link'
import {
  Box,
  Facebook,
  House,
  MapPin,
  MessageCircle,
  Phone,
  Settings,
  ShoppingBag,
  Sparkles,
  ToyBrick,
  Truck,
} from 'lucide-react'
import React from 'react'

import { Wordmark } from '@/components/Wordmark'
import { getSiteSettings } from '@/lib/cms'
import { FACEBOOK_URL } from '@/utilities/site'

const SERVICES = [
  {
    icon: Box,
    title: 'In 3D theo yêu cầu',
    description: 'Gửi ý tưởng, hình ảnh hoặc file 3D — H2T Cobra in ra sản phẩm thật cho bạn.',
  },
  {
    icon: ToyBrick,
    title: 'Mô hình',
    description: 'Mô hình trưng bày, nhân vật và mô hình Flexi khớp cử động, uốn lượn như thật.',
  },
  {
    icon: House,
    title: 'Decor',
    description: 'Chậu cây, đèn, vật trang trí giúp góc học tập, làm việc hay phòng khách thêm cá tính.',
  },
  {
    icon: Settings,
    title: 'Phụ kiện',
    description: 'Móc khóa, giá đỡ và các món phụ kiện nhỏ gọn, tiện dụng cho cuộc sống hằng ngày.',
  },
]

const STEPS = [
  { title: 'Gửi ý tưởng', description: 'Nhắn tin kèm hình ảnh, mô tả hoặc file 3D bạn muốn in.' },
  { title: 'Tư vấn & báo giá', description: 'Trao đổi về kích thước, màu sắc, chất liệu và chi phí.' },
  { title: 'In & giao hàng', description: 'Sản xuất tại Huế và gửi hàng đến bạn trên toàn quốc.' },
]

export default async function AboutPage() {
  const { address, facebookUrl, messengerUrl, phone, shopeeUrl, tagline, zalo } =
    await getSiteSettings()

  const contactUrl = messengerUrl || facebookUrl || FACEBOOK_URL

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(30_143_255/0.16),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(255_122_26/0.16),transparent_55%)]"
        />
        <div className="container relative grid items-center gap-10 py-12 md:grid-cols-[1fr_auto] md:py-16">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">
              <Sparkles aria-hidden className="size-4 text-accent" />
              Giới thiệu
            </span>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Về <Wordmark className="align-baseline" />
            </h1>
            <p className="text-brand-gradient w-fit text-2xl font-black md:text-3xl">
              Ý tưởng của bạn — thành hiện thực
            </p>
            <p className="max-w-2xl text-lg text-muted-foreground">
              H2T Cobra thiết kế và sản xuất sản phẩm in 3D tại TP. Huế. Chúng tôi nhận in 3D theo yêu cầu
              và làm ra những món mô hình, đồ decor, phụ kiện từ nhựa in 3D — từ ý tưởng trên giấy đến sản
              phẩm cầm được trên tay. Nhận đơn và giao hàng trên toàn quốc.
            </p>
            {tagline && <p className="max-w-2xl text-lg text-muted-foreground">{tagline}</p>}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export has no image optimizer */}
          <img
            alt="Logo H2T Cobra"
            className="mx-auto size-56 rounded-3xl shadow-2xl shadow-brand/30 md:size-64"
            height={256}
            src="/brand/logo-square.webp"
            width={256}
          />
        </div>
      </section>

      <section className="container">
        <h2 className="mb-6 text-2xl font-black md:text-3xl">Chúng tôi làm gì</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ description, icon: Icon, title }) => (
            <li
              className="flex flex-col gap-3 rounded-3xl border-2 border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
              key={title}
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="text-lg font-black">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container mt-16">
        <h2 className="mb-6 text-2xl font-black md:text-3xl">Đặt in theo yêu cầu</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li className="flex gap-4 rounded-3xl border-2 border-border bg-card p-6" key={step.title}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent font-black text-white">
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-black">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-center gap-2 font-bold text-brand">
          <Truck aria-hidden className="size-5" />
          Thiết kế & sản xuất 3D tại Huế • Nhận đơn toàn quốc
        </p>
      </section>

      <section className="container mt-16 mb-24">
        <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-brand-dark to-brand p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-black md:text-3xl">Liên hệ với H2T Cobra</h2>
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
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#1877f2] shadow-lg shadow-black/20 transition hover:brightness-95"
              href={contactUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {messengerUrl ? (
                <MessageCircle aria-hidden className="size-5" />
              ) : (
                <Facebook aria-hidden className="size-5" />
              )}
              Nhắn tin qua Facebook
            </a>
            {shopeeUrl && (
              <a
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-black/20 transition hover:brightness-110"
                href={shopeeUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ShoppingBag aria-hidden className="size-5" />
                Mua trên Shopee
              </a>
            )}
            <Link
              className="inline-flex items-center rounded-full border-2 border-white/60 px-6 py-3 font-bold transition hover:bg-white/10"
              href="/san-pham/"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description:
    'H2T Cobra — thiết kế & sản xuất in 3D tại Huế: in 3D theo yêu cầu, mô hình, decor, phụ kiện. Nhận đơn toàn quốc.',
  alternates: {
    canonical: '/gioi-thieu/',
  },
}
