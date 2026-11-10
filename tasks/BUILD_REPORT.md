# Build Report (Session 2: T1–T14)

**Kết quả:** T1–T14 xong, không có task kẹt (`tasks/BLOCKERS.md` không cần). Lint/typecheck/test (30 test)/build đều pass ở mọi checkpoint. Checkpoint 1–3 đã thử thật qua API (tạo khách → RSVP → admin thấy → CSV → xóa) trên DB Supabase thật; khách mẫu đã xóa.

**Deploy (production, vùng bom1):** https://le-tn-eight.vercel.app
- Thiệp: `/i/<mã>` · Admin: `/admin` (chuyển sang `/admin/login` nếu chưa đăng nhập).
- Đã kiểm tra trên bản deploy: admin chưa đăng nhập → 307/401, đăng nhập đúng mật khẩu → 200 (cookie Secure), mã sai → 404, OG image/favicon hoạt động.
- Biến Vercel đã đặt (production, sensitive): `PASS_ADMIN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`.
- Supabase: đã `link` + `db push` migration `20261110000000_init.sql` (RLS bật, revoke anon/authenticated, bucket `gallery`).

**Đăng nhập admin:** vào `/admin`, nhập mật khẩu là giá trị `PASS_ADMIN` trong `.env`.

**Việc bạn còn phải làm tay**
1. **Reset mật khẩu DB Supabase** (ảnh chụp trước đó từng lộ; thêm nữa, một phần giá trị `SUPABASE_DB_PASSWORD` đã lỡ hiện trong log của phiên build do lệnh `source .env` lỗi — nên đổi ngay, rồi cập nhật `.env`). Nên cân nhắc đổi cả `PASS_ADMIN` nếu bạn thấy cần.
2. Duyệt giao diện 3 tier trên điện thoại (tạo khách thử ở admin, mở link, xóa sau); chỉnh `src/config/event.ts` (giờ kết thúc `.ics` đang đặt tạm 13:00, câu chữ từng tier).
3. Nhập lời nhắn riêng từng khách; điền Lưu ý / After-party / chỉnh hạn RSVP ở admin (đang trống = ẩn).
4. Thêm ảnh ở admin (JPG/PNG/WebP ≤ 4MB).
5. Nhạc: bỏ file mp3 vào `public/` rồi đặt `EVENT.musicSrc` (ví dụ `/music.mp3`), deploy lại.
6. Chưa gắn domain riêng; chưa push git lên remote nào (chỉ commit local).
7. Session 3 (T15–T19): review, security review, e2e Playwright, a11y/Lighthouse, checklist ra mắt. Chưa đo Lighthouse/a11y và chưa chạy trên máy thật.

Quyết định chi tiết: `tasks/DECISIONS.md`.
