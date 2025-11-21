import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "./Navbar";

/**
 * CourseInquiryPage.jsx
 *
 * - Uses VITE_API_BASE_URL if present; otherwise falls back to https://iiacademy.onrender.com
 * - Posts JSON to `${baseURL}/api/inquiries`
 * - Handles non-JSON (HTML) responses gracefully and shows user-friendly messages
 */

// axios client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
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

export default function CourseInquiryPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "Backend Development",
    startDate: "",
    education: "",
    city: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [globalMsg, setGlobalMsg] = useState({ type: "", text: "" }); // {type: 'error'|'success', text: ''}

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setGlobalMsg({ type: "", text: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email";
    if (form.phone && form.phone.trim().length < 6) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const friendlyMessage = (status, raw) => {
    if (status === 0) return "Network error — check your connection.";
    if (status === 401) return "Unauthorized. Please login or contact admin.";
    if (status === 403) return "Access denied.";
    if (status === 404) {
      if (raw && raw.includes("Cannot POST")) {
        return "Server endpoint not found (404). Ensure backend exposes POST /api/inquiries.";
      }
      return "Resource not found (404).";
    }
    if (status >= 500) return "Server error. Try again later or contact support.";
    if (raw && typeof raw === "string" && raw.trim().startsWith("<!DOCTYPE")) return "Server returned an unexpected HTML error page.";
    return `Submission failed (status ${status}).`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalMsg({ type: "", text: "" });
    if (loading) return;
    if (!validate()) return;

    setLoading(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      course: form.course,
      startDate: form.startDate || "",
      education: form.education.trim(),
      city: form.city.trim(),
      message: form.message.trim(),
      source: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      const res = await api.post("/api/inquiries", payload);

      const data = res?.data;
      if ((data && data.success) || res.status === 201 || res.status === 200) {
        setGlobalMsg({ type: "success", text: "Thanks — your inquiry has been submitted. We'll contact you shortly." });
        setForm({
          name: "",
          email: "",
          phone: "",
          course: "",
          startDate: "",
          education: "",
          city: "",
          message: "",
        });
        setErrors({});
      } else {
        const serverMsg = (data && (data.error || data.message)) || `Server returned ${res.status}`;
        setGlobalMsg({ type: "error", text: serverMsg });
        console.warn("Unexpected success response:", res.status, data);
      }
    } catch (err) {
      const status = err?.response?.status || 0;

      // Convert response data to string for inspection (handles JSON or HTML)
      let raw = "";
      if (err?.response?.data) {
        if (typeof err.response.data === "string") raw = err.response.data;
        else {
          try {
            raw = JSON.stringify(err.response.data);
          } catch (e) {
            raw = String(err.response.data);
          }
        }
      }

      // If backend returned structured field errors, merge them
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        setErrors((prev) => ({ ...prev, ...apiErrors }));
      }

      const friendly = friendlyMessage(status, raw);
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error || null;

      setGlobalMsg({ type: "error", text: backendMsg || friendly });
      console.warn("Inquiry submission error:", { status, raw, err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        {/* HERO / COURSE INFO */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">IIAcademy</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">Backend Development Program</h1>
            <p className="mt-3 text-slate-600 text-sm md:text-base">
              Learn how to build robust, production-ready backend applications using Node.js, Express and MongoDB with real projects and 1:1 mentorship.
            </p>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold">Duration</p>
                <p>1 Months</p>
              </div>
              <div>
                <p className="font-semibold">Level</p>
                <p>Beginner to Intermediate</p>
              </div>
              <div>
                <p className="font-semibold">Format</p>
                <p>Live + Projects</p>
              </div>
              <div>
                <p className="font-semibold">Certification</p>
                <p>Yes, on completion</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-slate-800">You will learn</h2>
              <ul className="mt-2 list-disc list-inside text-sm text-slate-700 space-y-1">
                <li>Node.js fundamentals & npm</li>
                <li>Express routing, middleware & error handling</li>
                <li>MongoDB CRUD, indexing & aggregation</li>
                <li>REST APIs, authentication (JWT), best practices</li>
                <li>Deployment basics (e.g. Render/EC2, PM2)</li>
              </ul>
            </div>
          </div>

          {/* Sidebar quick info */}
          <div className="w-full md:w-72 bg-gradient-to-b from-blue-600 to-indigo-600 text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">Why this course?</h3>
              <p className="mt-2 text-sm text-blue-50">Ideal for students and freshers who want to move into backend or full stack roles.</p>
              <div className="mt-4 space-y-2 text-sm">
                <p>✅ Industry-level projects</p>
                <p>✅ 1:1 doubt support</p>
                <p>✅ Interview preparation</p>
              </div>
            </div>
            <div className="mt-6 text-xs text-blue-100">
              <p>Have questions? Fill the inquiry form and we’ll call or email you with full details.</p>
            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="bg-gradient-to-r from-slate-50 to-white rounded-2xl shadow-lg overflow-hidden ring-1 ring-slate-100">
          <div className="md:flex">
            {/* Left info */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-600 p-8 text-white">
              <h3 className="text-xl font-semibold tracking-tight">Start your learning journey</h3>
              <p className="mt-3 text-sm opacity-90">Fill this short form and our admissions team will contact you with course details, schedules and offers.</p>

              <div className="mt-6 space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-sm font-medium">Featured</h4>
                  <p className="mt-1 text-lg font-semibold">Backend Development</p>
                  <p className="text-sm opacity-90 mt-1">Node.js • Express • MongoDB • Deployment</p>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-sm font-medium">Duration</h4>
                  <p className="mt-1 text-lg font-semibold">1 Months</p>
                  <p className="text-sm opacity-90 mt-1">Live sessions + Projects</p>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider opacity-90">Contact us</p>
                  <a className="block mt-1 text-sm font-medium" href="mailto:info@iiacademy.in">info@iiacademy.in</a>
                  <p className="text-xs mt-1 opacity-80">Or call: +91 9540666691</p>
                </div>
              </div>

              <div className="mt-8 text-sm opacity-90">
                <p><strong>Why choose us?</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Industry projects</li>
                  <li>1:1 mentorship</li>
                  <li>Job assistance & interview prep</li>
                </ul>
              </div>
            </div>

            {/* Right form */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-slate-800">Course Inquiry Form</h2>
                <div className="text-sm text-slate-500">Fast response • Secure</div>
              </div>

              {globalMsg.type === "success" && (
                <div className="mt-4 p-3 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-800" role="status" aria-live="polite">
                  {globalMsg.text}
                </div>
              )}

              {globalMsg.type === "error" && (
                <div className="mt-4 p-3 rounded-md bg-rose-50 border border-rose-100 text-rose-700" role="alert" aria-live="assertive">
                  {globalMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" aria-busy={loading}>
                <Field label="Full name" htmlFor="name" error={errors.name}>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your full name"
                    className={`mt-1 block w-full p-3 rounded-lg border ${errors.name ? 'border-rose-600' : 'border-slate-200'} bg-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  />
                </Field>

                <Field label="Email" htmlFor="email" hint="We'll never share your email." error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="info@iiacademy.in"
                    className={`mt-1 block w-full p-3 rounded-lg border ${errors.email ? 'border-rose-600' : 'border-slate-200'} bg-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  />
                </Field>

                <Field label="Phone" htmlFor="phone" error={errors.phone}>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 9540666691"
                    className={`mt-1 block w-full p-3 rounded-lg border ${errors.phone ? 'border-rose-600' : 'border-slate-200'} bg-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  />
                </Field>

                <Field label="Course interested" htmlFor="course">
                  <select
                    id="course"
                    name="course"
                    value={form.course}
                    onChange={(e) => update("course", e.target.value)}
                    className="mt-1 block w-full p-3 rounded-lg border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option>Backend Development</option>
                    <option>Frontend Development</option>
                    <option>Full Stack</option>
                    {/* <option>Data Science</option> */}
                    <option>Other</option>
                  </select>
                </Field>

                <Field label="Preferred start date" htmlFor="startDate">
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                    className="mt-1 block w-full p-3 rounded-lg border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Field>

                <Field label="Highest qualification" htmlFor="education">
                  <input
                    id="education"
                    name="education"
                    value={form.education}
                    onChange={(e) => update("education", e.target.value)}
                    placeholder="e.g. B.E., B.Sc., Diploma"
                    className="mt-1 block w-full p-3 rounded-lg border border-slate-200 bg-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Field>

                <Field label="City" htmlFor="city">
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="City"
                    className="mt-1 block w-full p-3 rounded-lg border border-slate-200 bg-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Field>

                <Field label="Message" htmlFor="message">
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us about your goals or questions..."
                    className="mt-1 block w-full p-3 rounded-lg border border-slate-200 bg-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Field>

                <div className="md:col-span-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-white shadow ${
                        loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    >
                      {loading ? "Sending..." : "Submit Inquiry"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          name: "",
                          email: "",
                          phone: "",
                          course: "Backend Development",
                          startDate: "",
                          education: "",
                          city: "",
                          message: "",
                        })
                      }
                      className="px-4 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">We respond within 24 hours</div>
                    <div className="text-xs text-slate-400">By submitting, you agree to our privacy policy.</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
