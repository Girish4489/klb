import Head from 'next/head';
import Image from 'next/image';
import React from 'react';

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
    for (let i = 0; i < 30; i++) {
      const randomShape = maskShapes[Math.floor(Math.random() * maskShapes.length)];
      stars.push(
        <div
          key={i}
          className={`mask ${randomShape} absolute h-2 w-2 animate-ping bg-secondary`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 1}s`,
          }}
        ></div>,
      );
    }
    return stars;
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden">
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div className="absolute inset-0 bg-warning-content"></div>
      <div className="z-10 flex items-center justify-center gap-2 rounded-box border border-info bg-info-content p-10 max-sm:flex-col">
        <Image className="mask mask-squircle select-none" src="/klm.webp" alt="KLM" width={80} height={80} />
        <div className="h-10 rounded-box border-4 border-base-200 max-sm:h-0 max-sm:w-12 max-sm:border-4"></div>
        <span className="flex flex-col items-center justify-center">
          <div className="label text-5xl font-bold text-primary">OOPS!</div>
          <div className="label pt-0 font-bold text-warning">404 | Page not found</div>
        </span>
      </div>
      <div className="absolute inset-0">{createStars()}</div>
    </div>
  );
};

export default NotFound;
