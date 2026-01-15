import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, Image as ImageIcon, Copy, ExternalLink, ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ScanQR() {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"camera" | "file">("camera");
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraCount, setCameraCount] = useState(0);

    // Refs
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Check for cameras on mount
        Html5Qrcode.getCameras().then(devices => {
            setCameraCount(devices.length);
        }).catch(err => {
            console.warn("Error getting cameras", err);
        });

        if (cameraReady && !isScanning) {
            initializeScanner();
        }
    }, [cameraReady]);

    const initializeScanner = async () => {
        // Wait a tick for the div to mount
        await new Promise(r => setTimeout(r, 100));

        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        try {
            await scanner.start(
                { facingMode: facingMode }, // Use state
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    handleScanSuccess(decodedText);
                },
                () => { }
            );
            setIsScanning(true);
        } catch (err: any) {
            console.error("Camera start error:", err);
            setCameraReady(false);
            setError(err?.message || "Failed to start camera. Please ensure permissions are granted.");
            setIsScanning(false);
        }
    };

    const startCamera = () => {
        setError(null);
        setCameraReady(true);
    };

    const stopCamera = async () => {
        if (!scannerRef.current) return;

        try {
            // Check if scanner is running safely
            // Using internal state or try-catch
            await scannerRef.current.stop();
        } catch (err) {
            console.warn("Stop camera warning:", err);
        } finally {
            setIsScanning(false);
            setCameraReady(false); // Reset ready state
        }
    };

    const toggleCamera = async () => {
        if (isScanning) {
            await stopCamera();
            setTimeout(() => {
                setFacingMode(prev => prev === "environment" ? "user" : "environment");
                setCameraReady(true);
            }, 300);
        } else {
            setFacingMode(prev => prev === "environment" ? "user" : "environment");
        }
    };



    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        // For file scan we can use the main scanner since we stop camera first
        if (!scannerRef.current) return;

        try {
            // Ensure camera is stopped first
            if (isScanning) {
                await stopCamera();
            }

            const result = await scannerRef.current.scanFile(file, true);
            handleScanSuccess(result);
        } catch (err) {
            setError("Could not find a QR code in this image.");
        }
    };

    const handleScanSuccess = (decodedText: string) => {
        setScanResult(decodedText);
        // We stop the camera but do NOT clear the instance
        stopCamera();
    };

    const resetScan = () => {
        setScanResult(null);
        setError(null);
    };

    const isUrl = (text: string) => {
        try {
            new URL(text);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <div className="container" style={{ maxWidth: "600px", padding: "2rem 1rem" }}>
            <button
                onClick={() => navigate(-1)}
                style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-secondary)", marginBottom: "1.5rem", padding: 0, cursor: "pointer" }}
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", textAlign: "center" }}>Scan QR Code</h1>

            <div style={{ display: "flex", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "var(--radius)", padding: "0.25rem", marginBottom: "2rem" }}>
                <button
                    onClick={() => {
                        setActiveTab("camera");
                        setError(null);
                        setScanResult(null);
                        // Don't auto-stop, let user decide or existing state persist until they click stop
                    }}
                    style={{
                        flex: 1, padding: "0.75rem", borderRadius: "calc(var(--radius) - 2px)", border: "none",
                        background: activeTab === "camera" ? "var(--color-primary)" : "transparent",
                        color: activeTab === "camera" ? "var(--color-bg)" : "var(--color-text)",
                        fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer"
                    }}
                >
                    <Camera size={18} />
                    Camera
                </button>
                <button
                    onClick={() => {
                        setActiveTab("file");
                        stopCamera();
                        setError(null);
                        setScanResult(null);
                    }}
                    style={{
                        flex: 1, padding: "0.75rem", borderRadius: "calc(var(--radius) - 2px)", border: "none",
                        background: activeTab === "file" ? "var(--color-primary)" : "transparent",
                        color: activeTab === "file" ? "var(--color-bg)" : "var(--color-text)",
                        fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer"
                    }}
                >
                    <ImageIcon size={18} />
                    Upload Image
                </button>
            </div>

            <div style={{ background: "var(--color-bg)", borderRadius: "1rem", border: "1px solid var(--color-border)", overflow: "hidden", minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem", position: "relative" }}>

                {/* CRITICAL: Reader div must always exist in DOM to prevent html5-qrcode crash on cleanup */}
                <div
                    id="reader"
                    style={{
                        width: "100%",
                        margin: "0 auto",
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                        // Ensure it takes up space so only when we are scanning or about to scan
                        minHeight: (activeTab === "camera" && (isScanning || cameraReady) && !scanResult) ? "300px" : "0",
                        display: (activeTab === "camera" && (isScanning || cameraReady) && !scanResult) ? "block" : "none",
                        background: "#000" // Black background to see if container is there
                    }}
                ></div>

                {/* Result View */}
                {scanResult ? (
                    <div style={{ width: "100%", textAlign: "center", zIndex: 10, background: "var(--color-bg)", marginTop: "1rem" }}>
                        <div style={{ display: "inline-flex", padding: "1rem", background: "#f0fdf4", borderRadius: "50%", color: "#16a34a", marginBottom: "1rem" }}>
                            <Camera size={32} />
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>QR Detected!</h3>

                        <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem", wordBreak: "break-all", fontFamily: "monospace", border: "1px solid var(--color-border)" }}>
                            {scanResult}
                        </div>

                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                            <button
                                onClick={() => { navigator.clipboard.writeText(scanResult); alert("Copied!"); }}
                                className="btn btn-outline"
                                style={{ gap: "0.5rem" }}
                            >
                                <Copy size={18} /> Copy
                            </button>
                            {isUrl(scanResult) && (
                                <a
                                    href={scanResult}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ gap: "0.5rem" }}
                                >
                                    <ExternalLink size={18} /> Open Link
                                </a>
                            )}
                        </div>
                        <button onClick={resetScan} style={{ marginTop: "1rem", background: "none", border: "none", color: "var(--color-secondary)", textDecoration: "underline", cursor: "pointer" }}>Scan Another</button>
                    </div>
                ) : (
                    <>
                        {/* Camera UI State Overlay */}
                        {activeTab === "camera" && !isScanning && (
                            <div style={{ textAlign: "center", padding: "2rem" }}>
                                <div style={{ marginBottom: "1rem", color: "var(--color-secondary)" }}>
                                    <Camera size={48} style={{ opacity: 0.5 }} />
                                </div>
                                <p style={{ marginBottom: "1.5rem" }}>Camera permission is required to scan QR codes.</p>
                                <button onClick={startCamera} className="btn btn-primary">Start Camera</button>
                            </div>
                        )}

                        {activeTab === "camera" && isScanning && (
                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", zIndex: 5, justifyContent: "center", flexWrap: "wrap" }}>
                                <button onClick={stopCamera} className="btn btn-outline" style={{ background: "rgba(255,255,255,0.8)", gap: "0.5rem" }}>
                                    <XCircle size={18} /> Stop Camera
                                </button>
                                {cameraCount > 1 && (
                                    <button onClick={toggleCamera} className="btn btn-outline" style={{ background: "rgba(255,255,255,0.8)", gap: "0.5rem" }}>
                                        <RefreshCw size={18} /> Flip Camera
                                    </button>
                                )}
                            </div>
                        )}


                        {/* File Upload View */}
                        {activeTab === "file" && (
                            <div style={{ textAlign: "center", padding: "2rem" }}>
                                <div style={{ marginBottom: "1rem", color: "var(--color-secondary)" }}>
                                    <ImageIcon size={48} style={{ opacity: 0.5 }} />
                                </div>
                                <p style={{ marginBottom: "1.5rem" }}>Select an image from your device containing a QR code.</p>
                                <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary">Choose Image</button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleFileUpload}
                                />
                            </div>
                        )}

                        {error && (
                            <div style={{ marginTop: "1rem", color: "var(--color-error)", textAlign: "center", padding: "0 1rem" }}>
                                {error}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
