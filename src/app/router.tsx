import { useState } from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import { LoginForm } from "../features/auth/components/LoginForm";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { AdminRoute } from "../shared/components/AdminRoute";
import { Layout } from "../shared/components/Layout";
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
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  if (isAdmin) return null;

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ animation: "slideUp 0.4s ease-out" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>
            Bienvenido de vuelta
          </p>
          <h1 style={{ fontSize: 30, lineHeight: 1.1 }}>{profile?.full_name}</h1>
        </div>
        <div style={{ animation: "slideUp 0.4s ease-out 0.1s both" }}>
          <MembershipStatusCard />
        </div>
        <div style={{ animation: "slideUp 0.4s ease-out 0.2s both" }}>
          <h2 style={{ fontSize: 15, marginBottom: 10, color: "var(--pink)", letterSpacing: "0.06em" }}>
            Anuncios
          </h2>
          <AnnouncementsList />
        </div>
      </div>
    </Layout>
  );
}

type AdminTab = "socios" | "inventario" | "anuncios";

const adminTabs = [
  { key: "socios" as AdminTab, label: "Socios", icon: "users", color: "var(--purple)" },
  { key: "inventario" as AdminTab, label: "Inventario", icon: "box", color: "var(--cyan)" },
  { key: "anuncios" as AdminTab, label: "Anuncios", icon: "megaphone", color: "var(--orange)" },
];

function TabIcon({ icon }: { icon: string }) {
  const props = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "users":
      return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "box":
      return <svg {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
    case "megaphone":
      return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    default:
      return null;
  }
}

function AdminDashboardPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("socios");

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ animation: "slideUp 0.4s ease-out" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>
            Panel de administración
          </p>
          <h1 style={{ fontSize: 30, lineHeight: 1.1 }}>{profile?.full_name}</h1>
        </div>

        <div style={{
          display: "flex",
          gap: 4,
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          padding: 4,
          animation: "slideUp 0.4s ease-out 0.05s both",
        }}>
          {adminTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 8px",
                borderRadius: "var(--radius-sm)",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-heading)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                background: activeTab === tab.key ? tab.color : "transparent",
                color: activeTab === tab.key ? "#000" : "var(--text-muted)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <TabIcon icon={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "socios" && (
          <div style={{ animation: "slideUp 0.35s ease-out" }}>
            <CreateMemberForm />
            <MembershipsList />
          </div>
        )}
        {activeTab === "inventario" && (
          <div style={{ animation: "slideUp 0.35s ease-out" }}>
            <AddItemForm />
            <InventoryList />
          </div>
        )}
        {activeTab === "anuncios" && (
          <div style={{ animation: "slideUp 0.35s ease-out" }}>
            <CreateAnnouncementForm />
            <AdminAnnouncementsList />
          </div>
        )}
      </div>
    </Layout>
  );
}

const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
  { path: "/", element: <ProtectedRoute><HomePage /></ProtectedRoute> },
  { path: "/admin", element: <AdminRoute><AdminDashboardPage /></AdminRoute> },
  { path: "/checkin", element: <ProtectedRoute><CheckinPage /></ProtectedRoute> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
