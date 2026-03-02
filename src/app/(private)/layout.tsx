import { UserBadge } from "@/components/UserBadge";
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ padding: 16, borderRight: "1px solid #ddd" }}>
        <UserBadge />
        <h2 style={{ margin: 0 }}>Next SaaS</h2>
        <nav style={{ marginTop: 16, display: "grid", gap: 8 }}>
          <a href="/dashboard">Dashboard</a>
          <a href="/login">Login</a>
        </nav>
      </aside>

      <main style={{ padding: 24 }}>{children}</main>
    </section>
  );
}