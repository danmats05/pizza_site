"use client";

import { create } from "zustand";
import type { FiltreId } from "@/data/types";

/** État d'interface partagé entre composants éloignés (header, mega menu, menu, panier). */
type EtatInterface = {
  filtres: FiltreId[];
  basculerFiltre: (f: FiltreId) => void;
  choisirFiltre: (f: FiltreId) => void;
  effacerFiltres: () => void;

  panierOuvert: boolean;
  ouvrirPanier: () => void;
  fermerPanier: () => void;

  /** Fenêtre de personnalisation : produit à ajouter, ou ligne du panier à modifier (cle). */
  produitOuvert: ProduitOuvert | null;
  ouvrirProduit: (p: ProduitOuvert) => void;
  fermerProduit: () => void;

  /** Navbar cachée (on descend) ou visible (on remonte). */
  headerCache: boolean;
  setHeaderCache: (cache: boolean) => void;
};

export type ProduitOuvert = { id: string; option?: string; choix?: string[]; cle?: string };

// Pendant un saut de navigation (clic sur un onglet…), le sens du scroll est ignoré un court instant :
// la navbar reste visible et la section arrive pile sous les barres.
let ignorerScrollJusqua = 0;
export const scrollIgnore = () => Date.now() < ignorerScrollJusqua;
export function afficherHeaderPendantNavigation(ms = 500) {
  ignorerScrollJusqua = Date.now() + ms;
  useInterface.getState().setHeaderCache(false);
}

export const useInterface = create<EtatInterface>()((set) => ({
  filtres: [],
  basculerFiltre: (f) =>
    set((e) => ({ filtres: e.filtres.includes(f) ? e.filtres.filter((x) => x !== f) : [...e.filtres, f] })),
  choisirFiltre: (f) => set({ filtres: [f] }),
  effacerFiltres: () => set({ filtres: [] }),

  panierOuvert: false,
  ouvrirPanier: () => set({ panierOuvert: true }),
  fermerPanier: () => set({ panierOuvert: false }),

  produitOuvert: null,
  ouvrirProduit: (p) => set({ produitOuvert: p }),
  fermerProduit: () => set({ produitOuvert: null }),

  headerCache: false,
  setHeaderCache: (cache) => set((e) => (e.headerCache === cache ? e : { headerCache: cache })),
}));
