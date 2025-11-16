import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FAQSection
 * - Pixel-perfect FAQ list with smooth accordion
 * - "Contact Support" button opens mail app addressed to supportEmail
 * - Optional mini form below with email prefilled (abc@gmail.com by default)
 * - TailwindCSS + Framer Motion only
 */

const faqs = [
  {
    q: "Who can join InterIndianAcademy?",
    a: "Anyone passionate about learning can join—students, working professionals, and beginners alike."
  },
  {
    q: "How do I get started with the courses?",
    a: "Create an account, pick a course, and follow the step-by-step lessons. Our dashboard guides you through everything."
  },
  {
    q: "Do I need any prior coding experience?",
    a: "No prior experience is required. We start from the basics and include beginner-friendly projects."
  },
  {
    q: "How can I interact with other students?",
    a: "Join community groups, attend live sessions, and participate in peer reviews to connect with others."
  },
  {
    q: "Will I receive support while learning?",
    a: "Yes! You’ll get mentor guidance, community help, and periodic live doubt clearing sessions."
  }
];

function Chevron({ open }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function FAQItem({ item, open, onToggle }) {
  return (
    <div id="contact" className="rounded-2xl bg-white shadow-[0_10px_25px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[16px] font-medium text-slate-800"
      >
        <span>{item.q}</span>
        <Chevron open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden px-6"
          >
            <div className="pb-5 text-[15px] leading-7 text-slate-600">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection({ supportEmail = "abc@gmail.com" }) {
  const [openIndex, setOpenIndex] = useState(-1);

  const mailto = ({ subject = "Support Request", body = "" } = {}) => {
    const url = `mailto:${encodeURIComponent(supportEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const subject = form.get("subject") || "Support Request";
    const message = form.get("message") || "";
    mailto({ subject, body: message });
  };

  return (
    <section id="contact" className="relative w-full bg-gradient-to-b from-violet-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[16px] text-slate-600">
            Find answers to common questions about our platform and learning journey
          </p>
        </header>

        <div className="mt-8 space-y-4">
          {faqs.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex((v) => (v === i ? -1 : i))}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600">Still have questions?</p>
          <button
            onClick={() => mailto({ subject: "Need help with InterIndianAcademy", body: "Hi team,\n\nI need some assistance with ...\n\nThanks!" })}
            className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-[15px] font-medium text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contact Support
          </button>
        </div>

        
      </div>
    </section>
  );
}
