const SPRING_BOOT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export async function trySpring(path: string, payload: unknown, method = 'POST') {
  try {
    const token = process.env.NEXT_PUBLIC_API_BEARER_TOKEN;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const springRes = await fetch(`${SPRING_BOOT_BASE_URL}${path}`, {
      method,
      headers,
      body: JSON.stringify(payload),
    });
    const springText = await springRes.text();
    let springJson: unknown = null;
    try {
      springJson = springText ? JSON.parse(springText) : null;
    } catch {
      springJson = { raw: springText };
    }
    return { ok: springRes.ok, status: springRes.status, data: springJson };
  } catch (err: any) {
    return { ok: false, status: 502, data: { error: err.message } };
  }
}
