import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { QrCode } from "lucide-react";

export default function Layout() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <header style={{ borderBottom: "1px solid var(--color-border)" }}>
                <div className="container" style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", fontSize: "1.25rem" }}>
                        <QrCode />
                        <span>Qryft</span>
                    </Link>
                    <nav style={{ display: "flex", gap: "1.5rem" }}>
                        <Link to="/dashboard" style={{ fontSize: "0.9rem" }}>Dashboard</Link>
                        <Link to="/create" className="btn btn-primary" style={{ fontSize: "0.9rem", padding: "0.25rem 0.75rem" }}>
                            Create QR
                        </Link>
                    </nav>
                </div>
            </header>

            <main style={{ flex: 1, padding: "2rem 0" }}>
                <Outlet />
            </main>

            <footer style={{ borderTop: "1px solid var(--color-border)", padding: "2rem 0", color: "var(--color-secondary)" }}>
                <div className="container" style={{ textAlign: "center", fontSize: "0.875rem" }}>
                    <p>© {new Date().getFullYear()} Dusk Lab. Built for reliability.</p>
                </div>
            </footer>
        </div>
    );
}
