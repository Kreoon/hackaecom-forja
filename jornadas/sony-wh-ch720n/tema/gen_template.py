"""Genera templates/product.hacky.json desde el copy de brief.md (jornada sony-wh-ch720n).
Orden 1:1 con referencia/mapa-secciones.md. Imágenes: shopify://shop_images/<archivo> (subidas con fileCreate).
Uso: python -I tema/gen_template.py  (desde jornadas/sony-wh-ch720n)"""
import json
from pathlib import Path

order, sections = [], {}


def img(name):
    return f"shopify://shop_images/{name}"


def sec(key, type_, settings=None, blocks=None):
    blocks = blocks or []
    ids = [f"{key}_{i}" for i in range(len(blocks))]
    sections[key] = {"type": type_, "settings": settings or {},
                     "blocks": dict(zip(ids, blocks)), "block_order": ids}
    order.append(key)


def b(type_, **s):
    return {"type": type_, "settings": s}


MQ = ["Cancelación de ruido", "35 h de batería", "2 dispositivos a la vez", "Llamadas claras", "Livianos y cómodos", "Pagas al recibir"]
OFFER_1, OFFER_2 = "1 unidad", "Pack x2 + estuche de regalo"
ACCORDIONS = [
    ("Descripción", "<p>Los WH-CH720N son los audífonos de diadema con cancelación de ruido más livianos de Sony. El procesador integrado V1 y la tecnología de sensor de ruido dual reducen el ruido de tu entorno para que te concentres en tu música, tus clases o tus llamadas. Hasta 35 horas de batería con la cancelación de ruido encendida.</p>"),
    ("¿Por qué estos audífonos?", "<p>Si tu día pasa entre el bus, la oficina y la casa, el ruido cansa. Con estos te aíslas cuando quieres, cambias del computador al celular sin volver a emparejar y llegas al viernes con batería.</p>"),
    ("Sobre tu regalo", "<p><strong>Estuche rígido de viaje:</strong> protege tus audífonos en la maleta o el morral. Viene de regalo con el Pack x2.</p><p><strong>Envío gratis:</strong> en todos los pedidos de hoy.</p>"),
    ("Especificaciones", "<ul><li>Diadema sobre la oreja</li><li>Bluetooth con multipunto (2 dispositivos)</li><li>Swift Pair y Fast Pair</li><li>Cancelación activa de ruido con sensor dual</li><li>Procesador V1 y DSEE</li><li>Ecualizador en la app Sony | Headphones Connect · 360 Reality Audio</li><li>Micrófonos con formación de haz</li><li>Compatible con Google Assistant y Siri</li><li>Cable de audio para uso con cable</li><li>No resistentes al agua</li></ul>"),
    ("Qué incluye", "<p>Audífonos Sony WH-CH720N, cable de audio y cable USB. En el Pack x2: estuche rígido de viaje de regalo.</p>"),
    ("¿Tienen garantía?", "<p>Sí. Tienes hasta 7 días después de la entrega. Si llega dañado o con defecto, te devolvemos el dinero o te lo cambiamos. Si simplemente no te gustó, lo puedes devolver y el envío de regreso corre por tu cuenta.</p>"),
]


def buybox_blocks(with_acc=True, with_avatars=True):
    bl = [
        b("offer", option_value=OFFER_1, title="Lleva 1", meta="$349.900 la unidad"),
        b("offer", option_value=OFFER_2, title="Lleva 2 + regalo", meta="$314.950 c/u · Uno para ti y otro para regalar", tag="Más elegido", gift="GRATIS Estuche rígido de viaje (valor $59.900)"),
        b("gift", image=img("hk-g1.jpg"), title="Envío GRATIS", value="$15.000"),
        b("gift", image=img("hk-g2.jpg"), title="Estuche de viaje GRATIS", value="$59.900", locked=True, unlock_offer=OFFER_2),
        b("gift", image=img("hk-w1.jpg"), title="Garantía 7 días", value=""),
    ]
    if with_avatars:
        bl += [b("avatar", image=img(f"hk-ugc{n:02d}.jpg")) for n in (4, 11, 15, 19)]
    if with_acc:
        bl += [b("accordion", title=t, body=x) for t, x in ACCORDIONS]
    return bl


BUY_COMMON = {
    "features": "Cancelación de ruido\n35 h de batería\nMultipunto\nLlamadas claras\nProcesador V1\nCarga rápida",
    "color_option": "Color", "scarcity": 87, "scarcity_label": "vendido · Lote de lanzamiento",
    "eta_days": 3, "shipping": "Pide hoy y recíbelo el", "origin": "Envío desde Colombia 🇨🇴",
    "button": "PEDIR AHORA · PAGO CONTRAENTREGA", "gifts_label": "REGALOS DESBLOQUEADOS",
    "trust": "🔒 No pagas nada por adelantado | ↩ Devolución hasta 7 días",
}

# 0 · Popup rasca y gana
sec("pop", "hk-popup", {"enabled": True, "delay": 5, "logo": img("hk-logo-hacky.png"), "pill": "Lanzamiento HACKY 🎧",
    "heading": "¡Estás de suerte!", "text": "Rasca la tarjeta y mira lo que ganaste 👀", "prize": "ENVÍO GRATIS HOY", "image": img("hk-g3.jpg")})
# 1 · Anuncio + contador → va en sections/header-group.json, encima del header (igual que la referencia)
ANN = {"type": "hk-announcement", "settings": {"title": "LANZAMIENTO HACKY", "text": "Hasta 24 % de descuento · Paga al recibir", "countdown_hours": 2}}
# 2 · Cinta de beneficios
sec("mq", "hk-marquee", {}, [b("item", text=t) for t in MQ])
# 3 · Bloque de compra (hero)
sec("main", "hk-buybox", {**BUY_COMMON, "layout": "full",
    "proof": "Calificados 4,4/5 en Amazon · 490 opiniones",
    "eyebrow": "Audífonos Sony con cancelación de ruido",
    "heading": "Silencio para ti, música para todo el día",
    "subheading": "Los Sony WH-CH720N bajan el ruido del bus, la oficina y la calle, y te acompañan hasta 35 horas con una sola carga."},
    buybox_blocks() + [b("video", image=img(f"hk-ugc{n:02d}.jpg"), caption=c) for n, c in ((11, ""), (12, "Los usé 1 semana"), (13, "Por esto no vuelvo atrás"))])
# 4 · Videos "Lo que dicen" → van dentro del bloque de compra, bajo la galería (igual que la referencia)
# 5 · Banda de cifras
sec("stats", "hk-stats", {"bg": img("hk-t1.jpg"), "heading": "Menos ruido. Más foco. Todo el día.",
    "text": "La tecnología de Sony, ahora con pago al recibir.", "button": "Pídelos sin riesgo hoy"}, [
    b("stat", number="35 h", label="De batería con cancelación de ruido"),
    b("stat", number="2", label="Dispositivos conectados a la vez"),
    b("stat", number="V1", label="Procesador integrado de Sony"),
    b("stat", number="4,4/5", label="En Amazon, 490 calificaciones")])
# 6 · 4 tecnologías
sec("tech", "hk-cards", {"heading": "4 tecnologías <em>haciendo su trabajo</em>", "columns": "4", "style": "square", "alt": True}, [
    b("card", image=img("hk-t1.jpg"), title="Sensor de ruido dual", text="Dos micrófonos escuchan el ruido de afuera y la cancelación lo reduce para que no subas tanto el volumen."),
    b("card", image=img("hk-t2.jpg"), title="Procesador V1", text="El cerebro de los audífonos: procesa la cancelación de ruido y el sonido con precisión."),
    b("card", image=img("hk-t3.jpg"), title="DSEE", text="Recupera detalles de la música comprimida para que suene más natural."),
    b("card", image=img("hk-t4.jpg"), title="Captación precisa de voz", text="Micrófonos con formación de haz y reducción de ruido de viento para que te escuchen claro.")])
# 7 · Reseñas destacadas (franja + 3 tarjetas)
sec("rev1", "hk-reviews", {"score": "", "heading": "Historias reales, <em>resultados reales</em>", "text": "Mira lo que dicen quienes ya los usan.", "alt": True, "layout": "grid"},
    [b("thumb", image=img(f"hk-ugc{n:02d}.jpg")) for n in range(1, 11)] + [
    b("review", rating="5.0", title="Por fin trabajo sin escuchar la obra del vecino", text="Los uso en la casa y en el bus. La cancelación de ruido me cambió el día y la batería me dura toda la semana.", author="Laura M.", avatar=img("hk-ugc04.jpg"), tags="Concentración | Batería", demo=True),
    b("review", rating="4.9", title="Livianos de verdad", text="Me los pongo a las 8 y me acuerdo que los tengo puestos a la hora del almuerzo. Nada de dolor de cabeza.", author="Andrés P.", avatar=img("hk-ugc05.jpg"), tags="Comodidad | Uso diario", demo=True),
    b("review", rating="5.0", title="Llamadas clarísimas", text="Trabajo en llamadas todo el día y me dejaron de decir que no me escuchan. Y cambio del PC al celular sin desconectar.", author="Camila R.", avatar=img("hk-ugc06.jpg"), tags="Llamadas | Multipunto", demo=True)])
# 8 · Beneficios + producto al centro
sec("bc", "hk-benefits-center", {"heading": "<em>Suenan mejor.</em> Todos los días.", "text": "Del primer trayecto de la mañana a la última serie de la noche.", "image": img("hk-p1.png")}, [
    b("item", icon="ANC", title="Cancelación de ruido"), b("item", icon="35h", title="35 h de batería"),
    b("item", icon="2×", title="Multipunto"), b("item", icon="🎙", title="Llamadas claras")])
# 9 · Beneficios reales (filas)
sec("rows", "hk-rows", {"heading": "<em>Beneficios reales.</em> Para tu día a día.", "text": "Cuatro momentos en los que vas a notar la diferencia."}, [
    b("row", image=img("hk-b1.jpg"), title="Trabajo y estudio", subtitle="Concéntrate en serio.", text="Baja el ruido de la oficina, el café o la casa y entra en modo foco."),
    b("row", image=img("hk-b2.jpg"), title="Viajes", subtitle="El ruido se queda afuera.", text="Ideal para trayectos largos y vuelos; la batería aguanta hasta 35 horas."),
    b("row", image=img("hk-t4.jpg"), title="Llamadas", subtitle="Te escuchan claro.", text="Micrófonos que captan tu voz y reducen el viento."),
    b("row", image=img("hk-b4.jpg"), title="Música", subtitle="Tu música, como debe sonar.", text="Ajusta el sonido a tu gusto con el ecualizador de la app.")])
# 10 · Cinta repetida
sec("mq2", "hk-marquee", {}, [b("item", text=t) for t in MQ])
# 11 · Línea de tiempo
sec("tl", "hk-timeline", {"image": img("hk-l1.jpg"), "heading": "<em>Tu día</em> con los WH-CH720N",
    "text": "Hechos para usarlos todo el día, no solo un rato. Así cambia tu rutina.", "button": "Quiero los míos →"}, [
    b("step", title="7:00 a. m. · Trayecto", items="Cancelación de ruido encendida en el bus o el carro\nLlegas sin el estrés del ruido\nTu playlist suena clara a volumen bajo"),
    b("step", title="9:00 a. m. · Trabajo o clase", items="Conectados al computador y al celular a la vez\nCambias sin volver a emparejar\nModo foco sin interrupciones"),
    b("step", title="3:00 p. m. · Llamadas", items="Micrófonos que captan tu voz\nTu equipo te escucha claro\nCómodos después de horas"),
    b("step", title="9:00 p. m. · Descanso", items="Tu serie o tu playlist\nTodavía te queda batería para el resto de la semana\nCarga rápida si se te olvida cargarlos")])
# 12 · 5 razones
sec("why", "hk-cards", {"badge": "5 razones", "heading": "Por qué los WH-CH720N son distintos a todo lo que has probado", "columns": "3", "style": "wide", "alt": True, "button": "Pídelos sin riesgo hoy"}, [
    b("card", image=img("hk-z1.jpg"), kicker="Razón 1", title="Batería de 35 horas", text="Cárgalos el lunes y olvídate del cable buena parte de la semana."),
    b("card", image=img("hk-z2.jpg"), kicker="Razón 2", title="Livianos de verdad", text="Los audífonos de diadema con cancelación de ruido más livianos de Sony."),
    b("card", image=img("hk-z3.jpg"), kicker="Razón 3", title="Dos dispositivos a la vez", text="Computador y celular conectados; contestas la llamada sin desconectar nada."),
    b("card", image=img("hk-z4.jpg"), kicker="Razón 4", title="Llamadas claras", text="Captación precisa de voz y reducción de ruido de viento."),
    b("card", image=img("hk-z5.jpg"), kicker="Razón 5", title="Sonido a tu gusto", text="Ecualizador en la app Sony | Headphones Connect y 360 Reality Audio.")])
# 13 · Comparativa
sec("cmp", "hk-compare", {"us": "WH-CH720N", "them": "Genéricos", "heading": "WH-CH720N vs. audífonos genéricos",
    "points": "<strong>Cancelación de ruido real</strong> — sensor dual y procesador V1\n<strong>Batería que dura</strong> — hasta 35 h con ANC\n<strong>Multipunto</strong> — 2 dispositivos a la vez\n<strong>Sonido a tu gusto</strong> — app con ecualizador",
    "button": "Pídelos sin riesgo hoy"}, [
    b("row", us="ANC con sensor dual", them="ANC sin especificar"), b("row", us="Hasta 35 h de batería", them="Batería sin dato confiable"),
    b("row", us="2 dispositivos a la vez", them="Uno a la vez"), b("row", us="App con ecualizador", them="Sin app"),
    b("row", us="Marca Sony", them="Marca desconocida")])
# 14 · Garantía
sec("gu", "hk-guarantee", {"number": "7", "unit": "DÍAS", "kicker": "Compra sin riesgo", "heading": "Garantía de 7 días",
    "text": "Si llega dañado o con defecto, te devolvemos el dinero o te lo cambiamos. Y pagas solo cuando lo recibes.", "image": img("hk-w1.jpg")})
# 15 · Videos "Gente real"
sec("vids2", "hk-videos", {"heading": "Gente real. <em>Resultados reales.</em>", "text": "Escúchalo en sus propias palabras.", "button": "Pídelos sin riesgo hoy"},
    [b("video", image=img(f"hk-ugc{n:02d}.jpg"), caption=c) for n, c in ((10, ""), (14, "Me los regalaron"), (16, "Así suenan"), (18, ""), (20, "Mi mamá los ama"), (22, ""))])
# 16 · Oferta repetida (bloque de compra compacto)
sec("buy2", "hk-buybox", {**BUY_COMMON, "layout": "compact", "header_image": img("hk-g5.jpg"),
    "heading": "<em>Compártelos.</em> Llévate dos y ahorra.", "subheading": "Uno para ti y otro para regalar. El pack x2 trae estuche de viaje de regalo."},
    buybox_blocks(with_acc=False, with_avatars=False))
# 17 · Lista de reseñas
sec("rev2", "hk-reviews", {"score": "Calificados 4,4/5 en Amazon · 490 opiniones", "heading": "Lo sintieron. Tú también lo vas a sentir.", "alt": False, "layout": "list"}, [
    b("review", rating="5.0", title="El bus ya no me estresa", text="Dos horas diarias en TransMilenio y ahora llego tranquila. La cancelación de ruido sí se nota.", tags="Transporte | Cancelación de ruido", demo=True),
    b("review", rating="5.0", title="La batería es una locura", text="Los cargué el domingo y el viernes todavía tenían batería. Los uso para trabajar y para el gimnasio.", tags="Batería | Uso diario", demo=True),
    b("review", rating="5.0", title="Pagué al recibir, sin miedo", text="Me llegaron en 3 días, revisé que todo estuviera bien y pagué. Muy buena experiencia.", tags="Contraentrega | Envío", demo=True),
    b("review", rating="4.8", title="Ideal para estudiar", text="Me encierro en mi música y rindo más. Livianos y no me aprietan con gafas.", tags="Estudio | Comodidad", demo=True)])
# 18 · Footer → va en sections/footer-group.json (aparece en todas las páginas)
FOOT = {"type": "hk-footer", "settings": {"logo": img("hk-logo-hacky-blanco.png"), "menu": "footer", "news_title": "Únete a la lista HACKY",
    "news_text": "Recibe lanzamientos, ofertas y descuentos exclusivos.",
    "legal": "<p>Sony y WH-CH720N son marcas de Sony Group Corporation. HACKY es un revendedor independiente.</p><p>* Las reseñas marcadas como demo son de ejemplo y se reemplazan por reseñas reales. Tienda demo del HackaEcom 2026.</p>"}}

out = Path(__file__).parent / "templates" / "product.hacky.json"
out.parent.mkdir(exist_ok=True)
out.write_text(json.dumps({"sections": sections, "order": order}, ensure_ascii=False, indent=1), encoding="utf-8")
print(out, len(order), "secciones")
hg = Path(__file__).parent / "sections" / "header-group.json"
if hg.exists():
    h = json.loads(hg.read_text(encoding="utf-8"))
    h["sections"]["hk_ann"] = ANN
    h["order"] = ["hk_ann"] + [k for k in h["order"] if k != "hk_ann"]
    hg.write_text(json.dumps(h, ensure_ascii=False, indent=1), encoding="utf-8")
    print("header-group con anuncio arriba")
fg = Path(__file__).parent / "sections" / "footer-group.json"
if fg.exists():
    f = json.loads(fg.read_text(encoding="utf-8"))
    for k, v in f["sections"].items():
        if k != "hk_foot":
            v["disabled"] = True
    f["sections"]["hk_foot"] = FOOT
    f["order"] = [k for k in f["order"] if k != "hk_foot"] + ["hk_foot"]
    fg.write_text(json.dumps(f, ensure_ascii=False, indent=1), encoding="utf-8")
    print("footer-group con footer HACKY")
