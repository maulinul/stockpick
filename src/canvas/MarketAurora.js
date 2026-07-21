/* src/canvas/MarketAurora.js - High Performance Particle Aurora Canvas */

import { throttle } from '../utils/dom.js';

export class MarketAurora {
  #canvas = null;
  #ctx = null;
  #raf = null;
  #running = false;
  #particles = [];
  #pointer = { x: -9999, y: -9999 };
  #width = 0;
  #height = 0;
  #dpr = 1;
  #motionMode = 'dynamic';

  constructor(canvasElement) {
    if (!canvasElement) return;
    this.#canvas = canvasElement;
    try {
      this.#ctx = canvasElement.getContext('2d');
    } catch {
      this.#ctx = null;
    }
    if (this.#ctx) {
      this.#initEvents();
    }
  }

  setMotionMode(mode) {
    this.#motionMode = mode;
    if (mode === 'off') {
      this.stop();
      this.#clear();
    } else {
      this.resize();
      this.start();
    }
  }

  start() {
    if (!this.#ctx || this.#running || this.#motionMode === 'off') return;
    this.#running = true;
    this.#loop();
  }

  stop() {
    this.#running = false;
    if (this.#raf) {
      cancelAnimationFrame(this.#raf);
      this.#raf = null;
    }
  }

  resize = () => {
    if (!this.#canvas || !this.#ctx) return;
    this.#dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    this.#width = window.innerWidth;
    this.#height = window.innerHeight;
    this.#canvas.width = Math.floor(this.#width * this.#dpr);
    this.#canvas.height = Math.floor(this.#height * this.#dpr);
    this.#canvas.style.width = `${this.#width}px`;
    this.#canvas.style.height = `${this.#height}px`;
    this.#ctx.setTransform(this.#dpr, 0, 0, this.#dpr, 0, 0);

    const count = this.#width < 700 ? 16 : this.#motionMode === 'subtle' ? 26 : 42;
    this.#particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * this.#width,
      y: Math.random() * this.#height,
      vx: (Math.random() - 0.5) * 0.16,
      vy: -0.08 - Math.random() * 0.18,
      r: 0.7 + Math.random() * 1.7,
      gold: i % 4 === 0
    }));
  };

  #clear() {
    if (this.#ctx) this.#ctx.clearRect(0, 0, this.#width, this.#height);
  }

  #loop = () => {
    if (!this.#running || !this.#ctx) return;

    if (document.hidden || this.#motionMode === 'off') {
      this.#clear();
      this.#raf = requestAnimationFrame(this.#loop);
      return;
    }

    this.#draw();
    this.#raf = requestAnimationFrame(this.#loop);
  };

  #draw() {
    const ctx = this.#ctx;
    if (!ctx) return;
    const w = this.#width;
    const h = this.#height;
    ctx.clearRect(0, 0, w, h);

    this.#particles.forEach((p, i) => {
      const dx = p.x - this.#pointer.x;
      const dy = p.y - this.#pointer.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 125 && this.#motionMode === 'dynamic') {
        p.x += (dx / Math.max(dist, 1)) * 0.18;
        p.y += (dy / Math.max(dist, 1)) * 0.18;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -12) { p.y = h + 12; p.x = Math.random() * w; }
      if (p.x < -12) p.x = w + 12;
      if (p.x > w + 12) p.x = -12;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold ? "rgba(217,172,87,.56)" : "rgba(43,216,166,.48)";
      ctx.fill();

      if (this.#motionMode === 'dynamic') {
        for (let j = i + 1; j < this.#particles.length; j++) {
          const q = this.#particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 105) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(80,205,174,${(1 - d / 105) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    });
  }

  #initEvents() {
    if (!this.#ctx) return;
    window.addEventListener("resize", this.resize, { passive: true });
    
    const onPointerMove = throttle((ev) => {
      this.#pointer.x = ev.clientX;
      this.#pointer.y = ev.clientY;
      document.body.style.setProperty("--aurora-x", `${(ev.clientX / Math.max(this.#width, 1) - 0.5) * 3}%`);
    }, 16);

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stop();
      } else if (this.#motionMode !== 'off') {
        this.start();
      }
    });

    this.resize();
  }
}
