// Remplace des photos produits par des versions déjà détourées (PNG transparents fournis à la main).
// Lancer : node scripts/remplacer-photos.mjs boisson/mirinda-orange boisson/mirinda-fruity …
// Source : images-originales/<chemin>.png. Sortie : public/images/<chemin>.webp (800 px) et -sm.webp (400 px),
// au même format que les autres photos : cadre 4:3, produit centré, marge de 6 %.
import path from "node:path";
import sharp from "sharp";

const MARGE = 0.06;
const TAILLES = [
  { suffixe: "", largeur: 800 },
  { suffixe: "-sm", largeur: 400 },
];

for (const chemin of process.argv.slice(2)) {
  const { data, info } = await sharp(`images-originales/${chemin}.png`).ensureAlpha().trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  const largeurUtile = Math.max(info.width, (info.height * 4) / 3);
  const L = Math.round(largeurUtile / (1 - 2 * MARGE));
  const H = Math.round((L * 3) / 4);
  const cadre = await sharp({ create: { width: L, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: data, left: Math.round((L - info.width) / 2), top: Math.round((H - info.height) / 2) }])
    .png()
    .toBuffer();
  for (const t of TAILLES) {
    await sharp(cadre).resize({ width: t.largeur }).webp({ quality: 82, alphaQuality: 90 })
      .toFile(path.join("public/images", `${chemin}${t.suffixe}.webp`));
  }
  console.log("Remplacée :", chemin, `(${info.width}×${info.height} px utiles)`);
}
