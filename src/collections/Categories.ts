import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Danh mục',
    plural: 'Danh mục',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'sortOrder', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên danh mục',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Ảnh danh mục',
      relationTo: 'media',
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Thứ tự hiển thị',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Số nhỏ hiển thị trước.',
      },
    },
    slugField({
      position: undefined,
    }),
  ],
}
