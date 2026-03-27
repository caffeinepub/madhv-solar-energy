import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import AirPollutionTracker from "./components/AirPollutionTracker";
import Contact from "./components/Contact";
import Documents from "./components/Documents";
import FestivalBanner from "./components/FestivalBanner";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MadhavPhotoCapture from "./components/MadhavPhotoCapture";
import PriceList from "./components/PriceList";
import ProductShowcase from "./components/ProductShowcase";
import Services from "./components/Services";
import SiteSurvey from "./components/SiteSurvey";
import SolarCalculator from "./components/SolarCalculator";
import Testimonials from "./components/Testimonials";
import WhatsAppChatbot from "./components/WhatsAppChatbot";
import WhyChooseUs from "./components/WhyChooseUs";

const queryClient = new QueryClient();

function CameraPermissionPrimer() {
  useEffect(() => {
    async function requestCamera() {
      if (!navigator.mediaDevices?.getUserMedia) return;

      // Check current permission state if Permissions API is available
      if (navigator.permissions?.query) {
        try {
          const status = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          if (status.state === "granted") {
            // Already granted — no need to prompt again
            return;
          }
          if (status.state === "prompt") {
            // Wait 1 second then request to ensure browser dialog shows early
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
          // For "denied", fall through and try anyway (will silently fail)
        } catch {
          // Permissions API not fully supported; fall through to direct request
        }
      }

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          for (const track of stream.getTracks()) track.stop();
        })
        .catch(() => {
          /* silently ignore — user may deny */
        });
    }

    requestCamera();
  }, []);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CameraPermissionPrimer />
      <div className="min-h-screen">
        <Header />
        <FestivalBanner />
        <main>
          <Hero />
          <MadhavPhotoCapture />
          <ProductShowcase />
          <PriceList />
          <Documents />
          <SolarCalculator />
          <SiteSurvey />
          <AirPollutionTracker />
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
