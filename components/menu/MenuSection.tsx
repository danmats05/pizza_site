"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES } from "@/data/categories";
import { PRODUITS } from "@/data/produits";
import type { CategorieId } from "@/data/types";
import { decalageHaut, useDefilerVers } from "@/lib/defiler";
import { useInterface } from "@/store/interface";
import CategoryTabs from "./CategoryTabs";
import Filters from "./Filters";
import ProductCard from "./ProductCard";

// Toutes les catégories et leurs produits, une fois pour toutes. Les filtres ne font que masquer :
// les cartes restent montées (réaffichage instantané, taille choisie conservée).
const SECTIONS = CATEGORIES.map((c) => ({ ...c, produits: PRODUITS.filter((p) => p.cat === c.id) }));

export default function MenuSection() {
  const filtres = useInterface((e) => e.filtres);
  // Navbar cachée : la barre d'onglets collée remonte à sa place, en haut de l'écran.
  const headerCache = useInterface((e) => e.headerCache);
  const [active, setActive] = useState<CategorieId | null>(CATEGORIES[0].id);
  const defilerVers = useDefilerVers();
  // Pendant un défilement lancé par un onglet, le suivi automatique est suspendu
  // (sinon l'onglet actif passerait par toutes les catégories traversées).
  const verrou = useRef(false);
  // La barre d'onglets est-elle collée en haut ? (pour masquer ce qui défile derrière le header)
  const sentinelle = useRef<HTMLDivElement>(null);
  const [colle, setColle] = useState(false);
  useEffect(() => {
    const el = sentinelle.current!;
    const header = document.querySelector<HTMLElement>("[data-header]")?.offsetHeight ?? 0;
    const obs = new IntersectionObserver(
      ([e]) => setColle(!e.isIntersecting && e.boundingClientRect.top < header),
      { rootMargin: `-${header}px 0px 0px 0px` },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const minuterieVerrou = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(minuterieVerrou.current), []);

  const choisirCategorie = (id: CategorieId) => {
    setActive(id); // l'onglet cliqué devient actif tout de suite
    verrou.current = true;
    const liberer = () => {
      verrou.current = false;
      clearTimeout(minuterieVerrou.current);
    };
    clearTimeout(minuterieVerrou.current);
    minuterieVerrou.current = setTimeout(liberer, 1500); // filet de sécurité si le défilement est interrompu
    defilerVers(`#cat-${id}`, liberer);
  };

  // Produits qui correspondent aux filtres, et nombre visible par catégorie.
  const { produitsVisibles, parCategorie } = useMemo(() => {
    const ids = new Set(PRODUITS.filter((p) => filtres.every((f) => p.tags.includes(f))).map((p) => p.id));
    const compte = new Map(SECTIONS.map((s) => [s.id, s.produits.filter((p) => ids.has(p.id)).length]));
    return { produitsVisibles: ids, parCategorie: compte };
  }, [filtres]);

  const resultats = produitsVisibles.size;
  const visibles = useMemo(
    () => new Set(SECTIONS.filter((s) => parCategorie.get(s.id)! > 0).map((s) => s.id)),
    [parCategorie],
  );

  // Onglet actif = section qui passe sous la ligne juste en dessous des barres collées.
  useEffect(() => {
    let observateur: IntersectionObserver | undefined;
    const observer = () => {
      observateur?.disconnect();
      // Ligne de détection 8 px sous l'endroit où arrive une section après un clic :
      // elle tombe dans la section d'arrivée, jamais sur le bas de la précédente.
      const haut = decalageHaut() + 8;
      observateur = new IntersectionObserver(
        (entrees) => {
          const visible = entrees.find((e) => e.isIntersecting);
          if (visible && !verrou.current) setActive(visible.target.id.replace("cat-", "") as CategorieId);
        },
        { rootMargin: `-${haut}px 0px -${Math.max(0, window.innerHeight - haut - 2)}px 0px` },
      );
      document.querySelectorAll("[data-section-menu]").forEach((s) => observateur!.observe(s));
    };
    observer();
    window.addEventListener("resize", observer);
    return () => {
      observateur?.disconnect();
      window.removeEventListener("resize", observer);
    };
  }, []);

  return (
    <section id="menu" aria-labelledby="titre-menu" className="pt-16 pb-20 lg:pt-24">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-6">
        <p className="text-lg font-semibold tracking-wide text-tomate lg:text-xl">Le menu</p>
        <h2 id="titre-menu" className="titre mx-auto mt-2 max-w-4xl text-[clamp(2.4rem,7vw,4.8rem)]">
          Qu&apos;est-ce qui vous fait envie&nbsp;?
        </h2>
      </div>

      {/* Repère juste au-dessus de la barre : quand il passe sous le header, la barre est collée. */}
      <div ref={sentinelle} aria-hidden="true" className="mt-10 h-px" />
      <div
        data-onglets
        className={`sticky top-header z-40 py-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          colle
            ? // Au-dessus : couvre la zone derrière le header. Derrière et sous la pilule : fond uni puis fondu adouci
              // sur les cartes qui défilent (sous la pilule grâce à -z-10, dans le contexte de la barre).
              "before:absolute before:inset-x-0 before:bottom-full before:h-header before:bg-farine after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:-bottom-10 after:-z-10 after:fondu-sous-onglets"
            : "bg-farine"
        } ${colle && headerCache ? "-translate-y-(--spacing-header)" : ""}`}
      >
        <CategoryTabs categories={CATEGORIES} visibles={visibles} active={active} onChoisir={choisirCategorie} />
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4 lg:px-6">
        <Filters resultats={resultats} />

        {SECTIONS.map((s) => (
          <section
            key={s.id}
            id={`cat-${s.id}`}
            hidden={!visibles.has(s.id)}
            data-section-menu
            aria-labelledby={`titre-cat-${s.id}`}
            className="scroll-mt-40 pt-8 pb-4"
          >
            <div data-arrivee className="mb-6 flex flex-wrap items-end gap-x-4 gap-y-1">
              <h2 id={`titre-cat-${s.id}`} className="titre text-[clamp(2.1rem,5vw,3.2rem)]">
                {s.label}
              </h2>
              <span className="mb-1.5 rounded-full bg-croute px-2.5 py-0.5 text-sm font-bold text-charbon">
                {parCategorie.get(s.id)}
              </span>
              <p className="mb-1.5 w-full text-charbon/65 sm:ml-auto sm:w-auto">{s.accroche}</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {s.produits.map((p) => (
                <div key={p.id} hidden={!produitsVisibles.has(p.id)} className="grid min-w-0">
                  <ProductCard produit={p} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
