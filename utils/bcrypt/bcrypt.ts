import bcrypt from 'bcryptjs';

/**
 * Hashes a plain text password.
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

/**
 * Verifies a plain text password against a hashed password.
 * @param password - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns True if the passwords match, false otherwise.
 */
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

const bcryptUtil = {
  hash: hashPassword,
  verify: verifyPassword,
};

export default bcryptUtil;
