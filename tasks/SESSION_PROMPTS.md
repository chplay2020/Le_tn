# Prompt cho từng session

## Session 2 – Build (chế độ tự chạy, không giám sát)
```
Đọc SPEC.md, tasks/plan.md, tasks/todo.md (và tasks/SESSION_PROMPTS.md). Đây là session Build (T1–T14). Mình KHÔNG ngồi canh máy, hãy chạy liên tục từ T1 đến hết T14 mà không dừng hỏi.
Dùng skill: using-agent-skills, incremental-implementation, test-driven-development, frontend-ui-engineering, api-and-interface-design, security-and-hardening.

Quy tắc chạy tự động:
- Làm tuần tự từng task, mỗi task 1 commit nhỏ, tick ô trong tasks/todo.md. Tới Checkpoint thì chạy lint/typecheck/test/build; pass thì đi tiếp, KHÔNG dừng chờ mình.
- Không hỏi mình. Gặp chỗ mơ hồ thì chọn phương án an toàn nhất theo SPEC.md, ghi quyết định vào tasks/DECISIONS.md. Task nào bị kẹt sau 3 lần thử khác nhau thì ghi vào tasks/BLOCKERS.md (nguyên nhân + đã thử gì), bỏ qua, làm task độc lập tiếp theo.
- Tài khoản Vercel/Supabase đã đăng nhập CLI sẵn (xem phần "Đã xong" trong todo.md), đừng tạo lại. Tự tạo/link/áp dụng schema bằng CLI, tự đặt biến môi trường trên Vercel (vùng chạy bom1).
- Mật khẩu admin: chủ thiệp đã tự đặt trong `.env` biến `PASS_ADMIN`. Dùng đúng biến này (đọc từ env, so sánh an toàn, không hash lại ra file khác), đặt cùng giá trị lên Vercel bằng CLI (nhập qua stdin, không để lộ trong log/lệnh). KHÔNG tự sinh mật khẩu khác, KHÔNG in/echo/commit giá trị này. Việc ĐẦU TIÊN của T1: tạo `.gitignore` (có `.env*`, `node_modules`, `.next`, `.vercel`, `.supabase`) TRƯỚC mọi `git add`/commit; `.env.example` chỉ chứa tên biến, không chứa giá trị.
- Không bao giờ commit secret hay .env*. Không đẩy lên remote nào, không đổi domain, không gửi gì cho khách thật. Được phép deploy lên Vercel để thử (preview/production của project này).
- Mật khẩu DB Supabase: chủ thiệp đã đặt `SUPABASE_DB_PASSWORD` trong `.env`. Dùng nó cho `supabase link`/`db push` (truyền qua biến môi trường, không in ra). Ref project: vposhaduwmlayldedjmu.
- TIẾT KIỆM TOKEN (bắt buộc): không đọc lại file vừa tạo/sửa; chỉ đọc phần cần dùng (offset/limit), không cat file lớn; dùng grep/glob thay vì quét thư mục; lệnh chạy dài thì lọc output (`| tail -20`, `--silent`, `--reporter=dot`); không in lại log build/test đầy đủ khi pass; không tạo subagent/workflow trừ khi thật sự cần; không viết giải thích dài trong chat, mỗi task chỉ 1–2 dòng kết quả; không đọc lại SKILL.md đã đọc, chỉ đọc skill thực sự cần cho task hiện tại; không cài thêm dependency ngoài danh sách trong SPEC; ưu tiên code ngắn, gọn, không viết thừa. Cập nhật todo.md bằng 1 lần sed/edit nhỏ, không ghi lại cả file. Nếu dung lượng ngữ cảnh gần đầy, ghi tiến độ vào todo.md rồi tiếp tục.
- Không tắt/skip test, không dùng @ts-ignore hay eslint-disable để qua mặt lỗi.
- Phần cần mình quyết định sau (nhạc, ảnh, after-party, lưu ý) để trống và ẩn như spec.
- Cuối cùng viết tasks/BUILD_REPORT.md: task nào xong/kẹt, link deploy, cách đăng nhập admin (mật khẩu là PASS_ADMIN trong .env), việc mình còn phải làm tay.
Bắt đầu từ T1.
```

## Session 3 – Review & Test (chỉ mở sau khi Build xong Checkpoint 4)
```
Đọc SPEC.md, tasks/plan.md, tasks/todo.md. Đây là session Review & Test (T15–T19), KHÔNG làm tính năng mới.
Dùng skill: code-review-and-quality, security-and-hardening, browser-testing-with-devtools, performance-optimization, shipping-and-launch, debugging-and-error-recovery.
Review code 5 trục, security review (rò dữ liệu chéo giữa khách, auth admin, rate-limit, XSS, CSV injection, secret), viết/chạy e2e Playwright cho 3 tier + RSVP + admin, a11y + Lighthouse mobile, rồi checklist ra mắt và deploy. Báo cáo lỗi tìm được, sửa, và đối chiếu từng mục Success Criteria trong SPEC.md.
```
