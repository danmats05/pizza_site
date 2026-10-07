"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Choix en pastilles, en `radiogroup` : taille, formule, pièces (qui changent le prix) ou parfum, sauce…
 * L'option choisie est pleine, les autres sont juste cerclées. Flèches du clavier pour changer d'option.
 * Toujours sur une seule ligne : si elle déborde, elle défile horizontalement, avec un fondu sur le bord
 * où il reste des options cachées.
 */
export default function SizeSelector({
  titre,
  liste,
  valeur,
  onChange,
  desactive,
}: {
  titre: string;
  liste: { id: string; label: string }[];
  valeur: string;
  onChange: (id: string) => void;
  desactive?: boolean;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const ligne = useRef<HTMLDivElement>(null);
  const [bords, setBords] = useState({ gauche: false, droite: false });

  // Détecte s'il reste des options cachées à gauche ou à droite (au chargement, au redimensionnement, au défilement).
  useEffect(() => {
    const el = ligne.current!;
    const mesurer = () => {
      const gauche = el.scrollLeft > 2;
      const droite = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
      setBords((b) => (b.gauche === gauche && b.droite === droite ? b : { gauche, droite }));
    };
    mesurer();
    const obs = new ResizeObserver(mesurer);
    obs.observe(el);
    el.addEventListener("scroll", mesurer, { passive: true });
    return () => {
      obs.disconnect();
      el.removeEventListener("scroll", mesurer);
    };
  }, []);

  const fondu = `linear-gradient(to right, ${bords.gauche ? "transparent, #000 1.5rem" : "#000"}, ${
    bords.droite ? "#000 calc(100% - 1.5rem), transparent" : "#000"
  })`;

  const clavier = (e: React.KeyboardEvent, i: number) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const suivant = (i + delta + liste.length) % liste.length;
    onChange(liste[suivant].id);
    refs.current[suivant]?.focus();
    refs.current[suivant]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <div
      ref={ligne}
      role="radiogroup"
      aria-label={titre}
      className="sans-scrollbar -mx-1 flex gap-1.5 overflow-x-auto overscroll-x-contain px-1 py-1"
      style={{ maskImage: fondu, WebkitMaskImage: fondu }}
    >
      {liste.map((o, i) => {
        const actif = o.id === valeur;
        return (
          <button
            key={o.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={actif}
            tabIndex={actif ? 0 : -1}
            disabled={desactive}
            onClick={() => onChange(o.id)}
            onKeyDown={(e) => clavier(e, i)}
            className={`h-9 shrink-0 rounded-full px-3.5 text-sm focus-visible:outline-offset-[-3px] font-semibold whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ${
              actif
                ? "bg-charbon text-white"
                : "text-charbon ring-1 ring-charbon/15 ring-inset hover:ring-charbon/40"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
