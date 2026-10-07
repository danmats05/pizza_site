// Prépare les petites images des onglets de catégories : une photo par catégorie, détourée, à sa forme naturelle.
// Les photos sur fond blanc sont détourées en effaçant le blanc relié aux bords de l'image.
// Écrit aussi data/onglets.ts (chemins et dimensions, pour next/image).
// Lancer : node scripts/preparer-onglets.mjs
import fs from "node:fs/promises";
import sharp from "sharp";
import { detourer } from "./detourage.mjs";

const SORTIE = "public/images/onglets";
const HAUTEUR = 96; // 2× la hauteur affichée

const PHOTOS = {
  pizza: "base-tomate/la-reine.png",
  texmex: "tex-mex/chicken-wings-pane.png",
  tacos: "tacos/tacos-viande-hachee.jpg",
  sandwich: "sandwichs/sandwich-kebab.jpg",
  panini: "panini/le-venezia.png",
  salade: "salade/la-fermiere.png",
  dessert: "dessert/crepe.png",
  boisson: ["boisson/fanta-orange.jpg", "boisson/7up.png"], // deux canettes côte à côte : une seule serait trop étroite
};

await fs.mkdir(SORTIE, { recursive: true });
const onglets = {};

/** Photo détourée et recadrée au plus près, en PNG. */
async function detouree(chemin) {
  const { data, info } = await sharp(`images-originales/${chemin}`)
    .resize(600, 600, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  detourer(data, info.width, info.height);
  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  return sharp(png).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
}

/** Plusieurs photos posées côte à côte, à la même hauteur, qui se chevauchent un peu. */
async function cote(chemins) {
  const H = 400;
  const images = [];
  for (const c of chemins) {
    const { data } = await detouree(c);
    const { data: img, info } = await sharp(data).resize({ height: H }).png().toBuffer({ resolveWithObject: true });
    images.push({ img, largeur: info.width });
  }
  const chevauchement = 0.18;
  let x = 0;
  const calques = images.map(({ img, largeur }) => {
    const calque = { input: img, left: Math.round(x), top: 0 };
    x += largeur * (1 - chevauchement);
    return calque;
  });
  const largeurTotale = Math.round(x + images.at(-1).largeur * chevauchement);
  return sharp({ create: { width: largeurTotale, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(calques)
    .png()
    .toBuffer();
}

for (const [categorie, chemin] of Object.entries(PHOTOS)) {
  const image = Array.isArray(chemin) ? await cote(chemin) : (await detouree(chemin)).data;

  // Recadrage au plus près, hauteur fixe, largeur selon la forme du produit.
  const sortie = await sharp(image)
    .resize({ height: HAUTEUR })
    .webp({ quality: 85, alphaQuality: 90 })
    .toFile(`${SORTIE}/${categorie}.webp`);
  onglets[categorie] = { src: `/images/onglets/${categorie}.webp`, largeur: sortie.width, hauteur: sortie.height };
  console.log("Onglet :", categorie);
}

await fs.writeFile(
  "data/onglets.ts",
  `// Fichier généré par scripts/preparer-onglets.mjs : ne pas modifier à la main.
import type { CategorieId } from "./types";

export const ONGLETS: Record<CategorieId, { src: string; largeur: number; hauteur: number }> = ${JSON.stringify(onglets, null, 2)};
`,
);
