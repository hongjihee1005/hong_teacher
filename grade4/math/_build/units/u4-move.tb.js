//@@APP
const APP={title:"그림자 연극 평면도형의 이동", unit:"4-1 수학 4. 평면도형의 이동(교과서)", key:"t41-move-v1", welcome:"그림자 연극 평면도형의 이동 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 그림자 연극 「두두의 소원」의 소품을 밀고, 뒤집고, 돌리며 평면도형의 이동을 배워요."};
//@@UNIT
/* =========================================================
   4. 평면도형의 이동 — 단원 조작 부품 (앞글자 m4)
   좌표: 모눈 칸 단위, 오른쪽이 x+, 아래쪽이 y+ (화면 좌표)
   방향 행렬 M=[a,b,c,d] :  x' = a x + b y,  y' = c x + d y
   ========================================================= */
const M4_LINE = "#CBD8E6", M4_OK = "#2E8B57", M4_NO = "#C8472E", M4_GRAY = "#8795A1", M4_GOLD = "#E8B630";
const M4_KO = ["가", "나", "다", "라", "마", "바"];
const M4_I = [1, 0, 0, 1], M4_CW = [0, -1, 1, 0], M4_CCW = [0, 1, -1, 0], M4_FLR = [-1, 0, 0, 1], M4_FUD = [1, 0, 0, -1];
const M4_DIRV = { "위": [0, -1], "아래": [0, 1], "왼": [-1, 0], "오른": [1, 0] };
const M4_DIRS = ["위", "아래", "왼", "오른"];
const M4_FILLS = [["#DCEAFB", BLUE], ["#FDE3D3", TENT], ["#DDEDE5", PINE], ["#EADFF6", "#7A5BB0"], ["#FFF1C7", "#B08A1E"]];
let m4Uid = 0;
const m4Mul = (A, B) => [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3]];
const m4Ap = (M, p) => [M[0] * p[0] + M[1] * p[1], M[2] * p[0] + M[3] * p[1]];
const m4Eq = (A, B) => A.every((v, i) => Math.abs(v - B[i]) < 1e-9);
const m4Inv = M => [M[0], M[2], M[1], M[3]];               // 돌리기·뒤집기 행렬의 거꾸로 = 바꾸어 놓기
const m4Pow = k => { let M = M4_I; for (let i = 0; i < ((k % 4) + 4) % 4; i++) M = m4Mul(M4_CW, M); return M; };
const M4_D4 = [M4_I, M4_CW, m4Pow(2), M4_CCW, M4_FLR, M4_FUD, m4Mul(M4_CW, M4_FLR), m4Mul(M4_CCW, M4_FLR)];
const M4_D4N = ["처음과 같은 모양", "시계 방향으로 90°만큼 돌린 모양", "180°만큼 돌린 모양", "시계 반대 방향으로 90°만큼 돌린 모양", "왼쪽(오른쪽)으로 뒤집은 모양", "위쪽(아래쪽)으로 뒤집은 모양", "뒤집고 돌린 모양", "뒤집고 돌린 모양"];
const m4MName = M => M4_D4N[M4_D4.findIndex(x => m4Eq(x, M))] || "다른 모양";
const m4F = v => Math.abs(v - Math.round(v)) < 1e-6 ? String(Math.round(v)) : v.toFixed(3);
function m4Jo(w, pair) {   // 받침에 따라 조사 고르기 (예: m4Jo("뱀","이/가") → "뱀이")
  const [a, b] = pair.split("/"), s = String(w).trim(), ch = s.slice(-1), code = ch.charCodeAt(0);
  let bat = false;
  if (/[0-9]/.test(ch)) bat = "013678".includes(ch);
  else if (code >= 0xAC00 && code <= 0xD7A3) bat = (code - 0xAC00) % 28 !== 0;
  return s + (bat ? a : b);
}
const M4_SYMR = { "①": "일", "②": "이", "③": "삼", "④": "사", "⑤": "오", "⑥": "육", "⑦": "칠", "⑧": "팔", "⑨": "구", "⑩": "십", "㉠": "기역", "㉡": "니은", "㉢": "디귿", "㉣": "리을", "㉤": "미음", "㉥": "비읍" };
function m4JoS(sym, pair) {   // ①·㉠ 같은 기호 뒤 조사 (으로/로는 ㄹ 받침이면 로)
  const r = M4_SYMR[sym] || sym, [a, b] = pair.split("/");
  if (a === "으로") { const c = r.charCodeAt(r.length - 1) - 0xAC00, j = c % 28; return sym + (j === 0 || j === 8 ? "로" : "으로"); }
  return m4Jo(r, pair).replace(r, sym);
}
const m4U = (n, unit, pair) => { const u = unit === "cm" ? `${n} cm` : `${n}칸`; if (!pair) return u; const [a, b] = pair.split("/"); return u + (unit === "cm" ? b : a); };
function m4OpM(op) {
  if (op.t === "flip") return (op.dir === "위" || op.dir === "아래") ? M4_FUD : M4_FLR;
  if (op.t === "rot") { const k = Math.round(op.deg / 90); return m4Pow(op.cw ? k : -k); }
  return M4_I;
}
function m4OpText(op) {
  if (op.t === "slide") return `${op.dir}쪽으로 ${op.n || 1}${op.unit || "칸"} 밀기`;
  if (op.t === "flip") return `${op.dir}쪽으로 뒤집기`;
  return `시계${op.cw ? "" : " 반대"} 방향으로 ${op.deg}°만큼 돌리기`;
}
const m4R = (cw, deg) => ({ t: "rot", cw, deg });
const m4Fl = dir => ({ t: "flip", dir });
const m4Sl = (dir, n) => ({ t: "slide", dir, n });
function m4Num(s) { const t = String(s == null ? "" : s).replace(/[\s,°]/g, "").replace(/cm|칸/g, ""); return t === "" ? NaN : Number(t); }
function m4Anim(ms, f, end) {
  const fast = !window.requestAnimationFrame || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (fast) { f(1); if (end) end(); return; }
  const t0 = performance.now();
  const tick = now => { const t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; f(e); if (t < 1) requestAnimationFrame(tick); else if (end) end(); };
  requestAnimationFrame(tick);
}
function m4Grid(g, ox, oy, w, hh, U, col) {
  const gg = svgEl("g", { stroke: col || M4_LINE, "stroke-width": 1.2 });
  for (let x = 0; x <= w; x++) gg.append(svgEl("line", { x1: ox + x * U, y1: oy, x2: ox + x * U, y2: oy + hh * U }));
  for (let y = 0; y <= hh; y++) gg.append(svgEl("line", { x1: ox, y1: oy + y * U, x2: ox + w * U, y2: oy + y * U }));
  g.append(gg); return gg;
}
function m4Side(...kids) { return h("div", { class: "side" }, ...kids); }
function m4Tools(...kids) { return h("div", { class: "tools" }, ...kids); }
function m4Small(t) { return h("div", { style: "font-size:var(--fs-s);color:var(--muted);margin-top:.2em" }, t); }

/* ---------- 그림(소품) : 한 칸 = 100 ---------- */
const M4_PIC = {
  mole: { bw: 3, bh: 2, draw(g) {   // 두더지: 코는 오른쪽, 다리는 아래쪽, 꼬리는 위쪽
    g.append(svgEl("path", { d: "M78 98 Q38 86 46 26", fill: "none", stroke: "#5B3E2B", "stroke-width": 11, "stroke-linecap": "round" }),
      svgEl("ellipse", { cx: 108, cy: 180, rx: 24, ry: 14, fill: "#5B3E2B" }), svgEl("ellipse", { cx: 198, cy: 180, rx: 24, ry: 14, fill: "#5B3E2B" }),
      svgEl("ellipse", { cx: 150, cy: 122, rx: 106, ry: 62, fill: "#8A6248", stroke: "#5B3E2B", "stroke-width": 5 }),
      svgEl("ellipse", { cx: 160, cy: 146, rx: 62, ry: 26, fill: "#A98066" }),
      svgEl("ellipse", { cx: 262, cy: 120, rx: 25, ry: 18, fill: "#F2B5B0", stroke: "#5B3E2B", "stroke-width": 4 }),
      svgEl("circle", { cx: 285, cy: 118, r: 10, fill: "#C9465A" }),
      svgEl("circle", { cx: 226, cy: 96, r: 8, fill: INK }), svgEl("circle", { cx: 229, cy: 93, r: 2.5, fill: "#fff" }));
  } },
  needle: { bw: 2, bh: 2, draw(g) {   // 바늘: 뾰족한 삼각형 부분이 위쪽
    g.append(svgEl("circle", { cx: 100, cy: 100, r: 96, fill: "#F6F8FA", stroke: "#D5DEE6", "stroke-width": 3 }),
      svgEl("rect", { x: 91, y: 62, width: 18, height: 104, rx: 7, fill: "#8795A1" }),
      svgEl("polygon", { points: "100,10 68,72 132,72", fill: "#D9534F", stroke: "#8E2A27", "stroke-width": 4, "stroke-linejoin": "round" }),
      svgEl("circle", { cx: 100, cy: 172, r: 15, fill: "#fff", stroke: "#8795A1", "stroke-width": 8 }),
      svgEl("circle", { cx: 100, cy: 100, r: 7, fill: INK }));
  } },
  apple: { bw: 2, bh: 2, draw(g) {   // 사과: 꼭지는 위쪽, 잎은 왼쪽, 베어 문 자리는 오른쪽
    g.append(svgEl("path", { d: "M100 62 C60 36 18 74 30 128 C40 172 78 196 100 182 C118 194 142 186 156 168 Q120 140 162 100 C152 56 126 48 100 62 Z", fill: "#E5533D", stroke: "#9B2F21", "stroke-width": 5, "stroke-linejoin": "round" }),
      svgEl("path", { d: "M102 62 L112 22", stroke: "#6B4A2E", "stroke-width": 8, "stroke-linecap": "round" }),
      svgEl("path", { d: "M100 44 Q72 12 50 38 Q76 58 100 44 Z", fill: "#5DAA4E", stroke: "#2F6B2A", "stroke-width": 4 }),
      svgEl("ellipse", { cx: 62, cy: 104, rx: 9, ry: 16, fill: "#fff", opacity: .55 }));
  } },
  house: { bw: 2, bh: 2, draw(g) {   // 집: 굴뚝은 오른쪽, 문은 왼쪽
    g.append(svgEl("rect", { x: 128, y: 30, width: 22, height: 50, fill: "#8A6248", stroke: "#5B3E2B", "stroke-width": 4 }),
      svgEl("rect", { x: 40, y: 96, width: 120, height: 88, fill: "#F4D58D", stroke: "#9C7A2B", "stroke-width": 5 }),
      svgEl("polygon", { points: "22,102 100,30 178,102", fill: "#C8472E", stroke: "#86281A", "stroke-width": 5, "stroke-linejoin": "round" }),
      svgEl("rect", { x: 58, y: 126, width: 30, height: 58, fill: "#8A6248" }),
      svgEl("rect", { x: 110, y: 118, width: 32, height: 30, fill: "#BFE3F2", stroke: "#4E7FA0", "stroke-width": 4 }));
  } },
  stamp: { bw: 2, bh: 2, draw(g, o) {   // 토끼 도장: 오른쪽 귀가 접히고 오른쪽 눈이 웃는 눈
    const ink = (o && o.ink) || INK, fill = o && o.ink ? "none" : "#fff";
    g.append(svgEl("rect", { x: 6, y: 6, width: 188, height: 188, rx: 26, fill: o && o.ink ? "none" : "#FFF7E8", stroke: ink, "stroke-width": 6 }),
      svgEl("ellipse", { cx: 76, cy: 52, rx: 15, ry: 38, fill, stroke: ink, "stroke-width": 6 }),
      svgEl("path", { d: "M114 84 Q116 40 128 24 Q150 10 174 34 Q150 32 138 46 Q130 64 134 86", fill, stroke: ink, "stroke-width": 6, "stroke-linejoin": "round" }),
      svgEl("circle", { cx: 100, cy: 128, r: 56, fill, stroke: ink, "stroke-width": 6 }),
      svgEl("circle", { cx: 78, cy: 118, r: 8, fill: ink }),
      svgEl("path", { d: "M110 122 Q122 104 136 122", fill: "none", stroke: ink, "stroke-width": 6, "stroke-linecap": "round" }),
      svgEl("path", { d: "M92 146 Q100 154 108 146", fill: "none", stroke: ink, "stroke-width": 5, "stroke-linecap": "round" }),
      svgEl("circle", { cx: 100, cy: 138, r: 5, fill: ink }));
  } },
  puzzle: { bw: 2, bh: 2, draw(g) {   // 퍼즐 조각: 위쪽은 튀어나오고 왼쪽은 들어감
    g.append(svgEl("path", { d: "M44 52 L80 52 C70 14 130 14 120 52 L156 52 L156 156 L44 156 L44 122 C78 128 78 82 44 88 Z", fill: "#7BC4A4", stroke: "#2F6B57", "stroke-width": 6, "stroke-linejoin": "round" }),
      svgEl("circle", { cx: 120, cy: 120, r: 9, fill: "#2F6B57", opacity: .5 }));
  } },
  pipe: { bw: 2, bh: 2, draw(g, o) {   // 관: 위쪽과 오른쪽이 열린 꺾인 관
    const water = o && o.water;
    g.append(svgEl("rect", { x: 4, y: 4, width: 192, height: 192, rx: 16, fill: "#F2EFE8", stroke: "#C9C2B3", "stroke-width": 4 }),
      svgEl("path", { d: "M100 0 L100 72 Q100 100 128 100 L200 100", fill: "none", stroke: "#5E7387", "stroke-width": 58 }),
      svgEl("path", { d: "M100 0 L100 72 Q100 100 128 100 L200 100", fill: "none", stroke: water ? "#5BB6F0" : "#A9BBCB", "stroke-width": 38 }),
      svgEl("circle", { cx: 100, cy: 100, r: 13, fill: "#5E7387" }));
  } },
  motif: { bw: 1, bh: 1, draw(g, o) {   // 무늬 조각: 왼쪽 위 부채꼴 + 오른쪽 위 작은 네모(대칭이 없음)
    const c = (o && o.color) || "#E47A38";
    g.append(svgEl("rect", { x: 2, y: 2, width: 96, height: 96, fill: "#FFFDF8", stroke: "#E0D6C8", "stroke-width": 2 }),
      svgEl("path", { d: "M2 2 L68 2 A66 66 0 0 1 2 68 Z", fill: c }),
      svgEl("rect", { x: 74, y: 8, width: 18, height: 18, rx: 3, fill: c, opacity: .75 }));
  } },
  rabbit: { bw: 2, bh: 2, draw(g) {
    g.append(svgEl("circle", { cx: 40, cy: 128, r: 15, fill: "#fff", stroke: "#7D6E63", "stroke-width": 4 }),
      svgEl("ellipse", { cx: 92, cy: 140, rx: 52, ry: 40, fill: "#fff", stroke: "#7D6E63", "stroke-width": 5 }),
      svgEl("ellipse", { cx: 112, cy: 182, rx: 26, ry: 10, fill: "#E9E2DA", stroke: "#7D6E63", "stroke-width": 4 }),
      svgEl("ellipse", { cx: 136, cy: 34, rx: 11, ry: 30, fill: "#fff", stroke: "#7D6E63", "stroke-width": 4, transform: "rotate(-12 136 34)" }),
      svgEl("ellipse", { cx: 160, cy: 38, rx: 11, ry: 30, fill: "#fff", stroke: "#7D6E63", "stroke-width": 4, transform: "rotate(14 160 38)" }),
      svgEl("circle", { cx: 150, cy: 96, r: 34, fill: "#fff", stroke: "#7D6E63", "stroke-width": 5 }),
      svgEl("circle", { cx: 162, cy: 88, r: 6, fill: INK }), svgEl("circle", { cx: 182, cy: 102, r: 6, fill: "#F28B9B" }));
  } },
  fox: { bw: 2, bh: 2, draw(g) {
    g.append(svgEl("path", { d: "M54 128 Q6 120 12 76 Q40 92 62 112 Z", fill: "#E8863A", stroke: "#9A4E15", "stroke-width": 4 }),
      svgEl("path", { d: "M12 76 Q16 92 28 100 Q18 84 12 76 Z", fill: "#fff" }),
      svgEl("ellipse", { cx: 92, cy: 132, rx: 48, ry: 32, fill: "#E8863A", stroke: "#9A4E15", "stroke-width": 5 }),
      svgEl("rect", { x: 66, y: 156, width: 12, height: 32, rx: 5, fill: "#5B3E2B" }), svgEl("rect", { x: 110, y: 156, width: 12, height: 32, rx: 5, fill: "#5B3E2B" }),
      svgEl("polygon", { points: "128,58 140,24 154,62", fill: "#E8863A", stroke: "#9A4E15", "stroke-width": 4, "stroke-linejoin": "round" }),
      svgEl("polygon", { points: "116,70 160,56 194,104 136,124", fill: "#E8863A", stroke: "#9A4E15", "stroke-width": 5, "stroke-linejoin": "round" }),
      svgEl("polygon", { points: "150,104 194,104 136,124", fill: "#fff" }),
      svgEl("circle", { cx: 154, cy: 84, r: 6, fill: INK }), svgEl("circle", { cx: 193, cy: 103, r: 6, fill: INK }));
  } },
  dog: { bw: 2, bh: 2, draw(g) {
    g.append(svgEl("path", { d: "M44 104 Q22 82 30 52", fill: "none", stroke: "#8A6248", "stroke-width": 10, "stroke-linecap": "round" }),
      svgEl("rect", { x: 40, y: 100, width: 104, height: 52, rx: 24, fill: "#F3E1C7", stroke: "#8A6248", "stroke-width": 5 }),
      svgEl("rect", { x: 54, y: 146, width: 14, height: 40, rx: 6, fill: "#8A6248" }), svgEl("rect", { x: 116, y: 146, width: 14, height: 40, rx: 6, fill: "#8A6248" }),
      svgEl("circle", { cx: 158, cy: 86, r: 34, fill: "#F3E1C7", stroke: "#8A6248", "stroke-width": 5 }),
      svgEl("ellipse", { cx: 142, cy: 84, rx: 12, ry: 26, fill: "#8A6248" }),
      svgEl("circle", { cx: 168, cy: 78, r: 6, fill: INK }), svgEl("circle", { cx: 192, cy: 90, r: 7, fill: INK }));
  } },
  snake: { bw: 2, bh: 2, draw(g) {
    g.append(svgEl("path", { d: "M14 150 Q44 112 74 150 T134 150 Q160 168 170 120", fill: "none", stroke: "#4E9A52", "stroke-width": 22, "stroke-linecap": "round" }),
      svgEl("path", { d: "M14 150 Q44 112 74 150 T134 150 Q160 168 170 120", fill: "none", stroke: "#A6D99A", "stroke-width": 6, "stroke-dasharray": "4 14", "stroke-linecap": "round" }),
      svgEl("path", { d: "M192 104 l10 -6 M192 104 l10 6", stroke: "#C8472E", "stroke-width": 4, "stroke-linecap": "round" }),
      svgEl("ellipse", { cx: 172, cy: 104, rx: 22, ry: 16, fill: "#4E9A52", stroke: "#2E6631", "stroke-width": 4 }),
      svgEl("circle", { cx: 178, cy: 98, r: 4.5, fill: INK }));
  } }
};
/* 조각 정의 → {bw,bh,draw,pts?,names?} */
function m4P(sp) {
  if (sp && sp.bw && sp.draw) return sp;
  if (typeof sp === "string") sp = { pic: sp };
  if (sp.pic) { const P = M4_PIC[sp.pic]; return { bw: P.bw, bh: P.bh, sp, draw: g => P.draw(g, sp) }; }
  const bw = Math.max(...sp.pts.map(p => p[0])), bh = Math.max(...sp.pts.map(p => p[1]));
  return { bw, bh, sp, pts: sp.pts, names: sp.names, draw: g => g.append(svgEl("polygon", { points: sp.pts.map(p => `${p[0] * 100},${p[1] * 100}`).join(" "), fill: sp.fill || "#DCEAFB", stroke: sp.stroke || BLUE, "stroke-width": sp.sw || 4, "vector-effect": "non-scaling-stroke", "stroke-linejoin": "round" })) };
}
const m4Dims = (pc, M) => Math.abs(M[0]) < .5 ? [pc.bh, pc.bw] : [pc.bw, pc.bh];
function m4XfC(pc, A, cx, cy, U) {
  return `translate(${m4F(cx)},${m4F(cy)}) matrix(${m4F(A[0])},${m4F(A[2])},${m4F(A[1])},${m4F(A[3])},0,0) scale(${m4F(U / 100)}) translate(${-50 * pc.bw},${-50 * pc.bh})`;
}
function m4VtxPx(pc, A, cx, cy, U) { return pc.pts.map(p => { const w = m4Ap(A, [(p[0] - pc.bw / 2) * U, (p[1] - pc.bh / 2) * U]); return [cx + w[0], cy + w[1]]; }); }
function m4Names(g, pc, A, cx, cy, U, col) {
  if (!pc.names) return;
  const P = m4VtxPx(pc, A, cx, cy, U), c = [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
  P.forEach((p, i) => { const d = [p[0] - c[0], p[1] - c[1]], L = Math.hypot(d[0], d[1]) || 1, off = Math.max(13, U * .36); g.append(txt(p[0] + d[0] / L * off, p[1] + d[1] / L * off, pc.names[i], Math.max(15, Math.min(24, U * .5)), { fill: col || INK })); });
}
function m4Abs(pc, st) {   // 조각 꼭짓점의 모눈 좌표
  const d = m4Dims(pc, st.M);
  return pc.pts.map(p => { const w = m4Ap(st.M, [p[0] - pc.bw / 2, p[1] - pc.bh / 2]); return [st.x + d[0] / 2 + w[0], st.y + d[1] / 2 + w[1]]; });
}
const m4Key = pts => pts.map(p => `${Math.round(p[0] * 100) / 100},${Math.round(p[1] * 100) / 100}`).sort().join(";");
function m4Norm(pts) { const mx = Math.min(...pts.map(p => p[0])), my = Math.min(...pts.map(p => p[1])); return pts.map(p => [p[0] - mx, p[1] - my]); }
const m4NKey = pts => m4Key(m4Norm(pts));
const m4TP = (pts, M) => pts.map(p => m4Ap(M, p));

/* 문제용 그림 : {w,h,U, items:[{pc,M,x,y,op,names}], deco(g,U), grid, maxW} */
function m4Fig(o) {
  const U = o.U || 30, s = makeSvg(o.w * U, o.h * U);
  if (o.grid) m4Grid(s, 0, 0, o.w, o.h, U);
  if (o.deco) o.deco(s, U);
  (o.items || []).forEach(it => {
    const pc = m4P(it.pc), M = it.M || M4_I, d = m4Dims(pc, M), g = svgEl("g", { opacity: it.op == null ? 1 : it.op }), inner = svgEl("g");
    const cx = (it.x + d[0] / 2) * U, cy = (it.y + d[1] / 2) * U;
    pc.draw(inner); inner.setAttribute("transform", m4XfC(pc, M, cx, cy, U)); g.append(inner);
    if (it.names !== false) m4Names(g, pc, M, cx, cy, U);
    s.append(g);
  });
  if (o.after) o.after(s, U);
  Object.assign(s.style, { maxWidth: o.maxW || `${Math.round(o.w * U / 15)}em`, width: "100%", display: "block", background: "#FBFCFB", border: "2px solid #DCE4E0", borderRadius: "12px", margin: ".3em 0" });
  return s;
}
/* 가·나·다 카드 : items [{pc, M, label}] */
function m4Cards(items, opt = {}) {
  const U = opt.U || 30, ps = items.map(it => m4P(it.pc)), ds = items.map((it, i) => m4Dims(ps[i], it.M || M4_I));
  const bw = Math.max(...ds.map(d => d[0])), bh = Math.max(...ds.map(d => d[1])), per = opt.per || items.length;
  const CW = bw * U + 30, CH = bh * U + 50, rows = Math.ceil(items.length / per), s = makeSvg(per * (CW + 12) + 12, rows * (CH + 12) + 12);
  items.forEach((it, i) => {
    const gx = 12 + (i % per) * (CW + 12), gy = 12 + Math.floor(i / per) * (CH + 12), lab = it.label || M4_KO[i], g = svgEl("g");
    g.append(svgEl("rect", { x: gx, y: gy, width: CW, height: CH, rx: 12, fill: lab === "보기" ? "#FFF7E8" : "#fff", stroke: lab === "보기" ? TENT : "#C9D4CF", "stroke-width": 2.5 }), txt(gx + 18 + (lab.length - 1) * 8, gy + 18, lab, 19));
    const inner = svgEl("g"), cx = gx + CW / 2, cy = gy + 30 + bh * U / 2;
    ps[i].draw(inner); inner.setAttribute("transform", m4XfC(ps[i], it.M || M4_I, cx, cy, U)); g.append(inner);
    if (it.names) m4Names(g, ps[i], it.M || M4_I, cx, cy, U);
    s.append(g);
  });
  Object.assign(s.style, { maxWidth: opt.maxW || "36em", width: "100%", display: "block", margin: ".3em 0" });
  return s;
}
function m4Arrow(g, x1, y1, x2, y2, col, w) {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 14;
  g.append(svgEl("line", { x1, y1, x2: x2 - Math.cos(a) * L * .6, y2: y2 - Math.sin(a) * L * .6, stroke: col || TENT, "stroke-width": w || 4, "stroke-linecap": "round" }),
    svgEl("polygon", { points: `${x2},${y2} ${x2 - Math.cos(a) * L - Math.sin(a) * L * .55},${y2 - Math.sin(a) * L + Math.cos(a) * L * .55} ${x2 - Math.cos(a) * L + Math.sin(a) * L * .55},${y2 - Math.sin(a) * L - Math.cos(a) * L * .55}`, fill: col || TENT }));
}

/* ---------- 뒤따르는 물음 (조작을 마친 뒤 나오는 빈칸·수) ----------
   items: [{q, fig, parts:["글", {o:[…], a:번호 | acc:[번호…], why:{}}, {n:수, why:{}}, …]}] */
function m4Ask(host, api, items, opts = {}) {
  const wrap = h("div", { class: "m4ask", style: "margin-top:.6em" }), all = [];
  if (opts.title) wrap.append(h("p", { class: "inst" }, opts.title));
  items.forEach(it => {
    const box = h("div", { class: "qitem" });
    if (it.q) box.append(h("div", { class: "jua" }, it.q));
    if (it.fig) box.append(typeof it.fig === "function" ? it.fig() : it.fig);
    const sent = h("p", { class: "sent" });
    (it.parts || []).forEach(pt => {
      if (typeof pt === "string") { sent.append(pt); return; }
      if (pt.o) {
        const slot = h("span", { class: "slot" }), s = { pt, v: null, slot };
        pt.o.forEach((o, oi) => slot.append(h("button", { class: "opt", onclick: e => { [...slot.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); s.v = oi; } }, o)));
        sent.append(slot); all.push(s);
      } else {
        const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": "답", style: "width:3.4em;font-size:1.1em;text-align:center" });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? pt.o[pt.acc ? pt.acc[0] : pt.a] : String(pt.n);
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.acc ? s.pt.acc.includes(s.v) : s.v === s.pt.a) : m4Num(s.inp.value) === s.pt.n;
  const val = s => s.pt.o ? (s.v == null ? "-" : s.pt.o[s.v]) : (s.inp.value.trim() || "-");
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => { if (s.pt.o) { const b = s.slot.children[s.v]; if (b) b.classList.add(good(s) ? "good" : "bad"); } else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)"; });
    const bad = all.find(s => !good(s));
    if (!bad) return api.done(ans, opts.ok);
    const key = bad.pt.o ? String(bad.v) : String(m4Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}
/* 조작을 마친 뒤: 물음이 있으면 물음, 없으면 바로 해결 */
function m4Finish(body, api, opt, ans, msg) {
  if (opt.ask && opt.ask.length) { api.hint(msg || "잘했어요! 아래 물음에 답해 봐요."); const w = m4Ask(body, api, opt.ask, { ok: opt.ok, title: opt.askTitle }); setTimeout(() => { try { w.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 50); }
  else api.done(ans, opt.ok || msg);
}

/* =========================================================
   1. 모눈 놀이판 — 조각을 밀고(단추·끌기), 뒤집고, 돌린다
   opt: {w,h,U, piece, start:[x,y], M0, ctrl:["slide","flip","rot"], ghost, deco(g,U),
         tasks:[{t:"fit", st:{x,y,M} | pts:[[x,y]…], label} | {t:"try", ops:["slide:위","flip:왼","rot:cw90"…], label}], ask, ok, tip}
   ========================================================= */
function m4Board(body, api, opt) {
  const U = opt.U || 44, W = opt.w, H = opt.h, svg = makeSvg(W * U, H * U), pc = m4P(opt.piece);
  m4Grid(svg, 0, 0, W, H, U);
  const decoG = svgEl("g"), tgtG = svgEl("g"), ghostG = svgEl("g", { opacity: .28 }), pG = svgEl("g", { style: "cursor:grab" }), pIn = svgEl("g"), nG = svgEl("g", { "pointer-events": "none" });
  pc.draw(pIn); pG.append(pIn); svg.append(decoG, tgtG, ghostG, pG, nG);
  svg.style.touchAction = "none";
  if (opt.deco) opt.deco(decoG, U);
  const st0 = { x: opt.start[0], y: opt.start[1], M: opt.M0 || M4_I }; let st = Object.assign({}, st0), busy = false;
  const ctr = s => { const d = m4Dims(pc, s.M); return [(s.x + d[0] / 2) * U, (s.y + d[1] / 2) * U]; };
  const place = (A, c) => { pIn.setAttribute("transform", m4XfC(pc, A, c[0], c[1], U)); nG.innerHTML = ""; m4Names(nG, pc, A, c[0], c[1], U); };
  const draw = () => place(st.M, ctr(st));
  const inside = s => { const d = m4Dims(pc, s.M); return s.x >= 0 && s.y >= 0 && s.x + d[0] <= W && s.y + d[1] <= H; };
  const clampS = s => { const d = m4Dims(pc, s.M); return { x: Math.max(0, Math.min(W - d[0], s.x)), y: Math.max(0, Math.min(H - d[1], s.y)), M: s.M }; };
  if (opt.ghost !== false) { const gi = svgEl("g"); pc.draw(gi); const c = ctr(st0); gi.setAttribute("transform", m4XfC(pc, st0.M, c[0], c[1], U)); ghostG.append(gi); }
  const tasks = opt.tasks || []; let ti = 0, tried = new Set();
  const list = h("ol", { style: "margin:.2em 0;padding-left:1.3em" }), last = h("div", { class: "readout", style: "font-size:var(--fs)" }, "아직 움직이지 않았어요.");
  const drawTarget = () => {
    tgtG.innerHTML = ""; const t = tasks[ti]; if (!t || t.t !== "fit") return;
    if (t.pts) tgtG.append(svgEl("polygon", { points: t.pts.map(p => `${p[0] * U},${p[1] * U}`).join(" "), fill: "rgba(232,182,48,.16)", stroke: M4_GOLD, "stroke-width": 4, "stroke-dasharray": "9 7" }));
    else { const d = m4Dims(pc, t.st.M), gi = svgEl("g", { opacity: .22 }); pc.draw(gi); gi.setAttribute("transform", m4XfC(pc, t.st.M, (t.st.x + d[0] / 2) * U, (t.st.y + d[1] / 2) * U, U)); tgtG.append(gi, svgEl("rect", { x: t.st.x * U + 2, y: t.st.y * U + 2, width: d[0] * U - 4, height: d[1] * U - 4, rx: 10, fill: "none", stroke: M4_GOLD, "stroke-width": 4, "stroke-dasharray": "9 7" })); }
  };
  const showList = () => { list.innerHTML = ""; tasks.forEach((t, i) => list.append(h("li", { style: i === ti ? "font-weight:bold" : (i < ti ? "color:var(--ok)" : "color:var(--muted)") }, t.label + (t.t === "try" && i === ti ? ` (${t.ops.filter(o => tried.has(o)).length}/${t.ops.length})` : "") + (i < ti ? " ✓" : "")))); };
  const fitOk = t => t.pts ? m4Key(m4Abs(pc, st)) === m4Key(t.pts) : (st.x === t.st.x && st.y === t.st.y && m4Eq(st.M, t.st.M));
  const answers = [];
  function checkTask() {
    const t = tasks[ti]; if (!t) return;
    const ok = t.t === "fit" ? fitOk(t) : t.ops.every(o => tried.has(o));
    if (!ok) { showList(); return; }
    answers.push(t.label); ti++; tried = new Set(); drawTarget(); showList();
    if (ti >= tasks.length) { api.tryOnce(); disable(); m4Finish(body, api, opt, answers.join(" / "), opt.doneMsg || "모두 해냈어요!"); }
    else api.hint(t.okMsg || "좋아요! 다음 할 일을 해 봐요.");
  }
  function doOp(op, label) {
    if (busy || ti >= tasks.length) return;
    const from = st; let to;
    if (op.t === "slide") { const v = M4_DIRV[op.dir]; to = { x: st.x + v[0], y: st.y + v[1], M: st.M }; if (!inside(to)) return api.hint("더 밀면 모눈 밖으로 나가요. 다른 쪽으로 밀어 봐요."); }
    else { const M = m4Mul(m4OpM(op), st.M), d0 = m4Dims(pc, st.M), d1 = m4Dims(pc, M), c = [st.x + d0[0] / 2, st.y + d0[1] / 2]; to = clampS({ x: Math.round(c[0] - d1[0] / 2), y: Math.round(c[1] - d1[1] / 2), M }); }
    busy = true; const c0 = ctr(from), c1 = ctr(to);
    m4Anim(op.t === "slide" ? 220 : 560, t => {
      const c = [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t]; let A = from.M;
      if (op.t === "rot") { const th = (op.cw ? 1 : -1) * op.deg * Math.PI / 180 * t; A = m4Mul([Math.cos(th), -Math.sin(th), Math.sin(th), Math.cos(th)], from.M); }
      if (op.t === "flip") { const s = 1 - 2 * t; A = m4Mul((op.dir === "위" || op.dir === "아래") ? [1, 0, 0, s] : [s, 0, 0, 1], from.M); }
      place(A, c);
    }, () => { st = to; busy = false; draw(); last.textContent = "방금: " + label; tried.add(op.t === "slide" ? "slide:" + op.dir : op.t === "flip" ? "flip:" + op.dir : `rot:${op.cw ? "cw" : "ccw"}${op.deg}`); checkTask(); });
  }
  // 끌어서 밀기
  let drag = null;
  dragOn(svg, p => {
    if (busy || ti >= tasks.length) return false;
    const d = m4Dims(pc, st.M);
    if (p.x < st.x * U || p.x > (st.x + d[0]) * U || p.y < st.y * U || p.y > (st.y + d[1]) * U) return false;
    drag = { p0: p, s0: Object.assign({}, st) }; pG.style.cursor = "grabbing";
  }, p => {
    if (!drag) return;
    const n = clampS({ x: drag.s0.x + Math.round((p.x - drag.p0.x) / U), y: drag.s0.y + Math.round((p.y - drag.p0.y) / U), M: st.M });
    if (n.x !== st.x || n.y !== st.y) { st = n; draw(); }
  }, () => {
    if (!drag) return; pG.style.cursor = "grab";
    const dx = st.x - drag.s0.x, dy = st.y - drag.s0.y; drag = null;
    if (!dx && !dy) return;
    const parts = []; if (dx) parts.push(`${dx > 0 ? "오른" : "왼"}쪽으로 ${Math.abs(dx)}칸`); if (dy) parts.push(`${dy > 0 ? "아래" : "위"}쪽으로 ${Math.abs(dy)}칸`);
    last.textContent = "방금: 끌어서 " + parts.join(", ") + " 밀기";
    if (dx) tried.add("slide:" + (dx > 0 ? "오른" : "왼")); if (dy) tried.add("slide:" + (dy > 0 ? "아래" : "위"));
    checkTask();
  });
  const ctrl = opt.ctrl || ["slide", "flip", "rot"], side = [h("p", {}, opt.tip || "단추를 누르거나 조각을 끌어서 움직여요. 흐린 그림은 처음 자리예요."), list, last];
  const btns = [];
  const B = (label, op, text) => { const b = h("button", { onclick: () => doOp(op, text || m4OpText(op)) }, label); btns.push(b); return b; };
  if (ctrl.includes("slide")) side.push(h("b", {}, "밀기 (한 번에 1칸)"), h("div", { style: "display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.3em;max-width:16em" },
    h("span"), B("▲ 위", m4Sl("위", 1), "위쪽으로 1칸 밀기"), h("span"), B("◀ 왼", m4Sl("왼", 1), "왼쪽으로 1칸 밀기"), h("span"), B("오른 ▶", m4Sl("오른", 1), "오른쪽으로 1칸 밀기"), h("span"), B("▼ 아래", m4Sl("아래", 1), "아래쪽으로 1칸 밀기"), h("span")));
  if (ctrl.includes("flip")) side.push(h("b", {}, "뒤집기"), m4Tools(...M4_DIRS.map(d => B(`${d}쪽으로`, m4Fl(d)))));
  if (ctrl.includes("rot")) {
    let cw = true; const dirB = [h("button", { class: "on" }, "↻ 시계 방향"), h("button", {}, "↺ 시계 반대 방향")];
    dirB.forEach((b, i) => b.addEventListener("click", () => { cw = i === 0; dirB.forEach((x, k) => x.classList.toggle("on", k === i)); }));
    side.push(h("b", {}, "돌리기 (방향을 고르고 각도를 눌러요)"), m4Tools(...dirB), m4Tools(...[90, 180, 270, 360].map(dg => { const b = h("button", { onclick: () => doOp(m4R(cw, dg), m4OpText(m4R(cw, dg))) }, dg + "°"); btns.push(b); return b; })));
  }
  const reset = h("button", { onclick: () => { if (busy) return; st = Object.assign({}, st0); draw(); last.textContent = "처음 자리로 돌아왔어요."; } }, "처음으로");
  side.push(m4Tools(reset));
  function disable() { btns.forEach(b => b.disabled = true); reset.disabled = true; }
  api.provide({ words: opt.words || ["밀기", "뒤집기", "돌리기", "위치", "방향", "모양"], answers: [] });
  body.append(stageWrap(svg, m4Side(...side)));
  draw(); drawTarget(); showList();
}

/* =========================================================
   2. 그리기 — 모눈의 꼭짓점을 눌러 이동한 도형을 그린다
   opt: {mode:"slide"|"free", shape:{pts,names,fill}, U,
         slide: w,h,pos:[x,y] ; free: dw (그리는 칸 수), before:true(움직인 도형을 보고 처음 도형 그리기)
         tasks:[{op}], ask, ok, tip, unit:"칸"|"cm"}
   ========================================================= */
function m4Draw(body, api, opt) {
  const free = opt.mode !== "slide", pc = m4P(opt.shape), N = pc.pts.length, tasks = opt.tasks, unit = opt.unit || "칸";
  const U = opt.U || 40, T = free ? 34 : 0;
  let W, H, ox = 0, ox2 = 0, DW, DH, given = null;
  if (!free) { W = opt.w; H = opt.h; DW = W; DH = H; }
  else { const S = Math.max(pc.bw, pc.bh); const ow = S + 2; DW = DH = opt.dw || S + 4; W = ow + 1 + DW; H = DH; ox2 = (ow + 1) * U; given = { ow }; }
  const svg = makeSvg(W * U, H * U + T);
  const baseG = svgEl("g"), doneG = svgEl("g"), chainG = svgEl("g"), prev = svgEl("line", { stroke: TENT, "stroke-width": 3, "stroke-dasharray": "6 6", opacity: 0 });
  svg.append(baseG, doneG, chainG, prev);
  const dotG = svgEl("g");
  if (!free) { m4Grid(baseG, 0, 0, W, H, U); }
  else {
    m4Grid(baseG, 0, T, given.ow, H, U, "#E2E8EE"); m4Grid(baseG, ox2, T, DW, DH, U);
    baseG.append(txt(given.ow * U / 2, 17, opt.before ? "움직인 도형" : "처음 도형", 20, { fill: M4_GRAY }), txt(ox2 + DW * U / 2, 17, "여기에 그려요", 20, { fill: BLUE }));
  }
  for (let x = 0; x <= DW; x++) for (let y = 0; y <= DH; y++) dotG.append(svgEl("circle", { cx: ox2 + x * U, cy: T + y * U, r: 2.6, fill: "#9AB0C8" }));
  baseG.append(dotG);
  // 처음(또는 주어진) 도형
  const opM = t => m4OpM(t.op);
  let refPts;   // 모눈 좌표(그리는 판 기준이 아닌 원래 판 기준)
  const polyAttr = (pts, x0, y0) => pts.map(p => `${m4F(x0 + p[0] * U)},${m4F(y0 + p[1] * U)}`).join(" ");
  const labelAt = (g, pts, names, x0, y0, col) => { if (!names) return; const c = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length]; pts.forEach((p, i) => { const d = [p[0] - c[0], p[1] - c[1]], L = Math.hypot(d[0], d[1]) || 1, off = Math.max(.32, 14 / U); g.append(txt(x0 + (p[0] + d[0] / L * off) * U, y0 + (p[1] + d[1] / L * off) * U, names[i], Math.max(15, Math.min(22, U * .5)), { fill: col || INK })); }); };
  const fill0 = opt.shape.fill || "#DCEAFB", str0 = opt.shape.stroke || BLUE;
  if (!free) {
    refPts = pc.pts.map(p => [p[0] + opt.pos[0], p[1] + opt.pos[1]]);
    baseG.append(svgEl("polygon", { points: polyAttr(refPts, 0, 0), fill: fill0, stroke: str0, "stroke-width": 4, "stroke-linejoin": "round" }));
    labelAt(baseG, refPts, pc.names, 0, 0);
  }
  let ti = 0, chain = [];
  const gal = h("div", { style: "display:flex;flex-wrap:wrap;gap:.4em" });
  const list = h("ol", { style: "margin:.2em 0;padding-left:1.3em" }), out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const givenG = svgEl("g"); baseG.append(givenG);
  // 자유 그리기에서 왼쪽에 보여 줄 도형
  const showGiven = () => {
    if (!free) return; givenG.innerHTML = "";
    const t = tasks[ti] || tasks[tasks.length - 1];
    const M = opt.before ? opM(t) : M4_I;
    const n = m4Norm(m4TP(pc.pts, M)), bw = Math.max(...n.map(p => p[0])), bh = Math.max(...n.map(p => p[1]));
    const x0 = Math.floor((given.ow - bw) / 2) * U, y0 = T + Math.floor((H - bh) / 2) * U;
    givenG.append(svgEl("polygon", { points: polyAttr(n, x0, y0), fill: fill0, stroke: str0, "stroke-width": 4, "stroke-linejoin": "round" }));
    // 꼭짓점 이름도 같이 움직임
    labelAt(givenG, n, pc.names ? m4NamesAfter(pc, M) : null, x0, y0);
  };
  const expectFree = t => opt.before ? pc.pts.map(p => p.slice()) : m4TP(pc.pts, opM(t));   /* before: 왼쪽에 보이는 것이 움직인 도형(opM·처음 도형)이므로 답은 처음 도형 */
  const showList = () => { list.innerHTML = ""; tasks.forEach((t, i) => list.append(h("li", { style: i === ti ? "font-weight:bold" : (i < ti ? "color:var(--ok)" : "color:var(--muted)") }, (t.label || m4OpText(Object.assign({ unit }, t.op))) + (i < ti ? " ✓" : "")))); };
  const drawChain = () => {
    chainG.innerHTML = "";
    if (chain.length > 1) chainG.append(svgEl("polyline", { points: polyAttr(chain, ox2, T), fill: "none", stroke: TENT, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" }));
    chain.forEach((p, i) => chainG.append(svgEl("circle", { cx: ox2 + p[0] * U, cy: T + p[1] * U, r: i === chain.length - 1 ? 8 : 6, fill: TENT })));
    out.textContent = ti >= tasks.length ? "모두 그렸어요!" : chain.length ? `찍은 꼭짓점 ${chain.length}개 / ${N}개` : "꼭짓점을 차례대로 눌러요.";
  };
  const answers = [];
  function finishTask(pts) {
    const t = tasks[ti], [fl, st] = M4_FILLS[(ti + 1) % M4_FILLS.length];
    const poly = svgEl("polygon", { points: polyAttr(pts, ox2, T), fill: fl, stroke: st, "stroke-width": 4, "stroke-linejoin": "round", opacity: .95 });
    doneG.append(poly);
    let names = null;
    if (pc.names) {
      if (!free) names = pc.names;
      else names = m4NamesAfter(pc, opt.before ? m4Inv(opM(t)) : opM(t));
      const lg = svgEl("g"); labelAt(lg, pts, names, ox2, T); doneG.append(lg);
    }
    answers.push(t.label || m4OpText(Object.assign({ unit }, t.op)));
    if (free) {   // 결과를 옆 모음으로 옮김
      const mnx = Math.min(...pts.map(p => p[0])), mny = Math.min(...pts.map(p => p[1])), n = pts.map(p => [p[0] - mnx, p[1] - mny]), bw = Math.max(...n.map(p => p[0])), bh = Math.max(...n.map(p => p[1])), u = 22, SW = Math.max(bw * u + 40, 130), x0 = (SW - bw * u) / 2, s = makeSvg(SW, bh * u + 56);
      const op = t.op, short = t.short || (op.t === "flip" ? `${op.dir}쪽으로` : op.t === "rot" ? `${op.cw ? "시계" : "시계 반대"} ${op.deg}°` : `${op.dir} ${op.n}`);
      s.append(svgEl("polygon", { points: n.map(p => `${x0 + p[0] * u},${34 + p[1] * u}`).join(" "), fill: fl, stroke: st, "stroke-width": 3 }), txt(SW / 2, 14, short, 16));
      if (names) { const c = [n.reduce((a, p) => a + p[0], 0) / N, n.reduce((a, p) => a + p[1], 0) / N]; n.forEach((p, i) => { const d = [p[0] - c[0], p[1] - c[1]], L = Math.hypot(d[0], d[1]) || 1; s.append(txt(x0 + (p[0] + d[0] / L * .55) * u, 34 + (p[1] + d[1] / L * .55) * u, names[i], 13)); }); }
      Object.assign(s.style, { width: "6.4em", height: "auto", border: "2px solid #DCE4E0", borderRadius: "10px", background: "#fff" });
      gal.append(s);
      setTimeout(() => { if (ti < tasks.length) doneG.innerHTML = ""; }, 1000);
    }
    ti++; chain = []; showList(); showGiven(); drawChain();
    if (ti >= tasks.length) { m4Finish(body, api, opt, answers.join(" / "), opt.doneMsg || "모두 알맞게 그렸어요!"); return; }
    api.hint("맞아요! 다음 도형을 그려 봐요.");
  }
  function check() {
    const t = tasks[ti]; if (!t) return; api.tryOnce();
    const pts = chain.slice(), ans = pts.map(p => `(${p})`).join("");
    if (!free) {
      const v = M4_DIRV[t.op.dir], n = t.op.n, want = refPts.map(p => [p[0] + v[0] * n, p[1] + v[1] * n]);
      if (m4Key(pts) === m4Key(want)) return finishTask(want);
      chain = []; drawChain();
      if (m4NKey(pts) !== m4NKey(refPts)) return api.fail("모양이 달라졌어요. 도형을 밀어도 모양은 그대로예요. 처음 도형의 꼭짓점을 하나씩 옮겨 그려요.", ans);
      const mx = Math.min(...pts.map(p => p[0])) - Math.min(...refPts.map(p => p[0])), my = Math.min(...pts.map(p => p[1])) - Math.min(...refPts.map(p => p[1]));
      const along = mx * v[0] + my * v[1], side = mx * v[1] - my * v[0];
      if (side === 0 && along > 0) {
        const ext = v[0] ? pc.bw : pc.bh;
        if (along === n + ext) return api.fail(`두 도형 사이의 빈칸을 ${n}칸으로 띄웠어요. 밀기는 같은 꼭짓점이 ${m4U(n, unit)} 움직이는 거예요. 한 꼭짓점에서부터 세어 봐요.`, ans);
        return api.fail(`${m4U(along, unit)} 밀었어요. ${t.op.dir}쪽으로 ${m4U(n, unit, "이/가")} 되도록 같은 꼭짓점끼리 한 칸씩 세어 봐요.`, ans);
      }
      return api.fail(`${t.op.dir}쪽으로 밀어야 해요. 미는 방향을 다시 봐요.`, ans);
    }
    const want = expectFree(t);
    if (m4NKey(pts) === m4NKey(want)) { const mx = Math.min(...pts.map(p => p[0])), my = Math.min(...pts.map(p => p[1])); return finishTask(m4Norm(want).map(p => [p[0] + mx, p[1] + my])); }
    chain = []; drawChain();
    const base = opt.before ? m4TP(pc.pts, opM(t)) : pc.pts;
    const E = M4_D4.find(M => m4NKey(m4TP(base, M)) === m4NKey(pts));
    if (!E) return api.fail("모양이 달라졌어요. 뒤집거나 돌려도 변의 길이와 모양은 그대로예요. 꼭짓점을 다시 찍어 봐요.", ans);
    if (opt.before) return api.fail(m4Eq(E, M4_I) ? "움직인 도형과 똑같이 그렸어요. 거꾸로 생각해서 처음 도형을 찾아요." : `그린 도형은 움직인 도형을 ${m4MName(E).replace(" 모양", "")} 것이에요. 거꾸로 생각해서 처음 도형을 찾아요.`, ans);
    return api.fail(`그린 도형은 ${m4MName(E)}이에요. ${t.op.t === "flip" ? "어느 쪽이 서로 바뀌는지" : "위쪽 부분이 어느 쪽으로 가는지"} 다시 생각해 봐요.`, ans);
  }
  svg.addEventListener("click", e => {
    if (ti >= tasks.length) return;
    const p = svgPt(svg, e), q = [Math.round((p.x - ox2) / U), Math.round((p.y - T) / U)];
    if (q[0] < 0 || q[0] > DW || q[1] < 0 || q[1] > DH) return;
    if (Math.hypot(ox2 + q[0] * U - p.x, T + q[1] * U - p.y) > U * .45) return;
    if (chain.some(c => c[0] === q[0] && c[1] === q[1])) return api.hint("이미 찍은 점이에요. 다른 점을 찍어요.");
    chain.push(q); drawChain(); prev.setAttribute("opacity", 0);
    if (chain.length === N) setTimeout(check, 250);
  });
  svg.addEventListener("pointermove", e => { if (!chain.length) return; const p = svgPt(svg, e), l = chain[chain.length - 1]; prev.setAttribute("x1", ox2 + l[0] * U); prev.setAttribute("y1", T + l[1] * U); prev.setAttribute("x2", p.x); prev.setAttribute("y2", p.y); prev.setAttribute("opacity", 1); });
  api.provide({ words: opt.words || ["위치", "방향", "모양은 그대로"], answers: [] });
  const tip = opt.tip || (free ? "오른쪽 모눈의 꼭짓점을 차례대로 눌러 도형을 그려요. 그리는 자리는 어디든 괜찮아요." : "모눈의 꼭짓점을 차례대로 눌러 민 도형을 그려요.");
  body.append(stageWrap(svg, m4Side(h("p", {}, tip), list, out,
    m4Tools(h("button", { onclick: () => { chain.pop(); drawChain(); } }, "점 하나 지우기"), h("button", { onclick: () => { chain = []; drawChain(); } }, "다시 그리기")),
    free ? h("div", {}, h("b", {}, "그린 도형 모음"), gal) : null)));
  showList(); showGiven(); drawChain();
}
/* 움직인 뒤 꼭짓점 이름: 정규화된 꼭짓점 차례는 그대로이므로 이름 배열도 그대로 */
function m4NamesAfter(pc, M) { return pc.names; }

/* =========================================================
   3. 점 밀기 — place: 민 점의 자리를 누른다 / explain: 민 방법을 설명한다
   opt: {w,h,U, unit:"칸"|"cm", mode, from:{n,p}, tasks:[{dir,k}], pts:[{n,p,q}], example:{n,dir,k}, ask, ok}
   ========================================================= */
function m4Point(body, api, opt) {
  const U = opt.U || 44, W = opt.w, H = opt.h, unit = opt.unit || "칸", svg = makeSvg(W * U, H * U);
  m4Grid(svg, 0, 0, W, H, U);
  const lay = svgEl("g"); svg.append(lay);
  const COL = [BLUE, TENT, PINE, "#7A5BB0", "#B08A1E"];
  const dot = (p, col, hollow, name) => { const g = svgEl("g"); g.append(svgEl("circle", { cx: p[0] * U, cy: p[1] * U, r: hollow ? 9 : 10, fill: hollow ? "#fff" : col, stroke: col, "stroke-width": hollow ? 4 : 2 })); if (name) g.append(txt(p[0] * U + 15, p[1] * U - 15, name, 22, { fill: col })); lay.append(g); return g; };
  const side = [];
  if (unit === "cm") side.push(h("div", { class: "pill" }, "모눈 한 칸 = 1 cm"));
  if (opt.mode === "place") {
    const P = opt.from.p, tasks = opt.tasks; let ti = 0;
    dot(P, BLUE, false, "점 " + opt.from.n);
    const list = h("ol", { style: "margin:.2em 0;padding-left:1.3em" });
    const showList = () => { list.innerHTML = ""; tasks.forEach((t, i) => list.append(h("li", { style: i === ti ? "font-weight:bold" : (i < ti ? "color:var(--ok)" : "color:var(--muted)") }, `점 ${opt.from.n}을 ${t.dir}쪽으로 ${m4U(t.k, unit)} 밀기` + (i < ti ? " ✓" : "")))); };
    const answers = [];
    svg.addEventListener("click", e => {
      if (ti >= tasks.length) return;
      const p = svgPt(svg, e), q = [Math.round(p.x / U), Math.round(p.y / U)];
      if (Math.hypot(q[0] * U - p.x, q[1] * U - p.y) > U * .45) return;
      const t = tasks[ti], v = M4_DIRV[t.dir], want = [P[0] + v[0] * t.k, P[1] + v[1] * t.k]; api.tryOnce();
      if (q[0] === want[0] && q[1] === want[1]) {
        const col = COL[(ti + 1) % COL.length];
        m4Arrow(lay, P[0] * U + v[0] * 12, P[1] * U + v[1] * 12, q[0] * U - v[0] * 12, q[1] * U - v[1] * 12, col, 3.5);
        dot(q, col, true); lay.append(txt(q[0] * U + (v[0] ? v[0] * 4 : 34), q[1] * U + (v[1] ? v[1] * 26 : -22), `${t.dir} ${t.k}`, 17, { fill: col }));
        answers.push(`${t.dir} ${m4U(t.k, unit)}`); ti++; showList();
        if (ti >= tasks.length) return m4Finish(body, api, opt, answers.join(" / "), "네 방향으로 모두 밀었어요!");
        return api.hint("맞아요! 다음 방향으로 밀어 봐요.");
      }
      const dx = q[0] - P[0], dy = q[1] - P[1], along = dx * v[0] + dy * v[1], off = dx * v[1] - dy * v[0];
      if (off === 0 && along > 0) return api.fail(`방향은 맞아요. 점 ${opt.from.n}에서 ${t.dir}쪽으로 선을 따라 한 칸씩 ${m4U(t.k, unit, "을/를")} 세어 봐요. (지금은 ${m4U(along, unit)})`, `(${q})`);
      api.fail(`${t.dir}쪽으로 밀어야 해요. 점 ${opt.from.n}에서 어느 쪽으로 움직이는지 다시 봐요.`, `(${q})`);
    });
    side.unshift(h("p", {}, "점을 민 자리를 모눈의 꼭짓점에서 눌러요."));
    side.push(list);
    api.provide({ words: ["위쪽", "아래쪽", "왼쪽", "오른쪽", "칸"], answers: tasks.map(t => `${t.dir}쪽으로 ${m4U(t.k, unit)}`) });
    body.append(stageWrap(svg, m4Side(...side)));
    showList(); return;
  }
  // explain
  const trail = svgEl("g"); svg.insertBefore(trail, lay);
  opt.pts.forEach((pt, i) => { const col = COL[i % COL.length]; dot(pt.p, col, false, pt.n); dot(pt.q, col, true); });
  if (opt.example) side.push(h("div", { class: "safe" }, `보기: 점 ${opt.example.n}을 ${opt.example.dir}쪽으로 ${m4U(opt.example.k, unit)} 밀었습니다.`));
  side.unshift(h("p", {}, "● 처음 점, ○ 민 뒤의 점이에요. 같은 색끼리 짝이에요."));
  side.push(m4Tools(h("button", { onclick: () => {
    trail.innerHTML = "";
    opt.pts.forEach((pt, i) => { const v = [Math.sign(pt.q[0] - pt.p[0]), Math.sign(pt.q[1] - pt.p[1])]; m4Arrow(trail, pt.p[0] * U + v[0] * 12, pt.p[1] * U + v[1] * 12, pt.q[0] * U - v[0] * 12, pt.q[1] * U - v[1] * 12, COL[i % COL.length], 3); });
  } }, "화살표로 보기")));
  body.append(stageWrap(svg, m4Side(...side)));
  const items = opt.pts.filter(pt => !(opt.example && opt.example.n === pt.n)).map(pt => {
    const dx = pt.q[0] - pt.p[0], dy = pt.q[1] - pt.p[1], dir = dx > 0 ? "오른" : dx < 0 ? "왼" : dy > 0 ? "아래" : "위", k = Math.abs(dx || dy);
    return { parts: [`점 ${pt.n}을 `, { o: M4_DIRS, a: M4_DIRS.indexOf(dir), why: Object.fromEntries(M4_DIRS.map((d, i) => [String(i), `점 ${pt.n}에서 ○ 점이 어느 쪽에 있는지 다시 봐요.`])) }, "쪽으로 ", { n: k, why: { [String(k + 1)]: "점이 놓인 선의 수가 아니라 움직인 칸 수를 세어요." } }, `${unit === "cm" ? " cm" : "칸"} 밀었습니다.`] };
  });
  m4Ask(body, api, items, { ok: opt.ok });
}

/* =========================================================
   4. 돌리기 판 — 바늘·퍼즐 조각·관을 돌린다
   opt: {pic, mode:"predict"|"aim"|"before", tasks, goal:"오른"|M, ways, after:M, how:op, start:M, deco(g), ask, ok}
   ========================================================= */
function m4Spin(body, api, opt) {
  const pc = m4P(opt.pic), S = 600, C = 300, U = opt.U || 120, svg = makeSvg(S, S);
  const decoG = svgEl("g"), insetG = svgEl("g"), pG = svgEl("g"), fxG = svgEl("g"); svg.append(decoG, insetG, pG, fxG);
  if (opt.deco) opt.deco(decoG);
  const inner = svgEl("g"); pc.draw(inner); pG.append(inner);
  let cur = opt.start || M4_I, busy = false;
  const place = A => inner.setAttribute("transform", m4XfC(pc, A, C, C, U));
  const upTo = M => { const v = m4Ap(M, [0, -1]); return v[1] < -.5 ? "위" : v[1] > .5 ? "아래" : v[0] > .5 ? "오른" : "왼"; };
  const rotAnim = (from, op, done) => { busy = true; m4Anim(op.deg >= 270 ? 900 : 650, t => { const th = (op.cw ? 1 : -1) * op.deg * Math.PI / 180 * t; place(m4Mul([Math.cos(th), -Math.sin(th), Math.sin(th), Math.cos(th)], from)); }, () => { busy = false; done(); }); };
  const side = [], readout = h("div", { class: "readout", style: "font-size:var(--fs)" }, "");
  const inset = (M, label) => { insetG.innerHTML = ""; const g = svgEl("g"); g.append(svgEl("rect", { x: 8, y: 8, width: 150, height: 172, rx: 12, fill: "#fff", stroke: "#C9D4CF", "stroke-width": 3 }), txt(83, 28, label, 19, { fill: M4_GRAY })); const ii = svgEl("g"); pc.draw(ii); ii.setAttribute("transform", m4XfC(pc, M, 83, 110, 60)); g.append(ii); insetG.append(g); };
  place(cur);
  if (opt.mode === "predict") {
    const tasks = opt.tasks; let ti = 0;
    const targets = { "위": [C, 44], "오른": [S - 44, C], "아래": [C, S - 44], "왼": [44, C] }, glyph = { "위": "▲", "오른": "▶", "아래": "▼", "왼": "◀" };
    decoG.append(svgEl("circle", { cx: C, cy: C, r: 200, fill: "none", stroke: "#DCE4E0", "stroke-width": 3, "stroke-dasharray": "6 10" }));
    const tg = {};
    Object.entries(targets).forEach(([d, p]) => {
      const g = svgEl("g", { style: "cursor:pointer" }), c = svgEl("circle", { cx: p[0], cy: p[1], r: 34, fill: "#FFF7E8", stroke: TENT, "stroke-width": 3 });
      g.append(c, txt(p[0], p[1] + 1, glyph[d], 26, { fill: TENT })); decoG.append(g); tg[d] = c;
      g.addEventListener("click", () => pick(d));
    });
    const list = h("ol", { style: "margin:.2em 0;padding-left:1.3em" }), answers = [];
    const showList = () => { list.innerHTML = ""; tasks.forEach((t, i) => list.append(h("li", { style: i === ti ? "font-weight:bold" : (i < ti ? "color:var(--ok)" : "color:var(--muted)") }, m4OpText(t).replace("돌리기", "돌리면?") + (i < ti ? ` → ${t.res}쪽 ✓` : "")))); readout.textContent = ti < tasks.length ? `${m4OpText(tasks[ti])}: 뾰족한 부분이 가리킬 쪽을 눌러요.` : "모두 맞혔어요!"; };
    function pick(d) {
      if (busy || ti >= tasks.length) return;
      const t = tasks[ti], M = m4Mul(m4OpM(t), M4_I), res = upTo(M); api.tryOnce();
      Object.values(tg).forEach(c => c.setAttribute("fill", "#FFF7E8")); tg[d].setAttribute("fill", "#FDE3D3");
      cur = M4_I; place(cur);
      rotAnim(M4_I, t, () => {
        cur = M;
        if (d === res) {
          tg[d].setAttribute("fill", "#DFF2E6"); t.res = res; answers.push(`${m4OpText(t)}: ${res}`); ti++;
          setTimeout(() => { cur = M4_I; place(cur); Object.values(tg).forEach(c => c.setAttribute("fill", "#FFF7E8")); showList(); if (ti >= tasks.length) m4Finish(body, api, opt, answers.join(" / "), "예상을 모두 확인했어요!"); }, 900);
          api.hint(`맞아요! 위쪽에 있던 뾰족한 부분이 ${res === "위" ? "다시 위쪽으로 왔어요(처음과 같아요)" : res + "쪽으로 갔어요"}.`);
        } else {
          tg[d].setAttribute("fill", "#FBE7E2");
          api.fail(`돌려 보니 뾰족한 부분이 ${res}쪽을 가리켜요. ${t.cw ? "시계 방향은 시곗바늘이 도는 쪽" : "시계 반대 방향은 시곗바늘과 반대로 도는 쪽"}이에요. 다시 눌러 봐요.`, d);
          setTimeout(() => { cur = M4_I; place(cur); }, 1300);
        }
      });
    }
    side.push(h("p", {}, opt.tip || "먼저 예상하고 화살표를 누르면, 바늘이 돌아가서 예상이 맞는지 보여 줘요."), list, readout);
    api.provide({ words: ["시계 방향", "시계 반대 방향", "위쪽", "오른쪽", "아래쪽", "왼쪽"], answers: [] });
    body.append(stageWrap(svg, m4Side(...side))); showList(); return;
  }
  // 방향 + 각도 고르기 컨트롤
  let cw = true;
  const dirB = [h("button", { class: "on" }, "↻ 시계 방향"), h("button", {}, "↺ 시계 반대 방향")];
  dirB.forEach((b, i) => b.addEventListener("click", () => { cw = i === 0; dirB.forEach((x, k) => x.classList.toggle("on", k === i)); }));
  if (opt.mode === "aim") {
    const goalM = Array.isArray(opt.goal) ? opt.goal : null, ways = opt.ways || 1, found = [];
    if (goalM) inset(goalM, opt.goalLabel || "돌린 후");
    const list = h("ul", { style: "margin:.2em 0;padding-left:1.3em" });
    const showFound = () => { list.innerHTML = ""; found.forEach(f => list.append(h("li", { style: "color:var(--ok)" }, f + " ✓"))); readout.textContent = ways > 1 ? `찾은 방법 ${found.length} / ${ways}가지` : ""; };
    const go = deg => {
      if (busy || found.length >= ways) return;
      const op = m4R(cw, deg), M = m4OpM(op);
      cur = M4_I; place(cur);
      rotAnim(M4_I, op, () => {
        cur = M; api.tryOnce();
        const ok = goalM ? m4Eq(M, goalM) : upTo(M) === opt.goal, txt0 = m4OpText(op);
        if (!ok) { api.fail(`${txt0}: ${goalM ? "돌린 후의 모양과 달라요" : "뾰족한 부분이 " + upTo(M) + "쪽을 가리켜요"}. 다른 방향이나 각도로 해 봐요.`, txt0); setTimeout(() => { cur = M4_I; place(cur); }, 1100); return; }
        if (found.some(f => f === txt0)) return api.hint("이미 찾은 방법이에요. 다른 방법을 찾아봐요.");
        if (ways > 1 && found.length && (found[0].startsWith("시계 반대") === !cw)) return api.hint("맞지만 같은 방향 방법이에요. 반대 방향으로도 찾아봐요.");
        found.push(txt0); showFound();
        if (found.length >= ways) { setTimeout(() => m4Finish(body, api, opt, found.join(" / "), "방법을 찾았어요!"), 300); }
        else { api.hint("한 가지 찾았어요! 반대 방향으로 돌려서 같은 모양을 만드는 방법도 찾아봐요."); setTimeout(() => { cur = M4_I; place(cur); }, 1100); }
      });
    };
    side.push(h("p", {}, opt.tip || "돌리는 방향을 고른 다음 각도를 눌러요. 누를 때마다 처음 모양에서 돌려요."), m4Tools(...dirB), m4Tools(...[90, 180, 270, 360].map(d => h("button", { onclick: () => go(d) }, d + "°"))), list, readout);
    api.provide({ words: ["시계 방향", "시계 반대 방향", "90°", "180°", "270°"], answers: [] });
    body.append(stageWrap(svg, m4Side(...side))); showFound(); return;
  }
  // before: 돌린 뒤 모습을 보고 돌리기 전 모습 만들기
  inset(opt.after, "돌린 후");
  cur = opt.start || opt.after; place(cur);
  const turn = (c) => { if (busy) return; const op = m4R(c, 90); rotAnim(cur, op, () => { cur = m4Mul(m4OpM(op), cur); place(cur); }); };
  const checkB = h("button", { class: "big", onclick: () => {
    if (busy) return; api.tryOnce();
    const from = cur, M = m4Mul(m4OpM(opt.how), cur);
    rotAnim(from, opt.how, () => {
      if (m4Eq(M, opt.after)) { cur = M; place(cur); inner.innerHTML = ""; M4_PIC[opt.pic].draw(inner, { water: true }); place(cur); checkB.disabled = true; m4Finish(body, api, opt, "돌리기 전: " + m4MName(from), opt.goodMsg || "맞아요! 이 모습을 돌리면 물이 흘러요."); }
      else { api.fail(`이 모습을 ${m4OpText(opt.how).replace("돌리기", "돌리면")} 돌린 후의 모습과 달라요. 거꾸로 생각해 봐요.`, m4MName(from)); setTimeout(() => { cur = from; place(cur); }, 1000); }
    });
  } }, `${m4OpText(opt.how).replace("돌리기", "돌려서")} 확인하기`);
  side.push(h("p", {}, opt.tip || "가운데 관을 돌려 ‘돌리기 전’ 모습을 만들어요. 그다음 확인 단추를 누르면 정말 돌려 봐요."),
    m4Tools(h("button", { onclick: () => turn(true) }, "↻ 시계 방향 90°"), h("button", { onclick: () => turn(false) }, "↺ 시계 반대 방향 90°")), checkB);
  api.provide({ words: ["거꾸로 생각하기", "시계 방향", "시계 반대 방향"], answers: [] });
  body.append(stageWrap(svg, m4Side(...side)));
}

/* =========================================================
   5. 투명 수 카드 뒤집기 (디지털 숫자)
   opt: {cards:[820], dir:"아래", sum:false, ok}
   ========================================================= */
const M4_SEG = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
const M4_UD = { a: "d", b: "c", c: "b", d: "a", e: "f", f: "e", g: "g" }, M4_LR = { a: "a", b: "f", c: "e", d: "d", e: "c", f: "b", g: "g" };
function m4FlipNum(n, dir) {
  const ds = String(n).split(""), map = (dir === "위" || dir === "아래") ? M4_UD : M4_LR;
  const out = ds.map(d => { const segs = M4_SEG[d].split("").map(s => map[s]).sort().join(""); const k = Object.keys(M4_SEG).find(x => M4_SEG[x].split("").sort().join("") === segs); if (k == null) throw new Error("뒤집으면 숫자가 아니에요: " + d); return k; });
  return Number((map === M4_LR ? out.reverse() : out).join(""));
}
function m4Digit(g, x, y, d, col) {
  const R = { a: [8, 0, 34, 9], d: [8, 81, 34, 9], g: [8, 40.5, 34, 9], f: [0, 6, 9, 36], b: [41, 6, 9, 36], e: [0, 48, 9, 36], c: [41, 48, 9, 36] };
  M4_SEG[d].split("").forEach(s => { const r = R[s]; g.append(svgEl("rect", { x: x + r[0], y: y + r[1], width: r[2], height: r[3], rx: 4, fill: col || INK })); });
}
function m4Card(body, api, opt) {
  const wrap = h("div", { style: "display:flex;flex-wrap:wrap;gap:1em;align-items:flex-end" }), ins = [], cards = [];
  opt.cards.forEach((n, i) => {
    const ds = String(n), w = ds.length * 66 + 34, s = makeSvg(w, 150), g = svgEl("g");
    g.append(svgEl("rect", { x: 4, y: 4, width: w - 8, height: 142, rx: 14, fill: "rgba(150,200,255,.28)", stroke: "#7FA7D9", "stroke-width": 3 }));
    ds.split("").forEach((d, k) => m4Digit(g, 22 + k * 66, 30, d, "#1F4E8C"));
    s.append(g); Object.assign(s.style, { width: Math.min(14, ds.length * 4 + 2) + "em", maxWidth: "100%", height: "auto", display: "block" });
    const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": "뒤집은 수", style: "width:5em;font-size:1.2em;text-align:center" });
    ins.push({ inp, want: m4FlipNum(n, opt.dir), n }); cards.push({ g, w, s });
    wrap.append(h("div", { class: "qitem" }, s, h("div", {}, `${opt.dir}쪽으로 뒤집으면 `, inp)));
  });
  let sumIn = null;
  if (opt.sum) { sumIn = h("input", { type: "text", inputmode: "numeric", "aria-label": "합", style: "width:5em;font-size:1.2em;text-align:center" }); }
  const want = ins.map(x => x.want), total = want.reduce((a, b) => a + b, 0);
  api.provide({ words: ["위쪽과 아래쪽이 바뀌어요", "2 ↔ 5"], answers: want.map(String).concat(opt.sum ? [String(total)] : []) });
  const flipAll = () => cards.forEach(c => { m4Anim(800, t => { const s = 1 - 2 * t; c.g.setAttribute("transform", (opt.dir === "위" || opt.dir === "아래") ? `translate(0,75) scale(1,${m4F(s)}) translate(0,-75)` : `translate(${c.w / 2},0) scale(${m4F(s)},1) translate(${-c.w / 2},0)`); }); });
  let fails = 0;
  const seeB = h("button", { class: "ghost hidden", onclick: flipAll }, "카드를 뒤집어 보기");
  body.append(h("p", { class: "inst" }, `투명한 카드라서 뒤집어도 수가 비쳐 보여요. ${opt.dir}쪽으로 뒤집으면 어떤 수가 될지 예상해서 써요.`), wrap,
    ...(opt.sum ? [h("div", { class: "qitem" }, h("span", { class: "jua" }, "뒤집어서 나온 두 수의 합: "), sumIn)] : []),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); let ok = true;
      ins.forEach(x => { const g = m4Num(x.inp.value) === x.want; x.inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; });
      if (sumIn) { const g = m4Num(sumIn.value) === total; sumIn.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; }
      const ans = ins.map(x => x.inp.value).concat(sumIn ? [sumIn.value] : []).join(", ");
      if (ok) { flipAll(); return api.done(ans, opt.ok || `카드를 뒤집어 보니 ${opt.sum ? want.join(", ") + ", 합은 " + m4Jo(total, "이에요/예요") : m4Jo(want.join(", "), "이에요/예요")}!`); }
      fails++; if (fails >= 2) seeB.classList.remove("hidden");
      const bad = ins.find(x => m4Num(x.inp.value) !== x.want);
      if (bad && m4Num(bad.inp.value) === bad.n) return api.fail("뒤집기 전과 같은 수를 썼어요. 위쪽과 아래쪽이 바뀌면 2는 어떤 모양이 될까요?", ans);
      api.fail(bad ? "숫자 하나하나의 위쪽과 아래쪽을 바꾸어 생각해요. 0, 1, 3, 8은 그대로, 2는 5처럼 보여요." : "두 수를 다시 더해 봐요.", ans);
    } }, "확인하기"), seeB));
}

/* =========================================================
   6. 무늬 만들기 — 무늬 조각 도장을 찍는다
   opt: {mode:"fill"|"rule"|"slide", cols, rows, U, color,
         fill: given:[[M|null…]…], ans:[[M…]…]
         rule: rule:op | rules:[op…] (고르기), block:{w,h,order:[[x,y]…]}
         slide: block:{w,h}, ok}
   ========================================================= */
function m4Pattern(body, api, opt) {
  const C = opt.cols, R = opt.rows, U = opt.U || 70, svg = makeSvg(C * U, R * U), pc = m4P({ pic: "motif", color: opt.color });
  const cellsG = svgEl("g"), hiG = svgEl("g"), animG = svgEl("g"); svg.append(cellsG, hiG, animG);
  const cells = Array.from({ length: R }, (_, y) => Array.from({ length: C }, (_, x) => opt.given ? (opt.given[y][x] ? { M: opt.given[y][x], c: opt.color, fixed: true } : null) : null));
  const COLS = ["#E47A38", "#2B7BD6", "#2F8B57"];
  let stampM = M4_I, stampC = opt.color || COLS[0];
  const drawCell = (g, x, y, v, extra) => { const ii = svgEl("g"); pm(v.c).draw(ii); ii.setAttribute("transform", m4XfC(pc, v.M, x * U + U / 2, y * U + U / 2, U)); if (extra) ii.setAttribute("opacity", extra); g.append(ii); };
  const pm = c => m4P({ pic: "motif", color: c });
  const draw = () => {
    cellsG.innerHTML = "";
    for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
      cellsG.append(svgEl("rect", { x: x * U, y: y * U, width: U, height: U, fill: cells[y][x] ? "#fff" : "#F4F7F9", stroke: "#C9D4CF", "stroke-width": 1.5 }));
      if (cells[y][x]) drawCell(cellsG, x, y, cells[y][x]);
      else if (opt.mode === "fill") cellsG.append(txt(x * U + U / 2, y * U + U / 2, "?", U * .4, { fill: "#B7C4CF" }));
    }
  };
  const prevS = makeSvg(120, 120), prevG = svgEl("g"); prevS.append(prevG); Object.assign(prevS.style, { width: "5.2em", height: "5.2em", border: "2px solid #DCE4E0", borderRadius: "10px", background: "#fff" });
  const showStamp = () => { prevG.innerHTML = ""; const ii = svgEl("g"); pm(stampC).draw(ii); ii.setAttribute("transform", m4XfC(pc, stampM, 60, 60, 100)); prevG.append(ii); };
  const turnS = op => { stampM = m4Mul(m4OpM(op), stampM); showStamp(); };
  const stampTools = (ops) => m4Tools(...ops.map(op => h("button", { onclick: () => turnS(op) }, op.t === "rot" ? `${op.cw ? "↻ 시계" : "↺ 시계 반대"} ${op.deg}°` : `${op.dir}쪽으로 뒤집기`)));
  const side = [], out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const motifName = "무늬 조각";
  // ---------- 빈칸 채우기 ----------
  if (opt.mode === "fill") {
    svg.addEventListener("click", e => { const p = svgPt(svg, e), x = Math.floor(p.x / U), y = Math.floor(p.y / U); if (x < 0 || y < 0 || x >= C || y >= R) return; if (cells[y][x] && cells[y][x].fixed) return api.hint("이미 있는 칸이에요. ? 칸을 눌러요."); cells[y][x] = { M: stampM, c: opt.color }; hiG.innerHTML = ""; draw(); });
    side.push(h("p", {}, opt.tip || "도장을 돌려 모양을 맞춘 다음 ? 칸을 눌러 찍어요. 다시 찍으면 바뀌어요."), h("b", {}, "지금 도장"), prevS, stampTools(opt.ops || [m4R(true, 90), m4R(false, 90)]),
      h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
        api.tryOnce(); hiG.innerHTML = ""; let ok = true, empty = false; const ans = [];
        for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) if (!opt.given[y][x]) {
          const v = cells[y][x]; if (!v) { empty = true; ok = false; continue; }
          const g = m4Eq(v.M, opt.ans[y][x]); ans.push(m4MName(v.M)); if (!g) { ok = false; hiG.append(svgEl("rect", { x: x * U + 3, y: y * U + 3, width: U - 6, height: U - 6, fill: "none", stroke: M4_NO, "stroke-width": 5 })); }
        }
        if (ok) return api.done(ans.join(" / "), opt.ok || "규칙에 맞게 무늬를 완성했어요!");
        api.fail(empty ? "아직 채우지 않은 ? 칸이 있어요." : (opt.bad || "빨간 칸을 다시 봐요. 옆 칸으로 갈 때 모양이 어떻게 바뀌는지 규칙을 찾아요."), ans.join(" / "));
      } }, "확인하기")));
    api.provide({ words: opt.words || ["시계 방향으로 90°", "규칙"], answers: [] });
    body.append(stageWrap(svg, m4Side(...side))); draw(); showStamp(); return;
  }
  // ---------- 규칙(돌리기)·밀기로 무늬 만들기 ----------
  const bw = opt.block.w, bh = opt.block.h, nbx = C / bw, nby = R / bh;
  const order = opt.block.order || (() => { const o = []; for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) o.push([x, y]); return o; })();
  let rule = opt.rule || null, phase = opt.mode === "slide" ? "block" : (rule ? "block" : "rule"), used = [];
  if (opt.mode === "rule") cells[order[0][1]][order[0][0]] = { M: M4_I, c: stampC, fixed: true };
  const hiBlock = (bx, by, col) => hiG.append(svgEl("rect", { x: bx * bw * U + 2, y: by * bh * U + 2, width: bw * U - 4, height: bh * U - 4, fill: "none", stroke: col || M4_GOLD, "stroke-width": 5, "stroke-dasharray": "10 7", rx: 6 }));
  const placed = Array.from({ length: nby }, (_, y) => Array.from({ length: nbx }, (_, x) => x === 0 && y === 0));
  const ruleBox = h("div");
  const copyBox = h("div", { class: "hidden" });
  const status = () => { hiG.innerHTML = ""; if (phase === "block") hiBlock(0, 0); out.textContent = phase === "rule" ? "먼저 규칙을 골라요." : phase === "block" ? (opt.mode === "slide" ? "노란 테두리 안에 무늬 조각을 찍어 기본 모양을 만들어요." : `노란 테두리 안을 규칙대로 채워요. (${order.filter(o => cells[o[1]][o[0]]).length}/${order.length})`) : phase === "copy" ? "만든 모양을 밀어서 무늬를 넓혀요." : "무늬를 완성했어요!"; };
  if (opt.mode === "rule" && !opt.rule) {
    let rc = true; const db = [h("button", { class: "on" }, "↻ 시계 방향"), h("button", {}, "↺ 시계 반대 방향")];
    db.forEach((b, i) => b.addEventListener("click", () => { rc = i === 0; db.forEach((x, k) => x.classList.toggle("on", k === i)); }));
    ruleBox.append(h("b", {}, "① 규칙 고르기"), m4Tools(...db), m4Tools(...[90, 180, 270].map(d => h("button", { onclick: () => { if (phase !== "rule") return; rule = m4R(rc, d); phase = "block"; ruleBox.append(h("div", { class: "pill" }, "규칙: " + m4OpText(rule))); status(); } }, d + "°만큼"))));
  } else if (rule) ruleBox.append(h("div", { class: "pill" }, "규칙: " + m4OpText(rule)));
  const finishBlock = () => {
    if (opt.mode === "rule") {
      const R0 = m4OpM(rule); let bad = -1;
      for (let i = 1; i < order.length; i++) { const a = cells[order[i - 1][1]][order[i - 1][0]], b = cells[order[i][1]][order[i][0]]; if (!m4Eq(b.M, m4Mul(R0, a.M))) { bad = i; break; } }
      api.tryOnce();
      if (bad >= 0) { const o = order[bad]; cells[o[1]][o[0]] = null; draw(); status(); hiG.append(svgEl("rect", { x: o[0] * U + 3, y: o[1] * U + 3, width: U - 6, height: U - 6, fill: "none", stroke: M4_NO, "stroke-width": 5 })); return api.fail(`앞 칸의 모양을 ${m4OpText(rule).replace("돌리기", "돌린")} 모양이 다음 칸에 와야 해요. 빨간 칸을 다시 찍어요.`, "규칙과 다른 칸"); }
    }
    phase = "copy"; copyBox.classList.remove("hidden"); status(); api.hint("기본 모양을 만들었어요! 이제 밀어서 무늬를 넓혀요.");
  };
  svg.addEventListener("click", e => {
    if (phase !== "block") return;
    const p = svgPt(svg, e), x = Math.floor(p.x / U), y = Math.floor(p.y / U);
    if (x < 0 || y < 0 || x >= bw || y >= bh) return api.hint("노란 테두리 안에 찍어요.");
    if (cells[y][x] && cells[y][x].fixed) return api.hint("이 칸은 처음 모양이에요.");
    if (opt.mode === "slide") { cells[y][x] = cells[y][x] && cells[y][x].c === stampC ? null : { M: M4_I, c: stampC }; draw(); status(); return; }
    cells[y][x] = { M: stampM, c: stampC }; draw(); status();
    if (order.every(o => cells[o[1]][o[0]])) setTimeout(finishBlock, 200);
  });
  const animCopy = (fx, fy, tx, ty, done) => {
    animG.innerHTML = ""; const g = svgEl("g", { opacity: .85 });
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) { const v = cells[fy * bh + y][fx * bw + x]; if (v) drawCell(g, fx * bw + x, fy * bh + y, v); }
    animG.append(g);
    m4Anim(450, t => g.setAttribute("transform", `translate(${m4F((tx - fx) * bw * U * t)},${m4F((ty - fy) * bh * U * t)})`), () => { animG.innerHTML = ""; done(); });
  };
  const copyTo = (fx, fy, tx, ty) => { for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) { const v = cells[fy * bh + y][fx * bw + x]; cells[ty * bh + y][tx * bw + x] = v ? { M: v.M, c: v.c } : null; } placed[ty][tx] = true; };
  let busy = false;
  const right = () => {
    if (busy || phase !== "copy") return;
    let ty = 0; while (ty < nby && placed[ty].every(Boolean)) ty++;
    if (ty >= nby) return; const tx = placed[ty].indexOf(false);
    if (tx === 0) return api.hint("이 줄의 첫 칸이 비어 있어요. 아래쪽으로 밀어 봐요.");
    busy = true; animCopy(tx - 1, ty, tx, ty, () => { copyTo(tx - 1, ty, tx, ty); busy = false; used.push(`오른쪽으로 ${bw}칸`); draw(); after(); });
  };
  const down = () => {
    if (busy || phase !== "copy") return;
    let ty = 1; while (ty < nby && placed[ty][0]) ty++;
    if (ty >= nby) return api.hint("더 아래쪽에는 자리가 없어요.");
    const row = ty - 1; if (!placed[row].every(Boolean) && nbx > 1 && opt.needRowFirst) return api.hint("먼저 오른쪽으로 밀어서 윗줄을 채워요.");
    busy = true; let n = 0; const cols = []; for (let x = 0; x < nbx; x++) if (placed[row][x]) cols.push(x);
    cols.forEach(x => animCopy(x, row, x, ty, () => { copyTo(x, row, x, ty); if (++n === cols.length) { busy = false; used.push(`아래쪽으로 ${bh}칸`); draw(); after(); } }));
  };
  const after = () => {
    status();
    if (placed.every(r => r.every(Boolean))) {
      phase = "end"; status();
      const ds = [...new Set(used.map(u => u.split("쪽")[0]))], d = (ds.length > 1 ? ds.map((x, i) => i < ds.length - 1 ? x + "쪽과" : x + "쪽으로").join(" ") : ds[0] + "쪽으로") + " 밀어서";
      const how = opt.mode === "rule" ? `${m4OpText(rule).replace("돌리기", "돌리는")} 것을 반복해서 모양을 만들고, 그 모양을 ${d} 무늬를 만들었어요.` : `기본 모양을 ${d} 무늬를 만들었어요.`;
      m4Finish(body, api, opt, how, how);
    }
  };
  copyBox.append(h("b", {}, opt.mode === "rule" ? "③ 만든 모양 밀기" : "② 기본 모양 밀기"), m4Tools(h("button", { onclick: right }, `오른쪽으로 ${bw}칸 밀기 ▶`), h("button", { onclick: down }, `아래쪽으로 ${bh}칸 밀기 ▼`)));
  if (opt.mode === "slide") {
    const cb = COLS.map((c, i) => { const b = h("button", { class: i === 0 ? "on" : "", style: `border-color:${c};color:${c}` }, "■ " + ["주황", "파랑", "초록"][i]); b.addEventListener("click", () => { stampC = c; cb.forEach(x => x.classList.toggle("on", x === b)); showStamp(); }); return b; });
    side.push(h("p", {}, opt.tip || "① 노란 테두리 안의 칸을 눌러 무늬 조각을 찍어요(같은 색을 다시 누르면 지워져요). ② ‘기본 모양 다 만들었어요’를 누르고 밀어서 무늬를 만들어요."), h("b", {}, "① 기본 모양 만들기"), m4Tools(...cb), prevS,
      m4Tools(h("button", { onclick: () => { if (phase !== "block") return; let n = 0; for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) if (cells[y][x]) n++; if (n < 2) return api.hint("무늬 조각을 두 개 이상 찍어 기본 모양을 만들어요."); finishBlock(); } }, "기본 모양 다 만들었어요")), copyBox, out);
  } else {
    side.push(h("p", {}, opt.tip || "규칙에 맞게 도장을 돌려서 노란 테두리 안의 빈칸을 차례대로 채워요."), ruleBox, h("b", {}, "② 도장 돌려 찍기"), prevS, stampTools(opt.ops || [m4R(true, 90), m4R(false, 90)]), copyBox, out);
    if (order.length > 1) side.splice(1, 0, m4Small("채우는 차례: " + order.map((o, i) => i === 0 ? "처음 칸" : `${i + 1}번째 칸`).join(" → ") + (bh > 1 ? " (시계 방향으로 한 바퀴)" : " (왼쪽에서 오른쪽으로)")));
  }
  api.provide({ words: ["밀기", "돌리기", "규칙", "반복"], answers: [] });
  body.append(stageWrap(svg, m4Side(...side))); draw(); showStamp(); status();
}

/* =========================================================
   7. 길 조각 — 돌리기 단추로 길을 잇는다 / 나만의 길 만들기
   opt: {cols, rows, U, start:r, goal:r, tiles:[{x,y,kind,need,r,no}], once, build, ok}
   ========================================================= */
const M4_BTN = [{ l: "㉠", cw: true, deg: 90 }, { l: "㉡", cw: true, deg: 180 }, { l: "㉢", cw: true, deg: 270 }, { l: "㉣", cw: false, deg: 90 }, { l: "㉤", cw: false, deg: 180 }, { l: "㉥", cw: false, deg: 270 }];
const M4_NUM = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
function m4TileOpen(kind, r) { r = ((r % 4) + 4) % 4; return kind === "corner" ? [r, (r + 1) % 4] : [r % 2, (r % 2) + 2]; }
function m4TileOk(t) { return t.kind === "corner" ? ((t.r % 4) + 4) % 4 === t.need : (((t.r % 2) + 2) % 2) === t.need % 2; }
function m4TileDraw(g, kind, col) {   // 0번 방향: 꺾인 길은 위·오른쪽, 곧은 길은 위·아래
  const d = kind === "corner" ? "M50 0 L50 30 Q50 50 70 50 L100 50" : "M50 0 L50 100";
  g.append(svgEl("rect", { x: 1, y: 1, width: 98, height: 98, rx: 6, fill: "#D8EDC6", stroke: "#9CC07E", "stroke-width": 1.5 }),
    svgEl("path", { d, fill: "none", stroke: col || "#B9B2A6", "stroke-width": 36 }),
    svgEl("path", { d, fill: "none", stroke: "#fff", "stroke-width": 3, "stroke-dasharray": "8 8" }));
}
function m4TileFig(kind, rs, opt = {}) {   // 길 조각 그림 여러 개 (rs: 방향들), 사이에 화살표
  const u = 70, n = rs.length, s = makeSvg(n * u + (n - 1) * 46 + 8, u + 30);
  rs.forEach((r, i) => { const x = 4 + i * (u + 46), g = svgEl("g", { transform: `translate(${x},22) scale(${u / 100}) rotate(${90 * r} 50 50)` }); m4TileDraw(g, kind); s.append(g); if (opt.labels) s.append(txt(x + u / 2, 11, opt.labels[i], 15, { fill: M4_GRAY })); if (i < n - 1) m4Arrow(s, x + u + 8, 22 + u / 2, x + u + 38, 22 + u / 2, TENT, 3); });
  Object.assign(s.style, { maxWidth: (n * 6) + "em", width: "100%", display: "block", margin: ".3em 0" });
  return s;
}
function m4Road(body, api, opt) {
  const C = opt.cols, R = opt.rows, U = opt.U || 100, ox = U * .9, oy = U * .15, svg = makeSvg(C * U + ox * 2, R * U + oy * 2);
  const bgG = svgEl("g"), tG = svgEl("g"), fxG = svgEl("g"); svg.append(bgG, tG, fxG);
  bgG.append(svgEl("rect", { x: ox, y: oy, width: C * U, height: R * U, fill: "#E9F4DF", stroke: "#9CC07E", "stroke-width": 3, rx: 8 }));
  const sy = opt.start, gy = opt.goal;
  // 출발·도착
  bgG.append(svgEl("rect", { x: 4, y: oy + sy * U + U * .32, width: ox - 4, height: U * .36, fill: "#B9B2A6" }), txt(ox / 2, oy + sy * U + U * .18, "출발", Math.max(16, U * .2), { fill: PINE }));
  bgG.append(svgEl("rect", { x: ox + C * U, y: oy + gy * U + U * .32, width: ox - 4, height: U * .36, fill: "#B9B2A6" }));
  const chest = svgEl("g", { transform: `translate(${ox + C * U + ox * .5},${oy + gy * U + U * .5})` });
  chest.append(svgEl("rect", { x: -U * .3, y: -U * .16, width: U * .6, height: U * .38, rx: 6, fill: "#B5752F", stroke: "#6E4518", "stroke-width": 3 }), svgEl("rect", { x: -U * .3, y: -U * .3, width: U * .6, height: U * .16, rx: 6, fill: "#D08A3C", stroke: "#6E4518", "stroke-width": 3 }), svgEl("rect", { x: -U * .05, y: -U * .12, width: U * .1, height: U * .12, fill: M4_GOLD }));
  bgG.append(chest, txt(ox + C * U + ox * .5, oy + gy * U + U * .9, "보물", Math.max(15, U * .18), { fill: "#8A5A1E" }));
  const tiles = opt.build ? [] : opt.tiles.map((t, i) => Object.assign({ r0: t.r, no: M4_NUM[i] }, t));
  const grid = Array.from({ length: R }, () => Array(C).fill(null));
  tiles.forEach(t => grid[t.y][t.x] = t);
  let sel = opt.build ? null : tiles[0], busy = false;
  const drawTiles = () => {
    tG.innerHTML = "";
    for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
      const t = grid[y][x], gx = ox + x * U, gy2 = oy + y * U;
      if (!t) { if (!opt.build) { tG.append(svgEl("circle", { cx: gx + U * .5, cy: gy2 + U * .45, r: U * .2, fill: "#7FB069" }), svgEl("rect", { x: gx + U * .46, y: gy2 + U * .6, width: U * .08, height: U * .2, fill: "#8A6248" })); } else tG.append(svgEl("rect", { x: gx + 3, y: gy2 + 3, width: U - 6, height: U - 6, rx: 6, fill: "none", stroke: "#B7D3A2", "stroke-width": 2, "stroke-dasharray": "6 6" })); continue; }
      const g = svgEl("g", { transform: `translate(${gx},${gy2}) scale(${U / 100})` }), r = svgEl("g", { transform: `rotate(${90 * t.r} 50 50)` }); t._g = r;
      m4TileDraw(r, t.kind, t.lit ? M4_GOLD : null); g.append(r);
      if (t.no) g.append(svgEl("circle", { cx: 16, cy: 16, r: 13, fill: "#fff", stroke: INK, "stroke-width": 2 }), txt(16, 17, t.no, 18));
      if (t === sel) g.append(svgEl("rect", { x: 3, y: 3, width: 94, height: 94, rx: 8, fill: "none", stroke: TENT, "stroke-width": 6 }));
      tG.append(g);
    }
  };
  const walk = () => {   // 출발점부터 따라가기 → 지난 칸 목록, 도착하면 ok
    const dx = [0, 1, 0, -1], dy = [-1, 0, 1, 0]; let x = 0, y = sy, from = 3; const path = [];
    for (let k = 0; k <= C * R; k++) {
      const t = grid[y] && grid[y][x]; if (!t) return { ok: false, path, at: [x, y] };
      const op = m4TileOpen(t.kind, t.r); if (!op.includes(from)) return { ok: false, path, at: [x, y] };
      path.push(t); const out = op[0] === from ? op[1] : op[0];
      const nx = x + dx[out], ny = y + dy[out];
      if (nx === C && ny === gy && out === 1) return { ok: true, path };
      if (nx < 0 || ny < 0 || nx >= C || ny >= R) return { ok: false, path, at: [x, y] };
      x = nx; y = ny; from = (out + 2) % 4;
    }
    return { ok: false, path };
  };
  const light = () => { const w = walk(); w.path.forEach(t => t.lit = true); drawTiles(); return w; };
  const side = [], out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const rotTile = (t, cw, deg, done) => { busy = true; const a0 = 90 * t.r; m4Anim(deg === 180 ? 650 : 700, e => t._g.setAttribute("transform", `rotate(${m4F(a0 + (cw ? 1 : -1) * deg * e)} 50 50)`), () => { t.r = ((t.r + (cw ? 1 : -1) * deg / 90) % 4 + 4) % 4; busy = false; drawTiles(); done && done(); }); };
  if (!opt.build) {
    svg.addEventListener("click", e => { if (busy) return; const p = svgPt(svg, e), x = Math.floor((p.x - ox) / U), y = Math.floor((p.y - oy) / U); const t = grid[y] && grid[y][x]; if (t) { sel = t; drawTiles(); out.textContent = `${t.no} 길 조각을 골랐어요.`; } });
    const record = [];
    const press = b => {
      if (busy || !sel) return; const t = sel;
      if (opt.once && t.used) return api.hint(`${m4JoS(t.no, "은/는")} 이미 단추를 눌렀어요. 다른 길 조각을 골라요.`);
      rotTile(t, b.cw, b.deg, () => {
        out.textContent = `${t.no}: ${b.l} ${m4OpText(m4R(b.cw, b.deg))}`;
        if (opt.once) {
          t.used = true; api.tryOnce();
          if (!m4TileOk(t)) { api.fail(`${m4JoS(t.no, "을/를")} ${m4JoS(b.l, "으로/로")} 돌리면 길이 이어지지 않아요. 처음 모양으로 돌아가요.`, `${t.no} ${b.l}`); setTimeout(() => { t.r = t.r0; t.used = false; drawTiles(); }, 900); return; }
        }
        record.push(`${t.no} ${b.l}`);
        if (tiles.every(m4TileOk)) { const w = light(); if (w.ok) { busy = true; m4Finish(body, api, opt, record.join(", "), "길이 모두 이어져서 보물을 찾았어요!"); } }
      });
    };
    side.push(h("p", {}, opt.tip || "길 조각을 눌러 고른 다음 돌리기 단추를 눌러요. 단추를 누르면 그 방향과 각도만큼 돌아가요."),
      h("div", { style: "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.3em" }, ...M4_BTN.map(b => h("button", { class: "opt", style: "padding:.25em .5em", onclick: () => press(b) }, `${b.l} ${b.cw ? "시계" : "시계 반대"} ${b.deg}°`))),
      m4Tools(h("button", { onclick: () => { if (busy) return; tiles.forEach(t => { t.r = t.r0; t.used = false; t.lit = false; }); drawTiles(); out.textContent = "처음 모양으로 돌아왔어요."; } }, "처음으로")), out);
    api.provide({ words: M4_BTN.map(b => `${b.l} ${b.cw ? "시계" : "시계 반대"} 방향 ${b.deg}°`), answers: [] });
    body.append(stageWrap(svg, m4Side(...side))); drawTiles(); return;
  }
  // 나만의 길 만들기
  let kind = "straight", r = 0;
  const prevS = makeSvg(110, 110), pg = svgEl("g"); prevS.append(pg); Object.assign(prevS.style, { width: "4.8em", height: "4.8em" });
  const rName = (k, r) => r === 0 ? "돌리지 않은 모양" : r === 1 ? "시계 방향으로 90°만큼 돌린 모양" : r === 2 ? "시계 방향으로 180°만큼 돌린 모양" : "시계 반대 방향으로 90°만큼 돌린 모양";
  const info = h("div", { style: "font-size:var(--fs-s)" });
  const showPrev = () => { pg.innerHTML = ""; const g = svgEl("g", { transform: `translate(5,5) rotate(${90 * r} 50 50)` }); m4TileDraw(g, kind); pg.append(g); info.textContent = `${kind === "corner" ? "꺾인 길" : "곧은 길"}: ${rName(kind, r)}`; };
  const kb = [h("button", { class: "on" }, "곧은 길"), h("button", {}, "꺾인 길")];
  kb.forEach((b, i) => b.addEventListener("click", () => { kind = i ? "corner" : "straight"; r = 0; kb.forEach(x => x.classList.toggle("on", x === b)); showPrev(); }));
  const notes = {};
  svg.addEventListener("click", e => {
    const p = svgPt(svg, e), x = Math.floor((p.x - ox) / U), y = Math.floor((p.y - oy) / U);
    if (x < 0 || y < 0 || x >= C || y >= R) return;
    const cur = grid[y][x];
    if (cur && cur.kind === kind && cur.r === r) { grid[y][x] = null; delete notes[`${x},${y}`]; }
    else { grid[y][x] = { kind, r, x, y }; notes[`${x},${y}`] = `${kind === "corner" ? "꺾인 길" : "곧은 길"}을 ${["그대로", "시계 방향으로 90°만큼 돌려서", "시계 방향으로 180°만큼 돌려서", "시계 반대 방향으로 90°만큼 돌려서"][r]} 놓기`; }
    Object.values(grid).forEach(row => row.forEach(t => t && (t.lit = false))); drawTiles();
  });
  side.push(h("p", {}, "길 조각을 고르고 돌린 다음, 칸을 눌러 놓아요. 같은 조각을 다시 누르면 지워져요. 출발에서 보물까지 이어 봐요."), m4Tools(...kb),
    h("div", { style: "display:flex;gap:.6em;align-items:center" }, prevS, info),
    m4Tools(h("button", { onclick: () => { r = (r + 1) % 4; showPrev(); } }, "↻ 시계 방향 90°"), h("button", { onclick: () => { r = (r + 3) % 4; showPrev(); } }, "↺ 시계 반대 방향 90°")),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); grid.forEach(row => row.forEach(t => t && (t.lit = false)));
      const w = light();
      if (!w.ok) return api.fail(w.path.length ? "길이 중간에 끊겼어요. 금색 길이 끝난 곳을 살펴봐요." : "출발점 바로 옆 칸부터 길을 놓아요.", `${w.path.length}칸 이어짐`);
      const desc = w.path.map(t => notes[`${t.x},${t.y}`]).filter(Boolean);
      if (!w.path.some(t => t.r !== 0)) return api.fail("길 조각을 돌려서 놓은 곳이 있어야 해요. 조각을 돌려서 길을 만들어 봐요.", "돌리지 않음");
      api.done(desc.join(" / "), "나만의 길을 완성했어요! 내가 쓴 방법: " + [...new Set(desc)].join(", ") + ". 모둠 친구에게 만든 방법을 설명해 봐요.");
    } }, "길 확인하기")));
  api.provide({ words: ["곧은 길", "꺾인 길", "시계 방향으로 90°만큼"], answers: [] });
  body.append(stageWrap(svg, m4Side(...side))); drawTiles(); showPrev();
}

/* =========================================================
   8. 인형극 무대 — 이동 카드로 종이 인형을 움직인다
   opt: {mode:"cards"|"script"|"build"|"guess", rows, pool, rounds, ok}
   ========================================================= */
const M4_CARDS = [m4Sl("위", 2), m4Sl("아래", 2), m4Sl("왼", 2), m4Sl("오른", 2), m4Fl("왼"), m4Fl("위"), m4R(true, 90), m4R(true, 180), m4R(false, 90), m4R(false, 180)];
const m4CardText = i => { const op = M4_CARDS[i]; return `${M4_NUM[i]} ${op.t === "slide" ? op.dir + "쪽으로 밀기" : m4OpText(op)}`; };
const M4_PUP = { rabbit: "토끼", fox: "여우", dog: "개", snake: "뱀" };
function m4Play(body, api, opt) {
  const W = 12, H = 7, U = 50, svg = makeSvg(W * U, H * U), GY = 4, HX = [5, 6];
  const bg = svgEl("g"), pupG = svgEl("g"); svg.append(bg, pupG);
  bg.append(svgEl("rect", { x: 0, y: 0, width: W * U, height: GY * U, fill: "#EAF4FB" }), svgEl("rect", { x: 0, y: GY * U, width: W * U, height: (H - GY) * U, fill: "#C9A97A" }),
    svgEl("rect", { x: HX[0] * U, y: GY * U, width: 2 * U, height: (H - GY) * U, fill: "#6B4F35" }), svgEl("rect", { x: 0, y: GY * U - 5, width: HX[0] * U, height: 10, fill: "#7FB069" }), svgEl("rect", { x: (HX[1] + 1) * U, y: GY * U - 5, width: (W - HX[1] - 1) * U, height: 10, fill: "#7FB069" }),
    txt((HX[0] + 1) * U, (H - .4) * U, "구덩이", 17, { fill: "#F3E6D4" }));
  m4Grid(bg, 0, 0, W, H, U, "rgba(120,140,160,.18)");
  const solid = (x, y) => y >= GY && !(HX.includes(x));
  const valid = s => { if (s.x < 0 || s.y < 0 || s.x + 2 > W || s.y + 2 > H) return false; for (let y = s.y; y < s.y + 2; y++) for (let x = s.x; x < s.x + 2; x++) if (solid(x, y)) return false; return true; };
  const apply = (s, i) => { const op = M4_CARDS[i]; if (op.t === "slide") { const v = M4_DIRV[op.dir]; return { x: s.x + v[0] * op.n, y: s.y + v[1] * op.n, M: s.M }; } return { x: s.x, y: s.y, M: m4Mul(m4OpM(op), s.M) }; };
  const same = (a, b) => a.x === b.x && a.y === b.y && m4Eq(a.M, b.M);
  const P = {}, init = opt.init || { rabbit: { x: 5, y: 2, M: M4_I } };
  Object.entries(init).forEach(([k, s]) => { const g = svgEl("g"), pc = m4P(k); pc.draw(g); pupG.append(g); P[k] = { g, pc, s: Object.assign({}, s), s0: Object.assign({}, s) }; });
  const put = (k, A, c) => P[k].g.setAttribute("transform", m4XfC(P[k].pc, A, c[0], c[1], U));
  const ctr = s => [(s.x + 1) * U, (s.y + 1) * U];
  const show = k => put(k, P[k].s.M, ctr(P[k].s));
  Object.keys(P).forEach(show);
  let busy = false;
  const move = (k, i, done) => {
    const from = P[k].s, to = apply(from, i), op = M4_CARDS[i], c0 = ctr(from), c1 = ctr(to); busy = true;
    pupG.append(P[k].g);
    m4Anim(op.t === "slide" ? 500 : 700, t => {
      let A = from.M; const c = [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t];
      if (op.t === "rot") { const th = (op.cw ? 1 : -1) * op.deg * Math.PI / 180 * t; A = m4Mul([Math.cos(th), -Math.sin(th), Math.sin(th), Math.cos(th)], from.M); }
      if (op.t === "flip") { const sc = 1 - 2 * t; A = m4Mul((op.dir === "위") ? [1, 0, 0, sc] : [sc, 0, 0, 1], from.M); }
      put(k, A, c);
    }, () => { P[k].s = to; show(k); busy = false; done && done(to); });
  };
  const cardBtns = (onPick) => h("div", { style: "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.3em" }, ...M4_CARDS.map((_, i) => h("button", { class: "opt", style: "padding:.2em .45em;font-size:var(--fs-s)", onclick: e => onPick(i, e.currentTarget) }, m4CardText(i))));
  const side = [], out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const kindOf = i => M4_CARDS[i].t;
  if (opt.mode === "cards") {
    const tried = new Set(), k = Object.keys(P)[0];
    const cnt = h("div", { class: "pill" }, "써 본 카드 0 / 10");
    side.push(h("p", {}, "이동 카드를 하나씩 눌러 토끼 인형을 움직여 봐요. 10장을 모두 써 봐요."), cardBtns((i, btn) => {
      if (busy) return;
      const go = () => move(k, i, () => { tried.add(i); btn.classList.add("on"); cnt.textContent = `써 본 카드 ${tried.size} / 10`; out.textContent = m4CardText(i).slice(2) + (M4_CARDS[i].t === "slide" ? ": 위치가 바뀌었어요." : ": 방향이 바뀌었어요."); if (tried.size === 10) { busy = true; m4Finish(body, api, opt, "10장 모두", "이동 카드 10장을 모두 써 봤어요!"); } });
      if (!valid(apply(P[k].s, i))) { P[k].s = Object.assign({}, P[k].s0); show(k); out.textContent = "무대 밖이나 땅속으로 가서 처음 자리에서 다시 움직여요."; setTimeout(go, 400); } else go();
    }), cnt, out, m4Tools(h("button", { onclick: () => { if (busy) return; P[k].s = Object.assign({}, P[k].s0); show(k); } }, "처음 자리로")));
    api.provide({ words: ["밀기", "뒤집기", "돌리기"], answers: [] });
  }
  if (opt.mode === "script") {
    const rows = opt.rows; let ri = 0;
    const tb = h("ol", { style: "margin:.2em 0;padding-left:1.3em" });
    const showRows = () => { tb.innerHTML = ""; rows.forEach((r, i) => tb.append(h("li", { style: i === ri ? "font-weight:bold" : (i < ri ? "color:var(--ok)" : "color:var(--muted)") }, `${M4_PUP[r.who]}: ${r.say}` + (i < ri ? ` — ${r.picked} ✓` : "")))); out.textContent = ri < rows.length ? `${m4Jo(M4_PUP[rows[ri].who], "이/가")} 움직일 이동 카드를 골라요.` : "대본을 끝까지 했어요!"; };
    const prep = () => { const r = rows[ri]; if (r && r.from) { P[r.who].s = Object.assign({}, r.from); show(r.who); } };
    side.push(h("p", {}, "대본의 행동에 맞는 이동 카드를 골라 인형을 움직여요."), tb, out, cardBtns(i => {
      if (busy || ri >= rows.length) return; const r = rows[ri], from = Object.assign({}, P[r.who].s), want = apply(from, r.card), got = apply(from, i); api.tryOnce();
      move(r.who, i, () => {
        if (same(got, want)) { r.picked = m4CardText(i); ri++; showRows(); if (ri >= rows.length) { busy = true; m4Finish(body, api, opt, rows.map(x => x.picked).join(" / "), "대본에 맞게 인형을 움직였어요!"); } else { api.hint(i === r.card ? "맞아요!" : `맞아요! ${m4CardText(r.card)} 카드와 결과가 같아요.`); setTimeout(prep, 300); } }
        else { api.fail(`${m4CardText(i).slice(2)}: 대본의 행동과 달라요. 인형이 어떻게 움직여야 할지 다시 생각해요.`, m4CardText(i)); setTimeout(() => { P[r.who].s = from; show(r.who); }, 900); }
      });
    }));
    prep(); showRows();
    api.provide({ words: rows.map(r => m4CardText(r.card)), answers: rows.map(r => `${M4_PUP[r.who]}: ${m4CardText(r.card)}`) });
  }
  if (opt.mode === "build") {
    let who = Object.keys(P)[0], card = null; const script = [];
    const wb = Object.keys(P).map(k => { const b = h("button", { class: k === who ? "on" : "" }, M4_PUP[k]); b.addEventListener("click", () => { who = k; wb.forEach(x => x.classList.toggle("on", x === b)); }); return b; });
    let cbs; const cardsEl = cardBtns((i, btn) => { card = i; [...cardsEl.children].forEach(x => x.classList.toggle("on", x === btn)); });
    const say = h("input", { type: "text", placeholder: "행동과 대사 (예: 구덩이로 떨어지며 으악!)", style: "width:100%;font-size:var(--fs-s)" });
    const tb = h("ol", { style: "margin:.2em 0;padding-left:1.3em;font-size:var(--fs-s)" });
    const showT = () => { tb.innerHTML = ""; script.forEach(r => tb.append(h("li", {}, `${M4_PUP[r.who]} | ${m4CardText(r.card)} | ${r.say}`))); out.textContent = `대본 ${script.length}줄 (5줄 이상, 밀기·뒤집기·돌리기를 모두 써요)`; };
    const add = () => {
      if (busy) return; if (card == null) return api.hint("이동 카드를 골라요."); if (say.value.trim().length < 2) return api.hint("행동과 대사를 써요.");
      const to = apply(P[who].s, card); if (!valid(to)) return api.hint("그 카드로 움직이면 무대 밖이나 땅속으로 가요. 다른 카드를 골라요.");
      script.push({ who, card, say: say.value.trim(), from: Object.assign({}, P[who].s) }); move(who, card); say.value = ""; showT();
    };
    const replay = () => { if (busy) return; Object.keys(P).forEach(k => { P[k].s = Object.assign({}, P[k].s0); show(k); }); let i = 0; const step = () => { if (i >= script.length) return; const r = script[i++]; out.textContent = `${M4_PUP[r.who]}: ${r.say}`; move(r.who, r.card, () => setTimeout(step, 250)); }; step(); };
    side.push(h("p", {}, "인형과 이동 카드를 고르고 행동과 대사를 써서 대본을 만들어요."), h("b", {}, "종이 인형"), m4Tools(...wb), h("b", {}, "이동 카드"), cardsEl, say,
      m4Tools(h("button", { onclick: add }, "대본에 넣기"), h("button", { onclick: () => { if (busy || !script.length) return; const r = script.pop(); P[r.who].s = r.from; show(r.who); showT(); } }, "한 줄 지우기"), h("button", { onclick: replay }, "인형극 해 보기")), tb, out,
      h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
        api.tryOnce(); const ks = new Set(script.map(r => kindOf(r.card)));
        if (script.length < 5) return api.fail("대본을 5줄 이상 만들어요.", `${script.length}줄`);
        if (!(ks.has("slide") && ks.has("flip") && ks.has("rot"))) return api.fail("밀기, 뒤집기, 돌리기 카드를 모두 한 번 이상 써요.", [...ks].join(","));
        api.done(script.map(r => `${M4_PUP[r.who]}-${M4_NUM[r.card]}-${r.say}`).join(" | "), "멋진 대본을 만들었어요! ‘인형극 해 보기’로 모둠 친구들에게 발표해 봐요.");
      } }, "대본 다 만들었어요")));
    showT(); api.provide({ words: ["밀기", "뒤집기", "돌리기"], answers: [] });
  }
  if (opt.mode === "guess") {
    const pool = opt.pool || M4_CARDS.map((_, i) => i), n = opt.rounds || 5; let round = 0, score = 0, cur = null;
    const sc = h("div", { class: "pill" }, "점수 0점");
    const newRound = () => {
      Object.keys(P).forEach(k => { P[k].s = Object.assign({}, P[k].s0); show(k); });
      let k, i, tries = 0; const ks = Object.keys(P);
      do { k = ks[Math.floor(Math.random() * ks.length)]; i = pool[Math.floor(Math.random() * pool.length)]; tries++; } while (!valid(apply(P[k].s, i)) && tries < 50);
      cur = { k, i, from: Object.assign({}, P[k].s) }; out.textContent = `${round + 1}번째: ${m4Jo(M4_PUP[k], "이/가")} 움직여요. 어떤 카드일까요?`;
      setTimeout(() => move(k, i), 350);
    };
    const replay = () => { if (busy || !cur) return; P[cur.k].s = Object.assign({}, cur.from); show(cur.k); setTimeout(() => move(cur.k, cur.i), 250); };
    side.push(h("p", {}, "인형이 이동 카드 한 장대로 움직여요. 어떤 카드인지 맞혀요. 맞히면 10점!"), sc, out, m4Tools(h("button", { onclick: replay }, "한 번 더 보기")), cardBtns(i => {
      if (busy || !cur) return; api.tryOnce();
      if (same(apply(cur.from, i), apply(cur.from, cur.i))) {
        score += 10; round++; sc.textContent = `점수 ${score}점`;
        api.hint(i === cur.i ? "맞혔어요! 10점!" : `맞혔어요! ${m4CardText(cur.i)} 카드와 결과가 같아서 10점!`);
        if (round >= n) { cur = null; return m4Finish(body, api, opt, `${score}점`, `${n}번 모두 맞혀서 ${score}점이에요!`); }
        setTimeout(newRound, 900);
      } else api.fail(`‘${m4CardText(i).slice(2)}’ 카드로 움직이면 결과가 달라요. ‘한 번 더 보기’로 다시 봐요.`, m4CardText(i));
    }));
    api.provide({ words: ["밀기는 위치", "뒤집기·돌리기는 방향"], answers: [] });
    setTimeout(newRound, 50);
  }
  body.append(stageWrap(svg, m4Side(...side)));
}

/* =========================================================
   9. 밀기 퍼즐 — 칸 조각을 밀어 빼내거나 제자리에 넣는다
   opt: {w,h,U, blocks:[{name,color,cells,x,y,fixed}], exit:{name,row}, targets:{이름:[x,y]}, ask, ok}
   ========================================================= */
function m4Slide(body, api, opt) {
  const U = opt.U || 56, W = opt.w, H = opt.h, extra = opt.exit ? 2.2 : 0, svg = makeSvg((W + extra) * U, H * U);
  const bgG = svgEl("g"), bG = svgEl("g"); svg.append(bgG, bG); svg.style.touchAction = "none";
  bgG.append(svgEl("rect", { x: 0, y: 0, width: W * U, height: H * U, fill: "#F7F4EC" }));
  m4Grid(bgG, 0, 0, W, H, U, "#DDD3C0");
  const bl = opt.blocks.map(b => Object.assign({ x0: b.x, y0: b.y }, b));
  if (opt.exit) {   // 테두리(출구 칸만 열림)
    const e = opt.exit.row, s = 7, c = "#6E5A43";
    bgG.append(svgEl("path", { d: `M${W * U} ${e * U} V0 H0 V${H * U} H${W * U} V${(e + 1) * U}`, fill: "none", stroke: c, "stroke-width": s }), txt(W * U + extra * U / 2, e * U + U / 2, "출구 ▶", 18, { fill: c }));
  }
  if (opt.targets) {   // 완성할 모양(점선)
    const cellsT = new Set(); bl.forEach(b => { const t = opt.targets[b.name] || (b.fixed ? [b.x, b.y] : null); if (t) b.cells.forEach(c => cellsT.add(`${t[0] + c[0]},${t[1] + c[1]}`)); });
    cellsT.forEach(k => { const [x, y] = k.split(",").map(Number); bgG.append(svgEl("rect", { x: x * U, y: y * U, width: U, height: U, fill: "rgba(232,182,48,.14)" })); });
    const segs = []; cellsT.forEach(k => { const [x, y] = k.split(",").map(Number); [[0, -1, x, y, x + 1, y], [0, 1, x, y + 1, x + 1, y + 1], [-1, 0, x, y, x, y + 1], [1, 0, x + 1, y, x + 1, y + 1]].forEach(([dx, dy, a, b, c2, d]) => { if (!cellsT.has(`${x + dx},${y + dy}`)) segs.push(`M${a * U} ${b * U} L${c2 * U} ${d * U}`); }); });
    bgG.append(svgEl("path", { d: segs.join(" "), fill: "none", stroke: M4_GOLD, "stroke-width": 4, "stroke-dasharray": "8 6" }));
  }
  let sel = bl.find(b => !b.fixed), busy = false; const moves = [];
  const occ = (skip) => { const s = new Set(); bl.forEach(b => { if (b === skip) return; b.cells.forEach(c => s.add(`${b.x + c[0]},${b.y + c[1]}`)); }); return s; };
  const canBe = (b, x, y) => {
    const o = occ(b);
    return b.cells.every(c => { const cx = x + c[0], cy = y + c[1]; if (o.has(`${cx},${cy}`)) return false; if (cy < 0 || cy >= H || cx < 0) return false; if (cx >= W) return opt.exit && b.name === opt.exit.name && cy === opt.exit.row && cx < W + 3; return true; });
  };
  const drawB = () => {
    bG.innerHTML = "";
    bl.forEach(b => {
      const g = svgEl("g", { style: b.fixed ? "" : "cursor:pointer" }), set = new Set(b.cells.map(c => `${c[0]},${c[1]}`)), segs = [];
      b.cells.forEach(c => { g.append(svgEl("rect", { x: (b.x + c[0]) * U, y: (b.y + c[1]) * U, width: U, height: U, fill: b.color })); [[0, -1, 0, 0, 1, 0], [0, 1, 0, 1, 1, 1], [-1, 0, 0, 0, 0, 1], [1, 0, 1, 0, 1, 1]].forEach(([dx, dy, a, bb, c2, d]) => { if (!set.has(`${c[0] + dx},${c[1] + dy}`)) segs.push(`M${(b.x + c[0] + a) * U} ${(b.y + c[1] + bb) * U} L${(b.x + c[0] + c2) * U} ${(b.y + c[1] + d) * U}`); }); });
      g.append(svgEl("path", { d: segs.join(" "), stroke: b === sel ? TENT : "rgba(0,0,0,.45)", "stroke-width": b === sel ? 6 : 3, fill: "none", "stroke-linecap": "round" }));
      const c0 = b.cells[0]; g.append(txt((b.x + c0[0] + .5) * U, (b.y + c0[1] + .5) * U, b.label != null ? b.label : b.name, Math.max(14, U * .3), { fill: b.fixed ? "#fff" : INK }));
      g.addEventListener("pointerdown", () => { if (!b.fixed) { sel = b; drawB(); } });
      bG.append(g);
    });
  };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" }, "조각을 눌러 고르고 화살표 단추를 누르거나 끌어요.");
  const logL = h("ol", { style: "margin:.2em 0;padding-left:1.3em" });
  const showLog = () => { logL.innerHTML = ""; moves.forEach(m => logL.append(h("li", {}, `${m.name} 조각을 ${m.dir}쪽으로 ${m.n}칸`))); };
  let solved = false;
  const isSolved = () => opt.exit ? bl.find(b => b.name === opt.exit.name).cells.every(c => bl.find(b => b.name === opt.exit.name).x + c[0] >= W) : Object.entries(opt.targets).every(([n, t]) => { const b = bl.find(x => x.name === n); return b.x === t[0] && b.y === t[1]; });
  const step = (b, dir) => {
    if (solved || !b || b.fixed) return false; const v = M4_DIRV[dir];
    if (!canBe(b, b.x + v[0], b.y + v[1])) { out.textContent = "그쪽은 막혀 있어요."; return false; }
    b.x += v[0]; b.y += v[1];
    const l = moves[moves.length - 1]; if (l && l.name === b.name && l.dir === dir) l.n++; else moves.push({ name: b.name, dir, n: 1 });
    showLog(); drawB();
    if (isSolved()) { solved = true; m4Finish(body, api, opt, moves.map(m => `${m.name} ${m.dir} ${m.n}`).join(", "), opt.exit ? "초록색 조각을 빼냈어요!" : "모양을 완성했어요!"); }
    return true;
  };
  let drag = null;
  dragOn(svg, p => { const x = Math.floor(p.x / U), y = Math.floor(p.y / U), b = bl.find(b => !b.fixed && b.cells.some(c => b.x + c[0] === x && b.y + c[1] === y)); if (!b) return false; sel = b; drawB(); drag = { b, p0: p, dx: 0, dy: 0 }; }, p => {
    if (!drag) return; const tx = Math.round((p.x - drag.p0.x) / U), ty = Math.round((p.y - drag.p0.y) / U);
    while (drag.dx < tx && step(drag.b, "오른")) drag.dx++; while (drag.dx > tx && step(drag.b, "왼")) drag.dx--;
    while (drag.dy < ty && step(drag.b, "아래")) drag.dy++; while (drag.dy > ty && step(drag.b, "위")) drag.dy--;
  }, () => { drag = null; });
  const A = (l, d) => h("button", { onclick: () => step(sel, d) }, l);
  api.provide({ words: ["위쪽", "아래쪽", "왼쪽", "오른쪽", "칸"], answers: [] });
  body.append(stageWrap(svg, m4Side(h("p", {}, opt.tip || "조각을 눌러 고른 다음 화살표로 한 칸씩 밀어요. 끌어서 밀어도 돼요."),
    h("div", { style: "display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.3em;max-width:16em" }, h("span"), A("▲ 위", "위"), h("span"), A("◀ 왼", "왼"), h("span"), A("오른 ▶", "오른"), h("span"), A("▼ 아래", "아래"), h("span")),
    m4Tools(h("button", { onclick: () => { if (solved) return; bl.forEach(b => { b.x = b.x0; b.y = b.y0; }); moves.length = 0; showLog(); drawB(); } }, "처음으로")), h("b", {}, "민 기록"), logL, out)));
  drawB();
}

/* =========================================================
   10. 그림 퍼즐(고흐의 방) — 조각을 알맞게 돌려 빈 곳을 채운다
   ========================================================= */
function m4RoomArt(g) {
  g.append(svgEl("rect", { x: 0, y: 0, width: 300, height: 200, fill: "#5B7DB8" }), svgEl("rect", { x: 0, y: 0, width: 300, height: 9, fill: "#3E5A8E" }), svgEl("polygon", { points: "0,128 300,122 300,200 0,200", fill: "#B59A5B" }),
    // 왼쪽 위 그림 액자
    svgEl("rect", { x: 26, y: 30, width: 44, height: 34, fill: "#E9D68A", stroke: "#8A6A2E", "stroke-width": 4 }),
    // 가운데 창문과 수건걸이
    svgEl("rect", { x: 114, y: 24, width: 50, height: 62, fill: "#9FD3A6", stroke: "#3E7F4A", "stroke-width": 5 }), svgEl("line", { x1: 139, y1: 24, x2: 139, y2: 86, stroke: "#3E7F4A", "stroke-width": 4 }), svgEl("line", { x1: 114, y1: 52, x2: 164, y2: 52, stroke: "#3E7F4A", "stroke-width": 4 }),
    svgEl("circle", { cx: 184, cy: 40, r: 5, fill: "#3E2A1A" }), svgEl("rect", { x: 178, y: 44, width: 14, height: 34, rx: 3, fill: "#F2F2EE" }),
    // 오른쪽 위 액자 두 개
    svgEl("rect", { x: 222, y: 22, width: 30, height: 38, fill: "#F0B85A", stroke: "#8A6A2E", "stroke-width": 4 }), svgEl("rect", { x: 260, y: 30, width: 26, height: 30, fill: "#C9E3F2", stroke: "#8A6A2E", "stroke-width": 4 }),
    // 왼쪽 아래 의자(등받이는 왼쪽)
    svgEl("rect", { x: 30, y: 104, width: 8, height: 68, fill: "#C9952B" }), svgEl("rect", { x: 30, y: 136, width: 50, height: 10, fill: "#E8C547", stroke: "#9C7A1E", "stroke-width": 3 }), svgEl("rect", { x: 72, y: 146, width: 7, height: 28, fill: "#C9952B" }), svgEl("rect", { x: 30, y: 112, width: 8, height: 6, fill: "#9C7A1E" }),
    // 가운데 아래 탁자
    svgEl("rect", { x: 118, y: 132, width: 52, height: 8, fill: "#C9952B" }), svgEl("rect", { x: 122, y: 140, width: 6, height: 32, fill: "#9C7A1E" }), svgEl("rect", { x: 160, y: 140, width: 6, height: 32, fill: "#9C7A1E" }), svgEl("circle", { cx: 134, cy: 124, r: 7, fill: "#5BB6F0" }),
    // 오른쪽 아래 침대(머리판은 오른쪽)
    svgEl("rect", { x: 270, y: 104, width: 18, height: 76, fill: "#C9692B", stroke: "#7A3A12", "stroke-width": 3 }), svgEl("rect", { x: 206, y: 140, width: 66, height: 34, fill: "#E07B39", stroke: "#7A3A12", "stroke-width": 3 }), svgEl("rect", { x: 246, y: 128, width: 24, height: 14, rx: 5, fill: "#F5F1E6" }), svgEl("rect", { x: 206, y: 174, width: 6, height: 14, fill: "#7A3A12" }));
}
function m4Room(body, api, opt) {
  const k = 1.5, RX = 40, RY = 10, svg = makeSvg(300 * k + 80, 200 * k + 210), art = svgEl("g", { transform: `translate(${RX},${RY}) scale(${k})` }); m4RoomArt(art); svg.append(art);
  const holes = opt.pieces, hG = svgEl("g"), pG = svgEl("g"); svg.append(hG, pG);
  holes.forEach(p => hG.append(svgEl("rect", { x: RX + p.tx * 100 * k, y: RY + p.ty * 100 * k, width: 100 * k, height: 100 * k, fill: "#FBFCFB", stroke: M4_GRAY, "stroke-width": 3, "stroke-dasharray": "8 6" })));
  const pieces = holes.map((p, i) => {
    const id = "m4clip" + (++m4Uid), cp = svgEl("clipPath", { id }); cp.append(svgEl("rect", { x: 0, y: 0, width: 100, height: 100 })); svg.append(cp);
    const g = svgEl("g", { style: "cursor:pointer" }), clip = svgEl("g", { "clip-path": `url(#${id})` }), a = svgEl("g", { transform: `translate(${-p.tx * 100},${-p.ty * 100})` }); m4RoomArt(a); clip.append(a);
    const frame = svgEl("rect", { x: 0, y: 0, width: 100, height: 100, fill: "none", stroke: INK, "stroke-width": 2 }); g.append(clip, frame); pG.append(g);
    const lab = txt(0, 0, M4_KO[i], 22); pG.append(lab);
    const P = { p, g, lab, ang: p.ang, cx: 115 + i * 150, cy: 200 * k + 110, frame, done: false };
    g.addEventListener("click", () => { if (!P.done) { sel = P; paint(); } });
    return P;
  });
  let sel = pieces[0], busy = false;
  const put = P => { P.g.setAttribute("transform", `translate(${m4F(P.cx)},${m4F(P.cy)}) rotate(${m4F(P.ang)}) scale(${k * .82}) translate(-50,-50)`); P.lab.setAttribute("x", P.cx - 70); P.lab.setAttribute("y", P.cy - 62); };
  const paint = () => pieces.forEach(P => { put(P); P.frame.setAttribute("stroke", P === sel ? TENT : INK); P.frame.setAttribute("stroke-width", P === sel ? 6 : 2); P.lab.setAttribute("opacity", P.done ? 0 : 1); });
  const rec = [];
  const meth = [m4R(true, 180), m4R(false, 90), m4R(true, 90)];
  const go = op => {
    if (busy || !sel || sel.done) return; const P = sel, a0 = P.ang, a1 = a0 + (op.cw ? 1 : -1) * op.deg; busy = true; api.tryOnce();
    m4Anim(700, t => { P.ang = a0 + (a1 - a0) * t; put(P); }, () => {
      if (((a1 % 360) + 360) % 360 === 0) {
        const tx = RX + P.p.tx * 100 * k + 50 * k, ty = RY + P.p.ty * 100 * k + 50 * k, x0 = P.cx, y0 = P.cy; P.ang = 0;
        m4Anim(500, t => { P.cx = x0 + (tx - x0) * t; P.cy = y0 + (ty - y0) * t; P.g.setAttribute("transform", `translate(${m4F(P.cx)},${m4F(P.cy)}) scale(${m4F(k * (.82 + .18 * t))}) translate(-50,-50)`); }, () => {
          P.done = true; rec.push(`${M4_KO[pieces.indexOf(P)]}: ${m4OpText(op)}`); P.lab.setAttribute("opacity", 0); P.frame.setAttribute("stroke", "none"); busy = false;
          sel = pieces.find(x => !x.done); paint(); P.g.setAttribute("transform", `translate(${m4F(P.cx)},${m4F(P.cy)}) scale(${k}) translate(-50,-50)`);
          if (!sel) m4Finish(body, api, opt, rec.join(" / "), "그림을 완성했어요! 고흐의 방이 다시 보여요.");
          else api.hint("맞아요! 빈 곳에 꼭 맞게 들어갔어요.");
        });
      } else { api.fail(`${m4OpText(op).replace("돌리기", "돌리면")} 그림이 바르게 서지 않아요. 조각의 위쪽 부분이 어디로 가야 하는지 생각해요.`, m4OpText(op)); setTimeout(() => { P.ang = a0; put(P); busy = false; }, 900); }
    });
  };
  api.provide({ words: meth.map(m4OpText), answers: [] });
  body.append(stageWrap(svg, m4Side(h("p", {}, "아래 조각을 눌러 고른 다음, 알맞은 이동 방법을 눌러요. 바르게 서면 빈 곳으로 들어가요."), ...meth.map(op => h("button", { class: "opt", onclick: () => go(op) }, m4OpText(op))))));
  paint();
}
/* 판 그림 높이 제한: 좁은 화면(판과 단추가 위아래로 놓임)에서도 판이 520px보다 높아지지 않게(아래 '다음 계단' 막대에 가리지 않게) */
(function m4Cap() {
  const cap = s => {
    if (s.dataset.m4cap) return; const vb = s.viewBox && s.viewBox.baseVal; if (!vb || !vb.width || !vb.height) return;
    s.dataset.m4cap = "1"; s.style.maxWidth = Math.round(520 * vb.width / vb.height) + "px"; s.style.marginLeft = "auto"; s.style.marginRight = "auto";
  };
  new MutationObserver(() => document.querySelectorAll(".stage > svg").forEach(cap)).observe(document.documentElement, { childList: true, subtree: true });
})();
//@@LESSONS
const UNIT_STORY = { title: "그림자 연극 「두두의 소원」", lines: [
  "오늘은 학교에서 그림자 연극 「두두의 소원」을 하는 날이에요. 두더지 두두가 세상에서 가장 예쁘고 향기로운 것을 찾으러 길을 떠나요.",
  "반딧불이와 함께 나무 쪽으로 밀고, 나비를 따라 뒤집고, 바늘을 돌려 꽃밭을 찾아요. 칠교놀이, 도장, 퍼즐, 길 조각, 인형극으로 밀기·뒤집기·돌리기를 익혀요.",
  "교과서 「수학 4-1」 4. 평면도형의 이동의 차시 순서 그대로 만들었어요. 지도서에서 두 차시로 묶인 3~4차시와 5~6차시는 ⑴ ⑵로 나누어 차시 번호를 지도서와 맞췄어요."],
  one: "평면도형의 이동 · 두두의 그림자 연극 소품을 밀고, 뒤집고, 돌려요." };
const UNIT_KEYWORDS = ["밀기", "뒤집기", "돌리기", "위치", "방향", "모양", "위쪽", "아래쪽", "왼쪽", "오른쪽", "칸", "cm", "시계 방향", "시계 반대 방향", "90°", "180°", "270°", "360°"];

/* ---- 이 단원에서 쓰는 도형 ---- */
const M4_TAN = [   // 칠교판(한 변 4칸)을 (1,1)에 놓은 조각들
  { pts: [[0, 0], [4, 0], [2, 2]], fill: "#F7D6C2" }, { pts: [[0, 0], [2, 2], [0, 4]], fill: "#CFE6F7" }, { pts: [[4, 2], [4, 4], [2, 4]], fill: "#E2D3F3", hole: "tri" },
  { pts: [[2, 2], [3, 3], [2, 4], [1, 3]], fill: "#FFF1C7" }, { pts: [[0, 4], [1, 3], [2, 4]], fill: "#D7EFD9" }, { pts: [[2, 2], [3, 1], [3, 3]], fill: "#FADADD" },
  { pts: [[3, 1], [4, 0], [4, 2], [3, 3]], fill: "#D4EEF0", hole: "para" }];
function m4Tangram(skip) {
  return (g, U) => {
    M4_TAN.forEach(t => {
      const pts = t.pts.map(p => `${(p[0] + 1) * U},${(p[1] + 1) * U}`).join(" ");
      if (t.hole === skip) g.append(svgEl("polygon", { points: pts, fill: "#fff", stroke: M4_GRAY, "stroke-width": 3, "stroke-dasharray": "7 6" }));
      else g.append(svgEl("polygon", { points: pts, fill: t.fill, stroke: "#6B7A86", "stroke-width": 3, "stroke-linejoin": "round" }));
    });
    g.append(txt(3 * U, .5 * U, "칠교판", 18, { fill: M4_GRAY }));
  };
}
const M4_TRI_S = { pts: [[1, 0], [0, 2], [3, 2]], names: ["ㄱ", "ㄴ", "ㄷ"] };            // 밀기 삼각형
const M4_TRI_F = { pts: [[1, 0], [0, 3], [3, 3]], names: ["ㄱ", "ㄴ", "ㄷ"] };            // 뒤집기 삼각형(ㄱ 위, ㄴ 왼쪽 아래, ㄷ 오른쪽 아래)
const M4_QUAD = { pts: [[0, 0], [0, 3], [3, 2], [2, 0]], names: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], fill: "#FDE3D3", stroke: TENT };   // ㄱ 왼쪽 위, ㄹ 오른쪽 위(대칭축이 없는 사각형: 뒤집은 모양과 돌린 모양이 겹치지 않게)
const M4_TRI_R = { pts: [[0, 0], [0, 3], [2, 3]], names: ["ㄱ", "ㄴ", "ㄷ"], fill: "#DDEDE5", stroke: PINE };   // 돌리기 삼각형(ㄱ이 위쪽 부분)
const M4_GAMMA = { pts: [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]], fill: "#EADFF6", stroke: "#7A5BB0" };
const M4_LSH = { pts: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]], fill: "#FFF1C7", stroke: "#B08A1E" };
const M4_PENT = { pts: [[0, 0], [2, 0], [3, 2], [1, 2], [0, 1]], fill: "#DCEAFB", stroke: BLUE };
const M4_FLAG = { pts: [[0, 0], [2, 0], [3, 1], [2, 2], [0, 2]], fill: "#FDE3D3", stroke: TENT };
const M4_LBIG = { pts: [[0, 0], [1, 0], [1, 2], [2, 2], [2, 3], [0, 3]], fill: "#DDEDE5", stroke: PINE };
const M4_QUAD2 = { pts: [[0, 0], [3, 1], [2, 3], [0, 3]], fill: "#EADFF6", stroke: "#7A5BB0" };
/* 7차시 길: 계단 모양으로 꺾인 길 6개. need = 이어지는 모양, rot = 시계 방향으로 돌려야 하는 횟수(지도서 정답 ①90 ②180 ③270 ④180 ⑤270 ⑥270) */
const M4_PATH7 = [[0, 0, 2], [0, 1, 0], [1, 1, 2], [1, 2, 0], [2, 2, 2], [2, 3, 0]].map(([x, y, need], i) => ({ x, y, need, turn: [1, 2, 3, 2, 3, 3][i] }));
const M4_ROAD7 = M4_PATH7.map(t => ({ x: t.x, y: t.y, kind: "corner", need: t.need, r: (t.need - t.turn + 4) % 4 }));
const m4BtnIdx = turn => [turn - 1, 3 + (4 - turn) - 1];   // 시계 방향 turn번 = ㉠㉡㉢ 중 하나, 시계 반대 (4-turn)번 = ㉣㉤㉥ 중 하나
const M4_ROAD_CH = [[0, 0, "straight", 1, 0], [1, 0, "corner", 2, 1], [1, 1, "straight", 0, 1], [1, 2, "corner", 0, 2], [2, 2, "straight", 1, 0], [3, 2, "corner", 3, 0], [3, 1, "straight", 0, 1], [3, 0, "corner", 1, 2]].map(([x, y, kind, need, r]) => ({ x, y, kind, need, r }));

const LESSONS = [
{
  id: "m1", no: 1, title: "단원 도입 ― 칠교놀이와 그림자 연극 「두두의 소원」", soop: "개념 찾기(S)",
  question: "평면도형을 이동하면 어떤 변화가 있을까요?",
  summary: "평면도형은 밀거나, 뒤집거나, 돌려서 움직일 수 있어요. 이 단원에서는 밀기, 뒤집기, 돌리기를 하면 도형의 위치와 방향이 어떻게 바뀌는지 배워요.",
  steps: [
    { inst: "칠교놀이는 7개의 모양 조각을 밀고, 뒤집고, 돌려서 맞추는 놀이예요. 보라색 삼각형 조각을 칠교판의 빈자리(점선)에 넣어 보세요.", hints: ["빈자리의 직각은 오른쪽 아래에 있어요. 보라색 조각의 직각은 어디에 있나요?", "뒤집기나 돌리기로 직각의 자리를 맞춘 다음 끌어서 밀어 넣어요."],
      render: (b, a) => m4Board(b, a, { w: 10, h: 7, U: 48, deco: m4Tangram("tri"), piece: { pts: [[0, 0], [2, 0], [2, 2]], fill: "#C9B3E6", stroke: "#7A5BB0" }, start: [7, 1],
        tasks: [{ t: "fit", pts: [[5, 3], [5, 5], [3, 5]], label: "보라색 조각을 빈자리에 넣기" }], doneMsg: "딱 맞게 넣었어요!",
        ok: "조각을 뒤집거나 돌린 다음 밀어서 맞췄어요! 칠교놀이에는 밀기, 뒤집기, 돌리기가 모두 들어 있어요." }) },
    { name: "그림자 연극 보기", inst: "그림자 연극 「두두의 소원」이에요. 두더지 두두와 바늘을 어떻게 움직였는지 골라 보세요.", hints: ["자리만 옮겨 갔으면 밀기예요.", "왼쪽과 오른쪽이 바뀌었으면 뒤집기, 빙그르르 돌아갔으면 돌리기예요."],
      render: (b, a) => quiz(b, a, [
        { q: "두두가 반딧불이를 따라 나무 쪽으로 갔어요.", fig: () => m4Fig({ w: 12, h: 3, U: 32, maxW: "24em", items: [{ pc: "mole", x: 1, y: .6, op: .3 }, { pc: "mole", x: 6, y: .6 }], deco: (g, U) => { g.append(svgEl("rect", { x: 10.2 * U, y: 1 * U, width: .5 * U, height: 2 * U, fill: "#8A6248" }), svgEl("circle", { cx: 10.45 * U, cy: .9 * U, r: .85 * U, fill: "#7FB069" }), svgEl("circle", { cx: 8.8 * U, cy: .5 * U, r: .15 * U, fill: M4_GOLD })); m4Arrow(g, 4.2 * U, .4 * U, 6.6 * U, .4 * U); } }), o: ["밀기", "뒤집기", "돌리기"], a: 0 },
        { q: "두두가 나비를 따라 뒤돌아 갔어요.", fig: () => m4Fig({ w: 12, h: 3, U: 32, maxW: "24em", items: [{ pc: "mole", x: 1, y: .6 }, { pc: "mole", M: M4_FLR, x: 7, y: .6 }], deco: (g, U) => m4Arrow(g, 4.6 * U, 1.6 * U, 6.6 * U, 1.6 * U) }), o: ["밀기", "뒤집기", "돌리기"], a: 1, why: { "0": "자리만 옮긴 게 아니라 두두가 바라보는 쪽(왼쪽과 오른쪽)이 바뀌었어요." } },
        { q: "바늘이 꽃밭을 가리키도록 움직였어요.", fig: () => m4Fig({ w: 9, h: 3, U: 32, maxW: "18em", items: [{ pc: "needle", x: 1, y: .5 }, { pc: "needle", M: M4_CW, x: 5.5, y: .5 }], deco: (g, U) => m4Arrow(g, 3.4 * U, 1.5 * U, 5.2 * U, 1.5 * U) }), o: ["밀기", "뒤집기", "돌리기"], a: 2 }],
        { ok: "두두는 밀기로 나무 쪽으로 가고, 뒤집기로 나비를 따라 뒤돌아 가고, 바늘은 돌리기로 꽃밭을 가리켰어요." }) },
    { name: "말해 보기", inst: "평면도형의 이동과 비슷한 경험이에요. 밀기, 뒤집기, 돌리기 중 어느 것과 닮았는지 골라 보세요.", hints: ["물건이 바닥을 따라 자리만 옮겨 가면 밀기예요.", "앞면과 뒷면이 바뀌면 뒤집기, 한 점을 중심으로 빙 돌면 돌리기예요."],
      render: (b, a) => quiz(b, a, [
        { q: "슈퍼마켓에서 손수레를 밀면서 장을 봤어요.", o: ["밀기", "뒤집기", "돌리기"], a: 0 },
        { q: "체육 시간에 색판 뒤집기 놀이를 했어요.", o: ["밀기", "뒤집기", "돌리기"], a: 1 },
        { q: "어머니께서 이불을 뒤집어서 먼지를 터셨어요.", o: ["밀기", "뒤집기", "돌리기"], a: 1 },
        { q: "모형 시계의 시곗바늘을 돌려 보았어요.", o: ["밀기", "뒤집기", "돌리기"], a: 2 },
        { q: "퍼즐 조각을 돌려서 퍼즐을 맞추었어요.", o: ["밀기", "뒤집기", "돌리기"], a: 2 }], { ok: "우리 생활에도 밀기, 뒤집기, 돌리기가 많이 있어요." }) },
    { name: "떠올리기", inst: "곰곰! 배운 내용을 떠올려요. 2단원 각도에서 직각은 90°라고 배웠어요. 각도의 합과 차를 구해 보세요. 돌리기를 배울 때 이 각도들이 나와요.", hints: ["직각 하나는 90°예요.", "90°를 두 번 더하면 180°예요."],
      render: (b, a) => { b.append(m4Fig({ w: 8, h: 3, U: 34, maxW: "16em", deco: (g, U) => { [[1, 0], [4.5, 1]].forEach(([x, k]) => { g.append(svgEl("path", { d: `M${(x + .2) * U} ${2.6 * U} H${(x + 2.6) * U} M${(x + .2) * U} ${2.6 * U} V${.3 * U}`, stroke: INK, "stroke-width": 4, fill: "none" }), svgEl("path", { d: `M${(x + .2) * U} ${2.1 * U} h${.5 * U} v${.5 * U}`, stroke: TENT, "stroke-width": 3, fill: "none" })); }); g.append(txt(2.6 * U, 1.5 * U, "직각", 18), txt(6.2 * U, 1.5 * U, "90°", 18)); } }));
        numbers(b, a, [{ q: "직각은 몇 도인가요?", a: 90, unit: "°" }, { q: "90° + 90° =", a: 180, unit: "°" }, { q: "180° + 90° =", a: 270, unit: "°" }, { q: "270° + 90° =", a: 360, unit: "°", why: { "260": "십의 자리에서 7+9=16이므로 백의 자리로 1을 받아올려요." } }, { q: "360° − 90° =", a: 270, unit: "°" }], { ok: "90°, 180°, 270°, 360°는 직각 1개, 2개, 3개, 4개만큼의 각도예요." }); } },
    { name: "무늬에서 규칙 찾기", inst: "2학년 때 무늬에서 규칙을 찾았어요. 무늬 조각이 놓인 규칙을 찾아 ? 칸을 채워 보세요.", hints: ["왼쪽에서 오른쪽으로 가면서 색칠된 부채꼴이 어느 모서리로 옮겨 가는지 봐요.", "네 칸마다 같은 모양이 되풀이돼요."],
      render: (b, a) => m4Pattern(b, a, { mode: "fill", cols: 8, rows: 1, U: 66, given: [[M4_I, m4Pow(1), m4Pow(2), m4Pow(3), M4_I, m4Pow(1), null, null]], ans: [[M4_I, m4Pow(1), m4Pow(2), m4Pow(3), M4_I, m4Pow(1), m4Pow(2), m4Pow(3)]], tip: "도장 단추로 무늬 조각을 돌려 모양을 맞춘 다음 ? 칸을 눌러요.", ok: "네 가지 모양이 차례대로 되풀이되는 규칙이에요. 이 단원에서는 이렇게 ‘돌리기’로 모양이 바뀌는 것을 배워요." }) }
  ],
  challenge: { inst: "이번에는 평행사변형 조각을 빈자리에 넣어 보세요. 돌리기만으로 맞출 수 있을까요?", hints: ["평행사변형 조각을 이리저리 돌려 봐도 빈자리와 기울어진 쪽이 반대예요.", "뒤집기를 써 봐요."],
    render: (b, a) => m4Board(b, a, { w: 10, h: 7, U: 48, deco: m4Tangram("para"), piece: { pts: [[1, 1], [0, 0], [0, 2], [1, 3]], fill: "#BFE5E8", stroke: "#2B8A94" }, start: [7, 2],
      tasks: [{ t: "fit", pts: [[4, 2], [5, 1], [5, 3], [4, 4]], label: "평행사변형 조각을 빈자리에 넣기" }], doneMsg: "딱 맞게 넣었어요!",
      ok: "평행사변형 조각은 돌리기만으로는 맞지 않고, 뒤집어야 맞았어요! 뒤집기와 돌리기는 서로 다른 이동이에요." }) }
},
{
  id: "m2", no: 2, title: "평면도형을 밀어 볼까요", soop: "개념 구축하기(O)",
  question: "평면도형을 밀면 무엇이 바뀌고 무엇이 그대로일까요?",
  summary: "도형을 밀면 도형의 위치만 바뀌고 모양은 변하지 않아요. 미는 방향(위쪽, 아래쪽, 왼쪽, 오른쪽)과 민 거리(□칸, □ cm)를 함께 말해요.",
  steps: [
    { inst: "길을 잃은 두두가 반딧불이를 만났어요. “함께 나무에 가서 다른 친구들에게 물어보는 게 좋겠어요.” 두두를 나무 쪽으로 밀어 보세요. 그다음 위쪽, 아래쪽, 왼쪽으로도 밀어 보세요.", hints: ["오른쪽 단추를 누르거나 두두를 끌어서 점선 자리까지 옮겨요.", "밀기 단추는 한 번 누를 때마다 1칸씩 움직여요."],
      render: (b, a) => m4Board(b, a, { w: 12, h: 7, U: 46, ctrl: ["slide"], piece: "mole", start: [1, 3],
        deco: (g, U) => { g.append(svgEl("rect", { x: 10.7 * U, y: 2.6 * U, width: .7 * U, height: 4.4 * U, fill: "#8A6248" }), svgEl("circle", { cx: 11.05 * U, cy: 2.2 * U, r: 1.25 * U, fill: "#7FB069" }), svgEl("circle", { cx: 10.3 * U, cy: 1.6 * U, r: .7 * U, fill: "#8FC27A" }), svgEl("circle", { cx: 5 * U, cy: 1.2 * U, r: .16 * U, fill: M4_GOLD }), svgEl("circle", { cx: 5 * U, cy: 1.2 * U, r: .36 * U, fill: M4_GOLD, opacity: .3 }), txt(11 * U, 6.6 * U, "나무", 18, { fill: "#fff" })); },
        tasks: [{ t: "fit", st: { x: 7, y: 3, M: M4_I }, label: "두두를 나무 쪽(점선 자리)으로 밀기", okMsg: "나무 쪽으로 왔어요! 이번엔 위쪽, 아래쪽, 왼쪽으로도 밀어 봐요." }, { t: "try", ops: ["slide:위", "slide:아래", "slide:왼"], label: "위쪽, 아래쪽, 왼쪽으로도 밀어 보기" }],
        ask: [{ parts: ["두두를 오른쪽으로 밀었더니 위치가 ", { o: ["오른쪽으로 바뀌었어요", "왼쪽으로 바뀌었어요", "그대로예요"], a: 0 }, "."] }, { parts: ["어느 쪽으로 밀어도 두두의 모양은 ", { o: ["변하지 않았어요", "변했어요"], a: 0, why: { "1": "흐린 처음 그림과 비교해 봐요. 코, 다리, 꼬리가 그대로 있어요." } }, "."] }],
        ok: "두두를 밀면 미는 쪽으로 위치가 바뀌고, 모양은 변하지 않아요." }) },
    { name: "점 밀기", inst: "점 ㄱ을 위쪽, 아래쪽, 왼쪽, 오른쪽으로 각각 2칸 밀었을 때의 점을 모눈의 꼭짓점에 찍어 보세요.", hints: ["점 ㄱ에서 선을 따라 한 칸, 두 칸 세어요.", "점과 점 사이(칸)를 세어요. 선이나 점의 개수를 세는 것이 아니에요."],
      render: (b, a) => m4Point(b, a, { mode: "place", w: 10, h: 8, U: 46, from: { n: "ㄱ", p: [5, 4] }, tasks: [{ dir: "위", k: 2 }, { dir: "아래", k: 2 }, { dir: "왼", k: 2 }, { dir: "오른", k: 2 }],
        ask: [{ parts: ["미는 ", { o: ["방향", "색깔"], a: 0 }, "에 따라 점이 이동한 만큼 ", { o: ["위치", "모양"], a: 0 }, "가 바뀌어요."] }], ok: "미는 방향에 따라 점이 이동한 만큼 위치가 바뀌어요." }) },
    { name: "점을 민 방법 말하기", inst: "모눈 한 칸은 1 cm예요. 보기처럼 점 ㄴ, ㄷ, ㄹ을 어떻게 밀었는지 설명해 보세요.", hints: ["● 처음 점에서 ○ 민 뒤의 점까지 어느 쪽으로 갔는지 봐요.", "모눈 한 칸이 1 cm이니까 움직인 칸 수가 곧 cm예요."],
      render: (b, a) => m4Point(b, a, { mode: "explain", unit: "cm", w: 12, h: 8, U: 44, example: { n: "ㄱ", dir: "오른", k: 3 },
        pts: [{ n: "ㄱ", p: [1, 1], q: [4, 1] }, { n: "ㄴ", p: [10, 2], q: [8, 2] }, { n: "ㄷ", p: [3, 6], q: [3, 4] }, { n: "ㄹ", p: [7, 5], q: [7, 6] }],
        ok: "점 ㄴ은 왼쪽으로 2 cm, 점 ㄷ은 위쪽으로 2 cm, 점 ㄹ은 아래쪽으로 1 cm 밀었어요. 방향과 거리를 함께 말했어요!" }) },
    { name: "삼각형 밀기와 약속", inst: "삼각형 ㄱㄴㄷ을 위쪽, 아래쪽, 왼쪽, 오른쪽으로 각각 6칸 밀었을 때의 도형을 그려 보세요.", hints: ["꼭짓점 하나씩 6칸 옮겨 찍으면 쉬워요. 꼭짓점 ㄱ을 먼저 옮겨 봐요.", "두 도형 사이의 빈칸이 6칸이 아니라, 같은 꼭짓점이 6칸 움직여요."],
      render: (b, a) => m4Draw(b, a, { mode: "slide", shape: M4_TRI_S, w: 15, h: 14, U: 34, pos: [6, 6], tasks: [{ op: m4Sl("위", 6) }, { op: m4Sl("아래", 6) }, { op: m4Sl("왼", 6) }, { op: m4Sl("오른", 6) }],
        ask: [{ parts: ["약속: 도형을 밀면 도형의 ", { o: ["위치", "모양"], a: 0 }, "만 바뀌고 ", { o: ["모양", "위치"], a: 0 }, "은 변하지 않아요."] }], askTitle: "네 도형을 처음 도형과 비교하고 약속을 완성해요.",
        ok: "도형을 밀면 위치만 바뀌고 모양은 변하지 않아요." }) },
    { name: "조각 빼내기", inst: "놀이판의 초록색 조각을 출구 밖으로 빼내 보세요. 다른 조각을 먼저 밀어야 할 수도 있어요.", hints: ["초록색 조각이 오른쪽으로 가는 길을 막는 조각이 있어요.", "빨간색 조각을 아래쪽으로 밀어 길을 열어요."],
      render: (b, a) => m4Slide(b, a, { w: 4, h: 4, U: 70, exit: { name: "초록", row: 1 }, blocks: [
        { name: "노랑", color: "#F7DC6F", cells: [[0, 0], [1, 0]], x: 0, y: 0 }, { name: "주황", color: "#F5B07A", cells: [[0, 0]], x: 3, y: 0 },
        { name: "빨강", color: "#E8796B", cells: [[0, 0], [0, 1]], x: 2, y: 0 }, { name: "초록", color: "#7CC68D", cells: [[0, 0], [1, 0]], x: 0, y: 1 },
        { name: "파랑", color: "#7FB2E5", cells: [[0, 0], [0, 1]], x: 3, y: 2 }, { name: "보라", color: "#C3A6E3", cells: [[0, 0], [1, 0]], x: 0, y: 3 }],
        ask: [{ parts: ["먼저 빨간색 조각을 ", { o: M4_DIRS, a: 1 }, "쪽으로 ", { n: 2, why: { "1": "1칸만 밀면 빨간색 조각이 아직 초록색 조각의 길을 막아요." } }, "칸 밀었어. 그다음 초록색 조각을 ", { o: M4_DIRS, a: 3 }, "쪽으로 ", { n: 4, why: { "2": "초록색 조각이 놀이판 밖으로 다 나가려면 더 밀어야 해요." } }, "칸 밀어서 빼냈어."] }],
        askTitle: "어떻게 빼냈는지 말해 보세요.", ok: "빨간색 조각을 아래쪽으로 2칸, 초록색 조각을 오른쪽으로 4칸 밀었어요." }) },
    { name: "밀기로 무늬 만들기", inst: "무늬 조각으로 기본 모양을 만들고, 밀기를 이용하여 규칙적인 무늬를 만들어 보세요.", hints: ["노란 테두리 안에 무늬 조각을 두 개 이상 찍어 기본 모양을 만들어요.", "만든 모양을 오른쪽으로 밀고, 아래쪽으로 밀어서 무늬를 채워요."],
      render: (b, a) => m4Pattern(b, a, { mode: "slide", cols: 6, rows: 4, U: 62, block: { w: 2, h: 2 }, ok: "밀기만 이용해서 규칙적인 무늬를 만들었어요." }) }
  ],
  challenge: { inst: "모양을 완성하려면 조각 가와 나를 어떻게 밀어야 할까요? 직접 밀어 완성하고 설명해 보세요.", hints: ["조각 가는 점선 자리의 위쪽에 있어요.", "조각을 고르고 한 칸씩 밀면서 칸 수를 세어요."],
    render: (b, a) => m4Slide(b, a, { w: 10, h: 8, U: 46, targets: { "가": [2, 4], "나": [4, 4] }, blocks: [
      { name: "고정", label: "", color: "#9AA8B4", cells: [[0, 1], [0, 2], [1, 2], [2, 2]], x: 2, y: 4, fixed: true },
      { name: "가", color: "#F7C6A3", cells: [[0, 0], [1, 0], [2, 0], [1, 1]], x: 2, y: 0 },
      { name: "나", color: "#A8D5E2", cells: [[1, 0], [1, 1], [1, 2], [0, 1]], x: 8, y: 4 }],
      ask: [{ parts: ["조각 가를 ", { o: M4_DIRS, a: 1 }, "쪽으로 ", { n: 4 }, "칸 밀고, 조각 나를 ", { o: M4_DIRS, a: 2 }, "쪽으로 ", { n: 4 }, "칸 밀어요."] }],
      ok: "조각 가를 아래쪽으로 4칸, 조각 나를 왼쪽으로 4칸 밀면 모양이 완성돼요." }) }
},
{
  id: "m3", no: 3, title: "평면도형을 뒤집어 볼까요 ⑴ 두더지와 삼각형", soop: "개념 구축하기(O)",
  question: "평면도형을 뒤집으면 무엇이 바뀔까요?",
  summary: "도형을 위쪽이나 아래쪽으로 뒤집으면 위쪽과 아래쪽이 서로 바뀌고, 왼쪽이나 오른쪽으로 뒤집으면 왼쪽과 오른쪽이 서로 바뀌어요. 도형을 뒤집으면 방향만 바뀌고 모양은 변하지 않아요.",
  steps: [
    { inst: "두두가 나무에서 나비를 만났어요. “저를 따라와요!” 나비가 뒤편으로 날자 두두가 따라가요. 두두 그림을 위쪽, 아래쪽, 왼쪽, 오른쪽으로 뒤집어 보세요.", hints: ["뒤집기 단추를 하나씩 눌러 봐요. 흐린 그림은 처음 모양이에요.", "같은 쪽으로 두 번 뒤집으면 어떻게 되는지도 살펴봐요."],
      render: (b, a) => m4Board(b, a, { w: 9, h: 6, U: 50, ctrl: ["flip"], piece: "mole", start: [3, 2], ghost: false,
        deco: (g, U) => { g.append(svgEl("path", { d: `M${1.2 * U} ${1.2 * U} q-${.5 * U} -${.6 * U} -${.2 * U} ${.5 * U} q${.4 * U} ${.3 * U} ${.2 * U} -${.5 * U} q${.5 * U} -${.6 * U} ${.2 * U} ${.5 * U} q-${.4 * U} ${.3 * U} -${.2 * U} -${.5 * U}`, fill: "#F2A6C8", stroke: "#B0517F", "stroke-width": 2 })); },
        tasks: [{ t: "try", ops: ["flip:위", "flip:아래", "flip:왼", "flip:오른"], label: "네 방향으로 모두 뒤집어 보기" }],
        ask: [{ q: "처음 두두를 위쪽으로 뒤집었을 때를 생각해요.", parts: ["두두의 다리는 ", { o: ["아래쪽에서 위쪽으로 바뀌어요", "위쪽에서 아래쪽으로 바뀌어요", "그대로 아래쪽에 있어요"], a: 0 }, ". 두두의 꼬리는 ", { o: ["위쪽에서 아래쪽으로 바뀌어요", "아래쪽에서 위쪽으로 바뀌어요", "그대로 위쪽에 있어요"], a: 0 }, "."] },
          { parts: ["왼쪽이나 오른쪽으로 뒤집으면 두두의 ", { o: ["왼쪽과 오른쪽", "위쪽과 아래쪽"], a: 0 }, "이 서로 바뀌어요. 뒤집어도 두두의 모양은 ", { o: ["변하지 않아요", "변해요"], a: 0 }, "."] }],
        ok: "위쪽이나 아래쪽으로 뒤집으면 위아래가, 왼쪽이나 오른쪽으로 뒤집으면 좌우가 서로 바뀌어요. 같은 쪽으로 두 번 뒤집으면 처음 모양으로 돌아와요." }) },
    { inst: "삼각형 ㄱㄴㄷ을 위쪽, 아래쪽, 왼쪽, 오른쪽으로 뒤집었을 때의 도형을 그려 보세요.", hints: ["위쪽으로 뒤집으면 위에 있던 꼭짓점 ㄱ이 아래로 가요.", "왼쪽으로 뒤집으면 왼쪽 아래의 ㄴ과 오른쪽 아래의 ㄷ이 서로 자리를 바꿔요."],
      render: (b, a) => m4Draw(b, a, { mode: "free", shape: M4_TRI_F, U: 38, tasks: [{ op: m4Fl("위") }, { op: m4Fl("아래") }, { op: m4Fl("왼") }, { op: m4Fl("오른") }], ok: "뒤집은 방향에 따라 위아래 또는 좌우가 서로 바뀌었어요." }) },
    { inst: "뒤집은 삼각형들을 처음 삼각형과 비교해서 말해 보세요.", hints: ["그린 도형 모음을 다시 떠올려 봐요.", "위쪽으로 뒤집은 것과 아래쪽으로 뒤집은 것을 비교해요."],
      render: (b, a) => blanks(b, a, ["위쪽이나 아래쪽으로 뒤집으면 도형의 ", { o: ["위쪽과 아래쪽", "왼쪽과 오른쪽"], a: 0 }, "이 서로 바뀌고, 왼쪽이나 오른쪽으로 뒤집으면 ", { o: ["왼쪽과 오른쪽", "위쪽과 아래쪽"], a: 0 }, "이 서로 바뀌어요. 위쪽으로 뒤집은 도형과 아래쪽으로 뒤집은 도형은 ", { o: ["같아요", "달라요"], a: 0 }, "."]) },
    { inst: "‘모양’은 겉으로 나타나는 생김새를 말해요. 뒤집으면 꼭짓점의 자리는 바뀌지만, 변의 길이와 생김새는 그대로예요. 약속을 완성해요.", hints: ["뒤집은 삼각형을 다시 뒤집으면 처음 삼각형과 꼭 겹쳐요."],
      render: (b, a) => blanks(b, a, ["약속: 도형을 뒤집으면 도형의 ", { o: ["방향", "모양", "크기"], a: 0 }, "만 바뀌고 ", { o: ["모양", "방향", "위치"], a: 0 }, "은 변하지 않아요."]) },
    { inst: "배운 것을 확인해요.", hints: ["오른쪽으로 뒤집으면 왼쪽과 오른쪽이 서로 바뀌어요. 위아래는 그대로예요."],
      render: (b, a) => quiz(b, a, [
        { q: "보기의 모양 조각을 오른쪽으로 뒤집었을 때의 모양을 골라요.", fig: () => m4Cards([{ pc: M4_GAMMA, label: "보기" }, { pc: M4_GAMMA, M: M4_FLR, label: "가" }, { pc: M4_GAMMA, M: M4_FUD, label: "나" }, { pc: M4_GAMMA, M: M4_CW, label: "다" }], { U: 28, maxW: "30em" }), o: ["가", "나", "다"], a: 0, why: { "1": "나는 위쪽과 아래쪽이 바뀐 모양이에요.", "2": "다는 돌린 모양이에요." } },
        { q: "도형을 같은 쪽으로 두 번 뒤집으면 어떻게 될까요?", o: ["처음 모양과 같아져요", "왼쪽과 오른쪽이 바뀐 모양이 돼요", "모양이 변해요"], a: 0 }], { ok: "오른쪽으로 뒤집으면 좌우가 바뀌어요. 같은 쪽으로 두 번 뒤집으면 처음과 같아요." }) }
  ],
  challenge: { inst: "어떤 도형을 왼쪽으로 뒤집었더니 왼쪽 그림과 같았어요. 처음 도형을 그려 보세요.", hints: ["거꾸로 생각해요. 왼쪽으로 뒤집은 도형을 다시 왼쪽(또는 오른쪽)으로 뒤집으면 처음 도형이에요."],
    render: (b, a) => m4Draw(b, a, { mode: "free", before: true, shape: M4_QUAD2, U: 38, tasks: [{ op: m4Fl("왼"), label: "처음 도형 그리기", short: "처음 도형" }], ok: "왼쪽으로 뒤집은 도형을 다시 왼쪽으로 뒤집으면 처음 도형이 돼요." }) }
},
{
  id: "m4", no: 4, title: "평면도형을 뒤집어 볼까요 ⑵ 사각형과 도장", soop: "개념 구축하기(O)",
  question: "어느 쪽으로 뒤집었는지 어떻게 알 수 있을까요?",
  summary: "도형을 위쪽이나 아래쪽으로 뒤집으면 위쪽과 아래쪽이, 왼쪽이나 오른쪽으로 뒤집으면 왼쪽과 오른쪽이 서로 바뀌어요. 뾰족한 부분이나 튀어나온 부분이 어디로 갔는지 보면 뒤집은 방향을 알 수 있어요.",
  steps: [
    { inst: "사각형 ㄱㄴㄷㄹ을 위쪽, 아래쪽, 왼쪽, 오른쪽으로 뒤집어 보세요. 꼭짓점의 자리가 어떻게 바뀌는지 살펴봐요.", hints: ["한 번 뒤집은 다음에는 ‘처음으로’를 누르고 다른 쪽으로 뒤집어 비교해요.", "위쪽으로 뒤집은 모양과 아래쪽으로 뒤집은 모양을 비교해요."],
      render: (b, a) => m4Board(b, a, { w: 9, h: 6, U: 50, ctrl: ["flip"], piece: M4_QUAD, start: [3, 1], ghost: false,
        tasks: [{ t: "try", ops: ["flip:위", "flip:아래", "flip:왼", "flip:오른"], label: "네 방향으로 모두 뒤집어 보기" }],
        ask: [{ parts: ["처음 사각형을 위쪽으로 뒤집은 모양과 ", { o: ["아래쪽", "왼쪽", "오른쪽"], a: 0 }, "으로 뒤집은 모양은 같아요."] }, { parts: ["처음 사각형을 왼쪽으로 뒤집은 모양과 ", { o: ["오른쪽", "위쪽", "아래쪽"], a: 0 }, "으로 뒤집은 모양은 같아요."] }],
        ok: "위쪽과 아래쪽으로 뒤집은 모양이 같고, 왼쪽과 오른쪽으로 뒤집은 모양이 같아요." }) },
    { inst: "사각형 ㄱㄴㄷㄹ을 네 방향으로 뒤집었을 때의 도형을 그려 보세요.", hints: ["위쪽으로 뒤집으면 ㄱ과 ㄴ, ㄹ과 ㄷ이 위아래로 자리를 바꿔요.", "오른쪽으로 뒤집으면 ㄱ과 ㄹ, ㄴ과 ㄷ이 좌우로 자리를 바꿔요."],
      render: (b, a) => m4Draw(b, a, { mode: "free", shape: M4_QUAD, U: 38, tasks: [{ op: m4Fl("위") }, { op: m4Fl("아래") }, { op: m4Fl("왼") }, { op: m4Fl("오른") }], ok: "네 방향으로 뒤집은 사각형을 모두 그렸어요." }) },
    { name: "모양 조각을 뒤집은 방향", inst: "모양 조각을 어떻게 뒤집었는지 알아보세요. 조각의 특징(꼭지, 굴뚝)이 어디로 갔는지 봐요.", hints: ["사과 꼭지가 위에서 아래로 갔으면 위쪽이나 아래쪽으로 뒤집은 거예요.", "굴뚝이 오른쪽에서 왼쪽으로 갔으면 왼쪽이나 오른쪽으로 뒤집은 거예요."],
      render: (b, a) => m4Ask(b, a, [
        { fig: () => m4Fig({ w: 8, h: 2.6, U: 34, maxW: "16em", items: [{ pc: "apple", x: .5, y: .3 }, { pc: "apple", M: M4_FUD, x: 5.5, y: .3 }], deco: (g, U) => m4Arrow(g, 3 * U, 1.3 * U, 5.1 * U, 1.3 * U) }), parts: ["사과 조각: 나는 ", { o: M4_DIRS, acc: [0, 1], why: { "2": "꼭지와 잎이 위에서 아래로 갔어요. 좌우가 아니라 위아래가 바뀌었어요.", "3": "꼭지와 잎이 위에서 아래로 갔어요. 좌우가 아니라 위아래가 바뀌었어요." } }, "쪽으로 뒤집었어."] },
        { fig: () => m4Fig({ w: 8, h: 2.6, U: 34, maxW: "16em", items: [{ pc: "house", x: .5, y: .3 }, { pc: "house", M: M4_FLR, x: 5.5, y: .3 }], deco: (g, U) => m4Arrow(g, 3 * U, 1.3 * U, 5.1 * U, 1.3 * U) }), parts: ["집 조각: 나는 ", { o: M4_DIRS, acc: [2, 3], why: { "0": "지붕은 그대로 위에 있어요. 굴뚝이 오른쪽에서 왼쪽으로 갔어요.", "1": "지붕은 그대로 위에 있어요. 굴뚝이 오른쪽에서 왼쪽으로 갔어요." } }, "쪽으로 뒤집었어."] },
        { parts: ["사과 조각은 ", { o: ["위쪽과 아래쪽", "왼쪽과 오른쪽"], a: 0 }, "이, 집 조각은 ", { o: ["왼쪽과 오른쪽", "위쪽과 아래쪽"], a: 0 }, "이 서로 바뀌었어요."] }], { ok: "사과는 위쪽(또는 아래쪽)으로, 집은 왼쪽(또는 오른쪽)으로 뒤집었어요. 두 가지 답이 모두 맞아요." }) },
    { inst: "약속을 다시 확인하고, 친구의 생각이 맞는지 판단해 보세요.", hints: ["모양은 겉으로 나타나는 생김새예요. 뒤집은 도형을 다시 뒤집으면 처음 도형과 꼭 겹쳐요."],
      render: (b, a) => m4Ask(b, a, [
        { parts: ["약속: 도형을 뒤집으면 도형의 ", { o: ["방향", "모양"], a: 0 }, "만 바뀌고 ", { o: ["모양", "방향"], a: 0 }, "은 변하지 않아요."] },
        { q: "친구: “사각형을 뒤집었더니 꼭짓점 ㄱ이 다른 곳으로 갔으니까 모양이 변했어.”", parts: ["친구의 말은 ", { o: ["틀렸어요", "맞아요"], a: 0, why: { "1": "꼭짓점의 자리(방향)는 바뀌었지만 변의 길이와 생김새는 그대로예요." } }, ". 꼭짓점의 자리가 바뀐 것은 ", { o: ["방향", "모양"], a: 0 }, "이 바뀐 거예요."] }], { ok: "뒤집으면 방향만 바뀌고 모양은 그대로예요." }) },
    { name: "도장 찍기", inst: "토끼 도장을 종이에 찍었어요. 찍은 모양을 찾고, 그렇게 생각한 까닭을 골라 보세요.", hints: ["도장을 찍으면 도장의 왼쪽과 오른쪽이 서로 바뀌어요.", "접힌 귀와 웃는 눈이 어느 쪽에 있는지 봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "왼쪽 도장을 종이에 찍은 모양은?", fig: () => m4Cards([{ pc: "stamp", label: "도장" }, { pc: { pic: "stamp", ink: "#D23C3C" }, label: "가" }, { pc: { pic: "stamp", ink: "#D23C3C" }, M: M4_FUD, label: "나" }, { pc: { pic: "stamp", ink: "#D23C3C" }, M: M4_FLR, label: "다" }], { U: 34, maxW: "30em" }), o: ["가", "나", "다"], a: 2, why: { "0": "가는 도장과 똑같아요. 도장을 찍으면 좌우가 바뀌어요.", "1": "나는 위쪽과 아래쪽이 바뀐 모양이에요." } },
        { q: "그렇게 생각한 까닭은?", o: ["도장을 종이에 찍으면 도장의 왼쪽과 오른쪽이 서로 바뀌기 때문이에요.", "도장을 찍으면 위쪽과 아래쪽이 서로 바뀌기 때문이에요.", "도장을 찍어도 모양이 똑같이 나오기 때문이에요."], a: 0 }], { ok: "오른쪽에 있던 접힌 귀와 웃는 눈이 왼쪽으로 갔어요. 도장을 찍으면 왼쪽과 오른쪽이 서로 바뀌어요." }) }
  ],
  challenge: { inst: "투명 필름 위에 쓴 두 수 28과 21을 각각 위쪽으로 뒤집었어요. 나온 두 수와 그 합을 구해 보세요.", hints: ["숫자 하나하나의 위쪽과 아래쪽을 바꾸어 생각해요.", "디지털 숫자 2를 위쪽으로 뒤집으면 5처럼 보여요. 1과 8은 그대로예요."],
    render: (b, a) => m4Card(b, a, { cards: [28, 21], dir: "위", sum: true }) }
},
{
  id: "m5", no: 5, title: "평면도형을 돌려 볼까요 ⑴ 바늘과 시계 방향", soop: "개념 구축하기(O)",
  question: "평면도형을 시계 방향으로 돌리면 어떻게 바뀔까요?",
  summary: "도형을 시계 방향으로 90°, 180°, 270°만큼 돌리면 위쪽 부분이 각각 오른쪽, 아래쪽, 왼쪽으로 가요. 360°만큼 돌리면 처음과 같아요. 돌리는 방법은 방향과 각도를 함께 말해요.",
  steps: [
    { inst: "지친 나비가 바늘을 보여 줬어요. “바늘이 가리키는 방향으로 가면 꽃밭에 갈 수 있어요.” 바늘이 오른쪽의 꽃밭을 가리키도록 돌려 보세요.", hints: ["바늘의 뾰족한 부분이 위쪽에서 오른쪽으로 가야 해요.", "시계 방향은 시곗바늘이 도는 방향이에요. 90°는 직각만큼이에요."],
      render: (b, a) => m4Spin(b, a, { pic: "needle", mode: "aim", goal: "오른", ways: 1,
        deco: g => { [[520, 250], [552, 300], [515, 350], [560, 400], [540, 205]].forEach(([x, y], i) => { g.append(svgEl("line", { x1: x, y1: y + 6, x2: x, y2: y + 30, stroke: "#4E9A52", "stroke-width": 4 }), svgEl("circle", { cx: x, cy: y, r: 13, fill: ["#F28B9B", "#F7DC6F", "#C3A6E3", "#F5B07A", "#7FB2E5"][i] }), svgEl("circle", { cx: x, cy: y, r: 5, fill: "#fff" })); }); g.append(txt(535, 450, "꽃밭", 22, { fill: "#4E9A52" })); },
        ok: "바늘의 뾰족한 윗부분이 오른쪽으로 갔어요. 시계 방향으로 90°만큼 돌렸다고도, 시계 반대 방향으로 270°만큼 돌렸다고도 말할 수 있어요." }) },
    { name: "예상하고 돌려 보기", inst: "바늘을 돌리면 뾰족한 부분이 어느 쪽을 가리킬지 먼저 예상하고, 화살표를 눌러 확인해 보세요.", hints: ["시계 방향으로 90°만큼 돌리면 위쪽 부분이 오른쪽으로 가요.", "180°는 직각 2개, 270°는 직각 3개, 360°는 한 바퀴예요."],
      render: (b, a) => m4Spin(b, a, { pic: "needle", mode: "predict", tasks: [m4R(true, 90), m4R(false, 90), m4R(true, 180), m4R(true, 270), m4R(true, 360)],
        ok: "시계 방향으로 90°, 180°, 270°만큼 돌리면 위쪽 부분이 오른쪽, 아래쪽, 왼쪽으로 가고, 360°만큼 돌리면 처음과 같아요. 시계 반대 방향으로 90°만큼 돌리면 위쪽 부분이 왼쪽으로 가요." }) },
    { inst: "삼각형 ㄱㄴㄷ을 시계 방향으로 90°, 180°, 270°, 360°만큼 돌렸을 때의 도형을 그려 보세요. 돌리는 방향과 각도를 모두 생각해야 해요.", hints: ["위쪽 부분인 꼭짓점 ㄱ이 어디로 가는지 먼저 생각해요.", "시계 방향으로 90°만큼 돌리면 세로로 긴 변이 가로로 눕고, ㄱ이 오른쪽으로 가요."],
      render: (b, a) => m4Draw(b, a, { mode: "free", shape: M4_TRI_R, U: 38, tasks: [{ op: m4R(true, 90) }, { op: m4R(true, 180) }, { op: m4R(true, 270) }, { op: m4R(true, 360) }], ok: "삼각형의 방향은 돌리는 각도에 따라 바뀌고, 모양은 변하지 않아요." }) },
    { inst: "시계 방향으로 돌렸을 때의 변화를 말해 보세요.", hints: ["바늘과 삼각형에서 위쪽 부분이 어디로 갔는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["시계 방향으로 90°만큼 돌리면 위쪽 부분이 ", { o: ["오른쪽", "왼쪽", "아래쪽"], a: 0 }, "으로, 180°만큼 돌리면 ", { o: ["아래쪽", "오른쪽", "왼쪽"], a: 0 }, "으로, 270°만큼 돌리면 ", { o: ["왼쪽", "오른쪽", "아래쪽"], a: 0 }, "으로 가요. 360°만큼 돌리면 ", { o: ["처음과 같아요", "아래쪽으로 가요"], a: 0 }, "."]) },
    { inst: "배운 것을 확인해요.", hints: ["시계 방향으로 90°만큼 돌리면 위쪽 부분이 오른쪽으로 가요.", "돌리는 방법은 방향과 각도를 함께 말해야 정확해요."],
      render: (b, a) => quiz(b, a, [
        { q: "보기의 모양 조각을 시계 방향으로 90°만큼 돌렸을 때의 모양을 골라요.", fig: () => m4Cards([{ pc: M4_LSH, label: "보기" }, { pc: M4_LSH, M: M4_FUD, label: "가" }, { pc: M4_LSH, M: M4_CW, label: "나" }, { pc: M4_LSH, M: M4_CCW, label: "다" }], { U: 26, maxW: "30em" }), o: ["가", "나", "다"], a: 1, why: { "0": "가는 뒤집은 모양이에요.", "2": "다는 시계 반대 방향으로 90°만큼 돌린 모양이에요." } },
        { q: "도형을 돌린 방법을 바르게 말한 것은?", o: ["시계 방향으로 돌렸어요.", "시계 방향으로 90°만큼 돌렸어요.", "90°만큼 돌렸어요."], a: 1, why: { "0": "얼마만큼 돌렸는지 각도를 함께 말해야 해요.", "2": "어느 방향으로 돌렸는지 함께 말해야 해요." } }], { ok: "돌리는 방법은 방향과 각도를 함께 말해요." }) }
  ],
  challenge: { inst: "도형을 시계 방향으로 180°만큼 돌렸을 때의 도형을 그려 보세요.", hints: ["180°는 직각 2개만큼이에요. 위쪽 부분이 아래쪽으로, 왼쪽 부분이 오른쪽으로 가요.", "뒤집은 모양과 헷갈리지 않게 조심해요."],
    render: (b, a) => m4Draw(b, a, { mode: "free", shape: M4_PENT, U: 38, tasks: [{ op: m4R(true, 180) }], ok: "시계 방향으로 180°만큼 돌리면 위아래와 좌우가 모두 바뀐 것처럼 보여요." }) }
},
{
  id: "m6", no: 6, title: "평면도형을 돌려 볼까요 ⑵ 시계 반대 방향과 퍼즐", soop: "개념 구축하기(O)",
  question: "시계 반대 방향으로 돌리면 어떻게 될까요? 같은 모양이 되는 방법은 몇 가지일까요?",
  summary: "시계 반대 방향으로 90°, 180°, 270°만큼 돌리면 위쪽 부분이 각각 왼쪽, 아래쪽, 오른쪽으로 가요. 도형을 돌리면 방향만 바뀌고 모양은 변하지 않아요. 시계 방향으로 90°만큼 돌린 모양과 시계 반대 방향으로 270°만큼 돌린 모양은 같아요.",
  steps: [
    { inst: "바늘을 시계 반대 방향으로 90°, 180°, 270°, 360°만큼 돌리면 뾰족한 부분이 어느 쪽을 가리킬지 예상하고 확인해 보세요.", hints: ["시계 반대 방향은 시곗바늘이 도는 방향과 반대예요.", "시계 반대 방향으로 90°만큼 돌리면 위쪽 부분이 왼쪽으로 가요."],
      render: (b, a) => m4Spin(b, a, { pic: "needle", mode: "predict", tasks: [m4R(false, 90), m4R(false, 180), m4R(false, 270), m4R(false, 360)], ok: "시계 반대 방향으로 90°, 180°, 270°만큼 돌리면 위쪽 부분이 왼쪽, 아래쪽, 오른쪽으로 가고, 360°만큼 돌리면 처음과 같아요." }) },
    { inst: "삼각형 ㄱㄴㄷ을 시계 반대 방향으로 90°, 180°, 270°, 360°만큼 돌렸을 때의 도형을 그려 보세요.", hints: ["위쪽 부분인 꼭짓점 ㄱ이 시계 반대 방향으로 90°만큼 돌면 왼쪽으로 가요."],
      render: (b, a) => m4Draw(b, a, { mode: "free", shape: M4_TRI_R, U: 38, tasks: [{ op: m4R(false, 90) }, { op: m4R(false, 180) }, { op: m4R(false, 270) }, { op: m4R(false, 360) }], ok: "시계 반대 방향으로 돌린 도형을 모두 그렸어요." }) },
    { name: "약속하기", inst: "약속을 완성하고, 같은 모양이 되는 짝을 찾아요.", hints: ["시계 반대 방향으로 90°만큼 돌리면 위쪽 부분이 왼쪽으로 가요. 시계 방향으로 몇 도만큼 돌리면 위쪽 부분이 왼쪽으로 갈까요?"],
      render: (b, a) => blanks(b, a, ["약속: 도형을 돌리면 도형의 ", { o: ["방향", "모양"], a: 0 }, "만 바뀌고 ", { o: ["모양", "방향"], a: 0 }, "은 변하지 않아요. 시계 반대 방향으로 90°만큼 돌린 모양은 시계 방향으로 ", { o: ["90°", "180°", "270°"], a: 2 }, "만큼 돌린 모양과 같아요."]) },
    { name: "퍼즐 조각 돌리기", inst: "퍼즐 조각을 돌렸더니 왼쪽 위 그림처럼 되었어요. 가운데 조각을 돌려서 같은 모양을 만드는 방법을 두 가지 찾아보세요.", hints: ["튀어나온 부분이 위쪽에서 오른쪽으로 갔어요.", "시계 방향으로 한 번, 시계 반대 방향으로 한 번 찾아봐요."],
      render: (b, a) => m4Spin(b, a, { pic: "puzzle", mode: "aim", goal: M4_CW, ways: 2, goalLabel: "돌린 후",
        ask: [{ parts: ["", { o: ["시계", "시계 반대"], a: 1 }, " 방향으로 270°만큼 돌렸어. 시계 방향으로 ", { n: 90, why: { "270": "시계 방향으로 270°만큼 돌리면 위쪽 부분이 왼쪽으로 가요." } }, "°만큼 돌렸다고도 할 수 있어."] }],
        ok: "퍼즐 조각은 시계 방향으로 90°만큼 또는 시계 반대 방향으로 270°만큼 돌렸어요." }) },
    { inst: "배운 것을 확인해요.", hints: ["뒤집은 모양은 돌려서는 만들 수 없어요.", "시계 반대 방향으로 270°만큼 돌리면 위쪽 부분이 오른쪽으로 가요."],
      render: (b, a) => quiz(b, a, [
        { q: "보기의 도형을 돌렸을 때의 도형이 아닌 것을 골라요.", fig: () => m4Cards([{ pc: M4_GAMMA, label: "보기" }, { pc: M4_GAMMA, M: M4_CW, label: "가" }, { pc: M4_GAMMA, M: M4_FLR, label: "나" }, { pc: M4_GAMMA, M: m4Pow(2), label: "다" }], { U: 26, maxW: "30em" }), o: ["가", "나", "다"], a: 1, why: { "0": "가는 시계 방향으로 90°만큼 돌린 모양이에요.", "2": "다는 180°만큼 돌린 모양이에요." } },
        { q: "시계 반대 방향으로 270°만큼 돌린 모양과 같은 것은?", o: ["시계 방향으로 90°만큼 돌린 모양", "시계 방향으로 270°만큼 돌린 모양", "시계 반대 방향으로 90°만큼 돌린 모양"], a: 0 }], { ok: "나는 뒤집은 모양이라 돌려서는 만들 수 없어요. 시계 반대 방향으로 270°만큼 돌린 모양은 시계 방향으로 90°만큼 돌린 모양과 같아요." }) },
    { name: "돌리기로 무늬 만들기", inst: "돌리기 규칙을 하나 고르고, 그 규칙대로 무늬 조각을 돌려 찍은 다음, 아래쪽으로 밀어서 무늬를 만들어 보세요.", hints: ["앞 칸의 모양을 규칙만큼 돌린 모양을 다음 칸에 찍어요.", "도장 돌리기 단추를 여러 번 눌러서 규칙만큼 돌려요. 180°는 90°를 두 번이에요."],
      render: (b, a) => m4Pattern(b, a, { mode: "rule", cols: 4, rows: 2, U: 74, block: { w: 4, h: 1 }, ok: "규칙대로 돌려서 무늬를 만들었어요. 친구는 어떤 규칙을 골랐는지 비교해 봐요." }) }
  ],
  challenge: { inst: "오른쪽으로 한 칸 갈 때마다, 그리고 아래로 한 줄 갈 때마다 모양을 시계 방향으로 90°만큼 돌리는 규칙으로 만든 무늬예요. ? 칸을 채워 보세요.", hints: ["바로 왼쪽 칸의 모양을 시계 방향으로 90°만큼 돌려요.", "둘째 줄 첫 칸은 첫째 줄 첫 칸을 시계 방향으로 90°만큼 돌린 모양이에요."],
    render: (b, a) => { const ans = [0, 1].map(r => [0, 1, 2, 3].map(c => m4Pow(r + c))); return m4Pattern(b, a, { mode: "fill", cols: 4, rows: 2, U: 74, given: [[ans[0][0], null, ans[0][2], null], [null, ans[1][1], null, ans[1][3]]], ans, ok: "규칙을 찾아 무늬를 완성했어요!" }); } }
},
{
  id: "m7", no: 7, title: "생각을 더하다 ― 길을 연결하여 보물을 찾아볼까요", soop: "탐구 정리하기(O)",
  question: "길 조각을 어떻게 돌려야 길이 이어질까요? 방법은 몇 가지일까요?",
  summary: "길 조각을 돌릴 때에는 방향과 각도를 함께 말해요. 시계 방향으로 90°만큼 돌린 모양과 시계 반대 방향으로 270°만큼 돌린 모양처럼, 같은 모양이 되는 방법이 두 가지 있어요.",
  steps: [
    { name: "길 연결하기", inst: "보물을 찾으려면 출발점에서 도착점까지 길을 모두 연결해야 해요. 길 조각을 고르고 돌리기 단추를 눌러 길을 연결해 보세요. 돌리기 단추를 누르면 길 조각이 단추의 방향과 각도만큼 돌아가요.", hints: ["①은 출발점에서 들어온 길이 아래쪽으로 꺾여야 해요.", "잘못 돌렸으면 다른 단추로 더 돌리거나 ‘처음으로’를 눌러요."],
      render: (b, a) => m4Road(b, a, { cols: 3, rows: 4, U: 96, start: 0, goal: 3, tiles: M4_ROAD7, ok: "길 조각 6개를 모두 돌려서 길을 이었어요!" }) },
    { name: "알맞은 단추 모두 찾기", inst: "처음 길 조각을 이어지는 모양으로 만드는 돌리기 단추를 모두 찾아보세요. (㉠ 시계 방향 90°, ㉡ 시계 방향 180°, ㉢ 시계 방향 270°, ㉣ 시계 반대 방향 90°, ㉤ 시계 반대 방향 180°, ㉥ 시계 반대 방향 270°)", hints: ["한 조각마다 알맞은 단추가 두 개씩 있어요. 시계 방향 하나, 시계 반대 방향 하나예요.", "시계 방향으로 90°만큼 돌린 모양은 시계 반대 방향으로 270°만큼 돌린 모양과 같아요."],
      render: (b, a) => quiz(b, a, M4_PATH7.map((t, i) => ({ q: `${M4_NUM[i]} 길 조각`, fig: () => m4TileFig("corner", [M4_ROAD7[i].r, t.need], { labels: ["처음", "이어지는 모양"] }), o: M4_BTN.map(x => x.l), a: m4BtnIdx(t.turn) })), { ok: "① ㉠, ㉥ ② ㉡, ㉤ ③ ㉢, ㉣ ④ ㉡, ㉤ ⑤ ㉢, ㉣ ⑥ ㉢, ㉣ — 조각마다 두 가지 방법이 있어요.", bad: "알맞은 단추를 모두 골랐는지 봐요. 조각마다 두 개씩 있어요." }) },
    { inst: "같은 모양이 되는 두 가지 방법을 정리해서 말해 보세요.", hints: ["시계 방향 각도와 시계 반대 방향 각도를 더하면 360°가 돼요."],
      render: (b, a) => blanks(b, a, ["시계 방향으로 90°만큼 돌린 모양은 시계 반대 방향으로 ", { o: ["90°", "180°", "270°"], a: 2 }, "만큼 돌린 모양과 같아요. 시계 방향으로 180°만큼 돌린 모양은 시계 반대 방향으로 ", { o: ["90°", "180°", "270°"], a: 1 }, "만큼 돌린 모양과 같아요. 시계 방향으로 270°만큼 돌린 모양은 시계 반대 방향으로 ", { o: ["90°", "180°", "270°"], a: 0 }, "만큼 돌린 모양과 같아요."]) },
    { inst: "길 조각을 돌리는 방법을 말할 때 꼭 지켜야 할 것을 정리해요.", hints: ["‘시계 방향으로 돌렸어요’만 말하면 얼마나 돌렸는지 알 수 없어요."],
      render: (b, a) => m4Ask(b, a, [{ parts: ["돌리는 방법을 말할 때에는 돌리는 ", { o: ["방향", "색깔"], a: 0 }, "과 ", { o: ["각도", "길이"], a: 0 }, "를 함께 말해요."] }, { parts: ["길 조각을 같은 모양이 되게 돌리는 방법은 시계 방향과 시계 반대 방향으로 ", { o: ["두", "한"], a: 0 }, " 가지가 있어요."] }], { ok: "방향과 각도를 함께 말하고, 두 가지 방법을 모두 찾을 수 있어요." }) },
    { name: "나만의 길 만들기", inst: "곧은 길과 꺾인 길 조각을 돌려 붙여서 출발점에서 보물까지 연결되는 나만의 길을 만들어 보세요. 예: “난 곧은 길을 시계 방향으로 90°만큼 돌려서 길을 연결했어.”", hints: ["곧은 길은 처음에 위아래로 놓여 있어요. 옆으로 가려면 90°만큼 돌려요.", "꺾인 길은 처음에 위쪽과 오른쪽이 열려 있어요."],
      render: (b, a) => m4Road(b, a, { build: true, cols: 4, rows: 3, U: 96, start: 0, goal: 2 }) }
  ],
  challenge: { inst: "이번에는 길 조각마다 돌리기 단추를 딱 한 번만 누를 수 있어요. 길을 연결해 보세요.", hints: ["누르기 전에 그 조각이 어떤 모양이 되어야 하는지 먼저 생각해요.", "곧은 길은 90°나 270°만큼 돌리면 눕고, 180°만큼 돌리면 그대로 서 있어요."],
    render: (b, a) => m4Road(b, a, { cols: 4, rows: 3, U: 92, start: 0, goal: 0, once: true, tiles: M4_ROAD_CH, ok: "단추를 한 번씩만 눌러 길을 연결했어요! 미리 생각하고 돌렸어요." }) }
},
{
  id: "m8", no: 8, title: "놀이를 더하다 ― 밀고, 뒤집고, 돌려서 인형극을 만들어 볼까요", soop: "발표하기(P)",
  question: "이동 카드대로 종이 인형을 움직여 어떤 인형극을 만들 수 있을까요?",
  summary: "종이 인형을 책상 위에 놓고 위에서 내려다보며 이동 카드대로 밀고, 뒤집고, 돌려요. 밀기는 위치가 바뀌고, 뒤집기와 돌리기는 방향이 바뀌어요.",
  steps: [
    { name: "이동 카드 알아보기", inst: "“이런! 깡충깡충 뛰던 토끼가 구덩이에 쏙 빠졌어요.” 인형극에서 쓸 이동 카드 10장을 하나씩 눌러 토끼 인형을 움직여 보세요.", hints: ["밀기 카드는 2칸씩 움직여요.", "뒤집기·돌리기 카드는 자리는 그대로이고 방향이 바뀌어요."],
      render: (b, a) => m4Play(b, a, { mode: "cards", init: { rabbit: { x: 5, y: 2, M: M4_I } }, ok: "밀기 카드는 위치를, 뒤집기와 돌리기 카드는 방향을 바꿔요." }) },
    { name: "대본 예시 따라 하기", inst: "지도서의 대본 예시예요. 행동에 맞는 이동 카드를 골라 인형을 움직여 보세요.", hints: ["구덩이로 떨어지려면 아래쪽으로 움직여야 해요.", "구덩이 속을 들여다보려면 여우의 머리가 아래쪽을 향해야 해요."],
      render: (b, a) => m4Play(b, a, { mode: "script", init: { rabbit: { x: 5, y: 2, M: M4_I }, fox: { x: 1, y: 2, M: M4_I } }, rows: [
        { who: "rabbit", say: "(구덩이로 떨어지며) 으악! 구덩이에 빠졌어.", card: 1, from: { x: 5, y: 2, M: M4_I } },
        { who: "fox", say: "(구덩이 쪽으로 뛰어가며) 토끼야, 괜찮니?", card: 3, from: { x: 1, y: 2, M: M4_I } },
        { who: "fox", say: "(구덩이 속을 들여다보며) 어쩌다 거기 빠지게 된 거야?", card: 6 },
        { who: "rabbit", say: "(위쪽으로 뛰며) 모르겠어. 나 좀 도와줘!", card: 0 }], ok: "② 아래쪽으로 밀기, ④ 오른쪽으로 밀기, ⑦ 시계 방향으로 90°만큼 돌리기, ① 위쪽으로 밀기 카드로 대본을 따라 했어요." }) },
    { name: "우리 모둠 대본 만들기", inst: "토끼는 동물 친구들의 도움으로 구덩이에서 빠져나올 수 있을까요? 종이 인형과 이동 카드를 골라 상황에 어울리는 행동과 대사를 써서 대본을 이어 만들어 보세요.", hints: ["밀기, 뒤집기, 돌리기 카드를 모두 한 번 이상 써요.", "예: 뱀 — ④ 오른쪽으로 밀기 — (여우에게 다가가며) 난 토끼를 도우러 왔어."],
      render: (b, a) => m4Play(b, a, { mode: "build", init: { rabbit: { x: 5, y: 4, M: M4_I }, fox: { x: 1, y: 2, M: M4_I }, dog: { x: 9, y: 2, M: M4_I }, snake: { x: 7, y: 2, M: M4_I } } }) },
    { name: "이동 카드 맞히기", inst: "또 다른 놀이예요. 친구가 뒤집어 놓은 이동 카드 한 장대로 인형을 움직였어요. 어떤 카드인지 맞혀 보세요. 모둠원 모두 같은 쪽(책상 위에서 내려다보는 쪽)에서 봐요.", hints: ["자리가 바뀌었으면 밀기 카드, 자리는 그대로이고 방향이 바뀌었으면 뒤집기나 돌리기 카드예요.", "좌우가 거울처럼 바뀌면 뒤집기, 머리가 다른 쪽을 향하면 돌리기예요."],
      render: (b, a) => m4Play(b, a, { mode: "guess", rounds: 5, init: { rabbit: { x: 5, y: 2, M: M4_I }, fox: { x: 1, y: 2, M: M4_I }, dog: { x: 8, y: 2, M: M4_I } }, ok: "이동 카드를 모두 맞혔어요!" }) },
    { inst: "인형극 놀이를 되돌아봐요.", hints: ["관객마다 보는 쪽이 다르면 왼쪽과 오른쪽이 달라져요."],
      render: (b, a) => quiz(b, a, [
        { q: "인형극을 할 때 이동 방향이 헷갈리지 않게 하려면 어떻게 해야 할까요?", o: ["책상 위에 놓고 위에서 내려다보는 방향으로 맞춰요.", "관객마다 자기가 보는 쪽에서 방향을 정해요."], a: 0 },
        { q: "⑦ 시계 방향으로 90°만큼 돌리기 카드와 결과가 같은 움직임은?", o: ["시계 반대 방향으로 270°만큼 돌리기", "시계 반대 방향으로 90°만큼 돌리기", "오른쪽으로 뒤집기"], a: 0 },
        { q: "⑤ 왼쪽으로 뒤집기 카드와 결과가 같은 움직임은?", o: ["오른쪽으로 뒤집기", "위쪽으로 뒤집기", "시계 방향으로 180°만큼 돌리기"], a: 0, why: { "2": "180°만큼 돌리면 위아래도 바뀌어요. 왼쪽으로 뒤집으면 좌우만 바뀌어요." } }], { ok: "같은 쪽에서 보고, 결과가 같은 카드도 알아볼 수 있어요." }) }
  ],
  challenge: { inst: "더 어려운 카드 맞히기예요. 이번에는 뒤집기와 돌리기 카드만 나와요.", hints: ["시계 방향으로 180°만큼 돌린 것과 시계 반대 방향으로 180°만큼 돌린 것은 결과가 같아요.", "위아래만 바뀌면 위쪽으로 뒤집기, 좌우만 바뀌면 왼쪽으로 뒤집기예요."],
    render: (b, a) => m4Play(b, a, { mode: "guess", rounds: 5, pool: [4, 5, 6, 7, 8, 9], init: { rabbit: { x: 5, y: 2, M: M4_I }, fox: { x: 1, y: 2, M: M4_I }, snake: { x: 8, y: 2, M: M4_I } }, ok: "뒤집기와 돌리기 카드를 모두 구별했어요!" }) }
},
{
  id: "m9", no: 9, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "밀기, 뒤집기, 돌리기를 이용해 여러 가지 문제를 해결할 수 있을까요?",
  summary: "밀기는 위치만 바뀌고, 뒤집기와 돌리기는 방향만 바뀌어요. 세 가지 모두 모양은 변하지 않아요. 돌리기 전 모습은 거꾸로 생각해서 반대 방향으로 돌려 찾아요.",
  steps: [
    { name: "확인 1", inst: "도형을 오른쪽으로 7 cm 밀었을 때의 도형을 그려 보세요. (모눈 한 칸 = 1 cm)", hints: ["모눈 한 칸이 1 cm이니까 오른쪽으로 7칸 옮겨요.", "같은 꼭짓점끼리 7칸을 세어요."],
      render: (b, a) => m4Draw(b, a, { mode: "slide", shape: M4_FLAG, w: 12, h: 4, U: 44, pos: [1, 1], unit: "cm", tasks: [{ op: m4Sl("오른", 7), label: "오른쪽으로 7 cm 밀기" }], ok: "오른쪽으로 7 cm 밀었어요. 위치만 바뀌고 모양은 그대로예요." }) },
    { name: "확인 2", inst: "보기의 도형을 오른쪽으로 뒤집었을 때의 도형을 골라 보세요.", hints: ["오른쪽으로 뒤집으면 왼쪽과 오른쪽이 서로 바뀌어요."],
      render: (b, a) => quiz(b, a, [{ q: "", fig: () => m4Cards([{ pc: M4_QUAD2, label: "보기" }, { pc: M4_QUAD2, M: M4_FLR, label: "가" }, { pc: M4_QUAD2, M: M4_FUD, label: "나" }], { U: 30, maxW: "24em" }), o: ["가", "나"], a: 0, why: { "1": "나는 위쪽과 아래쪽이 바뀐 모양이에요." } }], { ok: "답은 가예요. 왼쪽과 오른쪽이 서로 바뀌었어요." }) },
    { name: "확인 3", inst: "점을 어떻게 밀었는지 알맞은 말을 고르고 수를 써 보세요.", hints: ["● 처음 점에서 ○ 점까지 칸을 세어요."],
      render: (b, a) => m4Point(b, a, { mode: "explain", w: 9, h: 8, U: 46, pts: [{ n: "ㄱ", p: [7, 2], q: [2, 2] }, { n: "ㄴ", p: [4, 6], q: [4, 4] }], ok: "점 ㄱ은 왼쪽으로 5칸, 점 ㄴ은 위쪽으로 2칸 밀었어요." }) },
    { name: "확인 4", inst: "도형을 시계 방향으로 270°만큼 돌렸을 때의 도형을 그려 보세요.", hints: ["시계 방향으로 270°만큼 돌리면 위쪽 부분이 왼쪽으로 가요.", "시계 반대 방향으로 90°만큼 돌린 것과 같아요."],
      render: (b, a) => m4Draw(b, a, { mode: "free", shape: M4_LBIG, U: 38, tasks: [{ op: m4R(true, 270) }], ok: "위쪽 부분이 왼쪽으로 갔어요." }) },
    { name: "확인 5", inst: "세 자리 수가 적힌 투명 카드를 아래쪽으로 뒤집었을 때 나오는 수를 구해 보세요.", hints: ["아래쪽으로 뒤집으면 숫자마다 위쪽과 아래쪽이 바뀌고, 숫자의 차례는 그대로예요.", "디지털 숫자 2를 아래쪽으로 뒤집으면 5처럼 보여요."],
      render: (b, a) => m4Card(b, a, { cards: [820], dir: "아래" }) },
    { name: "확인 6", inst: "무늬 조각으로 규칙적인 무늬를 만들고, 만든 방법을 말해 보세요. 이번 규칙은 ‘시계 방향으로 90°만큼 돌리기’예요.", hints: ["노란 테두리 안 네 칸을 시계 방향으로 한 바퀴 돌며 채워요.", "채운 모양을 오른쪽으로 밀어서 무늬를 넓혀요."],
      render: (b, a) => m4Pattern(b, a, { mode: "rule", rule: m4R(true, 90), cols: 6, rows: 2, U: 66, block: { w: 2, h: 2, order: [[0, 0], [1, 0], [1, 1], [0, 1]] }, ok: "주어진 모양을 시계 방향으로 90°만큼 돌리는 것을 반복해서 모양을 만들고, 그 모양을 오른쪽으로 밀어서 무늬를 만들었어요." }) },
    { name: "확인 7 ★★", inst: "물이 흐르려면 관을 연결해야 해요. 관을 시계 반대 방향으로 90°만큼 돌렸더니 물이 흘렀어요(왼쪽 위 그림). 관을 돌리기 전의 모습을 만들어 보세요.", hints: ["이해해요: 관을 시계 반대 방향으로 90°만큼 돌렸더니 물이 흘렀어요.", "계획해요: 거꾸로 생각해서, 돌린 후의 관을 시계 방향으로 90°만큼 돌리면 돌리기 전 모습이 돼요."],
      render: (b, a) => m4Spin(b, a, { pic: "pipe", mode: "before", after: m4Pow(2), how: m4R(false, 90), start: M4_I,
        deco: g => { g.append(svgEl("rect", { x: 14, y: 236, width: 86, height: 128, rx: 10, fill: "#BFE3F2", stroke: "#4E7FA0", "stroke-width": 4 }), svgEl("rect", { x: 100, y: 281, width: 80, height: 38, fill: "#5E7387" }), txt(57, 300, "물통", 20, { fill: "#1F4E8C" }), svgEl("rect", { x: 281, y: 420, width: 38, height: 90, fill: "#5E7387" }), svgEl("path", { d: "M250 510 h100 l-12 70 h-76 z", fill: "#C8742B" }), svgEl("path", { d: "M300 512 q-30 -40 -14 -70 q16 30 14 70 q14 -36 34 -50 q-6 34 -34 50", fill: "#5DAA4E" })); },
        ask: [{ parts: ["시계 반대 방향으로 90°만큼 돌린 것을 거꾸로 생각하여 ", { o: ["시계 방향", "시계 반대 방향"], a: 0 }, "으로 ", { n: 90 }, "°만큼 돌리면 돌리기 전의 모습을 구할 수 있어요."] }], askTitle: "되돌아봐요.",
        ok: "돌리기 전 모습은 거꾸로 생각해서 시계 방향으로 90°만큼 돌려서 찾았어요." }) }
  ],
  challenge: { inst: "고흐의 그림 「고흐의 방」 퍼즐이에요. 빈 곳에 맞는 조각을 어떻게 움직여야 할지 골라 그림을 완성해 보세요.", hints: ["조각의 위쪽 부분(천장, 벽)이 어디에 있는지 먼저 찾아요.", "위쪽 부분이 아래쪽에 있으면 180°, 오른쪽에 있으면 시계 반대 방향으로 90°만큼 돌려요."],
    render: (b, a) => m4Room(b, a, { pieces: [{ tx: 0, ty: 1, ang: 180 }, { tx: 1, ty: 0, ang: 90 }, { tx: 2, ty: 1, ang: -90 }], ok: "가는 시계 방향으로 180°만큼, 나는 시계 반대 방향으로 90°만큼, 다는 시계 방향으로 90°만큼 돌려서 그림을 완성했어요." }) }
}
];
