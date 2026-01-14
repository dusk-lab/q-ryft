import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Zap } from "lucide-react";
import { generateSlug } from "../utils/slug";
import { createQRLink } from "../services/storage.service";

export default function CreateQR() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<"dynamic" | "static">("dynamic");
    const [formData, setFormData] = useState({
        name: "",
        destinationUrl: "",
        staticContent: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "dynamic") {
            setIsSubmitting(true);

            // Basic validation
            let url = formData.destinationUrl.trim();
            if (!url) return;
            if (!/^https?:\/\//i.test(url)) {
                url = "https://" + url;
            }

            // Generate ID and Slug
            const id = crypto.randomUUID();
            const slug = generateSlug();
            const name = formData.name.trim() || url; // Fallback name

            // Save
            createQRLink({
                id,
                slug,
                name,
                destinationUrl: url
            });

            // Redirect to details
            navigate(`/qr/${id}`);
        } else {
            // Static logic (Not implemented yet based on priority, just placeholder)
            alert("Static QR generation is client-side only and doesn't save to dashboard (Coming Soon).");
        }
    };

    return (
        <div className="container" style={{ maxWidth: "600px", padding: "2rem 1rem" }}>
            <button
                onClick={() => navigate(-1)}
                style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-secondary)", marginBottom: "2rem", padding: 0 }}
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>Create New QR</h1>

            <div style={{ display: "flex", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "var(--radius)", padding: "0.25rem", marginBottom: "2rem" }}>
                <button
                    onClick={() => setMode("dynamic")}
                    style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "calc(var(--radius) - 2px)",
                        border: "none",
                        background: mode === "dynamic" ? "var(--color-primary)" : "transparent",
                        color: mode === "dynamic" ? "var(--color-bg)" : "var(--color-secondary)",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition: "all 0.2s"
                    }}
                >
                    <Zap size={16} />
                    Dynamic (Qryft Link)
                </button>
                <button
                    onClick={() => setMode("static")}
                    style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "calc(var(--radius) - 2px)",
                        border: "none",
                        background: mode === "static" ? "var(--color-primary)" : "transparent",
                        color: mode === "static" ? "var(--color-bg)" : "var(--color-secondary)",
                        fontWeight: "500",
                        transition: "all 0.2s"
                    }}
                >
                    Static (Raw)
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {mode === "dynamic" ? (
                    <>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Destination URL</label>
                            <input
                                type="url"
                                required
                                placeholder="https://example.com/my-page"
                                className="input"
                                value={formData.destinationUrl}
                                onChange={e => setFormData({ ...formData, destinationUrl: e.target.value })}
                            />
                            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--color-secondary)" }}>
                                You can change this anytime later without reprinting the QR code.
                            </p>
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Summer Campaign Flyer"
                                className="input"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </>
                ) : (
                    <div style={{ padding: "2rem", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "var(--radius)", color: "var(--color-secondary)" }}>
                        Static QR generation is coming in a future update.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || mode === "static"}
                    className="btn btn-primary"
                    style={{ padding: "0.75rem", fontSize: "1rem", marginTop: "1rem", opacity: (isSubmitting || mode === 'static') ? 0.7 : 1 }}
                >
                    <Save size={18} style={{ marginRight: "0.5rem" }} />
                    {isSubmitting ? "Creating..." : "Create QR Code"}
                </button>
            </form>
        </div>
    );
}
