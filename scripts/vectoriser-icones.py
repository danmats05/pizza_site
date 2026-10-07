"""
Vectorise les icônes PNG (Icons8) de public/icons/ en SVG nets à toute taille, avec potrace.
Lancer : python3 scripts/vectoriser-icones.py

- Icônes noires (silhouette) : une couche, la forme opaque.
- Icônes de couleur : deux couches. Le remplissage (toute la forme, en dégradé du blanc vers une teinte
  claire de l'icône, comme l'original) et, par-dessus, le trait dans la couleur dominante.
L'image est agrandie (×12) et lissée avant le tracé pour obtenir des courbes propres.
Les PNG d'origine restent dans public/icons/ ; les SVG sont écrits à côté (même nom).
"""
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

DOSSIER = Path("public/icons")
ECHELLE = 12


def tracer(masque: np.ndarray) -> str:
    """Trace un masque booléen (agrandi) et renvoie les chemins SVG dans le repère du masque."""
    with tempfile.TemporaryDirectory() as tmp:
        pbm = Path(tmp) / "m.pbm"
        svg = Path(tmp) / "m.svg"
        Image.fromarray(np.where(masque, 0, 255).astype(np.uint8)).convert("1").save(pbm)
        subprocess.run(
            ["potrace", str(pbm), "-s", "-o", str(svg), "--turdsize", "40", "--alphamax", "1.0", "--opttolerance", "0.3", "--flat"],
            check=True,
        )
        texte = svg.read_text()
    transformation = re.search(r'<g transform="([^"]+)"', texte).group(1)
    chemins = re.findall(r'<path d="([^"]+)"', texte)
    return transformation, chemins


def masque_agrandi(couche: np.ndarray, taille: int, seuil: int = 127, flou: float = 0.35) -> np.ndarray:
    """Agrandit une couche 0-255 avec lissage, puis seuil (plus haut = trait plus fin)."""
    im = Image.fromarray(couche.astype(np.uint8)).resize((taille * ECHELLE, taille * ECHELLE), Image.LANCZOS)
    im = im.filter(ImageFilter.GaussianBlur(ECHELLE * flou))
    return np.array(im) > seuil


def groupe(transformation, chemins, remplissage):
    d = " ".join(chemins)
    return f'<g transform="{transformation}" fill="{remplissage}"><path d="{d}"/></g>'


for png in sorted(DOSSIER.glob("*.png")):
    im = np.array(Image.open(png).convert("RGBA")).astype(float)
    taille = im.shape[0]
    rgb, alpha = im[..., :3], im[..., 3]
    opaque = alpha > 40
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    lum = rgb.mean(axis=2)
    couleur = opaque & (sat > 120)  # pixels du trait de couleur

    vb = f"0 0 {taille * ECHELLE} {taille * ECHELLE}"
    if couleur.sum() < 0.2 * opaque.sum():
        # Icône noire : silhouette (servie en masque CSS, la couleur vient du texte)
        t, c = tracer(masque_agrandi(alpha, taille))
        corps = groupe(t, c, "#000")
        defs = ""
    else:
        teinte = np.median(rgb[couleur], axis=0).astype(int)
        hexa = "#%02x%02x%02x" % tuple(teinte)
        clair = "#%02x%02x%02x" % tuple((255 * 0.72 + teinte * 0.28).astype(int))
        # Trait : intensité du trait pondérée par l'alpha
        force_trait = np.clip((sat - 90) / 110, 0, 1) * alpha
        t_trait, c_trait = tracer(masque_agrandi(force_trait, taille, seuil=150, flou=0.22))
        # Remplissage : toute la forme opaque (le trait est dessiné par-dessus), légèrement rentré
        t_fond, c_fond = tracer(masque_agrandi(alpha, taille, seuil=170))
        defs = (
            f'<defs><linearGradient id="d-{png.stem}" x1="0" y1="0" x2="1" y2="1">'
            f'<stop offset="0.15" stop-color="#ffffff"/><stop offset="1" stop-color="{clair}"/></linearGradient></defs>'
        )
        corps = groupe(t_fond, c_fond, f"url(#d-{png.stem})") + groupe(t_trait, c_trait, hexa)

    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{defs}{corps}</svg>\n'
    png.with_suffix(".svg").write_text(svg)
    print(f"{png.stem}.svg ({len(svg) // 1024} Ko)")
