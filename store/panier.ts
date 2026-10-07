"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUITS } from "@/data/produits";
import { detailPerso, persoNormalisee, type Perso } from "@/data/personnalisation";
import type { Produit } from "@/data/types";

/**
 * Une ligne = un produit + une option (taille, formule…) + ses choix (parfum, sauce…)
 * + sa personnalisation (pâte, suppléments, sauces, précision). Deux lignes identiques se regroupent.
 */
export type Ligne = {
  cle: string;
  id: string;
  option?: string;
  choix?: string[];
  perso?: Perso;
  qte: number;
};

export type NouvelleLigne = Omit<Ligne, "cle" | "qte"> & { qte?: number };

type EtatPanier = {
  lignes: Ligne[];
  ajouter: (id: string, option?: string, choix?: string[], perso?: Perso, qte?: number) => void;
  /** Remplace une ligne existante (après « Modifier ») ; fusionne si elle devient identique à une autre. */
  remplacer: (cle: string, ligne: NouvelleLigne & { qte: number }) => void;
  changerQte: (cle: string, delta: number) => void;
  retirer: (cle: string) => void;
  vider: () => void;
};

export const cleLigne = (id: string, option?: string, choix?: string[], perso?: Perso) => {
  const p = persoNormalisee(perso);
  return [id, option, ...(choix ?? []), p ? JSON.stringify(p) : ""].filter(Boolean).join("|");
};

// Déclaré avant le store : la persistance appelle detailLigne() dès sa création.
const PAR_ID = new Map(PRODUITS.map((p) => [p.id, p]));

export function trouverProduit(id: string): Produit | undefined {
  return PAR_ID.get(id);
}

/** Prix unitaire (base + extras), libellés et détail d'une ligne, ou null si elle n'est plus valable. */
export function detailLigne(l: Pick<Ligne, "id" | "option" | "choix" | "perso">) {
  const produit = PAR_ID.get(l.id);
  if (!produit) return null;
  let base: number;
  let optionLabel: string | undefined;
  if (produit.type === "unique") {
    base = produit.prix;
  } else {
    const option = produit.options.liste.find((o) => o.id === l.option);
    if (!option) return null;
    base = option.prix;
    optionLabel = option.label;
  }
  const { lignes, extra } = detailPerso(produit, l.perso);
  const choix = (produit.choix ?? [])
    .map((c, i) => (l.choix?.[i] ? { titre: c.titre, valeur: l.choix[i] } : null))
    .filter((x): x is { titre: string; valeur: string } => x !== null);
  return { produit, prix: base + extra, base, extra, optionLabel, details: [...choix, ...lignes] };
}

function fusionner(lignes: Ligne[], nouvelle: Ligne): Ligne[] {
  const existe = lignes.find((l) => l.cle === nouvelle.cle);
  return existe
    ? lignes.map((l) => (l.cle === nouvelle.cle ? { ...l, qte: l.qte + nouvelle.qte } : l))
    : [...lignes, nouvelle];
}

export const usePanier = create<EtatPanier>()(
  persist(
    (set) => ({
      lignes: [],
      ajouter: (id, option, choix, perso, qte = 1) =>
        set((etat) => ({
          lignes: fusionner(etat.lignes, {
            cle: cleLigne(id, option, choix, perso),
            id,
            option,
            choix,
            perso: persoNormalisee(perso),
            qte,
          }),
        })),
      remplacer: (cle, { id, option, choix, perso, qte }) =>
        set((etat) => {
          const nouvelle: Ligne = { cle: cleLigne(id, option, choix, perso), id, option, choix, perso: persoNormalisee(perso), qte };
          const index = etat.lignes.findIndex((l) => l.cle === cle);
          const sans = etat.lignes.filter((l) => l.cle !== cle);
          // Garde la place de la ligne modifiée dans la liste, sauf si elle rejoint une ligne identique.
          if (sans.some((l) => l.cle === nouvelle.cle)) return { lignes: fusionner(sans, nouvelle) };
          sans.splice(Math.max(0, index), 0, nouvelle);
          return { lignes: sans };
        }),
      changerQte: (cle, delta) =>
        set((etat) => ({
          lignes: etat.lignes
            .map((l) => (l.cle === cle ? { ...l, qte: Math.min(20, l.qte + delta) } : l))
            .filter((l) => l.qte > 0),
        })),
      retirer: (cle) => set((etat) => ({ lignes: etat.lignes.filter((l) => l.cle !== cle) })),
      vider: () => set({ lignes: [] }),
    }),
    {
      name: "pizza-time-panier",
      version: 2,
      // Au rechargement, on écarte les lignes dont le produit ou l'option n'existe plus.
      migrate: (persiste) => persiste as EtatPanier,
      merge: (persiste, actuel) => {
        const lignes = ((persiste as Partial<EtatPanier>)?.lignes ?? []).filter((l) => detailLigne(l) !== null);
        return { ...actuel, lignes };
      },
    },
  ),
);

export const nombreArticles = (lignes: Ligne[]) => lignes.reduce((n, l) => n + l.qte, 0);

export const sousTotal = (lignes: Ligne[]) =>
  lignes.reduce((total, l) => total + (detailLigne(l)?.prix ?? 0) * l.qte, 0);
