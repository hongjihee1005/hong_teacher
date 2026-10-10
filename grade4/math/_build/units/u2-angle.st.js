//@@APP
const APP={title:"우리 반 놀이터 설계단", unit:"4-1 수학 2. 각도", key:"s41-angle-v1", welcome:"우리 반 놀이터 설계단에 온 것을 환영해요", intro:"4학년 2반이 운동장 한쪽에 새 놀이터를 설계해요. 미끄럼틀·그네·시소의 각을 비교하고, 각도기로 재고, 어림하고, 더하고 빼며 설계도를 완성해요."};
//@@UNIT
/* =========================================================
   4-1 2. 각도 — 단원 조작 부품 (앞글자 a2)
   각도는 모두 수학 방향(오른쪽 = 0°, 시계 반대 방향으로 커짐)으로 적고, 화면 좌표(y 아래)로 바꿔 그립니다.
   ========================================================= */
const A2_LINE = "#C9D4CF", A2_OK = "#2E8B57", A2_NO = "#C8472E", A2_SOFT = "#DCEAFB", A2_ORS = "#FDF1E8", A2_GRAY = "#8795A1", A2_PS = "#DDEDE5";
const A2_KO = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "차"];
const A2_COL = ["#E47A38", "#2B7BD6", "#2E8B57", "#8E5BC9"];
const A2_FILL = ["rgba(228,122,56,.28)", "rgba(43,123,214,.24)", "rgba(46,139,87,.26)", "rgba(142,91,201,.24)"];
const a2F = v => Math.round(v * 100) / 100;
const a2Rad = d => d * Math.PI / 180;
const a2N = d => ((d % 360) + 360) % 360;
const a2Pt = (V, deg, r) => [V[0] + r * Math.cos(a2Rad(deg)), V[1] - r * Math.sin(a2Rad(deg))];
const a2Dir = (V, P) => a2N(Math.atan2(-(P[1] - V[1]), P[0] - V[0]) * 180 / Math.PI);
const a2D = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
/* 받침 따라 조사 고르기: a2J("40°", "이", "가") → "가"(도) */
function a2J(s, withB, noB) {
  s = String(s).trim(); const c = s[s.length - 1];
  if (c === "°") return noB;
  if (/[0-9]/.test(c)) return "013678".includes(c) ? withB : noB;
  const k = c.charCodeAt(0) - 0xAC00; if (k < 0 || k > 11171) return withB;
  return k % 28 ? withB : noB;
}
function a2Kind(a) { return a > 0 && a < 90 ? "예각" : a === 90 ? "직각" : a > 90 && a < 180 ? "둔각" : "그 밖의 각"; }
/* 호·부채꼴(수학 방향 d1 → d2, d2 > d1) */
function a2ArcD(V, d1, d2, r) {
  const s = a2Pt(V, d1, r), e = a2Pt(V, d2, r), large = (d2 - d1) > 180 ? 1 : 0;
  return `M${a2F(s[0])},${a2F(s[1])} A${r},${r} 0 ${large} 0 ${a2F(e[0])},${a2F(e[1])}`;
}
function a2WedgeD(V, d1, d2, r) {
  if (d2 - d1 >= 359.99) { const m = a2Pt(V, d1 + 180, r), s = a2Pt(V, d1, r); return `M${a2F(s[0])},${a2F(s[1])} A${r},${r} 0 1 0 ${a2F(m[0])},${a2F(m[1])} A${r},${r} 0 1 0 ${a2F(s[0])},${a2F(s[1])} Z`; }
  return `M${a2F(V[0])},${a2F(V[1])} L` + a2ArcD(V, d1, d2, r).slice(1) + " Z";
}
function a2Line(P, Q, attrs = {}) { return svgEl("line", Object.assign({ x1: a2F(P[0]), y1: a2F(P[1]), x2: a2F(Q[0]), y2: a2F(Q[1]), stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, attrs)); }
function a2RightMark(V, d1, s, attrs = {}) {
  const p1 = a2Pt(V, d1, s), p3 = a2Pt(V, d1 + 90, s), p2 = [p1[0] + p3[0] - V[0], p1[1] + p3[1] - V[1]];
  return svgEl("polyline", Object.assign({ points: [p1, p2, p3].map(p => `${a2F(p[0])},${a2F(p[1])}`).join(" "), fill: "none", stroke: TENT, "stroke-width": 3 }, attrs));
}
/* 각 하나 그리기
   sp: {V, d1, a, L, L2, color, sw, arc(반지름|false), fill(false면 없음), deg(true면 "a°" 글), text(글), names:[ㄱ(둘째 변 끝), ㄴ(꼭짓점), ㄷ(첫째 변 끝)], noRight, dot} */
function a2AngleG(sp) {
  const g = svgEl("g"), V = sp.V, d1 = sp.d1 || 0, a = sp.a, d2 = d1 + a, L1 = sp.L || 200, L2 = sp.L2 || L1, col = sp.color || INK, sw = sp.sw || 5;
  const r = sp.arc != null && sp.arc !== false ? sp.arc : Math.max(22, Math.min(48, Math.min(L1, L2) * .3));
  if (sp.fill !== false && a < 359) g.append(svgEl("path", { d: a2WedgeD(V, d1, d2, r), fill: sp.fill || "rgba(228,122,56,.2)" }));
  if (a === 90 && !sp.noRight) g.append(a2RightMark(V, d1, Math.min(r * .62, 26)));
  else if (sp.arc !== false) g.append(svgEl("path", { d: a2ArcD(V, d1, d2, r), fill: "none", stroke: sp.arcColor || TENT, "stroke-width": 3 }));
  const P1 = a2Pt(V, d1, L1), P2 = a2Pt(V, d2, L2);
  const dsh = { stroke: A2_GRAY, "stroke-width": Math.max(3, sw * .6), "stroke-dasharray": "12 8" };
  g.append(a2Line(V, P1, sp.dash1 ? dsh : { stroke: col, "stroke-width": sw }), a2Line(V, P2, sp.dash2 ? dsh : { stroke: col, "stroke-width": sw }));
  if (sp.dot !== false) g.append(svgEl("circle", { cx: a2F(V[0]), cy: a2F(V[1]), r: sw * .9, fill: col }));
  const fs = sp.fs || 24;
  if (sp.deg || sp.text) { const q = a2Pt(V, d1 + a / 2, r + fs * 1.1); g.append(txt(q[0], q[1], sp.text || `${a}°`, fs, { fill: sp.labelColor || INK })); }
  if (sp.names) {
    const off = fs * 1.05;
    const n2 = a2Pt(P2, d2, off * .8), n1 = a2Pt(P1, d1, off * .8), nv = a2Pt(V, d1 + a / 2 + 180, off);
    if (sp.names[0]) g.append(txt(n2[0], n2[1], sp.names[0], fs));
    if (sp.names[1]) g.append(txt(nv[0], nv[1], sp.names[1], fs));
    if (sp.names[2]) g.append(txt(n1[0], n1[1], sp.names[2], fs));
  }
  return g;
}
/* 각을 상자 안에 알맞게 놓기: 상자 W×H 안에서 꼭짓점 자리와 변 길이를 정함 */
function a2FitAngle(sp, W, H, pad = 18) {
  const d1 = sp.d1 || 0, a = sp.a, k2 = (sp.L2 || sp.L || 1) / (sp.L || 1);
  const pts = [[0, 0], a2Pt([0, 0], d1, 1), a2Pt([0, 0], d1 + a, k2)];
  for (let t = 0; t <= a; t += 10) pts.push(a2Pt([0, 0], d1 + t, .3));
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
  const L = Math.min(sp.maxL || 1e9, (W - 2 * pad) / Math.max(bw, .25), (H - 2 * pad) / Math.max(bh, .25));
  const V = [pad + (W - 2 * pad - bw * L) / 2 - Math.min(...xs) * L, pad + (H - 2 * pad - bh * L) / 2 - Math.min(...ys) * L];
  return Object.assign({}, sp, { V, L, L2: L * k2 });
}
/* 그림 카드 여러 장(가·나·다…) — quiz fig 용 */
function a2Cards(items, opt = {}) {
  const CW = opt.cw || 220, CH = opt.ch || 170, per = opt.per || items.length, rows = Math.ceil(items.length / per);
  const s = makeSvg(per * (CW + 12) + 12, rows * (CH + 12) + 12);
  items.forEach((it, i) => {
    const g = svgEl("g", { transform: `translate(${12 + (i % per) * (CW + 12)},${12 + Math.floor(i / per) * (CH + 12)})` });
    g.append(svgEl("rect", { x: 0, y: 0, width: CW, height: CH, rx: 12, fill: "#fff", stroke: A2_LINE, "stroke-width": 2 }));
    if (it.draw) it.draw(g, CW, CH);
    else g.append(a2AngleG(a2FitAngle(Object.assign({ sw: 5, fs: 22 }, it), CW, CH, it.pad || 26)));
    if (it.label !== false) g.append(txt(18, 18, it.label || A2_KO[i], 22));
    s.append(g);
  });
  s.style.maxWidth = opt.maxW || `${Math.min(46, per * 11)}em`; s.style.width = "100%"; s.style.display = "block"; s.style.margin = ".3em 0";
  return s;
}
/* 그림 한 장 */
function a2Fig(W, H, draw, maxW) {
  const s = makeSvg(W, H); draw(s);
  s.style.maxWidth = maxW || "30em"; s.style.width = "100%"; s.style.display = "block"; s.style.margin = ".3em 0";
  s.style.background = "#FBFCFB"; s.style.border = "2px solid " + A2_LINE; s.style.borderRadius = "12px";
  return s;
}
/* 여러 부분을 차례로: 앞 부분을 해결하면 다음 부분이 열림 */
function a2Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: "a2part" }); body.append(box);
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
/* 다각형: 수학 방향으로 돌며 각 꼭짓점의 각(angles)과 앞 변 길이(lens, n-2개)로 만들고, 상자에 맞춤 */
function a2Poly(angles, lens, W, H, pad = 40, th0 = 0) {
  const n = angles.length, th = [th0];
  for (let k = 1; k < n; k++) th.push(th[k - 1] + 180 - angles[k]);
  const u = th.map(t => [Math.cos(a2Rad(t)), Math.sin(a2Rad(t))]);
  let sx = 0, sy = 0; for (let k = 0; k < n - 2; k++) { sx += lens[k] * u[k][0]; sy += lens[k] * u[k][1]; }
  const a = u[n - 2], b = u[n - 1], det = a[0] * b[1] - a[1] * b[0];
  const La = (-sx * b[1] + sy * b[0]) / det, Lb = (-a[0] * sy + a[1] * sx) / det;
  const L = lens.slice(0, n - 2).concat([La, Lb]);
  const P = [[0, 0]]; for (let k = 0; k < n - 1; k++) P.push([P[k][0] + L[k] * u[k][0], P[k][1] + L[k] * u[k][1]]);
  const S = P.map(p => [p[0], -p[1]]), xs = S.map(p => p[0]), ys = S.map(p => p[1]);
  const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys), sc = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh);
  const ox = (W - bw * sc) / 2 - Math.min(...xs) * sc, oy = (H - bh * sc) / 2 - Math.min(...ys) * sc;
  return { pts: S.map(p => [p[0] * sc + ox, p[1] * sc + oy]), lens: L };
}
/* 다각형 꼭짓점마다 안쪽 각: {V, s(시작 방향), a(크기)} */
function a2Corners(pts) {
  const n = pts.length;
  return pts.map((V, i) => {
    const P = pts[(i - 1 + n) % n], Q = pts[(i + 1) % n], dp = a2Dir(V, P), dq = a2Dir(V, Q);
    const u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]];
    const a = Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))))) * 180 / Math.PI;
    const s = Math.abs(a2N(dq - dp) - a) < .5 ? dp : dq;
    return { V, s, a };
  });
}
/* 합이 total이 되게 반올림(가장 큰 나머지 방식) */
function a2Round(vals, total) {
  const fl = vals.map(Math.floor); let rest = total - fl.reduce((s, v) => s + v, 0);
  vals.map((v, i) => [v - Math.floor(v), i]).sort((x, y) => y[0] - x[0]).forEach(([, i]) => { if (rest > 0) { fl[i]++; rest--; } });
  return fl;
}
/* 다각형 꼭짓점들을 각도 재기 항목으로 */
function a2PolyItems(pts, angles, extra = {}) {
  const n = pts.length;
  return a2Corners(pts).map((c, i) => {
    const P = pts[(i - 1 + n) % n], Q = pts[(i + 1) % n], dP = Math.abs(a2N(a2Dir(c.V, P) - c.s + 180) - 180) < .5;
    return Object.assign({ V: c.V, d1: c.s, a: angles[i], L: a2D(c.V, dP ? P : Q), L2: a2D(c.V, dP ? Q : P), ext: true }, extra);
  });
}
/* 다각형 그리기 + 각 표시(값 글) */
function a2PolyG(pts, opt = {}) {
  const g = svgEl("g");
  g.append(svgEl("polygon", { points: pts.map(p => `${a2F(p[0])},${a2F(p[1])}`).join(" "), fill: opt.fill || "#fff", stroke: INK, "stroke-width": opt.sw || 4, "stroke-linejoin": "round" }));
  const cs = a2Corners(pts);
  (opt.marks || []).forEach((m, i) => {
    if (m == null || m === false) return;
    const c = cs[i], r = opt.r || 34;
    if (m === "R") { g.append(a2RightMark(c.V, c.s, 20)); return; }
    g.append(svgEl("path", { d: a2ArcD(c.V, c.s, c.s + c.a, r), fill: "none", stroke: opt.arcCol || TENT, "stroke-width": 3 }));
    const lr = r + (opt.fs || 22) * (c.a < 50 ? 1.6 : 1.05), q = a2Pt(c.V, c.s + c.a / 2, lr);
    g.append(txt(q[0], q[1], String(m), opt.fs || 22));
  });
  return g;
}

/* =========================================================
   1. 각도기 — 각도기를 끌어 옮기고 손잡이로 돌려 각에 맞추고 눈금을 읽는다
   안쪽 눈금(파랑)은 오른쪽 0에서, 바깥쪽 눈금(검정)은 왼쪽 0에서 시작
   ========================================================= */
const A2_PR = 210;
function a2ProtG(R = A2_PR, opt = {}) {
  const g = svgEl("g");
  g.append(svgEl("path", { d: `M${-R},0 A${R},${R} 0 0 1 ${R},0 L${R},18 L${-R},18 Z`, fill: "rgba(170,210,245,.42)", stroke: "#1D4E80", "stroke-width": 2 }));
  g.append(svgEl("path", { d: `M${-R * .36},0 A${R * .36},${R * .36} 0 0 1 ${R * .36},0`, fill: "rgba(255,255,255,.35)", stroke: "#1D4E80", "stroke-width": 1.2 }));
  const ring = R - 62;
  for (let t = 0; t <= 180; t++) {
    const len = t % 10 === 0 ? 17 : t % 5 === 0 ? 11 : 6, p1 = a2Pt([0, 0], t, R), p2 = a2Pt([0, 0], t, R - len);
    g.append(a2Line(p1, p2, { stroke: "#1D4E80", "stroke-width": t % 10 === 0 ? 1.6 : 1, "stroke-linecap": "butt" }));
    if (t % 5 === 0) { const q1 = a2Pt([0, 0], t, ring), q2 = a2Pt([0, 0], t, ring - (t % 10 === 0 ? 9 : 5)); g.append(a2Line(q1, q2, { stroke: "#1D4E80", "stroke-width": 1, "stroke-linecap": "butt" })); }
  }
  g.append(svgEl("path", { d: `M${-ring},0 A${ring},${ring} 0 0 1 ${ring},0`, fill: "none", stroke: "#1D4E80", "stroke-width": 1 }));
  const fs = Math.round(R * .072);
  for (let t = 0; t <= 180; t += 10) {
    const tl = Math.max(3.5, Math.min(176.5, t));
    const po = a2Pt([0, 0], tl, R - 29), pi = a2Pt([0, 0], tl, R - 47);
    const to = txt(po[0], po[1], String(180 - t), fs, { transform: `rotate(${90 - t} ${a2F(po[0])} ${a2F(po[1])})`, fill: "#1D2A2A" });
    const ti = txt(pi[0], pi[1], String(t), fs * .9, { transform: `rotate(${90 - t} ${a2F(pi[0])} ${a2F(pi[1])})`, fill: BLUE });
    g.append(to, ti);
  }
  g.append(a2Line([-R + 2, 0], [R - 2, 0], { stroke: "#1D4E80", "stroke-width": 2, "stroke-linecap": "butt" }));
  g.append(svgEl("circle", { cx: 0, cy: 0, r: 5, fill: "#fff", stroke: "#C8472E", "stroke-width": 2.5 }), a2Line([0, -12], [0, 6], { stroke: "#C8472E", "stroke-width": 2 }));
  if (opt.knob !== false) {
    g.append(a2Line([0, -R], [0, -R - 14], { stroke: "#1D4E80", "stroke-width": 2 }));
    g.append(svgEl("circle", { cx: 0, cy: -R - 26, r: 15, fill: TENT, stroke: "#fff", "stroke-width": 3 }));
    g.append(txt(0, -R - 25, "↻", 20, { fill: "#fff" }));
  }
  return g;
}
/* 각도기가 놓인 그림(정적) — quiz 그림·잘못 잰 예 */
function a2ProtFig(sp, opt = {}) {
  const W = opt.W || 560, H = opt.H || 330;
  return a2Fig(W, H, s => {
    const V = opt.V || [W / 2, H - 50];
    s.append(a2AngleG(Object.assign({ V, L: 250, sw: 5, arc: false, fill: false }, sp)));
    const C = opt.C || V, rot = opt.rot != null ? opt.rot : sp.d1 || 0;
    const pg = a2ProtG(A2_PR, { knob: false }); pg.setAttribute("transform", `translate(${a2F(C[0])},${a2F(C[1])}) rotate(${a2F(-rot)})`); s.append(pg);
    if (opt.extra) opt.extra(s, V);
  }, opt.maxW || "20em");
}
function a2ClockAngle(hh, mm) { const hA = (hh % 12) * 30 + mm * .5, mA = mm * 6, d = Math.abs(hA - mA) % 360; return Math.min(d, 360 - d); }
function a2ClockFace(g, O, R, hh, mm, opt = {}) {
  g.append(svgEl("circle", { cx: O[0], cy: O[1], r: R, fill: "#fff", stroke: INK, "stroke-width": 5 }));
  for (let i = 0; i < 60; i++) { const a = 90 - i * 6, p1 = a2Pt(O, a, R - 6), p2 = a2Pt(O, a, R - (i % 5 ? 13 : 22)); g.append(a2Line(p1, p2, { "stroke-width": i % 5 ? 2 : 4, "stroke-linecap": "butt" })); }
  for (let i = 1; i <= 12; i++) { const q = a2Pt(O, 90 - i * 30, R - 44); g.append(txt(q[0], q[1], String(i), R * .15)); }
  const hA = 90 - ((hh % 12) * 30 + mm * .5), mA = 90 - mm * 6;
  const d = a2N(hA - mA), s = d <= 180 ? mA : hA, e = d <= 180 ? d : 360 - d;
  if (e > .1 && opt.wedge !== false) g.append(svgEl("path", { d: a2WedgeD(O, s, s + e, R * .42), fill: "rgba(228,122,56,.35)", stroke: TENT, "stroke-width": 2 }));
  g.append(a2Line(O, a2Pt(O, mA, R * .78), { stroke: BLUE, "stroke-width": 8 }), a2Line(O, a2Pt(O, hA, R * .52), { stroke: INK, "stroke-width": 12 }), svgEl("circle", { cx: O[0], cy: O[1], r: 9, fill: INK }));
}
function a2Walk(start, dir, moves) { let p = start.slice(), d = dir; const pts = [p.slice()]; moves.forEach(([turn, dist]) => { d += turn; p = a2Pt(p, d, dist); pts.push(p.slice()); }); return pts; }
function a2TurtleMap(svg, map) {
  const U = map.U, g = svgEl("g");
  g.append(svgEl("rect", { x: 0, y: 0, width: map.w * U, height: map.h * U, fill: "#EEF6E6" }));
  const gr = svgEl("g", { stroke: "#DCE8D2", "stroke-width": 1 }); for (let x = 0; x <= map.w; x++) gr.append(svgEl("line", { x1: x * U, y1: 0, x2: x * U, y2: map.h * U })); for (let y = 0; y <= map.h; y++) gr.append(svgEl("line", { x1: 0, y1: y * U, x2: map.w * U, y2: y * U })); g.append(gr);
  (map.deco || []).forEach(d => { if (d.oval) g.append(svgEl("ellipse", { cx: d.oval[0] * U, cy: d.oval[1] * U, rx: d.oval[2] * U, ry: d.oval[3] * U, fill: "#E9B98A", stroke: "#C98E5A", "stroke-width": 3 }), txt(d.oval[0] * U, d.oval[1] * U, d.n, 20)); if (d.tree) d.tree.forEach(t => g.append(svgEl("circle", { cx: t[0] * U, cy: t[1] * U, r: .35 * U, fill: "#8CC084", stroke: "#5E9A55", "stroke-width": 2 }))); });
  map.roads.forEach(r => g.append(svgEl("polyline", { points: r.map(p => `${a2F(p[0] * U)},${a2F(p[1] * U)}`).join(" "), fill: "none", stroke: "#D9D2C3", "stroke-width": .55 * U, "stroke-linecap": "round", "stroke-linejoin": "round" })));
  map.roads.forEach(r => g.append(svgEl("polyline", { points: r.map(p => `${a2F(p[0] * U)},${a2F(p[1] * U)}`).join(" "), fill: "none", stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "6 6" })));
  map.places.forEach(pl => { const [bw, bh] = pl.box || [2.2, 1], x = pl.at[0] - bw / 2, y = pl.at[1] - bh / 2;
    g.append(svgEl("rect", { x: x * U, y: y * U, width: bw * U, height: bh * U, rx: 8, fill: pl.fill || "#FFF6D9", stroke: "#9C8A62", "stroke-width": 2 }), txt(pl.at[0] * U, pl.at[1] * U, pl.n, Math.min(20, U * .45))); });
  svg.append(g);
}
function a2TurtleShape(g, P, dir, U) {
  const t = svgEl("g", { transform: `translate(${a2F(P[0])},${a2F(P[1])}) rotate(${a2F(-dir)})` });
  t.append(svgEl("ellipse", { cx: 0, cy: 0, rx: U * .42, ry: U * .32, fill: "#5FAE6E", stroke: "#2F6B57", "stroke-width": 2 }), svgEl("circle", { cx: U * .5, cy: 0, r: U * .15, fill: "#7CC48A", stroke: "#2F6B57", "stroke-width": 2 }));
  g.append(t);
}
/* =========================================================
   11. 각을 그려 도착 변까지! — 점판에서 예각·둔각을 이어 그린다 (10차시)
   opt: {seq:["예각","둔각"] (연습), game:true, ok}
   ========================================================= */
function a2Dice(body, api, opt) {
  const GW = 13, GH = 10, U = 54, svg = makeSvg(GW * U, GH * U), g = svgEl("g"); svg.append(g);
  const startA = [1, 1], startB = [1, 3], finA = [12, 6], finB = [12, 9];
  let path = [startA, startB], need = null, turns = 0, done = false, die = null, k = 0;
  const kindOf = (P, Q, N) => { const u = [Q[0] - P[0], Q[1] - P[1]], v = [N[0] - P[0], N[1] - P[1]], cr = u[0] * v[1] - u[1] * v[0], dt = u[0] * v[0] + u[1] * v[1]; if (cr === 0) return dt > 0 ? "0°" : "180°"; return dt > 0 ? "예각" : dt < 0 ? "둔각" : "직각"; };
  const angOf = (P, Q, N) => { const a = Math.abs(a2N(a2Dir(P, Q) - a2Dir(P, N))); return Math.round(Math.min(a, 360 - a)); };
  const hitFin = (P, N) => { if (Math.min(P[0], N[0]) > 12 || Math.max(P[0], N[0]) < 12) return false; if (P[0] === N[0]) return P[0] === 12 && Math.max(P[1], N[1]) >= 6 && Math.min(P[1], N[1]) <= 9; const y = P[1] + (N[1] - P[1]) * (12 - P[0]) / (N[0] - P[0]); return y >= 6 - 1e-9 && y <= 9 + 1e-9; };
  const draw = () => {
    g.innerHTML = "";
    for (let x = 1; x < GW; x++) for (let y = 1; y < GH; y++) g.append(svgEl("circle", { cx: x * U, cy: y * U, r: 4, fill: "#9AA6A0" }));
    g.append(a2Line([startA[0] * U, startA[1] * U], [startB[0] * U, startB[1] * U], { stroke: "#C8472E", "stroke-width": 7 }), txt(startA[0] * U + 36, startA[1] * U - 14, "출발 변", 18, { fill: "#C8472E" }));
    g.append(a2Line([finA[0] * U, finA[1] * U], [finB[0] * U, finB[1] * U], { stroke: "#C8472E", "stroke-width": 7 }), txt(finA[0] * U - 10, finA[1] * U - 22, "도착 변", 18, { fill: "#C8472E" }));
    for (let i = 2; i < path.length; i++) {
      const P = path[i - 1], Q = path[i - 2], N = path[i], Ps = [P[0] * U, P[1] * U];
      g.append(a2Line(Ps, [N[0] * U, N[1] * U], { stroke: BLUE, "stroke-width": 5 }));
      const d1 = a2Dir(Ps, [Q[0] * U, Q[1] * U]), d2 = a2Dir(Ps, [N[0] * U, N[1] * U]); let lo = d1, a = a2N(d2 - d1); if (a > 180) { lo = d2; a = 360 - a; }
      g.append(svgEl("path", { d: a2ArcD(Ps, lo, lo + a, 18), fill: "none", stroke: TENT, "stroke-width": 3 }));
    }
    const cur = path[path.length - 1];
    g.append(svgEl("circle", { cx: cur[0] * U, cy: cur[1] * U, r: 3 * U, fill: "rgba(43,123,214,.06)", stroke: BLUE, "stroke-width": 1.5, "stroke-dasharray": "6 6" }));
    g.append(svgEl("circle", { cx: cur[0] * U, cy: cur[1] * U, r: 9, fill: TENT }));
  };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" }), dieEl = h("div", { class: "readout" });
  const setNeed = () => { if (opt.seq) { need = opt.seq[k]; dieEl.textContent = `그릴 각: ${need}`; } else { dieEl.textContent = die ? `주사위 ${die} → ${need}` : "주사위를 굴려요"; } };
  svg.addEventListener("click", e => {
    if (done) return; if (!need) return api.hint("먼저 주사위를 굴려요.");
    const p = svgPt(svg, e), N = [Math.round(p.x / U), Math.round(p.y / U)];
    if (N[0] < 1 || N[0] > GW - 1 || N[1] < 1 || N[1] > GH - 1 || a2D([N[0] * U, N[1] * U], [p.x, p.y]) > U * .4) return;
    const P = path[path.length - 1], Q = path[path.length - 2], len = Math.hypot(N[0] - P[0], N[1] - P[1]);
    if (len === 0) return;
    if (len > 3 + 1e-9) { out.textContent = `새 변이 ${Math.round(len * 10) / 10} cm쯤이에요. 3 cm와 같거나 짧게 그려요.`; return; }
    const kd = kindOf(P, Q, N);
    if (kd !== need) { api.tryOnce(); out.textContent = `그 점을 이으면 ${kd === "직각" ? "직각이에요" : kd === "180°" ? "두 변이 일직선이 되어 예각도 둔각도 아니에요" : kd === "0°" ? "앞의 변과 겹쳐서 각이 생기지 않아요" : kd + "(약 " + angOf(P, Q, N) + "°)이에요"}. ${need}${a2J(need, "을", "를")} 그려야 해요.`; return; }
    path.push(N); turns++; out.textContent = `${need}(약 ${angOf(P, Q, N)}°)을 그렸어요.`; draw();
    if (opt.seq) { k++; if (k >= opt.seq.length) { done = true; return api.done(opt.seq.join("→"), opt.ok || "예각과 둔각을 알맞게 그렸어요!"); } setNeed(); return; }
    if (hitFin(P, N)) { done = true; out.textContent = `도착 변에 닿았어요! ${turns}번 만에 도착했어요.`; return api.done(`${turns}번 만에 도착`, `도착 변에 닿았어요! ${turns}번 만에 도착했어요.`); }
    need = null; die = null; setNeed();
  });
  const roll = h("button", { onclick: () => { if (done) return; if (need && !opt.seq) return api.hint("나온 각을 먼저 그려요. 그릴 수 없으면 ‘이번 차례 넘기기’를 눌러요."); die = 1 + Math.floor(Math.random() * 6); need = die % 2 ? "예각" : "둔각"; setNeed(); } }, "🎲 주사위 굴리기");
  const skip = h("button", { onclick: () => { if (done || !need) return; turns++; need = null; die = null; setNeed(); out.textContent = "이번 차례를 넘겼어요. 다시 굴려요."; } }, "이번 차례 넘기기");
  const reset = h("button", { onclick: () => { path = [startA, startB]; turns = 0; k = 0; done = false; need = null; die = null; if (opt.seq) need = opt.seq[0]; setNeed(); draw(); out.textContent = "처음부터 다시 해요."; } }, "처음부터");
  api.provide({ words: ["1·3·5 예각", "2·4·6 둔각", "3 cm"], answers: [] });
  if (opt.seq) need = opt.seq[0];
  setNeed(); draw();
  out.textContent = opt.seq ? "주황 점이 꼭짓점이에요. 파란 점선 원 안의 점을 눌러 새 변을 그어요." : "주사위를 굴리고, 주황 점에서 3 cm 안의 점을 눌러 각을 그려요.";
  body.append(stageWrap(svg, h("div", { class: "side" }, dieEl, opt.seq ? null : h("div", { class: "tools" }, roll, skip), out, h("p", { class: "inst", style: "margin:.2em 0" }, "앞에 그린 변(처음에는 출발 변)과 새 변이 이루는 각을 그려요. 점과 점 사이는 1 cm예요."), h("div", { class: "tools" }, reset))));
}

/* =========================================================
   12. 빨대 튕기기 (10차시 또 다른 놀이) — 외친 각과 빨대가 이룬 각이 같은지 판단
   ========================================================= */
function a2Flick(body, api, opt = {}) {
  const W = 640, H = 380, V = [320, 330], L = 260, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const rounds = opt.rounds || 5;
  let r = 0, call = null, ang = 150, spun = false, score = 0;
  const draw = () => { g.innerHTML = "";
    g.append(a2Line([V[0] - 290, V[1]], [V[0] + 290, V[1]], { stroke: BLUE, "stroke-width": 6 }));
    g.append(svgEl("path", { d: a2ArcD(V, 0, ang, 52), fill: "none", stroke: TENT, "stroke-width": 3 }));
    g.append(a2Line(V, a2Pt(V, ang, L), { stroke: "#E4B33C", "stroke-width": 12 }), svgEl("circle", { cx: V[0], cy: V[1], r: 10, fill: "#C8472E" }));
  };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" }), sc = h("div", { class: "jua" });
  const upd = () => { sc.textContent = `${r}/${rounds}판 · 점수 ${score}점`; };
  const rollB = h("button", { onclick: () => { if (r >= rounds) return; const d = 1 + Math.floor(Math.random() * 6); call = d % 2 ? "예각" : "둔각"; spun = false; out.textContent = `주사위 ${d}! “${call}!”이라고 외쳐요. 이제 빨대를 튕겨요.`; } }, "🎲 주사위 굴리기");
  const flickB = h("button", { onclick: () => {
    if (!call) return api.hint("먼저 주사위를 굴려 외칠 각을 정해요."); if (spun) return api.hint("이번 판은 이미 튕겼어요. 맞는지 판단해요.");
    let tgt; do { tgt = 8 + Math.floor(Math.random() * 165); } while (Math.abs(tgt - 90) < 6);
    const from = ang, t0 = performance.now(), turnsA = 360 * 2;
    const step = now => { const t = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - t, 3); ang = a2N(from + (turnsA + tgt - from) * e); if (ang > 180) ang = 360 - ang; draw(); if (t < 1) requestAnimationFrame(step); else { ang = tgt; draw(); spun = true; out.textContent = `빨대가 멈췄어요. 파란 선과 빨대가 이루는 각이 “${call}”인가요?`; } };
    requestAnimationFrame(step);
  } }, "빨대 튕기기");
  const judge = yes => {
    if (!spun) return api.hint("빨대를 튕긴 다음 판단해요.");
    api.tryOnce(); const real = a2Kind(ang), right = (real === call) === yes;
    if (!right) return api.fail(`빨대가 이룬 각은 ${ang}°로 ${real}이에요. 직각보다 작은지 큰지 다시 봐요.`, `${call} ${yes ? "맞음" : "아님"}`);
    if (real === call) score++; r++; upd(); call = null; spun = false;
    out.textContent = `○ 맞게 판단했어요. 빨대가 이룬 각은 ${real}(${ang}°)!`;
    if (r >= rounds) api.done(`${rounds}판 ${score}점`, `${rounds}판을 모두 했어요. 점수는 ${score}점! 예각과 둔각을 잘 가려냈어요.`);
  };
  body.append(stageWrap(svg, h("div", { class: "side" }, sc, h("div", { class: "tools" }, rollB, flickB), out, h("div", { class: "opts" }, h("button", { class: "opt", onclick: () => judge(true) }, "외친 각이 맞아요 (1점)"), h("button", { class: "opt", onclick: () => judge(false) }, "외친 각이 아니에요 (0점)")))));
  api.provide({ words: ["예각", "둔각", "직각"], answers: [] });
  draw(); upd(); out.textContent = "주사위를 굴려 1·3·5면 ‘예각’, 2·4·6이면 ‘둔각’을 외쳐요.";
}

/* 다각형 그림(각 표시): marks에 "35°"·"□"·"㉠"·"R"(직각) */
function a2PolyFig(angles, lens, marks, opt = {}) {
  const W = opt.W || 560, H = opt.H || 360;
  return a2Fig(W, H, s => { const pts = a2Poly(angles, lens, W, H, opt.pad || 56).pts; s.append(a2PolyG(pts, { marks, fs: 22, r: 30 })); if (opt.extra) opt.extra(s, pts); }, opt.maxW || "24em");
}
/* 여러 그림을 나란히 */
function a2Row(...els) { const d = h("div", { style: `display:grid;grid-template-columns:repeat(${els.length},minmax(0,1fr));gap:.5em;max-width:46em` }); els.forEach(e => { e.style.maxWidth = "100%"; d.append(e); }); return d; }

/* =========================================================
   이야기 버전 부품 (앞글자 a2s) — '확인하기' 단추 없이 autoRun으로 저절로 확인
   수 입력 900ms · 보기 고르기 260ms · 끌기·돌리기 1200ms 기다림
   ========================================================= */
function a2sEnter(inp) { inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } }); }
function a2sIn(label, w) { const i = h("input", { type: "number", inputmode: "numeric", style: `width:${w || 5.5}em;font-size:1.2em`, "aria-label": label }); a2sEnter(i); return i; }
function a2sOnType(inp, f) { inp.addEventListener("input", f); inp.addEventListener("change", f); }

/* 1. 각도기로 재기 — 잰 각도를 쓰면 저절로 확인 (est: 먼저 어림) */
function a2sMeasure(body, api, opt) {
  const W = opt.W || 800, H = opt.H || 600, R = A2_PR, items = opt.items;
  items.forEach(I => { if (!I.V) I.V = [W / 2, H * .54]; });
  const svg = makeSvg(W, H), back = svgEl("g"), angG = svgEl("g"), refG = svgEl("g"), protG = a2ProtG(R);
  svg.append(back, angG, refG, protG);
  let k = 0, C = [W - R - 30, H - 40], rot = 0, extended = false, phase = "measure", est = null;
  const results = [];
  const it = () => items[k];
  const posEl = h("div", { class: "jua" });
  const inp = a2sIn("각도"), estInp = a2sIn("어림한 각도");
  const askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const measRow = h("div", { class: "qitem" }, h("span", { class: "jua" }, "잰 각도: "), inp, h("span", {}, " °"));
  const refs = new Set();
  const refBtns = [30, 45, 60, 90].map(d => h("button", { onclick: e => { refs.has(d) ? refs.delete(d) : refs.add(d); e.currentTarget.classList.toggle("on"); drawRefs(); } }, `${d}°`));
  const estRow = h("div", {}, h("p", { class: "inst", style: "margin:.2em 0" }, "삼각자의 각(30°, 45°, 60°, 90°)을 대 보며 어림해요."), h("div", { class: "tools" }, h("span", {}, "대 보기:"), refBtns),
    h("div", { class: "qitem" }, h("span", { class: "jua" }, "어림한 각도: 약 "), estInp, h("span", {}, " °")),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      const v = Number(estInp.value);
      if (!estInp.value || !(v > 0 && v <= 180)) return api.hint("어림한 각도를 0보다 크고 180보다 작거나 같은 수로 써 봐요.");
      est = v; phase = "measure"; refs.clear(); refBtns.forEach(b => b.classList.remove("on")); draw();
      api.hint(`약 ${v}°로 어림했어요. 이제 각도기를 각에 맞추어 재어 확인해요.`);
    } }, "어림했어요")));
  const drawRefs = () => {
    refG.innerHTML = ""; const I = it();
    [...refs].forEach(d => {
      const r = Math.min(170, (I.L || 240) * .8);
      refG.append(svgEl("path", { d: a2WedgeD(I.V, I.d1, I.d1 + d, r), fill: "rgba(43,123,214,.13)", stroke: BLUE, "stroke-width": 2, "stroke-dasharray": "8 6" }));
      const q = a2Pt(I.V, I.d1 + d, r + 22); refG.append(txt(q[0], q[1], `${d}°`, 20, { fill: BLUE }));
    });
  };
  const near = (x, y) => Math.abs(a2N(x - y + 180) - 180);
  const status = () => {
    const I = it(), cOk = a2D(C, I.V) < 2, d2 = I.d1 + I.a;
    const base = near(rot, I.d1) < .6 || near(rot, d2 - 180) < .6, flip = near(rot, I.d1 + 180) < .6 || near(rot, d2) < .6;
    return { cOk, base, flip };
  };
  const statusText = () => { const s = status(); return `중심 ${s.cOk ? "✓ 꼭짓점에 맞음" : "✗"} · 밑금 ${s.base ? "✓ 한 변에 맞음" : s.flip ? "△ 각이 각도기 밖에 있어요" : "✗"}`; };
  const placeProt = () => { protG.setAttribute("transform", `translate(${a2F(C[0])},${a2F(C[1])}) rotate(${a2F(-rot)})`); protG.style.display = phase === "est" ? "none" : ""; posEl.textContent = statusText(); };
  const extBtn = h("button", { onclick: () => { extended = true; draw(); api.hint("자로 변을 곧게 늘였어요. 각의 크기는 변의 길이와 상관없어요."); } }, "자로 변 늘이기");
  const turn = d => { rot = a2N(rot + d); snap(); placeProt(); };
  const tools = h("div", { class: "tools" },
    h("button", { onclick: () => turn(10) }, "⟲ 10°"), h("button", { onclick: () => turn(-10) }, "⟳ 10°"),
    h("button", { onclick: () => turn(1) }, "⟲ 1°"), h("button", { onclick: () => turn(-1) }, "⟳ 1°"),
    h("button", { onclick: () => turn(180) }, "반 바퀴"), extBtn);
  const tipEl = h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || "각도기 가운데를 끌면 옮겨지고, 눈금이 있는 가장자리나 주황 손잡이(↻)를 끌면 돌아가요. 가까이 가면 꼭짓점과 변에 착 붙어요. 각도를 쓰면 저절로 확인해요.");
  const draw = () => {
    const I = it(); back.innerHTML = ""; angG.innerHTML = "";
    if (I.deco) I.deco(back);
    const L1 = I.short ? 110 : (I.L || 250), L2 = I.short ? 110 : (I.L2 || I.L || 250);
    if (I.ext || (I.short && extended)) [I.d1, I.d1 + I.a].forEach(d => angG.append(a2Line(I.V, a2Pt(I.V, d, 262), { stroke: A2_GRAY, "stroke-width": 2.5, "stroke-dasharray": "10 7" })));
    angG.append(a2AngleG({ V: I.V, d1: I.d1, a: I.a, L: L1, L2, sw: 5, names: I.names, arc: 30, noRight: true, fill: I.fillAng, dash1: I.dash1, dash2: I.dash2, color: I.color }));
    askEl.textContent = (items.length > 1 ? `(${k + 1}/${items.length}) ` : "") + (I.ask || "각도기로 각도를 재어 보세요.");
    estRow.style.display = phase === "est" ? "" : "none";
    [measRow, tools, posEl, tipEl].forEach(e => { e.style.display = phase === "est" ? "none" : ""; });
    extBtn.style.display = I.short && !extended ? "" : "none";
    drawRefs(); placeProt();
  };
  const startItem = () => {
    const I = it(); extended = false; est = null; inp.value = ""; estInp.value = ""; refs.clear(); refBtns.forEach(b => b.classList.remove("on"));
    phase = I.est ? "est" : "measure";
    if (I.placed) { C = I.V.slice(); rot = I.d1; } else { C = I.start ? I.start.slice() : [W - R - 30, H - 40]; rot = I.startRot || 0; }
    draw();
  };
  const local = p => { const dx = p.x - C[0], dy = p.y - C[1], r = a2Rad(rot); return [dx * Math.cos(r) - dy * Math.sin(r), dx * Math.sin(r) + dy * Math.cos(r)]; };
  let dr = null;
  dragOn(svg, p => {
    if (phase === "est") return false;
    const l = local(p), ang0 = Math.atan2(-(p.y - C[1]), p.x - C[0]) * 180 / Math.PI;
    if (Math.hypot(l[0], l[1] + R + 26) < 30) { dr = { mode: "rot", a0: ang0, r0: rot }; return true; }
    const dd = Math.hypot(l[0], l[1]);
    if (l[1] <= 20 && l[1] >= -R - 4 && dd <= R + 4) { dr = dd >= R - 34 && l[1] < -8 ? { mode: "rot", a0: ang0, r0: rot } : { mode: "move", off: [p.x - C[0], p.y - C[1]] }; return true; }
    return false;
  }, p => {
    if (!dr) return;
    if (dr.mode === "move") C = [Math.max(0, Math.min(W, p.x - dr.off[0])), Math.max(0, Math.min(H, p.y - dr.off[1]))];
    else { const ang = Math.atan2(-(p.y - C[1]), p.x - C[0]) * 180 / Math.PI; rot = a2N(dr.r0 + ang - dr.a0); }
    placeProt();
  }, () => { if (!dr) return; dr = null; snap(); placeProt(); });
  const snap = () => {
    const I = it();
    if (a2D(C, I.V) < 22) C = I.V.slice();
    for (const b of [I.d1, I.d1 + 180, I.d1 + I.a, I.d1 + I.a + 180]) if (near(rot, b) < 5) { rot = a2N(b); break; }
  };
  api.provide({ words: ["중심", "꼭짓점", "밑금", "0", "안쪽 눈금", "바깥쪽 눈금"], answers: [items.map(I => `${I.a}°`).join(", ")] });
  const judge = () => {
    const I = it(); api.tryOnce();
    const v = Number(inp.value), s = status(), ans = `${v}°`;
    if (v === I.a) {
      results.push(I.est ? `어림 약 ${est}° → ${I.a}°` : `${I.a}°`);
      if (k < items.length - 1) {
        api.hint(`○ ${I.a}°가 맞아요!${I.est ? ` (어림 약 ${est}°, 차이 ${Math.abs(est - I.a)}°)` : ""} 다음 각도 재어 봐요.`);
        k++; startItem(); return false;
      }
      api.done(results.join(", "), opt.ok || `모두 바르게 쟀어요! ${results.join(", ")}`); return true;
    }
    let why;
    if (v === 180 - I.a && I.a !== 90) why = `${v}°는 다른 쪽 눈금을 읽은 거예요. 한 변이 0에 맞춰진 쪽 눈금을 읽어요. 이 각은 직각보다 ${I.a < 90 ? "작으니 90보다 작은" : "크니 90보다 큰"} 수를 읽어야 해요.`;
    else if (!s.cOk) why = "각도기의 중심(빨간 점)을 각의 꼭짓점에 꼭 맞추어 다시 재어 봐요.";
    else if (!s.base) why = s.flip ? "각도기를 반 바퀴 돌려 각이 각도기 안쪽에 들어오게 하고, 밑금을 한 변에 맞춰요." : "각도기의 밑금을 각의 한 변에 맞추어 다시 재어 봐요.";
    else why = "눈금을 다시 읽어 봐요. 큰 눈금은 10°, 중간 눈금은 5°, 작은 눈금은 1°씩이에요.";
    api.fail(why, ans); return false;
  };
  const auto = autoRun(() => phase === "measure" && String(inp.value).trim() !== "", () => k + ":" + inp.value, judge, 900);
  a2sOnType(inp, auto);
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, tipEl, posEl, tools, estRow, measRow)));
  startItem();
}

/* 2. 각 만들기 — 주황 손잡이를 끌어 놓으면 저절로 확인 (opt는 a2Maker와 같음) */
function a2sMaker(body, api, opt) {
  const W = opt.W || 760, H = opt.H || 480, V = opt.V || [W / 2, H - 60], d1 = opt.d1 || 0, L = opt.L || 260, sn = opt.snap || 1;
  const svg = makeSvg(W, H), back = svgEl("g"), g = svgEl("g"), top = svgEl("g");
  svg.append(back, g, top);
  let k = 0, ang = opt.start != null ? opt.start : 30, revealed = false, showProt = !!opt.prot;
  const it = () => opt.items[k];
  const out = h("div", { class: "readout" }), askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const draw = () => {
    g.innerHTML = ""; top.innerHTML = ""; back.innerHTML = "";
    if (opt.deco) opt.deco(back);
    if (showProt) { const pg = a2ProtG(A2_PR, { knob: false }); pg.setAttribute("transform", `translate(${V[0]},${V[1]}) rotate(${-d1})`); pg.style.opacity = .9; back.append(pg); }
    if (opt.guide90) back.append(svgEl("path", { d: a2WedgeD(V, d1, d1 + 90, 90), fill: "rgba(43,123,214,.1)", stroke: BLUE, "stroke-width": 2, "stroke-dasharray": "7 6" }), txt(...a2Pt(V, d1 + 45, 110), "직각", 18, { fill: BLUE }));
    if (opt.skin === "slide") {
      const P = a2Pt(V, d1 + ang, L);
      back.append(svgEl("rect", { x: 0, y: V[1], width: W, height: H - V[1], fill: "#D8EBC8" }));
      g.append(a2Line(P, [P[0], V[1]], { stroke: "#8795A1", "stroke-width": 8 }));
      g.append(a2Line(V, P, { stroke: "#E47A38", "stroke-width": 14 }));
      g.append(svgEl("path", { d: a2ArcD(V, d1, d1 + ang, 70), fill: "none", stroke: BLUE, "stroke-width": 3 }));
    } else g.append(a2AngleG({ V, d1, a: ang, L, sw: 6, arc: 38, noRight: !opt.markRight }));
    const P = a2Pt(V, d1 + ang, L);
    top.append(svgEl("circle", { cx: a2F(P[0]), cy: a2F(P[1]), r: 16, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }));
    const I = it();
    askEl.textContent = (opt.items.length > 1 ? `(${k + 1}/${opt.items.length}) ` : "") + (I.ask || (I.target != null ? `${I.target}°인 각을 만들어 보세요.` : `${I.kind}을 만들어 보세요.`));
    out.textContent = opt.show || revealed ? `지금 각도: ${ang}°` : "지금 각도: ?";
  };
  const done = [];
  const judge = () => {
    const I = it(); api.tryOnce(); let good, why;
    if (I.target != null) {
      const tol = I.est ? I.est : 0; good = Math.abs(ang - I.target) <= tol;
      if (!good) why = I.est ? `조금 더 ${ang < I.target ? "벌려" : "좁혀"} 봐요. 삼각자의 ${I.target < 45 ? "30°와 45°" : I.target < 60 ? "45°와 60°" : I.target < 90 ? "60°와 90°" : "90°"}를 떠올려요.` : `${I.target}°가 되게 ${ang < I.target ? "조금 더 벌려" : "조금 좁혀"} 봐요.`;
    } else {
      good = a2Kind(ang) === I.kind;
      if (!good) why = ang === 90 ? "지금은 직각이에요. 예각도 둔각도 아니에요." : ang >= 180 ? "두 변이 일직선이 되면 둔각이 아니에요. 180°보다 작게 만들어요." : `지금 만든 각은 ${a2Kind(ang)}이에요. ${I.kind === "예각" ? "직각보다 작게" : "직각보다 크게"} 만들어요.`;
    }
    if (!good) { api.fail(why, `${ang}°`); return false; }
    revealed = true; done.push(I.target != null ? (I.est ? `약 ${I.target}° → ${ang}°` : `${ang}°`) : `${I.kind} ${ang}°`); draw();
    if (k < opt.items.length - 1) { api.hint(`○ 잘했어요! ${I.est ? `실제로 재면 ${ang}°예요. ` : ""}다음 각도 만들어 봐요.`); k++; revealed = false; ang = opt.start != null ? opt.start : 30; draw(); return false; }
    api.done(done.join(", "), opt.ok || "각을 알맞게 만들었어요!"); return true;
  };
  const auto = autoRun(() => true, () => k + ":" + ang, judge, 1200);
  dragOn(svg, p => {
    const P = a2Pt(V, d1 + ang, L); if (a2D([p.x, p.y], P) > 60 && a2D([p.x, p.y], V) > L + 40) return false; return true;
  }, p => {
    let a = a2N(a2Dir(V, [p.x, p.y]) - d1);
    const maxA = opt.max || 180;
    if (a > maxA) a = a > (maxA + 360) / 2 ? 0 : maxA;
    a = Math.round(a / sn) * sn; ang = Math.max(opt.min != null ? opt.min : 1, a); revealed = false; draw();
  }, () => auto());
  const nudge = d => { ang = Math.max(opt.min != null ? opt.min : 1, Math.min(opt.max || 180, ang + d)); revealed = false; draw(); auto(); };
  const tools = h("div", { class: "tools" }, h("button", { onclick: () => nudge(sn) }, `⟲ ${sn}°`), h("button", { onclick: () => nudge(-sn) }, `⟳ ${sn}°`),
    opt.toggleProt ? h("button", { onclick: e => { showProt = !showProt; e.currentTarget.classList.toggle("on", showProt); draw(); } }, "각도기 대 보기") : null);
  api.provide({ words: opt.words || ["직각", "예각", "둔각"], answers: [opt.items.map(I => I.target != null ? `${I.target}°` : I.kind).join(", ")] });
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || "주황 동그라미를 끌어 변을 돌려요. 손을 떼고 잠깐 기다리면 저절로 확인해요."), tools, out)));
  draw();
}

/* 3. 각 나누기 — 모든 카드를 나누면 저절로 확인 */
function a2sSorter(body, api, opt) {
  const cats = opt.cats || ["예각", "직각", "둔각"], items = opt.items, where = items.map(() => -1);
  let sel = null, sq = false;
  const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(10.5em,1fr));gap:.5em" });
  const lab = i => items[i].label || A2_KO[i];
  const cards = items.map((it, i) => {
    const s = makeSvg(220, 170); const sp = a2FitAngle(Object.assign({ sw: 5, fs: 20, L: 1, L2: it.L2r || 1 }, it), 220, 150, 24);
    sp.V = [sp.V[0], sp.V[1] + 16]; s.append(a2AngleG(Object.assign(sp, { noRight: true, arc: 26 })));
    const sqG = svgEl("g", { style: "display:none" });
    sqG.append(svgEl("path", { d: a2WedgeD(sp.V, sp.d1, sp.d1 + 90, 62), fill: "rgba(43,123,214,.18)", stroke: BLUE, "stroke-width": 2, "stroke-dasharray": "6 5" }), a2RightMark(sp.V, sp.d1, 16, { stroke: BLUE }));
    s.append(sqG); s.style.width = "100%"; s.style.display = "block";
    const tag = h("div", { class: "jua", style: "text-align:center;min-height:1.4em" }, "-");
    const btn = h("button", { class: "opt", style: "padding:.3em;text-align:center", onclick: () => { sel = sel === i ? null : i; paint(); } }, h("div", { class: "jua" }, lab(i)), s, tag);
    grid.append(btn); return { btn, tag, sqG };
  });
  const paint = () => cards.forEach((c, i) => { c.btn.classList.toggle("on", sel === i); c.tag.textContent = where[i] < 0 ? "-" : cats[where[i]]; c.sqG.style.display = sq ? "" : "none"; c.btn.classList.remove("good", "bad"); });
  api.provide({ words: cats, answers: [cats.map((c, j) => `${c}: ${items.map((it, i) => it.cat === j ? lab(i) : null).filter(Boolean).join(", ") || "없음"}`).join(" / ")] });
  const judge = () => {
    api.tryOnce(); const ans = cats.map((c, j) => `${c}: ${items.map((it, i) => where[i] === j ? lab(i) : null).filter(Boolean).join(",") || "-"}`).join(" / ");
    const bad = items.map((it, i) => where[i] !== it.cat ? i : -1).filter(i => i >= 0);
    cards.forEach((c, i) => c.btn.classList.add(bad.includes(i) ? "bad" : "good"));
    if (!bad.length) { api.done(ans, opt.ok || "알맞게 나누었어요!"); return true; }
    const b0 = items[bad[0]];
    api.fail(b0.why || `${lab(bad[0])}${a2J(lab(bad[0]), "은", "는")} ${b0.a}°라서 ${a2Kind(b0.a)}이에요. 삼각자의 직각을 대 보고 다시 나누어 봐요.`, ans); return false;
  };
  const auto = autoRun(() => where.every(w => w >= 0), () => where.join(","), judge, 260);
  const tools = h("div", { class: "tools" }, h("span", {}, "고른 카드를 →"), cats.map((c, j) => h("button", { onclick: () => { if (sel == null) return api.hint("먼저 각 카드를 하나 눌러 골라요."); where[sel] = j; sel = null; paint(); auto(); } }, c)),
    h("button", { onclick: e => { sq = !sq; e.currentTarget.classList.toggle("on", sq); paint(); } }, "삼각자 직각 대 보기"));
  body.append(...[grid, h("p", { class: "inst" }, opt.tip || "카드를 누른 다음 아래 단추로 나누어요. 모두 나누면 저절로 확인해요."), tools].filter(Boolean));
  paint();
}

/* 4. 투명 종이로 비교하기 — 미끄럼틀 두 개(가·나). 겹치고 더 큰 각을 고르면 저절로 확인 */
function a2sTrace(body, api, opt) {
  const W = 880, H = 440, A = opt.A, B = opt.B, svg = makeSvg(W, H);
  svg.append(svgEl("rect", { x: 0, y: Math.max(A.V[1], B.V[1]), width: W, height: H, fill: "#E7F2DE" }));
  const slide = (sp, col) => { const g = svgEl("g"); const P1 = a2Pt(sp.V, sp.d1, sp.L), P2 = a2Pt(sp.V, sp.d1 + sp.a, sp.L2);
    g.append(a2Line(sp.V, P1, { stroke: "#9DBF86", "stroke-width": 10 }));
    g.append(a2Line(P2, [P2[0], sp.V[1]], { stroke: "#8795A1", "stroke-width": 7 }));
    for (let t = 1; t < 4; t++) { const y = P2[1] + (sp.V[1] - P2[1]) * t / 4; g.append(a2Line([P2[0] - 4, y], [P2[0] + 26, y], { stroke: "#8795A1", "stroke-width": 4 })); }
    g.append(a2Line([P2[0] + 22, P2[1]], [P2[0] + 22, sp.V[1]], { stroke: "#8795A1", "stroke-width": 7 }));
    g.append(a2Line(sp.V, P2, { stroke: col, "stroke-width": 16 }));
    g.append(a2AngleG({ V: sp.V, d1: sp.d1, a: sp.a, L: sp.L, L2: sp.L2, sw: 3, color: INK, arc: 46, noRight: true }));
    g.append(txt(sp.V[0] - 26, sp.V[1] - 22, sp.label, 28)); return g; };
  svg.append(slide(A, "#E8A25A"), slide(B, "#6FA8DC"), txt(A.V[0] + 110, H - 16, A.name, 20), txt(B.V[0] + 140, H - 16, B.name, 20));
  const sheet = svgEl("g", { style: "cursor:grab" }), copy = svgEl("g");
  sheet.append(svgEl("rect", { x: -40, y: -250, width: 320, height: 285, rx: 10, fill: "rgba(200,230,255,.38)", stroke: "#7FA9C9", "stroke-width": 2, "stroke-dasharray": "6 4" }), copy);
  svg.append(sheet);
  const home = [370, 250];
  let traced = false, pos = home.slice(), snapped = false, pick = null;
  const place = () => sheet.setAttribute("transform", `translate(${a2F(pos[0])},${a2F(pos[1])})`);
  const trace = () => {
    copy.innerHTML = ""; const o = [0, 0];
    copy.append(a2Line(o, a2Pt(o, A.d1, A.L), { stroke: "#C8472E", "stroke-width": 4, "stroke-dasharray": "12 6" }), a2Line(o, a2Pt(o, A.d1 + A.a, A.L2), { stroke: "#C8472E", "stroke-width": 4, "stroke-dasharray": "12 6" }), txt(-20, 20, "가", 22, { fill: "#C8472E" }));
    traced = true; pos = A.V.slice(); snapped = false; place();
    msg.textContent = "가를 본떴어요. 투명 종이를 끌어 나의 꼭짓점에 겹쳐 보세요.";
  };
  let dr = null;
  dragOn(svg, p => { if (!traced) return false; const dx = p.x - pos[0], dy = p.y - pos[1]; dr = { off: [dx, dy] }; return dx > -60 && dx < 300 && dy > -260 && dy < 50; },
    p => { if (!dr) return; pos = [p.x - dr.off[0], p.y - dr.off[1]]; snapped = false; place(); },
    () => { if (!dr) return; dr = null;
      if (a2D(pos, B.V) < 70) { pos = B.V.slice(); snapped = true; msg.textContent = "꼭짓점과 한 변(바닥)을 맞추었어요. 미끄럼판 쪽 변이 벌어진 정도를 비교해요."; auto(); }
      place(); });
  const msg = h("div", { class: "readout", style: "font-size:var(--fs)" }, "먼저 ‘가를 투명 종이에 본뜨기’를 눌러요.");
  const picks = ["가", "나"].map((n, i) => h("button", { class: "opt", onclick: e => { pick = i; picks.forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); if (!snapped) api.hint("투명 종이를 나에 겹쳐 꼭짓점과 한 변을 맞추면 확인할 수 있어요."); auto(); } }, n));
  api.provide({ words: ["꼭짓점", "한 변", "벌어진 정도"], answers: [opt.answer] });
  const judge = () => {
    api.tryOnce(); const want = A.a > B.a ? 0 : 1;
    picks.forEach((b, i) => b.classList.toggle(i === want ? "good" : "bad", i === pick));
    if (pick === want) { api.done(["가", "나"][pick], opt.ok); return true; }
    api.fail(opt.why || "겹친 그림에서 빨간 점선(가)과 나의 변 중 어느 쪽이 더 많이 벌어졌는지 다시 봐요. 변이 길다고 큰 각이 아니에요.", ["가", "나"][pick]); return false;
  };
  const auto = autoRun(() => snapped && pick != null, () => String(pick), judge, 260);
  body.append(stageWrap(svg, h("div", { class: "side" }, h("div", { class: "tools" }, h("button", { onclick: trace }, "가를 투명 종이에 본뜨기"), h("button", { onclick: () => { if (traced) { pos = home.slice(); snapped = false; place(); } } }, "종이 떼기")), msg,
    h("div", { class: "jua" }, opt.ask || "바닥과 이루는 각의 크기가 더 큰 미끄럼틀은?"), h("div", { class: "opts" }, picks))));
  place();
}

/* 5. 서로 다른 눈금으로 재기 — 칸 수를 다 쓰면 저절로 확인 */
function a2sUnits(body, api, opt) {
  const W = 860, H = 340, R = 230, svg = makeSvg(W, H), Vs = [[60, 300], [470, 300]];
  let t = 0; const painted = opt.tools.map(() => opt.angles.map(() => new Set()));
  const g = svgEl("g"); svg.append(g);
  const draw = () => {
    g.innerHTML = ""; const T = opt.tools[t], step = 90 / T.n;
    opt.angles.forEach((A, ai) => {
      const V = Vs[ai];
      for (let c = 0; c < T.n; c++) {
        const on = painted[t][ai].has(c);
        const w = svgEl("path", { d: a2WedgeD(V, c * step, (c + 1) * step, R), fill: on ? "rgba(228,122,56,.45)" : (c % 2 ? "rgba(170,210,245,.35)" : "rgba(170,210,245,.18)"), stroke: "#1D4E80", "stroke-width": 1.5, style: "cursor:pointer" });
        w.addEventListener("click", () => { on ? painted[t][ai].delete(c) : painted[t][ai].add(c); draw(); });
        g.append(w);
      }
      g.append(a2AngleG({ V, d1: 0, a: A.a, L: R + 40, sw: 5, arc: false, fill: false, noRight: true }));
      g.append(txt(V[0] + R + 40, V[1] - 12, A.label, 28), txt(V[0] + 150, V[1] + 26, `${T.name} · 칠한 칸 ${painted[t][ai].size}`, 18, { fill: A2_GRAY }));
    });
  };
  const tbtn = opt.tools.map((T, i) => h("button", { class: i === 0 ? "on" : "", onclick: e => { t = i; tbtn.forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); draw(); } }, T.name));
  const ins = opt.tools.map(T => opt.angles.map(A => a2sIn(`${T.name} ${A.label}`, 3.5)));
  const table = h("div", {}, opt.tools.map((T, i) => h("div", { class: "qitem" }, h("span", { class: "jua" }, T.name + ": "), opt.angles.map((A, j) => h("span", {}, ` ${A.label} `, ins[i][j], " 칸 ")))));
  api.provide({ words: ["칸", "눈금"], answers: opt.tools.map((T, i) => `${T.name}: ${opt.angles.map((A, j) => `${A.label} ${opt.ans[i][j]}칸`).join(", ")}`) });
  const judge = () => {
    api.tryOnce(); let ok = true, why = null;
    ins.forEach((row, i) => row.forEach((inp, j) => { const v = Number(inp.value), good = v === opt.ans[i][j]; inp.style.borderColor = good ? "var(--ok)" : "var(--no)";
      if (!good) { ok = false; if (!why) why = v === opt.tools[i].n && opt.ans[i][j] !== v ? `${opt.angles[j].label}의 두 변 사이에 들어가는 칸만 세어요. 도구 전체 칸 수가 아니에요.` : `‘${opt.tools[i].name}’ 단추를 눌러 ${opt.angles[j].label}의 두 변 사이에 있는 칸을 하나씩 눌러 세어 봐요.`; } }));
    const given = ins.map(r => r.map(x => x.value).join("·")).join(" / ");
    if (ok) { api.done(given, opt.ok); return true; }
    api.fail(why, given); return false;
  };
  const flat = ins.flat();
  const auto = autoRun(() => flat.every(x => String(x.value).trim() !== ""), () => flat.map(x => x.value).join("|"), judge, 900);
  flat.forEach(x => a2sOnType(x, auto));
  body.append(h("div", { class: "stage" }, svg), h("div", { class: "tools" }, h("span", {}, "눈금 도구:"), tbtn), h("p", { class: "inst", style: "margin:.3em 0" }, "각 안에 들어가는 칸을 눌러 색칠하며 세어요. 다시 누르면 지워져요. 칸 수를 모두 쓰면 저절로 확인해요."), table);
  draw();
}

/* 6. 각도의 합과 차 — 조각 나를 끌어 가에 붙이고 다의 각도를 쓰면 저절로 확인 */
function a2sJoin(body, api, opt) {
  const W = 860, H = 470, a = opt.a, b = opt.b, sum = opt.mode === "sum", nA = opt.nameA || "가", nB = opt.nameB || "나";
  const V = sum ? [250, 410] : [380, 400], RA = 240, RB = 200, svg = makeSvg(W, H);
  const base = svgEl("g"), res = svgEl("g"), piece = svgEl("g", { style: "cursor:grab" }), pr = svgEl("g");
  svg.append(base, res, piece, pr);
  base.append(svgEl("path", { d: a2WedgeD(V, 0, a, RA), fill: "rgba(228,122,56,.3)", stroke: TENT, "stroke-width": 3 }), a2Line(V, a2Pt(V, 0, RA), { "stroke-width": 4 }), a2Line(V, a2Pt(V, a, RA), { "stroke-width": 4 }));
  const la = a2Pt(V, a / 2, RA * .62); base.append(txt(la[0], la[1], `${nA} ${a}°`, 22));
  piece.append(svgEl("path", { d: a2WedgeD([0, 0], 0, b, RB), fill: "rgba(43,123,214,.32)", stroke: BLUE, "stroke-width": 3 }));
  const lb = a2Pt([0, 0], b / 2, RB * .7); piece.append(txt(lb[0], lb[1], `${nB} ${b}°`, 22, { fill: "#1D4E80" }));
  const home = [W - RB - 40, H - 30];
  let pos = home.slice(), rot = 0, snapped = false, showP = false, dr = null;
  const place = () => piece.setAttribute("transform", `translate(${a2F(pos[0])},${a2F(pos[1])}) rotate(${a2F(-rot)})`);
  const showRes = () => {
    res.innerHTML = ""; pr.innerHTML = ""; if (!snapped) return;
    if (sum) { res.append(svgEl("path", { d: a2ArcD(V, 0, a + b, RA + 26), fill: "none", stroke: "#C8472E", "stroke-width": 4, "stroke-dasharray": "10 6" })); const q = a2Pt(V, (a + b) / 2, RA + 50); res.append(txt(q[0], q[1], "다", 26, { fill: "#C8472E" })); }
    else { res.append(svgEl("path", { d: a2WedgeD(V, b, a, RA + 20), fill: "rgba(200,71,46,.12)", stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "10 6" })); const q = a2Pt(V, (a + b) / 2, RA + 46); res.append(txt(q[0], q[1], "다", 26, { fill: "#C8472E" })); }
    if (showP) { const g = a2ProtG(A2_PR, { knob: false }); g.setAttribute("transform", `translate(${V[0]},${V[1]})`); g.style.opacity = .92; pr.append(g); }
  };
  const msg = h("div", { class: "readout", style: "font-size:var(--fs)" }, sum ? `파란 조각 ${nB}를 끌어 ${nA}의 꼭짓점에 놓아 보세요. ${nA}의 위쪽 변에 이어 붙어요.` : `파란 조각 ${nB}를 끌어 ${nA}의 꼭짓점에 놓아 보세요. ${nA}와 꼭짓점·한 변이 겹쳐요.`);
  dragOn(svg, p => { const l = [p.x - pos[0], p.y - pos[1]]; const d = Math.hypot(...l); const ang = a2N(a2Dir([0, 0], l) - rot); if (d < RB + 10 && (ang <= b + 4 || ang > 350 || d < 30)) { dr = { off: l }; snapped = false; showRes(); return true; } return false; },
    p => { if (!dr) return; pos = [p.x - dr.off[0], p.y - dr.off[1]]; place(); },
    () => { if (!dr) return; dr = null; if (a2D(pos, V) < 80) { pos = V.slice(); rot = sum ? a : 0; snapped = true; msg.textContent = sum ? `${nA}의 변에 ${nB}를 이어 붙였어요. 이어 붙인 각 다는 몇 도일까요?` : `${nA} 위에 ${nB}를 겹쳤어요. 겹치지 않고 남은 각 다는 몇 도일까요?`; auto(); } place(); showRes(); });
  const inp = a2sIn("다의 각도", 5);
  const want = sum ? a + b : a - b;
  api.provide({ words: sum ? ["이어 붙이기", "더하기"] : ["겹치기", "빼기"], answers: [`${want}°`] });
  const judge = () => {
    api.tryOnce(); const v = Number(inp.value);
    if (v === want) { api.done(`${v}°`, opt.ok); return true; }
    const why = sum && v === a - b ? "이어 붙인 각은 두 각을 합친 크기예요. 더 크게 나와야 해요." : !sum && v === a + b ? "겹치고 남은 부분은 가보다 작아요. 큰 각에서 작은 각만큼 빼요." : "‘각도기 대 보기’를 눌러 다의 크기를 읽어 봐요.";
    api.fail(why, `${v}°`); return false;
  };
  const auto = autoRun(() => { if (!snapped && String(inp.value).trim() !== "") api.hint(`먼저 ${nB}를 끌어 ${nA}의 꼭짓점에 놓아요.`); return snapped && String(inp.value).trim() !== ""; }, () => inp.value, judge, 900);
  a2sOnType(inp, auto);
  body.append(stageWrap(svg, h("div", { class: "side" }, msg, h("div", { class: "tools" }, h("button", { onclick: e => { showP = !showP; e.currentTarget.classList.toggle("on", showP); showRes(); } }, "각도기 대 보기"), h("button", { onclick: () => { pos = home.slice(); rot = 0; snapped = false; place(); showRes(); } }, `${nB} 떼기`)),
    h("div", { class: "qitem" }, h("span", { class: "jua" }, "다의 각도: "), inp, h("span", {}, " °")))));
  place();
}

/* 7. 직각 조각 이어 붙이기(회전 놀이기구 바닥판) — 4장 붙이고 각도를 다 쓰면 저절로 확인 */
function a2sPinwheel(body, api, opt = {}) {
  const W = 560, H = 560, O = [280, 280], S = 190, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  let n = 1;
  const cols = ["#F6C9A8", "#A9CBEF", "#B8DFC4", "#D5C1EE"];
  const cnt = h("div", { class: "readout" });
  const draw = () => {
    g.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const p1 = a2Pt(O, 90 * i, S), p3 = a2Pt(O, 90 * i + 90, S);
      g.append(svgEl("path", { d: a2WedgeD(O, 90 * i, 90 * i + 90, S), fill: cols[i], stroke: INK, "stroke-width": 3 }));
      g.append(a2Line(O, p1, { stroke: INK, "stroke-width": 3 }), a2Line(O, p3, { stroke: INK, "stroke-width": 3 }));
      const seat = a2Pt(O, 90 * i + 45, S * .62); g.append(svgEl("circle", { cx: a2F(seat[0]), cy: a2F(seat[1]), r: 20, fill: "#fff", stroke: "#9C8A62", "stroke-width": 3 }));
    }
    if (n < 4) g.append(svgEl("path", { d: a2ArcD(O, 0, 90 * n, 46), fill: "none", stroke: "#C8472E", "stroke-width": 4 }));
    else g.append(svgEl("circle", { cx: O[0], cy: O[1], r: 46, fill: "none", stroke: "#C8472E", "stroke-width": 4 }));
    g.append(svgEl("circle", { cx: O[0], cy: O[1], r: 9, fill: INK }));
    cnt.textContent = `붙인 직각 조각 ${n}장`;
  };
  const ins = [1, 2, 3, 4].map(k => a2sIn(`${k}장`, 4.5));
  const want = [90, 180, 270, 360];
  api.provide({ words: ["90°", "180°", "360°", "일직선", "한 바퀴"], answers: want.map((w, i) => `${i + 1}장 ${w}°`) });
  const judge = () => {
    api.tryOnce(); let ok = true; ins.forEach((inp, i) => { const good = Number(inp.value) === want[i]; inp.style.borderColor = good ? "var(--ok)" : "var(--no)"; if (!good) ok = false; });
    const given = ins.map(x => x.value).join(", ");
    if (ok) { api.done(given, opt.ok); return true; }
    api.fail("조각 한 장의 각은 직각 90°예요. 한 장 붙일 때마다 90°씩 더해져요.", given); return false;
  };
  const auto = autoRun(() => { const full = ins.every(x => String(x.value).trim() !== ""); if (full && n < 4) api.hint("조각을 4장까지 붙여 바닥판을 완성하면 확인해요."); return full && n === 4; }, () => n + ":" + ins.map(x => x.value).join(","), judge, 900);
  ins.forEach(x => a2sOnType(x, auto));
  body.append(stageWrap(svg, h("div", { class: "side" }, h("div", { class: "tools" }, h("button", { onclick: () => { if (n < 4) { n++; draw(); auto(); } } }, "조각 한 장 더 붙이기"), h("button", { onclick: () => { n = 1; draw(); } }, "처음으로")), cnt,
    ...ins.map((inp, i) => h("div", { class: "qitem" }, h("span", { class: "jua" }, `${i + 1}장: `), inp, " °")))));
  draw();
}

/* 8. 다각형 각의 합 — drag(꼭짓점 끌기)·tear(모서리 잘라 모으기)·split(삼각형 2개) / 다 하고 합을 쓰면 저절로 확인 */
function a2sSum(body, api, opt) {
  const W = opt.W || 880, H = opt.H || 470, svg = makeSvg(W, H);
  let pts = (opt.pts || a2Poly(opt.angles, opt.lens, opt.mode === "tear" ? W * .62 : W, H, 44).pts).map(p => p.slice());
  const n = pts.length, total = (n - 2) * 180, MK = ["㉠", "㉡", "㉢", "㉣"];
  const polyG = svgEl("g"), pieceG = svgEl("g"); svg.append(polyG, pieceG);
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const inp = a2sIn("각의 크기의 합", 5);
  let shapes = [], torn = [], diag = null, gathered = false;
  const T = [W * .8, H * (n === 3 ? .62 : .5)];
  const drawPoly = () => {
    polyG.innerHTML = "";
    polyG.append(svgEl("polygon", { points: pts.map(p => p.map(a2F).join(",")).join(" "), fill: opt.fill || "#FFFDF8", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }));
    const cs = a2Corners(pts), vals = a2Round(cs.map(c => c.a), total);
    if (diag != null) {
      const A = diag, Cc = (diag + 2) % n;
      const t1 = [pts[A], pts[(A + 1) % n], pts[Cc]], t2 = [pts[A], pts[Cc], pts[(A + 3) % n]];
      [t1, t2].forEach((t, i) => polyG.append(svgEl("polygon", { points: t.map(p => p.map(a2F).join(",")).join(" "), fill: i ? "rgba(43,123,214,.16)" : "rgba(228,122,56,.18)", stroke: "none" })));
      polyG.append(a2Line(pts[A], pts[Cc], { stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "10 6" }));
    }
    cs.forEach((c, i) => {
      const r = 46;
      polyG.append(svgEl("path", { d: a2WedgeD(c.V, c.s, c.s + c.a, r), fill: torn.includes(i) ? "#EEF1F0" : A2_FILL[i], stroke: torn.includes(i) ? A2_GRAY : A2_COL[i], "stroke-width": 2, "stroke-dasharray": torn.includes(i) ? "5 4" : "" }));
      const q = a2Pt(c.V, c.s + c.a / 2, r + (c.a < 45 ? 34 : 24));
      polyG.append(txt(q[0], q[1], opt.mode === "drag" ? `${vals[i]}°` : MK[i], 21, { fill: A2_COL[i] }));
      if (opt.mode === "drag") polyG.append(svgEl("circle", { cx: a2F(c.V[0]), cy: a2F(c.V[1]), r: 13, fill: "#fff", stroke: A2_COL[i], "stroke-width": 4, style: "cursor:grab" }));
    });
    if (opt.mode === "drag") out.textContent = vals.map((v, i) => `${MK[i]} ${v}°`).join(" + ") + ` = ${vals.reduce((s, v) => s + v, 0)}°`;
    return cs;
  };
  const cnt = h("div", { class: "jua" });
  const convexOk = P => { const cs = a2Corners(P); let s = 0; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n], c = P[(i + 2) % n]; const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if (Math.abs(cr) < 1e-6) return false; if (!s) s = Math.sign(cr); else if (Math.sign(cr) !== s) return false; } return cs.every(c => c.a > 12 && c.a < 168) && P.every(p => p[0] > 20 && p[0] < W - 20 && p[1] > 20 && p[1] < H - 20) && P.every((p, i) => a2D(p, P[(i + 1) % n]) > 60); };
  const snapShape = () => { const cs = a2Corners(pts).map(c => c.a); if (!shapes.some(s => s.every((v, i) => Math.abs(v - cs[i]) < 6))) shapes.push(cs); cnt.textContent = `만들어 본 모양: ${shapes.length}가지`; };
  if (opt.mode === "drag") {
    let di = -1;
    dragOn(svg, p => { di = pts.findIndex(q => a2D(q, [p.x, p.y]) < 34); return di >= 0; },
      p => { if (di < 0) return; const P = pts.map(q => q.slice()); P[di] = [p.x, p.y]; if (convexOk(P)) { pts = P; drawPoly(); } },
      () => { if (di >= 0) { snapShape(); auto(); } di = -1; });
  }
  const finish = () => {
    if (n === 3) pieceG.append(a2Line([T[0] - 150, T[1]], [T[0] + 150, T[1]], { stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "10 6" }));
    else pieceG.append(svgEl("circle", { cx: T[0], cy: T[1], r: 84, fill: "none", stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "10 6" }));
    out.textContent = n === 3 ? "세 각이 한 점에 모여 일직선이 되었어요." : "네 각이 한 점에 모여 빈틈없이 한 바퀴가 되었어요.";
    gathered = true; auto();
  };
  const tearOne = i => {
    if (torn.includes(i)) return;
    const cs = a2Corners(pts), c = cs[i], start = torn.reduce((s, j) => s + cs[j].a, 0); torn.push(i);
    const g = svgEl("g"); g.append(svgEl("path", { d: a2WedgeD([0, 0], c.s, c.s + c.a, 70), fill: A2_FILL[i].replace(/,\.\d+\)/, ",.55)"), stroke: A2_COL[i], "stroke-width": 2.5 }));
    const lq = a2Pt([0, 0], c.s + c.a / 2, 50); g.append(txt(lq[0], lq[1], MK[i], 20, { fill: "#1D2A2A" }));
    pieceG.append(g);
    let dRot = a2N(start - c.s); if (dRot > 180) dRot -= 360;
    const t0 = performance.now(), dur = 700;
    const step = now => { const t = Math.min(1, (now - t0) / dur), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const x = c.V[0] + (T[0] - c.V[0]) * e, y = c.V[1] + (T[1] - c.V[1]) * e;
      g.setAttribute("transform", `translate(${a2F(x)},${a2F(y)}) rotate(${a2F(-dRot * e)})`);
      if (t < 1) requestAnimationFrame(step); else if (torn.length === n && !gathered) finish(); };
    requestAnimationFrame(step); drawPoly();
  };
  if (opt.mode === "tear") {
    svg.addEventListener("click", e => { const p = svgPt(svg, e); const cs = a2Corners(pts); const i = cs.findIndex(c => a2D(c.V, [p.x, p.y]) < 70); if (i >= 0) tearOne(i); });
    svg.append(svgEl("circle", { cx: T[0], cy: T[1], r: 6, fill: INK }), txt(T[0], T[1] + 34, "모으는 점", 18, { fill: A2_GRAY }));
    out.textContent = "색칠한 모서리를 하나씩 눌러 잘라 내요. 잘라 낸 조각이 오른쪽 점에 모여요.";
  }
  if (opt.mode === "split") {
    svg.addEventListener("click", e => { const p = svgPt(svg, e); const i = pts.findIndex(q => a2D(q, [p.x, p.y]) < 60); if (i >= 0) { diag = i; drawPoly(); out.textContent = "대각선을 그어 삼각형 2개로 나누었어요."; auto(); } });
    out.textContent = "꼭짓점 하나를 누르면 마주 보는 꼭짓점까지 선을 그어 삼각형 2개로 나누어요.";
  }
  const want = opt.want != null ? opt.want : total;
  api.provide({ words: [`${total}°`, n === 3 ? "일직선" : "한 바퀴"], answers: [opt.answerText || `${want}°`] });
  const extra = opt.mode === "split" ? [a2sIn("삼각형 하나의 세 각의 합", 4.5), a2sIn("삼각형 하나의 세 각의 합", 4.5)] : [];
  const all = extra.concat([inp]);
  const modeReady = () => opt.mode === "drag" ? shapes.length >= 3 : opt.mode === "tear" ? gathered : diag != null;
  const modeMsg = () => opt.mode === "drag" ? `꼭짓점을 끌어 모양이 다른 ${n === 3 ? "삼각형" : "사각형"}을 3가지 이상 만들어 보면 확인해요.` : opt.mode === "tear" ? "모서리를 모두 잘라 한 점에 모으면 확인해요." : "먼저 꼭짓점을 눌러 삼각형 2개로 나누면 확인해요.";
  const judge = () => {
    api.tryOnce(); const v = Number(inp.value);
    const ex = extra.map(x => Number(x.value)), exOk = extra.every(x => Number(x.value) === 180);
    extra.forEach(x => { x.style.borderColor = Number(x.value) === 180 ? "var(--ok)" : "var(--no)"; });
    const given = (extra.length ? ex.join(" + ") + " = " : "") + `${v}°`;
    if (v === want && exOk) { api.done(given, opt.ok); return true; }
    api.fail(!exOk ? "삼각형 하나의 세 각의 크기의 합은 180°예요." : v === 180 && n === 4 ? "사각형은 삼각형 2개로 나눌 수 있어요. 180°가 두 번이에요." : n === 3 ? "세 각을 모으면 일직선이 돼요. 일직선이 이루는 각은 몇 도일까요?" : "네 각을 모으면 한 바퀴가 돼요. 한 바퀴는 몇 도일까요?", given);
    return false;
  };
  const auto = autoRun(() => { const full = all.every(x => String(x.value).trim() !== ""); if (full && !modeReady()) api.hint(modeMsg()); return full && modeReady(); }, () => all.map(x => x.value).join("|"), judge, 900);
  all.forEach(x => a2sOnType(x, auto));
  const askRow = opt.mode === "split"
    ? h("div", { class: "qitem" }, extra[0], " ° + ", extra[1], " ° = ", inp, " °")
    : h("div", { class: "qitem" }, h("span", { class: "jua" }, opt.ask || (n === 3 ? "세 각의 크기의 합: " : "네 각의 크기의 합: ")), inp, h("span", {}, " °"));
  body.append(stageWrap(svg, h("div", { class: "side" }, opt.tip ? h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip) : null, out, cnt, askRow)));
  drawPoly(); if (opt.mode === "drag") snapShape();
}

/* 9. 놀이터 시계탑 — 바늘을 맞추고 예각·직각·둔각을 고르면 저절로 확인 */
function a2sClock(body, api, opt) {
  const W = 480, H = 480, O = [240, 240], R = 210, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  let k = 0, H0 = 12, M = 0, pick = null;
  const items = opt.items;
  const out = h("div", { class: "readout" }), askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const tl = it => `${it.h}시${it.m ? " " + it.m + "분" : ""}`;
  const draw = () => { g.innerHTML = ""; a2ClockFace(g, O, R, H0, M); out.textContent = `${H0 % 12 === 0 ? 12 : H0 % 12}시 ${M ? M + "분" : ""}`.trim(); const it = items[k]; askEl.textContent = (items.length > 1 ? `(${k + 1}/${items.length}) ` : "") + `${tl(it)}${a2J(tl(it), "을", "를")} 시계에 나타내고, 두 바늘이 이루는 작은 쪽의 각을 골라요.`; };
  let dr = null;
  dragOn(svg, p => { const q = [p.x, p.y], d = a2D(q, O); if (d > R + 10) return false;
    const ang = a2N(90 - a2Dir(O, q)), mA = M * 6, hA = (H0 % 12) * 30 + M * .5, near = (x, y) => Math.min(a2N(x - y), a2N(y - x));
    dr = near(ang, mA) <= near(ang, hA) || d > R * .6 ? "m" : "h"; return true; },
  p => { if (!dr) return; const ang = a2N(90 - a2Dir(O, [p.x, p.y]));
    if (dr === "m") { const nm = Math.round(ang / 30) * 5 % 60; if (M >= 45 && nm <= 15) H0 = H0 % 12 + 1; else if (M <= 15 && nm >= 45) H0 = (H0 + 10) % 12 + 1; M = nm; }
    else { let hh = Math.round((ang - M * .5) / 30); hh = ((hh % 12) + 12) % 12; H0 = hh === 0 ? 12 : hh; }
    draw(); }, () => { dr = null; auto(); });
  const kinds = ["예각", "직각", "둔각"], kb = kinds.map((n, i) => h("button", { class: "opt", onclick: e => { pick = i; kb.forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); auto(); } }, n));
  const res = [];
  api.provide({ words: kinds, answers: [items.map(it => `${tl(it)} ${a2Kind(a2ClockAngle(it.h, it.m))}`).join(", ")] });
  const judge = () => {
    const it = items[k]; api.tryOnce();
    const timeOk = H0 % 12 === it.h % 12 && M === it.m, want = a2Kind(a2ClockAngle(it.h, it.m)), ans = `${H0}시 ${M}분 ${kinds[pick]}`;
    if (!timeOk) { api.fail(`시계를 ${tl(it)}${a2J(tl(it), "으로", "로")} 맞추어요. ${it.m === 30 ? "30분이면 긴바늘은 6을 가리키고 짧은바늘은 두 수의 가운데에 있어요." : "정각이면 긴바늘은 12를 가리켜요."} 긴바늘(파랑)과 짧은바늘(검정)을 끌어 보세요.`, ans); return false; }
    if (kinds[pick] !== want) { kb[pick].classList.add("bad"); api.fail(`주황색으로 칠한 작은 쪽의 각을 삼각자의 직각과 비교해 다시 골라요.`, ans); return false; }
    res.push(`${tl(it)} ${want}(${a2ClockAngle(it.h, it.m)}°)`);
    if (k < items.length - 1) { api.hint(`○ ${res[res.length - 1]}! 다음 시각도 나타내 봐요.`); k++; pick = null; kb.forEach(b => b.classList.remove("on", "good", "bad")); draw(); return false; }
    api.done(res.join(", "), opt.ok); return true;
  };
  const auto = autoRun(() => pick != null, () => `${k}:${H0}:${M}:${pick}`, judge, 1200);
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || "긴바늘(파랑)을 끌면 5분씩, 짧은바늘(검정)을 끌면 1시간씩 움직여요. 시각을 맞추고 각을 고르면 저절로 확인해요."), out,
    h("div", { class: "tools" }, h("button", { onclick: () => { H0 = (H0 + 10) % 12 + 1; draw(); auto(); } }, "1시간 전"), h("button", { onclick: () => { H0 = H0 % 12 + 1; draw(); auto(); } }, "1시간 후")), h("div", { class: "opts" }, kb))));
  draw();
}

/* 10. 로봇 청소기 길 명령 — 빈칸(회전 방향·각도)을 다 정하면 로봇이 움직이고 저절로 확인 */
function a2sRobot(g, P, dir, U) {
  const t = svgEl("g", { transform: `translate(${a2F(P[0])},${a2F(P[1])}) rotate(${a2F(-dir)})` });
  t.append(svgEl("circle", { cx: 0, cy: 0, r: U * .42, fill: "#E3EAF2", stroke: "#3C556E", "stroke-width": 3 }),
    svgEl("circle", { cx: 0, cy: 0, r: U * .2, fill: "#9FB4C8", stroke: "#3C556E", "stroke-width": 1.5 }),
    svgEl("path", { d: `M${a2F(U * .22)},${a2F(-U * .3)} A${a2F(U * .42)},${a2F(U * .42)} 0 0 1 ${a2F(U * .22)},${a2F(U * .3)}`, fill: "none", stroke: "#C8472E", "stroke-width": 4 }),
    svgEl("circle", { cx: a2F(U * .3), cy: 0, r: U * .07, fill: "#C8472E" }));
  g.append(t);
}
function a2sMapPark() {
  const S = [1, 6], J = [5, 6];
  const A = a2Pt(J, 50, 3), B = a2Pt(J, -40, 3);
  const swing = a2Pt(A, 0, 3), slide = a2Pt(A, 110, 2), sand = a2Pt(B, 0, 3), saw = a2Pt(B, -110, 2), jungle = a2Pt(J, 0, 4);
  return { w: 13, h: 11.2, U: 44, start: { p: S, dir: 0 },
    roads: [[S, J], [J, A, swing], [A, slide], [J, B, sand], [B, saw], [J, jungle]],
    places: [{ n: "미끄럼틀", at: [slide[0] - .4, slide[1] - .75], end: slide, box: [2.2, .9], fill: "#FDE3C8" }, { n: "그네", at: [swing[0] + 1, swing[1]], end: swing, box: [1.6, .9], fill: "#DCEAFB" },
      { n: "정글짐", at: [jungle[0] + 1.25, jungle[1]], end: jungle, box: [2, .9], fill: "#E8DDF5" }, { n: "모래밭", at: [sand[0] + 1.25, sand[1]], end: sand, box: [2, .9], fill: "#F3D9AE" },
      { n: "시소", at: [saw[0] - 1.3, saw[1] + .2], end: saw, box: [1.6, .9], fill: "#FFF6D9" }, { n: "입구", at: [S[0], S[1] - 1], box: [1.4, .8], fill: "#E6EEF8" },
      { n: "화단", at: [2.2, 9.6], box: [2.6, 1.2], fill: "#D6EBC8" }],
    deco: [{ tree: [[1, 1.2], [2.4, 2], [11.8, 1.2], [12.2, 10.3], [3.6, 3.6], [10.6, 10.4]] }] };
}
function a2sTurtle(body, api, opt) {
  const map = opt.map, U = map.U, svg = makeSvg(map.w * U, map.h * U); a2TurtleMap(svg, map);
  const trail = svgEl("g"), tg = svgEl("g"); svg.append(trail, tg);
  const st = opt.cmds.map(c => ({ turn: c.fix || c.edit === "deg" ? c.turn : null, deg: c.fix || c.edit === "turn" ? c.deg : null }));
  const rows = opt.cmds.map((c, i) => {
    const no = h("span", { class: "jua", style: "display:inline-grid;place-items:center;width:1.6em;height:1.6em;border-radius:50%;background:var(--ring);color:#fff;margin-right:.3em" }, String(i + 1));
    if (!c.turn) return h("div", { class: "qitem" }, no, `앞으로 ${c.dist} cm 이동`);
    if (c.fix) return h("div", { class: "qitem" }, no, `${c.turn}으로 ${c.deg}°만큼 회전하여 ${c.dist} cm 이동`);
    const tb = ["왼쪽", "오른쪽"].map(n => h("button", { class: "opt" + (st[i].turn === n ? " on" : ""), disabled: c.edit === "deg", onclick: e => { st[i].turn = n; tb.forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); auto(); } }, n));
    const di = a2sIn(`${i + 1}번 회전 각도`, 3.6); if (st[i].deg != null) di.value = st[i].deg; if (c.edit === "turn") di.disabled = true;
    a2sOnType(di, () => { st[i].deg = di.value === "" ? null : Number(di.value); auto(); });
    return h("div", { class: "qitem" }, no, ...tb, "으로 ", di, `°만큼 회전하여 ${c.dist} cm 이동`);
  });
  const path = () => { let p = map.start.p.map(v => v * U), d = map.start.dir; const segs = [];
    opt.cmds.forEach((c, i) => { const s = st[i], prev = d; if (c.turn) d += (s.turn === "왼쪽" ? 1 : -1) * (s.deg || 0); const q = a2Pt(p, d, c.dist * U); segs.push({ p, q, prev, d, turn: !!c.turn }); p = q; }); return segs; };
  const placeAt = P => { const pl = map.places.find(pl => a2D(pl.at.map(v => v * U), P) < .6 * U || (pl.end && a2D(pl.end.map(v => v * U), P) < .3 * U)); return pl ? pl.n : null; };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" }, "빈칸을 모두 정하면 로봇 청소기가 저절로 움직여요.");
  let timer = null;
  const home = () => { clearTimeout(timer); trail.innerHTML = ""; tg.innerHTML = ""; a2sRobot(tg, map.start.p.map(v => v * U), map.start.dir, U);
    const ar = a2Pt(map.start.p.map(v => v * U), map.start.dir, .7 * U); trail.append(a2Line(ar, a2Pt(ar, map.start.dir, .6 * U), { stroke: "#C8472E", "stroke-width": 3 })); };
  const filled = () => st.every((s, i) => !opt.cmds[i].turn || (s.turn != null && s.deg != null));
  const run = after => {
    clearTimeout(timer); trail.innerHTML = ""; tg.innerHTML = ""; const segs = path(); let i = 0;
    a2sRobot(tg, segs[0].p, segs[0].prev, U);
    const stepF = () => {
      const sg = segs[i];
      if (sg.turn) {
        trail.append(a2Line(sg.p, a2Pt(sg.p, sg.prev, 1.6 * U), { stroke: A2_GRAY, "stroke-width": 2.5, "stroke-dasharray": "7 5" }));
        const lo = Math.min(sg.prev, sg.d), hi = Math.max(sg.prev, sg.d);
        if (hi - lo > .5) { trail.append(svgEl("path", { d: a2ArcD(sg.p, lo, hi, .7 * U), fill: "none", stroke: TENT, "stroke-width": 3 })); const q = a2Pt(sg.p, (lo + hi) / 2, 1.05 * U); trail.append(txt(q[0], q[1], `${Math.round(hi - lo)}°`, 17, { fill: "#B4610F" })); }
      }
      trail.append(a2Line(sg.p, sg.q, { stroke: "#C8472E", "stroke-width": 4 }));
      tg.innerHTML = ""; a2sRobot(tg, sg.q, sg.d, U);
      i++; if (i < segs.length) timer = setTimeout(stepF, 420);
      else { const where = placeAt(sg.q); out.textContent = where ? `로봇 청소기가 도착한 곳: ${where}` : "로봇 청소기가 길이 아닌 곳에 멈췄어요."; if (after) after(); }
    };
    timer = setTimeout(stepF, 200); return segs;
  };
  api.provide({ words: ["왼쪽", "오른쪽", "보조선", "회전"], answers: [opt.cmds.map((c, i) => c.turn && !c.fix ? `${i + 1} ${c.turn} ${c.deg}°` : null).filter(Boolean).join(", ")] });
  const judge = () => {
    api.tryOnce();
    const segs = path(), ans = opt.cmds.map((c, i) => c.turn ? `${st[i].turn}${st[i].deg}°` : `${c.dist}cm`).join(" / ");
    const fails = opt.goals.filter(gl => placeAt(segs[gl.after].q) !== gl.place);
    if (!fails.length) { run(() => api.done(ans, opt.ok)); return true; }
    const bad = opt.cmds.findIndex((c, i) => c.turn && !c.fix && (st[i].turn !== c.turn || st[i].deg !== c.deg));
    let why = `${fails[0].place}에 도착하지 못했어요.`;
    if (bad >= 0) { const c = opt.cmds[bad], s = st[bad];
      why += s.turn !== c.turn ? ` ${bad + 1}번 명령의 회전 방향을 다시 생각해 봐요. 로봇이 가던 방향을 보고 왼쪽인지 오른쪽인지 정해요.` : s.deg === 180 - c.deg ? ` ${bad + 1}번 회전 각도는 가던 방향을 늘인 보조선(회색 점선)과 새 길 사이의 각이에요.` : ` ${bad + 1}번 회전 각도를 다시 재어 봐요.`; }
    run(() => api.fail(why, ans)); return false;
  };
  const auto = autoRun(filled, () => JSON.stringify(st), judge, 900);
  body.append(h("div", { class: "stage" }, svg), h("div", { class: "qitem", style: "margin:.4em 0" }, h("div", { class: "jua" }, opt.title || "로봇 청소기 명령어"), ...rows),
    h("div", { class: "tools" }, h("button", { onclick: () => { if (!filled()) return api.hint("빈칸(회전 방향과 각도)을 모두 정해요."); run(); } }, "로봇 움직여 보기"), h("button", { onclick: () => { home(); out.textContent = "처음 자리로 돌아왔어요."; } }, "처음 자리로")), out);
  home();
}

/* 11. 장면에서 고르기 — 알맞은 것을 정답 수만큼 고르면 저절로 확인 */
function a2sPick(body, api, opt) {
  const svg = makeSvg(opt.W, opt.H); if (opt.deco) opt.deco(svg);
  const sel = new Set(), hits = [];
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  opt.items.forEach((it, i) => { const g = svgEl("g", { style: "cursor:pointer" }); const [x, y, w, hh] = it.box;
    const r = svgEl("rect", { x, y, width: w, height: hh, rx: 12, fill: "rgba(255,255,255,0)", stroke: "none" }); g.append(r); it.draw(g);
    g.addEventListener("click", () => { sel.has(i) ? sel.delete(i) : sel.add(i); paint(); auto(); }); svg.append(g); hits.push(r); });
  const paint = () => { hits.forEach((r, i) => { const on = sel.has(i); r.setAttribute("fill", on ? "rgba(43,123,214,.16)" : "rgba(255,255,255,0)"); r.setAttribute("stroke", on ? BLUE : "none"); r.setAttribute("stroke-width", 4); r.setAttribute("stroke-dasharray", "8 5"); });
    out.textContent = "고른 것: " + ([...sel].map(i => opt.items[i].n).join(", ") || "없음"); };
  const good = opt.items.map((it, i) => it.ok ? i : -1).filter(i => i >= 0);
  api.provide({ words: ["각", "꼭짓점", "변"], answers: [good.map(i => opt.items[i].n).join(", ")] });
  const judge = () => { api.tryOnce(); const ans = [...sel].map(i => opt.items[i].n).join(",") || "-";
    const extra = [...sel].filter(i => !opt.items[i].ok), miss = good.filter(i => !sel.has(i));
    if (!extra.length && !miss.length) { api.done(ans, opt.ok); return true; }
    api.fail(extra.length ? (opt.items[extra[0]].why || "고른 것 중에 각이 없는 것이 있어요. 다시 눌러 빼요.") : "아직 찾지 못한 것이 있어요.", ans); return false; };
  const auto = autoRun(() => sel.size >= good.length, () => [...sel].sort().join(","), judge, 260);
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "알맞은 것을 모두 눌러 골라요. 다시 누르면 취소돼요."), out))); paint();
}

/* 12. 발표회장 가는 길 — 갈림길마다 맞는 답을 고르면 로봇 청소기가 한 칸씩 나아가요 */
function a2sMaze(body, api, opt) {
  const gates = opt.gates, n = gates.length, W = 860, H = 150, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  let k = 0;
  const xs = i => 70 + i * (W - 140) / n;
  const draw = () => { g.innerHTML = "";
    g.append(svgEl("rect", { x: 30, y: 52, width: W - 60, height: 46, rx: 23, fill: "#EAF2E6", stroke: "#B8CDB0", "stroke-width": 2 }));
    for (let i = 1; i <= n; i++) { const x = xs(i) - (W - 140) / n / 2; g.append(svgEl("circle", { cx: x, cy: 75, r: 17, fill: i <= k ? "#B8DFC4" : "#fff", stroke: i === k + 1 ? TENT : A2_GRAY, "stroke-width": 3 }), txt(x, 76, String(i), 18)); }
    g.append(a2Line([W - 60, 100], [W - 60, 36], { stroke: "#6E4A2A", "stroke-width": 4 }), svgEl("polygon", { points: `${W - 58},36 ${W - 22},48 ${W - 58},60`, fill: "#C8472E" }), txt(W - 60, 128, opt.goal || "발표회장", 16));
    const sx = k === 0 ? 52 : xs(k) - (W - 140) / n / 2 + 40;
    a2sRobot(g, [sx, 75], 0, 44); g.append(txt(sx, 28, opt.runner || "로봇 청소기", 15));
  };
  const box = h("div", { class: "qitem" });
  const show = () => { box.innerHTML = ""; if (k >= n) return; const G = gates[k];
    box.append(h("div", { class: "jua" }, `갈림길 ${k + 1}. ${G.q}`)); if (G.fig) box.append(G.fig());
    box.append(h("div", { class: "opts" }, G.o.map((o, i) => h("button", { class: "opt", onclick: () => { api.tryOnce();
      if (i === G.a) { k++; draw(); if (k >= n) { box.innerHTML = ""; api.done(gates.map(x => x.o[x.a]).join(" → "), opt.ok || "발표회장에 도착했어요!"); } else { api.hint(`○ ${o}! 다음 갈림길로 가요.`); show(); } }
      else api.fail(G.why || "막다른 길이에요. 다시 풀어 봐요.", o); } }, o)))); };
  api.provide({ words: [], answers: [gates.map(x => x.o[x.a]).join(" → ")] });
  body.append(h("div", { class: "stage" }, svg), box); draw(); show();
}

/* 그림: 미끄럼틀(바닥과 이루는 각 th) — 꼭짓점은 미끄럼판이 바닥에 닿는 곳 */
function a2sSlideG(g, V, th, L, opt = {}) {
  const T = a2Pt(V, 180 - th, L);
  g.append(a2Line([V[0] - L * Math.cos(a2Rad(th)) - 60, V[1]], [V[0] + 50, V[1]], { stroke: "#9DBF86", "stroke-width": 6 }));
  g.append(a2Line([T[0] - 40, T[1]], [T[0] - 40, V[1]], { stroke: "#8795A1", "stroke-width": 7 }), a2Line([T[0] - 8, T[1]], [T[0] - 8, V[1]], { stroke: "#8795A1", "stroke-width": 7 }));
  for (let y = T[1] + 30; y < V[1] - 8; y += 32) g.append(a2Line([T[0] - 40, y], [T[0] - 8, y], { stroke: "#8795A1", "stroke-width": 4 }));
  g.append(a2Line([T[0] - 46, T[1]], [T[0] + 2, T[1]], { stroke: "#6E7C86", "stroke-width": 9 }));
  g.append(a2Line(V, T, { stroke: opt.col || "#E8A25A", "stroke-width": 13 }));
  g.append(svgEl("path", { d: a2WedgeD(V, 180 - th, 180, 54), fill: "rgba(43,123,214,.18)", stroke: BLUE, "stroke-width": 2.5 }));
  if (opt.deg) { const q = a2Pt(V, 180 - th / 2, 80); g.append(txt(q[0], q[1], `${th}°`, 22, { fill: BLUE })); }
}
/* 1차시 놀이터 그림 */
const A2S_SCENE = {
  W: 900, H: 440,
  deco: s => { s.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 440, fill: "#F2F8FC" }), svgEl("rect", { x: 0, y: 392, width: 900, height: 48, fill: "#D8EBC8" })); },
  items: [
    { n: "미끄럼틀", box: [14, 196, 206, 200], ok: true, draw: g => a2sSlideG(g, [205, 392], 40, 190, {}) },
    { n: "그네", box: [232, 150, 186, 245], ok: true, draw: g => { g.append(a2Line([325, 165], [258, 392], { stroke: "#2B6FB8", "stroke-width": 9 }), a2Line([325, 165], [392, 392], { stroke: "#2B6FB8", "stroke-width": 9 }), a2Line([325, 170], [325, 330], { stroke: "#8795A1", "stroke-width": 3 }), svgEl("rect", { x: 305, y: 330, width: 40, height: 10, rx: 3, fill: "#E47A38" })); } },
    { n: "시소", box: [432, 300, 196, 95], ok: true, draw: g => { g.append(svgEl("polygon", { points: "512,392 548,392 530,357", fill: "#8E5BC9" }), a2Line([447, 337], [613, 376], { stroke: "#E4B33C", "stroke-width": 10 })); } },
    { n: "정글짐", box: [628, 205, 168, 192], ok: true, draw: g => { const x0 = 642, y0 = 222, s = 46; for (let i = 0; i <= 3; i++) g.append(a2Line([x0 + i * s, y0], [x0 + i * s, 392], { stroke: "#2E8B57", "stroke-width": 6 })); for (let j = 0; j < 4; j++) g.append(a2Line([x0, y0 + j * s * .92], [x0 + 3 * s, y0 + j * s * .92], { stroke: "#2E8B57", "stroke-width": 6 })); } },
    { n: "해", box: [784, 22, 100, 100], why: "해는 굽은 선으로 된 동그라미라서 각이 없어요.", draw: g => g.append(svgEl("circle", { cx: 834, cy: 72, r: 40, fill: "#FFD966", stroke: "#E4B33C", "stroke-width": 4 })) },
    { n: "훌라후프", box: [450, 168, 160, 92], why: "훌라후프는 굽은 선으로만 되어 있어서 각이 없어요.", draw: g => g.append(svgEl("ellipse", { cx: 530, cy: 214, rx: 64, ry: 32, fill: "none", stroke: "#F28B82", "stroke-width": 8 })) },
    { n: "모래 언덕", box: [800, 318, 96, 78], why: "모래 언덕은 둥근 선으로 되어 있어서 곧은 선이 만나는 곳이 없어요.", draw: g => g.append(svgEl("path", { d: "M806,392 Q848,322 892,392 Z", fill: "#F3D9AE", stroke: "#C9A27A", "stroke-width": 3 })) }] };
function a2sParkFig() { return a2Fig(A2S_SCENE.W, A2S_SCENE.H, s => { A2S_SCENE.deco(s); A2S_SCENE.items.forEach(it => { const g = svgEl("g"); it.draw(g); s.append(g); }); }, "36em"); }
//@@LESSONS
const UNIT_STORY = { title: "우리 반 놀이터 설계단", lines: [
  "햇살초등학교 운동장 한쪽에 새 놀이터가 생겨요. 교장 선생님이 ‘어린이 생각을 담아 설계해 달라’고 부탁하셔서 4학년 2반 24명이 ‘놀이터 설계단’이 되었어요.",
  "서준, 하린, 도윤, 지유, 민재, 수아가 모둠을 이끌며 미끄럼틀의 기울기, 그네 기둥이 벌어진 각, 시소의 각을 비교하고 각도기로 재고 어림해요. 울타리 모서리의 각을 더하고 빼고, 삼각형 화단과 사각형 모래밭의 각의 크기의 합도 알아봐요.",
  "로봇 청소기가 다닐 길을 회전 각도로 명령하고, 마지막에는 우리 반이 만든 놀이터 설계도를 발표해요."],
  one: "놀이터 설계단 · 새 놀이터를 설계하며 각의 크기를 비교하고, 재고, 어림하고, 더하고 빼요." };
const UNIT_KEYWORDS = ["각", "꼭짓점", "변", "각의 크기", "각도", "1°", "직각 90°", "각도기", "중심", "밑금", "안쪽 눈금", "바깥쪽 눈금", "예각", "둔각", "어림", "약 ○°", "각도의 합과 차", "삼각형 세 각의 합 180°", "사각형 네 각의 합 360°", "회전한 각"];

const A2S_TRI = a2Poly([45, 60, 75], [10], 900, 600, 200).pts;
const A2S_QUAD = a2Poly([70, 95, 110, 85], [9, 6], 900, 600, 200).pts;
const a2sPolyDeco = (pts, fill) => g => g.append(svgEl("polygon", { points: pts.map(p => p.map(a2F).join(",")).join(" "), fill, stroke: "#2F2F2F", "stroke-width": 4 }));
const a2sGround = (y, W = 800, H = 600) => g => g.append(svgEl("rect", { x: 0, y, width: W, height: H - y, fill: "#E7F2DE" }));
/* 로봇이 지나온 길(회색 점선 보조선과 함께 재기) */
const a2sCameFrom = (deg, label) => g => { const V = [400, 324], P = a2Pt(V, deg, 300); g.append(a2Line(P, V, { stroke: "#C8472E", "stroke-width": 5 })); const q = a2Pt(V, deg, 210); g.append(txt(q[0], q[1] - 24, label, 18, { fill: "#C8472E" })); };

const LESSONS = [
{
  id: "s1", no: 1, title: "놀이터 설계단이 모였어요", soop: "개념 찾기(S)",
  question: "새 놀이터를 설계하려면 각에 대해 무엇을 알아야 할까요?",
  summary: "놀이터의 미끄럼틀, 그네 기둥, 시소, 정글짐에는 여러 가지 각이 있어요. 한 점에서 그은 두 반직선으로 이루어진 도형을 각이라고 하고, 그 점을 꼭짓점, 두 반직선을 변이라고 해요. 안전하고 재미있는 놀이터를 설계하려면 각의 크기를 비교하고, 재고, 어림하고, 더하고 빼는 방법이 필요해요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "놀이터 설계단이 운동장 빈터에 모였어요. 정 선생님이 보여 주신 놀이터 그림을 보고 떠오르는 것을 세 칸에 써서 붙여요.", hints: ["미끄럼틀 판과 바닥, 그네 기둥 두 개가 만나는 곳을 살펴봐요.", "놀이기구를 탔을 때 기울어진 정도가 어땠는지 떠올려요."],
      render: (b, a) => { b.append(a2sParkFig()); panes(b, a, [
        { t: "보여요", e: "👀", ph: "놀이터에서 ~이 보여요", hint: "곧은 선 두 개가 만나는 곳", ex: ["미끄럼틀 판과 바닥이 비스듬히 만나는 곳이 보여요.", "그네 기둥 두 개가 꼭대기에서 만나는 곳이 보여요."] },
        { t: "생각해요", e: "💭", ph: "~이 더 기울어지면 ~할 것 같아요", hint: "놀이기구를 탔던 경험", ex: ["미끄럼틀이 더 많이 기울어지면 더 빨리 내려올 것 같아요.", "그네 기둥이 조금만 벌어지면 그네가 흔들거릴 것 같아요."] },
        { t: "궁금해요", e: "❓", ph: "~은 어떻게 잴까?", hint: "각에 대해 궁금한 것", ex: ["미끄럼틀이 기울어진 정도는 어떻게 잴까?", "두 각 중 어느 것이 더 큰지 어떻게 알 수 있을까?"] }],
        { ok: "놀이터 곳곳에 각이 있어요. 각의 크기를 비교하고 재는 방법을 알아봐요." }); } },
    { name: "그려 보기 — 놀이터에서 각 찾기", inst: "하린이가 그린 첫 놀이터 그림이에요. 각을 볼 수 있는 것을 모두 눌러 보세요.", hints: ["곧은 선 두 개가 한 점에서 만나는 곳을 찾아요.", "동그랗거나 둥근 선으로만 된 것에는 각이 없어요."],
      render: (b, a) => a2sPick(b, a, Object.assign({ tip: "각을 볼 수 있는 것을 모두 눌러 골라요. 다시 누르면 취소돼요.", ok: "미끄럼틀, 그네, 시소, 정글짐에서 각을 볼 수 있어요." }, A2S_SCENE)) },
    { name: "말해 보기 — 각과 직각 떠올리기", inst: "3학년 때 배운 각과 직각을 떠올려요. 알맞은 것을 골라 보세요.", hints: ["각은 한 점에서 그은 두 반직선으로 이루어진 도형이에요.", "직각은 종이를 반듯하게 두 번 접었을 때 생기는 각이에요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "각을 모두 골라요.", fig: () => a2Cards([{ draw: (g, W, H) => g.append(svgEl("path", { d: `M50,${H - 36} Q120,40 ${W - 36},60 M50,${H - 36} Q140,${H - 30} ${W - 30},${H - 60}`, fill: "none", stroke: INK, "stroke-width": 5 }), svgEl("circle", { cx: 50, cy: H - 36, r: 5, fill: INK })) }, { d1: 15, a: 70 }, { draw: (g, W, H) => g.append(a2Line([40, H - 36], [W - 40, H - 36]), a2Line([60, H - 70], [W - 60, 46])) }, { d1: 25, a: 130 }], { maxW: "40em" }),
          o: ["가", "나", "다", "라"], a: [1, 3] },
        { q: "정글짐 기둥과 가로 막대가 만나는 곳처럼 직각인 것을 골라요.", fig: () => a2Cards([{ d1: 20, a: 90 }, { d1: 0, a: 105 }, { d1: 40, a: 75 }], { maxW: "32em" }), o: ["가", "나", "다"], a: 0, why: { "1": "나는 직각보다 더 벌어졌어요.", "2": "다는 직각보다 덜 벌어졌어요." } }], { ok: "나와 라가 각이에요. 직각은 가예요." }),
        { q: "가는 왜 각이 아닐까요?", ph: "왜냐하면 ~", help: ["① 각이 무엇인지 떠올려요. → ② 가의 선이 곧은지 굽었는지 살펴봐요.", "‘왜냐하면 가는 ~ 선으로 되어 있어서 ~이 아니기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 가는 굽은 선으로 되어 있어서, 한 점에서 그은 두 반직선으로 이루어진 도형이 아니기 때문이에요." }) },
    { name: "약속하기 — 각의 이름", inst: "3학년 때 배운 약속을 다시 떠올려요. 알맞은 말을 골라 약속을 완성해요.", hints: ["두 반직선이 만나는 점이 꼭짓점이에요.", "꼭짓점에서 뻗어 나간 두 반직선이 변이에요."],
      render: (b, a) => blanks(b, a, ["한 점에서 그은 두 반직선으로 이루어진 도형을 ", { o: ["각", "선분", "직선"], a: 0 }, "이라고 해요. 그 점을 각의 ", { o: ["꼭짓점", "변"], a: 0 }, ", 두 반직선을 각의 ", { o: ["변", "꼭짓점"], a: 0 }, "이라고 해요. 종이를 반듯하게 두 번 접었을 때 생기는 각을 ", { o: ["직각", "선분"], a: 0 }, "이라고 해요."]) },
    { name: "확인하기 — 설계단의 첫 질문", inst: "하린이와 도윤이가 미끄럼틀을 하나씩 그렸어요. 더 가파른 미끄럼틀을 고르고, 이 단원에서 알고 싶은 것을 써 보세요.", hints: ["미끄럼판과 바닥이 더 많이 벌어진 쪽이 더 가파라요.", "알고 싶은 것은 놀이기구 하나를 떠올리며 써요."],
      render: (b, a) => { quiz(b, a, [{ q: "바닥과 이루는 각이 더 커서 더 가파른 미끄럼틀은?", fig: () => a2Row(a2Fig(420, 300, s => { a2sSlideG(s, [330, 260], 30, 220, {}); s.append(txt(30, 30, "가", 26)); }), a2Fig(420, 300, s => { a2sSlideG(s, [330, 260], 50, 220, { col: "#6FA8DC" }); s.append(txt(30, 30, "나", 26)); })), o: ["가", "나"], a: 1, why: { "0": "파란색으로 칠한 각을 비교해요. 미끄럼판과 바닥이 더 많이 벌어진 것은 나예요." } }], { ok: "나가 더 가팔라요. 바닥과 이루는 각이 더 크기 때문이에요." });
        writeStep(b, a, [{ q: "놀이터 설계단으로서 이 단원에서 알고 싶은 것을 써 보세요.", tag: "알고 싶은 것", ph: "예) 미끄럼틀이 기울어진 각을 ~하는 방법", help: ["① 놀이기구 하나를 떠올려요. → ② 그 놀이기구의 각에서 알고 싶은 것을 생각해요.", "‘~의 각을 ~하는 방법을 알고 싶어요.’ 꼴로 써요."], ans: "미끄럼틀이 바닥과 이루는 각의 크기를 정확하게 재는 방법을 알고 싶어요." }]); } }
  ],
  challenge: { inst: "놀이터 입구 안내판은 막대 4개가 한 점에서 뻗어 나간 모양이에요. 그림에서 찾을 수 있는 각은 모두 몇 개인가요?", hints: ["반직선을 두 개씩 짝 지어 보세요.", "이웃한 두 반직선이 만드는 작은 각 3개만 있는 것이 아니에요."],
    render: (b, a) => { b.append(a2Fig(560, 300, s => { const V = [180, 260]; [0, 40, 100, 150].forEach(d => s.append(a2Line(V, a2Pt(V, d, 240), { stroke: "#9C6B3E", "stroke-width": 7 }))); s.append(svgEl("circle", { cx: V[0], cy: V[1], r: 8, fill: INK })); }, "24em"));
      numbers(b, a, [{ q: "각은 모두 몇 개인가요?", a: 6, unit: "개", why: { "3": "이웃한 두 막대가 만드는 작은 각 3개만 세었어요. 두 각, 세 각을 합친 큰 각도 하나의 각이에요.", "5": "가장 바깥쪽 두 막대가 만드는 큰 각도 세어 봐요." } }], { ok: "각은 6개예요. 막대 4개에서 두 개씩 짝 지으면 6가지예요." }); } }
},
{
  id: "s2", no: 2, title: "어느 미끄럼틀이 더 가파를까요 ― 각의 크기 비교", soop: "개념 구축하기(O)",
  question: "두 미끄럼틀 중 어느 쪽이 바닥과 더 큰 각을 이룰까요? 각의 크기는 어떻게 비교할까요?",
  summary: "각의 두 변이 벌어진 정도를 각의 크기라고 해요. 각의 크기는 변의 길이와 상관없어요. 투명 종이에 한 각을 본떠 꼭짓점과 한 변을 맞추어 겹치거나, 같은 눈금으로 칸 수를 세어 비교해요. 눈금의 크기가 다르면 칸 수가 달라지므로 모두가 같은 단위로 재야 해요.",
  steps: [
    { name: "만져 보기 — 투명 종이로 겹치기", inst: "하린이 모둠(가)과 도윤이 모둠(나)이 그린 미끄럼틀이에요. 나의 미끄럼판이 더 길어요. 먼저 예상을 쓴 다음, 가를 투명 종이에 본떠 나에 겹쳐 보고 각이 더 큰 쪽을 골라요.", hints: ["눈으로는 비슷해 보여요. 투명 종이를 겹쳐서 비교해요.", "꼭짓점과 바닥 쪽 변을 맞춘 다음, 미끄럼판 쪽 변이 더 많이 벌어진 쪽이 더 큰 각이에요."],
      render: ruleFirst((b, a) => a2sTrace(b, a, { A: { V: [90, 390], d1: 0, a: 40, L: 230, L2: 230, label: "가", name: "하린이 모둠" }, B: { V: [470, 390], d1: 0, a: 36, L: 330, L2: 330, label: "나", name: "도윤이 모둠" }, answer: "가",
        ok: "가의 각이 더 커요. 나의 미끄럼판이 더 길지만, 바닥과 더 많이 벌어진 것은 가예요.", why: "빨간 점선(가)의 미끄럼판 쪽 변이 나의 미끄럼판보다 더 위로 벌어져 있는지 다시 봐요. 미끄럼판이 길다고 각이 더 큰 것은 아니에요." }),
        { q: "미끄럼판이 더 긴 미끄럼틀이 바닥과 이루는 각도 더 클까요?", ph: "내 예상: ~", help: ["① 각의 크기가 무엇인지 떠올려요. → ② 변의 길이와 벌어진 정도 중 무엇과 관계있는지 생각해요.", "‘내 예상: 미끄럼판이 길면 각이 (커질 / 그대로일) 것 같아요. 왜냐하면 ~’ 꼴로 써요."], ans: "각의 크기는 변의 길이와 상관없이 두 변이 벌어진 정도로 정해요. 그래서 미끄럼판이 길어도 각이 더 크다고 할 수 없어요." }) },
    { name: "그려 보기 — 눈금으로 재기", inst: "서준이는 직각을 똑같이 3칸으로, 수아는 직각을 똑같이 9칸으로 나눈 눈금을 만들었어요. 설계도의 두 각 가와 나가 각각 몇 칸인지 세어 보세요.", hints: ["두 변 사이에 들어가는 칸만 세어요.", "‘눈금 도구’ 단추로 서준이의 눈금과 수아의 눈금을 바꿔 가며 세어요."],
      render: (b, a) => a2sUnits(b, a, { angles: [{ a: 60, label: "가" }, { a: 90, label: "나" }], tools: [{ name: "서준이의 눈금", n: 3 }, { name: "수아의 눈금", n: 9 }], ans: [[2, 3], [6, 9]], ok: "서준이의 눈금으로 가 2칸, 나 3칸 / 수아의 눈금으로 가 6칸, 나 9칸이에요." }) },
    { name: "말해 보기 — 눈금이 다르면?", inst: "센 칸 수를 보고 알맞은 말을 골라요. 그리고 왜 그런지 한 줄로 써 보세요.", hints: ["서준이의 한 칸 안에 수아의 칸이 3칸 들어가요.", "같은 각도 눈금이 달라지면 칸 수가 달라져요."],
      render: thenWhy((b, a) => blanks(b, a, ["가는 서준이의 눈금으로 ", { o: ["2", "3", "6"], a: 0 }, "칸, 수아의 눈금으로 ", { o: ["2", "6", "9"], a: 1 }, "칸이에요. 같은 각이라도 눈금에 따라 칸 수가 ", { o: ["달라져요", "같아요"], a: 0 }, ". 설계단 모두가 각의 크기를 똑같이 알아들으려면 ", { o: ["모두 같은 단위", "각자 다른 단위"], a: 0 }, "로 재야 해요."]),
        { q: "서준이와 수아가 같은 각을 재었는데 칸 수가 다른 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 서준이의 한 칸과 수아의 한 칸 중 어느 것이 더 큰지 봐요. → ② 칸이 크면 칸 수가 어떻게 되는지 생각해요.", "‘왜냐하면 ~의 한 칸이 더 커서, 같은 각이라도 칸 수가 더 ~ 나오기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 서준이의 한 칸이 수아의 한 칸보다 커서, 같은 각이라도 서준이 눈금으로는 칸 수가 더 적게 나오기 때문이에요." }) },
    { name: "약속하기 — 각의 크기", inst: "약속: 각의 두 변이 벌어진 정도를 각의 크기라고 해요. 알맞은 말을 골라 보세요.", hints: ["변을 길게 늘여도 두 변이 벌어진 정도는 그대로예요."],
      render: (b, a) => blanks(b, a, ["각의 크기는 각의 두 변이 ", { o: ["벌어진 정도", "길이"], a: 0 }, "예요. 변의 길이가 길어져도 각의 크기는 ", { o: ["변하지 않아요", "커져요"], a: 0 }, ". 두 각의 크기를 비교할 때는 꼭짓점과 ", { o: ["한 변", "두 변의 끝"], a: 0 }, "을 맞추어 겹쳐 봐요."]) },
    { name: "확인하기 — 놀이기구 각 비교", inst: "설계도에 그린 각의 크기를 비교해 보세요.", hints: ["두 변이 더 많이 벌어진 각이 더 커요.", "변의 길이는 생각하지 않아요."],
      render: (b, a) => quiz(b, a, [
        { q: "각의 크기가 더 큰 각은?", fig: () => a2Cards([{ d1: 20, a: 55, L2r: 1.4 }, { d1: 0, a: 75, L2r: .5 }], { maxW: "22em" }), o: ["가", "나"], a: 1, why: { "0": "가의 변이 더 길지만, 두 변이 더 많이 벌어진 것은 나예요." } },
        { q: "각의 크기가 큰 것부터 차례로 쓴 것은?", fig: () => a2Cards([{ d1: 30, a: 100, L2r: .6 }, { d1: 60, a: 30, L2r: 1.3 }, { d1: 190, a: 65 }], { maxW: "32em" }), o: ["가, 다, 나", "나, 다, 가", "다, 가, 나"], a: 0, why: { "1": "변이 긴 나가 가장 큰 것은 아니에요. 두 변이 벌어진 정도를 비교해요." } },
        { q: "보기의 각보다 큰 각을 모두 골라요.", fig: () => a2Cards([{ d1: 0, a: 70, label: "보기" }, { d1: 30, a: 85, L2r: .6, label: "가" }, { d1: 110, a: 40, L2r: 1.3, label: "나" }, { d1: 0, a: 120, label: "다" }, { d1: 240, a: 60, label: "라" }], { per: 5, maxW: "46em", cw: 200 }), o: ["가", "나", "다", "라"], a: [0, 2] }], { ok: "나가 더 커요 / 가, 다, 나 / 보기보다 큰 각은 가, 다예요." }) }
  ],
  challenge: { inst: "설계단 친구들의 말을 보고 물음에 답해 보세요.", hints: ["같은 눈금으로 센 칸 수는 빼서 비교할 수 있어요.", "변의 길이와 각의 크기는 상관없어요."],
    render: (b, a) => quiz(b, a, [
      { q: "수아의 눈금으로 재었더니 그네 기둥 사이의 각은 5칸, 시소 판과 땅이 이루는 각은 2칸이었어요. 알맞은 말은?", o: ["그네 기둥 사이의 각이 3칸만큼 더 커요", "시소의 각이 3칸만큼 더 커요", "그네 기둥 사이의 각이 7칸만큼 더 커요"], a: 0, why: { "2": "두 칸 수의 차를 구해요. 5−2예요." } },
      { q: "지유가 “각의 변을 길게 늘이면 각이 더 커져.”라고 말했어요. 바르게 고친 말은?", o: ["변을 길게 늘여도 두 변이 벌어진 정도는 같아서 각의 크기는 그대로예요", "변을 늘이면 각이 두 배가 돼요", "변이 짧은 각이 언제나 더 커요"], a: 0 }], { ok: "그네 기둥 사이의 각이 3칸만큼 더 커요. 변을 늘여도 각의 크기는 그대로예요." }) }
},
{
  id: "s3", no: 3, title: "그네 기둥 사이의 각 ― 각도기로 재기", soop: "개념 구축하기(O)",
  question: "그네 기둥이 벌어진 각을 어떻게 정확하게 잴 수 있을까요?",
  summary: "각의 크기를 각도라고 해요. 직각의 크기를 똑같이 90으로 나눈 것 중 하나를 1도라 하고 1°라고 써요. 직각은 90°예요. 각도기로 잴 때는 ① 중심을 꼭짓점에 맞추고 ② 밑금을 한 변에 맞춘 다음 ③ 그 변이 0인 쪽 눈금에서 다른 변과 만나는 눈금을 읽어요.",
  steps: [
    { name: "만져 보기 — 각도기 맞추기", inst: "도윤이가 그네 기둥 두 개가 꼭대기에서 만나 벌어진 각을 재려고 해요. 각도기를 끌어 중심을 꼭짓점 ㄴ에, 밑금을 한 변에 맞추고 눈금을 읽어 보세요. 주황 손잡이를 끌면 각도기가 돌아가요.", hints: ["각도기의 빨간 점(중심)을 꼭짓점 ㄴ에 놓아요.", "밑금이 변 ㄴㄷ에 맞게 돌린 다음, 변 ㄴㄷ이 0에 있는 쪽 눈금을 읽어요."],
      render: (b, a) => a2sMeasure(b, a, { items: [{ V: [400, 130], d1: 245, a: 50, L: 300, names: ["ㄱ", "ㄴ", "ㄷ"], color: "#9C6B3E", ask: "그네 기둥 사이의 각 ㄱㄴㄷ은 몇 도일까요?", deco: g => { g.append(svgEl("rect", { x: 0, y: 402, width: 800, height: 198, fill: "#E7F2DE" }), a2Line([400, 130], [400, 330], { stroke: "#8795A1", "stroke-width": 3 }), svgEl("rect", { x: 376, y: 330, width: 48, height: 12, rx: 3, fill: "#E47A38" })); } }], ok: "그네 기둥 사이의 각 ㄱㄴㄷ은 50°예요." }) },
    { name: "그려 보기 — 여러 가지 각 재기", inst: "놀이기구에서 찾은 각이에요. 각도기로 각도를 재어 보세요. ②는 각도기가 미리 놓여 있어요.", hints: ["각이 직각보다 작은지 큰지 먼저 생각하면 어느 눈금을 읽을지 알 수 있어요.", "한 변이 맞춰진 쪽의 0에서부터 10, 20, 30… 세어 가요."],
      render: (b, a) => a2sMeasure(b, a, { items: [{ d1: 0, a: 35, ask: "① 시소 판과 땅이 이루는 각도를 재어 보세요." }, { d1: 20, a: 110, placed: true, ask: "② 미끄럼틀 손잡이가 꺾인 각도를 읽어 보세요. 각도기가 놓여 있어요." }, { d1: 90, a: 75, ask: "③ 각도기를 돌려 밑금을 한 변에 맞추고 재어 보세요." }], ok: "① 35° ② 110° ③ 75°를 바르게 쟀어요." }) },
    { name: "말해 보기 — 바르게 재는 방법", inst: "각도기를 바르게 쓰는 방법을 골라 보고, 까닭을 한 줄로 써 보세요.", hints: ["중심은 꼭짓점에, 밑금은 한 변에 맞춰야 해요.", "각이 직각보다 작으면 90보다 작은 수를 읽어요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "각도기를 바르게 놓은 것은?", fig: () => a2Row(a2ProtFig({ d1: 0, a: 70 }, { V: [280, 280], rot: 12, extra: s => s.append(txt(26, 26, "가", 26)) }), a2ProtFig({ d1: 0, a: 70 }, { V: [280, 280], C: [240, 280], extra: s => s.append(txt(26, 26, "나", 26)) }), a2ProtFig({ d1: 0, a: 70 }, { V: [280, 280], extra: s => s.append(txt(26, 26, "다", 26)) })),
          o: ["가", "나", "다"], a: 2, why: { "0": "가는 각도기의 밑금이 각의 한 변에 맞지 않아요.", "1": "나는 각도기의 중심이 꼭짓점에서 벗어나 있어요." } },
        { q: "다의 각의 크기는?", fig: () => a2ProtFig({ d1: 0, a: 70 }, { V: [280, 280] }), o: ["70°", "110°"], a: 0, why: { "1": "한 변이 안쪽 눈금 0에 맞춰져 있으니 안쪽 눈금을 읽어요. 이 각은 직각보다 작아요." } }], { ok: "다처럼 중심과 밑금을 맞추고, 0에서 시작하는 쪽 눈금을 읽으면 70°예요." }),
        { q: "이 각을 110°가 아니라 70°로 읽어야 하는 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 이 각이 직각보다 작은지 큰지 봐요. → ② 한 변이 어느 쪽 눈금의 0에 맞춰져 있는지 봐요.", "‘왜냐하면 이 각은 직각보다 ~고, 한 변이 ~ 눈금 0에 맞춰져 있기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 이 각은 직각보다 작고, 한 변이 안쪽 눈금 0에 맞춰져 있어서 안쪽 눈금 70을 읽어야 하기 때문이에요." }) },
    { name: "약속하기 — 1도(°)", inst: "약속: 각의 크기를 나타내는 단위를 알아봐요. 알맞은 말을 골라 약속을 완성해요.", hints: ["직각을 똑같이 나눈 것 중 하나가 1도예요.", "°는 온도의 ℃와 다른 기호예요."],
      render: (b, a) => blanks(b, a, ["각의 크기를 ", { o: ["각도", "길이", "온도"], a: 0 }, "라고 해요. 직각의 크기를 똑같이 ", { o: ["90", "100", "180"], a: 0 }, "으로 나눈 것 중 하나를 1도라 하고, ", { o: ["1°", "1℃", "1 cm"], a: 0 }, "라고 써요. 직각의 크기는 ", { o: ["90°", "100°", "180°"], a: 0 }, "예요."]) },
    { name: "확인하기 — 놓인 모양이 달라도", inst: "놓인 모양이 다른 각을 재어 보세요. 각의 모양에 따라 각도기를 돌려서 대요.", hints: ["각도기를 돌려 밑금을 한 변에 맞춰요. ‘반 바퀴’ 단추로 뒤집을 수 있어요.", "변이 짧으면 ‘자로 변 늘이기’를 눌러요."],
      render: (b, a) => a2sMeasure(b, a, { items: [{ d1: 210, a: 125, V: [400, 210], ask: "④ 꼭짓점이 위에 있는 각이에요. 각도를 재어 보세요." }, { d1: 340, a: 65, V: [300, 330], ask: "⑤ 각도를 재어 보세요." }, { d1: 40, a: 100, short: true, V: [400, 380], ask: "⑥ 변이 짧아요. 변을 늘여서 재어 보세요." }], ok: "④ 125° ⑤ 65° ⑥ 100°를 바르게 쟀어요." }) }
  ],
  challenge: { inst: "설계도에 그린 놀이기구의 각도를 재어 보세요.", hints: ["두 부분이 이루는 각의 꼭짓점을 먼저 찾아요.", "직각과 비교하면 어느 눈금을 읽을지 알 수 있어요."],
    render: (b, a) => a2sMeasure(b, a, { items: [
      { d1: 0, a: 75, ask: "미끄럼틀 사다리와 땅이 이루는 각도는?", color: "#6E7C86", deco: a2sGround(324) },
      { d1: 0, a: 90, ask: "철봉 기둥과 땅이 이루는 각도는?", color: "#2E8B57", deco: a2sGround(324) },
      { d1: 0, a: 120, ask: "흔들의자 등받이와 앉는 판이 이루는 각도는?", color: "#B4610F" }], ok: "사다리 75°, 철봉 90°, 흔들의자 120°예요." }) }
},
{
  id: "s4", no: 4, title: "놀이기구 각 나누기 ― 예각과 둔각", soop: "개념 구축하기(O)",
  question: "놀이기구의 각을 직각과 비교하면 어떻게 나눌 수 있을까요?",
  summary: "각도가 0°보다 크고 직각보다 작은 각을 예각, 각도가 직각보다 크고 180°보다 작은 각을 둔각이라고 해요. 직각(90°)은 예각도 둔각도 아니에요. 예각과 둔각은 변의 길이나 놓인 방향과 상관없이 각의 크기로 정해요.",
  steps: [
    { name: "만져 보기 — 직각과 비교해 나누기", inst: "수아 모둠이 놀이기구에서 찾은 각이에요. 카드를 하나씩 눌러 고르고 직각보다 작은 각, 직각, 직각보다 큰 각으로 나누어 보세요.", hints: ["‘삼각자 직각 대 보기’를 누르면 직각과 비교할 수 있어요.", "파란 직각보다 덜 벌어지면 직각보다 작은 각, 더 벌어지면 직각보다 큰 각이에요."],
      render: (b, a) => a2sSorter(b, a, { cats: ["직각보다 작은 각", "직각", "직각보다 큰 각"], items: [
        { label: "가 · 정글짐", d1: 0, a: 90, cat: 1, why: "가(정글짐 기둥과 가로 막대)는 삼각자의 직각과 꼭 맞아요." },
        { label: "나 · 시소", d1: 160, a: 25, cat: 0, why: "나(시소 판과 땅)는 직각보다 훨씬 덜 벌어져 있어요." },
        { label: "다 · 미끄럼틀 위", d1: 200, a: 130, cat: 2, why: "다는 삼각자의 직각보다 더 벌어져 있어요." },
        { label: "라 · 그네 기둥", d1: 245, a: 50, L2r: 1.2, cat: 0, why: "라(그네 기둥 사이)는 직각보다 덜 벌어져 있어요." },
        { label: "마 · 흔들의자", d1: 10, a: 110, L2r: .6, cat: 2, why: "마는 직각보다 더 벌어져 있어요. 변이 짧아도 각의 크기는 그대로예요." }], ok: "직각보다 작은 각: 나, 라 / 직각: 가 / 직각보다 큰 각: 다, 마" }) },
    { name: "그려 보기 — 예각·둔각 만들기", inst: "주어진 선분을 한 변으로 하여 직각보다 작은 각과 직각보다 큰 각을 차례로 만들어 보세요. 주황 동그라미를 끌어요.", hints: ["파란 점선이 직각이에요. 직각보다 작게, 또는 크게 벌려요.", "두 변이 일직선이 되면 둔각이 아니에요."],
      render: (b, a) => a2sMaker(b, a, { W: 720, H: 420, V: [360, 360], d1: 0, L: 260, snap: 5, show: true, guide90: true, start: 90, items: [{ kind: "예각", ask: "직각보다 작은 각을 만들어 보세요." }, { kind: "둔각", ask: "직각보다 크고 일직선보다 작은 각을 만들어 보세요." }], ok: "직각보다 작은 각과 큰 각을 만들었어요. 친구가 만든 각과 모양이 달라도 괜찮아요." }) },
    { name: "말해 보기 — 직각에 아주 가까워도", inst: "각도를 직각과 비교해 알맞은 것을 모두 골라요. 그리고 까닭을 써 보세요.", hints: ["직각은 90°예요.", "1°만 달라도 직각보다 작거나 큰 각이에요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "직각보다 작은 각도를 모두 골라요.", o: ["15°", "90°", "89°", "135°", "100°"], a: [0, 2] },
        { q: "직각보다 크고 180°보다 작은 각도를 모두 골라요.", o: ["15°", "90°", "89°", "135°", "100°"], a: [3, 4] }], { bad: "90°와 하나씩 비교해 봐요. 90°는 직각이에요.", ok: "15°, 89°는 직각보다 작고, 135°, 100°는 직각보다 커요." }),
        { q: "89°는 직각에 아주 가까운데도 왜 직각보다 작은 각일까요?", ph: "왜냐하면 ~", help: ["① 직각이 몇 도인지 떠올려요. → ② 89°와 90°를 비교해요.", "‘왜냐하면 직각은 ~°이고 89°는 그보다 ~ 작기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 직각은 90°이고, 89°는 90°보다 1°만큼 작기 때문이에요." }) },
    { name: "약속하기 — 예각과 둔각", inst: "약속: 직각보다 작은 각과 큰 각의 이름을 알아봐요. 알맞은 말을 골라 약속을 완성해요.", hints: ["예각은 ‘뾰족한 각’, 둔각은 ‘무딘 각’이라는 뜻이에요."],
      render: (b, a) => blanks(b, a, ["각도가 0°보다 크고 직각보다 작은 각을 ", { o: ["예각", "둔각", "직각"], a: 0 }, "이라고 해요. 각도가 직각보다 크고 ", { o: ["180°", "360°", "100°"], a: 0 }, "보다 작은 각을 ", { o: ["둔각", "예각", "직각"], a: 0 }, "이라고 해요. 90°는 ", { o: ["예각도 둔각도 아니에요", "예각이에요"], a: 0 }, "."]) },
    { name: "확인하기 — 놀이터 시계탑", inst: "놀이터에 세울 시계탑을 설계해요. 시각을 시계에 나타내고, 긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 예각인지 둔각인지 골라 보세요.", hints: ["정각이면 긴바늘은 12를, 30분이면 6을 가리켜요.", "30분일 때 짧은바늘은 두 수의 한가운데에 있어요."],
      render: (b, a) => a2sClock(b, a, { items: [{ h: 10, m: 0 }, { h: 1, m: 30 }], ok: "10시는 예각(60°), 1시 30분은 둔각(135°)이에요." }) }
  ],
  challenge: { inst: "놀이터 안내판처럼 한 점에서 그은 반직선 4개로 만든 그림이에요. 예각과 둔각은 각각 몇 개인가요?", hints: ["반직선을 두 개씩 짝 지어 생기는 각을 모두 살펴봐요.", "두 반직선이 일직선이면 예각도 둔각도 아니에요."],
    render: (b, a) => { b.append(a2Fig(560, 270, s => { const V = [280, 230]; [0, 50, 120, 180].forEach(d => s.append(a2Line(V, a2Pt(V, d, 240)))); s.append(svgEl("circle", { cx: V[0], cy: V[1], r: 6, fill: INK })); }, "24em"));
      numbers(b, a, [{ q: "예각은 모두 몇 개인가요?", a: 3, unit: "개", why: { "2": "이웃한 두 각뿐 아니라 다른 짝도 살펴봐요." } }, { q: "둔각은 모두 몇 개인가요?", a: 2, unit: "개", why: { "3": "일직선(180°)은 둔각이 아니에요.", "1": "두 각을 합친 큰 각도 살펴봐요." } }], { ok: "예각 3개(50°, 70°, 60°), 둔각 2개(120°, 130°)예요." }); } }
},
{
  id: "s5", no: 5, title: "눈대중 각도왕 ― 각도 어림하기", soop: "개념 구축하기(O)",
  question: "각도기 없이 놀이기구의 각도를 어떻게 어림할 수 있을까요?",
  summary: "각도를 어림할 때는 직각(90°)이나 삼각자의 30°, 45°, 60°처럼 크기를 아는 각과 비교해요. 어림한 각도는 ‘약 ○°’라고 나타내고, 각도기로 재어 확인해요. 잰 각도에 가깝게 어림할수록 잘 어림한 거예요.",
  steps: [
    { name: "만져 보기 — 어림하고 재기", inst: "민재가 ‘눈대중 각도왕’ 놀이를 열었어요. 먼저 내 어림 방법을 예상해 쓰고, 시소와 사다리의 각을 어림한 다음 각도기로 재어 확인해 보세요.", hints: ["삼각자의 각 단추를 눌러 대 보세요. 시소의 각은 30°보다 조금 작아 보여요.", "사다리의 각은 60°보다 크고 직각보다 조금 작아 보여요."],
      render: ruleFirst((b, a) => a2sMeasure(b, a, { items: [
        { d1: 0, a: 25, est: true, ask: "시소 판이 땅과 이루는 각을 어림하고 재어 보세요.", color: "#C9962A", deco: a2sGround(324) },
        { d1: 0, a: 75, est: true, ask: "사다리가 땅과 이루는 각을 어림하고 재어 보세요.", color: "#6E7C86", deco: a2sGround(324) }], ok: "시소는 25°, 사다리는 75°예요. 아는 각과 비교하면 잰 각도에 가깝게 어림할 수 있어요." }),
        { q: "각도를 잘 어림하려면 무엇과 비교하면 좋을까요?", ph: "내 예상: ~과 비교하면 좋을 것 같아요", help: ["① 크기를 이미 아는 각을 떠올려요. → ② 어림할 각이 그 각보다 큰지 작은지 생각해요.", "‘내 예상: ~처럼 크기를 아는 각과 비교하면 좋을 것 같아요.’ 꼴로 써요."], ans: "직각(90°)이나 삼각자의 30°, 45°, 60°처럼 크기를 아는 각과 비교하면 잘 어림할 수 있어요." }) },
    { name: "그려 보기 — 어림해 만들기", inst: "각도기를 보지 않고 어림해서 각을 만들어 보세요. 손을 떼고 기다리면 실제 각도가 보여요. (10°까지 차이는 괜찮아요)", hints: ["35°는 30°보다 조금 커요. 직각의 3분의 1쯤보다 조금 더 벌려요.", "140°는 직각보다 직각의 절반쯤 더 벌어진 각이에요."],
      render: (b, a) => a2sMaker(b, a, { W: 720, H: 420, V: [300, 360], d1: 0, L: 260, snap: 1, show: false, start: 10, items: [{ target: 35, est: 10, ask: "약 35°인 각을 만들어 보세요." }, { target: 140, est: 10, ask: "약 140°인 각을 만들어 보세요." }], ok: "어림해서 각을 만들었어요. 어림한 각과 실제 각도를 비교해 보세요." }) },
    { name: "말해 보기 — 어림한 까닭", inst: "어림한 까닭을 완성하고, ‘약’을 붙이는 까닭을 써 보세요.", hints: ["삼각자의 각 30°, 45°, 60°, 90° 중 어느 각과 가까운지 생각해요."],
      render: thenWhy((b, a) => blanks(b, a, ["시소의 각은 삼각자의 ", { o: ["30°", "60°", "90°"], a: 0 }, "보다 조금 작은 것 같아서 약 25°로 어림했어요. 사다리의 각은 ", { o: ["60°", "30°"], a: 0 }, "보다 크고 ", { o: ["직각", "45°"], a: 0 }, "보다 조금 작은 것 같아서 약 75°로 어림했어요."]),
        { q: "어림한 각도에 왜 ‘약’을 붙일까요?", ph: "왜냐하면 ~", help: ["① 어림은 어떻게 한 것인지 떠올려요. → ② 어림한 값이 정확한 값인지 생각해요.", "‘왜냐하면 어림한 각도는 ~ 값이라 ~이 아니기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 어림한 각도는 눈으로 짐작한 값이라 정확한 각도가 아니기 때문이에요." }) },
    { name: "약속하기 — 어림하는 방법", inst: "약속: 각도를 어림하는 방법을 정리해요. 알맞은 말을 골라 보세요.", hints: ["어림한 값은 정확한 값이 아니라서 ‘약’을 붙여요."],
      render: (b, a) => blanks(b, a, ["어림한 각도는 ", { o: ["약 40°", "정확히 40°"], a: 0 }, "처럼 나타내요. 어림할 때는 ", { o: ["삼각자의 30°, 45°, 60°와 직각 90°", "각의 변의 길이"], a: 0 }, "를 기준으로 비교하고, ", { o: ["각도기로 재어", "다시 어림해"], a: 0 }, " 확인해요."]) },
    { name: "확인하기 — 각도왕 도전", inst: "각도를 어림해 보고, 각도기로 재어 확인해 보세요.", hints: ["①은 45°와 60° 사이, ②는 직각보다 직각의 3분의 1쯤 더 큰 각이에요.", "잰 각도와 어림한 각도의 차이를 비교해 봐요."],
      render: (b, a) => a2sMeasure(b, a, { items: [{ d1: 200, a: 55, V: [520, 200], est: true, ask: "① 어림하고 재어 보세요." }, { d1: 20, a: 115, est: true, ask: "② 어림하고 재어 보세요." }], ok: "① 55° ② 115°예요. 어림한 각도와 잰 각도를 비교해 보세요." }) }
  ],
  challenge: { inst: "‘눈대중 각도왕’ 결승이에요. 누가 더 잘 어림했는지 찾아보세요.", hints: ["잰 각도와 어림한 각도의 차이를 구해요.", "차이가 작을수록 잘 어림한 거예요."],
    render: (b, a) => quiz(b, a, [
      { q: "민재는 약 60°, 지유는 약 80°로 어림했어요. 각도기로 재어 보니 그림과 같았어요. 어림을 더 잘한 사람은?", fig: () => a2ProtFig({ d1: 0, a: 65 }, { V: [280, 280] }), o: ["민재", "지유"], a: 0, why: { "1": "잰 각도는 65°예요. 민재는 5°, 지유는 15° 차이가 나요." } },
      { q: "미끄럼틀 각이 120°였어요. 하린 약 110°, 서준 약 125°, 도윤 약 135°로 어림했어요. 가장 잘 어림한 사람은?", o: ["하린", "서준", "도윤"], a: 1, why: { "0": "하린이는 10°, 서준이는 5° 차이가 나요.", "2": "도윤이는 15° 차이가 나요." } }], { ok: "민재(5° 차이), 서준(5° 차이)이 가장 잘 어림했어요." }) }
},
{
  id: "s6", no: 6, title: "울타리 모서리 각 ― 각도의 합과 차", soop: "개념 구축하기(O)",
  question: "울타리 모서리의 두 각을 이어 붙이거나 겹치면 각도는 어떻게 될까요?",
  summary: "두 각도의 합은 두 각을 꼭짓점과 한 변을 맞대어 이어 붙인 각도와 같아요. 자연수의 덧셈처럼 계산하고 단위 °를 붙여요(55°+40°=95°). 두 각도의 차는 큰 각에 작은 각을 겹쳐 남은 각도와 같아요. 큰 각도에서 작은 각도를 빼요(140°−65°=75°).",
  steps: [
    { name: "만져 보기 — 이어 붙이기", inst: "민재 모둠이 놀이터 울타리 모서리를 만들어요. 55° 판(가)에 40° 판(나)을 이어 붙였어요. 파란 조각 나를 끌어 가의 꼭짓점에 놓고, 이어 붙인 각 다의 각도를 써 보세요.", hints: ["나를 가의 꼭짓점 가까이에 놓으면 저절로 이어 붙어요.", "‘각도기 대 보기’를 눌러 다의 크기를 읽어요."],
      render: (b, a) => a2sJoin(b, a, { mode: "sum", a: 55, b: 40, ok: "이어 붙인 각은 95°예요. 55°+40°=95°와 같아요." }) },
    { name: "그려 보기 — 겹쳐 보기", inst: "모래밭 쪽 울타리 모서리는 140°(가)예요. 그 안에 65° 화단 조각(나)을 꼭짓점과 한 변이 맞게 겹쳐 놓았어요. 겹치지 않고 남은 각 다는 몇 도일까요?", hints: ["나를 가의 꼭짓점 가까이에 놓으면 한 변이 맞게 겹쳐요.", "남은 각은 140°보다 작아요."],
      render: (b, a) => a2sJoin(b, a, { mode: "diff", a: 140, b: 65, ok: "남은 각은 75°예요. 140°−65°=75°와 같아요." }) },
    { name: "말해 보기 — 합과 차 구하는 방법", inst: "각도의 합과 차를 구하는 방법을 골라 보고, 까닭을 써 보세요.", hints: ["각도의 계산은 수의 계산과 같고 끝에 °를 붙여요.", "겹치고 남은 각은 큰 각보다 작아요."],
      render: thenWhy((b, a) => blanks(b, a, ["두 각도의 합은 ", { o: ["자연수의 덧셈", "자연수의 뺄셈"], a: 0 }, "과 같은 방법으로 계산하고 단위 °를 붙여요. 두 각도의 차는 ", { o: ["큰 각도에서 작은 각도를", "작은 각도에서 큰 각도를"], a: 0 }, " 빼서 구해요."]),
        { q: "이어 붙인 각을 구할 때 왜 두 각도를 더할까요?", ph: "왜냐하면 ~", help: ["① 이어 붙인 각이 어떤 두 각으로 이루어졌는지 봐요. → ② 빈틈이나 겹치는 곳이 있는지 생각해요.", "‘왜냐하면 이어 붙인 각은 두 각을 ~ 합친 크기이기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 이어 붙인 각은 두 각을 빈틈없이, 겹치지 않게 합친 크기이기 때문이에요." }) },
    { name: "약속하기 — 각도의 합과 차", inst: "약속: 각도의 합과 차를 정리해요. 알맞은 수를 골라 보세요.", hints: ["55+40, 140−65를 계산해요."],
      render: (b, a) => blanks(b, a, ["55°+40°=", { o: ["95°", "15°", "85°"], a: 0 }, "처럼 두 각도의 합은 수끼리 더하고 °를 붙여요. 140°−65°=", { o: ["75°", "85°", "205°"], a: 0 }, "처럼 두 각도의 차는 큰 각도에서 작은 각도를 빼고 °를 붙여요."]) },
    { name: "확인하기 — 울타리 각 계산", inst: "울타리 모서리의 각도를 계산해 보세요.", hints: ["받아올림과 받아내림에 주의해요.", "답에는 ° 단위가 붙어요. 수만 써요."],
      render: (b, a) => numbers(b, a, [
        { q: "68° + 47° =", a: 115, unit: "°", why: { "105": "일의 자리 8+7=15라서 받아올림을 해요." } }, { q: "85° + 95° =", a: 180, unit: "°" },
        { q: "132° − 58° =", a: 74, unit: "°", why: { "126": "일의 자리에서 8−2를 하면 안 돼요. 2에서 8을 뺄 수 없으니 받아내림을 해요." } }, { q: "175° − 90° =", a: 85, unit: "°" }], { ok: "115°, 180°, 74°, 85°예요." }) }
  ],
  challenge: { inst: "빙글빙글 도는 회전 놀이기구의 바닥판을 만들어요. 직각 조각을 한 장씩 붙이며 붙인 조각이 이루는 각도를 쓰고, 문제를 해결해 보세요.", hints: ["조각 한 장의 각은 직각 90°예요.", "4장을 붙이면 한 점을 중심으로 한 바퀴를 돌아요."],
    render: (b, a) => a2Chain(b, a, [
      (bx, ax) => a2sPinwheel(bx, ax, { ok: "90°, 180°, 270°, 360°예요. 180°는 두 변이 일직선, 360°는 한 바퀴예요." }),
      (bx, ax) => quiz(bx, ax, [
        { q: "그네가 뒤로 35°, 앞으로 50° 흔들렸어요. 뒤 끝에서 앞 끝까지 그네 줄이 움직인 각도는?", o: ["85°", "15°", "75°"], a: 0, why: { "1": "뒤로 간 각과 앞으로 간 각을 이어 붙인 각이에요. 더해요." } },
        { q: "미끄럼틀이 바닥과 이루는 각을 45°에서 30°로 낮추었어요. 몇 도 낮추었나요?", o: ["15°", "75°", "25°"], a: 0, why: { "1": "낮춘 각도는 두 각도의 차예요. 빼요." } }], { ok: "35°+50°=85°, 45°−30°=15°예요." })]) }
},
{
  id: "s7", no: 7, title: "삼각형 화단 ― 세 각의 크기의 합", soop: "개념 구축하기(O)",
  question: "삼각형 화단의 모양과 크기가 달라지면 세 각의 크기의 합도 달라질까요?",
  summary: "삼각형의 세 각의 크기의 합은 180°예요. 삼각형의 크기와 모양이 달라도 세 각의 크기의 합은 언제나 180°예요. 세 각을 잘라 한 점에 모으면 일직선이 돼요. 두 각의 크기를 알면 180°에서 두 각을 빼서 나머지 한 각을 구해요.",
  steps: [
    { name: "만져 보기 — 세 각 재기", inst: "지유 모둠이 설계한 삼각형 화단이에요. 각도기로 세 각의 크기를 각각 재고 더해 보세요.", hints: ["꼭짓점마다 각도기의 중심과 밑금을 맞춰요.", "회색 점선은 변을 늘인 선이에요. 밑금을 맞추기 쉬워요."],
      render: (b, a) => a2Chain(b, a, [
        (bx, ax) => a2sMeasure(bx, ax, { W: 900, H: 600, items: a2PolyItems(A2S_TRI, [45, 60, 75]).map((it, i) => Object.assign(it, { placed: i === 2, ask: ["왼쪽 아래 각을 재어 보세요.", "오른쪽 아래 각을 재어 보세요.", "위쪽 각을 읽어 보세요(각도기가 놓여 있어요)."][i], deco: a2sPolyDeco(A2S_TRI, "#E9F5DD") })), ok: "세 각은 45°, 60°, 75°예요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "45° + 60° + 75° =", a: 180, unit: "°" }], { ok: "세 각의 크기의 합은 180°예요." })]) },
    { name: "그려 보기 — 화단 모양 바꾸기", inst: "꼭짓점(동그라미)을 끌어 화단의 모양과 크기를 여러 가지로 바꾸어 보세요. 먼저 예상을 쓰고, 세 각의 크기의 합을 써 보세요.", hints: ["한 꼭짓점을 움직이면 어떤 각은 커지고 어떤 각은 작아져요.", "아래의 합을 잘 봐요."],
      render: ruleFirst((b, a) => a2sSum(b, a, { mode: "drag", angles: [60, 80, 40], lens: [10], W: 860, H: 470, fill: "#F2F8EA", ok: "모양과 크기가 달라져도 세 각의 크기의 합은 언제나 180°예요." }),
        { q: "화단의 모양과 크기를 바꾸면 세 각의 크기의 합은 어떻게 될까요?", ph: "내 예상: ~", help: ["① 화단이 커지면 각도 커질지 생각해요. → ② 한 각이 커질 때 다른 각은 어떻게 될지 생각해요.", "‘내 예상: 모양을 바꾸면 세 각의 합은 (달라질 / 그대로일) 것 같아요.’ 꼴로 써요."], ans: "삼각형의 모양과 크기가 달라져도 세 각의 크기의 합은 언제나 180°예요." }) },
    { name: "말해 보기 — 잘라 붙이기", inst: "종이로 만든 화단 모형의 세 각을 잘라 한 점에 모아 보세요. 모서리를 하나씩 눌러요. 그리고 까닭을 써 보세요.", hints: ["세 조각이 겹치지 않게 변과 변을 이어 붙여요.", "세 각이 모여 일직선이 돼요."],
      render: thenWhy((b, a) => a2sSum(b, a, { mode: "tear", angles: [50, 75, 55], lens: [10], W: 880, H: 470, ok: "세 각을 모으면 일직선이 되어 180°예요." }),
        { q: "세 각을 한 점에 모으면 왜 합이 180°라고 할 수 있나요?", ph: "왜냐하면 ~", help: ["① 세 각을 모았을 때 생긴 모양을 봐요. → ② 그 모양이 이루는 각이 몇 도인지 떠올려요.", "‘왜냐하면 세 각을 모으면 ~이 되는데, ~이 이루는 각은 ~°이기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 세 각을 모으면 일직선이 되는데, 일직선이 이루는 각은 180°이기 때문이에요." }) },
    { name: "약속하기 — 삼각형 세 각의 합", inst: "약속: 삼각형의 세 각의 크기의 합을 정리해요. 알맞은 말을 골라 보세요.", hints: ["일직선이 이루는 각은 180°예요."],
      render: (b, a) => blanks(b, a, ["삼각형의 세 각의 크기의 합은 ", { o: ["180°", "360°", "90°"], a: 0 }, "예요. 삼각형의 크기와 모양이 달라도 세 각의 크기의 합은 ", { o: ["같아요", "달라요"], a: 0 }, ". 두 각을 알면 180°에서 두 각을 ", { o: ["빼서", "더해서"], a: 0 }, " 나머지 한 각을 구해요."]) },
    { name: "확인하기 — 화단의 빈 각", inst: "삼각형 화단 설계도에서 □ 안에 알맞은 수를 써넣으세요.", hints: ["180°에서 주어진 두 각을 빼요.", "□ + 40° + 75° = 180°처럼 생각해도 돼요."],
      render: (b, a) => { b.append(a2Row(a2PolyFig([40, 75, 65], [10], ["40°", "75°", "㉠"]), a2PolyFig([100, 30, 50], [10], ["100°", "㉡", "50°"])));
        numbers(b, a, [{ q: "㉠ =", a: 65, unit: "°", why: { "140": "180°에서 40°만 뺐어요. 75°도 빼요." } }, { q: "㉡ =", a: 30, unit: "°", why: { "80": "180°에서 100°만 뺐어요. 50°도 빼요." } }], { ok: "㉠ 180°−40°−75°=65°, ㉡ 180°−100°−50°=30°예요." }); } }
  ],
  challenge: { inst: "삼각형의 세 각의 크기의 합을 이용해 화단 문제를 해결해 보세요.", hints: ["⌞ 표시는 직각(90°)이에요.", "잘라 붙인 세 각을 모으면 180°예요."],
    render: (b, a) => a2Chain(b, a, [
      (bx, ax) => { bx.append(a2Row(a2PolyFig([90, 25, 65], [10], ["R", "25°", "㉠"]), a2Fig(560, 360, s => { const T = [280, 260]; [[0, 70], [70, 50], [120, 60]].forEach(([s0, aa], i) => { s.append(svgEl("path", { d: a2WedgeD(T, s0, s0 + aa, 150), fill: A2_FILL[i], stroke: A2_COL[i], "stroke-width": 3 })); const q = a2Pt(T, s0 + aa / 2, 105); s.append(txt(q[0], q[1], i < 2 ? `${aa}°` : "□", 24)); }); s.append(a2Line([40, 260], [520, 260], { stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "10 6" })); }, "24em")));
        numbers(bx, ax, [{ q: "직각삼각형 화단에서 ㉠ =", a: 65, unit: "°", why: { "155": "직각 90°도 세 각 중 하나예요. 90°도 빼요." } }, { q: "잘라 붙인 세 각에서 □ =", a: 60, unit: "°" }], { ok: "㉠=180°−90°−25°=65°, □=180°−70°−50°=60°예요." }); },
      (bx, ax) => quiz(bx, ax, [{ q: "도윤이가 “큰 화단은 세 각의 크기의 합도 더 커.”라고 말했어요. 바르게 고친 말은?", o: ["화단의 크기가 달라도 세 각의 크기의 합은 180°로 같아요", "큰 삼각형일수록 세 각의 크기의 합이 커요", "작은 삼각형은 세 각의 크기의 합이 90°예요"], a: 0 }], { ok: "삼각형의 크기와 모양이 달라도 세 각의 크기의 합은 언제나 180°예요." })]) }
},
{
  id: "s8", no: 8, title: "사각형 모래밭 ― 네 각의 크기의 합", soop: "개념 구축하기(O)",
  question: "사각형 모래밭의 네 각의 크기의 합은 얼마일까요?",
  summary: "사각형의 네 각의 크기의 합은 360°예요. 네 각을 잘라 한 점에 모으면 빈틈없이 한 바퀴가 되고, 사각형은 삼각형 2개로 나눌 수 있어서 180°+180°=360°예요. 세 각의 크기를 알면 360°에서 세 각을 빼서 나머지 한 각을 구해요.",
  steps: [
    { name: "만져 보기 — 네 각 재기", inst: "서준 모둠이 설계한 사각형 모래밭이에요. 네 각의 크기를 각각 재고 더해 보세요.", hints: ["회색 점선(늘인 변)에 밑금을 맞추면 쉬워요.", "각이 직각보다 큰지 작은지 먼저 생각해요."],
      render: (b, a) => a2Chain(b, a, [
        (bx, ax) => a2sMeasure(bx, ax, { W: 900, H: 600, items: a2PolyItems(A2S_QUAD, [70, 95, 110, 85]).map((it, i) => Object.assign(it, { placed: i >= 2, ask: ["왼쪽 아래 각을 재어 보세요.", "오른쪽 아래 각을 재어 보세요.", "오른쪽 위 각을 읽어 보세요(각도기가 놓여 있어요).", "왼쪽 위 각을 읽어 보세요(각도기가 놓여 있어요)."][i], deco: a2sPolyDeco(A2S_QUAD, "#F7E8CC") })), ok: "네 각은 70°, 95°, 110°, 85°예요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "70° + 95° + 110° + 85° =", a: 360, unit: "°" }], { ok: "네 각의 크기의 합은 360°예요." })]) },
    { name: "그려 보기 — 잘라 붙이기", inst: "종이로 만든 모래밭 모형의 네 각을 잘라 한 점에 모아 보세요. 모서리를 하나씩 눌러요.", hints: ["빈틈이나 겹치는 곳이 없게 이어 붙여요.", "네 각이 모여 한 바퀴가 돼요."],
      render: (b, a) => a2sSum(b, a, { mode: "tear", angles: [60, 120, 75, 105], lens: [10, 8], W: 880, H: 470, ok: "네 각을 모으면 빈틈없이 한 바퀴가 되어 360°예요." }) },
    { name: "말해 보기 — 삼각형 2개로 나누기", inst: "삼각형의 세 각의 크기의 합을 이용해 사각형의 네 각의 크기의 합을 구해 보세요. 꼭짓점을 눌러 모래밭을 삼각형 2개로 나누어요.", hints: ["삼각형 하나의 세 각의 크기의 합은 180°예요.", "삼각형이 2개이니 180°를 두 번 더해요."],
      render: thenWhy((b, a) => a2sSum(b, a, { mode: "split", angles: [80, 100, 65, 115], lens: [6, 7], W: 860, H: 450, answerText: "180° + 180° = 360°", ok: "사각형은 삼각형 2개로 나뉘어서 180°+180°=360°예요." }),
        { q: "사각형의 네 각의 크기의 합을 180°+180°로 구할 수 있는 까닭은?", ph: "왜냐하면 ~", help: ["① 사각형을 대각선으로 나누면 무엇이 생기는지 봐요. → ② 그 도형 하나의 각의 합을 떠올려요.", "‘왜냐하면 사각형은 ~ 2개로 나눌 수 있고, ~ 하나의 세 각의 합이 ~°이기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 사각형은 대각선을 그어 삼각형 2개로 나눌 수 있고, 삼각형 하나의 세 각의 크기의 합이 180°이기 때문이에요." }) },
    { name: "약속하기 — 사각형 네 각의 합", inst: "약속: 사각형의 네 각의 크기의 합을 정리해요. 알맞은 말을 골라 보세요.", hints: ["한 바퀴는 360°예요."],
      render: (b, a) => blanks(b, a, ["사각형의 네 각의 크기의 합은 ", { o: ["360°", "180°", "270°"], a: 0 }, "예요. 사각형은 삼각형 ", { o: ["2개", "3개", "4개"], a: 0 }, "로 나눌 수 있어서 180°+180°로 구할 수 있어요. 사각형의 크기와 모양이 달라도 네 각의 크기의 합은 ", { o: ["같아요", "달라요"], a: 0 }, "."]) },
    { name: "확인하기 — 모래밭의 빈 각", inst: "사각형 모래밭 설계도에서 □ 안에 알맞은 수를 써넣으세요.", hints: ["360°에서 주어진 세 각을 빼요."],
      render: (b, a) => { b.append(a2Row(a2PolyFig([65, 120, 75, 100], [6, 4], ["65°", "120°", "75°", "㉠"]), a2PolyFig([95, 85, 110, 70], [6, 5], ["95°", "㉡", "110°", "70°"])));
        numbers(b, a, [{ q: "㉠ =", a: 100, unit: "°", why: { "175": "75°도 빼야 해요. 360°에서 세 각을 모두 빼요." } }, { q: "㉡ =", a: 85, unit: "°", why: { "-95": "180°가 아니라 360°에서 빼요." } }], { ok: "㉠ 360°−65°−120°−75°=100°, ㉡ 360°−95°−110°−70°=85°예요." }); } }
  ],
  challenge: { inst: "사각형의 네 각의 크기의 합을 이용해 문제를 해결해 보세요.", hints: ["모르는 두 각의 합은 360°에서 아는 두 각을 빼요.", "잘라 붙인 네 각은 한 바퀴(360°)가 돼요."],
    render: (b, a) => { b.append(a2Row(a2PolyFig([85, 75, 120, 80], [6, 6], ["㉠", "㉡", "120°", "80°"]), a2Fig(560, 360, s => { const T = [280, 180]; [[0, 95], [95, 100], [195, 75], [270, 90]].forEach(([s0, aa], i) => { s.append(svgEl("path", { d: a2WedgeD(T, s0, s0 + aa, 150), fill: A2_FILL[i], stroke: A2_COL[i], "stroke-width": 3 })); const q = a2Pt(T, s0 + aa / 2, 100); s.append(txt(q[0], q[1], i < 3 ? `${aa}°` : "□", 24)); }); }, "24em")));
      numbers(b, a, [{ q: "㉠ + ㉡ =", a: 160, unit: "°", why: { "-20": "180°가 아니라 360°에서 빼요." } }, { q: "잘라 붙인 네 각에서 □ =", a: 90, unit: "°" }], { ok: "㉠+㉡=360°−120°−80°=160°, □=360°−95°−100°−75°=90°예요." }); } }
},
{
  id: "s9", no: 9, title: "로봇 청소기 길 만들기 ― 회전한 각", soop: "탐구 정리하기(O)",
  question: "로봇 청소기가 놀이기구까지 가도록 회전 각도를 어떻게 정할까요?",
  summary: "로봇이 회전한 각도는 가던 방향을 곧게 늘인 선(보조선)과 새로 가는 길 사이의 각이에요. 왼쪽·오른쪽은 로봇이 가던 방향을 기준으로 정해요. 지도에서 각도기로 이 각을 재면 명령어를 만들 수 있어요. 각도기 재기, 각의 크기 비교, 각도의 합과 차를 모두 써서 길을 정리해요.",
  steps: [
    { name: "만져 보기 — 명령대로 움직이기", inst: "놀이터 바닥의 낙엽을 치울 로봇 청소기 명령어예요. ① 앞으로 4 cm 이동 ② 왼쪽으로 50°만큼 회전하여 3 cm 이동 ③ 오른쪽으로 50°만큼 회전하여 3 cm 이동. 빈칸을 명령대로 정하면 로봇이 움직여요. 어디에 도착할까요?", hints: ["왼쪽·오른쪽은 로봇이 바라보는 방향을 기준으로 정해요.", "회색 점선은 로봇이 가던 방향을 늘인 선이에요."],
      render: (b, a) => a2sTurtle(b, a, { title: "하린이의 명령어를 넣어요", map: a2sMapPark(), cmds: [{ dist: 4 }, { turn: "왼쪽", deg: 50, dist: 3, edit: "both" }, { turn: "오른쪽", deg: 50, dist: 3, edit: "both" }], goals: [{ after: 2, place: "그네" }], ok: "로봇 청소기가 그네에 도착했어요!" }) },
    { name: "그려 보기 — 회전한 각 재기", inst: "로봇이 회전한 곳을 크게 그린 그림이에요. 회색 점선(가던 방향을 늘인 선)과 새 길 사이의 각을 각도기로 재어 보세요.", hints: ["각도기의 밑금을 회색 점선이나 새 길에 맞춰요.", "직각보다 작은지 큰지 먼저 생각해요."],
      render: (b, a) => a2sMeasure(b, a, { items: [
        { d1: 0, a: 50, dash1: true, color: "#C8472E", ask: "그네로 갈 때 ②에서 회전한 각도는?", deco: a2sCameFrom(180, "①에서 온 길") },
        { d1: 250, a: 70, dash2: true, color: "#C8472E", ask: "시소로 갈 때 마지막에 회전한 각도는?", deco: a2sCameFrom(140, "앞에서 온 길") }], ok: "50°, 70°만큼 회전했어요." }) },
    { name: "말해 보기 — 명령어 바꾸기", inst: "이번에는 모래밭의 낙엽을 치워요. ①은 그대로 두고 ②와 ③의 회전 방향과 각도를 정해 보세요.", hints: ["모래밭은 처음 길보다 아래쪽에 있어요. 로봇이 오른쪽으로 돌아야 해요.", "③에서는 처음 이동한 방향과 같은 쪽을 보게 돼요. 오른쪽으로 돈 만큼 왼쪽으로 돌아요."],
      render: (b, a) => a2sTurtle(b, a, { title: "모래밭으로 가는 명령어", map: a2sMapPark(), cmds: [{ dist: 4 }, { turn: "오른쪽", deg: 40, dist: 3, edit: "both" }, { turn: "왼쪽", deg: 40, dist: 3, edit: "both" }], goals: [{ after: 2, place: "모래밭" }], ok: "② 오른쪽 40°, ③ 왼쪽 40°만큼 회전하면 모래밭에 도착해요." }) },
    { name: "약속하기 — 회전한 각", inst: "로봇의 회전 각도를 재는 방법을 정리해요. 알맞은 말을 골라 보세요.", hints: ["로봇이 가던 방향을 곧게 늘인 선이 보조선이에요."],
      render: (b, a) => blanks(b, a, ["로봇이 회전한 각도는 가던 방향을 곧게 늘인 ", { o: ["보조선", "출발선"], a: 0 }, "과 새로 가는 길 사이의 각이에요. 왼쪽과 오른쪽은 ", { o: ["로봇이 가던 방향", "지도의 위쪽"], a: 0 }, "을 기준으로 정해요. 오른쪽으로 40° 돈 다음 왼쪽으로 ", { o: ["40°", "140°"], a: 0 }, " 돌면 처음 방향으로 돌아와요."]) },
    { name: "확인하기 — 시소까지", inst: "로봇 청소기가 시소의 낙엽을 치우도록 명령어를 완성해 보세요. ③의 방향은 이미 정해져 있어요.", hints: ["②에서는 모래밭으로 갈 때처럼 아래쪽 길로 가요.", "③에서 회전한 각은 앞에서 재어 본 각이에요."],
      render: (b, a) => a2sTurtle(b, a, { title: "시소로 가는 명령어", map: a2sMapPark(), cmds: [{ dist: 4 }, { turn: "오른쪽", deg: 40, dist: 3, edit: "both" }, { turn: "오른쪽", deg: 70, dist: 2, edit: "deg" }], goals: [{ after: 2, place: "시소" }], ok: "② 오른쪽 40°, ③ 오른쪽 70°! 시소에 도착했어요." }) }
  ],
  challenge: { inst: "로봇 청소기가 미끄럼틀의 낙엽을 치우도록 ②와 ③의 명령어를 만들어 보세요.", hints: ["미끄럼틀은 그네로 가는 길의 갈림길에서 위쪽으로 꺾여요.", "③에서 가던 방향을 늘인 회색 점선과 미끄럼틀 길 사이의 각을 생각해요."],
    render: (b, a) => a2sTurtle(b, a, { title: "미끄럼틀로 가는 명령어", map: a2sMapPark(), cmds: [{ dist: 4 }, { turn: "왼쪽", deg: 50, dist: 3, edit: "both" }, { turn: "왼쪽", deg: 60, dist: 2, edit: "both" }], goals: [{ after: 2, place: "미끄럼틀" }], ok: "② 왼쪽 50°, ③ 왼쪽 60°만큼 회전하면 미끄럼틀에 도착해요. 처음 방향에서 모두 50°+60°=110°만큼 돌았어요." }) }
},
{
  id: "s10", no: 10, title: "놀이터 바닥 놀이 ― 각을 그려 도착 변까지!", soop: "발표하기(P)",
  question: "주사위 눈에 맞게 예각과 둔각을 그려 도착 변에 먼저 닿으려면 어떻게 해야 할까요?",
  summary: "주사위 눈이 1, 3, 5이면 예각, 2, 4, 6이면 둔각을 그려요. 출발 변이나 앞에 그린 변을 각의 한 변으로 하고, 새 변은 3 cm와 같거나 짧게 점과 점을 이어 그려요. 앞으로 나아가려면 둔각, 방향을 크게 바꾸려면 예각을 그려요.",
  steps: [
    { name: "만져 보기 — 놀이 규칙 알기", inst: "설계단이 놀이터 바닥에 그릴 놀이판을 시험해요. ① 주사위를 굴려 1·3·5가 나오면 예각, 2·4·6이 나오면 둔각을 한 개 그려요. ② 출발 변 또는 앞에 그린 변을 각의 한 변으로 하고, 새 변은 3 cm와 같거나 짧게 두 점을 이어 그려요. ③ 그린 변이 도착 변에 먼저 닿으면 이겨요.", hints: ["홀수 눈은 예각, 짝수 눈은 둔각이에요.", "직각은 예각도 둔각도 아니에요."],
      render: (b, a) => quiz(b, a, [
        { q: "주사위를 굴려 6이 나왔어요. 어떤 각을 그려야 하나요?", o: ["예각", "둔각"], a: 1 },
        { q: "3이 나왔어요. 어떤 각을 그려야 하나요?", o: ["예각", "둔각"], a: 0 },
        { q: "새 변은 어떻게 그려야 하나요?", o: ["3 cm와 같거나 짧게, 점과 점을 이어서", "3 cm보다 길게", "점이 없는 곳에 마음대로"], a: 0 },
        { q: "주사위가 2일 때 직각을 그려도 될까요?", o: ["안 돼요. 직각은 둔각이 아니에요", "돼요"], a: 0 }], { ok: "규칙을 잘 알았어요. 이제 연습해 봐요." }) },
    { name: "그려 보기 — 연습하기", inst: "놀이판에서 둔각 → 예각 → 둔각을 차례로 그려 보세요. 주황 점이 꼭짓점이고, 파란 점선 원 안(3 cm 안)의 점을 누르면 새 변이 그어져요.", hints: ["처음에는 출발 변(빨간 선)이 각의 한 변이에요.", "앞의 변과 새 변 사이의 각을 직각과 비교해요."],
      render: (b, a) => a2Dice(b, a, { seq: ["둔각", "예각", "둔각"], ok: "둔각, 예각, 둔각을 알맞게 그렸어요!" }) },
    { name: "말해 보기 — 놀이하기", inst: "주사위를 굴려 나온 각을 그리며 도착 변까지 가 보세요. 짝과 함께라면 화면을 번갈아 쓰며 누가 더 적은 횟수로 도착하는지 겨루어 봐요.", hints: ["도착 변은 오른쪽 아래에 있어요. 오른쪽으로 나아가는 각을 그려요.", "앞으로 쭉 나아가려면 둔각을, 방향을 바꾸려면 예각을 그려요. 그릴 수 없으면 ‘이번 차례 넘기기’를 눌러요."],
      render: (b, a) => a2Dice(b, a, { game: true }) },
    { name: "약속하기 — 이기는 전략", inst: "놀이를 하며 알게 된 것을 정리해요. 알맞은 말을 고르고, 까닭을 써 보세요.", hints: ["예각은 직각보다 작은 각, 둔각은 직각보다 큰 각이에요.", "꼭짓점에서 앞의 변은 왔던 쪽을 향해요."],
      render: thenWhy((b, a) => blanks(b, a, ["주사위 눈이 1, 3, 5이면 ", { o: ["예각", "둔각"], a: 0 }, ", 2, 4, 6이면 ", { o: ["둔각", "예각"], a: 0 }, "을 그려요. 앞으로 쭉 나아가려면 ", { o: ["둔각", "예각"], a: 0 }, "을 그리고, 새 변은 3 cm에 ", { o: ["가깝게 길게", "될 수 있는 대로 짧게"], a: 0 }, " 그리면 빨리 도착해요."]),
        { q: "앞으로 쭉 나아가려면 왜 둔각을 그리면 좋을까요?", ph: "왜냐하면 ~", help: ["① 꼭짓점에서 앞의 변이 어느 쪽을 향하는지 봐요. → ② 두 변이 많이 벌어지면 새 변이 어느 쪽으로 가는지 생각해요.", "‘왜냐하면 둔각은 두 변이 ~ 벌어져서 새 변이 ~ 쪽으로 뻗기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 둔각은 두 변이 많이 벌어져서, 새 변이 앞의 변과 비슷한 방향으로 계속 뻗어 나가기 때문이에요." }) },
    { name: "확인하기 — 그릴 수 있는 변", inst: "주사위를 굴려 4가 나왔어요. 주황 점을 꼭짓점으로 하여 그릴 수 있는 새 변을 모두 골라 보세요. (점과 점 사이는 1 cm)", hints: ["4는 짝수라서 둔각을 그려야 해요.", "새 변이 3 cm보다 길면 그릴 수 없어요."],
      render: (b, a) => quiz(b, a, [{ q: "그릴 수 있는 새 변은?", fig: () => a2Fig(560, 400, s => { const U = 56, sh = q => [q[0] * U + 28, q[1] * U + 36];
        for (let x = 1; x < 9; x++) for (let y = 0; y < 7; y++) { const p = sh([x, y]); s.append(svgEl("circle", { cx: p[0], cy: p[1], r: 3.5, fill: "#9AA6A0" })); }
        const Pp = sh([5, 3]); s.append(a2Line(sh([2, 3]), Pp, { stroke: BLUE, "stroke-width": 5 }), txt(...sh([3, 3.45]), "앞의 변", 18, { fill: BLUE }));
        [["가", [7, 1], [16, -12]], ["나", [3, 2], [-16, -12]], ["다", [5, 0], [18, 0]], ["라", [8, 4], [18, 8]], ["마", [6, 5], [18, 10]], ["바", [4, 5], [-18, 10]]].forEach(([n, q, o]) => { const Q = sh(q); s.append(a2Line(Pp, Q, { stroke: "#C8472E", "stroke-width": 3.5, "stroke-dasharray": "9 5" }), txt(Q[0] + o[0], Q[1] + o[1], n, 22, { fill: "#C8472E" })); });
        s.append(svgEl("circle", { cx: Pp[0], cy: Pp[1], r: 8, fill: TENT })); }, "26em"),
        o: ["가", "나", "다", "라", "마", "바"], a: [0, 4] },
        { q: "앞의 변을 오른쪽(→)으로 그렸어요. 계속 오른쪽으로 나아가려면 어떤 각을 그려야 할까요?", fig: () => a2Fig(520, 240, s => { const P = [300, 160]; s.append(a2Line([100, 160], P, { stroke: BLUE }), svgEl("circle", { cx: P[0], cy: P[1], r: 8, fill: TENT }), a2Line(P, a2Pt(P, 20, 150), { stroke: "#C8472E", "stroke-dasharray": "10 6" }), txt(200, 140, "앞의 변", 20, { fill: BLUE }), txt(430, 80, "새 변?", 20, { fill: "#C8472E" })); }, "22em"), o: ["둔각", "예각"], a: 0, why: { "1": "예각을 그리면 왔던 쪽으로 되돌아가는 방향이 돼요." } }], { bad: "앞의 변과 새 변 사이의 각이 둔각인지, 새 변이 3 cm와 같거나 짧은지 하나씩 살펴봐요. 직각은 둔각이 아니에요.", ok: "가와 마예요. 나·바는 예각, 다는 직각, 라는 둔각이지만 3 cm보다 길어요. 앞으로 나아가려면 둔각을 그려요." }) }
  ],
  challenge: { name: "또 다른 놀이", inst: "빨대 튕기기 놀이를 해 봐요. 주사위 눈이 1·3·5이면 ‘예각’, 2·4·6이면 ‘둔각’을 외치고 빨대를 튕겨요. 파란 선과 빨대가 이루는 각이 외친 각이면 1점이에요. 5판 동안 맞게 판단해 보세요.", hints: ["빨대와 파란 선이 이루는 주황색 각을 직각과 비교해요."],
    render: (b, a) => a2Flick(b, a, { rounds: 5 }) }
},
{
  id: "s11", no: 11, title: "놀이터 설계도 발표회", soop: "발표하기(P)",
  question: "우리 반 놀이터 설계도에 담긴 각을 친구들에게 어떻게 설명할까요?",
  summary: "각의 크기는 두 변이 벌어진 정도이고, 각도기로 재어 ‘○°’로 나타내요. 예각은 0°보다 크고 직각보다 작은 각, 둔각은 직각보다 크고 180°보다 작은 각이에요. 각도의 합과 차는 수의 덧셈·뺄셈처럼 계산하고, 삼각형의 세 각의 크기의 합은 180°, 사각형의 네 각의 크기의 합은 360°예요.",
  steps: [
    { name: "만져 보기 — 설계도 점검 ① 각도 재기", inst: "발표 전에 설계도를 점검해요. 각의 크기를 비교하고, 각도기로 각도를 재어 보세요.", hints: ["변의 길이가 아니라 두 변이 벌어진 정도를 봐요.", "각이 직각보다 작은지 큰지 먼저 생각하고 눈금을 읽어요."],
      render: (b, a) => a2Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "그네 기둥 사이의 각(가)과 흔들의자의 각(나) 중 더 큰 각은?", fig: () => a2Cards([{ d1: 245, a: 50, L2r: 1 }, { d1: 10, a: 115, L2r: .5, maxL: 120 }], { maxW: "22em" }), o: ["가", "나"], a: 1, why: { "0": "가의 변이 더 길지만, 두 변이 더 많이 벌어진 것은 나예요." } }], { ok: "나가 더 커요." }),
        (bx, ax) => a2sMeasure(bx, ax, { items: [{ d1: 0, a: 35, ask: "설계도의 미끄럼판과 바닥이 이루는 각도를 재어 보세요.", color: "#E47A38", deco: a2sGround(324) }, { d1: 160, a: 130, V: [420, 300], ask: "울타리 모서리의 각도를 재어 보세요." }], ok: "35°, 130°예요." })]) },
    { name: "그려 보기 — 설계도 점검 ② 예각과 둔각", inst: "설계도에 표시한 각을 예각과 둔각으로 나누어 보세요.", hints: ["삼각자의 직각을 대 보세요."],
      render: (b, a) => a2sSorter(b, a, { cats: ["예각", "둔각"], items: [
        { label: "가 · 미끄럼판", d1: 0, a: 35, cat: 0 }, { label: "나 · 울타리", d1: 20, a: 115, cat: 1 }, { label: "다 · 그네 기둥", d1: 245, a: 50, cat: 0 },
        { label: "라 · 화단 모서리", d1: 180, a: 105, L2r: .7, cat: 1 }, { label: "마 · 시소", d1: 0, a: 20, L2r: 1.3, cat: 0 }], ok: "예각: 가, 다, 마 / 둔각: 나, 라" }) },
    { name: "말해 보기 — 설계도 점검 ③ 화단과 울타리", inst: "설계도의 빈 각도를 구해 보세요.", hints: ["삼각형은 180°, 사각형은 360°에서 아는 각을 빼요.", "⌞ 표시는 직각(90°)이에요."],
      render: (b, a) => { b.append(a2Row(a2PolyFig([70, 55, 55], [10], ["70°", "55°", "㉠"]), a2PolyFig([100, 95, 75, 90], [6, 5], ["100°", "㉡", "75°", "R"])));
        numbers(b, a, [{ q: "삼각형 화단에서 ㉠ =", a: 55, unit: "°" }, { q: "사각형 모래밭에서 ㉡ =", a: 95, unit: "°", why: { "185": "⌞ 표시는 직각 90°예요. 90°도 빼야 해요." } }, { q: "울타리 모서리 두 각을 이어 붙였어요. 75° + 48° =", a: 123, unit: "°", why: { "113": "일의 자리 5+8=13이라서 받아올림을 해요." } }], { ok: "㉠ 55°, ㉡ 95°, 75°+48°=123°예요." }); } },
    { name: "약속하기 — 발표회장 가는 길", inst: "로봇 청소기가 발표회장까지 가도록 갈림길마다 맞는 답을 골라 보세요.", hints: ["각도기는 0에서 시작하는 쪽 눈금을 읽어요.", "삼각형은 180°, 사각형은 360°예요."],
      render: (b, a) => a2sMaze(b, a, { goal: "발표회장", gates: [
        { q: "설계도 미끄럼틀의 각도는?", fig: () => a2ProtFig({ d1: 0, a: 35 }, { V: [280, 280], maxW: "20em" }), o: ["35°", "145°"], a: 0, why: "한 변이 안쪽 눈금 0에 맞춰져 있어요. 이 각은 직각보다 작아요." },
        { q: "그네 기둥이 115° 벌어지도록 그렸어요. 이 각은?", o: ["예각", "둔각"], a: 1, why: "115°는 직각보다 커요." },
        { q: "삼각형 화단에서 ? 안에 알맞은 각도는?", fig: () => a2PolyFig([80, 45, 55], [10], ["80°", "45°", "?"], { maxW: "18em" }), o: ["55°", "65°"], a: 0, why: "180°−80°−45°를 계산해요." },
        { q: "125° + 35° = ?", o: ["160°", "90°"], a: 0, why: "합을 구할 때는 더해요." },
        { q: "사각형 모래밭에서 ? 안에 알맞은 각도는?", fig: () => a2PolyFig([90, 90, 75, 105], [6, 5], ["R", "R", "75°", "?"], { maxW: "18em" }), o: ["105°", "95°"], a: 0, why: "360°−90°−90°−75°를 계산해요." }], ok: "35° → 둔각 → 55° → 160° → 105°. 발표회장에 도착했어요!" }) },
    { name: "확인하기 — 설계도 발표하기", inst: "1차시에 붙인 ‘궁금해요’ 쪽지를 다시 보고, 우리 모둠 설계도를 발표할 글을 써 보세요.", hints: ["각도를 숫자와 ° 단위로 정확하게 말해요.", "궁금했던 것을 이 단원에서 배운 말(각도기, 예각, 둔각, 180°, 360°)로 답해요."],
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "우리 모둠 놀이터 설계도에서 각을 이용한 곳 한 가지를 각도와 함께 소개해 보세요.", tag: "설계도 소개", ph: "예) 우리 모둠은 미끄럼틀이 바닥과 이루는 각을 ~°로 정했어요.", help: ["① 놀이기구 하나와 그 각도를 정해요. → ② 그 각도로 정한 까닭을 붙여요.", "‘우리 모둠은 ~의 각을 ~°로 정했어요. 왜냐하면 ~’ 꼴로 써요."], ans: "우리 모둠은 미끄럼틀이 바닥과 이루는 각을 35°로 정했어요. 예각이지만 너무 가파르지 않아 안전하게 내려올 수 있어요." },
        { q: "1차시에 궁금했던 것 하나를 골라, 이제 어떻게 답할 수 있는지 써 보세요.", tag: "궁금증 풀기", ph: "예) ~은 ~해서 알 수 있어요.", help: ["① 위의 쪽지에서 궁금했던 것 하나를 골라요. → ② 이 단원에서 배운 방법으로 답해요.", "‘(궁금했던 것)은 ~하면 알 수 있어요.’ 꼴로 써요."], ans: "미끄럼틀이 기울어진 정도는 각도기의 중심을 꼭짓점에, 밑금을 바닥에 맞추고 0에서 시작하는 쪽 눈금을 읽으면 알 수 있어요." }], { ok: "설계도 발표 준비 끝! 친구들의 발표도 귀 기울여 들어 봐요." })) }
  ],
  challenge: { inst: "설계도에서 가장 큰 각과 가장 작은 각을 찾아 각도를 재고, 두 각도의 합과 차를 구해 보세요. 그리고 각도기 없이 ㉠과 ㉡의 합도 구해 보세요.", hints: ["세 각을 모두 잰 다음 크기를 비교해요.", "삼각형의 세 각의 크기의 합 180°에서 75°를 빼요."],
    render: (b, a) => a2Chain(b, a, [
      (bx, ax) => a2sMeasure(bx, ax, { items: [{ d1: 15, a: 65, ask: "가의 각도를 재어 보세요." }, { d1: 100, a: 25, ask: "나의 각도를 재어 보세요." }, { d1: 200, a: 140, V: [400, 280], ask: "다의 각도를 재어 보세요." }], ok: "가 65°, 나 25°, 다 140°예요." }),
      (bx, ax) => numbers(bx, ax, [{ q: "가장 큰 각과 가장 작은 각의 합:", a: 165, unit: "°", why: { "205": "가장 큰 각(140°)과 가장 작은 각(25°)을 더해요." } }, { q: "가장 큰 각과 가장 작은 각의 차:", a: 115, unit: "°", why: { "75": "가장 큰 각(140°)에서 가장 작은 각(25°)을 빼요." } }], { ok: "140°+25°=165°, 140°−25°=115°예요." }),
      (bx, ax) => { bx.append(a2PolyFig([55, 50, 75], [10], ["㉠", "㉡", "75°"], { maxW: "20em" }));
        numbers(bx, ax, [{ q: "㉠ + ㉡ =", a: 105, unit: "°", why: { "285": "삼각형의 세 각의 크기의 합 180°에서 75°를 빼요." } }], { ok: "180°−75°=105°예요. 삼각형의 세 각의 크기의 합을 이용했어요." }); }]) }
}
];
