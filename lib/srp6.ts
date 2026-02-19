import crypto from "crypto";

const g = 7n;
const N = 0x894b645e89e1535bbdad5b8b290650530801b18ebfbf5e8fab3c82872a3e9bb7n;

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;

  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp >> 1n;
    base = (base * base) % mod;
  }

  return result;
}

function bufferToBigInt(buf: Uint8Array): bigint {
  const reversed = Array.from(buf).reverse();
  const hex = reversed.map((b) => b.toString(16).padStart(2, "0")).join("");

  return BigInt("0x" + hex);
}

function bigIntToBuffer(value: bigint, length: number): Uint8Array {
  let hex = value.toString(16);

  if (hex.length % 2 !== 0) hex = "0" + hex;
  const bytes = [];

  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substring(i, i + 2), 16));
  }
  bytes.reverse();
  const result = new Uint8Array(length);

  result.set(bytes.slice(0, length));

  return result;
}

export function generateSalt(): Uint8Array {
  return new Uint8Array(crypto.randomBytes(32));
}

export function calculateVerifier(
  username: string,
  password: string,
  salt: Uint8Array,
): Uint8Array {
  const credentials = `${username.toUpperCase()}:${password.toUpperCase()}`;
  const innerHash = new Uint8Array(
    crypto.createHash("sha1").update(credentials).digest(),
  );

  const combined = new Uint8Array(salt.length + innerHash.length);

  combined.set(salt);
  combined.set(innerHash, salt.length);

  const outerHash = new Uint8Array(
    crypto.createHash("sha1").update(combined).digest(),
  );

  const x = bufferToBigInt(outerHash);
  const verifier = modPow(g, x, N);

  return bigIntToBuffer(verifier, 32);
}

export function verifyLogin(
  username: string,
  password: string,
  salt: Uint8Array,
  storedVerifier: Uint8Array,
): boolean {
  const computedVerifier = calculateVerifier(username, password, salt);

  return crypto.timingSafeEqual(computedVerifier, storedVerifier);
}
