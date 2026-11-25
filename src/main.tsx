import { render } from 'preact';
import { App } from './app/App';
import './styles/app.css';
import './styles/vercel-palette.css';
import './features/cinema/cinema.css';
import './features/certificate/certificate.css';

const target = document.getElementById('app');
if (target) render(<App />, target);
