'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function Home() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const irDashboard = () => {
    router.push('/auth/dev-login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-bg-soft1 to-white select-none py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          
          {/* Lado izquierdo: Textos y CTAs */}
          <div className="md:col-span-6 flex flex-col gap-6 text-left">
            <span className="self-start text-[11px] font-bold text-blue-action bg-bg-soft2 border border-blue-action/10 rounded-full px-3.5 py-1 uppercase tracking-wider">
              Matemáticas · Grado 8° · Colombia
            </span>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-tinta tracking-tight leading-[1.08]">
              Aprende álgebra <br />
              <span className="text-blue-action">sin miedo.</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-500 max-w-[460px] leading-relaxed">
              Videos animados, retos con balanzas y un camino de progreso hecho a tu ritmo. Aquí cada error es una pista para aprender, no un castigo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={irDashboard}
                className="h-12 px-6 rounded-xl bg-blue-action text-white text-sm font-semibold hover:bg-blue-action/90 active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                Soy estudiante — es gratis
              </button>
              <button
                onClick={irDashboard}
                className="h-12 px-6 rounded-xl border border-blue-action/30 text-blue-action text-sm font-semibold hover:bg-bg-soft2 hover:border-blue-action active:scale-95 transition-all flex items-center justify-center cursor-pointer bg-white"
              >
                Soy docente o colegio
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mt-1">
              Alineado con los DBA del MEN · Optimizado para conexiones rurales (0.5 Mbps)
            </p>
          </div>

          {/* Lado derecho: Manim Video Player Placeholder */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div
              onClick={() => {
                if (!isPlaying) {
                  setIsPlaying(true);
                  // En una app real cargaría el video, aquí simulamos e invitamos a entrar
                  setTimeout(() => {
                    router.push('/auth/dev-login');
                  }, 1200);
                }
              }}
              className="aspect-video w-full rounded-2xl bg-tinta relative overflow-hidden flex flex-col items-center justify-center cursor-pointer border border-tinta/10 group shadow-md"
            >
              {/* Grid de fondo abstracto de Manim */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(47,109,181,0.15),rgba(255,255,255,0))]" />
              <div className="absolute inset-0 bg-repeating-linear-gradient(45deg,rgba(255,255,255,0.015) 0 10px,transparent 10px 20px)" />
              
              <div className="z-10 flex flex-col items-center gap-4 text-center px-6">
                <span className="text-2xl md:text-4xl font-semibold text-bg-soft2 tracking-wider font-mono group-hover:scale-105 transition-transform duration-300">
                  {isPlaying ? 'Cargando lección...' : '2x + 3 = 11'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {isPlaying 
                    ? '[ abriendo entorno de aprendizaje... ]' 
                    : '[ video manim · la balanza de ecuaciones · 4:32 ]'}
                </span>
              </div>

              {/* Botón Play */}
              <div className="absolute bottom-5 left-5 w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all shadow-md">
                {isPlaying ? (
                  <div className="w-4 h-4 border-2 border-tinta border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[12px] border-l-tinta ml-1" />
                )}
              </div>
            </div>
            
            <p className="text-xs text-slate-400 text-center">
              Lección destacada: <strong>¿Por qué una ecuación es una balanza?</strong> (Haz clic para verla)
            </p>
          </div>

        </div>
      </section>

      {/* Sección "Cómo funciona" */}
      <section className="py-16 bg-white border-t border-tinta/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-tinta tracking-tight">
              Cómo funciona
            </h2>
            <p className="text-sm text-slate-500">Tres pasos, una habilidad a la vez.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Paso 1 */}
            <div className="bg-bg-soft1 rounded-2xl p-6 flex flex-col gap-4 border border-tinta/5">
              <div className="w-10 h-10 rounded-full bg-blue-action text-white flex items-center justify-center font-bold text-base shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-tinta">Mira</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Videos animados cortos de 3–5 minutos. Te explican de forma visual el &quot;porqué&quot; detrás de cada regla, no solo el cómo.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-bg-soft1 rounded-2xl p-6 flex flex-col gap-4 border border-tinta/5">
              <div className="w-10 h-10 rounded-full bg-blue-action text-white flex items-center justify-center font-bold text-base shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-tinta">Practica</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Retos interactivos donde arrastras términos sobre una balanza física en pantalla. Si fallas, una pregunta te ayuda a descubrir el error.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-bg-soft1 rounded-2xl p-6 flex flex-col gap-4 border border-tinta/5">
              <div className="w-10 h-10 rounded-full bg-blue-action text-white flex items-center justify-center font-bold text-base shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-tinta">Avanza</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Tu árbol de habilidades crece contigo. Tu progreso es privado: no hay tablas de posiciones públicas ni competencia estresante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Testimonios */}
      <section className="py-16 bg-bg-soft1 border-t border-b border-tinta/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-2xl border border-tinta/5 flex flex-col justify-between gap-6 shadow-sm">
            <p className="text-sm text-slate-600 italic leading-relaxed">
              &quot;Antes odiaba el álgebra porque siempre sentía que si cometía un error era mala en matemáticas. En Eureka arrastro las fichas y la balanza me muestra qué hice mal sin decirme incorrecto. Se siente como un juego.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-action/10 text-blue-action flex items-center justify-center font-bold text-sm">
                V
              </div>
              <div>
                <p className="text-xs font-bold text-tinta">Valentina M.</p>
                <p className="text-[10px] text-slate-400">Estudiante de 8° grado, Boyacá</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-tinta/5 flex flex-col justify-between gap-6 shadow-sm">
            <p className="text-sm text-slate-600 italic leading-relaxed">
              &quot;Eureka me permite ver en tiempo real qué conceptos le están costando más a mis estudiantes sin exponer sus nombres. Descubrí que el 64% fallaba en la propiedad distributiva y pudimos repasarlo juntos en clase.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-logro/10 text-green-logro flex items-center justify-center font-bold text-sm">
                C
              </div>
              <div>
                <p className="text-xs font-bold text-tinta">Profesor Carlos R.</p>
                <p className="text-[10px] text-slate-400">Docente de Matemáticas, Cundinamarca</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 text-center select-none bg-white">
        <div className="max-w-3xl mx-auto px-6 flex flex-col gap-6 items-center">
          <h2 className="text-3xl font-extrabold text-tinta tracking-tight">
            ¿Listo para aprender álgebra sin miedo?
          </h2>
          <p className="text-sm text-slate-500 max-w-md">
            Solo necesitas una cuenta de correo para empezar. No requerimos tarjetas de crédito ni pagos.
          </p>
          <button
            onClick={irDashboard}
            className="h-12 px-8 rounded-xl bg-blue-action text-white text-sm font-semibold hover:bg-blue-action/90 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            Crear mi cuenta gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-tinta text-slate-400 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Eureka Logo" className="h-7 w-auto object-contain" />
            <span className="text-base font-bold text-white tracking-tight">Eureka</span>
          </div>
          <p className="text-xs">
            © 2026 Eureka. Todos los derechos reservados. Hecho para la educación en Colombia.
          </p>
        </div>
      </footer>
    </div>
  );
}
