import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Axios client for API requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", // Replace with your backend URL
});

const Field = ({ label, htmlFor, hint, error, children }) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    {error && <p className="text-xs text-rose-600">{error}</p>}
  </div>
);

export default function AccountRegistration_Simple() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGlobalError("");
  };

  // Form validation
  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (form.phone && !/^\+?[0-9\s-]{10,14}$/.test(form.phone)) e.phone = "Invalid phone number";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setGlobalError("");
    try {
      const userData = {
        name: form.fullName,  // Ensure the `name` field is sent as `fullName`
        email: form.email,
        phoneNumber: form.phone.trim() ? form.phone : undefined,  // Ensure phone number is included
        password: form.password,
      };

      const { data } = await api.post("/api/auth/register", userData);

      if (data?.token) {
        sessionStorage.setItem("token", data.token); // Store token in session storage
        window.dispatchEvent(new Event("auth-changed")); // Notify auth change
        navigate("/", { replace: true }); // Redirect to home page
      } else {
        navigate("/login", {
          replace: true,
          state: { registered: true, email: form.email },
        });
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      const apiErrors = err?.response?.data?.errors; // e.g. { email: "Already used" }
      if (apiErrors && typeof apiErrors === "object") {
        setErrors((prev) => ({ ...prev, ...apiErrors }));
      }
      setGlobalError(apiMsg || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-100">
      {/* background accents */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur"
        >
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left banner */}
            <div className="relative hidden rounded-bl-3xl rounded-tl-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white md:col-span-2 md:block">
              <h2 className="text-3xl font-extrabold leading-tight">Create your account</h2>
              <p className="mt-2 text-white/85">Quick signup to start learning.</p>
              <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-white/85">
                <li>Access courses</li>
                <li>Project-based learning</li>
                <li>Certificates & community</li>
              </ul>
            </div>

            {/* Right form */}
            <div className="p-6 md:col-span-3 md:p-8">
              <h3 className="mb-6 text-xl font-semibold text-slate-900">Student Registration</h3>

              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
                {globalError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 text-sm">
                    {globalError}
                  </div>
                )}

                <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
                  <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${errors.fullName ? 'border-rose-600' : 'border-slate-300'} bg-white/80 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300`}
                  />
                </Field>

                <Field label="Email" htmlFor="email" hint="We'll never share your email." error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${errors.email ? 'border-rose-600' : 'border-slate-300'} bg-white/80 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300`}
                  />
                </Field>

                <Field label="Phone" htmlFor="phone" error={errors.phone}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${errors.phone ? 'border-rose-600' : 'border-slate-300'} bg-white/80 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300`}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Password" htmlFor="password" error={errors.password}>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className={`w-full rounded-xl border ${errors.password ? 'border-rose-600' : 'border-slate-300'} bg-white/80 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300`}
                    />
                  </Field>
                  <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`w-full rounded-xl border ${errors.confirmPassword ? 'border-rose-600' : 'border-slate-300'} bg-white/80 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300`}
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 rounded-xl bg-indigo-600 px-5 py-2 text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Submitting…" : "Create account"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
