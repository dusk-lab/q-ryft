import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";

export default function Landing() {
    return (
        <div className="container" style={{ maxWidth: "800px", textAlign: "center", padding: "4rem 1rem" }}>
            <div style={{ marginBottom: "3rem" }}>
                <h1 style={{ fontSize: "3rem", fontWeight: "800", letterSpacing: "-0.05em", lineHeight: "1.1", marginBottom: "1.5rem" }}>
                    QR, done differently.
                </h1>
                <p style={{ fontSize: "1.25rem", color: "var(--color-secondary)", marginBottom: "2rem", maxWidth: "600px", marginInline: "auto" }}>
                    Permanent QR codes with dynamic destinations. No tracking pixels, no broken links, no gimmicks.
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                    <Link to="/create" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem", fontSize: "1.1rem" }}>
                        Create a QR
                        <ArrowRight size={16} style={{ marginLeft: "0.5rem" }} />
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline" style={{ padding: "0.75rem 1.5rem", fontSize: "1.1rem" }}>
                        My QRs
                    </Link>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginTop: "4rem", textAlign: "left" }}>
                <Feature
                    icon={<Zap />}
                    title="Dynamic Routing"
                    desc="Change where your QR points to instantly. The image never changes."
                />
                <Feature
                    icon={<ShieldCheck />}
                    title="Privacy First"
                    desc="We count scans, but we don't track users. No cookies, no fingerprints."
                />
                <Feature
                    icon={<Lock />}
                    title="Permanent"
                    desc="Built on infrastructure that is designed to last. Your links are safe."
                />
            </div>
        </div>
    );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius)" }}>
            <div style={{ marginBottom: "1rem", color: "var(--color-primary)" }}>{icon}</div>
            <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{title}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-secondary)", lineHeight: "1.6" }}>{desc}</p>
        </div>
    );
}
