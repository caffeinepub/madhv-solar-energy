import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

const features = [
  "TopCon Technology — Premium Cell Efficiency",
  "580W Peak Power Output",
  "High Efficiency Solar Cells",
  "Durable All-Weather Build",
  "25-Year Product Warranty",
  "Certified by WAAREE — India's Leading Solar Brand",
];

const stats = [
  { icon: Users, value: "13,000+", label: "Happy Customers" },
  { icon: Zap, value: "Loan", label: "Available" },
  { icon: CheckCircle2, value: "Best Price", label: "Guaranteed" },
];

export default function ProductShowcase() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="product" className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Branding Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          <img
            src="/assets/uploads/IMG-20260310-WA0018-2.jpg"
            alt="Madhav Solar Energy – Waaree Authorized Partner"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* Authorized badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="bg-gold/20 text-gold border border-gold/40 text-sm px-4 py-1.5 rounded-full font-semibold tracking-widest uppercase">
            Authorized Waaree Franchise Partner
          </Badge>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-teal font-semibold text-sm uppercase tracking-widest mb-3">
              Featured Product
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase leading-none mb-2">
              WAAREE
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-gold uppercase leading-none mb-4">
              TOPCON 580
            </h3>
            <p className="text-white/70 text-lg mb-8">
              High Efficiency Solar Module — engineered for maximum energy yield
              and long-term reliability.
            </p>

            <ul className="space-y-3 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span className="text-white/80 text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => scrollTo("contact")}
              className="bg-orange hover:bg-orange/90 text-white font-bold rounded-full px-10 py-3 text-base"
              data-ocid="product.primary_button"
            >
              Get a Quote
            </Button>
          </motion.div>

          {/* Right — product images */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex flex-col gap-6"
          >
            {/* Original promo image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/assets/uploads/IMG-20260309-WA0084-1.jpg"
                alt="WAAREE TOPCON 580 Solar Panel"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block bg-gold text-navy text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Best Quality · Best Rate · Best Service
                </span>
              </div>
            </div>

            {/* New product details image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/assets/uploads/unnamed-2026-03-16T135139.305-1.jpg"
                alt="WAAREE TOPCON 580 – સોલાર પેનલ સ્ટ્રક્ચર વિગતો"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-2xl py-8 px-4 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-teal/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-teal" />
              </div>
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="text-white/60 text-sm font-medium">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
