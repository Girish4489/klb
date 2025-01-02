'use client';

import Portal from '@components/Portal/Portal';
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Portal>
      <div className="min-h-screen bg-white text-black print:bg-white">{children}</div>
    </Portal>
  );
};

export default Layout;
