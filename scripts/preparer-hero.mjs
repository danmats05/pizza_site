// Prépare les photos des pizzas du carrousel du hero : recadrées au plus près, carrées, transparentes.
// Lancer : node scripts/preparer-hero.mjs
import fs from "node:fs/promises";
import sharp from "sharp";

const PIZZAS = [
  "base-tomate/la-reine",
  "pizza/la-time-burger",
  "base-tomate/la-4-fromages",
  "base-tomate/la-mexicaine",
  "base-creme-fraiche/la-chicago",
];
const SORTIE = "public/images/hero";
const TAILLES = [
  { suffixe: "", cote: 1000 }, // pizza centrale
  { suffixe: "-sm", cote: 480 }, // pizzas voisines, sur les côtés
];

await fs.mkdir(SORTIE, { recursive: true });

for (const chemin of PIZZAS) {
  const { data, info } = await sharp(`images-originales/${chemin}.png`)
    .ensureAlpha()
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });
  const cote = Math.max(info.width, info.height);
  const carre = await sharp(data)
    .extend({
      top: Math.floor((cote - info.height) / 2),
      bottom: Math.ceil((cote - info.height) / 2),
      left: Math.floor((cote - info.width) / 2),
      right: Math.ceil((cote - info.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const nom = chemin.split("/").pop();
  for (const t of TAILLES) {
    await sharp(carre).resize(t.cote, t.cote).webp({ quality: 82, alphaQuality: 90 }).toFile(`${SORTIE}/${nom}${t.suffixe}.webp`);
  }
  console.log("Hero :", nom);
}
