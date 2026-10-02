import type { Payload } from 'payload'
import { Gutter } from '@payloadcms/ui'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Media, User } from '@/payload-types'
import { getWebURL } from '@/utilities/getDocPath'

import './index.scss'

const baseClass = 'h2t-dashboard'

const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const formatTime = (value: string) =>
  new Date(value).toLocaleString('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  })

// Icons from lucide (https://lucide.dev), inlined so the CMS needs no icon dependency
const icons = {
  package: (
    <>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  draft: (
    <>
      <path d="M12 20h9" />
      <path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z" />
    </>
  ),
  folder: (
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  ),
  image: (
    <>
      <rect height="18" rx="2" width="18" x="3" y="3" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
    </>
  ),
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  external: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
}

const Icon = ({ name }: { name: keyof typeof icons }) => (
  <svg
    aria-hidden="true"
    className={`${baseClass}__icon`}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    {icons[name]}
  </svg>
)

const getThumbnail = (gallery: (number | Media)[] | undefined) => {
  const first = gallery?.[0]
  if (!first || typeof first === 'number') return null
  return first.sizes?.thumbnail?.url || first.url || null
}

// Replaces Payload's default dashboard (registered as admin.components.views.dashboard)
export const Dashboard = async ({ payload, user }: { payload: Payload; user?: User | null }) => {
  const adminRoute = payload.config.routes.admin
  const webURL = getWebURL()

  const [published, drafts, categories, media, recent] = await Promise.all([
    payload.count({ collection: 'products', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'products', where: { _status: { equals: 'draft' } } }),
    payload.count({ collection: 'categories' }),
    payload.count({ collection: 'media' }),
    payload.find({
      collection: 'products',
      depth: 1,
      limit: 6,
      select: {
        gallery: true,
        price: true,
        slug: true,
        title: true,
        updatedAt: true,
        _status: true,
      },
      sort: '-updatedAt',
    }),
  ])

  const stats = [
    {
      href: `${adminRoute}/collections/products?where[_status][equals]=published`,
      icon: 'package' as const,
      label: 'Sản phẩm đang hiển thị',
      value: published.totalDocs,
    },
    {
      href: `${adminRoute}/collections/products?where[_status][equals]=draft`,
      icon: 'draft' as const,
      label: 'Bản nháp',
      value: drafts.totalDocs,
    },
    {
      href: `${adminRoute}/collections/categories`,
      icon: 'folder' as const,
      label: 'Danh mục',
      value: categories.totalDocs,
    },
    {
      href: `${adminRoute}/collections/media`,
      icon: 'image' as const,
      label: 'Ảnh đã tải lên',
      value: media.totalDocs,
    },
  ]

  return (
    <Gutter className={baseClass}>
      <header className={`${baseClass}__intro`}>
        <div>
          <h1 className={`${baseClass}__title`}>Xin chào{user?.name ? `, ${user.name}` : ''} 👋</h1>
          <p className={`${baseClass}__subtitle`}>
            Quản lý sản phẩm, danh mục và nội dung trang chủ của H2T Cobra.
          </p>
        </div>
        <div className={`${baseClass}__intro-actions`}>
          <a
            className={`${baseClass}__button ${baseClass}__button--outline`}
            href={webURL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon name="external" />
            Xem website
          </a>
          <Link
            className={`${baseClass}__button ${baseClass}__button--primary`}
            href={`${adminRoute}/collections/products/create`}
          >
            <Icon name="plus" />
            Thêm sản phẩm
          </Link>
        </div>
      </header>

      <section className={`${baseClass}__stats`}>
        {stats.map((stat) => (
          <Link className={`${baseClass}__stat`} href={stat.href} key={stat.label}>
            <div className={`${baseClass}__stat-head`}>
              <span>{stat.label}</span>
              <Icon name={stat.icon} />
            </div>
            <div className={`${baseClass}__stat-value`}>{stat.value}</div>
          </Link>
        ))}
      </section>

      <div className={`${baseClass}__grid`}>
        <section className={`${baseClass}__panel`}>
          <div className={`${baseClass}__panel-head`}>
            <div>
              <h2 className={`${baseClass}__panel-title`}>Sản phẩm sửa gần đây</h2>
              <p className={`${baseClass}__panel-desc`}>6 sản phẩm được cập nhật mới nhất</p>
            </div>
            <Link className={`${baseClass}__link`} href={`${adminRoute}/collections/products`}>
              Xem tất cả
            </Link>
          </div>

          {recent.docs.length === 0 ? (
            <p className={`${baseClass}__empty`}>Chưa có sản phẩm nào.</p>
          ) : (
            <ul className={`${baseClass}__list`}>
              {recent.docs.map((product) => {
                const thumbnail = getThumbnail(product.gallery)
                const isPublished = product._status === 'published'

                return (
                  <li key={product.id}>
                    <Link
                      className={`${baseClass}__row`}
                      href={`${adminRoute}/collections/products/${product.id}`}
                    >
                      <div className={`${baseClass}__thumb`}>
                        {thumbnail && (
                          <Image alt="" height={40} src={thumbnail} unoptimized width={40} />
                        )}
                      </div>
                      <div className={`${baseClass}__row-main`}>
                        <span className={`${baseClass}__row-title`}>{product.title}</span>
                        <span className={`${baseClass}__row-meta`}>
                          Sửa lúc {formatTime(product.updatedAt)}
                        </span>
                      </div>
                      <span className={`${baseClass}__price`}>
                        {typeof product.price === 'number'
                          ? priceFormatter.format(product.price)
                          : '—'}
                      </span>
                      <span
                        className={`${baseClass}__badge ${baseClass}__badge--${isPublished ? 'published' : 'draft'}`}
                      >
                        {isPublished ? 'Đang hiển thị' : 'Bản nháp'}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className={`${baseClass}__panel`}>
          <div className={`${baseClass}__panel-head`}>
            <div>
              <h2 className={`${baseClass}__panel-title`}>Thao tác nhanh</h2>
              <p className={`${baseClass}__panel-desc`}>Những việc hay làm</p>
            </div>
          </div>
          <nav className={`${baseClass}__shortcuts`}>
            <Link href={`${adminRoute}/collections/products/create`}>
              <Icon name="package" />
              <span>
                <strong>Thêm sản phẩm</strong>
                <small>Ảnh, giá, link Shopee/Facebook</small>
              </span>
            </Link>
            <Link href={`${adminRoute}/collections/categories/create`}>
              <Icon name="folder" />
              <span>
                <strong>Thêm danh mục</strong>
                <small>Nhóm sản phẩm theo loại</small>
              </span>
            </Link>
            <Link href={`${adminRoute}/collections/media`}>
              <Icon name="image" />
              <span>
                <strong>Thư viện ảnh</strong>
                <small>Tải và quản lý ảnh</small>
              </span>
            </Link>
            <Link href={`${adminRoute}/globals/site-settings`}>
              <Icon name="settings" />
              <span>
                <strong>Cài đặt chung</strong>
                <small>Trang chủ, liên hệ, logo</small>
              </span>
            </Link>
          </nav>
          <p className={`${baseClass}__tip`}>
            Sau khi sửa xong, bấm <strong>Cập nhật website</strong> ở góc phải phía trên để khách
            thấy thay đổi.
          </p>
        </section>
      </div>
    </Gutter>
  )
}
