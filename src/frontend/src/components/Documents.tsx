const DOCUMENTS = [
  "લાઇટ બિલ & વેરા બિલ/ઇન્ડેક્સ કોપી",
  "આધાર કાર્ડ & પાન કાર્ડ",
  "ઓરીજનલ કેન્સલ ચેક",
];

export default function Documents() {
  return (
    <section id="documents" className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-2">
          :: રેસિડેન્સીયલ ડોક્યુમેન્ટ માટે ::
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          For Residential Solar Installation Documents
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-green-100">
            <img
              src="/assets/uploads/unnamed_-_2026-03-11t155712.347-019d2f21-e562-755e-b720-ebdba524e1d4-2.jpg"
              alt="Residential Document Requirements - Madhav Solar"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-bold text-green-800 text-lg mb-4">
                📋 જરૂરી દસ્તાવેજો
              </h3>
              <ul className="space-y-3">
                {DOCUMENTS.map((doc) => (
                  <li key={doc} className="flex items-start gap-3">
                    <span className="text-green-600 text-xl mt-0.5">✅</span>
                    <span className="text-gray-700 font-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact box */}
            <div className="bg-white rounded-2xl p-5 border-2 border-green-300 shadow">
              <p className="text-sm font-semibold text-gray-600 mb-1">
                📞 સંપર્ક:
              </p>
              <p className="text-green-800 font-bold text-base">
                મૌલિક બી સોલંકી
              </p>
              <p className="text-gray-700 font-semibold">મોબાઈલ: 9428787879</p>
              <a
                href="https://wa.me/919428787879?text=Hello%20Madhav%20Solar%2C%20I%20need%20information%20about%20documents%20required%20for%20solar%20installation."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-95 hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
                data-ocid="documents.primary_button"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp for Documents Info
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
