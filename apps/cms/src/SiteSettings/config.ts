import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { deployWebAfterGlobalChange } from '@/hooks/triggerWebDeploy'
import { validateHttpsUrl } from '@/utilities/validateUrl'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cài đặt chung',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin shop',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Tên shop',
              required: true,
              defaultValue: 'H2T Cobra',
            },
            {
              name: 'logo',
              type: 'upload',
              label: 'Logo',
              relationTo: 'media',
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Slogan',
            },
            {
              name: 'hashtags',
              type: 'text',
              label: 'Hashtag',
              hasMany: true,
              admin: {
                description: 'Ví dụ: #H2TCOBRA, #H2T3DHUE, #MINIFLEXI',
              },
            },
          ],
        },
        {
          label: 'Trang chủ',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Tiêu đề banner',
              admin: {
                placeholder: 'Mô hình in 3D Flexi — khớp cử động',
              },
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              label: 'Mô tả banner',
            },
            {
              name: 'heroImage',
              type: 'upload',
              label: 'Ảnh banner',
              relationTo: 'media',
            },
            {
              name: 'highlights',
              type: 'array',
              label: 'Điểm nổi bật của shop',
              labels: {
                singular: 'Điểm nổi bật',
                plural: 'Điểm nổi bật',
              },
              maxRows: 6,
              admin: {
                description: 'Ví dụ: Nhựa cao cấp — Bền đẹp, chắc chắn.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Tiêu đề',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'text',
                      label: 'Mô tả',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Kênh bán hàng & liên hệ',
          fields: [
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'Link Fanpage Facebook',
              validate: validateHttpsUrl,
            },
            {
              name: 'messengerUrl',
              type: 'text',
              label: 'Link Messenger',
              validate: validateHttpsUrl,
              admin: {
                placeholder: 'https://m.me/...',
              },
            },
            {
              name: 'shopeeUrl',
              type: 'text',
              label: 'Link shop Shopee',
              validate: validateHttpsUrl,
            },
            {
              name: 'tiktokUrl',
              type: 'text',
              label: 'Link TikTok',
              validate: validateHttpsUrl,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Số điện thoại',
                },
                {
                  name: 'zalo',
                  type: 'text',
                  label: 'Số Zalo',
                },
              ],
            },
            {
              name: 'address',
              type: 'text',
              label: 'Địa chỉ',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [deployWebAfterGlobalChange],
  },
}
