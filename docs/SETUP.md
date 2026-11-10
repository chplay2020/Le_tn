# Setup

Biến môi trường (xem `.env.example`; không commit giá trị):
- `PASS_ADMIN` – mật khẩu admin.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` – chỉ dùng phía server.
- `SESSION_SECRET` – khóa ký cookie admin (chuỗi ngẫu nhiên ≥ 32 ký tự).
- `SUPABASE_DB_PASSWORD` – chỉ dùng khi `supabase link` / `db push`.

## Supabase
`npx supabase link --project-ref vposhaduwmlayldedjmu` rồi `npx supabase db push` (migration trong `supabase/migrations`).
Key lấy ở Project Settings → API (service_role). Bảng bật RLS, không có policy public.

## Vercel
`npx vercel link`, đặt env bằng `npx vercel env add NAME production`, region `bom1` (trong `vercel.json`), `npx vercel deploy --prod`.

## Lệnh
`npm run dev | build | test | lint | typecheck`
