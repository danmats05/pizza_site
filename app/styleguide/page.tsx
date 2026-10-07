import type { Metadata } from "next";
import { Geist, Instrument_Sans, Onest, Outfit, Schibsted_Grotesk } from "next/font/google";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { FILTRES } from "@/data/categories";
import { PictoFiltre } from "@/components/menu/PictoFiltre";

// Page temporaire de validation du design system. À retirer avant la mise en ligne.
export const metadata: Metadata = { title: "Styleguide · Pizza Time", robots: { index: false } };

// Polices candidates pour le texte courant, chargées uniquement sur cette page pour comparer.
const geist = Geist({ subsets: ["latin"] });
const onest = Onest({ subsets: ["latin"] });
const instrument = Instrument_Sans({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"] });

const POLICES = [
  { nom: "Figtree (actuelle)", classe: "font-sans" },
  { nom: "Geist", classe: geist.className },
  { nom: "Onest", classe: onest.className },
  { nom: "Instrument Sans", classe: instrument.className },
  { nom: "Outfit", classe: outfit.className },
  { nom: "Schibsted Grotesk", classe: schibsted.className },
];

const COULEURS = [
  { nom: "Tomate", classe: "bg-tomate", hex: "#D7282F" },
  { nom: "Tomate foncé", classe: "bg-tomate-fonce", hex: "#A81C22" },
  { nom: "Basilic", classe: "bg-basilic", hex: "#2F8F46" },
  { nom: "Basilic foncé", classe: "bg-basilic-fonce", hex: "#23703A" },
  { nom: "Croûte", classe: "bg-croute", hex: "#F4B63F" },
  { nom: "Charbon", classe: "bg-charbon", hex: "#1D1818" },
  { nom: "Pâte", classe: "bg-pate", hex: "#FFF3DF" },
  { nom: "Farine", classe: "bg-farine ring-1 ring-charbon/10 ring-inset", hex: "#FFFAF1" },
];

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="rounded-bloc bg-white p-6 shadow-douce-sm lg:p-8">
      <h2 className="titre mb-6 text-3xl">{titre}</h2>
      {children}
    </section>
  );
}

export default function Styleguide() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12">
      <h1 className="titre text-6xl">Design system</h1>

      <Bloc titre="Police du texte courant : à choisir">
        <p className="mb-6 text-charbon/70">
          Même texte dans chaque police, à côté d&apos;un titre en Ultra. Dites-moi laquelle vous préférez.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {POLICES.map((p) => (
            <article key={p.nom} className="rounded-carte bg-farine p-5">
              <p className="mb-3 text-xs font-bold tracking-wide text-tomate">{p.nom}</p>
              <p className="titre text-3xl">La Reine</p>
              <div className={p.classe}>
                <p className="mt-2 text-[0.95rem] leading-snug text-charbon/70">Sauce tomate, fromage, jambon, champignons</p>
                <p className="mt-3 text-lg font-semibold">Ajouter au panier · 7 500 F</p>
                <p className="mt-1 text-base">
                  Choisissez votre pizza et sa taille, indiquez votre quartier, validez votre commande.
                </p>
              </div>
            </article>
          ))}
        </div>
      </Bloc>

      <Bloc titre="Couleurs">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {COULEURS.map((c) => (
            <li key={c.nom}>
              <div className={`h-20 rounded-carte ${c.classe}`} />
              <p className="mt-2 font-semibold">{c.nom}</p>
              <p className="text-sm text-charbon/60">{c.hex}</p>
            </li>
          ))}
        </ul>
      </Bloc>

      <Bloc titre="Boutons">
        <div className="flex flex-wrap items-center gap-4">
          <Button variante="principale">Ajouter au panier</Button>
          <Button variante="noire">Commander</Button>
          <Button variante="jaune">Voir le menu</Button>
          <Button variante="claire">Appeler la pizzeria</Button>
          <Button variante="principale" disabled>
            Indisponible
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button taille="sm">Petit</Button>
          <Button taille="md">Moyen</Button>
          <Button taille="lg">Grand</Button>
        </div>
      </Bloc>

      <Bloc titre="Badges, filtres et stickers">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Populaire</Badge>
          <Badge couleur="basilic">Nouveau</Badge>
          <Badge couleur="tomate">Épicé</Badge>
          <Badge couleur="blanc" className="ring-1 ring-charbon/10">
            Rupture
          </Badge>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          {FILTRES.map((f) => (
            <span key={f.id} className="flex items-center gap-2 font-semibold">
              <PictoFiltre filtre={f.id} className="size-12" /> {f.label}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-8">
          <Sticker tour="On livre chez vous" centre="Dakar" />
          <Sticker tour="Pizza du moment" centre="Time" couleur="basilic" rotation={-6} />
          <Sticker tour="Base crème fraîche" centre="Crème" couleur="blanc" rotation={4} />
          <Sticker tour="Merguez pepperoni" centre="Épicée" couleur="tomate" rotation={-3} />
        </div>
      </Bloc>

      <Bloc titre="Ombres et rayons">
        <div className="flex flex-wrap gap-6">
          {["shadow-douce-sm", "shadow-douce", "shadow-douce-lg"].map((s) => (
            <div key={s} className={`grid size-28 place-items-center rounded-carte bg-white text-sm font-semibold ${s}`}>
              {s.replace("shadow-", "")}
            </div>
          ))}
        </div>
      </Bloc>
    </main>
  );
}
