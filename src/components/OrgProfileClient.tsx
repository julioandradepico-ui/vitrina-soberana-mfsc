"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  MessageCircle,
  Mic,
  Plus,
  QrCode,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Organization, ProductItem } from "@/data/mfscData";
import { useMarketplace } from "@/context/MarketplaceContext";
import { QrShareModal } from "@/components/QrShareModal";

export function OrgProfileClient({
  org,
  products,
}: {
  org: Organization;
  products: ProductItem[];
}) {
  const { addToCart, setCartOpen } = useMarketplace();
  const [showQr, setShowQr] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-forest"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a toda la Vitrina
      </Link>

      {/* Sovereign Micro-Site Banner */}
      <section className="mt-4 overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
        <div className="grid md:grid-cols-12">
          <div className="relative h-64 md:col-span-5 md:h-auto">
            <img
              src={org.heroImage}
              alt={org.sigla}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-forest shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              {org.seal}
            </span>
          </div>

          <div className="p-6 sm:p-8 md:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
              {org.hubName} · {org.macroregion}
            </span>
            <h1 className="mt-1 font-serif text-3xl font-bold text-forest">
              {org.sigla}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted">{org.razonSocial}</p>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-bark">
              <span className="inline-flex items-center gap-1 rounded-lg bg-cream px-2.5 py-1.5 font-semibold">
                <MapPin className="h-3.5 w-3.5 text-moss" />
                {org.municipio}, {org.departamento}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-cream px-2.5 py-1.5 font-semibold">
                <Truck className="h-3.5 w-3.5 text-moss" />
                {org.modoAcceso.split("(")[0].trim()}
              </span>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-line bg-cream p-4 text-xs sm:grid-cols-2">
              <div>
                <span className="block text-muted">Representante / Contacto</span>
                <strong className="text-forest">{org.representante}</strong>
              </div>
              <div>
                <span className="block text-muted">NIT / Respaldo</span>
                <strong className="text-forest">{org.nit}</strong>
              </div>
              <div>
                <span className="block text-muted">Capacidad / Escala</span>
                <strong className="text-bark">{org.capacidad}</strong>
              </div>
              <div>
                <span className="block text-muted">Certificaciones / Permisos</span>
                <strong className="text-bark">{org.certificaciones}</strong>
              </div>
            </div>

            {/* Voz del Territorio Audio Slot */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-moss/25 bg-sand/60 px-4 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-cream">
                <Mic className="h-4 w-4" />
              </span>
              <div className="text-xs">
                <strong className="block text-forest">
                  Voz del Territorio (cápsula de audio 30 s)
                </strong>
                <span className="text-muted">
                  Espacio listo para subir una nota de voz de {org.representante.split("(")[0].trim()} presentando su bosque y sus productos.
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setShowQr(true)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-bold text-white hover:bg-terracotta-dark"
              >
                <QrCode className="h-4 w-4" />
                Descargar QR y Tarjeta PNG
              </button>

              {org.wa && (
                <a
                  href={`https://wa.me/57${org.wa}?text=${encodeURIComponent(`Hola ${org.sigla}, los contacto desde su micro-sitio en la Vitrina Soberana MFSC.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-moss px-4 py-2.5 text-sm font-bold text-white hover:bg-forest"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Directo
                </a>
              )}

              {org.web && (
                <a
                  href={org.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line bg-cream px-4 py-2.5 text-sm font-bold text-forest hover:bg-sand"
                >
                  <ExternalLink className="h-4 w-4" />
                  Sitio Oficial
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Organization Products */}
      <section className="mt-8">
        <h2 className="font-serif text-2xl font-bold text-forest">
          Portafolio de {org.sigla} ({products.length})
        </h2>
        {products.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-white p-8 text-center">
            <p className="font-serif text-lg font-bold text-forest">
              Catálogo en levantamiento territorial
            </p>
            <p className="mt-1 text-sm text-muted">
              Esta organización hace parte de la XII Mesa Nacional MFSC y puede subir sus productos y fotos en 2 minutos.
            </p>
            <Link
              href="/sumar"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-xs font-bold text-white hover:bg-terracotta-dark"
            >
              <Plus className="h-4 w-4" /> Completar catálogo de {org.sigla}
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xs"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-sand">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] font-bold uppercase text-terracotta">
                    {p.category}
                  </span>
                  <h3 className="mt-1 font-serif text-lg font-bold text-forest">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">{p.description}</p>
                  <div className="mt-3 rounded-xl bg-cream p-2.5 text-xs">
                    <strong className="block text-forest">{p.priceLabel}</strong>
                    <span className="text-muted">
                      {p.unitLabel} · {p.availability}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(p);
                      setCartOpen(true);
                    }}
                    className="mt-4 flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-xl bg-terracotta px-3 py-2 text-xs font-bold text-white hover:bg-terracotta-dark"
                  >
                    <Plus className="h-4 w-4" /> Cotizar este producto
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <QrShareModal org={showQr ? org : null} onClose={() => setShowQr(false)} />
    </main>
  );
}
