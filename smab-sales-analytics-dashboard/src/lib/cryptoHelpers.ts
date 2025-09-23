

const ALGO = "AES-GCM";
const IV_LENGTH = 12;
const KEY_LENGTH = 256; // Use 256-bit key for better security

async function getKey(secret: string) {
  const enc = new TextEncoder();
  
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("jwt-encryption-salt"), // Fixed salt
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGO, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptJWT(jwt: string, secret: string) {
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const encodedJWT = new TextEncoder().encode(jwt);
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ALGO, iv },
    key,
    encodedJWT
  );

  // Combine IV + ciphertext into one base64 string
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptJWT(encryptedJWT: string, secret: string) {
  const combined = Uint8Array.from(atob(encryptedJWT), c => c.charCodeAt(0));
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);

  const key = await getKey(secret);
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: ALGO, iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decryptedBuffer);
}
