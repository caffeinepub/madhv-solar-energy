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

const RATE_PER_UNIT = 7;
const UNITS_PER_KW_MONTH = 150;
const COST_PER_KW = 60000;
const CO2_PER_KWH = 0.82;

function calcSubsidy(kw: number): number {
  if (kw <= 2) return kw * 30000;
  if (kw <= 3) return 2 * 30000 + (kw - 2) * 18000;
  return 78000;
}

interface CalcResult {
  systemKW: number;
  baseCost: number;
  subsidy: number;
  finalCost: number;
  monthlySavings: number;
  yearlySavings: number;
  payback: number;
  co2Yearly: number;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

export default function SolarCalculator() {
  const [bill, setBill] = useState("");
  const [city, setCity] = useState("AMRELI");
  const [roofArea, setRoofArea] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  function calculate() {
    const monthlyBill = Number.parseFloat(bill);
    if (!monthlyBill || monthlyBill <= 0) return;
    const monthlyUnits = monthlyBill / RATE_PER_UNIT;
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
      systemKW * UNITS_PER_KW_MONTH * RATE_PER_UNIT,
      monthlyBill,
    );
    const yearlySavings = monthlySavings * 12;
    const payback = finalCost / yearlySavings;
    const co2Yearly = systemKW * UNITS_PER_KW_MONTH * 12 * CO2_PER_KWH;
    setResult({
      systemKW,
      baseCost,
      subsidy,
      finalCost,
      monthlySavings,
      yearlySavings,
      payback,
      co2Yearly,
    });
  }

  return (
    <section
      className="py-16 bg-gradient-to-b from-amber-50 to-orange-50"
      id="calculator"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-orange-100 text-orange-700 border-orange-200 text-sm px-3 py-1">
            PGVCL Gujarat 2025
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[oklch(0.225_0.058_239)] mb-2">
            સોલાર સિસ્ટમ કેલ્ક્યુલેટર
          </h2>
          <p className="text-xl font-semibold text-[oklch(0.515_0.095_210)] mb-1">
            Solar System Calculator
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Based on PGVCL Gujarat rates &amp; PM Surya Ghar Subsidy 2025
          </p>
        </div>

        <Card className="shadow-xl border-2 border-orange-200 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-1" />
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="space-y-2">
                <Label
                  htmlFor="monthly-bill"
                  className="font-semibold text-gray-700"
                >
                  <IndianRupee className="inline w-4 h-4 mr-1 text-orange-500" />
                  Monthly Electricity Bill (₹)
                </Label>
                <Input
                  id="monthly-bill"
                  type="number"
                  placeholder="e.g. 5000"
                  value={bill}
                  onChange={(e) => setBill(e.target.value)}
                  className="border-orange-200 focus-visible:ring-orange-400 text-lg"
                  data-ocid="calculator.input"
                />
              </div>
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
                  data-ocid="calculator.roof_input"
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
                      * Estimates based on PGVCL avg rate ₹7/unit, 150
                      units/kW/month, ₹60,000/kW installation.
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
