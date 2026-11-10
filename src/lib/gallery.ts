import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { MAX_IMAGE_BYTES, sniffImage } from "@/lib/image";

export type GalleryItem = { id: string; url: string; sortOrder: number };
const BUCKET = "gallery";
const publicUrl = (path: string) => `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

export async function listGallery(): Promise<GalleryItem[]> {
  const { data, error } = await db().from("gallery").select("id,path,sort_order").order("sort_order").order("id");
  if (error) throw error;
  return (data ?? []).map((r: { id: string; path: string; sort_order: number }) => ({ id: r.id, url: publicUrl(r.path), sortOrder: r.sort_order }));
}

export async function addImage(file: File): Promise<GalleryItem | "invalid"> {
  if (file.size > MAX_IMAGE_BYTES) return "invalid";
  const buf = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(buf);
  if (!kind) return "invalid";
  const path = `${randomUUID()}.${kind.ext}`;
  const up = await db().storage.from(BUCKET).upload(path, buf, { contentType: kind.mime, upsert: false });
  if (up.error) throw up.error;
  const { data: last } = await db().from("gallery").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const order = (last?.[0]?.sort_order ?? -1) + 1;
  const { data, error } = await db().from("gallery").insert({ path, sort_order: order }).select("id,path,sort_order").single();
  if (error) { await db().storage.from(BUCKET).remove([path]); throw error; }
  return { id: data.id, url: publicUrl(data.path), sortOrder: data.sort_order };
}

export async function removeImage(id: string): Promise<void> {
  const { data } = await db().from("gallery").select("path").eq("id", id).maybeSingle();
  if (!data) return;
  await db().storage.from(BUCKET).remove([data.path]);
  const { error } = await db().from("gallery").delete().eq("id", id);
  if (error) throw error;
}

export async function reorder(ids: string[]): Promise<void> {
  for (let i = 0; i < ids.length; i++) {
    const { error } = await db().from("gallery").update({ sort_order: i }).eq("id", ids[i]);
    if (error) throw error;
  }
}
