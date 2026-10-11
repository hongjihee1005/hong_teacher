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
const UNIT_STORY = { title: "우리 반 꿈의 교실 설계도", lines: [
  "푸른숲초등학교 5학년 2반이 ‘꿈의 교실 공모전’에 나가요. 설계 대장 지안, 계산 담당 도현, 그림 담당 서아, 질문 대장 유찬이가 교실과 학교 정원을 새로 꾸밀 설계도를 그려요.",
  "텃밭 울타리와 꽃밭 테두리의 둘레를 재고, 바닥 타일을 1 cm²로 세고, 교실 바닥은 m², 우리 마을 지도는 km²로 나타내요. 평행사변형 러그, 삼각형 깃발, 마름모 창문 장식, 사다리꼴 화단을 잘라 옮기고 붙여서 넓이를 구하는 방법을 스스로 찾아요.",
  "넓이와 둘레를 견주어 꿈의 정원을 설계하고, 직사각형 보물 탐험대 놀이와 설계도 발표회로 공모전 준비를 마무리해요."],
  one: "우리 반 꿈의 교실 설계도 · 교실과 학교 정원을 꾸미며 다각형의 둘레와 넓이를 구하는 방법을 찾아요." };
const UNIT_KEYWORDS = ["둘레", "정다각형의 둘레", "넓이", "1 cm²(1 제곱센티미터)", "1 m²(1 제곱미터)", "1 km²(1 제곱킬로미터)", "가로", "세로", "밑변", "높이", "윗변", "아랫변", "대각선", "(가로)×(세로)", "(밑변의 길이)×(높이)", "(밑변의 길이)×(높이)÷2", "(한 대각선)×(다른 대각선)÷2", "(윗변+아랫변)×(높이)÷2"];

/* ---- 그림 자료(모두 cm 모눈 좌표) ---- */
const AR6_RECT = (x, y, w, hh) => [[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]];
const AR6S_RUG = [[1, 5], [7, 5], [11, 1], [5, 1]];          // 7차시 독서 러그: 밑변 6 cm, 높이 4 cm (1 cm² 20개 + 반 칸 8개)
const AR6S_TRI = [[1, 5], [7, 5], [5, 1]];                   // 8차시 깃발: 밑변 6 cm, 높이 4 cm
const AR6S_TRI_TOP = [[5, 1], [3, 3], [6, 3]], AR6S_TRI_BOT = [[3, 3], [6, 3], [7, 5], [1, 5]];
const AR6S_RH = [[1, 4], [5, 1], [9, 4], [5, 7]];            // 9차시 창문 장식: 대각선 8 cm, 6 cm (한 변 5 cm)
const AR6S_TZ = [[1, 5], [8, 5], [6, 1], [3, 1]];            // 10차시 화단: 윗변 3 cm, 아랫변 7 cm, 높이 4 cm
const AR6S_TZ_TOP = [[3, 1], [6, 1], [7, 3], [2, 3]], AR6S_TZ_BOT = [[2, 3], [7, 3], [8, 5], [1, 5]];
const AR6S_RTZ = [[1, 1], [4, 1], [8, 5], [1, 5]];           // 10차시 여러 방법: 윗변 3, 아랫변 7, 높이 4
const AR6S_CORNERS = [[[1, 1], [5, 1], [1, 4]], [[5, 1], [9, 1], [9, 4]], [[9, 4], [9, 7], [5, 7]], [[1, 4], [5, 7], [1, 7]]];
const AR6S_CMID = [[3, 2.5], [7, 2.5], [7, 5.5], [3, 5.5]];  // 귀퉁이 삼각형의 긴 변 가운데 → 그 점을 중심으로 반 바퀴 돌리면 마름모 안으로
/* 평행선 사이의 거리(4학년 떠올리기) */
function ar6sParLines() {
  return ar6Static({ cols: 10, rows: 4, k: 30, grid: false,
    segs: [{ a: [0, .5], b: [10, .5], color: AR6.ink, w: 2.5 }, { a: [0, 3.5], b: [10, 3.5], color: AR6.ink, w: 2.5 }, { a: [2, .5], b: [2, 3.5], color: AR6.blue }, { a: [4, .5], b: [6, 3.5], color: AR6.org }, { a: [9, .5], b: [8, 3.5], color: AR6.green }],
    rights: [{ F: [2, 3.5], u: [1, 0], v: [0, -1], color: AR6.blue }],
    texts: [{ p: [2.5, 2], t: "㉠", color: AR6.blue }, { p: [5.6, 2], t: "㉡", color: AR6.org }, { p: [9.1, 2], t: "㉢", color: AR6.green }], maxW: "24em" });
}

const LESSONS = [
{
  id: "s1", no: 1, title: "꿈의 교실 설계도를 그려요", soop: "개념 찾기(S)",
  question: "우리 반 꿈의 교실 설계도에서 둘레와 넓이를 알아야 하는 곳은 어디일까요?",
  summary: "5학년 2반은 ‘꿈의 교실 공모전’에 낼 교실과 학교 정원 설계도를 그렸어요. 울타리나 테두리처럼 한 바퀴 돈 길이가 필요한 곳은 둘레를, 타일이나 러그처럼 바닥을 덮는 크기가 필요한 곳은 넓이를 알아야 해요. 이 단원에서는 정다각형과 사각형의 둘레, 넓이의 단위, 여러 가지 다각형의 넓이를 구하는 방법을 알아봐요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "푸른숲초등학교 5학년 2반이 ‘꿈의 교실 공모전’에 나가기로 했어요. 설계 대장 지안이가 교실과 학교 정원을 새로 꾸민 설계도를 칠판에 붙였어요. 설계도를 보고 떠오르는 것을 세 칸에 써서 붙여요.", hints: ["텃밭, 꽃밭, 게시판, 러그, 깃발, 창문 장식, 화단이 어떤 모양인지 살펴봐요.", "울타리를 치거나 바닥을 덮으려면 무엇을 알아야 할지 생각해 봐요."],
      render: (b, a) => { b.append(ar6sPlanFig()); panes(b, a, [
        { t: "보여요", e: "👀", ph: "설계도에서 ~이 보여요", hint: "설계도에서 보이는 도형", ex: ["정원에 정육각형 모양의 꽃밭이 있어요.", "교실 바닥에 평행사변형 모양의 러그가 깔려 있어요."] },
        { t: "생각해요", e: "💭", ph: "~을 하려면 ~을 알아야 해요", hint: "둘레나 넓이가 필요한 까닭", ex: ["텃밭에 울타리를 치려면 울타리가 몇 m 필요한지 알아야 해요.", "러그를 만들려면 천이 얼마나 넓어야 하는지 알아야 해요."] },
        { t: "궁금해요", e: "❓", ph: "~의 넓이(둘레)는 어떻게 구할까?", hint: "둘레와 넓이에 대해 궁금한 것", ex: ["사다리꼴 모양 화단의 넓이는 어떻게 구할까?", "삼각형 깃발 하나를 만드는 데 천이 얼마나 필요할까?"] }],
        { ok: "설계도 곳곳에 둘레와 넓이를 알아야 하는 곳이 있어요! 이 단원에서 하나씩 구해 봐요." }); } },
    { name: "그려 보기 — 설계도 속 도형 찾기", inst: "설계도 곳곳을 눌러 어떤 도형이 있고, 무엇을 알아봐야 하는지 모두 찾아보세요.", hints: ["교실에 8곳, 학교 정원에 3곳이 있어요.", "깃발, 사물함 이름표, 타일 견본, 마을 지도도 눌러 봐요."],
      render: (b, a) => ar6sPlan(b, a, { ok: "설계도에서 정사각형, 정육각형, 직사각형, 평행사변형, 삼각형, 마름모, 사다리꼴을 찾았어요. 차례로 둘레와 넓이를 구해 봐요." }) },
    { name: "말해 보기 — 둘레일까, 넓이일까", inst: "계산 담당 도현이가 설계도를 보며 할 일을 적었어요. 둘레와 넓이 중 무엇을 알아야 하는지 골라 보세요.", hints: ["테두리를 한 바퀴 도는 길이가 필요하면 둘레예요.", "평면을 빈틈없이 덮는 크기가 필요하면 넓이예요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "정사각형 텃밭에 울타리를 치려고 해요.", o: ["둘레", "넓이"], a: 0, why: { "1": "울타리는 텃밭 가장자리를 한 바퀴 둘러요." } },
        { q: "교실 바닥에 새 타일을 빈틈없이 깔려고 해요.", o: ["둘레", "넓이"], a: 1, why: { "0": "타일은 바닥 전체를 덮어요." } },
        { q: "게시판 가장자리에 리본을 두르려고 해요.", o: ["둘레", "넓이"], a: 0, why: { "1": "리본은 게시판 가장자리를 한 바퀴 둘러요." } },
        { q: "평행사변형 러그를 만들 천의 크기를 알아보려고 해요.", o: ["둘레", "넓이"], a: 1, why: { "0": "천은 러그 전체를 덮어야 해요." } }],
        { ok: "울타리와 리본은 둘레, 타일과 천은 넓이를 알아야 해요." }),
        { q: "게시판에 리본을 두를 때 넓이가 아니라 둘레를 알아야 하는 까닭을 써 볼까요?", ph: "리본은 게시판의 ~", help: ["① 리본을 게시판의 어디에 두르는지 떠올려요. → ② 둘레와 넓이의 뜻과 견주어 써요.", "‘리본은 게시판의 ~을 한 바퀴 두르므로 ~을 알아야 해요.’ 꼴로 써요."], ans: "리본은 게시판의 가장자리를 한 바퀴 두르므로, 테두리를 한 바퀴 돈 길이인 둘레를 알아야 해요." }) },
    { name: "약속하기 — 4학년 때 배운 도형", inst: "그림 담당 서아가 설계도를 그리기 전에 4학년 때 배운 것을 떠올렸어요. 물음에 답해 보세요.", hints: ["평행선 사이의 거리는 평행선에 수직인 선분의 길이예요.", "사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "두 직선은 서로 평행해요. 평행선 사이의 거리를 나타내는 선분은 어느 것일까요?", fig: ar6sParLines, o: ["㉠", "㉡", "㉢"], a: 0, why: { "1": "평행선 사이의 거리는 평행선에 수직인 선분의 길이예요.", "2": "평행선 사이의 거리는 평행선에 수직인 선분의 길이예요." } },
        { q: "마주 보는 두 쌍의 변이 서로 평행한 사각형은 무엇일까요?", o: ["사다리꼴", "평행사변형", "삼각형"], a: 1, why: { "0": "사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이에요." } },
        { q: "평행한 변이 한 쌍이라도 있는 사각형은 무엇일까요?", o: ["사다리꼴", "마름모", "정사각형"], a: 0, why: { "1": "마름모는 네 변의 길이가 모두 같은 사각형이에요.", "2": "정사각형은 네 변의 길이가 같고 네 각이 모두 직각인 사각형이에요." } },
        { q: "변의 길이가 모두 같고 각의 크기가 모두 같은 다각형은 무엇일까요?", o: ["정다각형", "대각선", "직사각형"], a: 0 }],
        { ok: "평행선 사이의 거리, 평행사변형, 사다리꼴, 정다각형을 기억하면 이 단원을 공부하기 좋아요." }) },
    { name: "확인하기 — 무엇을 배울까요", inst: "이 단원에서 배울 내용이에요. 배우는 순서대로 눌러 보세요.", hints: ["둘레를 먼저 배우고, 넓이는 단위부터 배워요.", "직사각형의 넓이를 알아야 다른 도형의 넓이를 구할 수 있어요."],
      render: (b, a) => sequence(b, a, ["평행사변형·삼각형·마름모·사다리꼴의 넓이 구하기", "정다각형과 사각형의 둘레 구하기", "직사각형의 넓이 구하기", "넓이의 단위 1 cm² 알기", "더 큰 넓이의 단위 1 m², 1 km² 알기"], [1, 3, 2, 4, 0],
        { ok: "둘레 → 1 cm² → 직사각형의 넓이 → 1 m²·1 km² → 여러 가지 다각형의 넓이 순서로 설계도를 완성해요." }) }
  ],
  challenge: { inst: "유찬이가 생활 속 상황을 모아 왔어요. 둘레와 넓이 중 무엇을 알아야 하는지 골라 보세요.", hints: ["테두리의 길이가 필요하면 둘레, 평면을 덮는 크기가 필요하면 넓이예요."],
    render: (b, a) => quiz(b, a, [
      { q: "액자 테두리에 금색 테이프를 붙여요.", o: ["둘레", "넓이"], a: 0 },
      { q: "교실 뒷벽에 페인트를 칠해요.", o: ["둘레", "넓이"], a: 1 },
      { q: "운동장 트랙을 한 바퀴 달려요.", o: ["둘레", "넓이"], a: 0 },
      { q: "겨울에 텃밭을 비닐로 덮어요.", o: ["둘레", "넓이"], a: 1 }], { ok: "테두리의 길이는 둘레, 덮는 크기는 넓이예요." }) }
},
{
  id: "s2", no: 2, title: "텃밭 울타리와 꽃밭 테두리 ― 정다각형의 둘레", soop: "개념 구축하기(O)",
  question: "정다각형의 둘레는 어떻게 구할 수 있을까요?",
  summary: "둘레는 도형의 테두리 또는 그 길이예요. 정다각형은 모든 변의 길이가 같으므로 (정다각형의 둘레) = (한 변의 길이) × (변의 수)예요. 한 변이 4 m인 정사각형 텃밭의 둘레는 4×4=16 (m), 한 변이 2 m인 정육각형 꽃밭의 둘레는 2×6=12 (m)예요.",
  steps: [
    { name: "만져 보기 — 텃밭에 울타리 두르기", inst: "지안이가 학교 정원에 한 변이 4 m인 정사각형 텃밭을 설계했어요. 먼저 예상을 쓰고, 텃밭의 변을 하나씩 눌러 울타리 끈을 둘러 보세요.", hints: ["네 변을 모두 눌러 끈을 한 바퀴 둘러요.", "정사각형은 네 변의 길이가 모두 같아요."],
      render: ruleFirst((b, a) => ar6Perim(b, a, { P: [[0, 0], [4, 0], [4, 4], [0, 4]], labels: { 0: "4 m" }, ticks: [1, 1, 1, 1], name: "텃밭", unit: "m",
        ask: [{ q: "둘레는 도형의 테두리 또는 그 길이를 뜻해요.", parts: ["정사각형의 변은 ", { n: 4 }, "개이고, 네 변의 길이가 ", { o: ["모두 같아요", "모두 달라요"], a: 0 }, ". 그래서 텃밭의 둘레는 4 × ", { n: 4, why: { "2": "정사각형의 변은 4개예요." } }, " = ", { n: 16, why: { "8": "두 변만 더한 길이예요. 변이 4개예요.", "20": "4×4를 다시 계산해 봐요." } }, " (m)예요."] }],
        ok: "정사각형은 네 변의 길이가 모두 같으니까 둘레는 한 변의 길이를 4배 하면 돼요. 4×4=16 (m)예요." }),
        { q: "정사각형 텃밭의 둘레를 빠르게 구하는 방법을 예상해 봐요.", ph: "내 예상: 한 변의 길이를 ~", help: ["① 정사각형의 네 변의 길이가 어떤지 떠올려요. → ② 같은 수를 여러 번 더하는 것을 더 빠르게 나타내 봐요.", "‘내 예상: 한 변의 길이를 ~번 더하면 되니까 (한 변의 길이)×~로 구해요.’ 꼴로 써요."], ans: "정사각형은 네 변의 길이가 모두 같으므로 둘레는 한 변의 길이를 4번 더한 것, 곧 (한 변의 길이)×4예요. 텃밭은 4×4=16 (m)예요." }) },
    { name: "그려 보기 — 정삼각형과 정육각형 꽃밭", inst: "서아는 꽃밭을 한 변이 2 m인 정삼각형으로 할지, 정육각형으로 할지 고민 중이에요. 두 꽃밭에 끈을 둘러 보고 표를 완성해 보세요.", hints: ["변을 하나씩 눌러 끈을 둘러요.", "둘레는 한 변의 길이에 변의 수를 곱한 것과 같아요."],
      render: (b, a) => ar6Chain(b, a, [
        { title: "① 정삼각형 꽃밭", run: (bx, ax) => ar6Perim(bx, ax, { P: ar6Reg(3, 2), labels: { 2: "2 m" }, ticks: [1, 1, 1], unit: "m", ok: "정삼각형 꽃밭의 둘레는 2+2+2=6 (m)예요." }) },
        { title: "② 정육각형 꽃밭", run: (bx, ax) => ar6Perim(bx, ax, { P: ar6Reg(6, 2), labels: { 5: "2 m" }, ticks: [1, 1, 1, 1, 1, 1], unit: "m", fill: AR6.f6,
          ask: [{ q: "표를 완성해 보세요. (모두 한 변이 2 m예요.)", parts: ["정삼각형 — 변의 수 ", { n: 3 }, "개, 둘레 ", { n: 6 }, " m", h("br"), "정사각형 — 변의 수 ", { n: 4 }, "개, 둘레 ", { n: 8 }, " m", h("br"), "정육각형 — 변의 수 ", { n: 6 }, "개, 둘레 ", { n: 12, why: { "8": "한 변의 길이와 변의 수를 더하지 말고 곱해요.", "10": "정육각형의 변은 6개예요. 2×6을 다시 계산해 봐요." } }, " m"] }],
          ok: "정삼각형 6 m, 정사각형 8 m, 정육각형 12 m예요. 둘레는 한 변의 길이에 변의 수를 곱한 것과 같아요." }) }]) },
    { name: "말해 보기 — 더하기 대신 곱하기", inst: "정다각형의 둘레를 빠르게 구하는 방법을 말해 보세요.", hints: ["정다각형은 모든 변의 길이가 같아요.", "같은 수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요."],
      render: thenWhy((b, a) => blanks(b, a, ["정다각형은 ", { o: ["모든 변의 길이가 같아서", "모든 변의 길이가 달라서"], a: 0 }, " 변의 길이를 하나하나 더하지 않고 ", { o: ["한 변의 길이에 변의 수를 곱하여", "변의 수끼리 더하여"], a: 0 }, " 둘레를 구할 수 있어요. 정육각형 꽃밭의 둘레 2+2+2+2+2+2는 ", { o: ["2×6", "2+6", "6×6"], a: 0 }, "과 같아요."],
        { ok: "정다각형은 모든 변의 길이가 같아서 한 변의 길이에 변의 수를 곱하면 둘레가 돼요." }),
        { q: "유찬이는 정육각형 꽃밭의 둘레를 2+6=8 (m)이라고 했어요. 무엇을 잘못했는지 써 볼까요?", ph: "유찬이는 ~와 ~를 더했어요. ~", help: ["① 유찬이가 어떤 두 수를 더했는지 찾아요. → ② 2 m인 변이 몇 개 있는지 생각해 바르게 고쳐요.", "‘한 변의 길이와 변의 수를 더했어요. 2 m인 변이 ~개이므로 ~×~=~ (m)예요.’ 꼴로 써요."], ans: "한 변의 길이와 변의 수를 더했어요. 2 m인 변이 6개 있으므로 2를 6번 더한 2×6=12 (m)가 꽃밭의 둘레예요." }) },
    { name: "약속하기 — 정다각형의 둘레", inst: "정다각형의 둘레를 구하는 식을 완성해 보세요.", hints: ["표에서 둘레가 어떻게 나왔는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["(정다각형의 둘레) = (", { o: ["한 변의 길이", "둘레", "넓이"], a: 0 }, ") × (", { o: ["변의 수", "대각선의 수", "한 변의 길이"], a: 0 }, ")"],
        { ok: "(정다각형의 둘레) = (한 변의 길이) × (변의 수)예요." }) },
    { name: "확인하기 — 교실 속 정다각형", inst: "교실에서 찾은 정다각형 물건의 둘레를 구해 보세요.", hints: ["정오각형의 변은 5개, 정팔각형의 변은 8개예요.", "둘레를 알면 (한 변의 길이) = (둘레) ÷ (변의 수)예요."],
      render: (b, a) => ar6Ask(b, a, [
        { fig: () => ar6RegFig([{ n: 5, side: 6, lab: "6 cm", name: "정오각형 화분 받침" }, { n: 8, side: 5, lab: "5 cm", name: "정팔각형 시계", fill: AR6.f2 }]),
          parts: ["정오각형 화분 받침의 둘레: 6 × ", { n: 5, why: { "6": "정오각형의 변은 5개예요." } }, " = ", { n: 30, why: { "11": "변의 길이와 변의 수를 더하지 말고 곱해요." } }, " (cm)", h("br"), "정팔각형 시계의 둘레: 5 × ", { n: 8 }, " = ", { n: 40, why: { "13": "변의 길이와 변의 수를 더하지 말고 곱해요." } }, " (cm)"] },
        { q: "둘레가 42 cm인 정칠각형 모양 컵받침의 한 변의 길이는 몇 cm일까요?", parts: [{ n: 6, why: { "294": "둘레를 변의 수로 나누어야 해요. 42÷7을 계산해요.", "35": "42에서 7을 빼지 말고 42÷7을 계산해요." } }, " cm"] }],
        { ok: "화분 받침 6×5=30 (cm), 시계 5×8=40 (cm), 컵받침의 한 변은 42÷7=6 (cm)예요." }) }
  ],
  challenge: { inst: "정원 설계 회의에서 나온 문제예요. 정다각형의 둘레를 이용해 보세요.", hints: ["(정다각형의 둘레) = (한 변의 길이) × (변의 수)", "둘레를 알면 (한 변의 길이) = (둘레) ÷ (변의 수)예요."],
    render: (b, a) => ar6Ask(b, a, [
      { q: "울타리 36 m를 모두 써서 정사각형 텃밭을 만들면 한 변은 몇 m일까요?", parts: [{ n: 9, why: { "32": "36에서 4를 빼지 말고 36÷4를 계산해요.", "144": "둘레를 변의 수로 나누어야 해요." } }, " m"] },
      { q: "한 변이 15 cm인 정삼각형 깃발 3장의 테두리에 리본을 두르면 리본은 모두 몇 cm 필요할까요?", parts: [{ n: 135, why: { "45": "45 cm는 깃발 한 장의 둘레예요. 깃발이 3장이에요." } }, " cm"] },
      { q: "둘레가 가장 긴 것은?  ㉠ 한 변이 9 cm인 정육각형  ㉡ 한 변이 11 cm인 정오각형  ㉢ 한 변이 7 cm인 정팔각형", parts: ["㉠ ", { n: 54 }, " cm, ㉡ ", { n: 55 }, " cm, ㉢ ", { n: 56 }, " cm → ", { o: ["㉠", "㉡", "㉢"], a: 2 }] }],
      { ok: "텃밭의 한 변은 9 m, 리본은 15×3×3=135 (cm), 둘레는 ㉠ 54 cm, ㉡ 55 cm, ㉢ 56 cm로 ㉢이 가장 길어요." }) }
},
{
  id: "s3", no: 3, title: "게시판·러그·창문 테두리 ― 사각형의 둘레", soop: "개념 구축하기(O)",
  question: "직사각형, 평행사변형, 마름모의 둘레는 어떻게 구할 수 있을까요?",
  summary: "직사각형과 평행사변형은 마주 보는 두 변의 길이가 같아서 (직사각형의 둘레) = (가로+세로)×2, (평행사변형의 둘레) = (한 변의 길이+이웃한 변의 길이)×2로 구해요. 마름모는 네 변의 길이가 모두 같아서 (마름모의 둘레) = (한 변의 길이)×4예요.",
  steps: [
    { name: "만져 보기 — 게시판 테두리 리본", inst: "서아가 직사각형 게시판 설계도(가로 9 cm, 세로 6 cm)의 테두리에 리본을 두르려고 해요. 변을 하나씩 눌러 끈을 두르고, 서아와 도현이가 둘레를 구한 방법을 살펴보세요. 직사각형에서 가로의 길이를 가로, 세로의 길이를 세로라고 부르기도 해요.", hints: ["마주 보는 두 변의 길이가 같아요.", "가로와 세로를 각각 2배 해서 더하거나, 가로와 세로를 더한 다음 2배 해요."],
      render: thenWhy((b, a) => ar6Perim(b, a, { P: AR6_RECT(0, 0, 9, 6), labels: { 0: "9 cm", 1: "6 cm" }, ticks: [1, 2, 1, 2], name: "게시판",
        ask: [{ parts: ["직사각형은 마주 보는 두 변의 길이가 ", { o: ["같아요", "달라요"], a: 0 }, "."] },
          { q: "서아와 도현이는 둘레를 서로 다르게 구했어요.", parts: ["서아: 9 × 2 + 6 × 2 = ", { n: 30 }, " (cm)", h("br"), "도현: (9 + 6) × 2 = ", { n: 30, why: { "15": "가로와 세로를 더한 15에 2를 곱해야 해요.", "54": "가로와 세로를 곱하지 말고 더한 다음 2배 해요." } }, " (cm)"] }],
        ok: "게시판의 둘레는 9×2+6×2=30 (cm), (9+6)×2=30 (cm)예요." }),
        { q: "도현이처럼 (가로+세로)×2로 둘레를 구할 수 있는 까닭을 써 볼까요?", ph: "직사각형은 ~이 2개씩 있어서 ~", help: ["① 직사각형에서 길이가 같은 변이 몇 개씩 있는지 세어요. → ② 가로 하나와 세로 하나를 더한 길이가 몇 번 있는지 생각해요.", "‘직사각형은 가로와 세로가 2개씩 있어서 (가로+세로)가 ~번 있는 것과 같아요.’ 꼴로 써요."], ans: "직사각형은 마주 보는 두 변의 길이가 같아서 가로와 세로가 2개씩 있어요. 그래서 둘레는 가로 하나와 세로 하나를 더한 (가로+세로)를 2번 더한 것과 같아요." }) },
    { name: "그려 보기 — 평행사변형 러그 테두리", inst: "독서 공간에 깔 평행사변형 러그 설계도예요(한 변 7 cm, 이웃한 변 5 cm). 테두리에 술을 달려고 해요. 끈을 둘러 둘레를 구해 보세요.", hints: ["평행사변형도 마주 보는 두 변의 길이가 같아요.", "(한 변의 길이 + 이웃한 변의 길이) × 2"],
      render: (b, a) => ar6Perim(b, a, { P: [[0, 4], [7, 4], [10, 0], [3, 0]], labels: { 0: "7 cm", 1: "5 cm" }, ticks: [1, 2, 1, 2], fill: AR6.f6, name: "러그",
        ask: [{ parts: ["평행사변형은 마주 보는 두 변의 길이가 ", { o: ["같아요", "달라요"], a: 0 }, ". 둘레: (7 + 5) × 2 = ", { n: 24, why: { "12": "7과 5를 더한 12에 2를 곱해야 해요.", "35": "곱하지 말고 한 변과 이웃한 변의 길이를 더한 다음 2배 해요." } }, " (cm)"] }],
        ok: "평행사변형 러그의 둘레는 (7+5)×2=24 (cm)예요." }) },
    { name: "말해 보기 — 마름모 창문 장식 테두리", inst: "창문에 붙일 마름모 장식(한 변 13 cm)의 테두리에 반짝이 띠를 두르려고 해요. 끈을 둘러 둘레를 구해 보세요.", hints: ["마름모는 네 변의 길이가 모두 같아요.", "한 변의 길이를 4배 해요."],
      render: thenWhy((b, a) => ar6Perim(b, a, { P: [[0, 5], [12, 0], [24, 5], [12, 10]], labels: { 0: "13 cm" }, ticks: [1, 1, 1, 1], fill: AR6.f1, name: "창문 장식",
        ask: [{ parts: ["마름모는 네 변의 길이가 ", { o: ["모두 같아요", "모두 달라요"], a: 0 }, ". 둘레: 13 × ", { n: 4 }, " = ", { n: 52, why: { "17": "13과 4를 더하지 말고 곱해요.", "26": "두 변만 더한 길이예요. 변이 4개예요." } }, " (cm)"] }],
        ok: "마름모 창문 장식의 둘레는 13×4=52 (cm)예요." }),
        { q: "마름모의 둘레를 (한 변의 길이)×4로 구할 수 있는 까닭을 써 볼까요?", ph: "마름모는 ~", help: ["① 마름모의 네 변의 길이가 어떤지 떠올려요. → ② 같은 길이를 몇 번 더하는지 써요.", "‘마름모는 네 변의 길이가 ~하므로 한 변의 길이를 ~번 더한 것과 같아요.’ 꼴로 써요."], ans: "마름모는 네 변의 길이가 모두 같으므로 둘레는 한 변의 길이를 4번 더한 것과 같아요. 그래서 13×4=52 (cm)예요." }) },
    { name: "약속하기 — 사각형의 둘레", inst: "사각형의 둘레를 구하는 식을 완성해 보세요.", hints: ["직사각형과 평행사변형은 마주 보는 두 변의 길이가 같아요.", "마름모는 네 변의 길이가 모두 같아요."],
      render: (b, a) => blanks(b, a, ["(직사각형의 둘레) = (가로) × 2 + (세로) × 2 = (가로 + ", { o: ["세로", "가로", "둘레"], a: 0 }, ") × ", { o: ["2", "4"], a: 0 }, " / (평행사변형의 둘레) = (한 변의 길이 + ", { o: ["이웃한 변의 길이", "높이"], a: 0 }, ") × 2 / (마름모의 둘레) = (한 변의 길이) × ", { o: ["4", "2"], a: 0 }],
        { ok: "직사각형 (가로+세로)×2, 평행사변형 (한 변+이웃한 변)×2, 마름모 (한 변)×4예요." }) },
    { name: "확인하기 — 둘레가 정해진 게시판", inst: "모눈 한 칸은 1 cm예요. 파란 선분을 한 변으로 하여 둘레가 18 cm인 직사각형 게시판을 그려 보세요. 그린 뒤 손을 떼면 저절로 확인해요.", hints: ["둘레가 18 cm이면 가로와 세로의 합은 18÷2=9 (cm)예요.", "파란 선분이 5 cm이니까 다른 변은 9−5=4 (cm)예요."],
      render: (b, a) => ar6Rect(b, a, { cols: 10, rows: 7, given: [1, 2, 5], tasks: [{ given: [1, 2, 5], perim: 18, label: "파란 선분을 한 변으로 하여 둘레가 18 cm인 직사각형을 그려요." }],
        ask: [{ q: "이웃한 두 변이 12 cm, 9 cm인 평행사변형 러그의 둘레", parts: ["(12 + ", { n: 9 }, ") × ", { n: 2 }, " = ", { n: 42, why: { "21": "21에 2를 곱해야 해요." } }, " (cm)"] },
          { q: "둘레가 50 cm인 직사각형 게시판의 가로가 15 cm예요. 세로는 몇 cm일까요?", parts: [{ n: 10, why: { "35": "둘레는 (가로+세로)×2예요. 50÷2=25에서 15를 빼요.", "20": "둘레는 (가로+세로)×2예요. 50÷2=25에서 15를 빼요." } }, " cm"] }],
        ok: "파란 선분 5 cm와 4 cm로 둘레가 18 cm인 게시판을 그렸어요. 러그의 둘레는 42 cm, 게시판의 세로는 10 cm예요." }) }
  ],
  challenge: { inst: "설계 회의에서 도현이가 낸 문제예요. 사각형의 둘레를 이용해 보세요.", hints: ["직사각형: (가로+세로)×2, 마름모: (한 변)×4", "가로와 세로의 합은 둘레의 반이에요."],
    render: (b, a) => ar6Ask(b, a, [
      { q: "가로 16 cm, 세로 10 cm인 직사각형 게시판과 한 변이 13 cm인 마름모 창문 장식의 둘레를 비교해요.", parts: ["게시판 ", { n: 52 }, " cm, 창문 장식 ", { n: 52 }, " cm → ", { o: ["게시판이 더 길어요", "창문 장식이 더 길어요", "둘레가 같아요"], a: 2 }] },
      { q: "둘레가 60 cm인 마름모의 한 변은 몇 cm일까요?", parts: [{ n: 15, why: { "30": "마름모는 네 변의 길이가 같아요. 60÷4를 계산해요." } }, " cm"] },
      { q: "가로가 세로보다 4 cm 더 긴 직사각형의 둘레가 32 cm예요. 가로는 몇 cm일까요?", parts: [{ n: 10, why: { "16": "16 cm는 가로와 세로의 합이에요.", "6": "6 cm는 세로예요. 가로는 세로보다 4 cm 더 길어요." } }, " cm"] }],
      { ok: "게시판 (16+10)×2=52 (cm), 창문 장식 13×4=52 (cm)로 같아요. 마름모의 한 변은 15 cm, 가로는 10 cm(세로 6 cm)예요." }) }
},
{
  id: "s4", no: 4, title: "어떤 타일이 더 넓을까 ― 1 cm²", soop: "개념 구축하기(O)",
  question: "넓이를 정확하게 비교하고 나타내려면 어떤 단위를 쓰면 좋을까요?",
  summary: "직접 대어 보거나 여러 가지 모양을 단위로 사용하면 빈틈이 생기거나 단위에 따라 개수가 달라져 넓이를 정확히 비교하기 어려워요. 넓이의 단위로 한 변의 길이가 1 cm인 정사각형의 넓이를 사용할 수 있어요. 이 넓이를 1 cm²라 쓰고, 1 제곱센티미터라고 읽어요. 1 cm²가 8개이면 1 cm²의 8배이고, 8 cm²예요.",
  steps: [
    { name: "만져 보기 — 타일 견본 겹쳐 보기", inst: "교실 바닥에 깔 타일 견본 가와 나 중에서 더 넓은 것을 고르려고 해요. 타일 나를 끌어 타일 가 위에 왼쪽 모서리를 맞추어 겹쳐 보세요.", hints: ["타일 나를 끌어서 타일 가의 왼쪽 위나 왼쪽 아래 모서리에 맞추어요.", "겹치고 남는 부분을 살펴봐요."],
      render: (b, a) => ar6Cut(b, a, { cols: 12, rows: 5, k: 36, pieces: [
          { P: AR6_RECT(1, 2, 6, 2), fill: "#F3DCC8", stroke: "#9A6B3E", name: "가" },
          { P: AR6_RECT(8, 1, 3, 3), fill: "#BFD9F5", stroke: AR6.blue, move: true, name: "나", op: .6, target: [{ dx: -7, dy: 1 }, { dx: -7, dy: 0 }] }],
        msg: "타일 나를 가 위에 겹쳤어요.",
        ask: [{ parts: ["겹쳐 보니 가는 ", { o: ["오른쪽이", "위나 아래가"], a: 0 }, " 남고, 나는 ", { o: ["위나 아래가", "오른쪽이"], a: 0 }, " 남아요. 직접 대어 보는 것만으로는 어느 타일이 얼마나 더 넓은지 ", { o: ["알기 어려워요", "바로 알 수 있어요"], a: 0 }, "."] }],
        ok: "서로 남는 부분이 있어서 직접 대어 보는 것만으로는 비교하기 어려워요." }) },
    { name: "그려 보기 — 여러 가지 단위로 재기", inst: "여러 가지 모양을 단위로 사용하여 타일 가와 나의 넓이를 비교해 보세요. 세 가지 단위로 모두 채워 보아요.", hints: ["단위 모양을 고르고 타일 위를 눌러 겹치지 않게 놓아요.", "더 놓을 자리가 없을 때까지 채워요."],
      render: (b, a) => ar6Tile(b, a, { bricks: [{ name: "가", x: 0, y: 1, w: 6, h: 2 }, { name: "나", x: 8, y: 0, w: 3, h: 3 }], cols: 11, rows: 3, k: 40, word: "타일",
        ask: d => [{ parts: ["○ 원: 가 ", { n: 12 }, "개, 나 ", { n: 9 }, "개 — 원 사이에 ", { o: ["빈틈이 생겨요", "빈틈이 없어요"], a: 0 }, "."] },
          { parts: ["▭ 직사각형: 가 ", { n: d.d0 }, "개, 나 ", { n: d.d1 }, "개 — 나에는 ", { o: ["채우지 못한 곳이 남아요", "꼭 맞게 채워져요"], a: 0 }, "."] },
          { parts: ["□ 정사각형: 가 ", { n: 12 }, "개, 나 ", { n: 9 }, "개 → 더 넓은 타일은 ", { o: ["가", "나"], a: 0 }, "예요."] }],
        ok: "원은 빈틈이 생기고, 작은 직사각형은 채우지 못하고 남는 곳이 생겨요. 정사각형으로 재면 가 12개, 나 9개라서 가가 더 넓어요." }) },
    { name: "말해 보기 — 알맞은 단위", inst: "여러 가지 단위로 재어 보고 알게 된 점을 이야기해 보세요.", hints: ["같은 타일 가를 재었는데 단위에 따라 개수가 달랐어요.", "겹치지 않고 빈틈없이 이어 붙일 수 있는 모양이 좋아요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "같은 타일 가를 재었는데 직사각형(▭) 단위로는 6개, 정사각형 단위로는 12개였어요. 까닭은 무엇일까요?", o: ["단위의 모양과 크기가 달라서", "타일 가의 넓이가 바뀌어서"], a: 0, why: { "1": "타일 가는 그대로예요. 무엇으로 재었는지 살펴봐요." } },
        { q: "넓이를 재는 단위로 가장 알맞은 모양은 무엇일까요?", o: ["원", "직사각형(▭)", "정사각형"], a: 2, why: { "0": "원은 빈틈없이 이어 붙일 수 없어요.", "1": "타일 나처럼 채우지 못하고 남는 곳이 생길 수 있어요. 가로와 세로가 같은 모양을 떠올려요." } }],
        { ok: "단위에 따라 개수가 달라지므로 모두가 같은 단위를 써야 해요. 정사각형은 빈틈없이 이어 붙일 수 있어서 넓이의 단위로 알맞아요." }),
        { q: "정사각형이 넓이의 단위로 알맞은 까닭을 써 볼까요?", ph: "정사각형은 ~", help: ["① 원과 작은 직사각형으로 쟀을 때 불편했던 점을 떠올려요. → ② 정사각형은 어땠는지 견주어 써요.", "‘정사각형은 ~ 이어 붙일 수 있어서 ~’ 꼴로 써요."], ans: "정사각형은 겹치지 않고 빈틈없이 이어 붙일 수 있고, 가로와 세로의 길이가 같아 어느 쪽으로 놓아도 모양이 같아요. 그래서 모두가 같은 단위로 정확히 셀 수 있어요." }) },
    { name: "약속하기 — 1 cm²", inst: "넓이의 단위를 약속해 보세요.", hints: ["한 변이 1 cm인 정사각형이에요.", "cm 오른쪽 위에 작은 2를 써요."],
      render: (b, a) => ar6Ask(b, a, [{ fig: () => ar6Static({ cols: 3, rows: 3, k: 50, shapes: [{ P: AR6_RECT(1, 1, 1, 1), fill: "#9CC3F0", name: "1 cm²", size: 13 }], labs: [{ a: [1, 1], b: [2, 1], t: "1 cm" }, { a: [2, 1], b: [2, 2], t: "1 cm" }], maxW: "10em" }),
        parts: ["넓이의 단위로 한 변의 길이가 ", { o: ["1 cm", "1 m", "10 cm"], a: 0 }, "인 정사각형의 넓이를 사용할 수 있어요. 이 넓이를 ", { o: ["1 cm²", "1 cm", "1 m²"], a: 0 }, "라 쓰고, ", { o: ["1 제곱센티미터", "1 센티미터", "1 제곱미터"], a: 0 }, "라고 읽어요."] }],
        { ok: "한 변의 길이가 1 cm인 정사각형의 넓이를 1 cm²라 쓰고, 1 제곱센티미터라고 읽어요." }) },
    { name: "확인하기 — 우리 반 타일 무늬", inst: "서아가 1 cm² 타일로 꽃 무늬를 만들었어요. 칸을 하나씩 눌러 세어 무늬의 넓이를 구해 보세요.", hints: ["한 칸이 1 cm²예요.", "1 cm²가 ■개이면 1 cm²의 ■배이고, ■ cm²예요."],
      render: (b, a) => ar6Count(b, a, { cols: 6, rows: 5, cells: [[2, 0], [3, 0], [1, 1], [2, 1], [3, 1], [4, 1], [2, 2], [3, 2], [2, 3], [3, 3]], maxW: "18em",
        ask: [{ parts: ["1 cm²가 ", { n: 10 }, "개 → 1 cm²의 ", { n: 10 }, "배 → 넓이는 ", { n: 10 }, " cm²"] }],
        ok: "1 cm²가 10개이므로 1 cm²의 10배, 넓이는 10 cm²예요." }) }
  ],
  challenge: { inst: "타일 무늬 공모를 해요. 넓이가 같은 무늬를 그리고, 무늬의 넓이를 비교해 보세요.", hints: ["칸의 수가 곧 넓이(cm²)예요.", "서로 다른 모양: 돌리거나 뒤집어서 같아지면 같은 모양이에요."],
    render: (b, a) => ar6Chain(b, a, [
      { title: "① 넓이가 6 cm²인 무늬를 서로 다른 모양으로 2개 색칠해요. 다 칠하고 손을 떼면 저절로 확인해요.", run: (bx, ax) => ar6Paint(bx, ax, { cols: 7, rows: 5, differ: true, tasks: [{ area: 6 }, { area: 6 }], ok: "넓이가 같아도 모양은 여러 가지일 수 있어요." }) },
      { title: "② 넓이를 비교해요.", run: (bx, ax) => ar6Ask(bx, ax, [
        { fig: () => ar6Static({ cols: 16, rows: 6, k: 22, shapes: [...ar6Cells([[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2]], AR6.f1), ...ar6Cells([[7, 1], [8, 1], [9, 1], [7, 2], [8, 2], [9, 2], [7, 3], [8, 3], [9, 3]], AR6.f2), ...ar6Cells([[11, 1], [12, 1], [13, 1], [14, 1], [11, 2], [12, 2], [13, 2], [14, 2], [11, 3], [12, 3], [11, 4]], AR6.f3)], texts: [{ p: [3.5, 3.6], t: "가" }, { p: [8.5, 4.6], t: "나" }, { p: [13, 4.6], t: "다" }], maxW: "32em" }),
          parts: ["가 ", { n: 10 }, " cm², 나 ", { n: 9 }, " cm², 다 ", { n: 11 }, " cm² → 넓은 것부터: ", { o: ["다, 가, 나", "가, 다, 나", "나, 가, 다"], a: 0 }] },
        { q: "9 cm²를 바르게 읽은 것은?", parts: [{ o: ["9 제곱센티미터", "9 센티미터 제곱", "9 센티미터"], a: 0 }] }], { ok: "다 11 cm², 가 10 cm², 나 9 cm² 순서로 넓어요." }) }]) }
},
{
  id: "s5", no: 5, title: "사물함 이름표와 꾸미기 종이 ― 직사각형의 넓이", soop: "개념 구축하기(O)",
  question: "직사각형과 정사각형의 넓이는 어떻게 구할 수 있을까요?",
  summary: "직사각형에서 1 cm²가 가로 한 줄에 (가로)개씩 (세로)줄 있으므로 (직사각형의 넓이) = (가로) × (세로)예요. 정사각형은 가로와 세로가 같으므로 (정사각형의 넓이) = (한 변의 길이) × (한 변의 길이)예요. 가로 6 cm, 세로 4 cm인 이름표의 넓이는 6×4=24 (cm²)예요.",
  steps: [
    { name: "만져 보기 — 이름표 칸 세기", inst: "서아가 사물함 이름표를 가로 5 cm, 세로 3 cm로 설계했어요. 이름표 설계도에서 1 cm²의 개수를 세어 넓이를 구해 보세요. 칸을 하나씩 눌러요.", hints: ["한 칸이 1 cm²예요.", "1 cm²가 ■개이면 ■ cm²예요."],
      render: (b, a) => ar6Count(b, a, { cols: 7, rows: 5, cells: Array.from({ length: 15 }, (_, i) => [1 + i % 5, 1 + Math.floor(i / 5)]), maxW: "20em",
        ask: [{ parts: ["1 cm²가 ", { n: 15 }, "개 → 1 cm²의 ", { n: 15 }, "배 → 이름표의 넓이는 ", { n: 15 }, " cm²"] }], ok: "가로 5 cm, 세로 3 cm인 이름표의 넓이는 15 cm²예요." }) },
    { name: "그려 보기 — 한 줄씩 세기", inst: "지안이가 이름표를 조금 크게(가로 6 cm, 세로 4 cm) 바꾸었어요. 먼저 예상을 쓰고, 이번에는 한 줄씩 눌러 세어 보세요.", hints: ["한 칸을 누르면 그 줄 전체가 칠해져요.", "가로 6 cm이면 한 줄에 6개, 세로 4 cm이면 4줄이에요."],
      render: ruleFirst((b, a) => ar6Count(b, a, { cols: 8, rows: 6, byRow: true, cells: Array.from({ length: 24 }, (_, i) => [1 + i % 6, 1 + Math.floor(i / 6)]), maxW: "22em",
        ask: [{ parts: ["1 cm²가 가로 한 줄에 ", { n: 6 }, "개씩 ", { n: 4 }, "줄 → 6 × 4 = ", { n: 24, why: { "10": "가로와 세로를 더하지 말고 곱해요.", "20": "둘레가 아니라 넓이예요. 6개씩 4줄이에요." } }, " (개) → 넓이는 ", { n: 24 }, " cm²"] }], ok: "6개씩 4줄이므로 6×4=24, 넓이는 24 cm²예요." }),
        { q: "한 칸씩 세지 않고 직사각형의 넓이를 빠르게 구하는 규칙을 예상해 봐요.", ph: "내 규칙: ~와 ~를 ~", help: ["① 한 줄에 놓인 칸 수가 무엇과 같은지 생각해요. → ② 줄의 수가 무엇과 같은지 생각해요.", "‘내 규칙: 한 줄의 칸 수 ~와 줄의 수 ~를 ~하면 넓이가 돼요.’ 꼴로 써요."], ans: "1 cm²가 가로 한 줄에 (가로)개씩 (세로)줄 있으므로 (가로)×(세로)로 구해요. 이름표는 6×4=24 (cm²)예요." }) },
    { name: "말해 보기 — 가로 × 세로", inst: "직사각형의 넓이를 구하는 방법을 말해 보세요.", hints: ["한 줄의 개수와 가로의 길이를 비교해요.", "줄의 수와 세로의 길이를 비교해요."],
      render: thenWhy((b, a) => blanks(b, a, ["한 줄에 놓인 1 cm²의 수는 ", { o: ["가로의 길이", "세로의 길이"], a: 0 }, "와 같고, 줄의 수는 ", { o: ["세로의 길이", "가로의 길이"], a: 0 }, "와 같아요. 그래서 직사각형의 넓이는 가로와 세로를 ", { o: ["곱하여", "더하여"], a: 0 }, " 구할 수 있어요."],
        { ok: "1 cm²가 가로의 수만큼씩 세로의 수만큼 줄이 있으니 가로와 세로를 곱해요." }),
        { q: "유찬이는 가로 6 cm, 세로 4 cm인 이름표의 넓이를 6+4=10 (cm²)이라고 했어요. 무엇을 잘못했는지 써 볼까요?", ph: "넓이는 ~", help: ["① 이름표에 1 cm²가 몇 개씩 몇 줄 있는지 떠올려요. → ② 더하는 것과 곱하는 것을 견주어 고쳐 써요.", "‘1 cm²가 ~개씩 ~줄 있으므로 더하지 말고 ~해야 해요.’ 꼴로 써요."], ans: "1 cm²가 한 줄에 6개씩 4줄 있으므로 가로와 세로를 더하지 말고 곱해야 해요. 넓이는 6×4=24 (cm²)예요." }) },
    { name: "약속하기 — 직사각형과 정사각형의 넓이", inst: "직사각형과 정사각형의 넓이를 구하는 식을 완성해 보세요.", hints: ["정사각형은 네 변의 길이가 모두 같아요."],
      render: (b, a) => blanks(b, a, ["(직사각형의 넓이) = (가로) × (", { o: ["세로", "가로", "둘레"], a: 0 }, ")", " / 정사각형은 네 변의 길이가 ", { o: ["모두 같으므로", "모두 다르므로"], a: 0 }, " (정사각형의 넓이) = (한 변의 길이) × (", { o: ["한 변의 길이", "변의 수"], a: 0 }, ")"],
        { ok: "(직사각형의 넓이) = (가로) × (세로), (정사각형의 넓이) = (한 변의 길이) × (한 변의 길이)예요." }) },
    { name: "확인하기 — 게시판 꾸미기 종이", inst: "모눈 한 칸은 1 cm예요. 게시판에 붙일 꾸미기 종이를 그려 보고 넓이를 구해 보세요. 그린 뒤 손을 떼면 저절로 확인해요.", hints: ["점에서 점까지 끌어 그려요. 가로는 옆으로, 세로는 위아래로 재어요.", "(가로) × (세로)로 계산해요."],
      render: (b, a) => ar6Rect(b, a, { cols: 10, rows: 8, k: 30, tasks: [{ w: 7, h: 3, label: "가: 가로 7 cm, 세로 3 cm인 직사각형을 그려요." }, { w: 6, h: 6, label: "나: 한 변이 6 cm인 정사각형을 그려요." }],
        ask: [{ parts: ["가의 넓이: 7 × 3 = ", { n: 21, why: { "20": "20은 둘레예요. 넓이는 가로와 세로를 곱해요.", "10": "넓이는 가로와 세로를 더하지 않고 곱해요." } }, " (cm²)", h("br"), "나의 넓이: 6 × 6 = ", { n: 36, why: { "24": "6×4는 둘레예요. 넓이는 6×6이에요.", "12": "넓이는 한 변의 길이끼리 곱해요." } }, " (cm²)"] }],
        ok: "가는 7×3=21 (cm²), 나는 6×6=36 (cm²)예요." }) }
  ],
  challenge: { inst: "교실 꾸미기 회의에서 나온 문제예요. 직사각형과 정사각형의 넓이를 이용해 보세요.", hints: ["(직사각형의 넓이) = (가로) × (세로)", "넓이를 알면 (세로) = (넓이) ÷ (가로)예요."],
    render: (b, a) => ar6Ask(b, a, [
      { q: "넓이가 96 cm²인 직사각형 꾸미기 종이의 가로가 12 cm예요. 세로는 몇 cm일까요?", parts: [{ n: 8, why: { "84": "넓이에서 빼지 말고 나누어요. 96÷12를 계산해요." } }, " cm"] },
      { q: "가: 한 변이 9 cm인 정사각형, 나: 가로 16 cm, 세로 5 cm인 직사각형 — 더 넓은 것은?", parts: ["가 ", { n: 81 }, " cm², 나 ", { n: 80 }, " cm² → ", { o: ["가", "나"], a: 0 }] },
      { q: "둘레가 26 cm이고 가로가 8 cm인 직사각형 이름표가 있어요.", parts: ["세로 ", { n: 5, why: { "18": "둘레의 반 13 cm에서 8 cm를 빼요.", "10": "26÷2=13에서 8을 빼요." } }, " cm, 넓이 ", { n: 40 }, " cm²"] }],
      { ok: "세로 8 cm, 정사각형 가(81 cm²)가 나(80 cm²)보다 넓고, 이름표는 세로 5 cm, 넓이 40 cm²예요." }) }
},
{
  id: "s6", no: 6, title: "교실 바닥과 우리 마을 지도 ― 더 큰 넓이의 단위", soop: "개념 구축하기(O)",
  question: "교실이나 마을처럼 넓은 곳의 넓이는 어떤 단위로 나타내면 좋을까요?",
  summary: "한 변의 길이가 1 m인 정사각형의 넓이를 1 m²(1 제곱미터)라고 해요. 1 m²에는 1 cm²가 가로 한 줄에 100개씩 100줄 있으므로 1 m² = 10000 cm²예요. 한 변의 길이가 1 km인 정사각형의 넓이를 1 km²(1 제곱킬로미터)라고 해요. 1 km²에는 1 m²가 1000개씩 1000줄 있으므로 1 km² = 1000000 m²예요.",
  steps: [
    { name: "만져 보기 — 교실 바닥을 cm²로", inst: "우리 교실 바닥은 가로 900 cm, 세로 800 cm인 직사각형이에요. 도현이가 바닥의 넓이를 cm²로 구해 보았어요.", hints: ["(직사각형의 넓이) = (가로) × (세로)", "9×8=72이고, 900×800은 72 뒤에 0을 4개 붙여요."],
      render: (b, a) => ar6Ask(b, a, [
        { fig: () => ar6Static({ cols: 9, rows: 8, k: 26, grid: false, shapes: [{ P: AR6_RECT(0, 0, 9, 8), fill: "#F6E1B8", stroke: "#B08A1E", name: "교실 바닥" }], labs: [{ a: [0, 0], b: [9, 0], t: "900 cm" }, { a: [9, 0], b: [9, 8], t: "800 cm" }], maxW: "20em" }),
          parts: ["교실 바닥의 넓이: 900 × 800 = ", { n: 720000, why: { "72000": "0의 개수를 다시 세어 봐요. 9×8=72 뒤에 0을 4개 붙여요.", "7200000": "0의 개수를 다시 세어 봐요. 9×8=72 뒤에 0을 4개 붙여요.", "3400": "둘레가 아니라 넓이예요." } }, " cm²"] },
        { parts: ["넓은 곳의 넓이를 cm²로 나타내면 수가 너무 커서 쓰거나 읽기 ", { o: ["불편해요", "편리해요"], a: 0 }, ". 1 cm보다 큰 길이 단위 1 m가 있으니, 한 변의 길이가 1 m인 정사각형의 넓이를 ", { o: ["1 m²", "1 cm²", "1 km²"], a: 0 }, "라 쓰고, ", { o: ["1 제곱미터", "1 미터", "1 제곱센티미터"], a: 0 }, "라고 읽어요."] }],
        { ok: "교실 바닥의 넓이는 720000 cm²예요. 이렇게 넓은 곳은 1 m²(1 제곱미터)를 쓰면 편리해요." }) },
    { name: "그려 보기 — 1 m² 안의 1 cm²", inst: "1 m²는 몇 cm²일까요? 먼저 예상을 쓰고, 한 변이 1 m(=100 cm)인 정사각형을 1 cm²로 채워 보세요.", hints: ["1 m = 100 cm이니까 가로 한 줄에 1 cm²가 100개 들어가요.", "1 m² = 100 cm²가 아니에요. 100개씩 100줄이에요."],
      render: ruleFirst((b, a) => ar6Big(b, a, { n: 100, side: "1 m = 100 cm", big: "1 m²", small: "1 cm²",
        ask: [{ parts: ["1 cm²가 가로 한 줄에 ", { n: 100 }, "개씩 ", { n: 100 }, "줄 → 100 × 100 = ", { n: 10000, why: { "100": "가로 한 줄만 센 거예요. 100개씩 100줄이에요.", "1000": "100×100을 다시 계산해 봐요." } }, " (개) → 1 m² = ", { n: 10000, why: { "100": "1 m = 100 cm라고 1 m² = 100 cm²는 아니에요." } }, " cm²"] }],
        ok: "1 m² = 10000 cm²예요. 1 m = 100 cm라서 가로 100개씩 세로 100줄이 들어가요." }),
        { q: "1 m²는 몇 cm²일지 예상해 봐요.", ph: "내 예상: 1 m² = ~ cm², 왜냐하면 ~", help: ["① 1 m가 몇 cm인지 떠올려요. → ② 한 변이 1 m인 정사각형에 1 cm²가 한 줄에 몇 개씩 몇 줄 들어갈지 생각해요.", "‘내 예상: 1 cm²가 ~개씩 ~줄 들어가니까 1 m² = ~ cm²예요.’ 꼴로 써요."], ans: "1 m = 100 cm이므로 1 m² 안에는 1 cm²가 가로 한 줄에 100개씩 100줄, 100×100=10000개 들어가요. 1 m² = 10000 cm²예요." }) },
    { name: "말해 보기 — 1 m² 종이 깔기", inst: "넓이가 1 m²인 정사각형 종이를 교실 바닥에 빈틈없이 늘어놓았어요. 종이가 가로로 9장, 세로로 8장 들어가요. 한 줄씩 눌러 세어 보세요.", hints: ["한 칸이 1 m² 종이 한 장이에요.", "한 줄에 몇 장씩 몇 줄인지 곱해요."],
      render: thenWhy((b, a) => ar6Count(b, a, { cols: 9, rows: 8, k: 26, byRow: true, small: "1 m² 종이", cells: Array.from({ length: 72 }, (_, i) => [i % 9, Math.floor(i / 9)]), maxW: "17em",
        ask: [{ parts: ["1 m² 종이가 가로 한 줄에 ", { n: 9 }, "장씩 ", { n: 8 }, "줄 → 교실 바닥의 넓이는 9 × 8 = ", { n: 72, why: { "17": "9와 8을 더하지 말고 곱해요." } }, " (m²)"] }],
        ok: "교실 바닥의 넓이는 72 m²예요. 720000 cm²와 같은 넓이예요." }),
        { q: "교실 바닥의 넓이를 cm²보다 m²로 나타내면 좋은 까닭을 써 볼까요?", ph: "cm²로 나타내면 ~, m²로 나타내면 ~", help: ["① 같은 바닥을 cm²와 m²로 나타낸 두 수를 견주어요. → ② 어느 쪽이 읽고 쓰기 편한지 써요.", "‘cm²로는 ~처럼 수가 커서 ~하지만, m²로는 ~처럼 ~해요.’ 꼴로 써요."], ans: "cm²로 나타내면 720000 cm²처럼 수가 너무 커서 읽고 쓰기 불편하지만, m²로 나타내면 72 m²처럼 수가 작아서 알기 쉬워요." }) },
    { name: "약속하기 — 우리 마을 지도와 1 km²", inst: "공모전 설계도에 학교가 있는 푸른숲 마을 지도도 넣기로 했어요. 마을을 가로 4 km, 세로 3 km인 직사각형으로 보고 넓이를 알아보세요.", hints: ["1 km = 1000 m예요.", "1 km²에는 1 m²가 1000개씩 1000줄 들어가요."],
      render: (b, a) => ar6Chain(b, a, [
        (bx, ax) => ar6Ask(bx, ax, [
          { fig: () => ar6Static({ cols: 8, rows: 6, k: 30, grid: false, shapes: [{ P: AR6_RECT(0, 0, 8, 6), fill: "#E8F1FB", stroke: AR6.blue, name: "푸른숲 마을" }], labs: [{ a: [0, 0], b: [8, 0], t: "4 km" }, { a: [8, 0], b: [8, 6], t: "3 km" }], maxW: "18em" }),
            parts: ["4 km = 4000 m, 3 km = 3000 m → 마을의 넓이: 4000 × 3000 = ", { n: 12000000, why: { "1200000": "0의 개수를 다시 세어 봐요. 4×3=12 뒤에 0을 6개 붙여요.", "120000000": "0의 개수를 다시 세어 봐요. 4×3=12 뒤에 0을 6개 붙여요." } }, " m²"] },
          { parts: ["수가 너무 커서 불편하니, 한 변의 길이가 1 km인 정사각형의 넓이를 ", { o: ["1 km²", "1 m²", "1 km"], a: 0 }, "라 쓰고, ", { o: ["1 제곱킬로미터", "1 킬로미터", "1 제곱미터"], a: 0 }, "라고 읽어요."] }], { ok: "한 변의 길이가 1 km인 정사각형의 넓이를 1 km²라 쓰고, 1 제곱킬로미터라고 읽어요." }),
        { title: "1 km²는 몇 m²일까요? 1 m²로 채워 보세요.", run: (bx, ax) => ar6Big(bx, ax, { n: 1000, side: "1 km = 1000 m", big: "1 km²", small: "1 m²",
          ask: [{ parts: ["1 m²가 가로 한 줄에 ", { n: 1000 }, "개씩 ", { n: 1000 }, "줄 → 1 km² = ", { n: 1000000, why: { "1000": "1 km = 1000 m라고 1 km² = 1000 m²는 아니에요. 1000개씩 1000줄이에요.", "100000": "1000×1000을 다시 계산해 봐요. 0이 6개예요." } }, " m² → 푸른숲 마을의 넓이는 4 × 3 = ", { n: 12 }, " (km²)"] }],
          ok: "1 km² = 1000000 m²이고, 푸른숲 마을의 넓이는 12 km²예요." }) }]) },
    { name: "확인하기 — 알맞은 단위 고르기", inst: "넓이를 여러 가지 단위로 나타내고, 알맞은 단위를 골라 보세요.", hints: ["1 m² = 10000 cm², 1 km² = 1000000 m²", "이름표·공책은 cm², 교실·운동장은 m², 마을·도시는 km²가 알맞아요."],
      render: (b, a) => ar6Ask(b, a, [
        { parts: ["교실 칠판의 넓이 40000 cm² = ", { n: 4, why: { "400": "10000 cm²가 1 m²예요. 40000÷10000을 계산해요." } }, " m²", h("br"), "마을 공원의 넓이 3 km² = ", { n: 3000000, why: { "3000": "1 km² = 1000000 m²예요." } }, " m²"] },
        { q: "알맞은 단위를 골라요.", parts: ["사물함 이름표의 넓이는 24 ", { o: ["cm²", "m²", "km²"], a: 0 }, ", 교실 바닥의 넓이는 72 ", { o: ["cm²", "m²", "km²"], a: 1 }, ", 푸른숲 마을의 넓이는 12 ", { o: ["cm²", "m²", "km²"], a: 2 }, "예요."] }],
        { ok: "칠판 4 m², 공원 3000000 m²예요. 이름표는 cm², 교실은 m², 마을은 km²가 알맞아요." }) }
  ],
  challenge: { inst: "넓이의 단위 사이의 관계를 이용해 보세요.", hints: ["1 m² = 10000 cm²", "1 km² = 1000000 m², 단위를 맞춘 다음 계산해요."],
    render: (b, a) => ar6Ask(b, a, [
      { parts: ["6 m² = ", { n: 60000 }, " cm² · 150000 cm² = ", { n: 15 }, " m²", h("br"), "7 km² = ", { n: 7000000 }, " m² · 25000000 m² = ", { n: 25 }, " km²"] },
      { q: "크기를 비교해요.", parts: ["8 m² ", { o: [">", "=", "<"], a: 2 }, " 90000 cm²", h("br"), "3 km² ", { o: [">", "=", "<"], a: 0 }, " 2500000 m²"] },
      { q: "가로 500 cm, 세로 4 m인 직사각형 무대의 넓이는 몇 m²일까요?", parts: [{ n: 20, why: { "2000": "단위를 m로 맞추어요. 500 cm = 5 m예요." } }, " m²"] }],
      { ok: "8 m² = 80000 cm², 3 km² = 3000000 m²예요. 무대는 5×4=20 (m²)예요." }) }
},
{
  id: "s7", no: 7, title: "평행사변형 독서 러그 ― 평행사변형의 넓이", soop: "개념 구축하기(O)",
  question: "평행사변형의 넓이는 어떻게 구할 수 있을까요?",
  summary: "평행사변형에서 평행한 두 변을 밑변, 두 밑변 사이의 거리를 높이라고 해요. 평행사변형을 높이를 따라 잘라 이어 붙이면 직사각형이 되고, 직사각형의 가로는 평행사변형의 밑변의 길이, 세로는 높이와 같아요. 그래서 (평행사변형의 넓이) = (밑변의 길이) × (높이)예요. 밑변의 길이가 6 cm, 높이가 4 cm인 러그 설계도의 넓이는 6×4=24 (cm²)예요.",
  steps: [
    { name: "만져 보기 — 러그의 밑변과 높이", inst: "독서 공간에 깔 평행사변형 러그 설계도예요. 파란 변을 밑변으로 하여, 마주 보는 변까지 수직인 선분(높이)을 끌어서 그어 보세요.", hints: ["삼각자의 직각을 낀 한 변을 밑변에 맞추고 다른 변을 따라 긋는다고 생각해요.", "위쪽 변의 한 점에서 아래쪽 파란 변까지 곧게 내려 그어요."],
      render: (b, a) => ar6Height(b, a, { tasks: [{ P: AR6S_RUG, base: [0, 1], top: "s", at: [2, 3], cols: 12, rows: 6 }],
        ask: [{ q: "약속하기", parts: ["평행사변형에서 평행한 두 변을 ", { o: ["밑변", "높이", "대각선"], a: 0 }, "이라 하고, 두 밑변 사이의 거리를 ", { o: ["높이", "둘레", "밑변"], a: 0 }, "라고 해요. 이 러그 설계도의 밑변의 길이는 ", { n: 6 }, " cm, 높이는 ", { n: 4, why: { "5": "비스듬한 변의 길이가 아니라 두 밑변 사이의 거리를 재요." } }, " cm예요."] }],
        ok: "평행한 두 변이 밑변, 두 밑변 사이의 거리가 높이예요. 러그의 밑변은 6 cm, 높이는 4 cm예요." }) },
    { name: "그려 보기 — 1 cm²로 세어 보기", inst: "같은 러그 설계도의 넓이를 1 cm²의 개수를 세어 구해 보세요. 온전한 칸과 반 칸을 모두 눌러 세어요.", hints: ["반 칸(직각삼각형 모양) 2개를 모으면 1 cm²가 돼요.", "온전한 칸은 한 줄에 5개씩 4줄이에요."],
      render: (b, a) => ar6Count(b, a, { cols: 12, rows: 6, P: AR6S_RUG, maxW: "28em",
        ask: [{ parts: ["1 cm² ", { n: 20 }, "개, 반 칸 ", { n: 8 }, "개 → 반 칸 8개는 1 cm² ", { n: 4, why: { "8": "반 칸 2개가 1 cm²예요." } }, "개와 같아요 → 넓이는 ", { n: 24, why: { "28": "반 칸 8개는 1 cm² 4개와 같아요.", "20": "반 칸도 모아서 더해야 해요." } }, " cm²"] },
          { parts: ["이렇게 하나씩 세는 방법은 ", { o: ["시간이 오래 걸리고 반 칸을 모으기 불편해요", "언제나 가장 빨라요"], a: 0 }, "."] }],
        ok: "1 cm² 20개와 반 칸 8개(=1 cm² 4개)로 24 cm²예요. 더 편한 방법을 찾아봐요." }) },
    { name: "말해 보기 — 잘라서 직사각형 만들기", inst: "러그 설계도를 빨간 높이를 따라 잘랐어요. 먼저 예상을 쓰고, 왼쪽 조각을 끌어 오른쪽에 붙여 직사각형을 만들어 보세요.", hints: ["왼쪽 삼각형 조각을 오른쪽 끝으로 옮겨요.", "만든 직사각형의 가로와 세로를 러그와 비교해요."],
      render: ruleFirst((b, a) => ar6Cut(b, a, { cols: 12, rows: 6, pieces: [
          { P: [[5, 1], [11, 1], [7, 5], [5, 5]], fill: AR6.f6 },
          { P: [[1, 5], [5, 5], [5, 1]], fill: AR6.f2, move: true, target: { dx: 6, dy: 0 } }],
        marks: (g, m) => { ar6Seg(g, m, [5, 1], [5, 5], { color: AR6.red, w: 3, dash: "6 4" }); ar6Lab(g, m, [1, 5], [7, 5], "밑변 6 cm", { c: [6, 3], color: AR6.blue }); },
        after: (g, m) => { ar6Poly0(g, m, AR6_RECT(5, 1, 6, 4), { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [5, 5], [11, 5], "가로 6 cm", { c: [8, 3] }); ar6Lab(g, m, [11, 1], [11, 5], "세로 4 cm", { c: [8, 3] }); },
        ask: [{ parts: ["만든 직사각형의 가로는 러그의 ", { o: ["밑변의 길이", "높이", "이웃한 변의 길이"], a: 0 }, "와 같고, 세로는 러그의 ", { o: ["높이", "밑변의 길이", "둘레"], a: 0 }, "와 같아요. → 넓이: 6 × 4 = ", { n: 24 }, " (cm²)"] }],
        ok: "잘라 붙인 직사각형의 넓이 6×4=24 (cm²)가 러그의 넓이예요. 세어서 구한 24 cm²와 같아요." }),
        { q: "평행사변형 러그를 잘라 옮겨서 넓이를 쉽게 구할 수 있을지 예상해 봐요.", ph: "내 예상: ~을 따라 잘라 옮기면 ~이 되니까 ~", help: ["① 어디를 자르면 좋을지 생각해요. → ② 잘라 옮겨서 만들 수 있는 도형과 그 넓이 구하는 방법을 떠올려요.", "‘내 예상: 높이를 따라 잘라 옮기면 ~이 되니까 넓이는 (~)×(~)로 구할 수 있어요.’ 꼴로 써요."], ans: "높이를 따라 잘라 한쪽 삼각형을 반대쪽으로 옮기면 직사각형이 돼요. 직사각형의 가로는 밑변의 길이, 세로는 높이와 같으므로 넓이는 (밑변의 길이)×(높이)예요." }) },
    { name: "약속하기 — 평행사변형의 넓이", inst: "평행사변형의 넓이를 구하는 식을 완성해 보세요.", hints: ["잘라 붙인 직사각형의 가로는 밑변의 길이, 세로는 높이였어요."],
      render: (b, a) => blanks(b, a, ["(평행사변형의 넓이) = (직사각형의 넓이) = (", { o: ["밑변의 길이", "이웃한 변의 길이", "둘레"], a: 0 }, ") × (", { o: ["높이", "밑변의 길이", "이웃한 변의 길이"], a: 0 }, ")"],
        { ok: "(평행사변형의 넓이) = (밑변의 길이) × (높이)예요." }) },
    { name: "확인하기 — 여러 가지 러그", inst: "여러 가지 평행사변형 러그의 높이를 긋고, 넓이를 구해 보세요.", hints: ["밑변은 꼭 아래에 있는 변이 아니에요. 기준이 되는 파란 변이 밑변이에요.", "다는 위쪽 변 아래에 밑변이 없으니 밑변을 늘인 점선까지 그어요.", "(평행사변형의 넓이) = (밑변의 길이) × (높이)"],
      render: (b, a) => ar6Chain(b, a, [
        { title: "① 파란 변을 밑변으로 할 때의 높이를 그어요.", run: (bx, ax) => ar6Height(bx, ax, { tasks: [
            { P: [[1, 5], [6, 5], [8, 1], [3, 1]], base: [2, 3], top: "s", at: [0, 1], cols: 9, rows: 6, name: "가" },
            { P: [[1, 1], [1, 5], [4, 6], [4, 2]], base: [0, 1], top: "s", at: [2, 3], cols: 5, rows: 7, name: "나" },
            { P: [[1, 4], [4, 4], [9, 1], [6, 1]], base: [0, 1], top: "s", at: [2, 3], cols: 10, rows: 5, ext: true, name: "다" }],
          ask: [{ parts: ["높이: 가 ", { n: 4 }, " cm, 나 ", { n: 3 }, " cm, 다 ", { n: 3 }, " cm", h("br"), "다처럼 높이는 평행사변형의 ", { o: ["바깥에 그을 수도 있어요", "안쪽에만 그을 수 있어요"], a: 0 }, ". 평행한 두 변 사이의 거리는 어디에서 재어도 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
          ok: "밑변은 기준이 되는 변이고, 높이는 밑변과 마주 보는 변 사이에 수직으로 그은 선분이에요." }) },
        { title: "② 넓이를 구해요.", run: (bx, ax) => ar6Ask(bx, ax, [
          { parts: ["밑변 8 cm, 높이 5 cm → ", { n: 40 }, " cm²", h("br"), "밑변 9 m, 높이 4 m → ", { n: 36 }, " m²", h("br"), "넓이 42 cm², 밑변 7 cm → 7 × □ = 42 → 높이 ", { n: 6, why: { "35": "넓이에서 밑변을 빼지 말고 42÷7을 계산해요." } }, " cm"] },
          { q: "평행선 사이에 있는 러그 가, 나, 다의 넓이를 비교해 보세요.",
            fig: () => ar6Static({ cols: 20, rows: 5, k: 24, shapes: [{ P: [[1, 4], [5, 4], [6, 1], [2, 1]], fill: AR6.f1, name: "가" }, { P: [[7, 4], [11, 4], [14, 1], [10, 1]], fill: AR6.f2, name: "나" }, { P: [[15, 4], [19, 4], [18, 1], [14, 1]], fill: AR6.f3, name: "다", nameAt: [17, 2.6] }],
              segs: [{ a: [0, 1], b: [20, 1], color: AR6.gray, w: 1.5, dash: "6 5" }, { a: [0, 4], b: [20, 4], color: AR6.gray, w: 1.5, dash: "6 5" }, { a: [2, 1], b: [2, 4], color: AR6.red, w: 2.5 }, { a: [10, 1], b: [10, 4], color: AR6.red, w: 2.5 }, { a: [15, 1], b: [15, 4], color: AR6.red, w: 2.5 }],
              labs: [{ a: [1, 4], b: [5, 4], t: "4 cm", c: [3, 2] }, { a: [7, 4], b: [11, 4], t: "4 cm", c: [9, 2] }, { a: [15, 4], b: [19, 4], t: "4 cm", c: [17, 2] }],
              texts: [{ p: [.9, 2.5], t: "3 cm", size: 14, color: AR6.red }], maxW: "36em" }),
            parts: ["가 ", { n: 12 }, " cm², 나 ", { n: 12 }, " cm², 다 ", { n: 12 }, " cm² → 밑변의 길이와 높이가 각각 같으면 넓이도 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
          { ok: "40 cm², 36 m², 높이 6 cm예요. 가, 나, 다는 모두 4×3=12 (cm²)로 모양이 달라도 넓이가 같아요." }) }]) }
  ],
  challenge: { inst: "러그 공장에 주문하기 전에 확인해요. 평행사변형의 넓이를 구하고, 넓이가 12 cm²인 러그를 그려 보세요.", hints: ["(평행사변형의 넓이) = (밑변의 길이) × (높이)", "넓이 12 cm²: 밑변 4 cm·높이 3 cm, 밑변 6 cm·높이 2 cm, 밑변 3 cm·높이 4 cm …"],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "러그를 잘라 만든 직사각형의 가로가 8 cm, 세로가 6 cm예요. 러그의 넓이는?", parts: [{ n: 48 }, " cm²"] },
        { q: "밑변 15 cm, 높이 12 cm인 러그의 넓이는?", parts: [{ n: 180 }, " cm²"] },
        { q: "더 넓은 러그는?  ㉠ 밑변 13 m, 높이 7 m  ㉡ 밑변 9 m, 높이 10 m", parts: ["㉠ ", { n: 91 }, " m², ㉡ ", { n: 90 }, " m² → ", { o: ["㉠", "㉡"], a: 0 }] },
        { q: "넓이가 144 cm², 높이가 9 cm인 러그의 밑변의 길이는?", parts: [{ n: 16, why: { "135": "넓이에서 높이를 빼지 말고 144÷9를 계산해요." } }, " cm"] }], { ok: "48 cm², 180 cm², ㉠(91 m²)이 더 넓고, 밑변은 16 cm예요." }),
      { title: "모눈 한 칸은 1 cm예요. 점을 이어 넓이가 12 cm²인 평행사변형 러그를 서로 다른 모양으로 2개 그려요.", run: (bx, ax) => ar6Poly(bx, ax, { cols: 12, rows: 7, differ: true, tasks: [{ kind: "par", area: 12 }, { kind: "par", area: 12 }], ok: "밑변의 길이와 높이의 곱이 12가 되면 넓이가 12 cm²인 평행사변형이에요." }) }]) }
},
{
  id: "s8", no: 8, title: "삼각형 깃발 가랜드 ― 삼각형의 넓이", soop: "개념 구축하기(O)",
  question: "삼각형의 넓이는 어떻게 구할 수 있을까요?",
  summary: "삼각형에서 한 변을 밑변이라고 하면, 그 밑변과 마주 보는 꼭짓점에서 밑변에 수직으로 그은 선분의 길이를 높이라고 해요. 똑같은 삼각형 2개를 붙이면 밑변과 높이가 같은 평행사변형이 되고, 삼각형은 그 반이에요. 그래서 (삼각형의 넓이) = (밑변의 길이) × (높이) ÷ 2예요. 밑변 6 cm, 높이 4 cm인 깃발의 넓이는 6×4÷2=12 (cm²)예요.",
  steps: [
    { name: "만져 보기 — 깃발의 밑변과 높이", inst: "교실 위쪽에 매달 삼각형 깃발 설계도예요. 파란 변을 밑변으로 할 때, 마주 보는 꼭짓점에서 밑변에 수직인 선분(높이)을 그어 보세요.", hints: ["밑변과 마주 보는 꼭짓점은 위쪽 꼭짓점이에요.", "꼭짓점에서 밑변까지 곧게 내려 그어요."],
      render: (b, a) => ar6Height(b, a, { tasks: [{ P: AR6S_TRI, base: [0, 1], top: "v", at: 2, cols: 8, rows: 6 }],
        ask: [{ q: "약속하기", parts: ["삼각형에서 한 변을 밑변이라고 하면, 그 밑변과 마주 보는 ", { o: ["꼭짓점", "변"], a: 0 }, "에서 밑변에 ", { o: ["수직으로", "비스듬하게"], a: 0 }, " 그은 선분의 길이를 높이라고 해요. 이 깃발의 밑변은 ", { n: 6 }, " cm, 높이는 ", { n: 4 }, " cm예요."] }],
        ok: "밑변과 마주 보는 꼭짓점에서 밑변에 수직으로 그은 선분의 길이가 높이예요." }) },
    { name: "그려 보기 — 똑같은 깃발 2장 붙이기", inst: "도현이가 똑같은 깃발 2장을 붙여 보자고 했어요. 먼저 예상을 쓰고, 아래 깃발을 골라 ‘돌리기’로 반 바퀴 돌린 다음 끌어서 위 깃발 오른쪽에 붙여 보세요.", hints: ["먼저 아래 깃발을 눌러 고르고 ‘↻ 돌리기’를 눌러요.", "두 깃발의 오른쪽 비스듬한 변끼리 맞붙여요."],
      render: ruleFirst((b, a) => ar6Cut(b, a, { cols: 12, rows: 11, k: 30, rotate: true, maxW: "26em", pieces: [
          { P: AR6S_TRI, fill: AR6.f4 },
          { P: AR6S_TRI, fill: AR6.f1, move: true, start: { dx: 0, dy: 5 }, target: ar6RotT(AR6S_TRI, [6, 3]) }],
        marks: (g, m) => { ar6Seg(g, m, [5, 1], [5, 5], { color: AR6.red, w: 2.5, dash: "5 4" }); ar6Lab(g, m, [1, 5], [7, 5], "6 cm", { c: [4, 3], color: AR6.blue }); g.append(txt(m([5, 3])[0] + 8, m([5, 3])[1], "4 cm", 14, { fill: AR6.red, "text-anchor": "start" })); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 5], [7, 5], [11, 1], [5, 1]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 5], [7, 5], "밑변 6 cm", { c: [6, 3] }); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 깃발의 ", { o: ["밑변의 길이", "높이"], a: 0 }, "와 같고, 높이는 깃발의 ", { o: ["높이", "밑변의 길이"], a: 0 }, "와 같아요. 깃발 한 장의 넓이는 평행사변형 넓이의 ", { o: ["반", "2배"], a: 0 }, "이에요."] },
          { parts: ["깃발의 넓이: 6 × 4 ÷ 2 = ", { n: 12, why: { "24": "24 cm²는 평행사변형의 넓이예요. 깃발은 그 반이에요." } }, " (cm²)"] }],
        ok: "똑같은 삼각형 2개가 평행사변형이 되므로 깃발의 넓이는 6×4÷2=12 (cm²)예요." }),
        { q: "똑같은 삼각형 깃발 2장을 붙이면 어떤 도형이 되고, 깃발 한 장의 넓이는 어떻게 구할지 예상해 봐요.", ph: "내 예상: 2장을 붙이면 ~이 되고, 한 장의 넓이는 ~", help: ["① 똑같은 삼각형 2개를 돌려 붙인 모양을 떠올려요. → ② 그 도형의 넓이와 깃발 한 장의 넓이를 견주어요.", "‘내 예상: 2장을 붙이면 ~이 되니까, 한 장의 넓이는 그 넓이의 ~이에요.’ 꼴로 써요."], ans: "똑같은 삼각형 2개를 붙이면 평행사변형이 돼요. 깃발 한 장의 넓이는 그 평행사변형 넓이의 반이므로 (밑변)×(높이)÷2예요. 6×4÷2=12 (cm²)예요." }) },
    { name: "말해 보기 — 높이의 반에서 자르기", inst: "서아는 깃발 한 장을 높이의 반이 되는 곳(점선)에서 잘랐어요. 위 조각을 골라 반 바퀴 돌려 오른쪽에 붙여 평행사변형을 만들어 보세요.", hints: ["위 조각을 눌러 고르고 ‘↻ 돌리기’를 눌러요.", "잘린 오른쪽 변끼리 맞붙여요."],
      render: thenWhy((b, a) => ar6Cut(b, a, { cols: 11, rows: 6, rotate: true, pieces: [
          { P: AR6S_TRI_BOT, fill: AR6.f4 },
          { P: AR6S_TRI_TOP, fill: AR6.f1, move: true, target: ar6RotT(AR6S_TRI_TOP, [6, 3]) }],
        marks: (g, m) => { ar6Seg(g, m, [0, 3], [11, 3], { color: AR6.gray, w: 1.5, dash: "4 4" }); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 5], [7, 5], [9, 3], [3, 3]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 5], [7, 5], "밑변 6 cm", { c: [5, 4] }); ar6Seg(g, m, [7, 3], [7, 5], { color: AR6.red, w: 2.5 }); g.append(txt(m([7.3, 4])[0] + 2, m([7, 4])[1], "2 cm", 14, { fill: AR6.red, "text-anchor": "start" })); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 깃발의 밑변과 같은 ", { n: 6 }, " cm이고, 높이는 깃발 높이의 ", { o: ["반", "2배"], a: 0 }, "인 ", { n: 2 }, " cm예요. → 6 × 2 = ", { n: 12 }, " (cm²)"] }],
        ok: "높이의 반에서 잘라 붙여도 깃발의 넓이는 12 cm²예요." }),
        { q: "높이의 반에서 잘라 붙여도 (밑변)×(높이)÷2가 되는 까닭을 써 볼까요?", ph: "만든 평행사변형의 밑변은 ~, 높이는 ~", help: ["① 만든 평행사변형의 밑변과 높이가 깃발의 무엇과 같은지 찾아요. → ② 평행사변형의 넓이 식에 넣어 봐요.", "‘밑변은 깃발의 ~와 같고 높이는 깃발 높이의 ~이므로 넓이는 ~예요.’ 꼴로 써요."], ans: "만든 평행사변형의 밑변은 깃발의 밑변과 같고, 높이는 깃발 높이의 반이에요. 그래서 넓이는 (밑변)×(높이의 반)이고, 이것은 (밑변)×(높이)÷2와 같아요." }) },
    { name: "약속하기 — 삼각형의 넓이", inst: "삼각형의 넓이를 구하는 식을 완성해 보세요.", hints: ["똑같은 삼각형 2개가 평행사변형이 되었어요."],
      render: (b, a) => blanks(b, a, ["(삼각형의 넓이) = (", { o: ["밑변의 길이", "둘레"], a: 0 }, ") × (", { o: ["높이", "밑변의 길이"], a: 0 }, ") ÷ ", { o: ["2", "4"], a: 0 }],
        { ok: "(삼각형의 넓이) = (밑변의 길이) × (높이) ÷ 2예요." }) },
    { name: "확인하기 — 여러 가지 깃발", inst: "여러 가지 삼각형 깃발의 높이를 긋고, 넓이를 구해 보세요.", hints: ["가는 직각삼각형이라 한 변이 곧 높이예요.", "나는 밑변을 늘인 점선까지 그어요(높이가 삼각형 밖에 있어요).", "(삼각형의 넓이) = (밑변의 길이) × (높이) ÷ 2"],
      render: (b, a) => ar6Chain(b, a, [
        { title: "① 파란 변을 밑변으로 할 때의 높이를 그어요.", run: (bx, ax) => ar6Height(bx, ax, { tasks: [
            { P: [[1, 1], [1, 5], [6, 5]], base: [1, 2], top: "v", at: 0, cols: 7, rows: 6, name: "가" },
            { P: [[4, 5], [7, 5], [1, 2]], base: [0, 1], top: "v", at: 2, cols: 8, rows: 6, ext: true, name: "나" },
            { P: [[1, 1], [1, 6], [6, 3]], base: [0, 1], top: "v", at: 2, cols: 7, rows: 7, name: "다" }],
          ask: [{ parts: ["높이: 가 ", { n: 4 }, " cm, 나 ", { n: 3 }, " cm, 다 ", { n: 5 }, " cm", h("br"), "나처럼 둔각삼각형은 높이가 삼각형 ", { o: ["밖에", "안에만"], a: 0 }, " 있을 수 있어요. 한 삼각형에서 밑변이 될 수 있는 변은 ", { o: ["세 변 모두", "아래에 있는 변 하나"], a: 0 }, "예요."] }],
          ok: "어느 변이든 밑변이 될 수 있고, 높이가 바깥에 있으면 밑변을 늘여서 그어요." }) },
        { title: "② 넓이를 구해요.", run: (bx, ax) => ar6Ask(bx, ax, [
          { parts: ["밑변 9 cm, 높이 6 cm → ", { n: 27, why: { "54": "÷2를 잊었어요." } }, " cm²", h("br"), "밑변 10 m, 높이 7 m → ", { n: 35, why: { "70": "÷2를 잊었어요." } }, " m²", h("br"), "높이 8 cm, 넓이 20 cm² → □ × 8 ÷ 2 = 20 → 밑변 ", { n: 5, why: { "10": "□×8÷2=20이면 □×8=40이에요.", "12": "넓이에서 높이를 빼지 말고 식을 세워요." } }, " cm"] },
          { q: "모눈 위 깃발 가, 나, 다의 넓이를 비교해 보세요. (한 칸은 1 cm)",
            fig: () => ar6Static({ cols: 19, rows: 6, k: 22, shapes: [{ P: [[1, 5], [5, 5], [2, 1]], fill: AR6.f1, name: "가", nameAt: [2.7, 3.9] }, { P: [[6, 5], [10, 5], [10, 1]], fill: AR6.f2, name: "나", nameAt: [8.8, 3.9] }, { P: [[11, 5], [15, 5], [18, 1]], fill: AR6.f3, name: "다", nameAt: [14.6, 4.2] }], maxW: "34em" }),
            parts: ["가 ", { n: 8 }, " cm², 나 ", { n: 8 }, " cm², 다 ", { n: 8 }, " cm² → 밑변의 길이와 높이가 각각 같으면 넓이도 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
          { ok: "27 cm², 35 m², 밑변 5 cm예요. 가, 나, 다는 모두 밑변 4 cm, 높이 4 cm라서 4×4÷2=8 (cm²)예요." }) }]) }
  ],
  challenge: { inst: "깃발 가랜드를 완성하기 전에 확인해요. 삼각형의 넓이를 이용하고, 넓이가 8 cm²인 깃발을 그려 보세요.", hints: ["(삼각형의 넓이) = (밑변의 길이) × (높이) ÷ 2", "같은 삼각형은 어느 변을 밑변으로 해도 넓이가 같아요."],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "밑변 12 cm, 높이 5 cm인 깃발의 넓이는?", parts: [{ n: 30, why: { "60": "÷2를 잊었어요." } }, " cm²"] },
        { q: "넓이가 63 cm², 밑변이 14 cm인 깃발의 높이는?", parts: [{ n: 9 }, " cm"] },
        { q: "한 깃발에서 밑변을 10 cm로 하면 높이가 6 cm예요. 밑변을 12 cm로 하면 높이는?", parts: ["10 × 6 ÷ 2 = 12 × □ ÷ 2 → □ = ", { n: 5 }, " cm"] },
        { q: "밑변 8 cm, 높이 6 cm인 깃발을 높이의 반에서 잘라 평행사변형을 만들었어요. 잘못 말한 친구는?  유찬: “평행사변형의 높이는 6 cm야.”  서아: “평행사변형의 밑변은 8 cm야.”", parts: [{ o: ["유찬", "서아"], a: 0, why: { "1": "밑변은 그대로 8 cm예요. 높이를 다시 살펴봐요." } }] }], { ok: "30 cm², 9 cm, 5 cm, 그리고 평행사변형의 높이는 6 cm의 반인 3 cm라서 유찬이가 잘못 말했어요." }),
      { title: "점을 이어 넓이가 8 cm²인 깃발(삼각형)을 서로 다른 모양으로 2개 그려요.", run: (bx, ax) => ar6Poly(bx, ax, { cols: 10, rows: 7, differ: true, tasks: [{ kind: "tri", area: 8 }, { kind: "tri", area: 8 }], ok: "밑변×높이가 16이 되면 넓이가 8 cm²인 삼각형이에요." }) }]) }
},
{
  id: "s9", no: 9, title: "마름모 창문 장식 ― 마름모의 넓이", soop: "개념 구축하기(O)",
  question: "마름모의 넓이는 어떻게 구할 수 있을까요?",
  summary: "마름모를 둘러싼 직사각형의 가로와 세로는 마름모의 두 대각선의 길이와 같고, 직사각형의 넓이는 마름모 넓이의 2배예요. 마름모를 한 대각선을 따라 잘라 붙이면 밑변이 한 대각선, 높이가 다른 대각선의 반인 평행사변형이 돼요. 그래서 (마름모의 넓이) = (한 대각선의 길이) × (다른 대각선의 길이) ÷ 2예요. 대각선이 8 cm, 6 cm인 창문 장식의 넓이는 8×6÷2=24 (cm²)예요.",
  steps: [
    { name: "만져 보기 — 둘러싼 직사각형", inst: "창문에 붙일 마름모 장식(대각선 8 cm, 6 cm)을 직사각형 색종이에서 오려 내려고 해요. 먼저 예상을 쓰고, 남는 귀퉁이 삼각형을 하나씩 골라 반 바퀴 돌린 다음 마름모 안으로 옮겨 보세요.", hints: ["귀퉁이 삼각형을 누르고 ‘↻ 돌리기’를 눌러요.", "돌린 삼각형을 마름모 안의 같은 모양 자리로 끌어요."],
      render: ruleFirst((b, a) => ar6Cut(b, a, { cols: 10, rows: 8, k: 38, rotate: true, maxW: "26em", ghost: AR6_RECT(1, 1, 8, 6), pieces: [
          { P: AR6S_RH, fill: AR6.f1 },
          ...AR6S_CORNERS.map((C, i) => ({ P: C, fill: AR6.f4, move: true, target: ar6RotT(C, AR6S_CMID[i]) }))],
        marks: (g, m) => { ar6Seg(g, m, [1, 4], [9, 4], { color: AR6.blue, w: 2.5 }); ar6Seg(g, m, [5, 1], [5, 7], { color: AR6.red, w: 2.5 }); },
        after: (g, m) => { ar6Poly0(g, m, AR6_RECT(1, 1, 8, 6), { fill: "none", stroke: AR6.org, w: 3 }); ar6Lab(g, m, [1, 1], [9, 1], "8 cm", { c: [5, 4] }); ar6Lab(g, m, [9, 1], [9, 7], "6 cm", { c: [5, 4] }); },
        msg: "귀퉁이 삼각형 4개로 마름모를 빈틈없이 덮었어요.",
        ask: [{ parts: ["둘러싼 직사각형의 가로는 마름모의 한 대각선의 길이인 ", { n: 8 }, " cm, 세로는 다른 대각선의 길이인 ", { n: 6 }, " cm예요. 귀퉁이 삼각형 4개가 마름모와 꼭 맞으므로 직사각형의 넓이는 마름모 넓이의 ", { n: 2 }, "배예요."] },
          { parts: ["창문 장식의 넓이: 8 × 6 ÷ 2 = ", { n: 24, why: { "48": "48 cm²는 둘러싼 직사각형의 넓이예요. 마름모는 그 반이에요." } }, " (cm²)"] }],
        ok: "(마름모의 넓이) = (둘러싼 직사각형의 넓이) ÷ 2 = 8×6÷2 = 24 (cm²)예요." }),
        { q: "마름모를 둘러싼 직사각형의 넓이와 마름모의 넓이 사이에 어떤 관계가 있을지 예상해 봐요.", ph: "내 예상: 직사각형의 넓이는 마름모 넓이의 ~", help: ["① 직사각형에서 마름모를 오려 내고 남는 귀퉁이를 떠올려요. → ② 남는 부분과 마름모의 크기를 견주어요.", "‘내 예상: 남는 귀퉁이를 모으면 마름모와 ~하니까 직사각형은 마름모의 ~배예요.’ 꼴로 써요."], ans: "귀퉁이 삼각형 4개를 모으면 마름모와 꼭 맞으므로 둘러싼 직사각형의 넓이는 마름모 넓이의 2배예요. 그래서 마름모의 넓이는 직사각형 넓이의 반, (한 대각선)×(다른 대각선)÷2예요." }) },
    { name: "그려 보기 — 대각선을 따라 자르기", inst: "도현이는 마름모 장식을 파란 대각선을 따라 잘랐어요. 위 조각을 끌어 아래 조각의 오른쪽에 붙여 평행사변형을 만들어 보세요.", hints: ["위 삼각형을 오른쪽 아래로 옮겨요.", "돌리지 않고 옮기기만 하면 돼요."],
      render: (b, a) => ar6Cut(b, a, { cols: 14, rows: 8, k: 30, pieces: [
          { P: [[1, 4], [9, 4], [5, 7]], fill: AR6.f1 },
          { P: [[1, 4], [5, 1], [9, 4]], fill: AR6.f4, move: true, target: { dx: 4, dy: 3 } }],
        marks: (g, m) => { ar6Seg(g, m, [1, 4], [9, 4], { color: AR6.blue, w: 3 }); ar6Seg(g, m, [5, 1], [5, 7], { color: AR6.red, w: 2, dash: "5 4" }); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 4], [9, 4], [13, 7], [5, 7]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 4], [9, 4], "밑변 8 cm", { c: [7, 5.5], color: AR6.blue }); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 한 대각선(파란색)의 길이인 ", { n: 8 }, " cm, 높이는 다른 대각선(빨간색)의 길이의 반인 ", { n: 3, why: { "6": "높이는 빨간 대각선 전체가 아니라 그 반이에요." } }, " cm예요. → 8 × 3 = ", { n: 24 }, " (cm²)"] }],
        ok: "잘라 붙여서 만든 평행사변형도 넓이가 24 cm²예요." }) },
    { name: "말해 보기 — 두 방법 견주기", inst: "두 가지 방법을 견주어 마름모의 넓이를 구하는 방법을 말해 보세요.", hints: ["두 방법 모두 두 대각선의 길이를 사용했어요."],
      render: thenWhy((b, a) => blanks(b, a, ["둘러싼 직사각형으로 구해도 8 × 6 ÷ 2, 잘라서 평행사변형으로 구해도 8 × (6 ÷ 2)예요. 두 방법 모두 ", { o: ["두 대각선의 길이를 곱하고 2로 나눈 것", "두 대각선의 길이를 더한 것"], a: 0 }, "과 같아요."],
        { ok: "마름모의 넓이는 두 대각선의 길이를 곱한 다음 2로 나누어 구해요." }),
        { q: "유찬이는 한 변이 5 cm인 이 마름모의 넓이를 5×5=25 (cm²)라고 했어요. 무엇이 잘못되었는지 써 볼까요?", ph: "마름모는 ~", help: ["① 한 변끼리 곱해서 넓이를 구할 수 있는 도형이 무엇인지 떠올려요. → ② 마름모의 넓이를 구하는 바른 방법으로 고쳐 써요.", "‘마름모는 ~이 아니어서 한 변끼리 곱하면 안 돼요. ~×~÷2로 구해요.’ 꼴로 써요."], ans: "마름모는 정사각형이 아니어서 한 변끼리 곱하면 안 돼요. 두 대각선의 길이를 곱한 다음 2로 나누어 8×6÷2=24 (cm²)로 구해요." }) },
    { name: "약속하기 — 마름모의 넓이", inst: "마름모의 넓이를 구하는 식을 완성해 보세요.", hints: ["둘러싼 직사각형 넓이의 반이에요."],
      render: (b, a) => blanks(b, a, ["(마름모의 넓이) = (한 대각선의 길이) × (", { o: ["다른 대각선의 길이", "한 변의 길이", "높이"], a: 0 }, ") ÷ ", { o: ["2", "4"], a: 0 }],
        { ok: "(마름모의 넓이) = (한 대각선의 길이) × (다른 대각선의 길이) ÷ 2예요." }) },
    { name: "확인하기 — 여러 가지 마름모 장식", inst: "교실과 복도에 붙일 마름모 장식의 넓이를 구해 보세요.", hints: ["두 대각선의 길이를 곱하고 2로 나누어요."],
      render: (b, a) => ar6Ask(b, a, [{ fig: () => ar6Static({ cols: 23, rows: 9, k: 20, grid: false, shapes: [{ P: [[1, 4.5], [6, 1.5], [11, 4.5], [6, 7.5]], fill: AR6.f1 }, { P: [[12.5, 4.5], [17.3, 1.7], [22.1, 4.5], [17.3, 7.3]], fill: AR6.f4 }],
          segs: [{ a: [1, 4.5], b: [11, 4.5], color: AR6.blue, w: 2 }, { a: [6, 1.5], b: [6, 7.5], color: AR6.red, w: 2 }, { a: [12.5, 4.5], b: [22.1, 4.5], color: AR6.blue, w: 2 }, { a: [17.3, 1.7], b: [17.3, 7.3], color: AR6.red, w: 2 }],
          texts: [{ p: [3.4, 4], t: "10 cm", size: 14, color: AR6.blue }, { p: [6.9, 6.4], t: "6 cm", size: 14, color: AR6.red }, { p: [14.8, 4], t: "12 m", size: 14, color: AR6.blue }, { p: [18.2, 6.3], t: "7 m", size: 14, color: AR6.red }, { p: [6, 8.4], t: "가(교실 창문)" }, { p: [17.3, 8.4], t: "나(복도 벽)" }], maxW: "34em" }),
        parts: ["가: 10 × 6 ÷ 2 = ", { n: 30, why: { "60": "÷2를 잊었어요." } }, " (cm²)", h("br"), "나: 12 × 7 ÷ 2 = ", { n: 42, why: { "84": "÷2를 잊었어요." } }, " (m²)"] }],
        { ok: "가는 10×6÷2=30 (cm²), 나는 12×7÷2=42 (m²)예요." }) }
  ],
  challenge: { inst: "마름모 장식을 더 만들어요. 마름모의 넓이를 이용하고, 넓이가 12 cm²인 마름모를 그려 보세요.", hints: ["(마름모의 넓이) = (한 대각선) × (다른 대각선) ÷ 2", "넓이 12 cm²: 두 대각선의 곱이 24가 되게(예: 6 cm와 4 cm) 그려요."],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "대각선이 14 cm, 9 cm인 마름모 장식의 넓이는?", parts: [{ n: 63, why: { "126": "÷2를 잊었어요." } }, " cm²"] },
        { q: "넓이가 56 cm², 한 대각선이 8 cm인 마름모의 다른 대각선은?", parts: [{ n: 14, why: { "7": "8×□÷2=56이면 8×□=112예요." } }, " cm"] },
        { q: "가로 30 cm, 세로 24 cm인 직사각형 색종이의 네 변의 가운데를 이어 마름모 장식을 만들었어요. 장식의 넓이는?", parts: [{ n: 360, why: { "720": "720 cm²는 직사각형 색종이의 넓이예요. 마름모는 그 반이에요." } }, " cm²"] },
        { q: "더 넓은 마름모는?", parts: ["대각선 16 cm, 6 cm → ", { n: 48 }, " cm² / 대각선 10 cm, 10 cm → ", { n: 50 }, " cm² → ", { o: ["16 cm, 6 cm", "10 cm, 10 cm"], a: 1 }] }], { ok: "63 cm², 14 cm, 360 cm², 그리고 10 cm·10 cm 쪽(50 cm²)이 더 넓어요." }),
      { title: "점을 이어 넓이가 12 cm²인 마름모를 그려요.", run: (bx, ax) => ar6Poly(bx, ax, { cols: 10, rows: 8, tasks: [{ kind: "rh", area: 12 }], ok: "두 대각선의 곱이 24이면 넓이가 12 cm²인 마름모예요." }) }]) }
},
{
  id: "s10", no: 10, title: "사다리꼴 화단 ― 사다리꼴의 넓이", soop: "개념 구축하기(O)",
  question: "사다리꼴의 넓이는 어떻게 구할 수 있을까요?",
  summary: "사다리꼴에서 평행한 두 변을 밑변이라 하고, 한 밑변을 윗변, 다른 밑변을 아랫변이라고 해요. 두 밑변 사이의 거리가 높이예요. 똑같은 사다리꼴 2개를 붙이면 밑변이 (윗변+아랫변), 높이가 사다리꼴의 높이인 평행사변형이 되고, 사다리꼴은 그 반이에요. 그래서 (사다리꼴의 넓이) = (윗변의 길이 + 아랫변의 길이) × (높이) ÷ 2예요. 윗변 3 cm, 아랫변 7 cm, 높이 4 cm인 화단 설계도의 넓이는 (3+7)×4÷2=20 (cm²)예요.",
  steps: [
    { name: "만져 보기 — 화단의 밑변과 높이", inst: "학교 정원에 만들 사다리꼴 화단 설계도 가, 나예요. 파란 변과 평행한 변 사이에 높이를 그어 보세요.", hints: ["평행한 두 변 사이에 수직인 선분을 그어요.", "나는 위쪽 변이 더 길어요. 아래쪽 짧은 변 위의 점에서 위로 그어 봐요."],
      render: (b, a) => ar6Height(b, a, { tasks: [
          { P: AR6S_TZ, base: [0, 1], top: "s", at: [2, 3], cols: 9, rows: 6, name: "가" },
          { P: [[2, 4], [5, 4], [8, 1], [1, 1]], base: [0, 1], top: "s", at: [2, 3], cols: 9, rows: 5, name: "나" }],
        ask: [{ q: "약속하기", parts: ["사다리꼴에서 평행한 두 변을 ", { o: ["밑변", "높이"], a: 0 }, "이라 하고, 한 밑변을 윗변, 다른 밑변을 아랫변이라고 해요. 두 밑변 사이의 거리를 ", { o: ["높이", "대각선"], a: 0 }, "라고 해요."] },
          { parts: ["가의 높이는 ", { n: 4 }, " cm, 나의 높이는 ", { n: 3 }, " cm예요. 나처럼 윗변이 아랫변보다 ", { o: ["길 수도 있어요", "길 수 없어요"], a: 0 }, "."] }],
        ok: "평행한 두 변이 밑변(윗변·아랫변)이고, 두 밑변 사이의 거리가 높이예요. 윗변이 꼭 짧은 변은 아니에요." }) },
    { name: "그려 보기 — 똑같은 화단 2개 붙이기", inst: "지안이가 똑같은 화단 설계도 2장을 붙여 보자고 했어요(윗변 3 cm, 아랫변 7 cm, 높이 4 cm). 먼저 예상을 쓰고, 아래 사다리꼴을 골라 반 바퀴 돌린 다음 끌어서 위 사다리꼴 오른쪽에 붙여 보세요.", hints: ["아래 사다리꼴을 누르고 ‘↻ 돌리기’를 눌러요.", "비스듬한 오른쪽 변끼리 맞붙여요."],
      render: ruleFirst((b, a) => ar6Cut(b, a, { cols: 14, rows: 11, k: 28, rotate: true, maxW: "26em", pieces: [
          { P: AR6S_TZ, fill: AR6.f4 },
          { P: AR6S_TZ, fill: AR6.f3, move: true, start: { dx: 0, dy: 5 }, target: ar6RotT(AR6S_TZ, [7, 3]) }],
        marks: (g, m) => { ar6Seg(g, m, [3, 1], [6, 1], { color: AR6.blue, w: 4 }); ar6Seg(g, m, [1, 5], [8, 5], { color: AR6.green, w: 4 }); ar6Seg(g, m, [4, 1], [4, 5], { color: AR6.red, w: 2.5, dash: "5 4" }); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 5], [11, 5], [13, 1], [3, 1]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 5], [11, 5], "밑변 7 cm + 3 cm = 10 cm", { c: [6, 3] }); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 화단의 (윗변 + 아랫변)과 같은 ", { n: 10 }, " cm, 높이는 화단의 높이와 같은 ", { n: 4 }, " cm예요. 화단의 넓이는 평행사변형 넓이의 ", { o: ["반", "2배"], a: 0 }, "이에요."] },
          { parts: ["화단의 넓이: (3 + 7) × 4 ÷ 2 = ", { n: 20, why: { "40": "40 cm²는 평행사변형의 넓이예요. 화단은 그 반이에요." } }, " (cm²)"] }],
        ok: "똑같은 사다리꼴 2개가 평행사변형이 되므로 화단의 넓이는 (3+7)×4÷2=20 (cm²)예요." }),
        { q: "똑같은 사다리꼴 화단 2개를 붙이면 어떤 도형이 되고, 화단의 넓이를 어떻게 구할지 예상해 봐요.", ph: "내 예상: 2개를 붙이면 ~이 되고, 그 밑변은 ~", help: ["① 하나를 반 바퀴 돌려 붙인 모양을 떠올려요. → ② 붙인 도형의 밑변이 화단의 어느 변과 어느 변으로 이루어지는지 생각해요.", "‘내 예상: ~이 되고, 밑변은 윗변과 아랫변을 ~한 길이라서 화단의 넓이는 ~예요.’ 꼴로 써요."], ans: "똑같은 사다리꼴 2개를 붙이면 평행사변형이 되고, 그 밑변은 윗변과 아랫변을 더한 길이예요. 화단의 넓이는 평행사변형 넓이의 반이므로 (윗변+아랫변)×(높이)÷2예요." }) },
    { name: "말해 보기 — 높이의 반에서 자르기", inst: "서아는 화단 설계도 한 장을 높이의 반이 되는 곳(점선)에서 잘랐어요. 위 조각을 골라 반 바퀴 돌려 오른쪽에 붙여 평행사변형을 만들어 보세요.", hints: ["위 조각을 누르고 ‘↻ 돌리기’를 눌러요.", "잘린 오른쪽 변끼리 맞붙여요."],
      render: thenWhy((b, a) => ar6Cut(b, a, { cols: 13, rows: 6, rotate: true, pieces: [
          { P: AR6S_TZ_BOT, fill: AR6.f4 },
          { P: AR6S_TZ_TOP, fill: AR6.f3, move: true, target: ar6RotT(AR6S_TZ_TOP, [7, 3]) }],
        marks: (g, m) => { ar6Seg(g, m, [0, 3], [13, 3], { color: AR6.gray, w: 1.5, dash: "4 4" }); },
        after: (g, m) => { ar6Poly0(g, m, [[1, 5], [11, 5], [12, 3], [2, 3]], { fill: "none", stroke: AR6.red, w: 3 }); ar6Lab(g, m, [1, 5], [11, 5], "밑변 10 cm", { c: [6, 4] }); ar6Seg(g, m, [11, 3], [11, 5], { color: AR6.red, w: 2.5 }); g.append(txt(m([11.3, 4])[0] + 2, m([11, 4])[1], "2 cm", 14, { fill: AR6.red, "text-anchor": "start" })); },
        ask: [{ parts: ["만든 평행사변형의 밑변의 길이는 (윗변 + 아랫변)인 ", { n: 10 }, " cm, 높이는 화단 높이의 반인 ", { n: 2 }, " cm예요. → 10 × 2 = ", { n: 20 }, " (cm²)"] }],
        ok: "잘라서 만든 평행사변형으로 구해도 화단의 넓이는 20 cm²예요." }),
        { q: "사다리꼴의 넓이를 구할 때 윗변과 아랫변의 길이를 더하는 까닭을 써 볼까요?", ph: "잘라서 돌려 붙이면 윗변과 아랫변이 ~", help: ["① 잘라 붙인 평행사변형의 밑변을 살펴봐요. → ② 그 밑변이 화단의 어느 변들로 이루어졌는지 써요.", "‘잘라서 돌려 붙이면 윗변과 아랫변이 ~ 평행사변형의 ~이 되기 때문이에요.’ 꼴로 써요."], ans: "잘라서 돌려 붙이면 윗변과 아랫변이 한 줄로 이어져 평행사변형의 밑변이 되기 때문이에요. 그래서 밑변은 3+7=10 (cm)예요." }) },
    { name: "약속하기 — 사다리꼴의 넓이", inst: "사다리꼴의 넓이를 구하는 식을 완성하고, 화단 문제를 해결해 보세요.", hints: ["(윗변 + 아랫변)이 평행사변형의 밑변이 되었어요.", "높이를 모르면 □로 놓아요: (5+7)×□÷2=36"],
      render: (b, a) => ar6Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["(사다리꼴의 넓이) = (윗변의 길이 + ", { o: ["아랫변의 길이", "높이", "대각선의 길이"], a: 0 }, ") × (", { o: ["높이", "윗변의 길이"], a: 0 }, ") ÷ ", { o: ["2", "4"], a: 0 }], { ok: "(사다리꼴의 넓이) = (윗변의 길이 + 아랫변의 길이) × (높이) ÷ 2예요." }),
        (bx, ax) => ar6Ask(bx, ax, [
          { parts: ["윗변 5 cm, 아랫변 9 cm, 높이 6 cm → ", { n: 42, why: { "84": "÷2를 잊었어요." } }, " cm²", h("br"), "윗변 8 m, 아랫변 4 m, 높이 5 m → ", { n: 30, why: { "60": "÷2를 잊었어요." } }, " m²"] },
          { parts: ["윗변 5 m, 아랫변 7 m, 넓이 36 m² → (5 + 7) × □ ÷ 2 = 36 → 높이 ", { n: 6, why: { "3": "(5+7)×□÷2=36이면 12×□=72예요." } }, " m"] }], { ok: "42 cm², 30 m², 높이 6 m예요." })]) },
    { name: "확인하기 — 여러 가지 방법", inst: "모눈 위 화단(윗변 3 cm, 아랫변 7 cm, 높이 4 cm)의 넓이를 친구들이 여러 가지 방법으로 구했어요. 빈칸을 채워 보세요.", hints: ["삼각형의 넓이: (밑변)×(높이)÷2", "둘러싼 직사각형에서 남는 삼각형을 빼도 돼요."],
      render: (b, a) => ar6Ask(b, a, [
        { q: "지안: 대각선을 1개 그어 삼각형 2개로 나누기", fig: () => ar6Static({ cols: 9, rows: 6, k: 26, shapes: [{ P: [[1, 1], [4, 1], [1, 5]], fill: AR6.f1 }, { P: [[4, 1], [8, 5], [1, 5]], fill: AR6.f2 }], maxW: "15em" }),
          parts: ["3 × 4 ÷ 2 = ", { n: 6 }, ", 7 × 4 ÷ 2 = ", { n: 14 }, " → ", { n: 20 }, " cm²"] },
        { q: "도현: 직사각형과 삼각형으로 나누기", fig: () => ar6Static({ cols: 9, rows: 6, k: 26, shapes: [{ P: AR6_RECT(1, 1, 3, 4), fill: AR6.f1 }, { P: [[4, 1], [8, 5], [4, 5]], fill: AR6.f2 }], maxW: "15em" }),
          parts: ["3 × 4 = ", { n: 12 }, ", 4 × 4 ÷ 2 = ", { n: 8 }, " → ", { n: 20 }, " cm²"] },
        { q: "서아: 둘러싼 직사각형에서 빼기", fig: () => ar6Static({ cols: 9, rows: 6, k: 26, shapes: [{ P: AR6S_RTZ, fill: AR6.f3 }, { P: [[4, 1], [8, 1], [8, 5]], fill: "#fff", stroke: AR6.gray, dash: "5 4" }], maxW: "15em" }),
          parts: ["7 × 4 = ", { n: 28 }, ", 28 − ", { n: 8 }, " = ", { n: 20 }, " cm² → 구한 방법은 달라도 넓이는 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
        { ok: "세 방법 모두 20 cm²예요. 공식으로도 (3+7)×4÷2=20 (cm²)예요." }) }
  ],
  challenge: { inst: "화단을 더 만들어요. 사다리꼴의 넓이를 이용하고, 넓이가 10 cm²인 사다리꼴을 그려 보세요.", hints: ["(사다리꼴의 넓이) = (윗변+아랫변)×(높이)÷2", "넓이 10 cm²: (윗변+아랫변)×높이가 20이 되게(예: 윗변 2 cm, 아랫변 3 cm, 높이 4 cm) 그려요."],
    render: (b, a) => ar6Chain(b, a, [
      (bx, ax) => ar6Ask(bx, ax, [
        { q: "윗변 6 cm, 아랫변 10 cm, 높이 7 cm인 화단의 넓이는?", parts: [{ n: 56, why: { "112": "÷2를 잊었어요." } }, " cm²"] },
        { q: "넓이가 45 m², 높이가 5 m, 윗변이 7 m인 화단의 아랫변은?", parts: [{ n: 11, why: { "18": "18 m는 윗변과 아랫변의 합이에요. 윗변 7 m를 빼요.", "9": "(7+□)×5÷2=45이면 (7+□)×5=90이에요." } }, " m"] }], { ok: "56 cm², 아랫변은 11 m예요." }),
      { title: "점을 이어 넓이가 10 cm²인 사다리꼴 화단을 그려요. (평행한 변이 한 쌍만 있게 그려 봐요.)", run: (bx, ax) => ar6Poly(bx, ax, { cols: 10, rows: 7, tasks: [{ kind: "trap", area: 10 }], ok: "(윗변+아랫변)×높이÷2가 10이면 넓이가 10 cm²인 사다리꼴이에요." }) }]) }
},
{
  id: "s11", no: 11, title: "꿈의 정원 설계 ― 넓이와 둘레 견주기", soop: "탐구 정리하기(O)",
  question: "넓이가 같은 직사각형 중에서 둘레가 가장 짧은 것은? 둘레가 같은 직사각형 중에서 가장 넓은 것은?",
  summary: "넓이가 같은 직사각형이라도 둘레는 다를 수 있고, 둘레가 같은 직사각형이라도 넓이는 다를 수 있어요. 가로와 세로의 길이가 비슷할수록(정사각형에 가까울수록) 넓이가 같을 때 둘레는 짧고, 둘레가 같을 때 넓이는 넓어요.",
  steps: [
    { name: "만져 보기 — 넓이가 같은 쉼터", inst: "※ 지도서의 ‘생각을 더하다’ 차시를 이 자료에서 이야기에 맞게 다시 만든 활동이에요. 정원에 넓이가 18 cm²인 직사각형 쉼터 설계도를 서로 다른 모양으로 모두 그려 넣고, 울타리(둘레)를 구해 보세요. (모눈 한 칸은 1 cm)", hints: ["가로를 1 cm, 2 cm, 3 cm …로 바꾸어 가며 18을 나누어떨어지게 하는 세로를 찾아요.", "둘레 = (가로 + 세로) × 2", "가로와 세로를 바꾼 것은 같은 모양으로 봐요."],
      render: (b, a) => ar6Rect(b, a, { cols: 19, rows: 7, k: 22, maxW: "40em", collect: { area: 18 },
        ask: [{ parts: ["울타리가 가장 짧은 쉼터의 둘레는 ", { n: 18, why: { "22": "2×9인 쉼터보다 울타리가 더 짧은 쉼터가 있어요.", "38": "38 cm는 가장 긴 울타리예요." } }, " cm이고, 가로와 세로의 길이가 ", { o: ["가장 비슷한", "가장 많이 차이 나는"], a: 0 }, " 직사각형이에요."] }],
        ok: "넓이가 18 cm²로 같아도 둘레는 38 cm, 22 cm, 18 cm로 달라요. 가로와 세로가 가장 비슷한 3×6일 때 둘레가 가장 짧아요." }) },
    { name: "그려 보기 — 둘레가 같은 텃밭", inst: "울타리 16 cm로 둘러쌀 수 있는 직사각형 텃밭 설계도를 서로 다른 모양으로 모두 그려 넣고, 넓이를 구해 보세요.", hints: ["둘레가 16 cm이면 가로 + 세로 = 8 (cm)예요.", "가로를 1부터 4까지 바꾸어 봐요."],
      render: (b, a) => ar6Rect(b, a, { cols: 9, rows: 8, k: 30, collect: { perim: 16 },
        ask: [{ parts: ["가장 넓은 텃밭은 한 변이 ", { n: 4 }, " cm인 정사각형이고, 넓이는 ", { n: 16, why: { "15": "3×5보다 더 넓은 텃밭이 있어요." } }, " cm²예요."] }],
        ok: "둘레가 16 cm로 같아도 넓이는 7, 12, 15, 16 cm²로 달라요. 정사각형일 때 가장 넓어요." }) },
    { name: "말해 보기 — 알게 된 점", inst: "두 활동에서 알게 된 점을 정리해 보세요.", hints: ["넓이 18 cm²인 직사각형들의 둘레를 견주어요.", "가로와 세로의 차가 작을수록 어떻게 되었는지 살펴봐요."],
      render: thenWhy((b, a) => blanks(b, a, ["넓이가 같은 직사각형이라도 둘레는 ", { o: ["다를 수 있어요", "언제나 같아요"], a: 0 }, ". 가로와 세로의 길이가 비슷할수록 넓이가 같을 때 둘레는 ", { o: ["짧아지고", "길어지고"], a: 0 }, ", 둘레가 같을 때 넓이는 ", { o: ["넓어져요", "좁아져요"], a: 0 }, "."],
        { ok: "정사각형에 가까울수록 같은 넓이에서 둘레가 짧고, 같은 둘레에서 넓이가 넓어요." }),
        { q: "유찬이는 ‘넓이가 같으면 둘레도 같다’고 했어요. 유찬이에게 해 줄 말을 써 볼까요?", ph: "넓이가 18 cm²로 같아도 ~", help: ["① 넓이가 같은데 둘레가 다른 두 직사각형을 예로 골라요. → ② 두 둘레를 견주어 말해요.", "‘넓이가 ~로 같아도 ~인 직사각형은 둘레가 ~이고 ~인 직사각형은 ~예요.’ 꼴로 써요."], ans: "넓이가 18 cm²로 같아도 1×18인 직사각형의 둘레는 38 cm이고 3×6인 직사각형의 둘레는 18 cm예요. 넓이가 같아도 둘레는 다를 수 있어요." }) },
    { name: "약속하기 — 꿈의 정원 설계하기", inst: "이제 알게 된 것으로 꿈의 정원을 설계해 보세요. 조건에 맞게 그린 뒤 손을 떼면 저절로 확인해요.", hints: ["둘레 28 cm이면 가로 + 세로 = 14 (cm)예요.", "정사각형에 가까울수록 좋아요."],
      render: (b, a) => ar6Rect(b, a, { cols: 9, rows: 8, k: 30, tasks: [
          { label: "① 울타리(둘레) 28 cm로 둘러쌀 수 있는 가장 넓은 꽃밭을 그려요.", test: (w, hh) => (w + hh) * 2 !== 28 ? `지금 그린 꽃밭의 둘레는 (${w}+${hh})×2=${(w + hh) * 2} (cm)예요. 둘레가 28 cm가 되게 그려요.` : w * hh !== 49 ? `둘레는 28 cm가 맞아요. 넓이가 ${w}×${hh}=${w * hh} (cm²)인데, 더 넓게 만들 수 있어요.` : null },
          { label: "② 넓이가 36 cm²인 쉼터 중에서 울타리가 가장 짧은 것을 그려요.", test: (w, hh) => w * hh !== 36 ? `지금 그린 쉼터의 넓이는 ${w}×${hh}=${w * hh} (cm²)예요. 넓이가 36 cm²가 되게 그려요.` : (w + hh) * 2 !== 24 ? `넓이는 36 cm²가 맞아요. 둘레가 (${w}+${hh})×2=${(w + hh) * 2} (cm)인데, 더 짧게 만들 수 있어요.` : null }],
        ask: [{ parts: ["①은 한 변이 ", { n: 7 }, " cm인 정사각형으로 넓이 ", { n: 49 }, " cm², ②는 한 변이 ", { n: 6 }, " cm인 정사각형으로 둘레 ", { n: 24 }, " cm예요."] }],
        ok: "울타리 28 cm로 가장 넓은 꽃밭도, 넓이 36 cm²로 울타리가 가장 짧은 쉼터도 정사각형이에요." }) },
    { name: "확인하기 — 설계 보고서 쓰기", inst: "꿈의 정원을 설계하며 알게 된 점을 공모전 보고서에 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "넓이와 둘레를 견주며 알게 된 점을 써 보세요.", tag: "알게 된 점", ph: "예) 넓이가 18 cm²로 같아도 ~", help: ["① 넓이가 같은 직사각형들의 둘레를 견주어요. → ② 둘레가 같은 직사각형들의 넓이도 견주어요.", "‘넓이가 같아도 둘레는 ~, 둘레가 같아도 넓이는 ~. 정사각형에 가까울수록 ~’ 꼴로 써요."], ans: "넓이가 18 cm²로 같아도 둘레는 38 cm, 22 cm, 18 cm로 달랐어요. 둘레가 16 cm로 같아도 넓이는 7 cm²부터 16 cm²까지 달랐어요. 정사각형에 가까울수록 둘레는 짧고 넓이는 넓어요." },
        { q: "울타리를 아끼면서 꽃밭을 넓게 만들려면 어떤 모양으로 설계하면 좋을지 써 보세요.", tag: "설계 제안", ph: "예) 가로와 세로의 길이를 ~", help: ["① 같은 울타리로 가장 넓었던 꽃밭의 모양을 떠올려요. → ② 그 까닭을 함께 써요.", "‘가로와 세로의 길이를 ~하게 만들어요. 왜냐하면 ~’ 꼴로 써요."], ans: "가로와 세로의 길이를 비슷하게, 될 수 있으면 정사각형으로 만들어요. 울타리 길이가 같을 때 정사각형이 가장 넓기 때문이에요." }]) }
  ],
  challenge: { inst: "※ 이 자료에서 만든 문제예요. 생각을 넓혀 보세요.", hints: ["정사각형에 가까울수록 같은 넓이에서 둘레가 짧아요.", "둘레 36 cm이면 가로 + 세로 = 18 (cm)예요."],
    render: (b, a) => ar6Ask(b, a, [
      { q: "넓이가 100 cm²인 직사각형 중에서 둘레가 가장 짧은 것의 둘레는?", parts: [{ n: 40, why: { "50": "4×25보다 더 짧은 것이 있어요. 가로와 세로가 같은 10 cm, 10 cm일 때를 생각해요.", "58": "5×20보다 더 짧은 것이 있어요. 가로와 세로가 같은 10 cm, 10 cm일 때를 생각해요." } }, " cm"] },
      { q: "둘레가 36 cm인 직사각형 중에서 가장 넓은 것의 넓이는?", parts: [{ n: 81, why: { "80": "8×10보다 더 넓은 9×9가 있어요." } }, " cm²"] },
      { q: "“둘레가 같은 두 직사각형은 넓이도 같아요.” 이 말은 옳을까요?", parts: [{ o: ["옳아요", "옳지 않아요"], a: 1, why: { "0": "둘레가 16 cm인 텃밭도 넓이가 7, 12, 15, 16 cm²로 달랐어요." } }] }],
      { ok: "10×10의 둘레 40 cm, 9×9의 넓이 81 cm²예요. 둘레가 같아도 넓이는 다를 수 있어요." }) }
},
{
  id: "s12", no: 12, title: "직사각형 보물 탐험대 ― 우리 반 놀이 시간", soop: "발표하기(P)",
  question: "주사위 눈의 곱이 넓이 또는 둘레가 되는 직사각형을 그려 보물을 찾을 수 있을까요?",
  summary: "주사위 두 개의 눈의 곱을 넓이로 하면 곱해서 그 수가 되는 두 수를 가로와 세로로, 둘레로 하면 더해서 (둘레 ÷ 2)가 되는 두 수를 가로와 세로로 정해 직사각형을 그려요. 둘레는 언제나 짝수이므로 곱이 홀수이면 넓이로만 그릴 수 있어요.",
  steps: [
    { name: "만져 보기 — 놀이 규칙 알기", inst: "※ 지도서의 ‘놀이를 더하다’ 차시를 이 자료에서 다시 만든 놀이예요. 공모전 준비로 지친 5학년 2반이 ‘직사각형 보물 탐험대’ 놀이를 해요. 주사위 두 개를 던져 나온 눈의 곱이 넓이 또는 둘레가 되도록 직사각형을 그려요. 곱이 18일 때를 생각해 보세요.", hints: ["넓이 18: 가로 × 세로 = 18", "둘레 18: (가로 + 세로) × 2 = 18, 가로 + 세로 = 9"],
      render: (b, a) => quiz(b, a, [
        { q: "넓이가 18 cm²인 직사각형을 모두 골라요.", o: ["가로 2 cm, 세로 9 cm", "가로 3 cm, 세로 6 cm", "가로 4 cm, 세로 5 cm", "가로 1 cm, 세로 18 cm", "가로 9 cm, 세로 9 cm"], a: [0, 1, 3] },
        { q: "둘레가 18 cm인 직사각형을 모두 골라요.", o: ["가로 4 cm, 세로 5 cm", "가로 2 cm, 세로 7 cm", "가로 3 cm, 세로 5 cm", "가로 1 cm, 세로 8 cm"], a: [0, 1, 3] }],
        { bad: "넓이는 가로×세로, 둘레는 (가로+세로)×2로 하나씩 확인해 봐요.", ok: "넓이 18: 2×9, 3×6, 1×18 / 둘레 18: 4×5, 2×7, 1×8이에요." }) },
    { name: "그려 보기 — 놀이하기", inst: "주사위를 던지고, 넓이로 할지 둘레로 할지 골라 판 위에 직사각형을 그려요. 직사각형 안에 보물 상자가 들어가면 보물을 찾아요. 직사각형 5개를 그려 보세요. (모눈 한 칸은 1 cm)", hints: ["보물 상자가 있는 칸을 덮도록 가로와 세로를 정해요.", "앞에서 그린 직사각형과 겹치면 안 돼요.", "놓을 곳이 없으면 주사위를 다시 던져요."],
      render: (b, a) => ar6Game(b, a, { goal: 5, ok: "곱을 넓이나 둘레로 하는 직사각형을 5개 그렸어요. 보물을 몇 개 찾았나요?" }) },
    { name: "말해 보기 — 전략 세우기", inst: "보물을 많이 찾으려면 어떻게 하면 좋을지 생각해 보세요.", hints: ["넓이가 같아도 길쭉한 직사각형은 멀리까지 닿아요.", "둘레는 (가로+세로)×2라서 언제나 짝수예요."],
      render: thenWhy((b, a) => blanks(b, a, ["넓이가 같을 때 가로와 세로의 차가 큰 길쭉한 직사각형일수록 둘레가 ", { o: ["길어서", "짧아서"], a: 0 }, " 멀리 있는 보물까지 닿기 좋아요. 곱이 홀수일 때는 ", { o: ["넓이로만", "둘레로만"], a: 0 }, " 그릴 수 있어요."],
        { ok: "길쭉하게 그리면 멀리까지 닿고, 홀수는 둘레가 될 수 없으니 넓이로 그려요." }),
        { q: "보물을 많이 찾으려면 어떤 직사각형을 그리면 좋을지 내 전략을 써 볼까요?", ph: "내 전략: 보물이 ~에 있으면 ~", help: ["① 보물 상자가 놓인 자리를 떠올려요. → ② 넓이와 둘레 중 무엇을 고르고, 어떤 모양으로 그릴지 써요.", "‘보물이 ~에 있으면 ~로 정해서 ~한 직사각형을 그려요.’ 꼴로 써요."], ans: "보물 상자가 멀리 떨어져 있으면 같은 수로도 길쭉한 직사각형을 그려 멀리까지 닿게 해요. 곱이 짝수이면 넓이와 둘레 중 보물을 더 많이 덮는 쪽을 골라요." }) },
    { name: "약속하기 — 놀이 속 계산", inst: "놀이에서 나올 수 있는 경우를 계산해 보세요.", hints: ["둘레 24 cm → 가로 + 세로 = 12 (cm)", "넓이 24 cm² → 가로 × 세로 = 24"],
      render: (b, a) => ar6Ask(b, a, [
        { parts: ["주사위 눈이 4와 6이면 곱은 ", { n: 24 }, "이에요.", h("br"), "둘레가 24 cm이고 가로가 5 cm인 직사각형의 세로는 ", { n: 7, why: { "19": "둘레는 (가로+세로)×2예요. 가로 + 세로 = 24 ÷ 2 = 12예요.", "12": "12 cm는 가로와 세로의 합이에요. 가로 5 cm를 빼요." } }, " cm", h("br"), "넓이가 24 cm²이고 가로가 3 cm인 직사각형의 세로는 ", { n: 8, why: { "21": "넓이에서 빼지 말고 24÷3을 계산해요." } }, " cm"] },
        { q: "주사위 눈이 5와 5이면 곱 25로 그릴 수 있는 직사각형은?", parts: [{ o: ["넓이로만 그릴 수 있어요", "둘레로만 그릴 수 있어요", "둘 다 그릴 수 있어요"], a: 0, why: { "1": "둘레 = (가로+세로)×2라서 둘레는 언제나 짝수예요.", "2": "둘레 = (가로+세로)×2라서 둘레는 언제나 짝수예요." } }] }],
        { ok: "곱 24이면 둘레로 5×7, 넓이로 3×8을 그릴 수 있어요. 25는 홀수라 넓이로만 그려요." }) },
    { name: "확인하기 — 놀이 소감 발표", inst: "놀이를 마치고 모둠 친구들에게 발표할 내용을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "보물을 찾으려고 어떤 직사각형을 그렸는지 발표해 보세요.", tag: "나의 전략", ph: "예) 곱이 12일 때 둘레로 ~", help: ["① 기억에 남는 차례 하나를 골라 주사위의 곱을 떠올려요. → ② 넓이와 둘레 중 무엇을 골랐고 어떤 직사각형을 그렸는지 써요.", "‘곱이 ~일 때 ~로 정해서 가로 ~ cm, 세로 ~ cm인 직사각형을 그렸어요. 왜냐하면 ~’ 꼴로 써요."], ans: "곱이 12일 때 둘레로 정해서 가로 5 cm, 세로 1 cm인 길쭉한 직사각형을 그렸어요. 멀리 떨어진 보물 상자까지 닿게 하고 싶었기 때문이에요." },
        { q: "놀이를 하며 알게 된 점을 써 보세요.", tag: "알게 된 점", ph: "예) 같은 수로도 넓이로 그릴 때와 ~", help: ["① 같은 수로 넓이와 둘레를 그렸을 때를 견주어요. → ② 새로 알게 된 점을 써요.", "‘같은 수로도 ~로 그릴 때와 ~로 그릴 때 ~이 달라요.’ 꼴로 써요."], ans: "같은 수로도 넓이로 그릴 때와 둘레로 그릴 때 직사각형의 모양과 크기가 달라요. 둘레는 언제나 짝수라서 곱이 홀수이면 넓이로만 그릴 수 있어요." }]) }
  ],
  challenge: { inst: "조건에 맞는 직사각형을 그려 보세요. (모눈 한 칸은 1 cm) 그린 뒤 손을 떼면 저절로 확인해요.", hints: ["넓이 20, 한 변 4 → 다른 변 20÷4", "둘레 20, 한 변 3 → 다른 변 20÷2−3"],
    render: (b, a) => ar6Rect(b, a, { cols: 10, rows: 8, k: 30, tasks: [{ area: 20, side: 4 }, { perim: 20, side: 3 }], ok: "넓이 20 cm²는 4 cm×5 cm, 둘레 20 cm는 3 cm×7 cm예요." }) }
},
{
  id: "s13", no: 13, title: "꿈의 교실 설계도 발표회", soop: "발표하기(P)",
  question: "다각형의 둘레와 넓이를 구하는 방법을 정리하여 우리 설계도를 발표할 수 있나요?",
  summary: "5학년 2반은 꿈의 교실 설계도를 발표했어요. 정다각형의 둘레는 (한 변)×(변의 수), 직사각형 (가로+세로)×2, 평행사변형 (한 변+이웃한 변)×2, 마름모 (한 변)×4예요. 1 m² = 10000 cm², 1 km² = 1000000 m²예요. 넓이는 직사각형 (가로)×(세로), 평행사변형 (밑변)×(높이), 삼각형 (밑변)×(높이)÷2, 마름모 (한 대각선)×(다른 대각선)÷2, 사다리꼴 (윗변+아랫변)×(높이)÷2예요. 모두 직사각형이나 평행사변형으로 바꾸어 생각해서 얻은 식이에요.",
  steps: [
    { name: "만져 보기 — 설계도 둘레 정리", inst: "발표회 날이에요! 지안이가 설계도의 둘레를 발표 자료로 정리하고 있어요. 빈칸을 채워 보세요.", hints: ["정다각형: (한 변의 길이)×(변의 수)", "직사각형: (가로+세로)×2, 마름모: (한 변)×4"],
      render: (b, a) => ar6Ask(b, a, [
        { parts: ["한 변이 4 m인 정사각형 텃밭 울타리: ", { n: 16 }, " m", h("br"), "한 변이 2 m인 정육각형 꽃밭 테두리: ", { n: 12, why: { "8": "한 변의 길이와 변의 수를 더하지 말고 곱해요." } }, " m", h("br"), "가로 9 cm, 세로 6 cm인 게시판 설계도 테두리: ", { n: 30, why: { "54": "넓이가 아니라 둘레예요.", "15": "(9+6)에 2를 곱해야 해요." } }, " cm", h("br"), "한 변이 13 cm인 마름모 창문 장식 테두리: ", { n: 52 }, " cm"] }],
        { ok: "텃밭 16 m, 꽃밭 12 m, 게시판 30 cm, 창문 장식 52 cm예요." }) },
    { name: "그려 보기 — 설계도 넓이 정리", inst: "서아가 설계도의 도형을 모눈 위에 다시 그렸어요. 모눈 한 칸은 1 cm예요. 칸을 세어 길이를 알아보고 넓이를 구해 보세요.", hints: ["평행사변형은 비스듬한 변이 아니라 높이를 써요.", "삼각형·마름모·사다리꼴은 ÷2를 잊지 말아요."],
      render: (b, a) => ar6Ask(b, a, [{ fig: () => ar6Static({ cols: 24, rows: 7, k: 20, shapes: [{ P: [[1, 6], [5, 6], [7, 2], [3, 2]], fill: AR6.f6, name: "가" }, { P: [[8, 6], [13, 6], [11, 2]], fill: AR6.f4, name: "나", nameAt: [10.7, 4.8] }, { P: [[14, 4], [16, 1], [18, 4], [16, 7]], fill: AR6.f1, name: "다" }, { P: [[19, 6], [24, 6], [23, 2], [20, 2]], fill: AR6.f3, name: "라" }], maxW: "38em" }),
        parts: ["가(평행사변형 러그): ", { n: 16 }, " cm²", h("br"), "나(삼각형 깃발): ", { n: 10, why: { "20": "÷2를 잊었어요." } }, " cm²", h("br"), "다(마름모 장식): ", { n: 12, why: { "24": "24 cm²는 둘러싼 직사각형의 넓이예요. 마름모는 그 반이에요." } }, " cm²", h("br"), "라(사다리꼴 화단): ", { n: 16, why: { "32": "÷2를 잊었어요." } }, " cm²"] }],
        { ok: "가 4×4=16, 나 5×4÷2=10, 다 4×6÷2=12, 라 (3+5)×4÷2=16 (cm²)예요." }) },
    { name: "말해 보기 — 넓이 구하는 식 잇기", inst: "도현이가 발표할 ‘넓이 구하는 식’ 판을 만들어요. 도형에 알맞은 식을 골라 보세요.", hints: ["어떤 도형을 잘라 붙이거나 2개를 붙여 무엇을 만들었는지 떠올려요."],
      render: thenWhy((b, a) => ar6Ask(b, a, [{ parts: [
        "평행사변형: ", { o: ["(밑변)×(높이)", "(밑변)×(높이)÷2", "(윗변+아랫변)×(높이)÷2"], a: 0 }, h("br"),
        "삼각형: ", { o: ["(밑변)×(높이)", "(밑변)×(높이)÷2", "(한 대각선)×(다른 대각선)÷2"], a: 1 }, h("br"),
        "마름모: ", { o: ["(한 변)×4", "(한 대각선)×(다른 대각선)÷2", "(밑변)×(높이)÷2"], a: 1 }, h("br"),
        "사다리꼴: ", { o: ["(윗변+아랫변)×(높이)÷2", "(윗변)×(아랫변)÷2", "(밑변)×(높이)"], a: 0 }] }],
        { ok: "평행사변형 (밑변)×(높이), 삼각형 (밑변)×(높이)÷2, 마름모 (대각선)×(대각선)÷2, 사다리꼴 (윗변+아랫변)×(높이)÷2예요." }),
        { q: "여러 도형의 넓이 구하는 식이 모두 직사각형이나 평행사변형과 이어지는 까닭을 써 볼까요?", ph: "평행사변형은 ~, 삼각형과 사다리꼴은 ~", help: ["① 각 도형을 어떻게 바꾸어 넓이를 구했는지 떠올려요. → ② 바꾼 도형이 무엇이었는지 모아서 써요.", "‘평행사변형은 ~으로, 삼각형과 사다리꼴은 ~으로, 마름모는 ~으로 바꾸어 구했기 때문이에요.’ 꼴로 써요."], ans: "평행사변형은 잘라 옮겨 직사각형으로, 삼각형과 사다리꼴은 똑같은 도형 2개를 붙여 평행사변형으로, 마름모는 둘러싼 직사각형의 반으로 바꾸어 넓이를 구했기 때문이에요." }) },
    { name: "약속하기 — 발표할 도형 그리기", inst: "유찬이가 질문했어요. “넓이가 같으면 모양도 같을까?” 넓이가 12 cm²인 평행사변형, 삼각형, 사다리꼴을 차례로 그려 보여 주세요. 점을 차례로 누르고 처음 점을 다시 누르면 도형이 닫혀요.", hints: ["평행사변형: 밑변×높이=12", "삼각형: 밑변×높이=24", "사다리꼴: (윗변+아랫변)×높이=24"],
      render: (b, a) => ar6Poly(b, a, { cols: 10, rows: 7, tasks: [{ kind: "par", area: 12, label: "넓이가 12 cm²인 평행사변형 러그를 그려요." }, { kind: "tri", area: 12, label: "넓이가 12 cm²인 삼각형 깃발을 그려요." }, { kind: "trap", area: 12, label: "넓이가 12 cm²인 사다리꼴 화단을 그려요." }],
        ok: "넓이가 12 cm²로 같아도 평행사변형, 삼각형, 사다리꼴처럼 모양은 여러 가지예요." }) },
    { name: "확인하기 — 처음 궁금증 돌아보기", inst: "1차시에 붙인 ‘궁금해요’ 쪽지를 다시 보고, 공모전 준비를 마무리하는 글을 써 보세요.", hints: ["궁금했던 것을 이제 식으로 답할 수 있는지 살펴봐요.", "직접 잘라 붙여 본 활동을 떠올려요."],
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "1차시에 궁금했던 것 하나에 이제 답해 보세요.", tag: "궁금증에 답하기", ph: "예) 사다리꼴 화단의 넓이가 궁금했어요. ~", help: ["① 궁금했던 것을 하나 골라요. → ② 알맞은 식을 쓰고 → ③ 우리 설계도의 수로 답을 구해요.", "‘~이 궁금했어요. ~이므로 ~로 구해요. 우리 설계도는 ~예요.’ 꼴로 써요."], ans: "사다리꼴 모양 화단의 넓이가 궁금했어요. 똑같은 사다리꼴 2개를 붙이면 평행사변형이 되므로 (윗변+아랫변)×(높이)÷2로 구해요. 우리 화단 설계도는 (3+7)×4÷2=20 (cm²)예요." },
        { q: "꿈의 교실 설계도를 만들며 가장 기억에 남는 넓이 구하는 방법을 소개해 보세요.", tag: "기억에 남는 방법", ph: "예) 평행사변형 러그를 높이를 따라 잘라 ~", help: ["① 가장 기억에 남는 도형과 활동을 골라요. → ② 어떻게 바꾸어 넓이를 구했는지 차례대로 써요.", "‘~을 ~해서 ~으로 바꾸었더니 넓이를 ~로 구할 수 있었어요.’ 꼴로 써요."], ans: "평행사변형 러그를 높이를 따라 잘라 삼각형 조각을 반대쪽으로 옮겼더니 직사각형이 되었어요. 그래서 넓이를 (밑변)×(높이)인 6×4=24 (cm²)로 구할 수 있었어요." }])) }
  ],
  challenge: { inst: "공모전 심사 위원이 낸 마지막 문제예요. 배운 것을 모아 해결해 보세요.", hints: ["ㄱ자 모양은 직사각형 2개로 나누어 넓이를 구해요.", "둘레는 바깥 테두리의 길이를 모두 더해요."],
    render: (b, a) => ar6Ask(b, a, [
      { q: "모눈 한 칸은 1 cm예요. 교실 설계도의 ㄱ자 모양 독서 공간의 둘레와 넓이를 구해 보세요.", fig: () => ar6Static({ cols: 9, rows: 7, k: 28, shapes: [{ P: [[1, 1], [8, 1], [8, 3], [4, 3], [4, 6], [1, 6]], fill: AR6.f3 }], maxW: "16em" }),
        parts: ["둘레: ", { n: 24 }, " cm, 넓이: ", { n: 23, why: { "35": "35 cm²는 둘러싼 직사각형의 넓이예요. 빈 곳을 빼요." } }, " cm²"] },
      { q: "넓이가 다른 하나는?  가: 밑변 8 cm, 높이 3 cm인 삼각형  나: 밑변 4 cm, 높이 3 cm인 평행사변형  다: 윗변 2 cm, 아랫변 6 cm, 높이 3 cm인 사다리꼴  라: 대각선이 8 cm, 4 cm인 마름모", parts: [{ o: ["가", "나", "다", "라"], a: 3 }] }],
      { ok: "둘레 24 cm, 넓이 7×2+3×3=23 (cm²)예요. 가·나·다는 12 cm², 라는 16 cm²예요. 꿈의 교실 설계도 완성!" }) }
}
];
