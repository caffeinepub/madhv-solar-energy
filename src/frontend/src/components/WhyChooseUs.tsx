import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { value: "500+", label: "Installations" },
  { value: "10+", label: "Years Experience" },
  { value: "24/7", label: "Support" },
  { value: "100%", label: "Satisfaction" },
];

const benefits = [
  "Certified and experienced solar engineers",
  "Premium quality panels with 25-year warranty",
  "Personalized energy solutions for every home",
  "Full project management from design to activation",
  "Competitive pricing and flexible financing options",
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — stats + benefits */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-teal font-semibold text-sm uppercase tracking-widest">
              Why MADHV
            </span>
            <h2 className="mt-2 text-4xl font-bold text-navy mb-8">
              Why Choose Us
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  data-ocid={`whyus.item.${i + 1}`}
                  className="bg-page-bg rounded-xl p-5 text-center"
                >
                  <div className="text-4xl font-black text-navy mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span className="text-sm text-navy/80">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — photo */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-card">
              <img
                src="/assets/generated/solar-team.dim_600x500.jpg"
                alt="Solar installation team"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative badge */}
            <div className="absolute -bottom-6 -left-6 bg-orange rounded-2xl p-5 shadow-lg text-white">
              <div className="text-3xl font-black">98%</div>
              <div className="text-xs font-medium mt-0.5">
                Customer
                <br />
                Satisfaction
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
