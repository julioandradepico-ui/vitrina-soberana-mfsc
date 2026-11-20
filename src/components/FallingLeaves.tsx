"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Wind } from "lucide-react";

interface LeafSpec {
  id: number;
  kind: "yarumo" | "monstera" | "palma" | "guayacan" | "laurel";
  leftPct: number;
  delaySec: number;
  durationSec: number;
  sizePx: number;
  driftX: number;
  rotateStart: number;
  rotateEnd: number;
  blur: boolean;
  opacity: number;
}

const LEAVES: LeafSpec[] = [
  // Left foreground edge + gentle drift toward center
  { id: 1, kind: "yarumo", leftPct: 2, delaySec: 0, durationSec: 12, sizePx: 66, driftX: 65, rotateStart: -22, rotateEnd: 38, blur: false, opacity: 0.92 },
  { id: 2, kind: "monstera", leftPct: 9, delaySec: 1.4, durationSec: 11, sizePx: 54, driftX: 85, rotateStart: 15, rotateEnd: -35, blur: false, opacity: 0.85 },
  { id: 3, kind: "guayacan", leftPct: 16, delaySec: 3.1, durationSec: 13.5, sizePx: 42, driftX: 110, rotateStart: -28, rotateEnd: 56, blur: false, opacity: 0.82 },
  { id: 4, kind: "laurel", leftPct: 5, delaySec: 5.2, durationSec: 12.5, sizePx: 48, driftX: 70, rotateStart: 20, rotateEnd: -30, blur: true, opacity: 0.72 },
  // Subtle elements gliding across the center foreground
  { id: 5, kind: "guayacan", leftPct: 33, delaySec: 0.9, durationSec: 14, sizePx: 38, driftX: 85, rotateStart: -12, rotateEnd: 50, blur: false, opacity: 0.65 },
  { id: 6, kind: "laurel", leftPct: 61, delaySec: 2.6, durationSec: 15, sizePx: 36, driftX: -75, rotateStart: 18, rotateEnd: -44, blur: true, opacity: 0.60 },
  // Right foreground edge + gentle drift toward center
  { id: 7, kind: "palma", leftPct: 86, delaySec: 0.4, durationSec: 12.5, sizePx: 74, driftX: -72, rotateStart: 18, rotateEnd: -32, blur: false, opacity: 0.90 },
  { id: 8, kind: "yarumo", leftPct: 92, delaySec: 2.0, durationSec: 11.5, sizePx: 62, driftX: -80, rotateStart: -16, rotateEnd: 34, blur: false, opacity: 0.86 },
  { id: 9, kind: "monstera", leftPct: 79, delaySec: 4.3, durationSec: 13.5, sizePx: 50, driftX: -95, rotateStart: 22, rotateEnd: -42, blur: false, opacity: 0.78 },
  { id: 10, kind: "guayacan", leftPct: 83, delaySec: 6.4, durationSec: 11, sizePx: 40, driftX: -65, rotateStart: -20, rotateEnd: 40, blur: true, opacity: 0.72 },
];

function LeafArtwork({ kind, size }: { kind: LeafSpec["kind"]; size: number }) {
  if (kind === "monstera") {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 8px 14px rgba(10,25,18,0.45))" }}>
        <defs>
          <radialGradient id="g-monstera" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#5AA469" />
            <stop offset="55%" stopColor="#1E5631" />
            <stop offset="100%" stopColor="#0E2E1C" />
          </radialGradient>
        </defs>
        <path
          d="M40 8 C58 10 70 24 68 42 C67 56 54 68 40 74 C26 68 13 56 12 42 C10 24 22 10 40 8 Z"
          fill="url(#g-monstera)"
        />
        {/* Natural tropical fenestrations */}
        <ellipse cx="26" cy="34" rx="7" ry="3.2" transform="rotate(-22 26 34)" fill="#143326" fillOpacity="0.65" />
        <ellipse cx="54" cy="34" rx="7" ry="3.2" transform="rotate(22 54 34)" fill="#143326" fillOpacity="0.65" />
        <ellipse cx="28" cy="50" rx="6" ry="2.8" transform="rotate(-14 28 50)" fill="#143326" fillOpacity="0.65" />
        <ellipse cx="52" cy="50" rx="6" ry="2.8" transform="rotate(14 52 50)" fill="#143326" fillOpacity="0.65" />
        <path d="M40 10 L40 72 M40 24 L58 19 M40 24 L22 19 M40 42 L62 41 M40 42 L18 41 M40 58 L54 58 M40 58 L26 58" stroke="#A6D9B2" strokeWidth="1.4" strokeOpacity="0.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "palma") {
    return (
      <svg width={size} height={size} viewBox="0 0 90 90" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 10px 16px rgba(8,22,15,0.5))" }}>
        <defs>
          <linearGradient id="g-palma" x1="8" y1="80" x2="82" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#123524" />
            <stop offset="50%" stopColor="#2E7D4F" />
            <stop offset="100%" stopColor="#77BC82" />
          </linearGradient>
        </defs>
        <path
          d="M12 78 Q42 42 78 12 M22 68 C16 52 20 38 30 30 M32 58 C24 40 30 24 44 18 M44 46 C38 30 46 16 60 12 M28 62 C44 68 58 64 68 54 M38 52 C56 56 70 48 78 36 M50 40 C66 40 78 32 84 20"
          stroke="url(#g-palma)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path d="M12 78 Q42 42 78 12" stroke="#D2F0D8" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "yarumo") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 8px 14px rgba(10,25,18,0.45))" }}>
        <defs>
          <radialGradient id="g-yarumo2" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#82C28E" />
            <stop offset="55%" stopColor="#2D6A4F" />
            <stop offset="100%" stopColor="#143326" />
          </radialGradient>
        </defs>
        <path
          d="M32 4 C36 15 37 22 33 28 C41 19 49 14 58 16 C51 24 45 29 37 33 C46 33 55 36 60 43 C50 44 42 42 35 39 C40 47 43 54 41 60 C36 54 33 47 32 41 C31 47 28 54 23 60 C21 54 24 47 29 39 C22 42 14 44 4 43 C9 36 18 33 27 33 C19 29 13 24 6 16 C15 14 23 19 31 28 C27 22 28 15 32 4 Z"
          fill="url(#g-yarumo2)"
        />
        <path d="M32 8 L32 41 M32 33 L53 19 M32 35 L55 42 M32 33 L11 19 M32 35 L9 42 M32 37 L24 55 M32 37 L40 55" stroke="#DDF4E3" strokeWidth="1.15" strokeOpacity="0.75" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "guayacan") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 8px 12px rgba(25,14,8,0.45))" }}>
        <defs>
          <linearGradient id="g-guayacan2" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F3C97B" />
            <stop offset="55%" stopColor="#D07A42" />
            <stop offset="100%" stopColor="#8A3B1E" />
          </linearGradient>
        </defs>
        <path d="M10 54 C12 28 28 10 56 8 C54 36 36 52 10 54 Z" fill="url(#g-guayacan2)" />
        <path d="M10 54 Q32 32 54 10 M24 40 L26 26 M35 29 L37 18 M28 36 L42 34" stroke="#FFF0D4" strokeWidth="1.2" strokeOpacity="0.72" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 8px 12px rgba(10,25,18,0.42))" }}>
      <defs>
        <linearGradient id="g-laurel2" x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#85C792" />
          <stop offset="55%" stopColor="#35734E" />
          <stop offset="100%" stopColor="#163525" />
        </linearGradient>
      </defs>
      <path d="M32 4 C46 14 51 32 44 47 C40 55 35 59 32 61 C29 59 24 55 20 47 C13 32 18 14 32 4 Z" fill="url(#g-laurel2)" />
      <path d="M32 7 L32 59 M32 20 L43 26 M32 32 L45 38 M32 44 L41 49 M32 20 L21 26 M32 32 L19 38 M32 44 L23 49" stroke="#E2F6E7" strokeWidth="1.15" strokeOpacity="0.72" strokeLinecap="round" />
    </svg>
  );
}

export function FallingLeaves() {
  const [paused, setPaused] = useState(false);
  const [curtainKey, setCurtainKey] = useState(1);
  const [curtainOpen, setCurtainOpen] = useState(false);

  useEffect(() => {
    setCurtainOpen(false);
    const t = setTimeout(() => setCurtainOpen(true), 120);
    return () => clearTimeout(t);
  }, [curtainKey]);

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes leaf-fall-fg {
            0% {
              transform: translate3d(0, -18%, 0) rotate(var(--r-start)) scale(0.92);
              opacity: 0;
            }
            10% {
              opacity: var(--leaf-op);
            }
            84% {
              opacity: var(--leaf-op);
            }
            100% {
              transform: translate3d(var(--drift-x), 118%, 0) rotate(var(--r-end)) scale(1.06);
              opacity: 0;
            }
          }
          @keyframes frond-sway {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(3.2deg) scale(1.02); }
          }
          .mfsc-leaf-fg {
            animation-name: leaf-fall-fg;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            will-change: transform, opacity;
          }
          .mfsc-frond-sway {
            animation: frond-sway 7s ease-in-out infinite;
            transform-origin: top left;
          }
          .mfsc-frond-sway-r {
            animation: frond-sway 8s ease-in-out infinite reverse;
            transform-origin: top right;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mfsc-leaf-fg, .mfsc-curtain-panel {
            display: none !important;
          }
        }
      `}</style>

      {/* FULL-SCREEN FOREGROUND PARTING CANOPY CURTAIN (z-[70] ABOVE EVERYTHING ON ENTRANCE) */}
      {!paused && (
        <div
          key={curtainKey}
          aria-hidden="true"
          className="mfsc-curtain-panel pointer-events-none fixed inset-0 z-[70] overflow-hidden"
        >
          {/* Left Lush Foreground Canopy Curtain */}
          <div
            className="absolute inset-y-0 left-0 flex w-[54vw] items-center justify-end transition-transform duration-[2200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: curtainOpen
                ? "translate3d(-112%, 0, 0) rotate(-10deg)"
                : "translate3d(0, 0, 0) rotate(0deg)",
            }}
          >
            <div className="relative h-full w-full bg-gradient-to-r from-[#0C2118] via-[#143326]/92 to-transparent">
              <div className="absolute -right-12 top-[8%]"><LeafArtwork kind="palma" size={240} /></div>
              <div className="absolute -right-8 top-[34%]"><LeafArtwork kind="monstera" size={210} /></div>
              <div className="absolute -right-10 bottom-[10%]"><LeafArtwork kind="yarumo" size={220} /></div>
              <div className="absolute left-[18%] top-[22%]"><LeafArtwork kind="guayacan" size={140} /></div>
            </div>
          </div>

          {/* Right Lush Foreground Canopy Curtain */}
          <div
            className="absolute inset-y-0 right-0 flex w-[54vw] items-center justify-start transition-transform duration-[2200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: curtainOpen
                ? "translate3d(112%, 0, 0) rotate(10deg)"
                : "translate3d(0, 0, 0) rotate(0deg)",
            }}
          >
            <div className="relative h-full w-full bg-gradient-to-l from-[#0C2118] via-[#143326]/92 to-transparent">
              <div className="absolute -left-12 top-[12%] -scale-x-100"><LeafArtwork kind="palma" size={240} /></div>
              <div className="absolute -left-8 top-[38%] -scale-x-100"><LeafArtwork kind="yarumo" size={215} /></div>
              <div className="absolute -left-10 bottom-[8%] -scale-x-100"><LeafArtwork kind="monstera" size={205} /></div>
              <div className="absolute right-[18%] top-[26%]"><LeafArtwork kind="guayacan" size={135} /></div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Controls in Hero Corner (Replay Curtain + Pause Breeze) */}
      <div className="absolute right-4 top-4 z-30 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setPaused(false);
            setCurtainKey((k) => k + 1);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-forest/75 px-2.5 py-1 text-[11px] font-semibold text-cream/95 backdrop-blur-md transition hover:bg-forest"
          title="Repetir cortinilla de entrada"
        >
          <RotateCcw className="h-3 w-3 text-amber-200" />
          Cortinilla
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

      {/* FOREGROUND HERO LAYER (z-20 ABOVE Hero text & mosaic, pointer-events-none) */}
      {!paused && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        >
          {/* Persistent Subtle Corner Framing Fronds */}
          <div className="mfsc-frond-sway absolute -left-8 -top-8 opacity-85">
            <LeafArtwork kind="monstera" size={118} />
          </div>
          <div className="mfsc-frond-sway-r absolute -right-10 -top-6 opacity-85">
            <LeafArtwork kind="palma" size={135} />
          </div>

          {/* Foreground Falling Leaves */}
          {LEAVES.map((leaf) => (
            <div
              key={leaf.id}
              className={`mfsc-leaf-fg absolute -top-16 ${leaf.blur ? "blur-[1px]" : ""}`}
              style={
                {
                  left: `${leaf.leftPct}%`,
                  animationDelay: `${leaf.delaySec}s`,
                  animationDuration: `${leaf.durationSec}s`,
                  "--drift-x": `${leaf.driftX}px`,
                  "--r-start": `${leaf.rotateStart}deg`,
                  "--r-end": `${leaf.rotateEnd}deg`,
                  "--leaf-op": leaf.opacity,
                } as React.CSSProperties
              }
            >
              <LeafArtwork kind={leaf.kind} size={leaf.sizePx} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
