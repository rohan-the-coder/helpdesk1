import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";

// Role-specific dashboards
import UserDashboard from "../pages/Dashboard/UserDashboard";
import AgentDashboard from "../pages/Dashboard/AgentDashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";

// Admin Pages
import ManageUsers from "../pages/Admin/ManageUsers";
import ManageCategories from "../pages/Admin/ManageCategories";



// Common Pages
import TicketDetails from "../pages/Tickets/TicketDetails";

import ProtectedRoute from "./ProtectedRoute";
import Landing from "../pages/Landing";
import TicketCreate from "../pages/Tickets/TicketCreate";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing/>} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
          </ProtectedRoute>
        }
      >
        {/* Nested dashboards */}
        <Route index element={<Navigate to="user" />} />

        <Route
          path="user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="agent"
          element={
            <ProtectedRoute allowedRoles={["agent"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Pages */}
      <Route
        path="/admin/manage-users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageCategories />
          </ProtectedRoute>
        }
      />

      {/* Agent Page */}
      <Route
        path="/agent/create-ticket"
        element={
          <ProtectedRoute allowedRoles={["agent"]}>
            <TicketCreate/>
          </ProtectedRoute>
        }
      />

      {/* Ticket detail for all roles */}
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetails />
          </ProtectedRoute>
        }
      />

      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
