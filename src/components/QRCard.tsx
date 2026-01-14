import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ExternalLink, Edit2, BarChart2 } from "lucide-react";
import { QRLink } from "../models/qr.model";
import { getAppUrl } from "../utils/url";

interface QRCardProps {
    qr: QRLink;
}

export default function QRCard({ qr }: QRCardProps) {
    const fullRedirectUrl = getAppUrl(`/q/${qr.slug}`);

    return (
        <div style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            display: "flex",
            gap: "1.5rem",
            backgroundColor: "var(--color-bg)",
            alignItems: "flex-start"
        }}>
            <div style={{
                padding: "0.5rem",
                background: "white",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-border)",
                display: "flex"
            }}>
                <QRCodeSVG value={fullRedirectUrl} size={100} level="M" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div>
                        <h3 style={{ fontWeight: "600", fontSize: "1.1rem", marginBottom: "0.25rem" }}>{qr.name}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-secondary)" }}>
                            <span style={{ fontFamily: "monospace", background: "var(--color-border)", padding: "0.1rem 0.4rem", borderRadius: "0.25rem" }}>
                                /{qr.slug}
                            </span>
                            <span>•</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                {qr.isActive ? (
                                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
                                ) : (
                                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
                                )}
                                {qr.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
                    <div style={{ color: "var(--color-secondary)", marginBottom: "0.25rem" }}>Destinations to:</div>
                    <a
                        href={qr.destinationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-accent)", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                        {qr.destinationUrl}
                        <ExternalLink size={12} />
                    </a>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Link to={`/qr/${qr.id}`} className="btn btn-outline" style={{ fontSize: "0.875rem", padding: "0.4rem 0.8rem", gap: "0.4rem" }}>
                        <Edit2 size={14} />
                        Manage
                    </Link>
                    <button className="btn btn-outline" disabled style={{ fontSize: "0.875rem", padding: "0.4rem 0.8rem", gap: "0.4rem", opacity: 0.5 }}>
                        <BarChart2 size={14} />
                        Stats
                    </button>
                </div>
            </div>
        </div>
    );
}
