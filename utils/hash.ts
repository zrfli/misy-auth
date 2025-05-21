import sha256 from 'crypto-js/sha256';

export function hashPassword(password: string) {
  const hashedPassword = sha256(password).toString();

  return hashedPassword;
}

export function verifyPassword(inputPassword: string, storedHash: string): boolean {
  const hashedInput = hashPassword(inputPassword);
  
  return hashedInput === storedHash;
}