import { CATEGORIES } from "@/data/categories";
import { IconeEtoile } from "@/components/ui/Icones";

/** Bandeau qui défile en continu en bas du hero (arrêté si mouvement réduit). */
export default function BandeauDefilant() {
  const mots = ["Votre pizza bien chaude, partout à Dakar", ...CATEGORIES.map((c) => c.label)];
  const serie = (cache: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={cache || undefined}>
      {mots.map((m) => (
        <li key={m} className="flex items-center">
          <span className="titre px-5 text-lg whitespace-nowrap sm:text-xl">{m}</span>
          <IconeEtoile className="size-5 shrink-0 text-tomate" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative z-10 mx-2 overflow-hidden rounded-t-[24px] bg-white py-3.5 lg:mx-4">
      <div className="flex w-max animate-defile motion-reduce:animate-none">
        {serie(false)}
        {serie(true)}
      </div>
    </div>
  );
}
