import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
};

const NotFound: React.FC = () => {
  const maskShapes = [
    'mask-squircle',
    'mask-heart',
    'mask-hexagon',
    'mask-hexagon-2',
    'mask-decagon',
    'mask-pentagon',
    'mask-diamond',
    'mask-square',
    'mask-circle',
    'mask-parallelogram',
    'mask-parallelogram-2',
    'mask-parallelogram-3',
    'mask-parallelogram-4',
    'mask-star',
    'mask-star-2',
    'mask-triangle',
    'mask-triangle-2',
    'mask-triangle-3',
    'mask-triangle-4',
    'mask-half-1',
    'mask-half-2',
  ];

  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 40; i++) {
      const randomShape = maskShapes[Math.floor(Math.random() * maskShapes.length)];
      const size = Math.random() * 3 + 1; // Random size between 1-4px
      const colors = ['bg-secondary', 'bg-primary', 'bg-accent'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      stars.push(
        <div
          key={i}
          className={`mask ${randomShape} absolute animate-ping ${randomColor}`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${Math.random() * 3 + 1}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        ></div>,
      );
    }
    return stars;
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-base-300 to-warning-content">
      <div className="absolute inset-0 bg-opacity-50">{createStars()}</div>
      <div className="animate-float z-10 flex flex-col items-center justify-center gap-6 rounded-box border-2 border-info bg-base-300/80 p-10 backdrop-blur-sm">
        <Image
          className="mask mask-squircle select-none transition-transform hover:scale-105"
          src="/klm.webp"
          alt="KLM"
          width={100}
          height={100}
        />
        <div className="flex flex-col items-center gap-2">
          <h1 className="animate-pulse text-6xl font-bold text-primary">404</h1>
          <p className="text-2xl font-semibold text-warning">Page Not Found</p>
          <p className="mt-2 text-center text-info-content">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link href="/" className="btn btn-primary btn-sm btn-wide mt-4 transition-colors hover:btn-secondary">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
