/* ============================================================
   layout.js — Distribución de Planta (Diseñador de cuadrícula)
   ============================================================ */

const GRID_COLS = 10;
const GRID_ROWS = 10;

let layoutProyecto  = 'suplementos';
let layoutPintando  = false;
let layoutAreaActiva = null;  // id del área seleccionada para pintar
let layoutCeldas    = [];     // estado [GRID_ROWS][GRID_COLS] → null | areaId

function initLayout() {
  // Botones de proyecto
  document.querySelectorAll('.layout-proj-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      layoutProyecto = btn.dataset.proj;
      document.querySelectorAll('.layout-proj-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      resetLayout();
      renderLayout();
    });
  });

  document.getElementById('layout-btn-reset')?.addEventListener('click', () => {
    resetLayout();
    renderLayoutGrid();
    updateLayoutStats();
  });

  document.getElementById('layout-btn-auto')?.addEventListener('click', autoFillLayout);

  resetLayout();
  renderLayout();
}

function resetLayout() {
  layoutCeldas = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
  layoutAreaActiva = null;
}

function renderLayout() {
  renderPaleta();
  renderLayoutGrid();
  updateLayoutStats();
}

/* ── Paleta de áreas ── */
function renderPaleta() {
  const proj  = PROYECTOS[layoutProyecto];
  const palEl = document.getElementById('layout-palette');
  if (!palEl) return;

  palEl.innerHTML = proj.layoutAreas.map(area => `
    <div class="palette-area" data-areaid="${area.id}"
         style="--palette-color:${area.color}"
         onclick="selectPaletteArea('${area.id}')">
      <span class="palette-color" style="background:${area.color}"></span>
      <span class="palette-icon">${area.icon}</span>
      <div class="palette-info">
        <div class="palette-label">${area.label}</div>
        <div class="palette-m2">${area.m2} m² ref.</div>
      </div>
    </div>`).join('');

  // Seleccionar la primera por defecto
  if (proj.layoutAreas.length > 0) selectPaletteArea(proj.layoutAreas[0].id);
}

function selectPaletteArea(areaId) {
  layoutAreaActiva = areaId;
  document.querySelectorAll('.palette-area').forEach(el => {
    el.classList.toggle('selected', el.dataset.areaid === areaId);
  });
}

/* ── Grid ── */
function renderLayoutGrid() {
  const proj  = PROYECTOS[layoutProyecto];
  const grid  = document.getElementById('layout-visual');
  if (!grid) return;

  grid.innerHTML = '';

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'layout-cell';

      const areaId = layoutCeldas[r][c];
      if (areaId) {
        const area = proj.layoutAreas.find(a => a.id === areaId);
        if (area) {
          cell.classList.add('painted');
          cell.style.background = area.color + 'cc';
          cell.title = area.label;
        }
      }

      // Eventos para pintar (mouse + touch)
      cell.addEventListener('mousedown', (e) => { e.preventDefault(); layoutPintando = true; paintCell(r, c); });
      cell.addEventListener('mouseover', ()  => { if (layoutPintando) paintCell(r, c); });
      cell.addEventListener('touchstart', (e)=> { e.preventDefault(); layoutPintando = true; paintCell(r, c); }, { passive: false });
      cell.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains('layout-cell')) {
          const cells = grid.querySelectorAll('.layout-cell');
          const idx = Array.from(cells).indexOf(target);
          if (idx >= 0) {
            const tr = Math.floor(idx / GRID_COLS), tc = idx % GRID_COLS;
            paintCell(tr, tc);
          }
        }
      }, { passive: false });

      grid.appendChild(cell);
    }
  }

  document.addEventListener('mouseup',  () => layoutPintando = false, { once: false });
  document.addEventListener('touchend', () => layoutPintando = false, { once: false });
}

function paintCell(r, c) {
  if (!layoutAreaActiva) return;
  const proj = PROYECTOS[layoutProyecto];
  const grid = document.getElementById('layout-visual');
  if (!grid) return;

  // Toggle: si ya tiene ese color → borrar; si tiene otro → pintar nuevo
  if (layoutCeldas[r][c] === layoutAreaActiva) {
    layoutCeldas[r][c] = null;
  } else {
    layoutCeldas[r][c] = layoutAreaActiva;
  }

  // Actualizar solo esa celda visualmente
  const idx  = r * GRID_COLS + c;
  const cell = grid.querySelectorAll('.layout-cell')[idx];
  if (!cell) return;

  const areaId = layoutCeldas[r][c];
  if (areaId) {
    const area = proj.layoutAreas.find(a => a.id === areaId);
    cell.classList.add('painted');
    cell.style.background = area ? area.color + 'cc' : '';
    cell.title = area ? area.label : '';
  } else {
    cell.classList.remove('painted');
    cell.style.background = '';
    cell.title = '';
  }

  updateLayoutStats();
}

/* ── Auto-Fill (distribución proporcional automática) ── */
function autoFillLayout() {
  const proj  = PROYECTOS[layoutProyecto];
  const total = 100; // 10×10 celdas

  // Calcular proporción de celdas por área
  const totalM2 = proj.layoutAreas.reduce((s, a) => s + a.m2, 0);
  const celdasPorArea = proj.layoutAreas.map(area => ({
    id:   area.id,
    celdas: Math.round((area.m2 / totalM2) * total)
  }));

  // Llenar grid linealmente
  const orden = [];
  celdasPorArea.forEach(a => {
    for (let i = 0; i < a.celdas; i++) orden.push(a.id);
  });
  // Rellenar sobrante si hay diferencia de redondeo
  while (orden.length < total) orden.push(celdasPorArea[celdasPorArea.length - 1].id);
  while (orden.length > total) orden.pop();

  let k = 0;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      layoutCeldas[r][c] = orden[k++] || null;
    }
  }

  renderLayoutGrid();
  updateLayoutStats();
}

/* ── Stats ── */
function updateLayoutStats() {
  const proj  = PROYECTOS[layoutProyecto];
  const total = GRID_ROWS * GRID_COLS;

  // Contar celdas pintadas
  let pintadas = 0;
  const conteo = {};
  proj.layoutAreas.forEach(a => conteo[a.id] = 0);

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const a = layoutCeldas[r][c];
      if (a) { pintadas++; if (conteo[a] !== undefined) conteo[a]++; }
    }
  }

  const pct = Math.round((pintadas / total) * 100);

  const statsEl = document.getElementById('layout-stats');
  if (!statsEl) return;

  statsEl.innerHTML = `
    <div class="layout-stat-row">
      <span class="layout-stat-label">Área utilizada</span>
      <span class="layout-stat-val">${pintadas}/${total} celdas (${pct}%)</span>
    </div>
    <div class="layout-progress-bar">
      <div class="layout-progress-fill" style="width:${pct}%"></div>
    </div>
    ${proj.layoutAreas.map(area => {
      const cel = conteo[area.id] || 0;
      const areaPct = Math.round((cel / total) * 100);
      return `<div class="layout-stat-row" style="margin-top:6px">
        <span style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
          <span style="width:8px;height:8px;border-radius:50%;background:${area.color};display:inline-block"></span>
          ${area.label}
        </span>
        <span class="layout-stat-val" style="font-size:13px">${areaPct}%</span>
      </div>`;
    }).join('')}
    <div class="divider" style="margin:10px 0"></div>
    <div class="layout-stat-row">
      <span class="layout-stat-label">Área total ref.</span>
      <span class="layout-stat-val">${proj.layoutTotal} m²</span>
    </div>
  `;
}

/* ── Exportar datos para el Ejercicio 2 ── */
function getLayoutDataParaEjercicio() {
  const proj  = PROYECTOS[layoutProyecto];
  const total = GRID_ROWS * GRID_COLS;
  const conteo = {};
  proj.layoutAreas.forEach(a => conteo[a.id] = 0);

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const a = layoutCeldas[r][c];
      if (a && conteo[a] !== undefined) conteo[a]++;
    }
  }

  return proj.layoutAreas.map(area => ({
    area:  area.label,
    celdas: conteo[area.id],
    pct:   Math.round((conteo[area.id] / total) * 100)
  }));
}
