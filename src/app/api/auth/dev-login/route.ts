import { NextResponse } from 'next/server';
import { getUsers, addUser } from '@/lib/db';

export async function GET() {
  try {
    const users = getUsers();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo usuarios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, name, role } = body;

    let user;
    if (userId) {
      const users = getUsers();
      user = users.find(u => u.id === userId);
    } else if (email && name && role) {
      user = addUser(email, name, role);
    }

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, user });
    
    // Configurar cookie de sesión simple
    response.cookies.set('eureka_session', user.id, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 semana
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
