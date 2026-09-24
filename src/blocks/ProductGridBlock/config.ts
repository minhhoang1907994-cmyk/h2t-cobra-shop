import type { Block } from 'payload'

export const ProductGridBlock: Block = {
  slug: 'productGrid',
  interfaceName: 'ProductGridBlock',
  labels: {
    singular: 'Lưới sản phẩm',
    plural: 'Lưới sản phẩm',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Tiêu đề',
    },
    {
      name: 'populateBy',
      type: 'select',
      label: 'Lấy sản phẩm theo',
      defaultValue: 'featured',
      options: [
        { label: 'Sản phẩm nổi bật', value: 'featured' },
        { label: 'Danh mục', value: 'category' },
        { label: 'Sản phẩm mới nhất', value: 'latest' },
        { label: 'Chọn thủ công', value: 'selection' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      label: 'Danh mục',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'category',
      },
    },
    {
      name: 'selectedProducts',
      type: 'relationship',
      label: 'Sản phẩm',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Số lượng tối đa',
      defaultValue: 8,
      min: 1,
      max: 24,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy !== 'selection',
        step: 1,
      },
    },
    {
      name: 'showViewAll',
      type: 'checkbox',
      label: 'Hiện nút "Xem tất cả"',
      defaultValue: true,
    },
  ],
}
