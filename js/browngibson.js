/* ============================================================
   browngibson.js — Método Brown & Gibson (sección tutorial)
   ============================================================ */
const BG={mapInitialized:false,criticalPass:[true,true,true],FO:[null,null,null],FS:[null,null,null],MPL:[null,null,null],K:0.60,foCalculated:false,fsCalculated:false,lastWinnerIdx:null};
const BG_NAMES=['Barrancabermeja','Bucaramanga','Bogotá'];
const BG_ICONS=['🏭','🏙️','🏛️'];

function initBrownGibson(){
  if(BG.mapInitialized) return;
  initMap('bg-map','bg');
  BG.mapInitialized=true;
  document.querySelectorAll('.critical-check').forEach(chk=>chk.addEventListener('change',onCriticalChange));
}

function bgGoToStage(num){
  for(let i=1;i<=4;i++){
    document.getElementById(`bg-stage-${i}`).classList.toggle('active',i===num);
    document.getElementById(`bg-stage-indicator-${i}`).classList.toggle('active',i===num);
  }
  if(!BG.mapInitialized) initBrownGibson();
  const hints={1:'Los toggles controlan el mapa',2:'Ingresa costos → mapa muestra FO',3:'Califica factores cualitativos',4:'Mueve el slider K → mapa en tiempo real'};
  const h=document.getElementById('bg-map-hint'); if(h) h.textContent=hints[num]||'';
  setTimeout(()=>{ if(MAP_STATES['bg']&&MAP_STATES['bg'].map) MAP_STATES['bg'].map.invalidateSize(); },300);
}

function onCriticalChange(){ evalCritical(true); }

function evalCritical(silent=false){
  const newPass=[true,true,true];
  document.querySelectorAll('.critical-check').forEach(chk=>{ if(!chk.checked) newPass[parseInt(chk.dataset.city)]=false; });
  BG.criticalPass=newPass;
  if(!BG.mapInitialized) initBrownGibson();
  newPass.forEach((pass,idx)=>{ if(!pass) eliminateCity('bg',idx); else restoreCity('bg',idx); });
  updateBGCriticalOverlay(newPass);
  if(!silent){
    const r=document.getElementById('bg-critical-result'); r.style.display='block';
    const elim=BG_NAMES.filter((_,i)=>!newPass[i]);
    const act=BG_NAMES.filter((_,i)=>newPass[i]);
    if(!elim.length){ r.style.cssText='background:rgba(16,185,129,.08);border-color:rgba(16,185,129,.3);display:block'; r.innerHTML='✅ Las 3 ciudades cumplen todos los factores críticos.'; }
    else if(!act.length){ r.style.cssText='background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.3);display:block'; r.innerHTML='❌ Ninguna ciudad cumple. Revisa los requisitos.'; }
    else{ r.style.cssText='background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.3);display:block'; r.innerHTML=`✅ Pasan: <strong>${act.join(', ')}</strong><br>❌ Eliminadas: <strong style="color:#ef4444">${elim.join(', ')}</strong>`; }
  }
}

function updateBGCriticalOverlay(passMask){
  const el=document.getElementById('bg-overlay-items'); if(!el) return;
  const ot=document.getElementById('bg-overlay-title'); if(ot) ot.textContent='Etapa 1: Factores Críticos';
  el.innerHTML=passMask.map((pass,idx)=>`<div class="overlay-item ${pass?'neutral':'eliminated'}"><span class="rank-dot" style="background:${pass?'#00d4ff':'#6b7280'}"></span>${pass?'✅':'❌'} ${BG_ICONS[idx]} ${BG_NAMES[idx]}</div>`).join('');
}

function calcularFO(){
  const rows=document.querySelectorAll('#bg-fo-table tbody tr:not(.total-row):not(.fo-row)');
  const costs=[0,0,0];
  rows.forEach(row=>{ row.querySelectorAll('.cost-input').forEach((inp,ci)=>{ costs[ci]+=parseFloat(inp.value)||0; }); });
  ['fo-total-0','fo-total-1','fo-total-2'].forEach((id,ci)=>{ const el=document.getElementById(id); if(el) el.innerHTML=`<strong>$${costs[ci].toLocaleString('es-CO')}M</strong>`; });
  const inv=costs.map((c,i)=>BG.criticalPass[i]&&c>0?1/c:0);
  const sumI=inv.reduce((a,b)=>a+b,0);
  BG.FO=inv.map((v,i)=>!BG.criticalPass[i]||costs[i]===0?null:v/sumI);
  BG.foCalculated=true;
  document.getElementById('fo-result-row').style.display='';
  ['fo-val-0','fo-val-1','fo-val-2'].forEach((id,ci)=>{ const el=document.getElementById(id); if(el) el.textContent=BG.FO[ci]!==null?BG.FO[ci].toFixed(4):'N/A'; });
  let html=`<span class="log-step">▶ Factores Objetivos (FO)</span>\n<span class="log-calc">  FO_i = (1/Cᵢ) / Σ(1/Cⱼ)</span>\n\n`;
  BG_NAMES.forEach((n,ci)=>{ html+=BG.criticalPass[ci]?`<span class="log-calc">  ${n}: 1/${costs[ci]}=${(1/costs[ci]).toFixed(6)}</span>\n`:`<span class="log-calc">  ${n}: ELIMINADA</span>\n`; });
  html+=`<span class="log-calc">\n  Σ inversos: ${sumI.toFixed(6)}</span>\n`;
  BG_NAMES.forEach((n,ci)=>{ if(BG.FO[ci]!==null) html+=`<span class="log-result">  FO(${n}) = ${BG.FO[ci].toFixed(4)}</span>\n`; });
  const log=document.getElementById('bg-fo-steps'); log.classList.add('visible'); log.innerHTML=html;
  updateMapMarkers('bg',BG.FO,BG.FO.map((fo,i)=>({fo,cost:costs[i]})));
  const ot=document.getElementById('bg-overlay-title'); if(ot) ot.textContent='Etapa 2: FO';
  document.getElementById('bg-btn-to-3').style.display='';
}

function validateFSWeights(){
  let sum=0; document.querySelectorAll('.fs-weight').forEach(i=>{ sum+=parseFloat(i.value)||0; });
  sum=Math.round(sum*100)/100;
  const sumEl=document.getElementById('fs-weight-sum'); if(sumEl) sumEl.textContent=sum.toFixed(2);
  const barEl=document.getElementById('fs-weight-bar');
  if(barEl){ barEl.style.width=Math.min(sum*100,100)+'%'; barEl.style.background=Math.abs(sum-1)<0.001?'linear-gradient(90deg,#10b981,#34d399)':sum>1?'linear-gradient(90deg,#ef4444,#f87171)':'linear-gradient(90deg,#f59e0b,#fbbf24)'; }
}

function calcularFS(){
  const rows=Array.from(document.querySelectorAll('#bg-fs-table tbody tr')).filter(r=>!r.classList.contains('fs-result-row'));
  const FS=[0,0,0]; let html=`<span class="log-step">▶ Factores Subjetivos (FS)</span>\n<span class="log-calc">  FS_i = Σ(Wₖ × Rₖᵢ)</span>\n\n`;
  rows.forEach(row=>{
    const inp=row.querySelectorAll('input'); if(inp.length<4) return;
    const w=parseFloat(inp[0].value)||0;
    const sc=[parseFloat(inp[1].value)||0,parseFloat(inp[2].value)||0,parseFloat(inp[3].value)||0];
    const fName=row.querySelector('td')?.textContent||'';
    sc.forEach((s,ci)=>{ FS[ci]+=w*(s/10); });
    html+=`<span class="log-calc">  "${fName.trim()}" (W=${w}): `+sc.map((s,ci)=>`${BG_NAMES[ci]}=${w}×${(s/10).toFixed(2)}=${(w*s/10).toFixed(3)}`).join(' | ')+'</span>\n';
  });
  BG.FS=FS.map((fs,i)=>BG.criticalPass[i]?fs:null);
  html+=`\n<span class="log-step">━━ FS Totales ━━</span>\n`;
  BG_NAMES.forEach((n,ci)=>{ html+=BG.FS[ci]!==null?`<span class="log-result">  FS(${n}) = ${BG.FS[ci].toFixed(4)}</span>\n`:`<span class="log-calc">  ${n}: ELIMINADA</span>\n`; });
  const log=document.getElementById('bg-fs-steps'); log.classList.add('visible'); log.innerHTML=html;
  document.getElementById('fs-result-row').style.display='';
  ['fs-val-0','fs-val-1','fs-val-2'].forEach((id,ci)=>{ const el=document.getElementById(id); if(el) el.textContent=BG.FS[ci]!==null?BG.FS[ci].toFixed(4):'N/A'; });
  BG.fsCalculated=true;
  document.getElementById('bg-btn-to-4').style.display='';
  updateMapMarkers('bg',BG.FS,BG.FS.map(fs=>({fs})));
  const ot=document.getElementById('bg-overlay-title'); if(ot) ot.textContent='Etapa 3: FS';
}

function onKChange(){
  const K=parseFloat(document.getElementById('k-slider').value);
  BG.K=K;
  document.getElementById('k-value-display').textContent=K.toFixed(2);
  if(BG.foCalculated&&BG.fsCalculated) recalcularMPL();
}

function calcularMPL(){
  if(!BG.foCalculated){ alert('Primero calcula los Factores Objetivos (Etapa 2)'); return; }
  if(!BG.fsCalculated){ alert('Primero calcula los Factores Subjetivos (Etapa 3)'); return; }
  recalcularMPL(true);
}

function recalcularMPL(showLog=false){
  const K=BG.K,K1=1-K;
  const MPL=BG_NAMES.map((_,ci)=>(!BG.criticalPass[ci]||BG.FO[ci]===null||BG.FS[ci]===null)?null:K*BG.FO[ci]+K1*BG.FS[ci]);
  BG.MPL=MPL;
  const active=MPL.filter(v=>v!==null);
  const maxMPL=Math.max(...active);
  const winnerIdx=MPL.indexOf(maxMPL);

  document.getElementById('bg-mpl-table-wrapper').style.display='';
  const tbody=document.getElementById('bg-mpl-tbody');
  const sorted=MPL.map((v,i)=>({idx:i,mpl:v})).filter(x=>x.mpl!==null).sort((a,b)=>b.mpl-a.mpl);
  const ri=['🏆','🥈','🥉'],rc=['#10b981','#f59e0b','#ef4444'];
  tbody.innerHTML=sorted.map((item,pos)=>`<tr><td>${ri[pos]} ${BG_ICONS[item.idx]} ${BG_NAMES[item.idx]}</td><td style="font-family:monospace;color:#f59e0b">${BG.FO[item.idx].toFixed(4)}</td><td style="font-family:monospace;color:#a78bfa">${BG.FS[item.idx].toFixed(4)}</td><td style="font-family:monospace;font-weight:700;color:${rc[pos]}">${item.mpl.toFixed(4)}</td><td>${ri[pos]}</td></tr>`).join('')+
    MPL.map((v,ci)=>v===null?`<tr style="opacity:.4"><td>❌ ${BG_ICONS[ci]} ${BG_NAMES[ci]}</td><td colspan="3" style="text-align:center;color:#6b7280">Eliminada</td><td>—</td></tr>`:'').join('');

  document.getElementById('bg-bar-chart').style.display='';
  ['bar-fill-0','bar-fill-1','bar-fill-2'].forEach((id,ci)=>{
    const f=document.getElementById(id),v=document.getElementById(`bar-val-${ci}`); if(!f||!v) return;
    if(MPL[ci]===null){ f.style.width='0%'; v.textContent='N/A'; f.classList.remove('winner-bar'); return; }
    f.style.width=(MPL[ci]/maxMPL*100)+'%'; v.textContent=MPL[ci].toFixed(4); v.style.color=ci===winnerIdx?'#10b981':'#00d4ff';
    ci===winnerIdx?f.classList.add('winner-bar'):f.classList.remove('winner-bar');
  });

  const banner=document.getElementById('bg-winner-banner');
  banner.style.display='';
  banner.innerHTML=`🏆 Con K=<strong>${K.toFixed(2)}</strong>: mejor opción <strong>${BG_NAMES[winnerIdx]}</strong> (MPL=<strong>${maxMPL.toFixed(4)}</strong>)<br><span style="font-size:.8rem;opacity:.8;font-family:monospace">MPL = ${K.toFixed(2)}·FO + ${K1.toFixed(2)}·FS</span>`;

  updateMapMarkers('bg',MPL,MPL.map((mpl,i)=>({mpl,fo:BG.FO[i],fs:BG.FS[i]})));
  const ot=document.getElementById('bg-overlay-title'); if(ot) ot.textContent=`MPL (K=${K.toFixed(2)})`;
  if(winnerIdx!==BG.lastWinnerIdx){ BG.lastWinnerIdx=winnerIdx; setTimeout(()=>flyToWinner('bg',winnerIdx),600); }

  if(showLog){
    const log=document.getElementById('bg-mpl-steps'); log.classList.add('visible');
    let html=`<span class="log-step">▶ MPL con K=${K.toFixed(2)}</span>\n<span class="log-calc">  MPL_i = K·FOᵢ + (1-K)·FSᵢ</span>\n\n`;
    BG_NAMES.forEach((n,ci)=>{
      if(MPL[ci]!==null) html+=`<span class="log-calc">  ${n}: ${K.toFixed(2)}×${BG.FO[ci].toFixed(4)}+${K1.toFixed(2)}×${BG.FS[ci].toFixed(4)}</span>\n<span class="log-result">       = ${MPL[ci].toFixed(4)}</span>\n`;
      else html+=`<span class="log-calc">  ${n}: N/A</span>\n`;
    });
    log.innerHTML=html;
  }
}
