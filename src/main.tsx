import { render } from 'preact';
import { App } from './app/App';
import './styles/app.css';
import './styles/vercel-palette.css';
import './features/cinema/cinema.css';

const target = document.getElementById('app');
if (target) render(<App />, target);
