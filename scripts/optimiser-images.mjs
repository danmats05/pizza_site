// scripts/optimiser-images.mjs
// Lancer : node scripts/optimiser-images.mjs

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "images-originales";
const SORTIE = "public/images";
const TAILLES = [
  { suffixe: "", largeur: 800 },     // cartes du menu
  { suffixe: "-sm", largeur: 400 },  // panier, miniatures
];

async function fichiers(dossier) {
  const entrees = await fs.readdir(dossier, { withFileTypes: true });
  const liste = [];
  for (const e of entrees) {
    const chemin = path.join(dossier, e.name);
    if (e.isDirectory()) liste.push(...(await fichiers(chemin)));
    else if (/\.(png|jpe?g|webp)$/i.test(e.name)) liste.push(chemin);
  }
  return liste;
}

for (const fichier of await fichiers(SOURCE)) {
  const relatif = path.relative(SOURCE, fichier);
  const base = relatif.replace(/\.(png|jpe?g|webp)$/i, "");
  await fs.mkdir(path.join(SORTIE, path.dirname(relatif)), { recursive: true });

  for (const t of TAILLES) {
    const cible = path.join(SORTIE, `${base}${t.suffixe}.webp`);
    await sharp(fichier)
      .resize({ width: t.largeur, withoutEnlargement: true })
      .webp({ quality: 80, alphaQuality: 90 }) // garde la transparence des photos détourées
      .toFile(cible);
  }
  console.log("Optimisé", relatif);
}
