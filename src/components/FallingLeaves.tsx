"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Wind } from "lucide-react";

type LeafKind = "yarumo" | "helecho" | "cedro" | "guayacan" | "laurel";

interface LeafSpec {
  id: number;
  kind: LeafKind;
  leftPct: number;
  delaySec: number;
  durationSec: number;
  sizePx: number;
  driftX: number;
  rotZStart: number;
  rotZEnd: number;
  rotYEnd: number;
  blur: boolean;
  opacity: number;
}

// 22 smaller, more intricate leaves falling naturally along the edges & drifting softly toward center
const FALLING_LEAVES: LeafSpec[] = [
  // Left border stream
  { id: 1, kind: "laurel", leftPct: 2, delaySec: 0.0, durationSec: 11.5, sizePx: 28, driftX: 46, rotZStart: -20, rotZEnd: 45, rotYEnd: 160, blur: false, opacity: 0.88 },
  { id: 2, kind: "helecho", leftPct: 6, delaySec: 1.8, durationSec: 13.0, sizePx: 34, driftX: 58, rotZStart: 12, rotZEnd: -38, rotYEnd: -120, blur: false, opacity: 0.82 },
  { id: 3, kind: "guayacan", leftPct: 11, delaySec: 3.4, durationSec: 10.5, sizePx: 22, driftX: 72, rotZStart: -30, rotZEnd: 65, rotYEnd: 210, blur: false, opacity: 0.84 },
  { id: 4, kind: "yarumo", leftPct: 4, delaySec: 5.1, durationSec: 14.0, sizePx: 36, driftX: 44, rotZStart: 18, rotZEnd: -28, rotYEnd: 95, blur: true, opacity: 0.65 },
  { id: 5, kind: "cedro", leftPct: 14, delaySec: 6.7, durationSec: 12.2, sizePx: 32, driftX: 62, rotZStart: -15, rotZEnd: 52, rotYEnd: -170, blur: false, opacity: 0.78 },
  { id: 6, kind: "laurel", leftPct: 8, delaySec: 8.4, durationSec: 11.8, sizePx: 24, driftX: 55, rotZStart: 24, rotZEnd: -48, rotYEnd: 140, blur: true, opacity: 0.68 },
  { id: 7, kind: "guayacan", leftPct: 18, delaySec: 2.5, durationSec: 13.6, sizePx: 20, driftX: 88, rotZStart: -12, rotZEnd: 74, rotYEnd: 190, blur: false, opacity: 0.76 },

  // Gentle central canopy drift (smaller & airy so text stays crisp)
  { id: 8, kind: "guayacan", leftPct: 29, delaySec: 1.1, durationSec: 14.5, sizePx: 20, driftX: 78, rotZStart: -18, rotZEnd: 58, rotYEnd: 180, blur: false, opacity: 0.66 },
  { id: 9, kind: "laurel", leftPct: 44, delaySec: 4.2, durationSec: 15.5, sizePx: 19, driftX: 60, rotZStart: 14, rotZEnd: -52, rotYEnd: -150, blur: true, opacity: 0.52 },
  { id: 10, kind: "cedro", leftPct: 58, delaySec: 2.9, durationSec: 14.8, sizePx: 24, driftX: -65, rotZStart: 20, rotZEnd: -42, rotYEnd: 135, blur: true, opacity: 0.54 },
  { id: 11, kind: "guayacan", leftPct: 71, delaySec: 6.1, durationSec: 13.2, sizePx: 21, driftX: -82, rotZStart: -16, rotZEnd: 62, rotYEnd: -175, blur: false, opacity: 0.68 },

  // Right border stream
  { id: 12, kind: "helecho", leftPct: 84, delaySec: 0.5, durationSec: 12.8, sizePx: 36, driftX: -54, rotZStart: 16, rotZEnd: -34, rotYEnd: 115, blur: false, opacity: 0.85 },
  { id: 13, kind: "laurel", leftPct: 91, delaySec: 2.1, durationSec: 11.2, sizePx: 26, driftX: -64, rotZStart: -22, rotZEnd: 46, rotYEnd: -180, blur: false, opacity: 0.86 },
  { id: 14, kind: "guayacan", leftPct: 79, delaySec: 3.9, durationSec: 10.8, sizePx: 23, driftX: -74, rotZStart: 26, rotZEnd: -60, rotYEnd: 195, blur: false, opacity: 0.82 },
  { id: 15, kind: "yarumo", leftPct: 94, delaySec: 5.5, durationSec: 13.8, sizePx: 35, driftX: -48, rotZStart: -14, rotZEnd: 32, rotYEnd: -110, blur: true, opacity: 0.66 },
  { id: 16, kind: "cedro", leftPct: 87, delaySec: 7.2, durationSec: 12.4, sizePx: 30, driftX: -68, rotZStart: 18, rotZEnd: -50, rotYEnd: 165, blur: false, opacity: 0.80 },
  { id: 17, kind: "laurel", leftPct: 81, delaySec: 8.9, durationSec: 11.6, sizePx: 22, driftX: -58, rotZStart: -24, rotZEnd: 44, rotYEnd: -145, blur: true, opacity: 0.68 },
  { id: 18, kind: "helecho", leftPct: 96, delaySec: 4.7, durationSec: 13.4, sizePx: 29, driftX: -52, rotZStart: 10, rotZEnd: -40, rotYEnd: 125, blur: false, opacity: 0.78 },
  { id: 19, kind: "guayacan", leftPct: 22, delaySec: 7.9, durationSec: 12.0, sizePx: 18, driftX: 65, rotZStart: -18, rotZEnd: 55, rotYEnd: 170, blur: true, opacity: 0.60 },
  { id: 20, kind: "laurel", leftPct: 75, delaySec: 9.5, durationSec: 12.5, sizePx: 20, driftX: -62, rotZStart: 15, rotZEnd: -48, rotYEnd: -160, blur: false, opacity: 0.72 },
];

function BotanicalLeafSvg({ kind, size }: { kind: LeafKind; size: number }) {
  if (kind === "helecho") {
    // Detailed tropical pinnate fern frond with 11 leaflets
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 5px 8px rgba(8,22,15,0.45))" }}>
        <defs>
          <linearGradient id="g-helecho" x1="10" y1="74" x2="70" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#143825" />
            <stop offset="55%" stopColor="#357A50" />
            <stop offset="100%" stopColor="#85C78C" />
          </linearGradient>
        </defs>
        <path d="M14 72 Q40 40 68 10" stroke="#A8DFB0" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M22 62 C14 55 12 49 18 47 C23 45 28 53 26 58 Z
             M30 53 C20 45 18 37 25 36 C31 35 36 44 34 49 Z
             M38 44 C28 36 27 27 34 27 C40 27 44 36 42 40 Z
             M47 34 C38 27 37 19 44 19 C49 19 52 27 50 31 Z
             M56 24 C49 18 49 12 54 12 C58 12 60 19 58 22 Z
             M25 60 C34 65 42 63 42 57 C42 52 33 51 28 56 Z
             M33 51 C43 56 51 53 50 47 C49 42 40 42 36 47 Z
             M41 42 C51 46 58 43 57 37 C56 32 47 33 44 38 Z
             M50 32 C58 35 64 32 63 27 C62 23 55 24 52 29 Z
             M59 22 C65 24 70 21 69 17 C68 14 63 15 61 19 Z"
          fill="url(#g-helecho)"
        />
      </svg>
    );
  }

  if (kind === "cedro") {
    // Compound tropical cedar/mahogany branchlet with 7 paired leaflets
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 5px 8px rgba(8,22,15,0.42))" }}>
        <defs>
          <linearGradient id="g-cedro3" x1="12" y1="68" x2="68" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#284A29" />
            <stop offset="60%" stopColor="#588749" />
            <stop offset="100%" stopColor="#A9C97B" />
          </linearGradient>
        </defs>
        <path d="M14 68 Q40 42 66 14" stroke="#C8DF9E" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M24 56 C15 48 16 39 24 38 C30 37 33 46 28 53 Z
             M36 44 C26 35 28 26 36 25 C42 25 45 34 40 41 Z
             M48 32 C39 24 41 15 48 15 C53 15 56 23 51 29 Z
             M27 54 C36 61 45 59 45 51 C45 45 36 44 30 50 Z
             M39 42 C48 48 56 46 56 39 C56 33 48 33 42 38 Z
             M51 30 C59 35 66 33 65 27 C65 22 58 22 53 27 Z
             M61 19 C64 10 71 7 73 10 C75 13 70 20 63 21 Z"
          fill="url(#g-cedro3)"
        />
      </svg>
    );
  }

  if (kind === "yarumo") {
    // Intricate Cecropia (Yarumo) palmate leaf with serrated tips & secondary veins
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 6px 10px rgba(8,22,15,0.48))" }}>
        <defs>
          <radialGradient id="g-yarumo3" cx="46%" cy="44%" r="58%">
            <stop offset="0%" stopColor="#8CC998" />
            <stop offset="55%" stopColor="#2F6F4E" />
            <stop offset="100%" stopColor="#133323" />
          </radialGradient>
        </defs>
        <path
          d="M40 6 C44 18 45 26 41 34 C50 23 60 17 70 20 C62 29 55 35 45 40 C56 40 67 44 73 52 C61 53 51 51 43 47 C49 56 52 65 50 72 C44 65 41 57 40 49 C39 57 36 65 30 72 C28 65 31 56 37 47 C29 51 19 53 7 52 C13 44 24 40 35 40 C25 35 18 29 10 20 C20 17 30 23 39 34 C35 26 36 18 40 6 Z"
          fill="url(#g-yarumo3)"
        />
        <path
          d="M40 10 L40 49 M40 40 L65 23 M40 42 L68 50 M40 40 L15 23 M40 42 L12 50 M40 45 L32 67 M40 45 L48 67"
          stroke="#DFF5E5"
          strokeWidth="1.2"
          strokeOpacity="0.72"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "guayacan") {
    // Detailed golden-terracotta Guayacán leaf with specular sunlight highlight & fine lateral veins
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 5px 8px rgba(24,12,6,0.45))" }}>
        <defs>
          <linearGradient id="g-guaya3" x1="8" y1="56" x2="56" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7E351B" />
            <stop offset="50%" stopColor="#CC753F" />
            <stop offset="100%" stopColor="#F5CC7D" />
          </linearGradient>
        </defs>
        <path
          d="M8 56 C10 52 12 49 12 46 C14 26 28 11 54 8 C52 34 37 48 17 50 C14 50 11 53 8 56 Z"
          fill="url(#g-guaya3)"
        />
        <path
          d="M10 54 Q31 32 52 10 M21 43 L23 29 M29 35 L32 21 M37 27 L41 16 M25 39 L39 37 M32 32 L45 29"
          stroke="#FFF1D6"
          strokeWidth="1.1"
          strokeOpacity="0.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Laurel / Cacao leaf with curved margin & central highlight
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 5px 8px rgba(8,22,15,0.42))" }}>
      <defs>
        <linearGradient id="g-laurel3" x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8FD09B" />
          <stop offset="52%" stopColor="#35744F" />
          <stop offset="100%" stopColor="#143323" />
        </linearGradient>
      </defs>
      <path
        d="M32 4 C45 14 50 31 44 45 C40 53 35 57 32 61 C29 57 24 53 20 45 C14 31 19 14 32 4 Z"
        fill="url(#g-laurel3)"
      />
      <path
        d="M32 7 L32 59 M32 18 Q39 21 43 26 M32 28 Q40 31 44 37 M32 38 Q38 41 41 46 M32 18 Q25 21 21 26 M32 28 Q24 31 20 37 M32 38 Q26 41 23 46"
        stroke="#E4F7E9"
        strokeWidth="1.1"
        strokeOpacity="0.72"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FallingLeaves() {
  const [paused, setPaused] = useState(false);
  const [portalKey, setPortalKey] = useState(1);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const t = setTimeout(() => setEntered(true), 90);
    return () => clearTimeout(t);
  }, [portalKey]);

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes leaf-fall-3d {
            0% {
              transform: translate3d(0, -16%, 0) rotateZ(var(--rz-start)) rotateY(0deg);
              opacity: 0;
            }
            10% {
              opacity: var(--leaf-op);
            }
            84% {
              opacity: var(--leaf-op);
            }
            100% {
              transform: translate3d(var(--drift-x), 116%, 0) rotateZ(var(--rz-end)) rotateY(var(--ry-end));
              opacity: 0;
            }
          }
          @keyframes trail-sway {
            0%, 100% { transform: rotate(0deg) translateY(0px); }
            50% { transform: rotate(2.6deg) translateY(3px); }
          }
          .mfsc-leaf-3d {
            animation-name: leaf-fall-3d;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            will-change: transform, opacity;
          }
          .mfsc-trail-sway {
            animation: trail-sway 7.5s ease-in-out infinite;
          }
          .mfsc-trail-sway-r {
            animation: trail-sway 8.5s ease-in-out infinite reverse;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mfsc-leaf-3d, .mfsc-portal-reveal {
            display: none !important;
          }
        }
      `}</style>

      {/* INWARD FOREST TRAIL REVEAL (Walking through canopy branches toward the center, NO rectangular curtain) */}
      {!paused && (
        <div
          key={portalKey}
          aria-hidden="true"
          className="mfsc-portal-reveal pointer-events-none fixed inset-0 z-[70] overflow-hidden"
        >
          {/* Radial mist clearing as you step inside the forest */}
          <div
            className="absolute inset-0 transition-opacity duration-[1900ms] ease-out"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(20,51,38,0.18) 0%, rgba(15,36,27,0.72) 55%, rgba(10,24,18,0.92) 100%)",
              opacity: entered ? 0 : 1,
            }}
          />

          {/* Top-Left Canopy Cluster: expands outward & toward viewer (scale + translate) */}
          <div
            className="absolute left-0 top-0 transition-all duration-[2100ms] ease-[cubic-bezier(0.2,0.9,0.3,1)]"
            style={{
              transform: entered
                ? "translate3d(-32vw, -24vh, 0) scale(1.65) rotate(-14deg)"
                : "translate3d(14vw, 12vh, 0) scale(1.05) rotate(0deg)",
              opacity: entered ? 0 : 0.96,
            }}
          >
            <div className="relative h-64 w-64">
              <div className="absolute left-0 top-0"><BotanicalLeafSvg kind="yarumo" size={140} /></div>
              <div className="absolute left-20 top-10"><BotanicalLeafSvg kind="helecho" size={130} /></div>
              <div className="absolute left-8 top-28"><BotanicalLeafSvg kind="cedro" size={115} /></div>
              <div className="absolute left-28 top-28"><BotanicalLeafSvg kind="guayacan" size={82} /></div>
            </div>
          </div>

          {/* Top-Right Canopy Cluster */}
          <div
            className="absolute right-0 top-0 transition-all duration-[2100ms] ease-[cubic-bezier(0.2,0.9,0.3,1)]"
            style={{
              transform: entered
                ? "translate3d(32vw, -24vh, 0) scale(1.65) rotate(14deg)"
                : "translate3d(-14vw, 12vh, 0) scale(1.05) rotate(0deg)",
              opacity: entered ? 0 : 0.96,
            }}
          >
            <div className="relative h-64 w-64">
              <div className="absolute right-0 top-0 -scale-x-100"><BotanicalLeafSvg kind="yarumo" size={140} /></div>
              <div className="absolute right-20 top-10 -scale-x-100"><BotanicalLeafSvg kind="helecho" size={130} /></div>
              <div className="absolute right-8 top-28 -scale-x-100"><BotanicalLeafSvg kind="cedro" size={115} /></div>
              <div className="absolute right-28 top-28 -scale-x-100"><BotanicalLeafSvg kind="guayacan" size={82} /></div>
            </div>
          </div>

          {/* Bottom-Left Canopy Cluster */}
          <div
            className="absolute bottom-0 left-0 transition-all duration-[2200ms] ease-[cubic-bezier(0.2,0.9,0.3,1)]"
            style={{
              transform: entered
                ? "translate3d(-34vw, 26vh, 0) scale(1.75) rotate(-18deg)"
                : "translate3d(16vw, -10vh, 0) scale(1.05) rotate(0deg)",
              opacity: entered ? 0 : 0.95,
            }}
          >
            <div className="relative h-64 w-64">
              <div className="absolute bottom-2 left-2"><BotanicalLeafSvg kind="helecho" size={145} /></div>
              <div className="absolute bottom-14 left-24"><BotanicalLeafSvg kind="yarumo" size={120} /></div>
              <div className="absolute bottom-28 left-10"><BotanicalLeafSvg kind="laurel" size={92} /></div>
            </div>
          </div>

          {/* Bottom-Right Canopy Cluster */}
          <div
            className="absolute bottom-0 right-0 transition-all duration-[2200ms] ease-[cubic-bezier(0.2,0.9,0.3,1)]"
            style={{
              transform: entered
                ? "translate3d(34vw, 26vh, 0) scale(1.75) rotate(18deg)"
                : "translate3d(-16vw, -10vh, 0) scale(1.05) rotate(0deg)",
              opacity: entered ? 0 : 0.95,
            }}
          >
            <div className="relative h-64 w-64">
              <div className="absolute bottom-2 right-2 -scale-x-100"><BotanicalLeafSvg kind="helecho" size={145} /></div>
              <div className="absolute bottom-14 right-24 -scale-x-100"><BotanicalLeafSvg kind="yarumo" size={120} /></div>
              <div className="absolute bottom-28 right-10 -scale-x-100"><BotanicalLeafSvg kind="laurel" size={92} /></div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Controls in Hero Corner */}
      <div className="absolute right-4 top-4 z-30 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setPaused(false);
            setPortalKey((k) => k + 1);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-forest/75 px-2.5 py-1 text-[11px] font-semibold text-cream/95 backdrop-blur-md transition hover:bg-forest"
          title="Repetir entrada al bosque"
        >
          <RotateCcw className="h-3 w-3 text-amber-200" />
          Entrada
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-forest/75 px-2.5 py-1 text-[11px] font-semibold text-cream/95 backdrop-blur-md transition hover:bg-forest"
          title={paused ? "Activar brisa de hojas" : "Pausar brisa de hojas"}
        >
          <Wind className="h-3.5 w-3.5 text-amber-200" />
          {paused ? "Brisa: OFF" : "Brisa: ON"}
        </button>
      </div>

      {/* FOREGROUND HERO TRAIL BORDER ("la senda en el borde" + 20 smaller falling leaves) */}
      {!paused && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        >
          {/* Persistent delicate botanical border framing the Hero trail */}
          <div className="mfsc-trail-sway absolute -left-4 -top-4 opacity-90">
            <BotanicalLeafSvg kind="helecho" size={92} />
          </div>
          <div className="mfsc-trail-sway absolute -left-5 top-14 opacity-75">
            <BotanicalLeafSvg kind="cedro" size={68} />
          </div>
          <div className="mfsc-trail-sway-r absolute -left-4 -bottom-4 opacity-85">
            <BotanicalLeafSvg kind="yarumo" size={84} />
          </div>

          <div className="mfsc-trail-sway-r absolute -right-4 -top-4 -scale-x-100 opacity-90">
            <BotanicalLeafSvg kind="helecho" size={92} />
          </div>
          <div className="mfsc-trail-sway-r absolute -right-5 top-14 -scale-x-100 opacity-75">
            <BotanicalLeafSvg kind="cedro" size={68} />
          </div>
          <div className="mfsc-trail-sway absolute -right-4 -bottom-4 -scale-x-100 opacity-85">
            <BotanicalLeafSvg kind="yarumo" size={84} />
          </div>

          {/* 20 smaller, intricate 3D-tumbling forest leaves */}
          {FALLING_LEAVES.map((leaf) => (
            <div
              key={leaf.id}
              className={`mfsc-leaf-3d absolute -top-12 ${leaf.blur ? "blur-[0.7px]" : ""}`}
              style={
                {
                  left: `${leaf.leftPct}%`,
                  animationDelay: `${leaf.delaySec}s`,
                  animationDuration: `${leaf.durationSec}s`,
                  "--drift-x": `${leaf.driftX}px`,
                  "--rz-start": `${leaf.rotZStart}deg`,
                  "--rz-end": `${leaf.rotZEnd}deg`,
                  "--ry-end": `${leaf.rotYEnd}deg`,
                  "--leaf-op": leaf.opacity,
                } as React.CSSProperties
              }
            >
              <BotanicalLeafSvg kind={leaf.kind} size={leaf.sizePx} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
