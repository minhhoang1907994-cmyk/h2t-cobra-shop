import { cn } from '@/utilities/ui'
import { getProductPath } from '@/utilities/site'
import React from 'react'

import type { Media as MediaType } from '@cms/payload-types'

import { Media } from '@/components/Media'

// Minimal renderer for the Lexical JSON stored by Payload. It covers the nodes the product
// editor produces; unknown nodes fall back to rendering their children.
type LexicalNode = {
  type: string
  children?: LexicalNode[]
  // text
  text?: string
  format?: number | string
  // heading / list
  tag?: string
  listType?: 'bullet' | 'number' | 'check'
  checked?: boolean
  // link
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: 'custom' | 'internal'
    doc?: { relationTo?: string; value?: { slug?: string } | number }
  }
  // upload
  value?: MediaType | number
}

type RichTextData = { root: { children: unknown[] } }

const TEXT_FORMAT = {
  bold: 1,
  italic: 1 << 1,
  strikethrough: 1 << 2,
  underline: 1 << 3,
  code: 1 << 4,
  subscript: 1 << 5,
  superscript: 1 << 6,
}

const renderText = (node: LexicalNode, key: number) => {
  const format = typeof node.format === 'number' ? node.format : 0
  let content: React.ReactNode = node.text

  if (format & TEXT_FORMAT.code) content = <code>{content}</code>
  if (format & TEXT_FORMAT.subscript) content = <sub>{content}</sub>
  if (format & TEXT_FORMAT.superscript) content = <sup>{content}</sup>
  if (format & TEXT_FORMAT.strikethrough) content = <s>{content}</s>
  if (format & TEXT_FORMAT.underline) content = <u>{content}</u>
  if (format & TEXT_FORMAT.italic) content = <em>{content}</em>
  if (format & TEXT_FORMAT.bold) content = <strong>{content}</strong>

  return <React.Fragment key={key}>{content}</React.Fragment>
}

const getLinkHref = (fields: LexicalNode['fields']) => {
  if (fields?.linkType === 'internal') {
    const value = fields.doc?.value
    return typeof value === 'object' && value?.slug ? getProductPath(value.slug) : undefined
  }

  return fields?.url
}

const renderNodes = (nodes: LexicalNode[] = []): React.ReactNode =>
  nodes.map((node, index) => renderNode(node, index))

const renderNode = (node: LexicalNode, key: number): React.ReactNode => {
  const children = renderNodes(node.children)

  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'linebreak':
      return <br key={key} />
    case 'tab':
      return <React.Fragment key={key}>{'\t'}</React.Fragment>
    case 'paragraph':
      return <p key={key}>{children}</p>
    case 'heading': {
      const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag || '')
        ? node.tag
        : 'h2') as 'h2'
      return <Tag key={key}>{children}</Tag>
    }
    case 'quote':
      return <blockquote key={key}>{children}</blockquote>
    case 'list':
      return node.listType === 'number' ? (
        <ol key={key}>{children}</ol>
      ) : (
        <ul className={node.listType === 'check' ? 'list-none pl-0' : undefined} key={key}>
          {children}
        </ul>
      )
    case 'listitem':
      return (
        <li key={key}>
          {typeof node.checked === 'boolean' && (
            <input checked={node.checked} className="mr-2" disabled readOnly type="checkbox" />
          )}
          {children}
        </li>
      )
    case 'horizontalrule':
      return <hr key={key} />
    case 'link':
    case 'autolink': {
      const href = getLinkHref(node.fields)
      if (!href) return <React.Fragment key={key}>{children}</React.Fragment>

      return (
        <a
          href={href}
          key={key}
          {...(node.fields?.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        >
          {children}
        </a>
      )
    }
    case 'upload':
      return typeof node.value === 'object' && node.value ? (
        <Media
          className="rounded-xl"
          key={key}
          resource={node.value}
          sizes="(max-width: 768px) 100vw, 48rem"
        />
      ) : null
    default:
      return <React.Fragment key={key}>{children}</React.Fragment>
  }
}

export const RichText: React.FC<{ className?: string; data: RichTextData }> = ({
  className,
  data,
}) => (
  <div className={cn('prose max-w-none prose-a:text-brand', className)}>
    {renderNodes(data.root.children as LexicalNode[])}
  </div>
)
