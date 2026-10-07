// Personnalisation des produits : pâte, suppléments, sauces.
// FICTIF (démo) : ces options et leurs prix n'existent pas sur le site actuel, à confirmer avec la pizzeria.
import type { CategorieId, Produit } from "./types";

export type OptionPerso = { id: string; label: string; prix: number; aide?: string };

export type GroupePerso = {
  id: "pate" | "supplements" | "sauces";
  titre: string;
  aide: string;
  /** « unique » : un seul choix (boutons radio) ; « multiple » : cases à cocher, jusqu'à `max`. */
  type: "unique" | "multiple";
  max?: number;
  defaut?: string;
  options: OptionPerso[];
};

/**
 * Détail des tailles de pizza, affiché sous la taille (fiche produit et panier).
 * FICTIF (démo) : diamètres et portions non fournis par le site actuel, à confirmer avec la pizzeria.
 */
const TAILLES_PIZZA: Record<string, { diametre: number; portions: string }> = {
  junior: { diametre: 26, portions: "1 personne" },
  senior: { diametre: 33, portions: "2 personnes" },
  mega: { diametre: 40, portions: "3 à 4 personnes" },
};

/** « 33 cm de diamètre · 2 personnes » pour une taille de pizza, sinon undefined. */
export function detailTaille(p: Pick<Produit, "cat">, option: string | undefined) {
  const t = p.cat === "pizza" && option ? TAILLES_PIZZA[option] : undefined;
  return t ? { diametre: `${t.diametre} cm de diamètre`, portions: t.portions } : undefined;
}

/** Choix du client pour une ligne du panier. */
export type Perso = {
  pate?: string;
  supplements?: string[];
  sauces?: string[];
  note?: string;
};

const PATE: GroupePerso = {
  id: "pate",
  titre: "Épaisseur de la pâte",
  aide: "Un seul choix",
  type: "unique",
  defaut: "classique",
  options: [
    { id: "fine", label: "Fine", prix: 0, aide: "Croustillante" },
    { id: "classique", label: "Classique", prix: 0, aide: "Moelleuse" },
    { id: "epaisse", label: "Épaisse", prix: 500, aide: "Généreuse" },
  ],
};

const SUPPLEMENTS_PIZZA: GroupePerso = {
  id: "supplements",
  titre: "Suppléments",
  aide: "Jusqu'à 5",
  type: "multiple",
  max: 5,
  options: [
    { id: "fromage", label: "Fromage", prix: 500 },
    { id: "cheddar", label: "Cheddar", prix: 500 },
    { id: "jambon", label: "Jambon", prix: 700 },
    { id: "poulet", label: "Poulet", prix: 700 },
    { id: "viande-hachee", label: "Viande hachée", prix: 700 },
    { id: "merguez", label: "Merguez", prix: 700 },
    { id: "champignons", label: "Champignons", prix: 400 },
    { id: "olives", label: "Olives", prix: 300 },
    { id: "oignons", label: "Oignons", prix: 300 },
    { id: "poivrons", label: "Poivrons", prix: 300 },
    { id: "oeuf", label: "Œuf", prix: 300 },
  ],
};

const SUPPLEMENTS_SANDWICH: GroupePerso = {
  id: "supplements",
  titre: "Suppléments",
  aide: "Jusqu'à 3",
  type: "multiple",
  max: 3,
  options: [
    { id: "fromage", label: "Fromage", prix: 500 },
    { id: "cheddar", label: "Cheddar", prix: 500 },
    { id: "oeuf", label: "Œuf", prix: 300 },
    { id: "viande", label: "Double viande", prix: 1000 },
  ],
};

const SAUCES = ["Algérienne", "Samouraï", "Barbecue", "Biggy burger", "Poivre", "Ketchup", "Mayonnaise"];

const sauces = (prix: number, max: number, aide: string): GroupePerso => ({
  id: "sauces",
  titre: prix ? "Sauces en plus" : "Sauces",
  aide,
  type: "multiple",
  max,
  options: SAUCES.map((s) => ({ id: s.toLowerCase().replace(/[^a-z]+/g, "-"), label: s, prix })),
});

const PAR_CATEGORIE: Partial<Record<CategorieId, GroupePerso[]>> = {
  pizza: [PATE, SUPPLEMENTS_PIZZA, sauces(200, 3, "Jusqu'à 3")],
  tacos: [SUPPLEMENTS_SANDWICH, sauces(0, 2, "2 offertes")],
  sandwich: [SUPPLEMENTS_SANDWICH, sauces(0, 2, "2 offertes")],
  panini: [SUPPLEMENTS_SANDWICH, sauces(0, 2, "2 offertes")],
  texmex: [sauces(200, 3, "Jusqu'à 3")],
};

/** Groupes de personnalisation proposés pour un produit (vide : pas de personnalisation). */
export function persoPour(p: Pick<Produit, "cat" | "id">): GroupePerso[] {
  // La Calzone a déjà son choix de sauce : pas de groupe « sauces » en plus.
  const groupes = PAR_CATEGORIE[p.cat] ?? [];
  return p.id === "la-calzone" ? groupes.filter((g) => g.id !== "sauces") : groupes;
}

/** Les produits salés acceptent une précision libre (« sans oignons »…). */
export const accepteNote = (p: Pick<Produit, "cat">) => !["dessert", "boisson"].includes(p.cat);

export const NOTE_MAX = 120;

/** Perso de départ : valeurs par défaut des groupes à choix unique. */
export function persoInitiale(p: Pick<Produit, "cat" | "id">): Perso {
  const perso: Perso = {};
  for (const g of persoPour(p)) if (g.type === "unique" && g.defaut) perso.pate = g.defaut;
  return perso;
}

/** Détail lisible et prix des extras d'une perso, pour un produit donné. */
export function detailPerso(p: Pick<Produit, "cat" | "id">, perso: Perso | undefined) {
  const lignes: { titre: string; valeur: string }[] = [];
  let extra = 0;
  if (!perso) return { lignes, extra };
  for (const g of persoPour(p)) {
    const ids = g.id === "pate" ? (perso.pate ? [perso.pate] : []) : (perso[g.id] ?? []);
    const choisis = g.options.filter((o) => ids.includes(o.id));
    if (!choisis.length) continue;
    extra += choisis.reduce((s, o) => s + o.prix, 0);
    // La pâte classique est le choix par défaut : inutile de l'afficher.
    if (g.id === "pate" && perso.pate === g.defaut) continue;
    lignes.push({ titre: g.id === "pate" ? "Pâte" : g.titre, valeur: choisis.map((o) => o.label).join(", ") });
  }
  if (perso.note?.trim()) lignes.push({ titre: "Précision", valeur: perso.note.trim() });
  return { lignes, extra };
}

/** Forme stable d'une perso (tri, champs vides retirés) : sert à comparer deux lignes du panier. */
export function persoNormalisee(perso: Perso | undefined): Perso | undefined {
  if (!perso) return undefined;
  const n: Perso = {};
  if (perso.pate) n.pate = perso.pate;
  if (perso.supplements?.length) n.supplements = [...perso.supplements].sort();
  if (perso.sauces?.length) n.sauces = [...perso.sauces].sort();
  if (perso.note?.trim()) n.note = perso.note.trim().slice(0, NOTE_MAX);
  return Object.keys(n).length ? n : undefined;
}
