import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "Inter, sans-serif" }}>
        <span>Verifying admin privileges...</span>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not an admin, redirect to general customer home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If admin, allow rendering child route templates
  return <Outlet />;
}
