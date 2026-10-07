"use client";

import { useMonte } from "@/lib/monte";
import { useInterface } from "@/store/interface";
import { nombreArticles, sousTotal, usePanier } from "@/store/panier";
import PrixAnime from "@/components/ui/PrixAnime";
import { IconeFleche } from "@/components/ui/Icones";

/** Barre panier fixe en bas de l'écran sur mobile, dès qu'il y a au moins un article. */
export default function CartBar() {
  const monte = useMonte();
  const lignes = usePanier((e) => e.lignes);
  const ouvrir = useInterface((e) => e.ouvrirPanier);
  const ouvert = useInterface((e) => e.panierOuvert || !!e.produitOuvert);
  const n = nombreArticles(lignes);
  const visible = monte && n > 0 && !ouvert;

  return (
    <div
      className={`marge-securite-bas fixed inset-x-0 bottom-0 z-40 px-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-[130%]"
      }`}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={ouvrir}
        tabIndex={visible ? 0 : -1}
        data-panier-cible={visible ? "" : undefined}
        className="flex h-14 w-full items-center gap-3 rounded-2xl bg-charbon px-4 text-white shadow-douce-lg"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-croute text-sm font-bold text-charbon tabular-nums">{n}</span>
        <span className="flex-1 text-left font-bold">Voir le panier</span>
        <span className="font-bold">
          <PrixAnime apparition={false} montant={sousTotal(lignes)} />
        </span>
        <IconeFleche className="size-5" />
      </button>
    </div>
  );
}
