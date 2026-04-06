/* ============================================================
   proceso.js — Diagrama de flujo interactivo
   ============================================================ */

let procesoActivo = 'suplementos';
let pasoSeleccionado = null;

const TIPO_CONFIG = {
  operacion:     { label:'Operación',      color:'#7c3aed', border:'rgba(124,58,237,.5)',  bg:'rgba(124,58,237,.12)', shape:'rect'    },
  decision:      { label:'Decisión',       color:'#f59e0b', border:'rgba(245,158,11,.5)', bg:'rgba(245,158,11,.10)', shape:'diamond' },
  transporte:    { label:'Transporte',     color:'#00d4ff', border:'rgba(0,212,255,.5)',  bg:'rgba(0,212,255,.10)',  shape:'arrow'   },
  almacenamiento:{ label:'Almacenamiento', color:'#10b981', border:'rgba(16,185,129,.5)', bg:'rgba(16,185,129,.10)', shape:'store'   },
  demora:        { label:'Demora',         color:'#ef4444', border:'rgba(239,68,68,.5)',  bg:'rgba(239,68,68,.10)',  shape:'half'    }
};

function initProceso() {
  document.querySelectorAll('.proc-proj-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      procesoActivo = btn.dataset.proj;
      document.querySelectorAll('.proc-proj-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProceso();
    });
  });
  renderLeyenda();
  renderProceso();
}

function renderLeyenda() {
  const el = document.getElementById('proc-leyenda');
  if (!el) return;
  el.innerHTML = Object.entries(TIPO_CONFIG).map(([tipo, cfg]) => `
    <div class="leyenda-item">
      <span class="leyenda-dot" style="background:${cfg.color}"></span>
      <span>${cfg.label}</span>
    </div>`).join('');
}

function renderProceso() {
  const proj = PROYECTOS[procesoActivo];
  const container = document.getElementById('proc-flow-container');
  const detalle   = document.getElementById('proc-detalle');
  if (!container) return;

  pasoSeleccionado = null;
  if (detalle) detalle.style.display = 'none';

  container.innerHTML = proj.proceso.map((paso, idx) => {
    const cfg = TIPO_CONFIG[paso.tipo];
    const isLast = idx === proj.proceso.length - 1;
    return `
      <div class="proc-step-wrap">
        <div class="proc-step proc-${paso.tipo}" data-id="${paso.id}" onclick="selectPaso('${paso.id}')"
             style="--tipo-color:${cfg.color};--tipo-bg:${cfg.bg};--tipo-border:${cfg.border}">
          <div class="proc-step-icon">${paso.icon}</div>
          <div class="proc-step-body">
            <div class="proc-step-tipo">${cfg.label}</div>
            <div class="proc-step-label">${paso.label}</div>
          </div>
          <div class="proc-step-num">${idx + 1}</div>
        </div>
        ${!isLast ? '<div class="proc-connector"><div class="proc-arrow">↓</div></div>' : ''}
      </div>`;
  }).join('');

  // Animación escalonada
  requestAnimationFrame(() => {
    document.querySelectorAll('.proc-step').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  });
}

function selectPaso(pasoId) {
  const proj = PROYECTOS[procesoActivo];
  const paso = proj.proceso.find(p => p.id === pasoId);
  if (!paso) return;

  document.querySelectorAll('.proc-step').forEach(el => el.classList.remove('selected'));
  const el = document.querySelector(`.proc-step[data-id="${pasoId}"]`);
  if (el) { el.classList.add('selected'); el.scrollIntoView({ behavior:'smooth', block:'nearest' }); }

  const cfg = TIPO_CONFIG[paso.tipo];
  const detalle = document.getElementById('proc-detalle');
  if (!detalle) return;

  detalle.style.display = 'block';
  detalle.innerHTML = `
    <div class="proc-det-header" style="border-left:4px solid ${cfg.color}">
      <span class="proc-det-icon">${paso.icon}</span>
      <div>
        <div class="proc-det-tipo" style="color:${cfg.color}">${cfg.label}</div>
        <div class="proc-det-titulo">${paso.label}</div>
      </div>
    </div>
    <div class="proc-det-desc">${paso.desc}</div>
    <div class="proc-det-tag" style="background:${cfg.bg};border-color:${cfg.border};color:${cfg.color}">
      ${cfg.label === 'Decisión' ? '⟡ Punto de control — dos posibles salidas' : '→ Flujo secuencial'}
    </div>`;
  pasoSeleccionado = pasoId;
}
