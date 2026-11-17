import React, { useEffect, useRef } from 'react';

const BRAND_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#2563eb', '#10b981', '#ea580c'];

export default function InteractiveCanvas({ isDark = true, enabled = true }) {
  const bgCanvasRef = useRef(null);
  const trailCanvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const bgCanvas = bgCanvasRef.current;
    const trailCanvas = trailCanvasRef.current;
    if (!bgCanvas || !trailCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const trailCtx = trailCanvas.getContext('2d');

    let width = (bgCanvas.width = trailCanvas.width = window.innerWidth);
    let height = (bgCanvas.height = trailCanvas.height = window.innerHeight);

    const handleResize = () => {
      width = bgCanvas.width = trailCanvas.width = window.innerWidth;
      height = bgCanvas.height = trailCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse Tracking State
    const mouse = { x: -200, y: -200, prevX: -200, prevY: -200, speed: 0 };
    const trailPoints = [];
    const trailMax = 28;
    const bursts = [];

    const handleMouseMove = (e) => {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      mouse.speed = Math.min(Math.sqrt(dx * dx + dy * dy), 45);

      // Dispatch global cursor coordinates for telemetry readout
      window.dispatchEvent(
        new CustomEvent('vellox-pointer-move', {
          detail: { x: mouse.x, y: mouse.y, speed: mouse.speed }
        })
      );

      // Spawn trail particle
      const color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
      trailPoints.push({
        x: mouse.x,
        y: mouse.y,
        radius: Math.max(3.5, Math.min(mouse.speed * 0.45, 12)),
        color,
        alpha: isDark ? 0.95 : 0.75,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        decay: 0.038
      });

      if (trailPoints.length > trailMax) {
        trailPoints.shift();
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Custom Event Listener for Burst Animations (Logo click, search submit, etc.)
    const handleBurst = (e) => {
      const cx = e.detail?.x ?? width / 2;
      const cy = e.detail?.y ?? height / 3;
      const count = e.detail?.count ?? 40;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 8 + 3;
        bursts.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          radius: Math.random() * 5 + 3,
          color: BRAND_COLORS[i % BRAND_COLORS.length],
          alpha: 1,
          decay: 0.025
        });
      }
    };
    window.addEventListener('vellox-burst', handleBurst);

    // Background Ambient Constellation Simulation
    const bgNodes = [];
    const numNodes = 65;
    for (let i = 0; i < numNodes; i++) {
      bgNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.8 + 1,
        color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
        alpha: Math.random() * 0.4 + 0.2
      });
    }

    // Render loop
    const render = () => {
      // 1. Ambient Background Canvas
      bgCtx.clearRect(0, 0, width, height);

      // Subtle ambient cursor glow spotlight
      if (mouse.x > 0 && mouse.y > 0) {
        const glowGrad = bgCtx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 240);
        if (isDark) {
          glowGrad.addColorStop(0, 'rgba(59, 130, 246, 0.09)');
          glowGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        } else {
          glowGrad.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
          glowGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        }
        bgCtx.fillStyle = glowGrad;
        bgCtx.fillRect(0, 0, width, height);
      }

      // Draw and connect ambient nodes
      for (let i = 0; i < bgNodes.length; i++) {
        const node = bgNodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Gentle cursor deflection
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && dist > 0) {
          node.x -= (dx / dist) * 1.1;
          node.y -= (dy / dist) * 1.1;
        }

        // Draw node
        bgCtx.beginPath();
        bgCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        bgCtx.fillStyle = node.color;
        bgCtx.globalAlpha = isDark ? node.alpha : node.alpha * 0.7;
        bgCtx.fill();

        // Connect nearby nodes with delicate lines
        for (let j = i + 1; j < bgNodes.length; j++) {
          const other = bgNodes[j];
          const distBetween = Math.hypot(node.x - other.x, node.y - other.y);
          if (distBetween < 100) {
            bgCtx.beginPath();
            bgCtx.moveTo(node.x, node.y);
            bgCtx.lineTo(other.x, other.y);
            bgCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
            bgCtx.globalAlpha = (1 - distBetween / 100) * 0.35;
            bgCtx.stroke();
          }
        }
      }
      bgCtx.globalAlpha = 1;

      // 2. Cursor Trail & Bursts Canvas
      trailCtx.clearRect(0, 0, width, height);

      // Render connected dynamic glow ribbon for mouse trail
      for (let i = 0; i < trailPoints.length; i++) {
        const p = trailPoints[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          trailPoints.splice(i, 1);
          i--;
          continue;
        }

        trailCtx.save();
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        trailCtx.fillStyle = p.color;
        trailCtx.globalAlpha = p.alpha;
        trailCtx.shadowBlur = isDark ? 14 : 8;
        trailCtx.shadowColor = p.color;
        trailCtx.fill();
        trailCtx.restore();
      }

      // Render burst particles
      for (let i = 0; i < bursts.length; i++) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.14; // Gravity
        b.alpha -= b.decay;

        if (b.alpha <= 0) {
          bursts.splice(i, 1);
          i--;
          continue;
        }

        trailCtx.save();
        trailCtx.beginPath();
        trailCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        trailCtx.fillStyle = b.color;
        trailCtx.globalAlpha = b.alpha;
        trailCtx.shadowBlur = isDark ? 12 : 6;
        trailCtx.shadowColor = b.color;
        trailCtx.fill();
        trailCtx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('vellox-burst', handleBurst);
    };
  }, [enabled, isDark]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={bgCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ zIndex: 0 }}
      />
      <canvas
        ref={trailCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
        style={{ zIndex: 1 }}
      />
    </>
  );
}
