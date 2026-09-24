import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center gap-6 py-24 text-center">
      <p className="text-7xl font-black text-brand">404</p>
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="text-muted-foreground">Sản phẩm có thể đã ngừng bán hoặc đường dẫn không đúng.</p>
      <Link
        className="rounded-full bg-brand px-6 py-3 font-bold text-white transition hover:brightness-110"
        href="/san-pham/"
      >
        Xem sản phẩm khác
      </Link>
    </div>
  )
}
