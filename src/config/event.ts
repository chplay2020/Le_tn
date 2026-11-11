export type Tier = "special" | "friend" | "bestie";

export const EVENT = {
  host: "Trần Thành",
  school: "Đại học Văn Hiến (VHU)",
  venue: "Nhà hát Hòa Bình",
  mapUrl: "https://maps.app.goo.gl/jMDeviy7WxsCQG4g8",
  startsAt: "2026-11-18T10:30:00+07:00",
  endsAt: "2026-11-18T13:00:00+07:00",
  timezone: "Asia/Ho_Chi_Minh",
  defaultRsvpDeadline: "2026-11-17T23:59:59+07:00",
  musicSrc: "" as string, // đặt đường dẫn mp3 (vd "/music.mp3") khi có file; trống thì ẩn nút nhạc
} as const;

export const THEMES: Record<Tier, {
  label: string; invitee: string; greeting: (name: string) => string; intro: string; cta: string;
  bg: string; fg: string; accent: string; card: string; effect: "none" | "confetti";
}> = {
  special: {
    label: "special", invitee: "TRÂN TRỌNG GỬI", greeting: (n) => `Gửi ${n},`,
    intro: "Có một ngày mình muốn bạn ở đó cùng mình.",
    cta: "Mình rất mong được gặp bạn.",
    bg: "#2a1730", fg: "#fff6f2", accent: "#f2c4b0", card: "#3b2142", effect: "none",
  },
  friend: {
    label: "friend", invitee: "THÂN MỜI", greeting: (n) => `Chào ${n},`,
    intro: "Mình rất vui được mời bạn đến dự lễ tốt nghiệp của mình.",
    cta: "Hy vọng bạn sẽ đến chung vui cùng mình.",
    bg: "#0b1b3a", fg: "#ffffff", accent: "#d4af37", card: "#11264f", effect: "none",
  },
  bestie: {
    label: "bestie", invitee: "Thân gửi cốt :v", greeting: (n) => `Ê ${n}!`,
    intro: "Tốt nghiệp rồi mày ơi, không có mặt là mất vui lắm đó.",
    cta: "Đến đông đủ nha, tính hết rồi đó.",
    bg: "#06130f", fg: "#f2fff9", accent: "#3ddc97", card: "#0c241c", effect: "confetti",
  },
};
