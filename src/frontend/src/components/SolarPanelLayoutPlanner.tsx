import { useCallback, useEffect, useRef, useState } from "react";

function stopTracks(s: MediaStream | null) {
  if (!s) return;
  for (const t of s.getTracks()) t.stop();
}

const COLS = 3;
const ROWS = 3;
const PANEL_LABEL = "WAAREE 580W";

export default function SolarPanelLayoutPlanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("Locating...");
  const [latLng, setLatLng] = useState<string>("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const autoStartedRef = useRef(false);

  // Get GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLatLng(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
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

  // Auto-start camera on mount
  useEffect(() => {
    if (!autoStartedRef.current) {
      autoStartedRef.current = true;
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then((s) => {
          setStream(s);
          if (videoRef.current) videoRef.current.srcObject = s;
          setCameraOpen(true);
          setPhoto(null);
        })
        .catch(() => {
          setCameraError(
            "Camera access needed. Please allow camera permission.",
          );
        });
    }
  }, []);

  const startCamera = useCallback(
    async (mode: "user" | "environment" = facingMode) => {
      setCameraError(null);
      setPhoto(null);
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false,
        });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
        setCameraOpen(true);
      } catch {
        setCameraError("Camera access needed. Please allow camera permission.");
      }
    },
    [facingMode],
  );

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

    // Draw the video frame
    ctx.drawImage(video, 0, 0, W, H);

    // === SOLAR PANEL GRID OVERLAY ===
    // Overlay covers 80% of image width, centered, placed in upper-center area
    const gridMarginX = W * 0.08;
    const gridMarginY = H * 0.12;
    const gridW = W * 0.84;
    const gridH = H * 0.58;

    const panelGap = Math.max(4, W * 0.008);
    const panelW = (gridW - panelGap * (COLS - 1)) / COLS;
    const panelH = (gridH - panelGap * (ROWS - 1)) / ROWS;

    // Semi-transparent dark background behind the grid area
    ctx.fillStyle = "rgba(0,0,0,0.30)";
    ctx.fillRect(gridMarginX - 8, gridMarginY - 8, gridW + 16, gridH + 16);

    // Draw each panel cell
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const px = gridMarginX + col * (panelW + panelGap);
        const py = gridMarginY + row * (panelH + panelGap);

        // Panel background (dark blue solar panel color)
        ctx.fillStyle = "rgba(10, 40, 80, 0.82)";
        ctx.fillRect(px, py, panelW, panelH);

        // Panel border
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = Math.max(1.5, W * 0.003);
        ctx.strokeRect(px, py, panelW, panelH);

        // Horizontal cell lines (solar cell rows inside panel)
        ctx.strokeStyle = "rgba(0, 229, 255, 0.35)";
        ctx.lineWidth = 0.8;
        const cellRows = 6;
        for (let cr = 1; cr < cellRows; cr++) {
          const ly = py + (panelH / cellRows) * cr;
          ctx.beginPath();
          ctx.moveTo(px + 2, ly);
          ctx.lineTo(px + panelW - 2, ly);
          ctx.stroke();
        }
        // Vertical cell lines
        const cellCols = 4;
        for (let cc = 1; cc < cellCols; cc++) {
          const lx = px + (panelW / cellCols) * cc;
          ctx.beginPath();
          ctx.moveTo(lx, py + 2);
          ctx.lineTo(lx, py + panelH - 2);
          ctx.stroke();
        }

        // Panel label (row/col index)
        const fontSize = Math.max(9, panelH * 0.09);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = "#00e5ff";
        ctx.fillText(`R${row + 1}-P${col + 1}`, px + 5, py + fontSize + 4);

        // Panel brand label at bottom of cell
        const brandFont = Math.max(7, panelH * 0.075);
        ctx.font = `${brandFont}px Arial`;
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText(PANEL_LABEL, px + 4, py + panelH - 5);
      }
    }

    // Row labels on left side
    for (let row = 0; row < ROWS; row++) {
      const py = gridMarginY + row * (panelH + panelGap) + panelH / 2;
      const rowLabelFont = Math.max(10, W * 0.022);
      ctx.font = `bold ${rowLabelFont}px Arial`;
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`ROW ${row + 1}`, 4, py + rowLabelFont * 0.4);
    }

    // Column labels on top
    for (let col = 0; col < COLS; col++) {
      const px = gridMarginX + col * (panelW + panelGap) + panelW / 2;
      const colLabelFont = Math.max(10, H * 0.022);
      ctx.font = `bold ${colLabelFont}px Arial`;
      ctx.fillStyle = "#fbbf24";
      ctx.textAlign = "center";
      ctx.fillText(`COL ${col + 1}`, px, gridMarginY - 10);
    }
    ctx.textAlign = "left";

    // === GRID MEASUREMENTS INFO ===
    const infoY = gridMarginY + gridH + 20;
    const infoFont = Math.max(10, W * 0.022);
    ctx.font = `bold ${infoFont}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      `📐 Layout: ${COLS} × ${ROWS} = ${COLS * ROWS} Panels`,
      gridMarginX,
      infoY,
    );
    ctx.fillText(
      "📏 Structure: Front 3ft | Back 5ft",
      gridMarginX,
      infoY + infoFont * 1.6,
    );
    ctx.fillText(
      "⚡ Each Panel: WAAREE TOPCON 580W",
      gridMarginX,
      infoY + infoFont * 3.2,
    );

    // === BOTTOM INFO BAR ===
    const barH = Math.max(70, H * 0.13);
    ctx.fillStyle = "rgba(0, 0, 0, 0.82)";
    ctx.fillRect(0, H - barH, W, barH);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, H - barH, W, 3);

    const barFont = Math.max(11, W * 0.025);
    const lineH = barFont * 1.5;
    let y = H - barH + lineH;

    ctx.font = `bold ${barFont * 1.1}px Arial`;
    ctx.fillStyle = "#22c55e";
    ctx.fillText(
      "☀ MADHAV SOLAR ENERGY - AMRELI  |  SOLAR PANEL LAYOUT PLAN",
      10,
      y,
    );
    y += lineH;

    ctx.font = `${barFont * 0.85}px Arial`;
    ctx.fillStyle = "#ffffff";
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    ctx.fillText(`📅 ${dateStr}  🕐 ${timeStr}  |  📍 ${location}`, 10, y);
    y += lineH;

    ctx.font = `${barFont * 0.8}px Arial`;
    ctx.fillStyle = "#94a3b8";
    if (latLng)
      ctx.fillText(`GPS: ${latLng}  |  Maulik: +91 9428787879`, 10, y);

    stopTracks(stream);
    setCameraOpen(false);
    setPhoto(canvas.toDataURL("image/jpeg", 0.95));
  }, [stream, location, latLng]);

  const retake = useCallback(() => {
    setPhoto(null);
    startCamera(facingMode);
  }, [facingMode, startCamera]);

  const download = useCallback(() => {
    if (!photo) return;
    const a = document.createElement("a");
    a.href = photo;
    a.download = `solar-panel-layout-${Date.now()}.jpg`;
    a.click();
  }, [photo]);

  const shareWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(
      `☀ MADHAV SOLAR ENERGY - AMRELI\n📐 Solar Panel Layout Plan: ${COLS}×${ROWS} = ${COLS * ROWS} Panels\n📍 Location: ${location}\n⚡ WAAREE TOPCON 580W Panels\n📐 Structure: Front 3ft | Back 5ft\nContact: Maulik +91 9428787879`,
    );
    window.open(`https://wa.me/919428787879?text=${msg}`, "_blank");
  }, [location]);

  return (
    <section className="bg-gradient-to-b from-gray-950 to-gray-900 py-10 px-3">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
            ☀ Solar Panel Layout Planner
          </span>
          <h2 className="text-2xl font-bold text-white mb-1">
            📐 Solar Panel Plan
          </h2>
          <p className="text-gray-400 text-sm">
            Point camera at your rooftop. Click photo to generate automatic{" "}
            {COLS}×{ROWS} solar panel layout plan with location.
          </p>
        </div>

        {/* Panel count info */}
        <div className="flex justify-center gap-3 mb-5 flex-wrap">
          {["3 Columns", "3 Rows", "9 Panels Total", "WAAREE 580W"].map(
            (label) => (
              <span
                key={label}
                className="bg-gray-800 border border-cyan-700 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full"
              >
                {label}
              </span>
            ),
          )}
        </div>

        {/* Camera error */}
        {cameraError && (
          <div className="bg-red-900/60 border border-red-500 text-red-200 text-sm rounded-xl p-4 mb-4 text-center">
            {cameraError}
            <button
              type="button"
              onClick={() => startCamera()}
              className="block mx-auto mt-2 bg-green-600 text-white text-sm px-5 py-2 rounded-lg font-semibold"
            >
              Retry Camera
            </button>
          </div>
        )}

        {/* Live Camera */}
        {cameraOpen && !photo && (
          <div className="rounded-2xl overflow-hidden border-2 border-cyan-600 shadow-lg mb-4 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full block"
              style={{ maxHeight: "68vw", objectFit: "cover" }}
            />
            {/* 3x3 Grid Preview Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ padding: "12% 8%" }}
            >
              <div
                className="w-full h-full"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                  gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                  gap: "3px",
                }}
              >
                {Array.from(
                  { length: COLS * ROWS },
                  (_, idx) => `panel-${idx}`,
                ).map((panelKey) => (
                  <div
                    key={panelKey}
                    className="border border-cyan-400 rounded-sm"
                    style={{ background: "rgba(10, 40, 80, 0.30)" }}
                  />
                ))}
              </div>
            </div>
            {/* Row labels on left */}
            <div
              className="absolute left-1 pointer-events-none"
              style={{
                top: "12%",
                height: "76%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              {["ROW 1", "ROW 2", "ROW 3"].map((r) => (
                <span
                  key={r}
                  className="text-yellow-400 font-bold"
                  style={{ fontSize: "9px" }}
                >
                  {r}
                </span>
              ))}
            </div>
            {/* Camera controls */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
              <button
                type="button"
                onClick={flipCamera}
                className="bg-gray-800/90 text-white text-xs px-3 py-2 rounded-xl font-semibold border border-gray-600"
              >
                🔄 Flip
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="bg-green-600 text-white text-sm px-6 py-2 rounded-xl font-bold shadow-lg border-2 border-green-400"
              >
                📸 Capture Layout Plan
              </button>
            </div>
          </div>
        )}

        {/* Captured Photo */}
        {photo && (
          <div className="rounded-2xl overflow-hidden border-2 border-green-500 shadow-xl mb-4">
            <img
              src={photo}
              alt="Solar Panel Layout Plan"
              className="w-full block"
            />
          </div>
        )}

        {/* Action Buttons */}
        {photo && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={retake}
                className="flex-1 bg-gray-700 text-white text-sm py-3 rounded-xl font-semibold border border-gray-600"
              >
                📷 Retake
              </button>
              <button
                type="button"
                onClick={download}
                className="flex-1 bg-blue-700 text-white text-sm py-3 rounded-xl font-semibold border border-blue-500"
              >
                ⬇ Download Plan
              </button>
            </div>
            <button
              type="button"
              onClick={shareWhatsApp}
              className="w-full bg-green-600 text-white text-sm py-3 rounded-xl font-bold shadow-md border border-green-400"
            >
              📱 Share Plan on WhatsApp
            </button>
          </div>
        )}

        {/* Location display */}
        <div className="mt-4 text-center text-xs text-gray-500">
          📍 {location}
        </div>

        {/* Hidden canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  );
}
