// Génère data/produits.ts à partir de menu-propre.json (+ menu-brut.json pour les variantes à plusieurs attributs).
// Lancer après extraire-menu.mjs et optimiser-images.mjs : node scripts/generer-produits.mjs
//
// Toutes les corrections sont explicites ci-dessous (noms, catégories, descriptions, options),
// pour qu'on puisse relire et ajuster chaque décision.

import fs from "node:fs/promises";

const propre = JSON.parse(await fs.readFile("menu-propre.json", "utf8"));
const brut = new Map(JSON.parse(await fs.readFile("menu-brut.json", "utf8")).map((p) => [p.id, p]));

const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const sansEmoji = (s) => s.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, "").replace(/\s+/g, " ").trim();

// ---------- Catégories ----------
const CATEGORIE_API = {
  "Base Tomate": "pizza", "Base Crème Fraîche": "pizza", Pizza: "pizza", "Spéciales": "pizza",
  "Tex-Mex": "texmex", Tacos: "tacos", Sandwichs: "sandwich", Panini: "panini",
  Salade: "salade", Dessert: "dessert", Boisson: "boisson",
};
// Rangement d'après le nom, prioritaire sur le champ catégorie du site actuel.
function categorieDepuisNom(nom) {
  if (/^pizza\b/i.test(nom)) return "pizza";
  if (/^tacos\b/i.test(nom)) return "tacos";
  if (/^sandwich\b/i.test(nom)) return "sandwich";
  return null;
}

// ---------- Noms harmonisés (clé = idWoo) ----------
const NOMS = {
  13908: "Eau Kirène", 13901: "Jus Naturel", 13900: "7Up Cocktail Exotique", 13897: "Oasis Tropical",
  13874: "Crêpe", 13856: "Frites de Patates Douces", 13840: "La Fabulous", 13835: "La Pepperoni Lover",
  13828: "Tenders Nature", 8677: "Häagen-Dazs Bâtonnet", 8669: "Lipton Ice Tea Pastèque",
  8202: "Mini Pressea", 8190: "Tarte au Daim", 6716: "La Max It", 7294: "La Chawarma",
  6595: "Sandwich Mix Steak Cordon Bleu", 6555: "Tenders Épicés", 6548: "Chicken Wings Panées",
  6315: "Sandwich Steak Haché", 6314: "Sandwich Cordon Bleu", 5368: "Mirinda Fruity",
  5364: "7Up", 5359: "Milkshake", 5349: "Tiramisu Nutella", 5324: "Tacos Merguez", 5323: "Tacos Poulet",
  5291: "Le Time", 5183: "L'Orientale", 5342: "Glace Mammamia", 5322: "Tacos Viande Hachée",
};

// ---------- Descriptions corrigées (fautes de frappe, majuscules) ----------
const CORRECTIONS_DESC = [
  [/Sauce Tomate/g, "Sauce tomate"], [/Crème Fraiche|Crème fraiche|Crème fraîche/g, "Crème fraîche"],
  [/gargonzola/g, "gorgonzola"], [/saumon fumée/g, "saumon fumé"], [/Sauce chilli thal/g, "Sauce chili thaï"],
  [/Sauce Chili Thaï/g, "sauce chili thaï"], [/dès de veau fumés/g, "dés de veau fumé"],
  [/pepperoni de bœuf/g, "pepperoni de bœuf"], [/\s*[.,]\s*$/g, ""], [/\s+,/g, ","],
];
// Descriptions copiées d'un autre produit sur le site actuel : masquées plutôt que fausses.
const DESC_DOUTEUSES = new Set([13840, 13835]); // Fabulous et Pepperoni Lover = texte de la Butcher Lover
const DESC_REMPLACEES = {
  6489: "Pizza chausson, sauce au choix", // Calzone : la liste des sauces passe en choix (ingrédients non précisés)
  5303: "10 pièces",
  6548: "Ailes de poulet panées",
};

// Descriptions PROPOSÉES pour les produits qui n'en ont pas sur le site actuel (à valider avec la pizzeria).
// Écrites d'après le nom, les options et la photo, sans inventer d'ingrédients au-delà de ce qui est visible.
const DESC_PROPOSEES = {
  // Pizzas (d'après la photo)
  13840: "Fromage, poulet, oignons rouges, filet de sauce", // La Fabulous
  13835: "Sauce tomate, fromage, pepperoni", // La Pepperoni Lover
  7294: "Sauce tomate, fromage, viande chawarma, tomates cerises, persil", // La Chawarma
  // Tex-Mex
  13864: "Frites ou riz, nappés de sauce au fromage et d'éclats croustillants", // Le Crousty
  13856: "Frites de patates douces", // Frites de Patates Douces
  13852: "Bouchées panées au fromage", // Swiss Cheesy
  13845: "Bâtonnets de mozzarella panés", // Mozza Sticks
  13828: "Aiguillettes de poulet panées", // Tenders Nature
  6555: "Aiguillettes de poulet panées, épicées", // Tenders Épicés
  5308: "Ailes de poulet", // Chicken Wings
  5306: "Nuggets de poulet panés", // Nuggets
  5310: "Pommes de terre en quartiers (potatoes)", // Frites
  // Sandwich (même composition que les autres sandwichs de la gamme)
  7306: "Salade, tomate, oignons, cheddar, viande chawarma", // Sandwich Chawarma
  // Desserts
  13874: "Crêpe au sucre, au Nutella ou à la banane", // Crêpe
  13870: "Panini grillé fourré au Nutella", // Panini Nutella
  8677: "Glace Häagen-Dazs chocolat amandes, en bâtonnet", // Häagen-Dazs Bâtonnet
  8191: "Œuf Kinder Joy avec surprise", // Kinder
  8190: "Part de tarte au Daim", // Tarte au Daim
  5359: "Milkshake Bueno, Oreo ou fraise", // Milkshake
  5349: "Tiramisu au Nutella, en pot", // Tiramisu Nutella
  5342: "Glace italienne Mammamia, en boules ou en pot d'un litre", // Glace Mammamia
  // Boissons
  13908: "Eau minérale Kirène, petite ou grande bouteille",
  13901: "Jus de bissap, de bouye ou de gingembre, au verre ou en grande bouteille",
  13900: "Canette 7Up saveur cocktail exotique",
  13899: "Canette Hawaï Tropical",
  13898: "Canette Fanta mangue",
  13897: "Canette Oasis Tropical",
  13896: "Canette Schweppes pomme",
  13883: "Canette Schweppes agrumes",
  8669: "Thé glacé Lipton à la pastèque",
  8668: "Canette Fanta orange",
  8202: "Brique de jus Pressea cocktail, 20 cl",
  5368: "Canette Mirinda fruity",
  5367: "Canette Mirinda orange",
  5364: "Canette 7Up",
  5363: "Canette Pepsi",
};
// Tacos issus du « Tacos Chawarma » éclaté : même composition que les autres tacos de la gamme.
const DESC_TACOS = {
  "Tacos Chawarma": "Viande chawarma, salade, tomate, oignon, fromages",
  "Tacos Cordon Bleu": "Cordon bleu, salade, tomate, oignon, fromages",
  "Tacos Kebab Poulet": "Kebab de poulet, salade, tomate, oignon, fromages",
  "Tacos Kebab Veau-Dinde": "Kebab de veau et dinde, salade, tomate, oignon, fromages",
};

// ---------- Badges ----------
const BADGES = { 5210: "Populaire", 13840: "Nouveau", 13835: "Nouveau", 13864: "Nouveau" };

// ---------- Filtres ----------
const VIANDE_POISSON = /viande|jambon|poulet|merguez|chorizo|pepperoni|saumon|thon|fruits de mer|kebab|kébab|veau|chawarma|steak|cordon|bœuf|boeuf|tenders|calamar|nugget|wings|reblochon.*veau/i;
// Viande seulement (le poisson et les fruits de mer n'en sont pas).
const VIANDE = /viande|jambon|poulet|merguez|chorizo|pepperoni|peperoni|kebab|kébab|veau|chawarma|steak|cordon bleu|bœuf|boeuf|tenders|nugget|wings/i;
// Poisson et fruits de mer.
const POISSON = /thon|saumon|fruits de mer|calamar|poisson|crevette|anchois/i;
const VEGE_SANS_DESC = new Set([5310, 13856, 13845]); // frites, frites de patates douces, mozza sticks
const INGREDIENTS_INCONNUS = new Set([6489, 13852, 13864]); // Calzone, Swiss Cheesy, Le Crousty : végétariens ou non ?

function tags(p, cat, nomBrut, desc) {
  const t = [];
  if (cat === "pizza") {
    const d = desc.toLowerCase();
    const apiCats = (brut.get(p.idWoo)?.categories || []).map((c) => c.name);
    if (d.startsWith("crème fraîche")) t.push("creme");
    else if (d.includes("sauce tomate") || apiCats.includes("Base Tomate")) t.push("tomate");
    else if (apiCats.includes("Base Crème Fraîche")) t.push("creme");
  }
  if (/🌶|épicé|piment|chili|spicy/i.test(nomBrut + " " + desc)) t.push("epice");
  const nourriture = !["dessert", "boisson"].includes(cat);
  if (nourriture && VIANDE.test(desc + " " + nomBrut)) t.push("viande");
  if (nourriture && POISSON.test(desc + " " + nomBrut)) t.push("poisson");
  if (nourriture && !INGREDIENTS_INCONNUS.has(p.idWoo) && ((desc && !VIANDE_POISSON.test(desc + " " + nomBrut)) || VEGE_SANS_DESC.has(p.idWoo))) t.push("vege");
  return t;
}

// ---------- Options ----------
const TITRES_OPTIONS = {
  Taille: "Taille", "menu ou simple": "Formule", "Pièces": "Nombre de pièces", Contenance: "Contenance",
  "taille-fritte": "Portion", "Sélectionne tes potatoes": "Portion", "Choisissez la saveur": "Parfum",
  "Choisissez la taille": "Format",
};
const LABEL_OPTION = (titre, label) => {
  if (titre === "Nombre de pièces") return `${label} pièces`;
  const l = label.replace(/ Bouteille$/, " bouteille");
  return l.charAt(0).toUpperCase() + l.slice(1);
};

function optionsDepuisTailles(p, titreApi) {
  const titre = TITRES_OPTIONS[titreApi] || titreApi;
  const liste = p.tailles.map((t) => ({ id: slug(t.label), label: LABEL_OPTION(titre, t.label), prix: t.prix }));
  // Pizzas : taille du milieu par défaut. Sinon : la moins chère.
  const defaut = titre === "Taille" && liste.length === 3 ? liste[1].id : liste[0].id;
  return { titre, liste, defaut };
}

// Produits à plusieurs attributs : traités à la main à partir des variantes réelles.
const prixVariante = (p) => new Map((p.tailles || []).map((t) => [t.id, t.prix]));

function produitsSpeciaux(p, base) {
  const b = brut.get(p.idWoo);
  const prix = prixVariante(p);

  if (p.idWoo === 13901) {
    // Jus naturel : parfum (sans effet sur le prix) + contenance (change le prix)
    const parContenance = new Map();
    for (const v of b.variations) {
      const c = v.attributes.find((a) => a.name === "Contenance").value;
      parContenance.set(c, prix.get(v.id));
    }
    const libelles = { verre: "Verre", bouteille: "Grande bouteille" };
    const liste = [...parContenance].map(([id, px]) => ({ id, label: libelles[id] || id, prix: px })).sort((a, z) => a.prix - z.prix);
    return [{ ...base, type: "options", options: { titre: "Contenance", liste, defaut: liste[0].id },
      choix: [{ titre: "Parfum", liste: ["Bissap", "Bouye", "Gingembre"] }] }];
  }
  if (p.idWoo === 13864) {
    return [{ ...base, type: "unique", prix: p.tailles[0].prix, choix: [{ titre: "Base", liste: ["Frites", "Riz"] }] }];
  }
  if (p.idWoo === 5359) {
    return [{ ...base, type: "unique", prix: p.tailles[0].prix, choix: [{ titre: "Parfum", liste: ["Bueno", "Oreo", "Fraise"] }] }];
  }
  if (p.idWoo === 5349) {
    // Une seule variante existe réellement (Nutella), malgré 3 parfums affichés sur le site actuel.
    return [{ ...base, type: "unique", prix: p.tailles[0].prix }];
  }
  if (p.idWoo === 5325) {
    const viandes = ["Viande hachée", "Poulet", "Merguez"];
    return [{ ...base, type: "unique", prix: p.tailles[0].prix,
      choix: [{ titre: "1re viande", liste: viandes }, { titre: "2e viande", liste: viandes }] }];
  }
  if (p.idWoo === 6489) {
    return [{ ...base, type: "unique", prix: p.prix,
      choix: [{ titre: "Sauce", liste: ["Algérienne", "Samouraï", "Barbecue", "Biggy burger", "Poivre"] }] }];
  }
  if (p.idWoo === 7302) {
    // « Tacos Chawarma » regroupe 8 viandes au prix différent. On garde les 4 qui n'existent pas
    // ailleurs dans le menu (merguez, tenders, viande hachée et mix ont déjà leur fiche).
    const viandes = { chawarma: "Tacos Chawarma", "tacos-cordon-bleu": "Tacos Cordon Bleu",
      "tacos-kebab-poulet": "Tacos Kebab Poulet", "tacos-kebab-veau-dinde": "Tacos Kebab Veau-Dinde" };
    return Object.entries(viandes).map(([cle, nom]) => {
      const liste = b.variations
        .filter((v) => v.attributes[0].value === cle)
        .map((v) => ({ id: v.attributes[1].value, label: v.attributes[1].value === "menu" ? "Menu" : "Simple", prix: prix.get(v.id) }))
        .sort((a, z) => a.prix - z.prix);
      const desc = DESC_TACOS[nom];
      return { ...base, id: slug(nom), nom, desc, tags: tags(p, "tacos", nom, desc), type: "options", options: { titre: "Formule", liste, defaut: liste[0].id } };
    });
  }
  return null;
}

// ---------- Génération ----------
const rapport = { deplaces: [], descVides: [], descMasquees: [], descProposees: [], renommes: [], options: new Map() };
const produits = [];

for (const p of propre) {
  const b = brut.get(p.idWoo);
  const nomBrut = p.nom;
  const nom = NOMS[p.idWoo] || sansEmoji(nomBrut);
  if (nom !== nomBrut) rapport.renommes.push(`${nomBrut} → ${nom}`);

  const catApi = CATEGORIE_API[p.categorie] || "autre";
  const cat = categorieDepuisNom(nom) || catApi;
  if (cat !== catApi) rapport.deplaces.push(`${nom} : ${p.categorie} → ${cat}`);

  let desc = DESC_REMPLACEES[p.idWoo] ?? CORRECTIONS_DESC.reduce((d, [re, r]) => d.replace(re, r), p.desc);
  if (DESC_DOUTEUSES.has(p.idWoo)) { rapport.descMasquees.push(nom); desc = ""; }
  if (!desc && DESC_PROPOSEES[p.idWoo]) { desc = DESC_PROPOSEES[p.idWoo]; rapport.descProposees.push(nom); }
  if (!desc && p.idWoo !== 7302) rapport.descVides.push(`${nom} (${cat})`); // 7302 : éclaté en 4 tacos décrits plus bas

  const img = p.images[0] ? `/images/${p.images[0].replace(/\.\w+$/, "")}` : null;
  const base = {
    id: slug(nom) + (cat === "salade" ? "-salade" : ""),
    cat, nom, desc,
    img: img && `${img}.webp`, imgSm: img && `${img}-sm.webp`,
    enStock: p.enStock,
    tags: tags(p, cat, nomBrut, desc),
    ...(BADGES[p.idWoo] ? { badge: BADGES[p.idWoo] } : {}),
  };

  const speciaux = produitsSpeciaux(p, base);
  if (speciaux) { produits.push(...speciaux); continue; }

  if (p.tailles?.length) {
    const titreApi = b.attributes[0].name;
    const options = optionsDepuisTailles(p, titreApi);
    if (options.titre === "Parfum") {
      // Crêpe : le parfum change le prix
      options.defaut = options.liste[0].id;
    }
    produits.push({ ...base, type: "options", options });
  } else {
    produits.push({ ...base, type: "unique", prix: p.prix });
  }
}

// Tri : catégorie (ordre du menu), puis badge, puis base tomate avant crème, puis prix, puis nom.
const ORDRE = ["pizza", "texmex", "tacos", "sandwich", "panini", "salade", "dessert", "boisson"];
const prixMin = (x) => (x.type === "unique" ? x.prix : x.options.liste[0].prix);
produits.sort((a, z) =>
  ORDRE.indexOf(a.cat) - ORDRE.indexOf(z.cat) ||
  (z.badge === "Populaire") - (a.badge === "Populaire") ||
  (a.tags.includes("creme")) - (z.tags.includes("creme")) ||
  prixMin(a) - prixMin(z) ||
  a.nom.localeCompare(z.nom, "fr"),
);

const ids = new Set();
for (const x of produits) {
  if (ids.has(x.id)) throw new Error(`Identifiant en double : ${x.id}`);
  ids.add(x.id);
  if (x.type === "options") {
    const cle = `${x.options.titre} : ${x.options.liste.map((o) => `${o.label} ${o.prix}`).join(" / ")}`;
    rapport.options.set(cle, [...(rapport.options.get(cle) || []), x.nom]);
  }
}

const sortie = `// Fichier généré par scripts/generer-produits.mjs à partir du menu du site actuel.
// Ne pas modifier à la main : ajuster les règles du script puis le relancer.
import type { Produit } from "./types";

export const PRODUITS: Produit[] = ${JSON.stringify(produits, null, 2)};
`;
await fs.writeFile("data/produits.ts", sortie);

console.log(`${produits.length} produits écrits dans data/produits.ts\n`);
console.log("Par catégorie :", Object.fromEntries(ORDRE.map((c) => [c, produits.filter((x) => x.cat === c).length])));
console.log("\nDéplacés de catégorie :\n  " + (rapport.deplaces.join("\n  ") || "aucun"));
console.log("\nRenommés :\n  " + rapport.renommes.join("\n  "));
console.log("\nDescriptions masquées (copiées d'un autre produit) :\n  " + rapport.descMasquees.join("\n  "));
console.log("\nDescriptions proposées (à valider) :\n  " + rapport.descProposees.join("\n  "));
console.log("\nDescriptions vides :\n  " + (rapport.descVides.join("\n  ") || "aucune"));
console.log("\nOptions et prix :");
for (const [cle, noms] of rapport.options) console.log(`  ${cle}\n      ${noms.join(", ")}`);
console.log("\nFiltres :");
for (const f of ["tomate", "creme", "poisson", "epice", "vege", "viande"]) console.log(`  ${f} : ${produits.filter((x) => x.tags.includes(f)).map((x) => x.nom).join(", ")}`);
