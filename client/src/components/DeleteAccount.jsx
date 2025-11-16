// client/src/components/DeleteAccount.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_BASE = RAW_API_BASE.replace(/\/+$/, ""); // remove trailing slash

function findToken() {
  const keys = ["ii_token", "token", "accessToken", "access_token", "jwt", "authorization"];
  try {
    for (const k of keys) {
      const v = sessionStorage.getItem(k);
      if (v) return v;
    }
  } catch {}
  try {
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v) return v;
    }
  } catch {}
  try {
    if (typeof document !== "undefined") {
      const m = document.cookie.match(/(?:^|;\s*)(ii_token|token|accessToken|jwt)=([^;]+)/);
      if (m) return decodeURIComponent(m[2]);
    }
  } catch {}
  return null;
}

function stripBearer(raw) {
  if (!raw) return raw;
  if (typeof raw !== "string") return raw;
  return raw.toLowerCase().startsWith("bearer ") ? raw.slice(7) : raw;
}

export default function DeleteAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const clearTokens = () => {
    const keys = ["ii_token", "token", "accessToken", "access_token", "jwt"];
    keys.forEach(k => {
      try { sessionStorage.removeItem(k); } catch {}
      try { localStorage.removeItem(k); } catch {}
    });
    // Clear cookie named ii_token/token if set (best-effort)
    try {
      document.cookie = "ii_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    } catch {}
  };

  const handleDelete = async () => {
    setError("");
    const ok = window.confirm("Are you sure? This will permanently delete your account and cannot be undone.");
    if (!ok) return;

    setLoading(true);
    const rawToken = findToken();
    const token = stripBearer(rawToken);

    if (!token) {
      setLoading(false);
      setError("Not authenticated. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        // If your backend uses cookies for auth, add: credentials: 'include'
      });

      // Try to parse JSON (if any)
      let body = null;
      try {
        const text = await res.text();
        body = text ? JSON.parse(text) : null;
      } catch {
        body = null;
      }

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError("Session expired. Redirecting to login...");
          clearTokens();
          setTimeout(() => navigate("/login"), 900);
          return;
        }
        setError(body?.message || `Failed to delete account (status ${res.status})`);
        console.warn("DeleteAccount failed:", res.status, body);
        return;
      }

      // Success: clear tokens and redirect to login (or homepage)
      clearTokens();
      // Optionally show a toast — here we redirect immediately
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("DeleteAccount error:", err);
      setError("Network error while deleting account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-4 text-center text-red-600">Delete Account</h1>
      <p className="text-gray-700 mb-4 text-center">
        This action will permanently delete your account and all associated data. Please be certain.
      </p>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete My Account"}
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/profile")}
          className="text-blue-600 hover:text-blue-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
