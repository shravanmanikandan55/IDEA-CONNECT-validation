import { useState, useEffect } from 'react';

export function useDevice() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };

    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;
      setIsPWA(isStandalone || isIOSStandalone);
    };

    handleResize();
    checkPWA();

    window.addEventListener('resize', handleResize);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkPWA);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkPWA);
    };
  }, []);

  return { deviceType, isPWA };
}
