"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/paths";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";

export function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, removeFromCart, updateCartQty, clearCart } =
    useMarketplace();
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  // Group cart items by organization so buyer sends clean direct quotes
  const grouped = cart.reduce<Record<string, typeof cart>>((acc, entry) => {
    const key = entry.product.orgId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const buildMsg = (entries: typeof cart) => {
    const org = entries[0].product.orgSigla;
    const lines = entries
      .map((e) => `• ${e.product.title} (Cantidad: ${e.quantity})`)
      .join("\n");
    return `Hola ${org}, les escribo desde la Vitrina Soberana MFSC para cotizar:\n${lines}\nDestino: ${city || "Por definir"}${notes ? `\nNotas: ${notes}` : ""}`;
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-forest/50 backdrop-blur-xs"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            aria-label="Lista de cotización consolidada"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line bg-forest px-5 py-4 text-cream">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <div>
                  <h2 className="font-serif text-lg font-bold text-white">
                    Mi Lista de Cotización
                  </h2>
                  <p className="text-xs text-cream/80">
                    Consolidación directa por asociación y Hub regional
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                aria-label="Cerrar panel de cotización"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
                  <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted/40" />
                  <p className="font-serif text-base font-bold text-forest">
                    Aún no has agregado productos
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Selecciona uno o varios productos de la vitrina para armar una
                    cotización directa por WhatsApp o correo.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-xl border border-line bg-white p-3.5 space-y-2.5">
                    <div>
                      <label className="block text-xs font-bold text-forest mb-1">
                        Ciudad o municipio de destino
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ej. Bogotá, Medellín, Cali, Barranquilla..."
                        className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-moss focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-forest mb-1">
                        Especificaciones generales (opcional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej. Madera seca al 12%, empaque mayorista..."
                        className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-moss focus:outline-none"
                      />
                    </div>
                  </div>

                  {Object.entries(grouped).map(([orgId, entries]) => {
                    const first = entries[0].product;
                    const msg = buildMsg(entries);
                    return (
                      <div
                        key={orgId}
                        className="rounded-2xl border border-line bg-white p-4 shadow-xs"
                      >
                        <div className="mb-3 flex items-start justify-between gap-2 border-b border-line pb-2.5">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wide text-terracotta">
                              {first.orgSigla}
                            </span>
                            <p className="text-xs text-muted">
                              {first.municipio}, {first.departamento} · {first.hubName}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {entries.map((e) => (
                            <div key={e.product.id} className="flex items-start gap-3">
                              <img
                                src={assetUrl(e.product.image)}
                                alt={e.product.title}
                                className="h-14 w-14 rounded-lg object-cover shrink-0 border border-line"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-forest line-clamp-2">
                                  {e.product.title}
                                </p>
                                <input
                                  type="text"
                                  value={e.quantity}
                                  onChange={(ev) =>
                                    updateCartQty(e.product.id, ev.target.value)
                                  }
                                  aria-label={`Cantidad para ${e.product.title}`}
                                  className="mt-1.5 w-full rounded-md border border-line bg-sand/60 px-2 py-1 text-xs"
                                  placeholder={`Cantidad (${e.product.unitLabel})`}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(e.product.id)}
                                className="p-1.5 text-muted hover:text-terracotta"
                                aria-label="Quitar producto"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3.5 flex flex-wrap gap-2">
                          {first.wa ? (
                            <a
                              href={`https://wa.me/57${first.wa}?text=${encodeURIComponent(msg)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-moss px-3 py-2 text-xs font-bold text-white hover:bg-forest"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Cotizar por WhatsApp
                            </a>
                          ) : null}
                          {first.email ? (
                            <a
                              href={`mailto:${first.email}?subject=${encodeURIComponent(`Cotización Vitrina MFSC - ${first.orgSigla}`)}&body=${encodeURIComponent(msg)}`}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-forest px-3 py-2 text-xs font-bold text-forest hover:bg-sand"
                            >
                              <Mail className="h-4 w-4" />
                              Enviar Correo
                            </a>
                          ) : null}
                          {!first.wa && !first.email && (
                            <button
                              type="button"
                              onClick={() => navigator.clipboard?.writeText(msg)}
                              className="w-full rounded-xl bg-terracotta px-3 py-2 text-xs font-bold text-white hover:bg-terracotta-dark"
                            >
                              Copiar solicitud para Mesa MFSC
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-line bg-white px-5 py-3 flex justify-between items-center">
                <span className="text-xs text-muted">
                  {cart.length} producto(s) seleccionado(s)
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-terracotta hover:underline"
                >
                  Vaciar lista
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
