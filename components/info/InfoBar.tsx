"use client";

import { CONFIG } from "@/data/config";
import { FRAIS_MIN, ZONES } from "@/data/zones";
import { useStatut } from "@/lib/statut";
import { prixF } from "@/lib/prix";
import { IconeHorloge, IconePaiement, IconeScooter, IconeTelephone } from "@/components/ui/Icones";

export default function InfoBar() {
  const statut = useStatut();

  return (
    // Fond en dégradé : de la couleur du hero (--fond-hero, suit le carrousel) vers celle de la page,
    // visible sur les côtés de la bande verte, qui a la même largeur que le bandeau défilant au-dessus.
    <section
      aria-label="Infos pratiques"
      className="bg-[linear-gradient(to_bottom,var(--fond-hero),var(--color-farine))] px-2 lg:px-4"
    >
      <ul className="mx-auto grid gap-x-6 gap-y-3 rounded-b-[24px] bg-basilic-fonce px-4 py-5 text-white sm:grid-cols-2 lg:grid-cols-4 lg:px-[max(1.5rem,calc((100%-80rem)/2+1.5rem))]">
        <li className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/12 text-white">
            <IconeHorloge className="size-5" />
          </span>
          <span className="min-h-12 leading-tight">
            <span className="flex items-center gap-2 font-bold" aria-live="polite">
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-full ${statut ? (statut.ouvert ? "bg-[#7dff9a]" : "bg-croute") : "bg-white/50"}`}
              />
              {statut ? (statut.ouvert ? "Ouvert maintenant" : "Fermé pour le moment") : "Horaires"}
            </span>
            <span className="text-sm text-white/90">
              {statut ? statut.message : `Tous les jours, ${CONFIG.horaires.debut.replace(":", " h ")} – ${CONFIG.horaires.fin.replace(":", " h ")}`}
            </span>
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/12 text-white">
            <IconeScooter className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-bold">Livraison dans {ZONES.length} quartiers</span>
            <span className="text-sm text-white/90">Frais à partir de {prixF(FRAIS_MIN)}</span>
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/12 text-white">
            <IconePaiement className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-bold">Moyens de paiement</span>
            <span className="text-sm text-white/90">{CONFIG.paiements.join(", ").replace(/, ([^,]*)$/, " ou $1").replace("Espèces", "espèces")}</span>
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/12 text-white">
            <IconeTelephone className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-bold">Une question ?</span>
            <a href={`tel:${CONFIG.telephoneLien}`} className="text-sm text-white/90 underline-offset-2 hover:text-white hover:underline">
              {CONFIG.telephone}
            </a>
          </span>
        </li>
      </ul>
    </section>
  );
}
