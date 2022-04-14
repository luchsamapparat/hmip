import { webcrypto as crypto } from 'node:crypto';

declare module 'crypto' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace webcrypto {
    const subtle: SubtleCrypto;
  }
}

export async function sha512(string: string) {
  const encodedString = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(string));
  return Array.prototype.map.call(
    new Uint8Array(encodedString),
    x => `00${x.toString(16)}`.slice(-2)
  )
    .join('');
}
