import React, { useEffect, useRef, useCallback } from 'react';

export type PrizeId = 'mini_consolation' | 'consolation' | 'fourth' | 'third' | 'second' | 'first' | 'special';

interface FireworksProps {
  prizeId?: PrizeId | null;
  isActive?: boolean;
  triggerId?: number;
  zIndex?: number;
}

// Prize to config mapping
interface PrizeConfig {
  particleCount: number;
  launchDelay: [number, number];
  duration: number;
  rocketSpeed?: number; // Tốc độ bay của pháo (default: 2)
  rocketAccel?: number; // Gia tốc (default: 1.05)
}

const PRIZE_CONFIG: Record<PrizeId, PrizeConfig> = {
  mini_consolation: { particleCount: 150, launchDelay: [600, 1200], duration: 4000 },
  consolation: { particleCount: 150, launchDelay: [600, 1200], duration: 4000 },
  fourth: { particleCount: 250, launchDelay: [400, 800], duration: 5000 },
  third: { particleCount: 300, launchDelay: [350, 700], duration: 5500 },
  second: { particleCount: 350, launchDelay: [300, 600], duration: 6000 },
  first: { particleCount: 450, launchDelay: [250, 500], duration: 7000 },
  // Special: Chậm hơn nhiều để tạo kịch tính
  special: { particleCount: 700, launchDelay: [150, 350], duration: 500000, rocketSpeed: 0.8, rocketAccel: 1.2 },
};

// Special Prize Sequence Timing (ms)
export const SPECIAL_SEQUENCE = {
  DARK_FADE_IN: 3000, // Màn hình tối dần
  ROCKETS_LAUNCH: 1000, // Bắt đầu bắn 10 quả pháo
  ROCKETS_FLIGHT: 3200, // Thời gian bay lên (điều chỉnh để flash trước khi nổ)
  EXPLOSION_FLASH: 1000, // Flash sáng khi nổ
  BRIGHT_REVEAL: 1000, // Sáng rực lên
  WINNER_APPEAR: 900, // Winner hiện lên
  CONFETTI_START: 800, // Pháo giấy bắt đầu
} as const;

const DEFAULT_CONFIG: PrizeConfig = { particleCount: 300, launchDelay: [400, 800], duration: 5000 };

// Gold & Orange color palette
const COLORS = [
  '#FFD700', // Gold
  '#FFA500', // Orange
  '#FF8C00', // Dark Orange
  '#FFBF00', // Amber
  '#DAA520', // Goldenrod
  '#B8860B', // Dark Goldenrod
  '#FFAA33', // Neon Orange
  '#D4AF37', // Metallic Gold
];

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

interface Coordinate {
  x: number;
  y: number;
}

class Firework {
  x: number;
  y: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  distanceToTarget: number;
  distanceTraveled: number;
  coordinates: Coordinate[];
  angle: number;
  speed: number;
  acceleration: number;
  brightness: number;

  constructor(sx: number, sy: number, tx: number, ty: number, customSpeed?: number, customAccel?: number) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
    this.distanceTraveled = 0;
    this.coordinates = [];
    for (let i = 0; i < 3; i++) {
      this.coordinates.push({ x: this.x, y: this.y });
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    // Use custom speed/accel for special slow rockets
    this.speed = customSpeed ?? 2;
    this.acceleration = customAccel ?? 1.05;
    this.brightness = random(50, 70);
  }

  update(): boolean {
    this.coordinates.pop();
    this.coordinates.unshift({ x: this.x, y: this.y });
    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = Math.sqrt(Math.pow(this.sx - this.x, 2) + Math.pow(this.sy - this.y, 2));
    if (this.distanceTraveled >= this.distanceToTarget) {
      return true; // Explode
    }
    this.x += vx;
    this.y += vy;
    return false;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    const last = this.coordinates[this.coordinates.length - 1];
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

class Particle {
  x: number;
  y: number;
  coordinates: Coordinate[];
  angle: number;
  speed: number;
  friction: number;
  gravity: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    for (let i = 0; i < 10; i++) {
      this.coordinates.push({ x: this.x, y: this.y });
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(3, 20);
    this.friction = 0.96; // Cao hơn = bay xa hơn
    this.gravity = 0.9; // Thấp hơn = rơi chậm hơn
    this.color = randomColor();
    this.alpha = 1;
    this.decay = random(0.0007, 0.004); // Thấp hơn = tồn tại lâu hơn
    this.size = random(1, 5);
  }

  update(): boolean {
    this.coordinates.pop();
    this.coordinates.unshift({ x: this.x, y: this.y });
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    return this.alpha <= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    const last = this.coordinates[this.coordinates.length - 1];
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.lineWidth = this.size;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

export const Fireworks: React.FC<FireworksProps> = ({ prizeId, isActive = false, triggerId = 0, zIndex = 2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const lastLaunchRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(0);
  const lastTriggerRef = useRef<string | null>(null);

  // Get config based on prizeId
  const config: PrizeConfig = prizeId ? PRIZE_CONFIG[prizeId] : DEFAULT_CONFIG;
  const nextLaunchDelayRef = useRef<number>(random(config.launchDelay[0], config.launchDelay[1]));

  const createParticles = useCallback(
    (x: number, y: number) => {
      const count = config.particleCount;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(new Particle(x, y));
      }
    },
    [config.particleCount]
  );

  const launchFirework = useCallback(
    (targetX?: number, targetY?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const startX = cw / 2 + random(-cw * 0.2, cw * 0.2);
      const tx = targetX ?? random(cw * 0.1, cw * 0.9);
      const ty = targetY ?? random(ch * 0.1, ch * 0.5);
      // Use custom speed/accel from config
      fireworksRef.current.push(new Firework(startX, ch, tx, ty, config.rocketSpeed, config.rocketAccel));
    },
    [config.rocketSpeed, config.rocketAccel]
  );

  // Launch 10 rockets simultaneously for Special Prize - EPIC grand finale effect
  // Slow rockets that fly up majestically before exploding together
  const launchSimultaneousFireworks = useCallback(
    (count: number = 10, slowMode: boolean = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cw = canvas.width;
      const ch = canvas.height;

      // Spread rockets across the screen width evenly
      const spacing = cw / (count + 1);
      const targetY = ch * 0.25; // All explode at same height (top quarter) for synchronized effect

      // Slow mode: rockets for dramatic effect (tuned to match flash timing ~1800ms)
      // Lower speed + accel = slower rockets that take longer to reach target
      const speed = slowMode ? 0.5 : (config.rocketSpeed ?? 2);
      const accel = slowMode ? 1.015 : (config.rocketAccel ?? 1.05);

      for (let i = 0; i < count; i++) {
        // Calculate X positions: evenly distributed from left to right
        const startX = spacing * (i + 1) + random(-30, 30); // Start from ground
        const targetX = spacing * (i + 1) + random(-50, 50); // Target with slight variance

        // Slight stagger (0-50ms) to make it feel more natural but still simultaneous
        setTimeout(
          () => {
            fireworksRef.current.push(new Firework(startX, ch, targetX, targetY + random(-20, 20), speed, accel));
          },
          random(0, 50)
        );
      }
    },
    [config.rocketSpeed, config.rocketAccel]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = (timestamp: number) => {
      if (!isActive) {
        // Clear canvas when not active
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationRef.current = requestAnimationFrame(loop);
        return;
      }

      const cw = canvas.width;
      const ch = canvas.height;
      const elapsed = timestamp - sessionStartRef.current;
      const withinDuration = elapsed < config.duration;

      // Clear canvas completely to keep background visible
      ctx.clearRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'lighter';

      // Update and draw fireworks
      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];
        fw.draw(ctx);
        if (fw.update()) {
          createParticles(fw.tx, fw.ty);
          fireworksRef.current.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.draw(ctx);
        if (p.update()) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Auto-launch within duration
      // For special prize: DON'T auto-launch during the initial slow rockets phase
      // to avoid early explosions before the synchronized flash
      const isSpecialInitialPhase = prizeId === 'special' && elapsed < SPECIAL_SEQUENCE.ROCKETS_FLIGHT + 200;
      if (withinDuration && !isSpecialInitialPhase) {
        if (timestamp - lastLaunchRef.current > nextLaunchDelayRef.current) {
          launchFirework();
          lastLaunchRef.current = timestamp;
          nextLaunchDelayRef.current = random(config.launchDelay[0], config.launchDelay[1]);
        }
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, config.duration, config.launchDelay, createParticles, launchFirework]);

  // Track session start when isActive becomes true
  useEffect(() => {
    const triggerKey = `${prizeId}-${isActive}`;
    if (isActive && lastTriggerRef.current !== triggerKey) {
      lastTriggerRef.current = triggerKey;
      sessionStartRef.current = performance.now();
      // Clear old particles for fresh start
      fireworksRef.current = [];
      particlesRef.current = [];

      // Special Prize: Launch 10 SLOW rockets for dramatic effect!
      // These rockets fly slowly up into the dark sky before exploding together
      if (prizeId === 'special') {
        // Initial barrage of 10 slow rockets - fly majestically through darkness
        launchSimultaneousFireworks(10, true); // slowMode = true

        // After the big explosion, continue with regular barrages
        setTimeout(() => launchSimultaneousFireworks(10, false), SPECIAL_SEQUENCE.ROCKETS_FLIGHT + 300);
        setTimeout(() => launchSimultaneousFireworks(10, false), SPECIAL_SEQUENCE.ROCKETS_FLIGHT + 1500);
        setTimeout(() => launchSimultaneousFireworks(10, false), SPECIAL_SEQUENCE.ROCKETS_FLIGHT + 3000);
      }
    }
    if (!isActive) {
      lastTriggerRef.current = null;
    }
  }, [isActive, prizeId, launchSimultaneousFireworks]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Fireworks;
