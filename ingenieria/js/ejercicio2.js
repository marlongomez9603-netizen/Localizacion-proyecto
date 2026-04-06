/* ============================================================
   ejercicio2.js — Ejercicio 2: Diseña tu proceso y planta
   ============================================================ */

// ── URL del Apps Script (misma que en ejercicio.js de Localización)
// Cambia esta URL por la de tu deployment
const APPS_SCRIPT_URL_EJ2 = 'https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec';

let ej2Proyecto = 'suplementos';

// Estado del formulario
let ej2State = {
  proyecto:     '',
  estudiante:   '',
  grupo:        '',
  descripcion:  '',
  areas:        {},   // { areaId: { checked: bool, m2: number } }
  equipos:      [],   // [{ item, cant, costoU }]
  observaciones:''
};

function initEjercicio2() {
  // Selector de proyecto
  document.querySelectorAll('.ej2-proj-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      ej2Proyecto = btn.dataset.proj;
      document.querySelectorAll('.ej2-proj-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEj2();
    });
  });

  renderEj2();
}

/* ── Render principal ── */
function renderEj2() {
  const proj = PROYECTOS[ej2Proyecto];
  ej2State.areas  = {};
  ej2State.equipos = proj.maquinaria.slice(0, 5).map(m => ({
    item:   m.item,
    cant:   '',
    costoU: ''
  }));

  renderEj2Areas(proj);
  renderEj2Equipos(proj);
  resetSubmitMsg();
}

/* ── Parte B: Áreas de la planta ── */
function renderEj2Areas(proj) {
  const el = document.getElementById('ej2-areas');
  if (!el) return;

  el.innerHTML = proj.layoutAreas.map(area => `
    <label class="area-check-item">
      <input type="checkbox" id="ej2-area-${area.id}"
             onchange="toggleAreaCheck('${area.id}', this.checked)">
      <span class="area-check-icon">${area.icon}</span>
      <span class="area-check-label">${area.label}</span>
      <span class="area-check-m2">Ref: ${area.m2} m²</span>
      <input type="number" min="0" placeholder="m²"
             id="ej2-area-m2-${area.id}"
             style="width:64px;padding:4px 6px;border-radius:6px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:var(--text);font-size:12px;outline:none"
             oninput="updateAreaM2('${area.id}', this.value)"
             onclick="e=>e.stopPropagation()"
             disabled>
    </label>`).join('');

  // Inicializar estado
  proj.layoutAreas.forEach(area => {
    ej2State.areas[area.id] = { checked: false, m2: 0 };
  });
}

function toggleAreaCheck(areaId, checked) {
  if (!ej2State.areas[areaId]) ej2State.areas[areaId] = { checked: false, m2: 0 };
  ej2State.areas[areaId].checked = checked;

  const m2Input = document.getElementById(`ej2-area-m2-${areaId}`);
  if (m2Input) m2Input.disabled = !checked;

  calcTotalM2();
}

function updateAreaM2(areaId, val) {
  if (!ej2State.areas[areaId]) ej2State.areas[areaId] = { checked: false, m2: 0 };
  ej2State.areas[areaId].m2 = parseFloat(val) || 0;
  calcTotalM2();
}

function calcTotalM2() {
  const total = Object.values(ej2State.areas)
    .filter(a => a.checked)
    .reduce((s, a) => s + (a.m2 || 0), 0);
  const el = document.getElementById('ej2-total-m2');
  if (el) el.textContent = total.toFixed(1) + ' m²';
}

/* ── Parte C: Equipos ── */
function renderEj2Equipos(proj) {
  const el = document.getElementById('ej2-equipos');
  if (!el) return;

  el.innerHTML = `
    <table class="ej2-equip-table">
      <thead>
        <tr>
          <th>Equipo / Herramienta</th>
          <th>Cant.</th>
          <th>Costo Unitario $</th>
          <th>Total $</th>
        </tr>
      </thead>
      <tbody id="ej2-equip-tbody">
        ${ej2State.equipos.map((eq, idx) => renderEj2Row(eq, idx)).join('')}
      </tbody>
      <tfoot>
        <tr class="ej2-total-row">
          <td colspan="3" style="text-align:right;font-size:12px;color:var(--text-muted)">Total inversión en equipos</td>
          <td id="ej2-equip-total" style="font-family:monospace;color:#10b981">$ 0</td>
        </tr>
      </tfoot>
    </table>
    <button class="layout-btn" style="margin-top:10px" onclick="addEj2Row()">
      ＋ Agregar equipo
    </button>`;
  
  recalcEj2Total();
}

function renderEj2Row(eq, idx) {
  return `<tr id="ej2-row-${idx}">
    <td><input placeholder="Nombre del equipo" value="${eq.item}"
               oninput="updateEj2Row(${idx},'item',this.value)"></td>
    <td><input type="number" min="0" placeholder="0" value="${eq.cant}"
               oninput="updateEj2Row(${idx},'cant',this.value)" style="width:48px"></td>
    <td><input type="number" min="0" placeholder="0" value="${eq.costoU}"
               oninput="updateEj2Row(${idx},'costoU',this.value)" style="width:100px"></td>
    <td id="ej2-row-total-${idx}" style="font-family:monospace;color:#10b981;font-size:12px">$ 0</td>
  </tr>`;
}

function addEj2Row() {
  ej2State.equipos.push({ item: '', cant: '', costoU: '' });
  const tbody = document.getElementById('ej2-equip-tbody');
  if (!tbody) return;
  const idx = ej2State.equipos.length - 1;
  const tr = document.createElement('tr');
  tr.id = `ej2-row-${idx}`;
  tr.innerHTML = renderEj2Row(ej2State.equipos[idx], idx).replace(/^<tr[^>]*>/, '').replace(/<\/tr>$/, '');
  tbody.appendChild(tr);
}

function updateEj2Row(idx, campo, valor) {
  ej2State.equipos[idx][campo] = campo === 'item' ? valor : (parseFloat(valor) || 0);
  const t = (parseFloat(ej2State.equipos[idx].cant) || 0) * (parseFloat(ej2State.equipos[idx].costoU) || 0);
  const rowTotal = document.getElementById(`ej2-row-total-${idx}`);
  if (rowTotal) rowTotal.textContent = '$ ' + Math.round(t).toLocaleString('es-CO');
  recalcEj2Total();
}

function recalcEj2Total() {
  const total = ej2State.equipos.reduce((s, eq) => {
    const c = parseFloat(eq.cant)   || 0;
    const u = parseFloat(eq.costoU) || 0;
    return s + c * u;
  }, 0);
  const el = document.getElementById('ej2-equip-total');
  if (el) el.textContent = '$ ' + Math.round(total).toLocaleString('es-CO');
}

/* ── Envío a Google Sheets ── */
async function submitEjercicio2() {
  const btn    = document.getElementById('ej2-submit-btn');
  const msg    = document.getElementById('ej2-msg');
  const nombre = document.getElementById('ej2-nombre')?.value.trim();
  const grupo  = document.getElementById('ej2-grupo')?.value.trim();
  const desc   = document.getElementById('ej2-descripcion')?.value.trim();
  const obs    = document.getElementById('ej2-observaciones')?.value.trim();

  // Validación básica
  if (!nombre || !grupo || !desc) {
    showMsg(msg, 'error', '⚠️ Completa: nombre, grupo y descripción del proceso.');
    return;
  }

  const areasSeleccionadas = Object.entries(ej2State.areas)
    .filter(([, v]) => v.checked)
    .map(([id, v]) => {
      const proj = PROYECTOS[ej2Proyecto];
      const area = proj.layoutAreas.find(a => a.id === id);
      return `${area?.label || id}: ${v.m2 || 0} m²`;
    }).join(' | ');

  const equiposList = ej2State.equipos
    .filter(eq => eq.item)
    .map(eq => `${eq.item} x${eq.cant || 0} = $${Math.round((eq.cant || 0) * (eq.costoU || 0)).toLocaleString('es-CO')}`)
    .join(' | ');

  const invTotal = ej2State.equipos.reduce((s, eq) => {
    return s + (parseFloat(eq.cant) || 0) * (parseFloat(eq.costoU) || 0);
  }, 0);

  const payload = {
    hoja:          'Ejercicio2',
    timestamp:     new Date().toLocaleString('es-CO'),
    proyecto:      PROYECTOS[ej2Proyecto].nombre,
    estudiante:    nombre,
    grupo:         grupo,
    descripcion:   desc,
    areas:         areasSeleccionadas || 'Sin áreas seleccionadas',
    equipos:       equiposList        || 'Sin equipos',
    inversion:     Math.round(invTotal),
    observaciones: obs || ''
  };

  btn.disabled = true;
  btn.innerHTML = '⏳ Enviando...';

  try {
    await fetch(APPS_SCRIPT_URL_EJ2, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    showMsg(msg, 'success', '✅ ¡Ejercicio enviado correctamente a Google Sheets!');
    btn.innerHTML = '✅ Enviado';
  } catch (err) {
    showMsg(msg, 'error', '❌ Error de red. Intenta de nuevo o contacta al docente.');
    btn.disabled = false;
    btn.innerHTML = '📤 Enviar Ejercicio';
  }
}

function showMsg(el, type, text) {
  if (!el) return;
  el.className  = `submit-msg ${type}`;
  el.textContent = text;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetSubmitMsg() {
  const msg = document.getElementById('ej2-msg');
  const btn = document.getElementById('ej2-submit-btn');
  if (msg) { msg.style.display = 'none'; }
  if (btn) { btn.disabled = false; btn.innerHTML = '📤 Enviar Ejercicio 2'; }
}
