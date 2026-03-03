"use client";

import { useEffect, useRef, useCallback } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = usePreferences();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: any[] = [];
    let nebulae: any[] = [];
    let clusters: any[] = [];
    let animationFrameId: number;

    const initParticles = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      nebulae = [];

      // --- Nebula clouds for depth ---
      const numNebulae = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numNebulae; i++) {
        nebulae.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radiusX: 150 + Math.random() * 250,
          radiusY: 100 + Math.random() * 180,
          color: [
            'rgba(236, 57, 44, 0.04)',   // brand orange/red
            'rgba(80, 20, 120, 0.035)',   // deep purple
            'rgba(20, 40, 120, 0.03)',    // dark blue
            'rgba(120, 30, 60, 0.03)',    // dark magenta
            'rgba(40, 80, 140, 0.025)',   // space blue
          ][Math.floor(Math.random() * 5)],
          drift: (Math.random() - 0.5) * 0.03,
        });
      }

      // --- Star Clusters (Galaxies) ---
      const numClusters = 2; // 2 galaxies
      if (clusters.length === 0) {
        for (let i = 0; i < numClusters; i++) {
          // Place one in bottom-left, one in bottom-right
          const isLeft = i === 0;
          const cx = isLeft ? width * 0.1 : width * 0.85;
          const baseYOffset = Math.random() * 0.1;
          const baseY = isLeft ? height * 0.8 : height * 0.55;
          const cy = baseY + (height * baseYOffset); // Keep right one higher

          const rDisk = 300 + Math.random() * 250;
          const flatten = 0.2 + Math.random() * 0.15;
          const rot = isLeft ? Math.PI / 6 : -Math.PI / 6; // Fixed symmetric tilt

          const clusterStars = [];
          for (let j = 0; j < 300; j++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.pow(Math.random(), 1.5) * rDisk; // focus towards center
            clusterStars.push({
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              r: Math.random() * 1.2,
              alpha: 0.1 + Math.random() * 0.5
            });
          }

          clusters.push({
            x: cx,
            y: cy,
            baseYOffset,
            radiusCore: 30 + Math.random() * 10,
            radiusDisk: rDisk,
            flatten,
            rotation: rot,
            driftX: (Math.random() - 0.5) * 0.02,
            driftY: (Math.random() - 0.5) * 0.02,
            stars: clusterStars
          });
        }
      } else {
        // Just update positions on resize
        for (let i = 0; i < clusters.length; i++) {
          const isLeft = i === 0;
          clusters[i].x = isLeft ? width * 0.1 : width * 0.85;
          const baseY = isLeft ? height * 0.8 : height * 0.55;
          clusters[i].y = baseY + (height * clusters[i].baseYOffset);
        }
      }

      // --- Stars in 3 depth layers ---
      const numParticles = Math.min(Math.floor((width * height) / 8000), 150);

      for (let i = 0; i < numParticles; i++) {
        // layer: 0 = far/dim/small, 1 = mid, 2 = near/bright/big
        const layer = Math.random() < 0.55 ? 0 : Math.random() < 0.7 ? 1 : 2;
        const layerConfig = [
          { radiusMin: 0.15, radiusMax: 0.5, speed: 0.02, alphaBase: 0.15, alphaRange: 0.2 },
          { radiusMin: 0.4, radiusMax: 1.0, speed: 0.05, alphaBase: 0.25, alphaRange: 0.35 },
          { radiusMin: 0.8, radiusMax: 1.8, speed: 0.1, alphaBase: 0.4, alphaRange: 0.5 },
        ][layer];

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (layerConfig.radiusMax - layerConfig.radiusMin) + layerConfig.radiusMin,
          vx: (Math.random() - 0.5) * layerConfig.speed,
          vy: (Math.random() - 0.5) * layerConfig.speed - 0.02,
          layer,
          alphaBase: layerConfig.alphaBase,
          alphaRange: layerConfig.alphaRange,
          color: Math.random() > 0.93 ? '#EC392C' : (
            Math.random() > 0.85 ? `hsl(${210 + Math.random() * 40}, 60%, 80%)` : 'white'
          ),
          flashOffset: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.005 + Math.random() * 0.015,
        });
      }
    };

    let timeOffset = 0;
    const drawParticles = () => {
      timeOffset += 1;

      // --- Paint background gradient based on theme ---
      const isDark = theme === 'dark';
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isDark) {
        bgGrad.addColorStop(0, '#050510');
        bgGrad.addColorStop(0.3, '#0a0812');
        bgGrad.addColorStop(0.5, '#080610');
        bgGrad.addColorStop(0.7, '#0c0815');
        bgGrad.addColorStop(1, '#060408');
      } else {
        bgGrad.addColorStop(0, '#f0f2f5');
        bgGrad.addColorStop(0.3, '#e8eaef');
        bgGrad.addColorStop(0.5, '#eceef3');
        bgGrad.addColorStop(0.7, '#e5e7ec');
        bgGrad.addColorStop(1, '#f2f4f8');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle radial depth spots
      const spots = isDark ? [
        { x: width * 0.8, y: height * 0.15, r: 350, color: 'rgba(60, 20, 80, 0.10)' },
        { x: width * 0.2, y: height * 0.5, r: 400, color: 'rgba(20, 30, 80, 0.09)' },
        { x: width * 0.6, y: height * 0.75, r: 300, color: 'rgba(80, 20, 40, 0.07)' },
        { x: width * 0.1, y: height * 0.9, r: 250, color: 'rgba(30, 50, 100, 0.08)' },
      ] : [
        { x: width * 0.8, y: height * 0.15, r: 350, color: 'rgba(200, 180, 230, 0.15)' },
        { x: width * 0.2, y: height * 0.5, r: 400, color: 'rgba(180, 200, 240, 0.12)' },
        { x: width * 0.6, y: height * 0.75, r: 300, color: 'rgba(230, 180, 200, 0.10)' },
        { x: width * 0.1, y: height * 0.9, r: 250, color: 'rgba(180, 210, 240, 0.12)' },
      ];
      spots.forEach(s => {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        g.addColorStop(0, s.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
      });

      // --- Quasars: bright orange/amber glowing points ---
      const quasarPulse = Math.sin(timeOffset * 0.008) * 0.3 + 0.7; // slow pulse 0.4-1.0
      const quasars = [
        { x: width * 0.85, y: height * 0.1, innerR: 3, outerR: 180, core: 'rgba(255, 180, 50, 0.6)', glow: 'rgba(236, 140, 30, 0.12)' },
        { x: width * 0.12, y: height * 0.35, innerR: 2, outerR: 120, core: 'rgba(255, 200, 80, 0.5)', glow: 'rgba(255, 160, 40, 0.08)' },
        { x: width * 0.65, y: height * 0.6, innerR: 2.5, outerR: 150, core: 'rgba(255, 160, 40, 0.55)', glow: 'rgba(236, 120, 20, 0.10)' },
        { x: width * 0.35, y: height * 0.85, innerR: 1.8, outerR: 100, core: 'rgba(255, 220, 100, 0.45)', glow: 'rgba(255, 180, 60, 0.07)' },
      ];
      quasars.forEach(q => {
        // Outer glow
        const gOuter = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.outerR * quasarPulse);
        gOuter.addColorStop(0, q.glow);
        gOuter.addColorStop(0.5, q.glow.replace(/[\d.]+\)$/, '0.03)'));
        gOuter.addColorStop(1, 'transparent');
        ctx.fillStyle = gOuter;
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.outerR * quasarPulse, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        const gCore = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.innerR * 4);
        gCore.addColorStop(0, 'rgba(255, 240, 200, 0.9)');
        gCore.addColorStop(0.3, q.core);
        gCore.addColorStop(1, 'transparent');
        ctx.fillStyle = gCore;
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.innerR * 4 * quasarPulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Draw Star Clusters (Galaxies) ---
      if (isDark) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        clusters.forEach(c => {
          c.x += c.driftX;
          c.y += c.driftY;
          if (c.x < -c.radiusDisk) c.x = width + c.radiusDisk;
          if (c.x > width + c.radiusDisk) c.x = -c.radiusDisk;
          if (c.y < -c.radiusDisk) c.y = height + c.radiusDisk;
          if (c.y > height + c.radiusDisk) c.y = -c.radiusDisk;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rotation);

          // Disk
          ctx.scale(1, c.flatten);
          const gDisk = ctx.createRadialGradient(0, 0, 0, 0, 0, c.radiusDisk);
          gDisk.addColorStop(0, 'rgba(236, 57, 44, 0.45)'); // brand orange
          gDisk.addColorStop(0.2, 'rgba(236, 57, 44, 0.2)');
          gDisk.addColorStop(0.5, 'rgba(255, 120, 50, 0.08)');
          gDisk.addColorStop(0.8, 'rgba(80, 40, 150, 0.03)'); // subtle purple fringe
          gDisk.addColorStop(1, 'transparent');
          ctx.fillStyle = gDisk;
          ctx.beginPath();
          ctx.arc(0, 0, c.radiusDisk, 0, Math.PI * 2);
          ctx.fill();

          // Cluster Stars
          ctx.fillStyle = 'rgba(255, 230, 200, 0.8)';
          c.stars.forEach((star: any) => {
            ctx.globalAlpha = star.alpha * (Math.sin(timeOffset * 0.05 + star.x) * 0.3 + 0.7);
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.globalAlpha = 1.0;

          // Core
          ctx.scale(1, 1 / c.flatten); // reset Y scale
          ctx.scale(1, c.flatten * 1.5);
          const gCore = ctx.createRadialGradient(0, 0, 0, 0, 0, c.radiusCore);
          gCore.addColorStop(0, 'rgba(255, 255, 255, 1)');
          gCore.addColorStop(0.2, 'rgba(255, 200, 100, 0.8)');
          gCore.addColorStop(0.5, 'rgba(236, 57, 44, 0.6)');
          gCore.addColorStop(1, 'transparent');
          ctx.fillStyle = gCore;
          ctx.beginPath();
          ctx.arc(0, 0, c.radiusCore, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        ctx.restore();
      }

      // --- Draw nebula clouds ---
      nebulae.forEach((n) => {
        n.x += n.drift;
        if (n.x < -n.radiusX) n.x = width + n.radiusX;
        if (n.x > width + n.radiusX) n.x = -n.radiusX;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radiusX);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(n.x, n.y, n.radiusX, n.radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Draw stars by layer (far first, near last) ---
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      for (let layer = 0; layer <= 2; layer++) {
        particles.forEach((p) => {
          if (p.layer !== layer) return;

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const alphaMod = Math.sin(timeOffset * p.twinkleSpeed + p.flashOffset) * 0.5 + 0.5;
          const alpha = p.alphaBase + alphaMod * p.alphaRange;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

          if (p.color === '#EC392C') {
            ctx.fillStyle = `rgba(236, 57, 44, ${alpha})`;
            ctx.shadowBlur = 10 * alphaMod;
            ctx.shadowColor = '#EC392C';
          } else if (p.color === 'white') {
            if (isDark) {
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            } else {
              ctx.fillStyle = `rgba(100, 120, 160, ${alpha * 0.6})`;
            }
            if (layer === 2) {
              ctx.shadowBlur = 3 * alphaMod;
              ctx.shadowColor = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(100, 120, 160, 0.2)';
            } else {
              ctx.shadowBlur = 0;
              ctx.shadowColor = 'transparent';
            }
          } else {
            // Blueish tint star
            ctx.fillStyle = p.color.replace('80%)', `80%, ${alpha})`).replace('hsl(', 'hsla(');
            ctx.shadowBlur = layer === 2 ? 3 * alphaMod : 0;
            ctx.shadowColor = layer === 2 ? 'rgba(150, 180, 255, 0.3)' : 'transparent';
          }

          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        });
      }

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', initParticles);
    initParticles();
    drawParticles();

    return () => {
      window.removeEventListener('resize', initParticles);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
