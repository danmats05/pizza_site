import { CONFIG } from "@/data/config";
import { ZONES } from "@/data/zones";
import { detailLigne, sousTotal, type Ligne } from "@/store/panier";

export type Coordonnees = {
  nom: string;
  telephone: string;
  quartier: string;
  adresse: string;
  paiement: string;
  remarque: string;
};

export type Erreurs = Partial<Record<keyof Coordonnees, string>>;

/** Téléphone sénégalais : 9 chiffres commençant par 7 ou 3, préfixe 221 / +221 / 00221 accepté. */
export function telephoneNormalise(saisie: string): string | null {
  const chiffres = saisie.replace(/[\s.\-()]/g, "").replace(/^(\+|00)?221/, "");
  return /^[73]\d{8}$/.test(chiffres) ? chiffres : null;
}

/** Étape « Livraison » : nom, téléphone, quartier. */
export function validerLivraison(c: Coordonnees): Erreurs {
  const e: Erreurs = {};
  if (c.nom.trim().length < 2) e.nom = "Indiquez votre nom.";
  if (!c.telephone.trim()) e.telephone = "Indiquez votre numéro de téléphone.";
  else if (!telephoneNormalise(c.telephone)) e.telephone = "Numéro invalide : 9 chiffres, par exemple 77 123 45 67.";
  if (!ZONES.some((z) => z.nom === c.quartier)) e.quartier = "Choisissez votre quartier.";
  return e;
}

/** Étape « Paiement » : moyen de paiement. */
export function validerPaiement(c: Coordonnees): Erreurs {
  const e: Erreurs = {};
  if (!CONFIG.paiements.includes(c.paiement as (typeof CONFIG.paiements)[number])) e.paiement = "Choisissez un moyen de paiement.";
  return e;
}

export const fraisLivraison = (quartier: string) => ZONES.find((z) => z.nom === quartier)?.frais ?? 0;

/** Commande validée : copie figée du panier et des coordonnées (le panier est vidé ensuite). */
export type Commande = {
  numero: string;
  lignes: { nom: string; option?: string; details: { titre: string; valeur: string }[]; qte: number; total: number }[];
  sousTotal: number;
  livraison: number;
  total: number;
  coordonnees: Coordonnees;
};

/**
 * Démo : la commande n'est envoyée nulle part, on fabrique seulement le récapitulatif affiché au client.
 * Plus tard : envoi à la pizzeria (e-mail, tableau de bord, N8N…).
 * Paiement : seul le moyen choisi est enregistré. Les API Wave / Orange Money seront branchées ici
 * uniquement si la pizzeria valide le projet.
 */
export function creerCommande(lignes: Ligne[], coordonnees: Coordonnees): Commande {
  const st = sousTotal(lignes);
  const livraison = fraisLivraison(coordonnees.quartier);
  const lettres = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numero = `PT-${lettres[Math.floor(Math.random() * lettres.length)]}${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    numero,
    lignes: lignes.map((l) => {
      const d = detailLigne(l)!;
      return { nom: d.produit.nom, option: d.optionLabel, details: d.details, qte: l.qte, total: d.prix * l.qte };
    }),
    sousTotal: st,
    livraison,
    total: st + livraison,
    coordonnees: { ...coordonnees, telephone: telephoneNormalise(coordonnees.telephone) ?? coordonnees.telephone },
  };
}
