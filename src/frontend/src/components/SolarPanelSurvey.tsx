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
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface OrientationData {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

interface GeoData {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
}

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  direction: string;
  tilt: string;
  geo: GeoData;
}

interface SolarPlan {
  roofWidth: string;
  roofLength: string;
  frontHeight: string;
  backHeight: string;
  roofDirection: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getCompassDirection(alpha: number | null): string {
  if (alpha === null) return "Unknown";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const idx = Math.round(alpha / 45) % 8;
  return dirs[idx];
}

function getFullDirection(alpha: number | null): string {
  if (alpha === null) return "Unknown";
  const dirs = [
    "NORTH",
    "NORTH-EAST",
    "EAST",
    "SOUTH-EAST",
    "SOUTH",
    "SOUTH-WEST",
    "WEST",
    "NORTH-WEST",
  ];
  const idx = Math.round(alpha / 45) % 8;
  return dirs[idx];
}

function getSuitabilityRating(direction: string): {
  stars: string;
  label: string;
  color: string;
} {
  const d = direction.toUpperCase();
  if (d === "SOUTH" || d === "SOUTH-WEST" || d === "SW" || d === "S")
    return { stars: "⭐⭐⭐⭐⭐", label: "Excellent", color: "text-green-600" };
  if (d === "SOUTH-EAST" || d === "WEST" || d === "SE" || d === "W")
    return { stars: "⭐⭐⭐⭐", label: "Good", color: "text-lime-600" };
  if (d === "EAST" || d === "E")
    return { stars: "⭐⭐⭐", label: "Average", color: "text-yellow-600" };
  if (d === "NORTH" || d === "N")
    return { stars: "⭐⭐", label: "Poor", color: "text-red-500" };
  return { stars: "⭐⭐⭐", label: "Average", color: "text-yellow-600" };
}

function getRecommendedKW(kw: number): number {
  const sizes = [2.32, 2.9, 3.48, 4.06, 4.64, 5.22];
  for (const s of sizes) if (kw <= s) return s;
  return 5.22;
}

// ─── SVG Plan Diagram ─────────────────────────────────────────────────────────
function SolarPlanDiagram({
  width,
  length,
  panelCount,
  direction,
}: {
  width: number;
  length: number;
  panelCount: number;
  direction: string;
}) {
  const SVG_W = 320;
  const SVG_H = 260;
  const MARGIN = 40;
  const roofW = SVG_W - MARGIN * 2;
  const roofH = SVG_H - MARGIN * 2 - 20;
  const aspect = length > 0 && width > 0 ? Math.min(length / width, 2.5) : 1;
  const rW = roofW;
  const rH = Math.min(roofH, Math.round(roofW * aspect));
  const rX = MARGIN;
  const rY = MARGIN + 10;

  const panelAR = 6.5 / 3.5;
  const scaledPW = Math.min(rW / 6, 36);
  const scaledPH = scaledPW * panelAR;
  const cols = Math.floor(rW / (scaledPW + 2));
  const rows = Math.floor(rH / (scaledPH + 2));
  const totalSlots = cols * rows;
  const drawPanels = Math.min(panelCount, totalSlots);

  const panels: { x: number; y: number }[] = [];
  let placed = 0;
  for (let r = 0; r < rows && placed < drawPanels; r++) {
    for (let c = 0; c < cols && placed < drawPanels; c++) {
      panels.push({
        x: rX + 2 + c * (scaledPW + 2),
        y: rY + 2 + r * (scaledPH + 2),
      });
      placed++;
    }
  }

  const dirMap: Record<string, number> = {
    NORTH: 0,
    "NORTH-EAST": 45,
    EAST: 90,
    "SOUTH-EAST": 135,
    SOUTH: 180,
    "SOUTH-WEST": 225,
    WEST: 270,
    "NORTH-WEST": 315,
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315,
  };
  const deg = dirMap[direction.toUpperCase()] ?? 0;
  const rad = ((deg - 90) * Math.PI) / 180;
  const cx = SVG_W - 24;
  const cy = MARGIN - 10;
  const arrowLen = 14;
  const ax = cx + Math.cos(rad) * arrowLen;
  const ay = cy + Math.sin(rad) * arrowLen;

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="w-full max-w-sm mx-auto rounded-xl border border-border bg-white"
      role="img"
      aria-labelledby="solar-plan-title"
    >
      <title id="solar-plan-title">Solar Panel Layout Plan - Top View</title>
      <text x="10" y="16" fontSize="11" fontWeight="bold" fill="#166534">
        ☀ Solar Panel Layout Plan
      </text>
      <rect
        x={rX}
        y={rY}
        width={rW}
        height={rH}
        rx="4"
        fill="#fef9c3"
        stroke="#ca8a04"
        strokeWidth="2"
      />
      {panels.map((p) => (
        <rect
          key={`${p.x}-${p.y}`}
          x={p.x}
          y={p.y}
          width={scaledPW}
          height={scaledPH}
          rx="2"
          fill="#1e40af"
          stroke="#93c5fd"
          strokeWidth="0.5"
          opacity="0.85"
        />
      ))}
      <text
        x={rX + rW / 2}
        y={rY + rH + 14}
        fontSize="9"
        textAnchor="middle"
        fill="#6b7280"
      >
        Width: {width} ft
      </text>
      <text
        x={rX - 6}
        y={rY + rH / 2}
        fontSize="9"
        textAnchor="middle"
        fill="#6b7280"
        transform={`rotate(-90, ${rX - 6}, ${rY + rH / 2})`}
      >
        Length: {length} ft
      </text>
      <circle
        cx={cx}
        cy={cy}
        r="13"
        fill="#f0fdf4"
        stroke="#16a34a"
        strokeWidth="1.5"
      />
      <line
        x1={cx}
        y1={cy}
        x2={ax}
        y2={ay}
        stroke="#dc2626"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x={cx}
        y={cy + 4}
        fontSize="7"
        textAnchor="middle"
        fill="#374151"
        fontWeight="bold"
      >
        {direction.split("-")[0].charAt(0)}
      </text>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SolarPanelSurvey() {
  const [camPerm, setCamPerm] = useState<
    "idle" | "granted" | "denied" | "requesting"
  >("idle");
  const [geoPerm, setGeoPerm] = useState<
    "idle" | "granted" | "denied" | "requesting"
  >("idle");
  const [orientPerm, setOrientPerm] = useState<
    "idle" | "granted" | "denied" | "requesting"
  >("idle");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment",
  );
  const [cameraActive, setCameraActive] = useState(false);

  const [orientation, setOrientation] = useState<OrientationData>({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const [geo, setGeo] = useState<GeoData>({
    lat: null,
    lng: null,
    accuracy: null,
  });
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [plan, setPlan] = useState<SolarPlan>({
    roofWidth: "",
    roofLength: "",
    frontHeight: "3",
    backHeight: "5",
    roofDirection: "",
  });
  const [showPlan, setShowPlan] = useState(false);

  // ── Camera helpers ──────────────────────────────────────────────────────────
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(
    async (facing: "environment" | "user") => {
      stopStream();
      setCamPerm("requesting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCamPerm("granted");
        setCameraActive(true);
      } catch {
        setCamPerm("denied");
        setCameraActive(false);
      }
    },
    [stopStream],
  );

  // ── Auto permissions on mount ───────────────────────────────────────────────
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect, startCamera/stopStream are stable
  useEffect(() => {
    startCamera("environment");

    if (navigator.geolocation) {
      setGeoPerm("requesting");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeo({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
          setGeoPerm("granted");
        },
        () => setGeoPerm("denied"),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      setOrientation({ alpha: e.alpha, beta: e.beta, gamma: e.gamma });
      setOrientPerm("granted");
    };

    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE.requestPermission === "function") {
      setOrientPerm("idle");
    } else {
      setOrientPerm("requesting");
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      stopStream();
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  const flipCamera = useCallback(() => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  }, [facingMode, startCamera]);

  const requestOrientationPermission = useCallback(async () => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE.requestPermission !== "function") return;
    try {
      const result = await DOE.requestPermission();
      if (result === "granted") {
        setOrientPerm("granted");
        window.addEventListener(
          "deviceorientation",
          (e: DeviceOrientationEvent) =>
            setOrientation({ alpha: e.alpha, beta: e.beta, gamma: e.gamma }),
          true,
        );
      } else {
        setOrientPerm("denied");
      }
    } catch {
      setOrientPerm("denied");
    }
  }, []);

  // ── Live overlay drawing ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!cameraActive || !videoRef.current || !overlayCanvasRef.current) return;
    const video = videoRef.current;
    const canvas = overlayCanvasRef.current;
    let animId: number;

    const draw = () => {
      if (!video || video.readyState < 2) {
        animId = requestAnimationFrame(draw);
        return;
      }
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid (rule of thirds)
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo((canvas.width / 3) * i, 0);
        ctx.lineTo((canvas.width / 3) * i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, (canvas.height / 3) * i);
        ctx.lineTo(canvas.width, (canvas.height / 3) * i);
        ctx.stroke();
      }

      // Compass
      const compassDir = getCompassDirection(orientation.alpha);
      const compassDeg =
        orientation.alpha !== null ? Math.round(orientation.alpha) : null;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.roundRect(canvas.width - 90, 8, 82, 36, 8);
      ctx.fill();
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `\uD83E\uDDED ${compassDir}${compassDeg !== null ? ` ${String(compassDeg)}\u00B0` : ""}`,
        canvas.width - 49,
        32,
      );

      // Tilt
      const beta =
        orientation.beta !== null ? Math.round(orientation.beta) : null;
      const gamma =
        orientation.gamma !== null ? Math.round(orientation.gamma) : null;
      const isLevel = beta !== null && Math.abs(beta) < 5;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.roundRect(8, 8, 130, 36, 8);
      ctx.fill();
      ctx.fillStyle = isLevel ? "#4ade80" : "#fb923c";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        isLevel
          ? "\uD83D\uDCD0 LEVEL \u2713"
          : `\uD83D\uDCD0 \u03B2:${String(beta ?? "?")}\u00B0 \u03B3:${String(gamma ?? "?")}\u00B0`,
        14,
        32,
      );

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [cameraActive, orientation]);

  // ── Capture photo ────────────────────────────────────────────────────────────
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 360;
    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, vw, vh);

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN");
    const timeStr = now.toLocaleTimeString("en-IN");
    const direction = getFullDirection(orientation.alpha);
    const deg =
      orientation.alpha !== null ? Math.round(orientation.alpha) : null;
    const beta =
      orientation.beta !== null ? Math.round(orientation.beta) : null;
    const latStr = geo.lat !== null ? geo.lat.toFixed(5) : "N/A";
    const lngStr = geo.lng !== null ? geo.lng.toFixed(5) : "N/A";
    const suit = getSuitabilityRating(direction);

    // Top-left brand box
    ctx.fillStyle = "rgba(22,101,52,0.85)";
    ctx.beginPath();
    ctx.roundRect(10, 10, 280, 64, 8);
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("\u2600 MADHAV SOLAR ENERGY", 18, 30);
    ctx.fillStyle = "#d1fae5";
    ctx.font = "11px sans-serif";
    ctx.fillText("Amreli, Gujarat | Authorized Waaree Partner", 18, 48);
    ctx.fillStyle = "white";
    ctx.font = "10px sans-serif";
    ctx.fillText("Dev: Maulik B Solanki | 9428787879", 18, 66);

    // Top-right date/time
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.beginPath();
    ctx.roundRect(vw - 170, 10, 160, 44, 8);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(dateStr, vw - 16, 30);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "11px sans-serif";
    ctx.fillText(timeStr, vw - 16, 48);

    // Bottom-left GPS + direction
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.beginPath();
    ctx.roundRect(10, vh - 90, 260, 52, 8);
    ctx.fill();
    ctx.fillStyle = "#86efac";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`\uD83D\uDCCD ${latStr}, ${lngStr}`, 18, vh - 68);
    ctx.fillStyle = "white";
    ctx.font = "10px sans-serif";
    const dirLabel = `\uD83E\uDDED ${direction}${deg !== null ? ` | ${String(deg)}\u00B0` : ""} | \uD83D\uDCD0 Tilt: ${String(beta ?? "?")}\u00B0`;
    ctx.fillText(dirLabel, 18, vh - 50);

    // Structure info
    ctx.fillStyle = "#fbbf24";
    ctx.font = "9px sans-serif";
    ctx.fillText(
      "Structure: Front 3ft | Back 5ft | Panel: 3.5ft x 6.5ft (580W Waaree)",
      18,
      vh - 34,
    );

    // Bottom-center suitability
    ctx.fillStyle = "rgba(22,101,52,0.85)";
    ctx.beginPath();
    ctx.roundRect(vw / 2 - 140, vh - 28, 280, 24, 8);
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `Solar Suitability: ${suit.label} ${suit.stars}`,
      vw / 2,
      vh - 10,
    );

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const photo: CapturedPhoto = {
      id: Date.now().toString(),
      dataUrl,
      timestamp: `${dateStr} ${timeStr}`,
      direction: direction + (deg !== null ? ` ${String(deg)}\u00B0` : ""),
      tilt: `${String(beta ?? "?")}\u00B0`,
      geo,
    };
    setPhotos((prev) => [photo, ...prev]);
    setShowPlan(true);
    setPlan((p) => ({ ...p, roofDirection: direction }));
  }, [orientation, geo]);

  // ── Plan calculations ───────────────────────────────────────────────────────────
  const roofW = Number.parseFloat(plan.roofWidth) || 0;
  const roofL = Number.parseFloat(plan.roofLength) || 0;
  const roofArea = roofW * roofL;
  const panelCount =
    roofArea > 0 ? Math.floor((roofArea * 0.7) / (3.5 * 6.5)) : 0;
  const estimatedKW = (panelCount * 580) / 1000;
  const recommendedKW = panelCount > 0 ? getRecommendedKW(estimatedKW) : 0;
  const suitability = plan.roofDirection
    ? getSuitabilityRating(plan.roofDirection)
    : null;

  // ── Download ───────────────────────────────────────────────────────────────────
  const downloadPhoto = useCallback(
    (photoId: string) => {
      const photo = photos.find((p) => p.id === photoId);
      if (!photo) return;
      const a = document.createElement("a");
      a.href = photo.dataUrl;
      a.download = `madhav-solar-survey-${photoId}.jpg`;
      a.click();
    },
    [photos],
  );

  // ── WhatsApp share ───────────────────────────────────────────────────────────
  const sharePhotoWhatsApp = useCallback(
    (photoId: string) => {
      const photo = photos.find((p) => p.id === photoId);
      if (!photo) return;
      const msg = `\u2600\uFE0F *Madhav Solar Energy - Site Survey Photo*\n\uD83D\uDCCD GPS: ${photo.geo.lat?.toFixed(5) ?? "N/A"}, ${photo.geo.lng?.toFixed(5) ?? "N/A"}\n\uD83E\uDDED Direction: ${photo.direction}\n\uD83D\uDCD0 Tilt: ${photo.tilt}\n\uD83D\uDD50 ${photo.timestamp}\n\nContact: Maulik B Solanki | 9428787879`;
      window.open(
        `https://wa.me/919428787879?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
    },
    [photos],
  );

  const sharePlanWhatsApp = useCallback(() => {
    if (roofArea === 0) return;
    const msg = `\u2600\uFE0F *Madhav Solar Energy - Solar Plan Request*\n\uD83D\uDCD0 Roof: ${String(roofW)}ft x ${String(roofL)}ft (${String(roofArea)} sq ft)\n\uD83D\uDD0B Estimated: ${String(panelCount)} panels (~${estimatedKW.toFixed(2)} kW)\n\u2705 Recommended: ${String(recommendedKW)} kW Waaree System\n\uD83E\uDDED Direction: ${plan.roofDirection}\n\uD83C\uDFD7\uFE0F Structure: Front ${plan.frontHeight}ft | Back ${plan.backHeight}ft\n\nPlease contact me for a site visit and quotation.\n\nContact: Maulik B Solanki | 9428787879`;
    window.open(
      `https://wa.me/919428787879?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  }, [roofW, roofL, roofArea, panelCount, estimatedKW, recommendedKW, plan]);

  // ── Permission badge ──────────────────────────────────────────────────────────
  const PermBadge = ({
    label,
    state,
  }: { label: string; state: typeof camPerm }) => (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        state === "granted"
          ? "bg-green-100 text-green-700 border border-green-300"
          : state === "denied"
            ? "bg-red-100 text-red-600 border border-red-300"
            : state === "requesting"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
              : "bg-gray-100 text-gray-500 border border-gray-200"
      }`}
    >
      {state === "granted" ? "✅" : state === "denied" ? "❌" : "⏳"} {label}
    </span>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="solar-survey"
      className="py-12 px-4 bg-gradient-to-b from-green-50 to-amber-50"
      data-ocid="solar_survey.section"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-green-800 tracking-tight">
            ☀️ Solar Site Survey &amp; Panel Planner
          </h2>
          <p className="text-sm text-amber-700 font-medium">
            MADHAV SOLAR ENERGY | Amreli, Gujarat
          </p>
          <Badge className="bg-green-700 text-white hover:bg-green-800">
            ✅ Auto Camera Active
          </Badge>
        </div>

        {/* Permission Status */}
        <Card className="border-green-200 shadow-sm">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm text-green-800">
              🔐 Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pb-4">
            <PermBadge label="Camera" state={camPerm} />
            <PermBadge label="Location" state={geoPerm} />
            <PermBadge label="Tilt Sensor" state={orientPerm} />
            {orientPerm === "idle" && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-xs h-7 border-amber-400 text-amber-700 hover:bg-amber-50"
                onClick={requestOrientationPermission}
                data-ocid="solar_survey.button"
              >
                Enable Tilt Sensor
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Camera View */}
        <Card className="border-green-200 shadow-md overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm text-green-800">
              📷 Live Camera View
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {camPerm === "denied" ? (
              <div
                className="flex flex-col items-center justify-center h-48 bg-gray-100 text-center p-4"
                data-ocid="solar_survey.error_state"
              >
                <span className="text-4xl">❌</span>
                <p className="text-red-600 font-semibold mt-2">
                  Camera permission denied
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Please allow camera access in your browser settings and
                  refresh.
                </p>
                <Button
                  type="button"
                  className="mt-3 bg-green-700 hover:bg-green-800 text-white"
                  size="sm"
                  onClick={() => startCamera(facingMode)}
                  data-ocid="solar_survey.primary_button"
                >
                  Retry Camera
                </Button>
              </div>
            ) : (
              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full block"
                  style={{ maxHeight: "340px", objectFit: "cover" }}
                />
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ objectFit: "cover" }}
                />
                <canvas ref={canvasRef} className="hidden" />
                {camPerm === "requesting" && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/60"
                    data-ocid="solar_survey.loading_state"
                  >
                    <div className="text-white text-center">
                      <div className="text-3xl animate-pulse">📷</div>
                      <p className="mt-1 text-sm">Starting camera...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={flipCamera}
                className="text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                data-ocid="solar_survey.toggle"
              >
                🔄 Flip Camera
              </Button>
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 shadow-lg"
                onClick={capturePhoto}
                disabled={!cameraActive}
                data-ocid="solar_survey.primary_button"
              >
                📸 Capture Photo
              </Button>
              {orientation.alpha !== null && (
                <span className="text-xs font-bold text-amber-400 bg-gray-800 px-2 py-1 rounded-full">
                  🧭 {getCompassDirection(orientation.alpha)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Solar Plan Generator */}
        {showPlan && (
          <Card
            className="border-amber-300 shadow-md"
            data-ocid="solar_survey.panel"
          >
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-green-800">
                📋 Generate Solar Panel Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">
                    Roof Width (feet)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 20"
                    value={plan.roofWidth}
                    onChange={(e) =>
                      setPlan((p) => ({ ...p, roofWidth: e.target.value }))
                    }
                    className="text-sm"
                    data-ocid="solar_survey.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">
                    Roof Length (feet)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 30"
                    value={plan.roofLength}
                    onChange={(e) =>
                      setPlan((p) => ({ ...p, roofLength: e.target.value }))
                    }
                    className="text-sm"
                    data-ocid="solar_survey.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">
                    Front Height (feet)
                  </Label>
                  <Input
                    type="number"
                    value={plan.frontHeight}
                    onChange={(e) =>
                      setPlan((p) => ({ ...p, frontHeight: e.target.value }))
                    }
                    className="text-sm"
                    data-ocid="solar_survey.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">
                    Back Height (feet)
                  </Label>
                  <Input
                    type="number"
                    value={plan.backHeight}
                    onChange={(e) =>
                      setPlan((p) => ({ ...p, backHeight: e.target.value }))
                    }
                    className="text-sm"
                    data-ocid="solar_survey.input"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-gray-600">Roof Direction</Label>
                <Select
                  value={plan.roofDirection}
                  onValueChange={(v) =>
                    setPlan((p) => ({ ...p, roofDirection: v }))
                  }
                >
                  <SelectTrigger data-ocid="solar_survey.select">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "NORTH",
                      "SOUTH",
                      "EAST",
                      "WEST",
                      "SOUTH-EAST",
                      "SOUTH-WEST",
                      "NORTH-EAST",
                      "NORTH-WEST",
                    ].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {roofArea > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                  <p className="font-bold text-green-800 text-sm">
                    📊 Calculation Results
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white rounded-lg p-2 border border-green-100">
                      <p className="text-xs text-gray-500">Roof Area</p>
                      <p className="font-bold text-green-700">
                        {roofArea} sq ft
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-green-100">
                      <p className="text-xs text-gray-500">Panels</p>
                      <p className="font-bold text-green-700">
                        {panelCount} panels
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-green-100">
                      <p className="text-xs text-gray-500">Est. Capacity</p>
                      <p className="font-bold text-amber-600">
                        {estimatedKW.toFixed(2)} kW
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-green-100">
                      <p className="text-xs text-gray-500">Recommended</p>
                      <p className="font-bold text-blue-700">
                        {recommendedKW} kW
                      </p>
                    </div>
                  </div>
                  {suitability && (
                    <div className="bg-white rounded-lg p-2 border border-green-100">
                      <p className="text-xs text-gray-500">
                        Direction Suitability
                      </p>
                      <p className={`font-bold ${suitability.color}`}>
                        {suitability.stars} {suitability.label}
                      </p>
                    </div>
                  )}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
                    <strong>🏗️ Structure:</strong> Front {plan.frontHeight}ft |
                    Back {plan.backHeight}ft height
                    <br />
                    <strong>Panel size:</strong> 3.5ft × 6.5ft (Waaree 580W
                    TOPCON)
                    <br />
                    <strong>Note:</strong> South/South-West facing is optimal in
                    India ☀️
                  </div>
                </div>
              )}

              {roofArea > 0 && panelCount > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600">
                    🗺️ Layout Diagram (Top View)
                  </p>
                  <SolarPlanDiagram
                    width={roofW}
                    length={roofL}
                    panelCount={panelCount}
                    direction={plan.roofDirection || "SOUTH"}
                  />
                  <p className="text-xs text-center text-gray-400">
                    Blue rectangles = Solar panels | Yellow = Roof area
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Button
                  type="button"
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white text-sm"
                  onClick={sharePlanWhatsApp}
                  disabled={roofArea === 0}
                  data-ocid="solar_survey.primary_button"
                >
                  📲 Share Plan on WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <Card
            className="border-blue-200 shadow-sm"
            data-ocid="solar_survey.panel"
          >
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm text-blue-800">
                🖼️ Captured Photos ({photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="flex items-start gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100"
                  data-ocid={`solar_survey.item.${String(idx + 1)}`}
                >
                  <img
                    src={photo.dataUrl}
                    alt={`Survey ${String(idx + 1)}`}
                    className="w-20 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      📸 #{idx + 1}
                    </p>
                    <p className="text-xs text-gray-500">{photo.timestamp}</p>
                    <p className="text-xs text-gray-500">
                      🧭 {photo.direction}
                    </p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <button
                        type="button"
                        className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                        onClick={() => downloadPhoto(photo.id)}
                        data-ocid={`solar_survey.secondary_button.${String(idx + 1)}`}
                      >
                        ⬇️ Download
                      </button>
                      <button
                        type="button"
                        className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition-colors"
                        onClick={() => sharePhotoWhatsApp(photo.id)}
                        data-ocid={`solar_survey.secondary_button.${String(idx + 1)}`}
                      >
                        📲 WhatsApp
                      </button>
                      <button
                        type="button"
                        className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        onClick={() =>
                          setPhotos((prev) =>
                            prev.filter((p) => p.id !== photo.id),
                          )
                        }
                        data-ocid={`solar_survey.delete_button.${String(idx + 1)}`}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {photos.length === 0 && (
                <p
                  className="text-xs text-gray-400 text-center py-4"
                  data-ocid="solar_survey.empty_state"
                >
                  No photos yet. Capture a photo above.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 space-y-1 pb-2">
          <p>
            ☀️ <strong className="text-green-700">MADHAV SOLAR ENERGY</strong> —
            Amreli, Gujarat
          </p>
          <p>Maulik B Solanki: 9428787879 | Ashwin Teraiya: 9574166656</p>
          <p>
            Shop No. 11, First Floor, IDFC Bank Building, Marketing Yard, Amreli
          </p>
        </div>
      </div>
    </section>
  );
}
