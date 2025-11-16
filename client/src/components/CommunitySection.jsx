import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * CommunitySection (Pixel-Perfect)
 *
 * Goal: Match the reference UI 100% while remaining responsive.
 * Extras: Optional left/right nudge based on scroll direction (can be disabled).
 * Tech: React + Tailwind + Framer Motion (no external icon libs).
 */

function StatCard({ value, label, driftVariants, dir, enableScrollDrift }) {
  const Wrapper = enableScrollDrift ? motion.div : "div";
  return (
    <Wrapper
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transform-gpu will-change-transform"
      {...(enableScrollDrift
        ? {
            variants: driftVariants,
            initial: "initial",
            whileInView: "enter",
            viewport: { once: true, amount: 0.6 },
            animate: "drift",
            custom: dir,
          }
        : {})}
    >
      <div className="text-4xl font-extrabold tracking-tight text-slate-900">{value}</div>
      <div className="mt-1 text-[15px] leading-6 text-slate-600">{label}</div>
    </Wrapper>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-[15px] leading-6 text-slate-600">{desc}</p>
      </div>
    </li>
  );
}

export default function CommunitySection({ enableScrollDrift = true }) {
  // Scroll direction: +1 = down, -1 = up
  const [dir, setDir] = useState(1);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!enableScrollDrift) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const delta = y - lastY.current;
          if (Math.abs(delta) > 0) {
            setDir(delta > 0 ? 1 : -1);
            lastY.current = y;
          }
          ticking.current = false;
        });
      }
    };
    lastY.current = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enableScrollDrift]);

  const driftVariants = useMemo(
    () => ({
      initial: { x: 0, opacity: 0, y: 10 },
      enter: { x: 0, opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
      drift: (d) => ({
        x: d * 20,
        transition: { type: "spring", stiffness: 150, damping: 18, mass: 0.3 },
      }),
    }),
    []
  );

  const stats = [
    { value: "700+", label: "Active Students" },
    { value: "10+", label: "Projects Built" },
    { value: "5+", label: "Mentors" },
  ];

  const features = [
    {
      title: "Peer Learning Groups",
      desc:
        "Collaborate with students who share your interests and learn together",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Project Showcases",
      desc: "Share your projects and get feedback from the community",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      title: "Live Coding Sessions",
      desc: "Join interactive coding sessions with experienced mentors",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 21l4-4 4 4" />
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M10 7l-2 2 2 2M14 11l2-2-2-2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full bg-[#F3F7FF] -mt-28">
      {/* subtle page background gradient like the screenshot */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent blur-2xl" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        {/* Heading block */}
        <div className="max-w-4xl">
          <h2 className="text-[44px] leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:text-[56px]">
            Join Our Thriving
            <br />
            Community
          </h2>
          <p className="mt-4 max-w-3xl text-[17px] leading-7 text-slate-600">
            Connect with fellow learners, share your projects, and grow together in our supportive community of young tech enthusiasts.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-8 md:mt-12 md:grid-cols-2">
          {/* Left column */}
          <div>
            <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((s) => (
                <StatCard
                  key={s.label}
                  value={s.value}
                  label={s.label}
                  driftVariants={driftVariants}
                  dir={dir}
                  enableScrollDrift={enableScrollDrift}
                />
              ))}
            </div>

            {/* CTA */}
            {enableScrollDrift ? (
              <motion.a
                href="#"
                aria-label="Start your journey for free"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-[15px] font-medium text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                variants={driftVariants}
                initial="initial"
                whileInView="enter"
                viewport={{ once: true, amount: 0.5 }}
                animate="drift"
                custom={dir}
              >
                Start Your Journey for Free
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
            ) : (
              <a
                href="#"
                aria-label="Start your journey for free"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-[15px] font-medium text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Start Your Journey for Free
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          {/* Right column: feature card */}
          {enableScrollDrift ? (
            <motion.div
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8"
              variants={driftVariants}
              initial="initial"
              whileInView="enter"
              viewport={{ once: true, amount: 0.35 }}
              animate="drift"
              custom={dir}
            >
              <ul className="space-y-6">
                {features.map((f) => (
                  <FeatureItem key={f.title} {...f} />
                ))}
              </ul>
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8">
              <ul className="space-y-6">
                {features.map((f) => (
                  <FeatureItem key={f.title} {...f} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
