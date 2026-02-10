import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// Get encryption key from environment (must be 32 bytes / 256 bits)
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }
  // If key is hex string (64 chars), convert to buffer
  if (key.length === 64) {
    return Buffer.from(key, "hex");
  }
  // If key is base64 (44 chars), convert to buffer
  if (key.length === 44) {
    return Buffer.from(key, "base64");
  }
  // Otherwise use as-is (32 chars)
  return Buffer.from(key.padEnd(32, "0").slice(0, 32));
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypt sensitive data (like OAuth tokens)
 */
export function encrypt(plaintext: string): EncryptedData {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedData: EncryptedData): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(encryptedData.iv, "base64");
  const authTag = Buffer.from(encryptedData.authTag, "base64");
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData.encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

/**
 * Encrypt an object (like tokens object)
 */
export function encryptObject<T extends object>(obj: T): EncryptedData {
  return encrypt(JSON.stringify(obj));
}

/**
 * Decrypt to an object
 */
export function decryptObject<T extends object>(encryptedData: EncryptedData): T {
  const decrypted = decrypt(encryptedData);
  return JSON.parse(decrypted) as T;
}

/**
 * Generate a secure random API key
 */
export function generateApiKey(): { key: string; hash: string; prefix: string; last4: string } {
  const prefix = "v9cf_";
  const randomPart = crypto.randomBytes(32).toString("base64url");
  const key = `${prefix}${randomPart}`;
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  const last4 = randomPart.slice(-4);
  
  return { key, hash, prefix, last4 };
}

/**
 * Hash an API key for lookup
 */
export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

/**
 * Generate encryption key (run once, save to env)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex");
}
