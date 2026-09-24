# H2T Cobra Shop

Site giới thiệu sản phẩm mô hình in 3D (Flexi, khớp cử động) của H2T Cobra (@h2tcobra3dhue).
KHÔNG có giỏ hàng / checkout / thanh toán — nút "Mua" chỉ dẫn link ra Facebook hoặc Shopee.
Người quản trị nội dung là người không biết code → admin UI phải đơn giản, label tiếng Việt.

## Tech Stack
- Language: TypeScript 5.7 (Node.js >=20.9)
- Framework: Next.js 16.3 (App Router) + Payload CMS 3.90 (chạy chung trong 1 app Next.js, scaffold từ template `website`)
- Database: PostgreSQL — Neon (serverless), adapter `@payloadcms/db-postgres`
- Media storage: Backblaze B2 (S3-compatible), adapter `@payloadcms/storage-s3` (chưa cài)
- Rich text: Lexical (`@payloadcms/richtext-lexical`)
- Frontend: React 19 Server Components + Tailwind CSS 4 + shadcn/ui (Radix)
- Package manager: pnpm 10 (pin qua field `packageManager`, chạy bằng corepack)
- Infrastructure: Render (Web Service, Node runtime)
- Architecture: Monolith (Next.js frontend + Payload admin/API trong cùng codebase)

> Version lấy từ `package.json` sau khi scaffold (2026-09-24). Template `website` có sẵn collections `pages`, `posts`, `categories`, `media`, `users` và các plugin SEO, search, redirects, form-builder, nested-docs — cần điều chỉnh theo Domain Model bên dưới.

## Domain Model (dự kiến)

| Collection / Global | Mục đích | Field chính |
|---|---|---|
| `products` | Sản phẩm / combo | `title`, `slug`, `category` (rel), `price`, `compareAtPrice`, `colors` (array: name, hex, image), `gallery` (upload[]), `videoUrls` (TikTok/Reels/YouTube), `shortDescription`, `content` (richText), `features` (array), `facebookUrl`, `shopeeUrl`, `isFeatured`, `_status` (draft/published) |
| `categories` | Danh mục (Biển cả, Khủng long, Combo...) | `title`, `slug`, `image`, `order` |
| `posts` | Blog / tin tức | `title`, `slug`, `coverImage`, `content`, `publishedAt`, `_status` |
| `media` | Ảnh upload (lưu trên B2) | `alt` (bắt buộc), `sizes` (thumbnail/card/og) |
| `users` | Tài khoản admin (auth) | `email`, `name`, `role` (admin/editor) |
| Global `site-settings` | Cấu hình chung | logo, fanpage URL, Shopee shop URL, hotline/Zalo, hashtags, SEO mặc định |
| Global `homepage` | Nội dung trang chủ | banner slides, featured products, featured categories |

## Project Conventions

### Naming
- Components, types, interfaces: PascalCase (`ProductCard`, `ProductGallery`)
- Functions, variables, field names Payload: camelCase (`getProductBySlug`, `facebookUrl`)
- Constants: SCREAMING_SNAKE_CASE (`REVALIDATE_SECONDS`)
- Files/folders: kebab-case (`product-card.tsx`, `site-settings.ts`); riêng config collection: PascalCase (`Products.ts`) theo template Payload
- Collection/global slug: kebab-case số nhiều (`products`, `site-settings`)
- URL route: kebab-case, dùng `slug` không dấu (`/san-pham/combo-10-bien-ca`, `/danh-muc/bien-ca`, `/blog/...`)

### Architecture
```
src/
├── app/
│   ├── (frontend)/        # Site public: trang chủ, danh mục, sản phẩm, blog
│   └── (payload)/         # Admin UI + REST/GraphQL API do Payload sinh (không sửa tay)
├── collections/           # Payload collection configs (Products.ts, Categories.ts, ...)
├── globals/               # Payload global configs (SiteSettings.ts, Homepage.ts)
├── access/                # Access control functions (isAdmin, isAdminOrEditor, publishedOnly)
├── hooks/                 # Payload hooks (slugify, revalidate cache sau khi publish)
├── components/            # React components dùng cho frontend
├── lib/                   # Data fetching (Payload Local API), utils
├── payload.config.ts
└── payload-types.ts       # Auto-generated — KHÔNG sửa tay
```
- Frontend đọc data bằng **Payload Local API** (`getPayload({ config })`) trong Server Components — không gọi REST API qua HTTP từ chính app.
- Business logic của field (slug, validate URL) đặt trong collection config / hooks, không đặt trong component.
- Sau khi publish/update sản phẩm → hook `afterChange` gọi `revalidatePath`/`revalidateTag` để trang public cập nhật.

### DB Conventions
- Schema do Payload quản lý — thay đổi schema bằng cách sửa collection config rồi tạo migration, KHÔNG sửa DB tay.
- Table/column do Payload tự sinh (snake_case) từ slug + field name.
- PK: `id` (serial, mặc định của db-postgres).
- Timestamp: `createdAt`/`updatedAt` (Payload tự quản lý).
- Xóa: dùng Drafts/`_status` để ẩn sản phẩm thay vì xóa cứng khi có thể.
- Neon: runtime dùng **pooled connection string** (`-pooler`); migration dùng **direct connection string**.

### Media (Backblaze B2)
- Upload qua collection `media`, `@payloadcms/storage-s3` trỏ endpoint `https://s3.<region>.backblazeb2.com`.
- Field `alt` bắt buộc (SEO + a11y).
- Khai báo `imageSizes` (thumbnail, card, og 1200x630) để frontend không load ảnh gốc.
- Hiển thị ảnh bằng `next/image`; domain B2/CDN phải khai báo trong `images.remotePatterns` của `next.config`.

### Access Control
- `products`, `categories`, `posts`: public chỉ đọc bản `published`; tạo/sửa: admin + editor; xóa: admin.
- `users`: chỉ admin quản lý.
- Không mở đăng ký tài khoản public.

### API Response Format
Không tự viết API public. Nếu cần custom endpoint (Payload `endpoints` hoặc Next.js Route Handler) dùng Pattern B — HTTP status là tín hiệu, body là data:
```json
200: { "id": 1, "title": "Combo 10 Biển Cả" }
404: { "code": "NOT_FOUND", "message": "Product not found" }
422: { "errors": [{ "field": "shopeeUrl", "message": "Invalid URL" }] }
```

### Error Handling
- Trang không tìm thấy → `notFound()` của Next.js (trả 404, dùng `app/(frontend)/not-found.tsx`).
- Validate field ở Payload (`validate` trong field config), message tiếng Việt cho admin.
- Link mua ngoài (Facebook/Shopee): validate là URL `https://`, mở bằng `target="_blank" rel="noopener noreferrer"`.
- Không log secret, connection string, token.

### SEO
- Mỗi trang dùng `generateMetadata` (title, description, Open Graph image) — ưu tiên để share Facebook hiển thị đẹp.
- Có `sitemap.ts`, `robots.ts`; JSON-LD `Product` cho trang sản phẩm (có `offers.url` trỏ Shopee nếu có).

### Test Conventions
- Unit/integration: Vitest — file `*.test.ts` đặt cạnh file được test hoặc trong `tests/int/`
- E2E: Playwright — `tests/e2e/`
- Naming: `describe('ProductCard')` > `it('should render Shopee button when shopeeUrl exists')`

## Environment Variables
```
DATABASE_URL=            # Neon pooled connection string
DATABASE_URL_DIRECT=     # Neon direct connection (dùng cho migrate)
PAYLOAD_SECRET=
NEXT_PUBLIC_SERVER_URL=
S3_ENDPOINT=             # https://s3.<region>.backblazeb2.com
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=        # B2 application key ID
S3_SECRET_ACCESS_KEY=    # B2 application key
```

## Lệnh thường dùng
```bash
pnpm install
pnpm dev                          # http://localhost:3000, admin: /admin
pnpm build && pnpm start
pnpm generate:types               # Sinh lại payload-types.ts sau khi sửa collection
pnpm payload migrate:create <name>
pnpm payload migrate
pnpm lint
pnpm test                         # Vitest
pnpm exec playwright test         # E2E
```

## Quy tắc của project
- Không thêm tính năng giỏ hàng / đặt hàng / thanh toán — ngoài scope.
- Mọi thay đổi schema phải có migration commit kèm; không dùng `push` mode ở production.
- Sau khi sửa collection/global → chạy `pnpm generate:types`, không sửa `payload-types.ts` tay.
- Secrets chỉ nằm trong `.env` (local) / Environment của Render — không commit `.env`.
- Label, description field trong admin viết tiếng Việt; code, comment, commit message tiếng Anh.

## Lưu ý hạ tầng (chưa verify — cần kiểm tra khi setup)
- Render free instance: ngủ khi idle (cold start chậm), RAM giới hạn — cần thử `pnpm build` có đủ memory không.
- Filesystem Render không bền → mọi file upload phải đi qua B2, không lưu local.
- B2 bucket: cần quyết định public bucket hay đặt CDN (vd Cloudflare) phía trước.
