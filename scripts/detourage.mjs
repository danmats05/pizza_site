// Outils de détourage partagés par les scripts d'images.

/** Seuil : écart maximal au blanc (et à un gris neutre) pour qu'un pixel soit considéré comme du fond. */
const SEUIL = 34;

/**
 * Rend transparent le fond clair relié aux bords de l'image (parcours depuis le pourtour).
 * `data` : pixels RGBA bruts, modifiés sur place. Renvoie la part du pourtour devenue transparente (0 à 1).
 */
export function detourer(data, largeur, hauteur) {
  const estFond = (i) => {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
    return a < 20 || (255 - Math.min(r, g, b) < SEUIL && Math.max(r, g, b) - Math.min(r, g, b) < 24);
  };
  const vu = new Uint8Array(largeur * hauteur);
  const pourtour = [];
  for (let x = 0; x < largeur; x++) pourtour.push(x, (hauteur - 1) * largeur + x);
  for (let y = 0; y < hauteur; y++) pourtour.push(y * largeur, y * largeur + largeur - 1);
  const file = [...pourtour];
  while (file.length) {
    const i = file.pop();
    if (vu[i] || !estFond(i)) continue;
    vu[i] = 1;
    data[i * 4 + 3] = 0;
    const x = i % largeur;
    if (x > 0) file.push(i - 1);
    if (x < largeur - 1) file.push(i + 1);
    if (i >= largeur) file.push(i - largeur);
    if (i < largeur * (hauteur - 1)) file.push(i + largeur);
  }
  return pourtour.filter((i) => data[i * 4 + 3] === 0).length / pourtour.length;
}
