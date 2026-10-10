//@@APP
const APP={title:"은하의 어린이 미술관 다각형", unit:"4-2 수학 6. 다각형(교과서)", key:"t42-polygon-v1", welcome:"은하의 어린이 미술관 다각형 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 은하네 가족과 어린이 미술관을 둘러보며 작품 속 도형을 분류하고, 점 종이와 도형판에 다각형을 그리고, 대각선을 긋고, 모양 조각으로 모양을 만들고 채워 봐요."};
//@@UNIT
/* =========================================================
   4-2 수학 6. 다각형 — 단원 조작 부품 (앞글자 p6)
   그림은 모두 좌표로 계산해서 그려요. 변의 수·꼭짓점의 수·정다각형·대각선의 수·
   대각선의 길이와 만나는 각·모양 조각 채우기(빈틈·겹침)는 코드로 따져서 채점해요.
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

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기) ---------- */
function p6Num(s) { const t = String(s == null ? "" : s).replace(/[\s,°개]/g, "").replace(/cm/g, ""); return t === "" ? NaN : Number(t); }
function p6Ask(host, api, items, opts = {}) {
  const wrap = h("div", { class: "p6ask", style: "margin-top:.6em" }), all = [];
  if (opts.title) wrap.append(h("p", { class: "inst" }, opts.title));
  items.forEach(it => {
    const box = h("div", { class: "qitem" });
    if (it.q) box.append(h("div", { class: "jua" }, it.q));
    if (it.fig) box.append(typeof it.fig === "function" ? it.fig() : it.fig);
    const sent = h("p", { class: "sent" });
    (it.parts || []).forEach(pt => {
      if (typeof pt === "string") { sent.append(pt); return; }
      if (pt.o) {
        const slot = h("span", { class: "slot" }), s = { pt, v: pt.multi ? new Set() : null, slot };
        pt.o.forEach((o, oi) => slot.append(h("button", { class: "opt", onclick: e => {
          if (pt.multi) { s.v.has(oi) ? s.v.delete(oi) : s.v.add(oi); e.currentTarget.classList.toggle("on"); [...slot.children].forEach(b => b.classList.remove("good", "bad")); }
          else { [...slot.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); s.v = oi; }
        } }, o)));
        sent.append(slot); all.push(s);
      } else {
        const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": "답", style: "width:3.6em;font-size:1.1em;text-align:center" });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : String(pt.n);
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : p6Num(s.inp.value) === s.pt.n;
  const val = s => s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-");
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) { [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); }); }
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) return api.done(ans, opts.ok);
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(p6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}
/* 조작을 마친 뒤: then(이어서 할 활동) → ask(물음) → 없으면 바로 해결 */
function p6Finish(body, api, opt, ans, msg, data) {
  const go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "p6part" }); body.append(box); opt.then(box, api, data); go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask(data) : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = p6Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle }); go(w); }
  else api.done(ans, opt.ok || msg);
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열림 */
function p6Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "p6part" : "" }); body.append(box);
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

/* =========================================================
   1. 분류하기 — 도형 카드를 골라 칸에 넣기 (변에 번호 붙이기·자와 각도기로 재기)
   opt: {cats, items:[{S, cat, why, label}], nums, measure, unit:"cm", ok, tip}
   ========================================================= */
function p6Sort(body, api, opt) {
  const cats = opt.cats, items = opt.items, where = items.map(() => -1), CW = opt.measure ? 340 : 260, CH = opt.measure ? 300 : 210;
  let sel = null, tnum = false, tmea = false;
  const grid = h("div", { class: "p6grid", style: opt.measure ? "grid-template-columns:repeat(auto-fill,minmax(12.5em,1fr))" : null });
  const cards = items.map((it, i) => {
    const s = makeSvg(CW, CH), holder = svgEl("g"); s.append(holder);
    const tag = h("div", { class: "p6tag" }, "-");
    const btn = h("button", { class: "opt p6card", onclick: () => { sel = sel === i ? null : i; paint(); } }, h("div", { class: "jua" }, it.label || P6_KO[i]), s, tag);
    grid.append(btn); return { btn, tag, holder };
  });
  const drawCards = () => cards.forEach((c, i) => { c.holder.innerHTML = ""; c.holder.append(p6ShapeG(items[i].S, CW, CH, { pad: tmea ? 58 : (tnum ? 32 : 24), nums: tnum, measure: tmea, fs: 20, unit: opt.unit, dots: !!items[i].S.pts })); });
  const paint = () => cards.forEach((c, i) => { c.btn.classList.toggle("on", sel === i); c.tag.textContent = where[i] < 0 ? "-" : cats[where[i]]; c.btn.classList.remove("good", "bad"); });
  const lab = i => items[i].label || P6_KO[i];
  const toolBtns = [];
  if (opt.nums) toolBtns.push(h("button", { onclick: e => { tnum = !tnum; e.currentTarget.classList.toggle("on", tnum); drawCards(); } }, "변에 번호 붙이기"));
  if (opt.measure) toolBtns.push(h("button", { onclick: e => { tmea = !tmea; e.currentTarget.classList.toggle("on", tmea); drawCards(); } }, "자와 각도기로 재기"));
  const tools = h("div", { class: "tools" }, h("span", {}, "고른 카드를 →"), cats.map((c, j) => h("button", { onclick: () => { if (sel == null) return api.hint("먼저 도형 카드를 하나 눌러 골라요."); where[sel] = j; sel = null; paint(); } }, c)));
  api.provide({ words: cats, answers: [cats.map((c, j) => `${c}: ${items.map((it, i) => it.cat === j ? lab(i) : null).filter(Boolean).join(", ") || "없음"}`).join(" / ")] });
  const check = h("button", { class: "big", onclick: () => {
    if (where.some(w => w < 0)) return api.hint("아직 나누지 않은 카드가 있어요. 모든 카드를 나누어요.");
    api.tryOnce(); const ans = cats.map((c, j) => `${c}: ${items.map((it, i) => where[i] === j ? lab(i) : null).filter(Boolean).join(",") || "-"}`).join(" / ");
    const bad = items.map((it, i) => where[i] !== it.cat ? i : -1).filter(i => i >= 0);
    cards.forEach((c, i) => c.btn.classList.add(bad.includes(i) ? "bad" : "good"));
    if (!bad.length) { check.disabled = true; return p6Finish(body, api, opt, ans, opt.ok || "알맞게 나누었어요!"); }
    api.fail(items[bad[0]].why || `${lab(bad[0])}${p6Jo(lab(bad[0]), "을/를").slice(-1)} 다시 살펴봐요.`, ans);
  } }, "확인하기");
  body.append(...[grid, opt.tip ? h("p", { class: "inst" }, opt.tip) : null, toolBtns.length ? p6Tools(...toolBtns) : null, tools, h("div", { class: "actions" }, check)].filter(Boolean));
  drawCards(); paint();
}

/* =========================================================
   2. 점 종이·도형판 — 점을 차례로 눌러 다각형 그리기 (처음 점을 다시 누르면 닫힘)
   opt: {grid:{type:"sq"|"tri"|"circ", cols, rows, gap, n, r},
         tasks:[{n, reg, any, diff, given:[[c,r]…], label}] | free:{min}, clearEach, ask|then, ok, tip}
   ========================================================= */
function p6Dots(body, api, opt) {
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
  const tg = opt.set === "tg", set = tg ? P6_TG : P6_PB, step = tg ? 45 : 30, U = opt.U || 60, W = opt.W || 10, H = opt.H || 6;
  const kinds = opt.kinds || (tg ? P6_TGK : P6_PBK), limit = opt.limit || (tg ? P6_TGL : null), snapStep = tg ? null : 1;
  const svg = makeSvg(W * U, H * U); svg.style.touchAction = "none";
  const bgG = svgEl("g"), pcG = svgEl("g"); svg.append(bgG, pcG);
  const tasks = opt.tasks; let ti = 0, pieces = [], sel = -1, results = [], over = false, naming = false;
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
    if (ti >= tasks.length) { over = true; draw(); check.disabled = true; return p6Finish(body, api, opt, results.map(x => x.say).join(" / "), msg, results); }
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
  const check = h("button", { class: "big", onclick: judge }, "확인하기");
  api.provide({ words: opt.words || ["빈틈없이", "겹치지 않게", "변과 변을 이어 붙이기", "돌리기"], answers: [] });
  body.append(stageWrap(svg, p6Side(h("p", { class: "p6small" }, opt.tip || "조각 단추를 눌러 꺼내고, 끌어서 옮겨요. 살짝 누르면 돌아가요. 변끼리 가까이 놓으면 저절로 붙어요."), list, pal, ctrl, cnt, nameBox)), h("div", { class: "actions" }, check));
  showList(); drawBg(); draw();
}

/* =========================================================
   5. 그림에서 도형 찾기 — 눌러서 확인
   opt: {W, H, deco(svg), items:[{pts|circle:[cx,cy,r], fill, info}], ok}
   ========================================================= */
function p6Scene(body, api, opt) {
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
   9. 놀이: 주사위 눈의 수에 맞는 다각형 색칠하기 (토끼 그림)
   ========================================================= */
const P6_RABBIT = [
  { pts: [[262, 205], [236, 168], [232, 110], [246, 58], [270, 36], [294, 66], [298, 205]] },     // 왼쪽 귀 7
  { pts: [[338, 205], [364, 168], [368, 110], [354, 58], [330, 36], [306, 66], [302, 205]] },     // 오른쪽 귀 7
  { pts: [[272, 188], [260, 150], [262, 104], [272, 80], [282, 188]], inner: true },              // 귀 안 5
  { pts: [[328, 188], [340, 150], [338, 104], [328, 80], [318, 188]], inner: true },
  { pts: [[215, 252], [258, 205], [342, 205], [385, 252], [395, 312], [352, 360], [248, 360], [205, 312]] },   // 머리 8
  { pts: [[250, 258], [276, 250], [282, 276], [256, 284]], inner: true },     // 눈 4
  { pts: [[350, 258], [324, 250], [318, 276], [344, 284]], inner: true },
  { pts: [[282, 294], [318, 294], [300, 322]], inner: true },                 // 코 3
  { pts: [[240, 360], [360, 360], [402, 410], [412, 478], [372, 540], [228, 540], [188, 478], [198, 410]] },   // 몸 8
  { pts: [[300, 384], [266, 368], [266, 402]], inner: true },                 // 나비넥타이 3
  { pts: [[300, 384], [334, 368], [334, 402]], inner: true },
  { pts: [[214, 428], [252, 414], [270, 450], [248, 478], [218, 466]], inner: true },   // 팔 5
  { pts: [[386, 428], [348, 414], [330, 450], [352, 478], [382, 466]], inner: true },
  { pts: [[228, 540], [288, 540], [298, 566], [284, 592], [226, 592], [212, 566]] },   // 발 6
  { pts: [[372, 540], [312, 540], [302, 566], [316, 592], [374, 592], [388, 566]] },
  { pts: [[414, 452], [442, 430], [474, 440], [486, 470], [466, 498], [428, 494]] },   // 꼬리 6
  { pts: [[112, 432], [168, 432], [140, 546]] },                                       // 당근 3
  { pts: [[124, 432], [156, 432], [172, 392], [106, 392]] }                            // 당근 잎 4
];
function p6Game(body, api, opt) {
  const svg = makeSvg(560, 620); svg.setAttribute("viewBox", "90 20 420 590");
  const regs = P6_RABBIT.map(r => Object.assign({}, r, { n: p6Clean(r.pts).length, col: null }));
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
    if (regs.every(x => x.col)) { over = true; status(); return p6Finish(body, api, opt, "토끼 그림 완성", "다각형을 모두 찾아 토끼 그림을 완성했어요!"); }
    status();
  }
  const colors = h("div", { class: "p6colors" }, ...COLS.map((c, k) => { const b = h("button", { class: k ? "" : "p6-pick", style: `background:${c}`, "aria-label": "색 고르기", onclick: () => { pc = c; [...colors.children].forEach(x => x.classList.toggle("p6-pick", x === b)); } }); return b; }));
  const rule = p6Tbl(["눈의 수", "1", "2", "3", "4", "5", "6"], [["다각형", "삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형"]]);
  api.provide({ words: ["삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형"], answers: [] });
  drawDie(); status();
  body.append(rule, stageWrap(svg, p6Side(turnT, h("div", { class: "p6die" }, dieS), p6Tools(roll), p6Tools(pass), h("b", {}, "색 고르기"), colors, read)));
}

/* =========================================================
   10. 낱말 찾기 (7×7 글자판, → ↓ ↘ ↙)
   ========================================================= */
const P6_WS = ["형변사행평모자", "각도다각형행복", "육백리소수칠선", "정다움사직각물", "사팔분대선형선", "각수각용시직각", "형선분형대오반"];
function p6Words(body, api, opt) {
  const words = opt.words, found = new Set(); let a = null;
  const grid = h("div", { class: "p6ws" }), btn = [];
  const sents = h("div");
  const paintS = () => { sents.innerHTML = ""; opt.sents.forEach((s, i) => sents.append(h("p", { class: "p6sent" }, `${i + 1}. ${s[0]}`, h("b", {}, found.has(words[i]) ? words[i] : "　"), s[1]))); };
  P6_WS.forEach((row, r) => [...row].forEach((ch, c) => { const b = h("button", { onclick: () => tap(r, c) }, ch); btn.push(b); grid.append(b); }));
  const cell = (r, c) => btn[r * 7 + c];
  const fixed = new Set();
  function tap(r, c) {
    if (found.size === words.length) return;
    if (!a) { a = [r, c]; cell(r, c).classList.add("p6-a"); return; }
    const [r0, c0] = a; cell(r0, c0).classList.remove("p6-a"); a = null;
    const dr = Math.sign(r - r0), dc = Math.sign(c - c0), len = Math.max(Math.abs(r - r0), Math.abs(c - c0)) + 1;
    const okDir = (dr === 0 && dc === 1) || (dr === 1 && dc === 0) || (dr === 1 && dc === 1) || (dr === 1 && dc === -1);
    if (!okDir || (dr && dc && Math.abs(r - r0) !== Math.abs(c - c0)) || len < 2) { api.tryOnce(); return api.hint("낱말은 → ↓ ↘ ↙ 방향으로 놓여 있어요. 첫 글자를 누르고 마지막 글자를 눌러요."); }
    let w = ""; const cells = []; for (let k = 0; k < len; k++) { w += P6_WS[r0 + dr * k][c0 + dc * k]; cells.push([r0 + dr * k, c0 + dc * k]); }
    if (!words.includes(w) || found.has(w)) { api.tryOnce(); return api.hint(found.has(w) ? "이미 찾은 낱말이에요." : `‘${w}’${p6Jo(w, "은/는").slice(-1)} 찾는 낱말이 아니에요. 빈칸에 들어갈 낱말을 생각해 봐요.`); }
    found.add(w); cells.forEach(([y, x]) => { fixed.add(y * 7 + x); cell(y, x).classList.add("p6-f"); }); paintS();
    if (found.size === words.length) p6Finish(body, api, opt, words.join(", "), "낱말 4개를 모두 찾았어요!");
    else api.hint(`○ ‘${w}’${p6Jo(w, "을/를").slice(-1)} 찾았어요.`);
  }
  api.provide({ words, answers: [words.join(", ")] });
  paintS(); body.append(sents, h("p", { class: "p6small" }, "빈칸에 알맞은 낱말을 글자판에서 찾아요. 첫 글자를 누르고, 마지막 글자를 눌러요."), grid);
}


/* =========================================================
   이 단원 그림 자료 (모두 좌표로 계산)
   ========================================================= */
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
const P6_HH = P6_H;
/* 6차시 우주선 (모양 조각 8개) */
const P6_SHIP = [
  p6P("tri", [[4, 2.3], [5, 2.3], [4.5, 2.3 - P6_HH]]),
  p6P("sq", [[4, 2.3], [5, 2.3], [5, 3.3], [4, 3.3]]),
  p6P("sq", [[4, 3.3], [5, 3.3], [5, 4.3], [4, 4.3]]),
  p6P("par", [[4, 3.3], [4, 4.3], [4 - P6_HH, 4.8], [4 - P6_HH, 3.8]]),
  p6P("par", [[5, 3.3], [5, 4.3], [5 + P6_HH, 4.8], [5 + P6_HH, 3.8]]),
  p6P("trap", [[4, 4.3], [5, 4.3], [5.5, 4.3 + P6_HH], [3.5, 4.3 + P6_HH]]),
  p6P("rh", [[4, 4.3], [4 - P6_HH, 4.8], [4 - P6_HH - .5, 4.8 + P6_HH], [3.5, 4.3 + P6_HH]]),
  p6P("rh", [[5, 4.3], [5 + P6_HH, 4.8], [5 + P6_HH + .5, 4.8 + P6_HH], [5.5, 4.3 + P6_HH]])];
/* 6차시 모양 조각의 나라 마을: 집·꽃·새 */
const P6_VIL = (() => {
  const H = P6_HH, e1 = [Math.sin(Math.PI / 12), Math.cos(Math.PI / 12)], e2 = [-e1[0], e1[1]], T = [5.5, 2 + H];
  return {
    house: [p6P("sq", [[1, 3.4], [2, 3.4], [2, 4.4], [1, 4.4]]), p6P("sq", [[2, 3.4], [3, 3.4], [3, 4.4], [2, 4.4]]), p6P("trap", [[1, 3.4], [3, 3.4], [2.5, 3.4 - H], [1.5, 3.4 - H]])],
    flower: [p6P("sq", [[5, 1], [6, 1], [6, 2], [5, 2]]), p6P("tri", [[5, 1], [6, 1], [5.5, 1 - H]]), p6P("tri", [[5, 2], [6, 2], [5.5, 2 + H]]), p6P("tri", [[5, 1], [5, 2], [5 - H, 1.5]]), p6P("tri", [[6, 1], [6, 2], [6 + H, 1.5]]),
      p6P("rh", [T, [T[0] + e1[0], T[1] + e1[1]], [T[0] + e1[0] + e2[0], T[1] + e1[1] + e2[1]], [T[0] + e2[0], T[1] + e2[1]]])],
    bird: [p6P("par", [[8, 1.5], [9, 1.5], [8.5, 1.5 + H], [7.5, 1.5 + H]]), p6P("rh", [[8, 1.5], [9, 1.5], [9 + H, 1], [8 + H, 1]]), p6P("rh", [[8, 1.5], [7.5, 1.5 + H], [7.5 - H, 2 + H], [8 - H, 2]])]
  };
})();
/* 7차시 물고기: 한 변이 2인 정육각형 몸통 + 한 변이 2인 정삼각형 꼬리 2개 */
const P6_FISH = (() => {
  const H = P6_HH, dx = 4, dy = 4.3, c = [1, -2 * H];
  const body = Array.from({ length: 6 }, (_, i) => [c[0] + 2 * Math.cos(-i * Math.PI / 3), c[1] + 2 * Math.sin(-i * Math.PI / 3)]);
  const inner = Array.from({ length: 6 }, (_, i) => [c[0] + Math.cos(-i * Math.PI / 3), c[1] + Math.sin(-i * Math.PI / 3)]);
  const ex = [p6P("hex", inner)];
  for (let i = 0; i < 6; i++) ex.push(p6P("trap", [body[i], body[(i + 1) % 6], inner[(i + 1) % 6], inner[i]]));
  ex.push(p6P("tri", [[-2, 0], [-1, 0], [-1.5, -H]]), p6P("trap", [[0, 0], [-1, 0], [-1.5, -H], [-1, -2 * H]]));
  ex.push(p6P("tri", [[-2, -4 * H], [-1, -4 * H], [-1.5, -3 * H]]), p6P("trap", [[0, -4 * H], [-1, -4 * H], [-1.5, -3 * H], [-1, -2 * H]]));
  const outline = [[0, 0], [2, 0], [3, -2 * H], [2, -4 * H], [-2, -4 * H], [-1, -2 * H], [-2, 0]];
  return { outline: p6Mv(outline, dx, dy), ex: ex.map(p => p6P(p.k, p6Mv(p.pts, dx, dy))), eye: [2 + dx, -2.6 * H + dy] };
})();
/* 7차시 엽서의 닭: 정육각형·정사각형·정삼각형 2·평행사변형·마름모 */
const P6_CHICK = (() => {
  const H = P6_HH, dx = 3, dy = 4.6;
  const ps = [p6P("hex", [[0, 0], [1, 0], [1.5, -H], [1, -2 * H], [0, -2 * H], [-.5, -H]]),
    p6P("sq", [[0, -2 * H], [1, -2 * H], [1, -2 * H - 1], [0, -2 * H - 1]]),
    p6P("tri", [[0, -2 * H - 1], [1, -2 * H - 1], [.5, -3 * H - 1]]),
    p6P("tri", [[1, -2 * H - 1], [1 + H, -2 * H - .5], [1, -2 * H]]),
    p6P("par", [[-.5, -H], [0, -2 * H], [-1, -2 * H], [-1.5, -H]]),
    p6P("rh", [[0, 0], [1, 0], [1 - H, .5], [-H, .5]])].map(p => p6P(p.k, p6Mv(p.pts, dx, dy)));
  return { pieces: ps, eye: [3.72, 4.6 - 2 * H - .62] };
})();
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

/* 2~3차시 활동 1: 작품에서 찾은 도형 가~바 */
const P6_ART1 = [p6Circ(1), p6S([[0, 2], [2.6, 2], [1.1, 0]]), p6S([[0, 0], [2.4, 0], [2.4, 1.8], [0, 1.8]]), p6S([[0, 1], [1.2, 0], [2.4, 1], [2, 2.4], [.4, 2.4]]), p6S(p6Blob(6, [1.3], 0)), p6Semi()];
/* 2~3차시 활동 2: 가·나·마·바 다각형, 다 굽은 선, 라 열린 도형 */
const P6_FIND = [p6S([[0, 0], [2.6, .6], [1.2, 1.1], [1.6, 2.6]]), p6S([[0, .6], [1.6, 0], [2.8, 1], [2.2, 2.4], [.6, 2.2]]), p6Fan(), { open: [[0, 2.2], [0, 0], [2.4, 0], [2.4, 2.2], [.7, 2.2]] }, p6S([[0, 2], [3, 1.7], [.6, 0]]), p6S([[0, 1], [.9, 0], [1.9, .3], [2.6, 0], [2.6, 2], [1.4, 2.6], [.2, 2.2]])];
/* 2~3차시 활동 4: 변의 수 가5 나7 다6 라8 마6 바5 사8 아7 */
const P6_SIDES = [
  p6Need([[0, 0], [3, 0], [3.5, 2], [1.5, 3.2], [-.5, 1.8]], 5, "가"),
  p6Need(p6Blob(7, [1.6, 1.4, 1.7, 1.5], 10), 7, "나"),
  p6Need([[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]], 6, "다"),
  p6Need([[0, 0], [3, 0], [3, 1], [2, 1], [2, 2.5], [1, 2.5], [1, 1], [0, 1]], 8, "라"),
  p6Need(p6Blob(6, [1.6, 1.3, 1.5], 15), 6, "마"),
  p6Need([[0, 2], [0, 1], [1, 0], [2, 1], [2, 2]], 5, "바"),
  p6Need(p6Blob(8, [1.5, 1.3], 0), 8, "사"),
  p6Need([[0, 1], [2, 1], [2, 0], [3.5, 1.5], [2, 3], [2, 2], [0, 2]], 7, "아")].map(p6S);
const P6_SIDECAT = [0, 2, 1, 3, 1, 0, 3, 2];   // 5→0, 6→1, 7→2, 8→3

/* 4차시 모빌: 가 일반 사각형, 나 정삼각형, 다 정사각형, 라 정오각형, 마 정육각형, 바 마름모 */
const P6_MOB = [
  [[0, 0], [3.2, 0], [3.6, 2.2], [.6, 2.8]],
  p6Reg(3, 2.8), p6Reg(4, 2.2), p6Reg(5, 1.8), p6Reg(6, 1.4),
  (() => { const a = 70 * Math.PI / 180, c = 2.4 * Math.cos(a), s = 2.4 * Math.sin(a); return [[0, 0], [2.4, 0], [2.4 + c, -s], [c, -s]]; })()].map(p6S);
/* 4차시 활동 2: 가 정오각형(비스듬히), 나 직사각형, 다 정삼각형(비스듬히), 라 일반 육각형, 마 정팔각형 */
const P6_REGQ = [p6Reg(5, 1.8, 20), [[0, 0], [3.2, 0], [3.2, 1.8], [0, 1.8]], p6Reg(3, 2.6, -15), [[0, 0], [2.6, 0], [3.4, 1.2], [2.4, 2.4], [.6, 2.2], [-.4, 1]], p6Reg(8, 1.1)].map(p6S);
/* 1차시 모빌에 매달린 도형 */
const P6_MOBILE1 = [p6Blob(5, [1.4, 1.2, 1.5, 1.3, 1.4], -90), [[0, 0], [2.2, .3], [2, 1.9], [.2, 1.6]], [[0, 1.8], [2.2, 1.8], [1, 0]], p6Blob(6, [1.3, 1.1, 1.4], 0)];

/* 도형 + 선분 하나 (대각선 ◯× 카드) */
function p6SegCard(P, a, b, mark) {
  return { draw: (g, W, H) => {
    const m = p6Fit(P, W, H - 10, 34), Q = P.map(m);
    g.append(svgEl("polygon", { points: p6PtsAttr(Q), fill: "#EEF5FD", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round", transform: "translate(0,10)" }));
    const A = m(a), B = m(b);
    g.append(svgEl("line", { x1: A[0], y1: A[1] + 10, x2: B[0], y2: B[1] + 10, stroke: TENT, "stroke-width": 5, "stroke-linecap": "round" }));
    Q.forEach(p => g.append(svgEl("circle", { cx: p[0], cy: p[1] + 10, r: 5, fill: INK })));
  } };
}
/* 교통안전 표지 3개 */
function p6Signs() {
  return p6Fig(780, 260, s => {
    const pent = [[40, 120], [130, 40], [220, 120], [220, 230], [40, 230]];
    s.append(svgEl("polygon", { points: p6PtsAttr(pent), fill: "#2B6FB8", stroke: "#fff", "stroke-width": 6 }), svgEl("polygon", { points: p6PtsAttr(pent), fill: "none", stroke: "#1B4C80", "stroke-width": 2 }));
    for (let i = 0; i < 4; i++) s.append(svgEl("rect", { x: 70 + i * 32, y: 200, width: 18, height: 22, fill: "#fff" }));
    s.append(svgEl("circle", { cx: 130, cy: 100, r: 12, fill: "#fff" }), svgEl("path", { d: "M130,114 L130,160 M130,160 L112,192 M130,160 L148,192 M130,128 L108,148 M130,128 L152,140", stroke: "#fff", "stroke-width": 8, "stroke-linecap": "round", fill: "none" }));
    s.append(txt(130, 252, "횡단보도", 18));
    s.append(svgEl("rect", { x: 290, y: 50, width: 200, height: 170, rx: 4, fill: "#2B6FB8", stroke: "#1B4C80", "stroke-width": 2 }));
    s.append(svgEl("circle", { cx: 345, cy: 165, r: 26, fill: "none", stroke: "#fff", "stroke-width": 7 }), svgEl("circle", { cx: 435, cy: 165, r: 26, fill: "none", stroke: "#fff", "stroke-width": 7 }),
      svgEl("path", { d: "M345,165 L375,120 L420,120 L435,165 M375,120 L392,165 L420,120 M368,108 L384,108 M420,120 L414,104 L428,104", stroke: "#fff", "stroke-width": 6, fill: "none", "stroke-linejoin": "round", "stroke-linecap": "round" }));
    s.append(txt(390, 76, "자전거 전용", 20, { fill: "#fff" }), txt(390, 252, "자전거 전용", 18));
    const oct = p6Reg(8, 70, 0).map(p => [p[0] + 615, p[1] + 225]);
    s.append(svgEl("polygon", { points: p6PtsAttr(oct.map(p => [p6R(p[0]), p6R(p[1])])), fill: "#D93A30", stroke: "#fff", "stroke-width": 6 }));
    const oc = p6Cen(oct); s.append(txt(p6R(oc[0]), p6R(oc[1]), "정지", 46, { fill: "#fff" }), txt(p6R(oc[0]), 252, "정지", 18));
  }, "40em");
}
/* 1차시 미술관 입구 그림 */
const P6_ENT = {
  W: 900, H: 470,
  deco: s => { s.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 470, fill: "#FFF8EE" }), svgEl("rect", { x: 0, y: 400, width: 900, height: 70, fill: "#E9D8BE" }), txt(450, 34, "어린이 미술관", 28, { fill: "#8A5A2B" }));
    [[150, "물개"], [470, "고래"], [760, "나비"]].forEach(([x, t]) => s.append(svgEl("rect", { x: x - 40, y: 410, width: 80, height: 30, rx: 6, fill: "#fff", stroke: "#C9B79A" }), txt(x, 426, t, 18))); },
  items: [
    { n: "물개 몸", pts: [[60, 395], [250, 395], [272, 330], [205, 268], [105, 300]], fill: "#9FB7C9", info: "곧은 선 5개로 둘러싸여 있어요." },
    { n: "물개 머리", circle: [218, 250, 34], fill: "#B7CAD8", info: "굽은 선으로 둘러싸인 도형(원)이에요." },
    { n: "물개 꼬리지느러미", pts: [[64, 392], [18, 346], [28, 398]], fill: "#7E99AE", info: "곧은 선 3개로 둘러싸인 삼각형이에요." },
    { n: "고래 몸", pts: [[340, 320], [395, 250], [540, 250], [592, 320], [540, 385], [395, 385]], fill: "#7FB3E0", info: "곧은 선 6개로 둘러싸여 있어요." },
    { n: "고래 꼬리", pts: [[592, 320], [648, 262], [648, 378]], fill: "#5E95C8", info: "곧은 선 3개로 둘러싸인 삼각형이에요." },
    { n: "고래 물줄기", circle: [470, 200, 26], fill: "#CFE8FA", info: "굽은 선으로 둘러싸인 도형(원)이에요." },
    { n: "나비 왼쪽 날개", pts: [[752, 300], [690, 175], [655, 300], [740, 360]], fill: "#F6A65B", info: "곧은 선 4개로 둘러싸인 사각형이에요." },
    { n: "나비 오른쪽 날개", pts: [[768, 300], [830, 175], [865, 300], [780, 360]], fill: "#F6A65B", info: "곧은 선 4개로 둘러싸인 사각형이에요." },
    { n: "나비 몸", pts: [[752, 190], [768, 190], [768, 395], [752, 395]], fill: "#7A5BB0", info: "곧은 선 4개로 둘러싸인 사각형이에요." }]
};
/* 8차시 등대와 배 */
function p6Light() {
  return p6Fig(640, 330, s => {
    s.append(svgEl("rect", { x: 0, y: 0, width: 640, height: 330, fill: "#EAF5FC" }), svgEl("rect", { x: 0, y: 260, width: 640, height: 70, fill: "#A9D3EE" }));
    const P = (pts, f, st) => s.append(svgEl("polygon", { points: p6PtsAttr(pts), fill: f, stroke: st, "stroke-width": 4, "stroke-linejoin": "round" }));
    P([[90, 280], [230, 280], [190, 120], [130, 120]], "#F28B82", "#A8322B");
    P([[130, 120], [190, 120], [190, 60], [130, 60]], "#FBD25B", "#B08A1E");
    P([[120, 60], [200, 60], [160, 18]], "#6E9BEA", "#2952A3");
    s.append(txt(160, 312, "등대", 20));
    P([[330, 250], [570, 250], [530, 290], [290, 290]], "#B07A4B", "#6E4A2A");
    P([[450, 245], [500, 160], [450, 75], [400, 160]], "#FFF6E0", "#9A7B3E");
    s.append(svgEl("line", { x1: 450, y1: 75, x2: 450, y2: 250, stroke: "#6E4A2A", "stroke-width": 4 }), txt(430, 315, "배", 20));
  }, "34em");
}
/* 9차시 토끼 그림 미리 보기용 */
function p6Pick6() { return 1 + Math.floor(Math.random() * 6); }
//@@LESSONS
const UNIT_STORY = { title: "은하네 가족의 어린이 미술관 나들이", lines: [
  "은하네 가족은 어린이 미술관에 갔어요. 입구의 물개·고래·나비 작품, 천장에 매달린 모빌, 종이 접기 전시실, ‘모양 조각의 나라’ 전시실에서 여러 가지 도형을 찾아요.",
  "은하는 작품 속 도형을 분류해 다각형과 정다각형을 알고, 색종이를 접어 대각선을 찾고, 모양 조각으로 모양을 만들고 채워 친구에게 엽서도 보내요.",
  "교과서 「수학 4-2」 6. 다각형의 차시 순서 그대로 만들었어요."],
  one: "다각형 · 어린이 미술관 작품에서 다각형·정다각형·대각선을 찾고, 모양 조각으로 모양을 만들고 채워요." };
const UNIT_KEYWORDS = ["선분", "다각형", "변", "꼭짓점", "오각형", "육각형", "칠각형", "팔각형", "정다각형", "변의 길이가 모두 같음", "각의 크기가 모두 같음", "대각선", "이웃하지 않는 두 꼭짓점", "모양 조각", "모양 만들기", "모양 채우기", "빈틈없이 겹치지 않게"];
const P6_PBN = ["정삼각형", "정사각형", "평행사변형", "사다리꼴", "마름모", "정육각형"];
const P6_NAMES6 = ["삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 어린이 미술관에서 도형을 찾아요", soop: "개념 찾기(S)",
  question: "어린이 미술관의 작품에서 어떤 도형을 찾을 수 있을까요? 삼각형, 사각형보다 변이 많은 도형은 무엇이라고 부를까요?",
  summary: "우리 주변의 물건과 작품에는 여러 가지 도형이 있어요. 곧은 선으로 둘러싸인 도형도 있고, 굽은 선으로 둘러싸인 도형도 있어요. 이 단원에서는 다각형, 정다각형, 대각선을 알아보고 모양 조각으로 모양을 만들고 채워 봐요.",
  steps: [
    { name: "찾아 보기", inst: "은하네 가족이 어린이 미술관에 도착했어요. 입구에 있는 물개, 고래, 나비 작품에서 도형을 모두 찾아 눌러 보세요.", hints: ["작품을 이루는 조각을 하나씩 눌러 봐요.", "곧은 선으로 둘러싸인 도형과 굽은 선으로 둘러싸인 도형이 있어요."],
      render: (b, a) => p6Scene(b, a, Object.assign({ tip: "작품을 이루는 도형을 하나씩 눌러요. 찾은 도형의 특징이 아래에 나와요.", ok: "작품에서 삼각형, 사각형, 원과 곧은 선 5개·6개로 둘러싸인 도형을 찾았어요." }, P6_ENT)) },
    { name: "떠올리기", inst: "곰곰! 배운 내용을 떠올려 보세요.", hints: ["두 점을 곧게 이은 선을 선분이라고 해요.", "삼각형은 변 3개, 사각형은 변 4개예요."],
      render: (b, a) => quiz(b, a, [
        { q: "두 점을 곧게 이은 선은 무엇일까요?", o: ["선분", "반직선", "직선"], a: 0, why: { "1": "반직선은 한 점에서 시작하여 한쪽으로 끝없이 늘인 곧은 선이에요.", "2": "직선은 양쪽으로 끝없이 늘인 곧은 선이에요." } },
        { q: "사각형의 변과 꼭짓점은 각각 몇 개일까요?", o: ["변 3개, 꼭짓점 3개", "변 4개, 꼭짓점 4개", "변 4개, 꼭짓점 3개"], a: 1 },
        { q: "마주 보는 두 쌍의 변이 서로 평행하고 네 변의 길이가 모두 같은 사각형은?", o: ["사다리꼴", "마름모", "직사각형"], a: 1, why: { "0": "사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이에요.", "2": "직사각형은 네 각이 모두 직각인 사각형이에요." } }], { ok: "선분, 변과 꼭짓점, 여러 가지 사각형을 잘 기억하고 있어요." }) },
    { name: "세어 보기", inst: "제1 전시실 천장에 매달려 있는 모빌이에요. 도형 가~라의 변을 세어 보세요.", hints: ["한 변을 짚고 시작해서 한 바퀴 돌며 세어요.", "꼭짓점을 세어 보아도 돼요."],
      render: (b, a) => p6Ask(b, a, [{ fig: () => p6Cards(P6_MOBILE1.map(p6S), { per: 4, cw: 180, ch: 170, shape: { dots: true }, maxW: "40em" }),
        parts: ["변의 수 ― 가: ", { n: 5, why: { "4": "한 변을 짚고 한 바퀴 돌며 다시 세어 봐요." } }, "개, 나: ", { n: 4 }, "개, 다: ", { n: 3 }, "개, 라: ", { n: 6, why: { "5": "한 변을 짚고 한 바퀴 돌며 다시 세어 봐요." } }, "개"] }],
        { ok: "가는 변이 5개, 나는 4개, 다는 3개, 라는 6개예요. 변이 5개, 6개인 도형은 무엇이라고 부를지 앞으로 알아봐요." }) },
    { name: "궁금해하기", inst: "“천장에 매달려 있는 저 도형은 무엇이라고 불러야 할까?” 은하의 궁금증을 함께 생각해 보세요.", hints: ["삼각형은 변이 3개, 사각형은 변이 4개라서 붙은 이름이에요.", "변이 5개인 도형의 이름도 변의 수와 관련이 있을 거예요."],
      render: (b, a) => blanks(b, a, ["삼각형은 변이 ", { o: ["3개", "4개"], a: 0 }, ", 사각형은 변이 ", { o: ["4개", "5개"], a: 0 }, "예요. 도형의 이름은 ", { o: ["변의 수", "색깔"], a: 0 }, "와 관련이 있어요."], { ok: "도형의 이름은 변의 수와 관련이 있어요. 변이 5개, 6개인 도형의 이름을 곧 배워요." }) },
    { name: "확인하기", inst: "우리 주변에서 볼 수 있는 도형을 떠올려 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "우리 주변이나 미술관에서 본 도형을 써 보세요.", tag: "주변의 도형", ph: "예) 텔레비전·책상은 직사각형, 교통안전 표지는 삼각형, 접시는 원이에요." },
        { q: "이 단원에서 알고 싶은 것을 써 보세요.", tag: "알고 싶은 것", ph: "예) 변이 5개인 도형은 무엇이라고 부르는지 알고 싶어요." }]) }
  ],
  challenge: { inst: "교실에서 찾은 물건이에요. 어떤 도형을 찾을 수 있는지 골라 보세요.", hints: ["변의 수를 세어 이름을 정해요."],
    render: (b, a) => quiz(b, a, [
      { q: "삼각자에서 찾을 수 있는 도형은?", o: ["삼각형", "사각형", "원"], a: 0 },
      { q: "창문과 칠판에서 찾을 수 있는 도형은?", o: ["삼각형", "사각형", "원"], a: 1 },
      { q: "칠교판의 조각에서 찾을 수 있는 도형을 모두 골라요.", o: ["삼각형", "사각형", "원"], a: [0, 1], why: {} }], { ok: "삼각자는 삼각형, 창문·칠판은 사각형, 칠교판 조각은 삼각형과 사각형이에요." }) }
},
{
  id: "t23", no: "2~3", title: "다각형을 알아볼까요", soop: "개념 구축하기(O)",
  question: "다각형은 어떤 도형일까요? 다각형의 이름은 어떻게 정할까요?",
  summary: "선분으로만 둘러싸인 도형을 다각형이라고 해요. 굽은 선이 있거나 열려 있는 도형은 다각형이 아니에요. 다각형은 변의 수에 따라 변이 5개이면 오각형, 6개이면 육각형, 7개이면 칠각형, 8개이면 팔각형이라고 불러요. 다각형은 변의 수와 꼭짓점의 수가 같아요.",
  steps: [
    { name: "분류하기", inst: "은하가 어린이 미술관 입구의 작품에서 찾은 도형 가~바예요. 선의 특징에 따라 분류해 보세요. 카드를 누른 다음 알맞은 칸 단추를 눌러요.", hints: ["선분은 두 점을 곧게 이은 선이에요.", "굽은 선이 조금이라도 있는지 살펴봐요."],
      render: (b, a) => p6Sort(b, a, { cats: ["선분으로만 둘러싸인 도형", "굽은 선이 있는 도형"], items: P6_ART1.map((S, i) => ({ S, cat: [1, 0, 0, 0, 0, 1][i], why: [1, 0, 0, 0, 0, 1][i] ? `${P6_KO[i]}에는 굽은 선이 있어요.` : `${P6_KO[i]}는 곧은 선(선분)으로만 둘러싸여 있어요.` })),
        ok: "선분으로만 둘러싸인 도형은 나, 다, 라, 마이고, 굽은 선이 있는 도형은 가, 바예요.",
        ask: [{ q: "약속하기", parts: ["선분으로만 둘러싸인 도형을 ", { o: ["다각형", "원", "곡선 도형"], a: 0 }, "이라고 합니다."] }] }) },
    { name: "찾아 보기", inst: "다각형을 찾아봅시다. 다각형을 모두 골라 보세요.", hints: ["다각형은 선분으로만 둘러싸여 있어야 해요.", "선분들이 떨어지지 않고 맞닿아 닫혀 있어야 해요."],
      render: (b, a) => p6Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "다각형을 모두 골라요.", fig: () => p6Cards(P6_FIND, { per: 3, cw: 200, ch: 170, maxW: "36em", shape: { dots: true } }), o: P6_KO.slice(0, 6), a: [0, 1, 4, 5], why: {} }], { bad: "선분으로만 둘러싸여 있고, 닫혀 있는 도형을 골라요.", ok: "가, 나, 마, 바가 다각형이에요. 오목하게 들어간 모양도 선분으로만 둘러싸여 있으면 다각형이에요." }),
        (bx, ax) => quiz(bx, ax, [
          { q: "다는 왜 다각형이 아닐까요?", o: ["굽은 선이 포함되어 있어서", "변이 너무 적어서", "열려 있어서"], a: 0 },
          { q: "라는 왜 다각형이 아닐까요?", o: ["굽은 선이 있어서", "일부분이 열려 있어서", "변의 길이가 달라서"], a: 1 }], { ok: "다는 굽은 선이 포함되어 있고, 라는 일부분이 열려 있어서 다각형이 아니에요." })]) },
    { name: "그려 보기", inst: "점 종이에 다각형을 그려 보세요. 점을 차례로 눌러 선분을 긋고, 처음 점을 다시 누르면 다각형이 닫혀요.", hints: ["주어진 선분(노란 선)의 끝에서 이어 그어요. 곧은 선만 써요.", "선분들이 서로 떨어지지 않고 맞닿아 있게 그려요.", "팔각형은 선분 8개를 이어 그려요."],
      render: (b, a) => p6Chain(b, a, [
        { title: "① 주어진 선분을 이용하여 여러 가지 모양의 다각형을 완성해요.", run: (bx, ax) => p6Dots(bx, ax, { grid: { type: "sq", cols: 10, rows: 6, gap: 50 }, tasks: [{ given: [[1, 4], [1, 1], [3, 1]], label: "주어진 선분에 이어 다각형 완성하기 ①" }, { given: [[6, 1], [8, 2], [8, 4]], label: "주어진 선분에 이어 다각형 완성하기 ②" }], ok: "주어진 선분에 맞닿도록 다른 선분을 이어 다각형을 완성했어요." }) },
        { title: "② 점 종이에 팔각형, 육각형, 오각형을 그리고 변과 꼭짓점을 세어 봐요.", run: (bx, ax) => p6Dots(bx, ax, { grid: { type: "sq", cols: 12, rows: 7, gap: 46 }, tasks: [{ n: 8, label: "팔각형 그리기" }, { n: 6, label: "육각형 그리기" }, { n: 5, label: "오각형 그리기" }],
          ask: [{ parts: ["팔각형: 변 ", { n: 8 }, "개, 꼭짓점 ", { n: 8 }, "개 / 육각형: 변 ", { n: 6 }, "개, 꼭짓점 ", { n: 6 }, "개 / 오각형: 변 ", { n: 5 }, "개, 꼭짓점 ", { n: 5 }, "개"] },
            { q: "알게 된 점", parts: ["다각형은 변의 수와 꼭짓점의 수가 ", { o: ["같아요", "달라요"], a: 0 }, "."] }], ok: "다각형은 변의 수와 꼭짓점의 수가 같아요." }) }]) },
    { name: "약속하기", inst: "다각형 가~아를 변의 수에 따라 분류해 보세요. ‘변에 번호 붙이기’를 누르면 세기 쉬워요.", hints: ["변은 다각형을 둘러싸고 있는 선분이에요.", "오목하게 들어간 곳의 변도 빠뜨리지 말고 세어요."],
      render: (b, a) => p6Sort(b, a, { cats: ["변 5개", "변 6개", "변 7개", "변 8개"], nums: true, items: P6_SIDES.map((S, i) => ({ S, cat: P6_SIDECAT[i], why: `${P6_KO[i]}의 변을 번호를 붙여 다시 세어 봐요.` })),
        ok: "변 5개: 가, 바 / 변 6개: 다, 마 / 변 7개: 나, 아 / 변 8개: 라, 사예요.",
        ask: [{ q: "약속하기", parts: ["다각형은 변의 수에 따라 변이 5개이면 ", { o: ["오각형", "육각형", "칠각형", "팔각형"], a: 0 }, ", 변이 6개이면 ", { o: ["오각형", "육각형", "칠각형", "팔각형"], a: 1 }, ", 변이 7개이면 ", { o: ["오각형", "육각형", "칠각형", "팔각형"], a: 2 }, ", 변이 8개이면 ", { o: ["오각형", "육각형", "칠각형", "팔각형"], a: 3 }, "이라고 부릅니다."] }] }) },
    { name: "확인하기", inst: "교통안전 표지에서 찾을 수 있는 다각형의 이름을 써 보고, 도형판에 다각형으로 작품을 만들어 보세요.", hints: ["표지판 테두리의 변을 세어 봐요.", "도형판에서는 점을 차례로 눌러 다각형을 여러 개 만들어요."],
      render: (b, a) => p6Chain(b, a, [
        (bx, ax) => p6Ask(bx, ax, [{ fig: () => p6Signs(), parts: ["횡단보도 표지: ", { o: P6_NAMES6, a: 2 }, " / 자전거 전용 표지: ", { o: P6_NAMES6, a: 1 }, " / 정지 표지: ", { o: P6_NAMES6, a: 5, why: { "4": "정지 표지의 변을 번호를 붙이며 다시 세어 봐요." } }] }], { ok: "횡단보도 표지는 오각형, 자전거 전용 표지는 사각형, 정지 표지는 팔각형이에요." }),
        { title: "도형판에 다각형을 이용하여 작품을 만들어요. (다각형 3개 이상)", run: (bx, ax) => p6Dots(bx, ax, { grid: { type: "sq", cols: 11, rows: 8, gap: 44 }, free: { min: 3 }, tip: "점을 차례로 눌러 다각형을 만들고 처음 점을 다시 눌러 닫아요. 여러 개 만들어 작품을 꾸며요.",
          then: (box, ap, made) => writeStep(box, ap, [{ q: `작품의 이름과 이용한 다각형을 설명해 보세요. (만든 다각형: ${made.map(m => m.label).join(", ")})`, tag: "작품 설명", ph: "예) 나는 사각형과 육각형을 이용하여 비행기를 만들었어. 사각형은 변과 꼭짓점이 4개씩이야." }], { ok: "다각형으로 멋진 작품을 만들고 설명했어요." }) }) }]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 다각형을 찾고 이름을 알아보세요.", hints: ["다각형은 선분으로만 둘러싸인 도형이에요.", "꼭짓점을 하나씩 짚으며 세어요."],
    render: (b, a) => quiz(b, a, [
      { q: "다각형의 이름을 골라요. (가)", fig: () => p6Cards([p6S(p6Blob(7, [1.5, 1.3, 1.6], 5)), p6S(p6Blob(10, [1.6, 1.25], 0))], { per: 2, cw: 220, ch: 190, maxW: "26em", shape: { dots: true, nums: false } }), o: ["육각형", "칠각형", "팔각형"], a: 1 },
      { q: "다각형의 이름을 골라요. (나)", o: ["팔각형", "구각형", "십각형"], a: 2, why: { "0": "꼭짓점을 하나씩 짚으며 다시 세어 봐요.", "1": "꼭짓점을 하나씩 짚으며 다시 세어 봐요." } },
      { q: "팔각형을 보고 옳게 설명한 것은?  ㉠ 변이 9개입니다.  ㉡ 꼭짓점이 8개입니다.  ㉢ 다각형의 이름은 칠각형입니다.", o: ["㉠", "㉡", "㉢"], a: 1 }], { ok: "가는 칠각형, 나는 십각형이에요. 팔각형은 변과 꼭짓점이 8개씩이에요." }) }
},
{
  id: "t4", no: 4, title: "정다각형을 알아볼까요", soop: "개념 구축하기(O)",
  question: "변의 길이와 각의 크기에 따라 다각형을 어떻게 분류할 수 있을까요?",
  summary: "변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형을 정다각형이라고 해요. 정삼각형, 정사각형, 정오각형, 정육각형 …처럼 변의 수에 따라 이름을 붙여요. 마름모처럼 변의 길이만 같거나, 직사각형처럼 각의 크기만 같은 다각형은 정다각형이 아니에요.",
  steps: [
    { name: "분류하기", inst: "제1 전시실 천장의 모빌에 매달린 다각형 가~바예요. ‘자와 각도기로 재기’를 눌러 변의 길이와 각의 크기를 재고 분류해 보세요.", hints: ["재기를 누르면 변의 길이(cm)와 각의 크기가 나타나요.", "변의 길이와 각의 크기를 따로따로 살펴봐요."],
      render: (b, a) => p6Chain(b, a, [
        { title: "① 변의 길이에 따라 분류해요.", run: (bx, ax) => p6Sort(bx, ax, { cats: ["변의 길이가 모두 같은 다각형", "변의 길이가 모두 같지는 않은 다각형"], measure: true, unit: "cm", items: P6_MOB.map((S, i) => ({ S, cat: i === 0 ? 1 : 0, why: `${P6_KO[i]}의 변의 길이를 다시 재어 봐요.` })), ok: "변의 길이가 모두 같은 다각형은 나, 다, 라, 마, 바예요." }) },
        { title: "② 각의 크기에 따라 분류해요.", run: (bx, ax) => p6Sort(bx, ax, { cats: ["각의 크기가 모두 같은 다각형", "각의 크기가 모두 같지는 않은 다각형"], measure: true, unit: "cm", items: P6_MOB.map((S, i) => ({ S, cat: i === 0 || i === 5 ? 1 : 0, why: `${P6_KO[i]}의 각의 크기를 다시 재어 봐요.` })), ok: "각의 크기가 모두 같은 다각형은 나, 다, 라, 마예요." }) },
        (bx, ax) => quiz(bx, ax, [{ q: "변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형을 모두 골라요.", o: P6_KO.slice(0, 6), a: [1, 2, 3, 4], why: {} }], { bad: "바는 변의 길이는 모두 같지만 각의 크기가 모두 같지는 않아요. 가는 변의 길이도 각의 크기도 모두 같지는 않아요.", ok: "나, 다, 라, 마는 변의 길이도 모두 같고 각의 크기도 모두 같아요." })]) },
    { name: "약속하기", inst: "약속: 알맞은 말을 골라 정다각형의 뜻을 완성해 보세요.", hints: ["변과 각을 함께 생각해요."],
      render: (b, a) => p6Ask(b, a, [{ fig: () => p6Cards([p6Reg(3, 2), p6Reg(4, 2), p6Reg(5, 2), p6Reg(6, 2)].map(p6S), { per: 4, cw: 170, ch: 160, maxW: "36em", shape: { dots: true } }),
        parts: [{ o: ["변의 길이가 모두 같고, 각의 크기가 모두 같은", "변의 길이만 모두 같은", "각의 크기만 모두 같은"], a: 0 }, " 다각형을 정다각형이라고 합니다. 위의 정다각형은 차례로 정삼각형, ", { o: ["정사각형", "직사각형"], a: 0 }, ", ", { o: ["정오각형", "오각형"], a: 0 }, ", 정육각형이에요."] }], { ok: "변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형을 정다각형이라고 해요." }) },
    { name: "찾아 보기", inst: "정다각형을 찾아봅시다. 도형 가~마의 변의 길이와 각의 크기를 보고 답해 보세요.", hints: ["비스듬히 놓여 있어도 변의 길이와 각의 크기가 모두 같으면 정다각형이에요.", "변의 길이와 각의 크기를 모두 살펴봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "정다각형을 모두 골라요.", fig: () => p6Cards(P6_REGQ, { per: 2, cw: 380, ch: 320, maxW: "36em", shape: { measure: true, unit: "cm", fs: 19, pad: 60 } }), o: P6_KO.slice(0, 5), a: [0, 2, 4], why: {} },
        { q: "나가 정다각형이 아닌 까닭은?", o: ["각의 크기는 모두 같지만 변의 길이가 모두 같지 않아서", "변의 길이는 모두 같지만 각의 크기가 모두 같지 않아서", "비스듬히 놓여 있어서"], a: 0 },
        { q: "라가 정다각형이 아닌 까닭은?", o: ["변의 길이와 각의 크기가 모두 같지 않아서", "변이 6개라서", "굽은 선이 있어서"], a: 0 }], { bad: "변의 길이와 각의 크기를 함께 살펴봐요. 비스듬히 놓인 도형도 다시 봐요.", ok: "가, 다, 마가 정다각형이에요. 나는 각의 크기만 같고, 라는 변의 길이와 각의 크기가 모두 같지 않아요." }) },
    { name: "구하기", inst: "정육각형을 보고 □ 안에 알맞은 수를 써넣어 보세요.", hints: ["정다각형은 변의 길이가 모두 같아요.", "정다각형은 각의 크기가 모두 같아요."],
      render: (b, a) => { b.append(p6Fig(420, 340, s => {
          const P = p6Reg(6, 2), m = p6Fit(P, 420, 340, 60), Q = P.map(m);
          s.append(svgEl("polygon", { points: p6PtsAttr(Q), fill: "#FFF1C7", stroke: INK, "stroke-width": 4 }));
          const lab = (i, t) => { const [mid, nv] = p6Out(Q, i); s.append(txt(p6R(mid[0] + nv[0] * 22), p6R(mid[1] + nv[1] * 22), t, 22, { fill: "#2B5FA8" })); };
          lab(0, "2 cm"); lab(2, "□ cm");
          const ang = (i, t) => { const c = p6Cen(Q), v = [c[0] - Q[i][0], c[1] - Q[i][1]], l = Math.hypot(...v); s.append(txt(p6R(Q[i][0] + v[0] / l * 38), p6R(Q[i][1] + v[1] / l * 38), t, 21, { fill: "#B4610F" })); };
          ang(1, "120°"); ang(4, "□°");
        }, "22em"));
        numbers(b, a, [{ q: "□ cm", a: 2, unit: "cm" }, { q: "□°", a: 120, unit: "°", why: { "60": "정육각형의 한 각은 120°로 표시되어 있어요. 정다각형은 각의 크기가 모두 같아요." } }], { ok: "정다각형은 변의 길이가 모두 같으므로 2 cm, 각의 크기가 모두 같으므로 120°예요." }); } },
    { name: "만들어 보기", inst: "원형 도형판에 정다각형을 만들어 보세요. 원형 도형판의 점과 점 사이의 간격을 살펴보며 만들어요.", hints: ["점 12개가 같은 간격으로 놓여 있어요.", "정삼각형은 4칸씩, 정사각형은 3칸씩, 정육각형은 2칸씩 건너뛰며 이어요."],
      render: (b, a) => p6Dots(b, a, { grid: { type: "circ", n: 12, r: 170 }, tasks: [{ n: 3, reg: true, label: "정삼각형 만들기" }, { n: 4, reg: true, label: "정사각형 만들기" }, { n: 6, reg: true, label: "정육각형 만들기" }],
        tip: "점을 차례로 눌러 선분을 긋고, 처음 점을 다시 누르면 닫혀요.",
        ask: [{ parts: ["정사각형은 변이 ", { n: 4 }, "개, 꼭짓점이 ", { n: 4 }, "개인 정다각형이에요. 정다각형의 변의 수가 많아질수록 모양이 ", { o: ["원", "삼각형"], a: 0 }, "에 가까워져요."] }], ok: "점과 점 사이의 간격이 같게 이으면 정다각형이 돼요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 정다각형에 대해 알아보세요.", hints: ["정다각형은 변의 길이가 모두 같고 각의 크기가 모두 같아요.", "선분 9개로 둘러싸인 다각형은 구각형이에요."],
    render: (b, a) => p6Ask(b, a, [
      { q: "설명하는 도형의 이름은? • 각의 크기가 모두 같습니다. • 길이가 같은 선분 9개로 둘러싸여 있습니다.", parts: [{ o: ["구각형", "정구각형", "정팔각형"], a: 1, why: { "0": "변의 길이와 각의 크기가 모두 같으니 정다각형이에요.", "2": "선분 9개로 둘러싸여 있어요." } }] },
      { q: "한 변이 8 cm인 정육각형이에요. 다른 한 변의 길이와 한 각의 크기는?", parts: ["변: ", { n: 8 }, " cm, 각: ", { n: 120 }, "°"] },
      { q: "직사각형이 정다각형이 아닌 까닭은?", parts: [{ o: ["네 변의 길이가 같지 않기 때문입니다.", "네 각의 크기가 같지 않기 때문입니다.", "변이 4개이기 때문입니다."], a: 0 }] }], { ok: "정구각형, 8 cm와 120°예요. 직사각형은 네 각은 같지만 네 변의 길이가 같지 않아요." }) }
},
{
  id: "t5", no: 5, title: "대각선을 알아볼까요", soop: "개념 구축하기(O)",
  question: "다각형에서 대각선은 어떤 선분일까요? 사각형의 대각선에는 어떤 성질이 있을까요?",
  summary: "다각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분을 대각선이라고 해요. 삼각형은 꼭짓점이 모두 이웃하여 대각선이 없고, 사각형은 2개, 오각형은 5개예요. 변의 수가 많아질수록 대각선이 많아져요. 직사각형·정사각형은 두 대각선의 길이가 같고, 마름모·정사각형은 두 대각선이 수직으로 만나요.",
  steps: [
    { name: "접어 보기", inst: "제2 전시실 체험 공간이에요. 은하처럼 색종이를 반으로 접었다 펴는 것을 두 번 해 보세요. 꼭짓점끼리 맞추어 삼각형 모양으로 접어요.", hints: ["꼭짓점 하나를 누르고 마주 보는 꼭짓점을 눌러요.", "두 번째에는 다른 두 꼭짓점을 맞추어요."],
      render: (b, a) => p6Fold(b, a, { ask: [{ parts: ["색종이에 생긴 선은 ", { n: 2 }, "개이고, 서로 ", { o: ["마주 보는", "이웃한"], a: 0 }, " 꼭짓점을 이은 선이에요."] }], ok: "색종이를 접었다 펴니 마주 보는 꼭짓점을 이은 선이 2개 생겼어요." }) },
    { name: "이어 보기", inst: "보기처럼 사각형 ㄱㄴㄷㄹ에서 서로 이웃하지 않는 두 꼭짓점끼리 이어 보세요.", hints: ["꼭짓점 ㄱ과 이웃한 꼭짓점은 ㄴ과 ㄹ이에요.", "ㄱ과 ㄷ, ㄴ과 ㄹ을 이어요."],
      render: (b, a) => p6Diag(b, a, { shapes: [{ pts: [[0, 0], [4.2, 0], [5, 2.8], [.6, 3.2]], label: "사각형 ㄱㄴㄷㄹ" }],
        ask: [{ parts: ["그은 선분은 선분 ㄱㄷ과 선분 ", { o: ["ㄴㄹ", "ㄱㄴ", "ㄷㄹ"], a: 0, why: { "1": "선분 ㄱㄴ은 사각형의 변이에요.", "2": "선분 ㄷㄹ은 사각형의 변이에요." } }, "이에요."] }], ok: "선분 ㄱㄷ과 선분 ㄴㄹ을 그었어요." }) },
    { name: "약속하기", inst: "약속: 대각선의 뜻을 알아보고, 대각선을 옳게 그은 것을 찾아보세요.", hints: ["대각선은 꼭짓점과 꼭짓점을 이어야 해요.", "변 위의 점을 이은 선분은 대각선이 아니에요."],
      render: (b, a) => p6Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["다각형에서 선분 ㄱㄷ, 선분 ㄴㄹ과 같이 서로 ", { o: ["이웃하지 않는", "이웃하는"], a: 0 }, " 두 꼭짓점을 이은 선분을 ", { o: ["대각선", "변", "수선"], a: 0 }, "이라고 합니다."]),
        (bx, ax) => { const P = p6Blob(5, [1.5], -90); return quiz(bx, ax, [{ q: "대각선을 옳게 그은 것을 골라요.",
          fig: () => p6Cards([p6SegCard(P, P[0], P[2]), p6SegCard(P, P[0], [(P[2][0] + P[3][0]) / 2, (P[2][1] + P[3][1]) / 2]), p6SegCard(P, [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2], [(P[3][0] + P[4][0]) / 2, (P[3][1] + P[4][1]) / 2]), p6SegCard(P, P[1], P[2])], { per: 4, cw: 180, ch: 170, maxW: "40em" }),
          o: P6_KO.slice(0, 4), a: 0, why: { "1": "나는 꼭짓점과 변 위의 점을 이었어요. 대각선은 꼭짓점과 꼭짓점을 이어요.", "2": "다는 변 위의 두 점을 이었어요. 도형을 가로지른다고 대각선이 아니에요.", "3": "라는 이웃한 두 꼭짓점을 이은 선분이라 변이에요." } }], { ok: "가처럼 이웃하지 않는 두 꼭짓점을 이은 선분이 대각선이에요." }); }]) },
    { name: "그어 보기", inst: "삼각형, 사각형, 오각형에 대각선을 모두 긋고, 대각선의 수를 세어 보세요. 그을 수 없으면 ‘대각선을 그을 수 없어요’를 눌러요.", hints: ["한 꼭짓점에서 그을 수 있는 대각선을 먼저 모두 그어요.", "같은 대각선을 두 번 세지 않게 해요."],
      render: (b, a) => p6Diag(b, a, { none: true, shapes: [{ pts: [[0, 3], [3.6, 3], [1.4, 0]], label: "삼각형" }, { pts: [[0, 0], [3.8, .4], [4.4, 3], [.4, 3.2]], label: "사각형" }, { pts: [[1.8, 0], [4, 1.4], [3.4, 3.6], [.6, 3.8], [-.2, 1.6]], label: "오각형" }],
        ask: [{ parts: ["대각선의 수 ― 삼각형: ", { n: 0 }, "개, 사각형: ", { n: 2 }, "개, 오각형: ", { n: 5, why: { "10": "같은 대각선을 두 번 센 것 같아요. 그은 선분을 세어 봐요." } }, "개"] },
          { parts: ["삼각형은 꼭짓점이 모두 서로 ", { o: ["이웃하고 있어서", "떨어져 있어서"], a: 0 }, " 대각선을 그을 수 없어요. 변의 수가 많아질수록 대각선의 수는 ", { o: ["많아져요", "적어져요", "그대로예요"], a: 0 }, "."] }], ok: "오각형의 대각선을 모두 그으면 별 모양이 나타나요. 변의 수가 많아질수록 대각선을 더 많이 그을 수 있어요." }) },
    { name: "확인하기", inst: "평행사변형, 마름모, 직사각형, 정사각형에 대각선을 모두 긋고, 두 대각선의 길이와 만나는 각을 살펴보세요.", hints: ["대각선을 다 그으면 자와 각도기로 잰 값이 나타나요.", "아래 표에서 길이와 각을 비교해요."],
      render: (b, a) => p6Diag(b, a, { shapes: [
          { pts: [[0, 0], [4, 0], [5, 2.5], [1, 2.5]], label: "평행사변형", measure: true },
          { pts: [[0, 1.5], [2.5, 0], [5, 1.5], [2.5, 3]], label: "마름모", measure: true },
          { pts: [[0, 0], [4, 0], [4, 2.5], [0, 2.5]], label: "직사각형", measure: true },
          { pts: [[0, 0], [3, 0], [3, 3], [0, 3]], label: "정사각형", measure: true }],
        ask: [{ q: "두 대각선의 길이가 같은 사각형을 모두 골라요.", parts: [{ o: ["평행사변형", "마름모", "직사각형", "정사각형"], a: [2, 3], multi: true }] },
          { q: "두 대각선이 서로 수직으로 만나는 사각형을 모두 골라요.", parts: [{ o: ["평행사변형", "마름모", "직사각형", "정사각형"], a: [1, 3], multi: true }] },
          { q: "알게 된 점", parts: ["네 사각형 모두 한 대각선이 다른 대각선을 똑같이 ", { o: ["둘로", "셋으로"], a: 0 }, " 나눠요. 정사각형의 두 대각선은 길이가 같고, 서로 ", { o: ["수직으로", "평행하게"], a: 0 }, " 만나요."] }],
        ok: "직사각형·정사각형은 두 대각선의 길이가 같고, 마름모·정사각형은 두 대각선이 수직으로 만나요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 육각형에 대각선을 모두 긋고, 잘못 말한 친구를 찾아보세요.", hints: ["육각형은 한 꼭짓점에서 대각선을 3개 그을 수 있어요.", "삼각형의 꼭짓점은 모두 서로 이웃해요."],
    render: (b, a) => p6Diag(b, a, { shapes: [{ pts: [[1, 0], [3.2, .2], [4.4, 1.8], [3.4, 3.6], [1.2, 3.6], [-.2, 1.8]], label: "육각형" }],
      ask: [{ parts: ["육각형의 대각선은 ", { n: 9, why: { "18": "같은 대각선을 두 번 센 것 같아요." } }, "개예요."] },
        { q: "대각선에 대해 잘못 말한 사람은? 효빈: “오각형의 한 꼭짓점에서 그을 수 있는 대각선은 2개야.” 민혁: “삼각형의 대각선은 1개야.” 서진: “사각형의 대각선은 2개야.”", parts: [{ o: ["효빈", "민혁", "서진"], a: 1, why: { "0": "오각형의 한 꼭짓점에서는 이웃하지 않는 꼭짓점이 2개라 대각선을 2개 그을 수 있어요.", "2": "사각형의 대각선은 2개가 맞아요." } }] }],
      ok: "육각형의 대각선은 9개예요. 삼각형은 대각선이 없으니 민혁이가 잘못 말했어요." }) }
},
{
  id: "t6", no: 6, title: "모양 만들기를 해 볼까요", soop: "탐구 정리하기(O)",
  question: "모양 조각으로 어떻게 여러 가지 모양을 만들 수 있을까요?",
  summary: "모양 조각에는 정삼각형, 정사각형, 평행사변형, 사다리꼴, 마름모, 정육각형이 있어요. 길이가 같은 변끼리 이어 붙이고, 서로 겹치지 않게 놓으면 여러 가지 모양을 만들 수 있어요. 같은 조각을 여러 번 쓰거나 돌리거나 뒤집어 써도 돼요.",
  steps: [
    { name: "살펴보기", inst: "제3 전시실 ‘모양 조각의 나라’예요. 모양 조각 6가지를 하나씩 눌러 어떤 다각형인지 살펴보세요.", hints: ["조각을 누르면 이름과 변·꼭짓점의 수가 나와요."],
      render: (b, a) => p6Explore(b, a, { ok: "모양 조각은 정삼각형, 정사각형, 평행사변형, 사다리꼴, 마름모, 정육각형이에요. 사다리꼴의 긴 변만 빼면 모든 변의 길이가 같아요." }) },
    { name: "찾아 보기", inst: "모양 조각으로 꾸민 마을이에요. 집, 꽃, 새를 만드는 데 사용한 모양 조각을 찾아보세요.", hints: ["조각의 변과 꼭짓점을 세어 봐요.", "가늘고 긴 조각은 마름모, 파란 조각은 평행사변형이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "집을 만드는 데 사용한 모양 조각을 모두 골라요.", fig: () => p6ArtFig(440, 210, 40, [P6_VIL.house, P6_VIL.flower, P6_VIL.bird], { maxW: "34em", bg: s => s.append(svgEl("rect", { x: 0, y: 0, width: 440, height: 210, fill: "#F4FAF2" }), svgEl("rect", { x: 0, y: 192, width: 440, height: 18, fill: "#CFE6C4" })), after: s => { s.append(svgEl("circle", { cx: 365, cy: 72, r: 3.5, fill: INK })); [[80, "집"], [222, "꽃"], [330, "새"]].forEach(([x, t]) => s.append(txt(x, 202, t, 15))); } }), o: P6_PBN, a: [1, 3], why: {} },
        { q: "꽃을 만드는 데 사용한 모양 조각을 모두 골라요.", o: P6_PBN, a: [0, 1, 4], why: {} },
        { q: "새를 만드는 데 사용한 모양 조각을 모두 골라요.", o: P6_PBN, a: [2, 4], why: {} }], { bad: "그림에서 조각을 하나씩 짚으며 변과 꼭짓점을 세어 봐요.", ok: "집은 사다리꼴과 정사각형, 꽃은 정삼각형·정사각형·마름모, 새는 평행사변형과 마름모로 만들었어요." }) },
    { name: "따라 만들기", inst: "은하처럼 우주선 작품과 같은 모양을 만들어 보세요. 조각 단추를 눌러 꺼내고, 끌어서 노란 점선 안에 놓아요.", hints: ["살짝 누르면 조각이 30°씩 돌아가요. 돌려서 점선과 같은 방향으로 맞춰요.", "변끼리 가까이 놓으면 저절로 붙어요. 같은 조각을 여러 번 써도 돼요."],
      render: (b, a) => p6Pieces(b, a, { W: 10, H: 6.4, U: 58, spawn: [8.4, 1.3], tasks: [{ type: "fill", targets: P6_SHIP.map(p => p.pts), label: "우주선 모양 만들기" }],
        ask: [{ q: "우주선을 만드는 데 사용한 모양 조각은 정삼각형과 무엇일까요? 모두 골라요.", parts: [{ o: ["정사각형", "평행사변형", "사다리꼴", "마름모", "정육각형"], a: [0, 1, 2, 3], multi: true }] },
          { q: "만든 방법", parts: ["길이가 같은 변끼리 이어 붙이고, 조각끼리 서로 ", { o: ["겹치지 않게", "겹치게"], a: 0 }, " 놓았어요. 같은 모양 조각을 여러 번 ", { o: ["사용할 수 있어요", "사용할 수 없어요"], a: 0 }, "."] }],
        ok: "정삼각형, 정사각형, 평행사변형, 사다리꼴, 마름모로 우주선을 만들었어요." }) },
    { name: "나만의 작품", inst: "모양 조각으로 나만의 작품을 만들어 보세요. 조각을 4개 이상 쓰고, 변과 변을 이어 붙여요.", hints: ["동물, 탈것, 건물 등 만들고 싶은 것을 먼저 정해요.", "조각끼리 겹치지 않고 떨어지지 않게 이어 붙여요."],
      render: (b, a) => p6Pieces(b, a, { W: 10, H: 6.4, U: 58, spawn: [8.4, 1.3], tasks: [{ type: "free", min: 4, label: "나만의 작품 만들기 (조각 4개 이상)" }],
        then: (box, ap, res) => writeStep(box, ap, [{ q: `작품 이름을 짓고, 사용한 모양 조각과 만든 방법을 설명해 보세요. (사용한 조각: ${res[0].say})`, tag: "작품 설명", ph: "예) 작품 이름: 거북 / 설명: 정삼각형, 정사각형, 평행사변형, 사다리꼴을 사용하여 거북을 만들었습니다. 모양 조각을 붙일 때에는 변과 변을 이어 붙였습니다." }], { ok: "작품을 만들고 만든 방법을 설명했어요." }) }) },
    { name: "칠교 만들기", inst: "칠교 조각으로 다각형을 만들어 보세요. 조각을 이어 붙여 하나의 다각형이 되면 ‘확인하기’를 누르고 이름을 골라요.", hints: ["칠교 조각은 큰 삼각형 2개, 중간 삼각형 1개, 작은 삼각형 2개, 정사각형 1개, 평행사변형 1개예요.", "작은 삼각형 2개와 정사각형 1개로 큰 삼각형과 같은 모양을 만들 수 있어요.", "살짝 누르면 45°씩 돌아가요. 평행사변형은 ‘뒤집기’도 할 수 있어요."],
      render: (b, a) => p6Pieces(b, a, { set: "tg", W: 9, H: 6, U: 62, spawn: [7.6, 1.3], tasks: [{ type: "make", count: 3, nameIt: true, label: "칠교 조각 3개로 다각형 만들기" }, { type: "make", count: 4, nameIt: true, label: "칠교 조각 4개로 다각형 만들기" }],
        ok: "칠교 조각으로 다각형을 만들고 이름을 알아보았어요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 모양 조각으로 오각형을 만들고, 칠교 조각으로 직사각형을 만들어 보세요.", hints: ["정사각형 위에 정삼각형을 붙이면 집 모양이 돼요. 변을 세어 봐요.", "작은 삼각형 2개를 긴 변끼리 붙이면 정사각형, 정사각형 옆에 붙이면 직사각형이 될 수 있어요."],
    render: (b, a) => p6Chain(b, a, [
      { title: "① 모양 조각으로 오각형 만들기", run: (bx, ax) => p6Pieces(bx, ax, { W: 9, H: 5.6, U: 58, spawn: [7.6, 1.3], tasks: [{ type: "make", n: 5, label: "오각형 만들기" }], ok: "모양 조각으로 오각형을 만들었어요." }) },
      { title: "② 칠교 조각으로 직사각형 만들기", run: (bx, ax) => p6Pieces(bx, ax, { set: "tg", W: 9, H: 6, U: 62, spawn: [7.6, 1.3], tasks: [{ type: "make", isA: "직사각형", min: 2, label: "직사각형 만들기 (조각 2개 이상)" }], ok: "칠교 조각으로 직사각형을 만들었어요." }) }]) }
},
{
  id: "t7", no: 7, title: "모양 채우기를 해 볼까요", soop: "탐구 정리하기(O)",
  question: "모양 조각으로 주어진 모양을 어떻게 빈틈없이 채울 수 있을까요?",
  summary: "모양 채우기는 모양 조각을 서로 겹치지 않게, 빈틈없이 이어 붙여 주어진 모양을 채우는 거예요. 정육각형은 정삼각형 6개, 평행사변형 3개, 사다리꼴 2개, 정육각형 1개로 채울 수 있고, 두 가지 조각을 섞어서도 채울 수 있어요. 같은 모양도 여러 가지 방법으로 채울 수 있어요.",
  steps: [
    { name: "한 가지로 채우기", inst: "벽에 붙은 작품은 정육각형으로 채워져 있어요. 한 가지 모양 조각만 사용하여 정육각형을 채워 보세요. 세 번 모두 다른 조각으로 채워요.", hints: ["정삼각형, 평행사변형, 사다리꼴, 정육각형 중 하나를 골라 같은 조각만 써요.", "서로 겹치지 않게 빈틈없이 채워야 해요."],
      render: (b, a) => p6Pieces(b, a, { W: 8, H: 4.4, U: 66, spawn: [6.6, 1.2], kinds: ["tri", "sq", "par", "trap", "rh", "hex"], tasks: [1, 2, 3].map(i => ({ type: "fill", kinds: 1, diff: true, group: "one", targets: [p6Hex(2, 3.2)], label: `한 가지 조각으로 채우기 ${"①②③"[i - 1]}` })),
        ask: [{ q: "정육각형 하나를 채우려면 조각이 몇 개 필요할까요?", parts: ["정삼각형만: ", { n: 6 }, "개, 평행사변형만: ", { n: 3 }, "개, 사다리꼴만: ", { n: 2 }, "개"] }], ok: "정육각형은 정삼각형 6개, 평행사변형 3개, 사다리꼴 2개로 채울 수 있어요." }) },
    { name: "두 가지로 채우기", inst: "이번에는 두 가지 모양 조각을 사용하여 정육각형을 채워 보세요. 두 번 모두 다른 방법으로 채워요.", hints: ["사다리꼴 1개와 정삼각형 3개로 채울 수 있어요.", "평행사변형과 정삼각형을 함께 써도 돼요."],
      render: (b, a) => p6Pieces(b, a, { W: 8, H: 4.4, U: 66, spawn: [6.6, 1.2], kinds: ["tri", "sq", "par", "trap", "rh", "hex"], tasks: [1, 2].map(i => ({ type: "fill", kinds: 2, diff: true, group: "two", targets: [p6Hex(2, 3.2)], label: `두 가지 조각으로 채우기 ${"①②"[i - 1]}` })),
        then: (box, ap, res) => writeStep(box, ap, [{ q: `채운 방법을 설명해 보세요. (① ${res[0].say} / ② ${res[1].say})`, tag: "채운 방법", ph: "예) 사다리꼴 1개와 정삼각형 3개를 겹치지 않게 빈틈없이 이어 붙여 정육각형을 채웠어요." }], { ok: "두 가지 조각으로 정육각형을 채우고 방법을 설명했어요." }) }) },
    { name: "물고기 채우기", inst: "어항에 그려진 물고기 그림이에요. 위의 그림과 다른 방법으로 물고기 그림을 채워 보세요.", hints: ["작은 조각으로 먼저 채운 뒤 큰 조각으로 바꾸어 보아요.", "위 그림은 정육각형 1개, 사다리꼴 8개, 정삼각형 2개를 썼어요. 다른 조각을 섞어 봐요."],
      render: (b, a) => { b.append(h("p", { class: "p6small" }, "은하가 채운 물고기 (정육각형 1개, 사다리꼴 8개, 정삼각형 2개)"), p6ArtFig(10 * 30, 5 * 30, 30, [P6_FISH.ex], { maxW: "16em", after: s => s.append(svgEl("circle", { cx: P6_FISH.eye[0] * 30, cy: P6_FISH.eye[1] * 30, r: 4, fill: INK })) }));
        p6Pieces(b, a, { W: 10, H: 5, U: 60, spawn: [8.6, 1.2], tasks: [{ type: "fill", targets: [P6_FISH.outline], not: p6MS(P6_FISH.ex), label: "다른 방법으로 물고기 채우기" }],
          then: (box, ap, res) => writeStep(box, ap, [{ q: `어떤 조각을 사용하여 채웠는지 써 보세요. (사용한 조각: ${res[0].say})`, tag: "채운 방법", ph: "예) 정삼각형, 평행사변형, 사다리꼴, 마름모를 사용하여 채웠습니다." }], { ok: "물고기 그림을 다른 방법으로 채웠어요." }) }); } },
    { name: "엽서 꾸미기", inst: "모양 채우기로 엽서를 꾸며요. 닭 모양을 모양 조각으로 빈틈없이 채우고, 친구에게 엽서를 써 보세요.", hints: ["머리, 볏, 부리, 꼬리, 발 모양을 보고 맞는 조각을 찾아봐요.", "볏과 부리는 정삼각형, 머리는 정사각형 크기예요."],
      render: (b, a) => p6Pieces(b, a, { W: 8, H: 5.4, U: 70, spawn: [6.8, 1.2], tasks: [{ type: "fill", targets: [p6Outline(P6_CHICK.pieces.map(p => p.pts)).P], label: "닭 모양 채우기" }],
        deco: (g, U) => g.append(svgEl("rect", { x: 4, y: 4, width: 8 * U - 8, height: 5.4 * U - 8, rx: 14, fill: "#FFFBF2", stroke: "#E8D3B0", "stroke-width": 3 })),
        then: (box, ap, res) => writeStep(box, ap, [{ q: `친구에게 엽서를 써 보세요. 채운 방법이 들어가게 써요. (사용한 조각: ${res[0].say})`, tag: "엽서", ph: "예) 민수에게 / 이 엽서는 정삼각형, 정사각형, 평행사변형, 정육각형, 마름모를 사용하여 닭 모양을 채운 거야. 너의 마음에 들었으면 좋겠다. 다음에는 같이 체험을 해 보자. 안녕." }], { ok: "모양 채우기로 엽서를 꾸미고 편지를 썼어요." }) }) },
    { name: "확인하기", inst: "정육각형 2개를 붙여 만든 모양이에요. 한 가지 모양 조각으로 빈틈없이 채우려면 조각이 몇 개 필요할까요?", hints: ["정육각형 1개는 정삼각형 6개, 평행사변형 3개, 사다리꼴 2개로 채울 수 있어요.", "정육각형이 2개이니 두 배를 해요."],
      render: (b, a) => { b.append(p6Fig(360, 220, s => { const U = 60, g = svgEl("g"); [p6Hex(1.6, 3), p6Hex(3.1, 3 - P6_H)].forEach(P => g.append(svgEl("polygon", { points: P.map(p => `${p6R(p[0] * U)},${p6R(p[1] * U)}`).join(" "), fill: "#FFF1C7", stroke: "#B08A1E", "stroke-width": 4, "stroke-linejoin": "round" }))); s.append(g); }, "18em"));
        numbers(b, a, [{ q: "정삼각형만으로", a: 12, unit: "개", why: { "6": "정육각형 1개를 채우는 수예요. 정육각형이 2개예요." } }, { q: "평행사변형만으로", a: 6, unit: "개", why: { "3": "정육각형 1개를 채우는 수예요. 정육각형이 2개예요." } }, { q: "사다리꼴만으로", a: 4, unit: "개", why: { "2": "정육각형 1개를 채우는 수예요. 정육각형이 2개예요." } }], { ok: "정삼각형 12개, 평행사변형 6개, 사다리꼴 4개가 필요해요." }); } }
  ],
  challenge: { inst: "수학익힘 문제예요. 한 가지 모양 조각만 사용하여 평행사변형을 빈틈없이 채워 보세요.", hints: ["정삼각형이나 평행사변형 조각으로 채울 수 있어요.", "돌려서 방향을 맞춰요."],
    render: (b, a) => p6Pieces(b, a, { W: 8, H: 4, U: 66, spawn: [6.8, 1.2], tasks: [{ type: "fill", kinds: 1, targets: [p6Mv([[0, 0], [2, 0], [3, -2 * P6_H], [1, -2 * P6_H]], 1, 3)], label: "한 가지 조각으로 평행사변형 채우기" }],
      ask: [{ q: "이 평행사변형을 채우려면 조각이 몇 개 필요할까요?", parts: ["정삼각형만: ", { n: 8 }, "개, 평행사변형 조각만: ", { n: 4 }, "개"] }], ok: "정삼각형 8개 또는 평행사변형 조각 4개로 채울 수 있어요." }) }
},
{
  id: "t8", no: 8, title: "생각을 더하다 ― 공학 도구를 사용하여 나만의 모양을 만들어 볼까요", soop: "탐구 정리하기(O)",
  question: "공학 도구로 다각형을 어떻게 만들 수 있을까요? 만든 다각형으로 어떤 모양을 만들 수 있을까요?",
  summary: "공학 도구의 ‘다각형’ 메뉴는 꼭짓점을 차례대로 누르고 마지막에 처음 꼭짓점을 다시 눌러 다각형을 만들어요. ‘정다각형 : 한 변’ 메뉴는 두 점으로 한 변을 정하고 꼭짓점의 수를 넣어 정다각형을 만들어요. 만든 다각형을 복제하고 옮겨 나만의 모양을 만들 수 있어요.",
  steps: [
    { name: "다각형 만들기", inst: "공학 도구의 ‘다각형’ 메뉴로 삼각형, 사다리꼴, 평행사변형, 육각형을 만들어 보세요.", hints: ["꼭짓점을 차례대로 누르고, 마지막에 처음 꼭짓점을 다시 눌러요.", "사다리꼴은 평행한 변이 한 쌍이라도 있어야 해요. 모눈의 가로줄을 따라 두 변을 그어 봐요."],
      render: (b, a) => p6Tool(b, a, { targets: ["삼각형", "사다리꼴", "평행사변형", "육각형"], ok: "다각형 메뉴로 주어진 다각형을 모두 만들었어요." }) },
    { name: "정다각형 만들기", inst: "‘정다각형 : 한 변’ 메뉴로 정사각형을 만들고, ‘다각형’ 메뉴로 마름모를 만들어 보세요.", hints: ["정다각형 메뉴에서 두 점을 눌러 한 변을 정하고, 점의 수에 4를 넣어요.", "마름모는 네 변의 길이가 모두 같아요. 가운데 점에서 위아래·양옆으로 같은 칸만큼 떨어진 네 점을 이어 봐요."],
      render: (b, a) => p6Tool(b, a, { targets: ["정사각형", "마름모"], ok: "정사각형과 마름모를 만들었어요. 정사각형도 네 변의 길이가 같은 마름모예요." }) },
    { name: "살펴보기", inst: "친구들이 공학 도구로 만든 등대와 배예요. 어떤 다각형을 사용했는지 찾아보세요.", hints: ["등대는 아래부터 탑, 불빛 방, 지붕이에요.", "배의 몸통은 마주 보는 두 쌍의 변이 평행해요."],
      render: (b, a) => quiz(b, a, [
        { q: "등대 모양을 만드는 데 사용한 다각형을 모두 골라요.", fig: () => p6Light(), o: ["삼각형", "정사각형", "사다리꼴", "마름모", "평행사변형"], a: [0, 1, 2], why: {} },
        { q: "배 모양을 만드는 데 사용한 다각형을 모두 골라요.", o: ["삼각형", "정사각형", "사다리꼴", "마름모", "평행사변형"], a: [3, 4], why: {} }], { ok: "등대는 사다리꼴·정사각형·삼각형, 배는 마름모·평행사변형으로 만들었어요." }) },
    { name: "나만의 모양", inst: "다각형을 만들고 ‘옮기기’와 ‘복제’로 나만의 모양을 만들어 보세요. 같은 모양을 여러 번 사용할 수 있어요. (다각형 4개 이상)", hints: ["복제를 누르면 모양과 크기가 같은 도형이 하나 더 생겨요.", "옮기기를 누르고 도형을 끌어 원하는 곳에 놓아요."],
      render: (b, a) => p6Tool(b, a, { free: { min: 4 },
        then: (box, ap, polys) => writeStep(box, ap, [{ q: `만든 모양의 이름과 사용한 다각형을 친구들에게 설명해 보세요. (만든 다각형: ${polys.map(p => p.name).join(", ")})`, tag: "나만의 모양", ph: "예) 난 등대 모양을 만들었어. 사다리꼴로 탑을, 정사각형으로 불빛 방을, 삼각형으로 지붕을 만들었어." }], { ok: "나만의 모양을 만들고 다각형의 이름을 말하며 설명했어요." }) }) },
    { name: "확인하기", inst: "공학 도구로 다각형을 만드는 방법을 정리해 보세요.", hints: ["다각형 메뉴는 처음 꼭짓점을 다시 눌러 닫아요.", "정다각형 메뉴의 점의 수가 꼭짓점의 수예요."],
      render: (b, a) => quiz(b, a, [
        { q: "‘다각형’ 메뉴에서 꼭짓점을 차례대로 누른 뒤 마지막에 무엇을 눌러야 다각형이 만들어질까요?", o: ["처음 꼭짓점", "아무 빈 곳", "마지막 꼭짓점"], a: 0 },
        { q: "‘정다각형 : 한 변’ 메뉴에서 두 점을 누르고 점의 수에 6을 넣으면 어떤 도형이 만들어질까요?", o: ["육각형", "정육각형", "정삼각형"], a: 1, why: { "0": "정다각형 메뉴로 만들면 변의 길이와 각의 크기가 모두 같아요." } },
        { q: "모양과 크기가 같은 도형을 여러 개 만들 때 쓰는 기능은?", o: ["복제", "지우기", "취소"], a: 0 }], { ok: "처음 꼭짓점을 다시 눌러 닫고, 점의 수 6이면 정육각형, 같은 도형은 복제로 만들어요." }) }
  ],
  challenge: { inst: "‘정다각형 : 한 변’ 메뉴로 정오각형과 정팔각형을 만들어 보세요.", hints: ["두 점으로 한 변을 정하고 점의 수에 5, 8을 넣어요.", "판 밖으로 나가면 한 변을 짧게 해요."],
    render: (b, a) => p6Tool(b, a, { targets: ["정오각형", "정팔각형"], ok: "정오각형과 정팔각형을 만들었어요. 변의 수가 많을수록 원에 가까워 보여요." }) }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 다각형의 이름에 맞게 색칠해 볼까요", soop: "발표하기(P)",
  question: "주사위 눈의 수에 맞는 다각형을 어떻게 빨리 찾을 수 있을까요?",
  summary: "주사위 눈의 수가 1이면 삼각형, 2이면 사각형, 3이면 오각형, 4이면 육각형, 5이면 칠각형, 6이면 팔각형을 찾아 색칠해요. 다각형의 변을 세어 이름을 알면 알맞은 다각형을 빨리 찾을 수 있어요.",
  steps: [
    { name: "놀이 방법", inst: "놀이 방법을 읽고, 주사위 눈의 수에 해당하는 다각형을 알아보세요. (2명, 색연필·주사위)", hints: ["눈의 수 1은 삼각형부터 시작해요.", "눈의 수에 2를 더하면 변의 수가 돼요."],
      render: (b, a) => { b.append(p6Tbl(["눈의 수", "1", "2", "3", "4", "5", "6"], [["다각형", "삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형"]]), h("ol", { class: "p6list" }, h("li", {}, "가위바위보로 놀이 순서를 정합니다."), h("li", {}, "주사위를 굴려 나온 눈의 수에 해당하는 다각형을 그림에서 한 개 골라 원하는 색으로 칠합니다."), h("li", {}, "색칠할 다각형을 찾지 못하거나 없으면 상대방에게 차례가 넘어갑니다."), h("li", {}, "2~3을 반복하여 그림을 완성합니다.")));
        quiz(b, a, [{ q: "주사위 눈의 수가 4이면 어떤 다각형을 칠할까요?", o: ["사각형", "육각형", "팔각형"], a: 1, why: { "0": "눈의 수 1이 삼각형이에요. 4이면 변이 6개인 다각형이에요." } },
          { q: "주사위 눈의 수가 6이면 어떤 다각형을 칠할까요?", o: ["육각형", "칠각형", "팔각형"], a: 2 },
          { q: "칠할 다각형이 그림에 없으면 어떻게 할까요?", o: ["상대방에게 차례가 넘어가요", "아무 다각형이나 칠해요", "주사위를 다시 굴려요"], a: 0 }], { ok: "눈 4는 육각형, 눈 6은 팔각형이에요. 칠할 다각형이 없으면 차례가 넘어가요." }); } },
    { name: "놀이 한 판", inst: "친구와 번갈아 주사위를 굴려 토끼 그림을 완성해 보세요. 그림을 이루는 다각형의 꼭짓점에 점이 찍혀 있어요.", hints: ["점(꼭짓점)을 세면 변의 수를 알 수 있어요.", "칠할 다각형이 없으면 ‘칠할 다각형이 없어요’를 눌러요."],
      render: (b, a) => p6Game(b, a, {}) },
    { name: "말해 보기", inst: "놀이를 하며 생각한 것을 말해 보세요.", hints: ["색칠보다 알맞은 다각형을 찾는 데 집중해요."],
      render: (b, a) => quiz(b, a, [
        { q: "놀이를 잘하려면 어떻게 해야 할까요?", o: ["눈의 수에 해당하는 다각형을 옳게 찾아요", "가장 큰 도형부터 칠해요", "색을 예쁘게 칠하는 데만 집중해요"], a: 0 },
        { q: "토끼 그림에서 칠각형은 어디에 있었나요?", o: ["귀", "코", "눈"], a: 0, why: { "1": "코는 변이 3개인 삼각형이에요.", "2": "눈은 변이 4개인 사각형이에요." } }], { ok: "변을 세어 알맞은 다각형을 찾았어요. 토끼의 귀는 칠각형이에요." }) },
    { name: "또 다른 놀이", inst: "주사위를 굴려 나온 눈의 수에 해당하는 다각형을 점 종이에 그려 보세요. 다각형의 한 변이 5개보다 많은 점을 연결하지 않게 그려요.", hints: ["눈 1 삼각형, 2 사각형, 3 오각형, 4 육각형, 5 칠각형, 6 팔각형이에요.", "변의 수만큼 선분을 그어 다각형을 그려요."],
      render: (b, a) => { const ds = [p6Pick6(), p6Pick6(), p6Pick6()];
        b.append(h("p", { class: "jua" }, `🎲 주사위를 세 번 굴렸어요: ${ds.join(", ")}`));
        p6Dots(b, a, { grid: { type: "sq", cols: 12, rows: 8, gap: 44 }, tasks: ds.map((d, i) => ({ n: d + 2, label: `${i + 1}번째 · 눈 ${d} → ${p6Name(d + 2)} 그리기` })), ok: "주사위 눈의 수에 맞는 다각형을 모두 그렸어요." }); } },
    { name: "확인하기", inst: "토끼 그림의 다각형을 떠올리며 답해 보세요.", hints: ["다각형의 이름은 변의 수로 정해요."],
      render: (b, a) => p6Ask(b, a, [{ parts: ["토끼의 머리처럼 변이 8개인 다각형은 ", { o: P6_NAMES6, a: 5 }, "이고, 발처럼 변이 6개인 다각형은 ", { o: P6_NAMES6, a: 3 }, "이에요. 주사위 눈이 ", { n: 3 }, "이면 오각형을 칠해요."] }], { ok: "변이 8개면 팔각형, 6개면 육각형이에요. 오각형은 눈 3이에요." }) }
  ],
  challenge: { inst: "다각형에 대해 친구가 말한 것이 옳은지 생각해 보세요.", hints: ["변의 수와 꼭짓점의 수는 같아요."],
    render: (b, a) => quiz(b, a, [
      { q: "“칠각형은 꼭짓점이 7개야.”", o: ["옳아요", "틀려요"], a: 0 },
      { q: "“눈의 수가 5이면 오각형을 칠해.”", o: ["옳아요", "틀려요"], a: 1, why: { "0": "눈의 수 5는 칠각형이에요. 눈의 수에 2를 더한 수가 변의 수예요." } },
      { q: "“팔각형을 칠하려면 주사위 눈이 6이 나와야 해.”", o: ["옳아요", "틀려요"], a: 0 }], { ok: "칠각형은 꼭짓점이 7개, 눈 5는 칠각형, 눈 6은 팔각형이에요." }) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "다각형, 정다각형, 대각선, 모양 만들기와 채우기를 잘 알고 있나요?",
  summary: "선분으로만 둘러싸인 도형이 다각형이고, 변의 수에 따라 이름을 붙여요. 변의 길이와 각의 크기가 모두 같은 다각형이 정다각형이에요. 이웃하지 않는 두 꼭짓점을 이은 선분이 대각선이에요. 모양 조각으로 모양을 만들거나 빈틈없이 채울 수 있어요.",
  steps: [
    { name: "1번", inst: "다각형을 모두 찾아 기호와 이름을 써 보세요.", hints: ["굽은 선이 있거나 열린 도형은 다각형이 아니에요.", "변의 수를 세어 이름을 붙여요."],
      render: (b, a) => p6Ask(b, a, [
        { fig: () => p6Cards([p6S(p6Blob(8, [1.5, 1.3], 10)), p6S([[0, 0], [3, .4], [2.6, 2.2], [.4, 1.8]]), p6Drop(), p6S(p6Blob(6, [1.5, 1.2, 1.4], 30)), { open: [[0, 2], [1.2, 0], [2.4, 2], [.4, 2]] }], { per: 5, cw: 190, ch: 170, maxW: "48em", shape: { dots: true } }),
          q: "다각형을 모두 골라요.", parts: [{ o: P6_KO.slice(0, 5), a: [0, 1, 3], multi: true }] },
        { q: "다각형의 이름을 골라요.", parts: ["가: ", { o: ["육각형", "칠각형", "팔각형"], a: 2 }, ", 나: ", { o: ["삼각형", "사각형", "오각형"], a: 1 }, ", 라: ", { o: ["오각형", "육각형", "칠각형"], a: 1 }] }],
        { bad: "다는 굽은 선이 있고, 마는 열려 있어요. 변을 세어 이름을 다시 살펴봐요.", ok: "가는 팔각형, 나는 사각형, 라는 육각형이에요." }) },
    { name: "2·3번", inst: "점 종이에 정다각형을 그리고, 정오각형에 대각선을 모두 그어 보세요.", hints: ["삼각 모눈의 선을 따라 그리면 변의 길이와 각의 크기를 같게 할 수 있어요.", "정오각형은 한 꼭짓점에서 대각선을 2개 그을 수 있어요."],
      render: (b, a) => p6Chain(b, a, [
        { title: "2. 정삼각형과 정육각형을 그려요.", run: (bx, ax) => p6Dots(bx, ax, { grid: { type: "tri", cols: 10, rows: 6, gap: 52 }, tasks: [{ n: 3, reg: true, label: "정삼각형 그리기" }, { n: 6, reg: true, label: "정육각형 그리기" }], ok: "변의 길이와 각의 크기가 모두 같게 그렸어요." }) },
        { title: "3. 정오각형에 대각선을 모두 그어요.", run: (bx, ax) => p6Diag(bx, ax, { shapes: [{ pts: p6Reg(5, 3), label: "정오각형" }], ask: [{ parts: ["정오각형의 대각선은 ", { n: 5, why: { "10": "같은 대각선을 두 번 셌어요." } }, "개예요."] }], ok: "정오각형의 대각선은 5개예요." }) }]) },
    { name: "4번", inst: "2가지 모양 조각을 모두 사용하여 정다각형을 만들어 보세요. 같은 조각을 여러 번 사용할 수 있어요.", hints: ["변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형을 만들어 볼까요?", "사다리꼴 위에 정삼각형을 올리면 큰 정삼각형이 돼요. 사다리꼴과 정삼각형으로 정육각형도 만들 수 있어요."],
      render: (b, a) => p6Pieces(b, a, { W: 9, H: 5.6, U: 58, spawn: [7.6, 1.3], tasks: [{ type: "make", kinds: 2, reg: true, label: "2가지 조각으로 정다각형 만들기" }], ok: "2가지 모양 조각으로 정다각형을 만들었어요." }) },
    { name: "5번", inst: "수호와 예지가 도형을 만들려고 해요. 수호: “변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형을 만들어 볼까?” 예지: “변이 8개이고, 한 변의 길이가 4 cm인 도형을 만들자.”", hints: ["정다각형이면서 변이 8개인 도형이에요.", "정다각형은 변의 길이가 모두 같으니 4 cm를 8번 더해요."],
      render: (b, a) => p6Ask(b, a, [{ q: "만들려고 하는 도형의 이름과 모든 변의 길이의 합을 구해 보세요.", parts: ["이름: ", { o: ["팔각형", "정팔각형", "정육각형"], a: 1, why: { "0": "변의 길이와 각의 크기가 모두 같으니 정다각형이에요.", "2": "변이 8개예요." } }, " / 모든 변의 길이의 합: ", { n: 32, why: { "12": "4와 8을 더했어요. 한 변의 길이를 변의 수만큼 더해요.", "16": "변을 4개만 더했어요. 변은 8개예요." } }, " cm"] }],
        { ok: "정팔각형이고, 4 × 8 = 32 (cm)예요." }) },
    { name: "낱말 찾기", inst: "꼭꼭! 확인하고 정리해요. 빈칸에 알맞은 낱말을 글자판에서 찾아보세요. (→ ↓ ↘ ↙ 방향)", hints: ["선분으로만 둘러싸인 도형, 변이 7개인 다각형을 떠올려요.", "‘정팔각형’은 ↘ 방향, ‘대각선’은 ↙ 방향에 숨어 있어요."],
      render: (b, a) => p6Words(b, a, { words: ["다각형", "칠각형", "정팔각형", "대각선"], sents: [["선분으로만 둘러싸인 도형을 ", "(이)라고 합니다."], ["변이 7개인 다각형을 ", "(이)라고 합니다."], ["길이가 같은 선분 8개로 둘러싸여 있고, 각의 크기가 모두 같은 도형을 ", "(이)라고 합니다."], ["다각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분을 ", "(이)라고 합니다."]] }) }
  ],
  challenge: { inst: "6번(★★): 3가지 모양 조각을 모두 사용하여 주어진 모양을 빈틈없이 채워 보세요. 같은 조각을 여러 번 사용할 수 있어요.", hints: ["조각을 돌리고 뒤집어 보세요.", "아래 줄은 사다리꼴과 평행사변형, 가운데 줄은 사다리꼴, 맨 위는 정삼각형으로 채울 수 있어요."],
    render: (b, a) => p6Pieces(b, a, { W: 9, H: 4.4, U: 62, spawn: [7.6, 1.2], tasks: [{ type: "fill", kinds: 3, targets: [p6Mv([[0, 0], [3, 0], [1.5, -3 * P6_H]], 1.2, 3.6)], label: "3가지 조각으로 채우기" }], ok: "3가지 모양 조각으로 빈틈없이 채웠어요." }) }
}
];
