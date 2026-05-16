export interface ConfettiOptions {
  colors?: string[];
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle';
  decay: number;
}

const DEFAULT_COLORS = ['#00d9ff', '#c000ff', '#ffb338', '#ff6b9d', '#f1ee99', '#ffffff'];

export function runConfetti(canvas: HTMLCanvasElement, options: ConfettiOptions = {}): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const colors = options.colors ?? DEFAULT_COLORS;
  const duration = options.duration ?? 7000;
  let particles: Particle[] = [];
  let animationId = 0;
  const startTime = performance.now();
  let lastTime = startTime;

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  resize();

  const spawnBurst = (x: number, y: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 3 + Math.random() * 7;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        w: 5 + Math.random() * 6,
        h: 4 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.18,
        opacity: 1,
        shape: Math.random() > 0.45 ? 'rect' : 'circle',
        decay: 0.004 + Math.random() * 0.007,
      });
    }
  };

  const spawnRain = (count: number) => {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.5 + Math.random() * 3.5,
        w: 4 + Math.random() * 5,
        h: 6 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.12,
        opacity: 0.75 + Math.random() * 0.25,
        shape: 'rect',
        decay: 0.0015,
      });
    }
  };

  spawnBurst(canvas.width * 0.25, canvas.height * 0.12, 35);
  spawnBurst(canvas.width * 0.75, canvas.height * 0.12, 35);
  spawnBurst(canvas.width * 0.5, canvas.height * 0.08, 45);
  spawnRain(60);

  const burstTimer = window.setInterval(() => {
    if (performance.now() - startTime > duration) return;
    spawnBurst(canvas.width * (0.15 + Math.random() * 0.7), canvas.height * (0.05 + Math.random() * 0.1), 22);
  }, 1100);

  const loop = (now: number) => {
    const dt = Math.min((now - lastTime) / 16, 2.5);
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.opacity > 0.04 && p.y < canvas.height + 40);

    for (const p of particles) {
      p.vy += 0.12 * dt;
      p.vx *= 0.992;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.rotationSpeed * dt;
      p.opacity -= p.decay * dt;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (Math.random() < 0.06) spawnRain(2);

    if (now - startTime < duration) {
      animationId = requestAnimationFrame(loop);
    }
  };

  animationId = requestAnimationFrame(loop);

  const parent = canvas.parentElement;
  const resizeObserver = parent ? new ResizeObserver(resize) : null;
  if (parent && resizeObserver) resizeObserver.observe(parent);

  return () => {
    cancelAnimationFrame(animationId);
    clearInterval(burstTimer);
    resizeObserver?.disconnect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
  };
}
