"use client";

import { FILTRES } from "@/data/categories";
import { useInterface } from "@/store/interface";
import { PictoFiltre } from "./PictoFiltre";

/** Filtres par type (à la Brar's) : on peut en combiner plusieurs. */
export default function Filters({ resultats }: { resultats: number }) {
  const filtres = useInterface((e) => e.filtres);
  const basculer = useInterface((e) => e.basculerFiltre);
  const effacer = useInterface((e) => e.effacerFiltres);

  return (
    <div className="flex flex-col items-center gap-3">
      <div role="group" aria-label="Filtrer le menu" className="flex flex-wrap justify-center gap-2">
        {FILTRES.map((f) => {
          const actif = filtres.includes(f.id);
          return (
            // Au survol, la pastille colorée (32 px, centrée à 22 px du bord) s'agrandit jusqu'à remplir le bouton.
            <button
              key={f.id}
              type="button"
              aria-pressed={actif}
              onClick={() => basculer(f.id)}
              style={{ "--flow-remplissage": f.fond, "--flow-x": "22px", "--flow-r": "16px" } as React.CSSProperties}
              className={`inline-flex h-12 items-center gap-2.5 rounded-full py-1 pr-5 pl-1.5 font-semibold shadow-douce-sm ${
                actif ? "enfonce bg-charbon text-white" : "flow-gauche bg-white text-charbon"
              }`}
            >
              <PictoFiltre filtre={f.id} className="size-8" />
              {f.label}
            </button>
          );
        })}
        {filtres.length > 0 && (
          <button type="button" onClick={effacer} className="h-12 px-3 font-semibold text-charbon/70 underline underline-offset-4 hover:text-charbon">
            Tout afficher
          </button>
        )}
      </div>
      <p aria-live="polite" className="min-h-6 text-sm text-charbon/70">
        {filtres.length > 0 &&
          (resultats > 0
            ? `${resultats} produit${resultats > 1 ? "s" : ""} correspond${resultats > 1 ? "ent" : ""} à votre choix`
            : "Aucun produit ne correspond à ces filtres.")}
      </p>
    </div>
  );
}
