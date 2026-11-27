# 🐾 Firulapp Web (`FirulappWeb`)

Subproyecto web corporativo y de producto del ecosistema **Firulapp**, diseñado para presentar quiénes somos, qué hacemos (tanto para tutores de mascotas B2C como para clínicas/veterinarias B2B), nuestro asistente `firulAIs` y los planes disponibles.

## 🛠️ Stack Propuesto e Implementado
* **HTML5 Semántico**: Estructura limpia, accesible y amigable con SEO.
* **CSS3 Moderno**: Variables CSS alineadas 1:1 con [`AppTheme.dart`](../firulapp/lib/app/theme/AppTheme.dart) y [`StyleSettings.dart`](../firulapp/lib/app/theme/constants/StyleSettings.dart) (`#7713B5`, `#FB3E63`, `#00BFA6`, `#2C003E`), tipografía oficial **Fredoka (`FirulappFont`)**, glassmorphism estilo iOS (`backdrop-filter`) y diseño 100% responsivo.
* **Vanilla JavaScript (ES6+)**:
  * Motor de **parallax ligado al scroll** a 60fps (`requestAnimationFrame`) para formas geométricas, siluetas de Firulapp y tarjetas flotantes.
  * Revelación progresiva y contadores animados con `IntersectionObserver`.
  * Selector interactivo de planes B2C / B2B y formulario con notificaciones tipo `FirulappToast`.
  * Soporte nativo para `prefers-reduced-motion`.

## 📁 Estructura del Proyecto
```text
FirulappWeb/
├── index.html          # Página principal (Hero, Quiénes Somos, Qué Hacemos, firulAIs, B2B, Planes, Contacto)
├── css/
│   └── styles.css      # Sistema de diseño oficial Firulapp, parallax y responsividad
├── js/
│   └── main.js         # Motor parallax por scroll, animaciones e interactividad
└── assets/
    ├── fonts/          # Tipografía oficial Fredoka (Light, Regular, Medium, SemiBold, Bold)
    └── images/         # Assets oficiales copiados de firulapp/assets/
```

## 🚀 Cómo Ejecutar Localmente
Al ser un sitio estático sin dependencias de compilación, puedes levantarlo inmediatamente con cualquiera de estos comandos desde la carpeta `FirulappWeb/`:

```bash
# Opción 1: Python 3
python3 -m http.server 8080

# Opción 2: Node.js
npx serve .
```

Luego abre en tu navegador: `http://localhost:8080`
