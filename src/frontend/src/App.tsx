import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import ActiveSolarPanelMonitor from "./components/ActiveSolarPanelMonitor";
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
import SolarPanelLayoutPlanner from "./components/SolarPanelLayoutPlanner";
import SolarPanelSurvey from "./components/SolarPanelSurvey";
import Testimonials from "./components/Testimonials";
import WhatsAppChatbot from "./components/WhatsAppChatbot";
import WhyChooseUs from "./components/WhyChooseUs";

const queryClient = new QueryClient();

function CameraPermissionPrimer() {
  useEffect(() => {
    async function requestCamera() {
      if (!navigator.mediaDevices?.getUserMedia) return;

      if (navigator.permissions?.query) {
        try {
          const status = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          if (status.state === "granted") return;
          if (status.state === "prompt") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch {
          /* fall through */
        }
      }

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          for (const track of stream.getTracks()) track.stop();
        })
        .catch(() => {
          /* silently ignore */
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
          <SolarPanelLayoutPlanner />
          <SolarPanelSurvey />
          <ProductShowcase />
          <PriceList />
          <Documents />
          <SolarCalculator />
          <ActiveSolarPanelMonitor />
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
