import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

// Records that the static web site is out of date. The rebuild itself is triggered manually
// from the admin dashboard (see WebDeploy global), so many edits share a single build.
const markWebChanged = async (req: PayloadRequest, reason: string) => {
  if (req.context.disableWebDeploy) return

  req.payload.logger.info(`Web content changed: ${reason}`)

  await req.payload.updateGlobal({
    slug: 'web-deploy',
    data: { lastChangedAt: new Date().toISOString() },
    req,
  })
}

export const markWebChangedAfterChange: CollectionAfterChangeHook = async ({
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
    await markWebChanged(req, `${collection.slug} ${doc.id} changed`)
  }

  return doc
}

export const markWebChangedAfterDelete: CollectionAfterDeleteHook = async ({
  collection,
  doc,
  req,
}) => {
  await markWebChanged(req, `${collection.slug} ${doc?.id} deleted`)

  return doc
}

export const markWebChangedAfterGlobalChange: GlobalAfterChangeHook = async ({
  doc,
  global,
  req,
}) => {
  await markWebChanged(req, `global ${global.slug} changed`)

  return doc
}
