import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { QrCode, Sun, Moon, Plus, ScanLine } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function Layout() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <header style={{ borderBottom: "1px solid var(--color-border)" }}>
                <div className="container" style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", fontSize: "1.25rem" }}>
                        <QrCode />
                        <span>Q-ryft (Beta)</span>
                    </Link>
                    <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                background: "transparent",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.5rem",
                                cursor: "pointer",
                                color: "var(--color-text)"
                            }}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <Link to="/scan" style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--color-text)", border: "2px solid var(--color-border)", borderRadius: "var(--radius)", padding: "0.5rem" }} className="nav-scan-btn">
                            <ScanLine size={18} />
                            <span className="nav-btn-text">Scan</span>
                        </Link>
                        <Link to="/dashboard" style={{ fontSize: "0.9rem", color: "var(--color-text)", textDecoration: "none" }}>Dashboard</Link>
                        <Link to="/create" className="btn btn-primary nav-create-btn">
                            <Plus size={18} />
                            <span className="nav-btn-text">Create QR</span>
                        </Link>
                    </nav>
                </div>
            </header>

            <main style={{ flex: 1, padding: "2rem 0" }}>
                <Outlet />
            </main>

            <footer style={{ borderTop: "1px solid var(--color-border)", padding: "2rem 0", color: "var(--color-secondary)" }}>
                <div className="container" style={{ textAlign: "center", fontSize: "0.875rem" }}>
                    <p>© {new Date().getFullYear()} Made with ❤️ by <a href="https://dusk-lab.github.io/main-website/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "var(--color-text)" }}>Dusk Lab</a>.</p>
                </div>
            </footer>
        </div>
    );
}
