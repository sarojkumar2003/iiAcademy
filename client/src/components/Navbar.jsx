// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import logo from "./../images/logo.png";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

/** Robust base64url decode (JWT payload) */
function decodeJwt(token) {
  try {
    const part = token.split(".")[1];
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Extract a display name from common JWT claims */
function getDisplayName(payload) {
  return (
    payload?.fullName ||
    payload?.name ||
    (payload?.given_name && payload?.family_name
      ? `${payload.given_name} ${payload.family_name}`
      : payload?.given_name) ||
    payload?.preferred_username ||
    (payload?.email ? payload.email.split("@")[0] : null) ||
    "User"
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const readUserFromToken = () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setDisplayName(null);
        return;
      }

      const payload = decodeJwt(token);
      if (!payload) {
        setDisplayName(null);
        return;
      }

      // Optional: honor exp (seconds since epoch)
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        sessionStorage.removeItem("token");
        setDisplayName(null);
        return;
      }

      setDisplayName(getDisplayName(payload));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    readUserFromToken();
    const onAuthChanged = () => readUserFromToken();
    const onStorage = (e) => {
      if (e.key === "token") readUserFromToken();
    };
    window.addEventListener("auth-changed", onAuthChanged);
    window.addEventListener("storage", onStorage);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("auth-changed", onAuthChanged);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="h-10 -mt-6">
          <img src={logo} alt="logo" className="h-[5rem] w-auto" />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
          <li><HashLink smooth to="/#home" className="hover:text-blue-600">Home</HashLink></li>
          <li><HashLink smooth to="/#about" className="hover:text-blue-600">About</HashLink></li>
          <li><HashLink smooth to="/#services" className="hover:text-blue-600">Services</HashLink></li>
          <li><HashLink smooth to="/#success" className="hover:text-blue-600">Success Story</HashLink></li>
          <li><HashLink smooth to="/#contact" className="hover:text-blue-600">Contact</HashLink></li>

          {loading ? (
            <li className="text-gray-500">Loading...</li>
          ) : displayName ? (
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-purple-200 text-purple-600 font-semibold  w-20 rounded hover:bg-gray-300"
              >
                Hi, {displayName}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded overflow-hidden">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">View Profile</Link>
                  <Link to="/profile/edit" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Edit Profile</Link>
                  <Link to="/profile/delete" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Delete Account</Link>
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-4 px-6 space-y-4 shadow-lg">
          <a href="#home" className="block text-gray-700 hover:text-blue-600">Home</a>
          <a href="#about" className="block text-gray-700 hover:text-blue-600">About</a>
          <a href="#services" className="block text-gray-700 hover:text-blue-600">Services</a>
          <a href="#success" className="block text-gray-700 hover:text-blue-600">Success Story</a>
          <a href="#contact" className="block text-gray-700 hover:text-blue-600">Contact</a>

          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : displayName ? (
            <div>
              <span className="block mb-2 text-gray-800 font-semibold">Hi, {displayName}</span>
              <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">View Profile</Link>
              <Link to="/profile/edit" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Edit Profile</Link>
              <Link to="/profile/delete" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Delete Account</Link>
              <button
                onClick={handleLogout}
                className="mt-3 block w-full text-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="block bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
