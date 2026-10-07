import type { Produit } from "@/data/types";

/** Prix le plus bas d'un produit (pour « dès 5 500 F »). */
export function prixMin(p: Produit): number {
  return p.type === "unique" ? p.prix : Math.min(...p.options.liste.map((o) => o.prix));
}

/** 13000 → "13 000 F" (espaces simples, pas d'espaces insécables invisibles dans WhatsApp) */
export function prixF(montant: number): string {
  return montant.toLocaleString("fr-FR").replace(/ | /g, " ") + " F";
}
