import { NextResponse } from 'next/server';
import { getUsers, addUser, resetDbToSeed, getDb, saveDb } from '@/lib/db';

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

export async function PUT(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'reset') {
      resetDbToSeed();
      return NextResponse.json({ success: true, message: 'Base de datos restablecida correctamente' });
    }

    if (action === 'simulate_difficulties') {
      const db = getDb();
      // Agregar múltiples intentos fallidos para simular alumnos con problemas
      // Santiago: h2-5 (Propiedad distributiva) -> 6 intentos
      // Camila: h2-3 (Términos semejantes) -> 5 intentos
      // Sofía: h2-5 (Propiedad distributiva) -> 4 intentos
      
      const santiagoAtt = db.attempts.find(a => a.userId === 'santiago-123' && a.habilidadId === 'h2-5');
      if (santiagoAtt) {
        santiagoAtt.intentos = 6;
        santiagoAtt.passed = false;
      } else {
        db.attempts.push({
          id: 'att-santiago-dist-sim',
          userId: 'santiago-123',
          habilidadId: 'h2-5',
          retoId: 'reto-distributiva-1',
          passed: false,
          intentos: 6,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      const camilaAtt = db.attempts.find(a => a.userId === 'camila-123' && a.habilidadId === 'h2-3');
      if (camilaAtt) {
        camilaAtt.intentos = 5;
        camilaAtt.passed = false;
      } else {
        db.attempts.push({
          id: 'att-camila-semejantes-sim',
          userId: 'camila-123',
          habilidadId: 'h2-3',
          retoId: 'reto-semejantes-1',
          passed: false,
          intentos: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      saveDb(db);
      return NextResponse.json({ success: true, message: 'Dificultades simuladas con éxito' });
    }

    if (action === 'complete_unit2') {
      const db = getDb();
      const u2Habilidades = ['h2-3', 'h2-4', 'h2-5'];
      const now = new Date().toISOString();
      
      u2Habilidades.forEach(hId => {
        const pr = db.progressRecords.find(p => p.userId === 'val-123' && p.habilidadId === hId);
        if (pr) {
          pr.completa = true;
          pr.updatedAt = now;
        } else {
          db.progressRecords.push({
            id: `pr-val-${hId}-${Date.now()}`,
            userId: 'val-123',
            habilidadId: hId,
            completa: true,
            intentos: 1,
            createdAt: now,
            updatedAt: now
          });
        }
      });
      
      saveDb(db);
      return NextResponse.json({ success: true, message: 'Unidad 2 completada para Valentina' });
    }

    return NextResponse.json({ error: 'Acción de simulación no válida' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando simulación' }, { status: 500 });
  }
}
