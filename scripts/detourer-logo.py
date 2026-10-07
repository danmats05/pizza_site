#!/usr/bin/env python3
"""Détoure le logo Pizza Time : retire l'ombre portée / le cadre noir autour
de la carte blanche, nettoie le bord (antialiasing sans halo) et recadre au plus près.

Source : images-originales/logo/logo.webp (jamais modifiée)
Sortie : public/images/logo.webp

Usage (depuis pizza-time/) :  python3 scripts/detourer-logo.py
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

RACINE = Path(__file__).resolve().parent.parent
SOURCE = RACINE / "images-originales/logo/logo.webp"
SORTIE = RACINE / "public/images/logo.webp"

BANDE = 3  # largeur (px) de la zone de bord où les gris sont convertis en alpha


def main() -> None:
    img = np.array(Image.open(SOURCE).convert("RGBA")).astype(np.float32)
    rgb, a = img[..., :3], img[..., 3]
    lum = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    sat = rgb.max(-1) - rgb.min(-1)

    # 1. La carte = plus grande zone claire ou colorée (blanc, vert, rouge), trous bouchés.
    clair = (a > 0) & ((lum > 128) | (sat > 60))
    etiq, n = ndimage.label(clair)
    tailles = ndimage.sum(clair, etiq, range(1, n + 1))
    carte = ndimage.binary_fill_holes(etiq == (np.argmax(tailles) + 1))

    # 2. Bande de bord : quelques px de part et d'autre du contour de la carte.
    dehors = ndimage.binary_dilation(carte, iterations=BANDE) & ~carte
    dedans = carte & ~ndimage.binary_erosion(carte, iterations=BANDE)
    bande = dehors | dedans

    # 3. Dans la bande, un pixel gris (peu saturé) est un mélange blanc/noir :
    #    sa luminance donne la couverture du blanc -> alpha, couleur = blanc pur.
    gris = sat < 40
    alpha = np.where(carte, a, 0.0)
    conv = bande & gris
    alpha[conv] = a[conv] * lum[conv] / 255.0
    rgb_out = rgb.copy()
    rgb_out[conv] = 255.0

    out = np.dstack([rgb_out, alpha]).clip(0, 255).astype(np.uint8)
    out[out[..., 3] == 0, :3] = 0

    # 4. Recadrage au plus près.
    ys, xs = np.nonzero(out[..., 3] > 4)
    out = out[ys.min(): ys.max() + 1, xs.min(): xs.max() + 1]

    res = Image.fromarray(out, "RGBA")
    res.save(SORTIE, "WEBP", quality=95, method=6, exact=True)
    print(f"{SORTIE.relative_to(RACINE)} : {res.width} x {res.height}")


if __name__ == "__main__":
    main()
