"use client";

import { photo } from "@/lib/images";
import Image from "next/image";
import { memo, useEffect, useId, useRef, useState } from "react";
import { FILTRES } from "@/data/categories";
import { PHOTOS_SUR_FOND } from "@/data/photos";
import type { Produit } from "@/data/types";
import { prixF } from "@/lib/prix";
import { volerVersPanier } from "@/lib/voler";
import { usePanier } from "@/store/panier";
import { useInterface } from "@/store/interface";
import { persoPour } from "@/data/personnalisation";
import { Badge } from "@/components/ui/Badge";
import PrixAnime from "@/components/ui/PrixAnime";
import { IconeCoche, IconePlus } from "@/components/ui/Icones";
import SizeSelector from "./SizeSelector";

// Précisions affichées sur les cartes (la base tomate / crème se lit déjà dans les ingrédients).
const MENTIONS = FILTRES.filter((f) => ["poisson", "epice", "vege", "viande"].includes(f.id));

function ProductCard({ produit }: { produit: Produit }) {
  const idTitre = useId();
  const ajouter = usePanier((e) => e.ajouter);
  const ouvrirProduit = useInterface((e) => e.ouvrirProduit);
  // Pizzas, tacos, sandwichs… : le « + » ouvre la personnalisation. Boissons, desserts : ajout direct.
  const personnalisable = persoPour(produit).length > 0;
  const zoneImage = useRef<HTMLDivElement>(null);
  const minuterie = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [option, setOption] = useState(produit.type === "options" ? produit.options.defaut : undefined);
  const [choix, setChoix] = useState(() => produit.choix?.map((c) => c.liste[0]) ?? []);
  const [ajoute, setAjoute] = useState(false);

  useEffect(() => () => clearTimeout(minuterie.current), []);

  const prix = produit.type === "unique" ? produit.prix : produit.options.liste.find((o) => o.id === option)!.prix;
  const indispo = !produit.enStock;

  const auClic = () => {
    if (personnalisable) {
      ouvrirProduit({ id: produit.id, option, choix: choix.length ? choix : undefined });
      return;
    }
    ajouter(produit.id, option, choix.length ? choix : undefined);
    volerVersPanier(zoneImage.current, photo(produit.imgSm));
    setAjoute(true);
    clearTimeout(minuterie.current);
    minuterie.current = setTimeout(() => setAjoute(false), 1000);
  };

  return (
    <article
      id={`produit-${produit.id}`}
      data-arrivee
      aria-labelledby={idTitre}
      className={`group flex min-w-0 flex-col rounded-carte bg-white p-3 shadow-douce-sm transition-shadow duration-300 hover:shadow-douce ${indispo ? "opacity-60 grayscale" : ""}`}
    >
      <div ref={zoneImage} className="relative aspect-[4/3]">
        {produit.img ? (
          <Image
            src={photo(produit.img)}
            alt={produit.nom}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 92vw"
            className={`transition-transform duration-500 ease-out group-hover:scale-[1.05] ${
              PHOTOS_SUR_FOND.has(produit.img)
                ? // Photo avec décor (fond non retirable) : fondu sur les bords pour se poser sur la carte
                  "object-cover [mask-image:radial-gradient(ellipse_at_center,#000_50%,transparent_78%)]"
                : "object-contain"
            }`}
          />
        ) : (
          <span className="titre absolute inset-0 grid place-items-center text-4xl text-tomate/40">Pizza Time</span>
        )}
        {produit.badge && (
          <Badge couleur={produit.badge === "Populaire" ? "croute" : "basilic"} className="absolute top-1 left-1">
            {produit.badge}
          </Badge>
        )}
        {indispo && (
          <Badge couleur="blanc" className="absolute top-1 right-1 ring-1 ring-charbon/10">
            Rupture
          </Badge>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 px-1.5 pt-3 pb-0.5">
        <div>
          <h3 id={idTitre} className="titre text-[1.35rem] leading-[1.1]">
            {produit.nom}
          </h3>
          {/* Précisions (épicé, végétarien) avec les mêmes icônes que les filtres du menu */}
          {MENTIONS.some((f) => produit.tags.includes(f.id)) && (
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.85rem] font-semibold">
              {MENTIONS.filter((f) => produit.tags.includes(f.id)).map((f) => (
                <span key={f.id} className="inline-flex items-center gap-1.5">
                  <Image src={f.icone} alt="" width={48} height={48} unoptimized className="size-5 object-contain" />
                  {f.label}
                </span>
              ))}
            </p>
          )}
          {produit.desc && <p className="mt-2 text-[0.95rem] leading-snug text-charbon/70">{produit.desc}</p>}
        </div>

        <div className="mt-auto flex min-w-0 flex-col gap-3">
          {produit.choix?.map((c, i) => (
            <div key={c.titre} className="min-w-0">
              <p className="mb-1.5 text-xs font-semibold text-charbon/55">{c.titre}</p>
              <SizeSelector
                titre={`${c.titre} – ${produit.nom}`}
                liste={c.liste.map((x) => ({ id: x, label: x }))}
                valeur={choix[i]}
                onChange={(x) => setChoix((v) => v.map((y, j) => (j === i ? x : y)))}
                desactive={indispo}
              />
            </div>
          ))}

          {produit.type === "options" && (
            <div className="min-w-0">
              {/* Intitulé seulement s'il y a déjà un autre choix au-dessus (ex. parfum + contenance) */}
              {produit.choix && <p className="mb-1.5 text-xs font-semibold text-charbon/55">{produit.options.titre}</p>}
              <SizeSelector
                titre={`${produit.options.titre} – ${produit.nom}`}
                liste={produit.options.liste}
                valeur={option!}
                onChange={setOption}
                desactive={indispo}
              />
            </div>
          )}

          {/* Prix à gauche (suit l'option choisie), bouton rond « + » à droite */}
          <div className="flex items-center justify-between gap-3 border-t border-charbon/8 pt-3">
            <p
              className={`text-[1.45rem] leading-none font-bold tabular-nums ${indispo ? "text-charbon/50" : "text-charbon"}`}
            >
              {indispo ? "Indisponible" : <PrixAnime montant={prix} />}
            </p>
            <button
              type="button"
              onClick={auClic}
              disabled={indispo}
              aria-label={
                indispo
                  ? `${produit.nom} : indisponible`
                  : personnalisable
                    ? `Ajouter ${produit.nom} : choisir les options, à partir de ${prixF(prix)}`
                    : `Ajouter ${produit.nom} au panier, ${prixF(prix)}`
              }
              className={`enfonce grid size-11 shrink-0 place-items-center rounded-full text-white transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-charbon/20 ${
                ajoute ? "bg-basilic-fonce" : "bg-tomate hover:bg-tomate-fonce"
              }`}
            >
              {ajoute ? (
                <IconeCoche className="size-5" strokeWidth={2.6} />
              ) : (
                <IconePlus className="size-5" strokeWidth={2.6} />
              )}
            </button>
          </div>
          <span aria-live="polite" className="sr-only">
            {ajoute ? `${produit.nom} ajouté au panier` : ""}
          </span>
        </div>
      </div>
    </article>
  );
}

// Mémorisée : les filtres re-rendent la grille sans toucher aux cartes.
export default memo(ProductCard);
