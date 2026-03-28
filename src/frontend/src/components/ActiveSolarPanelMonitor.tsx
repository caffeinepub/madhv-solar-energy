import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const SYSTEM_SIZES = [2.32, 2.9, 3.48, 4.06, 4.64, 5.22];
const DEFAULT_SIZE = 3.48;
const PGVCL_RATE = 5; // ₹/unit
const CO2_PER_KWH = 0.82; // kg

function getSolarFactor(): number {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  // Peak 10am-3pm, zero before 6am and after 7pm
  if (hour < 6 || hour > 19) return 0;
  if (hour >= 10 && hour <= 15) return 1;
  if (hour < 10) return (hour - 6) / 4; // ramp up
  return (19 - hour) / 4; // ramp down
}

function getTemperature(outputFactor: number): number {
  return Math.round(25 + outputFactor * 40);
}

export default function ActiveSolarPanelMonitor() {
  const [systemKw, setSystemKw] = useState(DEFAULT_SIZE);
  const [outputFactor, setOutputFactor] = useState(() => getSolarFactor());
  const [fluctuation, setFluctuation] = useState(1.0);
  const [energyKwh, setEnergyKwh] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer to auto-start
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Update output every 2 seconds
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      const factor = getSolarFactor();
      const fluct = 0.95 + Math.random() * 0.1; // ±5%
      setOutputFactor(factor);
      setFluctuation(fluct);
      // Accumulate energy: 2 seconds of generation
      const currentOutput = systemKw * factor * fluct; // kW
      setEnergyKwh((prev) => prev + currentOutput * (2 / 3600));
    }, 2000);
    return () => clearInterval(interval);
  }, [isVisible, systemKw]);

  const effectiveFactor = outputFactor * fluctuation;
  const currentWatts = Math.round(systemKw * 1000 * effectiveFactor);
  const peakPercent = Math.round(effectiveFactor * 100);
  const savingsRs = energyKwh * PGVCL_RATE;
  const co2Saved = energyKwh * CO2_PER_KWH;
  const temperature = getTemperature(effectiveFactor);
  const isActive = effectiveFactor > 0.01;

  const waLink =
    "https://wa.me/919428787879?text=મને%20Madhav%20Solar%20Energy%20નો%20Active%20Solar%20Panel%20Monitor%20જોઈ%20ને%20ખૂબ%20ગમ્યું!%20કૃપા%20કરી%20મને%20Solar%20System%20વિશે%20માહિતી%20આપો.";

  return (
    <section
      ref={sectionRef}
      className="py-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800"
      data-ocid="solar-monitor.section"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            ⚡ Active Solar Panel Monitor
          </h2>
          <span className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-sm font-semibold text-red-400 tracking-widest">
              LIVE
            </span>
          </span>
        </div>

        {/* System Size Selector */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          data-ocid="solar-monitor.panel"
        >
          <span className="text-sm text-slate-400 w-full mb-1">
            સિસ્ટમ સાઇઝ પસંદ કરો:
          </span>
          {SYSTEM_SIZES.map((kw) => (
            <button
              type="button"
              key={kw}
              onClick={() => setSystemKw(kw)}
              data-ocid="solar-monitor.toggle"
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                systemKw === kw
                  ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-slate-700 border-slate-600 text-slate-300 hover:border-orange-400 hover:text-orange-300"
              }`}
            >
              {kw} kW
            </button>
          ))}
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isActive ? "active" : "inactive"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-2xl ${
                isActive
                  ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                  : "bg-slate-700/50 border-2 border-slate-500 text-slate-400"
              }`}
            >
              {isActive ? (
                <>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                    }}
                  >
                    ☀️
                  </motion.span>
                  <span>ACTIVE</span>
                </>
              ) : (
                <>
                  <span>🌙</span>
                  <span>INACTIVE</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Power Output */}
          <Card className="bg-slate-800/80 border-orange-500/30 col-span-2 md:col-span-2">
            <CardContent className="pt-4 pb-4">
              <p className="text-slate-400 text-xs mb-1">
                Current Power Output
              </p>
              <motion.p
                key={currentWatts}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-orange-400"
              >
                {currentWatts.toLocaleString()}
                <span className="text-lg text-orange-300 ml-1">W</span>
              </motion.p>
              {/* Capacity Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Peak Capacity</span>
                  <span>{peakPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400"
                    animate={{ width: `${peakPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Energy Generated */}
          <Card className="bg-slate-800/80 border-green-500/30">
            <CardContent className="pt-4 pb-4">
              <p className="text-slate-400 text-xs mb-1">Energy Generated</p>
              <motion.p
                key={Math.floor(energyKwh * 100)}
                animate={{ opacity: [0.7, 1] }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-green-400"
              >
                {energyKwh.toFixed(3)}
              </motion.p>
              <p className="text-green-300 text-xs">kWh today</p>
            </CardContent>
          </Card>

          {/* Savings */}
          <Card className="bg-slate-800/80 border-yellow-500/30">
            <CardContent className="pt-4 pb-4">
              <p className="text-slate-400 text-xs mb-1">Today's Savings</p>
              <motion.p
                key={Math.floor(savingsRs * 100)}
                animate={{ opacity: [0.7, 1] }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-yellow-400"
              >
                ₹{savingsRs.toFixed(2)}
              </motion.p>
              <p className="text-yellow-300 text-xs">@ ₹{PGVCL_RATE}/unit</p>
            </CardContent>
          </Card>

          {/* CO2 Saved */}
          <Card className="bg-slate-800/80 border-emerald-500/30">
            <CardContent className="pt-4 pb-4">
              <p className="text-slate-400 text-xs mb-1">CO₂ Saved</p>
              <motion.p
                key={Math.floor(co2Saved * 1000)}
                animate={{ opacity: [0.7, 1] }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-emerald-400"
              >
                {co2Saved.toFixed(4)}
              </motion.p>
              <p className="text-emerald-300 text-xs">kg CO₂</p>
            </CardContent>
          </Card>

          {/* Panel Temperature */}
          <Card className="bg-slate-800/80 border-red-400/30">
            <CardContent className="pt-4 pb-4">
              <p className="text-slate-400 text-xs mb-1">Panel Temp</p>
              <motion.p
                key={temperature}
                animate={{ opacity: [0.7, 1] }}
                transition={{ duration: 0.5 }}
                className={`text-2xl font-bold ${
                  temperature > 55
                    ? "text-red-400"
                    : temperature > 40
                      ? "text-orange-400"
                      : "text-blue-400"
                }`}
              >
                {temperature}°C
              </motion.p>
              <p className="text-slate-400 text-xs">
                {temperature > 55
                  ? "🔥 Hot"
                  : temperature > 40
                    ? "☀️ Warm"
                    : "❄️ Cool"}
              </p>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="bg-slate-800/80 border-blue-400/30">
            <CardContent className="pt-4 pb-4">
              <p className="text-slate-400 text-xs mb-1">System Size</p>
              <p className="text-2xl font-bold text-blue-400">{systemKw}</p>
              <p className="text-blue-300 text-xs">kW WAAREE 580W</p>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        {!isVisible && (
          <p className="text-slate-500 text-center text-sm mb-6">
            Scroll into view to start monitoring...
          </p>
        )}
        {isVisible && !isActive && (
          <div className="text-center mb-6">
            <Badge className="bg-slate-700 text-slate-300 text-sm py-1.5 px-4">
              🌙 સૂર્ય ઉગ્યા પછી (6am–7pm) પેનલ active થશે
            </Badge>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-green-600/30"
            data-ocid="solar-monitor.button"
          >
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              📲 Get This System on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
