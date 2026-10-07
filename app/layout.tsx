import type { Metadata, Viewport } from "next";
import { Figtree, Ultra } from "next/font/google";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/providers/SmoothScroll";
import OrigineBoutons from "@/components/OrigineBoutons";
import { CONFIG } from "@/data/config";

const ultra = Ultra({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ultra",
});

// Polices du texte courant en essai. Bighorn par défaut ; ?police=tommy ou ?police=figtree pour comparer.
// ⚠️ MADE TOMMY et Bighorn : licences « usage personnel » — licence commerciale à acheter avant la mise en ligne.
const tommy = localFont({
  src: [
    {
      path: "./fonts/made-tommy/MADE TOMMY Light_PERSONAL USE.otf",
      weight: "300",
    },
    {
      path: "./fonts/made-tommy/MADE TOMMY Regular_PERSONAL USE.otf",
      weight: "400",
    },
    {
      path: "./fonts/made-tommy/MADE TOMMY Medium_PERSONAL USE.otf",
      weight: "500",
    },
    {
      path: "./fonts/made-tommy/MADE TOMMY Bold_PERSONAL USE.otf",
      weight: "600",
    },
    {
      path: "./fonts/made-tommy/MADE TOMMY ExtraBold_PERSONAL USE.otf",
      weight: "700",
    },
  ],
  display: "swap",
  variable: "--font-tommy",
});

const bighorn = localFont({
  src: [
    { path: "./fonts/bighorn/Bighorn.otf", weight: "400", style: "normal" },
    {
      path: "./fonts/bighorn/Bighorn Italic.otf",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-bighorn",
});

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

// Essai temporaire : lit ?police=… avant le premier affichage (voir html[data-police] dans globals.css).
const SCRIPT_POLICE = `try{var p=new URLSearchParams(location.search).get("police");if(p)document.documentElement.dataset.police=p}catch(e){}`;

// Masque les éléments animés du hero avant le premier affichage (voir .intro dans globals.css).
const SCRIPT_INTRO = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var h=document.documentElement;h.classList.add("intro");setTimeout(function(){h.classList.remove("intro")},4000)}}catch(e){}`;

const titre = `${CONFIG.nom} ${CONFIG.ville} : commande de pizzas en ligne`;
const description =
  "Commandez vos pizzas, tacos et tex-mex en ligne. Choisissez votre taille, indiquez votre quartier et validez en quelques clics. Livraison partout à Dakar.";

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.url),
  title: titre,
  description,
  icons: {
    icon: "/images/logo.webp",
  },
  openGraph: {
    title: titre,
    description,
    locale: "fr_SN",
    type: "website",
    siteName: CONFIG.nom,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#D7282F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : les scripts ci-dessous modifient <html> (classe « intro », data-police) avant l'hydratation.
    <html
      lang="fr"
      className={`${ultra.variable} ${tommy.variable} ${bighorn.variable} ${figtree.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_INTRO }} />
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_POLICE }} />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <OrigineBoutons />
      </body>
    </html>
  );
}
