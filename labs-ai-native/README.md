# AI Engineering Native Python Labs (Senior Mode)

Laboratorios reproducibles en Python estándar (`>=3.10`, cero dependencias externas obligatorias) para validar invariantes reales de producción fuera del navegador:

1. `rag_acl`: Aislamiento multi-tenant pre-retrieval, resolución de citas y abstención segura.
2. `ml_splits`: Partición temporal estricta sin fuga de entidades y cálculo PSI estable.
3. `finops_budget`: Reserva atómica concurrente (thread-safe) y conciliación de presupuesto.

## Ejecutar pruebas

```bash
python -m unittest discover -s . -v
```
