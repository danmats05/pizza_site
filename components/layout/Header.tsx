"use client";

import { photo } from "@/lib/images";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { CATEGORIES } from "@/data/categories";
import { CONFIG } from "@/data/config";
import { useBloquerScroll, useDefilerVers } from "@/lib/defiler";
import { IconeChevron, IconeFermer, IconeFleche, IconeMenu, IconeTelephone, IconeWhatsapp } from "@/components/ui/Icones";
import { LienBouton } from "@/components/ui/Button";
import { scrollIgnore, useInterface } from "@/store/interface";
import BoutonPanier from "./BoutonPanier";
import MegaMenu from "./MegaMenu";

const LIENS = [
  { ancre: "#livraison", label: "Livraison" },
  { ancre: "#contact", label: "Contact" },
];

export default function Header() {
  const idMega = useId();
  const idMobile = useId();
  const [megaOuvert, setMegaOuvert] = useState(false);
  const [mobileOuvert, setMobileOuvert] = useState(false);
  const zoneMega = useRef<HTMLDivElement>(null);
  const boutonMobile = useRef<HTMLButtonElement>(null);
  const panneauMobile = useRef<HTMLDivElement>(null);
  const minuterie = useRef<ReturnType<typeof setTimeout>>(undefined);
  const defilerVers = useDefilerVers();
  const headerCache = useInterface((e) => e.headerCache);
  const setHeaderCache = useInterface((e) => e.setHeaderCache);
  const megaOuvertRef = useRef(false);
  useEffect(() => {
    megaOuvertRef.current = megaOuvert;
    if (megaOuvert) setHeaderCache(false);
  }, [megaOuvert, setHeaderCache]);

  // Navbar cachée en descendant, visible en remontant (et toujours en haut de page).
  useEffect(() => {
    let dernier = window.scrollY;
    let image = 0;
    const surScroll = () => {
      cancelAnimationFrame(image);
      image = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - dernier;
        dernier = y;
        if (scrollIgnore() || megaOuvertRef.current) return;
        if (y < 120) setHeaderCache(false);
        else if (delta > 4) setHeaderCache(true);
        else if (delta < -4) setHeaderCache(false);
      });
    };
    window.addEventListener("scroll", surScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", surScroll);
      cancelAnimationFrame(image);
    };
  }, [setHeaderCache]);

  useBloquerScroll(mobileOuvert);

  // Échap ferme les menus ; clic à l'extérieur ferme le mega menu.
  useEffect(() => {
    if (!megaOuvert && !mobileOuvert) return;
    const clavier = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOuvert(false);
      if (mobileOuvert) {
        setMobileOuvert(false);
        boutonMobile.current?.focus();
      }
    };
    const clic = (e: PointerEvent) => {
      if (megaOuvert && !zoneMega.current?.contains(e.target as Node)) setMegaOuvert(false);
    };
    window.addEventListener("keydown", clavier);
    window.addEventListener("pointerdown", clic);
    return () => {
      window.removeEventListener("keydown", clavier);
      window.removeEventListener("pointerdown", clic);
    };
  }, [megaOuvert, mobileOuvert]);

  // Focus sur le premier lien à l'ouverture du menu mobile.
  useEffect(() => {
    if (mobileOuvert) panneauMobile.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, [mobileOuvert]);

  // Survol (souris seulement) : ouverture / fermeture avec un léger délai.
  const survol = (ouvrir: boolean) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(minuterie.current);
    minuterie.current = setTimeout(() => setMegaOuvert(ouvrir), ouvrir ? 80 : 220);
  };

  const aller = (ancre: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMegaOuvert(false);
    setMobileOuvert(false);
    // Laisse le menu mobile se fermer (et le scroll se débloquer) avant de défiler.
    requestAnimationFrame(() => defilerVers(ancre));
  };

  return (
    <header
      data-header
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-header px-2 pt-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:px-4 lg:pt-3 ${
        headerCache ? "-translate-y-[120%]" : ""
      }`}
    >
      <div className="pointer-events-auto relative mx-auto flex h-full max-w-[1500px] items-center gap-2 rounded-[20px] bg-charbon px-3 text-white shadow-douce lg:px-6">
        <a
          href="#haut"
          onClick={aller("#haut")}
          className="shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          <Image src="/images/logo.webp" alt={`${CONFIG.nom}, accueil`} width={286} height={187} priority className="h-12 w-auto lg:h-[3.4rem]" />
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          <div ref={zoneMega} onPointerEnter={survol(true)} onPointerLeave={survol(false)}>
            <button
              type="button"
              aria-expanded={megaOuvert}
              aria-controls={idMega}
              onClick={() => setMegaOuvert((o) => !o)}
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[1.05rem] font-bold transition-colors hover:bg-white/10 aria-expanded:bg-white/10"
            >
              Le menu
              <IconeChevron className={`size-4 transition-transform ${megaOuvert ? "rotate-180" : ""}`} />
            </button>
            <MegaMenu id={idMega} ouvert={megaOuvert} onFermer={() => setMegaOuvert(false)} />
          </div>
          {LIENS.map((l) => (
            <a
              key={l.ancre}
              href={l.ancre}
              onClick={aller(l.ancre)}
              className="inline-flex h-11 items-center rounded-full px-4 text-[1.05rem] font-bold transition-colors hover:bg-white/10"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <a
            href={`tel:${CONFIG.telephoneLien}`}
            className="origine hidden h-12 items-center gap-2 rounded-xl border-2 border-white px-4 font-bold [--origine-fond:#fff] [--origine-texte:var(--color-charbon)] md:inline-flex"
          >
            <IconeTelephone className="size-5" />
            Appeler
          </a>
          <BoutonPanier />
          <button
            ref={boutonMobile}
            type="button"
            aria-expanded={mobileOuvert}
            aria-controls={idMobile}
            aria-label={mobileOuvert ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMobileOuvert((o) => !o)}
            className="origine grid size-12 place-items-center rounded-xl border-2 border-white [--origine-fond:#fff] [--origine-texte:var(--color-charbon)] lg:hidden"
          >
            {mobileOuvert ? <IconeFermer className="size-5" /> : <IconeMenu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOuvert && (
        <div
          ref={panneauMobile}
          id={idMobile}
          className="pointer-events-auto fixed inset-x-0 top-header bottom-0 overflow-y-auto overscroll-contain bg-croute lg:hidden"
          data-lenis-prevent
        >
          <nav aria-label="Menu mobile" className="marge-securite-bas mx-auto flex max-w-xl flex-col gap-6 px-4 pt-6">
            <ul className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#cat-${c.id}`}
                    onClick={aller(`#cat-${c.id}`)}
                    className="enfonce flex h-full flex-col items-center gap-1 rounded-carte bg-white p-3 text-center shadow-douce-sm"
                  >
                    <span className="relative size-16">
                      <Image src={photo(c.vignette)} alt="" fill sizes="64px" className="object-contain mix-blend-multiply" />
                    </span>
                    <span className="titre text-lg">{c.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col border-y border-charbon/15">
              {LIENS.map((l) => (
                <li key={l.ancre} className="border-b border-charbon/15 last:border-0">
                  <a href={l.ancre} onClick={aller(l.ancre)} className="flex items-center justify-between py-4 text-2xl font-bold">
                    {l.label} <IconeFleche className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 pb-4">
              <LienBouton href={`tel:${CONFIG.telephoneLien}`} variante="noire" taille="lg">
                <IconeTelephone className="size-5" /> Appeler la pizzeria
              </LienBouton>
              <LienBouton href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" variante="claire" taille="lg">
                <IconeWhatsapp className="size-5" /> Écrire sur WhatsApp
              </LienBouton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
