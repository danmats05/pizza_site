import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/hero/Hero";
import InfoBar from "@/components/info/InfoBar";
import Steps from "@/components/info/Steps";
import MenuSection from "@/components/menu/MenuSection";
import CartBar from "@/components/layout/CartBar";
import CartDrawer from "@/components/cart/CartDrawer";
import ProductSheet from "@/components/cart/ProductSheet";

export default function Accueil() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <InfoBar />
        <MenuSection />
        <Steps />
      </main>
      <Footer />
      <CartBar />
      <CartDrawer />
      <ProductSheet />
    </>
  );
}
