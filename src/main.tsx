import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Agentation: visual feedback toolbar for AI coding agents (bottom-right corner).
// Loaded only in development (`npm run dev`); it is not included in the production build.
const Agentation = import.meta.env.DEV
  ? lazy(() => import('agentation').then((m) => ({default: m.Agentation})))
  : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {Agentation && (
      <Suspense fallback={null}>
        <Agentation appName="Amouzegar" />
      </Suspense>
    )}
  </StrictMode>,
);
