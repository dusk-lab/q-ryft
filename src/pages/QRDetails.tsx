import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Save, ExternalLink, Download, Trash2, Power } from "lucide-react";
import { getQRLink, updateQRLink, deleteQRLink } from "../services/storage.service";
import { QRLink } from "../models/qr.model";
import { getAppUrl } from "../utils/url";

export default function QRDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [qr, setQr] = useState<QRLink | null>(null);
    const [loading, setLoading] = useState(true);
    const [destinationUrl, setDestinationUrl] = useState("");
    const [name, setName] = useState("");
    const [isServing, setIsServing] = useState(false);

    useEffect(() => {
        if (!id) return;
        const link = getQRLink(id);
        if (link) {
            setQr(link);
            setDestinationUrl(link.destinationUrl);
            setName(link.name);
        } else {
            navigate("/dashboard"); // Or 404
        }
        setLoading(false);
    }, [id, navigate]);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!qr) return;

        setIsServing(true);
        const updated = updateQRLink(qr.id, {
            name,
            destinationUrl
        });

        if (updated) {
            setQr(updated);
        }
        setIsServing(false);
        alert("Saved successfully");
    };

    const toggleStatus = () => {
        if (!qr) return;
        const updated = updateQRLink(qr.id, {
            isActive: !qr.isActive
        });
        if (updated) setQr(updated);
    };

    const handleDelete = () => {
        if (!qr) return;
        if (confirm("Are you sure you want to delete this QR code? This cannot be undone.")) {
            deleteQRLink(qr.id);
            navigate("/dashboard");
        }
    };

    const [downloadFormat, setDownloadFormat] = useState<"svg" | "png" | "jpeg">("svg");

    const downloadQR = () => {
        const svg = document.querySelector("#qr-wrapper svg");
        if (!svg) return;

        if (downloadFormat === "svg") {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `qryft-${qr?.slug}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // Canvas Rasterization for PNG/JPEG
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();

            // Standardize size (e.g., 1000px for high quality)
            const size = 1000;
            canvas.width = size;
            canvas.height = size;

            // Base64 encode SVG for Image src
            const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                if (!ctx) return;

                // Fill white background for JPEG (otherwise transparent parts become black)
                if (downloadFormat === "jpeg") {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, size, size);
                }

                ctx.drawImage(img, 0, 0, size, size);

                const imgUrl = canvas.toDataURL(`image/${downloadFormat}`);
                const a = document.createElement("a");
                a.href = imgUrl;
                a.download = `qryft-${qr?.slug}.${downloadFormat}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };

            img.src = url;
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!qr) return null;

    const fullRedirectUrl = getAppUrl(`/q/${qr.slug}`);

    return (
        <div className="container" style={{ padding: "2rem 1rem" }}>
            <button
                onClick={() => navigate("/dashboard")}
                style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-secondary)", marginBottom: "2rem", padding: 0 }}
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>{qr.name}</h1>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--color-secondary)" }}>
                            <span style={{ fontFamily: "monospace", background: "var(--color-border)", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>
                                /{qr.slug}
                            </span>
                            <span>Created {new Date(qr.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                            onClick={toggleStatus}
                            className={`btn ${qr.isActive ? 'btn-outline' : 'btn-primary'}`}
                            style={{ gap: "0.5rem", borderColor: qr.isActive ? "var(--color-border)" : "transparent" }}
                        >
                            <Power size={18} />
                            {qr.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn btn-outline"
                            style={{ gap: "0.5rem", color: "var(--color-error)", borderColor: "var(--color-error)" }}
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                    {/* Settings Column */}
                    <div style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius)" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem" }}>Settings</h2>
                        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Destination URL</label>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <input
                                        type="url"
                                        required
                                        className="input"
                                        value={destinationUrl}
                                        onChange={e => setDestinationUrl(e.target.value)}
                                    />
                                    <a href={destinationUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: "0.5rem" }}>
                                        <ExternalLink size={18} />
                                    </a>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
                                <button type="submit" disabled={isServing} className="btn btn-primary" style={{ width: "100%", gap: "0.5rem" }}>
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* QR Preview Column */}
                    <div style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius)", background: "var(--color-bg)" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem" }}>QR Code</h2>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                            <div id="qr-wrapper" style={{ padding: "1rem", background: "white", borderRadius: "0.5rem", border: "1px solid var(--color-border)" }}>
                                <QRCodeSVG value={fullRedirectUrl} size={200} level="M" />
                            </div>

                            <div style={{ textAlign: "center", width: "100%" }}>
                                <p style={{ fontSize: "0.875rem", color: "var(--color-secondary)", marginBottom: "1rem", wordBreak: "break-all" }}>
                                    {fullRedirectUrl}
                                </p>

                                <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                                    {(["svg", "png", "jpeg"] as const).map((fmt) => (
                                        <button
                                            key={fmt}
                                            onClick={() => setDownloadFormat(fmt)}
                                            style={{
                                                padding: "0.25rem 0.5rem",
                                                borderRadius: "0.25rem",
                                                border: "1px solid var(--color-border)",
                                                background: downloadFormat === fmt ? "var(--color-primary)" : "transparent",
                                                color: downloadFormat === fmt ? "var(--color-bg)" : "var(--color-text)",
                                                fontSize: "0.8rem",
                                                textTransform: "uppercase",
                                                fontWeight: "600",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>

                                <button onClick={downloadQR} className="btn btn-outline" style={{ width: "100%", gap: "0.5rem" }}>
                                    <Download size={18} />
                                    Download {downloadFormat.toUpperCase()}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
