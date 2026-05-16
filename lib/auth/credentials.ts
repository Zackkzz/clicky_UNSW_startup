/** Student zID: z + 7 digits → @student.unsw.edu.au */
const ZID_STUDENT_PATTERN = /^z\d{7}$/i;
/** Staff zID: z + 6 digits → @ad.unsw.edu.au */
const ZID_STAFF_PATTERN = /^z\d{6}$/i;

/**
 * Maps the login "account number" field to a Supabase Auth email.
 * Accepts full email, student zID (z + 7 digits), or staff zID (z + 6 digits).
 */
export function accountToEmail(account: string): string {
  const raw = account.trim().toLowerCase();

  if (raw.includes('@')) {
    return raw;
  }

  const compact = raw.replace(/\s/g, '');
  const withZ = compact.startsWith('z') ? compact : `z${compact}`;

  if (ZID_STUDENT_PATTERN.test(withZ)) {
    return `${withZ}@student.unsw.edu.au`;
  }

  if (ZID_STAFF_PATTERN.test(withZ)) {
    return `${withZ}@ad.unsw.edu.au`;
  }

  throw new Error(
    'Enter your UNSW zID (e.g. z1234567 or z123456) or a full email address.',
  );
}

/** Validates login/sign-up fields in order: account number, then password. */
export function validateLoginFields(account: string, password: string): void {
  if (!account.trim()) {
    throw new Error('Account number is required.');
  }
  if (!password.trim()) {
    throw new Error('Password is required.');
  }
}

export function validatePassword(password: string): void {
  if (!password.trim()) {
    throw new Error('Password is required.');
  }
}
