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
import { useTodayAttendance } from "../features/attendance/hooks/useTodayAttendance";

function HomePage() {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { data: todayAttendance } = useTodayAttendance();
  const hasCheckedIn = todayAttendance?.includes(profile?.id ?? '') ?? false;

  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  if (isAdmin) return null;

  const hour = new Date().getHours();
  let greeting = "Buenos días";
  let icon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
  if (hour >= 12 && hour < 18) {
    greeting = "Buenas tardes";
    icon = (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }
  if (hour >= 18) {
    greeting = "Buenas noches";
    icon = (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ animation: "slideUp 0.4s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)"
            }}>
              {icon}
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{greeting}</p>
          </div>
          <h1 style={{ fontSize: 30, lineHeight: 1.1, margin: 0 }}>{profile?.full_name}</h1>
        </div>

        <div style={{ animation: "slideUp 0.4s ease-out 0.08s both" }}>
          <MembershipStatusCard />
        </div>

        <div
          style={{
            animation: "slideUp 0.4s ease-out 0.12s both",
            background: "var(--surface)",
            border: `1px solid ${hasCheckedIn ? "var(--green)" : "var(--border)"}`,
            borderRadius: "var(--radius)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => navigate("/checkin")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: hasCheckedIn ? "var(--green-glow)" : "var(--surface-2)",
              color: hasCheckedIn ? "var(--green)" : "var(--cyan)",
            }}>
              {hasCheckedIn ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              )}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--text)" }}>
                {hasCheckedIn ? "Ya registraste tu asistencia hoy" : "Registrar asistencia"}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>
                {hasCheckedIn
                  ? "Has cumplido con tu check-in diario"
                  : "Escanea el QR en la recepción del gym"}
              </p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        <div style={{ animation: "slideUp 0.4s ease-out 0.15s both" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
            fontFamily: "var(--font-heading)", fontSize: 15, textTransform: "uppercase",
            letterSpacing: "0.06em", color: "var(--pink)"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Anuncios
          </div>
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
  const props = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: { flexShrink: 0, display: "block" } };
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
                gap: 5,
                padding: "10px 6px",
                borderRadius: "var(--radius-sm)",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-heading)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                background: activeTab === tab.key ? tab.color : "transparent",
                color: activeTab === tab.key ? "#000" : "var(--text-muted)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <TabIcon icon={tab.icon} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{tab.label}</span>
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
