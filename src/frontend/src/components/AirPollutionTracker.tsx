import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useRef, useState } from "react";

const GUJARAT_CITIES = [
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { name: "Surat", lat: 21.1702, lon: 72.8311 },
  { name: "Vadodara", lat: 22.3072, lon: 73.1812 },
  { name: "Rajkot", lat: 22.3039, lon: 70.8022 },
  { name: "Gandhinagar", lat: 23.2156, lon: 72.6369 },
  { name: "Bhavnagar", lat: 21.7645, lon: 72.1519 },
  { name: "Jamnagar", lat: 22.4707, lon: 70.0577 },
  { name: "Junagadh", lat: 21.5222, lon: 70.4579 },
  { name: "Amreli", lat: 21.6042, lon: 71.2214 },
  { name: "Anand", lat: 22.5645, lon: 72.9289 },
  { name: "Bhuj", lat: 23.2419, lon: 69.6669 },
  { name: "Navsari", lat: 20.9467, lon: 72.952 },
  { name: "Mehsana", lat: 23.588, lon: 72.3693 },
  { name: "Porbandar", lat: 21.6437, lon: 69.6016 },
  { name: "Surendranagar", lat: 22.727, lon: 71.6479 },
];

const GAUGE_SEGMENTS = [
  { label: "Good", color: "#00b050" },
  { label: "Satisfactory", color: "#70ad47" },
  { label: "Moderate", color: "#ffbf00" },
  { label: "Poor", color: "#ff6600" },
  { label: "Very Poor", color: "#cc0000" },
  { label: "Severe", color: "#7b0099" },
];

type AQICategory = {
  label: string;
  color: string;
  bg: string;
  border: string;
};

function getAQICategory(pm25: number): AQICategory {
  if (pm25 <= 30)
    return {
      label: "Good",
      color: "#00b050",
      bg: "#e8f5e9",
      border: "#00b050",
    };
  if (pm25 <= 60)
    return {
      label: "Satisfactory",
      color: "#70ad47",
      bg: "#f1f8e9",
      border: "#70ad47",
    };
  if (pm25 <= 90)
    return {
      label: "Moderate",
      color: "#ffbf00",
      bg: "#fffde7",
      border: "#ffbf00",
    };
  if (pm25 <= 120)
    return {
      label: "Poor",
      color: "#ff6600",
      bg: "#fff3e0",
      border: "#ff6600",
    };
  if (pm25 <= 250)
    return {
      label: "Very Poor",
      color: "#cc0000",
      bg: "#fce4ec",
      border: "#cc0000",
    };
  return {
    label: "Severe",
    color: "#7b0099",
    bg: "#f3e5f5",
    border: "#7b0099",
  };
}

type CityData = {
  name: string;
  pm25: number | null;
  pm10: number | null;
  error: boolean;
};

async function fetchCityAQI(city: {
  name: string;
  lat: number;
  lon: number;
}): Promise<CityData> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=pm2_5,pm10,european_aqi`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed");
  const data = await res.json();
  return {
    name: city.name,
    pm25: data.current?.pm2_5 ?? null,
    pm10: data.current?.pm10 ?? null,
    error: false,
  };
}

export default function AirPollutionTracker() {
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled(GUJARAT_CITIES.map(fetchCityAQI));
    const data = results.map((r, i) =>
      r.status === "fulfilled"
        ? r.value
        : { name: GUJARAT_CITIES[i].name, pm25: null, pm10: null, error: true },
    );
    setCityData(data);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, 5 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAll]);

  const validCities = cityData.filter((c) => c.pm25 !== null);
  const avgPm25 =
    validCities.length > 0
      ? validCities.reduce((sum, c) => sum + (c.pm25 ?? 0), 0) /
        validCities.length
      : null;

  function buildWhatsAppMessage() {
    const now = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const lines = cityData
      .map((c) =>
        c.error || c.pm25 === null
          ? `${c.name}: Data unavailable`
          : `${c.name}: ${c.pm25.toFixed(1)} µg/m³ (${getAQICategory(c.pm25).label})`,
      )
      .join("\n");
    const avgLine =
      avgPm25 !== null
        ? `⚠️ Average PM2.5: ${avgPm25.toFixed(1)} µg/m³ - ${getAQICategory(avgPm25).label}`
        : "⚠️ Average PM2.5: Calculating...";
    return encodeURIComponent(
      `🌬️ Gujarat Air Quality Report - ${now}\n\n📊 City-wise AQI (PM2.5 µg/m³):\n${lines}\n\n${avgLine}\n\nSource: MADHV Solar Energy Air Monitor`,
    );
  }

  const gaugeMax = 400;
  const markerPos =
    avgPm25 !== null ? Math.min((avgPm25 / gaugeMax) * 100, 100) : null;

  return (
    <section
      id="air-quality"
      className="py-16 px-4"
      style={{
        background:
          "linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 50%, #f0f4ff 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <h2 className="text-3xl font-bold" style={{ color: "#0B2A44" }}>
              🌬️ Gujarat Air Quality Index
            </h2>
            <Badge
              className="text-xs px-3 py-1"
              style={{ background: "#1F7A8C", color: "white" }}
            >
              🔄 Auto-updates every 5 min
            </Badge>
          </div>
          <p className="text-gray-600 mb-2">
            Real-time air pollution data for all major Gujarat cities
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-400">
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}
            </p>
          )}
        </div>

        {/* Pollution Gauge Meter */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
            <h3 className="font-semibold text-gray-700">
              📊 Average AQI Meter (Gujarat)
            </h3>
            {avgPm25 !== null && (
              <span
                className="font-bold text-lg"
                style={{ color: getAQICategory(avgPm25).color }}
              >
                {avgPm25.toFixed(1)} µg/m³ — {getAQICategory(avgPm25).label}
              </span>
            )}
          </div>
          <div
            className="relative h-8 rounded-full overflow-hidden flex"
            style={{ boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)" }}
          >
            {GAUGE_SEGMENTS.map((seg) => (
              <div
                key={seg.label}
                className="flex-1 flex items-center justify-center text-white text-xs font-semibold"
                style={{ background: seg.color, opacity: 0.85 }}
              >
                <span className="hidden sm:inline truncate px-1">
                  {seg.label}
                </span>
              </div>
            ))}
            {markerPos !== null && (
              <div
                className="absolute top-0 h-full w-1 bg-white shadow-lg"
                style={{
                  left: `${markerPos}%`,
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              />
            )}
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>0 (Good)</span>
            <span>90</span>
            <span>120</span>
            <span>250</span>
            <span>400+ (Severe)</span>
          </div>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
          {loading && cityData.length === 0
            ? GUJARAT_CITIES.map((city) => (
                <div
                  key={city.name}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-10 w-16 mb-2" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))
            : cityData.map((city, i) => {
                const cat =
                  city.pm25 !== null ? getAQICategory(city.pm25) : null;
                return (
                  <div
                    key={city.name}
                    data-ocid={`air_quality.item.${i + 1}`}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative overflow-hidden transition-transform hover:scale-105"
                    style={{
                      borderLeft: `4px solid ${cat ? cat.border : "#ccc"}`,
                    }}
                  >
                    {cat && (
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{ background: cat.bg }}
                      />
                    )}
                    <div className="relative z-10">
                      <p
                        className="font-bold text-sm mb-1"
                        style={{ color: "#0B2A44" }}
                      >
                        {city.name}
                      </p>
                      {city.error ? (
                        <p className="text-xs text-gray-400">
                          Data unavailable
                        </p>
                      ) : city.pm25 === null ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <>
                          <p
                            className="text-2xl font-extrabold"
                            style={{ color: cat?.color }}
                          >
                            {city.pm25.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-500">µg/m³ PM2.5</p>
                          <span
                            className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: cat?.bg, color: cat?.color }}
                          >
                            {cat?.label}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>

        {/* WhatsApp Share Buttons */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-center text-gray-700 mb-4">
            📲 Share Air Quality Report via WhatsApp
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              data-ocid="air_quality.primary_button"
              className="flex-1 max-w-xs py-3 text-white font-bold text-sm rounded-xl shadow-md transition-transform hover:scale-105"
              style={{ background: "#25D366" }}
              onClick={() => {
                window.open(
                  `https://wa.me/919428787879?text=${buildWhatsAppMessage()}`,
                  "_blank",
                );
              }}
            >
              📲 Share with Maulik Solanki
            </Button>
            <Button
              data-ocid="air_quality.secondary_button"
              className="flex-1 max-w-xs py-3 text-white font-bold text-sm rounded-xl shadow-md transition-transform hover:scale-105"
              style={{ background: "#128C7E" }}
              onClick={() => {
                window.open(
                  `https://wa.me/919574166656?text=${buildWhatsAppMessage()}`,
                  "_blank",
                );
              }}
            >
              📲 Share with Ashwin Teraiya
            </Button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Sends a full city-wise AQI report with current PM2.5 readings
          </p>
        </div>
      </div>
    </section>
  );
}
