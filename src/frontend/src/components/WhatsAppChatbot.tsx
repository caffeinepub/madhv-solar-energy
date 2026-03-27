import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const FESTIVAL_MESSAGES = [
  "🪔 Happy Diwali! સૌ ને દીવાળી ની શુભ કામના! Solar energy - your gift of light this festival season!",
  "🎨 Happy Holi! રંગીલી હોળી ની શુભ કામનાઓ! Go solar and save on electricity!",
  "🕺 Happy Navratri! નવરાત્રીની ઢગ ઢગ શુભ કામનાઓ! Power your celebrations with solar!",
  "🪁 Happy Uttarayan! ઉત્તરાયણ ની ઢેર સારી શુભ કામના! Catch the sun with Madhav Solar!",
  "🇮🇳 Happy Independence Day! સ્વતંત્રતા દિવસ ની શુભ કામના! Be energy independent with solar!",
  "🥳 Happy New Year! નવા વર્ષ ની ઢગ ઢગ શુભ કામના! Start the year with solar savings!",
  "🌸 Happy Ram Navami! રામ નવમીની શુભ કામના! Go solar, be energy independent!",
  "🪔 Happy Dhanteras! ધનતેરસની શુભ કામના! Invest in solar - save lakhs!",
  "🌺 Happy Janmashtami! જન્માષ્ટમીની શુભ કામના! Solar power = pure energy!",
  "🎆 Happy Makar Sankranti! મકર સંક્રાંતિ ની શુભ કામના! Harness solar power!",
  "🙏 Happy Eid Mubarak! ઈદ મુબારક! Blessings and solar savings!",
  "🌟 Happy Guru Nanak Jayanti! ગુરુ નાનક જયંતી ની શુભ કામના!",
  "🌸 Happy Ganesh Chaturthi! ગણેશ ચતુર્થી ની શુભ કામના! Ganpati Bappa Morya!",
];

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12)
    return "🌅 Good Morning! સુપ્રભાત! માધવ સોલારમાં આપનું સ્વાગત!";
  if (hour >= 12 && hour < 17)
    return "☀️ Good Afternoon! શુભ બપોર! માધવ સોલારમાં આપનું સ્વાગત!";
  if (hour >= 17 && hour < 21)
    return "🌇 Good Evening! શુભ સાંજ! માધવ સોલારમાં આપનું સ્વાગત!";
  return "🌙 Good Night! શુભ રાત્રી! માધવ સોલારમાં આપનું સ્વાગત!";
}

const MAULIK_WA = "919428787879";
const ASHWIN_WA = "919574166656";

function buildWALink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

interface Message {
  id: number;
  text?: string;
  image?: string;
  caption?: string;
  isFestival?: boolean;
  isGreeting?: boolean;
  isUser?: boolean;
  isAutoReply?: boolean;
}

const BASE_MESSAGES: Message[] = [
  { id: 1, isGreeting: true },
  {
    id: 2,
    text: "☀️ WAAREE TOPCON 580W Solar Panels - Best quality at best price!",
  },
  { id: 3, isFestival: true },
  {
    id: 4,
    image:
      "/assets/uploads/unnamed_-_2026-03-17t013808.108-019d2c26-8a8e-72ab-9aa1-57940884ae0c-1.jpg",
    caption: "WAAREE TOPCON 580W — New Arrival!",
  },
  {
    id: 5,
    image:
      "/assets/uploads/screenshot_20260305_091456-019d2f21-e44f-7100-9db3-336c1b664a9a-1.jpg",
    caption: "Waaree TOPCON 580W - Best Price Chart",
  },
  {
    id: 6,
    image:
      "/assets/uploads/unnamed_-_2026-03-11t155712.347-019d2f21-e562-755e-b720-ebdba524e1d4-2.jpg",
    caption: "Residential Documents Required",
  },
];

const PERSONAL_MSG_URL = `https://wa.me/${MAULIK_WA}?text=${encodeURIComponent(
  "નમસ્તે Madhav Solar! મારે solar panel વિશે જાણવું છે. 🌞 (Hello Madhav Solar! I want to know about solar panels.)",
)}`;

export default function WhatsAppChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [festivalIndex, setFestivalIndex] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [nextId, setNextId] = useState(100);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoOpenRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const festivalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open after 4 seconds on first visit per session
  useEffect(() => {
    if (!sessionStorage.getItem("madhav_chat_opened")) {
      autoOpenRef.current = setTimeout(() => {
        setIsOpen(true);
        setAutoOpened(true);
        sessionStorage.setItem("madhav_chat_opened", "1");
      }, 4000);
    }
    return () => {
      if (autoOpenRef.current) clearTimeout(autoOpenRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setGreeting(getTimeGreeting());
      setVisibleCount(0);
      let count = 0;
      const show = () => {
        count++;
        setVisibleCount(count);
        if (count < BASE_MESSAGES.length) {
          timerRef.current = setTimeout(show, 900);
        }
      };
      timerRef.current = setTimeout(show, 400);

      festivalTimerRef.current = setInterval(() => {
        setFestivalIndex((i) => (i + 1) % FESTIVAL_MESSAGES.length);
      }, 5000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (festivalTimerRef.current) clearInterval(festivalTimerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (festivalTimerRef.current) clearInterval(festivalTimerRef.current);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger
  useEffect(scrollToBottom, [visibleCount, festivalIndex, chatMessages]);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleSend = () => {
    const text = userInput.trim();
    if (!text) return;

    const uid = nextId;
    setNextId((n) => n + 2);
    setChatMessages((prev) => [...prev, { id: uid, text, isUser: true }]);
    setUserInput("");

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { id: uid + 1, isAutoReply: true }]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating button with pulsing ring when closed */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: "#25D366", opacity: 0.5 }}
            aria-hidden="true"
          />
        )}
        <motion.button
          type="button"
          className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
          style={{ backgroundColor: "#25D366" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Open WhatsApp Chat"
          data-ocid="chatbot.open_modal_button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-7 h-7"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatpanel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed z-50 bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-80 max-h-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxWidth: 340 }}
            data-ocid="chatbot.dialog"
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ backgroundColor: "#075E54" }}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight truncate">
                  Madhav Solar
                </p>
                <p className="text-green-200 text-xs">
                  Typically replies instantly
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close chat"
                data-ocid="chatbot.close_button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto p-3 space-y-2"
              style={{
                backgroundColor: "#ECE5DD",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8bbad' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            >
              {/* Welcome card shown when auto-opened */}
              {autoOpened && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-xl px-3 py-3 shadow text-sm leading-relaxed mb-1"
                  style={{
                    backgroundColor: "white",
                    borderLeft: "4px solid #25D366",
                  }}
                >
                  <p className="font-bold text-green-800 text-sm mb-1">
                    🙏 નમસ્તે! માધવ સોલારમાં આપનું સ્વાગત!
                  </p>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    Solar panel ની જાણકારી મેળવવા WhatsApp પર personal chat શરૂ
                    કરો!
                  </p>
                  <span className="block text-right text-xs text-gray-400 mt-1">
                    ✓✓
                  </span>
                </motion.div>
              )}

              {BASE_MESSAGES.slice(0, visibleCount).map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  {msg.image ? (
                    <div
                      className="rounded-xl overflow-hidden shadow max-w-[220px]"
                      style={{ backgroundColor: "#DCF8C6" }}
                    >
                      <img
                        src={msg.image}
                        alt={msg.caption || "Madhav Solar"}
                        className="w-full h-auto object-cover"
                      />
                      <p className="text-xs text-gray-600 px-2 py-1 font-medium">
                        {msg.caption}
                      </p>
                    </div>
                  ) : msg.isFestival ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={festivalIndex}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-[85%] rounded-xl px-3 py-2 shadow text-sm leading-relaxed"
                        style={{ backgroundColor: "#DCF8C6" }}
                      >
                        {FESTIVAL_MESSAGES[festivalIndex]}
                        <span className="block text-right text-xs text-gray-400 mt-0.5">
                          ✓✓
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  ) : msg.isGreeting ? (
                    <div
                      className="max-w-[85%] rounded-xl px-3 py-2 shadow text-sm leading-relaxed"
                      style={{ backgroundColor: "#DCF8C6" }}
                    >
                      {greeting}
                      <span className="block text-right text-xs text-gray-400 mt-0.5">
                        ✓✓
                      </span>
                    </div>
                  ) : (
                    <div
                      className="max-w-[85%] rounded-xl px-3 py-2 shadow text-sm leading-relaxed"
                      style={{ backgroundColor: "#DCF8C6" }}
                    >
                      {msg.text}
                      <span className="block text-right text-xs text-gray-400 mt-0.5">
                        ✓✓
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}

              {visibleCount < BASE_MESSAGES.length && (
                <div className="flex items-center gap-1 px-3 py-2">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              )}

              {/* User messages + auto-replies */}
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  {msg.isUser ? (
                    <div
                      className="max-w-[85%] rounded-xl px-3 py-2 shadow text-sm leading-relaxed"
                      style={{ backgroundColor: "#DCF8C6" }}
                    >
                      {msg.text}
                      <span className="block text-right text-xs text-gray-400 mt-0.5">
                        ✓✓
                      </span>
                    </div>
                  ) : msg.isAutoReply ? (
                    <div
                      className="max-w-[92%] rounded-xl px-3 py-2 shadow text-sm leading-relaxed space-y-2"
                      style={{ backgroundColor: "white" }}
                    >
                      <p className="font-semibold text-green-800 text-xs">
                        🙏 નમસ્તે! Madhav Solar ની ટીમ સાથે જોડાઓ:
                      </p>
                      <a
                        href={buildWALink(
                          MAULIK_WA,
                          "Madhav Solar - Maulik Solanki નો સંપર્ક",
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-colors"
                        style={{ backgroundColor: "#25D366" }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 shrink-0"
                          aria-hidden="true"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Maulik Solanki — +91 94287 87879
                      </a>
                      <a
                        href={buildWALink(
                          ASHWIN_WA,
                          "Madhav Solar - Ashwin Teraiya નો સંપર્ક",
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-colors"
                        style={{ backgroundColor: "#25D366" }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 shrink-0"
                          aria-hidden="true"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Ashwin Teraiya — +91 95741 66656
                      </a>
                      <span className="block text-right text-xs text-gray-400 mt-0.5">
                        ✓✓
                      </span>
                    </div>
                  ) : null}
                </motion.div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Send Personal Message - full width CTA */}
            <div className="bg-white border-t border-gray-100 px-2 pt-2">
              <a
                href={PERSONAL_MSG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full text-sm font-bold py-2.5 px-3 rounded-xl text-white transition-all active:scale-95"
                style={{ backgroundColor: "#25D366" }}
                data-ocid="chatbot.primary_button"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                💬 Send Personal Message on WhatsApp
              </a>
            </div>

            {/* Quick replies */}
            <div className="bg-white px-2 pb-2 pt-1.5 grid grid-cols-2 gap-1.5">
              <a
                href={`https://wa.me/${MAULIK_WA}?text=Hello%20Madhav%20Solar%2C%20I%20am%20interested%20in%20solar%20panels.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg text-white transition-all active:scale-95"
                style={{ backgroundColor: "#25D366" }}
                data-ocid="chatbot.secondary_button"
              >
                💬 Maulik
              </a>
              <a
                href={`https://wa.me/${ASHWIN_WA}?text=Hello%20Madhav%20Solar%2C%20I%20am%20interested%20in%20solar%20panels.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg text-white transition-all active:scale-95"
                style={{ backgroundColor: "#25D366" }}
                data-ocid="chatbot.button"
              >
                💬 Ashwin
              </a>
              <a
                href="tel:+919428787879"
                className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg bg-blue-600 text-white transition-all active:scale-95"
                data-ocid="chatbot.button"
              >
                📞 Call Now
              </a>
              <button
                type="button"
                onClick={() => scrollTo("solar-calculator")}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg bg-orange-500 text-white transition-all active:scale-95"
                data-ocid="chatbot.button"
              >
                🧮 Calculator
              </button>
              <button
                type="button"
                onClick={() => scrollTo("price-list")}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg bg-green-700 text-white transition-all active:scale-95"
                data-ocid="chatbot.button"
              >
                💰 Price List
              </button>
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg bg-teal-600 text-white transition-all active:scale-95"
                data-ocid="chatbot.button"
              >
                📋 Free Quote
              </button>
            </div>

            {/* Chat input */}
            <div className="bg-white border-t border-gray-200 px-2 py-2 flex items-center gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 text-sm border border-gray-300 rounded-full px-3 py-1.5 outline-none focus:border-green-500"
                data-ocid="chatbot.input"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!userInput.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-40"
                style={{ backgroundColor: "#25D366" }}
                aria-label="Send"
                data-ocid="chatbot.submit_button"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>

            {/* Footer */}
            <div
              className="px-3 py-2 text-center text-xs"
              style={{ backgroundColor: "#075E54", color: "#9fdfcf" }}
            >
              Maulik: +91 9428787879 | Ashwin: +91 9574166656 | Amreli, Gujarat
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
