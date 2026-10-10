//@@APP
const APP={title:"숲 놀이터 각도", unit:"4-1 수학 2. 각도(교과서)", key:"t41-angle-v1", welcome:"숲 놀이터 각도 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 지안이와 친구들이 만든 숲 놀이터에서 각의 크기를 비교하고, 각도기로 재고, 어림하고, 더하고 빼 봐요."};
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
/* 각도 재기 위젯
   opt: {W, H, items:[{V, d1, a, L, L2, names, short(변이 짧음), placed, est(어림 먼저), deco(g), ask, refs}], tip, ok}
   각마다 수를 쓰고 확인 → 모두 맞히면 done */
function a2Measure(body, api, opt) {
  const W = opt.W || 800, H = opt.H || 600, R = A2_PR, items = opt.items;
  items.forEach(I => { if (!I.V) I.V = [W / 2, H * .54]; });
  const svg = makeSvg(W, H), back = svgEl("g"), angG = svgEl("g"), refG = svgEl("g"), protG = a2ProtG(R);
  svg.append(back, angG, refG, protG);
  let k = 0, C = [W - R - 30, H - 40], rot = 0, extended = false, phase = "measure", est = null;
  const results = [];
  const it = () => items[k];
  const statusEl = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const posEl = h("div", { class: "jua" });
  const inp = h("input", { type: "number", inputmode: "numeric", style: "width:5.5em;font-size:1.2em", "aria-label": "각도" });
  const estInp = h("input", { type: "number", inputmode: "numeric", style: "width:5.5em;font-size:1.2em", "aria-label": "어림한 각도" });
  const askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const measRow = h("div", { class: "qitem" }, h("span", { class: "jua" }, "잰 각도: "), inp, h("span", {}, " °"));
  const refBtns = [30, 45, 60, 90].map(d => h("button", { onclick: e => { toggleRef(d); e.currentTarget.classList.toggle("on"); } }, `${d}°`));
  const estRow = h("div", {}, h("p", { class: "inst", style: "margin:.2em 0" }, "삼각자의 각(30°, 45°, 60°, 90°)을 대 보며 어림해요."), h("div", { class: "tools" }, h("span", {}, "대 보기:"), refBtns),
    h("div", { class: "qitem" }, h("span", { class: "jua" }, "어림한 각도: 약 "), estInp, h("span", {}, " °")),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      const v = Number(estInp.value);
      if (!estInp.value || !(v > 0 && v <= 180)) return api.hint("어림한 각도를 0보다 크고 180보다 작거나 같은 수로 써 봐요.");
      est = v; phase = "measure"; refs.clear(); refBtns.forEach(b => b.classList.remove("on")); draw();
      api.hint(`약 ${v}°로 어림했어요. 이제 각도기를 각에 맞추어 재어 확인해요.`);
    } }, "어림했어요")));
  const refs = new Set();
  const toggleRef = d => { refs.has(d) ? refs.delete(d) : refs.add(d); drawRefs(); };
  const drawRefs = () => {
    refG.innerHTML = ""; const I = it();
    [...refs].forEach((d, j) => {
      const r = Math.min(170, (I.L || 240) * .8);
      refG.append(svgEl("path", { d: a2WedgeD(I.V, I.d1, I.d1 + d, r), fill: "rgba(43,123,214,.13)", stroke: BLUE, "stroke-width": 2, "stroke-dasharray": "8 6" }));
      const q = a2Pt(I.V, I.d1 + d, r + 22); refG.append(txt(q[0], q[1], `${d}°`, 20, { fill: BLUE }));
    });
  };
  const placeProt = () => { protG.setAttribute("transform", `translate(${a2F(C[0])},${a2F(C[1])}) rotate(${a2F(-rot)})`); protG.style.display = phase === "est" ? "none" : ""; posEl.textContent = statusText(); };
  const near = (x, y) => Math.abs(a2N(x - y + 180) - 180);
  const status = () => {
    const I = it(), cOk = a2D(C, I.V) < 2, d2 = I.d1 + I.a;
    const base = near(rot, I.d1) < .6 || near(rot, d2 - 180) < .6, flip = near(rot, I.d1 + 180) < .6 || near(rot, d2) < .6;
    return { cOk, base, flip, ok: cOk && base };
  };
  const statusText = () => { const s = status(); return `중심 ${s.cOk ? "✓ 꼭짓점에 맞음" : "✗"} · 밑금 ${s.base ? "✓ 한 변에 맞음" : s.flip ? "△ 각이 각도기 밖에 있어요" : "✗"}`; };
  const draw = () => {
    const I = it(); back.innerHTML = ""; angG.innerHTML = "";
    if (I.deco) I.deco(back);
    const L1 = I.short ? 110 : (I.L || 250), L2 = I.short ? 110 : (I.L2 || I.L || 250);
    if (I.ext || (I.short && extended)) [I.d1, I.d1 + I.a].forEach(d => angG.append(a2Line(I.V, a2Pt(I.V, d, 262), { stroke: A2_GRAY, "stroke-width": 2.5, "stroke-dasharray": "10 7" })));
    angG.append(a2AngleG({ V: I.V, d1: I.d1, a: I.a, L: L1, L2, sw: 5, names: I.names, arc: 30, noRight: true, fill: I.fillAng, dash1: I.dash1, dash2: I.dash2, color: I.color }));
    askEl.textContent = (items.length > 1 ? `(${k + 1}/${items.length}) ` : "") + (I.ask || "각도기로 각도를 재어 보세요.");
    estRow.style.display = phase === "est" ? "" : "none"; measRow.style.display = phase === "est" ? "none" : "";
    [tools, posEl, tipEl, check].forEach(e => { e.style.display = phase === "est" ? "none" : ""; });
    extBtn.style.display = I.short && !extended ? "" : "none";
    drawRefs(); placeProt();
  };
  const startItem = () => {
    const I = it(); extended = false; est = null; inp.value = ""; estInp.value = ""; refs.clear(); refBtns.forEach(b => b.classList.remove("on"));
    phase = I.est ? "est" : "measure";
    if (I.placed) { C = I.V.slice(); rot = I.d1; } else { C = I.start ? I.start.slice() : [W - R - 30, H - 40]; rot = I.startRot || 0; }
    draw();
  };
  /* 끌기: 각도기 몸통은 옮기기, 주황 손잡이는 돌리기 */
  const local = p => { const dx = p.x - C[0], dy = p.y - C[1], r = a2Rad(rot); return [dx * Math.cos(r) - dy * Math.sin(r), dx * Math.sin(r) + dy * Math.cos(r)]; };
  let dr = null;
  dragOn(svg, p => {
    if (phase === "est") return false;
    const l = local(p);
    const ang0 = Math.atan2(-(p.y - C[1]), p.x - C[0]) * 180 / Math.PI;
    if (Math.hypot(l[0], l[1] + R + 26) < 30) { dr = { mode: "rot", a0: ang0, r0: rot }; return true; }
    const dd = Math.hypot(l[0], l[1]);
    if (l[1] <= 20 && l[1] >= -R - 4 && dd <= R + 4) { dr = dd >= R - 34 && l[1] < -8 ? { mode: "rot", a0: ang0, r0: rot } : { mode: "move", off: [p.x - C[0], p.y - C[1]] }; return true; }
    return false;
  }, p => {
    if (!dr) return;
    if (dr.mode === "move") { C = [Math.max(0, Math.min(W, p.x - dr.off[0])), Math.max(0, Math.min(H, p.y - dr.off[1]))]; }
    else { const ang = Math.atan2(-(p.y - C[1]), p.x - C[0]) * 180 / Math.PI; rot = a2N(dr.r0 + ang - dr.a0); }
    placeProt();
  }, () => { if (!dr) return; dr = null; snap(); placeProt(); });
  const snap = () => {
    const I = it();
    if (a2D(C, I.V) < 22) C = I.V.slice();
    for (const b of [I.d1, I.d1 + 180, I.d1 + I.a, I.d1 + I.a + 180]) if (near(rot, b) < 5) { rot = a2N(b); break; }
  };
  const turn = d => { rot = a2N(rot + d); snap(); placeProt(); };
  const extBtn = h("button", { onclick: () => { extended = true; draw(); api.hint("자로 변을 곧게 늘였어요. 각의 크기는 변의 길이와 상관없어요."); } }, "자로 변 늘이기");
  const tools = h("div", { class: "tools" },
    h("button", { onclick: () => turn(10) }, "⟲ 10°"), h("button", { onclick: () => turn(-10) }, "⟳ 10°"),
    h("button", { onclick: () => turn(1) }, "⟲ 1°"), h("button", { onclick: () => turn(-1) }, "⟳ 1°"),
    h("button", { onclick: () => turn(180) }, "반 바퀴"), extBtn);
  api.provide({ words: ["중심", "꼭짓점", "밑금", "0", "안쪽 눈금", "바깥쪽 눈금"], answers: [items.map(I => `${I.a}°`).join(", ")] });
  const check = h("button", { class: "big", onclick: () => {
    const I = it();
    if (phase === "est") return api.hint("먼저 어림한 각도를 쓰고 ‘어림했어요’를 눌러요.");
    if (!inp.value) return api.hint("각도기 눈금을 읽어 각도를 써 보세요.");
    api.tryOnce(); const v = Number(inp.value), s = status(), ans = `${v}°`;
    if (v === I.a) {
      results.push(I.est ? `어림 약 ${est}° → ${I.a}°` : `${I.a}°`);
      if (k < items.length - 1) {
        api.hint(`○ ${I.a}°가 맞아요!${I.est ? ` (어림 약 ${est}°, 차이 ${Math.abs(est - I.a)}°)` : ""} 다음 각도 재어 봐요.`);
        k++; startItem(); return;
      }
      return api.done(results.join(", "), opt.ok || `모두 바르게 쟀어요! ${results.join(", ")}`);
    }
    let why;
    if (v === 180 - I.a && I.a !== 90) why = `${v}°는 다른 쪽 눈금을 읽은 거예요. 한 변이 0에 맞춰진 쪽 눈금을 읽어요. 이 각은 직각보다 ${I.a < 90 ? "작으니 90보다 작은" : "크니 90보다 큰"} 수를 읽어야 해요.`;
    else if (!s.cOk) why = "각도기의 중심(빨간 점)을 각의 꼭짓점에 꼭 맞추어 다시 재어 봐요.";
    else if (!s.base) why = s.flip ? "각도기를 반 바퀴 돌려 각이 각도기 안쪽에 들어오게 하고, 밑금을 한 변에 맞춰요." : "각도기의 밑금을 각의 한 변에 맞추어 다시 재어 봐요.";
    else why = `눈금을 다시 읽어 봐요. 큰 눈금은 10°, 중간 눈금은 5°, 작은 눈금은 1°씩이에요.`;
    api.fail(why, ans);
  } }, "확인하기");
  const tipEl = h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || "각도기 가운데를 끌면 옮겨지고, 눈금이 있는 가장자리나 주황 손잡이(↻)를 끌면 돌아가요. 가까이 가면 꼭짓점과 변에 착 붙어요.");
  const side = h("div", { class: "side" }, askEl, tipEl, posEl, tools, estRow, measRow, statusEl, h("div", { class: "actions" }, check));
  body.append(stageWrap(svg, side));
  startItem();
}

/* =========================================================
   2. 각 만들기 — 빨간 손잡이를 끌어 둘째 변을 돌린다
   opt: {W,H, V, d1, L, items:[{target | kind:"예각"|"둔각", ask, est(±10 허용)}], snap:1|5, prot(각도기 놓기), show(각도 보이기), skin:"tower", start, ok}
   ========================================================= */
function a2Maker(body, api, opt) {
  const W = opt.W || 760, H = opt.H || 480, V = opt.V || [W / 2, H - 60], d1 = opt.d1 || 0, L = opt.L || 260, sn = opt.snap || 1;
  const svg = makeSvg(W, H), back = svgEl("g"), g = svgEl("g"), top = svgEl("g");
  svg.append(back, g, top);
  let k = 0, ang = opt.start != null ? opt.start : 30, showProt = !!opt.prot, revealed = false;
  const it = () => opt.items[k];
  const out = h("div", { class: "readout" }), askEl = h("p", { class: "jua", style: "margin:.2em 0" });
  const draw = () => {
    g.innerHTML = ""; top.innerHTML = ""; back.innerHTML = "";
    if (opt.deco) opt.deco(back);
    if (showProt) { const pg = a2ProtG(A2_PR, { knob: false }); pg.setAttribute("transform", `translate(${V[0]},${V[1]}) rotate(${-d1})`); pg.style.opacity = .9; back.append(pg); }
    if (opt.guide90) back.append(svgEl("path", { d: a2WedgeD(V, d1, d1 + 90, 90), fill: "rgba(43,123,214,.1)", stroke: BLUE, "stroke-width": 2, "stroke-dasharray": "7 6" }), txt(...a2Pt(V, d1 + 45, 110), "직각", 18, { fill: BLUE }));
    if (opt.skin === "tower") {
      const P = a2Pt(V, d1 + ang, L), w = 34, nx = Math.cos(a2Rad(d1 + ang + 90)) * w, ny = -Math.sin(a2Rad(d1 + ang + 90)) * w;
      g.append(svgEl("polygon", { points: [[V[0] + nx, V[1] + ny], [P[0] + nx, P[1] + ny], [P[0] - nx, P[1] - ny], [V[0] - nx, V[1] - ny]].map(q => q.map(a2F).join(",")).join(" "), fill: "#F4EEDF", stroke: "#9C8A62", "stroke-width": 3 }));
      for (let t = 1; t < 7; t++) { const q = a2Pt(V, d1 + ang, L * t / 7); g.append(a2Line([q[0] + nx, q[1] + ny], [q[0] - nx, q[1] - ny], { stroke: "#B9A880", "stroke-width": 2 })); }
      g.append(a2Line(V, a2Pt(V, d1, L + 20), { stroke: BLUE, "stroke-width": 3, "stroke-dasharray": "10 7" }));
      g.append(svgEl("path", { d: a2ArcD(V, Math.min(d1, d1 + ang), Math.max(d1, d1 + ang), 120), fill: "none", stroke: TENT, "stroke-width": 3 }));
    } else g.append(a2AngleG({ V, d1, a: ang, L, sw: 6, arc: 38, noRight: !opt.markRight }));
    const P = a2Pt(V, d1 + ang, L);
    top.append(svgEl("circle", { cx: a2F(P[0]), cy: a2F(P[1]), r: 16, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }));
    const I = it();
    askEl.textContent = (opt.items.length > 1 ? `(${k + 1}/${opt.items.length}) ` : "") + (I.ask || (I.target != null ? `${I.target}°인 각을 만들어 보세요.` : `${I.kind}을 만들어 보세요.`));
    out.textContent = opt.show || revealed ? `지금 각도: ${ang}°` : "지금 각도: ?";
  };
  dragOn(svg, p => {
    const P = a2Pt(V, d1 + ang, L); if (a2D([p.x, p.y], P) > 60 && a2D([p.x, p.y], V) > L + 40) return false; return true;
  }, p => {
    let a = a2N(a2Dir(V, [p.x, p.y]) - d1);
    const maxA = opt.max || 180;
    if (a > maxA) a = a > (maxA + 360) / 2 ? 0 : maxA;
    a = Math.round(a / sn) * sn; ang = Math.max(opt.min != null ? opt.min : 1, a); revealed = false; draw();
  });
  const nudge = d => { ang = Math.max(opt.min != null ? opt.min : 1, Math.min(opt.max || 180, ang + d)); revealed = false; draw(); };
  const tools = h("div", { class: "tools" }, h("button", { onclick: () => nudge(sn) }, `⟲ ${sn}°`), h("button", { onclick: () => nudge(-sn) }, `⟳ ${sn}°`),
    opt.toggleProt ? h("button", { onclick: e => { showProt = !showProt; e.currentTarget.classList.toggle("on", showProt); draw(); } }, "각도기 대 보기") : null);
  const done = [];
  api.provide({ words: opt.words || ["직각", "예각", "둔각"], answers: [opt.items.map(I => I.target != null ? `${I.target}°` : I.kind).join(", ")] });
  const check = h("button", { class: "big", onclick: () => {
    const I = it(); api.tryOnce(); let good, why;
    if (I.target != null) {
      const tol = I.est ? I.est : 1; good = Math.abs(ang - I.target) <= tol;
      if (!good) why = I.est ? `조금 더 ${ang < I.target ? "벌려" : "좁혀"} 봐요. 삼각자의 ${I.target < 45 ? "30°와 45°" : I.target < 60 ? "45°와 60°" : I.target < 90 ? "60°와 90°" : "90°"}를 떠올려요.` : `${I.target}°가 되게 ${ang < I.target ? "조금 더 벌려" : "조금 좁혀"} 봐요. 각도기 눈금을 0에서부터 읽어요.`;
    } else {
      good = a2Kind(ang) === I.kind;
      if (!good) why = ang === 90 ? "지금은 직각이에요. 예각도 둔각도 아니에요." : ang >= 180 ? "두 변이 일직선이 되면 둔각이 아니에요. 180°보다 작게 만들어요." : `지금 만든 각은 ${a2Kind(ang)}이에요. ${I.kind === "예각" ? "직각보다 작게" : "직각보다 크게"} 만들어요.`;
    }
    if (!good) return api.fail(why, `${ang}°`);
    if (I.est) revealed = true;
    done.push(I.target != null ? (I.est ? `${I.target}° 어림 → ${ang}°` : `${ang}°`) : `${I.kind} ${ang}°`); draw();
    if (k < opt.items.length - 1) { api.hint(`○ 잘했어요! ${I.est ? `실제로 재면 ${ang}°예요. ` : ""}다음 각도 만들어 봐요.`); k++; revealed = false; ang = opt.start != null ? opt.start : 30; draw(); return; }
    api.done(done.join(", "), opt.ok || "각을 알맞게 만들었어요!");
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || "주황 동그라미를 끌어 변을 돌려요. 버튼으로 조금씩 돌릴 수도 있어요."), tools, out, h("div", { class: "actions" }, check))));
  draw();
}

/* =========================================================
   3. 각 분류하기 — 카드를 누르고 분류 단추를 누른다. 삼각자의 직각을 대 볼 수 있다
   opt: {cats, items:[{d1,a,L2r,label,name,cat,why}], ok}
   ========================================================= */
function a2Sorter(body, api, opt) {
  const cats = opt.cats || ["예각", "직각", "둔각"], items = opt.items, where = items.map(() => -1);
  let sel = null, sq = false;
  const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(10.5em,1fr));gap:.5em" });
  const cards = items.map((it, i) => {
    const s = makeSvg(220, 170); const sp = a2FitAngle(Object.assign({ sw: 5, fs: 20, L: 1, L2: it.L2r || 1 }, it), 220, 150, 24);
    sp.V = [sp.V[0], sp.V[1] + 16]; s.append(a2AngleG(Object.assign(sp, { noRight: true, arc: 26 })));
    const sqG = svgEl("g", { style: "display:none" });
    sqG.append(svgEl("path", { d: a2WedgeD(sp.V, sp.d1, sp.d1 + 90, 62), fill: "rgba(43,123,214,.18)", stroke: BLUE, "stroke-width": 2, "stroke-dasharray": "6 5" }), a2RightMark(sp.V, sp.d1, 16, { stroke: BLUE }));
    s.append(sqG); s.style.width = "100%"; s.style.display = "block";
    const tag = h("div", { class: "jua", style: "text-align:center;min-height:1.4em" }, "-");
    const btn = h("button", { class: "opt", style: "padding:.3em;text-align:center", onclick: () => { sel = sel === i ? null : i; paint(); } }, h("div", { class: "jua" }, it.label || A2_KO[i]), s, tag);
    grid.append(btn); return { btn, tag, sqG };
  });
  const paint = () => cards.forEach((c, i) => { c.btn.classList.toggle("on", sel === i); c.tag.textContent = where[i] < 0 ? "-" : cats[where[i]]; c.sqG.style.display = sq ? "" : "none"; c.btn.classList.remove("good", "bad"); });
  const tools = h("div", { class: "tools" }, h("span", {}, "고른 카드를 →"), cats.map((c, j) => h("button", { onclick: () => { if (sel == null) return api.hint("먼저 각 카드를 하나 눌러 골라요."); where[sel] = j; sel = null; paint(); } }, c)),
    h("button", { onclick: e => { sq = !sq; e.currentTarget.classList.toggle("on", sq); paint(); } }, "삼각자 직각 대 보기"));
  const lab = i => items[i].label || A2_KO[i];
  api.provide({ words: cats, answers: [cats.map((c, j) => `${c}: ${items.map((it, i) => it.cat === j ? lab(i) : null).filter(Boolean).join(", ") || "없음"}`).join(" / ")] });
  const check = h("button", { class: "big", onclick: () => {
    if (where.some(w => w < 0)) return api.hint("아직 나누지 않은 카드가 있어요. 모든 카드를 나누어요.");
    api.tryOnce(); const ans = cats.map((c, j) => `${c}: ${items.map((it, i) => where[i] === j ? lab(i) : null).filter(Boolean).join(",") || "-"}`).join(" / ");
    const bad = items.map((it, i) => where[i] !== it.cat ? i : -1).filter(i => i >= 0);
    cards.forEach((c, i) => c.btn.classList.add(bad.includes(i) ? "bad" : "good"));
    if (!bad.length) return api.done(ans, opt.ok || "알맞게 나누었어요!");
    const b0 = items[bad[0]];
    api.fail(b0.why || `${lab(bad[0])}${a2J(lab(bad[0]), "은", "는")} ${b0.a}°라서 ${a2Kind(b0.a)}이에요. 삼각자의 직각을 대 보고 다시 나누어 봐요.`, ans);
  } }, "확인하기");
  body.append(...[grid, opt.tip ? h("p", { class: "inst" }, opt.tip) : null, tools, h("div", { class: "actions" }, check)].filter(Boolean));
  paint();
}

/* =========================================================
   4. 투명 종이로 비교하기 (2차시)
   ========================================================= */
function a2Trace(body, api, opt) {
  const W = 880, H = 440, A = opt.A, B = opt.B, svg = makeSvg(W, H);
  const chair = (sp, col) => { const g = svgEl("g"); const P1 = a2Pt(sp.V, sp.d1, sp.L), P2 = a2Pt(sp.V, sp.d1 + sp.a, sp.L2);
    g.append(a2Line(sp.V, P1, { stroke: col, "stroke-width": 16 }), a2Line(sp.V, P2, { stroke: col, "stroke-width": 16 }));
    [.25, .85].forEach(t => { const q = [sp.V[0] + (P1[0] - sp.V[0]) * t, sp.V[1] + (P1[1] - sp.V[1]) * t]; g.append(a2Line(q, [q[0], q[1] + 50], { stroke: col, "stroke-width": 9 })); });
    g.append(a2AngleG({ V: sp.V, d1: sp.d1, a: sp.a, L: sp.L, L2: sp.L2, sw: 3, color: INK, arc: 36, noRight: true }));
    g.append(txt(sp.V[0] - 34, sp.V[1] + 24, sp.label, 26)); return g; };
  svg.append(chair(A, "#C9A27A"), chair(B, "#E8C25A"), txt(A.V[0] + 80, H - 18, A.name, 20), txt(B.V[0] + 100, H - 18, B.name, 20));
  const sheet = svgEl("g", { style: "cursor:grab" }), copy = svgEl("g");
  sheet.append(svgEl("rect", { x: -60, y: -230, width: 300, height: 270, rx: 10, fill: "rgba(200,230,255,.38)", stroke: "#7FA9C9", "stroke-width": 2, "stroke-dasharray": "6 4" }), copy);
  svg.append(sheet);
  const home = [370, 250];
  let traced = false, pos = home.slice(), rot = 0, snapped = false, pick = null;
  const place = () => sheet.setAttribute("transform", `translate(${a2F(pos[0])},${a2F(pos[1])}) rotate(${a2F(-rot)})`);
  const trace = () => {
    copy.innerHTML = ""; const o = [0, 0];
    copy.append(a2Line(o, a2Pt(o, A.d1, A.L), { stroke: "#C8472E", "stroke-width": 4, "stroke-dasharray": "12 6" }), a2Line(o, a2Pt(o, A.d1 + A.a, A.L2), { stroke: "#C8472E", "stroke-width": 4, "stroke-dasharray": "12 6" }), txt(-20, 20, "가", 22, { fill: "#C8472E" }));
    traced = true; pos = A.V.slice(); rot = 0; snapped = false; place();
    msg.textContent = "가를 본떴어요. 투명 종이를 끌어 나에 겹쳐 보세요.";
  };
  let dr = null;
  dragOn(svg, p => { if (!traced) return false; const dx = p.x - pos[0], dy = p.y - pos[1]; dr = { off: [dx, dy] }; return Math.abs(dx) < 260 && Math.abs(dy) < 260; },
    p => { if (!dr) return; pos = [p.x - dr.off[0], p.y - dr.off[1]]; snapped = false; place(); },
    () => { if (!dr) return; dr = null;
      if (a2D(pos, B.V) < 70) { pos = B.V.slice(); rot = B.d1 - A.d1; snapped = true; msg.textContent = "꼭짓점과 한 변을 맞추었어요. 나머지 한 변이 벌어진 정도를 비교해요."; }
      place(); });
  const msg = h("div", { class: "readout", style: "font-size:var(--fs)" }, "먼저 ‘가를 투명 종이에 본뜨기’를 눌러요.");
  const picks = ["가", "나"].map((n, i) => h("button", { class: "opt", onclick: e => { pick = i; picks.forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); } }, n));
  api.provide({ words: ["꼭짓점", "한 변", "벌어진 정도"], answers: [opt.answer] });
  const check = h("button", { class: "big", onclick: () => {
    if (!snapped) return api.hint("투명 종이를 나에 겹쳐 꼭짓점과 한 변을 맞춘 다음 골라요.");
    if (pick == null) return api.hint("더 큰 각을 골라요.");
    api.tryOnce(); const want = A.a > B.a ? 0 : 1;
    if (pick === want) return api.done(["가", "나"][pick], opt.ok);
    api.fail(opt.why || "겹친 그림에서 빨간 점선(가)과 나의 변 중 어느 쪽이 더 많이 벌어졌는지 다시 봐요. 변이 길다고 큰 각이 아니에요.", ["가", "나"][pick]);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, h("div", { class: "tools" }, h("button", { onclick: trace }, "가를 투명 종이에 본뜨기"), h("button", { onclick: () => { if (traced) { pos = home.slice(); rot = 0; snapped = false; place(); } } }, "종이 떼기")), msg,
    h("div", { class: "jua" }, "각의 크기가 더 큰 것은?"), h("div", { class: "opts" }, picks), h("div", { class: "actions" }, check))));
  place();
}

/* =========================================================
   5. 서로 다른 눈금으로 재기 (2차시) — 칸을 눌러 색칠하며 센다
   opt: {angles:[{a, label}], tools:[{name, n}], ans:[[가칸,나칸],…]}
   ========================================================= */
function a2Units(body, api, opt) {
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
  const ins = opt.tools.map(T => opt.angles.map(A => h("input", { type: "number", inputmode: "numeric", style: "width:3.5em;font-size:1.1em", "aria-label": `${T.name} ${A.label}` })));
  const table = h("div", {}, opt.tools.map((T, i) => h("div", { class: "qitem" }, h("span", { class: "jua" }, T.name + ": "), opt.angles.map((A, j) => h("span", {}, ` ${A.label} `, ins[i][j], " 칸 ")))));
  api.provide({ words: ["칸", "눈금"], answers: opt.tools.map((T, i) => `${T.name}: ${opt.angles.map((A, j) => `${A.label} ${opt.ans[i][j]}칸`).join(", ")}`) });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); let ok = true, why = null;
    ins.forEach((row, i) => row.forEach((inp, j) => { const v = Number(inp.value), good = inp.value !== "" && v === opt.ans[i][j]; inp.style.borderColor = good ? "var(--ok)" : "var(--no)";
      if (!good) { ok = false; if (!why) why = v === opt.tools[i].n && opt.ans[i][j] !== v ? `${opt.angles[j].label}의 두 변 사이에 들어가는 칸만 세어요. 도구 전체 칸 수가 아니에요.` : `${opt.tools[i].name}을 눌러 ${opt.angles[j].label}의 두 변 사이에 있는 칸을 하나씩 눌러 세어 봐요.`; } }));
    const given = ins.map(r => r.map(x => x.value).join("·")).join(" / ");
    ok ? api.done(given, opt.ok) : api.fail(why, given);
  } }, "확인하기");
  body.append(h("div", { class: "stage" }, svg), h("div", { class: "tools" }, h("span", {}, "눈금 도구:"), tbtn), h("p", { class: "inst", style: "margin:.3em 0" }, "각 안에 들어가는 칸을 눌러 색칠하며 세어요. 다시 누르면 지워져요."), table, h("div", { class: "actions" }, check));
  draw();
}

/* =========================================================
   6. 각도의 합과 차 — 각 조각 나를 끌어 가에 이어 붙이거나 겹친다
   opt: {mode:"sum"|"diff", a, b, ok}
   ========================================================= */
function a2Join(body, api, opt) {
  const W = 860, H = 470, a = opt.a, b = opt.b, sum = opt.mode === "sum";
  const V = sum ? [250, 410] : [380, 400], RA = 240, RB = 200, svg = makeSvg(W, H);
  const base = svgEl("g"), res = svgEl("g"), piece = svgEl("g", { style: "cursor:grab" }), pr = svgEl("g");
  svg.append(base, res, piece, pr);
  base.append(svgEl("path", { d: a2WedgeD(V, 0, a, RA), fill: "rgba(228,122,56,.3)", stroke: TENT, "stroke-width": 3 }), a2Line(V, a2Pt(V, 0, RA), { "stroke-width": 4 }), a2Line(V, a2Pt(V, a, RA), { "stroke-width": 4 }));
  const la = a2Pt(V, a / 2, RA * .62); base.append(txt(la[0], la[1], `가 ${a}°`, 22));
  piece.append(svgEl("path", { d: a2WedgeD([0, 0], 0, b, RB), fill: "rgba(43,123,214,.32)", stroke: BLUE, "stroke-width": 3 }));
  const lb = a2Pt([0, 0], b / 2, RB * .7); piece.append(txt(lb[0], lb[1], `나 ${b}°`, 22, { fill: "#1D4E80" }));
  const home = [W - RB - 40, H - 30];
  let pos = home.slice(), rot = 0, snapped = false;
  const place = () => piece.setAttribute("transform", `translate(${a2F(pos[0])},${a2F(pos[1])}) rotate(${a2F(-rot)})`);
  const showRes = () => {
    res.innerHTML = ""; pr.innerHTML = ""; if (!snapped) return;
    if (sum) { res.append(svgEl("path", { d: a2ArcD(V, 0, a + b, RA + 26), fill: "none", stroke: "#C8472E", "stroke-width": 4, "stroke-dasharray": "10 6" })); const q = a2Pt(V, (a + b) / 2, RA + 50); res.append(txt(q[0], q[1], "다", 26, { fill: "#C8472E" })); }
    else { res.append(svgEl("path", { d: a2WedgeD(V, b, a, RA + 20), fill: "rgba(200,71,46,.12)", stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "10 6" })); const q = a2Pt(V, (a + b) / 2, RA + 46); res.append(txt(q[0], q[1], "다", 26, { fill: "#C8472E" })); }
    if (showP) { const g = a2ProtG(A2_PR, { knob: false }); g.setAttribute("transform", `translate(${V[0]},${V[1]})`); g.style.opacity = .92; pr.append(g); }
  };
  let showP = false, dr = null;
  dragOn(svg, p => { const l = [p.x - pos[0], p.y - pos[1]]; const d = Math.hypot(...l); const ang = a2N(a2Dir([0, 0], l) - rot); if (d < RB + 10 && (ang <= b + 4 || ang > 350 || d < 30)) { dr = { off: l }; snapped = false; showRes(); return true; } return false; },
    p => { if (!dr) return; pos = [p.x - dr.off[0], p.y - dr.off[1]]; place(); },
    () => { if (!dr) return; dr = null; if (a2D(pos, V) < 80) { pos = V.slice(); rot = sum ? a : 0; snapped = true; msg.textContent = sum ? "가의 변에 나를 이어 붙였어요. 이어 붙인 각 다를 재어 봐요." : "가 위에 나를 겹쳤어요. 겹치지 않고 남은 각 다를 재어 봐요."; } place(); showRes(); });
  const msg = h("div", { class: "readout", style: "font-size:var(--fs)" }, sum ? "파란 조각 나를 끌어 가의 꼭짓점에 놓아 보세요. 가의 위쪽 변에 이어 붙어요." : "파란 조각 나를 끌어 가의 꼭짓점에 놓아 보세요. 가와 꼭짓점·한 변이 겹쳐요.");
  const inp = h("input", { type: "number", inputmode: "numeric", style: "width:5em;font-size:1.2em", "aria-label": "다의 각도" });
  const want = sum ? a + b : a - b;
  api.provide({ words: sum ? ["이어 붙이기", "더하기"] : ["겹치기", "빼기"], answers: [`${want}°`] });
  const check = h("button", { class: "big", onclick: () => {
    if (!snapped) return api.hint("먼저 나를 끌어 가의 꼭짓점에 놓아요.");
    api.tryOnce(); const v = Number(inp.value);
    if (v === want) return api.done(`${v}°`, opt.ok);
    const why = sum && v === a - b ? "이어 붙인 각은 두 각을 합친 크기예요. 더 크게 나와야 해요." : !sum && v === a + b ? "겹치고 남은 부분은 가보다 작아요. 큰 각에서 작은 각만큼 빼요." : "‘각도기 대 보기’를 눌러 다의 크기를 읽어 봐요.";
    api.fail(why, `${v}°`);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, msg, h("div", { class: "tools" }, h("button", { onclick: e => { showP = !showP; e.currentTarget.classList.toggle("on", showP); showRes(); } }, "각도기 대 보기"), h("button", { onclick: () => { pos = home.slice(); rot = 0; snapped = false; place(); showRes(); } }, "나 떼기")),
    h("div", { class: "qitem" }, h("span", { class: "jua" }, "다의 각도: "), inp, h("span", {}, " °")), h("div", { class: "actions" }, check))));
  place();
}

/* =========================================================
   7. 바람개비 — 직각 종이를 한 장씩 이어 붙인다 (6차시)
   ========================================================= */
function a2Pinwheel(body, api, opt = {}) {
  const W = 560, H = 560, O = [280, 280], S = 190, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  let n = 1;
  const cols = ["#F6C9A8", "#A9CBEF", "#B8DFC4", "#D5C1EE"];
  const draw = () => {
    g.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const p1 = a2Pt(O, 90 * i, S), p3 = a2Pt(O, 90 * i + 90, S), p2 = [p1[0] + p3[0] - O[0], p1[1] + p3[1] - O[1]];
      g.append(svgEl("polygon", { points: [O, p1, p2, p3].map(q => q.map(a2F).join(",")).join(" "), fill: cols[i], stroke: INK, "stroke-width": 3 }));
      const tri = [a2Pt(O, 90 * i, S), p2, a2Pt(O, 90 * i + 45, S * .55)];
      g.append(svgEl("polygon", { points: tri.map(q => q.map(a2F).join(",")).join(" "), fill: "rgba(255,255,255,.45)" }));
    }
    if (n < 4) g.append(svgEl("path", { d: a2ArcD(O, 0, 90 * n, 46), fill: "none", stroke: "#C8472E", "stroke-width": 4 }));
    else g.append(svgEl("circle", { cx: O[0], cy: O[1], r: 46, fill: "none", stroke: "#C8472E", "stroke-width": 4 }));
    const q = a2Pt(O, 45, 74); g.append(txt(q[0] + (n > 1 ? 0 : 0), q[1], n === 1 ? "90°" : "", 22, { fill: "#C8472E" }));
    g.append(svgEl("circle", { cx: O[0], cy: O[1], r: 7, fill: INK }));
    cnt.textContent = `이어 붙인 종이 ${n}장`;
  };
  const cnt = h("div", { class: "readout" });
  const ins = [1, 2, 3, 4].map(k => h("input", { type: "number", inputmode: "numeric", style: "width:4.5em;font-size:1.1em", "aria-label": `${k}장` }));
  const want = [90, 180, 270, 360];
  api.provide({ words: ["90°", "180°", "360°", "일직선", "한 바퀴"], answers: want.map((w, i) => `${i + 1}장 ${w}°`) });
  const check = h("button", { class: "big", onclick: () => {
    if (n < 4) return api.hint("종이를 4장까지 이어 붙여 바람개비를 완성해 봐요.");
    api.tryOnce(); let ok = true; ins.forEach((inp, i) => { const good = Number(inp.value) === want[i] && inp.value !== ""; inp.style.borderColor = good ? "var(--ok)" : "var(--no)"; if (!good) ok = false; });
    const given = ins.map(x => x.value).join(", ");
    if (ok) return api.done(given, opt.ok);
    api.fail("종이 한 장의 각은 90°예요. 한 장 붙일 때마다 90°씩 더해져요.", given);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, h("div", { class: "tools" }, h("button", { onclick: () => { if (n < 4) { n++; draw(); } } }, "종이 한 장 더 붙이기"), h("button", { onclick: () => { n = 1; draw(); } }, "처음으로")), cnt,
    ...ins.map((inp, i) => h("div", { class: "qitem" }, h("span", { class: "jua" }, `${i + 1}장: `), inp, " °")), h("div", { class: "actions" }, check))));
  draw();
}

/* =========================================================
   8. 다각형 각의 합 — drag: 꼭짓점 끌기 / tear: 모서리 잘라 한 점에 모으기 / split: 대각선으로 삼각형 2개
   opt: {mode, pts(또는 angles+lens), W, H, ok}
   ========================================================= */
function a2Sum(body, api, opt) {
  const W = opt.W || 880, H = opt.H || 470, svg = makeSvg(W, H);
  let pts = (opt.pts || a2Poly(opt.angles, opt.lens, opt.mode === "tear" ? W * .62 : W, H, 44).pts).map(p => p.slice());
  const n = pts.length, total = (n - 2) * 180, MK = ["㉠", "㉡", "㉢", "㉣"];
  const polyG = svgEl("g"), pieceG = svgEl("g"); svg.append(polyG, pieceG);
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const inp = h("input", { type: "number", inputmode: "numeric", style: "width:5em;font-size:1.2em", "aria-label": "각의 크기의 합" });
  let shapes = [], torn = [], diag = null;
  const T = [W * .8, H * (n === 3 ? .62 : .5)];
  const drawPoly = () => {
    polyG.innerHTML = "";
    polyG.append(svgEl("polygon", { points: pts.map(p => p.map(a2F).join(",")).join(" "), fill: "#FFFDF8", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }));
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
  /* drag */
  const convexOk = P => { const cs = a2Corners(P); let s = 0; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n], c = P[(i + 2) % n]; const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if (Math.abs(cr) < 1e-6) return false; if (!s) s = Math.sign(cr); else if (Math.sign(cr) !== s) return false; } return cs.every(c => c.a > 12 && c.a < 168) && P.every(p => p[0] > 20 && p[0] < W - 20 && p[1] > 20 && p[1] < H - 20) && P.every((p, i) => a2D(p, P[(i + 1) % n]) > 60); };
  const snapShape = () => { const cs = a2Corners(pts).map(c => c.a); if (!shapes.some(s => s.every((v, i) => Math.abs(v - cs[i]) < 6))) shapes.push(cs); cnt.textContent = `만들어 본 모양: ${shapes.length}가지`; };
  const cnt = h("div", { class: "jua" });
  if (opt.mode === "drag") {
    let di = -1;
    dragOn(svg, p => { di = pts.findIndex(q => a2D(q, [p.x, p.y]) < 34); return di >= 0; },
      p => { if (di < 0) return; const P = pts.map(q => q.slice()); P[di] = [p.x, p.y]; if (convexOk(P)) { pts = P; drawPoly(); } },
      () => { if (di >= 0) snapShape(); di = -1; });
  }
  /* tear */
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
      if (t < 1) requestAnimationFrame(step); else if (torn.length === n) finish(); };
    requestAnimationFrame(step); drawPoly();
  };
  const finish = () => {
    if (n === 3) pieceG.append(a2Line([T[0] - 150, T[1]], [T[0] + 150, T[1]], { stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "10 6" }));
    else pieceG.append(svgEl("circle", { cx: T[0], cy: T[1], r: 84, fill: "none", stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "10 6" }));
    out.textContent = n === 3 ? "세 각이 한 점에 모여 일직선이 되었어요." : "네 각이 한 점에 모여 빈틈없이 한 바퀴가 되었어요.";
  };
  if (opt.mode === "tear") {
    svg.addEventListener("click", e => { const p = svgPt(svg, e); const cs = a2Corners(pts); const i = cs.findIndex(c => a2D(c.V, [p.x, p.y]) < 70); if (i >= 0) tearOne(i); });
    svg.append(svgEl("circle", { cx: T[0], cy: T[1], r: 6, fill: INK }), txt(T[0], T[1] + 34, "모으는 점", 18, { fill: A2_GRAY }));
    out.textContent = "색칠한 모서리를 하나씩 눌러 잘라 내요. 잘라 낸 조각이 오른쪽 점에 모여요.";
  }
  if (opt.mode === "split") {
    svg.addEventListener("click", e => { const p = svgPt(svg, e); const i = pts.findIndex(q => a2D(q, [p.x, p.y]) < 60); if (i >= 0) { diag = i; drawPoly(); out.textContent = "대각선을 그어 삼각형 2개로 나누었어요."; } });
    out.textContent = "꼭짓점 하나를 누르면 마주 보는 꼭짓점까지 선을 그어 삼각형 2개로 나누어요.";
  }
  const want = opt.want != null ? opt.want : total;
  api.provide({ words: [`${total}°`, n === 3 ? "일직선" : "한 바퀴"], answers: [opt.answerText || `${want}°`] });
  const extra = opt.mode === "split" ? [h("input", { type: "number", inputmode: "numeric", style: "width:4.5em;font-size:1.1em", "aria-label": "삼각형 하나의 세 각의 합" }), h("input", { type: "number", inputmode: "numeric", style: "width:4.5em;font-size:1.1em", "aria-label": "삼각형 하나의 세 각의 합" })] : [];
  const check = h("button", { class: "big", onclick: () => {
    if (opt.mode === "drag" && shapes.length < 3) return api.hint(`꼭짓점을 끌어 모양이 다른 ${n === 3 ? "삼각형" : "사각형"}을 3가지 이상 만들어 보고 합을 살펴봐요.`);
    if (opt.mode === "tear" && torn.length < n) return api.hint("모서리를 모두 잘라 한 점에 모아 봐요.");
    if (opt.mode === "split" && diag == null) return api.hint("먼저 꼭짓점을 눌러 삼각형 2개로 나누어 봐요.");
    api.tryOnce(); const v = Number(inp.value);
    const ex = extra.map(x => Number(x.value)), exOk = extra.every(x => Number(x.value) === 180);
    extra.forEach(x => { x.style.borderColor = Number(x.value) === 180 ? "var(--ok)" : "var(--no)"; });
    const given = (extra.length ? ex.join(" + ") + " = " : "") + `${v}°`;
    if (v === want && exOk) return api.done(given, opt.ok);
    api.fail(!exOk ? "삼각형 하나의 세 각의 크기의 합은 180°예요." : v === 180 && n === 4 ? "사각형은 삼각형 2개로 나눌 수 있어요. 180°가 두 번이에요." : n === 3 ? "세 각을 모으면 일직선이 돼요. 일직선이 이루는 각은 몇 도일까요?" : "네 각을 모으면 한 바퀴가 돼요. 한 바퀴는 몇 도일까요?", given);
  } }, "확인하기");
  const askRow = opt.mode === "split"
    ? h("div", { class: "qitem" }, extra[0], " ° + ", extra[1], " ° = ", inp, " °")
    : h("div", { class: "qitem" }, h("span", { class: "jua" }, opt.ask || (n === 3 ? "세 각의 크기의 합: " : "네 각의 크기의 합: ")), inp, h("span", {}, " °"));
  body.append(stageWrap(svg, h("div", { class: "side" }, opt.tip ? h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip) : null, out, cnt, askRow, h("div", { class: "actions" }, check))));
  drawPoly(); if (opt.mode === "drag") snapShape();
}

/* =========================================================
   9. 시계 — 바늘을 끌어 시각을 맞추고 두 바늘이 이루는 작은 쪽 각을 가린다
   opt: {items:[{h, m}], ok}
   ========================================================= */
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
function a2Clock(body, api, opt) {
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
    draw(); }, () => { dr = null; });
  const kinds = ["예각", "직각", "둔각"], kb = kinds.map((n, i) => h("button", { class: "opt", onclick: e => { pick = i; kb.forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); } }, n));
  const res = [];
  api.provide({ words: kinds, answers: [items.map(it => `${it.h}시${it.m ? " " + it.m + "분" : ""} ${a2Kind(a2ClockAngle(it.h, it.m))}`).join(", ")] });
  const check = h("button", { class: "big", onclick: () => {
    const it = items[k]; api.tryOnce();
    const timeOk = H0 % 12 === it.h % 12 && M === it.m, want = a2Kind(a2ClockAngle(it.h, it.m)), ans = `${H0}시 ${M}분 ${pick == null ? "-" : kinds[pick]}`;
    if (!timeOk) return api.fail(`시계를 ${tl(it)}${a2J(tl(it), "으로", "로")} 맞추어요. ${it.m === 30 ? "30분이면 긴바늘은 6을 가리키고 짧은바늘은 두 수의 가운데에 있어요." : "정각이면 긴바늘은 12를 가리켜요."} 긴바늘(파랑)과 짧은바늘(검정)을 끌어 보세요.`, ans);
    if (pick == null) return api.hint("예각, 직각, 둔각 중에서 골라요.");
    if (kinds[pick] !== want) return api.fail(`두 바늘이 이루는 작은 쪽의 각은 ${a2ClockAngle(it.h, it.m)}°예요. 직각과 비교해 다시 골라요.`, ans);
    res.push(`${it.h}시${it.m ? " " + it.m + "분" : ""} ${want}`);
    if (k < items.length - 1) { api.hint(`○ ${res[res.length - 1]}! 다음 시각도 나타내 봐요.`); k++; pick = null; kb.forEach(b => b.classList.remove("on")); draw(); return; }
    api.done(res.join(", "), opt.ok);
  } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, askEl, h("p", { class: "inst", style: "margin:.2em 0" }, opt.tip || "긴바늘(파랑)을 끌면 5분씩, 짧은바늘(검정)을 끌면 1시간씩 움직여요."), out,
    h("div", { class: "tools" }, h("button", { onclick: () => { H0 = (H0 + 10) % 12 + 1; draw(); } }, "1시간 전"), h("button", { onclick: () => { H0 = H0 % 12 + 1; draw(); } }, "1시간 후")), h("div", { class: "opts" }, kb), h("div", { class: "actions" }, check))));
  draw();
}

/* =========================================================
   10. 거북 보물찾기 (9차시) — 회전 방향·각도를 정해 거북을 움직인다
   map: {w,h (cm), U, start:{p,dir}, roads:[[p…]], places:[{n, at, box:[w,h], fill}], deco}
   opt: {map, cmds:[{dist, turn:"왼쪽"|"오른쪽", deg, fix(고정), edit:"both"|"deg"|"turn"}], goals:[{after, place}], ok}
   ========================================================= */
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
function a2Turtle(body, api, opt) {
  const map = opt.map, U = map.U, svg = makeSvg(map.w * U, map.h * U); a2TurtleMap(svg, map);
  const trail = svgEl("g"), tg = svgEl("g"); svg.append(trail, tg);
  const st = opt.cmds.map(c => ({ turn: c.fix || c.edit === "deg" ? c.turn : (opt.prefill ? c.turn : null), deg: c.fix || c.edit === "turn" ? c.deg : (opt.prefill ? c.deg : null) }));
  const rows = opt.cmds.map((c, i) => {
    const no = h("span", { class: "jua", style: "display:inline-grid;place-items:center;width:1.6em;height:1.6em;border-radius:50%;background:var(--ring);color:#fff;margin-right:.3em" }, String(i + 1));
    if (!c.turn) return h("div", { class: "qitem" }, no, `화살표 방향으로 ${c.dist} cm 이동`);
    if (c.fix) return h("div", { class: "qitem" }, no, `${c.turn}으로 ${c.deg}°만큼 회전하여 ${c.dist} cm 이동`);
    const tb = ["왼쪽", "오른쪽"].map(n => h("button", { class: "opt" + (st[i].turn === n ? " on" : ""), disabled: c.edit === "deg", onclick: e => { st[i].turn = n; tb.forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); } }, n));
    const di = h("input", { type: "number", inputmode: "numeric", style: "width:3.6em;font-size:1.1em", value: st[i].deg != null ? st[i].deg : "", disabled: c.edit === "turn", "aria-label": `${i + 1}번 회전 각도` });
    di.addEventListener("input", () => { st[i].deg = di.value === "" ? null : Number(di.value); });
    return h("div", { class: "qitem" }, no, ...tb, "으로 ", di, `°만큼 회전하여 ${c.dist} cm 이동`);
  });
  const path = () => { let p = map.start.p.map(v => v * U), d = map.start.dir; const segs = [];
    opt.cmds.forEach((c, i) => { const s = st[i]; const prev = d; if (c.turn) d += (s.turn === "왼쪽" ? 1 : -1) * (s.deg || 0); const q = a2Pt(p, d, c.dist * U); segs.push({ p, q, prev, d, turn: !!c.turn, s: Object.assign({}, s) }); p = q; }); return segs; };
  const placeAt = P => { const pl = map.places.find(pl => a2D(pl.at.map(v => v * U), P) < .6 * U || (pl.end && a2D(pl.end.map(v => v * U), P) < .3 * U)); return pl ? pl.n : null; };
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" }, "명령어를 정하고 ‘거북 움직이기’를 눌러요.");
  let timer = null, last = null;
  const run = () => {
    if (st.some((s, i) => opt.cmds[i].turn && (s.turn == null || s.deg == null))) { api.hint("빈 칸(회전 방향과 각도)을 모두 정해요."); return null; }
    clearTimeout(timer); trail.innerHTML = ""; tg.innerHTML = ""; const segs = path(); let i = 0;
    a2TurtleShape(tg, segs[0].p, segs[0].prev, U);
    const stepF = () => {
      const sg = segs[i];
      if (sg.turn) {
        trail.append(a2Line(sg.p, a2Pt(sg.p, sg.prev, 1.6 * U), { stroke: A2_GRAY, "stroke-width": 2.5, "stroke-dasharray": "7 5" }));
        const lo = Math.min(sg.prev, sg.d), hi = Math.max(sg.prev, sg.d);
        if (hi - lo > .5) { trail.append(svgEl("path", { d: a2ArcD(sg.p, lo, hi, .7 * U), fill: "none", stroke: TENT, "stroke-width": 3 })); const q = a2Pt(sg.p, (lo + hi) / 2, 1.05 * U); trail.append(txt(q[0], q[1], `${Math.round(hi - lo)}°`, 17, { fill: "#B4610F" })); }
      }
      trail.append(a2Line(sg.p, sg.q, { stroke: "#C8472E", "stroke-width": 4 }));
      tg.innerHTML = ""; a2TurtleShape(tg, sg.q, sg.d, U);
      i++; if (i < segs.length) timer = setTimeout(stepF, 450);
      else { const where = placeAt(sg.q); out.textContent = where ? `거북이 도착한 곳: ${where}` : "거북이 길이 아닌 곳에 도착했어요."; }
    };
    timer = setTimeout(stepF, 250); last = segs; return segs;
  };
  api.provide({ words: ["왼쪽", "오른쪽", "보조선", "회전"], answers: [opt.cmds.map((c, i) => c.turn ? `${i + 1} ${c.turn} ${c.deg}°` : null).filter(Boolean).join(", ")] });
  const check = h("button", { class: "big", onclick: () => {
    const segs = run(); if (!segs) return;
    api.tryOnce();
    const ans = opt.cmds.map((c, i) => c.turn ? `${st[i].turn}${st[i].deg}°` : `${c.dist}cm`).join(" / ");
    const fails = opt.goals.filter(gl => placeAt(segs[gl.after].q) !== gl.place);
    if (!fails.length) return api.done(ans, opt.ok);
    const bad = opt.cmds.findIndex((c, i) => c.turn && !c.fix && (st[i].turn !== c.turn || st[i].deg !== c.deg));
    let why = `${fails[0].place}에 도착하지 못했어요.`;
    if (bad >= 0 && !opt.free) { const c = opt.cmds[bad], s = st[bad];
      why += s.turn !== c.turn ? ` ${bad + 1}번 명령어의 회전 방향을 다시 생각해 봐요. 거북이 가던 방향을 보고 왼쪽인지 오른쪽인지 정해요.` : s.deg === 180 - c.deg ? ` ${bad + 1}번 회전 각도는 가던 방향을 늘인 보조선(회색 점선)과 새 길 사이의 각이에요.` : ` ${bad + 1}번 회전 각도를 다시 재어 봐요.`; }
    else why += " 회색 점선(가던 방향을 늘인 선)과 새 길 사이의 각을 살펴봐요.";
    api.fail(why, ans);
  } }, "확인하기");
  body.append(h("div", { class: "stage" }, svg), h("div", { class: "card", style: "margin:.4em 0" }, h("div", { class: "jua" }, opt.title || "보물찾기 명령어"), ...rows),
    h("div", { class: "tools" }, h("button", { onclick: () => run() }, "거북 움직이기"), h("button", { onclick: () => { clearTimeout(timer); trail.innerHTML = ""; tg.innerHTML = ""; a2TurtleShape(tg, map.start.p.map(v => v * U), map.start.dir, U); out.textContent = "처음 자리로 돌아왔어요."; } }, "처음 자리로")), out, h("div", { class: "actions" }, check));
  a2TurtleShape(tg, map.start.p.map(v => v * U), map.start.dir, U);
  const ar = a2Pt(map.start.p.map(v => v * U), map.start.dir, .7 * U); trail.append(a2Line(ar, a2Pt(ar, map.start.dir, .6 * U), { stroke: "#C8472E", "stroke-width": 3 }));
}
/* 두 지도 (교과서 54~55쪽을 1 cm 격자에 다시 그림) */
function a2MapJ() {
  const S = [1, 6], J = [5, 6];
  const up = a2Walk(J, 60, [[0, 3]]), A = up[1], dn = a2Walk(J, -30, [[0, 3]]), B = dn[1], mid = a2Walk(J, 30, [[0, 3]]), Cc = mid[1];
  const lib = a2Pt(A, 30, 2), main = a2Pt(A, 90, 2), cafe = a2Pt(B, -60, 2), tap = a2Pt(B, 0, 2), gym = a2Pt(Cc, 0, 2);
  return { w: 13, h: 10.6, U: 46, start: { p: S, dir: 0 },
    roads: [[S, J], [J, A, lib], [A, main], [J, B, cafe], [B, tap], [J, Cc, gym]],
    places: [{ n: "도서관", at: [lib[0] + .9, lib[1] - .55], end: lib, box: [1.9, .9] }, { n: "본관", at: [main[0], main[1] - .6], end: main, box: [2.4, .9] }, { n: "급식실", at: [cafe[0] + .4, cafe[1] + .55], end: cafe, box: [1.9, .9] },
      { n: "수돗가", at: [tap[0] + 1.1, tap[1]], end: tap, box: [1.9, .9] }, { n: "운동장", at: [gym[0] + 1.3, gym[1]], end: gym, box: [2.4, 1.1], fill: "#F3D2AE" }, { n: "교문", at: [S[0], S[1] - 1], box: [1.4, .8], fill: "#E6EEF8" }, { n: "주차장", at: [2, 9.2], box: [2.6, 1.2], fill: "#EDEDED" }],
    deco: [{ tree: [[1, 1], [2.2, 1.6], [12.3, 1], [3.5, 3.4], [12.4, 9.8]] }], pts: { J, A, B } };
}
function a2MapY() {
  const T = [14, 1], P1 = [14, 3], P2 = [5, 3], P3 = [5, 8], K = a2Pt(P3, -30, 3), G = a2Pt(K, 0, 4);
  return { w: 16, h: 11.2, U: 40, start: { p: T, dir: -90 },
    roads: [[T, P1, P2, P3, K, G], [P2, [2, 3]], [P3, [5, 10.4]], [P3, [8, 8]], [P1, [14, 6]]],
    places: [{ n: "급식실", at: [K[0], K[1] + .75], end: K, box: [1.8, .9] }, { n: "강당", at: [G[0] + .2, G[1] + .75], end: G, box: [1.8, .9] }, { n: "교문", at: [T[0] + 1.1, T[1]], box: [1.4, .8], fill: "#E6EEF8" },
      { n: "주차장", at: [1.4, 1.9], end: [2, 3], box: [2.2, .9], fill: "#EDEDED" }, { n: "텃밭", at: [5, 10.6], end: [5, 10.4], box: [1.6, .8], fill: "#D6EBC8" }, { n: "수돗가", at: [9.1, 8], end: [8, 8], box: [1.9, .9] },
      { n: "경비실", at: [14, 6.7], end: [14, 6], box: [1.8, .9] }, { n: "본관", at: [9, 1.4], box: [3.2, 1.2], fill: "#FFE8D2" }],
    deco: [{ oval: [9.5, 5.5, 3.2, 1.6], n: "운동장" }, { tree: [[2.3, 6], [3, 9], [15.3, 9.5], [12, 10.4]] }] };
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

/* =========================================================
   13. 미로 탈출 (11차시) — 갈림길마다 맞는 답 쪽으로
   gates: [{q, fig, o:[두 개], a, why}]
   ========================================================= */
function a2Maze(body, api, opt) {
  const gates = opt.gates, n = gates.length, W = 860, H = 150, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  let k = 0;
  const xs = i => 70 + i * (W - 140) / n;
  const draw = () => { g.innerHTML = "";
    g.append(svgEl("rect", { x: 30, y: 52, width: W - 60, height: 46, rx: 23, fill: "#EAF2E6", stroke: "#B8CDB0", "stroke-width": 2 }));
    for (let i = 1; i <= n; i++) { const x = xs(i) - (W - 140) / n / 2; g.append(svgEl("circle", { cx: x, cy: 75, r: 17, fill: i <= k ? "#B8DFC4" : "#fff", stroke: i === k + 1 ? TENT : A2_GRAY, "stroke-width": 3 }), txt(x, 76, String(i), 18)); }
    g.append(svgEl("ellipse", { cx: W - 52, cy: 78, rx: 18, ry: 22, fill: "#B07A45" }), svgEl("path", { d: `M${W - 70},66 Q${W - 52},44 ${W - 34},66 Z`, fill: "#6E4A2A" }), txt(W - 52, 128, "도토리", 16));
    const sx = k === 0 ? 50 : xs(k) - (W - 140) / n / 2 + 40;
    g.append(svgEl("circle", { cx: sx, cy: 70, r: 15, fill: "#C98E5A" }), svgEl("path", { d: `M${sx - 12},76 q-26,-6 -18,-34 q14,8 10,22`, fill: "#A8703F" }), svgEl("circle", { cx: sx + 5, cy: 66, r: 2.5, fill: INK }), txt(sx, 30, "다람쥐", 16));
  };
  const box = h("div", { class: "qitem" });
  const show = () => { box.innerHTML = ""; if (k >= n) return; const G = gates[k];
    box.append(h("div", { class: "jua" }, `갈림길 ${k + 1}. ${G.q}`)); if (G.fig) box.append(G.fig());
    box.append(h("div", { class: "opts" }, G.o.map((o, i) => h("button", { class: "opt", onclick: () => { api.tryOnce();
      if (i === G.a) { k++; draw(); if (k >= n) { box.innerHTML = ""; api.done(gates.map(x => x.o[x.a]).join(" → "), opt.ok || "다람쥐가 도토리에 도착했어요!"); } else { api.hint(`○ ${o}! 다음 갈림길로 가요.`); show(); } }
      else api.fail(G.why || "막다른 길이에요. 다시 풀어 봐요.", o); } }, o)))); };
  api.provide({ words: [], answers: [gates.map(x => x.o[x.a]).join(" → ")] });
  body.append(h("div", { class: "stage" }, svg), box); draw(); show();
}

/* =========================================================
   14. 장면에서 고르기 (1차시) — 각이 보이는 곳을 누른다
   opt: {W,H, deco(svg), items:[{n, box:[x,y,w,h], draw(g), ok, why}], ok}
   ========================================================= */
function a2Pick(body, api, opt) {
  const svg = makeSvg(opt.W, opt.H); if (opt.deco) opt.deco(svg);
  const sel = new Set(), hits = [];
  opt.items.forEach((it, i) => { const g = svgEl("g", { style: "cursor:pointer" }); const [x, y, w, hh] = it.box;
    const r = svgEl("rect", { x, y, width: w, height: hh, rx: 12, fill: "rgba(255,255,255,0)", stroke: "none" }); g.append(r); it.draw(g);
    g.addEventListener("click", () => { sel.has(i) ? sel.delete(i) : sel.add(i); paint(); }); svg.append(g); hits.push(r); });
  const out = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const paint = () => { hits.forEach((r, i) => { const on = sel.has(i); r.setAttribute("fill", on ? "rgba(43,123,214,.16)" : "rgba(255,255,255,0)"); r.setAttribute("stroke", on ? BLUE : "none"); r.setAttribute("stroke-width", 4); r.setAttribute("stroke-dasharray", "8 5"); });
    out.textContent = "고른 것: " + ([...sel].map(i => opt.items[i].n).join(", ") || "없음"); };
  const good = opt.items.map((it, i) => it.ok ? i : -1).filter(i => i >= 0);
  api.provide({ words: ["각", "꼭짓점", "변"], answers: [good.map(i => opt.items[i].n).join(", ")] });
  const check = h("button", { class: "big", onclick: () => { api.tryOnce(); const ans = [...sel].map(i => opt.items[i].n).join(",") || "-";
    const extra = [...sel].filter(i => !opt.items[i].ok), miss = good.filter(i => !sel.has(i));
    if (!extra.length && !miss.length) return api.done(ans, opt.ok);
    if (extra.length) return api.fail(opt.items[extra[0]].why || "고른 것 중에 각이 없는 것이 있어요.", ans);
    api.fail(`아직 찾지 못한 것이 ${miss.length}개 있어요. 곧은 선 두 개가 한 점에서 만나는 곳을 찾아요.`, ans); } }, "확인하기");
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "알맞은 것을 모두 눌러 골라요. 다시 누르면 취소돼요."), out, h("div", { class: "actions" }, check)))); paint();
}
/* 다각형 그림(각 표시): marks에 "35°"·"□"·"㉠"·"R"(직각) */
function a2PolyFig(angles, lens, marks, opt = {}) {
  const W = opt.W || 560, H = opt.H || 360;
  return a2Fig(W, H, s => { const pts = a2Poly(angles, lens, W, H, opt.pad || 56).pts; s.append(a2PolyG(pts, { marks, fs: 22, r: 30 })); if (opt.extra) opt.extra(s, pts); }, opt.maxW || "24em");
}
/* 여러 그림을 나란히 */
function a2Row(...els) { const d = h("div", { style: `display:grid;grid-template-columns:repeat(${els.length},minmax(0,1fr));gap:.5em;max-width:46em` }); els.forEach(e => { e.style.maxWidth = "100%"; d.append(e); }); return d; }
//@@LESSONS
const UNIT_STORY = { title: "지안이와 친구들의 숲 놀이터", lines: [
  "어린이 디자이너 캠프에서 지안이와 은호, 친구들이 상상 속 숲 놀이터를 만들었어요. 동물 모양 의자, 오르막길, 놀이기구, 책 모양 오두막, 나무 집이 있어요.",
  "놀이터를 만들며 각의 크기를 비교하고, 각도기로 재고, 어림하고, 각도를 더하고 빼고, 삼각형과 사각형의 각의 크기의 합을 알아봐요.",
  "교과서 「수학 4-1」 2. 각도의 차시 순서 그대로 만들었어요."],
  one: "각도 · 숲 놀이터에서 각의 크기를 비교하고, 재고, 어림하고, 더하고 빼요." };
const UNIT_KEYWORDS = ["각", "꼭짓점", "변", "각의 크기", "각도", "1°", "직각 90°", "각도기", "중심", "밑금", "안쪽 눈금", "바깥쪽 눈금", "예각", "둔각", "어림", "삼각형 세 각의 합 180°", "사각형 네 각의 합 360°"];

/* 1차시 그림 */
const A2_SCENE = {
  W: 900, H: 440,
  deco: s => { s.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 440, fill: "#F4FAF0" }), svgEl("rect", { x: 0, y: 395, width: 900, height: 45, fill: "#D8EBC8" }));
    [[30, 60], [400, 40], [620, 52]].forEach(([x, y]) => s.append(svgEl("circle", { cx: x + 20, cy: y + 10, r: 9, fill: "#B9DDA8" }))); },
  items: [
    { n: "기린 모양 의자", box: [20, 150, 190, 250], ok: true, draw: g => { g.append(a2Line([60, 340], [180, 340], { stroke: "#C9A27A", "stroke-width": 14 }), a2Line([60, 340], [42, 200], { stroke: "#E8C25A", "stroke-width": 14 }), a2Line([75, 340], [75, 392], { stroke: "#C9A27A", "stroke-width": 8 }), a2Line([170, 340], [170, 392], { stroke: "#C9A27A", "stroke-width": 8 }), svgEl("ellipse", { cx: 46, cy: 180, rx: 24, ry: 15, fill: "#E8C25A" }), svgEl("circle", { cx: 54, cy: 176, r: 3, fill: INK })); } },
    { n: "책 모양 오두막", box: [220, 200, 230, 200], ok: true, draw: g => { g.append(svgEl("polygon", { points: "232,392 335,215 438,392", fill: "#A9CBEF", stroke: "#2B6FB8", "stroke-width": 5, "stroke-linejoin": "round" }), svgEl("rect", { x: 315, y: 330, width: 40, height: 62, fill: "#F6E3C6", stroke: "#9C8A62", "stroke-width": 3 })); } },
    { n: "미끄럼틀", box: [470, 215, 290, 185], ok: true, draw: g => { g.append(a2Line([510, 392], [560, 245], { stroke: "#8E5BC9", "stroke-width": 8 }), a2Line([560, 245], [620, 245], { stroke: "#8E5BC9", "stroke-width": 10 }), a2Line([620, 245], [750, 392], { stroke: "#E47A38", "stroke-width": 12 }), a2Line([620, 245], [620, 392], { stroke: "#8E5BC9", "stroke-width": 7 })); } },
    { n: "해", box: [770, 20, 110, 110], why: "해는 굽은 선으로 된 동그라미라서 각이 없어요.", draw: g => g.append(svgEl("circle", { cx: 825, cy: 75, r: 42, fill: "#FFD966", stroke: "#E4B33C", "stroke-width": 4 })) },
    { n: "구름", box: [440, 40, 200, 100], why: "구름은 굽은 선으로만 되어 있어서 각이 없어요.", draw: g => [[490, 95, 30], [530, 78, 38], [575, 96, 30]].forEach(([x, y, r]) => g.append(svgEl("circle", { cx: x, cy: y, r, fill: "#fff", stroke: "#C9D4CF", "stroke-width": 3 }))) },
    { n: "공", box: [780, 330, 80, 70], why: "공은 동그란 모양이라 곧은 선이 만나는 곳이 없어요.", draw: g => g.append(svgEl("circle", { cx: 820, cy: 367, r: 27, fill: "#F28B82", stroke: "#C8472E", "stroke-width": 3 })) }] };
/* 5차시 오두막·잎·운동 기구 그림 */
function a2LeafDeco(it, col) { return g => { const V = it.V, P1 = a2Pt(V, it.d1, 150), P2 = a2Pt(V, it.d1 + it.a, 150), c = a2Pt(V, it.d1 + it.a / 2, 420);
  g.append(svgEl("path", { d: `M${a2F(V[0])},${a2F(V[1])} L${a2F(P1[0])},${a2F(P1[1])} Q${a2F(c[0])},${a2F(c[1])} ${a2F(P2[0])},${a2F(P2[1])} Z`, fill: col, stroke: "#4F8A43", "stroke-width": 3 }));
  const m = a2Pt(V, it.d1 + it.a / 2, 300); g.append(a2Line(V, m, { stroke: "#4F8A43", "stroke-width": 3 })); }; }
const A2_HOUSE = a2Poly([70, 70, 40], [1], 800, 640, 70).pts;
const A2_TRI7 = a2Poly([30, 40, 110], [10], 900, 600, 200).pts;
const A2_TRAP8 = a2Poly([75, 80, 100, 105], [10, 4], 900, 600, 200).pts;

const LESSONS = [
{
  id: "a1", no: 1, title: "단원 도입 ― 숲 놀이터가 문을 열었어요", soop: "개념 찾기(S)",
  question: "숲 놀이터를 만들 때 지안이와 친구들은 각을 어떻게 이용했을까요?",
  summary: "우리 주변의 의자, 오두막, 놀이기구, 계단과 오르막길에는 여러 가지 각이 있어요. 한 점에서 그은 두 반직선으로 이루어진 도형을 각이라고 해요. 이 단원에서는 각의 크기를 비교하고, 각도기로 재고, 어림하고, 각도를 더하고 빼는 방법을 배워요.",
  steps: [
    { name: "만져 보기", inst: "이탈리아에 있는 피사의 사탑은 땅이 단단하지 않아서 5도 정도 기울어졌대요. 주황 동그라미를 왼쪽으로 끌어 탑을 5°만큼 기울여 보세요.", hints: ["파란 점선은 똑바로 선 탑의 방향이에요.", "아주 조금만 기울이면 돼요. ⟲ 1° 단추를 다섯 번 눌러도 돼요."],
      render: (b, a) => a2Maker(b, a, { W: 560, H: 520, V: [280, 470], d1: 90, L: 330, skin: "tower", show: true, start: 0, min: 0, max: 30, items: [{ target: 5, ask: "탑을 5°만큼 기울여 보세요." }],
        deco: g => g.append(svgEl("rect", { x: 0, y: 470, width: 560, height: 50, fill: "#D8EBC8" })), tip: "주황 동그라미를 끌어 탑을 기울여요.", ok: "5° 기울어진 피사의 사탑이에요. 기울어진 정도도 각의 크기로 나타낼 수 있어요." }) },
    { name: "찾아 보기", inst: "지안이와 친구들이 만든 숲 놀이터예요. 그림에서 각을 볼 수 있는 것을 모두 눌러 보세요.", hints: ["곧은 선 두 개가 한 점에서 만나는 곳을 찾아요.", "동그란 모양에는 각이 없어요."],
      render: (b, a) => a2Pick(b, a, Object.assign({ tip: "각을 볼 수 있는 것을 모두 눌러 골라요.", ok: "기린 모양 의자, 책 모양 오두막, 미끄럼틀에서 각을 볼 수 있어요." }, A2_SCENE)) },
    { name: "떠올리기", inst: "3학년 때 배운 각과 직각을 떠올려요. 알맞은 것을 골라 보세요.", hints: ["각은 한 점에서 그은 두 반직선으로 이루어진 도형이에요.", "직각은 종이를 반듯하게 두 번 접었을 때 생기는 각이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "각을 모두 골라요.", fig: () => a2Cards([{ d1: 10, a: 55 }, { draw: (g, W, H) => g.append(svgEl("path", { d: `M60,${H - 40} Q90,60 ${W - 40},50 M60,${H - 40} Q150,${H - 40} ${W - 30},${H - 70}`, fill: "none", stroke: INK, "stroke-width": 5 }), svgEl("circle", { cx: 60, cy: H - 40, r: 5, fill: INK })) }, { draw: (g, W, H) => g.append(a2Line([40, H - 40], [W - 40, H - 40]), a2Line([70, H - 60], [W - 50, 50])) }, { d1: 200, a: 110 }], { maxW: "40em" }),
          o: ["가", "나", "다", "라"], a: [0, 3] },
        { q: "직각을 골라요.", fig: () => a2Cards([{ d1: 30, a: 60 }, { d1: 15, a: 90 }, { d1: 0, a: 120 }], { maxW: "32em" }), o: ["가", "나", "다"], a: 1, why: { "0": "가는 직각보다 덜 벌어졌어요.", "2": "다는 직각보다 더 벌어졌어요." } }], { ok: "가와 라가 각이에요. 나는 굽은 선, 다는 한 점에서 만나지 않아요. 직각은 나예요." }) },
    { name: "약속하기", inst: "3학년 때 배운 약속을 다시 떠올려요. 알맞은 말을 골라 약속을 완성해요.", hints: ["두 반직선이 만나는 점이 꼭짓점이에요."],
      render: (b, a) => blanks(b, a, ["한 점에서 그은 두 반직선으로 이루어진 도형을 ", { o: ["각", "선분", "직선"], a: 0 }, "이라고 해요. 그 점을 각의 ", { o: ["꼭짓점", "변"], a: 0 }, ", 두 반직선을 각의 ", { o: ["변", "꼭짓점"], a: 0 }, "이라고 해요. 종이를 반듯하게 두 번 접었을 때 생기는 각을 ", { o: ["직각", "선분"], a: 0 }, "이라고 해요."]) },
    { name: "확인하기", inst: "우리 주변에서 각을 찾고, 이 단원에서 배우고 싶은 것을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "우리 주변에서 각을 볼 수 있는 곳을 두 가지 써 보세요.", tag: "주변의 각", ph: "예) 운동장 철봉, 계단, 집게" },
        { q: "각에 대해 무엇이 궁금한가요? 배우고 싶은 것을 써 보세요.", tag: "학습 계획", ph: "예) 각의 크기를 어떻게 잴까?" }]) }
  ],
  challenge: { inst: "한 점에서 그은 반직선 3개로 그린 그림이에요. 그림에서 찾을 수 있는 각은 모두 몇 개인가요?", hints: ["반직선을 두 개씩 짝 지어 보세요.", "작은 각 2개와, 두 각을 합친 큰 각 1개가 있어요."],
    render: (b, a) => { b.append(a2Fig(520, 300, s => { const V = [150, 250]; [0, 50, 120].forEach(d => s.append(a2Line(V, a2Pt(V, d, 230)))); s.append(svgEl("circle", { cx: V[0], cy: V[1], r: 6, fill: INK })); }, "22em"));
      numbers(b, a, [{ q: "각은 모두 몇 개인가요?", a: 3, unit: "개", why: { "2": "작은 각 2개만 세었어요. 두 각을 합친 큰 각도 하나의 각이에요." } }], { ok: "각은 3개예요. 작은 각 2개와 두 각을 합친 큰 각 1개가 있어요." }); } }
},
{
  id: "a2", no: 2, title: "각의 크기를 비교해 볼까요", soop: "개념 구축하기(O)",
  question: "두 각 중에서 어느 각이 더 클까요? 어떻게 비교할 수 있을까요?",
  summary: "각의 두 변이 벌어진 정도를 각의 크기라고 해요. 각의 크기는 변의 길이와 상관없어요. 투명 종이에 한 각을 본떠 꼭짓점과 한 변을 맞추어 겹치거나, 같은 눈금으로 칸 수를 세어 비교해요. 눈금의 크기가 다르면 칸 수가 달라져서 같은 도구(단위)가 필요해요.",
  steps: [
    { inst: "지안이와 은호가 만든 동물 모양 의자예요. 등받이와 앉는 곳이 이루는 두 각 가와 나 중 어느 각이 더 클까요? 가를 투명 종이에 본떠 나에 겹쳐 보세요.", hints: ["눈으로는 비슷해 보여요. 투명 종이를 겹쳐서 비교해요.", "꼭짓점과 한 변을 맞춘 다음, 나머지 한 변이 더 많이 벌어진 쪽이 더 큰 각이에요."],
      render: (b, a) => a2Trace(b, a, { A: { V: [150, 300], d1: 5, a: 98, L: 200, L2: 170, label: "가", name: "코끼리 모양 의자" }, B: { V: [520, 330], d1: -12, a: 92, L: 290, L2: 250, label: "나", name: "기린 모양 의자" }, answer: "가",
        ok: "가의 각의 크기가 더 커요. 나의 변이 더 길지만, 두 변이 더 많이 벌어진 것은 가예요.", why: "빨간 점선(가)의 나머지 한 변이 나의 변보다 더 바깥쪽으로 벌어져 있는지 다시 봐요. 나의 변이 더 길다고 각이 더 큰 것은 아니에요." }) },
    { name: "눈금으로 재기", inst: "직각을 똑같은 크기로 나눈 서로 다른 눈금이에요. 도하의 눈금과 유주의 눈금으로 가와 나는 각각 몇 칸인지 세어 보세요.", hints: ["두 변 사이에 들어가는 칸만 세어요.", "눈금 도구 단추를 눌러 도하의 눈금과 유주의 눈금을 바꿔 가며 세어요."],
      render: (b, a) => a2Units(b, a, { angles: [{ a: 45, label: "가" }, { a: 90, label: "나" }], tools: [{ name: "도하의 눈금", n: 4 }, { name: "유주의 눈금", n: 6 }], ans: [[2, 4], [3, 6]], ok: "도하의 눈금으로 가 2칸, 나 4칸 / 유주의 눈금으로 가 3칸, 나 6칸이에요." }) },
    { inst: "센 칸 수로 두 각을 비교해 말해 보세요.", hints: ["나의 칸 수에서 가의 칸 수를 빼요.", "도하의 칸이 유주의 칸보다 커요."],
      render: (b, a) => blanks(b, a, ["나는 가보다 도하의 눈금으로 ", { o: ["2", "4", "6"], a: 0 }, "칸만큼, 유주의 눈금으로 ", { o: ["2", "3", "6"], a: 1 }, "칸만큼 더 커요. 같은 각이라도 이용하는 눈금에 따라 눈금의 수가 ", { o: ["달라져요", "같아요"], a: 0 }, ". 그래서 각의 크기를 알려 주려면 모두 ", { o: ["같은 도구", "서로 다른 도구"], a: 0 }, "로 재야 해요."]) },
    { inst: "약속: 각의 두 변이 벌어진 정도를 각의 크기라고 해요. 알맞은 말을 골라 보세요.", hints: ["변을 길게 늘여도 두 변이 벌어진 정도는 그대로예요."],
      render: (b, a) => blanks(b, a, ["각의 크기는 각의 두 변이 ", { o: ["벌어진 정도", "길이"], a: 0 }, "예요. 변의 길이가 길어져도 각의 크기는 ", { o: ["변하지 않아요", "커져요"], a: 0 }, "."]) },
    { inst: "각의 크기를 비교해 보세요.", hints: ["두 변이 더 많이 벌어진 각이 더 커요.", "변의 길이는 생각하지 않아요."],
      render: (b, a) => quiz(b, a, [
        { q: "각의 크기가 더 작은 각은?", fig: () => a2Cards([{ d1: 45, a: 90 }, { d1: 30, a: 120, L2r: .6 }], { maxW: "22em" }), o: ["가", "나"], a: 0 },
        { q: "각의 크기가 큰 것부터 차례로 쓴 것은?", fig: () => a2Cards([{ d1: 10, a: 70 }, { d1: 80, a: 25, L2r: 1.2 }, { d1: 200, a: 125, L2r: .7 }], { maxW: "32em" }), o: ["다, 가, 나", "가, 나, 다", "나, 가, 다"], a: 0, why: { "2": "변이 긴 나가 가장 큰 것은 아니에요. 두 변이 벌어진 정도를 비교해요." } },
        { q: "보기의 각보다 작은 각을 모두 골라요.", fig: () => a2Cards([{ d1: 0, a: 65, label: "보기" }, { d1: 30, a: 40, L2r: 1.3, label: "가" }, { d1: 120, a: 80, L2r: .6, label: "나" }, { d1: 0, a: 110, label: "다" }, { d1: 250, a: 55, label: "라" }], { per: 5, maxW: "46em", cw: 200 }), o: ["가", "나", "다", "라"], a: [0, 3] }], { ok: "가가 더 작아요 / 다, 가, 나 / 보기보다 작은 각은 가, 라예요." }) }
  ],
  challenge: { inst: "익힘 문제예요. 그림을 보고 물음에 답해 보세요.", hints: ["변의 길이에 속지 말아요.", "직각을 똑같이 나눈 눈금이니 칸 수의 차를 구해요."],
    render: (b, a) => quiz(b, a, [
      { q: "두 각 중 크기가 더 큰 각과 그 까닭으로 알맞은 것은?", fig: () => a2Cards([{ d1: 20, a: 35, L2r: 1 }, { d1: 10, a: 75, L2r: .45, maxL: 120 }], { maxW: "22em" }), o: ["가, 변이 더 길어서", "나, 두 변이 더 많이 벌어져 있어서", "가, 그림이 더 커서"], a: 1, why: { "0": "변의 길이는 각의 크기와 상관없어요. 두 변이 벌어진 정도를 봐요.", "2": "그림의 크기가 아니라 두 변이 벌어진 정도를 봐요." } },
      { q: "직각을 똑같이 나눈 눈금으로 재었더니 가는 5칸, 나는 3칸이었어요. 알맞은 말은?", o: ["가는 나보다 2칸만큼 더 커요", "가는 나보다 2칸만큼 더 작아요", "가는 나보다 8칸만큼 더 커요"], a: 0 }], { ok: "나가 더 커요. 두 변이 벌어진 정도가 각의 크기예요." }) }
},
{
  id: "a3", no: 3, title: "각의 크기를 재어 볼까요", soop: "개념 구축하기(O)",
  question: "각의 크기를 어떻게 나타내고, 각도기로 어떻게 잴까요?",
  summary: "각의 크기를 각도라고 해요. 직각의 크기를 똑같이 90으로 나눈 것 중 하나를 1도라 하고, 1°라고 써요. 직각의 크기는 90°예요. 각도기로 잴 때는 ① 중심을 꼭짓점에 맞추고 ② 밑금을 한 변에 맞춘 다음 ③ 그 변이 0인 쪽 눈금에서 다른 변과 만나는 눈금을 읽어요.",
  steps: [
    { inst: "지안이가 그린 오르막길 그림의 각 ㄱㄴㄷ이에요. 각도기를 끌어 중심을 꼭짓점 ㄴ에, 밑금을 변 ㄴㄷ에 맞추고 눈금을 읽어 보세요.", hints: ["각도기의 빨간 점(중심)을 꼭짓점 ㄴ에 놓아요.", "변 ㄴㄷ이 안쪽(파란) 눈금 0에 맞춰져 있으면 안쪽 눈금을 읽어요."],
      render: (b, a) => a2Measure(b, a, { items: [{ d1: 0, a: 60, names: ["ㄱ", "ㄴ", "ㄷ"], ask: "각 ㄱㄴㄷ의 크기는 몇 도일까요?", deco: g => { const V = [400, 324]; for (let t = 1; t < 5; t++) { const q = a2Pt(V, 60, t * 50); g.append(a2Line(q, [q[0], q[1] - 34], { stroke: "#C9A27A", "stroke-width": 4 })); } } }], ok: "각 ㄱㄴㄷ은 60°예요. 변 ㄴㄷ이 안쪽 눈금 0에 맞춰져 있어서 안쪽 눈금 60을 읽었어요." }) },
    { name: "재어 보기", inst: "각도기를 이용하여 각도를 재어 보세요. ②는 각도기가 미리 놓여 있어요.", hints: ["각이 직각보다 작은지 큰지 먼저 생각하면 어느 눈금을 읽을지 알 수 있어요.", "한 변이 맞춰진 쪽의 0에서부터 10, 20, 30… 세어 가요."],
      render: (b, a) => a2Measure(b, a, { items: [{ d1: 0, a: 50, ask: "① 각도를 재어 보세요." }, { d1: 25, a: 125, placed: true, ask: "② 각도기가 기울어져 놓여 있어요. 각도를 읽어 보세요." }, { d1: 0, a: 70, V: [320, 360], ask: "③ 각도를 재어 보세요." }], ok: "① 50° ② 125° ③ 70°를 바르게 쟀어요." }) },
    { inst: "각도기를 바르게 쓰는 방법을 말해 보세요.", hints: ["중심은 꼭짓점에, 밑금은 한 변에 맞춰야 해요.", "변이 짧아도 각의 크기는 변하지 않아요."],
      render: (b, a) => quiz(b, a, [
        { q: "각도기를 바르게 놓은 것은?", fig: () => a2Row(a2ProtFig({ d1: 0, a: 50 }, { V: [280, 280], C: [325, 280], extra: s => s.append(txt(26, 26, "가", 26)) }), a2ProtFig({ d1: 0, a: 50 }, { V: [280, 280], extra: s => s.append(txt(26, 26, "나", 26)) }), a2ProtFig({ d1: 0, a: 50 }, { V: [280, 280], rot: 14, extra: s => s.append(txt(26, 26, "다", 26)) })),
          o: ["가", "나", "다"], a: 1, why: { "0": "가는 각도기의 중심이 꼭짓점에서 벗어나 있어요.", "2": "다는 각도기의 밑금이 각의 한 변에 맞지 않아요." } },
        { q: "이 각의 크기는?", fig: () => a2ProtFig({ d1: 0, a: 40 }, { V: [280, 280] }), o: ["40°", "140°"], a: 0, why: { "1": "한 변이 안쪽 눈금 0에 맞춰져 있으니 안쪽 눈금을 읽어요. 이 각은 직각보다 작아요." } },
        { q: "각의 변이 짧아 각도기 눈금에 닿지 않을 때는 어떻게 할까요?", o: ["자로 변을 곧게 늘여서 재요", "잴 수 없어요", "변이 짧으니 각도도 작아요"], a: 0, why: { "2": "각의 크기는 변의 길이와 상관없어요." } }], { ok: "나처럼 중심과 밑금을 맞추고, 0에서 시작하는 쪽 눈금을 읽어요." }) },
    { inst: "약속: 각의 크기를 나타내는 단위를 알아봐요. 알맞은 말을 골라 약속을 완성해요.", hints: ["3학년 때 배운 직각을 똑같이 나눈 것이 1도예요.", "°는 온도의 ℃와 달라요."],
      render: (b, a) => blanks(b, a, ["각의 크기를 ", { o: ["각도", "길이", "온도"], a: 0 }, "라고 해요. 직각의 크기를 똑같이 ", { o: ["90", "100", "180"], a: 0 }, "으로 나눈 것 중 하나를 1도라 하고, ", { o: ["1°", "1℃", "1 cm"], a: 0 }, "라고 써요. 직각의 크기는 ", { o: ["90°", "100°", "180°"], a: 0 }, "예요."]) },
    { inst: "여러 가지 모양의 각을 재어 보세요. 각의 모양에 따라 각도기를 돌려서 대요.", hints: ["각도기를 돌려 밑금을 한 변에 맞춰요. ‘반 바퀴’ 단추로 뒤집을 수 있어요.", "변이 짧으면 ‘자로 변 늘이기’를 눌러요."],
      render: (b, a) => a2Measure(b, a, { items: [{ d1: 195, a: 150, V: [400, 230], ask: "④ 꼭짓점이 위에 있는 각이에요. 각도를 재어 보세요." }, { d1: 200, a: 115, V: [440, 240], ask: "⑤ 각도를 재어 보세요." }, { d1: 50, a: 85, short: true, V: [400, 380], ask: "⑥ 변이 짧아요. 변을 늘여서 재어 보세요." }], ok: "④ 150° ⑤ 115° ⑥ 85°를 바르게 쟀어요." }) }
  ],
  challenge: { inst: "물건에서 볼 수 있는 각도를 재어 보세요.", hints: ["두 날, 두 부분, 부챗살 양 끝, 펼친 책의 두 쪽이 이루는 각이에요.", "펼친 책처럼 두 변이 일직선이면 각도기 끝의 눈금을 읽어요."],
    render: (b, a) => a2Measure(b, a, { items: [
      { d1: 0, a: 45, ask: "가위의 두 날이 이루는 각도는?", color: "#6E7C86", deco: g => { const V = [400, 324]; [200, 225].forEach(d => g.append(svgEl("circle", { cx: a2F(a2Pt(V, d, 70)[0]), cy: a2F(a2Pt(V, d, 70)[1]), r: 26, fill: "none", stroke: "#C8472E", "stroke-width": 8 }))); } },
      { d1: 0, a: 90, ask: "스탠드의 두 부분이 이루는 각도는?", color: "#8E5BC9", deco: g => { const V = [400, 324], T = a2Pt(V, 90, 250); g.append(svgEl("path", { d: `M${T[0] - 10},${T[1]} l-50,40 l120,0 z`, fill: "#FFE08A", stroke: "#B4610F", "stroke-width": 3 })); } },
      { d1: 0, a: 135, ask: "부채의 양 끝이 이루는 각도는?", color: "#B4610F", deco: g => { const V = [400, 324]; g.append(svgEl("path", { d: a2WedgeD(V, 0, 135, 240), fill: "#FDE3C8", stroke: "#E47A38", "stroke-width": 2 })); for (let t = 15; t < 135; t += 15) g.append(a2Line(V, a2Pt(V, t, 240), { stroke: "#E4B48A", "stroke-width": 2 })); } },
      { d1: 0, a: 180, ask: "펼친 책의 두 쪽이 이루는 각도는?", color: "#2B6FB8", deco: g => { const V = [400, 324]; g.append(svgEl("rect", { x: 150, y: 300, width: 500, height: 24, fill: "#DCEAFB" })); } }], ok: "가위 45°, 스탠드 90°, 부채 135°, 펼친 책 180°예요. 모두 45°씩 커져요." }) }
},
{
  id: "a4", no: 4, title: "직각보다 작은 각과 큰 각을 알아볼까요", soop: "개념 구축하기(O)",
  question: "각을 직각과 비교하면 어떻게 나눌 수 있을까요?",
  summary: "각도가 0°보다 크고 직각보다 작은 각을 예각, 각도가 직각보다 크고 180°보다 작은 각을 둔각이라고 해요. 직각(90°)은 예각도 둔각도 아니에요. 예각과 둔각은 변의 길이나 놓인 방향과 상관없이 각의 크기로 정해요.",
  steps: [
    { name: "만져 보기", inst: "지안이와 친구들이 그린 놀이기구에서 찾은 각이에요. 각을 하나씩 눌러 고르고 직각보다 작은 각, 직각, 직각보다 큰 각으로 나누어 보세요.", hints: ["‘삼각자 직각 대 보기’를 누르면 직각과 비교할 수 있어요.", "파란 직각보다 덜 벌어지면 직각보다 작은 각, 더 벌어지면 직각보다 큰 각이에요."],
      render: (b, a) => a2Sorter(b, a, { cats: ["직각보다 작은 각", "직각", "직각보다 큰 각"], items: [
        { label: "가 · 철봉", d1: 0, a: 90, cat: 1, why: "가(철봉)는 기둥과 가로대가 만나는 곳이라 삼각자의 직각과 꼭 맞아요." },
        { label: "나 · 미끄럼판", d1: 145, a: 35, cat: 0, why: "나(미끄럼판과 바닥)는 직각보다 덜 벌어져 있어요." },
        { label: "다 · 미끄럼틀 위", d1: 225, a: 105, cat: 2, why: "다는 삼각자의 직각보다 더 벌어져 있어요." },
        { label: "라 · 미끄럼틀 계단", d1: 20, a: 125, L2r: .7, cat: 2, why: "라는 직각보다 더 벌어져 있어요. 변이 짧아도 각의 크기는 그대로예요." },
        { label: "마 · 시소", d1: 0, a: 20, L2r: 1.2, cat: 0, why: "마(시소판과 받침)는 직각보다 훨씬 덜 벌어져 있어요." }], ok: "직각보다 작은 각: 나, 마 / 직각: 가 / 직각보다 큰 각: 다, 라" }) },
    { inst: "주어진 선분을 각의 한 변으로 하는 예각과 둔각을 차례로 만들어 보세요. 주황 동그라미를 끌어요.", hints: ["파란 점선이 직각이에요. 예각은 직각보다 작게, 둔각은 직각보다 크게 벌려요.", "두 변이 일직선이 되면 둔각이 아니에요."],
      render: (b, a) => a2Maker(b, a, { W: 720, H: 420, V: [360, 360], d1: 0, L: 260, snap: 5, show: true, guide90: true, start: 90, items: [{ kind: "예각", ask: "예각을 만들어 보세요." }, { kind: "둔각", ask: "둔각을 만들어 보세요." }], ok: "예각과 둔각을 만들었어요. 친구가 만든 예각·둔각과 모양이 달라도 괜찮아요." }) },
    { inst: "보기처럼 시각을 시계에 나타내고, 긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 예각인지 둔각인지 알아보세요. (보기: 3시는 직각)", hints: ["30분이면 긴바늘은 6을, 짧은바늘은 두 수의 한가운데를 가리켜요.", "주황색으로 칠해진 작은 쪽의 각을 직각과 비교해요."],
      render: (b, a) => a2Clock(b, a, { items: [{ h: 4, m: 30 }, { h: 8, m: 0 }], ok: "4시 30분은 예각(45°), 8시는 둔각(120°)이에요." }) },
    { inst: "약속: 직각보다 작은 각과 큰 각의 이름을 알아봐요. 알맞은 말을 골라 약속을 완성해요.", hints: ["예각은 ‘뾰족한 각’, 둔각은 ‘무딘 각’이라는 뜻이에요."],
      render: (b, a) => blanks(b, a, ["각도가 0°보다 크고 직각보다 작은 각을 ", { o: ["예각", "둔각", "직각"], a: 0 }, "이라고 해요. 각도가 직각보다 크고 ", { o: ["180°", "360°", "100°"], a: 0 }, "보다 작은 각을 ", { o: ["둔각", "예각", "직각"], a: 0 }, "이라고 해요."]) },
    { inst: "예각과 둔각을 구별해 보세요.", hints: ["삼각자의 직각 부분과 비교해 봐요.", "90°는 예각도 둔각도 아니에요."],
      render: (b, a) => quiz(b, a, [
        { q: "둔각을 모두 골라요.", fig: () => a2Cards([{ d1: 50, a: 130 }, { d1: 160, a: 40 }, { d1: 215, a: 110 }], { maxW: "32em" }), o: ["가", "나", "다"], a: [0, 2] },
        { q: "예각을 모두 골라요.", o: ["25°", "130°", "85°", "90°", "115°"], a: [0, 2] },
        { q: "둔각을 모두 골라요.", o: ["25°", "130°", "85°", "90°", "115°"], a: [1, 4] }], { bad: "직각(90°)보다 작은지 큰지 하나씩 비교해 봐요. 90°는 예각도 둔각도 아니에요.", ok: "둔각은 가, 다 / 예각은 25°, 85° / 둔각은 130°, 115°예요. 90°는 직각이에요." }) }
  ],
  challenge: { inst: "한 점에서 그은 반직선 4개로 만든 그림과 시계를 보고 물음에 답해 보세요.", hints: ["반직선을 두 개씩 짝 지어 생기는 각을 모두 살펴봐요. 일직선(180°)은 둔각이 아니에요.", "7시는 짧은바늘이 7, 긴바늘이 12를 가리켜요."],
    render: (b, a) => a2Chain(b, a, [
      (bx, ax) => { bx.append(a2Fig(560, 270, s => { const V = [280, 230]; [0, 40, 150, 180].forEach(d => s.append(a2Line(V, a2Pt(V, d, 240)))); s.append(svgEl("circle", { cx: V[0], cy: V[1], r: 6, fill: INK })); }, "24em"));
        numbers(bx, ax, [{ q: "둔각은 모두 몇 개인가요?", a: 3, unit: "개", why: { "1": "두 각을 합친 큰 각도 살펴봐요.", "2": "두 각을 합친 큰 각도 살펴봐요.", "4": "일직선(180°)은 둔각이 아니에요." } }, { q: "예각은 모두 몇 개인가요?", a: 2, unit: "개" }], { ok: "둔각 3개, 예각 2개예요." }); },
      (bx, ax) => a2Clock(bx, ax, { items: [{ h: 7, m: 0 }, { h: 3, m: 30 }], ok: "7시는 둔각(150°), 3시 30분은 예각(75°)이에요." })]) }
},
{
  id: "a5", no: 5, title: "각도를 어림해 볼까요", soop: "개념 구축하기(O)",
  question: "각도를 어떻게 어림할 수 있을까요?",
  summary: "각도를 어림할 때는 직각(90°)이나 삼각자의 30°, 45°, 60°처럼 익숙한 각과 비교해요. 어림한 각도는 ‘약 ○°’라고 나타내고, 각도기로 재어 확인해요. 잰 각도에 가깝게 어림할수록 잘 어림한 거예요.",
  steps: [
    { inst: "은호가 만든 책 모양 오두막이에요. 오두막에서 보이는 각 가(꼭대기)와 나(바닥 오른쪽)를 먼저 어림하고, 각도기로 재어 확인해 보세요.", hints: ["삼각자의 각 단추를 눌러 대 보세요. 가는 30°보다 크고 45°보다 작아 보여요.", "나는 60°보다 조금 크고 직각보다 작아 보여요."],
      render: (b, a) => a2Measure(b, a, { W: 800, H: 640, items: a2PolyItems(A2_HOUSE, [70, 70, 40]).filter((_, i) => i !== 0).reverse().map((it, i) => Object.assign(it, { est: true, ask: i ? "나: 바닥 오른쪽 각을 어림하고 재어 보세요." : "가: 오두막 꼭대기의 각을 어림하고 재어 보세요.",
        deco: g => { g.append(svgEl("polygon", { points: A2_HOUSE.map(p => p.map(a2F).join(",")).join(" "), fill: "#CFE2F7", stroke: "#2B6FB8", "stroke-width": 5, "stroke-linejoin": "round" })); const m = [(A2_HOUSE[0][0] + A2_HOUSE[1][0]) / 2, A2_HOUSE[0][1]]; g.append(svgEl("rect", { x: m[0] - 30, y: m[1] - 90, width: 60, height: 90, fill: "#F6E3C6", stroke: "#9C8A62", "stroke-width": 3 }));
          g.append(txt(A2_HOUSE[2][0] + 40, A2_HOUSE[2][1] + 10, "가", 30, { fill: "#C8472E" }), txt(A2_HOUSE[1][0] + 30, A2_HOUSE[1][1] - 34, "나", 30, { fill: "#C8472E" })); } })), ok: "가는 40°, 나는 70°예요. 삼각자의 각과 비교하면 잰 각도에 가깝게 어림할 수 있어요." }) },
    { name: "어림해 그리기", inst: "각도기를 보지 않고 어림해서 각을 만들어 보세요. 만든 뒤 ‘확인하기’를 누르면 실제 각도가 보여요.", hints: ["50°는 45°보다 조금 커요. 직각의 절반쯤보다 조금 더 벌려요.", "120°는 직각보다 직각의 3분의 1쯤 더 벌어진 각이에요."],
      render: (b, a) => a2Maker(b, a, { W: 720, H: 420, V: [300, 360], d1: 0, L: 260, snap: 1, show: false, start: 15, items: [{ target: 50, est: 10, ask: "약 50°인 각을 만들어 보세요." }, { target: 120, est: 10, ask: "약 120°인 각을 만들어 보세요." }], ok: "어림해서 각을 만들었어요. 어림한 각과 실제 각도를 비교해 보세요." }) },
    { inst: "어림한 까닭을 말해 보세요.", hints: ["삼각자의 각 30°, 45°, 60°, 90° 중 어느 두 각 사이인지 생각해요."],
      render: (b, a) => blanks(b, a, ["오두막 꼭대기의 각 가는 삼각자의 ", { o: ["30°", "60°", "90°"], a: 0 }, "보다 크고 45°보다 작은 것 같아서 약 40°로 어림했어요. 바닥의 각 나는 ", { o: ["60°", "30°"], a: 0 }, "보다 조금 크고 ", { o: ["직각", "45°"], a: 0 }, "보다 작은 것 같아서 약 70°로 어림했어요."]) },
    { inst: "약속: 각도를 어림하는 방법을 정리해요. 알맞은 말을 골라 보세요.", hints: ["어림한 값은 정확한 값이 아니라서 ‘약’을 붙여요."],
      render: (b, a) => blanks(b, a, ["어림한 각도는 ", { o: ["약 50°", "정확히 50°"], a: 0 }, "처럼 나타내요. 어림할 때는 ", { o: ["삼각자의 30°, 45°, 60°와 직각 90°", "각의 변의 길이"], a: 0 }, "를 기준으로 비교하고, 각도기로 재어 확인해요."]) },
    { inst: "각도를 어림해 보고, 각도기로 재어 확인해 보세요.", hints: ["①은 45°와 60° 사이, ②는 직각보다 조금 큰 각이에요.", "각도기로 잰 각도에 가깝게 어림하면 좋아요."],
      render: (b, a) => a2Measure(b, a, { items: [{ d1: 155, a: 50, V: [560, 330], est: true, ask: "① 어림하고 재어 보세요." }, { d1: 30, a: 100, est: true, ask: "② 어림하고 재어 보세요." }], ok: "① 50° ② 100°예요. 어림한 각도와 잰 각도를 비교해 보세요." }) }
  ],
  challenge: { inst: "식물의 잎에서 보이는 각도를 어림하고 재어 본 다음, 어림을 더 잘한 친구를 찾아보세요.", hints: ["강낭콩 잎 끝은 60°보다 크고 직각보다 작아 보여요.", "잰 각도와의 차이가 더 작은 사람이 어림을 더 잘한 거예요."],
    render: (b, a) => a2Chain(b, a, [
      (bx, ax) => a2Measure(bx, ax, { items: [{ d1: 235, a: 70, V: [400, 200], est: true, color: "#2F6B57", ask: "강낭콩 잎 끝의 각도를 어림하고 재어 보세요." }, { d1: 220, a: 100, V: [400, 200], est: true, color: "#2F6B57", ask: "딸기 잎 끝의 각도를 어림하고 재어 보세요." }].map((it, i) => Object.assign(it, { L: 150, ext: true, deco: a2LeafDeco(it, i ? "#9BD08A" : "#B9E3A8") })), ok: "강낭콩 잎 70°, 딸기 잎 100°예요." }),
      (bx, ax) => quiz(bx, ax, [{ q: "유미는 약 100°, 승호는 약 140°로 어림했어요. 각도기로 재어 보니 그림과 같았어요. 어림을 더 잘한 사람은?", fig: () => a2ProtFig({ d1: 0, a: 130 }, { V: [280, 280] }), o: ["유미", "승호"], a: 1, why: { "0": "잰 각도는 130°예요. 유미는 30°, 승호는 10° 차이가 나요." } }], { ok: "잰 각도는 130°라서 10° 차이인 승호가 더 잘 어림했어요." })]) }
},
{
  id: "a6", no: 6, title: "각도의 합과 차를 구해 볼까요", soop: "개념 구축하기(O)",
  question: "두 각도의 합과 차는 어떻게 구할까요?",
  summary: "두 각도의 합은 두 각을 꼭짓점과 한 변을 맞대어 이어 붙인 각도와 같아요. 자연수의 덧셈과 같은 방법으로 계산하고 단위 °를 붙여요(15°+30°=45°). 두 각도의 차는 큰 각에 작은 각을 겹쳐 남은 각도와 같아요. 큰 각도에서 작은 각도를 빼요(130°−50°=80°).",
  steps: [
    { inst: "지안이가 나무 집 창문을 처음에 15° 열고, 잠시 뒤 30°를 더 열었어요. 파란 조각 나(30°)를 끌어 가(15°)에 이어 붙이고, 이어 붙인 각 다의 각도를 재어 보세요.", hints: ["나를 가의 꼭짓점 가까이에 놓으면 저절로 이어 붙어요.", "‘각도기 대 보기’를 눌러 다의 크기를 읽어요."],
      render: (b, a) => a2Join(b, a, { mode: "sum", a: 15, b: 30, ok: "이어 붙인 각은 45°예요. 15°+30°=45°와 같아요." }) },
    { name: "겹쳐 보기", inst: "가(130°) 위에 나(50°)를 꼭짓점과 한 변이 맞도록 겹쳐 보세요. 겹치지 않고 남은 각 다는 몇 도일까요?", hints: ["나를 가의 꼭짓점 가까이에 놓으면 한 변이 맞게 겹쳐요.", "남은 각은 130°보다 작아요."],
      render: (b, a) => a2Join(b, a, { mode: "diff", a: 130, b: 50, ok: "남은 각은 80°예요. 130°−50°=80°와 같아요." }) },
    { inst: "각도의 합과 차를 구하는 방법을 말해 보세요.", hints: ["각도의 계산은 수의 계산과 같고 끝에 °를 붙여요."],
      render: (b, a) => blanks(b, a, ["두 각도의 합은 ", { o: ["자연수의 덧셈", "자연수의 뺄셈"], a: 0 }, "과 같은 방법으로 계산하고 단위 °를 붙여요. 두 각도의 차는 ", { o: ["큰 각도에서 작은 각도를", "작은 각도에서 큰 각도를"], a: 0 }, " 빼서 구해요."]) },
    { name: "계산하기", inst: "각도의 합과 차를 구해 보세요.", hints: ["받아올림과 받아내림에 주의해요.", "답에는 ° 단위가 붙어요. 수만 써요."],
      render: (b, a) => numbers(b, a, [
        { q: "60° + 70° =", a: 130, unit: "°" }, { q: "95° + 45° =", a: 140, unit: "°", why: { "130": "일의 자리 5+5=10이에요. 받아올림을 해요." } },
        { q: "110° − 25° =", a: 85, unit: "°", why: { "95": "일의 자리 0−5는 뺄 수 없어서 받아내림을 해요." } }, { q: "155° − 80° =", a: 75, unit: "°" }], { ok: "130°, 140°, 85°, 75°예요." }) },
    { inst: "도하는 크기와 모양이 같은 사각형 종이를 이어 붙여 바람개비를 만들었어요. 종이를 한 장씩 붙이며 표시된 각도를 써 보세요.", hints: ["종이 한 장의 각은 직각 90°예요.", "4장을 붙이면 한 점을 중심으로 한 바퀴를 돌아요."],
      render: (b, a) => a2Pinwheel(b, a, { ok: "90°, 180°, 270°, 360°예요. 180°는 두 변이 일직선, 360°는 한 바퀴를 도는 각이에요." }) }
  ],
  challenge: { inst: "각도의 합과 차를 이용해 문제를 해결해 보세요.", hints: ["먼저 하나씩 계산한 다음 비교해요.", "삼각자의 60°를 두 번 더해요."],
    render: (b, a) => quiz(b, a, [
      { q: "계산 결과가 작은 것부터 차례로 쓴 것은?  ㉠ 170°−53°  ㉡ 87°+46°  ㉢ 64°+39°  ㉣ 154°−28°", o: ["㉢, ㉠, ㉣, ㉡", "㉠, ㉡, ㉢, ㉣", "㉢, ㉣, ㉠, ㉡"], a: 0, why: { "2": "㉠은 117°, ㉣은 126°예요. 다시 비교해요." } },
      { q: "등받이 각도가 110°인 의자를 140°가 되도록 더 눕혔어요. 몇 도 더 눕혔나요?", o: ["30°", "250°", "40°"], a: 0, why: { "1": "더 눕힌 각도는 두 각도의 차예요." } },
      { q: "30°·60° 삼각자 두 개의 60°인 부분을 겹치지 않게 이어 붙였어요. 만들어진 각은 몇 도일까요?", fig: () => a2Fig(520, 300, s => { const V = [260, 270], L = 120; [0, 60].forEach((d, i) => { const A = a2Pt(V, d, L), B = a2Pt(V, d + 60, L * 2); s.append(svgEl("polygon", { points: [V, A, B].map(p => p.map(a2F).join(",")).join(" "), fill: i ? "rgba(43,123,214,.25)" : "rgba(228,122,56,.28)", stroke: INK, "stroke-width": 3 })); }); s.append(svgEl("path", { d: a2ArcD(V, 0, 120, 44), fill: "none", stroke: "#C8472E", "stroke-width": 4 }), txt(...a2Pt(V, 60, 70), "?", 24)); }, "20em"), o: ["120°", "90°", "105°"], a: 0 }], { ok: "㉢ 103°, ㉠ 117°, ㉣ 126°, ㉡ 133° / 30° / 60°+60°=120°" }) }
},
{
  id: "a7", no: 7, title: "삼각형의 세 각의 크기의 합을 알아볼까요", soop: "개념 구축하기(O)",
  question: "삼각형의 크기와 모양이 다르면 세 각의 크기의 합도 다를까요?",
  summary: "삼각형의 세 각의 크기의 합은 180°예요. 삼각형의 크기와 모양이 달라도 세 각의 크기의 합은 언제나 180°예요. 세 각을 잘라 한 점에 모으면 일직선이 돼요. 두 각의 크기를 알면 180°에서 두 각을 빼서 나머지 한 각을 구해요.",
  steps: [
    { inst: "점심으로 먹을 삼각김밥 모양의 삼각형이에요. 각도기로 세 각의 크기를 각각 재고 더해 보세요.", hints: ["꼭짓점마다 각도기의 중심과 밑금을 맞춰요.", "각이 직각보다 큰지 작은지 먼저 생각하고 눈금을 읽어요."],
      render: (b, a) => a2Chain(b, a, [
        (bx, ax) => a2Measure(bx, ax, { W: 900, H: 600, items: a2PolyItems(A2_TRI7, [30, 40, 110]).map((it, i) => Object.assign(it, { ask: ["왼쪽 아래 각을 재어 보세요.", "오른쪽 아래 각을 재어 보세요.", "위쪽 각을 재어 보세요."][i], deco: g => g.append(svgEl("polygon", { points: A2_TRI7.map(p => p.map(a2F).join(",")).join(" "), fill: "#FFF6D9", stroke: "#2F2F2F", "stroke-width": 4 })) })), ok: "세 각은 30°, 40°, 110°예요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "30° + 40° + 110° =", a: 180, unit: "°" }], { ok: "세 각의 크기의 합은 180°예요." })]) },
    { name: "움직여 보기", inst: "꼭짓점(동그라미)을 끌어 삼각형의 모양과 크기를 여러 가지로 바꾸어 보세요. 세 각의 크기는 어떻게 되고, 합은 어떻게 되나요?", hints: ["한 꼭짓점을 움직이면 어떤 각은 커지고 어떤 각은 작아져요.", "아래의 합을 잘 봐요."],
      render: (b, a) => a2Sum(b, a, { mode: "drag", angles: [50, 90, 40], lens: [10], W: 860, H: 470, ok: "모양과 크기가 달라져도 세 각의 크기의 합은 언제나 180°예요." }) },
    { name: "잘라 붙이기", inst: "그린 삼각형의 세 각을 잘라 세 꼭짓점이 한 점에 모이도록 이어 붙여 보세요. 모서리를 하나씩 눌러요.", hints: ["세 조각이 겹치지 않게 변과 변을 이어 붙여요.", "세 각이 모여 일직선이 돼요."],
      render: (b, a) => a2Sum(b, a, { mode: "tear", angles: [65, 45, 70], lens: [10], W: 880, H: 470, ok: "세 각을 모으면 일직선이 되어 180°예요." }) },
    { inst: "약속: 삼각형의 세 각의 크기의 합을 정리해요. 알맞은 말을 골라 보세요.", hints: ["일직선이 이루는 각은 180°예요."],
      render: (b, a) => blanks(b, a, ["삼각형의 세 각의 크기의 합은 ", { o: ["180°", "360°", "90°"], a: 0 }, "예요. 삼각형의 크기와 모양이 달라도 세 각의 크기의 합은 ", { o: ["같아요", "달라요"], a: 0 }, "."]) },
    { inst: "□ 안에 알맞은 수를 써넣으세요.", hints: ["180°에서 주어진 두 각을 빼요.", "□ + 35° + 45° = 180°처럼 생각해도 돼요."],
      render: (b, a) => { b.append(a2Row(a2PolyFig([35, 45, 100], [10], ["35°", "45°", "㉠"]), a2PolyFig([70, 80, 30], [10], ["70°", "㉡", "30°"])));
        numbers(b, a, [{ q: "㉠ =", a: 100, unit: "°", why: { "280": "180°에서 두 각을 모두 빼요." } }, { q: "㉡ =", a: 80, unit: "°", why: { "110": "180°에서 30°와 70°를 모두 빼요." } }], { ok: "㉠ 180°−35°−45°=100°, ㉡ 180°−30°−70°=80°예요." }); } }
  ],
  challenge: { inst: "삼각형의 세 각의 크기의 합을 이용해 문제를 해결해 보세요.", hints: ["직각삼각형에는 90°인 각이 있어요.", "잘라 붙인 세 각을 모으면 180°예요."],
    render: (b, a) => a2Chain(b, a, [
      (bx, ax) => { bx.append(a2Row(a2PolyFig([90, 35, 55], [10], ["R", "㉠", "㉡"]), a2Fig(560, 360, s => { const T = [280, 260]; [[0, 55], [55, 60], [115, 65]].forEach(([s0, aa], i) => { s.append(svgEl("path", { d: a2WedgeD(T, s0, s0 + aa, 150), fill: A2_FILL[i], stroke: A2_COL[i], "stroke-width": 3 })); const q = a2Pt(T, s0 + aa / 2, 105); s.append(txt(q[0], q[1], i < 2 ? `${aa}°` : "□", 24)); }); s.append(a2Line([40, 260], [520, 260], { stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "10 6" })); }, "24em")));
        numbers(bx, ax, [{ q: "직각삼각형에서 ㉠ + ㉡ =", a: 90, unit: "°", why: { "180": "직각 90°도 세 각 중 하나예요. 180°에서 90°를 빼요." } }, { q: "잘라 붙인 세 각에서 □ =", a: 65, unit: "°" }], { ok: "㉠+㉡=180°−90°=90°, □=180°−55°−60°=65°예요." }); },
      (bx, ax) => quiz(bx, ax, [{ q: "“삼각형의 크기가 다르면 삼각형의 세 각의 크기의 합도 달라요.” 이 말을 바르게 고친 것은?", o: ["삼각형의 크기가 달라도 세 각의 크기의 합은 180°로 같아요", "큰 삼각형일수록 세 각의 크기의 합이 커요", "작은 삼각형은 세 각의 크기의 합이 90°예요"], a: 0 }], { ok: "삼각형의 크기와 모양이 달라도 세 각의 크기의 합은 언제나 180°예요." })]) }
},
{
  id: "a8", no: 8, title: "사각형의 네 각의 크기의 합을 알아볼까요", soop: "개념 구축하기(O)",
  question: "사각형의 네 각의 크기의 합은 얼마일까요?",
  summary: "사각형의 네 각의 크기의 합은 360°예요. 네 각을 잘라 한 점에 모으면 빈틈없이 한 바퀴가 되고, 사각형은 삼각형 2개로 나눌 수 있어서 180°+180°=360°예요. 세 각의 크기를 알면 360°에서 세 각을 빼서 나머지 한 각을 구해요.",
  steps: [
    { inst: "숲 놀이터를 나가는 길바닥에 그려진 사각형이에요. 네 각의 크기를 각각 재고 더해 보세요.", hints: ["변이 짧으면 회색 점선(늘인 변)에 대고 읽어요.", "각이 직각보다 큰지 작은지 먼저 생각해요."],
      render: (b, a) => a2Chain(b, a, [
        (bx, ax) => a2Measure(bx, ax, { W: 900, H: 600, items: a2PolyItems(A2_TRAP8, [75, 80, 100, 105]).map((it, i) => Object.assign(it, { placed: i >= 2, ask: ["왼쪽 아래 각을 재어 보세요.", "오른쪽 아래 각을 재어 보세요.", "오른쪽 위 각을 읽어 보세요(각도기가 놓여 있어요).", "왼쪽 위 각을 읽어 보세요(각도기가 놓여 있어요)."][i], deco: g => g.append(svgEl("polygon", { points: A2_TRAP8.map(p => p.map(a2F).join(",")).join(" "), fill: "#EAF4E4", stroke: "#2F2F2F", "stroke-width": 4 })) })), ok: "네 각은 75°, 80°, 100°, 105°예요." }),
        (bx, ax) => numbers(bx, ax, [{ q: "75° + 80° + 100° + 105° =", a: 360, unit: "°" }], { ok: "네 각의 크기의 합은 360°예요." })]) },
    { name: "잘라 붙이기", inst: "그린 사각형의 네 각을 잘라 네 꼭짓점이 한 점에 모이도록 이어 붙여 보세요. 모서리를 하나씩 눌러요.", hints: ["빈틈이나 겹치는 곳이 없게 이어 붙여요.", "네 각이 모여 한 바퀴가 돼요."],
      render: (b, a) => a2Sum(b, a, { mode: "tear", angles: [55, 130, 65, 110], lens: [10, 9.5], W: 880, H: 470, ok: "네 각을 모으면 빈틈없이 한 바퀴가 되어 360°예요." }) },
    { name: "나누어 보기", inst: "삼각형의 세 각의 크기의 합을 이용해 사각형의 네 각의 크기의 합을 구해 보세요. 꼭짓점을 눌러 사각형을 삼각형 2개로 나누어요.", hints: ["삼각형 하나의 세 각의 크기의 합은 180°예요.", "삼각형이 2개이니 180°를 두 번 더해요."],
      render: (b, a) => a2Sum(b, a, { mode: "split", angles: [85, 95, 70, 110], lens: [5.5, 7], W: 860, H: 450, answerText: "180° + 180° = 360°", ok: "사각형은 삼각형 2개로 나뉘어서 180°+180°=360°예요." }) },
    { inst: "약속: 사각형의 네 각의 크기의 합을 정리해요. 알맞은 말을 골라 보세요.", hints: ["한 바퀴는 360°예요."],
      render: (b, a) => blanks(b, a, ["사각형의 네 각의 크기의 합은 ", { o: ["360°", "180°", "270°"], a: 0 }, "예요. 사각형은 삼각형 ", { o: ["2개", "3개", "4개"], a: 0 }, "로 나눌 수 있어서 180°+180°로 구할 수 있어요. 사각형의 크기와 모양이 달라도 네 각의 크기의 합은 ", { o: ["같아요", "달라요"], a: 0 }, "."]) },
    { inst: "□ 안에 알맞은 수를 써넣으세요.", hints: ["360°에서 주어진 세 각을 빼요."],
      render: (b, a) => { b.append(a2Row(a2PolyFig([70, 110, 50, 130], [4.5, 6.5], ["70°", "110°", "50°", "㉠"]), a2PolyFig([75, 90, 115, 80], [4.5, 3.5], ["75°", "㉡", "115°", "80°"])));
        numbers(b, a, [{ q: "㉠ =", a: 130, unit: "°", why: { "-50": "360°에서 세 각을 빼요.", "50": "180°가 아니라 360°에서 빼요." } }, { q: "㉡ =", a: 90, unit: "°" }], { ok: "㉠ 360°−70°−110°−50°=130°, ㉡ 360°−75°−115°−80°=90°예요." }); } }
  ],
  challenge: { inst: "사각형의 네 각의 크기의 합을 이용해 문제를 해결해 보세요.", hints: ["모르는 두 각의 합은 360°에서 아는 두 각을 빼요.", "잘라 붙인 네 각은 한 바퀴(360°)가 돼요."],
    render: (b, a) => { b.append(a2Row(a2PolyFig([70, 95, 50, 145], [6.5, 9.5], ["㉠", "㉡", "50°", "145°"]), a2Fig(560, 360, s => { const T = [280, 180]; [[0, 80], [80, 125], [205, 70], [275, 85]].forEach(([s0, aa], i) => { s.append(svgEl("path", { d: a2WedgeD(T, s0, s0 + aa, 150), fill: A2_FILL[i], stroke: A2_COL[i], "stroke-width": 3 })); const q = a2Pt(T, s0 + aa / 2, 100); s.append(txt(q[0], q[1], i < 3 ? `${aa}°` : "□", 24)); }); }, "24em")));
      numbers(b, a, [{ q: "㉠ + ㉡ =", a: 165, unit: "°", why: { "-15": "180°가 아니라 360°에서 빼요." } }, { q: "잘라 붙인 네 각에서 □ =", a: 85, unit: "°" }], { ok: "㉠+㉡=360°−50°−145°=165°, □=360°−80°−125°−70°=85°예요." }); } }
},
{
  id: "a9", no: 9, title: "생각을 더하다 ― 학교 안의 보물을 찾아라!", soop: "탐구 정리하기(O)",
  question: "거북이 명령어대로 움직이면 보물은 어디에 있을까요?",
  summary: "회전하는 각도는 거북이 가던 방향을 곧게 늘인 선(보조선)과 새로 가는 선 사이의 각이에요. 왼쪽·오른쪽은 거북이 가던 방향을 기준으로 정해요. 지도에서 각도기로 각을 재면 명령어를 완성할 수 있어요.",
  steps: [
    { inst: "준하가 만든 보물찾기 명령어예요. ① 화살표 방향으로 4 cm 이동 ② 왼쪽으로 60°만큼 회전하여 3 cm 이동 ③ 오른쪽으로 30°만큼 회전하여 2 cm 이동. 명령어대로 정하고 거북을 움직여 보물이 있는 곳을 찾아보세요.", hints: ["왼쪽·오른쪽은 거북이 바라보는 방향을 기준으로 정해요.", "회색 점선은 거북이 가던 방향을 늘인 선이에요."],
      render: (b, a) => a2Turtle(b, a, { title: "준하의 명령어를 넣어요", map: a2MapJ(), cmds: [{ dist: 4 }, { turn: "왼쪽", deg: 60, dist: 3, edit: "both" }, { turn: "오른쪽", deg: 30, dist: 2, edit: "both" }], goals: [{ after: 2, place: "도서관" }], ok: "보물은 도서관에 있어요!" }) },
    { name: "재어 보기", inst: "거북이 회전한 각을 확대한 그림이에요. 회색 점선(가던 방향을 늘인 선)과 새 길 사이의 각을 각도기로 재어 보세요.", hints: ["각도기의 밑금을 회색 점선이나 빨간 새 길에 맞춰요.", "직각보다 작은 각이에요."],
      render: (b, a) => a2Measure(b, a, { items: [
        { d1: 0, a: 60, dash1: true, color: "#C8472E", ask: "②번에서 회전한 각도는?", deco: g => { const V = [400, 324]; g.append(a2Line(a2Pt(V, 180, 300), V, { stroke: "#C8472E", "stroke-width": 5 }), txt(...a2Pt(V, 180, 250).map((v, i) => v + (i ? -22 : 0)), "①에서 온 길", 18, { fill: "#C8472E" })); } },
        { d1: 30, a: 30, dash2: true, color: "#C8472E", ask: "③번에서 회전한 각도는?", deco: g => { const V = [400, 324]; g.append(a2Line(a2Pt(V, 240, 300), V, { stroke: "#C8472E", "stroke-width": 5 }), txt(...a2Pt(V, 240, 200).map((v, i) => v + (i ? 0 : -70)), "②에서 온 길", 18, { fill: "#C8472E" })); } }], ok: "②는 60°, ③은 30°만큼 회전했어요." }) },
    { name: "명령어 바꾸기", inst: "준하의 명령어 중 ②와 ③을 바꾸어 거북을 움직였더니 급식실에 도착했어요. ②와 ③의 회전 방향과 각도를 정해 보세요.", hints: ["급식실은 처음 길보다 아래쪽에 있어요. 거북이 오른쪽으로 돌아야 해요.", "갈림길에서 아래로 내려가는 길은 가던 방향에서 30°만큼 꺾여 있어요."],
      render: (b, a) => a2Turtle(b, a, { title: "②와 ③을 바꾸어 보세요", map: a2MapJ(), cmds: [{ dist: 4 }, { turn: "오른쪽", deg: 30, dist: 3, edit: "both" }, { turn: "오른쪽", deg: 30, dist: 2, edit: "both" }], goals: [{ after: 2, place: "급식실" }], ok: "② 오른쪽으로 30°, ③ 오른쪽으로 30°만큼 회전하면 급식실에 도착해요." }) },
    { name: "약속하기", inst: "거북의 회전 각도를 재는 방법을 정리해요. 알맞은 말을 골라 보세요.", hints: ["거북이 가던 방향을 곧게 늘인 선이 보조선이에요."],
      render: (b, a) => blanks(b, a, ["거북이 회전한 각도는 거북이 가던 방향을 곧게 늘인 ", { o: ["보조선", "출발선"], a: 0 }, "과 새로 가는 선 사이의 각이에요. 왼쪽과 오른쪽은 ", { o: ["거북이 가던 방향", "지도의 위쪽"], a: 0 }, "을 기준으로 정해요."]) },
    { inst: "예빈이네 학교 안내 지도예요. 교문에 있는 거북이 급식실과 강당에 있는 두 가지 보물을 모두 찾도록 ③, ④, ⑤의 빈칸을 채워 보세요.", hints: ["거북이 아래쪽을 보고 출발해요. 거북이 바라보는 쪽에서 왼쪽·오른쪽을 정해요.", "③에서 왼쪽으로 90°를 돌면 아래로 내려가요. 급식실로 가는 길과 가던 방향(아래쪽)의 각을 생각해요."],
      render: (b, a) => a2Turtle(b, a, { title: "예빈이의 명령어", map: a2MapY(), cmds: [{ dist: 2 }, { turn: "오른쪽", deg: 90, dist: 9, fix: true }, { turn: "왼쪽", deg: 90, dist: 5, edit: "both" }, { turn: "왼쪽", deg: 60, dist: 3, edit: "both" }, { turn: "왼쪽", deg: 30, dist: 4, edit: "both" }], goals: [{ after: 3, place: "급식실" }, { after: 4, place: "강당" }], ok: "③ 왼쪽 90°, ④ 왼쪽 60°, ⑤ 왼쪽 30°! 급식실과 강당의 보물을 모두 찾았어요." }) }
  ],
  challenge: { inst: "준하의 지도에서 수돗가에 보물이 있어요. 교문에 있는 거북이 수돗가에 가도록 ②와 ③의 명령어를 만들어 보세요.", hints: ["수돗가는 처음 길보다 아래쪽에 있어요.", "③에서는 처음 이동한 방향과 같은 쪽을 보게 돼요."],
    render: (b, a) => a2Turtle(b, a, { title: "수돗가로 가는 명령어", map: a2MapJ(), cmds: [{ dist: 4 }, { turn: "오른쪽", deg: 30, dist: 3, edit: "both" }, { turn: "왼쪽", deg: 30, dist: 2, edit: "both" }], goals: [{ after: 2, place: "수돗가" }], ok: "② 오른쪽 30°, ③ 왼쪽 30°만큼 회전하면 수돗가에 도착해요. 오른쪽으로 돈 만큼 왼쪽으로 돌면 처음 방향으로 돌아와요." }) }
},
{
  id: "a10", no: 10, title: "놀이를 더하다 ― 각을 그려 도착 변까지! 출발!", soop: "발표하기(P)",
  question: "주사위 눈에 맞게 예각과 둔각을 그려 도착 변에 먼저 닿으려면 어떻게 해야 할까요?",
  summary: "주사위 눈이 1, 3, 5이면 예각, 2, 4, 6이면 둔각을 그려요. 출발 변이나 앞에 그린 변을 각의 한 변으로 하고, 새 변은 3 cm와 같거나 짧게 점과 점을 이어 그려요. 앞으로 나아가려면 둔각, 방향을 크게 꺾으려면 예각을 그려요.",
  steps: [
    { name: "규칙 알기", inst: "놀이 방법을 읽고 물음에 답해 보세요. ① 가위바위보로 순서를 정해요. ② 주사위를 굴려 나온 눈의 수에 해당하는 각을 놀이판에 한 개 그려요(1·3·5 → 예각, 2·4·6 → 둔각). ③ 출발 변 또는 이전에 그린 변을 각의 한 변으로 하고, 새 변은 3 cm와 같거나 짧게 두 점을 이어 그려요. ④ 그린 변이 도착 변에 먼저 닿는 사람이 이겨요.", hints: ["홀수 눈은 예각, 짝수 눈은 둔각이에요.", "직각은 예각도 둔각도 아니에요."],
      render: (b, a) => quiz(b, a, [
        { q: "주사위를 굴려 2가 나왔어요. 어떤 각을 그려야 하나요?", o: ["예각", "둔각"], a: 1 },
        { q: "5가 나왔어요. 어떤 각을 그려야 하나요?", o: ["예각", "둔각"], a: 0 },
        { q: "새 변은 어떻게 그려야 하나요?", o: ["3 cm와 같거나 짧게, 점과 점을 이어서", "3 cm보다 길게", "점이 없는 곳에 마음대로"], a: 0 },
        { q: "주사위가 4일 때 직각을 그려도 될까요?", o: ["안 돼요. 직각은 둔각이 아니에요", "돼요"], a: 0 }], { ok: "규칙을 잘 알았어요. 이제 연습해 봐요." }) },
    { name: "연습하기", inst: "놀이판에서 예각 → 둔각 → 예각을 차례로 그려 보세요. 주황 점이 꼭짓점이고, 파란 점선 원 안(3 cm 안)의 점을 누르면 새 변이 그어져요.", hints: ["처음에는 출발 변(빨간 선)이 각의 한 변이에요.", "앞의 변과 새 변 사이의 각을 직각과 비교해요."],
      render: (b, a) => a2Dice(b, a, { seq: ["예각", "둔각", "예각"], ok: "예각, 둔각, 예각을 알맞게 그렸어요!" }) },
    { name: "놀이하기", inst: "주사위를 굴려 나온 각을 그리며 도착 변까지 가 보세요. 짝과 함께라면 화면을 번갈아 쓰며 누가 더 적은 횟수로 도착하는지 겨루어 봐요.", hints: ["도착 변은 오른쪽 아래에 있어요. 오른쪽으로 나아가는 각을 그려요.", "앞으로 쭉 나아가려면 둔각을 크게, 방향을 바꾸려면 예각을 그려요."],
      render: (b, a) => a2Dice(b, a, { game: true }) },
    { name: "전략 말하기", inst: "놀이를 하며 알게 된 점을 이야기해 보세요.", hints: ["앞의 변이 오른쪽으로 그려졌을 때, 꼭짓점에서 앞의 변은 왼쪽을 향해요."],
      render: (b, a) => quiz(b, a, [
        { q: "앞의 변을 오른쪽(→)으로 그렸어요. 계속 오른쪽으로 나아가려면 어떤 각을 그려야 할까요?", fig: () => a2Fig(520, 240, s => { const P = [300, 160]; s.append(a2Line([100, 160], P, { stroke: BLUE }), svgEl("circle", { cx: P[0], cy: P[1], r: 8, fill: TENT }), a2Line(P, a2Pt(P, 20, 150), { stroke: "#C8472E", "stroke-dasharray": "10 6" }), txt(200, 140, "앞의 변", 20, { fill: BLUE }), txt(430, 80, "새 변?", 20, { fill: "#C8472E" })); }, "22em"), o: ["둔각", "예각"], a: 0, why: { "1": "예각을 그리면 왔던 쪽으로 되돌아가는 방향이 돼요." } },
        { q: "도착 변에 빨리 닿으려면 새 변을 어떻게 그리면 좋을까요?", o: ["도착 변 쪽으로 3 cm에 가깝게 길게", "될 수 있는 대로 짧게", "출발 변 쪽으로"], a: 0 }], { ok: "앞으로 나아갈 때는 둔각, 새 변은 길게 그리면 빨리 도착할 수 있어요." }) },
    { inst: "주사위를 굴려 3이 나왔어요. 주황 점을 꼭짓점으로 하여 그릴 수 있는 새 변을 모두 골라 보세요. (점과 점 사이는 1 cm)", hints: ["3은 홀수라서 예각을 그려야 해요.", "새 변이 3 cm보다 길면 그릴 수 없어요."],
      render: (b, a) => quiz(b, a, [{ q: "그릴 수 있는 새 변은?", fig: () => a2Fig(560, 380, s => { const U = 60, P = [5, 3.5], at = q => [q[0] * U, q[1] * U];
        for (let x = 1; x < 9; x++) for (let y = 1; y < 6; y++) s.append(svgEl("circle", { cx: x * U, cy: y * U + 15, r: 3.5, fill: "#9AA6A0" }));
        const sh = q => [q[0] * U, q[1] * U + 15], Pp = sh([5, 3]);
        s.append(a2Line(sh([2, 3]), Pp, { stroke: BLUE, "stroke-width": 5 }), txt(...sh([3, 3.45]), "앞의 변", 18, { fill: BLUE }));
        [["가", [7, 1]], ["나", [3, 2]], ["다", [5, 0.5 + .5]], ["라", [4, 5]], ["마", [2, 2]]].forEach(([n, q]) => { const Q = sh(q); s.append(a2Line(Pp, Q, { stroke: "#C8472E", "stroke-width": 3.5, "stroke-dasharray": "9 5" }), txt(Q[0] + (q[0] < 5 ? -18 : 18), Q[1] - 14, n, 22, { fill: "#C8472E" })); });
        s.append(svgEl("circle", { cx: Pp[0], cy: Pp[1], r: 8, fill: TENT })); }, "26em"),
        o: ["가", "나", "다", "라", "마"], a: [1, 3] }], { bad: "앞의 변과 새 변 사이의 각이 예각인지, 새 변이 3 cm와 같거나 짧은지 하나씩 살펴봐요. 직각은 예각이 아니에요.", ok: "나와 라예요. 가는 둔각, 다는 직각, 마는 예각이지만 3 cm보다 길어요." }) }
  ],
  challenge: { name: "또 다른 놀이", inst: "빨대 튕기기 놀이를 해 봐요. 주사위 눈이 1·3·5이면 ‘예각’, 2·4·6이면 ‘둔각’을 외치고 빨대를 튕겨요. 파란 선과 빨대가 이루는 각이 외친 각이면 1점이에요. 5판 동안 맞게 판단해 보세요.", hints: ["빨대와 파란 선이 이루는 주황색 각을 직각과 비교해요."],
    render: (b, a) => a2Flick(b, a, { rounds: 5 }) }
},
{
  id: "a11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "각도에 대해 배운 것을 이용해 문제를 해결할 수 있나요?",
  summary: "각의 크기는 두 변이 벌어진 정도이고, 각도기로 재어 ‘○°’로 나타내요. 예각은 0°보다 크고 직각보다 작은 각, 둔각은 직각보다 크고 180°보다 작은 각이에요. 각도의 합과 차는 수의 덧셈·뺄셈처럼 계산하고, 삼각형의 세 각의 크기의 합은 180°, 사각형의 네 각의 크기의 합은 360°예요.",
  steps: [
    { name: "각도 재기", inst: "각의 크기를 비교하고, 각도기로 각도를 재어 보세요.", hints: ["변의 길이가 아니라 두 변이 벌어진 정도를 봐요.", "각이 직각보다 작은지 큰지 먼저 생각하고 눈금을 읽어요."],
      render: (b, a) => a2Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "1. 각의 크기가 더 큰 각은?", fig: () => a2Cards([{ d1: 15, a: 80, L2r: 1.1 }, { d1: 30, a: 125, L2r: .5, maxL: 110 }], { maxW: "22em" }), o: ["가", "나"], a: 1, why: { "0": "가의 변이 더 길지만, 두 변이 더 많이 벌어진 것은 나예요." } }], { ok: "나가 더 커요." }),
        (bx, ax) => a2Measure(bx, ax, { items: [{ d1: 20, a: 40, ask: "2. 각도를 재어 보세요." }, { d1: 160, a: 145, V: [400, 300], ask: "2. 각도를 재어 보세요." }], ok: "40°, 145°예요." })]) },
    { name: "예각과 둔각", inst: "3. 주어진 각을 예각과 둔각으로 분류해 보세요.", hints: ["삼각자의 직각을 대 보세요."],
      render: (b, a) => a2Sorter(b, a, { cats: ["예각", "둔각"], items: [{ d1: 30, a: 60, cat: 0 }, { d1: 0, a: 110, cat: 1 }, { d1: 120, a: 25, cat: 0 }, { d1: 190, a: 160, cat: 1 }], ok: "예각: 가, 다 / 둔각: 나, 라" }) },
    { name: "어림하기", inst: "4. 운동 기구에 표시된 각도를 어림해 보고, 각도기로 재어 확인해 보세요.", hints: ["삼각자의 30°, 45°와 비교해 봐요."],
      render: (b, a) => a2Measure(b, a, { items: [{ d1: 0, a: 30, V: [250, 450], est: true, L: 300, ask: "윗몸일으키기 의자와 바닥이 이루는 각도를 어림하고 재어 보세요.",
        deco: g => { const V = [250, 450], T = a2Pt(V, 30, 300); g.append(svgEl("rect", { x: 0, y: 450, width: 800, height: 150, fill: "#EDE6DA" }), a2Line(V, T, { stroke: "#6E4A2A", "stroke-width": 22 }), a2Line([T[0] - 20, T[1] + 10], [T[0] - 20, 450], { stroke: "#8795A1", "stroke-width": 10 }), a2Line([T[0] - 80, T[1] + 38], [T[0] - 80, 450], { stroke: "#8795A1", "stroke-width": 8 })); } }], ok: "잰 각도는 30°예요. 0°보다 크고 45°보다 작아 약 30°로 어림할 수 있어요." }) },
    { name: "□ 구하기", inst: "5. □ 안에 알맞은 수를 써넣으세요.", hints: ["삼각형은 180°, 사각형은 360°에서 아는 각을 빼요.", "⌞ 표시는 직각(90°)이에요."],
      render: (b, a) => { b.append(a2Row(a2PolyFig([95, 45, 40], [10], ["95°", "45°", "㉠"]), a2PolyFig([85, 115, 70, 90], [4.5, 4.5], ["85°", "㉡", "70°", "R"])));
        numbers(b, a, [{ q: "㉠ =", a: 40, unit: "°" }, { q: "㉡ =", a: 115, unit: "°", why: { "205": "⌞ 표시는 직각 90°예요. 90°도 빼야 해요." } }], { ok: "㉠ 180°−95°−45°=40°, ㉡ 360°−85°−70°−90°=115°예요." }); } },
    { name: "미로 탈출", inst: "문제를 풀어 다람쥐가 도토리까지 가도록 미로를 탈출해 보세요. 갈림길마다 맞는 답을 골라요.", hints: ["각도기는 0에서 시작하는 쪽 눈금을 읽어요.", "삼각형은 180°, 사각형은 360°예요."],
      render: (b, a) => a2Maze(b, a, { gates: [
        { q: "각의 크기는?", fig: () => a2ProtFig({ d1: 0, a: 140 }, { V: [280, 280], maxW: "20em" }), o: ["140°", "40°"], a: 0, why: "한 변이 안쪽 눈금 0에 맞춰져 있어요. 이 각은 직각보다 커요." },
        { q: "이 각은 무엇일까요?", fig: () => a2Cards([{ d1: 110, a: 50, label: false }], { maxW: "12em" }), o: ["예각", "둔각"], a: 0 },
        { q: "삼각형에서 ? 안에 알맞은 각도는?", fig: () => a2PolyFig([105, 25, 50], [10], ["105°", "25°", "?"], { maxW: "18em" }), o: ["50°", "30°"], a: 0, why: "180°−105°−25°를 계산해요." },
        { q: "175° − 85° = ?", o: ["90°", "260°"], a: 0, why: "차를 구할 때는 빼요." },
        { q: "사각형에서 ? 안에 알맞은 각도는?", fig: () => a2PolyFig([110, 70, 90, 90], [5.5, 7], ["?", "70°", "R", "R"], { maxW: "18em" }), o: ["110°", "100°"], a: 0, why: "360°−70°−90°−90°를 계산해요." }], ok: "140° → 예각 → 50° → 90° → 110°. 미로를 탈출했어요!" }) }
  ],
  challenge: { inst: "6. 가장 큰 각과 가장 작은 각을 찾아 각의 크기를 재고, 두 각도의 합과 차를 구해 보세요. 7. 각도기를 쓰지 않고 ㉠과 ㉡의 각도의 합도 구해 보세요.", hints: ["세 각을 모두 잰 다음 크기를 비교해요.", "삼각형의 세 각의 크기의 합 180°에서 60°를 빼요."],
    render: (b, a) => a2Chain(b, a, [
      (bx, ax) => a2Measure(bx, ax, { items: [{ d1: 10, a: 70, ask: "가의 각도를 재어 보세요." }, { d1: 100, a: 35, ask: "나의 각도를 재어 보세요." }, { d1: 200, a: 120, V: [400, 280], ask: "다의 각도를 재어 보세요." }], ok: "가 70°, 나 35°, 다 120°예요." }),
      (bx, ax) => numbers(bx, ax, [{ q: "가장 큰 각과 가장 작은 각의 합:", a: 155, unit: "°", why: { "190": "가장 큰 각(120°)과 가장 작은 각(35°)을 더해요." } }, { q: "가장 큰 각과 가장 작은 각의 차:", a: 85, unit: "°", why: { "50": "가장 큰 각(120°)에서 가장 작은 각(35°)을 빼요." } }], { ok: "120°+35°=155°, 120°−35°=85°예요." }),
      (bx, ax) => { bx.append(a2PolyFig([50, 70, 60], [10], ["㉠", "㉡", "60°"], { maxW: "20em" }));
        numbers(bx, ax, [{ q: "㉠ + ㉡ =", a: 120, unit: "°", why: { "300": "삼각형의 세 각의 크기의 합 180°에서 60°를 빼요." } }], { ok: "180°−60°=120°예요. 삼각형의 세 각의 크기의 합을 이용했어요." }); }]) }
}
];
