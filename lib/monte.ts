"use client";

import { useSyncExternalStore } from "react";

const rien = () => () => {};

/**
 * false au rendu serveur et pendant l'hydratation, true ensuite.
 * Sert à n'afficher les données du navigateur (panier persisté, heure) qu'après le montage,
 * pour éviter toute erreur d'hydratation.
 */
export function useMonte() {
  return useSyncExternalStore(rien, () => true, () => false);
}
