# Spec: Thiệp mời Lễ tốt nghiệp – Trần Thành

> Trạng thái: **DRAFT v3 – chờ duyệt** (Giai đoạn 1/3: Specify)

## 1. Objective

Một trang web thiệp mời tốt nghiệp. Mỗi khách nhận **một link riêng** (`/i/<mã>`), mở ra tự chào đúng tên, hiển thị thiệp theo 1 trong 3 loại, và bấm **Tham dự / Không tham dự**. Chủ thiệp (Thành) có trang admin riêng, có mật khẩu, để quản lý khách và xem ai đã trả lời.

**Người dùng**
- Khách mời (mobile là chính, mở link từ Zalo/Messenger/iMessage).
- Chủ thiệp (admin duy nhất).

**Thông tin sự kiện**
| Mục | Giá trị |
|---|---|
| Tên | Trần Thành |
| Trường | Đại học Văn Hiến (VHU) |
| Thời gian | 10:30, 18/11/2026 (GMT+7) |
| Địa điểm | Nhà hát Hòa Bình |
| Bản đồ | https://maps.app.goo.gl/jMDeviy7WxsCQG4g8 |
| After-party | **TBD** (chưa thống nhất, chỉ hiện cho loại "Anh em chí cốt" khi đã điền) |

Tất cả nằm trong 1 file config, sửa được không cần động vào code.

**3 loại thiệp**
| Loại (`tier`) | Giọng văn | Theme | Nội dung thêm |
|---|---|---|---|
| `special` – Người đặc biệt | Ấm áp, tinh tế, **không lộ liễu**, không ghi chữ "đặc biệt" | Hồng phấn + vàng nhạt, cánh hoa rơi nhẹ | Lời nhắn riêng của Thành cho từng người |
| `friend` – Bạn bè | Thân thiện, lịch sự | Kem + vàng ánh kim (mặc định) | Lời nhắn riêng tùy chọn |
| `bestie` – Anh em chí cốt | Thân mật, bựa nhẹ | Tối + vàng, confetti | Khối after-party (khi đã điền), lời nhắn riêng |

Phong cách chung: **sang trọng tối giản**, chữ serif + sans, nhiều khoảng trắng, animation nhẹ.

## 2. Assumptions (hãy sửa ngay nếu sai)
1. Chỉ tiếng Việt.
2. Năm 2026 (hôm nay 10/11/2026, sự kiện còn 8 ngày).
3. Một link = một khách (không có "+1"). Nếu khách đi cùng người khác, Thành tạo link riêng cho người đó.
4. Admin là một mình Thành, đăng nhập bằng mật khẩu (không cần hệ thống tài khoản).
5. Khách **không cần đăng nhập**; mã link là bí mật (không đoán được).
6. Ảnh: Thành chưa có, nên có gallery có thể thêm ảnh sau (upload ở admin).
7. Nhạc nền: Thành tự cung cấp file mp3 (hoặc dùng nhạc không bản quyền). Mặc định **tắt**, khách bấm bật (trình duyệt chặn autoplay).

## 3. Tính năng (MVP)

**Trang khách `/i/<code>`**
- Màn mở thiệp (phong bì/niêm phong, bấm để mở) → animation vào nội dung.
- Chào đúng tên + xưng hô theo loại thiệp.
- Hiển thị: ngày giờ, địa điểm, nút mở Google Maps, đếm ngược, gallery ảnh, lời nhắn riêng, (after-party nếu `bestie`).
- Nút **Tham dự** / **Không tham dự** + ô lời chúc tùy chọn.
- **Được đổi ý** bằng cách mở lại link, thấy trạng thái hiện tại và sửa được cho đến hết hạn RSVP.
- Nút **Lưu vào lịch** (file `.ics` + link Google Calendar).
- Nút bật/tắt nhạc nền.
- Link sai/không tồn tại → trang thân thiện, không lộ thông tin.
- Tôn trọng `prefers-reduced-motion`; responsive từ 320px; WCAG AA cơ bản.

**Trang admin `/admin` (có mật khẩu)**
- Thêm / sửa / xóa khách: tên, loại thiệp, lời nhắn riêng. Tạo mã + copy link 1 chạm (kèm nút "Copy tin nhắn mời").
- Nhập hàng loạt (dán danh sách) để tạo nhiều link.
- Danh sách: tên, loại, trạng thái (Chưa trả lời / Tham dự / Không tham dự), lời chúc, thời điểm trả lời; lọc theo loại/trạng thái; thống kê tổng.
- Xuất CSV.
- Upload/xóa ảnh gallery. Cấu hình after-party.

**Ngoài phạm vi (không làm)**: gửi email/SMS tự động, nhiều admin, thanh toán, đa ngôn ngữ, chọn món ăn.

## 4. Tech Stack
- **Next.js 15 (App Router) + TypeScript**, deploy **Vercel**.
- **Supabase** (Postgres + Storage cho ảnh). Truy cập DB **chỉ từ server** (service role key), RLS bật và không có policy public → trình duyệt không đọc được dữ liệu trực tiếp.
- **Tailwind CSS** + **Framer Motion** (animation), `canvas-confetti`.
- **Zod** (validate), **Vitest** (unit), **Playwright** (e2e).
- Admin auth: mật khẩu từ biến môi trường, so sánh an toàn, cookie phiên `HttpOnly + Secure + SameSite=Lax` đã ký (jose), rate-limit đăng nhập.

## 5. Data model
```
guests(id uuid pk, code text unique, name text, tier enum(special|friend|bestie),
       personal_message text null, created_at)
rsvps(guest_id uuid pk fk, status enum(yes|no), wish text null, updated_at)
gallery(id, path, sort_order)
settings(key, value)   -- after-party, deadline RSVP...
```
`code`: 8 ký tự base62 ngẫu nhiên từ CSPRNG (~47 bit, không đoán được).

## 6. API (server routes)
- `GET /api/invite/[code]` → tên, tier, lời nhắn, rsvp hiện tại (chỉ dữ liệu của chính khách đó).
- `PUT /api/invite/[code]/rsvp` → `{status, wish?}`; rate-limit theo IP+code; wish ≤ 300 ký tự, escape khi hiển thị.
- `/api/admin/*` (guests CRUD, bulk, export, gallery, settings, login/logout) → đều yêu cầu cookie admin.

## 7. Project Structure
```
src/app/            i/[code]/, admin/, api/
src/components/     envelope, hero, details, rsvp-form, countdown, music, gallery
src/lib/            db.ts, auth.ts, code.ts, ics.ts, config.ts, validation.ts
src/config/event.ts thông tin sự kiện, theme theo tier
tests/  e2e/  docs/  tasks/
```

## 8. Commands
```
Dev:   npm run dev
Build: npm run build
Test:  npm test            (Vitest)
E2E:   npx playwright test
Lint:  npm run lint && npm run typecheck
```

## 9. Code style
TypeScript strict, không `any`, component hàm, Tailwind utility, tên file kebab-case, validate mọi input biên bằng Zod.

## 10. Testing strategy
- Unit: sinh mã, validate, tạo `.ics`, logic auth/rate-limit.
- Integration: API RSVP (tạo/đổi ý/hết hạn), chặn truy cập admin khi chưa đăng nhập, khách A không đọc được dữ liệu khách B.
- E2E (Playwright, mobile + desktop): mở link → thấy đúng tên + theme từng tier → RSVP → admin thấy cập nhật.
- Kiểm tra a11y (axe), Lighthouse mobile Performance ≥ 90, LCP < 2.5s.

## 11. Boundaries
- **Always**: validate input, chạy test trước commit, giữ secret trong env, commit nhỏ.
- **Ask first**: thêm dependency lớn, đổi schema, đổi nhà cung cấp hosting.
- **Never**: commit secret/`.env`, lộ service key ra client, hiển thị dữ liệu khách này cho khách khác, xóa test đang fail để qua.

## 12. Quy trình 3 session
| Session | Nội dung | Kết quả |
|---|---|---|
| **1 – Spec & Plan** (đang làm) | Spec → bạn duyệt → `tasks/plan.md` + `tasks/todo.md` → bạn duyệt | Tài liệu đã duyệt |
| **2 – Build** | Triển khai theo từng lát dọc nhỏ, TDD, mỗi task 1 commit; kèm hướng dẫn tạo Supabase/Vercel | Ứng dụng chạy được |
| **3 – Review & Test** | Review 5 trục, security review, e2e/a11y/perf, sửa lỗi, checklist ra mắt | Bản sẵn sàng gửi thiệp |

Mỗi session đọc `SPEC.md`, `tasks/plan.md`, `tasks/todo.md` để tiếp tục, không phụ thuộc hội thoại trước.

## 13. Success criteria
- [ ] Mở `/i/<code>` hiện đúng tên, đúng theme theo loại thiệp; mã sai → trang 404 thân thiện.
- [ ] Bấm Tham dự/Không tham dự lưu được, mở lại link thấy đúng trạng thái và đổi được.
- [ ] Chỉ admin (đúng mật khẩu) xem được danh sách; API khách không rò dữ liệu người khác.
- [ ] Admin tạo link, copy, lọc, xuất CSV hoạt động.
- [ ] `.ics` mở được trên iOS/Android/Google Calendar với đúng 10:30 18/11/2026 GMT+7.
- [ ] Nhạc bật/tắt hoạt động; mặc định tắt.
- [ ] Mượt trên điện thoại tầm trung; Lighthouse mobile ≥ 90; không lỗi a11y nghiêm trọng.
- [ ] Toàn bộ test pass; không có secret trong repo.

## 14. Quyết định đã chốt (từ phản hồi của chủ thiệp)
- **Hạn chót RSVP** = ngày cuối khách còn trả lời/đổi ý; sau đó form khóa. Chốt: **hết ngày 17/11/2026 (23:59 GMT+7)**, tức trước ngày 18; chỉnh được trong admin (`settings`).
- **Nhạc nền**: bổ sung sau. Chưa có file thì nút nhạc tự ẩn.
- **Tên miền**: bắt đầu bằng `*.vercel.app`; gắn domain riêng sau không cần sửa code (chủ thiệp xác nhận lại nếu muốn mua domain ngay).
- **Lời nhắn riêng**: chủ thiệp tự viết, nhập qua ô "Lời nhắn riêng" ở admin.
- **Khối "Lưu ý"** (dress code, gửi xe, đến sớm...): tùy chọn, **điền sau** (chưa thống nhất); trống thì ẩn hoàn toàn, nội dung điền ở admin.
- **After-party**: điền sau ở admin, chỉ hiện cho `bestie`.

## 15. Open Questions
Không còn câu hỏi chặn. Chờ chủ thiệp duyệt spec.
