/**
 * Generates the full absolute URL for a given path, handling the base path.
 * This is critical for GitHub Pages where the app operates in a subdirectory.
 * 
 * Example:
 * path = "/q/abc"
 * Base = "/q-ryft/"
 * Origin = "https://site.io"
 * Result = "https://site.io/q-ryft/q/abc"
 */
export function getAppUrl(path: string): string {
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Base URL from Vite (e.g., "/" or "/q-ryft/")
    const base = import.meta.env.BASE_URL;

    // Remove trailing slash from base if present to avoid double slashes 
    // ONLY if path also starts with slash. 
    // But standard is base ends with slash, path starts with slash. 
    // Let's use a robust join.

    const origin = window.location.origin;

    // Clean base: remove trailing slash
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;

    return `${origin}${cleanBase}${cleanPath}`;
}
