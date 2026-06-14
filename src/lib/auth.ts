const SESSION_COOKIE = 'uzine_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export async function createSession(kv: KVNamespace): Promise<string> {
  const sessionId = crypto.randomUUID();
  await kv.put(`session:${sessionId}`, '1', { expirationTtl: SESSION_TTL_SECONDS });
  return sessionId;
}

export async function validateSession(
  kv: KVNamespace,
  sessionId: string | undefined,
): Promise<boolean> {
  if (!sessionId) return false;
  const value = await kv.get(`session:${sessionId}`);
  return value === '1';
}

export async function destroySession(
  kv: KVNamespace,
  sessionId: string,
): Promise<void> {
  await kv.delete(`session:${sessionId}`);
}

export function verifyPassword(input: string, expected: string): boolean {
  if (!expected || !input) return false;
  // Constant-time compare would be ideal; sufficient for single-admin MVP
  return input === expected;
}
