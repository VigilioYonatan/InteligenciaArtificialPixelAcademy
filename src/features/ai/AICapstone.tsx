import { Card } from '../../shared/ui/primitives';

export function AICapstone() {
  const zipHref = `${import.meta.env.BASE_URL}downloads/ai-native-senior-labs.zip`;

  return (
    <section class="ai-case">
      <p><a href="#/ai">← AI Engineering Academy</a></p>
      <h2>Senior AI Capstone &amp; Laboratorios Python Nativos</h2>
      <p>
        Descarga el paquete reproducible <code>labs-ai-native/</code> con código Python puro y
        pruebas automatizadas reales (<code>python -m unittest discover</code> / <code>pytest</code>)
        para ejecutar fuera del navegador.
      </p>
      <Card>
        <h3>3 Módulos Nativos Incluidos</h3>
        <ul>
          <li><code>rag_acl/evaluator.py</code> — Aislamiento multi-tenant pre-retrieval, resolución de citas y gate de abstención.</li>
          <li><code>ml_splits/temporal_guard.py</code> — Partición temporal estricta sin fuga de entidades y cálculo PSI estable.</li>
          <li><code>finops_budget/atomic_ledger.py</code> — Reserva atómica concurrente (thread-safe) y conciliación de presupuesto FinOps.</li>
        </ul>
        <p>
          <a class="btn btn-primary" href={zipHref} download>
            📦 Descargar ai-native-senior-labs.zip
          </a>
        </p>
        <pre class="mini-code">{`unzip ai-native-senior-labs.zip\ncd labs-ai-native\npython -m unittest discover -s . -v`}</pre>
      </Card>
    </section>
  );
}
