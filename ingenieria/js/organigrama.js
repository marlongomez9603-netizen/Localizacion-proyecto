/* ============================================================
   organigrama.js — Árbol de cargos interactivo
   ============================================================ */

let orgProyecto     = 'suplementos';
let orgNodoSelecto  = null;

function initOrganigrama() {
  document.querySelectorAll('.org-proj-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      orgProyecto = btn.dataset.proj;
      document.querySelectorAll('.org-proj-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderOrganigrama();
    });
  });
  renderOrganigrama();
}

function renderOrganigrama() {
  const proj = PROYECTOS[orgProyecto];
  const container = document.getElementById('org-tree-container');
  if (!container) return;

  container.innerHTML = '';
  const treeEl = buildNodeEl(proj.organigrama, true);
  container.appendChild(treeEl);

  // Ocultar detalle al cambiar proyecto
  hideOrgDetail();
}

/* ── Construcción recursiva del árbol ── */
function buildNodeEl(nodo, isRoot = false) {
  const col = document.createElement('div');
  col.className = 'org-node-col';

  /* Tarjeta */
  const card = document.createElement('div');
  card.className = 'org-card' + (isRoot ? ' org-root-card' : '');
  card.style.setProperty('--node-color', nodo.color);
  card.dataset.nodeid = nodo.id;
  card.innerHTML = `<div class="org-card-title">${nodo.titulo}</div>`;
  card.addEventListener('click', () => selectNodo(nodo));
  col.appendChild(card);

  /* Hijos */
  if (nodo.children && nodo.children.length > 0) {
    // Conector vertical hacia abajo
    const vConn = document.createElement('div');
    vConn.className = 'org-connector-v';
    col.appendChild(vConn);

    if (nodo.children.length === 1) {
      // Un solo hijo → directo
      col.appendChild(buildNodeEl(nodo.children[0]));
    } else {
      // Múltiples hijos → fila horizontal
      const row = document.createElement('div');
      row.className = 'org-children-row';
      row.style.cssText = 'display:flex;justify-content:center;gap:0;align-items:flex-start;position:relative';

      nodo.children.forEach((hijo, idx) => {
        const childWrapper = document.createElement('div');
        childWrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:0 8px;position:relative';

        // Línea horizontal superior (T) — CSS trick via pseudo o div
        const hLine = document.createElement('div');
        hLine.style.cssText = `
          width: 100%; height: 24px;
          border-top: 2px solid rgba(255,255,255,.12);
          border-left:  ${idx === 0                            ? '2px solid rgba(255,255,255,.12)' : 'none'};
          border-right: ${idx === nodo.children.length - 1     ? '2px solid rgba(255,255,255,.12)' : 'none'};
          border-radius: ${idx === 0 ? '8px 0 0 0' : idx === nodo.children.length - 1 ? '0 8px 0 0' : '0'};
        `;
        childWrapper.appendChild(hLine);

        // Bajada vertical central
        if (nodo.children.length > 1) {
          const vDown = document.createElement('div');
          vDown.style.cssText = 'width:2px;height:12px;background:rgba(255,255,255,.12)';
          childWrapper.appendChild(vDown);
        }

        childWrapper.appendChild(buildNodeEl(hijo));
        row.appendChild(childWrapper);
      });

      col.appendChild(row);
    }
  }

  return col;
}

/* ── Selección de nodo ── */
function selectNodo(nodo) {
  // Deseleccionar anterior
  document.querySelectorAll('.org-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.org-card[data-nodeid="${nodo.id}"]`);
  if (card) card.classList.add('selected');

  orgNodoSelecto = nodo.id;
  showOrgDetail(nodo);
}

function showOrgDetail(nodo) {
  const detail = document.getElementById('org-detail');
  if (!detail) return;

  detail.style.display = 'block';
  detail.innerHTML = `
    <div class="org-det-header">
      <div style="width:48px;height:48px;border-radius:12px;
                  background:${nodo.color}22;border:2px solid ${nodo.color};
                  display:flex;align-items:center;justify-content:center;
                  font-size:22px;flex-shrink:0">
        👤
      </div>
      <div>
        <div class="org-det-title" style="border-left:4px solid ${nodo.color};padding-left:10px">
          ${nodo.titulo}
        </div>
        <div class="org-det-badge" style="background:${nodo.color}22;color:${nodo.color};border:1px solid ${nodo.color}55;margin-top:6px">
          Clic para conocer el cargo
        </div>
      </div>
    </div>

    <div class="org-det-section">
      <div class="org-det-section-title">📋 Funciones principales</div>
      <div class="org-det-text">${nodo.descripcion}</div>
    </div>

    <div class="org-det-section" style="margin-top:14px;padding:14px;background:rgba(255,255,255,.04);border-radius:8px;border:1px solid rgba(255,255,255,.07)">
      <div class="org-det-section-title">🎓 Perfil requerido</div>
      <div class="org-det-text">${nodo.perfil}</div>
    </div>

    ${nodo.children && nodo.children.length > 0 ? `
      <div class="org-det-section" style="margin-top:14px">
        <div class="org-det-section-title">👥 Cargos subordinados (${nodo.children.length})</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
          ${nodo.children.map(h => `
            <span class="chip" style="background:${h.color}22;color:${h.color};border-color:${h.color}44;cursor:pointer"
                  onclick="selectNodo(${JSON.stringify(h).split('"').join("'")})">
              ${h.titulo}
            </span>`).join('')}
        </div>
      </div>` : ''}`;
}

function hideOrgDetail() {
  const detail = document.getElementById('org-detail');
  if (detail) detail.style.display = 'none';
  orgNodoSelecto = null;
}
