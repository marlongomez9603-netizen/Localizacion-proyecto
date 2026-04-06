/* ============================================================
   ejercicio.js — Ejercicio 1: Actividad estudiantil
   Proyectos: (1) Suplementos Puerto Wilches | (2) Logística Shein
   Guarda respuestas en Google Sheets vía Apps Script
   ============================================================ */

// ╔══════════════════════════════════════════════════════════╗
// ║  CONFIGURACIÓN — URL de tu Google Apps Script Web App   ║
// ║  Reemplaza esta URL después de desplegar el script      ║
// ╚══════════════════════════════════════════════════════════╝
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbylCpOURp9QGVZqzoRviwryGkjlqX9iBTbgTPqGTYwZsgT-i1gFj5Ixv4YZ3m0IhbttNw/exec';

// ── Definición de proyectos ──────────────────────────────────
const PROYECTOS = {
  suplementos: {
    id: 'suplementos',
    nombre: 'Tienda de Suplementos Deportivos',
    emoji: '💊',
    ubicacion: 'Puerto Wilches, Santander',
    descripcion: 'Evalúa la mejor ubicación para abrir una tienda de suplementos deportivos que abastezca el área del Magdalena Medio santandereano.',
    ciudades: SUPLEMENTOS_CITIES,
    // Factores sugeridos para Puntos Ponderados
    factoresPP: [
      { nombre:'Flujo de clientes potenciales', peso:0.30 },
      { nombre:'Costo mensual del local',        peso:0.25 },
      { nombre:'Cercanía a centros deportivos',  peso:0.20 },
      { nombre:'Visibilidad y accesibilidad',    peso:0.15 },
      { nombre:'Seguridad de la zona',           peso:0.10 }
    ],
    // Costos orientativos para FO (millones COP)
    costosBG: {
      rows: ['Arriendo local/año','Adecuaciones','Transporte de inventario','Servicios públicos/año'],
      vals: [[18,28,10],[12,8,6],[15,25,30],[6,8,5]]
    },
    factoresFS: [
      { nombre:'Poder adquisitivo de la zona', peso:0.40 },
      { nombre:'Afluencia comercial',           peso:0.35 },
      { nombre:'Apoyo municipal',               peso:0.25 }
    ]
  },
  logistica: {
    id: 'logistica',
    nombre: 'Empresa de Logística E-commerce',
    emoji: '📦',
    ubicacion: 'Zona Magdalena Medio — Puente Sogamoso / Puerto Wilches / Barrancabermeja',
    descripcion: 'Evalúa la mejor ubicación en la zona del Magdalena Medio para instalar el centro de distribución de una empresa que entrega pedidos de plataformas digitales como Shein, AliExpress y Amazon. Compara Puente Sogamoso, Puerto Wilches y Barrancabermeja.',
    ciudades: LOGISTICA_CITIES,
    factoresPP: [
      { nombre:'Conectividad vial hacia clientes', peso:0.30 },
      { nombre:'Costo del espacio/bodega',          peso:0.25 },
      { nombre:'Cercanía a nodos de transporte',    peso:0.20 },
      { nombre:'Disponibilidad de personal',        peso:0.15 },
      { nombre:'Seguridad y orden público',         peso:0.10 }
    ],
    costosBG: {
      rows: ['Arriendo bodega/año (M$)','Adecuaciones iniciales (M$)','Personal operativo/año (M$)','Transporte y distribución/año (M$)'],
      vals: [
        [18, 28, 45],   // Pto.Sogamoso | P.Wilches | Barranc.
        [12, 15, 28],
        [30, 36, 60],
        [22, 28, 35]
      ]
    },
    factoresFS: [
      { nombre:'Conectividad logística regional', peso:0.40 },
      { nombre:'Infraestructura y servicios',     peso:0.35 },
      { nombre:'Apoyo institucional local',       peso:0.25 }
    ]
  }
};

// ── Estado del ejercicio ─────────────────────────────────────
const EJ = {
  studentName: '',
  project: null,  // 'suplementos' | 'logistica'
  ppMapInit: false,
  bgMapInit: false,
  ppScores: null,
  bgMPL:    null,
  bgK:      0.60,
  bgFO:     null,
  bgFS:     null,
  bgCriticalPass: [true, true, true]
};

// ── Mostrar/ocultar sección ejercicio ────────────────────────
function toggleEjercicio() {
  const sec = document.getElementById('ejercicio-section');
  const isHidden = sec.style.display === 'none' || sec.style.display === '';
  sec.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    setTimeout(() => sec.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
  }
}

// ── Selección de proyecto ────────────────────────────────────
function elegirProyecto(projectId) {
  const nameInput = document.getElementById('ej-student-name');
  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) {
    const errEl = document.getElementById('ej-name-error');
    if (errEl) errEl.style.display = 'block';
    if (nameInput) nameInput.focus();
    return;
  }
  const errEl = document.getElementById('ej-name-error');
  if (errEl) errEl.style.display = 'none';

  EJ.studentName = name;
  EJ.project = projectId;
  const proj = PROYECTOS[projectId];
  if (!proj) { alert('Proyecto no encontrado: ' + projectId); return; }

  // Marcar card seleccionada
  document.querySelectorAll('.proj-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('proj-card-' + projectId);
  if (card) card.classList.add('selected');

  // Mostrar contenido
  const content = document.getElementById('ej-project-content');
  if (!content) { alert('Error: bloque de contenido no encontrado'); return; }
  content.style.display = 'block';

  // Título del proyecto
  const titleEl = document.getElementById('ej-project-title');
  const descEl  = document.getElementById('ej-project-desc');
  if (titleEl) titleEl.innerHTML = proj.emoji + ' ' + proj.nombre + '<br><span style="font-size:.9rem;font-weight:400;color:var(--text-secondary)">' + proj.ubicacion + '</span>';
  if (descEl)  descEl.textContent = proj.descripcion;

  // Renderizar tablas
  try { renderEjPPTable(proj); }       catch(e){ console.error('renderEjPPTable:', e); }
  try { renderEjBGCriticalTable(proj); } catch(e){ console.error('renderEjBGCritical:', e); }
  try { renderEjBGFOTable(proj); }     catch(e){ console.error('renderEjBGFOTable:', e); }
  try { renderEjBGFSTable(proj); }     catch(e){ console.error('renderEjBGFSTable:', e); }

  // Inicializar mapas
  try { initEjMaps(proj); } catch(e){ console.error('initEjMaps:', e); }

  // Resetear resultados previos
  EJ.ppScores = null; EJ.bgMPL = null; EJ.bgFO = null; EJ.bgFS = null;
  EJ.bgCriticalPass = [true, true, true]; EJ.bgK = 0.60;

  const submitSec = document.getElementById('ej-submit-section');
  const submitRes = document.getElementById('ej-submit-result');
  const kDisp     = document.getElementById('ej-k-value-display');
  const kSlider   = document.getElementById('ej-k-slider');
  const mplSec    = document.getElementById('ej-mpl-section');

  if (submitSec) submitSec.style.display = 'none';
  if (submitRes) submitRes.style.display = 'none';
  if (kDisp)    kDisp.textContent = '0.60';
  if (kSlider)  kSlider.value = 0.60;
  if (mplSec)   mplSec.style.display = 'none';

  // Scroll al contenido
  setTimeout(() => content.scrollIntoView({ behavior:'smooth', block:'start' }), 300);
}

// ── Render tablas del ejercicio ──────────────────────────────

function renderEjPPTable(proj) {
  const cities = proj.ciudades;
  const thead = document.getElementById('ej-pp-thead');
  const tbody = document.getElementById('ej-pp-tbody');

  thead.innerHTML = `<tr>
    <th>Factor</th><th>Peso (W)<br><small>suma=1.0</small></th>
    ${cities.map(c=>`<th>${c.icon} ${c.shortName}</th>`).join('')}
  </tr>`;

  tbody.innerHTML = proj.factoresPP.map((f, fi) => `
    <tr>
      <td><input class="cell-input factor-input" value="${f.nombre}" id="ej-pp-f${fi}"/></td>
      <td><input class="cell-input weight-input" type="number" step="0.05" min="0" max="1" value="${f.peso}" id="ej-pp-w${fi}" onchange="validateEjPPWeights()"/></td>
      ${cities.map((_,ci)=>`<td><input class="cell-input score-input" type="number" min="1" max="10" value="5" id="ej-pp-s${fi}-${ci}"/></td>`).join('')}
    </tr>`).join('');

  validateEjPPWeights();
}

function renderEjBGCriticalTable(proj) {
  const cities = proj.ciudades;
  const thead = document.getElementById('ej-bg-critical-thead');
  const tbody = document.getElementById('ej-bg-critical-tbody');

  // Encabezado con nombres de ciudades
  if (thead) thead.innerHTML = `<tr>
    <th>Factor Crítico</th>
    ${cities.map(c => `<th>${c.icon} ${c.shortName}</th>`).join('')}
  </tr>`;

  tbody.innerHTML = `
    <tr><td>Existe infraestructura básica (agua, luz)</td>${cities.map((_,ci)=>`<td class="checkbox-cell"><label class="toggle-switch"><input type="checkbox" class="ej-critical-check" data-city="${ci}" checked/><span class="toggle-slider"></span></label></td>`).join('')}</tr>
    <tr><td>Acceso vial al lugar</td>${cities.map((_,ci)=>`<td class="checkbox-cell"><label class="toggle-switch"><input type="checkbox" class="ej-critical-check" data-city="${ci}" checked/><span class="toggle-slider"></span></label></td>`).join('')}</tr>
    <tr><td>Disponibilidad legal del espacio</td>${cities.map((_,ci)=>`<td class="checkbox-cell"><label class="toggle-switch"><input type="checkbox" class="ej-critical-check" data-city="${ci}" checked/><span class="toggle-slider"></span></label></td>`).join('')}</tr>
  `;
  // Listeners
  setTimeout(() => {
    document.querySelectorAll('.ej-critical-check').forEach(chk =>
      chk.addEventListener('change', () => evalEjCritical()));
  }, 100);
}

function renderEjBGFOTable(proj) {
  const cities = proj.ciudades;
  const thead = document.getElementById('ej-bg-fo-thead');
  const tbody = document.getElementById('ej-bg-fo-tbody');
  const {rows, vals} = proj.costosBG;

  // Encabezado con nombres de ciudades
  if (thead) thead.innerHTML = `<tr>
    <th>Concepto (M$)</th>
    ${cities.map(c => `<th>${c.icon} ${c.shortName}</th>`).join('')}
  </tr>`;

  tbody.innerHTML = rows.map((rowName, ri) => `
    <tr>
      <td>${rowName}</td>
      ${cities.map((_,ci)=>`<td><input class="cell-input cost-input" type="number" value="${vals[ri][ci]}" id="ej-fo-${ri}-${ci}"/></td>`).join('')}
    </tr>`).join('') +
  `<tr class="total-row"><td><strong>Costo Total (Cᵢ)</strong></td>${cities.map((_,ci)=>`<td id="ej-fo-total-${ci}"><strong>—</strong></td>`).join('')}</tr>
   <tr class="fo-row" id="ej-fo-result-row" style="display:none"><td><strong>FOᵢ</strong></td>${cities.map((_,ci)=>`<td id="ej-fo-val-${ci}" class="result-cell"></td>`).join('')}</tr>`;
}

function renderEjBGFSTable(proj) {
  const cities = proj.ciudades;
  const thead = document.getElementById('ej-bg-fs-thead');
  const tbody = document.getElementById('ej-bg-fs-tbody');

  // Encabezado con nombres de ciudades
  if (thead) thead.innerHTML = `<tr>
    <th>Factor Subjetivo</th>
    <th>Peso (W)<br><small>suma=1.0</small></th>
    ${cities.map(c => `<th>${c.icon} ${c.shortName}</th>`).join('')}
  </tr>`;
  tbody.innerHTML = proj.factoresFS.map((f, fi) => `
    <tr>
      <td>${f.nombre}</td>
      <td><input class="cell-input weight-input fs-ej-weight" type="number" step="0.05" min="0" max="1" value="${f.peso}" id="ej-fs-w${fi}" onchange="validateEjFSWeights()"/></td>
      ${cities.map((_,ci)=>`<td><input class="cell-input score-input" type="number" min="1" max="10" value="5" id="ej-fs-s${fi}-${ci}"/></td>`).join('')}
    </tr>`).join('') +
  `<tr class="fs-result-row" id="ej-fs-result-row" style="display:none">
    <td><strong>FSᵢ</strong></td><td>—</td>
    ${cities.map((_,ci)=>`<td id="ej-fs-val-${ci}" class="result-cell"></td>`).join('')}
  </tr>`;
  validateEjFSWeights();
}

// ── Inicializar mapas del ejercicio ──────────────────────────
function initEjMaps(proj) {
  const ppKey = 'ej-pp', bgKey = 'ej-bg';
  // Destruir mapas anteriores si existen
  if (MAP_STATES[ppKey] && MAP_STATES[ppKey].map) {
    MAP_STATES[ppKey].map.remove(); delete MAP_STATES[ppKey];
  }
  if (MAP_STATES[bgKey] && MAP_STATES[bgKey].map) {
    MAP_STATES[bgKey].map.remove(); delete MAP_STATES[bgKey];
  }
  EJ.ppMapInit = false; EJ.bgMapInit = false;

  setTimeout(() => {
    initMap('ej-pp-map', ppKey, proj.ciudades); EJ.ppMapInit = true;
    initMap('ej-bg-map', bgKey, proj.ciudades); EJ.bgMapInit = true;
  }, 400);
}

// ── Cálculo PP del ejercicio ────────────────────────────────
function validateEjPPWeights() {
  const proj = PROYECTOS[EJ.project]; if (!proj) return;
  let sum = 0;
  proj.factoresPP.forEach((_, fi) => { sum += parseFloat(document.getElementById(`ej-pp-w${fi}`)?.value)||0; });
  sum = Math.round(sum*100)/100;
  const barEl = document.getElementById('ej-pp-weight-bar');
  const sumEl = document.getElementById('ej-pp-weight-sum');
  if(barEl){ barEl.style.width=Math.min(sum*100,100)+'%'; barEl.style.background=sum===1?'linear-gradient(90deg,#10b981,#34d399)':sum>1?'linear-gradient(90deg,#ef4444,#f87171)':'linear-gradient(90deg,#f59e0b,#fbbf24)'; }
  if(sumEl) sumEl.textContent=sum.toFixed(2);
}

function calcularEjPP() {
  const proj = PROYECTOS[EJ.project]; if (!proj) return;
  const cities = proj.ciudades;
  const n = proj.factoresPP.length;
  let wSum = 0, totals = Array(cities.length).fill(0);

  for (let fi = 0; fi < n; fi++) {
    const w = parseFloat(document.getElementById(`ej-pp-w${fi}`)?.value)||0;
    wSum += w;
    for (let ci = 0; ci < cities.length; ci++) {
      const s = parseFloat(document.getElementById(`ej-pp-s${fi}-${ci}`)?.value)||0;
      totals[ci] += w * s;
    }
  }
  wSum = Math.round(wSum*100)/100;

  const resultEl = document.getElementById('ej-pp-result');
  if (Math.abs(wSum - 1) > 0.01) {
    resultEl.style.display='block';
    resultEl.innerHTML=`<span style="color:#ef4444">⚠️ Los pesos suman ${wSum.toFixed(2)}, no 1.0. Ajústalos.</span>`;
    return;
  }

  EJ.ppScores = totals;
  const maxS = Math.max(...totals), winnerIdx = totals.indexOf(maxS);
  const ri=['🏆','🥈','🥉'],rc=['#10b981','#f59e0b','#ef4444'];
  const sorted = totals.map((s,i)=>({i,s})).sort((a,b)=>b.s-a.s);

  resultEl.style.display='block';
  resultEl.innerHTML=`<div style="font-family:var(--font-display);font-weight:700;margin-bottom:10px">📊 Resultados Puntos Ponderados</div>`+
    sorted.map((item,pos)=>`<div class="popup-row"><span class="popup-label">${ri[pos]} ${cities[item.i].icon} ${cities[item.i].name}</span><span class="popup-val" style="color:${rc[pos]}">${item.s.toFixed(4)}</span></div>`).join('')+
    `<div class="winner-banner" style="margin-top:12px">🏆 Mejor: <strong>${cities[winnerIdx].name}</strong> (${maxS.toFixed(4)})</div>`;

  updateMapMarkers('ej-pp', totals, totals.map(s=>({score:s})));
  setTimeout(()=>flyToWinner('ej-pp', winnerIdx), 600);
  checkEjComplete();
}

// ── Cálculo B&G del ejercicio ────────────────────────────────
function evalEjCritical() {
  const proj = PROYECTOS[EJ.project]; if (!proj) return;
  const pass = [true, true, true];
  document.querySelectorAll('.ej-critical-check').forEach(chk => { if(!chk.checked) pass[parseInt(chk.dataset.city)]=false; });
  EJ.bgCriticalPass = pass;
  pass.forEach((p,idx) => p ? restoreCity('ej-bg', idx) : eliminateCity('ej-bg', idx));
  const resultEl = document.getElementById('ej-bg-critical-result');
  const elim = proj.ciudades.filter((_,i)=>!pass[i]).map(c=>c.name);
  const act  = proj.ciudades.filter((_,i)=> pass[i]).map(c=>c.name);
  resultEl.style.display='block';
  resultEl.innerHTML = elim.length===0
    ? '✅ Todas las ciudades cumplen los factores críticos.'
    : `✅ Pasan: <strong>${act.join(', ')}</strong> &nbsp;|&nbsp; ❌ Eliminadas: <strong style="color:#ef4444">${elim.join(', ')}</strong>`;
}

function validateEjFSWeights() {
  let sum=0; document.querySelectorAll('.fs-ej-weight').forEach(i=>{ sum+=parseFloat(i.value)||0; });
  sum=Math.round(sum*100)/100;
  const sumEl=document.getElementById('ej-fs-weight-sum'); if(sumEl) sumEl.textContent=sum.toFixed(2);
  const barEl=document.getElementById('ej-fs-weight-bar');
  if(barEl){ barEl.style.width=Math.min(sum*100,100)+'%'; barEl.style.background=Math.abs(sum-1)<0.001?'linear-gradient(90deg,#10b981,#34d399)':sum>1?'linear-gradient(90deg,#ef4444,#f87171)':'linear-gradient(90deg,#f59e0b,#fbbf24)'; }
}

function calcularEjFO() {
  const proj = PROYECTOS[EJ.project]; if (!proj) return;
  const cities = proj.ciudades;
  const nRows = proj.costosBG.rows.length;
  const costs = Array(cities.length).fill(0);

  for (let ri = 0; ri < nRows; ri++) {
    for (let ci = 0; ci < cities.length; ci++) {
      costs[ci] += parseFloat(document.getElementById(`ej-fo-${ri}-${ci}`)?.value)||0;
    }
  }

  cities.forEach((_,ci) => {
    const el = document.getElementById(`ej-fo-total-${ci}`);
    if(el) el.innerHTML=`<strong>$${costs[ci].toLocaleString('es-CO')}M</strong>`;
  });

  const inv = costs.map((c,i)=>EJ.bgCriticalPass[i]&&c>0?1/c:0);
  const sumI = inv.reduce((a,b)=>a+b,0);
  EJ.bgFO = inv.map((v,i)=>!EJ.bgCriticalPass[i]||costs[i]===0?null:v/sumI);

  document.getElementById('ej-fo-result-row').style.display='';
  cities.forEach((_,ci)=>{ const el=document.getElementById(`ej-fo-val-${ci}`); if(el) el.textContent=EJ.bgFO[ci]!==null?EJ.bgFO[ci].toFixed(4):'N/A'; });
  updateMapMarkers('ej-bg', EJ.bgFO, EJ.bgFO.map((fo,i)=>({fo,cost:costs[i]})));
}

function calcularEjFS() {
  const proj = PROYECTOS[EJ.project]; if (!proj) return;
  const cities = proj.ciudades;
  const n = proj.factoresFS.length;
  const FS = Array(cities.length).fill(0);
  let wSum = 0;

  for (let fi = 0; fi < n; fi++) {
    const w = parseFloat(document.getElementById(`ej-fs-w${fi}`)?.value)||0;
    wSum += w;
    for (let ci = 0; ci < cities.length; ci++) {
      const s = parseFloat(document.getElementById(`ej-fs-s${fi}-${ci}`)?.value)||0;
      FS[ci] += w * (s / 10);
    }
  }

  EJ.bgFS = FS.map((fs,i)=>EJ.bgCriticalPass[i]?fs:null);

  document.getElementById('ej-fs-result-row').style.display='';
  cities.forEach((_,ci)=>{ const el=document.getElementById(`ej-fs-val-${ci}`); if(el) el.textContent=EJ.bgFS[ci]!==null?EJ.bgFS[ci].toFixed(4):'N/A'; });
  updateMapMarkers('ej-bg', EJ.bgFS, EJ.bgFS.map(fs=>({fs})));
  document.getElementById('ej-mpl-section').style.display='block';
  checkEjComplete();
}

function onEjKChange() {
  const K = parseFloat(document.getElementById('ej-k-slider').value);
  EJ.bgK = K;
  document.getElementById('ej-k-value-display').textContent = K.toFixed(2);
  if (EJ.bgFO && EJ.bgFS) calcularEjMPL();
}

function calcularEjMPL() {
  if (!EJ.bgFO || !EJ.bgFS) { alert('Primero calcula FO y FS'); return; }
  const proj = PROYECTOS[EJ.project]; const cities = proj.ciudades;
  const K=EJ.bgK, K1=1-K;
  const MPL = cities.map((_,ci)=>(!EJ.bgCriticalPass[ci]||EJ.bgFO[ci]===null||EJ.bgFS[ci]===null)?null:K*EJ.bgFO[ci]+K1*EJ.bgFS[ci]);
  EJ.bgMPL = MPL;

  const active = MPL.filter(v=>v!==null);
  const maxM = Math.max(...active), winnerIdx = MPL.indexOf(maxM);
  const ri=['🏆','🥈','🥉'], rc=['#10b981','#f59e0b','#ef4444'];
  const sorted = MPL.map((m,i)=>({i,m})).filter(x=>x.m!==null).sort((a,b)=>b.m-a.m);

  const resultEl = document.getElementById('ej-mpl-result');
  resultEl.style.display='block';
  resultEl.innerHTML=`<div style="font-family:var(--font-display);font-weight:700;margin-bottom:10px">📊 MPL (K=${K.toFixed(2)})</div>`+
    sorted.map((item,pos)=>`<div class="popup-row"><span class="popup-label">${ri[pos]} ${cities[item.i].icon} ${cities[item.i].name}</span><span class="popup-val" style="color:${rc[pos]}">${item.m.toFixed(4)}</span></div>`).join('')+
    `<div class="winner-banner" style="margin-top:12px">🏆 Mejor: <strong>${cities[winnerIdx].name}</strong> (MPL=${maxM.toFixed(4)})<br><small>MPL = ${K.toFixed(2)}·FO + ${K1.toFixed(2)}·FS</small></div>`;

  updateMapMarkers('ej-bg', MPL, MPL.map((mpl,i)=>({mpl,fo:EJ.bgFO[i],fs:EJ.bgFS[i]})));
  setTimeout(()=>flyToWinner('ej-bg', winnerIdx), 600);
  checkEjComplete();
}

// ── Verificar si el ejercicio está completo ──────────────────
function checkEjComplete() {
  if (EJ.ppScores && EJ.bgMPL) {
    document.getElementById('ej-submit-section').style.display='block';
    document.getElementById('ej-submit-section').scrollIntoView({ behavior:'smooth', block:'center' });
  }
}

// ── Envío a Google Sheets ────────────────────────────────────
async function submitEjercicio() {
  const proj = PROYECTOS[EJ.project]; if (!proj) return;
  const cities = proj.ciudades;
  const btn = document.getElementById('ej-submit-btn');
  const resultEl = document.getElementById('ej-submit-result');

  btn.disabled=true;
  btn.textContent='⏳ Enviando…';

  // Construir payload
  const ppWinnerIdx = EJ.ppScores.indexOf(Math.max(...EJ.ppScores));
  const bgWinnerIdx = EJ.bgMPL ? EJ.bgMPL.indexOf(Math.max(...EJ.bgMPL.filter(v=>v!==null))) : null;

  const payload = {
    timestamp:     new Date().toLocaleString('es-CO'),
    estudiante:    EJ.studentName,
    proyecto:      proj.nombre,
    ubicacion:     proj.ubicacion,
    // Puntos Ponderados
    pp_ciudad1:    cities[0].name, pp_score1: EJ.ppScores[0]?.toFixed(4),
    pp_ciudad2:    cities[1].name, pp_score2: EJ.ppScores[1]?.toFixed(4),
    pp_ciudad3:    cities[2].name, pp_score3: EJ.ppScores[2]?.toFixed(4),
    pp_ganador:    cities[ppWinnerIdx]?.name,
    // Brown & Gibson
    bg_K:          EJ.bgK.toFixed(2),
    bg_fo1: EJ.bgFO?.[0]?.toFixed(4)||'N/A', bg_fo2: EJ.bgFO?.[1]?.toFixed(4)||'N/A', bg_fo3: EJ.bgFO?.[2]?.toFixed(4)||'N/A',
    bg_fs1: EJ.bgFS?.[0]?.toFixed(4)||'N/A', bg_fs2: EJ.bgFS?.[1]?.toFixed(4)||'N/A', bg_fs3: EJ.bgFS?.[2]?.toFixed(4)||'N/A',
    bg_mpl1: EJ.bgMPL?.[0]?.toFixed(4)||'N/A', bg_mpl2: EJ.bgMPL?.[1]?.toFixed(4)||'N/A', bg_mpl3: EJ.bgMPL?.[2]?.toFixed(4)||'N/A',
    bg_ganador: bgWinnerIdx !== null ? cities[bgWinnerIdx]?.name : 'N/A'
  };

  try {
    const response = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });
    const data = await response.json();

    if (data.result === 'success') {
      resultEl.style.display='block';
      resultEl.className='submit-result success';
      resultEl.innerHTML=`✅ <strong>¡Respuestas enviadas exitosamente!</strong><br>Tus resultados han sido guardados en el registro del curso.<br><small>Estudiante: ${EJ.studentName} | Proyecto: ${proj.nombre}</small>`;
      btn.textContent='✅ Enviado';
    } else {
      throw new Error(data.error || 'Error desconocido');
    }
  } catch(err) {
    // Si la URL no está configurada, mostrar resumen local
    resultEl.style.display='block';
    if (SHEETS_URL.includes('REEMPLAZA')) {
      resultEl.className='submit-result warning';
      resultEl.innerHTML=`⚠️ <strong>Google Sheets no configurado.</strong><br>El profesor debe configurar la URL del Apps Script.<br><a href="setup/INSTRUCCIONES.md" target="_blank">Ver instrucciones de configuración</a><br><br>
        <strong>Tus respuestas (guardar manualmente):</strong><br>
        <pre style="font-size:.75rem;text-align:left;background:rgba(0,0,0,.3);padding:10px;border-radius:8px;overflow:auto">${JSON.stringify(payload,null,2)}</pre>`;
    } else {
      resultEl.className='submit-result error';
      resultEl.innerHTML=`❌ Error al enviar: ${err.message}. Intenta de nuevo o contacta al profesor.`;
    }
  }
  btn.disabled = false;
  btn.textContent = '📤 Enviar Respuestas';
}
