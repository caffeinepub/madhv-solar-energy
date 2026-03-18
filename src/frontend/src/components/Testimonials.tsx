import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const STARS = [1, 2, 3, 4, 5];

const testimonials = [
  {
    name: "James Harrington",
    role: "Homeowner, Austin TX",
    quote:
      "MADHV Solar transformed our home's energy consumption. Our electricity bill dropped by 85% in the first month. The installation team was professional, clean, and completed the job ahead of schedule.",
    rating: 5,
    initials: "JH",
  },
  {
    name: "Priya Nair",
    role: "Business Owner, Houston TX",
    quote:
      "We installed a 50kW commercial system for our warehouse. The ROI projections were accurate and the support team is always available. Best investment we've made for our business.",
    rating: 5,
    initials: "PN",
  },
  {
    name: "David & Lisa Chen",
    role: "Homeowners, Phoenix AZ",
    quote:
      "From the initial consultation to the final activation, MADHV handled everything flawlessly. The monitoring app is brilliant — we love seeing real-time solar production stats.",
    rating: 5,
    initials: "DL",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {STARS.slice(0, rating).map((n) => (
        <Star key={n} className="w-4 h-4 fill-gold text-gold" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () =>
    setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  return (
    <section id="testimonials" className="py-24 bg-band-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-teal font-semibold text-sm uppercase tracking-widest">
            What Clients Say
          </span>
          <h2 className="mt-2 text-4xl font-bold text-navy">
            Customer Testimonials
          </h2>
        </motion.div>

        {/* Desktop: all 3 cards */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              data-ocid={`testimonials.item.${i + 1}`}
              className="bg-white rounded-xl p-8 shadow-card flex flex-col"
            >
              <StarRating rating={t.rating} />
              <p className="text-sm text-navy/75 leading-relaxed flex-1 italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-xs">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-navy text-sm">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                data-ocid={`testimonials.item.${active + 1}`}
                className="bg-white rounded-xl p-8 shadow-card"
              >
                <StarRating rating={testimonials[active].rating} />
                <p className="text-sm text-navy/75 leading-relaxed italic mb-6">
                  &ldquo;{testimonials[active].quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-xs">
                    {testimonials[active].initials}
                  </div>
                  <div>
                    <div className="font-semibold text-navy text-sm">
                      {testimonials[active].name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonials[active].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={prev}
              className="w-10 h-10 rounded-full border-2 border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              data-ocid="testimonials.pagination_prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="w-10 h-10 rounded-full border-2 border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              data-ocid="testimonials.pagination_next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
