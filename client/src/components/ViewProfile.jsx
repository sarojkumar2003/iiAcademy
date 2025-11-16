import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

export default function ViewProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = findToken();
    if (!token) {
      console.warn("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    const url = `${API_BASE}/api/users/profile`;
    console.log("Fetching profile from:", url);

    const loadProfile = async () => {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          // If your backend uses cookies, enable credentials:
          // credentials: 'include'
        });

        console.log("Profile fetch status:", res.status);

        if (!res.ok) {
          // if 401 or 403, force relogin
          if (res.status === 401 || res.status === 403) {
            setError("Session expired. Redirecting to login...");
            // clear stored tokens we know about
            ["ii_token","token","accessToken","access_token","jwt"].forEach(k=>{
              try { sessionStorage.removeItem(k); localStorage.removeItem(k); } catch(_) {}
            });
            setTimeout(() => navigate("/login"), 1200);
            return;
          }

          // try to read error body
          let text = "";
          try { text = await res.text(); } catch (e) { /* ignore */ }
          setError(`Failed to fetch profile (${res.status}). ${text ? "Server: "+text : ""}`);
          return;
        }

        const data = await res.json().catch(e => {
          console.error("Invalid JSON in profile response", e);
          return null;
        });

        if (!data) {
          setError("Profile response not JSON or empty.");
          return;
        }

        // Normalize various possible shapes
        let u = null;
        if (data.user) u = data.user;
        else if (data.data?.user) u = data.data.user;
        else if (data.data) u = data.data;
        else if (data.profile) u = data.profile;
        else if (data.email) u = data;
        else if (Array.isArray(data) && data.length > 0) u = data[0];
        else u = data;

        setUser(u);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Network error. Please check console and server status.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
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
