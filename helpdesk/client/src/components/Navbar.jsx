import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#121212] border-b border-gray-800 px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-white text-2xl font-bold">
        Helpdesk
      </Link>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white font-medium ${
                  isActive ? "border-b-2 border-blue-500" : ""
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white font-medium ${
                  isActive ? "border-b-2 border-blue-500" : ""
                }`
              }
            >
              Tickets
            </NavLink>

            {user.role === "Admin" && (
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `text-gray-300 hover:text-white font-medium ${
                    isActive ? "border-b-2 border-blue-500" : ""
                  }`
                }
              >
                Admin
              </NavLink>
            )}

            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white font-medium ${
                  isActive ? "border-b-2 border-blue-500" : ""
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white font-medium ${
                  isActive ? "border-b-2 border-blue-500" : ""
                }`
              }
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
