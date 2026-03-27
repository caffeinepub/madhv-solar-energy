import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Contact from "./components/Contact";
import Documents from "./components/Documents";
import FestivalBanner from "./components/FestivalBanner";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PriceList from "./components/PriceList";
import ProductShowcase from "./components/ProductShowcase";
import Services from "./components/Services";
import SiteSurvey from "./components/SiteSurvey";
import SolarCalculator from "./components/SolarCalculator";
import Testimonials from "./components/Testimonials";
import WhatsAppChatbot from "./components/WhatsAppChatbot";
import WhyChooseUs from "./components/WhyChooseUs";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Header />
        <FestivalBanner />
        <main>
          <Hero />
          <ProductShowcase />
          <PriceList />
          <Documents />
          <SolarCalculator />
          <SiteSurvey />
          <Services />
          <WhyChooseUs />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <WhatsAppChatbot />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
