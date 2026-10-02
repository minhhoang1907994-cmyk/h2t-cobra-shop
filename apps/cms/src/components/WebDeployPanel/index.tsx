import type { Payload } from 'payload'
import React from 'react'

import { WebDeployButton } from './WebDeployButton'
import './index.scss'

const baseClass = 'web-deploy-panel'

const formatTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Asia/Ho_Chi_Minh',
      })
    : null

const GlobeIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

export const WebDeployPanel = async ({ payload }: { payload: Payload }) => {
  const { lastChangedAt, lastDeployRequestedAt } = await payload.findGlobal({ slug: 'web-deploy' })

  const hasPendingChanges = Boolean(
    lastChangedAt &&
      (!lastDeployRequestedAt || new Date(lastChangedAt) > new Date(lastDeployRequestedAt)),
  )

  return (
    <section className={baseClass}>
      <div className={`${baseClass}__header`}>
        <div className={`${baseClass}__icon`}>
          <GlobeIcon />
        </div>
        <div className={`${baseClass}__heading`}>
          <div className={`${baseClass}__title-row`}>
            <h3 className={`${baseClass}__title`}>Cập nhật website</h3>
            <span
              className={`${baseClass}__status ${baseClass}__status--${hasPendingChanges ? 'pending' : 'synced'}`}
            >
              {hasPendingChanges ? 'Có thay đổi chưa cập nhật' : 'Website đã mới nhất'}
            </span>
          </div>
          <p className={`${baseClass}__description`}>
            {hasPendingChanges
              ? 'Các thay đổi đã lưu nhưng khách chưa thấy. Sửa xong hết rồi bấm "Cập nhật website" một lần.'
              : 'Mọi thay đổi đã được gửi lên website. Khi sửa sản phẩm, danh mục hoặc Cài đặt chung, nhớ quay lại đây để cập nhật.'}
          </p>
        </div>
      </div>

      <div className={`${baseClass}__footer`}>
        <dl className={`${baseClass}__stats`}>
          <div className={`${baseClass}__stat`}>
            <dt>Sửa nội dung gần nhất</dt>
            <dd>{formatTime(lastChangedAt) ?? 'Chưa có'}</dd>
          </div>
          <div className={`${baseClass}__stat`}>
            <dt>Gửi cập nhật gần nhất</dt>
            <dd>{formatTime(lastDeployRequestedAt) ?? 'Chưa gửi lần nào'}</dd>
          </div>
        </dl>
        <div className={`${baseClass}__action`}>
          <WebDeployButton hasPendingChanges={hasPendingChanges} />
          <span className={`${baseClass}__hint`}>Website cần vài phút để cập nhật xong.</span>
        </div>
      </div>
    </section>
  )
}
