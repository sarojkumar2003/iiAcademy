import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Normalize API base URL (supports both names and removes trailing slash)
const API_BASE = import.meta.env.VITE_API_BASE;


/* auth header helper - checks several token keys */
const authHeader = () => {
  const keys = ["ii_token", "token", "accessToken", "access_token", "jwt"];
  try {
    for (const k of keys) {
      const v = localStorage.getItem(k) || sessionStorage.getItem(k);
      if (v) return { Authorization: `Bearer ${v}` };
    }
  } catch (e) {
    // ignore storage errors
  }
  return {};
};

/* Small spinner component (pixels) */
function Spinner({ size = 16 }) {
  return (
    <div
      role="status"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "rgba(99,102,241,0.15)",
        borderTopColor: "rgb(99 102 241)",
        borderRadius: "9999px",
        display: "inline-block",
        animation: "spin 1s linear infinite",
      }}
    />
  );
}

/* add minimal keyframes for spin */
const spinnerStyles = (
  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
);

/* Tiny helper used for human readable counts */
const plural = (n, sing, pl) => `${n} ${n === 1 ? sing : pl}`;

export default function AdminDashboard() {
  const navigate = useNavigate();

  // UI state
  const [tab, setTab] = useState("courses"); // courses | users | payments
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type:'success'|'error', text }
  const [rawResponse, setRawResponse] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  // Course form
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    duration: "",
    instructor: "",
  });
  const [editingCourseId, setEditingCourseId] = useState(null);

  // User edit form
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", phoneNumber: "", hasPaid: false });

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("ii_token") || localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
    // eslint-disable-next-line
  }, []);

  // small toast helper
  const showMessage = (type, text, timeout = 3500) => {
    setMsg({ type, text });
    if (timeout) setTimeout(() => setMsg(null), timeout);
  };

  /* ---------- API: courses ---------- */
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setRawResponse(null);
    try {
      const res = await axios.get(`${API_BASE}/api/courses`, {
        headers: { ...authHeader() },
        validateStatus: () => true,
      });
      setRawResponse({ endpoint: "/api/courses", status: res.status, data: res.data });

      if (res.status === 200 && Array.isArray(res.data)) {
        // normalize ids
        const normalized = res.data.map((c) => ({ ...c, _id: c._id || c.id }));
        setCourses(normalized);
      } else if (res.status === 401) {
        showMessage("error", "Unauthorized — please login again");
        localStorage.removeItem("ii_token");
        navigate("/login", { replace: true });
      } else {
        showMessage("error", res.data?.message || `Could not fetch courses (${res.status})`);
        setCourses([]);
      }
    } catch (err) {
      console.error("fetchCourses", err);
      showMessage("error", "Network error — backend unreachable");
      setRawResponse({ endpoint: "/api/courses", error: err.message });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const addCourse = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setRawResponse(null);
    try {
      const payload = { ...courseForm, duration: Number(courseForm.duration) || 0 };
      const res = await axios.post(`${API_BASE}/api/courses`, payload, {
        headers: { ...authHeader(), "Content-Type": "application/json" },
        validateStatus: () => true,
      });
      setRawResponse({ endpoint: "/api/courses (POST)", status: res.status, data: res.data });

      if (res.status === 201 || res.status === 200) {
        const added = res.data?.course || res.data;
        if (added && (added._id || added.id)) {
          const normalized = { ...added, _id: added._id || added.id };
          setCourses((prev) => [normalized, ...prev]);
        } else {
          await fetchCourses();
        }

        setCourseForm({ title: "", description: "", duration: "", instructor: "" });
        showMessage("success", "Course added");
      } else {
        showMessage("error", res.data?.message || `Add failed (${res.status})`);
      }
    } catch (err) {
      console.error("addCourse", err);
      showMessage("error", "Error adding course");
      setRawResponse({ endpoint: "/api/courses (POST)", error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const startCourseEdit = (course) => {
    setEditingCourseId(course._id || course.id);
    setCourseForm({
      title: course.title || "",
      description: course.description || "",
      duration: course.duration || "",
      instructor: course.instructor || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveCourseEdit = async (e) => {
    e?.preventDefault();
    if (!editingCourseId) return;
    setLoading(true);
    setRawResponse(null);
    try {
      const payload = { ...courseForm, duration: Number(courseForm.duration) || 0 };
      const res = await axios.put(`${API_BASE}/api/courses/${editingCourseId}`, payload, {
        headers: { ...authHeader(), "Content-Type": "application/json" },
        validateStatus: () => true,
      });
      setRawResponse({ endpoint: `/api/courses/${editingCourseId} (PUT)`, status: res.status, data: res.data });

      if (res.status === 200) {
        const updated = res.data?.course || res.data;
        setCourses((prev) =>
          prev.map((c) => {
            const id = c._id || c.id;
            if (id === editingCourseId) {
              return { ...c, ...(updated || payload) };
            }
            return c;
          })
        );

        setEditingCourseId(null);
        setCourseForm({ title: "", description: "", duration: "", instructor: "" });
        showMessage("success", "Course updated");
      } else {
        showMessage("error", res.data?.message || `Update failed (${res.status})`);
      }
    } catch (err) {
      console.error("saveCourseEdit", err);
      showMessage("error", "Error updating course");
      setRawResponse({ endpoint: `/api/courses/${editingCourseId} (PUT)`, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    setRawResponse(null);
    try {
      const res = await axios.delete(`${API_BASE}/api/courses/${id}`, {
        headers: { ...authHeader() },
        validateStatus: () => true,
      });
      setRawResponse({ endpoint: `/api/courses/${id} (DELETE)`, status: res.status, data: res.data });

      if (res.status === 200 || res.status === 204) {
        setCourses((prev) => prev.filter((c) => (c._id || c.id) !== id));
        showMessage("success", "Course deleted");
      } else {
        showMessage("error", res.data?.message || `Delete failed (${res.status})`);
      }
    } catch (err) {
      console.error("deleteCourse", err);
      showMessage("error", "Error deleting course");
      setRawResponse({ endpoint: `/api/courses/${id} (DELETE)`, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- API: users (prefer /api/users; fallback to courses/user-data) ---------- */
  const fetchUsers = async () => {
    setTab("users");
    setLoading(true);
    setRawResponse(null);

    try {
      const res = await axios.get(`${API_BASE}/api/users`, {
        headers: { ...authHeader() },
        validateStatus: () => true,
      });
      setRawResponse({ endpoint: "/api/users", status: res.status, data: res.data });

      if (res.status === 200 && Array.isArray(res.data)) {
        const normalized = res.data.map((u) => ({ ...u, _id: u._id || u.id }));
        setUsers(normalized);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.debug("fetchUsers: /api/users failed, trying fallback", err.message || err);
    }

    // Fallback: /api/courses/user-data
    try {
      const r = await axios.get(`${API_BASE}/api/courses/user-data?download=false`, {
        headers: { ...authHeader() },
        validateStatus: () => true,
      });
      setRawResponse({ endpoint: "/api/courses/user-data?download=false", status: r.status, data: r.data });

      if (r.status === 200 && Array.isArray(r.data)) {
        const normalized = r.data.map((u) => ({ ...u, _id: u._id || u.id }));
        setUsers(normalized);
        setLoading(false);
        return;
      }

      const blobRes = await axios.get(`${API_BASE}/api/courses/user-data`, {
        headers: { ...authHeader() },
        responseType: "blob",
        validateStatus: () => true,
      });
      setRawResponse({ endpoint: "/api/courses/user-data (blob)", status: blobRes.status });

      if (blobRes.status === 200) {
        const text = await blobRes.data.text();
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            const normalized = parsed.map((u) => ({ ...u, _id: u._id || u.id }));
            setUsers(normalized);
            setLoading(false);
            return;
          }
        } catch {
          // not JSON — trigger download
          const url = window.URL.createObjectURL(blobRes.data);
          const a = document.createElement("a");
          a.href = url;
          a.download = "users.json";
          document.body.appendChild(a);
          a.click();
          a.remove();
          showMessage("success", "User export downloaded.");
        }
      } else {
        showMessage("error", `Could not fetch users (${blobRes.status})`);
      }
    } catch (err) {
      console.error("fetchUsers fallback", err);
      showMessage("error", "Error fetching users — check backend and permissions");
      setRawResponse({ endpoint: "/api/courses/user-data", error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const editUserStart = (u) => {
    setEditingUserId(u._id || u.id);
    setUserForm({
      name: u.name || "",
      email: u.email || "",
      phoneNumber: u.phoneNumber || "",
      hasPaid: !!u.hasPaid,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveUserEdit = async (e) => {
    e?.preventDefault();
    if (!editingUserId) return;
    setLoading(true);
    setRawResponse(null);
    try {
      const payload = { ...userForm };
      const res = await axios.put(`${API_BASE}/api/users/${editingUserId}`, payload, {
        headers: { ...authHeader(), "Content-Type": "application/json" },
        validateStatus: () => true,
      });

      setRawResponse({ endpoint: `/api/users/${editingUserId} (PUT)`, status: res.status, data: res.data });

      if (res.status === 200) {
        const updated = res.data?.user || res.data;
        if (updated && (updated._id || updated.id)) {
          const normalized = { ...updated, _id: updated._id || updated.id };
          setUsers((prev) => prev.map((x) => ((x._id || x.id) === editingUserId ? { ...x, ...normalized } : x)));
        } else {
          setUsers((prev) => prev.map((x) => ((x._id || x.id) === editingUserId ? { ...x, ...payload } : x)));
        }

        setEditingUserId(null);
        setUserForm({ name: "", email: "", phoneNumber: "", hasPaid: false });
        showMessage("success", "User updated");

        try {
          await fetchUsers();
        } catch {
          // ignore
        }
      } else {
        showMessage("error", res.data?.message || `Update failed (${res.status})`);
      }
    } catch (err) {
      console.error("saveUserEdit", err);
      showMessage("error", "Error updating user — ensure admin route exists");
      setRawResponse({ endpoint: `/api/users/${editingUserId} (PUT)`, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    setRawResponse(null);
    try {
      const res = await axios.delete(`${API_BASE}/api/users/${userId}`, {
        headers: { ...authHeader() },
        validateStatus: () => true,
      });
      setRawResponse({ endpoint: `/api/users/${userId} (DELETE)`, status: res.status, data: res.data });

      if (res.status === 200 || res.status === 204) {
        setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
        showMessage("success", "User deleted");
      } else {
        showMessage("error", res.data?.message || `Delete failed (${res.status})`);
      }
    } catch (err) {
      console.error("deleteUser", err);
      showMessage("error", "Error deleting user");
      setRawResponse({ endpoint: `/api/users/${userId} (DELETE)`, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Payment simulation ---------- */
  const simulatePayment = async (userId) => {
    setLoading(true);
    setRawResponse(null);
    try {
      const payload = { userId, amount: 200, transactionId: `tx_${Date.now()}` };
      const res = await axios.post(`${API_BASE}/api/courses/payment`, payload, {
        headers: { ...authHeader(), "Content-Type": "application/json" },
        validateStatus: () => true,
      });
      setRawResponse({ endpoint: "/api/courses/payment (POST)", status: res.status, data: res.data });

      if (res.status === 200) {
        showMessage("success", "Payment recorded");
        setUsers((prev) => prev.map((u) => ((u._id || u.id) === userId ? { ...u, hasPaid: true } : u)));
      } else {
        showMessage("error", res.data?.message || `Payment failed (${res.status})`);
      }
    } catch (err) {
      console.error("simulatePayment", err);
      showMessage("error", "Error simulating payment");
      setRawResponse({ endpoint: "/api/courses/payment", error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("ii_token");
    navigate("/login");
  };

  // initial load
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  /* ------------------ RENDER ------------------ */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {spinnerStyles}
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">IIAcademy Admin</h1>
            <p className="text-sm text-gray-600">Manage courses, users and payments</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 bg-white px-3 py-1 rounded shadow-sm">
              <span className="text-sm text-gray-600">{plural(courses.length, "course", "courses")}</span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-600">{plural(users.length, "user", "users")}</span>
            </div>

            <button
              onClick={() => { setTab("courses"); fetchCourses(); }}
              className={`px-3 py-2 rounded-md text-sm ${tab === "courses" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 shadow-sm"}`}
              disabled={loading}
            >
              Courses
            </button>

            <button
              onClick={() => { setTab("users"); fetchUsers(); }}
              className={`px-3 py-2 rounded-md text-sm ${tab === "users" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 shadow-sm"}`}
              disabled={loading}
            >
              Users
            </button>

            <button
              onClick={() => setTab("payments")}
              className={`px-3 py-2 rounded-md text-sm ${tab === "payments" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 shadow-sm"}`}
              disabled={loading}
            >
              Payments
            </button>

            <button onClick={logout} className="px-3 py-2 rounded-md bg-red-500 text-white text-sm">Logout</button>
          </div>
        </header>

        {/* Messages */}
        {msg && (
          <div className={`mb-4 p-3 rounded ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {msg.text}
          </div>
        )}

        {/* MAIN CONTENT */}
        <main>
          {/* COURSES */}
          {tab === "courses" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <section className="lg:col-span-1 bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">{editingCourseId ? "Edit Course" : "Add Course"}</h2>
                <form onSubmit={editingCourseId ? saveCourseEdit : addCourse}>
                  <label className="block text-sm mt-2">Title</label>
                  <input
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full p-2 border rounded mt-1"
                    required
                    aria-label="Course title"
                  />

                  <label className="block text-sm mt-2">Description</label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full p-2 border rounded mt-1"
                    rows={4}
                    required
                    aria-label="Course description"
                  />

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="block text-sm">Duration (days)</label>
                      <input
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                        className="w-full p-2 border rounded mt-1"
                        type="number"
                        min="0"
                        required
                        aria-label="Course duration"
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Instructor</label>
                      <input
                        value={courseForm.instructor}
                        onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                        className="w-full p-2 border rounded mt-1"
                        required
                        aria-label="Instructor"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                      {loading ? <><Spinner size={14} /> <span className="ml-2">Saving...</span></> : (editingCourseId ? "Save" : "Add Course")}
                    </button>
                    {editingCourseId && (
                      <button type="button" onClick={() => { setEditingCourseId(null); setCourseForm({ title: "", description: "", duration: "", instructor: "" }); }} className="px-4 py-2 bg-gray-200 rounded-md">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </section>

              {/* List */}
              <section className="lg:col-span-2 bg-white p-4 rounded shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Courses</h2>
                  <div className="text-sm text-gray-500">{loading ? <span className="flex items-center gap-2"><Spinner size={14} /> loading</span> : `${courses.length} items`}</div>
                </div>

                {!loading && courses.length === 0 && <div className="text-sm text-gray-500">No courses found. Add your first course.</div>}

                <div className="space-y-3">
                  {courses.map((c) => (
                    <article key={c._id || c.id} className="p-3 border rounded flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{c.title}</div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{c.description}</p>
                        <div className="text-xs text-gray-400 mt-2">Duration: <strong className="text-gray-700">{c.duration}</strong> days — Instructor: <strong>{c.instructor}</strong></div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => startCourseEdit(c)} disabled={loading} className="px-3 py-1 bg-yellow-400 rounded text-sm">Edit</button>
                        <button onClick={() => deleteCourse(c._id || c.id)} disabled={loading} className="px-3 py-1 bg-red-500 rounded text-white text-sm">Delete</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <section className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Users</h2>
                <div className="text-sm text-gray-500">{users.length} users</div>
              </div>

              {loading && <div className="text-sm text-gray-500 mb-3 flex items-center gap-2"><Spinner size={14} /> Loading...</div>}

              {!loading && users.length === 0 && <div className="text-sm text-gray-500">No users loaded. Click "Users" to fetch or export users from server.</div>}

              {users.length > 0 && (
                <div className="overflow-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="text-left text-sm text-gray-600">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Paid</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id || u.email} className="border-t">
                          <td className="p-2">{u.name || "-"}</td>
                          <td className="p-2">{u.email}</td>
                          <td className="p-2">{u.phoneNumber || "-"}</td>
                          <td className="p-2">{u.hasPaid ? "Yes" : "No"}</td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <button onClick={() => simulatePayment(u._id || u.id)} disabled={loading} className="px-3 py-1 bg-green-500 text-white rounded text-sm">Simulate Payment</button>
                              <button onClick={() => editUserStart(u)} disabled={loading} className="px-3 py-1 bg-yellow-400 rounded text-sm">Edit</button>
                              <button onClick={() => deleteUser(u._id || u.id)} disabled={loading} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Inline user edit */}
              {editingUserId && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                  <h3 className="font-semibold mb-2">Edit User</h3>
                  <form onSubmit={saveUserEdit}>
                    <label className="block text-sm">Name</label>
                    <input className="w-full p-2 border rounded mt-1" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />

                    <label className="block text-sm mt-2">Email</label>
                    <input className="w-full p-2 border rounded mt-1" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} type="email" required />

                    <label className="block text-sm mt-2">Phone</label>
                    <input className="w-full p-2 border rounded mt-1" value={userForm.phoneNumber} onChange={(e) => setUserForm({ ...userForm, phoneNumber: e.target.value })} />

                    <label className="flex items-center gap-2 mt-2">
                      <input type="checkbox" checked={userForm.hasPaid} onChange={(e) => setUserForm({ ...userForm, hasPaid: e.target.checked })} />
                      <span className="text-sm">Has Paid</span>
                    </label>

                    <div className="flex gap-2 mt-3">
                      <button type="submit" disabled={loading} className="px-3 py-1 bg-indigo-600 text-white rounded">{loading ? <Spinner size={14} /> : "Save"}</button>
                      <button type="button" onClick={() => { setEditingUserId(null); setUserForm({ name: "", email: "", phoneNumber: "", hasPaid: false }); }} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}

          {/* PAYMENTS */}
          {tab === "payments" && (
            <section className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Payments</h2>
              <p className="text-sm text-gray-600">Use the Users tab to simulate payments or export reports.</p>
            </section>
          )}

          {/* Debug panel */}
          <div className="mt-6">
            <button onClick={() => setShowDebug((s) => !s)} className="text-sm text-indigo-600 hover:underline">{showDebug ? "Hide" : "Show"} debug panel</button>
            {showDebug && (
              <div className="mt-3 p-3 bg-gray-50 border rounded">
                <div className="text-xs text-gray-500 mb-2">Last raw response</div>
                <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded max-h-64 overflow-auto">{JSON.stringify(rawResponse, null, 2)}</pre>
                <div className="mt-2 text-xs text-gray-500">Local token present: {localStorage.getItem("ii_token") ? "yes" : "no"}</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
