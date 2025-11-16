import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation

// Backend base URL (use .env or default)
const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminLogin() {
  const navigate = useNavigate(); // ✅ Hook for redirect
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}api/auth/login`, form, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.token) {
        // ✅ Save token to localStorage
        localStorage.setItem("ii_token", res.data.token);

        setMsg({ type: "success", text: "Login successful! Redirecting..." });

        // ✅ Navigate to admin dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setMsg({
          type: "error",
          text: res.data?.message || "Invalid credentials or missing token.",
        });
      }
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Unable to login. Please try again.",
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
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        {/* Success/Error message */}
        {msg && (
          <div
            className={`p-3 mb-4 rounded ${
              msg.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <label className="block text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")} // ✅ Use navigate instead of href
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}
