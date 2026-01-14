/**
 * Generates a public slug for Qryft QR links.
 *
 * Design goals:
 * - Short enough for QR readability
 * - High enough entropy to avoid collisions
 * - URL-safe
 * - Backend-friendly
 *
 * Format:
 * - Base62
 * - Fixed length
 */
const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const SLUG_LENGTH = 6;

/**
 * Generate a random slug.
 */
export function generateSlug(): string {
  let result = "";
  const crypto = window.crypto || (window as any).msCrypto;

  if (!crypto || !crypto.getRandomValues) {
    // Fallback (very unlikely in modern browsers)
    for (let i = 0; i < SLUG_LENGTH; i++) {
      result += ALPHABET.charAt(
        Math.floor(Math.random() * ALPHABET.length)
      );
    }
    return result;
  }

  const values = new Uint8Array(SLUG_LENGTH);
  crypto.getRandomValues(values);

  for (let i = 0; i < SLUG_LENGTH; i++) {
    result += ALPHABET.charAt(values[i] % ALPHABET.length);
  }

  return result;
}
