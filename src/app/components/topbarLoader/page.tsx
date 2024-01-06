// src/app/components/topbarLoader/page.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

export default function TopbarLoader() {
  const loadingBarRef = useRef<any>(null);
  const currentPathname = usePathname();

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

  return <LoadingBar color={'red'} ref={loadingBarRef} />;
}
