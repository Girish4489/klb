'use client';
import { JSX, useEffect, useState } from 'react';

export default function ScrollProgress(): JSX.Element {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScroll = (): void => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      ticking = false;
    };

    const onScroll = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScroll();
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return (): void => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 top-0 z-[100] w-full bg-base-300 bg-opacity-20 ${scrollProgress > 1 ? 'block h-0.5 md:h-[3px] lg:h-1' : 'hidden h-0'}`}
    >
      <div
        className="h-full rounded-br-lg bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-150 "
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
