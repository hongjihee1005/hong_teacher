//@@APP
const APP={title:"태민이의 온라인 집 둘레와 넓이", unit:"5-1 수학 6. 다각형의 둘레와 넓이(교과서)", key:"t51-area-v1", welcome:"태민이의 온라인 집 둘레와 넓이 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 온라인 공간에 집을 짓는 태민이와 함께 울타리·정원의 둘레를 재고, 1 cm² 모눈을 세고, 도형을 잘라 옮기고 붙여서 여러 가지 다각형의 넓이를 구하는 방법을 찾아봐요."};
//@@UNIT
/* =========================================================
   5-1 수학 6. 다각형의 둘레와 넓이 — 단원 조작 부품 (앞글자 ar6)
   모든 도형은 cm 모눈 좌표(가로 x, 아래쪽 y)로 적고, 넓이·둘레·자르기 결과는 코드로 계산해서 채점해요.
   ar6Perim  변을 눌러 끈으로 둘레 재기          ar6Count  1 cm²(반 칸 포함) 하나씩/한 줄씩 세기
   ar6Rect   모눈에 직사각형 그리기(과제·모두 찾기)  ar6Cut    조각을 끌어 옮기고 돌려 다른 도형 만들기
   ar6Height 삼각자처럼 높이 긋기                  ar6Big    1 m²·1 km²를 작은 단위로 채우기
   ar6Tile   여러 가지 단위 모양으로 넓이 비교       ar6Poly   점을 이어 넓이가 주어진 도형 그리기
   ar6House  태민이의 집에서 도형 찾기             ar6Game   직사각형 보물 탐험대 놀이
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.ar6fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none}
.ar6small{font-size:var(--fs-s);color:var(--muted)}
.ar6part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.ar6tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.ar6tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.ar6tbl th,.ar6tbl td{border:1.5px solid var(--line);padding:.25em .6em;text-align:center}
.ar6tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.ar6tbl input{width:4.2em;font-size:1em;text-align:center}
.ar6list{margin:.2em 0;padding-left:1.2em;font-size:var(--fs-s)}
.ar6list li{margin:.15em 0}
.ar6read{font-family:"Jua",sans-serif;font-size:var(--fs);color:var(--night);line-height:1.5;word-break:keep-all}
.ar6dice{display:inline-flex;align-items:center;gap:.4em}
.ar6dice svg{width:2.8em;height:2.8em}
.ar6pc{cursor:grab}
.ar6hit{cursor:pointer}
.ar6row{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-start}
.ar6row>div{flex:1 1 15em;min-width:0}
.ar6box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all}
`;
  document.head.append(s);
})();

const AR6_KO = ["가", "나", "다", "라", "마", "바", "사", "아"];
const AR6 = { ink: "#1D2A2A", grid: "#D3DEE8", blue: "#2B7BD6", red: "#D64545", green: "#2E8B57", org: "#E47A38", purple: "#7A5BB0", gray: "#8795A1",
  f1: "#DCEAFB", f2: "#FDE3D3", f3: "#DDEDE5", f4: "#FFF1C7", f5: "#EADFF6", f6: "#FBE0E6" };
const ar6R = v => Math.round(v * 1000) / 1000;
const ar6Fmt = v => { const r = Math.round(v * 100) / 100; return Number.isInteger(r) ? String(r) : String(r); };
/* 받침에 따라 조사 고르기: ar6Jo("12", "이/가") → "12가", ar6Jo("정사각형", "을/를") → "정사각형을" */
function ar6Jo(w, pair) {
  const s = String(w), [a, b] = pair.split("/"), c = s.trim().slice(-1);
  let bat = false, rieul = false;
  if (/[0-9]/.test(c)) {
    if (c === "0") { bat = true; }
    else { bat = "136780".includes(c) || c === "1"; rieul = "178".includes(c); }
  } else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  else bat = false;   // cm, m², km² …(센티미터·미터)는 받침 없음
  if (pair === "으로/로") return s + (bat && !rieul ? "으로" : "로");
  return s + (bat ? a : b);
}
/* 쓴 답 → 수 (쉼표·띄어쓰기·단위는 빼고 읽어요) */
function ar6Num(s) {
  let t = String(s == null ? "" : s).replace(/[\s,]/g, "");
  t = t.replace(/(제곱센티미터|제곱미터|제곱킬로미터|센티미터|킬로미터|미터|cm²|km²|m²|cm2|km2|m2|㎠|㎢|㎡|cm|km|m|개|배|줄|장|번|칸)$/i, "");
  return t === "" || !/^-?\d+(\.\d+)?$/.test(t) ? NaN : Number(t);
}
function ar6Area(P) { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; }
function ar6Cen(P) { return [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length]; }
const ar6D = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function ar6Perimeter(P) { let s = 0; for (let i = 0; i < P.length; i++) s += ar6D(P[i], P[(i + 1) % P.length]); return s; }
/* 다각형 P를 모눈 칸 [x,x+1]×[y,y+1]로 잘라 낸 조각(서덜랜드-호지먼) */
function ar6Clip(P, x, y) {
  let out = P.slice();
  const edges = [[p => p[0] >= x - 1e-9, (a, b) => { const t = (x - a[0]) / (b[0] - a[0]); return [x, a[1] + t * (b[1] - a[1])]; }],
    [p => p[0] <= x + 1 + 1e-9, (a, b) => { const t = (x + 1 - a[0]) / (b[0] - a[0]); return [x + 1, a[1] + t * (b[1] - a[1])]; }],
    [p => p[1] >= y - 1e-9, (a, b) => { const t = (y - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y]; }],
    [p => p[1] <= y + 1 + 1e-9, (a, b) => { const t = (y + 1 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y + 1]; }]];
  for (const [inside, cut] of edges) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const cur = inp[i], prev = inp[(i + inp.length - 1) % inp.length];
      if (inside(cur)) { if (!inside(prev)) out.push(cut(prev, cur)); out.push(cur); }
      else if (inside(prev)) out.push(cut(prev, cur));
    }
    if (!out.length) break;
  }
  return out;
}
/* 180° 돌려서 꼭짓점 m을 중심으로 돌린 자리에 놓으려면: 무게중심 기준 돌리기 + 옮기기 */
function ar6RotT(P, m) { const c = ar6Cen(P); return { dx: ar6R(2 * (m[0] - c[0])), dy: ar6R(2 * (m[1] - c[1])), rot: 1 }; }
function ar6Place(P, st) { const c = ar6Cen(P); return P.map(p => st.rot ? [2 * c[0] - p[0] + st.dx, 2 * c[1] - p[1] + st.dy] : [p[0] + st.dx, p[1] + st.dy]); }
function ar6Reg(n, side) {   // 아래 변이 가로인 정n각형 (한 변 side)
  const R = side / (2 * Math.sin(Math.PI / n));
  return Array.from({ length: n }, (_, k) => { const t = Math.PI / 2 + Math.PI / n + 2 * Math.PI * k / n; return [R * Math.cos(t), R * Math.sin(t)]; });
}

/* ---------- 그림 도우미 ---------- */
function ar6Fig(W, H, draw, maxW) { const s = makeSvg(W, H); draw(s); s.setAttribute("class", "ar6fig"); s.style.maxWidth = maxW || "34em"; return s; }
function ar6Tbl(head, rows) { return h("div", { class: "ar6tbl" }, h("table", {}, h("tr", {}, ...head.map(t => h("th", {}, t))), ...rows.map(r => h("tr", {}, ...r.map(t => h("td", {}, t)))))); }
const ar6Pts = (P, m) => P.map(p => m(p).map(ar6R).join(",")).join(" ");
function ar6Map(k, ox, oy) { const m = p => [ox + p[0] * k, oy + p[1] * k]; m.k = k; m.ox = ox; m.oy = oy; return m; }
function ar6GridG(cols, rows, m, color) {
  const g = svgEl("g", { stroke: color || AR6.grid, "stroke-width": 1 });
  for (let x = 0; x <= cols; x++) { const a = m([x, 0]), b = m([x, rows]); g.append(svgEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1] })); }
  for (let y = 0; y <= rows; y++) { const a = m([0, y]), b = m([cols, y]); g.append(svgEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1] })); }
  return g;
}
/* 선분 a-b 옆(도형 바깥쪽)에 글자 */
function ar6Lab(svg, m, a, b, t, o = {}) {
  const A = m(a), B = m(b), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
  let nx = -(B[1] - A[1]), ny = B[0] - A[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
  if (o.c) { const C = m(o.c); if ((C[0] - mx) * nx + (C[1] - my) * ny > 0) { nx = -nx; ny = -ny; } }
  if (o.flip) { nx = -nx; ny = -ny; }
  const d = o.d || 15;
  svg.append(txt(ar6R(mx + nx * d), ar6R(my + ny * d), t, o.size || 17, { fill: o.color || AR6.ink }));
}
function ar6Right(svg, m, F, u, v, color) {   // 직각 표시: F에서 u, v 방향(cm 단위 벡터)
  const s = .32, P = [F, [F[0] + u[0] * s, F[1] + u[1] * s], [F[0] + (u[0] + v[0]) * s, F[1] + (u[1] + v[1]) * s], [F[0] + v[0] * s, F[1] + v[1] * s]];
  svg.append(svgEl("polyline", { points: ar6Pts(P.slice(1), m), fill: "none", stroke: color || AR6.red, "stroke-width": 1.8 }));
}
function ar6Seg(svg, m, a, b, o = {}) {
  const A = m(a), B = m(b);
  const e = svgEl("line", { x1: ar6R(A[0]), y1: ar6R(A[1]), x2: ar6R(B[0]), y2: ar6R(B[1]), stroke: o.color || AR6.red, "stroke-width": o.w || 3, "stroke-linecap": "round" });
  if (o.dash) e.setAttribute("stroke-dasharray", o.dash);
  svg.append(e); return e;
}
function ar6Poly0(svg, m, P, o = {}) {
  const e = svgEl("polygon", { points: ar6Pts(P, m), fill: o.fill || AR6.f1, stroke: o.stroke || AR6.ink, "stroke-width": o.w || 2.2, "stroke-linejoin": "round" });
  if (o.dash) e.setAttribute("stroke-dasharray", o.dash);
  if (o.op != null) e.setAttribute("fill-opacity", o.op);
  svg.append(e); return e;
}
/* 모눈 위 그림 한 장: {cols, rows, k, grid, shapes:[{P, fill, stroke, dash, name, nameAt}], segs:[{a,b,color,dash,w}], labs:[{a,b,t,c,color,flip}], rights:[{F,u,v}], texts:[{p,t,size,color}]} */
function ar6Static(o) {
  const k = o.k || 30, pad = o.pad == null ? 26 : o.pad, W = o.cols * k + pad * 2, H = o.rows * k + pad * 2, m = ar6Map(k, pad, pad);
  return ar6Fig(W, H, s => {
    if (o.grid !== false) s.append(ar6GridG(o.cols, o.rows, m));
    (o.shapes || []).forEach(S => { ar6Poly0(s, m, S.P, S); if (S.name) { const c = S.nameAt || ar6Cen(S.P), C = m(c); s.append(txt(C[0], C[1], S.name, S.size || 20, { fill: S.nameColor || AR6.ink })); } });
    (o.segs || []).forEach(g => ar6Seg(s, m, g.a, g.b, g));
    (o.rights || []).forEach(r => ar6Right(s, m, r.F, r.u, r.v, r.color));
    (o.labs || []).forEach(l => ar6Lab(s, m, l.a, l.b, l.t, Object.assign({ c: o.shapes && o.shapes[0] ? ar6Cen(o.shapes[0].P) : null }, l)));
    (o.texts || []).forEach(t => { const P = m(t.p); s.append(txt(P[0], P[1], t.t, t.size || 17, { fill: t.color || AR6.ink })); });
  }, o.maxW);
}

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기) ---------- */
function ar6Ask(host, api, items, opts = {}) {
  const wrap = h("div", { class: "ar6ask", style: "margin-top:.6em" }), all = [];
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
      } else {
        const len = String(pt.n).length, w = pt.w || (len > 6 ? "8.5em" : len > 4 ? "6.2em" : "4em");
        const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "답", style: `width:${w};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : String(pt.n);
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : pt.nodeType ? " " : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : ar6Num(s.inp.value) === s.pt.n;
  const val = s => s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-");
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) { [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); }); }
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) return api.done(ans, opts.ok);
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(ar6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}
/* 조작을 마친 뒤: then(이어서 할 활동) → ask(물음) → 없으면 바로 해결 */
function ar6Finish(body, api, opt, ans, msg, data) {
  const go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "ar6part" }); body.append(box); opt.then(box, api, data); go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask(data) : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = ar6Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle }); go(w); }
  else api.done(ans, opt.ok || msg);
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열림 */
function ar6Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "ar6part" : "" }); body.append(box);
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
   1. 끈으로 둘레 재기 — 변을 하나씩 누르면 끈이 그 길이만큼 펴져요
   opt: {P(cm 좌표), labels:{변번호:"3 cm"}, ticks:[같은 길이 표시 묶음], name, tip, ask|then, ok}
   ========================================================= */
function ar6Perim(body, api, opt) {
  const P = opt.P, n = P.length, L = P.map((p, i) => ar6R(ar6D(p, P[(i + 1) % n]))), per = ar6R(L.reduce((a, b) => a + b, 0));
  const xs = P.map(p => p[0]), ys = P.map(p => p[1]), bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
  const W = 640, topH = 250, ks = Math.min(36, 380 / bw, 190 / bh), ox = (W - bw * ks) / 2 - Math.min(...xs) * ks, oy = 30 + (190 - bh * ks) / 2 - Math.min(...ys) * ks;
  const m = ar6Map(ks, ox, oy), kl = Math.min(ks, (W - 80) / per), lineY = topH + 40, H = lineY + 70, c = ar6Cen(P);
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = "38em";
  ar6Poly0(svg, m, P, { fill: opt.fill || AR6.f3, stroke: AR6.ink });
  if (opt.name) { const C = m(c); svg.append(txt(C[0], C[1], opt.name, 18, { fill: AR6.gray })); }
  (opt.ticks || []).forEach((g, i) => {     // 같은 길이 표시(짧은 금)
    if (!g) return; const a = m(P[i]), b = m(P[(i + 1) % n]), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    let ux = b[0] - a[0], uy = b[1] - a[1]; const Lp = Math.hypot(ux, uy); ux /= Lp; uy /= Lp;
    for (let t = 0; t < g; t++) { const sx = mx + ux * (t - (g - 1) / 2) * 6; const sy = my + uy * (t - (g - 1) / 2) * 6; svg.append(svgEl("line", { x1: ar6R(sx - uy * 7), y1: ar6R(sy + ux * 7), x2: ar6R(sx + uy * 7), y2: ar6R(sy - ux * 7), stroke: AR6.ink, "stroke-width": 2 })); }
  });
  Object.entries(opt.labels || {}).forEach(([i, t]) => ar6Lab(svg, m, P[+i], P[(+i + 1) % n], t, { c, d: 17 }));
  // 끈(자)
  svg.append(svgEl("line", { x1: 40, y1: lineY, x2: W - 40, y2: lineY, stroke: "#E6EBEE", "stroke-width": 10, "stroke-linecap": "round" }));
  svg.append(txt(40, lineY - 24, "끈", 16, { fill: AR6.gray, "text-anchor": "start" }));
  const used = [], sideEls = [], cols = [AR6.org, AR6.blue, AR6.green, AR6.purple];
  const strG = svgEl("g"); svg.append(strG);
  const read = h("div", { class: "ar6read" }, "변을 하나씩 눌러 끈을 둘러요.");
  const redraw = () => {
    strG.innerHTML = ""; let x = 40;
    used.forEach((i, j) => {
      const w = L[i] * kl; strG.append(svgEl("line", { x1: ar6R(x), y1: lineY, x2: ar6R(x + w), y2: lineY, stroke: cols[j % 4], "stroke-width": 8 }));
      strG.append(svgEl("line", { x1: ar6R(x + w), y1: lineY - 9, x2: ar6R(x + w), y2: lineY + 9, stroke: AR6.ink, "stroke-width": 1.5 }));
      strG.append(txt(ar6R(x + w / 2), lineY + 22, ar6Fmt(L[i]), 15)); x += w;
    });
    if (used.length === n) strG.append(txt(ar6R(Math.min(x + 4, W - 60)), lineY - 22, `${ar6Fmt(per)} ${opt.unit || "cm"}`, 18, { fill: AR6.red, "text-anchor": "middle" }));
    read.textContent = used.length ? `끈의 길이: ${used.map(i => ar6Fmt(L[i])).join(" + ")}${used.length === n ? ` = ${ar6Fmt(per)} (${opt.unit || "cm"})` : " …"}` : "변을 하나씩 눌러 끈을 둘러요.";
  };
  P.forEach((p, i) => {
    const a = m(p), b = m(P[(i + 1) % n]);
    const vis = svgEl("line", { x1: ar6R(a[0]), y1: ar6R(a[1]), x2: ar6R(b[0]), y2: ar6R(b[1]), stroke: "transparent", "stroke-width": 6, "stroke-linecap": "round" });
    const hit = svgEl("line", { x1: ar6R(a[0]), y1: ar6R(a[1]), x2: ar6R(b[0]), y2: ar6R(b[1]), stroke: "transparent", "stroke-width": 26, class: "ar6hit" });
    hit.addEventListener("click", () => {
      if (used.includes(i) || used.length === n) return;
      used.push(i); vis.setAttribute("stroke", cols[(used.length - 1) % 4]); redraw();
      if (used.length === n) ar6Finish(body, api, opt, `둘레 ${ar6Fmt(per)}`, opt.msg || `끈을 한 바퀴 둘렀어요. 둘레는 ${ar6Fmt(per)} ${opt.unit || "cm"}예요.`);
    });
    svg.append(vis, hit); sideEls.push(vis);
  });
  api.provide({ words: ["둘레", "변", "모두 더하기"], answers: [`${L.map(ar6Fmt).join(" + ")} = ${ar6Fmt(per)}`] });
  body.append(opt.tip ? h("p", { class: "ar6small" }, opt.tip) : null, svg, read,
    h("div", { class: "tools" }, h("button", { onclick: () => { if (used.length === n) return; used.length = 0; sideEls.forEach(e => e.setAttribute("stroke", "transparent")); redraw(); } }, "끈 다시 두르기")));
  redraw();
}

/* =========================================================
   2. 1 cm² 세기 — 칸(또는 반 칸)을 눌러 하나씩 세기, byRow면 한 줄씩
   opt: {cols, rows, P | cells, byRow, small:"1 cm²", unit:"cm²", tip, ask|then, ok, k}
   ========================================================= */
function ar6Count(body, api, opt) {
  const k = opt.k || 40, pad = 18, cols = opt.cols, rows = opt.rows, W = cols * k + pad * 2, H = rows * k + pad * 2, m = ar6Map(k, pad, pad);
  const small = opt.small || "1 cm²";
  const pcs = [];
  if (opt.cells) opt.cells.forEach(([x, y]) => pcs.push({ x, y, half: false, P: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]] }));
  else for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const Q = ar6Clip(opt.P, x, y); if (Q.length < 3) continue; const a = ar6Area(Q);
    if (a > 1 - 1e-6) pcs.push({ x, y, half: false, P: Q });
    else if (Math.abs(a - .5) < 1e-6) pcs.push({ x, y, half: true, P: Q });
    else if (a > 1e-6) throw new Error("그림 오류: 반 칸이 아닌 조각");
  }
  const nF = pcs.filter(p => !p.half).length, nH = pcs.length - nF;
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = opt.maxW || "34em";
  svg.append(ar6GridG(cols, rows, m));
  const order = [], els = [];
  pcs.forEach((pc, i) => {
    const e = ar6Poly0(svg, m, pc.P, { fill: pc.half ? AR6.f4 : AR6.f1, stroke: "#9DB4C9", w: 1.2 }); e.classList.add("ar6hit");
    const C = m(ar6Cen(pc.P)); const t = txt(C[0], C[1], "", pc.half ? 14 : 17, { "pointer-events": "none" }); svg.append(t);
    e.addEventListener("click", () => tap(i)); els.push({ e, t });
  });
  if (opt.P) ar6Poly0(svg, m, opt.P, { fill: "none", stroke: AR6.ink, w: 2.6 }).setAttribute("pointer-events", "none");
  else { /* 칸 모양의 바깥 테두리 */ const set = new Set(pcs.map(p => p.x + "," + p.y)); const g = svgEl("g", { stroke: AR6.ink, "stroke-width": 2.6, "stroke-linecap": "round", "pointer-events": "none" });
    pcs.forEach(p => { [[0, -1, [0, 0], [1, 0]], [0, 1, [0, 1], [1, 1]], [-1, 0, [0, 0], [0, 1]], [1, 0, [1, 0], [1, 1]]].forEach(([dx, dy, a, b]) => { if (!set.has((p.x + dx) + "," + (p.y + dy))) { const A = m([p.x + a[0], p.y + a[1]]), B = m([p.x + b[0], p.y + b[1]]); g.append(svgEl("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1] })); } }); }); svg.append(g); }
  const read = h("div", { class: "ar6read" });
  const rowsOf = () => [...new Set(order.map(i => pcs[i].y))];
  const paint = () => {
    let f = 0, hh = 0;
    els.forEach(x => { x.t.textContent = ""; x.e.setAttribute("fill", pcs[els.indexOf(x)].half ? AR6.f4 : AR6.f1); });
    order.forEach(i => { const pc = pcs[i]; if (pc.half) { hh++; els[i].t.textContent = "½"; els[i].e.setAttribute("fill", "#F6CF6B"); } else { f++; els[i].t.textContent = String(f); els[i].e.setAttribute("fill", "#9CC3F0"); } });
    let s = `센 ${small}: ${f}개` + (nH ? ` · 센 반 칸: ${hh}개` : "");
    if (opt.byRow) { const r = rowsOf().length, per = r ? order.filter(i => pcs[i].y === pcs[order[0]].y).length : 0; s += r ? ` (한 줄에 ${per}개씩 ${r}줄)` : ""; }
    read.textContent = s;
  };
  let doneOnce = false;
  function tap(i) {
    if (doneOnce) return;
    if (opt.byRow) { const y = pcs[i].y; const inRow = pcs.map((p, j) => p.y === y ? j : -1).filter(j => j >= 0); if (inRow.every(j => order.includes(j))) inRow.forEach(j => order.splice(order.indexOf(j), 1)); else inRow.forEach(j => { if (!order.includes(j)) order.push(j); }); }
    else { const at = order.indexOf(i); if (at >= 0) order.splice(at, 1); else order.push(i); }
    paint();
    if (order.length === pcs.length) {
      doneOnce = true;
      const perRow = opt.byRow ? pcs.filter(p => p.y === pcs[0].y).length : 0;
      ar6Finish(body, api, opt, `${small} ${nF}개` + (nH ? `, 반 칸 ${nH}개` : ""), opt.msg || (`${ar6Jo(small, "이/가")} ${nF}개` + (nH ? `, 반 칸이 ${nH}개` : "") + (opt.byRow ? ` — 한 줄에 ${perRow}개씩 ${rowsOf().length}줄` : "") + " 있어요."), { nF, nH });
    }
  }
  api.provide({ words: [small, "1 cm²의 몇 배", "반 칸 2개 = 1 cm²"], answers: [`${small} ${nF}개` + (nH ? `, 반 칸 ${nH}개` : "")] });
  body.append(opt.tip ? h("p", { class: "ar6small" }, opt.tip) : null, svg, read,
    h("div", { class: "tools" }, h("button", { onclick: () => { if (doneOnce) return; order.length = 0; paint(); } }, "처음부터 다시 세기")));
  paint();
}

/* =========================================================
   3. 직사각형 그리기 — 모눈의 점에서 점까지 끌면 직사각형이 생겨요
   opt: {cols, rows, k, unit:"cm", show:"wh"|"all", tasks:[{w,h}|{area}|{perim}|{area,side}|{perim,side}|{given:[x,y,len], perim}],
         collect:{area}|{perim}, ask|then, ok, tip}
   ========================================================= */
function ar6DragRect(svg, m, cols, rows, onMove, onEnd, can) {
  let A = null;
  const snap = p => [Math.max(0, Math.min(cols, Math.round((p.x - m.ox) / m.k))), Math.max(0, Math.min(rows, Math.round((p.y - m.oy) / m.k)))];
  dragOn(svg, p => { if (can && !can()) return false; A = snap(p); onMove(A, A); }, p => { onMove(A, snap(p)); }, p => { onEnd(A, snap(p)); });
}
function ar6Rect(body, api, opt) {
  const k = opt.k || 34, pad = 22, cols = opt.cols, rows = opt.rows, W = cols * k + pad * 2, H = rows * k + pad * 2, m = ar6Map(k, pad, pad), u = opt.unit || "cm";
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = opt.maxW || "36em";
  svg.append(ar6GridG(cols, rows, m));
  const keep = svgEl("g"), cur = svgEl("g"); svg.append(keep, cur);
  for (let x = 0; x <= cols; x++) for (let y = 0; y <= rows; y++) { const P = m([x, y]); svg.append(svgEl("circle", { cx: P[0], cy: P[1], r: 2, fill: "#A9BBCB", "pointer-events": "none" })); }
  const read = h("div", { class: "ar6read" }, "모눈의 한 점에서 대각선 쪽 점까지 끌어 직사각형을 그려요.");
  const taskTxt = h("div", { class: "jua" });
  let R = null, ti = 0, locked = false;
  const tasks = opt.tasks || [], found = [], made = [];
  const dims = r => [Math.abs(r[1][0] - r[0][0]), Math.abs(r[1][1] - r[0][1])];
  const showRect = (r, el, col) => {
    el.innerHTML = ""; if (!r) return; const [w, hh] = dims(r); if (!w || !hh) return;
    const x0 = Math.min(r[0][0], r[1][0]), y0 = Math.min(r[0][1], r[1][1]);
    const P = [[x0, y0], [x0 + w, y0], [x0 + w, y0 + hh], [x0, y0 + hh]];
    ar6Poly0(el, m, P, { fill: col || AR6.f2, stroke: AR6.org, w: 2.6, op: .85 });
    ar6Lab(el, m, P[0], P[1], `${w} ${u}`, { c: [x0 + w / 2, y0 + hh / 2], size: 15, d: 12 });
    ar6Lab(el, m, P[1], P[2], `${hh} ${u}`, { c: [x0 + w / 2, y0 + hh / 2], size: 15, d: 12 });
  };
  const describe = r => { const [w, hh] = dims(r); if (!w || !hh) return "선분이 아니라 직사각형이 되게 끌어요."; let s = `가로 ${w} ${u}, 세로 ${hh} ${u}`; if (opt.show === "all") s += ` → 넓이 ${w * hh} ${u}², 둘레 ${(w + hh) * 2} ${u}`; return s; };
  if (opt.given) { const [gx, gy, gl] = opt.given; ar6Seg(svg, m, [gx, gy], [gx + gl, gy], { color: AR6.blue, w: 5 }); }
  const taskLabel = t => t.label || (t.w ? `가로 ${t.w} ${u}, 세로 ${t.h} ${u}인 직사각형을 그려요.` : t.area && t.side ? `넓이가 ${t.area} ${u}²이고 한 변이 ${t.side} ${u}인 직사각형을 그려요.` : t.area ? `넓이가 ${t.area} ${u}²인 직사각형을 그려요.` : t.perim && t.side ? `둘레가 ${t.perim} ${u}이고 한 변이 ${t.side} ${u}인 직사각형을 그려요.` : `둘레가 ${t.perim} ${u}인 직사각형을 그려요.`);
  const setTask = () => { taskTxt.textContent = opt.collect ? (opt.collect.area ? `넓이가 ${opt.collect.area} ${u}²인 직사각형을 서로 다른 모양으로 모두 그려 넣어요.` : `둘레가 ${opt.collect.perim} ${u}인 직사각형을 서로 다른 모양으로 모두 그려 넣어요.`) : tasks[ti] ? `${tasks.length > 1 ? `(${ti + 1}/${tasks.length}) ` : ""}${taskLabel(tasks[ti])}` : ""; };
  const meets = (t, r) => {
    const [w, hh] = dims(r); if (!w || !hh) return "직사각형을 그려 주세요.";
    if (t.test) return t.test(w, hh);
    if (t.w) return (w === t.w && hh === t.h) || (opt.turn && w === t.h && hh === t.w) ? null : `가로 ${t.w} ${u}, 세로 ${t.h} ${u}가 되게 그려요. 지금은 가로 ${w} ${u}, 세로 ${hh} ${u}예요.`;
    if (t.given) { const [gx, gy, gl] = t.given; const x0 = Math.min(r[0][0], r[1][0]), y0 = Math.min(r[0][1], r[1][1]);
      if (!(w === gl && x0 === gx && (y0 === gy || y0 + hh === gy))) return "파란 선분이 직사각형의 한 변이 되도록 그려요."; }
    if (t.side && w !== t.side && hh !== t.side) return `한 변의 길이가 ${t.side} ${u}가 되게 그려요.`;
    if (t.area && w * hh !== t.area) return `지금 그린 직사각형의 넓이는 ${w}×${hh}=${w * hh} (${u}²)예요. 넓이가 ${t.area} ${u}²가 되게 그려요.`;
    if (t.perim && (w + hh) * 2 !== t.perim) return `지금 그린 직사각형의 둘레는 (${w}+${hh})×2=${(w + hh) * 2} (${u})예요. 둘레가 ${t.perim} ${u}가 되게 그려요.`;
    return null;
  };
  // 모두 찾기
  const C = opt.collect, want = [];
  if (C) { if (C.area) { for (let w = 1; w * w <= C.area; w++) if (C.area % w === 0) want.push([w, C.area / w]); } else { const s = C.perim / 2; for (let w = 1; w <= s / 2; w++) want.push([w, s - w]); }
    want.forEach(d => { if (Math.max(...d) > Math.max(cols, rows) || Math.min(...d) > Math.min(cols, rows)) throw new Error("그림 오류: 모눈이 작아요"); }); }
  const tblHost = h("div"), qName = C ? (C.area ? "둘레" : "넓이") : "", qUnit = C ? (C.area ? u : u + "²") : "";
  const rowsIn = [];
  const drawTable = () => {
    tblHost.innerHTML = ""; if (!C) return;
    const sorted = found.slice().sort((a, b) => a[0] - b[0]);
    const tb = h("table", {}, h("tr", {}, h("th", {}, `가로(${u})`), h("th", {}, `세로(${u})`), h("th", {}, `${qName}(${qUnit})`)));
    sorted.forEach(d => { const key = d.join("x"); let inp = rowsIn.find(r => r.key === key); if (!inp) { inp = { key, d, el: h("input", { type: "text", inputmode: "numeric", "aria-label": qName }) }; rowsIn.push(inp); } tb.append(h("tr", {}, h("td", {}, String(d[0])), h("td", {}, String(d[1])), h("td", {}, inp.el))); });
    tblHost.append(h("div", { class: "ar6tbl" }, tb), h("p", { class: "ar6small" }, `찾은 직사각형 ${found.length}가지${found.length >= want.length ? " — 모두 찾았어요!" : ""}  (가로와 세로를 바꾼 것은 같은 모양으로 봐요.)`));
  };
  ar6DragRect(svg, m, cols, rows, (a, b) => { R = [a, b]; showRect(R, cur); read.textContent = describe(R); }, (a, b) => { R = [a, b]; showRect(R, cur); read.textContent = describe(R); }, () => !locked);
  const btns = h("div", { class: "actions" });
  if (C) {
    btns.append(h("button", { class: "ghost", onclick: () => {
      if (!R) return api.hint("먼저 직사각형을 그려요.");
      const t = C.area ? { area: C.area } : { perim: C.perim }; const bad = meets(t, R); if (bad) return api.fail(bad, describe(R));
      const d = dims(R).slice().sort((a, b) => a - b); if (found.some(f => f[0] === d[0] && f[1] === d[1])) return api.hint("이미 넣은 모양이에요. 가로와 세로를 바꾼 것은 같은 모양이에요. 다른 모양을 찾아봐요.");
      found.push(d); showRect(R, keep.appendChild(svgEl("g")), AR6.f3); cur.innerHTML = ""; R = null; drawTable(); api.hint(`좋아요! ${found.length}가지를 찾았어요.`);
    } }, "이 직사각형 넣기"), h("button", { class: "big", onclick: () => {
      api.tryOnce();
      if (found.length < want.length) return api.fail(`아직 찾지 못한 직사각형이 있어요. 가로를 1 ${u}부터 차례로 늘려 가며 찾아봐요.`, found.map(d => d.join("×")).join(", "));
      let bad = null; rowsIn.forEach(r => { const v = ar6Num(r.el.value), a = C.area ? (r.d[0] + r.d[1]) * 2 : r.d[0] * r.d[1]; r.el.style.borderColor = v === a ? "var(--ok)" : "var(--no)"; if (v !== a && !bad) bad = r; });
      if (bad) return api.fail(C.area ? `가로 ${bad.d[0]} ${u}, 세로 ${bad.d[1]} ${u}인 직사각형의 둘레를 다시 계산해 봐요. (가로+세로)×2예요.` : `가로 ${bad.d[0]} ${u}, 세로 ${bad.d[1]} ${u}인 직사각형의 넓이를 다시 계산해 봐요. 가로×세로예요.`, rowsIn.map(r => r.el.value).join(","));
      locked = true; btns.querySelectorAll("button").forEach(b => b.disabled = true);
      ar6Finish(body, api, opt, found.map(d => `${d[0]}×${d[1]}`).join(", "), `서로 다른 직사각형 ${found.length}가지를 모두 찾고 ${qName}${ar6Jo(qName, "을/를").slice(-1)} 구했어요.`, found);
    } }, "확인하기"));
  } else {
    btns.append(h("button", { class: "big", onclick: () => {
      if (!R) return api.hint("먼저 직사각형을 그려요.");
      api.tryOnce(); const bad = meets(tasks[ti], R); if (bad) return api.fail(bad, describe(R));
      const d = dims(R); if (!opt.keep) keep.innerHTML = ""; showRect(R, keep.appendChild(svgEl("g")), AR6.f3); cur.innerHTML = "";
      made.push({ w: d[0], h: d[1] });
      R = null; ti++;
      if (ti < tasks.length) { setTask(); api.hint(`○ 맞아요! (가로 ${d[0]} ${u}, 세로 ${d[1]} ${u}) 다음 직사각형도 그려요.`); return; }
      locked = true; btns.querySelector("button").disabled = true; taskTxt.textContent = "";
      ar6Finish(body, api, opt, made.map(t => `${t.w}×${t.h}`).join(", "), opt.msg || `가로 ${d[0]} ${u}, 세로 ${d[1]} ${u}인 직사각형을 그렸어요.`, made);
    } }, "확인하기"));
  }
  api.provide({ words: ["가로", "세로", "(가로)×(세로)", "(가로+세로)×2"], answers: C ? want.map(d => `${d[0]}×${d[1]}`) : tasks.map(t => t.w ? `가로 ${t.w}, 세로 ${t.h}` : "").filter(Boolean) });
  setTask(); drawTable();
  body.append(opt.tip ? h("p", { class: "ar6small" }, opt.tip) : null, taskTxt, svg, read, tblHost, btns);
}

/* =========================================================
   4. 잘라서 옮기기 — 조각을 끌어 옮기고, '돌리기'로 180° 돌려 다른 도형 만들기
   opt: {cols, rows, k, pieces:[{P, fill, stroke, move, start:{dx,dy,rot}, target:{dx,dy,rot}|[...], name}], marks(svg,m), ghost:P, after(svg,m), rotate, tip, ask|then, ok, msg}
   ========================================================= */
function ar6Cut(body, api, opt) {
  const k = opt.k || 34, pad = 20, cols = opt.cols, rows = opt.rows, W = cols * k + pad * 2, H = rows * k + pad * 2, m = ar6Map(k, pad, pad);
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = opt.maxW || "36em";
  svg.append(ar6GridG(cols, rows, m));
  if (opt.ghost) ar6Poly0(svg, m, opt.ghost, { fill: "none", stroke: AR6.gray, dash: "6 5", w: 2 });
  const pcG = svgEl("g"), markG = svgEl("g", { "pointer-events": "none" }), afterG = svgEl("g", { "pointer-events": "none" }); svg.append(pcG, markG, afterG);
  const pcs = opt.pieces.map((p, i) => ({ ...p, i, st: Object.assign({ dx: 0, dy: 0, rot: 0 }, p.start || {}), ok: !p.move, tg: p.target ? [].concat(p.target) : [] }));
  let sel = pcs.find(p => p.move) || null, finished = false;
  const draw = () => {
    pcG.innerHTML = "";
    pcs.forEach(p => {
      const Q = ar6Place(p.P, p.st);
      const e = ar6Poly0(pcG, m, Q, { fill: p.fill || AR6.f1, stroke: p === sel && !finished ? AR6.org : (p.stroke || AR6.ink), w: p === sel && !finished ? 3.4 : 2.2, op: p.op == null ? .92 : p.op });
      if (p.move && !finished) { e.classList.add("ar6pc"); e.dataset.pc = p.i; }
      if (p.name) { const C = m(ar6Cen(Q)); pcG.append(txt(C[0], C[1], p.name, 16, { "pointer-events": "none" })); }
    });
    markG.innerHTML = ""; if (opt.marks && !finished) opt.marks(markG, m);
  };
  const snap = p => {
    if (p.ok && p.move) return;
    for (const t of p.tg) if ((t.rot || 0) === p.st.rot && Math.abs(t.dx - p.st.dx) < .6 && Math.abs(t.dy - p.st.dy) < .6) { p.st.dx = t.dx; p.st.dy = t.dy; p.ok = true; return; }
    const v = ar6Place(p.P, p.st)[0]; p.st.dx = ar6R(p.st.dx + Math.round(v[0]) - v[0]); p.st.dy = ar6R(p.st.dy + Math.round(v[1]) - v[1]);
    for (const t of p.tg) if ((t.rot || 0) === p.st.rot && Math.abs(t.dx - p.st.dx) < 1e-6 && Math.abs(t.dy - p.st.dy) < 1e-6) { p.ok = true; return; }
  };
  const check = () => {
    draw();
    if (pcs.every(p => p.ok)) {
      finished = true; draw(); if (opt.after) opt.after(afterG, m);
      ar6Finish(body, api, opt, "조각을 옮겨 새 도형을 만들었어요", opt.msg || "조각을 옮겨 새 도형을 만들었어요!");
    } else if (opt.say) read.textContent = opt.say(pcs);
  };
  let grab = null;
  dragOn(svg, (pt, ev) => {
    if (finished) return false;
    const t = ev.target && ev.target.closest ? ev.target.closest("[data-pc]") : null; if (!t) return false;
    const p = pcs[+t.dataset.pc]; if (p.ok) { sel = p; draw(); return false; }
    sel = p; grab = { p, x: pt.x, y: pt.y, dx: p.st.dx, dy: p.st.dy }; draw(); return true;
  }, pt => {
    if (!grab) return; grab.p.st.dx = grab.dx + (pt.x - grab.x) / k; grab.p.st.dy = grab.dy + (pt.y - grab.y) / k;
    const Q = ar6Place(grab.p.P, grab.p.st); const xs = Q.map(q => q[0]), ys = Q.map(q => q[1]);   // 판 밖으로 나가지 않게
    if (Math.min(...xs) < 0) grab.p.st.dx -= Math.min(...xs); if (Math.max(...xs) > cols) grab.p.st.dx -= Math.max(...xs) - cols;
    if (Math.min(...ys) < 0) grab.p.st.dy -= Math.min(...ys); if (Math.max(...ys) > rows) grab.p.st.dy -= Math.max(...ys) - rows;
    draw();
  }, () => { if (!grab) return; snap(grab.p); grab = null; check(); });
  const read = h("div", { class: "ar6small" }, opt.tip2 || "");
  const tools = h("div", { class: "tools" });
  if (opt.rotate) tools.append(h("button", { onclick: () => {
    if (finished) return; if (!sel || !sel.move || sel.ok) return api.hint("먼저 옮길 조각을 눌러 골라요.");
    sel.st.rot = 1 - sel.st.rot; const Q = ar6Place(sel.P, sel.st), xs = Q.map(q => q[0]), ys = Q.map(q => q[1]);
    if (Math.min(...xs) < 0) sel.st.dx -= Math.min(...xs); if (Math.max(...xs) > cols) sel.st.dx -= Math.max(...xs) - cols;
    if (Math.min(...ys) < 0) sel.st.dy -= Math.min(...ys); if (Math.max(...ys) > rows) sel.st.dy -= Math.max(...ys) - rows;
    snap(sel); check();
  } }, "↻ 고른 조각 돌리기(반 바퀴)"));
  tools.append(h("button", { onclick: () => { if (finished) return; pcs.forEach(p => { p.st = Object.assign({ dx: 0, dy: 0, rot: 0 }, p.start || {}); p.ok = !p.move; }); draw(); } }, "처음 자리로"));
  api.provide({ words: opt.words || ["밑변", "높이", "옮기기", "돌리기"], answers: [] });
  body.append(opt.tip ? h("p", { class: "ar6small" }, opt.tip) : null, svg, read, tools);
  draw();
}

/* =========================================================
   5. 높이 긋기 — 삼각자처럼 밑변(파란 변)에 수직인 선분을 끌어서 그어요
   opt: {tasks:[{P, base:[i,j], top:"v"|"s", at: 꼭짓점 번호 | [i,j] 마주 보는 변, ext, cols, rows, name}], k, tip, ask|then, ok}
   ========================================================= */
function ar6Height(body, api, opt) {
  const k = opt.k || 32, pad = 22, gap = 1;
  let ox = pad; const regs = opt.tasks.map(t => { const r = { t, ox, m: ar6Map(k, ox, pad) }; ox += (t.cols + gap) * k; return r; });
  const W = ox - gap * k + pad, Hh = Math.max(...opt.tasks.map(t => t.rows)) * k + pad * 2;
  const svg = makeSvg(W, Hh); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = opt.maxW || (opt.tasks.length > 1 ? "44em" : "30em");
  const lineG = svgEl("g", { "pointer-events": "none" });
  regs.forEach((r, ri) => {
    const t = r.t, m = r.m, P = t.P, b0 = P[t.base[0]], b1 = P[t.base[1]];
    svg.append(ar6GridG(t.cols, t.rows, m));
    ar6Poly0(svg, m, P, { fill: AR6.f3, stroke: AR6.ink });
    if (t.ext) { const dx = b1[0] - b0[0], dy = b1[1] - b0[1], L = Math.hypot(dx, dy); const ux = dx / L, uy = dy / L; const far = 20;
      const A = [b0[0] - ux * far, b0[1] - uy * far], B = [b1[0] + ux * far, b1[1] + uy * far];
      const cl = q => [Math.max(0, Math.min(t.cols, q[0])), Math.max(0, Math.min(t.rows, q[1]))];
      ar6Seg(svg, m, cl(A), cl(B), { color: AR6.blue, w: 1.6, dash: "5 5" }); }
    ar6Seg(svg, m, b0, b1, { color: AR6.blue, w: 5 });
    if (t.name) { const C = m([.5, .5]); svg.append(txt(C[0], C[1], t.name, 18, { fill: AR6.gray })); }
    for (let x = 0; x <= t.cols; x++) for (let y = 0; y <= t.rows; y++) { const Q = m([x, y]); svg.append(svgEl("circle", { cx: Q[0], cy: Q[1], r: 2, fill: "#A9BBCB" })); }
  });
  svg.append(lineG);
  const state = regs.map(() => null), live = svgEl("g", { "pointer-events": "none" }); svg.append(live);
  const read = h("div", { class: "ar6read" }, opt.tasks.length > 1 ? `높이를 그은 도형: 0/${opt.tasks.length}` : "");
  const which = p => regs.findIndex(r => p.x >= r.ox - k / 2 && p.x <= r.ox + (r.t.cols + .5) * k);
  const snap = (r, p) => [Math.max(0, Math.min(r.t.cols, Math.round((p.x - r.ox) / k))), Math.max(0, Math.min(r.t.rows, Math.round((p.y - pad) / k)))];
  const onLine = (q, a, b) => Math.abs((b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0])) < 1e-9;
  const onSeg = (q, a, b) => onLine(q, a, b) && q[0] >= Math.min(a[0], b[0]) - 1e-9 && q[0] <= Math.max(a[0], b[0]) + 1e-9 && q[1] >= Math.min(a[1], b[1]) - 1e-9 && q[1] <= Math.max(a[1], b[1]) + 1e-9;
  const judge = (t, A, B) => {
    const P = t.P, b0 = P[t.base[0]], b1 = P[t.base[1]], ux = b1[0] - b0[0], uy = b1[1] - b0[1];
    if (A[0] === B[0] && A[1] === B[1]) return "점에서 점까지 끌어서 선분을 그어요.";
    if (Math.abs((B[0] - A[0]) * ux + (B[1] - A[1]) * uy) > 1e-9) return "높이는 밑변(파란 변)에 수직이 되게 그어야 해요. 삼각자의 직각을 밑변에 대어 보세요.";
    const ends = [[A, B], [B, A]];
    for (const [F, T] of ends) {
      const fOk = t.ext ? onLine(F, b0, b1) : onSeg(F, b0, b1); if (!fOk) continue;
      if (t.top === "v") { const v = P[t.at]; if (T[0] === v[0] && T[1] === v[1]) return null; }
      else { const s0 = P[t.at[0]], s1 = P[t.at[1]]; if (onSeg(T, s0, s1) || (t.ext && onLine(T, s0, s1) && onSeg(F, b0, b1))) return null; }
    }
    return t.top === "v" ? "높이는 밑변과 마주 보는 꼭짓점에서 밑변(또는 밑변을 늘인 선)까지 그어요." : "높이는 밑변에서 마주 보는 다른 밑변까지, 두 변 사이에 수직으로 그어요.";
  };
  let cur = null;
  dragOn(svg, p => { const ri = which(p); if (ri < 0 || state[ri]) return false; const A = snap(regs[ri], p); cur = { ri, A, B: A }; drawLive(); return true; },
    p => { if (!cur) return; cur.B = snap(regs[cur.ri], p); drawLive(); },
    () => {
      if (!cur) return; const r = regs[cur.ri], bad = judge(r.t, cur.A, cur.B); const c = cur; cur = null; live.innerHTML = "";
      if (bad) { if (!(c.A[0] === c.B[0] && c.A[1] === c.B[1])) api.fail(bad, `${c.A}→${c.B}`); else api.hint(bad); return; }
      state[c.ri] = [c.A, c.B]; const m = r.m, t = r.t, b0 = t.P[t.base[0]], b1 = t.P[t.base[1]];
      ar6Seg(lineG, m, c.A, c.B, { color: AR6.red, w: 3.5 });
      // 발(밑변 쪽 끝)에 직각 표시
      const F = (t.ext ? onLine(c.A, b0, b1) : onSeg(c.A, b0, b1)) ? c.A : c.B, T = F === c.A ? c.B : c.A;
      const L = ar6D(b0, b1), u = [(b1[0] - b0[0]) / L, (b1[1] - b0[1]) / L], hl = ar6D(F, T), v = [(T[0] - F[0]) / hl, (T[1] - F[1]) / hl];
      const C = ar6Cen(t.P); const uu = (C[0] - F[0]) * u[0] + (C[1] - F[1]) * u[1] >= 0 ? u : [-u[0], -u[1]];
      ar6Right(lineG, m, F, uu, v);
      if (opt.showLen !== false) { const Mx = m([(F[0] + T[0]) / 2, (F[1] + T[1]) / 2]); lineG.append(txt(ar6R(Mx[0] + (Math.abs(v[0]) > .5 ? 0 : 16)), ar6R(Mx[1] + (Math.abs(v[0]) > .5 ? -12 : 0)), `${ar6Fmt(hl)} cm`, 15, { fill: AR6.red, "text-anchor": Math.abs(v[0]) > .5 ? "middle" : "start" })); }
      const n = state.filter(Boolean).length;
      read.textContent = opt.tasks.length > 1 ? `높이를 그은 도형: ${n}/${opt.tasks.length}` : `높이를 그었어요. 높이는 ${ar6Fmt(hl)} cm예요.`;
      if (n === regs.length) ar6Finish(body, api, opt, state.map(s => `${s[0]}→${s[1]}`).join(" / "), opt.msg || "밑변에 수직인 높이를 바르게 그었어요.", state);
      else api.hint("○ 바르게 그었어요! 다른 도형에도 높이를 그어 봐요.");
    });
  function drawLive() { live.innerHTML = ""; if (!cur) return; const m = regs[cur.ri].m; ar6Seg(live, m, cur.A, cur.B, { color: AR6.org, w: 3, dash: "6 4" }); const Q = m(cur.A); live.append(svgEl("circle", { cx: Q[0], cy: Q[1], r: 5, fill: AR6.org })); }
  api.provide({ words: ["밑변", "높이", "수직", "삼각자"], answers: [] });
  body.append(opt.tip ? h("p", { class: "ar6small" }, opt.tip) : null, svg, read);
}

/* =========================================================
   6. 큰 넓이 단위 — 1 m²(1 km²)를 1 cm²(1 m²)로 몇 줄 채우는지 끌어서 알아보기
   opt: {n:100, side:"1 m = 100 cm", big:"1 m²", small:"1 cm²", ask, ok}
   ========================================================= */
function ar6Big(body, api, opt) {
  const n = opt.n, S = 300, ox = 60, oy = 40, W = 640, H = S + oy + 50;
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = "38em"; svg.style.touchAction = "none";
  const fill = svgEl("rect", { x: ox, y: oy, width: S, height: 0, fill: "#9CC3F0" });
  svg.append(fill);
  const g = svgEl("g", { stroke: "#C8D6E2", "stroke-width": .8 }); for (let i = 1; i < 10; i++) { g.append(svgEl("line", { x1: ox + S * i / 10, y1: oy, x2: ox + S * i / 10, y2: oy + S }), svgEl("line", { x1: ox, y1: oy + S * i / 10, x2: ox + S, y2: oy + S * i / 10 })); } svg.append(g);
  svg.append(svgEl("rect", { x: ox, y: oy, width: S, height: S, fill: "none", stroke: AR6.ink, "stroke-width": 3 }));
  svg.append(txt(ox + S / 2, oy - 18, opt.side, 17), txt(ox - 22, oy + S / 2, opt.side, 17, { transform: `rotate(-90 ${ox - 22} ${oy + S / 2})` }));
  svg.append(txt(ox + S / 2, oy + S / 2, opt.big, 30, { fill: "#40576B", "pointer-events": "none" }));
  // 확대 그림: 왼쪽 위 모서리
  const zx = 420, zy = 50, zs = 160, zn = 8, zb = Math.max(9, S * zn / n);
  svg.append(svgEl("rect", { x: ox, y: oy, width: zb, height: zb, fill: "none", stroke: AR6.org, "stroke-width": 2.5 }));
  svg.append(svgEl("line", { x1: ox + zb, y1: oy, x2: zx, y2: zy, stroke: AR6.org, "stroke-width": 1.5, "stroke-dasharray": "4 4" }), svgEl("line", { x1: ox + zb, y1: oy + zb, x2: zx, y2: zy + zs, stroke: AR6.org, "stroke-width": 1.5, "stroke-dasharray": "4 4" }));
  const zg = svgEl("g"); svg.append(zg);
  const drawZoom = r => { zg.innerHTML = ""; for (let i = 0; i < zn; i++) for (let j = 0; j < zn; j++) zg.append(svgEl("rect", { x: zx + j * zs / zn, y: zy + i * zs / zn, width: zs / zn, height: zs / zn, fill: i < r ? "#9CC3F0" : "#fff", stroke: "#7D98B0", "stroke-width": 1 })); zg.append(svgEl("rect", { x: zx, y: zy, width: zs, height: zs, fill: "none", stroke: AR6.org, "stroke-width": 2.5 })); };
  svg.append(txt(zx + zs / 2, zy + zs + 22, `한 귀퉁이를 크게 본 모습: 한 칸이 ${opt.small}`, 15, { fill: AR6.org }));
  const handle = svgEl("rect", { x: ox, y: oy - 6, width: S, height: 12, rx: 6, fill: AR6.org, class: "ar6pc" }); svg.append(handle);
  const read = h("div", { class: "ar6read" });
  let r = 0, fin = false;
  const set = v => {
    if (fin) return; r = Math.max(0, Math.min(n, v)); const y = oy + S * r / n;
    fill.setAttribute("height", ar6R(S * r / n)); handle.setAttribute("y", ar6R(y - 6)); drawZoom(Math.min(zn, r));
    read.textContent = r ? `${opt.small}가 가로 한 줄에 ${n}개씩 ${r}줄 → ${n} × ${r} = ${n * r}개` : `주황 막대를 아래로 끌어 ${opt.small}로 채워 봐요.`;
    if (r === n) { fin = true; ar6Finish(body, api, opt, `${n}×${n}=${n * n}`, `${opt.big} 안에 ${opt.small}가 가로 한 줄에 ${n}개씩 ${n}줄, 모두 ${n * n}개 들어가요.`); }
  };
  dragOn(svg, p => !fin && p.x >= ox - 10 && p.x <= ox + S + 10 && p.y >= oy - 15 && p.y <= oy + S + 15, p => set(Math.round((p.y - oy) / S * n)), p => set(Math.round((p.y - oy) / S * n)));
  api.provide({ words: [opt.small, opt.big, `${n}개씩 ${n}줄`], answers: [`${opt.big} = ${n * n} ${opt.small.replace(/^1 /, "")}`] });
  body.append(h("p", { class: "ar6small" }, `한 변이 ${opt.side}인 정사각형이에요. 주황 막대를 아래로 끌거나 단추를 눌러 ${opt.small}로 채워 봐요.`), svg, read,
    h("div", { class: "tools" }, h("button", { onclick: () => set(r + 1) }, "한 줄 더"), h("button", { onclick: () => set(r + n / 10) }, `${n / 10}줄 더`), h("button", { onclick: () => set(n) }, "끝까지 채우기")));
  set(0);
}

/* =========================================================
   7. 단위 모양으로 넓이 비교 — 벽돌 가·나를 ○, ▭(작은 직사각형), □로 채워 세기
   ========================================================= */
function ar6Tile(body, api, opt) {
  const k = 44, pad = 24, bricks = [{ name: "가", x: 0, y: 1, w: 5, h: 2 }, { name: "나", x: 7, y: 0, w: 3, h: 3 }], cols = 10, rows = 3;
  const units = [{ id: "c", name: "○ 원", cells: [[0, 0]] }, { id: "d", name: "▭ 직사각형", cells: [[0, 0], [1, 0]] }, { id: "s", name: "□ 정사각형", cells: [[0, 0]] }];
  const W = cols * k + pad * 2, H = rows * k + pad * 2 + 30, m = ar6Map(k, pad, pad + 26);
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = "34em";
  bricks.forEach(b => { const P = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]]; ar6Poly0(svg, m, P, { fill: "#F3DCC8", stroke: "#9A6B3E", w: 2.6 }); const C = m([b.x + b.w / 2, -.5]); svg.append(txt(C[0], C[1] + 2, `벽돌 ${b.name}`, 18)); });
  const placedG = svgEl("g"); svg.append(placedG);
  const S = {}; units.forEach(u => S[u.id] = [[], []]);   // 단위별 벽돌별 놓은 자리
  let cu = units[0], vert = false;
  const occ = (bi, u) => { const o = new Set(); S[u.id][bi].forEach(p => p.cells.forEach(c => o.add(c.join(",")))); return o; };
  const shapeCells = (u, x, y, v) => u.id === "d" ? (v ? [[x, y], [x, y + 1]] : [[x, y], [x + 1, y]]) : [[x, y]];
  const fits = (bi, u, x, y, v) => { const b = bricks[bi], o = occ(bi, u); return shapeCells(u, x, y, v).every(([cx, cy]) => cx >= b.x && cx < b.x + b.w && cy >= b.y && cy < b.y + b.h && !o.has(cx + "," + cy)); };
  const full = (bi, u) => { const b = bricks[bi]; for (let x = b.x; x < b.x + b.w; x++) for (let y = b.y; y < b.y + b.h; y++) for (const v of [false, true]) if (fits(bi, u, x, y, v)) return false; return true; };
  const read = h("div", { class: "ar6read" }), tblHost = h("div");
  const draw = () => {
    placedG.innerHTML = "";
    [0, 1].forEach(bi => S[cu.id][bi].forEach(p => {
      if (cu.id === "c") { const C = m([p.cells[0][0] + .5, p.cells[0][1] + .5]); placedG.append(svgEl("circle", { cx: C[0], cy: C[1], r: k / 2 - 2, fill: "#BFD9F5", stroke: AR6.blue, "stroke-width": 2 })); }
      else { const xs = p.cells.map(c => c[0]), ys = p.cells.map(c => c[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0 + 1, hh = Math.max(...ys) - y0 + 1;
        ar6Poly0(placedG, m, [[x0 + .06, y0 + .06], [x0 + w - .06, y0 + .06], [x0 + w - .06, y0 + hh - .06], [x0 + .06, y0 + hh - .06]], { fill: cu.id === "d" ? "#CFE8D8" : "#BFD9F5", stroke: cu.id === "d" ? AR6.green : AR6.blue, w: 2 }); }
    }));
    const c0 = S[cu.id][0].length, c1 = S[cu.id][1].length;
    read.textContent = `${cu.name} 단위로 — 가: ${c0}개${full(0, cu) ? " (다 채움)" : ""}, 나: ${c1}개${full(1, cu) ? " (다 채움)" : ""}`;
    tblHost.innerHTML = "";
    tblHost.append(ar6Tbl(["단위 모양", "가(개)", "나(개)"], units.map(u => [u.name, (full(0, u) ? String(S[u.id][0].length) : "?"), (full(1, u) ? String(S[u.id][1].length) : "?")])));
  };
  const put = p => {
    if (fin) return; const x = Math.floor((p.x - m.ox) / k), y = Math.floor((p.y - m.oy) / k);
    const bi = bricks.findIndex(b => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h); if (bi < 0) return;
    if (!fits(bi, cu, x, y, vert)) return;
    S[cu.id][bi].push({ cells: shapeCells(cu, x, y, vert) }); draw(); test();
  };
  let fin = false;
  const test = () => { if (units.every(u => full(0, u) && full(1, u))) { fin = true; ar6Finish(body, api, opt, units.map(u => `${u.name} 가${S[u.id][0].length} 나${S[u.id][1].length}`).join(" / "), "세 가지 단위 모양으로 벽돌 가와 나를 모두 채워 보았어요."); } };
  dragOn(svg, p => { put(p); return !fin; }, p => put(p));
  const tabs = h("div", { class: "tools" }, h("span", {}, "단위 모양:"), units.map(u => h("button", { class: u === cu ? "on" : "", onclick: e => { cu = u; [...tabs.querySelectorAll("button.u")].forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); vb.style.display = u.id === "d" ? "" : "none"; draw(); } }, u.name)));
  [...tabs.querySelectorAll("button")].forEach(b => b.classList.add("u"));
  const vb = h("button", { style: "display:none", onclick: e => { vert = !vert; e.currentTarget.textContent = vert ? "▯ 세로로 놓기" : "▭ 가로로 놓기"; } }, "▭ 가로로 놓기");
  tabs.append(vb);
  api.provide({ words: ["빈틈", "단위", "정사각형"], answers: [] });
  body.append(h("p", { class: "ar6small" }, "단위 모양을 고르고 벽돌 위를 누르거나 문질러 겹치지 않게 놓아요. 더 놓을 자리가 없을 때까지 채워요. 세 가지 단위를 모두 해 봐요."), tabs, svg, read, tblHost,
    h("div", { class: "tools" }, h("button", { onclick: () => { if (fin) return; S[cu.id] = [[], []]; draw(); } }, "이 단위 다시 놓기")));
  draw();
}

/* =========================================================
   8. 점을 이어 도형 그리기 — 넓이가 주어진 평행사변형·삼각형·마름모·사다리꼴
   opt: {cols, rows, k, tasks:[{kind:"par"|"tri"|"rh"|"trap", area, label}], differ, ok, ask|then}
   ========================================================= */
const AR6_KIND = { par: "평행사변형", tri: "삼각형", rh: "마름모", trap: "사다리꼴" };
function ar6KindOk(kind, P) {
  const n = P.length, cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  for (let i = 0; i < n; i++) if (Math.abs(cr(P[i], P[(i + 1) % n], P[(i + 2) % n])) < 1e-9) return "한 직선 위에 있는 세 점을 이어서 꼭짓점이 아닌 점이 생겼어요.";
  if (kind === "tri") return n === 3 ? null : "꼭짓점이 3개인 삼각형을 그려요.";
  if (n !== 4) return `꼭짓점이 4개인 ${AR6_KIND[kind]}${ar6Jo(AR6_KIND[kind], "을/를").slice(-1)} 그려요.`;
  // 꼬이지 않았는지(볼록)
  const s = [0, 1, 2, 3].map(i => Math.sign(cr(P[i], P[(i + 1) % 4], P[(i + 2) % 4]))); if (!s.every(v => v === s[0])) return "변이 서로 엇갈리지 않게, 볼록한 사각형으로 그려요.";
  const v = i => [P[(i + 1) % 4][0] - P[i][0], P[(i + 1) % 4][1] - P[i][1]], par = (a, b) => Math.abs(a[0] * b[1] - a[1] * b[0]) < 1e-9;
  const p02 = par(v(0), v(2)), p13 = par(v(1), v(3));
  if (kind === "trap") return p02 || p13 ? null : "평행한 변이 한 쌍이라도 있어야 사다리꼴이에요.";
  if (!(p02 && p13)) return "마주 보는 두 쌍의 변이 서로 평행해야 해요.";
  if (kind === "rh") { const L = [0, 1, 2, 3].map(i => v(i)[0] ** 2 + v(i)[1] ** 2); return L.every(x => x === L[0]) ? null : "마름모는 네 변의 길이가 모두 같아야 해요."; }
  return null;
}
function ar6Poly(body, api, opt) {
  const k = opt.k || 32, pad = 20, cols = opt.cols, rows = opt.rows, W = cols * k + pad * 2, H = rows * k + pad * 2, m = ar6Map(k, pad, pad);
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = opt.maxW || "32em";
  svg.append(ar6GridG(cols, rows, m));
  const doneG = svgEl("g", { "pointer-events": "none" }), curG = svgEl("g", { "pointer-events": "none" }); svg.append(doneG, curG);
  for (let x = 0; x <= cols; x++) for (let y = 0; y <= rows; y++) { const P = m([x, y]); const c = svgEl("circle", { cx: P[0], cy: P[1], r: 9, fill: "transparent", class: "ar6hit" }); c.addEventListener("click", () => tap([x, y])); svg.append(svgEl("circle", { cx: P[0], cy: P[1], r: 2.4, fill: "#A9BBCB", "pointer-events": "none" }), c); }
  let pts = [], ti = 0; const made = [];
  const tasks = opt.tasks, taskTxt = h("div", { class: "jua" }), read = h("div", { class: "ar6read" });
  const lab = t => t.label || `넓이가 ${t.area} cm²인 ${AR6_KIND[t.kind]}${ar6Jo(AR6_KIND[t.kind], "을/를").slice(-1)} 그려요.`;
  const setTask = () => { taskTxt.textContent = ti < tasks.length ? `${tasks.length > 1 ? `(${ti + 1}/${tasks.length}) ` : ""}${lab(tasks[ti])}` : ""; };
  const drawCur = () => {
    curG.innerHTML = ""; if (!pts.length) { read.textContent = "점을 차례로 눌러 꼭짓점을 찍고, 처음 점을 다시 누르면 도형이 닫혀요."; return; }
    curG.append(svgEl("polyline", { points: ar6Pts(pts, m), fill: "none", stroke: AR6.org, "stroke-width": 3, "stroke-linejoin": "round" }));
    pts.forEach((p, i) => { const Q = m(p); curG.append(svgEl("circle", { cx: Q[0], cy: Q[1], r: i ? 4.5 : 6.5, fill: i ? AR6.org : AR6.red })); });
    read.textContent = `찍은 꼭짓점 ${pts.length}개 — 처음 점(빨간 점)을 누르면 닫혀요.`;
  };
  const sig = P => { const n = P.length, d = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) d.push((P[i][0] - P[j][0]) ** 2 + (P[i][1] - P[j][1]) ** 2); return d.sort((a, b) => a - b).join(","); };
  function tap(p) {
    if (ti >= tasks.length) return;
    if (pts.length >= 3 && p[0] === pts[0][0] && p[1] === pts[0][1]) return close();
    if (pts.some(q => q[0] === p[0] && q[1] === p[1])) return;
    if (pts.length >= 6) return api.hint("꼭짓점이 너무 많아요. ‘다시 그리기’를 눌러요.");
    pts.push(p); drawCur();
  }
  function close() {
    const t = tasks[ti], P = pts.slice(); api.tryOnce();
    const bad = ar6KindOk(t.kind, P); if (bad) { api.fail(bad, P.join(" ")); pts = []; drawCur(); return; }
    const A = ar6Area(P);
    if (A !== t.area) { api.fail(`그린 ${AR6_KIND[t.kind]}의 넓이는 ${ar6Fmt(A)} cm²예요. 밑변(대각선)과 높이를 생각해서 넓이가 ${t.area} cm²가 되게 그려 봐요.`, `넓이 ${A}`); pts = []; drawCur(); return; }
    if (opt.differ && made.some(M => sig(M) === sig(P))) { api.fail("앞에서 그린 도형과 모양이 같아요. 모양이 다른 도형을 그려 봐요.", "같은 모양"); pts = []; drawCur(); return; }
    made.push(P); ar6Poly0(doneG, m, P, { fill: [AR6.f3, AR6.f5, AR6.f4][made.length % 3], stroke: AR6.ink, op: .8 });
    pts = []; ti++; setTask(); drawCur();
    if (ti < tasks.length) { api.hint(`○ 넓이가 ${t.area} cm²인 ${AR6_KIND[t.kind]}${ar6Jo(AR6_KIND[t.kind], "이/가").slice(-1)} 맞아요! 다음 것도 그려요.`); return; }
    ar6Finish(body, api, opt, made.map(P => P.map(p => `(${p})`).join("")).join(" / "), opt.msg || "조건에 맞는 도형을 그렸어요.", made);
  }
  api.provide({ words: ["밑변", "높이", "대각선", "윗변", "아랫변"], answers: [] });
  setTask(); drawCur();
  body.append(opt.tip ? h("p", { class: "ar6small" }, opt.tip) : null, taskTxt, svg, read, h("div", { class: "tools" }, h("button", { onclick: () => { pts = []; drawCur(); } }, "다시 그리기")));
}

/* =========================================================
   9. 태민이의 집 둘러보기 — 집 곳곳을 눌러 도형 찾기
   ========================================================= */
const AR6_PLACES = [
  { id: "fence", name: "집터 울타리", shape: "정사각형", what: "둘레", no: "2차시" },
  { id: "garden", name: "정원", shape: "직사각형", what: "둘레", no: "3차시" },
  { id: "brick", name: "벽돌 벽", shape: "벽돌", what: "넓이 비교", no: "4차시" },
  { id: "plate", name: "문패", shape: "직사각형", what: "넓이", no: "5차시" },
  { id: "living", name: "거실 바닥", shape: "직사각형", what: "넓은 곳의 넓이(1 m²)", no: "6~7차시" },
  { id: "tile", name: "화장실 타일", shape: "평행사변형", what: "넓이", no: "8~9차시" },
  { id: "window", name: "창고 창문", shape: "삼각형", what: "넓이", no: "10~11차시" },
  { id: "field", name: "텃밭", shape: "마름모", what: "넓이", no: "12차시" },
  { id: "shade", name: "수영장 그늘막", shape: "사다리꼴", what: "넓이", no: "13~14차시" }];
function ar6House(body, api, opt) {
  const W = 640, H = 420, svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = "40em";
  svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "#EAF5E4" }));
  const parts = {};
  const add = (id, el) => { el.classList.add("ar6hit"); el.dataset.id = id; svg.append(el); (parts[id] = parts[id] || []).push(el); el.addEventListener("click", () => tap(id)); return el; };
  const P = (pts, f, s, w) => svgEl("polygon", { points: pts.map(p => p.join(",")).join(" "), fill: f, stroke: s || AR6.ink, "stroke-width": w || 2, "stroke-linejoin": "round" });
  // 울타리(정사각형)
  add("fence", svgEl("rect", { x: 20, y: 20, width: 380, height: 380, fill: "none", stroke: "#9A6B3E", "stroke-width": 9, "stroke-dasharray": "14 6" }));
  // 집
  svg.append(P([[60, 120], [130, 60], [200, 120]], "#E9A07A"));
  svg.append(svgEl("rect", { x: 60, y: 120, width: 140, height: 120, fill: "#FFF6E8", stroke: AR6.ink, "stroke-width": 2 }));
  add("living", svgEl("rect", { x: 70, y: 130, width: 120, height: 50, fill: "#F6E1B8", stroke: "#B08A1E", "stroke-width": 2 }));
  svg.append(txt(130, 155, "거실", 14, { fill: "#7A6A3A", "pointer-events": "none" }));
  const tg = svgEl("g"); [[80, 190], [110, 190], [140, 190], [95, 210], [125, 210], [155, 210]].forEach(([x, y]) => tg.append(P([[x, y + 16], [x + 22, y + 16], [x + 30, y], [x + 8, y]], "#BFE0EE", "#2C8C88", 1.5))); add("tile", tg);
  const bw = svgEl("g"); for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) bw.append(svgEl("rect", { x: 60 + c * 28 + (r % 2 ? 14 : 0), y: 244 + r * 12, width: c === 4 && r % 2 ? 14 : 28, height: 12, fill: "#D98C6A", stroke: "#8C4A2F", "stroke-width": 1 })); add("brick", bw);
  // 정원
  add("garden", svgEl("rect", { x: 240, y: 50, width: 130, height: 80, fill: "#BFE3B0", stroke: AR6.green, "stroke-width": 2.5 }));
  svg.append(txt(305, 90, "정원", 15, { fill: "#2F6B57", "pointer-events": "none" }));
  // 창고 + 삼각형 창문
  svg.append(svgEl("rect", { x: 250, y: 160, width: 110, height: 90, fill: "#E7D3B5", stroke: AR6.ink, "stroke-width": 2 }));
  svg.append(txt(305, 237, "창고", 14, { fill: "#6B5432", "pointer-events": "none" }));
  add("window", P([[280, 220], [340, 220], [300, 178]], "#CFE6FA", AR6.blue, 2.5));
  // 텃밭(마름모)
  add("field", P([[80, 330], [150, 295], [220, 330], [150, 365]], "#C9E6A0", "#6B8E23", 2.5));
  svg.append(txt(150, 330, "텃밭", 14, { fill: "#4A6A1A", "pointer-events": "none" }));
  // 수영장 + 그늘막(사다리꼴)
  svg.append(svgEl("rect", { x: 250, y: 300, width: 120, height: 70, fill: "#9FD3F2", stroke: "#2B7BD6", "stroke-width": 2 }));
  add("shade", P([[262, 296], [358, 296], [338, 268], [282, 268]], "#F7C8D0", "#C2456A", 2.5));
  // 문패
  add("plate", svgEl("rect", { x: 180, y: 384, width: 60, height: 26, fill: "#FFF1C7", stroke: "#B08A1E", "stroke-width": 2 }));
  svg.append(txt(210, 398, "태민", 13, { "pointer-events": "none" }));
  // 오른쪽 안내
  svg.append(txt(520, 40, "태민이의 온라인 집", 18, { fill: "#2F6B57" }));
  const found = new Set(), list = h("ol", { class: "ar6list" }), read = h("div", { class: "ar6read" });
  const say = svgEl("g", { "pointer-events": "none" }); svg.append(say);
  function tap(id) {
    const pl = AR6_PLACES.find(p => p.id === id); if (!pl) return;
    (parts[id] || []).forEach(e => { e.setAttribute("filter", ""); e.style.opacity = 1; });
    say.innerHTML = ""; say.append(svgEl("rect", { x: 420, y: 70, width: 210, height: 96, rx: 12, fill: "#FFFBF2", stroke: "#E8D3B0", "stroke-width": 2 }),
      txt(525, 98, pl.name, 18, { fill: AR6.org }), txt(525, 124, `${pl.shape} 모양`, 16), txt(525, 148, `→ ${pl.what} (${pl.no})`, 14, { fill: AR6.gray }));
    if (found.has(id)) return; found.add(id);
    list.append(h("li", {}, `${pl.name} — ${pl.shape} · ${pl.what} (${pl.no})`));
    read.textContent = `찾은 곳 ${found.size}/${AR6_PLACES.length}`;
    if (found.size === AR6_PLACES.length) ar6Finish(body, api, opt, [...found].join(","), "태민이의 집에서 둘레와 넓이를 알아볼 곳을 모두 찾았어요.");
  }
  api.provide({ words: AR6_PLACES.map(p => p.shape), answers: [] });
  read.textContent = `찾은 곳 0/${AR6_PLACES.length}`;
  body.append(svg, read, list);
}

/* =========================================================
   10. 직사각형 보물 탐험대 — 주사위 두 개의 곱이 넓이 또는 둘레가 되는 직사각형을 그려 보물 찾기
   ========================================================= */
const AR6_TREASURE = [[1, 1], [8, 1], [4, 3], [11, 2], [2, 6], [7, 6], [10, 7], [5, 8]];
function ar6Game(body, api, opt) {
  const cols = 12, rows = 10, k = 32, pad = 18, W = cols * k + pad * 2, H = rows * k + pad * 2, m = ar6Map(k, pad, pad), goal = opt.goal || 5;
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = "32em";
  svg.append(ar6GridG(cols, rows, m));
  const keepG = svgEl("g"), trG = svgEl("g", { "pointer-events": "none" }), cur = svgEl("g", { "pointer-events": "none" }); svg.append(keepG, trG, cur);
  for (let x = 0; x <= cols; x++) for (let y = 0; y <= rows; y++) { const P = m([x, y]); svg.append(svgEl("circle", { cx: P[0], cy: P[1], r: 2, fill: "#A9BBCB", "pointer-events": "none" })); }
  const got = new Set(), rects = [];
  const drawTr = () => { trG.innerHTML = ""; AR6_TREASURE.forEach(([x, y], i) => { const C = m([x + .5, y + .5]); trG.append(svgEl("rect", { x: C[0] - 10, y: C[1] - 8, width: 20, height: 15, rx: 3, fill: got.has(i) ? "#F6CF6B" : "#C9A15A", stroke: "#7A5A1E", "stroke-width": 1.5 }), txt(C[0], C[1] - 1, got.has(i) ? "★" : "", 12, { fill: "#B03A2E" })); }); };
  let N = 0, mode = null, R = null, fin = false, d1 = 0, d2 = 0;
  const dieSvg = v => { const s = makeSvg(60, 60); s.append(svgEl("rect", { x: 3, y: 3, width: 54, height: 54, rx: 10, fill: "#fff", stroke: AR6.ink, "stroke-width": 2.5 }));
    const P = { 1: [[30, 30]], 2: [[17, 17], [43, 43]], 3: [[17, 17], [30, 30], [43, 43]], 4: [[17, 17], [43, 17], [17, 43], [43, 43]], 5: [[17, 17], [43, 17], [30, 30], [17, 43], [43, 43]], 6: [[17, 15], [43, 15], [17, 30], [43, 30], [17, 45], [43, 45]] }[v] || [];
    P.forEach(([x, y]) => s.append(svgEl("circle", { cx: x, cy: y, r: 5, fill: AR6.ink }))); return s; };
  const diceBox = h("span", { class: "ar6dice" }), info = h("div", { class: "ar6read" }), score = h("div", { class: "jua" });
  const bA = h("button", { disabled: true, onclick: () => pick("area") }, "넓이로"), bP = h("button", { disabled: true, onclick: () => pick("perim") }, "둘레로");
  const occ = () => { const o = new Set(); rects.forEach(r => { for (let x = r.x; x < r.x + r.w; x++) for (let y = r.y; y < r.y + r.h; y++) o.add(x + "," + y); }); return o; };
  const can = (w, hh) => { const o = occ(); for (let x = 0; x + w <= cols; x++) for (let y = 0; y + hh <= rows; y++) { let ok = true; for (let i = x; i < x + w && ok; i++) for (let j = y; j < y + hh; j++) if (o.has(i + "," + j)) { ok = false; break; } if (ok) return true; } return false; };
  const options = (md, n) => { const r = []; if (md === "area") { for (let w = 1; w <= n; w++) if (n % w === 0) r.push([w, n / w]); } else if (n % 2 === 0) { for (let w = 1; w < n / 2; w++) r.push([w, n / 2 - w]); } return r.filter(([w, hh]) => can(w, hh)); };
  function roll() {
    if (fin) return; d1 = 1 + Math.floor(Math.random() * 6); d2 = 1 + Math.floor(Math.random() * 6); N = d1 * d2; mode = null; R = null; cur.innerHTML = "";
    diceBox.innerHTML = ""; diceBox.append(dieSvg(d1), h("span", { class: "jua" }, "×"), dieSvg(d2), h("span", { class: "jua" }, `= ${N}`));
    const oa = options("area", N), op = options("perim", N);
    bA.disabled = !oa.length; bP.disabled = !op.length;
    info.textContent = !oa.length && !op.length ? `${ar6Jo(N, "으로/로")} 그릴 수 있는 직사각형이 판에 들어갈 자리가 없어요. 주사위를 다시 던져요.` : `곱이 ${N}이에요. 넓이로 할지 둘레로 할지 골라요.${!op.length ? " (둘레로는 그릴 수 없어요.)" : ""}${!oa.length ? " (넓이로는 들어갈 자리가 없어요.)" : ""}`;
  }
  function pick(md) { if (!N || fin) return; mode = md; bA.classList.toggle("on", md === "area"); bP.classList.toggle("on", md === "perim"); info.textContent = md === "area" ? `넓이가 ${N} cm²인 직사각형을 빈 곳에 그려요.` : `둘레가 ${N} cm인 직사각형을 빈 곳에 그려요.`; }
  const show = r => { cur.innerHTML = ""; if (!r) return; const x0 = Math.min(r[0][0], r[1][0]), y0 = Math.min(r[0][1], r[1][1]), w = Math.abs(r[1][0] - r[0][0]), hh = Math.abs(r[1][1] - r[0][1]); if (!w || !hh) return; ar6Poly0(cur, m, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + hh], [x0, y0 + hh]], { fill: AR6.f2, stroke: AR6.org, op: .7, w: 2.6 }); };
  ar6DragRect(svg, m, cols, rows, (a, b) => { R = [a, b]; show(R); }, (a, b) => { R = [a, b]; show(R); }, () => !fin && !!mode);
  const place = () => {
    if (!mode || !R) return api.hint(!N ? "먼저 주사위를 던져요." : !mode ? "넓이로 할지 둘레로 할지 먼저 골라요." : "직사각형을 그려요.");
    const x0 = Math.min(R[0][0], R[1][0]), y0 = Math.min(R[0][1], R[1][1]), w = Math.abs(R[1][0] - R[0][0]), hh = Math.abs(R[1][1] - R[0][1]);
    if (!w || !hh) return api.hint("직사각형을 그려요.");
    api.tryOnce();
    const o = occ(); for (let i = x0; i < x0 + w; i++) for (let j = y0; j < y0 + hh; j++) if (o.has(i + "," + j)) return api.fail("앞에서 그린 직사각형과 겹치지 않게 그려요.", `${w}×${hh}`);
    if (mode === "area" && w * hh !== N) return api.fail(`그린 직사각형의 넓이는 ${w}×${hh}=${w * hh} (cm²)예요. 넓이가 ${N} cm²가 되게 그려요.`, `${w}×${hh}`);
    if (mode === "perim" && (w + hh) * 2 !== N) return api.fail(`그린 직사각형의 둘레는 (${w}+${hh})×2=${(w + hh) * 2} (cm)예요. 둘레가 ${N} cm가 되게 그려요.`, `${w}×${hh}`);
    rects.push({ x: x0, y: y0, w, h: hh }); const col = [AR6.f1, AR6.f3, AR6.f5, AR6.f4, AR6.f6][rects.length % 5];
    ar6Poly0(keepG, m, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + hh], [x0, y0 + hh]], { fill: col, stroke: AR6.ink, w: 2 });
    const C = m([x0 + w / 2, y0 + hh / 2]); keepG.append(txt(C[0], C[1] + (w * hh === 1 ? 0 : 0), mode === "area" ? `넓이${N}` : `둘레${N}`, w >= 3 ? 13 : 9, { fill: AR6.gray }));
    const before = got.size; AR6_TREASURE.forEach(([tx, ty], i) => { if (tx >= x0 && tx < x0 + w && ty >= y0 && ty < y0 + hh) got.add(i); });
    drawTr(); cur.innerHTML = ""; R = null; mode = null; N = 0; bA.disabled = bP.disabled = true; bA.classList.remove("on"); bP.classList.remove("on"); diceBox.innerHTML = "";
    score.textContent = `그린 직사각형 ${rects.length}/${goal} · 찾은 보물 ${got.size}개`;
    if (rects.length >= goal) { fin = true; return ar6Finish(body, api, opt, `직사각형 ${rects.length}개, 보물 ${got.size}개`, `직사각형 ${rects.length}개를 그려 보물 ${got.size}개를 찾았어요!`, { n: got.size }); }
    api.hint(got.size > before ? `○ 보물을 ${got.size - before}개 찾았어요! 주사위를 다시 던져요.` : "○ 바르게 그렸어요. 주사위를 다시 던져요.");
  };
  api.provide({ words: ["넓이 = 가로×세로", "둘레 = (가로+세로)×2"], answers: [] });
  drawTr(); score.textContent = `그린 직사각형 0/${goal} · 찾은 보물 0개`; info.textContent = "주사위를 던져 시작해요.";
  body.append(h("div", { class: "tools" }, h("button", { onclick: roll }, "🎲 주사위 던지기"), diceBox, bA, bP), info, svg, score,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: place }, "이 직사각형으로 정하기")));
}

/* =========================================================
   11. 모눈 색칠하기 — 칸을 누르거나 문질러 넓이가 주어진 도형 그리기
   opt: {cols, rows, k, tasks:[{area, label}], differ, ok, ask|then}
   ========================================================= */
function ar6Paint(body, api, opt) {
  const k = opt.k || 34, pad = 18, cols = opt.cols, rows = opt.rows, W = cols * k + pad * 2, H = rows * k + pad * 2, m = ar6Map(k, pad, pad);
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = opt.maxW || "30em";
  const cells = new Set(), rects = {};
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const P = m([x, y]); const r = svgEl("rect", { x: P[0], y: P[1], width: k, height: k, fill: "#fff", stroke: AR6.grid, "stroke-width": 1 }); rects[x + "," + y] = r; svg.append(r); }
  const read = h("div", { class: "ar6read" }), taskTxt = h("div", { class: "jua" }), madeTxt = h("div", { class: "ar6small" });
  const tasks = opt.tasks; let ti = 0, addMode = true; const made = [];
  const paint = () => { Object.entries(rects).forEach(([key, r]) => r.setAttribute("fill", cells.has(key) ? "#9CC3F0" : "#fff")); read.textContent = `색칠한 칸: ${cells.size}개 → ${cells.size} cm²`; };
  const setTask = () => { taskTxt.textContent = ti < tasks.length ? `${tasks.length > 1 ? `(${ti + 1}/${tasks.length}) ` : ""}${tasks[ti].label || `넓이가 ${tasks[ti].area} cm²인 도형을 색칠해요.`}` : ""; };
  const at = p => { const x = Math.floor((p.x - pad) / k), y = Math.floor((p.y - pad) / k); return x >= 0 && y >= 0 && x < cols && y < rows ? x + "," + y : null; };
  dragOn(svg, p => { if (ti >= tasks.length) return false; const c = at(p); if (!c) return false; addMode = !cells.has(c); addMode ? cells.add(c) : cells.delete(c); paint(); return true; },
    p => { const c = at(p); if (!c) return; addMode ? cells.add(c) : cells.delete(c); paint(); });
  const canon = set => {   // 돌리기·뒤집기를 해도 같은 모양이면 같은 글자
    const P = [...set].map(s => s.split(",").map(Number)); const fs = [([x, y]) => [x, y], ([x, y]) => [-x, y], ([x, y]) => [x, -y], ([x, y]) => [-x, -y], ([x, y]) => [y, x], ([x, y]) => [-y, x], ([x, y]) => [y, -x], ([x, y]) => [-y, -x]];
    return fs.map(f => { const Q = P.map(f), mx = Math.min(...Q.map(q => q[0])), my = Math.min(...Q.map(q => q[1])); return Q.map(q => (q[0] - mx) + "," + (q[1] - my)).sort().join(";"); }).sort()[0];
  };
  const connected = set => { const arr = [...set]; if (!arr.length) return false; const seen = new Set([arr[0]]), st = [arr[0]]; while (st.length) { const [x, y] = st.pop().split(",").map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const q = (x + dx) + "," + (y + dy); if (set.has(q) && !seen.has(q)) { seen.add(q); st.push(q); } }); } return seen.size === set.size; };
  const btn = h("button", { class: "big", onclick: () => {
    if (ti >= tasks.length) return; const t = tasks[ti]; api.tryOnce();
    if (cells.size !== t.area) return api.fail(`색칠한 칸이 ${cells.size}개예요. 1 cm²가 ${t.area}개가 되게 색칠해요.`, `${cells.size}칸`);
    if (!connected(cells)) return api.fail("칸들이 변끼리 붙어서 한 도형이 되게 색칠해요.", "떨어진 칸");
    if (opt.differ && made.some(c => c === canon(cells))) return api.fail("앞에서 그린 도형과 모양이 같아요(돌리거나 뒤집으면 같아요). 다른 모양으로 그려요.", "같은 모양");
    made.push(canon(cells)); cells.clear(); paint(); ti++; setTask(); madeTxt.textContent = `그린 도형 ${made.length}개`;
    if (ti < tasks.length) return api.hint("○ 맞아요! 다음 도형도 그려요.");
    btn.disabled = true; ar6Finish(body, api, opt, `도형 ${made.length}개`, opt.msg || "넓이가 같은 도형을 서로 다른 모양으로 그렸어요.");
  } }, "다 그렸어요");
  api.provide({ words: ["1 cm²", "칸의 수"], answers: [] });
  setTask(); paint();
  body.append(opt.tip ? h("p", { class: "ar6small" }, opt.tip) : null, taskTxt, svg, read, madeTxt, h("div", { class: "tools" }, h("button", { onclick: () => { cells.clear(); paint(); } }, "모두 지우기")), h("div", { class: "actions" }, btn));
}
/* 정다각형 여러 개 그림 (한 변 길이 글자) */
function ar6RegFig(items, maxW) {
  const cw = 200, W = items.length * cw, H = 220;
  return ar6Fig(W, H, s => items.forEach((it, i) => {
    const P = ar6Reg(it.n, it.side), xs = P.map(p => p[0]), ys = P.map(p => p[1]), bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
    const k = Math.min(140 / bw, 140 / bh), cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    const m = ar6Map(k, i * cw + cw / 2 - cx * k, 100 - cy * k);
    ar6Poly0(s, m, P, { fill: it.fill || AR6.f1 });
    ar6Lab(s, m, P[it.n - 1], P[0], it.lab, { c: [0, 0], size: 16 });
    if (it.name) s.append(txt(i * cw + cw / 2, 205, it.name, 17, { fill: AR6.gray }));
  }), maxW || (items.length * 11 + "em"));
}
/* 칸 목록 → 그림 도형들 */
function ar6Cells(cells, fill, dx = 0, dy = 0) { return cells.map(([x, y]) => ({ P: [[x + dx, y + dy], [x + dx + 1, y + dy], [x + dx + 1, y + dy + 1], [x + dx, y + dy + 1]], fill: fill || AR6.f1, stroke: "#5F7A92", w: 1.4 })); }
//@@LESSONS
const UNIT_STORY = { title: "태민이의 온라인 집 짓기", lines: [
  "태민이는 캐릭터를 만들어 온라인 공간에 집을 지었어요. 집터에 정사각형 모양의 울타리를 치고, 직사각형 모양의 정원과 문패를 만들고, 창고에는 삼각형 모양의 창문, 마당에는 마름모 모양의 텃밭, 수영장에는 사다리꼴 모양의 그늘막을 만들었어요.",
  "태민이가 만든 집을 함께 살펴보며 정다각형과 사각형의 둘레, 넓이의 단위 1 cm²·1 m²·1 km², 직사각형·평행사변형·삼각형·마름모·사다리꼴의 넓이를 구하는 방법을 알아봐요.",
  "교과서 「수학 5-1」 6. 다각형의 둘레와 넓이의 차시 순서 그대로 만들었어요."],
  one: "다각형의 둘레와 넓이 · 태민이의 온라인 집에서 둘레를 재고, 1 cm²를 세고, 도형을 잘라 옮겨 넓이를 구해요." };
const UNIT_KEYWORDS = ["둘레", "정다각형의 둘레", "넓이", "1 cm²(1 제곱센티미터)", "1 m²(1 제곱미터)", "1 km²(1 제곱킬로미터)", "가로", "세로", "밑변", "높이", "윗변", "아랫변", "대각선", "(가로)×(세로)", "(밑변의 길이)×(높이)", "(밑변의 길이)×(높이)÷2", "(한 대각선)×(다른 대각선)÷2", "(윗변+아랫변)×(높이)÷2"];

/* ---- 그림 자료(모두 cm 모눈 좌표) ---- */
const AR6_PAR = [[1, 4], [6, 4], [9, 1], [4, 1]];            // 8~9차시: 밑변 5 cm, 높이 3 cm (1 cm² 12개 + 반 칸 6개)
const AR6_TRI = [[1, 5], [9, 5], [3, 1]];                    // 10~11차시: 밑변 8 cm, 높이 4 cm
const AR6_TRI_TOP = [[3, 1], [2, 3], [6, 3]], AR6_TRI_BOT = [[2, 3], [6, 3], [9, 5], [1, 5]];
const AR6_RH = [[1, 3], [4, 1], [7, 3], [4, 5]];             // 12차시: 대각선 6 cm, 4 cm
const AR6_TZ = [[1, 5], [9, 5], [5, 1], [3, 1]];             // 13~14차시: 윗변 2 cm, 아랫변 8 cm, 높이 4 cm
const AR6_TZ_TOP = [[3, 1], [5, 1], [7, 3], [2, 3]], AR6_TZ_BOT = [[2, 3], [7, 3], [9, 5], [1, 5]];
const AR6_RTZ = [[1, 1], [3, 1], [7, 5], [1, 5]];            // 13~14차시 활동 5: 윗변 2, 아랫변 6, 높이 4
const AR6_T4 = [[1, 1], [2, 1], [3, 1], [2, 2]];             // 4차시: 1 cm² 4개
const AR6_C15 = [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [1, 3], [2, 3], [3, 3], [1, 4], [2, 4]];   // 15 cm²
const AR6_CMP = { ga: [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3]], na: [[6, 1], [7, 1], [8, 1], [6, 2], [7, 2], [8, 2], [6, 3], [7, 3], [8, 3]], da: [[11, 1], [12, 1], [11, 2], [12, 2], [11, 3], [12, 3]] };
const AR6_RECT = (x, y, w, hh) => [[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]];
const AR6_SQ3 = 3 * Math.sqrt(3) / 2;   // 정삼각형 높이(그림용)

/* 115쪽 야구장 내야 그림 */
function ar6Diamond() {
  return ar6Fig(400, 260, s => {
    s.append(svgEl("path", { d: "M200 250 L20 80 A250 250 0 0 1 380 80 Z", fill: "#BFE3B0", stroke: "#6B8E23", "stroke-width": 2 }));
    const P = [[200, 230], [290, 140], [200, 50], [110, 140]];
    s.append(svgEl("polygon", { points: P.map(p => p.join(",")).join(" "), fill: "#E9C79B", stroke: "#fff", "stroke-width": 4 }));
    [["본루", 0, 0, 18], ["1루", 1, 26, 0], ["2루", 2, 0, -16], ["3루", 3, -26, 0]].forEach(([t, i, dx, dy]) => { s.append(svgEl("rect", { x: P[i][0] - 7, y: P[i][1] - 7, width: 14, height: 14, fill: "#fff", stroke: AR6.ink, transform: `rotate(45 ${P[i][0]} ${P[i][1]})` })); s.append(txt(P[i][0] + dx, P[i][1] + dy, t, 15)); });
    s.append(txt(200, 140, "내야", 18, { fill: "#7A4A1E" }));
  }, "24em");
}
/* 평행선 사이의 거리 그림(배운 내용 떠올리기) */
function ar6ParLines() {
  return ar6Static({ cols: 10, rows: 4, k: 30, grid: false,
    segs: [{ a: [0, .5], b: [10, .5], color: AR6.ink, w: 2.5 }, { a: [0, 3.5], b: [10, 3.5], color: AR6.ink, w: 2.5 }, { a: [1, .5], b: [3, 3.5], color: AR6.org }, { a: [5, .5], b: [5, 3.5], color: AR6.blue }, { a: [9, .5], b: [7, 3.5], color: AR6.green }],
    rights: [{ F: [5, 3.5], u: [1, 0], v: [0, -1], color: AR6.blue }],
    texts: [{ p: [1.6, 2], t: "㉠", color: AR6.org }, { p: [5.5, 2], t: "㉡", color: AR6.blue }, { p: [8.5, 2], t: "㉢", color: AR6.green }], maxW: "24em" });
}

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 태민이의 온라인 집 둘러보기", soop: "개념 찾기(S)",
  question: "태민이가 온라인 공간에 지은 집에서 둘레와 넓이를 구해야 하는 곳은 어디일까요?",
  summary: "우리 주변에는 둘레나 넓이를 구해야 하는 상황이 많아요. 둘레는 도형의 테두리를 한 바퀴 돈 길이이고, 넓이는 도형이 차지하는 평면의 크기예요. 이 단원에서는 정다각형과 사각형의 둘레, 넓이의 단위, 여러 가지 다각형의 넓이를 구하는 방법을 알아봐요.",
  steps: [
    { name: "찾아 보기", inst: "태민이는 캐릭터를 만들어 온라인 공간에 집을 지었어요. 집 곳곳을 눌러 어떤 도형이 있는지 모두 찾아보세요.", hints: ["울타리, 정원, 문패, 거실, 화장실 타일, 창고 창문, 텃밭, 수영장 그늘막, 벽돌 벽을 찾아요.", "한 번 누른 곳은 오른쪽 위에 이름과 모양이 나와요."],
      render: (b, a) => ar6House(b, a, { ok: "태민이의 집에서 정사각형, 직사각형, 평행사변형, 삼각형, 마름모, 사다리꼴을 찾았어요. 이 도형들의 둘레와 넓이를 차례로 알아봐요." }) },
    { name: "생각해 보기", inst: "야구장에서 본루, 1루, 2루, 3루를 연결한 선으로 둘러싸인 곳을 내야라고 해요. 그림을 보고 물음에 답해 보세요.", hints: ["내야는 네 변의 길이가 모두 같고 네 각이 모두 직각이에요.", "둘레는 테두리를 한 바퀴 돈 길이, 넓이는 차지하는 평면의 크기예요."],
      render: (b, a) => quiz(b, a, [
        { q: "내야는 어떤 모양일까요?", fig: ar6Diamond, o: ["직사각형", "정사각형", "사다리꼴"], a: 1, why: { "0": "내야는 네 변의 길이가 모두 같아요.", "2": "사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이에요. 내야는 네 변의 길이가 모두 같고 네 각이 모두 직각이에요." } },
        { q: "내야의 ‘둘레’를 구한다는 것은 무엇을 구하는 것일까요?", o: ["본루 → 1루 → 2루 → 3루 → 본루로 한 바퀴 도는 길이", "내야가 차지하는 평면의 크기"], a: 0 },
        { q: "내야의 ‘넓이’를 구한다는 것은 무엇을 구하는 것일까요?", o: ["본루 → 1루 → 2루 → 3루 → 본루로 한 바퀴 도는 길이", "내야가 차지하는 평면의 크기"], a: 1 }],
        { ok: "내야는 정사각형이에요. 둘레는 한 바퀴 도는 길이, 넓이는 차지하는 평면의 크기예요." }) },
    { name: "떠올리기", inst: "배운 내용을 떠올려 보세요. (수학익힘 ‘이전에 배웠어요’)", hints: ["평행선 사이의 거리는 평행선 사이에 그은 수선의 길이예요.", "평행사변형은 마주 보는 두 쌍의 변이 서로 평행해요."],
      render: (b, a) => quiz(b, a, [
        { q: "두 직선은 서로 평행해요. 평행선 사이의 거리를 나타내는 선분은 어느 것일까요?", fig: ar6ParLines, o: ["㉠", "㉡", "㉢"], a: 1, why: { "0": "평행선 사이의 거리는 평행선에 수직인 선분의 길이예요.", "2": "평행선 사이의 거리는 평행선에 수직인 선분의 길이예요." } },
        { q: "마주 보는 두 쌍의 변이 서로 평행한 사각형은 무엇일까요?", o: ["사다리꼴", "평행사변형", "삼각형"], a: 1, why: { "0": "사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이에요." } },
        { q: "변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형은 무엇일까요?", o: ["정다각형", "대각선", "직사각형"], a: 0 }],
        { ok: "평행선 사이의 거리, 여러 가지 사각형, 정다각형을 잘 기억하고 있어요." }) },
    { name: "이어 보기", inst: "태민이의 집에 있는 곳과 그 모양을 알맞게 이어 보세요.", hints: ["찾아 보기에서 본 모양을 떠올려요.", "그늘막은 평행한 변이 한 쌍만 있어요."],
      render: (b, a) => blanks(b, a, ["집터의 울타리는 ", { o: ["정사각형", "삼각형", "마름모"], a: 0 }, ", 정원과 문패는 ", { o: ["직사각형", "사다리꼴", "평행사변형"], a: 0 }, ", 화장실 타일은 ", { o: ["삼각형", "평행사변형", "정사각형"], a: 1 }, ", 창고 창문은 ", { o: ["마름모", "직사각형", "삼각형"], a: 2 }, ", 텃밭은 ", { o: ["마름모", "사다리꼴", "직사각형"], a: 0 }, ", 수영장 그늘막은 ", { o: ["평행사변형", "사다리꼴", "정사각형"], a: 1 }, " 모양이에요."],
        { ok: "울타리 정사각형, 정원·문패 직사각형, 타일 평행사변형, 창문 삼각형, 텃밭 마름모, 그늘막 사다리꼴이에요." }) },
    { name: "확인하기", inst: "우리 주변에서 둘레나 넓이를 구해 보고 싶은 다각형을 떠올려 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "둘레나 넓이를 구해 보고 싶은 다각형을 써 보세요.", tag: "구해 보고 싶은 것", ph: "예) 텔레비전 화면의 넓이, 옷에 있는 마름모 무늬의 둘레, 직사각형 액자의 넓이" },
        { q: "이 단원에서 알고 싶은 것을 써 보세요.", tag: "알고 싶은 것", ph: "예) 삼각형이나 사다리꼴의 넓이는 어떻게 구하는지 알고 싶어요." }]) }
  ],
  challenge: { inst: "생활 속 상황이에요. 둘레와 넓이 중 무엇을 알아야 하는지 골라 보세요.", hints: ["테두리의 길이가 필요하면 둘레, 평면을 덮는 크기가 필요하면 넓이예요."],
    render: (b, a) => quiz(b, a, [
      { q: "바지를 고르려고 허리를 한 바퀴 재요.", o: ["둘레", "넓이"], a: 0 },
      { q: "벽에 벽지를 빈틈없이 붙이려고 해요.", o: ["둘레", "넓이"], a: 1 },
      { q: "꽃밭 가장자리에 울타리를 치려고 해요.", o: ["둘레", "넓이"], a: 0 },
      { q: "바닥에 깔 돗자리의 크기를 알아보려고 해요.", o: ["둘레", "넓이"], a: 1 }], { ok: "테두리의 길이는 둘레, 덮는 크기는 넓이예요." }) }
},
{
  id: "t2", no: 2, title: "정다각형의 둘레를 구해 볼까요", soop: "개념 구축하기(O)",
  question: "정다각형의 둘레는 어떻게 구할 수 있을까요?",
  summary: "둘레는 사물이나 도형의 테두리 또는 그 길이를 뜻해요. 정다각형은 모든 변의 길이가 같으므로 (정다각형의 둘레) = (한 변의 길이) × (변의 수)로 구해요. 한 변이 4 cm인 정육각형의 둘레는 4×6=24 (cm)예요.",
  steps: [
    { name: "만져 보기", inst: "태민이가 집터에 정사각형 모양으로 울타리를 치려고 해요. 집터 설계도의 정사각형(한 변 3 cm)에 끈을 두르듯 변을 하나씩 눌러 보세요.", hints: ["네 변을 모두 눌러 끈을 한 바퀴 둘러요.", "정사각형은 네 변의 길이가 모두 같아요."],
      render: (b, a) => ar6Perim(b, a, { P: [[0, 0], [3, 0], [3, 3], [0, 3]], labels: { 0: "3 cm" }, ticks: [1, 1, 1, 1], name: "집터",
        ask: [{ q: "둘레는 사물이나 도형의 테두리 또는 그 길이를 뜻해요.", parts: ["정사각형의 변은 ", { n: 4 }, "개이고, 네 변의 길이가 ", { o: ["모두 같아요", "모두 달라요"], a: 0 }, ". 그래서 정사각형의 둘레는 한 변의 길이를 ", { n: 4, why: { "2": "정사각형의 변은 4개예요." } }, "배 하여 구할 수 있어요."] }],
        ok: "정사각형은 네 변의 길이가 모두 같으니까 둘레는 한 변의 길이를 4배 하면 돼요. 3×4=12 (cm)예요." }) },
    { name: "그려 보기", inst: "한 변이 3 cm인 정삼각형과 정오각형에도 끈을 둘러 보고, 표를 완성해 보세요.", hints: ["변을 하나씩 눌러 끈을 둘러요.", "둘레는 한 변의 길이에 변의 수를 곱한 것과 같아요."],
      render: (b, a) => ar6Chain(b, a, [
        { title: "① 정삼각형", run: (bx, ax) => ar6Perim(bx, ax, { P: ar6Reg(3, 3), labels: { 2: "3 cm" }, ticks: [1, 1, 1], ok: "정삼각형의 둘레는 3+3+3=9 (cm)예요." }) },
        { title: "② 정오각형", run: (bx, ax) => ar6Perim(bx, ax, { P: ar6Reg(5, 3), labels: { 4: "3 cm" }, ticks: [1, 1, 1, 1, 1],
          ask: [{ q: "표를 완성해 보세요.", parts: ["정삼각형 — 한 변 3 cm, 변의 수 ", { n: 3 }, "개, 둘레 ", { n: 9 }, " cm", h("br"), "정사각형 — 한 변 3 cm, 변의 수 ", { n: 4 }, "개, 둘레 ", { n: 12 }, " cm", h("br"), "정오각형 — 한 변 3 cm, 변의 수 ", { n: 5 }, "개, 둘레 ", { n: 15, why: { "18": "정오각형의 변은 5개예요. 3×5를 다시 계산해 봐요." } }, " cm"] }],
          ok: "정삼각형 9 cm, 정사각형 12 cm, 정오각형 15 cm예요. 둘레는 한 변의 길이에 변의 수를 곱한 것과 같아요." }) }]) },
    { name: "말해 보기", inst: "정다각형의 둘레를 구하는 방법을 말해 보세요.", hints: ["정다각형은 모든 변의 길이가 같아요.", "같은 수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요."],
      render: (b, a) => blanks(b, a, ["정다각형은 ", { o: ["모든 변의 길이가 같아서", "모든 변의 길이가 달라서"], a: 0 }, " 변의 길이를 하나하나 더하지 않고 ", { o: ["한 변의 길이에 변의 수를 곱하여", "변의 수끼리 더하여"], a: 0 }, " 둘레를 구할 수 있어요. 정오각형의 둘레 3+3+3+3+3은 ", { o: ["3×5", "3+5", "5×5"], a: 0 }, "와 같아요."],
        { ok: "정다각형은 모든 변의 길이가 같아서 한 변의 길이에 변의 수를 곱하면 둘레가 돼요." }) },
    { name: "약속하기", inst: "정다각형의 둘레를 구하는 식을 완성해 보세요.", hints: ["표에서 둘레가 어떻게 나왔는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["(정다각형의 둘레) = (", { o: ["한 변의 길이", "둘레", "넓이"], a: 0 }, ") × (", { o: ["변의 수", "대각선의 수", "한 변의 길이"], a: 0 }, ")"],
        { ok: "(정다각형의 둘레) = (한 변의 길이) × (변의 수)예요." }) },
    { name: "확인하기", inst: "정다각형의 둘레를 구해 보세요.", hints: ["정육각형의 변은 6개, 정팔각형의 변은 8개예요.", "(한 변의 길이) × (변의 수)로 계산해요."],
      render: (b, a) => ar6Ask(b, a, [{ fig: () => ar6RegFig([{ n: 6, side: 4, lab: "4 cm", name: "정육각형" }, { n: 8, side: 2, lab: "2 cm", name: "정팔각형", fill: AR6.f2 }]),
        parts: ["정육각형의 둘레: 4 × ", { n: 6, why: { "4": "정육각형의 변은 6개예요." } }, " = ", { n: 24, why: { "20": "정육각형의 변은 6개예요. 4×6을 계산해요.", "10": "변의 길이와 변의 수를 더하지 말고 곱해요." } }, " (cm)", h("br"), "정팔각형의 둘레: 2 × ", { n: 8 }, " = ", { n: 16, why: { "10": "변의 길이와 변의 수를 더하지 말고 곱해요." } }, " (cm)"] }],
        { ok: "정육각형의 둘레는 4×6=24 (cm), 정팔각형의 둘레는 2×8=16 (cm)예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 정다각형의 둘레를 구해 보세요.", hints: ["(정다각형의 둘레) = (한 변의 길이) × (변의 수)", "둘레를 알면 (한 변의 길이) = (둘레) ÷ (변의 수)예요."],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "한 변이 7 cm인 정오각형의 둘레를 구해요.", parts: ["7 + 7 + 7 + ", { n: 7 }, " + ", { n: 7 }, " = 7 × ", { n: 5 }, " = ", { n: 35 }, " (cm)"] },
        { q: "한 변이 20 cm인 정삼각형의 둘레는 몇 cm일까요?", parts: [{ n: 60, why: { "80": "정삼각형의 변은 3개예요." } }, " cm"] },
        { q: "둘레가 54 cm인 정육각형의 한 변의 길이는 몇 cm일까요?", parts: [{ n: 9, why: { "324": "둘레를 변의 수로 나누어야 해요. 54÷6을 계산해요." } }, " cm"] }], { ok: "35 cm, 60 cm, 9 cm예요." }),
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "둘레가 가장 짧은 정다각형은 무엇일까요?  ㉠ 한 변이 10 cm인 정팔각형  ㉡ 한 변이 19 cm인 정사각형  ㉢ 한 변이 12 cm인 정십각형", parts: [{ o: ["㉠", "㉡", "㉢"], a: 1, why: { "0": "㉠의 둘레는 10×8=80 (cm), ㉡의 둘레는 19×4=76 (cm)예요." } }] },
        { q: "한 변이 25 cm인 정구각형과 둘레가 같은 정오각형이 있어요.", parts: ["정구각형의 둘레: ", { n: 225 }, " cm, 정오각형의 한 변: ", { n: 45, why: { "25": "정오각형의 둘레가 225 cm이니까 225÷5를 계산해요." } }, " cm"] }], { ok: "㉠ 80 cm, ㉡ 76 cm, ㉢ 120 cm라서 ㉡이 가장 짧아요. 정구각형의 둘레는 225 cm, 정오각형의 한 변은 45 cm예요." })]) }
},
{
  id: "t3", no: 3, title: "사각형의 둘레를 구해 볼까요", soop: "개념 구축하기(O)",
  question: "직사각형, 평행사변형, 마름모의 둘레는 어떻게 구할 수 있을까요?",
  summary: "직사각형과 평행사변형은 마주 보는 두 변의 길이가 같아서 (직사각형의 둘레) = (가로+세로)×2, (평행사변형의 둘레) = (한 변의 길이+이웃한 변의 길이)×2로 구해요. 마름모는 네 변의 길이가 모두 같아서 (마름모의 둘레) = (한 변의 길이)×4예요.",
  steps: [
    { name: "만져 보기", inst: "태민이가 직사각형 모양의 정원을 만들었어요. 정원 설계도(가로 8 cm, 세로 5 cm)의 변을 하나씩 눌러 끈을 둘러 보세요. 가로의 길이를 가로, 세로의 길이를 세로라고 부르기도 해요.", hints: ["마주 보는 두 변의 길이가 같아요.", "가로와 세로를 각각 2배 해서 더하거나, 가로와 세로를 더한 후 2배 해요."],
      render: (b, a) => ar6Perim(b, a, { P: AR6_RECT(0, 0, 8, 5), labels: { 0: "8 cm", 1: "5 cm" }, ticks: [1, 2, 1, 2], name: "정원",
        ask: [{ parts: ["직사각형은 마주 보는 두 변의 길이가 ", { o: ["같아요", "달라요"], a: 0 }, "."] },
          { q: "두 가지 방법으로 둘레를 구해 보세요.", parts: ["방법 1: 8 × 2 + 5 × 2 = ", { n: 26 }, " (cm)", h("br"), "방법 2: (8 + 5) × 2 = ", { n: 26, why: { "13": "가로와 세로를 더한 13에 2를 곱해야 해요." } }, " (cm)"] }],
        ok: "직사각형의 둘레는 8×2+5×2=26 (cm), (8+5)×2=26 (cm)예요." }) },
    { name: "평행사변형", inst: "한 변이 6 cm, 이웃한 변이 4 cm인 평행사변형에 끈을 둘러 보세요.", hints: ["평행사변형도 마주 보는 두 변의 길이가 같아요.", "(한 변의 길이 + 이웃한 변의 길이) × 2"],
      render: (b, a) => ar6Perim(b, a, { P: [[0, Math.sqrt(12)], [6, Math.sqrt(12)], [8, 0], [2, 0]], labels: { 0: "6 cm", 1: "4 cm" }, ticks: [1, 2, 1, 2], fill: AR6.f1,
        ask: [{ parts: ["평행사변형은 마주 보는 두 변의 길이가 ", { o: ["같아요", "달라요"], a: 0 }, ". 둘레: (6 + 4) × 2 = ", { n: 20, why: { "10": "6과 4를 더한 10에 2를 곱해야 해요.", "24": "곱하지 말고 한 변의 길이와 이웃한 변의 길이를 더한 다음 2배 해요." } }, " (cm)"] }],
        ok: "평행사변형의 둘레는 (6+4)×2=20 (cm)예요." }) },
    { name: "마름모", inst: "한 변이 5 cm인 마름모에 끈을 둘러 보세요.", hints: ["마름모는 네 변의 길이가 모두 같아요.", "한 변의 길이를 4배 해요."],
      render: (b, a) => ar6Perim(b, a, { P: [[0, 3], [4, 0], [8, 3], [4, 6]], labels: { 0: "5 cm" }, ticks: [1, 1, 1, 1], fill: AR6.f4,
        ask: [{ parts: ["마름모는 네 변의 길이가 ", { o: ["모두 같아요", "모두 달라요"], a: 0 }, ". 둘레: 5 × ", { n: 4 }, " = ", { n: 20 }, " (cm)"] }],
        ok: "마름모의 둘레는 5×4=20 (cm)예요." }) },
    { name: "약속하기", inst: "사각형의 둘레를 구하는 식을 완성해 보세요.", hints: ["직사각형과 평행사변형은 마주 보는 두 변의 길이가 같아요.", "마름모는 네 변의 길이가 모두 같아요."],
      render: (b, a) => blanks(b, a, ["(직사각형의 둘레) = (가로) × 2 + (세로) × 2 = (가로 + ", { o: ["세로", "가로", "둘레"], a: 0 }, ") × ", { o: ["2", "4"], a: 0 }, " / (평행사변형의 둘레) = (한 변의 길이 + ", { o: ["이웃한 변의 길이", "높이"], a: 0 }, ") × 2 / (마름모의 둘레) = (한 변의 길이) × ", { o: ["4", "2"], a: 0 }],
        { ok: "직사각형 (가로+세로)×2, 평행사변형 (한 변+이웃한 변)×2, 마름모 (한 변)×4예요." }) },
    { name: "확인하기", inst: "모눈 한 칸은 1 cm예요. 파란 선분을 한 변으로 하여 둘레가 20 cm인 직사각형을 그리고, 사각형의 둘레 문제를 풀어 보세요.", hints: ["둘레가 20 cm이면 가로와 세로의 합은 20÷2=10 (cm)예요.", "파란 선분이 6 cm이니까 다른 변은 10−6=4 (cm)예요."],
      render: (b, a) => ar6Rect(b, a, { cols: 10, rows: 7, given: [2, 2, 6], tasks: [{ given: [2, 2, 6], perim: 20, label: "파란 선분을 한 변으로 하여 둘레가 20 cm인 직사각형을 완성해요." }],
        ask: [{ q: "평행사변형의 둘레(17 cm, 14 cm)", parts: ["(17 + ", { n: 14 }, ") × ", { n: 2 }, " = ", { n: 62 }, " (cm)"] },
          { q: "한 변이 26 cm인 마름모의 둘레", parts: [{ n: 104, why: { "52": "마름모는 네 변의 길이가 같아요. 26×4를 계산해요." } }, " cm"] },
          { q: "둘레가 58 cm인 직사각형의 한 변이 7 cm예요. 다른 한 변은?", parts: [{ n: 22, why: { "51": "둘레는 (가로+세로)×2예요. 58÷2=29에서 7을 빼요.", "44": "둘레는 (가로+세로)×2예요. 58÷2=29에서 7을 빼요." } }, " cm"] }],
        ok: "파란 선분 6 cm와 4 cm로 둘레 20 cm인 직사각형을 그렸어요. 62 cm, 104 cm, 22 cm예요." }) }
  ],
  challenge: { inst: "직사각형과 평행사변형 중 둘레가 더 짧은 것을 찾고, 마름모의 둘레를 구해 보세요.", hints: ["직사각형: (가로+세로)×2", "평행사변형: (한 변+이웃한 변)×2"],
    render: (b, a) => ar6Ask(b, a, [
      { fig: () => ar6Fig(560, 200, s => { const m1 = ar6Map(9, 20, 40), m2 = ar6Map(9, 260, 40); ar6Poly0(s, m1, AR6_RECT(0, 0, 18, 11), { fill: AR6.f3 }); ar6Lab(s, m1, [0, 0], [18, 0], "18 cm", { c: [9, 5] }); ar6Lab(s, m1, [18, 0], [18, 11], "11 cm", { c: [9, 5] });
          const Q = [[0, 8.66], [15, 8.66], [20, 0], [5, 0]]; ar6Poly0(s, m2, Q, { fill: AR6.f1 }); ar6Lab(s, m2, Q[0], Q[1], "15 cm", { c: [10, 4] }); ar6Lab(s, m2, Q[1], Q[2], "10 cm", { c: [10, 4] });
          s.append(txt(101, 160, "직사각형", 16, { fill: AR6.gray }), txt(350, 140, "평행사변형", 16, { fill: AR6.gray })); }, "30em"),
        parts: ["직사각형의 둘레: ", { n: 58 }, " cm, 평행사변형의 둘레: ", { n: 50 }, " cm → 둘레가 더 짧은 것은 ", { o: ["직사각형", "평행사변형"], a: 1 }] },
      { q: "한 변이 14 cm인 마름모의 둘레는?", parts: [{ n: 56 }, " cm"] }], { ok: "직사각형 (18+11)×2=58 (cm), 평행사변형 (15+10)×2=50 (cm)라서 평행사변형이 더 짧아요. 마름모의 둘레는 14×4=56 (cm)예요." }) }
},
{
  id: "t4", no: 4, title: "1 cm²를 알아볼까요", soop: "개념 구축하기(O)",
  question: "넓이를 정확하게 비교하고 나타내려면 어떤 단위를 사용하면 좋을까요?",
  summary: "직접 대어 보거나 여러 가지 모양을 단위로 사용하면 빈틈이 생기거나 단위에 따라 개수가 달라져 넓이를 정확히 비교하기 어려워요. 넓이의 단위로 한 변의 길이가 1 cm인 정사각형의 넓이를 사용할 수 있어요. 이 넓이를 1 cm²라 쓰고, 1 제곱센티미터라고 읽어요. 1 cm²가 4개이면 4 cm²예요.",
  steps: [
    { name: "대어 보기", inst: "태민이가 벽을 만드는 데 더 넓은 벽돌을 사용하려고 해요. 벽돌 나를 끌어 벽돌 가 위에 모서리를 맞추어 겹쳐 보세요.", hints: ["벽돌 나를 끌어서 벽돌 가의 왼쪽 위나 왼쪽 아래 모서리에 맞추어요.", "겹치고 남는 부분을 살펴봐요."],
      render: (b, a) => ar6Cut(b, a, { cols: 12, rows: 6, k: 36, pieces: [
          { P: AR6_RECT(1, 2, 5, 2), fill: "#F3DCC8", stroke: "#9A6B3E", name: "가" },
          { P: AR6_RECT(8, 1, 3, 3), fill: "#BFD9F5", stroke: AR6.blue, move: true, name: "나", op: .6, target: [{ dx: -7, dy: 1 }, { dx: -7, dy: 0 }] }],
        msg: "벽돌 나를 가 위에 겹쳤어요.",
        ask: [{ parts: ["직접 대어 보니 가와 나는 ", { o: ["서로 남거나 모자라는 부분이 있어서", "꼭 맞게 겹쳐져서"], a: 0 }, " 어느 벽돌이 얼마나 더 넓은지 ", { o: ["알기 어려워요", "바로 알 수 있어요"], a: 0 }, "."] }],
        ok: "가는 오른쪽이 남고 나는 아래(위)쪽이 남아서, 직접 대어 보는 것만으로는 비교하기 어려워요." }) },
    { name: "단위로 재기", inst: "여러 가지 모양을 단위로 사용하여 벽돌 가와 나의 넓이를 비교해 보세요. (단위 모양은 이 자료에서 다시 그렸어요.)", hints: ["단위 모양을 고르고 벽돌 위를 눌러 겹치지 않게 놓아요.", "더 놓을 자리가 없을 때까지 채워요."],
      render: (b, a) => ar6Tile(b, a, {
        ask: [{ parts: ["○ 원: 가 ", { n: 10 }, "개, 나 ", { n: 9 }, "개 — 원 사이에 ", { o: ["빈틈이 생겨요", "빈틈이 없어요"], a: 0 }, "."] },
          { parts: ["▭ 직사각형: 가 ", { n: 5 }, "개, 나 ", { n: 4 }, "개 — 나에는 ", { o: ["채우지 못한 곳이 남아요", "꼭 맞게 채워져요"], a: 0 }, "."] },
          { parts: ["□ 정사각형: 가 ", { n: 10 }, "개, 나 ", { n: 9 }, "개 → 더 넓은 벽돌은 ", { o: ["가", "나"], a: 0 }, "예요."] }],
        ok: "원은 빈틈이 생기고, 직사각형은 남는 곳이 생겨요. 정사각형으로 재면 가 10개, 나 9개라서 가가 더 넓어요." }) },
    { name: "말해 보기", inst: "여러 가지 단위로 재어 보고 알게 된 점을 이야기해 보세요.", hints: ["같은 벽돌 가를 재었는데 단위에 따라 개수가 달랐어요.", "겹치지 않고 빈틈없이 이어 붙일 수 있는 모양이 좋아요."],
      render: (b, a) => quiz(b, a, [
        { q: "같은 벽돌 가를 재었는데 직사각형 단위로는 5개, 정사각형 단위로는 10개였어요. 까닭은 무엇일까요?", o: ["단위의 모양과 크기가 달라서", "벽돌 가의 넓이가 바뀌어서"], a: 0 },
        { q: "넓이를 재는 단위로 가장 알맞은 모양은 무엇일까요?", o: ["원", "직사각형(▭)", "정사각형"], a: 2, why: { "0": "원은 빈틈없이 이어 붙일 수 없어요.", "1": "벽돌 나처럼 채우지 못하고 남는 곳이 생길 수 있어요. 가로와 세로가 같은 모양을 떠올려요." } }],
        { ok: "단위에 따라 개수가 달라지므로 모두가 같은 단위를 써야 해요. 정사각형은 겹치지 않고 빈틈없이 이어 붙일 수 있어서 넓이의 단위로 알맞아요." }) },
    { name: "약속하기", inst: "넓이의 단위를 약속해 보세요.", hints: ["한 변이 1 cm인 정사각형이에요.", "cm 오른쪽 위에 작은 2를 써요."],
      render: (b, a) => ar6Ask(b, a, [{ fig: () => ar6Static({ cols: 3, rows: 3, k: 50, shapes: [{ P: AR6_RECT(1, 1, 1, 1), fill: "#9CC3F0", name: "1 cm²", size: 13 }], labs: [{ a: [1, 1], b: [2, 1], t: "1 cm" }, { a: [2, 1], b: [2, 2], t: "1 cm" }], maxW: "10em" }),
        parts: ["넓이의 단위로 한 변의 길이가 ", { o: ["1 cm", "1 m", "10 cm"], a: 0 }, "인 정사각형의 넓이를 사용할 수 있어요. 이 넓이를 ", { o: ["1 cm²", "1 cm", "1 m²"], a: 0 }, "라 쓰고, ", { o: ["1 제곱센티미터", "1 센티미터", "1 제곱미터"], a: 0 }, "라고 읽어요."] }],
        { ok: "한 변의 길이가 1 cm인 정사각형의 넓이를 1 cm²라 쓰고, 1 제곱센티미터라고 읽어요." }) },
    { name: "확인하기", inst: "1 cm²의 개수를 세어 도형의 넓이를 구해 보세요. 칸을 하나씩 눌러 세어요.", hints: ["한 칸이 1 cm²예요.", "1 cm²가 ■개이면 1 cm²의 ■배이고, ■ cm²예요."],
      render: (b, a) => ar6Count(b, a, { cols: 5, rows: 4, cells: AR6_T4, maxW: "18em",
        ask: [{ parts: ["1 cm²가 ", { n: 4 }, "개 → 1 cm²의 ", { n: 4 }, "배 → 넓이는 ", { n: 4 }, " cm²"] }],
        ok: "1 cm²가 4개이므로 1 cm²의 4배, 넓이는 4 cm²예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 넓이를 구하고 비교해 보세요.", hints: ["칸의 수가 곧 넓이(cm²)예요.", "서로 다른 모양: 돌리거나 뒤집어서 같아지면 같은 모양이에요."],
    render: (b, a) => ar6Chain(b, a, [
      { title: "① 칸을 눌러 세어 도형의 넓이를 구해요.", run: (bx, ax) => ar6Count(bx, ax, { cols: 7, rows: 6, cells: AR6_C15, maxW: "22em", ask: [{ parts: ["넓이: ", { n: 15 }, " cm²"] }], ok: "1 cm²가 15개이므로 15 cm²예요." }) },
      { title: "② 넓이를 비교해요.", run: (bx, ax) => ar6Ask(bx, ax, [
        { fig: () => ar6Static({ cols: 14, rows: 5, k: 26, shapes: [...ar6Cells(AR6_CMP.ga, AR6.f1), ...ar6Cells(AR6_CMP.na, AR6.f2), ...ar6Cells(AR6_CMP.da, AR6.f3)], texts: [{ p: [2.5, 4.5], t: "가" }, { p: [7.5, 4.5], t: "나" }, { p: [12, 4.5], t: "다" }], maxW: "30em" }),
          parts: ["가 ", { n: 7 }, " cm², 나 ", { n: 9 }, " cm², 다 ", { n: 6 }, " cm² → 넓이가 좁은 것부터: ", { o: ["다, 가, 나", "가, 다, 나", "나, 가, 다"], a: 0 }] },
        { q: "6 cm²를 바르게 읽은 것은?", parts: [{ o: ["6 제곱센티미터", "6 센티미터 제곱", "6 센티미터"], a: 0 }] }], { ok: "다 6 cm², 가 7 cm², 나 9 cm²예요." }) },
      { title: "③ 넓이가 8 cm²인 도형을 서로 다른 모양으로 2개 그려요.", run: (bx, ax) => ar6Paint(bx, ax, { cols: 8, rows: 5, differ: true, tasks: [{ area: 8 }, { area: 8 }], ok: "넓이가 같아도 모양은 여러 가지일 수 있어요." }) }]) }
},
{
  id: "t5", no: 5, title: "직사각형의 넓이를 구해 볼까요", soop: "개념 구축하기(O)",
  question: "직사각형과 정사각형의 넓이는 어떻게 구할 수 있을까요?",
  summary: "직사각형에서 1 cm²가 가로 한 줄에 (가로)개씩 (세로)줄 있으므로 (직사각형의 넓이) = (가로) × (세로)예요. 정사각형은 가로와 세로가 같으므로 (정사각형의 넓이) = (한 변의 길이) × (한 변의 길이)예요.",
  steps: [
    { name: "만져 보기", inst: "태민이가 직사각형 모양의 문패를 만들었어요. 문패 설계도에서 1 cm²의 개수를 세어 넓이를 구해 보세요. 칸을 하나씩 눌러요.", hints: ["한 칸이 1 cm²예요.", "1 cm²가 ■개이면 ■ cm²예요."],
      render: (b, a) => ar6Count(b, a, { cols: 6, rows: 5, cells: [[1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [2, 2], [3, 2], [4, 2], [1, 3], [2, 3], [3, 3], [4, 3]], maxW: "20em",
        ask: [{ parts: ["1 cm²가 ", { n: 12 }, "개 → 1 cm²의 ", { n: 12 }, "배 → 넓이는 ", { n: 12 }, " cm²"] }], ok: "문패의 넓이는 12 cm²예요." }) },
    { name: "줄로 세기", inst: "이번에는 한 줄씩 눌러 세어 보세요. 1 cm²가 가로 한 줄에 몇 개씩 몇 줄인지 알아봐요.", hints: ["한 칸을 누르면 그 줄 전체가 칠해져요.", "가로 4 cm이면 한 줄에 4개, 세로 3 cm이면 3줄이에요."],
      render: (b, a) => ar6Count(b, a, { cols: 6, rows: 5, byRow: true, cells: [[1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [2, 2], [3, 2], [4, 2], [1, 3], [2, 3], [3, 3], [4, 3]], maxW: "20em",
        ask: [{ parts: ["가로 4 cm, 세로 3 cm인 직사각형에서 1 cm²가 가로 한 줄에 ", { n: 4 }, "개씩 ", { n: 3 }, "줄 → 4 × 3 = ", { n: 12 }, " (개) → 넓이는 ", { n: 12 }, " cm²"] }], ok: "4개씩 3줄이므로 4×3=12, 넓이는 12 cm²예요." }) },
    { name: "말해 보기", inst: "직사각형의 넓이를 구하는 방법을 말해 보세요.", hints: ["한 줄의 개수와 가로의 길이를 비교해요.", "줄의 수와 세로의 길이를 비교해요."],
      render: (b, a) => blanks(b, a, ["한 줄에 놓인 1 cm²의 수는 ", { o: ["가로의 길이", "세로의 길이"], a: 0 }, "와 같고, 줄의 수는 ", { o: ["세로의 길이", "가로의 길이"], a: 0 }, "와 같아요. 그래서 직사각형의 넓이는 가로와 세로를 ", { o: ["곱하여", "더하여"], a: 0 }, " 구할 수 있어요."],
        { ok: "1 cm²가 가로의 수만큼씩 세로의 수만큼 줄이 있으니 가로와 세로를 곱해요." }) },
    { name: "약속하기", inst: "직사각형과 정사각형의 넓이를 구하는 식을 완성해 보세요.", hints: ["정사각형은 네 변의 길이가 모두 같아요."],
      render: (b, a) => blanks(b, a, ["(직사각형의 넓이) = (가로) × (", { o: ["세로", "가로", "둘레"], a: 0 }, ")", " / 정사각형은 네 변의 길이가 ", { o: ["모두 같으므로", "모두 다르므로"], a: 0 }, " (정사각형의 넓이) = (한 변의 길이) × (", { o: ["한 변의 길이", "변의 수"], a: 0 }, ")"],
        { ok: "(직사각형의 넓이) = (가로) × (세로), (정사각형의 넓이) = (한 변의 길이) × (한 변의 길이)예요." }) },
    { name: "확인하기", inst: "모눈 한 칸은 1 cm예요. 주어진 직사각형과 정사각형을 그려 보고 넓이를 구해 보세요.", hints: ["점에서 점까지 끌어 그려요. 가로는 옆으로, 세로는 위아래로 재어요.", "(가로) × (세로)로 계산해요."],
      render: (b, a) => ar6Rect(b, a, { cols: 10, rows: 9, k: 30, tasks: [{ w: 4, h: 7, label: "가: 가로 4 cm, 세로 7 cm인 직사각형을 그려요." }, { w: 8, h: 8, label: "나: 한 변이 8 cm인 정사각형을 그려요." }],
        ask: [{ parts: ["가의 넓이: 4 × 7 = ", { n: 28, why: { "22": "둘레가 아니라 넓이예요. 가로와 세로를 곱해요.", "11": "넓이는 가로와 세로를 더하지 않고 곱해요." } }, " (cm²)", h("br"), "나의 넓이: 8 × 8 = ", { n: 64, why: { "32": "8×4는 둘레예요. 넓이는 8×8이에요.", "16": "넓이는 한 변의 길이끼리 곱해요." } }, " (cm²)"] }],
        ok: "가는 4×7=28 (cm²), 나는 8×8=64 (cm²)예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 직사각형과 정사각형의 넓이를 구해 보세요.", hints: ["(직사각형의 넓이) = (가로) × (세로)", "넓이를 알면 (세로) = (넓이) ÷ (가로)예요."],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "한 변이 10 cm인 정사각형의 넓이", parts: ["10 × ", { n: 10 }, " = ", { n: 100 }, " (cm²)"] },
        { q: "가로 21 cm, 세로 5 cm인 직사각형의 넓이", parts: [{ n: 105, why: { "52": "둘레가 아니라 넓이예요. 21×5를 계산해요." } }, " cm²"] },
        { q: "가: 한 변이 12 cm인 정사각형, 나: 가로 17 cm, 세로 9 cm인 직사각형 — 더 넓은 것은?", parts: ["가 ", { n: 144 }, " cm², 나 ", { n: 153 }, " cm² → ", { o: ["가", "나"], a: 1 }] }], { ok: "100 cm², 105 cm², 그리고 나(153 cm²)가 가(144 cm²)보다 넓어요." }),
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "넓이가 400 cm²인 직사각형의 가로가 16 cm예요. 세로는?", parts: [{ n: 25, why: { "384": "넓이에서 빼지 말고 나누어요. 400÷16을 계산해요." } }, " cm"] },
        { q: "한 변이 11 cm인 정사각형의 네 변을 3 cm씩 늘이면 넓이는?", parts: ["한 변 ", { n: 14 }, " cm → 넓이 ", { n: 196, why: { "121": "늘인 한 변 14 cm로 계산해요." } }, " cm²"] },
        { q: "둘레가 70 cm, 세로가 22 cm인 직사각형", parts: ["가로 ", { n: 13, why: { "48": "둘레의 반 35 cm에서 22 cm를 빼요.", "26": "둘레의 반은 70÷2=35 (cm)예요. 35에서 22를 빼요." } }, " cm, 넓이 ", { n: 286 }, " cm²"] }], { ok: "세로 25 cm, 넓이 196 cm², 가로 13 cm·넓이 286 cm²예요." })]) }
},
{
  id: "t67", no: "6~7", title: "1 cm²보다 더 큰 넓이의 단위를 알아볼까요", soop: "개념 구축하기(O)",
  question: "넓은 장소나 지역의 넓이는 어떤 단위로 나타내면 좋을까요?",
  summary: "한 변의 길이가 1 m인 정사각형의 넓이를 1 m²(1 제곱미터)라고 해요. 1 m²에는 1 cm²가 가로 한 줄에 100개씩 100줄 있으므로 1 m² = 10000 cm²예요. 한 변의 길이가 1 km인 정사각형의 넓이를 1 km²(1 제곱킬로미터)라고 해요. 1 km²에는 1 m²가 1000개씩 1000줄 있으므로 1 km² = 1000000 m²예요.",
  steps: [
    { name: "거실 바닥 재기", inst: "태민이가 직사각형 모양의 거실 바닥을 만들었어요. 거실 바닥은 가로 800 cm, 세로 500 cm예요. 넓이를 cm²로 나타내고, 알맞은 단위를 생각해 보세요.", hints: ["(직사각형의 넓이) = (가로) × (세로)", "8×5=40이고, 800×500은 40 뒤에 0을 4개 붙여요."],
      render: (b, a) => ar6Ask(b, a, [
        { fig: () => ar6Static({ cols: 8, rows: 5, k: 34, grid: false, shapes: [{ P: AR6_RECT(0, 0, 8, 5), fill: "#F6E1B8", stroke: "#B08A1E", name: "거실 바닥" }], labs: [{ a: [0, 0], b: [8, 0], t: "800 cm" }, { a: [8, 0], b: [8, 5], t: "500 cm" }], maxW: "22em" }),
          parts: ["거실 바닥의 넓이: 800 × 500 = ", { n: 400000, why: { "40000": "0의 개수를 다시 세어 봐요. 8×5=40 뒤에 0을 4개 붙여요.", "4000000": "0의 개수를 다시 세어 봐요. 8×5=40 뒤에 0을 4개 붙여요.", "2600": "둘레가 아니라 넓이예요." } }, " cm²"] },
        { parts: ["넓은 곳의 넓이를 cm²로 나타내면 수가 너무 커서 쓰거나 읽기 ", { o: ["불편해요", "편리해요"], a: 0 }, ". 1 cm보다 큰 길이 단위 1 m가 있으니, 한 변의 길이가 1 m인 정사각형의 넓이를 ", { o: ["1 m²", "1 cm²", "1 km²"], a: 0 }, "라 쓰고, ", { o: ["1 제곱미터", "1 미터", "1 제곱센티미터"], a: 0 }, "라고 읽어요."] }],
        { ok: "거실 바닥의 넓이는 400000 cm²예요. 이렇게 넓은 곳은 1 m²(1 제곱미터)를 쓰면 편리해요." }) },
    { name: "1 m²와 1 cm²", inst: "1 m²는 몇 cm²일까요? 한 변이 1 m(=100 cm)인 정사각형을 1 cm²로 채워 보세요.", hints: ["1 m = 100 cm이니까 가로 한 줄에 1 cm²가 100개 들어가요.", "1 m² = 100 cm²가 아니에요. 100개씩 100줄이에요."],
      render: (b, a) => ar6Big(b, a, { n: 100, side: "1 m = 100 cm", big: "1 m²", small: "1 cm²",
        ask: [{ parts: ["1 cm²가 가로 한 줄에 ", { n: 100 }, "개씩 ", { n: 100 }, "줄 → 100 × 100 = ", { n: 10000, why: { "100": "가로 한 줄만 센 거예요. 100개씩 100줄이에요.", "1000": "100×100을 다시 계산해 봐요." } }, " (개) → 1 m² = ", { n: 10000, why: { "100": "1 m = 100 cm라고 1 m² = 100 cm²는 아니에요." } }, " cm²"] }],
        ok: "1 m² = 10000 cm²예요. 1 m = 100 cm라서 가로 100개씩 세로 100줄이 들어가요." }) },
    { name: "교실 바닥 재기", inst: "넓이가 1 m²인 정사각형 모양의 종이를 교실 바닥에 늘어놓았어요. 이 교실은 종이가 가로로 7장, 세로로 9장 들어가요. 한 줄씩 눌러 세어 보세요.", hints: ["한 칸이 1 m² 종이 한 장이에요.", "한 줄에 몇 장씩 몇 줄인지 곱해요."],
      render: (b, a) => ar6Count(b, a, { cols: 7, rows: 9, k: 28, byRow: true, small: "1 m² 종이", cells: Array.from({ length: 63 }, (_, i) => [i % 7, Math.floor(i / 7)]), maxW: "16em",
        ask: [{ parts: ["1 m² 종이가 한 줄에 ", { n: 7 }, "장씩 ", { n: 9 }, "줄 → 교실 바닥의 넓이는 7 × 9 = ", { n: 63, why: { "16": "넓이는 더하지 않고 곱해요.", "32": "둘레가 아니라 넓이예요." } }, " m²"] }],
        ok: "교실 바닥의 넓이는 약 63 m²예요. 여러분 교실은 몇 장이 들어갈지 직접 재어 봐요." }) },
    { name: "1 km²", inst: "지역의 넓이를 나타내는 단위를 알아보세요. (서울특별시와 세종특별자치시의 넓이, 공공데이터포털 2024)", hints: ["605000000은 6억 500만이에요.", "1 km = 1000 m이니까 1 km²에는 1 m²가 1000개씩 1000줄 들어가요."],
      render: (b, a) => ar6Chain(b, a, [
        (bx, ax) => ar6Ask(bx, ax, [
          { q: "서울특별시의 넓이는 605000000 m²예요. 바르게 읽은 것은?", parts: [{ o: ["육억 오백만 제곱미터", "육천오백만 제곱미터", "육억 오천만 제곱미터"], a: 0 }] },
          { q: "세종특별자치시의 넓이는 465000000 m²예요. 바르게 읽은 것은?", parts: [{ o: ["사천육백오십만 제곱미터", "사억 육천오백만 제곱미터", "사억 육백오십만 제곱미터"], a: 1 }] },
          { parts: ["수가 너무 커서 불편하니, 한 변의 길이가 1 km인 정사각형의 넓이를 ", { o: ["1 km²", "1 m²", "1 km"], a: 0 }, "라 쓰고, ", { o: ["1 제곱킬로미터", "1 킬로미터", "1 제곱미터"], a: 0 }, "라고 읽어요."] }], { ok: "한 변의 길이가 1 km인 정사각형의 넓이를 1 km²라 쓰고, 1 제곱킬로미터라고 읽어요." }),
        { title: "1 km²는 몇 m²일까요? 1 m²로 채워 보세요.", run: (bx, ax) => ar6Big(bx, ax, { n: 1000, side: "1 km = 1000 m", big: "1 km²", small: "1 m²",
          ask: [{ parts: ["1 m²가 가로 한 줄에 ", { n: 1000 }, "개씩 ", { n: 1000 }, "줄 → 1 km² = ", { n: 1000000, why: { "1000": "1 km = 1000 m라고 1 km² = 1000 m²는 아니에요. 1000개씩 1000줄이에요.", "100000": "1000×1000을 다시 계산해 봐요. 0이 6개예요." } }, " m²"] }],
          ok: "1 km² = 1000000 m²예요." }) }]) },
    { name: "확인하기", inst: "넓이를 여러 가지 단위로 나타내고, 알맞은 단위를 골라 보세요.", hints: ["1 m² = 10000 cm², 1 km² = 1000000 m²", "공책·수첩은 cm², 교실·운동장은 m², 도시·국립 공원은 km²가 알맞아요."],
      render: (b, a) => ar6Ask(b, a, [
        { parts: ["칠판의 넓이 30000 cm² = ", { n: 3, why: { "300": "10000 cm²가 1 m²예요. 30000÷10000을 계산해요." } }, " m²", h("br"), "호수의 넓이 약 12 km² = 약 ", { n: 12000000, why: { "12000": "1 km² = 1000000 m²예요." } }, " m²"] },
        { q: "알맞은 단위를 골라요.", parts: ["우리 학교 운동장의 넓이는 약 1750 ", { o: ["cm²", "m²", "km²"], a: 1 }, ", 수첩의 넓이는 96 ", { o: ["cm²", "m²", "km²"], a: 0 }, ", 덕유산 국립 공원의 넓이는 약 232 ", { o: ["cm²", "m²", "km²"], a: 2 }, "예요."] }],
        { ok: "칠판 3 m², 호수 약 12000000 m²예요. 운동장은 m², 수첩은 cm², 국립 공원은 km²가 알맞아요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 넓이의 단위 사이의 관계를 이용해 보세요.", hints: ["1 m² = 10000 cm²", "1 km² = 1000000 m², 1 km = 1000 m"],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { parts: ["5 m² = ", { n: 50000 }, " cm² · 70000 cm² = ", { n: 7 }, " m²", h("br"), "9 km² = ", { n: 9000000 }, " m² · 2000000 m² = ", { n: 2 }, " km²"] },
        { q: "크기를 비교해요.", parts: ["58000000 m² ", { o: [">", "=", "<"], a: 2 }, " 60 km²", h("br"), "104 m² ", { o: [">", "=", "<"], a: 0 }, " 1000000 cm²"] }], { ok: "60 km² = 60000000 m², 1000000 cm² = 100 m²예요." }),
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "가로 7000 m, 세로 5 km인 직사각형 모양 땅의 넓이는?", parts: [{ n: 35 }, " km²"] },
        { q: "가로 300 cm, 세로 2 m인 직사각형 모양 전시대의 넓이는?", parts: [{ n: 6, why: { "600": "단위를 m로 맞추어요. 300 cm = 3 m예요." } }, " m²"] },
        { q: "단위를 잘못 사용한 것은?  ㉠ 도서관 휴게실의 넓이는 38 m²  ㉡ 학교 운동장의 넓이는 420 cm²  ㉢ 제주특별자치도의 넓이는 약 1850 km²", parts: [{ o: ["㉠", "㉡", "㉢"], a: 1 }, " → 바르게 고치면 ", { o: ["420 m²", "420 km²"], a: 0 }] }], { ok: "35 km², 6 m², 그리고 학교 운동장의 넓이는 420 m²라고 고쳐야 해요." })]) }
},
{
  id: "t89", no: "8~9", title: "평행사변형의 넓이를 구해 볼까요", soop: "개념 구축하기(O)",
  question: "평행사변형의 넓이는 어떻게 구할 수 있을까요?",
  summary: "평행사변형에서 평행한 두 변을 밑변, 두 밑변 사이의 거리를 높이라고 해요. 평행사변형을 높이를 따라 잘라 이어 붙이면 직사각형이 되고, 직사각형의 가로는 평행사변형의 밑변의 길이, 세로는 높이와 같아요. 그래서 (평행사변형의 넓이) = (밑변의 길이) × (높이)예요. 밑변의 길이와 높이가 각각 같으면 모양이 달라도 넓이가 같아요.",
  steps: [
    { name: "밑변과 높이", inst: "태민이가 화장실에 평행사변형 모양의 타일을 붙이려고 해요. 파란 변을 밑변으로 하여, 마주 보는 변까지 수직인 선분(높이)을 끌어서 그어 보세요.", hints: ["삼각자의 직각을 낀 한 변을 밑변에 맞추고 다른 변을 따라 긋는다고 생각해요.", "위쪽 변의 한 점에서 아래쪽 파란 변까지 곧게 내려 그어요."],
      render: (b, a) => ar6Height(b, a, { tasks: [{ P: [[1, 4], [6, 4], [8, 1], [3, 1]], base: [0, 1], top: "s", at: [2, 3], cols: 9, rows: 5 }],
        ask: [{ q: "약속하기", parts: ["평행사변형에서 평행한 두 변을 ", { o: ["밑변", "높이", "대각선"], a: 0 }, "이라 하고, 두 밑변 사이의 거리를 ", { o: ["높이", "둘레", "밑변"], a: 0 }, "라고 합니다. 이 평행사변형의 높이는 ", { n: 3 }, " cm예요."] }],
        ok: "평행한 두 변이 밑변, 두 밑변 사이의 거리가 높이예요. 높이는 3 cm예요." }) },
    { name: "높이 긋기", inst: "평행사변형 가, 나, 다에서 파란 변을 밑변으로 할 때의 높이를 그어 보세요. 다는 밑변을 늘인 점선까지 그어도 돼요.", hints: ["밑변이 꼭 아래에 있는 변은 아니에요. 밑변은 기준이 되는 변이에요.", "나는 밑변이 세로로 놓여 있어서 높이를 가로로 그어요.", "다는 위쪽 변 아래에 밑변이 없으니 밑변을 늘인 점선까지 그어요."],
      render: (b, a) => ar6Height(b, a, { tasks: [
          { P: [[1, 4], [5, 4], [6, 1], [2, 1]], base: [2, 3], top: "s", at: [0, 1], cols: 7, rows: 5, name: "가" },
          { P: [[1, 1], [1, 4], [5, 5], [5, 2]], base: [0, 1], top: "s", at: [2, 3], cols: 6, rows: 6, name: "나" },
          { P: [[1, 4], [4, 4], [8, 1], [5, 1]], base: [0, 1], top: "s", at: [2, 3], cols: 9, rows: 5, ext: true, name: "다" }],
        ask: [{ parts: ["높이: 가 ", { n: 3 }, " cm, 나 ", { n: 4 }, " cm, 다 ", { n: 3 }, " cm"] },
          { parts: ["다처럼 높이는 평행사변형의 ", { o: ["바깥에 그을 수도 있어요", "안쪽에만 그을 수 있어요"], a: 0 }, ". 평행한 두 변 사이의 거리는 어디에서 재어도 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
        ok: "밑변은 기준이 되는 변이고, 높이는 밑변과 마주 보는 변 사이에 수직으로 그은 선분이에요. 바깥에 그어도 길이는 같아요." }) },
    { name: "세어 보기", inst: "모눈 위 평행사변형(밑변 5 cm, 높이 3 cm)의 넓이를 1 cm²의 개수를 세어 구해 보세요. 온전한 칸과 반 칸을 모두 눌러 세어요.", hints: ["반 칸(직각삼각형 모양) 2개를 모으면 1 cm²가 돼요.", "온전한 칸은 한 줄에 4개씩 3줄이에요."],
      render: (b, a) => ar6Count(b, a, { cols: 10, rows: 5, P: AR6_PAR, maxW: "26em",
        ask: [{ parts: ["1 cm² ", { n: 12 }, "개, 반 칸 ", { n: 6 }, "개 → 반 칸 6개는 1 cm² ", { n: 3, why: { "6": "반 칸 2개가 1 cm²예요." } }, "개와 같아요 → 넓이는 12 + 3 = ", { n: 15, why: { "18": "반 칸 6개는 1 cm² 3개와 같아요." } }, " cm²"] },
          { parts: ["이렇게 하나씩 세는 방법은 ", { o: ["시간이 오래 걸리고 반 칸을 모으기 불편해요", "언제나 가장 빨라요"], a: 0 }, "."] }],
        ok: "1 cm² 12개와 반 칸 6개(=1 cm² 3개)로 15 cm²예요. 더 편한 방법을 찾아봐요." }) },
    { name: "약속하기", inst: "같은 평행사변형을 빨간 높이를 따라 잘랐어요. 왼쪽 조각을 끌어 오른쪽에 붙여 직사각형을 만들어 보세요.", hints: ["왼쪽 삼각형 조각을 오른쪽 끝으로 옮겨요.", "만든 직사각형의 가로와 세로를 평행사변형과 비교해요."],
      render: (b, a) => ar6Cut(b, a, { cols: 11, rows: 5, pieces: [
          { P: [[4, 1], [9, 1], [6, 4], [4, 4]], fill: AR6.f1 },
          { P: [[1, 4], [4, 4], [4, 1]], fill: AR6.f2, move: true, target: { dx: 5, dy: 0 } }],
        marks: (g, m) => { ar6Seg(g, m, [4, 1], [4, 4], { color: AR6.red, w: 3, dash: "6 4" }); ar6Lab(g, m, [1, 4], [6, 4], "밑변 5 cm", { flip: false, c: [5, 2], color: AR6.blue }); },
        after: (g, m) => { ar6Poly0(g, m, AR6_RECT(4, 1, 5, 3), { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [4, 4], [9, 4], "가로 5 cm", { c: [6.5, 2.5] }); ar6Lab(g, m, [9, 1], [9, 4], "세로 3 cm", { c: [6.5, 2.5] }); },
        ask: [{ parts: ["만든 직사각형의 가로는 평행사변형의 ", { o: ["밑변의 길이", "높이", "이웃한 변의 길이"], a: 0 }, "와 같고, 세로는 평행사변형의 ", { o: ["높이", "밑변의 길이", "둘레"], a: 0 }, "와 같아요."] },
          { q: "약속하기", parts: ["(평행사변형의 넓이) = (", { o: ["밑변의 길이", "이웃한 변의 길이"], a: 0 }, ") × (", { o: ["높이", "밑변의 길이"], a: 0 }, ") → 5 × 3 = ", { n: 15 }, " (cm²)"] }],
        ok: "(평행사변형의 넓이) = (밑변의 길이) × (높이)예요. 세어서 구한 15 cm²와 같아요." }) },
    { name: "확인하기", inst: "평행사변형의 넓이를 구하는 방법을 이용하여 문제를 해결해 보세요.", hints: ["(평행사변형의 넓이) = (밑변의 길이) × (높이)", "높이 = 넓이 ÷ 밑변, 밑변 = 넓이 ÷ 높이"],
      render: (b, a) => ar6Chain(b, a, [
        (bx, ax) => ar6Ask(bx, ax, [
          { parts: ["밑변 4 cm, 높이 7 cm → ", { n: 28 }, " cm²", h("br"), "밑변 5 m, 높이 6 m → ", { n: 30 }, " m²"] },
          { parts: ["밑변 6 cm, 넓이 24 cm² → 6 × □ = 24 → 높이 ", { n: 4 }, " cm", h("br"), "높이 3 m, 넓이 18 m² → □ × 3 = 18 → 밑변 ", { n: 6 }, " m"] }], { ok: "28 cm², 30 m², 높이 4 cm, 밑변 6 m예요." }),
        (bx, ax) => ar6Ask(bx, ax, [{ q: "평행선 사이에 있는 평행사변형 가, 나, 다의 넓이를 비교해 보세요.",
          fig: () => ar6Static({ cols: 19, rows: 7, k: 24, shapes: [{ P: [[1, 6], [4, 6], [5, 1], [2, 1]], fill: AR6.f1, name: "가" }, { P: [[6, 6], [9, 6], [13, 1], [10, 1]], fill: AR6.f2, name: "나" }, { P: [[15, 6], [18, 6], [17, 1], [14, 1]], fill: AR6.f3, name: "다" }],
            segs: [{ a: [0, 1], b: [19, 1], color: AR6.gray, w: 1.5, dash: "6 5" }, { a: [0, 6], b: [19, 6], color: AR6.gray, w: 1.5, dash: "6 5" }, { a: [2, 1], b: [2, 6], color: AR6.red, w: 2.5 }, { a: [10, 1], b: [10, 6], color: AR6.red, w: 2.5 }, { a: [15, 1], b: [15, 6], color: AR6.red, w: 2.5 }],
            labs: [{ a: [1, 6], b: [4, 6], t: "3 cm", c: [2.5, 3] }, { a: [6, 6], b: [9, 6], t: "3 cm", c: [7.5, 3] }, { a: [15, 6], b: [18, 6], t: "3 cm", c: [16.5, 3] }],
            texts: [{ p: [.9, 3.5], t: "5 cm", size: 14, color: AR6.red }], maxW: "36em" }),
          parts: ["가 ", { n: 15 }, " cm², 나 ", { n: 15 }, " cm², 다 ", { n: 15 }, " cm² → 밑변의 길이와 높이가 각각 같으면 넓이도 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
          { ok: "가, 나, 다 모두 3×5=15 (cm²)예요. 밑변의 길이와 높이가 각각 같으면 모양이 달라도 넓이가 같아요." })]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 평행사변형의 넓이를 구하고, 넓이가 10 cm²인 평행사변형을 그려 보세요.", hints: ["(평행사변형의 넓이) = (밑변의 길이) × (높이)", "넓이 10 cm²: 밑변 5 cm·높이 2 cm, 밑변 2 cm·높이 5 cm, 밑변 10 cm·높이 1 cm …"],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "평행사변형을 잘라 만든 직사각형의 가로가 5 cm, 세로가 7 cm예요.", parts: ["평행사변형의 넓이: 5 × 7 = ", { n: 35 }, " (cm²)"] },
        { q: "밑변 18 cm, 높이 12 cm인 평행사변형", parts: [{ n: 216 }, " cm²"] },
        { q: "더 좁은 것은?  ㉠ 밑변 10 m, 높이 14 m  ㉡ 밑변 6 m, 높이 22 m", parts: ["㉠ ", { n: 140 }, " m², ㉡ ", { n: 132 }, " m² → ", { o: ["㉠", "㉡"], a: 1 }] },
        { q: "넓이가 165 cm², 밑변이 15 cm인 평행사변형의 높이는?", parts: [{ n: 11 }, " cm"] }], { ok: "35 cm², 216 cm², ㉡이 더 좁고, 높이는 11 cm예요." }),
      { title: "모눈 한 칸은 1 cm예요. 점을 이어 넓이가 10 cm²인 평행사변형을 서로 다른 모양으로 2개 그려요.", run: (bx, ax) => ar6Poly(bx, ax, { cols: 12, rows: 7, differ: true, tasks: [{ kind: "par", area: 10 }, { kind: "par", area: 10 }], ok: "밑변의 길이와 높이의 곱이 10이 되면 넓이가 10 cm²인 평행사변형이에요." }) }]) }
},
{
  id: "t1011", no: "10~11", title: "삼각형의 넓이를 구해 볼까요", soop: "개념 구축하기(O)",
  question: "삼각형의 넓이는 어떻게 구할 수 있을까요?",
  summary: "삼각형에서 한 변을 밑변이라고 하면, 그 밑변과 마주 보는 꼭짓점에서 밑변에 수직으로 그은 선분의 길이를 높이라고 해요. 똑같은 삼각형 2개를 붙이면 밑변과 높이가 같은 평행사변형이 되고, 삼각형은 그 반이에요. 그래서 (삼각형의 넓이) = (밑변의 길이) × (높이) ÷ 2예요.",
  steps: [
    { name: "밑변과 높이", inst: "태민이가 창고에 삼각형 모양의 창문을 만들었어요. 파란 변을 밑변으로 할 때, 마주 보는 꼭짓점에서 밑변에 수직인 선분(높이)을 그어 보세요.", hints: ["밑변과 마주 보는 꼭짓점은 위쪽 꼭짓점이에요.", "꼭짓점에서 밑변까지 곧게 내려 그어요."],
      render: (b, a) => ar6Height(b, a, { tasks: [{ P: [[1, 5], [7, 5], [3, 1]], base: [0, 1], top: "v", at: 2, cols: 8, rows: 6 }],
        ask: [{ q: "약속하기", parts: ["삼각형에서 한 변을 밑변이라고 하면, 그 밑변과 마주 보는 ", { o: ["꼭짓점", "변"], a: 0 }, "에서 밑변에 ", { o: ["수직으로", "비스듬하게"], a: 0 }, " 그은 선분의 길이를 높이라고 합니다. 이 삼각형의 높이는 ", { n: 4 }, " cm예요."] }],
        ok: "밑변과 마주 보는 꼭짓점에서 밑변에 수직으로 그은 선분의 길이가 높이예요." }) },
    { name: "높이 긋기", inst: "삼각형 가, 나, 다에서 파란 변을 밑변으로 할 때의 높이를 그어 보세요.", hints: ["가는 직각삼각형이라 한 변이 곧 높이예요.", "나는 밑변을 늘인 점선까지 그어요(높이가 삼각형 밖에 있어요).", "다는 밑변이 세로로 놓여 있어요."],
      render: (b, a) => ar6Height(b, a, { tasks: [
          { P: [[1, 1], [1, 5], [5, 5]], base: [1, 2], top: "v", at: 0, cols: 6, rows: 6, name: "가" },
          { P: [[3, 5], [6, 5], [1, 1]], base: [0, 1], top: "v", at: 2, cols: 7, rows: 6, ext: true, name: "나" },
          { P: [[1, 1], [1, 5], [5, 3]], base: [0, 1], top: "v", at: 2, cols: 6, rows: 6, name: "다" }],
        ask: [{ parts: ["나처럼 둔각삼각형은 높이가 삼각형 ", { o: ["밖에", "안에만"], a: 0 }, " 있을 수 있어요. 한 삼각형에서 밑변이 될 수 있는 변은 ", { o: ["세 변 모두", "아래에 있는 변 하나"], a: 0 }, "이고, 밑변에 따라 높이도 ", { o: ["달라져요", "언제나 같아요"], a: 0 }, "."] }],
        ok: "어느 변이든 밑변이 될 수 있고, 밑변에 따라 높이가 달라져요. 높이가 바깥에 있으면 밑변을 늘여서 그어요." }) },
    { name: "붙여 보기", inst: "똑같은 삼각형 2개로 평행사변형을 만들어 보세요. 아래 삼각형을 골라 ‘돌리기’로 반 바퀴 돌린 다음, 끌어서 위 삼각형 오른쪽에 붙여요.", hints: ["먼저 아래 삼각형을 눌러 고르고 ‘↻ 돌리기’를 눌러요.", "두 삼각형의 긴 변끼리 맞붙여요."],
      render: (b, a) => ar6Cut(b, a, { cols: 12, rows: 11, k: 30, rotate: true, pieces: [
          { P: AR6_TRI, fill: AR6.f1 },
          { P: AR6_TRI, fill: AR6.f2, move: true, start: { dx: 1, dy: 5 }, target: ar6RotT(AR6_TRI, [6, 3]) }],
        marks: (g, m) => { ar6Seg(g, m, [3, 1], [3, 5], { color: AR6.red, w: 2.5, dash: "5 4" }); ar6Lab(g, m, [1, 5], [9, 5], "8 cm", { c: [4, 3], color: AR6.blue }); g.append(txt(m([3.6, 3])[0] + 14, m([3, 3])[1], "4 cm", 14, { fill: AR6.red })); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 5], [9, 5], [11, 1], [3, 1]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 5], [9, 5], "밑변 8 cm", { c: [6, 3] }); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 삼각형의 ", { o: ["밑변의 길이", "높이"], a: 0 }, "와 같고, 높이는 삼각형의 ", { o: ["높이", "밑변의 길이"], a: 0 }, "와 같아요. 삼각형의 넓이는 평행사변형의 넓이의 ", { o: ["반", "2배"], a: 0 }, "이에요."] },
          { parts: ["삼각형의 넓이: 8 × 4 ÷ 2 = ", { n: 16, why: { "32": "32 cm²는 평행사변형의 넓이예요. 삼각형은 그 반이에요." } }, " (cm²)"] }],
        ok: "똑같은 삼각형 2개가 평행사변형이 되므로 삼각형의 넓이는 8×4÷2=16 (cm²)예요." }) },
    { name: "약속하기", inst: "이번에는 삼각형을 높이의 반이 되는 곳(점선)에서 잘랐어요. 위 조각을 골라 반 바퀴 돌려 오른쪽에 붙여 평행사변형을 만들어 보세요.", hints: ["위 조각을 눌러 고르고 ‘↻ 돌리기’를 눌러요.", "잘린 오른쪽 변끼리 맞붙여요."],
      render: (b, a) => ar6Cut(b, a, { cols: 11, rows: 6, rotate: true, pieces: [
          { P: AR6_TRI_BOT, fill: AR6.f1 },
          { P: AR6_TRI_TOP, fill: AR6.f2, move: true, target: ar6RotT(AR6_TRI_TOP, [6, 3]) }],
        marks: (g, m) => { ar6Seg(g, m, [0, 3], [11, 3], { color: AR6.gray, w: 1.5, dash: "4 4" }); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 5], [9, 5], [10, 3], [2, 3]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 5], [9, 5], "밑변 8 cm", { c: [5, 4] }); ar6Seg(g, m, [9, 3], [9, 5], { color: AR6.red, w: 2.5 }); g.append(txt(m([9.3, 4])[0] + 2, m([9, 4])[1], "2 cm", 14, { fill: AR6.red, "text-anchor": "start" })); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 삼각형의 밑변의 길이와 같은 ", { n: 8 }, " cm이고, 높이는 삼각형 높이의 ", { o: ["반", "2배"], a: 0 }, "인 ", { n: 2 }, " cm예요. → 8 × 2 = ", { n: 16 }, " (cm²)"] },
          { q: "약속하기", parts: ["(삼각형의 넓이) = (", { o: ["밑변의 길이", "둘레"], a: 0 }, ") × (", { o: ["높이", "밑변의 길이"], a: 0 }, ") ÷ ", { o: ["2", "4"], a: 0 }] }],
        ok: "(삼각형의 넓이) = (밑변의 길이) × (높이) ÷ 2예요. 두 방법 모두 16 cm²예요." }) },
    { name: "확인하기", inst: "삼각형의 넓이를 구하는 방법을 이용하여 문제를 해결해 보세요.", hints: ["(삼각형의 넓이) = (밑변의 길이) × (높이) ÷ 2", "밑변을 모르면 □로 놓고 식을 세워요: □ × 4 ÷ 2 = 12"],
      render: (b, a) => ar6Chain(b, a, [
        (bx, ax) => ar6Ask(bx, ax, [
          { parts: ["밑변 7 cm, 높이 6 cm → ", { n: 21, why: { "42": "÷2를 잊었어요." } }, " cm²", h("br"), "밑변 5 m, 높이 8 m → ", { n: 20, why: { "40": "÷2를 잊었어요." } }, " m²"] },
          { parts: ["높이 4 cm, 넓이 12 cm² → □ × 4 ÷ 2 = 12 → 밑변 ", { n: 6, why: { "3": "□×4÷2=12이면 □×4=24예요." } }, " cm", h("br"), "밑변 6 m, 넓이 15 m² → 6 × □ ÷ 2 = 15 → 높이 ", { n: 5 }, " m"] }], { ok: "21 cm², 20 m², 밑변 6 cm, 높이 5 m예요." }),
        (bx, ax) => ar6Ask(bx, ax, [{ q: "모눈 위 삼각형 가, 나, 다의 넓이를 비교해 보세요. (한 칸은 1 cm)",
          fig: () => ar6Static({ cols: 21, rows: 6, k: 22, shapes: [{ P: [[1, 5], [6, 5], [3, 1]], fill: AR6.f1, name: "가" }, { P: [[7, 5], [12, 5], [7, 1]], fill: AR6.f2, name: "나", nameAt: [8.6, 3.9] }, { P: [[13, 5], [18, 5], [20, 1]], fill: AR6.f3, name: "다", nameAt: [17, 4.2] }], maxW: "38em" }),
          parts: ["가 ", { n: 10 }, " cm², 나 ", { n: 10 }, " cm², 다 ", { n: 10 }, " cm² → 밑변의 길이와 높이가 각각 같으면 넓이도 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
          { ok: "세 삼각형 모두 밑변 5 cm, 높이 4 cm라서 5×4÷2=10 (cm²)예요." })]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 삼각형의 넓이를 이용해 보세요.", hints: ["(삼각형의 넓이) = (밑변의 길이) × (높이) ÷ 2", "같은 삼각형은 어느 변을 밑변으로 해도 넓이가 같아요."],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "밑변 10 cm, 높이 4 cm인 삼각형", parts: ["10 × 4 ÷ 2 = ", { n: 20 }, " (cm²)"] },
        { q: "넓이가 54 cm², 밑변이 9 cm인 삼각형의 높이는?", parts: [{ n: 12, why: { "6": "□×9÷2=54이면 □×9=108이에요." } }, " cm"] },
        { q: "밑변 6 cm, 높이 8 cm인 삼각형을 높이의 반에서 잘라 직사각형을 만들었어요. 잘못 설명한 사람은?  유라: “만든 직사각형의 세로는 8 cm야.”  진환: “만든 직사각형의 가로는 6 cm야.”", parts: [{ o: ["유라", "진환"], a: 0 }] },
        { q: "한 삼각형에서 밑변 12 cm일 때 높이 4 cm, 밑변 8 cm일 때 높이는?", parts: ["12 × 4 ÷ 2 = 8 × □ ÷ 2 → □ = ", { n: 6 }, " cm"] }], { ok: "20 cm², 12 cm, 유라(세로는 높이의 반인 4 cm), 6 cm예요." }),
      { title: "점을 이어 넓이가 6 cm²인 삼각형을 서로 다른 모양으로 2개 그려요.", run: (bx, ax) => ar6Poly(bx, ax, { cols: 10, rows: 7, differ: true, tasks: [{ kind: "tri", area: 6 }, { kind: "tri", area: 6 }], ok: "밑변×높이가 12가 되면 넓이가 6 cm²인 삼각형이에요." }) }]) }
},
{
  id: "t12", no: 12, title: "마름모의 넓이를 구해 볼까요", soop: "개념 구축하기(O)",
  question: "마름모의 넓이는 어떻게 구할 수 있을까요?",
  summary: "마름모를 둘러싸는 직사각형의 가로와 세로는 마름모의 두 대각선의 길이와 같고, 직사각형의 넓이는 마름모 넓이의 2배예요. 마름모를 한 대각선을 따라 잘라 붙이면 밑변이 한 대각선, 높이가 다른 대각선의 반인 평행사변형이 돼요. 그래서 (마름모의 넓이) = (한 대각선의 길이) × (다른 대각선의 길이) ÷ 2예요.",
  steps: [
    { name: "둘러싸기", inst: "태민이가 마름모 모양의 텃밭을 만들었어요. 마름모(대각선 6 cm, 4 cm)를 둘러싸는 직사각형의 네 귀퉁이 삼각형을 하나씩 골라 반 바퀴 돌린 다음, 마름모 안으로 옮겨 보세요.", hints: ["귀퉁이 삼각형을 누르고 ‘↻ 돌리기’를 눌러요.", "돌린 삼각형을 마름모 안의 같은 모양 자리로 끌어요."],
      render: (b, a) => ar6Cut(b, a, { cols: 8, rows: 6, k: 40, rotate: true, maxW: "26em", ghost: AR6_RECT(1, 1, 6, 4), pieces: [
          { P: AR6_RH, fill: AR6.f3 },
          { P: [[1, 1], [4, 1], [1, 3]], fill: AR6.f4, move: true, target: ar6RotT([[1, 1], [4, 1], [1, 3]], [2.5, 2]) },
          { P: [[4, 1], [7, 1], [7, 3]], fill: AR6.f4, move: true, target: ar6RotT([[4, 1], [7, 1], [7, 3]], [5.5, 2]) },
          { P: [[7, 3], [7, 5], [4, 5]], fill: AR6.f4, move: true, target: ar6RotT([[7, 3], [7, 5], [4, 5]], [5.5, 4]) },
          { P: [[1, 3], [4, 5], [1, 5]], fill: AR6.f4, move: true, target: ar6RotT([[1, 3], [4, 5], [1, 5]], [2.5, 4]) }],
        marks: (g, m) => { ar6Seg(g, m, [1, 3], [7, 3], { color: AR6.blue, w: 2.5 }); ar6Seg(g, m, [4, 1], [4, 5], { color: AR6.red, w: 2.5 }); },
        after: (g, m) => { ar6Poly0(g, m, AR6_RECT(1, 1, 6, 4), { fill: "none", stroke: AR6.org, w: 3 }); ar6Lab(g, m, [1, 1], [7, 1], "6 cm", { c: [4, 3] }); ar6Lab(g, m, [7, 1], [7, 5], "4 cm", { c: [4, 3] }); },
        msg: "귀퉁이 삼각형 4개로 마름모를 빈틈없이 덮었어요.",
        ask: [{ parts: ["둘러싸는 직사각형의 가로는 마름모의 한 대각선의 길이인 ", { n: 6 }, " cm, 세로는 다른 대각선의 길이인 ", { n: 4 }, " cm예요. 귀퉁이 삼각형 4개가 마름모와 꼭 맞으므로 직사각형의 넓이는 마름모 넓이의 ", { n: 2 }, "배예요."] },
          { parts: ["마름모의 넓이: 6 × 4 ÷ 2 = ", { n: 12, why: { "24": "24 cm²는 둘러싸는 직사각형의 넓이예요. 마름모는 그 반이에요." } }, " (cm²)"] }],
        ok: "(마름모의 넓이) = (둘러싸는 직사각형의 넓이) ÷ 2 = 6×4÷2 = 12 (cm²)예요." }) },
    { name: "잘라 보기", inst: "마름모를 파란 대각선을 따라 잘랐어요. 위 조각을 끌어 아래 조각의 오른쪽에 붙여 평행사변형을 만들어 보세요.", hints: ["위 삼각형을 오른쪽 아래로 옮겨요.", "돌리지 않고 옮기기만 하면 돼요."],
      render: (b, a) => ar6Cut(b, a, { cols: 11, rows: 6, pieces: [
          { P: [[1, 3], [7, 3], [4, 5]], fill: AR6.f3 },
          { P: [[1, 3], [4, 1], [7, 3]], fill: AR6.f4, move: true, target: { dx: 3, dy: 2 } }],
        marks: (g, m) => { ar6Seg(g, m, [1, 3], [7, 3], { color: AR6.blue, w: 3 }); ar6Seg(g, m, [4, 1], [4, 5], { color: AR6.red, w: 2, dash: "5 4" }); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 3], [7, 3], [10, 5], [4, 5]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 3], [7, 3], "밑변 6 cm", { c: [5, 4], color: AR6.blue }); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 마름모의 한 대각선(파란색)의 길이인 ", { n: 6 }, " cm, 높이는 다른 대각선(빨간색)의 길이의 반인 ", { n: 2 }, " cm예요. → 6 × 2 = ", { n: 12 }, " (cm²)"] }],
        ok: "잘라 붙여서 만든 평행사변형도 넓이가 12 cm²예요." }) },
    { name: "말해 보기", inst: "두 가지 방법을 비교하여 마름모의 넓이를 구하는 방법을 말해 보세요.", hints: ["두 방법 모두 두 대각선의 길이를 사용했어요."],
      render: (b, a) => blanks(b, a, ["둘러싸는 직사각형으로 구해도 6 × 4 ÷ 2, 잘라서 평행사변형으로 구해도 6 × (4 ÷ 2)예요. 두 방법 모두 ", { o: ["두 대각선의 길이를 곱한 다음 2로 나눈 것", "두 대각선의 길이를 더한 것"], a: 0 }, "과 같아요."],
        { ok: "마름모의 넓이는 두 대각선의 길이를 곱한 다음 2로 나누어 구해요." }) },
    { name: "약속하기", inst: "마름모의 넓이를 구하는 식을 완성해 보세요.", hints: ["둘러싸는 직사각형의 넓이의 반이에요."],
      render: (b, a) => blanks(b, a, ["(마름모의 넓이) = (한 대각선의 길이) × (", { o: ["다른 대각선의 길이", "한 변의 길이", "높이"], a: 0 }, ") ÷ ", { o: ["2", "4"], a: 0 }],
        { ok: "(마름모의 넓이) = (한 대각선의 길이) × (다른 대각선의 길이) ÷ 2예요." }) },
    { name: "확인하기", inst: "마름모의 넓이를 구해 보세요.", hints: ["두 대각선의 길이를 곱하고 2로 나누어요."],
      render: (b, a) => ar6Ask(b, a, [{ fig: () => ar6Static({ cols: 21, rows: 9, k: 20, grid: false, shapes: [{ P: [[1, 4.5], [5, 2], [9, 4.5], [5, 7]], fill: AR6.f3 }, { P: [[12, 4.5], [16.5, 1.5], [21, 4.5], [16.5, 7.5]], fill: AR6.f4 }],
          segs: [{ a: [1, 4.5], b: [9, 4.5], color: AR6.blue, w: 2 }, { a: [5, 2], b: [5, 7], color: AR6.red, w: 2 }, { a: [12, 4.5], b: [21, 4.5], color: AR6.blue, w: 2 }, { a: [16.5, 1.5], b: [16.5, 7.5], color: AR6.red, w: 2 }],
          texts: [{ p: [3, 4], t: "8 cm", size: 14, color: AR6.blue }, { p: [5.9, 6.2], t: "5 cm", size: 14, color: AR6.red }, { p: [14, 4], t: "9 m", size: 14, color: AR6.blue }, { p: [17.3, 6.6], t: "6 m", size: 14, color: AR6.red }, { p: [5, 8.3], t: "가" }, { p: [16.5, 8.5], t: "나" }], maxW: "32em" }),
        parts: ["가: 8 × 5 ÷ 2 = ", { n: 20, why: { "40": "÷2를 잊었어요." } }, " (cm²)", h("br"), "나: 9 × 6 ÷ 2 = ", { n: 27, why: { "54": "÷2를 잊었어요." } }, " (m²)"] }],
        { ok: "가는 8×5÷2=20 (cm²), 나는 9×6÷2=27 (m²)예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 마름모의 넓이를 이용해 보세요.", hints: ["(마름모의 넓이) = (한 대각선) × (다른 대각선) ÷ 2", "넓이 16 cm²: 두 대각선의 곱이 32가 되게(예: 8 cm와 4 cm) 그려요."],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "마름모를 잘라 만든 평행사변형의 밑변이 10 cm, 높이가 4 cm예요. (마름모의 대각선 10 cm, 8 cm)", parts: ["10 × 8 ÷ 2 = ", { n: 40 }, " (cm²)"] },
        { q: "대각선이 16 cm, 11 cm인 마름모", parts: [{ n: 88 }, " cm²"] },
        { q: "넓이가 65 cm², 한 대각선이 13 cm인 마름모의 다른 대각선은?", parts: [{ n: 10, why: { "5": "13×□÷2=65이면 13×□=130이에요." } }, " cm"] },
        { q: "더 넓은 마름모는?", parts: ["대각선 17 cm, 8 cm → ", { n: 68 }, " cm² / 대각선 12 cm, 12 cm → ", { n: 72 }, " cm² → ", { o: ["17 cm, 8 cm", "12 cm, 12 cm"], a: 1 }] },
        { q: "가로 40 cm, 세로 50 cm인 직사각형 종이의 네 변의 가운데를 이어 마름모 모양 가오리연을 만들었어요. 연의 넓이는?", parts: [{ n: 1000, why: { "2000": "2000 cm²는 직사각형 종이의 넓이예요. 마름모는 그 반이에요." } }, " cm²"] }], { ok: "40 cm², 88 cm², 10 cm, 12 cm·12 cm 쪽(72 cm²), 1000 cm²예요." }),
      { title: "점을 이어 넓이가 16 cm²인 마름모를 그려요.", run: (bx, ax) => ar6Poly(bx, ax, { cols: 10, rows: 8, tasks: [{ kind: "rh", area: 16 }], ok: "두 대각선의 곱이 32이면 넓이가 16 cm²인 마름모예요. (한 변이 4 cm인 정사각형도 마름모예요.)" }) }]) }
},
{
  id: "t1314", no: "13~14", title: "사다리꼴의 넓이를 구해 볼까요", soop: "개념 구축하기(O)",
  question: "사다리꼴의 넓이는 어떻게 구할 수 있을까요?",
  summary: "사다리꼴에서 평행한 두 변을 밑변이라 하고, 한 밑변을 윗변, 다른 밑변을 아랫변이라고 해요. 두 밑변 사이의 거리가 높이예요. 똑같은 사다리꼴 2개를 붙이면 밑변이 (윗변+아랫변), 높이가 사다리꼴의 높이인 평행사변형이 되고, 사다리꼴은 그 반이에요. 그래서 (사다리꼴의 넓이) = (윗변의 길이 + 아랫변의 길이) × (높이) ÷ 2예요.",
  steps: [
    { name: "밑변과 높이", inst: "태민이가 수영장에 사다리꼴 모양의 그늘막을 만들었어요. 사다리꼴 가, 나에서 파란 변과 평행한 변 사이에 높이를 그어 보세요.", hints: ["평행한 두 변 사이에 수직인 선분을 그어요.", "나는 아래쪽 변이 더 짧아요. 짧은 변 위의 점에서 위로 그어 봐요."],
      render: (b, a) => ar6Height(b, a, { tasks: [
          { P: AR6_TZ, base: [0, 1], top: "s", at: [2, 3], cols: 10, rows: 6, name: "가" },
          { P: [[2, 4], [4, 4], [8, 1], [1, 1]], base: [0, 1], top: "s", at: [2, 3], cols: 9, rows: 5, name: "나" }],
        ask: [{ q: "약속하기", parts: ["사다리꼴에서 평행한 두 변을 ", { o: ["밑변", "높이"], a: 0 }, "이라 하고, 한 밑변을 윗변, 다른 밑변을 아랫변이라고 합니다. 이때 두 밑변 사이의 거리를 ", { o: ["높이", "대각선"], a: 0 }, "라고 합니다."] },
          { parts: ["가의 높이는 ", { n: 4 }, " cm, 나의 높이는 ", { n: 3 }, " cm예요. 나처럼 윗변이 아랫변보다 ", { o: ["길 수도 있어요", "길 수 없어요"], a: 0 }, "."] }],
        ok: "평행한 두 변이 밑변(윗변·아랫변)이고, 두 밑변 사이의 거리가 높이예요. 윗변이 꼭 짧은 변은 아니에요." }) },
    { name: "붙여 보기", inst: "똑같은 사다리꼴 2개로 평행사변형을 만들어 보세요. 아래 사다리꼴을 골라 반 바퀴 돌린 다음, 끌어서 위 사다리꼴 오른쪽에 붙여요. (윗변 2 cm, 아랫변 8 cm, 높이 4 cm)", hints: ["아래 사다리꼴을 누르고 ‘↻ 돌리기’를 눌러요.", "비스듬한 오른쪽 변끼리 맞붙여요."],
      render: (b, a) => ar6Cut(b, a, { cols: 14, rows: 11, k: 28, rotate: true, pieces: [
          { P: AR6_TZ, fill: AR6.f6 },
          { P: AR6_TZ, fill: AR6.f4, move: true, start: { dx: 0, dy: 5 }, target: ar6RotT(AR6_TZ, [7, 3]) }],
        marks: (g, m) => { ar6Seg(g, m, [3, 1], [5, 1], { color: AR6.blue, w: 4 }); ar6Seg(g, m, [1, 5], [9, 5], { color: AR6.green, w: 4 }); ar6Seg(g, m, [4, 1], [4, 5], { color: AR6.red, w: 2.5, dash: "5 4" }); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 5], [11, 5], [13, 1], [3, 1]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 5], [11, 5], "밑변 8 cm + 2 cm = 10 cm", { c: [6, 3] }); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 사다리꼴의 (윗변 + 아랫변)과 같은 ", { n: 10 }, " cm, 높이는 사다리꼴의 높이와 같은 ", { n: 4 }, " cm예요. 사다리꼴의 넓이는 평행사변형 넓이의 ", { o: ["반", "2배"], a: 0 }, "이에요."] },
          { parts: ["사다리꼴의 넓이: (2 + 8) × 4 ÷ 2 = ", { n: 20, why: { "40": "40 cm²는 평행사변형의 넓이예요. 사다리꼴은 그 반이에요." } }, " (cm²)"] }],
        ok: "똑같은 사다리꼴 2개가 평행사변형이 되므로 사다리꼴의 넓이는 (2+8)×4÷2=20 (cm²)예요." }) },
    { name: "잘라 보기", inst: "같은 사다리꼴을 높이의 반이 되는 곳(점선)에서 잘랐어요. 위 조각을 골라 반 바퀴 돌려 오른쪽에 붙여 평행사변형을 만들어 보세요.", hints: ["위 조각을 누르고 ‘↻ 돌리기’를 눌러요.", "잘린 오른쪽 변끼리 맞붙여요."],
      render: (b, a) => ar6Cut(b, a, { cols: 13, rows: 6, rotate: true, pieces: [
          { P: AR6_TZ_BOT, fill: AR6.f6 },
          { P: AR6_TZ_TOP, fill: AR6.f4, move: true, target: ar6RotT(AR6_TZ_TOP, [7, 3]) }],
        marks: (g, m) => { ar6Seg(g, m, [0, 3], [13, 3], { color: AR6.gray, w: 1.5, dash: "4 4" }); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 5], [11, 5], [12, 3], [2, 3]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 5], [11, 5], "밑변 10 cm", { c: [6, 4] }); ar6Seg(g, m, [11, 3], [11, 5], { color: AR6.red, w: 2.5 }); g.append(txt(m([11.3, 4])[0] + 2, m([11, 4])[1], "2 cm", 14, { fill: AR6.red, "text-anchor": "start" })); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 (윗변 + 아랫변)인 ", { n: 10 }, " cm, 높이는 사다리꼴 높이의 반인 ", { n: 2 }, " cm예요. → 10 × 2 = ", { n: 20 }, " (cm²)"] }],
        ok: "잘라서 만든 평행사변형으로 구해도 20 cm²예요." }) },
    { name: "약속하기", inst: "사다리꼴의 넓이를 구하는 식을 완성하고, 문제를 해결해 보세요.", hints: ["(윗변 + 아랫변)이 평행사변형의 밑변이 되었어요.", "높이를 모르면 □로 놓아요: (12+6)×□÷2=45"],
      render: (b, a) => ar6Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["(사다리꼴의 넓이) = (윗변의 길이 + ", { o: ["아랫변의 길이", "높이", "대각선의 길이"], a: 0 }, ") × (", { o: ["높이", "윗변의 길이"], a: 0 }, ") ÷ ", { o: ["2", "4"], a: 0 }], { ok: "(사다리꼴의 넓이) = (윗변의 길이 + 아랫변의 길이) × (높이) ÷ 2예요." }),
        (bx, ax) => ar6Ask(bx, ax, [
          { parts: ["윗변 4 cm, 아랫변 5 cm, 높이 6 cm → ", { n: 27, why: { "54": "÷2를 잊었어요." } }, " cm²", h("br"), "윗변 7 m, 아랫변 5 m, 높이 8 m → ", { n: 48, why: { "96": "÷2를 잊었어요." } }, " m²"] },
          { parts: ["윗변 12 cm, 아랫변 6 cm, 넓이 45 cm² → (12 + 6) × □ ÷ 2 = 45 → 높이 ", { n: 5 }, " cm", h("br"), "윗변 4 m, 아랫변 6 m, 넓이 30 m² → 높이 ", { n: 6, why: { "3": "(4+6)×□÷2=30이면 10×□=60이에요." } }, " m"] }], { ok: "27 cm², 48 m², 높이 5 cm, 6 m예요." })]) },
    { name: "여러 방법", inst: "모눈 위 사다리꼴(윗변 2 cm, 아랫변 6 cm, 높이 4 cm)의 넓이를 여러 가지 방법으로 구해 보세요.", hints: ["삼각형 넓이: 밑변×높이÷2", "둘러싼 직사각형에서 남는 삼각형을 빼도 돼요."],
      render: (b, a) => ar6Ask(b, a, [
        { q: "방법 1: 대각선을 1개 그어 삼각형 2개로 나누기", fig: () => ar6Static({ cols: 8, rows: 6, k: 26, shapes: [{ P: [[1, 1], [3, 1], [1, 5]], fill: AR6.f1 }, { P: [[3, 1], [7, 5], [1, 5]], fill: AR6.f2 }], maxW: "14em" }),
          parts: ["2 × 4 ÷ 2 = ", { n: 4 }, ", 6 × 4 ÷ 2 = ", { n: 12 }, " → ", { n: 16 }, " cm²"] },
        { q: "방법 2: 직사각형과 삼각형으로 나누기", fig: () => ar6Static({ cols: 8, rows: 6, k: 26, shapes: [{ P: AR6_RECT(1, 1, 2, 4), fill: AR6.f1 }, { P: [[3, 1], [7, 5], [3, 5]], fill: AR6.f2 }], maxW: "14em" }),
          parts: ["2 × 4 = ", { n: 8 }, ", 4 × 4 ÷ 2 = ", { n: 8 }, " → ", { n: 16 }, " cm²"] },
        { q: "방법 3: 둘러싼 직사각형에서 빼기", fig: () => ar6Static({ cols: 8, rows: 6, k: 26, shapes: [{ P: AR6_RTZ, fill: AR6.f3 }, { P: [[3, 1], [7, 1], [7, 5]], fill: "#fff", stroke: AR6.gray, dash: "5 4" }], maxW: "14em" }),
          parts: ["6 × 4 = ", { n: 24 }, ", 24 − ", { n: 8 }, " = ", { n: 16 }, " cm² → 구한 방법은 달라도 넓이는 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
        { ok: "세 방법 모두 16 cm²예요. 공식으로도 (2+6)×4÷2=16 (cm²)예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 사다리꼴의 넓이를 여러 방법으로 구해 보세요.", hints: ["삼각형 2개로 나누면 두 삼각형의 높이는 사다리꼴의 높이와 같아요.", "넓이 12 cm²: (윗변+아랫변)×높이가 24가 되게 그려요."],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "윗변 4 cm, 아랫변 8 cm, 높이 5 cm인 사다리꼴을 대각선으로 나누어 삼각형 가(밑변 4 cm)와 나(밑변 8 cm)를 만들었어요.", fig: () => ar6Static({ cols: 10, rows: 7, k: 24, shapes: [{ P: [[2, 1], [6, 1], [1, 6]], fill: AR6.f1, name: "가", nameAt: [3, 2.6] }, { P: [[6, 1], [9, 6], [1, 6]], fill: AR6.f2, name: "나", nameAt: [5.6, 4.4] }], labs: [{ a: [2, 1], b: [6, 1], t: "4 cm", c: [5, 4] }, { a: [1, 6], b: [9, 6], t: "8 cm", c: [5, 4] }], maxW: "16em" }),
          parts: ["가 ", { n: 10 }, " cm², 나 ", { n: 20 }, " cm² → 사다리꼴 ", { n: 30 }, " cm²"] },
        { q: "넓이가 70 cm², 윗변 6 cm, 아랫변 8 cm인 사다리꼴의 높이는?", parts: [{ n: 10, why: { "5": "(6+8)×□÷2=70이면 14×□=140이에요." } }, " cm"] }], { ok: "가 10 cm², 나 20 cm²로 사다리꼴은 30 cm²예요. 공식 (4+8)×5÷2=30과 같아요. 높이는 10 cm예요." }),
      { title: "점을 이어 넓이가 12 cm²인 사다리꼴을 그려요. (평행한 변이 한 쌍만 있게 그려 봐요.)", run: (bx, ax) => ar6Poly(bx, ax, { cols: 10, rows: 7, tasks: [{ kind: "trap", area: 12 }], ok: "(윗변+아랫변)×높이÷2가 12이면 넓이가 12 cm²인 사다리꼴이에요." }) }]) }
},
