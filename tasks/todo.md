# Todo: Thiệp mời tốt nghiệp
Trạng thái plan: **ĐÃ DUYỆT**.

**Đã xong trước khi build:** chủ thiệp đã có tài khoản Vercel + Supabase, đã `vercel login` + `supabase login` trên máy; project Supabase đã tạo (ref `vposhaduwmlayldedjmu`, vùng ap-south-1/Mumbai, chưa `link`). KHÔNG tạo lại. Mật khẩu DB từng lộ trong ảnh chụp, không dùng, nhắc chủ thiệp reset. Đặt vùng chạy Vercel = bom1. Khóa quyền công khai bảng (RLS + revoke) vì ô 'auto expose tables' đã tick. Mật khẩu admin do chủ thiệp tự nhập trong terminal, không dán vào chat.
Quy ước: mỗi task = 1 commit; TDD cho logic; chạy `npm run lint && npm run typecheck && npm test` trước commit. Kích thước S/M.

## Phase 1: Foundation
- [x] **T1 Scaffold + config + docs setup** (S) — Next.js/TS/Tailwind/Vitest, `src/config/event.ts` (thông tin sự kiện + theme 3 tier), `.env.example`, `docs/SETUP.md` (Supabase/Vercel).
  AC: `npm run dev/build/test` chạy; không có secret trong repo. Deps: không.
- [x] **T2 DB schema + code generator** (S) — migration `guests/rsvps/gallery/settings`, RLS bật, `lib/code.ts` (8 ký tự base62 CSPRNG).
  AC: test sinh mã độc nhất, đúng độ dài/ký tự; migration áp dụng được. Deps: T1.
- [x] **T3 Invite API (đọc)** (S) — `GET /api/invite/[code]` trả đúng dữ liệu của chính khách; mã sai → 404 chung.
  AC: test: không trả field khách khác/không lộ id nội bộ. Deps: T2.
### Checkpoint 1
- [x] Test/build pass; lấy được 1 khách mẫu qua API.

## Phase 2: Core guest experience
- [x] **T4 Trang thiệp cơ bản theo tier** (M) — `/i/[code]`: chào đúng tên, ngày giờ, địa điểm, nút Google Maps, theme + giọng văn theo tier, 404 thân thiện.
  AC: 3 tier hiển thị khác nhau; mobile 320px không scroll ngang. Deps: T3.
- [x] **T5 Phong bì mở thiệp + animation** (M) — màn mở, hiệu ứng vào, cánh hoa (special), confetti (bestie), reduced-motion.
  AC: reduced-motion tắt animation nặng; không giật. Deps: T4.
- [x] **T6 RSVP (tạo/đổi ý/khóa)** (M) — `PUT /api/invite/[code]/rsvp` + form Tham dự/Không + lời chúc; khóa sau 23:59 17/11 GMT+7; rate-limit; validate Zod.
  AC: test tạo, đổi ý, bị chặn sau hạn, wish >300 ký tự bị từ chối, chặn ghi vào khách khác. Deps: T4.
- [x] **T7 Lưu vào lịch + đếm ngược** (S) — `.ics` + link Google Calendar; countdown.
  AC: test `.ics` đúng 10:30 18/11/2026 GMT+7. Deps: T4.
### Checkpoint 2
- [x] Luồng khách end-to-end chạy; review với chủ thiệp (giao diện).

## Phase 3: Admin
- [x] **T8 Admin auth** (M) — `/admin/login`, cookie HttpOnly ký, middleware bảo vệ `/admin` + `/api/admin`, rate-limit.
  AC: chưa đăng nhập → 401/redirect; sai mật khẩu bị giới hạn. Deps: T2.
- [x] **T9 Quản lý khách** (M) — thêm/sửa/xóa, tier, lời nhắn riêng, copy link + copy tin nhắn mời.
  AC: link tạo ra mở được thiệp đúng tên. Deps: T8, T4.
- [x] **T10 Danh sách RSVP + nhập hàng loạt + CSV** (M) — lọc theo tier/trạng thái, thống kê, dán danh sách tạo nhiều link, xuất CSV.
  AC: CSV đúng cột (tên, loại, trạng thái, lời chúc, thời điểm); chống CSV injection. Deps: T9, T6.
### Checkpoint 3
- [ ] Đóng vòng: tạo khách → gửi link → khách RSVP → admin thấy.

## Phase 4: Optional content & polish
- [x] **T11 Settings admin: hạn RSVP, lưu ý, after-party** (S) — sửa ở admin; trống thì ẩn; after-party chỉ `bestie`. Deps: T10.
- [x] **T12 Gallery + upload ảnh** (M) — Supabase Storage, upload/xóa/sắp xếp ở admin, hiển thị trên thiệp, ẩn khi trống. Deps: T11.
- [ ] **T13 Nhạc nền bật/tắt** (S) — mặc định tắt, ẩn nếu chưa có file. Deps: T4.
- [ ] **T14 Polish thiết kế** (M) — typography, khoảng trắng, theme 3 tier hoàn chỉnh, favicon/OG image (xem trước link khi gửi Zalo/Messenger).
  AC: chủ thiệp duyệt giao diện. Deps: T5–T13.
### Checkpoint 4 → hết session 2 (Build)
- [ ] Mọi AC của T1–T14 đạt; chủ thiệp duyệt giao diện.

## Phase 5: Review & Test (Session 3)
- [ ] **T15 Code review 5 trục** (`code-review-and-quality`), sửa lỗi.
- [ ] **T16 Security review** (`security-and-hardening`): rò dữ liệu chéo, auth, rate-limit, XSS, secret.
- [ ] **T17 E2E Playwright** mobile + desktop cho 3 tier, RSVP, admin.
- [ ] **T18 A11y + Performance**: axe, Lighthouse mobile ≥ 90, LCP < 2.5s, kiểm thử máy yếu.
- [ ] **T19 Checklist ra mắt** (`shipping-and-launch`): deploy Vercel, biến môi trường, thử link thật trên điện thoại, kế hoạch rollback, tạo dữ liệu khách thật.
### Checkpoint cuối
- [ ] Toàn bộ Success Criteria trong SPEC.md đạt; sẵn sàng gửi thiệp.
