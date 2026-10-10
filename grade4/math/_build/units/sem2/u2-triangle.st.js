//@@APP
const APP={title:"우리 반 텐트 캠프", unit:"4-2 수학 2. 삼각형", key:"s42-triangle-v1", welcome:"우리 반 텐트 캠프에 온 것을 환영해요", intro:"4학년 3반이 학교 운동장에서 하룻밤 텐트 캠프를 준비해요. 텐트 뼈대, 깃발 가랜드, 지붕 트러스의 삼각형을 재고, 접고, 그리고, 변의 길이와 각의 크기에 따라 나누어 봐요."};
//@@UNIT
/* =========================================================
   4-2 2. 삼각형 — 단원 조작 부품 (앞글자 t2) · 이야기 버전: 확인하기 단추 없이 autoRun으로 저절로 확인
   삼각형은 cm 단위 좌표(수학 방향, y 위쪽)로 만들고, 그릴 때 화면 좌표(y 아래)로 바꿉니다.
   변 i = 꼭짓점 i → i+1, 각 i = 꼭짓점 i의 각. 이름(이등변·정·예각·직각·둔각)은 모두 좌표에서 계산합니다.
   ========================================================= */
(function () {
  const s = document.createElement("style"); s.id = "t2-style";
  s.textContent = `
.t2fig{margin:.3em 0}
.t2fig svg{width:100%;height:auto;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:12px}
.t2row{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-start}
.t2row>.t2fig{flex:1 1 15em;min-width:0}
.t2pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:5em;padding:.45em;margin:.4em 0;border:2px dashed var(--line);border-radius:12px;background:#FBFCFB}
.t2bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(11em,1fr));gap:.55em}
.t2bin{border:2px dashed var(--line);border-radius:12px;padding:.4em;min-height:7em;background:#fff;min-width:0;display:flex;flex-wrap:wrap;gap:.35em;align-content:flex-start;cursor:pointer}
.t2bint{flex:1 1 100%;font-family:"Jua";color:var(--night);word-break:keep-all}
.t2tbl{display:grid;grid-template-columns:minmax(5.5em,.75fr) repeat(3,minmax(0,1fr));gap:.35em;margin:.3em 0}
.t2tbl .t2th{font-family:"Jua";color:var(--night);background:#F2F5F4;border-radius:10px;padding:.35em .4em;word-break:keep-all;text-align:center;display:flex;align-items:center;justify-content:center;min-width:0}
.t2tbl .t2bin{min-height:6.5em}
.t2card{border:2px solid var(--line);background:#fff;border-radius:.7em;padding:.2em;width:8.6em;max-width:100%;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}
.t2card svg{width:100%;height:auto;display:block}
.t2card.t2txt{width:auto;padding:.35em .7em;font-family:"Jua"}
.t2card .t2cl{font-family:"Jua";text-align:center;color:var(--night)}
.t2card.t2sel{border-color:var(--ring);background:var(--ring-soft)}
.t2card.t2good{border-color:var(--ok);background:#E3F4EA}
.t2card.t2bad{border-color:var(--no);background:#FBE7E2}
.t2tbl .t2card{width:7.2em}
.t2ghost{position:fixed;z-index:60;pointer-events:none;opacity:.88;box-shadow:0 8px 20px rgba(0,0,0,.18)}
.t2names{display:flex;flex-wrap:wrap;gap:.35em;margin:.3em 0}
.t2names button{border:2px solid var(--line);background:#fff;border-radius:999px;padding:.25em .8em;word-break:keep-all}
.t2names button.t2on{background:var(--night);color:#fff;border-color:var(--night)}
.t2names button.t2good{border-color:var(--ok)}
.t2names button.t2bad{border-color:var(--no)}
.t2item{border-bottom:1px dashed var(--line);padding:.5em 0;display:grid;grid-template-columns:minmax(0,15em) minmax(0,1fr);gap:.7em;align-items:center}
.t2item:last-child{border-bottom:0}
.t2item .t2fig{margin:0}
@media (max-width:640px){.t2item{grid-template-columns:1fr}}
.t2big{font-family:"Jua";font-size:var(--fs-l);color:var(--night)}
.t2stmt{padding:.45em .7em;border-radius:.7em;border:2px solid var(--line);background:#fff;margin:.3em 0;word-break:keep-all}
.t2hand{display:inline-grid;place-items:center;min-width:2.2em;height:2.2em;border-radius:.5em;background:var(--night);color:#fff;font-family:"Jua";font-size:1.3em}
`;
  document.head.append(s);
})();
const T2_KO = ["가", "나", "다", "라", "마", "바", "사", "아"];
const T2_GREEN = "#24965A", T2_RED = "#D2463A", T2_GRAY = "#8795A1", T2_LINE = "#C9D4CF", T2_SKY = "#2B7BD6";
const T2_FILL = "#FFF3E2";
const t2F = v => Math.round(v * 100) / 100;
const t2Rad = d => d * Math.PI / 180;
const t2N = d => ((d % 360) + 360) % 360;
const t2Dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const t2Pt = (V, deg, r) => [V[0] + r * Math.cos(t2Rad(deg)), V[1] - r * Math.sin(t2Rad(deg))];
const t2Dir = (V, P) => t2N(Math.atan2(-(P[1] - V[1]), P[0] - V[0]) * 180 / Math.PI);
const t2Pts = P => P.map(p => `${t2F(p[0])},${t2F(p[1])}`).join(" ");
/* 받침 따라 조사: t2J("70°","이","가") */
function t2J(s, withB, noB) {
  s = String(s).trim(); const c = s[s.length - 1];
  if (c === "°") return noB;
  if (/[0-9]/.test(c)) return "013678".includes(c) ? withB : noB;
  if (c === "m") return withB; // cm, mm(센티미터·밀리미터)
  const k = c.charCodeAt(0) - 0xAC00; if (k < 0 || k > 11171) return withB;
  return k % 28 ? withB : noB;
}

/* ---------- 삼각형 만들기(cm) ---------- */
function t2Turn(p, deg = 0, flip = false) {
  let q = p.map(v => [flip ? -v[0] : v[0], v[1]]);
  const cx = (q[0][0] + q[1][0] + q[2][0]) / 3, cy = (q[0][1] + q[1][1] + q[2][1]) / 3, c = Math.cos(t2Rad(deg)), s = Math.sin(t2Rad(deg));
  return q.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
}
function t2Move(p, dx, dy) { return p.map(v => [v[0] + dx, v[1] + dy]); }
/* 세 변: s0 = 꼭짓점0→1, s1 = 1→2, s2 = 2→0 */
function t2SSS(s0, s1, s2, rot = 0, flip = false) {
  const x = (s0 * s0 + s2 * s2 - s1 * s1) / (2 * s0), y = Math.sqrt(Math.max(0, s2 * s2 - x * x));
  return t2Turn([[0, 0], [s0, 0], [x, y]], rot, flip);
}
/* 밑변 s0와 양 끝 두 각(꼭짓점0의 각 A0, 꼭짓점1의 각 A1) */
function t2ASA(A0, A1, s0, rot = 0, flip = false) {
  const s2 = s0 * Math.sin(t2Rad(A1)) / Math.sin(t2Rad(A0 + A1));
  return t2Turn([[0, 0], [s0, 0], [s2 * Math.cos(t2Rad(A0)), s2 * Math.sin(t2Rad(A0))]], rot, flip);
}
/* 이등변: 길이가 같은 두 변 leg, 두 변 사이의 각 apex (꼭짓점2) */
function t2Iso(leg, apex, rot = 0) { const hb = leg * Math.sin(t2Rad(apex / 2)), hh = leg * Math.cos(t2Rad(apex / 2)); return t2Turn([[-hb, 0], [hb, 0], [0, hh]], rot); }
/* 두 변과 그 사이의 각(꼭짓점0) */
function t2SAS(l1, ang, l2, rot = 0, flip = false) { return t2Turn([[0, 0], [l1, 0], [l2 * Math.cos(t2Rad(ang)), l2 * Math.sin(t2Rad(ang))]], rot, flip); }

/* ---------- 재기·이름 ---------- */
function t2Info(p) {
  const L = [0, 1, 2].map(i => t2Dist(p[i], p[(i + 1) % 3]));
  const A = [0, 1, 2].map(i => {
    const V = p[i], P = p[(i + 2) % 3], Q = p[(i + 1) % 3], u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]];
    return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))))) * 180 / Math.PI;
  });
  const eq = (a, b, t) => Math.abs(a - b) < t;
  const pairs = (X, t) => { if (eq(X[0], X[1], t) && eq(X[1], X[2], t)) return [0, 1, 2]; for (const [i, j] of [[0, 1], [1, 2], [0, 2]]) if (eq(X[i], X[j], t)) return [i, j]; return []; };
  const eqS = pairs(L, .004), eqA = pairs(A, .05), mx = Math.max(...A);
  const side = eqS.length === 3 ? "정" : eqS.length === 2 ? "이등변" : "부등변";
  const ang = Math.abs(mx - 90) < .05 ? "직각" : mx > 90 ? "둔각" : "예각";
  return { L, A, eqS, eqA, side, ang };
}
const T2_SIDE = { 정: "정삼각형", 이등변: "이등변삼각형", 부등변: "세 변의 길이가 모두 다른 삼각형" };
const T2_ANG = { 예각: "예각삼각형", 직각: "직각삼각형", 둔각: "둔각삼각형" };
/* 그림이 이름과 맞는지 확인하고 돌려줌(틀리면 바로 오류) */
function t2T(p, side, ang, why = "") {
  const I = t2Info(p);
  if (side && I.side !== side) throw new Error(`삼각형 그림 오류 ${why}: 변 ${I.side} ≠ ${side} (${I.L.map(t2F)})`);
  if (ang && I.ang !== ang) throw new Error(`삼각형 그림 오류 ${why}: 각 ${I.ang} ≠ ${ang} (${I.A.map(t2F)})`);
  return p;
}
function t2Cm(v) { const mm = Math.round(v * 10), c = Math.floor(mm / 10), r = mm % 10; return r ? `${c} cm ${r} mm` : `${c} cm`; }
const t2Deg = a => `${Math.round(a)}°`;

/* ---------- 그리기 ---------- */
/* cm 좌표 → 화면 좌표. k(1 cm 화면 길이)를 주면 그 크기로 가운데, 없으면 상자에 꽉 맞춤 */
function t2Map(p, box, k) {
  const [x0, y0, w, hh, pad = 20] = box;
  const xs = p.map(v => v[0]), ys = p.map(v => v[1]), bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
  const kk = k || Math.min((w - 2 * pad) / Math.max(bw, .01), (hh - 2 * pad) / Math.max(bh, .01));
  const ox = x0 + (w - bw * kk) / 2 - Math.min(...xs) * kk, oy = y0 + (hh - bh * kk) / 2 + Math.max(...ys) * kk;
  return { P: p.map(v => [ox + v[0] * kk, oy - v[1] * kk]), k: kk };
}
function t2Cen(P) { return [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3]; }
function t2Unit(v) { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; }
/* 꼭짓점 i의 두 변 방향(단위)과 안쪽 이등분 방향 */
function t2Corner(P, i) {
  const V = P[i], u = t2Unit([P[(i + 2) % 3][0] - V[0], P[(i + 2) % 3][1] - V[1]]), w = t2Unit([P[(i + 1) % 3][0] - V[0], P[(i + 1) % 3][1] - V[1]]);
  return { V, u, w, b: t2Unit([u[0] + w[0], u[1] + w[1]]) };
}
function t2ArcPath(P, i, r, wedge) {
  const { V, u, w } = t2Corner(P, i), s = [V[0] + u[0] * r, V[1] + u[1] * r], e = [V[0] + w[0] * r, V[1] + w[1] * r];
  const cr = u[0] * w[1] - u[1] * w[0], sw = cr > 0 ? 1 : 0;
  return (wedge ? `M${t2F(V[0])},${t2F(V[1])} L` : "M") + `${t2F(s[0])},${t2F(s[1])} A${r},${r} 0 0 ${sw} ${t2F(e[0])},${t2F(e[1])}` + (wedge ? " Z" : "");
}
function t2RightMk(P, i, s, attrs = {}) {
  const { V, u, w } = t2Corner(P, i);
  return svgEl("polyline", Object.assign({ points: t2Pts([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + w[0]) * s, V[1] + (u[1] + w[1]) * s], [V[0] + w[0] * s, V[1] + w[1] * s]]), fill: "none", stroke: TENT, "stroke-width": 2.5 }, attrs));
}
/* 삼각자의 직각을 꼭짓점 i에 한 변을 따라 대어 본 모양 */
function t2SqMk(P, i, sz) {
  const { V, u, w } = t2Corner(P, i), d = u[0] * w[0] + u[1] * w[1], pp = t2Unit([w[0] - d * u[0], w[1] - d * u[1]]);
  return svgEl("polygon", { points: t2Pts([V, [V[0] + u[0] * sz, V[1] + u[1] * sz], [V[0] + (u[0] + pp[0]) * sz, V[1] + (u[1] + pp[1]) * sz], [V[0] + pp[0] * sz, V[1] + pp[1] * sz]]), fill: "rgba(43,123,214,.16)", stroke: T2_SKY, "stroke-width": 2, "stroke-dasharray": "5 4", "pointer-events": "none" });
}
function t2Line(P, Q, attrs = {}) { return svgEl("line", Object.assign({ x1: t2F(P[0]), y1: t2F(P[1]), x2: t2F(Q[0]), y2: t2F(Q[1]), stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }, attrs)); }
/* 삼각형 하나 그리기
   o: {fill, sw, stroke, names:[3], lens:true|[글3]|[i…], angs:true|[글3]|[i…], ticks, arcs:true|[i…], rights(직각 표시, 기본 true), fs, sideCol:[3], angFill:[3]} */
function t2TriG(p, P, o = {}) {
  const g = svgEl("g"), I = t2Info(p), C = t2Cen(P), fs = o.fs || 20, sw = o.sw || 4;
  const sel = (v, i) => v === true || (Array.isArray(v) && (typeof v[0] === "number" ? v.includes(i) : v[i] != null && v[i] !== false));
  const lab = (v, i, def) => Array.isArray(v) && typeof v[0] !== "number" ? v[i] : def;
  const short = Math.min(...[0, 1, 2].map(i => t2Dist(P[i], P[(i + 1) % 3])));
  const rr = Math.max(14, Math.min(34, short * .22));
  g.append(svgEl("polygon", { points: t2Pts(P), fill: o.fill || T2_FILL, stroke: "none" }));
  [0, 1, 2].forEach(i => { if (o.angFill && o.angFill[i]) g.append(svgEl("path", { d: t2ArcPath(P, i, rr * 1.25, true), fill: o.angFill[i] })); });
  [0, 1, 2].forEach(i => g.append(t2Line(P[i], P[(i + 1) % 3], { stroke: (o.sideCol && o.sideCol[i]) || o.stroke || INK, "stroke-width": o.sideCol && o.sideCol[i] ? sw + 2 : sw })));
  [0, 1, 2].forEach(i => {
    const right = Math.abs(I.A[i] - 90) < .05;
    if (right && o.rights !== false) g.append(t2RightMk(P, i, Math.min(16, rr * .7)));
    else if (sel(o.arcs, i) || sel(o.angs, i)) g.append(svgEl("path", { d: t2ArcPath(P, i, rr), fill: "none", stroke: TENT, "stroke-width": 2.5 }));
    if (sel(o.angs, i)) {
      const { V, b } = t2Corner(P, i), t = lab(o.angs, i, t2Deg(I.A[i])), dd = rr + fs * (I.A[i] < 45 ? 1.25 : .95);
      g.append(txt(V[0] + b[0] * dd, V[1] + b[1] * dd, t, fs * .9, { fill: o.angCol || "#B4530F" }));
    }
  });
  if (o.ticks) {
    const n = I.eqS.length === 3 ? 1 : 1;
    I.eqS.forEach(i => {
      const A = P[i], B = P[(i + 1) % 3], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = t2Unit([B[0] - A[0], B[1] - A[1]]), nn = [-d[1], d[0]];
      for (let t = 0; t < n; t++) { const o2 = (t - (n - 1) / 2) * 6; g.append(t2Line([M[0] + d[0] * o2 - nn[0] * 9, M[1] + d[1] * o2 - nn[1] * 9], [M[0] + d[0] * o2 + nn[0] * 9, M[1] + d[1] * o2 + nn[1] * 9], { stroke: T2_RED, "stroke-width": 3 })); }
    });
  }
  [0, 1, 2].forEach(i => {
    if (!sel(o.lens, i)) return;
    const A = P[i], B = P[(i + 1) % 3], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], n = t2Unit([M[0] - C[0], M[1] - C[1]]);
    const t = lab(o.lens, i, t2Cm(I.L[i])), tw = fs * .9 * [...String(t)].reduce((a, ch) => a + (/[ -~]/.test(ch) ? .56 : 1), 0), off = Math.abs(n[0]) * (tw / 2 + 8) + Math.abs(n[1]) * (fs * .45 + 8);
    g.append(txt(M[0] + n[0] * off, M[1] + n[1] * off, t, fs * .9, { fill: o.lenCol || "#1D4E80" }));
  });
  if (o.names) [0, 1, 2].forEach(i => { if (!o.names[i]) return; const { V, b } = t2Corner(P, i); g.append(txt(V[0] - b[0] * fs * 1.05, V[1] - b[1] * fs * 1.05, o.names[i], fs)); });
  return g;
}
/* 그림 한 장(정적) */
function t2Fig(W, H, draw, maxW) {
  const s = makeSvg(W, H); draw(s);
  return h("div", { class: "t2fig", style: `max-width:${maxW || "30em"}` }, s);
}
/* 삼각형 카드 여러 장(그림만) */
function t2Cards(list, opt = {}) {
  const CW = opt.cw || 220, CH = opt.ch || 180, per = opt.per || list.length, rows = Math.ceil(list.length / per);
  const s = makeSvg(per * (CW + 10) + 10, rows * (CH + 10) + 10);
  list.forEach((it, i) => {
    const x = 10 + (i % per) * (CW + 10), y = 10 + Math.floor(i / per) * (CH + 10);
    s.append(svgEl("rect", { x, y, width: CW, height: CH, rx: 12, fill: "#fff", stroke: T2_LINE, "stroke-width": 2 }));
    const m = t2Map(it.p, [x, y + 14, CW, CH - 14, it.pad || 34], opt.k);
    s.append(t2TriG(it.p, m.P, Object.assign({ fs: 18 }, opt.o || {}, it.o || {})));
    if (it.label !== false) s.append(txt(x + 18, y + 18, it.label || T2_KO[i], 20));
  });
  return h("div", { class: "t2fig", style: `max-width:${opt.maxW || Math.min(46, per * 11) + "em"}` }, s);
}
/* 클릭으로 재기: 변을 누르면 길이, 꼭짓점 안쪽을 누르면 각도가 나타남 */
function t2Measurable(g, p, P, opt = {}) {
  const I = t2Info(p), C = t2Cen(P), fs = opt.fs || 18, lay = svgEl("g", { "pointer-events": "none" }), hits = svgEl("g");
  const shown = { s: new Set(opt.showS || []), a: new Set(opt.showA || []) };
  const short = Math.min(...[0, 1, 2].map(i => t2Dist(P[i], P[(i + 1) % 3]))), rr = Math.max(14, Math.min(30, short * .22));
  const paint = () => {
    lay.innerHTML = "";
    shown.s.forEach(i => { const A = P[i], B = P[(i + 1) % 3], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], n = t2Unit([M[0] - C[0], M[1] - C[1]]), off = fs * (Math.abs(n[0]) > .7 ? 2.2 : 1.05) + 2;
      lay.append(svgEl("rect", { x: t2F(M[0] + n[0] * off - fs * 2.4), y: t2F(M[1] + n[1] * off - fs * .62), width: t2F(fs * 4.8), height: t2F(fs * 1.24), rx: 5, fill: "rgba(255,255,255,.9)" }), txt(M[0] + n[0] * off, M[1] + n[1] * off, t2Cm(I.L[i]), fs * .86, { fill: "#1D4E80" })); });
    shown.a.forEach(i => { const { V, b } = t2Corner(P, i), dd = rr + fs * (I.A[i] < 45 ? 1.35 : 1);
      if (Math.abs(I.A[i] - 90) >= .05) lay.append(svgEl("path", { d: t2ArcPath(P, i, rr), fill: "none", stroke: "#B4530F", "stroke-width": 2.5 }));
      lay.append(txt(V[0] + b[0] * dd, V[1] + b[1] * dd, t2Deg(I.A[i]), fs * .86, { fill: "#B4530F" })); });
  };
  [0, 1, 2].forEach(i => {
    const ln = t2Line(P[i], P[(i + 1) % 3], { stroke: "rgba(0,0,0,0)", "stroke-width": 20, style: "cursor:pointer" });
    ln.addEventListener("click", e => { e.stopPropagation(); shown.s.has(i) ? shown.s.delete(i) : shown.s.add(i); paint(); opt.onChange && opt.onChange(); }); hits.append(ln);
    const { V, b } = t2Corner(P, i), hc = svgEl("circle", { cx: t2F(V[0] + b[0] * rr * 1.1), cy: t2F(V[1] + b[1] * rr * 1.1), r: t2F(rr * 1.05), fill: "rgba(0,0,0,0)", style: "cursor:pointer" });
    hc.addEventListener("click", e => { e.stopPropagation(); shown.a.has(i) ? shown.a.delete(i) : shown.a.add(i); paint(); opt.onChange && opt.onChange(); }); hits.append(hc);
  });
  g.append(hits, lay); paint();
  return shown;
}
/* 여러 부분을 차례로 */
function t2Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: "t2part" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 문제도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run();
    } });
    parts[myK](box, sub);
  };
  run();
}

/* =========================================================
   1. 그림에서 고르기 — 장면 속 물건을 눌러 고른다 (1차시)
   opt: {W,H, deco(g), items:[{n, box:[x,y,w,h], ok, why, draw(g)}], ok}
   ========================================================= */
function t2Pick(body, api, opt) {
  const svg = makeSvg(opt.W, opt.H), on = new Set(), marks = svgEl("g");
  if (opt.deco) opt.deco(svg);
  opt.items.forEach((it, i) => {
    const g = svgEl("g", { style: "cursor:pointer" }); it.draw(g);
    const [x, y, w, hh] = it.box; g.append(svgEl("rect", { x, y, width: w, height: hh, fill: "rgba(0,0,0,0)" }));
    g.addEventListener("click", () => { on.has(i) ? on.delete(i) : on.add(i); paint(); });
    svg.append(g);
  });
  svg.append(marks);
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const paint = () => {
    marks.innerHTML = "";
    on.forEach(i => { const [x, y, w, hh] = opt.items[i].box; marks.append(svgEl("rect", { x: x - 4, y: y - 4, width: w + 8, height: hh + 8, rx: 12, fill: "none", stroke: TENT, "stroke-width": 5, "stroke-dasharray": "12 6" })); });
    out.textContent = on.size ? "고른 것: " + [...on].map(i => opt.items[i].n).join(", ") : "고른 것이 없어요.";
  };
  const want = opt.items.map((it, i) => it.ok ? i : -1).filter(i => i >= 0);
  api.provide({ words: opt.words || ["삼각형", "변 3개", "꼭짓점 3개"], answers: [want.map(i => opt.items[i].n).join(", ")] });
  const judge = () => {
    api.tryOnce(); const ans = [...on].map(i => opt.items[i].n).join(", ") || "-";
    const extra = [...on].find(i => !opt.items[i].ok), miss = want.find(i => !on.has(i));
    if (extra == null && miss == null) { api.done(ans, opt.ok); return true; }
    api.fail(extra != null ? (opt.items[extra].why || `${opt.items[extra].n}에는 삼각형이 없어요.`) : `아직 찾지 못한 것이 있어요. 곧은 선 3개로 둘러싸인 모양을 더 찾아봐요.`, ans); return false;
  };
  const auto = autoRun(() => on.size >= want.length, () => [...on].sort().join(","), judge, 900);
  svg.addEventListener("click", () => auto());
  body.append(h("div", { class: "stage" }, svg), out, h("p", { class: "inst" }, (opt.tip ? opt.tip + " " : "") + `알맞은 것을 ${want.length}개 고르면 저절로 확인해요.`));
  paint();
}

/* =========================================================
   2. 자·각도기로 재고 표시하기 (2·3·4차시)
   items:[{p, ask, want:"sides"|"angles"|"both", angs:[보이는 각 번호], lens:[보이는 변 번호], names}], tools 기본 전부
   길이가 같은 변 → 초록 펜, 크기가 같은 각 → 빨간 칠
   ========================================================= */
function t2Mark(body, api, opt) {
  const W = opt.W || 760, H = opt.H || 470, svg = makeSvg(W, H), stage = svgEl("g"); svg.append(stage);
  const items = opt.items; let k = 0, mode = 0, st;
  const modes = [["📏 자로 재기", "변을 누르면 자를 대어 길이를 재요."], ["📐 각도기로 재기", "꼭짓점 안쪽을 누르면 각의 크기를 재요."], ["🟩 같은 변 초록색", "길이가 같은 변을 눌러 초록색으로 그려요. 다시 누르면 지워져요."], ["🟥 같은 각 빨간색", "크기가 같은 각을 눌러 빨간색으로 칠해요. 다시 누르면 지워져요."]];
  const useModes = opt.modes || [0, 1, 2, 3];
  const tip = h("p", { class: "inst", style: "margin:.2em 0" }), askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const mBtns = useModes.map(m => h("button", { onclick: () => { mode = m; paintBtns(); } }, modes[m][0]));
  const paintBtns = () => { mBtns.forEach((b, j) => b.classList.toggle("on", useModes[j] === mode)); tip.textContent = modes[mode][1]; };
  const draw = () => {
    const it = items[k], p = it.p, I = t2Info(p), m = t2Map(p, [0, 0, W, H, opt.pad || 90], opt.k), P = m.P, kk = m.k, C = t2Cen(P);
    stage.innerHTML = "";
    const rr = Math.max(18, Math.min(40, Math.min(...I.L) * kk * .2));
    stage.append(svgEl("polygon", { points: t2Pts(P), fill: T2_FILL }));
    st.red.forEach(i => stage.append(svgEl("path", { d: t2ArcPath(P, i, rr * 1.3, true), fill: "rgba(210,70,58,.55)" })));
    [0, 1, 2].forEach(i => stage.append(t2Line(P[i], P[(i + 1) % 3], { stroke: st.green.has(i) ? T2_GREEN : INK, "stroke-width": st.green.has(i) ? 9 : 4 })));
    (it.angs || []).forEach(i => { if (Math.abs(I.A[i] - 90) >= .05) stage.append(svgEl("path", { d: t2ArcPath(P, i, rr, false), fill: "none", stroke: TENT, "stroke-width": 3 })); const { V, b } = t2Corner(P, i), dd = rr + (I.A[i] < 45 ? 30 : 22); stage.append(txt(V[0] + b[0] * dd, V[1] + b[1] * dd, t2Deg(I.A[i]), 22, { fill: "#B4530F" })); });
    (it.lens || []).forEach(i => { const A = P[i], B = P[(i + 1) % 3], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], n = t2Unit([M[0] - C[0], M[1] - C[1]]); stage.append(txt(M[0] + n[0] * 26, M[1] + n[1] * 26, t2Cm(I.L[i]), 22, { fill: "#1D4E80" })); });
    [0, 1, 2].forEach(i => { if (Math.abs(I.A[i] - 90) < .05) stage.append(t2RightMk(P, i, 18)); });
    /* 자 */
    st.ruler.forEach(i => {
      const A = P[i], B = P[(i + 1) % 3], d = t2Unit([B[0] - A[0], B[1] - A[1]]), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      let n = [-d[1], d[0]]; if ((M[0] - C[0]) * n[0] + (M[1] - C[1]) * n[1] < 0) n = [-n[0], -n[1]];
      const len = I.L[i], S = [A[0] - d[0] * .25 * kk, A[1] - d[1] * .25 * kk], E = [B[0] + d[0] * .25 * kk, B[1] + d[1] * .25 * kk], wd = 34, o1 = 5;
      const q = (P0, t, o) => [P0[0] + d[0] * t + n[0] * o, P0[1] + d[1] * t + n[1] * o];
      const g = svgEl("g", { "pointer-events": "none" });
      g.append(svgEl("polygon", { points: t2Pts([q(S, 0, o1), q(E, 0, o1), q(E, 0, o1 + wd), q(S, 0, o1 + wd)]), fill: "rgba(255,236,170,.88)", stroke: "#B48A2A", "stroke-width": 1.5 }));
      for (let t = 0; t <= Math.floor(len * 10 + 1e-6); t++) { const L0 = t % 10 === 0 ? 14 : t % 5 === 0 ? 10 : 6; g.append(t2Line(q(A, t / 10 * kk, o1), q(A, t / 10 * kk, o1 + L0), { stroke: "#5A4A20", "stroke-width": t % 10 ? 1 : 1.8, "stroke-linecap": "butt" }));
        if (t % 10 === 0) { const tp = q(A, t / 10 * kk, o1 + 24); g.append(txt(tp[0], tp[1], String(t / 10), 13, { fill: "#5A4A20" })); } }
      const lp = q(M, 0, o1 + wd + 18); g.append(svgEl("rect", { x: t2F(lp[0] - 50), y: t2F(lp[1] - 14), width: 100, height: 28, rx: 8, fill: "#fff", stroke: "#1D4E80", "stroke-width": 1.5 }), txt(lp[0], lp[1], t2Cm(len), 20, { fill: "#1D4E80" }));
      stage.append(g);
    });
    /* 각도기로 잰 값 */
    st.prot.forEach(i => { const { V, b } = t2Corner(P, i), dd = rr + (I.A[i] < 45 ? 34 : 26);
      stage.append(svgEl("path", { d: t2ArcPath(P, i, rr * .9, true), fill: "rgba(43,123,214,.18)", stroke: T2_SKY, "stroke-width": 2 }));
      const tp = [V[0] + b[0] * dd, V[1] + b[1] * dd]; stage.append(svgEl("rect", { x: t2F(tp[0] - 26), y: t2F(tp[1] - 14), width: 52, height: 28, rx: 8, fill: "#fff", stroke: T2_SKY, "stroke-width": 1.5 }), txt(tp[0], tp[1], t2Deg(I.A[i]), 20, { fill: "#1D4E80" })); });
    if (it.names) [0, 1, 2].forEach(i => { const { V, b } = t2Corner(P, i); stage.append(txt(V[0] - b[0] * 24, V[1] - b[1] * 24, it.names[i], 24)); });
    /* 누르는 곳 */
    [0, 1, 2].forEach(i => {
      const ln = t2Line(P[i], P[(i + 1) % 3], { stroke: "rgba(0,0,0,0)", "stroke-width": 26, style: "cursor:pointer" });
      ln.addEventListener("click", () => {
        if (mode === 0) tog(st.ruler, i); else if (mode === 2) tog(st.green, i);
        else return api.hint(mode === 1 ? "각도기는 꼭짓점 안쪽을 눌러요." : "각은 꼭짓점 안쪽을 눌러 칠해요.");
        draw(); auto();
      }); stage.append(ln);
      const { V, b } = t2Corner(P, i), hc = svgEl("circle", { cx: t2F(V[0] + b[0] * rr * 1.2), cy: t2F(V[1] + b[1] * rr * 1.2), r: t2F(rr * 1.25), fill: "rgba(0,0,0,0)", style: "cursor:pointer" });
      hc.addEventListener("click", () => {
        if (mode === 1) tog(st.prot, i); else if (mode === 3) tog(st.red, i);
        else return api.hint(mode === 0 ? "자는 변을 눌러 대요." : "변을 눌러 초록색으로 그려요.");
        draw(); auto();
      }); stage.append(hc);
    });
    askEl.textContent = (items.length > 1 ? `(${k + 1}/${items.length}) ` : "") + (it.ask || "");
  };
  const tog = (set, i) => set.has(i) ? set.delete(i) : set.add(i);
  const reset = () => { st = { ruler: new Set(), prot: new Set(), green: new Set(), red: new Set() }; };
  const sameSet = (a, b) => a.size === b.length && b.every(x => a.has(x));
  api.provide({ words: ["길이가 같은 변", "크기가 같은 각", "자", "각도기"], answers: [items.map(it => { const I = t2Info(it.p); return it.want === "angles" ? `같은 각 ${I.eqA.length}개` : `같은 변 ${I.eqS.length}개`; }).join(", ")] });
  const res = [];
  /* 세 변(세 각)을 모두 잰 뒤, 표시한 수가 같은 변(각)의 수에 이르면 저절로 확인 */
  const known = (set, given) => new Set([...set, ...(given || [])]).size;
  const ready = () => {
    const it = items[k], I = t2Info(it.p), wS = it.want !== "angles", wA = it.want !== "sides";
    const sOk = !wS || (known(st.ruler, it.lens) >= 3 && st.green.size >= I.eqS.length);
    const aOk = !wA || (known(st.prot, it.angs) >= 3 && st.red.size >= I.eqA.length);
    return sOk && aOk;
  };
  const judge = () => {
    const it = items[k], I = t2Info(it.p), wS = it.want !== "angles", wA = it.want !== "sides";
    api.tryOnce();
    const okS = !wS || sameSet(st.green, I.eqS), okA = !wA || sameSet(st.red, I.eqA);
    const ans = `${wS ? `초록 변 ${st.green.size}개` : ""}${wS && wA ? ", " : ""}${wA ? `빨간 각 ${st.red.size}개` : ""}`;
    if (okS && okA) {
      res.push(ans);
      if (k < items.length - 1) { api.hint(`○ ${it.okMsg || "잘 찾았어요!"} 다음 삼각형도 해 봐요.`); k++; reset(); draw(); return false; }
      api.done(res.join(" / "), opt.ok); return true;
    }
    let why;
    if (!okS) why = I.eqS.length === 0 ? "이 삼각형은 세 변의 길이를 재어 보면 모두 달라요. 초록색 변을 지워 봐요." : st.green.size < I.eqS.length ? `길이가 같은 변이 ${I.eqS.length}개 있어요. 자로 세 변을 모두 재어 비교해 봐요.` : "초록색으로 그린 변 중에 길이가 다른 변이 있어요. 자로 재어 다시 확인해요.";
    else why = st.red.size < I.eqA.length ? `크기가 같은 각이 ${I.eqA.length}개 있어요. 각도기로 세 각을 모두 재어 봐요.` : "빨간색으로 칠한 각 중에 크기가 다른 각이 있어요. 각도기로 재어 다시 확인해요.";
    api.fail(why, ans); return false;
  };
  const auto = autoRun(ready, () => k + ":" + [st.ruler, st.prot, st.green, st.red].map(s => [...s].sort().join("")).join("|"), judge, 1200);
  const needTxt = useModes.includes(1) ? "세 변과 세 각을 모두 재고 표시하면 저절로 확인해요." : "세 변을 모두 재고 표시하면 저절로 확인해요. 같은 변이 없으면 재기만 해요.";
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, h("div", { class: "tools" }, mBtns), tip, h("p", { class: "inst", style: "margin:.2em 0" }, opt.need || needTxt))));
  mode = useModes[0]; reset(); paintBtns(); draw();
}

/* =========================================================
   3. 각도기 — 4-1 각도 단원의 각도기를 옮겨 씀(끌어 옮기고 손잡이로 돌림)
   opt: {W,H, p(cm), names, corners:[꼭짓점 번호…], placed:[…], ask, ok}
   ========================================================= */
const T2_PR = 200;
function t2ProtG(R = T2_PR, opt = {}) {
  const g = svgEl("g");
  g.append(svgEl("path", { d: `M${-R},0 A${R},${R} 0 0 1 ${R},0 L${R},18 L${-R},18 Z`, fill: "rgba(170,210,245,.42)", stroke: "#1D4E80", "stroke-width": 2 }));
  g.append(svgEl("path", { d: `M${-R * .36},0 A${R * .36},${R * .36} 0 0 1 ${R * .36},0`, fill: "rgba(255,255,255,.35)", stroke: "#1D4E80", "stroke-width": 1.2 }));
  const ring = R - 62;
  for (let t = 0; t <= 180; t++) {
    const len = t % 10 === 0 ? 17 : t % 5 === 0 ? 11 : 6, p1 = t2Pt([0, 0], t, R), p2 = t2Pt([0, 0], t, R - len);
    g.append(t2Line(p1, p2, { stroke: "#1D4E80", "stroke-width": t % 10 === 0 ? 1.6 : 1, "stroke-linecap": "butt" }));
    if (t % 5 === 0) { const q1 = t2Pt([0, 0], t, ring), q2 = t2Pt([0, 0], t, ring - (t % 10 === 0 ? 9 : 5)); g.append(t2Line(q1, q2, { stroke: "#1D4E80", "stroke-width": 1, "stroke-linecap": "butt" })); }
  }
  g.append(svgEl("path", { d: `M${-ring},0 A${ring},${ring} 0 0 1 ${ring},0`, fill: "none", stroke: "#1D4E80", "stroke-width": 1 }));
  const fs = Math.round(R * .072);
  for (let t = 0; t <= 180; t += 10) {
    const tl = Math.max(3.5, Math.min(176.5, t)), po = t2Pt([0, 0], tl, R - 29), pi = t2Pt([0, 0], tl, R - 47);
    g.append(txt(po[0], po[1], String(180 - t), fs, { transform: `rotate(${90 - t} ${t2F(po[0])} ${t2F(po[1])})`, fill: "#1D2A2A" }),
      txt(pi[0], pi[1], String(t), fs * .9, { transform: `rotate(${90 - t} ${t2F(pi[0])} ${t2F(pi[1])})`, fill: BLUE }));
  }
  g.append(t2Line([-R + 2, 0], [R - 2, 0], { stroke: "#1D4E80", "stroke-width": 2, "stroke-linecap": "butt" }));
  g.append(svgEl("circle", { cx: 0, cy: 0, r: 5, fill: "#fff", stroke: "#C8472E", "stroke-width": 2.5 }), t2Line([0, -12], [0, 6], { stroke: "#C8472E", "stroke-width": 2 }));
  if (opt.knob !== false) {
    g.append(t2Line([0, -R], [0, -R - 14], { stroke: "#1D4E80", "stroke-width": 2 }));
    g.append(svgEl("circle", { cx: 0, cy: -R - 26, r: 15, fill: TENT, stroke: "#fff", "stroke-width": 3 }));
    g.append(txt(0, -R - 25, "↻", 20, { fill: "#fff" }));
  }
  return g;
}
function t2Protract(body, api, opt) {
  const W = opt.W || 900, H = opt.H || 620, R = T2_PR, svg = makeSvg(W, H);
  const m = t2Map(opt.p, opt.box || [0, 0, W * .62, H, 70]), P = m.P, I = t2Info(opt.p);
  const items = opt.corners.map(i => {
    const V = P[i], A = P[(i + 2) % 3], B = P[(i + 1) % 3], dA = t2Dir(V, A), dB = t2Dir(V, B), a = I.A[i];
    const d1 = Math.abs(t2N(dB - dA) - a) < .5 ? dA : dB;
    return { i, V, d1, a: Math.round(a), placed: (opt.placed || []).includes(i) };
  });
  const back = svgEl("g"), protG = t2ProtG(R); svg.append(back, protG);
  let k = 0, C = [W - R - 30, H - 40], rot = 0;
  const results = [];
  const it = () => items[k];
  const posEl = h("div", { class: "jua" }), askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const inp = h("input", { type: "number", inputmode: "numeric", style: "width:5.5em;font-size:1.2em", "aria-label": "각도" });
  const placeProt = () => { protG.setAttribute("transform", `translate(${t2F(C[0])},${t2F(C[1])}) rotate(${t2F(-rot)})`); posEl.textContent = statusText(); };
  const near = (x, y) => Math.abs(t2N(x - y + 180) - 180);
  const status = () => { const J = it(), cOk = t2Dist(C, J.V) < 2, d2 = J.d1 + J.a;
    const base = near(rot, J.d1) < .6 || near(rot, d2 - 180) < .6, flip = near(rot, J.d1 + 180) < .6 || near(rot, d2) < .6; return { cOk, base, flip }; };
  const statusText = () => { const s = status(); return `중심 ${s.cOk ? "✓ 꼭짓점에 맞음" : "✗"} · 밑금 ${s.base ? "✓ 한 변에 맞음" : s.flip ? "△ 각이 각도기 밖에 있어요" : "✗"}`; };
  const draw = () => {
    const J = it(); back.innerHTML = "";
    back.append(svgEl("polygon", { points: t2Pts(P), fill: T2_FILL, stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }));
    [J.d1, J.d1 + J.a].forEach(d => back.append(t2Line(J.V, t2Pt(J.V, d, 250), { stroke: T2_GRAY, "stroke-width": 2.5, "stroke-dasharray": "10 7" })));
    back.append(svgEl("path", { d: t2ArcPath(P, J.i, 30, true), fill: "rgba(228,122,56,.35)", stroke: TENT, "stroke-width": 2 }));
    results.forEach(r => { const { V, b } = t2Corner(P, r.i); back.append(txt(V[0] + b[0] * 62, V[1] + b[1] * 62, `${r.a}°`, 22, { fill: "#B4530F" })); });
    if (opt.names) [0, 1, 2].forEach(i => { const { V, b } = t2Corner(P, i); back.append(txt(V[0] - b[0] * 26, V[1] - b[1] * 26, opt.names[i], 24)); });
    const nm = opt.names ? `각 ${opt.names[(J.i + 2) % 3]}${opt.names[J.i]}${opt.names[(J.i + 1) % 3]}` : "색칠한 각";
    askEl.textContent = (items.length > 1 ? `(${k + 1}/${items.length}) ` : "") + `${nm}의 크기를 각도기로 재어 보세요.`;
    placeProt();
  };
  const startItem = () => { const J = it(); inp.value = ""; if (J.placed) { C = J.V.slice(); rot = J.d1; } else { C = [W - R - 30, H - 40]; rot = 0; } draw(); };
  const local = q => { const dx = q.x - C[0], dy = q.y - C[1], r = t2Rad(rot); return [dx * Math.cos(r) - dy * Math.sin(r), dx * Math.sin(r) + dy * Math.cos(r)]; };
  let dr = null;
  dragOn(svg, q => {
    const l = local(q), ang0 = Math.atan2(-(q.y - C[1]), q.x - C[0]) * 180 / Math.PI;
    if (Math.hypot(l[0], l[1] + R + 26) < 30) { dr = { mode: "rot", a0: ang0, r0: rot }; return true; }
    const dd = Math.hypot(l[0], l[1]);
    if (l[1] <= 20 && l[1] >= -R - 4 && dd <= R + 4) { dr = dd >= R - 34 && l[1] < -8 ? { mode: "rot", a0: ang0, r0: rot } : { mode: "move", off: [q.x - C[0], q.y - C[1]] }; return true; }
    return false;
  }, q => {
    if (!dr) return;
    if (dr.mode === "move") C = [Math.max(0, Math.min(W, q.x - dr.off[0])), Math.max(0, Math.min(H, q.y - dr.off[1]))];
    else { const ang = Math.atan2(-(q.y - C[1]), q.x - C[0]) * 180 / Math.PI; rot = t2N(dr.r0 + ang - dr.a0); }
    placeProt();
  }, () => { if (!dr) return; dr = null; snap(); placeProt(); });
  const snap = () => { const J = it(); if (t2Dist(C, J.V) < 22) C = J.V.slice(); for (const b of [J.d1, J.d1 + 180, J.d1 + J.a, J.d1 + J.a + 180]) if (near(rot, b) < 5) { rot = t2N(b); break; } };
  const turn = d => { rot = t2N(rot + d); snap(); placeProt(); };
  const tools = h("div", { class: "tools" }, h("button", { onclick: () => turn(10) }, "⟲ 10°"), h("button", { onclick: () => turn(-10) }, "⟳ 10°"), h("button", { onclick: () => turn(1) }, "⟲ 1°"), h("button", { onclick: () => turn(-1) }, "⟳ 1°"), h("button", { onclick: () => turn(180) }, "반 바퀴"));
  api.provide({ words: ["중심", "꼭짓점", "밑금", "0", "안쪽 눈금", "바깥쪽 눈금"], answers: [items.map(J => `${J.a}°`).join(", ")] });
  const judge = () => {
    const J = it();
    api.tryOnce(); const v = Number(inp.value), s = status();
    if (v === J.a) {
      results.push(J);
      if (k < items.length - 1) { api.hint(`○ ${J.a}°가 맞아요! 다음 각도 재어 봐요.`); k++; startItem(); return false; }
      draw(); api.done(results.map(r => `${r.a}°`).join(", "), opt.ok); return true;
    }
    let why;
    if (v === 180 - J.a && J.a !== 90) why = `${v}°는 다른 쪽 눈금을 읽은 거예요. 한 변이 0에 맞춰진 쪽 눈금을 읽어요. 이 각은 직각보다 ${J.a < 90 ? "작으니 90보다 작은" : "크니 90보다 큰"} 수를 읽어야 해요.`;
    else if (!s.cOk) why = "각도기의 중심(빨간 점)을 각의 꼭짓점에 꼭 맞추어 다시 재어 봐요.";
    else if (!s.base) why = s.flip ? "각도기를 반 바퀴 돌려 각이 각도기 안쪽에 들어오게 하고, 밑금을 한 변에 맞춰요." : "각도기의 밑금을 각의 한 변에 맞추어 다시 재어 봐요.";
    else why = "눈금을 다시 읽어 봐요. 큰 눈금은 10°, 중간 눈금은 5°, 작은 눈금은 1°씩이에요.";
    api.fail(why, `${v}°`); return false;
  };
  const auto = autoRun(() => String(inp.value).trim() !== "", () => k + ":" + inp.value, judge, 900);
  inp.addEventListener("input", auto); inp.addEventListener("change", auto);
  inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } });
  const tipEl = h("p", { class: "inst", style: "margin:.2em 0" }, "각도기 가운데를 끌면 옮겨지고, 눈금이 있는 가장자리나 주황 손잡이(↻)를 끌면 돌아가요. 가까이 가면 꼭짓점과 변에 착 붙어요. 잰 각도를 쓰면 저절로 확인해요.");
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, tipEl, posEl, tools, h("div", { class: "qitem" }, h("span", { class: "jua" }, "잰 각도: "), inp, h("span", {}, " °")))));
  startItem();
}

/* =========================================================
   4. 점 종이·모눈종이·삼각 모눈종이 — 꼭짓점을 끌어 조건에 맞는 삼각형 만들기
   opt: {grid:"sq"|"tri", dots, cols, rows, u, start:[[i,j]×3], items:[{ask, need:"iso"|"equi"|"acute"|"obtuse"|"right"|함수, ok}], ruler, square}
   길이·각은 격자 좌표의 정수 계산으로 정확히 판정함
   ========================================================= */
function t2Board(body, api, opt) {
  const tri = opt.grid === "tri", u = opt.u || 56, cols = opt.cols || 10, rows = opt.rows || 6, pad = 30, hy = tri ? u * Math.sqrt(3) / 2 : u;
  const W = pad * 2 + cols * u + (tri ? u / 2 : 0), H = pad * 2 + rows * hy, svg = makeSvg(t2F(W), t2F(H));
  const px = ([i, j]) => [pad + (i + (tri && (j & 1) ? .5 : 0)) * u, pad + j * hy];
  const pts = []; for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) pts.push([i, j]);
  const grid = svgEl("g"), shape = svgEl("g"), top = svgEl("g"); svg.append(grid, shape, top);
  if (!opt.dots) {
    if (!tri) { for (let i = 0; i <= cols; i++) grid.append(t2Line(px([i, 0]), px([i, rows]), { stroke: "#D5E0DB", "stroke-width": 1.5 })); for (let j = 0; j <= rows; j++) grid.append(t2Line(px([0, j]), px([cols, j]), { stroke: "#D5E0DB", "stroke-width": 1.5 })); }
    else pts.forEach(([i, j]) => { const a = px([i, j]); if (i < cols) grid.append(t2Line(a, px([i + 1, j]), { stroke: "#D5E0DB", "stroke-width": 1.5 }));
      if (j < rows) { const dl = j & 1 ? [i, j + 1] : [i - 1, j + 1], dr = j & 1 ? [i + 1, j + 1] : [i, j + 1];
        if (dl[0] >= 0 && dl[0] <= cols) grid.append(t2Line(a, px(dl), { stroke: "#D5E0DB", "stroke-width": 1.5 })); if (dr[0] >= 0 && dr[0] <= cols) grid.append(t2Line(a, px(dr), { stroke: "#D5E0DB", "stroke-width": 1.5 })); } });
  }
  pts.forEach(q => { const a = px(q); grid.append(svgEl("circle", { cx: t2F(a[0]), cy: t2F(a[1]), r: opt.dots ? 4.5 : 2.5, fill: opt.dots ? "#5E6E7A" : "#AEBDB6" })); });
  let V = opt.start.map(q => q.slice()), k = 0, showR = false, showSq = false;
  const vec = (A, B) => { const b = B[1] - A[1]; if (!tri) return [B[0] - A[0], b]; const dx2 = 2 * (B[0] - A[0]) + (B[1] & 1) - (A[1] & 1); return [(dx2 - b) / 2, b]; };
  const len2 = v => tri ? v[0] * v[0] + v[0] * v[1] + v[1] * v[1] : v[0] * v[0] + v[1] * v[1];
  const dot2 = (v, w) => tri ? 2 * v[0] * w[0] + v[0] * w[1] + v[1] * w[0] + 2 * v[1] * w[1] : 2 * (v[0] * w[0] + v[1] * w[1]);
  const info = () => {
    const L2 = [0, 1, 2].map(i => len2(vec(V[i], V[(i + 1) % 3])));
    const D = [0, 1, 2].map(i => dot2(vec(V[i], V[(i + 2) % 3]), vec(V[i], V[(i + 1) % 3])));
    const a = px(V[0]), b = px(V[1]), c = px(V[2]), cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const eqc = (L2[0] === L2[1]) + (L2[1] === L2[2]) + (L2[0] === L2[2]);
    return { L2, D, flat: Math.abs(cross) < 1e-6, side: eqc === 3 ? "정" : eqc === 1 ? "이등변" : "부등변", ang: D.some(d => d < 0) ? "둔각" : D.some(d => d === 0) ? "직각" : "예각" };
  };
  const draw = () => {
    shape.innerHTML = ""; top.innerHTML = "";
    const P = V.map(px), I = info();
    shape.append(svgEl("polygon", { points: t2Pts(P), fill: "rgba(228,122,56,.22)", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }));
    if (!I.flat) {
      if (showSq) [0, 1, 2].forEach(i => shape.append(t2SqMk(P, i, 38)));
      if (showR) { const C = t2Cen(P); [0, 1, 2].forEach(i => { const A = P[i], B = P[(i + 1) % 3], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], n = t2Unit([M[0] - C[0], M[1] - C[1]]), lp = [M[0] + n[0] * 26, M[1] + n[1] * 26];
        shape.append(svgEl("rect", { x: t2F(lp[0] - 54), y: t2F(lp[1] - 14), width: 108, height: 28, rx: 8, fill: "rgba(255,255,255,.93)", stroke: "#1D4E80", "stroke-width": 1.2 }), txt(lp[0], lp[1], t2Cm(Math.sqrt(I.L2[i])), 18, { fill: "#1D4E80" })); }); }
    }
    P.forEach((p, i) => top.append(svgEl("circle", { cx: t2F(p[0]), cy: t2F(p[1]), r: 15, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }), txt(p[0], p[1] - 28, ["ㄱ", "ㄴ", "ㄷ"][i], 20)));
    askEl.textContent = (opt.items.length > 1 ? `(${k + 1}/${opt.items.length}) ` : "") + opt.items[k].ask;
  };
  let di = -1;
  dragOn(svg, q => { const P = V.map(px); di = P.findIndex(p => Math.hypot(p[0] - q.x, p[1] - q.y) < 34); return di >= 0; },
    q => { if (di < 0) return; let best = null, bd = 1e9; pts.forEach(t => { const a = px(t), d = Math.hypot(a[0] - q.x, a[1] - q.y); if (d < bd) { bd = d; best = t; } });
      if (best && !V.some((v, j) => j !== di && v[0] === best[0] && v[1] === best[1])) { V[di] = best.slice(); draw(); } }, () => { if (di >= 0) auto(); di = -1; });
  const askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const tools = h("div", { class: "tools" },
    opt.ruler !== false ? h("button", { onclick: e => { showR = !showR; e.currentTarget.classList.toggle("on", showR); draw(); } }, "📏 자로 재기") : null,
    opt.square ? h("button", { onclick: e => { showSq = !showSq; e.currentTarget.classList.toggle("on", showSq); draw(); } }, "삼각자 직각 대 보기") : null,
    h("button", { onclick: () => { V = opt.start.map(q => q.slice()); draw(); } }, "처음으로"));
  const NEED = {
    iso: [I => I.side === "이등변", "두 변의 길이가 같은 삼각형이 아니에요. 한 꼭짓점에서 두 변이 똑같은 칸 수만큼 가도록 옮겨 봐요."],
    equi: [I => I.side === "정", "세 변의 길이가 모두 같지 않아요. 삼각 모눈의 선을 따라 세 변이 모두 같은 칸 수가 되게 해요."],
    acute: [I => I.ang === "예각", null],
    obtuse: [I => I.ang === "둔각", null],
    right: [I => I.ang === "직각", null]
  };
  const angWhy = (I, want) => I.ang === "직각" ? "한 각이 직각이에요. 삼각자의 직각을 대 보며 꼭짓점을 옮겨 봐요." : I.ang === "둔각" ? (want === "예각" ? "한 각이 둔각이에요. 세 각이 모두 직각보다 작아야 해요." : "") : (want === "둔각" ? "세 각이 모두 예각이에요. 한 각이 직각보다 크게 벌어지게 꼭짓점을 옮겨 봐요." : "세 각이 모두 예각이에요. 한 각이 꼭 직각이 되게 해요.");
  const made = [];
  api.provide({ words: ["꼭짓점", "칸 수", "직각", "예각", "둔각"], answers: [opt.items.map(it => it.ans || it.ask).join(" / ")] });
  const judge = () => {
    const it = opt.items[k], I = info(); api.tryOnce();
    const desc = `${T2_SIDE[I.side]}, ${T2_ANG[I.ang]}`;
    if (I.flat) { api.fail("세 점이 한 줄 위에 있어서 삼각형이 아니에요. 꼭짓점 하나를 옆으로 옮겨요.", "일직선"); return false; }
    const needs = Array.isArray(it.need) ? it.need : [it.need];
    for (const nd of needs) {
      if (typeof nd === "function") { const why = nd(I); if (why) { api.fail(why, desc); return false; } continue; }
      const [f, why] = NEED[nd];
      if (!f(I)) { api.fail(why || angWhy(I, nd === "acute" ? "예각" : nd === "obtuse" ? "둔각" : "직각"), desc); return false; }
    }
    made.push(desc);
    if (k < opt.items.length - 1) { api.hint(`○ ${it.ok || "잘 만들었어요!"} 다음 삼각형도 만들어 봐요.`); k++; if (opt.resetEach) V = opt.start.map(q => q.slice()); draw(); return false; }
    api.done(made.join(" / "), opt.ok || it.ok); return true;
  };
  const auto = autoRun(() => true, () => k + ":" + JSON.stringify(V), judge, 1200);
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, h("p", { class: "inst", style: "margin:.2em 0" }, (opt.tip || "주황 꼭짓점을 끌어 점 위에 놓아요.") + " 손을 떼고 잠깐 기다리면 저절로 확인해요."), tools)));
  draw();
}

/* =========================================================
   5. 분류하기 — 카드를 끌어 바구니(또는 표의 칸)에 넣는다. 눌러서 고른 뒤 칸을 눌러도 됨
   opt: {cats:[…]} 또는 {rows:[…], cols:[…]}, items:[{p | text, label, cat(번호 | [행,열]), why}], measure, o(그리기 설정), k
   ========================================================= */
function t2Bins(body, api, opt) {
  const two = !!opt.rows, nb = two ? opt.rows.length * opt.cols.length : opt.cats.length;
  const where = opt.items.map(() => -1), want = opt.items.map(it => Array.isArray(it.cat) ? it.cat[0] * opt.cols.length + it.cat[1] : it.cat);
  let sel = null, justDragged = false;
  const lab = i => opt.items[i].label || T2_KO[i];
  const pool = h("div", { class: "t2pool" });
  const bins = [];
  const binEl = (name, idx) => { const b = h("div", { class: "t2bin" }, name ? h("div", { class: "t2bint" }, name) : null); b.dataset.bin = idx; b.addEventListener("click", () => { if (sel != null) { put(sel, idx); sel = null; paint(); } }); bins.push(b); return b; };
  let binWrap;
  if (two) {
    binWrap = h("div", { class: "t2tbl" }, h("div", { class: "t2th" }, opt.corner || "​"), opt.cols.map(c => h("div", { class: "t2th" }, c)));
    opt.rows.forEach((r, ri) => { binWrap.append(h("div", { class: "t2th" }, r)); opt.cols.forEach((c, ci) => binWrap.append(binEl("", ri * opt.cols.length + ci))); });
  } else binWrap = h("div", { class: "t2bins" }, opt.cats.map((c, i) => binEl(c, i)));
  pool.addEventListener("click", () => { if (sel != null) { put(sel, -1); sel = null; paint(); } });
  const cards = opt.items.map((it, i) => {
    const c = h("div", { class: "t2card" + (it.p ? "" : " t2txt") });
    if (it.p) {
      const s = makeSvg(200, 160), m = t2Map(it.p, [0, 6, 200, 154, it.pad || 30], opt.k);
      s.append(t2TriG(it.p, m.P, Object.assign({ fs: 17, sw: 3.5 }, opt.o || {}, it.o || {})));
      if (opt.measure) t2Measurable(s, it.p, m.P, { fs: 17 });
      c.append(h("div", { class: "t2cl" }, lab(i)), s);
    } else c.append(it.text);
    c.addEventListener("click", e => { if (justDragged) return; e.stopPropagation(); sel = sel === i ? null : i; paint(); });
    c.addEventListener("pointerdown", e => {
      if (e.button) return;
      const sx = e.clientX, sy = e.clientY; let ghost = null, off = null;
      const mv = ev => {
        if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
          const r = c.getBoundingClientRect(); off = [sx - r.left, sy - r.top];
          ghost = c.cloneNode(true); ghost.classList.add("t2ghost"); ghost.style.width = r.width + "px"; document.body.append(ghost); c.style.opacity = ".35";
        }
        if (ghost) { ev.preventDefault(); ghost.style.left = (ev.clientX - off[0]) + "px"; ghost.style.top = (ev.clientY - off[1]) + "px"; }
      };
      const up = ev => {
        window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
        if (!ghost) return;
        ghost.remove(); c.style.opacity = ""; justDragged = true; setTimeout(() => { justDragged = false; }, 0);
        const el = document.elementFromPoint(ev.clientX, ev.clientY), b = el && el.closest(".t2bin,.t2pool");
        if (b && wrap.contains(b)) { put(i, b.classList.contains("t2pool") ? -1 : +b.dataset.bin); sel = null; paint(); }
      };
      window.addEventListener("pointermove", mv, { passive: false }); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    });
    return c;
  });
  const put = (i, b) => { where[i] = b; cards[i].classList.remove("t2good", "t2bad"); auto(); };
  const paint = () => {
    cards.forEach((c, i) => { c.classList.toggle("t2sel", sel === i); (where[i] < 0 ? pool : bins[where[i]]).append(c); });
  };
  const binName = b => two ? `${opt.rows[Math.floor(b / opt.cols.length)]}·${opt.cols[b % opt.cols.length]}` : opt.cats[b];
  const ansOf = arr => Array.from({ length: nb }, (_, b) => `${binName(b)}: ${opt.items.map((_, i) => arr[i] === b ? lab(i) : null).filter(Boolean).join(", ") || "없음"}`).join(" / ");
  api.provide({ words: two ? opt.rows.concat(opt.cols) : opt.cats, answers: [ansOf(want)] });
  const judge = () => {
    api.tryOnce(); const ans = ansOf(where);
    const bad = opt.items.map((_, i) => where[i] !== want[i] ? i : -1).filter(i => i >= 0);
    cards.forEach((c, i) => { c.classList.remove("t2good", "t2bad"); c.classList.add(bad.includes(i) ? "t2bad" : "t2good"); });
    if (!bad.length) { api.done(ans, opt.ok); return true; }
    const b0 = opt.items[bad[0]];
    api.fail(b0.why || (opt.whyOf ? opt.whyOf(b0, lab(bad[0])) : `${lab(bad[0])}${t2J(lab(bad[0]), "을", "를")} 다시 살펴봐요.`), ans); return false;
  };
  const auto = autoRun(() => where.every(w => w >= 0), () => where.join(","), judge, 1200);
  const wrap = h("div", {}, h("p", { class: "inst", style: "margin:.2em 0" }, (opt.tip ? opt.tip + " " : "") + "카드를 모두 넣으면 저절로 확인해요."), pool, binWrap);
  body.append(wrap); paint();
}
/* 카드 분류 틀린 까닭(변·각 기준) */
function t2WhyOf(kind) {
  return (it, l) => { const I = t2Info(it.p);
    if (kind === "side") return I.side === "부등변" ? `${l}의 세 변을 재어 보면 길이가 모두 달라요.` : I.side === "정" ? `${l}${t2J(l, "은", "는")} 세 변의 길이가 모두 같아요.` : `${l}${t2J(l, "은", "는")} 두 변의 길이만 같아요. 변을 눌러 길이를 재어 봐요.`;
    if (kind === "ang") return I.ang === "직각" ? `${l}에는 직각이 있어요. 세 각을 모두 살펴봐요.` : I.ang === "둔각" ? `${l}에는 둔각이 하나 있어요. 세 각을 모두 살펴봐요.` : `${l}${t2J(l, "은", "는")} 세 각이 모두 예각이에요.`;
    return `${l}${t2J(l, "은", "는")} ${T2_SIDE[I.side === "정" ? "이등변" : I.side]}이면서 ${T2_ANG[I.ang]}이에요. 변과 각을 눌러 재어 봐요.`; };
}

/* =========================================================
   6. 삼각형 이름 고르기 — 이름 단추를 모두 고른다 (6·7차시)
   items:[{fig(), label, p, opt:[선택해도 되는 이름]}], 정답은 p에서 계산
   ========================================================= */
const T2_NAMES = ["이등변삼각형", "정삼각형", "예각삼각형", "직각삼각형", "둔각삼각형"];
function t2NamesOf(p) { const I = t2Info(p), r = []; if (I.side === "이등변") r.push("이등변삼각형"); if (I.side === "정") r.push("정삼각형"); r.push(T2_ANG[I.ang]); return r; }
function t2Names(body, api, opt) {
  const rows = opt.items.map(it => {
    const on = new Set(), btns = T2_NAMES.map(n => h("button", { onclick: e => { on.has(n) ? on.delete(n) : on.add(n); e.currentTarget.classList.toggle("t2on", on.has(n)); btns.forEach(b => b.classList.remove("t2good", "t2bad")); auto(); } }, n));
    const req = t2NamesOf(it.p), opt2 = t2Info(it.p).side === "정" ? ["이등변삼각형"] : [];
    body.append(h("div", { class: "t2item" }, it.fig(), h("div", {}, h("div", { class: "jua" }, it.label), h("div", { class: "t2names" }, btns))));
    return { it, on, btns, req, opt2 };
  });
  api.provide({ words: T2_NAMES, answers: rows.map(r => `${r.it.label}: ${r.req.join(", ")}`) });
  const judge = () => {
    api.tryOnce(); let bad = null;
    rows.forEach(r => { const ok = r.req.every(n => r.on.has(n)) && [...r.on].every(n => r.req.includes(n) || r.opt2.includes(n));
      r.btns.forEach((b, j) => { if (r.on.has(T2_NAMES[j])) b.classList.add(r.req.includes(T2_NAMES[j]) || r.opt2.includes(T2_NAMES[j]) ? "t2good" : "t2bad"); });
      if (!ok && !bad) bad = r; });
    const ans = rows.map(r => `${r.it.label}: ${[...r.on].join(", ") || "-"}`).join(" / ");
    if (!bad) { api.done(ans, opt.ok); return true; }
    const I = t2Info(bad.it.p), miss = bad.req.find(n => !bad.on.has(n)), extra = [...bad.on].find(n => !bad.req.includes(n) && !bad.opt2.includes(n));
    let why;
    if (extra === "예각삼각형") why = `${bad.it.label}: 예각이 있다고 예각삼각형이 아니에요. 세 각이 모두 예각이어야 해요.`;
    else if (extra) why = `${bad.it.label}${t2J(bad.it.label, "은", "는")} ${extra}이 아니에요. ${extra.includes("등변") || extra.includes("정") ? "변의 길이" : "각의 크기"}를 다시 살펴봐요.`;
    else why = `${bad.it.label}: ${miss.includes("변") || miss.includes("정") ? "변의 길이에 따른 이름" : "각의 크기에 따른 이름"}도 골라요. 이름을 두 가지 기준으로 모두 찾아봐요.`;
    api.fail(why, ans);
  return false;
  };
  const auto = autoRun(() => rows.every(r => r.on.size >= r.req.length), () => rows.map(r => [...r.on].sort().join(",")).join("|"), judge, 1200);
  body.append(h("p", { class: "inst", style: "margin:.2em 0" }, "알맞은 이름을 모두 고르면 저절로 확인해요."));
}

/* =========================================================
   7. 각마다 예·직·둔 붙이기 (5차시) — 꼭짓점 안쪽을 누를 때마다 예 → 직 → 둔
   items:[{p, given(보기)}], 삼각자 대 보기
   ========================================================= */
function t2AngleTag(body, api, opt) {
  const CW = 240, CH = 200, per = opt.per || 3, rows = Math.ceil(opt.items.length / per), svg = makeSvg(per * (CW + 10) + 10, rows * (CH + 10) + 10);
  const TAG = ["예", "직", "둔"], st = opt.items.map(it => it.given ? t2Info(it.p).A.map(a => a < 89.95 ? 0 : a < 90.05 ? 1 : 2) : [-1, -1, -1]);
  let sq = false; const layers = [];
  opt.items.forEach((it, n) => {
    const x = 10 + (n % per) * (CW + 10), y = 10 + Math.floor(n / per) * (CH + 10), m = t2Map(it.p, [x, y + 10, CW, CH - 10, 40]), P = m.P;
    svg.append(svgEl("rect", { x, y, width: CW, height: CH, rx: 12, fill: it.given ? "#F4F7F6" : "#fff", stroke: T2_LINE, "stroke-width": 2 }));
    svg.append(t2TriG(it.p, P, { fs: 17, sw: 3.5, rights: false }), txt(x + 20, y + 20, (it.label || T2_KO[n]) + (it.given ? " (보기)" : ""), 18, { "text-anchor": "start" }));
    const lay = svgEl("g", { "pointer-events": "none" }), AA = t2Info(it.p).A, sl = [0, 1, 2].map(i => t2Dist(P[(i + 1) % 3], P[(i + 2) % 3])), ss = sl[0] + sl[1] + sl[2], Inc = [0, 1].map(c => (sl[0] * P[0][c] + sl[1] * P[1][c] + sl[2] * P[2][c]) / ss), dd = AA.map((a, i) => Math.max(26, Math.min(16 / Math.tan(t2Rad(a / 2)), .62 * t2Dist(P[i], Inc)))); layers.push({ lay, P, dd }); svg.append(lay);
    if (!it.given) [0, 1, 2].forEach(i => { const { V, b } = t2Corner(P, i), hc = svgEl("circle", { cx: t2F(V[0] + b[0] * dd[i]), cy: t2F(V[1] + b[1] * dd[i]), r: 22, fill: "rgba(0,0,0,0)", style: "cursor:pointer" });
      hc.addEventListener("click", () => { st[n][i] = (st[n][i] + 1) % 3; paint(); auto(); }); svg.append(hc); });
  });
  const paint = () => layers.forEach(({ lay, P, dd }, n) => {
    lay.innerHTML = "";
    [0, 1, 2].forEach(i => {
      const { V, u, w, b } = t2Corner(P, i);
      if (sq) lay.append(t2SqMk(P, i, 34));
      const c = [V[0] + b[0] * dd[i], V[1] + b[1] * dd[i]], v = st[n][i];
      lay.append(svgEl("rect", { x: t2F(c[0] - 15), y: t2F(c[1] - 13), width: 30, height: 26, rx: 5, fill: v < 0 ? "#fff" : "#FFF0DC", stroke: v < 0 ? T2_GRAY : TENT, "stroke-width": 2 }), txt(c[0], c[1] + 1, v < 0 ? "?" : TAG[v], 17, { fill: v < 0 ? T2_GRAY : "#7A3B08" }));
    });
  });
  const want = opt.items.map(it => t2Info(it.p).A.map(a => a < 89.95 ? 0 : a < 90.05 ? 1 : 2));
  api.provide({ words: ["예각", "직각", "둔각", "삼각자"], answers: [opt.items.map((it, n) => `${it.label || T2_KO[n]} ${want[n].map(v => TAG[v]).join("·")}`).join(", ")] });
  const judge = () => {
    api.tryOnce(); const ans = opt.items.map((it, n) => `${it.label || T2_KO[n]} ${st[n].map(v => TAG[v]).join("·")}`).join(", ");
    const bn = st.findIndex((r, n) => r.some((v, i) => v !== want[n][i]));
    if (bn < 0) { api.done(ans, opt.ok); return true; }
    const bi = st[bn].findIndex((v, i) => v !== want[bn][i]), l = opt.items[bn].label || T2_KO[bn];
    api.fail(`${l}의 ${["예각", "직각", "둔각"][st[bn][bi]]}이라고 한 각을 다시 봐요. ‘삼각자 직각 대 보기’를 눌러 직각과 비교해요.`, ans); return false;
  };
  const auto = autoRun(() => st.every(r => !r.includes(-1)), () => JSON.stringify(st), judge, 1200);
  body.append(h("div", { class: "stage" }, svg), h("div", { class: "tools" }, h("button", { onclick: e => { sq = !sq; e.currentTarget.classList.toggle("on", sq); paint(); } }, "삼각자 직각 대 보기")), h("p", { class: "inst", style: "margin:.2em 0" }, "각 안쪽의 ? 칸을 누를 때마다 예 → 직 → 둔으로 바뀌어요. ? 칸을 모두 정하면 저절로 확인해요."));
  paint();
}

/* =========================================================
   8. 색종이 접어 자르기 (3차시) — 접은 색종이에 자를 선을 정하고 잘라 펼친다
   ========================================================= */
function t2Cut(body, api, opt = {}) {
  const W = 760, H = 440, F = 380, PW = 300, top = 50, bot = 400, svg = makeSvg(W, H);
  let A = [F, 130], B = [F + 210, bot], cut = false, t = 0;
  const g = svgEl("g"); svg.append(g);
  const msg = h("div", { class: "readout", style: "font-size:var(--fs)" }, "점선은 반으로 접힌 선이에요. 주황 점 두 개를 끌어 자를 선을 정해요.");
  const draw = () => {
    g.innerHTML = "";
    if (!cut) {
      g.append(svgEl("rect", { x: F, y: top, width: PW, height: bot - top, fill: "#F7C6D0", stroke: "#C2577A", "stroke-width": 3 }));
      g.append(t2Line([F, top], [F, bot], { stroke: "#9B3A5C", "stroke-width": 3, "stroke-dasharray": "10 7" }), txt(F - 60, (top + bot) / 2, "접힌 선", 18, { fill: "#9B3A5C" }));
      g.append(svgEl("polygon", { points: t2Pts([A, [F, bot], B]), fill: "rgba(255,255,255,.35)" }));
      g.append(t2Line(A, B, { stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "8 6" }));
      g.append(txt((A[0] + B[0]) / 2 + 26, (A[1] + B[1]) / 2 - 10, "✂", 28, { fill: "#C8472E" }));
      [A, B].forEach(p => g.append(svgEl("circle", { cx: t2F(p[0]), cy: t2F(p[1]), r: 14, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" })));
    } else {
      const L = [F - (B[0] - F) * t, B[1]];
      g.append(svgEl("polygon", { points: t2Pts([A, L, [F, bot]]), fill: "#F7C6D0", stroke: "#C2577A", "stroke-width": 3 }), svgEl("polygon", { points: t2Pts([A, [F, bot], B]), fill: "#F4AFC0", stroke: "#C2577A", "stroke-width": 3 }));
      if (t >= 1) {
        g.append(t2Line(A, [F, bot], { stroke: "#9B3A5C", "stroke-width": 2, "stroke-dasharray": "8 6" }));
        g.append(t2Line(A, L, { stroke: T2_GREEN, "stroke-width": 7 }), t2Line(A, B, { stroke: T2_GREEN, "stroke-width": 7 }), t2Line(L, B, { stroke: INK, "stroke-width": 4 }));
        const P = [L, B, A];
        [0, 1].forEach(i => g.append(svgEl("path", { d: t2ArcPath(P, i, 36, true), fill: "rgba(210,70,58,.55)" })));
        const len = t2Dist(A, B) / 40, ang = Math.round(Math.atan2(bot - A[1], B[0] - F) * 180 / Math.PI);
        g.append(txt((A[0] + L[0]) / 2 - 46, (A[1] + L[1]) / 2, t2Cm(len), 18, { fill: T2_GREEN }), txt((A[0] + B[0]) / 2 + 46, (A[1] + B[1]) / 2, t2Cm(len), 18, { fill: T2_GREEN }));
        g.append(txt(L[0] + 66, bot - 18, `${ang}°`, 18, { fill: "#9B2A20" }), txt(B[0] - 66, bot - 18, `${ang}°`, 18, { fill: "#9B2A20" }));
      }
    }
  };
  let di = -1;
  dragOn(svg, q => { if (cut) return false; di = t2Dist([q.x, q.y], A) < 30 ? 0 : t2Dist([q.x, q.y], B) < 30 ? 1 : -1; return di >= 0; },
    q => { if (di === 0) A = [F, Math.max(top + 10, Math.min(bot - 90, q.y))]; else if (di === 1) B = [Math.max(F + 70, Math.min(F + PW, q.x)), bot]; draw(); }, () => { di = -1; });
  const go = () => {
    if (cut) return; cut = true; const t0 = performance.now();
    const step = now => { t = Math.min(1, (now - t0) / 900); draw(); if (t < 1) requestAnimationFrame(step); else { msg.textContent = "펼쳤더니 삼각형이 되었어요! 초록색은 겹쳐서 자른 두 변, 빨간색은 겹쳐 있던 두 각이에요."; api.done("잘라서 펼침", opt.ok || "겹쳐서 자른 두 변의 길이가 같고, 겹쳐 있던 두 각의 크기가 같아요."); } };
    requestAnimationFrame(step);
  };
  api.provide({ words: ["반으로 접기", "겹쳐서 자르기", "펼치기"], answers: [] });
  body.append(stageWrap(svg, h("div", { class: "side" }, msg, h("div", { class: "tools" }, h("button", { onclick: go }, "✂ 잘라서 펼치기"), h("button", { onclick: () => { cut = false; t = 0; draw(); msg.textContent = "다시 자를 선을 정해 보세요."; } }, "새 색종이")))));
  draw();
}

/* =========================================================
   9. 반으로 접어 포개기 (3·4차시) — 꼭짓점을 끌어 다른 꼭짓점에 겹치면 접힌다
   opt: {p, names, need(접는 방법 수), ok}
   ========================================================= */
function t2Fold(body, api, opt) {
  const W = opt.W || 720, H = opt.H || 520, svg = makeSvg(W, H), m = t2Map(opt.p, [0, 0, W, H, 80]), P0 = m.P, g = svgEl("g"); svg.append(g);
  const found = []; let drag = null, anim = null;
  const names = opt.names || ["ㄱ", "ㄴ", "ㄷ"];
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" }, `꼭짓점을 끌어 다른 꼭짓점에 겹쳐 보세요.`);
  const draw = () => {
    g.innerHTML = "";
    g.append(svgEl("polygon", { points: t2Pts(P0), fill: "#CDE7F7", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }));
    found.forEach(f => { const M = [(P0[f[0]][0] + P0[f[1]][0]) / 2, (P0[f[0]][1] + P0[f[1]][1]) / 2]; g.append(t2Line(P0[f[2]], M, { stroke: "#5E6E7A", "stroke-width": 2, "stroke-dasharray": "8 6" })); });
    if (anim) {
      const [i, j, kk] = anim.f, M = [(P0[i][0] + P0[j][0]) / 2, (P0[i][1] + P0[j][1]) / 2], K = P0[kk], d = t2Unit([M[0] - K[0], M[1] - K[1]]);
      const refl = (p, s) => { const v = [p[0] - K[0], p[1] - K[1]], pr = v[0] * d[0] + v[1] * d[1], foot = [K[0] + d[0] * pr, K[1] + d[1] * pr]; return [foot[0] + (p[0] - foot[0]) * s, foot[1] + (p[1] - foot[1]) * s]; };
      const s = 1 - 2 * anim.t, half = [K, P0[i], M].map(p => refl(p, s));
      g.append(svgEl("polygon", { points: t2Pts([K, P0[i], M]), fill: "#E9F2F8", stroke: "none" }));
      g.append(svgEl("polygon", { points: t2Pts(half), fill: anim.t > .5 ? "rgba(98,170,220,.75)" : "rgba(160,205,236,.95)", stroke: INK, "stroke-width": 3 }));
      if (anim.t >= 1) { const P = P0; [i, j].forEach(v => g.append(svgEl("path", { d: t2ArcPath(P, v, 40, true), fill: "rgba(210,70,58,.6)" }))); g.append(t2Line(K, M, { stroke: "#9B3A5C", "stroke-width": 3, "stroke-dasharray": "10 6" })); }
    }
    found.forEach(f => [f[0], f[1]].forEach(v => g.append(svgEl("path", { d: t2ArcPath(P0, v, 26, false), fill: "none", stroke: T2_RED, "stroke-width": 4 }))));
    P0.forEach((p, i) => { const { b } = t2Corner(P0, i); g.append(svgEl("circle", { cx: t2F(p[0]), cy: t2F(p[1]), r: 14, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }), txt(p[0] - b[0] * 34, p[1] - b[1] * 34, names[i], 24)); });
    if (drag) g.append(svgEl("circle", { cx: t2F(drag.q[0]), cy: t2F(drag.q[1]), r: 16, fill: "rgba(228,122,56,.6)", stroke: TENT, "stroke-width": 2 }), t2Line(P0[drag.i], drag.q, { stroke: TENT, "stroke-width": 2, "stroke-dasharray": "5 5" }));
  };
  const fold = (i, j) => {
    const kk = 3 - i - j, ok = Math.abs(t2Dist(P0[kk], P0[i]) - t2Dist(P0[kk], P0[j])) < 1;
    if (!ok) { out.textContent = `꼭짓점 ${names[i]}과 ${names[j]}을 겹치면 반으로 딱 맞게 포개어지지 않아요. 다른 꼭짓점끼리 겹쳐 봐요.`; draw(); return; }
    const key = [Math.min(i, j), Math.max(i, j), kk];
    const t0 = performance.now(); anim = { f: [i, j, kk], t: 0 };
    const step = now => { anim.t = Math.min(1, (now - t0) / 800); draw(); if (anim.t < 1) return requestAnimationFrame(step);
      if (!found.some(f => f[0] === key[0] && f[1] === key[1])) found.push(key);
      out.textContent = `반으로 접었더니 꼭짓점 ${names[i]}과 ${names[j]}이 만나고, 두 각(빨간색)이 꼭 포개어졌어요. (접는 방법 ${found.length}가지)`;
      setTimeout(() => { anim = null; draw(); if (found.length >= opt.need) api.done(`접는 방법 ${found.length}가지`, opt.ok); }, 1100); };
    requestAnimationFrame(step);
  };
  dragOn(svg, q => { if (anim) return false; const i = P0.findIndex(p => Math.hypot(p[0] - q.x, p[1] - q.y) < 34); if (i < 0) return false; drag = { i, q: [q.x, q.y] }; return true; },
    q => { if (!drag) return; drag.q = [q.x, q.y]; draw(); },
    () => { if (!drag) return; const d = drag; drag = null; const j = P0.findIndex((p, jj) => jj !== d.i && Math.hypot(p[0] - d.q[0], p[1] - d.q[1]) < 46); if (j >= 0) fold(d.i, j); else draw(); });
  api.provide({ words: ["반으로 접기", "포개어지는 두 각"], answers: [] });
  body.append(stageWrap(svg, h("div", { class: "side" }, out, h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || `주황 꼭짓점 하나를 끌어 다른 꼭짓점 위에 놓으면 종이가 반으로 접혀요. ${opt.need > 1 ? `서로 다른 방법 ${opt.need}가지로 접어 보세요.` : ""}`))));
  draw();
}

/* =========================================================
   10. 밀어 보기 — 사각형 틀과 삼각형 틀 (7차시)
   ========================================================= */
function t2Rigid(body, api, opt = {}) {
  const W = 860, H = 380, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const L = 200, B1 = [[60, 330], [260, 330]], B2 = [[520, 330], [760, 330]];
  let th = 0, shake = 0; const tried = new Set();
  const draw = () => {
    g.innerHTML = "";
    g.append(svgEl("rect", { x: 0, y: 340, width: W, height: 40, fill: "#E9E2D3" }));
    const s = Math.sin(t2Rad(th)), c = Math.cos(t2Rad(th)), T1 = [B1[0][0] + L * s, 330 - L * c], T2 = [B1[1][0] + L * s, 330 - L * c];
    const sq = [B1[0], B1[1], T2, T1];
    [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(([a, b]) => g.append(t2Line(sq[a], sq[b], { stroke: "#8A6A3A", "stroke-width": 12 })));
    sq.forEach(p => g.append(svgEl("circle", { cx: t2F(p[0]), cy: t2F(p[1]), r: 8, fill: "#5A4A20" })));
    const ap = [640 + shake, 330 - 200];
    [[B2[0], B2[1]], [B2[1], ap], [ap, B2[0]]].forEach(([a, b]) => g.append(t2Line(a, b, { stroke: "#8A6A3A", "stroke-width": 12 })));
    [B2[0], B2[1], ap].forEach(p => g.append(svgEl("circle", { cx: t2F(p[0]), cy: t2F(p[1]), r: 8, fill: "#5A4A20" })));
    g.append(svgEl("circle", { cx: t2F((T1[0] + T2[0]) / 2), cy: t2F(T1[1]), r: 18, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }), svgEl("circle", { cx: t2F(ap[0]), cy: t2F(ap[1]), r: 18, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }));
    g.append(txt(160, 30, "사각형 틀", 22), txt(640, 30, "삼각형 틀", 22));
  };
  let mode = null, x0 = 0;
  dragOn(svg, q => { if (q.x < 430) { mode = "sq"; x0 = q.x - L * Math.sin(t2Rad(th)); } else { mode = "tri"; x0 = q.x; } return true; },
    q => { if (mode === "sq") { th = Math.max(-50, Math.min(50, Math.asin(Math.max(-1, Math.min(1, (q.x - x0) / L))) * 180 / Math.PI)); if (Math.abs(th) > 15) tried.add("sq"); }
      else { shake = Math.max(-4, Math.min(4, (q.x - x0) * .03)); if (Math.abs(q.x - x0) > 40) tried.add("tri"); } draw(); },
    () => { shake = 0; draw(); if (tried.size === 2) { out.textContent = "사각형 틀은 옆에서 밀면 찌그러지지만, 삼각형 틀은 모양이 그대로예요!"; api.done("사각형은 찌그러지고 삼각형은 그대로", opt.ok); } });
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" }, "두 틀의 주황 손잡이를 각각 옆으로 끌어 밀어 보세요.");
  api.provide({ words: ["튼튼한 모양", "삼각형"], answers: [] });
  body.append(stageWrap(svg, h("div", { class: "side" }, out, h("div", { class: "tools" }, h("button", { onclick: () => { th = 0; draw(); } }, "사각형 틀 바로 세우기")))));
  draw();
}

/* =========================================================
   11. 보물 상자 길 찾기 (9차시) — 옳으면 오른쪽, 옳지 않으면 아래로
   ========================================================= */
function t2Path(body, api, opt) {
  const S = opt.stmts, n = S.length, cell = 70, W = 120 + cell * n + 60, H = 90 + cell * n + 70, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const ansOf = S.map(s => s.t), pick = [];
  const want = ansOf.filter(t => !t).length;
  const cur = h("div", { class: "t2stmt" }), cnt = h("div", { class: "jua" });
  const draw = () => {
    g.innerHTML = "";
    for (let r = 0; r <= n; r++) for (let c = 0; c <= n - r; c++) { const x = 80 + c * cell, y = 70 + r * cell; if (c < n - r) g.append(t2Line([x, y], [x + cell, y], { stroke: "#E3D8C3", "stroke-width": 8 })); if (r < n - c) g.append(t2Line([x, y], [x, y + cell], { stroke: "#E3D8C3", "stroke-width": 8 })); }
    for (let r = 0; r <= n; r++) { const c = n - r, x = 80 + c * cell, y = 70 + r * cell; g.append(svgEl("rect", { x: x - 22, y: y - 16, width: 44, height: 32, rx: 6, fill: r === want ? "#F2C14E" : "#D9C7A2", stroke: "#8A6A3A", "stroke-width": 2 }), txt(x, y + 30, `${r + 1}`, 16, { fill: "#8A6A3A" })); }
    let x = 80, y = 70; const path = [[x, y]];
    pick.forEach(v => { if (v) x += cell; else y += cell; path.push([x, y]); });
    g.append(svgEl("polyline", { points: t2Pts(path), fill: "none", stroke: TENT, "stroke-width": 8, "stroke-linecap": "round", "stroke-linejoin": "round" }));
    g.append(txt(80, 40, "출발", 20), svgEl("circle", { cx: x, cy: y, r: 12, fill: TENT, stroke: "#fff", "stroke-width": 3 }));
    g.append(txt(W - 70, 40, "옳으면 →", 18, { fill: "#2B6FB8" }), txt(60, H - 20, "옳지 않으면 ↓", 18, { fill: "#C8472E", "text-anchor": "start" }));
    cur.textContent = pick.length < n ? `${pick.length + 1}. ${S[pick.length].q}` : "도착했어요! 보물 상자를 확인해요.";
    cnt.textContent = `${pick.length} / ${n}`;
  };
  const choose = v => { if (pick.length >= n) return; pick.push(v); draw(); if (pick.length === n) judge(); };
  const judge = () => {
    api.tryOnce();
    const bad = pick.findIndex((v, i) => v !== ansOf[i]), ans = pick.map(v => v ? "○" : "×").join("");
    if (bad < 0) return api.done(ans, opt.ok);
    api.fail(`${bad + 1}번 설명을 다시 생각해 봐요. ${S[bad].why || ""} ‘처음부터’를 눌러 다시 길을 찾아요.`, ans);
  };
  api.provide({ words: ["옳다", "옳지 않다"], answers: [ansOf.map(t => t ? "○" : "×").join("")] });
  body.append(stageWrap(svg, h("div", { class: "side" }, cnt, cur, h("div", { class: "tools" }, h("button", { onclick: () => choose(true) }, "옳아요 →"), h("button", { onclick: () => choose(false) }, "옳지 않아요 ↓"), h("button", { onclick: () => { pick.length = 0; draw(); } }, "처음부터")))));
  draw();
}

/* =========================================================
   12. 유클리드의 정삼각형 그리기 (9차시)
   ========================================================= */
function t2Euclid(body, api, opt = {}) {
  const W = 720, H = 460, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const A = [250, 320], B = [450, 320], r = 200, X = [350, 320 - 200 * Math.sqrt(3) / 2];
  let cA = 0, cB = 0, done = false;
  const draw = () => {
    g.innerHTML = "";
    const arc = (C, t) => { if (!t) return; const s = t2Pt(C, 0, r), e = t2Pt(C, 360 * t - .01, r); g.append(svgEl("path", { d: `M${t2F(s[0])},${t2F(s[1])} A${r},${r} 0 ${t > .5 ? 1 : 0} 0 ${t2F(e[0])},${t2F(e[1])}`, fill: "none", stroke: T2_SKY, "stroke-width": 2.5 })); };
    arc(A, cA); arc(B, cB);
    if (done) g.append(svgEl("polygon", { points: t2Pts([A, B, X]), fill: "rgba(228,122,56,.25)", stroke: TENT, "stroke-width": 5 }));
    g.append(t2Line(A, B, { "stroke-width": 5 }));
    [[A, "ㄱ"], [B, "ㄴ"]].forEach(([p, nm]) => g.append(svgEl("circle", { cx: p[0], cy: p[1], r: 6, fill: INK }), txt(p[0], p[1] + 28, nm, 22)));
    if (cA >= 1 && cB >= 1 && !done) g.append(svgEl("circle", { cx: t2F(X[0]), cy: t2F(X[1]), r: 16, fill: "rgba(228,122,56,.25)", stroke: TENT, "stroke-width": 3, "stroke-dasharray": "4 3" }));
    if (done) { g.append(txt(X[0], X[1] - 26, "ㄷ", 22)); g.append(txt((A[0] + X[0]) / 2 - 36, (A[1] + X[1]) / 2, "5 cm", 18, { fill: "#1D4E80" }), txt((B[0] + X[0]) / 2 + 36, (B[1] + X[1]) / 2, "5 cm", 18, { fill: "#1D4E80" }), txt(350, 346, "5 cm", 18, { fill: "#1D4E80" })); }
  };
  const anim = which => { const t0 = performance.now(); const step = now => { const t = Math.min(1, (now - t0) / 900); if (which === "A") cA = t; else cB = t; draw(); if (t < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  svg.addEventListener("click", e => { if (done || cA < 1 || cB < 1) return; const q = svgPt(svg, e); if (t2Dist([q.x, q.y], X) < 30) { done = true; draw(); msg.textContent = "세 점을 이었어요. 세 변이 모두 반지름(5 cm)과 같아요."; api.done("정삼각형", opt.ok); } else msg.textContent = "두 원이 만나는 점(위쪽)을 눌러요."; });
  const msg = h("div", { class: "readout", style: "font-size:var(--fs)" }, "선분 ㄱㄴ의 길이는 5 cm예요. 단추를 눌러 원을 그려 보세요.");
  api.provide({ words: ["원", "반지름", "만나는 점"], answers: [] });
  body.append(stageWrap(svg, h("div", { class: "side" }, msg, h("div", { class: "tools" }, h("button", { onclick: () => anim("A") }, "ㄱ을 중심으로 원 그리기"), h("button", { onclick: () => anim("B") }, "ㄴ을 중심으로 원 그리기")), h("p", { class: "inst", style: "margin:.2em 0" }, "두 원을 모두 그린 뒤, 두 원이 만나는 점을 눌러 선분의 양 끝과 이어요."))));
  draw();
}

/* =========================================================
   13. 삼각형 분류하며 달려요 (8차시) — 카드 한 장을 각 바구니와 변 바구니에 하나씩
   opt: {cards:[p…], ok}
   ========================================================= */
function t2Relay(body, api, opt) {
  const L = ["예각삼각형", "직각삼각형", "둔각삼각형"], R = ["이등변삼각형", "정삼각형", "세 변의 길이가 모두 다른 삼각형"];
  const want = opt.cards.map(p => { const I = t2Info(p); return [L.indexOf(T2_ANG[I.ang]), I.side === "정" ? 1 : I.side === "이등변" ? 0 : 2]; });
  let k = -1, t0 = 0, pen = 0, timer = null, a = -1, b = -1; const log = [];
  const clock = h("div", { class: "t2big" }, "0.0초"), cardBox = h("div", { class: "t2fig", style: "max-width:22em" }), info = h("div", { class: "jua" });
  const lb = L.map((n, i) => h("button", { onclick: () => { if (k < 0 || k >= opt.cards.length) return; a = i; mark(); } }, n));
  const rb = R.map((n, i) => h("button", { onclick: () => { if (k < 0 || k >= opt.cards.length) return; b = i; mark(); } }, n));
  const mark = () => { lb.forEach((x, i) => x.classList.toggle("on", a === i)); rb.forEach((x, i) => x.classList.toggle("on", b === i)); if (a >= 0 && b >= 0) setTimeout(judge, 250); };
  const show = () => { cardBox.innerHTML = ""; if (k >= opt.cards.length) return; const p = opt.cards[k], s = makeSvg(360, 250), m = t2Map(p, [0, 10, 360, 240, 50]); s.append(t2TriG(p, m.P, { fs: 20, lens: true, angs: true })); cardBox.append(s); info.textContent = `카드 ${k + 1} / ${opt.cards.length}`; };
  const judge = () => {
    if (k < 0 || k >= opt.cards.length || a < 0 || b < 0) return;
    const w = want[k], okA = a === w[0], okB = b === w[1];
    if (!okA || !okB) { pen += 5 * ((okA ? 0 : 1) + (okB ? 0 : 1)); log.push(`카드 ${k + 1}: ${!okA ? L[w[0]] : ""}${!okA && !okB ? ", " : ""}${!okB ? R[w[1]] : ""}에 넣어야 해요(+${5 * ((okA ? 0 : 1) + (okB ? 0 : 1))}초)`); api.hint(`× ${log[log.length - 1]}`); }
    else api.hint(`○ 카드 ${k + 1}: ${L[w[0]]}, ${R[w[1]]}`);
    a = b = -1; mark(); k++; show();
    if (k >= opt.cards.length) finish();
  };
  const finish = () => {
    clearInterval(timer); const tt = (performance.now() - t0) / 1000, total = tt + pen;
    clock.textContent = `걸린 시간 ${tt.toFixed(1)}초 + 벌점 ${pen}초 = ${total.toFixed(1)}초`;
    api.tryOnce();
    if (!pen) return api.done(`${total.toFixed(1)}초, 벌점 없음`, opt.ok || `모든 카드를 바르게 분류했어요! 기록 ${total.toFixed(1)}초`);
    api.fail(`잘못 분류한 카드가 있어요. ${log.join(" / ")} ‘출발!’을 눌러 한 판 더 해 봐요.`, `${total.toFixed(1)}초, 벌점 ${pen}초`);
  };
  const start = () => { clearInterval(timer); k = 0; pen = 0; log.length = 0; a = b = -1; mark(); t0 = performance.now(); show(); api.hint("달려요! 카드를 각 바구니 하나, 변 바구니 하나에 넣어요.");
    timer = setInterval(() => { if (!document.body.contains(clock)) return clearInterval(timer); if (k < opt.cards.length) clock.textContent = `${((performance.now() - t0) / 1000).toFixed(1)}초 · 벌점 ${pen}초`; }, 100); };
  api.provide({ words: L.concat(R), answers: [opt.cards.map((_, i) => `${i + 1}: ${L[want[i][0]]}, ${R[want[i][1]]}`).join(" / ")] });
  body.append(h("div", { class: "tools" }, h("button", { onclick: start }, "출발!"), clock), info, cardBox,
    h("div", { class: "jua" }, "왼쪽 바구니 (각의 크기)"), h("div", { class: "tools" }, lb), h("div", { class: "jua" }, "오른쪽 바구니 (변의 길이)"), h("div", { class: "tools" }, rb));
}

/* =========================================================
   14. 주사위 놀이 (8차시 또 다른 놀이)
   ========================================================= */
const T2_DIE = ["이등변삼각형", "정삼각형", "세 변의 길이가 모두 다른 삼각형", "예각삼각형", "직각삼각형", "둔각삼각형"];
function t2Fits(p, face) { const I = t2Info(p); return [I.side !== "부등변", I.side === "정", I.side === "부등변", I.ang === "예각", I.ang === "직각", I.ang === "둔각"][face]; }
function t2Dice(body, api, opt) {
  const left = opt.cards.map((_, i) => i); let face = -1, rolls = 0, tries = 0;
  const die = h("div", { class: "t2hand" }, "?"), faceTxt = h("div", { class: "t2big" }, "주사위를 굴려요."), grid = h("div", { class: "t2row" });
  const cardEls = opt.cards.map((p, i) => { const s = makeSvg(260, 200), m = t2Map(p, [0, 4, 260, 196, 30]); s.append(t2TriG(p, m.P, { fs: 21, ticks: true, angs: true, sw: 3 }));
    const b = h("button", { class: "opt", style: "flex:1 1 11em;max-width:15em;padding:.2em", onclick: () => put(i) }, h("div", { class: "jua", style: "text-align:center" }, T2_KO[i]), s); return b; });
  grid.append(...cardEls);
  const put = i => {
    if (face < 0) return api.hint("먼저 주사위를 굴려요.");
    if (!left.includes(i)) return;
    if (!t2Fits(opt.cards[i], face)) { tries++; return api.hint(`× 카드 ${T2_KO[i]}${t2J(T2_KO[i], "은", "는")} ${T2_DIE[face]}이 아니에요. 다시 골라요.`); }
    left.splice(left.indexOf(i), 1); cardEls[i].disabled = true; cardEls[i].style.opacity = ".35";
    api.hint(`○ 카드 ${T2_KO[i]}${t2J(T2_KO[i], "을", "를")} 내려놓았어요.${face === 0 && t2Info(opt.cards[i]).side === "정" ? " 정삼각형도 두 변의 길이가 같아요." : ""}`); face = -1; die.textContent = "?"; faceTxt.textContent = "주사위를 굴려요.";
    if (!left.length) { api.tryOnce(); api.done(`주사위 ${rolls}번`, `카드 ${opt.cards.length}장을 모두 내려놓았어요! 주사위를 ${rolls}번 굴렸어요.`); }
  };
  const roll = () => { if (face >= 0) return api.hint("나온 눈에 맞는 카드를 내려놓거나 ‘낼 카드가 없어요’를 눌러요."); face = Math.floor(Math.random() * 6); rolls++; die.textContent = String(face + 1); faceTxt.textContent = `${face + 1}: ${T2_DIE[face]}`; api.hint(""); };
  const none = () => { if (face < 0) return api.hint("먼저 주사위를 굴려요."); if (left.some(i => t2Fits(opt.cards[i], face))) return api.hint("낼 수 있는 카드가 있어요. 다시 찾아봐요."); api.hint("낼 카드가 없어서 다음 차례로 넘어가요."); face = -1; die.textContent = "?"; faceTxt.textContent = "주사위를 굴려요."; };
  api.provide({ words: T2_DIE, answers: [] });
  body.append(h("div", { class: "tools" }, die, h("button", { onclick: roll }, "🎲 주사위 굴리기"), h("button", { onclick: none }, "낼 카드가 없어요")), faceTxt,
    h("p", { class: "inst", style: "margin:.2em 0" }, "1 이등변삼각형 · 2 정삼각형 · 3 세 변의 길이가 모두 다른 삼각형 · 4 예각삼각형 · 5 직각삼각형 · 6 둔각삼각형"), grid);
}

/* 문제 그림: 삼각형 하나(값 표시) */
function t2One(p, o = {}, W = 420, H = 300, maxW = "20em") { return () => t2Fig(W, H, s => { const m = t2Map(p, [0, 0, W, H, o.pad || 56]); s.append(t2TriG(p, m.P, Object.assign({ fs: 22 }, o))); }, maxW); }
function t2Two(a, b, oa = {}, ob = {}) { return () => t2Fig(840, 320, s => { [[a, oa, 0], [b, ob, 420]].forEach(([p, o, x]) => { const m = t2Map(p, [x, 0, 420, 320, o.pad || 60]); s.append(t2TriG(p, m.P, Object.assign({ fs: 22 }, o))); }); }, "38em"); }

/* =========================================================
   15. 그림 속 삼각형 표시하기 (2차시 돛단배) — 자로 재고, 빨간 테두리·초록 칠
   opt: {W,H,k, base:[x0,y0](cm 0,0의 화면 자리), deco(s, X), tris:[{p}], red:[…], green:[…], ok}
   ========================================================= */
function t2Scene(body, api, opt) {
  const W = opt.W, H = opt.H, k = opt.k, svg = makeSvg(W, H), X = v => [opt.base[0] + v[0] * k, opt.base[1] - v[1] * k];
  if (opt.deco) opt.deco(svg, X);
  const layer = svgEl("g"), hitS = svgEl("g"), lab = svgEl("g", { "pointer-events": "none" }); svg.append(layer, hitS, lab);
  const red = new Set(), green = new Set(), shown = new Set(); let mode = 0;
  const PP = opt.tris.map(t => t.p.map(X));
  const draw = () => {
    layer.innerHTML = ""; lab.innerHTML = "";
    PP.forEach((P, n) => {
      const pg = svgEl("polygon", { points: t2Pts(P), fill: green.has(n) ? "rgba(36,150,90,.75)" : (opt.tris[n].fill || "#fff"), stroke: red.has(n) ? T2_RED : INK, "stroke-width": red.has(n) ? 6 : 2.5, "stroke-linejoin": "round", style: "cursor:pointer" });
      pg.addEventListener("click", () => { if (mode === 1) tog(red, n); else if (mode === 2) tog(green, n); else return api.hint("자로 잴 때는 변을 눌러요."); draw(); auto(); });
      layer.append(pg);
    });
    shown.forEach(key => { const [n, i] = key.split(",").map(Number), P = PP[n], A = P[i], B = P[(i + 1) % 3], C = t2Cen(P), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], nn = t2Unit([M[0] - C[0], M[1] - C[1]]), q = [M[0] + nn[0] * 20, M[1] + nn[1] * 20];
      lab.append(svgEl("rect", { x: t2F(q[0] - 44), y: t2F(q[1] - 12), width: 88, height: 24, rx: 6, fill: "rgba(255,255,255,.95)", stroke: "#1D4E80", "stroke-width": 1.2 }), txt(q[0], q[1], t2Cm(t2Info(opt.tris[n].p).L[i]), 16, { fill: "#1D4E80" })); });
    hitS.style.display = mode === 0 ? "" : "none";
  };
  PP.forEach((P, n) => [0, 1, 2].forEach(i => { const ln = t2Line(P[i], P[(i + 1) % 3], { stroke: "rgba(0,0,0,0)", "stroke-width": 16, style: "cursor:pointer" }); ln.addEventListener("click", () => { tog(shown, `${n},${i}`); draw(); }); hitS.append(ln); }));
  const tog = (set, x) => set.has(x) ? set.delete(x) : set.add(x);
  const mB = ["📏 자로 재기", "🟥 빨간 테두리", "🟩 초록 칠"].map((t, j) => h("button", { onclick: () => { mode = j; mB.forEach((b, jj) => b.classList.toggle("on", jj === mode)); draw(); } }, t));
  mB[0].classList.add("on");
  const same = (a, b) => a.size === b.length && b.every(x => a.has(x));
  api.provide({ words: ["이등변삼각형", "정삼각형", "빨간색", "초록색"], answers: [`빨간 테두리 ${opt.red.length}개, 초록 칠 ${opt.green.length}개`] });
  body.append(stageWrap(svg, h("div", { class: "side" }, h("div", { class: "tools" }, mB), h("p", { class: "inst", style: "margin:.2em 0" }, "자로 재기: 변을 눌러 길이를 재요. 빨간 테두리·초록 칠: 삼각형 안을 누르면 표시되고, 다시 누르면 지워져요."),
    h("p", { class: "inst", style: "margin:.2em 0" }, "표시를 마치고 잠깐 기다리면 저절로 확인해요."))));
  const judge = () => {
      api.tryOnce(); const ans = `빨간 테두리 ${red.size}개, 초록 칠 ${green.size}개`;
      if (same(red, opt.red) && same(green, opt.green)) { api.done(ans, opt.ok); return true; }
      const kinds = opt.tris.map(t => t2Info(t.p).side);
      let why;
      if ([...green].some(n => kinds[n] !== "정")) why = "초록색으로 칠한 것 중에 세 변의 길이가 모두 같지 않은 삼각형이 있어요. 자로 재어 봐요.";
      else if (opt.green.some(n => !green.has(n))) why = "세 변의 길이가 같은 삼각형을 모두 찾아 초록색으로 칠해요.";
      else if ([...red].some(n => kinds[n] === "부등변")) why = "빨간 테두리를 한 것 중에 세 변의 길이가 모두 다른 삼각형이 있어요.";
      else if (opt.red.some(n => !red.has(n) && kinds[n] === "정")) why = "정삼각형도 두 변의 길이가 같아요. 정삼각형에도 빨간 테두리를 할 수 있을까요?";
      else why = "두 변의 길이가 같은 삼각형을 더 찾아 빨간 테두리를 해요. 작은 삼각형도 재어 봐요.";
      api.fail(why, ans); return false;
  };
  const nIsoOnly = opt.red.filter(n => !opt.green.includes(n)).length;
  const auto = autoRun(() => green.size >= opt.green.length && red.size >= nIsoOnly, () => [...red].sort() + "|" + [...green].sort(), judge, 1200);
  draw();
}

/* =========================================================
   16. 구조물 그림 (7차시) — 강조한 삼각형은 cm 모형 그대로, 둘레의 구조물은 꾸밈
   ========================================================= */
function t2Struct(kind, p, label) {
  return () => t2Fig(380, 280, s => {
    const sky = { tower: "#EAF4FB", station: "#EEF2F7", bridge: "#E8F3F7", wheel: "#F1F7EE", museum: "#F6F1EA", dome: "#EEF6EE" }[kind];
    s.append(svgEl("rect", { x: 0, y: 0, width: 380, height: 280, fill: sky }));
    const ln = (a, b, w = 4, c = "#6B7A85") => s.append(t2Line(a, b, { stroke: c, "stroke-width": w }));
    const box = { tower: [140, 70, 140, 150, 6], station: [40, 40, 300, 140, 8], bridge: [95, 95, 190, 120, 6], wheel: [100, 50, 180, 170, 4], museum: [110, 30, 160, 230, 6], dome: [150, 70, 130, 140, 6] }[kind];
    const P = t2Map(p, box).P;
    if (kind === "tower") { ln([150, 270], [190, 30], 5); ln([270, 270], [230, 30], 5); ln([120, 70], [300, 70], 5); ln([135, 120], [285, 120], 4); for (let y = 30; y < 260; y += 40) { ln([150 + (270 - y) / 6, y], [270 - (270 - y - 40) / 6, y + 40], 2); ln([270 - (270 - y) / 6, y], [150 + (270 - y - 40) / 6, y + 40], 2); } }
    if (kind === "station") { ln([20, 230], [360, 230], 6); for (let x = 50; x < 360; x += 60) ln([x, 230], [x, 180], 3); s.append(svgEl("path", { d: "M20,180 Q190,60 360,180", fill: "none", stroke: "#6B7A85", "stroke-width": 4 })); }
    if (kind === "bridge") { ln([10, 215], [370, 215], 8, "#7A3B2E"); ln([10, 95], [370, 95], 6, "#7A3B2E"); for (let x = 10; x < 370; x += 90) { ln([x, 215], [x + 45, 95], 4, "#9C4A3A"); ln([x + 45, 95], [x + 90, 215], 4, "#9C4A3A"); } s.append(svgEl("rect", { x: 0, y: 225, width: 380, height: 55, fill: "#BFD9EA" })); }
    if (kind === "wheel") { const C = t2Cen(P), R = Math.max(...P.map(q => t2Dist(q, C))); s.append(svgEl("circle", { cx: t2F(C[0]), cy: t2F(C[1]), r: t2F(R), fill: "none", stroke: "#6B7A85", "stroke-width": 5 })); for (let a = 0; a < 360; a += 30) ln(C, t2Pt(C, a, R), 2); ln(C, [C[0] - 60, 270], 6); ln(C, [C[0] + 60, 270], 6); }
    if (kind === "museum") { s.append(svgEl("rect", { x: 40, y: 230, width: 300, height: 40, fill: "#D8CDBE" })); ln([60, 230], [60, 150], 3); ln([320, 230], [320, 150], 3); ln([60, 150], [320, 150], 3); }
    if (kind === "dome") { s.append(svgEl("path", { d: "M30,260 Q30,40 190,40 Q350,40 350,260 Z", fill: "#DDEFE0", stroke: "#6B7A85", "stroke-width": 4 })); for (let x = 70; x < 330; x += 40) ln([x, 260], [x + 20, 70], 1.5, "#9AB3A0"); for (let y = 90; y < 260; y += 40) ln([40, y], [340, y], 1.5, "#9AB3A0"); }
    const g = svgEl("g"); g.append(t2TriG(p, P, { fill: "rgba(255,183,77,.7)", stroke: "#C2410C", sw: 5, fs: 16 })); s.append(g);
    t2Measurable(s, p, P, { fs: 16 });
    s.append(svgEl("rect", { x: 8, y: 8, width: 150, height: 30, rx: 8, fill: "rgba(255,255,255,.9)" }), txt(83, 24, label, 17));
  }, "17em");
}
