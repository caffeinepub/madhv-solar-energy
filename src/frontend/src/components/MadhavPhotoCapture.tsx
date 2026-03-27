import { useCallback, useEffect, useRef, useState } from "react";

const MAULIK = "+91 9428787879";
const ASHWIN = "+91 95741 66656";

const GUJARAT_CITIES = [
  "AMRELI",
  "RAJKOT",
  "JAMNAGAR",
  "JUNAGADH",
  "BHAVNAGAR",
  "SURENDRANAGAR",
  "PORBANDAR",
  "ANAND",
  "VADODARA",
  "SURAT",
  "AHMEDABAD",
  "GANDHINAGAR",
  "MEHSANA",
  "BOTAD",
];

function stopTracks(s: MediaStream | null) {
  if (!s) return;
  for (const t of s.getTracks()) t.stop();
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function formatTime(d: Date) {
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function MadhavPhotoCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("Locating...");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [customerName, setCustomerName] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const autoStartedRef = useRef(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            );
            const data = await resp.json();
            const addr = data.address;
            const parts = [
              addr.village || addr.suburb || addr.town || addr.city_district,
              addr.city || addr.town || addr.county,
              addr.state,
            ].filter(Boolean);
            setLocation(
              parts.join(", ") ||
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            );
          } catch {
            setLocation(`${latitude.toFixed(4)}N, ${longitude.toFixed(4)}E`);
          }
        },
        () => setLocation("Location unavailable"),
      );
    } else {
      setLocation("Location not supported");
    }
  }, []);

  const startCamera = useCallback(
    async (mode: "user" | "environment" = facingMode) => {
      setCameraError(null);
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false,
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setCameraOpen(true);
        setPhoto(null);
      } catch {
        setCameraError(
          "Camera access is needed. Please allow camera permission in your browser settings.",
        );
      }
    },
    [facingMode],
  );

  // Auto-start camera immediately on mount
  useEffect(() => {
    if (!autoStartedRef.current) {
      autoStartedRef.current = true;
      setCameraError(null);
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setCameraOpen(true);
          setPhoto(null);
        })
        .catch(() => {
          setCameraError(
            "Camera access is needed. Please allow camera permission in your browser settings.",
          );
        });
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopTracks(stream);
    setStream(null);
    setCameraOpen(false);
  }, [stream]);

  const flipCamera = useCallback(async () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    stopTracks(stream);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      /* ignore */
    }
  }, [facingMode, stream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const W = video.videoWidth || 640;
    const H = video.videoHeight || 480;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(video, 0, 0, W, H);

    const barH = Math.max(90, H * 0.2);
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.fillRect(0, H - barH, W, barH);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, H - barH, W, 3);

    const now = new Date();
    const baseFontSize = Math.max(11, W * 0.027);

    // Title
    ctx.font = `bold ${baseFontSize * 1.25}px Arial`;
    ctx.fillStyle = "#22c55e";
    ctx.fillText("☀ MADHAV SOLAR ENERGY", 12, H - barH + baseFontSize * 1.45);

    // Customer name & city
    if (customerName || customerCity) {
      ctx.font = `bold ${baseFontSize * 1.1}px Arial`;
      ctx.fillStyle = "#fbbf24";
      const namePart = customerName ? `👤 ${customerName}` : "";
      const cityPart = customerCity ? `  🏙 ${customerCity}` : "";
      ctx.fillText(
        `${namePart}${cityPart}`,
        12,
        H - barH + baseFontSize * 2.75,
      );
    }

    // Date/time
    const dateY =
      customerName || customerCity
        ? H - barH + baseFontSize * 4.0
        : H - barH + baseFontSize * 2.8;
    ctx.font = `${baseFontSize}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`📅 ${formatDate(now)}   🕐 ${formatTime(now)}`, 12, dateY);

    // Location
    ctx.font = `${baseFontSize * 0.9}px Arial`;
    ctx.fillStyle = "#d1fae5";
    const maxLocWidth = W - 20;
    let loc = `📍 ${location}`;
    while (ctx.measureText(loc).width > maxLocWidth && loc.length > 20) {
      loc = loc.slice(0, -2);
    }
    if (loc !== `📍 ${location}`) loc += "…";
    ctx.fillText(loc, 12, dateY + baseFontSize * 1.3);

    // Thank you
    ctx.font = `italic ${baseFontSize * 0.85}px Arial`;
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(
      "Thank you! Welcome to Madhav Solar Family 🙏",
      12,
      dateY + baseFontSize * 2.5,
    );

    // Badge top-right
    const badgeW = Math.max(120, W * 0.3);
    const badgeH = Math.max(32, H * 0.07);
    ctx.fillStyle = "rgba(34,197,94,0.85)";
    ctx.beginPath();
    ctx.roundRect(W - badgeW - 8, 8, badgeW, badgeH, 6);
    ctx.fill();
    ctx.font = `bold ${baseFontSize * 0.9}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Madhav Solar Energy", W - badgeW / 2 - 8, 8 + badgeH * 0.68);
    ctx.textAlign = "left";

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPhoto(dataUrl);
    stopCamera();
  }, [location, customerName, customerCity, stopCamera]);

  const downloadPhoto = useCallback(() => {
    if (!photo) return;
    const a = document.createElement("a");
    a.href = photo;
    a.download = `MadhavSolar_${Date.now()}.jpg`;
    a.click();
  }, [photo]);

  const shareWhatsApp = useCallback(() => {
    const nameLine = customerName ? `👤 Customer: ${customerName}` : "";
    const cityLine = customerCity ? `🏙 City: ${customerCity}` : "";
    const extras = [nameLine, cityLine].filter(Boolean).join("\n");
    const msg = encodeURIComponent(
      `🌞 *MADHAV SOLAR ENERGY*\n${extras ? `${extras}\n` : ""}📍 ${location}\n📅 ${formatDate(new Date())} 🕐 ${formatTime(new Date())}\n\nThank you! Welcome to Madhav Solar Family 🙏\n\nContact: ${MAULIK} | ${ASHWIN}`,
    );
    window.open(`https://wa.me/919428787879?text=${msg}`, "_blank");
  }, [location, customerName, customerCity]);

  const filteredCities = GUJARAT_CITIES.filter((c) =>
    c.toLowerCase().includes(cityInput.toLowerCase()),
  );

  return (
    <section
      ref={sectionRef}
      className="py-12 bg-gradient-to-br from-green-950 via-gray-900 to-green-900"
      id="photo-capture"
    >
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-block bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30 mb-3">
            📸 Customer Photo
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Click Your Photo with Madhav Solar
          </h2>
          <p className="text-green-200 text-sm">
            Take a photo — your name card with logo, date, time &amp; location
            will be added automatically
          </p>
        </div>

        <div className="bg-gray-900/80 rounded-2xl border border-green-700/40 overflow-hidden shadow-2xl">
          {/* Customer Name & City Fields */}
          <div className="p-4 space-y-3 border-b border-green-700/30">
            <div>
              <label
                htmlFor="customer-name-input"
                className="block text-green-300 text-sm font-semibold mb-1"
              >
                Customer Name &nbsp;
                <span className="text-green-500 font-normal text-xs">
                  (ગ્રાહકનું નામ)
                </span>
              </label>
              <input
                id="customer-name-input"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name..."
                data-ocid="photo.input"
                className="w-full bg-gray-800 border border-green-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="customer-city-input"
                className="block text-green-300 text-sm font-semibold mb-1"
              >
                City &nbsp;
                <span className="text-green-500 font-normal text-xs">
                  (શહેર)
                </span>
              </label>
              <input
                id="customer-city-input"
                type="text"
                value={cityInput}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setCustomerCity(e.target.value);
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
                placeholder="Select or type city..."
                data-ocid="photo.select"
                className="w-full bg-gray-800 border border-green-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
              />
              {showCityDropdown && filteredCities.length > 0 && (
                <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-gray-800 border border-green-700 rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <li
                      key={city}
                      onMouseDown={() => {
                        setCityInput(city);
                        setCustomerCity(city);
                        setShowCityDropdown(false);
                      }}
                      className="px-4 py-2.5 text-white hover:bg-green-700/50 cursor-pointer text-sm transition-colors"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {cameraOpen && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-[360px] object-cover bg-black"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2 text-xs text-white">
                <div className="text-green-400 font-bold text-sm">
                  ☀ MADHAV SOLAR ENERGY
                </div>
                {(customerName || customerCity) && (
                  <div className="text-yellow-300 text-xs font-semibold">
                    {customerName && `👤 ${customerName}`}
                    {customerName && customerCity && "  "}
                    {customerCity && `🏙 ${customerCity}`}
                  </div>
                )}
                <div className="text-gray-200">📍 {location}</div>
              </div>
            </div>
          )}

          {photo && (
            <div className="relative">
              <img
                src={photo}
                alt="Captured with Madhav Solar branding"
                className="w-full"
              />
            </div>
          )}

          {!cameraOpen && !photo && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="text-6xl mb-4">📷</div>
              {cameraError ? (
                <p className="text-red-400 text-sm text-center px-4">
                  {cameraError}
                </p>
              ) : (
                <p className="text-gray-400">Starting camera...</p>
              )}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          <div className="p-4 space-y-3">
            {!cameraOpen && !photo && cameraError && (
              <button
                type="button"
                onClick={() => startCamera()}
                data-ocid="photo.retry_button"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-lg transition-all active:scale-95"
              >
                🔁 Retry Camera
              </button>
            )}

            {cameraOpen && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={capturePhoto}
                  data-ocid="photo.primary_button"
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-base transition-all active:scale-95"
                >
                  📸 Click Photo
                </button>
                <button
                  type="button"
                  onClick={flipCamera}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl transition-all active:scale-95"
                  title="Flip camera"
                >
                  🔄
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="bg-red-700 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition-all active:scale-95"
                >
                  ✕
                </button>
              </div>
            )}

            {photo && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={downloadPhoto}
                  data-ocid="photo.secondary_button"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-base transition-all active:scale-95"
                >
                  ⬇ Download Photo
                </button>
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-base transition-all active:scale-95"
                >
                  💬 Share on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    autoStartedRef.current = false;
                    startCamera();
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-xl text-sm transition-all active:scale-95"
                >
                  🔁 Retake Photo
                </button>
              </div>
            )}
          </div>

          <div className="bg-green-900/40 border-t border-green-700/30 px-4 py-3 text-center">
            <p className="text-green-300 text-xs font-medium">
              🙏 Thank you for connecting with{" "}
              <span className="font-bold text-green-400">
                Madhav Solar Family!
              </span>
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              {MAULIK} &nbsp;|&nbsp; {ASHWIN}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
