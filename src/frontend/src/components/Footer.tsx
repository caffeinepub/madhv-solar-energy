import { Sun } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";

const quickLinks = ["Home", "Services", "Why Us", "Testimonials", "Contact"];
const linkIds = ["#home", "#services", "#why-us", "#testimonials", "#contact"];

const social = [
  { Icon: SiFacebook, href: "#", label: "Facebook" },
  { Icon: SiX, href: "#", label: "Twitter/X" },
  { Icon: SiInstagram, href: "#", label: "Instagram" },
  { Icon: SiLinkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-gold" />
              </div>
              <div>
                <div className="font-black text-white text-lg">MADHAV</div>
                <div className="text-teal text-xs font-semibold tracking-widest uppercase -mt-0.5">
                  Solar Energy
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-3">
              Authorized Waaree Franchise Partner. Powering homes and businesses
              with clean, affordable solar energy across Amreli, Gujarat.
            </p>
            <span className="inline-block bg-gold/20 text-gold text-xs font-semibold px-3 py-1 rounded-full border border-gold/30">
              Waaree — One with the Sun
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-5 text-white/80">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={link}>
                  <a
                    href={linkIds[i]}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                    data-ocid="footer.link"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-5 text-white/80">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Shop No. 11, 2nd Floor</li>
              <li>IDFC Bank Building, Marketing Yard</li>
              <li>Amreli, Gujarat</li>
              <li className="pt-1">
                <span className="text-white/80">+91 9428787879</span>
                <span className="block text-teal text-xs">Maulik Solanki</span>
              </li>
              <li>
                <span className="text-white/80">+91 95741 66656</span>
                <span className="block text-teal text-xs">Ashwin Teraiya</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-5 text-white/80">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {social.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-gold hover:text-white transition-all"
                  data-ocid="footer.link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <p className="text-white/60 text-xs">
                Get a free energy assessment. Call us today and discover how
                much you can save with WAAREE solar panels.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            &copy; {year} MADHAV Solar Energy. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="underline hover:text-white/70 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
