import { motion, useAnimation, useInView, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const cards = [
  { title: "Industry-Ready Skills", desc: "Learn practical skills that are currently in demand across the tech industry. From coding to AI, we've got you covered.", emoji: "🖥️", bg: "bg-blue-50", tint: "text-blue-600" },
  { title: "Hands-on Learning", desc: "Practice with real-world projects and build a portfolio while you learn. Experience is the best teacher.", emoji: "🎛️", bg: "bg-violet-50", tint: "text-violet-600" },
  { title: "Supportive Community", desc: "Join a vibrant community of learners and mentors who are passionate about technology and innovation.", emoji: "👥", bg: "bg-rose-50", tint: "text-rose-600" },
  { title: "Structured Learning Path", desc: "Follow a carefully designed curriculum that takes you from basics to advanced concepts systematically.", emoji: "🎒", bg: "bg-green-50", tint: "text-green-600" },
  { title: "Interactive Learning", desc: "Engage with interactive content, quizzes, and exercises that make learning fun and effective.", emoji: "💡", bg: "bg-yellow-50", tint: "text-yellow-600" },
  { title: "Learn at Your Pace", desc: "Access content 24/7 and learn at your own comfortable pace. No pressure, just progress.", emoji: "🕒", bg: "bg-rose-50", tint: "text-rose-600" },
];

// ---- per-card component with direction-aware animation ----
function AnimatedCard({ data, index, scrollDir }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 }); // 35% दिखाई दे तो animate
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("show");
    else controls.start("hide");
  }, [inView, controls]);

  // direction के हिसाब से entry offset
  const hiddenVariant = {
    opacity: 0,
    y: scrollDir === "down" ? 28 : -28,
    scale: 0.98,
    filter: "blur(4px)",
  };

  const variants = {
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 160, damping: 18, delay: index * 0.03 },
    },
    hide: {
      ...hiddenVariant,
      transition: { duration: 0.25 },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hide"
      animate={controls}
      className="relative rounded-3xl bg-white p-6 shadow-[0_2px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-900/5
                 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(2,6,23,0.10)]"
    >
      <div className={`inline-grid h-14 w-14 place-items-center rounded-2xl ${data.bg} ${data.tint} text-2xl shadow-inner`}>
        <span>{data.emoji}</span>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-slate-900">{data.title}</h3>
      <p className="mt-2 text-slate-600 leading-relaxed">{data.desc}</p>
    </motion.div>
  );
}

export default function Choose() {
  // ---- global scroll direction detection ----
  const { scrollY } = useScroll();
  const [scrollDir, setScrollDir] = useState("down");
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrollDir(y > lastY.current ? "down" : "up");
    lastY.current = y;
  });

  return (
    <section id="about" className="relative  w-full overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-blue-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Why Choose IIAcademy?
            </span>
          </h2>
          <p className="mt-3 text-slate-600 md:text-lg">
            Discover how we're revolutionizing technical education for students in Grades 6–12
          </p>
        </div>

        {/* grid of animated cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <AnimatedCard key={i} data={c} index={i} scrollDir={scrollDir} />
          ))}
        </div>
      </div>
    </section>
  );
}
