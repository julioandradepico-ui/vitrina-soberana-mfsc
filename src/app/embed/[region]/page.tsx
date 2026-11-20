import Link from "next/link";
import { assetUrl } from "@/lib/paths";
import { ExternalLink, MessageCircle, ShieldCheck } from "lucide-react";
import { PRODUCTS } from "@/data/mfscData";

export function generateStaticParams() {
  return [
    { region: "nacional" },
    { region: "amazonia" },
    { region: "pacifico" },
    { region: "caribe" },
    { region: "orinoquia" },
  ];
}

export default async function EmbedRegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const r = region.toLowerCase();

  const filtered = PRODUCTS.filter((p) => {
    if (r === "nacional") return true;
    if (r === "amazonia") return p.hubId.includes("amazonia");
    if (r === "pacifico") return p.hubId.includes("pacifico") || p.hubId.includes("atrato");
    if (r === "caribe") return p.hubId === "caribe";
    if (r === "orinoquia") return p.hubId === "orinoquia-andino";
    return true;
  });

  return (
    <div className="min-h-screen bg-sand p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-forest px-4 py-3 text-cream">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
            Widget Federado Soberano · Mesa Nacional MFSC
          </span>
          <h1 className="font-serif text-lg font-bold text-white">
            Vitrina {r === "nacional" ? "Nacional (16 Departamentos)" : r.toUpperCase()} ({filtered.length} ofertas)
          </h1>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1 rounded-xl bg-terracotta px-3 py-1.5 text-xs font-bold text-white hover:bg-terracotta-dark"
        >
          Abrir Vitrina Completa <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xs"
          >
            <div className="relative aspect-[4/3] bg-sand">
              <img src={assetUrl(p.image)} alt={p.title} className="h-full w-full object-cover" />
              <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-forest">
                <ShieldCheck className="h-3 w-3 text-gold" /> {p.seal}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-3.5">
              <span className="text-[11px] font-bold text-terracotta">
                {p.orgSigla} · {p.departamento}
              </span>
              <h2 className="mt-1 font-serif text-base font-bold text-forest line-clamp-2">
                {p.title}
              </h2>
              <p className="mt-1 text-xs text-muted line-clamp-2">{p.description}</p>
              <div className="mt-auto flex gap-2 pt-3">
                {p.wa && (
                  <a
                    href={`https://wa.me/57${p.wa}?text=${encodeURIComponent(`Hola ${p.orgSigla}, los contacto desde el widget federado de la Vitrina MFSC por: ${p.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-moss px-2.5 py-1.5 text-xs font-bold text-white hover:bg-forest"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                )}
                <Link
                  href={`/org/${p.orgSlug}`}
                  target="_blank"
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-line bg-cream px-2.5 py-1.5 text-xs font-bold text-forest hover:bg-sand"
                >
                  Ver ficha
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
