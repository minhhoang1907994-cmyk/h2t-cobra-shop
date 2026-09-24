import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { validateHttpsUrl } from '@/utilities/validateUrl'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cài đặt chung',
  access: {
    read: () => true,
    update: authenticated,
  },
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
      type: 'collapsible',
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
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
