# H2T Cobra Shop

Site giới thiệu sản phẩm mô hình in 3D (Flexi, khớp cử động) của H2T Cobra (@h2tcobra3dhue).
KHÔNG có giỏ hàng / checkout / thanh toán — nút "Mua" chỉ dẫn link ra Facebook hoặc Shopee.
Người quản trị nội dung là người không biết code → admin UI phải đơn giản, label tiếng Việt.

## Kiến trúc (pnpm workspace, 2 app)

```
repo
├── apps/cms   Payload CMS 3.90 + Next.js 16 — chỉ admin + REST API   → Render Web Service (free, được phép ngủ)
└── apps/web   Next.js 16 `output: 'export'` — HTML tĩnh               → Render Static Site (free, không ngủ)
```
- `web` lấy dữ liệu **lúc build** qua REST API của `cms` (`apps/web/src/lib/cms.ts`, có retry vì CMS có thể đang ngủ). Không có server runtime.
- Admin publish/sửa/xóa sản phẩm, danh mục, Cài đặt chung → hook `apps/cms/src/hooks/triggerWebDeploy.ts` gọi `WEB_DEPLOY_HOOK_URL` (Render Deploy Hook) → web build lại (vài phút).
- Ảnh: B2 **private** bucket (quyết định giữ private vì public tốn phí). CMS phục vụ ảnh qua `/api/media/file/...`. Lúc build, `apps/web/scripts/download-media.mjs` tải toàn bộ ảnh (gốc + sizes) về `apps/web/public/media/`, và `lib/cms.ts` đổi URL ảnh thành `/media/<file>` → web tĩnh tự phục vụ ảnh, không phụ thuộc CMS khi khách truy cập.
- Types dùng chung: web import `@cms/payload-types` (→ `apps/cms/src/payload-types.ts`), dùng `import type`. Module `payload` trong web là shim rỗng (`apps/web/src/types/payload-shim.d.ts`).

**Đã quyết định bỏ** (không hồi sinh nếu không được yêu cầu): blog/posts, pages + page builder, header/footer globals, form builder, search, redirects plugin, live preview / draft preview, ISR. Trang chủ là layout cố định, nội dung lấy từ global `site-settings`.

## Tech Stack
- Language: TypeScript 5.7 (Node.js 22 trên Render)
- CMS: Payload 3.90.2, `@payloadcms/db-postgres`, `@payloadcms/storage-s3`, `@payloadcms/plugin-seo`, `@payloadcms/translations` (admin tiếng Việt)
- Web: Next.js 16.3 static export, React 19, Tailwind CSS 4 (+ typography), lucide-react, font Nunito
- Database: PostgreSQL — Neon. **Local và production DÙNG CHUNG 1 DB** (quyết định 2026-09-24) → mọi thao tác ở local ghi thẳng lên dữ liệu thật
- Package manager: pnpm 10 (field `packageManager` ở root, chạy bằng corepack)

## Domain Model (apps/cms)

| Collection / Global | Mục đích | Field chính |
|---|---|---|
| `products` | Sản phẩm / combo | `title`, `slug`, `gallery` (upload[], bắt buộc), `shortDescription`, `features[]`, `content` (richText), `videoUrls[]`, `price`, `compareAtPrice`, `priceNote`, `colors[]` (name, hex, image), `shopeeUrl`, `facebookUrl`, `meta` (SEO), `categories`, `isFeatured`, `publishedAt`, `_status` |
| `categories` | Danh mục | `title`, `slug`, `image`, `sortOrder` |
| `media` | Ảnh upload | `alt`, `caption`, sizes: thumbnail, square, small, medium, large, xlarge, og |
| `users` | Tài khoản admin | `email`, `name` — chưa có phân quyền role |
| Global `site-settings` | Cài đặt chung + nội dung trang chủ | tab Thông tin shop (`siteName`, `logo`, `tagline`, `hashtags`), tab Trang chủ (`heroTitle`, `heroSubtitle`, `heroImage`, `highlights[]`), tab Liên hệ (`facebookUrl`, `messengerUrl`, `shopeeUrl`, `tiktokUrl`, `phone`, `zalo`, `address`) |

Route web: `/`, `/san-pham/`, `/san-pham/[slug]/`, `/danh-muc/[slug]/`, `/sitemap.xml`, `/robots.txt` (có `trailingSlash`).
Nút "Đặt qua Facebook" dùng `product.facebookUrl` → fallback `site-settings.messengerUrl` → `site-settings.facebookUrl`.
Khi chưa có sản phẩm/danh mục, route động sinh trang giữ chỗ `_` (render 404) vì static export không cho `generateStaticParams` rỗng.

## Project Conventions

### Naming
- Components, types: PascalCase; functions, variables, field Payload: camelCase; constants: SCREAMING_SNAKE_CASE
- Component/collection/global: thư mục PascalCase + `index.tsx`/`index.ts`/`config.ts`; utility/hook: file camelCase
- Route folder web: tiếng Việt không dấu, kebab-case (`san-pham`, `danh-muc`)
- URL: dùng helper `getProductPath` / `getCategoryPath` (`apps/web/src/utilities/site.ts`); trong CMS dùng `getDocPath` (`apps/cms/src/utilities/getDocPath.ts`) — không nối chuỗi tay

### apps/cms
```
src/
├── app/(payload)/     # Admin + REST/GraphQL do Payload sinh (không sửa tay). "/" redirect → /admin
├── collections/       # Products/, Categories.ts, Media.ts, Users/
├── SiteSettings/      # Global config
├── hooks/             # triggerWebDeploy (afterChange/afterDelete)
├── access/, fields/defaultLexical.ts, plugins/index.ts (seo + s3Storage), utilities/
├── migrations/        # Migration commit kèm mỗi thay đổi schema
├── payload.config.ts  # i18n: vi (mặc định), en
└── payload-types.ts   # Auto-generated — KHÔNG sửa tay
```
- Validate field ở Payload (`validate`), message tiếng Việt. Link ngoài bắt buộc `https://` (`utilities/validateUrl.ts`).
- Access: `products` public chỉ đọc bản `published`; `categories`, `media`, `site-settings` public đọc; ghi: user đã đăng nhập.

### apps/web
```
src/
├── app/            # layout, page (trang chủ), san-pham/, danh-muc/, not-found, sitemap.ts, robots.ts
├── components/     # Header, Footer, ProductCard/Grid/Gallery/Price, BuyButtons, CategoryFilter, Media, RichText
├── lib/cms.ts      # Fetch REST API lúc build (memo mỗi worker, retry khi CMS đang ngủ)
└── utilities/      # site.ts (SITE_NAME, URL helpers), formatPrice, ui (cn)
```
- Không dùng `next/image` optimizer (static export) — `components/Media` tự dựng `srcSet` từ image sizes của Payload.
- Rich text: renderer Lexical tự viết (`components/RichText`), không kéo `@payloadcms/richtext-lexical` vào web.
- Màu brand trong `app/globals.css`: `brand` (xanh), `brand-dark`, `accent` (cam), `sunny` (vàng).
- JSON-LD `Product` trên trang sản phẩm (escape `<`).

### DB & Migration
- Schema do Payload quản lý — sửa config → `pnpm --filter cms payload migrate:create <name>` → commit migration.
- `push: false` trong `payload.config.ts` (vì dùng chung DB production): dev KHÔNG tự sửa schema. Sau khi sửa collection phải `migrate:create` rồi `migrate` thì local mới chạy được.
- `migrate:create` hỏi tương tác "created or renamed": bảng/cột mới luôn chọn **create** trừ khi thật sự đổi tên.
- Kiểm tra SQL sinh ra trước khi commit: drizzle có thể sinh `DROP CONSTRAINT` sau `DROP TABLE ... CASCADE` → phải thêm `IF EXISTS` (đã gặp ở `20260924_082026_split_static_web`).
- **CẤM** chạy `migrate:fresh`, `migrate:reset`, `migrate:down` hoặc script seed/xóa dữ liệu test vào DB trong `.env` — đó là DB production. Muốn test migration phải tạo Neon branch riêng và trỏ `DATABASE_URL` tạm sang đó.
- Neon: `DATABASE_URL` dùng pooled connection string (`-pooler`).

### Test Conventions
- CMS: Vitest (`apps/cms/tests/int/`), Playwright (`apps/cms/tests/e2e/`)
- Naming: `describe('ProductCard')` > `it('should render Shopee button when shopeeUrl exists')`

## Environment Variables
```
# apps/cms/.env
DATABASE_URL=            # Neon pooled connection string
PAYLOAD_SECRET=
NEXT_PUBLIC_SERVER_URL=  # URL của CMS
WEB_URL=                 # URL của web tĩnh
WEB_DEPLOY_HOOK_URL=     # Render Deploy Hook của web (để trống ở local)
S3_ENDPOINT= / S3_REGION= / S3_BUCKET= / S3_ACCESS_KEY_ID= / S3_SECRET_ACCESS_KEY=

# apps/web (env lúc build)
CMS_URL=                 # mặc định http://localhost:3000
NEXT_PUBLIC_SITE_URL=    # mặc định http://localhost:3001
```

## Lệnh thường dùng
```bash
corepack pnpm install                          # hoặc `pnpm ...` nếu đã `corepack enable pnpm` (cần quyền admin)
corepack pnpm dev:cms                          # http://localhost:3000/admin
corepack pnpm dev:web                          # http://localhost:3001 (cần CMS đang chạy; tải ảnh về public/media trước)
corepack pnpm build:web                        # xuất HTML tĩnh ra apps/web/out
corepack pnpm --filter cms generate:types      # sau khi sửa collection/global
corepack pnpm --filter cms payload migrate:create <name>
corepack pnpm --filter cms payload migrate
corepack pnpm lint                             # lint cả 2 app
corepack pnpm --filter web typecheck
```

## Quy tắc của project
- Không thêm giỏ hàng / đặt hàng / thanh toán — ngoài scope.
- Mọi thay đổi schema phải có migration commit kèm.
- Sau khi sửa collection/global → `generate:types` (web dùng chung file types này).
- Secrets chỉ nằm trong `.env` (local) / Environment của Render — không commit `.env`.
- Label admin tiếng Việt; code, comment, commit message tiếng Anh.

## Lưu ý hạ tầng
- Render free web service (CMS) ngủ sau 15 phút không có request, khởi động ~1 phút (theo docs Render). Static Site không ngủ.
- Build web phải chờ CMS thức dậy; mỗi lần publish tiêu tốn build minutes của Static Site (hạn mức free chưa xác nhận).
- RAM 512MB của free instance có đủ build/chạy CMS không — chưa xác nhận.
