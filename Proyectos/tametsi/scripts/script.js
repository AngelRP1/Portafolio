/******************************************************
 * TAMETSI — con:
 *  - Deshacer al perder
 *  - Minas aleatorias por mapa
 *  - Generación resoluble (lógica determinista)
 *  - Overlay de derrota
 *  - Overlay de victoria estilo Tametsi (timer primer clic,
 *    clics del jugador, semilla, "Perfecto"/"Usaste Deshacer")
 ******************************************************/

const HEX = { SIZE: 28, SQRT3: Math.sqrt(3) };

function axialToPixel(q, r) {
  return {
    x: HEX.SIZE * (HEX.SQRT3 * q + HEX.SQRT3 / 2 * r),
    y: HEX.SIZE * (1.5 * r)
  };
}
function hexPoints(x, y, size = HEX.SIZE) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 3 * i + Math.PI / 6;
    pts.push(`${x + size * Math.cos(a)},${y + size * Math.sin(a)}`);
  }
  return pts.join(" ");
}
function neighbors(q, r) {
  return [
    { q: q + 1, r: r },
    { q: q + 1, r: r - 1 },
    { q: q, r: r - 1 },
    { q: q - 1, r: r },
    { q: q - 1, r: r + 1 },
    { q: q, r: r + 1 },
  ];
}
function hKey(q, r) { return `${q},${r}`; }

function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr, seed) {
  const rnd = mulberry32(seed >>> 0);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

function disk(R) {
  const set = new Map();
  for (let q = -R; q <= R; q++) {
    for (let r = Math.max(-R, -q - R); r <= Math.min(R, -q + R); r++) {
      set.set(hKey(q, r), { q, r });
    }
  }
  return set;
}

function ring(R) {
  const out = [];
  let q = R, r = -R;
  const dirs = [[0,1],[-1,1],[-1,0],[0,-1],[1,-1],[1,0]];
  for (let d = 0; d < 6; d++) {
    const [dq, dr] = dirs[d];
    for (let i = 0; i < R; i++) {
      out.push([q, r]);
      q += dq; r += dr;
    }
  }
  return out;
}

function unionInto(base, add) { for (const v of add.values()) base.set(hKey(v.q, v.r), v); return base; }
function difference(base, sub) { const out = new Map(); for (const [k, v] of base) if (!sub.has(k)) out.set(k, v); return out; }
function boundaryOf(set) {
  const out = new Map();
  for (const v of set.values()) {
    for (const [dq, dr] of [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]]) {
      if (!set.has(hKey(v.q + dq, v.r + dr))) { out.set(hKey(v.q, v.r), v); break; }
    }
  }
  return out;
}

const PALETTE_ALL = [
  "#ff51d6", "#8e57ff", "#8de44a",
  "#4b78ff", "#35ead2", "#ff77d4",
  "#ffd75e", "#ff4f66", "#6c6c7f",
  "#444556", "#43e5c7", "#4cc4ad", "#74e39b",
];
function pickColors(n, seed) {
  const arr = [...PALETTE_ALL];
  seededShuffle(arr, seed);
  return arr.slice(0, n);
}

const MAPS = [
  { name: "Anillo tricolor", seed: 1201, cells: [], mines: 24, palette: {} },
  { name: "Pica rombos",     seed: 2203, cells: [], mines: 22, palette: {} },
  { name: "Hex core",        seed: 3307, cells: [], mines: 26, palette: {} },
  { name: "Flechas",         seed: 4409, cells: [], mines: 20, palette: {} },
  { name: "Isla",            seed: 5513, cells: [], mines: 28, palette: {} },
];

function buildRingTricolor() {
  const R_outer = 5, R_inner = 2;
  const all  = disk(R_outer);
  const hole = disk(R_inner);
  const body = difference(all, hole);
  const outerRing = new Map(ring(R_outer).map(([q,r])=>[hKey(q,r),{q,r}]));
  const innerRing = new Map(ring(R_inner).map(([q,r])=>[hKey(q,r),{q,r}]));

  const cols = pickColors(4, 1201);
  const [cMag, cLime, cPurple, cGray] = cols;

  const cells = [];
  for (const v of body.values()) cells.push({type:"hex", q:v.q, r:v.r, color:cGray});

  for (const v of outerRing.values()){
    const a = Math.atan2(1.5*v.r, (HEX.SQRT3*(v.q + v.r/2)));
    const col = (a > -0.6 && a < 1.8) ? cMag : cLime;
    const k = cells.findIndex(c=>c.q===v.q && c.r===v.r && c.type==="hex");
    if (k>=0) cells[k].color = col; else cells.push({type:"hex", q:v.q, r:v.r, color:col});
  }
  for (const v of innerRing.values()){
    const k = cells.findIndex(c=>c.type==="hex" && c.q===v.q && c.r===v.r);
    if (k>=0) cells[k].color = cPurple; else cells.push({type:"hex", q:v.q, r:v.r, color:cPurple});
  }

  MAPS[0].cells = cells;
  MAPS[0].mines = Math.max(18, Math.floor(cells.length*0.20));
}

function buildPicaRombos() {
  const base = disk(3);
  const cols = pickColors(3, 2203);
  const [c1, c2, c3] = cols;
  const darkEdge = "#32333f";
  const diamondFill = "#9aa0b3";

  const cells = [];
  for (const v of base.values()) {
    let col = c2;
    if (v.r <= -1) col = c1;
    if (v.r >= 1)  col = c3;
    cells.push({ type:"hex", q:v.q, r:v.r, color:col });
  }

  const edge = boundaryOf(base);
  for (const v of edge.values()) {
    const i = cells.findIndex(c => c.type==="hex" && c.q===v.q && c.r===v.r);
    if (i >= 0) cells[i].color = darkEdge;
  }

  const seen = new Set();
  function midpoint(p1, p2) {
    const a = axialToPixel(p1.q, p1.r);
    const b = axialToPixel(p2.q, p2.r);
    return { x:(a.x+b.x)/2, y:(a.y+b.y)/2 };
  }

  for (const v of base.values()) {
    for (const nb of neighbors(v.q, v.r)) {
      const k1 = hKey(v.q, v.r);
      const k2 = hKey(nb.q, nb.r);
      if (!base.has(k2)) continue;
      const keyPair = k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;
      if (seen.has(keyPair)) continue;
      if (((v.q + v.r) & 1) === 0) {
        const m = midpoint(v, nb);
        cells.push({ type:"diamond", x:m.x, y:m.y, size: HEX.SIZE*0.45, color: diamondFill });
      }
      seen.add(keyPair);
    }
  }

  MAPS[1].cells = cells;
  const hexCount = cells.filter(c=>c.type==="hex").length;
  MAPS[1].mines = Math.max(12, Math.floor(hexCount*0.18));
}

function buildHexCoreDiagonal() {
  const R = 4;
  const all = disk(R);
  const inner = new Map(ring(2).map(([q,r])=>[hKey(q,r),{q,r}]));
  const cols = pickColors(3, 3307);
  const [cGray, cPurple, cDark] = [cols[0], cols[1], "#3c3e4b"];

  const cells = [];
  for (const v of all.values()){
    let color = cGray;
    if ((v.q - v.r) === 1 || (v.q - v.r) === 0) color = cDark;
    cells.push({ type:"hex", q:v.q, r:v.r, color });
  }
  for (const v of inner.values()){
    const i = cells.findIndex(c=>c.type==="hex" && c.q===v.q && c.r===v.r);
    if (i>=0) cells[i].color = cPurple; else cells.push({type:"hex", q:v.q, r:v.r, color:cPurple});
  }

  MAPS[2].cells = cells;
  MAPS[2].mines = Math.max(16, Math.floor(cells.length*0.18));
}

function buildChevrons() {
  const cols = pickColors(3, 4409);
  const [cCyan, cBlue, cPink] = cols;
  const cells = [];
  const addChevron = (x0, y0, W=6, H=4, color) => {
    for (let i=0;i<W;i++){
      for (let j=0;j<H;j++){
        const q = x0 + i + Math.floor(j/2);
        const r = y0 + j - Math.floor(i/2);
        cells.push({ type:"hex", q, r, color });
      }
    }
  };
  addChevron(-7,0,6,4,cCyan);
  addChevron( 0,0,6,4,cBlue);
  addChevron( 7,0,6,4,cPink);

  MAPS[3].cells = cells;
  MAPS[3].mines = Math.max(12, Math.floor(cells.length*0.16));
}

function buildBlobIsland() {
  const a = disk(3);
  const b = new Map(Array.from(disk(3).values()).map(v=>({q:v.q+3, r:v.r-1})).map(v=>[hKey(v.q,v.r),v]));
  const c = new Map(Array.from(disk(3).values()).map(v=>({q:v.q, r:v.r+3})).map(v=>[hKey(v.q,v.r),v]));
  const shape = new Map(); unionInto(shape,a); unionInto(shape,b); unionInto(shape,c);
  const edge = boundaryOf(shape);
  const cols = pickColors(4, 5513);
  const [cMint, cLeaf, cSea, cPink] = cols;

  const cells = [];
  for (const v of shape.values()){
    const pick = Math.abs(v.q*31 + v.r*17) % 3;
    const color = pick===0 ? cMint : (pick===1 ? cLeaf : cSea);
    cells.push({ type:"hex", q:v.q-1, r:v.r-1, color });
  }
  for (const v of edge.values()) cells.push({ type:"hex", q:v.q-1, r:v.r-1, color:cPink });

  MAPS[4].cells = cells;
  MAPS[4].mines = Math.max(18, Math.floor(cells.length*0.20));
}

(function buildAll(){
  buildRingTricolor();
  buildPicaRombos();
  buildHexCoreDiagonal();
  buildChevrons();
  buildBlobIsland();
})();

const State = {
  mapIndex: 0,
  cells: [],
  lost: false,

  prev: null,
  usedUndo: false,

  seed: 0,
  clicks: 0,
  timerRunning: false,
  startTimeMs: 0,
  elapsedMs: 0,
  timerId: null,

  won: false,
};

const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const el = {
  menu: $("#menu"),
  game: $("#game"),
  board: $("#board"),
  legend: $("#legend"),
  mapName: $("#mapName"),
  btnRestart: $("#btnRestart"),
  btnMenu: $("#btnMenu"),
  btnUndo: $("#btnUndo"),
  loseOverlay: $("#loseOverlay"),
  btnRetry: $("#btnRetry"),
  btnToMenu: $("#btnToMenu"),

  winOverlay: $("#winOverlay"),
  winTime: $("#winTime"),
  winClicks: $("#winClicks"),
  winSeed: $("#winSeed"),
  winBadge: $("#winBadge"),
  winUndoNote: $("#winUndoNote"),
  btnWinRetry: $("#btnWinRetry"),
  btnWinMenu: $("#btnWinMenu"),
};

$$(".menu-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const idx = Number(btn.dataset.map || 0);
    showGame();
    loadMap(idx);
  });
});

function showGame(){
  el.menu.classList.add("hidden");
  el.game.classList.remove("hidden");
}

function backToMenu(){
  el.game.classList.add("hidden");
  el.menu.classList.remove("hidden");
  clearBoard();
  hideLoseOverlay();
  hideWinOverlay();
  clearUndo();
  stopTimer();
}

el.btnRestart.addEventListener("click", ()=> loadMap(State.mapIndex));
el.btnMenu.addEventListener("click", backToMenu);
el.btnUndo.addEventListener("click", ()=>{ State.usedUndo = State.usedUndo || !!State.prev; doUndo(); });

document.addEventListener("keydown", (e)=>{
  if (el.game.classList.contains("hidden")) return;
  const anyOverlay = !el.loseOverlay.classList.contains("hidden") || !el.winOverlay.classList.contains("hidden");
  if (e.key==="r" || e.key==="R") { e.preventDefault(); if (!anyOverlay) return loadMap(State.mapIndex); }
  if (e.key==="m" || e.key==="M") { e.preventDefault(); return backToMenu(); }
  if (e.key==="z" || e.key==="Z") { e.preventDefault(); if (el.winOverlay.classList.contains("hidden")) return el.btnUndo.click(); }

  if (!el.loseOverlay.classList.contains("hidden")) {
    if (e.key === "Enter") { e.preventDefault(); return loadMap(State.mapIndex); }
    if (e.key === "Escape") { e.preventDefault(); return backToMenu(); }
  }
  if (!el.winOverlay.classList.contains("hidden")) {
    if (e.key === "Enter") { e.preventDefault(); return loadMap(State.mapIndex); }
    if (e.key === "Escape") { e.preventDefault(); return backToMenu(); }
  }
});

el.btnRetry?.addEventListener("click", ()=> loadMap(State.mapIndex));
el.btnToMenu?.addEventListener("click", backToMenu);

el.btnWinRetry?.addEventListener("click", ()=> loadMap(State.mapIndex));
el.btnWinMenu?.addEventListener("click", backToMenu);

function showLoseOverlay(){
  el.loseOverlay.classList.remove("hidden");
  el.loseOverlay.setAttribute("aria-hidden", "false");
  setUndoEnabled(canUndo());
  el.btnRetry?.focus();
}
function hideLoseOverlay(){
  el.loseOverlay.classList.add("hidden");
  el.loseOverlay.setAttribute("aria-hidden", "true");
}
function showWinOverlay(){
  el.winOverlay.classList.remove("hidden");
  el.winOverlay.setAttribute("aria-hidden", "false");
  el.btnWinRetry?.focus();
}
function hideWinOverlay(){
  el.winOverlay.classList.add("hidden");
  el.winOverlay.setAttribute("aria-hidden", "true");
}

/* ====== UNDO ====== */
function snapshot() {
  return JSON.parse(JSON.stringify({
    mapIndex: State.mapIndex,
    lost: State.lost,
    cells: State.cells,
    clicks: State.clicks,
    timerRunning: State.timerRunning,
    startTimeMs: State.startTimeMs,
    elapsedMs: State.elapsedMs,
  }));
}
function saveSnapshot(){
  State.prev = snapshot();
}
function clearUndo(){
  State.prev = null;
  setUndoEnabled(false);
}
function canUndo(){ return !!State.prev; }
function setUndoEnabled(on){
  if (on) el.btnUndo.removeAttribute("disabled");
  else el.btnUndo.setAttribute("disabled","true");
}
function restoreSnapshot(snap){
  State.mapIndex   = snap.mapIndex;
  State.lost       = snap.lost;
  State.cells      = snap.cells;
  State.clicks     = snap.clicks;
  State.timerRunning = snap.timerRunning;
  State.startTimeMs  = snap.startTimeMs;
  State.elapsedMs    = snap.elapsedMs;

  hideLoseOverlay();
  hideWinOverlay();
  drawLegend();
  drawBoard();
  el.mapName.textContent = MAPS[State.mapIndex].name;
}
function doUndo(){
  if (!canUndo()) return;
  State.usedUndo = true;
  const snap = State.prev;
  clearUndo();
  restoreSnapshot(snap);
}

function startTimerIfNeeded(){
  if (State.timerRunning) return;
  State.timerRunning = true;
  State.startTimeMs = performance.now();
  State.timerId = setInterval(()=>{
    State.elapsedMs = performance.now() - State.startTimeMs;
  }, 100);
}
function stopTimer(){
  if (!State.timerRunning) return;
  State.timerRunning = false;
  clearInterval(State.timerId);
  State.timerId = null;
  State.elapsedMs = performance.now() - State.startTimeMs;
}
function formatTime(ms){
  const t = Math.max(0, Math.floor(ms));
  const totalSec = Math.floor(t/1000);
  const min = Math.floor(totalSec/60);
  const sec = totalSec % 60;
  const cs  = Math.floor((t % 1000)/10);
  return `${min}:${sec.toString().padStart(2,"0")}.${cs.toString().padStart(2,"0")}`;
}

function isDeterministicallySolvable(cells) {
  const hexes = cells.filter(c=>c.type==="hex");
  const keyToIndex = new Map();
  for (let i = 0; i < hexes.length; i++) keyToIndex.set(hKey(hexes[i].q, hexes[i].r), i);

  const rev = new Array(hexes.length).fill(false);
  const flg = new Array(hexes.length).fill(false);

  const getNeighborsIdx = (i)=>{
    const { q, r } = hexes[i];
    const out = [];
    for (const p of neighbors(q, r)) {
      const idx = keyToIndex.get(hKey(p.q, p.r));
      if (idx !== undefined) out.push(idx);
    }
    return out;
  };
  const getAdj = i => hexes[i].adj;

  function floodZero(i0) {
    const st = [i0];
    while (st.length) {
      const i = st.pop();
      for (const j of getNeighborsIdx(i)) {
        if (rev[j] || flg[j] || hexes[j].mine) continue;
        rev[j] = true;
        if (getAdj(j) === 0) st.push(j);
      }
    }
  }
  function reveal(i) {
    if (rev[i] || flg[i] || hexes[i].mine) return false;
    rev[i] = true;
    if (getAdj(i) === 0) floodZero(i);
    return true;
    }
  function toggleFlag(i, v) {
    if (rev[i]) return false;
    flg[i] = v;
    return true;
  }

  let start = -1, minAdj = 7;
  for (let i = 0; i < hexes.length; i++) {
    if (hexes[i].mine) continue;
    if (hexes[i].adj === 0) { start = i; break; }
    if (hexes[i].adj < minAdj) { minAdj = hexes[i].adj; start = i; }
  }
  if (start === -1) return false;

  reveal(start);

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < hexes.length; i++) {
      if (!rev[i] || hexes[i].mine) continue;
      const neigh = getNeighborsIdx(i);
      let unk = 0, flagged = 0;
      const unknownIdx = [];
      for (const j of neigh) {
        if (flg[j]) flagged++;
        else if (!rev[j]) { unk++; unknownIdx.push(j); }
      }
      const n = getAdj(i);

      if (n === flagged && unk > 0) {
        for (const j of unknownIdx) {
          if (!rev[j] && !flg[j]) { reveal(j); changed = true; }
        }
      }
      if (n === flagged + unk && unk > 0) {
        for (const j of unknownIdx) {
          if (!flg[j]) { toggleFlag(j, true); changed = true; }
        }
      }
    }
  }
  for (let i = 0; i < hexes.length; i++) {
    if (!hexes[i].mine && !rev[i]) return false;
  }
  return true;
}

function generateSolvableMines(layoutCells, targetMines, maxTries = 300) {
  if (!layoutCells || layoutCells.length === 0) {
    console.warn("Layout vacío; reconstruyendo mapas…");
    buildRingTricolor(); buildPicaRombos(); buildHexCoreDiagonal(); buildChevrons(); buildBlobIsland();
    layoutCells = layoutCells ?? [];
  }
  const cells = layoutCells.map(c => ({...c, mine:false, adj:0, revealed:false, flagged:false}));
  const hexIdxs = cells.map((c,i)=> c.type==="hex" ? i : -1).filter(i=>i>=0);

  let lastSeed = 0;

  for (let attempt = 1; attempt <= maxTries; attempt++) {
    for (const i of hexIdxs) cells[i].mine = false;

    const randomSeed = Math.floor(Math.random() * 1e9);
    lastSeed = randomSeed;
    const shuffled = seededShuffle([...hexIdxs], randomSeed);
    const minesTarget = Math.min(targetMines, Math.max(1, hexIdxs.length - 1));
    for (let k=0;k<minesTarget;k++) cells[shuffled[k]].mine = true;

    for (const c of cells) {
      if (c.type !== "hex") continue;
      c.adj = 0;
      for (const p of neighbors(c.q, c.r)) {
        const nb = cells.find(x => x.type==="hex" && x.q===p.q && x.r===p.r);
        if (nb && nb.mine) c.adj++;
      }
    }
    if (isDeterministicallySolvable(cells)) {
      return { cells: cells.map(c=>({...c})), seed: lastSeed };
    }
  }
  return { cells: cells.map(c=>({...c})), seed: lastSeed };
}

function resetMetrics() {
  State.clicks = 0;
  State.usedUndo = false;
  State.won = false;
  stopTimer();
  State.timerRunning = false;
  State.startTimeMs = 0;
  State.elapsedMs = 0;
}
function ensureMapBuilt(idx){
  if (MAPS[idx].cells && MAPS[idx].cells.length) return;
  switch(idx){
    case 0: buildRingTricolor(); break;
    case 1: buildPicaRombos(); break;
    case 2: buildHexCoreDiagonal(); break;
    case 3: buildChevrons(); break;
    case 4: buildBlobIsland(); break;
    default: buildRingTricolor();
  }
}

function loadMap(i){
  hideLoseOverlay();
  hideWinOverlay();
  clearBoard();
  clearUndo();
  resetMetrics();

  const idx = (i + MAPS.length) % MAPS.length;
  ensureMapBuilt(idx);

  const m = MAPS[idx];
  if (!m.cells || !m.cells.length) {
    console.error("Mapa sin celdas tras build; abort.");
    return;
  }

  const generated = generateSolvableMines(m.cells, m.mines);
  State.cells = generated.cells;
  State.seed = generated.seed;
  State.mapIndex = idx;
  State.lost = false;
  State.won = false;

  drawLegend();
  drawBoard();
  el.mapName.textContent = m.name;
}

function findHex(q,r){
  for (let i=0;i<State.cells.length;i++){
    const c = State.cells[i];
    if (c.type==="hex" && c.q===q && c.r===r) return c;
  }
  return null;
}

function onReveal(c){
  if (State.lost || State.won || c.type!=="hex" || c.flagged || c.revealed) return;
  startTimerIfNeeded();
  saveSnapshot();
  c.revealed = true;
  State.clicks++;

  if (c.mine){
    State.lost = true;
    stopTimer();
    drawBoard();
    showLoseOverlay();
    return;
  }
  if (c.adj === 0) flood(c);

  if (checkWin()){
    onWin();
    return;
  }
  drawBoard();
}
function onFlag(c){
  if (State.lost || State.won || c.type!=="hex" || c.revealed) return;
  startTimerIfNeeded();
  saveSnapshot();
  c.flagged = !c.flagged;
  State.clicks++;

  if (checkWin()){
    onWin();
    return;
  }
  drawBoard();
}
function flood(start){
  const st=[start];
  while (st.length){
    const cur = st.pop();
    for (const p of neighbors(cur.q,cur.r)){
      const n = findHex(p.q,p.r);
      if (!n || n.revealed || n.mine || n.flagged) continue;
      n.revealed = true;
      if (n.adj === 0) st.push(n);
    }
  }
}
function checkWin(){
  for (const c of State.cells){
    if (c.type==="hex" && !c.mine && !c.revealed) return false;
  }
  return true;
}

function onWin(){
  State.won = true;
  stopTimer();
  el.winTime.textContent = formatTime(State.elapsedMs);
  el.winClicks.textContent = String(State.clicks);
  el.winSeed.textContent = String(State.seed);

  if (State.usedUndo) {
    el.winBadge.textContent = "Completado";
    el.winBadge.style.color = "#d9def5";
    el.winUndoNote.classList.remove("hidden");
  } else {
    el.winBadge.textContent = "Perfecto";
    el.winBadge.style.color = "#00ffc8";
    el.winUndoNote.classList.add("hidden");
  }

  drawBoard();
  showWinOverlay();
}

function clearBoard(){ while(el.board.firstChild) el.board.removeChild(el.board.firstChild); }

function drawLegend(){
  el.legend.innerHTML = "";
  const totals={}, flags={};
  for (const c of State.cells) {
    if (c.type!=="hex") continue;
    totals[c.color] = (totals[c.color]||0)+1;
    if (c.flagged) flags[c.color] = (flags[c.color]||0)+1;
  }
  const colors = Object.keys(totals);
  for (const k of colors){
    const item=document.createElement("div"); item.className="legend-item";
    const dot=document.createElement("span"); dot.className="legend-dot"; dot.style.background=k;
    const t1=document.createElement("span"); t1.textContent="HEX";
    const t2=document.createElement("span"); t2.textContent=`· Total: ${totals[k]||0}`;
    const t3=document.createElement("span"); t3.textContent=`· Banderas: ${flags[k]||0}`;
    const t4=document.createElement("span"); t4.textContent=`· Restantes: ${(totals[k]||0)-(flags[k]||0)}`;
    item.append(dot,t1,t2,t3,t4);
    el.legend.appendChild(item);
  }
}

function drawBoard(){
  const svg = el.board;
  const frag = document.createDocumentFragment();

  // Rombos decorativos
  for (const c of State.cells) {
    if (c.type !== "diamond") continue;
    const size = c.size || HEX.SIZE*0.45;
    const half = size / Math.SQRT2;
    const p = [
      `${c.x - half},${c.y}`,
      `${c.x},${c.y - half}`,
      `${c.x + half},${c.y}`,
      `${c.x},${c.y + half}`,
    ].join(" ");
    const poly = document.createElementNS(svg.namespaceURI, "polygon");
    poly.setAttribute("points", p);
    poly.setAttribute("class", "diamond");
    poly.setAttribute("fill", c.color || "#9aa0b3");
    poly.setAttribute("stroke", "#000");
    poly.setAttribute("stroke-width", "2");
    frag.appendChild(poly);
  }

  for (const c of State.cells) {
    if (c.type !== "hex") continue;
    const {x,y} = axialToPixel(c.q,c.r);
    const g = document.createElementNS(svg.namespaceURI,"g");

    const poly = document.createElementNS(svg.namespaceURI,"polygon");
    poly.setAttribute("points", hexPoints(x,y));
    poly.setAttribute("class", "hex");
    poly.setAttribute("fill", c.revealed ? shade(c.color, 10) : c.color);
    poly.setAttribute("stroke", "#000");
    poly.setAttribute("stroke-width", "2");
    g.appendChild(poly);

    if (c.revealed && !c.mine && c.adj>0){
      const t = document.createElementNS(svg.namespaceURI,"text");
      t.setAttribute("x", x);
      t.setAttribute("y", y+0.5);
      t.setAttribute("class","hex-number");
      t.textContent = c.adj;
      g.appendChild(t);
    }

    if (!c.revealed && c.flagged){
      const flag = document.createElementNS(svg.namespaceURI,"path");
      flag.setAttribute("d", `M ${x-6} ${y-10} l 12 6 l -12 6 z`);
      flag.setAttribute("fill","#111");
      g.appendChild(flag);
    }

    const block = !el.loseOverlay.classList.contains("hidden") || !el.winOverlay.classList.contains("hidden");
    if (!block) {
      g.addEventListener("click", ()=> onReveal(c));
      g.addEventListener("contextmenu",(e)=>{ e.preventDefault(); onFlag(c); });
    }

    frag.appendChild(g);
  }

  svg.appendChild(frag);

  requestAnimationFrame(()=>safeViewBox(svg));
}

function safeViewBox(svg){
  try{
    const box = svg.getBBox();
    const PAD = 24;
    svg.setAttribute("viewBox", `${box.x-PAD} ${box.y-PAD} ${box.width+PAD*2} ${box.height+PAD*2}`);
    svg.setAttribute("preserveAspectRatio","xMidYMid meet");
  }catch{
    svg.setAttribute("viewBox","-400 -320 800 640");
  }
}

function shade(hex, percent){
  let f=parseInt(hex.slice(1),16), t=percent<0?0:255, p=Math.abs(percent)/100,
      R=f>>16, G=f>>8&0x00FF, B=f&0x0000FF;
  return "#"+(0x1000000 + (Math.round((t-R)*p)+R)*0x10000
                        + (Math.round((t-G)*p)+G)*0x100
                        + (Math.round((t-B)*p)+B)).toString(16).slice(1);
}