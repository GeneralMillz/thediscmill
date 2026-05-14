import { useState, useEffect, useRef } from "react";

/**
 * SplashScreen — The Disc Mill
 *
 * Uses your existing design tokens from globals.css:
 *   --color-surface-0/1/2/3, --color-accent, --color-accent-glow,
 *   --color-text-primary/secondary, --font-display, --font-sans,
 *   --animate-glow-pulse, .glass, .disc-card, .animate-fade-in, .animate-slide-up
 *
 * Props:
 *   onComplete  () => void   called after exit animation finishes
 *   duration    number       ms before exit begins (default 2800)
 *   version     string       shown at bottom (default "1.0.0")
 */

const BG_DISCS = [
  { w: 72,  top: "7%",  left: "4%",   delay: 0 },
  { w: 44,  top: "13%", right: "7%",  delay: 1.1 },
  { w: 56,  top: "62%", left: "3%",   delay: 2.0 },
  { w: 38,  top: "72%", right: "5%",  delay: 0.6 },
  { w: 26,  top: "42%", left: "1%",   delay: 2.8 },
  { w: 48,  top: "50%", right: "2%",  delay: 1.5 },
  { w: 20,  top: "85%", left: "12%",  delay: 0.3 },
  { w: 32,  top: "20%", left: "16%",  delay: 3.2 },
];

const css = `
  @keyframes discMillExit {
    0%   { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.05); }
  }
  @keyframes dmAurora {
    0%, 100% { transform: scale(0.9) translateY(0);   opacity: 0.7; }
    50%       { transform: scale(1.08) translateY(20px); opacity: 1; }
  }
  @keyframes dmGridDrift {
    from { background-position: 0 0; }
    to   { background-position: 60px 60px; }
  }
  @keyframes dmRingBreath {
    0%, 100% { opacity: 0.25; transform: scale(0.97); }
    50%       { opacity: 1;    transform: scale(1.03); }
  }
  @keyframes dmDiscSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes dmOrbit {
    from { transform: rotate(0deg)   translateX(62px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(62px) rotate(-360deg); }
  }
  @keyframes dmOrbit2 {
    from { transform: rotate(180deg) translateX(62px) rotate(-180deg); }
    to   { transform: rotate(540deg) translateX(62px) rotate(-540deg); }
  }
  @keyframes dmDropIn {
    from { opacity: 0; transform: translateY(-24px) scale(0.9); }
    to   { opacity: 1; transform: translateY(0)      scale(1); }
  }
  @keyframes dmWordIn {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes dmShimmerSweep {
    0%   { top: -2px;  opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { top: 100%;  opacity: 0; }
  }

  .dm-splash {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--color-surface-0);
    overflow: hidden;
    font-family: var(--font-sans);
  }
  .dm-splash.dm-exit {
    animation: discMillExit 0.75s cubic-bezier(0.7, 0, 1, 1) forwards;
  }

  .dm-noise {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }
  .dm-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: dmGridDrift 24s linear infinite;
    pointer-events: none;
  }
  .dm-aurora {
    position: absolute;
    width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle at 50% 50%,
      rgba(99,102,241,0.13) 0%,
      rgba(129,140,248,0.06) 35%,
      transparent 70%);
    top: -200px;
    animation: dmAurora 4s ease-in-out infinite;
    pointer-events: none;
  }
  .dm-shimmer {
    position: absolute;
    height: 1px; width: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(129,140,248,0.18) 50%, transparent 100%);
    animation: dmShimmerSweep 3.5s ease-in-out infinite;
    pointer-events: none;
  }

  /* bg discs */
  .dm-bg-disc {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(129,140,248,0.08);
    pointer-events: none;
  }

  /* mill wheel */
  .dm-wheel {
    position: relative;
    width: 148px; height: 148px;
    margin-bottom: 42px;
    animation: dmDropIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  .dm-ring {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(129,140,248,0.2);
  }
  .dm-ring-1 { inset: 0;    animation: dmRingBreath 3.2s ease-in-out infinite 0s; }
  .dm-ring-2 { inset: 16px; animation: dmRingBreath 3.2s ease-in-out infinite 0.45s; }
  .dm-ring-3 { inset: 32px; animation: dmRingBreath 3.2s ease-in-out infinite 0.9s; }

  .dm-disc-body {
    position: absolute; inset: 40px; border-radius: 50%;
    background: radial-gradient(circle at 35% 28%, #1e2d6e 0%, #111827 55%, #0c1222 100%);
    border: 1.5px solid rgba(129,140,248,0.5);
    box-shadow:
      0 0 0 4px rgba(99,102,241,0.08),
      inset 0 2px 0 rgba(255,255,255,0.07),
      inset 0 -2px 6px rgba(0,0,0,0.5);
    animation: dmDiscSpin 4s linear infinite;
    display: flex; align-items: center; justify-content: center;
  }
  .dm-groove-1 { position: absolute; inset: 4px;  border-radius: 50%; border: 1px solid rgba(129,140,248,0.15); }
  .dm-groove-2 { position: absolute; inset: 10px; border-radius: 50%; border: 1px solid rgba(129,140,248,0.1); }
  .dm-hub {
    width: 20px; height: 20px; border-radius: 50%;
    background: radial-gradient(circle at 38% 32%, #818cf8, #3730a3);
    border: 1px solid rgba(129,140,248,0.6);
    box-shadow: 0 0 14px rgba(99,102,241,0.55);
    z-index: 2;
  }
  .dm-dot {
    position: absolute; border-radius: 50%;
    top: 50%; left: 50%; transform-origin: 0 0;
  }
  .dm-dot-1 {
    width: 7px; height: 7px;
    background: #818cf8;
    box-shadow: 0 0 8px rgba(129,140,248,0.8);
    animation: dmOrbit 4s linear infinite;
  }
  .dm-dot-2 {
    width: 4px; height: 4px;
    background: rgba(129,140,248,0.45);
    animation: dmOrbit2 4s linear infinite;
  }

  /* wordmark */
  .dm-wordmark {
    text-align: center;
    animation: dmWordIn 0.65s cubic-bezier(0.16,1,0.3,1) 0.18s both;
  }
  .dm-the {
    display: block;
    font-family: var(--font-sans);
    font-size: 13px; font-weight: 300;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    color: rgba(129,140,248,0.5);
    margin-bottom: 4px;
  }
  .dm-name {
    display: block;
    font-family: var(--font-display);
    font-size: clamp(56px, 12vw, 80px);
    font-weight: 900;
    line-height: 0.88;
    letter-spacing: -0.03em;
    color: var(--color-text-primary);
  }
  .dm-name-accent { color: var(--color-accent); }
  .dm-tag {
    display: block;
    font-family: var(--font-sans);
    font-size: 11px; font-weight: 300;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--color-text-muted);
    margin-top: 16px;
  }

  .dm-divider {
    width: 1px; height: 28px;
    background: linear-gradient(to bottom, transparent, rgba(129,140,248,0.4), transparent);
    margin: 18px auto 0;
    animation: dmWordIn 0.65s cubic-bezier(0.16,1,0.3,1) 0.3s both;
  }

  /* progress */
  .dm-progress {
    position: absolute; bottom: 48px;
    width: min(280px, 68vw);
    animation: dmWordIn 0.65s cubic-bezier(0.16,1,0.3,1) 0.4s both;
  }
  .dm-prog-meta {
    display: flex; justify-content: space-between;
    font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(148,163,184,0.28);
    margin-bottom: 8px;
  }
  .dm-prog-track {
    height: 1px;
    background: rgba(148,163,184,0.1);
    border-radius: 2px; overflow: hidden;
  }
  .dm-prog-bar {
    height: 100%;
    background: linear-gradient(90deg, #3730a3, #818cf8, #a5b4fc);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(129,140,248,0.6);
    transition: width 0.05s linear;
  }
  .dm-version {
    position: absolute; bottom: 20px;
    font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(148,163,184,0.15);
  }
`;

export default function SplashScreen({
  onComplete,
  version = "1.0.0",
  duration = 2800,
}) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting]   = useState(false);
  const [gone, setGone]         = useState(false);
  const rafRef   = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    startRef.current = performance.now();

    function tick(now) {
      const p = Math.min(100, ((now - startRef.current) / duration) * 100);
      setProgress(p);
      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setExiting(true);
        setTimeout(() => { setGone(true); onComplete?.(); }, 750);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (gone) return null;

  return (
    <>
      <style>{css}</style>
      <div className={`dm-splash${exiting ? " dm-exit" : ""}`}>

        <div className="dm-noise" />
        <div className="dm-grid" />
        <div className="dm-aurora" />
        <div className="dm-shimmer" />

        {BG_DISCS.map((d, i) => (
          <div
            key={i}
            className="dm-bg-disc"
            style={{
              width: d.w, height: d.w,
              top: d.top, left: d.left, right: d.right,
              animation: `dmRingBreath ${3.2 + d.delay * 0.3}s ease-in-out infinite ${d.delay}s`,
            }}
          />
        ))}

        <div className="dm-wheel">
          <div className="dm-ring dm-ring-1" />
          <div className="dm-ring dm-ring-2" />
          <div className="dm-ring dm-ring-3" />
          <div className="dm-disc-body">
            <div className="dm-groove-1" />
            <div className="dm-groove-2" />
            <div className="dm-hub" />
          </div>
          <div className="dm-dot dm-dot-1" />
          <div className="dm-dot dm-dot-2" />
        </div>

        <div className="dm-wordmark">
          <span className="dm-the">The</span>
          <span className="dm-name">
            DISC <span className="dm-name-accent">MILL</span>
          </span>
          <span className="dm-tag">Disc golf course finder</span>
        </div>

        <div className="dm-divider" />

        <div className="dm-progress">
          <div className="dm-prog-meta">
            <span>Loading courses</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="dm-prog-track">
            <div className="dm-prog-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <span className="dm-version">v{version}</span>
      </div>
    </>
  );
}
