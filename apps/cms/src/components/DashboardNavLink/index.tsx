'use client'

import { Link, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React from 'react'

import './index.scss'

// Sidebar link back to the dashboard. Payload only links the header icon there,
// which editors do not notice. Markup mirrors Payload's own nav links.
export const DashboardNavLink = () => {
  const {
    config: {
      routes: { admin },
    },
  } = useConfig()
  const pathname = usePathname()
  const isActive = pathname === admin

  const label = (
    <>
      {isActive && <div className="nav__link-indicator" />}
      <span className="nav__link-label">Bảng điều khiển</span>
    </>
  )

  return (
    <div className="dashboard-nav-link">
      {isActive ? (
        <div className="nav__link" id="nav-dashboard">
          {label}
        </div>
      ) : (
        <Link className="nav__link" href={admin} id="nav-dashboard" prefetch={false}>
          {label}
        </Link>
      )}
    </div>
  )
}
