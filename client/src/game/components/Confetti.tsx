import { useEffect, useRef } from "react";

export interface ConfettiProps {
  particleCount?: number;
  /** Total animation length in ms */
  duration?: number;
  colors?: string[];
  onDone?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  tilt: number;
}

const DEFAULT_COLORS = [
  "#f44336",
  "#ffeb3b",
  "#4caf50",
  "#2196f3",
  "#9c27b0",
  "#ff9800",
];

export default function Confetti({
  particleCount = 150,
  duration = 3000,
  colors = DEFAULT_COLORS,
  onDone,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = window.innerWidth;
    const h = window.innerHeight;

    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const angle = Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.9);
      const speed = 6 + Math.random() * 14;
      return {
        x: w / 2,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
        tilt: Math.random() * Math.PI,
      };
    });

    const gravity = 0.15;
    const drag = 0.96; // strong drag so the burst slows quickly, then pieces drift down
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const fade = Math.max(
        0,
        1 - Math.max(0, elapsed - duration * 0.7) / (duration * 0.3),
      );

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = fade;

      for (const p of particles) {
        p.vx *= drag;
        p.vy = p.vy * drag + gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.tilt += 0.1;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.cos(p.tilt));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
        onDone?.();
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
