import { createRoot } from 'react-dom/client';
import LandingApp from './LandingApp';
import './index.css';

document.documentElement.classList.add('motion-enabled');

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element #root not found');
}

createRoot(root).render(<LandingApp />);
