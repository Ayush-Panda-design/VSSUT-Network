import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="grid h-screen place-items-center text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/app" replace />;
  return children;
}
