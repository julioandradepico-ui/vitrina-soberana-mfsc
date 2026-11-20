"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { assetUrl } from "@/lib/paths";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import { Compass, ExternalLink, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { ORGANIZATIONS, Organization, PRODUCTS, REGIONAL_HUBS } from "@/data/mfscData";

export default function MapaTerritorialPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedHubId, setSelectedHubId] = useState<string>("ALL");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const visibleOrgs = useMemo(() => {
    if (selectedHubId === "ALL") return ORGANIZATIONS;
    return ORGANIZATIONS.filter((o) => o.hubId === selectedHubId);
  }, [selectedHubId]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          cartoDark: {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap &copy; CARTO",
          },
        },
        layers: [
          {
            id: "carto-layer",
            type: "raster",
            source: "cartoDark",
          },
        ],
      },
      center: [-74.1, 4.6],
      zoom: 5.1,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    ORGANIZATIONS.forEach((org) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className =
        "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-125 cursor-pointer";
      el.style.backgroundColor =
        org.seal === "Sello Diferenciado"
          ? "#B9833C"
          : org.seal === "Legalidad Vigente"
            ? "#143326"
            : "#C65D3E";
      el.title = `${org.sigla} (${org.municipio}, ${org.departamento})`;
      el.innerHTML = `<span style="width:8px;height:8px;border-radius:999px;background:#fff;display:block"></span>`;

      el.addEventListener("click", () => {
        setSelectedOrg(org);
        map.flyTo({
          center: [org.lng, org.lat],
          zoom: 8.2,
          duration: 1200,
          essential: true,
        });
      });

      new maplibregl.Marker({ element: el })
        .setLngLat([org.lng, org.lat])
        .addTo(map);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const flyToHub = (hubId: string) => {
    setSelectedHubId(hubId);
    setSelectedOrg(null);
    const map = mapRef.current;
    if (!map) return;
    if (hubId === "ALL") {
      map.flyTo({ center: [-74.1, 4.6], zoom: 5.1, duration: 1100 });
      return;
    }
    const hub = REGIONAL_HUBS.find((h) => h.id === hubId);
    if (hub) {
      map.flyTo({
        center: [hub.center[1], hub.center[0]],
        zoom: hub.zoom,
        duration: 1200,
      });
    }
  };

  const flyToOrg = (org: Organization) => {
    setSelectedOrg(org);
    mapRef.current?.flyTo({
      center: [org.lng, org.lat],
      zoom: 8.5,
      duration: 1100,
    });
  };

  const selectedOrgProducts = selectedOrg
    ? PRODUCTS.filter((p) => p.orgId === selectedOrg.id)
    : [];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-night text-cream">
      {/* Hub Selector Ribbon */}
      <div className="border-b border-white/10 bg-night-card px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="inline-flex shrink-0 items-center gap-1.5 pr-2 text-xs font-bold uppercase tracking-wider text-amber-200">
            <Compass className="h-4 w-4" />
            6 Hubs Regionales:
          </span>
          <button
            type="button"
            onClick={() => flyToHub("ALL")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              selectedHubId === "ALL"
                ? "bg-terracotta text-white"
                : "border border-white/15 bg-white/5 text-cream/85 hover:bg-white/15"
            }`}
          >
            Toda Colombia (30)
          </button>
          {REGIONAL_HUBS.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => flyToHub(h.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedHubId === h.id
                  ? "bg-terracotta text-white"
                  : "border border-white/15 bg-white/5 text-cream/85 hover:bg-white/15"
              }`}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>

      {/* Split View: 65% MapLibre GL + 35% Synchronized Territory Sidebar */}
      <div className="mx-auto grid max-w-7xl lg:grid-cols-12">
        <div className="relative h-[52vh] lg:col-span-8 lg:h-[calc(100vh-124px)]">
          <div ref={mapContainerRef} className="h-full w-full" />
          {/* Legend */}
          <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white/15 bg-night/90 px-3.5 py-2.5 text-[11px] text-cream backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Sello Diferenciado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-forest border border-white/50" /> Legalidad Vigente
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-terracotta" /> Aval Comunitario
              </span>
            </div>
          </div>
        </div>

        <aside className="flex flex-col border-t border-white/10 bg-night-card lg:col-span-4 lg:h-[calc(100vh-124px)] lg:border-l lg:border-t-0">
          {selectedOrg ? (
            <div className="flex-1 overflow-y-auto p-5">
              <button
                type="button"
                onClick={() => setSelectedOrg(null)}
                className="text-xs font-bold text-amber-200 hover:underline"
              >
                ← Volver al listado ({visibleOrgs.length})
              </button>

              <div className="mt-3 overflow-hidden rounded-2xl border border-white/15">
                <img
                  src={assetUrl(selectedOrg.heroImage)}
                  alt={selectedOrg.sigla}
                  className="h-40 w-full object-cover"
                />
              </div>

              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-200">
                <ShieldCheck className="h-3.5 w-3.5" /> {selectedOrg.seal}
              </span>
              <h2 className="mt-1.5 font-serif text-2xl font-bold text-white">
                {selectedOrg.sigla}
              </h2>
              <p className="text-xs text-cream/75">{selectedOrg.razonSocial}</p>

              <p className="mt-3 flex items-center gap-1.5 text-xs text-cream/90">
                <MapPin className="h-4 w-4 text-terracotta shrink-0" />
                {selectedOrg.municipio}, {selectedOrg.departamento} · {selectedOrg.hubName}
              </p>

              <div className="mt-4 rounded-xl border border-white/10 bg-night p-3.5 text-xs text-cream/85">
                <strong className="block text-amber-200">Articulación Logística</strong>
                <p className="mt-1 leading-relaxed">{selectedOrg.logisticaDetalle}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/org/${selectedOrg.slug}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-terracotta px-3 py-2.5 text-xs font-bold text-white hover:bg-terracotta-dark"
                >
                  Abrir Micro-Sitio <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                {selectedOrg.wa && (
                  <a
                    href={`https://wa.me/57${selectedOrg.wa}?text=${encodeURIComponent(`Hola ${selectedOrg.sigla}, los ubiqué en el Mapa de la Vitrina Soberana MFSC.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-moss px-3 py-2.5 text-xs font-bold text-white hover:bg-forest"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
              </div>

              {selectedOrgProducts.length > 0 && (
                <div className="mt-5 space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cream/70">
                    Oferta ({selectedOrgProducts.length})
                  </h3>
                  {selectedOrgProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-night p-2.5"
                    >
                      <img
                        src={assetUrl(p.image)}
                        alt={p.title}
                        className="h-12 w-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white">{p.title}</p>
                        <p className="text-[11px] text-amber-200">{p.priceLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <h1 className="font-serif text-lg font-bold text-white">
                {selectedHubId === "ALL"
                  ? "30 Organizaciones en 16 Departamentos"
                  : REGIONAL_HUBS.find((h) => h.id === selectedHubId)?.name}
              </h1>
              {selectedHubId !== "ALL" && (
                <p className="mt-1 text-xs leading-relaxed text-cream/75">
                  {REGIONAL_HUBS.find((h) => h.id === selectedHubId)?.summary}
                </p>
              )}

              <div className="mt-4 space-y-2">
                {visibleOrgs.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => flyToOrg(o)}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-night/80 p-3 text-left transition hover:border-terracotta/60 hover:bg-night"
                  >
                    <img
                      src={assetUrl(o.heroImage)}
                      alt={o.sigla}
                      className="h-11 w-11 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{o.sigla}</p>
                      <p className="truncate text-xs text-cream/70">
                        {o.municipio}, {o.departamento}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-200 shrink-0">
                      Volar →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
