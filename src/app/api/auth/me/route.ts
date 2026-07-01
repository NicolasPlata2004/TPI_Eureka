import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('eureka_session')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = getUserById(sessionId);
    if (!user) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
