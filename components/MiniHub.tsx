// components/MiniHub.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

type Mini = { sku: string; name: string; image_url?: string };

export default function MiniHub({ items }: { items: Mini[] }) {
  if (!items?.length) return null;

  return (
    <section className="mt-8">
      <h3 className="text-teal-600 text-xl font-semibold mb-2">Ähnliche Produkten</h3>
      <div className="h-px bg-teal-300 mb-4" />
      <div className="flex gap-6 overflow-x-auto pb-1">
        {items.map((r) => (
          <Link
            key={r.sku}
            href={`/p/${r.sku}`}
            className="w-24 shrink-0 hover:scale-105 transition-transform"
          >
            <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-white shadow">
              <Image
                src={`/api/image?src=${encodeURIComponent(r.image_url || '')}&w=240`}
                alt={r.name}
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>
            <p className="text-xs mt-2 text-zinc-800">{r.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
