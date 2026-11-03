import {useEffect, useState} from 'react';

/** True on desktop-width screens (1024px and up), on any operating system. */
export function useDesktop() {
  const [enabled, setEnabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const update = () => setEnabled(desktop.matches);
    update();
    desktop.addEventListener('change', update);
    return () => desktop.removeEventListener('change', update);
  }, []);

  return enabled;
}
