export function NotFoundCard() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f7f1e3", color: "#3b3326" }}>
      <div className="max-w-sm text-center">
        <h1 className="font-serif-d text-2xl">Không tìm thấy thiệp</h1>
        <p className="mt-3 opacity-80">Đường dẫn này có thể đã sai hoặc không còn hiệu lực. Bạn vui lòng kiểm tra lại link được gửi nhé.</p>
      </div>
    </main>
  );
}
