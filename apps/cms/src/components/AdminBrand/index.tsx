import Image from 'next/image'
import React from 'react'

import './index.scss'

const LOGO_SRC = '/brand/logo-square.webp'

// Login / create-first-user screen
export const AdminLogo = () => (
  <div className="admin-brand-logo">
    <Image
      alt="H2T Cobra"
      className="admin-brand-logo__image"
      height={96}
      src={LOGO_SRC}
      width={96}
    />
    <div>
      <div className="admin-brand-logo__name">H2T Cobra</div>
      <div className="admin-brand-logo__tagline">Quản trị nội dung website</div>
    </div>
  </div>
)

// Top-left of the admin header
export const AdminIcon = () => (
  <Image alt="H2T Cobra" className="admin-brand-icon" height={32} src={LOGO_SRC} width={32} />
)
