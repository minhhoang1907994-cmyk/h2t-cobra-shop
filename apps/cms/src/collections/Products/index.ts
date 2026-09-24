import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { deployWebAfterChange, deployWebAfterDelete } from '../../hooks/triggerWebDeploy'
import { validateHexColor, validateHttpsUrl } from '../../utilities/validateUrl'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  labels: {
    singular: 'Sản phẩm',
    plural: 'Sản phẩm',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    price: true,
    compareAtPrice: true,
    priceNote: true,
    gallery: true,
    categories: true,
  },
  admin: {
    defaultColumns: ['title', 'price', 'categories', 'isFeatured', '_status', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên sản phẩm',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin',
          fields: [
            {
              name: 'gallery',
              type: 'upload',
              label: 'Hình ảnh',
              relationTo: 'media',
              hasMany: true,
              required: true,
              admin: {
                description: 'Ảnh đầu tiên được dùng làm ảnh đại diện của sản phẩm.',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Mô tả ngắn',
              maxLength: 300,
              admin: {
                description: 'Hiển thị trên thẻ sản phẩm ở danh sách (tối đa 300 ký tự).',
              },
            },
            {
              name: 'features',
              type: 'array',
              label: 'Điểm nổi bật',
              labels: {
                singular: 'Điểm nổi bật',
                plural: 'Điểm nổi bật',
              },
              admin: {
                description: 'Ví dụ: Nhựa cao cấp, Khớp flexi linh hoạt, Quà tặng dễ thương...',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Nội dung',
                  required: true,
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Mô tả chi tiết',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
            },
            {
              name: 'videoUrls',
              type: 'array',
              label: 'Video',
              labels: {
                singular: 'Video',
                plural: 'Video',
              },
              admin: {
                description: 'Link video TikTok / Facebook Reels / YouTube.',
              },
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  label: 'Link video',
                  required: true,
                  validate: validateHttpsUrl,
                },
              ],
            },
          ],
        },
        {
          label: 'Giá & màu sắc',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  label: 'Giá bán (VNĐ)',
                  min: 0,
                },
                {
                  name: 'compareAtPrice',
                  type: 'number',
                  label: 'Giá gốc (VNĐ)',
                  min: 0,
                  admin: {
                    description: 'Nếu lớn hơn giá bán sẽ hiển thị dạng giá gạch ngang.',
                  },
                },
              ],
            },
            {
              name: 'priceNote',
              type: 'text',
              label: 'Ghi chú giá',
              admin: {
                description: 'Hiển thị khi không nhập giá, ví dụ: "Liên hệ".',
              },
            },
            {
              name: 'colors',
              type: 'array',
              label: 'Màu sắc',
              labels: {
                singular: 'Màu',
                plural: 'Màu',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Tên màu',
                      required: true,
                    },
                    {
                      name: 'hex',
                      type: 'text',
                      label: 'Mã màu',
                      validate: validateHexColor,
                      admin: {
                        placeholder: '#FF6600',
                      },
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  label: 'Ảnh màu này',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        {
          label: 'Link mua hàng',
          fields: [
            {
              name: 'shopeeUrl',
              type: 'text',
              label: 'Link Shopee',
              validate: validateHttpsUrl,
            },
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'Link Facebook',
              validate: validateHttpsUrl,
              admin: {
                description:
                  'Link bài viết hoặc Messenger. Để trống sẽ dùng link Fanpage trong Cài đặt chung.',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      label: 'Danh mục',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Sản phẩm nổi bật',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Hiển thị ở trang chủ.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Ngày đăng',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [deployWebAfterChange],
    afterDelete: [deployWebAfterDelete],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
}
