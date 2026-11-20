"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/paths";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Download,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { ProductCategory, ProductItem, REGIONAL_HUBS } from "@/data/mfscData";
import { useMarketplace } from "@/context/MarketplaceContext";

const CATEGORIES: ProductCategory[] = [
  "Maderables",
  "PFNM",
  "Agroforestales",
  "Artesanías",
  "Viveros",
  "Servicios Ambientales",
];

export default function SumarNegocioPage() {
  const { addCustomProduct } = useMarketplace();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submittedItem, setSubmittedItem] = useState<ProductItem | null>(null);

  const [sigla, setSigla] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [hubId, setHubId] = useState(REGIONAL_HUBS[2].id);

  const [category, setCategory] = useState<ProductCategory>("Maderables");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceLabel, setPriceLabel] = useState("Bajo cotización");
  const [unitLabel, setUnitLabel] = useState("m³ / kg / unidad");
  const [photoData, setPhotoData] = useState("/images/productos/prod_amazonia_bosque.jpg");

  const [wa, setWa] = useState("");
  const [web, setWeb] = useState("");

  const hubObj = REGIONAL_HUBS.find((h) => h.id === hubId) || REGIONAL_HUBS[0];

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWa = wa.replace(/\D/g, "").slice(-10);
    const slug = sigla.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const item: ProductItem = {
      id: `NEW-${Date.now()}`,
      orgId: `NEW-${slug}`,
      orgSlug: slug || "nueva-org",
      orgSigla: sigla.trim() || "Asociación Comunitaria",
      municipio: municipio.trim() || "Colombia",
      departamento: departamento.trim() || "",
      hubId,
      hubName: hubObj.name,
      category,
      title: title.trim() || "Producto Forestal Sostenible",
      description:
        description.trim() ||
        "Oferta registrada directamente por la asociación para la Vitrina Soberana MFSC.",
      image: photoData,
      priceLabel: priceLabel.trim() || "Bajo cotización",
      unitLabel: unitLabel.trim() || "A convenir",
      certLabel: "En verificación Mesa MFSC",
      seal: "Nuevo · Pendiente aval",
      availability: "Recién registrado",
      web: web.trim(),
      wa: cleanWa,
      email: "",
      lat: hubObj.center[0],
      lng: hubObj.center[1],
      graphNodes: ["ENAB_COMMUNITY_GOV", "OUT_MARKET_ACCESS"],
      isCustom: true,
    };
    addCustomProduct(item);
    setSubmittedItem(item);
  };

  const downloadJson = () => {
    if (!submittedItem) return;
    const clean = { ...submittedItem };
    if (clean.image.startsWith("data:")) clean.image = "[foto_adjunta_local]";
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `postulacion_${clean.orgSlug}.json`;
    a.click();
  };

  if (submittedItem) {
    const waText = `Nueva postulación Vitrina Soberana MFSC:%0A• Asociación: ${submittedItem.orgSigla}%0A• Ubicación: ${submittedItem.municipio}, ${submittedItem.departamento} (${submittedItem.hubName})%0A• Producto: ${submittedItem.title} (${submittedItem.category})%0A• Precio: ${submittedItem.priceLabel}%0A• WhatsApp: ${submittedItem.wa}`;
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-3xl border border-line bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-14 w-14 text-moss" />
          <h1 className="mt-4 font-serif text-3xl font-bold text-forest">
            ¡Tu producto ya está en vista previa!
          </h1>
          <p className="mt-2 text-sm text-muted">
            Ya puedes ver la tarjeta de <strong>{submittedItem.orgSigla}</strong> al principio de la Vitrina. Envía ahora esta ficha a la Secretaría Técnica de la Mesa MFSC para su publicación oficial para todo el país.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-moss px-5 py-2.5 text-sm font-bold text-white hover:bg-forest"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar a la Mesa por WhatsApp
            </a>
            <button
              type="button"
              onClick={downloadJson}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line bg-cream px-5 py-2.5 text-sm font-bold text-forest hover:bg-sand"
            >
              <Download className="h-4 w-4" />
              Descargar Ficha JSON
            </button>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-terracotta px-5 py-2.5 text-sm font-bold text-white hover:bg-terracotta-dark"
            >
              Ver mi tarjeta en la Vitrina →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
          Ingreso Abierto · Cero Fricción · 2 Minutos desde el Celular
        </span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-forest">
          Suma tu organización o producto a la Vitrina MFSC
        </h1>
        <p className="mt-1 text-sm text-muted">
          Previsualiza en tiempo real cómo verán los compradores tu tarjeta antes de enviarla a la Mesa Nacional.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-6 flex items-center gap-2 text-xs font-bold">
        {[
          { n: 1, label: "1. Tu Asociación" },
          { n: 2, label: "2. Tu Producto y Foto" },
          { n: 3, label: "3. WhatsApp y Publicar" },
        ].map((s) => (
          <button
            key={s.n}
            type="button"
            onClick={() => setStep(s.n as 1 | 2 | 3)}
            className={`rounded-full px-4 py-2 transition ${
              step === s.n
                ? "bg-forest text-cream"
                : step > s.n
                  ? "bg-moss/20 text-forest"
                  : "bg-white text-muted border border-line"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <form
          onSubmit={handlePublish}
          className="rounded-3xl border border-line bg-white p-6 shadow-xs lg:col-span-7"
        >
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Nombre o Sigla de la Asociación *
                </label>
                <input
                  required
                  value={sigla}
                  onChange={(e) => setSigla(e.target.value)}
                  placeholder="Ej. ASOBOSQUES UNILLA"
                  className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Municipio *
                  </label>
                  <input
                    required
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    placeholder="Ej. El Retorno"
                    className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Departamento *
                  </label>
                  <input
                    required
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    placeholder="Ej. Guaviare"
                    className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Hub Regional más cercano
                </label>
                <select
                  value={hubId}
                  onChange={(e) => setHubId(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                >
                  {REGIONAL_HUBS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.region})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-sm font-bold text-white hover:bg-moss"
              >
                Continuar a Producto <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Categoría *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Precio o esquema
                  </label>
                  <input
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    placeholder="Ej. $32.000 COP / kg o Bajo cotización"
                    className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Nombre del Producto o Servicio *
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Pulpa de Copoazú Congelada / Madera Seca de Abarco"
                  className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Descripción corta (especie, empaque, calidad)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cuéntale al comprador qué hace especial tu producto..."
                  className="w-full rounded-xl border border-line bg-cream p-3.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Foto real del producto (desde tu cámara o galería)
                </label>
                <label className="flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-moss/40 bg-sand/60 px-4 py-3 text-xs font-bold text-forest hover:bg-sand">
                  <Camera className="h-4 w-4 text-terracotta" />
                  Seleccionar o tomar fotografía
                  <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                </label>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line px-4 py-2 text-sm font-bold text-forest"
                >
                  <ArrowLeft className="h-4 w-4" /> Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-sm font-bold text-white hover:bg-moss"
                >
                  Continuar a Contacto <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Número de WhatsApp comercial (10 dígitos) *
                </label>
                <input
                  required
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                  placeholder="Ej. 3125551234"
                  className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Unidad de venta
                </label>
                <input
                  value={unitLabel}
                  onChange={(e) => setUnitLabel(e.target.value)}
                  placeholder="Ej. m³, kg, frasco 250 ml, pieza"
                  className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Sitio web, Instagram o Facebook (opcional)
                </label>
                <input
                  type="url"
                  value={web}
                  onChange={(e) => setWeb(e.target.value)}
                  placeholder="https://..."
                  className="w-full min-h-[44px] rounded-xl border border-line bg-cream px-3.5 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line px-4 py-2 text-sm font-bold text-forest"
                >
                  <ArrowLeft className="h-4 w-4" /> Atrás
                </button>
                <button
                  type="submit"
                  className="inline-flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-2.5 text-sm font-bold text-white hover:bg-terracotta-dark"
                >
                  Publicar en Vista Previa
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Live Real-Time Card Preview */}
        <aside className="lg:col-span-5">
          <div className="sticky top-24">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
              Vista previa en tiempo real
            </span>
            <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-md">
              <div className="relative aspect-[4/3] bg-sand">
                <img src={assetUrl(photoData)} alt="Vista previa" className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-forest/90 px-2.5 py-1 text-[11px] font-bold text-white">
                  {category}
                </span>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-50/95 px-2.5 py-1 text-[11px] font-bold text-terracotta-dark">
                  <ShieldCheck className="h-3 w-3" /> Nuevo · Pendiente aval
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between text-xs">
                  <strong className="text-terracotta">
                    {sigla || "NOMBRE DE TU ASOCIACIÓN"}
                  </strong>
                  <span className="text-muted">
                    {municipio || "Municipio"}, {departamento || "Depto"}
                  </span>
                </div>
                <h3 className="mt-1.5 font-serif text-lg font-bold text-forest">
                  {title || "Título de tu producto o servicio"}
                </h3>
                <p className="mt-1 text-xs text-muted line-clamp-2">
                  {description || "Aquí aparecerá la descripción corta de tu producto para compradores."}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-cream p-2.5 text-[11px]">
                  <div>
                    <span className="block text-muted">Precio</span>
                    <strong className="text-forest">{priceLabel || "Bajo cotización"}</strong>
                  </div>
                  <div>
                    <span className="block text-muted">Hub</span>
                    <strong className="text-bark">{hubObj.name}</strong>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </main>
  );
}
