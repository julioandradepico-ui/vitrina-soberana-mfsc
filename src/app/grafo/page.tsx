"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Code2, Copy, ExternalLink, Network, ShieldCheck } from "lucide-react";
import {
  MFSC_GRAPH_EDGES,
  MFSC_GRAPH_NODES,
  ORGANIZATIONS,
} from "@/data/mfscData";
import { assetUrl } from "@/lib/paths";

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

  const embedCode = `<iframe src="https://julioandradepico-ui.github.io/vitrina-soberana-mfsc/embed/${embedRegion}/" title="Vitrina de Forestería Comunitaria (${embedRegion})" width="100%" height="760" style="border:1px solid #E4DED2;border-radius:16px;" loading="lazy"></iframe>`;

  const copyEmbed = async () => {
    await navigator.clipboard?.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 1800);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Atmospheric Ecosystem Header */}
      <section className="relative overflow-hidden rounded-3xl bg-forest px-6 py-8 text-cream shadow-lg sm:px-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('${assetUrl("/images/escenarios/escenario_andino.jpg")}')`,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0F1D17]/95 via-[#143326]/80 to-[#143326]/55"
        />
        <div className="relative z-10 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
            Capa Estratégica · AICS · Mesa Nacional de Manejo Forestal Sostenible Comunitario
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white sm:text-4xl">
            Grafo de Forestería Comunitaria y Articulación
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-cream/90">
            Toca cualquier nodo del Grafo del Taller (147 tarjetas, 7 mesas) para ver
            qué organizaciones reales del Marketplace encarnan esa palanca o brecha, y
            configura el widget federado para integrarse con ExpoBosques (GIZ) sin
            perder autonomía.
          </p>
        </div>
      </section>

      {/* Interactive Network Graph + Live Matched Organizations */}
      <section className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-night p-5 text-cream shadow-lg lg:col-span-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-200">
              <Network className="h-4 w-4" />
              Grafo de Forestería Comunitaria conectado al Catálogo
            </span>
            <span className="text-[11px] text-cream/65">Haz clic en cualquier nodo</span>
          </div>

          <svg
            viewBox="0 0 840 500"
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
                  stroke={hi ? "#C65D3E" : "rgba(255,255,255,0.22)"}
                  strokeWidth={hi ? 3 : 1.5}
                  strokeDasharray={hi ? "" : "5 4"}
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
              const words = n.label.split(" ");
              const line1 = words.slice(0, 2).join(" ");
              const line2 = words.slice(2).join(" ");
              return (
                <g
                  key={n.id}
                  onClick={() => setActiveNodeId(n.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={n.x - 84}
                    y={n.y - 30}
                    width="168"
                    height="60"
                    rx="16"
                    fill={fill}
                    stroke={active ? "#FFFFFF" : "rgba(255,255,255,0.35)"}
                    strokeWidth={active ? 3 : 1.5}
                  />
                  <text
                    x={n.x}
                    y={line2 ? n.y - 4 : n.y + 4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="700"
                  >
                    {line1}
                  </text>
                  {line2 && (
                    <text
                      x={n.x}
                      y={n.y + 13}
                      textAnchor="middle"
                      fill="#F4E9D8"
                      fontSize="11"
                    >
                      {line2}
                    </text>
                  )}
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

      {/* Executive Workshop Charts (Paradoja 0,8% vs 82% & Bote de 4 Patas) */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <figure className="rounded-3xl border border-line bg-white p-6 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-forest">
            Paradoja del Taller: Contratos solos (0,8%) vs. Paquete Completo (82%)
          </h3>
          <div className="mt-4 space-y-3 text-xs">
            {[
              { label: "Solo Contratos con Compradores (7/7 mesas)", pct: 0.8, w: "3%", color: "bg-terracotta", note: "0,8% — sin gobernanza ni caja falla" },
              { label: "Solo Máquinas / Capital Semilla", pct: 2.0, w: "5%", color: "bg-gold", note: "2,0% — equipos varados sin mantenimiento" },
              { label: "Solo Cambios de Trámites y Normas", pct: 27.0, w: "33%", color: "bg-moss", note: "27,0%" },
              { label: "Paquete Completo (Gobernanza + Entidades + Plurianual + Costeo)", pct: 82.0, w: "100%", color: "bg-forest", note: "82,0% (41× impacto)" },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex justify-between font-semibold text-bark">
                  <span>{row.label}</span>
                  <span className="tabular-nums text-forest">{row.note}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-sand">
                  <div className={`h-full rounded-full ${row.color}`} style={{ width: row.w }} />
                </div>
              </div>
            ))}
          </div>
        </figure>

        <figure className="rounded-3xl border border-line bg-white p-6 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-forest">
            El Bote de 4 Patas vs. Línea Base Web (96,7% sin precio público)
          </h3>
          <div className="mt-4 grid grid-cols-4 gap-3 text-center text-xs">
            {[
              { name: "Producto", val: 19, h: "70%", sub: "60% mad / 50% PFNM", cls: "bg-moss text-white" },
              { name: "Finanzas", val: 29, h: "100%", sub: "0 menciones costeo", cls: "bg-forest text-white" },
              { name: "Marca/Calidad", val: 8, h: "30%", sub: "Pata rota · 1/30 precio", cls: "bg-terracotta text-white" },
              { name: "Ventas", val: 20, h: "74%", sub: "70% vía WhatsApp", cls: "bg-forest-mid text-white" },
            ].map((b) => (
              <div key={b.name} className="flex flex-col items-center">
                <div className="flex h-36 w-full items-end rounded-xl bg-sand p-1.5">
                  <div
                    className={`flex w-full items-center justify-center rounded-lg font-serif text-base font-bold ${b.cls}`}
                    style={{ height: b.h }}
                  >
                    {b.val}
                  </div>
                </div>
                <strong className="mt-2 text-forest">{b.name}</strong>
                <span className="text-[10px] text-muted">{b.sub}</span>
              </div>
            ))}
          </div>
        </figure>
      </section>

      {/* Federation with ExpoBosques (GIZ) */}
      <section className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-moss">
              <ShieldCheck className="h-4 w-4" />
              Autonomía de Gestión Comunitaria
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-forest">
              Integración Federada con ExpoBosques (GIZ) sin perder el control
            </h2>
            <p className="mt-2 text-sm text-muted">
              Como <code>expobosquescol.com</code> prioriza la Amazonía y es administrada por GIZ/ProBosques, la Mesa Nacional mantiene su repositorio propio y ofrece un <strong>widget embebible</strong> por región. Así se suma el tráfico de ExpoBosques sin subordinar los datos ni la gobernanza.
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
