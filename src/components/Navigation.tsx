"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MapPin, Network, PlusCircle, ShoppingBag, Store } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";

const NAV_ITEMS = [
  { href: "/", label: "Vitrina", icon: Store },
  { href: "/mapa", label: "Mapa Territorial", icon: MapPin },
  { href: "/grafo", label: "Grafo y Articulación", icon: Network },
];

export function Navigation() {
  const pathname = usePathname();
  const { cart, setCartOpen } = useMarketplace();

  // Hide chrome on /embed/* routes for clean federation inside ExpoBosques
  if (pathname?.startsWith("/embed")) return null;

  return (
    <>
      {/* Desktop & Tablet Editorial Topbar */}
      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-cream font-serif text-lg font-bold shadow-sm transition-transform group-hover:scale-105">
              M
            </span>
            <div className="leading-tight">
              <span className="block font-serif text-base font-bold text-forest">
                Vitrina de Forestería Comunitaria
              </span>
              <span className="hidden text-[11px] font-medium text-muted sm:block">
                Manejo Forestal Sostenible Comunitario · 16 Departamentos
              </span>
            </div>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-forest text-cream"
                      : "text-bark hover:bg-sand hover:text-forest"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex min-h-[42px] items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-forest shadow-xs transition hover:border-moss hover:bg-sand"
              aria-label="Abrir lista de cotización"
            >
              <ShoppingBag className="h-4 w-4 text-moss" />
              <span className="hidden sm:inline">Cotizar</span>
              {cart.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-xs font-bold text-white tabular-nums">
                  {cart.length}
                </span>
              )}
            </button>

            <Link
              href="/sumar"
              className="flex min-h-[42px] items-center gap-1.5 rounded-xl bg-terracotta px-3.5 py-2 text-sm font-bold text-white shadow-xs transition hover:bg-terracotta-dark"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Sumar mi Negocio</span>
              <span className="sm:hidden">Sumar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile-First Bottom Navigation Bar (Thumb Ergonomics <768px) */}
      <nav
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-line bg-cream/95 px-2 py-1.5 backdrop-blur-md md:hidden"
      >
        <Link
          href="/"
          className={`flex min-h-[48px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-semibold ${
            pathname === "/" ? "text-forest" : "text-muted"
          }`}
        >
          <Store className="h-5 w-5" />
          <span>Vitrina</span>
        </Link>

        <Link
          href="/mapa"
          className={`flex min-h-[48px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-semibold ${
            pathname === "/mapa" ? "text-forest" : "text-muted"
          }`}
        >
          <Compass className="h-5 w-5" />
          <span>Mapa</span>
        </Link>

        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex min-h-[48px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-semibold text-muted"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Cotizar</span>
          {cart.length > 0 && (
            <span className="absolute right-2.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-white">
              {cart.length}
            </span>
          )}
        </button>

        <Link
          href="/sumar"
          className={`flex min-h-[48px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-bold ${
            pathname === "/sumar" ? "text-terracotta-dark" : "text-terracotta"
          }`}
        >
          <PlusCircle className="h-5 w-5" />
          <span>+ Sumar</span>
        </Link>
      </nav>
    </>
  );
}
