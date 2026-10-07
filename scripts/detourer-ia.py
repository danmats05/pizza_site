#!/usr/bin/env python3
"""Détourage IA des photos produits qui ont un arrière-plan (fond gris, texturé, plateau, mise en scène).

À lancer APRÈS scripts/detourer-produits.mjs (qui réécrit data/photos.ts) :
    python3 scripts/detourer-ia.py               # traite toutes les photos de CIBLES
    python3 scripts/detourer-ia.py sandwichs/cordon-bleu tacos/poulet   # seulement celles-ci

Dépendances : pip3 install --user onnxruntime scipy pillow numpy
Modèles ONNX (rembg) téléchargés automatiquement dans ~/.u2net/ au premier lancement.
(rembg lui-même ne s'installe pas sous Python 3.13 à cause de numba/llvmlite : on appelle les modèles directement.)

Pour chaque photo : masque IA (BiRefNet par défaut) calculé sur l'original de images-originales/,
nettoyage (ombres portées et voile gris effacés, petits débris retirés), décontamination des bords
(plus de halo blanc/gris), recadrage au plus près, cadre 4:3 avec ~6 % de marge, produit centré,
puis écriture des WebP 800 px et 400 px (-sm) dans public/images/.
"""
import os
import sys
import urllib.request

import numpy as np
import onnxruntime as ort
from PIL import Image
from scipy import ndimage

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(RACINE, "images-originales")
SORTIE = os.path.join(RACINE, "public", "images")
PHOTOS_TS = os.path.join(RACINE, "data", "photos.ts")
MODELES_DIR = os.path.expanduser("~/.u2net")
URL_MODELES = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/"

MODELES = {
    # nom: (fichier, moyenne, écart-type, sigmoïde en sortie)
    "birefnet": ("BiRefNet-general-epoch_244.onnx", (0.485, 0.456, 0.406), (0.229, 0.224, 0.225), True),
    "isnet": ("isnet-general-use.onnx", (0.5, 0.5, 0.5), (1.0, 1.0, 1.0), False),
}

TAILLES = [("", 800), ("-sm", 400)]
MARGE = 0.06  # marge autour du produit, en part de la largeur finale
MAX_TRAVAIL = 2000  # côté max de l'image de travail

# Photos détourées par IA. Valeur = options (modèle, seuils).
# Les pizzas vues de dessus déjà transparentes et les canettes nettes ne sont pas listées : déjà propres.
DEFAUT = {}
CIBLES = {
    # Pizzas sur fond / planche
    "base-tomate/la-fabulous": DEFAUT,
    "base-tomate/peperoni-lover": DEFAUT,
    "base-tomate/pizza-chawarma": DEFAUT,
    "base-tomate/pizza-max-it": DEFAUT,
    # Boissons en mise en scène
    "boisson/jus-naturel": DEFAUT,
    "boisson/jus-naturel-2": DEFAUT,
    "boisson/jus-naturel-3": DEFAUT,
    "boisson/eau-kirene": DEFAUT,
    # Desserts
    "dessert/glace-mammamia": {"debris": 0.3},
    "dessert/crepe": DEFAUT,
    "dessert/haagen-dazs-batonnets": DEFAUT,
    "dessert/kinder": DEFAUT,
    "dessert/milkshakes": DEFAUT,
    "dessert/panini-nutella": DEFAUT,
    "dessert/tarte-au-daim": DEFAUT,
    "dessert/tiramisu": DEFAUT,
    # Sandwichs
    "sandwichs/cordon-bleu": DEFAUT,
    "sandwichs/mix-steak-cordon-bleu": DEFAUT,
    "sandwichs/sandwich-chawarma": DEFAUT,
    "sandwichs/sandwich-kebab": DEFAUT,
    "sandwichs/sandwich-steak-hache": DEFAUT,
    # Paninis
    "panini/le-3-fromages": DEFAUT,
    "panini/le-chevre": DEFAUT,
    "panini/le-fermier": DEFAUT,
    "panini/le-merguez": DEFAUT,
    "panini/le-milano": DEFAUT,
    "panini/le-pacifico": DEFAUT,
    "panini/le-time": DEFAUT,
    "panini/le-venezia": DEFAUT,
    # Tacos
    "tacos/merguez": DEFAUT,
    "tacos/poulet": DEFAUT,
    "tacos/tacos-chawarma": DEFAUT,
    "tacos/tacos-mix": DEFAUT,
    "tacos/tacos-tenders": DEFAUT,
    "tacos/tacos-viande-hachee": DEFAUT,
    # Tex-mex
    "tex-mex/calamars-frits": DEFAUT,
    "tex-mex/chicken-wings-pane": DEFAUT,
    "tex-mex/chicken-wings": DEFAUT,
    "tex-mex/frites-patates-douces": DEFAUT,
    "tex-mex/frites": DEFAUT,
    "tex-mex/le-crousty": {"modele": "isnet", "disque": True},
    "tex-mex/mozza-sticks": DEFAUT,
    "tex-mex/nuggets": DEFAUT,
    "tex-mex/swiss-cheesy": DEFAUT,
    # Retire le mot « SPICY » incrusté en haut à droite.
    "tex-mex/tenders-epice": {"effacer": [(0.54, 0, 1, 0.29)], "effacer_rouge": [(0.54, 0.29, 1, 0.34)]},
    "tex-mex/tenders-nature": {"effacer": [(0.54, 0, 1, 0.29)], "effacer_rouge": [(0.54, 0.29, 1, 0.34)]},
    # Salades
    "salade/l-oceane": DEFAUT,
    "salade/la-fermiere": DEFAUT,
    "salade/la-nicoise": DEFAUT,
    "salade/la-paysanne": DEFAUT,
}

# Photos fournies déjà détourées par l'utilisateur : ne jamais les réécrire.
EXCLUES = {
    "boisson/mirinda-orange",
    "boisson/mirinda-fruity",
    "boisson/schweppes-pomme",
    "boisson/schweppes-agrumes",
    "boisson/7up",
}

# Photos laissées volontairement sur leur fond (détourage sale). Chemins /images/<dossier>/<nom>.webp
SUR_FOND = []

_sessions = {}


def session(nom):
    if nom not in _sessions:
        fichier = MODELES[nom][0]
        chemin = os.path.join(MODELES_DIR, fichier)
        if not os.path.exists(chemin):
            os.makedirs(MODELES_DIR, exist_ok=True)
            print(f"Téléchargement du modèle {fichier}…", flush=True)
            urllib.request.urlretrieve(URL_MODELES + fichier, chemin + ".part")
            os.replace(chemin + ".part", chemin)
        opts = ort.SessionOptions()
        opts.log_severity_level = 3
        _sessions[nom] = ort.InferenceSession(chemin, opts, providers=["CPUExecutionProvider"])
    return _sessions[nom]


def masque_ia(img, nom):
    """Masque de premier plan (float 0..1) à la taille de img."""
    _, moy, ecart, sig = MODELES[nom]
    x = np.asarray(img.convert("RGB").resize((1024, 1024), Image.BICUBIC), dtype=np.float32) / 255.0
    x = ((x - moy) / ecart).transpose(2, 0, 1)[None].astype(np.float32)
    s = session(nom)
    o = s.run(None, {s.get_inputs()[0].name: x})[0][0, 0].astype(np.float32)
    if sig:
        o = 1 / (1 + np.exp(-o))
    o = (o - o.min()) / (o.max() - o.min() + 1e-8)
    m = Image.fromarray(o, mode="F").resize(img.size, Image.BICUBIC)
    return np.clip(np.asarray(m, dtype=np.float32), 0, 1)


def flou(a, rayon):
    return ndimage.gaussian_filter(a.astype(np.float32), rayon)


def nettoyer(alpha, bas, haut, debris):
    # Rehausse le contraste du masque : le voile gris des ombres portées (alpha faible) disparaît,
    # le produit devient pleinement opaque.
    a = np.clip((alpha - bas) / (haut - bas), 0, 1)
    # Retire les petits débris isolés (miettes, morceaux de décor).
    lab, n = ndimage.label(a > 0.25)
    if n > 1:
        tailles = ndimage.sum(np.ones_like(a), lab, index=np.arange(1, n + 1))
        garder = np.zeros(n + 1, bool)
        garder[1:] = tailles >= debris * tailles.max()
        zone = ndimage.binary_dilation(garder[lab], iterations=3)
        a = a * zone
    # Bouche les trous internes (reflets blancs pris pour du fond).
    plein = ndimage.binary_fill_holes(a > 0.5)
    a = np.maximum(a, (plein & ~(a > 0.5)) * 1.0)
    return a


def decontaminer(rgb, a):
    """Retire la couleur du fond mélangée aux pixels de bord (halo blanc/gris)."""
    poids = (a < 0.02).astype(np.float32)
    fond = np.zeros_like(rgb)
    pf = flou(poids, 12) + 1e-4
    for c in range(3):
        fond[..., c] = flou(rgb[..., c] * poids, 12) / pf
    # Là où aucun fond n'est proche, on prend la couleur moyenne du fond.
    if poids.sum() > 0:
        moyen = (rgb * poids[..., None]).sum((0, 1)) / poids.sum()
    else:
        moyen = np.array([255, 255, 255], np.float32)
    loin = (pf < 0.01)[..., None]
    fond = np.where(loin, moyen, fond)
    bord = (a > 0.01) & (a < 0.98)
    aa = np.maximum(a, 0.05)[..., None]
    pur = np.clip((rgb - (1 - aa) * fond) / aa, 0, 255)
    return np.where(bord[..., None], pur, rgb)


def disque(m):
    """Produit rond vu de dessus (bol) : on garde le disque défini par le bord haut et les bords
    gauche/droit du masque, ce qui retire la main qui tient le bol et lisse le bord."""
    h, w = m.shape
    ys, xs = np.where(m > 0.5)
    x0, x1, y0 = np.percentile(xs, 0.2), np.percentile(xs, 99.8), np.percentile(ys, 0.2)
    r = (x1 - x0) / 2
    cx, cy = (x0 + x1) / 2, y0 + r
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    return np.clip(r - d + 0.5, 0, 1).astype(np.float32)


def trouver_original(cle):
    dossier, nom = cle.split("/")
    for f in os.listdir(os.path.join(SOURCE, dossier)):
        if f.rsplit(".", 1)[0] == nom and f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
            return os.path.join(SOURCE, dossier, f)
    raise FileNotFoundError(cle)


def detourer(cle, opts):
    img = Image.open(trouver_original(cle))
    img = img.convert("RGBA")
    img.thumbnail((MAX_TRAVAIL, MAX_TRAVAIL), Image.LANCZOS)
    rgb = np.asarray(img, dtype=np.float32)[..., :3]
    alpha_orig = np.asarray(img, dtype=np.float32)[..., 3] / 255.0

    m = masque_ia(img, opts.get("modele", "birefnet"))
    m = np.minimum(m, alpha_orig)  # garde la transparence éventuelle de l'original
    if opts.get("disque"):
        m = disque(m)
    h, w = m.shape
    # Zones à effacer (texte incrusté…), en fractions de l'image : (x0, y0, x1, y1).
    for x0, y0, x1, y1 in opts.get("effacer", []):
        m[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)] = 0
    # Idem mais seulement les pixels rouges (lettres rouges collées au produit).
    for x0, y0, x1, y1 in opts.get("effacer_rouge", []):
        zone = (slice(int(y0 * h), int(y1 * h)), slice(int(x0 * w), int(x1 * w)))
        rouge = (rgb[zone][..., 0] - rgb[zone][..., 1]) > 95
        m[zone][rouge] = 0
    a = nettoyer(m, opts.get("bas", 0.12), opts.get("haut", 0.85), opts.get("debris", 0.02))
    rgb = decontaminer(rgb, a)

    # Recadrage au plus près
    ys, xs = np.where(a > 0.03)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgba = np.dstack([rgb, a * 255]).round().clip(0, 255).astype(np.uint8)[y0:y1, x0:x1]
    rgba[rgba[..., 3] == 0, :3] = 0
    produit = Image.fromarray(rgba, "RGBA")

    # Cadre 4:3 avec marge, produit centré
    w, h = produit.size
    utile = max(w, h * 4 / 3)
    L = round(utile / (1 - 2 * MARGE))
    H = round(L * 3 / 4)
    cadre = Image.new("RGBA", (L, H), (0, 0, 0, 0))
    cadre.paste(produit, ((L - w) // 2, (H - h) // 2))

    dossier, nom = cle.split("/")
    for suffixe, largeur in TAILLES:
        sortie = cadre.resize((largeur, round(largeur * 3 / 4)), Image.LANCZOS)
        sortie.save(os.path.join(SORTIE, dossier, f"{nom}{suffixe}.webp"), "WEBP",
                    quality=82, alpha_quality=90, method=6)


def ecrire_photos_ts():
    lignes = ",\n".join(f'  "{p}"' for p in sorted(SUR_FOND))
    contenu = (
        "// Fichier généré par scripts/detourer-ia.py : photos laissées sur leur fond (détourage pas assez propre).\n"
        "// Les cartes produit les adoucissent avec un fondu sur les bords.\n"
        f"export const PHOTOS_SUR_FOND = new Set<string>([{chr(10) + lignes + chr(10) if lignes else ''}]);\n"
    )
    with open(PHOTOS_TS, "w", encoding="utf-8") as f:
        f.write(contenu)


def main():
    demandees = sys.argv[1:] or list(CIBLES)
    sur_fond = {p.split("/images/")[1][:-5] for p in SUR_FOND}
    for cle in demandees:
        if cle in EXCLUES or cle in sur_fond:
            print(f"Ignorée : {cle}")
            continue
        detourer(cle, CIBLES.get(cle, DEFAUT))
        print(f"Détourée : {cle}", flush=True)
    ecrire_photos_ts()
    print(f"\n{len(SUR_FOND)} photo(s) gardée(s) sur leur fond.")


if __name__ == "__main__":
    main()
