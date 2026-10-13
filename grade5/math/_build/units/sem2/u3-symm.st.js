//@@APP
const APP={title:"우리 반 대칭 무늬 공방", unit:"5-2 수학 3. 합동과 대칭", key:"s52-symm-v1", welcome:"우리 반 대칭 무늬 공방에 온 것을 환영해요", intro:"한빛초등학교 5학년 3반이 가을 축제에서 ‘대칭 무늬 공방’ 부스를 열어요. 똑같은 배지와 타일을 오리고, 종이를 접어 무늬를 만들고, 돌려도 같은 바람개비를 만들며 도형의 합동과 선대칭도형·점대칭도형을 알아봐요."};
//@@UNIT
/* =========================================================
   5-2 수학 3. 합동과 대칭 — 이야기 버전 단원 조작 부품 (앞글자 sy3, 이야기 전용 sy3s)
   교과서 버전(u3-symm.tb.js)의 sy3 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   기다리는 시간: 수·이름 칸 900ms(Enter는 blur) · 보기 고르기 260ms(수 칸과 함께면 600ms) · 도형 고르기 700ms · 카드 나누기 600ms · 점 찍기 1200ms.
   한 계단에 활동이 둘이면(hj-multi) 부품 함수 몸통에 done( 이 있어야 활동으로 세어져요 — 부품마다 fin(…)이 sy3Finish 또는 api.done으로 끝내요.
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
const SY3_JAMO = { "ㄳ": "ㄱㅅ", "ㄵ": "ㄴㅈ", "ㄶ": "ㄴㅎ", "ㄺ": "ㄹㄱ", "ㄻ": "ㄹㅁ", "ㄼ": "ㄹㅂ", "ㄽ": "ㄹㅅ", "ㄾ": "ㄹㅌ", "ㄿ": "ㄹㅍ", "ㅀ": "ㄹㅎ", "ㅄ": "ㅂㅅ" };
const sy3Nm = s => String(s == null ? "" : s).replace(/[ㄳㄵㄶㄺ-ㅀㅄ]/g, c => SY3_JAMO[c] || c).replace(/[^ㄱ-ㅎ]/g, "");   // 자판에서 ㄹ+ㅁ이 ‘ㄻ’로 합쳐져도 풀어 읽음
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

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기·이름 쓰기) — '확인하기' 단추 없이 저절로 확인 ----------
   보기 고르기 260ms(수 칸이 함께 있으면 600ms), 수·이름 칸 900ms(Enter는 blur) 뒤에 확인. 모든 칸을 채워야 확인해요. */
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
  const filled = s => s.pt.o ? (s.pt.multi ? s.v.size >= s.pt.a.length : s.v != null) : s.pt.nm != null ? sy3Nm(s.inp.value).length >= s.pt.nm.length : s.inp.value.trim() !== "";
  const check = () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) { [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); }); }
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) { all.forEach(s => { if (s.inp) s.inp.readOnly = true; }); api.done(ans, opts.ok); return true; }
    let key;
    if (bad.pt.o) key = bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v);
    else if (bad.pt.nm != null) { key = sy3Nm(bad.inp.value); if (bad.pt.nm.length > 1 && key === [...bad.pt.nm].reverse().join("") && !(bad.pt.why && bad.pt.why[key])) { api.fail("대응점의 순서대로 읽어야 해요. 순서를 다시 살펴봐요.", ans); return false; } }
    else key = String(sy3Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
    return false;
  };
  const hasIn = all.some(s => !s.pt.o);
  const kick = autoRun(() => all.every(filled), () => all.map(val).join("\u0001") + "|" + all.map(s => s.v instanceof Set ? [...s.v].sort().join(",") : "").join(";"), check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) later(hasIn ? 600 : 260); });
  all.forEach(s => { if (!s.inp) return;
    s.inp.addEventListener("input", e => { s.inp.style.borderColor = ""; if (!e.isComposing) later(900); });
    s.inp.addEventListener("compositionend", () => later(900));
    s.inp.addEventListener("change", () => later(200));
    s.inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); s.inp.blur(); } }); });
  host.append(wrap);
  return wrap;
}
/* 조작을 마친 뒤: then(이어서 할 활동) → ask(물음)이면 true, 없으면 false(부품의 fin이 api.done) */
function sy3Finish(body, api, opt, ans, msg, data) {
  const go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "sy3part" }); body.append(box); opt.then(box, api, data); go(box); return true; }
  const ask = typeof opt.ask === "function" ? opt.ask(data) : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = sy3Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle, bad: opt.bad }); go(w); return true; }
  return false;   // 부품이 api.done으로 바로 해결
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
      fin("포개기: " + [...fitted].join(", "), opt.doneMsg || "잘 포개었어요!");
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
        if (found === want) { done = true; fin("합동인 짝: " + got.join(", "), opt.doneMsg || "합동인 도형을 모두 찾았어요!"); }
      } else {
        const a = sel; a.on = false; paint(a); sel = null;
        api.fail((opt.why && (opt.why[a.S.label + it.S.label] || opt.why[it.S.label + a.S.label])) || `도형 ${sy3Jo(a.S.label, "와/과")} 도형 ${it.S.label}의 모양과 크기를 다시 살펴봐요. 모눈의 칸 수를 세어 봐요.`, `${a.S.label}-${it.S.label}`);
        read.textContent = "합동인 두 도형을 차례로 눌러요.";
      }
    };
    api.provide({ words: ["모양", "크기", "모눈 칸 수", "합동"], answers: [Object.values(groups).filter(g => g.length > 1).map(g => g.map(x => x.S.label).join("와 ")).join(", ")] });
    body.append(...(opt.tip ? [h("p", { class: "sy3small" }, opt.tip)] : []), svg, read, list);
  } else {
    const ans = opt.answer;
    api.provide({ words: opt.words || [], answers: [ans.join(", ")] });
    const check = () => {
      if (done) return true; api.tryOnce();
      const picked = items.filter(x => x.on).map(x => x.S.label), ok = picked.length === ans.length && ans.every(l => picked.includes(l));
      if (ok) { done = true; read.textContent = "고른 도형: " + picked.join(", ") + " ✓"; fin(picked.join(", "), opt.doneMsg || "알맞게 골랐어요!"); return true; }
      const extra = picked.find(l => !ans.includes(l)), miss = ans.find(l => !picked.includes(l));
      api.fail(extra && opt.why && opt.why[extra] ? opt.why[extra] : extra ? `${opt.unitName || "도형"} ${sy3Jo(extra, "은/는")} 알맞지 않아요. 다시 살펴봐요.` : `빠진 ${sy3Jo(opt.unitName || "도형", "이/가")} 있어요. 다시 살펴봐요.` + (miss && opt.why && opt.why[miss] ? " " + opt.why[miss] : ""), picked.join(", ") || "-");
      return false;
    };
    const kick = autoRun(() => items.filter(x => x.on).length >= ans.length, () => items.filter(x => x.on).map(x => x.S.label).sort().join(","), check, 700);
    tapFn = it => { if (done) return; it.on = !it.on; paint(it); read.textContent = "고른 " + (opt.unitName || "도형") + ": " + (items.filter(x => x.on).map(x => x.S.label).join(", ") || "없음"); kick(); };
    body.append(...(opt.tip ? [h("p", { class: "sy3small" }, opt.tip)] : []), svg, read);
  }
  items.forEach(paint);
}

/* =========================================================
   3. 대응점·대응변·대응각 찾기 — 대응점의 순서대로 꼭짓점을 눌러요
   opt: 그림(sy3Paint와 같음) + items:[{k:"점"|"변"|"각", q:"ㄱㄴ", a:"ㄹㅁ"}], demo:{type:"fold",p,q | "rot",c | "map",A, from}, demoText, tip, ask, ok
   ========================================================= */
function sy3Corr(body, api, opt) {
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
      if (qi >= items.length) { done = true; show(); return fin(items.map(x => `${x.k} ${x.q}-${x.a}`).join(" / "), opt.doneMsg || `${kw[items[0].k]}을 모두 찾았어요!`); }
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
  const { svg, m } = sy3Setup(opt);
  sy3Paint(svg, m, Object.assign({}, opt, { segs: [] }));
  const N = Object.assign(sy3NamePts(opt.shapes), opt.pts || {}), unit = opt.unit || "cm", per = opt.per || 1, dec = opt.dec == null ? 1 : opt.dec;
  const resG = svgEl("g", { "pointer-events": "none" }), hitG = svgEl("g"); svg.append(resG, hitG);
  const segs = (opt.segs || []).map(s => typeof s === "string" ? { n: s } : s), angs = opt.angs || [];
  const got = new Map(), list = h("ul", { class: "sy3list" });
  const total = segs.length + angs.length;
  const lenOf = n => dist({ x: N[n[0]][0], y: N[n[0]][1] }, { x: N[n[1]][0], y: N[n[1]][1] }) * per;
  const angOf = n => sy3AngVal(N[n[1]], N[n[0]], N[n[2]]);
  const allGot = () => {
    if (got.size === total && !allGot.d) { allGot.d = true; api.tryOnce(); fin([...got.values()].join(" / "), opt.doneMsg || "모두 재었어요!"); }
  };
  const reL = () => { list.innerHTML = ""; [...segs.map(s => (s.w || "변") + " " + s.n), ...angs.map(a => "각 " + a)].forEach(k => list.append(h("li", { class: got.has(k) ? "sy3ok" : "" }, got.has(k) ? got.get(k) : k + " : ?"))); };
  segs.forEach(s => {
    const a = m(N[s.n[0]]), b = m(N[s.n[1]]), key = (s.w || "변") + " " + s.n;
    const hit = svgEl("line", { x1: sy3R(a[0]), y1: sy3R(a[1]), x2: sy3R(b[0]), y2: sy3R(b[1]), stroke: "rgba(43,123,214,0.08)", "stroke-width": 18, "stroke-linecap": "round", class: "sy3hit" });
    hit.addEventListener("click", () => {
      if (got.has(key)) return; const v = sy3F(lenOf(s.n), dec);
      sy3Line(resG, m, N[s.n[0]], N[s.n[1]], { color: SY3.org, w: 4.5 });
      sy3Lab(resG, m, N[s.n[0]], N[s.n[1]], `${v}${unit === "칸" ? "칸" : " " + unit}`, { c: s.c || opt.cen || sy3Cen(opt.shapes[0].parts || [sy3P(opt.shapes[0].P)]), color: SY3.org, d: s.d || 18, flip: s.flip, size: 16 });
      got.set(key, `${key} : ${v}${unit === "칸" ? "칸" : " " + unit}`); reL(); allGot();
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
      got.set(key, `${key} : ${v}°`); reL(); allGot();
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
    if (ok && !done) { done = true; api.tryOnce(); btn.disabled = true; fin(items.map((x, i) => `${x.label}:${mode === "given" ? "접음" : found[i].length}`).join(" "), opt.doneMsg || "잘 접어 보았어요!"); }
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
    if (ok && !done) { done = true; api.tryOnce(); btns.forEach(b => b.disabled = true); fin(mode === "given" ? "90°에는 겹치지 않고 180°에 겹침" : "대칭의 중심: " + items.filter((x, i) => st[i].found).map(x => x.label).join(", "), opt.doneMsg || "잘 돌려 보았어요!"); }
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
      done = true; api.tryOnce(); fin("대칭의 중심 ㅇ", "대칭의 중심을 찾았어요!");
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
    if (opt.miss.every(y => placed[y.n])) read.textContent = "모두 찍었어요. 잠깐 기다리면 저절로 확인해요. 자리를 옮기려면 점 단추를 고르고 다시 눌러요.";
    kick();
  });
  const check = () => {
    if (done) return true;
    if (!opt.miss.every(y => placed[y.n])) return false;
    api.tryOnce();
    const bad = opt.miss.find(y => Math.hypot(placed[y.n][0] - want[y.n][0], placed[y.n][1] - want[y.n][1]) > 1e-6);
    if (!bad) {
      done = true; chips.forEach(c => c.disabled = true);
      const all = Object.assign({}, P, placed);
      if (opt.poly) { const poly = opt.poly.map(n => all[n]); const e = sy3DrawPart(animG, sy3P(poly), m, { fill: "rgba(43,123,214,0.15)", stroke: SY3.blue, w: 3 }); e.setAttribute("stroke-dasharray", "none"); }
      const half = opt.half ? opt.half.map(n => all[n]) : null;
      if (half) {
        const g = svgEl("g"); animG.append(g); sy3DrawParts(g, [sy3P(half)], m, { op: .5, fill: "#F7E7A6", stroke: SY3.org, dash: "8 5" });
        sy3Anim(1200, t => g.setAttribute("transform", sy3PxM(line ? sy3FoldAt(opt.axis[0], opt.axis[1], t) : sy3Rot(opt.center, 180 * t), m)), () => {
          fin("완성", opt.doneMsg || (line ? "대칭축을 따라 접었더니 완전히 겹쳐요. 선대칭도형을 완성했어요!" : "대칭의 중심을 중심으로 180° 돌렸더니 완전히 겹쳐요. 점대칭도형을 완성했어요!"));
        });
      } else fin("완성", opt.doneMsg || "도형을 완성했어요!");
      read.textContent = "";
      return true;
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
    return false;
  };
  const kick = autoRun(() => opt.miss.every(y => placed[y.n]), () => opt.miss.map(y => placed[y.n] ? placed[y.n].join(",") : "-").join("|"), check, 1200);
  const gb = h("button", { onclick: () => { showG = !showG; gb.classList.toggle("sy3on", showG); guide(); } }, line ? "도움선: 대칭축에 수선 긋기" : "도움선: 대칭의 중심을 지나는 직선");
  api.provide({ words: line ? ["대칭축", "수선", "같은 거리", "대응점"] : ["대칭의 중심", "지나는 직선", "같은 거리", "대응점"], answers: opt.miss.map(x => `점 ${x.n}: 점 ${x.of}의 대응점`) });
  const side = sy3Side(h("p", { class: "sy3small" }, opt.tip || "찍을 점을 고르고 모눈의 꼭짓점을 눌러요. 다시 누르면 자리를 옮길 수 있어요."), sy3Tools(...chips), read, ...(opt.guide === false ? [] : [sy3Tools(gb)]));
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  sy3Layout(body, svg, side);
  redraw();
}

/* =========================================================
   9. 대칭 그리기판(공학 도구 대신) — ① 직선(대칭축) ② 선분 ③ 뒤집기 ④ 자
   opt: {cols, rows, k, axis(주어지면 고정), guide:[[p,q]…], need(선분 수), measure, needMeasure, tip, ask, ok}
   ========================================================= */
function sy3Mirror(body, api, opt) {
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
    if (ok && !done) { done = true; api.tryOnce(); tb.forEach(b => b.disabled = true); undo.disabled = clr.disabled = true; fin(`선분 ${segs.length}개`, opt.doneMsg || "선대칭도형을 그렸어요!"); }
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
  const cats = opt.cats || ["L", "P", "B", "N"], picked = {}, cardEls = {};
  const ans = {}; opt.cards.forEach(c => ans[c.label] = (opt.ans && opt.ans[c.label]) || sy3Kind(c.parts));
  const grid = h("div", { class: "sy3cards" });
  opt.cards.forEach(c => {
    const bs = cats.map(k => h("button", { onclick: () => { if (done) return; picked[c.label] = k; bs.forEach((b, i) => b.classList.toggle("sy3on", cats[i] === k)); card.classList.remove("sy3good", "sy3bad"); kick(); } }, opt.catN ? opt.catN[k] : SY3_CATN[k]));
    const card = h("div", { class: "sy3card" }, h("div", { class: "sy3nm" }, c.label + (c.name ? " " + c.name : "")), sy3Mini(c.parts, 140), h("div", { class: "sy3choice" }, ...bs));
    cardEls[c.label] = card; grid.append(card);
  });
  let done = false;
  const check = () => {
    if (done) return true; api.tryOnce();
    let bad = null;
    opt.cards.forEach(c => { const ok = picked[c.label] === ans[c.label]; cardEls[c.label].classList.toggle("sy3good", ok); cardEls[c.label].classList.toggle("sy3bad", !ok); if (!ok && !bad) bad = c; });
    const got = opt.cards.map(c => `${c.label}:${picked[c.label] ? SY3_CATN[picked[c.label]] : "-"}`).join(" ");
    if (!bad) { done = true; fin(got, opt.doneMsg || "모두 알맞게 나누었어요!"); return true; }
    const k = ans[bad.label], p = picked[bad.label];
    const why = (k === "L" || k === "B") && !(p === "L" || p === "B") ? "한 직선을 따라 접으면 완전히 겹치는지 다시 살펴봐요."
      : (k === "P" || k === "B") && !(p === "P" || p === "B") ? "어떤 점을 중심으로 180° 돌리면 처음 모양과 완전히 겹치는지 다시 살펴봐요."
      : (p === "L" || p === "B") && !(k === "L" || k === "B") ? "어느 직선으로 접어도 완전히 겹치지 않아요." : "180° 돌리면 처음 모양과 겹치지 않아요.";
    api.fail(`빨간 테두리 카드를 다시 살펴봐요. ${bad.label}${bad.name ? " " + bad.name : ""}: ${why}`, got);
    return false;
  };
  const kick = autoRun(() => opt.cards.every(c => picked[c.label]), () => opt.cards.map(c => picked[c.label]).join(","), check, 600);
  api.provide({ words: ["선대칭도형", "점대칭도형", "접기", "180° 돌리기"], answers: [opt.cards.map(c => `${c.label} ${SY3_CATN[ans[c.label]]}`).join(", ")] });
  if (opt.intro) body.append(h("p", { class: "sy3small" }, opt.intro));
  body.append(grid);
}

/* =========================================================
   11. 둘러보기(1차시) — 장소마다 눌러 특징을 살펴봐요 (opt.place: 맨 위 이름)
   opt: {spots:[{id, name, say, draw(g)}], ask, ok}
   ========================================================= */
function sy3Museum(body, api, opt) {
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
  const W = 760, H = 330, svg = makeSvg(W, H); svg.setAttribute("class", "sy3fig"); svg.style.maxWidth = "40em";
  svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: 250, fill: "#F6EFE4" }), svgEl("rect", { x: 0, y: 250, width: W, height: 80, fill: "#E3D2BA" }));
  for (let x = 0; x < W; x += 76) svg.append(svgEl("line", { x1: x, y1: 250, x2: x - 40, y2: 330, stroke: "#D4BFA2", "stroke-width": 2 }));
  svg.append(txt(W / 2, 24, opt.place || "대칭 무늬 공방", 20, { fill: "#8A6E52" }));
  let seenAll = false;
  const seen = new Set(), read = h("div", { class: "sy3read" }, "작품을 하나씩 눌러 보세요."), list = h("ul", { class: "sy3list" });
  const n = opt.spots.length, fw = 128, gap = (W - n * fw) / (n + 1);
  opt.spots.forEach((s, i) => {
    const x = gap + i * (fw + gap), y = s.floor ? 258 : 52, fh = s.floor ? 62 : 150, g = svgEl("g", { class: "sy3hit" });
    if (!s.floor) g.append(svgEl("rect", { x: x - 6, y: y - 6, width: fw + 12, height: fh + 12, rx: 6, fill: "#B8915F" }), svgEl("rect", { x, y, width: fw, height: fh, fill: "#FFFDF8" }));
    else g.append(svgEl("rect", { x, y, width: fw, height: fh, rx: 8, fill: "rgba(255,255,255,0.25)" }));
    const inner = svgEl("g", { transform: `translate(${sy3R(x)} ${y})` }); s.draw(inner, fw, fh); g.append(inner);
    const lab = s.floor ? txt(sy3R(x + fw + 16), 290, s.name, 16, { fill: "#5B4632", "text-anchor": "start" }) : txt(sy3R(x + fw / 2), 228, s.name, 16, { fill: "#5B4632" }); g.append(lab);
    const ring = svgEl("rect", { x: x - 9, y: y - 9, width: fw + 18, height: fh + 18, rx: 9, fill: "none", stroke: "none", "stroke-width": 4 }); g.append(ring);
    g.addEventListener("click", () => {
      seen.add(s.id); ring.setAttribute("stroke", SY3.green);
      read.textContent = `${s.name}: ${s.say}`;
      list.innerHTML = ""; opt.spots.filter(t => seen.has(t.id)).forEach(t => list.append(h("li", { class: "sy3ok" }, `${t.name} — ${t.say}`)));
      if (seen.size === n && !seenAll) { seenAll = true; api.tryOnce(); fin("모두 둘러봄", opt.doneMsg || "부스를 모두 둘러보았어요!"); }
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
      fin(`물감 ${cells.size}칸`, opt.doneMsg || "데칼코마니 작품을 만들었어요!");
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
  const fin = (ans, msg, data) => sy3Finish(body, api, opt, ans, msg, data) || api.done(ans, opt.ok || msg);   // 물음·이어서 할 활동이 없으면 바로 해결
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
      fin(`꼭짓점 ${pts.length}개인 도형`, opt.doneMsg || "두 도형이 완전히 겹쳐요!");
    });
  } }, "포개어 보기");
  const again = h("button", { onclick: () => { if (cut) return; pts = []; closed = false; redraw(); read.textContent = "다시 그려요."; } }, "다시 그리기");
  api.provide({ words: ["겹쳐서 오리기", "모양", "크기", "완전히 겹쳐요"], answers: [] });
  sy3Layout(body, svg, sy3Side(h("p", { class: "sy3small" }, "노란 색종이 아래에 분홍 색종이를 겹쳐 놓았어요."), read, sy3Tools(again)));
  body.append(h("div", { class: "actions" }, cutB, over));
}

/* =========================================================
   14. 대칭 카드 놀이(카드를 없애는 완벽한 방법) — 나와 컴퓨터 친구 둘(opt.names)
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
  const NAMES = opt.names || ["나", "도윤", "지아"], NI = opt.ni || ["나", "도윤이", "지아"];
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
    pileBox.append(h("div", { class: "sy3small" }, `쌓아 둔 카드 ${deck.length}장 · 순서: ${dir === 1 ? NAMES.join(" → ") : [NAMES[0], NAMES[2], NAMES[1]].join(" → ")}` + (anyNext && !over ? " · 이번 차례는 아무 카드나 낼 수 있어요" : "")));
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
/* ---- 도형 만들기 도구(교과서 버전에서 복사) ---- */
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
const SY3_COL = { r: "#E5533D", y: "#F2B33D", b: "#3D8FE5", g: "#5DAA4E", p: "#9A5BD6" };
function sy3Pattern(rows, dx = 1, dy = 1) {
  const by = {}; rows.forEach((r, y) => [...r].forEach((ch, x) => { if (SY3_COL[ch]) (by[ch] = by[ch] || []).push([x + dx, y + dy]); }));
  return Object.entries(by).map(([ch, C]) => sy3Cells(C, { fill: SY3_COL[ch], stroke: "#5A5A5A", w: 1.6 }));
}
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
const SY3_SHAPES = {
  L: [sy3P([[2, 0], [4, 4], [0, 4]]), sy3P([[2, 0], [4, 2], [2, 6], [0, 2]]), sy3P([[2, 0], [4, 2], [4, 4], [0, 4], [0, 2]]), sy3P([[2, 1], [3, 0], [4, 1], [4, 2], [2, 4], [0, 2], [0, 1], [1, 0]]), sy3P([[2, 0], [4, 2], [3, 2], [3, 5], [1, 5], [1, 2], [0, 2]]), sy3Cells(sy3Grid(["###", ".#.", ".#."]))],
  P: [sy3P([[1, 0], [4, 0], [3, 2], [0, 2]]), sy3Cells(sy3Grid(["##.", ".#.", ".##"])), sy3Cells(sy3Grid(["##..", ".##.", "..##"])), sy3Cells(sy3Grid(["#..", "##.", ".##", "..#"])), sy3P([[0, 1], [3, 0], [5, 1], [5, 3], [2, 4], [0, 3]]), sy3P([[0, 0], [2, 0], [4, 2], [6, 2], [6, 3], [4, 3], [2, 1], [0, 1]])],
  B: [sy3P([[0, 0], [5, 0], [5, 3], [0, 3]]), sy3P([[2, 0], [4, 3], [2, 6], [0, 3]]), sy3P([[0, 0], [4, 0], [4, 4], [0, 4]]), sy3C([2, 2], 2), sy3Cells(sy3Grid([".#.", "###", ".#."])), sy3Cells(sy3Grid(["#.#", "###", "#.#"]))],
  N: [sy3P([[0, 0], [5, 1], [1, 4]]), sy3Cells(sy3Grid(["#.", "#.", "##"])), sy3Cells(sy3Grid(["##", "##", "#."])), sy3P([[0, 0], [2, 0], [4, 3], [0, 3]]), sy3P([[0, 0], [4, 1], [2, 2], [4, 4], [0, 4]]), sy3Cells(sy3Grid([".##", "##.", ".#."]))] };
const SY3_FILLK = { L: "#DCEAFB", P: "#FDE3D3", B: "#DDEDE5", N: "#FFF1C7" };
const SY3_DECK = [].concat(...Object.entries(SY3_SHAPES).map(([k, a]) => a.map(pt => ({ kind: k, parts: [Object.assign({}, pt, { fill: "#EAF1F8", stroke: "#2F4A5E" })] }))), [1, 1, 2, 2, 3, 3].map(sp => ({ sp })));
const SY3_MEM = [].concat(...["L", "P", "N"].map(k => SY3_SHAPES[k].slice(0, 4).map(pt => ({ kind: k, parts: [Object.assign({}, pt, { fill: "#EAF1F8", stroke: "#2F4A5E" })] }))));
function sy3D4(parts, mi, x = 0, y = 0) {   // 조각 묶음을 D4(mi번)로 바꾸고 왼쪽 위를 (x,y)로
  const M = SY3_D4[mi || 0], q = sy3XPs(parts, [M[0], M[1], M[2], M[3], 0, 0]), bb = sy3BBox(q);
  return sy3XPs(q, sy3Tr(x - bb[0], y - bb[1]));
}
function sy3CircX(p0, r0, p1, r1) {   // 두 원의 교점
  const d = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), a = (r0 * r0 - r1 * r1 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, r0 * r0 - a * a));
  const mx = p0[0] + a * (p1[0] - p0[0]) / d, my = p0[1] + a * (p1[1] - p0[1]) / d;
  return [[mx + hh * (p1[1] - p0[1]) / d, my - hh * (p1[0] - p0[0]) / d], [mx - hh * (p1[1] - p0[1]) / d, my + hh * (p1[0] - p0[0]) / d]];
}
function sy3PSym(lens, turns, dir0, o = {}) {   // 반쪽 변의 길이·꺾는 각으로 점대칭도형 (turns 합 = 180)
  const P = sy3Walk([0, 0], dir0, lens.concat(lens), turns.concat(turns)), bb = sy3BBox([sy3P(P)]), s = o.s || 1, pad = o.pad == null ? .8 : o.pad;
  return P.map(p => [sy3R((p[0] - bb[0]) * s + pad + (o.dx || 0)), sy3R((p[1] - bb[1]) * s + pad + (o.dy || 0))]);
}
const SY3_GLY = {   // 글자 모양(칸)
  "ㄹ": ["#####", "....#", "#####", "#....", "#####"], "ㅁ": ["#####", "#...#", "#...#", "#...#", "#####"], "ㅍ": ["#####", ".#.#.", ".#.#.", ".#.#.", "#####"],
  "S": ["####", "#...", "####", "...#", "####"], "ㄷ": ["#####", "#....", "#....", "#....", "#####"], "ㅗ": ["..#..", "..#..", "..#..", "#####"], "ㄱ": ["#####", "....#", "....#", "....#", "....#", "....#"] };
const SY3_PENTO = { F: [".##", "##.", ".#."], I: ["#####"], L: ["#.", "#.", "#.", "##"], N: [".#", "##", "#.", "#."], P: ["##", "##", "#."], T: ["###", ".#.", ".#."], U: ["#.#", "###"], V: ["#..", "#..", "###"], W: ["#..", "##.", ".##"], X: [".#.", "###", ".#."], Y: [".#", "##", ".#", ".#"], Z: ["##.", ".#.", ".##"] };
//@@LESSONS
