import { QRLink } from "../models/qr.model";

const STORAGE_KEY = "qryft.qr_links.v1";

/**
 * Load all stored QR links.
 * Returns an empty array if none exist.
 */
function loadAll(): QRLink[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QRLink[];
  } catch {
    return [];
  }
}

/**
 * Persist the full QR link list.
 * This is the single write path.
 */
function saveAll(links: QRLink[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

/**
 * Return all QR links.
 */
export function listQRLinks(): QRLink[] {
  return loadAll();
}

/**
 * Create and store a new QR link.
 */
export function createQRLink(input: {
  id: string;
  slug: string;
  name: string;
  destinationUrl: string;
}): QRLink {
  const now = new Date().toISOString();

  const link: QRLink = {
    id: input.id,
    slug: input.slug,
    name: input.name,
    destinationUrl: input.destinationUrl,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const links = loadAll();
  links.push(link);
  saveAll(links);

  return link;
}

/**
 * Update an existing QR link.
 * Only mutable fields may be changed.
 */
export function updateQRLink(
  id: string,
  updates: Partial<Pick<QRLink, "name" | "destinationUrl" | "isActive">>
): QRLink | null {
  const links = loadAll();
  const index = links.findIndex((l) => l.id === id);

  if (index === -1) return null;

  const existing = links[index];
  const updated: QRLink = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  links[index] = updated;
  saveAll(links);

  return updated;
}

/**
 * Remove a QR link permanently.
 * Use sparingly; prefer disable instead.
 */
export function deleteQRLink(id: string): boolean {
  const links = loadAll();
  const next = links.filter((l) => l.id !== id);

  if (next.length === links.length) return false;

  saveAll(next);
  return true;
}
