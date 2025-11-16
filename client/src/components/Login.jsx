import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Navbar from "./Navbar";

// Axios client (no cookies)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

const Field = ({ label, children, hint, error, id }) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    {error && <p className="text-xs text-rose-600">{error}</p>}
  </div>
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const justRegistered = !!location.state?.registered;
  const initialEmail = location.state?.email || "";

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (justRegistered) {
      window.history.replaceState({}, document.title);
    }
  }, [justRegistered]);

  const validate = () => {
    const e = { email: "", password: "" };
    const validEmail = /\S+@\S+\.\S+/.test(email);
    if (!validEmail) e.email = "Please enter a valid email.";
    if (password.length < 6) e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");  // Clear any global errors from previous attempts
    if (!validate()) return;  // Validation check before submitting

    setLoading(true);
    try {
      // POST request to login endpoint (Backend: /api/auth/login)
      const { data } = await api.post("/api/auth/login", { email, password });
      
      // Expecting { token, user? }
      if (!data?.token) {
        throw new Error("Token missing in response");
      }

      // Save token (no cookies)
      if (remember) {
        localStorage.setItem("token", data.token);  // Store in localStorage if 'remember me' is checked
        sessionStorage.setItem("token", data.token);  // Also store in sessionStorage for current session
      } else {
        sessionStorage.setItem("token", data.token);  // Store in sessionStorage for current session only
        localStorage.removeItem("token");  // Ensure localStorage is cleared if not 'remember me'
      }

      // Dispatch an event to notify the app that authentication has changed
      window.dispatchEvent(new Event("auth-changed"));

      // Redirect user to the home page after successful login
      navigate("/", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 404 || msg?.toLowerCase()?.includes("not found")) {
        setGlobalError("No account found with that email.");
        setErrors((prev) => ({ ...prev, email: "Email not registered." }));
      } else if (status === 401 || msg?.toLowerCase()?.includes("invalid") || msg?.toLowerCase()?.includes("password")) {
        setGlobalError("Incorrect email or password.");
        setErrors((prev) => ({ ...prev, password: "Wrong password." }));
      } else {
        setGlobalError(msg || "Unable to sign in right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-100">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl" />

<Navbar />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-16">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur md:grid-cols-2"
        >
          {/* Left Art */}
          <div className="relative hidden flex-col items-start justify-between bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white md:flex">
            <div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide">Welcome back</span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight">Intern Indian Academy</h2>
              <p className="mt-2 max-w-sm text-white/80">Learn, build, and showcase projects with mentors and a vibrant community.</p>
            </div>
            <div className="mt-10 w-full">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
                <p className="text-sm text-white/90">Why join?</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/85">
                  <li>Live mentor support</li>
                  <li>Project-driven learning</li>
                  <li>Certificates & community</li>
                </ul>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          </div>

          {/* Right: Auth */}
          <div className="relative p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">Sign in</h3>
                <p className="mt-1 text-sm text-slate-600">Use your email</p>
              </div>
              <div className="hidden text-sm text-slate-500 md:block">
                Need an account?{" "}
                <Link to="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
              </div>
            </div>

            {justRegistered && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 text-sm">
                Account created! Please sign in.
              </div>
            )}
            {globalError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 text-sm">
                {globalError}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Field label="Email" id="email" hint="We'll never share your email." error={errors.email}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                    setGlobalError("");
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white/70 px-3 py-2.5 text-[15px] outline-none backdrop-blur focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                />
              </Field>

              <Field label="Password" id="password" error={errors.password}>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({ ...p, password: "" }));
                      setGlobalError("");
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white/70 px-3 py-2.5 pr-10 text-[15px] outline-none backdrop-blur focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-lg px-2 text-slate-500 hover:text-slate-900"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </Field>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="#" className="text-indigo-600 hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in…" : "Sign in with Email"}
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              By continuing, you agree to our{" "}
              <a className="text-indigo-600 hover:underline" href="/terms-of-service">Terms</a>
              &nbsp;and{" "}
              <a className="text-indigo-600 hover:underline" href="/privacy-policy">Privacy Policy</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
