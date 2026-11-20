"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Compass,
  ExternalLink,
  Layers,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { ORGANIZATIONS, Organization, PRODUCTS, REGIONAL_HUBS } from "@/data/mfscData";
import { assetUrl } from "@/lib/paths";

function buildHubArcsGeoJson(): GeoJSON.FeatureCollection {
  const hubById = Object.fromEntries(REGIONAL_HUBS.map((h) => [h.id, h]));
  return {
    type: "FeatureCollection",
    features: ORGANIZATIONS.map((org) => {
      const hub = hubById[org.hubId];
      return {
        type: "Feature",
        properties: { hubId: org.hubId, sigla: org.sigla },
        geometry: {
          type: "LineString",
          coordinates: [
            [org.lng, org.lat],
            [hub.center[1], hub.center[0]],
          ],
        },
      };
    }),
  };
}

function buildOrgsPointsGeoJson(): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: ORGANIZATIONS.map((org) => ({
      type: "Feature",
      properties: {
        id: org.id,
        sigla: org.sigla,
        municipio: org.municipio,
        departamento: org.departamento,
        hubName: org.hubName,
        seal: org.seal,
        color:
          org.seal === "Sello Diferenciado"
            ? "#E2A647"
            : org.seal === "Legalidad Vigente"
              ? "#2CA56D"
              : "#E06A43",
      },
      geometry: {
        type: "Point",
        coordinates: [org.lng, org.lat],
      },
    })),
  };
}

export default function MapaTerritorialPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedHubId, setSelectedHubId] = useState<string>("ALL");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [mapMode, setMapMode] = useState<"satellite" | "editorial">("satellite");
  const [mapError, setMapError] = useState<string | null>(null);

  const visibleOrgs = useMemo(() => {
    if (selectedHubId === "ALL") return ORGANIZATIONS;
    return ORGANIZATIONS.filter((o) => o.hubId === selectedHubId);
  }, [selectedHubId]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: maplibregl.Map | null = null;
    try {
      const rasterSources: Record<string, maplibregl.SourceSpecification> =
        mapMode === "satellite"
          ? {
              baseTiles: {
                type: "raster",
                tiles: [
                  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                ],
                tileSize: 256,
                attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics",
              },
              labelTiles: {
                type: "raster",
                tiles: [
                  "https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png",
                ],
                tileSize: 256,
                attribution: "&copy; OpenStreetMap &copy; CARTO",
              },
            }
          : {
              baseTiles: {
                type: "raster",
                tiles: [
                  "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
                  "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
                ],
                tileSize: 256,
                attribution: "&copy; OpenStreetMap &copy; CARTO",
              },
            };

      // Declare GeoJSON sources & layers directly inside initial style so all 30 pins render on Frame 1!
      const style: maplibregl.StyleSpecification = {
        version: 8,
        sources: {
          ...rasterSources,
          "hub-arcs": {
            type: "geojson",
            data: buildHubArcsGeoJson(),
          },
          "orgs-points": {
            type: "geojson",
            data: buildOrgsPointsGeoJson(),
          },
        },
        layers: [
          { id: "base-layer", type: "raster", source: "baseTiles" },
          ...(mapMode === "satellite"
            ? ([
                {
                  id: "labels-layer",
                  type: "raster",
                  source: "labelTiles",
                  paint: { "raster-opacity": 0.92 },
                },
              ] as maplibregl.LayerSpecification[])
            : []),
          {
            id: "hub-arcs-layer",
            type: "line",
            source: "hub-arcs",
            paint: {
              "line-color": mapMode === "satellite" ? "#F7DEC0" : "#C65D3E",
              "line-width": 2,
              "line-opacity": 0.78,
              "line-dasharray": [3, 2],
            },
          },
          {
            id: "orgs-halo",
            type: "circle",
            source: "orgs-points",
            paint: {
              "circle-radius": 16,
              "circle-color": ["get", "color"],
              "circle-opacity": 0.32,
            },
          },
          {
            id: "orgs-circles",
            type: "circle",
            source: "orgs-points",
            paint: {
              "circle-radius": 9,
              "circle-color": ["get", "color"],
              "circle-stroke-width": 2.6,
              "circle-stroke-color": "#FFFFFF",
            },
          },
        ],
      };

      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style,
        center: [-74.1, 4.6],
        zoom: 5.1,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      const hoverPopup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 14,
      });

      map.on("mouseenter", "orgs-circles", (e) => {
        if (!map || !e.features?.[0]) return;
        map.getCanvas().style.cursor = "pointer";
        const props = e.features[0].properties;
        const geom = e.features[0].geometry as GeoJSON.Point;
        hoverPopup
          .setLngLat(geom.coordinates as [number, number])
          .setHTML(
            `<div style="font-family:system-ui,sans-serif;color:#143326;padding:3px 6px;">
              <strong style="font-size:12px;">${props.sigla}</strong><br/>
              <span style="font-size:11px;color:#5F5954;">${props.municipio}, ${props.departamento}</span>
            </div>`
          )
          .addTo(map);
      });

      map.on("mouseleave", "orgs-circles", () => {
        if (!map) return;
        map.getCanvas().style.cursor = "";
        hoverPopup.remove();
      });

      map.on("click", "orgs-circles", (e) => {
        const id = e.features?.[0]?.properties?.id;
        const found = ORGANIZATIONS.find((o) => o.id === id);
        if (found) {
          setSelectedOrg(found);
          map?.flyTo({
            center: [found.lng, found.lat],
            zoom: 8.6,
            duration: 1100,
            essential: true,
          });
        }
      });

      mapRef.current = map;
      const t = setTimeout(() => map?.resize(), 300);
      return () => {
        clearTimeout(t);
        hoverPopup.remove();
        map?.remove();
        mapRef.current = null;
      };
    } catch {
      setMapError(
        "No se pudo inicializar WebGL en este navegador. Puedes explorar todas las organizaciones y sus 6 Hubs desde el panel lateral."
      );
    }
  }, [mapMode]);

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
      zoom: 8.8,
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="inline-flex shrink-0 items-center gap-1.5 pr-2 text-xs font-bold uppercase tracking-wider text-amber-200">
              <Compass className="h-4 w-4" />
              6 Hubs:
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

          <button
            type="button"
            onClick={() =>
              setMapMode((m) => (m === "satellite" ? "editorial" : "satellite"))
            }
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
          >
            <Layers className="h-3.5 w-3.5 text-amber-200" />
            {mapMode === "satellite" ? "Vista: Satelital + Fronteras" : "Vista: Mapa Limpio"}
          </button>
        </div>
      </div>

      {/* Split View: 65% MapLibre GL + 35% Synchronized Territory Sidebar */}
      <div className="mx-auto grid max-w-7xl lg:grid-cols-12">
        <div className="relative h-[54vh] min-h-[380px] w-full bg-night lg:col-span-8 lg:h-[calc(100vh-124px)]">
          {mapError ? (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-cream/80">
              {mapError}
            </div>
          ) : (
            <div ref={mapContainerRef} className="h-full w-full" />
          )}

          <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white/15 bg-night/90 px-3.5 py-2.5 text-[11px] text-cream backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E2A647]" /> Sello Diferenciado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2CA56D]" /> Legalidad Vigente
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E06A43]" /> Aval Comunitario
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
                  className="h-44 w-full object-cover"
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
                    href={`https://wa.me/57${selectedOrg.wa}?text=${encodeURIComponent(`Hola ${selectedOrg.sigla}, los ubiqué en el Mapa Satelital de la Vitrina Soberana MFSC.`)}`}
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
