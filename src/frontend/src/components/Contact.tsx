import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContactForm } from "@/hooks/useQueries";
import { CheckCircle2, Loader2, MapPin, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const contactDetails = [
  {
    icon: MapPin,
    label:
      "Shop No. 11, 2nd Floor, IDFC Bank Building, Marketing Yard, Amreli, Gujarat",
  },
  {
    icon: Phone,
    label: "+91 9428787879",
    sub: "Maulik Solanki",
  },
  {
    icon: User,
    label: "+91 95741 66656",
    sub: "Ashwin Teraiya",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { mutate, isPending, isSuccess, isError, reset } =
    useSubmitContactForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => setForm({ name: "", email: "", message: "" }),
    });
  };

  return (
    <section id="contact" className="py-24 bg-page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-teal font-semibold text-sm uppercase tracking-widest">
            Reach Out
          </span>
          <h2 className="mt-2 text-4xl font-bold text-navy">Contact Us</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Ready to go solar? Get your free consultation and quote today.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-card">
              {isSuccess ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="contact.success_state"
                >
                  <CheckCircle2 className="w-16 h-16 text-teal mb-4" />
                  <h3 className="text-2xl font-bold text-navy mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We'll be in touch within 24 hours.
                  </p>
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="rounded-full border-teal text-teal hover:bg-teal hover:text-white"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  data-ocid="contact.modal"
                >
                  <div>
                    <Label
                      htmlFor="contact-name"
                      className="text-navy font-medium text-sm mb-1.5 block"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      className="border-border focus:border-teal"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="contact-email"
                      className="text-navy font-medium text-sm mb-1.5 block"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                      className="border-border focus:border-teal"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="contact-message"
                      className="text-navy font-medium text-sm mb-1.5 block"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us about your energy needs..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      required
                      rows={5}
                      className="border-border focus:border-teal resize-none"
                      data-ocid="contact.textarea"
                    />
                  </div>

                  {isError && (
                    <p
                      className="text-destructive text-sm"
                      data-ocid="contact.error_state"
                    >
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-teal hover:bg-teal/90 text-white rounded-full font-semibold py-3"
                    data-ocid="contact.submit_button"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right info + map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-navy mb-4">
                Get In Touch
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our solar experts are ready to help you switch to clean,
                affordable energy. Call us or visit our showroom in Amreli for a
                free site assessment and customized quote.
              </p>
            </div>

            <div className="space-y-4">
              {contactDetails.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-teal" />
                  </div>
                  <div className="mt-1.5">
                    <span className="text-sm text-navy/80 block">{label}</span>
                    {sub && (
                      <span className="text-xs text-teal font-medium">
                        {sub}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="flex-1 min-h-48 bg-navy/5 rounded-2xl flex items-center justify-center border border-border mt-4">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-10 h-10 mx-auto mb-2 text-teal/50" />
                <p className="text-sm font-medium">Amreli, Gujarat</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Marketing Yard, IDFC Bank Building
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
