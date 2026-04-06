/* ============================================================
   puntos.js — Método de Puntos Ponderados (sección tutorial)
   ============================================================ */
const PP = { mapInitialized:false, lastScores:null, customRows:5 };

const PP_EXAMPLE = {
  factors:['Cercanía a proveedores','Costo mano de obra','Acceso a mercados','Infraestructura','Clima laboral'],
  weights:[0.30,0.25,0.20,0.15,0.10],
  scores:[[9,7,6],[8,7,5],[5,7,9],[6,8,9],[8,7,6]]
};

function initPuntosPonderados() {
  if(PP.mapInitialized) return;
  initMap('pp-map','pp');
  PP.mapInitialized=true;
  validatePPWeights();
}

function ppSwitchTab(tab) {
  ['ejemplo','calc'].forEach(t=>{
    document.getElementById(`pp-panel-${t}`).classList.toggle('active',t===tab);
    document.getElementById(`pp-tab-${t}`).classList.toggle('active',t===tab);
  });
  if(!PP.mapInitialized){ initMap('pp-map','pp'); PP.mapInitialized=true; }
  setTimeout(()=>{ if(MAP_STATES['pp']&&MAP_STATES['pp'].map) MAP_STATES['pp'].map.invalidateSize(); },300);
}

function calcularPuntos() {
  const log = document.getElementById('pp-steps-log');
  const resultRow = document.getElementById('pp-result-row');
  const banner = document.getElementById('pp-winner-banner');
  log.classList.add('visible'); log.innerHTML='';
  resultRow.style.display=''; banner.style.display='none';

  const cities = TUTORIAL_CITIES;
  const totals = [0,0,0];
  let html='<span class="log-step">▶ Calculando Puntos Ponderados…</span>\n';
  PP_EXAMPLE.factors.forEach((factor,fi)=>{
    const w=PP_EXAMPLE.weights[fi];
    PP_EXAMPLE.scores[fi].forEach((sc,ci)=>{ totals[ci]+=w*sc; });
    html+=`<span class="log-calc">  "${factor}" (W=${w}): `;
    html+=cities.map((c,ci)=>`${c.shortName}: ${w.toFixed(2)}×${PP_EXAMPLE.scores[fi][ci]}=${(w*PP_EXAMPLE.scores[fi][ci]).toFixed(3)}`).join(' | ');
    html+=`</span>\n`;
  });
  html+='\n<span class="log-step">━━ Puntajes Totales ━━</span>\n';
  cities.forEach((c,ci)=>{ html+=`<span class="log-result">  ${c.name}: ${totals[ci].toFixed(4)}</span>\n`; });
  log.innerHTML=html;

  ['bar','buc','bog'].forEach((id,ci)=>{ document.getElementById(`pp-res-${id}`).textContent=totals[ci].toFixed(4); });

  const winnerIdx=totals.indexOf(Math.max(...totals));
  banner.style.display='';
  banner.innerHTML=`🏆 Mejor opción: <strong>${cities[winnerIdx].name}</strong> — Puntaje: <strong>${totals[winnerIdx].toFixed(4)}</strong>`;
  updateMapMarkers('pp',totals,totals.map(s=>({score:s})));
  PP.lastScores=totals;
  setTimeout(()=>flyToWinner('pp',winnerIdx),600);
}

function resetPuntos() {
  document.getElementById('pp-result-row').style.display='none';
  document.getElementById('pp-winner-banner').style.display='none';
  document.getElementById('pp-steps-log').classList.remove('visible');
  resetMapMarkers('pp'); PP.lastScores=null;
}

function validatePPWeights() {
  const inputs=document.querySelectorAll('#pp-custom-tbody .weight-input');
  let sum=0; inputs.forEach(i=>{ sum+=parseFloat(i.value)||0; });
  sum=Math.round(sum*100)/100;
  const sumEl=document.getElementById('pp-custom-sum');
  const barEl=document.getElementById('pp-custom-bar');
  const warn=document.getElementById('pp-weight-warning');
  const warnSum=document.getElementById('pp-weight-sum');
  if(sumEl) sumEl.textContent=sum.toFixed(2);
  if(barEl){ barEl.style.width=Math.min(sum*100,100)+'%'; barEl.style.background=sum===1?'linear-gradient(90deg,#10b981,#34d399)':sum>1?'linear-gradient(90deg,#ef4444,#f87171)':'linear-gradient(90deg,#f59e0b,#fbbf24)'; }
  if(warn&&warnSum){ if(Math.abs(sum-1)>0.001){ warn.style.display='block'; warnSum.textContent=sum.toFixed(2); } else warn.style.display='none'; }
}

function calcularPuntosCustom() {
  const rows=Array.from(document.querySelectorAll('#pp-custom-tbody tr'));
  const weights=[],scores=[];
  let wSum=0;
  rows.forEach(row=>{
    const inp=row.querySelectorAll('input');
    if(inp.length<5) return;
    const w=parseFloat(inp[1].value)||0;
    weights.push(w); wSum+=w;
    scores.push([parseFloat(inp[2].value)||0,parseFloat(inp[3].value)||0,parseFloat(inp[4].value)||0]);
  });
  wSum=Math.round(wSum*100)/100;
  const panel=document.getElementById('pp-custom-result');
  if(Math.abs(wSum-1)>0.01){ panel.style.display='block'; panel.innerHTML=`<div style="color:#ef4444;font-weight:600;">⚠️ Los pesos suman ${wSum.toFixed(2)}, no 1.0.</div>`; return; }
  const totals=[0,0,0];
  scores.forEach((sc,fi)=>sc.forEach((s,ci)=>{ totals[ci]+=weights[fi]*s; }));
  const winnerIdx=totals.indexOf(Math.max(...totals));
  const cities=TUTORIAL_CITIES;
  const sorted=totals.map((s,i)=>({name:cities[i].name,score:s,idx:i})).sort((a,b)=>b.score-a.score);
  const icons=['🏆','🥈','🥉']; const colors=['#10b981','#f59e0b','#ef4444'];
  panel.style.display='block';
  panel.innerHTML='<div style="font-family:var(--font-display);font-weight:700;font-size:1rem;margin-bottom:12px;">📊 Resultados</div>'+
    sorted.map((item,pos)=>`<div class="popup-row"><span class="popup-label">${icons[pos]} ${item.name}</span><span class="popup-val" style="color:${colors[pos]}">${item.score.toFixed(4)}</span></div>`).join('')+
    `<div style="text-align:center;color:#10b981;font-weight:700;margin-top:12px">🏆 Mejor: ${cities[winnerIdx].name} (${totals[winnerIdx].toFixed(4)})</div>`;
  updateMapMarkers('pp',totals,totals.map(s=>({score:s})));
  setTimeout(()=>flyToWinner('pp',winnerIdx),600);
}

function addPPRow() {
  const tbody=document.getElementById('pp-custom-tbody');
  const tr=document.createElement('tr');
  tr.innerHTML=`<td><input class="cell-input factor-input" value="Nuevo Factor"/></td><td><input class="cell-input weight-input" type="number" step="0.05" min="0" max="1" value="0.00" onchange="validatePPWeights()"/></td><td><input class="cell-input score-input" type="number" min="1" max="10" value="5"/></td><td><input class="cell-input score-input" type="number" min="1" max="10" value="5"/></td><td><input class="cell-input score-input" type="number" min="1" max="10" value="5"/></td>`;
  tbody.appendChild(tr); validatePPWeights();
}
