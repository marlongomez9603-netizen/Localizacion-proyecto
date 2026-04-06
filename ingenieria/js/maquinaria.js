/* ============================================================
   maquinaria.js — Tabla de Maquinaria y Equipo (editable)
   ============================================================ */

let maqProyecto = 'suplementos';

function initMaquinaria() {
  document.querySelectorAll('.maq-proj-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      maqProyecto = btn.dataset.proj;
      document.querySelectorAll('.maq-proj-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMaquinaria();
    });
  });
  renderMaquinaria();
}

function renderMaquinaria() {
  const proj = PROYECTOS[maqProyecto];
  renderMaqTabla(proj);
  renderMaqSummary(proj);
}

function renderMaqTabla(proj) {
  const wrap = document.getElementById('maq-table-wrap');
  if (!wrap) return;

  // Clonar datos para que sean editables sin mutar la fuente
  if (!proj._maqEditable) {
    proj._maqEditable = proj.maquinaria.map(item => ({ ...item }));
  }
  const items = proj._maqEditable;

  wrap.innerHTML = `
    <table class="maq-table" id="maq-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Equipo / Herramienta</th>
          <th>Cant.</th>
          <th>Costo Unitario ($)</th>
          <th>Costo Total ($)</th>
          <th>Vida Útil</th>
          <th>Proveedor</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item, idx) => {
          const total = item.cant * item.costoU;
          return `
            <tr data-idx="${idx}">
              <td style="color:var(--text-dim);font-size:12px">${idx + 1}</td>
              <td style="font-weight:600">${item.item}</td>
              <td>
                <input type="number" min="0" value="${item.cant}"
                  oninput="updateMaqItem(${idx},'cant',this.value)"
                  style="width:56px">
              </td>
              <td>
                <input type="number" min="0" value="${item.costoU}"
                  oninput="updateMaqItem(${idx},'costoU',this.value)"
                  style="width:120px">
              </td>
              <td class="money" id="maq-total-${idx}">
                ${formatCOP(total)}
              </td>
              <td style="color:var(--text-muted);font-size:13px">${item.vida} años</td>
              <td style="color:var(--text-muted);font-size:12px">${item.proveedor}</td>
            </tr>`;
        }).join('')}
      </tbody>
      <tfoot>
        <tr class="total-row">
          <td colspan="4" style="text-align:right;padding-right:16px;font-size:13px;color:var(--text-muted)">
            INVERSIÓN TOTAL EN MAQUINARIA Y EQUIPO
          </td>
          <td class="money" id="maq-grand-total" colspan="3">
            ${formatCOP(calcTotalMaq(items))}
          </td>
        </tr>
      </tfoot>
    </table>`;
}

function updateMaqItem(idx, campo, valor) {
  const proj  = PROYECTOS[maqProyecto];
  const items = proj._maqEditable;
  items[idx][campo] = parseFloat(valor) || 0;

  const total = items[idx].cant * items[idx].costoU;
  const totalEl = document.getElementById(`maq-total-${idx}`);
  if (totalEl) totalEl.textContent = formatCOP(total);

  const grandEl = document.getElementById('maq-grand-total');
  if (grandEl) grandEl.textContent = formatCOP(calcTotalMaq(items));

  renderMaqSummary(proj);
}

function calcTotalMaq(items) {
  return items.reduce((sum, i) => sum + (i.cant * i.costoU), 0);
}

function renderMaqSummary(proj) {
  const items    = proj._maqEditable || proj.maquinaria;
  const total    = calcTotalMaq(items);
  const numItems = items.reduce((s, i) => s + i.cant, 0);
  const depAnual = items.reduce((s, i) => {
    const t = i.cant * i.costoU;
    return s + (i.vida > 0 ? t / i.vida : 0);
  }, 0);

  const sumEl = document.getElementById('maq-summary');
  if (!sumEl) return;

  sumEl.innerHTML = `
    <div class="maq-stat">
      <div class="maq-stat-label">💰 Inversión Total</div>
      <div class="maq-stat-val green">${formatCOP(total)}</div>
    </div>
    <div class="maq-stat">
      <div class="maq-stat-label">📦 Unidades Totales</div>
      <div class="maq-stat-val purple">${numItems}</div>
    </div>
    <div class="maq-stat">
      <div class="maq-stat-label">🔄 Depreciación Anual (SL)</div>
      <div class="maq-stat-val" style="color:var(--gold)">${formatCOP(Math.round(depAnual))}</div>
    </div>
    <div class="maq-stat">
      <div class="maq-stat-label">🏷️ Tipos de Equipos</div>
      <div class="maq-stat-val" style="color:var(--accent2)">${items.length}</div>
    </div>`;
}

/* ── Helpers ── */
function formatCOP(n) {
  return '$ ' + Math.round(n).toLocaleString('es-CO');
}
