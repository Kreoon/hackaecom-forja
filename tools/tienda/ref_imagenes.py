"""Imágenes de la página de referencia → una imagen objetivo por cada ID fijo (composición a calcar).

Paso 1 (tienda-referencia):  python -I tools/tienda/ref_imagenes.py descargar jornadas/<slug>
  Toma todas las URLs de imagen de referencia/pagina.md (markdown crudo de Firecrawl), descarga las de ≥ 300 px
  a referencia/imgs/raw/NN.jpg (sin duplicados) y arma referencia/imgs/raw/indice.jpg numerado para mirarlo con Read.
Paso 2 (tienda-referencia):  escribir referencia/imagenes.json  {"g1": 3, "t1": 12, ..., "ugc01": 7}
  (número = NN del índice; un mismo número puede ir en varios IDs) y correr:
                             python -I tools/tienda/ref_imagenes.py asignar jornadas/<slug>
  → copia referencia/imgs/<id>.jpg. tienda-creativos usa cada una como referencia de composición.
"""
import hashlib
import json
import re
import shutil
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding="utf-8")


def descargar(run: Path):
    md = (run / "referencia" / "pagina.md").read_text(encoding="utf-8")
    urls = []
    for u in re.findall(r"!\[[^\]]*\]\((https?://[^)\s]+)", md) + re.findall(r'https?://[^\s"\')]+\.(?:jpe?g|png|webp)(?:\?[^\s"\')]*)?', md):
        u = u.replace("&amp;", "&")
        if u not in urls:
            urls.append(u)
    raw = run / "referencia" / "imgs" / "raw"
    raw.mkdir(parents=True, exist_ok=True)
    seen, n, thumbs = set(), 0, []
    for u in urls:
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=15).read()
            im = Image.open(BytesIO(data)).convert("RGB")
        except Exception:
            continue
        if min(im.size) < 300:
            continue
        h = hashlib.md5(im.resize((16, 16)).tobytes()).hexdigest()
        if h in seen:
            continue
        seen.add(h)
        n += 1
        im.thumbnail((1200, 1200))
        im.save(raw / f"{n:02d}.jpg", quality=85)
        t = im.copy(); t.thumbnail((200, 200))
        thumbs.append((n, t))
    if thumbs:
        cols, s = 8, 210
        sheet = Image.new("RGB", (cols * s, ((len(thumbs) + cols - 1) // cols) * (s + 20)), "white")
        for i, (k, t) in enumerate(thumbs):
            x, y = (i % cols) * s, (i // cols) * (s + 20)
            sheet.paste(t, (x, y + 20)); ImageDraw.Draw(sheet).text((x + 4, y + 4), f"{k:02d}", fill="black")
        sheet.save(raw / "indice.jpg", quality=80)
    print(f"{n} imágenes de la referencia → {raw / 'indice.jpg'}")


def asignar(run: Path):
    m = json.loads((run / "referencia" / "imagenes.json").read_text(encoding="utf-8"))
    raw = run / "referencia" / "imgs" / "raw"
    ok = []
    for img_id, num in m.items():
        src = raw / f"{int(num):02d}.jpg"
        if src.exists():
            shutil.copy(src, run / "referencia" / "imgs" / f"{img_id}.jpg"); ok.append(img_id)
    print(f"asignadas: {len(ok)} → referencia/imgs/<id>.jpg")


if __name__ == "__main__":
    {"descargar": descargar, "asignar": asignar}[sys.argv[1]](Path(sys.argv[2]))
