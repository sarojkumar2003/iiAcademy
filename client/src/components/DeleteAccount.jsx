import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Use useNavigate instead of useHistory

const DeleteAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleDelete = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch("/api/users/profile", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.removeItem("token");
        navigate("/login");  // Use navigate to redirect after account deletion
      } else {
        setError(data.message || "Error deleting account");
      }
    } catch (err) {
      setError("Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-center text-red-600">Delete Account</h1>
      <p className="text-gray-700 mb-4 text-center">
        Are you sure you want to delete your account? This action cannot be undone.
      </p>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/profile")}  // Use navigate to go back to profile
          className="text-blue-600 hover:text-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
