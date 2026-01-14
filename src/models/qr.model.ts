/**
 * QRLink represents a single permanent QR code in Qryft.
 *
 * The QR image is derived from `slug` and never changes.
 * Only the destination and status may change over time.
 */
export interface QRLink {
  /** Internal unique identifier */
  id: string;

  /** Public slug encoded into the QR code */
  slug: string;

  /** Human-readable name for management/UI */
  name: string;

  /** Current destination URL */
  destinationUrl: string;

  /** Whether the QR is active and should redirect */
  isActive: boolean;

  /** Creation timestamp (ISO 8601) */
  createdAt: string;

  /** Last update timestamp (ISO 8601) */
  updatedAt: string;
}

/**
 * Minimal scan statistics used in v1 dashboards.
 * This is intentionally coarse and privacy-respecting.
 */
export interface QRStats {
  totalScans: number;
  lastScanAt: string | null;

  deviceBreakdown: {
    mobile: number;
    desktop: number;
    unknown: number;
  };
}
