"use client";

import Image from "next/image";
import { CATEGORIES } from "@/data/categories";
import { CONFIG } from "@/data/config";
import { horairesTexte } from "@/lib/horaires";
import { useDefilerVers } from "@/lib/defiler";
import { useStatut } from "@/lib/statut";
import {
  IconeFacebook,
  IconeFleche,
  IconeInstagram,
  IconePin,
  IconeTelephone,
  IconeTiktok,
} from "@/components/ui/Icones";

const RESEAUX = [
  { nom: "Instagram", url: CONFIG.reseaux.instagram, Icone: IconeInstagram },
  { nom: "Facebook", url: CONFIG.reseaux.facebook, Icone: IconeFacebook },
  { nom: "TikTok", url: CONFIG.reseaux.tiktok, Icone: IconeTiktok },
];

// Pizzas détourées du hero, empilées de gauche à droite dans le footer.
const PIZZAS_DECOR = [
  { src: "/images/hero/la-4-fromages.webp", rotation: -8, decalage: "0px" },
  { src: "/images/hero/la-mexicaine.webp", rotation: 14, decalage: "-6px" },
  { src: "/images/hero/la-chicago.webp", rotation: -4, decalage: "10px" },
  { src: "/images/hero/la-reine.webp", rotation: 10, decalage: "-4px" },
];

const TITRE = "mb-4 text-sm font-semibold tracking-wide text-croute";
const LIEN = "transition-colors hover:text-croute";

export default function Footer() {
  const statut = useStatut();
  const defilerVers = useDefilerVers();
  const aller = (ancre: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    defilerVers(ancre);
  };

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-charbon pb-28 text-white lg:pb-10"
    >
      {/* ---------- Appel à commander ---------- */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-16">
          <div className="relative z-10 max-w-xl">
            <p className="titre text-[clamp(2.4rem,6vw,4rem)]">
              Une petite faim&nbsp;?
            </p>
            <p className="mt-3 text-lg text-white/70">
              Choisissez votre pizza, on s&apos;occupe du reste. Livraison
              partout à Dakar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#menu"
                onClick={aller("#menu")}
                className="origine inline-flex h-13 items-center gap-2 rounded-xl bg-tomate px-6 text-lg font-bold [--origine-fond:#fff] [--origine-texte:var(--color-charbon)]"
              >
                Voir le menu <IconeFleche className="size-5" />
              </a>
              <a
                href={`tel:${CONFIG.telephoneLien}`}
                className="origine inline-flex h-13 items-center gap-2 rounded-xl border-2 border-white/30 px-6 text-lg font-bold [--origine-fond:#fff] [--origine-texte:var(--color-charbon)]"
              >
                <IconeTelephone className="size-5" /> Appeler
              </a>
            </div>
          </div>
          {/* Pizzas empilées en décor : chacune passe devant la précédente, légers décalages verticaux */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-[max(1.5rem,calc((100%-80rem)/2+1.5rem))] hidden -translate-y-1/2 items-center [--p:9.5rem] lg:flex xl:[--p:16rem] 2xl:[--p:16rem]"
          >
            {PIZZAS_DECOR.map((p, i) => (
              <Image
                key={p.src}
                src={p.src}
                alt=""
                width={560}
                height={560}
                className="size-(--p) shrink-0 object-contain drop-shadow-[-12px_14px_18px_rgba(0,0,0,0.45)] not-first:-ml-[calc(var(--p)*0.55)]"
                style={{
                  zIndex: i,
                  rotate: `${p.rotation}deg`,
                  translate: `0 ${p.decalage}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Colonnes ---------- */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-14 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_0.8fr] lg:px-6">
        <nav aria-label="Le menu">
          <h2 className={TITRE}>Le menu</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-lg font-semibold">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <a
                  href={`#cat-${c.id}`}
                  onClick={aller(`#cat-${c.id}`)}
                  className={LIEN}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={TITRE}>Horaires</h2>
          <p
            className="flex items-center gap-2 text-lg font-semibold"
            aria-live="polite"
          >
            <span
              aria-hidden="true"
              className={`size-2.5 rounded-full ${statut ? (statut.ouvert ? "bg-[#7dff9a]" : "bg-croute") : "bg-white/40"}`}
            />
            {statut
              ? statut.ouvert
                ? "Ouvert maintenant"
                : "Fermé pour le moment"
              : "Tous les jours"}
          </p>
          <p className="mt-1 text-white/70">
            Tous les jours, {horairesTexte()}
          </p>

          <h2 className={`${TITRE} mt-8`}>Adresse</h2>
          <p className="flex gap-2 text-lg leading-snug">
            <IconePin className="mt-1 size-5 shrink-0 text-white/70" />
            {CONFIG.adresse}
          </p>
        </div>

        <div>
          <h2 className={TITRE}>Contact</h2>
          <ul className="space-y-3 text-lg">
            <li>
              <a
                href={`tel:${CONFIG.telephoneLien}`}
                className={`inline-flex items-center gap-2 ${LIEN}`}
              >
                <IconeTelephone className="size-5" /> {CONFIG.telephone}
              </a>
            </li>
          </ul>
          <h2 className={`${TITRE} mt-8`}>Paiement</h2>
          <p className="text-lg">{CONFIG.paiements.join(" · ")}</p>
        </div>

        <div>
          <h2 className={TITRE}>Suivez-nous</h2>
          <ul className="flex gap-3">
            {RESEAUX.map(({ nom, url, Icone }) => (
              <li key={nom}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nom}
                  className="origine grid size-12 place-items-center rounded-full bg-white/10 [--origine-fond:var(--color-croute)] [--origine-texte:var(--color-charbon)]"
                >
                  <Icone className="size-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grand logotype, façon signature de fin de page */}
      <p
        aria-hidden="true"
        className="titre mt-16 px-4 text-center text-[clamp(2.4rem,11.5vw,13rem)] leading-[0.85] whitespace-nowrap select-none"
      >
        <span className="text-[#3fb760]">Pizza</span>{" "}
        <span className="text-tomate">Time</span>
      </p>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-4 pt-6 text-sm text-white/60 sm:flex-row sm:justify-between lg:px-6">
        <p>
          © {CONFIG.nom} {CONFIG.ville}
        </p>
        <p>
          Refonte non officielle, réalisée à titre de démonstration. Icônes{" "}
          <a
            href="https://icons8.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white"
          >
            Icons8
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
