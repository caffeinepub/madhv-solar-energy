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

function AllPermissionsPrimer() {
  useEffect(() => {
    // ── 1. CAMERA permission ──────────────────────────────────
    async function requestCamera() {
      if (!navigator.mediaDevices?.getUserMedia) return;
      try {
        if (navigator.permissions?.query) {
          const status = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          if (status.state === "granted") return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        for (const track of stream.getTracks()) track.stop();
      } catch {
        /* user denied or not supported – silently ignore */
      }
    }

    // ── 2. MICROPHONE permission (bonus) ──────────────────────
    async function requestMicrophone() {
      if (!navigator.mediaDevices?.getUserMedia) return;
      try {
        if (navigator.permissions?.query) {
          const status = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });
          if (status.state === "granted") return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        for (const track of stream.getTracks()) track.stop();
      } catch {
        /* silently ignore */
      }
    }

    // ── 3. GEOLOCATION (GPS) permission ──────────────────────
    function requestGeolocation() {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        () => {
          /* success – location granted */
        },
        () => {
          /* denied or error – silently ignore */
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }

    // ── 4. DEVICE ORIENTATION (tilt / compass) permission ────
    async function requestDeviceOrientation() {
      // iOS 13+ requires explicit permission request
      type DOE = typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      const DOE = DeviceOrientationEvent as unknown as DOE;
      if (typeof DOE.requestPermission === "function") {
        try {
          await DOE.requestPermission();
        } catch {
          /* denied – silently ignore */
        }
      }
      // Android / desktop – just listen once to activate the sensor
      const handler = () =>
        window.removeEventListener("deviceorientation", handler);
      window.addEventListener("deviceorientation", handler, { once: true });
    }

    // ── 5. DEVICE MOTION (accelerometer) permission ──────────
    async function requestDeviceMotion() {
      type DME = typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      const DME = DeviceMotionEvent as unknown as DME;
      if (typeof DME.requestPermission === "function") {
        try {
          await DME.requestPermission();
        } catch {
          /* denied – silently ignore */
        }
      }
    }

    // Fire all requests with a small stagger so browser dialogs don't collide
    requestCamera();
    setTimeout(requestGeolocation, 500);
    setTimeout(requestDeviceOrientation, 1000);
    setTimeout(requestDeviceMotion, 1500);
    setTimeout(requestMicrophone, 2000);
  }, []);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AllPermissionsPrimer />
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
