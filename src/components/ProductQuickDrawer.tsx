"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ExternalLink,
  MapPin,
  MessageCircle,
  Plus,
  QrCode,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { Organization, ProductItem } from "@/data/mfscData";
import { useMarketplace } from "@/context/MarketplaceContext";

interface Props {
  product: ProductItem | null;
  org: Organization | null;
  onClose: () => void;
  onOpenQr: (org: Organization) => void;
}

export function ProductQuickDrawer({ product, org, onClose, onOpenQr }: Props) {
  const { addToCart, cart, setCartOpen } = useMarketplace();
  const inCart = product ? cart.some((c) => c.product.id === product.id) : false;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-forest/55 backdrop-blur-xs"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-cream shadow-2xl"
          >
            <div className="relative h-64 w-full shrink-0 bg-sand">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest/80 text-white backdrop-blur-md hover:bg-forest"
                aria-label="Cerrar vista rápida"
              >
                <X className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 left-4 rounded-full bg-forest/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {product.category}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/org/${product.orgSlug}`}
                  className="text-sm font-bold text-terracotta hover:underline"
                >
                  {product.orgSigla} →
                </Link>
                <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-white px-2.5 py-0.5 text-xs font-bold text-forest">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                  {product.seal}
                </span>
              </div>

              <h2 className="mt-2 font-serif text-2xl font-bold leading-snug text-forest">
                {product.title}
              </h2>

              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-4 w-4 text-moss shrink-0" />
                {product.municipio}, {product.departamento}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-bark">
                {product.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-white p-4 text-sm">
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Precio / Esquema
                  </span>
                  <strong className="mt-0.5 block text-forest tabular-nums">
                    {product.priceLabel}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Unidad de Venta
                  </span>
                  <strong className="mt-0.5 block text-bark">{product.unitLabel}</strong>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Disponibilidad
                  </span>
                  <strong className="mt-0.5 block text-bark">{product.availability}</strong>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Respaldo / Permiso
                  </span>
                  <strong className="mt-0.5 block text-bark">{product.certLabel}</strong>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-moss/25 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-moss">
                  <Truck className="h-4 w-4" />
                  Articulación Logística · {product.hubName}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {org?.logisticaDetalle ||
                    "Coordinación directa con la asociación o consolidación de flete a través del Hub Regional."}
                </p>
              </div>
            </div>

            <div className="border-t border-line bg-white p-4 space-y-2.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product);
                    onClose();
                    setCartOpen(true);
                  }}
                  className="flex flex-1 min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-bold text-white hover:bg-terracotta-dark"
                >
                  {inCart ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Ver en mi cotización
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Agregar a cotización
                    </>
                  )}
                </button>

                {product.wa && (
                  <a
                    href={`https://wa.me/57${product.wa}?text=${encodeURIComponent(`Hola ${product.orgSigla}, me interesa cotizar: ${product.title} desde la Vitrina Soberana MFSC.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-moss px-4 py-2.5 text-sm font-bold text-white hover:bg-forest"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
              </div>

              <div className="flex gap-2">
                {product.web && (
                  <a
                    href={product.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-cream px-3 py-2 text-xs font-bold text-forest hover:bg-sand"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Ir al sitio oficial
                  </a>
                )}
                {org && (
                  <button
                    type="button"
                    onClick={() => onOpenQr(org)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-cream px-3 py-2 text-xs font-bold text-forest hover:bg-sand"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    QR y Micro-URL
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
