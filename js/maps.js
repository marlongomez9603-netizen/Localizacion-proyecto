/* ============================================================
   maps.js — Motor genérico de mapas Leaflet.js
   ============================================================ */

// Ciudades del tutorial (método principal)
const TUTORIAL_CITIES = [
  { name:'Barrancabermeja', shortName:'Barranc.', icon:'🏭', lat:7.0675, lng:-73.8472, desc:'Puerto petrolero sobre el río Magdalena.' },
  { name:'Bucaramanga',     shortName:'Bucaram.', icon:'🏙️', lat:7.1254, lng:-73.1198, desc:'Capital de Santander.' },
  { name:'Bogotá',          shortName:'Bogotá',   icon:'🏛️', lat:4.6097, lng:-74.0818, desc:'Capital de Colombia.' }
];

// Ciudades proyecto Suplementos
const SUPLEMENTOS_CITIES = [
  { name:'Puerto Wilches',  shortName:'P.Wilches', icon:'🛒', lat:7.3497, lng:-73.8986, desc:'Municipio del Sur de Bolívar, mercado objetivo del proyecto.' },
  { name:'Barrancabermeja', shortName:'Barranc.',  icon:'🏭', lat:7.0675, lng:-73.8472, desc:'Puerto industrial, mayor población de la región.' },
  { name:'Sabana de Torres',shortName:'S.Torres',  icon:'🌱', lat:7.3912, lng:-73.4856, desc:'Municipio con creciente actividad comercial.' }
];

// Ciudades proyecto Logística — zona Magdalena Medio
const LOGISTICA_CITIES = [
  { name:'Puente Sogamoso', shortName:'Pto.Sogamoso', icon:'🌉', lat:7.2494, lng:-73.7842, desc:'Corregimiento de Puerto Wilches. Nodo vial sobre el río Sogamoso, conexión natural entre el Magdalena Medio y la vía a Bucaramanga.' },
  { name:'Puerto Wilches',  shortName:'P.Wilches',    icon:'🚢', lat:7.3497, lng:-73.8986, desc:'Puerto fluvial sobre el río Magdalena. Centro urbano con infraestructura de transporte y almacenamiento.' },
  { name:'Barrancabermeja', shortName:'Barranc.',      icon:'🏭', lat:7.0675, lng:-73.8472, desc:'Ciudad industrial, mayor población de la región. Conectividad vial y fluvial para distribución regional.' }
];

// Estado global de mapas: cualquier stateKey puede registrar un mapa
const MAP_STATES = {}; // { stateKey: { map, markers, cities } }

const RANK_COLORS  = { neutral:'#00d4ff', winner:'#10b981', second:'#f59e0b', third:'#ef4444', eliminated:'#6b7280' };
const RANK_SIZES   = { neutral:38, winner:54, second:44, third:34, eliminated:26 };

/* ── Utilidad: obtener ciudades según stateKey ──────────────── */
function getCitiesForKey(stateKey) {
  if (stateKey === 'pp' || stateKey === 'bg') return TUTORIAL_CITIES;
  const st = MAP_STATES[stateKey];
  return (st && st.cities) ? st.cities : TUTORIAL_CITIES;
}

/* ── Init mapa con conjunto de ciudades configurable ────────── */
function initMap(mapId, stateKey, customCities) {
  if (MAP_STATES[stateKey] && MAP_STATES[stateKey].map) return;
  const cities = customCities || TUTORIAL_CITIES;

  // Centro del mapa: promedio de coords
  const avgLat = cities.reduce((s,c)=>s+c.lat,0)/cities.length;
  const avgLng = cities.reduce((s,c)=>s+c.lng,0)/cities.length;

  const map = L.map(mapId, { zoomControl:true, scrollWheelZoom:false })
    .setView([avgLat, avgLng], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
  }).addTo(map);

  const markers = cities.map(city => createCityMarker(map, city, 'neutral', {}));

  MAP_STATES[stateKey] = { map, markers, cities };
}

function initHeroMap() {
  if (MAP_STATES['hero']) return;
  const map = L.map('hero-map', { zoomControl:false, dragging:false, scrollWheelZoom:false,
    doubleClickZoom:false, boxZoom:false, keyboard:false, tap:false }).setView([6.0,-73.6],6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:''}).addTo(map);
  TUTORIAL_CITIES.forEach(c => L.circleMarker([c.lat,c.lng],{radius:7,color:'#00d4ff',fillColor:'#00d4ff',fillOpacity:0.8,weight:2}).addTo(map));
  MAP_STATES['hero'] = { map, markers:[], cities:TUTORIAL_CITIES };
}

/* ── Crear marcador CSS con Leaflet divIcon ─────────────────── */
function createCityMarker(map, city, state, data) {
  const size  = RANK_SIZES[state]  || 38;
  const color = RANK_COLORS[state] || '#00d4ff';
  const icon  = L.divIcon({
    className:'',
    html:`<div class="city-marker ${state}" style="width:${size}px;height:${size}px;background:${color};">${city.icon}</div>`,
    iconSize:[size,size],
    iconAnchor:[size/2,size/2],
    popupAnchor:[0,-size/2-4]
  });
  const marker = L.marker([city.lat,city.lng],{icon,zIndexOffset:state==='winner'?100:0})
    .addTo(map)
    .bindPopup(buildPopup(city,state,data),{maxWidth:260,className:'custom-popup'});
  return marker;
}

function buildPopup(city, state, data) {
  const label = {winner:'🏆 ¡Mejor opción!',second:'🥈 Segunda opción',third:'🥉 Tercera opción',eliminated:'❌ Eliminada',neutral:'📍 Sin evaluar aún'}[state]||'📍';
  let rows = `<div class="popup-city-name">${city.icon} ${city.name}</div>
    <div class="popup-row"><span class="popup-label">Descripción</span><span class="popup-val">${city.desc||''}</span></div>`;
  if (data.score!==undefined) rows+=`<div class="popup-row"><span class="popup-label">Puntaje</span><span class="popup-val" style="color:#10b981">${data.score.toFixed(4)}</span></div>`;
  if (data.fo!==undefined)    rows+=`<div class="popup-row"><span class="popup-label">FOᵢ</span><span class="popup-val" style="color:#f59e0b">${data.fo.toFixed(4)}</span></div>`;
  if (data.fs!==undefined)    rows+=`<div class="popup-row"><span class="popup-label">FSᵢ</span><span class="popup-val" style="color:#a78bfa">${data.fs.toFixed(4)}</span></div>`;
  if (data.mpl!==undefined)   rows+=`<div class="popup-row"><span class="popup-label">MPLᵢ</span><span class="popup-val" style="color:#00d4ff">${data.mpl.toFixed(4)}</span></div>`;
  if (data.cost!==undefined)  rows+=`<div class="popup-row"><span class="popup-label">Costo Total</span><span class="popup-val">$${data.cost.toLocaleString('es-CO')}M</span></div>`;
  rows+=`<div class="popup-winner">${label}</div>`;
  return rows;
}

/* ── Actualizar todos los marcadores según scores ───────────── */
function updateMapMarkers(stateKey, scores, extraData=[]) {
  const st = MAP_STATES[stateKey];
  if (!st) return;
  const {map, markers, cities} = st;

  const active = scores.map((s,i)=>({idx:i,score:s}))
    .filter(x=>x.score!==null&&x.score!==-1)
    .sort((a,b)=>b.score-a.score);
  const rankOf = {};
  active.forEach((item,pos)=>{ rankOf[item.idx]=pos; });
  const rankStates = ['winner','second','third'];

  markers.forEach((old,idx)=>{ if(old&&map.hasLayer(old)) map.removeLayer(old); });

  cities.forEach((city,idx)=>{
    let state;
    if (scores[idx]===null||scores[idx]===-1) state='eliminated';
    else state = rankStates[rankOf[idx]]||'neutral';
    const data = Object.assign({},extraData[idx]||{});
    if (scores[idx]!==null&&scores[idx]!==-1) data.score=scores[idx];
    markers[idx] = createCityMarker(map,city,state,data);
  });

  updateOverlayPanel(stateKey,scores,rankOf,cities);
}

function updateOverlayPanel(stateKey, scores, rankOf, cities) {
  const overlayId = `${stateKey}-overlay-items`;
  const el = document.getElementById(overlayId);
  if (!el) return;
  const rankColors=['#10b981','#f59e0b','#ef4444'];
  const rankStates=['winner','second','third'];
  const rankIcons=['🏆','🥈','🥉'];

  const sorted = Object.entries(rankOf).sort((a,b)=>a[1]-b[1]).map(([i])=>parseInt(i));
  let html='';
  sorted.forEach(idx=>{
    const pos=rankOf[idx];
    const val=scores[idx]!==null?scores[idx].toFixed(4):'';
    html+=`<div class="overlay-item ${rankStates[pos]}">
      <span class="rank-dot" style="background:${rankColors[pos]}"></span>
      ${rankIcons[pos]} ${cities[idx].icon} ${cities[idx].name}
      ${val?`<span style="margin-left:auto;font-family:monospace;font-size:.75rem">${val}</span>`:''}
    </div>`;
  });
  scores.forEach((s,idx)=>{
    if(s===null||s===-1)
      html+=`<div class="overlay-item eliminated"><span class="rank-dot" style="background:#6b7280"></span>❌ ${cities[idx].icon} ${cities[idx].name}</div>`;
  });
  el.innerHTML=html;
}

function resetMapMarkers(stateKey) {
  const st = MAP_STATES[stateKey];
  if (!st) return;
  const {map, markers, cities} = st;
  markers.forEach((old,idx)=>{ if(old&&map.hasLayer(old)) map.removeLayer(old); markers[idx]=createCityMarker(map,cities[idx],'neutral',{}); });
  const el=document.getElementById(`${stateKey}-overlay-items`);
  if(el) el.innerHTML=cities.map(c=>`<div class="overlay-item neutral"><span class="rank-dot" style="background:#00d4ff"></span>${c.icon} ${c.name}</div>`).join('');
}

function flyToWinner(stateKey, cityIdx) {
  const st = MAP_STATES[stateKey];
  if(!st||cityIdx===undefined) return;
  const city = st.cities[cityIdx];
  st.map.flyTo([city.lat,city.lng],9,{animate:true,duration:1.2});
  setTimeout(()=>{ const m=st.markers[cityIdx]; if(m) m.openPopup(); },1400);
}

function eliminateCity(stateKey, cityIdx) {
  const st=MAP_STATES[stateKey]; if(!st) return;
  const {map,markers,cities}=st;
  if(markers[cityIdx]&&map.hasLayer(markers[cityIdx])) map.removeLayer(markers[cityIdx]);
  markers[cityIdx]=createCityMarker(map,cities[cityIdx],'eliminated',{});
}

function restoreCity(stateKey, cityIdx) {
  const st=MAP_STATES[stateKey]; if(!st) return;
  const {map,markers,cities}=st;
  if(markers[cityIdx]&&map.hasLayer(markers[cityIdx])) map.removeLayer(markers[cityIdx]);
  markers[cityIdx]=createCityMarker(map,cities[cityIdx],'neutral',{});
}
