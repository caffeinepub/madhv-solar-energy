const PRICE_DATA = [
  {
    panel: "Waaree",
    kw: 2.32,
    modules: 4,
    capacity: 580,
    ratePerKw: 42165,
    totalRate: 97823,
    gst: 8706,
    netPayable: 106529,
    subsidy: 65760,
    afterSubsidy: 40769,
  },
  {
    panel: "Waaree",
    kw: 2.9,
    modules: 5,
    capacity: 580,
    ratePerKw: 39911,
    totalRate: 115745,
    gst: 10301,
    netPayable: 126046,
    subsidy: 76200,
    afterSubsidy: 49846,
  },
  {
    panel: "Waaree",
    kw: 3.48,
    modules: 6,
    capacity: 580,
    ratePerKw: 39001,
    totalRate: 135725,
    gst: 12079,
    netPayable: 147804,
    subsidy: 78000,
    afterSubsidy: 69804,
  },
  {
    panel: "Waaree",
    kw: 4.06,
    modules: 7,
    capacity: 580,
    ratePerKw: 39367,
    totalRate: 159833,
    gst: 14225,
    netPayable: 174058,
    subsidy: 78000,
    afterSubsidy: 96058,
  },
  {
    panel: "Waaree",
    kw: 4.64,
    modules: 8,
    capacity: 580,
    ratePerKw: 39882,
    totalRate: 185054,
    gst: 16470,
    netPayable: 201523,
    subsidy: 78000,
    afterSubsidy: 123523,
  },
  {
    panel: "Waaree",
    kw: 5.22,
    modules: 9,
    capacity: 580,
    ratePerKw: 40153,
    totalRate: 209598,
    gst: 18654,
    netPayable: 228252,
    subsidy: 78000,
    afterSubsidy: 150252,
  },
];

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function PriceList() {
  return (
    <section id="price-list" className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-2">
          ☀️ Waaree TOPCON 580W — Solar System Pricing
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Madhav Solar Energy | Authorized Waaree Franchise Partner
        </p>

        {/* Promo callout */}
        <div className="bg-green-600 text-white rounded-2xl px-6 py-4 mb-8 text-center shadow-lg">
          <p className="text-xl sm:text-2xl font-bold">
            🎉 3 KW System at just ₹49,846/- માં જ
          </p>
          <p className="text-green-100 mt-1 text-sm font-medium">
            13000+ Happy Customers across Gujarat!
          </p>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-green-100">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                  Panel
                </th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                  KW
                </th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                  Modules
                </th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                  Capacity (W)
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  Rate/KW
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  Total Rate
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  GST 8.9%
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  Net Payable
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  Subsidy
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap bg-green-900">
                  After Subsidy ✅
                </th>
              </tr>
            </thead>
            <tbody>
              {PRICE_DATA.map((row, i) => (
                <tr
                  key={row.kw}
                  className={i % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  <td className="px-3 py-3 font-semibold text-green-700">
                    {row.panel}
                  </td>
                  <td className="px-3 py-3 text-center font-bold">{row.kw}</td>
                  <td className="px-3 py-3 text-center">{row.modules}</td>
                  <td className="px-3 py-3 text-center">{row.capacity}</td>
                  <td className="px-3 py-3 text-right">
                    {formatINR(row.ratePerKw)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {formatINR(row.totalRate)}
                  </td>
                  <td className="px-3 py-3 text-right">{formatINR(row.gst)}</td>
                  <td className="px-3 py-3 text-right">
                    {formatINR(row.netPayable)}
                  </td>
                  <td className="px-3 py-3 text-right text-orange-600 font-semibold">
                    {formatINR(row.subsidy)}
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-green-700 bg-green-100">
                    {formatINR(row.afterSubsidy)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          <p className="font-semibold">📌 નોંધ:</p>
          <p className="mt-1">
            ઉપર આપેલા રેટ માં ફ્રેબ્રીકેશન આગળની સાઈડથી 3 ફૂટ અને પાછળની સાઈડ થી 5 ફૂટ
            આવશો, તેના ભાવ અલગ રહેશે. All prices include government subsidy as
            applicable under PM Surya Ghar Yojana.
          </p>
        </div>
      </div>
    </section>
  );
}
