// scripts/extraire-menu.mjs
// Lancer : node scripts/extraire-menu.mjs

import fs from "node:fs/promises";

const BASE = "https://pizzatimedkr.com/wp-json/wc/store/v1/products";
const DOSSIER_IMAGES = "images-originales";
const PAUSE_MS = 200; // petite pause entre les requêtes, pour ne pas surcharger leur serveur

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const texte = (html = "") => html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ")
  .replace(/&rsquo;|&#8217;/g, "'").replace(/&amp;/g, "&").trim();
const prixEnF = (prices) =>
  Number(prices?.price ?? 0) / 10 ** (prices?.currency_minor_unit ?? 0);

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} sur ${url}`);
  return res.json();
}

// 1. Tous les produits, page par page
async function tousLesProduits() {
  const produits = [];
  for (let page = 1; ; page++) {
    const lot = await getJson(`${BASE}?per_page=100&page=${page}`);
    produits.push(...lot);
    console.log(`Page ${page} : ${lot.length} produits`);
    if (lot.length < 100) break;
    await pause(PAUSE_MS);
  }
  return produits;
}

// 2. Téléchargement d'une image
async function telecharger(url, chemin) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} sur ${url}`);
  await fs.writeFile(chemin, Buffer.from(await res.arrayBuffer()));
}

// 3. Prix exact de chaque variante
async function variantes(produit) {
  const resultat = [];
  for (const v of produit.variations || []) {
    try {
      const detail = await getJson(`${BASE}/${v.id}`);
      const valeur = v.attributes?.[0]?.value;
      const terme = produit.attributes?.[0]?.terms?.find((t) => t.slug === valeur);
      resultat.push({
        id: v.id,
        label: terme?.name || valeur || detail.name,
        prix: prixEnF(detail.prices),
      });
    } catch (e) {
      console.warn(`Variante ${v.id} de « ${produit.name} » ignorée : ${e.message}`);
    }
    await pause(PAUSE_MS);
  }
  return resultat.sort((a, b) => a.prix - b.prix);
}

// --- Exécution ---
const produits = await tousLesProduits();
await fs.writeFile("menu-brut.json", JSON.stringify(produits, null, 2));
console.log(`\n${produits.length} produits au total\n`);

const menu = [];
for (const p of produits) {
  const categorie = p.categories?.[0]?.name || "Autre";
  const dossier = `${DOSSIER_IMAGES}/${slug(categorie)}`;
  await fs.mkdir(dossier, { recursive: true });

  const images = [];
  for (const [i, img] of (p.images || []).entries()) {
    const ext = img.src.split(".").pop().split("?")[0];
    const nom = `${slug(texte(p.name))}${i ? "-" + (i + 1) : ""}.${ext}`;
    try {
      await telecharger(img.src, `${dossier}/${nom}`);
      images.push(`${slug(categorie)}/${nom}`);
      console.log("Image OK", `${slug(categorie)}/${nom}`);
    } catch (e) {
      console.warn("Image échouée", img.src, e.message);
    }
    await pause(PAUSE_MS);
  }

  const tailles = p.type === "variable" ? await variantes(p) : [];

  menu.push({
    id: p.slug,
    idWoo: p.id,
    nom: texte(p.name),
    categorie,
    desc: texte(p.short_description) || texte(p.description),
    images,
    enStock: p.is_in_stock,
    ...(tailles.length ? { tailles } : { prix: prixEnF(p.prices) }),
  });
}

await fs.writeFile("menu-propre.json", JSON.stringify(menu, null, 2));
console.log(`\nTerminé : ${menu.length} produits dans menu-propre.json`);
