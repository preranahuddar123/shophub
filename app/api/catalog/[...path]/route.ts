import { NextRequest, NextResponse } from 'next/server';
import { trySpring, trySpringGet } from '@/lib/api/spring';

function springPath(path: string[]) {
  return `/${path.join('/')}`;
}

function isAllowed(path: string) {
  return path.startsWith('/categories/') || path.startsWith('/secondary-categories/');
}

async function forward(request: NextRequest, path: string[], method: string) {
  const joined = springPath(path);
  if (!isAllowed(joined)) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  if (method === 'GET') {
    const result = await trySpringGet(joined);
    return NextResponse.json(result.data ?? null, { status: result.status });
  }

  const payload = method === 'DELETE' ? undefined : await request.json().catch(() => ({}));
  const result = await trySpring(joined, payload, method);
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
