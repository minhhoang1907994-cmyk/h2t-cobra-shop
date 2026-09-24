import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

// Calls the Render Deploy Hook of the static web site so it is rebuilt with the latest content.
const triggerWebDeploy = (req: PayloadRequest, reason: string) => {
  const hookUrl = process.env.WEB_DEPLOY_HOOK_URL

  if (!hookUrl || req.context.disableWebDeploy) return

  const { logger } = req.payload
  logger.info(`Triggering web deploy: ${reason}`)

  // Fire and forget so saving in the admin is not blocked by the deploy request
  fetch(hookUrl, { method: 'POST' })
    .then((res) => {
      if (!res.ok) logger.error(`Web deploy hook responded with status ${res.status}`)
    })
    .catch((err: unknown) => {
      logger.error({ err }, 'Web deploy hook request failed')
    })
}

export const deployWebAfterChange: CollectionAfterChangeHook = ({
  collection,
  doc,
  previousDoc,
  req,
}) => {
  const hasDrafts = Boolean(collection.versions && collection.versions.drafts)
  const isPublished = doc?._status === 'published'
  const wasPublished = previousDoc?._status === 'published'

  // Unpublished drafts are not visible on the web site, so they do not need a rebuild
  if (!hasDrafts || isPublished || wasPublished) {
    triggerWebDeploy(req, `${collection.slug} ${doc.id} changed`)
  }

  return doc
}

export const deployWebAfterDelete: CollectionAfterDeleteHook = ({ collection, doc, req }) => {
  triggerWebDeploy(req, `${collection.slug} ${doc?.id} deleted`)

  return doc
}

export const deployWebAfterGlobalChange: GlobalAfterChangeHook = ({ doc, global, req }) => {
  triggerWebDeploy(req, `global ${global.slug} changed`)

  return doc
}
