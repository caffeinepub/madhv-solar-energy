import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Clock,
  IndianRupee,
  Leaf,
  Sun,
  TrendingDown,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

// Gujarat PGVCL Cities
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

// PGVCL LT-2 Domestic Tariff Slabs (Auto Updated 2025-26)
const PGVCL_SLABS = [
  { limit: 50, rate: 3.55 },
  { limit: 100, rate: 4.1 },
  { limit: 200, rate: 5.2 },
  { limit: 400, rate: 5.95 },
  { limit: Number.POSITIVE_INFINITY, rate: 7.1 },
];

const FIXED_CHARGE_PER_KW = 35;
const UNITS_PER_KW_MONTH = 150;
const COST_PER_KW = 60000;
const CO2_PER_KWH = 0.82;

function calcUnitsFromBill(bill: number): number {
  let remaining = bill - FIXED_CHARGE_PER_KW * 1;
  let totalUnits = 0;
  let prev = 0;
  for (const slab of PGVCL_SLABS) {
    const slabUnits =
      slab.limit === Number.POSITIVE_INFINITY
        ? Number.POSITIVE_INFINITY
        : slab.limit - prev;
    const slabCost = slabUnits * slab.rate;
    if (remaining <= 0) break;
    if (remaining <= slabCost) {
      totalUnits += remaining / slab.rate;
      remaining = 0;
      break;
    }
    totalUnits +=
      slabUnits === Number.POSITIVE_INFINITY
        ? remaining / slab.rate
        : slabUnits;
    remaining -= slabUnits === Number.POSITIVE_INFINITY ? remaining : slabCost;
    prev = slab.limit === Number.POSITIVE_INFINITY ? prev : slab.limit;
  }
  return Math.max(totalUnits, bill / 7.1);
}

function getEffectiveRate(units: number): number {
  let totalCost = 0;
  let prev = 0;
  for (const slab of PGVCL_SLABS) {
    if (units <= prev) break;
    const slabMax =
      slab.limit === Number.POSITIVE_INFINITY
        ? units
        : Math.min(slab.limit, units);
    totalCost += (slabMax - prev) * slab.rate;
    prev = slabMax;
    if (prev >= units) break;
  }
  return totalCost / units;
}

function calcSubsidy(kw: number): number {
  if (kw <= 2) return kw * 30000;
  if (kw <= 3) return 2 * 30000 + (kw - 2) * 18000;
  return 78000;
}

interface CalcResult {
  systemKW: number;
  monthlyUnits: number;
  effectiveRate: number;
  baseCost: number;
  subsidy: number;
  finalCost: number;
  monthlySavings: number;
  yearlySavings: number;
  payback: number;
  co2Yearly: number;
  avgBill: number;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

export default function SolarCalculator() {
  const [bill1, setBill1] = useState("");
  const [bill2, setBill2] = useState("");
  const [city, setCity] = useState("AMRELI");
  const [roofArea, setRoofArea] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [showQuotation, setShowQuotation] = useState(false);
  const quotationRef = useRef<HTMLDivElement>(null);

  const b1 = Number.parseFloat(bill1) || 0;
  const b2 = Number.parseFloat(bill2) || 0;
  const avgBillPreview =
    b1 > 0 && b2 > 0 ? (b1 + b2) / 2 : b1 > 0 ? b1 : b2 > 0 ? b2 : 0;

  function calculate() {
    if (avgBillPreview <= 0) return;
    const avgBill = avgBillPreview;
    const monthlyUnits = calcUnitsFromBill(avgBill);
    const effectiveRate = getEffectiveRate(monthlyUnits);

    let systemKW = monthlyUnits / UNITS_PER_KW_MONTH;
    if (roofArea) {
      const maxKW = Number.parseFloat(roofArea) / 80;
      if (maxKW > 0) systemKW = Math.min(systemKW, maxKW);
    }
    systemKW = Math.max(1, Math.ceil(systemKW * 10) / 10);

    const baseCost = systemKW * COST_PER_KW;
    const subsidy = calcSubsidy(systemKW);
    const finalCost = baseCost - subsidy;
    const monthlySavings = Math.min(
      systemKW * UNITS_PER_KW_MONTH * effectiveRate,
      avgBill,
    );
    const yearlySavings = monthlySavings * 12;
    const payback = finalCost / yearlySavings;
    const co2Yearly = systemKW * UNITS_PER_KW_MONTH * 12 * CO2_PER_KWH;

    setResult({
      systemKW,
      monthlyUnits: Math.round(monthlyUnits),
      effectiveRate,
      baseCost,
      subsidy,
      finalCost,
      monthlySavings,
      yearlySavings,
      payback,
      co2Yearly,
      avgBill,
    });
  }

  function handlePrint() {
    window.print();
  }

  function handleWhatsApp() {
    if (!result) return;
    const msg = encodeURIComponent(
      `🌞 SOLAR QUOTATION REQUEST\n\nCity: ${city}\nAvg Monthly Bill: ₹${fmt(result.avgBill)}\nRecommended System: ${result.systemKW} kW\nBase Cost: ₹${fmt(result.baseCost)}\nGovt Subsidy: -₹${fmt(result.subsidy)}\nFinal Cost: ₹${fmt(result.finalCost)}\nMonthly Savings: ₹${fmt(result.monthlySavings)}\nYearly Savings: ₹${fmt(result.yearlySavings)}\nPayback Period: ${result.payback.toFixed(1)} years\n\nPlease confirm this quotation. Thank you!`,
    );
    window.open(`https://wa.me/919428787879?text=${msg}`, "_blank");
  }

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className="py-16 bg-gradient-to-b from-amber-50 to-orange-50"
      id="solar-calculator"
    >
      {/* Print style — only quotation-print-area visible on print */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #quotation-print-area, #quotation-print-area * { visibility: visible; }
          #quotation-print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-orange-100 text-orange-700 border-orange-200 text-sm px-3 py-1">
            PGVCL Gujarat 2025-26 | Auto Updated Rates
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[oklch(0.225_0.058_239)] mb-2">
            સોલાર સિસ્ટમ કેલ્ક્યુલેટર
          </h2>
          <p className="text-xl font-semibold text-[oklch(0.515_0.095_210)] mb-1">
            Solar System Calculator
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Automatic PGVCL Gujarat LT-2 Tiered Rates &amp; PM Surya Ghar
            Subsidy 2025-26
          </p>
        </div>

        {/* PGVCL Rate Table */}
        <Card className="mb-6 border border-blue-100 rounded-xl bg-blue-50/60">
          <CardContent className="p-4">
            <p className="text-center text-sm font-bold text-blue-700 mb-3">
              ⚡ PGVCL LT-2 Domestic Tariff Slabs (Gujarat Electric — 2025-26)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-center">
                <thead>
                  <tr className="bg-blue-100 text-blue-800">
                    <th className="p-2 rounded-l-lg">Units Consumed</th>
                    <th className="p-2">Rate (₹/unit)</th>
                    <th className="p-2 rounded-r-lg">Slab</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-blue-100">
                    <td className="p-2">0 – 50 units</td>
                    <td className="p-2 font-semibold text-green-700">₹3.55</td>
                    <td className="p-2">Slab 1</td>
                  </tr>
                  <tr className="border-b border-blue-100 bg-white/50">
                    <td className="p-2">51 – 100 units</td>
                    <td className="p-2 font-semibold text-green-700">₹4.10</td>
                    <td className="p-2">Slab 2</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="p-2">101 – 200 units</td>
                    <td className="p-2 font-semibold text-yellow-700">₹5.20</td>
                    <td className="p-2">Slab 3</td>
                  </tr>
                  <tr className="border-b border-blue-100 bg-white/50">
                    <td className="p-2">201 – 400 units</td>
                    <td className="p-2 font-semibold text-orange-600">₹5.95</td>
                    <td className="p-2">Slab 4</td>
                  </tr>
                  <tr>
                    <td className="p-2">400+ units</td>
                    <td className="p-2 font-semibold text-red-600">₹7.10</td>
                    <td className="p-2">Slab 5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-blue-500 mt-2">
              + Fixed charge ₹35/kW/month | Source: PGVCL Tariff Order 2025-26
            </p>
          </CardContent>
        </Card>

        {/* Calculator Card */}
        <Card className="shadow-xl border-2 border-orange-200 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-1" />
          <CardContent className="p-6 md:p-8">
            {/* Two-month Bill Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              <div className="space-y-2">
                <Label
                  htmlFor="bill-month1"
                  className="font-semibold text-gray-700 flex items-center gap-2"
                >
                  <IndianRupee className="w-4 h-4 text-orange-500" />
                  Bill Month 1 (₹)
                </Label>
                <Input
                  id="bill-month1"
                  type="number"
                  placeholder="e.g. 4500"
                  value={bill1}
                  onChange={(e) => setBill1(e.target.value)}
                  className="border-orange-200 focus-visible:ring-orange-400 text-lg"
                  data-ocid="calculator.input"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="bill-month2"
                  className="font-semibold text-gray-700 flex items-center gap-2"
                >
                  <IndianRupee className="w-4 h-4 text-orange-500" />
                  Bill Month 2 (₹)
                </Label>
                <Input
                  id="bill-month2"
                  type="number"
                  placeholder="e.g. 5000"
                  value={bill2}
                  onChange={(e) => setBill2(e.target.value)}
                  className="border-orange-200 focus-visible:ring-orange-400 text-lg"
                  data-ocid="calculator.input"
                />
              </div>
            </div>

            {/* Average Bill Badge */}
            <AnimatePresence>
              {avgBillPreview > 0 && (
                <motion.div
                  key="avg-badge"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center mb-5"
                >
                  <span className="bg-orange-100 text-orange-700 border border-orange-300 text-sm font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Average Bill: ₹{fmt(avgBillPreview)}
                    {b1 > 0 && b2 > 0 && (
                      <span className="text-xs font-normal text-orange-500 ml-1">
                        (2 months avg)
                      </span>
                    )}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="space-y-2">
                <Label
                  htmlFor="city-select"
                  className="font-semibold text-gray-700"
                >
                  <Sun className="inline w-4 h-4 mr-1 text-orange-500" />
                  City (PGVCL Gujarat)
                </Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger
                    id="city-select"
                    className="border-orange-200 focus:ring-orange-400"
                    data-ocid="calculator.select"
                  >
                    <SelectValue />
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
              <div className="space-y-2">
                <Label
                  htmlFor="roof-area"
                  className="font-semibold text-gray-700"
                >
                  <Leaf className="inline w-4 h-4 mr-1 text-green-500" />
                  Roof Area (sq ft) — Optional
                </Label>
                <Input
                  id="roof-area"
                  type="number"
                  placeholder="e.g. 600"
                  value={roofArea}
                  onChange={(e) => setRoofArea(e.target.value)}
                  className="border-orange-200 focus-visible:ring-orange-400"
                  data-ocid="calculator.input"
                />
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <Button
                onClick={calculate}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-5 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
                data-ocid="calculator.primary_button"
              >
                <Zap className="mr-2 w-5 h-5" />⚡ CALCULATE
              </Button>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  data-ocid="calculator.panel"
                >
                  <div className="border-t-2 border-orange-100 pt-6">
                    {/* Auto Rate Badge */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                        ⚡ Auto Rate: ₹{result.effectiveRate.toFixed(2)}/unit
                        (PGVCL slab) | ~{result.monthlyUnits} units/month
                      </span>
                    </div>

                    <h3 className="text-center text-lg font-bold text-gray-700 mb-5">
                      📊 તમારા સોલાર સ્ટેટ્સ | Your Solar Stats — {city}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                        <Sun className="mx-auto mb-2 w-7 h-7 text-blue-500" />
                        <p className="text-2xl font-extrabold text-blue-700">
                          {result.systemKW} kW
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended System Size
                        </p>
                      </div>
                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                        <IndianRupee className="mx-auto mb-2 w-7 h-7 text-orange-500" />
                        <p className="text-2xl font-extrabold text-orange-700">
                          ₹{fmt(result.baseCost)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Base Installation Cost
                        </p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <TrendingDown className="mx-auto mb-2 w-7 h-7 text-green-600" />
                        <p className="text-2xl font-extrabold text-green-700">
                          -₹{fmt(result.subsidy)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Govt Subsidy (PM Surya Ghar)
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-4 text-center shadow-md">
                        <IndianRupee className="mx-auto mb-2 w-7 h-7 text-white" />
                        <p className="text-2xl font-extrabold text-white">
                          ₹{fmt(result.finalCost)}
                        </p>
                        <p className="text-xs text-orange-100 mt-1">
                          Final Cost After Subsidy
                        </p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                        <IndianRupee className="mx-auto mb-2 w-7 h-7 text-emerald-500" />
                        <p className="text-2xl font-extrabold text-emerald-700">
                          ₹{fmt(result.monthlySavings)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Monthly Savings 💰
                        </p>
                      </div>
                      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-center">
                        <IndianRupee className="mx-auto mb-2 w-7 h-7 text-teal-500" />
                        <p className="text-2xl font-extrabold text-teal-700">
                          ₹{fmt(result.yearlySavings)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Yearly Savings 🎉
                        </p>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                        <Clock className="mx-auto mb-2 w-7 h-7 text-amber-500" />
                        <p className="text-2xl font-extrabold text-orange-500">
                          {result.payback.toFixed(1)} yrs
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Payback Period ⏱️
                        </p>
                      </div>
                      <div className="bg-lime-50 border border-lime-200 rounded-xl p-4 text-center">
                        <Leaf className="mx-auto mb-2 w-7 h-7 text-lime-600" />
                        <p className="text-2xl font-extrabold text-lime-700">
                          {fmt(result.co2Yearly)} kg
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          CO₂ Saved/Year 🌱
                        </p>
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-5">
                      * Auto-calculated using PGVCL LT-2 tiered slab rates
                      2025-26. System size based on 150 units/kW/month,
                      ₹60,000/kW installation.
                    </p>

                    {/* Generate Quotation Button */}
                    <div className="mt-6">
                      <Button
                        onClick={() => setShowQuotation(true)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-base py-5 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95"
                        data-ocid="calculator.open_modal_button"
                      >
                        📄 Generate Quotation
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-5">
          📞 For a free site visit &amp; exact quote, call{" "}
          <a
            href="tel:+919428787879"
            className="font-semibold text-orange-600 hover:underline"
          >
            Maulik Solanki: +91 94287 87879
          </a>
        </p>
      </div>

      {/* Quotation Modal */}
      <AnimatePresence>
        {showQuotation && result && (
          <motion.div
            key="quotation-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={(e) =>
              e.target === e.currentTarget && setShowQuotation(false)
            }
            data-ocid="calculator.modal"
          >
            <motion.div
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="w-full max-w-2xl my-6"
            >
              {/* Close Button */}
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => setShowQuotation(false)}
                  className="bg-white text-gray-600 hover:text-red-500 rounded-full p-2 shadow-lg transition-colors"
                  data-ocid="calculator.close_button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quotation Card */}
              <div
                id="quotation-print-area"
                ref={quotationRef}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-green-400"
              >
                {/* Top accent bar */}
                <div className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-green-500" />

                {/* Header */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-blue-50 border-b-2 border-green-100">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/uploads/images_1-019d2f59-5b0b-732a-9e31-6cc115d5193d-1.png"
                      alt="Madhav Solar Energy Logo"
                      className="w-16 h-16 object-contain rounded-xl border border-green-100 bg-white p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div>
                      <h1 className="text-lg font-extrabold text-green-700 leading-tight">
                        MADHAV SOLAR ENERGY
                      </h1>
                      <p className="text-xs text-blue-600 font-semibold">
                        ☀️ Authorized Waaree Franchise Partner
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-600 leading-relaxed">
                    <p className="font-semibold text-gray-800">
                      Shop No. 11, First Floor
                    </p>
                    <p>IDFC Bank Building, Marketing Yard</p>
                    <p>Amreli, Gujarat</p>
                    <p className="mt-1">
                      <a
                        href="tel:+919428787879"
                        className="text-green-700 font-semibold"
                      >
                        +91 94287 87879
                      </a>
                      {" | "}
                      <a
                        href="tel:+919574166656"
                        className="text-green-700 font-semibold"
                      >
                        +91 95741 66656
                      </a>
                    </p>
                  </div>
                </div>

                {/* Quotation Title */}
                <div className="text-center py-4 bg-green-600">
                  <h2 className="text-xl font-extrabold text-white tracking-widest">
                    SOLAR SYSTEM QUOTATION
                  </h2>
                  <p className="text-green-100 text-xs mt-1">Date: {today}</p>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      City / Location
                    </p>
                    <p className="text-base font-bold text-gray-800">{city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Avg. Monthly Bill
                    </p>
                    <p className="text-base font-bold text-orange-600">
                      ₹{fmt(result.avgBill)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Recommended System
                    </p>
                    <p className="text-base font-bold text-blue-700">
                      {result.systemKW} kW Solar System
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Est. Monthly Units
                    </p>
                    <p className="text-base font-bold text-gray-800">
                      {result.monthlyUnits} units/month
                    </p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="px-6 py-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-50 text-green-800">
                        <th className="text-left p-3 rounded-l-lg font-bold">
                          Description
                        </th>
                        <th className="text-right p-3 rounded-r-lg font-bold">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 text-gray-700">
                          🌞 Solar System — {result.systemKW} kW (WAAREE TOPCON
                          580W)
                        </td>
                        <td className="p-3 text-right font-semibold text-gray-800">
                          {result.systemKW} kW
                        </td>
                      </tr>
                      <tr className="bg-orange-50/50">
                        <td className="p-3 text-gray-700">
                          💼 Base Installation Cost (₹60,000/kW)
                        </td>
                        <td className="p-3 text-right font-semibold text-orange-700">
                          ₹{fmt(result.baseCost)}
                        </td>
                      </tr>
                      <tr className="bg-green-50/60">
                        <td className="p-3 text-green-700 font-medium">
                          🏛️ PM Surya Ghar Government Subsidy (-)
                        </td>
                        <td className="p-3 text-right font-bold text-green-700">
                          - ₹{fmt(result.subsidy)}
                        </td>
                      </tr>
                      <tr className="bg-gradient-to-r from-green-600 to-blue-600">
                        <td className="p-3 text-white font-extrabold text-base rounded-l-lg">
                          ✅ Final Cost After Subsidy
                        </td>
                        <td className="p-3 text-right text-white font-extrabold text-base rounded-r-lg">
                          ₹{fmt(result.finalCost)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 text-gray-700">
                          💰 Monthly Savings (Estimated)
                        </td>
                        <td className="p-3 text-right font-semibold text-emerald-700">
                          ₹{fmt(result.monthlySavings)}/month
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="p-3 text-gray-700">
                          🎉 Yearly Savings (Estimated)
                        </td>
                        <td className="p-3 text-right font-semibold text-emerald-700">
                          ₹{fmt(result.yearlySavings)}/year
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 text-gray-700">⏱️ Payback Period</td>
                        <td className="p-3 text-right font-semibold text-amber-600">
                          {result.payback.toFixed(1)} Years
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer Note */}
                <div className="mx-6 mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                  <p className="text-xs text-blue-700 font-semibold">
                    ✅ Valid for 30 days &nbsp;|&nbsp; 🏠 Free Site Survey
                    Included &nbsp;|&nbsp; 🌞 25-Year Panel Warranty
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    * Estimates based on PGVCL LT-2 rates 2025-26. Actual
                    savings may vary.
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-green-500" />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
                  data-ocid="calculator.secondary_button"
                >
                  ⬇️ Download Quotation
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
                  data-ocid="calculator.confirm_button"
                >
                  💬 Send on WhatsApp
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
