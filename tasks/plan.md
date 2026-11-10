# Implementation Plan: Thiệp mời tốt nghiệp – Trần Thành

Nguồn: `SPEC.md` (v3, đã duyệt). Task list: `tasks/todo.md`. Plan: **đã duyệt**.

## Overview
Next.js + Supabase + Vercel. Mỗi khách có link `/i/<code>`, thiệp theo 3 tier, RSVP có thể đổi đến hết 17/11/2026, admin có mật khẩu. Làm theo **lát dọc**: mỗi task để lại hệ thống chạy được.

## Architecture Decisions
- **DB chỉ truy cập từ server** (service role), RLS bật, không policy public → khách không đọc DB trực tiếp.
- **Tier là dữ liệu, không phải route**: một component thiệp, theme + giọng văn lấy từ `src/config/event.ts` theo `tier`.
- **Nội dung sự kiện trong config**; các phần động (after-party, lưu ý, hạn RSVP, ảnh) trong bảng `settings`/`gallery` để sửa ở admin, không redeploy.
- **Phần tùy chọn trống thì ẩn** (nhạc, lưu ý, after-party, ảnh).
- **Admin auth**: mật khẩu env + cookie ký (jose) + rate-limit.
- **Timezone**: lưu UTC, hiển thị/khóa RSVP theo Asia/Ho_Chi_Minh.
- **Animation**: Framer Motion; tôn trọng `prefers-reduced-motion`.

## Dependency graph
```
Scaffold/config/theme ─► DB schema + code gen ─► Invite API ─► Invite page (tiers) ─► RSVP
                                      └────────► Admin auth ─► Admin guests ─► Export/bulk
Invite page ─► Calendar(.ics) / Music / Countdown / Gallery(+admin upload) / Notes+After-party
```

## Phases & sessions
| Session | Phase | Tasks |
|---|---|---|
| 1 (xong sau khi duyệt) | Spec & Plan | SPEC, plan, todo |
| 2 Build | P1 Foundation, P2 Core, P3 Admin, P4 Polish | T1–T14 |
| 3 Review & Test | P5 | T15–T19 |

## Risks
| Rủi ro | Giảm thiểu |
|---|---|
| Lộ dữ liệu khách chéo nhau | Test tích hợp T6/T7; security review T16 |
| Animation giật trên máy yếu | Chỉ animate transform/opacity; kiểm tra perf T18 |
| Nhạc không autoplay | Mặc định tắt, bật bằng cử chỉ người dùng |
| Lệch múi giờ `.ics`/deadline | Test đơn vị với 10:30 GMT+7 |
| Setup Supabase/Vercel cần tài khoản của chủ thiệp | T1 có hướng dẫn `docs/SETUP.md`, chủ thiệp tạo key, không commit |
| Ảnh/nhạc chưa có | Phần ẩn khi trống |

## Việc cần chủ thiệp tự làm
Tạo project Supabase + Vercel, đặt biến môi trường (hướng dẫn trong T1), viết lời nhắn riêng, cung cấp nhạc/ảnh/after-party/lưu ý sau.
