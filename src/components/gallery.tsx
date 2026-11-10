import Image from "next/image";

export function Gallery({ urls }: { urls: string[] }) {
  if (!urls.length) return null;
  return (
    <section aria-label="Ảnh" className="mx-auto w-full max-w-md px-4 pb-8">
      <ul className="grid grid-cols-2 gap-2">
        {urls.map((u, i) => (
          <li key={u} className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <Image src={u} alt={`Ảnh ${i + 1}`} fill sizes="(max-width: 448px) 50vw, 224px" className="object-cover" loading={i < 2 ? "eager" : "lazy"} />
          </li>))}
      </ul>
    </section>
  );
}
