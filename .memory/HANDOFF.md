# Session Handoff

## Session gần nhất
- Ngày: 2026-09-30
- Tóm tắt: Render build web lỗi 500 khi tải ảnh — nguyên nhân là B2 hết Daily Download Bandwidth Cap (free 1 GB/ngày). Đã giảm lượng ảnh tải mỗi build và cho script fail nhanh.

## Đã thực hiện
- Xác nhận nguyên nhân: gọi GetObject trực tiếp B2 → `AccessDenied 403 ... download bandwidth ... cap exceeded`; CMS trả 500 cho mọi `/api/media/file/...` (file trên B2 vẫn còn). Backblaze báo "Download Bandwidth Cap Reached 100%".
- Đo dung lượng 1 build (12 media): trước 72 file / 20.66 MB; 2 file PNG (`khủng long.png`, `cá sấu.png`) chiếm ~13.9 MB.
- Sửa `apps/web/scripts/download-media.mjs` (chưa commit):
  - Size `square` chỉ tải cho `site-settings.logo` (dùng ở `app/layout.tsx`).
  - Size `og` chỉ tải cho `meta.image` ?? ảnh gallery đầu tiên của sản phẩm published (dùng ở `app/san-pham/[slug]/page.tsx`).
  - Tải file ảnh: HTTP 500 → fail ngay, không retry (500 lúc này = lỗi đọc storage). Network error / 502-504 vẫn retry.
  - Kết quả với dữ liệu hiện tại: 52 file / 14.85 MB mỗi build.
- Verify local: `next build` với CMS production OK; URL ảnh thực sự được fetch (img src/srcSet, meta, JSON-LD, sitemap) khớp 52/52 với danh sách tải. ESLint OK. Script fail sau 2s khi B2 hết cap.

## Trạng thái hiện tại
- Thay đổi script chưa commit, đang ở branch `main` (cần tạo branch trước khi commit).
- B2 vẫn đang hết cap hôm nay → build Render sẽ fail cho tới khi cap reset hoặc tăng cap.

## Việc tiếp theo
- Tăng Daily Download Bandwidth Cap (Caps & Alerts) hoặc chờ reset, rồi chạy lại build Render để verify tải ảnh thật.
- Xem Backblaze Reports + số lần deploy Static Site hôm nay để biết nguồn tiêu thụ băng thông (build / admin xem ảnh / dev local) — chưa xác nhận.
- Hướng còn lại chưa làm: (2) `formatOptions` WebP cho image sizes trong `apps/cms/src/collections/Media.ts` (chỉ áp dụng ảnh upload mới); (4) cache `public/media` giữa các build, chỉ tải file mới (chưa xác nhận Render Static Site có giữ build cache).

## Ghi chú quan trọng
- Quy tắc lọc size trong `download-media.mjs` phải đồng bộ với code web: nếu web dùng `square`/`og` ở chỗ mới mà không sửa script → ảnh 404.
- RSC payload trong HTML chứa URL của mọi size (props serialized) — không phải request thật, không dùng để đánh giá file nào cần tải.
