import { useCamera } from "@/camera/useCamera";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  CheckCircle,
  Download,
  Home,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  RotateCcw,
  Sun,
  Upload,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

const GUJARAT_CITIES = [
  "AMRELI",
  "RAJKOT",
  "JAMNAGAR",
  "JUNAGADH",
  "SURENDRANAGAR",
  "MORBI",
  "PORBANDAR",
  "BHAVNAGAR",
  "VERAVAL",
  "GONDAL",
  "JETPUR",
  "DWARKA",
  "BOTAD",
  "MAHUVA",
  "UPLETA",
];

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  AMRELI: { lat: 21.6035, lng: 71.2219 },
  RAJKOT: { lat: 22.3039, lng: 70.8022 },
  JAMNAGAR: { lat: 22.4707, lng: 70.0577 },
  JUNAGADH: { lat: 21.5222, lng: 70.4579 },
  SURENDRANAGAR: { lat: 22.7272, lng: 71.6483 },
  MORBI: { lat: 22.8173, lng: 70.8368 },
  PORBANDAR: { lat: 21.6423, lng: 69.6293 },
  BHAVNAGAR: { lat: 21.7645, lng: 72.1519 },
  VERAVAL: { lat: 20.9074, lng: 70.3629 },
  GONDAL: { lat: 21.9609, lng: 70.7964 },
  JETPUR: { lat: 21.7553, lng: 70.6243 },
  DWARKA: { lat: 22.2442, lng: 68.9685 },
  BOTAD: { lat: 22.1693, lng: 71.6648 },
  MAHUVA: { lat: 21.0839, lng: 71.7616 },
  UPLETA: { lat: 21.7381, lng: 70.2801 },
};

function findNearestCity(lat: number, lng: number): string {
  let nearest = "AMRELI";
  let minDist = Number.POSITIVE_INFINITY;
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    const dist = Math.sqrt((lat - coords.lat) ** 2 + (lng - coords.lng) ** 2);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }
  return nearest;
}

const PGVCL_SLABS = [
  { limit: 50, rate: 3.55 },
  { limit: 100, rate: 4.1 },
  { limit: 200, rate: 5.2 },
  { limit: 400, rate: 5.95 },
  { limit: Number.POSITIVE_INFINITY, rate: 7.1 },
];

function calcSolarPlan(monthlyBill: number) {
  if (!monthlyBill || monthlyBill <= 0) return null;
  let units = monthlyBill / 5;
  for (let i = 0; i < 10; i++) {
    let bill = 0;
    let rem = units;
    let prev = 0;
    for (const slab of PGVCL_SLABS) {
      const slabUnits = Math.min(rem, slab.limit - prev);
      if (slabUnits <= 0) break;
      bill += slabUnits * slab.rate;
      rem -= slabUnits;
      prev = slab.limit;
      if (rem <= 0) break;
    }
    units = units * (monthlyBill / bill);
  }
  const solarUnits = units;
  const systemKW = solarUnits / 100;
  const baseCost = systemKW * 60000;
  let subsidy = 0;
  if (systemKW <= 2) {
    subsidy = systemKW * 30000;
  } else if (systemKW <= 3) {
    subsidy = 2 * 30000 + (systemKW - 2) * 18000;
  } else {
    subsidy = 78000;
  }
  const finalCost = baseCost - subsidy;
  const monthlySavings = monthlyBill * 0.8;
  const yearlySavings = monthlySavings * 12;
  const payback = finalCost / yearlySavings;
  return {
    systemKW: +systemKW.toFixed(1),
    baseCost: Math.round(baseCost),
    subsidy: Math.round(subsidy),
    finalCost: Math.round(finalCost),
    monthlySavings: Math.round(monthlySavings),
    yearlySavings: Math.round(yearlySavings),
    payback: +payback.toFixed(1),
  };
}

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { label: "Location", icon: MapPin },
    { label: "Camera", icon: Camera },
    { label: "Details", icon: Zap },
    { label: "Plan", icon: Sun },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => {
        const stepKey = s.label;
        const Icon = s.icon;
        const active = i + 1 === current;
        const done = i + 1 < current;
        return (
          <div key={stepKey} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  done
                    ? "bg-green-500 text-white"
                    : active
                      ? "bg-orange-500 text-white shadow-lg scale-110"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${active ? "text-orange-600" : done ? "text-green-600" : "text-gray-400"}`}
              >
                {s.label}
              </span>
            </div>
            {i < 3 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-1 mb-4 transition-all ${done ? "bg-green-400" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Step 1: Location
function Step1Location({
  onNext,
}: {
  onNext: (city: string, source: "gps" | "manual") => void;
}) {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"gps" | "manual">("manual");

  const detect = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        const city = findNearestCity(lat, lng);
        setDetectedCity(city);
        setSelectedCity(city);
        setSource("gps");
        setLoading(false);
      },
      (err) => {
        setError("Could not detect location. Please select city manually.");
        setLoading(false);
        console.error(err);
      },
      { timeout: 10000 },
    );
  };

  const canProceed = selectedCity !== "";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white mb-2">
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          Detect Your Location
        </h3>
        <p className="text-gray-500 text-sm">
          We'll find the nearest PGVCL service area for accurate calculations
        </p>
      </div>

      <Button
        data-ocid="survey.location.button"
        onClick={detect}
        disabled={loading}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 w-5 h-5 animate-spin" /> Detecting...
          </>
        ) : (
          <>
            <MapPin className="mr-2 w-5 h-5" /> Detect My Location
          </>
        )}
      </Button>

      {coords && detectedCity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
        >
          <Badge className="bg-green-100 text-green-700 border-green-300 mb-2">
            📍 GPS Detected
          </Badge>
          <p className="text-sm text-gray-500">
            {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
          </p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {detectedCity}
          </p>
        </motion.div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">
          {detectedCity ? "Override City (Optional)" : "Select Your City"}
        </Label>
        <Select
          value={selectedCity}
          onValueChange={(v) => {
            setSelectedCity(v);
            if (v !== detectedCity) setSource("manual");
            else setSource("gps");
          }}
        >
          <SelectTrigger
            data-ocid="survey.location.select"
            className="h-12 rounded-xl"
          >
            <SelectValue placeholder="Select Gujarat PGVCL City..." />
          </SelectTrigger>
          <SelectContent>
            {GUJARAT_CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        data-ocid="survey.location.next_button"
        onClick={() => onNext(selectedCity, source)}
        disabled={!canProceed}
        className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
      >
        Next: Take Site Photo →
      </Button>
    </div>
  );
}

// Step 2: Camera
function Step2Camera({
  onNext,
  onBack,
}: {
  onNext: (photo: string) => void;
  onBack: () => void;
}) {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: "environment",
    quality: 0.85,
    format: "image/jpeg",
  });
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedPhoto(url);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedPhoto(url);
    }
  };

  const showOptions = !isActive && !isLoading && !capturedPhoto;

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white mb-2">
          <Camera className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Site Photo</h3>
        <p className="text-gray-500 text-sm">
          📸 Take or upload a photo of your rooftop or installation area
        </p>
      </div>

      {isSupported === false ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center text-yellow-700">
          Camera not supported on this browser. You can upload a photo or skip
          this step.
        </div>
      ) : capturedPhoto ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="relative rounded-2xl overflow-hidden border-4 border-green-400 shadow-lg">
            <img
              src={capturedPhoto}
              alt="Site"
              className="w-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500 text-white">✓ Photo Ready</Badge>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {/* Camera preview when active */}
          {(isActive || isLoading) && (
            <div
              className="relative rounded-2xl overflow-hidden bg-black shadow-lg"
              style={{ minHeight: "240px" }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ minHeight: "240px", maxHeight: "360px" }}
                playsInline
                muted
                autoPlay
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
              {error.message}
            </div>
          )}

          {/* Side-by-side options when camera not active */}
          {showOptions && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                data-ocid="survey.camera.start_button"
                onClick={startCamera}
                className="h-20 flex-col gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold"
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm">Open Camera</span>
              </Button>

              <Button
                data-ocid="survey.camera.upload_button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="h-20 flex-col gap-2 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold"
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm">Upload Photo</span>
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {/* Capture button when camera is active */}
          {isActive && (
            <Button
              data-ocid="survey.camera.capture_button"
              onClick={handleCapture}
              disabled={!isActive || isLoading}
              className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
            >
              <Camera className="mr-2 w-4 h-4" /> Take Photo
            </Button>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          data-ocid="survey.camera.back_button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12 rounded-xl"
        >
          ← Back
        </Button>
        {capturedPhoto ? (
          <>
            <Button
              data-ocid="survey.camera.retake_button"
              variant="outline"
              onClick={handleRetake}
              className="flex-1 h-12 rounded-xl border-blue-300 text-blue-600"
            >
              <RefreshCw className="mr-1 w-4 h-4" /> Retake
            </Button>
            <Button
              data-ocid="survey.camera.next_button"
              onClick={() => onNext(capturedPhoto)}
              className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
            >
              Next →
            </Button>
          </>
        ) : (
          <Button
            data-ocid="survey.camera.skip_button"
            variant="outline"
            onClick={() => onNext("")}
            className="flex-1 h-12 rounded-xl text-gray-500"
          >
            Skip →
          </Button>
        )}
      </div>
    </div>
  );
}

// Step 3: System Details
function Step3Details({
  onNext,
  onBack,
}: {
  onNext: (bill: number) => void;
  onBack: () => void;
}) {
  const [bill, setBill] = useState("");
  const plan = bill ? calcSolarPlan(Number(bill)) : null;

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white mb-2">
          <Zap className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">System Details</h3>
        <p className="text-gray-500 text-sm">
          Enter your monthly bill for instant estimates
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 font-semibold">
          Monthly Electricity Bill (₹)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
            ₹
          </span>
          <Input
            data-ocid="survey.details.input"
            type="number"
            placeholder="e.g. 3000"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            className="h-14 pl-8 text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-orange-400"
          />
        </div>
      </div>

      <AnimatePresence>
        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">System Size</p>
              <p className="text-xl font-bold text-blue-700">
                {plan.systemKW} kW
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Base Cost</p>
              <p className="text-lg font-bold text-gray-700">
                {fmt(plan.baseCost)}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Subsidy</p>
              <p className="text-lg font-bold text-green-600">
                -{fmt(plan.subsidy)}
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Final Cost</p>
              <p className="text-lg font-bold text-orange-700">
                {fmt(plan.finalCost)}
              </p>
            </div>
            <div className="col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Monthly Savings</p>
              <p className="text-2xl font-bold text-emerald-600">
                {fmt(plan.monthlySavings)}/mo
              </p>
              <p className="text-xs text-emerald-500">
                Payback: {plan.payback} years
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <Button
          data-ocid="survey.details.back_button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12 rounded-xl"
        >
          ← Back
        </Button>
        <Button
          data-ocid="survey.details.next_button"
          onClick={() => onNext(Number(bill))}
          disabled={!plan}
          className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
        >
          Generate Plan →
        </Button>
      </div>
    </div>
  );
}

// Step 4: Plan Card
function Step4Plan({
  city,
  citySource,
  photo,
  bill,
  onStartOver,
}: {
  city: string;
  citySource: "gps" | "manual";
  photo: string;
  bill: number;
  onStartOver: () => void;
}) {
  const plan = calcSolarPlan(bill)!;
  const planRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    window.print();
  };

  const whatsappText = encodeURIComponent(
    `Hi, I want a solar plan for ${city}, Gujarat. System size: ${plan.systemKW}kW, Monthly savings: ${fmt(plan.monthlySavings)}`,
  );
  const whatsappUrl = `https://wa.me/919428787879?text=${whatsappText}`;

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-2">
          <Sun className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Your Solar Plan</h3>
        <p className="text-gray-500 text-sm">
          Ready to go solar? Here's your personalized plan
        </p>
      </div>

      {/* Plan Card */}
      <div
        ref={planRef}
        data-ocid="survey.plan.card"
        className="rounded-2xl overflow-hidden border-2 border-orange-200 shadow-xl bg-white print:shadow-none"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sun className="w-5 h-5 text-yellow-300" />
            <span className="font-bold text-lg">MADHV SOLAR ENERGY</span>
            <Sun className="w-5 h-5 text-yellow-300" />
          </div>
          <p className="text-xs text-green-200">
            Authorized Waaree Franchise Partner
          </p>
        </div>

        {/* Site Photo */}
        {photo ? (
          <div className="relative h-44 overflow-hidden bg-gray-100">
            <img
              src={photo}
              alt="Site"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">
              Site Survey Photo
            </div>
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Home className="w-10 h-10 mx-auto mb-1 opacity-40" />
              <p className="text-xs">No site photo captured</p>
            </div>
          </div>
        )}

        {/* Location */}
        <div className="px-4 pt-3 pb-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="font-bold text-gray-800">{city}, Gujarat</span>
            </div>
            <Badge
              className={
                citySource === "gps"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }
            >
              {citySource === "gps" ? "📍 GPS" : "✏️ Manual"}
            </Badge>
          </div>
        </div>

        {/* Numbers */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">System Recommended</p>
            <p className="text-2xl font-black text-blue-700">
              {plan.systemKW} kW
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Total Cost (after subsidy)</p>
            <p className="text-xl font-black text-orange-700">
              {fmt(plan.finalCost)}
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Monthly Savings</p>
            <p className="text-xl font-black text-green-700">
              {fmt(plan.monthlySavings)}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Payback Period</p>
            <p className="text-xl font-black text-amber-700">
              {plan.payback} yrs
            </p>
          </div>
        </div>

        {/* Subsidy row */}
        <div className="mx-4 mb-3 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">Government Subsidy Benefit</p>
          <p className="text-lg font-black text-green-600">
            -{fmt(plan.subsidy)}
          </p>
        </div>

        {/* CTA */}
        <div className="mx-4 mb-4 bg-orange-500 rounded-xl p-4 text-white text-center">
          <p className="text-sm font-semibold mb-1">
            Ready to Install? Contact Now
          </p>
          <a
            href="tel:+919428787879"
            className="flex items-center justify-center gap-2 text-lg font-black"
          >
            <Phone className="w-5 h-5" /> Call Maulik: +91 9428787879
          </a>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center text-xs text-gray-400 border-t border-gray-100">
          Shop No. 11, 2nd Floor, IDFC Bank Building, Marketing Yard, Amreli,
          Gujarat
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          data-ocid="survey.plan.start_over_button"
          variant="outline"
          onClick={onStartOver}
          className="flex-1 h-12 rounded-xl border-gray-300"
        >
          <RotateCcw className="mr-2 w-4 h-4" /> Start Over
        </Button>
        <Button
          data-ocid="survey.plan.download_button"
          onClick={handleDownload}
          className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
        >
          <Download className="mr-2 w-4 h-4" /> Download Plan
        </Button>
      </div>

      {/* WhatsApp Button */}
      <a
        data-ocid="survey.plan.button"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] transition-colors shadow-md"
      >
        <MessageCircle className="w-5 h-5" />
        Send via WhatsApp
      </a>
    </div>
  );
}

export default function SiteSurvey() {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [citySource, setCitySource] = useState<"gps" | "manual">("manual");
  const [photo, setPhoto] = useState("");
  const [bill, setBill] = useState(0);

  const handleStartOver = () => {
    setStep(1);
    setCity("");
    setCitySource("manual");
    setPhoto("");
    setBill(0);
  };

  return (
    <section
      id="site-survey"
      className="py-16 bg-gradient-to-b from-white to-green-50"
    >
      <div className="container mx-auto px-4 max-w-lg">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge className="bg-green-100 text-green-700 border-green-300 text-sm px-3 py-1">
              🏠 New Feature
            </Badge>
            <Badge className="bg-emerald-500 text-white border-emerald-600 text-sm px-3 py-1">
              ✅ Fully Interactive
            </Badge>
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            Site Survey & <span className="text-orange-500">Solar Plan</span>
          </h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            4-step wizard: detect location, capture your site, calculate
            savings, and get a personalized solar plan
          </p>
        </motion.div>

        {/* Wizard Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-5 px-6">
              <CardTitle className="text-center text-lg font-bold">
                Solar Site Survey
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <StepIndicator current={step} />

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                  >
                    <Step1Location
                      onNext={(c, s) => {
                        setCity(c);
                        setCitySource(s);
                        setStep(2);
                      }}
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                  >
                    <Step2Camera
                      onNext={(p) => {
                        setPhoto(p);
                        setStep(3);
                      }}
                      onBack={() => setStep(1)}
                    />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                  >
                    <Step3Details
                      onNext={(b) => {
                        setBill(b);
                        setStep(4);
                      }}
                      onBack={() => setStep(2)}
                    />
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                  >
                    <Step4Plan
                      city={city}
                      citySource={citySource}
                      photo={photo}
                      bill={bill}
                      onStartOver={handleStartOver}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
