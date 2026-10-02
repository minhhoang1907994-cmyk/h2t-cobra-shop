'use client'

import { Button, toast, useConfig, useDocumentEvents } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import type { WebDeploy } from '@/payload-types'

import './index.scss'

const baseClass = 'web-deploy-status'

type Status = Pick<WebDeploy, 'lastChangedAt' | 'lastDeployRequestedAt'>

const formatTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Asia/Ho_Chi_Minh',
      })
    : null

// Header action: shows whether saved content is not on the static web site yet
// and lets editors rebuild the site once after a batch of edits.
export const WebDeployStatus = () => {
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()
  const pathname = usePathname()
  const { mostRecentUpdate } = useDocumentEvents()
  const [status, setStatus] = useState<Status | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const endpoint = `${serverURL}${api}/globals/web-deploy`

  const fetchStatus = useCallback(async (): Promise<Status | null> => {
    try {
      const res = await fetch(`${endpoint}?depth=0`, { credentials: 'include' })
      return res.ok ? ((await res.json()) as Status) : null
    } catch {
      // Keep the last known status; the next navigation or focus retries
      return null
    }
  }, [endpoint])

  // Refresh after navigating, after a document is saved, and when the tab regains focus
  useEffect(() => {
    let cancelled = false
    const refresh = () =>
      fetchStatus().then((next) => {
        if (!cancelled && next) setStatus(next)
      })

    void refresh()
    window.addEventListener('focus', refresh)
    return () => {
      cancelled = true
      window.removeEventListener('focus', refresh)
    }
  }, [fetchStatus, pathname, mostRecentUpdate])

  const handleDeploy = async () => {
    setIsSubmitting(true)

    try {
      const res = await fetch(`${endpoint}/deploy`, { method: 'POST', credentials: 'include' })
      const body = (await res.json().catch(() => ({}))) as {
        lastDeployRequestedAt?: string
        message?: string
      }

      if (!res.ok) {
        toast.error(body.message || 'Không cập nhật được website. Vui lòng thử lại sau.')
        return
      }

      toast.success('Đã gửi yêu cầu. Website sẽ được cập nhật sau vài phút.')
      setStatus((prev) => ({ ...prev, lastDeployRequestedAt: body.lastDeployRequestedAt }))
    } catch {
      toast.error('Không kết nối được tới máy chủ. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const lastChangedAt = status?.lastChangedAt
  const lastDeployRequestedAt = status?.lastDeployRequestedAt
  const hasPendingChanges = Boolean(
    lastChangedAt &&
      (!lastDeployRequestedAt || new Date(lastChangedAt) > new Date(lastDeployRequestedAt)),
  )
  const tooltip = [
    `Sửa nội dung gần nhất: ${formatTime(lastChangedAt) ?? 'chưa có'}`,
    `Gửi cập nhật gần nhất: ${formatTime(lastDeployRequestedAt) ?? 'chưa gửi lần nào'}`,
    'Website cần vài phút để cập nhật xong.',
  ].join('\n')

  return (
    <div className={baseClass}>
      {status && (
        <span
          className={`${baseClass}__badge ${baseClass}__badge--${hasPendingChanges ? 'pending' : 'synced'}`}
          title={tooltip}
        >
          <span className={`${baseClass}__label`}>
            {hasPendingChanges ? 'Có thay đổi chưa lên web' : 'Website đã mới nhất'}
          </span>
        </span>
      )}
      <Button
        buttonStyle={hasPendingChanges ? 'primary' : 'secondary'}
        disabled={isSubmitting}
        margin={false}
        onClick={handleDeploy}
        size="small"
        tooltip={tooltip}
      >
        {isSubmitting ? 'Đang gửi...' : 'Cập nhật website'}
      </Button>
    </div>
  )
}
