//@@APP
const APP={title:"미술관 합동과 대칭", unit:"5-2 수학 3. 합동과 대칭(교과서)", key:"t52-symm-v1", welcome:"미술관 합동과 대칭 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 다윤이와 승현이를 따라 미술관을 둘러보며 도형을 포개고, 접고, 180° 돌려서 도형의 합동과 선대칭도형·점대칭도형을 알아봐요."};
//@@UNIT
/* =========================================================
   5-2 수학 3. 합동과 대칭 — 단원 조작 부품 (앞글자 sy3)
   좌표: 모눈 칸(또는 cm) 단위, 오른쪽이 x+, 아래쪽이 y+ (화면 좌표).
   도형 조각(part): {t:"p", P:[[x,y]…]} 다각형 · {t:"c", c:[x,y], r} 원 · {t:"cells", C:[[x,y]…]} 칸 모음 · {t:"pic", draw(g,m)} 그림
   합동·대칭은 모두 코드로 꼭짓점을 옮겨 보고(포개기·접기·180° 돌리기) 판정해요.
   sy3Trace  투명 종이를 끌고 돌리고 뒤집어 포개기      sy3Pick   도형 고르기·합동인 짝 찾기
   sy3Corr   대응점·대응변·대응각을 대응점 순서대로 누르기 sy3Measure 자·각도기로 재기
   sy3Fold   직선을 그어 접어 보기(대칭축 찾기)          sy3Spin   점을 중심으로 90°·180° 돌려 보기
   sy3Join   대응점끼리 이어 대칭의 중심 찾기           sy3Complete 대응점을 찍어 선대칭·점대칭도형 완성
   sy3Mirror 대칭축·선분·뒤집기 그리기판(공학 도구 대신)  sy3Sort   대칭의 종류로 나누기
   sy3Uno    카드를 없애는 완벽한 방법(놀이)            sy3Memory 짝 맞추기 기억 놀이
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.sy3fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none;user-select:none;-webkit-user-select:none}
.sy3small{font-size:var(--fs-s);color:var(--muted)}
.sy3part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.sy3read{font-family:"Jua",sans-serif;font-size:var(--fs);color:var(--night);line-height:1.5;word-break:keep-all}
.sy3row{display:flex;flex-wrap:wrap;gap:.8em;align-items:flex-start}
.sy3row>.sy3main{flex:1 1 22em;min-width:0}
.sy3row>.sy3side{flex:1 1 13em;min-width:0;display:flex;flex-direction:column;gap:.5em}
.sy3tools{display:flex;flex-wrap:wrap;gap:.35em;align-items:center}
.sy3tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .7em;font-size:var(--fs-s);word-break:keep-all}
.sy3tools button.sy3on{background:#2F4A5E;color:#fff;border-color:#2F4A5E}
.sy3tools button:disabled{opacity:.45}
.sy3list{margin:.1em 0;padding-left:1.25em;font-size:var(--fs-s)}
.sy3list li{margin:.15em 0;word-break:keep-all}
.sy3list li.sy3cur{font-weight:bold;color:var(--night)}
.sy3list li.sy3ok{color:var(--ok)}
.sy3box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all}
.sy3tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.sy3tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.sy3tbl th,.sy3tbl td{border:1.5px solid var(--line);padding:.25em .55em;text-align:center}
.sy3tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.sy3hit{cursor:pointer}
.sy3drag{cursor:grab}
.sy3cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(9.5em,1fr));gap:.6em}
.sy3card{border:2px solid var(--line);border-radius:12px;background:#fff;padding:.35em;display:flex;flex-direction:column;gap:.3em;min-width:0}
.sy3card svg{width:100%;height:auto;display:block}
.sy3card .sy3nm{font-family:"Jua",sans-serif;text-align:center}
.sy3choice{display:flex;flex-wrap:wrap;gap:.25em;justify-content:center}
.sy3choice button{border:2px solid var(--line);background:#fff;border-radius:.5em;padding:.15em .45em;font-size:.85em;word-break:keep-all}
.sy3choice button.sy3on{background:#2F4A5E;color:#fff;border-color:#2F4A5E}
.sy3card.sy3good{border-color:var(--ok)}
.sy3card.sy3bad{border-color:var(--no)}
.sy3hand{display:flex;flex-wrap:wrap;gap:.4em}
.sy3hand button{padding:.2em;border:3px solid var(--line);border-radius:12px;background:#fff;width:5.4em;min-width:0}
.sy3hand button svg{width:100%;height:auto;display:block}
.sy3hand button.sy3on{border-color:#E47A38;box-shadow:0 0 0 2px #E47A38}
.sy3hand button.sy3dim{opacity:.55}
.sy3log{font-size:var(--fs-s);max-height:9.5em;overflow-y:auto;background:#F7F9F8;border-radius:10px;padding:.3em .6em;word-break:keep-all}
.sy3log p{margin:.15em 0}
.sy3players{display:flex;flex-wrap:wrap;gap:.5em}
.sy3players>div{flex:1 1 8em;border:2px solid var(--line);border-radius:12px;padding:.3em .6em;background:#fff;min-width:0;word-break:keep-all}
.sy3players>div.sy3turn{border-color:#E47A38;background:#FFF4EA}
.sy3big{font-family:"Jua",sans-serif;font-size:1.15em}
`;
  document.head.append(s);
})();

const SY3 = { ink: "#1D2A2A", grid: "#D3DEE8", blue: "#2B7BD6", red: "#D64545", green: "#2E8B57", org: "#E47A38", purple: "#7A5BB0", gray: "#8795A1", gold: "#E8B630",
  f1: "#DCEAFB", f2: "#FDE3D3", f3: "#DDEDE5", f4: "#FFF1C7", f5: "#EADFF6", f6: "#FBE0E6" };
const SY3_KO = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "차"];
const SY3_PAIRC = ["#F6C28B", "#9FCBEF", "#A9DDB9", "#D3BDF0", "#F5A9B8"];
const sy3R = v => Math.round(v * 1000) / 1000;
const sy3F = (v, d = 1) => { const p = Math.pow(10, d), r = Math.round(v * p) / p; return String(r); };
/* 받침에 따라 조사 고르기: sy3Jo("변 ㄱㄴ", "을/를") → "변 ㄱㄴ을", sy3Jo("4 cm", "이/가") → "4 cm가" */
function sy3Jo(w, pair) {
  const s = String(w), c = s.trim().slice(-1); let [a, b] = pair.split("/"); if (["과", "을", "은", "이", "이에요"].includes(b)) [a, b] = [b, a];   // 받침 있을 때 쓰는 말을 a로
  let bat = false, rieul = false;
  if (/[0-9]/.test(c)) { bat = "013678".includes(c); rieul = "178".includes(c); }
  else if (/[ㄱ-ㅎ]/.test(c)) { bat = true; rieul = c === "ㄹ"; }
  else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  if (pair === "으로/로") return s + (bat && !rieul ? "으로" : "로");
  return s + (bat ? a : b);
}
function sy3Num(s) {
  let t = String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/(센티미터|cm|°|도|칸|개|쌍|번|장)$/i, "");
  return t === "" || !/^-?\d+(\.\d+)?$/.test(t) ? NaN : Number(t);
}
const sy3Nm = s => String(s == null ? "" : s).replace(/[^ㄱ-ㅎ]/g, "");
function sy3Anim(ms, f, end) {
  const fast = !window.requestAnimationFrame || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (fast) { f(1); if (end) end(); return; }
  const t0 = performance.now();
  const tick = now => { const t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; f(e); if (t < 1) requestAnimationFrame(tick); else if (end) end(); };
  requestAnimationFrame(tick);
}

/* ---------- 변환(아핀): A = [a,b,c,d,e,f] → (a x + c y + e, b x + d y + f) ---------- */
const SY3_I = [1, 0, 0, 1, 0, 0];
const sy3Ap = (A, p) => [A[0] * p[0] + A[2] * p[1] + A[4], A[1] * p[0] + A[3] * p[1] + A[5]];
const sy3Mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const sy3Tr = (dx, dy) => [1, 0, 0, 1, dx, dy];
function sy3Rot(c, deg) {   // 화면에서 시계 방향이 +
  const t = deg * Math.PI / 180, co = Math.cos(t), si = Math.sin(t);
  return [co, si, -si, co, c[0] - co * c[0] + si * c[1], c[1] - si * c[0] - co * c[1]];
}
function sy3Lin(a, b, c, d, cen) { return [a, b, c, d, cen[0] - a * cen[0] - c * cen[1], cen[1] - b * cen[0] - d * cen[1]]; }   // cen을 고정하는 일차 변환
function sy3Refl(p, q) {   // 직선 pq에 대하여 뒤집기
  let ux = q[0] - p[0], uy = q[1] - p[1]; const L = Math.hypot(ux, uy); ux /= L; uy /= L;
  return sy3Lin(2 * ux * ux - 1, 2 * ux * uy, 2 * ux * uy, 2 * uy * uy - 1, p);
}
function sy3FoldAt(p, q, t) {   // 접는 중간 모습: 직선과 수직인 방향으로 1 → −1
  let ux = q[0] - p[0], uy = q[1] - p[1]; const L = Math.hypot(ux, uy); ux /= L; uy /= L;
  const s = 1 - 2 * t, vx = -uy, vy = ux;   // M = u uᵀ + s v vᵀ
  return sy3Lin(ux * ux + s * vx * vx, ux * uy + s * vx * vy, ux * uy + s * vx * vy, uy * uy + s * vy * vy, p);
}
function sy3MapAt(A, c, t) {   // 합동 이동 A를 t만큼(돌리기·뒤집기·밀기를 함께)
  const det = A[0] * A[3] - A[1] * A[2], s = det < 0 ? -1 : 1;
  const th = Math.atan2(A[1], A[0] * s), Ac = sy3Ap(A, c);
  const sx = s < 0 ? 1 - 2 * t : 1, a = th * t, co = Math.cos(a), si = Math.sin(a);
  const L = [co * sx, si * sx, -si, co];
  const cx = c[0] + (Ac[0] - c[0]) * t, cy = c[1] + (Ac[1] - c[1]) * t;
  return [L[0], L[1], L[2], L[3], cx - L[0] * c[0] - L[2] * c[1], cy - L[1] * c[0] - L[3] * c[1]];
}
function sy3PxM(A, m) {   // 칸 좌표의 변환을 화면(px) 변환으로
  const e = m.k * A[4] + m.ox - (A[0] * m.ox + A[2] * m.oy), f = m.k * A[5] + m.oy - (A[1] * m.ox + A[3] * m.oy);
  return `matrix(${[A[0], A[1], A[2], A[3], e, f].map(v => sy3R(v)).join(" ")})`;
}
const SY3_D4 = [[1, 0, 0, 1], [0, 1, -1, 0], [-1, 0, 0, -1], [0, -1, 1, 0], [-1, 0, 0, 1], [1, 0, 0, -1], [0, 1, 1, 0], [0, -1, -1, 0]];

/* ---------- 도형 조각 ---------- */
const sy3P = (P, o = {}) => Object.assign({ t: "p", P }, o);
const sy3C = (c, r, o = {}) => Object.assign({ t: "c", c, r }, o);
const sy3Cells = (C, o = {}) => Object.assign({ t: "cells", C }, o);
function sy3Grid(rows) {   // ["#..", ".#."] → 칸 좌표
  const C = []; rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch !== "." && ch !== " ") C.push([x, y]); })); return C;
}
function sy3XP(pt, A) {
  if (pt.t === "p") return Object.assign({}, pt, { P: pt.P.map(p => sy3Ap(A, p)) });
  if (pt.t === "c") return Object.assign({}, pt, { c: sy3Ap(A, pt.c) });
  if (pt.t === "cells") return Object.assign({}, pt, { C: pt.C.map(c => { const q = sy3Ap(A, [c[0] + .5, c[1] + .5]); return [q[0] - .5, q[1] - .5]; }) });
  return pt;
}
const sy3XPs = (parts, A) => parts.map(pt => sy3XP(pt, A));
const sy3K2 = v => { const r = Math.round(v * 100) / 100; return (r === 0 ? 0 : r).toFixed(2); };
const sy3PtK = p => sy3K2(p[0]) + "," + sy3K2(p[1]);
function sy3PartKey(pt, col) {
  const c = col ? (pt.fill || "") + "/" : "";
  if (pt.t === "p") return "p" + c + pt.P.map(sy3PtK).sort().join(";");
  if (pt.t === "c") return "c" + c + sy3PtK(pt.c) + "r" + sy3K2(pt.r);
  if (pt.t === "cells") return "x" + c + pt.C.map(sy3PtK).sort().join(";");
  return "?";
}
const sy3Key = (parts, col) => parts.map(pt => sy3PartKey(pt, col)).sort().join("|");
function sy3Verts(parts) {   // 판정에 쓰는 점들(꼭짓점·원의 중심·칸의 가운데)
  const v = []; parts.forEach(pt => { if (pt.t === "p") v.push(...pt.P); else if (pt.t === "c") v.push(pt.c); else if (pt.t === "cells") pt.C.forEach(c => v.push([c[0] + .5, c[1] + .5])); }); return v;
}
function sy3Cen(parts) { const v = sy3Verts(parts); return [v.reduce((s, p) => s + p[0], 0) / v.length, v.reduce((s, p) => s + p[1], 0) / v.length]; }
function sy3BBox(parts) {
  const xs = [], ys = [];
  parts.forEach(pt => {
    if (pt.t === "p") pt.P.forEach(p => { xs.push(p[0]); ys.push(p[1]); });
    else if (pt.t === "c") { xs.push(pt.c[0] - pt.r, pt.c[0] + pt.r); ys.push(pt.c[1] - pt.r, pt.c[1] + pt.r); }
    else if (pt.t === "cells") pt.C.forEach(c => { xs.push(c[0], c[0] + 1); ys.push(c[1], c[1] + 1); });
    else if (pt.box) { xs.push(pt.box[0], pt.box[2]); ys.push(pt.box[1], pt.box[3]); }
  });
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}
/* 합동 판정용 열쇠(모눈 위 도형: 밀기·돌리기·뒤집기 8가지 중 가장 작은 글) */
function sy3CKey(parts) {
  if (parts.length === 1 && parts[0].t === "c") return "circle" + sy3K2(parts[0].r);
  let best = null;
  SY3_D4.forEach(M => {
    const q = sy3XPs(parts, [M[0], M[1], M[2], M[3], 0, 0]), bb = sy3BBox(q), k = sy3Key(sy3XPs(q, sy3Tr(-bb[0], -bb[1])));
    if (best === null || k < best) best = k;
  });
  return best;
}
/* 대칭 판정 */
function sy3SymLines(parts, col = true) {   // 대칭축의 방향(도, 0~180) 목록, 원 하나는 Infinity
  if (parts.length === 1 && parts[0].t === "c") return Infinity;
  const c = sy3Cen(parts), k0 = sy3Key(parts, col), cand = new Set();
  for (let d = 0; d < 180; d += 7.5) cand.add(d);
  const add = p => { const d = Math.atan2(p[1] - c[1], p[0] - c[0]) * 180 / Math.PI; if (Math.hypot(p[0] - c[0], p[1] - c[1]) > 1e-6) cand.add(Math.round((((d % 180) + 180) % 180) * 1000) / 1000); };
  parts.forEach(pt => { if (pt.t === "p") pt.P.forEach((p, i) => { add(p); const q = pt.P[(i + 1) % pt.P.length]; add([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]); }); });
  sy3Verts(parts).forEach(add);
  const out = [];
  [...cand].forEach(d => {
    const t = d * Math.PI / 180, q = [c[0] + Math.cos(t), c[1] + Math.sin(t)];
    if (sy3Key(sy3XPs(parts, sy3Refl(c, q)), col) === k0 && !out.some(e => Math.abs(e - d) < .01 || Math.abs(Math.abs(e - d) - 180) < .01)) out.push(d);
  });
  return out.sort((a, b) => a - b);
}
const sy3IsLine = (parts, col = true) => { const L = sy3SymLines(parts, col); return L === Infinity || L.length > 0; };
const sy3IsPoint = (parts, col = true) => sy3Key(sy3XPs(parts, sy3Rot(sy3Cen(parts), 180)), col) === sy3Key(parts, col);
function sy3Kind(parts, col = true) { const l = sy3IsLine(parts, col), p = sy3IsPoint(parts, col); return l && p ? "B" : l ? "L" : p ? "P" : "N"; }
const SY3_KIND = { L: "선대칭도형", P: "점대칭도형", B: "둘 다", N: "둘 다 아님" };

/* ---------- 그리기 ---------- */
function sy3Map(k, ox, oy) { const m = p => [ox + p[0] * k, oy + p[1] * k]; m.k = k; m.ox = ox; m.oy = oy; return m; }
const sy3Pts = (P, m) => P.map(p => m(p).map(sy3R).join(",")).join(" ");
function sy3GridG(x0, y0, x1, y1, m, color) {
  const g = svgEl("g", { stroke: color || SY3.grid, "stroke-width": 1 });
  for (let x = x0; x <= x1; x++) { const a = m([x, y0]), b = m([x, y1]); g.append(svgEl("line", { x1: sy3R(a[0]), y1: sy3R(a[1]), x2: sy3R(b[0]), y2: sy3R(b[1]) })); }
  for (let y = y0; y <= y1; y++) { const a = m([x0, y]), b = m([x1, y]); g.append(svgEl("line", { x1: sy3R(a[0]), y1: sy3R(a[1]), x2: sy3R(b[0]), y2: sy3R(b[1]) })); }
  return g;
}
function sy3DrawPart(g, pt, m, o = {}) {
  const stroke = o.stroke || pt.stroke || SY3.ink, sw = o.w || pt.w || 2.4, fill = o.fill || pt.fill || SY3.f1;
  let e;
  if (pt.t === "p") e = svgEl("polygon", { points: sy3Pts(pt.P, m), fill, stroke, "stroke-width": sw, "stroke-linejoin": "round" });
  else if (pt.t === "c") { const c = m(pt.c); e = svgEl("circle", { cx: sy3R(c[0]), cy: sy3R(c[1]), r: sy3R(pt.r * m.k), fill, stroke, "stroke-width": sw }); }
  else if (pt.t === "cells") {
    e = svgEl("g");
    const set = new Set(pt.C.map(c => c.join(","))), path = [];
    pt.C.forEach(c => { const a = m(c); e.append(svgEl("rect", { x: sy3R(a[0]), y: sy3R(a[1]), width: sy3R(m.k + .3), height: sy3R(m.k + .3), fill })); });
    pt.C.forEach(([x, y]) => {
      const seg = (p, q) => { const a = m(p), b = m(q); path.push(`M${sy3R(a[0])} ${sy3R(a[1])}L${sy3R(b[0])} ${sy3R(b[1])}`); };
      if (!set.has(`${x},${y - 1}`)) seg([x, y], [x + 1, y]); if (!set.has(`${x},${y + 1}`)) seg([x, y + 1], [x + 1, y + 1]);
      if (!set.has(`${x - 1},${y}`)) seg([x, y], [x, y + 1]); if (!set.has(`${x + 1},${y}`)) seg([x + 1, y], [x + 1, y + 1]);
    });
    e.append(svgEl("path", { d: path.join(""), fill: "none", stroke, "stroke-width": sw, "stroke-linecap": "round" }));
  } else if (pt.t === "pic") { e = svgEl("g"); pt.draw(e, m); }
  if (o.dash || pt.dash) e.setAttribute("stroke-dasharray", o.dash || pt.dash);
  if (o.op != null) e.setAttribute("opacity", o.op);
  g.append(e); return e;
}
function sy3DrawParts(g, parts, m, o) { const gg = svgEl("g"); parts.forEach(pt => sy3DrawPart(gg, pt, m, o)); g.append(gg); return gg; }
function sy3Inside(P, p) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
function sy3Out(P, i) {   // 꼭짓점 i에서 도형 바깥쪽 방향
  const n = P.length, p = P[i], a = P[(i + n - 1) % n], b = P[(i + 1) % n];
  const ua = [a[0] - p[0], a[1] - p[1]], ub = [b[0] - p[0], b[1] - p[1]], la = Math.hypot(...ua), lb = Math.hypot(...ub);
  let d = [-(ua[0] / la + ub[0] / lb), -(ua[1] / la + ub[1] / lb)], L = Math.hypot(...d);
  if (L < 1e-6) { d = [-ua[1] / la, ua[0] / la]; L = 1; }
  d = [d[0] / L, d[1] / L];
  if (sy3Inside(P, [p[0] + d[0] * .02, p[1] + d[1] * .02])) d = [-d[0], -d[1]];
  return d;
}
function sy3Names(g, P, names, m, o = {}) {   // 꼭짓점 이름(바깥쪽)
  const gg = svgEl("g", { "pointer-events": "none" });
  P.forEach((p, i) => {
    if (!names[i]) return;
    const d = (o.dirs && o.dirs[i]) || sy3Out(P, i), a = m(p), r = o.r || 17;
    gg.append(txt(sy3R(a[0] + d[0] * r), sy3R(a[1] + d[1] * r), names[i], o.size || 19, { fill: o.color || SY3.ink }));
  });
  g.append(gg); return gg;
}
function sy3Lab(g, m, a, b, t, o = {}) {   // 선분 a-b 옆 글자
  const A = m(a), B = m(b), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
  let nx = -(B[1] - A[1]), ny = B[0] - A[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
  if (o.c) { const C = m(o.c); if ((C[0] - mx) * nx + (C[1] - my) * ny > 0) { nx = -nx; ny = -ny; } }
  if (o.flip) { nx = -nx; ny = -ny; }
  const fs = o.size || 17, tw = [...String(t)].reduce((w, ch) => w + (/[가-힣ㄱ-ㅎ□]/.test(ch) ? .95 : ch === " " ? .3 : .58) * fs, 0);   // 글자 폭을 어림해 선과 겹치지 않게
  const half = Math.abs(nx) * tw / 2 + Math.abs(ny) * fs / 2, d = o.d ? Math.max(o.d, half + 4) : half + 7;
  const e = txt(sy3R(mx + nx * d), sy3R(my + ny * d), t, fs, { fill: o.color || SY3.ink, "font-weight": "bold" });
  g.append(e); return e;
}
function sy3AngVal(V, A, B) {   // 각 AVB (0~180)
  const a1 = Math.atan2(A[1] - V[1], A[0] - V[0]), a2 = Math.atan2(B[1] - V[1], B[0] - V[0]);
  let d = Math.abs(a1 - a2) * 180 / Math.PI; if (d > 180) d = 360 - d; return d;
}
function sy3Arc(g, m, V, A, B, t, o = {}) {   // 각 AVB에 호와 글자
  const P = m(V), r = o.r || 22, a1 = Math.atan2(A[1] - V[1], A[0] - V[0]), a2 = Math.atan2(B[1] - V[1], B[0] - V[0]);
  let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
  if (o.big) d = d > 0 ? d - 2 * Math.PI : d + 2 * Math.PI;
  const s = [P[0] + r * Math.cos(a1), P[1] + r * Math.sin(a1)], e = [P[0] + r * Math.cos(a1 + d), P[1] + r * Math.sin(a1 + d)];
  const col = o.color || SY3.org, gg = svgEl("g", { "pointer-events": "none" });
  if (Math.abs(Math.abs(d) - Math.PI / 2) < 1e-3 && !o.arc) {
    const u = [Math.cos(a1), Math.sin(a1)], v = [Math.cos(a1 + d), Math.sin(a1 + d)], q = 13;
    gg.append(svgEl("polyline", { points: [[P[0] + u[0] * q, P[1] + u[1] * q], [P[0] + (u[0] + v[0]) * q, P[1] + (u[1] + v[1]) * q], [P[0] + v[0] * q, P[1] + v[1] * q]].map(p => p.map(sy3R).join(",")).join(" "), fill: "none", stroke: col, "stroke-width": 2.2 }));
  } else gg.append(svgEl("path", { d: `M${sy3R(s[0])} ${sy3R(s[1])} A${r} ${r} 0 ${Math.abs(d) > Math.PI ? 1 : 0} ${d > 0 ? 1 : 0} ${sy3R(e[0])} ${sy3R(e[1])}`, fill: "none", stroke: col, "stroke-width": o.w || 2.6 }));
  if (t) { const mid = a1 + d / 2, R = r + (o.tr || 17); gg.append(txt(sy3R(P[0] + R * Math.cos(mid)), sy3R(P[1] + R * Math.sin(mid)), t, o.size || 16, { fill: o.tcolor || col, "font-weight": "bold" })); }
  g.append(gg); return gg;
}
function sy3Line(g, m, p, q, o = {}) {   // 직선(양쪽으로 ext칸 늘림)·선분
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], e = o.ext || 0;
  const a = m([p[0] - u[0] * e, p[1] - u[1] * e]), b = m([q[0] + u[0] * e, q[1] + u[1] * e]);
  const el = svgEl("line", { x1: sy3R(a[0]), y1: sy3R(a[1]), x2: sy3R(b[0]), y2: sy3R(b[1]), stroke: o.color || SY3.red, "stroke-width": o.w || 2.6, "stroke-linecap": "round" });
  if (o.dash) el.setAttribute("stroke-dasharray", o.dash);
  g.append(el); return el;
}
function sy3Dot(g, m, p, o = {}) { const a = m(p), e = svgEl("circle", { cx: sy3R(a[0]), cy: sy3R(a[1]), r: o.r || 5, fill: o.color || SY3.ink, stroke: o.stroke || "none", "stroke-width": 2 }); g.append(e); return e; }
function sy3Ticks(g, m, a, b, n, o = {}) {   // 같은 길이 표시
  const A = m(a), B = m(b), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2; let ux = B[0] - A[0], uy = B[1] - A[1]; const L = Math.hypot(ux, uy); ux /= L; uy /= L;
  for (let t = 0; t < n; t++) { const sx = mx + ux * (t - (n - 1) / 2) * 6, sy = my + uy * (t - (n - 1) / 2) * 6; g.append(svgEl("line", { x1: sy3R(sx - uy * 7), y1: sy3R(sy + ux * 7), x2: sy3R(sx + uy * 7), y2: sy3R(sy - ux * 7), stroke: o.color || SY3.ink, "stroke-width": 2 })); }
}
/* 그림 한 장: o = {box:[x0,y0,x1,y1] | cols,rows, k, pad, grid, shapes:[{parts|P, names, fill, stroke, dash, label, labelAt, nameDirs}], lines, segs, labs, arcs, dots, texts, ticks, maxW, after(g,m)} */
function sy3Paint(svg, m, o) {
  const g = svgEl("g"); svg.append(g);
  const box = o.box || [0, 0, o.cols, o.rows];
  if (o.grid !== false) g.append(sy3GridG(Math.floor(box[0]), Math.floor(box[1]), Math.ceil(box[2]), Math.ceil(box[3]), m));
  (o.shapes || []).forEach(S => {
    const parts = S.parts || [sy3P(S.P, { fill: S.fill, stroke: S.stroke, dash: S.dash })];
    sy3DrawParts(g, parts, m, S.op != null ? { op: S.op } : undefined);
    if (S.names && S.P) sy3Names(g, S.P, S.names, m, { dirs: S.nameDirs, r: S.nameR });
    if (S.label) { const c = S.labelAt || sy3Cen(parts), C = m(c); g.append(txt(sy3R(C[0]), sy3R(C[1]), S.label, S.lsize || 20, { fill: S.lcolor || SY3.ink, "font-weight": "bold" })); }
  });
  (o.lines || []).forEach(L => sy3Line(g, m, L.p, L.q, L));
  (o.segs || []).forEach(L => sy3Line(g, m, L.p, L.q, Object.assign({ color: SY3.ink, w: 2.4 }, L)));
  (o.ticks || []).forEach(t => sy3Ticks(g, m, t.a, t.b, t.n || 1, t));
  (o.labs || []).forEach(l => sy3Lab(g, m, l.a, l.b, l.t, l));
  (o.arcs || []).forEach(a => sy3Arc(g, m, a.V, a.A, a.B, a.t, a));
  (o.dots || []).forEach(d => { sy3Dot(g, m, d.p, d); if (d.n) { const a = m(d.p), dd = d.d || [0, -1]; g.append(txt(sy3R(a[0] + dd[0] * 17), sy3R(a[1] + dd[1] * 17), d.n, d.size || 19, { fill: d.tcolor || SY3.ink })); } });
  (o.texts || []).forEach(t => { const P = m(t.p); g.append(txt(sy3R(P[0]), sy3R(P[1]), t.t, t.size || 17, Object.assign({ fill: t.color || SY3.ink }, t.attrs || {}))); });
  if (o.after) o.after(g, m);
  return g;
}
function sy3Setup(o) {   // 칸 → 화면
  const box = o.box || [0, 0, o.cols, o.rows], k = o.k || 34, pad = o.pad == null ? 28 : o.pad;
  const W = (box[2] - box[0]) * k + pad * 2, H = (box[3] - box[1]) * k + pad * 2 + (o.extraH || 0);
  const m = sy3Map(k, pad - box[0] * k, pad - box[1] * k), svg = makeSvg(sy3R(W), sy3R(H));
  svg.setAttribute("class", "sy3fig"); svg.style.maxWidth = o.maxW || "34em";
  return { svg, m, W, H };
}
function sy3Fig(o) { const { svg, m } = sy3Setup(o); sy3Paint(svg, m, o); return svg; }
const sy3Tbl = (head, rows) => h("div", { class: "sy3tbl" }, h("table", {}, h("tr", {}, ...head.map(t => h("th", {}, t))), ...rows.map(r => h("tr", {}, ...r.map(t => h("td", {}, t))))));
/* 이름 붙은 점들을 한곳에: {ㄱ:[x,y], …} */
function sy3NamePts(shapes) { const N = {}; (shapes || []).forEach(S => { if (S.P && S.names) S.P.forEach((p, i) => { if (S.names[i]) N[S.names[i]] = p; }); }); return N; }

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기·이름 쓰기) ---------- */
function sy3Ask(host, api, items, opts = {}) {
  const wrap = h("div", { class: "sy3ask", style: "margin-top:.6em" }), all = [];
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
      } else if (pt.nm != null) {
        const inp = h("input", { type: "text", "aria-label": "답", style: `width:${pt.w || "4.4em"};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      } else {
        const len = String(pt.n).length, w = pt.w || (len > 4 ? "6em" : "4em");
        const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "답", style: `width:${w};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : pt.nm != null ? pt.nm : String(pt.n);
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : pt.nodeType ? " " : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : s.pt.nm != null ? sy3Nm(s.inp.value) === s.pt.nm : sy3Num(s.inp.value) === s.pt.n;
  const val = s => s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-");
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) { [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); }); }
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) return api.done(ans, opts.ok);
    let key;
    if (bad.pt.o) key = bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v);
    else if (bad.pt.nm != null) { key = sy3Nm(bad.inp.value); if (bad.pt.nm.length > 1 && key === [...bad.pt.nm].reverse().join("") && !(bad.pt.why && bad.pt.why[key])) return api.fail("대응점의 순서대로 읽어야 해요. 순서를 다시 살펴봐요.", ans); }
    else key = String(sy3Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}
/* 조작을 마친 뒤: then(이어서 할 활동) → ask(물음) → 없으면 바로 해결 */
function sy3Finish(body, api, opt, ans, msg, data) {
  const go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "sy3part" }); body.append(box); opt.then(box, api, data); go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask(data) : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = sy3Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle }); go(w); }
  else api.done(ans, opt.ok || msg);
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열림 */
function sy3Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "sy3part" : "" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); setTimeout(() => { try { body.lastChild.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}
const sy3Side = (...kids) => h("div", { class: "sy3side" }, ...kids);
const sy3Tools = (...kids) => h("div", { class: "sy3tools" }, ...kids);
function sy3Layout(body, svg, side) { const r = h("div", { class: "sy3row" }, h("div", { class: "sy3main" }, svg), side); body.append(r); return r; }

/* 화면 좌표(px) → 칸 좌표 */
const sy3Un = (m, p) => [(p.x - m.ox) / m.k, (p.y - m.oy) / m.k];

/* =========================================================
   1. 투명 종이로 포개기 — 조각을 끌어 옮기고, 90°씩 돌리고, 뒤집어서 다른 도형에 포개요
   opt: {box|cols,rows, k, shapes:[{label, P, names, fill, hole}], piece:{P, names, fill, stroke, at:[dx,dy], paper}, visit:[label…], fit:[label…],
         ctrl:["rot","flip"], tip, ask|then, ok, doneMsg}
   ========================================================= */
function sy3Trace(body, api, opt) {
  const { svg, m } = sy3Setup(opt), pc = opt.piece, P0 = pc.P, paper = pc.paper !== false;
  sy3Paint(svg, m, Object.assign({}, opt, { shapes: [] }));
  const shG = svgEl("g"), pG = svgEl("g", { class: "sy3drag" }), nG = svgEl("g", { "pointer-events": "none" });
  svg.append(shG, pG, nG);
  const shapes = (opt.shapes || []).map(S => {
    const el = sy3DrawPart(shG, sy3P(S.P), m, S.hole ? { fill: "#FFFFFF", stroke: SY3.gray, dash: "7 6", w: 2.4 } : { fill: S.fill || SY3.f1, stroke: S.stroke || SY3.ink });
    if (S.names) sy3Names(shG, S.P, S.names, m, { dirs: S.nameDirs });
    if (S.label && !S.hideLabel) { const C = m(S.labelAt || sy3Cen([sy3P(S.P)])); shG.append(txt(sy3R(C[0]), sy3R(C[1]), S.label, 20, { fill: SY3.ink, "font-weight": "bold" })); }
    return { S, el, key: sy3Key([sy3P(S.P)]), bb: sy3BBox([sy3P(S.P)]) };
  });
  let A = pc.at ? sy3Tr(pc.at[0], pc.at[1]) : SY3_I.slice(), busy = false, done = false;
  const visited = new Set(), fitted = new Set();
  const cur = () => P0.map(p => sy3Ap(A, p));
  const draw = (B) => {
    const M = B || A, Q = P0.map(p => sy3Ap(M, p));
    pG.innerHTML = ""; nG.innerHTML = "";
    const e = svgEl("polygon", { points: sy3Pts(Q, m), fill: pc.fill || (paper ? "#F7E7A6" : SY3.f2), "fill-opacity": paper ? .55 : .95, stroke: pc.stroke || SY3.org, "stroke-width": 3, "stroke-dasharray": paper ? "8 5" : "none", "stroke-linejoin": "round" });
    pG.append(e);
    if (pc.label) { const C = m(sy3Cen([sy3P(Q)])); pG.append(txt(sy3R(C[0]), sy3R(C[1]), pc.label, 18, { fill: SY3.org, "font-weight": "bold" })); }
    if (pc.names && !B) sy3Names(nG, Q, pc.names, m, { color: SY3.org, r: 15, size: 17 });
  };
  const list = h("ol", { class: "sy3list" }), read = h("div", { class: "sy3read" }, opt.start || "투명 종이를 끌어서 옮겨 보세요.");
  const tasks = [...(opt.visit || []).map(l => ({ t: "visit", l, txt: `도형 ${l}에 포개어 보기` })), ...(opt.fit || []).map(l => ({ t: "fit", l, txt: opt.fitText ? opt.fitText(l) : `도형 ${sy3Jo(l, "와/과")} 완전히 겹치게 포개기` }))];
  const showList = () => { list.innerHTML = ""; tasks.forEach(t => { const ok = t.t === "visit" ? visited.has(t.l) : fitted.has(t.l); list.append(h("li", { class: ok ? "sy3ok" : "" }, t.txt + (ok ? " ✓" : ""))); }); };
  const snap = () => { const bb = sy3BBox([sy3P(cur())]), s = opt.step || 1; A = sy3Mul(sy3Tr(Math.round(bb[0] / s) * s - bb[0], Math.round(bb[1] / s) * s - bb[1]), A); };
  function judge() {
    const Q = cur(), k = sy3Key([sy3P(Q)]), c = sy3Cen([sy3P(Q)]);
    shapes.forEach(s => s.el.setAttribute("stroke-width", 2.4));
    const hit = shapes.find(s => s.key === k);
    const over = shapes.filter(s => c[0] > s.bb[0] - .01 && c[0] < s.bb[2] + .01 && c[1] > s.bb[1] - .01 && c[1] < s.bb[3] + .01);
    over.forEach(s => s.S.label && visited.add(s.S.label));
    if (hit) { hit.el.setAttribute("stroke-width", 5); if (hit.S.label) { fitted.add(hit.S.label); visited.add(hit.S.label); } read.textContent = opt.hitText ? opt.hitText(hit.S) : (hit.S.label ? `도형 ${sy3Jo(hit.S.label, "와/과")} 완전히 겹쳐요!` : "빈자리에 꼭 맞아요!"); }
    else if (over.length) read.textContent = over[0].S.label ? `도형 ${over[0].S.label}에 포개었어요. 겹치지 않는 부분이 있어요.` : "겹치지 않는 부분이 있어요. 돌리거나 뒤집어 봐요.";
    else read.textContent = "도형 위로 끌어 와서 포개어 보세요.";
    showList();
    if (!done && tasks.every(t => t.t === "visit" ? visited.has(t.l) : fitted.has(t.l))) {
      done = true; api.tryOnce(); btns.forEach(b => b.disabled = true);
      sy3Finish(body, api, opt, "포개기: " + [...fitted].join(", "), opt.doneMsg || "잘 포개었어요!");
    }
  }
  function op(kind) {
    if (busy || done) return;
    const c = sy3Cen([sy3P(cur())]), A0 = A;
    const step = kind === "cw" ? t => sy3Rot(c, 90 * t) : kind === "ccw" ? t => sy3Rot(c, -90 * t) : kind === "lr" ? t => sy3Lin(1 - 2 * t, 0, 0, 1, c) : t => sy3Lin(1, 0, 0, 1 - 2 * t, c);
    busy = true;
    sy3Anim(420, t => draw(sy3Mul(step(t), A0)), () => { A = sy3Mul(step(1), A0); snap(); busy = false; draw(); judge(); });
  }
  let drag = null;
  svg.style.touchAction = "none";
  dragOn(svg, p => {
    if (busy || done) return false;
    const u = sy3Un(m, p), Q = cur(), bb = sy3BBox([sy3P(Q)]);
    if (!(sy3Inside(Q, u) || (u[0] > bb[0] && u[0] < bb[2] && u[1] > bb[1] && u[1] < bb[3]))) return false;
    drag = { u, A0: A }; pG.style.cursor = "grabbing";
  }, p => {
    if (!drag) return; const u = sy3Un(m, p);
    A = sy3Mul(sy3Tr(u[0] - drag.u[0], u[1] - drag.u[1]), drag.A0); draw();
  }, () => { if (!drag) return; drag = null; pG.style.cursor = ""; snap(); draw(); judge(); });
  const ctrl = opt.ctrl || ["rot", "flip"], btns = [];
  const B = (t, k) => { const b = h("button", { onclick: () => op(k) }, t); btns.push(b); return b; };
  const side = sy3Side(h("p", { class: "sy3small" }, opt.tip || "조각을 끌어서 옮겨요. 단추로 돌리거나 뒤집을 수 있어요."), list, read);
  if (ctrl.includes("rot")) side.append(h("b", {}, "돌리기"), sy3Tools(B("↻ 시계 방향 90°", "cw"), B("↺ 시계 반대 방향 90°", "ccw")));
  if (ctrl.includes("flip")) side.append(h("b", {}, "뒤집기"), sy3Tools(B("⇆ 왼쪽·오른쪽", "lr"), B("⇅ 위쪽·아래쪽", "ud")));
  const reset = h("button", { onclick: () => { if (busy || done) return; A = pc.at ? sy3Tr(pc.at[0], pc.at[1]) : SY3_I.slice(); draw(); read.textContent = "처음 자리로 돌아왔어요."; } }, "처음 자리로");
  btns.push(reset); side.append(sy3Tools(reset));
  api.provide({ words: opt.words || ["포개기", "완전히 겹쳐요", "돌리기", "뒤집기"], answers: [] });
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  sy3Layout(body, svg, side);
  draw(); showList();
}

/* =========================================================
   2. 도형 고르기 — select: 알맞은 도형을 모두 눌러 고르기 / pairs: 합동인 두 도형을 짝 지어 누르기
   opt: {box|cols,rows, k, shapes:[{label, parts|P, fill, labelAt}], mode, answer:[label…], tip, ask, ok, bad, why:{label:"까닭"}}
   ========================================================= */
function sy3Pick(body, api, opt) {
  const { svg, m } = sy3Setup(opt);
  sy3Paint(svg, m, Object.assign({}, opt, { shapes: [] }));
  let tapFn = () => { };
  const items = opt.shapes.map((S, i) => {
    const parts = S.parts || [sy3P(S.P, { fill: S.fill || SY3.f1 })], g = svgEl("g", { class: "sy3hit" });
    const el = sy3DrawParts(g, parts, m);
    const bb = sy3BBox(parts), C = m(S.labelAt || [(bb[0] + bb[2]) / 2, bb[1] - .45]);
    const lab = txt(sy3R(C[0]), sy3R(C[1]), S.label, 19, { fill: SY3.ink, "font-weight": "bold" });
    const a = m([bb[0], bb[1]]), b = m([bb[2], bb[3]]);
    const ring = svgEl("rect", { x: sy3R(a[0] - 7), y: sy3R(a[1] - 7), width: sy3R(b[0] - a[0] + 14), height: sy3R(b[1] - a[1] + 14), rx: 9, fill: "rgba(255,255,255,0.01)", stroke: "none", "stroke-width": 3.5 });
    g.prepend(ring); g.append(lab); svg.append(g);
    const it = { S, parts, g, el, ring, key: sy3CKey(parts), on: false, pair: -1 };
    g.addEventListener("click", () => tapFn(it));
    return it;
  });
  const read = h("div", { class: "sy3read" }, opt.start || (opt.mode === "pairs" ? "합동인 두 도형을 차례로 눌러요." : "알맞은 도형을 모두 눌러 골라요."));
  const paint = it => { it.ring.setAttribute("stroke", it.pair >= 0 ? SY3_PAIRC[it.pair % SY3_PAIRC.length] : it.on ? SY3.org : "none"); it.ring.setAttribute("fill", it.pair >= 0 ? SY3_PAIRC[it.pair % SY3_PAIRC.length] + "55" : it.on ? "rgba(228,122,56,.12)" : "rgba(255,255,255,0.01)"); };
  let done = false;
  if (opt.mode === "pairs") {
    const groups = {}; items.forEach(it => (groups[it.key] = groups[it.key] || []).push(it));
    const want = Object.values(groups).filter(g => g.length > 1).length;
    let found = 0, sel = null; const got = [];
    const list = h("ul", { class: "sy3list" });
    tapFn = it => {
      if (done || it.pair >= 0) return;
      if (!sel) { sel = it; it.on = true; paint(it); read.textContent = `도형 ${sy3Jo(it.S.label, "와/과")} 합동인 도형을 눌러요.`; return; }
      if (sel === it) { it.on = false; paint(it); sel = null; read.textContent = "합동인 두 도형을 차례로 눌러요."; return; }
      api.tryOnce();
      if (sel.key === it.key) {
        sel.pair = it.pair = found++; sel.on = it.on = false; paint(sel); paint(it);
        got.push(`${sel.S.label}와 ${it.S.label}`); list.append(h("li", { class: "sy3ok" }, `도형 ${sy3Jo(sel.S.label, "와/과")} 도형 ${it.S.label} ✓`));
        read.textContent = `${found}쌍을 찾았어요.` + (found < want ? " 또 찾아봐요." : "");
        sel = null;
        if (found === want) { done = true; sy3Finish(body, api, opt, "합동인 짝: " + got.join(", "), opt.doneMsg || "합동인 도형을 모두 찾았어요!"); }
      } else {
        const a = sel; a.on = false; paint(a); sel = null;
        api.fail((opt.why && (opt.why[a.S.label + it.S.label] || opt.why[it.S.label + a.S.label])) || `도형 ${sy3Jo(a.S.label, "와/과")} 도형 ${it.S.label}의 모양과 크기를 다시 살펴봐요. 모눈의 칸 수를 세어 봐요.`, `${a.S.label}-${it.S.label}`);
        read.textContent = "합동인 두 도형을 차례로 눌러요.";
      }
    };
    api.provide({ words: ["모양", "크기", "모눈 칸 수", "합동"], answers: [Object.values(groups).filter(g => g.length > 1).map(g => g.map(x => x.S.label).join("와 ")).join(", ")] });
    body.append(...(opt.tip ? [h("p", { class: "sy3small" }, opt.tip)] : []), svg, read, list);
  } else {
    tapFn = it => { if (done) return; it.on = !it.on; paint(it); read.textContent = "고른 도형: " + (items.filter(x => x.on).map(x => x.S.label).join(", ") || "없음"); };
    const ans = opt.answer;
    api.provide({ words: opt.words || [], answers: [ans.join(", ")] });
    const check = h("button", { class: "big", onclick: () => {
      if (done) return; api.tryOnce();
      const picked = items.filter(x => x.on).map(x => x.S.label), ok = picked.length === ans.length && ans.every(l => picked.includes(l));
      if (ok) { done = true; check.disabled = true; return sy3Finish(body, api, opt, picked.join(", "), opt.doneMsg || "알맞게 골랐어요!"); }
      const extra = picked.find(l => !ans.includes(l)), miss = ans.find(l => !picked.includes(l));
      api.fail(extra && opt.why && opt.why[extra] ? opt.why[extra] : extra ? `도형 ${sy3Jo(extra, "은/는")} 알맞지 않아요. 다시 살펴봐요.` : `빠진 도형이 있어요. 다시 살펴봐요.` + (miss && opt.why && opt.why[miss] ? " " + opt.why[miss] : ""), picked.join(", ") || "-");
    } }, "확인하기");
    body.append(...(opt.tip ? [h("p", { class: "sy3small" }, opt.tip)] : []), svg, read, h("div", { class: "actions" }, check));
  }
  items.forEach(paint);
}

/* =========================================================
   3. 대응점·대응변·대응각 찾기 — 대응점의 순서대로 꼭짓점을 눌러요
   opt: 그림(sy3Paint와 같음) + items:[{k:"점"|"변"|"각", q:"ㄱㄴ", a:"ㄹㅁ"}], demo:{type:"fold",p,q | "rot",c | "map",A, from}, demoText, tip, ask, ok
   ========================================================= */
function sy3Corr(body, api, opt) {
  const { svg, m } = sy3Setup(opt);
  sy3Paint(svg, m, opt);
  const N = Object.assign(sy3NamePts(opt.shapes), opt.pts || {}), names = Object.keys(N).filter(n => !opt.only || opt.only.includes(n));
  const demoG = svgEl("g", { "pointer-events": "none" }), hiG = svgEl("g", { "pointer-events": "none" }), hitG = svgEl("g");
  svg.append(demoG, hiG, hitG);
  const items = opt.items, kw = { "점": "대응점", "변": "대응변", "각": "대응각" };
  let qi = 0, sel = [], done = false;
  const minD = Math.min(...names.flatMap((a, i) => names.slice(i + 1).map(b => dist({ x: N[a][0], y: N[a][1] }, { x: N[b][0], y: N[b][1] }) * m.k)), 60);
  const R = Math.max(12, Math.min(22, minD / 2 - 2));
  const marks = {};
  names.forEach(n => {
    const a = m(N[n]), c = svgEl("circle", { cx: sy3R(a[0]), cy: sy3R(a[1]), r: sy3R(R), fill: "rgba(43,123,214,0.06)", stroke: "rgba(43,123,214,0.35)", "stroke-width": 1.5, class: "sy3hit" });
    c.addEventListener("click", () => pick(n)); hitG.append(c); marks[n] = c;
  });
  const full = (k, s) => `${k} ${s}`;
  const prompt = h("div", { class: "sy3read" }), selR = h("div", { class: "sy3big" }), list = h("ul", { class: "sy3list" });
  const drawQ = () => {
    hiG.innerHTML = ""; const it = items[qi]; if (!it) return;
    const q = [...it.q].map(n => N[n]);
    if (it.k === "점") sy3Dot(hiG, m, q[0], { r: 9, color: "none", stroke: SY3.blue });
    if (it.k === "변") sy3Line(hiG, m, q[0], q[1], { color: SY3.blue, w: 6 });
    if (it.k === "각") sy3Arc(hiG, m, q[1], q[0], q[2], "", { color: SY3.blue, w: 4, r: 20 });
    const s = sel.map(n => N[n]);
    if (s.length === 1 || it.k === "점") s.forEach(p => sy3Dot(hiG, m, p, { r: 8, color: SY3.org }));
    if (s.length >= 2) for (let i = 0; i + 1 < s.length; i++) sy3Line(hiG, m, s[i], s[i + 1], { color: SY3.org, w: 5 });
    if (it.k === "각" && s.length === 3) sy3Arc(hiG, m, s[1], s[0], s[2], "", { color: SY3.org, w: 4, r: 20 });
  };
  const show = () => {
    const it = items[qi];
    if (!it) { prompt.textContent = "모두 찾았어요!"; selR.textContent = ""; hiG.innerHTML = ""; return; }
    prompt.textContent = `${full(it.k, it.q)}의 ${kw[it.k]}을 찾아 ${it.k === "점" ? "눌러요." : `대응점의 순서대로 ${it.k === "변" ? "두" : "세"} 점을 눌러요.`}`;
    selR.textContent = sel.length ? `${it.k} ${sel.join("")}` + (sel.length < it.a.length ? " …" : "") : "";
    drawQ();
  };
  function pick(n) {
    if (done) return; const it = items[qi]; if (!it) return;
    if (sel.length && sel[sel.length - 1] === n) { sel.pop(); show(); return; }
    sel.push(n); show();
    if (sel.length < it.a.length) return;
    api.tryOnce();
    const got = sel.join("");
    if (got === it.a) {
      list.append(h("li", { class: "sy3ok" }, `${full(it.k, it.q)} ↔ ${full(it.k, it.a)} ✓`));
      qi++; sel = [];
      if (qi >= items.length) { done = true; show(); return sy3Finish(body, api, opt, items.map(x => `${x.k} ${x.q}-${x.a}`).join(" / "), opt.doneMsg || `${kw[items[0].k]}을 모두 찾았어요!`); }
      api.hint(`○ ${full(it.k, it.q)}의 ${kw[it.k]}은 ${full(it.k, it.a)}이에요.`);
      show();
    } else {
      sel = [];
      const rev = [...it.a].reverse().join("");
      let msg;
      if (it.k !== "점" && got === rev) msg = `고른 점은 맞지만 순서가 달라요. ${it.k} ${it.q}에서 점 ${it.q[0]}의 대응점부터 차례대로 눌러요.`;
      else if (it.k !== "점" && [...got].sort().join("") === [...it.a].sort().join("")) msg = `고른 점은 맞지만 순서가 달라요. 점 ${it.q[0]}의 대응점부터 차례대로 눌러요.`;
      else if (it.k === "각" && got[1] !== it.a[1]) msg = `가운데 점은 각의 꼭짓점이에요. 점 ${it.q[1]}의 대응점이 가운데에 와야 해요.`;
      else msg = opt.bad || `${opt.how || "포개었을 때"} 겹치는 ${it.k === "점" ? "점" : it.k === "변" ? "변" : "각"}을 다시 찾아봐요.`;
      api.fail(msg, `${it.k} ${it.q}→${got}`);
      show();
    }
  }
  const side = sy3Side(h("p", { class: "sy3small" }, opt.tip || "꼭짓점을 눌러 골라요. 마지막에 누른 점을 한 번 더 누르면 취소돼요."), prompt, selR,
    sy3Tools(h("button", { onclick: () => { sel = []; show(); } }, "다시 고르기")), list);
  if (opt.demo) {
    const d = opt.demo, src = opt.shapes[d.from || 0], parts = src.parts || [sy3P(src.P)];
    let running = false;
    const run = () => {
      if (running) return; running = true; demoG.innerHTML = "";
      const g = svgEl("g"); demoG.append(g); sy3DrawParts(g, parts, m, { fill: "#F7E7A6", stroke: SY3.org, dash: "8 5", op: .6 });
      const c = sy3Cen(parts);
      const at = d.type === "fold" ? t => sy3FoldAt(d.p, d.q, t) : d.type === "rot" ? t => sy3Rot(d.c, (d.deg || 180) * t) : t => sy3MapAt(d.A, c, t);
      sy3Anim(1300, t => g.setAttribute("transform", sy3PxM(at(t), m)), () => {
        const F = at(1);
        if (src.P && src.names) src.P.forEach((p, i) => { const q = sy3Ap(F, p), C = sy3Cen([sy3P(src.P.map(x => sy3Ap(F, x)))]), u = [C[0] - q[0], C[1] - q[1]], L = Math.hypot(...u) || 1, a = m(q); demoG.append(txt(sy3R(a[0] + u[0] / L * 20), sy3R(a[1] + u[1] / L * 20), src.names[i], 16, { fill: SY3.org, "font-weight": "bold" })); });
        running = false;
      });
    };
    side.append(sy3Tools(h("button", { onclick: run }, opt.demoText || "포개어 보기"), h("button", { onclick: () => { demoG.innerHTML = ""; } }, "지우기")));
  }
  api.provide({ words: ["대응점", "대응변", "대응각", "대응점의 순서"], answers: items.map(x => `${x.k} ${x.q} ↔ ${x.k} ${x.a}`) });
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  sy3Layout(body, svg, side);
  show();
}

/* =========================================================
   4. 재어 보기 — 변(선분)을 누르면 자로, 각을 누르면 각도기로 잰 값이 나와요
   opt: 그림 + segs:[{n:"ㄱㄴ", w:"변"|"선분"}], angs:["ㄱㄴㄷ"], unit:"cm"|"칸", per, dec, pts, tip, ask, ok
   ========================================================= */
function sy3Measure(body, api, opt) {
  const { svg, m } = sy3Setup(opt);
  sy3Paint(svg, m, Object.assign({}, opt, { segs: [] }));
  const N = Object.assign(sy3NamePts(opt.shapes), opt.pts || {}), unit = opt.unit || "cm", per = opt.per || 1, dec = opt.dec == null ? 1 : opt.dec;
  const resG = svgEl("g", { "pointer-events": "none" }), hitG = svgEl("g"); svg.append(resG, hitG);
  const segs = (opt.segs || []).map(s => typeof s === "string" ? { n: s } : s), angs = opt.angs || [];
  const got = new Map(), list = h("ul", { class: "sy3list" });
  const total = segs.length + angs.length;
  const lenOf = n => dist({ x: N[n[0]][0], y: N[n[0]][1] }, { x: N[n[1]][0], y: N[n[1]][1] }) * per;
  const angOf = n => sy3AngVal(N[n[1]], N[n[0]], N[n[2]]);
  const fin = () => {
    if (got.size === total && !fin.d) { fin.d = true; api.tryOnce(); sy3Finish(body, api, opt, [...got.values()].join(" / "), opt.doneMsg || "모두 재었어요!"); }
  };
  const reL = () => { list.innerHTML = ""; [...segs.map(s => (s.w || "변") + " " + s.n), ...angs.map(a => "각 " + a)].forEach(k => list.append(h("li", { class: got.has(k) ? "sy3ok" : "" }, got.has(k) ? got.get(k) : k + " : ?"))); };
  segs.forEach(s => {
    const a = m(N[s.n[0]]), b = m(N[s.n[1]]), key = (s.w || "변") + " " + s.n;
    const hit = svgEl("line", { x1: sy3R(a[0]), y1: sy3R(a[1]), x2: sy3R(b[0]), y2: sy3R(b[1]), stroke: "rgba(43,123,214,0.08)", "stroke-width": 18, "stroke-linecap": "round", class: "sy3hit" });
    hit.addEventListener("click", () => {
      if (got.has(key)) return; const v = sy3F(lenOf(s.n), dec);
      sy3Line(resG, m, N[s.n[0]], N[s.n[1]], { color: SY3.org, w: 4.5 });
      sy3Lab(resG, m, N[s.n[0]], N[s.n[1]], `${v}${unit === "칸" ? "칸" : " " + unit}`, { c: s.c || opt.cen || sy3Cen(opt.shapes[0].parts || [sy3P(opt.shapes[0].P)]), color: SY3.org, d: s.d || 18, flip: s.flip, size: 16 });
      got.set(key, `${key} : ${v}${unit === "칸" ? "칸" : " " + unit}`); reL(); fin();
    });
    hitG.append(hit);
  });
  angs.forEach(n => {
    const V = N[n[1]], A = N[n[0]], B = N[n[2]], key = "각 " + n;
    const a1 = Math.atan2(A[1] - V[1], A[0] - V[0]), a2 = Math.atan2(B[1] - V[1], B[0] - V[0]); let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const mid = a1 + d / 2, P = m(V), c = svgEl("circle", { cx: sy3R(P[0] + Math.cos(mid) * 26), cy: sy3R(P[1] + Math.sin(mid) * 26), r: 15, fill: "rgba(228,122,56,0.12)", stroke: "rgba(228,122,56,0.5)", "stroke-width": 1.5, class: "sy3hit" });
    c.addEventListener("click", () => {
      if (got.has(key)) return; const v = Math.round(angOf(n));
      sy3Arc(resG, m, V, A, B, v + "°", { color: SY3.purple, r: 22, tr: 19 });
      got.set(key, `${key} : ${v}°`); reL(); fin();
    });
    hitG.append(c);
  });
  api.provide({ words: ["자", "각도기", "대응변", "대응각"], answers: [] });
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  sy3Layout(body, svg, sy3Side(h("p", { class: "sy3small" }, opt.tip || "변(선분)을 누르면 길이를, 꼭짓점 안쪽의 동그라미를 누르면 각의 크기를 재어 줘요."), list));
  reL();
}

/* 직선 비교용 열쇠 */
function sy3LineKey(p, q) {
  let a = Math.atan2(q[1] - p[1], q[0] - p[0]); a = ((a % Math.PI) + Math.PI) % Math.PI; if (Math.abs(a - Math.PI) < 1e-6) a = 0;
  const nx = -Math.sin(a), ny = Math.cos(a), d = p[0] * nx + p[1] * ny;
  return (Math.round(a * 180 / Math.PI * 10) / 10) + ":" + sy3K2(d);
}
/* 눌러서 고를 수 있는 점: 모눈(반 칸 포함)·꼭짓점·변의 가운데·원의 중심 */
function sy3KeyPts(parts, box, half = true) {
  const out = [], s = half ? .5 : 1;
  for (let x = Math.ceil(box[0] / s) * s; x <= box[2] + 1e-9; x += s) for (let y = Math.ceil(box[1] / s) * s; y <= box[3] + 1e-9; y += s) out.push([sy3R(x), sy3R(y)]);
  parts.forEach(pt => {
    if (pt.t === "p") pt.P.forEach((p, i) => { const q = pt.P[(i + 1) % pt.P.length]; out.push(p, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]); });
    if (pt.t === "c") out.push(pt.c);
  });
  if (parts.length) out.push(sy3Cen(parts));
  return out;
}
const sy3Near = (pts, u) => { let b = null, bd = 1e9; pts.forEach(p => { const d = Math.hypot(p[0] - u[0], p[1] - u[1]); if (d < bd) { bd = d; b = p; } }); return b; };
function sy3ItemTabs(items, onPick) {
  const nm = it => it.name || "도형 " + it.label, bs = items.map((it, i) => h("button", { onclick: () => onPick(i) }, nm(it)));
  return { el: sy3Tools(...bs), set(i, mark) { bs.forEach((b, k) => b.classList.toggle("sy3on", k === i)); }, ok(i, t) { bs[i].textContent = nm(items[i]) + (t ? " " + t : ""); } };
}

/* =========================================================
   5. 접어 보기 — given: 주어진 선을 따라 접기 / find: 두 점을 눌러 직선을 긋고 접어 보며 대칭축 찾기
   opt: {items:[{label, parts, box:[x0,y0,x1,y1], line:[p,q], axes:[[p,q]…](그림일 때)}], mode, k, need:{label: 수 | "inf"}, anyAxis, tip, ask, ok}
   ========================================================= */
function sy3Fold(body, api, opt) {
  const items = opt.items, mode = opt.mode || "find", found = items.map(() => []), folded = items.map(() => false);
  let cur = 0, pts = [], busy = false, done = false;
  const main = h("div", { class: "sy3main" }), read = h("div", { class: "sy3read" }), list = h("ul", { class: "sy3list" });
  const tabs = items.length > 1 ? sy3ItemTabs(items, i => { if (!busy) { cur = i; pts = []; render(); } }) : null;
  let svg, m, lineG, copyG, foundG, it, kp;
  const isPic = x => x.parts.some(p => p.t === "pic");
  const needOf = i => { const n = opt.need && opt.need[items[i].label]; return n === "inf" ? 3 : (n || 0); };
  function render() {
    it = items[cur];
    const S = sy3Setup({ box: it.box, k: it.k || opt.k || 34, maxW: opt.maxW || "30em" }); svg = S.svg; m = S.m;
    sy3Paint(svg, m, { box: it.box, grid: it.grid !== false, shapes: [] });
    sy3DrawParts(svg, it.parts, m);
    foundG = svgEl("g", { "pointer-events": "none" }); copyG = svgEl("g", { "pointer-events": "none" }); lineG = svgEl("g", { "pointer-events": "none" });
    svg.append(foundG, copyG, lineG);
    kp = it.keyPts || sy3KeyPts(isPic(it) ? [] : it.parts, it.box, opt.half !== false);
    found[cur].forEach(L => sy3Line(foundG, m, L[0], L[1], { color: SY3.green, w: 3, ext: 30, dash: "10 6" }));
    if (mode === "given") { sy3Line(lineG, m, it.line[0], it.line[1], { color: SY3.red, w: 3, ext: 30, dash: "10 6" }); }
    svg.style.touchAction = "none";
    svg.addEventListener("click", e => {
      if (mode !== "find" || busy || done) return;
      const u = sy3Un(m, svgPt(svg, e)), p = sy3Near(kp, u);
      if (pts.length >= 2) pts = [];
      if (pts.length === 1 && Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]) < 1e-6) return;
      pts.push(p); copyG.innerHTML = ""; drawLine();
    });
    main.innerHTML = ""; main.append(svg);
    if (tabs) tabs.set(cur);
    drawLine(); status();
  }
  function drawLine() {
    lineG.innerHTML = "";
    if (mode === "given") { sy3Line(lineG, m, it.line[0], it.line[1], { color: SY3.red, w: 3, ext: 30, dash: "10 6" }); return; }
    pts.forEach(p => sy3Dot(lineG, m, p, { r: 6, color: SY3.red }));
    if (pts.length === 2) sy3Line(lineG, m, pts[0], pts[1], { color: SY3.red, w: 3, ext: 30, dash: "10 6" });
  }
  function status() {
    if (mode === "given") read.textContent = folded[cur] ? "주어진 선을 따라 접었더니 완전히 겹쳐요!" : "‘선을 따라 접기’를 눌러 보세요.";
    else read.textContent = pts.length < 2 ? "도형 위나 둘레의 두 점을 눌러 접을 직선을 그어요." : "‘접어 보기’를 눌러 완전히 겹치는지 확인해요.";
    list.innerHTML = "";
    items.forEach((x, i) => {
      const n = found[i].length, nd = needOf(i);
      const t = mode === "given" ? (folded[i] ? "접어 봄 ✓" : "") : (n ? `대칭축 ${n}개 찾음` + (nd && n >= nd ? " ✓" : "") : (nd ? "" : ""));
      list.append(h("li", { class: (mode === "given" ? folded[i] : (nd ? n >= nd : false)) ? "sy3ok" : (i === cur ? "sy3cur" : "") }, (x.name || `도형 ${x.label}`) + (t ? " — " + t : "")));
      if (tabs) tabs.ok(i, mode === "given" ? (folded[i] ? "✓" : "") : (n ? `(${n})` : ""));
    });
  }
  function check() {
    const ok = mode === "given" ? folded.every(Boolean) : items.every((x, i) => found[i].length >= needOf(i));
    if (ok && !done) { done = true; api.tryOnce(); btn.disabled = true; sy3Finish(body, api, opt, items.map((x, i) => `${x.label}:${mode === "given" ? "접음" : found[i].length}`).join(" "), opt.doneMsg || "잘 접어 보았어요!"); }
  }
  function fold() {
    if (busy || done) return;
    const L = mode === "given" ? it.line : pts;
    if (!L || L.length < 2) { read.textContent = "먼저 두 점을 눌러 직선을 그어요."; return; }
    busy = true; copyG.innerHTML = "";
    const g = svgEl("g"); copyG.append(g); sy3DrawParts(g, it.parts, m, { op: .55, stroke: SY3.org, dash: "8 5" });
    const p = L[0], q = L[1];
    sy3Anim(1100, t => g.setAttribute("transform", sy3PxM(sy3FoldAt(p, q, t), m)), () => {
      busy = false;
      let same;
      if (isPic(it)) { const k = sy3LineKey(p, q); same = opt.anyAxis ? (it.axes || []).some(a => sy3LineKey(a[0], a[1]) === k) : (it.axes || []).some(a => sy3LineKey(a[0], a[1]) === k); }
      else same = sy3Key(sy3XPs(it.parts, sy3Refl(p, q)), true) === sy3Key(it.parts, true);
      if (mode === "given") { folded[cur] = true; read.textContent = same ? "주어진 선을 따라 접었더니 완전히 겹쳐요!" : "겹치지 않는 부분이 있어요."; status(); check(); return; }
      if (same) {
        const k = sy3LineKey(p, q);
        if (found[cur].some(L2 => sy3LineKey(L2[0], L2[1]) === k)) { read.textContent = "완전히 겹쳐요. 이미 찾은 직선이에요. 다른 직선도 찾아봐요."; }
        else {
          found[cur].push([p, q]); sy3Line(foundG, m, p, q, { color: SY3.green, w: 3, ext: 30, dash: "10 6" });
          const n = found[cur].length, nd = needOf(cur);
          read.textContent = `완전히 겹쳐요! 이 직선을 따라 접을 수 있어요. (${it.name || "도형 " + it.label}: ${n}개)` + (opt.need && opt.need[it.label] === "inf" && n >= 3 ? " 원은 중심을 지나는 직선이면 어느 것이든 돼요." : nd && n < nd ? " 또 있는지 찾아봐요." : "");
        }
        pts = []; drawLine(); status(); check();
      } else {
        read.textContent = "완전히 겹치지 않아요. 다른 직선으로 접어 보세요.";
        setTimeout(() => { if (!busy) copyG.innerHTML = ""; }, 1600);
      }
    });
  }
  const btn = h("button", { class: "big", onclick: fold }, mode === "given" ? "선을 따라 접기" : "접어 보기");
  const side = sy3Side(h("p", { class: "sy3small" }, opt.tip || (mode === "given" ? "도형을 고르고 주어진 선을 따라 접어 보세요." : "두 점을 눌러 직선을 긋고 ‘접어 보기’를 눌러요. 흐린 그림이 접힌 모습이에요.")), ...(tabs ? [tabs.el] : []), read, h("div", {}, btn), list);
  api.provide({ words: ["접기", "완전히 겹쳐요", "선대칭도형", "대칭축"], answers: [] });
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  body.append(h("div", { class: "sy3row" }, main, side));
  render();
}

/* =========================================================
   6. 돌려 보기 — given: 정해진 점을 중심으로 90°·180° 돌리기 / find: 점을 찍고 180° 돌려 대칭의 중심 찾기
   opt: {items:[{label, parts, box, center}], mode, need:[label…](find), only180, cName, tip, ask, ok}
   ========================================================= */
function sy3Spin(body, api, opt) {
  const items = opt.items, mode = opt.mode || "given", st = items.map(() => ({ ang: 0, saw90: false, ok180: false, found: false }));
  let cur = 0, cpt = null, busy = false, done = false, svg, m, copyG, cG, it, kp;
  const main = h("div", { class: "sy3main" }), read = h("div", { class: "sy3read" }), list = h("ul", { class: "sy3list" });
  const tabs = items.length > 1 ? sy3ItemTabs(items, i => { if (!busy) { cur = i; cpt = null; render(); } }) : null;
  const cName = opt.cName || "ㅇ";
  function render() {
    it = items[cur];
    const S = sy3Setup({ box: it.box, k: it.k || opt.k || 34, maxW: opt.maxW || "30em" }); svg = S.svg; m = S.m;
    sy3Paint(svg, m, { box: it.box, grid: it.grid !== false, shapes: [] });
    sy3DrawParts(svg, it.parts, m);
    copyG = svgEl("g", { "pointer-events": "none" }); cG = svgEl("g", { "pointer-events": "none" }); svg.append(copyG, cG);
    kp = sy3KeyPts(it.parts, it.box, true);
    svg.addEventListener("click", e => {
      if (mode !== "find" || busy || done || st[cur].found) return;
      cpt = sy3Near(kp, sy3Un(m, svgPt(svg, e))); copyG.innerHTML = ""; drawC(); read.textContent = "‘180° 돌려 보기’를 눌러요.";
    });
    main.innerHTML = ""; main.append(svg); if (tabs) tabs.set(cur);
    if (mode === "given") { cpt = it.center; st[cur].ang = 0; }
    else if (st[cur].found) cpt = sy3Cen(it.parts);
    drawC(); status();
  }
  function drawC() { cG.innerHTML = ""; if (!cpt) return; sy3Dot(cG, m, cpt, { r: 6, color: st[cur].found ? SY3.green : SY3.red }); const a = m(cpt); cG.append(txt(sy3R(a[0] + 15), sy3R(a[1] - 15), cName, 18, { fill: SY3.red, "font-weight": "bold" })); }
  function status() {
    const s = st[cur];
    if (mode === "given") read.textContent = s.ang === 0 ? `점 ${sy3Jo(cName, "을/를")} 중심으로 돌려 보세요.` : read.textContent;
    else if (!cpt) read.textContent = "대칭의 중심이 될 만한 점을 눌러요.";
    list.innerHTML = "";
    items.forEach((x, i) => {
      const s2 = st[i], t = mode === "given" ? [s2.saw90 ? "90° ✗" : "", s2.ok180 ? "180° ✓" : ""].filter(Boolean).join(" · ") : (s2.found ? "대칭의 중심을 찾음 ✓" : "");
      const ok = mode === "given" ? (s2.ok180 && (opt.only180 || s2.saw90)) : s2.found;
      list.append(h("li", { class: ok ? "sy3ok" : (i === cur ? "sy3cur" : "") }, (x.name || `도형 ${x.label}`) + (t ? " — " + t : "")));
      if (tabs) tabs.ok(i, ok ? "✓" : "");
    });
  }
  function check() {
    const ok = mode === "given" ? st.every(s => s.ok180 && (opt.only180 || s.saw90)) : (opt.need || []).every(l => st[items.findIndex(x => x.label === l)].found);
    if (ok && !done) { done = true; api.tryOnce(); btns.forEach(b => b.disabled = true); sy3Finish(body, api, opt, mode === "given" ? "90°에는 겹치지 않고 180°에 겹침" : "대칭의 중심: " + items.filter((x, i) => st[i].found).map(x => x.label).join(", "), opt.doneMsg || "잘 돌려 보았어요!"); }
  }
  function turn(deg) {
    if (busy || done) return;
    if (!cpt) { read.textContent = "먼저 중심이 될 점을 눌러요."; return; }
    const s = st[cur], a0 = mode === "given" ? s.ang : 0;
    busy = true; copyG.innerHTML = "";
    const g = svgEl("g"); copyG.append(g); sy3DrawParts(g, it.parts, m, { op: .55, stroke: SY3.org, dash: "8 5", fill: "#F7E7A6" });
    sy3Anim(900 * deg / 90 * .7, t => g.setAttribute("transform", sy3PxM(sy3Rot(cpt, a0 + deg * t), m)), () => {
      busy = false; const ang = ((a0 + deg) % 360 + 360) % 360;
      const same = sy3Key(sy3XPs(it.parts, sy3Rot(cpt, ang)), true) === sy3Key(it.parts, true);
      if (mode === "given") {
        s.ang = ang;
        if (ang % 180 === 90) s.saw90 = true;
        if (ang === 180 && same) s.ok180 = true;
        read.textContent = ang === 0 ? "한 바퀴(360°) 돌아 처음 자리로 왔어요." : `처음부터 ${ang}° 돌렸어요. ` + (same ? "처음 도형과 완전히 겹쳐요!" : "처음 도형과 겹치지 않아요.");
      } else {
        if (same) { s.found = true; read.textContent = `완전히 겹쳐요! 이 점이 도형 ${it.label}의 대칭의 중심이에요.`; drawC(); }
        else { read.textContent = "완전히 겹치지 않아요. 다른 점을 중심으로 돌려 보세요."; setTimeout(() => { if (!busy) copyG.innerHTML = ""; }, 1600); }
      }
      status(); check();
    });
  }
  const btns = mode === "given" ? [h("button", { class: "big", onclick: () => turn(90) }, "90° 돌리기"), h("button", { class: "big", onclick: () => turn(180) }, "180° 돌리기")] : [h("button", { class: "big", onclick: () => turn(180) }, "180° 돌려 보기")];
  if (mode === "given") btns.push(h("button", { class: "ghost", onclick: () => { if (busy) return; st[cur].ang = 0; copyG.innerHTML = ""; read.textContent = "처음 모양으로 돌아왔어요."; } }, "처음으로"));
  const side = sy3Side(h("p", { class: "sy3small" }, opt.tip || (mode === "given" ? `흐린 그림이 점 ${sy3Jo(cName, "을/를")} 중심으로 돌린 모습이에요. 돌린 각도는 처음부터 더해져요.` : "점을 하나 눌러 중심으로 정하고 180° 돌려 보세요.")), ...(tabs ? [tabs.el] : []), read, h("div", { class: "sy3tools" }, ...btns), list);
  api.provide({ words: ["180°", "완전히 겹쳐요", "점대칭도형", "대칭의 중심"], answers: [] });
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  body.append(h("div", { class: "sy3row" }, main, side));
  render();
}

/* =========================================================
   7. 대응점끼리 잇기 → 만나는 점(대칭의 중심) 찾기
   opt: {box, k, P, names, pairs:[["ㄱ","ㄹ"]…], per, unit, ask, ok}
   ========================================================= */
function sy3Join(body, api, opt) {
  const { svg, m } = sy3Setup(opt), N = {}; opt.P.forEach((p, i) => N[opt.names[i]] = p);
  sy3Paint(svg, m, { box: opt.box, grid: opt.grid, shapes: [{ P: opt.P, names: opt.names, fill: opt.fill || SY3.f5 }] });
  const segG = svgEl("g", { "pointer-events": "none" }), hitG = svgEl("g"); svg.append(segG, hitG);
  const C = sy3Cen([sy3P(opt.P)]), per = opt.per || 1, unit = opt.unit || "cm";
  let sel = null, joined = [], phase = 0, done = false;
  const read = h("div", { class: "sy3read" }, "대응점끼리 선분으로 이어요. 두 점을 차례로 눌러요."), list = h("ul", { class: "sy3list" });
  opt.names.forEach(n => {
    const a = m(N[n]), c = svgEl("circle", { cx: sy3R(a[0]), cy: sy3R(a[1]), r: 18, fill: "rgba(43,123,214,0.06)", stroke: "rgba(43,123,214,0.35)", "stroke-width": 1.5, class: "sy3hit" });
    c.addEventListener("click", e => { e.stopPropagation(); tapV(n); }); hitG.append(c);
  });
  const isPair = (a, b) => opt.pairs.some(p => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a));
  function tapV(n) {
    if (done || phase) return;
    if (!sel) { sel = n; segG.append(sy3Dot(svgEl("g"), m, N[n], { r: 8, color: SY3.org })); redraw(); read.textContent = `점 ${n}의 대응점을 눌러요.`; return; }
    if (sel === n) { sel = null; redraw(); return; }
    api.tryOnce();
    if (isPair(sel, n) && !joined.some(j => isPair(j[0], j[1]) && (j.includes(n)))) {
      joined.push([sel, n]); list.append(h("li", { class: "sy3ok" }, `선분 ${sel}${n} ✓`)); sel = null; redraw();
      if (joined.length === opt.pairs.length) { phase = 1; read.textContent = "세 선분이 한 점에서 만나요. 만나는 점을 눌러 보세요."; }
      else read.textContent = "잘 이었어요. 다른 대응점끼리도 이어요.";
    } else { api.fail(`점 ${sy3Jo(sel, "과/와")} 점 ${n}은 대응점이 아니에요. 180° 돌렸을 때 겹치는 점끼리 이어요.`, sel + n); sel = null; redraw(); read.textContent = "대응점끼리 선분으로 이어요. 두 점을 차례로 눌러요."; }
  }
  function redraw() {
    segG.innerHTML = "";
    joined.forEach(j => sy3Line(segG, m, N[j[0]], N[j[1]], { color: SY3.blue, w: 2.6 }));
    if (sel) sy3Dot(segG, m, N[sel], { r: 8, color: SY3.org });
    if (phase >= 2) {
      sy3Dot(segG, m, C, { r: 6, color: SY3.red }); const a = m(C); segG.append(txt(sy3R(a[0] + 16), sy3R(a[1] - 14), opt.cName || "ㅇ", 18, { fill: SY3.red, "font-weight": "bold" }));
    }
  }
  svg.addEventListener("click", e => {
    if (done || phase !== 1) return;
    const u = sy3Un(m, svgPt(svg, e));
    if (Math.hypot(u[0] - C[0], u[1] - C[1]) * m.k > 26) { read.textContent = "세 선분이 모두 지나는 점을 눌러요."; return; }
    phase = 2; redraw(); read.textContent = "점 ㅇ을 표시했어요. 점 ㅇ을 중심으로 180° 돌려 확인해요.";
    const g = svgEl("g", { "pointer-events": "none" }); svg.insertBefore(g, segG); sy3DrawParts(g, [sy3P(opt.P)], m, { op: .5, stroke: SY3.org, dash: "8 5", fill: "#F7E7A6" });
    sy3Anim(1300, t => g.setAttribute("transform", sy3PxM(sy3Rot(C, 180 * t), m)), () => {
      read.textContent = "180° 돌렸더니 처음 도형과 완전히 겹쳐요. 점 ㅇ은 대칭의 중심이에요. 잘린 선분의 길이를 재었어요.";
      joined.forEach(j => { [j[0], j[1]].forEach(n => { sy3Lab(segG, m, N[n], C, `${sy3F(dist({ x: N[n][0], y: N[n][1] }, { x: C[0], y: C[1] }) * per, opt.dec == null ? 1 : opt.dec)} ${unit}`, { color: SY3.org, d: 14, size: 15 }); }); });
      done = true; api.tryOnce(); sy3Finish(body, api, opt, "대칭의 중심 ㅇ", "대칭의 중심을 찾았어요!");
    });
  });
  api.provide({ words: ["대응점", "대칭의 중심", "똑같이 둘로"], answers: [] });
  sy3Layout(body, svg, sy3Side(h("p", { class: "sy3small" }, opt.tip || "대응점끼리 이은 선분이 만나는 점을 찾아봐요."), read, list));
}

/* =========================================================
   8. 완성하기 — 대응점을 모눈에 찍어 선대칭도형(line)·점대칭도형(point)을 완성해요
   opt: {box|cols,rows, k, mode, axis:[p,q], axisNames:[위,아래], center, cName, pts:{이름:[x,y]}, drawn:[["ㄱ","ㄴ"]…],
         miss:[{n, of, A?}], poly:[이름…], guide, tip, ask, ok}
   ========================================================= */
function sy3Complete(body, api, opt) {
  const { svg, m } = sy3Setup(opt), box = opt.box || [0, 0, opt.cols, opt.rows], line = opt.mode !== "point";
  sy3Paint(svg, m, { box, shapes: [] });
  const P = Object.assign({}, opt.pts), X = line ? sy3Refl(opt.axis[0], opt.axis[1]) : sy3Rot(opt.center, 180);
  const want = {}; opt.miss.forEach(x => want[x.n] = (x.A ? sy3Ap(x.A, P[x.of]) : sy3Ap(X, P[x.of])).map(v => Math.round(v * 1000) / 1000));
  const guideG = svgEl("g", { "pointer-events": "none" }), baseG = svgEl("g", { "pointer-events": "none" }), stuG = svgEl("g", { "pointer-events": "none" }), animG = svgEl("g", { "pointer-events": "none" });
  svg.append(guideG, baseG, stuG, animG);
  const mid = [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2];
  if (line) { sy3Line(baseG, m, opt.axis[0], opt.axis[1], { color: SY3.red, w: 2.6, dash: "10 6" }); if (opt.axisNames) opt.axisNames.forEach((n, i) => { if (n) { const a = m(opt.axis[i]); baseG.append(txt(sy3R(a[0] + 15), sy3R(a[1] + (i ? 12 : -12)), n, 18, { fill: SY3.red })); } }); }
  (opt.lines2 || []).forEach(L => sy3Line(baseG, m, L[0], L[1], { color: SY3.red, w: 2.6, dash: "10 6" }));
  if (line) { } else { sy3Dot(baseG, m, opt.center, { r: 6, color: SY3.red }); const a = m(opt.center); baseG.append(txt(sy3R(a[0] + 15), sy3R(a[1] - 15), opt.cName || "ㅇ", 18, { fill: SY3.red, "font-weight": "bold" })); }
  (opt.drawn || []).forEach(([a, b]) => sy3Line(baseG, m, P[a], P[b], { color: SY3.ink, w: 3 }));
  const cenAll = (() => { const v = Object.values(P); return [v.reduce((s, p) => s + p[0], 0) / v.length, v.reduce((s, p) => s + p[1], 0) / v.length]; })();
  Object.entries(P).forEach(([n, p]) => { sy3Dot(baseG, m, p, { r: 4.5 }); const a = m(p), dx = p[0] - (line ? opt.axis[0][0] : cenAll[0]), dd = (opt.nameDir && opt.nameDir[n]) || [Math.abs(dx) < 1e-6 ? 0.7 : Math.sign(dx) * .8, -0.6]; baseG.append(txt(sy3R(a[0] + dd[0] * 18), sy3R(a[1] + dd[1] * 18), n, 18)); });
  const placed = {}; let curI = 0, done = false, showG = false;
  const chips = opt.miss.map((x, i) => h("button", { onclick: () => { curI = i; redraw(); } }, `점 ${x.n}`));
  const read = h("div", { class: "sy3read" });
  function redraw() {
    stuG.innerHTML = "";
    chips.forEach((b, i) => { b.classList.toggle("sy3on", i === curI); b.textContent = `점 ${opt.miss[i].n}` + (placed[opt.miss[i].n] ? " ✓" : ""); });
    const pos = n => P[n] || placed[n];
    if (opt.poly) { for (let i = 0; i < opt.poly.length; i++) { const a = opt.poly[i], b = opt.poly[(i + 1) % opt.poly.length]; if ((opt.drawn || []).some(d => (d[0] === a && d[1] === b) || (d[0] === b && d[1] === a))) continue; if (pos(a) && pos(b)) sy3Line(stuG, m, pos(a), pos(b), { color: SY3.org, w: 3 }); } }
    Object.entries(placed).forEach(([n, p]) => { sy3Dot(stuG, m, p, { r: 6, color: SY3.org }); const a = m(p); stuG.append(txt(sy3R(a[0] + 14), sy3R(a[1] - 14), n, 18, { fill: SY3.org, "font-weight": "bold" })); });
    const x = opt.miss[curI];
    read.textContent = x ? `점 ${x.n}(점 ${x.of}의 대응점)을 찍을 자리를 눌러요.` : "";
  }
  function guide() {
    guideG.innerHTML = ""; if (!showG) return;
    opt.miss.forEach(x => {
      const p = P[x.of], q = x.A ? sy3Ap(x.A, p) : sy3Ap(X, p);
      if (line) { const u = [q[0] - p[0], q[1] - p[1]], L = Math.hypot(...u); if (L < 1e-6) return; sy3Line(guideG, m, p, [p[0] + u[0] / L, p[1] + u[1] / L], { color: "#9FB3C8", w: 1.8, ext: 40, dash: "4 5" }); }
      else sy3Line(guideG, m, p, opt.center, { color: "#9FB3C8", w: 1.8, ext: 40, dash: "4 5" });
    });
  }
  svg.style.touchAction = "none";
  svg.addEventListener("click", e => {
    if (done) return; const u = sy3Un(m, svgPt(svg, e)), g = [Math.round(u[0]), Math.round(u[1])];
    if (g[0] < box[0] || g[0] > box[2] || g[1] < box[1] || g[1] > box[3]) return;
    const x = opt.miss[curI]; if (!x) return;
    placed[x.n] = g;
    const nxt = opt.miss.findIndex((y, i) => i > curI && !placed[y.n]); const any = opt.miss.findIndex(y => !placed[y.n]);
    curI = nxt >= 0 ? nxt : any >= 0 ? any : curI;
    redraw();
    if (opt.miss.every(y => placed[y.n])) read.textContent = "모두 찍었어요. ‘확인하기’를 눌러요.";
  });
  const check = h("button", { class: "big", onclick: () => {
    if (done) return;
    if (!opt.miss.every(y => placed[y.n])) { read.textContent = "찍지 않은 점이 있어요."; return; }
    api.tryOnce();
    const bad = opt.miss.find(y => Math.hypot(placed[y.n][0] - want[y.n][0], placed[y.n][1] - want[y.n][1]) > 1e-6);
    if (!bad) {
      done = true; check.disabled = true; chips.forEach(c => c.disabled = true);
      const all = Object.assign({}, P, placed);
      if (opt.poly) { const poly = opt.poly.map(n => all[n]); const e = sy3DrawPart(animG, sy3P(poly), m, { fill: "rgba(43,123,214,0.15)", stroke: SY3.blue, w: 3 }); e.setAttribute("stroke-dasharray", "none"); }
      const half = opt.half ? opt.half.map(n => all[n]) : null;
      if (half) {
        const g = svgEl("g"); animG.append(g); sy3DrawParts(g, [sy3P(half)], m, { op: .5, fill: "#F7E7A6", stroke: SY3.org, dash: "8 5" });
        sy3Anim(1200, t => g.setAttribute("transform", sy3PxM(line ? sy3FoldAt(opt.axis[0], opt.axis[1], t) : sy3Rot(opt.center, 180 * t), m)), () => {
          sy3Finish(body, api, opt, "완성", opt.doneMsg || (line ? "대칭축을 따라 접었더니 완전히 겹쳐요. 선대칭도형을 완성했어요!" : "대칭의 중심을 중심으로 180° 돌렸더니 완전히 겹쳐요. 점대칭도형을 완성했어요!"));
        });
      } else sy3Finish(body, api, opt, "완성", opt.doneMsg || "도형을 완성했어요!");
      read.textContent = "";
      return;
    }
    const p = P[bad.of], s = placed[bad.n];
    let msg;
    if (bad.A) msg = `점 ${bad.n}은 점 ${bad.of}의 대응점이에요. ${bad.how ? sy3Jo(bad.how, "을/를") + " 기준으로 " : ""}같은 거리만큼 떨어진 반대쪽에 찍어요.`;
    else if (line) {
      const a = opt.axis[0], b = opt.axis[1], u = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(...u), along = ((s[0] - p[0]) * u[0] + (s[1] - p[1]) * u[1]) / L;
      msg = Math.abs(along) > 1e-6 ? `점 ${bad.of}에서 대칭축에 수선을 긋고, 그 선 위에서 점 ${bad.n}을 찾아요. (대응점끼리 이은 선분은 대칭축과 수직으로 만나요.)` : `점 ${bad.of}에서 대칭축까지의 거리와 점 ${bad.n}에서 대칭축까지의 거리가 같아야 해요. 칸 수를 세어 봐요.`;
    } else {
      const c = opt.center, cr = (s[0] - c[0]) * (p[1] - c[1]) - (s[1] - c[1]) * (p[0] - c[0]);
      msg = Math.abs(cr) > 1e-6 ? `점 ${sy3Jo(bad.of, "과/와")} 대칭의 중심을 지나는 직선 위에서 점 ${bad.n}을 찾아요.` : `점 ${bad.of}에서 대칭의 중심까지의 거리와 점 ${bad.n}에서 대칭의 중심까지의 거리가 같아야 해요. 대칭의 중심의 반대쪽에 있어야 해요.`;
    }
    api.fail(msg, Object.entries(placed).map(([n, p2]) => `${n}(${p2.join(",")})`).join(" "));
  } }, "확인하기");
  const gb = h("button", { onclick: () => { showG = !showG; gb.classList.toggle("sy3on", showG); guide(); } }, line ? "도움선: 대칭축에 수선 긋기" : "도움선: 대칭의 중심을 지나는 직선");
  api.provide({ words: line ? ["대칭축", "수선", "같은 거리", "대응점"] : ["대칭의 중심", "지나는 직선", "같은 거리", "대응점"], answers: opt.miss.map(x => `점 ${x.n}: 점 ${x.of}의 대응점`) });
  const side = sy3Side(h("p", { class: "sy3small" }, opt.tip || "찍을 점을 고르고 모눈의 꼭짓점을 눌러요. 다시 누르면 자리를 옮길 수 있어요."), sy3Tools(...chips), read, ...(opt.guide === false ? [] : [sy3Tools(gb)]));
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  sy3Layout(body, svg, side);
  body.append(h("div", { class: "actions" }, check));
  redraw();
}

/* =========================================================
   9. 대칭 그리기판(공학 도구 대신) — ① 직선(대칭축) ② 선분 ③ 뒤집기 ④ 자
   opt: {cols, rows, k, axis(주어지면 고정), guide:[[p,q]…], need(선분 수), measure, needMeasure, tip, ask, ok}
   ========================================================= */
function sy3Mirror(body, api, opt) {
  const box = [0, 0, opt.cols, opt.rows], { svg, m } = sy3Setup(Object.assign({}, opt, { box }));
  sy3Paint(svg, m, { box, shapes: [] });
  const gdG = svgEl("g", { "pointer-events": "none" }), axG = svgEl("g", { "pointer-events": "none" }), sgG = svgEl("g", { "pointer-events": "none" }), tmpG = svgEl("g", { "pointer-events": "none" }), meG = svgEl("g", { "pointer-events": "none" });
  svg.append(gdG, axG, sgG, meG, tmpG);
  (opt.guide || []).forEach(([p, q]) => sy3Line(gdG, m, p, q, { color: "#A8B8C8", w: 5, dash: "3 7" }));
  if (opt.axisGuide) sy3Line(gdG, m, opt.axisGuide[0], opt.axisGuide[1], { color: "#F0B4B4", w: 4, dash: "3 7" });
  let axis = opt.axis || null, segs = [], tool = axis ? "seg" : "axis", pts = [], selSeg = -1, done = false, measured = new Set();
  const read = h("div", { class: "sy3read" }), list = h("ul", { class: "sy3list" });
  const TOOLS = [["axis", "① 직선(대칭축)"], ["seg", "② 선분"], ["flip", "③ 뒤집기"]].concat(opt.measure ? [["ruler", "④ 자"]] : []);
  const tb = TOOLS.map(([k, t]) => h("button", { onclick: () => { tool = k; pts = []; selSeg = -1; redraw(); } }, t));
  const segKey = (p, q) => [sy3PtK(p), sy3PtK(q)].sort().join("~");
  const distSeg = (u, p, q) => { const vx = q[0] - p[0], vy = q[1] - p[1], L2 = vx * vx + vy * vy; let t = L2 ? ((u[0] - p[0]) * vx + (u[1] - p[1]) * vy) / L2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(u[0] - p[0] - t * vx, u[1] - p[1] - t * vy); };
  const distLine = (u, p, q) => { const vx = q[0] - p[0], vy = q[1] - p[1], L = Math.hypot(vx, vy); return Math.abs((u[0] - p[0]) * vy - (u[1] - p[1]) * vx) / L; };
  function progress() {
    const orig = segs.filter(s => !s.mir);
    if (opt.guide) {
      return opt.guide.map(([p, q]) => { const s = orig.find(x => segKey(x.p, x.q) === segKey(p, q)); return s && s.flipped ? 2 : s ? 1 : 0; });
    }
    return orig.filter(s => s.flipped).length;
  }
  function status() {
    list.innerHTML = "";
    const pr = progress();
    list.append(h("li", { class: axis ? "sy3ok" : "" }, "대칭축 긋기" + (axis ? " ✓" : "")));
    if (opt.guide) pr.forEach((v, i) => list.append(h("li", { class: v === 2 ? "sy3ok" : "" }, `점선 ${i + 1}: ` + (v === 2 ? "선분 긋고 뒤집기 ✓" : v === 1 ? "선분 그음 → 뒤집기" : "선분 긋기"))));
    else list.append(h("li", { class: pr >= opt.need ? "sy3ok" : "" }, `선분을 긋고 뒤집기 ${pr}/${opt.need}` + (pr >= opt.need ? " ✓" : "")));
    if (opt.measure) list.append(h("li", { class: measured.size >= (opt.needMeasure || 2) ? "sy3ok" : "" }, `자로 대응변 재기 ${measured.size}/${opt.needMeasure || 2}`));
    const ok = axis && (opt.guide ? pr.every(v => v === 2) : pr >= opt.need) && (!opt.measure || measured.size >= (opt.needMeasure || 2));
    if (ok && !done) { done = true; api.tryOnce(); tb.forEach(b => b.disabled = true); undo.disabled = clr.disabled = true; sy3Finish(body, api, opt, `선분 ${segs.length}개`, opt.doneMsg || "선대칭도형을 그렸어요!"); }
  }
  function redraw() {
    tb.forEach((b, i) => b.classList.toggle("sy3on", TOOLS[i][0] === tool));
    axG.innerHTML = ""; sgG.innerHTML = ""; tmpG.innerHTML = "";
    if (axis) sy3Line(axG, m, axis[0], axis[1], { color: SY3.red, w: 2.6, ext: 40, dash: "10 6" });
    segs.forEach((s, i) => { sy3Line(sgG, m, s.p, s.q, { color: i === selSeg ? SY3.org : s.mir ? SY3.purple : SY3.blue, w: i === selSeg ? 5 : 3.4 }); sy3Dot(sgG, m, s.p, { r: 3.5 }); sy3Dot(sgG, m, s.q, { r: 3.5 }); });
    pts.forEach(p => sy3Dot(tmpG, m, p, { r: 6, color: SY3.org }));
    read.textContent = tool === "axis" ? "두 점을 눌러 대칭축으로 할 직선을 그어요." : tool === "seg" ? "대칭축의 한쪽에서 두 점을 눌러 선분을 그어요." : tool === "flip" ? (selSeg >= 0 ? "이제 대칭축(빨간 직선)을 눌러요." : "뒤집을 선분을 눌러요.") : "길이를 잴 선분을 눌러요.";
  }
  svg.style.touchAction = "none";
  svg.addEventListener("click", e => {
    if (done) return;
    const u = sy3Un(m, svgPt(svg, e)), g = [Math.max(0, Math.min(opt.cols, Math.round(u[0]))), Math.max(0, Math.min(opt.rows, Math.round(u[1])))];
    if (tool === "axis") {
      if (opt.axis) { read.textContent = "이 그리기판은 대칭축이 이미 그어져 있어요."; return; }
      pts.push(g); if (pts.length === 2) { if (sy3PtK(pts[0]) === sy3PtK(pts[1])) { pts = [pts[0]]; return; } if (opt.axisGuide && sy3LineKey(pts[0], pts[1]) !== sy3LineKey(opt.axisGuide[0], opt.axisGuide[1])) { pts = []; redraw(); read.textContent = "분홍 점선 위의 두 점을 눌러 대칭축을 그어요."; return; } axis = pts; pts = []; segs = segs.filter(s => !s.mir); segs.forEach(s => s.flipped = false); tool = "seg"; status(); }
      redraw(); return;
    }
    if (tool === "seg") {
      pts.push(g); if (pts.length === 2) { if (sy3PtK(pts[0]) === sy3PtK(pts[1])) { pts = [pts[0]]; return; } segs.push({ p: pts[0], q: pts[1] }); pts = []; status(); }
      redraw(); return;
    }
    if (tool === "flip") {
      if (!axis) { read.textContent = "먼저 ① 직선으로 대칭축을 그어요."; return; }
      if (selSeg < 0) {
        let bi = -1, bd = .4; segs.forEach((s, i) => { const d = distSeg(u, s.p, s.q); if (d < bd && !s.mir) { bd = d; bi = i; } });
        if (bi < 0) { read.textContent = "뒤집을 선분(파란 선)을 정확히 눌러요."; return; }
        if (segs[bi].flipped) { read.textContent = "이미 뒤집은 선분이에요. 다른 선분을 골라요."; return; }
        selSeg = bi; redraw(); return;
      }
      if (distLine(u, axis[0], axis[1]) > .45) { read.textContent = "대칭축(빨간 직선)을 눌러요."; return; }
      const R = sy3Refl(axis[0], axis[1]), s = segs[selSeg];
      segs.push({ p: sy3Ap(R, s.p).map(sy3R), q: sy3Ap(R, s.q).map(sy3R), mir: true, of: selSeg }); s.flipped = true; s.mirI = segs.length - 1; selSeg = -1;
      redraw(); status(); return;
    }
    if (tool === "ruler") {
      let bi = -1, bd = .4; segs.forEach((s, i) => { const d = distSeg(u, s.p, s.q); if (d < bd) { bd = d; bi = i; } });
      if (bi < 0) return;
      const s = segs[bi], o = s.mir ? segs[s.of] : (s.mirI != null ? segs[s.mirI] : null);
      [s, o].forEach(x => { if (!x) return; const L = Math.hypot(x.q[0] - x.p[0], x.q[1] - x.p[1]); sy3Lab(meG, m, x.p, x.q, sy3F(L, 1) + "칸", { color: SY3.org, d: 14, size: 15 }); });
      if (o) { measured.add(s.mir ? s.of : bi); read.textContent = `대응변끼리 길이가 ${sy3F(Math.hypot(s.q[0] - s.p[0], s.q[1] - s.p[1]), 1)}칸으로 같아요.`; }
      else read.textContent = "이 선분은 아직 뒤집지 않았어요.";
      status();
    }
  });
  const undo = h("button", { onclick: () => { if (done || !segs.length) return; const s = segs.pop(); if (s.mir && segs[s.of]) { segs[s.of].flipped = false; segs[s.of].mirI = null; } meG.innerHTML = ""; selSeg = -1; redraw(); status(); } }, "한 단계 되돌리기");
  const clr = h("button", { onclick: () => { if (done) return; segs = []; meG.innerHTML = ""; measured.clear(); selSeg = -1; pts = []; if (!opt.axis) axis = null; tool = axis ? "seg" : "axis"; redraw(); status(); } }, "모두 지우기");
  api.provide({ words: ["직선", "선분", "뒤집기", "대칭축", "대응변"], answers: [] });
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  sy3Layout(body, svg, sy3Side(h("p", { class: "sy3small" }, opt.tip || "도구를 고르고 모눈의 점을 눌러요. 파란 선은 내가 그은 선분, 보라 선은 뒤집어서 생긴 대응변이에요."), sy3Tools(...tb), read, list, sy3Tools(undo, clr)));
  redraw(); status();
}

/* =========================================================
   10. 대칭의 종류로 나누기 — 카드마다 선대칭도형만·점대칭도형만·둘 다·둘 다 아님을 골라요
   opt: {cards:[{label, parts, name}], cats:["L","P","B","N"], ans:{label:kind}(없으면 계산), ask, ok}
   ========================================================= */
const SY3_CATN = { L: "선대칭도형만", P: "점대칭도형만", B: "둘 다", N: "둘 다 아님" };
function sy3Mini(parts, w = 150, pad = .5) {
  const bb = sy3BBox(parts), bw = bb[2] - bb[0] + pad * 2, bh = bb[3] - bb[1] + pad * 2, k = Math.min(w / bw, w * .8 / bh);
  const svg = makeSvg(sy3R(bw * k), sy3R(bh * k)), m = sy3Map(k, (pad - bb[0]) * k, (pad - bb[1]) * k);
  sy3DrawParts(svg, parts, m, { w: Math.max(1.6, Math.min(2.6, k / 14)) }); return svg;
}
function sy3Sort(body, api, opt) {
  const cats = opt.cats || ["L", "P", "B", "N"], picked = {}, cardEls = {};
  const ans = {}; opt.cards.forEach(c => ans[c.label] = (opt.ans && opt.ans[c.label]) || sy3Kind(c.parts));
  const grid = h("div", { class: "sy3cards" });
  opt.cards.forEach(c => {
    const bs = cats.map(k => h("button", { onclick: () => { picked[c.label] = k; bs.forEach((b, i) => b.classList.toggle("sy3on", cats[i] === k)); card.classList.remove("sy3good", "sy3bad"); } }, opt.catN ? opt.catN[k] : SY3_CATN[k]));
    const card = h("div", { class: "sy3card" }, h("div", { class: "sy3nm" }, c.label + (c.name ? " " + c.name : "")), sy3Mini(c.parts, 140), h("div", { class: "sy3choice" }, ...bs));
    cardEls[c.label] = card; grid.append(card);
  });
  let done = false;
  const check = h("button", { class: "big", onclick: () => {
    if (done) return; api.tryOnce();
    let bad = null;
    opt.cards.forEach(c => { const ok = picked[c.label] === ans[c.label]; cardEls[c.label].classList.toggle("sy3good", ok); cardEls[c.label].classList.toggle("sy3bad", !ok); if (!ok && !bad) bad = c; });
    const got = opt.cards.map(c => `${c.label}:${picked[c.label] ? SY3_CATN[picked[c.label]] : "-"}`).join(" ");
    if (!bad) { done = true; check.disabled = true; return sy3Finish(body, api, opt, got, opt.doneMsg || "모두 알맞게 나누었어요!"); }
    if (!picked[bad.label]) return api.fail(`${bad.label}${bad.name ? " " + bad.name : ""}도 골라 주세요.`, got);
    const k = ans[bad.label], p = picked[bad.label];
    const why = (k === "L" || k === "B") && !(p === "L" || p === "B") ? "한 직선을 따라 접으면 완전히 겹치는지 다시 살펴봐요."
      : (k === "P" || k === "B") && !(p === "P" || p === "B") ? "어떤 점을 중심으로 180° 돌리면 처음 모양과 완전히 겹치는지 다시 살펴봐요."
      : (p === "L" || p === "B") && !(k === "L" || k === "B") ? "어느 직선으로 접어도 완전히 겹치지 않아요." : "180° 돌리면 처음 모양과 겹치지 않아요.";
    api.fail(`빨간 테두리 카드를 다시 살펴봐요. ${bad.label}${bad.name ? " " + bad.name : ""}: ${why}`, got);
  } }, "확인하기");
  api.provide({ words: ["선대칭도형", "점대칭도형", "접기", "180° 돌리기"], answers: [opt.cards.map(c => `${c.label} ${SY3_CATN[ans[c.label]]}`).join(", ")] });
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  body.append(grid, h("div", { class: "actions" }, check));
}

/* =========================================================
   11. 미술관 둘러보기(1차시) — 작품을 하나씩 눌러 특징을 살펴봐요
   opt: {spots:[{id, name, say, draw(g)}], ask, ok}
   ========================================================= */
function sy3Museum(body, api, opt) {
  const W = 760, H = 330, svg = makeSvg(W, H); svg.setAttribute("class", "sy3fig"); svg.style.maxWidth = "40em";
  svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: 250, fill: "#F6EFE4" }), svgEl("rect", { x: 0, y: 250, width: W, height: 80, fill: "#E3D2BA" }));
  for (let x = 0; x < W; x += 76) svg.append(svgEl("line", { x1: x, y1: 250, x2: x - 40, y2: 330, stroke: "#D4BFA2", "stroke-width": 2 }));
  svg.append(txt(W / 2, 24, "미술관", 20, { fill: "#8A6E52" }));
  let fin = false;
  const seen = new Set(), read = h("div", { class: "sy3read" }, "작품을 하나씩 눌러 보세요."), list = h("ul", { class: "sy3list" });
  const n = opt.spots.length, fw = 128, gap = (W - n * fw) / (n + 1);
  opt.spots.forEach((s, i) => {
    const x = gap + i * (fw + gap), y = s.floor ? 258 : 52, fh = s.floor ? 62 : 150, g = svgEl("g", { class: "sy3hit" });
    if (!s.floor) g.append(svgEl("rect", { x: x - 6, y: y - 6, width: fw + 12, height: fh + 12, rx: 6, fill: "#B8915F" }), svgEl("rect", { x, y, width: fw, height: fh, fill: "#FFFDF8" }));
    else g.append(svgEl("rect", { x, y, width: fw, height: fh, rx: 8, fill: "rgba(255,255,255,0.25)" }));
    const inner = svgEl("g", { transform: `translate(${sy3R(x)} ${y})` }); s.draw(inner, fw, fh); g.append(inner);
    const lab = txt(sy3R(x + fw / 2), s.floor ? 248 : 228, s.name, 16, { fill: "#5B4632" }); g.append(lab);
    const ring = svgEl("rect", { x: x - 9, y: y - 9, width: fw + 18, height: fh + 18, rx: 9, fill: "none", stroke: "none", "stroke-width": 4 }); g.append(ring);
    g.addEventListener("click", () => {
      seen.add(s.id); ring.setAttribute("stroke", SY3.green);
      read.textContent = `${s.name}: ${s.say}`;
      list.innerHTML = ""; opt.spots.filter(t => seen.has(t.id)).forEach(t => list.append(h("li", { class: "sy3ok" }, `${t.name} — ${t.say}`)));
      if (seen.size === n && !fin) { fin = true; api.tryOnce(); sy3Finish(body, api, opt, "모두 둘러봄", opt.doneMsg || "미술관을 모두 둘러보았어요!"); }
    });
    svg.append(g);
  });
  api.provide({ words: ["모양", "크기", "똑같아요", "왼쪽과 오른쪽"], answers: [] });
  body.append(svg, read, list);
}

/* =========================================================
   12. 데칼코마니(1차시) — 왼쪽에 물감을 찍고 반으로 접었다 펴요
   opt: {cols(짝수), rows, k, need, ask, ok}
   ========================================================= */
function sy3Decal(body, api, opt) {
  const cols = opt.cols || 10, rows = opt.rows || 6, half = cols / 2, box = [0, 0, cols, rows], { svg, m } = sy3Setup({ box, k: opt.k || 44, maxW: "30em" });
  sy3Paint(svg, m, { box, shapes: [] });
  const paintG = svgEl("g"), foldG = svgEl("g", { "pointer-events": "none" }), lineG = svgEl("g", { "pointer-events": "none" });
  svg.append(paintG, foldG, lineG);
  sy3Line(lineG, m, [half, 0], [half, rows], { color: SY3.red, w: 3, dash: "10 6" });
  const COL = ["#E5533D", "#F2B33D", "#3D8FE5", "#5DAA4E", "#9A5BD6"], cells = new Map();
  let col = COL[0], folded = false, done = false;
  const pal = COL.map(c => { const b = h("button", { style: `background:${c};width:2.2em;height:2.2em;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px var(--line)`, "aria-label": "물감 색", onclick: () => { col = c; pal.forEach(x => x.style.boxShadow = "0 0 0 2px var(--line)"); b.style.boxShadow = "0 0 0 3px #2F4A5E"; } }); return b; });
  pal[0].style.boxShadow = "0 0 0 3px #2F4A5E";
  const read = h("div", { class: "sy3read" }, `접는 선 왼쪽 칸을 눌러 물감을 찍어요. (${opt.need || 5}칸 이상)`);
  const redraw = () => {
    paintG.innerHTML = "";
    cells.forEach((c, k) => { const [x, y] = k.split(",").map(Number); const a = m([x, y]); paintG.append(svgEl("rect", { x: sy3R(a[0] + 2), y: sy3R(a[1] + 2), width: m.k - 4, height: m.k - 4, rx: 10, fill: c })); if (folded) { const b = m([cols - 1 - x, y]); paintG.append(svgEl("rect", { x: sy3R(b[0] + 2), y: sy3R(b[1] + 2), width: m.k - 4, height: m.k - 4, rx: 10, fill: c, opacity: .85 })); } });
  };
  svg.addEventListener("click", e => {
    if (folded) return; const u = sy3Un(m, svgPt(svg, e)), x = Math.floor(u[0]), y = Math.floor(u[1]);
    if (x < 0 || y < 0 || y >= rows) return;
    if (x >= half) { read.textContent = "물감은 접는 선의 왼쪽에만 찍어요."; return; }
    const k = x + "," + y; cells.has(k) && cells.get(k) === col ? cells.delete(k) : cells.set(k, col); redraw();
    read.textContent = `물감을 ${cells.size}칸 찍었어요.`;
  });
  const fold = h("button", { class: "big", onclick: () => {
    if (done || folded) return;
    if (cells.size < (opt.need || 5)) { read.textContent = `물감을 ${opt.need || 5}칸 이상 찍어 봐요.`; return; }
    const g = svgEl("g"); foldG.append(g); cells.forEach((c, k) => { const [x, y] = k.split(",").map(Number); const a = m([x, y]); g.append(svgEl("rect", { x: sy3R(a[0] + 2), y: sy3R(a[1] + 2), width: m.k - 4, height: m.k - 4, rx: 10, fill: c, opacity: .8 })); });
    sy3Anim(1300, t => g.setAttribute("transform", sy3PxM(sy3FoldAt([half, 0], [half, rows], t), m)), () => {
      foldG.innerHTML = ""; folded = true; redraw(); done = true; api.tryOnce();
      read.textContent = "종이를 펼쳤더니 접는 선의 오른쪽에도 똑같은 무늬가 생겼어요!";
      sy3Finish(body, api, opt, `물감 ${cells.size}칸`, opt.doneMsg || "데칼코마니 작품을 만들었어요!");
    });
  } }, "반으로 접었다 펴기");
  api.provide({ words: ["접는 선", "왼쪽과 오른쪽", "똑같은 모양"], answers: [] });
  sy3Layout(body, svg, sy3Side(h("p", { class: "sy3small" }, "데칼코마니는 종이 한쪽에 물감을 칠하고 반으로 접었다 펴서 만드는 그림이에요."), sy3Tools(...pal), read));
  body.append(h("div", { class: "actions" }, fold));
}

/* =========================================================
   13. 색종이 두 장을 겹쳐서 오리기(2차시) — 점을 눌러 도형을 그리고 오려요
   ========================================================= */
function sy3Cut(body, api, opt) {
  const box = [0, 0, 14, 8], { svg, m } = sy3Setup({ box, k: 40, maxW: "34em", grid: false });
  const paper = svgEl("g"); svg.append(paper);
  const dr = (x, y, w, hh, c, o) => { const a = m([x, y]); paper.append(svgEl("rect", Object.assign({ x: sy3R(a[0]), y: sy3R(a[1]), width: w * m.k, height: hh * m.k, fill: c }, o || {}))); };
  dr(.3, .3, 6.6, 7.4, "#F6A9B8", { rx: 4 }); dr(0, 0, 6.6, 7.4, "#FFE48A", { rx: 4, stroke: "#E0C25A", "stroke-width": 2 });
  paper.append(sy3GridG(0, 0, 6, 7, m, "rgba(160,130,40,0.35)"));
  const lineG = svgEl("g", { "pointer-events": "none" }), outG = svgEl("g", { "pointer-events": "none" }); svg.append(lineG, outG);
  let pts = [], closed = false, cut = false, done = false;
  const read = h("div", { class: "sy3read" }, "노란 색종이 위의 점을 차례로 눌러 도형을 그려요. 처음 점을 다시 누르면 도형이 닫혀요.");
  const redraw = () => { lineG.innerHTML = ""; if (pts.length > 1) lineG.append(svgEl(closed ? "polygon" : "polyline", { points: sy3Pts(pts, m), fill: closed ? "rgba(228,122,56,.18)" : "none", stroke: SY3.org, "stroke-width": 3, "stroke-dasharray": "7 5" })); pts.forEach((p, i) => sy3Dot(lineG, m, p, { r: i ? 4.5 : 6.5, color: SY3.org })); };
  const area = P => { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; };
  svg.style.touchAction = "none";
  svg.addEventListener("click", e => {
    if (closed) return; const u = sy3Un(m, svgPt(svg, e)), g = [Math.round(u[0]), Math.round(u[1])];
    if (g[0] < 0 || g[0] > 6 || g[1] < 0 || g[1] > 7) return;
    if (pts.length >= 3 && g[0] === pts[0][0] && g[1] === pts[0][1]) { if (area(pts) < .5) { read.textContent = "도형의 넓이가 너무 작아요. 다시 그려 봐요."; return; } closed = true; read.textContent = "도형을 그렸어요. ‘겹쳐서 오리기’를 눌러요."; redraw(); return; }
    if (pts.some(p => p[0] === g[0] && p[1] === g[1])) return;
    pts.push(g); redraw();
  });
  const cutB = h("button", { class: "big", onclick: () => {
    if (cut) return; if (!closed) { read.textContent = pts.length >= 3 ? "처음 점을 다시 눌러 도형을 닫아요." : "점을 3개 이상 눌러 도형을 그려요."; return; }
    cut = true; paper.setAttribute("opacity", .15); lineG.innerHTML = "";
    const pink = svgEl("g"), yel = svgEl("g"); outG.append(pink, yel);
    sy3DrawPart(pink, sy3P(pts.map(p => [p[0] + .3, p[1] + .3])), m, { fill: "#F6A9B8", stroke: "#C9667B", w: 2.5 });
    sy3DrawPart(yel, sy3P(pts), m, { fill: "#FFE48A", stroke: "#B8952A", w: 2.5 });
    sy3Anim(1100, t => pink.setAttribute("transform", `translate(${sy3R(t * 6.7 * m.k)} 0)`), () => { read.textContent = "오려 낸 두 도형을 나란히 놓았어요. ‘포개어 보기’로 비교해 봐요."; });
  } }, "겹쳐서 오리기");
  const over = h("button", { class: "big", onclick: () => {
    if (!cut || done) { if (!cut) read.textContent = "먼저 오려요."; return; }
    const g = outG.firstChild;
    sy3Anim(1000, t => g.setAttribute("transform", `translate(${sy3R((1 - t) * 6.7 * m.k - t * .3 * m.k)} ${sy3R(-t * .3 * m.k)})`), () => {
      done = true; api.tryOnce(); read.textContent = "분홍 도형을 노란 도형 위에 포개었더니 완전히 겹쳐요!";
      sy3Finish(body, api, opt, `꼭짓점 ${pts.length}개인 도형`, opt.doneMsg || "두 도형이 완전히 겹쳐요!");
    });
  } }, "포개어 보기");
  const again = h("button", { onclick: () => { if (cut) return; pts = []; closed = false; redraw(); read.textContent = "다시 그려요."; } }, "다시 그리기");
  api.provide({ words: ["겹쳐서 오리기", "모양", "크기", "완전히 겹쳐요"], answers: [] });
  sy3Layout(body, svg, sy3Side(h("p", { class: "sy3small" }, "노란 색종이 아래에 분홍 색종이를 겹쳐 놓았어요."), read, sy3Tools(again)));
  body.append(h("div", { class: "actions" }, cutB, over));
}

/* =========================================================
   14. 카드를 없애는 완벽한 방법(11차시 놀이) — 나와 컴퓨터 친구 둘(다윤, 승현)
   카드: 도형 카드(선대칭도형만·점대칭도형만·둘 다·둘 다 아님) + 특별 카드 ①②③
   ========================================================= */
function sy3SpecialSvg(sp, w = 80) {
  const s = makeSvg(100, 120), col = ["#E47A38", "#2B7BD6", "#7A5BB0"][sp - 1];
  s.append(svgEl("rect", { x: 4, y: 4, width: 92, height: 112, rx: 12, fill: col }), svgEl("rect", { x: 12, y: 12, width: 76, height: 96, rx: 8, fill: "#fff", opacity: .92 }));
  s.append(txt(50, 44, ["①", "②", "③"][sp - 1], 34, { fill: col }));
  s.append(txt(50, 78, ["2장 선물", "순서 바꾸기", "카드 바꾸기"][sp - 1], 13, { fill: col, "font-weight": "bold" }), txt(50, 96, "특별 카드", 12, { fill: SY3.gray }));
  return s;
}
function sy3CardSvg(c, w) {
  if (c.sp) return sy3SpecialSvg(c.sp);
  const s = makeSvg(100, 120); s.append(svgEl("rect", { x: 4, y: 4, width: 92, height: 112, rx: 12, fill: "#fff", stroke: "#C9D4CF", "stroke-width": 3 }));
  const bb = sy3BBox(c.parts), bw = bb[2] - bb[0], bh = bb[3] - bb[1], k = Math.min(72 / bw, 86 / bh), m = sy3Map(k, 50 - (bb[0] + bw / 2) * k, 60 - (bb[1] + bh / 2) * k);
  sy3DrawParts(s, c.parts, m, { w: 2 }); return s;
}
const SY3_PROPS = { L: ["선"], P: ["점"], B: ["선", "점"], N: ["없음"] };
const SY3_SHOUT = { "선": "선대칭도형!", "점": "점대칭도형!", "없음": "둘 다 아닌 도형!" };
function sy3Uno(body, api, opt) {
  const NAMES = ["나", "다윤", "승현"], NI = ["나", "다윤이", "승현이"];
  let deck, pile, hands, turn, dir, anyNext, over, wrongShout, goodShout, waitCall, timer = null, note = "";
  const info = h("div", { class: "sy3players" }), pileBox = h("div", { style: "display:flex;gap:1em;align-items:center;flex-wrap:wrap" }), handBox = h("div", { class: "sy3hand" });
  const logBox = h("div", { class: "sy3log" }), read = h("div", { class: "sy3read" });
  const shoutBs = ["선", "점", "없음"].map(s => h("button", { onclick: () => play(s) }, SY3_SHOUT[s]));
  const spB = h("button", { onclick: () => play(null) }, "특별 카드 내기");
  const drawB = h("button", { onclick: () => { if (turn === 0 && !over && !waitCall) { draw(0, 1); anyNext = false; log(`나: 낼 카드가 없어서 한 장을 가져왔어요.`); endTurn(); } } }, "카드 한 장 가져오기");
  const callB = h("button", { class: "big", onclick: () => callSym() }, "대칭!");
  const again = h("button", { class: "ghost", onclick: () => start() }, "한 판 더");
  let sel = -1;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const topShape = () => { for (let i = pile.length - 1; i >= 0; i--) if (!pile[i].sp) return pile[i]; return null; };
  const log = t => { logBox.prepend(h("p", {}, t)); };
  function refill() {
    if (deck.length) return;
    const keep = topShape(), rest = pile.filter(c => c !== keep); pile = [keep]; deck = shuffle(rest);
    log("뒤집어 쌓아 둔 카드가 없어서, 맨 위 카드를 뺀 나머지를 섞어 다시 쌓았어요.");
  }
  function draw(p, n) { for (let i = 0; i < n; i++) { refill(); if (!deck.length) return; hands[p].push(deck.pop()); } }
  function start() {
    clearTimeout(timer);
    deck = shuffle(opt.deck.map(c => Object.assign({}, c)));
    hands = [[], [], []]; for (let r = 0; r < 5; r++) for (let p = 0; p < 3; p++) hands[p].push(deck.pop());
    let k = deck.findIndex(c => !c.sp); pile = [deck.splice(k, 1)[0]];
    turn = 0; dir = 1; anyNext = false; over = false; wrongShout = 0; goodShout = 0; waitCall = null; sel = -1; note = ""; logBox.innerHTML = "";
    log("카드를 5장씩 나누어 가졌어요. 가위바위보로 ‘나’가 먼저 해요.");
    render();
  }
  const kindsOf = c => SY3_PROPS[c.kind];
  function canPlay(c, top) { if (c.sp || anyNext) return true; const a = kindsOf(c), b = kindsOf(top); return a.some(x => b.includes(x)); }
  function shoutOk(c, s, top) { if (!kindsOf(c).includes(s)) return false; return anyNext || kindsOf(top).includes(s); }
  const nextOf = p => (p + dir + 3) % 3;
  function render() {
    info.innerHTML = "";
    NAMES.forEach((n, p) => info.append(h("div", { class: turn === p && !over ? "sy3turn" : "" }, h("b", {}, n), ` · 카드 ${hands[p].length}장`)));
    pileBox.innerHTML = "";
    const top = topShape(), last = pile[pile.length - 1];
    const tw = h("div", { style: "width:6.5em" }, sy3CardSvg(top)); const cap = h("div", { class: "sy3small" }, "보이는 카드");
    pileBox.append(h("div", {}, tw, cap));
    if (last.sp) pileBox.append(h("div", { style: "width:4.5em" }, sy3CardSvg(last), h("div", { class: "sy3small" }, "방금 낸 특별 카드")));
    pileBox.append(h("div", { class: "sy3small" }, `쌓아 둔 카드 ${deck.length}장 · 순서: ${dir === 1 ? "나 → 다윤 → 승현" : "나 → 승현 → 다윤"}` + (anyNext && !over ? " · 이번 차례는 아무 카드나 낼 수 있어요" : "")));
    handBox.innerHTML = "";
    hands[0].forEach((c, i) => { const b = h("button", { class: (i === sel ? "sy3on" : "") + (turn === 0 && !over && !canPlay(c, top) ? " sy3dim" : ""), "aria-label": c.sp ? "특별 카드" : "도형 카드", onclick: () => { if (over) return; sel = i === sel ? -1 : i; note = ""; render(); } }, sy3CardSvg(c)); handBox.append(b); });
    const my = turn === 0 && !over && !waitCall;
    const c = hands[0][sel];
    shoutBs.forEach(b => b.disabled = !my || !c || !!(c && c.sp));
    spB.disabled = !my || !c || !c.sp; drawB.disabled = !my;
    if (!over && !waitCall) read.textContent = (note ? note + " " : "") + (turn === 0 ? (c ? (c.sp ? "특별 카드를 낼까요? ‘특별 카드 내기’를 눌러요." : "이 카드가 어떤 도형인지 외치며 내요.") : "낼 카드를 골라요. 낼 카드가 없으면 한 장 가져와요.") : `${NI[turn]}의 차례예요…`);
  }
  function special(p, c) {
    const nx = nextOf(p);
    if (c.sp === 1) { draw(nx, 2); log(`${NAMES[p]}: 특별 카드 ① — ${nx === 0 ? "나" : NI[nx]}에게 쌓아 둔 카드 2장을 선물해요.`); anyNext = true; }
    if (c.sp === 2) { dir = -dir; log(`${NAMES[p]}: 특별 카드 ② — 놀이 순서를 바꿔요.`); anyNext = true; }
    if (c.sp === 3) { refill(); let k = deck.findIndex(x => !x.sp); if (k >= 0) { pile.push(deck.splice(k, 1)[0]); } log(`${NAMES[p]}: 특별 카드 ③ — 보이는 카드를 새 카드로 바꿔요.`); anyNext = true; }
  }
  function play(s) {
    if (turn !== 0 || over || waitCall) return;
    const c = hands[0][sel], top = topShape(); if (!c) return;
    if (c.sp) { hands[0].splice(sel, 1); pile.push(c); sel = -1; special(0, c); return afterPlay(0); }
    if (!canPlay(c, top)) { note = "이 카드는 낼 수 없어요. 보이는 카드와 같은 종류의 대칭인 카드를 내요."; return render(); }
    if (!shoutOk(c, s, top)) {
      wrongShout++; sel = -1;
      log(`나: “${SY3_SHOUT[s]}” — 도형을 잘못 외쳐서 차례가 넘어가요.`);
      note = !kindsOf(c).includes(s) ? `그 카드는 ${c.kind === "N" ? "선대칭도형도 점대칭도형도 아니에요" : c.kind === "B" ? "선대칭도형이면서 점대칭도형이에요" : SY3_KIND[c.kind] + "이에요"}. 차례가 넘어가요.` : "보이는 카드와 같은 종류의 대칭을 외쳐야 해요. 차례가 넘어가요.";
      anyNext = false; return endTurn();
    }
    goodShout++; hands[0].splice(sel, 1); pile.push(c); sel = -1; anyNext = false;
    log(`나: “${SY3_SHOUT[s]}” 하고 카드를 냈어요.`); afterPlay(0);
  }
  function afterPlay(p) {
    if (!hands[p].length) return finish(p);
    if (hands[p].length === 1) {
      if (p === 0) {
        waitCall = { p: 0 }; read.textContent = "카드가 한 장 남았어요! 다른 사람보다 먼저 ‘대칭!’을 외쳐요.";
        timer = setTimeout(() => { if (waitCall && waitCall.p === 0) { const o = nextOf(0); log(`${NAMES[o]}: “대칭!” — 내가 먼저 외치지 못해서 한 장을 가져와요.`); draw(0, 1); waitCall = null; endTurn(); } }, opt.callMs || 2600);
        render(); return;
      }
      if (Math.random() < .75) { log(`${NAMES[p]}: “대칭!”`); }
      else {
        waitCall = { p }; read.textContent = `${NI[p]}의 카드가 한 장 남았는데 아직 ‘대칭’을 외치지 않았어요! 내가 먼저 외쳐 볼까요?`;
        timer = setTimeout(() => { if (waitCall && waitCall.p === p) { log(`${NAMES[p]}: “대칭!”`); waitCall = null; endTurn(); } }, opt.callMs || 2600);
        render(); return;
      }
    }
    endTurn();
  }
  function callSym() {
    if (over) return;
    if (waitCall && waitCall.p === 0) { clearTimeout(timer); waitCall = null; log("나: “대칭!” — 먼저 외쳤어요."); return endTurn(); }
    if (waitCall) { clearTimeout(timer); const p = waitCall.p; waitCall = null; log(`나: “대칭!” — ${NI[p]}보다 먼저 외쳐서 ${NI[p]}가 한 장을 가져가요.`); draw(p, 1); return endTurn(); }
    read.textContent = hands[0].length === 1 ? "이미 ‘대칭’을 외쳤어요." : "‘대칭!’은 카드가 한 장 남았을 때 외쳐요.";
  }
  function finish(p) {
    over = true; clearTimeout(timer); waitCall = null;
    const msg = p === 0 ? "카드를 모두 내려놓았어요. 내가 이겼어요!" : `${NI[p]}가 카드를 먼저 모두 내려놓았어요.`;
    log(msg); read.textContent = msg + ` (바르게 외친 횟수 ${goodShout}번, 잘못 외친 횟수 ${wrongShout}번)`; render();
    api.tryOnce(); api.done(`${p === 0 ? "이김" : NAMES[p] + " 이김"} · 바르게 외침 ${goodShout} · 잘못 외침 ${wrongShout}`, opt.ok || "놀이를 끝까지 했어요!");
  }
  function endTurn() { if (over) return; turn = nextOf(turn); if (turn === 0) note = ""; render(); if (turn !== 0) timer = setTimeout(cpu, opt.cpuMs || 1100); }
  function cpu() {
    if (over || turn === 0) return;
    const p = turn, hand = hands[p], top = topShape();
    let i = hand.findIndex(c => !c.sp && canPlay(c, top));
    if (i < 0) i = hand.findIndex(c => c.sp);
    if (i < 0) { draw(p, 1); anyNext = false; log(`${NAMES[p]}: 낼 카드가 없어서 한 장을 가져왔어요.`); return endTurn(); }
    const c = hand[i];
    if (c.sp) { hand.splice(i, 1); pile.push(c); special(p, c); return afterPlay(p); }
    const can = kindsOf(c).filter(s => anyNext || kindsOf(top).includes(s));
    if (Math.random() < .12) { const wrong = ["선", "점", "없음"].find(s => !can.includes(s)); log(`${NAMES[p]}: “${SY3_SHOUT[wrong]}” — 도형을 잘못 외쳐서 차례가 넘어가요.`); anyNext = false; return endTurn(); }
    hand.splice(i, 1); pile.push(c); anyNext = false;
    log(`${NAMES[p]}: “${SY3_SHOUT[can[0]]}” 하고 카드를 냈어요.`); afterPlay(p);
  }
  api.provide({ words: ["선대칭도형", "점대칭도형", "둘 다", "둘 다 아님", "특별 카드"], answers: [] });
  body.append(info, pileBox, h("p", { class: "sy3small" }, "내 카드(눌러서 고르기)"), handBox,
    sy3Tools(...shoutBs, spB, drawB), h("div", { class: "sy3tools", style: "margin-top:.3em" }, callB, again), read, logBox);
  start();
}

/* =========================================================
   15. 짝 맞추기 기억 놀이(또 다른 놀이 방법) — 카드 2장을 펼쳐 대칭의 종류가 같으면 가져가요
   ========================================================= */
function sy3Memory(body, api, opt) {
  const cards = opt.cards.map((c, i) => Object.assign({ id: i }, c));
  let order, open, taken, turn, score, busy, over, seen;
  const grid = h("div", { class: "sy3hand", style: "max-width:36em" }), read = h("div", { class: "sy3read" }), sc = h("div", { class: "sy3players" });
  const sameB = h("button", { onclick: () => judge(true) }, "대칭의 종류가 같아요"), diffB = h("button", { onclick: () => judge(false) }, "대칭의 종류가 달라요");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const back = () => { const s = makeSvg(100, 120); s.append(svgEl("rect", { x: 4, y: 4, width: 92, height: 112, rx: 12, fill: "#7FA9C9" }), txt(50, 62, "?", 40, { fill: "#fff" })); return s; };
  function start() { order = shuffle(cards.slice()); open = []; taken = {}; turn = 0; score = [0, 0]; busy = false; over = false; seen = {}; render(); }
  function render() {
    grid.innerHTML = "";
    order.forEach((c, i) => {
      const b = h("button", { onclick: () => flip(i), "aria-label": "카드" }, taken[c.id] != null ? (() => { const s = makeSvg(100, 120); s.append(svgEl("rect", { x: 4, y: 4, width: 92, height: 112, rx: 12, fill: taken[c.id] ? "#FDE3D3" : "#DCEAFB", opacity: .5 })); return s; })() : open.includes(i) ? sy3CardSvg(c) : back());
      if (taken[c.id] != null) b.disabled = true;
      grid.append(b);
    });
    sc.innerHTML = ""; ["나", "컴퓨터"].forEach((n, p) => sc.append(h("div", { class: turn === p && !over ? "sy3turn" : "" }, h("b", {}, n), ` · 가져간 카드 ${score[p]}장`)));
    sameB.disabled = diffB.disabled = !(turn === 0 && open.length === 2 && !busy);
  }
  function flip(i) {
    if (over || busy || turn !== 0 || open.length >= 2 || open.includes(i)) return;
    open.push(i); seen[i] = order[i].kind; render();
    if (open.length === 2) read.textContent = "두 카드의 대칭의 종류가 같은가요?";
  }
  const kn = k => ({ L: "선대칭도형", P: "점대칭도형", N: "선대칭도형도 점대칭도형도 아닌 도형" })[k];
  function judge(say) {
    if (turn !== 0 || open.length !== 2 || busy) return;
    const [a, b] = open.map(i => order[i]), same = a.kind === b.kind;
    if (say !== same) { read.textContent = `아쉬워요. 앞 카드는 ${kn(a.kind)}, 뒤 카드는 ${kn(b.kind)}이에요. 카드를 다시 뒤집어요.`; return endT(false); }
    read.textContent = same ? `맞아요! 둘 다 ${kn(a.kind)}이에요. 두 장을 가져가요.` : `맞아요. 앞 카드는 ${kn(a.kind)}, 뒤 카드는 ${kn(b.kind)}이라서 다시 뒤집어요.`;
    endT(same);
  }
  function endT(take) {
    busy = true; render();
    setTimeout(() => {
      if (take) { open.forEach(i => taken[order[i].id] = turn); score[turn] += 2; }
      open = []; busy = false;
      if (Object.keys(taken).length === order.length) return finish();
      turn = 1 - turn; render();
      if (turn === 1) setTimeout(cpu, 700);
      else read.textContent = "카드 2장을 눌러 펼쳐요.";
    }, take ? 900 : 1700);
  }
  function cpu() {
    if (over) return;
    const left = order.map((c, i) => i).filter(i => taken[order[i].id] == null);
    let pair = null;
    const known = left.filter(i => seen[i] && Math.random() < .7);
    for (let x = 0; x < known.length && !pair; x++) for (let y = x + 1; y < known.length; y++) if (seen[known[x]] === seen[known[y]]) { pair = [known[x], known[y]]; break; }
    if (!pair) { const s = shuffle(left.slice()); pair = [s[0], s[1]]; }
    open = pair; pair.forEach(i => seen[i] = order[i].kind); render();
    const same = order[pair[0]].kind === order[pair[1]].kind;
    read.textContent = `컴퓨터가 두 장을 펼쳤어요. ${same ? `둘 다 ${kn(order[pair[0]].kind)}이라서 가져가요.` : "대칭의 종류가 달라서 다시 뒤집어요."}`;
    setTimeout(() => endT(same), 600);
  }
  function finish() {
    over = true; render();
    read.textContent = score[0] > score[1] ? `카드를 ${score[0]}장 가져가서 내가 이겼어요!` : score[0] < score[1] ? `컴퓨터가 ${score[1]}장으로 이겼어요. 한 판 더 해 볼까요?` : "가져간 카드 수가 같아서 비겼어요.";
    api.tryOnce(); api.done(`나 ${score[0]}장 · 컴퓨터 ${score[1]}장`, opt.ok || "놀이를 끝까지 했어요!");
  }
  api.provide({ words: ["선대칭도형", "점대칭도형", "둘 다 아님"], answers: [] });
  body.append(sc, grid, sy3Tools(sameB, diffB, h("button", { class: "ghost", onclick: start }, "한 판 더")), read);
  start(); read.textContent = "카드 2장을 눌러 펼쳐요.";
}
//@@LESSONS
const UNIT_STORY = { title: "다윤이와 승현이의 미술관 나들이", lines: [
  "다윤이와 승현이가 미술관에 갔어요. 바닥의 화살표, 판화 체험장, 색유리 창문, 천장의 글자 작품, 복도의 작품을 둘러보며 모양과 크기가 같은 도형, 접으면 겹치는 도형, 180° 돌리면 겹치는 도형을 찾아요.",
  "투명 종이로 도형을 포개고, 직선을 따라 접고, 한 점을 중심으로 돌리며 합동, 선대칭도형, 점대칭도형을 직접 확인해요. 모든 그림의 길이와 각도는 문제의 수와 꼭 맞게 그렸어요.",
  "교과서 「수학 5-2」 3. 합동과 대칭의 차시 순서 그대로 만들었어요. 지도서에서 두 차시로 묶인 5~6차시와 8~9차시는 한 차시 안에서 이어서 해요."],
  one: "합동과 대칭 · 미술관에서 도형을 포개고, 접고, 180° 돌려 봐요." };
const UNIT_KEYWORDS = ["합동", "대응점", "대응변", "대응각", "포개기", "완전히 겹쳐요", "선대칭도형", "대칭축", "점대칭도형", "대칭의 중심", "수직", "같은 거리", "180°", "똑같이 둘로"];

/* ---- 도형 만들기 도구 ---- */
function sy3Put(P, mi, x, y) {   // D4 변환(mi번) 뒤 왼쪽 위를 (x,y)로
  const M = SY3_D4[mi || 0], Q = P.map(p => [M[0] * p[0] + M[2] * p[1], M[1] * p[0] + M[3] * p[1]]);
  const mx = Math.min(...Q.map(p => p[0])), my = Math.min(...Q.map(p => p[1]));
  return Q.map(p => [sy3R(p[0] - mx + x), sy3R(p[1] - my + y)]);
}
const sy3Sh = (P, dx, dy) => P.map(p => [sy3R(p[0] + dx), sy3R(p[1] + dy)]);
function sy3Walk(p0, dir0, lens, turns) {   // 변의 길이와 꺾는 각(화면에서 시계 방향 +)으로 다각형
  const P = [p0.slice()]; let d = dir0;
  for (let i = 0; i < lens.length - 1; i++) { const q = P[P.length - 1]; P.push([q[0] + lens[i] * Math.cos(d * Math.PI / 180), q[1] + lens[i] * Math.sin(d * Math.PI / 180)]); d += turns[i]; }
  return P;
}
const sy3PolarPt = (c, r, deg) => [c[0] + r * Math.cos(deg * Math.PI / 180), c[1] + r * Math.sin(deg * Math.PI / 180)];
const sy3Cells2 = (rows, dx, dy, o) => sy3Cells(sy3Grid(rows).map(c => [c[0] + dx, c[1] + dy]), o || { fill: SY3.f1 });
const SY3_N6 = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"];

/* 선대칭도형 육각형(4·5~6차시): 직선 ㅅㅇ이 대칭축, 변 3 cm·2 cm·3 cm, 각 80°·100° (점 ㄱ·ㄹ은 대칭축 위) */
const SY3_HL = (() => { const a = 170 * Math.PI / 180, n = [3 * Math.cos(a), -3 * Math.sin(a)]; return [[0, 0], n, [n[0], n[1] + 2], [0, 2], [-n[0], n[1] + 2], [-n[0], n[1]]].map(p => [sy3R(p[0] + 4), sy3R(p[1] + 1.4)]); })();
function sy3FigHL(o = {}) {
  return Object.assign({ box: [0, 0, 8, 4.8], k: 60, grid: false, maxW: "28em",
    shapes: [{ P: SY3_HL, names: SY3_N6, fill: SY3.f3 }],
    lines: [{ p: [4, 0.15], q: [4, 4.6], color: SY3.red, w: 2.4, dash: "9 6" }],
    texts: [{ p: [4.25, 0.25], t: "ㅅ", color: SY3.red, size: 18 }, { p: [4.25, 4.55], t: "ㅇ", color: SY3.red, size: 18 }] }, o);
}
/* 점대칭도형 육각형(7·8~9차시): 변 1 cm·2 cm·2.5 cm, 각 145°·140°·75° */
const SY3_HP = (() => { const P = sy3Walk([0, 0], 75, [1, 2, 2.5, 1, 2, 2.5], [-35, -40, -105, -35, -40, -105]); return P.map(p => [sy3R(p[0] + .8), sy3R(p[1] + .8)]); })();
const SY3_HPC = sy3Cen([sy3P(SY3_HP)]);
function sy3FigHP(o = {}) {
  return Object.assign({ box: [0, 0, 5.9, 4], k: 74, grid: false, maxW: "26em", shapes: [{ P: SY3_HP, names: SY3_N6, fill: SY3.f5 }] }, o);
}
/* 합동인 두 직각사다리꼴(3차시): 각 90°·90°·45°·135° */
const SY3_TZ1 = [[3, 1], [1, 3], [5, 3], [5, 1]];           // ㄱ ㄴ ㄷ ㄹ
const SY3_TZ2 = [[10, 3], [8, 1], [8, 5], [10, 5]];         // ㅇ ㅅ ㅂ ㅁ (ㄱ↔ㅇ, ㄴ↔ㅅ, ㄷ↔ㅂ, ㄹ↔ㅁ)
/* 3차시 활동 3: 합동인 두 사각형(4 cm, 100°, 5 cm / □ cm, □°, 110°) */
const SY3_Q3 = (() => { const P = sy3Walk([0, 0], 0, [5, 4, 4.295, 3.817], [110, 70, 100, 80]); return P; })();
/* 3차시 퍼즐: 삼각형 ㄱㄴㄷ과 빈자리 ㅁㅂㄹ */
const SY3_PZT = [[1, 0], [0, 3], [4, 3]];
const SY3_PZH = SY3_PZT.map(p => [sy3R(-p[1] + 3 + 1), sy3R(p[0] + 1)]);   // 시계 방향 90° → ㅁ(4,2) ㅂ(1,1) ㄹ(1,5)

/* ---- 그림 ---- */
function sy3RowFig(items, o = {}) {   // 도형 여러 개를 칸에 나란히 (items: [{parts, label}])
  const cw = o.cw || 5, chh = o.ch || 5, k = o.k || 22, n = items.length, W = n * (cw * k + 14) + 14, H = chh * k + 44;
  const svg = makeSvg(W, H); svg.setAttribute("class", "sy3fig"); svg.style.maxWidth = o.maxW || `${Math.min(34, n * 8)}em`;
  items.forEach((it, i) => {
    const x0 = 14 + i * (cw * k + 14), bb = sy3BBox(it.parts), bw = bb[2] - bb[0], bh = bb[3] - bb[1], kk = Math.min(k, (cw * k - 16) / bw, (chh * k - 16) / bh);
    svg.append(svgEl("rect", { x: x0, y: 30, width: cw * k, height: chh * k, rx: 10, fill: it.hl ? "#FFF7E8" : "#fff", stroke: it.hl ? SY3.org : "#C9D4CF", "stroke-width": 2 }));
    if (o.grid) { const m0 = sy3Map(k, x0, 30); svg.append(sy3GridG(0, 0, cw, chh, m0)); }
    const m = sy3Map(kk, x0 + (cw * k - bw * kk) / 2 - bb[0] * kk, 30 + (chh * k - bh * kk) / 2 - bb[1] * kk);
    sy3DrawParts(svg, it.parts, m, { w: 2.2 });
    if (it.after) it.after(svg, m);
    svg.append(txt(x0 + cw * k / 2, 16, it.label, 18, { fill: SY3.ink, "font-weight": "bold" }));
  });
  return svg;
}
/* 1차시 미술관 작품 그림 */
const SY3_SPOTS = [
  { id: "arrow", name: "바닥 화살표", floor: true, say: "모양과 크기가 똑같은 화살표가 여러 개 있어요.", draw(g, w, hh) { [0, 1, 2].forEach(i => g.append(svgEl("polygon", { points: [[8, 22], [26, 22], [26, 12], [40, 31], [26, 50], [26, 40], [8, 40]].map(p => `${p[0] + i * 40},${p[1]}`).join(" "), fill: "#5B8DEF", stroke: "#2F5FB8", "stroke-width": 2 }))); } },
  { id: "print", name: "판화 체험장", say: "판에 새긴 도형과 찍어 낸 도형은 모양과 크기가 같아요.", draw(g, w, hh) { g.append(svgEl("rect", { x: 14, y: 16, width: 100, height: 52, rx: 6, fill: "#C9A27A" })); g.append(svgEl("polygon", { points: "40,24 24,60 66,60", fill: "#8A5A2E" })); [[24, 86], [68, 86]].forEach(([x, y]) => g.append(svgEl("polygon", { points: `${x + 16},${y} ${x},${y + 36} ${x + 42},${y + 36}`, fill: "#E5533D" }))); } },
  { id: "glass", name: "색유리 창문", say: "창문 무늬의 왼쪽과 오른쪽 모양이 똑같아요.", draw(g, w, hh) { g.append(svgEl("path", { d: "M18 140 V60 Q64 4 110 60 V140 Z", fill: "#BFE3F2", stroke: "#4E7FA0", "stroke-width": 3 })); g.append(svgEl("polygon", { points: "64,40 88,80 64,120 40,80", fill: "#F2B33D", stroke: "#B07B12", "stroke-width": 2 }), svgEl("circle", { cx: 34, cy: 112, r: 10, fill: "#E5533D" }), svgEl("circle", { cx: 94, cy: 112, r: 10, fill: "#E5533D" }), svgEl("line", { x1: 64, y1: 22, x2: 64, y2: 140, stroke: "#D64545", "stroke-width": 1.5, "stroke-dasharray": "4 4" })); } },
  { id: "letter", name: "천장 글자 작품", say: "글자 ‘ㄹ’은 가운데 점을 중심으로 180° 돌려도 처음 글자와 겹쳐요.", draw(g, w, hh) { const m = sy3Map(18, 19, 30); sy3DrawPart(g, sy3Cells(sy3Grid(["#####", "....#", "#####", "#....", "#####"]), { fill: "#9A5BD6" }), m, { stroke: "#5E3496", w: 2 }); g.append(svgEl("circle", { cx: 64, cy: 75, r: 4, fill: "#D64545" })); } },
  { id: "hall", name: "복도의 작품", say: "바람개비 작품은 가운데 점을 중심으로 180° 돌리면 처음 모양과 겹쳐요.", draw(g, w, hh) { const c = [64, 76]; [0, 90, 180, 270].forEach((a, i) => { const P = [[0, 0], [0, -44], [30, -44]].map(p => { const t = a * Math.PI / 180; return [c[0] + p[0] * Math.cos(t) - p[1] * Math.sin(t), c[1] + p[0] * Math.sin(t) + p[1] * Math.cos(t)]; }); g.append(svgEl("polygon", { points: P.map(p => p.map(sy3R).join(",")).join(" "), fill: ["#E5533D", "#F2B33D", "#3D8FE5", "#5DAA4E"][i], stroke: "#555", "stroke-width": 1.5 })); }); g.append(svgEl("circle", { cx: 64, cy: 76, r: 4, fill: "#333" })); } }];

/* ---- 4차시 창문 무늬(색깔 칸) ---- */
const SY3_COL = { r: "#E5533D", y: "#F2B33D", b: "#3D8FE5", g: "#5DAA4E", p: "#9A5BD6" };
function sy3Pattern(rows, dx = 1, dy = 1) {
  const by = {}; rows.forEach((r, y) => [...r].forEach((ch, x) => { if (SY3_COL[ch]) (by[ch] = by[ch] || []).push([x + dx, y + dy]); }));
  return Object.entries(by).map(([ch, C]) => sy3Cells(C, { fill: SY3_COL[ch], stroke: "#5A5A5A", w: 1.6 }));
}
const SY3_WIN = [
  { label: "가", parts: sy3Pattern(["..rr..", ".rbbr.", "rbyybr", "rbyybr", ".rbbr.", "..rr.."]), line: [[4, 0], [4, 8]] },
  { label: "나", parts: sy3Pattern(["g...bb", "gy..b.", "gyy...", "gyy...", "gy..b.", "g...bb"]), line: [[0, 4], [8, 4]] },
  { label: "다", parts: sy3Pattern(["rr....", "ryy...", ".yb...", "...bg.", "...ggg", "....g."]), line: [[1, 1], [7, 7]] },
  { label: "라", parts: sy3Pattern(["b....b", "bb..bb", "b.yy.b", "..yy..", "rrrrrr", ".r..r."]), line: [[4, 0], [4, 8]] },
  { label: "마", parts: sy3Pattern(["p.p.p.", "pp.pp.", ".gggg.", ".gggg.", "pp.pp.", "p.p.p."]), line: [[0, 4], [8, 4]] }].map(w => Object.assign(w, { box: [0, 0, 8, 8], k: 30 }));

/* ---- 10차시 그림(대칭축이 x=4인 나비·도토리, 꽃잎 8장 코스모스) ---- */
function sy3Mir(g, m, ax, draw) { const a = svgEl("g"), b = svgEl("g"); draw(a); draw(b); const X = m([ax, 0])[0]; b.setAttribute("transform", `matrix(-1 0 0 1 ${sy3R(2 * X)} 0)`); g.append(a, b); }
const SY3_PICS = [
  { label: "나비", box: [0, 0, 8, 8], axes: [[[4, 0], [4, 8]]], parts: [{ t: "pic", box: [0, 0, 8, 8], draw(g, m) {
    sy3Mir(g, m, 4, gg => { const P = (x, y) => m([x, y]).map(sy3R).join(" ");
      gg.append(svgEl("path", { d: `M${P(3.8, 3.2)} C${P(2.6, 0.4)} ${P(0.2, 0.6)} ${P(0.6, 2.6)} C${P(0.8, 3.8)} ${P(2.4, 4.2)} ${P(3.8, 4.1)} Z`, fill: "#F2A6C8", stroke: "#B0517F", "stroke-width": 2.5 }));
      gg.append(svgEl("path", { d: `M${P(3.8, 4.3)} C${P(2.2, 4.4)} ${P(1.0, 5.6)} ${P(1.8, 6.8)} C${P(2.6, 7.6)} ${P(3.6, 6.4)} ${P(3.85, 5.0)} Z`, fill: "#F7C873", stroke: "#B0517F", "stroke-width": 2.5 }));
      gg.append(svgEl("circle", { cx: m([2, 2.4])[0], cy: m([2, 2.4])[1], r: m.k * .35, fill: "#fff", opacity: .7 }));
      gg.append(svgEl("path", { d: `M${P(3.9, 1.4)} Q${P(3.4, 0.6)} ${P(2.9, 0.4)}`, fill: "none", stroke: "#5B3E2B", "stroke-width": 2.5 })); });
    g.append(svgEl("ellipse", { cx: m([4, 4.3])[0], cy: m([4, 4.3])[1], rx: m.k * .28, ry: m.k * 2.6, fill: "#5B3E2B" })); } }] },
  { label: "도토리", box: [0, 0, 8, 8], axes: [[[4, 0], [4, 8]]], parts: [{ t: "pic", box: [0, 0, 8, 8], draw(g, m) {
    sy3Mir(g, m, 4, gg => { const P = (x, y) => m([x, y]).map(sy3R).join(" ");
      gg.append(svgEl("path", { d: `M${P(4, 7.4)} C${P(2.6, 7.0)} ${P(1.6, 5.4)} ${P(1.8, 3.6)} L${P(4, 3.6)} Z`, fill: "#C98A4B", stroke: "#7A4E22", "stroke-width": 2.5 }));
      gg.append(svgEl("path", { d: `M${P(4, 1.6)} C${P(2.6, 1.6)} ${P(1.2, 2.4)} ${P(1.3, 3.9)} L${P(4, 3.9)} Z`, fill: "#8A6248", stroke: "#5B3E2B", "stroke-width": 2.5 }));
      gg.append(svgEl("path", { d: `M${P(2.0, 3.2)} L${P(2.6, 2.4)} M${P(2.8, 3.4)} L${P(3.3, 2.4)}`, stroke: "#5B3E2B", "stroke-width": 2 })); });
    g.append(svgEl("rect", { x: m([3.85, 0.7])[0], y: m([3.85, 0.7])[1], width: m.k * .3, height: m.k * 1.0, rx: 3, fill: "#5B3E2B" })); } }] },
  { label: "코스모스", box: [0, 0, 8, 8], axes: [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map(d => [[4, 4], [4 + Math.cos(d * Math.PI / 180), 4 + Math.sin(d * Math.PI / 180)]]), parts: [{ t: "pic", box: [0, 0, 8, 8], draw(g, m) {
    for (let i = 0; i < 8; i++) { const e = svgEl("ellipse", { cx: m([4, 2.2])[0], cy: m([4, 2.2])[1], rx: m.k * .62, ry: m.k * 1.75, fill: "#F49CC0", stroke: "#B0517F", "stroke-width": 2, transform: `rotate(${i * 45} ${m([4, 4])[0]} ${m([4, 4])[1]})` }); g.append(e); }
    g.append(svgEl("circle", { cx: m([4, 4])[0], cy: m([4, 4])[1], r: m.k * .75, fill: "#F2C53D", stroke: "#B08A1E", "stroke-width": 2 })); } }] }];

/* ---- 11차시 놀이 카드 ---- */
const SY3_SHAPES = {
  L: [sy3P([[2, 0], [4, 4], [0, 4]]), sy3P([[2, 0], [4, 2], [2, 6], [0, 2]]), sy3P([[2, 0], [4, 2], [4, 4], [0, 4], [0, 2]]), sy3P([[2, 1], [3, 0], [4, 1], [4, 2], [2, 4], [0, 2], [0, 1], [1, 0]]), sy3P([[2, 0], [4, 2], [3, 2], [3, 5], [1, 5], [1, 2], [0, 2]]), sy3Cells(sy3Grid(["###", ".#.", ".#."]))],
  P: [sy3P([[1, 0], [4, 0], [3, 2], [0, 2]]), sy3Cells(sy3Grid(["##.", ".#.", ".##"])), sy3Cells(sy3Grid(["##..", ".##.", "..##"])), sy3Cells(sy3Grid(["#..", "##.", ".##", "..#"])), sy3P([[0, 1], [3, 0], [5, 1], [5, 3], [2, 4], [0, 3]]), sy3P([[0, 0], [2, 0], [4, 2], [6, 2], [6, 3], [4, 3], [2, 1], [0, 1]])],
  B: [sy3P([[0, 0], [5, 0], [5, 3], [0, 3]]), sy3P([[2, 0], [4, 3], [2, 6], [0, 3]]), sy3P([[0, 0], [4, 0], [4, 4], [0, 4]]), sy3C([2, 2], 2), sy3Cells(sy3Grid([".#.", "###", ".#."])), sy3Cells(sy3Grid(["#.#", "###", "#.#"]))],
  N: [sy3P([[0, 0], [5, 1], [1, 4]]), sy3Cells(sy3Grid(["#.", "#.", "##"])), sy3Cells(sy3Grid(["##", "##", "#."])), sy3P([[0, 0], [2, 0], [4, 3], [0, 3]]), sy3P([[0, 0], [4, 1], [2, 2], [4, 4], [0, 4]]), sy3Cells(sy3Grid([".##", "##.", ".#."]))] };
const SY3_FILLK = { L: "#DCEAFB", P: "#FDE3D3", B: "#DDEDE5", N: "#FFF1C7" };
const SY3_DECK = [].concat(...Object.entries(SY3_SHAPES).map(([k, a]) => a.map(pt => ({ kind: k, parts: [Object.assign({}, pt, { fill: "#EAF1F8", stroke: "#2F4A5E" })] }))), [1, 1, 2, 2, 3, 3].map(sp => ({ sp })));
const SY3_MEM = [].concat(...["L", "P", "N"].map(k => SY3_SHAPES[k].slice(0, 4).map(pt => ({ kind: k, parts: [Object.assign({}, pt, { fill: "#EAF1F8", stroke: "#2F4A5E" })] }))));

/* ---- 12차시 표지판 ---- */
const SY3_SIGNS = [
  { label: "가", name: "", parts: [sy3P([[3, 0], [6, 5.2], [0, 5.2]], { fill: "#D64545", stroke: "#8E2A27" }), sy3P([[3, 1.2], [5, 4.6], [1, 4.6]], { fill: "#FFF6D6", stroke: "#FFF6D6" }), sy3P([[2.8, 2], [3.2, 2], [3.1, 3.5], [2.9, 3.5]], { fill: "#222", stroke: "#222" }), sy3C([3, 4], .22, { fill: "#222", stroke: "#222" })] },
  { label: "나", parts: [sy3C([3, 3], 3, { fill: "#2B6FC4", stroke: "#1C4B86" }), sy3P([[3, .8], [4.6, 2.6], [3.6, 2.6], [3.6, 5.2], [2.4, 5.2], [2.4, 2.6], [1.4, 2.6]], { fill: "#fff", stroke: "#fff" })] },
  { label: "다", parts: [sy3P([[0, 0], [6, 0], [6, 6], [0, 6]], { fill: "#2B6FC4", stroke: "#1C4B86" }), sy3Cells(sy3Grid(["###.", "#..#", "###.", "#...", "#..."]).map(c => [c[0] + 1, c[1] + .5]), { fill: "#fff", stroke: "#fff" })] },
  { label: "라", parts: [sy3C([3, 3], 3, { fill: "#2B6FC4", stroke: "#1C4B86" }), sy3P([[2, .8], [3.1, 2.2], [2.4, 2.2], [2.4, 4.8], [1.6, 4.8], [1.6, 2.2], [.9, 2.2]], { fill: "#fff", stroke: "#fff" }), sy3P([[4, 5.2], [2.9, 3.8], [3.6, 3.8], [3.6, 1.2], [4.4, 1.2], [4.4, 3.8], [5.1, 3.8]], { fill: "#fff", stroke: "#fff" })] },
  { label: "마", parts: [sy3C([3, 3], 3, { fill: "#D64545", stroke: "#8E2A27" }), sy3P([[1, 2.4], [5, 2.4], [5, 3.6], [1, 3.6]], { fill: "#fff", stroke: "#fff" })] }];

/* ---- 그림을 바로 만드는 작은 함수들 ---- */
function sy3FigQuad3() {   // 3차시 활동 3: 왼쪽 4 cm·100°·5 cm, 오른쪽 □ cm·□°·110°
  const L = sy3Sh(SY3_Q3, 1.6, .9), R = SY3_Q3.map(p => [sy3R(-p[0] + 14.4), sy3R(-p[1] + 5.2)]);
  const lab = (P, i, j, t, c) => ({ a: P[i], b: P[j], t, c: sy3Cen([sy3P(P)]), color: c || SY3.ink });
  const arc = (P, i, t, col) => ({ V: P[i], A: P[(i + 3) % 4], B: P[(i + 1) % 4], t, color: col || SY3.org, r: 18, tr: 18 });
  return { box: [0, 0, 15.6, 5.8], k: 34, grid: false, maxW: "32em", shapes: [{ P: L, fill: SY3.f1 }, { P: R, fill: SY3.f2 }],
    labs: [lab(L, 0, 1, "5 cm"), lab(L, 1, 2, "4 cm"), lab(R, 1, 2, "□ cm", SY3.blue)], arcs: [arc(L, 0, "100°"), arc(R, 0, "□°", SY3.blue), arc(R, 2, "110°")] };
}
function sy3FigKites() {   // 5~6차시 활동 3: 직선 ㄱㄴ이 대칭축인 선대칭도형 두 개
  const T = [3.2, .8], R1 = [T[0] + 5 * Math.sin(35 * Math.PI / 180), T[1] + 5 * Math.cos(35 * Math.PI / 180)], B = [T[0], R1[1] + (R1[0] - T[0])], L1 = [2 * T[0] - R1[0], R1[1]];
  const K = [T, R1, B, L1].map(p => p.map(sy3R)), C = [10.5, 1.2];
  const H = [[0, 0], [4, 2], [3, 5], [0, 6.5], [-3, 5], [-4, 2]].map(p => [sy3R(p[0] + C[0]), sy3R(p[1] + C[1])]);
  const A = H[5], A2 = H[1], X = [C[0], A[1]];
  return { box: [0, 0, 14.6, 9.6], k: 34, grid: false, maxW: "32em", shapes: [{ P: K, fill: SY3.f3 }, { P: H, fill: SY3.f1 }],
    lines: [{ p: [T[0], .1], q: [T[0], 9.3], color: SY3.red, dash: "9 6", w: 2.2 }, { p: [C[0], .1], q: [C[0], 9.3], color: SY3.red, dash: "9 6", w: 2.2 }],
    segs: [{ p: A, q: A2, color: SY3.blue, dash: "6 5", w: 2.2 }],
    texts: [{ p: [T[0] + .35, .25], t: "ㄱ", color: SY3.red }, { p: [T[0] + .35, 9.3], t: "ㄴ", color: SY3.red }, { p: [C[0] + .35, .25], t: "ㄱ", color: SY3.red }, { p: [C[0] + .35, 9.3], t: "ㄴ", color: SY3.red }],
    labs: [{ a: T, b: R1, t: "5 cm", c: [T[0], 4] }, { a: T, b: L1, t: "□ cm", c: [T[0], 4], color: SY3.blue }, { a: A, b: X, t: "□ cm", color: SY3.blue, flip: true, d: 13 }, { a: X, b: A2, t: "4 cm", flip: true, d: 13 }],
    arcs: [{ V: L1, A: T, B, t: "100°", r: 18 }, { V: R1, A: B, B: T, t: "□°", color: SY3.blue, r: 18 }, { V: X, A: A2, B: [C[0], 0], t: "□°", color: SY3.blue }] };
}

function sy3D4(parts, mi, x = 0, y = 0) {   // 조각 묶음을 D4(mi번)로 바꾸고 왼쪽 위를 (x,y)로
  const M = SY3_D4[mi || 0], q = sy3XPs(parts, [M[0], M[1], M[2], M[3], 0, 0]), bb = sy3BBox(q);
  return sy3XPs(q, sy3Tr(x - bb[0], y - bb[1]));
}
function sy3CircX(p0, r0, p1, r1) {   // 두 원의 교점
  const d = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), a = (r0 * r0 - r1 * r1 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, r0 * r0 - a * a));
  const mx = p0[0] + a * (p1[0] - p0[0]) / d, my = p0[1] + a * (p1[1] - p0[1]) / d;
  return [[mx + hh * (p1[1] - p0[1]) / d, my - hh * (p1[0] - p0[0]) / d], [mx - hh * (p1[1] - p0[1]) / d, my + hh * (p1[0] - p0[0]) / d]];
}
const SY3_F = sy3Cells(sy3Grid(["###", "#..", "##.", "#.."]), { fill: SY3.f2, stroke: SY3.org });   // 대칭이 없는 F 모양
/* 3차시 도전: 둘레가 30 cm인 사각형 ㄱㄴㄷㄹ(ㄱㄴ 10, ㄴㄷ 5, ㄷㄹ 7, ㄹㄱ 8)과 합동인 ㅁㅂㅅㅇ */
const SY3_Q30 = (() => { const A = [0, 0], B = [10, 0], C = [10 + 5 * Math.cos(85 * Math.PI / 180), 5 * Math.sin(85 * Math.PI / 180)], X = sy3CircX(C, 7, A, 8), D = X[0][1] > X[1][1] ? X[0] : X[1]; return [A, B, C, D]; })();
/* 3차시 도전: 각이 65°·40°·75°인 삼각형 ㄱㄴㄷ과 합동인 ㄹㅁㅂ */
const SY3_T40 = (() => { const k = 5, a = k * Math.sin(65 * Math.PI / 180), c = k * Math.sin(75 * Math.PI / 180); const N = [.8, 4.2], D = [N[0] + a, N[1]], G = [N[0] + c * Math.cos(-40 * Math.PI / 180), N[1] + c * Math.sin(-40 * Math.PI / 180)]; return [G, N, D].map(p => p.map(sy3R)); })();
/* 8~9차시 활동 3·익힘, 12차시 문제 5: 점대칭 육각형·팔각형 */
function sy3PSym(lens, turns, dir0, o = {}) {   // 반쪽 변의 길이·꺾는 각으로 점대칭도형 (turns 합 = 180)
  const P = sy3Walk([0, 0], dir0, lens.concat(lens), turns.concat(turns)), bb = sy3BBox([sy3P(P)]), s = o.s || 1, pad = o.pad == null ? .8 : o.pad;
  return P.map(p => [sy3R((p[0] - bb[0]) * s + pad + (o.dx || 0)), sy3R((p[1] - bb[1]) * s + pad + (o.dy || 0))]);
}

/* ---- 차시별 그림 자료 ---- */
const SY3_ARW = {   // 2차시: 바닥 화살표 가(오른쪽)와 나·다·라·마
  가: [[1, 2], [4, 2], [4, 1], [6, 3], [4, 5], [4, 4], [1, 4]],
  나: [[14, 2], [10, 2], [10, 1], [8, 3], [10, 5], [10, 4], [14, 4]],
  다: [[19, 1], [21, 3], [20, 3], [20, 5], [18, 5], [18, 3], [17, 3]],
  라: [[4, 6], [6, 6], [6, 9], [7, 9], [5, 11], [3, 9], [4, 9]],
  마: [[16, 8], [13, 8], [13, 7], [10, 9], [13, 11], [13, 10], [16, 10]] };
const SY3_TEN = [   // 2차시 활동 3: 도형 가~차
  { label: "가", P: [[1, 1], [1, 3], [4, 3]] }, { label: "나", P: [[6, 1], [10, 1], [10, 3], [6, 3]] }, { label: "다", parts: [sy3C([13, 2], 1, { fill: SY3.f1 })] },
  { label: "라", P: [[16, 1], [19, 1], [19, 3], [16, 3]] }, { label: "자", P: [[21, 1], [21, 3], [25, 3]] },
  { label: "마", P: [[1, 5], [3, 5], [3, 9], [1, 9]] }, { label: "사", P: [[5, 6], [5, 9], [8, 9]] }, { label: "아", parts: [sy3C([11, 7], 1.5, { fill: SY3.f1 })] },
  { label: "바", parts: [sy3C([15, 7], 1, { fill: SY3.f1 })] }, { label: "차", P: [[18, 5], [20, 5], [20, 8]] }];
const SY3_TILE = [[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]];
const SY3_T1 = [[2, 1], [1, 4], [5, 4]], SY3_T2 = [[10, 1], [9, 4], [13, 4]];   // 3차시 활동 1
function sy3FigPuzzle(withPiece) {
  const H = SY3_PZH, M = H[0];
  return { box: [0, 0, 15, 6.2], k: 40, grid: false, maxW: "32em",
    shapes: [{ P: [[1, 1], [8, 1], M], fill: "#F7D6C2" }, { P: [M, [8, 1], [8, 5]], fill: "#CFE6F7" }, { P: [[1, 5], M, [8, 5]], fill: "#D7EFD9" },
      { P: H, names: ["ㅁ", "ㅂ", "ㄹ"], fill: "#FFFFFF", dash: "7 6", nameDirs: [[.6, .8], [-.7, -.7], [-.7, .7]] }].concat(withPiece ? [{ P: sy3Sh(SY3_PZT, 10, 1.5), names: ["ㄱ", "ㄴ", "ㄷ"], fill: SY3.f2 }] : []) };
}
const SY3_FLIPT = { a: [[2, 1], [1, 4], [5, 4]], b: [[12, 1], [9, 4], [13, 4]] };   // ㄱㄴㄷ / ㄹㅁㅂ(ㄱ↔ㄹ, ㄴ↔ㅂ, ㄷ↔ㅁ)
const SY3_SYM6 = [   // 4차시 활동 2·3: 도형 가~마
  { label: "가", parts: [sy3P([[2, 1], [7, 1], [5, 5], [0, 5]], { fill: SY3.f1 })], box: [-.5, 0, 7.5, 6] },
  { label: "나", parts: [sy3P([[3, 1], [6, 5], [0, 5]], { fill: SY3.f2 })], box: [-.5, 0, 6.5, 6] },
  { label: "다", parts: [sy3P([[1, 1], [4, 1], [7, 5], [0, 5]], { fill: SY3.f3 })], box: [-.5, 0, 7.5, 6] },
  { label: "라", parts: [sy3C([3.5, 3], 2.5, { fill: SY3.f4 })], box: [0, 0, 7, 6] },
  { label: "마", parts: [sy3P([[1, 1], [7, 1], [7, 5], [1, 5]], { fill: SY3.f5 })], box: [0, 0, 8, 6] }];
const SY3_AX4 = [   // 4차시 도전: 대칭축의 수 비교
  { label: "가", parts: [sy3P([[1, 1], [5, 1], [5, 5], [1, 5]], { fill: SY3.f1 })], box: [0, 0, 6, 6] },
  { label: "나", parts: [sy3P([[3, 1], [5, 5], [1, 5]], { fill: SY3.f2 })], box: [0, 0, 6, 6] },
  { label: "다", parts: [sy3P([[3, .5], [5, 3], [3, 5.5], [1, 3]], { fill: SY3.f3 })], box: [0, 0, 6, 6] },
  { label: "라", parts: [sy3P([[1, 5], [5, 5], [3, sy3R(5 - 2 * Math.sqrt(3))]], { fill: SY3.f4 })], box: [0, 0, 6, 6] }];
const SY3_GRIDHL = { ㄱ: [6, 1], ㄴ: [2, 3], ㄷ: [3, 6], ㄹ: [6, 7], ㅁ: [9, 6], ㅂ: [10, 3] };   // 5~6차시 활동 2
const SY3_GLY = {   // 글자 모양(칸)
  "ㄹ": ["#####", "....#", "#####", "#....", "#####"], "ㅁ": ["#####", "#...#", "#...#", "#...#", "#####"], "ㅍ": ["#####", ".#.#.", ".#.#.", ".#.#.", "#####"],
  "S": ["####", "#...", "####", "...#", "####"], "ㄷ": ["#####", "#....", "#....", "#....", "#####"], "ㅗ": ["..#..", "..#..", "..#..", "#####"], "ㄱ": ["#####", "....#", "....#", "....#", "....#", "....#"] };
const SY3_PENTO = { F: [".##", "##.", ".#."], I: ["#####"], L: ["#.", "#.", "#.", "##"], N: [".#", "##", "#.", "#."], P: ["##", "##", "#."], T: ["###", ".#.", ".#."], U: ["#.#", "###"], V: ["#..", "#..", "###"], W: ["#..", "##.", ".##"], X: [".#.", "###", ".#."], Y: [".#", "##", ".#", ".#"], Z: ["##.", ".#.", ".##"] };
const SY3_P89L = sy3PSym([14, 8, 10], [50, 50, 80], 200, { s: .2, pad: .6 });   // 8~9차시 활동 3 왼쪽 (ㄱㄴ 14, ㄴㄷ 8, 각 ㅂㄱㄴ 100°)
const SY3_P89R = (() => { const c = [0, 0], A = [[12, 160], [13, 215], [10, 280]].map(([r, d]) => sy3PolarPt(c, r, d)); const P = A.concat(A.map(p => [-p[0], -p[1]])); return P.map(p => [sy3R(p[0] * .2 + 9.6), sy3R(p[1] * .2 + 3.2)]); })();   // 오른쪽 (ㄴㅁ 26, ㄷㅇ 10)
const SY3_P115 = sy3PSym([8, 6, 7], [60, 65, 55], 190, { s: .38, pad: .7 });    // 익힘: 각 ㄷ 115°, 변 ㄹㅁ 8 cm
const SY3_OCT = sy3PSym([7, 11, 5, 6], [45, 45, 45, 45], 0, { s: .32, pad: .8 });   // 둘레 58 cm 팔각형
const SY3_HEX30 = sy3PSym([3, 5, 7], [60, 60, 60], 0, { s: .42, pad: .8 });       // 12차시 둘레 30 cm
const SY3_N8 = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"];
const SY3_HEXR = [0, 60, 120, 180, 240, 300].map(d => sy3PolarPt([4, 3.5], 3, d).map(sy3R));   // 정육각형
const SY3_DART = (() => {   // 12차시 정리 4: 화살촉 모양 선대칭도형(꼭대기 25°+25°, 양쪽 끝 60°·□°)
  const u = Math.PI / 180, T = [3, .5], a = 4.6, b = 1.3;
  const R1 = [T[0] + a * Math.cos(65 * u), T[1] + a * Math.sin(65 * u)], R2 = [R1[0] + b * Math.cos(185 * u), R1[1] + b * Math.sin(185 * u)];
  const d = 165 * u, t = (T[0] - R2[0]) / Math.cos(d), B = [T[0], R2[1] + t * Math.sin(d)];
  return [T, R1, R2, B, [2 * T[0] - R2[0], R2[1]], [2 * T[0] - R1[0], R1[1]]].map(p => p.map(sy3R));
})();

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 다윤이와 승현이의 미술관 나들이", soop: "개념 찾기(S)",
  question: "미술관에 있는 여러 가지 모양에는 어떤 특징이 있을까요?",
  summary: "우리 주변에는 모양과 크기가 똑같은 도형, 한 직선을 따라 접으면 완전히 겹치는 도형, 한 점을 중심으로 180° 돌리면 처음과 완전히 겹치는 도형이 많아요. 이 단원에서는 도형의 합동, 선대칭도형, 점대칭도형을 배워요.",
  steps: [
    { name: "둘러보기", inst: "다윤이와 승현이가 미술관을 방문했어요. 미술관에는 다양한 작품이 있고 판화 찍기, 색종이로 작품 만들기 같은 체험도 할 수 있대요. 작품을 하나씩 눌러 어떤 특징이 있는지 살펴보세요.", hints: ["다섯 곳을 모두 눌러 봐요.", "똑같은 모양이 여러 번 나오는 곳, 왼쪽과 오른쪽이 같은 곳, 돌려도 같은 곳을 찾아봐요."],
      render: (b, a) => sy3Museum(b, a, { spots: SY3_SPOTS,
        ask: [{ parts: ["미술관 바닥의 화살표들은 모양과 크기가 ", { o: ["같아요", "달라요"], a: 0 }, ". 색유리 창문 무늬는 ", { o: ["왼쪽과 오른쪽의 모양이 같아요", "왼쪽과 오른쪽의 모양이 달라요"], a: 0 }, "."] }],
        ok: "미술관에는 모양과 크기가 같은 화살표, 왼쪽과 오른쪽이 같은 창문 무늬, 돌려도 같은 글자 작품처럼 특별한 모양이 많아요." }) },
    { name: "데칼코마니", inst: "인도의 타지마할은 건물의 왼쪽과 오른쪽이 대칭을 이룬대요. 데칼코마니 작품도 비슷한 특징이 있어요. 접는 선 왼쪽에 물감을 찍고 반으로 접었다 펴 보세요.", hints: ["색을 고르고 접는 선 왼쪽의 칸을 눌러요.", "5칸 이상 찍은 다음 ‘반으로 접었다 펴기’를 눌러요."],
      render: (b, a) => sy3Decal(b, a, { need: 5,
        ask: [{ parts: ["펼친 종이에서 접는 선의 왼쪽과 오른쪽 무늬는 모양과 크기가 ", { o: ["같아요", "달라요"], a: 0 }, ". 접는 선을 따라 다시 접으면 두 무늬가 ", { o: ["완전히 겹쳐요", "겹치지 않아요"], a: 0 }, "."] }],
        ok: "데칼코마니는 접는 선을 따라 접으면 왼쪽과 오른쪽이 완전히 겹쳐요. 이런 모양을 이 단원에서 자세히 배워요." }) },
    { name: "떠올리기 ⑴", inst: "곰곰! 배운 내용을 떠올려요. 4학년 ‘평면도형의 이동’에서 도형을 뒤집고 돌려 보았어요. 알맞은 모양을 골라 보세요.", hints: ["오른쪽으로 뒤집으면 왼쪽과 오른쪽이 서로 바뀌어요.", "시계 방향으로 90°만큼 돌리면 위쪽에 있던 부분이 오른쪽으로 가요."],
      render: (b, a) => quiz(b, a, [
        { q: "보기 도형을 오른쪽으로 뒤집었을 때의 모양을 골라요.", fig: () => sy3RowFig([{ parts: [SY3_F], label: "보기", hl: true }, { parts: sy3D4([SY3_F], 5), label: "가" }, { parts: sy3D4([SY3_F], 4), label: "나" }, { parts: sy3D4([SY3_F], 1), label: "다" }], { maxW: "26em" }), o: ["가", "나", "다"], a: 1, why: { "0": "가는 위쪽과 아래쪽이 바뀐 모양이에요.", "2": "다는 돌린 모양이에요." } },
        { q: "보기 도형을 시계 방향으로 90°만큼 돌렸을 때의 모양을 골라요.", fig: () => sy3RowFig([{ parts: [SY3_F], label: "보기", hl: true }, { parts: sy3D4([SY3_F], 3), label: "가" }, { parts: sy3D4([SY3_F], 2), label: "나" }, { parts: sy3D4([SY3_F], 1), label: "다" }], { maxW: "26em" }), o: ["가", "나", "다"], a: 2, why: { "0": "가는 시계 반대 방향으로 90°만큼 돌린 모양이에요.", "1": "나는 180°만큼 돌린 모양이에요." } }],
        { ok: "오른쪽으로 뒤집으면 왼쪽과 오른쪽이 바뀌고, 시계 방향으로 90°만큼 돌리면 위쪽이 오른쪽으로 가요." }) },
    { name: "떠올리기 ⑵", inst: "4학년에서 배운 수직과 수선, 대각선을 떠올려 보세요.", hints: ["두 직선이 만나서 이루는 각이 직각이면 서로 수직이에요.", "대각선은 서로 이웃하지 않는 두 꼭짓점을 이은 선분이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "직선 가와 수직으로 만나는 직선을 골라요.", fig: () => sy3Fig({ box: [0, 0, 12, 6], k: 30, grid: true, maxW: "22em",
            lines: [{ p: [0, 4], q: [12, 4], color: SY3.ink, w: 3 }, { p: [3, 0], q: [3, 6], color: SY3.blue, w: 3 }, { p: [6, 6], q: [9, 0], color: SY3.green, w: 3 }, { p: [0, 1], q: [12, 1], color: SY3.purple, w: 3 }],
            texts: [{ p: [11.3, 3.5], t: "가" }, { p: [3.5, .4], t: "나", color: SY3.blue }, { p: [9.2, .5], t: "다", color: SY3.green }, { p: [11.3, .5], t: "라", color: SY3.purple }],
            arcs: [{ V: [3, 4], A: [4, 4], B: [3, 3], t: "", color: SY3.red }] }), o: ["나", "다", "라"], a: 0, why: { "1": "직선 다는 직선 가와 비스듬히 만나요.", "2": "직선 라는 직선 가와 만나지 않아요. 서로 평행해요." } },
        { q: "두 직선이 만나서 이루는 각이 직각일 때, 두 직선은 서로 무엇이라고 할까요?", o: ["수직", "평행", "대각선"], a: 0 },
        { q: "사각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분을 무엇이라고 할까요?", o: ["대각선", "수선", "높이"], a: 0 },
        { q: "사각형에 그을 수 있는 대각선은 모두 몇 개일까요?", fig: () => sy3Fig({ box: [0, 0, 7, 5], k: 30, grid: false, maxW: "12em", shapes: [{ P: [[1, 1], [5, .6], [6, 4], [.6, 4.4]], fill: SY3.f4 }], segs: [{ p: [1, 1], q: [6, 4], dash: "6 5", color: SY3.red }, { p: [5, .6], q: [.6, 4.4], dash: "6 5", color: SY3.red }] }), o: ["1개", "2개", "4개"], a: 1, why: { "2": "변 4개를 센 거예요. 대각선은 이웃하지 않는 꼭짓점끼리 이은 선분이에요." } }],
        { ok: "두 직선이 만나서 이루는 각이 직각이면 서로 수직이에요. 사각형의 대각선은 2개예요." }) },
    { name: "확인하기", inst: "이 단원에서 어떤 내용을 공부할지 생각해 보고 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "생활에서 똑같은 모양을 보았던 경험을 써 보세요.", tag: "경험", ph: "예) 포장지와 벽지에 똑같은 무늬가 되풀이되어 있었어요. 보도블록이 똑같은 모양이었어요." },
        { q: "‘합동’과 ‘대칭’은 무엇일지 짐작하여 써 보세요.", tag: "짐작", ph: "예) 합동은 모양과 크기가 같은 것, 대칭은 양쪽이 똑같은 것일 것 같아요." }]) }
  ],
  challenge: { inst: "미술관 앞 보도블록이에요. 다른 블록들과 모양과 크기가 다른 블록 하나를 찾아 눌러 보세요.", hints: ["블록마다 모눈 칸 수를 세어 봐요.", "돌려 놓은 블록도 모양과 크기는 같을 수 있어요."],
    render: (b, a) => sy3Pick(b, a, { box: [0, 0, 18, 9], k: 30, maxW: "32em", mode: "select", answer: ["마"],
      shapes: [{ label: "가", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 0, 1, 1.4), fill: SY3.f4 }, { label: "나", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 1, 6, 1.4), fill: SY3.f4 },
        { label: "다", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 2, 10, 1.4), fill: SY3.f4 }, { label: "라", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 4, 14, 1.4), fill: SY3.f4 },
        { label: "마", P: sy3Put([[0, 0], [2, 0], [2, 1], [4, 1], [4, 2], [0, 2]], 0, 2, 5.6), fill: SY3.f4 }, { label: "바", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 3, 9, 5.6), fill: SY3.f4 }],
      why: { "나": "나는 돌려 놓은 모양이에요. 모양과 크기는 같아요.", "다": "다는 돌려 놓은 모양이에요. 모양과 크기는 같아요.", "라": "라는 뒤집어 놓은 모양이에요. 모양과 크기는 같아요.", "바": "바는 돌려 놓은 모양이에요. 모양과 크기는 같아요." },
      ok: "블록 마는 아래쪽이 4칸이라서 모양과 크기가 달라요. 나머지는 돌리거나 뒤집어 놓았을 뿐 모양과 크기가 같아요." }) }
},
{
  id: "t2", no: 2, title: "도형의 합동을 알아볼까요", soop: "개념 구축하기(O)",
  question: "모양과 크기가 같은 도형은 어떻게 알 수 있을까요?",
  summary: "모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형을 서로 합동이라고 해요. 뒤집거나 돌려서 포개었을 때 완전히 겹쳐도 합동이에요. 모눈의 칸 수를 세면 합동인 도형을 찾을 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "미술관 작품 만들기 체험장이에요. 색종이 한 장에 도형을 그리고, 그 아래에 다른 색종이 한 장을 겹쳐서 오려 보세요.", hints: ["점을 3개 이상 차례로 누르고, 처음 점을 다시 눌러 도형을 닫아요.", "‘겹쳐서 오리기’를 누른 다음 ‘포개어 보기’를 눌러요."],
      render: (b, a) => sy3Cut(b, a, { ask: [{ parts: ["색종이 2장을 겹쳐서 오렸으므로 오려 낸 두 도형은 모양과 크기가 ", { o: ["같아요", "달라요"], a: 0 }, ". 두 도형을 포개면 ", { o: ["완전히 겹쳐요", "조금 남아요"], a: 0 }, "."] }],
        ok: "겹쳐서 오린 두 도형은 모양과 크기가 같아서 포개면 완전히 겹쳐요." }) },
    { name: "포개어 보기", inst: "미술관 바닥에 관람 방향을 알려 주는 화살표가 있어요. 투명 종이에 도형 가를 그렸어요. 투명 종이를 끌어 도형 나, 다, 라, 마에 각각 포개어 보고, 도형 가와 완전히 겹치는 도형을 찾아보세요.", hints: ["투명 종이를 끌어서 각 도형 위에 올려 봐요.", "방향이 다른 도형에는 투명 종이를 돌리거나 뒤집어서 포개 봐요."],
      render: (b, a) => sy3Trace(b, a, { box: [0, 0, 23, 12], k: 30, maxW: "38em",
        shapes: Object.entries(SY3_ARW).map(([l, P]) => ({ label: l, P, fill: l === "가" ? SY3.f2 : SY3.f1, labelAt: sy3Cen([sy3P(P)]) })),
        piece: { P: SY3_ARW["가"], fill: "#F7E7A6" }, visit: ["나", "다", "라", "마"], fit: ["라"],
        start: "투명 종이(노란 점선)를 끌어 다른 도형에 포개어 보세요.",
        ask: [{ parts: ["도형 가와 완전히 겹치는 도형은 ", { o: ["나", "다", "라", "마"], a: 2 }, "예요. 도형 라에 포개려면 투명 종이를 ", { o: ["밀기만 하면 됐어요", "돌리거나 뒤집어야 했어요"], a: 1 }, "."] },
          { parts: ["도형 나, 다, 마는 도형 가와 ", { o: ["모양이나 크기가 달라서", "놓인 자리가 달라서"], a: 0 }, " 완전히 겹치지 않아요."] }],
        ok: "도형 가는 도형 라와 완전히 겹쳐요. 돌려서 포개어도 완전히 겹치면 모양과 크기가 같아요." }) },
    { name: "말해 보기", inst: "포개어 본 것을 떠올리며 물음에 답해 보세요.", hints: ["뒤집거나 돌려도 도형의 모양과 크기는 변하지 않아요.", "모양이 같아도 크기가 다르면 완전히 겹치지 않아요."],
      render: (b, a) => quiz(b, a, [
        { q: "뒤집어서 포개었을 때 완전히 겹치는 두 도형도 모양과 크기가 같은 도형일까요?", o: ["네, 뒤집어서 겹쳐도 모양과 크기가 같아요.", "아니요, 뒤집은 도형은 다른 도형이에요."], a: 0, why: { "1": "뒤집어도 모양과 크기는 변하지 않아요. 뒤집어서 완전히 겹쳐도 모양과 크기가 같아요." } },
        { q: "모양은 같지만 크기가 다른 두 도형은 포개었을 때 완전히 겹칠까요?", o: ["완전히 겹쳐요.", "완전히 겹치지 않아요."], a: 1 },
        { q: "도형 옆에 똑같은 도형을 붙여 놓은 그림은 무엇이라고 할 수 있을까요?", o: ["두 도형을 합한 큰 도형", "모양과 크기가 같은 두 도형"], a: 1, why: { "0": "두 도형을 붙여 놓았어도, 각각의 도형을 포개어 보면 완전히 겹치는지 따져 봐야 해요." } }],
        { ok: "돌리거나 뒤집어서 포개어도 완전히 겹치면 모양과 크기가 같아요. 크기가 다르면 완전히 겹치지 않아요." }) },
    { name: "약속하기", inst: "약속을 완성해 보세요.", hints: ["‘합하다’가 아니라 ‘완전히 겹치다’는 뜻이에요."],
      render: (b, a) => blanks(b, a, ["모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형을 서로 ", { o: ["합동", "대칭", "평행"], a: 0 }, "이라고 합니다."], { ok: "포개었을 때 완전히 겹치는 두 도형을 서로 합동이라고 해요." }) },
    { name: "확인하기", inst: "모눈종이 위의 도형 가~차에서 서로 합동인 도형을 모두 찾아 짝 지어 보세요. 합동인 두 도형을 차례로 눌러요.", hints: ["삼각형은 밑변과 높이, 직사각형은 가로와 세로, 원은 지름의 칸 수를 세어 봐요.", "모양이 같아도 칸 수가 다르면 합동이 아니에요."],
      render: (b, a) => sy3Pick(b, a, { box: [0, 0, 26, 10], k: 28, maxW: "40em", mode: "pairs",
        shapes: SY3_TEN.map(t => ({ label: t.label, parts: t.parts || [sy3P(t.P, { fill: SY3.f1 })] })),
        ask: [{ q: "어떻게 찾았나요?", parts: [{ o: ["모눈의 칸 수를 세어서 같은 것끼리 찾았어요.", "같은 줄에 있는 것끼리 찾았어요."], a: 0 }] }],
        ok: "가와 차, 나와 마, 다와 바가 서로 합동이에요. 모눈의 칸 수를 세어 찾을 수 있어요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 합동인 도형을 찾아보세요.", hints: ["깨진 곳의 칸 수와 모양을 각 타일과 비교해요.", "자른 조각의 칸 수를 세어 봐요."],
    render: (b, a) => sy3Chain(b, a, [
      { title: "① 윤아네 집 욕실에서 깨진 타일을 새 타일로 바꾸어 붙이려고 해요. 바꾸어 붙일 수 있는 타일을 눌러 골라요.", run: (bx, ax) => sy3Pick(bx, ax, { box: [0, 0, 18, 4.4], k: 30, maxW: "32em", mode: "select", answer: ["다"],
        shapes: [{ label: "가", P: sy3Put([[0, 0], [3, 0], [3, 1], [4, 1], [4, 2], [0, 2]], 0, 6, 1.4), fill: SY3.f1 }, { label: "나", P: sy3Put([[0, 0], [1, 0], [1, 1], [3, 1], [3, 2], [0, 2]], 0, 11, 1.4), fill: SY3.f1 }, { label: "다", P: sy3Put(SY3_TILE, 1, 15, 1.4), fill: SY3.f1 }],
        after: (g, m) => { sy3DrawPart(g, sy3P(sy3Put(SY3_TILE, 0, 1, 1.4)), m, { fill: "#fff", stroke: SY3.red, dash: "7 5" }); g.append(txt(m([2.5, 0.8])[0], m([2.5, 0.8])[1], "깨진 곳", 16, { fill: SY3.red })); },
        why: { "가": "가는 깨진 곳보다 커요. 칸 수를 세어 봐요.", "나": "나는 깨진 곳과 모양이 달라요." }, ok: "타일 다를 돌려서 붙이면 깨진 곳과 완전히 겹쳐요." }) },
      { title: "② 사각형을 점선을 따라 모두 잘랐어요. 잘라 낸 도형 중 서로 합동인 도형을 짝 지어 눌러요.", run: (bx, ax) => sy3Pick(bx, ax, { box: [0, 0, 8, 6], k: 40, maxW: "18em", mode: "pairs",
        shapes: [{ label: "가", P: [[1, 1], [4, 1], [4, 5]], labelAt: [3, 2.2] }, { label: "라", P: [[1, 1], [4, 5], [1, 5]], labelAt: [2, 3.8] }, { label: "나", P: [[4, 1], [7, 1], [7, 3], [4, 3]], labelAt: [5.5, 2] }, { label: "다", P: [[4, 3], [7, 3], [7, 5], [4, 5]], labelAt: [5.5, 4] }].map(s => Object.assign(s, { fill: SY3.f3 })),
        ok: "가와 라, 나와 다가 서로 합동이에요." }) }]) }
},
{
  id: "t3", no: 3, title: "합동인 도형의 성질을 알아볼까요", soop: "개념 구축하기(O)",
  question: "서로 합동인 두 도형을 포개었을 때 겹치는 점, 변, 각에는 어떤 성질이 있을까요?",
  summary: "서로 합동인 두 도형을 완전히 겹치도록 포개었을 때 겹치는 점을 대응점, 겹치는 변을 대응변, 겹치는 각을 대응각이라고 해요. 서로 합동인 두 도형은 대응변의 길이와 대응각의 크기가 각각 같아요. 대응변과 대응각은 대응점의 순서대로 읽어요.",
  steps: [
    { name: "만져 보기", inst: "승현이가 판화 체험장에서 만든 작품이에요. 판에 새긴 삼각형 ㄱㄴㄷ을 그린 투명 종이를 찍어 낸 삼각형 ㄹㅁㅂ에 완전히 겹치도록 포개어 보세요.", hints: ["투명 종이를 끌어 오른쪽 삼각형에 올려요.", "포갠 다음 꼭짓점, 변, 각이 어떻게 겹치는지 살펴봐요."],
      render: (b, a) => sy3Chain(b, a, [
        (bx, ax) => sy3Trace(bx, ax, { box: [0, 0, 15, 5.4], k: 40, maxW: "30em", ctrl: [],
          shapes: [{ P: SY3_T1, names: ["ㄱ", "ㄴ", "ㄷ"], fill: SY3.f2 }, { label: "ㄹㅁㅂ", hideLabel: true, P: SY3_T2, names: ["ㄹ", "ㅁ", "ㅂ"], fill: SY3.f1 }],
          piece: { P: SY3_T1, names: ["ㄱ", "ㄴ", "ㄷ"], fill: "#F7E7A6" }, fit: ["ㄹㅁㅂ"], fitText: () => "삼각형 ㄹㅁㅂ에 완전히 겹치게 포개기", hitText: () => "삼각형 ㄹㅁㅂ과 완전히 겹쳐요!",
          tip: "투명 종이를 끌어서 옮겨요.", ok: "삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 완전히 겹쳐요. 두 삼각형은 서로 합동이에요." }),
        { title: "포개었을 때 겹치는 꼭짓점, 변, 각을 찾아 차례로 눌러 보세요.", run: (bx, ax) => sy3Corr(bx, ax, { box: [0, 0, 15, 5.4], k: 40, grid: false, maxW: "30em",
          shapes: [{ P: SY3_T1, names: ["ㄱ", "ㄴ", "ㄷ"], fill: SY3.f2 }, { P: SY3_T2, names: ["ㄹ", "ㅁ", "ㅂ"], fill: SY3.f1 }], demo: { type: "map", A: sy3Tr(8, 0) }, demoText: "포개어 보기",
          items: [{ k: "점", q: "ㄱ", a: "ㄹ" }, { k: "점", q: "ㄴ", a: "ㅁ" }, { k: "점", q: "ㄷ", a: "ㅂ" }, { k: "변", q: "ㄱㄴ", a: "ㄹㅁ" }, { k: "변", q: "ㄴㄷ", a: "ㅁㅂ" }, { k: "변", q: "ㄷㄱ", a: "ㅂㄹ" }, { k: "각", q: "ㄱㄴㄷ", a: "ㄹㅁㅂ" }, { k: "각", q: "ㄴㄷㄱ", a: "ㅁㅂㄹ" }, { k: "각", q: "ㄷㄱㄴ", a: "ㅂㄹㅁ" }],
          ok: "겹치는 꼭짓점은 ㄱ과 ㄹ, ㄴ과 ㅁ, ㄷ과 ㅂ이에요. 변과 각도 겹치는 꼭짓점의 순서대로 짝이 지어져요." }) }]) },
    { name: "약속하기", inst: "약속을 완성해 보세요.", hints: ["겹치는 ‘점’, ‘변’, ‘각’ 앞에 ‘대응’을 붙여요."],
      render: (b, a) => blanks(b, a, ["서로 합동인 두 도형을 완전히 겹치도록 포개었을 때 겹치는 점을 ", { o: ["대응점", "대응변", "대응각"], a: 0 }, ", 겹치는 변을 ", { o: ["대응점", "대응변", "대응각"], a: 1 }, ", 겹치는 각을 ", { o: ["대응점", "대응변", "대응각"], a: 2 }, "이라고 합니다."], { ok: "겹치는 점은 대응점, 겹치는 변은 대응변, 겹치는 각은 대응각이에요." }) },
    { name: "재어 보기", inst: "사각형 ㄱㄴㄷㄹ과 사각형 ㅁㅂㅅㅇ은 서로 합동이에요. 자와 각도기로 대응변의 길이와 대응각의 크기를 재어 비교해 보세요. (모눈 한 칸은 1 cm예요.)", hints: ["변을 누르면 길이를, 각 안쪽의 동그라미를 누르면 각의 크기를 재어 줘요.", "변 ㄱㄹ의 대응변은 변 ㅇㅁ, 각 ㄱㄴㄷ의 대응각은 각 ㅇㅅㅂ이에요."],
      render: (b, a) => sy3Measure(b, a, { box: [0, 0, 11.4, 6], k: 44, maxW: "28em", grid: true,
        shapes: [{ P: SY3_TZ1, names: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], fill: SY3.f2 }, { P: SY3_TZ2, names: ["ㅇ", "ㅅ", "ㅂ", "ㅁ"], fill: SY3.f1 }],
        segs: [{ n: "ㄱㄹ", c: [3.5, 2.5] }, { n: "ㅇㅁ", c: [9, 3.5] }, { n: "ㄹㄷ", c: [3.5, 2.5] }, { n: "ㅁㅂ", c: [9, 3.5] }, { n: "ㄷㄴ", c: [3.5, 2.5] }, { n: "ㅂㅅ", c: [9, 3.5] }, { n: "ㄴㄱ", c: [3.5, 2.5] }, { n: "ㅅㅇ", c: [9, 3.5] }],
        angs: ["ㄱㄹㄷ", "ㅇㅁㅂ", "ㄹㄷㄴ", "ㅁㅂㅅ", "ㄱㄴㄷ", "ㅇㅅㅂ", "ㄴㄱㄹ", "ㅅㅇㅁ"],
        ask: [{ parts: ["변 ㄱㄹ과 변 ㅇㅁ, 변 ㄹㄷ과 변 ㅁㅂ, 변 ㄷㄴ과 변 ㅂㅅ, 변 ㄴㄱ과 변 ㅅㅇ의 길이는 각각 ", { o: ["같아요", "달라요"], a: 0 }, "."] },
          { parts: ["각 ㄱㄹㄷ과 각 ㅇㅁㅂ은 ", { n: 90 }, "°, 각 ㄹㄷㄴ과 각 ㅁㅂㅅ은 ", { n: 90 }, "°, 각 ㄱㄴㄷ과 각 ㅇㅅㅂ은 ", { n: 45 }, "°, 각 ㄴㄱㄹ과 각 ㅅㅇㅁ은 ", { n: 135 }, "°예요."] },
          { parts: ["서로 합동인 두 도형은 ", { o: ["대응점", "대응변", "대응각"], a: 1 }, "의 길이와 ", { o: ["대응점", "대응변", "대응각"], a: 2 }, "의 크기가 각각 같습니다."] }],
        ok: "서로 합동인 두 도형은 대응변의 길이와 대응각의 크기가 각각 같아요." }) },
    { name: "구해 보기", inst: "두 사각형은 서로 합동이에요. 구하려는 변의 길이(□ cm)와 각의 크기(□°)를 구해 보세요.", hints: ["□ cm인 변의 대응변을 왼쪽 사각형에서 찾아요.", "□°인 각의 대응각을 왼쪽 사각형에서 찾아요. 110°는 다른 각이에요."],
      render: (b, a) => sy3Ask(b, a, [{ fig: () => sy3Fig(sy3FigQuad3()), parts: ["구하려는 변의 길이: ", { n: 4, why: { "5": "5 cm인 변은 □ cm인 변의 대응변이 아니에요. 두 도형을 포갰을 때 겹치는 변을 찾아요." } }, " cm, 구하려는 각의 크기: ", { n: 100, why: { "110": "110°인 각은 □°인 각의 대응각이 아니에요.", "70": "합동인 도형에서는 대응각의 크기가 같아요. 왼쪽 사각형에서 대응각을 찾아요." } }, "°"] },
        { parts: ["그렇게 구한 까닭: 서로 합동인 두 도형은 ", { o: ["대응변의 길이와 대응각의 크기가 각각 같기", "모든 변의 길이가 같기"], a: 0 }, " 때문이에요."] }],
        { ok: "대응변의 길이가 같으므로 4 cm, 대응각의 크기가 같으므로 100°예요." }) },
    { name: "확인하기", inst: "삼각형 ㄱㄴㄷ을 퍼즐의 비어 있는 부분에 채우면 퍼즐이 완성돼요. 삼각형을 돌리거나 뒤집어 빈자리에 꼭 맞게 넣어 보세요.", hints: ["빈자리의 가장 긴 변이 어느 쪽에 있는지 살펴봐요.", "시계 방향으로 90° 돌린 다음 끌어서 넣어 봐요."],
      render: (b, a) => sy3Chain(b, a, [
        (bx, ax) => sy3Trace(bx, ax, Object.assign(sy3FigPuzzle(false), {
          shapes: sy3FigPuzzle(false).shapes.map((S, i) => i === 3 ? Object.assign({}, S, { label: "빈자리", hideLabel: true, hole: true }) : S),
          piece: { P: sy3Sh(SY3_PZT, 10, 1.5), names: ["ㄱ", "ㄴ", "ㄷ"], fill: SY3.f2, stroke: SY3.org, paper: false }, fit: ["빈자리"], fitText: () => "삼각형 ㄱㄴㄷ을 빈자리에 넣기", hitText: () => "빈자리에 꼭 맞아요!",
          start: "삼각형 ㄱㄴㄷ을 돌리고 끌어서 빈자리에 넣어요.", ok: "삼각형 ㄱㄴㄷ을 시계 방향으로 90° 돌려서 넣었더니 빈자리에 꼭 맞아요." })),
        { title: "삼각형 ㄱㄴㄷ과 합동인 삼각형 ㅁㅂㄹ에서 대응점, 대응변, 대응각을 찾아 눌러 보세요.", run: (bx, ax) => sy3Corr(bx, ax, Object.assign(sy3FigPuzzle(true), { demo: { type: "map", A: (() => { const T = sy3Sh(SY3_PZT, 10, 1.5), H = SY3_PZH; return [0, 1, -1, 0, H[0][0] - (-T[0][1]), H[0][1] - T[0][0]]; })(), from: 4 }, demoText: "빈자리에 넣어 보기",
          items: [{ k: "점", q: "ㄱ", a: "ㅁ" }, { k: "점", q: "ㄴ", a: "ㅂ" }, { k: "점", q: "ㄷ", a: "ㄹ" }, { k: "변", q: "ㄱㄴ", a: "ㅁㅂ" }, { k: "변", q: "ㄴㄷ", a: "ㅂㄹ" }, { k: "변", q: "ㄷㄱ", a: "ㄹㅁ" }, { k: "각", q: "ㄱㄴㄷ", a: "ㅁㅂㄹ" }, { k: "각", q: "ㄴㄷㄱ", a: "ㅂㄹㅁ" }, { k: "각", q: "ㄷㄱㄴ", a: "ㄹㅁㅂ" }],
          ok: "점 ㄱ과 점 ㅁ, 점 ㄴ과 점 ㅂ, 점 ㄷ과 점 ㄹ이 대응점이에요. 대응변과 대응각도 대응점의 순서대로 읽어요." })) }]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 합동인 도형의 성질을 이용해 보세요.", hints: ["뒤집힌 모양에서는 대응점을 먼저 찾아요.", "합동인 삼각형에서 세 각의 크기의 합은 180°예요. 둘레는 네 변의 길이의 합이에요."],
    render: (b, a) => sy3Chain(b, a, [
      { title: "① 두 삼각형은 서로 합동이에요(한 삼각형은 뒤집힌 모양이에요).", run: (bx, ax) => sy3Corr(bx, ax, { box: [0, 0, 14, 5.2], k: 38, grid: false, maxW: "28em",
        shapes: [{ P: SY3_FLIPT.a, names: ["ㄱ", "ㄴ", "ㄷ"], fill: SY3.f2 }, { P: SY3_FLIPT.b, names: ["ㄹ", "ㅁ", "ㅂ"], fill: SY3.f1 }], demo: { type: "map", A: [-1, 0, 0, 1, 14, 0] }, demoText: "뒤집어 포개어 보기",
        items: [{ k: "점", q: "ㄴ", a: "ㅂ" }, { k: "변", q: "ㄱㄴ", a: "ㄹㅂ" }, { k: "각", q: "ㄱㄷㄴ", a: "ㄹㅁㅂ" }], ok: "점 ㄴ의 대응점은 점 ㅂ, 변 ㄱㄴ의 대응변은 변 ㄹㅂ, 각 ㄱㄷㄴ의 대응각은 각 ㄹㅁㅂ이에요." }) },
      { title: "② 물음에 답해 보세요.", run: (bx, ax) => sy3Ask(bx, ax, [
        { q: "두 사각형 ㄱㄴㄷㄹ과 ㅁㅂㅅㅇ은 서로 합동이에요. 사각형 ㄱㄴㄷㄹ의 둘레가 30 cm일 때, 변 ㄱㄴ의 길이는 몇 cm일까요?", fig: () => { const A = sy3Sh(SY3_Q30, .8, .8), B = sy3Sh(SY3_Q30, 13, .8), cA = sy3Cen([sy3P(A)]), cB = sy3Cen([sy3P(B)]); return sy3Fig({ box: [0, 0, 24.4, 8.8], k: 17, grid: false, maxW: "30em", shapes: [{ P: A, names: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], fill: SY3.f2 }, { P: B, names: ["ㅁ", "ㅂ", "ㅅ", "ㅇ"], fill: SY3.f1 }], labs: [{ a: A[1], b: A[2], t: "5 cm", c: cA }, { a: B[2], b: B[3], t: "7 cm", c: cB }, { a: B[3], b: B[0], t: "8 cm", c: cB }] }); },
          parts: ["변 ㄱㄴ: ", { n: 10, why: { "20": "5+7+8=20은 세 변의 길이의 합이에요. 둘레 30 cm에서 빼요.", "50": "둘레에서 나머지 세 변의 길이를 빼야 해요." } }, " cm"] },
        { q: "서로 합동인 두 사각형에서 대응점, 대응변, 대응각은 각각 몇 쌍일까요?", parts: ["대응점 ", { n: 4 }, "쌍, 대응변 ", { n: 4 }, "쌍, 대응각 ", { n: 4 }, "쌍"] },
        { q: "두 삼각형은 서로 합동이에요(점 ㄱ과 점 ㄹ, 점 ㄴ과 점 ㅁ, 점 ㄷ과 점 ㅂ이 대응점). 각 ㄹㅁㅂ의 크기는 몇 도일까요?", fig: () => { const A = SY3_T40, B = sy3Sh(SY3_T40, 7, 0); return sy3Fig({ box: [0, 0, 13, 5], k: 28, grid: false, maxW: "26em", shapes: [{ P: A, names: ["ㄱ", "ㄴ", "ㄷ"], fill: SY3.f2 }, { P: B, names: ["ㄹ", "ㅁ", "ㅂ"], fill: SY3.f1 }], arcs: [{ V: A[0], A: A[1], B: A[2], t: "65°", r: 18 }, { V: B[2], A: B[0], B: B[1], t: "75°", r: 18 }] }); },
          parts: ["각 ㄹㅁㅂ: ", { n: 40, why: { "65": "65°는 각 ㄱ의 크기예요. 각 ㄹ의 대응각이에요.", "75": "75°는 각 ㅂ의 크기예요.", "140": "삼각형의 세 각의 크기의 합은 180°예요. 180°에서 65°와 75°를 빼요." } }, "°"] }],
        { ok: "변 ㄱㄴ은 30−5−7−8=10 (cm), 사각형의 대응점·대응변·대응각은 각각 4쌍, 각 ㄹㅁㅂ은 180°−65°−75°=40°예요." }) }]) }
},
{
  id: "t4", no: 4, title: "선대칭도형을 알아볼까요", soop: "개념 구축하기(O)",
  question: "한 직선을 따라 접었을 때 완전히 겹치는 도형에는 어떤 특징이 있을까요?",
  summary: "한 직선을 따라 접었을 때 완전히 겹치는 도형을 선대칭도형이라고 하고, 그 직선을 대칭축이라고 해요. 대칭축을 따라 접었을 때 겹치는 점, 변, 각을 대응점, 대응변, 대응각이라고 해요. 대칭축은 도형에 따라 여러 개일 수도 있어요.",
  steps: [
    { name: "만져 보기", inst: "미술관의 색유리 창문에 있는 무늬예요. 무늬마다 주어진 빨간 선을 따라 접어 보고, 완전히 겹치는지 확인해 보세요.", hints: ["무늬를 하나씩 고르고 ‘선을 따라 접기’를 눌러요.", "다섯 무늬를 모두 접어 봐요."],
      render: (b, a) => sy3Fold(b, a, { mode: "given", items: SY3_WIN, maxW: "22em",
        ask: [{ parts: ["색유리 창문의 무늬는 주어진 선을 따라 접었을 때 ", { o: ["완전히 겹쳐요", "겹치지 않아요"], a: 0 }, "."] }],
        ok: "창문 무늬는 모두 주어진 선을 따라 접으면 완전히 겹쳐요. 그래서 반듯하고 아름다워 보여요." }) },
    { name: "그려 보기", inst: "도형 가~마를 반으로 접었을 때 완전히 겹치는 도형을 찾아보세요. 두 점을 눌러 접을 직선을 긋고 접어 보세요. 겹치는 직선을 모두 찾아요.", hints: ["세로나 가로뿐 아니라 비스듬한 방향(대각선)으로도 접어 봐요.", "도형 마는 2개, 도형 라(원)는 중심을 지나는 직선이면 어느 것이든 돼요. 가와 다는 어떻게 접어도 겹치지 않아요."],
      render: (b, a) => sy3Fold(b, a, { mode: "find", items: SY3_SYM6, k: 34, need: { "나": 1, "라": "inf", "마": 2 },
        ask: [{ parts: ["반으로 접었을 때 완전히 겹치는 도형은 ", { o: ["가", "나", "다", "라", "마"], a: [1, 3, 4], multi: true }, "예요."] },
          { parts: ["접을 수 있는 직선은 도형 나는 ", { n: 1 }, "개, 도형 마는 ", { n: 2, why: { "4": "도형 마는 직사각형이에요. 대각선을 따라 접으면 완전히 겹치지 않아요." } }, "개이고, 도형 라는 ", { o: ["1개예요", "4개예요", "셀 수 없이 많아요"], a: 2 }, "."] }],
        ok: "나, 라, 마는 반으로 접었을 때 완전히 겹쳐요. 접는 직선은 나 1개, 마 2개, 라(원)는 셀 수 없이 많아요." }) },
    { name: "약속하기", inst: "약속을 완성해 보세요.", hints: ["‘선’을 따라 접으니 선대칭도형, 접는 선은 대칭축이에요."],
      render: (b, a) => blanks(b, a, ["한 직선을 따라 접었을 때 완전히 겹치는 도형을 ", { o: ["선대칭도형", "점대칭도형", "합동"], a: 0 }, "이라고 합니다. 이때 그 직선을 ", { o: ["대칭축", "대각선", "수선"], a: 0 }, "이라고 합니다. 대칭축을 따라 접었을 때 겹치는 점을 ", { o: ["대응점", "꼭짓점"], a: 0 }, ", 겹치는 변을 ", { o: ["대응변", "대각선"], a: 0 }, ", 겹치는 각을 ", { o: ["대응각", "직각"], a: 0 }, "이라고 합니다."], { ok: "한 직선을 따라 접었을 때 완전히 겹치는 도형은 선대칭도형, 그 직선은 대칭축이에요." }) },
    { name: "말해 보기", inst: "직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이에요. 대칭축을 따라 접었을 때 겹치는 대응점, 대응변, 대응각을 찾아 눌러 보세요.", hints: ["‘접어 보기’를 눌러 어느 점끼리 겹치는지 먼저 봐요.", "점 ㄱ과 점 ㄹ은 대칭축 위에 있어서 접어도 제자리예요."],
      render: (b, a) => sy3Corr(b, a, sy3FigHL({ demo: { type: "fold", p: [4, 0], q: [4, 4] }, demoText: "대칭축을 따라 접어 보기", how: "대칭축을 따라 접었을 때",
        items: [{ k: "점", q: "ㄴ", a: "ㅂ" }, { k: "점", q: "ㄷ", a: "ㅁ" }, { k: "변", q: "ㄱㄴ", a: "ㄱㅂ" }, { k: "변", q: "ㄴㄷ", a: "ㅂㅁ" }, { k: "변", q: "ㄷㄹ", a: "ㅁㄹ" }, { k: "각", q: "ㄱㄴㄷ", a: "ㄱㅂㅁ" }, { k: "각", q: "ㄴㄷㄹ", a: "ㅂㅁㄹ" }],
        ok: "대칭축을 따라 접었을 때 겹치는 점, 변, 각을 찾으면 돼요. 점 ㄴ과 점 ㅂ, 점 ㄷ과 점 ㅁ이 대응점이에요." })) },
    { name: "확인하기", inst: "수학익힘 문제예요. 선대칭도형을 모두 찾아 눌러 보세요.", hints: ["도형마다 반으로 접을 수 있는 직선이 있는지 생각해 봐요.", "180° 돌렸을 때만 겹치는 도형은 선대칭도형이 아니에요."],
      render: (b, a) => sy3Pick(b, a, { box: [0, 0, 27, 7.4], k: 26, maxW: "40em", mode: "select", answer: ["가", "나", "라", "바"],
        shapes: [{ label: "가", P: sy3Sh([[2, 0], [4, 2], [2, 5], [0, 2]], 1, 1.4), fill: SY3.f1 }, { label: "나", P: sy3Sh([[2, 0], [4, 2], [4, 4], [0, 4], [0, 2]], 6, 1.9), fill: SY3.f2 },
          { label: "다", P: sy3Sh([[1, 0], [4, 0], [3, 3], [0, 3]], 11, 2.4), fill: SY3.f3 }, { label: "라", P: sy3Sh([[0, 0], [5, 0], [5, 1], [3, 1], [3, 4], [2, 4], [2, 1], [0, 1]], 16, 1.9), fill: SY3.f4 },
          { label: "마", parts: [sy3Cells2(["##.", ".#.", ".##"], 22, 2.4, { fill: SY3.f5 })] }, { label: "바", parts: [sy3C([25.5, 5.5], 1.4, { fill: SY3.f6 })], labelAt: [25.5, 3.6] }],
        why: { "다": "다는 평행사변형이에요. 어느 직선을 따라 접어도 완전히 겹치지 않아요.", "마": "마는 180° 돌리면 겹치지만, 접어서 완전히 겹치는 직선은 없어요." },
        ok: "가, 나, 라, 바는 한 직선을 따라 접으면 완전히 겹쳐요. 다와 마는 선대칭도형이 아니에요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 선대칭도형의 대칭축을 모두 찾아 긋고, 대칭축의 수가 적은 것부터 차례대로 써 보세요.", hints: ["꼭짓점과 꼭짓점, 꼭짓점과 변의 가운데, 변의 가운데와 변의 가운데를 이은 직선을 생각해 봐요.", "정사각형은 4개, 정삼각형은 3개예요."],
    render: (b, a) => sy3Fold(b, a, { mode: "find", items: SY3_AX4, k: 40, need: { "가": 4, "나": 1, "다": 2, "라": 3 },
      ask: [{ parts: ["대칭축의 수가 적은 것부터 차례대로: ", { o: ["가", "나", "다", "라"], a: 1 }, " → ", { o: ["가", "나", "다", "라"], a: 2 }, " → ", { o: ["가", "나", "다", "라"], a: 3 }, " → ", { o: ["가", "나", "다", "라"], a: 0 }] }],
      ok: "대칭축은 나 1개, 다 2개, 라 3개, 가 4개예요. 그래서 나, 다, 라, 가 순서예요." }) }
},
{
  id: "t56", no: "5~6", title: "선대칭도형의 성질을 알아볼까요", soop: "개념 구축하기(O)",
  question: "선대칭도형에는 어떤 성질이 있고, 그 성질을 이용하여 선대칭도형을 어떻게 완성할 수 있을까요?",
  summary: "선대칭도형은 대응변의 길이와 대응각의 크기가 각각 같아요. 대응점끼리 이은 선분은 대칭축과 수직으로 만나고, 대응점에서 대칭축까지의 거리는 같아요. 선대칭도형을 완성할 때는 ① 각 점에서 대칭축에 수선을 긋고, ② 대칭축까지의 거리가 같도록 대응점을 찾아 표시하고, ③ 각 점을 차례대로 이어요.",
  steps: [
    { name: "재어 보기", inst: "작품 만들기 체험장에서 색종이를 반으로 접어 오려 만든 선대칭도형이에요. 직선 ㅅㅇ을 대칭축으로 하는 선대칭도형에서 자와 각도기로 대응변의 길이와 대응각의 크기를 재어 보세요.", hints: ["변을 누르면 길이를, 꼭짓점 안쪽의 동그라미를 누르면 각의 크기를 재어 줘요.", "변 ㄱㄴ의 대응변은 변 ㄱㅂ, 각 ㄱㄴㄷ의 대응각은 각 ㄱㅂㅁ이에요."],
      render: (b, a) => sy3Measure(b, a, sy3FigHL({ cen: [4, 2.2], segs: ["ㄱㄴ", "ㄱㅂ", "ㄴㄷ", "ㅂㅁ", "ㄷㄹ", "ㅁㄹ"], angs: ["ㄱㄴㄷ", "ㄱㅂㅁ", "ㄴㄷㄹ", "ㅂㅁㄹ"],
        ask: [{ parts: ["변 ㄱㄴ ", { n: 3 }, " cm = 변 ㄱㅂ ", { n: 3 }, " cm, 변 ㄴㄷ ", { n: 2 }, " cm = 변 ㅂㅁ ", { n: 2 }, " cm, 변 ㄷㄹ ", { n: 3 }, " cm = 변 ㅁㄹ ", { n: 3 }, " cm"] },
          { parts: ["각 ㄱㄴㄷ ", { n: 80 }, "° = 각 ㄱㅂㅁ ", { n: 80 }, "°, 각 ㄴㄷㄹ ", { n: 100 }, "° = 각 ㅂㅁㄹ ", { n: 100 }, "°"] },
          { parts: ["선대칭도형은 ", { o: ["대응점", "대응변", "대응각"], a: 1 }, "의 길이와 ", { o: ["대응점", "대응변", "대응각"], a: 2 }, "의 크기가 각각 같습니다."] }],
        ok: "선대칭도형은 대응변의 길이와 대응각의 크기가 각각 같아요." })) },
    { name: "모눈에서 살펴보기", inst: "직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이에요. 선분 ㄴㅂ과 대칭축이 만나는 점을 점 ㅈ, 선분 ㄷㅁ과 대칭축이 만나는 점을 점 ㅊ이라고 해요. 선분의 길이(칸 수)와 대칭축과 이루는 각을 재어 보세요.", hints: ["선분 ㄴㅈ, ㅂㅈ, ㄷㅊ, ㅁㅊ을 하나씩 눌러요.", "점 ㅈ과 점 ㅊ 옆의 동그라미를 누르면 대칭축과 이루는 각을 재어 줘요."],
      render: (b, a) => { const N = SY3_GRIDHL; return sy3Measure(b, a, { box: [0, 0, 12, 8], k: 36, maxW: "26em", unit: "칸", dec: 0,
        shapes: [{ P: [N["ㄱ"], N["ㄴ"], N["ㄷ"], N["ㄹ"], N["ㅁ"], N["ㅂ"]], names: SY3_N6, fill: SY3.f3 }],
        lines: [{ p: [6, 0], q: [6, 8], color: SY3.red, dash: "9 6", w: 2.4 }, { p: N["ㄴ"], q: N["ㅂ"], color: SY3.blue, dash: "6 5", w: 2 }, { p: N["ㄷ"], q: N["ㅁ"], color: SY3.blue, dash: "6 5", w: 2 }],
        dots: [{ p: [6, 3], n: "ㅈ", d: [.75, -.75], tcolor: SY3.blue, r: 4 }, { p: [6, 6], n: "ㅊ", d: [.75, -.75], tcolor: SY3.blue, r: 4 }], texts: [{ p: [6.45, .3], t: "ㅅ", color: SY3.red }, { p: [6.45, 7.7], t: "ㅇ", color: SY3.red }],
        pts: { "ㅈ": [6, 3], "ㅊ": [6, 6], "ㅅ": [6, 0], "ㅇ": [6, 8] },
        segs: [{ n: "ㄴㅈ", w: "선분", c: [6, 0], flip: false }, { n: "ㅂㅈ", w: "선분", c: [6, 0] }, { n: "ㄷㅊ", w: "선분", c: [6, 8] }, { n: "ㅁㅊ", w: "선분", c: [6, 8] }], angs: ["ㅅㅈㄴ", "ㅇㅊㅁ"],
        ask: [{ parts: ["선분 ㄴㅈ과 선분 ㅂㅈ은 모두 모눈 ", { n: 4 }, "칸, 선분 ㄷㅊ과 선분 ㅁㅊ은 모두 모눈 ", { n: 3 }, "칸으로 같아요. 선분 ㄴㅂ, 선분 ㄷㅁ이 대칭축과 만나서 이루는 각은 모두 ", { n: 90 }, "°예요."] },
          { parts: ["선대칭도형에서 대응점끼리 이은 선분은 대칭축과 ", { o: ["수직", "평행"], a: 0 }, "으로 만나고, 대응점에서 대칭축까지의 거리는 ", { o: ["같습니다", "다릅니다"], a: 0 }, "."] }],
        ok: "대응점끼리 이은 선분은 대칭축과 수직으로 만나고, 대응점에서 대칭축까지의 거리는 같아요." }); } },
    { name: "구해 보기", inst: "직선 ㄱㄴ을 대칭축으로 하는 선대칭도형이에요. □ 안에 알맞은 수를 구해 보세요.", hints: ["왼쪽 도형: 대응변의 길이와 대응각의 크기는 같아요.", "오른쪽 도형: 대응점에서 대칭축까지의 거리는 같고, 대응점끼리 이은 선분은 대칭축과 수직이에요."],
      render: (b, a) => sy3Ask(b, a, [{ fig: () => sy3Fig(sy3FigKites()), parts: ["왼쪽 도형: ", { n: 5 }, " cm, ", { n: 100, why: { "80": "대응각의 크기는 같아요. 100°의 대응각을 찾아요." } }, "°", h("br"), "오른쪽 도형: ", { n: 4, why: { "8": "대응점끼리 이은 선분 전체가 아니라 대칭축까지의 거리를 구해요." } }, " cm, ", { n: 90, why: { "180": "대응점끼리 이은 선분과 대칭축은 수직으로 만나요." } }, "°"] }],
        { ok: "대응변의 길이가 같아 5 cm, 대응각의 크기가 같아 100°, 대칭축까지의 거리가 같아 4 cm, 수직으로 만나 90°예요." }) },
    { name: "완성 방법 찾기", inst: "직선 ㅁㅂ을 대칭축으로 하는 선대칭도형의 일부가 그려져 있어요. 점 ㄴ과 점 ㄷ의 대응점을 찾아 각각 점 ㅅ과 점 ㅇ으로 표시해 보세요. 점 ㄱ, 점 ㅅ, 점 ㅇ, 점 ㄹ을 차례대로 이으면 선대칭도형이 돼요.", hints: ["점 ㄴ에서 대칭축까지 몇 칸인지 세어 봐요. 반대쪽으로 같은 칸만큼 가요.", "‘도움선’을 켜면 각 점에서 대칭축에 그은 수선이 보여요."],
      render: (b, a) => sy3Chain(b, a, [
        (bx, ax) => sy3Complete(bx, ax, { box: [0, 0, 10, 9], k: 36, maxW: "24em", mode: "line", axis: [[5, 0], [5, 9]], axisNames: ["ㅁ", "ㅂ"],
          pts: { "ㄱ": [5, 1], "ㄴ": [1, 3], "ㄷ": [2, 7], "ㄹ": [5, 8] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅅ", of: "ㄴ" }, { n: "ㅇ", of: "ㄷ" }],
          poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅇ", "ㅅ"], half: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], nameDir: { "ㄱ": [-.8, -.6], "ㄹ": [-.8, .7] }, ok: "대칭축을 따라 접었을 때 완전히 겹쳐요." }),
        { title: "선대칭도형을 완성하는 방법을 차례대로 눌러 보세요.", run: (bx, ax) => sequence(bx, ax, ["가. 각 점을 차례대로 이어 선대칭도형을 완성합니다.", "나. 각 점에서 대칭축에 수선을 긋습니다.", "다. 각 점에서 대칭축까지의 거리가 같도록 대응점을 찾아 표시합니다."], [1, 2, 0], { ok: "① 수선 긋기 → ② 거리가 같은 대응점 표시하기 → ③ 차례대로 잇기예요." }) }]) },
    { name: "확인하기", inst: "가로로 놓인 빨간 직선을 대칭축으로 하는 선대칭도형의 일부가 그려져 있어요. 대응점을 찾아 선대칭도형을 완성해 보세요.", hints: ["대칭축이 가로로 놓여 있어요. 각 점에서 대칭축까지 세로로 몇 칸인지 세어요.", "점 ㄱ과 점 ㅁ은 대칭축 위에 있어요."],
      render: (b, a) => sy3Complete(b, a, { box: [0, 0, 10, 8], k: 36, maxW: "24em", mode: "line", axis: [[0, 4], [10, 4]],
        pts: { "ㄱ": [1, 4], "ㄴ": [2, 1], "ㄷ": [5, 2], "ㄹ": [7, 0], "ㅁ": [9, 4] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"], ["ㄹ", "ㅁ"]], miss: [{ n: "ㅂ", of: "ㄹ" }, { n: "ㅅ", of: "ㄷ" }, { n: "ㅇ", of: "ㄴ" }],
        poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"], half: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ"], nameDir: { "ㄱ": [-.8, -.6], "ㅁ": [.8, -.6], "ㄴ": [-.6, -.7], "ㄷ": [.2, -.9], "ㄹ": [.8, -.4] },
        ask: [{ q: "완성한 도형이 선대칭도형인지 어떻게 확인할 수 있을까요? 알맞은 것을 모두 골라요.", parts: [{ o: ["대칭축을 따라 접었을 때 완전히 겹치는지 알아봐요.", "대응변의 길이와 대응각의 크기가 각각 같은지 알아봐요.", "대응점끼리 이은 선분이 대칭축과 수직이고, 대칭축까지의 거리가 같은지 알아봐요.", "한 점을 중심으로 180° 돌렸을 때 겹치는지 알아봐요."], a: [0, 1, 2], multi: true, why: { "0,1,2,3": "180° 돌려서 확인하는 것은 선대칭도형을 확인하는 방법이 아니에요." } }] }],
        ok: "접어서 겹치는지, 대응변·대응각이 같은지, 대응점을 이은 선분이 대칭축과 수직이고 거리가 같은지 확인할 수 있어요." }) }
  ],
  challenge: { inst: "도전! 대칭축이 비스듬히 놓여 있어요. 먼저 각 점에서 대칭축에 수선을 그어 대응점을 찾아 선대칭도형을 완성하고, 수학익힘 문제도 풀어 보세요.", hints: ["비스듬한 대칭축에서는 모눈의 대각선 방향이 대칭축과 수직이에요.", "선대칭도형의 둘레는 그려진 쪽 변의 길이의 합의 2배예요."],
    render: (b, a) => sy3Chain(b, a, [
      (bx, ax) => sy3Complete(bx, ax, { box: [0, 0, 8, 8], k: 40, maxW: "22em", mode: "line", axis: [[0, 0], [8, 8]],
        pts: { "ㄱ": [2, 2], "ㄴ": [5, 1], "ㄷ": [7, 3], "ㄹ": [7, 7] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅁ", of: "ㄷ" }, { n: "ㅂ", of: "ㄴ" }],
        poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"], half: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], nameDir: { "ㄱ": [-.8, .5], "ㄹ": [.6, .7] }, ok: "비스듬한 대칭축에서도 수선을 그으면 대응점을 찾을 수 있어요." }),
      (bx, ax) => sy3Ask(bx, ax, [{ q: "직선 ㄱㄴ을 대칭축으로 하는 선대칭도형의 반쪽이에요. 선대칭도형을 완성했을 때 둘레는 몇 cm일까요?", fig: () => {
          const P0 = [[0, 0], [4.8, 3.6], [7.2, 3.6 + Math.sqrt(121 - 5.76)], [0, 3.6 + Math.sqrt(121 - 5.76) + Math.sqrt(81 - 51.84)]];
          const P = P0.map(p => [sy3R(p[0] * .3 + 1), sy3R(p[1] * .3 + .6)]);
          return sy3Fig({ box: [0, 0, 4.4, 7.3], k: 46, grid: false, maxW: "13em", shapes: [{ P, fill: SY3.f3 }], lines: [{ p: [1, .2], q: [1, 7.1], color: SY3.red, dash: "8 5", w: 2.2 }],
            texts: [{ p: [.65, .3], t: "ㄱ", color: SY3.red }, { p: [.65, 7.05], t: "ㄴ", color: SY3.red }],
            labs: [{ a: P[0], b: P[1], t: "6 cm", c: [1, 3] }, { a: P[1], b: P[2], t: "11 cm", c: [1, 3] }, { a: P[2], b: P[3], t: "9 cm", c: [1, 3] }] }); },
        parts: ["둘레: (6 + 11 + 9) × 2 = ", { n: 52, why: { "26": "그려진 반쪽만 더했어요. 나머지 반쪽의 대응변도 길이가 같아요." } }, " (cm)"] },
        { q: "직선 ㄱㄴ을 대칭축으로 하는 선대칭도형에서 대응점끼리 이은 선분과 대칭축이 만나는 점까지의 거리가 4 cm예요. 두 대응점 사이의 거리는 몇 cm일까요?", parts: [{ n: 8, why: { "4": "4 cm는 한 대응점에서 대칭축까지의 거리예요. 두 대응점 사이는 그 2배예요." } }, " cm"] }],
        { ok: "둘레는 52 cm, 두 대응점 사이의 거리는 4×2=8 (cm)예요." })]) }
},
{
  id: "t7", no: 7, title: "점대칭도형을 알아볼까요", soop: "개념 구축하기(O)",
  question: "어떤 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형에는 어떤 특징이 있을까요?",
  summary: "한 도형을 어떤 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치면 이 도형을 점대칭도형이라고 하고, 그 점을 대칭의 중심이라고 해요. 대칭의 중심을 중심으로 180° 돌렸을 때 겹치는 점, 변, 각을 대응점, 대응변, 대응각이라고 해요.",
  steps: [
    { name: "만져 보기", inst: "미술관 천장에 있는 글자 작품이에요. 다윤이가 “글자 작품 ‘ㄹ’에는 지금까지 보았던 작품들과는 다른 특징이 있는 것 같아.”라고 했어요. 표시된 점을 중심으로 글자를 180° 돌려 보세요.", hints: ["‘180° 돌리기’를 누르거나, ‘90° 돌리기’를 두 번 눌러요.", "흐린 글자가 돌린 모습이에요. 처음 글자와 겹치는지 봐요."],
      render: (b, a) => sy3Spin(b, a, { mode: "given", only180: true, items: [{ label: "ㄹ", name: "글자 ㄹ", parts: [sy3Cells2(SY3_GLY["ㄹ"], 1, 1, { fill: "#C9A8EE", stroke: "#5E3496" })], box: [0, 0, 7, 7], center: [3.5, 3.5] }], k: 44, cName: "ㅇ",
        ask: [{ parts: ["표시된 점을 중심으로 글자 ‘ㄹ’을 180° 돌리면 처음 글자와 ", { o: ["완전히 겹쳐요", "겹치지 않아요"], a: 0 }, "."] }],
        ok: "글자 ‘ㄹ’은 표시된 점을 중심으로 180° 돌리면 처음 글자와 완전히 겹쳐요." }) },
    { name: "그려 보기", inst: "점 ㅇ을 중심으로 도형을 90°, 180° 돌려 보세요. 몇 도 돌렸을 때 처음 도형과 완전히 겹치는지 알아봐요.", hints: ["도형마다 ‘90° 돌리기’와 ‘180° 돌리기’를 모두 해 봐요.", "‘처음으로’를 누르면 다시 처음 모양에서 돌릴 수 있어요."],
      render: (b, a) => sy3Spin(b, a, { mode: "given", cName: "ㅇ", k: 38, items: [
          { label: "가", parts: [sy3P([[3, 1], [7, 1], [5, 5], [1, 5]], { fill: SY3.f1 })], box: [0, 0, 8, 6], center: [4, 3] },
          { label: "나", parts: [sy3Cells2(["###..", "..#..", "..###"], 1, 2, { fill: SY3.f2 })], box: [0, 0, 7, 7], center: [3.5, 3.5] },
          { label: "다", parts: [sy3P([[1, 2], [4, 1], [6, 2], [6, 4], [3, 5], [1, 4]], { fill: SY3.f3 })], box: [0, 0, 7, 6], center: [3.5, 3] }],
        ask: [{ parts: ["세 도형은 모두 점 ㅇ을 중심으로 90° 돌렸을 때 처음 도형과 ", { o: ["완전히 겹쳐요", "겹치지 않아요"], a: 1 }, ". 점 ㅇ을 중심으로 ", { o: ["90°", "180°", "270°"], a: 1 }, " 돌렸을 때 처음 도형과 완전히 겹쳐요."] }],
        ok: "세 도형은 점 ㅇ을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹쳐요." }) },
    { name: "약속하기", inst: "약속을 완성해 보세요.", hints: ["‘점’을 중심으로 돌리니 점대칭도형이에요."],
      render: (b, a) => blanks(b, a, ["한 도형을 어떤 점을 중심으로 ", { o: ["90°", "180°", "360°"], a: 1 }, " 돌렸을 때 처음 도형과 완전히 겹치면 이 도형을 ", { o: ["점대칭도형", "선대칭도형"], a: 0 }, "이라고 합니다. 이때 그 점을 ", { o: ["대칭의 중심", "대칭축", "꼭짓점"], a: 0 }, "이라고 합니다. 대칭의 중심을 중심으로 180° 돌렸을 때 겹치는 점을 대응점, 겹치는 변을 대응변, 겹치는 각을 대응각이라고 합니다."], { ok: "180° 돌렸을 때 처음 도형과 완전히 겹치면 점대칭도형, 그 점은 대칭의 중심이에요." }) },
    { name: "말해 보기", inst: "도형 가~마 중에서 점대칭도형을 모두 찾아보세요. 대칭의 중심이 될 만한 점을 누르고 180° 돌려 확인해요.", hints: ["도형의 한가운데에 있는 점을 눌러 봐요.", "삼각형이나 연 모양은 어느 점을 중심으로 돌려도 처음 도형과 겹치지 않아요."],
      render: (b, a) => sy3Spin(b, a, { mode: "find", need: ["가", "라", "마"], k: 38, cName: "ㅇ", items: [
          { label: "가", parts: [sy3P([[2, 1], [6, 1], [5, 4], [1, 4]], { fill: SY3.f1 })], box: [0, 0, 7, 5] },
          { label: "나", parts: [sy3P([[3, 1], [6, 5], [0, 5]], { fill: SY3.f2 })], box: [-.5, 0, 6.5, 6] },
          { label: "다", parts: [sy3P([[3, 1], [5, 3], [3, 6], [1, 3]], { fill: SY3.f3 })], box: [0, 0, 6, 7] },
          { label: "라", parts: [sy3P([[1, 1], [6, 1], [6, 4], [1, 4]], { fill: SY3.f4 })], box: [0, 0, 7, 5] },
          { label: "마", parts: [sy3Cells2(["##..", ".##.", "..##"], 1, 1, { fill: SY3.f5 })], box: [0, 0, 6, 5] }],
        ask: [{ parts: ["점대칭도형은 ", { o: ["가", "나", "다", "라", "마"], a: [0, 3, 4], multi: true }, "예요."] },
          { parts: ["점대칭도형인지 알아보려면 대칭의 중심을 중심으로 ", { o: ["180° 돌렸을 때", "반으로 접었을 때"], a: 0 }, " 처음 도형과 완전히 겹치는지 확인해요."] }],
        ok: "가, 라, 마는 대칭의 중심을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹쳐요." }) },
    { name: "확인하기", inst: "점 ㅇ을 대칭의 중심으로 하는 점대칭도형이에요. 대칭의 중심을 중심으로 180° 돌렸을 때 겹치는 대응점, 대응변, 대응각을 찾아 눌러 보세요.", hints: ["‘180° 돌려 보기’를 눌러 어느 점끼리 겹치는지 먼저 봐요.", "점 ㄱ의 대응점은 맞은편에 있는 점 ㄹ이에요."],
      render: (b, a) => sy3Corr(b, a, sy3FigHP({ dots: [{ p: SY3_HPC, n: "ㅇ", d: [.8, -.8], color: SY3.red, tcolor: SY3.red, r: 4.5 }], demo: { type: "rot", c: SY3_HPC }, demoText: "180° 돌려 보기", how: "180° 돌렸을 때",
        items: [{ k: "점", q: "ㄱ", a: "ㄹ" }, { k: "점", q: "ㄴ", a: "ㅁ" }, { k: "점", q: "ㄷ", a: "ㅂ" }, { k: "변", q: "ㄱㄴ", a: "ㄹㅁ" }, { k: "변", q: "ㄴㄷ", a: "ㅁㅂ" }, { k: "변", q: "ㄷㄹ", a: "ㅂㄱ" }, { k: "각", q: "ㄱㄴㄷ", a: "ㄹㅁㅂ" }, { k: "각", q: "ㄴㄷㄹ", a: "ㅁㅂㄱ" }, { k: "각", q: "ㄷㄹㅁ", a: "ㅂㄱㄴ" }],
        ok: "대칭의 중심을 중심으로 180° 돌렸을 때 겹치는 점, 변, 각을 찾으면 돼요." })) }
  ],
  challenge: { inst: "수학익힘 문제예요. 글자를 보고 물음에 답해 보세요.", hints: ["글자마다 180° 돌린 모양을 머릿속으로 그려 봐요.", "접어서도 겹치고 180° 돌려도 겹치는 글자를 찾아요."],
    render: (b, a) => { const keys = ["ㄹ", "ㅁ", "ㅍ", "S", "ㄷ", "ㅗ", "ㄱ"]; let x = .8; const shapes = keys.map(k => { const C = sy3Grid(SY3_GLY[k]), w = Math.max(...C.map(c => c[0])) + 1, s = { label: k, parts: [sy3Cells(C.map(c => [c[0] + x, c[1] + 1.6]), { fill: "#F3E3C0", stroke: "#8A6248" })] }; x += w + 1.4; return s; });
      const fig = { box: [0, 0, x - .6, 8.2], k: 16, maxW: "40em", grid: false, shapes };
      sy3Chain(b, a, [
        { title: "⑴ 점대칭도형 모양인 글자를 모두 눌러 골라요.", run: (bx, ax) => sy3Pick(bx, ax, Object.assign({}, fig, { mode: "select", answer: ["ㄹ", "ㅁ", "ㅍ", "S"], why: { "ㄷ": "‘ㄷ’은 가로 직선을 따라 접으면 겹치지만 180° 돌리면 겹치지 않아요.", "ㅗ": "‘ㅗ’를 180° 돌리면 ‘ㅜ’ 모양이 돼요.", "ㄱ": "‘ㄱ’을 180° 돌리면 처음 글자와 겹치지 않아요." }, ok: "ㄹ, ㅁ, ㅍ, S는 180° 돌려도 처음 글자와 완전히 겹쳐요." })) },
        { title: "⑵ 점대칭도형이면서 선대칭도형 모양인 글자를 모두 눌러 골라요.", run: (bx, ax) => sy3Pick(bx, ax, Object.assign({}, fig, { mode: "select", answer: ["ㅁ", "ㅍ"], why: { "ㄹ": "‘ㄹ’은 점대칭도형이지만 어느 직선으로 접어도 완전히 겹치지 않아요.", "S": "‘S’는 점대칭도형이지만 어느 직선으로 접어도 완전히 겹치지 않아요.", "ㄷ": "‘ㄷ’은 점대칭도형이 아니에요.", "ㅗ": "‘ㅗ’는 점대칭도형이 아니에요." },
          ask: [{ q: "도형 ‘ㄱ’이 점대칭도형이 아닌 까닭을 골라요.", parts: [{ o: ["어떤 점을 중심으로 180° 돌려도 처음 도형과 완전히 겹치지 않기 때문이에요.", "한 직선을 따라 접었을 때 완전히 겹치기 때문이에요."], a: 0 }] }],
          ok: "ㅁ과 ㅍ은 접어도 겹치고 180° 돌려도 겹쳐요." })) }]); } }
},
{
  id: "t89", no: "8~9", title: "점대칭도형의 성질을 알아볼까요", soop: "개념 구축하기(O)",
  question: "점대칭도형에는 어떤 성질이 있고, 그 성질을 이용하여 점대칭도형을 어떻게 완성할 수 있을까요?",
  summary: "점대칭도형은 대응변의 길이와 대응각의 크기가 각각 같아요. 대칭의 중심은 대응점끼리 이은 선분을 똑같이 둘로 나눠요. 점대칭도형을 완성할 때는 ① 각 점에서 대칭의 중심을 지나는 직선을 긋고, ② 대칭의 중심까지의 거리가 같도록 대응점을 찾아 표시하고, ③ 각 점을 차례대로 이어요.",
  steps: [
    { name: "재어 보기", inst: "미술관 복도의 점대칭도형 작품이에요. 점 ㅇ을 대칭의 중심으로 하는 점대칭도형에서 자와 각도기로 대응변의 길이와 대응각의 크기를 재어 보세요.", hints: ["변을 누르면 길이를, 꼭짓점 안쪽의 동그라미를 누르면 각의 크기를 재어 줘요.", "변 ㄱㄴ의 대응변은 변 ㄹㅁ, 각 ㄱㄴㄷ의 대응각은 각 ㄹㅁㅂ이에요."],
      render: (b, a) => sy3Measure(b, a, sy3FigHP({ cen: SY3_HPC, dots: [{ p: SY3_HPC, n: "ㅇ", d: [.8, -.8], color: SY3.red, tcolor: SY3.red, r: 4.5 }],
        segs: ["ㄱㄴ", "ㄹㅁ", "ㄴㄷ", "ㅁㅂ", "ㄷㄹ", "ㅂㄱ"], angs: ["ㄱㄴㄷ", "ㄹㅁㅂ", "ㄴㄷㄹ", "ㅁㅂㄱ", "ㄷㄹㅁ", "ㅂㄱㄴ"],
        ask: [{ parts: ["변 ㄱㄴ ", { n: 1 }, " cm = 변 ㄹㅁ ", { n: 1 }, " cm, 변 ㄴㄷ ", { n: 2 }, " cm = 변 ㅁㅂ ", { n: 2 }, " cm, 변 ㄷㄹ ", { n: 2.5 }, " cm = 변 ㅂㄱ ", { n: 2.5 }, " cm"] },
          { parts: ["각 ㄱㄴㄷ ", { n: 145 }, "° = 각 ㄹㅁㅂ ", { n: 145 }, "°, 각 ㄴㄷㄹ ", { n: 140 }, "° = 각 ㅁㅂㄱ ", { n: 140 }, "°, 각 ㄷㄹㅁ ", { n: 75 }, "° = 각 ㅂㄱㄴ ", { n: 75 }, "°"] },
          { parts: ["점대칭도형은 ", { o: ["대응점", "대응변", "대응각"], a: 1 }, "의 길이와 ", { o: ["대응점", "대응변", "대응각"], a: 2 }, "의 크기가 각각 같습니다."] }],
        ok: "점대칭도형은 대응변의 길이와 대응각의 크기가 각각 같아요." })) },
    { name: "대칭의 중심 찾기", inst: "대칭의 중심이 표시되지 않은 점대칭도형이에요. 대응점끼리 각각 선분으로 이어 보세요(점 ㄱ과 점 ㄹ, 점 ㄴ과 점 ㅁ, 점 ㄷ과 점 ㅂ). 세 선분이 만나는 점을 찾아 점 ㅇ으로 표시해요.", hints: ["두 점을 차례로 눌러 선분을 그어요.", "세 선분이 모두 지나는 한 점을 눌러요."],
      render: (b, a) => sy3Join(b, a, { box: [0, 0, 5.9, 4], k: 74, grid: false, maxW: "26em", P: SY3_HP, names: SY3_N6, pairs: [["ㄱ", "ㄹ"], ["ㄴ", "ㅁ"], ["ㄷ", "ㅂ"]], per: 1, unit: "cm",
        ask: [{ parts: ["선분 ㄱㅇ과 선분 ㄹㅇ, 선분 ㄴㅇ과 선분 ㅁㅇ, 선분 ㄷㅇ과 선분 ㅂㅇ의 길이는 각각 ", { o: ["같아요", "달라요"], a: 0 }, "."] },
          { parts: ["점대칭도형에서 대칭의 중심은 대응점끼리 이은 선분을 ", { o: ["똑같이 둘로", "셋으로", "직각으로"], a: 0 }, " 나눕니다."] }],
        ok: "대칭의 중심은 대응점끼리 이은 선분을 똑같이 둘로 나눠요." }) },
    { name: "구해 보기", inst: "점 ㅇ을 대칭의 중심으로 하는 점대칭도형이에요. 오른쪽 도형에서 선분 ㄴㅁ은 26 cm, 선분 ㄷㅇ은 10 cm예요. 선분의 길이와 각의 크기를 구해 보세요.", hints: ["왼쪽: 대응변의 길이와 대응각의 크기는 같아요. 8 cm는 다른 변이에요.", "오른쪽: 대칭의 중심은 대응점끼리 이은 선분을 똑같이 둘로 나눠요."],
      render: (b, a) => sy3Ask(b, a, [{ fig: () => { const L = SY3_P89L, R = SY3_P89R, cL = sy3Cen([sy3P(L)]), cR = sy3Cen([sy3P(R)]);
          return sy3Fig({ box: [0, 0, 12.6, 5.6], k: 46, grid: false, maxW: "32em", shapes: [{ P: L, names: SY3_N6, fill: SY3.f5 }, { P: R, names: SY3_N6, fill: SY3.f1 }],
            segs: [{ p: R[1], q: R[4], color: SY3.blue, dash: "6 5", w: 2 }, { p: R[2], q: R[5], color: SY3.blue, dash: "6 5", w: 2 }],
            dots: [{ p: cL, n: "ㅇ", d: [.8, -.6], color: SY3.red, tcolor: SY3.red, r: 4 }, { p: cR, n: "ㅇ", d: [.9, .5], color: SY3.red, tcolor: SY3.red, r: 4 }],
            labs: [{ a: L[0], b: L[1], t: "14 cm", c: cL }, { a: L[1], b: L[2], t: "8 cm", c: cL }, { a: L[3], b: L[4], t: "□ cm", c: cL, color: SY3.blue }, { a: R[2], b: cR, t: "10 cm", d: 13, size: 15 }],
            arcs: [{ V: L[0], A: L[5], B: L[1], t: "100°", r: 18 }, { V: L[3], A: L[2], B: L[4], t: "□°", r: 18, color: SY3.blue }] }); },
        parts: ["왼쪽: 선분 ㄹㅁ ", { n: 14, why: { "8": "8 cm는 변 ㄴㄷ이에요. 선분 ㄹㅁ의 대응변은 변 ㄱㄴ이에요." } }, " cm, 각 ㄷㄹㅁ ", { n: 100 }, "°", h("br"), "오른쪽: 선분 ㄴㅇ ", { n: 13, why: { "26": "대칭의 중심은 선분 ㄴㅁ을 똑같이 둘로 나눠요. 26÷2를 계산해요.", "52": "선분 ㄴㅇ은 선분 ㄴㅁ의 절반이에요." } }, " cm, 선분 ㄷㅂ ", { n: 20, why: { "10": "선분 ㄷㅂ은 선분 ㄷㅇ의 2배예요.", "5": "선분 ㄷㅂ은 선분 ㄷㅇ의 2배예요." } }, " cm"] }],
        { ok: "선분 ㄹㅁ은 대응변 ㄱㄴ과 같아 14 cm, 각 ㄷㄹㅁ은 대응각 ㅂㄱㄴ과 같아 100°, 선분 ㄴㅇ은 26÷2=13 (cm), 선분 ㄷㅂ은 10×2=20 (cm)예요." }) },
    { name: "완성 방법 찾기", inst: "점 ㅇ을 대칭의 중심으로 하는 점대칭도형의 일부가 그려져 있어요. 점 ㄴ과 점 ㄷ의 대응점을 찾아 각각 점 ㅁ과 점 ㅂ으로 표시해 보세요. 점 ㄱ, 점 ㅂ, 점 ㅁ, 점 ㄹ을 차례대로 이으면 점대칭도형이 돼요.", hints: ["점 ㄴ에서 점 ㅇ까지 가로·세로로 몇 칸인지 세어 봐요. 점 ㅇ을 지나 같은 만큼 더 가요.", "‘도움선’을 켜면 각 점과 대칭의 중심을 지나는 직선이 보여요."],
      render: (b, a) => sy3Chain(b, a, [
        (bx, ax) => sy3Complete(bx, ax, { box: [0, 0, 10, 8], k: 36, maxW: "24em", mode: "point", center: [5, 4], cName: "ㅇ",
          pts: { "ㄱ": [2, 2], "ㄴ": [1, 5], "ㄷ": [4, 7], "ㄹ": [8, 6] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅁ", of: "ㄴ" }, { n: "ㅂ", of: "ㄷ" }],
          poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"], half: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], nameDir: { "ㄱ": [-.6, -.8], "ㄴ": [-.9, 0], "ㄷ": [-.4, .9], "ㄹ": [.8, .7] }, ok: "점 ㅇ을 중심으로 180° 돌렸을 때 완전히 겹쳐요." }),
        { title: "점대칭도형을 완성하는 방법을 차례대로 눌러 보세요.", run: (bx, ax) => sequence(bx, ax, ["가. 각 점에서 대칭의 중심까지의 거리가 같도록 대응점을 찾아 표시합니다.", "나. 각 점을 차례대로 이어 점대칭도형을 완성합니다.", "다. 각 점에서 대칭의 중심을 지나는 직선을 긋습니다."], [2, 0, 1], { ok: "① 대칭의 중심을 지나는 직선 긋기 → ② 거리가 같은 대응점 표시하기 → ③ 차례대로 잇기예요." }) }]) },
    { name: "확인하기", inst: "점 ㅈ을 대칭의 중심으로 하는 점대칭도형의 일부가 그려져 있어요. 대응점을 찾아 점대칭도형을 완성해 보세요. (바람개비처럼 보여요.)", hints: ["점 ㄴ의 대응점은 점 ㅈ의 반대쪽, 같은 거리에 있어요.", "점 ㄱ의 대응점은 점 ㅁ이에요. 이미 그려져 있어요."],
      render: (b, a) => sy3Complete(b, a, { box: [0, 0, 10, 8], k: 36, maxW: "24em", mode: "point", center: [5, 4], cName: "ㅈ",
        pts: { "ㄱ": [1, 4], "ㄴ": [2, 1], "ㄷ": [4, 2], "ㄹ": [6, 0], "ㅁ": [9, 4] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"], ["ㄹ", "ㅁ"]], miss: [{ n: "ㅂ", of: "ㄴ" }, { n: "ㅅ", of: "ㄷ" }, { n: "ㅇ", of: "ㄹ" }],
        poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"], half: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ"], nameDir: { "ㄱ": [-.8, -.6], "ㄴ": [-.7, -.6], "ㄷ": [-.2, .9], "ㄹ": [.8, .5], "ㅁ": [.8, -.6] },
        ask: [{ q: "완성한 도형이 점대칭도형인지 어떻게 확인할 수 있을까요? 알맞은 것을 모두 골라요.", parts: [{ o: ["대칭의 중심을 중심으로 180° 돌렸을 때 완전히 겹치는지 알아봐요.", "대응변의 길이와 대응각의 크기가 각각 같은지 알아봐요.", "대응점끼리 이은 선분이 대칭의 중심에서 똑같이 둘로 나뉘는지 알아봐요.", "대칭의 중심을 지나는 직선을 따라 접었을 때 겹치는지 알아봐요."], a: [0, 1, 2], multi: true }] }],
        ok: "180° 돌려서 겹치는지, 대응변·대응각이 같은지, 대응점을 이은 선분이 똑같이 둘로 나뉘는지 확인할 수 있어요." }) }
  ],
  challenge: { inst: "도전! 수학익힘 문제와 펜토미노 문제를 풀어 보세요.", hints: ["점대칭도형에서 대응변의 길이는 같아요. 둘레는 모든 변의 길이의 합이에요.", "펜토미노 조각마다 접어 보고, 180° 돌려 보는 모습을 떠올려요."],
    render: (b, a) => sy3Chain(b, a, [
      { title: "① 점 ㅇ을 대칭의 중심으로 하는 점대칭도형이에요.", run: (bx, ax) => sy3Ask(bx, ax, [{ fig: () => { const P = SY3_P115, c = sy3Cen([sy3P(P)]); return sy3Fig({ box: [0, 0, 7, 6], k: 44, grid: false, maxW: "20em", shapes: [{ P, names: SY3_N6, fill: SY3.f5 }], dots: [{ p: c, n: "ㅇ", d: [.8, -.6], color: SY3.red, tcolor: SY3.red, r: 4 }], labs: [{ a: P[3], b: P[4], t: "8 cm", c }], arcs: [{ V: P[2], A: P[1], B: P[3], t: "115°", r: 18 }] }); },
        parts: ["⑴ 변 ㄱㄴ의 대응변은 변 ", { nm: "ㄹㅁ" }, "이므로 변 ㄱㄴ은 ", { n: 8 }, " cm예요.", h("br"), "⑵ 각 ㄱㅂㅁ의 대응각은 각 ", { nm: "ㄹㄷㄴ", w: "5em" }, "이므로 각 ㄱㅂㅁ은 ", { n: 115 }, "°예요."] }], { ok: "변 ㄱㄴ의 대응변은 변 ㄹㅁ(8 cm), 각 ㄱㅂㅁ의 대응각은 각 ㄹㄷㄴ(115°)이에요." }) },
      { title: "② 점 ㅈ을 대칭의 중심으로 하는 점대칭도형이에요. 둘레가 58 cm일 때 물음에 답해 보세요.", run: (bx, ax) => sy3Ask(bx, ax, [{ fig: () => { const P = SY3_OCT, c = sy3Cen([sy3P(P)]); return sy3Fig({ box: [0, 0, 7.7, 7], k: 40, grid: false, maxW: "20em", shapes: [{ P, names: SY3_N8, fill: SY3.f3 }], dots: [{ p: c, n: "ㅈ", d: [.8, -.6], color: SY3.red, tcolor: SY3.red, r: 4 }], labs: [{ a: P[0], b: P[1], t: "7 cm", c }, { a: P[5], b: P[6], t: "11 cm", c }, { a: P[2], b: P[3], t: "5 cm", c }] }); },
        parts: ["⑴ 변 ㄹㅁ과 변 ㅇㄱ의 길이의 합: ", { n: 12, why: { "35": "58−(7+11+5)=35는 대응변을 한 번만 뺀 값이에요. 대응변의 길이도 같으니 (7+11+5)×2를 빼요." } }, " cm", h("br"), "⑵ 변 ㄹㅁ의 길이: ", { n: 6, why: { "12": "12 cm는 변 ㄹㅁ과 변 ㅇㄱ을 더한 길이예요. 두 변은 대응변이라 길이가 같아요." } }, " cm"] }],
        { ok: "58−(7+11+5)×2=12 (cm), 변 ㄹㅁ과 변 ㅇㄱ은 대응변이라 12÷2=6 (cm)예요." }) },
      { title: "③ 펜토미노 조각을 대칭의 종류로 나누어 보세요.", run: (bx, ax) => sy3Sort(bx, ax, { cards: Object.entries(SY3_PENTO).map(([k, r]) => ({ label: k, parts: [sy3Cells(sy3Grid(r), { fill: "#F3E3C0", stroke: "#8A6248" })] })),
        ok: "점대칭인 조각은 X, Z, I이고, 그중 X와 I는 선대칭이기도 해요. T, U, V, W는 선대칭만, F, L, N, P, Y는 둘 다 아니에요." }) }]) }
},
{
  id: "t10", no: 10, title: "생각을 더하다 ― 자연 속 선대칭도형을 그려 볼까요", soop: "탐구 정리하기(O)",
  question: "자연 속 선대칭도형 모양을 어떻게 그릴 수 있을까요?",
  summary: "대칭축을 긋고, 대칭축의 한쪽에 선분을 그은 다음, 그 선분을 대칭축에 대하여 뒤집으면 대응변이 생겨요. 이것을 되풀이하면 선대칭도형을 그릴 수 있어요. 자연물의 곡선은 짧은 선분 여러 개로 나타내요. 선대칭도형은 대응변의 길이와 대응각의 크기가 같아요.",
  steps: [
    { name: "도구 익히기", inst: "교과서에서는 공학 도구 ‘알지오매스 키즈’(xcms.kr/dtJaL2W)로 선대칭도형을 그려요. 이 앱의 그리기판도 같은 방법으로 그려요. ① 직선 도구로 점선 자리에 대칭축을 긋고, ② 선분 도구로 회색 점선을 따라 선분을 긋고, ③ 뒤집기 도구로 선분과 대칭축을 차례대로 눌러 대응변을 만들어 보세요.", hints: ["① 직선(대칭축)을 고르고 위아래 점선의 두 점을 눌러요.", "③ 뒤집기를 고른 다음, 파란 선분을 누르고 빨간 대칭축을 눌러요."],
      render: (b, a) => sy3Chain(b, a, [
        (bx, ax) => sy3Mirror(bx, ax, { cols: 12, rows: 10, k: 34, maxW: "24em", axisGuide: [[6, 0], [6, 10]], guide: [[[6, 1], [3, 3]], [[3, 3], [2, 6]], [[2, 6], [6, 9]]], ok: "대칭축의 한쪽에 그은 선분을 뒤집었더니 나뭇잎 모양 선대칭도형이 되었어요." }),
        { title: "선대칭도형을 그리는 차례를 눌러 보세요.", run: (bx, ax) => sequence(bx, ax, ["가. 선분과 대칭축을 차례대로 골라 뒤집어 대응변을 만들어요.", "나. 대칭축으로 할 직선을 그어요.", "다. 이것을 되풀이하여 선대칭도형을 완성해요.", "라. 대칭축의 한쪽에 선분을 그어요."], [1, 3, 0, 2], { ok: "직선(대칭축) → 선분 → 뒤집기 → 되풀이하기 차례예요." }) }]) },
    { name: "대칭축 긋기", inst: "선대칭도형 모양인 동물과 식물이에요. 나비, 도토리, 코스모스에 각각 대칭축을 그어 보세요. 두 점을 눌러 직선을 긋고 접어 확인해요.", hints: ["나비와 도토리는 몸의 한가운데를 세로로 지나는 직선이에요.", "코스모스는 꽃의 가운데를 지나는 직선이 여러 개 있어요."],
      render: (b, a) => sy3Fold(b, a, { mode: "find", items: SY3_PICS.map(p => Object.assign({ name: p.label }, p)), k: 36, need: { "나비": 1, "도토리": 1, "코스모스": 1 }, maxW: "22em",
        ask: [{ parts: ["나비와 도토리의 대칭축은 ", { o: ["1개", "2개"], a: 0 }, "이고, 코스모스의 대칭축은 ", { o: ["1개", "여러 개"], a: 1 }, "예요."] }],
        ok: "나비와 도토리는 가운데 세로 직선이 대칭축이고, 꽃잎이 8장인 코스모스는 대칭축이 여러 개(8개) 있어요." }) },
    { name: "그리기", inst: "승현이는 잠자리를 선대칭도형 모양으로 그렸대요. 나도 주변에서 찾은 선대칭도형 모양인 동물이나 식물을 그려 보세요. 대칭축을 긋고, 한쪽에 선분을 6개 이상 그어 뒤집어요. 다 그리면 ④ 자로 대응변의 길이를 재어 봐요.", hints: ["곡선은 짧은 선분 여러 개로 나타내요.", "④ 자를 고르고 선분을 누르면 그 선분과 대응변의 길이가 나와요."],
      render: (b, a) => sy3Mirror(b, a, { cols: 14, rows: 10, k: 32, maxW: "26em", need: 6, measure: true, needMeasure: 2,
        ask: [{ parts: ["내가 그린 선대칭도형에서 대응변의 길이는 ", { o: ["같아요", "달라요"], a: 0 }, ". 대응각의 크기도 ", { o: ["같아요", "달라요"], a: 0 }, ". 자연물의 곡선은 ", { o: ["짧은 선분 여러 개로", "점 하나로"], a: 0 }, " 나타냈어요."] }],
        ok: "선대칭도형은 대응변의 길이와 대응각의 크기가 같아요." }) },
    { name: "말해 보기", inst: "내가 그린 그림을 친구에게 설명해 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "무엇을 그렸고, 어떤 차례로 그렸나요?", tag: "그린 방법", ph: "예) 잠자리를 그렸어요. 대칭축을 긋고, 한쪽에 날개와 몸을 선분으로 그린 다음 뒤집었어요." },
        { q: "내가 그린 그림에서 선대칭도형의 성질을 찾아 써 보세요.", tag: "성질", ph: "예) 대칭축을 따라 접으면 완전히 겹치고, 대응변의 길이가 같아요." }]) },
    { name: "확인하기", inst: "선대칭도형을 그리는 방법을 확인해 보세요.", hints: ["대응변은 뒤집기로 만들어요."],
      render: (b, a) => quiz(b, a, [
        { q: "대칭축의 한쪽에 그은 선분의 대응변을 만들려면 어떤 도구를 써야 할까요?", o: ["직선", "선분", "뒤집기"], a: 2 },
        { q: "나비 날개처럼 둥근 부분은 어떻게 그리면 좋을까요?", o: ["짧은 선분 여러 개로 이어 그려요.", "대칭축을 여러 개 그어요."], a: 0 },
        { q: "선대칭도형 모양인 것을 골라요.", o: ["나비", "달팽이 껍데기", "구불구불한 강"], a: 0, why: { "1": "달팽이 껍데기는 빙빙 도는 모양이라 접어서 완전히 겹치지 않아요.", "2": "구불구불한 강은 접어서 완전히 겹치지 않아요." } }],
        { ok: "뒤집기로 대응변을 만들고, 곡선은 짧은 선분으로 나타내요. 나비는 선대칭도형 모양이에요." }) }
  ],
  challenge: { inst: "도전! 단풍잎의 반쪽이 그려져 있어요. 세로 대칭축을 기준으로 대응점을 찾아 단풍잎 모양 선대칭도형을 완성해 보세요.", hints: ["각 점에서 대칭축까지 몇 칸인지 세어 반대쪽에 같은 칸만큼 찍어요.", "대칭축 위의 점 ㄱ과 점 ㅅ은 그대로예요."],
    render: (b, a) => sy3Complete(b, a, { box: [0, 0, 12, 10], k: 32, maxW: "24em", mode: "line", axis: [[6, 0], [6, 10]],
      pts: { "ㄱ": [6, 0], "ㄴ": [4, 2], "ㄷ": [1, 2], "ㄹ": [3, 5], "ㅁ": [1, 8], "ㅂ": [5, 7], "ㅅ": [6, 10] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"], ["ㄹ", "ㅁ"], ["ㅁ", "ㅂ"], ["ㅂ", "ㅅ"]],
      miss: [{ n: "ㅇ", of: "ㄴ" }, { n: "ㅈ", of: "ㄷ" }, { n: "ㅊ", of: "ㄹ" }, { n: "ㅋ", of: "ㅁ" }, { n: "ㅌ", of: "ㅂ" }],
      poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅌ", "ㅋ", "ㅊ", "ㅈ", "ㅇ"], half: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ"], nameDir: { "ㄱ": [-.8, .6], "ㅅ": [-.8, -.4], "ㄴ": [.2, -.9], "ㄷ": [-.8, -.5], "ㄹ": [.8, .2], "ㅁ": [-.8, .4], "ㅂ": [-.6, .8] },
      ok: "단풍잎 모양 선대칭도형을 완성했어요. 대칭축을 따라 접으면 완전히 겹쳐요." }) }
},
{
  id: "t11", no: 11, title: "놀이를 더하다 ― 카드를 없애는 완벽한 방법", soop: "발표하기(P)",
  question: "도형 카드의 대칭의 종류를 빠르게 판단하여 카드를 먼저 모두 없애려면 어떻게 해야 할까요?",
  summary: "선대칭도형은 한 직선을 따라 접었을 때, 점대칭도형은 어떤 점을 중심으로 180° 돌렸을 때 완전히 겹쳐요. 선대칭도형이면서 점대칭도형인 카드는 두 가지로 모두 낼 수 있어요. 대칭의 종류를 바르게 판단하고 특별 카드를 알맞게 쓰면 카드를 먼저 없앨 수 있어요.",
  steps: [
    { name: "카드 살펴보기", inst: "놀이 전에 도형 카드를 살펴봐요. 카드마다 선대칭도형만인지, 점대칭도형만인지, 둘 다인지, 둘 다 아닌지 골라 보세요.", hints: ["먼저 접어서 겹치는 직선이 있는지 생각해요.", "다음으로 180° 돌려서 겹치는지 생각해요."],
      render: (b, a) => sy3Sort(b, a, { cards: [
          { label: "①", parts: [Object.assign({}, SY3_SHAPES.L[1], { fill: SY3_FILLK.L })] }, { label: "②", parts: [Object.assign({}, SY3_SHAPES.P[0], { fill: SY3_FILLK.P })] },
          { label: "③", parts: [Object.assign({}, SY3_SHAPES.B[4], { fill: SY3_FILLK.B })] }, { label: "④", parts: [Object.assign({}, SY3_SHAPES.N[0], { fill: SY3_FILLK.N })] },
          { label: "⑤", parts: [Object.assign({}, SY3_SHAPES.P[2], { fill: SY3_FILLK.P })] }, { label: "⑥", parts: [Object.assign({}, SY3_SHAPES.L[5], { fill: SY3_FILLK.L })] },
          { label: "⑦", parts: [Object.assign({}, SY3_SHAPES.N[1], { fill: SY3_FILLK.N })] }, { label: "⑧", parts: [Object.assign({}, SY3_SHAPES.B[1], { fill: SY3_FILLK.B })] }],
        ok: "연과 T자는 선대칭도형만, 평행사변형과 계단 모양은 점대칭도형만, 십자 모양과 마름모는 둘 다, 삼각형과 L자는 둘 다 아니에요." }) },
    { name: "규칙 알기", inst: "‘카드를 없애는 완벽한 방법’ 놀이 규칙을 알아봐요. 3명이 하는 놀이예요. 카드를 5장씩 나누어 갖고, 내용이 보이도록 놓은 카드와 같은 종류의 대칭인 카드를 내려놓으며 어떤 도형인지 외쳐요.", hints: ["특별 카드 ①은 2장 선물, ②는 순서 바꾸기, ③은 보이는 카드 바꾸기예요.", "선대칭도형이면서 점대칭도형인 카드는 선대칭도형일 때도, 점대칭도형일 때도 낼 수 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "특별 카드 ①을 내면 어떻게 될까요?", o: ["다음 차례의 친구에게 쌓아 둔 카드에서 2장을 선물해요.", "놀이 진행 순서를 바꿔요.", "내용이 보이도록 놓은 카드를 바꿔요."], a: 0 },
        { q: "특별 카드 ②를 내면 어떻게 될까요?", o: ["다음 차례의 친구에게 쌓아 둔 카드에서 2장을 선물해요.", "놀이 진행 순서를 바꿔요.", "내용이 보이도록 놓은 카드를 바꿔요."], a: 1 },
        { q: "특별 카드 ③을 내면 어떻게 될까요?", o: ["다음 차례의 친구에게 쌓아 둔 카드에서 2장을 선물해요.", "놀이 진행 순서를 바꿔요.", "내용이 보이도록 놓은 카드를 바꿔요."], a: 2 },
        { q: "내려놓을 카드가 없으면 어떻게 할까요?", o: ["뒤집어 쌓아 둔 카드에서 한 장을 가져와요.", "아무 카드나 내려놓아요."], a: 0 },
        { q: "가지고 있는 카드가 한 장 남으면 무엇이라고 외칠까요?", o: ["대칭!", "합동!", "끝!"], a: 0 },
        { q: "보이는 카드가 직사각형(선대칭도형이면서 점대칭도형)이에요. 평행사변형 카드를 낼 수 있을까요?", fig: () => sy3RowFig([{ parts: [sy3P([[0, 0], [5, 0], [5, 3], [0, 3]], { fill: SY3_FILLK.B })], label: "보이는 카드", hl: true }, { parts: [sy3P([[1, 0], [4, 0], [3, 2], [0, 2]], { fill: SY3_FILLK.P })], label: "내 카드" }], { maxW: "16em" }), o: ["“점대칭도형!” 하고 낼 수 있어요.", "“선대칭도형!” 하고 낼 수 있어요.", "낼 수 없어요."], a: 0, why: { "1": "평행사변형은 선대칭도형이 아니에요.", "2": "직사각형도 평행사변형도 점대칭도형이라 같은 종류의 대칭이에요." } }],
        { ok: "규칙을 모두 알았어요. 이제 놀이를 해 봐요!" }) },
    { name: "놀이하기", inst: "나, 다윤, 승현 셋이서 놀이를 해요. 내 차례에 카드를 고르고, 그 카드가 어떤 도형인지 외치는 단추를 눌러 내려놓아요. 카드가 한 장 남으면 재빨리 ‘대칭!’ 단추를 눌러요. 놀이를 한 판 끝까지 해 보세요.", hints: ["보이는 카드와 같은 종류의 대칭이 있어야 낼 수 있어요. 흐린 카드는 지금 낼 수 없는 카드예요.", "도형을 잘못 외치면 카드를 내지 못하고 차례가 넘어가요."],
      render: (b, a) => sy3Uno(b, a, { deck: SY3_DECK, ok: "놀이를 끝까지 했어요! 대칭의 종류를 빠르게 판단하는 연습이 되었나요?" }) },
    { name: "전략 말하기", inst: "놀이를 하며 생각한 것을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 이기려면 어떻게 해야 할까요?", tag: "전략", ph: "예) 둘 다인 카드는 어느 쪽으로도 낼 수 있으니 아껴 두었다가 낼 카드가 없을 때 내요. 특별 카드를 알맞을 때 써요." },
        { q: "놀이할 때 주의할 점은 무엇일까요?", tag: "주의할 점", ph: "예) 선대칭도형인지 점대칭도형인지 잘 판단해서 내요. 다른 사람의 카드가 몇 장인지 잘 살펴봐요." }]) },
    { name: "확인하기", inst: "놀이 상황에서 알맞은 것을 골라 보세요.", hints: ["보이는 카드와 내 카드에 함께 있는 대칭의 종류를 찾아요."],
      render: (b, a) => quiz(b, a, [
        { q: "보이는 카드가 이등변삼각형(선대칭도형)이에요. 낼 수 있는 카드를 모두 골라요.", fig: () => sy3RowFig([{ parts: [sy3P([[2, 0], [4, 4], [0, 4]], { fill: SY3_FILLK.L })], label: "보이는 카드", hl: true }, { parts: [sy3C([2, 2], 2, { fill: SY3_FILLK.B })], label: "가" }, { parts: [sy3P([[1, 0], [4, 0], [3, 2], [0, 2]], { fill: SY3_FILLK.P })], label: "나" }, { parts: [SY3_SHAPES.L[4]], label: "다" }], { maxW: "28em" }), o: ["가", "나", "다"], a: [0, 2], why: {} },
        { q: "보이는 카드가 평행사변형이에요. 원 카드를 내며 무엇이라고 외쳐야 할까요?", o: ["선대칭도형!", "점대칭도형!", "둘 다 아닌 도형!"], a: 1, why: { "0": "원은 선대칭도형이기도 하지만, 평행사변형은 선대칭도형이 아니라서 같은 종류의 대칭이 아니에요." } }],
        { ok: "원과 화살표는 선대칭도형이라 낼 수 있어요. 평행사변형 위에 원을 낼 때는 “점대칭도형!”이라고 외쳐요." }) }
  ],
  challenge: { inst: "또 다른 놀이 방법이에요. 선대칭도형 카드, 점대칭도형 카드, 선대칭도형도 점대칭도형도 아닌 도형 카드를 뒤집어 놓았어요. 컴퓨터와 번갈아 카드 2장을 펼쳐 대칭의 종류가 같으면 가져가요. 카드를 더 많이 가져가면 이겨요.", hints: ["펼친 두 카드를 보고 대칭의 종류가 같은지 판단해 단추를 눌러요.", "펼쳤던 카드의 자리를 기억해 두면 유리해요."],
    render: (b, a) => sy3Memory(b, a, { cards: SY3_MEM, ok: "놀이를 끝까지 했어요!" }) }
},
{
  id: "t12", no: 12, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "합동과 대칭에 대해 공부한 내용을 정리하고 문제를 해결할 수 있을까요?",
  summary: "포개었을 때 완전히 겹치는 두 도형은 합동이고, 대응변의 길이와 대응각의 크기가 같아요. 한 직선을 따라 접어 완전히 겹치면 선대칭도형, 한 점을 중심으로 180° 돌려 완전히 겹치면 점대칭도형이에요. 대응변과 대응각은 대응점의 순서대로 읽어요.",
  steps: [
    { name: "합동", inst: "1번, 2번 문제예요. 도형 가와 합동인 도형을 찾아 눌러 보세요.", hints: ["모눈의 칸 수를 세어 도형 가와 포개었을 때 완전히 겹치는 도형을 찾아요.", "대응변은 대응점의 순서대로 읽어요. 점 ㄱ의 대응점은 점 ㅅ이에요."],
      render: (b, a) => sy3Chain(b, a, [
        (bx, ax) => sy3Pick(bx, ax, { box: [0, 0, 20, 6], k: 30, maxW: "34em", mode: "select", answer: ["다"],
          shapes: [{ label: "가", P: sy3Put([[0, 0], [3, 0], [3, 2], [1, 3], [0, 2]], 0, 1, 1.5), fill: SY3.f2 }, { label: "나", P: sy3Put([[0, 0], [4, 0], [4, 3], [1, 4], [0, 3]], 0, 5.5, 1.5), fill: SY3.f1 },
            { label: "다", P: sy3Put([[0, 0], [3, 0], [3, 2], [1, 3], [0, 2]], 1, 11, 1.5), fill: SY3.f1 }, { label: "라", P: sy3Put([[0, 0], [3, 0], [3, 3], [1, 3], [0, 2]], 0, 15.5, 1.5), fill: SY3.f1 }],
          why: { "가": "도형 가는 비교하는 도형이에요.", "나": "나는 도형 가보다 커요.", "라": "라는 꼭짓점 하나의 자리가 달라요. 칸 수를 세어 봐요." }, ok: "도형 다를 돌려서 포개면 도형 가와 완전히 겹쳐요." }),
        { title: "두 도형은 서로 합동이에요. 변 ㄱㄴ의 대응변과 각 ㄴㄷㄹ의 대응각을 대응점의 순서대로 눌러 보세요.", run: (bx, ax) => sy3Corr(bx, ax, { box: [0, 0, 15, 5], k: 36, grid: false, maxW: "28em",
          shapes: [{ P: [[1, 1], [1, 4], [5, 4], [4, 1]], names: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], fill: SY3.f2 }, { P: [[10, 1], [11, 4], [14, 4], [14, 1]], names: ["ㅁ", "ㅂ", "ㅅ", "ㅇ"], fill: SY3.f1 }],
          demo: { type: "map", A: [-1, 0, 0, -1, 15, 5] }, demoText: "포개어 보기",
          items: [{ k: "변", q: "ㄱㄴ", a: "ㅅㅇ" }, { k: "각", q: "ㄴㄷㄹ", a: "ㅇㅁㅂ" }], ok: "변 ㄱㄴ의 대응변은 변 ㅅㅇ, 각 ㄴㄷㄹ의 대응각은 각 ㅇㅁㅂ이에요. ‘변 ㅇㅅ’, ‘각 ㅂㅁㅇ’처럼 순서를 바꾸어 읽지 않아요." }) }]) },
    { name: "대칭축", inst: "3번 문제예요. 선대칭도형의 대칭축을 모두 찾아 긋고, 대칭축의 수가 많은 것부터 차례대로 써 보세요.", hints: ["정육각형은 마주 보는 꼭짓점끼리, 마주 보는 변의 가운데끼리 이은 직선이 대칭축이에요.", "가 1개, 나 2개, 다 6개예요."],
      render: (b, a) => sy3Fold(b, a, { mode: "find", k: 34, need: { "가": 1, "나": 2, "다": 6 }, items: [
          { label: "가", parts: [sy3P([[2, 1], [5, 1], [7, 5], [0, 5]], { fill: SY3.f1 })], box: [-.5, 0, 7.5, 6] },
          { label: "나", parts: [sy3P([[1, 1], [7, 1], [7, 5], [1, 5]], { fill: SY3.f2 })], box: [0, 0, 8, 6] },
          { label: "다", parts: [sy3P(SY3_HEXR, { fill: SY3.f3 })], box: [0, 0, 8, 7] }],
        ask: [{ parts: ["대칭축의 수가 많은 것부터 차례대로: ", { o: ["가", "나", "다"], a: 2 }, " → ", { o: ["가", "나", "다"], a: 1 }, " → ", { o: ["가", "나", "다"], a: 0 }] }],
        ok: "대칭축은 다 6개, 나 2개, 가 1개예요. 그래서 다, 나, 가 순서예요." }) },
    { name: "완성하기", inst: "4번 문제예요. 선대칭도형과 점대칭도형을 각각 완성해 보세요.", hints: ["선대칭도형: 대칭축까지의 거리가 같도록 반대쪽에 점을 찍어요.", "점대칭도형: 대칭의 중심을 지나 같은 거리만큼 더 간 곳에 점을 찍어요."],
      render: (b, a) => sy3Chain(b, a, [
        { title: "① 선대칭도형", run: (bx, ax) => sy3Complete(bx, ax, { box: [0, 0, 10, 7], k: 34, maxW: "22em", mode: "line", axis: [[5, 0], [5, 7]],
          pts: { "ㄱ": [5, 1], "ㄴ": [2, 2], "ㄷ": [3, 5], "ㄹ": [5, 6] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅁ", of: "ㄷ" }, { n: "ㅂ", of: "ㄴ" }],
          poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"], half: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], nameDir: { "ㄱ": [-.8, -.6], "ㄹ": [-.8, .6] }, ok: "선대칭도형을 완성했어요." }) },
        { title: "② 점대칭도형", run: (bx, ax) => sy3Complete(bx, ax, { box: [0, 0, 8, 6], k: 38, maxW: "22em", mode: "point", center: [4, 3], cName: "ㅇ",
          pts: { "ㄱ": [1, 3], "ㄴ": [2, 0], "ㄷ": [5, 1], "ㄹ": [7, 3] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅁ", of: "ㄴ" }, { n: "ㅂ", of: "ㄷ" }],
          poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"], half: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], nameDir: { "ㄱ": [-.8, -.4], "ㄴ": [-.7, -.5], "ㄷ": [.6, -.7], "ㄹ": [.8, -.4] }, ok: "점대칭도형을 완성했어요." }) }]) },
    { name: "둘레·표지판", inst: "5번, 6번 문제예요. 점대칭도형의 성질로 둘레를 구하고, 교통안전 체험관의 표지판을 대칭의 종류로 나누어 보세요.", hints: ["변 ㄴㄷ은 변 ㅁㅂ, 변 ㄹㅁ은 변 ㄱㄴ, 변 ㅂㄱ은 변 ㄷㄹ과 대응변이에요.", "표지판마다 접어 보고, 180° 돌려 보는 모습을 떠올려요."],
      render: (b, a) => sy3Chain(b, a, [
        { title: "5. 점 ㅇ을 대칭의 중심으로 하는 점대칭도형의 둘레를 구해요.", run: (bx, ax) => sy3Ask(bx, ax, [{ fig: () => { const P = SY3_HEX30, c = sy3Cen([sy3P(P)]); return sy3Fig({ box: [0, 0, 5.4, 6], k: 50, grid: false, maxW: "17em", shapes: [{ P, names: SY3_N6, fill: SY3.f1 }], dots: [{ p: c, n: "ㅇ", d: [.8, -.6], color: SY3.red, tcolor: SY3.red, r: 4 }], labs: [{ a: P[0], b: P[1], t: "3 cm", c }, { a: P[4], b: P[5], t: "5 cm", c }, { a: P[2], b: P[3], t: "7 cm", c }] }); },
          parts: ["변 ㄴㄷ은 변 ㅁㅂ과 대응변이라 ", { n: 5 }, " cm, 변 ㄹㅁ은 변 ㄱㄴ과 대응변이라 ", { n: 3 }, " cm, 변 ㅂㄱ은 변 ㄷㄹ과 대응변이라 ", { n: 7 }, " cm예요.", h("br"), "둘레: (5 + 3 + 7) × 2 = ", { n: 30, why: { "15": "나머지 세 변의 길이도 더해야 해요. 대응변끼리 길이가 같으니 2배 해요." } }, " (cm)"] }], { ok: "둘레는 (5+3+7)×2=30 (cm)예요." }) },
        { title: "6. 표지판을 대칭의 종류로 나누어요.", run: (bx, ax) => sy3Sort(bx, ax, { cards: SY3_SIGNS,
          ask: [{ parts: ["선대칭도형 모양인 표지판은 ", { o: ["가", "나", "다", "라", "마"], a: [0, 1, 4], multi: true }, ", 점대칭도형 모양인 표지판은 ", { o: ["가", "나", "다", "라", "마"], a: [3, 4], multi: true }, ", 선대칭도형 모양이면서 점대칭도형 모양인 표지판은 ", { o: ["가", "나", "다", "라", "마"], a: 4 }, "예요."] }],
          ok: "선대칭도형 모양은 가, 나, 마, 점대칭도형 모양은 라, 마, 둘 다인 것은 마예요." }) }]) },
    { name: "확인하고 정리해요", inst: "이 단원에서 배운 내용을 정리해 보세요.", hints: ["합동인 도형, 선대칭도형, 점대칭도형 모두 대응변의 길이와 대응각의 크기가 같아요.", "대칭의 중심은 대응점끼리 이은 선분을 똑같이 둘로 나눠요."],
      render: (b, a) => sy3Ask(b, a, [
        { parts: ["1. 모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형을 서로 ", { o: ["합동", "대칭"], a: 0 }, "이라고 해요."] },
        { q: "2. 서로 합동인 두 도형은 대응변의 길이가 같아요.", fig: () => { const A = SY3_T1, B = SY3_T1.map(p => [sy3R(-p[0] + 15), sy3R(-p[1] + 5)]); return sy3Fig({ box: [0, 0, 15, 5], k: 26, grid: false, maxW: "22em", shapes: [{ P: A, fill: SY3.f2 }, { P: B, fill: SY3.f1 }], labs: [{ a: A[1], b: A[2], t: "6 cm", c: sy3Cen([sy3P(A)]) }, { a: B[1], b: B[2], t: "□ cm", c: sy3Cen([sy3P(B)]), color: SY3.blue }] }); }, parts: ["□ = ", { n: 6 }, " cm"] },
        { parts: ["3. 한 직선을 따라 접었을 때 완전히 겹치는 도형을 ", { o: ["선대칭도형", "점대칭도형"], a: 0 }, "이라고 해요."] },
        { q: "4. 선대칭도형은 대응각의 크기가 같아요.", fig: () => { const P = SY3_DART; return sy3Fig({ box: [0, 0, 6, 5.4], k: 40, grid: false, maxW: "14em", shapes: [{ P, fill: SY3.f3 }], lines: [{ p: [3, .1], q: [3, 5.3], color: SY3.red, dash: "8 5", w: 2 }], arcs: [{ V: P[0], A: [3, 3], B: P[1], t: "25°", r: 30, tr: 16, size: 14 }, { V: P[0], A: P[5], B: [3, 3], t: "25°", r: 30, tr: 16, size: 14 }, { V: P[5], A: P[0], B: P[4], t: "60°", r: 16 }, { V: P[1], A: P[2], B: P[0], t: "□°", r: 16, color: SY3.blue }] }); }, parts: ["□ = ", { n: 60, why: { "25": "25°는 대칭축 양쪽의 각이에요. □°의 대응각은 60°인 각이에요." } }, "°"] },
        { parts: ["5. 한 도형을 어떤 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치면 이 도형을 ", { o: ["선대칭도형", "점대칭도형"], a: 1 }, "이라고 해요."] },
        { q: "6. 점대칭도형에서 대칭의 중심은 대응점끼리 이은 선분을 똑같이 둘로 나눠요.", fig: () => { const O = [5, 2.4], A = [1, 2.4], C = [9, 2.4], B = [6.2, .8], D = [3.8, 4]; return sy3Fig({ box: [0, 0, 10, 4.8], k: 34, grid: false, maxW: "20em", shapes: [{ P: [A, B, C, D], fill: SY3.f5 }], segs: [{ p: A, q: C, color: SY3.blue, dash: "6 5", w: 2 }, { p: B, q: D, color: SY3.blue, dash: "6 5", w: 2 }], dots: [{ p: O, color: SY3.red, r: 4 }], labs: [{ a: A, b: O, t: "4 cm", flip: true, d: 12, size: 15 }, { a: O, b: C, t: "4 cm", flip: true, d: 12, size: 15 }, { a: O, b: B, t: "2 cm", d: 13, size: 15 }, { a: D, b: O, t: "□ cm", d: 13, size: 15, color: SY3.blue }] }); }, parts: ["□ = ", { n: 2, why: { "4": "4 cm는 다른 선분이에요. □ cm인 선분과 짝을 이루는 선분은 2 cm예요." } }, " cm"] }],
        { ok: "합동, 선대칭도형, 점대칭도형과 그 성질을 모두 정리했어요." }) }
  ],
  challenge: { inst: "도전! 가로 대칭축과 세로 대칭축이 있는 선대칭도형이면서, 두 대칭축이 만나는 점을 대칭의 중심으로 하는 점대칭도형이에요. 그려진 부분을 보고 나머지 대응점을 모두 찾아 도형을 완성해 보세요.", hints: ["세로 대칭축에 대하여 뒤집으면 점 ㅁ, ㅂ, ㅅ, 가로 대칭축에 대하여 뒤집으면 점 ㅊ, ㅋ, ㅌ을 찾을 수 있어요.", "점 ㅇ과 점 ㅈ은 대칭의 중심을 중심으로 180° 돌려서 찾아요."],
    render: (b, a) => { const RX = sy3Refl([5, 0], [5, 10]), RY = sy3Refl([0, 5], [10, 5]), RO = sy3Rot([5, 5], 180);
      return sy3Complete(b, a, { box: [0, 0, 10, 10], k: 30, maxW: "24em", mode: "line", axis: [[5, 0], [5, 10]], lines2: [[[0, 5], [10, 5]]], guide: false,
        pts: { "ㄱ": [5, 1], "ㄴ": [3, 2], "ㄷ": [2, 4], "ㄹ": [1, 5] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]],
        miss: [{ n: "ㅁ", of: "ㄴ", A: RX, how: "세로 대칭축" }, { n: "ㅂ", of: "ㄷ", A: RX, how: "세로 대칭축" }, { n: "ㅅ", of: "ㄹ", A: RX, how: "세로 대칭축" }, { n: "ㅇ", of: "ㄷ", A: RO, how: "대칭의 중심" }, { n: "ㅈ", of: "ㄴ", A: RO, how: "대칭의 중심" }, { n: "ㅊ", of: "ㄱ", A: RY, how: "가로 대칭축" }, { n: "ㅋ", of: "ㄴ", A: RY, how: "가로 대칭축" }, { n: "ㅌ", of: "ㄷ", A: RY, how: "가로 대칭축" }],
        poly: ["ㄱ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㄹ", "ㄷ", "ㄴ"], nameDir: { "ㄱ": [-.8, -.6], "ㄹ": [-.6, -.8], "ㄴ": [-.6, -.7], "ㄷ": [-.8, -.4] },
        ask: [{ parts: ["완성한 도형은 대칭축이 ", { n: 2 }, "개인 선대칭도형이면서 점대칭도형이에요."] }],
        ok: "가로·세로 대칭축에 대하여 뒤집고, 대칭의 중심을 중심으로 180° 돌려서 대응점을 모두 찾았어요." }); } }
}
];
