import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, CheckSquare, X } from "lucide-react";
import QRCard from "../components/QRCard";
import { listQRLinks, deleteQRLink } from "../services/storage.service";
import { QRLink } from "../models/qr.model";

export default function Dashboard() {
    const [links, setLinks] = useState<QRLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Simulate loading a bit just for feel, or strict sync
        const data = listQRLinks();
        setLinks(data);
        setLoading(false);
    }, []);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedIds(new Set()); // Reset selection
    };

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedIds(next);
    };

    const handleDeleteSelected = () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} QR codes? This cannot be undone.`)) return;

        let lastData = links;
        selectedIds.forEach(id => {
            deleteQRLink(id);
            // We update local state to avoid full reload flicker
            lastData = lastData.filter(l => l.id !== id);
        });

        setLinks(lastData);
        setIsSelectionMode(false);
        setSelectedIds(new Set());
    };

    if (loading) {
        return <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>Loading...</div>;
    }

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Dashboard</h1>
                <div style={{ display: "flex", gap: "1rem" }}>
                    {links.length > 0 && (
                        <button
                            onClick={toggleSelectionMode}
                            className="btn btn-outline"
                            style={{ gap: "0.5rem" }}
                        >
                            {isSelectionMode ? <X size={18} /> : <CheckSquare size={18} />}
                            {isSelectionMode ? "Cancel" : "Select"}
                        </button>
                    )}

                    {isSelectionMode && selectedIds.size > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="btn"
                            style={{ gap: "0.5rem", background: "var(--color-error)", color: "white", borderColor: "var(--color-error)" }}
                        >
                            <Trash2 size={18} />
                            Delete ({selectedIds.size})
                        </button>
                    )}

                    {!isSelectionMode && (
                        <Link to="/create" className="btn btn-primary" style={{ gap: "0.5rem" }}>
                            <Plus size={18} />
                            New QR
                        </Link>
                    )}
                </div>
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
                        <QRCard
                            key={link.id}
                            qr={link}
                            selectable={isSelectionMode}
                            selected={selectedIds.has(link.id)}
                            onSelect={() => toggleSelection(link.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
