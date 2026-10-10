import { NextRequest, NextResponse } from 'next/server';
import {
  SPRING_TOKEN_COOKIE,
  getServiceSpringToken,
  loginSpring,
  trySpring,
  trySpringGet,
} from '@/lib/api/spring';

function springPath(path: string[]) {
  return `/${path.join('/')}`;
}

function isAllowed(path: string) {
  return path.startsWith('/categories/') || path.startsWith('/secondary-categories/');
}

async function springTokenFrom(request: NextRequest) {
  const fromCookie = request.cookies.get(SPRING_TOKEN_COOKIE)?.value;
  if (fromCookie) return fromCookie;
  return getServiceSpringToken();
}

function deniedMessage(method: string) {
  if (method === 'GET') return 'Unable to load catalog data.';
  return 'Catalog create was denied (403). The backend Bearer token is expired. Sign out and sign in with the same email/password the catalog API uses, or set SPRING_AUTH_USERNAME and SPRING_AUTH_PASSWORD in .env.local.';
}

async function forward(request: NextRequest, path: string[], method: string) {
  const joined = springPath(path);
  if (!isAllowed(joined)) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  let token = await springTokenFrom(request);

  if (method === 'GET') {
    const result = await trySpringGet(joined, token);
    return NextResponse.json(result.data ?? null, { status: result.status });
  }

  const payload = method === 'DELETE' ? undefined : await request.json().catch(() => ({}));
  let result = await trySpring(joined, payload, method, token);
  if (result.status === 403) {
    const user = process.env.SPRING_AUTH_USERNAME || process.env.SPRING_AUTH_EMAIL;
    const pass = process.env.SPRING_AUTH_PASSWORD;
    if (user && pass) {
      const refreshed = await loginSpring(user, pass);
      if (refreshed) {
        token = refreshed;
        result = await trySpring(joined, payload, method, token);
      }
    }
  }
  if (result.status === 403) {
    return NextResponse.json(
      { message: deniedMessage(method), status: 403 },
      { status: 403 }
    );
  }
  return NextResponse.json(result.data ?? null, { status: result.status });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path, 'GET');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path, 'POST');
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path, 'PUT');
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path, 'DELETE');
}
