/* ============================================================
   app.js — Navegación SPA, scroll, animaciones, inicialización
   ============================================================ */

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior:'smooth' });
  }
}

function updateActiveNav() {
  const ids = ['hero','puntos','browngibson'];
  const y = window.pageYOffset + 120;
  let current = 'hero';
  ids.forEach(id => { const el = document.getElementById(id); if(el && el.offsetTop <= y) current = id; });
  document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.section === current));
}

window.addEventListener('scroll', () => {
  updateActiveNav();
  const h = document.getElementById('header');
  if(h) h.style.boxShadow = window.pageYOffset > 40 ? '0 4px 24px rgba(0,0,0,.4)' : 'none';
}, { passive:true });

// ── Hamburguesa ──────────────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('main-nav').classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    scrollToSection(a.dataset.section);
    document.getElementById('main-nav').classList.remove('open');
  });
});

// ── Fade-in-up al hacer scroll ───────────────────────────────
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); fadeObs.unobserve(e.target); } });
}, { threshold:0.10 });
document.querySelectorAll('.animate-fade-up').forEach(el => fadeObs.observe(el));

// ── Lazy-init de mapas al entrar en cada sección ─────────────
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const id = e.target.id;
    if(id === 'hero') { setTimeout(initHeroMap, 100); }
    else if(id === 'puntos') { setTimeout(() => { initPuntosPonderados(); validatePPWeights(); }, 200); }
    else if(id === 'browngibson') { setTimeout(() => { initBrownGibson(); validateFSWeights(); }, 200); }
    sectionObs.unobserve(e.target);
  });
}, { threshold:0.05 });
document.querySelectorAll('#hero,#puntos,#browngibson').forEach(el => sectionObs.observe(el));

// ── Helpers compartidos para invalidar tamaño de mapas ───────
function invalidateMaps() {
  setTimeout(() => {
    Object.values(MAP_STATES).forEach(st => { if(st && st.map) st.map.invalidateSize(); });
  }, 350);
}

// Exponer ppSwitchTab globalmente (llamado desde HTML onclick)
window.ppSwitchTab = function(tab) {
  ['ejemplo','calc'].forEach(t => {
    document.getElementById(`pp-panel-${t}`).classList.toggle('active', t===tab);
    document.getElementById(`pp-tab-${t}`).classList.toggle('active', t===tab);
  });
  if(!PP.mapInitialized){ initMap('pp-map','pp'); PP.mapInitialized=true; }
  invalidateMaps();
};

// Exponer bgGoToStage globalmente
window.bgGoToStage = function(num) {
  for(let i=1;i<=4;i++){
    document.getElementById(`bg-stage-${i}`).classList.toggle('active', i===num);
    document.getElementById(`bg-stage-indicator-${i}`).classList.toggle('active', i===num);
  }
  if(!BG.mapInitialized) initBrownGibson();
  const hints = { 1:'Los toggles controlan el mapa', 2:'Ingresa costos → mapa muestra FO', 3:'Califica factores cualitativos', 4:'Mueve el slider K → mapa en tiempo real' };
  const h = document.getElementById('bg-map-hint'); if(h) h.textContent = hints[num]||'';
  invalidateMaps();
};

document.addEventListener('DOMContentLoaded', () => { updateActiveNav(); });
