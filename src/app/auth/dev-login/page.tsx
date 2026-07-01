'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar: string;
}

export default function DevLogin() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/auth/dev-login');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Error fetching dev users:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleSelectUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const data = await res.json();
        router.push(data.user.role === 'student' ? '/dashboard' : '/teacher');
        router.refresh();
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role })
      });
      if (res.ok) {
        const data = await res.json();
        router.push(data.user.role === 'student' ? '/dashboard' : '/teacher');
        router.refresh();
      }
    } catch (err) {
      console.error('Error creating dev user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-soft1 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 flex flex-col justify-center items-center w-full">
        <div className="w-full grid md:grid-template-columns md:grid-cols-2 gap-10 items-stretch bg-white border border-tinta/10 rounded-2xl shadow-sm overflow-hidden p-8 md:p-10">
          
          {/* Lado Izquierdo: Lista de cuentas existentes */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold text-tinta">Cuentas de Desarrollo</h1>
              <p className="text-xs text-slate-500 mt-1">
                Haz clic en una cuenta para iniciar sesión instantáneamente en modo de prueba.
              </p>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col gap-3 justify-center">
                <div className="h-16 bg-bg-soft1 rounded-xl animate-pulse" />
                <div className="h-16 bg-bg-soft1 rounded-xl animate-pulse" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u.id)}
                    className="w-full flex items-center justify-between p-4 bg-bg-soft1 hover:bg-bg-soft2 border border-tinta/5 hover:border-blue-action/30 rounded-xl active:scale-[0.99] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-action/10 border border-blue-action/20 flex items-center justify-center font-bold text-blue-action text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-tinta">{u.name}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white border border-tinta/10 text-slate-500">
                      {u.role === 'student' ? 'Estudiante' : 'Profesor'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divisor vertical */}
          <div className="hidden md:block w-px bg-tinta/10 self-stretch my-2" />

          {/* Lado Derecho: Crear nueva cuenta */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-tinta">Nueva Cuenta de Prueba</h2>
              <p className="text-xs text-slate-500 mt-1">
                Registra un nuevo perfil simulado para probar el progreso de cero.
              </p>
            </div>

            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-tinta/15 focus:border-blue-action focus:ring-2 focus:ring-blue-action/15 bg-white text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ej. juan@eureka.edu.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-tinta/15 focus:border-blue-action focus:ring-2 focus:ring-blue-action/15 bg-white text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Rol en la plataforma
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`h-10 rounded-xl border text-xs font-semibold transition-all ${
                      role === 'student'
                        ? 'bg-bg-soft2 border-blue-action text-blue-action font-bold'
                        : 'bg-white border-tinta/15 text-slate-500 hover:bg-bg-soft1'
                    }`}
                  >
                    Soy estudiante
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`h-10 rounded-xl border text-xs font-semibold transition-all ${
                      role === 'teacher'
                        ? 'bg-bg-soft2 border-blue-action text-blue-action font-bold'
                        : 'bg-white border-tinta/15 text-slate-500 hover:bg-bg-soft1'
                    }`}
                  >
                    Soy docente
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="h-11 mt-2 rounded-xl bg-blue-action text-white text-sm font-semibold hover:bg-blue-action/90 shadow-sm active:scale-98 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Creando...' : 'Crear y entrar'}
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
