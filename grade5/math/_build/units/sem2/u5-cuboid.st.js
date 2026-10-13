//@@APP
const APP={title:"우리 반 선물 상자 공방", unit:"5-2 수학 5. 직육면체", key:"s52-cuboid-v1", welcome:"우리 반 선물 상자 공방에 온 것을 환영해요", intro:"햇살초등학교 5학년 2반이 가을 나눔 장터에서 나누어 줄 선물 상자를 만드는 ‘선물 상자 공방’을 열어요. 재료 상자를 나누며 직육면체와 정육면체를 알아보고, 카탈로그에 실을 겨냥도를 그리고, 상자를 붙이며 평행한 면과 수직인 면을 찾아요. 정육면체와 직육면체의 전개도를 그려 접고, 상자봇을 만들고, 카드 놀이와 발표회로 마무리해요."};
//@@UNIT
/* =========================================================
   5-2 수학 5. 직육면체 — 이야기 버전 단원 조작 부품 (앞글자 cb5, 이야기 전용 cb5s)
   교과서 버전(u5-cuboid.tb.js)의 cb5 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   기다리는 시간: 입력칸 900ms(Enter는 blur) · 보기·카드 고르기 260~600ms · 긋기·색칠·면 그리기·끌기 1200ms(손을 뗀 뒤).
   한 계단에 활동이 둘이면(hj-multi) 부품 함수 몸통에 done( 이 있어야 활동으로 세어져요 — 부품마다 api.done 경로를 적어 둠.
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

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기, 여러 개 고르기 multi) — 저절로 확인 ---------- */
function cb5Ask(body, api, items, opts = {}) {
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
  const filled = s => s.pt.o ? (s.pt.multi ? s.v.size >= s.pt.a.length : s.v != null) : s.inp.value.trim() !== "";
  const check = () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); });
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) { all.forEach(s => { if (s.inp) s.inp.readOnly = true; }); api.done(ans, opts.ok); return true; }
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(cb5Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
    return false;
  };
  const hasIn = all.some(s => !s.pt.o);
  const kick = autoRun(() => all.every(filled), () => all.map(val).join("\u0001") + "|" + all.map(s => s.v instanceof Set ? [...s.v].sort().join(",") : "").join(";"), check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) later(hasIn ? 600 : 260); });
  all.forEach(s => { if (!s.inp) return;
    s.inp.addEventListener("input", e => { s.inp.style.borderColor = ""; if (!e.isComposing) later(900); });
    s.inp.addEventListener("change", () => later(200));
    s.inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); s.inp.blur(); } }); });
  body.append(wrap);
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
  const allIns = rows.flatMap(r => r.ins);
  const check = () => {
    api.tryOnce(); let ok = true, why = "";
    rows.forEach(r => {
      const got = r.ins.map(i => cb5ParseFace(i.value, lab));
      r.ins.forEach((inp, k) => { const g = got[k], good = g >= 0 && r.it.ans.includes(g) && got.indexOf(g) === k; inp.style.borderColor = good ? "var(--ok)" : "var(--no)"; if (!good) { ok = false;
        if (!why) why = g < 0 ? (r.ins[k].value.replace(/면|\s/g, "").length === 4 ? "꼭짓점을 차례로 이어 읽어야 면 이름이 돼요. 점의 차례를 확인해요." : "면 이름은 꼭짓점 4개를 차례로 써요.") : got.indexOf(g) !== k ? "같은 면을 두 번 썼어요." : (r.it.why || "그 면은 답이 아니에요. 그림을 돌려 가며 다시 살펴봐요."); } });
    });
    const ans = rows.map(r => r.ins.map(i => i.value.trim() || "-").join(", ")).join(" / ");
    if (ok) { allIns.forEach(i => { i.readOnly = true; }); api.done(ans, opts.ok); return true; }
    api.fail(why, ans); return false;
  };
  const kick = autoRun(() => allIns.every(i => i.value.replace(/면|\s|,/g, "").length >= 4), () => allIns.map(i => i.value.replace(/면|\s|,/g, "")).join("|"), check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  allIns.forEach(i => { i.addEventListener("input", e => { i.style.borderColor = ""; if (!e.isComposing) later(900); }); i.addEventListener("change", () => later(200));
    i.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); i.blur(); } }); });
  key.addEventListener("click", e => { if (e.target.closest("button")) later(900); });
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
      svg.append(txt(cb5R(mx + dx / L * 20), cb5R(my + dy / L * 20), t, 15, { fill: CB5.blue, "pointer-events": "none" })); });
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
  let kind = kinds[0], fin = false;
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
    if (kinds.every(x => doneK.has(x)) && !fin) { fin = true; cb5Then(body, api, opt, kinds.map(x => `${NM[x]} ${ALL[x]}`).join(", "), opt.msg || "돌려 가며 모두 찾았어요."); }   // → api.done(
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
  let fin = false;
  const check = () => {
    if (fin) return true; api.tryOnce(); const ans = [...sel].map(f => cb5FaceName(f, lab)).join(", ") || "-";
    const ok = sel.size === opt.need.length && opt.need.every(f => sel.has(f));
    if (ok) { fin = true; cb5Then(body, api, opt, ans, opt.msg || opt.ok); return true; }   // 끝나면 api.done(
    const extra = [...sel].find(f => !opt.need.includes(f));
    api.fail(extra != null ? (opt.whyExtra ? opt.whyExtra(extra) : `${cb5FaceName(extra, lab)}은 답이 아니에요.`) : (opt.whyFew || `아직 ${opt.need.length - sel.size}개 더 있어요. 그림을 돌려 뒤쪽도 살펴봐요.`), ans);
    return false;
  };
  const kick = autoRun(() => sel.size >= opt.need.length, () => [...sel].sort().join(","), check, 1200);
  S.svg.addEventListener("pointerup", () => setTimeout(kick, 0));
  body.append(S.svg, S.tools, read);
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
  const check = () => {
    if (fin) return true; api.tryOnce();
    const ans = mode === "pick" ? `○표 ${segs.filter(s => s.mark).length}개` : `실선 ${segs.filter(s => s.style === "solid").length}개, 점선 ${segs.filter(s => s.style === "dash").length}개`;
    if (mode === "pick") {
      const wrong = segs.filter((s, i) => s.mark !== (s.style === "dash")); wrong.forEach(s => { s.bad = true; }); draw();
      if (!wrong.length) { fin = true; cb5Then(body, api, opt, ans, opt.msg || "보이지 않는 모서리 3개를 모두 찾았어요."); return true; }
      api.fail(segs.filter(s => s.mark && s.style !== "dash").length ? "보이는 모서리에 ○표를 했어요. 보이지 않는 모서리는 점선으로 그려져 있어요." : "보이지 않는 모서리가 더 있어요. 점선을 모두 찾아요.", ans); return false;
    }
    const extra = segs.filter(s => !need.some(t => same(s, t)));
    const missing = need.filter(t => !segs.some(s => same(s, t)));
    const styleBad = segs.filter(s => { const t = need.find(t => same(s, t)); return t && t.style !== s.style; });
    segs.forEach(s => { s.bad = extra.includes(s) || styleBad.includes(s); }); draw();
    if (extra.length) { api.fail(`필요 없는 선이 ${extra.length}개 있어요(빨간 선). 꼭짓점에서 꼭짓점까지 한 번에 긋고, 지우개로 지워요.`, ans); return false; }
    if (missing.length) { api.fail(`빠진 모서리가 ${missing.length}개 있어요. 직육면체의 모서리는 모두 12개예요. 평행한 모서리는 평행하게 그어요.`, ans); return false; }
    if (styleBad.length) { const hid = styleBad.filter(s => s.style === "solid").length;
      api.fail(hid ? "보이지 않는 모서리를 실선으로 그렸어요. 보이지 않는 모서리는 점선으로 나타내요." : "보이는 모서리를 점선으로 그렸어요. 보이는 모서리는 실선으로 나타내요.", ans); return false; }
    fin = true; cb5Then(body, api, opt, ans, opt.msg || "겨냥도를 바르게 그렸어요. 보이는 모서리 9개는 실선, 보이지 않는 모서리 3개는 점선이에요.");   // → api.done(
    return true;
  };
  /* 저절로 확인: 그리기는 선이 12개가 되면, 고치기는 점선이 3개 이상이면, 찾기는 ○표가 3개 이상이면(손을 떼고 1.2초 뒤) */
  const ready = () => mode === "pick" ? segs.filter(s => s.mark).length >= 3 : mode === "fix" ? segs.filter(s => s.style === "dash").length >= 3 : segs.length >= 12;
  const kick = autoRun(ready, () => segs.map(s => s.a.join(",") + "-" + s.b.join(",") + s.style + (s.mark ? "o" : "")).sort().join("|"), check, 1200);
  svg.addEventListener("pointerup", () => setTimeout(kick, 0));
  body.append(...(opt.tip ? [h("p", { class: "cb5small" }, opt.tip)] : []), pens, svg, read);
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
function cb5FoldStep(body, api, opt) {   /* 끝나면 cb5Then → api.done( */
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
  let fin = false;
  const check = () => {
    if (fin) return true; api.tryOnce(); const got = [...sel].sort().map(i => opt.nets[i].name).join(", ") || "-";
    cards.forEach((c, i) => { c.classList.remove("cb5-good", "cb5-bad"); if (sel.has(i)) c.classList.add(ans.includes(i) ? "cb5-good" : "cb5-bad"); });
    const wrong = [...sel].find(i => !ans.includes(i)), miss = ans.find(i => !sel.has(i));
    if (wrong == null && miss == null) { fin = true; cb5Then(body, api, opt, got, opt.msg || opt.ok); return true; }   // → api.done(
    if (wrong != null) { api.fail(want === "can" ? `${opt.nets[wrong].name}는 ${CB5_WHY[res[wrong].why]} ‘접어 보기’로 확인해 봐요.` : `${opt.nets[wrong].name}는 접으면 ${opt.solid || "정육면체"}가 돼요.`, got); return false; }
    api.fail(`${opt.nets[miss].name}도 다시 살펴봐요. ‘접어 보기’를 눌러 확인할 수 있어요.`, got); return false;
  };
  const kick = autoRun(() => sel.size >= ans.length, () => [...sel].sort().join(","), check, 700);
  cards.forEach(c => c.addEventListener("click", () => kick()));
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), h("div", { class: "cb5cards", style: "grid-template-columns:repeat(auto-fill,minmax(" + (opt.cardW || "11em") + ",1fr))" }, ...cards), panel);
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
  const foldBtn = h("button", { class: "ghost", onclick: () => { foldBox.innerHTML = ""; const V = cb5FoldView(F, { lab: P, start: 0, size: [440, 300], labColor: n => { const T = tasks[ti]; return T && (T.pt === n || (T.seg && T.seg.includes(n))) ? CB5.red : "#33414D"; } }); foldBox.append(V.el); V.play(1); cb5Go(foldBox); } }, "접어서 살펴보기");
  const check = () => {
    const T = tasks[ti]; if (!T) return true; api.tryOnce();
    const got = [...sel].map(i => T.kind === "pt" ? P[i][2] : S[i].nm);
    const okSet = T.kind === "pt" ? T.ans : T.ans.map(s => s.nm);
    const good = got.length === okSet.length && okSet.every(x => got.includes(x));
    const gotTxt = (T.kind === "pt" ? got.map(n => "점 " + n) : got.map(n => "선분 " + n)).join(", ") || "-";
    if (!good) { api.fail(got.some(x => !okSet.includes(x)) ? (T.kind === "pt" ? "접었을 때 그 점과 만나지 않는 점을 골랐어요. 접히는 모서리를 따라 하나씩 짝지어 봐요." : "접었을 때 맞닿지 않는 선분이에요. 이웃한 선분부터 짝지어 봐요.") : `아직 더 있어요. 겹치는 ${T.kind === "pt" ? "점" : "선분"}을 모두 찾아요.`, gotTxt); return false; }
    log.append(h("div", {}, "✓ " + (T.kind === "pt" ? `점 ${cb5Jo(T.pt, "과/와")} 겹치는 점: ${T.ans.map(n => "점 " + n).join(", ")}` : `선분 ${cb5Jo(T.seg, "과/와")} 겹치는 선분: ${T.ansNm.map(n => "선분 " + n).join(", ")}`)));
    ti++;
    if (ti >= tasks.length) { draw(); cb5Then(body, api, opt, tasks.map(t => t.kind === "pt" ? t.ans.join(",") : t.ansNm.join(",")).join(" / "), opt.msg || opt.ok || "겹치는 점과 선분을 모두 찾았어요."); return true; }   // → api.done(
    api.hint("○ 맞아요! 이어서 찾아봐요."); next(); return false;
  };
  const kick = autoRun(() => !!tasks[ti] && sel.size >= tasks[ti].ans.length, () => ti + ":" + [...sel].sort().join(","), check, 700);
  wrap.addEventListener("click", () => kick());
  body.append(qline, wrap, log, h("div", { class: "cb5btns" }, foldBtn), foldBox);
  next();
}
/* 전개도에서 마주 보는 면 짝 찾기(접었을 때 서로 평행한 면) */
function cb5NetPairs(body, api, opt) {   /* 끝나면 cb5Then → api.done( */
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
  const check = () => {
    if (fin) return true; api.tryOnce();
    if (phase === "net") {
      const F = faces.map(r => ({ x: r.x, y: r.y, w: r.w, h: r.h })), ans = `면 ${F.length}개`;
      if (F.length < 6) { api.fail(`면이 ${F.length}개예요. ${opt.cube ? "정육면체" : "직육면체"}의 면은 6개예요.`, ans); return false; }
      const fd = cb5Fold(F);
      if (!fd.ok) { api.fail(CB5_WHY[fd.why] + " 면을 눌러 지우고 다시 그려 봐요.", ans); return false; }
      const Ls = Object.values(fd.L).sort((u, v) => u - v), Ds = [a, b, c].sort((u, v) => u - v);
      if (Ls.some((x, i) => !cb5Eq(x, Ds[i]))) { api.fail("접으면 겨냥도와 다른 크기의 직육면체가 돼요. 마주 보는 면은 모양과 크기가 같아야 해요.", ans); return false; }
      const key = cb5RectKey(F);
      if (opt.avoid && opt.avoid() === key) { api.fail("앞에서 그린 전개도와 같은 모양이에요(돌리거나 뒤집으면 같아요). 다른 모양으로 그려 봐요.", ans); return false; }
      opt.onNet && opt.onNet(F, key);
      if (opt.lines === false) { fin = true; cb5Then(body, api, opt, "전개도 완성", opt.msg); return true; }   // → api.done(
      startLines(F);
      api.hint("○ 접으면 " + (opt.cube ? "정육면체" : "직육면체") + "가 돼요! 이제 잘리지 않은 모서리(접는 선)를 눌러 점선으로 바꿔요.");
      return false;
    }
    const bad = segs.filter(s => s.dash !== s.hinge); segs.forEach(s => { s.bad = bad.includes(s); }); draw();
    const ans = `점선 ${segs.filter(s => s.dash).length}개`;
    if (bad.length) { api.fail(bad.some(s => s.dash) ? "잘린 모서리(둘레)를 점선으로 바꿨어요. 잘린 모서리는 실선이에요." : "아직 실선인 접는 선이 있어요. 두 면이 맞닿은 선은 잘리지 않은 모서리라서 점선으로 나타내요.", ans); return false; }
    fin = true; cb5Then(body, api, opt, "전개도 완성(점선 " + segs.filter(s => s.dash).length + "개)", opt.msg || "전개도를 바르게 그렸어요."); return true;
  };
  /* 저절로 확인: 면 6개를 그리면 / 접는 선(5개)만큼 점선으로 바꾸면 (손을 떼고 1.2초 뒤) */
  const kick = autoRun(() => phase === "net" ? faces.length >= 6 : segs.filter(s => s.dash).length >= 5,
    () => phase + "|" + (phase === "net" ? faces.map(r => [r.x, r.y, r.w, r.h].join(",")).sort().join(";") : segs.map(s => s.dash ? 1 : 0).join("")), check, 1200);
  svg.addEventListener("pointerup", () => setTimeout(kick, 0));
  body.append(...(opt.tip ? [h("p", { class: "cb5small" }, opt.tip)] : []), svg, read,
    h("div", { class: "cb5btns" }, h("button", { onclick: () => { if (fin) return; if (phase === "lines") { phase = "net"; segs = []; } faces.splice(0, faces.length, ...faces.filter(r => r.locked)); draw(); } }, "처음부터"),
      h("span", { class: "cb5small" }, "그린 면을 누르면 지워져요.")));
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
  const check = () => {
    if (fin) return true;
    if (phase === "pick") {
      if (sel == null) return false;
      api.tryOnce(); const nm = opt.cands[sel].name;
      if (!good[sel]) { const fd = cb5Fold(F.concat([opt.cands[sel]])); showFold(F.concat([opt.cands[sel]])); api.fail(`${nm} 자리에 붙이면 ${CB5_WHY[fd.why]} 접어 본 모습을 보고 다른 자리를 골라 봐요.`, nm); return false; }
      if (!opt.dash) { fin = true; showFold(F.concat([opt.cands[sel]])); cb5Then(body, api, opt, nm, opt.msg || `${nm} 자리에 붙이면 전개도가 돼요.`); return true; }   // → api.done(
      phase = "dash"; draw(); api.hint(`○ ${nm} 자리가 맞아요! 색칠한 면에서 잘리지 않는 모서리를 눌러 점선으로 바꿔요.`); return false;
    }
    api.tryOnce(); const hs = hingeSides();
    const ok = hs.length === dashSel.size && hs.every(i => dashSel.has(i));
    if (!ok) { api.fail(dashSel.size > hs.length || [...dashSel].some(i => !hs.includes(i)) ? "잘리는 모서리는 실선이에요. 다른 면과 맞닿아 접히는 모서리만 점선으로 나타내요." : "다른 면과 맞닿은 모서리를 찾아 점선으로 바꿔요.", `점선 ${dashSel.size}개`); return false; }
    fin = true; showFold(F.concat([opt.cands[sel]])); cb5Then(body, api, opt, opt.cands[sel].name + " + 점선", opt.msg); return true;
  };
  const kick = autoRun(() => phase === "pick" ? sel != null : dashSel.size >= hingeSides().length,
    () => phase + "|" + sel + "|" + [...dashSel].sort().join(","), check, 0);
  let tm = null;
  box.addEventListener("click", () => { clearTimeout(tm); tm = setTimeout(kick, phase === "pick" ? 600 : 1200); });
  body.append(box, read, fold);
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
  let fin = false;
  const check = () => {
    if (fin) return true; api.tryOnce(); const got = [...sel].sort().map(i => opt.items[i].name).join(", ") || "-";
    cards.forEach((c, i) => { c.classList.remove("cb5-good", "cb5-bad"); if (sel.has(i)) c.classList.add(opt.a.includes(i) ? "cb5-good" : "cb5-bad"); });
    const ex = [...sel].find(i => !opt.a.includes(i));
    if (ex != null) { api.fail(opt.whyExtra ? opt.whyExtra(ex) : `${opt.items[ex].name}는 답이 아니에요.`, got); return false; }
    if (sel.size < opt.a.length) { api.fail(opt.whyMiss || `아직 ${opt.a.length - sel.size}개 더 있어요.`, got); return false; }
    fin = true; cb5Then(body, api, opt, got, opt.msg || opt.ok); return true;   // → api.done(
  };
  const kick = autoRun(() => sel.size >= opt.a.length, () => [...sel].sort().join(","), check, 600);
  cards.forEach(c => c.addEventListener("click", () => kick()));
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), h("div", { class: "cb5cards", style: `grid-template-columns:repeat(auto-fill,minmax(${opt.cardW || "8em"},1fr))` }, ...cards));
}
/* 상자를 눌러 둘러싼 면 6개를 펼쳐 보기 → 다 보면 물음(ask) */
function cb5FaceShapes(P, D) {   // 앞뒤 다각형 2개 + 옆 직사각형들 (실제 모양)
  const n = P.length, L = P.map((p, i) => Math.hypot(P[(i + 1) % n][0] - p[0], P[(i + 1) % n][1] - p[1]));
  return [{ P }, { P }].concat(L.map(l => ({ P: [[0, 0], [l, 0], [l, D], [0, D]] })));
}
function cb5Boxes(body, api, opt) {   /* 끝나면 cb5Then → api.done( */
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
function cb5Robot(body, api, opt) {   /* 끝나면 cb5Then → api.done( */
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
    if (placed.every(x => x != null)) cb5Then(body, api, opt, "장난감 완성", opt.msg || "설계도대로 완성했어요!");
  });
  api.provide({ words: opt.items.map(it => it.name), answers: [] });
  body.append(svg, read); draw();
}

/* =========================================================
   8. 놀이 카드 — 같은 도형의 겨냥도 1장 + 전개도 2장
   ========================================================= */
const CB5_SHAPES = [   // 이야기 버전 놀이 카드: [가로, 높이, 깊이], 전개도 두 가지(칸 모양, 처음 칸의 가로·세로 방향)
  { name: "가", dims: [2, 2, 2], nets: [{ cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], d: { 1: 2, 2: 2, 4: 2 } }, { cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], d: { 1: 2, 2: 2, 4: 2 } }] },
  { name: "나", dims: [4, 1, 2], nets: [{ cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], d: { 1: 4, 2: 1, 4: 2 } }, { cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], d: { 1: 2, 2: 4, 4: 1 } }] },
  { name: "다", dims: [3, 1, 1], nets: [{ cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], d: { 1: 1, 2: 3, 4: 1 } }, { cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], d: { 1: 3, 2: 1, 4: 1 } }] },
  { name: "라", dims: [3, 3, 1], nets: [{ cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], d: { 1: 3, 2: 3, 4: 1 } }, { cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], d: { 1: 1, 2: 3, 4: 3 } }] }
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
  let fin = false;
  const check = () => {
    if (fin) return true; api.tryOnce(); const ans = nets.map(n => put.has(n.id) ? CB5_SHAPES[sks[put.get(n.id)].shape].name : "-").join("");
    nets.forEach(n => { n.bad = CB5_SHAPES[sks[put.get(n.id)].shape] !== CB5_SHAPES[n.shape]; }); draw();
    const bad = nets.filter(n => n.bad).length;
    if (bad) { api.fail(`잘못 놓은 카드가 ${bad}장 있어요(빨간 카드). 모눈 칸을 세어 면의 가로·세로가 겨냥도의 모서리 길이와 같은지 살펴봐요.`, ans); return false; }
    fin = true; cb5Then(body, api, opt, "12장 모두 나눔", opt.msg || opt.ok || "같은 도형끼리 3장씩 모두 모았어요."); return true;   // → api.done(
  };
  const kick = autoRun(() => nets.every(n => put.has(n.id)), () => nets.map(n => put.get(n.id)).join(","), check, 1200);
  top.addEventListener("click", () => kick());
  body.append(h("div", { class: "jua" }, "겨냥도 카드"), top, h("div", { class: "jua" }, "전개도 카드 (눌러 고른 뒤 위의 겨냥도 카드를 눌러요)"), bottom);
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
function cb5SeeFaces(body, api, opt) {   /* 끝나면 cb5Then → api.done( */
  let fin = false; const read = h("div", { class: "cb5read" });
  const S = cb5Solid({ dims: opt.dims, yaw: opt.yaw, pitch: opt.pitch, hidden: "none", fill: () => "#FFE7B8",
    onTurn: (st, vis) => { const n = vis.faces.filter(Boolean).length; read.textContent = `지금 보이는 면: ${n}개`; if (!fin && n === opt.goal) { fin = true; cb5Then(body, api, opt, `보이는 면 ${n}개`, opt.msg); } } });
  api.provide({ words: ["비스듬히 위에서 보기", "보이는 면 3개"], answers: [] });
  body.append(S.svg, S.tools, read);
  read.textContent = `지금 보이는 면: ${S.vis().faces.filter(Boolean).length}개`;
}
/* ---------- 마주 보는 면 3쌍 찾기(돌려 가며 두 면씩 누르기) ---------- */
function cb5OppPairs(body, api, opt) {   /* 끝나면 cb5Then → api.done( */
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
function cb5Bases(body, api, opt) {   /* 끝나면 cb5Then → api.done( */
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
const UNIT_STORY = { title: "우리 반 선물 상자 공방", lines: [
  "햇살초등학교 5학년 2반은 가을 나눔 장터에서 1학년 동생들과 손님들에게 줄 선물 상자를 직접 만들기로 했어요. 공방장 서아, 설계 담당 민호, 카탈로그 그림 담당 유나, 질문 대장 건우가 친구들과 함께 ‘선물 상자 공방’을 열어요.",
  "재료 상자를 모양에 따라 나누어 직육면체와 정육면체를 알아보고, 카탈로그에 실을 상자 그림(겨냥도)을 그리고, 상자를 붙이며 평행한 면과 수직인 면을 찾아요.",
  "두꺼운 종이에 정육면체와 직육면체의 전개도를 그려 오려 접고, 상자를 이어 붙여 공방의 마스코트 ‘상자봇’을 만든 뒤, 같은 상자 카드 놀이와 공방 발표회로 마무리해요."],
  one: "우리 반 선물 상자 공방 · 상자를 나누고, 그리고, 붙이고, 펼치고 접으며 직육면체와 정육면체를 알아봐요." };
const UNIT_KEYWORDS = ["직육면체", "정육면체", "면", "모서리", "꼭짓점", "겨냥도", "실선", "점선", "평행", "밑면", "옆면", "수직", "전개도", "잘린 모서리", "잘리지 않은 모서리"];

/* ---- 이야기 그림과 자료 ---- */
const CB5_SQ = c => c.map(([x, y]) => ({ x, y, w: 1, h: 1 }));
const CB5_CROSS = [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]];
const CB5S_STAIR = [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]];
const CB5S_KIDS = ["서아", "민호", "유나", "건우"];
/* 1차시 공방 책상 그림 */
function cb5sShopFig() {
  const k = 22, W = 470, H = 200;
  return cb5Fig(W, H, s => {
    s.append(svgEl("rect", { x: 0, y: 150, width: W, height: 50, fill: "#EAD9C0" }), svgEl("line", { x1: 0, y1: 150, x2: W, y2: 150, stroke: "#B99A73", "stroke-width": 3 }));
    const box = (x, P, t) => { const g = cb5BoxG(P, k), hh = P.H * k; g.setAttribute("transform", `translate(${x},${150 - hh})`); s.append(g); if (t) s.append(txt(x + P.W * k / 2, 182, t, 14, { fill: CB5.ink })); };
    box(18, { W: 4, H: 2, D: 3, color: "#F6B38E", top: "#FBD6C1", side: "#E39A72", face: (g, w, hh) => { g.append(svgEl("rect", { x: w * .45, y: 0, width: 8, height: hh, fill: "#D64545" })); } }, "선물 상자");
    box(136, { W: 2.4, H: 2.4, D: 2.4, color: "#9CC3F0", top: "#C9DBEE", side: "#7FAEDF" }, "재료 상자");
    box(222, { W: 2, H: 4, D: 1.5, color: "#A9DDB8", top: "#D3EEDB", side: "#86C99A" }, "포장지 상자");
    s.append(svgEl("rect", { x: 302, y: 96, width: 50, height: 54, fill: "#FFE07A", stroke: CB5.ink, "stroke-width": 1.8 }), svgEl("ellipse", { cx: 327, cy: 150, rx: 25, ry: 7, fill: "#FFE07A", stroke: CB5.ink, "stroke-width": 1.8 }),
      svgEl("rect", { x: 303, y: 140, width: 48, height: 10, fill: "#FFE07A", stroke: "none" }), svgEl("ellipse", { cx: 327, cy: 96, rx: 25, ry: 7, fill: "#FFF3C4", stroke: CB5.ink, "stroke-width": 1.8 }), txt(327, 182, "리본 통", 14, { fill: CB5.ink }));
    box(380, { W: 3, H: 1, D: 2.2, color: "#EADFF6", top: "#F4EEFB", side: "#D2C2EA" }, "카드 상자");
    s.append(txt(W / 2, 22, "5학년 2반 선물 상자 공방", 17, { fill: CB5.purple }));
  }, "30em");
}
/* 물건 그림 더하기: 지우개, 쌓기나무 */
const CB5S_OBJ = Object.assign({}, CB5_OBJ, {
  eraser: () => cb5Prism({ P: [[0, 0], [4, 0], [4, 1.3], [0, 1.3]], D: 2, k: 20, hidden: "none", maxW: "100%", plain: true, pad: 12, tint: "#FFFFFF", extra: (s, S) => {
    const L = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    s.append(svgEl("polygon", { points: [L(S[0], S[1], .35), L(S[0], S[1], .75), L(S[3], S[2], .75), L(S[3], S[2], .35)].map(p => p.map(cb5R).join(",")).join(" "), fill: "#9CC3F0", stroke: CB5.ink, "stroke-width": 1.2 })); } }),
  block: () => cb5Prism({ P: [[0, 0], [2.4, 0], [2.4, 2.4], [0, 2.4]], D: 2.4, k: 22, hidden: "none", maxW: "100%", plain: true, pad: 12, fill: { front: "#E9C38F", s1: "#D9AE73", s2: "#F3D9B3" } }) });
/* 직사각형·정사각형 / 수직·평행 떠올리기 그림 */
function cb5sQuadFig() {
  return cb5Fig(420, 150, s => {
    const R = (x, y, w, hh, c, t) => { s.append(svgEl("rect", { x, y, width: w, height: hh, fill: c, stroke: CB5.ink, "stroke-width": 2 }), txt(x + w / 2, y + hh + 17, t, 15));
      [[x, y, 1, 1], [x + w, y, -1, 1], [x + w, y + hh, -1, -1], [x, y + hh, 1, -1]].forEach(([a, b, u, v]) => s.append(svgEl("polyline", { points: `${a + u * 10},${b} ${a + u * 10},${b + v * 10} ${a},${b + v * 10}`, fill: "none", stroke: CB5.red, "stroke-width": 1.5 }))); };
    R(30, 30, 90, 90, "#FDE3D3", "가 (리본 카드)"); R(200, 20, 180, 70, "#DCEAFB", "나 (포장지)");
  }, "22em");
}
function cb5sLineFig() {
  return cb5Fig(420, 170, s => {
    const L = (x1, y1, x2, y2, c) => s.append(svgEl("line", { x1, y1, x2, y2, stroke: c, "stroke-width": 3, "stroke-linecap": "round" }));
    L(30, 30, 30, 130, CB5.org); L(30, 130, 180, 130, CB5.org); s.append(svgEl("polyline", { points: "30,116 44,116 44,130", fill: "none", stroke: CB5.red, "stroke-width": 2 })); s.append(txt(105, 158, "가", 16));
    L(240, 40, 400, 60, CB5.blue); L(240, 110, 400, 130, CB5.blue); s.append(txt(320, 158, "나", 16));
  }, "22em");
}
/* 면·꼭짓점·모서리 표시 그림: lab = [{t(면)}, {t(꼭짓점), i}, {t(모서리)}] */
function cb5sPartsFig(lab) {
  return cb5Cub({ W: 5, H: 2.6, D: 3, k: 30, maxW: "16em", extra: (s, S) => {
    const mark = (p, t, dx, dy) => { s.append(svgEl("line", { x1: cb5R(p[0]), y1: cb5R(p[1]), x2: cb5R(p[0] + dx), y2: cb5R(p[1] + dy), stroke: CB5.red, "stroke-width": 1.6 }), svgEl("circle", { cx: cb5R(p[0]), cy: cb5R(p[1]), r: 3.5, fill: CB5.red }),
      txt(cb5R(p[0] + dx * 1.3), cb5R(p[1] + dy * 1.3), t, 16, { fill: CB5.red })); };
    const fc = [(S[0][0] + S[2][0]) / 2, (S[0][1] + S[2][1]) / 2]; mark(fc, lab[0].t, -22, 20);
    mark(S[lab[1].i], lab[1].t, 18, 14);
    const em = [(S[3][0] + S[7][0]) / 2, (S[3][1] + S[7][1]) / 2]; mark(em, lab[2].t, -20, -16);
  } });
}
/* 마주 보는 면에 자를 대어 본 그림 */
function cb5sRulerFig() {
  return cb5Cub({ W: 5, H: 2, D: 3, k: 28, maxW: "15em", fill: { 0: CB5.par, 1: CB5.par }, extra: (s, S) => {
    const M = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    [[M(S[0], S[3]), M(S[1], S[2])], [M(S[4], S[7]), M(S[5], S[6])]].forEach(([p, q]) => { const dx = q[0] - p[0], dy = q[1] - p[1]; s.append(svgEl("line", { x1: cb5R(p[0] - dx * .25), y1: cb5R(p[1] - dy * .25), x2: cb5R(q[0] + dx * .25), y2: cb5R(q[1] + dy * .25), stroke: CB5.org, "stroke-width": 5, "stroke-linecap": "round", opacity: .8 })); }); } });
}
/* 꼭짓점 하나에 삼각자 세 개의 직각을 대어 본 그림 */
function cb5sRightFig() {
  return cb5Prism({ P: [[0, 0], [5, 0], [5, 2], [0, 2]], D: 3, k: 28, maxW: "16em", fill: { front: "#DCEAFB", s1: "#FDE3D3", s2: "#DDEDE5" }, extra: (s, S) => {
    const V = S[2], u = A => { const dx = A[0] - V[0], dy = A[1] - V[1], L = Math.hypot(dx, dy); return [dx / L * 14, dy / L * 14]; };
    const mk = (A, B, col) => { const a = u(A), b = u(B), P = [[V[0] + a[0], V[1] + a[1]], [V[0] + a[0] + b[0], V[1] + a[1] + b[1]], [V[0] + b[0], V[1] + b[1]]];
      s.append(svgEl("polyline", { points: P.map(p => p.map(cb5R).join(",")).join(" "), fill: "none", stroke: col, "stroke-width": 2.5 })); };
    mk(S[3], S[1], CB5.red); mk(S[3], S[6], CB5.blue); mk(S[1], S[6], CB5.green);
  } });
}
/* 겨냥도 세 가지(3차시 말해 보기) */
function cb5sThreeSk() {
  const one = (o, t) => h("div", { style: "text-align:center" }, cb5Cub(Object.assign({ W: 5, H: 2, D: 3, k: 22, maxW: "10em" }, o)), h("div", { class: "jua" }, t));
  return h("div", { class: "cb5row" }, one({ hidden: "none" }, "가"), one({ hidden: "solid" }, "나"), one({}, "다"));
}
/* 이름 붙인 전개도(둘레 점을 시계 방향으로 ㄱ~ㅎ) */
const CB5S_N5 = cb5LabNet([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], { 1: 1, 2: 1, 4: 1 },
  [[0, 0, "ㄱ"], [1, 0, "ㄴ"], [2, 0, "ㄷ"], [2, 1, "ㄹ"], [3, 1, "ㅁ"], [3, 2, "ㅂ"], [4, 2, "ㅅ"], [4, 3, "ㅇ"], [3, 3, "ㅈ"], [2, 3, "ㅊ"], [2, 2, "ㅋ"], [1, 2, "ㅌ"], [1, 1, "ㅍ"], [0, 1, "ㅎ"]]);
const CB5S_N5C = cb5LabNet([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]], { 1: 1, 2: 1, 4: 1 },
  [[1, 0, "ㄱ"], [2, 0, "ㄴ"], [2, 1, "ㄷ"], [3, 1, "ㄹ"], [3, 2, "ㅁ"], [2, 2, "ㅂ"], [2, 3, "ㅅ"], [2, 4, "ㅇ"], [1, 4, "ㅈ"], [1, 3, "ㅊ"], [1, 2, "ㅋ"], [0, 2, "ㅌ"], [0, 1, "ㅍ"], [1, 1, "ㅎ"]]);
const CB5S_N6 = cb5LabNet([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], { 1: 3, 2: 2, 4: 4 },
  [[1, 0, "ㄱ"], [2, 0, "ㄴ"], [2, 1, "ㄷ"], [3, 1, "ㄹ"], [4, 1, "ㅁ"], [4, 2, "ㅂ"], [3, 2, "ㅅ"], [3, 3, "ㅇ"], [2, 3, "ㅈ"], [2, 2, "ㅊ"], [1, 2, "ㅋ"], [0, 2, "ㅌ"], [0, 1, "ㅍ"], [1, 1, "ㅎ"]]);
/* 6차시 선물 상자(가로 3 cm, 높이 2 cm, 깊이 4 cm) 전개도 */
const CB5S_GIFT = cb5NetFromCells(CB5S_STAIR, { 1: 3, 2: 2, 4: 4 });
/* 5차시 정육면체 전개도 후보: 가·다는 접으면 두 면이 겹침 */
const CB5S_L5J = [
  { name: "가", F: CB5_SQ([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]]) },
  { name: "나", F: CB5_SQ([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2], [1, 3]]) },
  { name: "다", F: CB5_SQ([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1]]) },
  { name: "라", F: CB5_SQ([[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [2, 2]]) }];
/* 6차시 리본 상자(4 cm, 2 cm, 1 cm) 전개도 후보: 나는 맞닿는 모서리의 길이가 다름, 라는 접으면 두 면이 겹침 */
const CB5S_L6J = [
  { name: "가", F: cb5NetFromCells([[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [2, 2]], { 1: 2, 2: 1, 4: 4 }) },
  { name: "나", F: [{ x: 0, y: 2, w: 1, h: 4 }, { x: 1, y: 2, w: 2, h: 4 }, { x: 3, y: 2, w: 1, h: 4 }, { x: 4, y: 2, w: 2, h: 4 }, { x: 1, y: 0, w: 2, h: 2 }, { x: 1, y: 6, w: 2, h: 1 }] },
  { name: "다", F: cb5NetFromCells(CB5S_STAIR, { 1: 4, 2: 2, 4: 1 }) },
  { name: "라", F: [{ x: 0, y: 4, w: 2, h: 1 }, { x: 2, y: 4, w: 4, h: 1 }, { x: 6, y: 4, w: 2, h: 1 }, { x: 8, y: 4, w: 4, h: 1 }, { x: 0, y: 0, w: 2, h: 4 }, { x: 6, y: 0, w: 2, h: 4 }] }];
/* 7차시 상자봇: 머리 직육면체(3, 2, 2) · 몸통 정육면체 3 cm · 팔 직육면체(1, 2, 1) · 다리 정육면체 1 cm */
const CB5S_BOT = {
  head: { name: "머리", kind: "head", W: 3, H: 2, D: 2, color: "#FFD27A", top: "#FFE7B8", side: "#F2C25C", face: (g, w, hh) => { g.append(svgEl("circle", { cx: w * .3, cy: hh * .42, r: 4, fill: CB5.ink }), svgEl("circle", { cx: w * .7, cy: hh * .42, r: 4, fill: CB5.ink }), svgEl("path", { d: `M${w * .35} ${hh * .7} Q${w * .5} ${hh * .85} ${w * .65} ${hh * .7}`, fill: "none", stroke: CB5.ink, "stroke-width": 2.5 })); } },
  body: { name: "몸통", kind: "body", W: 3, H: 3, D: 3, color: "#9CC3F0", top: "#C9DBEE", side: "#7FAEDF", face: (g, w, hh) => { g.append(svgEl("rect", { x: w * .3, y: hh * .3, width: w * .4, height: hh * .25, fill: "#FFF", stroke: CB5.ink, "stroke-width": 1.4 })); } },
  arm: { name: "팔", kind: "arm", W: 1, H: 2, D: 1, color: "#A9DDB8", top: "#D3EEDB", side: "#86C99A" },
  leg: { name: "다리", kind: "leg", W: 1, H: 1, D: 1, color: "#F6B38E", top: "#FBD6C1", side: "#E39A72" } };
const CB5S_BOT_SLOTS = [{ kind: "head", x: 2.5, y: 1, label: "머리" }, { kind: "body", x: 2.5, y: 3, label: "몸통" }, { kind: "arm", x: 1.5, y: 3, label: "팔" }, { kind: "arm", x: 5.5, y: 3, label: "팔" },
  { kind: "leg", x: 2.5, y: 6, label: "다리" }, { kind: "leg", x: 4.5, y: 6, label: "다리" }];
function cb5sBotFig() {
  const k = 26, pad = 14;
  return cb5Fig(8.6 * k + pad * 2, 8 * k + pad * 2, s => {
    CB5S_BOT_SLOTS.slice().sort((a, b) => a.y - b.y).forEach(sl => { const g = cb5BoxG(CB5S_BOT[sl.kind], k); g.setAttribute("transform", `translate(${pad + sl.x * k},${pad + sl.y * k})`); s.append(g); });
    [["머리", 7.1, 2], ["팔", 7.1, 4], ["몸통", 7.1, 5.3], ["다리", 6.1, 6.8]].forEach(([t, x, y]) => s.append(txt(pad + x * k, pad + y * k, t, 14, { fill: CB5.gray, "text-anchor": "start" })));
  }, "15em");
}
const CB5S_PART_NAMES = ["㉠", "㉡", "㉢"];
const CB5S_PARTS = {
  head: cb5PartNet(CB5_CROSS, { 1: 3, 2: 2, 4: 2 }, 5, [[3, "u", 3], null, [0, "l", 2]], CB5S_PART_NAMES),
  body: cb5PartNet(CB5S_STAIR, { 1: 3, 2: 3, 4: 3 }, 5, [[2, "u", 3], [0, "u", 3], null], CB5S_PART_NAMES),
  arm: cb5PartNet(CB5_CROSS, { 1: 1, 2: 2, 4: 1 }, 4, [[3, "r", 1], [5, "d", 2], null], CB5S_PART_NAMES),
  leg: cb5PartNet([[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [2, 2]], { 1: 1, 2: 1, 4: 1 }, 4, [null, [5, "d", 1], [1, "d", 1]], CB5S_PART_NAMES) };
(function cb5sSelfCheck() {   // 자료가 바뀌어도 답이 맞는지 확인(틀리면 화면이 열리기 전에 멈춤)
  const ok = F => cb5Fold(F).ok;
  if (CB5S_L5J.map(n => ok(n.F)).join() !== "false,true,false,true") throw new Error("5차시 전개도 후보 오류");
  if (CB5S_L6J.map(n => ok(n.F)).join() !== "true,false,true,false") throw new Error("6차시 전개도 후보 오류");
  Object.entries(CB5S_PARTS).forEach(([k, P]) => { const g = P.cands.map(c => ok(P.F.concat([c]))); if (g.filter(Boolean).length !== 1) throw new Error("상자봇 " + k + " 후보 오류"); });
  const p = (N, n) => cb5SamePts(cb5Fold(N.F), N.P, n).join("");
  if (p(CB5S_N5, "ㄷ") !== "ㅁㅅ" || p(CB5S_N5, "ㅊ") !== "ㅌㅎ" || p(CB5S_N6, "ㅂ") !== "ㅇㅌ" || p(CB5S_N6, "ㄴ") !== "ㄹ" || p(CB5S_N5C, "ㄱ") !== "ㅈㅍ") throw new Error("겹치는 점 오류");
})();

const LESSONS = [
{
  id: "s1", no: 1, title: "선물 상자 공방을 열어요", soop: "개념 찾기(S)",
  question: "선물 상자 공방에 있는 상자들은 어떤 모양이고, 왜 그런 모양일까요?",
  summary: "공방의 선물 상자, 재료 상자, 포장지 상자처럼 우리 주변에는 직사각형으로 둘러싸인 상자 모양이 많아요. 면이 평평한 직사각형이라 빈틈없이 쌓고 옮기기 쉬워요. 이 단원에서는 직육면체와 정육면체, 겨냥도, 직육면체의 성질, 전개도를 알아봐요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "햇살초등학교 5학년 2반이 가을 나눔 장터에서 나누어 줄 선물 상자를 만들기로 했어요. 공방장 서아가 공방 책상에 여러 가지 상자를 늘어놓았어요. 그림을 보고 떠오르는 것을 세 칸에 써서 붙여요.", hints: ["상자의 면이 어떤 모양인지, 상자끼리 무엇이 같고 다른지 살펴봐요.", "상자를 만들거나 그리려면 무엇을 알아야 할지 떠올려요."],
      render: (b, a) => { b.append(cb5sShopFig()); panes(b, a, [
        { t: "보여요", e: "👀", ph: "~이 보여요", hint: "책상 위 상자의 모양", ex: ["선물 상자, 재료 상자, 포장지 상자가 모두 네모난 면으로 둘러싸여 있어요.", "리본 통은 다른 상자와 달리 둥근 면이 있어요."] },
        { t: "생각해요", e: "💭", ph: "~일 것 같아요", hint: "상자 모양에 대한 내 생각", ex: ["상자의 면이 평평해서 차곡차곡 쌓기 좋을 것 같아요.", "재료 상자는 면의 모양과 크기가 모두 같은 것 같아요."] },
        { t: "궁금해요", e: "❓", ph: "~은 어떻게 할까?", hint: "상자에 대해 궁금한 것", ex: ["상자를 종이 한 장으로 만들려면 어떻게 그려야 할까?", "상자를 그림으로 그릴 때 뒤쪽은 어떻게 나타낼까?"] }],
        { ok: "공방 곳곳에 상자 모양이 숨어 있어요! 이 단원에서 상자의 비밀을 하나씩 알아봐요." }); } },
    { name: "그려 보기 — 선물 상자 둘러보기", inst: "서아가 만든 선물 상자예요. 상자를 이리저리 돌려 가며 둘러싸고 있는 면을 하나씩 눌러 모두 찾아보세요.", hints: ["보이는 면을 누른 뒤, 그림을 돌려 뒤쪽·아래쪽 면도 찾아요.", "누른 면에는 번호가 붙어요."],
      render: (b, a) => cb5Count(b, a, { dims: [5, 2, 3], kinds: ["face"], fillAll: "#F6C9A8", msg: "선물 상자를 둘러싼 면을 모두 찾았어요.",
        ask: [{ parts: ["선물 상자를 둘러싸고 있는 면은 모두 ", { n: 6, why: { "3": "보이는 면만 세었어요. 돌려 보면 뒤쪽, 아래쪽에도 면이 있어요.", "5": "아래쪽 면까지 빠짐없이 세어 봐요." } }, "개이고, 면의 모양은 모두 ", { o: ["직사각형", "삼각형", "원"], a: 0 }, "이에요."] },
          { q: "공방에서 이런 상자를 여러 개 차곡차곡 쌓을 수 있는 까닭은 무엇일까요?", parts: [{ o: ["면이 평평한 직사각형이라 빈틈없이 맞대어 쌓을 수 있어서", "모서리가 둥글어서", "면이 모두 원이라서"], a: 0 }] }],
        ok: "선물 상자는 직사각형 6개로 둘러싸여 있어서 빈틈없이 쌓고 옮기기 쉬워요." }) },
    { name: "말해 보기 — 배운 사각형 떠올리기", inst: "유나가 리본 카드와 포장지를 잘랐어요. 4학년 때까지 배운 사각형을 떠올려 이름을 골라 보세요.", hints: ["네 각이 모두 직각인지 살펴봐요.", "네 변의 길이가 모두 같은지도 살펴봐요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "나(포장지)처럼 네 각이 모두 직각인 사각형을 무엇이라고 할까요?", fig: cb5sQuadFig, o: ["직사각형", "사다리꼴", "마름모"], a: 0, why: { "1": "사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이에요.", "2": "마름모는 네 변의 길이가 모두 같은 사각형이에요. 나는 네 변의 길이가 같지 않아요." } },
        { q: "가(리본 카드)처럼 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형을 무엇이라고 할까요?", o: ["정사각형", "평행사변형", "삼각형"], a: 0 }],
        { ok: "네 각이 모두 직각인 사각형은 직사각형, 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형은 정사각형이에요." }),
        { q: "포장지가 직사각형인지 어떻게 확인할 수 있을지 써 볼까요?", ph: "삼각자를 ~", help: ["① 직사각형의 뜻(네 각이 모두 직각)을 떠올려요. → ② 각이 직각인지 알아보는 도구를 생각해요.", "‘삼각자의 직각 부분을 ~에 대어 네 각이 모두 ~인지 확인해요.’ 꼴로 써요."], ans: "삼각자의 직각 부분을 포장지의 네 귀퉁이에 대어 보아 네 각이 모두 직각인지 확인해요." }) },
    { name: "약속하기 — 수직과 평행 떠올리기", inst: "민호가 상자 설계도에 선을 그었어요. 4학년 때 배운 수직과 평행을 떠올려 보세요.", hints: ["두 직선이 만나서 이루는 각이 직각이면 수직이에요.", "아무리 늘여도 서로 만나지 않는 두 직선은 평행해요."],
      render: (b, a) => quiz(b, a, [
        { q: "가처럼 두 직선이 만나서 이루는 각이 직각일 때, 두 직선은 서로 어떻다고 할까요?", fig: cb5sLineFig, o: ["수직이다", "평행하다"], a: 0, why: { "1": "가의 두 직선은 만나서 직각을 이루어요. 평행한 직선은 서로 만나지 않아요." } },
        { q: "나처럼 아무리 늘여도 서로 만나지 않는 두 직선은 서로 어떻다고 할까요?", o: ["수직이다", "평행하다"], a: 1, why: { "0": "수직인 두 직선은 만나서 직각을 이루어요. 나의 두 직선은 만나지 않아요." } }],
        { ok: "만나서 직각을 이루면 수직, 아무리 늘여도 만나지 않으면 평행이에요." }) },
    { name: "확인하기 — 공방 재료 고르기", inst: "건우가 공방에 가져온 물건이에요. 직사각형으로만 둘러싸인 물건을 모두 골라 보세요.", hints: ["굽은 면이 있는 물건은 직사각형으로만 둘러싸여 있지 않아요.", "돌려 본다고 생각하며 모든 면을 떠올려요."],
      render: (b, a) => cb5Pick(b, a, { items: [{ name: "지우개", fig: CB5S_OBJ.eraser }, { name: "음료수 캔", fig: CB5S_OBJ.can }, { name: "공", fig: CB5S_OBJ.ball }, { name: "휴지 상자", fig: CB5S_OBJ.tissue }, { name: "고깔", fig: CB5S_OBJ.cone }], a: [0, 3],
        whyExtra: i => ["", "음료수 캔은 둥근 면이 있어요.", "공은 둥근 면으로만 되어 있어요.", "", "고깔은 뾰족하고 둥근 면이 있어요."][i], whyMiss: "직사각형으로만 둘러싸인 물건이 하나 더 있어요.", ok: "지우개와 휴지 상자는 직사각형으로만 둘러싸여 있어요." }) }
  ],
  challenge: { inst: "공방 일을 하며 배운 내용을 한 번 더 떠올려 보세요.", hints: ["직사각형과 정사각형의 각을 떠올려요.", "평행한 두 직선 사이에 수직인 선분을 그어 봐요."],
    render: (b, a) => quiz(b, a, [
      { q: "직사각형과 정사각형의 같은 점을 골라 보세요.", o: ["네 각이 모두 직각이에요.", "네 변의 길이가 모두 같아요.", "변이 3개예요."], a: 0, why: { "1": "직사각형은 네 변의 길이가 모두 같지는 않아요.", "2": "사각형은 변이 4개예요." } },
      { q: "서로 평행한 두 직선에 수직인 선분을 그었어요. 이 선분은 다른 한 직선과 어떻게 만날까요?", o: ["수직으로 만나요", "만나지 않아요"], a: 0, why: { "1": "선분을 늘이면 다른 직선과도 만나요. 이때 이루는 각도 직각이에요." } }],
      { ok: "직사각형과 정사각형은 네 각이 모두 직각이에요. 평행한 두 직선에 수직인 선분은 두 직선과 모두 수직으로 만나요." }) }
},
{
  id: "s2", no: 2, title: "재료 상자를 나누어요 ― 직육면체와 정육면체", soop: "개념 구축하기(O)",
  question: "직육면체와 정육면체는 어떤 도형이고, 무엇으로 이루어져 있을까요?",
  summary: "직사각형 6개로 둘러싸인 도형을 직육면체, 정사각형 6개로 둘러싸인 도형을 정육면체라고 해요. 선분으로 둘러싸인 부분을 면, 면과 면이 만나는 선분을 모서리, 모서리와 모서리가 만나는 점을 꼭짓점이라고 해요. 직육면체와 정육면체는 면 6개, 모서리 12개, 꼭짓점 8개로 같고, 면의 모양과 모서리의 길이가 달라요.",
  steps: [
    { name: "만져 보기 — 재료 상자 펼쳐 보기", inst: "공방에 재료 상자 가~바가 도착했어요. 서아: “상자를 모양에 따라 나누어 정리하자!” 상자를 하나씩 눌러 둘러싸고 있는 면 6개를 살펴보세요.", hints: ["상자를 누르면 둘러싼 면 6개가 펼쳐져 보여요.", "면의 네 변의 길이가 모두 같은지, 평행한 변이 한 쌍뿐인 사다리꼴이 있는지 살펴봐요."],
      render: (b, a) => cb5Boxes(b, a, { boxes: [
          { name: "가", P: [[0, 0], [4, 0], [4, 2], [0, 2]], D: 3, color: "#F6D3B4" },
          { name: "나", P: [[0, 0], [2.4, 0], [2.4, 2.4], [0, 2.4]], D: 2.4, color: "#DCEAFB" },
          { name: "다", P: [[0, 0], [4, 0], [3, 2.2], [1, 2.2]], D: 2.4, color: "#DDEDE5" },
          { name: "라", P: [[0, 0], [2, 0], [2, 3.4], [0, 3.4]], D: 1.4, color: "#FFF1C7" },
          { name: "마", P: [[0, 0], [1.8, 0], [1.8, 1.8], [0, 1.8]], D: 1.8, color: "#EADFF6" },
          { name: "바", P: [[0, 0], [3.6, 0], [3.6, 1.6], [0, 2.6]], D: 2, color: "#FBE0E6" }],
        ask: [{ q: "정사각형으로만 둘러싸인 상자를 모두 찾아보세요.", parts: [{ o: CB5_GA, multi: true, a: [1, 4] }] },
          { q: "사다리꼴 모양의 면이 있는 상자를 모두 찾아보세요.", parts: [{ o: CB5_GA, multi: true, a: [2, 5] }] },
          { q: "나머지 상자 가와 라를 둘러싸고 있는 도형은 무엇일까요?", parts: [{ o: ["직사각형", "사다리꼴", "삼각형"], a: 0 }] }],
        bad: "상자를 다시 눌러 면 6개의 모양을 살펴봐요.",
        ok: "나와 마는 정사각형으로만, 가와 라는 직사각형으로 둘러싸여 있어요. 다와 바에는 사다리꼴 모양의 면이 있어요." }) },
    { name: "약속하기 — 직육면체와 정육면체", inst: "직육면체와 정육면체를 약속하고, 공방에 있는 물건에서 찾아보세요.", hints: ["직사각형 6개로 둘러싸인 도형을 찾아요.", "정사각형 6개로 둘러싸인 도형을 찾아요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["직사각형 6개로 둘러싸인 도형을 ", { o: ["직육면체", "정육면체", "사각형"], a: 0 }, "라고 해요. 정사각형 6개로 둘러싸인 도형을 ", { o: ["직육면체", "정육면체", "정사각형"], a: 1 }, "라고 해요."], { ok: "직사각형 6개 → 직육면체, 정사각형 6개 → 정육면체예요." }),
        { title: "직육면체 모양을 모두 골라 보세요.", run: (bx, ax) => cb5Pick(bx, ax, { items: [{ name: "휴지 상자", fig: CB5S_OBJ.tissue }, { name: "음료수 캔", fig: CB5S_OBJ.can }, { name: "책", fig: CB5S_OBJ.book }, { name: "공", fig: CB5S_OBJ.ball }, { name: "지우개", fig: CB5S_OBJ.eraser }], a: [0, 2, 4],
          whyExtra: i => i === 1 ? "음료수 캔은 둥근 면이 있어요." : "공은 둥근 면으로만 되어 있어요.", whyMiss: "직사각형 6개로 둘러싸인 물건을 모두 찾아요.", ok: "휴지 상자, 책, 지우개는 직사각형 6개로 둘러싸여 있어요." }) },
        { title: "정육면체 모양을 모두 골라 보세요.", run: (bx, ax) => cb5Pick(bx, ax, { items: [{ name: "주사위", fig: CB5S_OBJ.dice }, { name: "휴지 상자", fig: CB5S_OBJ.tissue }, { name: "큐브", fig: CB5S_OBJ.cube }, { name: "책", fig: CB5S_OBJ.book }, { name: "쌓기나무", fig: CB5S_OBJ.block }], a: [0, 2, 4],
          whyExtra: i => ({ 1: "휴지 상자의 면은 정사각형이 아닌 직사각형이에요.", 3: "책의 면은 정사각형이 아닌 직사각형이에요." })[i], whyMiss: "정사각형 6개로 둘러싸인 물건을 모두 찾아요.", ok: "주사위, 큐브, 쌓기나무는 정사각형 6개로 둘러싸여 있어요." }) }]) },
    { name: "그려 보기 — 테이프 붙인 곳 세기", inst: "민호가 직사각형 종이 6장을 테이프로 붙여 직육면체 상자를 만들었어요. 상자를 돌려 가며 면, 모서리, 꼭짓점을 하나씩 눌러 모두 세어 보세요.", hints: ["종이와 종이가 만나는 선분(테이프를 붙인 곳)이 모서리예요.", "선분 3개가 만나는 점이 꼭짓점이에요. 돌려서 뒤쪽도 찾아요."],
      render: (b, a) => cb5Count(b, a, { dims: [5, 2, 3],
        ask: [{ q: "약속을 완성해 보세요.", parts: ["선분으로 둘러싸인 부분을 ", { o: ["면", "모서리", "꼭짓점"], a: 0 }, ", 면과 면이 만나는 선분을 ", { o: ["면", "모서리", "꼭짓점"], a: 1 }, ", 모서리와 모서리가 만나는 점을 ", { o: ["면", "모서리", "꼭짓점"], a: 2 }, "이라고 해요."] },
          { parts: ["직육면체의 면은 ", { n: 6 }, "개, 모서리는 ", { n: 12, why: { "9": "보이는 모서리만 세었어요. 돌려서 뒤쪽 모서리도 세어 봐요.", "6": "면의 수를 썼어요. 면과 면이 만나는 선분을 세어요." } }, "개, 꼭짓점은 ", { n: 8, why: { "7": "뒤쪽 아래에 숨은 꼭짓점이 하나 더 있어요." } }, "개예요."] }],
        ok: "선분으로 둘러싸인 부분은 면, 면과 면이 만나는 선분은 모서리, 모서리와 모서리가 만나는 점은 꼭짓점이에요. 직육면체는 면 6개, 모서리 12개, 꼭짓점 8개예요." }) },
    { name: "말해 보기 — 두 상자 견주기", inst: "이번에는 유나가 정사각형 종이 6장으로 정육면체 상자를 만들었어요. 모서리와 꼭짓점을 세어 보고, 민호의 직육면체 상자와 견주어 보세요.", hints: ["정육면체도 돌려 가며 하나씩 세어요.", "수는 같고, 면의 모양과 모서리의 길이가 달라요."],
      render: thenWhy((b, a) => cb5Count(b, a, { dims: [2.6, 2.6, 2.6], kinds: ["edge", "vert"], msg: "정육면체의 모서리와 꼭짓점을 모두 셌어요.", ask: [
          { parts: ["정육면체의 면은 ", { n: 6 }, "개, 모서리는 ", { n: 12 }, "개, 꼭짓점은 ", { n: 8 }, "개예요."] },
          { q: "직육면체와 정육면체를 견주어 보세요.", parts: ["면, 모서리, 꼭짓점의 수는 ", { o: ["같아요", "달라요"], a: 0 }, ". 면의 모양은 직육면체가 ", { o: ["직사각형", "정사각형", "사다리꼴"], a: 0 }, ", 정육면체가 ", { o: ["직사각형", "정사각형", "삼각형"], a: 1 }, "이에요. 정육면체는 모든 모서리의 길이가 ", { o: ["같고", "다르고"], a: 0 }, ", 직육면체는 길이가 같은 모서리가 ", { o: ["4개씩 3쌍", "2개씩 6쌍", "12개 모두"], a: 0, why: { "2": "직육면체는 가로, 세로, 높이의 길이가 달라요. 모서리의 길이가 모두 같지는 않아요." } }, " 있어요."] }],
        ok: "직육면체와 정육면체는 면 6개, 모서리 12개, 꼭짓점 8개로 같아요. 면의 모양과 모서리의 길이가 달라요." }),
        { q: "직육면체에서 길이가 같은 모서리가 4개씩 있는 까닭을 써 볼까요?", ph: "같은 방향으로 놓인 모서리는 ~", help: ["① 직육면체를 돌려 보며 가로, 세로, 높이 방향의 모서리를 각각 세어 봐요. → ② 마주 보는 면의 모양과 크기를 떠올려요.", "‘같은 방향으로 놓인 모서리는 ~개이고, 마주 보는 면의 ~이 같아서 길이가 같아요.’ 꼴로 써요."], ans: "같은 방향으로 놓인 모서리는 4개씩이고, 마주 보는 면은 모양과 크기가 같아서 이 4개의 길이가 같아요. 방향이 가로, 세로, 높이 3가지라서 4개씩 3쌍이에요." }) },
    { name: "확인하기 — 리본 길이 구하기", inst: "직육면체와 정육면체의 구성 요소를 확인하고, 정육면체 선물 상자의 모서리를 따라 붙일 리본의 길이를 구해 보세요.", hints: ["선분으로 둘러싸인 부분은 면, 면과 면이 만나는 선분은 모서리, 모서리와 모서리가 만나는 점은 꼭짓점이에요.", "정육면체는 모서리 12개의 길이가 모두 같아요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => cb5Ask(bx, ax, [{ q: "직육면체에서 ①, ②, ③이 가리키는 곳의 이름을 골라 보세요.", fig: () => cb5sPartsFig([{ t: "①" }, { i: 1, t: "②" }, { t: "③" }]),
          parts: ["① ", { o: ["꼭짓점", "면", "모서리"], a: 1 }, "  ② ", { o: ["꼭짓점", "면", "모서리"], a: 0 }, "  ③ ", { o: ["꼭짓점", "면", "모서리"], a: 2 }] }], { ok: "① 면, ② 꼭짓점, ③ 모서리예요." }),
        (bx, ax) => cb5Ask(bx, ax, [{ q: "한 모서리가 8 cm인 정육면체 선물 상자의 모든 모서리에 리본을 붙이려고 해요.", fig: () => cb5Cub({ W: 3, H: 3, D: 3, k: 30, maxW: "13em", dims: [[0, 1, "8 cm"]] }),
          parts: ["정육면체의 모서리는 ", { n: 12, why: { "8": "꼭짓점의 수를 썼어요. 모서리는 면과 면이 만나는 선분이에요.", "9": "보이지 않는 모서리 3개도 세어요." } }, "개이고, 길이가 모두 ", { n: 8 }, " cm예요.", h("br"), "필요한 리본은 8 × 12 = ", { n: 96, why: { "64": "모서리는 8개가 아니라 12개예요.", "48": "면 6개가 아니라 모서리 12개만큼 곱해요." } }, " (cm)예요."] }], { ok: "정육면체는 모서리 12개의 길이가 모두 같아서 8 × 12 = 96 (cm)의 리본이 필요해요." })]) }
  ],
  challenge: { inst: "질문 대장 건우의 말과 민호의 상자를 살펴보세요.", hints: ["직육면체는 길이가 같은 모서리가 4개씩 3쌍 있어요.", "정육면체는 정사각형 6개로 둘러싸인 도형이에요."],
    render: (b, a) => quiz(b, a, [
      { q: "건우: “직육면체와 정육면체는 모서리의 길이가 모두 같아.” 건우의 말을 바르게 고친 것을 골라 보세요.",
        o: ["정육면체는 모서리의 길이가 모두 같지만, 직육면체는 길이가 같은 모서리가 4개씩 3쌍 있어요.", "직육면체와 정육면체는 모서리의 길이가 모두 달라요.", "직육면체는 모서리의 길이가 모두 같지만, 정육면체는 달라요."], a: 0,
        why: { "1": "정육면체는 모서리의 길이가 모두 같아요.", "2": "거꾸로 말했어요. 모서리의 길이가 모두 같은 것은 정육면체예요." } },
      { q: "가로 6 cm, 세로 4 cm, 높이 4 cm인 민호의 상자가 정육면체가 아닌 까닭을 골라 보세요.", fig: () => cb5Cub({ W: 4.5, H: 3, D: 3, k: 26, maxW: "14em", dims: [[0, 1, "6 cm"], [1, 3, "4 cm"], [3, 7, "4 cm"]] }),
        o: ["정사각형이 아닌 면이 있기 때문이에요.", "면이 6개보다 많기 때문이에요.", "꼭짓점이 8개이기 때문이에요."], a: 0, why: { "1": "이 상자의 면은 6개예요.", "2": "정육면체도 꼭짓점이 8개예요." } }],
      { ok: "정육면체는 모서리의 길이가 모두 같지만 직육면체는 4개씩 3쌍이 같아요. 6 cm × 4 cm인 면은 정사각형이 아니라서 민호의 상자는 정육면체가 아니에요." }) }
},
{
  id: "s3", no: 3, title: "카탈로그에 상자 그림을 실어요 ― 겨냥도", soop: "개념 구축하기(O)",
  question: "상자 모양을 잘 알 수 있게 그리려면 어떻게 나타내면 좋을까요?",
  summary: "직육면체 모양을 잘 알 수 있도록 나타낸 그림을 직육면체의 겨냥도라고 해요. 겨냥도에서는 보이는 모서리를 실선으로, 보이지 않는 모서리를 점선으로 그려요. 겨냥도에는 보이는 면 3개와 보이지 않는 면 3개, 보이는 모서리 9개와 보이지 않는 모서리 3개, 보이는 꼭짓점 7개와 보이지 않는 꼭짓점 1개가 있어요.",
  steps: [
    { name: "만져 보기 — 상자를 어디에서 볼까", inst: "유나는 나눔 장터 카탈로그에 선물 상자 그림을 실으려고 해요. 정면에서 본 상자는 면이 1개만 보여요. 상자를 돌려서 면이 3개 보이게 만들어 보세요.", hints: ["▶와 ▲ 단추로 조금씩 돌려 봐요.", "비스듬히 위에서 보면 앞면, 옆면, 윗면이 함께 보여요."],
      render: (b, a) => cb5SeeFaces(b, a, { dims: [5, 2, 3], yaw: 0, pitch: 0, goal: 3, msg: "면이 3개 보이도록 돌렸어요.",
        ask: [{ q: "유나가 같은 상자를 여러 방향에서 그려 본 모양이에요.", fig: () => h("div", { class: "cb5row" },
            ...[[0, 0, "가"], [-35, 24, "나"], [-35, 0, "다"]].map(([y, p, t]) => h("div", { style: "text-align:center" }, cb5Solid({ dims: [5, 2, 3], yaw: y, pitch: p, hidden: "none", fixed: true, size: [260, 200], fill: () => "#FFE7B8", maxW: "11em" }).svg, h("div", { class: "jua" }, t)))),
          parts: ["보이는 면의 수: 가 ", { n: 1 }, "개, 나 ", { n: 3 }, "개, 다 ", { n: 2 }, "개", h("br"), "상자 모양을 가장 잘 알 수 있는 것은 ", { o: ["가", "나", "다"], a: 1, why: { "0": "가는 면이 1개만 보여서 상자의 깊이를 알 수 없어요.", "2": "다는 윗면이 보이지 않아요. 면이 가장 많이 보이는 그림을 골라요." } }, "예요.", h("br"),
            "보이지 않는 면도 알 수 있게 하려면 보이지 않는 모서리를 ", { o: ["점선으로 그려요", "그리지 않아요", "더 굵게 그려요"], a: 0 }, "."] }],
        ok: "나처럼 비스듬히 위에서 본 모양이 상자를 가장 잘 나타내요. 보이지 않는 모서리는 점선으로 그리면 돼요." }) },
    { name: "약속하기 — 겨냥도", inst: "카탈로그 그림을 약속해 보세요.", hints: ["보이는 모서리와 보이지 않는 모서리를 다르게 그려요."],
      render: (b, a) => blanks(b, a, ["직육면체 모양을 잘 알 수 있도록 나타낸 그림을 직육면체의 ", { o: ["겨냥도", "전개도", "설계도"], a: 0 }, "라고 해요. 겨냥도에서 보이는 모서리는 ", { o: ["실선", "점선"], a: 0 }, "으로, 보이지 않는 모서리는 ", { o: ["실선", "점선"], a: 1 }, "으로 나타내요."],
        { ok: "직육면체 모양을 잘 알 수 있도록 나타낸 그림이 겨냥도예요. 보이는 모서리는 실선, 보이지 않는 모서리는 점선이에요." }) },
    { name: "그려 보기 — 카탈로그 그림 그리기", inst: "모눈종이에 선물 상자의 겨냥도를 그려 보세요. 앞면은 그려져 있어요. 점에서 점까지 끌어 모서리를 긋고, 보이지 않는 모서리는 점선 펜으로 그어요.", hints: ["평행한 모서리는 평행하게 그어요. 오른쪽으로 2칸, 위로 2칸 밀린 곳에 뒤쪽 꼭짓점이 있어요.", "왼쪽 아래 뒤쪽의 꼭짓점에서 만나는 모서리 3개가 보이지 않는 모서리예요."],
      render: ruleFirst((b, a) => cb5Sketch(b, a, { W: 5, H: 2, dx: 2, dy: 2, cols: 9, rows: 6, ox: 1, oy: 1, given: [0, 1, 3, 5], mode: "draw",
        ask: [{ q: "그린 겨냥도를 살펴보고 빈칸을 채워 보세요.",
          parts: ["보이는 면 ", { n: 3 }, "개, 보이지 않는 면 ", { n: 3 }, "개", h("br"), "보이는 모서리 ", { n: 9 }, "개, 보이지 않는 모서리 ", { n: 3 }, "개", h("br"), "보이는 꼭짓점 ", { n: 7, why: { "8": "뒤쪽 아래 꼭짓점 1개는 보이지 않아요." } }, "개, 보이지 않는 꼭짓점 ", { n: 1 }, "개"] }],
        ok: "겨냥도에는 보이는 면 3개·보이지 않는 면 3개, 실선 9개·점선 3개, 보이는 꼭짓점 7개·보이지 않는 꼭짓점 1개가 있어요." }),
        { q: "겨냥도에서 실선과 점선은 각각 몇 개가 될까요?", ph: "실선 ~개, 점선 ~개", help: ["① 직육면체의 모서리가 모두 몇 개인지 떠올려요. → ② 비스듬히 볼 때 숨는 모서리가 몇 개인지 생각해요.", "‘모서리 ~개 중 보이는 모서리 ~개는 실선, 보이지 않는 모서리 ~개는 점선일 것 같아요.’ 꼴로 써요."], ans: "직육면체의 모서리 12개 중 보이는 모서리 9개는 실선, 뒤쪽 아래 꼭짓점에서 만나는 보이지 않는 모서리 3개는 점선으로 그려요." }) },
    { name: "말해 보기 — 어느 그림을 실을까", inst: "유나가 카탈로그에 실을 그림 세 장을 그렸어요. 직육면체의 겨냥도를 바르게 그린 것을 골라 보세요.", hints: ["보이는 모서리는 실선, 보이지 않는 모서리는 점선인지 살펴봐요.", "모서리 12개가 모두 그려져 있는지 세어 봐요."],
      render: thenWhy((b, a) => quiz(b, a, [{ q: "직육면체의 겨냥도를 바르게 그린 것은 어느 것일까요?", fig: cb5sThreeSk, o: ["가", "나", "다"], a: 2,
          why: { "0": "가는 보이지 않는 모서리를 그리지 않았어요. 그러면 뒤쪽 모양을 알 수 없어요.", "1": "나는 보이지 않는 모서리까지 실선으로 그렸어요." } }],
        { ok: "다처럼 보이는 모서리 9개는 실선, 보이지 않는 모서리 3개는 점선으로 그려요." }),
        { q: "다가 가나 나보다 상자 모양을 더 잘 나타내는 까닭을 써 볼까요?", ph: "다는 ~", help: ["① 가, 나, 다에서 보이지 않는 모서리를 어떻게 그렸는지 견주어 봐요. → ② 그렇게 그리면 무엇을 알 수 있는지 써요.", "‘다는 보이는 모서리는 ~, 보이지 않는 모서리는 ~으로 그려서 ~까지 알 수 있어요.’ 꼴로 써요."], ans: "다는 보이는 모서리는 실선, 보이지 않는 모서리는 점선으로 그려서 뒤쪽 모서리까지 알 수 있고, 보이는 것과 보이지 않는 것도 구별할 수 있어요." }) },
    { name: "확인하기 — 정육면체 상자 그림 완성하기", inst: "유나가 정육면체 재료 상자의 겨냥도를 그리다 말았어요. 빠진 모서리를 찾아 실선 또는 점선으로 그어 완성해 보세요.", hints: ["모서리는 모두 12개예요. 지금 그려진 모서리를 세어 봐요.", "보이지 않는 모서리 3개는 왼쪽 아래 뒤쪽 꼭짓점에서 만나요."],
      render: (b, a) => cb5Sketch(b, a, { W: 3, H: 3, dx: 2, dy: 2, cols: 7, rows: 7, ox: 1, oy: 1, mode: "draw", given: [0, 1, 3, 5, 6, 7, 11],
        ask: [{ parts: ["완성한 겨냥도에서 보이지 않는 모서리는 ", { n: 3 }, "개, 보이지 않는 꼭짓점은 ", { n: 1 }, "개예요."] }],
        ok: "정육면체의 겨냥도에도 보이지 않는 모서리 3개와 보이지 않는 꼭짓점 1개가 있어요." }) }
  ],
  challenge: { inst: "가로 9 cm, 세로 6 cm, 높이 5 cm인 선물 상자의 카탈로그 그림이에요. 그림의 보이는 모서리에는 금색 테이프를, 보이지 않는 모서리에는 은색 테이프를 붙였다고 생각해 보세요.", hints: ["보이는 모서리 9개에는 9 cm, 6 cm, 5 cm인 모서리가 3개씩 있어요.", "보이지 않는 모서리 3개에는 9 cm, 6 cm, 5 cm인 모서리가 1개씩 있어요."],
    render: (b, a) => cb5Ask(b, a, [{ fig: () => cb5Cub({ W: 4.5, H: 2.5, D: 3, k: 34, maxW: "18em", dims: [[0, 1, "9 cm"], [1, 3, "5 cm"], [3, 7, "6 cm"]] }),
      parts: ["금색 테이프(보이는 모서리 길이의 합): (9 + 6 + 5) × ", { n: 3 }, " = ", { n: 60, why: { "20": "보이는 모서리는 9개라서 9 cm, 6 cm, 5 cm가 3개씩 있어요.", "80": "보이는 모서리는 12개가 아니라 9개예요." } }, " (cm)", h("br"),
        "은색 테이프(보이지 않는 모서리 길이의 합): 9 + 6 + 5 = ", { n: 20, why: { "60": "보이지 않는 모서리는 3개뿐이에요. 길이가 다른 모서리가 1개씩 있어요." } }, " (cm)"] }],
      { ok: "보이는 모서리의 합은 (9+6+5)×3=60 (cm), 보이지 않는 모서리의 합은 9+6+5=20 (cm)예요." }) }
},
{
  id: "s4", no: 4, title: "상자를 붙여 진열대를 만들어요 ― 직육면체의 성질", soop: "개념 구축하기(O)",
  question: "직육면체에서 마주 보는 면과 서로 만나는 면은 어떤 관계일까요?",
  summary: "직육면체에서 계속 늘여도 만나지 않는 두 면을 서로 평행하다고 하고, 이 두 면을 직육면체의 밑면이라고 해요. 서로 평행한 면은 3쌍이고 각각 밑면이 될 수 있어요. 밑면과 만나는 면을 옆면이라고 하고, 밑면과 옆면은 수직으로 만나요. 한 면과 수직인 면은 4개예요.",
  steps: [
    { name: "만져 보기 — 마주 보는 면 찾기", inst: "공방 친구들이 상자를 쌓아 장터 진열대를 만들어요. 민호: “상자를 똑바로 쌓으려면 마주 보는 면이 어떤지 알아야 해.” 상자를 돌려 가며 마주 보는 면을 두 개씩 눌러 모두 찾아보세요.", hints: ["한 면을 누른 뒤, 그 면과 만나지 않는 반대쪽 면을 눌러요.", "뒤쪽, 아래쪽 면은 돌려서 찾아요."],
      render: (b, a) => cb5OppPairs(b, a, { dims: [5, 2, 3],
        ask: [{ q: "마주 보는 두 면(앞면과 뒷면)에 자를 대어 보았어요. 자를 계속 늘이면 어떻게 될까요?", fig: cb5sRulerFig,
          parts: ["마주 보는 면은 모두 ", { n: 3, why: { "6": "면은 6개이고, 두 면씩 짝을 지으면 몇 쌍인지 세어요.", "2": "앞뒤, 왼쪽 오른쪽, 위아래를 모두 세어요." } }, "쌍이에요. 마주 보는 두 면은 계속 늘여도 서로 ", { o: ["만나지 않아요", "만나요"], a: 0 }, "."] }],
        ok: "마주 보는 면은 3쌍이고, 마주 보는 두 면은 계속 늘여도 만나지 않아요." }) },
    { name: "약속하기 — 평행한 면과 밑면", inst: "직육면체의 평행한 면과 밑면을 약속하고, 단추를 눌러 밑면을 바꿔 보세요.", hints: ["상자를 어떻게 놓아도 마주 보는 두 면이 밑면이 될 수 있어요.", "서로 평행한 면은 3쌍이에요."],
      render: thenWhy((b, a) => cb5Bases(b, a, { dims: [5, 2, 3],
        ask: [{ parts: ["직육면체에서 계속 늘여도 만나지 않는 두 면을 서로 ", { o: ["평행하다", "수직이다"], a: 0 }, "고 해요. 이 두 면을 직육면체의 ", { o: ["밑면", "옆면", "윗면"], a: 0 }, "이라고 해요. 직육면체에는 서로 평행한 면이 ", { n: 3 }, "쌍 있고, 서로 평행한 면은 각각 밑면이 ", { o: ["될 수 있어요", "될 수 없어요"], a: 0 }, "."] }],
        ok: "계속 늘여도 만나지 않는 두 면은 서로 평행하고, 이 두 면이 밑면이에요. 평행한 면 3쌍은 모두 밑면이 될 수 있어요." }),
        { q: "건우가 “밑면은 아래에 있는 면이야.”라고 말했어요. 건우의 말을 바르게 고쳐 써 볼까요?", ph: "밑면은 ~", help: ["① 단추를 눌러 밑면을 바꿨을 때 어느 면이 밑면이 되었는지 떠올려요. → ② 밑면의 약속(서로 평행한 두 면)과 견주어요.", "‘밑면은 아래에 있는 면이 아니라 ~ 두 면이에요. ~쌍 모두 밑면이 될 수 있어요.’ 꼴로 써요."], ans: "밑면은 아래에 있는 면이 아니라 서로 평행한 두 면이에요. 평행한 면 3쌍은 모두 밑면이 될 수 있어요." }) },
    { name: "그려 보기 — 만나는 면 찾기", inst: "서아가 상자 윗면(색칠한 면)에 손잡이를 달았어요. 손잡이를 단 면과 만나는 면을 모두 눌러 찾아보세요. 먼저 예상을 써요.", hints: ["색칠한 면의 네 모서리마다 만나는 면이 하나씩 있어요.", "마주 보는 면은 만나지 않아요."],
      render: ruleFirst((b, a) => cb5FacePick(b, a, { dims: [5, 2, 3], lab: false, base: 5, baseText: "○", need: [0, 1, 2, 3],
        whyExtra: f => f === 4 ? "그 면은 색칠한 면과 마주 보는 면이라서 만나지 않아요." : "그 면은 답이 아니에요.", whyFew: "아직 더 있어요. 색칠한 면의 네 모서리마다 만나는 면이 있어요. 돌려서 뒤쪽도 살펴봐요.",
        msg: "색칠한 면과 만나는 면은 4개예요.",
        ask: [{ q: "삼각자 3개의 직각 부분을 한 꼭짓점에서 만나도록 대어 보았어요. 서로 만나는 면은 어떻게 만날까요?", fig: cb5sRightFig,
          parts: ["색칠한 면과 만나는 면은 ", { n: 4, why: { "3": "돌려서 뒤쪽 면도 세어 봐요.", "5": "마주 보는 면은 만나지 않아요." } }, "개예요. 면끼리 만나는 부분과 삼각자의 직각 부분이 꼭 맞으므로 서로 만나는 면은 ", { o: ["수직으로", "평행하게"], a: 0 }, " 만나요."] }],
        ok: "한 면과 만나는 면은 4개이고, 서로 만나는 면은 수직으로 만나요." }),
        { q: "한 면과 만나는 면은 몇 개이고, 어떻게 만날까요?", ph: "만나는 면은 ~개이고 ~", help: ["① 색칠한 면의 모서리가 몇 개인지 세어 봐요. → ② 상자의 귀퉁이 모양을 떠올려요.", "‘색칠한 면과 만나는 면은 ~개이고, ~으로 만날 것 같아요.’ 꼴로 써요."], ans: "한 면과 만나는 면은 4개이고, 모두 수직으로 만나요." }) },
    { name: "약속하기 — 옆면", inst: "직육면체의 옆면을 약속해 보세요.", hints: ["밑면과 만나는 면이 옆면이에요."],
      render: (b, a) => blanks(b, a, ["직육면체에서 밑면과 만나는 면을 직육면체의 ", { o: ["옆면", "밑면", "윗면"], a: 0 }, "이라고 해요. 이때 밑면과 옆면은 ", { o: ["수직으로", "평행하게"], a: 0 }, " 만나요. 한 밑면에 대한 옆면은 모두 ", { o: ["4개", "2개", "6개"], a: 0 }, "예요."],
        { ok: "밑면과 만나는 면이 옆면이고, 밑면과 옆면은 수직으로 만나요. 한 밑면에 대한 옆면은 4개예요." }) },
    { name: "확인하기 — 리본 붙일 면 찾기", inst: "민호가 상자의 꼭짓점에 이름을 붙였어요. 면 ㄴㅂㅅㄷ과 평행한 면, 수직인 면을 찾아보세요. 그림을 돌리면 꼭짓점 이름이 함께 움직여요.", hints: ["면 ㄴㅂㅅㄷ과 마주 보는 면이 평행한 면이에요.", "면 이름은 꼭짓점을 시계 방향이나 시계 반대 방향으로 차례대로 읽어요."],
      render: (b, a) => cb5Chain(b, a, [
        { title: "① 면 ㄴㅂㅅㄷ과 평행한 면을 눌러 보세요.", run: (bx, ax) => cb5FacePick(bx, ax, { dims: [5, 2, 3], base: 0, need: [1], baseText: "면 ㄴㅂㅅㄷ", whyExtra: () => "그 면은 면 ㄴㅂㅅㄷ과 만나요. 평행한 면은 마주 보는 면이에요. 돌려서 뒤쪽을 살펴봐요.", ok: "면 ㄴㅂㅅㄷ과 평행한 면은 면 ㄱㅁㅇㄹ이에요." }) },
        { title: "② 면 ㄴㅂㅅㄷ과 수직인 면을 모두 눌러 보세요.", run: (bx, ax) => cb5FacePick(bx, ax, { dims: [5, 2, 3], base: 0, need: [2, 3, 4, 5], baseText: "면 ㄴㅂㅅㄷ", whyExtra: () => "면 ㄱㅁㅇㄹ은 면 ㄴㅂㅅㄷ과 평행한 면이에요.", ok: "면 ㄴㅂㅅㄷ과 수직인 면은 4개예요." }) },
        { title: "③ 면 이름을 써 보세요. (자음 단추를 눌러 써도 돼요.)", run: (bx, ax) => cb5FaceAsk(bx, ax, [
          { q: "면 ㄴㅂㅅㄷ과 평행한 면", ans: [1] }, { q: "면 ㄴㅂㅅㄷ과 수직인 면 4개", ans: [2, 3, 4, 5], why: "면 ㄴㅂㅅㄷ과 만나는 면 4개를 써요." }],
          { ok: "평행한 면은 면 ㄱㅁㅇㄹ, 수직인 면은 면 ㄱㄴㅂㅁ, 면 ㄷㅅㅇㄹ, 면 ㅁㅂㅅㅇ, 면 ㄱㄴㄷㄹ이에요." }) }]) }
  ],
  challenge: { inst: "진열대 상자로 직육면체의 성질을 더 알아봐요.", hints: ["한 면과 평행한 면은 1개, 수직인 면은 4개예요.", "두 면에 동시에 수직인 면은 두 면 모두와 만나는 면이에요."],
    render: (b, a) => cb5Chain(b, a, [
      (bx, ax) => quiz(bx, ax, [{ q: "직육면체에 대해 잘못 말한 것을 골라 보세요.", o: ["㉠ 한 면과 평행한 면은 1개예요.", "㉡ 한 꼭짓점에서 만나는 면은 3개예요.", "㉢ 한 면과 수직인 면은 3개예요."], a: 2,
        why: { "0": "한 면과 마주 보는 면은 1개뿐이에요. 옳은 말이에요.", "1": "상자의 한 귀퉁이에서 면 3개가 만나요. 옳은 말이에요." } }], { ok: "한 면과 수직인 면은 4개이므로 ㉢이 잘못되었어요." }),
      { title: "색칠한 면 ㄷㅅㅇㄹ과 평행한 면을 찾고, 그 면의 모서리 길이의 합을 구해 보세요.", run: (bx, ax) => cb5Chain(bx, ax, [
        (by, ay) => { const S = cb5Solid({ dims: [8, 3, 5], yaw: -35, pitch: 22, lab: true, fill: f => f === 3 ? CB5.par : null, dimLab: [[0, 1, "8 cm"], [1, 3, "3 cm"], [3, 7, "5 cm"]] }); by.append(S.svg, S.tools);
          cb5FaceAsk(by, ay, [{ q: "⑴ 색칠한 면과 평행한 면", ans: [2], why: "색칠한 면과 마주 보는 면을 찾아요. 그림을 돌려 왼쪽을 살펴봐요." }], { ok: "색칠한 면 ㄷㅅㅇㄹ과 평행한 면은 면 ㄱㄴㅂㅁ이에요." }); },
        (by, ay) => cb5Ask(by, ay, [{ q: "⑵ 면 ㄱㄴㅂㅁ의 모서리 길이의 합", parts: ["(3 + 5) × 2 = ", { n: 16, why: { "8": "네 모서리를 모두 더해요. 3 cm와 5 cm인 모서리가 2개씩 있어요.", "22": "8 cm는 면 ㄱㄴㅂㅁ의 모서리가 아니에요.", "26": "8 cm는 면 ㄱㄴㅂㅁ의 모서리가 아니에요." } }, " (cm)"] }],
          { ok: "면 ㄱㄴㅂㅁ은 색칠한 면과 모양과 크기가 같아서 모서리 길이의 합은 (3+5)×2=16 (cm)예요." })]) },
      { title: "색칠한 두 면(면 ㄱㄴㄷㄹ, 면 ㄱㄴㅂㅁ)과 동시에 수직인 면을 모두 눌러 보세요.", run: (bx, ax) => cb5FacePick(bx, ax, { dims: [5, 2, 3], base: [5, 2], baseText: "색칠한 면", need: [0, 1],
        whyExtra: f => f === 3 ? "면 ㄷㅅㅇㄹ은 면 ㄱㄴㄷㄹ과는 수직이지만 면 ㄱㄴㅂㅁ과는 평행해요." : "면 ㅁㅂㅅㅇ은 면 ㄱㄴㅂㅁ과는 수직이지만 면 ㄱㄴㄷㄹ과는 평행해요.",
        ok: "두 면에 동시에 수직인 면은 면 ㄴㅂㅅㄷ과 면 ㄱㅁㅇㄹ이에요." }) }]) }
},
{
  id: "s5", no: 5, title: "정육면체 상자를 펼쳐요 ― 정육면체의 전개도", soop: "개념 구축하기(O)",
  question: "정육면체 상자를 종이 한 장으로 만들려면 어떤 모양을 그려야 할까요?",
  summary: "정육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 정육면체의 전개도라고 해요. 전개도에서 잘린 모서리는 실선으로, 잘리지 않은 모서리는 점선으로 나타내요. 정육면체의 전개도는 정사각형 6개로 이루어져 있고, 접었을 때 겹치는 면이 없어야 해요. 한 정육면체도 여러 가지 모양으로 펼칠 수 있어요.",
  steps: [
    { name: "만져 보기 — 재료 상자 펼치기", inst: "서아: “정육면체 재료 상자를 펼쳐 보면 종이 한 장으로 상자를 만드는 방법을 알 수 있을 거야.” ‘펼치기’를 누르거나 막대를 끌어 상자를 끝까지 펼쳐 보세요.", hints: ["막대를 ‘펼침’ 쪽 끝까지 끌어요.", "그림을 끌면 보는 방향을 바꿀 수 있어요."],
      render: (b, a) => cb5FoldStep(b, a, { F: CB5_SQ(CB5S_STAIR), start: 1, goal: 0, msg: "정육면체 상자를 끝까지 펼쳤어요.",
        ask: [{ parts: ["펼친 모양은 정사각형 ", { n: 6 }, "개로 이루어져 있어요. 펼친 그림에는 가위로 자른 모서리와 ", { o: ["자르지 않고 접힌 채로 남은 모서리", "보이지 않는 모서리"], a: 0 }, "가 있어요."] }],
        ok: "정육면체 상자를 펼치면 정사각형 6개가 이어진 모양이 돼요. 잘린 모서리와 잘리지 않은 모서리가 있어요." }) },
    { name: "약속하기 — 전개도", inst: "정육면체의 전개도를 약속해 보세요.", hints: ["모서리를 잘라서 평면 위에 펼쳐 놓은 그림이에요.", "접는 선은 잘리지 않은 모서리예요."],
      render: (b, a) => { b.append(cb5NetSvg(CB5_SQ(CB5S_STAIR), { k: 40, maxW: "17em" }).svg);
        blanks(b, a, ["정육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 정육면체의 ", { o: ["전개도", "겨냥도", "설계도"], a: 0 }, "라고 해요. 전개도에서 잘린 모서리는 ", { o: ["실선", "점선"], a: 0 }, "으로, 잘리지 않은 모서리는 ", { o: ["실선", "점선"], a: 1 }, "으로 나타내요."],
          { ok: "모서리를 잘라서 평면 위에 펼쳐 놓은 그림이 전개도예요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선이에요." }); } },
    { name: "그려 보기 — 접히는 모양 고르기", inst: "민호가 정육면체 상자의 전개도 후보 네 장을 그렸어요. 먼저 규칙을 예상해 쓴 뒤, 정육면체의 전개도가 될 수 있는 것을 모두 골라 보세요. ‘접어 보기’로 확인할 수 있어요.", hints: ["접었을 때 겹치는 면이 있으면 전개도가 될 수 없어요.", "한 줄로 이어진 면은 4개까지만 상자를 한 바퀴 둘러요."],
      render: ruleFirst((b, a) => cb5NetJudge(b, a, { nets: CB5S_L5J, want: "can", k: 22,
        ask: [{ q: "가와 다가 정육면체의 전개도가 될 수 없는 까닭을 골라 보세요.", parts: [{ o: ["접었을 때 겹치는 면이 있어요.", "면이 6개보다 적어요.", "정사각형이 아닌 면이 있어요."], a: 0, why: { "1": "가와 다도 면이 6개예요.", "2": "가와 다의 면은 모두 정사각형이에요." } }] }],
        ok: "나와 라는 정육면체의 전개도예요. 가와 다는 접었을 때 겹치는 면이 있어서 전개도가 될 수 없어요." }),
        { q: "어떤 모양이면 정육면체의 전개도가 될 수 없을까요?", ph: "~하면 전개도가 될 수 없어요", help: ["① 펼친 상자를 다시 접는 모습을 떠올려요. → ② 두 면이 같은 자리로 가는 경우를 생각해요.", "‘접었을 때 ~이 생기면 전개도가 될 수 없어요.’ 꼴로 써요."], ans: "접었을 때 서로 겹치는 면이 생기면 정육면체의 전개도가 될 수 없어요. 예를 들어 한 줄로 5개 이상 이어진 면이나 2칸×2칸으로 모인 면은 접으면 겹쳐요." }) },
    { name: "말해 보기 — 붙일 곳 찾기", inst: "건우: “상자를 접을 때 풀칠할 곳을 미리 알면 좋겠어.” 전개도를 접어서 정육면체를 만들었을 때 겹치는 점과 선분을 찾아보세요. 빨간 점(선분)과 겹치는 것을 눌러요.", hints: ["점선(접는 선)을 따라 이웃한 면을 접어 올린다고 생각해요.", "‘접어서 살펴보기’를 누르면 이름이 붙은 채로 접혀요."],
      render: thenWhy((b, a) => cb5NetPts(b, a, { F: CB5S_N5.F, P: CB5S_N5.P, k: 52, maxW: "22em", tasks: [{ pt: "ㄷ" }, { pt: "ㅊ" }, { seg: "ㄴㄷ" }, { seg: "ㄱㅎ" }],
        ok: "점 ㄷ은 점 ㅁ·점 ㅅ, 점 ㅊ은 점 ㅌ·점 ㅎ과 겹치고, 선분 ㄴㄷ은 선분 ㅅㅇ, 선분 ㄱㅎ은 선분 ㅊㅈ과 겹쳐요." }),
        { q: "겹치는 선분을 어떻게 찾았는지 써 볼까요?", ph: "접는 선을 따라 ~", help: ["① 빨간 선분이 붙은 면을 어느 접는 선을 따라 접는지 떠올려요. → ② 접었을 때 그 선분과 맞닿는 선분을 생각해요.", "‘접는 선을 따라 ~을 접어 올리면 ~과 맞닿아요.’ 꼴로 써요."], ans: "접는 선을 따라 이웃한 면을 접어 올리면 빨간 선분과 맞닿는 선분이 생겨요. 접는 선이 꺾이는 곳에서 가까운 선분끼리 차례로 짝지어 찾았어요." }) },
    { name: "확인하기 — 동생 선물 상자 그리기", inst: "1학년 동생들에게 줄 한 모서리 2 cm인 정육면체 상자의 전개도를 모눈종이에 그려 보세요. 점에서 대각선 쪽 점까지 끌면 면이 생겨요. (모눈 한 칸은 1 cm)", hints: ["면 6개를 겹치는 면 없이 그려요. 정사각형의 한 변은 2칸이에요.", "다 그리면 두 면이 맞닿은 선(접는 선)을 눌러 점선으로 바꿔요."],
      render: (b, a) => { let first = null; cb5Chain(b, a, [
        { title: "① 일부 그려진 전개도를 완성해 보세요.", run: (bx, ax) => { bx.append(h("div", { class: "cb5row" }, h("div", { style: "flex:0 1 9em" }, cb5Cub({ W: 2, H: 2, D: 2, k: 34, maxW: "8em", dims: [[0, 1, "2 cm"], [1, 3, "2 cm"], [3, 7, "2 cm"]] }))));
          cb5NetDraw(bx, ax, { cols: 13, rows: 9, k: 26, dims: [2, 2, 2], cube: true, given: [{ x: 1, y: 3, w: 2, h: 2 }, { x: 3, y: 3, w: 2, h: 2 }, { x: 5, y: 3, w: 2, h: 2 }], onNet: (F, key) => { first = key; }, msg: "정육면체 상자의 전개도를 완성했어요." }); } },
        { title: "② 이번에는 ①과 다른 모양으로 그려 보세요.", run: (bx, ax) => cb5NetDraw(bx, ax, { cols: 13, rows: 9, k: 26, dims: [2, 2, 2], cube: true, avoid: () => first, lines: false, msg: "다른 모양의 전개도도 그렸어요.",
          ask: [{ q: "그린 전개도가 옳은지 확인할 것을 모두 골라 보세요.", parts: [{ o: ["면이 6개예요.", "모든 모서리의 길이가 같아요.", "접었을 때 겹치는 면이 없어요.", "면의 크기가 모두 달라요."], multi: true, a: [0, 1, 2] }] }],
          ok: "면이 6개이고, 모든 모서리의 길이가 같고, 접었을 때 겹치는 면이 없으면 정육면체의 전개도예요." }) }]); } }
  ],
  challenge: { inst: "정육면체 상자의 전개도를 더 살펴봐요.", hints: ["점선을 따라 이웃한 면을 접어 올린다고 생각해요.", "면 하나를 붙였을 때 겹치는 면이 생기는지 살펴봐요."],
    render: (b, a) => cb5Chain(b, a, [
      { title: "① 전개도를 접어 정육면체를 만들었을 때 겹치는 점과 선분을 찾아보세요.", run: (bx, ax) => cb5NetPts(bx, ax, { F: CB5S_N5C.F, P: CB5S_N5C.P, k: 44, maxW: "18em", tasks: [{ pt: "ㄱ" }, { seg: "ㄹㅁ" }], ok: "점 ㄱ은 점 ㅈ·점 ㅍ과, 선분 ㄹㅁ은 선분 ㅅㅇ과 겹쳐요." }) },
      { title: "② 정사각형 1개를 더 붙여 정육면체의 전개도를 만들려고 해요. 붙일 수 있는 자리를 골라 보세요.", run: (bx, ax) => cb5AddFace(bx, ax, { F: CB5_SQ([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1]]),
        cands: [[1, 0, "㉠"], [2, 0, "㉡"], [4, 1, "㉢"], [2, 2, "㉣"], [3, 0, "㉤"]].map(([x, y, name]) => ({ x, y, w: 1, h: 1, name })), k: 46, maxW: "20em", msg: "㉣ 자리에 붙이면 접었을 때 겹치는 면이 없어요." }) }]) }
},
{
  id: "s6", no: 6, title: "직육면체 선물 상자를 펼쳐요 ― 직육면체의 전개도", soop: "개념 구축하기(O)",
  question: "직육면체 선물 상자를 펼치면 어떤 모양이 되고, 전개도는 어떻게 그릴까요?",
  summary: "직육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 직육면체의 전개도라고 해요. 직육면체의 전개도는 직사각형 6개로 이루어져 있어요. 접었을 때 마주 보는 두 면은 모양과 크기가 같고, 겹치는 모서리의 길이가 같아야 해요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선으로 그려요.",
  steps: [
    { name: "만져 보기 — 선물 상자 펼치기", inst: "장터에서 가장 인기 있을 선물 상자(가로 3 cm, 높이 2 cm, 깊이 4 cm)를 펼쳐 보았어요. 상자를 끝까지 펼쳐 보세요.", hints: ["막대를 ‘펼침’ 쪽 끝까지 끌어요.", "펼친 모양에서 모양과 크기가 같은 직사각형을 찾아봐요."],
      render: (b, a) => cb5FoldStep(b, a, { F: CB5S_GIFT, start: 1, goal: 0, msg: "선물 상자를 끝까지 펼쳤어요.",
        ask: [{ parts: ["펼친 모양은 ", { o: ["직사각형", "정사각형", "삼각형"], a: 0 }, " ", { n: 6 }, "개로 이루어져 있어요. 모양과 크기가 같은 직사각형이 ", { n: 2 }, "개씩 ", { n: 3 }, "쌍 있어요."] }],
        ok: "직육면체를 펼치면 직사각형 6개가 이어진 모양이 되고, 모양과 크기가 같은 직사각형이 2개씩 3쌍 있어요." }) },
    { name: "약속하기 — 직육면체의 전개도", inst: "직육면체의 전개도를 약속하고, 전개도에서 접었을 때 마주 보는 면을 찾아보세요.", hints: ["마주 보는 면은 접었을 때 서로 만나지 않는 면이에요.", "한 줄로 이어진 4개의 면에서는 한 면 건너 있는 면이 마주 보는 면이에요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["직육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 직육면체의 ", { o: ["전개도", "겨냥도"], a: 0 }, "라고 해요."], { ok: "직육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림이 직육면체의 전개도예요." }),
        { title: "전개도에서 접었을 때 마주 보는 면을 두 개씩 눌러 3쌍을 찾아보세요.", run: (bx, ax) => cb5NetPairs(bx, ax, { F: CB5S_GIFT, k: 30, maxW: "22em",
          ask: [{ parts: ["직육면체의 전개도를 접었을 때 마주 보는 두 면은 모양과 크기가 ", { o: ["같아요", "달라요"], a: 0 }, "."] }], ok: "마주 보는 두 면은 모양과 크기가 같아요." }) }]) },
    { name: "그려 보기 — 리본 상자 전개도 고르기", inst: "4 cm, 2 cm, 1 cm짜리 모서리로 이루어진 리본 상자의 전개도 후보예요. 직육면체의 전개도가 될 수 있는 것을 모두 골라 보세요. 모눈 한 칸은 1 cm예요.", hints: ["접었을 때 맞닿는 모서리의 길이가 같은지 살펴봐요.", "마주 보는 면의 모양과 크기가 같은지 살펴봐요."],
      render: thenWhy((b, a) => cb5NetJudge(b, a, { nets: CB5S_L6J, want: "can", k: 16, grid: true, solid: "직육면체", cardW: "12em",
        ask: [{ q: "나와 라가 직육면체의 전개도가 될 수 없는 까닭을 각각 골라 보세요.", parts: ["나: ", { o: ["접었을 때 맞닿는 모서리의 길이가 달라요.", "접었을 때 겹치는 면이 있어요."], a: 0 }, h("br"), "라: ", { o: ["접었을 때 맞닿는 모서리의 길이가 달라요.", "접었을 때 겹치는 면이 있어요."], a: 1 }] }],
        ok: "가와 다는 직육면체의 전개도예요. 나는 맞닿는 모서리의 길이가 다르고, 라는 접었을 때 겹치는 면이 있어요." }),
        { q: "나의 위쪽 면을 어떻게 고치면 전개도가 될까요?", ph: "위쪽 면을 ~", help: ["① 나의 위쪽 면과 맞닿는 면의 모서리 길이를 모눈으로 세어 봐요. → ② 마주 보는 아래쪽 면과 견주어 봐요.", "‘위쪽 면을 ~ cm × ~ cm인 직사각형으로 바꾸면 ~ 면과 모양과 크기가 같아져요.’ 꼴로 써요."], ans: "위쪽 면을 가로 2 cm, 세로 1 cm인 직사각형으로 바꾸면 마주 보는 아래쪽 면과 모양과 크기가 같아지고, 맞닿는 모서리의 길이도 같아져요." }) },
    { name: "말해 보기 — 붙일 곳 찾기", inst: "선물 상자 전개도를 접어서 직육면체를 만들었을 때 겹치는 점과 선분을 찾아보세요.", hints: ["점선을 따라 접어 올린다고 생각해요.", "‘접어서 살펴보기’를 누르면 이름이 붙은 채로 접혀요."],
      render: (b, a) => cb5NetPts(b, a, { F: CB5S_N6.F, P: CB5S_N6.P, k: 30, maxW: "26em", tasks: [{ pt: "ㅂ" }, { pt: "ㄴ" }, { seg: "ㅍㅌ" }, { seg: "ㅌㅋ" }],
        ok: "점 ㅂ은 점 ㅇ·점 ㅌ, 점 ㄴ은 점 ㄹ과 겹치고, 선분 ㅍㅌ은 선분 ㅁㅂ, 선분 ㅌㅋ은 선분 ㅈㅇ과 겹쳐요." }) },
    { name: "확인하기 — 카드 상자 전개도 그리기", inst: "가로 6 cm, 높이 2 cm, 깊이 3 cm인 카드 상자의 전개도를 완성해 보세요. 점에서 대각선 쪽 점까지 끌면 면이 생겨요. (모눈 한 칸은 1 cm)", hints: ["6 cm × 2 cm, 3 cm × 2 cm, 6 cm × 3 cm인 면이 2개씩 있어요.", "접었을 때 겹치는 모서리의 길이가 같은지 확인해요. 다 그리면 접는 선을 눌러 점선으로 바꿔요."],
      render: (b, a) => { b.append(cb5Cub({ W: 6, H: 2, D: 3, k: 22, maxW: "13em", dims: [[0, 1, "6 cm"], [1, 3, "2 cm"], [3, 7, "3 cm"]] }));
        cb5NetDraw(b, a, { cols: 20, rows: 10, k: 22, dims: [6, 2, 3], given: [{ x: 4, y: 4, w: 6, h: 2 }, { x: 4, y: 1, w: 6, h: 3 }],
          msg: "카드 상자의 전개도를 완성했어요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선이에요." }); } }
  ],
  challenge: { inst: "직육면체 상자의 전개도를 더 살펴봐요.", hints: ["접었을 때 맞닿는 선분의 길이는 같아요.", "마주 보는 면은 모양과 크기가 같아요."],
    render: (b, a) => cb5Chain(b, a, [
      { title: "① 직육면체의 겨냥도를 보고 전개도의 ㉠, ㉡, ㉢에 알맞은 수를 써 보세요.", run: (bx, ax) => {
        const F = cb5NetFromCells(CB5_CROSS, { 1: 6, 2: 5, 4: 3 });   // 가로 6·3·6·3, 높이 5, 위아래 3 × 6
        cb5Ask(bx, ax, [{ fig: () => h("div", { class: "cb5row" }, h("div", { style: "flex:0 1 12em" }, cb5Cub({ W: 6, H: 5, D: 3, k: 16, pad: 50, dimD: 30, dimSize: 18, maxW: "12em", dims: [[0, 1, "6 cm"], [1, 3, "5 cm"], [3, 7, "3 cm"]] })),
            h("div", {}, cb5NetSvg(F, { k: 12, maxW: "22em", extra: (s, m) => { const L = (p, q, t, dx, dy) => { const A = m(p), B = m(q); s.append(txt((A[0] + B[0]) / 2 + dx, (A[1] + B[1]) / 2 + dy, t, 15, { fill: CB5.red })); };
              L([0, 6], [0, 11], "㉠", -12, 0); L([6, 0], [9, 0], "㉡", 0, -11); L([6, 11], [6, 17], "㉢", -12, 0); } }).svg)),
          parts: ["㉠ ", { n: 5 }, " cm, ㉡ ", { n: 3 }, " cm, ㉢ ", { n: 6 }, " cm"] }], { ok: "㉠ 5 cm, ㉡ 3 cm, ㉢ 6 cm예요. 접었을 때 맞닿는 선분의 길이를 겨냥도의 모서리와 견주었어요." }); } },
      { title: "② 직육면체의 전개도가 될 수 있는 것을 골라 보세요.", run: (bx, ax) => cb5NetJudge(bx, ax, { k: 16, grid: true, solid: "직육면체", cardW: "12em", nets: [
          { name: "첫째", F: cb5NetFromCells(CB5S_STAIR, { 1: 2, 2: 1, 4: 3 }) },
          { name: "둘째", F: [{ x: 0, y: 1, w: 1, h: 3 }, { x: 1, y: 1, w: 2, h: 3 }, { x: 3, y: 1, w: 1, h: 3 }, { x: 4, y: 1, w: 2, h: 3 }, { x: 1, y: 0, w: 2, h: 1 }, { x: 1, y: 4, w: 2, h: 2 }] }],
        ok: "첫째만 직육면체의 전개도예요. 둘째는 아래쪽 면이 위쪽 면과 크기가 달라서 접었을 때 맞닿는 모서리의 길이가 달라요." }) }]) }
},
{
  id: "s7", no: 7, title: "공방 마스코트 상자봇을 만들어요", soop: "탐구 정리하기(O)",
  question: "직육면체와 정육면체의 전개도를 이용해 상자봇을 만들려면 어떻게 해야 할까요?",
  summary: "상자봇의 머리와 팔은 직육면체, 몸통과 다리는 정육면체 모양이에요. 전개도를 완성할 때는 면이 6개인지, 접었을 때 겹치는 면이 없는지, 겹치는 선분의 길이가 같은지 확인해요. 새로 그린 면에서 다른 면과 맞닿아 잘리지 않는 모서리는 점선으로 나타내요.",
  steps: [
    { name: "만져 보기 — 상자봇 설계도", inst: "장터 입구에 세울 공방 마스코트 ‘상자봇’을 상자로 만들기로 했어요. 민호가 그린 설계도를 보고 각 부분의 모양을 알아보세요. (머리: 가로 3 cm, 높이 2 cm, 깊이 2 cm / 몸통: 한 모서리 3 cm / 팔: 가로 1 cm, 높이 2 cm, 깊이 1 cm / 다리: 한 모서리 1 cm)", hints: ["정사각형 6개로 둘러싸인 부분은 정육면체예요.", "정사각형이 아닌 직사각형이 있으면 직육면체예요."],
      render: (b, a) => cb5Ask(b, a, [{ fig: cb5sBotFig, parts: ["머리: ", { o: ["정육면체", "직육면체"], a: 1 }, "  몸통: ", { o: ["정육면체", "직육면체"], a: 0 }, h("br"), "팔: ", { o: ["정육면체", "직육면체"], a: 1 }, "  다리: ", { o: ["정육면체", "직육면체"], a: 0 }] }],
        { ok: "머리와 팔은 직육면체, 몸통과 다리는 정육면체 모양이에요." }) },
    { name: "말해 보기 — 전개도를 그릴 때 생각할 점", inst: "서아: “각 부분의 전개도를 그릴 때 무엇을 생각해야 할까?” 생각할 점을 모두 골라 보세요.", hints: ["정육면체와 직육면체의 면은 몇 개인지 떠올려요.", "접었을 때 맞닿는 선분을 생각해요."],
      render: thenWhy((b, a) => cb5Ask(b, a, [{ q: "전개도를 그릴 때 생각할 점을 모두 골라 보세요.", parts: [{ o: ["면을 6개 그려요.", "접었을 때 겹치는 면이 없도록 그려요.", "접었을 때 겹치는 선분의 길이가 같도록 그려요.", "모든 면을 서로 다른 크기로 그려요."], multi: true, a: [0, 1, 2], why: { "0,1,3": "마주 보는 면은 모양과 크기가 같아요. 모든 면을 다른 크기로 그리면 안 돼요.", "0,2,3": "마주 보는 면은 모양과 크기가 같아요. 모든 면을 다른 크기로 그리면 안 돼요.", "1,2,3": "마주 보는 면은 모양과 크기가 같아요. 모든 면을 다른 크기로 그리면 안 돼요." } }] }],
        { ok: "면 6개, 겹치는 면이 없도록, 겹치는 선분의 길이가 같도록 그려요." }),
        { q: "접었을 때 겹치는 선분의 길이가 같아야 하는 까닭을 써 볼까요?", ph: "길이가 다르면 ~", help: ["① 두 면을 붙일 때 맞닿는 선분이 어떻게 만나는지 떠올려요. → ② 길이가 다르면 어떤 일이 생기는지 생각해요.", "‘길이가 다르면 두 선분이 ~ 붙지 않아서 ~이 생겨요.’ 꼴로 써요."], ans: "길이가 다르면 두 선분이 꼭 맞게 붙지 않아서 빈틈이 생기거나 종이가 남아 상자 모양이 만들어지지 않아요." }) },
    { name: "그려 보기 — 머리와 몸통 전개도 완성하기", inst: "머리와 몸통의 전개도에는 면이 5개만 있어요. 전개도가 되도록 면 1개를 붙일 자리를 골라 색칠하고, 색칠한 면에서 잘리지 않는 모서리를 눌러 점선으로 바꿔 보세요.", hints: ["후보 자리를 하나씩 머릿속으로 접어 봐요.", "색칠한 면에서 다른 면과 맞닿은 모서리가 잘리지 않는 모서리예요."],
      render: (b, a) => cb5Chain(b, a, [
        { title: "머리(가로 3 cm, 높이 2 cm, 깊이 2 cm인 직육면체)", run: (bx, ax) => cb5AddFace(bx, ax, Object.assign({ k: 24, grid: true, dash: true, maxW: "22em", color: "#FFD27A", msg: "머리의 전개도를 완성했어요." }, CB5S_PARTS.head)) },
        { title: "몸통(한 모서리 3 cm인 정육면체)", run: (bx, ax) => cb5AddFace(bx, ax, Object.assign({ k: 20, grid: true, dash: true, maxW: "20em", color: "#9CC3F0", msg: "몸통의 전개도를 완성했어요." }, CB5S_PARTS.body)) }]) },
    { name: "약속하기 — 팔과 다리 전개도 완성하기", inst: "팔과 다리의 전개도도 면 1개를 붙일 자리를 골라 색칠하고, 색칠한 면의 잘리지 않는 모서리를 점선으로 바꿔 보세요.", hints: ["면 6개가 모두 있고 겹치는 면이 없어야 해요.", "한 줄로 5개가 이어지면 접었을 때 겹쳐요."],
      render: (b, a) => cb5Chain(b, a, [
        { title: "팔(가로 1 cm, 높이 2 cm, 깊이 1 cm인 직육면체)", run: (bx, ax) => cb5AddFace(bx, ax, Object.assign({ k: 34, grid: true, dash: true, maxW: "16em", color: "#A9DDB8", msg: "팔의 전개도를 완성했어요." }, CB5S_PARTS.arm)) },
        { title: "다리(한 모서리 1 cm인 정육면체)", run: (bx, ax) => cb5AddFace(bx, ax, Object.assign({ k: 40, grid: true, dash: true, maxW: "16em", color: "#F6B38E", msg: "다리의 전개도를 완성했어요." }, CB5S_PARTS.leg)) }]) },
    { name: "확인하기 — 상자봇 조립하기", inst: "접어서 만든 부분을 끌어 설계도의 알맞은 자리에 붙여 상자봇을 완성해 보세요.", hints: ["설계도의 점선 자리와 크기가 같은 부분을 찾아요.", "팔과 다리는 2개씩 있어요."],
      render: (b, a) => cb5Robot(b, a, { cols: 16, rows: 9, k: 26, planX: 4,
        items: [Object.assign({ tx: 9, ty: 1 }, CB5S_BOT.head), Object.assign({ tx: 12.5, ty: 1 }, CB5S_BOT.body), Object.assign({ tx: 9, ty: 5 }, CB5S_BOT.arm), Object.assign({ tx: 10.6, ty: 5 }, CB5S_BOT.arm),
          Object.assign({ tx: 12.6, ty: 6.5 }, CB5S_BOT.leg), Object.assign({ tx: 14.2, ty: 6.5 }, CB5S_BOT.leg)],
        slots: CB5S_BOT_SLOTS,
        then: (bx, ax) => writeStep(bx, ax, [{ q: "상자봇을 만든 과정을 친구에게 설명하듯 써 보세요.", tag: "만든 과정", ph: "먼저 ~, 그다음 ~", help: ["① 각 부분의 모양(직육면체·정육면체)을 알아본 일 → ② 전개도를 완성하고 확인한 일 → ③ 접어서 붙인 일 차례로 써요.", "‘먼저 ~을 알아보고, ~이 되도록 면을 붙여 전개도를 완성한 다음, ~을 따라 접어 설계도대로 붙였어요.’ 꼴로 써요."], ans: "먼저 머리와 팔은 직육면체, 몸통과 다리는 정육면체라는 것을 알아봤어요. 면 6개가 겹치지 않고 맞닿는 선분의 길이가 같도록 면을 붙여 전개도를 완성한 다음, 점선을 따라 접어 설계도대로 붙였어요." }], { ok: "전개도로 상자봇을 완성하고 과정을 설명했어요." }) }) }
  ],
  challenge: { inst: "상자봇의 머리(가로 3 cm, 높이 2 cm, 깊이 2 cm인 직육면체)를 하나 더 만들려고 해요. 머리의 전개도가 될 수 있는 것을 모두 골라 보세요.", hints: ["3 cm × 2 cm인 면 4개와 2 cm × 2 cm인 면 2개가 있어야 해요.", "‘접어 보기’로 확인할 수 있어요."],
    render: (b, a) => cb5NetJudge(b, a, { k: 16, grid: true, solid: "직육면체", cardW: "11em", nets: [
      { name: "가", F: cb5NetFromCells(CB5_CROSS, { 1: 3, 2: 2, 4: 2 }) },
      { name: "나", F: [{ x: 0, y: 2, w: 3, h: 2 }, { x: 3, y: 2, w: 2, h: 2 }, { x: 5, y: 2, w: 3, h: 2 }, { x: 8, y: 2, w: 2, h: 2 }, { x: 3, y: 0, w: 2, h: 2 }, { x: 3, y: 4, w: 2, h: 3 }] },
      { name: "다", F: cb5NetFromCells(CB5S_STAIR, { 1: 2, 2: 3, 4: 2 }) },
      { name: "라", F: [{ x: 0, y: 2, w: 3, h: 2 }, { x: 3, y: 2, w: 2, h: 2 }, { x: 5, y: 2, w: 3, h: 2 }, { x: 8, y: 2, w: 2, h: 2 }, { x: 3, y: 0, w: 2, h: 2 }, { x: 8, y: 0, w: 2, h: 2 }] }],
      ok: "가와 다는 머리의 전개도예요. 나는 맞닿는 모서리의 길이가 다르고, 라는 접었을 때 겹치는 면이 있어요." }) }
},
{
  id: "s8", no: 8, title: "같은 상자 카드를 모아요", soop: "발표하기(P)",
  question: "같은 상자의 겨냥도와 전개도 카드를 어떻게 하면 빨리 모을 수 있을까요?",
  summary: "같은 상자 카드는 겨냥도 1장과 전개도 2장이에요. 전개도의 모눈 칸을 세어 면의 가로와 세로를 겨냥도의 모서리 길이와 견주면 같은 상자를 찾을 수 있어요. 필요 없는 카드를 잘 골라 넘기는 것이 이기는 방법이에요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알기", inst: "장터가 끝나고 공방 친구들이 ‘같은 상자 카드 모으기’ 놀이를 해요. 건우가 놀이 방법을 섞어 놓았어요. 순서대로 눌러 보세요.", hints: ["카드를 먼저 나누어 가져요.", "같은 상자 3장을 모은 사람이 없으면 한 장씩 넘겨요."],
      render: (b, a) => sequence(b, a, ["③ 모은 사람이 없으면 다 같이 ‘넘겨’를 외치며 한 장을 시계 방향으로 옆 사람에게 넘겨요.", "① 카드를 섞어 한 명에게 3장씩 나누어 줘요.", "④ 같은 상자 카드 3장을 모은 사람은 카드를 보여 줘요. 10판을 해서 옳게 모은 횟수가 가장 많은 사람이 이겨요.", "② 내 카드 3장이 같은 상자를 나타내는지 살펴봐요."], [1, 3, 0, 2],
        { ok: "카드 나누기 → 살펴보기 → 넘기기 → 보여 주기 순서로 해요." }) },
    { name: "그려 보기 — 카드 나누기", inst: "놀이 카드 12장을 살펴봐요. 전개도 카드를 하나씩 눌러 같은 상자의 겨냥도 카드에 놓아 보세요. (모눈 한 칸은 1 cm)", hints: ["전개도의 모눈 칸을 세어 면의 가로와 세로를 알아봐요.", "겨냥도의 모서리 길이로 만들 수 있는 면인지 견주어요."],
      render: (b, a) => cb5CardSort(b, a, { ok: "겨냥도 1장과 전개도 2장씩, 같은 상자 카드 3장이 한 묶음이에요." }) },
    { name: "말해 보기 — 컴퓨터 친구와 놀이하기", inst: "컴퓨터 친구 3명과 놀이해요. 넘길 카드를 한 장 고르고 ‘넘겨!’를 눌러요. 같은 상자 카드 3장을 모으면 ‘모았어요!’를 눌러요.", hints: ["어느 상자를 모을지 정하고, 그 상자가 아닌 카드를 넘겨요.", "겨냥도 카드가 2장이면 그중 하나는 꼭 넘겨야 해요."],
      render: (b, a) => cb5PassGame(b, a, {}) },
    { name: "약속하기 — 전개도 짝 맞추기", inst: "전개도 카드 8장을 뒤집어 놓았어요. 두 장씩 펼쳐서 같은 상자의 전개도이면 가져가요. 짝을 모두 찾아보세요.", hints: ["펼쳤던 카드의 자리와 모양을 기억해요.", "면의 크기를 견주면 같은 상자인지 알 수 있어요."],
      render: (b, a) => cb5Memory(b, a, {}) },
    { name: "확인하기 — 놀이 돌아보기", inst: "놀이를 돌아보며 생각을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 이기려면 어떻게 하면 좋을까요?", tag: "이기는 방법", ph: "모을 상자를 ~", help: ["① 내 카드 3장 중 같은 상자 카드가 몇 장인지 먼저 살펴요. → ② 어떤 카드를 넘기면 좋을지 생각해요.", "‘모을 상자를 정하고, 그 상자가 아닌 카드를 ~해요.’ 꼴로 써요."], ans: "모을 상자를 정하고, 그 상자가 아닌 카드를 먼저 넘겨요. 겨냥도 카드가 2장이면 하나를 넘겨요." },
        { q: "같은 상자의 전개도인지 어떻게 알 수 있었나요?", tag: "알아본 방법", ph: "모눈 칸을 세어 ~", help: ["① 전개도에서 면의 가로와 세로를 모눈 칸으로 세어요. → ② 겨냥도의 모서리 길이와 견주어요.", "‘모눈 칸을 세어 면의 ~를 알아보고, 겨냥도의 ~와 같은지 보았어요.’ 꼴로 써요."], ans: "모눈 칸을 세어 면의 가로와 세로를 알아보고, 겨냥도의 모서리 길이와 같은지 보았어요. 마주 보는 면의 크기가 같은지도 살폈어요." }]) }
  ],
  challenge: { inst: "상자 라(가로 3 cm, 높이 3 cm, 깊이 1 cm인 직육면체)의 전개도 카드를 모두 골라 보세요.", hints: ["3 cm × 3 cm인 면 2개와 3 cm × 1 cm인 면 4개가 있어야 해요.", "모눈 칸을 세어 봐요."],
    render: (b, a) => { const nets = cb5Deck().filter(c => c.kind === "net"), pick = [nets[6], nets[2], nets[1], nets[7], nets[4]];
      cb5Pick(b, a, { cardW: "8.5em", items: pick.map((c, i) => ({ name: "①②③④⑤"[i], fig: () => cb5CardFig(c) })), a: pick.map((c, i) => c.shape === 3 ? i : -1).filter(i => i >= 0),
        whyExtra: () => "고른 카드 중에 다른 상자의 전개도가 있어요. 면의 크기를 세어 봐요.", ok: "가로 3 cm, 높이 3 cm, 깊이 1 cm인 상자 라의 전개도를 모두 찾았어요." }); } }
},
{
  id: "s9", no: 9, title: "선물 상자 공방 발표회", soop: "발표하기(P)",
  question: "직육면체와 정육면체, 겨냥도와 전개도에 대해 무엇을 알게 되었나요?",
  summary: "직사각형 6개로 둘러싸인 도형은 직육면체, 정사각형 6개로 둘러싸인 도형은 정육면체예요. 직육면체에서 서로 평행한 면은 3쌍이고, 밑면과 옆면은 수직으로 만나요. 겨냥도에서는 보이는 모서리를 실선, 보이지 않는 모서리를 점선으로 그리고, 전개도에서는 잘린 모서리를 실선, 잘리지 않은 모서리를 점선으로 그려요.",
  steps: [
    { name: "만져 보기 — 공방 용어 퀴즈", inst: "공방 발표회에서 친구들이 낸 문제예요. 도형의 이름과 각 부분의 이름을 알아보세요.", hints: ["직사각형 6개 → 직육면체, 정사각형 6개 → 정육면체", "면, 모서리, 꼭짓점을 떠올려요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["직사각형 6개로 둘러싸인 도형을 ", { o: ["직육면체", "정육면체"], a: 0 }, "라고 하고, 정사각형 6개로 둘러싸인 도형을 ", { o: ["직육면체", "정육면체"], a: 1 }, "라고 해요."], { ok: "직육면체와 정육면체예요." }),
        (bx, ax) => cb5Ask(bx, ax, [{ q: "직육면체에서 ①, ②, ③이 가리키는 곳의 이름을 골라 보세요.", fig: () => cb5sPartsFig([{ t: "③" }, { i: 1, t: "①" }, { t: "②" }]),
          parts: ["① ", { o: ["면", "모서리", "꼭짓점"], a: 2 }, "  ② ", { o: ["면", "모서리", "꼭짓점"], a: 1 }, "  ③ ", { o: ["면", "모서리", "꼭짓점"], a: 0 }] }], { ok: "① 꼭짓점, ② 모서리, ③ 면이에요." })]) },
    { name: "그려 보기 — 평행한 면과 수직인 면", inst: "서아가 진열대 상자의 아랫면 ㅁㅂㅅㅇ을 색칠했어요. 색칠한 면과 평행한 면, 수직인 면을 찾아보세요.", hints: ["평행한 면은 마주 보는 면이에요.", "수직인 면은 색칠한 면과 만나는 면 4개예요."],
      render: (b, a) => cb5Chain(b, a, [
        { title: "① 색칠한 면과 평행한 면을 눌러 보세요.", run: (bx, ax) => cb5FacePick(bx, ax, { dims: [4, 3, 3], pitch: -24, base: 4, need: [5], baseText: "색칠한 면", whyExtra: () => "그 면은 색칠한 면과 만나요. 평행한 면은 마주 보는 면이에요.", ok: "색칠한 면과 평행한 면은 면 ㄱㄴㄷㄹ이에요." }) },
        { title: "② 색칠한 면과 수직인 면을 모두 써 보세요.", run: (bx, ax) => { const S = cb5Solid({ dims: [4, 3, 3], lab: true, fill: f => f === 4 ? CB5.par : null }); bx.append(S.svg, S.tools);
          cb5FaceAsk(bx, ax, [{ q: "색칠한 면 ㅁㅂㅅㅇ과 수직인 면", ans: [0, 1, 2, 3], why: "색칠한 면과 만나는 면 4개를 써요. 마주 보는 면 ㄱㄴㄷㄹ은 평행한 면이에요." }],
            { ok: "수직인 면은 면 ㄴㅂㅅㄷ, 면 ㄱㅁㅇㄹ, 면 ㄱㄴㅂㅁ, 면 ㄷㅅㅇㄹ이에요." }); } }]) },
    { name: "말해 보기 — 발표용 전개도 그리기", inst: "발표회에서 보여 줄 가로 3 cm, 높이 2 cm, 깊이 4 cm인 상자의 전개도를 모눈종이에 그려 보세요. (모눈 한 칸은 1 cm)", hints: ["3 cm × 2 cm, 4 cm × 2 cm, 3 cm × 4 cm인 면이 2개씩 있어요.", "다 그리면 접는 선을 눌러 점선으로 바꿔요."],
      render: (b, a) => { b.append(cb5Cub({ W: 3, H: 2, D: 4, k: 24, maxW: "11em", dims: [[0, 1, "3 cm"], [1, 3, "2 cm"], [3, 7, "4 cm"]] }));
        cb5NetDraw(b, a, { cols: 17, rows: 12, k: 22, dims: [3, 2, 4], msg: "상자의 전개도를 그렸어요. 면 6개, 겹치는 면 없음, 맞닿는 모서리 길이가 같음, 실선·점선 구분까지 확인했어요." }); } },
    { name: "약속하기 — 친구들의 말과 그림 고치기", inst: "발표회에서 친구들이 한 말을 살펴보고, 건우가 잘못 그린 카탈로그 그림을 고쳐 보세요.", hints: ["한 면과 평행한 면은 1개, 서로 평행한 면은 3쌍이에요.", "보이지 않는 모서리는 점선이에요."],
      render: (b, a) => cb5Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "직육면체에 대해 옳게 말한 사람을 모두 골라 보세요.", o: ["서아: 한 모서리에서 만나는 두 면은 서로 수직이야.", "민호: 서로 평행한 면은 모두 2쌍이야.", "유나: 겨냥도에서 보이지 않는 모서리는 3개야.", "건우: 정육면체의 전개도에는 정사각형이 5개 있어."], a: [0, 2],
          why: { "0,1": "민호의 말을 다시 살펴봐요. 서로 평행한 면은 3쌍이에요.", "1,2": "민호의 말을 다시 살펴봐요. 서로 평행한 면은 3쌍이에요.", "0,3": "건우의 말을 다시 살펴봐요. 정육면체의 면은 6개라서 전개도에도 정사각형이 6개 있어요.", "2,3": "건우의 말을 다시 살펴봐요. 정육면체의 면은 6개라서 전개도에도 정사각형이 6개 있어요.", "1,3": "민호와 건우의 말을 다시 살펴봐요." } }],
          { ok: "서아와 유나가 옳게 말했어요. 서로 평행한 면은 3쌍이고, 정육면체의 전개도에는 정사각형이 6개 있어요." }),
        { title: "건우가 잘못 그린 겨냥도예요. 선을 눌러 옳게 고쳐 보세요(누를 때마다 실선 ↔ 점선).", run: (bx, ax) => cb5Sketch(bx, ax, { W: 5, H: 2, dx: 2, dy: 1, cols: 9, rows: 5, ox: 1, oy: 1, mode: "fix",
          ask: [{ q: "건우가 잘못 그린 까닭을 골라 보세요.", parts: [{ o: ["보이지 않는 모서리까지 모두 실선으로 그렸어요.", "모서리를 12개보다 많이 그렸어요.", "평행한 모서리를 평행하지 않게 그렸어요."], a: 0 }] }],
          ok: "보이는 모서리는 실선, 보이지 않는 모서리는 점선으로 나타내야 하는데 모든 모서리를 실선으로 그렸어요. 보이지 않는 모서리 3개를 점선으로 고쳤어요." }) }]) },
    { name: "확인하기 — 공방을 마치며", inst: "단원에서 배운 내용을 정리하고, 1차시에 궁금했던 것을 해결했는지 돌아보세요.", hints: ["직사각형 6개, 정사각형 6개로 둘러싸인 도형을 떠올려요.", "밑면과 옆면이 만나는 모양을 떠올려요."],
      render: wonderRecall((b, a) => cb5Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["직사각형 6개로 둘러싸인 도형은 ", { o: ["직육면체", "정육면체"], a: 0 }, ", 정사각형 6개로 둘러싸인 도형은 ", { o: ["직육면체", "정육면체"], a: 1 }, "예요. 직육면체에서 밑면과 옆면은 ", { o: ["수직", "평행"], a: 0 },
          "으로 만나요. 직육면체 모양을 잘 알 수 있도록 나타낸 그림은 ", { o: ["겨냥도", "전개도"], a: 0 }, ", 정육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림은 정육면체의 ", { o: ["겨냥도", "전개도"], a: 1 }, "예요."], { ok: "직육면체, 정육면체, 수직, 겨냥도, 전개도를 정리했어요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "1차시에 궁금했던 것 하나를 골라, 이제 어떻게 답할 수 있는지 써 보세요.", tag: "궁금했던 것 해결", ph: "궁금했던 것: ~ / 지금 내 답: ~", help: ["① 위의 ‘궁금했던 것’ 중 하나를 골라요. → ② 이 단원에서 배운 낱말(겨냥도, 전개도, 평행, 수직 등)을 넣어 답해요.", "‘궁금했던 것: ~ / 지금 내 답: ~을 그리면 돼요. 왜냐하면 ~이기 때문이에요.’ 꼴로 써요."], ans: "궁금했던 것: 상자를 종이 한 장으로 만들려면 어떻게 그려야 할까? / 지금 내 답: 모서리를 잘라 펼친 전개도를 그리면 돼요. 면 6개가 겹치지 않고 맞닿는 모서리의 길이가 같게 그린 뒤 점선을 따라 접어요." }])])) }
  ],
  challenge: { inst: "단원 종합 문제예요. 정육면체의 전개도가 될 수 있는 것을 모두 골라 보세요.", hints: ["머릿속으로 접어 보고, ‘접어 보기’로 확인해요.", "접었을 때 겹치는 면이 있으면 전개도가 될 수 없어요."],
    render: (b, a) => cb5NetJudge(b, a, { k: 18, cardW: "9em", nets: [
      { name: "가", F: CB5_SQ([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]]) },
      { name: "나", F: CB5_SQ([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2], [2, 2]]) },
      { name: "다", F: CB5_SQ([[0, 0], [0, 1], [1, 1], [2, 1], [2, 2], [3, 2]]) },
      { name: "라", F: CB5_SQ([[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]) },
      { name: "마", F: CB5_SQ([[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 0]]) },
      { name: "바", F: CB5_SQ([[0, 0], [1, 0], [1, 1], [1, 2], [2, 2], [2, 3]]) }],
      ok: "가, 다, 바는 정육면체의 전개도예요. 나, 라, 마는 접었을 때 겹치는 면이 있어요." }) }
}
];
