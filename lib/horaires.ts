import { CONFIG } from "@/data/config";

// Dakar vit à l'heure UTC toute l'année (pas d'heure d'été) : on lit l'heure UTC.

function enMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export type Statut = { ouvert: boolean; message: string };

export function statutOuverture(maintenant: Date = new Date()): Statut {
  const { debut, fin } = CONFIG.horaires;
  const minutes = maintenant.getUTCHours() * 60 + maintenant.getUTCMinutes();
  const jour = maintenant.getUTCDay();
  const d = enMinutes(debut);
  const f = enMinutes(fin);

  const fermeAujourdhui = CONFIG.joursFermeture.includes(jour);
  // Gère aussi une fermeture après minuit (ex. 11:00 → 01:00).
  const dansLaPlage = f > d ? minutes >= d && minutes < f : minutes >= d || minutes < f;

  if (!fermeAujourdhui && dansLaPlage) {
    return { ouvert: true, message: `Ouvert jusqu'à ${fin.replace(":", " h ")}` };
  }
  return { ouvert: false, message: `Fermé · ouvre à ${debut.replace(":", " h ")}` };
}

export function horairesTexte() {
  const { debut, fin } = CONFIG.horaires;
  return `${debut.replace(":", " h ")} – ${fin.replace(":", " h ")}`;
}
