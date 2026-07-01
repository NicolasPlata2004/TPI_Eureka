# Eureka — Plataforma Educativa de Álgebra

**Eureka** es una plataforma gamificada diseñada para estudiantes de grado 8° en Colombia, enfocada exclusivamente en facilitar la transición de la aritmética al álgebra. Su propósito principal es reducir la ansiedad matemática a través de un enfoque de mentalidad de crecimiento, convirtiendo el error en una oportunidad de aprendizaje constructivo.

## Características de la Aplicación

- **Física de Balanza Interactiva:** Despeja ecuaciones mediante arrastre de fichas (Drag-and-Drop) utilizando eventos de puntero unificados para máxima fluidez y compatibilidad con pantallas táctiles móviles.
- **Mentalidad de Crecimiento:** Retroalimentación reflexiva (en color ámbar △) al cometer errores, guiando al estudiante a encontrar la solución por sí mismo sin mensajes punitivos.
- **Árbol de Habilidades Individual:** Progreso personal libre de tablas de posiciones públicas o competencia para reducir el estrés.
- **Panel Docente Privado:** Analíticas de rendimiento grupal en tiempo real, KPIs de participación, gráficos de dificultad e informes exportables en formato CSV.
- **Optimización Móvil y de Conectividad:** Diseñado mobile-first y optimizado para funcionar en conexiones lentas de internet (0.5 Mbps) típicas de colegios rurales colombianos.

---

## Tecnologías Utilizadas

- **Frontend/Backend:** Next.js 15+ (App Router) con TypeScript
- **Estilos:** Tailwind CSS (v4) + Fuentes de Google (Lexend & Spline Sans Mono)
- **Persistencia:** Base de datos local ligera en formato JSON (`data/db.json`) para máxima portabilidad sin dependencias externas.

---

## Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---

## Cómo Probar los Flujos Clave

1. Abre la aplicación e ingresa a **"Empezar gratis"** en la Landing Page.
2. En la pantalla de acceso para desarrollo (`/auth/dev-login`), selecciona una cuenta de prueba:
   - **Valentina (Estudiante):** Para ver el árbol de habilidades, racha de días, ver lecciones con reproductor Manim simulado y resolver el reto interactivo de la balanza.
   - **Profesor Carlos (Docente):** Para acceder al panel docente privado, ver estadísticas de dificultad y descargar la lista de alumnos en formato CSV.
