import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
            <h1 style={{ fontSize: "4rem", fontWeight: "800", marginBottom: "1rem" }}>404</h1>
            <p style={{ fontSize: "1.25rem", color: "var(--color-secondary)", marginBottom: "2rem" }}>
                Page not found.
            </p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    );
}
