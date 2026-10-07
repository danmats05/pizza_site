"use client";

import { photo } from "@/lib/images";
import Image from "next/image";
import { useRef } from "react";
import { CATEGORIES, FILTRES, PIZZA_DU_MOMENT } from "@/data/categories";
import { PRODUITS } from "@/data/produits";
import type { FiltreId } from "@/data/types";
import { prixF, prixMin } from "@/lib/prix";
import { useDefilerVers } from "@/lib/defiler";
import { gsap, useGSAP } from "@/lib/gsap";
import { useInterface } from "@/store/interface";
import { IconeFleche } from "@/components/ui/Icones";
import { Sticker } from "@/components/ui/Sticker";
import { PictoFiltre } from "@/components/menu/PictoFiltre";

const vedette = PRODUITS.find((p) => p.id === PIZZA_DU_MOMENT)!;

// Survol des lignes : même remplissage que les filtres du menu, depuis la pastille (56 px, à 8 px du bord).
const FLOW = { "--flow-x": "36px", "--flow-r": "28px", "--flow-fin": "165%" } as React.CSSProperties;
// Flèches : décalées vers la gauche, elles avancent au survol sans dépasser leur alignement.
const FLECHE =
  "mr-3 grid size-7 shrink-0 place-items-center rounded-lg bg-encre text-white transition-transform duration-300 ease-out group-hover:translate-x-1";

/**
 * Panneau déroulant du header (desktop) : catégories avec vignettes, envies, pizza du moment.
 * Toujours monté : GSAP l'anime à l'ouverture (dépliage + éléments en cascade) et à la fermeture.
 */
export default function MegaMenu({ id, ouvert, onFermer }: { id: string; ouvert: boolean; onFermer: () => void }) {
  const defilerVers = useDefilerVers();
  const racine = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(racine);
      gsap.killTweensOf([racine.current, q("[data-mm]"), q("[data-mm-item]"), q("[data-mm-carte]"), q("[data-mm-sticker]")]);
      if (reduit) {
        gsap.set(racine.current, { autoAlpha: ouvert ? 1 : 0 });
        return;
      }
      if (ouvert) {
        gsap
          .timeline()
          .set(racine.current, { autoAlpha: 1 })
          // Panneau : départ doux, accélération, puis freinage (on voit tout le dépliage).
          .fromTo(
            q("[data-mm]"),
            { clipPath: "inset(0% 0% 100% 0% round 32px)", y: -24, opacity: 0 },
            {
              clipPath: "inset(0% 0% 0% 0% round 32px)",
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power2.inOut",
              clearProps: "clipPath",
            },
            0,
          )
          .fromTo(
            q("[data-mm-item]"),
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.016, ease: "power2.out" },
            0.15,
          )
          .fromTo(q("[data-mm-carte]"), { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }, 0.2)
          .fromTo(
            q("[data-mm-sticker]"),
            { scale: 0, rotation: -120 },
            { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.8)" },
            0.4,
          );
      } else {
        gsap
          .timeline({ defaults: { ease: "power2.in" } })
          .to(q("[data-mm]"), { clipPath: "inset(0% 0% 100% 0% round 32px)", y: -12, opacity: 0, duration: 0.3, ease: "power2.inOut" }, 0)
          .set(racine.current, { autoAlpha: 0 });
      }
    },
    { dependencies: [ouvert], scope: racine },
  );
  const choisirFiltre = useInterface((e) => e.choisirFiltre);

  const aller = (ancre: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onFermer();
    defilerVers(ancre);
  };

  const filtrer = (f: FiltreId) => () => {
    choisirFiltre(f);
    onFermer();
    defilerVers("#menu");
  };

  return (
    <div ref={racine} id={id} inert={!ouvert} className="invisible absolute inset-x-0 top-full pt-3 text-encre">
      <div data-mm className="mx-auto grid grid-cols-[1.45fr_1fr_1.1fr] gap-8 rounded-bloc bg-white p-7 shadow-douce-lg">
        <div>
          <p data-mm-item className="mb-3 text-sm font-semibold text-charbon/55">Nos catégories</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            {CATEGORIES.map((c) => (
              <li key={c.id} data-mm-item>
                <a
                  href={`#cat-${c.id}`}
                  onClick={aller(`#cat-${c.id}`)}
                  style={{ ...FLOW, "--flow-remplissage": "var(--color-pate)" } as React.CSSProperties}
                  className="flow-gauche group flex items-center gap-3 rounded-2xl p-2"
                >
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-pate">
                    <Image src={photo(c.vignette)} alt="" fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />
                  </span>
                  <span className="titre flex-1 text-lg">{c.label}</span>
                  <span className={FLECHE}>
                    <IconeFleche className="size-4" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p data-mm-item className="mb-3 text-sm font-semibold text-charbon/55">Envie de…</p>
          <ul className="flex flex-col gap-1">
            {FILTRES.map((f) => (
              <li key={f.id} data-mm-item>
                <button
                  type="button"
                  onClick={filtrer(f.id)}
                  style={{ ...FLOW, "--flow-remplissage": f.fond } as React.CSSProperties}
                  className="flow-gauche group flex w-full items-center gap-3 rounded-2xl p-2 text-left"
                >
                  <PictoFiltre filtre={f.id} className="size-14" />
                  <span className="titre flex-1 text-lg">{f.label}</span>
                  <span className={FLECHE}>
                    <IconeFleche className="size-4" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div data-mm-carte className="relative flex min-h-80 flex-col overflow-hidden rounded-[24px] bg-tomate p-6 text-white">
          <p className="text-sm font-bold text-white/85">La pizza du moment</p>
          <p className="titre mt-1 text-4xl">{vedette.nom.replace(/^La /, "")}</p>
          <p className="mt-3 max-w-[16rem] text-sm leading-snug text-white/90">{vedette.desc}</p>
          <p className="mt-2 font-bold">dès {prixF(prixMin(vedette))}</p>
          <a
            href={`#produit-${vedette.id}`}
            onClick={aller(`#produit-${vedette.id}`)}
            className="origine z-10 mt-4 inline-flex h-11 w-fit items-center gap-2 rounded-bouton bg-white px-4 font-semibold text-charbon [--origine-fond:var(--color-charbon)] [--origine-texte:#fff]"
          >
            Voir la pizza <IconeFleche className="size-4" />
          </a>
          {vedette.img && (
            <Image
              src={photo(vedette.img)}
              alt=""
              width={520}
              height={520}
              className="pointer-events-none absolute -right-28 -bottom-32 size-[29rem] rotate-12 object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.3)]"
            />
          )}
          <div data-mm-sticker className="mt-5 w-fit">
            <Sticker tour="Pizza du moment" centre="Time" couleur="croute" rotation={-10} taille={116} />
          </div>
        </div>
      </div>
    </div>
  );
}
