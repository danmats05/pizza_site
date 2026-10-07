import { CONFIG } from "@/data/config";
import { ZONES } from "@/data/zones";
import { prixF } from "@/lib/prix";
import { IconePaiement, IconePanier, IconeScooter } from "@/components/ui/Icones";

const ETAPES = [
  {
    titre: "Composez votre panier",
    texte: "Choisissez vos pizzas et leur taille, ajoutez une boisson ou un dessert.",
    Icone: IconePanier,
    cercle: "bg-croute text-charbon",
  },
  {
    titre: "Indiquez votre quartier",
    texte: "Les frais de livraison s'ajoutent tout de suite, selon votre quartier.",
    Icone: IconeScooter,
    cercle: "bg-tomate text-white",
  },
  {
    titre: "Validez votre commande",
    texte: "Choisissez votre moyen de paiement et confirmez. La pizzeria vous indique le délai.",
    Icone: IconePaiement,
    cercle: "bg-basilic-fonce text-white",
  },
];

/**
 * Bord festonné irrégulier : une suite d'arcs de largeurs et de hauteurs différentes, dans un repère 1000 × 70.
 * Chaque arc est [largeur, hauteur] ; la somme des largeurs fait 1000.
 */
function feston(arcs: [number, number][]) {
  const H = 70;
  let x = 0;
  let d = `M0,${H + 1} L0,${H}`;
  for (const [l, h] of arcs) {
    x += l;
    d += ` A${l / 2},${h} 0 0 1 ${x},${H}`;
  }
  return `${d} L1000,${H + 1} Z`;
}
const FESTON_LARGE = feston([
  [62, 26], [104, 52], [58, 22], [88, 64], [46, 30], [120, 46], [70, 58],
  [52, 24], [96, 66], [64, 34], [110, 50], [56, 28], [74, 44],
]);
const FESTON_MOBILE = feston([[150, 40], [110, 58], [170, 34], [120, 62], [160, 44], [130, 52], [160, 38]]);

// Quartiers regroupés par tarif, du moins cher au plus cher.
const PAR_TARIF = [...new Set(ZONES.map((z) => z.frais))]
  .sort((a, b) => a - b)
  .map((frais) => ({ frais, quartiers: ZONES.filter((z) => z.frais === frais).map((z) => z.nom) }));

/** Section « Commander en 3 étapes » : frise horizontale (verticale sur mobile), puis les quartiers livrés par tarif. */
export default function Steps() {
  return (
    <section id="livraison" aria-labelledby="titre-etapes" className="relative mt-16 bg-pate py-16 lg:py-24">
      {/* Bord festonné qui déborde sur la section du dessus (arcs irréguliers) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 71"
        preserveAspectRatio="none"
        className="absolute bottom-[calc(100%-1px)] left-0 hidden h-[56px] w-full fill-pate md:block lg:h-[70px]"
      >
        <path d={FESTON_LARGE} />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 71"
        preserveAspectRatio="none"
        className="absolute bottom-[calc(100%-1px)] left-0 h-[40px] w-full fill-pate md:hidden"
      >
        <path d={FESTON_MOBILE} />
      </svg>
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <p className="text-center font-semibold tracking-wide text-tomate">Simple et rapide</p>
        <h2 id="titre-etapes" className="titre mt-2 text-center text-[clamp(2.4rem,7vw,4.5rem)]">
          Commander en 3 étapes
        </h2>

        {/* Frise : la ligne en pointillés relie les cercles (horizontale sur desktop, verticale sur mobile) */}
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden="true"
            className="absolute top-12 bottom-12 left-12 border-l-2 border-dashed border-charbon/20 md:top-14 md:right-[16.66%] md:bottom-auto md:left-[16.66%] md:border-t-2 md:border-l-0"
          />
          {ETAPES.map(({ titre, texte, Icone, cercle }, i) => (
            <li key={titre} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
              <span className={`relative grid size-24 shrink-0 place-items-center rounded-full md:size-28 ${cercle}`}>
                <Icone className="size-10 md:size-12" />
                <span
                  aria-hidden="true"
                  className="titre absolute -top-1 -right-1 grid size-9 place-items-center rounded-full bg-charbon text-base text-white ring-4 ring-pate"
                >
                  {i + 1}
                </span>
              </span>
              <div className="pt-3 md:pt-6">
                <h3 className="titre text-2xl leading-[1.1]">
                  <span className="sr-only">Étape {i + 1} : </span>
                  {titre}
                </h3>
                <p className="mt-2 max-w-xs text-lg leading-snug text-charbon/75 md:mx-auto">{texte}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Quartiers livrés, regroupés par tarif */}
        <div className="mt-16 rounded-bloc bg-white p-6 shadow-douce-sm lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="titre text-2xl lg:text-3xl">Quartiers livrés</h3>
            <p className="text-charbon/65">Frais de livraison selon le quartier</p>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-charbon/10">
            {PAR_TARIF.map(({ frais, quartiers }) => (
              <div key={frais} className="sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <p className="inline-flex rounded-full bg-charbon px-3 py-1 text-sm font-semibold text-white tabular-nums">
                  {prixF(frais)}
                </p>
                <ul className="mt-3 space-y-1.5 text-lg font-semibold">
                  {quartiers.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 border-t border-charbon/10 pt-5 text-charbon/70">
            Votre quartier n&apos;est pas dans la liste ? Appelez-nous au{" "}
            <a href={`tel:${CONFIG.telephoneLien}`} className="font-semibold text-charbon underline underline-offset-2">
              {CONFIG.telephone}
            </a>{" "}
            avant de commander.
          </p>
        </div>
      </div>
    </section>
  );
}
