import welcome from "@/assets/welcome.png";
import { motion } from "framer-motion";
import {
  Stethoscope,
  CalendarClock,
  Bell,
  ClipboardList,
} from "lucide-react";

/**
 * Aesthetic Hospital SharePoint Hero Banner
 * - Clean glassmorphism + layered gradients (brand-safe purple hues)
 * - Subtle animated sparkle + light sweep (no heavy motion)
 * - Right-side illustrative image with soft glow + masked shape
 * - Quick actions (SharePoint-friendly links)
 * - Auto-formatted date; accessible labels
 */

const actions = [
  {
    label: "Appointments",
    icon: CalendarClock,
    href: "/sites/hospital/appointments",
  },
  {
    label: "Tasks",
    icon: ClipboardList,
    href: "/sites/hospital/my-tasks",
  },
  { label: "Alerts", icon: Bell, href: "/sites/hospital/alerts" },
];

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const WelcomeBanner = () => {
  return (
    <section
      role="banner"
      aria-label="Welcome banner"
      className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl mb-4 sm:mb-6 md:mb-8"
    >
      {/* Base gradient - Responsive */}
      <div className="absolute inset-0" style={{ background: 'var(--banner-gradient-base)' }} />

      {/* Soft texture grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(transparent_23px,rgba(255,255,255,0.18)_24px),linear-gradient(90deg,transparent_23px,rgba(255,255,255,0.18)_24px)] [background-size:24px_24px]"
      />

      {/* Light sweep */}
      <motion.div
        aria-hidden
        initial={{ x: "-20%", opacity: 0 }}
        animate={{ x: "120%", opacity: [0, 0.15, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-y-8 -left-1/4 w-1/3 rotate-12 bg-gradient-to-r from-white/10 via-white/25 to-white/10 blur-2xl"
      />

      {/* Subtle sparkles */}
      <div className="pointer-events-none" aria-hidden>
        {[...Array(16)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 bg-white/70 rounded-full"
            initial={{
              x: Math.random() * 900 - 150,
              y: Math.random() * 400 - 20,
              opacity: 0,
              scale: 0.4,
            }}
            animate={{
              y: ["+=-8", "+=4", "+=0"],
              opacity: [0, 0.7, 0],
              scale: [0.4, 1, 0.4],
            }}
            transition={{ duration: 3.2 + Math.random() * 1.8, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div className="h-full flex flex-col md:flex-row items-center">
          {/* Left: Greeting + actions */}
          <div className="flex-1 w-full py-4 sm:py-5 md:py-6 pr-0 md:pr-6 lg:pr-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1 sm:py-1.5 bg-white/10 ring-1 ring-white/20 backdrop-blur text-xs sm:text-[13px] md:text-sm">
              <Stethoscope className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              <span className="text-white/90">Curana Hospital</span>
            </div>

            <div className="space-y-1.5 sm:space-y-2.5 mt-3 sm:mt-4">
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                Welcome back, <span className="font-bold">Dr. Emily</span>
              </h1>
              <p className="text-white/80 text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-[95%] md:max-w-[90%]">
                {formatDate()} · Curana Health is dedicated to transforming healthcare for seniors through innovative care models.
              </p>
            </div>
          </div>

          {/* Right: Illustration - Responsive */}
          <div className="relative w-full md:w-auto md:flex-1 flex justify-center md:justify-end mt-4 md:mt-0">
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[420px] h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px]"
              aria-hidden
            >
              <div className="relative h-full w-full rounded-xl sm:rounded-2xl md:rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden ring-1 ring-white/20 bg-white/5 backdrop-blur-sm md:backdrop-blur">
                <img
                  src={welcome}
                  alt="Healthcare professionals"
                  className="absolute inset-0 h-full w-full object-cover object-right"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-xl sm:rounded-2xl md:rounded-[2rem] pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative medical cross watermark - Responsive */}
      <svg
        className="absolute -left-16 -bottom-16 w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] opacity-[0.04] sm:opacity-[0.05]"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <path d="M35 0h30v35h35v30H65v35H35V65H0V35h35z" fill="white" />
      </svg>
    </section>
  );
};

export default WelcomeBanner;
