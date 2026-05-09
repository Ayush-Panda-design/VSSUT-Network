import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import AdminLogin from "./pages/auth/AdminLogin.jsx";
import UserLayout from "./pages/user/UserLayout.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import AlumniDirectory from "./pages/user/AlumniDirectory.jsx";
import StudentsDirectory from "./pages/user/StudentsDirectory.jsx";
import ProfileDetails from "./pages/user/ProfileDetails.jsx";
import ChatRooms from "./pages/user/ChatRooms.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageProfiles from "./pages/admin/ManageProfiles.jsx";
import ProfileForm from "./pages/admin/ProfileForm.jsx";
import ManageChat from "./pages/admin/ManageChat.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/app" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="alumni" element={<AlumniDirectory />} />
        <Route path="students" element={<StudentsDirectory />} />
        <Route path="profile/:id" element={<ProfileDetails />} />
        <Route path="chat" element={<ChatRooms />} />
        <Route path="chat/:roomId" element={<ChatRooms />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="profiles" element={<ManageProfiles />} />
        <Route path="profiles/new" element={<ProfileForm />} />
        <Route path="profiles/:id/edit" element={<ProfileForm />} />
        <Route path="chat" element={<ManageChat />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
