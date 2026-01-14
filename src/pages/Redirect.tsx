import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getQRLinkBySlug } from "../services/storage.service";

export default function Redirect() {
    const { slug } = useParams<{ slug: string }>();
    const [status, setStatus] = useState<"resolving" | "not-found" | "inactive">("resolving");

    useEffect(() => {
        if (!slug) {
            setStatus("not-found");
            return;
        }

        const qr = getQRLinkBySlug(slug);

        if (!qr) {
            setStatus("not-found");
            return;
        }

        if (!qr.isActive) {
            setStatus("inactive");
            return;
        }

        // Perform the Redirect
        // Use replace to avoid history loops
        window.location.replace(qr.destinationUrl);

    }, [slug]);

    if (status === "resolving") {
        // Minimal loading state
        return null;
    }

    if (status === "not-found") {
        return (
            <div className="container" style={{ textAlign: "center", padding: "4rem 1rem", maxWidth: "600px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>QR Code Not Found</h1>
                <p style={{ color: "var(--color-secondary)", marginBottom: "2rem" }}>
                    The QR code you scanned does not exist or has been deleted.
                </p>
                <Link to="/" className="btn btn-primary">Go to Qryft Home</Link>
            </div>
        );
    }

    if (status === "inactive") {
        return (
            <div className="container" style={{ textAlign: "center", padding: "4rem 1rem", maxWidth: "600px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>Link Disabled</h1>
                <p style={{ color: "var(--color-secondary)", marginBottom: "2rem" }}>
                    This QR code has been temporarily disabled by its owner.
                </p>
                <Link to="/" className="btn btn-primary">Create your own QR</Link>
            </div>
        );
    }

    return null;
}
