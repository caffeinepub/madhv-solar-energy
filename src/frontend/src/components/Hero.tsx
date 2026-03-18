import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-solar.dim_1920x900.jpg')",
        }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(11,42,68,0.62)" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Authorized Franchise Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold tracking-widest uppercase border border-gold/30">
              Authorized Waaree Franchise Partner
            </span>
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal/20 text-teal text-sm font-semibold tracking-widest uppercase border border-teal/30">
              One with the Sun
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-none mb-4">
            MADHAV SOLAR
            <br />
            <span className="text-gold">ENERGY</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gold/90 font-semibold mb-4">
            Powering a Greener Tomorrow
          </p>

          {/* Gujarati Tagline Poem */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="my-6 mx-auto max-w-2xl bg-white/10 backdrop-blur-sm border border-gold/30 rounded-2xl px-6 py-5"
          >
            <p
              className="text-base sm:text-lg text-white/95 font-medium leading-relaxed"
              style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}
            >
              હે... અમરેલીના આંગણે નવો ઉજાસ રે,
              <br />
              <span className="text-gold font-semibold">
                માધવ સોલાર લાવ્યું સુખનો પ્રકાસ!
              </span>
              <br />
              વીજળી વરસે, ટેન્શન સરસે...
              <br />
              <span className="text-orange font-bold text-xl">
                બોલો... માધવ સોલારની જય હો!
              </span>
            </p>
          </motion.div>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-4 font-light">
            Featuring <strong className="text-white">WAAREE TOPCON 580</strong>{" "}
            — High Efficiency Solar Modules. Best Quality · Best Rate · Best
            Service
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10 text-sm">
            <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full border border-white/20">
              13,000+ Happy Customers
            </span>
            <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full border border-white/20">
              Loan Available
            </span>
            <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full border border-white/20">
              Amreli, Gujarat
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollTo("services")}
              variant="outline"
              className="rounded-full px-8 py-3 text-base font-semibold border-2 border-white text-white bg-transparent hover:bg-white hover:text-navy transition-all"
              data-ocid="hero.secondary_button"
            >
              Our Services
            </Button>
            <Button
              onClick={() => scrollTo("contact")}
              className="rounded-full px-8 py-3 text-base font-semibold bg-orange hover:bg-orange/90 text-white"
              data-ocid="hero.primary_button"
            >
              Get a Free Quote
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}
