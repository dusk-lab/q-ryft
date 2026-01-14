import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Zap, FileText, Wifi, User, Mail, MessageSquare, Calendar as CalendarIcon, MapPin, Link as LinkIcon, Download } from "lucide-react";
import { generateSlug } from "../utils/slug";
import { createQRLink } from "../services/storage.service";
import { QRCodeSVG } from "qrcode.react";
import * as Payloads from "../utils/qr-payloads";


type StaticType = "url" | "wifi" | "vcard" | "text" | "email" | "sms" | "event" | "geo";

export default function CreateQR() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<"dynamic" | "static">("dynamic");
    const [staticType, setStaticType] = useState<StaticType>("url");

    // Dynamic Form Data
    const [dynamicData, setDynamicData] = useState({ name: "", destinationUrl: "" });

    // Static Form Data (Generic bucket)
    const [staticData, setStaticData] = useState<any>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helpers to generate payload based on type
    const getStaticPayload = () => {
        switch (staticType) {
            case "url": return staticData.url || "";
            case "text": return staticData.text || "";
            case "wifi": return Payloads.generateWifiPayload(staticData.ssid || "", staticData.password, staticData.encryption, staticData.hidden);
            case "vcard": return Payloads.generateVCardPayload(staticData.firstName || "", staticData.lastName || "", staticData.phone, staticData.email, staticData.org, staticData.website, staticData.title);
            case "email": return Payloads.generateEmailPayload(staticData.to || "", staticData.subject, staticData.body);
            case "sms": return Payloads.generateSmsPayload(staticData.phone || "", staticData.message);
            case "geo": return Payloads.generateGeoPayload(staticData.lat || 0, staticData.lng || 0);
            case "event":
                if (!staticData.start || !staticData.end) return "";
                return Payloads.generateEventPayload(staticData.title || "", new Date(staticData.start), new Date(staticData.end), staticData.location, staticData.description);
            default: return "";
        }
    };

    const handleDynamicSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        let url = dynamicData.destinationUrl.trim();
        if (!url) return;
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;

        const id = crypto.randomUUID();
        const slug = generateSlug();
        const name = dynamicData.name.trim() || url;

        createQRLink({ id, slug, name, destinationUrl: url });
        navigate(`/qr/${id}`);
    };

    const downloadStatic = () => {
        const svg = document.querySelector("#static-qr-preview svg");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `qryft-static-${staticType}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const StaticTypeButton = ({ type, icon: Icon, label }: { type: StaticType, icon: any, label: string }) => (
        <button
            type="button"
            onClick={() => { setStaticType(type); setStaticData({}); }}
            style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
                padding: "1rem", borderRadius: "var(--radius)",
                border: "1px solid var(--color-border)",
                background: staticType === type ? "var(--color-primary)" : "var(--color-bg)",
                color: staticType === type ? "var(--color-bg)" : "var(--color-text)",
                cursor: "pointer", transition: "all 0.2s"
            }}
        >
            <Icon size={24} />
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>{label}</span>
        </button>
    );

    return (
        <div className="container" style={{ maxWidth: "800px", padding: "2rem 1rem" }}>
            <button
                onClick={() => navigate(-1)}
                style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-secondary)", marginBottom: "2rem", padding: 0, cursor: "pointer" }}
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>Create New QR</h1>

            {/* Mode Toggle */}
            <div style={{ display: "flex", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "var(--radius)", padding: "0.25rem", marginBottom: "2rem" }}>
                <button
                    onClick={() => setMode("dynamic")}
                    style={{
                        flex: 1, padding: "0.75rem", borderRadius: "calc(var(--radius) - 2px)", border: "none",
                        background: mode === "dynamic" ? "var(--color-primary)" : "transparent",
                        color: mode === "dynamic" ? "var(--color-bg)" : "var(--color-text)",
                        fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer"
                    }}
                >
                    <Zap size={18} />
                    Dynamic Link (Trackable)
                </button>
                <button
                    onClick={() => setMode("static")}
                    style={{
                        flex: 1, padding: "0.75rem", borderRadius: "calc(var(--radius) - 2px)", border: "none",
                        background: mode === "static" ? "var(--color-primary)" : "transparent",
                        color: mode === "static" ? "var(--color-bg)" : "var(--color-text)",
                        fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer"
                    }}
                >
                    <FileText size={18} />
                    Static Code (Raw)
                </button>
            </div>

            {mode === "dynamic" ? (
                <form onSubmit={handleDynamicSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                        <label className="label">Destination URL</label>
                        <input
                            type="url" required placeholder="https://example.com" className="input"
                            value={dynamicData.destinationUrl}
                            onChange={e => setDynamicData({ ...dynamicData, destinationUrl: e.target.value })}
                        />
                        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--color-secondary)" }}>
                            Redirects via Qryft. Can be changed later.
                        </p>
                    </div>
                    <div>
                        <label className="label">Name (Optional)</label>
                        <input
                            type="text" placeholder="e.g. Summer Campaign" className="input"
                            value={dynamicData.name}
                            onChange={e => setDynamicData({ ...dynamicData, name: e.target.value })}
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: "0.75rem", marginTop: "1rem" }}>
                        <Save size={18} style={{ marginRight: "0.5rem" }} />
                        {isSubmitting ? "Creating..." : "Create Dynamic QR"}
                    </button>
                </form>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", alignItems: "start" }}>
                    {/* Left: Configuration */}
                    <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "0.5rem", marginBottom: "2rem" }}>
                            <StaticTypeButton type="url" icon={LinkIcon} label="URL" />
                            <StaticTypeButton type="text" icon={FileText} label="Text" />
                            <StaticTypeButton type="wifi" icon={Wifi} label="Wi-Fi" />
                            <StaticTypeButton type="vcard" icon={User} label="vCard" />
                            <StaticTypeButton type="email" icon={Mail} label="Email" />
                            <StaticTypeButton type="sms" icon={MessageSquare} label="SMS" />
                            <StaticTypeButton type="event" icon={CalendarIcon} label="Event" />
                            <StaticTypeButton type="geo" icon={MapPin} label="Location" />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* Form fields change based on selection */}
                            {staticType === "url" && (
                                <div>
                                    <label className="label">Website URL</label>
                                    <input type="url" required className="input" placeholder="https://" onChange={e => setStaticData({ ...staticData, url: e.target.value })} />
                                </div>
                            )}

                            {staticType === "text" && (
                                <div>
                                    <label className="label">Plain Text</label>
                                    <textarea className="input" rows={4} placeholder="Enter your text here..." onChange={e => setStaticData({ ...staticData, text: e.target.value })} />
                                </div>
                            )}

                            {staticType === "wifi" && (
                                <>
                                    <div><label className="label">Network Name (SSID)</label><input type="text" className="input" onChange={e => setStaticData({ ...staticData, ssid: e.target.value })} /></div>
                                    <div><label className="label">Password</label><input type="text" className="input" onChange={e => setStaticData({ ...staticData, password: e.target.value })} /></div>
                                    <div>
                                        <label className="label">Encryption</label>
                                        <select className="input" onChange={e => setStaticData({ ...staticData, encryption: e.target.value })}>
                                            <option value="WPA">WPA/WPA2</option>
                                            <option value="WEP">WEP</option>
                                            <option value="nopass">None</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Simplified vCard */}
                            {staticType === "vcard" && (
                                <>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                        <div><label className="label">First Name</label><input type="text" className="input" onChange={e => setStaticData({ ...staticData, firstName: e.target.value })} /></div>
                                        <div><label className="label">Last Name</label><input type="text" className="input" onChange={e => setStaticData({ ...staticData, lastName: e.target.value })} /></div>
                                    </div>
                                    <div><label className="label">Phone</label><input type="tel" className="input" onChange={e => setStaticData({ ...staticData, phone: e.target.value })} /></div>
                                    <div><label className="label">Email</label><input type="email" className="input" onChange={e => setStaticData({ ...staticData, email: e.target.value })} /></div>
                                    <div><label className="label">Organization</label><input type="text" className="input" onChange={e => setStaticData({ ...staticData, org: e.target.value })} /></div>
                                    <div><label className="label">Website</label><input type="url" className="input" onChange={e => setStaticData({ ...staticData, website: e.target.value })} /></div>
                                </>
                            )}

                            {staticType === "email" && (
                                <>
                                    <div><label className="label">To Email</label><input type="email" required className="input" placeholder="someone@example.com" onChange={e => setStaticData({ ...staticData, to: e.target.value })} /></div>
                                    <div><label className="label">Subject</label><input type="text" className="input" placeholder="Inquiry..." onChange={e => setStaticData({ ...staticData, subject: e.target.value })} /></div>
                                    <div><label className="label">Body</label><textarea className="input" rows={4} placeholder="Hello..." onChange={e => setStaticData({ ...staticData, body: e.target.value })} /></div>
                                </>
                            )}

                            {staticType === "sms" && (
                                <>
                                    <div><label className="label">Phone Number</label><input type="tel" required className="input" placeholder="+1234567890" onChange={e => setStaticData({ ...staticData, phone: e.target.value })} /></div>
                                    <div><label className="label">Message</label><textarea className="input" rows={4} placeholder="I'm interested in..." onChange={e => setStaticData({ ...staticData, message: e.target.value })} /></div>
                                </>
                            )}

                            {staticType === "event" && (
                                <>
                                    <div><label className="label">Event Title</label><input type="text" required className="input" onChange={e => setStaticData({ ...staticData, title: e.target.value })} /></div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                        <div><label className="label">Start Time</label><input type="datetime-local" className="input" onChange={e => setStaticData({ ...staticData, start: e.target.value })} /></div>
                                        <div><label className="label">End Time</label><input type="datetime-local" className="input" onChange={e => setStaticData({ ...staticData, end: e.target.value })} /></div>
                                    </div>
                                    <div><label className="label">Location</label><input type="text" className="input" placeholder="123 Main St" onChange={e => setStaticData({ ...staticData, location: e.target.value })} /></div>
                                    <div><label className="label">Description</label><textarea className="input" rows={3} onChange={e => setStaticData({ ...staticData, description: e.target.value })} /></div>
                                </>
                            )}

                            {staticType === "geo" && (
                                <>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                        <div><label className="label">Latitude</label><input type="number" step="any" className="input" placeholder="37.7749" onChange={e => setStaticData({ ...staticData, lat: e.target.value })} /></div>
                                        <div><label className="label">Longitude</label><input type="number" step="any" className="input" placeholder="-122.4194" onChange={e => setStaticData({ ...staticData, lng: e.target.value })} /></div>
                                    </div>
                                    <p style={{ fontSize: "0.8rem", color: "var(--color-secondary)", marginTop: "0.5rem" }}>
                                        Tip: You can get these coordinates from Google Maps (right-click a location).
                                    </p>
                                </>
                            )}

                        </div>
                    </div>

                    {/* Right: Live Preview */}
                    <div style={{ background: "var(--color-bg)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--color-border)", textAlign: "center", position: "sticky", top: "2rem" }}>
                        <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Live Preview</h3>
                        <div id="static-qr-preview" style={{ background: "white", padding: "1rem", borderRadius: "0.5rem", display: "inline-block", marginBottom: "1rem" }}>
                            <QRCodeSVG value={getStaticPayload()} size={200} level="M" />
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--color-secondary)", marginBottom: "1rem", wordBreak: "break-all" }}>
                            {getStaticPayload().slice(0, 50)}...
                        </p>
                        <button onClick={downloadStatic} className="btn btn-primary" disabled={!getStaticPayload()} style={{ width: "100%", justifyContent: "center" }}>
                            <Download size={18} style={{ marginRight: "0.5rem" }} /> Download SVG
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
