import { NextRequest, NextResponse } from 'next/server';
import {
  SPRING_TOKEN_COOKIE,
  getServiceSpringToken,
  jwtUnexpired,
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
  if (jwtUnexpired(fromCookie)) return fromCookie;
  return getServiceSpringToken();
}

function deniedMessage(method: string) {
  if (method === 'GET') return 'Unable to load catalog data.';
  return 'The catalog API denied this write. Sign out and sign in again so a fresh backend token can be issued.';
}

async function forward(request: NextRequest, path: string[], method: string) {
  const joined = springPath(path);
  if (!isAllowed(joined)) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const token = await springTokenFrom(request);

  if (method === 'GET') {
    const result = await trySpringGet(joined, token);
    return NextResponse.json(result.data ?? null, { status: result.status });
  }

  const payload = method === 'DELETE' ? undefined : await request.json().catch(() => ({}));
  const result = await trySpring(joined, payload, method, token);
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
