import { motion } from "framer-motion";
import Herobanner from "./Herobanner";


export default function Hero() {
  return (
    <section id="home"
      className="relative min-h-[100vh] w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #e0ecff 40%, #d2d4ff 100%)",
      }}
    >
      {/* soft glow background blob */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-24 md:grid-cols-2 md:pt-28 lg:gap-16">
        {/* LEFT: Copy */}
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold leading-[1.07] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            <span className="block bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Empowering the
            </span>
            <span className="block bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Next Generation,
            </span>
            <span className="block text-slate-900">with Industry-Ready</span>
            <span className="block text-slate-900">Skills</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Join the revolution of industry-ready technical education. Unlock your
            potential with hands-on learning in coding, Web Development, and App
            Development.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#join"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ backgroundImage: "linear-gradient(90deg, #2563eb, #4f46e5)" }}
            >
              Join Our Community Now!
            </a>
            <a
              href="#courses"
              className="inline-flex items-center justify-center rounded-full border border-blue-500 px-6 py-3 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Explore Courses
            </a>
          </div>
        </div>

        {/* RIGHT: Animated Circle */}
        <div className="relative z-10 flex items-center justify-center">
          {/* floating shapes */}
          <motion.div
            className="absolute -left-4 -top-8 h-6 w-6 rounded-full bg-violet-500"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-2 top-10 h-10 w-10 rotate-45 rounded-lg bg-blue-500"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-8 left-6 h-8 w-8 rounded-lg bg-pink-500"
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />

          {/* Main animated circle */}
          <motion.div
            className="relative grid h-80 w-80 place-items-center rounded-full shadow-2xl shadow-purple-300"
            style={{
              backgroundImage:
                "radial-gradient(100% 100% at 50% 50%, rgba(129, 140, 248, 1) 0%, rgba(59, 130, 246, 1) 100%)",
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-6xl">🚀</div>
            <div className="mt-3 text-xl font-semibold text-white drop-shadow-sm">
              Start Your Journey
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-full bg-white/10 blur-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Extra floating shapes */}
      <motion.div
        className="pointer-events-none absolute left-[55%] top-[18%] h-4 w-4 rounded-full bg-violet-400/80"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[14%] top-[28%] h-8 w-8 rotate-45 rounded-md bg-blue-500/90"
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <Herobanner/>
    </section>
  );
}
