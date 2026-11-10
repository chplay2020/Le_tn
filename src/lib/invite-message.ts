import type { Tier } from "@/config/event";

export function inviteMessage(g: { name: string; tier: Tier }, link: string): string {
  const open = { special: `Gửi ${g.name},`, friend: `Chào ${g.name},`, bestie: `Ê ${g.name}!` }[g.tier];
  return `${open}\nMình mời bạn đến lễ tốt nghiệp của mình lúc 10:30 ngày 18/11/2026 tại Nhà hát Hòa Bình. Bạn mở thiệp và xác nhận tham dự giúp mình tại đây nhé:\n${link}`;
}
