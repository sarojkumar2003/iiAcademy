// client/src/components/ViewProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_BASE = RAW_API_BASE.replace(/\/+$/, ""); // remove trailing slash

function findToken() {
  const keys = ["ii_token", "token", "accessToken", "access_token", "jwt"];
  for (const k of keys) {
    try {
      const v = sessionStorage.getItem(k) || localStorage.getItem(k);
      if (v) return v;
    } catch (e) {
      // ignore storage errors
    }
  }
  return null;
}

/**
 * fetchWithAuth tries a GET to the given url with the token and returns the Response.
 * It will throw network errors; caller should handle non-ok statuses.
 */
async function fetchWithAuth(url, token) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    // If your backend uses cookies for auth, uncomment:
    // credentials: 'include'
  });
  return res;
}

export default function ViewProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = findToken();
    if (!token) {
      console.warn("No token found — redirecting to login");
      navigate("/login");
      return;
    }

    const tryEndpoints = [
      `${API_BASE}/api/users/profile`,
      `${API_BASE}/api/auth/me`,
      `${API_BASE}/api/users/me`,
    ];

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      console.log("Profile fetch - trying base:", API_BASE);

      for (const url of tryEndpoints) {
        try {
          console.log("Attempting profile fetch:", url);
          const res = await fetchWithAuth(url, token);

          console.log("Profile fetch status:", res.status, "for", url);

          // If unauthorized, force relogin immediately
          if (res.status === 401 || res.status === 403) {
            setError("Session expired. Redirecting to login...");
            ["ii_token", "token", "accessToken", "access_token", "jwt"].forEach(k => {
              try { sessionStorage.removeItem(k); localStorage.removeItem(k); } catch (_) {}
            });
            setTimeout(() => navigate("/login"), 1200);
            setLoading(false);
            return;
          }

          // If 404, try next fallback URL
          if (res.status === 404) {
            console.warn("Endpoint not found (404), trying next:", url);
            continue;
          }

          if (!res.ok) {
            // read possible error text
            const t = await res.text().catch(() => "");
            setError(`Failed to fetch profile (${res.status})${t ? ": " + t : ""}`);
            setLoading(false);
            return;
          }

          // OK — parse JSON
          const data = await res.json().catch((e) => {
            console.error("Invalid JSON from profile response", e);
            return null;
          });

          if (!data) {
            setError("Empty or invalid profile response from server.");
            setLoading(false);
            return;
          }

          // Normalize multiple possible response shapes
          let u = null;
          if (data.user) u = data.user;
          else if (data.data?.user) u = data.data.user;
          else if (data.data) u = data.data;
          else if (data.profile) u = data.profile;
          else if (data.email) u = data;
          else if (Array.isArray(data) && data.length > 0) u = data[0];
          else u = data;

          if (!cancelled) setUser(u);
          setLoading(false);
          return; // success -> stop trying endpoints
        } catch (err) {
          console.error("Network/error fetching", url, err);
          // network failure -> report and stop trying further endpoints (likely network/CORS)
          if (!navigator.onLine) {
            setError("You appear to be offline. Check your network connection.");
          } else {
            setError("Network error while fetching profile. Check server or CORS settings.");
          }
          setLoading(false);
          return;
        }
      } // end loop

      // If we exhausted all endpoints
      setError("Profile endpoint not found (404) on server. Check API routes.");
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-center">Your Profile</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {user ? (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Name:</span>
            <span className="text-gray-800">{user.name || user.fullName || user.username || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Phone:</span>
            <span className="text-gray-800">{user.phoneNumber || user.phone || "—"}</span>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 mb-4">Profile not available.</div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate("/profile/edit")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
        <button
          onClick={() => navigate("/profile/delete")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
