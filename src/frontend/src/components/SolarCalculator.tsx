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
import { Clock, IndianRupee, Leaf, Sun, TrendingDown, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

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
  const [city, setCity] = useState("AMRELI");
  const [roofArea, setRoofArea] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  function calculate() {
    const b1 = Number.parseFloat(bill1);
    if (!b1 || b1 <= 0) return;

    const avgBill = b1;

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

  return (
    <section
      className="py-16 bg-gradient-to-b from-amber-50 to-orange-50"
      id="solar-calculator"
    >
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
            {/* Single Bill Input */}
            <div className="mb-5 space-y-2">
              <Label
                htmlFor="bill-month1"
                className="font-semibold text-gray-700 flex items-center gap-2"
              >
                <IndianRupee className="w-4 h-4 text-orange-500" />
                Monthly Electricity Bill (₹)
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
    </section>
  );
}
