import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";
import Services from "./components/Services";
import SolarCalculator from "./components/SolarCalculator";
import Testimonials from "./components/Testimonials";
import WhyChooseUs from "./components/WhyChooseUs";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <ProductShowcase />
          <SolarCalculator />
          <Services />
          <WhyChooseUs />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
