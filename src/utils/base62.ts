import { randomBytes } from "crypto";

const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
// 62 chars. To avoid modulo bias: 256 / 62 = 4 → max usable byte = 4*62-1 = 247
const MAX_BYTE = 247;

export function generateCode(length = 6): string {
  let result = "";
  while (result.length < length) {
    const bytes = randomBytes(length * 2);
    for (const byte of bytes) {
      if (result.length >= length) break;
      if (byte <= MAX_BYTE) {
        result += chars[byte % chars.length];
      }
    }
  }
  return result;
}
