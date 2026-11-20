"use client";

import { useState } from "react";
import { Wind } from "lucide-react";

interface LeafSpec {
  id: number;
  kind: "yarumo" | "cedro" | "laurel" | "guayacan" | "palma";
  leftPct: number; // positioned primarily on sides (2-22% and 76-95%) + a few drifting toward center (28-68%)
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
  // Left edge & gentle drift toward center
  { id: 1, kind: "yarumo", leftPct: 3, delaySec: 0, durationSec: 13, sizePx: 46, driftX: 48, rotateStart: -18, rotateEnd: 34, blur: false, opacity: 0.72 },
  { id: 2, kind: "laurel", leftPct: 11, delaySec: 2.2, durationSec: 11, sizePx: 32, driftX: 64, rotateStart: 12, rotateEnd: -40, blur: false, opacity: 0.65 },
  { id: 3, kind: "guayacan", leftPct: 19, delaySec: 4.5, durationSec: 14, sizePx: 28, driftX: 85, rotateStart: -25, rotateEnd: 55, blur: true, opacity: 0.52 },
  { id: 4, kind: "cedro", leftPct: 6, delaySec: 6.8, durationSec: 12.5, sizePx: 38, driftX: 52, rotateStart: 20, rotateEnd: -28, blur: true, opacity: 0.55 },
  // Subtle elements drifting across center
  { id: 5, kind: "laurel", leftPct: 34, delaySec: 1.4, durationSec: 15, sizePx: 26, driftX: 70, rotateStart: -10, rotateEnd: 48, blur: true, opacity: 0.42 },
  { id: 6, kind: "guayacan", leftPct: 62, delaySec: 5.2, durationSec: 16, sizePx: 25, driftX: -55, rotateStart: 15, rotateEnd: -45, blur: true, opacity: 0.40 },
  // Right edge & gentle drift toward center
  { id: 7, kind: "yarumo", leftPct: 88, delaySec: 0.8, durationSec: 13.5, sizePx: 48, driftX: -62, rotateStart: 16, rotateEnd: -36, blur: false, opacity: 0.70 },
  { id: 8, kind: "palma", leftPct: 94, delaySec: 3.1, durationSec: 12, sizePx: 44, driftX: -48, rotateStart: -14, rotateEnd: 30, blur: false, opacity: 0.62 },
  { id: 9, kind: "cedro", leftPct: 79, delaySec: 5.9, durationSec: 14.5, sizePx: 34, driftX: -75, rotateStart: 22, rotateEnd: -42, blur: true, opacity: 0.50 },
  { id: 10, kind: "laurel", leftPct: 84, delaySec: 8.1, durationSec: 11.5, sizePx: 30, driftX: -58, rotateStart: -20, rotateEnd: 38, blur: false, opacity: 0.60 },
];

function LeafSvg({ kind, size }: { kind: LeafSpec["kind"]; size: number }) {
  if (kind === "yarumo") {
    // Palmate Cecropia (Yarumo) leaf with central ribs
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g-yarumo" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6EA87B" />
            <stop offset="55%" stopColor="#2F6B48" />
            <stop offset="100%" stopColor="#1B4332" />
          </linearGradient>
        </defs>
        <path
          d="M32 6 C35 16 36 22 33 28 C40 20 48 15 56 17 C50 24 44 29 36 33 C45 33 54 36 59 42 C50 43 42 42 35 39 C40 46 43 53 41 59 C36 53 33 47 32 41 C31 47 28 53 23 59 C21 53 24 46 29 39 C22 42 14 43 5 42 C10 36 19 33 28 33 C20 29 14 24 8 17 C16 15 24 20 31 28 C28 22 29 16 32 6 Z"
          fill="url(#g-yarumo)"
        />
        <path
          d="M32 10 L32 41 M32 33 L52 20 M32 35 L54 41 M32 33 L12 20 M32 35 L10 41 M32 37 L25 54 M32 37 L39 54"
          stroke="#CBE5D1"
          strokeWidth="1"
          strokeOpacity="0.65"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "guayacan") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g-guayacan" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E9B96E" />
            <stop offset="60%" stopColor="#C87A45" />
            <stop offset="100%" stopColor="#8F4323" />
          </linearGradient>
        </defs>
        <path
          d="M12 52 C14 28 30 12 54 10 C52 34 36 50 12 52 Z"
          fill="url(#g-guayacan)"
        />
        <path
          d="M12 52 Q32 32 52 12 M24 40 L26 28 M34 30 L36 20 M28 36 L40 34"
          stroke="#FCE5C2"
          strokeWidth="1.1"
          strokeOpacity="0.65"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "cedro") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g-cedro" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A9B86B" />
            <stop offset="55%" stopColor="#5C7A42" />
            <stop offset="100%" stopColor="#2E4A27" />
          </linearGradient>
        </defs>
        <path
          d="M32 6 C46 18 52 34 32 58 C12 34 18 18 32 6 Z"
          fill="url(#g-cedro)"
        />
        <path
          d="M32 9 L32 56 M32 22 L42 18 M32 32 L44 27 M32 42 L41 38 M32 22 L22 18 M32 32 L20 27 M32 42 L23 38"
          stroke="#E3ECC6"
          strokeWidth="1"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "palma") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path
          d="M10 54 C24 38 38 24 56 10 C50 28 36 44 10 54 Z"
          fill="#3E7C59"
        />
        <path
          d="M10 54 Q34 32 56 10"
          stroke="#D1EAD9"
          strokeWidth="1.2"
          strokeOpacity="0.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  // Laurel / Cacao leaf
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="g-laurel" x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#77B885" />
          <stop offset="60%" stopColor="#356E4D" />
          <stop offset="100%" stopColor="#1B3E2B" />
        </linearGradient>
      </defs>
      <path
        d="M32 5 C45 14 50 32 44 46 C40 54 35 58 32 60 C29 58 24 54 20 46 C14 32 19 14 32 5 Z"
        fill="url(#g-laurel)"
      />
      <path
        d="M32 8 L32 58 M32 20 L42 26 M32 32 L44 38 M32 44 L40 48 M32 20 L22 26 M32 32 L20 38 M32 44 L24 48"
        stroke="#D8F0DF"
        strokeWidth="1"
        strokeOpacity="0.65"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FallingLeaves() {
  const [paused, setPaused] = useState(false);

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes leaf-fall-drift {
            0% {
              transform: translate3d(0, -14%, 0) rotate(var(--r-start));
              opacity: 0;
            }
            12% {
              opacity: var(--leaf-op);
            }
            82% {
              opacity: var(--leaf-op);
            }
            100% {
              transform: translate3d(var(--drift-x), 112%, 0) rotate(var(--r-end));
              opacity: 0;
            }
          }
          .mfsc-leaf-animated {
            animation-name: leaf-fall-drift;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            will-change: transform, opacity;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mfsc-leaf-animated {
            display: none;
          }
        }
      `}</style>

      {/* Subtle pause/play control in Hero corner (WCAG 2.2.2) */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-forest/70 px-3 py-1 text-[11px] font-semibold text-cream/90 backdrop-blur-md transition hover:bg-forest"
        title={paused ? "Activar brisa de hojas" : "Pausar brisa de hojas"}
      >
        <Wind className="h-3.5 w-3.5 text-amber-200" />
        {paused ? "Brisa: OFF" : "Brisa: ON"}
      </button>

      {/* Non-blocking atmospheric leaf layer scoped ONLY to the Hero */}
      {!paused && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        >
          {LEAVES.map((leaf) => (
            <div
              key={leaf.id}
              className={`mfsc-leaf-animated absolute -top-12 ${leaf.blur ? "blur-[1px]" : ""}`}
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
              <LeafSvg kind={leaf.kind} size={leaf.sizePx} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
