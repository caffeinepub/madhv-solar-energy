import { Battery, Home, Phone, Settings, Sun, Zap } from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: Sun,
    title: "Solar Panel Installation",
    description:
      "Expert installation of WAAREE premium solar panels for residential and commercial properties. We handle everything from site assessment to system activation.",
  },
  {
    icon: Home,
    title: "Rooftop Solar Systems",
    description:
      "Custom-designed on-grid and off-grid rooftop solar systems that maximize energy production and blend seamlessly with your property.",
  },
  {
    icon: Battery,
    title: "Battery Storage Solutions",
    description:
      "State-of-the-art battery storage systems to store excess solar energy, keeping your home or business powered even during grid outages.",
  },
  {
    icon: Zap,
    title: "Solar Water Heaters",
    description:
      "Energy-efficient solar water heating systems that dramatically reduce electricity bills by harnessing Gujarat's abundant sunlight.",
  },
  {
    icon: Settings,
    title: "AMC & Maintenance",
    description:
      "Annual maintenance contracts and comprehensive cleaning services to ensure your solar panels operate at peak efficiency year-round.",
  },
  {
    icon: Phone,
    title: "Solar Consultation & Loans",
    description:
      "Free expert consultation to design the right system for your needs. We also assist with easy solar financing and government subsidy applications.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal font-semibold text-sm uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="mt-2 text-4xl font-bold text-navy">Our Services</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Comprehensive solar energy solutions for homes and businesses across
            Amreli and Saurashtra region.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              data-ocid={`services.item.${i + 1}`}
              className="bg-white rounded-xl p-8 shadow-card hover:shadow-lg transition-shadow relative overflow-hidden group"
            >
              {/* Gold accent bottom bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
              <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center mb-5 group-hover:bg-teal/10 transition-colors">
                <service.icon className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
