//@@APP
const APP={title:"연서의 물류 센터 직육면체", unit:"5-2 수학 5. 직육면체(교과서)", key:"t52-cuboid-v1", welcome:"연서의 물류 센터 직육면체 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 국제 물류 센터에 견학 간 연서와 함께 상자를 분류하고, 직육면체를 이리저리 돌려 면·모서리·꼭짓점을 세고, 겨냥도를 그리고, 상자를 펼치고 접으며 전개도를 알아봐요."};
//@@UNIT
/* =========================================================
   5-2 수학 5. 직육면체 — 단원 조작 부품 (앞글자 cb5)
   직육면체의 꼭짓점은 번호(가로 1 · 높이 2 ·깊이 4의 합)로 적고, 전개도는 모눈 위 직사각형 면 [{x,y,w,h}]로 적어요.
   전개도를 접는 일(cb5Fold)은 코드로 계산해서 채점해요: 겹치는 면, 맞닿는 모서리 길이, 겹치는 점·선분.
   cb5Spin     돌려 보는 직육면체(면·모서리·꼭짓점 누르기, 마주 보는 면·만나는 면 찾기)
   cb5Sketch   모눈에 겨냥도 긋기(실선·점선), 잘못 그린 겨냥도 고치기, 보이지 않는 모서리 찾기
   cb5FoldView 전개도를 접고 펴는 움직이는 그림
   cb5NetJudge 전개도가 될 수 있는 것 고르기(하나씩 접어 보기)
   cb5NetPts   전개도에서 겹치는 점·선분 찾기          cb5NetDraw  모눈에 전개도 그리기 → 접는 선을 점선으로
   cb5NetPairs 전개도에서 마주 보는 면 찾기             cb5AddFace  면을 한 개 더 붙여 전개도 만들기
   cb5Boxes    상자를 둘러싼 도형 살펴보기·분류         cb5Robot    장난감 부분 맞추기
   cb5PassGame 같은 도형 카드 모으기(넘겨 놀이)         cb5Memory   전개도 카드 짝 맞추기
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.cb5fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none}
.cb5fig.cb5plain{background:transparent;border:none}
.cb5small{font-size:var(--fs-s);color:var(--muted)}
.cb5part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.cb5read{font-family:"Jua",sans-serif;font-size:var(--fs);color:var(--night);line-height:1.5;word-break:keep-all;min-height:1.5em}
.cb5row{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-start}
.cb5row>div{flex:1 1 15em;min-width:0}
.cb5box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all}
.cb5hit{cursor:pointer}
.cb5grab{cursor:grab}
.cb5btns{display:flex;flex-wrap:wrap;gap:.35em;align-items:center;margin:.3em 0}
.cb5btns button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em;min-height:2.2em}
.cb5btns button.cb5-pick{background:var(--night);color:#fff;border-color:var(--night)}
.cb5cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(9.5em,1fr));gap:.5em;margin:.4em 0}
.cb5card{border:2.5px solid var(--line);background:#fff;border-radius:12px;padding:.25em;text-align:center;cursor:pointer;min-width:0;font-family:"Jua",sans-serif;position:relative}
.cb5card svg{width:100%;height:auto;display:block}
.cb5card.cb5-pick{border-color:var(--ring);background:#EAF3FD;box-shadow:0 0 0 2px var(--ring) inset}
.cb5card.cb5-good{border-color:var(--ok);background:#E3F4EA}
.cb5card.cb5-bad{border-color:var(--no);background:#FBE7E2}
.cb5card.cb5-off{opacity:.35;cursor:default}
.cb5card.cb5-back{background:repeating-linear-gradient(45deg,#E9EEF7,#E9EEF7 8px,#DCE5F3 8px,#DCE5F3 16px)}
.cb5tag{display:inline-block;border-radius:999px;background:#F2F5F4;border:1.5px solid var(--line);padding:0 .6em;margin:.1em;font-size:var(--fs-s)}
.cb5slider{display:flex;align-items:center;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.cb5slider input[type=range]{flex:1 1 10em;min-width:6em}
.cb5key{display:flex;flex-wrap:wrap;gap:.25em;margin:.25em 0}
.cb5key button{min-width:2.4em;min-height:2.2em;border:2px solid var(--line);background:#fff;border-radius:.5em;font-family:"Jua",sans-serif;font-size:1.05em}
.cb5ans{font-size:1.1em;width:9em;max-width:100%;text-align:center}
.cb5tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.cb5tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.cb5tbl th,.cb5tbl td{border:1.5px solid var(--line);padding:.25em .6em;text-align:center}
.cb5tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.cb5tbl input{width:3.6em;font-size:1em;text-align:center}
.cb5hand{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5em;max-width:34em}
.cb5players{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.4em;margin:.3em 0}
.cb5pl{border:2px solid var(--line);border-radius:10px;padding:.25em .4em;background:#fff;text-align:center;font-family:"Jua",sans-serif;font-size:var(--fs-s);min-width:0}
.cb5pl .cb5mini{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.2em}
.cb5pl.cb5-win{border-color:var(--ok);background:#E3F4EA}
.cb5mem{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.45em;max-width:40em}
`;
  document.head.append(s);
})();

/* ---------- 계산 핵심(화면 없이도 돌아감) ---------- */
const CB5_KO = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ".split("");
const CB5_GA = ["가", "나", "다", "라", "마", "바"];
/* 직육면체의 꼭짓점 번호: x(가로, 오른쪽)=1, y(높이, 위)=2, z(깊이, 뒤)=4 */
const CB5_FACES = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 4, 6, 2], [1, 5, 7, 3], [0, 1, 5, 4], [2, 3, 7, 6]];   // 앞·뒤·왼·오른·아래·위
const CB5_FNAME = ["앞면", "뒷면", "왼쪽 옆면", "오른쪽 옆면", "아랫면", "윗면"];
const CB5_OPP = [1, 0, 3, 2, 5, 4];
const CB5_EDGES = (() => { const E = []; for (let v = 0; v < 8; v++) for (const b of [1, 2, 4]) if (!(v & b)) E.push([v, v | b]); return E; })();
/* 교과서 꼭짓점 이름: 윗면 ㄱㄴㄷㄹ, 아랫면 ㅁㅂㅅㅇ (ㄱ-ㅁ, ㄴ-ㅂ, ㄷ-ㅅ, ㄹ-ㅇ이 세로 모서리) */
const CB5_LAB = { 6: "ㄱ", 2: "ㄴ", 3: "ㄷ", 7: "ㄹ", 4: "ㅁ", 0: "ㅂ", 1: "ㅅ", 5: "ㅇ" };
const CB5_FTXT = ["면 ㄴㅂㅅㄷ", "면 ㄱㅁㅇㄹ", "면 ㄱㄴㅂㅁ", "면 ㄷㅅㅇㄹ", "면 ㅁㅂㅅㅇ", "면 ㄱㄴㄷㄹ"];   // 교과서에 나온 차례
function cb5FaceName(fi, lab) {
  if (!lab || lab === CB5_LAB) return CB5_FTXT[fi]; const c = CB5_FACES[fi].map(v => lab[v]);
  const order = CB5_KO; let best = null;
  for (let r = 0; r < 4; r++) for (const d of [1, -1]) {
    const s = [0, 1, 2, 3].map(k => c[((r + d * k) % 4 + 4) % 4]).join("");
    if (best === null || order.indexOf(s[0]) < order.indexOf(best[0]) || (s[0] === best[0] && order.indexOf(s[1]) < order.indexOf(best[1]))) best = s;
  }
  return "면 " + best;
}
/* 쓴 면 이름 → 면 번호(-1: 없음). 점 차례가 이어지면 어디서 시작해도, 어느 쪽으로 읽어도 됨 */
function cb5ParseFace(s, lab) {
  lab = lab || CB5_LAB; const t = String(s || "").replace(/면|\s|,/g, "");
  if (t.length !== 4) return -1;
  for (let fi = 0; fi < 6; fi++) {
    const c = CB5_FACES[fi].map(v => lab[v]);
    for (let r = 0; r < 4; r++) for (const d of [1, -1]) if ([0, 1, 2, 3].map(k => c[((r + d * k) % 4 + 4) % 4]).join("") === t) return fi;
  }
  return -1;
}
/* ----- 전개도: 직사각형 면 [{x,y,w,h}] (모눈 단위) ----- */
const cb5Eq = (a, b) => Math.abs(a - b) < 1e-6;
function cb5Contacts(F) {
  const C = [];
  for (let i = 0; i < F.length; i++) for (let j = i + 1; j < F.length; j++) {
    const a = F[i], b = F[j];
    const ov = (p0, p1, q0, q1) => Math.min(p1, q1) - Math.max(p0, q0);
    let seg = null;
    if (cb5Eq(a.x + a.w, b.x) || cb5Eq(b.x + b.w, a.x)) {   // 세로 변으로 닿음
      const X = cb5Eq(a.x + a.w, b.x) ? b.x : a.x, o = ov(a.y, a.y + a.h, b.y, b.y + b.h);
      if (o > 1e-6) seg = { A: [X, Math.max(a.y, b.y)], B: [X, Math.min(a.y + a.h, b.y + b.h)], full: cb5Eq(a.y, b.y) && cb5Eq(a.h, b.h) };
    } else if (cb5Eq(a.y + a.h, b.y) || cb5Eq(b.y + b.h, a.y)) {
      const Y = cb5Eq(a.y + a.h, b.y) ? b.y : a.y, o = ov(a.x, a.x + a.w, b.x, b.x + b.w);
      if (o > 1e-6) seg = { A: [Math.max(a.x, b.x), Y], B: [Math.min(a.x + a.w, b.x + b.w), Y], full: cb5Eq(a.x, b.x) && cb5Eq(a.w, b.w) };
    }
    if (seg) C.push(Object.assign(seg, { i, j }));
  }
  return C;
}
function cb5Overlap(a, b) { return Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 1e-6 && Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 1e-6; }
/* 접어 보기: {ok, why, tree:[{p, A, B}], corner:[[NW,NE,SE,SW]…], cube:[면 번호…], L:{1,2,4}, pt:Map("x,y"→꼭짓점)} */
function cb5Fold(F) {
  const n = F.length, res = { ok: false, why: "", tree: F.map(() => null), corner: [], cube: [], L: {}, pt: new Map(), contacts: [] };
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (cb5Overlap(F[i], F[j])) { res.why = "plane"; return res; }
  const C = cb5Contacts(F); res.contacts = C;
  // 펼친 차례(나무): 맞닿은 곳을 따라 0번 면부터
  const seen = [0], adj = F.map(() => []);
  C.forEach(c => { adj[c.i].push(c); adj[c.j].push(c); });
  const q = [0], used = new Set();
  while (q.length) { const f = q.shift(); adj[f].forEach(c => { const g = c.i === f ? c.j : c.i; if (!seen.includes(g)) { seen.push(g); q.push(g); res.tree[g] = { p: f, A: c.A, B: c.B, c }; used.add(c); } }); }
  if (n !== 6) { res.why = n < 6 ? "few" : "many"; return res; }
  if (seen.length < n) { res.why = "apart"; return res; }
  if (C.some(c => !c.full)) { res.why = "partial"; return res; }
  if (C.length !== 5) { res.why = "overlap"; return res; }       // 고리 모양(2×2 묶음 등)은 접으면 겹침
  // 꼭짓점 번호 매기기(파이썬 풀이기와 같은 방법)
  const corner = F.map(() => null); corner[0] = [0, 1, 3, 2];
  for (const g of seen.slice(1)) {
    const t = res.tree[g], f = t.p, [NW, NE, SE, SW] = corner[f], a = F[f], b = F[g];
    const mask = 7 & ~((NW ^ NE) | (NW ^ SE) | (NW ^ SW));
    if (cb5Eq(a.x + a.w, b.x)) corner[g] = [NE, NE ^ mask, SE ^ mask, SE];
    else if (cb5Eq(b.x + b.w, a.x)) corner[g] = [NW ^ mask, NW, SW, SW ^ mask];
    else if (cb5Eq(a.y + a.h, b.y)) corner[g] = [SW, SE, SE ^ mask, SW ^ mask];
    else corner[g] = [NW ^ mask, NE ^ mask, NE, NW];
  }
  res.corner = corner;
  const keys = corner.map(c => c.slice().sort((u, v) => u - v).join(","));
  if (new Set(keys).size < 6) { res.why = "overlap"; return res; }
  res.cube = corner.map(c => { const cst = [1, 2, 4].find(b => c.every(v => (v & b) === (c[0] & b))); return { 1: c[0] & 1 ? 3 : 2, 2: c[0] & 2 ? 5 : 4, 4: c[0] & 4 ? 1 : 0 }[cst]; });
  const L = {};
  for (let f = 0; f < n; f++) {
    const [NW, NE, , SW] = corner[f], hb = NW ^ NE, vb = NW ^ SW;
    for (const [bit, len] of [[hb, F[f].w], [vb, F[f].h]]) { if (L[bit] == null) L[bit] = len; else if (!cb5Eq(L[bit], len)) { res.why = "length"; res.L = L; return res; } }
  }
  res.L = L;
  F.forEach((r, f) => { const [NW, NE, SE, SW] = corner[f]; [[r.x, r.y, NW], [r.x + r.w, r.y, NE], [r.x + r.w, r.y + r.h, SE], [r.x, r.y + r.h, SW]].forEach(([x, y, v]) => res.pt.set(x + "," + y, v)); });
  res.ok = true; return res;
}
const CB5_WHY = {
  plane: "그린 면끼리 겹쳐 있어요. 면이 서로 겹치지 않게 놓아요.",
  few: "면이 6개가 되도록 더 그려요.",
  many: "면이 6개보다 많아요. 직육면체와 정육면체는 면이 6개예요.",
  apart: "떨어져 있는 면이 있어요. 모든 면이 모서리로 이어져 있어야 해요.",
  partial: "맞닿은 두 면의 모서리 길이가 서로 달라요. 접었을 때 겹치는 모서리의 길이가 같아야 해요.",
  overlap: "접었을 때 겹치는 면이 있어요.",
  length: "접었을 때 맞닿는 모서리의 길이가 서로 달라요."
};
/* 단위 정사각형 칸 [[x,y]…] → 직사각형 면 (각 칸의 가로·세로를 직육면체 모서리 길이 dims {1:가로,2:세로,4:깊이}에 맞춤) */
function cb5NetFromCells(cells, dims) {
  const sq = cells.map(([x, y]) => ({ x, y, w: 1, h: 1 })), fd = cb5Fold(sq);
  if (!fd.ok) return null;
  const R = cells.map(() => null), done = [0];
  const size = f => { const [NW, NE, , SW] = fd.corner[f]; return [dims[NW ^ NE], dims[NW ^ SW]]; };
  let [w0, h0] = size(0); R[0] = { x: 0, y: 0, w: w0, h: h0 };
  const order = [0]; const seen = new Set([0]);
  while (order.length < cells.length) {
    for (let g = 0; g < cells.length; g++) { const t = fd.tree[g]; if (seen.has(g) || !t || !seen.has(t.p)) continue;
      const p = t.p, [w, hh] = size(g), P = R[p], [px, py] = cells[p], [gx, gy] = cells[g];
      R[g] = gx > px ? { x: P.x + P.w, y: P.y, w, h: hh } : gx < px ? { x: P.x - w, y: P.y, w, h: hh } : gy > py ? { x: P.x, y: P.y + P.h, w, h: hh } : { x: P.x, y: P.y - hh, w, h: hh };
      seen.add(g); order.push(g); }
  }
  const mx = Math.min(...R.map(r => r.x)), my = Math.min(...R.map(r => r.y));
  return R.map(r => ({ x: r.x - mx, y: r.y - my, w: r.w, h: r.h }));
}
/* 6칸 모양(헥소미노) 모두 → [{cells, net}] */
let CB5_HEX = null;
function cb5Hexes() {
  if (CB5_HEX) return CB5_HEX;
  const norm = c => { const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
  const key = c => norm(c).map(p => p.join(",")).join(";");
  const syms = c => { const out = []; let d = c; for (let t = 0; t < 8; t++) { let e = c; for (let k = 0; k < t % 4; k++) e = e.map(([x, y]) => [y, -x]); if (t >= 4) e = e.map(([x, y]) => [-x, y]); out.push(key(e)); } return out; };
  let polys = new Map([["0,0", [[0, 0]]]]);
  for (let n = 1; n < 6; n++) {
    const nx = new Map();
    polys.forEach(p => p.forEach(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const q = [x + dx, y + dy]; if (p.some(r => r[0] === q[0] && r[1] === q[1])) return;
      const c = norm(p.concat([q])), k = key(c); if (!nx.has(k)) nx.set(k, c); })));
    polys = nx;
  }
  const free = new Map();
  polys.forEach(c => { const k = syms(c).sort()[0]; if (!free.has(k)) free.set(k, norm(c)); });
  CB5_HEX = [...free.values()].map(c => ({ cells: c, net: cb5Fold(c.map(([x, y]) => ({ x, y, w: 1, h: 1 }))).ok, key: syms(c).sort()[0] }));
  return CB5_HEX;
}
function cb5ShapeKey(F) {   // 그린 전개도의 모양(돌리거나 뒤집어도 같은 것) — 같은 크기 정사각형 면일 때
  const s = F[0].w; const c = F.map(r => [Math.round(r.x / s), Math.round(r.y / s)]);
  const norm = c => { const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
  const key = c => norm(c).map(p => p.join(",")).join(";");
  const out = []; for (let t = 0; t < 8; t++) { let e = c; for (let k = 0; k < t % 4; k++) e = e.map(([x, y]) => [y, -x]); if (t >= 4) e = e.map(([x, y]) => [-x, y]); out.push(key(e)); }
  return out.sort()[0];
}
function cb5RectKey(F) {   // 직사각형 면 전개도 모양 비교(돌리기·뒤집기 포함)
  const tf = (r, t) => { let P = [[r.x, r.y], [r.x + r.w, r.y + r.h]]; for (let k = 0; k < t % 4; k++) P = P.map(([x, y]) => [y, -x]); if (t >= 4) P = P.map(([x, y]) => [-x, y]); return P; };
  const out = [];
  for (let t = 0; t < 8; t++) {
    const R = F.map(r => { const P = tf(r, t); return [Math.min(P[0][0], P[1][0]), Math.min(P[0][1], P[1][1]), Math.max(P[0][0], P[1][0]), Math.max(P[0][1], P[1][1])]; });
    const mx = Math.min(...R.map(r => r[0])), my = Math.min(...R.map(r => r[1]));
    out.push(R.map(r => [r[0] - mx, r[1] - my, r[2] - mx, r[3] - my].join(",")).sort().join(";"));
  }
  return out.sort()[0];
}
/* 전개도 둘레의 모눈점 → 이름: pts [[x,y,"ㄱ"]…], 같은 꼭짓점이 되는 점 / 선분 */
function cb5SamePts(fd, P, name) {
  const me = P.find(p => p[2] === name), v = fd.pt.get(me[0] + "," + me[1]);
  return P.filter(p => p[2] !== name && fd.pt.get(p[0] + "," + p[1]) === v).map(p => p[2]);
}
function cb5Segs(F, P) {   // 둘레의 선분: 이웃한 이름 점 둘 (면 한 변 위)
  const S = [], at = (x, y) => P.find(p => cb5Eq(p[0], x) && cb5Eq(p[1], y));
  const onB = (a, b) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; let k = 0; F.forEach(r => { if (mx > r.x - 1e-6 && mx < r.x + r.w + 1e-6 && my > r.y - 1e-6 && my < r.y + r.h + 1e-6) k++; }); return k === 1; };
  F.forEach(r => { const c = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]];
    for (let i = 0; i < 4; i++) { const a = c[i], b = c[(i + 1) % 4];
      // 변 위의 이름 점들을 차례로
      const on = P.filter(p => (cb5Eq(a[0], b[0]) && cb5Eq(p[0], a[0]) && p[1] >= Math.min(a[1], b[1]) - 1e-6 && p[1] <= Math.max(a[1], b[1]) + 1e-6) || (cb5Eq(a[1], b[1]) && cb5Eq(p[1], a[1]) && p[0] >= Math.min(a[0], b[0]) - 1e-6 && p[0] <= Math.max(a[0], b[0]) + 1e-6))
        .sort((u, v) => (u[0] - v[0]) || (u[1] - v[1]));
      for (let k = 0; k + 1 < on.length; k++) { const u = on[k], v = on[k + 1]; if (!onB(u, v)) continue; const nm = u[2] + v[2]; if (!S.some(s => s.a === u && s.b === v)) S.push({ a: u, b: v, nm }); }
    } });
  return S;
}
function cb5SameSeg(fd, S, s0) {
  const va = fd.pt.get(s0.a[0] + "," + s0.a[1]), vb = fd.pt.get(s0.b[0] + "," + s0.b[1]);
  return S.filter(s => s !== s0 && (() => { const x = fd.pt.get(s.a[0] + "," + s.a[1]), y = fd.pt.get(s.b[0] + "," + s.b[1]); return (x === va && y === vb) || (x === vb && y === va); })());
}

const CB5 = { ink: "#1D2A2A", grid: "#D7E1E9", blue: "#2B7BD6", red: "#D64545", green: "#2E8B57", org: "#E47A38", purple: "#7A5BB0", gray: "#8795A1",
  f: ["#DCEAFB", "#FDE3D3", "#DDEDE5", "#FFF1C7", "#EADFF6", "#FBE0E6"], pick: "#FFD27A", par: "#9CC3F0", per: "#F6B38E" };
const cb5R = v => Math.round(v * 100) / 100;
/* 받침에 따라 조사 고르기: cb5Jo("ㄱ", "이/가") → "ㄱ이", cb5Jo("12", "을/를") → "12를" */
function cb5Jo(w, pair) {
  const s = String(w), [a, b] = pair.split("/"), c = s.trim().slice(-1);
  let bat = false, rieul = false;
  if (/[0-9]/.test(c)) { bat = "0136780".includes(c); rieul = "178".includes(c); }
  else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  else if (/[ㄱ-ㅎ]/.test(c)) { bat = true; rieul = c === "ㄹ"; }   // 기역, 니은 … 은 받침이 있음
  if (pair === "으로/로") return s + (bat && !rieul ? "으로" : "로");
  return s + (bat ? a : b);
}
function cb5Num(s) {
  let t = String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/(센티미터|cm|개|쌍|번)$/i, "");
  return t === "" || !/^-?\d+(\.\d+)?$/.test(t) ? NaN : Number(t);
}
function cb5Fig(W, H, draw, maxW, plain) { const s = makeSvg(W, H); draw(s); s.setAttribute("class", "cb5fig" + (plain ? " cb5plain" : "")); s.style.maxWidth = maxW || "30em"; return s; }
const cb5Go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기, 여러 개 고르기 multi) ---------- */
function cb5Ask(host, api, items, opts = {}) {
  const wrap = h("div", { style: "margin-top:.6em" }), all = [];
  if (opts.title) wrap.append(h("p", { class: "inst" }, opts.title));
  items.forEach(it => {
    const box = h("div", { class: "qitem" });
    if (it.q) box.append(h("div", { class: "jua" }, it.q));
    if (it.fig) box.append(typeof it.fig === "function" ? it.fig() : it.fig);
    const sent = h("p", { class: "sent" });
    (it.parts || []).forEach(pt => {
      if (typeof pt === "string" || (pt && pt.nodeType)) { sent.append(pt); return; }
      if (pt.o) {
        const slot = h("span", { class: "slot" }), s = { pt, v: pt.multi ? new Set() : null, slot };
        pt.o.forEach((o, oi) => slot.append(h("button", { class: "opt", onclick: e => {
          if (pt.multi) { s.v.has(oi) ? s.v.delete(oi) : s.v.add(oi); e.currentTarget.classList.toggle("on"); [...slot.children].forEach(b => b.classList.remove("good", "bad")); }
          else { [...slot.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); s.v = oi; }
        } }, o)));
        sent.append(slot); all.push(s);
      } else {
        const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "답", style: `width:${pt.w || "4em"};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : String(pt.n);
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : pt.nodeType ? " " : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : cb5Num(s.inp.value) === s.pt.n;
  const val = s => s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-");
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); });
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) return api.done(ans, opts.ok);
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(cb5Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열려요 */
function cb5Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "cb5part" : "" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); cb5Go(body.lastChild);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}
/* 조작을 마친 뒤 물음(ask)으로 이어 가기 */
function cb5Then(body, api, opt, ans, msg) {
  if (body.cb5Fin) return; body.cb5Fin = true;   // 해결한 뒤 '확인하기'를 또 눌러도 물음이 두 번 붙지 않게
  body.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "cb5part" }); body.append(box); opt.then(box, api); cb5Go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask() : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = cb5Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle, bad: opt.bad }); cb5Go(w); }
  else api.done(ans, opt.ok || msg);
}

/* ---------- 면 이름 쓰기(자음 단추로 써도 돼요) ---------- */
function cb5FaceAsk(body, api, items, opts = {}) {
  const lab = opts.lab || CB5_LAB, rows = [];
  let focus = null;
  const letters = Object.values(lab).sort((a, b) => CB5_KO.indexOf(a) - CB5_KO.indexOf(b));
  items.forEach(it => {
    const box = h("div", { class: "qitem" });
    if (it.q) box.append(h("div", { class: "jua" }, it.q));
    if (it.fig) box.append(typeof it.fig === "function" ? it.fig() : it.fig);
    const ins = [];
    const line = h("p", { class: "sent" });
    for (let i = 0; i < it.ans.length; i++) {
      const inp = h("input", { type: "text", class: "cb5ans", placeholder: "면 ㄱㄴㄷㄹ", "aria-label": "면 이름", onfocus: e => { focus = e.currentTarget; } });
      ins.push(inp); line.append(i ? ", " : "", inp);
    }
    box.append(line); rows.push({ it, ins }); body.append(box);
  });
  const key = h("div", { class: "cb5key" }, h("span", { class: "cb5small" }, "자음 단추: "), ...letters.map(L => h("button", { onclick: () => { const t = focus || rows[0].ins[0]; t.value = (t.value.replace(/면\s*/, "") + L).slice(0, 4); t.value = "면 " + t.value; t.focus(); } }, L)),
    h("button", { onclick: () => { const t = focus || rows[0].ins[0]; const v = t.value.replace(/면\s*/, ""); t.value = v.length > 1 ? "면 " + v.slice(0, -1) : ""; t.focus(); } }, "⌫"));
  body.append(key);
  api.provide({ words: ["면 이름은 꼭짓점을 차례로 읽어요"], answers: items.map(it => it.ans.map(f => cb5FaceName(f, lab)).join(", ")) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); let ok = true, why = "";
    rows.forEach(r => {
      const got = r.ins.map(i => cb5ParseFace(i.value, lab));
      r.ins.forEach((inp, k) => { const g = got[k], good = g >= 0 && r.it.ans.includes(g) && got.indexOf(g) === k; inp.style.borderColor = good ? "var(--ok)" : "var(--no)"; if (!good) { ok = false;
        if (!why) why = g < 0 ? (r.ins[k].value.replace(/면|\s/g, "").length === 4 ? "꼭짓점을 차례로 이어 읽어야 면 이름이 돼요. 점의 차례를 확인해요." : "면 이름은 꼭짓점 4개를 차례로 써요.") : got.indexOf(g) !== k ? "같은 면을 두 번 썼어요." : (r.it.why || "그 면은 답이 아니에요. 그림을 돌려 가며 다시 살펴봐요."); } });
    });
    const ans = rows.map(r => r.ins.map(i => i.value.trim() || "-").join(", ")).join(" / ");
    ok ? api.done(ans, opts.ok) : api.fail(why, ans);
  } }, "확인하기")));
}

/* =========================================================
   1. 돌려 보는 직육면체 — 끌거나 단추로 돌려요
   opt: {dims:[가로,높이,깊이], yaw, pitch, lab(이름표 표시), dimLab, mode, fill(fi), mark, tap:{face,edge,vert}, size:[W,H], hidden:"dash"|"none"}
   ========================================================= */
function cb5Proj(dims, yaw, pitch) {
  const [W, H, D] = dims, a = yaw * Math.PI / 180, b = pitch * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), cbb = Math.cos(b), sb = Math.sin(b);
  return v => {
    const X = ((v & 1) ? .5 : -.5) * W, Y = ((v & 2) ? .5 : -.5) * H, Z = ((v & 4) ? -.5 : .5) * D;
    const X1 = X * ca + Z * sa, Z1 = -X * sa + Z * ca, Y2 = Y * cbb - Z1 * sb, Z2 = Y * sb + Z1 * cbb;
    return [X1, Y2, Z2];
  };
}
function cb5Solid(o) {
  const W = (o.size && o.size[0]) || 420, H = (o.size && o.size[1]) || 300;
  const svg = makeSvg(W, H); svg.setAttribute("class", "cb5fig"); svg.style.maxWidth = o.maxW || "28em";
  const st = { yaw: o.yaw == null ? -35 : o.yaw, pitch: o.pitch == null ? 24 : o.pitch };
  const diag = Math.hypot(...o.dims), sc = Math.min(W, H) * .84 / diag, cx = W / 2, cy = H / 2;
  let vis = { faces: [], edges: [], verts: [] };
  const draw = () => {
    svg.innerHTML = "";
    const P = cb5Proj(o.dims, st.yaw, st.pitch), Q = [0, 1, 2, 3, 4, 5, 6, 7].map(P), S = Q.map(q => [cx + sc * q[0], cy - sc * q[1]]);
    const fv = CB5_FACES.map(f => f.reduce((s, v) => s + Q[v][2], 0) / 4 > 1e-6);
    const ev = CB5_EDGES.map(([u, v]) => CB5_FACES.some((f, fi) => fv[fi] && f.includes(u) && f.includes(v)));
    const vv = [0, 1, 2, 3, 4, 5, 6, 7].map(v => CB5_FACES.some((f, fi) => fv[fi] && f.includes(v)));
    vis = { faces: fv, edges: ev, verts: vv };
    const pts = f => f.map(v => S[v].map(cb5R).join(",")).join(" ");
    const mark = o.mark || {};
    // 보이지 않는 면 색(색칠한 면이 뒤에 있으면 흐리게)
    CB5_FACES.forEach((f, fi) => { if (!fv[fi]) { const c = o.fill && o.fill(fi); if (c) svg.append(svgEl("polygon", { points: pts(f), fill: c, "fill-opacity": .45, stroke: "none" })); } });
    CB5_FACES.forEach((f, fi) => { if (fv[fi]) { const c = (o.fill && o.fill(fi)) || "#F4F8FC"; const e = svgEl("polygon", { points: pts(f), fill: c, "fill-opacity": .88, stroke: "none" });
      if (o.tap && o.tap.face) { e.classList.add("cb5hit"); e.dataset.k = "f" + fi; } svg.append(e); } });
    if (o.faceText) CB5_FACES.forEach((f, fi) => { const t = o.faceText(fi); if (!t) return; const c = f.reduce((s, v) => [s[0] + S[v][0] / 4, s[1] + S[v][1] / 4], [0, 0]); svg.append(txt(cb5R(c[0]), cb5R(c[1]), t, 16, { fill: fv[fi] ? CB5.ink : CB5.gray, "pointer-events": "none" })); });
    CB5_EDGES.forEach(([u, v], ei) => {
      const m = mark.edges && mark.edges.has(ei);
      if (!ev[ei] && o.hidden === "none" && !m) return;
      const ln = svgEl("line", { x1: cb5R(S[u][0]), y1: cb5R(S[u][1]), x2: cb5R(S[v][0]), y2: cb5R(S[v][1]), stroke: m ? CB5.red : ev[ei] ? CB5.ink : "#7C8A96", "stroke-width": m ? 5 : ev[ei] ? 2.6 : 1.8, "stroke-linecap": "round", "pointer-events": "none" });
      if (!ev[ei]) ln.setAttribute("stroke-dasharray", "7 6");
      svg.append(ln);
      if (o.tap && o.tap.edge && ev[ei]) { const hit = svgEl("line", { x1: cb5R(S[u][0]), y1: cb5R(S[u][1]), x2: cb5R(S[v][0]), y2: cb5R(S[v][1]), stroke: "transparent", "stroke-width": 22, class: "cb5hit" }); hit.dataset.k = "e" + ei; svg.append(hit); }
    });
    for (let v = 0; v < 8; v++) {
      const m = mark.verts && mark.verts.has(v);
      if (vv[v] || m) svg.append(svgEl("circle", { cx: cb5R(S[v][0]), cy: cb5R(S[v][1]), r: m ? 8 : 3.5, fill: m ? CB5.blue : CB5.ink, "pointer-events": "none" }));
      if (o.tap && o.tap.vert && vv[v]) { const c = svgEl("circle", { cx: cb5R(S[v][0]), cy: cb5R(S[v][1]), r: 16, fill: "transparent", class: "cb5hit" }); c.dataset.k = "v" + v; svg.append(c); }
    }
    if (o.lab) { const lab = o.lab === true ? CB5_LAB : o.lab; for (let v = 0; v < 8; v++) { const dx = S[v][0] - cx, dy = S[v][1] - cy, L = Math.hypot(dx, dy) || 1;
      svg.append(txt(cb5R(S[v][0] + dx / L * 17), cb5R(S[v][1] + dy / L * 17), lab[v], 18, { fill: vv[v] ? CB5.ink : "#9AA6B0", "pointer-events": "none" })); } }
    if (o.dimLab) o.dimLab.forEach(([u, v, t]) => { const a = S[u], b2 = S[v], mx = (a[0] + b2[0]) / 2, my = (a[1] + b2[1]) / 2, dx = mx - cx, dy = my - cy, L = Math.hypot(dx, dy) || 1;
      svg.append(txt(cb5R(mx + dx / L * 32), cb5R(my + dy / L * 26), t, 15, { fill: CB5.blue, "pointer-events": "none" })); });
    if (o.after) o.after(svg, S, vis);
  };
  // 끌어서 돌리기 / 눌러서 고르기
  let down = null;
  svg.addEventListener("pointerdown", e => { const p = svgPt(svg, e); down = { p, yaw: st.yaw, pitch: st.pitch, k: e.target && e.target.dataset ? e.target.dataset.k : null, moved: false }; try { svg.setPointerCapture(e.pointerId); } catch (er) { } });
  svg.addEventListener("pointermove", e => { if (!down) return; const p = svgPt(svg, e), dx = p.x - down.p.x, dy = p.y - down.p.y;
    if (!down.moved && Math.hypot(dx, dy) < 7) return; down.moved = true; if (o.fixed) return;
    st.yaw = down.yaw + dx * .6; st.pitch = Math.max(-80, Math.min(80, down.pitch + dy * .5)); draw(); o.onTurn && o.onTurn(st, vis); });
  const up = () => { if (!down) return; const d = down; down = null; if (!d.moved && d.k && o.tap) { const t = d.k[0], i = +d.k.slice(1); (t === "f" ? o.tap.face : t === "e" ? o.tap.edge : o.tap.vert)(i); } };
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", () => { down = null; });
  const turn = (dy, dp) => { st.yaw += dy; st.pitch = Math.max(-80, Math.min(80, st.pitch + dp)); draw(); o.onTurn && o.onTurn(st, vis); };
  const tools = o.fixed ? null : h("div", { class: "cb5btns" }, h("span", { class: "cb5small" }, "끌거나 눌러서 돌려요:"),
    h("button", { onclick: () => turn(-30, 0), "aria-label": "왼쪽으로 돌리기" }, "◀"), h("button", { onclick: () => turn(30, 0), "aria-label": "오른쪽으로 돌리기" }, "▶"),
    h("button", { onclick: () => turn(0, -30), "aria-label": "위로 돌리기" }, "▲"), h("button", { onclick: () => turn(0, 30), "aria-label": "아래로 돌리기" }, "▼"),
    h("button", { onclick: () => { st.yaw = o.yaw == null ? -35 : o.yaw; st.pitch = o.pitch == null ? 24 : o.pitch; draw(); o.onTurn && o.onTurn(st, vis); } }, "처음 모양"));
  draw();
  return { svg, tools, draw, st, vis: () => vis, el: h("div", {}, svg, tools) };
}
/* 면·모서리·꼭짓점 세기: 보이는 것을 눌러 표시하고, 돌려서 뒤쪽도 찾아요 */
function cb5Count(body, api, opt) {
  const kinds = opt.kinds || ["face", "edge", "vert"], NM = { face: "면", edge: "모서리", vert: "꼭짓점" }, ALL = { face: 6, edge: 12, vert: 8 };
  let kind = kinds[0];
  const got = { face: new Set(), edge: new Set(), vert: new Set() }, doneK = new Set();
  const fillOf = fi => got.face.has(fi) ? CB5.pick : (opt.fillAll || null);
  const S = cb5Solid({ dims: opt.dims, yaw: opt.yaw, pitch: opt.pitch, fill: fillOf, mark: { edges: got.edge, verts: got.vert },
    faceText: fi => got.face.has(fi) ? String([...got.face].indexOf(fi) + 1) : "",
    tap: { face: fi => tap("face", fi), edge: ei => tap("edge", ei), vert: v => tap("vert", v) } });
  const read = h("div", { class: "cb5read" });
  const kb = h("div", { class: "cb5btns" }, h("span", { class: "cb5small" }, "세는 것: "), ...kinds.map(k => h("button", { "data-k": k, onclick: () => { kind = k; paint(); } }, NM[k])));
  const paint = () => {
    [...kb.querySelectorAll("button")].forEach(b => b.classList.toggle("cb5-pick", b.dataset.k === kind));
    read.textContent = kinds.map(k => `${NM[k]} ${got[k].size}개${doneK.has(k) ? " ✓" : ""}`).join(" · ") + ` — 지금은 ${cb5Jo(NM[kind], "을/를")} 눌러 세요.`;
    S.draw();
  };
  function tap(k, i) {
    if (k !== kind) return api.hint(`지금은 ${cb5Jo(NM[kind], "을/를")} 세고 있어요. 위의 단추로 바꿀 수 있어요.`);
    got[k].has(i) ? got[k].delete(i) : got[k].add(i);
    if (got[k].size === ALL[k] && !doneK.has(k)) { doneK.add(k); api.hint(`○ ${cb5Jo(NM[k], "을/를")} 모두 찾았어요.`); const nk = kinds.find(x => !doneK.has(x)); if (nk) kind = nk; }
    paint();
    if (kinds.every(x => doneK.has(x))) cb5Then(body, api, opt, kinds.map(x => `${NM[x]} ${ALL[x]}`).join(", "), opt.msg || "돌려 가며 모두 찾았어요.");
  }
  api.provide({ words: ["면 6개", "모서리 12개", "꼭짓점 8개", "돌려서 뒤쪽 보기"], answers: ["면 6개, 모서리 12개, 꼭짓점 8개"] });
  body.append(...(opt.tip ? [h("p", { class: "cb5small" }, opt.tip)] : []), kb, S.svg, S.tools, read);
  paint();
}
/* 면 고르기: 그림을 돌려 가며 면을 눌러 골라요. opt: {dims, lab, base(색칠한 면), need(정답 면 번호들), msg, why} */
function cb5FacePick(body, api, opt) {
  const sel = new Set();
  const base = [].concat(opt.base == null ? [] : opt.base);
  const S = cb5Solid({ dims: opt.dims, yaw: opt.yaw, pitch: opt.pitch, lab: opt.lab == null ? true : opt.lab,
    fill: fi => base.includes(fi) ? (opt.baseColor || CB5.par) : sel.has(fi) ? CB5.pick : null,
    faceText: fi => base.includes(fi) ? (opt.baseText || "색칠한 면") : sel.has(fi) ? "✓" : "",
    tap: { face: fi => { if (base.includes(fi)) return api.hint("색칠한 면이에요. 다른 면을 골라요."); sel.has(fi) ? sel.delete(fi) : sel.add(fi); paint(); } } });
  const lab = opt.lab && opt.lab !== true ? opt.lab : CB5_LAB;
  const read = h("div", { class: "cb5read" });
  const paint = () => { S.draw(); read.textContent = opt.lab === false ? `고른 면: ${sel.size}개` : sel.size ? "고른 면: " + [...sel].map(f => cb5FaceName(f, lab)).join(", ") : "면을 눌러 골라요(다시 누르면 빠져요)."; };
  api.provide({ words: opt.need.map(f => cb5FaceName(f, lab)), answers: [opt.need.map(f => cb5FaceName(f, lab)).join(", ")] });
  body.append(S.svg, S.tools, read, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = [...sel].map(f => cb5FaceName(f, lab)).join(", ") || "-";
    const ok = sel.size === opt.need.length && opt.need.every(f => sel.has(f));
    if (ok) return cb5Then(body, api, opt, ans, opt.msg);
    const extra = [...sel].find(f => !opt.need.includes(f));
    api.fail(extra != null ? (opt.whyExtra ? opt.whyExtra(extra) : `${cb5FaceName(extra, lab)}은 답이 아니에요.`) : (opt.whyFew || `아직 ${opt.need.length - sel.size}개 더 있어요. 그림을 돌려 뒤쪽도 살펴봐요.`), ans);
  } }, "확인하기")));
  paint();
}

/* =========================================================
   2. 겨냥도 그림(비스듬히 본 그림) — 앞면 다각형 P를 깊이 D만큼 밀어 낸 입체
   o: {P(y 위쪽), D, k, ang, f, hidden:"dash"|"solid"|"none", miss:[모서리 키], fill:{front,back,s0…}, lab:[…], dims:[{u,v,t}], maxW}
   모서리 키: f0…(앞면), b0…(뒷면), d0…(깊이 방향)
   ========================================================= */
function cb5Prism(o) {
  const P = o.P, n = P.length, k = o.k || 26, ang = (o.ang == null ? 38 : o.ang) * Math.PI / 180, f = o.f == null ? .55 : o.f;
  const dv = [Math.cos(ang) * f * o.D, Math.sin(ang) * f * o.D];
  const all = P.concat(P.map(p => [p[0] + dv[0], p[1] + dv[1]]));
  const minx = Math.min(...all.map(p => p[0])), maxy = Math.max(...all.map(p => p[1])), wid = Math.max(...all.map(p => p[0])) - minx, hei = maxy - Math.min(...all.map(p => p[1]));
  const pad = o.pad == null ? 30 : o.pad, W = wid * k + pad * 2, H = hei * k + pad * 2;
  const S = all.map(p => [pad + k * (p[0] - minx), pad + k * (maxy - p[1])]);
  const sideVis = P.map((p, i) => { const q = P[(i + 1) % n], nx = q[1] - p[1], ny = -(q[0] - p[0]); return nx * dv[0] + ny * dv[1] > 1e-9; });
  const E = [];
  for (let i = 0; i < n; i++) { const j = (i + 1) % n;
    E.push({ key: "f" + i, a: i, b: j, vis: true });
    E.push({ key: "b" + i, a: n + i, b: n + j, vis: sideVis[i] });
    E.push({ key: "d" + i, a: i, b: n + i, vis: sideVis[i] || sideVis[(i + n - 1) % n] }); }
  const fill = o.fill || {};
  return cb5Fig(W, H, svg => {
    const poly = (idx, c, op) => svg.append(svgEl("polygon", { points: idx.map(i => S[i].map(cb5R).join(",")).join(" "), fill: c, "fill-opacity": op, stroke: "none" }));
    if (fill.back) poly(P.map((_, i) => n + i), fill.back, .5);
    P.forEach((_, i) => { const c = fill["s" + i]; if (c && !sideVis[i]) poly([i, (i + 1) % n, n + (i + 1) % n, n + i], c, .5); });
    P.forEach((_, i) => { const c = fill["s" + i] || (o.tint ? o.tint : null); if (c && sideVis[i]) poly([i, (i + 1) % n, n + (i + 1) % n, n + i], c, .9); });
    poly(P.map((_, i) => i), fill.front || o.tint || "#F4F8FC", .9);
    E.forEach(e => {
      if ((o.miss || []).includes(e.key)) return;
      if (!e.vis && o.hidden === "none") return;
      const ln = svgEl("line", { x1: cb5R(S[e.a][0]), y1: cb5R(S[e.a][1]), x2: cb5R(S[e.b][0]), y2: cb5R(S[e.b][1]), stroke: (o.red || []).includes(e.key) ? CB5.red : CB5.ink, "stroke-width": e.vis ? 2.4 : 1.8, "stroke-linecap": "round" });
      if (!e.vis && o.hidden !== "solid") ln.setAttribute("stroke-dasharray", "6 5");
      svg.append(ln);
    });
    const cx = S.reduce((s, p) => s + p[0], 0) / S.length, cy = S.reduce((s, p) => s + p[1], 0) / S.length;
    (o.lab || []).forEach((t, i) => { if (!t) return; const dx = S[i][0] - cx, dy = S[i][1] - cy, L = Math.hypot(dx, dy) || 1; svg.append(txt(cb5R(S[i][0] + dx / L * 15), cb5R(S[i][1] + dy / L * 15), t, 16, { fill: CB5.ink })); });
    (o.dims || []).forEach(d => { const A = S[d.u], B = S[d.v], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2; let dx = mx - cx, dy = my - cy; const L = Math.hypot(dx, dy) || 1;
      svg.append(txt(cb5R(mx + dx / L * (d.d || 18)), cb5R(my + dy / L * (d.d || 18)), d.t, d.size || 15, { fill: d.color || CB5.blue })); });
    if (o.extra) o.extra(svg, S);
  }, o.maxW || "16em", o.plain);
}
/* 직육면체 겨냥도: o {W,H,D, lab:true|{번호:이름}, dims:[[u,v,"4 cm"]], fill:{면 번호: 색}, hidden, miss:[[u,v]], red:[[u,v]], k, maxW} (꼭짓점 번호는 CB5_LAB과 같음) */
const CB5_PI = [0, 1, 3, 2, 4, 5, 7, 6];       // 겨냥도 꼭짓점 차례 → 꼭짓점 번호
const CB5_SIDE = { 0: "front", 1: "back", 4: "s0", 3: "s1", 5: "s2", 2: "s3" };
function cb5EdgeKey(u, v) {
  const a = CB5_PI.indexOf(u), b = CB5_PI.indexOf(v), fa = a < 4, fb = b < 4;
  if (fa && fb) { const i = (b === (a + 1) % 4) ? a : b; return "f" + i; }
  if (!fa && !fb) { const x = a - 4, y = b - 4, i = (y === (x + 1) % 4) ? x : y; return "b" + i; }
  return "d" + (fa ? a : b);
}
function cb5Cub(o) {
  const fill = {}; Object.entries(o.fill || {}).forEach(([fi, c]) => { fill[CB5_SIDE[fi]] = c; });
  const labMap = o.lab === true ? CB5_LAB : o.lab;
  return cb5Prism({ P: [[0, 0], [o.W, 0], [o.W, o.H], [0, o.H]], D: o.D, k: o.k, f: o.f, ang: o.ang, hidden: o.hidden, maxW: o.maxW, tint: o.tint, plain: o.plain, pad: o.pad,
    fill, lab: labMap ? CB5_PI.map(v => labMap[v]) : null,
    miss: (o.miss || []).map(([u, v]) => cb5EdgeKey(u, v)), red: (o.red || []).map(([u, v]) => cb5EdgeKey(u, v)),
    dims: (o.dims || []).map(([u, v, t]) => ({ u: CB5_PI.indexOf(u), v: CB5_PI.indexOf(v), t, d: o.dimD, size: o.dimSize })), extra: o.extra });
}

/* =========================================================
   3. 모눈에 겨냥도 긋기
   opt: {W,H, dx,dy(깊이 방향 모눈 칸), cols, rows, ox, oy, k, mode:"draw"|"fix"|"pick", given:[모서리 번호…], ask|then, ok, msg}
   draw: 점에서 점까지 끌어 긋기(실선 펜·점선 펜), 지우개 / fix: 선을 눌러 실선↔점선 / pick: 보이지 않는 모서리 누르기
   ========================================================= */
function cb5Sketch(body, api, opt) {
  const k = opt.k || 32, pad = 18, cols = opt.cols, rows = opt.rows, Wd = cols * k + pad * 2, Hd = rows * k + pad * 2;
  const m = p => [pad + p[0] * k, pad + p[1] * k];
  const ox = opt.ox == null ? 1 : opt.ox, oy = opt.oy == null ? 1 : opt.oy;
  const V = v => [ox + ((v & 1) ? opt.W : 0) + ((v & 4) ? opt.dx : 0), oy + opt.dy + opt.H - ((v & 2) ? opt.H : 0) - ((v & 4) ? opt.dy : 0)];
  const need = CB5_EDGES.map(([u, v]) => ({ a: V(u), b: V(v), style: (u === 4 || v === 4) ? "dash" : "solid" }));
  const same = (s, t) => (s.a[0] === t.a[0] && s.a[1] === t.a[1] && s.b[0] === t.b[0] && s.b[1] === t.b[1]) || (s.a[0] === t.b[0] && s.a[1] === t.b[1] && s.b[0] === t.a[0] && s.b[1] === t.a[1]);
  const mode = opt.mode || "draw";
  let segs = [];
  if (mode === "draw") segs = (opt.given || []).map(i => Object.assign({ locked: true }, need[i]));
  else if (mode === "fix") segs = need.map(s => ({ a: s.a, b: s.b, style: "solid" }));
  else segs = need.map(s => ({ a: s.a, b: s.b, style: s.style, mark: false }));
  let pen = "solid", fin = false;
  const svg = makeSvg(Wd, Hd); svg.setAttribute("class", "cb5fig"); svg.style.maxWidth = opt.maxW || "30em";
  const read = h("div", { class: "cb5read" });
  let prev = null;
  const draw = () => {
    svg.innerHTML = "";
    const g = svgEl("g", { stroke: CB5.grid, "stroke-width": 1 });
    for (let x = 0; x <= cols; x++) g.append(svgEl("line", { x1: m([x, 0])[0], y1: m([x, 0])[1], x2: m([x, rows])[0], y2: m([x, rows])[1] }));
    for (let y = 0; y <= rows; y++) g.append(svgEl("line", { x1: m([0, y])[0], y1: m([0, y])[1], x2: m([cols, y])[0], y2: m([cols, y])[1] }));
    svg.append(g);
    if (opt.shade !== false && mode !== "draw") { /* 고치기·찾기는 면을 살짝 칠해 둠 */ }
    for (let x = 0; x <= cols; x++) for (let y = 0; y <= rows; y++) { const P = m([x, y]); svg.append(svgEl("circle", { cx: P[0], cy: P[1], r: 1.8, fill: "#A9BBCB", "pointer-events": "none" })); }
    segs.forEach((s, i) => {
      const A = m(s.a), B = m(s.b);
      const ln = svgEl("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: s.locked ? CB5.ink : s.bad ? CB5.red : CB5.blue, "stroke-width": 3, "stroke-linecap": "round", "pointer-events": "none" });
      if (s.style === "dash") ln.setAttribute("stroke-dasharray", "8 7");
      if (mode === "fix" || mode === "pick") ln.setAttribute("stroke", s.bad ? CB5.red : CB5.ink);
      svg.append(ln);
      if (s.mark) { svg.append(svgEl("ellipse", { cx: (A[0] + B[0]) / 2, cy: (A[1] + B[1]) / 2, rx: 15, ry: 15, fill: "none", stroke: CB5.red, "stroke-width": 2.5, "pointer-events": "none" })); }
      if (!s.locked) { const hit = svgEl("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: "transparent", "stroke-width": 20, class: "cb5hit" }); hit.dataset.k = String(i); svg.append(hit); }
    });
    if (prev) { const A = m(prev.a), B = m(prev.b); const ln = svgEl("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: CB5.org, "stroke-width": 3, "pointer-events": "none" }); if (pen === "dash") ln.setAttribute("stroke-dasharray", "8 7"); svg.append(ln); }
    const nS = segs.filter(s => s.style === "solid").length, nD = segs.filter(s => s.style === "dash").length;
    read.textContent = mode === "pick" ? `○표 한 모서리: ${segs.filter(s => s.mark).length}개` : `실선 ${nS}개 · 점선 ${nD}개`;
  };
  const snap = p => [Math.max(0, Math.min(cols, Math.round((p.x - pad) / k))), Math.max(0, Math.min(rows, Math.round((p.y - pad) / k)))];
  let down = null;
  svg.addEventListener("pointerdown", e => { if (fin) return; const p = svgPt(svg, e); down = { p, g: snap(p), k: e.target.dataset ? e.target.dataset.k : null, moved: false }; try { svg.setPointerCapture(e.pointerId); } catch (er) { } });
  svg.addEventListener("pointermove", e => { if (!down || mode !== "draw" || pen === "erase") return; const p = svgPt(svg, e); if (!down.moved && Math.hypot(p.x - down.p.x, p.y - down.p.y) < k * .45) return;
    down.moved = true; prev = { a: down.g, b: snap(p) }; draw(); });
  svg.addEventListener("pointerup", e => {
    if (!down) return; const d = down; down = null;
    if (d.moved && prev) { const s = prev; prev = null;
      if (s.a[0] !== s.b[0] || s.a[1] !== s.b[1]) { const old = segs.find(t => same(t, s)); if (old) { if (!old.locked) old.style = pen; } else segs.push({ a: s.a, b: s.b, style: pen }); segs.forEach(t => { t.bad = false; }); }
      draw(); return; }
    prev = null;
    if (d.k == null) { draw(); return; }
    const s = segs[+d.k]; if (!s) return; s.bad = false;
    if (mode === "draw") { if (pen === "erase") segs.splice(+d.k, 1); else s.style = pen; }
    else if (mode === "fix") s.style = s.style === "solid" ? "dash" : "solid";
    else s.mark = !s.mark;
    draw();
  });
  svg.addEventListener("pointercancel", () => { down = null; prev = null; draw(); });
  const pens = h("div", { class: "cb5btns" });
  if (mode === "draw") {
    const mk = (p, t) => h("button", { "data-p": p, onclick: () => { pen = p; [...pens.querySelectorAll("button[data-p]")].forEach(b => b.classList.toggle("cb5-pick", b.dataset.p === pen)); } }, t);
    pens.append(h("span", { class: "cb5small" }, "펜: "), mk("solid", "━ 실선"), mk("dash", "┅ 점선"), mk("erase", "지우개"),
      h("button", { onclick: () => { if (fin) return; segs = segs.filter(s => s.locked); draw(); } }, "처음부터"));
    pens.querySelector("button[data-p=solid]").classList.add("cb5-pick");
  }
  api.provide({ words: ["보이는 모서리는 실선", "보이지 않는 모서리는 점선", "실선 9개", "점선 3개"], answers: [mode === "pick" ? "보이지 않는 모서리 3개(점선)에 ○표" : "보이는 모서리 9개는 실선, 보이지 않는 모서리 3개는 점선"] });
  const check = h("button", { class: "big", onclick: () => {
    if (fin) return; api.tryOnce();
    const ans = mode === "pick" ? `○표 ${segs.filter(s => s.mark).length}개` : `실선 ${segs.filter(s => s.style === "solid").length}개, 점선 ${segs.filter(s => s.style === "dash").length}개`;
    if (mode === "pick") {
      const wrong = segs.filter((s, i) => s.mark !== (s.style === "dash")); wrong.forEach(s => { s.bad = true; }); draw();
      if (!wrong.length) { fin = true; return cb5Then(body, api, opt, ans, opt.msg || "보이지 않는 모서리 3개를 모두 찾았어요."); }
      return api.fail(segs.filter(s => s.mark && s.style !== "dash").length ? "보이는 모서리에 ○표를 했어요. 보이지 않는 모서리는 점선으로 그려져 있어요." : "보이지 않는 모서리가 더 있어요. 점선을 모두 찾아요.", ans);
    }
    const extra = segs.filter(s => !need.some(t => same(s, t)));
    const missing = need.filter(t => !segs.some(s => same(s, t)));
    const styleBad = segs.filter(s => { const t = need.find(t => same(s, t)); return t && t.style !== s.style; });
    segs.forEach(s => { s.bad = extra.includes(s) || styleBad.includes(s); }); draw();
    if (extra.length) return api.fail(`필요 없는 선이 ${extra.length}개 있어요(빨간 선). 꼭짓점에서 꼭짓점까지 한 번에 긋고, 지우개로 지워요.`, ans);
    if (missing.length) return api.fail(`빠진 모서리가 ${missing.length}개 있어요. 직육면체의 모서리는 모두 12개예요. 평행한 모서리는 평행하게 그어요.`, ans);
    if (styleBad.length) { const hid = styleBad.filter(s => s.style === "solid").length;
      return api.fail(hid ? "보이지 않는 모서리를 실선으로 그렸어요. 보이지 않는 모서리는 점선으로 나타내요." : "보이는 모서리를 점선으로 그렸어요. 보이는 모서리는 실선으로 나타내요.", ans); }
    fin = true; cb5Then(body, api, opt, ans, opt.msg || "겨냥도를 바르게 그렸어요. 보이는 모서리 9개는 실선, 보이지 않는 모서리 3개는 점선이에요.");
  } }, "확인하기");
  body.append(...(opt.tip ? [h("p", { class: "cb5small" }, opt.tip)] : []), pens, svg, read, h("div", { class: "actions" }, check));
  draw();
}

/* =========================================================
   4. 전개도 그림(평면)과 접고 펴는 움직이는 그림
   ========================================================= */
function cb5Bounds(F) { const xs = F.flatMap(r => [r.x, r.x + r.w]), ys = F.flatMap(r => [r.y, r.y + r.h]); return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }; }
/* 평면 전개도: o {k, pad, grid(모눈 칸 수 여유), color(fi), lab:P, dims:[{a:[x,y],b:[x,y],t}], hingeDash(true), maxW, extra(svg,m), solidAll} */
function cb5NetSvg(F, o = {}) {
  const B = cb5Bounds(F), k = o.k || 28, pad = o.pad == null ? 26 : o.pad, gx = o.gx || 0, gy = o.gy || 0;
  const W = (B.x1 - B.x0 + 2 * gx) * k + pad * 2, H = (B.y1 - B.y0 + 2 * gy) * k + pad * 2;
  const m = p => [cb5R(pad + (p[0] - B.x0 + gx) * k), cb5R(pad + (p[1] - B.y0 + gy) * k)];
  const C = cb5Contacts(F);
  const svg = cb5Fig(W, H, s => {
    if (o.grid) { const g = svgEl("g", { stroke: CB5.grid, "stroke-width": 1 });
      for (let x = B.x0 - gx; x <= B.x1 + gx + 1e-9; x += 1) { const a = m([x, B.y0 - gy]), b = m([x, B.y1 + gy]); g.append(svgEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1] })); }
      for (let y = B.y0 - gy; y <= B.y1 + gy + 1e-9; y += 1) { const a = m([B.x0 - gx, y]), b = m([B.x1 + gx, y]); g.append(svgEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1] })); }
      s.append(g); }
    F.forEach((r, fi) => { const a = m([r.x, r.y]), b = m([r.x + r.w, r.y + r.h]);
      const e = svgEl("rect", { x: a[0], y: a[1], width: cb5R(b[0] - a[0]), height: cb5R(b[1] - a[1]), fill: (o.color && o.color(fi)) || "#EEF5FC", stroke: "none" });
      if (o.tapFace) { e.classList.add("cb5hit"); e.dataset.f = fi; } s.append(e);
      if (o.faceText) { const t = o.faceText(fi); if (t) s.append(txt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, t, o.faceSize || 16, { fill: CB5.ink, "pointer-events": "none" })); } });
    // 둘레(실선)와 맞닿은 곳(점선)
    F.forEach((r, ri) => { if (ri === o.skip) return; const c = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]];
      for (let i = 0; i < 4; i++) { const a = c[i], b = c[(i + 1) % 4];
        // 이 변에서 다른 면과 맞닿은 부분은 빼고 그림
        const cuts = C.filter(t => (t.i === F.indexOf(r) || t.j === F.indexOf(r)) && ((cb5Eq(a[0], b[0]) && cb5Eq(t.A[0], a[0]) && cb5Eq(t.B[0], a[0])) || (cb5Eq(a[1], b[1]) && cb5Eq(t.A[1], a[1]) && cb5Eq(t.B[1], a[1]))));
        const horiz = cb5Eq(a[1], b[1]), lo = horiz ? Math.min(a[0], b[0]) : Math.min(a[1], b[1]), hi = horiz ? Math.max(a[0], b[0]) : Math.max(a[1], b[1]);
        let pieces = [[lo, hi]];
        cuts.forEach(t => { const c0 = horiz ? Math.min(t.A[0], t.B[0]) : Math.min(t.A[1], t.B[1]), c1 = horiz ? Math.max(t.A[0], t.B[0]) : Math.max(t.A[1], t.B[1]);
          pieces = pieces.flatMap(([u, v]) => { const out = []; if (c0 > u + 1e-9) out.push([u, Math.min(v, c0)]); if (c1 < v - 1e-9) out.push([Math.max(u, c1), v]); return out.filter(q => q[1] - q[0] > 1e-9); }); });
        pieces.forEach(([u, v]) => { const A = m(horiz ? [u, a[1]] : [a[0], u]), Bp = m(horiz ? [v, a[1]] : [a[0], v]);
          s.append(svgEl("line", { x1: A[0], y1: A[1], x2: Bp[0], y2: Bp[1], stroke: CB5.ink, "stroke-width": 2.4, "stroke-linecap": "round", "pointer-events": "none" })); }); } });
    C.forEach(t => { if (t.i === o.skip || t.j === o.skip) return; const A = m(t.A), Bp = m(t.B); const e = svgEl("line", { x1: A[0], y1: A[1], x2: Bp[0], y2: Bp[1], stroke: o.solidAll ? CB5.ink : "#56636E", "stroke-width": o.solidAll ? 2.4 : 2, "pointer-events": "none" });
      if (!o.solidAll) e.setAttribute("stroke-dasharray", "6 5"); s.append(e); });
    (o.dims || []).forEach(d => { const A = m(d.a), Bp = m(d.b), mx = (A[0] + Bp[0]) / 2, my = (A[1] + Bp[1]) / 2, horiz = Math.abs(A[1] - Bp[1]) < 1;
      s.append(txt(mx + (horiz ? 0 : (d.side || -1) * 18), my + (horiz ? (d.side || -1) * 13 : 0), d.t, 14, { fill: d.color || CB5.blue, "text-anchor": "middle" })); });
    if (o.lab) { const cx = (B.x0 + B.x1) / 2, cy = (B.y0 + B.y1) / 2;
      o.lab.forEach(p => { const P = m(p), on = F.filter(r => p[0] >= r.x - 1e-6 && p[0] <= r.x + r.w + 1e-6 && p[1] >= r.y - 1e-6 && p[1] <= r.y + r.h + 1e-6);
        // 이름표는 면 바깥쪽으로 조금 비켜 씀
        let dx = 0, dy = 0; on.forEach(r => { dx += p[0] - (r.x + r.w / 2); dy += p[1] - (r.y + r.h / 2); }); const L = Math.hypot(dx, dy) || 1;
        s.append(txt(cb5R(P[0] + dx / L * 13), cb5R(P[1] + dy / L * 13), p[2], 15, { fill: CB5.ink, "pointer-events": "none" })); }); }
    if (o.extra) o.extra(s, m);
  }, o.maxW || "26em", o.plain);
  return { svg, m, B, k, pad };
}
/* 접고 펴기: F(전개도), opt {lab:P, root, start(0 펼침|1 접힘), size:[W,H], yaw, pitch, color(fi), onT(t)} */
function cb5FoldView(F, opt = {}) {
  const W = (opt.size && opt.size[0]) || 440, H = (opt.size && opt.size[1]) || 300;
  const svg = makeSvg(W, H); svg.setAttribute("class", "cb5fig"); svg.style.maxWidth = opt.maxW || "28em";
  const C = cb5Contacts(F), B = cb5Bounds(F), cx = (B.x0 + B.x1) / 2, cz = (B.y0 + B.y1) / 2;
  const deg = F.map((_, i) => C.filter(c => c.i === i || c.j === i).length);
  const root = opt.root == null ? deg.indexOf(Math.max(...deg)) : opt.root;
  const par = F.map(() => null), seen = [root], q = [root];
  while (q.length) { const f = q.shift(); C.forEach(c => { if (c.i !== f && c.j !== f) return; const g = c.i === f ? c.j : c.i; if (seen.includes(g)) return; seen.push(g); q.push(g);
    const A = [c.A[0] - cx, 0, c.A[1] - cz], Bp = [c.B[0] - cx, 0, c.B[1] - cz]; let u = [Bp[0] - A[0], 0, Bp[2] - A[2]]; const L = Math.hypot(u[0], u[2]); u = [u[0] / L, 0, u[2] / L];
    const r = F[g], d = [r.x + r.w / 2 - cx - A[0], 0, r.y + r.h / 2 - cz - A[2]]; if (u[2] * d[0] - u[0] * d[2] < 0) u = [-u[0], 0, -u[2]];
    par[g] = { p: f, A, u, c }; }); }
  const rot = (P, A, u, th) => { const v = [P[0] - A[0], P[1] - A[1], P[2] - A[2]], c = Math.cos(th), s = Math.sin(th), dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    return [0, 1, 2].map(i => A[i] + v[i] * c + cr[i] * s + u[i] * dot * (1 - c)); };
  const st = { t: opt.start == null ? 0 : opt.start, yaw: opt.yaw == null ? -20 : opt.yaw, pitch: opt.pitch == null ? 50 : opt.pitch };
  const span = Math.max(B.x1 - B.x0, B.y1 - B.y0), sc = Math.min(W, H) * .86 / span;
  const tf = (fi, p) => { let P = [p[0] - cx, 0, p[1] - cz], g = fi; const th = st.t * Math.PI / 2; while (par[g]) { P = rot(P, par[g].A, par[g].u, th); g = par[g].p; } return P; };
  const hinge = (fi, a, b) => C.some(c => (c.i === fi || c.j === fi) && ((cb5Eq(a[0], b[0]) && cb5Eq(c.A[0], a[0]) && cb5Eq(c.B[0], a[0]) && Math.min(c.A[1], c.B[1]) < Math.max(a[1], b[1]) - 1e-9 && Math.max(c.A[1], c.B[1]) > Math.min(a[1], b[1]) + 1e-9) ||
    (cb5Eq(a[1], b[1]) && cb5Eq(c.A[1], a[1]) && cb5Eq(c.B[1], a[1]) && Math.min(c.A[0], c.B[0]) < Math.max(a[0], b[0]) - 1e-9 && Math.max(c.A[0], c.B[0]) > Math.min(a[0], b[0]) + 1e-9)));
  const draw = () => {
    svg.innerHTML = "";
    const a = st.yaw * Math.PI / 180, b = st.pitch * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), cbb = Math.cos(b), sb = Math.sin(b);
    const pr = P => { const X1 = P[0] * ca + P[2] * sa, Z1 = -P[0] * sa + P[2] * ca, Y2 = P[1] * cbb - Z1 * sb, Z2 = P[1] * sb + Z1 * cbb; return [X1, Y2, Z2]; };
    const faces = F.map((r, fi) => { const c = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]]; const Q = c.map(p => pr(tf(fi, p))); return { fi, c, Q, z: Q.reduce((s, q) => s + q[2], 0) / 4 }; });
    const all = faces.flatMap(f => f.Q), mx = (Math.min(...all.map(q => q[0])) + Math.max(...all.map(q => q[0]))) / 2, my = (Math.min(...all.map(q => q[1])) + Math.max(...all.map(q => q[1]))) / 2;
    const S = q => [cb5R(W / 2 + (q[0] - mx) * sc), cb5R(H / 2 - (q[1] - my) * sc)];
    faces.sort((u, v) => u.z - v.z).forEach(f => {
      const pts = f.Q.map(S);
      svg.append(svgEl("polygon", { points: pts.map(p => p.join(",")).join(" "), fill: (opt.color && opt.color(f.fi)) || (f.fi === root ? "#FFE7B8" : CB5.f[f.fi % 6]), "fill-opacity": .93, stroke: "none" }));
      for (let i = 0; i < 4; i++) { const p = pts[i], q2 = pts[(i + 1) % 4], hg = hinge(f.fi, f.c[i], f.c[(i + 1) % 4]);
        const ln = svgEl("line", { x1: p[0], y1: p[1], x2: q2[0], y2: q2[1], stroke: hg ? "#56636E" : CB5.ink, "stroke-width": hg ? 1.8 : 2.3, "stroke-linecap": "round" }); if (hg) ln.setAttribute("stroke-dasharray", "6 5"); svg.append(ln); }
      if (opt.faceText) { const t = opt.faceText(f.fi); if (t) { const c = pts.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]); svg.append(txt(cb5R(c[0]), cb5R(c[1]), t, 14, { fill: CB5.ink })); } }
    });
    (opt.lab || []).forEach(p => { const fi = F.findIndex(r => p[0] >= r.x - 1e-6 && p[0] <= r.x + r.w + 1e-6 && p[1] >= r.y - 1e-6 && p[1] <= r.y + r.h + 1e-6); if (fi < 0) return;
      const r = F[fi], P = S(pr(tf(fi, p))), c = S(pr(tf(fi, [r.x + r.w / 2, r.y + r.h / 2]))), dx = P[0] - c[0], dy = P[1] - c[1], L = Math.hypot(dx, dy) || 1;
      svg.append(txt(cb5R(P[0] + dx / L * 11), cb5R(P[1] + dy / L * 11), p[2], 14, { fill: opt.labColor ? opt.labColor(p[2]) : CB5.red, stroke: "#fff", "stroke-width": 3, "paint-order": "stroke" })); });
  };
  const rng = h("input", { type: "range", min: 0, max: 100, value: Math.round(st.t * 100), "aria-label": "접은 정도", oninput: e => { st.t = +e.currentTarget.value / 100; draw(); opt.onT && opt.onT(st.t); } });
  let timer = null;
  const play = to => { clearInterval(timer); timer = setInterval(() => { const d = to > st.t ? .04 : -.04; st.t = Math.abs(to - st.t) <= .04 ? to : st.t + d; rng.value = Math.round(st.t * 100); draw(); if (st.t === to) { clearInterval(timer); opt.onT && opt.onT(st.t); } }, 30); };
  let down = null;
  svg.addEventListener("pointerdown", e => { down = { p: svgPt(svg, e), yaw: st.yaw, pitch: st.pitch }; try { svg.setPointerCapture(e.pointerId); } catch (er) { } });
  svg.addEventListener("pointermove", e => { if (!down) return; const p = svgPt(svg, e); st.yaw = down.yaw + (p.x - down.p.x) * .6; st.pitch = Math.max(5, Math.min(89, down.pitch + (p.y - down.p.y) * .4)); draw(); });
  svg.addEventListener("pointerup", () => { down = null; }); svg.addEventListener("pointercancel", () => { down = null; });
  const bar = h("div", { class: "cb5slider" }, h("button", { class: "ghost", onclick: () => play(0) }, "펼치기"), h("span", { class: "cb5small" }, "펼침"), rng, h("span", { class: "cb5small" }, "접힘"), h("button", { class: "ghost", onclick: () => play(1) }, "접기"));
  draw();
  return { el: h("div", {}, svg, bar, h("p", { class: "cb5small" }, "그림을 끌면 보는 방향이 바뀌어요. 노란 면은 바닥에 놓인 면이에요.")), svg, draw, play, st };
}
/* 접기·펴기 해 보기: 끝까지 펴거나(goal 0) 접으면(goal 1) 해결 */
function cb5FoldStep(body, api, opt) {
  let fin = false;
  const V = cb5FoldView(opt.F, Object.assign({}, opt, { onT: t => { if (fin || Math.abs(t - opt.goal) > .001) return; fin = true; cb5Then(body, api, opt, opt.goal ? "끝까지 접음" : "끝까지 폄", opt.msg); } }));
  api.provide({ words: opt.words || ["모서리를 잘라서 펼친 그림", "전개도"], answers: [] });
  body.append(...(opt.tip ? [h("p", { class: "cb5small" }, opt.tip)] : []), V.el);
}
/* 전개도 후보 판정: nets [{F, name}], 'can'(될 수 있는 것) 또는 'cannot'(될 수 없는 것)을 모두 고르기 */
function cb5NetJudge(body, api, opt) {
  const res = opt.nets.map(n => cb5Fold(n.F)), want = opt.want || "can";
  const ans = opt.nets.map((n, i) => i).filter(i => want === "can" ? res[i].ok : !res[i].ok);
  const sel = new Set(), panel = h("div");
  const cards = opt.nets.map((n, i) => {
    const N = cb5NetSvg(n.F, { k: opt.k || 18, pad: 12, grid: opt.grid, dims: n.dims, maxW: "100%", plain: true });
    const c = h("div", { class: "cb5card" }, h("div", {}, n.name), N.svg, h("button", { class: "ghost", style: "font-size:.85em", onclick: e => { e.stopPropagation(); showFold(i); } }, "접어 보기"));
    c.addEventListener("click", () => { sel.has(i) ? sel.delete(i) : sel.add(i); c.classList.toggle("cb5-pick", sel.has(i)); c.classList.remove("cb5-good", "cb5-bad"); });
    return c;
  });
  let folds = 0;
  function showFold(i) {
    if (opt.noFold) return; folds++;
    panel.innerHTML = ""; const V = cb5FoldView(opt.nets[i].F, { start: 0, size: [420, 280] });
    panel.append(h("div", { class: "jua" }, `${opt.nets[i].name}를 접어 봐요`), V.el); V.play(1); cb5Go(panel);
  }
  api.provide({ words: ans.map(i => opt.nets[i].name), answers: [ans.map(i => opt.nets[i].name).join(", ")] });
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), h("div", { class: "cb5cards", style: "grid-template-columns:repeat(auto-fill,minmax(" + (opt.cardW || "11em") + ",1fr))" }, ...cards), panel,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const got = [...sel].sort().map(i => opt.nets[i].name).join(", ") || "-";
      cards.forEach((c, i) => { c.classList.remove("cb5-good", "cb5-bad"); if (sel.has(i)) c.classList.add(ans.includes(i) ? "cb5-good" : "cb5-bad"); });
      const wrong = [...sel].find(i => !ans.includes(i)), miss = ans.find(i => !sel.has(i));
      if (wrong == null && miss == null) return cb5Then(body, api, opt, got, opt.msg);
      if (wrong != null) return api.fail(want === "can" ? `${opt.nets[wrong].name}는 ${CB5_WHY[res[wrong].why].replace(/요\.$/, "요.")} ‘접어 보기’로 확인해 봐요.` : `${opt.nets[wrong].name}는 접으면 ${opt.solid || "정육면체"}가 돼요.`, got);
      api.fail(`${opt.nets[miss].name}도 다시 살펴봐요. ‘접어 보기’를 눌러 확인할 수 있어요.`, got);
    } }, "확인하기")));
}
/* 전개도에서 겹치는 점·선분 찾기: {F, P, tasks:[{pt:"ㅌ"}|{seg:"ㄴㄷ"}], k, grid} */
function cb5NetPts(body, api, opt) {
  const F = opt.F, P = opt.P, fd = cb5Fold(F), S = cb5Segs(F, P);
  if (!fd.ok) throw new Error("전개도 오류");
  const segOf = nm => S.find(s => s.nm === nm || s.nm === [...nm].reverse().join(""));
  const tasks = opt.tasks.map(t => {
    if (t.pt) { const ans = cb5SamePts(fd, P, t.pt); return Object.assign({ kind: "pt", ans, q: `점 ${cb5Jo(t.pt, "과/와")} 겹치는 점을 ${ans.length > 1 ? "모두 " : ""}눌러요.` }, t); }
    const s0 = segOf(t.seg), m = cb5SameSeg(fd, S, s0);
    const va = fd.pt.get(s0.a[0] + "," + s0.a[1]);
    const nm = s => { const x = fd.pt.get(s.a[0] + "," + s.a[1]), [p0, p1] = x === va ? [s.a, s.b] : [s.b, s.a]; return t.seg === s0.nm ? p0[2] + p1[2] : p1[2] + p0[2]; };
    return Object.assign({ kind: "seg", s0, ans: m, ansNm: m.map(nm), q: `선분 ${cb5Jo(t.seg, "과/와")} 겹치는 선분을 눌러요.` }, t);
  });
  let ti = 0; const sel = new Set();
  const wrap = h("div"), qline = h("div", { class: "jua" }), log = h("div", { class: "cb5small" }), foldBox = h("div");
  const draw = () => {
    wrap.innerHTML = ""; const T = tasks[ti];
    const N = cb5NetSvg(F, { k: opt.k || 40, grid: opt.grid, maxW: opt.maxW || "30em", extra: (s, m) => {
      S.forEach((sg, i) => { const A = m(sg.a), B = m(sg.b);
        const target = T && T.kind === "seg" && sg === T.s0, on = T && T.kind === "seg" && sel.has(i);
        if (target || on) s.append(svgEl("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: target ? CB5.red : CB5.blue, "stroke-width": 6, "stroke-linecap": "round", "pointer-events": "none" }));
        if (T && T.kind === "seg") { const hit = svgEl("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: "transparent", "stroke-width": 20, class: "cb5hit" }); hit.addEventListener("click", () => { if (sg === T.s0) return; sel.has(i) ? sel.delete(i) : sel.add(i); draw(); }); s.append(hit); } });
      P.forEach((p, i) => { const A = m(p), target = T && T.kind === "pt" && p[2] === T.pt, on = T && T.kind === "pt" && sel.has(i);
        s.append(svgEl("circle", { cx: A[0], cy: A[1], r: target || on ? 7 : 3.5, fill: target ? CB5.red : on ? CB5.blue : CB5.ink, "pointer-events": "none" }));
        if (T && T.kind === "pt") { const c = svgEl("circle", { cx: A[0], cy: A[1], r: 17, fill: "transparent", class: "cb5hit" }); c.addEventListener("click", () => { if (target) return; sel.has(i) ? sel.delete(i) : sel.add(i); draw(); }); s.append(c); } });
    }, lab: P });
    wrap.append(N.svg);
  };
  const next = () => { sel.clear(); qline.textContent = tasks[ti] ? `${ti + 1}/${tasks.length}. ${tasks[ti].q}` : ""; draw(); };
  api.provide({ words: ["접었을 때 만나는 점", "접었을 때 맞닿는 선분"], answers: tasks.map(t => t.kind === "pt" ? `점 ${t.pt} → ${t.ans.map(n => "점 " + n).join(", ")}` : `선분 ${t.seg} → ${t.ansNm.map(n => "선분 " + n).join(", ")}`) });
  const foldBtn = h("button", { class: "ghost", onclick: () => { foldBox.innerHTML = ""; const V = cb5FoldView(F, { lab: P, start: 0, size: [440, 300], labColor: n => { const T = tasks[ti]; return T && (T.pt === n || (T.seg && T.seg.includes(n))) ? CB5.red : "#33414D"; } }); foldBox.append(V.el); V.play(1); cb5Go(foldBox); } }, "접어서 확인하기");
  const check = h("button", { class: "big", onclick: () => {
    const T = tasks[ti]; if (!T) return; api.tryOnce();
    const got = [...sel].map(i => T.kind === "pt" ? P[i][2] : S[i].nm);
    const okSet = T.kind === "pt" ? T.ans : T.ans.map(s => s.nm);
    const good = got.length === okSet.length && okSet.every(x => got.includes(x));
    const gotTxt = (T.kind === "pt" ? got.map(n => "점 " + n) : got.map(n => "선분 " + n)).join(", ") || "-";
    if (!good) return api.fail(got.some(x => !okSet.includes(x)) ? (T.kind === "pt" ? "접었을 때 그 점과 만나지 않는 점을 골랐어요. 접히는 모서리를 따라 하나씩 짝지어 봐요." : "접었을 때 맞닿지 않는 선분이에요. 이웃한 선분부터 짝지어 봐요.") : `아직 더 있어요. 겹치는 ${T.kind === "pt" ? "점" : "선분"}을 모두 찾아요.`, gotTxt);
    log.append(h("div", {}, "✓ " + (T.kind === "pt" ? `점 ${cb5Jo(T.pt, "과/와")} 겹치는 점: ${T.ans.map(n => "점 " + n).join(", ")}` : `선분 ${cb5Jo(T.seg, "과/와")} 겹치는 선분: ${T.ansNm.map(n => "선분 " + n).join(", ")}`)));
    ti++;
    if (ti >= tasks.length) { draw(); return cb5Then(body, api, opt, tasks.map(t => t.kind === "pt" ? t.ans.join(",") : t.ansNm.join(",")).join(" / "), opt.msg || "겹치는 점과 선분을 모두 찾았어요."); }
    api.hint("○ 맞아요! 이어서 찾아봐요."); next();
  } }, "확인하기");
  body.append(qline, wrap, log, h("div", { class: "cb5btns" }, foldBtn), foldBox, h("div", { class: "actions" }, check));
  next();
}
/* 전개도에서 마주 보는 면 짝 찾기(접었을 때 서로 평행한 면) */
function cb5NetPairs(body, api, opt) {
  const F = opt.F, fd = cb5Fold(F); if (!fd.ok) throw new Error("전개도 오류");
  const pairOf = new Map(), cols = ["#9CC3F0", "#F6B38E", "#A9DDB8"]; let sel = null, np = 0;
  const box = h("div"), read = h("div", { class: "cb5read" }, "면 두 개를 차례로 눌러 마주 보는 면을 찾아요.");
  const draw = () => { box.innerHTML = ""; const N = cb5NetSvg(F, { k: opt.k || 26, grid: opt.grid, dims: opt.dims, maxW: opt.maxW || "28em", tapFace: true,
    color: fi => pairOf.has(fi) ? cols[pairOf.get(fi)] : fi === sel ? CB5.pick : "#F4F8FC", faceText: fi => pairOf.has(fi) ? `짝 ${pairOf.get(fi) + 1}` : fi === sel ? "?" : "" });
    N.svg.addEventListener("click", e => { const f = e.target.dataset && e.target.dataset.f; if (f == null) return; tap(+f); }); box.append(N.svg); };
  function tap(f) {
    if (pairOf.has(f)) return;
    if (sel == null) { sel = f; draw(); return; }
    if (sel === f) { sel = null; draw(); return; }
    api.tryOnce();
    if (CB5_OPP[fd.cube[sel]] === fd.cube[f]) { pairOf.set(sel, np); pairOf.set(f, np); np++; sel = null; draw();
      read.textContent = `마주 보는 면 ${np}쌍을 찾았어요.`;
      if (np === 3) cb5Then(body, api, opt, "마주 보는 면 3쌍", opt.msg || "마주 보는 면 3쌍을 모두 찾았어요. 마주 보는 두 면은 모양과 크기가 같아요.");
      return; }
    const a = sel; sel = null; draw();
    api.fail("두 면은 접었을 때 서로 만나요. 마주 보는 면은 접었을 때 만나지 않는 면이에요.", `면 ${a + 1}·면 ${f + 1}`);
  }
  api.provide({ words: ["마주 보는 면", "한 면 건너"], answers: [] });
  body.append(box, read); draw();
}

/* =========================================================
   5. 모눈에 전개도 그리기 — 점에서 대각선 쪽 점까지 끌면 면(직사각형)이 생겨요
   opt: {cols, rows, k, dims:[가로,세로,높이](cm), given:[면], avoid:()=>모양 키, onNet(F), lines(접는 선 점선으로), msg, ok, tip}
   ========================================================= */
function cb5NetDraw(body, api, opt) {
  const k = opt.k || 26, pad = 16, cols = opt.cols, rows = opt.rows, Wd = cols * k + pad * 2, Hd = rows * k + pad * 2;
  const m = p => [pad + p[0] * k, pad + p[1] * k];
  const [a, b, c] = opt.dims, sizes = [[a, b], [b, a], [a, c], [c, a], [b, c], [c, b]];
  const faces = (opt.given || []).map(r => Object.assign({ locked: true }, r));
  let phase = "net", segs = [], prev = null, fin = false;
  const svg = makeSvg(Wd, Hd); svg.setAttribute("class", "cb5fig"); svg.style.maxWidth = opt.maxW || "34em";
  const read = h("div", { class: "cb5read" });
  const draw = () => {
    svg.innerHTML = "";
    const g = svgEl("g", { stroke: CB5.grid, "stroke-width": 1 });
    for (let x = 0; x <= cols; x++) g.append(svgEl("line", { x1: m([x, 0])[0], y1: m([x, 0])[1], x2: m([x, rows])[0], y2: m([x, rows])[1] }));
    for (let y = 0; y <= rows; y++) g.append(svgEl("line", { x1: m([0, y])[0], y1: m([0, y])[1], x2: m([cols, y])[0], y2: m([cols, y])[1] }));
    svg.append(g);
    faces.forEach((r, i) => { const A = m([r.x, r.y]); const e = svgEl("rect", { x: A[0], y: A[1], width: r.w * k, height: r.h * k, fill: r.bad ? "#FBE0E0" : r.locked ? "#E4EDF7" : "#FFF1C7", stroke: "none" }); if (!r.locked && phase === "net") { e.classList.add("cb5hit"); e.dataset.f = i; } svg.append(e);
      svg.append(txt(A[0] + r.w * k / 2, A[1] + r.h * k / 2, `${r.w}×${r.h}`, 12, { fill: "#8795A1", "pointer-events": "none" })); });
    if (phase === "net") faces.forEach(r => { const A = m([r.x, r.y]); svg.append(svgEl("rect", { x: A[0], y: A[1], width: r.w * k, height: r.h * k, fill: "none", stroke: r.locked ? CB5.ink : CB5.blue, "stroke-width": 2.4, "pointer-events": "none" })); });
    else segs.forEach((s, i) => { const A = m(s.a), B = m(s.b);
      const ln = svgEl("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: s.bad ? CB5.red : CB5.ink, "stroke-width": 2.6, "stroke-linecap": "round", "pointer-events": "none" }); if (s.dash) ln.setAttribute("stroke-dasharray", "7 6"); svg.append(ln);
      const hit = svgEl("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: "transparent", "stroke-width": 18, class: "cb5hit" }); hit.dataset.s = i; svg.append(hit); });
    if (prev) { const x0 = Math.min(prev[0][0], prev[1][0]), y0 = Math.min(prev[0][1], prev[1][1]), w = Math.abs(prev[1][0] - prev[0][0]), hh = Math.abs(prev[1][1] - prev[0][1]); const A = m([x0, y0]);
      svg.append(svgEl("rect", { x: A[0], y: A[1], width: w * k, height: hh * k, fill: "#FFE7B8", "fill-opacity": .6, stroke: CB5.org, "stroke-width": 2, "pointer-events": "none" }));
      if (w && hh) svg.append(txt(A[0] + w * k / 2, A[1] + hh * k / 2, `${w} cm × ${hh} cm`, 14, { fill: CB5.org, "pointer-events": "none" })); }
    read.textContent = phase === "net" ? `그린 면: ${faces.length}개` : `접는 선(점선) ${segs.filter(s => s.dash).length}개 · 자르는 선(실선) ${segs.filter(s => !s.dash).length}개`;
  };
  const snap = p => [Math.max(0, Math.min(cols, Math.round((p.x - pad) / k))), Math.max(0, Math.min(rows, Math.round((p.y - pad) / k)))];
  let down = null;
  svg.addEventListener("pointerdown", e => { if (fin) return; const p = svgPt(svg, e); down = { p, g: snap(p), f: e.target.dataset ? e.target.dataset.f : null, s: e.target.dataset ? e.target.dataset.s : null, moved: false }; try { svg.setPointerCapture(e.pointerId); } catch (er) { } });
  svg.addEventListener("pointermove", e => { if (!down || phase !== "net") return; const p = svgPt(svg, e); if (!down.moved && Math.hypot(p.x - down.p.x, p.y - down.p.y) < k * .4) return; down.moved = true; prev = [down.g, snap(p)]; draw(); });
  svg.addEventListener("pointerup", () => {
    if (!down) return; const d = down; down = null;
    if (phase === "lines") { if (d.s != null) { const s = segs[+d.s]; s.dash = !s.dash; s.bad = false; draw(); } return; }
    if (d.moved && prev) {
      const x0 = Math.min(prev[0][0], prev[1][0]), y0 = Math.min(prev[0][1], prev[1][1]), w = Math.abs(prev[1][0] - prev[0][0]), hh = Math.abs(prev[1][1] - prev[0][1]); prev = null;
      if (w && hh) {
        const r = { x: x0, y: y0, w, h: hh };
        if (!sizes.some(([u, v]) => u === w && v === hh)) api.hint(`${w} cm × ${hh} cm인 면은 이 ${opt.cube ? "정육면체" : "직육면체"}에 없어요. 겨냥도에서 면의 가로와 세로를 다시 살펴봐요.`);
        else if (faces.some(q => cb5Overlap(q, r))) api.hint("이미 그린 면과 겹쳐요. 빈 곳에 그려요.");
        else if (faces.length >= 6) api.hint("면은 6개면 충분해요. 잘못 그린 면은 눌러서 지워요.");
        else { faces.push(r); faces.forEach(q => { q.bad = false; }); api.hint(`${w} cm × ${hh} cm인 면을 그렸어요.`); }
      }
      draw(); return;
    }
    prev = null;
    if (d.f != null) { faces.splice(+d.f, 1); draw(); }
  });
  svg.addEventListener("pointercancel", () => { down = null; prev = null; draw(); });
  api.provide({ words: ["면 6개", "겹치는 면이 없게", "맞닿는 모서리의 길이가 같게", "잘린 모서리는 실선, 잘리지 않은 모서리는 점선"], answers: [] });
  const startLines = F => {
    const C = cb5Contacts(F); segs = C.map(t => ({ a: t.A, b: t.B, hinge: true, dash: false }));
    F.forEach(r => { const cs = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]];
      for (let i = 0; i < 4; i++) { const A = cs[i], B = cs[(i + 1) % 4]; if (!segs.some(s => (cb5Eq(s.a[0], A[0]) && cb5Eq(s.a[1], A[1]) && cb5Eq(s.b[0], B[0]) && cb5Eq(s.b[1], B[1])) || (cb5Eq(s.a[0], B[0]) && cb5Eq(s.a[1], B[1]) && cb5Eq(s.b[0], A[0]) && cb5Eq(s.b[1], A[1])))) segs.push({ a: A, b: B, hinge: false, dash: false }); } });
    phase = "lines"; draw();
  };
  const check = h("button", { class: "big", onclick: () => {
    if (fin) return; api.tryOnce();
    if (phase === "net") {
      const F = faces.map(r => ({ x: r.x, y: r.y, w: r.w, h: r.h })), ans = `면 ${F.length}개`;
      if (F.length < 6) return api.fail(`면이 ${F.length}개예요. ${opt.cube ? "정육면체" : "직육면체"}의 면은 6개예요.`, ans);
      const fd = cb5Fold(F);
      if (!fd.ok) return api.fail(CB5_WHY[fd.why] + " 면을 눌러 지우고 다시 그려 봐요.", ans);
      const Ls = Object.values(fd.L).sort((u, v) => u - v), Ds = [a, b, c].sort((u, v) => u - v);
      if (Ls.some((x, i) => !cb5Eq(x, Ds[i]))) return api.fail("접으면 겨냥도와 다른 크기의 직육면체가 돼요. 마주 보는 면은 모양과 크기가 같아야 해요.", ans);
      const key = cb5RectKey(F);
      if (opt.avoid && opt.avoid() === key) return api.fail("앞에서 그린 전개도와 같은 모양이에요(돌리거나 뒤집으면 같아요). 다른 모양으로 그려 봐요.", ans);
      opt.onNet && opt.onNet(F, key);
      if (opt.lines === false) { fin = true; return cb5Then(body, api, opt, "전개도 완성", opt.msg); }
      startLines(F);
      api.hint("○ 접으면 " + (opt.cube ? "정육면체" : "직육면체") + "가 돼요! 이제 잘리지 않은 모서리(접는 선)를 눌러 점선으로 바꿔요.");
      return;
    }
    const bad = segs.filter(s => s.dash !== s.hinge); segs.forEach(s => { s.bad = bad.includes(s); }); draw();
    const ans = `점선 ${segs.filter(s => s.dash).length}개`;
    if (bad.length) return api.fail(bad.some(s => s.dash) ? "잘린 모서리(둘레)를 점선으로 바꿨어요. 잘린 모서리는 실선이에요." : "아직 실선인 접는 선이 있어요. 두 면이 맞닿은 선은 잘리지 않은 모서리라서 점선으로 나타내요.", ans);
    fin = true; cb5Then(body, api, opt, "전개도 완성(점선 " + segs.filter(s => s.dash).length + "개)", opt.msg || "전개도를 바르게 그렸어요.");
  } }, "확인하기");
  body.append(...(opt.tip ? [h("p", { class: "cb5small" }, opt.tip)] : []), svg, read,
    h("div", { class: "cb5btns" }, h("button", { onclick: () => { if (fin) return; if (phase === "lines") { phase = "net"; segs = []; } faces.splice(0, faces.length, ...faces.filter(r => r.locked)); draw(); } }, "처음부터"),
      h("span", { class: "cb5small" }, "그린 면을 누르면 지워져요.")), h("div", { class: "actions" }, check));
  draw();
}
/* 면을 한 개 더 붙여 전개도 만들기: {F(5면), cands:[{x,y,w,h,name}], k, grid, dims, dash(색칠한 면의 접는 선을 점선으로), color} */
function cb5AddFace(body, api, opt) {
  const F = opt.F, good = opt.cands.map(c => cb5Fold(F.concat([c])).ok);
  if (good.filter(Boolean).length !== 1) console.warn("cb5AddFace: 답이 하나가 아니에요", good);
  let sel = null, phase = "pick", dashSel = new Set(), fin = false;
  const all = F.concat(opt.cands), B = cb5Bounds(all);
  const box = h("div"), fold = h("div"), read = h("div", { class: "cb5read" });
  const draw = () => {
    box.innerHTML = "";
    const FF = phase === "pick" ? F : F.concat([opt.cands[sel]]);
    const N = cb5NetSvg(FF, { k: opt.k || 30, grid: opt.grid, dims: opt.dims, maxW: opt.maxW || "26em", gx: 0, color: fi => fi === 5 ? (opt.color || "#F6B38E") : (opt.base || "#EEF5FC"), extra: (s, m) => {
      if (phase === "pick") opt.cands.forEach((c, i) => { const A = m([c.x, c.y]), Bp = m([c.x + c.w, c.y + c.h]);
        const e = svgEl("rect", { x: A[0], y: A[1], width: Bp[0] - A[0], height: Bp[1] - A[1], fill: sel === i ? (opt.color || "#F6B38E") : "#fff", "fill-opacity": sel === i ? .9 : .5, stroke: "#8795A1", "stroke-width": 1.6, "stroke-dasharray": "4 4", class: "cb5hit" });
        e.addEventListener("click", () => { sel = i; draw(); read.textContent = `${c.name} 자리를 골랐어요.`; }); s.append(e);
        s.append(txt((A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2, c.name, 17, { fill: CB5.ink, "pointer-events": "none" })); });
      else { const c = opt.cands[sel], cs = [[c.x, c.y], [c.x + c.w, c.y], [c.x + c.w, c.y + c.h], [c.x, c.y + c.h]];
        cs.forEach((p, i) => { const q = cs[(i + 1) % 4], A = m(p), Bp = m(q), on = dashSel.has(i);
          s.append(svgEl("line", { x1: A[0], y1: A[1], x2: Bp[0], y2: Bp[1], stroke: on ? CB5.blue : CB5.ink, "stroke-width": 3, "stroke-dasharray": on ? "7 6" : "none", "pointer-events": "none" }));
          const hit = svgEl("line", { x1: A[0], y1: A[1], x2: Bp[0], y2: Bp[1], stroke: "transparent", "stroke-width": 18, class: "cb5hit" }); hit.addEventListener("click", () => { if (fin) return; dashSel.has(i) ? dashSel.delete(i) : dashSel.add(i); draw(); }); s.append(hit); }); }
    }, skip: phase === "pick" ? -1 : 5 });
    box.append(N.svg);
  };
  const hingeSides = () => { const c = opt.cands[sel], n = F.length, C = cb5Contacts(F.concat([c])).filter(t => t.i === n || t.j === n), cs = [[c.x, c.y], [c.x + c.w, c.y], [c.x + c.w, c.y + c.h], [c.x, c.y + c.h]];
    return [0, 1, 2, 3].filter(i => { const p = cs[i], q = cs[(i + 1) % 4]; return C.some(t => cb5Eq(p[0], q[0]) ? (cb5Eq(t.A[0], p[0]) && cb5Eq(t.B[0], p[0])) : (cb5Eq(t.A[1], p[1]) && cb5Eq(t.B[1], p[1]))); }); };
  const showFold = FF => { fold.innerHTML = ""; const V = cb5FoldView(FF, { start: 0, size: [400, 270] }); fold.append(V.el); V.play(1); cb5Go(fold); };
  api.provide({ words: opt.cands.filter((_, i) => good[i]).map(c => c.name), answers: [opt.cands.filter((_, i) => good[i]).map(c => c.name).join("")] });
  const check = h("button", { class: "big", onclick: () => {
    if (fin) return;
    if (phase === "pick") {
      if (sel == null) return api.hint("붙일 자리를 먼저 눌러 골라요.");
      api.tryOnce(); const nm = opt.cands[sel].name;
      if (!good[sel]) { const fd = cb5Fold(F.concat([opt.cands[sel]])); showFold(F.concat([opt.cands[sel]])); return api.fail(`${nm} 자리에 붙이면 ${CB5_WHY[fd.why]} 접어 본 모습을 보고 다른 자리를 골라 봐요.`, nm); }
      if (!opt.dash) { fin = true; showFold(F.concat([opt.cands[sel]])); return cb5Then(body, api, opt, nm, opt.msg || `${nm} 자리에 붙이면 전개도가 돼요.`); }
      phase = "dash"; draw(); api.hint(`○ ${nm} 자리가 맞아요! 색칠한 면에서 잘리지 않는 모서리를 눌러 점선으로 바꿔요.`); return;
    }
    api.tryOnce(); const hs = hingeSides();
    const ok = hs.length === dashSel.size && hs.every(i => dashSel.has(i));
    if (!ok) return api.fail(dashSel.size > hs.length || [...dashSel].some(i => !hs.includes(i)) ? "잘리는 모서리는 실선이에요. 다른 면과 맞닿아 접히는 모서리만 점선으로 나타내요." : "다른 면과 맞닿은 모서리를 찾아 점선으로 바꿔요.", `점선 ${dashSel.size}개`);
    fin = true; showFold(F.concat([opt.cands[sel]])); cb5Then(body, api, opt, opt.cands[sel].name + " + 점선", opt.msg);
  } }, "확인하기");
  body.append(box, read, fold, h("div", { class: "actions" }, check));
  draw();
}

/* =========================================================
   6. 그림 카드 고르기 · 상자 살펴보기
   ========================================================= */
/* 카드 여러 장에서 알맞은 것 모두 고르기: {items:[{name, fig()}], q, a:[번호], whyExtra(i), whyMiss, cardW} */
function cb5Pick(body, api, opt) {
  const sel = new Set();
  const cards = opt.items.map((it, i) => { const c = h("div", { class: "cb5card" }, it.fig ? it.fig() : null, h("div", {}, it.name)); c.addEventListener("click", () => { sel.has(i) ? sel.delete(i) : sel.add(i); c.classList.toggle("cb5-pick", sel.has(i)); c.classList.remove("cb5-good", "cb5-bad"); }); return c; });
  api.provide({ words: opt.a.map(i => opt.items[i].name), answers: [opt.a.map(i => opt.items[i].name).join(", ")] });
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), h("div", { class: "cb5cards", style: `grid-template-columns:repeat(auto-fill,minmax(${opt.cardW || "8em"},1fr))` }, ...cards),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const got = [...sel].sort().map(i => opt.items[i].name).join(", ") || "-";
      cards.forEach((c, i) => { c.classList.remove("cb5-good", "cb5-bad"); if (sel.has(i)) c.classList.add(opt.a.includes(i) ? "cb5-good" : "cb5-bad"); });
      const ex = [...sel].find(i => !opt.a.includes(i));
      if (ex != null) return api.fail(opt.whyExtra ? opt.whyExtra(ex) : `${opt.items[ex].name}는 답이 아니에요.`, got);
      if (sel.size < opt.a.length) return api.fail(opt.whyMiss || `아직 ${opt.a.length - sel.size}개 더 있어요.`, got);
      cb5Then(body, api, opt, got, opt.msg);
    } }, "확인하기")));
}
/* 상자를 눌러 둘러싼 면 6개를 펼쳐 보기 → 다 보면 물음(ask) */
function cb5FaceShapes(P, D) {   // 앞뒤 다각형 2개 + 옆 직사각형들 (실제 모양)
  const n = P.length, L = P.map((p, i) => Math.hypot(P[(i + 1) % n][0] - p[0], P[(i + 1) % n][1] - p[1]));
  return [{ P }, { P }].concat(L.map(l => ({ P: [[0, 0], [l, 0], [l, D], [0, D]] })));
}
function cb5Boxes(body, api, opt) {
  const seen = new Set(), panel = h("div", { class: "cb5box", style: "min-height:5em" }, "상자를 눌러 보세요. 상자를 둘러싼 면 6개가 펼쳐져 보여요.");
  const cards = opt.boxes.map((b, i) => { const c = h("div", { class: "cb5card" }, cb5Prism({ P: b.P, D: b.D, k: 22, hidden: "none", maxW: "100%", plain: true, tint: b.color, pad: 12 }), h("div", {}, b.name));
    c.addEventListener("click", () => show(i)); return c; });
  function show(i) {
    const b = opt.boxes[i]; seen.add(i); cards[i].classList.add("cb5-pick"); cards.forEach((c, j) => { if (j !== i) c.classList.remove("cb5-pick"); });
    const sh = cb5FaceShapes(b.P, b.D), k = 20, gap = 14;
    let x = 10; const items = sh.map(s => { const xs = s.P.map(p => p[0]), ys = s.P.map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), hh = Math.max(...ys) - Math.min(...ys); const it = { s, x, w, hh, mx: Math.min(...xs), my: Math.max(...ys) }; x += w * k + gap; return it; });
    const Hh = Math.max(...items.map(it => it.hh)) * k + 20;
    const svg = cb5Fig(x, Hh, s => items.forEach(it => s.append(svgEl("polygon", { points: it.s.P.map(p => [cb5R(it.x + (p[0] - it.mx) * k), cb5R(10 + (it.my - p[1]) * k)].join(",")).join(" "), fill: b.color || "#EEF5FC", stroke: CB5.ink, "stroke-width": 2 }))), "100%", true);
    panel.innerHTML = ""; panel.append(h("div", { class: "jua" }, `상자 ${b.name}를 둘러싼 면 6개`), svg);
    if (seen.size === opt.boxes.length && !asked) { asked = true; cb5Then(body, api, opt, "상자 6개 살펴봄", "상자 6개를 모두 살펴봤어요."); }
    else if (!asked) api.hint(`살펴본 상자 ${seen.size}개 / ${opt.boxes.length}개`);
  }
  let asked = false;
  api.provide({ words: ["직사각형", "정사각형", "사다리꼴"], answers: [] });
  body.append(h("div", { class: "cb5cards", style: "grid-template-columns:repeat(auto-fill,minmax(7.5em,1fr))" }, ...cards), panel);
}

/* ---------- 물건 그림 ---------- */
function cb5Grid3(svg, Q, col) {   // 사각형 Q(4점)에 3×3 칸
  const L = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  [1 / 3, 2 / 3].forEach(t => { const a = L(Q[0], Q[1], t), b = L(Q[3], Q[2], t), c = L(Q[0], Q[3], t), d = L(Q[1], Q[2], t);
    svg.append(svgEl("line", { x1: cb5R(a[0]), y1: cb5R(a[1]), x2: cb5R(b[0]), y2: cb5R(b[1]), stroke: col || CB5.ink, "stroke-width": 1.5 }), svgEl("line", { x1: cb5R(c[0]), y1: cb5R(c[1]), x2: cb5R(d[0]), y2: cb5R(d[1]), stroke: col || CB5.ink, "stroke-width": 1.5 })); });
}
const CB5_OBJ = {
  dice: () => cb5Prism({ P: [[0, 0], [3, 0], [3, 3], [0, 3]], D: 3, k: 22, hidden: "none", maxW: "100%", plain: true, tint: "#FFFFFF", pad: 12, extra: (s, S) => {
    const c = [(S[0][0] + S[2][0]) / 2, (S[0][1] + S[2][1]) / 2], d = (S[1][0] - S[0][0]) / 4; [[-1, -1], [1, 1], [0, 0], [1, -1], [-1, 1]].forEach(([u, v]) => s.append(svgEl("circle", { cx: cb5R(c[0] + u * d), cy: cb5R(c[1] + v * d), r: 4.5, fill: u === 0 ? CB5.red : CB5.ink }))); } }),
  can: () => cb5Fig(130, 120, s => { s.append(svgEl("rect", { x: 35, y: 22, width: 60, height: 78, fill: "#F6B38E", stroke: CB5.ink, "stroke-width": 2 }), svgEl("ellipse", { cx: 65, cy: 100, rx: 30, ry: 9, fill: "#F6B38E", stroke: CB5.ink, "stroke-width": 2 }),
    svgEl("rect", { x: 36.5, y: 80, width: 57, height: 20, fill: "#F6B38E", stroke: "none" }), svgEl("ellipse", { cx: 65, cy: 22, rx: 30, ry: 9, fill: "#E6EBEE", stroke: CB5.ink, "stroke-width": 2 })); }, "100%", true),
  tissue: () => cb5Prism({ P: [[0, 0], [5, 0], [5, 2.2], [0, 2.2]], D: 2.6, k: 20, hidden: "none", maxW: "100%", plain: true, tint: "#DDEDE5", pad: 12, extra: (s, S) => {
    const c = [(S[3][0] + S[6][0]) / 2, (S[3][1] + S[6][1]) / 2]; s.append(svgEl("ellipse", { cx: cb5R(c[0]), cy: cb5R(c[1]), rx: 26, ry: 6, fill: "#fff", stroke: CB5.ink, "stroke-width": 1.5 })); } }),
  ball: () => cb5Fig(130, 120, s => { s.append(svgEl("circle", { cx: 65, cy: 60, r: 44, fill: "#fff", stroke: CB5.ink, "stroke-width": 2 }), svgEl("polygon", { points: "65,42 82,54 76,74 54,74 48,54", fill: CB5.ink }));
    [[65, 42, 65, 17], [82, 54, 105, 46], [76, 74, 90, 94], [54, 74, 40, 94], [48, 54, 25, 46]].forEach(([a, b, c, d]) => s.append(svgEl("line", { x1: a, y1: b, x2: c, y2: d, stroke: CB5.ink, "stroke-width": 2 }))); }, "100%", true),
  cube: () => cb5Prism({ P: [[0, 0], [3, 0], [3, 3], [0, 3]], D: 3, k: 20, hidden: "none", maxW: "100%", plain: true, pad: 12, fill: { front: "#F6B38E", s1: "#9CC3F0", s2: "#FFE07A" }, extra: (s, S) => {
    cb5Grid3(s, [S[3], S[2], S[1], S[0]]); cb5Grid3(s, [S[7], S[6], S[2], S[3]]); cb5Grid3(s, [S[2], S[6], S[5], S[1]]); } }),
  book: () => cb5Prism({ P: [[0, 0], [4, 0], [4, 1], [0, 1]], D: 5, k: 19, hidden: "none", maxW: "100%", plain: true, pad: 12, fill: { front: "#FFFFFF", s2: "#9CC3F0", s1: "#FFFFFF" } }),
  cone: () => cb5Fig(130, 120, s => { s.append(svgEl("path", { d: "M65 12 L100 98 A35 10 0 0 1 30 98 Z", fill: "#FFE07A", stroke: CB5.ink, "stroke-width": 2 })); }, "100%", true)
};

/* 비스듬히 본 상자 하나(앞면 왼쪽 위가 (0,0)) */
function cb5BoxG(P, k) {
  const g = svgEl("g"), w = P.W * k, hh = P.H * k, d = P.D * .35 * k, pts = a => a.map(p => p.map(cb5R).join(",")).join(" ");
  g.append(svgEl("polygon", { points: pts([[0, 0], [d, -d * .8], [w + d, -d * .8], [w, 0]]), fill: P.top || "#FFE7B8", stroke: CB5.ink, "stroke-width": 1.6 }),
    svgEl("polygon", { points: pts([[w, 0], [w + d, -d * .8], [w + d, hh - d * .8], [w, hh]]), fill: P.side || "#C9DBEE", stroke: CB5.ink, "stroke-width": 1.6 }),
    svgEl("rect", { x: 0, y: 0, width: w, height: hh, fill: P.color || "#9CC3F0", stroke: CB5.ink, "stroke-width": 1.8 }));
  if (P.face) P.face(g, w, hh);
  return g;
}
/* =========================================================
   7. 장난감 맞추기: 부분을 끌어 설계도 자리에 놓아요
   opt: {parts:[{name, W,H,D, color}], slots:[{x,y,part(번호)}], k}
   ========================================================= */
function cb5Robot(body, api, opt) {
  const k = opt.k || 24, pad = 16, cols = opt.cols || 17, rows = opt.rows || 12, Wd = cols * k + pad * 2, Hd = rows * k + pad * 2;
  const m = p => [pad + p[0] * k, pad + p[1] * k];
  const svg = makeSvg(Wd, Hd); svg.setAttribute("class", "cb5fig"); svg.style.maxWidth = "34em";
  const placed = opt.slots.map(() => null);
  const pcs = opt.items.map((it, i) => Object.assign({ i, x: it.tx, y: it.ty, home: [it.tx, it.ty], at: -1 }, it));
  const read = h("div", { class: "cb5read" });
  const boxG = P => cb5BoxG(P, k);
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(m([opt.planX || 4, .1])[0], m([0, .1])[1] + 2, "설계도", 15, { fill: CB5.gray }));
    opt.slots.forEach((sl, si) => { const P = opt.items.find(it => it.kind === sl.kind), A = m([sl.x, sl.y]);
      svg.append(svgEl("rect", { x: A[0], y: A[1], width: P.W * k, height: P.H * k, fill: placed[si] != null ? "none" : "#F2F5F4", stroke: "#8795A1", "stroke-width": 1.6, "stroke-dasharray": "5 4" }));
      if (placed[si] == null) svg.append(txt(A[0] + P.W * k / 2, A[1] + P.H * k / 2, sl.label, 13, { fill: CB5.gray })); });
    pcs.slice().sort((a, b) => (a.at >= 0) - (b.at >= 0)).forEach(pc => { const g = boxG(pc), A = m([pc.x, pc.y]); g.setAttribute("transform", `translate(${cb5R(A[0])},${cb5R(A[1])})`);
      if (pc.at < 0) { g.classList.add("cb5grab"); g.dataset.p = pc.i; [...g.children].forEach(c => { c.dataset.p = pc.i; }); } svg.append(g); });
    read.textContent = `맞춘 부분: ${placed.filter(x => x != null).length}개 / ${opt.slots.length}개`;
  };
  let drag = null;
  svg.addEventListener("pointerdown", e => { const p = e.target.dataset ? e.target.dataset.p : null; if (p == null) return; const pc = pcs[+p], q = svgPt(svg, e); drag = { pc, dx: q.x - m([pc.x, pc.y])[0], dy: q.y - m([pc.x, pc.y])[1] }; try { svg.setPointerCapture(e.pointerId); } catch (er) { } });
  svg.addEventListener("pointermove", e => { if (!drag) return; const q = svgPt(svg, e); drag.pc.x = (q.x - drag.dx - pad) / k; drag.pc.y = (q.y - drag.dy - pad) / k; draw(); });
  svg.addEventListener("pointerup", () => {
    if (!drag) return; const pc = drag.pc; drag = null;
    const si = opt.slots.findIndex((sl, i) => placed[i] == null && Math.hypot(sl.x - pc.x, sl.y - pc.y) < 1.3 && sl.kind === pc.kind);
    const near = opt.slots.findIndex((sl, i) => placed[i] == null && Math.hypot(sl.x - pc.x, sl.y - pc.y) < 1.3);
    if (si >= 0) { pc.x = opt.slots[si].x; pc.y = opt.slots[si].y; pc.at = si; placed[si] = pc.i; }
    else { if (near >= 0) { api.tryOnce(); api.hint(`${pc.name}는 그 자리에 맞지 않아요. 설계도의 크기와 모양을 살펴봐요.`); } pc.x = pc.home[0]; pc.y = pc.home[1]; }
    draw();
    if (placed.every(x => x != null)) cb5Then(body, api, opt, "장난감 완성", opt.msg || "설계도대로 장난감을 완성했어요!");
  });
  api.provide({ words: opt.items.map(it => it.name), answers: [] });
  body.append(svg, read); draw();
}

/* =========================================================
   8. 놀이 카드 — 같은 도형의 겨냥도 1장 + 전개도 2장
   ========================================================= */
const CB5_SHAPES = [   // [가로, 높이, 깊이], 전개도 두 가지(칸 모양, 처음 칸의 가로·세로 방향)
  { name: "가", dims: [2, 2, 2], nets: [{ cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], d: { 1: 2, 2: 2, 4: 2 } }, { cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], d: { 1: 2, 2: 2, 4: 2 } }] },
  { name: "나", dims: [3, 2, 1], nets: [{ cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], d: { 1: 1, 2: 2, 4: 3 } }, { cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], d: { 1: 3, 2: 2, 4: 1 } }] },
  { name: "다", dims: [3, 1, 1], nets: [{ cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], d: { 1: 1, 2: 1, 4: 3 } }, { cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], d: { 1: 3, 2: 1, 4: 1 } }] },
  { name: "라", dims: [2, 1, 2], nets: [{ cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], d: { 1: 2, 2: 2, 4: 1 } }, { cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], d: { 1: 1, 2: 2, 4: 2 } }] }
];
let CB5_DECK = null;
function cb5Deck() {
  if (CB5_DECK) return CB5_DECK;
  CB5_DECK = [];
  CB5_SHAPES.forEach((s, si) => {
    CB5_DECK.push({ id: CB5_DECK.length, shape: si, kind: "sk" });
    s.nets.forEach(n => { const F = cb5NetFromCells(n.cells, n.d); const fd = F && cb5Fold(F);
      if (!fd || !fd.ok) throw new Error("놀이 카드 전개도 오류");
      const L = Object.values(fd.L).sort((a, b) => a - b), D = s.dims.slice().sort((a, b) => a - b); if (L.some((x, i) => x !== D[i])) throw new Error("놀이 카드 크기 오류");
      CB5_DECK.push({ id: CB5_DECK.length, shape: si, kind: "net", F }); });
  });
  return CB5_DECK;
}
function cb5CardFig(card) {
  const s = CB5_SHAPES[card.shape];
  if (card.kind === "sk") { const [W, H, D] = s.dims;
    return cb5Cub({ W, H, D, k: 28, maxW: "100%", plain: true, pad: 40, f: .6, dimD: 24, dimSize: 14, dims: [[0, 1, W + " cm"], [0, 2, H + " cm"], [3, 7, D + " cm"]] }); }
  const N = cb5NetSvg(card.F, { k: 12, pad: 4, grid: true, gx: 1, gy: 1, maxW: "100%", plain: true, color: () => "#FFF6DD" });
  return N.svg;
}
function cb5Shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/* 카드 나누기: 전개도 카드를 알맞은 겨냥도 카드에 놓기 */
function cb5CardSort(body, api, opt) {
  const deck = cb5Deck(), sks = deck.filter(c => c.kind === "sk"), nets = cb5Shuffle(deck.filter(c => c.kind === "net").slice());
  const put = new Map(); let sel = null;
  const top = h("div", { class: "cb5cards", style: "grid-template-columns:repeat(auto-fill,minmax(8em,1fr))" }), bottom = h("div", { class: "cb5cards", style: "grid-template-columns:repeat(auto-fill,minmax(7.5em,1fr))" });
  const draw = () => {
    top.innerHTML = ""; bottom.innerHTML = "";
    sks.forEach((c, i) => { const mine = nets.filter(n => put.get(n.id) === i).length; const el = h("div", { class: "cb5card" }, cb5CardFig(c), h("div", {}, `겨냥도 ${CB5_SHAPES[c.shape].name} · 전개도 ${mine}장`));
      el.addEventListener("click", () => { if (sel == null) return api.hint("먼저 아래 전개도 카드를 눌러 골라요."); put.set(sel, i); sel = null; draw(); }); top.append(el); });
    nets.forEach((n, j) => { const at = put.get(n.id); const el = h("div", { class: "cb5card" + (sel === n.id ? " cb5-pick" : "") + (n.bad ? " cb5-bad" : "") }, cb5CardFig(n), h("div", {}, at == null ? `카드 ${j + 1}` : `카드 ${j + 1} → ${CB5_SHAPES[sks[at].shape].name}`));
      el.addEventListener("click", () => { sel = sel === n.id ? null : n.id; n.bad = false; draw(); }); bottom.append(el); });
  };
  api.provide({ words: ["모눈 한 칸은 1 cm", "면의 가로와 세로", "같은 크기의 면 2개씩"], answers: [] });
  body.append(h("div", { class: "jua" }, "겨냥도 카드"), top, h("div", { class: "jua" }, "전개도 카드 (눌러 고른 뒤 위의 겨냥도 카드를 눌러요)"), bottom,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const ans = nets.map(n => put.has(n.id) ? CB5_SHAPES[sks[put.get(n.id)].shape].name : "-").join("");
      if (nets.some(n => !put.has(n.id))) return api.fail("아직 놓지 않은 전개도 카드가 있어요.", ans);
      nets.forEach(n => { n.bad = CB5_SHAPES[sks[put.get(n.id)].shape] !== CB5_SHAPES[n.shape]; }); draw();
      const bad = nets.filter(n => n.bad).length;
      if (bad) return api.fail(`잘못 놓은 카드가 ${bad}장 있어요(빨간 카드). 모눈 칸을 세어 면의 가로·세로가 겨냥도의 모서리 길이와 같은지 살펴봐요.`, ans);
      cb5Then(body, api, opt, "12장 모두 나눔", opt.msg || "같은 도형끼리 3장씩 모두 모았어요.");
    } }, "확인하기")));
  draw();
}
/* 넘겨 놀이: 4명(나 + 컴퓨터 친구 3명)이 3장씩, 시계 방향으로 한 장씩 넘겨 같은 도형 3장을 모아요 */
function cb5PassGame(body, api, opt) {
  const deck = cb5Deck(), NAMES = ["나", "친구 1", "친구 2", "친구 3"];
  let hands, sel = null, round = 0, over = false, wins = [0, 0, 0, 0], passes = 0, solved = false, reveal = -1;
  const table = h("div"), msg = h("div", { class: "cb5read" }), score = h("div", { class: "cb5small" });
  const same = hd => hd.every(c => deck[c].shape === deck[hd[0]].shape);
  const deal = () => { const d = cb5Shuffle(deck.map(c => c.id)); hands = [0, 1, 2, 3].map(p => d.slice(p * 3, p * 3 + 3)); sel = null; over = false; passes = 0; reveal = -1; round++;
    // 처음부터 친구가 다 모았으면 다시 섞기(놀이가 바로 끝나지 않게)
    if ([1, 2, 3].some(p => same(hands[p])) || same(hands[0])) return deal0();
    msg.textContent = `${round}번째 판이에요. 넘길 카드 한 장을 고르고 ‘넘겨!’를 눌러요.`; draw(); };
  const deal0 = () => { round--; deal(); };
  const aiPick = p => { const hd = hands[p], cnt = hd.map(c => hd.filter(d => deck[d].shape === deck[c].shape).length);
    if (Math.random() < (opt.weak == null ? .5 : opt.weak)) return Math.floor(Math.random() * 3);
    const mn = Math.min(...cnt), cand = [0, 1, 2].filter(i => cnt[i] === mn); return cand[Math.floor(Math.random() * cand.length)]; };
  const draw = () => {
    table.innerHTML = "";
    const pl = h("div", { class: "cb5players" });
    [1, 2, 3].forEach(p => { const box = h("div", { class: "cb5pl" + (reveal === p ? " cb5-win" : "") }, h("div", {}, `${NAMES[p]} · 모은 횟수 ${wins[p]}`),
      h("div", { class: "cb5mini" }, ...hands[p].map(c => reveal === p ? h("div", { class: "cb5card", style: "cursor:default" }, cb5CardFig(deck[c])) : h("div", { class: "cb5card cb5-back", style: "min-height:3em;cursor:default" }, "​"))));
      pl.append(box); });
    const mine = h("div", { class: "cb5hand" }, ...hands[0].map((c, i) => { const el = h("div", { class: "cb5card" + (sel === i ? " cb5-pick" : "") }, cb5CardFig(deck[c]), h("div", {}, sel === i ? "넘길 카드" : "​"));
      el.addEventListener("click", () => { if (over) return; sel = sel === i ? null : i; draw(); }); return el; }));
    table.append(pl, h("div", { class: "jua" }, `내 카드 · 모은 횟수 ${wins[0]}`), mine,
      h("div", { class: "cb5btns" }, h("button", { class: "big", disabled: over, onclick: pass }, "넘겨!"), h("button", { class: "big", disabled: over, onclick: claim }, "모았어요!"),
        over ? h("button", { class: "ghost", onclick: deal }, "한 판 더") : null));
    score.textContent = `판 ${round} · 이번 판에 넘긴 횟수 ${passes}번 · 모은 횟수 — 나 ${wins[0]}, 친구 1 ${wins[1]}, 친구 2 ${wins[2]}, 친구 3 ${wins[3]}`;
  };
  function pass() {
    if (over) return;
    if (sel == null) return api.hint("넘길 카드를 먼저 한 장 눌러 골라요.");
    if (same(hands[0])) return api.hint("잠깐! 지금 가진 카드 3장을 잘 살펴봐요.");
    const give = [0, 1, 2, 3].map(p => p === 0 ? sel : aiPick(p)), out = give.map((g, p) => hands[p][g]);
    hands = hands.map((hd, p) => { const nh = hd.filter((_, i) => i !== give[p]); nh.push(out[(p + 3) % 4]); return nh; });
    passes++; sel = null;
    const w = [1, 2, 3].find(p => same(hands[p]));
    if (w && !same(hands[0])) { over = true; reveal = w; wins[w]++; msg.textContent = `${NAMES[w]}가 같은 도형 카드 3장을 모았어요! 카드를 보고 정말 같은 도형인지 확인해 봐요.`; }
    else msg.textContent = `카드를 넘기고 ${NAMES[3]}에게서 한 장을 받았어요. 같은 도형 3장이 되었는지 살펴봐요.`;
    draw();
  }
  function claim() {
    if (over) return; api.tryOnce();
    const hd = hands[0];
    if (!same(hd)) { const sk = hd.filter(c => deck[c].kind === "sk").length;
      return api.fail(sk > 1 ? "겨냥도 카드가 두 장 이상이면 같은 도형이 아니에요. 같은 도형은 겨냥도 1장과 전개도 2장이에요." : "세 장이 같은 도형이 아니에요. 전개도의 모눈 칸을 세어 면의 크기를 겨냥도와 비교해 봐요.", hd.map(c => CB5_SHAPES[deck[c].shape].name).join("")); }
    over = true; wins[0]++; reveal = -1; msg.textContent = `같은 도형 카드 3장을 모았어요! 도형 ${CB5_SHAPES[deck[hd[0]].shape].name}의 겨냥도와 전개도 2장이에요.`; draw();
    if (!solved) { solved = true; api.done(`${round}번째 판에서 모음`, "같은 도형 카드 3장을 모았어요! ‘한 판 더’로 계속 놀이해도 좋아요."); }
  }
  api.provide({ words: ["겨냥도 1장 + 전개도 2장", "필요 없는 카드 넘기기"], answers: [] });
  body.append(msg, table, score); deal();
}
/* 짝 맞추기 놀이: 전개도 카드 8장을 뒤집어 놓고 두 장씩 펼쳐 같은 도형이면 가져가요 */
function cb5Memory(body, api, opt) {
  const deck = cb5Deck(), cards = cb5Shuffle(deck.filter(c => c.kind === "net").map(c => c.id));
  const up = new Set(), got = new Set(); let tries = 0, lock = false, fin = false;
  const grid = h("div", { class: "cb5mem" }), read = h("div", { class: "cb5read" });
  const draw = () => { grid.innerHTML = ""; cards.forEach((c, i) => { const open = up.has(i) || got.has(i);
    const el = h("div", { class: "cb5card" + (got.has(i) ? " cb5-good" : open ? " cb5-pick" : " cb5-back"), style: "min-height:5em" }, open ? cb5CardFig(deck[c]) : h("div", { style: "padding-top:1.5em" }, "?"));
    el.addEventListener("click", () => flip(i)); grid.append(el); });
    read.textContent = `펼친 횟수 ${tries}번 · 가져간 짝 ${got.size / 2}쌍 / 4쌍`; };
  function flip(i) {
    if (lock || fin || got.has(i) || up.has(i)) return;
    up.add(i); draw();
    if (up.size < 2) return;
    tries++; const [a, b] = [...up];
    if (deck[cards[a]].shape === deck[cards[b]].shape) { got.add(a); got.add(b); up.clear(); draw(); api.hint("○ 같은 도형의 전개도예요! 카드를 가져가요.");
      if (got.size === cards.length) { fin = true; api.done(`${tries}번 펼쳐 4쌍`, `${tries}번 만에 짝을 모두 찾았어요.`); } return; }
    lock = true; api.hint("× 다른 도형의 전개도예요. 다시 뒤집어요."); draw();
    setTimeout(() => { up.clear(); lock = false; draw(); }, 1300);
  }
  api.provide({ words: ["면의 크기 비교", "모눈 칸 세기"], answers: [] });
  body.append(grid, read); draw();
}

/* ---------- 직육면체를 돌려 보이는 면 수 맞추기: 보이는 면이 goal개가 되면 해결 ---------- */
function cb5SeeFaces(body, api, opt) {
  let fin = false; const read = h("div", { class: "cb5read" });
  const S = cb5Solid({ dims: opt.dims, yaw: opt.yaw, pitch: opt.pitch, hidden: "none", fill: () => "#FFE7B8",
    onTurn: (st, vis) => { const n = vis.faces.filter(Boolean).length; read.textContent = `지금 보이는 면: ${n}개`; if (!fin && n === opt.goal) { fin = true; cb5Then(body, api, opt, `보이는 면 ${n}개`, opt.msg); } } });
  api.provide({ words: ["비스듬히 위에서 보기", "보이는 면 3개"], answers: [] });
  body.append(S.svg, S.tools, read);
  read.textContent = `지금 보이는 면: ${S.vis().faces.filter(Boolean).length}개`;
}
/* ---------- 마주 보는 면 3쌍 찾기(돌려 가며 두 면씩 누르기) ---------- */
function cb5OppPairs(body, api, opt) {
  const pairOf = new Map(), cols = ["#9CC3F0", "#F6B38E", "#A9DDB8"]; let sel = null, np = 0, fin = false;
  const read = h("div", { class: "cb5read" }, "면 두 개를 차례로 눌러요. 마주 보는 면이면 같은 색이 칠해져요.");
  const S = cb5Solid({ dims: opt.dims, yaw: opt.yaw, pitch: opt.pitch, fill: fi => pairOf.has(fi) ? cols[pairOf.get(fi)] : fi === sel ? CB5.pick : null,
    faceText: fi => pairOf.has(fi) ? `${pairOf.get(fi) + 1}쌍` : fi === sel ? "?" : "",
    tap: { face: fi => {
      if (fin || pairOf.has(fi)) return;
      if (sel == null || sel === fi) { sel = sel === fi ? null : fi; S.draw(); return; }
      api.tryOnce();
      if (CB5_OPP[sel] === fi) { pairOf.set(sel, np); pairOf.set(fi, np); np++; sel = null; S.draw(); read.textContent = `마주 보는 면 ${np}쌍을 찾았어요.`;
        if (np === 3) { fin = true; cb5Then(body, api, opt, "마주 보는 면 3쌍", opt.msg || "마주 보는 면은 모두 3쌍이에요."); } return; }
      sel = null; S.draw(); api.fail("두 면은 한 모서리에서 만나요. 마주 보는 면은 서로 만나지 않는 면이에요. 그림을 돌려 반대쪽을 살펴봐요.", "만나는 두 면");
    } } });
  api.provide({ words: ["마주 보는 면", "3쌍"], answers: [] });
  body.append(S.svg, S.tools, read);
}
/* ---------- 밑면 바꿔 보기: 평행한 면 3쌍을 차례로 밑면으로 정해 봐요 ---------- */
function cb5Bases(body, api, opt) {
  const pairs = [[5, 4, "윗면과 아랫면"], [0, 1, "앞면과 뒷면"], [2, 3, "왼쪽 옆면과 오른쪽 옆면"]], seen = new Set(); let cur = -1, fin = false;
  const S = cb5Solid({ dims: opt.dims, yaw: opt.yaw, pitch: opt.pitch, fill: fi => cur < 0 ? null : pairs[cur].slice(0, 2).includes(fi) ? CB5.par : CB5.per,
    faceText: fi => cur < 0 ? "" : pairs[cur].slice(0, 2).includes(fi) ? "밑면" : "옆면" });
  const read = h("div", { class: "cb5read" }, "아래 단추를 눌러 밑면을 정해 봐요.");
  const btns = h("div", { class: "cb5btns" }, ...pairs.map((p, i) => h("button", { "data-i": i, onclick: () => { cur = i; seen.add(i); [...btns.children].forEach(b => b.classList.toggle("cb5-pick", +b.dataset.i === i)); S.draw();
    read.textContent = `${p[2]}을 밑면으로 정했어요. 밑면과 만나는 면 4개가 옆면이 돼요. (해 본 것 ${seen.size}/3)`;
    if (!fin && seen.size === 3) { fin = true; cb5Then(body, api, opt, "밑면 3가지", opt.msg || "서로 평행한 면은 3쌍이고, 어느 쌍이든 밑면이 될 수 있어요."); } } }, p[2] + "을 밑면으로")));
  api.provide({ words: ["서로 평행한 면 3쌍", "밑면", "옆면"], answers: [] });
  body.append(btns, S.svg, S.tools, read);
}
/* 한 꼭짓점에 삼각자 세 개의 직각을 대어 본 그림 */
function cb5RightFig() {
  return cb5Prism({ P: [[0, 0], [5, 0], [5, 3], [0, 3]], D: 4, k: 26, maxW: "16em", fill: { front: "#DCEAFB", s1: "#FDE3D3", s2: "#DDEDE5" }, extra: (s, S) => {
    const V = S[2], u = A => { const dx = A[0] - V[0], dy = A[1] - V[1], L = Math.hypot(dx, dy); return [dx / L * 14, dy / L * 14]; };
    const mk = (A, B, col) => { const a = u(A), b = u(B), P = [[V[0] + a[0], V[1] + a[1]], [V[0] + a[0] + b[0], V[1] + a[1] + b[1]], [V[0] + b[0], V[1] + b[1]]];
      s.append(svgEl("polyline", { points: P.map(p => p.map(cb5R).join(",")).join(" "), fill: "none", stroke: col, "stroke-width": 2.5 })); };
    mk(S[3], S[1], CB5.red); mk(S[3], S[6], CB5.blue); mk(S[1], S[6], CB5.green);
  } });
}
/* 칸 모양 전개도 + 둘레 점 이름: grid [[i,j,"ㄱ"]…](칸 모서리 번호) → {F, P} */
function cb5LabNet(cells, dims, grid) {
  const F = cb5NetFromCells(cells, dims);
  const P = grid.map(([i, j, n]) => { const c = cells.findIndex(([x, y]) => (i === x || i === x + 1) && (j === y || j === y + 1)); const r = F[c]; return [i === cells[c][0] ? r.x : r.x + r.w, j === cells[c][1] ? r.y : r.y + r.h, n]; });
  return { F, P };
}
/* 장난감 부분: 6칸 중 하나(rm)를 빼고, 후보 자리 [[이웃 칸, "u|d|l|r", 길이]](null이면 뺀 칸) */
function cb5PartNet(cells, dims, rm, cands, names) {
  const R = cb5NetFromCells(cells, dims), F = R.filter((_, i) => i !== rm);
  const C = cands.map((c, i) => { if (!c) return Object.assign({ name: names[i] }, R[rm]); const [nb, d, len] = c, N = R[nb];
    const r = d === "r" ? { x: N.x + N.w, y: N.y, w: len, h: N.h } : d === "l" ? { x: N.x - len, y: N.y, w: len, h: N.h } : d === "d" ? { x: N.x, y: N.y + N.h, w: N.w, h: len } : { x: N.x, y: N.y - len, w: N.w, h: len };
    return Object.assign({ name: names[i] }, r); });
  const all = F.concat(C), mx = Math.min(...all.map(r => r.x)), my = Math.min(...all.map(r => r.y));
  const sh = r => Object.assign({}, r, { x: r.x - mx, y: r.y - my });
  return { F: F.map(sh), cands: C.map(sh) };
}
//@@LESSONS
const UNIT_STORY = { title: "연서의 국제 물류 센터 견학", lines: [
  "로봇 공학자인 아버지를 따라 국제 물류 센터에 견학 간 연서는 로봇들이 여러 가지 모양의 상자를 찾아 분류하고, 운반하고, 정리하는 모습을 보았어요. 로봇이 상자의 모서리를 잘라 펼치는 모습도 보았지요.",
  "연서와 함께 상자를 분류하며 직육면체와 정육면체를 알아보고, 상자를 이리저리 돌려 면·모서리·꼭짓점을 세고, 겨냥도를 그리고, 평행한 면과 수직인 면을 찾고, 상자를 펼치고 접으며 전개도를 알아봐요.",
  "교과서 「수학 5-2」 5. 직육면체의 차시 순서 그대로 만들었어요."],
  one: "직육면체 · 국제 물류 센터에서 상자를 분류하고, 돌려 보고, 그리고, 펼치고 접어 봐요." };
const UNIT_KEYWORDS = ["직육면체", "정육면체", "면", "모서리", "꼭짓점", "겨냥도", "실선", "점선", "평행", "밑면", "옆면", "수직", "전개도", "잘린 모서리", "잘리지 않은 모서리"];

/* ---- 그림 자료 ---- */
const CB5_SQ = c => c.map(([x, y]) => ({ x, y, w: 1, h: 1 }));
const CB5_CROSS = [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]];
const CB5_GIFT = cb5NetFromCells(CB5_CROSS, { 1: 2, 2: 3, 4: 4 });           // 6차시 선물 상자(4 cm, 3 cm, 2 cm) 전개도
const CB5_CUBE_NET = CB5_SQ(CB5_CROSS);
/* 5차시 활동 3(지도서 정답으로 복원한 배치): 가로 4칸 + 셋째 칸 위 1칸 + 둘째 칸 아래 1칸 */
const CB5_L5A3 = cb5LabNet([[0, 1], [1, 1], [2, 1], [3, 1], [2, 0], [1, 2]], { 1: 1, 2: 1, 4: 1 },
  [[2, 0, "ㅌ"], [3, 0, "ㅋ"], [0, 1, "ㄱ"], [1, 1, "ㅎ"], [2, 1, "ㅍ"], [3, 1, "ㅊ"], [4, 1, "ㅈ"], [0, 2, "ㄴ"], [1, 2, "ㄷ"], [2, 2, "ㅂ"], [3, 2, "ㅅ"], [4, 2, "ㅇ"], [1, 3, "ㄹ"], [2, 3, "ㅁ"]]);
/* 5차시 수학익힘 유사 1: 가로 4칸 + 첫째 칸 위 + 둘째 칸 아래 */
const CB5_L5U1 = cb5LabNet([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], { 1: 1, 2: 1, 4: 1 },
  [[0, 0, "ㄱ"], [1, 0, "ㅎ"], [0, 1, "ㄴ"], [1, 1, "ㅍ"], [2, 1, "ㅌ"], [3, 1, "ㅋ"], [4, 1, "ㅊ"], [0, 2, "ㄷ"], [1, 2, "ㄹ"], [2, 2, "ㅅ"], [3, 2, "ㅇ"], [4, 2, "ㅈ"], [1, 3, "ㅁ"], [2, 3, "ㅂ"]]);
/* 6차시 활동 3: 가로 4칸(2·4·2·4 cm, 높이 3 cm) + 둘째 칸 위·아래(4 cm × 2 cm) */
const CB5_L6A3 = cb5LabNet([[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]], { 1: 2, 2: 3, 4: 4 },
  [[1, 0, "ㅍ"], [2, 0, "ㅌ"], [0, 1, "ㄱ"], [1, 1, "ㅎ"], [2, 1, "ㅋ"], [3, 1, "ㅊ"], [4, 1, "ㅈ"], [0, 2, "ㄴ"], [1, 2, "ㄷ"], [2, 2, "ㅂ"], [3, 2, "ㅅ"], [4, 2, "ㅇ"], [1, 3, "ㄹ"], [2, 3, "ㅁ"]]);
/* 6차시 수학익힘 유사 1 */
const CB5_L6U1 = cb5LabNet([[2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]], { 1: 4, 2: 2, 4: 3 },
  [[2, 0, "ㅌ"], [3, 0, "ㅋ"], [0, 1, "ㄱ"], [1, 1, "ㅎ"], [2, 1, "ㅍ"], [3, 1, "ㅊ"], [4, 1, "ㅈ"], [0, 2, "ㄴ"], [1, 2, "ㅁ"], [2, 2, "ㅂ"], [3, 2, "ㅅ"], [4, 2, "ㅇ"], [0, 3, "ㄷ"], [1, 3, "ㄹ"]]);
/* 5차시 활동 2 정육면체 전개도 후보(다: 같은 쪽에 두 칸 → 접으면 두 면이 겹침) */
const CB5_L5A2 = [
  { name: "가", F: CB5_SQ([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]]) },
  { name: "나", F: CB5_SQ([[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]]) },
  { name: "다", F: CB5_SQ([[0, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1]]) },
  { name: "라", F: CB5_SQ([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]]) }];
/* 6차시 활동 2 직육면체(1 cm, 2 cm, 3 cm) 전개도 후보(가: 맞닿는 모서리의 길이가 다름) */
const CB5_L6A2 = [
  { name: "가", F: [{ x: 0, y: 2, w: 1, h: 3 }, { x: 1, y: 2, w: 2, h: 3 }, { x: 3, y: 2, w: 1, h: 3 }, { x: 4, y: 2, w: 2, h: 3 }, { x: 1, y: 0, w: 2, h: 2 }, { x: 1, y: 5, w: 2, h: 1 }] },
  { name: "나", F: cb5NetFromCells([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], { 1: 2, 2: 3, 4: 1 }) },
  { name: "다", F: cb5NetFromCells([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], { 1: 2, 2: 1, 4: 3 }) },
  { name: "라", F: cb5NetFromCells([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], { 1: 3, 2: 1, 4: 2 }) }];
/* 2차시 상자 가~바 (앞면 다각형, 깊이) */
const CB5_BOXES = [
  { name: "가", P: [[0, 0], [4, 0], [4, 2], [0, 2]], D: 3, color: "#F6D3B4" },
  { name: "나", P: [[0, 0], [4, 0], [3.2, 2.2], [0.8, 2.2]], D: 2.6, color: "#DDEDE5" },
  { name: "다", P: [[0, 0], [2.6, 0], [2.6, 2.6], [0, 2.6]], D: 2.6, color: "#DCEAFB" },
  { name: "라", P: [[0, 0], [4, 0], [2, 2.4], [0, 2.4]], D: 2.2, color: "#FFF1C7" },
  { name: "마", P: [[0, 0], [2, 0], [2, 2], [0, 2]], D: 2, color: "#EADFF6" },
  { name: "바", P: [[0, 0], [2.2, 0], [2.2, 3.4], [0, 3.4]], D: 1.6, color: "#FBE0E6" }];
/* 장난감 설계도(7차시): 머리 정육면체 2 cm · 몸통 직육면체(가로 3, 높이 4, 깊이 2) · 팔 직육면체(1, 3, 1) · 다리 정육면체 1 cm */
const CB5_TOY = {
  head: { name: "머리", kind: "head", W: 2, H: 2, D: 2, color: "#FFD27A", top: "#FFE7B8", side: "#F2C25C", face: (g, w, hh) => { g.append(svgEl("circle", { cx: w * .3, cy: hh * .4, r: 3.5, fill: CB5.ink }), svgEl("circle", { cx: w * .7, cy: hh * .4, r: 3.5, fill: CB5.ink }), svgEl("rect", { x: w * .3, y: hh * .66, width: w * .4, height: 3, fill: CB5.ink })); } },
  body: { name: "몸통", kind: "body", W: 3, H: 4, D: 2, color: "#9CC3F0", top: "#C9DBEE", side: "#7FAEDF" },
  arm: { name: "팔", kind: "arm", W: 1, H: 3, D: 1, color: "#A9DDB8", top: "#D3EEDB", side: "#86C99A" },
  leg: { name: "다리", kind: "leg", W: 1, H: 1, D: 1, color: "#F6B38E", top: "#FBD6C1", side: "#E39A72" } };
const CB5_TOY_SLOTS = [{ kind: "head", x: 3, y: .9, label: "머리" }, { kind: "body", x: 2.5, y: 2.9, label: "몸통" }, { kind: "arm", x: 1.5, y: 2.9, label: "팔" }, { kind: "arm", x: 5.5, y: 2.9, label: "팔" },
  { kind: "leg", x: 2.5, y: 6.9, label: "다리" }, { kind: "leg", x: 4.5, y: 6.9, label: "다리" }];
function cb5ToyFig() {
  const k = 26, pad = 14;
  return cb5Fig(8 * k + pad * 2, 9 * k + pad * 2, s => {
    CB5_TOY_SLOTS.slice().sort((a, b) => a.y - b.y).forEach(sl => { const g = cb5BoxG(CB5_TOY[sl.kind], k); g.setAttribute("transform", `translate(${pad + sl.x * k},${pad + sl.y * k})`); s.append(g); });
    [["머리", 7.1, 1.6], ["몸통", 7.1, 4.6], ["팔", 7.1, 3.6], ["다리", 7.1, 7.6]].forEach(([t, x, y]) => s.append(txt(pad + x * k, pad + y * k, t, 14, { fill: CB5.gray, "text-anchor": "start" })));
  }, "15em");
}
const CB5_PART_NAMES = ["㉠", "㉡", "㉢"];
const CB5_PARTS = {
  head: cb5PartNet([[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 2]], { 1: 2, 2: 2, 4: 2 }, 5, [[3, "u", 2], null, [3, "r", 2]], CB5_PART_NAMES),
  body: cb5PartNet(CB5_CROSS, { 1: 2, 2: 4, 4: 3 }, 4, [[3, "u", 3], null, [3, "r", 2]], CB5_PART_NAMES),
  arm: cb5PartNet(CB5_CROSS, { 1: 1, 2: 3, 4: 1 }, 5, [[3, "u", 1], [0, "l", 1], null], CB5_PART_NAMES),
  leg: cb5PartNet([[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [3, 2]], { 1: 1, 2: 1, 4: 1 }, 5, [null, [1, "u", 1], [3, "r", 1]], CB5_PART_NAMES) };
/* 직사각형·정사각형, 수직과 평행 떠올리기 그림 */
function cb5QuadFig() {
  return cb5Fig(420, 150, s => {
    const R = (x, y, w, hh, c, t) => { s.append(svgEl("rect", { x, y, width: w, height: hh, fill: c, stroke: CB5.ink, "stroke-width": 2 }), txt(x + w / 2, y + hh + 16, t, 15));
      [[x, y, 1, 1], [x + w, y, -1, 1], [x + w, y + hh, -1, -1], [x, y + hh, 1, -1]].forEach(([a, b, u, v]) => s.append(svgEl("polyline", { points: `${a + u * 10},${b} ${a + u * 10},${b + v * 10} ${a},${b + v * 10}`, fill: "none", stroke: CB5.red, "stroke-width": 1.5 }))); };
    R(30, 25, 150, 80, "#DCEAFB", "가"); R(250, 15, 100, 100, "#FDE3D3", "나");
  }, "22em");
}
function cb5LineFig() {
  return cb5Fig(420, 170, s => {
    const L = (x1, y1, x2, y2, c) => s.append(svgEl("line", { x1, y1, x2, y2, stroke: c, "stroke-width": 3, "stroke-linecap": "round" }));
    L(20, 40, 190, 40, CB5.blue); L(20, 120, 190, 120, CB5.blue); s.append(txt(105, 155, "가", 16));
    L(250, 130, 400, 130, CB5.org); L(325, 20, 325, 130, CB5.org); s.append(svgEl("polyline", { points: "325,116 339,116 339,130", fill: "none", stroke: CB5.red, "stroke-width": 2 })); s.append(txt(325, 155, "나", 16));
  }, "22em");
}
/* 2차시 확인: ①②③이 가리키는 곳 */
function cb5PartsFig(lab) {
  return cb5Cub({ W: 5, H: 3, D: 3, k: 30, maxW: "16em", extra: (s, S) => {
    const mark = (p, t, dx, dy) => { s.append(svgEl("line", { x1: cb5R(p[0]), y1: cb5R(p[1]), x2: cb5R(p[0] + dx), y2: cb5R(p[1] + dy), stroke: CB5.red, "stroke-width": 1.6 }), svgEl("circle", { cx: cb5R(p[0]), cy: cb5R(p[1]), r: 3.5, fill: CB5.red }),
      txt(cb5R(p[0] + dx * 1.25), cb5R(p[1] + dy * 1.25), t, 16, { fill: CB5.red })); };
    mark(S[lab[0].i], lab[0].t, -16, -14);
    const fc = [(S[0][0] + S[2][0]) / 2, (S[0][1] + S[2][1]) / 2]; mark(fc, lab[1].t, -22, 22);
    const em = [(S[1][0] + S[5][0]) / 2, (S[1][1] + S[5][1]) / 2]; mark(em, lab[2].t, 22, 12);
  } });
}

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 연서의 국제 물류 센터 견학", soop: "개념 찾기(S)",
  question: "우리 주변에서 직육면체 모양의 상자는 어디에, 왜 쓰이고 있을까요?",
  summary: "컨테이너, 택배 상자, 사물함처럼 우리 주변에는 직사각형으로 둘러싸인 상자 모양이 많아요. 이런 모양은 짐을 꾸리기 편하고 쌓거나 옮기기 쉬워요. 이 단원에서는 직육면체와 정육면체, 겨냥도, 직육면체의 성질, 전개도를 알아봐요.",
  steps: [
    { name: "살펴보기", inst: "트럭에 싣고 있는 컨테이너는 쇠로 만들어진 큰 상자예요. 컨테이너를 이리저리 돌려 가며 둘러싸고 있는 면을 하나씩 눌러 모두 찾아보세요.", hints: ["보이는 면을 누른 뒤, 그림을 돌려 뒤쪽·아래쪽 면도 찾아요.", "누른 면에는 번호가 붙어요."],
      render: (b, a) => cb5Count(b, a, { dims: [6, 2.6, 2.4], kinds: ["face"], fillAll: "#F3D2B0", msg: "컨테이너를 둘러싼 면을 모두 찾았어요.",
        ask: [{ parts: ["컨테이너를 둘러싸고 있는 면은 모두 ", { n: 6, why: { "3": "보이는 면만 세었어요. 돌려 보면 뒤쪽, 아래쪽에도 면이 있어요." } }, "개이고, 면의 모양은 모두 ", { o: ["직사각형", "삼각형", "원"], a: 0 }, "이에요."] },
          { q: "컨테이너를 이런 상자 모양으로 만든 까닭은 무엇일까요?", parts: [{ o: ["짐을 꾸리기 편하고 운반이 쉬워서", "잘 굴러가서", "가장 가벼운 모양이라서"], a: 0 }] }],
        ok: "컨테이너는 직사각형 6개로 둘러싸인 상자 모양이라서 짐을 꾸리기 편하고 쌓거나 옮기기 쉬워요." }) },
    { name: "떠올리기 ①", inst: "배운 내용을 떠올려 보세요. (수학익힘 ‘이전에 배웠어요’ ― 직사각형과 정사각형)", hints: ["네 각이 모두 직각인 사각형을 떠올려요.", "네 변의 길이가 모두 같은지도 살펴봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "가처럼 네 각이 모두 직각인 사각형을 무엇이라고 할까요?", fig: cb5QuadFig, o: ["직사각형", "사다리꼴", "마름모"], a: 0, why: { "1": "사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이에요.", "2": "마름모는 네 변의 길이가 모두 같은 사각형이에요." } },
        { q: "나처럼 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형을 무엇이라고 할까요?", o: ["정사각형", "평행사변형", "삼각형"], a: 0 }],
        { ok: "네 각이 모두 직각인 사각형은 직사각형, 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형은 정사각형이에요." }) },
    { name: "떠올리기 ②", inst: "배운 내용을 떠올려 보세요. (수학익힘 ‘이전에 배웠어요’ ― 수직과 평행)", hints: ["두 직선이 만나서 이루는 각이 직각이면 수직이에요.", "서로 만나지 않는 두 직선은 평행해요."],
      render: (b, a) => quiz(b, a, [
        { q: "나처럼 두 직선이 만나서 이루는 각이 직각일 때, 두 직선은 서로 어떻다고 할까요?", fig: cb5LineFig, o: ["수직이다", "평행하다"], a: 0 },
        { q: "가처럼 아무리 늘여도 서로 만나지 않는 두 직선은 서로 어떻다고 할까요?", o: ["수직이다", "평행하다"], a: 1 }],
        { ok: "만나서 직각을 이루면 수직, 늘여도 만나지 않으면 평행이에요." }) },
    { name: "이야기 보기", inst: "연서는 로봇 공학자인 아버지가 일하는 국제 물류 센터에 견학을 갔어요. “연서야, 여기가 바로 우리가 만든 미래야. 사람을 대신해서 로봇들이 일을 하지.” 물류 센터에서 로봇들이 하는 일과 상자의 모양을 살펴봐요.", hints: ["로봇들은 상자를 분류하고, 운반하고, 정리해요.", "쌓여 있는 상자는 직사각형으로 둘러싸여 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "물류 센터에서 로봇들이 하는 일을 모두 골라 보세요.", o: ["상자를 모양에 따라 분류해요", "상자를 운반해요", "상자를 정리해요", "상자의 모서리를 잘라서 펼쳐요", "상자에 그림을 그려요"], a: [0, 1, 2, 3] },
        { q: "물류 센터에 쌓여 있는 상자들은 어떤 도형으로 둘러싸여 있나요?", o: ["직사각형", "원", "삼각형"], a: 0 }],
        { ok: "로봇들은 상자를 분류하고, 운반하고, 정리하고, 잘라서 펼치기도 해요. 쌓여 있는 상자는 직사각형으로 둘러싸여 있어요." }) },
    { name: "확인하기", inst: "상자 모양을 본 경험을 떠올리고, 이 단원에서 알고 싶은 것을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "상자 모양의 물건을 본 곳을 써 보세요.", tag: "본 곳", ph: "예) 택배 상자, 교실 사물함, 마트의 과일 상자" },
        { q: "직육면체는 직사각형과 어떤 관련이 있을지, 이 단원에서 알고 싶은 것을 써 보세요.", tag: "알고 싶은 것", ph: "예) 직사각형 몇 개로 둘러싸여 있는지 알고 싶어요." }]) }
  ],
  challenge: { inst: "직사각형으로만 둘러싸인 물건을 모두 골라 보세요.", hints: ["굽은 면이 있는 물건은 직사각형으로만 둘러싸여 있지 않아요."],
    render: (b, a) => cb5Pick(b, a, { items: [{ name: "휴지 상자", fig: CB5_OBJ.tissue }, { name: "음료수 캔", fig: CB5_OBJ.can }, { name: "책", fig: CB5_OBJ.book }, { name: "공", fig: CB5_OBJ.ball }, { name: "고깔", fig: CB5_OBJ.cone }], a: [0, 2],
      whyExtra: i => ["", "음료수 캔은 둥근 면이 있어요.", "", "공은 둥근 면으로만 되어 있어요.", "고깔은 뾰족하고 둥근 면이 있어요."][i], ok: "휴지 상자와 책은 직사각형으로만 둘러싸여 있어요." }) }
},
{
  id: "t2", no: 2, title: "직육면체와 정육면체를 알아볼까요", soop: "개념 구축하기(O)",
  question: "직육면체와 정육면체는 어떤 도형이고, 무엇으로 이루어져 있을까요?",
  summary: "직사각형 6개로 둘러싸인 도형을 직육면체, 정사각형 6개로 둘러싸인 도형을 정육면체라고 해요. 선분으로 둘러싸인 부분을 면, 면과 면이 만나는 선분을 모서리, 모서리와 모서리가 만나는 점을 꼭짓점이라고 해요. 직육면체와 정육면체는 면 6개, 모서리 12개, 꼭짓점 8개로 같고, 면의 모양과 모서리의 길이가 달라요.",
  steps: [
    { name: "만져 보기", inst: "물건이 들어 있는 상자를 모양에 따라 분류하고 있어요. 상자 가~바를 하나씩 눌러 상자를 둘러싸고 있는 도형을 살펴보세요.", hints: ["상자를 누르면 둘러싼 면 6개가 펼쳐져 보여요.", "면의 네 각이 모두 직각인지, 네 변의 길이가 모두 같은지 살펴봐요."],
      render: (b, a) => cb5Boxes(b, a, { boxes: CB5_BOXES,
        ask: [{ q: "직사각형으로 둘러싸인 상자를 모두 찾아보세요.", parts: [{ o: CB5_GA, multi: true, a: [0, 2, 4, 5] }] },
          { q: "정사각형으로 둘러싸인 상자를 모두 찾아보세요.", parts: [{ o: CB5_GA, multi: true, a: [2, 4] }] }],
        bad: "상자를 다시 눌러 면 6개의 모양을 살펴봐요. 나와 라에는 사다리꼴 모양의 면이 있어요.",
        ok: "가, 다, 마, 바는 직사각형으로 둘러싸여 있고, 다와 마는 정사각형으로 둘러싸여 있어요. 나와 라에는 사다리꼴 모양의 면이 있어요." }) },
    { name: "약속하기", inst: "직육면체와 정육면체를 약속하고, 물건 가~바 중에서 직육면체 모양과 정육면체 모양을 찾아보세요.", hints: ["직사각형 6개로 둘러싸인 도형을 찾아요.", "정사각형 6개로 둘러싸인 도형을 찾아요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["직사각형 6개로 둘러싸인 도형을 ", { o: ["직육면체", "정육면체", "사각형"], a: 0 }, "라고 해요. 정사각형 6개로 둘러싸인 도형을 ", { o: ["직육면체", "정육면체", "정사각형"], a: 1 }, "라고 해요."], { ok: "직사각형 6개 → 직육면체, 정사각형 6개 → 정육면체예요." }),
        { title: "직육면체 모양을 모두 골라 보세요.", run: (bx, ax) => cb5Pick(bx, ax, { items: [{ name: "가", fig: CB5_OBJ.dice }, { name: "나", fig: CB5_OBJ.can }, { name: "다", fig: CB5_OBJ.tissue }, { name: "라", fig: CB5_OBJ.ball }, { name: "마", fig: CB5_OBJ.cube }, { name: "바", fig: CB5_OBJ.book }], a: [0, 2, 4, 5],
          whyExtra: i => i === 1 ? "나는 둥근 면이 있어요." : "라는 둥근 면으로만 되어 있어요.", whyMiss: "직사각형 6개로 둘러싸인 물건을 모두 찾아요.", ok: "가, 다, 마, 바는 직사각형 6개로 둘러싸여 있어요." }) },
        { title: "정육면체 모양을 모두 골라 보세요.", run: (bx, ax) => cb5Pick(bx, ax, { items: [{ name: "가", fig: CB5_OBJ.dice }, { name: "나", fig: CB5_OBJ.can }, { name: "다", fig: CB5_OBJ.tissue }, { name: "라", fig: CB5_OBJ.ball }, { name: "마", fig: CB5_OBJ.cube }, { name: "바", fig: CB5_OBJ.book }], a: [0, 4],
          whyExtra: i => ({ 1: "나는 둥근 면이 있어요.", 2: "다의 면은 정사각형이 아닌 직사각형이에요.", 3: "라는 둥근 면으로만 되어 있어요.", 5: "바의 면은 정사각형이 아닌 직사각형이에요." })[i], ok: "가와 마는 정사각형 6개로 둘러싸여 있어요." }) }]) },
    { name: "세어 보기", inst: "직사각형 6개를 붙여 직육면체를 만들었어요. 직육면체를 돌려 가며 면, 모서리, 꼭짓점을 하나씩 눌러 모두 세어 보세요.", hints: ["직사각형과 직사각형이 만나는 선분(접착테이프를 붙인 곳)이 모서리예요.", "선분 3개가 만나는 점이 꼭짓점이에요. 돌려서 뒤쪽도 찾아요."],
      render: (b, a) => cb5Count(b, a, { dims: [4, 2.5, 3],
        ask: [{ q: "약속을 완성해 보세요.", parts: ["선분으로 둘러싸인 부분을 ", { o: ["면", "모서리", "꼭짓점"], a: 0 }, ", 면과 면이 만나는 선분을 ", { o: ["면", "모서리", "꼭짓점"], a: 1 }, ", 모서리와 모서리가 만나는 점을 ", { o: ["면", "모서리", "꼭짓점"], a: 2 }, "이라고 해요."] },
          { parts: ["직육면체의 면은 ", { n: 6 }, "개, 모서리는 ", { n: 12, why: { "9": "보이는 모서리만 세었어요. 돌려서 뒤쪽 모서리도 세어 봐요." } }, "개, 꼭짓점은 ", { n: 8, why: { "7": "뒤쪽 아래에 숨은 꼭짓점이 하나 더 있어요." } }, "개예요."] }],
        ok: "선분으로 둘러싸인 부분은 면, 면과 면이 만나는 선분은 모서리, 모서리와 모서리가 만나는 점은 꼭짓점이에요. 직육면체는 면 6개, 모서리 12개, 꼭짓점 8개예요." }) },
    { name: "비교하기", inst: "정사각형 6개를 붙여 만든 정육면체도 면, 모서리, 꼭짓점을 세어 보고, 직육면체와 비교해 보세요.", hints: ["정육면체도 돌려 가며 하나씩 세어요.", "면의 수, 모서리의 수, 꼭짓점의 수는 같고 면의 모양과 모서리의 길이가 달라요."],
      render: (b, a) => cb5Count(b, a, { dims: [3, 3, 3], ask: [
          { parts: ["정육면체의 면은 ", { n: 6 }, "개, 모서리는 ", { n: 12 }, "개, 꼭짓점은 ", { n: 8 }, "개예요."] },
          { q: "직육면체와 정육면체를 비교해 보세요.", parts: ["면의 수, 모서리의 수, 꼭짓점의 수는 ", { o: ["같아요", "달라요"], a: 0 }, ". 면의 모양은 직육면체가 ", { o: ["직사각형", "정사각형", "사다리꼴"], a: 0 }, ", 정육면체가 ", { o: ["직사각형", "정사각형", "삼각형"], a: 1 }, "이에요. 정육면체는 모든 모서리의 길이가 ", { o: ["같고", "다르고"], a: 0 }, ", 직육면체는 길이가 같은 모서리가 ", { o: ["4개씩 3쌍", "2개씩 6쌍", "12개 모두"], a: 0 }, " 있어요."] }],
        ok: "직육면체와 정육면체는 면 6개, 모서리 12개, 꼭짓점 8개로 같아요. 면의 모양과 모서리의 길이가 달라요." }) },
    { name: "확인하기", inst: "수학익힘 문제예요. 직육면체와 정육면체의 구성 요소를 확인해 보세요.", hints: ["점은 꼭짓점, 선분으로 둘러싸인 부분은 면, 면과 면이 만나는 선분은 모서리예요.", "정육면체는 모든 모서리의 길이가 같아요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => cb5Ask(bx, ax, [{ q: "직육면체에서 ①, ②, ③이 가리키는 곳의 이름을 골라 보세요.", fig: () => cb5PartsFig([{ i: 3, t: "①" }, { t: "②" }, { t: "③" }]),
          parts: ["① ", { o: ["꼭짓점", "면", "모서리"], a: 0 }, "  ② ", { o: ["꼭짓점", "면", "모서리"], a: 1 }, "  ③ ", { o: ["꼭짓점", "면", "모서리"], a: 2 }] }], { ok: "① 꼭짓점, ② 면, ③ 모서리예요." }),
        (bx, ax) => cb5Ask(bx, ax, [
          { q: "정육면체의 면, 모서리, 꼭짓점은 각각 몇 개일까요?", parts: ["면 ", { n: 6 }, "개, 모서리 ", { n: 12 }, "개, 꼭짓점 ", { n: 8 }, "개"] },
          { q: "정육면체를 보고 ㉠, ㉡에 알맞은 수를 써 보세요.", fig: () => cb5Cub({ W: 3, H: 3, D: 3, k: 34, maxW: "14em", dims: [[0, 1, "11 cm"], [1, 3, "㉠ cm"], [3, 7, "㉡ cm"]] }),
            parts: ["㉠ ", { n: 11 }, " cm, ㉡ ", { n: 11 }, " cm"] }], { ok: "정육면체는 면 6개, 모서리 12개, 꼭짓점 8개이고, 모든 모서리의 길이가 11 cm로 같아요." })]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 정육면체를 찾고, 잘못 말한 것을 바르게 고쳐 보세요.", hints: ["정사각형 6개로 둘러싸인 도형이 정육면체예요.", "직육면체는 길이가 같은 모서리가 4개씩 3쌍 있어요."],
    render: (b, a) => cb5Chain(b, a, [
      (bx, ax) => cb5Pick(bx, ax, { q: "정육면체를 모두 골라 보세요.", items: [
          { name: "①", fig: () => cb5Prism({ P: [[0, 0], [4, 0], [3, 2.4], [1, 2.4]], D: 2.4, k: 20, maxW: "100%", plain: true, pad: 12 }) },
          { name: "②", fig: () => cb5Cub({ W: 2.6, H: 2.6, D: 2.6, k: 20, maxW: "100%", plain: true, pad: 12 }) },
          { name: "③", fig: () => cb5Cub({ W: 4, H: 2, D: 2.6, k: 20, maxW: "100%", plain: true, pad: 12 }) },
          { name: "④", fig: () => cb5Prism({ P: [[0, 0], [3.4, 0], [1.7, 2.8]], D: 3, k: 20, maxW: "100%", plain: true, pad: 12 }) }], a: [1],
        whyExtra: i => ({ 0: "①에는 사다리꼴 모양의 면이 있어요.", 2: "③의 면은 정사각형이 아닌 직사각형이에요.", 3: "④에는 삼각형 모양의 면이 있어요." })[i], ok: "정사각형 6개로 둘러싸인 ②가 정육면체예요." }),
      (bx, ax) => quiz(bx, ax, [
        { q: "가로 5 cm, 세로 3 cm, 높이 3 cm인 직육면체가 정육면체가 아닌 까닭을 골라 보세요.", fig: () => cb5Cub({ W: 5, H: 3, D: 3, k: 26, maxW: "14em", dims: [[0, 1, "5 cm"], [1, 3, "3 cm"], [3, 7, "3 cm"]] }),
          o: ["정사각형이 아닌 면이 있기 때문이에요.", "면이 6개보다 많기 때문이에요.", "꼭짓점이 8개이기 때문이에요."], a: 0, why: { "1": "이 도형의 면은 6개예요.", "2": "정육면체도 꼭짓점이 8개예요." } },
        { q: "유성: “직육면체와 정육면체는 모서리의 길이가 모두 같아.” 유성이의 말을 바르게 고친 것을 골라 보세요.",
          o: ["정육면체는 모서리의 길이가 모두 같지만, 직육면체는 길이가 같은 모서리가 4개씩 3쌍 있어요.", "직육면체와 정육면체는 모서리의 길이가 모두 달라요.", "직육면체는 모서리의 길이가 모두 같지만, 정육면체는 달라요."], a: 0 }],
        { ok: "정사각형이 아닌 면이 있으면 정육면체가 아니에요. 정육면체는 모서리의 길이가 모두 같지만, 직육면체는 길이가 같은 모서리가 4개씩 3쌍 있어요." })]) }
},
{
  id: "t3", no: 3, title: "직육면체의 겨냥도를 알아볼까요", soop: "개념 구축하기(O)",
  question: "직육면체 모양을 잘 알 수 있게 그리려면 어떻게 나타내면 좋을까요?",
  summary: "직육면체 모양을 잘 알 수 있도록 나타낸 그림을 직육면체의 겨냥도라고 해요. 겨냥도에서는 보이는 모서리를 실선으로, 보이지 않는 모서리를 점선으로 그려요. 겨냥도에는 보이는 면 3개와 보이지 않는 면 3개, 보이는 모서리 9개와 보이지 않는 모서리 3개, 보이는 꼭짓점 7개와 보이지 않는 꼭짓점 1개가 있어요.",
  steps: [
    { name: "만져 보기", inst: "연서는 직육면체 모양의 상자를 그리려고 해요. 정면에서 본 상자는 면이 1개만 보여요. 상자를 돌려서 면이 3개 보이게 만들어 보세요.", hints: ["▶와 ▲ 단추로 조금씩 돌려 봐요.", "비스듬히 위에서 보면 앞면, 옆면, 윗면이 함께 보여요."],
      render: (b, a) => cb5SeeFaces(b, a, { dims: [4, 2.5, 3], yaw: 0, pitch: 0, goal: 3, msg: "면이 3개 보이도록 돌렸어요.",
        ask: [{ q: "같은 직육면체를 여러 방향에서 본 모양이에요.", fig: () => h("div", { class: "cb5row" },
            ...[[-35, 24, "가"], [-35, 0, "나"], [0, 0, "다"]].map(([y, p, t]) => h("div", { style: "text-align:center" }, cb5Solid({ dims: [4, 2.5, 3], yaw: y, pitch: p, hidden: "none", fixed: true, size: [260, 200], fill: () => "#FFE7B8", maxW: "11em" }).svg, h("div", { class: "jua" }, t)))),
          parts: ["보이는 면의 수: 가 ", { n: 3 }, "개, 나 ", { n: 2 }, "개, 다 ", { n: 1 }, "개", h("br"), "직육면체 모양을 가장 잘 알 수 있는 것은 ", { o: ["가", "나", "다"], a: 0 }, "예요.", h("br"),
            "보이지 않는 면도 알 수 있게 하려면 보이지 않는 모서리를 ", { o: ["점선으로 그려요", "그리지 않아요", "더 굵게 그려요"], a: 0 }, "."] }],
        ok: "가처럼 비스듬히 위에서 본 모양이 직육면체를 가장 잘 나타내요. 보이지 않는 모서리는 점선으로 그리면 돼요." }) },
    { name: "약속하기", inst: "겨냥도를 약속해 보세요.", hints: ["보이는 모서리와 보이지 않는 모서리를 다르게 그려요."],
      render: (b, a) => blanks(b, a, ["직육면체 모양을 잘 알 수 있도록 나타낸 그림을 직육면체의 ", { o: ["겨냥도", "전개도", "설계도"], a: 0 }, "라고 해요. 겨냥도에서 보이는 모서리는 ", { o: ["실선", "점선"], a: 0 }, "으로, 보이지 않는 모서리는 ", { o: ["실선", "점선"], a: 1 }, "으로 나타내요."],
        { ok: "직육면체 모양을 잘 알 수 있도록 나타낸 그림이 겨냥도예요. 보이는 모서리는 실선, 보이지 않는 모서리는 점선이에요." }) },
    { name: "그려 보기", inst: "모눈종이에 직육면체의 겨냥도를 그려 보세요. 앞면은 그려져 있어요. 점에서 점까지 끌어 모서리를 긋고, 보이지 않는 모서리는 점선 펜으로 그어요.", hints: ["평행한 모서리는 평행하게 그어요. 앞면의 꼭짓점에서 오른쪽으로 2칸, 위로 2칸 간 곳에 뒤쪽 꼭짓점이 있어요.", "왼쪽 아래 뒤쪽의 꼭짓점에서 만나는 모서리 3개가 보이지 않는 모서리예요."],
      render: (b, a) => cb5Sketch(b, a, { W: 4, H: 3, dx: 2, dy: 2, cols: 8, rows: 7, ox: 1, oy: 1, given: [0, 1, 3, 5], mode: "draw",
        ask: [{ q: "그린 겨냥도를 살펴보고 빈칸을 채워 보세요.",
          parts: ["보이는 면 ", { n: 3 }, "개, 보이지 않는 면 ", { n: 3 }, "개", h("br"), "보이는 모서리 ", { n: 9 }, "개, 보이지 않는 모서리 ", { n: 3 }, "개", h("br"), "보이는 꼭짓점 ", { n: 7 }, "개, 보이지 않는 꼭짓점 ", { n: 1 }, "개"] }],
        ok: "겨냥도에는 보이는 면 3개·보이지 않는 면 3개, 실선 9개·점선 3개, 보이는 꼭짓점 7개·보이지 않는 꼭짓점 1개가 있어요." }) },
    { name: "완성하기", inst: "직육면체의 겨냥도를 완성해 보세요. 빠진 모서리를 찾아 실선 또는 점선으로 그어요.", hints: ["모서리는 모두 12개예요. 지금 그려진 모서리를 세어 봐요.", "평행한 모서리는 평행하게, 길이가 같은 모서리는 같게 그어요."],
      render: (b, a) => cb5Sketch(b, a, { W: 5, H: 2, dx: 3, dy: 2, cols: 10, rows: 6, ox: 1, oy: 1, mode: "draw", given: [0, 1, 2, 5, 9, 11, 4] }) },
    { name: "확인하기", inst: "수학익힘 문제예요. 겨냥도를 바르게 그렸는지 확인해 보세요.", hints: ["보이는 모서리는 실선, 보이지 않는 모서리는 점선이에요.", "모서리 12개가 모두 있는지 세어 봐요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "직육면체의 겨냥도를 바르게 그린 것을 골라 보세요.", fig: () => h("div", { class: "cb5row" },
            h("div", { style: "text-align:center" }, cb5Cub({ W: 4, H: 2.5, D: 3, k: 24, hidden: "solid", maxW: "10em" }), h("div", { class: "jua" }, "가")),
            h("div", { style: "text-align:center" }, cb5Cub({ W: 4, H: 2.5, D: 3, k: 24, maxW: "10em" }), h("div", { class: "jua" }, "나")),
            h("div", { style: "text-align:center" }, cb5Cub({ W: 4, H: 2.5, D: 3, k: 24, maxW: "10em", miss: [[3, 7]] }), h("div", { class: "jua" }, "다"))),
          o: ["가", "나", "다"], a: 1, why: { "0": "가는 보이지 않는 모서리까지 실선으로 그렸어요.", "2": "다는 보이는 모서리 하나가 빠졌어요." } }], { ok: "나처럼 보이는 모서리 9개는 실선, 보이지 않는 모서리 3개는 점선으로 그려요." }),
        { title: "정육면체의 겨냥도에서 보이지 않는 모서리를 모두 찾아 눌러 ○표 하세요.", run: (bx, ax) => cb5Sketch(bx, ax, { W: 3, H: 3, dx: 2, dy: 2, cols: 7, rows: 7, ox: 1, oy: 1, mode: "pick",
          ask: [{ q: "정육면체의 겨냥도를 보고 표를 완성해 보세요. (보이는 면은 3개예요.)", parts: ["보이지 않는 면 ", { n: 3 }, "개, 보이는 꼭짓점 ", { n: 7, why: { "8": "뒤쪽 아래의 꼭짓점 1개는 보이지 않아요." } }, "개, 보이지 않는 꼭짓점 ", { n: 1 }, "개"] }],
          ok: "정육면체의 겨냥도에도 보이지 않는 모서리 3개, 보이지 않는 면 3개, 보이지 않는 꼭짓점 1개가 있어요." }) }]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 가로 10 cm, 세로 8 cm, 높이 4 cm인 직육면체의 겨냥도를 보고 모서리 길이의 합을 구해 보세요.", hints: ["보이는 모서리 9개에는 10 cm, 8 cm, 4 cm인 모서리가 3개씩 있어요.", "보이지 않는 모서리 3개에는 10 cm, 8 cm, 4 cm인 모서리가 1개씩 있어요."],
    render: (b, a) => cb5Ask(b, a, [{ fig: () => cb5Cub({ W: 5, H: 2, D: 4, k: 32, maxW: "18em", dims: [[0, 1, "10 cm"], [1, 3, "4 cm"], [3, 7, "8 cm"]] }),
      parts: ["보이는 모서리 길이의 합: (10 + 8 + 4) × ", { n: 3 }, " = ", { n: 66, why: { "22": "보이는 모서리는 9개라서 10 cm, 8 cm, 4 cm가 3개씩 있어요.", "88": "보이는 모서리는 12개가 아니라 9개예요." } }, " (cm)", h("br"),
        "보이지 않는 모서리 길이의 합: 10 + 8 + 4 = ", { n: 22, why: { "66": "보이지 않는 모서리는 3개뿐이에요. 길이가 다른 모서리가 1개씩 있어요." } }, " (cm)"] }],
      { ok: "보이는 모서리의 합은 (10+8+4)×3=66 (cm), 보이지 않는 모서리의 합은 10+8+4=22 (cm)예요." }) }
},
{
  id: "t4", no: 4, title: "직육면체의 성질을 알아볼까요", soop: "개념 구축하기(O)",
  question: "직육면체에서 마주 보는 면과 서로 만나는 면은 어떤 관계일까요?",
  summary: "직육면체에서 계속 늘여도 만나지 않는 두 면을 서로 평행하다고 하고, 이 두 면을 직육면체의 밑면이라고 해요. 서로 평행한 면은 3쌍이고 각각 밑면이 될 수 있어요. 밑면과 만나는 면을 옆면이라고 하고, 밑면과 옆면은 수직으로 만나요. 한 면과 수직인 면은 4개예요.",
  steps: [
    { name: "만져 보기", inst: "로봇이 직육면체 모양의 상자를 운반하고 있어요. “이 상자들은 어떻게 안정적으로 쌓을 수 있는 걸까?” 상자를 돌려 가며 마주 보는 면을 두 개씩 눌러 모두 찾아보세요.", hints: ["한 면을 누른 뒤, 그 면과 만나지 않는 반대쪽 면을 눌러요.", "뒤쪽, 아래쪽 면은 돌려서 찾아요."],
      render: (b, a) => cb5OppPairs(b, a, { dims: [4, 2.5, 3],
        ask: [{ q: "마주 보는 두 면에 자를 대어 보았어요. 자를 계속 늘이면 어떻게 될까요?", fig: () => cb5Cub({ W: 4, H: 2.5, D: 3, k: 30, maxW: "15em", fill: { 5: CB5.par, 4: CB5.par }, extra: (s, S) => {
            [[S[3], S[7]], [S[0], S[4]]].forEach(([p, q]) => { const dx = q[0] - p[0], dy = q[1] - p[1]; s.append(svgEl("line", { x1: cb5R(p[0] - dx * .3), y1: cb5R(p[1] - dy * .3 - 8), x2: cb5R(q[0] + dx * .5), y2: cb5R(q[1] + dy * .5 - 8), stroke: CB5.org, "stroke-width": 5, "stroke-linecap": "round", opacity: .8 })); }); } }),
          parts: ["마주 보는 면은 모두 ", { n: 3 }, "쌍이에요. 마주 보는 두 면은 계속 늘여도 서로 ", { o: ["만나지 않아요", "만나요"], a: 0 }, "."] }],
        ok: "마주 보는 면은 3쌍이고, 마주 보는 두 면은 계속 늘여도 만나지 않아요." }) },
    { name: "약속하기", inst: "직육면체의 평행한 면과 밑면을 약속하고, 단추를 눌러 밑면을 바꿔 보세요.", hints: ["상자를 어느 면으로 놓아도 그 면과 마주 보는 면이 밑면이 돼요.", "서로 평행한 면은 3쌍이에요."],
      render: (b, a) => cb5Bases(b, a, { dims: [4, 2.5, 3],
        ask: [{ parts: ["직육면체에서 계속 늘여도 만나지 않는 두 면을 서로 ", { o: ["평행하다", "수직이다"], a: 0 }, "고 해요. 이 두 면을 직육면체의 ", { o: ["밑면", "옆면", "윗면"], a: 0 }, "이라고 해요. 직육면체에는 서로 평행한 면이 ", { n: 3 }, "쌍 있고, 서로 평행한 면은 각각 밑면이 ", { o: ["될 수 있어요", "될 수 없어요"], a: 0 }, "."] }],
        ok: "계속 늘여도 만나지 않는 두 면은 서로 평행하고, 이 두 면이 밑면이에요. 평행한 면 3쌍은 모두 밑면이 될 수 있어요." }) },
    { name: "만나는 면", inst: "색칠한 면(○표 한 면)과 만나는 면을 모두 눌러 찾아보세요. 그림을 돌려 가며 찾아요.", hints: ["색칠한 면의 네 모서리마다 만나는 면이 하나씩 있어요.", "마주 보는 면은 만나지 않아요."],
      render: (b, a) => cb5FacePick(b, a, { dims: [4, 2.5, 3], lab: false, base: 0, baseText: "○", need: [2, 3, 4, 5],
        whyExtra: f => f === 1 ? "그 면은 색칠한 면과 마주 보는 면이라서 만나지 않아요." : "그 면은 답이 아니에요.", whyFew: "아직 더 있어요. 색칠한 면의 네 모서리마다 만나는 면이 있어요.",
        msg: "색칠한 면과 만나는 면은 4개예요.",
        ask: [{ q: "삼각자 3개의 직각 부분을 한 꼭짓점에서 만나도록 대어 보았어요. 서로 만나는 면은 어떻게 만날까요?", fig: cb5RightFig,
          parts: ["색칠한 면과 만나는 면은 ", { n: 4 }, "개예요. 면끼리 만나는 부분과 삼각자의 직각 부분이 꼭 맞으므로 서로 만나는 면은 ", { o: ["수직으로", "평행하게"], a: 0 }, " 만나요."] }],
        ok: "한 면과 만나는 면은 4개이고, 서로 만나는 면은 수직으로 만나요." }) },
    { name: "약속하기", inst: "직육면체의 옆면을 약속해 보세요.", hints: ["밑면과 만나는 면이 옆면이에요."],
      render: (b, a) => blanks(b, a, ["직육면체에서 밑면과 만나는 면을 직육면체의 ", { o: ["옆면", "밑면", "윗면"], a: 0 }, "이라고 해요. 이때 밑면과 옆면은 ", { o: ["수직으로", "평행하게"], a: 0 }, " 만나요. 한 밑면에 대한 옆면은 모두 ", { o: ["4개", "2개", "6개"], a: 0 }, "예요."],
        { ok: "밑면과 만나는 면이 옆면이고, 밑면과 옆면은 수직으로 만나요. 한 밑면에 대한 옆면은 4개예요." }) },
    { name: "확인하기", inst: "직육면체에서 면 ㄱㄴㄷㄹ과 평행한 면, 수직인 면을 찾아보세요. 그림을 돌리면 꼭짓점 이름이 함께 움직여요.", hints: ["면 ㄱㄴㄷㄹ과 마주 보는 면이 평행한 면이에요.", "면 이름은 꼭짓점을 시계 방향이나 시계 반대 방향으로 차례대로 읽어요."],
      render: (b, a) => cb5Chain(b, a, [
        { title: "① 면 ㄱㄴㄷㄹ과 평행한 면을 눌러 보세요.", run: (bx, ax) => cb5FacePick(bx, ax, { dims: [4, 2.5, 3], base: 5, need: [4], baseText: "면 ㄱㄴㄷㄹ", whyExtra: () => "그 면은 면 ㄱㄴㄷㄹ과 만나요. 평행한 면은 마주 보는 면이에요.", ok: "면 ㄱㄴㄷㄹ과 평행한 면은 면 ㅁㅂㅅㅇ이에요." }) },
        { title: "② 면 ㄱㄴㄷㄹ과 수직인 면을 모두 눌러 보세요.", run: (bx, ax) => cb5FacePick(bx, ax, { dims: [4, 2.5, 3], base: 5, need: [0, 1, 2, 3], baseText: "면 ㄱㄴㄷㄹ", whyExtra: () => "면 ㅁㅂㅅㅇ은 면 ㄱㄴㄷㄹ과 평행한 면이에요.", ok: "면 ㄱㄴㄷㄹ과 수직인 면은 4개예요." }) },
        { title: "③ 면 이름을 써 보세요. (자음 단추를 눌러 써도 돼요.)", run: (bx, ax) => cb5FaceAsk(bx, ax, [
          { q: "면 ㄱㄴㄷㄹ과 평행한 면", ans: [4] }, { q: "면 ㄱㄴㄷㄹ과 수직인 면 4개", ans: [0, 1, 2, 3], why: "면 ㄱㄴㄷㄹ과 만나는 면 4개를 써요." }],
          { ok: "평행한 면은 면 ㅁㅂㅅㅇ, 수직인 면은 면 ㄴㅂㅅㄷ, 면 ㄷㅅㅇㄹ, 면 ㄱㅁㅇㄹ, 면 ㄱㄴㅂㅁ이에요." }) }]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 직육면체의 성질을 이용해 풀어 보세요.", hints: ["한 면과 평행한 면은 1개, 수직인 면은 4개예요.", "두 면에 동시에 수직인 면은 두 면 모두와 만나는 면이에요."],
    render: (b, a) => cb5Chain(b, a, [
      (bx, ax) => quiz(bx, ax, [{ q: "직육면체에 대해 잘못 설명한 것을 골라 보세요.", o: ["㉠ 한 모서리에서 만나는 두 면은 수직이에요.", "㉡ 밑면이 될 수 있는 면은 모두 2쌍이에요.", "㉢ 한 꼭짓점에서 만나는 모서리는 모두 3개예요."], a: 1,
        why: { "0": "한 모서리에서 만나는 두 면은 수직으로 만나요. 옳은 설명이에요.", "2": "한 꼭짓점에서 모서리 3개가 만나요. 옳은 설명이에요." } }], { ok: "서로 평행한 면은 3쌍이고 모두 밑면이 될 수 있으므로 ㉡이 잘못되었어요." }),
      { title: "색칠한 면 ㄱㄴㅂㅁ과 평행한 면을 찾고, 그 면의 모서리 길이의 합을 구해 보세요.", run: (bx, ax) => cb5Chain(bx, ax, [
        (by, ay) => { const S = cb5Solid({ dims: [7, 5, 11], yaw: 62, pitch: 22, lab: true, fill: f => f === 2 ? CB5.par : null, dimLab: [[6, 2, "11 cm"], [2, 0, "5 cm"], [0, 1, "7 cm"]] }); by.append(S.svg, S.tools);
          cb5FaceAsk(by, ay, [{ q: "⑴ 색칠한 면과 평행한 면", ans: [3] }], { ok: "색칠한 면 ㄱㄴㅂㅁ과 평행한 면은 면 ㄷㅅㅇㄹ이에요." }); },
        (by, ay) => cb5Ask(by, ay, [{ q: "⑵ 면 ㄷㅅㅇㄹ의 모서리 길이의 합", parts: ["(11 + 5) × 2 = ", { n: 32, why: { "16": "네 모서리를 모두 더해요. 11 cm와 5 cm인 모서리가 2개씩 있어요.", "46": "면 ㄷㅅㅇㄹ의 모서리는 11 cm와 5 cm예요. 7 cm는 이 면의 모서리가 아니에요." } }, " (cm)"] }],
          { ok: "면 ㄷㅅㅇㄹ은 색칠한 면과 모양과 크기가 같아서 모서리 길이의 합은 (11+5)×2=32 (cm)예요." })]) },
      { title: "색칠한 두 면(면 ㄴㅂㅅㄷ, 면 ㄷㅅㅇㄹ)과 동시에 수직인 면을 모두 눌러 보세요.", run: (bx, ax) => cb5FacePick(bx, ax, { dims: [4, 2.5, 3], base: [0, 3], baseText: "색칠한 면", need: [4, 5],
        whyExtra: f => f === 1 ? "면 ㄱㅁㅇㄹ은 면 ㄷㅅㅇㄹ과는 수직이지만 면 ㄴㅂㅅㄷ과는 평행해요." : "면 ㄱㄴㅂㅁ은 면 ㄴㅂㅅㄷ과는 수직이지만 면 ㄷㅅㅇㄹ과는 평행해요.",
        ok: "두 면에 동시에 수직인 면은 면 ㄱㄴㄷㄹ과 면 ㅁㅂㅅㅇ이에요." }) }]) }
},
{
  id: "t5", no: 5, title: "정육면체의 전개도를 알아볼까요", soop: "개념 구축하기(O)",
  question: "정육면체의 모서리를 잘라서 펼치면 어떤 모양이 될까요?",
  summary: "정육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 정육면체의 전개도라고 해요. 전개도에서 잘린 모서리는 실선으로, 잘리지 않은 모서리는 점선으로 나타내요. 정육면체의 전개도는 정사각형 6개로 이루어져 있고, 접었을 때 겹치는 면이 없어야 해요. 한 정육면체도 여러 가지 모양으로 펼칠 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "로봇이 정육면체 모양의 상자를 펼치고 있어요. ‘펼치기’를 누르거나 막대를 끌어 상자를 끝까지 펼쳐 보세요.", hints: ["막대를 ‘펼침’ 쪽 끝까지 끌어요.", "그림을 끌면 보는 방향을 바꿀 수 있어요."],
      render: (b, a) => cb5FoldStep(b, a, { F: CB5_CUBE_NET, start: 1, goal: 0, msg: "정육면체 상자를 끝까지 펼쳤어요.",
        ask: [{ parts: ["펼친 모양은 정사각형 ", { n: 6 }, "개로 이루어져 있어요. 펼친 그림에는 잘린 모서리와 ", { o: ["잘리지 않은 모서리", "보이지 않는 모서리"], a: 0 }, "가 있어요."] }],
        ok: "정육면체를 펼치면 정사각형 6개가 이어진 모양이 돼요. 잘린 모서리와 잘리지 않은 모서리가 있어요." }) },
    { name: "약속하기", inst: "정육면체의 전개도를 약속해 보세요.", hints: ["모서리를 잘라서 평면 위에 펼쳐 놓은 그림이에요.", "접는 선은 잘리지 않은 모서리예요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => { bx.append(cb5NetSvg(CB5_CUBE_NET, { k: 40, maxW: "17em" }).svg); blanks(bx, ax, ["정육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 정육면체의 ", { o: ["전개도", "겨냥도", "설계도"], a: 0 }, "라고 해요. 전개도에서 잘린 모서리는 ", { o: ["실선", "점선"], a: 0 }, "으로, 잘리지 않은 모서리는 ", { o: ["실선", "점선"], a: 1 }, "으로 나타내요."],
          { ok: "모서리를 잘라서 평면 위에 펼쳐 놓은 그림이 전개도예요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선이에요." }); }]) },
    { name: "찾아보기", inst: "정육면체의 전개도가 될 수 있는 것을 모두 골라 보세요. 먼저 머릿속으로 접어 보고, ‘접어 보기’를 눌러 확인해요.", hints: ["접었을 때 겹치는 면이 있으면 전개도가 될 수 없어요.", "같은 쪽에 붙은 두 면이 접었을 때 같은 자리로 가는지 살펴봐요."],
      render: (b, a) => cb5NetJudge(b, a, { nets: CB5_L5A2, want: "can", k: 22,
        ask: [{ q: "정육면체의 전개도가 될 수 없는 것과 그 까닭을 골라 보세요.", parts: [{ o: ["가", "나", "다", "라"], a: 2 }, " ― ", { o: ["접었을 때 겹치는 두 면이 있어요.", "면이 6개보다 적어요.", "정사각형이 아닌 면이 있어요."], a: 0 }] }],
        ok: "가, 나, 라는 정육면체의 전개도이고, 다는 접었을 때 겹치는 두 면이 있어서 전개도가 될 수 없어요." }) },
    { name: "겹치는 부분", inst: "전개도를 접어서 정육면체를 만들었을 때 겹치는 점과 선분을 찾아보세요. 빨간 점(선분)과 겹치는 것을 눌러요.", hints: ["점선(접는 선)을 따라 이웃한 면을 접어 올린다고 생각해요.", "‘접어서 확인하기’를 누르면 이름이 붙은 채로 접혀요."],
      render: (b, a) => cb5NetPts(b, a, { F: CB5_L5A3.F, P: CB5_L5A3.P, k: 52, maxW: "24em", tasks: [{ pt: "ㅌ" }, { pt: "ㅈ" }, { seg: "ㄴㄷ" }, { seg: "ㅇㅅ" }],
        ok: "점 ㅌ은 점 ㅎ, 점 ㅈ은 점 ㄱ·점 ㅋ과 겹치고, 선분 ㄴㄷ은 선분 ㄹㄷ, 선분 ㅇㅅ은 선분 ㄹㅁ과 겹쳐요." }) },
    { name: "그려 보기", inst: "한 모서리가 3 cm인 정육면체의 전개도를 모눈종이에 그려 보세요. 점에서 대각선 쪽 점까지 끌면 면이 생겨요. (모눈 한 칸은 1 cm)", hints: ["면 6개를 겹치는 면 없이 그려요. 정사각형의 한 변은 3칸이에요.", "다 그리면 두 면이 맞닿은 선(접는 선)을 눌러 점선으로 바꿔요."],
      render: (b, a) => { let first = null; cb5Chain(b, a, [
        { title: "① 일부 그려진 전개도를 완성해 보세요.", run: (bx, ax) => { bx.append(h("div", { class: "cb5row" }, h("div", { style: "flex:0 1 9em" }, cb5Cub({ W: 3, H: 3, D: 3, k: 26, maxW: "8em", dims: [[0, 1, "3 cm"], [1, 3, "3 cm"], [3, 7, "3 cm"]] }))));
          cb5NetDraw(bx, ax, { cols: 15, rows: 11, k: 24, dims: [3, 3, 3], cube: true, given: [{ x: 1, y: 4, w: 3, h: 3 }, { x: 4, y: 4, w: 3, h: 3 }, { x: 7, y: 4, w: 3, h: 3 }], onNet: (F, key) => { first = key; }, msg: "정육면체의 전개도를 완성했어요." }); } },
        { title: "② 이번에는 ①과 다른 모양으로 그려 보세요.", run: (bx, ax) => cb5NetDraw(bx, ax, { cols: 15, rows: 11, k: 24, dims: [3, 3, 3], cube: true, avoid: () => first, lines: false, msg: "다른 모양의 전개도도 그렸어요.",
          ask: [{ q: "그린 전개도가 옳은지 확인할 것을 모두 골라 보세요.", parts: [{ o: ["면이 6개예요.", "모든 모서리의 길이가 같아요.", "접었을 때 겹치는 면이 없어요.", "면의 크기가 모두 달라요."], multi: true, a: [0, 1, 2] }] }],
          ok: "면이 6개이고, 모든 모서리의 길이가 같고, 접었을 때 겹치는 면이 없으면 정육면체의 전개도예요." }) }]); } }
  ],
  challenge: { inst: "수학익힘 문제예요. 정육면체의 전개도를 살펴보세요.", hints: ["점선을 따라 이웃한 면을 접어 올린다고 생각해요.", "면 하나를 붙였을 때 겹치는 면이 생기는지 살펴봐요."],
    render: (b, a) => cb5Chain(b, a, [
      { title: "① 전개도를 접어 정육면체를 만들었을 때 겹치는 점과 선분을 찾아보세요.", run: (bx, ax) => cb5NetPts(bx, ax, { F: CB5_L5U1.F, P: CB5_L5U1.P, k: 48, maxW: "22em", tasks: [{ pt: "ㄱ" }, { seg: "ㅇㅈ" }], ok: "점 ㄱ은 점 ㅋ과, 선분 ㅇㅈ은 선분 ㅂㅁ과 겹쳐요." }) },
      { title: "② 정사각형 1개를 더 붙여 정육면체의 전개도를 만들려고 해요. 붙일 수 있는 자리를 골라 보세요.", run: (bx, ax) => cb5AddFace(bx, ax, { F: CB5_SQ([[0, 1], [1, 1], [2, 1], [3, 1], [1, 0]]),
        cands: [[0, 0, "㉠"], [2, 0, "㉡"], [4, 1, "㉢"], [3, 0, "㉣"], [2, 2, "㉤"]].map(([x, y, name]) => ({ x, y, w: 1, h: 1, name })), k: 46, maxW: "20em", msg: "㉤ 자리에 붙이면 접었을 때 겹치는 면이 없어요." }) }]) }
},
{
  id: "t6", no: 6, title: "직육면체의 전개도를 알아볼까요", soop: "개념 구축하기(O)",
  question: "직육면체의 모서리를 잘라서 펼치면 어떤 모양이 되고, 전개도는 어떻게 그릴까요?",
  summary: "직육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 직육면체의 전개도라고 해요. 직육면체의 전개도는 직사각형 6개로 이루어져 있어요. 접었을 때 마주 보는 두 면은 모양과 크기가 같고, 겹치는 모서리의 길이가 같아야 해요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선으로 그려요.",
  steps: [
    { name: "만져 보기", inst: "연서는 기념품으로 받은 직육면체 모양의 선물 상자(가로 4 cm, 세로 2 cm, 높이 3 cm)를 펼치고 있어요. 상자를 끝까지 펼쳐 보세요.", hints: ["막대를 ‘펼침’ 쪽 끝까지 끌어요.", "펼친 모양에서 크기가 같은 직사각형을 찾아봐요."],
      render: (b, a) => cb5FoldStep(b, a, { F: CB5_GIFT, start: 1, goal: 0, msg: "선물 상자를 끝까지 펼쳤어요.",
        ask: [{ parts: ["펼친 모양은 ", { o: ["직사각형", "정사각형", "삼각형"], a: 0 }, " ", { n: 6 }, "개로 이루어져 있어요. 모양과 크기가 같은 직사각형이 ", { n: 2 }, "개씩 ", { n: 3 }, "쌍 있어요."] }],
        ok: "직육면체를 펼치면 직사각형 6개가 이어진 모양이 되고, 모양과 크기가 같은 직사각형이 2개씩 3쌍 있어요." }) },
    { name: "약속하기", inst: "직육면체의 전개도를 약속하고, 전개도에서 접었을 때 마주 보는 면을 찾아보세요.", hints: ["마주 보는 면은 접었을 때 서로 만나지 않는 면이에요.", "가로로 이어진 4개의 면에서는 한 면 건너 있는 면이 마주 보는 면이에요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["직육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 직육면체의 ", { o: ["전개도", "겨냥도"], a: 0 }, "라고 해요."], { ok: "직육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림이 직육면체의 전개도예요." }),
        { title: "전개도에서 접었을 때 마주 보는 면을 두 개씩 눌러 3쌍을 찾아보세요.", run: (bx, ax) => cb5NetPairs(bx, ax, { F: CB5_GIFT, k: 30, maxW: "24em",
          ask: [{ parts: ["직육면체의 전개도를 접었을 때 마주 보는 두 면은 모양과 크기가 ", { o: ["같아요", "달라요"], a: 0 }, "."] }], ok: "마주 보는 두 면은 모양과 크기가 같아요." }) }]) },
    { name: "찾아보기", inst: "직육면체의 전개도가 될 수 있는 것을 모두 골라 보세요. 모눈 한 칸은 1 cm예요.", hints: ["접었을 때 맞닿는 모서리의 길이가 같은지 살펴봐요.", "마주 보는 면의 모양과 크기가 같은지 살펴봐요."],
      render: (b, a) => cb5NetJudge(b, a, { nets: CB5_L6A2, want: "can", k: 16, grid: true, solid: "직육면체", cardW: "12em",
        ask: [{ q: "직육면체의 전개도가 될 수 없는 것과 그 까닭을 골라 보세요.", parts: [{ o: ["가", "나", "다", "라"], a: 0 }, " ― ", { o: ["접었을 때 겹치지 않는(맞닿는 길이가 다른) 모서리가 있어요.", "면이 7개예요.", "정사각형이 있어요."], a: 0 }] }],
        ok: "나, 다, 라는 직육면체의 전개도예요. 가는 접었을 때 맞닿는 모서리의 길이가 달라서 전개도가 될 수 없어요." }) },
    { name: "겹치는 부분", inst: "전개도를 접어서 직육면체를 만들었을 때 겹치는 점과 선분을 찾아보세요.", hints: ["점선을 따라 접어 올린다고 생각해요.", "‘접어서 확인하기’를 누르면 이름이 붙은 채로 접혀요."],
      render: (b, a) => cb5NetPts(b, a, { F: CB5_L6A3.F, P: CB5_L6A3.P, k: 34, maxW: "28em", tasks: [{ pt: "ㅌ" }, { pt: "ㅇ" }, { seg: "ㅈㅊ" }, { seg: "ㄴㄷ" }],
        ok: "점 ㅌ은 점 ㅊ, 점 ㅇ은 점 ㄴ·점 ㄹ과 겹치고, 선분 ㅈㅊ은 선분 ㅍㅌ, 선분 ㄴㄷ은 선분 ㄹㄷ과 겹쳐요." }) },
    { name: "그려 보기", inst: "가로 4 cm, 세로 2 cm, 높이 3 cm인 직육면체의 전개도를 완성해 보세요. 점에서 대각선 쪽 점까지 끌면 면이 생겨요. (모눈 한 칸은 1 cm)", hints: ["4 cm × 3 cm, 2 cm × 3 cm, 4 cm × 2 cm인 면이 2개씩 있어요.", "접었을 때 겹치는 모서리의 길이가 같은지 확인해요. 다 그리면 접는 선을 눌러 점선으로 바꿔요."],
      render: (b, a) => { b.append(cb5Cub({ W: 4, H: 3, D: 2, k: 26, maxW: "11em", dims: [[0, 1, "4 cm"], [1, 3, "3 cm"], [3, 7, "2 cm"]] }));
        cb5NetDraw(b, a, { cols: 16, rows: 11, k: 24, dims: [4, 3, 2], given: [{ x: 2, y: 3, w: 4, h: 3 }, { x: 6, y: 3, w: 2, h: 3 }, { x: 2, y: 1, w: 4, h: 2 }],
          msg: "직육면체의 전개도를 완성했어요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선이에요." }); } }
  ],
  challenge: { inst: "수학익힘 문제예요. 직육면체의 전개도를 살펴보세요.", hints: ["마주 보는 면은 모양과 크기가 같아요.", "접었을 때 맞닿는 선분의 길이는 같아요."],
    render: (b, a) => cb5Chain(b, a, [
      { title: "① 전개도를 접어 직육면체를 만들었을 때 겹치는 점과 선분을 찾아보세요.", run: (bx, ax) => cb5NetPts(bx, ax, { F: CB5_L6U1.F, P: CB5_L6U1.P, k: 26, maxW: "24em", tasks: [{ pt: "ㄱ" }, { seg: "ㄴㄷ" }], ok: "점 ㄱ은 점 ㅋ·점 ㅈ과, 선분 ㄴㄷ은 선분 ㅇㅅ과 겹쳐요." }) },
      { title: "② 직육면체의 겨냥도를 보고 전개도의 ㉠, ㉡, ㉢에 알맞은 수를 써 보세요.", run: (bx, ax) => {
        const F = cb5NetFromCells(CB5_CROSS, { 1: 4, 2: 7, 4: 9 });   // 가로 4·9·4·9, 높이 7, 위아래 9 × 4
        cb5Ask(bx, ax, [{ fig: () => h("div", { class: "cb5row" }, h("div", { style: "flex:0 1 12em" }, cb5Cub({ W: 9, H: 7, D: 4, k: 14, pad: 56, dimD: 32, dimSize: 19, maxW: "12em", dims: [[0, 1, "9 cm"], [0, 2, "7 cm"], [3, 7, "4 cm"]] })),
            h("div", {}, cb5NetSvg(F, { k: 12, maxW: "24em", extra: (s, m) => { const L = (p, q, t, dx, dy) => { const A = m(p), B = m(q); s.append(txt((A[0] + B[0]) / 2 + dx, (A[1] + B[1]) / 2 + dy, t, 15, { fill: CB5.red })); };
              L([0, 4], [4, 4], "㉠", 0, -11); L([4, 0], [13, 0], "㉡", 0, -11); L([26, 4], [26, 11], "㉢", 14, 0); } }).svg)),
          parts: ["㉠ ", { n: 4 }, " cm, ㉡ ", { n: 9 }, " cm, ㉢ ", { n: 7 }, " cm"] }], { ok: "㉠ 4 cm, ㉡ 9 cm, ㉢ 7 cm예요. 접었을 때 맞닿는 선분의 길이를 겨냥도의 모서리와 비교했어요." }); } },
      { title: "③ 직육면체의 전개도를 보고 ㉠, ㉡, ㉢에 알맞은 수를 써 보세요.", run: (bx, ax) => {
        const F = cb5NetFromCells(CB5_CROSS, { 1: 5, 2: 8, 4: 11 });  // 가로 5·11·5·11, 높이 8, 위아래 11 × 5
        cb5Ask(bx, ax, [{ fig: () => cb5NetSvg(F, { k: 9, pad: 44, maxW: "26em", extra: (s, m) => { const L = (p, q, t, dx, dy, c) => { const A = m(p), B = m(q); s.append(txt((A[0] + B[0]) / 2 + dx, (A[1] + B[1]) / 2 + dy, t, 14, { fill: c || CB5.red })); };
            L([32, 5], [32, 13], "8 cm", 22, 0, CB5.blue); L([5, 0], [16, 0], "11 cm", 0, -10, CB5.blue); L([16, 5], [21, 5], "5 cm", 0, -10, CB5.blue);
            L([0, 5], [0, 13], "㉠", -12, 0); L([5, 13], [5, 18], "㉡", -12, 0); L([21, 5], [32, 5], "㉢", 0, -10); } }).svg,
          parts: ["㉠ ", { n: 8 }, " cm, ㉡ ", { n: 5 }, " cm, ㉢ ", { n: 11 }, " cm"] }], { ok: "㉠ 8 cm, ㉡ 5 cm, ㉢ 11 cm예요." }); } },
      { title: "④ 직육면체의 전개도가 될 수 있는 것을 골라 보세요.", run: (bx, ax) => cb5NetJudge(bx, ax, { k: 16, grid: true, solid: "직육면체", cardW: "12em", nets: [
          { name: "첫째", F: [{ x: 0, y: 1, w: 1, h: 2 }, { x: 1, y: 1, w: 3, h: 2 }, { x: 4, y: 1, w: 1, h: 2 }, { x: 5, y: 1, w: 3, h: 2 }, { x: 1, y: 0, w: 2, h: 1 }, { x: 1, y: 3, w: 3, h: 1 }] },
          { name: "둘째", F: cb5NetFromCells(CB5_CROSS, { 1: 1, 2: 2, 4: 3 }) }], ok: "둘째만 직육면체의 전개도예요. 첫째는 접었을 때 맞닿는 모서리의 길이가 달라요." }) }]) }
},
{
  id: "t7", no: 7, title: "생각을 더하다 ― 직육면체로 장난감을 만들어요", soop: "탐구 정리하기(O)",
  question: "직육면체의 전개도를 이용해 장난감을 만들려면 어떻게 해야 할까요?",
  summary: "장난감의 각 부분(머리·몸통·팔·다리)은 정육면체나 직육면체 모양이에요. 전개도를 완성할 때는 면이 6개인지, 접었을 때 겹치는 면이 없는지, 겹치는 선분의 길이가 같은지 확인해요. 색칠한 면에서 잘리지 않는 모서리는 점선으로 나타내요.",
  steps: [
    { name: "살펴보기", inst: "직육면체를 이용하여 로봇 모양의 장난감을 만들려고 해요. 장난감 설계도를 보고 각 부분의 모양을 알아보세요.", hints: ["정사각형 6개로 둘러싸인 부분은 정육면체예요.", "직사각형 6개로 둘러싸인 부분은 직육면체예요."],
      render: (b, a) => cb5Ask(b, a, [{ fig: cb5ToyFig, parts: ["머리: ", { o: ["정육면체", "직육면체"], a: 0 }, "  몸통: ", { o: ["정육면체", "직육면체"], a: 1 }, h("br"), "팔: ", { o: ["정육면체", "직육면체"], a: 1 }, "  다리: ", { o: ["정육면체", "직육면체"], a: 0 }] }],
        { ok: "머리와 다리는 정육면체, 몸통과 팔은 직육면체 모양이에요." }) },
    { name: "생각하기", inst: "각 부분의 전개도를 그릴 때 생각할 점을 이야기해 보세요.", hints: ["정육면체와 직육면체의 면은 몇 개인지 떠올려요.", "접었을 때 맞닿는 선분을 생각해요."],
      render: (b, a) => cb5Ask(b, a, [{ q: "전개도를 그릴 때 생각할 점을 모두 골라 보세요.", parts: [{ o: ["면을 6개 그려요.", "접었을 때 겹치는 면이 없도록 그려요.", "접었을 때 겹치는 선분의 길이가 같도록 그려요.", "모든 면을 서로 다른 크기로 그려요."], multi: true, a: [0, 1, 2] }] }],
        { ok: "면 6개, 겹치는 면이 없도록, 겹치는 선분의 길이가 같도록 그려요." }) },
    { name: "완성하기 ①", inst: "준비물의 머리와 몸통 전개도에는 면이 5개만 있어요. 전개도가 되도록 면 1개를 더 찾아 색칠하고, 색칠한 면의 잘리지 않는 모서리를 점선으로 바꿔 보세요.", hints: ["후보 자리를 하나씩 머릿속으로 접어 봐요.", "색칠한 면에서 다른 면과 맞닿은 모서리가 잘리지 않는 모서리예요."],
      render: (b, a) => cb5Chain(b, a, [
        { title: "머리(한 모서리 2 cm인 정육면체)", run: (bx, ax) => cb5AddFace(bx, ax, Object.assign({ k: 28, grid: true, dash: true, maxW: "20em", color: "#FFD27A", msg: "머리의 전개도를 완성했어요." }, CB5_PARTS.head)) },
        { title: "몸통(가로 3 cm, 세로 2 cm, 높이 4 cm인 직육면체)", run: (bx, ax) => cb5AddFace(bx, ax, Object.assign({ k: 24, grid: true, dash: true, maxW: "20em", color: "#9CC3F0", msg: "몸통의 전개도를 완성했어요." }, CB5_PARTS.body)) }]) },
    { name: "완성하기 ②", inst: "팔과 다리의 전개도도 면 1개를 더 찾아 색칠하고, 색칠한 면의 잘리지 않는 모서리를 점선으로 바꿔 보세요.", hints: ["면 6개가 모두 있고 겹치는 면이 없어야 해요.", "점선을 따라 접어 확인해 봐요."],
      render: (b, a) => cb5Chain(b, a, [
        { title: "팔(가로 1 cm, 세로 1 cm, 높이 3 cm인 직육면체)", run: (bx, ax) => cb5AddFace(bx, ax, Object.assign({ k: 34, grid: true, dash: true, maxW: "16em", color: "#A9DDB8", msg: "팔의 전개도를 완성했어요." }, CB5_PARTS.arm)) },
        { title: "다리(한 모서리 1 cm인 정육면체)", run: (bx, ax) => cb5AddFace(bx, ax, Object.assign({ k: 40, grid: true, dash: true, maxW: "16em", color: "#F6B38E", msg: "다리의 전개도를 완성했어요." }, CB5_PARTS.leg)) }]) },
    { name: "만들기", inst: "완성한 부분을 끌어서 설계도의 알맞은 자리에 붙여 장난감을 완성해 보세요.", hints: ["설계도의 점선 자리와 크기가 같은 부분을 찾아요.", "팔과 다리는 2개씩 있어요."],
      render: (b, a) => cb5Robot(b, a, { cols: 16, rows: 10, k: 26, planX: 4,
        items: [Object.assign({ tx: 9, ty: 1 }, CB5_TOY.head), Object.assign({ tx: 12, ty: 1.3 }, CB5_TOY.body), Object.assign({ tx: 9, ty: 4.5 }, CB5_TOY.arm), Object.assign({ tx: 10.6, ty: 4.5 }, CB5_TOY.arm),
          Object.assign({ tx: 12.6, ty: 7.5 }, CB5_TOY.leg), Object.assign({ tx: 14.2, ty: 7.5 }, CB5_TOY.leg)],
        slots: CB5_TOY_SLOTS,
        then: (bx, ax) => writeStep(bx, ax, [{ q: "장난감을 만든 과정을 친구에게 설명하듯 써 보세요.", tag: "만든 과정", ph: "예) 면 6개가 겹치지 않도록 전개도를 완성하고, 점선을 따라 접어 각 부분을 만든 다음 설계도대로 붙였어요." }], { ok: "전개도로 장난감을 완성하고 과정을 설명했어요." }) }) }
  ],
  challenge: { inst: "팔(가로 1 cm, 세로 1 cm, 높이 3 cm인 직육면체)을 하나 더 만들려고 해요. 팔의 전개도가 될 수 있는 것을 모두 골라 보세요.", hints: ["1 cm × 3 cm인 면 4개와 1 cm × 1 cm인 면 2개가 있어야 해요.", "‘접어 보기’로 확인할 수 있어요."],
    render: (b, a) => cb5NetJudge(b, a, { k: 20, grid: true, solid: "직육면체", cardW: "10em", nets: [
      { name: "가", F: cb5NetFromCells(CB5_CROSS, { 1: 1, 2: 3, 4: 1 }) },
      { name: "나", F: [{ x: 0, y: 1, w: 1, h: 3 }, { x: 1, y: 1, w: 1, h: 3 }, { x: 2, y: 1, w: 1, h: 3 }, { x: 3, y: 1, w: 1, h: 3 }, { x: 1, y: 0, w: 1, h: 1 }, { x: 3, y: 0, w: 1, h: 1 }] },
      { name: "다", F: cb5NetFromCells([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], { 1: 1, 2: 1, 4: 3 }) },
      { name: "라", F: [{ x: 0, y: 1, w: 1, h: 3 }, { x: 1, y: 1, w: 1, h: 3 }, { x: 2, y: 1, w: 1, h: 3 }, { x: 3, y: 1, w: 1, h: 3 }, { x: 1, y: 0, w: 1, h: 1 }, { x: 1, y: 4, w: 1, h: 3 }] }],
      ok: "가와 다는 팔의 전개도예요. 나는 접었을 때 두 면이 겹치고, 라는 맞닿는 모서리의 길이가 달라요." }) }
},
{
  id: "t8", no: 8, title: "놀이를 더하다 ― 같은 도형 카드를 모아요", soop: "발표하기(P)",
  question: "같은 도형의 겨냥도와 전개도 카드를 어떻게 하면 빨리 모을 수 있을까요?",
  summary: "같은 도형 카드는 겨냥도 1장과 전개도 2장이에요. 전개도의 모눈 칸을 세어 면의 가로와 세로를 겨냥도의 모서리 길이와 비교하면 같은 도형을 찾을 수 있어요. 필요 없는 카드를 잘 골라 넘기는 것이 이기는 방법이에요.",
  steps: [
    { name: "놀이 방법", inst: "‘같은 도형 카드를 모아요’ 놀이 방법을 순서대로 눌러 보세요.", hints: ["카드를 먼저 나누어 가져요.", "같은 도형 3장을 모은 사람이 없으면 한 장씩 넘겨요."],
      render: (b, a) => sequence(b, a, ["① 카드를 섞어 한 명당 3장씩 나누어 가져요.", "② 각자 가진 카드 3장이 같은 도형을 나타내는지 확인해요.", "③ 모은 사람이 없으면 동시에 ‘넘겨’를 외치며 한 장을 시계 방향의 다음 사람에게 넘겨요.", "④ 같은 도형 카드 3장을 모은 사람은 카드를 보여 줘요. 이것을 10번 되풀이해 옳게 모은 횟수가 가장 많은 사람이 이겨요."], [0, 1, 2, 3],
        { ok: "카드 나누기 → 확인하기 → 넘기기 → 보여 주기 순서로 해요." }) },
    { name: "카드 살펴보기", inst: "놀이 카드 12장을 살펴봐요. 전개도 카드를 하나씩 눌러 같은 도형의 겨냥도 카드에 놓아 보세요. (모눈 한 칸은 1 cm)", hints: ["전개도의 모눈 칸을 세어 면의 가로와 세로를 알아봐요.", "겨냥도의 모서리 길이로 만들 수 있는 면인지 비교해요."],
      render: (b, a) => cb5CardSort(b, a, { ok: "겨냥도 1장과 전개도 2장씩, 같은 도형 카드 3장이 한 묶음이에요." }) },
    { name: "놀이하기", inst: "컴퓨터 친구 3명과 놀이해요. 넘길 카드를 한 장 고르고 ‘넘겨!’를 눌러요. 같은 도형 카드 3장을 모으면 ‘모았어요!’를 눌러요.", hints: ["어느 도형을 모을지 정하고, 그 도형이 아닌 카드를 넘겨요.", "겨냥도 카드가 2장이면 그중 하나는 꼭 넘겨야 해요."],
      render: (b, a) => cb5PassGame(b, a, {}) },
    { name: "또 다른 놀이", inst: "전개도 카드 8장을 뒤집어 놓았어요. 두 장씩 펼쳐서 같은 도형의 전개도이면 가져가요. 짝을 모두 찾아보세요.", hints: ["펼쳤던 카드의 자리와 모양을 기억해요.", "면의 크기를 비교하면 같은 도형인지 알 수 있어요."],
      render: (b, a) => cb5Memory(b, a, {}) },
    { name: "돌아보기", inst: "놀이를 돌아보며 생각을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 이기려면 어떻게 하면 좋을까요?", tag: "이기는 방법", ph: "예) 모을 도형을 정하고 필요 없는 카드를 넘겨요. 전개도의 칸을 세어 면의 크기를 겨냥도와 비교해요." },
        { q: "같은 도형의 전개도인지 어떻게 알 수 있었나요?", tag: "알아본 방법", ph: "예) 마주 보는 면의 크기가 같은지, 면의 가로·세로가 겨냥도의 모서리 길이와 같은지 보았어요." }]) }
  ],
  challenge: { inst: "도형 나(가로 3 cm, 세로 1 cm, 높이 2 cm인 직육면체)의 전개도 카드를 모두 골라 보세요.", hints: ["3 cm × 2 cm, 3 cm × 1 cm, 2 cm × 1 cm인 면이 2개씩 있어야 해요.", "모눈 칸을 세어 봐요."],
    render: (b, a) => { const D = cb5Deck(), nets = D.filter(c => c.kind === "net"), pick = [nets[0], nets[2], nets[3], nets[5], nets[6]];
      cb5Pick(b, a, { cardW: "8.5em", items: pick.map((c, i) => ({ name: "①②③④⑤"[i], fig: () => cb5CardFig(c) })), a: pick.map((c, i) => c.shape === 1 ? i : -1).filter(i => i >= 0),
        whyExtra: () => "고른 카드 중에 다른 도형의 전개도가 있어요. 면의 크기를 세어 봐요.", ok: "가로 3 cm, 세로 1 cm, 높이 2 cm인 직육면체의 전개도를 모두 찾았어요." }); } }
},
{
  id: "t9", no: 9, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "직육면체와 정육면체, 겨냥도와 전개도에 대해 무엇을 알게 되었나요?",
  summary: "직사각형 6개로 둘러싸인 도형은 직육면체, 정사각형 6개로 둘러싸인 도형은 정육면체예요. 직육면체에서 서로 평행한 면은 3쌍이고, 밑면과 옆면은 수직으로 만나요. 겨냥도에서는 보이는 모서리를 실선, 보이지 않는 모서리를 점선으로 그리고, 전개도에서는 잘린 모서리를 실선, 잘리지 않은 모서리를 점선으로 그려요.",
  steps: [
    { name: "1·2번", inst: "도형의 이름과 각 부분의 이름을 알아보세요.", hints: ["직사각형 6개 → 직육면체, 정사각형 6개 → 정육면체", "면, 모서리, 꼭짓점을 떠올려요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["직사각형 6개로 둘러싸인 도형을 ", { o: ["직육면체", "정육면체"], a: 0 }, "라고 하고, 정사각형 6개로 둘러싸인 도형을 ", { o: ["직육면체", "정육면체"], a: 1 }, "라고 해요."], { ok: "직육면체와 정육면체예요." }),
        (bx, ax) => cb5Ask(bx, ax, [{ q: "직육면체에서 ①, ②, ③이 가리키는 곳의 이름을 골라 보세요.", fig: () => cb5PartsFig([{ i: 3, t: "③" }, { t: "①" }, { t: "②" }]),
          parts: ["① ", { o: ["면", "모서리", "꼭짓점"], a: 0 }, "  ② ", { o: ["면", "모서리", "꼭짓점"], a: 1 }, "  ③ ", { o: ["면", "모서리", "꼭짓점"], a: 2 }] }], { ok: "① 면, ② 모서리, ③ 꼭짓점이에요." })]) },
    { name: "3번", inst: "직육면체에서 색칠한 면 ㄱㄴㅂㅁ과 평행한 면, 수직인 면을 찾아보세요.", hints: ["평행한 면은 마주 보는 면이에요.", "수직인 면은 색칠한 면과 만나는 면 4개예요."],
      render: (b, a) => cb5Chain(b, a, [
        { title: "① 색칠한 면과 평행한 면을 눌러 보세요.", run: (bx, ax) => cb5FacePick(bx, ax, { dims: [4, 2.5, 3], yaw: 35, base: 2, need: [3], baseText: "색칠한 면", whyExtra: f => `${cb5FaceName(f)}은 색칠한 면과 만나는(수직인) 면이에요. 평행한 면은 마주 보는 면이에요.`, ok: "색칠한 면과 평행한 면은 면 ㄷㅅㅇㄹ이에요." }) },
        { title: "② 색칠한 면과 수직인 면을 모두 써 보세요.", run: (bx, ax) => { const S = cb5Solid({ dims: [4, 2.5, 3], yaw: 35, lab: true, fill: f => f === 2 ? CB5.par : null }); bx.append(S.svg, S.tools);
          cb5FaceAsk(bx, ax, [{ q: "색칠한 면 ㄱㄴㅂㅁ과 수직인 면", ans: [5, 0, 4, 1], why: "색칠한 면과 만나는 면 4개를 써요. 마주 보는 면 ㄷㅅㅇㄹ은 평행한 면이에요." }],
            { ok: "수직인 면은 면 ㄱㄴㄷㄹ, 면 ㄴㅂㅅㄷ, 면 ㅁㅂㅅㅇ, 면 ㄱㅁㅇㄹ이에요." }); } }]) },
    { name: "4번", inst: "가로 5 cm, 세로 2 cm, 높이 3 cm인 직육면체의 전개도를 모눈종이에 그려 보세요. (모눈 한 칸은 1 cm)", hints: ["5 cm × 3 cm, 2 cm × 3 cm, 5 cm × 2 cm인 면이 2개씩 있어요.", "다 그리면 접는 선을 눌러 점선으로 바꿔요."],
      render: (b, a) => { b.append(cb5Cub({ W: 5, H: 3, D: 2, k: 24, maxW: "12em", dims: [[0, 1, "5 cm"], [1, 3, "3 cm"], [3, 7, "2 cm"]] }));
        cb5NetDraw(b, a, { cols: 18, rows: 12, k: 22, dims: [5, 3, 2], msg: "직육면체의 전개도를 그렸어요. 면 6개, 겹치는 면 없음, 맞닿는 모서리 길이가 같음, 실선·점선 구분까지 확인했어요." }); } },
    { name: "5·6번", inst: "직육면체에 대해 옳게 말한 사람을 찾고, 잘못 그린 겨냥도를 고쳐 보세요.", hints: ["한 면과 수직인 면은 4개예요.", "보이지 않는 모서리는 점선이에요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "직육면체에 대해 옳게 말한 사람을 모두 골라 보세요.", o: ["윤호: 한 면과 수직으로 만나는 면은 모두 3개야.", "주아: 한 꼭짓점에서 만나는 면은 모두 3개야.", "은찬: 서로 평행한 면은 모두 3쌍이야."], a: [1, 2],
          why: { "0,1,2": "윤호의 말을 다시 살펴봐요. 한 면과 수직인 면은 4개예요.", "0,2": "윤호의 말을 다시 살펴봐요. 한 면과 수직인 면은 4개예요.", "0,1": "윤호의 말을 다시 살펴봐요. 한 면과 수직인 면은 4개예요." } }], { ok: "주아와 은찬이가 옳게 말했어요. 윤호는 한 면과 수직인 면이 4개라서 틀렸어요." }),
        { title: "잘못 그린 겨냥도예요. 선을 눌러 옳게 고쳐 보세요(누를 때마다 실선 ↔ 점선).", run: (bx, ax) => cb5Sketch(bx, ax, { W: 4, H: 3, dx: 2, dy: 1, cols: 8, rows: 6, ox: 1, oy: 1, mode: "fix",
          ask: [{ q: "잘못 그린 까닭을 골라 보세요.", parts: [{ o: ["보이지 않는 모서리까지 모두 실선으로 그렸어요.", "모서리를 12개보다 많이 그렸어요.", "평행한 모서리를 평행하지 않게 그렸어요."], a: 0 }] }],
          ok: "보이는 모서리는 실선, 보이지 않는 모서리는 점선으로 나타내야 하는데 모든 모서리를 실선으로 그렸어요. 보이지 않는 모서리 3개를 점선으로 고쳤어요." }) }]) },
    { name: "정리하기", inst: "단원에서 배운 내용을 정리해 보세요.", hints: ["직사각형 6개, 정사각형 6개로 둘러싸인 도형을 떠올려요.", "밑면과 옆면이 만나는 모양을 떠올려요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["직사각형 6개로 둘러싸인 도형은 ", { o: ["직육면체", "정육면체"], a: 0 }, ", 정사각형 6개로 둘러싸인 도형은 ", { o: ["직육면체", "정육면체"], a: 1 }, "예요. 직육면체에서 밑면과 옆면은 ", { o: ["수직", "평행"], a: 0 },
          "으로 만나요. 직육면체 모양을 잘 알 수 있도록 나타낸 그림은 ", { o: ["겨냥도", "전개도"], a: 0 }, ", 정육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림은 정육면체의 ", { o: ["겨냥도", "전개도"], a: 1 }, "예요."], { ok: "직육면체, 정육면체, 수직, 겨냥도, 전개도를 정리했어요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "이 단원에서 기억에 남는 내용을 글이나 기호로 정리해 보세요.", tag: "기억에 남는 내용", ph: "예) 직육면체에서 한 면과 수직인 면은 4개, 평행한 면은 1개예요. 전개도는 접었을 때 겹치는 면이 없어야 해요." }])]) }
  ],
  challenge: { inst: "단원 종합 문제예요. 정육면체의 전개도가 될 수 있는 것을 모두 골라 보세요.", hints: ["머릿속으로 접어 보고, ‘접어 보기’로 확인해요.", "접었을 때 겹치는 면이 있으면 전개도가 될 수 없어요."],
    render: (b, a) => cb5NetJudge(b, a, { k: 18, cardW: "9em", nets: [
      { name: "가", F: CB5_SQ([[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2]]) },
      { name: "나", F: CB5_SQ([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]]) },
      { name: "다", F: CB5_SQ([[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [2, 0]]) },
      { name: "라", F: CB5_SQ([[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]]) },
      { name: "마", F: CB5_SQ([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]]) },
      { name: "바", F: CB5_SQ([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]]) }],
      ok: "나, 라, 바는 정육면체의 전개도예요. 가, 다, 마는 접었을 때 겹치는 면이 있어요." }) }
}
];
