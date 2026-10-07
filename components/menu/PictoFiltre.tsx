import Image from "next/image";
import { FILTRES } from "@/data/categories";
import type { FiltreId } from "@/data/types";

/** Picto d'un filtre (icône en couleur) sur une pastille ronde, teinte claire de l'icône. */
export function PictoFiltre({ filtre, className = "" }: { filtre: FiltreId; className?: string }) {
  const f = FILTRES.find((x) => x.id === filtre)!;
  return (
    <span className={`grid shrink-0 place-items-center rounded-full ${className}`} style={{ background: f.fond }} aria-hidden="true">
      <Image src={f.icone} alt="" width={48} height={48} unoptimized className="size-[64%] object-contain" />
    </span>
  );
}
