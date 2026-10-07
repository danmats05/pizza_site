// Détoure les photos produits pour qu'elles se posent directement sur les cartes blanches (sans cadre coloré).
// Remplace les WebP produits par optimiser-images.mjs. Lancer après lui : node scripts/detourer-produits.mjs
//
// Pour chaque photo : fond clair relié aux bords effacé (bord adouci), recadrage au plus près,
// puis mise au format 4:3 avec une marge, pour que tous les produits aient une taille cohérente.
// Si le fond n'est pas uni (vraie mise en scène), la photo d'origine est gardée et listée dans
// data/photos.ts : les cartes l'adoucissent alors avec un fondu sur les bords.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { detourer } from "./detourage.mjs";

const SOURCE = "images-originales";
const SORTIE = "public/images";
const DOSSIERS_EXCLUS = new Set(["logo"]);
const TAILLES = [
  { suffixe: "", largeur: 800 },
  { suffixe: "-sm", largeur: 400 },
];
const MARGE = 0.06; // marge autour du produit, en part de la largeur finale
const REUSSITE = 0.85; // part minimale du pourtour effacée pour considérer le détourage réussi

const surFond = [];

for (const dossier of await fs.readdir(SOURCE)) {
  if (DOSSIERS_EXCLUS.has(dossier)) continue;
  for (const fichier of await fs.readdir(path.join(SOURCE, dossier))) {
    if (!/\.(png|jpe?g|webp)$/i.test(fichier)) continue;
    const base = fichier.replace(/\.\w+$/, "");
    const { data, info } = await sharp(path.join(SOURCE, dossier, fichier))
      .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const part = detourer(data, info.width, info.height);
    const brut = { raw: { width: info.width, height: info.height, channels: 4 } };
    if (part < REUSSITE) {
      surFond.push(`/images/${dossier}/${base}.webp`);
      console.log(`Sur fond (${Math.round(part * 100)} %) : ${dossier}/${fichier}`);
      continue; // on garde la version produite par optimiser-images.mjs
    }

    // Bord adouci : léger flou sur la couche alpha seulement.
    const alpha = await sharp(data, brut).extractChannel(3).blur(0.8).toBuffer();
    const rgb = await sharp(data, brut).removeAlpha().toBuffer();
    const adouci = await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } })
      .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
      .png()
      .toBuffer();

    // Recadrage au plus près, puis format 4:3 avec marge, produit centré.
    const { data: rogne, info: r } = await sharp(adouci).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
    const largeurUtile = Math.max(r.width, (r.height * 4) / 3);
    const L = Math.round(largeurUtile / (1 - 2 * MARGE));
    const H = Math.round((L * 3) / 4);
    const cadre = await sharp({ create: { width: L, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: rogne, left: Math.round((L - r.width) / 2), top: Math.round((H - r.height) / 2) }])
      .png()
      .toBuffer();

    for (const t of TAILLES) {
      await sharp(cadre)
        .resize({ width: t.largeur })
        .webp({ quality: 82, alphaQuality: 90 })
        .toFile(path.join(SORTIE, dossier, `${base}${t.suffixe}.webp`));
    }
    console.log(`Détourée : ${dossier}/${fichier}`);
  }
}

await fs.writeFile(
  "data/photos.ts",
  `// Fichier généré par scripts/detourer-produits.mjs : photos dont le fond n'a pas pu être retiré.
// Les cartes produit les adoucissent avec un fondu sur les bords.
export const PHOTOS_SUR_FOND = new Set<string>(${JSON.stringify(surFond.sort(), null, 2)});
`,
);
console.log(`\n${surFond.length} photo(s) gardée(s) sur leur fond.`);
