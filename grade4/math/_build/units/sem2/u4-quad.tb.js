//@@APP
const APP={title:"하율이의 놀이공원 사각형", unit:"4-2 수학 4. 사각형(교과서)", key:"t42-quad-v1", welcome:"하율이의 놀이공원 사각형 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 하율이가 부모님과 놀이공원에 가서 매표소·놀이기구·먹거리 장터·마법의 성·기념품 가게·표지판에서 수직과 평행, 여러 가지 사각형을 찾고, 긋고, 재고, 접고, 만들어 봐요."};
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
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = [...on].map(i => opt.items[i].n).join(", ") || "-";
    const extra = [...on].find(i => !opt.items[i].ok), miss = want.find(i => !on.has(i));
    if (extra == null && miss == null) return api.done(ans, opt.ok);
    api.fail(extra != null ? (opt.items[extra].why || `${opt.items[extra].n}에는 찾는 모양이 없어요.`) : (opt.miss || "아직 찾지 못한 것이 있어요. 그림을 다시 살펴봐요."), ans);
  } }, "확인하기");
  body.append(h("div", { class: "stage" }, svg), out, opt.tip ? h("p", { class: "inst" }, opt.tip) : null, h("div", { class: "actions" }, check));
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
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = [...on].sort().map(i => Q4_KO[i]).join(", ") || "-";
    const extra = [...on].find(i => !want.includes(i)), miss = want.find(i => !on.has(i));
    if (extra == null && miss == null) return api.done(ans, opt.ok);
    api.fail(extra != null ? `${Q4_KO[extra]}의 두 직선은 직각으로 만나지 않아요. 삼각자를 대 보면 한 직선이 삼각자의 변과 맞지 않아요.` : "직각인 곳을 더 찾아봐요. 직선이 기울어져 있어도 만나는 각이 직각이면 돼요.", ans);
  } }, "확인하기");
  body.append(h("div", { class: "stage" }, svg), h("p", { class: "inst" }, "두 직선이 만나는 그림을 누르면 직각 표시(└)를 해요. 다시 누르면 지워져요."), h("div", { class: "tools" }, sqBtn), h("div", { class: "actions" }, check));
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
    last = k; sel = null;
    const [a1, b1] = k.split("-").map(Number), X = cross(a1, b1);
    info.textContent = prot ? (X ? `${nmJ(a1)} ${nm(b1)}${q4J(nm(b1), "이", "가")} 만나서 이루는 각: ${q4Deg(angBetween(a1, b1))}` : `${nmJ(a1)} ${nm(b1)}${q4J(nm(b1), "은", "는")} 아무리 늘여도 만나지 않아요.`) : (at >= 0 ? "짝을 지웠어요." : "짝을 만들었어요. 같은 두 직선을 다시 누르면 짝이 지워져요.");
    draw();
  };
  const tools = h("div", { class: "tools" },
    opt.ext ? h("button", { onclick: e => { ext = !ext; e.currentTarget.classList.toggle("on", ext); draw(); } }, "↔ 직선 늘여 보기") : null,
    opt.prot ? h("button", { onclick: e => { prot = !prot; e.currentTarget.classList.toggle("on", prot); info.textContent = prot ? "두 직선으로 짝을 만들면 만나는 각을 재어 보여 줘요." : ""; draw(); } }, "📐 각 재어 보기") : null,
    h("button", { onclick: () => { pairs.length = 0; sel = null; last = null; info.textContent = ""; draw(); } }, "처음으로"));
  api.provide({ words: opt.mode === "perp" ? ["수직", "직각", "삼각자"] : ["평행", "만나지 않는 두 직선", "늘여 보기"], answers: [want.map(p => { const [i, j] = p.split("-").map(Number); return `${nmJ(i)} ${nm(j)}`; }).join(", ")] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = out.textContent;
    const extra = pairs.find(p => !want.includes(p)), miss = want.find(p => !pairs.includes(p));
    if (extra == null && miss == null) return api.done(ans, opt.ok);
    if (extra != null) { const [i, j] = extra.split("-").map(Number);
      return api.fail(opt.mode === "perp" ? `${nmJ(i)} ${nm(j)}${q4J(nm(j), "이", "가")} 만나서 이루는 각은 ${q4Deg(angBetween(i, j))}예요. 직각이 아니에요.` : `${nmJ(i)} ${nm(j)}${q4J(nm(j), "은", "는")} 늘이면 만나요. ‘직선 늘여 보기’로 확인해 봐요.`, ans); }
    api.fail(opt.miss || (opt.mode === "perp" ? "서로 수직인 짝을 더 찾아봐요. 기울어진 직선도 살펴봐요." : "서로 만나지 않는 짝을 더 찾아봐요. 기울어진 직선끼리도 평행할 수 있어요."), ans);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", { class: "jua", style: "margin:.2em 0" }, opt.ask || ""), h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || "직선을 하나 누르고, 짝이 될 직선을 하나 더 눌러요."), tools, info, out, h("div", { class: "actions" }, check))));
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
    h("button", { onclick: () => { const v = t; if (!drawn.some(x => Math.abs(x - v) < 1e-9)) drawn.push(v); paint(); api.hint(opt.mode === "perp" ? "삼각자의 직각을 낀 다른 한 변을 따라 직선을 그었어요." : "움직인 삼각자의 변을 따라 직선을 그었어요."); } }, "✏️ 변을 따라 선 긋기"),
    h("button", { onclick: () => { drawn.length = 0; paint(); } }, "지우기"));
  api.provide({ words: opt.mode === "perp" ? ["삼각자의 직각", "직각을 낀 한 변", "수선"] : ["삼각자 2개", "고정", "평행선"], answers: [opt.ans || (opt.mode === "perp" ? "수선을 그어요" : "평행선을 그어요")] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (!drawn.length) return api.fail("아직 선을 긋지 않았어요. 삼각자를 옮긴 다음 ‘변을 따라 선 긋기’를 눌러요.", "-");
    if (opt.mode === "perp") {
      if (opt.pt) { if (drawn.some(v => Math.abs(v - opt.pt[0]) < 1e-9)) return api.done("점 ㄱ을 지나는 수선", opt.ok);
        return api.fail("그은 직선이 점 ㄱ을 지나지 않아요. 삼각자를 옆으로 밀어 직각을 낀 다른 한 변이 점 ㄱ을 지나게 해요.", "점 ㄱ을 지나지 않음"); }
      return api.done(`수선 ${drawn.length}개`, opt.ok);
    }
    if (drawn.every(v => Math.abs(v) < 1e-9)) return api.fail("주어진 직선 위에 다시 그었어요. 고정한 삼각자를 따라 움직이는 삼각자를 위로 밀어 올린 다음 그어요.", "같은 직선");
    if (opt.pt) { if (drawn.some(v => Math.abs(v - opt.pt[1]) < 1e-9)) return api.done("점 ㄱ을 지나는 평행선", opt.ok);
      return api.fail("그은 직선이 점 ㄱ을 지나지 않아요. 움직이는 삼각자의 변이 점 ㄱ에 닿을 때까지 밀어요.", "점 ㄱ을 지나지 않음"); }
    if (opt.dist) { if (drawn.some(v => Math.abs(Math.abs(v) - opt.dist) < 1e-9)) return api.done(`거리 ${opt.dist} cm인 평행선`, opt.ok);
      return api.fail(`평행선 사이의 거리가 ${opt.dist} cm가 아니에요. 고정한 삼각자의 눈금을 보고 ${opt.dist} cm만큼 떨어진 곳에서 그어요.`, drawn.map(v => Math.abs(v) + " cm").join(", ")); }
    return api.done(`평행선 ${drawn.length}개`, opt.ok);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", { class: "jua", style: "margin:.2em 0" }, opt.ask || ""), h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || (opt.mode === "perp" ? "파란 삼각자를 끌어 직선을 따라 옮겨요. 직각을 낀 한 변은 늘 주어진 직선에 맞추어져 있어요." : "회색 삼각자는 고정되어 있어요. 파란 삼각자를 끌어 고정한 삼각자를 따라 위아래로 밀어요.")), tools, readout, h("div", { class: "actions" }, check))));
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
    q => { const v = q4Sub([q.x, q.y], st.O); sB = Math.max(-8, Math.min(8, Math.round(q4Dt(v, st.e) / U * 4) / 4)); draw(); });
  const askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  api.provide({ words: ["수직인 선분", "가장 짧은 선분", "평행선 사이의 거리"], answers: [opt.items.map(I => `${I.d} cm`).join(", ")] });
  const check = h("button", { class: "big", onclick: () => {
    const I = it(); api.tryOnce();
    if (Math.abs(sB - I.sA) > 1e-9) return api.fail("아직 가장 짧지 않아요. 선분이 평행선과 수직으로 만나도록 주황 점을 옮겨 봐요.", q4Cm(Math.hypot(sB - I.sA, I.d)));
    res.push(q4Cm(I.d));
    if (k < opt.items.length - 1) { api.hint(`○ 평행선과 수직인 선분의 길이는 ${q4Cm(I.d)}예요. 다음 평행선도 해 봐요.`); k++; sB = opt.items[k].sB0 || 0; draw(); return; }
    api.done(res.join(", "), opt.ok);
  } }, "확인하기");
  sB = opt.items[0].sB0 || 0;
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, h("p", { class: "inst", style: "margin:.2em 0" }, "선분의 길이를 보면서 점을 옮겨 봐요. 선분이 평행선과 수직이 되면 초록색이 돼요."), h("div", { class: "actions" }, check))));
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
  const put = (i, b) => { where[i] = b; cards[i].classList.remove("q4good", "q4bad"); };
  const paint = () => cards.forEach((c, i) => { c.classList.toggle("q4sel", sel === i); (where[i] < 0 ? pool : bins[where[i]]).append(c); });
  const ansOf = arr => opt.cats.map((cn, b) => `${cn}: ${opt.items.map((_, i) => arr[i] === b ? lab(i) : null).filter(Boolean).join(", ") || "없음"}`).join(" / ");
  api.provide({ words: opt.cats, answers: [ansOf(want)] });
  const check = h("button", { class: "big", onclick: () => {
    if (where.some(w => w < 0)) return api.hint("아직 넣지 않은 카드가 있어요. 모든 카드를 넣어요.");
    api.tryOnce(); const ans = ansOf(where);
    const bad = opt.items.map((_, i) => where[i] !== want[i] ? i : -1).filter(i => i >= 0);
    cards.forEach((c, i) => { c.classList.remove("q4good", "q4bad"); c.classList.add(bad.includes(i) ? "q4bad" : "q4good"); });
    if (!bad.length) return api.done(ans, opt.ok);
    const b0 = opt.items[bad[0]];
    api.fail(b0.why || (opt.whyOf ? opt.whyOf(b0, lab(bad[0])) : `${lab(bad[0])}${q4J(lab(bad[0]), "을", "를")} 다시 살펴봐요.`), ans);
  } }, "확인하기");
  const wrap = h("div", {}, h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || "카드를 끌어 알맞은 칸에 넣어요. 카드를 누른 다음 칸을 눌러도 돼요."), pool, binWrap, h("div", { class: "actions" }, check));
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
    if (!start && V.length < 4) { const { best, bd } = nearest(q); if (bd < u * .45 && !V.some(v => v[0] === best[0] && v[1] === best[1])) { V.push(best); draw(); } }
    return false;
  }, q => {
    if (di < 0) return; const { best } = nearest(q);
    if (best && !V.some((v, j) => j !== di && v[0] === best[0] && v[1] === best[1])) {
      if (start) V = start.map((s0, j) => j === di ? best.slice() : s0.slice()); else V[di] = best.slice();
      moved = true; draw();
    }
  }, () => { di = -1; });
  const askEl = h("p", { class: "jua", style: "margin:.2em 0" }), tipEl = h("p", { class: "inst", style: "margin:.2em 0" });
  const tools = h("div", { class: "tools" },
    h("button", { onclick: e => { showR = !showR; e.currentTarget.classList.toggle("on", showR); draw(); } }, "📏 변의 길이 보기"),
    h("button", { onclick: () => { if (!start && V.length > fixedN) { V.pop(); draw(); } } }, "한 점 지우기"),
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
  const check = h("button", { class: "big", onclick: () => {
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
    api.done(made.map(m => m.desc).join(" / "), opt.ok || it.ok);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, tipEl, tools, h("div", { class: "actions" }, check))));
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
    P.forEach((v, i) => { const ln = q4Ln(v, P[(i + 1) % n], { stroke: "rgba(0,0,0,0)", "stroke-width": 26, style: "cursor:pointer" }); ln.addEventListener("click", () => { if (on.has(i)) on.delete(i); else { if (on.size >= 2) on.clear(); on.add(i); } draw(); }); g.append(ln); });
    out.textContent = on.size ? "고른 변: " + [...on].map(sideName).join(", ") : "고른 변이 없어요.";
  };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const ansTxt = `${sideName(opt.want[0])}${q4J(sideName(opt.want[0]), "과", "와")} ${sideName(opt.want[1])}`;
  api.provide({ words: ["평행한 두 변", "만나지 않는 두 변"], answers: [ansTxt] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = out.textContent;
    if (on.size < 2) return api.fail("변을 두 개 골라요.", ans);
    const ok = opt.want.every(i => on.has(i));
    if (ok) return api.done(ansTxt, opt.ok);
    api.fail(opt.bad || "고른 두 변은 늘이면 만나요. 늘여도 만나지 않는 두 변을 찾아봐요. 점 종이의 칸을 세어 기울기를 비교해 봐요.", ans);
  } }, "확인하기");
  body.append(h("p", { class: "jua", style: "margin:.2em 0" }, opt.ask || ""), h("div", { class: "q4fig", style: "max-width:28em" }, svg), h("p", { class: "inst", style: "margin:.2em 0" }, "변을 눌러 두 개를 골라요."), out, h("div", { class: "actions" }, check));
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
  const b2 = h("button", { onclick: () => { if (blues.some(s => Math.abs(s - pos) < 1.5)) return api.hint("앞에서 접은 곳과 너무 가까워요. 조금 떨어진 곳에서 접어요."); blues.push(pos); pos = 4; draw(); if (blues.length === 2) api.hint("두 파란 선이 생겼어요. 아래 ‘확인하기’를 눌러요."); } }, "빨간 선에 맞추어 접기");
  api.provide({ words: ["빨간 선", "수직", "평행"], answers: ["파란 선 두 개를 접었어요"] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (blues.length < 2) return api.fail("아직 파란 선을 두 개 다 접지 않았어요.", `파란 선 ${blues.length}개`);
    api.done("빨간 선에 수직인 파란 선 2개", opt.ok || "두 파란 선은 모두 빨간 선에 수직이에요.");
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, stepEl, h("div", { class: "tools" }, b1, b2), h("div", { class: "actions" }, check))));
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
    draw();
  };
  const stEl = h("p", { class: "jua", style: "margin:.2em 0" });
  api.provide({ words: ["겹쳐요", "180° 돌리기", "마주 보는 두 변", "마주 보는 두 각"], answers: ["두 조각이 완전히 겹쳐요"] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (!snapped) return api.fail("아직 두 조각이 겹쳐지지 않았어요. ‘180° 돌리기’를 누른 다음 끌어서 겹쳐 봐요.", "겹치지 않음");
    api.done("완전히 겹쳐요", opt.ok);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, stEl, h("div", { class: "tools" }, h("button", { onclick: () => { rot = rot ? 0 : 180; const c = q4Cen(T2.map(tr)); snapped = false; tryS(); } }, "↻ 180° 돌리기"), h("button", { onclick: () => { rot = 0; off = [W * .42, 0]; snapped = false; draw(); } }, "처음으로")), h("div", { class: "actions" }, check))));
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
  const pick = []; let seenAdj = false, seenOpp = false;
  const R = 46;
  const draw = () => {
    g.innerHTML = "";
    g.append(svgEl("polygon", { points: q4Pts(P), fill: "#FFFDF6", stroke: INK, "stroke-width": 4 }));
    P.forEach((v, i) => {
      const { V, u, w } = q4Corner(P, i), wd = svgEl("path", { d: q4Arc(V, u, w, R, true), fill: cols[i], stroke: pick.includes(i) ? INK : "none", "stroke-width": 3, style: "cursor:pointer" });
      wd.addEventListener("click", () => { if (pick.length >= 2) pick.length = 0; if (!pick.includes(i)) pick.push(i); draw(); });
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
      if (adj && sum === 180) { g.append(q4Ln([X[0] - 150, X[1]], [X[0] + 150, X[1]], { stroke: Q4_RED, "stroke-width": 3, "stroke-dasharray": "8 6" })); seenAdj = true; }
      if (!adj) seenOpp = true;
      out.textContent = adj ? `이웃하는 두 각 ${Q4_V[i]}, ${Q4_V[j]}: ${q4Deg(I.A[i])} + ${q4Deg(I.A[j])} = ${sum}° ${sum === 180 ? "— 일직선이 돼요!" : ""}` : `마주 보는 두 각 ${Q4_V[i]}, ${Q4_V[j]}: ${q4Deg(I.A[i])}, ${q4Deg(I.A[j])}`;
    } else out.textContent = pick.length ? `각 ${Q4_V[pick[0]]}을 골랐어요. 붙일 각을 하나 더 눌러요.` : "색칠한 각을 두 개 눌러요.";
  };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  api.provide({ words: ["이웃하는 두 각", "180°", "일직선"], answers: ["이웃하는 두 각의 크기의 합은 180°"] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (!seenAdj) return api.fail("나란히 붙어 있는(이웃하는) 두 각을 골라 이어 붙여 봐요.", out.textContent);
    api.done("이웃하는 두 각을 붙이면 일직선(180°)", opt.ok);
  } }, "확인하기");
  body.append(h("div", { class: "stage" }, svg), h("p", { class: "inst", style: "margin:.2em 0" }, "평행사변형의 색칠한 각을 두 개 누르면 오른쪽에 두 각을 나란히 붙여 보여 줘요. 여러 짝을 붙여 봐요."), out, h("div", { class: "actions" }, check));
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
          hit.addEventListener("click", () => { meas.has(nm) ? meas.delete(nm) : meas.add(nm); draw(); }); g.append(hit);
          if (meas.has(nm)) { const M = [(C[0] + P[0]) / 2, (C[1] + P[1]) / 2], L = (nm === "ㄱ" || nm === "ㄷ") ? a : b, t = q4Cm(L), d = q4Unit(q4Sub(P, C)), nn = [-d[1] * 26, d[0] * 26];
            g.append(svgEl("rect", { x: q4F(M[0] + nn[0] * 1.6 - 50), y: q4F(M[1] + nn[1] * 1.6 - 14), width: 100, height: 28, rx: 7, fill: "#fff", stroke: "#1D4E80", "stroke-width": 1.2 }), txt(M[0] + nn[0] * 1.6, M[1] + nn[1] * 1.6, t, 17, { fill: "#1D4E80" })); } });
        const hc = svgEl("circle", { cx: C[0], cy: C[1], r: 18, fill: "rgba(0,0,0,0)", style: "cursor:pointer" }); hc.addEventListener("click", () => { meas.has("ang") ? meas.delete("ang") : meas.add("ang"); draw(); }); g.append(hc);
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
    stEl.textContent = ["① ‘ㄱㄷ을 따라 반으로 접기’를 눌러요.", f >= 1 ? "ㄹ이 ㄴ에 꼭 겹쳐요. 각 ㄴ과 각 ㄹ의 크기가 같아요. ② 한 번 더 접어요." : "접는 중…", f >= 1 ? "ㄱ이 ㄷ에 꼭 겹쳐요. 이제 펼쳐 봐요." : "접는 중…", "펼쳤어요. 선분 ㅁㄱ, ㅁㄴ, ㅁㄷ, ㅁㄹ을 눌러 길이를 재고, 점 ㅁ을 눌러 두 선분이 만나는 각을 재어 봐요."][stage];
    bA.disabled = stage !== 0; bB.disabled = !(stage === 1 && f >= 1); bC.disabled = !(stage === 2 && f >= 1);
  };
  const go = st => { stage = st; f = 0; const t0 = performance.now(); if (anim) cancelAnimationFrame(anim); const step = now => { f = Math.min(1, (now - t0) / 800); draw(); if (f < 1) anim = requestAnimationFrame(step); }; anim = requestAnimationFrame(step); draw(); };
  const stEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const bA = h("button", { onclick: () => go(1) }, "① ㄱㄷ을 따라 반으로 접기");
  const bB = h("button", { onclick: () => go(2) }, "② ㄴㄹ을 따라 한 번 더 접기");
  const bC = h("button", { onclick: () => { stage = 3; draw(); } }, "③ 펼치기");
  api.provide({ words: ["마주 보는 두 각", "선분 ㅁㄱ = 선분 ㅁㄷ", "90°"], answers: ["접고 펼쳐서 재어 보았어요"] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (stage < 3) return api.fail("순서대로 두 번 접은 다음 펼쳐 봐요.", "접는 중");
    if (!["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ang"].every(x => meas.has(x))) return api.fail("펼친 종이에서 네 선분의 길이와 점 ㅁ의 각을 모두 재어 봐요.", `${meas.size}곳 잼`);
    api.done(`ㅁㄱ=ㅁㄷ=${q4Cm(a)}, ㅁㄴ=ㅁㄹ=${q4Cm(b)}, 90°`, opt.ok);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, stEl, h("div", { class: "tools" }, bA, bB, bC, h("button", { onclick: () => { if (anim) cancelAnimationFrame(anim); stage = 0; f = 0; meas.clear(); draw(); } }, "처음으로")), h("div", { class: "actions" }, check))));
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
    opt.shapes.forEach((_, ci) => { const c = h("button", { class: "q4cell", "aria-label": `${r[0]} ${labs[ci]}`, onclick: () => { st[ri][ci] = !st[ri][ci]; c.textContent = st[ri][ci] ? "◯" : "​"; c.classList.remove("q4good", "q4bad"); } }, "​"); cells.push({ c, ri, ci }); tbl.append(c); });
  });
  api.provide({ words: ["평행", "마주 보는", "네 변", "네 각"], answers: rows.map((r, ri) => `${r[0]} ${labs.filter((_, ci) => want[ri][ci]).join(", ")}`) });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); let bad = null;
    cells.forEach(({ c, ri, ci }) => { const ok = st[ri][ci] === want[ri][ci]; c.classList.remove("q4good", "q4bad"); if (st[ri][ci] || !ok) c.classList.add(ok ? "q4good" : "q4bad"); if (!ok && !bad) bad = { ri, ci }; });
    const ans = rows.map((r, ri) => labs.filter((_, ci) => st[ri][ci]).join("") || "-").join(" / ");
    if (!bad) return api.done(ans, opt.ok);
    api.fail(`‘${rows[bad.ri][0]}’ 줄의 ${labs[bad.ci]}${q4J(labs[bad.ci], "을", "를")} 다시 살펴봐요. ${want[bad.ri][bad.ci] ? "이 사각형도 그 설명에 맞아요." : "이 사각형은 그 설명에 맞지 않아요."}`, ans);
  } }, "확인하기");
  body.append(h("p", { class: "inst", style: "margin:.2em 0" }, "칸을 누르면 ◯가 생기고, 다시 누르면 지워져요. 점 종이의 칸을 세어 평행·길이·직각을 살펴봐요."), tbl, h("div", { class: "actions" }, check));
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
  const sb = STR.map((L, i) => { const b = h("button", { class: "q4strip", style: `width:${L * 2.2}em;background:${L === 5 ? "#FBD25B" : "#A9D6F2"}`, onclick: () => { const k = order.indexOf(i); if (k >= 0) order.splice(k, 1); else if (order.length < 4) order.push(i); draw(); } }, `${L} cm`); return b; });
  const seq = h("div", { class: "jua" }), angEl = h("span", { class: "jua" }), madeEl = h("div", { class: "inst" });
  const slider = h("input", { type: "range", min: 30, max: 150, step: 5, value: ang, "aria-label": "각 ㄱ", oninput: e => { ang = +e.target.value; draw(); } });
  const NAMES = ["사다리꼴", "평행사변형", "마름모", "직사각형", "정사각형", "평행한 변이 없는 사각형"];
  const nb = NAMES.map(n => { const b = h("button", { onclick: () => { name = n; draw(); } }, n); b.dataset.n = n; return b; });
  api.provide({ words: ["네 변의 길이가 모두 같아요", "마주 보는 두 쌍의 변이 평행해요", "네 각이 모두 직각이에요"], answers: ["긴 띠 4개 → 마름모, 긴 띠 2개와 짧은 띠 2개를 마주 보게 → 평행사변형"] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const B = build();
    if (!B) return api.fail(order.length < 4 ? "띠를 4개 골라요." : "띠가 이어지지 않아요. 각 ㄱ을 바꾸거나 띠의 차례를 바꿔 봐요.", "-");
    if (fuzzy(B.I)) return api.fail("거의 평행하거나 거의 직각인 곳이 있어서 헷갈려요. 각 ㄱ을 조금 바꿔 봐요.", "-");
    if (!name) return api.fail("만든 사각형의 이름을 골라요.", "-");
    if (!Q4_DEF[name](B.I)) return api.fail(`이 사각형은 ${name}${q4J(name, "이", "가")} 아니에요. ${name === "평행한 변이 없는 사각형" ? "평행한 변이 있어요." : "약속을 떠올려 다시 살펴봐요."}`, name);
    if (made.includes(name)) return api.fail("앞에서 만든 사각형과 이름이 같아요. 띠나 각을 바꾸어 다른 사각형을 만들어 봐요.", name);
    made.push(name); name = null;
    if (made.length < need) { api.hint(`○ ${made[made.length - 1]}${q4J(made[made.length - 1], "을", "를")} 만들었어요! 다른 사각형도 만들어 봐요.`); draw(); return; }
    draw(); api.done(made.join(", "), opt.ok || "종이띠로 여러 가지 사각형을 만들었어요. 띠의 길이와 각에 따라 이름이 달라져요.");
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, seq, h("div", { class: "q4strips" }, sb), h("div", { class: "q4slider" }, angEl, slider), h("p", { class: "jua", style: "margin:.2em 0" }, "만든 사각형의 이름"), h("div", { class: "q4names" }, nb), madeEl, h("div", { class: "actions" }, check))));
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
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = out.textContent;
    const extra = [...on].find(i => !opt.tags[i].need), miss = want.find(i => !on.has(i));
    if (extra == null && miss == null) return api.done(want.map(i => opt.tags[i].t).join(" + "), opt.ok);
    api.fail(extra != null ? (opt.tags[extra].why || `${opt.tags[extra].t}는 필요하지 않아요.`) : "아직 고르지 않은 길이가 있어요. 바닥에서 바닥까지 수직인 길이를 모두 골라요.", ans);
  } }, "확인하기");
  body.append(h("p", { class: "jua", style: "margin:.2em 0" }, opt.ask || ""), h("div", { class: "q4fig", style: "max-width:36em" }, svg), h("p", { class: "inst", style: "margin:.2em 0" }, "길이 표시를 누르면 골라져요. 다시 누르면 취소돼요."), out, h("div", { class: "actions" }, check));
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
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (ans.some(a => a == null)) return api.fail("아직 고르지 않은 설명이 있어요.", "-");
    const bad = opt.items.findIndex((it, k) => it.a !== ans[k]);
    [...list.children].forEach((r, k) => { r.classList.remove("q4good", "q4bad"); r.classList.add(opt.items[k].a === ans[k] ? "q4good" : "q4bad"); });
    const d = ans.filter(a => !a).length, end = opt.ends[d] || "길이 없는 곳";
    if (bad < 0) return api.done(`도착: ${end}`, opt.ok);
    api.fail(`${bad + 1}번 설명을 다시 살펴봐요. ${opt.items[bad].why || ""}`, `도착: ${end}`);
  } }, "확인하기");
  body.append(h("div", { class: "q4row" }, h("div", { style: "flex:1 1 18em;min-width:0" }, list), h("div", { class: "q4fig", style: "flex:1 1 16em;max-width:26em" }, svg)), h("div", { class: "actions" }, check));
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
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (!name) return api.fail("겹쳐진 부분(빨간 부분)의 이름을 골라요.", "-");
    if (name === "평행사변형") return api.done(name, "겹쳐진 부분은 마주 보는 두 쌍의 변이 서로 평행해서 평행사변형이에요.");
    if (name === "사다리꼴") return api.done(name, "맞아요. 평행한 변이 있으니 사다리꼴이에요. 그런데 마주 보는 두 쌍의 변이 모두 평행하니까 평행사변형이라고 할 수도 있어요.");
    api.fail(name === "마름모" ? "두 종이의 폭이 달라서 네 변의 길이가 모두 같지는 않아요." : "겹친 각을 바꿔 보면 네 각이 직각이 아니에요.", name);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, h("div", { class: "q4slider" }, angEl, slider), h("p", { class: "inst", style: "margin:.2em 0" }, "막대를 움직여 두 종이를 겹친 각을 바꿔 봐요. 빨간 부분의 모양은 어떻게 될까요?"), h("p", { class: "jua", style: "margin:.2em 0" }, "겹쳐진 부분의 이름"), h("div", { class: "q4names" }, nb), h("div", { class: "actions" }, check))));
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

//@@LESSONS
const UNIT_STORY = { title: "하율이네 놀이공원 나들이", lines: [
  "하율이는 손꼽아 기다리던 날, 부모님과 놀이공원에 놀러 갔어요. “어머니, 저기 보세요. 매표소에 직각이 보여요.” “마치 도형들이 하율이랑 숨바꼭질을 하는 것 같구나!”",
  "하율이는 매표소, 놀이기구, 먹거리 장터, 마법의 성, 배 모양 놀이기구, 기념품 가게, 표지판에서 수직과 평행, 여러 가지 사각형을 찾아요.",
  "교과서 「수학 4-2」 4. 사각형의 차시 순서 그대로 만들었어요."],
  one: "사각형 · 놀이공원에서 수직·평행을 찾고 사다리꼴·평행사변형·마름모를 알아봐요." };
const UNIT_KEYWORDS = ["직각", "수직", "수선", "평행", "평행선", "평행선 사이의 거리", "삼각자", "사다리꼴", "평행사변형", "마름모", "직사각형", "정사각형", "마주 보는 두 변", "마주 보는 두 각", "이웃하는 두 각"];

/* ---------- 그림에 쓰는 사각형(점 종이 정수 좌표, 1칸 = 1 cm, 모두 이름을 확인함) ---------- */
const Q4S = {
  t1: q4K([[0, 3], [1, 0], [4, 0], [6, 3]], "trap"), t2: q4K([[0, 3], [2, 0], [4, 0], [5, 3]], "trap"), t3: q4K([[0, 0], [3, 0], [3, 4], [0, 2]], "trap"),
  t4: q4K([[0, 2], [4, 0], [5, 2], [3, 3]], "trap"), t6: q4K([[0, 0], [4, 2], [4, 4], [0, 4]], "trap"), t7: q4K([[0, 2], [1, 0], [4, 0], [6, 2]], "trap"),
  p1: q4K([[0, 0], [4, 1], [5, 3], [1, 2]], "para"), p2: q4K([[0, 3], [3, 0], [6, 0], [3, 3]], "para"), p3: q4K([[0, 0], [5, 0], [4, 3], [-1, 3]], "para"),
  p4: q4K([[0, 0], [4, 0], [5, 3], [1, 3]], "para"), p5: q4K([[0, 3], [2, 0], [6, 0], [4, 3]], "para"), p6: q4K([[0, 0], [4, 0], [5, 2], [1, 2]], "para"),
  r1: q4K([[0, 0], [2, 1], [3, 3], [1, 2]], "rhom"), r2: q4K([[0, 2], [3, 0], [6, 2], [3, 4]], "rhom"), r3: q4K([[0, 2], [4, 0], [8, 2], [4, 4]], "rhom"),
  c1: q4K([[0, 0], [4, 0], [4, 2], [0, 2]], "rect"), c2: q4K([[0, 1], [2, 0], [4, 4], [2, 5]], "rect"), c3: q4K([[0, 0], [5, 0], [5, 3], [0, 3]], "rect"),
  s1: q4K([[0, 0], [3, 0], [3, 3], [0, 3]], "sq"), s2: q4K([[0, 1], [3, 0], [4, 3], [1, 4]], "sq"),
  n1: q4K([[0, 1], [3, 0], [5, 3], [1, 3]], "none"), n2: q4K([[2, 0], [4, 2], [2, 5], [0, 2]], "none"), n3: q4K([[0, 0], [4, 1], [3, 4], [0, 3]], "none"),
  n4: q4K([[1, 0], [5, 2], [4, 4], [0, 3]], "none"), n5: q4K([[0, 0], [4, 1], [5, 4], [0, 3]], "none"), n6: q4K([[2, 0], [4, 1], [2, 4], [0, 1]], "none")
};
const q4L = keys => keys.map(k => Q4S[k]);
/* 5차시 */
const Q4_C5A = q4L(["t2", "p1", "c1", "n1", "t3", "n2"]);
const Q4_C5B = q4L(["t7", "t4", "n3", "n4", "p4"]);
const Q4_C5E = q4L(["n3", "t1", "p4", "c1", "n4", "t3"]);
/* 6차시 */
const Q4_C6A = q4L(["p2", "c2", "t1", "r2", "t6", "p3"]);
/* 7차시 */
const Q4_C7A = q4L(["r1", "p6", "c1", "s2", "n6", "r3"]);
const Q4_C7E = q4L(["p1", "c3", "r2", "t2", "s2", "n6"]);
/* 8차시: 가 직사각형, 나 사다리꼴, 다 마름모, 라 정사각형, 마 평행사변형 */
const Q4_C8 = [Q4S.c3, q4K([[0, 3], [1, 0], [4, 0], [6, 3]], "trap"), Q4S.r2, Q4S.s1, Q4S.p5];
const Q4_C8E = q4L(["p5", "s1", "t6", "r1", "c2", "n1"]);
/* 8차시 도전: 직사각형 띠(높이 3)를 잘라 생긴 조각 가~바 */
const Q4_CUT = [[0, 0], [4, 4], [6, 5], [8, 7], [10, 10], [13, 13], [15, 15]];   /* [위 x, 아래 x] */
const Q4_PIECES = Q4_CUT.slice(0, -1).map((c, i) => { const d = Q4_CUT[i + 1]; return [[c[0], 0], [d[0], 0], [d[1], 3], [c[1], 3]]; });
if (Q4_PIECES.map(p => q4Info(p).kind).join() !== "rect,trap,para,trap,sq,rect") throw new Error("띠 조각 오류 " + Q4_PIECES.map(p => q4Info(p).kind));
/* 2차시 확인: 서로 수직인 변이 있는 도형 가~라 */
const Q4_PERP4 = [[[0, 0], [3, 0], [3, 3], [0, 2]], Q4S.p4, [[0, 3], [4, 3], [1, 0]], [[0, 2], [2, 0], [4, 2]]];
q4Ans(Q4_PERP4, q4HasPerp, [0, 3]);
/* 5차시 도전: 점 ㄱ을 옮길 곳 ㄴ·ㄷ·ㄹ·ㅁ */
const Q4_MV = { fix: [[1, 4], [5, 4], [4, 1]], g: [1, 0], cand: [[0, 0], [2, 0], [1, 1], [0, 3]] };
if (Q4_MV.cand.map(c => q4Info([c, ...Q4_MV.fix]).kind).map(k => k === "trap").join() !== "false,false,true,false") throw new Error("점 옮기기 오류");
/* 11차시 */
const Q4_S11 = [[1, 1], [2, 5], [7, 5], [6, 2]];
if (q4Info(Q4_S11).kind !== "none") throw new Error("11차시 도형 오류");
/* 10차시 놀이 카드: 도형 카드 6가지, 설명 카드 6가지 */
const Q4_GSH = [{ n: "사다리꼴", p: Q4S.t1 }, { n: "평행사변형", p: Q4S.p4 }, { n: "마름모", p: Q4S.r2 }, { n: "직사각형", p: Q4S.c3 }, { n: "정사각형", p: Q4S.s1 }, { n: "사각형", p: Q4S.n1 }];
const Q4_GDESC = [
  ["평행한 변이 없는 사각형", I => I.npar === 0], ["평행한 변이 있는 사각형", I => I.npar >= 1], ["마주 보는 두 쌍의 변이 평행한 사각형", I => I.npar === 2],
  ["마주 보는 두 변의 길이가 같은 사각형", I => I.oppEq], ["네 변의 길이가 모두 같은 사각형", I => I.allEq], ["네 각의 크기가 모두 90°인 사각형", I => I.allRight]];

/* ---------- 1차시 그림 ---------- */
const Q4_PARK = {
  W: 900, H: 460,
  deco: s => { s.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 460, fill: "#EAF5FB" }), svgEl("rect", { x: 0, y: 390, width: 900, height: 70, fill: "#CFE6B8" })); },
  items: [
    { n: "매표소", box: [30, 170, 230, 220], ok: true, draw: g => g.append(svgEl("rect", { x: 40, y: 200, width: 210, height: 190, fill: "#F6C28B", stroke: "#B4610F", "stroke-width": 5 }), svgEl("polygon", { points: "30,205 145,170 260,205", fill: "#D2463A" }), svgEl("rect", { x: 70, y: 240, width: 70, height: 55, fill: "#DDEFFC", stroke: "#5A4A3F", "stroke-width": 4 }), svgEl("rect", { x: 165, y: 260, width: 55, height: 130, fill: "#7A4A1E" }), txt(105, 320, "매표소", 18)) },
    { n: "정사각형 표지판", box: [290, 120, 110, 270], ok: true, draw: g => g.append(svgEl("rect", { x: 340, y: 210, width: 10, height: 180, fill: "#8795A1" }), svgEl("rect", { x: 300, y: 130, width: 90, height: 90, fill: "#2B7BD6", stroke: "#1D4E80", "stroke-width": 4 }), txt(345, 175, "출구 →", 18, { fill: "#fff" })) },
    { n: "대관람차", box: [430, 30, 240, 360], why: "대관람차의 큰 바퀴는 동그란 모양이에요. 곧은 선 4개로 둘러싸인 모양을 찾아요.", draw: g => { g.append(svgEl("circle", { cx: 550, cy: 160, r: 120, fill: "none", stroke: "#7C4DBA", "stroke-width": 6 }), q4Ln([550, 160], [490, 390], { stroke: "#5A4A3F", "stroke-width": 6 }), q4Ln([550, 160], [610, 390], { stroke: "#5A4A3F", "stroke-width": 6 }));
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.append(q4Ln([550, 160], [550 + 120 * Math.cos(a), 160 + 120 * Math.sin(a)], { stroke: "#B9A5DA", "stroke-width": 2 }), svgEl("circle", { cx: q4F(550 + 120 * Math.cos(a)), cy: q4F(160 + 120 * Math.sin(a)), r: 14, fill: ["#F28B82", "#FBD25B", "#8ECAE6", "#A7D7A0"][k % 4] })); } } },
    { n: "풍선", box: [700, 40, 100, 160], why: "풍선은 둥근 모양이에요.", draw: g => { [[730, 90, "#F28B82"], [770, 80, "#FBD25B"], [750, 125, "#8ECAE6"]].forEach(([x, y, c]) => g.append(q4Ln([x, y + 30], [755, 195], { stroke: "#5A4A3F", "stroke-width": 1.5 }), svgEl("ellipse", { cx: x, cy: y, rx: 24, ry: 30, fill: c }))); } },
    { n: "삼각형 깃발", box: [810, 170, 80, 150], why: "깃발은 곧은 선 3개로 둘러싸인 삼각형이에요.", draw: g => g.append(q4Ln([825, 180], [825, 315], { stroke: "#5A4A3F", "stroke-width": 4 }), svgEl("polygon", { points: "828,182 885,205 828,228", fill: "#E47A38" })) },
    { n: "기념품 상자", box: [690, 300, 120, 90], ok: true, draw: g => g.append(svgEl("rect", { x: 700, y: 315, width: 100, height: 70, fill: "#A7D7A0", stroke: "#24965A", "stroke-width": 4 }), q4Ln([750, 315], [750, 385], { stroke: "#D2463A", "stroke-width": 5, "stroke-linecap": "butt" }), q4Ln([700, 350], [800, 350], { stroke: "#D2463A", "stroke-width": 5, "stroke-linecap": "butt" })) }] };
const q4Goat = () => q4Fig(420, 220, s => {
  s.append(svgEl("rect", { x: 0, y: 0, width: 420, height: 220, fill: "#F6F1E7" }));
  s.append(svgEl("ellipse", { cx: 210, cy: 110, rx: 150, ry: 80, fill: "#E8D9A8", stroke: "#8A6A3A", "stroke-width": 5 }));
  s.append(svgEl("ellipse", { cx: 210, cy: 110, rx: 95, ry: 62, fill: "#E0B04A", stroke: "#7A5A1E", "stroke-width": 3 }));
  s.append(svgEl("rect", { x: 140, y: 92, width: 140, height: 36, rx: 6, fill: "#1D2A2A" }));
  s.append(svgEl("circle", { cx: 250, cy: 85, r: 9, fill: "#fff" }));
  s.append(txt(210, 205, "염소의 눈", 18, { fill: "#5A4A3F" }));
}, "20em");
/* 각 그림 여러 개 (1차시) */
function q4AngleCards(list) {
  return q4Fig(list.length * 170 + 10, 170, s => list.forEach(([a0, A], i) => {
    const x = 10 + i * 170, V = [x + 62, 105];
    s.append(svgEl("rect", { x, y: 5, width: 160, height: 160, rx: 12, fill: "#fff", stroke: Q4_LINE, "stroke-width": 2 }), txt(x + 16, 22, Q4_KO[i], 18));
    const u = [Math.cos(q4Rad(a0)), -Math.sin(q4Rad(a0))], w = [Math.cos(q4Rad(a0 + A)), -Math.sin(q4Rad(a0 + A))];
    s.append(q4Ln(V, [V[0] + u[0] * 80, V[1] + u[1] * 80]), q4Ln(V, [V[0] + w[0] * 80, V[1] + w[1] * 80]));
  }), "34em");
}
/* 직선 그림(정적) */
function q4LinesFig(lines, W = 520, H = 280, maxW = "28em") {
  return q4Fig(W, H, s => lines.forEach(L => { const d = [Math.cos(q4Rad(L.a)), -Math.sin(q4Rad(L.a))], A = [L.c[0] - d[0] * L.len, L.c[1] - d[1] * L.len], B = [L.c[0] + d[0] * L.len, L.c[1] + d[1] * L.len];
    s.append(q4Ln(A, B, { stroke: L.col || INK })); s.append(txt(B[0] + d[0] * 16, B[1] + d[1] * 16, L.n, 20)); }), maxW);
}
/* 삼각자로 수선을 그은 두 그림 (2차시 도전) */
const q4SqDraw = () => q4Fig(620, 230, s => {
  [[0, false], [1, true]].forEach(([i, ok]) => {
    const x = 10 + i * 305; s.append(svgEl("rect", { x, y: 5, width: 295, height: 220, rx: 12, fill: "#fff", stroke: Q4_LINE, "stroke-width": 2 }), txt(x + 18, 22, ["㉠", "㉡"][i], 20));
    s.append(q4Ln([x + 15, 180], [x + 280, 180]));
    if (ok) { s.append(svgEl("polygon", { points: `${x + 120},180 ${x + 230},180 ${x + 120},90`, fill: "rgba(170,210,245,.55)", stroke: "#1D4E80", "stroke-width": 2 }), q4Ln([x + 120, 215], [x + 120, 40], { stroke: Q4_SKY, "stroke-width": 4 }), q4RightMk([x + 120, 180], [1, 0], [0, -1], 12, { stroke: "#1D4E80", "stroke-width": 2 })); }
    else { /* 빗변을 직선에 대고 다른 변을 따라 그음 */ s.append(svgEl("polygon", { points: `${x + 90},180 ${x + 230},180 ${x + 160},110`, fill: "rgba(170,210,245,.55)", stroke: "#1D4E80", "stroke-width": 2 }), q4Ln([x + 60, 210], [x + 200, 70], { stroke: Q4_SKY, "stroke-width": 4 })); }
  });
}, "32em");
/* 사각형 그림에 글 붙이기(□ 문제) */
const q4Labeled = (p, o, maxW = "20em", W = 380, H = 250) => q4Fig(W, H, s => { const m = q4Map(p, [0, 0, W, H, 60], 70); s.append(q4PolyG(m.P, Object.assign({ fs: 19 }, o))); }, maxW);
/* 마름모와 마주 보는 꼭짓점끼리 이은 선분 (7차시 □ 문제) */
const q4RhDiag = (a, b, labs, maxW = "18em") => q4Fig(320, 280, s => {
  const C = [160, 140], k = 22, P = [[C[0], C[1] - a * k], [C[0] - b * k, C[1]], [C[0], C[1] + a * k], [C[0] + b * k, C[1]]];
  s.append(q4PolyG(P, { fs: 18, names: true, rights: false }));
  s.append(q4Ln(P[0], P[2], { stroke: Q4_SKY, "stroke-width": 3 }), q4Ln(P[1], P[3], { stroke: Q4_SKY, "stroke-width": 3 }));
  s.append(txt(C[0] + 16, C[1] + 18, "ㅁ", 17));
  s.append(txt(C[0] + 30, (C[1] + P[0][1]) / 2, labs[0], 16, { fill: "#1D4E80" }), txt(C[0] + 30, (C[1] + P[2][1]) / 2, labs[1], 16, { fill: "#1D4E80" }));
  s.append(svgEl("path", { d: q4Arc(C, [0, -1], [-1, 0], 18), fill: "none", stroke: TENT, "stroke-width": 2.5 }), txt(C[0] - 34, C[1] - 30, labs[2], 17, { fill: "#B4530F" }));
}, maxW);

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 놀이공원에서 직선과 사각형을 찾아요", soop: "개념 찾기(S)",
  question: "놀이공원 곳곳에서 어떤 직각과 직선, 사각형을 찾을 수 있을까요?",
  summary: "직각은 종이를 반듯하게 두 번 접었을 때 생기는 각이에요(90°). 사각형의 네 각의 크기의 합은 360°예요. 네 각이 모두 직각인 사각형은 직사각형, 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형은 정사각형이에요.",
  steps: [
    { name: "살펴보기", inst: "단원 첫 쪽에 염소 그림이 있어요. 염소의 눈동자를 살펴보고, 하율이가 간 놀이공원에서 사각형을 찾아보세요.", hints: ["염소 눈동자의 검은 부분이 어떤 모양인지 보세요.", "곧은 선 4개로 둘러싸인 모양이 사각형이에요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [
          { q: "염소의 눈동자는 어떤 모양인가요?", fig: q4Goat, o: ["동그라미 모양", "삼각형 모양", "직사각형 모양"], a: 2 },
          { q: "직사각형 모양 눈동자는 어떤 점이 좋을까요?", o: ["옆으로 넓게 볼 수 있어요", "아주 작은 것만 볼 수 있어요", "위쪽만 잘 보여요"], a: 0 }], { ok: "염소의 눈동자는 직사각형 모양이라서 고개를 돌리지 않아도 옆쪽과 뒤쪽이 잘 보인대요." }),
        (bx, ax) => q4Pick(bx, ax, Object.assign({ tip: "놀이공원에서 사각형을 찾을 수 있는 것을 모두 눌러 골라요. 다시 누르면 취소돼요.", ok: "매표소(건물·창문·문), 정사각형 표지판, 기념품 상자에서 사각형을 찾을 수 있어요.", miss: "사각형을 더 찾아봐요. 건물의 창문과 문, 표지판, 상자를 살펴봐요." }, Q4_PARK))]) },
    { name: "떠올리기", inst: "3학년 때 배운 직각을 떠올려요. 직각을 모두 골라 보세요.", hints: ["종이를 반듯하게 두 번 접었을 때 생기는 각이 직각이에요.", "삼각자의 직각 부분을 대어 보면 알 수 있어요. 직각은 90°예요."],
      render: (b, a) => quiz(b, a, [
        { q: "직각을 모두 골라요.", fig: () => q4AngleCards([[20, 90], [0, 60], [-35, 90], [10, 120]]), o: ["가", "나", "다", "라"], a: [0, 2], why: {} },
        { q: "직각인지 확인하는 방법으로 알맞은 것을 모두 골라요.", o: ["삼각자의 직각 부분을 대어 봐요", "각도기로 재어 90°인지 봐요", "변의 길이를 비교해 봐요"], a: [0, 1] }], { ok: "가와 다가 직각이에요. 기울어져 있어도 90°이면 직각이에요.", bad: "삼각자의 직각을 대어 보는 것처럼 살펴봐요. 기울어진 각도 직각일 수 있어요." }) },
    { name: "계산하기", inst: "4-1에서 배운 사각형의 네 각의 크기의 합을 떠올려 □ 안에 알맞은 수를 구해 보세요.", hints: ["사각형의 네 각의 크기의 합은 360°예요.", "360에서 알고 있는 세 각을 빼요."],
      render: (b, a) => q4Nums(b, a, q4Labeled(q4FromAngles([80, 95, 100, 85], 5, 3.5), { angs: ["80°", "95°", "100°", "□°"] }), [{ q: "□", a: 85, unit: "°", why: { "275": "세 각의 합을 구했어요. 360°에서 세 각의 합을 빼야 해요." } }], { ok: "360 − 80 − 95 − 100 = 85예요." }) },
    { name: "약속 떠올리기", inst: "3학년 때 배운 약속을 떠올려 알맞은 말을 골라 보세요.", hints: ["직사각형은 네 각이 모두 직각이에요.", "정사각형은 네 각이 모두 직각이고, 네 변의 길이도 모두 같아요."],
      render: (b, a) => blanks(b, a, ["네 각이 모두 직각인 사각형을 ", { o: ["직사각형", "정사각형", "삼각형"], a: 0 }, "이라고 해요. 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형을 ", { o: ["정사각형", "직사각형", "직각삼각형"], a: 0 }, "이라고 해요."]) },
    { name: "확인하기", inst: "하율이처럼 우리 주변에서 직선과 사각형을 찾아 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "교실이나 집에서 직각을 찾을 수 있는 곳을 써 보세요.", tag: "직각", ph: "예) 칠판의 귀퉁이, 공책의 모서리, 창문틀" },
        { q: "주변에서 찾은 사각형과 그 모양의 특징을 써 보세요.", tag: "사각형", ph: "예) 교실 문은 직사각형이에요. 네 각이 모두 직각이에요." }]) }
  ],
  challenge: { inst: "점 종이에 직사각형과 정사각형을 차례로 만들어 보세요.", hints: ["네 각이 모두 직각이 되게 점을 찍어요. 칸을 따라 가로·세로로 그리면 쉬워요.", "정사각형은 네 변의 길이도 모두 같아야 해요."],
    render: (b, a) => q4Geo(b, a, { cols: 10, rows: 6, items: [
      { fixed: [], need: "rect", ask: "점을 4개 찍어 직사각형을 만들어요.", ok: "직사각형을 만들었어요." },
      { fixed: [], need: "sq", ask: "이번에는 정사각형을 만들어요.", ok: "정사각형을 만들었어요." }], ok: "네 각이 모두 직각인 직사각형과, 네 변의 길이까지 모두 같은 정사각형을 만들었어요." }) }
},
{
  id: "t2", no: 2, title: "수직과 수선을 알아볼까요", soop: "개념 구축하기(O)",
  question: "두 직선이 어떻게 만날 때 서로 수직이라고 할까요? 수선은 어떻게 그을까요?",
  summary: "두 직선이 만나서 이루는 각이 직각일 때 두 직선은 서로 수직이라고 해요. 두 직선이 서로 수직으로 만나면 한 직선을 다른 직선에 대한 수선이라고 해요. 삼각자의 직각을 낀 한 변을 주어진 직선에 맞추고, 직각을 낀 다른 한 변을 따라 그으면 수선이 돼요.",
  steps: [
    { name: "찾아 보기", inst: "하율이는 놀이공원 매표소와 난간에서 여러 가지 각을 보았어요. 두 직선이 만나서 이루는 각이 직각인 곳을 모두 찾아 직각 표시를 해 보세요.", hints: ["‘삼각자 대 보기’를 누르면 삼각자의 직각이 한 직선에 맞추어져요. 다른 직선이 삼각자의 변과 겹치는지 봐요.", "직선이 기울어져 있어도 만나는 각이 직각일 수 있어요."],
      render: (b, a) => q4RightMark(b, a, { panels: [{ a: 0, b: 90 }, { a: 25, b: 90 }, { a: -15, b: 65 }], ok: "가와 나는 두 직선이 만나서 이루는 각이 직각이에요. 다는 직각이 아니에요." }) },
    { name: "약속하기", inst: "약속: 직각으로 만나는 두 직선을 무엇이라고 하는지 알아봐요. 알맞은 말을 골라 약속을 완성해요.", hints: ["‘수직’은 두 직선의 관계, ‘수선’은 그 직선 하나를 부르는 이름이에요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["두 직선이 만나서 이루는 각이 직각일 때, 두 직선은 서로 ", { o: ["수직", "수선", "평행"], a: 0 }, "이라고 해요. 또 두 직선이 서로 수직으로 만나면 한 직선을 다른 직선에 대한 ", { o: ["수선", "수직", "평행선"], a: 0 }, "이라고 해요."]),
        (bx, ax) => quiz(bx, ax, [{ q: "선분과 선분, 직선과 선분이 만나서 이루는 각이 직각일 때에도 서로 수직이라고 할까요?", o: ["네, 수직이라고 해요", "아니요, 직선끼리만 수직이에요"], a: 0 },
          { q: "두 직선이 서로 수직이려면 두 직선의 길이가 비슷해야 할까요?", o: ["네, 길이가 비슷해야 해요", "아니요, 만나서 이루는 각이 직각이면 돼요"], a: 1, why: { "0": "수직은 길이와 상관없어요. 두 직선이 만나서 이루는 각만 봐요." } }], { ok: "선분끼리도 직각으로 만나면 수직이에요. 길이와는 상관없어요." })]) },
    { name: "그려 보기", inst: "삼각자를 사용하여 주어진 직선에 대한 수선을 그어 보세요.", hints: ["① 삼각자의 직각을 낀 한 변을 주어진 직선에 맞추어요(이미 맞추어져 있어요). ② 직각을 낀 다른 한 변을 따라 직선을 그어요.", "점 ㄱ을 지나야 하면 삼각자를 밀어 직각을 낀 다른 한 변이 점 ㄱ을 지나게 해요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Square(bx, ax, { mode: "perp", ang: 0, ask: "주어진 직선에 대한 수선을 그어요.", ok: "삼각자의 직각을 낀 다른 한 변을 따라 수선을 그었어요." }),
        (bx, ax) => q4Square(bx, ax, { mode: "perp", ang: 18, pt: [2.5, 2.5], ask: "점 ㄱ을 지나고 주어진 직선에 수직인 직선을 그어요.", ok: "점 ㄱ을 지나는 수선을 그었어요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "그은 직선이 수선인 것을 어떻게 알 수 있나요?", o: ["두 직선이 만나서 이루는 각이 직각이기 때문이에요", "두 직선의 길이가 같기 때문이에요", "두 직선이 만나지 않기 때문이에요"], a: 0, why: { "1": "수선은 길이와 상관없어요. 만나는 각을 봐요.", "2": "그은 직선은 주어진 직선과 만나요. 만나는 각을 봐요." } }], { ok: "삼각자의 직각을 따라 그었으니 두 직선이 만나서 이루는 각이 직각이에요. 각도기로 재면 90°예요." })]) },
    { name: "말해 보기", inst: "놀이공원 둘레의 지도예요. 서로 수직으로 만나는 두 길을 모두 찾아 짝 지어 보세요.", hints: ["‘각 재어 보기’를 켜고 두 길을 고르면 만나는 각을 재어 줘요.", "나눔길과 직각으로 만나는 길을 찾아봐요."],
      render: (b, a) => q4Lines(b, a, { mode: "perp", road: true, prot: true, H: 440, lines: [
        { n: "나눔길", c: [380, 225], a: 0, len: 365, lp: .8 }, { n: "행복길", c: [170, 220], a: 90, len: 215, lp: .6 }, { n: "희망길", c: [600, 220], a: 90, len: 215, lp: .6 },
        { n: "배려길", c: [370, 165], a: 25, len: 155, lp: .55 }, { n: "꿈길", c: [330, 295], a: 140, len: 130, lp: -.45 }],
        ask: "서로 수직으로 만나는 두 길을 짝 지어요.", ok: "행복길과 나눔길, 희망길과 나눔길이 서로 수직으로 만나요." }) },
    { name: "확인하기", inst: "익힘 문제예요. 수직과 수선을 생각하며 풀어 보세요.", hints: ["수직은 두 직선의 관계, 수선은 한 직선을 부르는 말이에요.", "삼각자의 직각을 대어 보거나 ‘각 재어 보기’로 직각인지 확인해요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "직선 가와 직선 나가 직각으로 만나요. 알맞은 말을 골라요. ‘직선 가와 직선 나는 서로 ( )입니다.’", fig: () => q4LinesFig([{ n: "가", c: [260, 230], a: 0, len: 210 }, { n: "나", c: [260, 140], a: 90, len: 115 }]), o: ["수직", "수선"], a: 0 },
          { q: "‘직선 가는 직선 나에 대한 ( )입니다.’", o: ["수직", "수선"], a: 1 }], { ok: "직선 가와 나는 서로 수직이고, 직선 가는 직선 나에 대한 수선이에요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "서로 수직인 변이 있는 도형을 모두 골라요.", fig: () => q4Cards(Q4_PERP4, { per: 4, k: 30, maxW: "40em", o: { rights: false } }), o: ["가", "나", "다", "라"], a: [0, 3] }], { ok: "가와 라에는 서로 수직인 변이 있어요.", bad: "변과 변이 만나서 이루는 각이 직각인 곳을 찾아봐요. 점 종이의 칸을 보면 도움이 돼요." }),
        (bx, ax) => q4Lines(bx, ax, { mode: "perp", prot: true, lines: [
          { n: "가", c: [380, 70], a: 0, len: 320 }, { n: "나", c: [110, 275], a: 90, len: 140 }, { n: "다", c: [230, 285], a: 45, len: 130 },
          { n: "라", c: [470, 285], a: 135, len: 130 }, { n: "마", c: [620, 200], a: 20, len: 110 }, { n: "바", c: [640, 330], a: 110, len: 90 }],
          ask: "직선 가~바 중에서 서로 수직으로 만나는 두 직선을 모두 짝 지어요.", tip: "직선을 늘였을 때 만나는 것도 생각해요. ‘각 재어 보기’를 켜면 만나는 각을 알려 줘요.", ok: "가와 나, 다와 라, 마와 바가 서로 수직이에요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "서로 수직으로 만나는 두 직선은 모두 몇 쌍인가요?", a: 3, unit: "쌍" }], { ok: "모두 3쌍이에요." })]) }
  ],
  challenge: { inst: "삼각자로 수선을 옳게 그은 것을 찾아보세요.", hints: ["삼각자의 직각을 낀 한 변이 주어진 직선에 맞추어져 있어야 해요.", "직각을 낀 다른 한 변을 따라 그어야 수선이 돼요."],
    render: (b, a) => quiz(b, a, [{ q: "삼각자를 사용하여 수선을 옳게 그은 것을 골라요.", fig: q4SqDraw, o: ["㉠", "㉡"], a: 1, why: { "0": "㉠은 삼각자의 긴 변(직각을 끼지 않은 변)을 직선에 맞추었어요. 그래서 그은 직선이 직각으로 만나지 않아요." } },
      { q: "점 ㄱ을 지나고 주어진 직선에 수직인 직선은 몇 개 그을 수 있나요?", o: ["1개", "2개", "셀 수 없이 많아요"], a: 0 }], { ok: "㉡처럼 삼각자의 직각을 낀 두 변을 이용해야 해요. 한 점을 지나는 수선은 1개뿐이에요." }) }
},
{
  id: "t3", no: 3, title: "평행과 평행선을 알아볼까요", soop: "개념 구축하기(O)",
  question: "아무리 늘여도 만나지 않는 두 직선은 어떤 관계일까요? 평행선은 어떻게 그을까요?",
  summary: "한 직선에 수직인 두 직선을 그으면 그 두 직선은 서로 만나지 않아요. 이렇게 서로 만나지 않는 두 직선을 평행하다고 하고, 평행한 두 직선을 평행선이라고 해요. 삼각자 2개를 사용하면 평행선을 그을 수 있어요. 기울어진 두 직선도 평행할 수 있어요.",
  steps: [
    { name: "찾아 보기", inst: "하율이는 회전목마와 대관람차에서 여러 가지 직선을 보았어요. 아무리 늘여도 서로 만나지 않는 두 직선을 모두 찾아 짝 지어 보세요.", hints: ["‘직선 늘여 보기’를 누르면 직선을 길게 늘여 보여 줘요.", "기울어진 두 직선도 서로 만나지 않을 수 있어요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Lines(bx, ax, { mode: "para", ext: true, prot: true, lines: [
          { n: "가", c: [380, 395], a: 0, len: 320 }, { n: "나", c: [120, 230], a: 90, len: 110 }, { n: "다", c: [235, 215], a: 90, len: 120 },
          { n: "바", c: [520, 110], a: 30, len: 150 }, { n: "라", c: [430, 300], a: 120, len: 80 }, { n: "마", c: [590, 290], a: 120, len: 85 }],
          ask: "서로 만나지 않는 두 직선을 모두 짝 지어요.", ok: "직선 나와 직선 다, 직선 라와 직선 마는 늘여도 서로 만나지 않아요." }),
        (bx, ax) => quiz(bx, ax, [
          { q: "직선 나와 직선 다는 직선 가와 어떻게 만나나요? (‘각 재어 보기’로 재어 봐요.)", o: ["수직으로 만나요", "만나지 않아요", "60°로 만나요"], a: 0 },
          { q: "직선 라와 직선 마는 어떤 직선과 수직으로 만나나요?", o: ["직선 가", "직선 바", "직선 나"], a: 1 }], { ok: "직선 나와 다는 직선 가에, 직선 라와 마는 직선 바에 수직이에요. 한 직선에 수직인 두 직선은 서로 만나지 않아요." })]) },
    { name: "약속하기", inst: "약속: 서로 만나지 않는 두 직선을 무엇이라고 하는지 알아봐요.", hints: ["한 직선에 수직인 두 직선은 서로 만나지 않아요."],
      render: (b, a) => blanks(b, a, ["한 직선에 수직인 두 직선을 그었을 때, 그 두 직선은 서로 만나지 않아요. 이와 같이 서로 만나지 않는 두 직선을 ", { o: ["평행", "수직", "수선"], a: 0 }, "하다고 해요. 이때 평행한 두 직선을 ", { o: ["평행선", "수선", "직선"], a: 0 }, "이라고 해요. 한 직선에 수직인 두 선분도 ", { o: ["평행하다고", "수직이라고"], a: 0 }, " 해요."]) },
    { name: "접어 보기", inst: "종이를 접어 평행선을 만들어 보세요. 종이를 반으로 접어 빨간 선을 만들고, 빨간 선에 맞추어 두 번 더 접어 파란 선 두 개를 만들어요.", hints: ["빨간 선에 맞추어 접으면 접힌 선은 빨간 선과 수직이 돼요.", "한 직선에 수직인 두 직선은 서로 평행해요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4FoldPar(bx, ax),
        (bx, ax) => quiz(bx, ax, [{ q: "만들어진 두 파란 선이 평행선인지 어떻게 알 수 있나요?", o: ["두 파란 선이 모두 빨간 선과 수직이기 때문이에요", "두 파란 선의 길이가 같기 때문이에요", "종이의 모양이 네모이기 때문이에요"], a: 0, why: { "1": "평행은 길이와 상관없어요.", "2": "모양이 일정하지 않은 종이로 접어도 평행선을 만들 수 있어요." } }], { ok: "처음 반으로 접은 빨간 선과 두 파란 선이 서로 수직이므로 두 파란 선은 서로 평행해요." })]) },
    { name: "그려 보기", inst: "삼각자 2개를 사용하여 주어진 직선과 평행한 직선을 그어 보세요.", hints: ["① 두 삼각자를 주어진 직선에 맞추어요. ② 한 삼각자를 고정하고, 다른 삼각자를 움직여 변을 따라 그어요.", "점 ㄱ을 지나야 하면 움직이는 삼각자의 변이 점 ㄱ에 닿을 때까지 밀어요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Square(bx, ax, { mode: "para", ang: 0, ask: "주어진 직선과 평행한 직선을 그어요.", ok: "고정한 삼각자를 따라 움직인 삼각자의 변으로 평행선을 그었어요." }),
        (bx, ax) => q4Square(bx, ax, { mode: "para", ang: -15, pt: [1.5, 3.25], ask: "점 ㄱ을 지나고 주어진 직선과 평행한 직선을 그어요.", ok: "점 ㄱ을 지나는 평행선을 그었어요." }),
        (bx, ax) => quiz(bx, ax, [
          { q: "주어진 직선과 평행한 직선은 몇 개 그을 수 있나요?", o: ["1개", "2개", "셀 수 없이 많아요"], a: 2 },
          { q: "점 ㄱ을 지나고 주어진 직선과 평행한 직선은 몇 개 그을 수 있나요?", o: ["1개", "2개", "셀 수 없이 많아요"], a: 0 },
          { q: "그은 직선이 주어진 직선과 평행한 까닭은 무엇일까요?", o: ["고정한 삼각자의 한 변에 두 직선이 모두 수직이기 때문이에요", "두 직선의 길이가 같기 때문이에요"], a: 0 }], { ok: "평행한 직선은 셀 수 없이 많이 그을 수 있지만, 점 ㄱ을 지나는 것은 1개뿐이에요." })]) },
    { name: "확인하기", inst: "익힘 문제예요. 평행과 평행선을 생각하며 풀어 보세요.", hints: ["점 종이의 칸을 세어 두 변이 같은 방향으로 기울어졌는지 봐요.", "평행한 두 직선은 서로 만나지 않아요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "서로 만나지 않는 두 직선을 골라요.", fig: () => q4Fig(620, 220, s => { s.append(svgEl("rect", { x: 5, y: 5, width: 300, height: 210, rx: 12, fill: "#fff", stroke: Q4_LINE, "stroke-width": 2 }), svgEl("rect", { x: 315, y: 5, width: 300, height: 210, rx: 12, fill: "#fff", stroke: Q4_LINE, "stroke-width": 2 }), txt(22, 22, "㉠", 18), txt(332, 22, "㉡", 18));
            s.append(q4Ln([30, 70], [285, 100]), q4Ln([30, 170], [285, 125]), q4Ln([345, 180], [470, 50]), q4Ln([435, 190], [560, 60])); }, "32em"), o: ["㉠", "㉡"], a: 1, why: { "0": "㉠의 두 직선은 오른쪽으로 늘이면 만나요." } }], { ok: "㉡의 두 직선은 기울어져 있지만 아무리 늘여도 만나지 않아요." }),
        (bx, ax) => q4SidePick(bx, ax, { p: [[0, 0], [1, 3], [4, 3], [6, 0]], want: [1, 3], ask: "사각형 ㄱㄴㄷㄹ에서 서로 평행한 두 변을 찾아 눌러요.", ok: "변 ㄴㄷ과 변 ㄹㄱ(변 ㄱㄹ)이 서로 평행해요." }),
        (bx, ax) => q4SidePick(bx, ax, { p: [[0, 2], [1, 4], [5, 4], [6, 1], [4, 0], [1, 0]], k: 55, want: [1, 4], ask: "도형 ㄱㄴㄷㄹㅁㅂ에서 서로 평행한 두 변을 찾아 눌러요.", ok: "변 ㄴㄷ과 변 ㅁㅂ이 서로 평행해요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "수호가 “평행한 두 직선은 서로 수직으로 만나.”라고 말했어요. 바르게 고친 것을 골라요.", o: ["평행한 두 직선은 서로 만나지 않아.", "평행한 두 직선은 한 점에서 만나.", "평행한 두 직선은 길이가 같아."], a: 0 }], { ok: "평행한 두 직선은 아무리 늘여도 서로 만나지 않아요." })]) }
  ],
  challenge: { inst: "기울어진 직선들 중에서도 서로 평행한 두 직선을 모두 찾아 짝 지어 보세요.", hints: ["기울어진 두 직선도 평행할 수 있어요.", "세 직선이 모두 서로 평행하면 짝이 3쌍 생겨요."],
    render: (b, a) => q4Lines(b, a, { mode: "para", ext: true, lines: [
      { n: "가", c: [190, 230], a: 55, len: 130 }, { n: "나", c: [330, 230], a: 55, len: 130 }, { n: "다", c: [440, 120], a: 10, len: 110 },
      { n: "라", c: [520, 300], a: 150, len: 110 }, { n: "마", c: [620, 220], a: 55, len: 120 }],
      ask: "서로 평행한 두 직선을 모두 짝 지어요.", ok: "가, 나, 마는 모두 같은 방향으로 기울어져 서로 평행해요. 가와 나, 가와 마, 나와 마 — 모두 3쌍이에요." }) }
},
{
  id: "t4", no: 4, title: "평행선 사이의 거리를 알아볼까요", soop: "개념 구축하기(O)",
  question: "평행선 사이의 거리는 어떻게 잴까요?",
  summary: "평행선의 한 직선에서 다른 직선에 수직인 선분을 그어요. 이 수직인 선분의 길이를 평행선 사이의 거리라고 해요. 평행선 위의 두 점을 이은 선분 중에서 수직인 선분이 가장 짧고, 평행선 사이의 거리는 어디에서 재어도 모두 같아요.",
  steps: [
    { name: "재어 보기", inst: "배가 고파진 하율이네 가족은 먹거리 장터의 한식 구역에서 양식 구역으로 가려고 해요. 평행한 두 길 사이를 잇는 길 가~마 중 가장 짧은 길을 찾아보세요. 선분을 눌러 길이를 재어 봐요.", hints: ["선분을 하나씩 눌러 자로 잰 길이를 비교해요.", "가장 짧은 선분이 평행선과 어떻게 만나는지 봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "길이가 가장 짧은 선분을 골라요.", fig: () => q4SegFig({ d: 3, segs: [[-5.5, -2.5], [-3.5, -2], [0, 0], [1.5, 3.5], [3, 6]], meas: true, lineNames: ["양식 구역 쪽 길", "한식 구역 쪽 길"], lnS: 5.6 }), o: ["가", "나", "다", "라", "마"], a: 2 },
        { q: "가장 짧은 선분은 평행선과 어떻게 만나나요?", o: ["수직으로 만나요", "비스듬히 만나요", "만나지 않아요"], a: 0 }], { ok: "선분 다가 가장 짧고, 평행선과 서로 수직으로 만나요." }) },
    { name: "약속하기", inst: "약속: 평행선 사이의 거리를 알아봐요. 알맞은 말을 골라 약속을 완성해요.", hints: ["가장 짧은 선분이 평행선과 수직으로 만났어요."],
      render: (b, a) => blanks(b, a, ["평행선의 한 직선에서 다른 직선에 ", { o: ["수직인", "비스듬한", "평행한"], a: 0 }, " 선분을 그어요. 이때 수직인 선분의 길이를 ", { o: ["평행선 사이의 거리", "직선의 길이", "수선"], a: 0 }, "라고 해요."]) },
    { name: "그어서 재기", inst: "평행선에 수직인 선분을 긋고, 평행선 사이의 거리를 재어 보세요. 주황 점을 끌어 선분을 수직으로 만들어요.", hints: ["선분이 평행선과 수직이 되면 초록색이 되고 길이가 가장 짧아져요.", "기울어진 평행선에서도 비스듬히 재지 말고 수직인 선분으로 재요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Dist(bx, ax, { items: [{ d: 3, ang: 0, sA: 0, sB0: 3 }, { d: 2, ang: 25, sA: 1, sB0: -2.5 }], ok: "두 평행선에 수직인 선분을 그어 거리를 재었어요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "첫 번째 평행선 사이의 거리", a: 3, unit: "cm" }, { q: "두 번째(기울어진) 평행선 사이의 거리", a: 2, unit: "cm" }], { ok: "첫 번째는 3 cm, 두 번째는 2 cm예요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "평행선 사이의 거리는 어디에서 재어도 같을까요?", o: ["네, 어디에서 재어도 모두 같아요", "아니요, 재는 곳마다 달라요"], a: 0 }], { ok: "평행선 사이의 거리는 어디에서 재어도 모두 같아요." })]) },
    { name: "그려 보기", inst: "평행선 사이의 거리가 3 cm가 되도록 주어진 직선과 평행한 직선을 그어 보세요.", hints: ["고정한 삼각자의 변에 cm 눈금이 있어요. 주어진 직선에서 3 cm인 곳을 찾아요.", "삼각자를 3 cm만큼 떨어진 곳으로 움직여 평행선을 그어요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Square(bx, ax, { mode: "para", ang: -10, dist: 3, ask: "주어진 직선과의 거리가 3 cm인 평행선을 그어요.", ok: "주어진 직선으로부터 수선의 길이가 3 cm인 곳에 평행선을 그었어요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "어떻게 그었는지 설명해 보세요.", tag: "그은 방법", ph: "예) 주어진 직선으로부터 수선의 길이가 3 cm인 곳에 점을 찍고, 삼각자 2개로 그 점을 지나는 평행선을 그었어요." }])]) },
    { name: "확인하기", inst: "익힘 문제예요. 평행선 사이의 거리를 생각하며 풀어 보세요.", hints: ["평행선 사이의 거리는 평행선에 수직인 선분의 길이예요.", "비스듬한 선분은 거리보다 길어요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "평행선 가와 나 사이의 거리를 나타내는 선분을 골라요.", fig: () => q4SegFig({ d: 2.5, segs: [[-5, -3], [-2.5, -1], [0.5, 2.5], [4, 4]], names: ["㉠", "㉡", "㉢", "㉣"], lineNames: ["가", "나"], H: 260 }), o: ["㉠", "㉡", "㉢", "㉣"], a: 3, why: { "0": "㉠은 평행선과 비스듬히 만나요.", "1": "㉡은 평행선과 비스듬히 만나요.", "2": "㉢은 평행선과 비스듬히 만나요." } }], { ok: "㉣이 평행선에 수직인 선분이에요." }),
        (bx, ax) => q4Nums(bx, ax, q4SegFig({ d: 5, U: 24, segs: [[-7, -7 + Math.sqrt(39)], [1.2, 1.2], [2.6, 2.6 + Math.sqrt(11)]], names: [" ", " ", " "], lens: ["8 cm", "5 cm", "6 cm"], show: [0, 1, 2], lineNames: ["가", "나"], rightMk: true, H: 240 }), [{ q: "직선 가와 직선 나는 평행해요. 평행선 사이의 거리는 몇 cm인가요?", a: 5, unit: "cm", why: { "8": "8 cm인 선분은 평행선과 비스듬히 만나요.", "6": "6 cm인 선분은 평행선과 비스듬히 만나요." } }], { ok: "평행선에 수직인 선분이 5 cm이므로 거리는 5 cm예요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "평행선 사이의 거리를 옳게 잰 것을 골라요.", fig: () => q4SegFig({ d: 3, segs: [[-3.5, -1.5], [2, 2]], names: ["㉠", "㉡"], show: [0, 1], rightMk: true, H: 240 }), o: ["㉠", "㉡"], a: 1, why: { "0": "㉠은 평행선에 비스듬히 재었어요. 평행선 사이의 거리는 평행선에 수직인 선분의 길이를 재어야 해요." } }], { ok: "㉡처럼 평행선에 수직인 선분의 길이를 재어야 해요." })]) }
  ],
  challenge: { inst: "사다리꼴 모양 표지판의 평행한 두 변을 늘인 직선이에요. 평행한 두 변 사이의 거리를 재어 보세요.", hints: ["주황 점을 끌어 수직인 선분을 만들어요.", "수직인 선분의 길이가 평행선 사이의 거리예요."],
    render: (b, a) => q4Chain(b, a, [
      (bx, ax) => q4Dist(bx, ax, { items: [{ d: 2.5, ang: -20, sA: -1, sB0: 2, ask: "주황 점을 끌어 두 직선 사이의 가장 짧은 선분을 만들어요." }], ok: "수직인 선분을 그었어요." }),
      (bx, ax) => numbers(bx, ax, [{ q: "평행선 사이의 거리", a: 2.5, unit: "cm", why: { "25": "2 cm 5 mm는 2.5 cm예요." } }], { ok: "2 cm 5 mm = 2.5 cm예요." })]) }
},
{
  id: "t5", no: 5, title: "사다리꼴을 알아볼까요", soop: "개념 구축하기(O)",
  question: "평행한 변이 있는 사각형을 무엇이라고 할까요?",
  summary: "평행한 변이 있는 사각형을 사다리꼴이라고 해요. 평행한 변이 한 쌍이어도, 두 쌍이어도 평행한 변이 있으므로 모두 사다리꼴이에요.",
  steps: [
    { name: "분류하기", inst: "하율이는 마법의 성의 지붕과 성벽 장식에서 여러 가지 사각형을 찾았어요. 평행한 변이 있는지에 따라 사각형을 분류해 보세요.", hints: ["점 종이의 칸을 세어 마주 보는 두 변이 같은 방향인지 봐요.", "평행한 변이 한 쌍만 있어도 ‘있는’ 쪽이에요."],
      render: (b, a) => q4Bins(b, a, { cats: ["평행한 변이 있는 사각형", "평행한 변이 없는 사각형"], items: Q4_C5A.map(p => ({ p, cat: q4Info(p).npar >= 1 ? 0 : 1 })), whyOf: (it, l) => it.cat === 0 ? `${l}에는 평행한 변이 있어요. 마주 보는 변을 늘여 봐요.` : `${l}의 마주 보는 변은 늘이면 만나요. 평행한 변이 없어요.`, ok: "평행한 변이 있는 사각형은 가, 나, 다, 마이고, 없는 사각형은 라, 바예요." }) },
    { name: "약속하기", inst: "약속: 평행한 변이 있는 사각형의 이름을 알아봐요.", hints: ["‘사다리’처럼 평행한 변이 있어요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["평행한 변이 있는 사각형을 ", { o: ["사다리꼴", "평행사변형", "마름모"], a: 0 }, "이라고 해요."]),
        (bx, ax) => quiz(bx, ax, [{ q: "평행한 변이 두 쌍인 사각형도 사다리꼴일까요?", o: ["네, 평행한 변이 있으니 사다리꼴이에요", "아니요, 평행한 변이 한 쌍만 있어야 해요"], a: 0, why: { "1": "사다리꼴은 평행한 변이 ‘있는’ 사각형이에요. 두 쌍이어도 평행한 변이 있어요." } }], { ok: "평행한 변이 한 쌍이든 두 쌍이든 평행한 변이 있으면 사다리꼴이에요." })]) },
    { name: "찾아 보기", inst: "사다리꼴을 모두 찾아보세요.", hints: ["마주 보는 두 변 중에서 평행한 변이 있는지 살펴봐요.", "평행한 변이 두 쌍인 것도 사다리꼴이에요."],
      render: (b, a) => quiz(b, a, [{ q: "사다리꼴을 모두 골라요.", fig: () => q4Cards(Q4_C5B, { per: 5, k: 26, cw: 180, ch: 160, maxW: "46em" }), o: Q4_KO.slice(0, 5), a: q4Ans(Q4_C5B, p => q4Info(p).npar >= 1, [0, 1, 4]) },
        { q: "다와 라는 왜 사다리꼴이 아닌가요?", o: ["평행한 변이 없기 때문이에요", "직각이 없기 때문이에요", "네 변의 길이가 다르기 때문이에요"], a: 0 }], { ok: "가, 나, 마는 평행한 변이 있어서 사다리꼴이에요. 다와 라는 평행한 변이 없어요.", bad: "마주 보는 변이 평행한지 다시 살펴봐요. 평행한 변이 두 쌍인 것도 사다리꼴이에요." }) },
    { name: "그려 보기", inst: "점 종이에 서로 다른 모양의 사다리꼴을 2개 그려 보세요.", hints: ["주어진 선분과 평행한 변을 하나 그리면 사다리꼴이 돼요.", "두 번째는 평행한 변의 위치나 길이를 바꾸어 그려 봐요."],
      render: (b, a) => q4Geo(b, a, { cols: 10, rows: 6, diff: true, items: [
        { fixed: [[1, 1], [4, 1]], need: "trap", ask: "주어진 선분 ㄱㄴ을 이용하여 사다리꼴을 그려요.", ok: "사다리꼴을 그렸어요." },
        { fixed: [], need: "trap", ask: "앞과 다른 모양의 사다리꼴을 그려요.", ok: "다른 모양의 사다리꼴도 그렸어요." }], ok: "평행한 변의 위치와 길이가 다른 여러 가지 사다리꼴을 그릴 수 있어요." }) },
    { name: "확인하기", inst: "익힘 문제예요. 사다리꼴을 찾고 평행한 변을 찾아보세요.", hints: ["평행한 변이 있으면 사다리꼴이에요.", "점 종이의 칸을 세어 기울기를 비교해요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "사다리꼴을 모두 골라요.", fig: () => q4Cards(Q4_C5E, { per: 3, k: 26, maxW: "34em" }), o: Q4_KO.slice(0, 6), a: q4Ans(Q4_C5E, p => q4Info(p).npar >= 1, [1, 2, 3, 5]) }], { ok: "나, 다, 라, 바가 사다리꼴이에요. 평행한 변이 두 쌍인 다, 라도 사다리꼴이에요.", bad: "평행한 변이 있는 사각형을 모두 골라요. 평행한 변이 두 쌍인 것도 들어가요." }),
        (bx, ax) => q4SidePick(bx, ax, { p: [[0, 0], [0, 4], [3, 3], [3, 1]], want: [0, 2], ask: "사다리꼴 ㄱㄴㄷㄹ에서 서로 평행한 두 변을 찾아 눌러요.", ok: "변 ㄱㄴ과 변 ㄷㄹ(변 ㄹㄷ)이 서로 평행해요." })]) }
  ],
  challenge: { inst: "꼭짓점을 옮기거나 조건에 맞게 사다리꼴을 만들어 보세요.", hints: ["점 ㄱ을 옮긴 뒤 평행한 변이 생기는지 봐요.", "평행한 두 변의 길이가 3 cm, 4 cm이고 두 변 사이의 거리가 3 cm(3칸)가 되게 해요."],
    render: (b, a) => q4Chain(b, a, [
      (bx, ax) => quiz(bx, ax, [{ q: "점 ㄱ을 점 ㄴ, ㄷ, ㄹ, ㅁ 중 어디로 옮기면 사다리꼴이 되나요?", fig: () => q4Fig(420, 330, s => {
          const m = q4Map([[0, 0], [5, 4]], [0, 0, 420, 330, 50], 60); q4Dots(s, m, 5, 5, 415, 325, 3);
          const P = [Q4_MV.g, ...Q4_MV.fix].map(([i, j]) => [m.ox + i * m.k, m.oy + j * m.k]); s.append(q4PolyG(P, { fs: 18, rights: false }));
          s.append(txt(P[0][0] - 4, P[0][1] - 18, "ㄱ", 20, { fill: Q4_RED }));
          Q4_MV.cand.forEach(([i, j], k) => { const x = m.ox + i * m.k, y = m.oy + j * m.k; s.append(svgEl("circle", { cx: x, cy: y, r: 7, fill: Q4_SKY }), txt(x - 18, y - 14, ["ㄴ", "ㄷ", "ㄹ", "ㅁ"][k], 18, { fill: Q4_SKY })); });
        }, "22em"), o: ["점 ㄴ", "점 ㄷ", "점 ㄹ", "점 ㅁ"], a: 2 }], { ok: "점 ㄹ로 옮기면 위아래 두 변이 평행해져서 사다리꼴이 돼요." }),
      (bx, ax) => q4Geo(bx, ax, { cols: 10, rows: 6, items: [{ fixed: [], ask: "평행한 두 변의 길이가 3 cm, 4 cm이고, 두 변 사이의 거리가 3 cm인 사다리꼴을 그려요. (한 칸은 1 cm)", need: (I, V) => {
        if (I.npar < 1) return "평행한 변이 없어요.";
        for (const [i, j] of [[0, 2], [1, 3]]) { if (!(i === 0 ? I.par02 : I.par13)) continue;
          const L = [I.L[i], I.L[j]].map(x => Math.round(x * 1000) / 1000).sort((x, y) => x - y), d = Math.abs(q4Cr(I.S[i], q4Sub(V[j], V[i]))) / I.L[i];
          if (L[0] === 3 && L[1] === 4 && Math.abs(d - 3) < 1e-9) return null; }
        return "평행한 두 변의 길이(3 cm, 4 cm)와 두 변 사이의 거리(3 cm)를 다시 확인해요. ‘변의 길이 보기’를 켜 봐요."; }, ok: "조건에 맞는 사다리꼴을 그렸어요." }], ok: "조건에 맞는 사다리꼴을 그렸어요. 친구와 비교해 보면 모양이 서로 다를 수 있어요." })]) }
},
{
  id: "t6", no: 6, title: "평행사변형을 알아볼까요", soop: "개념 구축하기(O)",
  question: "마주 보는 두 쌍의 변이 서로 평행한 사각형은 어떤 성질이 있을까요?",
  summary: "마주 보는 두 쌍의 변이 서로 평행한 사각형을 평행사변형이라고 해요. 평행사변형은 마주 보는 두 변의 길이가 같고, 마주 보는 두 각의 크기가 같고, 이웃하는 두 각의 크기의 합이 180°예요.",
  steps: [
    { name: "분류하기", inst: "하늘로 높이 올라가는 배 모양 놀이기구의 계단 난간과 간판에서 여러 가지 사각형을 찾았어요. 평행한 변이 몇 쌍인지에 따라 분류해 보세요.", hints: ["마주 보는 변은 두 쌍이 있어요. 각 쌍이 평행한지 하나씩 살펴봐요.", "직사각형도 마주 보는 두 쌍의 변이 평행해요."],
      render: (b, a) => q4Bins(b, a, { cats: ["평행한 변이 한 쌍인 사각형", "평행한 변이 두 쌍인 사각형"], items: Q4_C6A.map(p => ({ p, cat: q4Info(p).npar === 1 ? 0 : 1 })), whyOf: (it, l) => it.cat === 1 ? `${l}${q4J(l, "은", "는")} 마주 보는 두 쌍의 변이 모두 평행해요.` : `${l}${q4J(l, "은", "는")} 평행한 변이 한 쌍뿐이에요. 다른 한 쌍은 늘이면 만나요.`, ok: "한 쌍인 사각형은 다, 마이고, 두 쌍인 사각형은 가, 나, 라, 바예요." }) },
    { name: "약속하기", inst: "약속: 마주 보는 두 쌍의 변이 서로 평행한 사각형의 이름을 알아봐요.", hints: ["‘평행’한 변이 있는 ‘사변형(사각형)’이에요."],
      render: (b, a) => blanks(b, a, ["마주 보는 두 쌍의 변이 서로 평행한 사각형을 ", { o: ["평행사변형", "사다리꼴", "마름모"], a: 0 }, "이라고 해요."]) },
    { name: "잘라 보기", inst: "평행사변형 모양의 종이를 잘라 평행사변형의 성질을 알아보세요. ① 선을 따라 자른 두 조각을 겹쳐 보고, ② 각을 잘라 나란히 이어 붙여 봐요.", hints: ["한 조각을 180° 돌려야 겹쳐져요.", "나란히 붙어 있는 두 각을 이웃하는 두 각이라고 해요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Overlay(bx, ax, { p: q4PG(5, 3, 60), ok: "한 조각을 180° 돌리니 두 조각이 완전히 겹쳐졌어요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "①에서 마주 보는 두 변의 길이는 어떤가요?", o: ["같아요", "달라요"], a: 0 }, { q: "①에서 마주 보는 두 각의 크기는 어떤가요?", o: ["같아요", "달라요"], a: 0 }], { ok: "완전히 겹쳐지므로 마주 보는 두 변의 길이와 마주 보는 두 각의 크기가 같아요." }),
        (bx, ax) => q4Corners(bx, ax, { p: q4PG(5, 3, 65), ok: "이웃하는 두 각을 이어 붙이니 일직선이 되었어요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "②에서 이웃하는 두 각의 크기의 합은 몇 도인가요?", a: 180, unit: "°", why: { "360": "360°는 네 각의 크기의 합이에요. 이웃하는 두 각을 붙이면 일직선이 돼요." } }], { ok: "이웃하는 두 각의 크기의 합은 180°예요." })]) },
    { name: "그려 보기", inst: "점 종이에 서로 다른 모양의 평행사변형을 2개 그려 보세요.", hints: ["주어진 두 선분과 평행하게 나머지 두 변을 그어요.", "두 번째는 변의 길이나 기울기를 바꾸어 그려 봐요."],
      render: (b, a) => q4Geo(b, a, { cols: 10, rows: 6, diff: true, items: [
        { fixed: [[2, 1], [1, 4], [5, 4]], need: "para", ask: "주어진 선분 ㄱㄴ, ㄴㄷ을 이용하여 평행사변형을 그려요.", ok: "평행사변형을 완성했어요." },
        { fixed: [], need: "para", ask: "앞과 다른 모양의 평행사변형을 그려요.", ok: "다른 모양의 평행사변형도 그렸어요." }], ok: "마주 보는 두 쌍의 변이 평행하면 모양이 달라도 모두 평행사변형이에요." }) },
    { name: "확인하기", inst: "평행사변형의 성질을 이용하여 문제를 풀어 보세요.", hints: ["마주 보는 두 변의 길이와 마주 보는 두 각의 크기가 같아요.", "이웃하는 두 각의 크기의 합은 180°예요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Nums(bx, ax, q4Labeled(q4PG(4, 2, 50), { lens: ["4 cm", "㉡ cm", "㉠ cm", "2 cm"], angs: ["50°", "㉣°", "㉢°", null] }), [
          { q: "㉠", a: 4, unit: "cm" }, { q: "㉡", a: 2, unit: "cm" }, { q: "㉢", a: 50, unit: "°", why: { "130": "㉢은 50°인 각과 마주 보는 각이에요." } }, { q: "㉣", a: 130, unit: "°", why: { "50": "㉣은 50°인 각과 이웃하는 각이에요. 180°에서 빼요.", "310": "이웃하는 두 각의 크기의 합은 360°가 아니라 180°예요." } }], { ok: "마주 보는 변 4 cm, 2 cm, 마주 보는 각 50°, 이웃하는 각 180° − 50° = 130°예요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "윤서: “마주 보는 두 쌍의 변이 서로 평행하니까 평행사변형이야.” 진우: “네 변의 길이가 모두 같으니까 평행사변형이야.” 잘못 말한 사람은 누구인가요?", o: ["윤서", "진우"], a: 1, why: { "0": "윤서는 평행사변형의 약속을 그대로 말했어요." } }], { ok: "평행사변형은 마주 보는 두 쌍의 변이 서로 평행한 사각형이에요. 네 변의 길이가 모두 같을 필요는 없어요." }),
        (bx, ax) => q4Nums(bx, ax, q4Labeled(q4PG(9, 7, 70), { lens: ["9 cm", "□ cm", "□ cm", "7 cm"] }, "20em"), [{ q: "평행사변형의 두 □ 안에 알맞은 수의 합은 얼마인가요?", a: 16, why: { "32": "네 변의 합을 구했어요. 두 □의 합만 구해요.", "14": "두 □는 7 cm인 변, 9 cm인 변과 각각 마주 봐요.", "18": "두 □는 7 cm인 변, 9 cm인 변과 각각 마주 봐요." } }], { ok: "마주 보는 변의 길이가 같으므로 □는 7과 9예요. 7 + 9 = 16이에요." })]) }
  ],
  challenge: { inst: "도형판에서 꼭짓점 한 개만 옮겨 평행사변형을 만들어 보세요.", hints: ["마주 보는 두 쌍의 변이 서로 평행하도록 만들어 봐요.", "옮기는 꼭짓점에 따라 서로 다른 평행사변형이 생겨요."],
    render: (b, a) => q4Geo(b, a, { cols: 9, rows: 6, items: [{ start: [[1, 4], [5, 4], [6, 1], [3, 1]], need: "para", ask: "꼭짓점 한 개만 옮겨 평행사변형을 만들어요.", ok: "평행사변형을 만들었어요." }], ok: "꼭짓점 한 개만 옮겨 평행사변형을 만들었어요. 친구는 다른 꼭짓점을 옮겼을 수도 있어요." }) }
},
{
  id: "t7", no: 7, title: "마름모를 알아볼까요", soop: "개념 구축하기(O)",
  question: "네 변의 길이가 모두 같은 사각형은 어떤 성질이 있을까요?",
  summary: "네 변의 길이가 모두 같은 사각형을 마름모라고 해요. 마름모는 마주 보는 두 각의 크기가 같아요. 마주 보는 꼭짓점끼리 이은 두 선분은 서로 수직으로 만나고, 만나는 점에서 마주 보는 두 꼭짓점까지의 길이가 같아요.",
  steps: [
    { name: "분류하기", inst: "하율이는 기념품 가게의 기념품에서 여러 가지 사각형을 찾았어요. 변의 길이에 따라 사각형을 분류해 보세요. 카드의 변을 누르면 길이가 보여요.", hints: ["카드의 네 변을 하나씩 눌러 길이를 재어 봐요.", "네 변이 모두 같은지, 그렇지 않은지로 나누어요."],
      render: (b, a) => q4Bins(b, a, { measure: true, cats: ["네 변의 길이가 모두 같은 사각형", "네 변의 길이가 모두 같지는 않은 사각형"], items: Q4_C7A.map(p => ({ p, cat: q4Info(p).allEq ? 0 : 1 })), whyOf: (it, l) => it.cat === 0 ? `${l}의 네 변을 모두 재어 봐요. 길이가 모두 같아요.` : `${l}의 네 변을 모두 재어 봐요. 길이가 다른 변이 있어요.`, ok: "네 변의 길이가 모두 같은 사각형은 가, 라, 바예요." }) },
    { name: "약속하기", inst: "약속: 네 변의 길이가 모두 같은 사각형의 이름을 알아봐요.", hints: ["물풀 ‘마름’의 열매 모양에서 온 이름이에요."],
      render: (b, a) => blanks(b, a, ["네 변의 길이가 모두 같은 사각형을 ", { o: ["마름모", "평행사변형", "사다리꼴"], a: 0 }, "라고 해요."]) },
    { name: "접어 보기", inst: "마름모 모양의 종이를 접어 마름모의 성질을 알아보세요. ① 반으로 접고 ② 한 번 더 접은 다음 펼쳐서 재어 봐요.", hints: ["접었을 때 꼭 겹쳐지는 두 각은 크기가 같아요.", "펼친 종이에서 점 ㅁ부터 네 꼭짓점까지의 길이를 재어 봐요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4FoldRh(bx, ax, { a: 2.4, b: 1.6, ok: "두 번 접었다 펼쳐서 길이와 각을 재었어요." }),
        (bx, ax) => quiz(bx, ax, [
          { q: "①에서 마주 보는 두 각(각 ㄴ과 각 ㄹ)의 크기는 어떤가요?", o: ["같아요", "달라요"], a: 0 },
          { q: "점 ㅁ에서 각 꼭짓점까지의 길이를 비교하면 어떤가요?", o: ["선분 ㅁㄱ과 선분 ㅁㄷ, 선분 ㅁㄴ과 선분 ㅁㄹ의 길이가 각각 같아요", "네 선분의 길이가 모두 달라요"], a: 0 },
          { q: "선분 ㄱㄷ과 선분 ㄴㄹ이 만나서 이루는 각은 몇 도인가요?", o: ["90°", "60°", "180°"], a: 0 }], { ok: "마름모는 마주 보는 두 각의 크기가 같고, 마주 보는 꼭짓점끼리 이은 두 선분은 서로 수직으로 만나며 서로를 똑같이 둘로 나누어요." })]) },
    { name: "그려 보기", inst: "점 종이에 서로 다른 모양의 마름모를 2개 그려 보세요.", hints: ["네 변의 길이가 모두 같게 그려요. 가로 2칸·세로 1칸처럼 같은 칸 수로 비스듬히 가도 길이가 같아요.", "‘변의 길이 보기’로 확인해요."],
      render: (b, a) => q4Geo(b, a, { cols: 10, rows: 6, diff: true, items: [
        { fixed: [[3, 1], [1, 2]], need: "rhom", ask: "주어진 선분 ㄱㄴ을 이용하여 마름모를 그려요.", ok: "마름모를 그렸어요." },
        { fixed: [], need: "rhom", ask: "앞과 다른 모양의 마름모를 그려요.", ok: "다른 모양의 마름모도 그렸어요." }], ok: "네 변의 길이가 모두 같으면 기울어진 모양도 모두 마름모예요." }) },
    { name: "확인하기", inst: "마름모의 성질을 이용하여 문제를 풀어 보세요.", hints: ["마주 보는 두 각의 크기가 같고, 네 변의 길이가 모두 같아요.", "마주 보는 꼭짓점끼리 이은 두 선분은 수직으로 만나요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Nums(bx, ax, h("div", { class: "q4row" }, q4Labeled(q4RH(7, 70), { lens: ["7 cm", "㉡ cm", null, null], angs: [null, "110°", null, "㉠°"] }, "17em", 360, 250), q4RhDiag(4, 6, ["4 cm", "㉢ cm", "㉣°"])), [
          { q: "㉠", a: 110, unit: "°", why: { "70": "㉠은 110°인 각과 마주 보는 각이에요." } }, { q: "㉡", a: 7, unit: "cm" }, { q: "㉢", a: 4, unit: "cm" }, { q: "㉣", a: 90, unit: "°" }], { ok: "마주 보는 각 110°, 네 변 7 cm, 마주 보는 꼭짓점끼리 이은 선분은 서로를 똑같이 나누므로 4 cm, 수직으로 만나므로 90°예요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "마름모를 모두 골라요.", fig: () => q4Cards(Q4_C7E, { per: 3, k: 26, maxW: "34em" }), o: Q4_KO.slice(0, 6), a: q4Ans(Q4_C7E, p => q4Info(p).allEq, [2, 4]) }], { ok: "다와 마는 네 변의 길이가 모두 같아서 마름모예요.", bad: "점 종이의 칸을 세어 네 변의 길이가 모두 같은지 살펴봐요. 기울어진 모양도 있어요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "마름모에 대한 설명으로 잘못된 것을 골라요.", o: ["㉠ 마주 보는 두 변의 길이가 다릅니다.", "㉡ 마주 보는 꼭짓점끼리 이은 두 선분은 서로 수직으로 만납니다.", "㉢ 네 변의 길이가 모두 같습니다."], a: 0 }], { ok: "㉠이 잘못되었어요. 마름모는 네 변의 길이가 모두 같으니 마주 보는 두 변의 길이도 같아요." })]) }
  ],
  challenge: { inst: "도형판에서 꼭짓점 한 개만 옮겨 마름모를 만들어 보세요.", hints: ["네 변의 길이가 모두 같도록 만들어 봐요.", "‘변의 길이 보기’를 켜고 옮겨 봐요."],
    render: (b, a) => q4Geo(b, a, { cols: 9, rows: 6, items: [{ start: [[1, 3], [4, 1], [8, 3], [4, 5]], need: "rhom", ask: "꼭짓점 한 개만 옮겨 마름모를 만들어요.", ok: "마름모를 만들었어요." }], ok: "네 변의 길이가 모두 같은 마름모를 만들었어요." }) }
},
{
  id: "t8", no: 8, title: "여러 가지 사각형을 알아볼까요", soop: "탐구 정리하기(O)",
  question: "여러 가지 사각형은 각각 어떤 성질을 가지고 있을까요?",
  summary: "직사각형은 네 각이 모두 90°이고, 마주 보는 두 쌍의 변이 서로 평행하며, 마주 보는 두 변의 길이가 같아요. 정사각형은 그 성질에 더해 네 변의 길이가 모두 같아요. 한 사각형이 여러 성질을 함께 가질 수 있어요.",
  steps: [
    { name: "살펴보기", inst: "해 질 녘, 하율이는 나가는 길을 알려 주는 표지판에서 직사각형과 정사각형을 찾았어요. 변을 누르면 길이, 각 안쪽을 누르면 각도를 재어 줘요. 재어 보고 답해 보세요.", hints: ["네 각을 모두 눌러 재어 봐요.", "마주 보는 변끼리 길이를 비교해 봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "직사각형과 정사각형의 네 각의 크기는 어떤가요?", fig: () => h("div", { class: "q4row" }, q4MeasFig(Q4S.c3, { maxW: "19em" }), q4MeasFig(Q4S.s1, { maxW: "16em" })), o: ["네 각의 크기가 모두 90°예요", "두 각만 90°예요"], a: 0 },
        { q: "직사각형과 정사각형에서 평행한 변은 각각 몇 쌍인가요?", o: ["각각 1쌍", "각각 2쌍", "직사각형 2쌍, 정사각형 4쌍"], a: 1 },
        { q: "직사각형과 정사각형에서 마주 보는 두 변의 길이는 어떤가요?", o: ["같아요", "달라요"], a: 0 }], { ok: "직사각형과 정사각형은 네 각이 모두 90°이고, 평행한 변이 2쌍이며, 마주 보는 두 변의 길이가 같아요." }) },
    { name: "정리하기", inst: "알게 된 점을 정리해요. 알맞은 말을 골라요.", hints: ["정사각형은 직사각형의 성질에 네 변의 길이가 모두 같다는 성질이 더 있어요."],
      render: (b, a) => blanks(b, a, ["직사각형은 네 각이 모두 ", { o: ["90°", "60°"], a: 0 }, "이고, 마주 보는 두 쌍의 변이 서로 ", { o: ["평행해요", "수직이에요"], a: 0 }, ". 정사각형은 직사각형의 성질에 더해 네 변의 길이가 모두 ", { o: ["같아요", "달라요"], a: 0 }, "."]) },
    { name: "표 채우기", inst: "여러 가지 사각형을 살펴보고, 설명에 알맞은 사각형을 찾아 ◯표 하세요.", hints: ["한 줄씩 설명을 읽고 사각형 가~마를 하나씩 확인해요.", "한 사각형이 여러 설명에 맞을 수 있어요."],
      render: (b, a) => q4Table(b, a, { shapes: Q4_C8, ok: "가 직사각형, 나 사다리꼴, 다 마름모, 라 정사각형, 마 평행사변형의 성질을 모두 찾았어요. 친구와 서로 확인해 봐요." }) },
    { name: "만들어 보기", inst: "종이띠 6개 중 4개를 사용하여 사각형을 만들고, 만든 사각형의 이름을 골라 보세요. 서로 다른 사각형을 2개 만들어요.", hints: ["긴 띠 4개로 만들면 네 변의 길이가 모두 같아요.", "긴 띠와 짧은 띠를 번갈아 놓으면 마주 보는 변의 길이가 같아요. 각 ㄱ을 90°로 하면 어떻게 될까요?"],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Strips(bx, ax),
        (bx, ax) => writeStep(bx, ax, [{ q: "만든 사각형을 친구에게 설명해 보세요.", tag: "설명", ph: "예) 나는 마름모를 만들었어. 그 이유는 네 변의 길이가 모두 같기 때문이야." }])]) },
    { name: "확인하기", inst: "익힘 문제예요. 직사각형과 정사각형의 성질을 생각하며 풀어 보세요.", hints: ["직사각형은 네 각이 모두 직각이에요.", "정사각형은 네 각이 모두 직각이고 네 변의 길이가 모두 같아요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [
          { q: "직사각형을 모두 골라요.", fig: () => q4Cards(Q4_C8E, { per: 3, k: 26, maxW: "34em" }), o: Q4_KO.slice(0, 6), a: q4Ans(Q4_C8E, p => q4Info(p).allRight, [1, 4]) },
          { q: "정사각형을 모두 골라요.", o: Q4_KO.slice(0, 6), a: q4Ans(Q4_C8E, p => q4Info(p).allRight && q4Info(p).allEq, [1]) }], { ok: "직사각형은 나, 마이고, 정사각형은 나예요.", bad: "점 종이의 칸을 보고 네 각이 모두 직각인지, 네 변의 길이가 모두 같은지 살펴봐요." }),
        (bx, ax) => q4Nums(bx, ax, h("div", { class: "q4row" }, q4Labeled([[0, 0], [8, 0], [8, 4], [0, 4]], { lens: ["8 cm", "㉡ cm", null, "4 cm"], angs: [null, null, "㉠°", null] }, "18em"), q4Labeled([[0, 0], [5, 0], [5, 5], [0, 5]], { lens: [null, "㉣ cm", "5 cm", null], angs: ["㉢°", null, null, null] }, "13em", 260, 250)), [
          { q: "㉠", a: 90, unit: "°" }, { q: "㉡", a: 4, unit: "cm", why: { "8": "㉡은 8 cm인 변과 이웃해요. 마주 보는 변은 4 cm인 변이에요." } }, { q: "㉢", a: 90, unit: "°" }, { q: "㉣", a: 5, unit: "cm" }], { ok: "직사각형과 정사각형은 네 각이 모두 90°예요. 직사각형은 마주 보는 변의 길이가 같고, 정사각형은 네 변이 모두 같아요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "이 도형은 직사각형인가요?", fig: () => q4Fig(320, 220, s => { const m = q4Map([[0, 0], [5, 0], [5, 3], [2, 3]], [0, 0, 320, 220, 30], 50); q4Dots(s, m, 5, 5, 315, 215, 2.4); s.append(q4PolyG(m.P, { fs: 18 })); }, "16em"), o: ["직사각형이에요", "직사각형이 아니에요"], a: 1 },
          { q: "그렇게 생각한 까닭을 골라요.", o: ["네 각이 모두 직각이 아니기 때문이에요", "평행한 변이 있기 때문이에요", "변이 4개이기 때문이에요"], a: 0 }], { ok: "직각이 2개뿐이라서 직사각형이 아니에요. 직사각형은 네 각이 모두 직각이어야 해요." })]) }
  ],
  challenge: { inst: "직사각형 모양의 종이띠를 선을 따라 잘라 조각 가~바가 생겼어요. 각 조각이 설명에 맞으면 ◯표 하세요.", hints: ["조각마다 평행한 변, 네 변의 길이, 네 각을 살펴봐요.", "한 조각이 여러 줄에 ◯가 될 수 있어요."],
    render: (b, a) => { b.append(q4Fig(760, 170, s => { const m = q4Map([[0, 0], [15, 3]], [0, 10, 760, 160, 20], 46); q4Dots(s, m, 4, 12, 756, 166, 2); s.append(svgEl("rect", { x: q4F(m.ox), y: q4F(m.oy), width: q4F(15 * m.k), height: q4F(3 * m.k), fill: "#FFF3E2", stroke: INK, "stroke-width": 4 }));
        Q4_CUT.slice(1, -1).forEach(([t, bb]) => s.append(q4Ln([m.ox + t * m.k, m.oy], [m.ox + bb * m.k, m.oy + 3 * m.k], { stroke: Q4_RED, "stroke-width": 3, "stroke-dasharray": "8 5" })));
        Q4_PIECES.forEach((p, i) => { const c = q4Cen(p); s.append(txt(m.ox + c[0] * m.k, m.oy + c[1] * m.k, Q4_KO[i], 22)); }); }, "40em"));
      q4Table(b, a, { shapes: Q4_PIECES, k: 12, rows: [
        ["사다리꼴(평행한 변이 있는 사각형)", I => I.npar >= 1], ["평행사변형(마주 보는 두 쌍의 변이 평행한 사각형)", I => I.npar === 2],
        ["마름모(네 변의 길이가 모두 같은 사각형)", I => I.allEq], ["직사각형(네 각이 모두 직각인 사각형)", I => I.allRight], ["정사각형(네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형)", I => I.allRight && I.allEq]],
        ok: "사다리꼴: 가~바 모두 / 평행사변형: 가, 다, 마, 바 / 마름모: 마 / 직사각형: 가, 마, 바 / 정사각형: 마. 하나의 사각형이 여러 이름의 약속에 맞을 수 있어요." }); } }
},
{
  id: "t9", no: 9, title: "생각을 더하다 ― 소방관의 대피 훈련을 도와주세요", soop: "탐구 정리하기(O)",
  question: "평행선 사이의 거리를 이용하여 대피에 필요한 줄사다리의 길이를 어떻게 구할까요?",
  summary: "훈련 탑의 각 층 바닥은 기둥과 수직으로 만나므로 서로 평행해요. 3층에서 1층 바닥까지의 높이는 평행선 사이의 거리를 더해 구해요. 2.9 + 2.3 = 5.2이므로 줄사다리는 5.2 m보다 길어야 해요.",
  steps: [
    { name: "이해해요", inst: "소방관이 훈련 탑에서 대피 훈련을 하고 있어요. 훈련 탑은 실제 건물처럼 계단과 문이 있고, 각 층의 기둥은 바닥과 수직으로 튼튼하게 세워져 있어요. “신속히 대피하라! 줄사다리가 얼마나 필요할까요?”", hints: ["문제에서 구하려는 것이 무엇인지 찾아요.", "줄사다리는 1층 바닥에 맞닿게 설치해요."],
      render: (b, a) => quiz(b, a, [
        { q: "구하려고 하는 것은 무엇인가요?", o: ["3층에서 1층 바닥으로 대피하는 데 필요한 줄사다리가 몇 m보다 길어야 하는지", "훈련 탑의 계단의 수", "3층 문의 높이"], a: 0 },
        { q: "소방관은 어디에서 어디로 대피하나요?", o: ["3층에서 1층 바닥으로", "1층에서 옥상으로", "2층에서 3층으로"], a: 0 }], { ok: "3층 문에 줄사다리를 설치해 1층 바닥까지 내려가요." }) },
    { name: "계획해요", inst: "어떻게 해결할지 계획을 세워 보세요.", hints: ["훈련 탑의 각 층 바닥과 기둥이 서로 수직으로 만나요.", "한 직선에 수직인 두 직선은 서로 평행해요."],
      render: (b, a) => blanks(b, a, ["각 층의 바닥과 기둥이 서로 ", { o: ["수직", "평행"], a: 0 }, "으로 만나므로, 층 바닥을 나타내는 선분 가, 나, 다는 서로 ", { o: ["평행해요", "수직이에요"], a: 0 }, ". 그래서 1층 바닥에서 3층 바닥까지의 높이는 ", { o: ["평행선 사이의 거리", "비스듬한 계단의 길이"], a: 0 }, "를 이용하여 구해요."]) },
    { name: "해결해요", inst: "그림에서 1층 바닥부터 3층 바닥까지의 높이를 구하는 데 필요한 길이를 모두 골라, 줄사다리가 몇 m보다 길어야 하는지 구해 보세요.", hints: ["층 바닥에서 바로 위층 바닥까지 수직으로 잰 길이를 찾아요.", "문의 높이와 비스듬한 계단의 길이는 필요하지 않아요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Tower(bx, ax, { roof: 2.4, floors: [{ y: 0, n: "다", lab: "1층 바닥" }, { y: 2.9, n: "나", lab: "2층 바닥" }, { y: 5.2, n: "가", lab: "3층 바닥" }],
          deco: [(g, X, Y) => { g.append(svgEl("rect", { x: X(5.6), y: Y(7.3), width: 1.2 * 44, height: 2.1 * 44, fill: "#9C6B3A" }), svgEl("rect", { x: X(5.6), y: Y(2.7), width: 1.2 * 44, height: 2.7 * 44, fill: "#9C6B3A" }), q4Ln([X(2.6), Y(0)], [X(2.6 + 1.9596), Y(2.9)], { stroke: "#5A4A3F", "stroke-width": 7 }));
            for (let k = 0; k <= 10; k++) g.append(q4Ln([X(8.6), Y(5.2 * k / 10)], [X(9.0), Y(5.2 * k / 10)], { stroke: "#B4610F", "stroke-width": 2 }));
            g.append(q4Ln([X(8.6), Y(0)], [X(8.6), Y(5.2)], { stroke: "#B4610F", "stroke-width": 2.5, "stroke-dasharray": "6 3" }), q4Ln([X(9.0), Y(0)], [X(9.0), Y(5.2)], { stroke: "#B4610F", "stroke-width": 2.5, "stroke-dasharray": "6 3" }), q4Ln([X(6.8), Y(5.2)], [X(9.0), Y(5.2)], { stroke: "#B4610F", "stroke-width": 3 }), txt(X(9.3), Y(5.75), "줄사다리", 14, { fill: "#B4610F" })); }],
          tags: [{ t: "2.9 m", need: true, x1: 1, y1: 0, x2: 1, y2: 2.9 }, { t: "2.3 m", need: true, x1: 1, y1: 2.9, x2: 1, y2: 5.2 },
            { t: "2.1 m", x1: 5.5, y1: 5.2, x2: 5.5, y2: 7.3, why: "2.1 m는 3층 문의 높이예요. 바닥과 바닥 사이의 거리가 아니에요." },
            { t: "2.7 m", x1: 5.5, y1: 0, x2: 5.5, y2: 2.7, why: "2.7 m는 1층 문의 높이예요. 바닥과 바닥 사이의 거리가 아니에요." },
            { t: "3.5 m", x1: 2.6, y1: 0, x2: 2.6 + 1.9596, y2: 2.9, dx: 44, why: "3.5 m는 비스듬한 계단의 길이예요. 평행선 사이의 거리는 수직인 선분의 길이로 재요." }],
          ask: "1층 바닥에서 3층 바닥까지의 높이를 구하는 데 필요한 길이를 모두 골라요.", ok: "1층 바닥~2층 바닥 2.9 m, 2층 바닥~3층 바닥 2.3 m가 필요해요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "1층 바닥에서 3층 바닥까지의 높이는 몇 m인가요?", a: 5.2, unit: "m", why: { "13.8": "필요하지 않은 길이까지 모두 더했어요.", "0.6": "두 길이를 빼지 말고 더해요." } }], { ok: "2.9 + 2.3 = 5.2 (m)예요." }),
        (bx, ax) => blanks(bx, ax, ["줄사다리는 ", { o: ["5.2 m", "2.9 m", "3.5 m"], a: 0 }, "보다 길어야 해요."])]) },
    { name: "되돌아봐요", inst: "문제를 해결한 과정을 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "문제를 어떻게 해결했는지 설명해 보세요.", tag: "해결 방법", ph: "예) 각 층 바닥이 기둥과 수직이라 바닥끼리 평행해요. 평행선 사이의 거리 2.9 m와 2.3 m를 더해 5.2 m를 구했어요." },
        { q: "다른 방법이나 주의할 점이 있다면 써 보세요.", tag: "주의할 점", ph: "예) 비스듬한 계단의 길이는 높이가 아니에요. 바닥에 수직인 길이를 써야 해요." }]) },
    { name: "척척 풀어요", inst: "훈련 탑 난간에 줄을 매달아 옥상에서 1층 바닥으로 대피하는 훈련을 하려고 해요. 옥상과 각 층 바닥을 선분 가, 나, 다, 라로 나타내었어요. 줄은 몇 m보다 길어야 하는지 구해 보세요. (줄은 1층 바닥에 맞닿게 설치해요.)", hints: ["옥상에서 1층 바닥까지 바닥과 바닥 사이의 수직 거리를 모두 골라요.", "비스듬한 계단의 길이는 빼요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => q4Tower(bx, ax, { floors: [{ y: 0, n: "라", lab: "1층 바닥" }, { y: 3.5, n: "다", lab: "2층 바닥" }, { y: 6.0, n: "나", lab: "3층 바닥" }, { y: 8.4, n: "가", lab: "옥상" }],
          deco: [(g, X, Y) => { g.append(q4Ln([X(2.6), Y(0)], [X(2.6 + 1.7205), Y(3.5)], { stroke: "#5A4A3F", "stroke-width": 7 }), q4Ln([X(2.6), Y(3.5)], [X(2.6 + 1.4697), Y(6.0)], { stroke: "#5A4A3F", "stroke-width": 7 }));
            g.append(q4Ln([X(8.8), Y(0)], [X(8.8), Y(8.4)], { stroke: "#B4610F", "stroke-width": 3, "stroke-dasharray": "6 4" }), txt(X(8.8), Y(8.75), "줄", 14, { fill: "#B4610F" })); }],
          tags: [{ t: "3.5 m", need: true, x1: 1, y1: 0, x2: 1, y2: 3.5 }, { t: "2.5 m", need: true, x1: 1, y1: 3.5, x2: 1, y2: 6.0 }, { t: "2.4 m", need: true, x1: 1, y1: 6.0, x2: 1, y2: 8.4 },
            { t: "3.9 m", x1: 2.6, y1: 0, x2: 2.6 + 1.7205, y2: 3.5, dx: 44, why: "3.9 m는 비스듬한 계단의 길이예요." },
            { t: "2.9 m", x1: 2.6, y1: 3.5, x2: 2.6 + 1.4697, y2: 6.0, dx: 44, why: "2.9 m는 비스듬한 계단의 길이예요." }],
          ask: "옥상에서 1층 바닥까지의 높이를 구하는 데 필요한 길이를 모두 골라요.", ok: "3.5 m, 2.5 m, 2.4 m가 필요해요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "줄은 몇 m보다 길어야 하나요?", a: 8.4, unit: "m", why: { "15.2": "비스듬한 계단의 길이까지 더했어요.", "6": "옥상까지 세 구간을 모두 더해요.", "4.9": "1층 바닥부터 옥상까지 세 구간을 모두 더해요." } }], { ok: "선분 가, 나, 다, 라는 서로 평행하므로 3.5 + 2.5 + 2.4 = 8.4 (m)보다 길어야 해요." })]) }
  ],
  challenge: { inst: "척척 문제의 훈련 탑을 다시 보고 답해 보세요.", hints: ["어느 층 바닥에서 어느 층 바닥까지인지 먼저 찾아요.", "필요한 수직 거리만 더해요."],
    render: (b, a) => numbers(b, a, [{ q: "3층 바닥(나)에서 1층 바닥(라)까지 내려가는 줄은 몇 m보다 길어야 하나요?", a: 6, unit: "m", why: { "8.4": "옥상이 아니라 3층 바닥에서 출발해요." } }, { q: "옥상(가)에서 2층 바닥(다)까지는 몇 m인가요?", a: 4.9, unit: "m", why: { "8.4": "1층 바닥이 아니라 2층 바닥까지예요." } }], { ok: "3.5 + 2.5 = 6 (m), 2.5 + 2.4 = 4.9 (m)예요." }) }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 빨리! 더 빨리! 내려놓아요", soop: "탐구 정리하기(O)",
  question: "도형 카드와 설명 카드를 어떻게 이어야 할까요?",
  summary: "도형 카드 위에는 그 도형에 알맞은 설명 카드를, 설명 카드 위에는 그 설명에 알맞은 도형 카드를 내려놓아요. 사각형의 성질을 정확히 알고 있어야 카드를 빨리 내려놓을 수 있어요.",
  steps: [
    { name: "놀이 방법 알기", inst: "3~4명이 함께 하는 놀이예요. 놀이 방법을 차례대로 눌러 보세요.", hints: ["먼저 순서를 정하고 카드를 나누어 가져요.", "내려놓을 카드가 없으면 한 장을 가져와요."],
      render: (b, a) => sequence(b, a, ["① 가위바위보로 순서를 정하고, 카드를 섞어 한 사람당 7장씩 나누어 가져요.", "② 남은 카드는 뒤집어 쌓고, 맨 위 카드 한 장을 내용이 보이게 놓아요.", "③ 놓인 카드가 도형 카드이면 알맞은 설명 카드를, 설명 카드이면 알맞은 도형 카드를 내려놓아요.", "④ 내려놓을 카드가 없으면 쌓아 둔 카드에서 한 장을 가져와요.", "⑤ 먼저 카드를 모두 내려놓는 사람이 이겨요."], [0, 1, 2, 3, 4], { ok: "놀이 방법을 알았어요." }) },
    { name: "연습하기", inst: "카드를 이어 보는 연습을 해요.", hints: ["정사각형은 네 각이 모두 90°이고 네 변의 길이가 모두 같아요.", "네 변의 길이가 모두 같은 사각형을 모두 떠올려요."],
      render: (b, a) => quiz(b, a, [
        { q: "정사각형 도형 카드 위에 내려놓을 수 있는 설명 카드를 모두 골라요.", fig: () => q4Fig(200, 150, s => { const m = q4Map(Q4S.s1, [0, 0, 200, 150, 20], 34); s.append(q4PolyG(m.P, { fs: 14 })); }, "10em"), o: Q4_GDESC.map(d => d[0]), a: q4Ans(Q4_GDESC, d => d[1](q4Info(Q4S.s1)), [1, 2, 3, 4, 5]) },
        { q: "‘네 변의 길이가 모두 같은 사각형’ 설명 카드 위에 내려놓을 수 있는 도형 카드를 모두 골라요.", o: Q4_GSH.map(s => s.n), a: q4Ans(Q4_GSH, s => q4Info(s.p).allEq, [2, 4]) }], { ok: "정사각형에는 ‘평행한 변이 없는 사각형’을 뺀 설명이 모두 맞아요. 네 변의 길이가 모두 같은 사각형은 마름모와 정사각형이에요.", bad: "카드의 성질을 하나씩 따져 봐요. 맞는 카드가 여러 장일 수 있어요." }) },
    { name: "놀이하기", inst: "하율이, 친구와 함께 놀이를 해 보세요. 가운데 카드에 알맞은 카드를 내 카드에서 눌러 내려놓아요.", hints: ["가운데가 도형 카드이면 그 도형에 맞는 설명 카드를 골라요.", "내려놓을 카드가 없을 때만 ‘한 장 가져오기’를 눌러요."],
      render: (b, a) => q4Game(b, a, { shapes: Q4_GSH, descs: Q4_GDESC }) },
    { name: "또 다른 놀이", inst: "2명이 하는 또 다른 놀이예요. 친구가 그린 사각형을 ‘예/아니요’ 질문으로 맞혀 보세요. 질문을 적게 할수록 좋아요.", hints: ["‘평행한 변이 있나요?’처럼 크게 나누는 질문부터 해 봐요.", "‘네 변의 길이가 모두 같나요?’와 ‘네 각의 크기가 모두 90°인가요?’로 마름모·직사각형·정사각형을 가려요."],
      render: (b, a) => q4Twenty(b, a, { shapes: Q4_GSH }) },
    { name: "되돌아보기", inst: "놀이를 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 이기려면 어떻게 해야 할까요?", tag: "이기는 방법", ph: "예) 사각형의 성질을 잘 알고 도형 카드와 설명 카드를 빨리 이어요." },
        { q: "놀이하면서 헷갈렸던 성질을 써 보세요.", tag: "헷갈린 성질", ph: "예) 정사각형도 마주 보는 두 쌍의 변이 평행하다는 것이 헷갈렸어요." }]) }
  ],
  challenge: { inst: "카드 놀이에서 내려놓을 수 있는 카드를 생각해 보세요.", hints: ["사다리꼴은 평행한 변이 한 쌍이에요.", "평행한 변이 없는 사각형에 맞는 도형 카드를 찾아요."],
    render: (b, a) => quiz(b, a, [
      { q: "사다리꼴 도형 카드 위에 내려놓을 수 있는 설명 카드를 모두 골라요.", o: Q4_GDESC.map(d => d[0]), a: q4Ans(Q4_GDESC, d => d[1](q4Info(Q4_GSH[0].p)), [1]) },
      { q: "‘마주 보는 두 쌍의 변이 평행한 사각형’ 카드 위에 내려놓을 수 있는 도형 카드를 모두 골라요.", o: Q4_GSH.map(s => s.n), a: q4Ans(Q4_GSH, s => q4Info(s.p).npar === 2, [1, 2, 3, 4]) }], { ok: "이 놀이의 사다리꼴 카드에는 ‘평행한 변이 있는 사각형’만 맞아요. 평행사변형, 마름모, 직사각형, 정사각형은 모두 마주 보는 두 쌍의 변이 평행해요." }) }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "수직과 평행, 여러 가지 사각형에 대해 무엇을 알게 되었나요?",
  summary: "수직: 두 직선이 만나서 이루는 각이 직각. 평행: 서로 만나지 않는 두 직선. 평행선 사이의 거리: 평행선에 수직인 선분의 길이. 사다리꼴: 평행한 변이 있는 사각형. 평행사변형: 마주 보는 두 쌍의 변이 서로 평행한 사각형. 마름모: 네 변의 길이가 모두 같은 사각형.",
  steps: [
    { name: "수직과 평행", inst: "그림을 보고 알맞은 말을 고르고, 평행선을 그어 거리를 재어 보세요.", hints: ["직선 가와 라가 만나서 이루는 각을 봐요.", "점 ㄱ을 지나는 평행선을 그은 다음, 고정한 삼각자의 눈금으로 거리를 읽어요."],
      render: (b, a) => q4Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "직선 가는 직선 라에 대한 (수선, 평행선)입니다.", fig: () => { const f = q4LinesFig([{ n: "라", c: [260, 210], a: 0, len: 220 }, { n: "가", c: [140, 135], a: 90, len: 115 }, { n: "나", c: [250, 135], a: 90, len: 115 }, { n: "다", c: [380, 135], a: 65, len: 115 }]); return f; }, o: ["수선", "평행선"], a: 0 },
          { q: "직선 가와 직선 나는 서로 (수직입니다, 평행합니다).", o: ["수직입니다", "평행합니다"], a: 1 }], { ok: "직선 가는 직선 라에 대한 수선이고, 직선 가와 나는 서로 평행해요." }),
        (bx, ax) => q4Square(bx, ax, { mode: "para", ang: 8, pt: [1.5, 4], ask: "점 ㄱ을 지나고 주어진 직선과 평행한 직선을 그어요.", ok: "점 ㄱ을 지나는 평행선을 그었어요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "그은 평행선과 주어진 직선 사이의 거리는 몇 cm인가요?", a: 4, unit: "cm" }], { ok: "점 ㄱ에서 주어진 직선에 수직인 선분의 길이가 4 cm예요." })]) },
    { name: "사각형 완성하기", inst: "점 종이에 사각형을 완성해 보세요.", hints: ["사다리꼴은 평행한 변이 한 쌍이라도 있으면 돼요.", "마름모는 네 변의 길이가 모두 같아야 해요. 주어진 두 선분이 정해져 있으면 마름모는 한 가지 모양뿐이에요."],
      render: (b, a) => q4Geo(b, a, { cols: 10, rows: 6, items: [
        { fixed: [[1, 4], [2, 1]], need: "trap", ask: "주어진 선분 ㄱㄴ을 이용하여 사다리꼴을 완성해요.", ok: "사다리꼴을 완성했어요." },
        { fixed: [[6, 1], [4, 2], [6, 3]], need: "rhom", ask: "주어진 선분 ㄱㄴ, ㄴㄷ을 이용하여 마름모를 완성해요.", ok: "마름모를 완성했어요." }], ok: "사다리꼴은 여러 가지 모양으로 그릴 수 있지만, 이 마름모는 한 가지 모양으로만 그릴 수 있어요." }) },
    { name: "성질로 구하기", inst: "사각형을 보고 □ 안에 알맞은 수를 써넣으세요.", hints: ["평행사변형은 마주 보는 두 변의 길이와 마주 보는 두 각의 크기가 같고, 이웃하는 두 각의 합이 180°예요.", "직사각형은 마주 보는 두 변의 길이가 같고 네 각이 모두 직각이에요."],
      render: (b, a) => q4Nums(b, a, h("div", { class: "q4row" }, q4Labeled(q4PG(5, 4, 60), { lens: ["㉠ cm", "㉡ cm", "5 cm", "4 cm"], angs: ["㉣°", "㉢°", null, "120°"] }, "19em"), q4Labeled([[0, 0], [7, 0], [7, 4], [0, 4]], { lens: ["7 cm", null, "㉤ cm", "4 cm"], angs: [null, "㉥°", null, null] }, "19em")), [
        { q: "㉠", a: 5, unit: "cm" }, { q: "㉡", a: 4, unit: "cm" }, { q: "㉢", a: 120, unit: "°", why: { "60": "㉢은 120°인 각과 마주 보는 각이에요." } }, { q: "㉣", a: 60, unit: "°", why: { "120": "㉣은 120°인 각과 이웃하는 각이에요. 180°에서 빼요.", "240": "이웃하는 두 각의 합은 180°예요." } }, { q: "㉤", a: 7, unit: "cm" }, { q: "㉥", a: 90, unit: "°" }],
        { ok: "평행사변형: 5 cm, 4 cm, 120°, 180° − 120° = 60° / 직사각형: 7 cm, 90°예요." }) },
    { name: "바꾸어 그리기", inst: "주어진 도형을 조건에 맞게 차례대로 바꾸어 보세요. ① 꼭짓점 ㄱ을 옮겨 사다리꼴 만들기 → ② 꼭짓점 ㄴ을 옮겨 평행사변형 만들기", hints: ["① 꼭짓점 ㄱ을 옮겨 변 ㄹㄱ이 변 ㄴㄷ과 평행하게 해 봐요.", "② 마주 보는 두 쌍의 변이 평행하도록 꼭짓점 ㄴ을 옮겨요."],
      render: (b, a) => q4Geo(b, a, { cols: 9, rows: 6, items: [
        { start: Q4_S11, move: [0], need: (I, V) => { if (I.npar < 1) return "평행한 변이 없어요. 꼭짓점 ㄱ을 옮겨 평행한 변이 생기게 해요."; if (I.npar === 2) return "평행사변형이 되었어요. 이번에는 평행한 변이 한 쌍인 사다리꼴로 만들어요. 다음에 꼭짓점 ㄴ을 옮길 거예요.";
          const t = [V[0][0] + V[2][0] - V[3][0], V[0][1] + V[2][1] - V[3][1]]; if (t[0] < 0 || t[0] > 9 || t[1] < 0 || t[1] > 6 || !q4Info([V[0], t, V[2], V[3]]).simple) return "사다리꼴이지만, 다음에 꼭짓점 ㄴ을 옮겨 평행사변형을 만들 수 없는 모양이에요. 꼭짓점 ㄱ을 다른 곳으로 옮겨 봐요."; return null; }, ask: "① 꼭짓점 ㄱ을 옮겨서 사다리꼴을 만들어요.", ok: "사다리꼴을 만들었어요." },
        { fromPrev: true, move: [1], need: "para", ask: "② 이어서 꼭짓점 ㄴ을 옮겨서 평행사변형을 만들어요.", ok: "평행사변형을 만들었어요." }], ok: "꼭짓점을 옮겨 사다리꼴과 평행사변형을 차례로 만들었어요." }) },
    { name: "꼭꼭 정리하기", inst: "설명이 옳으면 오른쪽(→)으로, 옳지 않으면 아래쪽(↓)으로 이동하여 도착한 곳에 있는 꽃의 이름을 알아보세요.", hints: ["두 직선이 만나서 이루는 각이 직각이면 ‘수직’이에요.", "직사각형은 네 변의 길이가 모두 같지는 않아요."],
      render: (b, a) => q4Path(b, a, { goal: "해바라기", ends: [null, "카네이션", "해바라기", "과꽃", "무궁화", null, null], items: [
        { t: "두 직선이 만나서 이루는 각이 직각일 때 두 직선은 서로 평행하다고 합니다.", a: false, why: "이때는 서로 ‘수직’이라고 해요." },
        { t: "평행한 변이 있는 사각형을 사다리꼴이라고 합니다.", a: true },
        { t: "마름모에서 마주 보는 두 각의 크기는 같습니다.", a: true },
        { t: "직사각형은 네 변의 길이가 모두 같고 네 각의 크기가 모두 같습니다.", a: false, why: "직사각형은 네 각의 크기는 모두 같지만, 네 변의 길이가 모두 같지는 않아요." },
        { t: "평행사변형에서 마주 보는 두 변의 길이는 같습니다.", a: true },
        { t: "정사각형은 마주 보는 두 변이 서로 평행합니다.", a: true }], ok: "도착한 곳의 꽃은 해바라기예요. 다음 단원에서는 꺾은선그래프를 배워요." }) }
  ],
  challenge: { inst: "크기가 서로 다른 직사각형 모양의 종이 2장을 그림과 같이 겹쳤어요. 겹쳐진 부분에 만들어지는 도형의 이름을 쓰고, 그렇게 생각한 까닭을 써 보세요.", hints: ["서로 평행한 변이 있는지 확인해 볼까요?", "직사각형 종이의 마주 보는 변은 서로 평행해요. 겹쳐진 부분의 변은 두 종이의 변이에요."],
    render: (b, a) => q4Chain(b, a, [
      (bx, ax) => q4Overlap(bx, ax, {}),
      (bx, ax) => writeStep(bx, ax, [{ q: "그렇게 생각한 까닭을 써 보세요.", tag: "까닭", ph: "예) 겹쳐진 부분의 마주 보는 두 쌍의 변이 서로 평행하기 때문이에요." }])]) }
}
];
