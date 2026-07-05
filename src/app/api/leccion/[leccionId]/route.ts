import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getLeccionById, getRetosByLeccionId, getDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leccionId: string }> }
) {
  try {
    const { leccionId } = await params;
    const leccion = getLeccionById(leccionId);

    if (!leccion) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 });
    }

    const retos = getRetosByLeccionId(leccionId);
    let nextRetoId = retos.length > 0 ? retos[0].id : null;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('eureka_session')?.value;
    
    if (sessionId) {
      const db = getDb();
      const completedRetos = new Set(
        db.attempts
          .filter((a) => a.userId === sessionId && a.passed)
          .map((a) => a.retoId)
      );
      const uncompletedReto = retos.find(r => !completedRetos.has(r.id));
      if (uncompletedReto) {
        nextRetoId = uncompletedReto.id;
      }
    }

    return NextResponse.json({
      leccion,
      retos,
      nextRetoId
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
