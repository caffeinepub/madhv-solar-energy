import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const FESTIVAL_SLIDES = [
  "🪔 Happy Diwali! | ☀️ Solar Energy - Light up your life! | Madhav Solar Amreli | +91 9428787879",
  "🎨 Happy Holi! | ☀️ Go Solar, Save Big! | WAAREE TOPCON 580W Available | Call Now!",
  "🇮🇳 Happy Independence Day! | Energy Independence with Solar | Free Survey Available!",
  "🪁 Happy Uttarayan! | ✂️ Cut Your Electricity Bill | Madhav Solar Amreli",
  "🕺 Happy Navratri! | Power Your Celebrations with Solar | 100% Loan Facility in 3 Days!",
  "🥳 Happy New Year! | Solar has never been cheaper! | Book Free Consultation Today!",
];

const GRADIENTS = [
  "from-orange-500 via-amber-400 to-yellow-400",
  "from-pink-500 via-purple-500 to-indigo-500",
  "from-orange-600 via-green-600 to-orange-500",
  "from-sky-500 via-cyan-400 to-teal-500",
  "from-red-500 via-orange-500 to-yellow-500",
  "from-purple-600 via-pink-500 to-orange-400",
];

export default function FestivalBanner() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % FESTIVAL_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`relative w-full bg-gradient-to-r ${GRADIENTS[index % GRADIENTS.length]} transition-all duration-1000 overflow-hidden`}
      data-ocid="festival.panel"
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-pulse pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* FESTIVAL OFFER badge */}
        <span className="shrink-0 bg-white/20 backdrop-blur-sm text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/30">
          🎉 FESTIVAL OFFER
        </span>

        {/* Rotating text */}
        <div className="flex-1 text-center overflow-hidden relative h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap absolute inset-0 flex items-center justify-center"
            >
              {FESTIVAL_SLIDES[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Dismiss */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 text-white/80 hover:text-white transition-colors rounded-full w-6 h-6 flex items-center justify-center hover:bg-white/20"
          aria-label="Dismiss banner"
          data-ocid="festival.close_button"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
