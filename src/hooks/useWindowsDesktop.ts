import {useEffect, useState} from 'react';

// Keep the requested presentation changes exclusive to Windows desktop browsers.
export function useWindowsDesktop() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!/Windows/i.test(navigator.userAgent)) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const update = () => setEnabled(desktop.matches);
    update();
    desktop.addEventListener('change', update);
    return () => desktop.removeEventListener('change', update);
  }, []);

  return enabled;
}