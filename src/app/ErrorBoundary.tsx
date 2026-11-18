import { Component } from 'preact';
import type { ComponentChildren } from 'preact';

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<{ children: ComponentChildren }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div class="content-page">
          <section class="card">
            <h1>Algo salió mal al renderizar esta vista</h1>
            <p>Tu progreso local permanece seguro en el navegador.</p>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.hash = '#/';
              }}
            >
              Volver al inicio
            </button>
          </section>
        </div>
      );
    }
    return this.props.children;
  }
}
