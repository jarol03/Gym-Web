import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, useNavigate, useSearchParams } from "react-router-dom";
import { LoginForm } from "../features/auth/components/LoginForm";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { AdminRoute } from "../shared/components/AdminRoute";
import { Layout } from "../shared/components/Layout";
import { MembershipStatusCard } from "../features/membership/components/MembershipStatusCard";
import { MembershipsList } from "../features/membership/components/MembershipsList";
import { AdminStats } from "../features/membership/components/AdminStats";
import { InventoryList } from "../features/inventory/components/InventoryList";
import { AddItemForm } from "../features/inventory/components/AddItemForm";
import { AnnouncementsList } from "../features/announcements/components/AnnouncementsList";
import { CreateAnnouncementForm } from "../features/announcements/components/CreateAnnouncementForm";
import { AdminAnnouncementsList } from "../features/announcements/components/AdminAnnouncementsList";
import { CheckinPage } from "../features/attendance/components/CheckinPage";
import { CreateMemberForm } from "../features/membership/components/CreateMemberForm";
import { useTodayAttendance } from "../features/attendance/hooks/useTodayAttendance";

function HomePage() {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: todayAttendance } = useTodayAttendance();
  const hasCheckedIn = todayAttendance?.includes(profile?.id ?? '') ?? false;
  const tab = searchParams.get('tab') || 'inicio';

  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  if (isAdmin) return null;

  const hour = new Date().getHours();
  let greeting = "Buenos días";
  let greetingIcon: React.ReactNode;
  if (hour >= 12 && hour < 18) {
    greeting = "Buenas tardes";
    greetingIcon = (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
      </svg>
    );
  } else if (hour >= 18) {
    greeting = "Buenas noches";
    greetingIcon = (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  } else {
    greetingIcon = (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    );
  }

  return (
    <Layout>
      {tab === "inicio" && (
        <div key="inicio" style={{ display: "flex", flexDirection: "column", gap: 20, animation: "slideUp 0.4s var(--spring-smooth)" }}>
          <div style={{ animation: "slideUp 0.4s var(--spring-smooth)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)"
              }}>
                {greetingIcon}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{greeting}</p>
            </div>
            <h1 style={{ fontSize: 30, lineHeight: 1.1, margin: 0 }}>{profile?.full_name}</h1>
          </div>
          <MembershipStatusCard />
        </div>
      )}

      {tab === "checkin" && (
        <div key="checkin" style={{ display: "flex", flexDirection: "column", gap: 12, animation: "slideUp 0.35s var(--spring-smooth)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-heading)", fontSize: 15, textTransform: "uppercase",
            letterSpacing: "0.06em", color: "var(--cyan)"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Asistencia del día
          </div>

          <div
            style={{
              background: `linear-gradient(135deg, var(--surface), ${hasCheckedIn ? 'rgba(16,185,129,0.04)' : 'rgba(6,182,212,0.04)'})`,
              border: `1px solid ${hasCheckedIn ? "rgba(16,185,129,0.2)" : "var(--border)"}`,
              borderRadius: "var(--radius)",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              transition: "all 0.25s var(--spring-smooth)",
            }}
            onClick={() => navigate("/checkin")}
          >
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: hasCheckedIn ? "var(--green-glow)" : "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(16,185,129,0.12))",
              color: hasCheckedIn ? "var(--green)" : "var(--cyan)",
            }}>
              {hasCheckedIn ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading)", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, color: hasCheckedIn ? "var(--green)" : "var(--text)" }}>
                {hasCheckedIn ? "Asistencia registrada" : "Registrar asistencia"}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
                {hasCheckedIn ? "Bien hecho, ya cumpliste con tu check-in hoy" : "Toca aquí para escanear el QR en recepción"}
              </p>
            </div>
            {!hasCheckedIn && (
              <div style={{
                marginTop: 4, padding: "6px 16px", borderRadius: "var(--radius-full)",
                background: "var(--surface-2)", fontSize: 11, color: "var(--text-muted)",
                fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em"
              }}>
                Escanear QR
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "anuncios" && (
        <div key="anuncios" style={{ animation: "slideUp 0.35s var(--spring-smooth)" }}>
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
      )}
    </Layout>
  );
}

function AdminDashboardPage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {tab === "dashboard" && (
          <div key="dashboard" style={{ animation: "slideUp 0.4s var(--spring-smooth)" }}>
            <div style={{ animation: "slideUp 0.5s var(--spring-smooth)" }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>
                Panel de administración
              </p>
              <h1 style={{ fontSize: 30, lineHeight: 1.1 }}>{profile?.full_name}</h1>
            </div>
            <div style={{ marginTop: 16 }}>
              <AdminStats />
            </div>
          </div>
        )}
        {tab === "usuarios" && (
          <div key="usuarios" style={{ animation: "slideUp 0.4s var(--spring-smooth)" }}>
            <CreateMemberForm />
            <MembershipsList />
          </div>
        )}
        {tab === "inventario" && (
          <div key="inventario" style={{ animation: "slideUp 0.4s var(--spring-smooth)" }}>
            <AddItemForm />
            <InventoryList />
          </div>
        )}
        {tab === "anuncios" && (
          <div key="anuncios" style={{ animation: "slideUp 0.4s var(--spring-smooth)" }}>
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
