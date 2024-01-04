// src/app/components/topbarLoader/page.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';

export default function TopbarLoader() {
  const loadingBarRef = useRef<any>(null);
  const currentPathname = usePathname();
  const [loadingBarColor, setLoadingBarColor] = useState('');

  useEffect(() => {
    loadingBarRef.current && loadingBarRef.current.continuousStart();

    // Check if the page is fully loaded
    const handleLoad = () => {
      if (document.readyState === 'complete') {
        loadingBarRef.current && loadingBarRef.current.complete();
      }
    };

    window.addEventListener('readystatechange', handleLoad);

    const timerId = setTimeout(() => {
      loadingBarRef.current && loadingBarRef.current.complete();
    }, 500);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('readystatechange', handleLoad);
    };
  }, [currentPathname]);

  useEffect(() => {
    const primaryBgElement = document.querySelector('.badge-error');
    if (primaryBgElement) {
      const computedStyle = getComputedStyle(primaryBgElement);
      const color = computedStyle.getPropertyValue('background-color');
      setLoadingBarColor(color);
    }
  }, []);

  return <LoadingBar color={loadingBarColor} ref={loadingBarRef} />;
}
