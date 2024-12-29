import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const Portal: FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect((): (() => void) => {
    setMounted(true);
    return (): void => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};

export default Portal;
