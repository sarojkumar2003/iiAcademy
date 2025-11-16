import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Robust EditProfile component
 * - Detects token in session/local storage or cookie
 * - Accepts several response shapes from GET /api/users/profile
 * - PUTs updated profile to /api/users/profile with JSON body
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function findToken() {
  const keys = ["token", "accessToken", "access_token", "jwt", "authorization"];
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
  if (typeof document !== "undefined") {
    const m = document.cookie.match(/(?:^|;\s*)(token|accessToken|jwt)=([^;]+)/);
    if (m) return decodeURIComponent(m[2]);
  }
  return null;
}

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(""); // show email (read-only)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const token = findToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const effectiveToken = typeof token === "string" && token.toLowerCase().startsWith("bearer ")
      ? token.slice(7)
      : token;

    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${effectiveToken}`,
          },
        });

        if (!mounted) return;

        if (res.status === 401 || res.status === 403) {
          setError("Session expired. Redirecting to login...");
          try { sessionStorage.removeItem("token"); } catch {}
          try { localStorage.removeItem("token"); } catch {}
          setTimeout(() => navigate("/login"), 1000);
          return;
        }

        const text = await res.text();
        let data;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }

        // Normalize many shapes into user object
        let user = null;
        if (data && typeof data === "object") {
          if (data.user && typeof data.user === "object") user = data.user;
          else if (data.data && typeof data.data === "object") user = data.data.user || data.data;
          else if (data.email || data.name) user = data; // direct user object
          else if (data.payload && typeof data.payload === "object") user = data.payload;
        }

        if (!user) {
          setError("Could not find user data in API response.");
          console.warn("EditProfile - unexpected profile response:", data);
          setLoading(false);
          return;
        }

        // populate form fields
        setName(user.name || user.fullName || user.username || "");
        setPhoneNumber(user.phoneNumber || user.phone || "");
        setEmail(user.email || "");
      } catch (err) {
        console.error("EditProfile fetch error:", err);
        setError("Network error while loading profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => { mounted = false; };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = findToken();
    if (!token) {
      navigate("/login");
      return;
    }

    if (!name?.trim() || !phoneNumber?.trim()) {
      setError("Please enter both name and phone number.");
      return;
    }

    // basic phone validation (optional)
    const phoneDigits = phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    const effectiveToken = typeof token === "string" && token.toLowerCase().startsWith("bearer ")
      ? token.slice(7)
      : token;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify({ name: name.trim(), phoneNumber: phoneNumber.trim() }),
      });

      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : null; } catch { data = text; }

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError("Session expired. Redirecting to login...");
          try { sessionStorage.removeItem("token"); } catch {}
          try { localStorage.removeItem("token"); } catch {}
          setTimeout(() => navigate("/login"), 1000);
          return;
        }
        setError(data?.message || `Update failed (status ${res.status})`);
        console.warn("EditProfile update failed:", data);
        return;
      }

      setSuccess("Profile updated successfully.");
      // Optionally redirect back to view profile after short delay
      setTimeout(() => navigate("/profile"), 900);
    } catch (err) {
      console.error("EditProfile submit error:", err);
      setError("Network error while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Profile</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 font-medium">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email (read-only)</label>
            <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">{email || "—"}</div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
