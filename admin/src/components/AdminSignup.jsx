import React, { useState } from "react";
import axios from "axios";

// Backend base URL (set VITE_API_BASE in .env or fallback to localhost)
const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminSignup({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      // force role to admin (frontend default)
      const payload = { ...form, role: "admin" };

      // send request
      const res = await axios.post(`${API_BASE}api/auth/register`, payload, {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // we'll handle status manually
      });

      // handle common responses
      if (res.status === 201 || (res.status === 200 && res.data?.token)) {
        if (res.data?.token) {
          localStorage.setItem("ii_token", res.data.token);
        }
        setMsg({ type: "success", text: "Admin registered successfully!" });
        if (typeof onSuccess === "function") onSuccess();
      } else {
        const errorMsg = res.data?.message || `Registration failed (${res.status})`;
        setMsg({ type: "error", text: errorMsg });
      }
    } catch (err) {
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
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Registration
        </h2>

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
          <a href="/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
