"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { DIAPOS_HERO } from "@/data/hero";
import { gsap, useGSAP } from "@/lib/gsap";
import { useDefilerVers } from "@/lib/defiler";
import { useMouvementReduit } from "@/lib/mouvement";
import { prixF } from "@/lib/prix";
import { volerVersPanier } from "@/lib/voler";
import { trouverProduit, usePanier } from "@/store/panier";
import PrixAnime from "@/components/ui/PrixAnime";
import { Sticker } from "@/components/ui/Sticker";
import { IconeCoche, IconeEtoile, IconeFleche } from "@/components/ui/Icones";
import BandeauDefilant from "@/components/info/BandeauDefilant";
import HeroDecor from "./HeroDecor";
import HeroPizza, { PART_DETACHEE, angleMedian } from "./HeroPizza";

const N = DIAPOS_HERO.length;
const DELAI_AUTO = 6000;
const mod = (i: number) => (i + N) % N;

// Étincelles autour de la pizza (positions en % de la scène).
const ETINCELLES = [
  { top: "6%", left: "14%", taille: 30 },
  { top: "12%", left: "84%", taille: 22 },
  { top: "70%", left: "6%", taille: 20 },
  { top: "86%", left: "76%", taille: 34 },
  { top: "44%", left: "96%", taille: 16 },
];

export default function Hero() {
  preload(DIAPOS_HERO[0].image, { as: "image", fetchPriority: "high" });

  const scope = useRef<HTMLElement>(null);
  const defilerVers = useDefilerVers();
  const mouvementReduit = useMouvementReduit();
  const ajouter = usePanier((e) => e.ajouter);

  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const [manuel, setManuel] = useState(false); // annonce le changement aux lecteurs d'écran seulement si demandé
  const [ajoute, setAjoute] = useState(false);
  const enTransition = useRef(false);
  const sens = useRef(1);
  const departSwipe = useRef<number | null>(null);
  const minuterieAjout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const diapo = DIAPOS_HERO[index];
  const produit = trouverProduit(diapo.produit)!;
  const optionDefaut =
    produit.type === "options"
      ? produit.options.liste.find((o) => o.id === produit.options.defaut)
      : undefined;
  const prix = produit.type === "unique" ? produit.prix : optionDefaut!.prix;
  const precedente = DIAPOS_HERO[mod(index - 1)];
  const suivante = DIAPOS_HERO[mod(index + 1)];

  // ---------- Entrée de page + animation au scroll ----------
  useGSAP(
    () => {
      const html = document.documentElement;
      const hero = scope.current!;
      const mm = gsap.matchMedia();
      const a = (angleMedian(PART_DETACHEE) * Math.PI) / 180;
      const part = (d: number) => ({ x: Math.cos(a) * d, y: Math.sin(a) * d });
      let introJouee = false; // matchMedia rejoue la fonction au changement de point de rupture

      mm.add(
        {
          bouge: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 1024px)",
        },
        (ctx) => {
          const { bouge, desktop } = ctx.conditions as {
            bouge: boolean;
            desktop: boolean;
          };
          if (!bouge) {
            html.classList.remove("intro");
            return;
          }

          if (!introJouee) {
            introJouee = true;
            gsap
              .timeline({ defaults: { ease: "power3.out" } })
              .fromTo(
                "[data-titre-ligne]",
                { yPercent: 110 },
                { yPercent: 0, duration: 0.9 },
                0.15,
              )
              .fromTo(
                "[data-pizza-entree]",
                { rotation: -200, scale: 0.4, autoAlpha: 0 },
                {
                  rotation: 0,
                  scale: 1,
                  autoAlpha: 1,
                  duration: 1.4,
                  ease: "back.out(1.2)",
                },
                0,
              )
              .fromTo(
                "[data-etincelle]",
                { scale: 0 },
                { scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(3)" },
                0.3,
              )
              .fromTo(
                "[data-decor]",
                { autoAlpha: 0, y: 60 },
                { autoAlpha: 1, y: 0, duration: 1.4, ease: "power2.out" },
                0.2,
              )
              .fromTo(
                "[data-voisine]",
                { autoAlpha: 0, xPercent: (i: number) => (i ? 40 : -40) },
                { autoAlpha: 0.9, xPercent: 0, duration: 1 },
                0.5,
              )
              .fromTo(
                "[data-fondu]",
                { autoAlpha: 0, y: 18 },
                { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
                0.6,
              )
              .fromTo(
                "[data-sticker]",
                { scale: 0, rotation: -90 },
                {
                  scale: 1,
                  rotation: 0,
                  duration: 0.8,
                  ease: "back.out(2)",
                  stagger: 0.12,
                },
                0.9,
              );
          }
          html.classList.remove("intro");

          const tl = gsap.timeline({
            scrollTrigger: desktop
              ? {
                  trigger: hero,
                  start: "top top",
                  end: "+=110%",
                  pin: true,
                  scrub: 1,
                  invalidateOnRefresh: true,
                }
              : {
                  trigger: hero,
                  start: "top top",
                  end: "bottom top",
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
            defaults: { ease: "none" },
          });
          tl.to(
            "[data-pizza-tourne]",
            {
              rotation: desktop ? 120 : 90,
              scale: desktop ? 1.15 : 1.1,
              svgOrigin: "500 500",
            },
            0,
          );
          if (desktop) {
            tl.to("[data-titre]", { y: -120, opacity: 0.15 }, 0)
              .to("[data-decor-zone]", { yPercent: 12 }, 0)
              .to(
                "[data-sticker-zone='0']",
                { x: -80, y: -40, rotation: -30, opacity: 0 },
                0,
              )
              .to(
                "[data-sticker-zone='1']",
                { x: 80, y: 40, rotation: 30, opacity: 0 },
                0,
              )
              .to("[data-voisine-zone='0']", { xPercent: -45, opacity: 0 }, 0)
              .to("[data-voisine-zone='1']", { xPercent: 45, opacity: 0 }, 0);
          }
        },
      );
    },
    { scope },
  );

  // ---------- Changement de diapositive ----------
  const transition = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => () => void transition.current?.kill(), []);

  function aller(cible: number, direction: number, parUtilisateur: boolean) {
    if (enTransition.current || cible === index) return;
    if (parUtilisateur) setManuel(true);
    sens.current = direction;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIndex(cible);
      return;
    }
    enTransition.current = true;
    const nouvelle = DIAPOS_HERO[cible];
    const q = gsap.utils.selector(scope); // sélecteurs limités au hero
    transition.current = gsap
      .timeline({
        defaults: { ease: "power2.in" },
        onComplete: () => setIndex(cible),
      })
      .to(q("[data-titre-ligne]"), { yPercent: -110, duration: 0.35 }, 0)
      .to(
        q("[data-pizza-scene]"),
        {
          xPercent: -direction * 70,
          rotation: -direction * 140,
          scale: 0.75,
          autoAlpha: 0,
          duration: 0.45,
        },
        0,
      )
      .to(q("[data-sticker]"), { scale: 0, duration: 0.25, stagger: 0.05 }, 0)
      .to(q("[data-voisine]"), { autoAlpha: 0, duration: 0.25 }, 0)
      .to(
        scope.current,
        { backgroundColor: nouvelle.fond, duration: 0.6, ease: "power1.inOut" },
        0,
      )
      .to(
        document.documentElement,
        { "--fond-hero": nouvelle.fond, duration: 0.6, ease: "power1.inOut" },
        0,
      )
      .to(
        q("[data-decor]"),
        { autoAlpha: 0, y: 30, duration: 0.35, ease: "power2.in" },
        0,
      );
  }

  // Entrée de la nouvelle diapositive, une fois le rendu React fait.
  useGSAP(
    () => {
      if (!enTransition.current) return;
      const d = sens.current;
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => void (enTransition.current = false),
        })
        .fromTo(
          "[data-titre-ligne]",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.6 },
          0,
        )
        .fromTo(
          "[data-decor]",
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
          0,
        )
        .fromTo(
          "[data-pizza-scene]",
          { xPercent: d * 70, rotation: d * 140, scale: 0.75, autoAlpha: 0 },
          {
            xPercent: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "back.out(1.1)",
          },
          0,
        )
        .fromTo(
          "[data-etincelle]",
          { scale: 0 },
          { scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(3)" },
          0.25,
        )
        .fromTo(
          "[data-sticker]",
          { scale: 0 },
          { scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(2.2)" },
          0.35,
        )
        .to("[data-voisine]", { autoAlpha: 0.9, duration: 0.5 }, 0.3);
    },
    { scope, dependencies: [index] },
  );

  const suivant = (parUtilisateur = true) =>
    aller(mod(index + 1), 1, parUtilisateur);
  const precedent = () => aller(mod(index - 1), -1, true);

  // ---------- Défilement automatique ----------
  const suivantAuto = useRef(suivant);
  useEffect(() => {
    suivantAuto.current = suivant;
  });
  // Repart de zéro à chaque changement de pizza (y compris après un clic). Se met en pause seulement
  // via le bouton pause, si l'onglet est caché, si on a quitté le hero, ou si le mouvement est réduit.
  useEffect(() => {
    if (pause || mouvementReduit) return;
    let timer: ReturnType<typeof setTimeout>;
    const avancer = () => {
      if (document.hidden || window.scrollY > 20) {
        timer = setTimeout(avancer, 1000); // réessaie plus tard, sans changer de pizza
        return;
      }
      suivantAuto.current(false);
    };
    timer = setTimeout(avancer, DELAI_AUTO);
    return () => clearTimeout(timer);
  }, [pause, mouvementReduit, index]);

  useEffect(() => () => clearTimeout(minuterieAjout.current), []);

  // Les autres photos se chargent discrètement après l'affichage, pour des transitions sans trou.
  useEffect(() => {
    const id = setTimeout(() => {
      for (const d of DIAPOS_HERO.slice(1)) new window.Image().src = d.image;
    }, 1500);
    return () => clearTimeout(id);
  }, []);

  const ajouterAuPanier = () => {
    ajouter(produit.id, optionDefaut?.id);
    volerVersPanier(
      scope.current?.querySelector<HTMLElement>("[data-pizza-scene]") ?? null,
      produit.imgSm,
    );
    setAjoute(true);
    clearTimeout(minuterieAjout.current);
    minuterieAjout.current = setTimeout(() => setAjoute(false), 1000);
  };

  // Couleur du hero partagée avec la bande d'infos en dessous (dégradé de transition).
  useEffect(() => {
    document.documentElement.style.setProperty("--fond-hero", diapo.fond);
  }, [diapo.fond]);

  const clair = diapo.texteClair;

  return (
    <section
      id="haut"
      ref={scope}
      aria-roledescription="carrousel"
      aria-label="Pizzas à la une"
      style={{ backgroundColor: diapo.fond }}
      className="relative flex flex-col overflow-hidden pt-[calc(var(--spacing-header)+1.25rem)] lg:h-svh lg:min-h-[680px]"
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest("[data-carrousel-nav]")) {
          if (e.key === "ArrowRight") suivant();
          if (e.key === "ArrowLeft") precedent();
        }
      }}
    >
      {/* Silhouette en fond, propre à chaque pizza (château, horloge, ville…) */}
      <div data-decor-zone className="pointer-events-none absolute inset-0">
        <HeroDecor
          decor={diapo.decor}
          couleur={diapo.ombre}
          opacite={diapo.ombreOpacite}
        />
      </div>

      <h1 className="sr-only">
        Pizza Time Dakar : commandez vos pizzas en ligne, livrées partout à
        Dakar
      </h1>

      {/* Nom de la pizza, très grand, centré */}
      <div
        data-titre
        className="relative z-10 px-4 text-center"
        aria-live={manuel ? "polite" : "off"}
      >
        <p className="sr-only">
          Pizza {index + 1} sur {N}
        </p>
        <p className="titre -mb-[0.12em] flex min-h-[2.15em] items-center justify-center overflow-hidden pb-[0.22em] text-[clamp(3rem,13vw,4.6rem)] lg:min-h-0 lg:text-[clamp(4rem,8.2vw,8rem)]">
          <span
            data-titre-ligne
            data-intro
            className="block"
            style={{ color: diapo.titre }}
          >
            {produit.nom}
          </span>
        </p>
      </div>

      {/* Scène : pizza centrale, voisines sur les côtés, stickers, étincelles */}
      <div
        className="relative mt-2 flex min-h-0 flex-1 touch-pan-y justify-center lg:-mt-2"
        onPointerDown={(e) => {
          departSwipe.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (departSwipe.current === null) return;
          const dx = e.clientX - departSwipe.current;
          departSwipe.current = null;
          if (Math.abs(dx) > 60) {
            if (dx < 0) suivant();
            else precedent();
          }
        }}
      >
        {[precedente, suivante].map((v, i) => (
          <div
            key={i}
            data-voisine-zone={i}
            className={`absolute top-1/2 z-0 aspect-square w-[34vw] -translate-y-1/2 lg:w-[min(24vw,22rem)] ${
              i
                ? "-right-[17vw] lg:-right-[8vw]"
                : "-left-[17vw] lg:-left-[8vw]"
            }`}
          >
            <button
              type="button"
              data-voisine={i}
              data-intro
              onClick={() => (i ? suivant() : precedent())}
              aria-label={`${i ? "Pizza suivante" : "Pizza précédente"} : ${trouverProduit(v.produit)?.nom}`}
              className={`relative block size-full opacity-90 ${i ? "rotate-12" : "-rotate-12"}`}
            >
              <Image
                src={v.imageSm}
                alt=""
                fill
                loading="eager"
                sizes="(min-width: 1024px) 22rem, 34vw"
                className="object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]"
              />
            </button>
          </div>
        ))}

        <div className="relative aspect-square w-[min(84vw,30rem)] lg:h-full lg:w-auto lg:max-w-[40rem]">
          <div data-pizza-entree data-intro className="absolute inset-[4%]">
            <div
              data-pizza-scene
              className="size-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.28)]"
            >
              <HeroPizza
                src={diapo.image}
                alt={`${produit.nom}, vue de dessus`}
              />
            </div>
          </div>

          {ETINCELLES.map((e, i) => (
            <IconeEtoile
              key={i}
              data-etincelle
              data-intro
              className="absolute"
              style={{
                top: e.top,
                left: e.left,
                width: e.taille,
                height: e.taille,
                color: clair ? "#FFF3DF" : "#ffffff",
              }}
            />
          ))}

          {diapo.stickers.map((s, i) => (
            <div
              key={i}
              data-sticker-zone={i}
              className={`absolute ${i ? "right-[-3%] bottom-[2%] lg:right-[-16%]" : "top-[8%] left-[-2%] lg:left-[-10%]"}`}
            >
              <div data-sticker data-intro>
                <Sticker
                  {...s}
                  rotation={i ? 12 : -10}
                  taille={i ? 128 : 150}
                  className={i ? "lg:size-[170px]!" : "lg:size-47.5!"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons, points, pause */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-4 pt-5 pb-6 lg:pb-5">
        <div
          data-fondu
          data-intro
          className="flex flex-wrap justify-center gap-3"
        >
          <button
            type="button"
            onClick={ajouterAuPanier}
            aria-label={`Ajouter ${produit.nom}${optionDefaut ? ` (${optionDefaut.label})` : ""} au panier, ${prixF(prix)}`}
            className={`origine inline-flex h-13 items-center gap-3 rounded-xl border-2 px-6 text-lg font-bold [--origine-fond:var(--color-tomate)] [--origine-texte:#fff] hover:border-tomate ${
              clair
                ? "border-white bg-white text-encre"
                : "border-charbon bg-charbon text-white"
            }`}
          >
            {ajoute ? (
              <>
                <IconeCoche className="size-5" /> Ajouté
              </>
            ) : (
              <>
                Ajouter{optionDefaut ? ` · ${optionDefaut.label}` : ""}
                <span className="rounded-lg bg-croute px-2 py-0.5 text-base text-encre">
                  <PrixAnime montant={prix} />
                </span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => defilerVers("#menu")}
            className={`origine inline-flex h-13 items-center gap-2 rounded-xl border-2 px-6 text-lg font-bold ${
              clair
                ? "border-white text-white [--origine-fond:#fff] [--origine-texte:var(--color-charbon)]"
                : "border-charbon text-charbon [--origine-fond:var(--color-charbon)] [--origine-texte:#fff]"
            }`}
          >
            Voir le menu <IconeFleche className="size-5" />
          </button>
        </div>

        <div
          data-fondu
          data-intro
          data-carrousel-nav
          className="flex items-center gap-3"
        >
          <ul className="flex items-center gap-1.5">
            {DIAPOS_HERO.map((d, i) => (
              <li key={d.produit}>
                <button
                  type="button"
                  onClick={() => aller(i, i > index ? 1 : -1, true)}
                  aria-label={`Afficher ${trouverProduit(d.produit)?.nom}`}
                  aria-current={i === index ? "true" : undefined}
                  className="grid h-6 place-items-center px-0.5"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${i === index ? "w-6" : "w-2 opacity-45"}`}
                    style={{
                      background: clair ? "#fff" : "var(--color-charbon)",
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
          {!mouvementReduit && (
            <button
              type="button"
              onClick={() => setPause((p) => !p)}
              aria-label={
                pause
                  ? "Reprendre le défilement automatique"
                  : "Mettre en pause le défilement automatique"
              }
              className={`grid size-7 place-items-center rounded-full border-2 ${clair ? "border-white text-white" : "border-charbon text-charbon"}`}
            >
              <svg
                viewBox="0 0 12 12"
                className="size-2.5"
                aria-hidden="true"
                fill="currentColor"
              >
                {pause ? (
                  <path d="M3 1.5v9l7-4.5z" />
                ) : (
                  <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      <BandeauDefilant />
    </section>
  );
}
