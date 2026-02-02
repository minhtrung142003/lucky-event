import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export type ConfettiLevel = 1 | 2 | 3 | 4;
export type PrizeId = 'mini_consolation' | 'consolation' | 'fourth' | 'third' | 'second' | 'first' | 'special';

// Mapping giải thưởng → cấp độ pháo hoa
// Level 1: Nhẹ nhàng (CYAN_MINT) - Khởi động, Khuyến khích
// Level 2: Trung bình (TET_RED_GOLD) - Giải Tư
// Level 3: Hoành tráng (TET_RED_GOLD) - Giải Ba
// Level 4: EPIC (TET_RED_GOLD) - Giải Nhì, Nhất, Đặc biệt
const PRIZE_TO_LEVEL: Record<PrizeId, ConfettiLevel> = {
  mini_consolation: 1, // Khởi động → Level 1
  consolation: 1, // Khuyến khích → Level 1
  fourth: 2, // Giải Tư → Level 2
  third: 3, // Giải Ba → Level 3
  second: 4, // Giải Nhì → Level 4
  first: 4, // Giải Nhất → Level 4
  special: 4, // Giải Đặc biệt → Level 4
};

// Premium Luxury Gold & Orange Palette
const LUXURY_GOLD = [
  '#FFD700', // Gold
  '#FFA500', // Orange
  '#FF8C00', // Dark Orange
  '#FFBF00', // Amber
  '#DAA520', // Goldenrod
  '#B8860B', // Dark Goldenrod
  '#FFAA33', // Neon Orange
  '#D4AF37', // Metallic Gold
  '#ffd561', // Classic Gold
  '#CD950C', // Dark Gold
];

// Cyan/Teal palette for Khuyến Khích & Khởi Động
const CYAN_MINT = [
  '#ABFFF4', // Base Mint Cyan
  '#7FFFD4', // Aquamarine
  '#40E0D0', // Turquoise
  '#00CED1', // Dark Turquoise
  '#5FFBF1', // Bright Cyan
  '#00FFEF', // Electric Cyan
  '#48D1CC', // Medium Turquoise
  '#20B2AA', // Light Sea Green
  '#00FFCC', // Spring Green
  '#7DF9FF', // Electric Blue
];

// Tết (Lunar New Year) Red & Gold palette
const TET_RED_GOLD = [
  '#FF0000', // Pure Red
  '#DC143C', // Crimson
  '#B22222', // Fire Brick
  '#FF4500', // Orange Red
  '#CC0000', // Dark Red
  '#FF2400', // Scarlet
  '#FFD700', // Gold
  '#FFA500', // Orange
  '#FFBF00', // Amber
  '#D4AF37', // Metallic Gold
];

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

const getResponsiveScalar = (baseScalar: number, scale: number = 1) => {
  console.log('Confetti scalar:', scale);
  console.log('Confetti final scalar:', baseScalar * scale);
  return baseScalar * scale;
};

type ConfettiInstance = typeof confetti;

// Level 1: Giải Khuyến Khích & Khởi Động - Nhẹ nhàng, dễ thương
const level1 = (instance: ConfettiInstance = confetti, scale: number = 1) => {
  const duration = 2500;
  const end = Date.now() + duration;

  const gentleBottomCannons = () => {
    if (Date.now() > end) return;

    // Góc trái dưới bắn lên nhẹ
    instance({
      particleCount: 20,
      angle: 60,
      spread: 45,
      origin: { x: 0, y: 1 },
      colors: CYAN_MINT,
      ticks: 600,
      gravity: 0.8,
      decay: 0.96,
      startVelocity: 50,
      shapes: ['circle'],
      scalar: getResponsiveScalar(2.5, scale),
    });

    // Góc phải dưới bắn lên nhẹ
    instance({
      particleCount: 20,
      angle: 120,
      spread: 45,
      origin: { x: 1, y: 1 },
      colors: CYAN_MINT,
      ticks: 600,
      gravity: 0.8,
      decay: 0.96,
      startVelocity: 50,
      shapes: ['circle'],
      scalar: getResponsiveScalar(2.5, scale),
    });

    requestAnimationFrame(() => setTimeout(gentleBottomCannons, 300));
  };

  gentleBottomCannons();
};

// Level 2: Giải 5, 4, 3 - Năng động, ấn tượng
const level2 = (instance: ConfettiInstance = confetti, scale: number = 1) => {
  const duration = 4000;
  const end = Date.now() + duration;

  // Phase 1: Bắn mạnh từ 2 góc dưới
  const bottomCannons = () => {
    if (Date.now() > end) return;

    // Góc trái dưới bắn lên
    instance({
      particleCount: 40,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 1 },
      colors: TET_RED_GOLD,
      ticks: 600,
      gravity: 0.6,
      decay: 0.97,
      startVelocity: 75,
      shapes: ['circle', 'square'],
      scalar: getResponsiveScalar(2.5, scale),
      drift: randomInRange(-4, 4),
    });

    // Góc phải dưới bắn lên
    instance({
      particleCount: 40,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 1 },
      colors: TET_RED_GOLD,
      ticks: 600,
      gravity: 0.6,
      decay: 0.97,
      startVelocity: 75,
      shapes: ['circle', 'square'],
      scalar: getResponsiveScalar(2.5, scale),
      drift: randomInRange(-4, 4),
    });

    requestAnimationFrame(() => setTimeout(bottomCannons, 300));
  };

  bottomCannons();
};

// Level 3: Giải Nhất, Nhì - Hoành tráng, nhiều điểm phát
// Uses TET_RED_GOLD palette - Lunar New Year lucky colors
const level3 = (instance: ConfettiInstance = confetti, scale: number = 1) => {
  const duration = 4000;
  const end = Date.now() + duration;

  // Phase 1: Opening blast - 3 điểm đồng thời
  [0.2, 0.5, 0.8].forEach((x, i) => {
    setTimeout(() => {
      instance({
        particleCount: 90,
        spread: 90,
        origin: { x, y: 0.4 },
        colors: TET_RED_GOLD,
        ticks: 800,
        gravity: 0.5,
        decay: 0.94,
        startVelocity: 60,
        shapes: ['circle', 'square'],
        scalar: getResponsiveScalar(2.7, scale),
      });
    }, i * 200);
  });

  // Phase 2: Waves từ 2 bên
  for (let i = 0; i < 6; i++) {
    const side = i % 2 === 0 ? 0.08 : 0.92;
    const angle = i % 2 === 0 ? 55 : 125;

    setTimeout(
      () => {
        instance({
          particleCount: 70,
          angle,
          spread: 55,
          origin: { x: side, y: 0.75 },
          colors: TET_RED_GOLD,
          ticks: 800,
          gravity: 0.55,
          decay: 0.95,
          startVelocity: 65,
          shapes: ['circle', 'square'],
          scalar: getResponsiveScalar(2.7, scale),
        });
      },
      700 + i * 180
    );
  }

  // Phase 3: Random bursts across screen
  const randomBurst = () => {
    if (Date.now() > end - 600) return;

    if (Math.random() > 0.45) {
      instance({
        particleCount: randomInRange(50, 80),
        spread: randomInRange(70, 110),
        origin: { x: randomInRange(0.2, 0.8), y: randomInRange(0.3, 0.6) },
        colors: TET_RED_GOLD,
        ticks: 800,
        gravity: randomInRange(0.45, 0.6),
        decay: 0.94,
        startVelocity: randomInRange(50, 70),
        shapes: ['circle', 'square'],
        scalar: getResponsiveScalar(randomInRange(2.4, 2.9), scale),
      });
    }

    setTimeout(randomBurst, randomInRange(140, 280));
  };
  setTimeout(randomBurst, 1400);

  // Phase 4: Continuous rain
  const goldRain = () => {
    if (Date.now() > end) return;

    instance({
      particleCount: 3,
      spread: 180,
      origin: { x: Math.random(), y: 0 },
      colors: TET_RED_GOLD,
      ticks: 900,
      gravity: 0.5,
      decay: 0.96,
      startVelocity: 0,
      shapes: ['circle'],
      scalar: getResponsiveScalar(randomInRange(2.3, 3.2), scale),
    });

    requestAnimationFrame(goldRain);
  };
  setTimeout(goldRain, 1800);
};

// Level 4: Giải Đặc Biệt - EPIC FINALE
// Uses TET_RED_GOLD palette - Maximum Lunar New Year festivity
const level4 = (instance: ConfettiInstance = confetti, scale: number = 1) => {
  const duration = 5500;
  const end = Date.now() + duration;

  // Phase 1: Massive center explosion
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      instance({
        particleCount: 130,
        spread: 110 + i * 30,
        origin: { x: 0.5, y: 0.4 },
        colors: TET_RED_GOLD,
        ticks: 900,
        gravity: 0.45,
        decay: 0.94,
        startVelocity: 75 - i * 8,
        shapes: ['circle', 'square'],
        scalar: getResponsiveScalar(2.7, scale),
      });
    }, i * 140);
  }

  // Phase 2: Powerful side cannons
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      const side = i % 2 === 0 ? 0.05 : 0.95;
      const angle = i % 2 === 0 ? 55 : 125;

      setTimeout(() => {
        instance({
          particleCount: 90,
          angle,
          spread: 50,
          origin: { x: side, y: 0.8 },
          colors: TET_RED_GOLD,
          ticks: 900,
          gravity: 0.5,
          decay: 0.95,
          startVelocity: 70,
          shapes: ['circle', 'square'],
          scalar: getResponsiveScalar(2.7, scale),
        });
      }, i * 110);
    }
  }, 600);

  // Phase 3: Red & Gold rain deluxe
  const goldenRain = () => {
    if (Date.now() > end - 1200) return;

    instance({
      particleCount: 5,
      spread: 180,
      origin: { x: Math.random(), y: 0 },
      colors: TET_RED_GOLD,
      ticks: 1000,
      gravity: 0.4,
      decay: 0.97,
      startVelocity: 0,
      shapes: ['circle'],
      scalar: getResponsiveScalar(randomInRange(2.6, 3.8), scale),
    });

    requestAnimationFrame(goldenRain);
  };
  setTimeout(goldenRain, 1200);

  // Phase 4: Continuous massive bursts
  const continuousBurst = () => {
    if (Date.now() > end - 800) return;

    if (Math.random() > 0.35) {
      instance({
        particleCount: randomInRange(60, 100),
        spread: randomInRange(80, 130),
        origin: { x: randomInRange(0.15, 0.85), y: randomInRange(0.25, 0.55) },
        colors: TET_RED_GOLD,
        ticks: 900,
        gravity: randomInRange(0.4, 0.55),
        decay: 0.95,
        startVelocity: randomInRange(55, 75),
        shapes: ['circle', 'square'],
        scalar: getResponsiveScalar(randomInRange(2.5, 3.1), scale),
      });
    }

    setTimeout(continuousBurst, randomInRange(110, 230));
  };
  setTimeout(continuousBurst, 1500);

  // Phase 5: Grand Finale - Bottom to top wave
  setTimeout(() => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        instance({
          particleCount: 110,
          spread: 95,
          origin: { x: 0.08 + i * 0.08, y: 0.9 },
          colors: TET_RED_GOLD,
          ticks: 1000,
          gravity: 0.35,
          decay: 0.95,
          startVelocity: 80,
          shapes: ['circle', 'square'],
          scalar: getResponsiveScalar(2.7, scale),
        });
      }, i * 65);
    }

    // Ultimate center burst
    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          instance({
            particleCount: 180,
            spread: 170,
            origin: { x: 0.5, y: 0.35 },
            colors: TET_RED_GOLD,
            ticks: 1200,
            gravity: 0.3,
            decay: 0.96,
            startVelocity: 85,
            shapes: ['circle', 'square'],
            scalar: getResponsiveScalar(2.7 + i * 0.2, scale),
          });
        }, i * 130);
      }
    }, 550);
  }, 4300);
};

const LEVEL_EFFECTS: Record<ConfettiLevel, (instance?: ConfettiInstance, scale?: number) => void> = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
};

export const useConfetti = () => {
  const triggerByLevel = useCallback((level: ConfettiLevel, instance?: ConfettiInstance, scale?: number) => {
    const effect = LEVEL_EFFECTS[level];
    if (effect) effect(instance, scale);
  }, []);

  const triggerByPrizeId = useCallback(
    (prizeId: PrizeId, instance?: ConfettiInstance, scale?: number) => {
      const level = PRIZE_TO_LEVEL[prizeId];
      if (level) triggerByLevel(level, instance, scale);
    },
    [triggerByLevel]
  );

  // Debug helper
  if (typeof window !== 'undefined') {
    (window as any).__testConfetti = (level: ConfettiLevel, scale?: number) => triggerByLevel(level, undefined, scale);
  }

  return { triggerByLevel, triggerByPrizeId };
};

export const useLegacyConfetti = () => {
  const { triggerByLevel } = useConfetti();
  return useCallback((scale?: number) => triggerByLevel(4, undefined, scale), [triggerByLevel]);
};
