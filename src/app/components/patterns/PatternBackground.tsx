'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface PatternConfig {
  shape: 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' | 'mixed';
  size: number;
  spacing: number;
  color: string;
  opacity?: number;
  rotate?: number;
  rounded?: boolean;
}

const getShapePath = (
  shape: PatternConfig['shape'],
  size: number,
  rounded: boolean = false,
  index: number = 0,
): string => {
  const radius = rounded ? size * 0.2 : 0;

  if (shape === 'mixed') {
    const shapes: Array<Exclude<PatternConfig['shape'], 'mixed'>> = [
      'circle',
      'square',
      'triangle',
      'pentagon',
      'hexagon',
    ];
    // Use index to deterministically select shape
    return getShapePath(shapes[index % shapes.length], size, rounded);
  }

  switch (shape) {
    case 'square':
      return `M${radius},0 H${size - radius} Q${size},0 ${size},${radius} V${size - radius} Q${size},${size} ${size - radius},${size} H${radius} Q0,${size} 0,${size - radius} V${radius} Q0,0 ${radius},0`;
    case 'triangle':
      return `M${size / 2},0 L${size},${size} L0,${size} Z`;
    case 'pentagon':
      const penPoints = Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        return `${(size / 2) * (1 + Math.cos(angle))},${(size / 2) * (1 + Math.sin(angle))}`;
      });
      return `M${penPoints.join(' L')} Z`;
    case 'hexagon':
      const hexPoints = Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 6;
        return `${(size / 2) * (1 + Math.cos(angle))},${(size / 2) * (1 + Math.sin(angle))}`;
      });
      return `M${hexPoints.join(' L')} Z`;
    default:
      return `M${size / 2},0 A${size / 2},${size / 2} 0 1,1 ${size / 2},${size} A${size / 2},${size / 2} 0 1,1 ${size / 2},0`;
  }
};

export default function PatternBackground({ config }: { config: PatternConfig }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const { shape, size, spacing, opacity = 0.3, rotate = 0 } = config;
  const color = config.color.startsWith('bg-')
    ? window.getComputedStyle(document.querySelector(`.${config.color}`) || document.body).backgroundColor
    : config.color;

  const shapePaths =
    shape === 'mixed'
      ? `
        <g transform="translate(${(spacing - size) / 2} ${(spacing - size) / 2})">
          <path d="${getShapePath('mixed', size * 0.5, config.rounded, 0)}" fill="${color}" transform="translate(0,0)" />
          <path d="${getShapePath('mixed', size * 0.5, config.rounded, 1)}" fill="${color}" transform="translate(${size * 0.5},0)" />
          <path d="${getShapePath('mixed', size * 0.5, config.rounded, 2)}" fill="${color}" transform="translate(0,${size * 0.5})" />
          <path d="${getShapePath('mixed', size * 0.5, config.rounded, 3)}" fill="${color}" transform="translate(${size * 0.5},${size * 0.5})" />
        </g>
      `
      : `<path d="${getShapePath(shape, size, config.rounded)}" fill="${color}" transform="translate(${(spacing - size) / 2} ${(spacing - size) / 2})" />`;

  return (
    <motion.div className="absolute inset-0 -z-10" initial={{ opacity: 0 }} animate={{ opacity }} exit={{ opacity: 0 }}>
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg width="${spacing}" height="${spacing}" viewBox="0 0 ${spacing} ${spacing}" xmlns="http://www.w3.org/2000/svg">
              <g transform="rotate(${rotate} ${spacing / 2} ${spacing / 2})">
                ${shapePaths}
              </g>
            </svg>
          `)}")`,
          backgroundSize: `${spacing}px ${spacing}px`,
        }}
      />
    </motion.div>
  );
}
