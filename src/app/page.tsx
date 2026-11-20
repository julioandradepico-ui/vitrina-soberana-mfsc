"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  ExternalLink,
  MapPin,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  ORGANIZATIONS,
  Organization,
  ProductCategory,
  ProductItem,
  REGIONAL_HUBS,
} from "@/data/mfscData";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ProductQuickDrawer } from "@/components/ProductQuickDrawer";
import { QrShareModal } from "@/components/QrShareModal";

const CATEGORIES: ("Todo" | ProductCategory)[] = [
  "Todo",
  "Maderables",
  "PFNM",
  "Agroforestales",
  "Artesanías",
  "Viveros",
  "Servicios Ambientales",
];

export default function VitrinaHomePage() {
  const { allProducts, addToCart, cart, setCartOpen } = useMarketplace();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Todo" | ProductCategory>("Todo");
  const [hubId, setHubId] = useState("ALL");
  const [seal, setSeal] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [qrOrg, setQrOrg] = useState<Organization | null>(null);

  const orgById = useMemo(
    () => Object.fromEntries(ORGANIZATIONS.map((o) => [o.id, o])),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProducts.filter((p) => {
      const okQ =
        !q ||
        `${p.title} ${p.orgSigla} ${p.municipio} ${p.departamento} ${p.description} ${p.certLabel} ${p.hubName}`
          .toLowerCase()
          .includes(q);
      const okC = category === "Todo" || p.category === category;
      const okH = hubId === "ALL" || p.hubId === hubId;
      const okS = seal === "ALL" || p.seal === seal;
      return okQ && okC && okH && okS;
    });
  }, [allProducts, query, category, hubId, seal]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Editorial Compact Hero — Zero Academic Wall */}
      <section className="relative overflow-hidden rounded-3xl bg-forest px-6 py-8 text-cream shadow-lg sm:px-10 sm:py-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold text-amber-100">
              <Sparkles className="h-3.5 w-3.5" />
              Mesa Nacional de Forestería Comunitaria · 16 Departamentos
            </span>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.65rem]">
              Bienes y servicios directos del bosque comunitario
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream/85 sm:text-base">
              Conecta sin intermediarios con más de 30 asociaciones forestales,
              agroforestales y artesanales de Colombia. Cotiza por WhatsApp,
              consolida fletes por Hub o suma tu organización en 2 minutos.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                href="/mapa"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-terracotta-dark"
              >
                <MapPin className="h-4 w-4" />
                Explorar Mapa de Colombia
              </Link>
              <Link
                href="/sumar"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-xs transition hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
                Sumar mi Organización
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 lg:col-span-5">
            {[
              { src: "/images/productos/asomasuc_madera.jpg", alt: "Madera legal certificada" },
              { src: "/images/productos/coomagua_frutos.jpg", alt: "Frutos amazónicos" },
              { src: "/images/productos/forestar_meliponicultura.jpg", alt: "Meliponicultura" },
              { src: "/images/productos/prod_cesteria_indigena.jpg", alt: "Cestería artesanal" },
            ].map((img) => (
              <div
                key={img.src}
                className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-forest-mid"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Tactile Filter Bar */}
      <section
        aria-label="Filtros de catálogo"
        className="mt-6 rounded-2xl border border-line bg-white p-4 shadow-xs"
      >
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar madera FSC, cacay, sacha inchi, miel, guadua, Guaviare..."
              className="w-full min-h-[44px] rounded-xl border border-line bg-cream pl-10 pr-4 text-sm text-bark placeholder:text-muted/70 focus:border-moss focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={hubId}
              onChange={(e) => setHubId(e.target.value)}
              aria-label="Filtrar por Hub Regional"
              className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3 text-sm font-medium text-bark focus:border-moss focus:bg-white focus:outline-none"
            >
              <option value="ALL">Todos los Hubs (6)</option>
              {REGIONAL_HUBS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={seal}
              onChange={(e) => setSeal(e.target.value)}
              aria-label="Filtrar por Sello de Confianza"
              className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3 text-sm font-medium text-bark focus:border-moss focus:bg-white focus:outline-none"
            >
              <option value="ALL">Todos los sellos</option>
              <option value="Sello Diferenciado">Sello Diferenciado (FSC / Oro)</option>
              <option value="Legalidad Vigente">Legalidad Vigente (CAR / INVIMA)</option>
              <option value="Aval Comunitario MFSC">Aval Comunitario MFSC</option>
            </select>
          </div>
        </div>

        {/* Horizontal Tactile Category Pills */}
        <div className="no-scrollbar mt-3.5 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                aria-pressed={active}
                className={`shrink-0 min-h-[38px] rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  active
                    ? "bg-forest text-cream shadow-xs"
                    : "border border-line bg-sand/70 text-bark hover:border-moss hover:bg-sand"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Result Count */}
      <div className="mt-5 flex items-center justify-between text-xs font-semibold text-muted">
        <span className="tabular-nums">
          Mostrando {filtered.length} de {allProducts.length} bienes y servicios reales
        </span>
        {(query || category !== "Todo" || hubId !== "ALL" || seal !== "ALL") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("Todo");
              setHubId("ALL");
              setSeal("ALL");
            }}
            className="text-terracotta hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Product Grid */}
      <section className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const inCart = cart.some((c) => c.product.id === item.id);
          const org = orgById[item.orgId] || null;
          return (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-lg"
            >
              <button
                type="button"
                onClick={() => setSelectedProduct(item)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-sand text-left"
              >
                <img
                  src={item.image}
                  alt={`${item.title} - ${item.orgSigla}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-forest/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                  {item.category}
                </span>
                <span
                  className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold backdrop-blur-xs ${
                    item.seal === "Sello Diferenciado"
                      ? "border-gold/50 bg-white/95 text-amber-900"
                      : item.isCustom
                        ? "border-terracotta/50 bg-amber-50/95 text-terracotta-dark"
                        : "border-line bg-white/95 text-forest"
                  }`}
                >
                  <ShieldCheck className="h-3 w-3 text-gold" />
                  {item.seal}
                </span>
              </button>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <Link
                    href={`/org/${item.orgSlug}`}
                    className="font-bold text-terracotta hover:underline"
                  >
                    {item.orgSigla}
                  </Link>
                  <span className="truncate text-muted">
                    {item.municipio}, {item.departamento}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProduct(item)}
                  className="mt-1.5 text-left font-serif text-lg font-bold leading-snug text-forest hover:text-moss"
                >
                  {item.title}
                </button>

                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                  {item.description}
                </p>

                <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-cream p-2.5 text-[11px]">
                  <div>
                    <span className="block text-muted">Precio</span>
                    <strong className="text-forest tabular-nums">{item.priceLabel}</strong>
                  </div>
                  <div>
                    <span className="block text-muted">Disponibilidad</span>
                    <strong className="text-bark">{item.availability}</strong>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(item);
                      setCartOpen(true);
                    }}
                    className={`flex flex-1 min-h-[40px] items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                      inCart
                        ? "bg-forest text-white"
                        : "bg-terracotta text-white hover:bg-terracotta-dark"
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> En tu lista
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" /> Cotizar
                      </>
                    )}
                  </button>

                  {item.web && (
                    <a
                      href={item.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[40px] items-center justify-center rounded-xl border border-line bg-cream px-2.5 text-forest hover:bg-sand"
                      title="Abrir sitio oficial"
                      aria-label={`Abrir sitio web de ${item.orgSigla}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  {org && (
                    <button
                      type="button"
                      onClick={() => setQrOrg(org)}
                      className="flex min-h-[40px] items-center justify-center rounded-xl border border-line bg-cream px-2.5 text-forest hover:bg-sand"
                      title="Micro-URL y Código QR"
                      aria-label={`Ver código QR de ${item.orgSigla}`}
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      {/* Open Onboarding Invitation */}
      <section className="mt-10 rounded-3xl border-2 border-dashed border-moss/35 bg-cream p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-forest">
          ¿Tu asociación o emprendimiento forestal aún no está en la Vitrina?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          Cualquier miembro de la Mesa Nacional o iniciativa comunitaria puede
          sumar sus bienes y servicios en 2 minutos desde el celular, obtener su
          propio enlace para WhatsApp y un código QR descargable.
        </p>
        <Link
          href="/sumar"
          className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-terracotta-dark"
        >
          <Plus className="h-4 w-4" />
          Sumar mi Organización ahora
        </Link>
      </section>

      <ProductQuickDrawer
        product={selectedProduct}
        org={selectedProduct ? orgById[selectedProduct.orgId] || null : null}
        onClose={() => setSelectedProduct(null)}
        onOpenQr={(o) => {
          setSelectedProduct(null);
          setQrOrg(o);
        }}
      />

      <QrShareModal org={qrOrg} onClose={() => setQrOrg(null)} />
    </main>
  );
}
