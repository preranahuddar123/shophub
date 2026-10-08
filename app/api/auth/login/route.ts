import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth/server';
import { redirectForRole, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const { session, token } = await authenticateUser(email, password);
    const response = NextResponse.json({
      success: true,
      user: session,
      redirect: redirectForRole(session.role),
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unable to sign in.' },
      { status: 401 }
    );
  }
}
