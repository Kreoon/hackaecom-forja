"""Crea la carpeta de una corrida tienda-express.

Uso: python -I tools/tienda/nueva.py <slug> "<url producto o 'fotos'>" "<url referencia>"
Crea jornadas/<slug>/{insumos,referencia,creativos/marca,creativos/ugc,tema} + corrida.json con hora de inicio.
"""
import json
import sys
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]

slug, producto, referencia = sys.argv[1], sys.argv[2], sys.argv[3]
run = ROOT / "jornadas" / slug
for d in ("insumos", "referencia", "creativos/marca", "creativos/ugc", "tema"):
    (run / d).mkdir(parents=True, exist_ok=True)
meta = {"slug": slug, "producto": producto, "referencia": referencia, "inicio": datetime.now().isoformat(timespec="seconds"),
        "tienda": "hackaecom.myshopify.com", "tema_base": "Base tienda express (no tocar)", "tema_base_id": 165468078339, "hitos": {}}
(run / "corrida.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"ok · {run.relative_to(ROOT)}")
