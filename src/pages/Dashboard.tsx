import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import QRCard from "../components/QRCard";
import { listQRLinks } from "../services/storage.service";
import { QRLink } from "../models/qr.model";

export default function Dashboard() {
    const [links, setLinks] = useState<QRLink[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading a bit just for feel, or strict sync
        const data = listQRLinks();
        setLinks(data);
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>Loading...</div>;
    }

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Dashboard</h1>
                <Link to="/create" className="btn btn-primary" style={{ gap: "0.5rem" }}>
                    <Plus size={18} />
                    New QR
                </Link>
            </div>

            {links.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    border: "1px dashed var(--color-border)",
                    borderRadius: "var(--radius)",
                    color: "var(--color-secondary)"
                }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--color-text)" }}>No QR codes yet</h3>
                    <p style={{ marginBottom: "1.5rem" }}>Create your first dynamic QR code to get started.</p>
                    <Link to="/create" className="btn btn-primary">Create QR</Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {links.map(link => (
                        <QRCard key={link.id} qr={link} />
                    ))}
                </div>
            )}
        </div>
    );
}
