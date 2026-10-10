//@@APP
const APP={title:"우리 반 학교 지도 만들기", unit:"4-2 수학 4. 사각형", key:"s42-quad-v1", welcome:"우리 반 학교 지도 만들기 교실에 온 것을 환영해요", intro:"푸른숲초등학교 4학년 2반이 학교 지도를 만들어요. 서로 수직인 복도와 평행한 복도를 찾고, 복도 폭(평행선 사이의 거리)을 재고, 화단·창문·주차 칸·타일 모양의 사다리꼴·평행사변형·마름모를 알아내어 지도 기호로 정리해요."};
//@@UNIT
/* =========================================================
   4-2 4. 사각형 — 단원 조작 부품 (앞글자 q4)
   도형 좌표는 화면 방향(y 아래쪽)이에요. 점 종이 도형은 정수 좌표(1칸 = 1 cm)로 만들어
   평행·수직·길이를 정확히 판정하고, 이름(사다리꼴·평행사변형·마름모·직사각형·정사각형)은 모두 좌표에서 계산합니다.
   ========================================================= */
(function () {
  const s = document.createElement("style"); s.id = "q4-style";
  s.textContent = `
.q4fig{margin:.3em 0}
.q4fig svg{width:100%;height:auto;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:12px}
.q4row{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-start}
.q4row>.q4fig{flex:1 1 14em;min-width:0}
.q4part+.q4part{margin-top:.8em;padding-top:.6em;border-top:2px dashed var(--line)}
.q4pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:5em;padding:.45em;margin:.4em 0;border:2px dashed var(--line);border-radius:12px;background:#FBFCFB}
.q4bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(13em,1fr));gap:.55em}
.q4bin{border:2px dashed var(--line);border-radius:12px;padding:.4em;min-height:8em;background:#fff;min-width:0;display:flex;flex-wrap:wrap;gap:.35em;align-content:flex-start;cursor:pointer}
.q4bint{flex:1 1 100%;font-family:"Jua";color:var(--night);word-break:keep-all}
.q4card{border:2px solid var(--line);background:#fff;border-radius:.7em;padding:.2em;width:8.4em;max-width:100%;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}
.q4card svg{width:100%;height:auto;display:block}
.q4card .q4cl{font-family:"Jua";text-align:center;color:var(--night)}
.q4card.q4sel{border-color:var(--ring);background:var(--ring-soft)}
.q4card.q4good{border-color:var(--ok);background:#E3F4EA}
.q4card.q4bad{border-color:var(--no);background:#FBE7E2}
.q4ghost{position:fixed;z-index:60;pointer-events:none;opacity:.88;box-shadow:0 8px 20px rgba(0,0,0,.18)}
.q4names{display:flex;flex-wrap:wrap;gap:.35em;margin:.3em 0}
.q4names button{border:2px solid var(--line);background:#fff;border-radius:999px;padding:.25em .8em;word-break:keep-all}
.q4names button.q4on{background:var(--night);color:#fff;border-color:var(--night)}
.q4names button.q4ok{border-color:var(--ok);background:#E3F4EA}
.q4names button.q4no{border-color:var(--no);background:#FBE7E2}
.q4tbl{display:grid;gap:.3em;margin:.3em 0}
.q4tbl .q4th{font-family:"Jua";color:var(--night);background:#F2F5F4;border-radius:10px;padding:.25em .3em;word-break:keep-all;display:flex;align-items:center;justify-content:center;text-align:center;min-width:0}
.q4tbl .q4th svg{width:100%;height:auto;display:block}
.q4tbl .q4rh{justify-content:flex-start;text-align:left;font-family:"Gowun Dodum";color:var(--ink);background:#FBFCFB;border:1px solid var(--line)}
.q4cell{border:2px solid var(--line);background:#fff;border-radius:10px;min-height:2.4em;font-family:"Jua";font-size:1.3em;color:var(--tent);min-width:0;padding:0}
.q4cell.q4good{border-color:var(--ok);background:#E3F4EA}
.q4cell.q4bad{border-color:var(--no);background:#FBE7E2}
.q4strips{display:flex;flex-wrap:wrap;gap:.4em;align-items:center}
.q4strip{height:1.6em;border-radius:.35em;border:2px solid #8A6A3A;background:#FBD25B;padding:0;font-family:"Jua";font-size:.9em;color:#5A4A20}
.q4strip.q4used{opacity:.35}
.q4stmt{display:flex;flex-wrap:wrap;align-items:center;gap:.4em;padding:.35em .6em;border-radius:.7em;border:2px solid var(--line);background:#fff;margin:.3em 0;word-break:keep-all}
.q4stmt>span{flex:1 1 14em;min-width:0}
.q4stmt button{border:2px solid var(--line);background:#fff;border-radius:999px;padding:.15em .8em}
.q4stmt button.q4on{background:var(--night);color:#fff;border-color:var(--night)}
.q4stmt.q4good{border-color:var(--ok)}
.q4stmt.q4bad{border-color:var(--no)}
.q4hand{display:flex;flex-wrap:wrap;gap:.4em;margin:.3em 0}
.q4gc{border:2px solid var(--line);background:#fff;border-radius:.6em;width:7.6em;min-height:6.4em;padding:.25em;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.15em;font-size:.88em;word-break:keep-all;text-align:center;line-height:1.3}
.q4gc svg{width:100%;height:auto;display:block}
.q4gc.q4desc{background:#FFF8E8;border-color:#E2C78A}
.q4gc.q4sel{border-color:var(--ring);background:var(--ring-soft)}
.q4pile{display:flex;flex-wrap:wrap;gap:1em;align-items:center;margin:.3em 0}
.q4pile .q4gc{width:9em;min-height:7.6em;font-size:1em;cursor:default}
.q4log{font-size:var(--fs-s);color:var(--muted);min-height:1.4em}
.q4qs{display:flex;flex-wrap:wrap;gap:.35em}
.q4qs button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .6em;text-align:left;word-break:keep-all}
.q4qs button.q4yes{border-color:var(--ok);background:#E3F4EA}
.q4qs button.q4nope{border-color:var(--no);background:#FBE7E2}
.q4big{font-family:"Jua";font-size:var(--fs-l);color:var(--night)}
.q4slider{display:flex;align-items:center;gap:.5em;flex-wrap:wrap}
.q4slider input{flex:1 1 10em;min-width:0}
`;
  document.head.append(s);
})();
const Q4_KO = ["가", "나", "다", "라", "마", "바", "사", "아"];
const Q4_V = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"];
const Q4_RED = "#D2463A", Q4_GREEN = "#24965A", Q4_SKY = "#2B7BD6", Q4_FILL = "#FFF3E2", Q4_LINE = "#C9D4CF", Q4_GRAY = "#8795A1", Q4_PUR = "#7C4DBA";
const Q4_PAIRC = ["#2B7BD6", "#24965A", "#B4530F", "#7C4DBA", "#C2185B", "#00838F"];
const q4F = v => Math.round(v * 100) / 100;
const q4Rad = d => d * Math.PI / 180;
const q4Pts = P => P.map(p => `${q4F(p[0])},${q4F(p[1])}`).join(" ");
const q4Sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const q4Cr = (a, b) => a[0] * b[1] - a[1] * b[0];
const q4Dt = (a, b) => a[0] * b[0] + a[1] * b[1];
const q4Len = v => Math.hypot(v[0], v[1]);
const q4Unit = v => { const l = q4Len(v) || 1; return [v[0] / l, v[1] / l]; };
const q4D = (a, b) => q4Len(q4Sub(a, b));
/* 받침 따라 조사: q4J("변 ㄱㄴ","과","와") */
function q4J(s, withB, noB) {
  s = String(s).trim(); const c = s[s.length - 1];
  if (c === "°") return noB;
  if (/[0-9]/.test(c)) return "013678".includes(c) ? withB : noB;
  if (c === "m") return noB;
  if (/[ㄱ-ㅎ]/.test(c)) return withB;   // 기역·니은·디귿… 모두 받침 있음
  const k = c.charCodeAt(0) - 0xAC00; if (k < 0 || k > 11171) return withB;
  return k % 28 ? withB : noB;
}
function q4Ln(P, Q, attrs = {}) { return svgEl("line", Object.assign({ x1: q4F(P[0]), y1: q4F(P[1]), x2: q4F(Q[0]), y2: q4F(Q[1]), stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }, attrs)); }

/* ---------- 사각형 재기 ---------- */
/* p: 꼭짓점 4개(차례대로). 변 i = 꼭짓점 i → i+1, 각 i = 꼭짓점 i의 각 */
function q4Info(p) {
  const n = p.length, S = p.map((v, i) => q4Sub(p[(i + 1) % n], v)), L = S.map(q4Len);
  const tol = 1e-7 * Math.max(...L) * Math.max(...L);
  const par = (a, b) => Math.abs(q4Cr(a, b)) <= tol, eqL = (a, b) => Math.abs(a - b) <= 1e-7 * Math.max(...L);
  const turns = S.map((v, i) => q4Cr(v, S[(i + 1) % n]));
  const simple = turns.every(t => t > tol) || turns.every(t => t < -tol);
  const A = p.map((v, i) => { const u = q4Unit(q4Sub(p[(i + n - 1) % n], v)), w = q4Unit(q4Sub(p[(i + 1) % n], v)); return Math.acos(Math.max(-1, Math.min(1, q4Dt(u, w)))) * 180 / Math.PI; });
  if (n !== 4) return { S, L, A, simple };
  const par02 = par(S[0], S[2]), par13 = par(S[1], S[3]), npar = par02 + par13;
  const allEq = eqL(L[0], L[1]) && eqL(L[1], L[2]) && eqL(L[2], L[3]);
  const oppEq = eqL(L[0], L[2]) && eqL(L[1], L[3]);
  const right = i => Math.abs(q4Dt(S[i], S[(i + 3) % 4])) <= tol;
  const allRight = [0, 1, 2, 3].every(right);
  const oppAng = Math.abs(A[0] - A[2]) < 1e-6 && Math.abs(A[1] - A[3]) < 1e-6;
  const kind = !simple ? "bad" : npar === 0 ? "none" : npar === 1 ? "trap" : allRight && allEq ? "sq" : allRight ? "rect" : allEq ? "rhom" : "para";
  return { S, L, A, simple, par02, par13, npar, allEq, oppEq, allRight, oppAng, kind, rights: [0, 1, 2, 3].map(right) };
}
const Q4_KNAME = { none: "평행한 변이 없는 사각형", trap: "사다리꼴", para: "평행사변형", rhom: "마름모", rect: "직사각형", sq: "정사각형" };
/* 이름의 정의(약속)를 만족하는지 */
const Q4_DEF = {
  "사다리꼴": I => I.npar >= 1,
  "평행사변형": I => I.npar === 2,
  "마름모": I => I.allEq,
  "직사각형": I => I.allRight,
  "정사각형": I => I.allRight && I.allEq,
  "평행한 변이 없는 사각형": I => I.npar === 0
};
/* 설명 카드·표에 쓰는 성질 */
const Q4_DESC = [
  ["평행한 변이 있습니다.", I => I.npar >= 1],
  ["마주 보는 두 쌍의 변이 평행합니다.", I => I.npar === 2],
  ["마주 보는 두 각의 크기가 같습니다.", I => I.oppAng],
  ["마주 보는 두 변의 길이가 같습니다.", I => I.oppEq],
  ["네 변의 길이가 모두 같습니다.", I => I.allEq],
  ["네 각의 크기가 모두 90°입니다.", I => I.allRight]];
/* 그림이 이름과 맞는지 확인하고 돌려줌(틀리면 바로 오류) */
function q4K(p, kind, why = "") {
  const I = q4Info(p); if (I.kind !== kind) throw new Error(`사각형 그림 오류 ${why}: ${I.kind} ≠ ${kind} (${JSON.stringify(p)})`);
  return p;
}
const q4Y = p => p.map(v => [v[0], -v[1]]);
/* 평행사변형: 밑변 a, 옆변 b, 왼쪽 아래 각 deg (y 아래쪽 좌표) */
function q4PG(a, b, deg) { const c = Math.cos(q4Rad(deg)) * b, s = Math.sin(q4Rad(deg)) * b; return [[0, 0], [a, 0], [a + c, -s], [c, -s]]; }
/* 마름모: 한 변 a, 각 deg */
function q4RH(a, deg) { return q4PG(a, a, deg); }
/* 돌리기(가운데 기준, 도) */
function q4Turn(p, deg) {
  const c = Math.cos(q4Rad(deg)), s = Math.sin(q4Rad(deg)), cx = p.reduce((t, v) => t + v[0], 0) / p.length, cy = p.reduce((t, v) => t + v[1], 0) / p.length;
  return p.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
}
/* 네 각으로 사각형 만들기(꼭짓점 0의 각부터 차례로, 처음 두 변 l0·l1) */
function q4FromAngles(A, l0, l1) {
  const dir = [0]; for (let i = 1; i < 4; i++) dir.push(dir[i - 1] + 180 - A[i]);
  const u = dir.map(d => [Math.cos(q4Rad(d)), Math.sin(q4Rad(d))]);
  const rx = -(l0 * u[0][0] + l1 * u[1][0]), ry = -(l0 * u[0][1] + l1 * u[1][1]);
  const det = u[2][0] * u[3][1] - u[2][1] * u[3][0], l2 = (rx * u[3][1] - ry * u[3][0]) / det, l3 = (u[2][0] * ry - u[2][1] * rx) / det;
  if (!(l2 > 0 && l3 > 0)) throw new Error("각으로 만든 사각형 오류");
  const P = [[0, 0]]; [l0, l1, l2].forEach((l, i) => P.push([P[i][0] + l * u[i][0], P[i][1] + l * u[i][1]]));
  return q4Y(P);
}
function q4Cm(v) { const mm = Math.round(v * 10), c = Math.floor(mm / 10), r = mm % 10; return r ? `${c} cm ${r} mm` : `${c} cm`; }
const q4Deg = a => `${Math.round(a)}°`;

/* ---------- 그리기 ---------- */
/* 좌표 → 화면. k(1 cm 화면 길이)를 주면 그보다 크지 않게, 상자 가운데 */
function q4Map(p, box, k) {
  const [x0, y0, w, hh, pad = 20] = box;
  const xs = p.map(v => v[0]), ys = p.map(v => v[1]), bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
  let kk = Math.min((w - 2 * pad) / Math.max(bw, .01), (hh - 2 * pad) / Math.max(bh, .01)); if (k) kk = Math.min(kk, k);
  const ox = x0 + (w - bw * kk) / 2 - Math.min(...xs) * kk, oy = y0 + (hh - bh * kk) / 2 - Math.min(...ys) * kk;
  return { P: p.map(v => [ox + v[0] * kk, oy + v[1] * kk]), k: kk, ox, oy };
}
function q4Cen(P) { return [P.reduce((t, v) => t + v[0], 0) / P.length, P.reduce((t, v) => t + v[1], 0) / P.length]; }
function q4Corner(P, i) {
  const n = P.length, V = P[i], u = q4Unit(q4Sub(P[(i + n - 1) % n], V)), w = q4Unit(q4Sub(P[(i + 1) % n], V));
  let b = q4Unit([u[0] + w[0], u[1] + w[1]]); const C = q4Cen(P); if (q4Dt(b, q4Sub(C, V)) < 0) b = [-b[0], -b[1]];
  return { V, u, w, b };
}
function q4Arc(V, u, w, r, wedge) {
  const s = [V[0] + u[0] * r, V[1] + u[1] * r], e = [V[0] + w[0] * r, V[1] + w[1] * r], sw = q4Cr(u, w) > 0 ? 1 : 0;
  const big = q4Dt(u, w) < -0.999999 ? 0 : 0;
  return (wedge ? `M${q4F(V[0])},${q4F(V[1])} L` : "M") + `${q4F(s[0])},${q4F(s[1])} A${r},${r} 0 ${big} ${sw} ${q4F(e[0])},${q4F(e[1])}` + (wedge ? " Z" : "");
}
function q4RightMk(V, u, w, s, attrs = {}) {
  return svgEl("polyline", Object.assign({ points: q4Pts([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + w[0]) * s, V[1] + (u[1] + w[1]) * s], [V[0] + w[0] * s, V[1] + w[1] * s]]), fill: "none", stroke: TENT, "stroke-width": 2.5 }, attrs));
}
/* 다각형 그리기
   o: {fill, sw, stroke, names:[…]|true, lens:[글…], angs:[글…], rights(직각 표시, 기본 true), fs, sideCol:[…], dash:[…]} */
function q4PolyG(P, o = {}) {
  const g = svgEl("g"), n = P.length, C = q4Cen(P), fs = o.fs || 20, sw = o.sw || 4;
  const I = q4Info(P);
  const short = Math.min(...P.map((v, i) => q4D(v, P[(i + 1) % n]))), rr = Math.max(13, Math.min(30, short * .2));
  g.append(svgEl("polygon", { points: q4Pts(P), fill: o.fill || Q4_FILL, stroke: "none" }));
  P.forEach((v, i) => g.append(q4Ln(v, P[(i + 1) % n], { stroke: (o.sideCol && o.sideCol[i]) || o.stroke || INK, "stroke-width": o.sideCol && o.sideCol[i] ? sw + 2 : sw })));
  P.forEach((v, i) => {
    const { V, u, w, b } = q4Corner(P, i), right = Math.abs(I.A[i] - 90) < 1e-6;
    const hasLab = o.angs && o.angs[i];
    if (right && o.rights !== false) g.append(q4RightMk(V, u, w, Math.min(15, rr * .75)));
    else if (hasLab) g.append(svgEl("path", { d: q4Arc(V, u, w, rr), fill: "none", stroke: TENT, "stroke-width": 2.5 }));
    if (hasLab) { const dd = rr + fs * (I.A[i] < 50 ? 1.3 : .95); g.append(txt(V[0] + b[0] * dd, V[1] + b[1] * dd, o.angs[i], fs * .9, { fill: o.angCol || "#B4530F" })); }
  });
  if (o.lens) P.forEach((v, i) => {
    if (!o.lens[i]) return;
    const A = v, B = P[(i + 1) % n], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = q4Unit(q4Sub(B, A));
    let nn = [-d[1], d[0]]; if (q4Dt(nn, q4Sub(M, C)) < 0) nn = [-nn[0], -nn[1]];
    const t = o.lens[i], off = fs * (Math.abs(nn[0]) > .7 ? .55 + t.length * .27 : .95) + 2;
    g.append(txt(M[0] + nn[0] * off, M[1] + nn[1] * off, t, fs * .9, { fill: o.lenCol || "#1D4E80" }));
  });
  if (o.names) P.forEach((v, i) => { const nm = o.names === true ? Q4_V[i] : o.names[i]; if (!nm) return; const { V, b } = q4Corner(P, i); g.append(txt(V[0] - b[0] * fs * 1.05, V[1] - b[1] * fs * 1.05, nm, fs)); });
  return g;
}
function q4Fig(W, H, draw, maxW) { const s = makeSvg(W, H); draw(s); return h("div", { class: "q4fig", style: `max-width:${maxW || "30em"}` }, s); }
/* 점 종이 점(정수 좌표, 화면 m={ox,oy,k}) */
function q4Dots(g, m, x0, y0, x1, y1, r = 2.6) {
  const i0 = Math.ceil((x0 - m.ox) / m.k), i1 = Math.floor((x1 - m.ox) / m.k), j0 = Math.ceil((y0 - m.oy) / m.k), j1 = Math.floor((y1 - m.oy) / m.k);
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) g.append(svgEl("circle", { cx: q4F(m.ox + i * m.k), cy: q4F(m.oy + j * m.k), r, fill: "#B5C2BC" }));
}
/* 사각형 카드 여러 장 */
function q4Cards(list, opt = {}) {
  const CW = opt.cw || 200, CH = opt.ch || 170, per = opt.per || list.length, rows = Math.ceil(list.length / per);
  const s = makeSvg(per * (CW + 10) + 10, rows * (CH + 10) + 10);
  list.forEach((it0, i) => {
    const it = Array.isArray(it0) ? { p: it0 } : it0;
    const x = 10 + (i % per) * (CW + 10), y = 10 + Math.floor(i / per) * (CH + 10);
    s.append(svgEl("rect", { x, y, width: CW, height: CH, rx: 12, fill: "#fff", stroke: Q4_LINE, "stroke-width": 2 }));
    const m = q4Map(it.p, [x, y + 16, CW, CH - 16, it.pad || 26], opt.k || 30);
    if (opt.dots !== false) q4Dots(s, m, x + 6, y + 26, x + CW - 6, y + CH - 6, 2.2);
    s.append(q4PolyG(m.P, Object.assign({ fs: 17, sw: 3.5 }, opt.o || {}, it.o || {})));
    if (it.label !== false) s.append(txt(x + 18, y + 18, it.label || Q4_KO[i], 20));
  });
  return h("div", { class: "q4fig", style: `max-width:${opt.maxW || Math.min(46, per * 11) + "em"}` }, s);
}
/* 여러 부분을 차례로 */
function q4Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: "q4part" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return !api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 문제도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run();
    } });
    parts[myK](box, sub);
  };
  run();
}
/* 수 여러 개 입력(소수 가능) — numbers와 같지만 그림을 위에 */
function q4Nums(body, api, fig, items, opts = {}) { if (fig) body.append(fig); numbers(body, api, items, opts); }

/* =========================================================
   1. 그림에서 고르기 — 장면 속 물건을 눌러 고른다 (1차시)
   opt: {W,H, deco(g), items:[{n, box:[x,y,w,h], ok, why, draw(g)}], ok, words}
   ========================================================= */
function q4Pick(body, api, opt) {
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
    on.forEach(i => { const [x, y, w, hh] = opt.items[i].box; marks.append(svgEl("rect", { x: x - 4, y: y - 4, width: w + 8, height: hh + 8, rx: 12, fill: "none", stroke: TENT, "stroke-width": 5, "stroke-dasharray": "12 6", "pointer-events": "none" })); });
    out.textContent = on.size ? "고른 것: " + [...on].map(i => opt.items[i].n).join(", ") : "고른 것이 없어요.";
  };
  const want = opt.items.map((it, i) => it.ok ? i : -1).filter(i => i >= 0);
  api.provide({ words: opt.words || ["사각형", "변 4개", "꼭짓점 4개"], answers: [want.map(i => opt.items[i].n).join(", ")] });
  const judge = () => {
    api.tryOnce(); const ans = [...on].map(i => opt.items[i].n).join(", ") || "-";
    const extra = [...on].find(i => !opt.items[i].ok), miss = want.find(i => !on.has(i));
    if (extra == null && miss == null) return !api.done(ans, opt.ok);
    api.fail(extra != null ? (opt.items[extra].why || `${opt.items[extra].n}에는 찾는 모양이 없어요.`) : (opt.miss || "아직 찾지 못한 것이 있어요. 그림을 다시 살펴봐요."), ans);
  };
  const auto = autoRun(() => on.size >= want.length, () => [...on].sort().join(","), judge, 900);
  svg.addEventListener("click", () => auto());
  body.append(h("div", { class: "stage" }, svg), out, h("p", { class: "inst" }, (opt.tip ? opt.tip + " " : "") + `알맞은 것을 ${want.length}개 고르면 저절로 확인해요.`));
  paint();
}

/* =========================================================
   2. 직각 표시하기 — 두 직선이 만나는 곳을 눌러 직각 표시(└)를 하고, 삼각자를 대 본다 (2차시)
   opt: {panels:[{a:직선1 방향(도), b:두 직선 사이 각(도)}], ok}
   ========================================================= */
function q4RightMark(body, api, opt) {
  const n = opt.panels.length, PW = 250, PH = 230, svg = makeSvg(n * (PW + 12) + 12, PH + 24), on = new Set();
  let sq = false;
  const lay = [];
  opt.panels.forEach((pn, i) => {
    const x = 12 + i * (PW + 12), y = 12, C = [x + PW / 2, y + PH / 2 + 10];
    const g = svgEl("g", { style: "cursor:pointer" }), top = svgEl("g", { "pointer-events": "none" });
    g.append(svgEl("rect", { x, y, width: PW, height: PH, rx: 12, fill: "#fff", stroke: Q4_LINE, "stroke-width": 2 }));
    for (let gx = x + 25; gx < x + PW; gx += 25) g.append(q4Ln([gx, y + 2], [gx, y + PH - 2], { stroke: "#E6ECE9", "stroke-width": 1 }));
    for (let gy = y + 25; gy < y + PH; gy += 25) g.append(q4Ln([x + 2, gy], [x + PW - 2, gy], { stroke: "#E6ECE9", "stroke-width": 1 }));
    const u = [Math.cos(q4Rad(pn.a)), -Math.sin(q4Rad(pn.a))], w = [Math.cos(q4Rad(pn.a + pn.b)), -Math.sin(q4Rad(pn.a + pn.b))];
    const R = 95;
    g.append(q4Ln([C[0] - u[0] * R, C[1] - u[1] * R], [C[0] + u[0] * R, C[1] + u[1] * R]), q4Ln([C[0] - w[0] * R * .5, C[1] - w[1] * R * .5], [C[0] + w[0] * R, C[1] + w[1] * R]));
    g.append(txt(x + 18, y + 18, Q4_KO[i], 20));
    g.addEventListener("click", () => { on.has(i) ? on.delete(i) : on.add(i); paint(); });
    svg.append(g, top); lay.push({ top, C, u, w, pn });
  });
  const paint = () => lay.forEach(({ top, C, u, w }, i) => {
    top.innerHTML = "";
    const pp = [-u[1], -u[0]]; let v = [u[1], -u[0]]; if (q4Dt(v, w) < 0) v = [-v[0], -v[1]];
    if (sq) top.append(svgEl("polygon", { points: q4Pts([C, [C[0] + u[0] * 80, C[1] + u[1] * 80], [C[0] + v[0] * 60, C[1] + v[1] * 60]]), fill: "rgba(43,123,214,.16)", stroke: Q4_SKY, "stroke-width": 2, "stroke-dasharray": "6 4" }));
    if (on.has(i)) top.append(q4RightMk(C, u, v, 20, { stroke: Q4_RED, "stroke-width": 4 }));
  });
  const want = opt.panels.map((p, i) => Math.abs(p.b - 90) < 1e-9 ? i : -1).filter(i => i >= 0);
  api.provide({ words: ["직각", "삼각자", "90°"], answers: [want.map(i => Q4_KO[i]).join(", ")] });
  const sqBtn = h("button", { onclick: e => { sq = !sq; e.currentTarget.classList.toggle("on", sq); paint(); } }, "📐 삼각자 대 보기");
  const judge = () => {
    api.tryOnce(); const ans = [...on].sort().map(i => Q4_KO[i]).join(", ") || "-";
    const extra = [...on].find(i => !want.includes(i)), miss = want.find(i => !on.has(i));
    if (extra == null && miss == null) return !api.done(ans, opt.ok);
    api.fail(extra != null ? `${Q4_KO[extra]}의 두 직선은 직각으로 만나지 않아요. 삼각자를 대 보면 한 직선이 삼각자의 변과 맞지 않아요.` : "직각인 곳을 더 찾아봐요. 직선이 기울어져 있어도 만나는 각이 직각이면 돼요.", ans);
  };
  const auto = autoRun(() => on.size >= want.length, () => [...on].sort().join(","), judge, 900);
  svg.addEventListener("click", () => auto());
  body.append(h("div", { class: "stage" }, svg), h("p", { class: "inst" }, `두 직선이 만나는 그림을 누르면 직각 표시(└)를 해요. 다시 누르면 지워져요. 직각인 곳을 모두 표시하면 저절로 확인해요.`), h("div", { class: "tools" }, sqBtn));
  paint();
}

/* =========================================================
   3. 직선 짝 찾기 — 직선 두 개를 눌러 짝을 만든다 (2·3차시, 지도의 길)
   opt: {W,H, lines:[{n, c:[x,y], a:방향(도), len}], mode:"perp"|"para", ext:늘여 보기, prot:각도기, road, ask, ok}
   ========================================================= */
function q4Lines(body, api, opt) {
  const W = opt.W || 760, H = opt.H || 440, svg = makeSvg(W, H), Ls = opt.lines;
  const base = svgEl("g"), lay = svgEl("g"), hits = svgEl("g"); svg.append(base, lay, hits);
  const dir = i => [Math.cos(q4Rad(Ls[i].a)), -Math.sin(q4Rad(Ls[i].a))];
  const angBetween = (i, j) => { const d = ((Ls[i].a - Ls[j].a) % 180 + 180) % 180; return Math.min(d, 180 - d); };
  const isOk = (i, j) => opt.mode === "perp" ? Math.abs(angBetween(i, j) - 90) < 1e-9 : angBetween(i, j) < 1e-9;
  const cross = (i, j) => { const d1 = dir(i), d2 = dir(j), den = q4Cr(d1, d2); if (Math.abs(den) < 1e-12) return null; const t = q4Cr(q4Sub(Ls[j].c, Ls[i].c), d2) / den; return [Ls[i].c[0] + d1[0] * t, Ls[i].c[1] + d1[1] * t]; };
  const want = []; for (let i = 0; i < Ls.length; i++) for (let j = i + 1; j < Ls.length; j++) if (isOk(i, j)) want.push(i + "-" + j);
  const pairs = []; let sel = null, ext = false, prot = false, last = null;
  const key = (i, j) => Math.min(i, j) + "-" + Math.max(i, j);
  const nm = i => Ls[i].n;
  const nmJ = i => nm(i) + q4J(nm(i), "과", "와");
  const colOf = i => { const k = pairs.findIndex(p => p.split("-").map(Number).includes(i)); return k >= 0 ? Q4_PAIRC[k % Q4_PAIRC.length] : null; };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" }), info = h("p", { class: "inst", style: "margin:.2em 0" });
  const draw = () => {
    base.innerHTML = ""; lay.innerHTML = ""; hits.innerHTML = "";
    if (opt.road) base.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "#EAF3E3" }));
    Ls.forEach((L, i) => {
      const d = dir(i), A = [L.c[0] - d[0] * L.len, L.c[1] - d[1] * L.len], B = [L.c[0] + d[0] * L.len, L.c[1] + d[1] * L.len];
      const col = colOf(i) || (sel === i ? TENT : INK);
      if (ext) base.append(q4Ln([L.c[0] - d[0] * 2000, L.c[1] - d[1] * 2000], [L.c[0] + d[0] * 2000, L.c[1] + d[1] * 2000], { stroke: col, "stroke-width": 2, "stroke-dasharray": "8 7", opacity: .7 }));
      if (opt.road) {
        base.append(q4Ln(A, B, { stroke: colOf(i) || (sel === i ? "#F3B27A" : "#C9C2B5"), "stroke-width": 30, "stroke-linecap": "butt" }), q4Ln(A, B, { stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "14 10" }));
        const lp = [L.c[0] + d[0] * L.len * (L.lp || .55), L.c[1] + d[1] * L.len * (L.lp || .55)];
        base.append(svgEl("rect", { x: q4F(lp[0] - 38), y: q4F(lp[1] - 15), width: 76, height: 30, rx: 9, fill: "#fff", stroke: col, "stroke-width": 2 }), txt(lp[0], lp[1], L.n, 18));
      } else {
        base.append(q4Ln(A, B, { stroke: col, "stroke-width": sel === i || colOf(i) ? 6 : 4 }));
        const lp = [B[0] + d[0] * 18, B[1] + d[1] * 18];
        base.append(txt(Math.max(14, Math.min(W - 14, lp[0])), Math.max(14, Math.min(H - 14, lp[1])), L.n, 22, { fill: colOf(i) || INK }));
      }
      const hit = q4Ln(ext ? [L.c[0] - d[0] * 2000, L.c[1] - d[1] * 2000] : A, ext ? [L.c[0] + d[0] * 2000, L.c[1] + d[1] * 2000] : B, { stroke: "rgba(0,0,0,0)", "stroke-width": opt.road ? 34 : 26, style: "cursor:pointer" });
      hit.addEventListener("click", () => tap(i)); hits.append(hit);
    });
    if (prot && last) {
      const [i, j] = last.split("-").map(Number), X = cross(i, j), a = angBetween(i, j);
      if (X && X[0] > 0 && X[0] < W && X[1] > 0 && X[1] < H) {
        let u = dir(i), w = dir(j); if (q4Dt(u, w) < 0) w = [-w[0], -w[1]];
        if (Math.abs(a - 90) < 1e-9) lay.append(q4RightMk(X, u, w, 18, { stroke: Q4_RED, "stroke-width": 3.5 }));
        else lay.append(svgEl("path", { d: q4Arc(X, u, w, 30), fill: "none", stroke: Q4_RED, "stroke-width": 3 }));
        lay.append(svgEl("circle", { cx: q4F(X[0]), cy: q4F(X[1]), r: 5, fill: Q4_RED }));
      }
    }
    out.textContent = pairs.length ? "고른 짝: " + pairs.map(p => { const [i, j] = p.split("-").map(Number); return `${nmJ(i)} ${nm(j)}`; }).join(" / ") : "고른 짝이 없어요.";
  };
  const tap = i => {
    const k0 = pairs.findIndex(p => p.split("-").map(Number).includes(i));
    if (sel == null) {
      if (k0 >= 0 && opt.unique !== false) { /* 이미 짝이 있는 직선을 누르면 다른 짝 시작 */ }
      sel = i; info.textContent = `${nm(i)}${q4J(nm(i), "을", "를")} 골랐어요. 짝이 될 직선을 하나 더 눌러요.`; draw(); return;
    }
    if (sel === i) { sel = null; info.textContent = ""; draw(); return; }
    const k = key(sel, i), at = pairs.indexOf(k);
    if (at >= 0) pairs.splice(at, 1); else pairs.push(k);
    last = k; sel = null; setTimeout(() => auto(), 0);
    const [a1, b1] = k.split("-").map(Number), X = cross(a1, b1);
    info.textContent = prot ? (X ? `${nmJ(a1)} ${nm(b1)}${q4J(nm(b1), "이", "가")} 만나서 이루는 각: ${q4Deg(angBetween(a1, b1))}` : `${nmJ(a1)} ${nm(b1)}${q4J(nm(b1), "은", "는")} 아무리 늘여도 만나지 않아요.`) : (at >= 0 ? "짝을 지웠어요." : "짝을 만들었어요. 같은 두 직선을 다시 누르면 짝이 지워져요.");
    draw();
  };
  const tools = h("div", { class: "tools" },
    opt.ext ? h("button", { onclick: e => { ext = !ext; e.currentTarget.classList.toggle("on", ext); draw(); } }, "↔ 직선 늘여 보기") : null,
    opt.prot ? h("button", { onclick: e => { prot = !prot; e.currentTarget.classList.toggle("on", prot); info.textContent = prot ? "두 직선으로 짝을 만들면 만나는 각을 재어 보여 줘요." : ""; draw(); } }, "📐 각 재어 보기") : null,
    h("button", { onclick: () => { pairs.length = 0; sel = null; last = null; info.textContent = ""; draw(); auto(); } }, "처음으로"));
  api.provide({ words: opt.mode === "perp" ? ["수직", "직각", "삼각자"] : ["평행", "만나지 않는 두 직선", "늘여 보기"], answers: [want.map(p => { const [i, j] = p.split("-").map(Number); return `${nmJ(i)} ${nm(j)}`; }).join(", ")] });
  const judge = () => {
    api.tryOnce(); const ans = out.textContent;
    const extra = pairs.find(p => !want.includes(p)), miss = want.find(p => !pairs.includes(p));
    if (extra == null && miss == null) return !api.done(ans, opt.ok);
    if (extra != null) { const [i, j] = extra.split("-").map(Number);
      return api.fail(opt.mode === "perp" ? `${nmJ(i)} ${nm(j)}${q4J(nm(j), "이", "가")} 만나서 이루는 각은 ${q4Deg(angBetween(i, j))}예요. 직각이 아니에요.` : `${nmJ(i)} ${nm(j)}${q4J(nm(j), "은", "는")} 늘이면 만나요. ‘직선 늘여 보기’로 확인해 봐요.`, ans); }
    api.fail(opt.miss || (opt.mode === "perp" ? "서로 수직인 짝을 더 찾아봐요. 기울어진 직선도 살펴봐요." : "서로 만나지 않는 짝을 더 찾아봐요. 기울어진 직선끼리도 평행할 수 있어요."), ans);
  };
  const auto = autoRun(() => pairs.length >= want.length, () => [...pairs].sort().join(","), judge, 1200);
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", { class: "jua", style: "margin:.2em 0" }, opt.ask || ""), h("p", { class: "inst", style: "margin:.2em 0" }, (opt.tip || "직선을 하나 누르고, 짝이 될 직선을 하나 더 눌러요.") + ` 짝을 ${want.length}개 만들면 저절로 확인해요.`), tools, info, out)));
  draw();
}

/* =========================================================
   4. 삼각자로 수선·평행선 긋기 (2·3·4·11차시)
   주어진 직선을 따라 s(cm), 직선에서 떨어진 거리 n(cm). 1 cm = 40.
   opt: {mode:"perp"|"para", ang:직선 방향(도), pt:[s,n] 점 ㄱ, dist:거리(cm), ask, ok}
   ========================================================= */
function q4Square(body, api, opt) {
  const U = 40, W = opt.W || 760, H = opt.H || 480, svg = makeSvg(W, H, 20);
  const th = q4Rad(opt.ang || 0), e = [Math.cos(th), -Math.sin(th)], nv = [-e[1], e[0]];
  /* n은 위쪽(화면에서 직선 위)이 + 가 되도록: nv를 위로 */
  const up = nv[1] < 0 ? nv : [-nv[0], -nv[1]];
  const O = opt.O || [W / 2, opt.mode === "para" ? H * .72 : H * .62];
  const S = (s, n) => [O[0] + e[0] * s * U + up[0] * n * U, O[1] + e[1] * s * U + up[1] * n * U];
  const loc = q => { const v = q4Sub([q.x, q.y], O); return [q4Dt(v, e) / U, q4Dt(v, up) / U]; };
  const g0 = svgEl("g"), gDraw = svgEl("g"), gTool = svgEl("g"), gTop = svgEl("g"); svg.append(g0, gDraw, gTool, gTop);
  const BIG = 40;
  g0.append(q4Ln(S(-BIG, 0), S(BIG, 0), { "stroke-width": 4 }));
  const lp = S(opt.mode === "para" ? 7.6 : 7.8, -.55); g0.append(txt(lp[0], lp[1], opt.lineName || "", 22));
  if (opt.pt) { const P = S(opt.pt[0], opt.pt[1]); g0.append(svgEl("circle", { cx: q4F(P[0]), cy: q4F(P[1]), r: 7, fill: Q4_RED }), txt(P[0] + 16, P[1] - 18, "ㄱ", 24, { fill: Q4_RED })); }
  const drawn = [];
  let t = opt.mode === "para" ? 0 : (opt.t0 != null ? opt.t0 : -4), side = 1, flip = 1;
  const sF = opt.sF != null ? opt.sF : -3;
  const paint = () => {
    gDraw.innerHTML = ""; gTool.innerHTML = ""; gTop.innerHTML = "";
    drawn.forEach(v => {
      if (opt.mode === "perp") { gDraw.append(q4Ln(S(v, -BIG), S(v, BIG), { stroke: Q4_SKY, "stroke-width": 4 })); const X = S(v, 0); gDraw.append(q4RightMk(X, e, up, 16, { stroke: Q4_RED, "stroke-width": 3 })); }
      else gDraw.append(q4Ln(S(-BIG, v), S(BIG, v), { stroke: Q4_SKY, "stroke-width": 4 }));
    });
    if (opt.mode === "perp") {
      /* 삼각자: 직각 꼭짓점 (t,0), 한 변은 직선을 따라, 다른 변은 수직 */
      const tri = [S(t, 0), S(t + flip * 5, 0), S(t, side * 3.6)];
      gTool.append(svgEl("polygon", { points: q4Pts(tri), fill: "rgba(170,210,245,.55)", stroke: "#1D4E80", "stroke-width": 2, style: "cursor:grab" }));
      gTool.append(svgEl("polygon", { points: q4Pts([S(t + flip * 1, side * .55), S(t + flip * 3.3, side * .55), S(t + flip * 1, side * 2.2)]), fill: "#FBFCFB", stroke: "#1D4E80", "stroke-width": 1.2, "pointer-events": "none" }));
      gTool.append(q4RightMk(S(t, 0), [e[0] * flip, e[1] * flip], [up[0] * side, up[1] * side], 14, { stroke: "#1D4E80", "stroke-width": 2 }));
    } else {
      /* 고정한 삼각자 F: 직선에 수직인 변이 s = sF */
      const F = [S(sF, -2.4), S(sF, 6.4), S(sF - 3.2, -2.4)];
      gTool.append(svgEl("polygon", { points: q4Pts(F), fill: "rgba(200,200,200,.45)", stroke: "#5A6A72", "stroke-width": 2 }));
      for (let k = -2; k <= 6; k++) { const a = S(sF, k), b = S(sF - .3, k); gTool.append(q4Ln(a, b, { stroke: "#3A4A52", "stroke-width": 1.6, "stroke-linecap": "butt" })); if (k >= 0) { const tp = S(sF - .62, k); gTool.append(txt(tp[0], tp[1], String(k), 13, { fill: "#3A4A52" })); } }
      for (let k = -4; k <= 12; k++) { if (k % 2 === 0) continue; const a = S(sF, k / 2), b = S(sF - .18, k / 2); gTool.append(q4Ln(a, b, { stroke: "#3A4A52", "stroke-width": 1, "stroke-linecap": "butt" })); }
      gTool.append(txt(...S(sF - 1.6, 5.4), "고정", 15, { fill: "#3A4A52" }));
      /* 움직이는 삼각자 M: 직각 꼭짓점 (sF, t), 한 변은 직선과 나란히, 다른 변은 F에 붙어 위로 */
      const M = [S(sF, t), S(sF + 5.2, t), S(sF, t + 3.4)];
      gTool.append(svgEl("polygon", { points: q4Pts(M), fill: "rgba(170,210,245,.55)", stroke: "#1D4E80", "stroke-width": 2, style: "cursor:grab" }));
      gTool.append(svgEl("polygon", { points: q4Pts([S(sF + .6, t + .5), S(sF + 3.2, t + .5), S(sF + .6, t + 2.2)]), fill: "#FBFCFB", stroke: "#1D4E80", "stroke-width": 1.2, "pointer-events": "none" }));
      gTool.append(q4Ln(S(sF + .02, t), S(sF + 5.2, t), { stroke: TENT, "stroke-width": 3 }));
    }
    readout.textContent = drawn.length ? `그은 직선 ${drawn.length}개` : "아직 긋지 않았어요.";
  };
  dragOn(svg, q => {
    const [s, n] = loc(q);
    if (opt.mode === "perp") { const within = (s - t) * flip > -1 && (s - t) * flip < 5.5 && n * side > -1 && n * side < 4; return within; }
    return s > sF - .5 && s < sF + 5.6 && n > t - .8 && n < t + 3.8;
  }, q => {
    const [s, n] = loc(q);
    if (opt.mode === "perp") { t = Math.max(-8.5, Math.min(8.5, Math.round((s - flip * 1.5) * 4) / 4)); }
    else { t = Math.max(-2.25, Math.min(6, Math.round((n - 1) * 4) / 4)); }
    paint();
  }, () => {});
  const readout = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const tools = h("div", { class: "tools" },
    opt.mode === "perp" ? h("button", { onclick: () => { side = -side; paint(); } }, "↕ 삼각자 뒤집기") : null,
    opt.mode === "perp" ? h("button", { onclick: () => { flip = -flip; paint(); } }, "↔ 방향 바꾸기") : null,
    h("button", { onclick: () => { const v = t; if (!drawn.some(x => Math.abs(x - v) < 1e-9)) drawn.push(v); paint(); api.hint(opt.mode === "perp" ? "삼각자의 직각을 낀 다른 한 변을 따라 직선을 그었어요." : "움직인 삼각자의 변을 따라 직선을 그었어요."); auto(); } }, "✏️ 변을 따라 선 긋기"),
    h("button", { onclick: () => { drawn.length = 0; paint(); } }, "지우기"));
  api.provide({ words: opt.mode === "perp" ? ["삼각자의 직각", "직각을 낀 한 변", "수선"] : ["삼각자 2개", "고정", "평행선"], answers: [opt.ans || (opt.mode === "perp" ? "수선을 그어요" : "평행선을 그어요")] });
  const judge = () => {
    api.tryOnce();
    if (!drawn.length) return api.fail("아직 선을 긋지 않았어요. 삼각자를 옮긴 다음 ‘변을 따라 선 긋기’를 눌러요.", "-");
    if (opt.mode === "perp") {
      if (opt.pt) { if (drawn.some(v => Math.abs(v - opt.pt[0]) < 1e-9)) return !api.done("점 ㄱ을 지나는 수선", opt.ok);
        return api.fail("그은 직선이 점 ㄱ을 지나지 않아요. 삼각자를 옆으로 밀어 직각을 낀 다른 한 변이 점 ㄱ을 지나게 해요.", "점 ㄱ을 지나지 않음"); }
      return !api.done(`수선 ${drawn.length}개`, opt.ok);
    }
    if (drawn.every(v => Math.abs(v) < 1e-9)) return api.fail("주어진 직선 위에 다시 그었어요. 고정한 삼각자를 따라 움직이는 삼각자를 위로 밀어 올린 다음 그어요.", "같은 직선");
    if (opt.pt) { if (drawn.some(v => Math.abs(v - opt.pt[1]) < 1e-9)) return !api.done("점 ㄱ을 지나는 평행선", opt.ok);
      return api.fail("그은 직선이 점 ㄱ을 지나지 않아요. 움직이는 삼각자의 변이 점 ㄱ에 닿을 때까지 밀어요.", "점 ㄱ을 지나지 않음"); }
    if (opt.dist) { if (drawn.some(v => Math.abs(Math.abs(v) - opt.dist) < 1e-9)) return !api.done(`거리 ${opt.dist} cm인 평행선`, opt.ok);
      return api.fail(`평행선 사이의 거리가 ${opt.dist} cm가 아니에요. 고정한 삼각자의 눈금을 보고 ${opt.dist} cm만큼 떨어진 곳에서 그어요.`, drawn.map(v => Math.abs(v) + " cm").join(", ")); }
    return !api.done(`평행선 ${drawn.length}개`, opt.ok);
  };
  const auto = autoRun(() => drawn.length > 0, () => drawn.slice().sort((x, y) => x - y).join(","), judge, 900);
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", { class: "jua", style: "margin:.2em 0" }, opt.ask || ""), h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || (opt.mode === "perp" ? "파란 삼각자를 끌어 직선을 따라 옮겨요. 직각을 낀 한 변은 늘 주어진 직선에 맞추어져 있어요." : "회색 삼각자는 고정되어 있어요. 파란 삼각자를 끌어 고정한 삼각자를 따라 위아래로 밀어요.")), h("p", { class: "inst", style: "margin:.2em 0" }, "‘변을 따라 선 긋기’를 누르면 저절로 확인해요."), tools, readout)));
  paint();
}

/* =========================================================
   5. 평행선 위 두 점을 이은 선분 — 눌러서 길이 재기 (4차시)
   opt: {d:평행선 사이 거리(cm), ang, segs:[[s1,s2]…] (아래 직선 위 s1, 위 직선 위 s2), U, names, lens(보이는 글), meas:true}
   돌려주는 것: 그림 요소
   ========================================================= */
function q4SegFig(opt) {
  const U = opt.U || 40, W = opt.W || 700, H = opt.H || 300, svg = makeSvg(W, H);
  const th = q4Rad(opt.ang || 0), e = [Math.cos(th), -Math.sin(th)], up0 = [-e[1], e[0]], up = up0[1] < 0 ? up0 : [-up0[0], -up0[1]];
  const O = opt.O || [W / 2, H / 2 + opt.d * U / 2];
  const S = (s, n) => [O[0] + e[0] * s * U + up[0] * n * U, O[1] + e[1] * s * U + up[1] * n * U];
  svg.append(q4Ln(S(-30, 0), S(30, 0)), q4Ln(S(-30, opt.d), S(30, opt.d)));
  if (opt.lineNames) { const a = S(opt.lnS || 7.4, opt.d + .5), b = S(opt.lnS || 7.4, -.5); svg.append(txt(a[0], a[1], opt.lineNames[0], 20), txt(b[0], b[1], opt.lineNames[1], 20)); }
  const lay = svgEl("g", { "pointer-events": "none" }), shown = new Set(opt.show || []);
  const paint = () => {
    lay.innerHTML = "";
    opt.segs.forEach(([s1, s2], i) => {
      if (!shown.has(i)) return;
      const A = S(s1, 0), B = S(s2, opt.d), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], L = Math.hypot(s2 - s1, opt.d);
      const tx = opt.lens ? opt.lens[i] : q4Cm(L);
      lay.append(svgEl("rect", { x: q4F(M[0] + 10), y: q4F(M[1] - 14), width: 14 + tx.length * 11, height: 28, rx: 8, fill: "#fff", stroke: "#1D4E80", "stroke-width": 1.5 }), txt(M[0] + 17 + tx.length * 5.5, M[1], tx, 17, { fill: "#1D4E80" }));
    });
  };
  opt.segs.forEach(([s1, s2], i) => {
    const A = S(s1, 0), B = S(s2, opt.d), g = svgEl("g", { style: opt.meas ? "cursor:pointer" : "" });
    g.append(q4Ln(A, B, { stroke: opt.cols ? opt.cols[i] : Q4_SKY, "stroke-width": 4 }), svgEl("circle", { cx: q4F(A[0]), cy: q4F(A[1]), r: 4.5, fill: INK }), svgEl("circle", { cx: q4F(B[0]), cy: q4F(B[1]), r: 4.5, fill: INK }));
    if (Math.abs(s1 - s2) < 1e-9 && opt.rightMk) g.append(q4RightMk(A, e, up, 13, { stroke: TENT, "stroke-width": 2.5 }));
    const lab = S(s2 + (s2 - s1) * .08, opt.d + .42); g.append(txt(lab[0], lab[1], (opt.names || Q4_KO)[i], 20));
    if (opt.meas) { g.append(q4Ln(A, B, { stroke: "rgba(0,0,0,0)", "stroke-width": 22 })); g.addEventListener("click", () => { shown.has(i) ? shown.delete(i) : shown.add(i); paint(); }); }
    svg.append(g);
  });
  svg.append(lay); paint();
  return h("div", { class: "q4fig", style: `max-width:${opt.maxW || "40em"}` }, svg, opt.meas ? h("p", { class: "inst", style: "margin:.2em 0" }, "선분을 누르면 자로 잰 길이가 나와요.") : null);
}

/* =========================================================
   6. 평행선 사이의 거리 재기 — 아래 점을 끌어 선분을 움직여 가장 짧게 (4차시)
   opt: {items:[{d, ang, sA, sB0}], ok}
   ========================================================= */
function q4Dist(body, api, opt) {
  const U = 40, W = 760, H = 420, svg = makeSvg(W, H, 20), g = svgEl("g"); svg.append(g);
  let k = 0, sB = 0, st;
  const it = () => opt.items[k];
  const res = [];
  const frame = () => { const I = it(), th = q4Rad(I.ang || 0), e = [Math.cos(th), -Math.sin(th)], u0 = [-e[1], e[0]], up = u0[1] < 0 ? u0 : [-u0[0], -u0[1]], O = [W / 2, H / 2 + I.d * U / 2]; return { e, up, O, S: (s, n) => [O[0] + e[0] * s * U + up[0] * n * U, O[1] + e[1] * s * U + up[1] * n * U] }; };
  const draw = () => {
    const I = it(), { e, up, O, S } = frame(); st = { e, up, O, S };
    g.innerHTML = "";
    g.append(q4Ln(S(-30, 0), S(30, 0)), q4Ln(S(-30, I.d), S(30, I.d)));
    const A = S(I.sA, I.d), B = S(sB, 0), L = Math.hypot(sB - I.sA, I.d), perp = Math.abs(sB - I.sA) < 1e-9;
    g.append(q4Ln(A, B, { stroke: perp ? Q4_GREEN : Q4_SKY, "stroke-width": 5 }));
    if (perp) g.append(q4RightMk(B, e, up, 16, { stroke: Q4_RED, "stroke-width": 3 }));
    g.append(svgEl("circle", { cx: q4F(A[0]), cy: q4F(A[1]), r: 8, fill: INK }), svgEl("circle", { cx: q4F(B[0]), cy: q4F(B[1]), r: 15, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }));
    const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], tx = q4Cm(L);
    g.append(svgEl("rect", { x: q4F(M[0] + 14), y: q4F(M[1] - 16), width: 104, height: 32, rx: 9, fill: "#fff", stroke: "#1D4E80", "stroke-width": 1.5 }), txt(M[0] + 66, M[1], tx, 19, { fill: "#1D4E80" }));
    askEl.textContent = (opt.items.length > 1 ? `(${k + 1}/${opt.items.length}) ` : "") + (I.ask || "주황 점을 끌어 두 직선을 잇는 선분을 가장 짧게 만들어요.");
  };
  dragOn(svg, q => { const B = st.S(sB, 0); return Math.hypot(B[0] - q.x, B[1] - q.y) < 40; },
    q => { const v = q4Sub([q.x, q.y], st.O); sB = Math.max(-8, Math.min(8, Math.round(q4Dt(v, st.e) / U * 4) / 4)); draw(); }, () => auto());
  const askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  api.provide({ words: ["수직인 선분", "가장 짧은 선분", "평행선 사이의 거리"], answers: [opt.items.map(I => `${I.d} cm`).join(", ")] });
  const judge = () => {
    const I = it(); api.tryOnce();
    if (Math.abs(sB - I.sA) > 1e-9) return api.fail("아직 가장 짧지 않아요. 선분이 평행선과 수직으로 만나도록 주황 점을 옮겨 봐요.", q4Cm(Math.hypot(sB - I.sA, I.d)));
    res.push(q4Cm(I.d));
    if (k < opt.items.length - 1) { api.hint(`○ 평행선과 수직인 선분의 길이는 ${q4Cm(I.d)}예요. 다음 평행선도 해 봐요.`); k++; sB = opt.items[k].sB0 || 0; draw(); return; }
    return !api.done(res.join(", "), opt.ok);
  };
  const auto = autoRun(() => Math.abs(sB - it().sA) < 1e-9, () => k + ":" + sB, judge, 900);
  sB = opt.items[0].sB0 || 0;
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, h("p", { class: "inst", style: "margin:.2em 0" }, "선분의 길이를 보면서 점을 옮겨 봐요. 선분이 평행선과 수직이 되면 초록색이 되고 저절로 확인해요."))));
  draw();
}

/* =========================================================
   7. 분류하기 — 사각형 카드를 끌어 알맞은 칸에 넣는다 (5·6·7차시)
   opt: {cats:[…], items:[{p, cat, why}], k, measure, ok, whyOf}
   ========================================================= */
function q4Bins(body, api, opt) {
  const nb = opt.cats.length, where = opt.items.map(() => -1), want = opt.items.map(it => it.cat);
  let sel = null, justDragged = false;
  const lab = i => opt.items[i].label || Q4_KO[i];
  const pool = h("div", { class: "q4pool" }), bins = [];
  const binEl = (name, idx) => { const b = h("div", { class: "q4bin" }, h("div", { class: "q4bint" }, name)); b.dataset.bin = idx; b.addEventListener("click", () => { if (sel != null) { put(sel, idx); sel = null; paint(); } }); bins.push(b); return b; };
  const binWrap = h("div", { class: "q4bins" }, opt.cats.map((c, i) => binEl(c, i)));
  pool.addEventListener("click", () => { if (sel != null) { put(sel, -1); sel = null; paint(); } });
  const cards = opt.items.map((it, i) => {
    const c = h("div", { class: "q4card" });
    const s = makeSvg(200, 170), m = q4Map(it.p, [0, 4, 200, 166, 26], opt.k || 28);
    q4Dots(s, m, 4, 6, 196, 166, 2.2);
    s.append(q4PolyG(m.P, Object.assign({ fs: 16, sw: 3.5 }, opt.o || {}, it.o || {})));
    if (opt.measure) q4Measurable(s, it.p, m.P);
    c.append(h("div", { class: "q4cl" }, lab(i)), s);
    c.addEventListener("click", e => { if (justDragged) return; e.stopPropagation(); sel = sel === i ? null : i; paint(); });
    c.addEventListener("pointerdown", e => {
      if (e.button) return;
      const sx = e.clientX, sy = e.clientY; let ghost = null, off = null;
      const mv = ev => {
        if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
          const r = c.getBoundingClientRect(); off = [sx - r.left, sy - r.top];
          ghost = c.cloneNode(true); ghost.classList.add("q4ghost"); ghost.style.width = r.width + "px"; document.body.append(ghost); c.style.opacity = ".35";
        }
        if (ghost) { ev.preventDefault(); ghost.style.left = (ev.clientX - off[0]) + "px"; ghost.style.top = (ev.clientY - off[1]) + "px"; }
      };
      const up = ev => {
        window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
        if (!ghost) return;
        ghost.remove(); c.style.opacity = ""; justDragged = true; setTimeout(() => { justDragged = false; }, 0);
        const el = document.elementFromPoint(ev.clientX, ev.clientY), b = el && el.closest(".q4bin,.q4pool");
        if (b && wrap.contains(b)) { put(i, b.classList.contains("q4pool") ? -1 : +b.dataset.bin); sel = null; paint(); }
      };
      window.addEventListener("pointermove", mv, { passive: false }); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    });
    return c;
  });
  const put = (i, b) => { where[i] = b; cards[i].classList.remove("q4good", "q4bad"); auto(); };
  const paint = () => cards.forEach((c, i) => { c.classList.toggle("q4sel", sel === i); (where[i] < 0 ? pool : bins[where[i]]).append(c); });
  const ansOf = arr => opt.cats.map((cn, b) => `${cn}: ${opt.items.map((_, i) => arr[i] === b ? lab(i) : null).filter(Boolean).join(", ") || "없음"}`).join(" / ");
  api.provide({ words: opt.cats, answers: [ansOf(want)] });
  const judge = () => {
    if (where.some(w => w < 0)) return api.hint("아직 넣지 않은 카드가 있어요. 모든 카드를 넣어요.");
    api.tryOnce(); const ans = ansOf(where);
    const bad = opt.items.map((_, i) => where[i] !== want[i] ? i : -1).filter(i => i >= 0);
    cards.forEach((c, i) => { c.classList.remove("q4good", "q4bad"); c.classList.add(bad.includes(i) ? "q4bad" : "q4good"); });
    if (!bad.length) return !api.done(ans, opt.ok);
    const b0 = opt.items[bad[0]];
    api.fail(b0.why || (opt.whyOf ? opt.whyOf(b0, lab(bad[0])) : `${lab(bad[0])}${q4J(lab(bad[0]), "을", "를")} 다시 살펴봐요.`), ans);
  };
  const auto = autoRun(() => where.every(w => w >= 0), () => where.join(","), judge, 1200);
  const wrap = h("div", {}, h("p", { class: "inst", style: "margin:.2em 0" }, (opt.tip || "카드를 끌어 알맞은 칸에 넣어요. 카드를 누른 다음 칸을 눌러도 돼요.") + " 카드를 모두 넣으면 저절로 확인해요."), pool, binWrap);
  body.append(wrap); paint();
}
/* 카드 속 변을 누르면 길이(1칸 = 1 cm) */
function q4Measurable(svg, p, P) {
  const lay = svgEl("g", { "pointer-events": "none" }), hits = svgEl("g"), shown = new Set(), C = q4Cen(P);
  const paint = () => {
    lay.innerHTML = "";
    shown.forEach(i => { const A = P[i], B = P[(i + 1) % 4], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = q4Unit(q4Sub(B, A)); let nn = [-d[1], d[0]]; if (q4Dt(nn, q4Sub(M, C)) < 0) nn = [-nn[0], -nn[1]];
      const L = q4D(p[i], p[(i + 1) % 4]), t = (Math.round(L * 10) / 10) + " cm", Q = [M[0] + nn[0] * 4, M[1] + nn[1] * 4];
      lay.append(svgEl("rect", { x: q4F(Q[0] - 30), y: q4F(Q[1] - 11), width: 60, height: 22, rx: 6, fill: "rgba(255,255,255,.95)", stroke: "#1D4E80", "stroke-width": 1.2 }), txt(Q[0], Q[1], t, 15, { fill: "#1D4E80" })); });
  };
  [0, 1, 2, 3].forEach(i => { const ln = q4Ln(P[i], P[(i + 1) % 4], { stroke: "rgba(0,0,0,0)", "stroke-width": 18, style: "cursor:pointer" });
    ln.addEventListener("click", e => { e.stopPropagation(); shown.has(i) ? shown.delete(i) : shown.add(i); paint(); });
    ln.addEventListener("pointerdown", e => e.stopPropagation());
    hits.append(ln); });
  svg.append(hits, lay);
}

/* =========================================================
   8. 점 종이(도형판) — 점을 눌러 꼭짓점을 찍거나, 꼭짓점 하나만 옮겨 사각형 만들기 (5·6·7·11차시)
   opt: {cols, rows, u, items:[{ask, fixed:[[i,j]…] 또는 start:[[i,j]×4], move:[옮길 수 있는 꼭짓점 번호…], fromPrev, need:"trap"|"para"|"rhom"|함수(I,V)→까닭|null, ok}], diff}
   ========================================================= */
function q4Geo(body, api, opt) {
  const u = opt.u || 50, cols = opt.cols || 10, rows = opt.rows || 6, pad = 28, W = pad * 2 + cols * u, H = pad * 2 + rows * u, svg = makeSvg(W, H);
  const px = ([i, j]) => [pad + i * u, pad + j * u];
  const grid = svgEl("g"), shape = svgEl("g"), top = svgEl("g"); svg.append(grid, shape, top);
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) { const a = px([i, j]); grid.append(svgEl("circle", { cx: a[0], cy: a[1], r: 4.5, fill: "#7D8D97" })); }
  let k = 0, V, fixedN, start, movable, showR = false;
  const made = [];
  const setup = () => {
    const it = opt.items[k];
    if (it.start || it.fromPrev) { start = (it.fromPrev ? V : it.start).map(q => q.slice()); V = start.map(q => q.slice()); fixedN = 4; movable = it.move || [0, 1, 2, 3]; }
    else { start = null; V = (it.fixed || []).map(q => q.slice()); fixedN = V.length; movable = null; }
  };
  const canMove = i => start ? movable.includes(i) : i >= fixedN;
  const draw = () => {
    shape.innerHTML = ""; top.innerHTML = "";
    const P = V.map(px), it = opt.items[k];
    if (start) start.forEach((q, i) => { if (V[i][0] !== q[0] || V[i][1] !== q[1]) { const a = px(q); top.append(svgEl("circle", { cx: a[0], cy: a[1], r: 11, fill: "none", stroke: Q4_GRAY, "stroke-width": 2, "stroke-dasharray": "4 3" })); } });
    if (P.length === 4) {
      const I = q4Info(V);
      shape.append(svgEl("polygon", { points: q4Pts(P), fill: "rgba(228,122,56,.2)", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }));
      if (I.simple) P.forEach((v, i) => { if (I.rights[i]) { const { V: X, u: a, w: b } = q4Corner(P, i); shape.append(q4RightMk(X, a, b, 14)); } });
    } else for (let i = 0; i + 1 < P.length; i++) shape.append(q4Ln(P[i], P[i + 1], { "stroke-width": 4 }));
    if (!start && fixedN >= 2) for (let i = 0; i + 1 < fixedN; i++) shape.append(q4Ln(P[i], P[i + 1], { stroke: Q4_SKY, "stroke-width": 7 }));
    if (showR && P.length >= 2) { const C = q4Cen(P); for (let i = 0; i < P.length - (P.length === 4 ? 0 : 1); i++) { const A = P[i], B = P[(i + 1) % P.length], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = q4Unit(q4Sub(B, A)); let nn = [-d[1], d[0]]; if (P.length > 2 && q4Dt(nn, q4Sub(M, C)) < 0) nn = [-nn[0], -nn[1]]; const Q = [M[0] + nn[0] * 22, M[1] + nn[1] * 22], L = q4D(V[i], V[(i + 1) % V.length]);
      shape.append(svgEl("rect", { x: q4F(Q[0] - 36), y: q4F(Q[1] - 13), width: 72, height: 26, rx: 7, fill: "rgba(255,255,255,.95)", stroke: "#1D4E80", "stroke-width": 1.2 }), txt(Q[0], Q[1], (Math.round(L * 10) / 10) + " cm", 16, { fill: "#1D4E80" })); } }
    P.forEach((p, i) => { const mv = canMove(i); top.append(svgEl("circle", { cx: q4F(p[0]), cy: q4F(p[1]), r: mv ? 13 : 9, fill: mv ? TENT : Q4_SKY, stroke: "#fff", "stroke-width": 3, style: mv ? "cursor:grab" : "" }));
      if (opt.names !== false) { const C = q4Cen(P.length ? P : [[0, 0]]); let d = q4Unit(q4Sub(p, C)); if (P.length < 3) d = [0, -1]; top.append(txt(p[0] + d[0] * 26, p[1] + d[1] * 26, Q4_V[i], 20)); } });
    askEl.textContent = (opt.items.length > 1 ? `(${k + 1}/${opt.items.length}) ` : "") + it.ask;
    tipEl.textContent = start ? `주황 꼭짓점${movable.length === 1 ? ` ${Q4_V[movable[0]]}` : ""}을 끌어 다른 점으로 옮겨요. 한 꼭짓점만 옮길 수 있어요.` : (V.length < 4 ? `점을 눌러 꼭짓점을 찍어요. (${V.length}/4) 찍은 꼭짓점은 끌어서 옮길 수 있어요.` : "주황 꼭짓점을 끌어 고칠 수 있어요.");
  };
  const nearest = q => { let best = null, bd = 1e9; for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) { const a = px([i, j]), d = Math.hypot(a[0] - q.x, a[1] - q.y); if (d < bd) { bd = d; best = [i, j]; } } return { best, bd }; };
  let di = -1, moved = false;
  dragOn(svg, q => {
    const P = V.map(px); di = P.findIndex((p, i) => canMove(i) && Math.hypot(p[0] - q.x, p[1] - q.y) < 30); moved = false;
    if (di >= 0) return true;
    if (!start && V.length < 4) { const { best, bd } = nearest(q); if (bd < u * .45 && !V.some(v => v[0] === best[0] && v[1] === best[1])) { V.push(best); draw(); auto(); } }
    return false;
  }, q => {
    if (di < 0) return; const { best } = nearest(q);
    if (best && !V.some((v, j) => j !== di && v[0] === best[0] && v[1] === best[1])) {
      if (start) V = start.map((s0, j) => j === di ? best.slice() : s0.slice()); else V[di] = best.slice();
      moved = true; draw();
    }
  }, () => { di = -1; auto(); });
  const askEl = h("p", { class: "jua", style: "margin:.2em 0" }), tipEl = h("p", { class: "inst", style: "margin:.2em 0" });
  const tools = h("div", { class: "tools" },
    h("button", { onclick: e => { showR = !showR; e.currentTarget.classList.toggle("on", showR); draw(); } }, "📏 변의 길이 보기"),
    h("button", { onclick: () => { if (!start && V.length > fixedN) { V.pop(); draw(); auto(); } } }, "한 점 지우기"),
    h("button", { onclick: () => { if (start) V = start.map(q => q.slice()); else V = (opt.items[k].fixed || []).map(q => q.slice()); draw(); } }, "처음으로"));
  const NEED = {
    trap: I => I.npar >= 1 ? null : "평행한 변이 없어요. 마주 보는 두 변 중 한 쌍이라도 평행하게 꼭짓점을 옮겨 봐요.",
    para: I => I.npar === 2 ? null : I.npar === 1 ? "평행한 변이 한 쌍뿐이에요. 마주 보는 두 쌍의 변이 모두 평행해야 해요." : "평행한 변이 없어요. 마주 보는 두 쌍의 변이 모두 평행하게 만들어요.",
    rhom: I => I.allEq ? null : "네 변의 길이가 모두 같지 않아요. ‘변의 길이 보기’로 재어 보고 고쳐 봐요.",
    rect: I => I.allRight ? null : "네 각이 모두 직각이 아니에요.",
    sq: I => I.allRight && I.allEq ? null : "네 각이 모두 직각이고 네 변의 길이가 모두 같아야 해요."
  };
  const sig = I => I.L.map(x => Math.round(x * x)).sort((a, b) => a - b).join(",") + "|" + I.A.map(a => Math.round(a)).sort((a, b) => a - b).join(",");
  api.provide({ words: ["평행한 변", "꼭짓점", "변의 길이"], answers: [opt.items.map(it => it.ans || it.ask).join(" / ")] });
  const judge = () => {
    const it = opt.items[k]; api.tryOnce();
    if (V.length < 4) return api.fail(`꼭짓점이 ${V.length}개예요. 점을 더 찍어 꼭짓점 4개를 만들어요.`, `꼭짓점 ${V.length}개`);
    const I = q4Info(V), desc = Q4_KNAME[I.kind] || "사각형이 아님";
    if (!I.simple) return api.fail("변이 서로 엇갈리거나 안으로 들어간 모양이에요. 꼭짓점을 옮겨 볼록한 사각형을 만들어요.", desc);
    if (start && V.every((v, i) => v[0] === start[i][0] && v[1] === start[i][1])) return api.fail("아직 꼭짓점을 옮기지 않았어요.", "그대로");
    const nd = typeof it.need === "function" ? it.need(I, V) : NEED[it.need](I);
    if (nd) return api.fail(nd, desc);
    if (opt.diff && made.some(m => m.sig === sig(I))) return api.fail("앞에서 만든 것과 모양이 같아요. 다른 모양으로 만들어 봐요.", desc);
    made.push({ sig: sig(I), desc });
    if (k < opt.items.length - 1) { api.hint(`○ ${it.ok || "잘 만들었어요!"} 다음 것도 해 봐요.`); k++; setup(); draw(); return; }
    return !api.done(made.map(m => m.desc).join(" / "), opt.ok || it.ok);
  };
  const auto = autoRun(() => V.length === 4 && !(start && V.every((v, i) => v[0] === start[i][0] && v[1] === start[i][1])), () => k + ":" + JSON.stringify(V), judge, 1200);
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, tipEl, h("p", { class: "inst", style: "margin:.2em 0" }, "꼭짓점 4개가 모두 놓이면 저절로 확인해요."), tools)));
  setup(); draw();
}

/* =========================================================
   9. 변 고르기 — 도형의 변을 눌러 평행한(수직인) 두 변을 고른다 (3·5차시)
   opt: {p(정수 좌표), want:[i,j] 변 번호, ask, kind:"para"|"perp", k}
   ========================================================= */
function q4SidePick(body, api, opt) {
  const W = 520, H = 360, svg = makeSvg(W, H), m = q4Map(opt.p, [0, 0, W, H, 60], opt.k || 60), P = m.P, n = P.length;
  q4Dots(svg, m, 8, 8, W - 8, H - 8, 2.4);
  const g = svgEl("g"); svg.append(g);
  const on = new Set();
  const sideName = i => `변 ${Q4_V[i]}${Q4_V[(i + 1) % n]}`;
  const draw = () => {
    g.innerHTML = "";
    g.append(q4PolyG(P, { names: true, fs: 22, sideCol: P.map((_, i) => on.has(i) ? Q4_SKY : null) }));
    P.forEach((v, i) => { const ln = q4Ln(v, P[(i + 1) % n], { stroke: "rgba(0,0,0,0)", "stroke-width": 26, style: "cursor:pointer" }); ln.addEventListener("click", () => { if (on.has(i)) on.delete(i); else { if (on.size >= 2) on.clear(); on.add(i); } draw(); auto(); }); g.append(ln); });
    out.textContent = on.size ? "고른 변: " + [...on].map(sideName).join(", ") : "고른 변이 없어요.";
  };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const ansTxt = `${sideName(opt.want[0])}${q4J(sideName(opt.want[0]), "과", "와")} ${sideName(opt.want[1])}`;
  api.provide({ words: ["평행한 두 변", "만나지 않는 두 변"], answers: [ansTxt] });
  const judge = () => {
    api.tryOnce(); const ans = out.textContent;
    if (on.size < 2) return api.fail("변을 두 개 골라요.", ans);
    const ok = opt.want.every(i => on.has(i));
    if (ok) return !api.done(ansTxt, opt.ok);
    api.fail(opt.bad || "고른 두 변은 늘이면 만나요. 늘여도 만나지 않는 두 변을 찾아봐요. 점 종이의 칸을 세어 기울기를 비교해 봐요.", ans);
  };
  const auto = autoRun(() => on.size === 2, () => [...on].sort().join(","), judge, 900);
  body.append(h("p", { class: "jua", style: "margin:.2em 0" }, opt.ask || ""), h("div", { class: "q4fig", style: "max-width:28em" }, svg), h("p", { class: "inst", style: "margin:.2em 0" }, "변을 눌러 두 개를 고르면 저절로 확인해요."), out);
  draw();
}

/* =========================================================
   10. 종이 접어 평행선 만들기 (3차시)
   빨간 선(처음 반으로 접은 선)에 수직이 되도록 두 번 더 접으면 파란 선 두 개가 생긴다.
   ========================================================= */
function q4FoldPar(body, api, opt = {}) {
  const W = 720, H = 420, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  /* 모양이 일정하지 않은 종이 */
  const paper = [[90, 70], [610, 40], [660, 230], [600, 380], [130, 360], [60, 220]];
  const ra = q4Rad(-12), re = [Math.cos(ra), Math.sin(ra)], rn = [-re[1], re[0]], RO = [360, 215];
  let stage = 0; const blues = []; let pos = -4;
  const P = s => [RO[0] + re[0] * s * 40, RO[1] + re[1] * s * 40];
  const draw = () => {
    g.innerHTML = "";
    g.append(svgEl("polygon", { points: q4Pts(paper), fill: "#FFF6DA", stroke: "#B48A2A", "stroke-width": 3 }));
    if (stage >= 1) g.append(q4Ln(P(-9), P(9), { stroke: Q4_RED, "stroke-width": 4, "stroke-dasharray": "12 6" }));
    blues.forEach(s => { const A = P(s), B = P(s); g.append(q4Ln([A[0] - rn[0] * 260, A[1] - rn[1] * 260], [B[0] + rn[0] * 260, B[1] + rn[1] * 260], { stroke: Q4_SKY, "stroke-width": 4, "stroke-dasharray": "12 6" }), q4RightMk(A, re, rn, 14, { stroke: "#1D4E80", "stroke-width": 2.5 })); });
    if (stage >= 1 && blues.length < 2) { const A = P(pos); g.append(q4Ln([A[0] - rn[0] * 260, A[1] - rn[1] * 260], [A[0] + rn[0] * 260, A[1] + rn[1] * 260], { stroke: Q4_SKY, "stroke-width": 2, opacity: .5 }), svgEl("circle", { cx: q4F(A[0]), cy: q4F(A[1]), r: 15, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" })); }
    stepEl.textContent = stage === 0 ? "① 종이를 반으로 접어 빨간 선을 만들어요." : blues.length < 2 ? `② 주황 점을 빨간 선을 따라 끌어 접을 곳을 정하고 ‘빨간 선에 맞추어 접기’를 눌러요. (${blues.length}/2)` : "③ 종이를 펼쳤어요. 두 파란 선을 살펴봐요.";
    b1.disabled = stage > 0; b2.disabled = stage === 0 || blues.length >= 2;
  };
  dragOn(svg, q => { if (stage < 1 || blues.length >= 2) return false; const A = P(pos); return Math.hypot(A[0] - q.x, A[1] - q.y) < 40; },
    q => { const v = q4Sub([q.x, q.y], RO); pos = Math.max(-6.5, Math.min(6.5, Math.round(q4Dt(v, re) / 40 * 2) / 2)); draw(); });
  const stepEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const b1 = h("button", { onclick: () => { stage = 1; draw(); } }, "① 반으로 접기");
  const b2 = h("button", { onclick: () => { if (blues.some(s => Math.abs(s - pos) < 1.5)) return api.hint("앞에서 접은 곳과 너무 가까워요. 조금 떨어진 곳에서 접어요."); blues.push(pos); pos = 4; draw(); auto(); } }, "빨간 선에 맞추어 접기");
  api.provide({ words: ["빨간 선", "수직", "평행"], answers: ["파란 선 두 개를 접었어요"] });
  const judge = () => {
    api.tryOnce();
    if (blues.length < 2) return api.fail("아직 파란 선을 두 개 다 접지 않았어요.", `파란 선 ${blues.length}개`);
    return !api.done("빨간 선에 수직인 파란 선 2개", opt.ok || "두 파란 선은 모두 빨간 선에 수직이에요.");
  };
  const auto = autoRun(() => blues.length >= 2, () => blues.join(","), judge, 600);
  body.append(stageWrap(svg, h("div", { class: "side" }, stepEl, h("div", { class: "tools" }, b1, b2))));
  draw();
}

/* =========================================================
   11. 평행사변형 종이 자르기 ① 겹치기 (6차시)
   선(마주 보는 꼭짓점 ㄱ·ㄷ을 이은 선)을 따라 자른 조각을 끌고 돌려 다른 조각에 겹친다.
   ========================================================= */
function q4Overlay(body, api, opt) {
  const W = 760, H = 420, svg = makeSvg(W, H, 20), g = svgEl("g"); svg.append(g);
  const m = q4Map(opt.p, [10, 40, W * .55, H - 60, 30], 60), P = m.P;
  const T1 = [P[0], P[1], P[2]], T2 = [P[2], P[3], P[0]];
  const c2 = q4Cen(T2);
  let rot = 0, off = [W * .42, 0], snapped = false;
  const tr = q => { let x = q[0], y = q[1]; if (rot) { x = 2 * c2[0] - x; y = 2 * c2[1] - y; } return [x + off[0], y + off[1]]; };
  const draw = () => {
    g.innerHTML = "";
    g.append(svgEl("polygon", { points: q4Pts(T1), fill: "rgba(43,123,214,.18)", stroke: Q4_SKY, "stroke-width": 4 }));
    T1.forEach((v, i) => g.append(txt(v[0] + (i === 1 ? 16 : -16), v[1] + (i === 2 ? -16 : 18), ["ㄱ", "ㄴ", "ㄷ"][i], 20)));
    const Q = T2.map(tr);
    g.append(svgEl("polygon", { points: q4Pts(Q), fill: snapped ? "rgba(36,150,90,.35)" : "rgba(228,122,56,.35)", stroke: snapped ? Q4_GREEN : TENT, "stroke-width": 4, style: "cursor:grab" }));
    Q.forEach((v, i) => { const c = q4Cen(Q), d = q4Unit(q4Sub(v, c)); g.append(txt(v[0] + d[0] * 20, v[1] + d[1] * 20, ["ㄷ", "ㄹ", "ㄱ"][i], 18, { fill: "#8A4A10" })); });
    stEl.textContent = snapped ? "두 조각이 완전히 겹쳐요!" : "주황 조각을 끌어 파란 조각 위에 겹쳐 봐요. 그대로는 안 맞으면 돌려 봐요.";
  };
  let grab = null;
  dragOn(svg, q => { const Q = T2.map(tr), c = q4Cen(Q); if (Math.hypot(c[0] - q.x, c[1] - q.y) > 140) return false; grab = [q.x - off[0], q.y - off[1]]; snapped = false; return true; },
    q => { off = [q.x - grab[0], q.y - grab[1]]; draw(); },
    () => { tryS(); });
  const tryS = () => {
    const Q = T2.map(tr);
    const match = Q.map(v => T1.findIndex(w => q4D(v, w) < 22));
    if (match.every(x => x >= 0) && new Set(match).size === 3) { /* 정확히 맞춤 */ const d = q4Sub(T1[match[0]], Q[0]); off = [off[0] + d[0], off[1] + d[1]]; snapped = true; }
    draw(); auto();
  };
  const stEl = h("p", { class: "jua", style: "margin:.2em 0" });
  api.provide({ words: ["겹쳐요", "180° 돌리기", "마주 보는 두 변", "마주 보는 두 각"], answers: ["두 조각이 완전히 겹쳐요"] });
  const judge = () => {
    api.tryOnce();
    if (!snapped) return api.fail("아직 두 조각이 겹쳐지지 않았어요. ‘180° 돌리기’를 누른 다음 끌어서 겹쳐 봐요.", "겹치지 않음");
    return !api.done("완전히 겹쳐요", opt.ok);
  };
  const auto = autoRun(() => snapped, () => "s" + rot, judge, 900);
  body.append(stageWrap(svg, h("div", { class: "side" }, stEl, h("div", { class: "tools" }, h("button", { onclick: () => { rot = rot ? 0 : 180; const c = q4Cen(T2.map(tr)); snapped = false; tryS(); } }, "↻ 180° 돌리기"), h("button", { onclick: () => { rot = 0; off = [W * .42, 0]; snapped = false; draw(); } }, "처음으로")))));
  draw();
}

/* =========================================================
   12. 각 이어 붙이기 — 사각형의 두 각을 골라 나란히 붙여 본다 (6차시)
   opt: {p, names, ok}
   ========================================================= */
function q4Corners(body, api, opt) {
  const W = 800, H = 380, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const m = q4Map(opt.p, [0, 20, W * .5, H - 30, 40], 60), P = m.P, I = q4Info(opt.p);
  const cols = ["#F28B82", "#8ECAE6", "#A7D7A0", "#FBD25B"];
  const pick = [], adjSet = new Set(); let seenAdj = false, seenOpp = false;
  const R = 46;
  const draw = () => {
    g.innerHTML = "";
    g.append(svgEl("polygon", { points: q4Pts(P), fill: "#FFFDF6", stroke: INK, "stroke-width": 4 }));
    P.forEach((v, i) => {
      const { V, u, w } = q4Corner(P, i), wd = svgEl("path", { d: q4Arc(V, u, w, R, true), fill: cols[i], stroke: pick.includes(i) ? INK : "none", "stroke-width": 3, style: "cursor:pointer" });
      wd.addEventListener("click", () => { if (pick.length >= 2) pick.length = 0; if (!pick.includes(i)) pick.push(i); draw(); auto(); });
      g.append(wd);
      const { b } = q4Corner(P, i); g.append(txt(V[0] - b[0] * 22, V[1] - b[1] * 22, Q4_V[i], 20));
    });
    /* 오른쪽: 고른 각을 한 점에 나란히 */
    const X = [W * .76, H * .66];
    g.append(svgEl("circle", { cx: X[0], cy: X[1], r: 4, fill: INK }));
    let a0 = 0;
    pick.forEach(i => {
      const A = I.A[i], s = [Math.cos(q4Rad(a0)), -Math.sin(q4Rad(a0))], e = [Math.cos(q4Rad(a0 + A)), -Math.sin(q4Rad(a0 + A))];
      g.append(svgEl("path", { d: q4Arc(X, s, e, 110, true), fill: cols[i], stroke: INK, "stroke-width": 2 }));
      const mid = [Math.cos(q4Rad(a0 + A / 2)), -Math.sin(q4Rad(a0 + A / 2))];
      g.append(txt(X[0] + mid[0] * 72, X[1] + mid[1] * 72, `${Q4_V[i]} ${q4Deg(A)}`, 17));
      a0 += A;
    });
    if (pick.length === 2) {
      const [i, j] = pick, adj = (Math.abs(i - j) === 1 || Math.abs(i - j) === 3), sum = Math.round(I.A[i] + I.A[j]);
      if (adj && sum === 180) { g.append(q4Ln([X[0] - 150, X[1]], [X[0] + 150, X[1]], { stroke: Q4_RED, "stroke-width": 3, "stroke-dasharray": "8 6" })); seenAdj = true; adjSet.add(Math.min(i, j) + "-" + Math.max(i, j)); }
      if (!adj) seenOpp = true;
      out.textContent = adj ? `이웃하는 두 각 ${Q4_V[i]}, ${Q4_V[j]}: ${q4Deg(I.A[i])} + ${q4Deg(I.A[j])} = ${sum}° ${sum === 180 ? "— 일직선이 돼요!" : ""}` : `마주 보는 두 각 ${Q4_V[i]}, ${Q4_V[j]}: ${q4Deg(I.A[i])}, ${q4Deg(I.A[j])}`;
    } else out.textContent = pick.length ? `각 ${Q4_V[pick[0]]}을 골랐어요. 붙일 각을 하나 더 눌러요.` : "색칠한 각을 두 개 눌러요.";
  };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  api.provide({ words: ["이웃하는 두 각", "180°", "일직선"], answers: ["이웃하는 두 각의 크기의 합은 180°"] });
  const judge = () => {
    api.tryOnce();
    if (!seenAdj) return api.fail("나란히 붙어 있는(이웃하는) 두 각을 골라 이어 붙여 봐요.", out.textContent);
    return !api.done("이웃하는 두 각을 붙이면 일직선(180°)", opt.ok);
  };
  const auto = autoRun(() => adjSet.size >= 2, () => [...adjSet].sort().join(","), judge, 1200);
  body.append(h("div", { class: "stage" }, svg), h("p", { class: "inst", style: "margin:.2em 0" }, "평행사변형의 색칠한 각을 두 개 누르면 오른쪽에 두 각을 나란히 붙여 보여 줘요. 이웃하는 두 각을 서로 다른 두 짝 이상 붙여 보면 저절로 확인해요."), out);
  draw();
}

/* =========================================================
   13. 마름모 종이 접기 (7차시)
   ① ㄱㄷ을 따라 반으로 접기 → ② ㄴㄹ을 따라 한 번 더 접기 → 펼쳐서 재어 보기
   ========================================================= */
function q4FoldRh(body, api, opt) {
  const W = 760, H = 460, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  /* 마름모: 반대각선 a(ㄱㄷ), b(ㄴㄹ) (cm), 돌림 */
  const a = opt.a || 2.4, b = opt.b || 1.6, rot = opt.rot || 18, U = opt.U || 78;
  const C = [W * .42, H / 2], ra = q4Rad(rot);
  const e1 = [Math.sin(ra), -Math.cos(ra)], e2 = [Math.cos(ra), Math.sin(ra)];   /* e1: ㅁ→ㄱ, e2: ㅁ→ㄹ */
  const Pt = (x, y) => [C[0] + e2[0] * x * U + e1[0] * y * U, C[1] + e2[1] * x * U + e1[1] * y * U];
  const K = { ㄱ: Pt(0, a), ㄴ: Pt(-b, 0), ㄷ: Pt(0, -a), ㄹ: Pt(b, 0), ㅁ: C };
  let stage = 0, anim = null, f = 0;   /* stage 0 펼침, 1 한 번 접음, 2 두 번 접음, 3 펼침(선 보임) */
  const meas = new Set();
  /* 접기: 점 x를 접는 선(지나는 점 L, 방향 d)에 대해 진행 f(0~1)만큼 */
  const fold = (x, L, d, t) => { const v = q4Sub(x, L), along = q4Dt(v, d), foot = [L[0] + d[0] * along, L[1] + d[1] * along], off = q4Sub(x, foot), c = Math.cos(Math.PI * t); return [foot[0] + off[0] * c, foot[1] + off[1] * c]; };
  const d1 = q4Unit(q4Sub(K.ㄱ, K.ㄷ)), d2 = q4Unit(q4Sub(K.ㄹ, K.ㄴ));
  const draw = () => {
    g.innerHTML = "";
    const poly = (pts, fill) => g.append(svgEl("polygon", { points: q4Pts(pts), fill, stroke: INK, "stroke-width": 3.5, "stroke-linejoin": "round" }));
    const lab = (p, t, dx = 0, dy = 0) => g.append(txt(p[0] + dx, p[1] + dy, t, 20));
    if (stage === 0 || stage === 3) {
      poly([K.ㄱ, K.ㄴ, K.ㄷ, K.ㄹ], "#FDE7EF");
      if (stage === 3) {
        g.append(q4Ln(K.ㄱ, K.ㄷ, { stroke: Q4_RED, "stroke-width": 3, "stroke-dasharray": "10 6" }), q4Ln(K.ㄴ, K.ㄹ, { stroke: Q4_SKY, "stroke-width": 3, "stroke-dasharray": "10 6" }));
        if (meas.has("ang")) g.append(q4RightMk(C, d1, d2, 16, { stroke: Q4_RED, "stroke-width": 3 }));
        ["ㄱ", "ㄴ", "ㄷ", "ㄹ"].forEach(nm => { const P = K[nm], hit = q4Ln(C, P, { stroke: "rgba(0,0,0,0)", "stroke-width": 24, style: "cursor:pointer" });
          hit.addEventListener("click", () => { meas.has(nm) ? meas.delete(nm) : meas.add(nm); draw(); auto(); }); g.append(hit);
          if (meas.has(nm)) { const M = [(C[0] + P[0]) / 2, (C[1] + P[1]) / 2], L = (nm === "ㄱ" || nm === "ㄷ") ? a : b, t = q4Cm(L), d = q4Unit(q4Sub(P, C)), nn = [-d[1] * 26, d[0] * 26];
            g.append(svgEl("rect", { x: q4F(M[0] + nn[0] * 1.6 - 50), y: q4F(M[1] + nn[1] * 1.6 - 14), width: 100, height: 28, rx: 7, fill: "#fff", stroke: "#1D4E80", "stroke-width": 1.2 }), txt(M[0] + nn[0] * 1.6, M[1] + nn[1] * 1.6, t, 17, { fill: "#1D4E80" })); } });
        const hc = svgEl("circle", { cx: C[0], cy: C[1], r: 18, fill: "rgba(0,0,0,0)", style: "cursor:pointer" }); hc.addEventListener("click", () => { meas.has("ang") ? meas.delete("ang") : meas.add("ang"); draw(); auto(); }); g.append(hc);
        if (meas.has("ang")) g.append(txt(C[0] + 34, C[1] - 30, "90°", 18, { fill: Q4_RED }));
        lab(C, "ㅁ", -20, 22);
      }
      lab(K.ㄱ, "ㄱ", 0, -18); lab(K.ㄴ, "ㄴ", -20, 0); lab(K.ㄷ, "ㄷ", 0, 20); lab(K.ㄹ, "ㄹ", 20, 0);
    } else if (stage === 1) {
      /* 왼쪽 반 ㄱㄴㄷ 그대로, 오른쪽 반(ㄹ 쪽)이 접혀 넘어옴 */
      poly([K.ㄱ, K.ㄴ, K.ㄷ], "#FDE7EF");
      const R = fold(K.ㄹ, K.ㄱ, d1, f);
      poly([K.ㄱ, R, K.ㄷ], f > .5 ? "#F7C6D7" : "#FDE7EF");
      lab(K.ㄱ, "ㄱ", 0, -18); lab(K.ㄷ, "ㄷ", 0, 20); lab(K.ㄴ, f >= 1 ? "ㄴ(ㄹ)" : "ㄴ", -30, 0); if (f < 1) lab(R, "ㄹ", 18, 0);
    } else if (stage === 2) {
      /* 접힌 삼각형 ㄱㄴㄷ에서 ㄱ 쪽(ㄴㅁ 위)을 ㄴㅁ을 따라 접어 ㄷ에 겹침 */
      poly([K.ㄴ, C, K.ㄷ], "#F7C6D7");
      const A2 = fold(K.ㄱ, K.ㄴ, d2, f);
      poly([K.ㄴ, C, A2], f > .5 ? "#EFA6BF" : "#F7C6D7");
      lab(K.ㄴ, "ㄴ(ㄹ)", -34, 0); lab(C, "ㅁ", 16, -12); lab(K.ㄷ, f >= 1 ? "ㄷ(ㄱ)" : "ㄷ", 0, 22); if (f < 1) lab(A2, "ㄱ", 0, -18);
    }
    stEl.textContent = ["① ‘ㄱㄷ을 따라 반으로 접기’를 눌러요.", f >= 1 ? "ㄹ이 ㄴ에 꼭 겹쳐요. 각 ㄴ과 각 ㄹ의 크기가 같아요. ② 한 번 더 접어요." : "접는 중…", f >= 1 ? "ㄱ이 ㄷ에 꼭 겹쳐요. 이제 펼쳐 봐요." : "접는 중…", "펼쳤어요. 선분 ㅁㄱ, ㅁㄴ, ㅁㄷ, ㅁㄹ을 눌러 길이를 재고, 점 ㅁ을 눌러 두 선분이 만나는 각을 재어 봐요. 모두 재면 저절로 확인해요."][stage];
    bA.disabled = stage !== 0; bB.disabled = !(stage === 1 && f >= 1); bC.disabled = !(stage === 2 && f >= 1);
  };
  const go = st => { stage = st; f = 0; const t0 = performance.now(); if (anim) cancelAnimationFrame(anim); const step = now => { f = Math.min(1, (now - t0) / 800); draw(); if (f < 1) anim = requestAnimationFrame(step); }; anim = requestAnimationFrame(step); draw(); };
  const stEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const bA = h("button", { onclick: () => go(1) }, "① ㄱㄷ을 따라 반으로 접기");
  const bB = h("button", { onclick: () => go(2) }, "② ㄴㄹ을 따라 한 번 더 접기");
  const bC = h("button", { onclick: () => { stage = 3; draw(); } }, "③ 펼치기");
  api.provide({ words: ["마주 보는 두 각", "선분 ㅁㄱ = 선분 ㅁㄷ", "90°"], answers: ["접고 펼쳐서 재어 보았어요"] });
  const judge = () => {
    api.tryOnce();
    if (stage < 3) return api.fail("순서대로 두 번 접은 다음 펼쳐 봐요.", "접는 중");
    if (!["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ang"].every(x => meas.has(x))) return api.fail("펼친 종이에서 네 선분의 길이와 점 ㅁ의 각을 모두 재어 봐요.", `${meas.size}곳 잼`);
    return !api.done(`ㅁㄱ=ㅁㄷ=${q4Cm(a)}, ㅁㄴ=ㅁㄹ=${q4Cm(b)}, 90°`, opt.ok);
  };
  const auto = autoRun(() => stage === 3 && ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ang"].every(x => meas.has(x)), () => [...meas].sort().join(""), judge, 900);
  body.append(stageWrap(svg, h("div", { class: "side" }, stEl, h("div", { class: "tools" }, bA, bB, bC, h("button", { onclick: () => { if (anim) cancelAnimationFrame(anim); stage = 0; f = 0; meas.clear(); draw(); } }, "처음으로")))));
  draw();
}

/* =========================================================
   14. 성질 표 — 설명에 알맞은 사각형에 ◯ (8차시)
   opt: {shapes:[p…], rows:[[글, 함수]…], labels, ok}
   ========================================================= */
function q4Table(body, api, opt) {
  const ns = opt.shapes.length, labs = opt.labels || Q4_KO.slice(0, ns), rows = opt.rows || Q4_DESC;
  const tbl = h("div", { class: "q4tbl", style: `grid-template-columns:minmax(8em,1.6fr) repeat(${ns},minmax(0,1fr))` });
  tbl.append(h("div", { class: "q4th" }, "설명"));
  opt.shapes.forEach((p, i) => { const s = makeSvg(120, 110), mm = q4Map(p, [0, 18, 120, 92, 10], opt.k || 18); q4Dots(s, mm, 2, 20, 118, 108, 1.5); s.append(q4PolyG(mm.P, { fs: 12, sw: 2.5 })); s.append(txt(60, 11, labs[i], 15)); tbl.append(h("div", { class: "q4th" }, s)); });
  const st = rows.map(() => opt.shapes.map(() => false)), cells = [];
  const want = rows.map(r => opt.shapes.map(p => r[1](q4Info(p))));
  rows.forEach((r, ri) => {
    tbl.append(h("div", { class: "q4th q4rh" }, r[0]));
    opt.shapes.forEach((_, ci) => { const c = h("button", { class: "q4cell", "aria-label": `${r[0]} ${labs[ci]}`, onclick: () => { st[ri][ci] = !st[ri][ci]; c.textContent = st[ri][ci] ? "◯" : "​"; c.classList.remove("q4good", "q4bad"); auto(); } }, "​"); cells.push({ c, ri, ci }); tbl.append(c); });
  });
  api.provide({ words: ["평행", "마주 보는", "네 변", "네 각"], answers: rows.map((r, ri) => `${r[0]} ${labs.filter((_, ci) => want[ri][ci]).join(", ")}`) });
  const judge = () => {
    api.tryOnce(); let bad = null;
    cells.forEach(({ c, ri, ci }) => { const ok = st[ri][ci] === want[ri][ci]; c.classList.remove("q4good", "q4bad"); if (st[ri][ci]) c.classList.add(ok ? "q4good" : "q4bad"); if (!ok && !bad) bad = { ri, ci }; });
    const ans = rows.map((r, ri) => labs.filter((_, ci) => st[ri][ci]).join("") || "-").join(" / ");
    if (!bad) return !api.done(ans, opt.ok);
    api.fail(`‘${rows[bad.ri][0]}’ 줄의 ${labs[bad.ci]}${q4J(labs[bad.ci], "을", "를")} 다시 살펴봐요. ${want[bad.ri][bad.ci] ? "이 사각형도 그 설명에 맞아요." : "이 사각형은 그 설명에 맞지 않아요."}`, ans);
  };
  const nWant = want.flat().filter(Boolean).length;
  const auto = autoRun(() => st.flat().filter(Boolean).length >= nWant, () => JSON.stringify(st), judge, 1200);
  body.append(h("p", { class: "inst", style: "margin:.2em 0" }, `칸을 누르면 ◯가 생기고, 다시 누르면 지워져요. 점 종이의 칸을 세어 평행·길이·직각을 살펴봐요. ◯를 ${nWant}개 그리면 저절로 확인해요.`), tbl);
}

/* =========================================================
   15. 종이띠로 사각형 만들기 (8차시)
   긴 띠 5 cm 4개, 짧은 띠 3 cm 2개 중 4개를 골라 차례로 잇고, 각 ㄱ을 바꾸어 사각형을 만든다.
   ========================================================= */
function q4Strips(body, api, opt = {}) {
  const STR = [5, 5, 5, 5, 3, 3], U = 44, W = 640, H = 420, svg = makeSvg(W, H, 22), g = svgEl("g"); svg.append(g);
  const order = []; let ang = 70, name = null;
  const need = opt.count || 2, made = [];
  const build = () => {
    if (order.length < 4) return null;
    const [a, b, c, d] = order.map(i => STR[i]), th = q4Rad(ang);
    const P0 = [0, 0], P1 = [a, 0], P3 = [d * Math.cos(th), d * Math.sin(th)];
    const D = q4D(P1, P3); if (D > b + c + 1e-9 || D < Math.abs(b - c) - 1e-9) return null;
    const x = (b * b - c * c + D * D) / (2 * D), hh = Math.sqrt(Math.max(0, b * b - x * x)), ux = q4Unit(q4Sub(P3, P1)), nn = [-ux[1], ux[0]];
    for (const sg of [1, -1]) { const P2 = [P1[0] + ux[0] * x + nn[0] * hh * sg, P1[1] + ux[1] * x + nn[1] * hh * sg], p = q4Y([P0, P1, P2, P3]), I = q4Info(p); if (I.simple) return { p, I }; }
    return null;
  };
  /* 거의 평행·거의 직각이면 헷갈리므로 받지 않음 */
  const fuzzy = I => { const S = I.S, angP = (u, v) => Math.acos(Math.min(1, Math.abs(q4Dt(u, v)) / (q4Len(u) * q4Len(v)))) * 180 / Math.PI;
    const nearPar = [[0, 2], [1, 3]].some(([i, j]) => { const t = angP(S[i], S[j]); return t > 1e-6 && t < 4; });
    const nearRight = I.A.some(x => Math.abs(x - 90) > 1e-6 && Math.abs(x - 90) < 4); return nearPar || nearRight; };
  const draw = () => {
    g.innerHTML = ""; const B = build();
    if (!B) { g.append(txt(W / 2, H / 2, order.length < 4 ? "띠를 4개 골라요" : "띠가 서로 이어지지 않아요. 각을 바꿔 봐요.", 22, { fill: Q4_GRAY })); }
    else {
      const mm = q4Map(B.p, [0, 0, W, H, 50], U), cols = order.map(i => STR[i] === 5 ? "#E4A72B" : "#4FA3D9");
      g.append(svgEl("polygon", { points: q4Pts(mm.P), fill: "rgba(255,243,226,.8)", stroke: "none" }));
      mm.P.forEach((v, i) => g.append(q4Ln(v, mm.P[(i + 1) % 4], { stroke: cols[i], "stroke-width": 14 })));
      g.append(q4PolyG(mm.P, { fill: "none", sw: 1.5, stroke: "#5A4A20", names: true, fs: 20, lens: order.map(i => STR[i] + " cm"), angs: [q4Deg(ang)] }));
    }
    seq.textContent = order.length ? "고른 띠(차례): " + order.map(i => STR[i] + " cm").join(" → ") : "아래 띠를 눌러 4개를 차례로 골라요.";
    sb.forEach((b, i) => b.classList.toggle("q4used", order.includes(i)));
    nb.forEach(b => b.classList.toggle("q4on", b.dataset.n === name));
    angEl.textContent = `각 ㄱ: ${ang}°`;
    madeEl.textContent = made.length ? "만든 사각형: " + made.join(", ") : "​";
  };
  const sb = STR.map((L, i) => { const b = h("button", { class: "q4strip", style: `width:${L * 2.2}em;background:${L === 5 ? "#FBD25B" : "#A9D6F2"}`, onclick: () => { const k = order.indexOf(i); if (k >= 0) order.splice(k, 1); else if (order.length < 4) order.push(i); draw(); auto(); } }, `${L} cm`); return b; });
  const seq = h("div", { class: "jua" }), angEl = h("span", { class: "jua" }), madeEl = h("div", { class: "inst" });
  const slider = h("input", { type: "range", min: 30, max: 150, step: 5, value: ang, "aria-label": "각 ㄱ", oninput: e => { ang = +e.target.value; draw(); auto(); } });
  const NAMES = ["사다리꼴", "평행사변형", "마름모", "직사각형", "정사각형", "평행한 변이 없는 사각형"];
  const nb = NAMES.map(n => { const b = h("button", { onclick: () => { name = n; draw(); auto(); } }, n); b.dataset.n = n; return b; });
  api.provide({ words: ["네 변의 길이가 모두 같아요", "마주 보는 두 쌍의 변이 평행해요", "네 각이 모두 직각이에요"], answers: ["긴 띠 4개 → 마름모, 긴 띠 2개와 짧은 띠 2개를 마주 보게 → 평행사변형"] });
  const judge = () => {
    api.tryOnce(); const B = build();
    if (!B) return api.fail(order.length < 4 ? "띠를 4개 골라요." : "띠가 이어지지 않아요. 각 ㄱ을 바꾸거나 띠의 차례를 바꿔 봐요.", "-");
    if (fuzzy(B.I)) return api.fail("거의 평행하거나 거의 직각인 곳이 있어서 헷갈려요. 각 ㄱ을 조금 바꿔 봐요.", "-");
    if (!name) return api.fail("만든 사각형의 이름을 골라요.", "-");
    if (!Q4_DEF[name](B.I)) return api.fail(`이 사각형은 ${name}${q4J(name, "이", "가")} 아니에요. ${name === "평행한 변이 없는 사각형" ? "평행한 변이 있어요." : "약속을 떠올려 다시 살펴봐요."}`, name);
    if (made.includes(name)) return api.fail("앞에서 만든 사각형과 이름이 같아요. 띠나 각을 바꾸어 다른 사각형을 만들어 봐요.", name);
    made.push(name); name = null;
    if (made.length < need) { api.hint(`○ ${made[made.length - 1]}${q4J(made[made.length - 1], "을", "를")} 만들었어요! 다른 사각형도 만들어 봐요.`); draw(); return; }
    draw(); return !api.done(made.join(", "), opt.ok || "종이띠로 여러 가지 사각형을 만들었어요. 띠의 길이와 각에 따라 이름이 달라져요.");
  };
  const auto = autoRun(() => !!name && order.length === 4, () => order.join("") + ":" + ang + ":" + name, judge, 1200);
  body.append(stageWrap(svg, h("div", { class: "side" }, seq, h("div", { class: "q4strips" }, sb), h("div", { class: "q4slider" }, angEl, slider), h("p", { class: "jua", style: "margin:.2em 0" }, "만든 사각형의 이름(고르면 저절로 확인해요)"), h("div", { class: "q4names" }, nb), madeEl)));
  draw();
}

/* =========================================================
   16. 훈련 탑 — 필요한 길이를 눌러 고른다 (9차시)
   opt: {floors:[{y(m), n}], tags:[{t, need, x1,y1,x2,y2(m), kind:"v"|"s", lab}], ok, ask}
   ========================================================= */
function q4Tower(body, api, opt) {
  const M = 44, top = Math.max(...opt.floors.map(f => f.y)) + (opt.roof || 0), W = 700, H = top * M + 90, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const X0 = 150, X1 = 520, Y = y => H - 40 - y * M, Xp = x => X0 + x * M;
  const on = new Set();
  const draw = () => {
    g.innerHTML = "";
    g.append(svgEl("rect", { x: 0, y: H - 40, width: W, height: 40, fill: "#D9CBB2" }));
    g.append(svgEl("rect", { x: X0, y: Y(top), width: X1 - X0, height: top * M, fill: "#F3E6D3", stroke: "#8A6A3A", "stroke-width": 3 }));
    [X0 + 4, (X0 + X1) / 2, X1 - 4].forEach(x => g.append(q4Ln([x, Y(0)], [x, Y(top)], { stroke: "#8A6A3A", "stroke-width": 8, "stroke-linecap": "butt" })));
    opt.floors.forEach(f => { g.append(q4Ln([X0 - 20, Y(f.y)], [X1 + 60, Y(f.y)], { stroke: INK, "stroke-width": 5 })); g.append(txt(X1 + 84, Y(f.y), f.n, 20)); if (f.lab) g.append(txt(X0 - 52, Y(f.y) - 14, f.lab, 15, { fill: "#5A4A20" })); });
    (opt.deco || []).forEach(dc => dc(g, Xp, Y));
    opt.tags.forEach((tg, i) => {
      const A = [Xp(tg.x1), Y(tg.y1)], B = [Xp(tg.x2), Y(tg.y2)], col = on.has(i) ? Q4_RED : "#1D4E80";
      const gg = svgEl("g", { style: "cursor:pointer" });
      gg.append(q4Ln(A, B, { stroke: col, "stroke-width": on.has(i) ? 4 : 2.5, "stroke-dasharray": tg.kind === "s" ? "" : "" }));
      const d = q4Unit(q4Sub(B, A)), nn = [-d[1], d[0]];
      [A, B].forEach((P, k) => gg.append(q4Ln([P[0] - nn[0] * 7, P[1] - nn[1] * 7], [P[0] + nn[0] * 7, P[1] + nn[1] * 7], { stroke: col, "stroke-width": 2.5 })));
      const Mp = [(A[0] + B[0]) / 2 + (tg.dx || 0), (A[1] + B[1]) / 2 + (tg.dy || 0)];
      gg.append(svgEl("rect", { x: q4F(Mp[0] - 34), y: q4F(Mp[1] - 14), width: 68, height: 28, rx: 8, fill: on.has(i) ? "#FBE7E2" : "#fff", stroke: col, "stroke-width": 2 }), txt(Mp[0], Mp[1], tg.t, 17, { fill: col }));
      gg.append(q4Ln(A, B, { stroke: "rgba(0,0,0,0)", "stroke-width": 22 }));
      gg.addEventListener("click", () => { on.has(i) ? on.delete(i) : on.add(i); draw(); });
      g.append(gg);
    });
    out.textContent = on.size ? "고른 길이: " + [...on].sort((a, b) => a - b).map(i => opt.tags[i].t).join(", ") : "고른 길이가 없어요.";
  };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const want = opt.tags.map((t, i) => t.need ? i : -1).filter(i => i >= 0);
  api.provide({ words: ["평행선 사이의 거리", "바닥과 기둥이 수직"], answers: [want.map(i => opt.tags[i].t).join(", ")] });
  const judge = () => {
    api.tryOnce(); const ans = out.textContent;
    const extra = [...on].find(i => !opt.tags[i].need), miss = want.find(i => !on.has(i));
    if (extra == null && miss == null) return !api.done(want.map(i => opt.tags[i].t).join(" + "), opt.ok);
    api.fail(extra != null ? (opt.tags[extra].why || `${opt.tags[extra].t}는 필요하지 않아요.`) : "아직 고르지 않은 길이가 있어요. 바닥에서 바닥까지 수직인 길이를 모두 골라요.", ans);
  };
  body.append(h("p", { class: "jua", style: "margin:.2em 0" }, opt.ask || ""), h("div", { class: "q4fig", style: "max-width:36em" }, svg), h("p", { class: "inst", style: "margin:.2em 0" }, "길이 표시를 누르면 골라져요. 다시 누르면 취소돼요."), out);
  draw();
}

/* =========================================================
   17. 사각형 카드 그림(놀이용)
   ========================================================= */
function q4MiniSvg(p, w = 140, hgt = 100, k = 20) { const s = makeSvg(w, hgt), mm = q4Map(p, [0, 0, w, hgt, 12], k); s.append(q4PolyG(mm.P, { fs: 12, sw: 3, fill: "#FFF3E2" })); return s; }

/* =========================================================
   18. 빨리! 더 빨리! 내려놓아요 — 도형 카드와 설명 카드 놀이 (10차시)
   나(학생)와 친구 두 명(컴퓨터)이 차례로 카드를 내려놓는다.
   ========================================================= */
function q4Game(body, api, opt) {
  const SH = opt.shapes, DS = opt.descs;   /* SH:[{n, p}], DS:[[글, 함수]] */
  const fits = (sc, dc) => DS[dc.i][1](q4Info(SH[sc.i].p));
  const match = (a, b) => a.t !== b.t && (a.t === "s" ? fits(a, b) : fits(b, a));
  let seed = opt.seed || 7; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  let deck, pile, hands, turn, over, busy, log, only;
  const names = ["나", "하율", "친구"];
  const cardEl = (c, extra = {}) => {
    const el = h("button", Object.assign({ class: "q4gc" + (c.t === "d" ? " q4desc" : "") }, extra));
    if (c.t === "s") el.append(q4MiniSvg(SH[c.i].p, 120, 80, 16), h("span", {}, SH[c.i].n)); else el.append(h("span", {}, DS[c.i][0].replace(/입니다\.$|습니다\.$/, m => m)));
    return el;
  };
  const cName = c => c.t === "s" ? SH[c.i].n : `‘${DS[c.i][0]}’`;
  const reset = () => {
    deck = [];
    /* 짝이 하나뿐인 카드(평행한 변이 없는 사각형)는 1장씩만: 그 둘만 번갈아 놓이며 놀이가 멈추지 않게 */
    only = (t, i) => (t === "s" ? DS.filter(d => d[1](q4Info(SH[i].p))) : SH.filter(sh => DS[i][1](q4Info(sh.p)))).length <= 1;
    SH.forEach((_, i) => { for (let k = only("s", i) ? 1 : 3; k > 0; k--) deck.push({ t: "s", i }); }); DS.forEach((_, i) => { for (let k = only("d", i) ? 1 : 3; k > 0; k--) deck.push({ t: "d", i }); });
    shuffle(deck); hands = [deck.splice(0, 7), deck.splice(0, 7), deck.splice(0, 7)]; pile = [deck.pop()]; turn = 0; over = null; busy = false; log = "가운데 카드에 알맞은 카드를 내 손에서 골라 내려놓아요.";
    draw();
  };
  const draw1 = () => {
    if (!deck.length && pile.length > 1) { const topC = pile.pop(); deck = shuffle(pile); pile = [topC]; }
    if (deck.length) return deck.pop();
    /* 쌓아 둔 카드가 없으면 가운데에 새 카드를 한 장 놓아요 */
    for (;;) { const c = rnd() < .5 ? { t: "s", i: Math.floor(rnd() * SH.length) } : { t: "d", i: Math.floor(rnd() * DS.length) }; if (!only(c.t, c.i)) { pile.push(c); return null; } }
  };
  const ai = who => {
    const topC = pile[pile.length - 1], hand = hands[who];
    const k = hand.findIndex(c => match(c, topC));
    if (k >= 0) { const c = hand.splice(k, 1)[0]; pile.push(c); log = `${names[who]}: ${cName(c)} 카드를 내려놓았어요.`; }
    else { const c = draw1(); if (c) { hand.push(c); log = `${names[who]}: 내려놓을 카드가 없어서 한 장 가져갔어요.`; } else log = "쌓아 둔 카드가 없어서 가운데에 새 카드를 한 장 놓았어요."; }
    if (!hand.length) over = who;
  };
  const next = () => {
    if (over != null) return finish();
    busy = true; turn = 1; draw();
    setTimeout(() => { ai(1); draw(); if (over != null) return finish();
      setTimeout(() => { ai(2); draw(); if (over != null) return finish(); turn = 0; busy = false; draw(); }, opt.delay || 700); }, opt.delay || 700);
  };
  const finish = () => {
    busy = false; draw();
    const msg = over === 0 ? "이겼다! 카드를 모두 내려놓았어요." : `${names[over]}${q4J(names[over], "이", "가")} 먼저 카드를 모두 내려놓았어요. 한 판 더 해도 좋아요.`;
    api.done(over === 0 ? "놀이 끝 — 내가 이김" : `놀이 끝 — ${names[over]} 이김`, msg + " 성질을 따져 카드를 알맞게 내려놓았어요.");
  };
  const wrap = h("div");
  const draw = () => {
    wrap.innerHTML = "";
    const topC = pile[pile.length - 1];
    wrap.append(h("div", { class: "q4pile" }, h("div", {}, h("div", { class: "inst" }, "가운데 카드"), cardEl(topC, { disabled: true })),
      h("div", {}, h("div", { class: "inst" }, `남은 카드 ${deck.length}장`), h("div", { class: "inst" }, `하율 ${hands[1].length}장 · 친구 ${hands[2].length}장`), h("div", { class: "jua" }, over != null ? "놀이 끝!" : turn === 0 ? "내 차례예요" : `${names[turn]}의 차례…`))));
    wrap.append(h("div", { class: "q4log" }, log));
    const hand = h("div", { class: "q4hand" });
    hands[0].forEach((c, k) => hand.append(cardEl(c, { onclick: () => {
      if (busy || over != null || turn !== 0) return;
      if (!match(c, topC)) { api.hint(c.t === topC.t ? (c.t === "s" ? "가운데가 도형 카드이면 설명 카드를 내려놓아요." : "가운데가 설명 카드이면 도형 카드를 내려놓아요.") : `${c.t === "s" ? SH[c.i].n : SH[topC.i].n}${q4J(c.t === "s" ? SH[c.i].n : SH[topC.i].n, "은", "는")} ${c.t === "s" ? cName(topC) : cName(c)}에 맞지 않아요.`); return; }
      hands[0].splice(k, 1); pile.push(c); log = `나: ${cName(c)} 카드를 내려놓았어요.`;
      if (!hands[0].length) over = 0; next();
    } })));
    wrap.append(h("div", { class: "inst" }, `내 카드 ${hands[0].length}장`), hand);
    wrap.append(h("div", { class: "actions" }, h("button", { class: "ghost", disabled: busy || over != null, onclick: () => {
      if (hands[0].some(c => match(c, topC))) return api.hint("내려놓을 수 있는 카드가 있어요. 내 카드를 다시 살펴봐요.");
      const c = draw1(); if (c) { hands[0].push(c); log = "나: 내려놓을 카드가 없으니까 한 장 가져갔어요."; } else log = "쌓아 둔 카드가 없어서 가운데에 새 카드를 한 장 놓았어요."; next();
    } }, "한 장 가져오기"), h("button", { class: "ghost", onclick: () => { seed = Math.floor(Math.random() * 1000) + 1; reset(); } }, "새 판")));
  };
  api.provide({ words: ["도형 카드", "설명 카드", "성질"], answers: ["카드를 모두 내려놓아요"] });
  body.append(wrap); reset();
}

/* =========================================================
   19. 예·아니요 사각형 맞히기(또 다른 놀이) (10차시)
   ========================================================= */
function q4Twenty(body, api, opt) {
  let seed = opt.seed || 3; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  let secret, asked;
  const wrap = h("div");
  const QS = Q4_ASK;
  const start = () => { secret = opt.shapes[Math.floor(rnd() * opt.shapes.length)]; asked = []; draw(); };
  const draw = () => {
    wrap.innerHTML = "";
    const I = q4Info(secret.p);
    wrap.append(h("p", { class: "inst", style: "margin:.2em 0" }, "친구가 모눈종이에 사각형을 하나 몰래 그렸어요. 질문을 눌러 ‘예/아니요’ 답을 듣고 이름을 맞혀 보세요."));
    const qs = h("div", { class: "q4qs" });
    QS.forEach(([t, f], i) => { const did = asked.includes(i), ans = f(I); qs.append(h("button", { class: did ? (ans ? "q4yes" : "q4nope") : "", onclick: () => { if (!asked.includes(i)) asked.push(i); draw(); } }, did ? `${t} → ${ans ? "예" : "아니요"}` : t)); });
    wrap.append(qs, h("div", { class: "readout", style: "font-size:var(--fs)" }, `질문한 횟수: ${asked.length}번`));
    const nb = h("div", { class: "q4names" });
    ["사다리꼴", "평행사변형", "마름모", "직사각형", "정사각형", "평행한 변이 없는 사각형"].forEach(n => nb.append(h("button", { onclick: () => {
      api.tryOnce();
      if (!asked.length) return api.hint("먼저 질문을 해 봐요.");
      if (!Q4_DEF[n](I)) { asked.push(-1); return api.fail(`아니에요. ${n}${q4J(n, "이", "가")} 아니에요. 질문을 더 해 봐요.`, n); }
      const real = Q4_KNAME[I.kind], extra = real !== n ? ` 그리고 이 사각형은 ${real}${q4J(real, "이", "가")} 맞아요.` : "";
      wrap.append(h("div", { class: "q4fig", style: "max-width:14em" }, q4MiniSvg(secret.p, 200, 140, 24)));
      api.done(`${n} (질문 ${asked.filter(x => x >= 0).length}번)`, `맞아요! 친구가 그린 사각형은 ${n}의 약속에 맞아요.${extra}`);
    } }, n)));
    wrap.append(h("p", { class: "jua", style: "margin:.3em 0 0" }, "이름 맞히기"), nb);
  };
  api.provide({ words: ["평행한 변", "네 변의 길이", "네 각"], answers: ["질문으로 성질을 알아보고 이름을 맞혀요"] });
  body.append(wrap); start();
}

/* =========================================================
   20. 옳은 설명 길 찾기 (11차시 꼭꼭)
   ========================================================= */
function q4Path(body, api, opt) {
  const ans = opt.items.map(() => null), W = 560, H = 420, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const n = opt.items.length, cw = (W - 120) / n, chh = (H - 120) / n, O = [40, 50];
  const draw = () => {
    g.innerHTML = "";
    for (let i = 0; i <= n; i++) for (let j = 0; i + j <= n; j++) { const x = O[0] + i * cw, y = O[1] + j * chh; if (i + j < n) { g.append(q4Ln([x, y], [x + cw, y], { stroke: "#D5E0DB", "stroke-width": 3 }), q4Ln([x, y], [x, y + chh], { stroke: "#D5E0DB", "stroke-width": 3 })); } }
    opt.ends.forEach((nm, d) => { if (!nm) return; const x = O[0] + (n - d) * cw, y = O[1] + d * chh; g.append(svgEl("circle", { cx: x, cy: y, r: 10, fill: "#F28B82" }), txt(x + 12 + nm.length * 8, y - 2, nm, 16)); });
    let x = O[0], y = O[1];
    g.append(txt(x, y - 22, "출발", 16));
    for (let k = 0; k < n; k++) { if (ans[k] == null) break; const nx = ans[k] ? x + cw : x, ny = ans[k] ? y : y + chh; g.append(q4Ln([x, y], [nx, ny], { stroke: TENT, "stroke-width": 6 })); x = nx; y = ny; }
    g.append(svgEl("circle", { cx: x, cy: y, r: 9, fill: TENT }));
    g.append(txt(W - 70, 22, "옳음 → / 틀림 ↓", 15, { fill: Q4_GRAY }));
  };
  const list = h("div");
  opt.items.forEach((it, k) => {
    const row = h("div", { class: "q4stmt" }), bO = h("button", {}, "옳아요"), bX = h("button", {}, "옳지 않아요");
    bO.onclick = () => { ans[k] = true; bO.classList.add("q4on"); bX.classList.remove("q4on"); row.classList.remove("q4good", "q4bad"); draw(); };
    bX.onclick = () => { ans[k] = false; bX.classList.add("q4on"); bO.classList.remove("q4on"); row.classList.remove("q4good", "q4bad"); draw(); };
    row.append(h("span", {}, `${k + 1}. ${it.t}`), bO, bX); list.append(row);
  });
  api.provide({ words: ["옳아요", "옳지 않아요"], answers: [opt.items.map((it, k) => `${k + 1} ${it.a ? "옳음" : "틀림"}`).join(", ") + ` → ${opt.goal}`] });
  const judge = () => {
    api.tryOnce();
    if (ans.some(a => a == null)) return api.fail("아직 고르지 않은 설명이 있어요.", "-");
    const bad = opt.items.findIndex((it, k) => it.a !== ans[k]);
    [...list.children].forEach((r, k) => { r.classList.remove("q4good", "q4bad"); r.classList.add(opt.items[k].a === ans[k] ? "q4good" : "q4bad"); });
    const d = ans.filter(a => !a).length, end = opt.ends[d] || "길이 없는 곳";
    if (bad < 0) return !api.done(`도착: ${end}`, opt.ok);
    api.fail(`${bad + 1}번 설명을 다시 살펴봐요. ${opt.items[bad].why || ""}`, `도착: ${end}`);
  };
  body.append(h("div", { class: "q4row" }, h("div", { style: "flex:1 1 18em;min-width:0" }, list), h("div", { class: "q4fig", style: "flex:1 1 16em;max-width:26em" }, svg)));
  draw();
}

/* =========================================================
   21. 직사각형 종이 두 장 겹치기 (11차시)
   폭이 다른 두 띠를 겹친 각을 바꾸어 가며 겹쳐진 부분을 살펴본다.
   ========================================================= */
function q4Overlap(body, api, opt) {
  const W = 640, H = 420, U = 50, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const h1 = 3, h2 = 2, C = [W / 2, H / 2]; let ang = 55, name = null;
  const S = (x, y) => [C[0] + x * U, C[1] - y * U];
  const draw = () => {
    g.innerHTML = "";
    const L = 7, th = q4Rad(ang), d = [Math.cos(th), Math.sin(th)], nn = [-Math.sin(th), Math.cos(th)];
    g.append(svgEl("polygon", { points: q4Pts([S(-L, -h1 / 2), S(L, -h1 / 2), S(L, h1 / 2), S(-L, h1 / 2)]), fill: "rgba(251,210,91,.6)", stroke: "#B48A2A", "stroke-width": 3 }));
    const r2 = [[-L, -h2 / 2], [L, -h2 / 2], [L, h2 / 2], [-L, h2 / 2]].map(([a, b]) => S(d[0] * a + nn[0] * b, d[1] * a + nn[1] * b));
    g.append(svgEl("polygon", { points: q4Pts(r2), fill: "rgba(142,202,230,.6)", stroke: "#2B7BD6", "stroke-width": 3 }));
    /* 겹친 부분: y = ±h1/2 와 n·p = ±h2/2 */
    const X = (yy, bb) => [(Math.cos(th) * yy - bb) / Math.sin(th), yy];
    const Q = [X(-h1 / 2, -h2 / 2), X(-h1 / 2, h2 / 2), X(h1 / 2, h2 / 2), X(h1 / 2, -h2 / 2)].map(([a, b]) => S(a, b));
    g.append(svgEl("polygon", { points: q4Pts(Q), fill: "rgba(210,70,58,.35)", stroke: Q4_RED, "stroke-width": 4 }));
    angEl.textContent = `겹친 각: ${ang}°`;
    nb.forEach(b => b.classList.toggle("q4on", b.dataset.n === name));
  };
  const angEl = h("span", { class: "jua" });
  const slider = h("input", { type: "range", min: 30, max: 80, step: 5, value: ang, "aria-label": "겹친 각", oninput: e => { ang = +e.target.value; draw(); } });
  const NAMES = ["사다리꼴", "평행사변형", "마름모", "직사각형"];
  const nb = NAMES.map(n => { const b = h("button", { onclick: () => { name = n; draw(); } }, n); b.dataset.n = n; return b; });
  api.provide({ words: ["마주 보는 두 쌍의 변", "평행"], answers: ["평행사변형"] });
  const judge = () => {
    api.tryOnce();
    if (!name) return api.fail("겹쳐진 부분(빨간 부분)의 이름을 골라요.", "-");
    if (name === "평행사변형") return !api.done(name, "겹쳐진 부분은 마주 보는 두 쌍의 변이 서로 평행해서 평행사변형이에요.");
    if (name === "사다리꼴") return !api.done(name, "맞아요. 평행한 변이 있으니 사다리꼴이에요. 그런데 마주 보는 두 쌍의 변이 모두 평행하니까 평행사변형이라고 할 수도 있어요.");
    api.fail(name === "마름모" ? "두 종이의 폭이 달라서 네 변의 길이가 모두 같지는 않아요." : "겹친 각을 바꿔 보면 네 각이 직각이 아니에요.", name);
  };
  body.append(stageWrap(svg, h("div", { class: "side" }, h("div", { class: "q4slider" }, angEl, slider), h("p", { class: "inst", style: "margin:.2em 0" }, "막대를 움직여 두 종이를 겹친 각을 바꿔 봐요. 빨간 부분의 모양은 어떻게 될까요?"), h("p", { class: "jua", style: "margin:.2em 0" }, "겹쳐진 부분의 이름"), h("div", { class: "q4names" }, nb))));
  draw();
}
const Q4_ASK = [
  ["평행한 변이 있나요?", I => I.npar >= 1],
  ["마주 보는 두 쌍의 변이 평행한가요?", I => I.npar === 2],
  ["마주 보는 두 각의 크기가 같나요?", I => I.oppAng],
  ["마주 보는 두 변의 길이가 같나요?", I => I.oppEq],
  ["네 변의 길이가 모두 같나요?", I => I.allEq],
  ["네 각의 크기가 모두 90°인가요?", I => I.allRight]];

/* =========================================================
   22. 눌러서 재는 사각형 그림 — 변을 누르면 길이, 꼭짓점 안쪽을 누르면 각도 (8차시)
   ========================================================= */
function q4MeasFig(p, opt = {}) {
  const W = opt.W || 360, H = opt.H || 260, svg = makeSvg(W, H), m = q4Map(p, [0, 0, W, H, 50], opt.k || 50), P = m.P, I = q4Info(p), C = q4Cen(P);
  q4Dots(svg, m, 6, 6, W - 6, H - 6, 2.2);
  svg.append(q4PolyG(P, { rights: false, fs: 18, names: opt.names }));
  const lay = svgEl("g", { "pointer-events": "none" }), sS = new Set(), sA = new Set();
  const paint = () => {
    lay.innerHTML = "";
    sS.forEach(i => { const A = P[i], B = P[(i + 1) % 4], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = q4Unit(q4Sub(B, A)); let nn = [-d[1], d[0]]; if (q4Dt(nn, q4Sub(M, C)) < 0) nn = [-nn[0], -nn[1]];
      const Q = [M[0] + nn[0] * 20, M[1] + nn[1] * 20]; lay.append(svgEl("rect", { x: q4F(Q[0] - 32), y: q4F(Q[1] - 12), width: 64, height: 24, rx: 7, fill: "#fff", stroke: "#1D4E80", "stroke-width": 1.2 }), txt(Q[0], Q[1], q4Cm(I.L[i]), 15, { fill: "#1D4E80" })); });
    sA.forEach(i => { const { V, u, w, b } = q4Corner(P, i); if (Math.abs(I.A[i] - 90) < 1e-6) lay.append(q4RightMk(V, u, w, 14)); else lay.append(svgEl("path", { d: q4Arc(V, u, w, 20), fill: "none", stroke: TENT, "stroke-width": 2.5 }));
      lay.append(txt(V[0] + b[0] * 42, V[1] + b[1] * 42, q4Deg(I.A[i]), 16, { fill: "#B4530F" })); });
  };
  P.forEach((v, i) => {
    const ln = q4Ln(v, P[(i + 1) % 4], { stroke: "rgba(0,0,0,0)", "stroke-width": 20, style: "cursor:pointer" }); ln.addEventListener("click", () => { sS.has(i) ? sS.delete(i) : sS.add(i); paint(); }); svg.append(ln);
    const { V, b } = q4Corner(P, i), hc = svgEl("circle", { cx: q4F(V[0] + b[0] * 26), cy: q4F(V[1] + b[1] * 26), r: 22, fill: "rgba(0,0,0,0)", style: "cursor:pointer" }); hc.addEventListener("click", () => { sA.has(i) ? sA.delete(i) : sA.add(i); paint(); }); svg.append(hc);
  });
  svg.append(lay); paint();
  return h("div", { class: "q4fig", style: `max-width:${opt.maxW || "20em"}` }, svg);
}
/* 서로 수직인 변이 있는지(다각형) */
function q4HasPerp(p) { const n = p.length, S = p.map((v, i) => q4Sub(p[(i + 1) % n], v)); for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.abs(q4Dt(S[i], S[j])) < 1e-9) return true; return false; }
/* 카드 목록에서 조건에 맞는 번호(정답을 계산하고, 적어 둔 답과 같은지 확인) */
function q4Ans(list, fn, expect) { const a = list.map((p, i) => fn(p) ? i : -1).filter(i => i >= 0); if (expect && a.join() !== expect.join()) throw new Error("카드 정답 오류 " + a + " ≠ " + expect); return a; }

