// SuccessStories.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Demo data ---
const STORIES = [
  {
    title: "Weather App Project",
    by: "Rahul",
    grade: "Grade 10",
    desc:
      "Developed a full-stack weather application using React and Node.js, implementing real-time weather updates and interactive maps.",
    tags: ["React", "Node.js", "API Integration"],
    iconStroke: "#7C3AED", // violet-600
    from: "from-violet-50",
    to: "to-blue-50",
  },
  {
    title: "Quiz Platform",
    by: "Ananya",
    grade: "Grade 9",
    desc:
      "Built a timed quiz platform with result analytics, leaderboard, and question pools. Deployed as a PWA.",
    tags: ["TypeScript", "Firebase", "PWA"],
    iconStroke: "#2563EB", // blue-600
    from: "from-blue-50",
    to: "to-sky-50",
  },
  {
    title: "Bus Tracker",
    by: "Arjun",
    grade: "Grade 11",
    desc:
      "Implemented real-time location tracking for buses with WebSockets and map visualizations for commuters.",
    tags: ["WebSockets", "Maps", "Express"],
    iconStroke: "#16A34A", // green-600
    from: "from-emerald-50",
    to: "to-teal-50",
  },
];

// Motion variants
const slide = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.35 } },
};

export default function SuccessStories() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(
    () => setIndex((p) => (p + 1) % STORIES.length),
    []
  );
  const prev = useCallback(
    () => setIndex((p) => (p - 1 + STORIES.length) % STORIES.length),
    []
  );

  // Autoplay with pause on hover
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 6000);
    return () => clearInterval(timerRef.current);
  }, [next, paused, index]);

  const s = STORIES[index];

  return (
    <section id="success"
      className="relative py-20 min-h-screen bg-gradient-to-b from-[#f6f6ff] via-[#eef4ff] to-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Soft bottom glow to match the design */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 w-[78%] h-40 bg-purple-300/25 blur-3xl rounded-full" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Success Stories
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Discover how our students are transforming their passion into amazing projects
          </p>
        </div>

        <div className="relative">
          {/* Nav left */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-lg ring-1 ring-slate-900/5 hover:shadow-xl transition"
          >
            <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5 text-slate-600">
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Nav right */}
          <button
            onClick={next}
            aria-label="Next"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-lg ring-1 ring-slate-900/5 hover:shadow-xl transition"
          >
            <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5 text-slate-600">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Slide */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                variants={slide}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-xl ring-1 ring-slate-900/5 p-6 md:p-8 flex flex-col md:flex-row gap-8"
              >
                {/* Left gradient icon panel */}
                <div
                  className={`flex-1 min-h-[200px] rounded-2xl bg-gradient-to-tr ${s.from} ${s.to} grid place-items-center`}
                >
                  <ScreenIcon stroke={s.iconStroke} />
                </div>

                {/* Right content */}
                <div className="flex-[1.2]">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Created by{" "}
                    <span className="font-medium text-slate-800">{s.by}</span>, {s.grade}
                  </p>
                  <p className="mt-4 text-slate-700 leading-relaxed">{s.desc}</p>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-slate-700 ring-1 ring-slate-900/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {STORIES.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setIndex(idx)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  idx === index ? "bg-violet-600" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Simple line icon (monitor) to match the look */
function ScreenIcon({ stroke = "#7C3AED" }) {
  return (
    <svg viewBox="0 0 64 64" className="h-28 w-28">
      <rect
        x="10"
        y="14"
        width="44"
        height="30"
        rx="6"
        ry="6"
        fill="none"
        stroke={stroke}
        strokeWidth="4"
      />
      <line x1="10" y1="36" x2="54" y2="36" stroke={stroke} strokeWidth="4" />
      <path
        d="M32 44l4 8H28l4-8z"
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
