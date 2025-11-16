// client/src/components/AdminSignup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_BASE = RAW_API_BASE.replace(/\/+$/, ""); // remove trailing slash

export default function AdminSignup({ onSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.email.trim()) return "Please enter an email address.";
    // simple email check
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address.";
    if (!form.phoneNumber.trim()) return "Please enter a phone number.";
    if (form.password.length < 6) return "Password should be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const vErr = validate();
    if (vErr) {
      setMsg({ type: "error", text: vErr });
      return;
    }

    setLoading(true);

    try {
      // NOTE: backend should validate role assignment. Setting role here is only a convenience.
      const payload = { ...form, role: "admin" };

      const res = await axios.post(`${API_BASE}/api/auth/register`, payload, {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      });

      if (res.status === 201 || (res.status === 200 && res.data?.token)) {
        if (res.data?.token) {
          try {
            localStorage.setItem("ii_token", res.data.token);
          } catch (e) {
            console.warn("Failed to store token in localStorage:", e);
          }
        }

        setMsg({ type: "success", text: "Admin registered successfully!" });
        if (typeof onSuccess === "function") onSuccess();

        // navigate to dashboard after short delay so user sees success message
        setTimeout(() => navigate("/dashboard"), 900);
      } else {
        const errorMsg = res.data?.message || `Registration failed (${res.status})`;
        setMsg({ type: "error", text: errorMsg });
      }
    } catch (err) {
      console.error("AdminSignup error:", err);
      setMsg({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Something went wrong while signing up.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        noValidate
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Registration
        </h2>

        {msg && (
          <div
            role="alert"
            className={`p-3 mb-4 rounded ${msg.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {msg.text}
          </div>
        )}

        <label className="block text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
        />

        <label className="block text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
        />

        <label className="block text-gray-700 mb-1">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
        />

        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Register as Admin"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}
