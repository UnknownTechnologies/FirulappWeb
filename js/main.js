/**
 * Firulapp Web - Interactividad y Animaciones Ligadas al Scroll
 * Motor de parallax con requestAnimationFrame, IntersectionObserver y UI reactiva.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const scrollProgress = document.getElementById('scrollProgress');
  const parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  const statNumbers = Array.from(document.querySelectorAll('.stat-number[data-count]'));
  const planTabs = Array.from(document.querySelectorAll('.plan-tab'));
  const contactForm = document.getElementById('contactForm');
  const toastEl = document.getElementById('firulappToast');

  // =========================================================================
  // 1. Menú Móvil
  // =========================================================================
  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('mobile-open');
    });

    if (navLinks) {
      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navbar.classList.remove('mobile-open');
        });
      });
    }
  }

  // =========================================================================
  // 2. Motor de Parallax Ligado al Scroll (60fps con requestAnimationFrame)
  // =========================================================================
  let ticking = false;

  function updateOnScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Barra de progreso superior
    if (scrollProgress && docHeight > 0) {
      const progress = Math.min((scrollY / docHeight) * 100, 100);
      scrollProgress.style.width = `${progress}%`;
    }

    // Estado del Navbar
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 36);
    }

    // Desplazamiento y rotación de formas/imágenes conforme al scroll
    if (!prefersReducedMotion) {
      const viewportCenter = window.innerHeight / 2;

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || '0.15');
        const maxRotate = parseFloat(el.dataset.rotate || '0');
        const parentSection = el.closest('section') || el.parentElement;
        const rect = parentSection.getBoundingClientRect();

        // Solo animar si la sección está cerca o dentro del viewport
        if (rect.bottom >= -200 && rect.top <= window.innerHeight + 200) {
          const sectionCenter = rect.top + rect.height / 2;
          const delta = sectionCenter - viewportCenter;
          const translateY = delta * speed;
          const rotateDeg = maxRotate ? (delta / window.innerHeight) * maxRotate : 0;

          el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) rotate(${rotateDeg.toFixed(2)}deg)`;
        }
      });
    }

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Llamada inicial para posicionar elementos antes del primer scroll
  updateOnScroll();

  // =========================================================================
  // 3. Revelación Progresiva (IntersectionObserver)
  // =========================================================================
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min((index % 3) * 80, 200)}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // =========================================================================
  // 4. Contadores Animados en Estadísticas
  // =========================================================================
  function animateCounter(el) {
    const target = parseInt(el.dataset.count || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1100;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - ratio, 3);
      const current = Math.round(target * eased);
      el.textContent = `${prefix}${current}${suffix}`;

      if (ratio < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    statNumbers.forEach((el) => statsObserver.observe(el));
  }

  // =========================================================================
  // 5. Switch de Planes (Para Tutores B2C vs Para Clínicas B2B)
  // =========================================================================
  const plansB2C = document.getElementById('plans-b2c');
  const plansB2B = document.getElementById('plans-b2b');

  planTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.planTarget;

      planTabs.forEach((btn) => {
        const isActive = btn === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      if (target === 'b2c') {
        plansB2C?.classList.remove('hidden');
        plansB2B?.classList.add('hidden');
      } else {
        plansB2B?.classList.remove('hidden');
        plansB2C?.classList.add('hidden');
      }
    });
  });

  // =========================================================================
  // 6. Formulario de Contacto & Toast Firulapp
  // =========================================================================
  let toastTimeout;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('contactName');
      const typeSelect = document.getElementById('contactType');
      const name = nameInput?.value.trim() || 'Pet Lover';
      const isB2B = typeSelect?.value === 'clinica';

      showToast(
        isB2B
          ? `¡Gracias, ${name}! Nuestro equipo B2B te contactará para activar tu clínica en Firulapp.`
          : `¡Bienvenido a Firulapp, ${name}! Te avisaremos en cuanto tu acceso esté listo.`
      );
      contactForm.reset();
    });
  }

  // =========================================================================
  // 7. Animación Interactiva de Mascotas Welcome (Port 1:1 de InteractiveMascotsWidget)
  // =========================================================================
  const mascotsCanvas = document.getElementById('welcomeMascotsCanvas');
  const mascotsStage = document.getElementById('mascotsStage');

  if (mascotsCanvas && mascotsCanvas.getContext) {
    const ctx = mascotsCanvas.getContext('2d');
    const logicalSize = 260;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    mascotsCanvas.width = logicalSize * dpr;
    mascotsCanvas.height = 220 * dpr;

    let targetLookAt = { x: 0, y: 0 };
    let currentLookAt = { x: 0, y: 0 };
    let isHappy = false;
    let happyStart = 0;
    const happyDuration = 1200;
    const particles = [];
    const symbols = ['💖', '🐾', '✨', '⭐', '💕'];

    function spawnParticles(count = 6) {
      const now = performance.now();
      for (let i = 0; i < count; i++) {
        particles.push({
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          startX: 130 + (Math.random() - 0.5) * 140,
          startY: 115 + (Math.random() - 0.5) * 70,
          drift: (Math.random() - 0.5) * 24,
          bornAt: now,
          duration: 1000,
        });
      }
    }

    function triggerHappy() {
      isHappy = true;
      happyStart = performance.now();
      spawnParticles(6);
    }

    // Seguimiento de mirada global y al tocar el escenario
    window.addEventListener(
      'mousemove',
      (e) => {
        if (isHappy) return;
        const rect = mascotsCanvas.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 260));
        const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 220));
        targetLookAt = { x: dx, y: dy };
      },
      { passive: true }
    );

    if (mascotsStage) {
      mascotsStage.addEventListener('click', triggerHappy);
      mascotsStage.addEventListener('mouseleave', () => {
        targetLookAt = { x: 0, y: 0 };
      });
    }

    function drawOval(c, cx, cy, w, h, color) {
      c.fillStyle = color;
      c.beginPath();
      c.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
      c.fill();
    }

    function drawEye(c, cx, cy, shiftX, shiftY, radius, irisColor) {
      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(cx, cy, radius, 0, Math.PI * 2);
      c.fill();

      const px = cx + shiftX;
      const py = cy + shiftY;
      c.fillStyle = irisColor;
      c.beginPath();
      c.arc(px, py, radius * 0.55, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(px - 1.5, py - 1.5, radius * 0.22, 0, Math.PI * 2);
      c.fill();
    }

    function drawCatEye(c, cx, cy, shiftX, shiftY) {
      c.fillStyle = '#10B981';
      c.beginPath();
      c.arc(cx, cy, 6.2, 0, Math.PI * 2);
      c.fill();

      const px = cx + shiftX;
      const py = cy + shiftY;
      c.fillStyle = '#064E3B';
      c.beginPath();
      c.ellipse(px, py, 2.0, 4.25, 0, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(px - 1.0, py - 1.2, 1.6, 0, Math.PI * 2);
      c.fill();
    }

    function renderMascots(now) {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, logicalSize, 220);

      // Interpolación suave de LookAt
      currentLookAt.x += (targetLookAt.x - currentLookAt.x) * 0.14;
      currentLookAt.y += (targetLookAt.y - currentLookAt.y) * 0.14;

      // Ciclos de respiración y cola
      const idlePhase = (now % 4800) / 4800;
      const breathDy = Math.sin(idlePhase * Math.PI * 2) * 3.0;
      const tailPhase = (now % 1300) / 1300;
      const tailAngle = Math.sin(tailPhase * Math.PI * 2) * 0.22;

      let happyBounce = 0;
      if (isHappy) {
        const hp = (now - happyStart) / happyDuration;
        if (hp >= 1) {
          isHappy = false;
        } else {
          happyBounce = Math.sin(hp * Math.PI) * 14.0;
        }
      }

      ctx.translate(0, breathDy - happyBounce - 20);

      // 1. Sombra en el suelo
      ctx.save();
      ctx.filter = 'blur(5px)';
      drawOval(ctx, 130, 222, 175, 22, 'rgba(44, 0, 62, 0.20)');
      ctx.restore();

      // 2. Gatito (Michi)
      drawOval(ctx, 182, 182, 68, 72, '#E2E8F0');
      drawOval(ctx, 170, 216, 18, 14, '#CBD5E1');
      drawOval(ctx, 194, 216, 18, 14, '#CBD5E1');

      ctx.save();
      ctx.translate(currentLookAt.x * 2.5, currentLookAt.y * 2.2);

      // Orejas gato
      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(154, 116);
      ctx.lineTo(163, 86);
      ctx.lineTo(178, 108);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.moveTo(158, 114);
      ctx.lineTo(164, 93);
      ctx.lineTo(174, 108);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(186, 108);
      ctx.lineTo(200, 86);
      ctx.lineTo(210, 116);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.moveTo(190, 108);
      ctx.lineTo(199, 93);
      ctx.lineTo(206, 114);
      ctx.closePath();
      ctx.fill();

      // Cabeza gato
      ctx.fillStyle = '#F1F5F9';
      ctx.beginPath();
      ctx.arc(182, 129, 28, 0, Math.PI * 2);
      ctx.fill();

      // Nariz gato
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.moveTo(179, 132);
      ctx.lineTo(185, 132);
      ctx.lineTo(182, 136);
      ctx.closePath();
      ctx.fill();

      // Bigotes gato
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(164, 133); ctx.lineTo(150, 131);
      ctx.moveTo(164, 137); ctx.lineTo(149, 141);
      ctx.moveTo(200, 133); ctx.lineTo(214, 131);
      ctx.moveTo(200, 137); ctx.lineTo(215, 141);
      ctx.stroke();

      // Chapitas gato
      drawOval(ctx, 162, 135, 9, 5, isHappy ? 'rgba(244, 63, 94, 0.7)' : 'rgba(244, 63, 94, 0.35)');
      drawOval(ctx, 202, 135, 9, 5, isHappy ? 'rgba(244, 63, 94, 0.7)' : 'rgba(244, 63, 94, 0.35)');

      // Ojos gato
      if (isHappy) {
        ctx.strokeStyle = '#064E3B';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(164, 126);
        ctx.quadraticCurveTo(170, 121, 176, 126);
        ctx.moveTo(188, 126);
        ctx.quadraticCurveTo(194, 121, 200, 126);
        ctx.stroke();
      } else {
        drawCatEye(ctx, 170, 125, currentLookAt.x * 3.5, currentLookAt.y * 3.5);
        drawCatEye(ctx, 194, 125, currentLookAt.x * 3.5, currentLookAt.y * 3.5);
      }
      ctx.restore();

      // 3. Perrito (Firulais)
      // Cola
      ctx.save();
      ctx.translate(65, 175);
      ctx.rotate(tailAngle + (isHappy ? 0.3 : 0.0));
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-35, -20, -25, -45);
      ctx.quadraticCurveTo(-5, -25, 10, -5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Cuerpo
      drawOval(ctx, 105, 178, 104, 92, '#F59E0B');

      // Pecho crema
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.moveTo(85, 160);
      ctx.quadraticCurveTo(105, 190, 125, 160);
      ctx.quadraticCurveTo(105, 218, 85, 160);
      ctx.closePath();
      ctx.fill();

      // Patitas
      drawOval(ctx, 82, 218, 26, 18, '#D97706');
      drawOval(ctx, 128, 218, 26, 18, '#D97706');

      // Cabeza perrito
      ctx.save();
      ctx.translate(currentLookAt.x * 3.5, currentLookAt.y * 3.0);

      const earOffset = isHappy ? 0.25 : 0.0;
      ctx.save();
      ctx.translate(60, 95);
      ctx.rotate(-0.35 - earOffset);
      drawOval(ctx, 0, 0, 28, 56, '#B45309');
      ctx.restore();

      ctx.save();
      ctx.translate(150, 95);
      ctx.rotate(0.35 + earOffset);
      drawOval(ctx, 0, 0, 28, 56, '#B45309');
      ctx.restore();

      // Cara base
      drawOval(ctx, 105, 114, 88, 80, '#FBBF24');
      drawOval(ctx, 105, 127, 48, 38, '#FEF3C7');

      // Naricita
      ctx.fillStyle = '#1F2937';
      ctx.beginPath();
      ctx.moveTo(98, 121);
      ctx.lineTo(112, 121);
      ctx.lineTo(105, 129);
      ctx.closePath();
      ctx.fill();

      // Sonrisa
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(97, 131);
      ctx.quadraticCurveTo(105, 138, 113, 131);
      ctx.stroke();

      // Lengüita feliz
      if (isHappy) {
        ctx.fillStyle = '#FB7185';
        ctx.beginPath();
        ctx.moveTo(100, 134);
        ctx.quadraticCurveTo(105, 147, 110, 134);
        ctx.closePath();
        ctx.fill();
      }

      // Chapitas
      drawOval(ctx, 74, 122, 16, 9, isHappy ? 'rgba(244, 63, 94, 0.75)' : 'rgba(244, 63, 94, 0.40)');
      drawOval(ctx, 136, 122, 16, 9, isHappy ? 'rgba(244, 63, 94, 0.75)' : 'rgba(244, 63, 94, 0.40)');

      // Ojos perrito
      if (isHappy) {
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.moveTo(79, 108);
        ctx.quadraticCurveTo(86, 102, 93, 108);
        ctx.moveTo(117, 108);
        ctx.quadraticCurveTo(124, 102, 131, 108);
        ctx.stroke();
      } else {
        drawEye(ctx, 86, 108, currentLookAt.x * 4.5, currentLookAt.y * 4.5, 8.5, '#1F2937');
        drawEye(ctx, 124, 108, currentLookAt.x * 4.5, currentLookAt.y * 4.5, 8.5, '#1F2937');
      }

      ctx.restore();
      ctx.restore();

      // 4. Partículas flotantes de caricia
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const progress = (now - p.bornAt) / p.duration;
        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }
        const y = p.startY - progress * 70;
        const x = p.startX + Math.sin(progress * Math.PI * 2) * p.drift;
        ctx.globalAlpha = Math.max(0, 1 - progress);
        ctx.font = `${Math.round(16 + progress * 10)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.symbol, x, y);
      }
      ctx.restore();

      requestAnimationFrame(renderMascots);
    }

    requestAnimationFrame(renderMascots);
  }
});
