'use client'

import { Button, toast, useConfig } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export const WebDeployButton = ({ hasPendingChanges }: { hasPendingChanges: boolean }) => {
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClick = async () => {
    setIsSubmitting(true)

    try {
      const res = await fetch(`${serverURL}${api}/globals/web-deploy/deploy`, {
        method: 'POST',
        credentials: 'include',
      })
      const body = (await res.json().catch(() => ({}))) as { message?: string }

      if (!res.ok) {
        toast.error(body.message || 'Không cập nhật được website. Vui lòng thử lại sau.')
        return
      }

      toast.success('Đã gửi yêu cầu. Website sẽ được cập nhật sau vài phút.')
      router.refresh()
    } catch {
      toast.error('Không kết nối được tới máy chủ. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      buttonStyle={hasPendingChanges ? 'primary' : 'secondary'}
      disabled={isSubmitting}
      margin={false}
      onClick={handleClick}
      size="medium"
    >
      {isSubmitting ? 'Đang gửi yêu cầu...' : 'Cập nhật website'}
    </Button>
  )
}
