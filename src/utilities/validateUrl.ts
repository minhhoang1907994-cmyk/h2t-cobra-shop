export const validateHttpsUrl = (value: string | null | undefined): true | string => {
  if (!value) return true

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return 'Link phải bắt đầu bằng https://'
  } catch {
    return 'Link không hợp lệ'
  }

  return true
}

export const validateHexColor = (value: string | null | undefined): true | string => {
  if (!value) return true

  return /^#[0-9a-fA-F]{6}$/.test(value) || 'Mã màu phải có dạng #RRGGBB, ví dụ #FF6600'
}
