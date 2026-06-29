import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { LoginForm } from "../features/auth/components/LoginForm";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { AdminRoute } from "../shared/components/AdminRoute";
import { MembershipStatusCard } from "../features/membership/components/MembershipStatusCard";
import { MembershipsList } from "../features/membership/components/MembershipsList";
import { InventoryList } from "../features/inventory/components/InventoryList";
import { AddItemForm } from "../features/inventory/components/AddItemForm";
import { AnnouncementsList } from "../features/announcements/components/AnnouncementsList";
import { CreateAnnouncementForm } from "../features/announcements/components/CreateAnnouncementForm";
import { AdminAnnouncementsList } from "../features/announcements/components/AdminAnnouncementsList";
import { CheckinPage } from "../features/attendance/components/CheckinPage";
import { useEffect } from "react";
import { CreateMemberForm } from "../features/membership/components/CreateMemberForm";

function HomePage() {
  const { profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, navigate]);

  if (isAdmin) {
    return null;
  }

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 20 }}>Hola, {profile?.full_name}</h1>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
      <MembershipStatusCard />
      <h2 style={{ fontSize: 16, marginTop: 24, marginBottom: 12 }}>
        Anuncios
      </h2>
      <AnnouncementsList />
    </div>
  );
}

function AdminDashboardPage() {
  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 24 }}>Panel de administración</h1>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Socios</h2>
      <CreateMemberForm />
      <MembershipsList />

      <h2 style={{ fontSize: 16, marginTop: 32, marginBottom: 12 }}>
        Inventario
      </h2>
      <AddItemForm />
      <InventoryList />

      <h2 style={{ fontSize: 16, marginTop: 32, marginBottom: 12 }}>
        Anuncios
      </h2>
      <CreateAnnouncementForm />
      <AdminAnnouncementsList />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboardPage />
      </AdminRoute>
    ),
  },
  {
    path: "/checkin",
    element: (
      <ProtectedRoute>
        <CheckinPage />
      </ProtectedRoute>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
