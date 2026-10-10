//@@APP
const APP={title:"우리 반 교실 꾸미기 디자인단", unit:"4-2 수학 6. 다각형", key:"s42-polygon-v1", welcome:"우리 반 교실 꾸미기 디자인단에 온 것을 환영해요", intro:"4학년 2반이 교실 꾸미기 디자인단을 만들었어요. 창문 스티커, 바닥 타일, 게시판 작품, 우리 반 현수막을 꾸미며 다각형과 정다각형을 알고, 대각선을 긋고, 모양 조각으로 모양을 만들고 채워 봐요."};
//@@UNIT
/* =========================================================
   4-2 수학 6. 다각형 — 단원 조작 부품 (앞글자 p6) · 이야기 버전
   교과서 버전의 부품을 가져와 '확인하기' 단추 없이 autoRun으로 저절로 확인하게 고쳤어요.
   그림은 모두 좌표로 계산해서 그려요. 변의 수·정다각형·대각선의 수·채우기(빈틈·겹침)는 코드로 따져 채점해요.
   (한 계단에 활동이 둘 이상이면 엔진이 'done('이 들어 있는 부품만 세므로, 부품마다 api.done( 경로를 적어 둠)
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.p6fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px}
.p6grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(9.2em,1fr));gap:.5em}
.p6card{padding:.3em;text-align:center}
.p6card svg{width:100%;height:auto;display:block}
.p6tag{font-family:"Jua",sans-serif;min-height:1.4em;text-align:center;font-size:var(--fs-s)}
.p6pal{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.3em}
.p6pal button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.15em .1em;font-size:var(--fs-s);display:flex;flex-direction:column;align-items:center;line-height:1.2;word-break:keep-all}
.p6pal button svg{width:2.4em;height:1.9em;display:block}
.p6pal button[disabled]{opacity:.35}
.p6list{margin:.1em 0;padding-left:1.3em}
.p6list li{margin:.1em 0}
.p6small{font-size:var(--fs-s);color:var(--muted)}
.p6part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.p6tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.p6tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.p6tbl th,.p6tbl td{border:1.5px solid var(--line);padding:.25em .6em;text-align:center}
.p6tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.p6die{display:inline-flex;align-items:center;gap:.5em}
.p6die svg{width:3.2em;height:3.2em}
.p6colors{display:flex;flex-wrap:wrap;gap:.3em}
.p6colors button{width:2em;height:2em;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px var(--line)}
.p6colors button.p6-pick{box-shadow:0 0 0 3px var(--ink)}
.p6ws{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:.25em;max-width:22em}
.p6ws button{aspect-ratio:1/1;font-family:"Jua",sans-serif;font-size:var(--fs-l);border:2px solid var(--line);background:#fff;border-radius:.5em;padding:0}
.p6ws button.p6-a{background:#FFF1C7;border-color:#E8B630}
.p6ws button.p6-f{background:#DDEDE5;border-color:#2E8B57}
.p6sent{line-height:2;margin:.15em 0}
.p6sent b{display:inline-block;min-width:4.5em;border-bottom:2px solid var(--ink);text-align:center}
.p6post{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.6em .8em}
.p6ex{display:flex;flex-wrap:wrap;gap:.6em}.p6ex>div{flex:1 1 15em;min-width:0}
`;
  document.head.append(s);
})();

const P6_H = Math.sqrt(3) / 2;
const P6_KO = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "차"];
const P6_JA = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"];
const P6_OK = "#2E8B57", P6_NO = "#C8472E", P6_LINE = "#CBD8E6", P6_GRAY = "#8795A1", P6_GOLD = "#E8B630";
const P6_FILLS = ["#DCEAFB", "#FDE3D3", "#DDEDE5", "#EADFF6", "#FFF1C7", "#FBE0E6", "#E0F2F1", "#F3E6D8"];
const P6_STROKES = ["#2B7BD6", "#E47A38", "#2E8B57", "#7A5BB0", "#B08A1E", "#C2456A", "#2C8C88", "#9A6B3E"];
const P6_NAMES = { 3: "삼각형", 4: "사각형", 5: "오각형", 6: "육각형", 7: "칠각형", 8: "팔각형", 9: "구각형", 10: "십각형", 11: "십일각형", 12: "십이각형" };
const p6Name = n => P6_NAMES[n] || `${n}각형`;
function p6Jo(w, pair) {   // 받침에 따라 조사 고르기: p6Jo("오각형","을/를") → "오각형을"
  const [a, b] = pair.split("/"), s = String(w).trim(), ch = s.slice(-1), code = ch.charCodeAt(0);
  let bat = false;
  if (/[0-9]/.test(ch)) bat = "013678".includes(ch);
  else if (code >= 0xAC00 && code <= 0xD7A3) bat = (code - 0xAC00) % 28 !== 0;
  else if (code >= 0x3131 && code <= 0x314E) bat = true;   // ㄱ(기역)·ㄴ(니은)… 자음 이름은 모두 받침이 있음
  if (pair === "으로/로" && code >= 0xAC00 && code <= 0xD7A3 && (code - 0xAC00) % 28 === 8) bat = false;
  return s + (bat ? a : b);
}
const p6R = v => Math.round(v * 100) / 100;
const p6Dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const p6Cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
function p6Area(P) { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
function p6Cen(P) { return [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length]; }
/* 같은 점·일직선으로 이어지는 꼭짓점을 지워 실제 꼭짓점만 남김 */
function p6Clean(P0) {
  const Q = P0.map(p => p.slice()); let changed = true;
  while (changed && Q.length > 2) {
    changed = false;
    for (let i = 0; i < Q.length; i++) {
      const a = Q[(i - 1 + Q.length) % Q.length], b = Q[i], c = Q[(i + 1) % Q.length];
      const l1 = p6Dist(a, b), l2 = p6Dist(b, c);
      if (l1 < 1e-7) { Q.splice(i, 1); changed = true; break; }
      if (Math.abs(p6Cr(a, b, c)) <= 1e-7 * l1 * l2 && (b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1]) > 0) { Q.splice(i, 1); changed = true; break; }
    }
  }
  return Q;
}
function p6SegHit(a, b, c, d) {   // 두 선분이 닿거나 만나면 true
  const e = 1e-7 * (p6Dist(a, b) * p6Dist(c, d) + 1);
  const d1 = p6Cr(c, d, a), d2 = p6Cr(c, d, b), d3 = p6Cr(a, b, c), d4 = p6Cr(a, b, d);
  if (((d1 > e && d2 < -e) || (d1 < -e && d2 > e)) && ((d3 > e && d4 < -e) || (d3 < -e && d4 > e))) return true;
  const on = (p, q, r) => Math.min(p[0], q[0]) - 1e-7 <= r[0] && r[0] <= Math.max(p[0], q[0]) + 1e-7 && Math.min(p[1], q[1]) - 1e-7 <= r[1] && r[1] <= Math.max(p[1], q[1]) + 1e-7;
  return (Math.abs(d1) <= e && on(c, d, a)) || (Math.abs(d2) <= e && on(c, d, b)) || (Math.abs(d3) <= e && on(a, b, c)) || (Math.abs(d4) <= e && on(a, b, d));
}
/* 선분끼리 만나지 않고 닫혀 있는 도형(다각형)인지 */
function p6Simple(P) {
  const n = P.length; if (n < 3) return false;
  for (let i = 0; i < n; i++) {
    const a = P[i], b = P[(i + 1) % n], c = P[(i + 2) % n];
    if (Math.abs(p6Cr(a, b, c)) <= 1e-7 * p6Dist(a, b) * p6Dist(b, c) && (b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1]) < 0) return false;
    for (let j = i + 2; j < n; j++) { if (i === 0 && j === n - 1) continue; if (p6SegHit(a, b, P[j], P[(j + 1) % n])) return false; }
  }
  return Math.abs(p6Area(P)) > 1e-9;
}
function p6Angles(P) {
  const s = Math.sign(p6Area(P)), n = P.length;
  return P.map((b, i) => {
    const a = P[(i - 1 + n) % n], c = P[(i + 1) % n], v1 = [a[0] - b[0], a[1] - b[1]], v2 = [c[0] - b[0], c[1] - b[1]];
    const t = Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2))))) * 180 / Math.PI;
    return p6Cr(a, b, c) * s < 0 ? 360 - t : t;
  });
}
function p6Sides(P) { return P.map((p, i) => p6Dist(p, P[(i + 1) % P.length])); }
function p6Par(a, b, c, d) { const u = [b[0] - a[0], b[1] - a[1]], v = [d[0] - c[0], d[1] - c[1]]; return Math.abs(u[0] * v[1] - u[1] * v[0]) < 1e-6 * Math.hypot(...u) * Math.hypot(...v); }
/* 도형 따져 보기: 변의 수, 변의 길이, 각의 크기, 정다각형, 사각형 이름 */
function p6Info(P0) {
  const P = p6Clean(P0), n = P.length;
  if (n < 3 || !p6Simple(P)) return { ok: false, P, n };
  const L = p6Sides(P), A = p6Angles(P), mL = L.reduce((s, v) => s + v, 0) / n;
  const eqL = L.every(v => Math.abs(v - mL) < mL * .01), eqA = A.every(v => Math.abs(v - A[0]) < .6), reg = eqL && eqA;
  const is = new Set([p6Name(n)]); let best = reg ? "정" + p6Name(n) : p6Name(n);
  if (reg) is.add("정" + p6Name(n));
  if (n === 4) {
    const p1 = p6Par(P[0], P[1], P[3], P[2]), p2 = p6Par(P[1], P[2], P[0], P[3]), rect = A.every(v => Math.abs(v - 90) < .6);
    if (p1 || p2) is.add("사다리꼴"); if (p1 && p2) is.add("평행사변형"); if (eqL) is.add("마름모"); if (rect) is.add("직사각형"); if (reg) is.add("정사각형");
    best = reg ? "정사각형" : rect ? "직사각형" : eqL ? "마름모" : (p1 && p2) ? "평행사변형" : (p1 || p2) ? "사다리꼴" : "사각형";
  }
  return { ok: true, P, n, L, A, reg, eqL, eqA, is, best, name: p6Name(n) };
}
function p6In(pt, P) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[i], b = P[j];
    if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
function p6SegD(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; let t = L ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); }
function p6EdgeD(p, P) { let m = Infinity; for (let i = 0; i < P.length; i++) m = Math.min(m, p6SegD(p, P[i], P[(i + 1) % P.length])); return m; }
const p6InS = (p, P, e = .03) => p6In(p, P) && p6EdgeD(p, P) > e;      // 확실히 안쪽
const p6InN = (p, P, e = .03) => p6In(p, P) || p6EdgeD(p, P) < e;      // 안쪽이거나 변 위
/* 정다각형 꼭짓점: 한 변의 길이 side, 첫 변 방향 rot(°) */
function p6Reg(n, side, rot = 0) {
  const P = [[0, 0]]; let d = rot * Math.PI / 180;
  for (let i = 1; i < n; i++) { const q = P[i - 1]; P.push([q[0] + side * Math.cos(d), q[1] - side * Math.sin(d)]); d += 2 * Math.PI / n; }
  return P;
}
const p6Fmt = v => { const r = Math.round(v * 10) / 10; return Number.isInteger(r) ? String(r) : r.toFixed(1); };

/* ---------- 그림 그리기 ---------- */
function p6Fit(pts, W, H, pad = 22) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((W - 2 * pad) / Math.max(x1 - x0, 1e-6), (H - 2 * pad) / Math.max(y1 - y0, 1e-6));
  const ox = (W - (x1 - x0) * k) / 2 - x0 * k, oy = (H - (y1 - y0) * k) / 2 - y0 * k;
  const m = p => [p6R(ox + p[0] * k), p6R(oy + p[1] * k)]; m.k = k; return m;
}
const p6PtsAttr = (P, m) => P.map(p => (m ? m(p) : p).join(",")).join(" ");
/* 바깥쪽 수직 방향(오목한 도형도) */
function p6Out(P, i) {
  const a = P[i], b = P[(i + 1) % P.length], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = p6Dist(a, b) || 1;
  let nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L;
  if (p6In([mid[0] + nx * 1e-3 * L, mid[1] + ny * 1e-3 * L], P)) { nx = -nx; ny = -ny; }
  return [mid, [nx, ny]];
}
/* S: {pts}(다각형) | {open:pts}(열린 도형) | {curve:m=>d, bb:[[x,y],[x,y]]}(굽은 선) — W×H 안에 맞춰 그림 */
function p6ShapeG(S, W, H, o = {}) {
  const base = S.pts || S.open || [];
  const m = p6Fit(base.concat(S.bb || []), W, H, o.pad == null ? 22 : o.pad);
  const g = svgEl("g"), fill = o.fill || S.fill || "rgba(43,123,214,.13)", stroke = o.stroke || S.stroke || INK, sw = o.sw || 4;
  if (S.curve) g.append(svgEl("path", { d: S.curve(m), fill, stroke, "stroke-width": sw, "stroke-linejoin": "round" }));
  else if (S.open) g.append(svgEl("polyline", { points: p6PtsAttr(S.open, m), fill: "none", stroke, "stroke-width": sw, "stroke-linejoin": "round", "stroke-linecap": "round" }));
  else g.append(svgEl("polygon", { points: p6PtsAttr(S.pts, m), fill, stroke, "stroke-width": sw, "stroke-linejoin": "round" }));
  const P = S.pts ? S.pts.map(m) : null;
  if (P && o.nums) P.forEach((_, i) => { const [mid, nv] = p6Out(P, i); const c = [mid[0] + nv[0] * 15, mid[1] + nv[1] * 15]; g.append(svgEl("circle", { cx: p6R(c[0]), cy: p6R(c[1]), r: 11, fill: "#FFF1C7", stroke: "#B08A1E", "stroke-width": 1.5 }), txt(p6R(c[0]), p6R(c[1]) + 1, String(i + 1), 14, { fill: "#6B4E00" })); });
  if (P && o.measure) {
    const L = p6Sides(S.pts), A = p6Angles(S.pts), fs = o.fs || 14;
    P.forEach((_, i) => { const [mid, nv] = p6Out(P, i), od = (fs > 15 ? 15 : 12) + Math.abs(nv[0]) * fs * 1.5; g.append(txt(p6R(mid[0] + nv[0] * od), p6R(mid[1] + nv[1] * od), (o.unit ? p6Fmt(L[i]) + " " + o.unit : p6Fmt(L[i])), fs, { fill: "#2B5FA8" })); });
    P.forEach((b, i) => {
      const a = P[(i - 1 + P.length) % P.length], c = P[(i + 1) % P.length], u1 = [a[0] - b[0], a[1] - b[1]], u2 = [c[0] - b[0], c[1] - b[1]];
      const l1 = Math.hypot(...u1), l2 = Math.hypot(...u2); let v = [u1[0] / l1 + u2[0] / l2, u1[1] / l1 + u2[1] / l2]; let lv = Math.hypot(...v);
      if (lv < 1e-6) v = [-u1[1] / l1, u1[0] / l1], lv = 1;
      v = [v[0] / lv, v[1] / lv]; if (A[i] > 180) v = [-v[0], -v[1]];
      const off = (A[i] < 70 ? 30 : 22) * (fs > 15 ? 1.3 : 1);
      g.append(txt(p6R(b[0] + v[0] * off), p6R(b[1] + v[1] * off), Math.round(A[i]) + "°", fs - 1, { fill: "#B4610F" }));
    });
  }
  if (P && o.dots) P.forEach(p => g.append(svgEl("circle", { cx: p[0], cy: p[1], r: 4.5, fill: INK })));
  return g;
}
/* 도형 카드 여러 장(기호 가, 나, …) */
function p6Cards(items, opt = {}) {
  const CW = opt.cw || 220, CH = opt.ch || 170, per = opt.per || items.length, rows = Math.ceil(items.length / per);
  const s = makeSvg(per * (CW + 12) + 12, rows * (CH + 12) + 12);
  items.forEach((it, i) => {
    const g = svgEl("g", { transform: `translate(${12 + (i % per) * (CW + 12)},${12 + Math.floor(i / per) * (CH + 12)})` });
    g.append(svgEl("rect", { x: 0, y: 0, width: CW, height: CH, rx: 12, fill: "#fff", stroke: P6_LINE, "stroke-width": 2 }));
    if (it.draw) it.draw(g, CW, CH);
    else { const sg = p6ShapeG(it, CW, CH - 10, Object.assign({ pad: 30 }, opt.shape || {}, it.o || {})); sg.setAttribute("transform", "translate(0,10)"); g.append(sg); }
    if (it.label !== false) g.append(txt(20, 20, it.label || P6_KO[i], 22));
    s.append(g);
  });
  s.style.maxWidth = opt.maxW || `${Math.min(46, per * 11)}em`; s.style.width = "100%"; s.style.display = "block"; s.style.margin = ".3em 0";
  return s;
}
function p6Fig(W, H, draw, maxW) {
  const s = makeSvg(W, H); draw(s); s.setAttribute("class", "p6fig"); s.style.maxWidth = maxW || "30em"; return s;
}
function p6Side(...kids) { return h("div", { class: "side" }, ...kids.filter(Boolean)); }
function p6Tools(...kids) { return h("div", { class: "tools" }, ...kids.filter(Boolean)); }
function p6Tbl(head, rows) {
  return h("div", { class: "p6tbl" }, h("table", {}, h("tr", {}, ...head.map(t => h("th", {}, t))), ...rows.map(r => h("tr", {}, ...r.map(t => h("td", {}, String(t)))))));
}


/* ---------- 이야기 버전: 끝맺기·이어 하기 ---------- */
/* 조작을 마친 뒤: then(이어서 할 활동)이 있으면 열고, 없으면 api.done( */
function p6Finish(body, api, opt, ans, msg, data) {
  const go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "p6part" }); body.append(box); opt.then(box, api, data); go(box); return; }
  api.done(ans, opt.ok || msg);
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열림 (마지막 활동이 끝나야 api.done( ) */
function p6Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "p6part" : "" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      k++; run(); setTimeout(() => { try { body.lastChild.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}

/* =========================================================
   1. 분류하기 — 카드를 골라 칸 단추로 넣기 (모두 넣으면 저절로 확인 → api.done( )
   opt: {cats, items:[{S, cat, why, label}], nums, measure, unit:"cm", ok, tip, then}
   ========================================================= */
function p6Sort(body, api, opt) {
  const cats = opt.cats, items = opt.items, where = items.map(() => -1), CW = opt.measure ? 340 : 260, CH = opt.measure ? 300 : 210;
  let sel = null, tnum = false, tmea = false, over = false;
  const grid = h("div", { class: "p6grid", style: opt.measure ? "grid-template-columns:repeat(auto-fill,minmax(12.5em,1fr))" : null });
  const cards = items.map((it, i) => {
    const s = makeSvg(CW, CH), holder = svgEl("g"); s.append(holder);
    const tag = h("div", { class: "p6tag" }, "-");
    const btn = h("button", { class: "opt p6card", onclick: () => { if (over) return; sel = sel === i ? null : i; paint(); } }, h("div", { class: "jua" }, it.label || P6_KO[i]), s, tag);
    grid.append(btn); return { btn, tag, holder };
  });
  const drawCards = () => cards.forEach((c, i) => { c.holder.innerHTML = ""; c.holder.append(p6ShapeG(items[i].S, CW, CH, { pad: tmea ? 58 : (tnum ? 32 : 24), nums: tnum, measure: tmea, fs: 20, unit: opt.unit, dots: !!items[i].S.pts })); });
  const paint = () => cards.forEach((c, i) => { c.btn.classList.toggle("on", sel === i); c.tag.textContent = where[i] < 0 ? "-" : cats[where[i]]; c.btn.classList.remove("good", "bad"); });
  const lab = i => items[i].label || P6_KO[i];
  const toolBtns = [];
  if (opt.nums) toolBtns.push(h("button", { onclick: e => { tnum = !tnum; e.currentTarget.classList.toggle("on", tnum); drawCards(); } }, "변에 번호 붙이기"));
  if (opt.measure) toolBtns.push(h("button", { onclick: e => { tmea = !tmea; e.currentTarget.classList.toggle("on", tmea); drawCards(); } }, "자와 각도기로 재기"));
  const judge = () => {
    api.tryOnce(); const ans = cats.map((c, j) => `${c}: ${items.map((it, i) => where[i] === j ? lab(i) : null).filter(Boolean).join(",") || "-"}`).join(" / ");
    const bad = items.map((it, i) => where[i] !== it.cat ? i : -1).filter(i => i >= 0);
    cards.forEach((c, i) => c.btn.classList.add(bad.includes(i) ? "bad" : "good"));
    if (!bad.length) { over = true; p6Finish(body, api, opt, ans, opt.ok || "알맞게 나누었어요!"); return true; }
    api.fail(items[bad[0]].why || `${p6Jo(lab(bad[0]), "을/를")} 다시 살펴봐요.`, ans); return false;
  };
  const auto = autoRun(() => where.every(w => w >= 0), () => where.join(","), judge, 1200);
  const tools = h("div", { class: "tools" }, h("span", {}, "고른 카드를 →"), cats.map((c, j) => h("button", { onclick: () => { if (over) return; if (sel == null) return api.hint("먼저 도형 카드를 하나 눌러 골라요."); where[sel] = j; sel = null; paint(); auto(); } }, c)));
  api.provide({ words: cats, answers: [cats.map((c, j) => `${c}: ${items.map((it, i) => it.cat === j ? lab(i) : null).filter(Boolean).join(", ") || "없음"}`).join(" / ")] });
  body.append(...[grid, h("p", { class: "inst" }, (opt.tip ? opt.tip + " " : "") + "카드를 모두 나누면 저절로 확인해요."), toolBtns.length ? p6Tools(...toolBtns) : null, tools].filter(Boolean));
  drawCards(); paint();
}
/* =========================================================
   2. 점 종이·도형판 — 점을 차례로 눌러 다각형 그리기 (처음 점을 다시 누르면 닫힘)
   opt: {grid:{type:"sq"|"tri"|"circ", cols, rows, gap, n, r},
         tasks:[{n, reg, any, diff, given:[[c,r]…], label}] | free:{min}, clearEach, ask|then, ok, tip}
   ========================================================= */
function p6Dots(body, api, opt) {
  /* 끝나면 p6Finish → api.done( */
  const G = opt.grid, M = 34; let pts = [], W, H, gap = G.gap || 50;
  if (G.type === "sq") { W = (G.cols - 1) * gap + 2 * M; H = (G.rows - 1) * gap + 2 * M; for (let r = 0; r < G.rows; r++) for (let c = 0; c < G.cols; c++) pts.push([M + c * gap, M + r * gap]); }
  else if (G.type === "tri") { const dy = gap * P6_H; W = (G.cols - 1) * gap + gap / 2 + 2 * M; H = (G.rows - 1) * dy + 2 * M; for (let r = 0; r < G.rows; r++) for (let c = 0; c < G.cols; c++) pts.push([p6R(M + c * gap + (r % 2) * gap / 2), p6R(M + r * dy)]); }
  else { const R = G.r || 170; W = H = 2 * R + 2 * M + 10; gap = 2 * R * Math.sin(Math.PI / G.n); for (let i = 0; i < G.n; i++) { const t = -Math.PI / 2 + i * 2 * Math.PI / G.n; pts.push([p6R(W / 2 + R * Math.cos(t)), p6R(H / 2 + R * Math.sin(t))]); } }
  const at = cr => G.type === "circ" ? cr : cr[1] * G.cols + cr[0];
  const svg = makeSvg(W, H);
  if (G.type === "circ") svg.append(svgEl("circle", { cx: W / 2, cy: H / 2, r: G.r || 170, fill: "#F7F4EC", stroke: "#E2D8C3", "stroke-width": 3 }));
  const doneG = svgEl("g"), curG = svgEl("g"), dotG = svgEl("g"); svg.append(doneG, curG, dotG);
  pts.forEach((p, i) => dotG.append(svgEl("circle", { cx: p[0], cy: p[1], r: G.type === "circ" ? 8 : 6, fill: G.type === "circ" ? "#9A6B3E" : "#6E7C86", "data-i": i })));
  const tasks = opt.tasks || [], free = opt.free; let ti = 0, made = [], cur = [], lock = 0, over = false;
  const startTask = () => { const t = tasks[ti]; cur = t && t.given ? t.given.map(at) : []; lock = cur.length; if (opt.clearEach && ti > 0) drawDone(); draw(); };
  const list = h("ol", { class: "p6list" }), read = h("div", { class: "readout", style: "font-size:var(--fs)" }, "점을 눌러 시작해요."), res = h("div", { class: "p6small" });
  const showList = () => { list.innerHTML = ""; tasks.forEach((t, i) => list.append(h("li", { style: i === ti ? "font-weight:bold" : (i < ti ? "color:var(--ok)" : "color:var(--muted)") }, t.label + (i < ti ? " ✓" : "")))); };
  function drawDone() {
    doneG.innerHTML = "";
    made.forEach((m, k) => {
      if (opt.clearEach && k < made.length - 0 && !free && k !== made.length - 1 && ti < tasks.length) return;
      if (opt.clearEach && !free && ti < tasks.length && k === made.length - 1 && cur.length > lock) return;
      const c = k % P6_FILLS.length, P = m.P;
      doneG.append(svgEl("polygon", { points: p6PtsAttr(P), fill: P6_FILLS[c], "fill-opacity": .85, stroke: P6_STROKES[c], "stroke-width": 5, "stroke-linejoin": "round" }));
      const ce = p6Cen(P), cx = p6In(ce, P) ? ce : P[0];
      doneG.append(txt(p6R(cx[0]), p6R(cx[1]), m.label, 17, { fill: P6_STROKES[c], stroke: "#fff", "stroke-width": 4, "paint-order": "stroke" }));
    });
  }
  function draw() {
    curG.innerHTML = "";
    if (cur.length) {
      const P = cur.map(i => pts[i]);
      if (lock > 1) curG.append(svgEl("polyline", { points: p6PtsAttr(P.slice(0, lock)), fill: "none", stroke: P6_GOLD, "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: .6 }));
      curG.append(svgEl("polyline", { points: p6PtsAttr(P), fill: "none", stroke: BLUE, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" }));
      curG.append(svgEl("circle", { cx: P[0][0], cy: P[0][1], r: 13, fill: "none", stroke: TENT, "stroke-width": 4 }));
      curG.append(svgEl("circle", { cx: P[P.length - 1][0], cy: P[P.length - 1][1], r: 9, fill: BLUE }));
    }
    read.textContent = cur.length ? `그은 선분 ${Math.max(0, cur.length - 1)}개 · 처음 점(주황 동그라미)을 누르면 닫혀요.` : "점을 눌러 시작해요.";
  }
  const keyOf = P => p6Clean(P).map(p => p.join(",")).sort().join(";");
  function close() {
    const P = cur.map(i => pts[i]), inf = p6Info(P);
    if (!inf.ok) { api.hint(inf.n < 3 ? "선분이 한 줄로만 놓여 있어서 도형이 되지 않아요. 되돌리기를 눌러 고쳐요." : "선분끼리 서로 만나거나 겹쳐요. 다각형은 선분이 서로 만나지 않게 둘러싸야 해요. 되돌리기를 눌러 고쳐요."); return; }
    const nm = inf.reg && G.type !== "sq" || (inf.reg && inf.n === 4) ? "정" + inf.name : inf.name;
    const say = `변 ${inf.n}개, 꼭짓점 ${inf.n}개인 ${nm}`;
    if (free) {
      made.push({ P: inf.P, n: inf.n, name: inf.name, label: nm, reg: inf.reg }); cur = []; lock = 0; drawDone(); draw();
      res.textContent = "만든 다각형: " + made.map(m => m.label).join(", ");
      api.hint(`${p6Jo(say, "을/를")} 만들었어요.` + (made.length < free.min ? ` 다각형을 ${free.min - made.length}개 더 만들어 작품을 꾸며요.` : " ‘작품 완성’을 누르거나 더 꾸며요."));
      doneB.disabled = made.length < free.min; return;
    }
    const t = tasks[ti]; api.tryOnce();
    let why = null;
    if (t.n && inf.n !== t.n) why = `변이 ${inf.n}개인 ${p6Jo(inf.name, "을/를")} 그렸어요. 변이 ${t.n}개가 되게 그려요.`;
    else if (t.reg && !inf.reg) why = !inf.eqL ? "변의 길이가 모두 같지는 않아요. 점과 점 사이의 간격을 살펴보며 다시 그려요." : "변의 길이는 모두 같지만 각의 크기가 모두 같지는 않아요. 다시 그려요.";
    else if (t.diff && made.some(m => keyOf(m.P) === keyOf(inf.P))) why = "앞에서 그린 다각형과 모양이 똑같아요. 다른 모양으로 그려요.";
    if (why) { api.fail(why, say); cur = cur.slice(0, lock); draw(); return; }
    made.push({ P: inf.P, n: inf.n, name: inf.name, label: nm, reg: inf.reg });
    ti++; showList(); res.textContent = made.map(m => `${m.label}(변 ${m.n}개, 꼭짓점 ${m.n}개)`).join(" · ");
    if (ti >= tasks.length) { cur = []; draw(); drawDone(); over = true; return p6Finish(body, api, opt, made.map(m => m.label).join(", "), `${p6Jo(say, "을/를")} 그렸어요.`, made); }
    api.hint(`○ ${p6Jo(say, "을/를")} 그렸어요. 다음 다각형을 그려요.`);
    drawDone(); startTask();
  }
  svg.addEventListener("click", e => {
    if (over) return;
    const p = svgPt(svg, e); let bi = -1, bd = Math.max(16, gap * .42);
    pts.forEach((q, i) => { const d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; bi = i; } });
    if (bi < 0) return;
    if (!cur.length) { cur = [bi]; draw(); return; }
    if (bi === cur[0] && cur.length >= 3) { cur.push(bi); cur.pop(); close(); return; }
    if (bi === cur[cur.length - 1]) return;
    if (cur.includes(bi)) return api.hint("이미 지나간 점이에요. 다각형의 선분은 서로 만나면 안 돼요.");
    cur.push(bi); draw();
  });
  const undo = h("button", { onclick: () => { if (over) return; if (cur.length > lock) cur.pop(); draw(); } }, "한 개 되돌리기");
  const clear = h("button", { onclick: () => { if (over) return; cur = cur.slice(0, lock); draw(); } }, "다시 그리기");
  const doneB = h("button", { class: "big", disabled: true, onclick: () => { if (made.length < (free.min || 1)) return; over = true; doneB.disabled = true; p6Finish(body, api, opt, made.map(m => m.label).join(", "), "멋진 작품을 만들었어요!", made); } }, "작품 완성");
  const delLast = h("button", { onclick: () => { if (over || !made.length) return; made.pop(); drawDone(); res.textContent = made.length ? "만든 다각형: " + made.map(m => m.label).join(", ") : ""; doneB.disabled = made.length < free.min; } }, "마지막 다각형 지우기");
  api.provide({ words: opt.words || ["변", "꼭짓점", "선분", "다각형"], answers: [] });
  const side = p6Side(h("p", {}, opt.tip || "점을 차례로 눌러 선분을 그어요. 처음 점을 다시 누르면 다각형이 닫혀요."), tasks.length ? list : null, read, res, p6Tools(undo, clear, free ? delLast : null));
  body.append(stageWrap(svg, side));
  if (free) body.append(h("div", { class: "actions" }, doneB));
  showList(); startTask();
}

/* =========================================================
   3. 대각선 긋기 — 두 꼭짓점을 차례로 눌러 선분 긋기
   opt: {shapes:[{pts, label, cm, measure}], W, H, none:true(그을 수 없어요 단추), ask|then, ok}
   ========================================================= */
function p6Diag(body, api, opt) {
  /* 끝나면 p6Finish → api.done( */
  const W = opt.W || 600, H = opt.H || 380, shapes = opt.shapes; let si = 0, drawn = [], sel = null, msr = false, over = false;
  const svg = makeSvg(W, H), polyG = svgEl("g"), lineG = svgEl("g"), mG = svgEl("g"), vG = svgEl("g"); svg.append(polyG, lineG, mG, vG);
  const results = [];
  const read = h("div", { class: "readout" }), resBox = h("div"), title = h("div", { class: "jua" });
  let m, P, n, need;
  const key = (i, j) => i < j ? i + "-" + j : j + "-" + i;
  const adj = (i, j) => Math.abs(i - j) === 1 || Math.abs(i - j) === n - 1;
  function setup() {
    const S = shapes[si]; m = p6Fit(S.pts, W, H, 50); P = S.pts.map(m); n = P.length; drawn = []; sel = null; msr = false;
    need = []; for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) need.push(key(i, j));
    title.textContent = `${si + 1}/${shapes.length} · ${S.label || p6Name(n)}`;
    mBtn.style.display = S.measure ? "" : "none"; mBtn.disabled = true; mBtn.classList.remove("on");
    draw();
  }
  function inter(a, b, c, d) { const den = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0]); const t = ((a[0] - c[0]) * (c[1] - d[1]) - (a[1] - c[1]) * (c[0] - d[0])) / den; return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]; }
  function quadM() {   // 사각형: 두 대각선의 길이, 만나는 각, 나뉜 길이 (cm 좌표로 계산)
    const Q = shapes[si].pts, d1 = p6Dist(Q[0], Q[2]), d2 = p6Dist(Q[1], Q[3]), X = inter(Q[0], Q[2], Q[1], Q[3]);
    const u = [Q[2][0] - Q[0][0], Q[2][1] - Q[0][1]], v = [Q[3][0] - Q[1][0], Q[3][1] - Q[1][1]];
    let ang = Math.acos(Math.abs(u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))) * 180 / Math.PI;
    return { d1, d2, ang, X, a1: p6Dist(Q[0], X), a2: p6Dist(X, Q[2]), b1: p6Dist(Q[1], X), b2: p6Dist(X, Q[3]) };
  }
  function draw() {
    const S = shapes[si];
    polyG.innerHTML = ""; lineG.innerHTML = ""; vG.innerHTML = ""; mG.innerHTML = "";
    polyG.append(svgEl("polygon", { points: p6PtsAttr(P), fill: S.fill || "#EEF5FD", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }));
    drawn.forEach(k => { const [i, j] = k.split("-").map(Number); lineG.append(svgEl("line", { x1: P[i][0], y1: P[i][1], x2: P[j][0], y2: P[j][1], stroke: TENT, "stroke-width": 5, "stroke-linecap": "round" })); });
    const c = p6Cen(P);
    P.forEach((p, i) => {
      const v = [p[0] - c[0], p[1] - c[1]], l = Math.hypot(...v) || 1;
      vG.append(txt(p6R(p[0] + v[0] / l * 30), p6R(p[1] + v[1] / l * 30), (S.names || P6_JA)[i], 24));
      const dot = svgEl("circle", { cx: p[0], cy: p[1], r: sel === i ? 15 : 11, fill: sel === i ? TENT : "#fff", stroke: sel === i ? TENT : BLUE, "stroke-width": 4, style: "cursor:pointer" });
      vG.append(dot);
    });
    if (msr && S.measure) {
      const q = quadM(), X = m(q.X), Q = S.pts;
      [[0, 2, q.d1], [1, 3, q.d2]].forEach(([i, j, d], k) => { const mid = [(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2], mid2 = [(mid[0] + P[i][0]) / 2, (mid[1] + P[i][1]) / 2]; mG.append(txt(p6R(mid2[0]), p6R(mid2[1] - 14), p6Fmt(d) + " cm", 17, { fill: "#2B5FA8", stroke: "#fff", "stroke-width": 4, "paint-order": "stroke" })); });
      mG.append(svgEl("circle", { cx: X[0], cy: X[1], r: 6, fill: "#7A5BB0" }), txt(p6R(X[0] + 30), p6R(X[1] + 4), Math.round(q.ang) + "°", 18, { fill: "#7A5BB0", stroke: "#fff", "stroke-width": 4, "paint-order": "stroke" }));
      if (Math.abs(q.ang - 90) < .5) { const u = [P[2][0] - P[0][0], P[2][1] - P[0][1]], lu = Math.hypot(...u), v = [P[3][0] - P[1][0], P[3][1] - P[1][1]], lv = Math.hypot(...v), s = 14; const a = [X[0] + u[0] / lu * s, X[1] + u[1] / lu * s], b = [X[0] + v[0] / lv * s, X[1] + v[1] / lv * s]; mG.append(svgEl("path", { d: `M${p6R(a[0])},${p6R(a[1])} L${p6R(a[0] + b[0] - X[0])},${p6R(a[1] + b[1] - X[1])} L${p6R(b[0])},${p6R(b[1])}`, fill: "none", stroke: "#7A5BB0", "stroke-width": 2.5 })); }
    }
    read.textContent = `그은 대각선 ${drawn.length}개`;
  }
  svg.addEventListener("click", e => {
    if (over) return;
    const p = svgPt(svg, e); let bi = -1, bd = 34;
    P.forEach((q, i) => { const d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; bi = i; } });
    if (bi < 0) return;
    const nm = (shapes[si].names || P6_JA);
    if (sel == null || sel === bi) { sel = sel === bi ? null : bi; draw(); return; }
    const i = sel, j = bi; sel = null;
    if (adj(i, j)) { draw(); return api.hint(`꼭짓점 ${nm[i]}${"과"}${""} 꼭짓점 ${nm[j]}${p6Jo(nm[j], "은/는").slice(-1)} 서로 이웃해 있어요. 두 점을 이은 선분은 변이에요.`.replace(nm[i] + "과", p6Jo(nm[i], "과/와"))); }
    if (drawn.includes(key(i, j))) { draw(); return api.hint("이미 그은 대각선이에요."); }
    drawn.push(key(i, j)); draw();
    if (drawn.length === need.length) complete();
    else api.hint(`선분 ${nm[Math.min(i, j)]}${nm[Math.max(i, j)]}${p6Jo(nm[Math.max(i, j)], "을/를").slice(-1)} 그었어요. 대각선을 빠짐없이 그어요.`);
  });
  function complete() {
    const S = shapes[si]; const r = { label: S.label || p6Name(n), n, count: need.length };
    if (S.measure) { const q = quadM(); Object.assign(r, q); mBtn.disabled = false; }
    results.push(r);
    const ms = results.some(x => x.d1);
    resBox.innerHTML = ""; resBox.append(p6Tbl(["도형", "대각선의 수"].concat(ms ? ["두 대각선의 길이", "만나는 각", "만난 점에서 나뉜 길이"] : []),
      results.map(x => [x.label, x.count + "개"].concat(ms ? [x.d1 ? `${p6Fmt(x.d1)} cm, ${p6Fmt(x.d2)} cm` : "", x.d1 ? Math.round(x.ang) + "°" : "", x.d1 ? `${p6Fmt(x.a1)}·${p6Fmt(x.a2)} cm / ${p6Fmt(x.b1)}·${p6Fmt(x.b2)} cm` : ""] : []))));
    if (S.measure) { msr = true; mBtn.classList.add("on"); draw(); }
    if (si < shapes.length - 1) { api.hint(`○ ${p6Jo(r.label, "의/의").slice(0, -1)}의 대각선은 ${r.count}개예요.${S.measure ? " 잰 길이와 각을 살펴보고" : ""} ‘다음 도형’을 눌러요.`); nextB.disabled = false; }
    else { over = true; nextB.style.display = "none"; p6Finish(body, api, opt, results.map(x => `${x.label} ${x.count}개`).join(", "), `${r.label}의 대각선은 ${r.count}개예요.`, results); }
  }
  const nextB = h("button", { disabled: true, onclick: () => { nextB.disabled = true; si++; setup(); } }, "다음 도형 ▶");
  const noneB = h("button", { onclick: () => {
    if (over) return; api.tryOnce();
    if (need.length === 0) { api.hint("○ 삼각형은 세 꼭짓점이 모두 서로 이웃해 있어서 대각선을 그을 수 없어요."); complete(); }
    else api.fail(`이 도형에는 서로 이웃하지 않는 꼭짓점이 있어요. 대각선을 그을 수 있어요.`, "그을 수 없어요");
  } }, "대각선을 그을 수 없어요");
  const undoB = h("button", { onclick: () => { if (over) return; if (drawn.length && drawn.length < need.length) { drawn.pop(); draw(); } } }, "한 개 지우기");
  const mBtn = h("button", { onclick: () => { msr = !msr; mBtn.classList.toggle("on", msr); draw(); } }, "자와 각도기로 재기");
  api.provide({ words: ["대각선", "이웃하지 않는 두 꼭짓점", "선분"], answers: [] });
  body.append(stageWrap(svg, p6Side(title, h("p", {}, opt.tip || "꼭짓점 하나를 누르고, 이웃하지 않는 다른 꼭짓점을 눌러 선분을 그어요."), read, p6Tools(undoB, opt.none ? noneB : null, mBtn, nextB))), resBox);
  setup();
}
/* =========================================================
   4. 모양 조각(패턴 블록)·칠교 조각 — 놓고, 끌고, 살짝 눌러 돌리고, 변끼리 붙이기
   opt: {set:"pb"|"tg", U, W, H(단위: 변 1), kinds, limit:{k:개수}, spawn,
         tasks:[{type:"fill"|"make"|"free", targets:[[pts]], ghost:[{k,pts}], kinds, only, need, count, min, all, n, reg, nameIt, diff, not, label, okMsg}],
         ask|then, ok, tip}
   ========================================================= */
const P6_PB = {
  tri: { name: "정삼각형", pts: [[0, 0], [1, 0], [.5, -P6_H]], fill: "#8BCF7E", stroke: "#2E7D32" },
  sq: { name: "정사각형", pts: [[0, 0], [1, 0], [1, -1], [0, -1]], fill: "#F6A65B", stroke: "#B85A1E" },
  par: { name: "평행사변형", pts: [[0, 0], [1, 0], [1.5, -P6_H], [.5, -P6_H]], fill: "#6E9BEA", stroke: "#2952A3" },
  trap: { name: "사다리꼴", pts: [[0, 0], [2, 0], [1.5, -P6_H], [.5, -P6_H]], fill: "#EC6A62", stroke: "#A8322B" },
  rh: { name: "마름모", pts: [[0, 0], [1, 0], [1 + P6_H, -.5], [P6_H, -.5]], fill: "#E8D6AE", stroke: "#9A7B3E" },
  hex: { name: "정육각형", pts: [[0, 0], [1, 0], [1.5, -P6_H], [1, -2 * P6_H], [0, -2 * P6_H], [-.5, -P6_H]], fill: "#F7D04A", stroke: "#B08A1E" }
};
const P6_PBK = ["tri", "sq", "par", "trap", "rh", "hex"];
const P6_TG = {
  big: { name: "큰 삼각형", pts: [[0, 0], [2, 0], [1, -1]], fill: "#EC6A62", stroke: "#A8322B" },
  mid: { name: "중간 삼각형", pts: [[0, 0], [1, 0], [0, -1]], fill: "#6E9BEA", stroke: "#2952A3" },
  sm: { name: "작은 삼각형", pts: [[0, 0], [1, 0], [.5, -.5]], fill: "#8BCF7E", stroke: "#2E7D32" },
  sq: { name: "정사각형", pts: [[.5, 0], [1, -.5], [.5, -1], [0, -.5]], fill: "#F7D04A", stroke: "#B08A1E" },
  par: { name: "평행사변형", pts: [[0, 0], [1, 0], [1.5, -.5], [.5, -.5]], fill: "#B58BE0", stroke: "#6A3FA0" }
};
const P6_TGK = ["big", "mid", "sm", "sq", "par"];
const P6_TGL = { big: 2, mid: 1, sm: 2, sq: 1, par: 1 };
function p6Local(set, k) {
  const K = set[k]; if (!K._c) { const c = p6Cen(K.pts); K._c = K.pts.map(p => [p[0] - c[0], p[1] - c[1]]); } return K._c;
}
function p6World(set, pc) {
  const L = p6Local(set, pc.k), r = pc.r * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  return L.map(([x, y]) => { if (pc.f) x = -x; return [pc.x + x * c - y * s, pc.y + x * s + y * c]; });
}
/* 꼭짓점 vi가 점 P에 오도록 놓기 (r: 시계 방향 각도) */
function p6At(set, k, r, P, vi = 0, f = false) { const pc = { k, r, f, x: 0, y: 0 }, Wd = p6World(set, pc); pc.x = P[0] - Wd[vi][0]; pc.y = P[1] - Wd[vi][1]; return pc; }
function p6Snaps(P, step) {
  const out = P.map(p => p.slice());
  P.forEach((a, i) => { const b = P[(i + 1) % P.length], L = p6Dist(a, b);
    if (step) { const k = Math.round(L / step); if (k >= 2 && Math.abs(L / step - k) < 1e-6) for (let t = 1; t < k; t++) out.push([a[0] + (b[0] - a[0]) * t / k, a[1] + (b[1] - a[1]) * t / k]); }
    else out.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); });
  return out;
}
/* 여러 조각의 바깥 테두리: 한 다각형이면 꼭짓점들을, 아니면 까닭을 */
function p6Outline(polys) {
  const V = [], idx = p => { for (let i = 0; i < V.length; i++) if (p6Dist(V[i], p) < 2e-3) return i; V.push(p.slice()); return V.length - 1; };
  polys.forEach(P => P.forEach(idx));
  const cnt = new Map();
  polys.forEach(P => P.forEach((a, i) => {
    const b = P[(i + 1) % P.length], L = p6Dist(a, b), on = [[0, idx(a)], [1, idx(b)]];
    V.forEach((v, k) => { const t = ((v[0] - a[0]) * (b[0] - a[0]) + (v[1] - a[1]) * (b[1] - a[1])) / (L * L); if (t > 1e-4 && t < 1 - 1e-4 && p6SegD(v, a, b) < 2e-3) on.push([t, k]); });
    on.sort((x, y) => x[0] - y[0]);
    for (let q = 0; q + 1 < on.length; q++) { const u = on[q][1], w = on[q + 1][1]; if (u === w) continue; const kk = u < w ? u + "-" + w : w + "-" + u; cnt.set(kk, (cnt.get(kk) || 0) + 1); }
  }));
  const adj = new Map();
  cnt.forEach((c, kk) => { if (c !== 1) return; const [u, w] = kk.split("-").map(Number); (adj.get(u) || adj.set(u, []).get(u)).push(w); (adj.get(w) || adj.set(w, []).get(w)).push(u); });
  if (!adj.size) return { ok: false, why: "조각이 없어요." };
  for (const [, a] of adj) if (a.length !== 2) return { ok: false, why: "조각끼리 꼭짓점 한 점에서만 닿은 곳이 있어요. 변과 변을 이어 붙여요." };
  const start = adj.keys().next().value, cyc = [start]; let prev = -1, curr = start;
  while (true) { const nx = adj.get(curr).find(x => x !== prev); prev = curr; curr = nx; if (curr === start) break; cyc.push(curr); if (cyc.length > V.length + 2) break; }
  if (cyc.length !== adj.size) return { ok: false, why: "조각들이 서로 떨어져 있거나 가운데에 빈 곳이 있어요. 모두 이어 붙여 한 도형이 되게 해요." };
  const inf = p6Info(cyc.map(i => V[i]));
  return inf.ok ? Object.assign({ ok: true }, inf) : { ok: false, why: "한 다각형이 되지 않아요." };
}
/* 겹침·빈틈·밖으로 나감을 촘촘한 점으로 따지기 */
function p6Cover(polys, targets) {
  const all = polys.concat(targets || []).flat(); if (!all.length) return { overlap: 0, gap: 0, out: 0 };
  const xs = all.map(p => p[0]), ys = all.map(p => p[1]), st = 1 / 11;
  let overlap = 0, gap = 0, out = 0;
  for (let x = Math.min(...xs) + .0371; x < Math.max(...xs); x += st) for (let y = Math.min(...ys) + .0213; y < Math.max(...ys); y += st) {
    const p = [x, y]; let sIn = 0, nIn = false;
    polys.forEach(P => { if (p6InS(p, P)) sIn++; if (!nIn && p6InN(p, P)) nIn = true; });
    if (sIn > 1) overlap++;
    if (targets) { const tS = targets.some(T => p6InS(p, T)), tN = targets.some(T => p6InN(p, T)); if (sIn && !tN) out++; if (tS && !nIn) gap++; }
  }
  return { overlap, gap, out };
}
function p6Touch(polys) {   // 모든 조각이 이어져 있는지
  const n = polys.length; if (n < 2) return true;
  const touch = (A, B) => A.some(p => p6EdgeD(p, B) < 2e-3) || B.some(p => p6EdgeD(p, A) < 2e-3);
  const seen = new Set([0]), q = [0];
  while (q.length) { const i = q.pop(); for (let j = 0; j < n; j++) if (!seen.has(j) && touch(polys[i], polys[j])) { seen.add(j); q.push(j); } }
  return seen.size === n;
}
function p6PieceIcon(set, k) {
  const s = makeSvg(60, 46), m = p6Fit(set[k].pts, 60, 46, 5);
  s.append(svgEl("polygon", { points: p6PtsAttr(set[k].pts, m), fill: set[k].fill, stroke: set[k].stroke, "stroke-width": 2 })); return s;
}
/* 조각 그림(예시 작품): items [{k, pts}] */
function p6PieceArt(set, items, opt = {}) {
  const g = svgEl("g"), U = opt.U || 50, ox = opt.ox || 0, oy = opt.oy || 0;
  items.forEach(it => { const K = set[it.k]; g.append(svgEl("polygon", { points: it.pts.map(p => `${p6R(ox + p[0] * U)},${p6R(oy + p[1] * U)}`).join(" "), fill: opt.mono || K.fill, stroke: opt.mono ? "none" : K.stroke, "stroke-width": opt.sw || 2.5, "stroke-linejoin": "round" })); });
  return g;
}
const p6Kinds = (set, pcs) => [...new Set(pcs.map(p => p.k))];
const p6KindTxt = (set, pcs) => { const c = {}; pcs.forEach(p => c[p.k] = (c[p.k] || 0) + 1); return Object.keys(set).filter(k => c[k]).map(k => `${set[k].name} ${c[k]}개`).join(", "); };
const p6MS = pcs => pcs.map(p => p.k).sort().join(",");
function p6Pieces(body, api, opt) {
  /* 끝나면 p6Finish → api.done( */
  const tg = opt.set === "tg", set = tg ? P6_TG : P6_PB, step = tg ? 45 : 30, U = opt.U || 60, W = opt.W || 10, H = opt.H || 6;
  const kinds = opt.kinds || (tg ? P6_TGK : P6_PBK), limit = opt.limit || (tg ? P6_TGL : null), snapStep = tg ? null : 1;
  const svg = makeSvg(W * U, H * U); svg.style.touchAction = "none";
  const bgG = svgEl("g"), pcG = svgEl("g"); svg.append(bgG, pcG);
  const tasks = opt.tasks; let ti = 0, pieces = [], sel = -1, results = [], over = false, naming = false, auto = null;
  const W_ = pc => p6World(set, pc);
  const list = h("ol", { class: "p6list" }), cnt = h("div", { class: "p6small" }), nameBox = h("div");
  const showList = () => { list.innerHTML = ""; tasks.forEach((t, i) => list.append(h("li", { style: i === ti ? "font-weight:bold" : (i < ti ? "color:var(--ok)" : "color:var(--muted)") }, t.label + (i < ti && results[i] && results[i].say ? ` ✓ (${results[i].say})` : (i < ti ? " ✓" : ""))))); };
  function drawBg() {
    bgG.innerHTML = ""; const t = tasks[ti]; if (!t) return;
    if (opt.deco) opt.deco(bgG, U);
    (t.ghost || []).forEach(gp => bgG.append(svgEl("polygon", { points: gp.pts.map(p => `${p[0] * U},${p[1] * U}`).join(" "), fill: "none", stroke: "#B9C6D3", "stroke-width": 2, "stroke-dasharray": "5 5" })));
    (t.targets || []).forEach(T => bgG.append(svgEl("polygon", { points: T.map(p => `${p6R(p[0] * U)},${p6R(p[1] * U)}`).join(" "), fill: "rgba(232,182,48,.13)", stroke: P6_GOLD, "stroke-width": 4, "stroke-dasharray": "10 6", "stroke-linejoin": "round" })));
  }
  function draw() {
    pcG.innerHTML = "";
    pieces.forEach((pc, i) => pcG.append(svgEl("polygon", { points: W_(pc).map(p => `${p6R(p[0] * U)},${p6R(p[1] * U)}`).join(" "), fill: set[pc.k].fill, stroke: i === sel ? INK : set[pc.k].stroke, "stroke-width": i === sel ? 4 : 2.5, "stroke-linejoin": "round", style: "cursor:grab" })));
    cnt.textContent = pieces.length ? "놓은 조각: " + p6KindTxt(set, pieces) : "아직 놓은 조각이 없어요.";
    palBtns.forEach(([k, b]) => { b.disabled = over || naming || (limit && pieces.filter(p => p.k === k).length >= (limit[k] || 0)); });
    if (typeof auto === "function") auto();
  }
  function clampIn(pc) { const P = W_(pc), xs = P.map(p => p[0]), ys = P.map(p => p[1]); let dx = 0, dy = 0; if (Math.min(...xs) < 0) dx = -Math.min(...xs); if (Math.max(...xs) > W) dx = W - Math.max(...xs); if (Math.min(...ys) < 0) dy = -Math.min(...ys); if (Math.max(...ys) > H) dy = H - Math.max(...ys); pc.x += dx; pc.y += dy; }
  function snap(pc) {
    const A = p6Snaps(W_(pc), snapStep), T = [];
    pieces.forEach(o => { if (o !== pc) T.push(...p6Snaps(W_(o), snapStep)); });
    const t = tasks[ti]; if (t) (t.targets || []).forEach(TT => T.push(...p6Snaps(TT, snapStep)));
    let best = null, bd = .42;
    A.forEach(a => T.forEach(b => { const d = p6Dist(a, b); if (d < bd) { bd = d; best = [b[0] - a[0], b[1] - a[1]]; } }));
    if (best) { pc.x += best[0]; pc.y += best[1]; }
    clampIn(pc);
  }
  function add(k) {
    if (over || naming) return;
    if (limit && pieces.filter(p => p.k === k).length >= (limit[k] || 0)) return api.hint(`${set[k].name} 조각은 ${limit[k]}개까지만 있어요.`);
    const sp = opt.spawn || [W - 1.3, 1.3]; let x = sp[0], y = sp[1];
    for (let t = 0; t < 14 && pieces.some(o => Math.hypot(o.x - x, o.y - y) < .45); t++) { y += .55; if (y > H - .8) { y = sp[1]; x -= .7; } }
    const pc = { k, x, y, r: 0, f: false }; clampIn(pc); pieces.push(pc); sel = pieces.length - 1; draw();
  }
  let drag = null;
  dragOn(svg, p => {
    if (over || naming) return false;
    const u = [p.x / U, p.y / U]; let hit = -1;
    for (let i = pieces.length - 1; i >= 0; i--) if (p6In(u, W_(pieces[i]))) { hit = i; break; }
    if (hit < 0) { sel = -1; draw(); return false; }
    const pc = pieces.splice(hit, 1)[0]; pieces.push(pc); sel = pieces.length - 1;
    drag = { pc, off: [u[0] - pc.x, u[1] - pc.y], s: u, moved: false }; draw();
  }, p => {
    if (!drag) return; const u = [p.x / U, p.y / U];
    if (Math.hypot(u[0] - drag.s[0], u[1] - drag.s[1]) > .08) drag.moved = true;
    drag.pc.x = Math.max(0, Math.min(W, u[0] - drag.off[0])); drag.pc.y = Math.max(0, Math.min(H, u[1] - drag.off[1])); draw();
  }, () => {
    if (!drag) return; const pc = drag.pc;
    if (!drag.moved) pc.r = (pc.r + step) % 360;
    snap(pc); drag = null; draw();
  });
  const rot = d => { if (sel < 0) return api.hint("먼저 조각을 눌러 골라요."); const pc = pieces[sel]; pc.r = ((pc.r + d * step) % 360 + 360) % 360; snap(pc); draw(); };
  const palBtns = kinds.map(k => [k, h("button", { onclick: () => add(k), title: set[k].name }, p6PieceIcon(set, k), set[k].name)]);
  const pal = h("div", { class: "p6pal" }, ...palBtns.map(x => x[1]));
  const ctrl = p6Tools(
    h("button", { onclick: () => rot(-1) }, `⟲ ${step}°`), h("button", { onclick: () => rot(1) }, `⟳ ${step}°`),
    tg ? h("button", { onclick: () => { if (sel < 0) return api.hint("먼저 조각을 눌러 골라요."); const pc = pieces[sel]; pc.f = !pc.f; snap(pc); draw(); } }, "뒤집기") : null,
    h("button", { onclick: () => { if (sel < 0 || over || naming) return; pieces.splice(sel, 1); sel = -1; draw(); } }, "빼기"),
    h("button", { onclick: () => { if (over || naming) return; pieces = []; sel = -1; draw(); } }, "모두 빼기"));
  function nextTask(r, msg) {
    results[ti] = r; ti++; showList();
    if (ti >= tasks.length) { over = true; draw(); doneB.disabled = true; return p6Finish(body, api, opt, results.map(x => x.say).join(" / "), msg, results); }
    api.hint("○ " + msg + " 다음 할 일을 해 봐요.");
    if (!tasks[ti].keep) pieces = []; sel = -1; drawBg(); draw();
  }
  function judge() {
    if (over || naming) return;
    const t = tasks[ti]; if (!pieces.length) return api.hint("먼저 모양 조각을 놓아요.");
    api.tryOnce();
    const polys = pieces.map(W_), ks = p6Kinds(set, pieces), say = p6KindTxt(set, pieces);
    const fail = w => api.fail(w, say);
    const cv = p6Cover(polys, t.type === "fill" ? t.targets : null);
    if (cv.overlap > 2) return fail("조각끼리 겹친 곳이 있어요. 겹치지 않게 놓아요.");
    if (t.type === "fill") { if (cv.out > 2) return fail("조각이 모양 밖으로 나간 곳이 있어요."); if (cv.gap > 2) return fail("아직 빈틈이 있어요. 빈틈없이 채워요."); }
    if (t.only && ks.some(k => !t.only.includes(k))) return fail(`${t.only.map(k => set[k].name).join(", ")} 조각만 써요.`);
    if (t.kinds && ks.length !== t.kinds) return fail(`${t.kinds}가지 모양 조각을 써야 해요. 지금은 ${ks.length}가지를 썼어요.`);
    if (t.minKinds && ks.length < t.minKinds) return fail(`모양 조각을 ${t.minKinds}가지 이상 써야 해요. 지금은 ${ks.length}가지를 썼어요.`);
    if (t.need && t.need.some(k => !ks.includes(k))) return fail(`${t.need.map(k => set[k].name).join(", ")} 조각도 써야 해요.`);
    if (t.count && pieces.length !== t.count) return fail(`조각을 ${t.count}개 써야 해요. 지금은 ${pieces.length}개예요.`);
    if (t.min && pieces.length < t.min) return fail(`조각을 ${t.min}개 이상 써서 만들어요.`);
    if (t.all && Object.keys(limit).some(k => pieces.filter(p => p.k === k).length !== limit[k])) return fail("조각 7개를 모두 써야 해요.");
    if (t.diff && results.some((r, i) => i < ti && tasks[i].group === t.group && r.ks === ks.slice().sort().join(","))) return fail("앞에서와 같은 조각으로 채웠어요. 다른 조각으로 채워 봐요.");
    if (t.not && p6MS(pieces) === t.not) return fail("주어진 그림과 같은 방법이에요. 다른 조각을 써서 채워 봐요.");
    let outl = null;
    if (t.type === "make") { outl = p6Outline(polys); if (!outl.ok) return fail(outl.why); if (t.n && outl.n !== t.n) return fail(`만든 도형은 변이 ${outl.n}개인 ${p6Jo(outl.name, "이에요/예요")}. 변이 ${t.n}개인 ${p6Jo(p6Name(t.n), "을/를")} 만들어요.`); if (t.reg && !outl.reg) return fail(`만든 도형은 ${p6Jo(outl.best, "이에요/예요")}. 변의 길이와 각의 크기가 모두 같은 정다각형이 되게 만들어요.`); if (t.isA && !outl.is.has(t.isA)) return fail(`만든 도형은 ${p6Jo(outl.best, "이에요/예요")}. ${p6Jo(t.isA, "을/를")} 만들어요.`); }
    if (t.type === "free" && !p6Touch(polys)) return fail("떨어져 있는 조각이 있어요. 조각의 변과 변을 이어 붙여요.");
    const r = { ks: ks.slice().sort().join(","), kinds: ks.map(k => set[k].name), say, count: pieces.length, outline: outl, pieces: pieces.map(p => Object.assign({}, p)) };
    if (t.nameIt && outl) { askName(r, outl); return; }
    nextTask(r, (t.okMsg ? t.okMsg + " " : "") + (outl ? `${p6Jo(outl.reg ? outl.best : outl.name, "을/를")} 만들었어요.` : (t.type === "fill" ? "빈틈없이 채웠어요." : "작품을 만들었어요.")));
  }
  function askName(r, outl) {
    naming = true; draw(); nameBox.innerHTML = "";
    const opts = [3, 4, 5, 6, 7, 8].map(p6Name);
    nameBox.append(h("p", { class: "jua" }, "만든 다각형의 변을 세어 이름을 골라요."), p6Tools(...opts.map(o => h("button", { onclick: e => {
      api.tryOnce();
      if (o !== outl.name) { e.currentTarget.classList.add("bad"); return api.fail(`변을 하나씩 세어 봐요. 변이 ${o.replace("각형", "")}개가 맞나요?`, o); }
      naming = false; nameBox.innerHTML = ""; r.say += ` → ${outl.name}`; nextTask(r, `조각 ${r.count}개로 ${p6Jo(outl.name, "을/를")} 만들었어요.`);
    } }, o))));
    api.hint("한 도형이 되었어요! 변의 수를 세어 이름을 골라요.");
  }
  /* 이야기 버전: 확인하기 단추 없이 — 채우기는 조각 넓이의 합이 모양과 같아지면, 만들기는 조각이 한 도형으로 이어지면 저절로 확인 */
  const areaOf = P => Math.abs(p6Area(P));
  const ready = () => {
    const t = tasks[ti]; if (!t || over || naming || drag || !pieces.length || t.type === "free") return false;
    const polys = pieces.map(W_);
    if (t.type === "fill" && !polys.every(P => t.targets.some(T => p6InN(p6Cen(P), T)))) return false;   // 아직 상자에 있는 조각이 있으면 기다림
    if (t.type === "fill") return Math.abs(polys.reduce((s, P) => s + areaOf(P), 0) - t.targets.reduce((s, T) => s + areaOf(T), 0)) < .05;
    if (t.count ? pieces.length !== t.count : pieces.length < (t.min || 2)) return false;
    return p6Outline(polys).ok;
  };
  auto = autoRun(ready, () => ti + "|" + pieces.map(pc => [pc.k, p6R(pc.x), p6R(pc.y), pc.r, pc.f ? 1 : 0].join(",")).join(";"), () => { judge(); }, 1200);
  const doneB = h("button", { class: "big", onclick: () => { if (tasks[ti] && tasks[ti].type === "free") judge(); } }, "다 만들었어요");
  const hasFree = tasks.some(t => t.type === "free");
  api.provide({ words: opt.words || ["빈틈없이", "겹치지 않게", "변과 변을 이어 붙이기", "돌리기"], answers: [] });
  body.append(stageWrap(svg, p6Side(h("p", { class: "p6small" }, (opt.tip || "조각 단추를 눌러 꺼내고, 끌어서 옮겨요. 살짝 누르면 돌아가요. 변끼리 가까이 놓으면 저절로 붙어요.") + (hasFree ? "" : " 다 놓으면 저절로 확인해요.")), list, pal, ctrl, cnt, nameBox)));
  if (hasFree) body.append(h("div", { class: "actions" }, doneB));
  showList(); drawBg(); draw();
}
/* =========================================================
   5. 그림에서 도형 찾기 — 눌러서 확인
   opt: {W, H, deco(svg), items:[{pts|circle:[cx,cy,r], fill, info}], ok}
   ========================================================= */
function p6Scene(body, api, opt) {
  /* 끝나면 p6Finish → api.done( */
  const svg = makeSvg(opt.W, opt.H); if (opt.deco) opt.deco(svg);
  const found = new Set(), labG = svgEl("g", { "pointer-events": "none" });
  const read = h("div", { class: "readout", style: "font-size:var(--fs)" }), lst = h("ul", { class: "p6list" });
  const els = opt.items.map((it, i) => {
    const e = it.circle ? svgEl("circle", { cx: it.circle[0], cy: it.circle[1], r: it.circle[2] }) : svgEl("polygon", { points: p6PtsAttr(it.pts) });
    e.setAttribute("fill", it.fill); e.setAttribute("stroke", it.stroke || "#5C6B73"); e.setAttribute("stroke-width", 3); e.setAttribute("stroke-linejoin", "round"); e.style.cursor = "pointer";
    e.addEventListener("click", () => {
      if (found.has(i)) return; found.add(i); e.setAttribute("stroke", TENT); e.setAttribute("stroke-width", 6);
      const c = it.circle ? [it.circle[0], it.circle[1]] : p6Cen(it.pts);
      labG.append(svgEl("circle", { cx: p6R(c[0]), cy: p6R(c[1]), r: 13, fill: P6_OK }), txt(p6R(c[0]), p6R(c[1]) + 1, "✓", 16, { fill: "#fff" }));
      lst.append(h("li", {}, `${it.n}: ${it.info}`));
      read.textContent = `찾은 도형 ${found.size}/${opt.items.length}`;
      if (found.size === opt.items.length) p6Finish(body, api, opt, opt.items.map(x => x.info).join(", "), "그림에 있는 도형을 모두 찾았어요!");
    });
    svg.append(e); return e;
  });
  svg.append(labG); read.textContent = `찾은 도형 0/${opt.items.length}`;
  api.provide({ words: ["삼각형", "사각형", "원", "변", "꼭짓점"], answers: [] });
  body.append(stageWrap(svg, p6Side(h("p", {}, opt.tip || "도형을 눌러 찾아요."), read, lst)));
}

/* =========================================================
   6. 색종이 접기 — 꼭짓점끼리 맞추어 반으로 접었다 펴기 (5차시 도입)
   ========================================================= */
function p6Fold(body, api, opt) {
  /* 끝나면 p6Finish → api.done( */
  const W = 520, H = 440, A = [[110, 70], [410, 70], [410, 370], [110, 370]], svg = makeSvg(W, H);
  const paper = svgEl("polygon", { points: p6PtsAttr(A), fill: "#F7B2C4", stroke: "#C2456A", "stroke-width": 3 }), lineG = svgEl("g"), flapG = svgEl("g"), vG = svgEl("g");
  svg.append(paper, lineG, flapG, vG); let sel = null, creases = [], busy = false, over = false;
  const read = h("div", { class: "readout", style: "font-size:var(--fs)" }, "생긴 선: 0개");
  const drawV = () => { vG.innerHTML = ""; A.forEach((p, i) => vG.append(svgEl("circle", { cx: p[0], cy: p[1], r: sel === i ? 16 : 12, fill: sel === i ? TENT : "#fff", stroke: "#C2456A", "stroke-width": 3, style: "cursor:pointer" }))); };
  const drawL = () => { lineG.innerHTML = ""; creases.forEach(([i, j]) => lineG.append(svgEl("line", { x1: A[i][0], y1: A[i][1], x2: A[j][0], y2: A[j][1], stroke: "#8E2F4E", "stroke-width": 3, "stroke-dasharray": "10 6" }))); read.textContent = `생긴 선: ${creases.length}개`; };
  function fold(i, j) {   // 꼭짓점 i를 꼭짓점 j에 맞추어 접기
    busy = true; const opp = Math.abs(i - j) === 2;
    let tri, axis;
    if (opp) { const o = [0, 1, 2, 3].filter(k => k !== i && k !== j); axis = [o[0], o[1]]; tri = [A[o[0]], A[i], A[o[1]]]; }
    else { const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; const k = [0, 1, 2, 3].find(x => x !== i && x !== j && (Math.abs(x - i) === 1 || Math.abs(x - i) === 3)); const k2 = [0, 1, 2, 3].find(x => x !== i && x !== j && x !== k); tri = [mid(A[i], A[j]), A[i], A[k], mid(A[k], A[k2])]; axis = null; }
    const a = opp ? A[axis[0]] : tri[0], b = opp ? A[axis[1]] : tri[tri.length - 1];
    const refl = p => { const dx = b[0] - a[0], dy = b[1] - a[1], t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy), f = [a[0] + t * dx, a[1] + t * dy]; return [2 * f[0] - p[0], 2 * f[1] - p[1]]; };
    let k = 0; const flap = svgEl("polygon", { fill: "#E58AA5", stroke: "#C2456A", "stroke-width": 3 }); flapG.append(flap);
    const tick = () => {
      k++; const s = k <= 20 ? k / 20 : (40 - k) / 20;
      flap.setAttribute("points", tri.map(p => { const q = refl(p); return `${p6R(p[0] + (q[0] - p[0]) * s)},${p6R(p[1] + (q[1] - p[1]) * s)}`; }).join(" "));
      if (k < 40) requestAnimationFrame(tick); else { flapG.innerHTML = ""; busy = false; after(opp, axis); }
    };
    requestAnimationFrame(tick);
  }
  function after(opp, axis) {
    if (!opp) { api.hint("이렇게 접으면 직사각형 모양이 되고, 생긴 선이 꼭짓점과 이어지지 않아요. 마주 보는 꼭짓점끼리 맞추어 삼각형 모양으로 접어 봐요."); return; }
    if (creases.some(c => c[0] === axis[0] && c[1] === axis[1])) { api.hint("이미 이렇게 접어 보았어요. 다른 꼭짓점끼리 맞추어 접어 봐요."); return; }
    creases.push(axis); drawL();
    if (creases.length === 2) { over = true; p6Finish(body, api, opt, "선 2개", "색종이를 두 번 접었다 폈어요."); }
    else api.hint("○ 삼각형 모양으로 접었다 폈더니 선이 하나 생겼어요. 이번에는 다른 두 꼭짓점을 맞추어 접어요.");
  }
  svg.addEventListener("click", e => {
    if (busy || over) return; const p = svgPt(svg, e); let bi = -1;
    A.forEach((q, i) => { if (Math.hypot(q[0] - p.x, q[1] - p.y) < 34) bi = i; });
    if (bi < 0) return;
    if (sel == null || sel === bi) { sel = sel === bi ? null : bi; drawV(); return; }
    const i = sel; sel = null; drawV(); fold(i, bi);
  });
  api.provide({ words: ["꼭짓점", "마주 보는 꼭짓점", "선"], answers: [] });
  drawV(); drawL();
  body.append(stageWrap(svg, p6Side(h("p", {}, "색종이의 꼭짓점 하나를 누르고, 맞출 꼭짓점을 눌러요. 반으로 접었다가 펴져요."), read)));
}

/* =========================================================
   7. 모양 조각 살펴보기 — 카드를 눌러 이름과 특징 보기
   ========================================================= */
function p6Explore(body, api, opt) {
  /* 끝나면 p6Finish → api.done( */
  const set = opt.set === "tg" ? P6_TG : P6_PB, ks = opt.kinds || P6_PBK, seen = new Set();
  const grid = h("div", { class: "p6grid" }), read = h("div", { class: "readout", style: "font-size:var(--fs)" });
  ks.forEach(k => {
    const K = set[k], inf = p6Info(K.pts), s = makeSvg(200, 150), m = p6Fit(K.pts, 200, 150, 24);
    s.append(svgEl("polygon", { points: p6PtsAttr(K.pts, m), fill: K.fill, stroke: K.stroke, "stroke-width": 3 }));
    const tag = h("div", { class: "p6tag" }, "눌러 보세요");
    const b = h("button", { class: "opt p6card", onclick: () => {
      tag.innerHTML = ""; const eqL = inf.eqL ? "변의 길이가 모두 같아요" : "긴 변이 하나 있어요";
      tag.append(h("b", {}, K.name), h("br"), `변 ${inf.n}개 · 꼭짓점 ${inf.n}개`, h("br"), h("span", { class: "p6small" }, eqL));
      seen.add(k); b.classList.add("good"); read.textContent = `살펴본 조각 ${seen.size}/${ks.length}`;
      if (seen.size === ks.length) p6Finish(body, api, opt, ks.map(x => set[x].name).join(", "), "모양 조각 6가지를 모두 살펴보았어요.");
    } }, s, tag);
    grid.append(b);
  });
  read.textContent = `살펴본 조각 0/${ks.length}`;
  api.provide({ words: ks.map(k => set[k].name), answers: [] });
  body.append(grid, read);
}

/* =========================================================
   8. 공학 도구 — 다각형 / 정다각형: 한 변 / 옮기기·복제
   opt: {cols, rows, gap, targets:["삼각형", …] | free:{min}, ask|then, ok}
   ========================================================= */
function p6Tool(body, api, opt) {
  /* 끝나면 p6Finish → api.done( */
  const g = opt.gap || 34, C = opt.cols || 18, R = opt.rows || 11, M = 20, W = (C - 1) * g + 2 * M, H = (R - 1) * g + 2 * M;
  const svg = makeSvg(W, H); svg.style.touchAction = "none";
  const dotG = svgEl("g"), polyG = svgEl("g"), curG = svgEl("g"); svg.append(dotG, polyG, curG);
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) dotG.append(svgEl("circle", { cx: M + c * g, cy: M + r * g, r: 2.6, fill: "#AAB6BF" }));
  let mode = "poly", cur = [], polys = [], sel = -1, over = false, regPick = [], col = 0;
  const targets = opt.targets || [], got = targets.map(() => null);
  const list = h("ol", { class: "p6list" }), read = h("div", { class: "p6small" }), regBox = h("div");
  const snapP = p => [Math.max(0, Math.min(C - 1, Math.round((p.x - M) / g))), Math.max(0, Math.min(R - 1, Math.round((p.y - M) / g)))];
  const px = q => [M + q[0] * g, M + q[1] * g];
  const showList = () => { list.innerHTML = ""; targets.forEach((t, i) => list.append(h("li", { style: got[i] != null ? "color:var(--ok)" : "" }, t + (got[i] != null ? " ✓" : "")))); };
  function draw() {
    polyG.innerHTML = ""; curG.innerHTML = "";
    polys.forEach((p, i) => {
      const P = p.pts.map(px), c = p.col % P6_FILLS.length;
      polyG.append(svgEl("polygon", { points: p6PtsAttr(P), fill: P6_FILLS[c], "fill-opacity": .9, stroke: i === sel ? INK : P6_STROKES[c], "stroke-width": i === sel ? 5 : 3.5, "stroke-linejoin": "round" }));
      const ce = p6Cen(P); polyG.append(txt(p6R(ce[0]), p6R(ce[1]), p.name, 14, { fill: P6_STROKES[c], stroke: "#fff", "stroke-width": 3.5, "paint-order": "stroke" }));
    });
    if (cur.length) { const P = cur.map(px); curG.append(svgEl("polyline", { points: p6PtsAttr(P), fill: "none", stroke: BLUE, "stroke-width": 4 })); P.forEach((p, i) => curG.append(svgEl("circle", { cx: p[0], cy: p[1], r: i ? 6 : 10, fill: i ? BLUE : "none", stroke: i ? "none" : TENT, "stroke-width": 3 }))); }
    regPick.forEach(q => { const p = px(q); curG.append(svgEl("circle", { cx: p[0], cy: p[1], r: 8, fill: TENT })); });
    if (regPick.length === 2) { const a = px(regPick[0]), b = px(regPick[1]); curG.append(svgEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: TENT, "stroke-width": 4 })); }
    read.textContent = polys.length ? "만든 도형: " + polys.map(p => p.name).join(", ") : "아직 만든 도형이 없어요.";
  }
  function addPoly(pts, how) {
    const inf = p6Info(pts.map(px)); if (!inf.ok) return api.hint("선분끼리 만나거나 한 줄로 놓였어요. 다시 그려요.");
    const name = inf.best; const p = { pts: p6Clean(pts.map(q => q.slice())), name, inf, col: col++ };
    polys.push(p); sel = polys.length - 1;
    let tick = "";
    if (targets.length) { const order = targets.map((t, i) => i).filter(i => got[i] == null && (inf.is.has(targets[i]) || (targets[i] === "삼각형" && inf.n === 3) || (targets[i] === "육각형" && inf.n === 6)));
      const pref = ["정사각형", "마름모", "평행사변형", "사다리꼴"]; order.sort((a, b) => (pref.indexOf(targets[a]) + 9) % 9 - (pref.indexOf(targets[b]) + 9) % 9);
      if (order.length) { got[order[0]] = polys.length - 1; tick = ` → ‘${targets[order[0]]}’ 완성!`; } }
    showList(); draw();
    api.hint(`${how}로 ${p6Jo(name, "을/를")} 만들었어요.${tick}`);
    if (targets.length && got.every(x => x != null)) { over = true; p6Finish(body, api, opt, targets.join(", "), "주어진 다각형을 모두 만들었어요!", polys); }
    if (opt.free && polys.length >= opt.free.min) doneB.disabled = false;
  }
  let drag = null;
  dragOn(svg, p => {
    if (over) return false;
    if (mode === "move") {
      const u = [(p.x - M) / g, (p.y - M) / g]; let hit = -1;
      for (let i = polys.length - 1; i >= 0; i--) if (p6In(u, polys[i].pts)) { hit = i; break; }
      sel = hit; draw(); if (hit < 0) return false;
      drag = { s: u, base: polys[hit].pts.map(q => q.slice()) }; return;
    }
    return false;
  }, p => {
    if (!drag) return; const u = [(p.x - M) / g, (p.y - M) / g], dx = Math.round(u[0] - drag.s[0]), dy = Math.round(u[1] - drag.s[1]);
    const np = drag.base.map(q => [q[0] + dx, q[1] + dy]);
    if (np.every(q => q[0] >= -1e-9 && q[0] <= C - 1 + 1e-9 && q[1] >= -1e-9 && q[1] <= R - 1 + 1e-9)) { polys[sel].pts = np; draw(); }
  }, () => { drag = null; });
  svg.addEventListener("click", e => {
    if (over || mode === "move") return; const q = snapP(svgPt(svg, e));
    if (mode === "poly") {
      if (cur.length >= 3 && q[0] === cur[0][0] && q[1] === cur[0][1]) { const pts = cur; cur = []; addPoly(pts, "다각형 도구"); return; }
      if (cur.some(c => c[0] === q[0] && c[1] === q[1])) return api.hint(cur.length < 3 ? "점을 세 개 이상 고른 뒤 처음 점을 눌러요." : "이미 고른 점이에요.");
      cur.push(q); draw();
    } else if (mode === "reg") {
      if (regPick.length >= 2) return;
      if (regPick.length === 1 && regPick[0][0] === q[0] && regPick[0][1] === q[1]) return;
      regPick.push(q); draw(); if (regPick.length === 2) askN();
    }
  });
  function askN() {
    regBox.innerHTML = ""; const inp = h("input", { type: "number", min: 3, max: 12, value: 5, style: "width:4em;font-size:1.1em" });
    regBox.append(h("div", { class: "jua" }, "점 :"), p6Tools(inp, h("button", { onclick: () => {
      const n = Math.round(Number(inp.value)); if (!(n >= 3 && n <= 12)) return api.hint("꼭짓점의 수를 3부터 12까지 써요.");
      const a = regPick[0], b = regPick[1], L = p6Dist(a, b), d0 = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const mk = sgn => { const P = [a, b]; let d = d0; for (let i = 2; i < n; i++) { d += sgn * 2 * Math.PI / n; const q = P[i - 1]; P.push([q[0] + L * Math.cos(d), q[1] + L * Math.sin(d)]); } return P; };
      const fits = P => P.every(q => q[0] >= -1e-6 && q[0] <= C - 1 + 1e-6 && q[1] >= -1e-6 && q[1] <= R - 1 + 1e-6);
      const A1 = mk(-1), A2 = mk(1), c1 = p6Cen(A1), c2 = p6Cen(A2);
      const cand = [A1, A2].filter(fits).sort((x, y) => p6Cen(x)[1] - p6Cen(y)[1]);
      if (!cand.length) { regPick = []; regBox.innerHTML = ""; draw(); return api.hint("판 밖으로 나가요. 한 변을 짧게 하거나 다른 두 점을 골라요."); }
      regPick = []; regBox.innerHTML = ""; addPoly(cand[0].map(q => [Math.round(q[0] * 1e6) / 1e6, Math.round(q[1] * 1e6) / 1e6]), "정다각형 도구");
    } }, "확인"), h("button", { onclick: () => { regPick = []; regBox.innerHTML = ""; draw(); } }, "취소")));
  }
  const mB = [["poly", "다각형"], ["reg", "정다각형 : 한 변"], ["move", "옮기기"]].map(([k, l]) => h("button", { class: k === mode ? "on" : "", onclick: e => { mode = k; cur = []; regPick = []; regBox.innerHTML = ""; mB.forEach(b => b.classList.toggle("on", b === e.currentTarget)); draw(); hint(); } }, l));
  const hint = () => api.hint(mode === "poly" ? "꼭짓점을 차례대로 누르고, 마지막에 처음 꼭짓점을 다시 눌러요." : mode === "reg" ? "두 점을 눌러 한 변을 정하고, 꼭짓점의 수를 써요." : "도형을 끌어 옮겨요. 고른 도형은 복제하거나 지울 수 있어요.");
  const dup = h("button", { onclick: () => { if (sel < 0 || over) return api.hint("‘옮기기’에서 도형을 눌러 골라요."); const o = polys[sel], np = o.pts.map(q => [q[0] + 1, q[1] + 1]); const ok = np.every(q => q[0] <= C - 1 && q[1] <= R - 1); const p = { pts: ok ? np : o.pts.map(q => [q[0] - 1, q[1] - 1]), name: o.name, inf: o.inf, col: o.col }; polys.push(p); sel = polys.length - 1; draw(); api.hint(`${p6Jo(o.name, "을/를")} 복제했어요. 끌어서 옮겨요.`); if (opt.free && polys.length >= opt.free.min) doneB.disabled = false; } }, "복제");
  const del = h("button", { onclick: () => { if (sel < 0 || over) return; const gi = got.indexOf(sel); if (gi >= 0) return api.hint("이 도형은 할 일에 쓰였어요. 다른 도형을 지워요."); polys.splice(sel, 1); got.forEach((v, i) => { if (v != null && v > sel) got[i] = v - 1; }); sel = -1; draw(); } }, "지우기");
  const doneB = h("button", { class: "big", disabled: true, onclick: () => { over = true; doneB.disabled = true; p6Finish(body, api, opt, polys.map(p => p.name).join(", "), "나만의 모양을 만들었어요!", polys); } }, "다 만들었어요");
  api.provide({ words: ["다각형", "정다각형", "꼭짓점", "변"], answers: [] });
  body.append(stageWrap(svg, p6Side(p6Tools(...mB), regBox, targets.length ? h("div", {}, h("b", {}, "만들 도형"), list) : null, read, p6Tools(dup, del))));
  if (opt.free) body.append(h("div", { class: "actions" }, doneB));
  showList(); draw();
}

/* =========================================================
   9. 놀이: 주사위 눈의 수에 맞는 다각형 색칠하기 (우리 반 로봇 마스코트)
   opt: {regions:[{pts}], view:"x y w h", W, H}  — 모두 칠하면 api.done(
   ========================================================= */
const P6S_MIR = (P, W) => P.map(p => [W - p[0], p[1]]).reverse();
const P6S_ROBOT = (() => {
  const W = 440, L = [
    [[200, 20], [240, 20], [220, 56]],                                            // 안테나 3
    [[130, 70], [310, 70], [340, 140], [310, 210], [130, 210], [100, 140]],        // 머리 6
    [[158, 108], [198, 108], [206, 138], [178, 158], [150, 138]],                 // 왼쪽 눈 5
    [[242, 108], [282, 108], [290, 138], [262, 158], [234, 138]],                 // 오른쪽 눈 5
    [[178, 172], [262, 172], [262, 192], [178, 192]],                             // 입 4
    [[196, 210], [244, 210], [256, 236], [184, 236]],                             // 목 4
    [[120, 236], [320, 236], [350, 276], [350, 406], [320, 446], [120, 446], [90, 406], [90, 276]],   // 몸 8
    [[190, 290], [250, 290], [276, 322], [262, 362], [220, 382], [178, 362], [164, 322]],            // 가슴판 7
    [[90, 286], [50, 300], [30, 382], [56, 392], [70, 332], [90, 326]],          // 왼팔 6
    [[30, 382], [56, 392], [24, 424]],                                            // 왼손 3
    [[140, 446], [200, 446], [200, 508], [170, 524], [140, 508]],                // 왼다리 5
    [[118, 524], [200, 524], [212, 548], [106, 548]]                              // 왼발 4
  ];
  const R = L.slice();
  [8, 9, 10, 11].forEach(i => R.push(P6S_MIR(L[i], W)));
  return R.map(pts => ({ pts }));
})();
function p6sGame(body, api, opt) {
  /* 끝나면 p6Finish → api.done( */
  const svg = makeSvg(opt.W, opt.H); if (opt.view) svg.setAttribute("viewBox", opt.view);
  svg.style.maxHeight = "70vh";
  const regs = opt.regions.map(r => Object.assign({}, r, { n: p6Clean(r.pts).length, col: null }));
  const COLS = ["#F7B2C4", "#F6A65B", "#F7D04A", "#8BCF7E", "#6E9BEA", "#B58BE0", "#E8D6AE", "#9AD3D0"];
  let pc = COLS[0], die = null, turn = 0, over = false;
  const els = regs.map((r, i) => {
    const e = svgEl("polygon", { points: p6PtsAttr(r.pts), fill: "#fff", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round", style: "cursor:pointer" });
    e.addEventListener("click", () => pick(i)); svg.append(e); return e;
  });
  regs.forEach(r => r.pts.forEach(p => svg.append(svgEl("circle", { cx: p[0], cy: p[1], r: 3, fill: INK, "pointer-events": "none" }))));
  const dieS = makeSvg(100, 100), turnT = h("div", { class: "readout" }), read = h("div", { class: "p6small" });
  function drawDie() {
    dieS.innerHTML = ""; dieS.append(svgEl("rect", { x: 6, y: 6, width: 88, height: 88, rx: 16, fill: "#fff", stroke: INK, "stroke-width": 4 }));
    const D = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[26, 26], [50, 50], [74, 74]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]] };
    if (die) D[die].forEach(p => dieS.append(svgEl("circle", { cx: p[0], cy: p[1], r: 8, fill: die === 1 ? P6_NO : INK })));
  }
  const want = () => die ? die + 2 : null;
  function status() {
    turnT.textContent = over ? "그림 완성!" : `${turn + 1}번 친구 차례` + (die ? ` · 눈 ${die} → ${p6Name(want())}` : " · 주사위를 굴려요");
    read.textContent = `칠한 다각형 ${regs.filter(r => r.col).length}/${regs.length}`;
    roll.disabled = over || !!die; pass.disabled = over || !die;
  }
  const roll = h("button", { class: "big", onclick: () => { if (die || over) return; let k = 0; const t = setInterval(() => { die = 1 + Math.floor(Math.random() * 6); drawDie(); if (++k > 7) { clearInterval(t); status(); api.hint(`눈 ${die}이 나왔어요. 그림에서 ${p6Jo(p6Name(want()), "을/를")} 찾아 칠해요.`); } }, 70); } }, "🎲 주사위 굴리기");
  const pass = h("button", { onclick: () => {
    if (!die || over) return;
    const left = regs.filter(r => !r.col && r.n === want()).length;
    if (left) return api.hint(`아직 칠하지 않은 ${p6Jo(p6Name(want()), "이/가")} 그림에 남아 있어요. 변을 세며 찾아봐요.`);
    api.hint(`${p6Jo(p6Name(want()), "이/가")} 더 없어요. 상대에게 차례가 넘어가요.`); die = null; turn = 1 - turn; drawDie(); status();
  } }, "칠할 다각형이 없어요");
  function pick(i) {
    if (over) return; const r = regs[i];
    if (!die) return api.hint("먼저 주사위를 굴려요.");
    if (r.col) return api.hint("이미 칠한 다각형이에요.");
    if (r.n !== want()) { api.tryOnce(); return api.hint(`그 다각형은 변이 ${r.n}개인 ${p6Jo(p6Name(r.n), "이에요/예요")}. ${p6Jo(p6Name(want()), "을/를")} 찾아요.`); }
    r.col = pc; els[i].setAttribute("fill", pc);
    api.hint(`○ ${p6Jo(p6Name(r.n), "을/를")} 칠했어요. 다음 친구 차례예요.`); die = null; turn = 1 - turn; drawDie();
    if (regs.every(x => x.col)) { over = true; status(); return p6Finish(body, api, opt, "로봇 그림 완성", "다각형을 모두 찾아 로봇 마스코트를 완성했어요!"); }
    status();
  }
  const colors = h("div", { class: "p6colors" }, ...COLS.map((c, k) => { const b = h("button", { class: k ? "" : "p6-pick", style: `background:${c}`, "aria-label": "색 고르기", onclick: () => { pc = c; [...colors.children].forEach(x => x.classList.toggle("p6-pick", x === b)); } }); return b; }));
  const rule = p6Tbl(["눈의 수", "1", "2", "3", "4", "5", "6"], [["다각형", "삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형"]]);
  api.provide({ words: ["삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형"], answers: [] });
  drawDie(); status();
  body.append(rule, stageWrap(svg, p6Side(turnT, h("div", { class: "p6die" }, dieS), p6Tools(roll), p6Tools(pass), h("b", {}, "색 고르기"), colors, read)));
}
/* 굽은 선이 있는 도형 */
const p6Circ = (r = 1) => ({ curve: m => { const c = m([0, 0]), R = p6R(r * m.k); return `M${p6R(c[0] - R)},${c[1]}a${R},${R} 0 1 0 ${p6R(2 * R)},0a${R},${R} 0 1 0 ${p6R(-2 * R)},0Z`; }, bb: [[-r, -r], [r, r]] });
const p6Semi = () => ({ curve: m => { const a = m([-1, 0]), b = m([1, 0]), R = p6R(m.k); return `M${a[0]},${a[1]}A${R},${R} 0 0 1 ${b[0]},${b[1]}Z`; }, bb: [[-1, -1], [1, 0]] });
const p6Fan = () => ({ curve: m => { const o = m([0, 0]), p = m([1.6, 0]), q = m([0, -1.6]), R = p6R(1.6 * m.k); return `M${o[0]},${o[1]}L${p[0]},${p[1]}A${R},${R} 0 0 0 ${q[0]},${q[1]}Z`; }, bb: [[0, -1.6], [1.6, 0]] });
const p6Drop = () => ({ curve: m => { const a = m([0, 0]), b = m([2, 0]), c = m([1, -1.8]), R = p6R(1 * m.k); return `M${a[0]},${a[1]}A${R},${R} 0 0 0 ${b[0]},${b[1]}L${c[0]},${c[1]}Z`; }, bb: [[0, -1.8], [2, 1]] });
/* 반지름을 조금씩 바꾼 볼록 다각형 (n각형) */
function p6Blob(n, rs, rot = 0) { return Array.from({ length: n }, (_, i) => { const a = (rot + 360 * i / n) * Math.PI / 180, r = rs[i % rs.length]; return [p6R(r * Math.cos(a)), p6R(r * Math.sin(a))]; }); }
const p6S = pts => ({ pts });
/* 도형 확인(만들 때 한 번): 변의 수가 맞는지 */
function p6Need(P, n, what) { const inf = p6Info(P); if (!inf.ok || inf.n !== n) throw new Error(`그림 오류: ${what} — 변 ${inf.n}개`); return P; }

/* 패턴 블록 조각 하나: {k, pts} */
const p6P = (k, pts) => ({ k, pts });
const p6Mv = (pts, dx, dy) => pts.map(p => [p6R((p[0] + dx) * 1e4) / 1e4, p6R((p[1] + dy) * 1e4) / 1e4]);
/* 정육각형(모양 조각과 같은 크기) */
const p6Hex = (x, y) => p6Mv([[0, 0], [1, 0], [1.5, -P6_HH], [1, -2 * P6_HH], [0, -2 * P6_HH], [-.5, -P6_HH]], x, y);

/* 조각 그림 한 장 (단위 U) */
function p6ArtFig(W, H, U, groups, opt = {}) {
  const s = makeSvg(W, H); s.setAttribute("class", "p6fig"); s.style.maxWidth = opt.maxW || "30em";
  if (opt.bg) opt.bg(s);
  groups.forEach(g => s.append(p6PieceArt(P6_PB, g, { U })));
  if (opt.after) opt.after(s);
  return s;
}
const P6_HH = P6_H;

/* =========================================================
   이야기 버전 그림 자료 (모두 좌표로 계산하고 변의 수를 확인)
   ========================================================= */
/* 별 모양(뾰족한 곳 k개 → 변 2k개) */
function p6sStar(cx, cy, R, r, k = 5) { return Array.from({ length: 2 * k }, (_, i) => { const a = (-90 + 180 * i / k) * Math.PI / 180, q = i % 2 ? r : R; return [p6R(cx + q * Math.cos(a)), p6R(cy + q * Math.sin(a))]; }); }
/* 정다각형(중심·반지름) */
function p6sNgon(cx, cy, R, n, rot = 0) { return Array.from({ length: n }, (_, i) => { const a = (rot + 360 * i / n) * Math.PI / 180; return [p6R(cx + R * Math.cos(a)), p6R(cy + R * Math.sin(a))]; }); }
/* 거북이처럼 그리기: 변의 길이 lens, 꼭짓점마다 turn°씩 돌기 (마지막 변은 저절로 닫힘) */
function p6sTurtle(lens, turn) { const P = [[0, 0]]; let d = 0; for (let i = 0; i < lens.length - 1; i++) { const q = P[i]; P.push([q[0] + lens[i] * Math.cos(d), q[1] - lens[i] * Math.sin(d)]); d += turn * Math.PI / 180; } return P; }
/* 마름모(한 변 a, 한 각 deg) */
function p6sRh(a, deg) { const c = a * Math.cos(deg * Math.PI / 180), s = a * Math.sin(deg * Math.PI / 180); return [[0, 0], [a, 0], [a + c, -s], [c, -s]]; }

/* 1차시 우리 반 교실 */
const P6S_ROOM = {
  W: 900, H: 470,
  deco: s => {
    s.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 470, fill: "#FFF8EE" }), svgEl("rect", { x: 0, y: 360, width: 900, height: 110, fill: "#E9D8BE" }));
    s.append(svgEl("rect", { x: 40, y: 50, width: 260, height: 210, rx: 6, fill: "#DDEFFB", stroke: "#8BA6B9", "stroke-width": 6 }), svgEl("line", { x1: 170, y1: 50, x2: 170, y2: 260, stroke: "#8BA6B9", "stroke-width": 5 }));
    s.append(svgEl("rect", { x: 760, y: 170, width: 100, height: 190, rx: 4, fill: "#C9A27A", stroke: "#8A6A3A", "stroke-width": 4 }), svgEl("circle", { cx: 845, cy: 275, r: 6, fill: "#6E4A2A" }));
    s.append(svgEl("path", { d: "M330,212 Q470,232 650,212", fill: "none", stroke: "#8A6A3A", "stroke-width": 3 }));
    s.append(txt(450, 30, "4학년 2반 교실", 26, { fill: "#8A5A2B" }));
  },
  items: [
    { n: "창문 별 스티커", pts: p6sStar(105, 150, 52, 22), fill: "#F7D04A", info: "곧은 선 10개로 둘러싸여 있어요." },
    { n: "벽시계", circle: [720, 100, 44], fill: "#FFFFFF", info: "굽은 선으로 둘러싸인 도형(원)이에요." },
    { n: "게시판", pts: [[360, 60], [640, 60], [640, 195], [360, 195]], fill: "#F6E3B4", info: "곧은 선 4개로 둘러싸인 사각형이에요." },
    { n: "삼각 깃발", pts: [[455, 222], [505, 224], [480, 268]], fill: "#F28B82", info: "곧은 선 3개로 둘러싸인 삼각형이에요." },
    { n: "오각 문패", pts: [[770, 205], [810, 180], [850, 205], [850, 240], [770, 240]], fill: "#9AD3D0", info: "곧은 선 5개로 둘러싸여 있어요." },
    { n: "육각 바닥 타일", pts: [[410, 412], [430, 377], [470, 377], [490, 412], [470, 447], [430, 447]], fill: "#B7CAD8", info: "곧은 선 6개로 둘러싸여 있어요." },
    { n: "팔각 매트", pts: p6sNgon(190, 412, 46, 8, 22.5), fill: "#B58BE0", info: "곧은 선 8개로 둘러싸여 있어요." }]
};
function p6sRoomFig() {
  return p6Fig(P6S_ROOM.W, P6S_ROOM.H, s => {
    P6S_ROOM.deco(s);
    P6S_ROOM.items.forEach(it => s.append(it.circle ? svgEl("circle", { cx: it.circle[0], cy: it.circle[1], r: it.circle[2], fill: it.fill, stroke: "#5C6B73", "stroke-width": 3 }) : svgEl("polygon", { points: p6PtsAttr(it.pts), fill: it.fill, stroke: "#5C6B73", "stroke-width": 3, "stroke-linejoin": "round" })));
    const c = P6S_ROOM.items[1].circle; s.append(svgEl("path", { d: `M${c[0]},${c[1] - 28} L${c[0]},${c[1]} L${c[0] + 20},${c[1] + 8}`, stroke: INK, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }));
  }, "40em");
}
/* 1차시 창문 스티커 후보: 변 5·6·8·7 */
const P6S_STK = [
  p6Need(p6Blob(5, [1.4, 1.2, 1.5, 1.3, 1.4], -90), 5, "스티커 가"),
  p6Need(p6Blob(6, [1.3, 1.1, 1.4], 0), 6, "스티커 나"),
  p6Need([[0, 0], [3, 0], [3, 1], [2, 1], [2, 2.4], [1, 2.4], [1, 1], [0, 1]], 8, "스티커 다"),
  p6Need([[0, .6], [1.8, .6], [1.8, 0], [3, 1.2], [1.8, 2.4], [1.8, 1.8], [0, 1.8]], 7, "스티커 라")].map(p6S);
const P6S_STKN = [5, 6, 8, 7];

/* 2차시 스티커 도안 분류: 가 집(선분) 나 물방울(굽은 선) 다 화살표(선분) 라 부채꼴(굽은 선) 마 별(선분) 바 원(굽은 선) */
const P6S_ART = [p6S(p6Need([[0, 2.2], [2, 2.2], [2, .8], [1, 0], [0, .8]], 5, "집")), p6Drop(), p6S(p6Need([[0, .6], [1.8, .6], [1.8, 0], [3, 1.2], [1.8, 2.4], [1.8, 1.8], [0, 1.8]], 7, "화살표")), p6Fan(), p6S(p6Need(p6sStar(0, 0, 1.5, .62), 10, "별")), p6Circ(1)];
const P6S_ARTCAT = [0, 1, 0, 1, 0, 1];
/* 2차시 다각형 찾기: 가 번개(오목) 나 열린 도형 다 연 마 팔각형 / 라 반원 바 물방울 */
const P6S_FIND = [
  p6S(p6Need([[1, 0], [2.4, 0], [1.7, 1.1], [2.6, 1.1], [.6, 2.8], [1.2, 1.5], [.3, 1.5]], 7, "번개")),
  { open: [[0, .7], [0, 2], [2.4, 2], [2.4, 0], [0, 0]] },
  p6S(p6Need([[1.2, 0], [2.4, 1], [1.2, 2.8], [0, 1]], 4, "연")),
  p6Semi(),
  p6S(p6Need(p6Blob(8, [1.4, 1.25], 10), 8, "팔각형")),
  p6Drop()];

/* 3차시 변의 수로 나누기: 가6 나8 다5 라7 마5 바7 사6 아8 */
const P6S_SIDES = [
  p6Need([[0, 0], [3, 0], [3, 1], [2, 1], [2, 2], [0, 2]], 6, "가"),
  p6Need([[0, 0], [3, 0], [3, 1], [2, 1], [2, 2.4], [1, 2.4], [1, 1], [0, 1]], 8, "나"),
  p6Need([[0, 2.2], [2, 2.2], [2, .8], [1, 0], [0, .8]], 5, "다"),
  p6Need(p6Blob(7, [1.5, 1.3, 1.6], 0), 7, "라"),
  p6Need([[0, 0], [3, 0], [3, 2], [1.5, 1], [0, 2]], 5, "마"),
  p6Need([[0, .6], [1.8, .6], [1.8, 0], [3, 1.2], [1.8, 2.4], [1.8, 1.8], [0, 1.8]], 7, "바"),
  p6Need(p6Blob(6, [1.5, 1.2], 30), 6, "사"),
  p6Need(p6Blob(8, [1.6, 1.25], 22.5), 8, "아")].map(p6S);
const P6S_SIDECAT = [1, 3, 0, 2, 0, 2, 1, 3];
/* 3차시 교실 문 팻말: 육각형 이름표, 오각형 신발 정리, 팔각형 멈춤 */
function p6sSigns() {
  return p6Fig(780, 260, s => {
    const hex = p6sNgon(130, 125, 95, 6, 0), pent = [[300, 120], [390, 40], [480, 120], [480, 220], [300, 220]], oct = p6sNgon(640, 125, 100, 8, 22.5);
    s.append(svgEl("polygon", { points: p6PtsAttr(hex), fill: "#9AD3D0", stroke: "#2C8C88", "stroke-width": 5 }), txt(130, 128, "4학년 2반", 28, { fill: "#1D4E4C" }));
    s.append(svgEl("polygon", { points: p6PtsAttr(pent), fill: "#F7D04A", stroke: "#B08A1E", "stroke-width": 5 }), txt(390, 160, "신발 정리", 28, { fill: "#6B4E00" }));
    s.append(svgEl("polygon", { points: p6PtsAttr(oct), fill: "#D93A30", stroke: "#8E1F18", "stroke-width": 5 }), txt(640, 112, "멈춤!", 34, { fill: "#fff" }), txt(640, 150, "복도에서 걷기", 20, { fill: "#fff" }));
    s.append(txt(130, 248, "가", 22), txt(390, 248, "나", 22), txt(640, 248, "다", 22));
  }, "40em");
}

/* 4차시 바닥 타일: 정사각형 직사각형 정육각형 마름모(70°) 정삼각형 정팔각형 */
const P6S_TILE = [p6Reg(4, 2), [[0, 0], [3.2, 0], [3.2, 1.8], [0, 1.8]], p6Reg(6, 1.4), p6sRh(2.2, 70), p6Reg(3, 2.6), p6Reg(8, 1.1)].map(p6S);
/* 4차시 정다각형 찾기: 가 비스듬한 정사각형, 나 마름모(60°), 다 정오각형, 라 각만 같은 육각형, 마 정칠각형 */
const P6S_REGQ = [p6Reg(4, 2, 25), p6sRh(2, 60), p6Reg(5, 1.8), p6Need(p6sTurtle([2.2, 1, 2.2, 1, 2.2, 1], 60), 6, "라"), p6Reg(7, 1.3)].map(p6S);
if (!p6Info(P6S_REGQ[3].pts).eqA || p6Info(P6S_REGQ[3].pts).eqL) throw new Error("그림 오류: 각만 같은 육각형");
/* 4차시 정팔각형 타일 □ */
const P6S_OCT = { side: 3, ang: (8 - 2) * 180 / 8 };
function p6sOctFig() {
  return p6Fig(420, 360, s => {
    const P = p6Reg(8, 2), m = p6Fit(P, 420, 360, 62), Q = P.map(m), c = p6Cen(Q);
    s.append(svgEl("polygon", { points: p6PtsAttr(Q), fill: "#EADFF6", stroke: INK, "stroke-width": 4 }));
    const lab = (i, t) => { const [mid, nv] = p6Out(Q, i); s.append(txt(p6R(mid[0] + nv[0] * 24), p6R(mid[1] + nv[1] * 24), t, 22, { fill: "#2B5FA8" })); };
    const ang = (i, t) => { const v = [c[0] - Q[i][0], c[1] - Q[i][1]], l = Math.hypot(...v); s.append(txt(p6R(Q[i][0] + v[0] / l * 40), p6R(Q[i][1] + v[1] / l * 40), t, 20, { fill: "#B4610F" })); };
    lab(0, `${P6S_OCT.side} cm`); lab(4, "□ cm"); ang(1, `${P6S_OCT.ang}°`); ang(5, "□°");
  }, "20em");
}

/* 5차시 대각선 긋기: 삼각형·사각형·오각형·육각형 */
const P6S_DG = [
  { pts: [[0, 2], [2.6, 2], [1, 0]], label: "삼각형 깃발" },
  { pts: [[0, 0], [3, .3], [2.6, 2.2], [.3, 2]], label: "사각형 스티커" },
  { pts: p6Need(p6Blob(5, [1.5, 1.3, 1.6, 1.4, 1.5], -90), 5, "오각형"), label: "오각형 스티커" },
  { pts: p6Need(p6Blob(6, [1.5, 1.3], 0), 6, "육각형"), label: "육각형 스티커" }];
const P6S_DGN = P6S_DG.map(S => S.pts.length * (S.pts.length - 3) / 2);   // 0, 2, 5, 9
/* 5차시 사각형 4가지(cm): 평행사변형·마름모·직사각형·정사각형 */
const P6S_QD = [
  { pts: [[0, 2.4], [3.6, 2.4], [4.8, 0], [1.2, 0]], label: "평행사변형", measure: true },
  { pts: [[0, 1.5], [2, 3], [4, 1.5], [2, 0]], label: "마름모", measure: true },
  { pts: [[0, 2.4], [4, 2.4], [4, 0], [0, 0]], label: "직사각형", measure: true },
  { pts: [[0, 2.8], [2.8, 2.8], [2.8, 0], [0, 0]], label: "정사각형", measure: true }];
const P6S_QPROP = (() => {   // 두 대각선의 길이가 같은지, 수직인지 계산
  return P6S_QD.map(S => { const Q = S.pts, u = [Q[2][0] - Q[0][0], Q[2][1] - Q[0][1]], v = [Q[3][0] - Q[1][0], Q[3][1] - Q[1][1]];
    return { eq: Math.abs(Math.hypot(...u) - Math.hypot(...v)) < 1e-6, perp: Math.abs(u[0] * v[0] + u[1] * v[1]) < 1e-6 }; });
})();
if (P6S_QPROP.map(x => +x.eq).join("") !== "0011" || P6S_QPROP.map(x => +x.perp).join("") !== "0101") throw new Error("그림 오류: 사각형 대각선");

/* 6차시 게시판 작품: 트리(사다리꼴·정삼각형·정사각형), 별 장식(정육각형 + 정삼각형 6) */
const P6S_TREE = [p6P("trap", [[0, 0], [2, 0], [1.5, -P6_H], [.5, -P6_H]]), p6P("tri", [[.5, -P6_H], [1.5, -P6_H], [1, -2 * P6_H]]), p6P("sq", [[.5, 0], [1.5, 0], [1.5, 1], [.5, 1]])];
function p6sStarPieces(cx, cy) {
  const hx = p6Hex(cx - .5, cy + P6_H), c = [cx, cy], out = [p6P("hex", hx)], outline = [];
  hx.forEach((a, i) => { const b = hx[(i + 1) % 6], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], v = [mid[0] - c[0], mid[1] - c[1]], l = Math.hypot(...v);
    const tip = [p6R((mid[0] + v[0] / l * P6_H) * 1e4) / 1e4, p6R((mid[1] + v[1] / l * P6_H) * 1e4) / 1e4];
    out.push(p6P("tri", [a, b, tip])); outline.push(a, tip); });
  return { pieces: out, outline };
}
const P6S_STAR = p6sStarPieces(5, 3);
p6Need(P6S_STAR.outline, 12, "별 장식 테두리");
function p6sBoardFig() {
  return p6ArtFig(600, 300, 50, [P6S_TREE.map(p => p6P(p.k, p6Mv(p.pts, 1.6, 4))), p6sStarPieces(8, 3).pieces], {
    maxW: "32em", bg: s => s.append(svgEl("rect", { x: 0, y: 0, width: 600, height: 300, fill: "#FFF6E0" })),
    after: s => s.append(txt(130, 285, "트리", 20), txt(400, 285, "별 장식", 20)) });
}

/* 7차시 채우기 모양 */
const P6S_HEX1 = p6Hex(4.5, 3.6);
const P6S_HEX2 = [p6Hex(2, 3.6), p6Mv(p6Hex(2, 3.6), 1.5, P6_H)];   // 정육각형 2개를 붙인 모양
const P6S_BAND = p6Mv([[0, 0], [4, 0], [3.5, -P6_H], [.5, -P6_H]], 3, 3.5);   // 현수막 띠: 아랫변 4, 윗변 3
const P6S_BANDEX = [p6P("trap", p6Mv([[0, 0], [2, 0], [1.5, -P6_H], [.5, -P6_H]], 0, 0)), p6P("par", [[2, 0], [3, 0], [2.5, -P6_H], [1.5, -P6_H]]), p6P("par", [[3, 0], [4, 0], [3.5, -P6_H], [2.5, -P6_H]])];
const P6S_BIGHEX = p6Mv([[0, 0], [2, 0], [3, -2 * P6_H], [2, -4 * P6_H], [0, -4 * P6_H], [-1, -2 * P6_H]], 4, 5.2);
function p6sBandFig() {
  return p6ArtFig(320, 110, 70, [P6S_BANDEX.map(p => p6P(p.k, p6Mv(p.pts, .3, 1.2)))], { maxW: "16em", after: s => s.append(txt(160, 104, "준우가 채운 방법", 16)) });
}
const P6S_TRI = 1, P6S_AREA = { tri: 1, par: 2, trap: 3, hex: 6 };   // 정삼각형 몇 개만큼의 넓이인지
/* 10차시 디자인 심사: 가 칠각형, 나 오각형(오목), 다 반원, 라 팔각형, 마 열린 도형 */
const P6S_FINAL = [p6S(p6Need(p6Blob(7, [1.5, 1.3, 1.6], 15), 7, "가")), p6S(p6Need([[0, 0], [3, 0], [3, 2], [1.5, 1], [0, 2]], 5, "나")), p6Semi(),
  p6S(p6Need([[0, 0], [3, 0], [3, 1], [2, 1], [2, 2.4], [1, 2.4], [1, 1], [0, 1]], 8, "라")), { open: [[2.4, 1.6], [2.4, 0], [0, 0], [0, 2.2], [1.6, 2.2]] }];
//@@LESSONS
const UNIT_STORY = { title: "우리 반 교실 꾸미기 디자인단", lines: [
  "4학년 2반은 윤 선생님과 함께 ‘교실 꾸미기 디자인단’을 만들었어요. 서윤, 도현, 하린, 준우, 지아, 민재가 창문 스티커, 바닥 타일, 게시판 작품, 우리 반 현수막을 맡았어요.",
  "스티커 도안을 나누며 다각형과 정다각형을 알고, 색종이를 접어 대각선을 찾고, 모양 조각으로 게시판 작품을 만들고 현수막 무늬를 빈틈없이 채워요.",
  "마지막에는 로봇 마스코트 색칠 놀이를 하고, 우리 반 교실 꾸미기 발표회를 열어요."],
  one: "다각형 · 교실을 꾸미며 다각형·정다각형·대각선을 알고, 모양 조각으로 모양을 만들고 채워요." };
const UNIT_KEYWORDS = ["선분", "다각형", "변", "꼭짓점", "오각형", "육각형", "칠각형", "팔각형", "정다각형", "변의 길이가 모두 같음", "각의 크기가 모두 같음", "대각선", "이웃하지 않는 두 꼭짓점", "모양 조각", "모양 만들기", "모양 채우기", "빈틈없이 겹치지 않게"];
const P6_NAMES6 = ["삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형"];
const P6_PBN = ["정삼각형", "정사각형", "평행사변형", "사다리꼴", "마름모", "정육각형"];

const LESSONS = [
{
  id: "s1", no: 1, title: "교실 꾸미기 디자인단이 모였어요", soop: "개념 찾기(S)",
  question: "우리 교실의 물건과 장식에는 어떤 도형이 있을까요? 삼각형, 사각형보다 변이 많은 도형은 무엇이라고 부를까요?",
  summary: "교실의 창문 스티커, 게시판, 문패, 바닥 타일에는 여러 가지 도형이 있어요. 곧은 선으로 둘러싸인 도형도 있고, 시계처럼 굽은 선으로 둘러싸인 도형도 있어요. 삼각형·사각형이 변의 수로 이름을 붙였듯이 변이 5개, 6개인 도형에도 이름이 있어요. 이 단원에서 다각형, 정다각형, 대각선을 알아보고 모양 조각으로 교실을 꾸며 봐요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "윤 선생님이 “2학기 교실은 우리가 직접 꾸며 봐요!”라고 하셨어요. 우리 반 교실 그림을 보고 떠오르는 것을 세 칸에 써서 붙여요.", hints: ["창문, 게시판, 문, 바닥을 살펴봐요.", "곧은 선으로 둘러싸인 것과 굽은 선으로 둘러싸인 것을 떠올려요."],
      render: (b, a) => { b.append(p6sRoomFig()); panes(b, a, [
        { t: "보여요", e: "👀", ph: "교실에서 ~ 모양이 보여요", hint: "창문·게시판·바닥의 모양", ex: ["창문에 뾰족뾰족한 별 모양 스티커가 붙어 있어요.", "바닥에 변이 6개인 타일과 변이 8개인 매트가 있어요."] },
        { t: "생각해요", e: "💭", ph: "~은 ~해서 그런 모양인 것 같아요", hint: "왜 그런 모양으로 만들었을지", ex: ["문패는 집 모양이라 변이 5개인 것 같아요.", "시계는 둥글어서 다른 장식과 달리 곧은 선이 없어요."] },
        { t: "궁금해요", e: "❓", ph: "~은 무엇이라고 부를까?", hint: "도형에 대해 궁금한 것", ex: ["변이 6개인 타일은 무엇이라고 부를까?", "별 모양 스티커도 이름이 있을까?"] }],
        { ok: "교실 곳곳에 여러 가지 도형이 있어요. 이 도형들을 무엇이라고 부르는지 알아봐요." }); } },
    { name: "그려 보기 — 교실에서 도형 찾기", inst: "교실 그림에서 도형을 이루는 장식을 모두 눌러 찾아보세요. 찾은 도형의 특징이 옆에 나와요.", hints: ["창문, 벽, 문, 바닥을 차례로 살펴봐요.", "둥근 시계도 도형이에요."],
      render: (b, a) => p6Scene(b, a, Object.assign({ tip: "도형을 하나씩 눌러요. 7개를 모두 찾으면 끝나요.", ok: "삼각형, 사각형, 원과 곧은 선 5개·6개·8개·10개로 둘러싸인 도형을 찾았어요." }, P6S_ROOM)) },
    { name: "말해 보기 — 창문 스티커의 변 세기", inst: "서윤이가 창문 스티커 도안 가~라를 가져왔어요. 각 도안의 변의 수를 세어 보세요.", hints: ["한 변을 짚고 시작해서 한 바퀴 돌며 세어요.", "꼭짓점을 세어 보아도 돼요. 움푹 들어간 곳도 빠뜨리지 않아요."],
      render: thenWhy((b, a) => { b.append(p6Cards(P6S_STK, { per: 4, cw: 180, ch: 170, shape: { dots: true }, maxW: "40em" }));
        numbers(b, a, P6S_STK.map((S, i) => ({ q: `${P6_KO[i]}의 변`, a: P6S_STKN[i], unit: "개" })), { ok: `가는 ${P6S_STKN[0]}개, 나는 ${P6S_STKN[1]}개, 다는 ${P6S_STKN[2]}개, 라는 ${P6S_STKN[3]}개예요.` }); },
        { q: "변의 수를 빠뜨리지 않고 세려면 어떻게 하면 좋을까요?", ph: "~부터 시작해서 ~", help: ["① 처음 센 변에 표시를 해요. → ② 한 방향으로 돌며 세어요.", "‘한 변에 표시를 하고 ~ 방향으로 돌며 세면 돼요.’ 꼴로 써요."], ans: "처음 센 변에 표시를 하고 한 방향으로 한 바퀴 돌며 세면 빠뜨리거나 두 번 세지 않아요." }) },
    { name: "약속하기 — 배운 것 떠올리기", inst: "3학년과 4학년 1학기에 배운 것을 떠올려 알맞은 것을 골라 보세요.", hints: ["두 점을 곧게 이은 선이 선분이에요.", "마름모는 네 변의 길이가 모두 같은 사각형이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "두 점을 곧게 이은 선은?", o: ["선분", "반직선", "직선"], a: 0, why: { "1": "반직선은 한 점에서 한쪽으로 끝없이 늘인 곧은 선이에요.", "2": "직선은 양쪽으로 끝없이 늘인 곧은 선이에요." } },
        { q: "삼각형의 변과 꼭짓점은 각각 몇 개일까요?", o: ["변 3개, 꼭짓점 3개", "변 3개, 꼭짓점 4개", "변 4개, 꼭짓점 4개"], a: 0 },
        { q: "네 변의 길이가 모두 같은 사각형은?", o: ["사다리꼴", "마름모", "직사각형"], a: 1, why: { "0": "사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이에요.", "2": "직사각형은 네 각이 모두 직각인 사각형이에요." } }], { ok: "선분, 삼각형의 변과 꼭짓점, 마름모를 잘 기억하고 있어요." }) },
    { name: "확인하기 — 이름은 무엇과 관련 있을까", inst: "“변이 6개인 타일은 무엇이라고 불러야 할까?” 도현이의 궁금증을 함께 생각해 보고, 이 단원에서 알고 싶은 것을 써 보세요.", hints: ["삼각형은 변이 3개, 사각형은 변이 4개예요.", "이름 앞의 수를 살펴봐요."],
      render: (b, a) => { blanks(b, a, ["삼각형은 변이 ", { o: ["3개", "4개"], a: 0 }, ", 사각형은 변이 ", { o: ["4개", "5개"], a: 0 }, "예요. 도형의 이름은 ", { o: ["변의 수", "색깔", "크기"], a: 0 }, "와 관련이 있어요."], { ok: "도형의 이름은 변의 수와 관련이 있어요." });
        writeStep(b, a, [{ q: "교실 꾸미기를 하며 도형에 대해 알고 싶은 것을 써 보세요.", tag: "알고 싶은 것", ph: "예) 변이 ~개인 도형의 이름", help: ["① 교실 그림에서 이름을 모르는 도형을 하나 골라요. → ② 그 도형에 대해 궁금한 것을 생각해요.", "‘~은 무엇이라고 부르는지 알고 싶어요.’ 꼴로 써요."], ans: "변이 6개인 바닥 타일과 변이 8개인 매트는 무엇이라고 부르는지 알고 싶어요." }]); } }
  ],
  challenge: { inst: "★ 도전: 교실 물건에서 찾을 수 있는 도형을 골라 보세요.", hints: ["변의 수를 세어 이름을 정해요.", "곧은 선이 없으면 원이에요."],
    render: (b, a) => quiz(b, a, [
      { q: "삼각자에서 찾을 수 있는 도형은?", o: ["삼각형", "사각형", "원"], a: 0 },
      { q: "칠판과 사물함 문에서 찾을 수 있는 도형은?", o: ["삼각형", "사각형", "원"], a: 1 },
      { q: "칠교 조각에서 찾을 수 있는 도형을 모두 골라요.", o: ["삼각형", "사각형", "원"], a: [0, 1] }], { bad: "칠교 조각은 삼각형 5개와 사각형 2개예요.", ok: "삼각자는 삼각형, 칠판·사물함 문은 사각형, 칠교 조각은 삼각형과 사각형이에요." }) }
},
{
  id: "s2", no: 2, title: "창문 스티커 도안 고르기 ― 다각형", soop: "개념 구축하기(O)",
  question: "다각형은 어떤 도형일까요? 어떤 도형은 다각형이 아닐까요?",
  summary: "선분으로만 둘러싸인 도형을 다각형이라고 해요. 굽은 선이 조금이라도 있거나, 선분이 맞닿지 않아 열려 있는 도형은 다각형이 아니에요. 번개나 별처럼 움푹 들어간 모양도 선분으로만 둘러싸여 있으면 다각형이에요.",
  steps: [
    { name: "만져 보기 — 도안을 선의 특징으로 나누기", inst: "하린이가 창문 스티커 도안 가~바를 모았어요. 칼로 자르기 쉬운 곧은 선 도안과 굽은 선이 있는 도안으로 나누어 보세요. 카드를 누른 다음 알맞은 칸 단추를 눌러요.", hints: ["선분은 두 점을 곧게 이은 선이에요.", "굽은 선이 조금이라도 있는지 살펴봐요."],
      render: thenWhy((b, a) => p6Sort(b, a, { cats: ["선분으로만 둘러싸인 도형", "굽은 선이 있는 도형"], items: P6S_ART.map((S, i) => ({ S, cat: P6S_ARTCAT[i], why: P6S_ARTCAT[i] ? `${P6_KO[i]}에는 굽은 선이 있어요.` : `${P6_KO[i]}는 곧은 선(선분)으로만 둘러싸여 있어요.` })), ok: "선분으로만 둘러싸인 도형은 가, 다, 마이고, 굽은 선이 있는 도형은 나, 라, 바예요." }),
        { q: "가, 다, 마의 공통점은 무엇일까요?", ph: "가, 다, 마는 모두 ~", help: ["① 세 도형을 둘러싼 선을 살펴봐요. → ② 굽은 선이 있는지 없는지 말해요.", "‘가, 다, 마는 모두 ~으로만 둘러싸여 있어요.’ 꼴로 써요."], ans: "가, 다, 마는 모두 굽은 선 없이 선분으로만 둘러싸여 있어요." }) },
    { name: "그려 보기 — 도형판에 고무줄 걸기", inst: "도현이가 도형판에 고무줄을 걸다가 멈췄어요. 노란 선분에 이어 점을 차례로 눌러 다각형을 완성해 보세요. 처음 점을 다시 누르면 닫혀요.", hints: ["곧은 선만 써요.", "선분들이 서로 떨어지지 않고, 서로 만나지 않게 이어서 처음 점으로 돌아와요."],
      render: thenWhy((b, a) => p6Dots(b, a, { grid: { type: "sq", cols: 10, rows: 6, gap: 50 }, tasks: [{ given: [[1, 1], [1, 4], [4, 4]], label: "노란 선분에 이어 다각형 완성하기 ①" }, { given: [[6, 4], [8, 4], [8, 1], [7, 2]], label: "노란 선분에 이어 다각형 완성하기 ②" }], ok: "주어진 선분에 맞닿게 다른 선분을 이어 다각형을 완성했어요." }),
        { q: "다각형을 그릴 때 꼭 지켜야 할 것은 무엇일까요?", ph: "~만 쓰고, ~", help: ["① 어떤 선으로 그렸는지 떠올려요. → ② 선분끼리 어떻게 이어졌는지 떠올려요.", "‘곧은 선만 쓰고, 선분들이 ~ 처음 점으로 돌아오게 그려요.’ 꼴로 써요."], ans: "굽은 선 없이 곧은 선만 쓰고, 선분들이 떨어지지 않게 맞닿아 처음 점으로 돌아오게 그려요." }) },
    { name: "말해 보기 — 다각형 찾기", inst: "지아가 새 도안 가~바를 가져왔어요. 다각형을 모두 찾아보세요.", hints: ["선분으로만 둘러싸여 있어야 해요.", "선분들이 맞닿아 닫혀 있어야 해요. 움푹 들어간 모양도 괜찮아요."],
      render: (b, a) => p6Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "다각형을 모두 골라요.", fig: () => p6Cards(P6S_FIND, { per: 3, cw: 200, ch: 170, maxW: "36em", shape: { dots: true } }), o: P6_KO.slice(0, 6), a: [0, 2, 4] }], { bad: "선분으로만 둘러싸여 있고 닫혀 있는 도형을 골라요. 움푹 들어간 번개 모양도 다시 살펴봐요.", ok: "가, 다, 마가 다각형이에요. 가처럼 움푹 들어간 모양도 선분으로만 둘러싸여 있으면 다각형이에요." }),
        (bx, ax) => quiz(bx, ax, [
          { q: "나는 왜 다각형이 아닐까요?", o: ["굽은 선이 있어서", "선분이 맞닿지 않아 열려 있어서", "변이 너무 많아서"], a: 1, why: { "0": "나는 곧은 선으로만 그렸어요. 왼쪽 위를 살펴봐요." } },
          { q: "라와 바는 왜 다각형이 아닐까요?", o: ["굽은 선이 있어서", "열려 있어서", "꼭짓점이 없어서"], a: 0, why: { "1": "라와 바는 닫혀 있어요. 둘러싼 선을 살펴봐요." } }], { ok: "나는 열려 있고, 라와 바는 굽은 선이 있어서 다각형이 아니에요." })]) },
    { name: "약속하기 — 다각형", inst: "약속: 알맞은 말을 골라 다각형의 뜻을 완성해 보세요.", hints: ["어떤 선으로만 둘러싸여 있었는지 떠올려요."],
      render: (b, a) => blanks(b, a, [{ o: ["선분", "굽은 선", "직선"], a: 0 }, "으로만 둘러싸인 도형을 ", { o: ["다각형", "원", "선분 도형"], a: 0 }, "이라고 해요. 다각형을 둘러싸고 있는 선분을 ", { o: ["변", "꼭짓점", "대각선"], a: 0 }, ", 두 변이 만나는 점을 ", { o: ["꼭짓점", "변", "중심"], a: 0 }, "이라고 해요."], { ok: "선분으로만 둘러싸인 도형을 다각형이라고 해요." }) },
    { name: "확인하기 — 친구의 말 살피기", inst: "민재가 “각이 여러 개 있으면 다각형이야.”라고 말했어요. 물음에 답해 보세요.", hints: ["열려 있는 도형에도 각이 여러 개 있을 수 있어요.", "다각형의 약속에는 ‘선분으로만’과 ‘둘러싸인’이 들어 있어요."],
      render: (b, a) => { quiz(b, a, [{ q: "도안 나(열린 도형)를 보고 민재의 말이 맞는지 골라요.", o: ["맞아요. 각이 여러 개라서 다각형이에요.", "틀려요. 각이 여러 개여도 열려 있으면 다각형이 아니에요."], a: 1, why: { "0": "나에는 각이 있지만 선분이 맞닿지 않아 열려 있어요." } }], { ok: "각이 여러 개 있어도 둘러싸여 있지 않으면 다각형이 아니에요." });
        writeStep(b, a, [{ q: "민재의 말을 바르게 고쳐 써 보세요.", tag: "바르게 고치기", ph: "다각형은 ~", help: ["① 다각형의 약속을 떠올려요. → ② ‘선분으로만’, ‘둘러싸인’ 두 가지를 모두 넣어요.", "‘다각형은 ~으로만 ~ 도형이야.’ 꼴로 써요."], ans: "다각형은 각이 여러 개인 도형이 아니라, 선분으로만 빈틈없이 둘러싸인 도형이야." }]); } }
  ],
  challenge: { inst: "★ 도전: 다각형이 아닌 도안을 다각형으로 고치려고 해요. 알맞은 방법을 골라 보세요.", hints: ["열린 곳은 선분으로 이어요.", "굽은 선은 곧은 선으로 바꾸어요."],
    render: (b, a) => quiz(b, a, [
      { q: "열려 있는 도안 나를 다각형으로 고치려면?", o: ["열린 두 끝을 선분으로 이어요", "굽은 선을 하나 더 그려요", "변 하나를 지워요"], a: 0, why: { "1": "굽은 선이 생기면 다각형이 아니에요.", "2": "변을 지우면 더 열려요." } },
      { q: "반원 모양 도안 라를 다각형으로 고치려면?", o: ["굽은 선을 선분 여러 개로 바꾸어요", "곧은 변을 지워요", "색을 칠해요"], a: 0 }], { ok: "열린 곳은 선분으로 잇고, 굽은 선은 선분으로 바꾸면 다각형이 돼요." }) }
},
{
  id: "s3", no: 3, title: "스티커 이름 붙이기 ― 오각형, 육각형, 칠각형, 팔각형", soop: "개념 구축하기(O)",
  question: "다각형의 이름은 어떻게 정할까요? 변의 수와 꼭짓점의 수는 어떤 관계가 있을까요?",
  summary: "다각형은 변의 수에 따라 변이 5개이면 오각형, 6개이면 육각형, 7개이면 칠각형, 8개이면 팔각형이라고 불러요. 모양이 달라도 변의 수가 같으면 이름이 같아요. 다각형은 변의 수와 꼭짓점의 수가 같아요.",
  steps: [
    { name: "만져 보기 — 변의 수로 나누기", inst: "스티커 도안 가~아에 이름표를 붙이려고 해요. 변의 수에 따라 나누어 보세요. ‘변에 번호 붙이기’를 누르면 세기 쉬워요.", hints: ["변은 다각형을 둘러싸고 있는 선분이에요.", "움푹 들어간 곳의 변도 빠뜨리지 말고 세어요."],
      render: thenWhy((b, a) => p6Sort(b, a, { cats: ["변 5개", "변 6개", "변 7개", "변 8개"], nums: true, items: P6S_SIDES.map((S, i) => ({ S, cat: P6S_SIDECAT[i], why: `${P6_KO[i]}의 변을 번호를 붙여 다시 세어 봐요.` })), ok: "변 5개: 다, 마 / 변 6개: 가, 사 / 변 7개: 라, 바 / 변 8개: 나, 아예요." }),
        { q: "다와 마는 모양이 다른데 왜 같은 칸에 넣었나요?", ph: "왜냐하면 ~", help: ["① 다와 마의 변을 세어요. → ② 모양보다 무엇이 같은지 말해요.", "‘왜냐하면 다와 마는 모양은 달라도 ~이기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 다와 마는 모양은 달라도 변이 모두 5개이기 때문이에요." }) },
    { name: "그려 보기 — 점 종이에 다각형 그리기", inst: "점 종이에 칠각형, 육각형, 오각형 스티커 도안을 차례로 그려 보세요. 먼저 변의 수와 꼭짓점의 수 사이의 규칙을 예상해요.", hints: ["칠각형은 선분 7개를 이어 그려요.", "처음 점을 다시 누르면 닫혀요."],
      render: ruleFirst((b, a) => p6Dots(b, a, { grid: { type: "sq", cols: 12, rows: 7, gap: 46 }, tasks: [{ n: 7, label: "칠각형 그리기" }, { n: 6, label: "육각형 그리기" }, { n: 5, label: "오각형 그리기" }],
        then: (box, ap) => numbers(box, ap, [{ q: "칠각형의 꼭짓점", a: 7, unit: "개" }, { q: "육각형의 꼭짓점", a: 6, unit: "개" }, { q: "오각형의 꼭짓점", a: 5, unit: "개" }], { ok: "칠각형은 꼭짓점 7개, 육각형은 6개, 오각형은 5개예요. 변의 수와 꼭짓점의 수가 같아요." }) }),
        { q: "다각형의 변의 수와 꼭짓점의 수는 어떤 관계가 있을까요?", ph: "내 규칙: 변의 수와 꼭짓점의 수는 ~", help: ["① 삼각형과 사각형의 변·꼭짓점 수를 떠올려요. → ② 두 수를 견주어요.", "‘변의 수와 꼭짓점의 수는 ~.’ 꼴로 써요."], ans: "다각형은 변의 수와 꼭짓점의 수가 같아요. 변 하나가 끝날 때마다 꼭짓점이 하나씩 있기 때문이에요." }) },
    { name: "말해 보기 — 교실 문 팻말", inst: "준우가 교실 문에 붙일 팻말 가~다를 만들었어요. 팻말의 다각형 이름을 골라 보세요.", hints: ["팻말 테두리의 변을 세어요.", "변이 8개이면 팔각형이에요."],
      render: thenWhy((b, a) => { b.append(p6sSigns()); blanks(b, a, ["가 이름표: ", { o: P6_NAMES6, a: 3 }, " / 나 신발 정리: ", { o: P6_NAMES6, a: 2 }, " / 다 멈춤: ", { o: P6_NAMES6, a: 5 }], { ok: "가는 육각형, 나는 오각형, 다는 팔각형이에요." }); },
        { q: "다를 팔각형이라고 부르는 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 다의 변을 세어요. → ② 이름과 변의 수를 이어 말해요.", "‘왜냐하면 다는 변이 ~개인 다각형이기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 다는 선분 8개로 둘러싸인, 변이 8개인 다각형이기 때문이에요." }) },
    { name: "약속하기 — 다각형의 이름", inst: "약속: 알맞은 말을 골라 다각형의 이름을 정리해 보세요.", hints: ["이름 앞의 수가 변의 수예요."],
      render: (b, a) => blanks(b, a, ["다각형은 변의 수에 따라 변이 5개이면 ", { o: ["오각형", "육각형", "칠각형", "팔각형"], a: 0 }, ", 변이 6개이면 ", { o: ["오각형", "육각형", "칠각형", "팔각형"], a: 1 }, ", 변이 7개이면 ", { o: ["오각형", "육각형", "칠각형", "팔각형"], a: 2 }, ", 변이 8개이면 ", { o: ["오각형", "육각형", "칠각형", "팔각형"], a: 3 }, "이라고 불러요."], { ok: "변의 수가 다각형의 이름이 돼요." }) },
    { name: "확인하기 — 나만의 창문 스티커", inst: "도형판에 다각형을 3개 이상 만들어 나만의 창문 스티커를 꾸며 보세요. 다 꾸몄으면 ‘작품 완성’을 눌러요.", hints: ["점을 차례로 눌러 다각형을 만들고 처음 점을 다시 눌러 닫아요.", "여러 가지 다각형을 섞어 보아요."],
      render: (b, a) => p6Dots(b, a, { grid: { type: "sq", cols: 11, rows: 8, gap: 44 }, free: { min: 3 }, tip: "점을 차례로 눌러 다각형을 만들고 처음 점을 다시 눌러 닫아요. 여러 개 만들어 스티커를 꾸며요.",
        then: (box, ap, made) => writeStep(box, ap, [{ q: `스티커의 이름을 짓고, 이용한 다각형을 설명해 보세요. (만든 다각형: ${made.map(m => m.label).join(", ")})`, tag: "스티커 설명", ph: "예) 나는 ~과 ~을 이용하여 ~을 만들었어요.", help: ["① 스티커 이름을 지어요. → ② 쓴 다각형의 이름과 변·꼭짓점의 수를 넣어요.", "‘나는 ~과 ~을 이용하여 ~을 만들었어요. ~은 변과 꼭짓점이 ~개씩이에요.’ 꼴로 써요."], ans: "나는 오각형과 사각형을 이용하여 집 모양 스티커를 만들었어요. 오각형은 변과 꼭짓점이 5개씩이에요." }]) }) }
  ],
  challenge: { inst: "★ 도전: 더 많은 변을 가진 스티커 도안이에요. 다각형의 이름을 알아보세요.", hints: ["꼭짓점을 하나씩 짚으며 세어요.", "변이 9개이면 구각형, 10개이면 십각형이에요."],
    render: (b, a) => quiz(b, a, [
      { q: "가의 이름은?", fig: () => p6Cards([p6S(p6Blob(9, [1.5, 1.3, 1.6], 5)), p6S(p6Blob(10, [1.6, 1.25], 0))], { per: 2, cw: 220, ch: 190, maxW: "26em", shape: { dots: true } }), o: ["팔각형", "구각형", "십각형"], a: 1, why: { "0": "꼭짓점을 하나씩 짚으며 다시 세어 봐요.", "2": "꼭짓점을 하나씩 짚으며 다시 세어 봐요." } },
      { q: "나의 이름은?", o: ["팔각형", "구각형", "십각형"], a: 2, why: { "0": "꼭짓점을 하나씩 짚으며 다시 세어 봐요.", "1": "꼭짓점을 하나씩 짚으며 다시 세어 봐요." } },
      { q: "칠각형을 옳게 설명한 것은?  ㉠ 변이 6개예요.  ㉡ 꼭짓점이 7개예요.  ㉢ 굽은 선이 1개 있어요.", o: ["㉠", "㉡", "㉢"], a: 1, why: { "0": "칠각형은 변이 7개예요.", "2": "다각형에는 굽은 선이 없어요." } }], { ok: "가는 구각형, 나는 십각형이에요. 칠각형은 변과 꼭짓점이 7개씩이에요." }) }
},
{
  id: "s4", no: 4, title: "바닥 타일 고르기 ― 정다각형", soop: "개념 구축하기(O)",
  question: "변의 길이와 각의 크기에 따라 타일을 어떻게 나눌 수 있을까요? 정다각형은 어떤 다각형일까요?",
  summary: "변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형을 정다각형이라고 해요. 변의 수에 따라 정삼각형, 정사각형, 정오각형, 정육각형 …이라고 불러요. 마름모처럼 변의 길이만 같거나, 직사각형처럼 각의 크기만 같은 다각형은 정다각형이 아니에요. 비스듬히 놓여 있어도 변의 길이와 각의 크기가 모두 같으면 정다각형이에요.",
  steps: [
    { name: "만져 보기 — 변의 길이로 나누기", inst: "지아가 교실 뒤쪽 바닥에 붙일 타일 가~바를 골라 왔어요. ‘자와 각도기로 재기’를 눌러 변의 길이를 재고, 변의 길이에 따라 나누어 보세요.", hints: ["재기를 누르면 변의 길이(cm)와 각의 크기가 나타나요.", "이번에는 변의 길이만 살펴봐요."],
      render: (b, a) => p6Sort(b, a, { cats: ["변의 길이가 모두 같은 타일", "변의 길이가 모두 같지는 않은 타일"], measure: true, unit: "cm", items: P6S_TILE.map((S, i) => ({ S, cat: i === 1 ? 1 : 0, why: `${P6_KO[i]}의 변의 길이를 다시 재어 봐요.` })), ok: "변의 길이가 모두 같은 타일은 가, 다, 라, 마, 바예요." }) },
    { name: "그려 보기 — 각의 크기로 나누기", inst: "이번에는 같은 타일을 각의 크기에 따라 나누어 보세요.", hints: ["각도기로 잰 각의 크기를 살펴봐요.", "라는 각의 크기가 70°, 110°로 두 가지예요."],
      render: (b, a) => p6Sort(b, a, { cats: ["각의 크기가 모두 같은 타일", "각의 크기가 모두 같지는 않은 타일"], measure: true, unit: "cm", items: P6S_TILE.map((S, i) => ({ S, cat: i === 3 ? 1 : 0, why: `${P6_KO[i]}의 각의 크기를 다시 재어 봐요.` })), ok: "각의 크기가 모두 같은 타일은 가, 나, 다, 마, 바예요." }) },
    { name: "말해 보기 — 두 가지가 모두 같은 타일", inst: "두 번 나눈 결과를 함께 보고, 변의 길이도 모두 같고 각의 크기도 모두 같은 타일을 모두 골라 보세요.", hints: ["두 번 모두 ‘모두 같은’ 칸에 들어간 타일을 찾아요.", "나는 변의 길이가, 라는 각의 크기가 모두 같지는 않았어요."],
      render: thenWhy((b, a) => quiz(b, a, [{ q: "변의 길이가 모두 같고, 각의 크기가 모두 같은 타일을 모두 골라요.", fig: () => p6Cards(P6S_TILE, { per: 3, cw: 200, ch: 170, maxW: "36em" }), o: P6_KO.slice(0, 6), a: [0, 2, 4, 5] }], { bad: "나는 각의 크기만 같고, 라는 변의 길이만 같아요. 두 가지가 모두 같은 것을 골라요.", ok: "가, 다, 마, 바는 변의 길이도 각의 크기도 모두 같아요." }),
        { q: "라(마름모 타일)가 빠진 까닭은 무엇일까요?", ph: "왜냐하면 라는 ~", help: ["① 라의 변의 길이를 떠올려요. → ② 라의 각의 크기를 떠올려요.", "‘왜냐하면 라는 ~은 모두 같지만 ~은 모두 같지 않기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 라는 변의 길이는 모두 같지만 각의 크기가 70°와 110°로 모두 같지 않기 때문이에요." }) },
    { name: "약속하기 — 정다각형", inst: "약속: 알맞은 말을 골라 정다각형의 뜻을 완성해 보세요.", hints: ["변과 각을 함께 생각해요."],
      render: (b, a) => blanks(b, a, [{ o: ["변의 길이가 모두 같고, 각의 크기가 모두 같은", "변의 길이만 모두 같은", "각의 크기만 모두 같은"], a: 0 }, " 다각형을 정다각형이라고 해요. 변이 8개인 정다각형은 ", { o: ["정팔각형", "팔각형", "정사각형"], a: 0 }, "이에요."], { ok: "변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형을 정다각형이라고 해요." }) },
    { name: "확인하기 — 타일 가게에서", inst: "타일 가게에서 정다각형 타일을 찾고, 정팔각형 타일의 □를 구해 보세요.", hints: ["비스듬히 놓여 있어도 변의 길이와 각의 크기가 모두 같으면 정다각형이에요.", "정다각형은 변의 길이도 각의 크기도 모두 같아요."],
      render: (b, a) => p6Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "정다각형 타일을 모두 골라요.", fig: () => p6Cards(P6S_REGQ, { per: 2, cw: 380, ch: 320, maxW: "36em", shape: { measure: true, unit: "cm", fs: 19, pad: 60 } }), o: P6_KO.slice(0, 5), a: [0, 2, 4] }], { bad: "변의 길이와 각의 크기를 함께 살펴봐요. 비스듬히 놓인 타일도 다시 봐요.", ok: "가, 다, 마가 정다각형이에요. 나는 변의 길이만, 라는 각의 크기만 모두 같아요." }),
        (bx, ax) => { bx.append(p6sOctFig()); numbers(bx, ax, [{ q: "변 □", a: P6S_OCT.side, unit: "cm" }, { q: "각 □", a: P6S_OCT.ang, unit: "°" }, { q: "이 타일의 둘레", a: P6S_OCT.side * 8, unit: "cm", why: { [P6S_OCT.side * 4]: "변이 4개인 정사각형처럼 계산했어요. 정팔각형은 변이 8개예요." } }], { ok: `정다각형은 변의 길이가 모두 ${P6S_OCT.side} cm, 각의 크기가 모두 ${P6S_OCT.ang}°예요. 둘레는 ${P6S_OCT.side} × 8 = ${P6S_OCT.side * 8} cm예요.` }); }]) }
  ],
  challenge: { inst: "★ 도전: 원형 도형판에서 점과 점 사이의 간격을 살펴보며 정삼각형, 정사각형, 정육각형을 차례로 만들어 보세요.", hints: ["원형 도형판의 점은 12개예요.", "12개의 점에서 정삼각형은 4칸씩, 정사각형은 3칸씩, 정육각형은 2칸씩 같은 간격으로 건너뛰어요."],
    render: (b, a) => p6Dots(b, a, { grid: { type: "circ", n: 12, r: 170 }, tasks: [{ n: 3, reg: true, label: "정삼각형 만들기" }, { n: 4, reg: true, label: "정사각형 만들기" }, { n: 6, reg: true, label: "정육각형 만들기" }], clearEach: true, tip: "점을 차례로 눌러 고무줄을 걸고, 처음 점을 다시 눌러 닫아요.", ok: "점 사이의 간격을 똑같이 건너뛰면 정다각형을 만들 수 있어요." }) }
},
{
  id: "s5", no: 5, title: "창문 장식 접기 ― 대각선", soop: "개념 구축하기(O)",
  question: "대각선은 어떤 선분일까요? 변의 수가 많아지면 대각선의 수는 어떻게 될까요?",
  summary: "다각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분을 대각선이라고 해요. 이웃한 두 꼭짓점을 이은 선분은 변이에요. 삼각형은 세 꼭짓점이 모두 이웃해서 대각선이 없고, 사각형은 2개, 오각형은 5개, 육각형은 9개예요. 변의 수가 많아질수록 대각선도 많아져요. 직사각형과 정사각형은 두 대각선의 길이가 같고, 마름모와 정사각형은 두 대각선이 서로 수직으로 만나요.",
  steps: [
    { name: "만져 보기 — 색종이 창문 장식 접기", inst: "하린이가 정사각형 색종이로 창문 장식을 만들어요. 꼭짓점 하나를 누르고 맞출 꼭짓점을 눌러 반으로 접었다 펴요. 두 번 접어 선 2개를 만들어 보세요.", hints: ["마주 보는 꼭짓점끼리 맞추어 삼각형 모양으로 접어요.", "한 번 접은 뒤에는 다른 두 꼭짓점을 맞추어 접어요."],
      render: thenWhy((b, a) => p6Fold(b, a, { ok: "색종이에 접힌 선 2개가 생겼어요." }),
        { q: "접힌 선 2개는 어디와 어디를 이었나요?", ph: "접힌 선은 ~", help: ["① 접힌 선의 양 끝을 살펴봐요. → ② 양 끝이 어떤 꼭짓점인지 말해요.", "‘접힌 선은 서로 ~ 꼭짓점끼리 이었어요.’ 꼴로 써요."], ans: "접힌 선은 서로 마주 보는 꼭짓점끼리 이었어요. 이웃한 꼭짓점이 아니에요." }) },
    { name: "그려 보기 — 스티커에 선분 긋기", inst: "사각형 스티커 ㄱㄴㄷㄹ에 색종이처럼 서로 이웃하지 않는 두 꼭짓점을 이은 선분을 모두 그어 보세요. 꼭짓점 하나를 누르고 다른 꼭짓점을 눌러요.", hints: ["ㄱ과 이웃한 꼭짓점은 ㄴ과 ㄹ이에요.", "ㄱ과 ㄷ, ㄴ과 ㄹ을 이어요."],
      render: thenWhy((b, a) => p6Diag(b, a, { shapes: [P6S_DG[1]], ok: "선분 ㄱㄷ과 선분 ㄴㄹ을 그었어요." }),
        { q: "선분 ㄱㄴ은 왜 여기에 넣지 않을까요?", ph: "왜냐하면 ~", help: ["① 꼭짓점 ㄱ과 ㄴ이 어떻게 놓여 있는지 봐요. → ② 그 선분이 무엇인지 말해요.", "‘왜냐하면 ㄱ과 ㄴ은 ~ 꼭짓점이라서 선분 ㄱㄴ은 ~이기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 ㄱ과 ㄴ은 서로 이웃한 꼭짓점이라서 선분 ㄱㄴ은 사각형의 변이기 때문이에요." }) },
    { name: "말해 보기 — 대각선은 몇 개?", inst: "스티커 도안 네 가지에 서로 이웃하지 않는 두 꼭짓점을 이은 선분(대각선)을 모두 그어 보세요. 먼저 변의 수와 대각선의 수 사이의 규칙을 예상해요. 대각선을 그을 수 없으면 ‘대각선을 그을 수 없어요’를 눌러요.", hints: ["한 꼭짓점에서 그을 수 있는 대각선부터 차례로 그어요.", "이미 그은 대각선을 또 긋지 않게 표를 보며 세어요."],
      render: ruleFirst((b, a) => p6Diag(b, a, { shapes: P6S_DG, none: true,
        then: (box, ap) => quiz(box, ap, [{ q: "변의 수가 많아질수록 대각선의 수는 어떻게 되나요?", o: ["많아져요", "적어져요", "똑같아요"], a: 0 }, { q: "대각선을 그을 수 없는 다각형은?", o: ["삼각형", "사각형", "오각형"], a: 0, why: { "1": "사각형에는 대각선이 2개 있어요.", "2": "오각형에는 대각선이 5개 있어요." } }], { ok: `삼각형 ${P6S_DGN[0]}개, 사각형 ${P6S_DGN[1]}개, 오각형 ${P6S_DGN[2]}개, 육각형 ${P6S_DGN[3]}개로 변의 수가 많아질수록 대각선이 많아져요.` }) }),
        { q: "변의 수가 많아지면 대각선의 수는 어떻게 될까요?", ph: "내 규칙: 변의 수가 많아지면 대각선은 ~", help: ["① 사각형의 대각선 수를 떠올려요. → ② 꼭짓점이 늘면 이웃하지 않는 꼭짓점이 어떻게 될지 생각해요.", "‘변의 수가 많아지면 대각선의 수는 ~.’ 꼴로 써요."], ans: `변의 수가 많아질수록 대각선의 수도 많아져요. 삼각형 ${P6S_DGN[0]}개, 사각형 ${P6S_DGN[1]}개, 오각형 ${P6S_DGN[2]}개, 육각형 ${P6S_DGN[3]}개예요.` }) },
    { name: "약속하기 — 대각선", inst: "약속: 알맞은 말을 골라 대각선의 뜻을 완성해 보세요.", hints: ["선분 ㄱㄷ, 선분 ㄴㄹ을 떠올려요."],
      render: (b, a) => blanks(b, a, ["다각형에서 선분 ㄱㄷ, 선분 ㄴㄹ과 같이 서로 ", { o: ["이웃하지 않는", "이웃한"], a: 0 }, " 두 꼭짓점을 이은 선분을 ", { o: ["대각선", "변", "수선"], a: 0 }, "이라고 해요. 그래서 대각선은 꼭 ", { o: ["꼭짓점과 꼭짓점", "변 위의 아무 점"], a: 0 }, "을 이어요."], { ok: "서로 이웃하지 않는 두 꼭짓점을 이은 선분을 대각선이라고 해요." }) },
    { name: "확인하기 — 게시판 끈 매기", inst: "민재가 사각형 게시판 네 가지의 대각선을 따라 장식 끈을 매요. 대각선을 긋고 ‘자와 각도기로 재기’로 두 대각선의 길이와 만나는 각을 살펴보세요.", hints: ["대각선을 모두 그으면 길이와 각이 저절로 보여요.", "두 대각선의 길이가 같은지, 90°로 만나는지 표를 보고 비교해요."],
      render: (b, a) => p6Diag(b, a, { shapes: P6S_QD,
        then: (box, ap) => quiz(box, ap, [
          { q: "두 대각선의 길이가 같은 사각형을 모두 골라요.", o: ["평행사변형", "마름모", "직사각형", "정사각형"], a: P6S_QPROP.map((x, i) => x.eq ? i : -1).filter(i => i >= 0) },
          { q: "두 대각선이 서로 수직으로 만나는 사각형을 모두 골라요.", o: ["평행사변형", "마름모", "직사각형", "정사각형"], a: P6S_QPROP.map((x, i) => x.perp ? i : -1).filter(i => i >= 0) }],
          { bad: "표에서 두 대각선의 길이와 만나는 각을 다시 살펴봐요.", ok: "직사각형과 정사각형은 두 대각선의 길이가 같고, 마름모와 정사각형은 두 대각선이 수직으로 만나요. 정사각형은 두 가지가 모두 맞아요." }) }) }
  ],
  challenge: { inst: "★ 도전: 디자인단 친구들의 말을 살펴보세요.", hints: ["삼각형의 세 꼭짓점은 모두 서로 이웃해요.", "대각선의 수를 세어 차례를 정해요."],
    render: (b, a) => quiz(b, a, [
      { q: "잘못 말한 친구는?  서윤: “오각형의 한 꼭짓점에서 대각선을 2개 그을 수 있어.”  도현: “삼각형에도 대각선이 1개 있어.”  지아: “사각형의 대각선은 2개야.”", o: ["서윤", "도현", "지아"], a: 1, why: { "0": "오각형의 한 꼭짓점에는 이웃하지 않는 꼭짓점이 2개 있어요.", "2": "사각형의 대각선은 2개가 맞아요." } },
      { q: "대각선이 많은 것부터 차례로 놓은 것은?", o: ["육각형, 오각형, 사각형", "사각형, 오각형, 육각형", "오각형, 육각형, 사각형"], a: 0 }], { ok: `도현이가 잘못 말했어요. 대각선은 육각형 ${P6S_DGN[3]}개, 오각형 ${P6S_DGN[2]}개, 사각형 ${P6S_DGN[1]}개예요.` }) }
},
{
  id: "s6", no: 6, title: "게시판 작품 만들기 ― 모양 조각", soop: "개념 구축하기(O)",
  question: "모양 조각으로 여러 가지 모양을 만들려면 어떻게 해야 할까요?",
  summary: "모양 조각은 정삼각형, 정사각형, 평행사변형, 사다리꼴, 마름모, 정육각형이에요. 길이가 같은 변끼리 이어 붙이고, 서로 겹치지 않게 놓아요. 같은 조각을 여러 번 써도 되고, 돌리거나 뒤집어 써도 돼요. 칠교 조각 몇 개로도 삼각형, 사각형, 오각형 같은 다각형을 만들 수 있어요.",
  steps: [
    { name: "만져 보기 — 모양 조각 살펴보기", inst: "윤 선생님이 게시판 작품에 쓸 모양 조각 상자를 가져오셨어요. 조각을 하나씩 눌러 이름과 특징을 살펴보세요.", hints: ["조각마다 변과 꼭짓점을 세어 봐요.", "변의 길이를 견주어 봐요."],
      render: thenWhy((b, a) => p6Explore(b, a, { ok: "모양 조각 6가지를 모두 살펴보았어요." }),
        { q: "모양 조각끼리 빈틈없이 잘 맞는 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 조각들의 변의 길이를 견주어요. → ② 다른 것이 하나 있다면 무엇인지 말해요.", "‘왜냐하면 사다리꼴의 긴 변을 빼면 ~이기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 사다리꼴의 긴 변 하나를 빼면 모든 조각의 변의 길이가 같아서 변끼리 딱 맞게 이어 붙일 수 있기 때문이에요." }) },
    { name: "그려 보기 — 작품에 쓴 조각 찾기", inst: "서윤이가 게시판에 붙인 작품 ‘트리’와 ‘별 장식’이에요. 각 작품에 쓴 모양 조각을 모두 골라 보세요.", hints: ["조각의 변의 수와 모양을 살펴봐요.", "같은 조각을 여러 번 쓴 곳도 있어요."],
      render: (b, a) => { b.append(p6sBoardFig()); quiz(b, a, [
        { q: "트리에 쓴 조각을 모두 골라요.", o: P6_PBN, a: [0, 1, 3] },
        { q: "별 장식에 쓴 조각을 모두 골라요.", o: P6_PBN, a: [0, 5] }], { bad: "작품의 조각을 하나씩 짚으며 변을 세어 봐요.", ok: "트리는 정삼각형, 정사각형, 사다리꼴로, 별 장식은 정육각형과 정삼각형 6개로 만들었어요." }); } },
    { name: "말해 보기 — 별 장식 똑같이 만들기", inst: "서윤이의 별 장식과 같은 모양을 만들어 보세요. 점선 안을 조각으로 빈틈없이 채우면 저절로 확인해요.", hints: ["가운데에 정육각형을 놓고, 정육각형의 변마다 정삼각형을 붙여요.", "살짝 누르면 조각이 30°씩 돌아가요."],
      render: thenWhy((b, a) => p6Pieces(b, a, { tasks: [{ type: "fill", targets: [P6S_STAR.outline], label: "별 장식 만들기" }], ok: "별 장식과 같은 모양을 만들었어요." }),
        { q: "별 장식을 어떤 방법으로 만들었나요?", ph: "~을 놓고 ~", help: ["① 어떤 조각을 먼저 놓았는지 떠올려요. → ② 조각끼리 어떻게 붙였는지 말해요.", "‘~을 가운데 놓고, ~에 ~을 이어 붙였어요.’ 꼴로 써요."], ans: "정육각형을 가운데 놓고, 정육각형의 여섯 변에 정삼각형을 하나씩 길이가 같은 변끼리 이어 붙였어요." }) },
    { name: "약속하기 — 모양 만들기 방법", inst: "모양 조각으로 모양을 만드는 방법을 정리해 보세요.", hints: ["조각을 어떻게 이어 붙였는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["모양 조각은 ", { o: ["길이가 같은 변끼리", "꼭짓점 한 점끼리만"], a: 0 }, " 이어 붙이고, 서로 ", { o: ["겹치지 않게", "겹치게"], a: 0 }, " 놓아요. 같은 조각을 여러 번 ", { o: ["써도 돼요", "쓰면 안 돼요"], a: 0 }, ". 조각을 돌리거나 뒤집어서 ", { o: ["써도 돼요", "쓰면 안 돼요"], a: 0 }, "."], { ok: "변끼리 이어 붙이고, 겹치지 않게, 같은 조각을 여러 번, 돌리거나 뒤집어 써도 돼요." }) },
    { name: "확인하기 — 칠교 조각으로 다각형", inst: "도현이가 칠교 조각으로 게시판 테두리 장식을 만들어요. 조각 3개로 다각형 하나, 조각 4개로 다각형 하나를 만들고 이름을 골라 보세요.", hints: ["작은 삼각형 2개를 붙이면 정사각형·삼각형·평행사변형이 돼요.", "조각들이 변과 변으로 이어져 한 도형이 되면 저절로 확인해요."],
      render: (b, a) => p6Pieces(b, a, { set: "tg", tasks: [{ type: "make", count: 3, nameIt: true, label: "칠교 조각 3개로 다각형 만들기" }, { type: "make", count: 4, nameIt: true, label: "칠교 조각 4개로 다각형 만들기" }], ok: "칠교 조각으로 다각형을 만들고 이름을 붙였어요." }) }
  ],
  challenge: { inst: "★ 도전: 모양 조각 2가지를 써서 평행사변형 모양 게시판 띠를 만들어 보세요. (같은 조각을 여러 번 써도 돼요.)", hints: ["정삼각형 2개를 붙이면 무엇이 될까요?", "사다리꼴과 정삼각형을 이어 보아요."],
    render: (b, a) => p6Pieces(b, a, { kinds: ["tri", "sq", "par", "trap", "rh"], tasks: [{ type: "make", isA: "평행사변형", kinds: 2, min: 2, label: "2가지 조각으로 평행사변형 만들기" }], ok: "2가지 조각으로 평행사변형을 만들었어요." }) }
},
{
  id: "s7", no: 7, title: "현수막 무늬 채우기 ― 모양 채우기", soop: "개념 구축하기(O)",
  question: "주어진 모양을 모양 조각으로 빈틈없이 채우는 방법은 몇 가지나 될까요?",
  summary: "모양 채우기는 모양 조각을 겹치지 않게, 빈틈없이 이어 붙여 주어진 모양을 덮는 것이에요. 정육각형 하나는 정삼각형 6개, 평행사변형 3개, 사다리꼴 2개, 정육각형 1개로 채울 수 있고, 두 가지 조각을 섞어 채울 수도 있어요. 한 모양을 여러 가지 방법으로 채울 수 있어요.",
  steps: [
    { name: "만져 보기 — 정육각형 무늬 채우기", inst: "우리 반 현수막에 정육각형 무늬를 넣어요. 먼저 정육각형을 정삼각형만으로 채우려면 몇 개가 필요할지 예상하고, 정육각형을 채워 보세요.", hints: ["한 가지 조각만 쓸 때는 정삼각형, 평행사변형, 사다리꼴 중 하나를 골라요.", "두 가지 조각을 쓸 때는 사다리꼴과 정삼각형, 평행사변형과 정삼각형처럼 섞어요."],
      render: ruleFirst((b, a) => p6Pieces(b, a, { tasks: [
        { type: "fill", targets: [P6S_HEX1], kinds: 1, diff: true, group: "one", label: "한 가지 조각만으로 채우기 ①" },
        { type: "fill", targets: [P6S_HEX1], kinds: 1, diff: true, group: "one", label: "다른 한 가지 조각만으로 채우기 ②" },
        { type: "fill", targets: [P6S_HEX1], kinds: 2, label: "두 가지 조각으로 채우기" }], ok: "정육각형을 여러 가지 방법으로 채웠어요." }),
        { q: "정육각형 하나를 정삼각형만으로 채우려면 몇 개가 필요할까요?", ph: "내 예상: 정삼각형 ~개", help: ["① 정육각형의 가운데에서 꼭짓점까지 선을 그었다고 생각해요. → ② 생긴 삼각형을 세어요.", "‘정삼각형 ~개가 필요할 것 같아요.’ 꼴로 써요."], ans: "정삼각형 6개가 필요해요. 평행사변형으로는 3개, 사다리꼴로는 2개로 채울 수 있어요." }) },
    { name: "그려 보기 — 정육각형 2개를 붙인 무늬", inst: "도현이는 정육각형 2개를 붙인 무늬를 사다리꼴만으로 채우려고 해요. 사다리꼴로 빈틈없이 채운 다음, 다른 조각이면 몇 개가 필요한지 구해 보세요.", hints: ["정육각형 하나는 사다리꼴 2개로 채울 수 있어요.", "정육각형 하나에 정삼각형 6개, 평행사변형 3개가 들어가요."],
      render: (b, a) => p6Pieces(b, a, { kinds: ["tri", "par", "trap", "hex"], tasks: [{ type: "fill", targets: P6S_HEX2, only: ["trap"], label: "사다리꼴만으로 채우기" }],
        then: (box, ap) => numbers(box, ap, [
          { q: "사다리꼴은 몇 개 썼나요?", a: 2 * P6S_AREA.hex / P6S_AREA.trap, unit: "개" },
          { q: "정삼각형만으로 채우면 몇 개?", a: 2 * P6S_AREA.hex / P6S_AREA.tri, unit: "개", why: { "6": "정육각형 하나에 6개예요. 정육각형이 2개예요." } },
          { q: "평행사변형만으로 채우면 몇 개?", a: 2 * P6S_AREA.hex / P6S_AREA.par, unit: "개", why: { "3": "정육각형 하나에 3개예요. 정육각형이 2개예요." } }], { ok: `사다리꼴 ${2 * P6S_AREA.hex / P6S_AREA.trap}개, 정삼각형 ${2 * P6S_AREA.hex / P6S_AREA.tri}개, 평행사변형 ${2 * P6S_AREA.hex / P6S_AREA.par}개가 필요해요.` }) }) },
    { name: "말해 보기 — 현수막 띠를 다른 방법으로", inst: "준우는 현수막 띠를 사다리꼴 1개와 평행사변형 2개로 채웠어요. 준우와 다른 방법으로 현수막 띠를 채워 보세요.", hints: ["정삼각형을 섞어 보아요.", "사다리꼴 1개 + 정삼각형 4개, 정삼각형 7개처럼 여러 방법이 있어요."],
      render: thenWhy((b, a) => { b.append(p6sBandFig()); p6Pieces(b, a, { kinds: ["tri", "par", "trap", "rh", "sq"], tasks: [{ type: "fill", targets: [P6S_BAND], not: "par,par,trap", label: "준우와 다른 방법으로 채우기" }], ok: "준우와 다른 방법으로 현수막 띠를 채웠어요." }); },
        { q: "내가 채운 방법을 준우의 방법과 견주어 말해 보세요.", ph: "준우는 ~, 나는 ~", help: ["① 내가 쓴 조각과 개수를 세어요. → ② 준우와 무엇이 다른지 말해요.", "‘준우는 ~으로 채웠고, 나는 ~으로 채웠어요.’ 꼴로 써요."], ans: "준우는 사다리꼴 1개와 평행사변형 2개로 채웠고, 나는 사다리꼴 1개와 정삼각형 4개로 채웠어요. 같은 모양도 여러 방법으로 채울 수 있어요." }) },
    { name: "약속하기 — 모양 채우기", inst: "모양 채우기를 할 때 지킬 것을 정리해 보세요.", hints: ["채운 조각 사이에 빈 곳이 있으면 안 돼요."],
      render: (b, a) => blanks(b, a, ["모양을 채울 때는 모양 조각을 서로 ", { o: ["겹치지 않게", "겹치게"], a: 0 }, ", ", { o: ["빈틈없이", "빈틈이 있게"], a: 0 }, " 이어 붙여요. 한 모양을 ", { o: ["여러 가지 방법으로", "한 가지 방법으로만"], a: 0 }, " 채울 수 있어요. 정사각형 조각은 각이 90°라서 정육각형을 채우는 데 ", { o: ["쓸 수 없어요", "꼭 써야 해요"], a: 0 }, "."], { ok: "겹치지 않게, 빈틈없이, 여러 가지 방법으로 채울 수 있어요." }) },
    { name: "확인하기 — 벌집 엽서 꾸미기", inst: "지아는 전학 간 친구에게 보낼 벌집 엽서를 꾸며요. 큰 정육각형을 모양 조각 3가지 이상으로 빈틈없이 채우고 엽서를 써 보세요.", hints: ["가운데에 정육각형을 놓고 둘레에 사다리꼴을 놓아 보아요.", "사다리꼴 하나를 평행사변형과 정삼각형으로 바꾸면 3가지가 돼요."],
      render: (b, a) => p6Pieces(b, a, { tasks: [{ type: "fill", targets: [P6S_BIGHEX], minKinds: 3, label: "큰 정육각형을 3가지 이상 조각으로 채우기" }],
        then: (box, ap, res) => writeStep(box, ap, [{ q: `엽서에 채운 방법이 들어가게 편지를 써 보세요. (쓴 조각: ${res[0].say})`, tag: "엽서", ph: "~에게, 이 엽서는 ~을 사용하여 ~", help: ["① 받을 친구 이름을 써요. → ② 쓴 조각의 이름과 채운 방법을 넣어요.", "‘이 엽서는 ~, ~, ~을 사용하여 ~ 모양을 겹치지 않게 빈틈없이 채운 거야.’ 꼴로 써요."], ans: "수아에게, 이 엽서는 정육각형, 사다리꼴, 평행사변형, 정삼각형을 사용하여 큰 정육각형 벌집을 겹치지 않게 빈틈없이 채운 거야. 우리 반이 그리울 때 꺼내 봐. 지아가" }]) }) }
  ],
  challenge: { inst: "★ 도전: 정육각형 3개를 이어 붙인 현수막 무늬를 한 가지 조각만으로 채우려고 해요. 필요한 조각의 수를 구해 보세요.", hints: ["정육각형 하나에 정삼각형 6개, 평행사변형 3개, 사다리꼴 2개가 들어가요.", "정육각형이 3개이니 3배를 해요."],
    render: (b, a) => numbers(b, a, [
      { q: "정삼각형만으로", a: 3 * P6S_AREA.hex / P6S_AREA.tri, unit: "개", why: { "6": "정육각형 하나만 채웠어요. 3개를 채워야 해요." } },
      { q: "평행사변형만으로", a: 3 * P6S_AREA.hex / P6S_AREA.par, unit: "개", why: { "3": "정육각형 하나만 채웠어요. 3개를 채워야 해요." } },
      { q: "사다리꼴만으로", a: 3 * P6S_AREA.hex / P6S_AREA.trap, unit: "개", why: { "2": "정육각형 하나만 채웠어요. 3개를 채워야 해요." } }], { ok: `정삼각형 ${3 * P6S_AREA.hex / P6S_AREA.tri}개, 평행사변형 ${3 * P6S_AREA.hex / P6S_AREA.par}개, 사다리꼴 ${3 * P6S_AREA.hex / P6S_AREA.trap}개예요.` }) }
},
{
  id: "s8", no: 8, title: "태블릿으로 문패 디자인 ― 탐구 정리", soop: "탐구 정리하기(O)",
  question: "다각형, 정다각형, 대각선에 대해 알게 된 것을 어떻게 정리하고 쓸 수 있을까요?",
  summary: "공학 도구의 ‘다각형’ 도구는 꼭짓점을 차례로 고르고 처음 꼭짓점을 다시 골라 다각형을 만들고, ‘정다각형 : 한 변’ 도구는 한 변과 꼭짓점의 수를 정하면 정다각형을 만들어요. 다각형은 선분으로만 둘러싸인 도형, 정다각형은 변의 길이와 각의 크기가 모두 같은 다각형, 대각선은 서로 이웃하지 않는 두 꼭짓점을 이은 선분이에요.",
  steps: [
    { name: "만져 보기 — 공학 도구로 다각형 만들기", inst: "준우가 태블릿으로 교실 문패를 디자인해요. 공학 도구로 삼각형, 직사각형, 마름모, 정육각형을 하나씩 만들어 보세요.", hints: ["‘다각형’: 꼭짓점을 차례대로 누르고 마지막에 처음 꼭짓점을 다시 눌러요.", "‘정다각형 : 한 변’: 두 점을 눌러 한 변을 정하고 꼭짓점의 수를 써요."],
      render: thenWhy((b, a) => p6Tool(b, a, { targets: ["삼각형", "직사각형", "마름모", "정육각형"], ok: "공학 도구로 주어진 다각형을 모두 만들었어요." }),
        { q: "정육각형은 어떻게 만들었나요?", ph: "~ 도구에서 ~", help: ["① 쓴 도구 이름을 떠올려요. → ② 한 변과 꼭짓점의 수를 어떻게 정했는지 말해요.", "‘~ 도구에서 두 점으로 한 변을 정하고 꼭짓점의 수에 ~을 썼어요.’ 꼴로 써요."], ans: "‘정다각형 : 한 변’ 도구에서 두 점으로 한 변을 정하고 꼭짓점의 수에 6을 썼어요." }) },
    { name: "그려 보기 — 나만의 문패 디자인", inst: "공학 도구로 다각형을 3개 이상 만들어 나만의 교실 문패를 디자인해 보세요. ‘복제’로 같은 도형을 여러 개 만들 수 있어요. 다 만들었으면 ‘다 만들었어요’를 눌러요.", hints: ["‘옮기기’에서 도형을 눌러 고르고 끌어 옮겨요.", "정다각형과 여러 가지 다각형을 섞어 보아요."],
      render: (b, a) => p6Tool(b, a, { free: { min: 3 },
        then: (box, ap, polys) => writeStep(box, ap, [{ q: `문패 디자인을 친구들에게 설명해 보세요. (만든 도형: ${polys.map(p => p.name).join(", ")})`, tag: "문패 설명", ph: "예) 나는 ~과 ~을 사용하여 ~ 모양 문패를 만들었어요.", help: ["① 문패가 무슨 모양인지 말해요. → ② 쓴 다각형의 이름을 넣어요.", "‘나는 ~과 ~을 사용하여 ~ 모양 문패를 만들었어요.’ 꼴로 써요."], ans: "나는 정육각형과 사다리꼴, 정사각형을 사용하여 벌집 모양 문패를 만들었어요. 정육각형은 복제해서 3개를 이어 붙였어요." }]) }) },
    { name: "말해 보기 — 맞는 말, 틀린 말", inst: "디자인단 친구들이 단원에서 배운 것을 말했어요. 옳은 말인지 골라 보세요.", hints: ["정다각형은 변과 각을 함께 생각해요.", "대각선은 꼭짓점끼리 이은 선분이에요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "하린: “마름모는 네 변의 길이가 같으니까 정다각형이야.”", o: ["옳아요", "옳지 않아요"], a: 1, why: { "0": "마름모는 각의 크기가 모두 같지는 않아요." } },
        { q: "도현: “움푹 들어간 번개 모양도 선분으로만 둘러싸여 있으면 다각형이야.”", o: ["옳아요", "옳지 않아요"], a: 0, why: { "1": "선분으로만 둘러싸여 있으면 움푹 들어가도 다각형이에요." } },
        { q: "민재: “도형을 가로지르는 선분은 모두 대각선이야.”", o: ["옳아요", "옳지 않아요"], a: 1, why: { "0": "대각선은 서로 이웃하지 않는 두 꼭짓점을 이은 선분이에요." } }], { ok: "하린이와 민재의 말이 옳지 않아요." }),
        { q: "하린이의 말을 바르게 고쳐 써 보세요.", ph: "마름모는 ~", help: ["① 정다각형의 두 가지 조건을 떠올려요. → ② 마름모가 어느 조건을 만족하지 않는지 말해요.", "‘마름모는 ~은 같지만 ~이 모두 같지 않아서 정다각형이 아니야.’ 꼴로 써요."], ans: "마름모는 네 변의 길이는 같지만 네 각의 크기가 모두 같지 않아서 정다각형이 아니야." }) },
    { name: "약속하기 — 세 가지 약속 정리", inst: "이 단원의 세 가지 약속을 정리해 보세요.", hints: ["다각형, 정다각형, 대각선의 뜻을 떠올려요."],
      render: (b, a) => blanks(b, a, ["선분으로만 둘러싸인 도형은 ", { o: ["다각형", "정다각형", "대각선"], a: 0 }, ", 변의 길이가 모두 같고 각의 크기가 모두 같은 다각형은 ", { o: ["다각형", "정다각형", "대각선"], a: 1 }, ", 다각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분은 ", { o: ["다각형", "정다각형", "대각선"], a: 2 }, "이에요."], { ok: "다각형, 정다각형, 대각선의 약속을 정리했어요." }) },
    { name: "확인하기 — 문패 디자인 점검", inst: "준우가 만든 문패의 도형을 점검해요. □ 안에 알맞은 수를 써 보세요.", hints: ["다각형은 변의 수와 꼭짓점의 수가 같아요.", "정다각형의 둘레는 한 변의 길이를 변의 수만큼 더해요."],
      render: (b, a) => numbers(b, a, [
        { q: "칠각형의 꼭짓점의 수", a: 7, unit: "개" },
        { q: "사각형에 그을 수 있는 대각선의 수", a: P6S_DGN[1], unit: "개", why: { "4": "변은 대각선이 아니에요. 이웃하지 않는 꼭짓점끼리만 이어요.", "1": "대각선을 빠짐없이 그어 봐요. 사각형에는 두 쌍의 마주 보는 꼭짓점이 있어요." } },
        { q: "한 변이 6 cm인 정오각형의 둘레", a: 6 * 5, unit: "cm", why: { "6": "변이 5개예요. 6 cm를 5번 더해요.", "24": "정오각형은 변이 5개예요." } }], { ok: `칠각형의 꼭짓점은 7개, 사각형의 대각선은 ${P6S_DGN[1]}개, 정오각형의 둘레는 6 × 5 = ${6 * 5} cm예요.` }) }
  ],
  challenge: { inst: "★ 도전: 설명하는 도형의 이름을 골라 보세요.  • 각의 크기가 모두 같아요.  • 길이가 같은 선분 10개로 둘러싸여 있어요.", hints: ["변의 수가 이름이 돼요.", "변의 길이와 각의 크기가 모두 같으면 이름 앞에 ‘정’을 붙여요."],
    render: (b, a) => quiz(b, a, [{ q: "도형의 이름은?", o: ["십각형", "정십각형", "정구각형"], a: 1, why: { "0": "변의 길이와 각의 크기가 모두 같아요. 이름 앞에 ‘정’을 붙여요.", "2": "선분이 10개예요." } }], { ok: "변의 길이와 각의 크기가 모두 같고 변이 10개이므로 정십각형이에요." }) }
},
{
  id: "s9", no: 9, title: "로봇 마스코트 색칠 놀이", soop: "발표하기(P)",
  question: "주사위 눈의 수에 맞는 다각형을 빠르고 정확하게 찾으려면 어떻게 해야 할까요?",
  summary: "우리 반 로봇 마스코트 그림은 삼각형부터 팔각형까지 여러 다각형으로 이루어져 있어요. 주사위 눈 1은 삼각형, 2는 사각형, 3은 오각형, 4는 육각형, 5는 칠각형, 6은 팔각형이에요. 변을 한 방향으로 빠짐없이 세면 알맞은 다각형을 찾을 수 있어요.",
  steps: [
    { name: "만져 보기 — 놀이 규칙 익히기", inst: "윤 선생님이 로봇 마스코트 색칠 놀이 규칙을 알려 주셨어요. 표를 보고 물음에 답해 보세요.", hints: ["눈의 수에 2를 더하면 변의 수가 돼요.", "눈 1은 삼각형이에요."],
      render: thenWhy((b, a) => { b.append(p6Tbl(["눈의 수", "1", "2", "3", "4", "5", "6"], [["다각형", "삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형"]]));
        quiz(b, a, [
          { q: "주사위 눈 3이 나오면 무엇을 칠할까요?", o: ["삼각형", "오각형", "육각형"], a: 1, why: { "0": "눈 1이 삼각형이에요.", "2": "눈 4가 육각형이에요." } },
          { q: "주사위 눈 5가 나오면 무엇을 칠할까요?", o: ["오각형", "칠각형", "팔각형"], a: 1, why: { "0": "눈 3이 오각형이에요.", "2": "눈 6이 팔각형이에요." } }], { ok: "눈 3은 오각형, 눈 5는 칠각형이에요." }); },
        { q: "눈의 수와 다각형의 변의 수 사이에는 어떤 관계가 있나요?", ph: "변의 수는 눈의 수보다 ~", help: ["① 눈 1과 삼각형, 눈 2와 사각형을 견주어요. → ② 늘 몇만큼 차이 나는지 찾아요.", "‘변의 수는 눈의 수보다 ~ 커요.’ 꼴로 써요."], ans: "변의 수는 눈의 수보다 2만큼 커요. 그래서 눈 6은 변이 8개인 팔각형이에요." }) },
    { name: "그려 보기 — 로봇 마스코트 색칠 놀이", inst: "짝과 번갈아 주사위를 굴려 나온 눈에 맞는 다각형을 찾아 칠해요. 찾을 다각형이 없으면 ‘칠할 다각형이 없어요’를 눌러 차례를 넘겨요. 그림을 모두 칠하면 끝나요.", hints: ["변을 한 방향으로 돌며 세어요.", "눈과 입, 손처럼 작은 다각형도 잊지 말아요."],
      render: (b, a) => p6sGame(b, a, { regions: P6S_ROBOT, W: 440, H: 570, view: "0 0 440 570", ok: "로봇 마스코트를 모두 칠했어요!" }) },
    { name: "말해 보기 — 우리 짝의 작전", inst: "놀이를 하며 알게 된 것을 이야기해 보세요.", hints: ["변을 셀 때 실수하지 않는 방법을 떠올려요.", "칠할 다각형이 남아 있는데 넘기면 안 돼요."],
      render: (b, a) => { quiz(b, a, [{ q: "로봇 그림에서 팔각형은 어디일까요?", o: ["머리", "몸통", "가슴판"], a: 1, why: { "0": "머리는 변이 6개인 육각형이에요.", "2": "가슴판은 변이 7개인 칠각형이에요." } }], { ok: "몸통은 변이 8개인 팔각형이에요." });
        writeStep(b, a, [{ q: "다각형을 빠르고 정확하게 찾는 우리 짝의 작전을 써 보세요.", tag: "짝의 작전", ph: "예) 주사위를 굴리면 먼저 ~", help: ["① 눈의 수를 다각형 이름으로 바꾸는 방법을 정해요. → ② 변을 세는 방법을 정해요.", "‘주사위를 굴리면 먼저 ~을 생각하고, 변은 ~ 세요.’ 꼴로 써요."], ans: "주사위를 굴리면 먼저 눈의 수에 2를 더해 변의 수를 생각하고, 변은 한 변에 손가락을 대고 한 방향으로 돌며 세요." }]); } }
  ],
  challenge: { inst: "★ 도전: 로봇 그림에 있는 다각형의 수를 세어 보세요.", hints: ["오른쪽과 왼쪽이 똑같이 생겼어요.", "눈 2개, 다리 2개가 오각형이에요."],
    render: (b, a) => numbers(b, a, [
      { q: "오각형은 모두 몇 개?", a: P6S_ROBOT.filter(r => p6Clean(r.pts).length === 5).length, unit: "개", why: { "2": "눈만 세었어요. 다리도 변이 5개예요." } },
      { q: "삼각형은 모두 몇 개?", a: P6S_ROBOT.filter(r => p6Clean(r.pts).length === 3).length, unit: "개", why: { "2": "손 2개만 세었어요. 안테나 끝도 삼각형이에요." } }], { ok: `오각형은 ${P6S_ROBOT.filter(r => p6Clean(r.pts).length === 5).length}개, 삼각형은 ${P6S_ROBOT.filter(r => p6Clean(r.pts).length === 3).length}개예요.` }) }
},
{
  id: "s10", no: 10, title: "우리 반 교실 꾸미기 발표회", soop: "발표하기(P)",
  question: "교실을 꾸미며 알게 된 다각형 이야기를 어떻게 발표할까요?",
  summary: "선분으로만 둘러싸인 도형은 다각형이고, 변의 수에 따라 이름을 붙여요. 변의 길이와 각의 크기가 모두 같은 다각형은 정다각형이에요. 대각선은 서로 이웃하지 않는 두 꼭짓점을 이은 선분이고, 정오각형에는 5개가 있어요. 모양 조각으로 모양을 만들고 빈틈없이 채워 교실을 꾸몄어요.",
  steps: [
    { name: "만져 보기 — 디자인 심사", inst: "발표회 첫 순서는 디자인 심사예요. 도안 가~마에서 다각형을 찾고 이름을 붙여 보세요.", hints: ["선분으로만 둘러싸이고 닫혀 있어야 다각형이에요.", "꼭짓점을 짚으며 변을 세어요."],
      render: (b, a) => p6Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "다각형을 모두 골라요.", fig: () => p6Cards(P6S_FINAL, { per: 3, cw: 200, ch: 170, maxW: "36em", shape: { dots: true } }), o: P6_KO.slice(0, 5), a: [0, 1, 3] }], { bad: "굽은 선이 있거나 열려 있는 도안은 다각형이 아니에요.", ok: "가, 나, 라가 다각형이에요." }),
        (bx, ax) => blanks(bx, ax, ["가: ", { o: P6_NAMES6, a: 4 }, " / 나: ", { o: P6_NAMES6, a: 2 }, " / 라: ", { o: P6_NAMES6, a: 5 }], { ok: "가는 칠각형, 나는 오각형, 라는 팔각형이에요." })]) },
    { name: "그려 보기 — 정다각형 타일 그리기", inst: "삼각 점 종이에 정삼각형과 정육각형 타일을 그려 보세요.", hints: ["점과 점 사이의 간격이 같도록 변을 그려요.", "정육각형은 정삼각형 6개를 모은 모양이에요."],
      render: thenWhy((b, a) => p6Dots(b, a, { grid: { type: "tri", cols: 9, rows: 6, gap: 60 }, tasks: [{ n: 3, reg: true, label: "정삼각형 그리기" }, { n: 6, reg: true, label: "정육각형 그리기" }], clearEach: true, ok: "정삼각형과 정육각형을 그렸어요." }),
        { q: "내가 그린 육각형이 정육각형인지 어떻게 알 수 있나요?", ph: "~이 모두 같고 ~", help: ["① 여섯 변의 길이를 견주어요. → ② 여섯 각의 크기를 견주어요.", "‘여섯 변의 길이가 ~, 여섯 각의 크기도 ~ 정육각형이에요.’ 꼴로 써요."], ans: "여섯 변의 길이가 모두 같고 여섯 각의 크기도 모두 같아서 정육각형이에요." }) },
    { name: "말해 보기 — 수수께끼 문패", inst: "서윤: “변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형이야.” 하린: “변이 6개이고, 한 변의 길이는 5 cm야.” 두 친구가 설명하는 문패를 알아맞혀 보세요.", hints: ["정다각형이면서 변이 6개예요.", "모든 변의 길이의 합은 5 cm를 6번 더해요."],
      render: thenWhy((b, a) => { blanks(b, a, ["두 친구가 설명하는 도형은 ", { o: ["육각형", "정육각형", "정오각형"], a: 1 }, "이에요."], { ok: "정다각형이면서 변이 6개이므로 정육각형이에요." });
        numbers(b, a, [{ q: "모든 변의 길이의 합", a: 5 * 6, unit: "cm", why: { "11": "5와 6을 더했어요. 5 cm인 변이 6개예요.", "25": "변이 6개예요. 5 cm를 6번 더해요." } }], { ok: `5 + 5 + 5 + 5 + 5 + 5 = 5 × 6 = ${5 * 6} cm예요.` }); },
        { q: "모든 변의 길이의 합을 어떻게 구했나요?", ph: "정육각형은 ~이므로 ~", help: ["① 정다각형의 변의 길이가 어떤지 떠올려요. → ② 식을 세워요.", "‘정육각형은 변의 길이가 모두 같으므로 ~ × ~ = ~ cm예요.’ 꼴로 써요."], ans: "정육각형은 여섯 변의 길이가 모두 5 cm로 같으므로 5 × 6 = 30(cm)예요." }) },
    { name: "약속하기 — 정오각형 창문의 대각선", inst: "발표회 무대 뒤 정오각형 창문에 대각선을 따라 반짝이 줄을 달아요. 대각선을 모두 그어 보세요.", hints: ["한 꼭짓점에서 대각선을 2개씩 그을 수 있어요.", "이미 그은 대각선을 또 세지 않아요."],
      render: (b, a) => p6Diag(b, a, { shapes: [{ pts: p6Reg(5, 2), label: "정오각형 창문" }],
        then: (box, ap) => blanks(box, ap, ["정오각형의 대각선은 모두 ", { o: ["5개", "10개", "2개"], a: 0 }, "이고, 대각선을 모두 그으면 가운데에 ", { o: ["별", "원"], a: 0 }, " 모양이 나타나요."], { ok: "정오각형의 대각선은 5개이고, 가운데에 별 모양이 나타나요." }) }) },
    { name: "확인하기 — 교실 꾸미기 발표", inst: "1차시에 궁금했던 것을 다시 보고, 우리 반 교실 꾸미기를 소개하는 발표문을 써 보세요.", hints: ["꾸민 것 하나를 골라 다각형의 이름과 성질을 넣어요.", "궁금했던 것 중 이제 답할 수 있는 것을 골라요."],
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "우리 반 교실 꾸미기에서 한 가지를 골라 소개해 보세요.", tag: "꾸미기 소개", ph: "예) 우리 반 바닥 타일은 ~", help: ["① 소개할 장식을 골라요. → ② 다각형의 이름, 정다각형인지, 쓴 방법을 넣어요.", "‘우리 반 ~은 ~이에요. 왜냐하면 ~. 그래서 ~했어요.’ 꼴로 써요."], ans: "우리 반 바닥 타일은 정육각형이에요. 왜냐하면 여섯 변의 길이와 여섯 각의 크기가 모두 같기 때문이에요. 그래서 빈틈없이 이어 붙일 수 있었어요." },
        { q: "1차시에 궁금했던 것 하나에 답해 보세요.", tag: "궁금증 풀기", ph: "예) ~이 궁금했는데 ~", help: ["① 위에 보이는 궁금했던 것 중 하나를 골라요. → ② 이 단원에서 알게 된 것으로 답해요.", "‘~이 궁금했는데, ~라는 것을 알게 되었어요.’ 꼴로 써요."], ans: "변이 6개인 타일은 무엇이라고 부르는지 궁금했는데, 변이 6개인 다각형은 육각형이고 변의 길이와 각의 크기가 모두 같으면 정육각형이라는 것을 알게 되었어요." }])) }
  ],
  challenge: { inst: "★ 도전: 모양 조각 3가지를 모두 써서 정삼각형 모양 게시판 장식을 만들어 보세요. (같은 조각을 여러 번 써도 돼요.)", hints: ["한 변이 3인 큰 정삼각형을 떠올려요.", "사다리꼴, 평행사변형, 정삼각형을 섞어 보아요."],
    render: (b, a) => p6Pieces(b, a, { kinds: ["tri", "par", "trap", "rh", "sq", "hex"], tasks: [{ type: "make", reg: true, n: 3, kinds: 3, min: 3, label: "3가지 조각으로 정삼각형 만들기" }], ok: "3가지 조각으로 정삼각형을 만들었어요." }) }
}
];
