"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Code2, Copy, ExternalLink, Network, ShieldCheck } from "lucide-react";
import {
  MFSC_GRAPH_EDGES,
  MFSC_GRAPH_NODES,
  ORGANIZATIONS,
} from "@/data/mfscData";

export default function GrafoSoberaniaPage() {
  const [activeNodeId, setActiveNodeId] = useState<string>("ENAB_BUYER_CONTRACTS");
  const [embedRegion, setEmbedRegion] = useState("amazonia");
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const activeNode =
    MFSC_GRAPH_NODES.find((n) => n.id === activeNodeId) || MFSC_GRAPH_NODES[0];

  const matchingOrgs = ORGANIZATIONS.filter((o) =>
    o.graphNodes.includes(activeNode.id)
  );

  const nodeMap = Object.fromEntries(MFSC_GRAPH_NODES.map((n) => [n.id, n]));

  const embedCode = `<iframe src="https://vitrinamfsc.vercel.app/embed/${embedRegion}" title="Vitrina Soberana MFSC (${embedRegion})" width="100%" height="760" style="border:1px solid #E4DED2;border-radius:16px;" loading="lazy"></iframe>`;

  const copyEmbed = async () => {
    await navigator.clipboard?.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 1800);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
          Capa Estratégica · AICS · Mesa Nacional MFSC
        </span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-forest sm:text-4xl">
          Grafo Interactivo MFSC y Federación Soberana
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Toca cualquier nodo del Grafo del Taller (147 tarjetas, 7 mesas) para ver
          qué organizaciones reales del Marketplace encarnan esa palanca o brecha, y
          configura el widget federado para integrarse con ExpoBosques (GIZ) sin
          perder soberanía.
        </p>
      </div>

      {/* Interactive Network Graph + Live Matched Organizations */}
      <section className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-night p-5 text-cream shadow-lg lg:col-span-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-200">
              <Network className="h-4 w-4" />
              Grafo Causal MFSC conectado al Catálogo
            </span>
            <span className="text-[11px] text-cream/65">Haz clic en un nodo</span>
          </div>

          <svg
            viewBox="0 0 820 490"
            className="h-auto w-full"
            role="img"
            aria-label="Grafo interactivo de nodos del Taller MFSC"
          >
            {MFSC_GRAPH_EDGES.map(([from, to]) => {
              const a = nodeMap[from];
              const b = nodeMap[to];
              if (!a || !b) return null;
              const hi = from === activeNodeId || to === activeNodeId;
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={hi ? "#C65D3E" : "rgba(255,255,255,0.18)"}
                  strokeWidth={hi ? 2.8 : 1.5}
                  strokeDasharray={hi ? "" : "4 4"}
                />
              );
            })}

            {MFSC_GRAPH_NODES.map((n) => {
              const active = n.id === activeNodeId;
              const fill =
                n.category === "brecha" || n.category === "paradoja"
                  ? "#C65D3E"
                  : n.category === "palanca"
                    ? "#B9833C"
                    : "#2D5A45";
              return (
                <g
                  key={n.id}
                  onClick={() => setActiveNodeId(n.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={active ? 44 : 34}
                    fill={fill}
                    stroke={active ? "#FFFFFF" : "rgba(255,255,255,0.35)"}
                    strokeWidth={active ? 3.5 : 1.5}
                  />
                  <text
                    x={n.x}
                    y={n.y - 4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {n.label.split(" ").slice(0, 2).join(" ")}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 12}
                    textAnchor="middle"
                    fill="#F4E9D8"
                    fontSize="10"
                  >
                    {n.label.split(" ").slice(2).join(" ")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="flex flex-col rounded-3xl border border-line bg-white p-5 shadow-xs lg:col-span-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
            {activeNode.mesas} · {activeNode.weight}
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-forest">
            {activeNode.label}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted">{activeNode.desc}</p>

          <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-forest">
            Organizaciones vinculadas ({matchingOrgs.length})
          </h3>
          <div className="mt-2.5 flex-1 space-y-2 overflow-y-auto max-h-72 pr-1">
            {matchingOrgs.map((o) => (
              <Link
                key={o.id}
                href={`/org/${o.slug}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-line bg-cream p-2.5 text-xs transition hover:border-moss hover:bg-sand"
              >
                <div className="min-w-0">
                  <strong className="block truncate text-forest">{o.sigla}</strong>
                  <span className="text-[11px] text-muted">
                    {o.municipio}, {o.departamento}
                  </span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-terracotta" />
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {/* Federation with ExpoBosques (GIZ) */}
      <section className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-moss">
              <ShieldCheck className="h-4 w-4" />
              Autonomía de Gestión y Soberanía Comunitaria
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-forest">
              Integración Federada con ExpoBosques (GIZ) sin perder el control
            </h2>
            <p className="mt-2 text-sm text-muted">
              Como <code>expobosquescol.com</code> prioriza la Amazonía y es administrada por GIZ/ProBosques, la Mesa Nacional mantiene su repositorio soberano en Vercel y ofrece un <strong>widget embebible</strong> por región. Así se suma el tráfico de ExpoBosques sin subordinar los datos ni la gobernanza.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={embedRegion}
              onChange={(e) => setEmbedRegion(e.target.value)}
              aria-label="Región del widget embebible"
              className="min-h-[42px] rounded-xl border border-line bg-cream px-3 text-sm font-semibold text-forest"
            >
              <option value="amazonia">Filtro: Amazonía (ExpoBosques)</option>
              <option value="nacional">Filtro: Nacional (16 Deptos)</option>
              <option value="pacifico">Filtro: Pacífico y Atrato</option>
              <option value="caribe">Filtro: Caribe</option>
              <option value="orinoquia">Filtro: Orinoquía y Andes</option>
            </select>
            <Link
              href={`/embed/${embedRegion}`}
              target="_blank"
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white hover:bg-moss"
            >
              Probar Widget <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-night p-4 text-xs text-cream">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-mono text-amber-200">
              <Code2 className="h-4 w-4" /> Código HTML para ExpoBosques / MinAmbiente / AICS
            </span>
            <button
              type="button"
              onClick={copyEmbed}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/20"
            >
              {copiedEmbed ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedEmbed ? "Copiado" : "Copiar"}
            </button>
          </div>
          <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-emerald-100">
            {embedCode}
          </pre>
        </div>
      </section>
    </main>
  );
}
