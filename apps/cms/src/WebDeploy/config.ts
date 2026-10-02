import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

// Tracks pending content changes and triggers a rebuild of the static web site on demand,
// so editors can batch many edits into a single Render build.
export const WebDeploy: GlobalConfig = {
  slug: 'web-deploy',
  label: 'Cập nhật website',
  admin: {
    hidden: true,
  },
  access: {
    read: authenticated,
    // Only written by hooks and the deploy endpoint through the Local API
    update: () => false,
  },
  fields: [
    {
      name: 'lastChangedAt',
      type: 'date',
      label: 'Lần sửa nội dung gần nhất',
    },
    {
      name: 'lastDeployRequestedAt',
      type: 'date',
      label: 'Lần yêu cầu cập nhật website gần nhất',
    },
  ],
  endpoints: [
    {
      // POST /api/globals/web-deploy/deploy
      path: '/deploy',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
        }

        const hookUrl = process.env.WEB_DEPLOY_HOOK_URL
        if (!hookUrl) {
          return Response.json(
            { message: 'Chưa cấu hình WEB_DEPLOY_HOOK_URL nên không thể cập nhật website.' },
            { status: 500 },
          )
        }

        // Taken before calling the hook so edits made while the request is in flight stay pending
        const requestedAt = new Date().toISOString()
        const { logger } = req.payload

        try {
          const res = await fetch(hookUrl, { method: 'POST' })
          if (!res.ok) {
            logger.error(`Web deploy hook responded with status ${res.status}`)
            return Response.json(
              { message: `Render từ chối yêu cầu (mã lỗi ${res.status}). Vui lòng thử lại sau.` },
              { status: 502 },
            )
          }
        } catch (err: unknown) {
          logger.error({ err }, 'Web deploy hook request failed')
          return Response.json(
            { message: 'Không gửi được yêu cầu tới Render. Vui lòng thử lại sau.' },
            { status: 502 },
          )
        }

        logger.info(`Web deploy requested by user ${req.user.id}`)

        await req.payload.updateGlobal({
          slug: 'web-deploy',
          data: { lastDeployRequestedAt: requestedAt },
          req,
        })

        return Response.json({ lastDeployRequestedAt: requestedAt })
      },
    },
  ],
}
