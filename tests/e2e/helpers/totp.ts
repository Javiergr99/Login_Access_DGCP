/// <reference types="node" />

import { createHmac } from "node:crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function decodeBase32(rawSecret: string): Buffer {
  const secret = rawSecret.toUpperCase().replace(/[\s=]/g, "");

  if (!secret) {
    throw new Error("E2E_TOTP_SECRET está vacío.");
  }

  let buffer = 0;
  let bits = 0;
  const bytes: number[] = [];

  for (const character of secret) {
    const value = BASE32_ALPHABET.indexOf(character);

    if (value < 0) {
      throw new Error("E2E_TOTP_SECRET no es Base32 válido.");
    }

    buffer = (buffer << 5) | value;
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
      buffer &= (1 << bits) - 1;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Lee un byte del digest de forma segura.
 *
 * Con `noUncheckedIndexedAccess`, TypeScript modela cualquier acceso por
 * índice como potencialmente indefinido. La validación explícita conserva el
 * tipado estricto sin recurrir a aserciones `!`.
 */
function readByte(source: Buffer, index: number): number {
  const value = source[index];

  if (value === undefined) {
    throw new Error("No fue posible generar el código TOTP: digest incompleto.");
  }

  return value;
}

export function generateTotp(secret: string, now = Date.now()): string {
  const counter = BigInt(Math.floor(now / 1_000 / 30));
  const counterBuffer = Buffer.alloc(8);

  counterBuffer.writeBigUInt64BE(counter);

  const digest = createHmac("sha1", decodeBase32(secret)).update(counterBuffer).digest();

  const offset = readByte(digest, digest.length - 1) & 0x0f;

  const binary =
    ((readByte(digest, offset) & 0x7f) << 24) |
    ((readByte(digest, offset + 1) & 0xff) << 16) |
    ((readByte(digest, offset + 2) & 0xff) << 8) |
    (readByte(digest, offset + 3) & 0xff);

  return String(binary % 1_000_000).padStart(6, "0");
}
