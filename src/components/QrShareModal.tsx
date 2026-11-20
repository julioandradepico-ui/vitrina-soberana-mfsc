"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, MessageCircle, X } from "lucide-react";
import { Organization } from "@/data/mfscData";
import { BASE_PATH } from "@/lib/paths";

interface Props {
  org: Organization | null;
  onClose: () => void;
}

export function QrShareModal({ org, onClose }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" && org
      ? `${window.location.origin}${BASE_PATH}/org/${org.slug}`
      : org
        ? `https://vitrinamfsc.vercel.app/org/${org.slug}`
        : "";

  useEffect(() => {
    if (!org || !shareUrl) return;
    QRCode.toDataURL(shareUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#143326", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, [org, shareUrl]);

  if (!org) return null;

  const copyLink = async () => {
    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadShareCardPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1100;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Warm editorial card background
    ctx.fillStyle = "#F6F3EC";
    ctx.fillRect(0, 0, 900, 1100);

    // Forest header
    ctx.fillStyle = "#143326";
    ctx.fillRect(0, 0, 900, 260);

    ctx.fillStyle = "#E4DED2";
    ctx.font = "600 22px system-ui, sans-serif";
    ctx.fillText("VITRINA SOBERANA · MESA NACIONAL MFSC", 60, 85);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 52px Georgia, serif";
    ctx.fillText(org.sigla.slice(0, 24), 60, 165);

    ctx.fillStyle = "#D4E4DC";
    ctx.font = "500 26px system-ui, sans-serif";
    ctx.fillText(`${org.municipio}, ${org.departamento} · ${org.hubName}`, 60, 215);

    // QR Image centered
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(240, 320, 420, 420);
      ctx.drawImage(qrImg, 270, 350, 360, 360);

      ctx.fillStyle = "#143326";
      ctx.font = "bold 30px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("Escanea para ver nuestro catálogo y cotizar", 450, 825);

      ctx.fillStyle = "#C65D3E";
      ctx.font = "600 24px system-ui, sans-serif";
      ctx.fillText(shareUrl.replace(/^https?:\/\//, ""), 450, 880);

      ctx.fillStyle = "#5F5954";
      ctx.font = "500 22px system-ui, sans-serif";
      ctx.fillText(org.razonSocial.slice(0, 58), 450, 955);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `Tarjeta_${org.slug}_MFSC.png`;
      a.click();
    };
    qrImg.src = qrDataUrl;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-forest px-5 py-4 text-white">
          <div>
            <h3 className="font-serif text-lg font-bold">Kit de Difusión · {org.sigla}</h3>
            <p className="text-xs text-cream/80">QR real escaneable y enlace para WhatsApp</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
            aria-label="Cerrar kit"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center p-6 text-center">
          {qrDataUrl && (
            <div className="rounded-2xl border border-line bg-white p-3 shadow-xs">
              <img
                src={qrDataUrl}
                alt={`Código QR real de ${org.sigla}`}
                className="h-52 w-52"
              />
            </div>
          )}

          <p className="mt-4 text-xs text-muted">
            Comparte tu micro-sitio en estados de WhatsApp, biografía de Instagram o imprímelo para ferias.
          </p>

          <div className="mt-3 flex w-full gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-xl border border-line bg-white px-3 py-2 text-xs text-bark"
            />
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-1 rounded-xl bg-forest px-3.5 py-2 text-xs font-bold text-white hover:bg-moss"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>

          <div className="mt-4 grid w-full grid-cols-2 gap-2.5">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Conoce nuestros bienes y servicios sostenibles de ${org.sigla} en la Vitrina de la Mesa Nacional de Manejo Forestal Sostenible Comunitario: ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-moss px-3 py-2.5 text-xs font-bold text-white hover:bg-forest"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={downloadShareCardPng}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-terracotta px-3 py-2.5 text-xs font-bold text-white hover:bg-terracotta-dark"
            >
              <Download className="h-4 w-4" />
              Tarjeta PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
