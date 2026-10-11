//@@APP
const APP={title:"우리 반 꿈의 교실 설계도", unit:"5-1 수학 6. 다각형의 둘레와 넓이", key:"s51-area-v1", welcome:"우리 반 꿈의 교실 설계도에 온 것을 환영해요", intro:"푸른숲초등학교 5학년 2반이 ‘꿈의 교실 공모전’에 나가요. 텃밭 울타리와 꽃밭 테두리의 둘레를 재고, 바닥 타일을 1 cm²로 세고, 교실은 m², 우리 마을 지도는 km²로 나타내요. 평행사변형 러그, 삼각형 깃발, 마름모 창문 장식, 사다리꼴 화단을 잘라 옮기고 붙여서 넓이를 구하는 방법을 스스로 찾아요."};
//@@UNIT
/* =========================================================
   5-1 수학 6. 다각형의 둘레와 넓이 — 단원 조작 부품 (앞글자 ar6)
   모든 도형은 cm 모눈 좌표(가로 x, 아래쪽 y)로 적고, 넓이·둘레·자르기 결과는 코드로 계산해서 채점해요.
   ar6Perim  변을 눌러 끈으로 둘레 재기          ar6Count  1 cm²(반 칸 포함) 하나씩/한 줄씩 세기
   ar6Rect   모눈에 직사각형 그리기(과제·모두 찾기)  ar6Cut    조각을 끌어 옮기고 돌려 다른 도형 만들기
   ar6Height 삼각자처럼 높이 긋기                  ar6Big    1 m²·1 km²를 작은 단위로 채우기
   ar6Tile   여러 가지 단위 모양으로 넓이 비교       ar6Poly   점을 이어 넓이가 주어진 도형 그리기
   ar6sPlan  꿈의 교실 설계도에서 도형 찾기         ar6Game   직사각형 보물 탐험대 놀이
   ar6Paint  모눈 색칠하기
   이야기 버전: 교과서 버전(u6-area.tb.js)의 ar6 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   기다리는 시간: 입력칸 900ms(Enter는 blur) · 보기 고르기 260ms · 그리기·색칠하기 1200ms(손을 뗀 뒤).
   엔진의 hj-multi(한 계단 여러 활동 세기)가 이 부품들을 활동으로 셀 수 있게, 부품마다 'api.done(' 길을 주석으로 적어 두었어요.
   (부품 → ar6Finish → api.done( 또는 ar6Ask → api.done( )
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
  const side = Math.abs(nx) > .8, d = o.d || (side ? 8 : 15);
  svg.append(txt(ar6R(mx + nx * d), ar6R(my + ny * d), t, o.size || 17, { fill: o.color || AR6.ink, "text-anchor": side ? (nx > 0 ? "start" : "end") : "middle" }));
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
  const filled = s => s.pt.o ? (s.pt.multi ? s.v.size === s.pt.a.length : s.v != null) : s.inp.value.trim() !== "";
  const check = () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) { [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); }); }
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) { all.forEach(s => { if (s.inp) s.inp.readOnly = true; }); api.done(ans, opts.ok); return true; }
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(ar6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
    return false;
  };
  const hasIn = all.some(s => !s.pt.o);
  const kick = autoRun(() => all.every(filled), () => all.map(val).join("\u0001") + "|" + all.map(s => s.v instanceof Set ? [...s.v].sort().join(",") : "").join(";"), check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) later(hasIn ? 600 : 260); });
  all.forEach(s => { if (!s.inp) return;
    s.inp.addEventListener("input", e => { s.inp.style.borderColor = ""; if (!e.isComposing) later(900); });
    s.inp.addEventListener("change", () => later(200));
    s.inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); s.inp.blur(); } }); });
  host.append(wrap);
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
  /* 다 하면 ar6Finish → (물음이 있으면 ar6Ask →) api.done( 으로 계단을 통과해요. */
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
  body.append(...(opt.tip ? [h("p", { class: "ar6small" }, opt.tip)] : []), svg, read,
    h("div", { class: "tools" }, h("button", { onclick: () => { if (used.length === n) return; used.length = 0; sideEls.forEach(e => e.setAttribute("stroke", "transparent")); redraw(); } }, "끈 다시 두르기")));
  redraw();
}

/* =========================================================
   2. 1 cm² 세기 — 칸(또는 반 칸)을 눌러 하나씩 세기, byRow면 한 줄씩
   opt: {cols, rows, P | cells, byRow, small:"1 cm²", unit:"cm²", tip, ask|then, ok, k}
   ========================================================= */
function ar6Count(body, api, opt) {
  /* 다 하면 ar6Finish → (물음이 있으면 ar6Ask →) api.done( 으로 계단을 통과해요. */
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
    if (opt.byRow) { const y = pcs[i].y; const inRow = pcs.map((p, j) => p.y === y ? j : -1).filter(j => j >= 0); if (inRow.every(j => order.includes(j))) return; inRow.forEach(j => { if (!order.includes(j)) order.push(j); }); }
    else { const at = order.indexOf(i); if (at >= 0) order.splice(at, 1); else order.push(i); }
    paint();
    if (order.length === pcs.length) {
      doneOnce = true;
      const perRow = opt.byRow ? pcs.filter(p => p.y === pcs[0].y).length : 0;
      ar6Finish(body, api, opt, `${small} ${nF}개` + (nH ? `, 반 칸 ${nH}개` : ""), opt.msg || (`${ar6Jo(small, "이/가")} ${nF}개` + (nH ? `, 반 칸이 ${nH}개` : "") + (opt.byRow ? ` — 한 줄에 ${perRow}개씩 ${rowsOf().length}줄` : "") + " 있어요."), { nF, nH });
    }
  }
  api.provide({ words: [small, "1 cm²의 몇 배", "반 칸 2개 = 1 cm²"], answers: [`${small} ${nF}개` + (nH ? `, 반 칸 ${nH}개` : "")] });
  body.append(...(opt.tip ? [h("p", { class: "ar6small" }, opt.tip)] : []), svg, read,
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
  /* 끝나면 ar6Finish → api.done( 으로 계단을 통과해요. 손을 떼고 1.2초 뒤에 저절로 확인해요. */
  let dragging = false, tableOn = false;
  const ok2 = () => R && dims(R)[0] > 0 && dims(R)[1] > 0;
  const runRect = () => {
    if (!ok2() || locked) return false;
    if (C) {
      const t = C.area ? { area: C.area } : { perim: C.perim }; const bad = meets(t, R); if (bad) { api.tryOnce(); api.fail(bad, describe(R)); return false; }
      const d = dims(R).slice().sort((a, b) => a - b); if (found.some(f => f[0] === d[0] && f[1] === d[1])) { api.hint("이미 넣은 모양이에요. 가로와 세로를 바꾼 것은 같은 모양이에요. 다른 모양을 찾아봐요."); return false; }
      found.push(d); showRect(R, keep.appendChild(svgEl("g")), AR6.f3); cur.innerHTML = ""; R = null; drawTable();
      if (found.length < want.length) api.hint(`좋아요! ${found.length}가지를 찾았어요. 다른 모양도 그려 봐요.`);
      else { api.hint(`○ ${found.length}가지를 모두 찾았어요! 표의 빈칸에 ${qName}${ar6Jo(qName, "을/를").slice(-1)} 써요.`); locked = true; tableOn = true; }
      return false;
    }
    api.tryOnce(); const bad = meets(tasks[ti], R); if (bad) { api.fail(bad, describe(R)); return false; }
    const d = dims(R); if (!opt.keep) keep.innerHTML = ""; showRect(R, keep.appendChild(svgEl("g")), AR6.f3); cur.innerHTML = "";
    made.push({ w: d[0], h: d[1] });
    R = null; ti++;
    if (ti < tasks.length) { setTask(); api.hint(`○ 맞아요! (가로 ${d[0]} ${u}, 세로 ${d[1]} ${u}) 이어서 아래 직사각형도 그려요.`); return false; }
    locked = true; taskTxt.textContent = "";
    ar6Finish(body, api, opt, made.map(t => `${t.w}×${t.h}`).join(", "), opt.msg || `가로 ${d[0]} ${u}, 세로 ${d[1]} ${u}인 직사각형을 그렸어요.`, made);
    return true;
  };
  const kickR = autoRun(() => !dragging && ok2() && !locked, () => ti + "#" + found.length + "#" + JSON.stringify(R), runRect, 1200);
  ar6DragRect(svg, m, cols, rows, (a, b) => { dragging = true; R = [a, b]; showRect(R, cur); read.textContent = describe(R); }, (a, b) => { dragging = false; R = [a, b]; showRect(R, cur); read.textContent = describe(R); kickR(); }, () => !locked);
  const btns = h("div");
  let tblDone = false;
  const runTbl = () => {
    if (tblDone) return true; api.tryOnce();
    let bad = null; rowsIn.forEach(r => { const v = ar6Num(r.el.value), a = C.area ? (r.d[0] + r.d[1]) * 2 : r.d[0] * r.d[1]; r.el.style.borderColor = v === a ? "var(--ok)" : "var(--no)"; if (v !== a && !bad) bad = r; });
    if (bad) { api.fail(C.area ? `가로 ${bad.d[0]} ${u}, 세로 ${bad.d[1]} ${u}인 직사각형의 둘레를 다시 계산해 봐요. (가로+세로)×2예요.` : `가로 ${bad.d[0]} ${u}, 세로 ${bad.d[1]} ${u}인 직사각형의 넓이를 다시 계산해 봐요. 가로×세로예요.`, rowsIn.map(r => r.el.value).join(",")); return false; }
    tblDone = true; rowsIn.forEach(r => { r.el.readOnly = true; });
    ar6Finish(body, api, opt, found.map(d => `${d[0]}×${d[1]}`).join(", "), `서로 다른 직사각형 ${found.length}가지를 모두 찾고 ${qName}${ar6Jo(qName, "을/를").slice(-1)} 구했어요.`, found);
    return true;
  };
  const kickT = C ? autoRun(() => tableOn && rowsIn.length >= want.length && rowsIn.every(r => r.el.value.trim() !== ""), () => rowsIn.map(r => r.el.value).join(","), runTbl, 0) : null;
  let tmT = null;
  if (C) tblHost.addEventListener("input", e => { if (e.target.tagName === "INPUT") { e.target.style.borderColor = ""; clearTimeout(tmT); tmT = setTimeout(kickT, 900); } });
  if (C) tblHost.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); e.target.blur(); clearTimeout(tmT); tmT = setTimeout(kickT, 100); } });
  api.provide({ words: ["가로", "세로", "(가로)×(세로)", "(가로+세로)×2"], answers: C ? want.map(d => `${d[0]}×${d[1]}`) : tasks.map(t => t.w ? `가로 ${t.w}, 세로 ${t.h}` : "").filter(Boolean) });
  setTask(); drawTable();
  body.append(...(opt.tip ? [h("p", { class: "ar6small" }, opt.tip)] : []), taskTxt, svg, read, tblHost, btns);
}

/* =========================================================
   4. 잘라서 옮기기 — 조각을 끌어 옮기고, '돌리기'로 180° 돌려 다른 도형 만들기
   opt: {cols, rows, k, pieces:[{P, fill, stroke, move, start:{dx,dy,rot}, target:{dx,dy,rot}|[...], name}], marks(svg,m), ghost:P, after(svg,m), rotate, tip, ask|then, ok, msg}
   ========================================================= */
function ar6Cut(body, api, opt) {
  /* 다 하면 ar6Finish → (물음이 있으면 ar6Ask →) api.done( 으로 계단을 통과해요. */
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
  body.append(...(opt.tip ? [h("p", { class: "ar6small" }, opt.tip)] : []), svg, read, tools);
  draw();
}

/* =========================================================
   5. 높이 긋기 — 삼각자처럼 밑변(파란 변)에 수직인 선분을 끌어서 그어요
   opt: {tasks:[{P, base:[i,j], top:"v"|"s", at: 꼭짓점 번호 | [i,j] 마주 보는 변, ext, cols, rows, name}], k, tip, ask|then, ok}
   ========================================================= */
function ar6Height(body, api, opt) {
  /* 다 하면 ar6Finish → (물음이 있으면 ar6Ask →) api.done( 으로 계단을 통과해요. */
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
  body.append(...(opt.tip ? [h("p", { class: "ar6small" }, opt.tip)] : []), svg, read);
}

/* =========================================================
   6. 큰 넓이 단위 — 1 m²(1 km²)를 1 cm²(1 m²)로 몇 줄 채우는지 끌어서 알아보기
   opt: {n:100, side:"1 m = 100 cm", big:"1 m²", small:"1 cm²", ask, ok}
   ========================================================= */
function ar6Big(body, api, opt) {
  /* 다 하면 ar6Finish → (물음이 있으면 ar6Ask →) api.done( 으로 계단을 통과해요. */
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
  /* 다 하면 ar6Finish → (물음이 있으면 ar6Ask →) api.done( 으로 계단을 통과해요. */
  const k = opt.k || 44, pad = 24, bricks = opt.bricks || [{ name: "가", x: 0, y: 1, w: 5, h: 2 }, { name: "나", x: 7, y: 0, w: 3, h: 3 }], cols = opt.cols || 10, rows = opt.rows || 3, word = opt.word || "벽돌";
  const units = [{ id: "c", name: "○ 원", cells: [[0, 0]] }, { id: "d", name: "▭ 직사각형", cells: [[0, 0], [1, 0]] }, { id: "s", name: "□ 정사각형", cells: [[0, 0]] }];
  const W = cols * k + pad * 2, H = rows * k + pad * 2 + 30, m = ar6Map(k, pad, pad + 26);
  const svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = "34em";
  bricks.forEach(b => { const P = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]]; ar6Poly0(svg, m, P, { fill: "#F3DCC8", stroke: "#9A6B3E", w: 2.6 }); const C = m([b.x + b.w / 2, -.5]); svg.append(txt(C[0], C[1] + 2, `${word} ${b.name}`, 18)); });
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
  const test = () => { if (units.every(u => full(0, u) && full(1, u))) { fin = true; ar6Finish(body, api, opt, units.map(u => `${u.name} 가${S[u.id][0].length} 나${S[u.id][1].length}`).join(" / "), `세 가지 단위 모양으로 ${word} 가와 나를 모두 채워 보았어요.`, { d0: S.d[0].length, d1: S.d[1].length }); } };
  dragOn(svg, p => { put(p); return !fin; }, p => put(p));
  const tabs = h("div", { class: "tools" }, h("span", {}, "단위 모양:"), units.map(u => h("button", { class: u === cu ? "on" : "", onclick: e => { cu = u; [...tabs.querySelectorAll("button.u")].forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); vb.style.display = u.id === "d" ? "" : "none"; draw(); } }, u.name)));
  [...tabs.querySelectorAll("button")].forEach(b => b.classList.add("u"));
  const vb = h("button", { style: "display:none", onclick: e => { vert = !vert; e.currentTarget.textContent = vert ? "▯ 세로로 놓기" : "▭ 가로로 놓기"; } }, "▭ 가로로 놓기");
  tabs.append(vb);
  api.provide({ words: ["빈틈", "단위", "정사각형"], answers: [] });
  body.append(h("p", { class: "ar6small" }, `단위 모양을 고르고 ${word} 위를 누르거나 문질러 겹치지 않게 놓아요. 직사각형은 가로·세로를 바꾸어 가며 될 수 있는 대로 많이, 더 놓을 자리가 없을 때까지 채워요. 세 가지 단위를 모두 해 봐요.`), tabs, svg, read, tblHost,
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
  /* 다 하면 ar6Finish → (물음이 있으면 ar6Ask →) api.done( 으로 계단을 통과해요. */
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
  body.append(...(opt.tip ? [h("p", { class: "ar6small" }, opt.tip)] : []), taskTxt, svg, read, h("div", { class: "tools" }, h("button", { onclick: () => { pts = []; drawCur(); } }, "다시 그리기")));
}

/* =========================================================
   9. 꿈의 교실 설계도 — 설계도 곳곳을 눌러 도형 찾기 (이야기 버전에서 새로 만듦, 앞글자 ar6s)
   ========================================================= */
const AR6S_PLACES = [
  { id: "fence", name: "텃밭 울타리", shape: "정사각형", what: "둘레", no: "2차시" },
  { id: "hex", name: "꽃밭 테두리", shape: "정육각형", what: "둘레", no: "2차시" },
  { id: "board", name: "게시판 테두리", shape: "직사각형", what: "둘레", no: "3차시" },
  { id: "tile", name: "바닥 타일 견본", shape: "정사각형", what: "넓이 비교(1 cm²)", no: "4차시" },
  { id: "tag", name: "사물함 이름표", shape: "직사각형", what: "넓이", no: "5차시" },
  { id: "floor", name: "교실 바닥", shape: "직사각형", what: "넓은 곳의 넓이(1 m²)", no: "6차시" },
  { id: "map", name: "우리 마을 지도", shape: "직사각형", what: "아주 넓은 곳의 넓이(1 km²)", no: "6차시" },
  { id: "rug", name: "독서 러그", shape: "평행사변형", what: "넓이", no: "7차시" },
  { id: "flag", name: "깃발 가랜드", shape: "삼각형", what: "넓이", no: "8차시" },
  { id: "win", name: "창문 장식", shape: "마름모", what: "넓이", no: "9차시" },
  { id: "bed", name: "화단", shape: "사다리꼴", what: "넓이", no: "10차시" }];
/* 설계도 그림: tap이 있으면 곳곳을 누를 수 있어요 */
function ar6sPlanSvg(tap) {
  const W = 640, H = 430, svg = makeSvg(W, H); svg.setAttribute("class", "ar6fig"); svg.style.maxWidth = "40em";
  const parts = {};
  const add = (id, el) => { if (tap) { el.classList.add("ar6hit"); el.addEventListener("click", e => { e.stopPropagation(); tap(id); }); } svg.append(el); (parts[id] = parts[id] || []).push(el); return el; };
  const P = (pts, f, s, w) => svgEl("polygon", { points: pts.map(p => p.join(",")).join(" "), fill: f, stroke: s || AR6.ink, "stroke-width": w || 2, "stroke-linejoin": "round" });
  const T = (x, y, t, z, c) => svg.append(txt(x, y, t, z || 14, { fill: c || "#5E5345", "pointer-events": "none" }));
  svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "#F7F4EC" }));
  T(320, 22, "5학년 2반 꿈의 교실 설계도", 18, "#2F6B57");
  // 교실 바닥
  add("floor", svgEl("rect", { x: 16, y: 40, width: 330, height: 374, fill: "#F6E1B8", stroke: AR6.ink, "stroke-width": 2.5 }));
  T(296, 400, "교실 바닥", 13, "#8A6A2A");
  // 깃발 가랜드(삼각형)
  svg.append(svgEl("line", { x1: 36, y1: 58, x2: 326, y2: 58, stroke: "#8795A1", "stroke-width": 2, "pointer-events": "none" }));
  const fg = svgEl("g"); for (let i = 0; i < 7; i++) { const x = 44 + i * 40; fg.append(P([[x, 58], [x + 28, 58], [x + 14, 86]], ["#F6A6A6", "#FFE08A", "#A8D8F0"][i % 3], "#8C5A5A", 1.5)); } add("flag", fg);
  // 게시판(직사각형)
  add("board", svgEl("rect", { x: 104, y: 98, width: 136, height: 66, fill: "#CFE6C8", stroke: AR6.green, "stroke-width": 3.5 }));
  T(172, 131, "게시판", 14, "#2F6B57");
  // 우리 마을 지도
  const mg = svgEl("g"); mg.append(svgEl("rect", { x: 256, y: 98, width: 72, height: 66, fill: "#E8F1FB", stroke: AR6.blue, "stroke-width": 2.5 }));
  [[256, 128, 328, 120], [286, 98, 296, 164], [256, 150, 328, 156]].forEach(([a, b, c, d]) => mg.append(svgEl("line", { x1: a, y1: b, x2: c, y2: d, stroke: "#9DB4C9", "stroke-width": 3 })));
  mg.append(svgEl("circle", { cx: 312, cy: 140, r: 5, fill: AR6.red })); add("map", mg);
  T(292, 178, "마을 지도", 12, "#40576B");
  // 사물함 + 이름표
  svg.append(svgEl("rect", { x: 104, y: 196, width: 224, height: 64, fill: "#E6D9C6", stroke: "#8C7A5E", "stroke-width": 2 }));
  for (let i = 1; i < 6; i++) svg.append(svgEl("line", { x1: 104 + i * 224 / 6, y1: 196, x2: 104 + i * 224 / 6, y2: 260, stroke: "#8C7A5E", "stroke-width": 1.5, "pointer-events": "none" }));
  const tg = svgEl("g"); for (let i = 0; i < 6; i++) tg.append(svgEl("rect", { x: 104 + i * 224 / 6 + 7, y: 204, width: 23, height: 11, fill: "#FFF1C7", stroke: "#B08A1E", "stroke-width": 1.2 })); add("tag", tg);
  T(216, 274, "사물함", 12, "#8C7A5E");
  // 창문 장식(마름모)
  svg.append(svgEl("rect", { x: 16, y: 190, width: 8, height: 100, fill: "#BFD9F5", "pointer-events": "none" }));
  add("win", P([[32, 240], [58, 202], [84, 240], [58, 278]], "#D7ECFA", AR6.blue, 2.5));
  // 독서 러그(평행사변형)
  add("rug", P([[118, 380], [246, 380], [292, 296], [164, 296]], "#F2C1CE", "#C2456A", 2.5));
  T(205, 340, "러그", 14, "#8C3550");
  // 바닥 타일 견본
  const tl = svgEl("g"); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) tl.append(svgEl("rect", { x: 28 + i * 20, y: 316 + j * 20, width: 20, height: 20, fill: (i + j) % 2 ? "#D8C3A5" : "#EFE3CF", stroke: "#9A7B55", "stroke-width": 1 })); add("tile", tl);
  T(58, 388, "타일", 12, "#8A6A2A");
  // 학교 정원
  svg.append(svgEl("rect", { x: 360, y: 40, width: 264, height: 374, fill: "#E3F2D9", stroke: "#6B8E23", "stroke-width": 2.5 }));
  T(492, 60, "학교 정원", 14, "#4A6A1A");
  add("fence", svgEl("rect", { x: 380, y: 80, width: 110, height: 110, fill: "#D9EDB8", stroke: "#9A6B3E", "stroke-width": 6, "stroke-dasharray": "12 5" }));
  T(435, 135, "텃밭", 14, "#4A6A1A");
  const hx = [], cx = 566, cy = 136, r = 44; for (let i = 0; i < 6; i++) { const t = Math.PI / 3 * i; hx.push([ar6R(cx + r * Math.cos(t)), ar6R(cy + r * Math.sin(t))]); }
  add("hex", P(hx, "#F7D6E8", "#B0507E", 4));
  T(566, 137, "꽃밭", 14, "#8C3560");
  add("bed", P([[382, 392], [608, 392], [560, 290], [430, 290]], "#F9D9A8", "#C27A1E", 2.5));
  T(495, 345, "화단", 14, "#8A5A1E");
  return { svg, parts };
}
function ar6sPlanFig() { return h("div", {}, ar6sPlanSvg(null).svg); }
function ar6sPlan(body, api, opt) {
  /* 모두 찾으면 ar6Finish → api.done( 으로 계단을 통과해요. */
  const found = new Set(), list = h("ol", { class: "ar6list" }), read = h("div", { class: "ar6read" }), say = h("div", { class: "ar6box" }, "설계도 곳곳을 눌러 보세요.");
  let fin = false;
  const { svg, parts } = ar6sPlanSvg(id => {
    const pl = AR6S_PLACES.find(p => p.id === id); if (!pl || fin) return;
    say.textContent = `${pl.name} — ${pl.shape} 모양 → ${pl.what} (${pl.no})`;
    (parts[id] || []).forEach(e => e.setAttribute("filter", "drop-shadow(0 0 4px #E47A38)"));
    if (found.has(id)) return; found.add(id);
    list.append(h("li", {}, `${pl.name} — ${pl.shape} · ${pl.what}`));
    read.textContent = `찾은 곳 ${found.size}/${AR6S_PLACES.length}`;
    if (found.size === AR6S_PLACES.length) { fin = true; ar6Finish(body, api, opt, [...found].join(","), "설계도에서 둘레와 넓이를 알아볼 곳을 모두 찾았어요."); }
  });
  api.provide({ words: AR6S_PLACES.map(p => p.shape), answers: [] });
  read.textContent = `찾은 곳 0/${AR6S_PLACES.length}`;
  body.append(svg, say, read, list);
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
  /* 끝나면 ar6Finish → api.done( — 그린 직사각형은 손을 떼고 1.2초 뒤에 저절로 확인해요. */
  let dragging = false;
  const placeKick = autoRun(() => !dragging && !fin && !!mode && !!R, () => JSON.stringify(R) + mode + N + rects.length, () => { place(); return fin; }, 1200);
  ar6DragRect(svg, m, cols, rows, (a, b) => { dragging = true; R = [a, b]; show(R); }, (a, b) => { dragging = false; R = [a, b]; show(R); placeKick(); }, () => !fin && !!mode);
  const place = () => {
    if (!mode || !R) return api.hint(!N ? "먼저 주사위를 던져요." : !mode ? "넓이로 할지 둘레로 할지 먼저 골라요." : "직사각형을 그려요.");
    const x0 = Math.min(R[0][0], R[1][0]), y0 = Math.min(R[0][1], R[1][1]), w = Math.abs(R[1][0] - R[0][0]), hh = Math.abs(R[1][1] - R[0][1]);
    if (!w || !hh) return api.hint("선분이 아니라 직사각형이 되게 끌어요.");
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
  body.append(h("p", { class: "ar6small" }, "직사각형을 그리고 손을 떼면 저절로 확인해요."), h("div", { class: "tools" }, h("button", { onclick: roll }, "🎲 주사위 던지기"), diceBox, bA, bP), info, svg, score);
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
  /* 끝나면 ar6Finish → api.done( — 색칠하고 손을 떼면 1.2초 뒤에 저절로 확인해요. */
  let dragging = false;
  dragOn(svg, p => { if (ti >= tasks.length) return false; const c = at(p); if (!c) return false; dragging = true; addMode = !cells.has(c); addMode ? cells.add(c) : cells.delete(c); paint(); return true; },
    p => { const c = at(p); if (!c) return; addMode ? cells.add(c) : cells.delete(c); paint(); }, () => { dragging = false; kickP(); });
  const canon = set => {   // 돌리기·뒤집기를 해도 같은 모양이면 같은 글자
    const P = [...set].map(s => s.split(",").map(Number)); const fs = [([x, y]) => [x, y], ([x, y]) => [-x, y], ([x, y]) => [x, -y], ([x, y]) => [-x, -y], ([x, y]) => [y, x], ([x, y]) => [-y, x], ([x, y]) => [y, -x], ([x, y]) => [-y, -x]];
    return fs.map(f => { const Q = P.map(f), mx = Math.min(...Q.map(q => q[0])), my = Math.min(...Q.map(q => q[1])); return Q.map(q => (q[0] - mx) + "," + (q[1] - my)).sort().join(";"); }).sort()[0];
  };
  const connected = set => { const arr = [...set]; if (!arr.length) return false; const seen = new Set([arr[0]]), st = [arr[0]]; while (st.length) { const [x, y] = st.pop().split(",").map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const q = (x + dx) + "," + (y + dy); if (set.has(q) && !seen.has(q)) { seen.add(q); st.push(q); } }); } return seen.size === set.size; };
  const runP = () => {
    if (ti >= tasks.length) return true; const t = tasks[ti]; api.tryOnce();
    if (cells.size !== t.area) { api.fail(`색칠한 칸이 ${cells.size}개예요. 1 cm²가 ${t.area}개가 되게 색칠해요.`, `${cells.size}칸`); return false; }
    if (!connected(cells)) { api.fail("칸들이 변끼리 붙어서 한 도형이 되게 색칠해요.", "떨어진 칸"); return false; }
    if (opt.differ && made.some(c => c === canon(cells))) { api.fail("앞에서 그린 도형과 모양이 같아요(돌리거나 뒤집으면 같아요). 다른 모양으로 그려요.", "같은 모양"); return false; }
    made.push(canon(cells)); cells.clear(); paint(); ti++; setTask(); madeTxt.textContent = `그린 도형 ${made.length}개`;
    if (ti < tasks.length) { api.hint("○ 맞아요! 이어서 모양이 다른 도형도 그려요."); return false; }
    ar6Finish(body, api, opt, `도형 ${made.length}개`, opt.msg || "넓이가 같은 도형을 서로 다른 모양으로 그렸어요.");
    return true;
  };
  const kickP = autoRun(() => !dragging && ti < tasks.length && cells.size >= tasks[ti].area, () => ti + "#" + [...cells].sort().join(";"), runP, 1200);
  api.provide({ words: ["1 cm²", "칸의 수"], answers: [] });
  setTask(); paint();
  body.append(...(opt.tip ? [h("p", { class: "ar6small" }, opt.tip)] : []), taskTxt, svg, read, madeTxt, h("div", { class: "tools" }, h("button", { onclick: () => { cells.clear(); paint(); } }, "모두 지우기")));
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
