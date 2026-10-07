"use client";

import { useEffect, useState } from "react";
import { statutOuverture, type Statut } from "@/lib/horaires";

/** Statut ouvert / fermé calculé dans le navigateur (heure de Dakar = UTC), mis à jour chaque minute. */
export function useStatut() {
  const [statut, setStatut] = useState<Statut | null>(null);
  useEffect(() => {
    const maj = () => setStatut(statutOuverture());
    maj();
    const id = setInterval(maj, 60_000);
    return () => clearInterval(id);
  }, []);
  return statut;
}
