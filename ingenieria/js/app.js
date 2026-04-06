/* ============================================================
   app.js — Navegación e inicialización
   ============================================================ */

const SECCIONES = ['home', 'proceso', 'layout', 'maquinaria', 'organigrama', 'ejercicio2'];

let seccionActiva = 'home';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  showSeccion('home');
  initProceso();
  initLayout();
  initMaquinaria();
  initOrganigrama();
  initEjercicio2();
});

/* ── Navegación ── */
function initNav() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      showSeccion(el.dataset.nav);
    });
  });
}

function showSeccion(id) {
  if (!SECCIONES.includes(id)) return;
  seccionActiva = id;

  // Secciones
  SECCIONES.forEach(s => {
    const el = document.getElementById(`section-${s}`);
    if (el) el.classList.toggle('active', s === id);
  });

  // Botones nav
  document.querySelectorAll('.nav-btn[data-nav]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.nav === id);
  });

  // Scroll top suave
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
