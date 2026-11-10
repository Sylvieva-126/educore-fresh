/**
 * Front-end validators shared by the admin forms.
 *
 * Why they exist: React Native TextInputs never run the browser's
 * "default" validation (that is an HTML5 form feature — keyboardType only
 * changes which keys the phone shows), so every rule the backend enforces
 * needs a matching front-end check to give the office a friendly inline
 * error instead of a failed save. The backend re-checks everything.
 *
 * Phone rules match Nigerian usage: +234 803 111 2233, 08031112233,
 * or 234 803 111 2233 — but any 7–15 digit number is accepted.
 */

/** Collapse runs of spaces and trim — the shape every stored text takes. */
export function cleanText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

/** Drop spaces, dashes, dots and brackets; keep digits and one leading +. */
export function normalizePhone(value) {
  const text = String(value ?? '').trim();
  const hadPlus = text.startsWith('+');
  const digits = text.replace(/[^\d]/g, '');
  return (hadPlus ? '+' : '') + digits;
}

export function isValidPhone(value) {
  const phone = normalizePhone(value);
  if (!/^\+?\d+$/.test(phone)) return false;
  const digits = phone.replace(/\+/g, '');
  if (digits.length < 7 || digits.length > 15) return false; // E.164 window
  if (digits.startsWith('234')) return digits.length === 13; // +234 + 10 digits
  if (digits.startsWith('0')) return digits.length === 11; // local 11 digits
  return true; // other country codes accepted as typed
}

/** Trim + lowercase — emails are stored lowercase everywhere. */
export function normalizeEmail(value) {
  return cleanText(value).toLowerCase();
}

export function isValidEmail(value) {
  const email = normalizeEmail(value);
  if (!email) return false;
  // one @, no spaces, and a dot with at least two letters after it
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Trim — dates are already validated to YYYY-MM-DD before this. */
export function normalizeDateOfBirth(value) {
  return cleanText(value);
}

export function isValidDateOfBirth(value) {
  const text = cleanText(value);
  if (!text) return true; // the field is optional
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  // Reject 2026-02-31 and friends: real dates only.
  const date = new Date(Date.UTC(year, month - 1, day));
  const isReal =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  if (!isReal) return false;
  if (year < 1900) return false;
  return date.getTime() <= Date.now(); // no future births
}

/** The classes this school actually runs (mirrors the AD03 dropdown). */
export const CLASS_LABELS = ['JSS1 A', 'JSS1 B', 'JSS2 A', 'JSS3 A', 'SSS1 A', 'SSS2 A', 'SSS3 A'];

/** "jss3 a" / "JSS 3A" / "jss3a" → "JSS3 A"; anything else comes back trimmed. */
export function normalizeClassLabel(value) {
  const squashed = String(value ?? '').trim().toUpperCase().replace(/\s+/g, '');
  const match = /^(JSS|SSS)(\d)([A-Z])$/.exec(squashed);
  return match ? `${match[1]}${match[2]} ${match[3]}` : String(value ?? '').trim();
}

export function isValidClassLabel(value) {
  return CLASS_LABELS.includes(normalizeClassLabel(value));
}
