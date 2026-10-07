"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Flip, gsap, useGSAP } from "@/lib/gsap";
import { ONGLETS } from "@/data/onglets";
import { photo } from "@/lib/images";
import type { CategorieId } from "@/data/types";

const HAUTEUR_IMAGE_EM = 1.8; // hauteur de l'image, proportionnelle au texte
// Courbe très douce (sortie lente) pour l'image qui « sort » du mot.
const DOUX = "ease-[cubic-bezier(0.22,1,0.36,1)]";
// Filtres : les onglets restants glissent à leur nouvelle place, ceux qui arrivent s'étirent, ceux qui partent se rétractent.
const DUREE_FLIP = 0.45;

/**
 * Barre d'onglets collée sous le header. L'onglet actif suit la section visible.
 * Au survol (ou au focus clavier), une petite photo sort du mot, à gauche du texte.
 * Les catégories vidées par les filtres se rétractent (et s'étirent quand elles reviennent), avec GSAP Flip.
 */
export default function CategoryTabs({
  categories,
  visibles,
  active,
  onChoisir,
}: {
  categories: { id: CategorieId; label: string }[];
  visibles: ReadonlySet<CategorieId>;
  active: CategorieId | null;
  onChoisir: (id: CategorieId) => void;
}) {
  const liste = useRef<HTMLUListElement>(null);
  const premierRendu = useRef(true);
  const cleVisibles = categories
    .filter((c) => visibles.has(c.id))
    .map((c) => c.id)
    .join(",");

  // Affichage / masquage des onglets piloté ici (et non par React) pour que Flip puisse
  // mémoriser l'état avant le changement, puis animer vers le nouvel état.
  useGSAP(
    () => {
      const ul = liste.current!;
      const items = gsap.utils.toArray<HTMLLIElement>("li", ul);
      const appliquer = () =>
        items.forEach((li) => {
          const visible = visibles.has(li.dataset.cat as CategorieId);
          li.hidden = !visible;
          li.inert = !visible;
          if (visible) li.removeAttribute("aria-hidden");
          else li.setAttribute("aria-hidden", "true");
        });

      const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (premierRendu.current || reduit) {
        premierRendu.current = false;
        appliquer();
        return;
      }

      // La barre fait partie du Flip (nested) : elle est centrée, donc sa largeur et sa position
      // changent en même temps que celles des onglets ; tout est calculé ensemble, sans saut.
      const etat = Flip.getState([ul, ...items]);
      appliquer();

      Flip.from(etat, {
        targets: [ul, ...items],
        duration: DUREE_FLIP,
        ease: "power3.inOut",
        nested: true,
        absoluteOnLeave: true,
        onEnter: (arrivants) =>
          gsap.fromTo(
            arrivants,
            { opacity: 0, scaleX: 0.2 },
            { opacity: 1, scaleX: 1, duration: DUREE_FLIP + 0.1, ease: "back.out(2.2)", delay: 0.05 },
          ),
        onLeave: (partants) => gsap.to(partants, { opacity: 0, scaleX: 0.2, duration: 0.22, ease: "power2.in" }),
      });
    },
    { dependencies: [cleVisibles], scope: liste },
  );

  // Sur mobile, garde l'onglet actif visible dans la barre qui défile horizontalement.
  useEffect(() => {
    const ul = liste.current;
    const onglet = ul?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (!ul || !onglet) return;
    const gauche = onglet.offsetLeft - ul.clientWidth / 2 + onglet.clientWidth / 2;
    ul.scrollTo({ left: gauche, behavior: "smooth" });
  }, [active]);

  return (
    // Toutes les dimensions sont en em : la barre garde ses proportions, seule la taille du texte l'agrandit.
    <nav aria-label="Catégories du menu" className="mx-auto max-w-7xl px-4 lg:px-6">
      <ul
        ref={liste}
        className="sans-scrollbar relative mx-auto flex w-fit max-w-full overflow-x-auto rounded-full bg-charbon p-[0.39em] text-[1.1rem] shadow-douce lg:text-[1.2rem]"
      >
        {categories.map((c) => {
          const estActive = c.id === active;
          const image = ONGLETS[c.id];
          const largeur = `${((image.largeur / image.hauteur) * HAUTEUR_IMAGE_EM).toFixed(2)}em`;
          return (
            <li key={c.id} data-cat={c.id} className="shrink-0">
              <a
                href={`#cat-${c.id}`}
                aria-current={estActive ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onChoisir(c.id);
                }}
                className={`group flex h-[2.63em] items-center rounded-full px-[1.05em] font-semibold whitespace-nowrap transition-colors duration-300 focus-visible:outline-offset-[-3px] ${
                  estActive ? "bg-white text-charbon" : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {/* L'emplacement s'ouvre jusqu'à la largeur de l'image ; l'image part de derrière le mot, petite et inclinée. */}
                <span
                  aria-hidden="true"
                  style={{ "--largeur": largeur } as React.CSSProperties}
                  className={`relative h-[1.8em] w-0 shrink-0 transition-[width,margin] duration-500 ${DOUX} group-hover:mr-2 group-hover:w-(--largeur) group-focus-visible:mr-2 group-focus-visible:w-(--largeur)`}
                >
                  <Image
                    src={photo(image.src)}
                    alt=""
                    width={image.largeur}
                    height={image.hauteur}
                    loading="eager"
                    style={{ width: largeur }}
                    className={`absolute top-0 left-0 h-[1.8em] max-w-none origin-right translate-x-[60%] scale-[0.25] rotate-[-35deg] object-contain opacity-0 transition-[translate,scale,rotate,opacity] duration-500 ${DOUX} group-hover:translate-x-0 group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:scale-100 group-focus-visible:rotate-0 group-focus-visible:opacity-100`}
                  />
                </span>
                {c.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
