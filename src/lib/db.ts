import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  avatar: string;
  racha?: number;
  rachaLastUpdated?: string;
}

export interface Habilidad {
  id: string;
  nombre: string;
  completa: boolean;
  activa?: boolean;
  leccionId?: string;
}

export interface Unit {
  id: string;
  nombre: string;
  estado: 'completa' | 'en-progreso' | 'iniciada' | 'bloqueada';
  progreso: number;
  habilidades: Habilidad[];
}

export interface Leccion {
  id: string;
  titulo: string;
  unidadId: string;
  videoUrl: string;
  duracion: string;
  ideasClave: string[];
  concepto: string;
  conceptoDetalle: string;
}

export interface RetoOpcion {
  id: string;
  texto: string;
  ok: boolean;
  reflexion?: string;
}

export interface Reto {
  id: string;
  tipo: 'balanza' | 'multiple-choice';
  pregunta: string;
  ecuacionOriginal?: string;
  platilloIzquierdo?: {
    terminos: string[];
    mostrarTres: boolean;
  };
  platilloDerecho?: {
    valor: number;
  };
  opciones: RetoOpcion[];
  pista?: string;
}

export interface ProgressRecord {
  id: string;
  userId: string;
  habilidadId: string;
  completa: boolean;
  intentos: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attempt {
  id: string;
  userId: string;
  habilidadId: string;
  retoId: string;
  passed: boolean;
  intentos: number;
  createdAt: string;
  updatedAt: string;
}

export interface Logro {
  id: string;
  userId: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
  unlockedAt: string;
}

export interface DocenteAnalytics {
  masteryAverage: number;
  masteryDiff: number;
  activeCount: number;
  activeDiff: number;
  challengesCompleted: number;
  supportNeededCount: number;
  dificultades: {
    tema: string;
    intentosMasDeDos: number;
    color: 'amber' | 'blue' | 'green';
  }[];
  unidadesAvance: {
    nombre: string;
    dominio: number;
    tendencia: string;
  }[];
  estudiantesApoyo: {
    name: string;
    habilidad: string;
    intentos: number;
  }[];
  estudiantesAvance: {
    id: string;
    nombre: string;
    email: string;
    progresoU1: string;
    progresoU2: string;
    progresoU3: string;
    racha: number;
  }[];
}

export interface DatabaseSchema {
  users: User[];
  units: Unit[];
  lecciones: Record<string, Leccion>;
  retos: Record<string, Reto[]>;
  progressRecords: ProgressRecord[];
  attempts: Attempt[];
  logros: Logro[];
  docenteAnalytics: DocenteAnalytics;
}

// Asegurar que la base de datos se lee de forma segura
export function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Si por alguna razón no existe, devolver estructura vacía
      return {
        users: [],
        units: [],
        lecciones: {},
        retos: {},
        progressRecords: [],
        attempts: [],
        logros: [],
        docenteAnalytics: {
          masteryAverage: 0,
          masteryDiff: 0,
          activeCount: 0,
          activeDiff: 0,
          challengesCompleted: 0,
          supportNeededCount: 0,
          dificultades: [],
          unidadesAvance: [],
          estudiantesApoyo: [],
          estudiantesAvance: []
        }
      };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (error) {
    console.error('Error leyendo la base de datos:', error);
    throw error;
  }
}

export function saveDb(db: DatabaseSchema): void {
  try {
    // Asegurar que el directorio contenedor exista
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error guardando la base de datos:', error);
    throw error;
  }
}

// Helpers
export function getUsers(): User[] {
  return getDb().users;
}

export function getUserById(id: string): User | undefined {
  return getDb().users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function addUser(email: string, name: string, role: 'student' | 'teacher'): User {
  const db = getDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  const newUser: User = {
    id: `${role === 'student' ? 'val' : 'tea'}-${Date.now()}`,
    email: email.toLowerCase(),
    name,
    role,
    avatar: role === 'student' ? 'avatar_val.png' : 'teacher_carlos.png',
    ...(role === 'student' ? { racha: 0, rachaLastUpdated: new Date().toISOString() } : {})
  };

  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export function getUnitsForUser(userId: string): Unit[] {
  const db = getDb();
  // El progreso real del usuario se calcula a partir de sus progressRecords
  const userProgress = db.progressRecords.filter((pr) => pr.userId === userId);

  return db.units.map((unit) => {
    // Para enteros y racionales (u1)
    if (unit.id === 'u1') {
      const habilidades = unit.habilidades.map(h => ({ ...h, completa: true }));
      return { ...unit, estado: 'completa', progreso: 100, habilidades };
    }
    
    // Para las otras unidades, mapeamos el estado real del usuario
    let completas = 0;
    const habilidades = unit.habilidades.map((hab) => {
      const record = userProgress.find((pr) => pr.habilidadId === hab.id && pr.completa);
      if (record) completas++;
      return {
        ...hab,
        completa: !!record
      };
    });

    const percent = Math.round((completas / habilidades.length) * 100);
    let estado: Unit['estado'] = 'bloqueada';

    // Lógica para desbloquear
    if (unit.id === 'u2') {
      estado = percent === 100 ? 'completa' : 'en-progreso';
    } else if (unit.id === 'u3') {
      // Se desbloquea si la Unidad 2 está iniciada o avanzada
      estado = percent === 100 ? 'completa' : (percent > 0 ? 'en-progreso' : 'iniciada');
    } else if (unit.id === 'u4') {
      // Bloqueada hasta avanzar en ecuaciones
      const u3Prog = userProgress.filter(pr => pr.habilidadId.startsWith('h3-') && pr.completa).length;
      estado = u3Prog >= 2 ? 'iniciada' : 'bloqueada';
    }

    return {
      ...unit,
      progreso: percent,
      estado,
      habilidades
    };
  });
}

export function getLeccionById(id: string): Leccion | undefined {
  return getDb().lecciones[id];
}

export function getRetosByLeccionId(leccionId: string): Reto[] {
  return getDb().retos[leccionId] || [];
}

export function getRetoById(id: string): Reto | undefined {
  const db = getDb();
  for (const list of Object.values(db.retos)) {
    const found = list.find((r) => r.id === id);
    if (found) return found;
  }
  return undefined;
}

export function submitRetoAttempt(
  userId: string,
  retoId: string,
  habilidadId: string,
  passed: boolean
) {
  const db = getDb();
  const now = new Date().toISOString();
  
  // Buscar intento existente de este reto
  let attempt = db.attempts.find((a) => a.userId === userId && a.retoId === retoId);
  
  if (attempt) {
    attempt.intentos += 1;
    attempt.passed = passed;
    attempt.updatedAt = now;
  } else {
    attempt = {
      id: `att-${Date.now()}`,
      userId,
      habilidadId,
      retoId,
      passed,
      intentos: 1,
      createdAt: now,
      updatedAt: now
    };
    db.attempts.push(attempt);
  }

  // Si pasó, actualizar el progreso de la habilidad
  if (passed) {
    let progress = db.progressRecords.find(
      (pr) => pr.userId === userId && pr.habilidadId === habilidadId
    );
    
    if (progress) {
      progress.completa = true;
      progress.intentos = attempt.intentos;
      progress.updatedAt = now;
    } else {
      progress = {
        id: `pr-${Date.now()}`,
        userId,
        habilidadId,
        completa: true,
        intentos: attempt.intentos,
        createdAt: now,
        updatedAt: now
      };
      db.progressRecords.push(progress);
    }

    // Actualizar racha
    const user = db.users.find((u) => u.id === userId);
    if (user && user.role === 'student') {
      const todayStr = now.split('T')[0];
      const lastUpdatedStr = user.rachaLastUpdated ? user.rachaLastUpdated.split('T')[0] : '';
      
      if (lastUpdatedStr !== todayStr) {
        // Si es un día diferente, incrementar racha
        user.racha = (user.racha || 0) + 1;
        user.rachaLastUpdated = now;
      }
    }
  }

  saveDb(db);
  return attempt;
}

export function getLogrosForUser(userId: string): Logro[] {
  return getDb().logros.filter((l) => l.userId === userId);
}

export function unlockLogroForUser(
  userId: string,
  tipo: string,
  titulo: string,
  descripcion: string,
  icono: string,
  color: string
): Logro | undefined {
  const db = getDb();
  // Verificar si ya está desbloqueado
  const existing = db.logros.find((l) => l.userId === userId && l.tipo === tipo);
  if (existing) return existing;

  const newLogro: Logro = {
    id: `logro-${Date.now()}`,
    userId,
    tipo,
    titulo,
    descripcion,
    icono,
    color,
    unlockedAt: new Date().toISOString()
  };

  db.logros.push(newLogro);
  saveDb(db);
  return newLogro;
}

export function getDocenteAnalytics(): DocenteAnalytics {
  return getDb().docenteAnalytics;
}
