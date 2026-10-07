"use client";

import { useSyncExternalStore } from "react";

const REQUETE = "(prefers-reduced-motion: reduce)";

function abonner(rappel: () => void) {
  const media = window.matchMedia(REQUETE);
  media.addEventListener("change", rappel);
  return () => media.removeEventListener("change", rappel);
}

/**
 * true si le visiteur demande moins d'animations.
 * Côté serveur (et pendant l'hydratation), on considère le mouvement réduit :
 * rien d'animé n'est rendu avant de connaître la préférence, donc pas d'écart d'hydratation.
 */
export function useMouvementReduit() {
  return useSyncExternalStore(
    abonner,
    () => window.matchMedia(REQUETE).matches,
    () => true,
  );
}
