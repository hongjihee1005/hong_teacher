//@@APP
const APP={};
//@@UNIT
/* =========================================================
   6-2 수학 5. 원의 둘레와 넓이 — 이야기 버전 단원 조작 부품 (앞글자 ci6, 이야기 전용 ci6s)
   교과서 버전(u5-circle.tb.js)의 ci6 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   기다리는 시간: 입력칸 900ms(Enter는 blur) · 보기 고르기 260ms(입력칸이 함께 있으면 600ms) · 끌기·색칠·막대 1200ms(손을 뗀 뒤).
   한 계단에 활동이 둘이면(hj-multi) 부품 함수 몸통에 done( 이 있어야 활동으로 세어져요 — 부품마다 api.done 경로를 적어 둠.
   원주율은 교과서대로 3.14로 계산해요(계산 결과는 ci6R로 반올림해 소수 오차를 없앰).
   ci6Ask     빈칸 고르기·수 쓰기 묶음(계산기 열기 포함)   ci6Chain / ci6Then  활동 잇기
   ci6Scene   수학 체험 마을에서 원 찾기                     ci6String  같은 길이 끈으로 만든 도형에 바둑돌 넣기
   ci6Wheel   나무 바퀴에 원의 중심·지름·둘레 표시하기       ci6Unroll  원을 굴리고 정육각형·정사각형 둘레를 수직선에 늘이기
   ci6Lab     삼각자로 지름 재고 실로 원주 재기             ci6Roll    물레방아 바퀴 한 바퀴 굴리기
   ci6Diam    지름을 바꾸며 원주 맞추기                     ci6InOut   원 안·밖 정사각형 그리기
   ci6Grid    모눈 칸 칠해 원의 넓이 어림하기               ci6Cut     원을 잘라 이어 붙이기(8·16·32·64등분)
   ci6Move    조각을 옮겨 모양 바꾸기                       ci6Make    원 모양 물건으로 넓이 문제 만들기
   ci6Land    땅을 더 넓게 차지해 보아요(주사위 놀이)       ci6Calc    계산기
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.ci6fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none;user-select:none;-webkit-user-select:none}
.ci6fig.ci6plain{background:transparent;border:none}
.ci6small{font-size:var(--fs-s);color:var(--muted)}
.ci6part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.ci6read{font-family:"Jua",sans-serif;font-size:var(--fs);color:var(--night);line-height:1.5;word-break:keep-all;min-height:1.5em;margin:.3em 0}
.ci6row{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-start}
.ci6row>div{flex:1 1 14em;min-width:0}
.ci6btns{display:flex;flex-wrap:wrap;gap:.35em;align-items:center;margin:.3em 0}
.ci6btns button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em;min-height:2.2em;font-family:"Jua",sans-serif}
.ci6btns button.ci6-pick{background:var(--night);color:#fff;border-color:var(--night)}
.ci6btns button:disabled{opacity:.45}
.ci6tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.ci6tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.ci6tbl th,.ci6tbl td{border:1.5px solid var(--line);padding:.25em .6em;text-align:center}
.ci6tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.ci6box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all;margin:.4em 0}
.ci6talk{display:grid;gap:.35em;margin:.4em 0}
.ci6talk>div{background:#F4F8FB;border:1.5px solid var(--line);border-radius:12px;padding:.3em .7em;word-break:keep-all}
.ci6talk b{font-family:"Jua",sans-serif;font-weight:400;color:var(--night);margin-right:.3em}
.ci6cwrap{margin:.4em 0}
.ci6ctog{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .8em;min-height:2.2em;font-family:"Jua",sans-serif}
.ci6calc{margin-top:.35em;max-width:17em;background:#F2F5F4;border:2px solid var(--line);border-radius:12px;padding:.45em}
.ci6cdisp{width:100%;box-sizing:border-box;font-size:1.15em;text-align:right;padding:.25em .4em;margin-bottom:.35em;background:#fff}
.ci6ckeys{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.3em}
.ci6ckeys button{min-height:2.3em;border:2px solid var(--line);background:#fff;border-radius:.5em;font-family:"Jua",sans-serif;font-size:1.05em}
.ci6chips{display:flex;flex-wrap:wrap;gap:.35em;margin:.3em 0}
.ci6chips button{border:2px solid var(--line);background:#fff;border-radius:999px;padding:.2em .9em;min-height:2.2em;font-family:"Jua",sans-serif}
.ci6chips button.ci6-pick{border-color:var(--ring);background:#EAF3FD;box-shadow:0 0 0 2px var(--ring) inset}
.ci6score{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4em;margin:.3em 0}
.ci6pl{border:2.5px solid var(--line);border-radius:12px;padding:.3em .5em;background:#fff;text-align:center;font-family:"Jua",sans-serif;min-width:0}
.ci6pl.ci6-turn{box-shadow:0 0 0 3px var(--ring) inset}
.ci6die{display:inline-block;min-width:2em;text-align:center;font-family:"Jua",sans-serif;font-size:1.6em;border:2.5px solid var(--night);border-radius:.3em;background:#fff;padding:0 .2em;margin:0 .3em;vertical-align:middle}
`;
  document.head.append(s);
})();

/* ---------- 기본 도구 ---------- */
const CI6 = { ink: "#1D2A2A", grid: "#D7E1E9", blue: "#2B7BD6", red: "#D64545", green: "#2E8B57", org: "#E47A38", purple: "#7A5BB0", gray: "#8795A1",
  wood: "#D9A066", wood2: "#8A5A2B", pink: "#F4A7B4", sky: "#EAF4FB", grass: "#DDEFD7", water: "#BFE0F5" };
const CI6_PI = 3.14;
const ci6R = v => Math.round(v * 10000) / 10000;
const ci6S = v => String(ci6R(v));
const ci6Area = r => ci6R(r * r * CI6_PI);
const ci6Circ = d => ci6R(d * CI6_PI);
/* 받침에 따라 조사 고르기: ci6Jo("문", "은/는") → "문은" */
function ci6Jo(w, pair) {
  const s = String(w), [a, b] = pair.split("/"), c = s.trim().slice(-1);
  let bat = false, rieul = false;
  if (/[0-9]/.test(c)) { bat = "0136780".includes(c); rieul = "178".includes(c); }
  else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  if (pair === "으로/로") return s + (bat && !rieul ? "으로" : "로");
  return s + (bat ? a : b);
}
function ci6Num(s) {
  const t = String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/(cm²|m²|cm|m|원|배|칸|개|판)$/i, "");
  return t === "" || !/^-?\d+(\.\d+)?$/.test(t) ? NaN : Number(t);
}
function ci6Fig(W, H, draw, maxW, plain) { const s = makeSvg(W, H); draw(s); s.setAttribute("class", "ci6fig" + (plain ? " ci6plain" : "")); s.style.maxWidth = maxW || "30em"; return s; }
const ci6Go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
const ci6P = (x, y) => `${ci6R(x)},${ci6R(y)}`;
function ci6SegDist(p, a, b) {
  const vx = b.x - a.x, vy = b.y - a.y, L = vx * vx + vy * vy;
  const t = L ? Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / L)) : 0;
  return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
}
function ci6Line(s, x1, y1, x2, y2, col, w, extra) { const e = svgEl("line", Object.assign({ x1: ci6R(x1), y1: ci6R(y1), x2: ci6R(x2), y2: ci6R(y2), stroke: col || CI6.ink, "stroke-width": w || 2, "stroke-linecap": "round" }, extra || {})); s.append(e); return e; }
function ci6Circle(s, cx, cy, r, attrs) { const e = svgEl("circle", Object.assign({ cx: ci6R(cx), cy: ci6R(cy), r: ci6R(r), fill: "none", stroke: CI6.ink, "stroke-width": 2 }, attrs || {})); s.append(e); return e; }
function ci6Poly(s, pts, attrs) { const e = svgEl("polygon", Object.assign({ points: pts.map(p => ci6P(p[0], p[1])).join(" "), fill: "none", stroke: CI6.ink, "stroke-width": 2 }, attrs || {})); s.append(e); return e; }
/* 길이 표시(양쪽 끝 짧은 막대 + 글) */
function ci6Dim(s, x1, y1, x2, y2, label, col, off) {
  const c = col || CI6.ink, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L * 6, ny = dx / L * 6;
  ci6Line(s, x1, y1, x2, y2, c, 1.6); ci6Line(s, x1 - nx, y1 - ny, x1 + nx, y1 + ny, c, 1.6); ci6Line(s, x2 - nx, y2 - ny, x2 + nx, y2 + ny, c, 1.6);
  const o = off == null ? 14 : off;
  s.append(txt(ci6R((x1 + x2) / 2 - dy / L * o), ci6R((y1 + y2) / 2 + dx / L * o), label, 15, { fill: c }));
}

/* ---------- 계산기 ---------- */
function ci6Eval(s) {
  const t = String(s).replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  if (!t || !/^[0-9+\-*/.() ]+$/.test(t)) return null;
  try { const v = Function('"use strict";return (' + t + ')')(); return isFinite(v) ? Number(v.toFixed(10)) : null; } catch (e) { return null; }
}
function ci6Calc() {
  const disp = h("input", { type: "text", class: "ci6cdisp", readonly: "readonly", value: "0", "aria-label": "계산기 화면" });
  let expr = "";
  const press = k => {
    if (k === "C") expr = "";
    else if (k === "⌫") expr = expr.slice(0, -1);
    else if (k === "=") { const r = ci6Eval(expr); if (r == null) { disp.value = "식을 다시 눌러요"; expr = ""; return; } disp.value = expr + " = " + r; expr = String(r); return; }
    else expr += k;
    disp.value = expr || "0";
  };
  const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+", "C", "⌫", "(", ")"];
  const pad = h("div", { class: "ci6ckeys" }, ...keys.map(k => h("button", { type: "button", onclick: () => press(k) }, k)));
  const panel = h("div", { class: "ci6calc hidden" }, disp, pad);
  const tog = h("button", { type: "button", class: "ci6ctog", onclick: () => panel.classList.toggle("hidden") }, "계산기 열기·닫기");
  return h("div", { class: "ci6cwrap" }, tog, panel);
}
function ci6Talk(rows) { return h("div", { class: "ci6talk" }, ...rows.map(([who, say]) => h("div", {}, h("b", {}, who), say))); }

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기, 여러 개 고르기 multi) ---------- */
function ci6Ask(host, api, items, opts = {}) {
  const wrap = h("div", { style: "margin-top:.6em" }), all = [];
  if (opts.title) wrap.append(h("p", { class: "inst" }, opts.title));
  if (opts.calc) wrap.append(ci6Calc());
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
        const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "답", style: `width:${pt.w || "4.6em"};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : ci6S(pt.n);
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : pt.nodeType ? " " : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : Math.abs(ci6Num(s.inp.value) - s.pt.n) < 1e-9;
  const val = s => s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-");
  const filled = s => s.pt.o ? (s.pt.multi ? s.v.size >= s.pt.a.length : s.v != null) : s.inp.value.trim() !== "";
  const check = () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); });
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) { all.forEach(s => { if (s.inp) s.inp.readOnly = true; }); api.done(ans, opts.ok); return true; }
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(ci6Num(bad.inp.value));
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
/* 여러 활동을 차례로: 앞 활동을 해결하면 아래 활동이 열려요 */
function ci6Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "ci6part" : "" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); ci6Go(body.lastChild);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}
/* 조작을 마친 뒤 물음(ask)으로 이어 가기 */
function ci6Then(body, api, opt, ans, msg) {
  if (body.ci6Fin) return; body.ci6Fin = true;
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "ci6part" }); body.append(box); opt.then(box, api); ci6Go(box); return; }
  body.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
  const ask = typeof opt.ask === "function" ? opt.ask() : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = ci6Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle, bad: opt.bad, calc: opt.calc }); ci6Go(w); }
  else api.done(ans, opt.ok || msg);
}

/* ---------- 그림 모음 ---------- */
/* 원 안에 꼭 맞는 정육각형과 원 밖에 꼭 맞는 정사각형 */
function ci6HexSqFig(label, maxW) {
  return ci6Fig(300, 240, s => {
    const C = { x: 150, y: 120 }, r = 90;
    ci6Poly(s, [[C.x - r, C.y - r], [C.x + r, C.y - r], [C.x + r, C.y + r], [C.x - r, C.y + r]], { stroke: CI6.red, "stroke-width": 3, fill: "#FDECEC" });
    ci6Circle(s, C.x, C.y, r, { fill: "#fff", stroke: CI6.blue, "stroke-width": 3 });
    ci6Poly(s, [0, 1, 2, 3, 4, 5].map(k => [C.x + r * Math.cos(k * Math.PI / 3), C.y + r * Math.sin(k * Math.PI / 3)]), { stroke: CI6.green, "stroke-width": 3, fill: "#E3F4EA" });
    ci6Circle(s, C.x, C.y, 3.5, { fill: CI6.ink, stroke: "none" });
    ci6Line(s, C.x, C.y, C.x + r, C.y, CI6.ink, 2);
    s.append(txt(C.x + r / 2, C.y - 13, label, 16));
  }, maxW || "13em");
}
/* 원 안·밖 정사각형(원 안 정사각형은 꼭짓점이 원 위) */
function ci6SqFig(label, maxW) {
  return ci6Fig(300, 240, s => {
    const C = { x: 150, y: 120 }, r = 90;
    ci6Poly(s, [[C.x - r, C.y - r], [C.x + r, C.y - r], [C.x + r, C.y + r], [C.x - r, C.y + r]], { stroke: CI6.red, "stroke-width": 3, fill: "#FDECEC" });
    ci6Circle(s, C.x, C.y, r, { fill: "#FFF8E8", stroke: CI6.ink, "stroke-width": 2.5 });
    ci6Poly(s, [[C.x, C.y - r], [C.x + r, C.y], [C.x, C.y + r], [C.x - r, C.y]], { stroke: CI6.green, "stroke-width": 3, fill: "#E3F4EA" });
    ci6Line(s, C.x - r, C.y, C.x + r, C.y, CI6.green, 1.6, { "stroke-dasharray": "5 4" }); ci6Line(s, C.x, C.y - r, C.x, C.y + r, CI6.green, 1.6, { "stroke-dasharray": "5 4" });
    ci6Circle(s, C.x, C.y, 3.5, { fill: CI6.ink, stroke: "none" });
    s.append(txt(C.x + r / 2, C.y - 12, label, 16));
  }, maxW || "13em");
}
/* 원 안·밖 정육각형(수학익힘 유사 3) */
function ci6HexHexFig() {
  return ci6Fig(320, 280, s => {
    const C = { x: 160, y: 140 }, r = 100, R = r / Math.cos(Math.PI / 6);
    const hex = rr => [0, 1, 2, 3, 4, 5].map(k => [C.x + rr * Math.cos(k * Math.PI / 3 - Math.PI / 2), C.y + rr * Math.sin(k * Math.PI / 3 - Math.PI / 2)]);
    const O = hex(R), I = hex(r);
    ci6Poly(s, O, { stroke: CI6.red, "stroke-width": 3, fill: "#FDECEC" });
    ci6Circle(s, C.x, C.y, r, { fill: "#fff", stroke: CI6.blue, "stroke-width": 2.5 });
    ci6Poly(s, I, { stroke: CI6.green, "stroke-width": 3, fill: "#E3F4EA" });
    ci6Poly(s, [[C.x, C.y], O[1], O[2]], { stroke: CI6.red, "stroke-width": 2, fill: "rgba(214,69,69,.18)" });
    ci6Poly(s, [[C.x, C.y], I[4], I[5]], { stroke: CI6.green, "stroke-width": 2, fill: "rgba(46,139,87,.25)" });
    s.append(txt(I[4][0] - 12, I[4][1] - 4, "ㄱ", 16, { fill: CI6.green }), txt(I[5][0] + 2, I[5][1] - 14, "ㄴ", 16, { fill: CI6.green }),
      txt(O[1][0] + 14, O[1][1], "ㄷ", 16, { fill: CI6.red }), txt(O[2][0] + 14, O[2][1] + 4, "ㄹ", 16, { fill: CI6.red }), txt(C.x - 14, C.y + 4, "ㅇ", 16));
    ci6Circle(s, C.x, C.y, 3.5, { fill: CI6.ink, stroke: "none" });
  }, "14em");
}
/* 원의 구성 요소 그림 */
function ci6PartsFig() {
  return ci6Fig(300, 240, s => {
    const C = { x: 150, y: 120 }, r = 95;
    ci6Circle(s, C.x, C.y, r, { fill: "#FFF8E8", "stroke-width": 2.5 });
    ci6Line(s, C.x - r * Math.cos(.5), C.y + r * Math.sin(.5), C.x + r * Math.cos(.5), C.y - r * Math.sin(.5), CI6.blue, 3);
    ci6Line(s, C.x, C.y, C.x - r * Math.cos(1.2), C.y - r * Math.sin(1.2), CI6.red, 3);
    ci6Circle(s, C.x, C.y, 4, { fill: CI6.ink, stroke: "none" });
    s.append(txt(C.x + 16, C.y + 14, "ㅇ", 17), txt(C.x - r * Math.cos(1.2) - 6, C.y - r * Math.sin(1.2) - 14, "ㄱ", 17, { fill: CI6.red }),
      txt(C.x - r * Math.cos(.5) - 16, C.y + r * Math.sin(.5) + 8, "ㄴ", 17, { fill: CI6.blue }), txt(C.x + r * Math.cos(.5) + 16, C.y - r * Math.sin(.5) - 6, "ㄷ", 17, { fill: CI6.blue }));
  }, "12em");
}
/* 단원 도입: 지구 주위를 도는 인공위성 */
function ci6SatFig() {
  return ci6Fig(420, 250, s => {
    s.append(svgEl("rect", { x: 0, y: 0, width: 420, height: 250, fill: "#1E2A44", rx: 10 }));
    [[30, 30], [380, 40], [60, 210], [350, 220], [210, 20], [120, 90], [300, 160]].forEach(([x, y]) => ci6Circle(s, x, y, 1.6, { fill: "#fff", stroke: "none" }));
    ci6Circle(s, 210, 125, 105, { stroke: "#9FC4F0", "stroke-width": 2, "stroke-dasharray": "7 6" });
    ci6Circle(s, 210, 125, 62, { fill: "#4A90D9", stroke: "#BFE0F5", "stroke-width": 2 });
    s.append(svgEl("path", { d: "M180,90 q18,-12 34,0 q10,12 -4,22 q-14,6 -22,18 q-14,-6 -12,-22 z M225,135 q20,-4 22,14 q-6,16 -24,10 z", fill: "#7CC47F" }));
    const g = svgEl("g", { transform: "translate(298,72) rotate(35)" });
    g.append(svgEl("rect", { x: -9, y: -7, width: 18, height: 14, fill: "#E8E8E8", stroke: "#555" }), svgEl("rect", { x: -34, y: -5, width: 22, height: 10, fill: "#4C7BD9", stroke: "#BFD3F6" }), svgEl("rect", { x: 12, y: -5, width: 22, height: 10, fill: "#4C7BD9", stroke: "#BFD3F6" }));
    s.append(g, txt(210, 125, "지구", 18, { fill: "#fff" }), txt(345, 40, "인공위성", 15, { fill: "#FFE7A0" }));
  }, "24em");
}
/* 중심이 같은 두 원(도넛 모양) */
function ci6DonutFig(rOut, rIn, k, labIn, labOut, unit, maxW) {
  const R = rOut * k, r = rIn * k, W = 2 * R + 60, H = 2 * R + 40, C = { x: W / 2, y: H / 2 };
  return ci6Fig(W, H, s => {
    ci6Circle(s, C.x, C.y, R, { fill: CI6.pink, stroke: CI6.ink, "stroke-width": 2.5 });
    ci6Circle(s, C.x, C.y, r, { fill: "#fff", stroke: CI6.ink, "stroke-width": 2.5 });
    ci6Circle(s, C.x, C.y, 3, { fill: CI6.ink, stroke: "none" });
    ci6Line(s, C.x, C.y, C.x + r, C.y, CI6.blue, 2.5);
    s.append(txt(C.x + r / 2, C.y - 12, labIn, 14, { fill: CI6.blue }));
    if (labOut[0] === "band") { ci6Line(s, C.x - r, C.y, C.x - R, C.y, CI6.red, 2.5); s.append(txt(C.x - (r + R) / 2, C.y - 12, labOut[1], 14, { fill: CI6.red })); }
    else { ci6Line(s, C.x, C.y, C.x - R * .6, C.y + R * .8, CI6.red, 2.5); s.append(txt(C.x - R * .3 - 18, C.y + R * .4 + 6, labOut[1], 14, { fill: CI6.red })); }
  }, maxW || "14em");
}
/* 직사각형 양쪽에 반원 */
function ci6StadiumFig(w, hgt, k, labW, labH, fill, maxW) {
  const W = w * k + hgt * k + 90, H = hgt * k + 70, x0 = 30 + hgt * k / 2, y0 = 25, r = hgt * k / 2;
  return ci6Fig(W, H, s => {
    s.append(svgEl("path", { d: `M${x0},${y0} L${x0 + w * k},${y0} A${r},${r} 0 0 1 ${x0 + w * k},${y0 + 2 * r} L${x0},${y0 + 2 * r} A${r},${r} 0 0 1 ${x0},${y0} Z`, fill: fill || "#CFE8C9", stroke: CI6.ink, "stroke-width": 2.5 }));
    ci6Line(s, x0, y0, x0, y0 + 2 * r, CI6.gray, 1.5, { "stroke-dasharray": "5 4" }); ci6Line(s, x0 + w * k, y0, x0 + w * k, y0 + 2 * r, CI6.gray, 1.5, { "stroke-dasharray": "5 4" });
    ci6Dim(s, x0, y0 + 2 * r + 16, x0 + w * k, y0 + 2 * r + 16, labW, CI6.ink, 14);
    ci6Dim(s, x0 + w * k + r + 14, y0, x0 + w * k + r + 14, y0 + 2 * r, labH, CI6.ink, -22);
  }, maxW || "18em");
}
/* 피자 그림(위에서 본 모습) */
function ci6PizzaG(r) {
  const g = svgEl("g");
  g.append(svgEl("circle", { cx: 0, cy: 0, r, fill: "#E9B460", stroke: "#B5792C", "stroke-width": 3 }), svgEl("circle", { cx: 0, cy: 0, r: r * .86, fill: "#F6D27A" }));
  [[.4, .2], [-.35, .35], [-.2, -.45], [.3, -.4], [.05, .02], [.55, -.1], [-.55, -.05]].forEach(([a, b]) => g.append(svgEl("circle", { cx: ci6R(a * r), cy: ci6R(b * r), r: ci6R(r * .11), fill: "#C8463C" })));
  return g;
}
/* 판(메뉴)마다 피자를 같은 비율로 그리고, 끌어서 겹쳐 볼 수 있어요 */
function ci6PizzaFig(menus, k) {
  const W = 560, H = 260;
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "32em";
  const pcs = [];
  menus.forEach((m, mi) => {
    const cx0 = mi === 0 ? 140 : 420;
    s.append(txt(cx0, 22, m.name, 17, { fill: mi ? CI6.blue : CI6.red }), txt(cx0, 244, `지름 ${m.d} cm · ${m.n}판 · ${m.price}원`, 14));
    for (let i = 0; i < m.n; i++) {
      const r = m.d / 2 * k, cx = m.n === 1 ? cx0 : cx0 + (i ? 1 : -1) * (r + 6), cy = 130;
      const g = ci6PizzaG(r); g.setAttribute("transform", `translate(${cx},${cy})`); g.style.cursor = "grab"; g.dataset.pc = pcs.length;
      pcs.push({ g, x: cx, y: cy }); s.append(g);
    }
  });
  let cur = null, off = null;
  dragOn(s, (p, e) => { const t = e.target.closest && e.target.closest("[data-pc]"); if (!t) return false; cur = pcs[+t.dataset.pc]; off = { x: p.x - cur.x, y: p.y - cur.y }; s.append(cur.g); return true; },
    p => { if (!cur) return; cur.x = Math.max(0, Math.min(W, p.x - off.x)); cur.y = Math.max(0, Math.min(H, p.y - off.y)); cur.g.setAttribute("transform", `translate(${ci6R(cur.x)},${ci6R(cur.y)})`); },
    () => { cur = null; });
  return h("div", {}, s, h("p", { class: "ci6small" }, "피자를 끌어 옮기면 서로 겹쳐 볼 수 있어요."));
}

/* ---------- 1차시: 수학 체험 마을에서 원 찾기 ---------- */
function ci6Scene(body, api, opt) {   /* 끝나면 ci6Then → api.done( */
  const W = 640, H = 360, s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "36em";
  /* 새봄초등학교 운동장 옆 빈터 */
  s.append(svgEl("rect", { x: 0, y: 0, width: W, height: 200, fill: CI6.sky }), svgEl("rect", { x: 0, y: 200, width: W, height: 160, fill: "#E9DCC3" }));
  s.append(svgEl("rect", { x: 300, y: 200, width: 340, height: 160, fill: CI6.grass }));
  const items = [], found = new Set();
  const add = (name, circ, draw, ring) => { const g = svgEl("g", { "data-it": items.length }); g.style.cursor = "pointer"; draw(g); s.append(g); items.push({ name, circ, g, ring }); };
  /* 학교 건물 */
  add("학교 건물 벽", false, g => g.append(svgEl("rect", { x: 20, y: 60, width: 250, height: 140, fill: "#F3E6D3", stroke: "#B59A7A", "stroke-width": 3 })));
  add("교실 창문", false, g => { [[38, 120], [88, 120], [190, 120], [240, 120]].forEach(([x, y]) => g.append(svgEl("rect", { x: x - 2, y, width: 34, height: 30, fill: "#BFE0F5", stroke: "#8AA5B8", "stroke-width": 2.5 }))); });
  add("현관문", false, g => g.append(svgEl("rect", { x: 128, y: 140, width: 44, height: 60, fill: "#9C6B3E", stroke: "#5C3A1A", "stroke-width": 3 })));
  add("학교 시계", true, g => { g.append(svgEl("circle", { cx: 150, cy: 96, r: 22, fill: "#fff", stroke: "#4A6A8A", "stroke-width": 4 })); ci6Line(g, 150, 96, 150, 82, CI6.ink, 3); ci6Line(g, 150, 96, 161, 100, CI6.ink, 3); }, [150, 96, 30]);
  /* 국기 게양대와 축구 골대 */
  add("국기 게양대 깃발", false, g => { g.append(svgEl("rect", { x: 284, y: 40, width: 5, height: 170, fill: "#8795A1" }), svgEl("rect", { x: 289, y: 42, width: 44, height: 28, fill: "#fff", stroke: "#8795A1", "stroke-width": 2 })); });
  add("축구 골대", false, g => { g.append(svgEl("path", { d: "M470,232 L470,170 L620,170 L620,232", fill: "none", stroke: "#fff", "stroke-width": 7 })); for (let x = 485; x < 620; x += 15) ci6Line(g, x, 172, x, 232, "#E8EEF2", 1.5); });
  /* 둥근 화단, 맨홀 뚜껑, 자전거, 훌라후프 */
  add("둥근 화단", true, g => { g.append(svgEl("circle", { cx: 395, cy: 290, r: 46, fill: "#8CC084", stroke: "#8A6A45", "stroke-width": 6 })); [[0, 0], [18, -16], [-20, 10], [12, 22], [-14, -20], [26, 8]].forEach(([a, b], i) => g.append(svgEl("circle", { cx: 395 + a, cy: 290 + b, r: 6, fill: ["#F28C9C", "#FFD24D", "#F28C9C", "#B58CE0", "#FFD24D", "#F28C9C"][i] }))); }, [395, 290, 56]);
  add("맨홀 뚜껑", true, g => { g.append(svgEl("circle", { cx: 220, cy: 300, r: 28, fill: "#7C8794", stroke: "#4A5563", "stroke-width": 4 })); ci6Circle(g, 220, 300, 18, { stroke: "#5E6875", "stroke-width": 2 }); }, [220, 300, 36]);
  add("자전거 바퀴", true, g => { [[70, 300], [150, 300]].forEach(([x, y]) => { ci6Circle(g, x, y, 28, { stroke: "#33404D", "stroke-width": 5 }); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ci6Line(g, x, y, x + 25 * Math.cos(a), y + 25 * Math.sin(a), "#9AA5AE", 1.5); } }); g.append(svgEl("path", { d: "M70,300 L102,262 L150,300 M102,262 L140,262 L150,300 M98,255 L112,255", fill: "none", stroke: "#2B7BD6", "stroke-width": 4, "stroke-linecap": "round" })); }, [[70, 300, 36], [150, 300, 36]]);
  add("훌라후프", true, g => { ci6Circle(g, 545, 290, 40, { stroke: "#E47A38", "stroke-width": 7 }); }, [545, 290, 50]);
  const need = items.filter(it => it.circ).length;
  const say = h("p", { class: "ci6read" }, `원 모양을 찾아 눌러요. (0/${need})`);
  const rings = svgEl("g", { "pointer-events": "none" }); s.append(rings);
  s.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest("[data-it]"); if (!t || body.ci6Fin) return;
    const it = items[+t.dataset.it];
    if (!it.circ) { api.tryOnce(); return api.fail(`${ci6Jo(it.name, "은/는")} 원 모양이 아니에요. 어느 쪽에서 보아도 둥글고 끝이 없는 모양을 찾아요.`, it.name); }
    if (found.has(it.name)) return;
    found.add(it.name); (Array.isArray(it.ring[0]) ? it.ring : [it.ring]).forEach(q => ci6Circle(rings, q[0], q[1], q[2], { stroke: CI6.green, "stroke-width": 4, "stroke-dasharray": "8 5" }));
    say.textContent = `원 모양을 찾아 눌러요. (${found.size}/${need}) ${[...found].join(", ")}`;
    if (found.size === need) ci6Then(body, api, opt, [...found].join(", "), "학교 곳곳의 원을 모두 찾았어요.");
    else api.hint(`○ ${ci6Jo(it.name, "을/를")} 찾았어요.`);
  });
  body.append(say, s);
}

/* ---------- 1차시 도전: 같은 길이의 끈으로 만든 도형에 바둑돌 넣기 ---------- */
function ci6String(body, api, opt) {   /* 끝나면 ci6Then → api.done( */
  const P = opt.P || 24, k = 22, W = 420, H = 300, C = { x: 198, y: 132 };   // 1칸 = 1 cm, 바둑돌은 1 cm 간격
  const shapes = {
    tri: { name: "정삼각형", inside: (x, y, m) => { const a = P / 3, hh = a * Math.sqrt(3) / 2, V = [[0, -hh * 2 / 3], [a / 2, hh / 3], [-a / 2, hh / 3]]; return V.every(([x1, y1], e) => { const [x2, y2] = V[(e + 1) % 3]; return ((x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)) / Math.hypot(x2 - x1, y2 - y1) >= m; }); },
      draw: g => { const a = P / 3, hh = a * Math.sqrt(3) / 2; ci6Poly(g, [[C.x, C.y - hh * 2 / 3 * k], [C.x + a / 2 * k, C.y + hh / 3 * k], [C.x - a / 2 * k, C.y + hh / 3 * k]], { stroke: CI6.red, "stroke-width": 4 }); } },
    sq: { name: "정사각형", inside: (x, y, m) => Math.abs(x) <= P / 8 - m && Math.abs(y) <= P / 8 - m, draw: g => ci6Poly(g, [[C.x - P / 8 * k, C.y - P / 8 * k], [C.x + P / 8 * k, C.y - P / 8 * k], [C.x + P / 8 * k, C.y + P / 8 * k], [C.x - P / 8 * k, C.y + P / 8 * k]], { stroke: CI6.red, "stroke-width": 4 }) },
    ci: { name: "원", inside: (x, y, m) => Math.hypot(x, y) <= P / (2 * Math.PI) - m, draw: g => ci6Circle(g, C.x, C.y, P / (2 * Math.PI) * k, { stroke: CI6.red, "stroke-width": 4 }) } };
  /* 바둑돌 자리: 1 cm 간격 점. 바둑돌(반지름 8/k cm)이 끈 안에 통째로 들어가야 하고, 도형마다 가장 많이 들어가게 점의 자리를 0.05 cm씩 옮겨 고름 */
  const SR = 8 / k;
  const count = sh => { let best = { n: -1, pts: [] }; for (let dx = 0; dx < 1; dx += .05) for (let dy = 0; dy < 1; dy += .05) { const pts = []; for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const x = i + dx, y = j + dy; if (shapes[sh].inside(x, y, SR)) pts.push([x, y]); } if (pts.length > best.n) best = { n: pts.length, pts }; } return best; };
  const res = {}; Object.keys(shapes).forEach(kk => { res[kk] = count(kk); });
  const best = Object.keys(shapes).reduce((a, b) => res[a].n >= res[b].n ? a : b);
  const s = makeSvg(W, H, k); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "24em";
  const lay = svgEl("g"); s.append(lay);
  const say = h("p", { class: "ci6read" }, `도형을 골라 끈 ${P} cm로 만들어 보세요.`);
  const seen = new Set(), chips = h("div", { class: "ci6chips" });
  const show = kk => {
    lay.innerHTML = ""; shapes[kk].draw(lay);
    res[kk].pts.forEach(([x, y]) => lay.append(svgEl("circle", { cx: ci6R(C.x + x * k), cy: ci6R(C.y + y * k), r: 8, fill: "#2B2B2B", stroke: "#000" })));
    [...chips.children].forEach(b => b.classList.toggle("ci6-pick", b.dataset.k === kk));
    seen.add(kk); say.textContent = `끈 ${P} cm로 만든 ${shapes[kk].name}에는 바둑돌이 ${res[kk].n}개 들어가요.`;
    if (seen.size === 3) ci6Then(body, api, Object.assign({}, opt, { ask: [{ q: "끈의 길이가 같을 때 바둑돌이 가장 많이 들어가는 도형은 무엇인가요?", parts: [{ o: ["정삼각형", "정사각형", "원"], a: ["tri", "sq", "ci"].indexOf(best) }] },
      { q: "둘레가 같을 때 넓이가 가장 넓은 도형은", parts: [{ o: ["정삼각형", "정사각형", "원"], a: ["tri", "sq", "ci"].indexOf(best) }, "이에요."] }] }), "", "세 도형을 모두 만들어 보았어요.");
  };
  Object.keys(shapes).forEach(kk => chips.append(h("button", { type: "button", "data-k": kk, onclick: () => show(kk) }, shapes[kk].name)));
  body.append(chips, say, s);
}

/* ---------- 2차시: 나무 바퀴에 원의 중심·지름·둘레 표시하기 ---------- */
function ci6Wheel(body, api, opt) {
  const W = 420, C = { x: 210, y: 210 }, R = 170, NM = opt.names || {};
  const s = makeSvg(W, W); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "21em";
  /* 쉼터에 놓을 둥근 나무 탁자(위에서 본 모습) */
  ci6Circle(s, C.x, C.y, R, { fill: "#E6BE8A", stroke: CI6.wood2, "stroke-width": 4 });
  [-110, -60, -10, 40, 90].forEach((dy, i) => { const hw = Math.sqrt(Math.max(0, (R - 12) ** 2 - dy * dy)); s.append(svgEl("path", { d: `M${ci6R(C.x - hw)},${C.y + dy} C${ci6R(C.x - hw / 3)},${C.y + dy - 14 + i * 3} ${ci6R(C.x + hw / 3)},${C.y + dy + 14 - i * 3} ${ci6R(C.x + hw)},${C.y + dy}`, fill: "none", stroke: "#C99A62", "stroke-width": 2.5 })); });
  const lay = svgEl("g", { "pointer-events": "none" }); s.append(lay);
  const msgs = opt.msgs || ["① 바퀴에서 찾을 수 있는 가장 큰 원의 중심을 눌러요.", "② 가장 큰 원의 둘레(바퀴의 가장 바깥) 위의 한 점에서 원의 중심을 지나 반대쪽 둘레까지 끌어 지름을 그어요.", "③ 가장 큰 원의 둘레를 따라 한 바퀴 그려요.", "가장 큰 원의 중심, 지름, 둘레를 모두 표시했어요."];
  const say = h("p", { class: "ci6read" }, msgs[0]);
  let ph = 0, p0 = null, line = null, trail = null, pts = [];
  const tr = sweepTracker();
  const finish = () => { ph = 3; say.textContent = msgs[3]; ci6Then(body, api, opt, "중심·지름·둘레 표시", "가장 큰 원의 중심, 지름, 둘레를 표시했어요."); };
  dragOn(s, p => {
    if (ph === 0) {
      if (dist(p, C) < 26) { ph = 1; ci6Circle(lay, C.x, C.y, 7, { fill: CI6.red, stroke: "#fff", "stroke-width": 2 }); lay.append(txt(C.x + 30, C.y - 34, "원의 중심", 16, { fill: CI6.red })); say.textContent = msgs[1]; api.hint("원의 중심을 찾았어요."); }
      else api.hint("탁자의 한가운데를 눌러 봐요.");
      return false;
    }
    if (ph === 1) {
      if (Math.abs(dist(p, C) - R) > 24) { api.hint("탁자의 둘레(가장 바깥) 위에서 시작해요."); return false; }
      p0 = p; line = ci6Line(lay, p.x, p.y, p.x, p.y, CI6.blue, 5); return true;
    }
    if (ph === 2) {
      if (Math.abs(dist(p, C) - R) > 28) { api.hint("탁자의 가장 바깥 둘레를 따라 그려요."); return false; }
      pts = []; trail = svgEl("polyline", { points: "", fill: "none", stroke: CI6.red, "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }); lay.append(trail); return true;
    }
    return false;
  }, p => {
    if (ph === 1 && line) { line.setAttribute("x2", ci6R(p.x)); line.setAttribute("y2", ci6R(p.y)); }
    if (ph === 2 && trail && Math.abs(dist(p, C) - R) < 40) {
      const a = Math.atan2(p.y - C.y, p.x - C.x); tr.add(a); pts.push(ci6P(C.x + R * Math.cos(a), C.y + R * Math.sin(a))); trail.setAttribute("points", pts.join(" "));
    }
  }, p => {
    if (ph === 1 && line) {
      if (Math.abs(dist(p, C) - R) < 26 && ci6SegDist(C, p0, p) < 18 && dist(p0, p) > R * 1.6) {
        const a = Math.atan2(p0.y - C.y, p0.x - C.x);
        line.setAttribute("x1", ci6R(C.x + R * Math.cos(a))); line.setAttribute("y1", ci6R(C.y + R * Math.sin(a)));
        line.setAttribute("x2", ci6R(C.x - R * Math.cos(a))); line.setAttribute("y2", ci6R(C.y - R * Math.sin(a)));
        lay.append(txt(ci6R(C.x - R * .55 * Math.cos(a) + 18 * Math.sin(a)), ci6R(C.y - R * .55 * Math.sin(a) - 18 * Math.cos(a)), "지름", 16, { fill: CI6.blue }));
        ph = 2; say.textContent = msgs[2]; api.hint("지름을 그었어요. 지름은 원의 중심을 지나요.");
      } else { line.remove(); line = null; api.hint("둘레의 한 점에서 원의 중심을 지나 반대쪽 둘레까지 곧게 그어요."); }
    } else if (ph === 2 && trail) {
      if (tr.full()) { lay.querySelectorAll("polyline").forEach(e => e.remove()); ci6Circle(lay, C.x, C.y, R, { stroke: CI6.red, "stroke-width": 7 }); lay.append(txt(C.x + R * .72, C.y + R * .82, "둘레", 17, { fill: CI6.red })); finish(); }
      else api.hint(`조금 더 그려서 한 바퀴를 채워요. (${Math.round(tr.count() / 36 * 100)}%)`);
    }
  });
  body.append(say, s);   /* 끝나면 ci6Then → api.done( */
}

/* ---------- 2차시: 원을 굴리고 정육각형·정사각형의 둘레를 수직선에 늘이기 ---------- */
function ci6Unroll(body, api, opt) {   /* 끝나면 ci6Then → api.done( */
  const rr = opt.r || 1, RP = 60, k = RP / rr, N = Math.ceil(8 * rr) + 1, x0 = 70, W = 640, H = 500, base = 292;     // 원의 반지름은 늘 60px로 그려요
  const L = v => ci6S(v) + " cm";
  const rows = { hex: { y: 382, v: rr, col: CI6.green, name: "정육각형의 둘레", want: 6 * rr }, sq: { y: 432, v: rr, col: CI6.red, name: "정사각형의 둘레", want: 8 * rr } };
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "36em";
  /* 위 오른쪽: 원 안의 정육각형과 원 밖의 정사각형 */
  const F = { x: 530, y: 88 };
  ci6Poly(s, [[F.x - RP, F.y - RP], [F.x + RP, F.y - RP], [F.x + RP, F.y + RP], [F.x - RP, F.y + RP]], { stroke: CI6.red, "stroke-width": 3, fill: "#FDECEC" });
  ci6Circle(s, F.x, F.y, RP, { fill: "#fff", stroke: CI6.blue, "stroke-width": 3 });
  ci6Poly(s, [0, 1, 2, 3, 4, 5].map(i => [F.x + RP * Math.cos(i * Math.PI / 3), F.y + RP * Math.sin(i * Math.PI / 3)]), { stroke: CI6.green, "stroke-width": 3, fill: "#E3F4EA" });
  ci6Line(s, F.x, F.y, F.x + RP, F.y, CI6.ink, 2); s.append(txt(F.x + RP / 2, F.y - 11, L(rr), 14));
  ci6Line(s, F.x - RP, F.y + RP + 12, F.x + RP, F.y + RP + 12, CI6.ink, 1.5); s.append(txt(F.x, F.y + RP + 26, L(2 * rr), 14));
  /* 수직선과 세로 눈금선 */
  for (let i = 0; i <= N; i++) ci6Line(s, x0 + i * k, base + 6, x0 + i * k, 464, "#DCE4E0", 1.2, { "stroke-dasharray": "4 4" });
  ci6Line(s, x0 - 8, 467, x0 + N * k + 8, 467, CI6.ink, 2);
  for (let i = 0; i <= 2 * N; i++) { const x = x0 + i * k / 2; ci6Line(s, x, 467, x, i % 2 ? 474 : 479, CI6.ink, 1.6); if (i % 2 === 0) s.append(txt(x, 491, String(i / 2), 14)); }
  s.append(txt(x0 - 36, 491, "(cm)", 12, { fill: CI6.gray }));
  /* 원의 지름 막대 */
  ci6Line(s, x0, 332, x0 + 2 * rr * k, 332, CI6.gray, 9); s.append(txt(x0 + 2 * rr * k + 10, 332, `원의 지름 (${L(2 * rr)})`, 14, { "text-anchor": "start", fill: CI6.gray }));
  /* 끌어서 늘이는 막대 */
  Object.values(rows).forEach(r => {
    r.bar = ci6Line(s, x0, r.y, x0 + r.v * k, r.y, r.col, 9);
    s.append(txt(x0, r.y - 24, r.name, 14, { "text-anchor": "start", fill: r.col }));
    r.hd = ci6Circle(s, x0 + r.v * k, r.y, 12, { fill: "#fff", stroke: r.col, "stroke-width": 3.5 }); r.hd.style.cursor = "ew-resize";
    r.lab = txt(x0 + r.v * k + 18, r.y, L(r.v), 14, { fill: r.col, "text-anchor": "start" }); s.append(r.lab);
  });
  const set = (r, v) => { r.v = v; const x = x0 + v * k; r.bar.setAttribute("x2", ci6R(x)); r.hd.setAttribute("cx", ci6R(x)); r.lab.setAttribute("x", ci6R(Math.min(x + 18, W - 50))); r.lab.textContent = L(v); };
  /* 굴리는 원 */
  const roll = svgEl("g"); roll.append(svgEl("circle", { cx: 0, cy: 0, r: RP, fill: "#EAF3FD", stroke: CI6.blue, "stroke-width": 3 }));
  ci6Line(roll, 0, 0, 0, RP, CI6.gray, 2); roll.append(svgEl("circle", { cx: 0, cy: RP, r: 6, fill: CI6.red }));
  const trace = ci6Line(s, x0, base, x0, base, CI6.blue, 9); s.append(roll);
  ci6Line(s, x0 - 10, base + 6, x0 + N * k, base + 6, "#B9C4CC", 1.5);
  const place = a => { roll.setAttribute("transform", `translate(${ci6R(x0 + a * RP)},${base - RP}) rotate(${ci6R(a * 180 / Math.PI)})`); trace.setAttribute("x2", ci6R(x0 + a * RP)); };
  place(0);
  let rolled = false, rolling = false;
  const circLab = txt(x0 + 4, base + 22, "", 14, { "text-anchor": "start", fill: CI6.blue }); s.append(circLab);
  const rollBtn = h("button", { type: "button", onclick: () => {
    if (rolling) return; rolling = true; const t0 = performance.now(), T = 1800;
    const step = now => { const t = Math.min(1, (now - t0) / T); place(t * 2 * Math.PI); if (t < 1) requestAnimationFrame(step); else { rolling = false; rolled = true; circLab.textContent = "원주(원이 한 바퀴 굴러간 길이)"; api.hint("빨간 점이 다시 땅에 닿을 때까지 한 바퀴 굴렀어요. 파란 선의 길이가 원주예요. 이제 두 막대를 늘여 봐요."); kick(); } };
    requestAnimationFrame(step);
  } }, "원 한 바퀴 굴리기");
  const check = () => {
    api.tryOnce(); const ans = `정육각형 ${L(rows.hex.v)}, 정사각형 ${L(rows.sq.v)}`;
    if (rows.hex.v !== rows.hex.want) { api.fail(`정육각형의 한 변은 원의 반지름과 같은 ${L(rr)}예요. 변 6개의 길이를 모두 더한 만큼 초록 막대를 늘여요.`, ans); return false; }
    if (rows.sq.v !== rows.sq.want) { api.fail(`정사각형의 한 변은 원의 지름과 같은 ${L(2 * rr)}예요. 변 4개의 길이를 모두 더한 만큼 빨간 막대를 늘여요.`, ans); return false; }
    ci6Then(body, api, opt, ans, `정육각형의 둘레는 ${L(6 * rr)}, 정사각형의 둘레는 ${L(8 * rr)}예요.`); return true;
  };
  const kick0 = autoRun(() => rolled && rows.hex.v !== rr && rows.sq.v !== rr, () => rows.hex.v + "," + rows.sq.v, check, 0);
  let tm = null; const kick = () => { clearTimeout(tm); tm = setTimeout(kick0, 1200); };
  let cur = null;
  dragOn(s, p => { cur = Object.values(rows).find(r => Math.hypot(p.x - (x0 + r.v * k), p.y - r.y) < 26) || null; if (cur) clearTimeout(tm); return !!cur; },
    p => { if (cur) set(cur, Math.max(.5, Math.min(N, Math.round((p.x - x0) / k * 2) / 2))); },
    () => { cur = null; if (!rolled) api.hint("‘원 한 바퀴 굴리기’를 눌러 원주도 수직선에 나타내요."); kick(); });
  body.append(h("div", { class: "ci6btns" }, rollBtn), s, h("p", { class: "ci6small" }, "초록·빨간 막대 끝의 동그라미를 끌어 길이를 바꿔요(0.5 cm씩). 손을 떼면 저절로 확인해요."));
}

/* ---------- 3차시: 삼각자로 지름 재고 실로 원주 재기 ---------- */
function ci6ObjG(g, kind, cx, cy, r) {
  if (kind === "candle") { ci6Circle(g, cx, cy, r, { fill: "#FFF3D6", stroke: "#D9B36A", "stroke-width": 3 }); ci6Circle(g, cx, cy, r * .7, { stroke: "#EAD3A0", "stroke-width": 2 }); ci6Circle(g, cx, cy, r * .12, { fill: "#5C3A1A", stroke: "none" }); }
  else if (kind === "clock") { ci6Circle(g, cx, cy, r, { fill: "#fff", stroke: "#4A6A8A", "stroke-width": 4 }); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ci6Line(g, cx + r * .82 * Math.cos(a), cy + r * .82 * Math.sin(a), cx + r * .92 * Math.cos(a), cy + r * .92 * Math.sin(a), CI6.ink, 2.5); } ci6Line(g, cx, cy, cx, cy - r * .6, CI6.ink, 3.5); ci6Line(g, cx, cy, cx + r * .45, cy + r * .1, CI6.ink, 3.5); }
  else if (kind === "tray") { ci6Circle(g, cx, cy, r, { fill: "#E9C79C", stroke: "#A8743F", "stroke-width": 3 }); ci6Circle(g, cx, cy, r * .85, { fill: "#F3DDBE", stroke: "#C8955C", "stroke-width": 2 }); }
  else if (kind === "button") { ci6Circle(g, cx, cy, r, { fill: "#F6B38E", stroke: "#C9744A", "stroke-width": 3 }); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => ci6Circle(g, cx + a * r * .25, cy + b * r * .25, r * .1, { fill: "#8A4A2A", stroke: "none" })); }
  else if (kind === "plate") { ci6Circle(g, cx, cy, r, { fill: "#fff", stroke: "#7FA8C9", "stroke-width": 3 }); ci6Circle(g, cx, cy, r * .65, { stroke: "#BFD6E8", "stroke-width": 2 }); }
  else if (kind === "coaster") { ci6Circle(g, cx, cy, r, { fill: "#CFE8C9", stroke: "#5E9A55", "stroke-width": 3 }); ci6Circle(g, cx, cy, r * .6, { stroke: "#8CC084", "stroke-width": 2, "stroke-dasharray": "4 3" }); }
  else if (kind === "cushion") { ci6Circle(g, cx, cy, r, { fill: "#F4C2CB", stroke: "#C76B7E", "stroke-width": 3 }); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ci6Line(g, cx, cy, cx + r * .9 * Math.cos(a), cy + r * .9 * Math.sin(a), "#E39AA8", 1.5); } ci6Circle(g, cx, cy, r * .1, { fill: "#C76B7E", stroke: "none" }); }
  else if (kind === "pan") { ci6Circle(g, cx, cy, r, { fill: "#4A4F55", stroke: "#2B2F33", "stroke-width": 4 }); ci6Circle(g, cx, cy, r * .88, { fill: "#5E646B", stroke: "none" }); }
}
function ci6Lab(body, api, opt) {   /* 끝나면 ci6Then → api.done( */
  const items = opt.items, recs = items.map(() => ({ d: null, C: null }));
  const tbl = h("table", {}, h("thead", {}, h("tr", {}, h("th", {}, "물건"), h("th", {}, "원주(cm)"), h("th", {}, "지름(cm)"))), h("tbody", {}, ...items.map((it, i) => h("tr", {}, h("td", {}, it.name), h("td", { id: `ci6lC${i}` }, "​"), h("td", { id: `ci6ld${i}` }, "​")))));
  const stage = h("div"), say = h("p", { class: "ci6read" });
  let idx = 0;
  const setCell = (i, key, v) => { const td = tbl.querySelector(`#ci6l${key}${i}`); if (td) td.textContent = ci6S(v); };
  const run = i => {
    stage.innerHTML = ""; const it = items[i];
    const L = Math.ceil((it.C + 2) / 5) * 5, x0 = 70, k = 540 / L, r = it.d * k / 2, cy = 200 - r, W = 640, H = 330;
    const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "36em";
    const ruler = (y, col, lab) => {
      s.append(svgEl("rect", { x: x0 - 12, y, width: L * k + 24, height: 24, fill: col, stroke: "#9AA5AE", "stroke-width": 1.5, rx: 3 }));
      for (let c = 0; c <= L; c++) { const x = x0 + c * k, big = c % 5 === 0; ci6Line(s, x, y, x, y + (big ? 12 : 6), CI6.ink, big ? 1.6 : 1); if (big || k > 18) s.append(txt(x, y + 18, String(c), 10)); }
      s.append(txt(x0 + L * k + 10, y - 7, lab, 12, { "text-anchor": "end", fill: CI6.gray }));
    };
    ruler(200, "#FFFBEA", "자(cm)"); ruler(286, "#FFF3C4", "줄자(cm)");
    const obj = svgEl("g"); ci6ObjG(obj, it.kind, x0 + r, cy, r); s.append(obj);
    s.append(svgEl("polygon", { points: `${x0},200 ${x0},${200 - 115} ${x0 - 58},200`, fill: "rgba(120,170,220,.35)", stroke: "#4A7FB5", "stroke-width": 2 }));
    const tri = svgEl("polygon", { fill: "rgba(120,170,220,.35)", stroke: "#4A7FB5", "stroke-width": 2 }); tri.style.cursor = "ew-resize"; s.append(tri);
    const lay = svgEl("g", { "pointer-events": "none" }); s.append(lay);
    let xr = x0 + (it.d + 3) * k, ph = 0, trail = null, pts = [];
    const tr = sweepTracker();
    const putTri = () => tri.setAttribute("points", `${ci6R(xr)},200 ${ci6R(xr)},${200 - 115} ${ci6R(xr + 58)},200`);
    putTri();
    say.textContent = `${it.name}: ① 오른쪽 삼각자를 끌어 ${it.name}에 꼭 닿게 대어 지름을 재요.`;
    const unroll = () => {
      const line = ci6Line(lay, x0, 280, x0, 280, CI6.blue, 5); const t0 = performance.now(), T = 1300;
      const step = now => { const t = Math.min(1, (now - t0) / T); line.setAttribute("x2", ci6R(x0 + t * it.C * k)); if (t < 1) requestAnimationFrame(step); else {
        lay.append(txt(x0 + it.C * k / 2, 268, `원주 ${ci6S(it.C)} cm`, 15, { fill: CI6.blue })); recs[i].C = it.C; setCell(i, "C", it.C); ph = 3;
        if (i < items.length - 1) { say.textContent = `${it.name}: 지름 ${ci6S(it.d)} cm, 원주 ${ci6S(it.C)} cm를 쟀어요.`; stage.append(h("div", { class: "ci6btns" }, h("button", { type: "button", onclick: () => run(i + 1) }, `이어서 ${items[i + 1].name} 재기 ▶`))); }
        else { say.textContent = "세 물건의 원주와 지름을 모두 쟀어요."; ci6Then(body, api, opt, recs.map((q, j) => `${items[j].name} ${q.C}/${q.d}`).join(", "), "세 물건의 원주와 지름을 모두 쟀어요."); }
      } };
      requestAnimationFrame(step);
    };
    dragOn(s, p => {
      if (ph === 0) { if (p.x > xr - 20 && p.x < xr + 64 && p.y > 80 && p.y < 205) return true; api.hint("오른쪽 삼각자를 끌어 옮겨요."); return false; }
      if (ph === 1) { if (Math.abs(dist(p, { x: x0 + r, y: cy }) - r) > 22) { api.hint("물건의 둘레를 따라 실을 감아요."); return false; } pts = []; trail = svgEl("polyline", { points: "", fill: "none", stroke: CI6.blue, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" }); lay.append(trail); return true; }
      return false;
    }, p => {
      if (ph === 0) { xr = Math.max(x0 + it.d * k, Math.min(x0 + L * k - 4, p.x)); putTri(); }
      else if (ph === 1 && trail && Math.abs(dist(p, { x: x0 + r, y: cy }) - r) < 34) { const a = Math.atan2(p.y - cy, p.x - x0 - r); tr.add(a); pts.push(ci6P(x0 + r + r * Math.cos(a), cy + r * Math.sin(a))); trail.setAttribute("points", pts.join(" ")); }
    }, () => {
      if (ph === 0) {
        if (xr - (x0 + it.d * k) < Math.max(.6 * k, 9)) {
          xr = x0 + it.d * k; putTri(); ph = 1; recs[i].d = it.d; setCell(i, "d", it.d);
          ci6Line(lay, x0, cy, xr, cy, CI6.red, 2.5, { "stroke-dasharray": "6 4" }); lay.append(txt(x0 + r, cy - 14, `지름 ${ci6S(it.d)} cm`, 15, { fill: CI6.red }));
          say.textContent = `${it.name}: ② 둘레를 따라 실을 한 바퀴 감아요(둘레를 따라 끌어요).`; api.hint("삼각자 사이의 거리가 지름이에요.");
        } else api.hint("삼각자가 물건에 꼭 닿을 때까지 옮겨요.");
      } else if (ph === 1 && trail) {
        if (tr.full()) { ph = 2; lay.querySelectorAll("polyline").forEach(e => e.remove()); ci6Circle(lay, x0 + r, cy, r, { stroke: CI6.blue, "stroke-width": 5 }); say.textContent = `${it.name}: ③ 감은 실을 펴서 줄자로 재요.`; setTimeout(unroll, 350); }
        else api.hint(`실을 조금 더 감아 한 바퀴를 채워요. (${Math.round(tr.count() / 36 * 100)}%)`);
      }
    });
    stage.prepend(s);
  };
  body.append(say, stage, h("div", { class: "ci6tbl" }, tbl));
  run(idx);
}

/* ---------- 4차시: 물레방아 바퀴 한 바퀴 굴리기 ---------- */
function ci6Roll(body, api, opt) {   /* 끝나면 ci6Then → api.done( */
  /* 거리 재는 바퀴(측정 바퀴) 한 바퀴 굴리기. opt: {d, unit:"cm", k(1단위 px), tick(작은 눈금 간격), lab(글 간격), max} */
  const D = opt.d, U = opt.unit || "cm", k = opt.k || 5.4, tick = opt.tick || 2, labE = opt.lab || 10, x0 = 70, gy = 222, r = D / 2 * k, W = 720, H = 280, goal = x0 + D * Math.PI * k;
  const max = opt.max || Math.floor((W - x0 - 10) / k / labE) * labE;
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "38em";
  s.append(svgEl("rect", { x: 0, y: gy, width: W, height: H - gy, fill: "#DCEBD3" }));
  ci6Line(s, 0, gy, W, gy, "#6F8F5E", 3);
  for (let m = 0; m <= max; m += tick) { const x = x0 + m * k, big = m % labE === 0; ci6Line(s, x, gy, x, gy + (big ? 12 : 6), CI6.ink, big ? 1.6 : 1); if (big) s.append(txt(x, gy + 46, String(m), 13)); }
  s.append(txt(x0 - 36, gy + 46, `(${U})`, 12, { fill: CI6.gray }));
  const trace = ci6Line(s, x0, gy + 3, x0, gy + 3, CI6.blue, 6);
  const bars = svgEl("g"); s.append(bars);
  const handle = svgEl("g", { "pointer-events": "none" });
  handle.append(svgEl("line", { x1: 0, y1: 0, x2: -r * .9, y2: -r * 1.05, stroke: "#4A5563", "stroke-width": 7, "stroke-linecap": "round" }), svgEl("rect", { x: ci6R(-r * .9 - 18), y: ci6R(-r * 1.05 - 8), width: 26, height: 14, rx: 6, fill: "#E47A38" }));
  const wheel = svgEl("g"); wheel.style.cursor = "grab";
  wheel.append(svgEl("circle", { cx: 0, cy: 0, r, fill: "rgba(255,214,102,.35)", stroke: "#33404D", "stroke-width": 7 }));
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; ci6Line(wheel, 0, 0, (r - 4) * Math.cos(a), (r - 4) * Math.sin(a), "#7C8794", 5); }
  wheel.append(svgEl("circle", { cx: 0, cy: 0, r: 10, fill: "#33404D" }), svgEl("circle", { cx: 0, cy: r, r: 8, fill: CI6.red, stroke: "#fff", "stroke-width": 2 }));
  s.append(wheel, handle);
  ci6Line(s, x0, gy - 2 * r - 14, x0, gy, CI6.red, 1.5, { "stroke-dasharray": "4 4" }); s.append(txt(x0 + 24, gy - 2 * r - 20, "출발", 13, { fill: CI6.red }));
  let cx = x0, fin = false, off = 0;
  const place = () => { wheel.setAttribute("transform", `translate(${ci6R(cx)},${gy - r}) rotate(${ci6R((cx - x0) / r * 180 / Math.PI)})`); handle.setAttribute("transform", `translate(${ci6R(cx)},${gy - r})`); trace.setAttribute("x2", ci6R(cx)); };
  place();
  const say = h("p", { class: "ci6read" }, opt.say || `지름이 ${D} ${U}인 바퀴를 끌어 오른쪽으로 굴려요. 빨간 점이 다시 땅에 닿을 때까지 한 바퀴만 굴려요.`);
  dragOn(s, p => { if (fin || dist(p, { x: cx, y: gy - r }) > r + 10) return false; off = p.x - cx; return true; },
    p => { cx = Math.max(x0, Math.min(W - 10, p.x - off)); place(); },
    () => {
      const m = (cx - x0) / k;
      if (Math.abs(cx - goal) < Math.max(.5 * D * k / 6, 14)) {
        cx = goal; place(); fin = true;
        for (let i = 0; i < 3; i++) ci6Line(bars, x0 + i * D * k + 2, gy - 12, x0 + (i + 1) * D * k - 2, gy - 12, i % 2 ? CI6.purple : CI6.org, 7);
        ci6Line(bars, x0 + 3 * D * k + 2, gy - 12, goal, gy - 12, CI6.green, 7);
        [0, 1, 2].forEach(i => bars.append(txt(x0 + (i + .5) * D * k, gy - 26, `지름 ${D} ${U}`, 13, { fill: i % 2 ? CI6.purple : CI6.org })));
        say.textContent = `한 바퀴 굴렀어요! 바퀴가 굴러간 거리(원주)에는 지름 ${D} ${U}가 3번 들어가고 조금 남아요.`;
        ci6Then(body, api, opt, "한 바퀴", "바퀴가 한 바퀴 굴러간 거리가 원주예요.");
      } else if (cx > goal) api.hint("한 바퀴보다 더 굴렀어요. 빨간 점이 처음으로 다시 땅에 닿는 곳까지만 굴려요.");
      else if (m > .3) api.hint("빨간 점이 다시 땅에 닿을 때까지 더 굴려요.");
    });
  const reset = h("button", { type: "button", onclick: () => { if (fin) return; cx = x0; place(); } }, "처음 자리로");
  body.append(say, s, h("div", { class: "ci6btns" }, reset));
}

/* ---------- 4차시: 지름을 바꾸며 원주 맞추기 ---------- */
function ci6Diam(body, api, opt) {   /* 끝나면 ci6Then → api.done( */
  const W = 360, H = 300, C = { x: 180, y: 150 }, px = 130 / opt.max, what = opt.what || "단면의 원주";
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "20em";
  const ring = ci6Circle(s, C.x, C.y, 60, { fill: "#C99A62", stroke: "#7A5230", "stroke-width": 5 });
  const ring2 = ci6Circle(s, C.x, C.y, 40, { fill: "none", stroke: "#A97A45", "stroke-width": 2 });
  const dl = ci6Line(s, C.x - 60, C.y, C.x + 60, C.y, CI6.red, 3); const dt = txt(C.x, C.y - 14, "", 16, { fill: "#fff" }); s.append(dt);
  const out = h("p", { class: "ci6read" });
  const rng = h("input", { type: "range", min: String(opt.min), max: String(opt.max), step: "1", value: String(opt.start), "aria-label": "지름", style: "width:100%;max-width:22em" });
  const upd = () => { const d = +rng.value, rr = d * px; ring.setAttribute("r", ci6R(rr)); ring2.setAttribute("r", ci6R(rr * .62)); dl.setAttribute("x1", ci6R(C.x - rr)); dl.setAttribute("x2", ci6R(C.x + rr)); dt.textContent = `지름 ${d} cm`;
    const c = ci6Circ(d); out.textContent = `지름 ${d} cm → 원주 ${d}×3.14 = ${ci6S(c)} cm ${Math.abs(c - opt.C) < 1e-9 ? "← " + what + "와 같아요!" : c < opt.C ? "(" + what + "보다 짧아요)" : "(" + what + "보다 길어요)"}`; };
  let fin = false, tm = null;
  const judge = () => { if (fin) return; const d = +rng.value;
    if (Math.abs(ci6Circ(d) - opt.C) < 1e-9) { fin = true; rng.disabled = true; ci6Then(body, api, opt, `지름 ${d} cm`, `지름이 ${d} cm일 때 원주가 ${ci6S(opt.C)} cm가 돼요.`); }
    else api.hint(ci6Circ(d) < opt.C ? "아직 원주가 짧아요. 지름을 더 늘여 봐요." : "원주가 너무 길어요. 지름을 줄여 봐요."); };
  rng.addEventListener("input", () => { upd(); clearTimeout(tm); tm = setTimeout(judge, 1200); }); upd();
  body.append(h("div", { class: "ci6box" }, `${what}: ${ci6S(opt.C)} cm`), s, rng, out);
}

/* ---------- 5차시: 원 안·밖 정사각형 그리기 ---------- */
function ci6InOut(body, api, opt) {   /* 끝나면 ci6Then → api.done( */
  const W = 360, C = { x: 180, y: 180 }, R = 120, rr = opt.r, U = opt.unit || "m";
  const s = makeSvg(W, W); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "19em";
  const out = svgEl("g"), inn = svgEl("g"); s.append(out);
  ci6Circle(s, C.x, C.y, R, { fill: "#D8EBC8", stroke: CI6.ink, "stroke-width": 2.5 });
  for (let i = 0; i < 26; i++) { const a = i * 2.4, rad = R * Math.sqrt((i + .5) / 26) * .92, x = ci6R(C.x + rad * Math.cos(a)), y = ci6R(C.y + rad * Math.sin(a)); s.append(svgEl("path", { d: `M${x - 5},${y + 4} L${x},${y - 5} L${x + 5},${y + 4}`, fill: "none", stroke: "#4F8A47", "stroke-width": 2, "stroke-linecap": "round" })); }
  ci6Circle(s, C.x, C.y, 3.5, { fill: CI6.ink, stroke: "none" }); s.append(inn);
  const P = [0, 1, 2, 3, 4, 5, 6, 7].map(i => ({ x: C.x + R * Math.cos(i * Math.PI / 4 - Math.PI / 2), y: C.y + R * Math.sin(i * Math.PI / 4 - Math.PI / 2) }));
  const dots = P.map((p, i) => { const d = ci6Circle(s, p.x, p.y, 10, { fill: "#fff", stroke: CI6.green, "stroke-width": 3 }); d.style.cursor = "pointer"; d.dataset.i = i; return d; });
  const sel = [];
  const say = h("p", { class: "ci6read" }, "원 위의 점 4개를 눌러 원 안에 꼭 맞는 정사각형을 그려요.");
  let ph = 0;
  s.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest("[data-i]"); if (!t || ph) return;
    const i = +t.dataset.i, at = sel.indexOf(i);
    if (at >= 0) { sel.splice(at, 1); dots[i].setAttribute("fill", "#fff"); return; }
    sel.push(i); dots[i].setAttribute("fill", CI6.green);
    if (sel.length < 4) return;
    const srt = sel.slice().sort((a, b) => a - b), sq = srt.every((v, j) => v === srt[0] + 2 * j);
    api.tryOnce();
    if (!sq) { api.fail("네 점을 이으면 네 변의 길이가 모두 같고 네 각이 모두 직각인 정사각형이 되게 골라요. 서로 마주 보는 두 점을 이은 선분이 지름이 되게 해 봐요.", srt.join(",")); sel.length = 0; dots.forEach(d => d.setAttribute("fill", "#fff")); return; }
    ph = 1; dots.forEach(d => d.remove());
    const Q = srt.map(j => P[j]);
    ci6Poly(inn, Q.map(q => [q.x, q.y]), { fill: "rgba(46,139,87,.28)", stroke: CI6.green, "stroke-width": 3.5 });
    ci6Line(inn, Q[0].x, Q[0].y, Q[2].x, Q[2].y, CI6.green, 2, { "stroke-dasharray": "6 4" }); ci6Line(inn, Q[1].x, Q[1].y, Q[3].x, Q[3].y, CI6.green, 2, { "stroke-dasharray": "6 4" });
    const m = { x: (C.x + Q[0].x) / 2, y: (C.y + Q[0].y) / 2 }; inn.append(txt(ci6R(m.x + 16), ci6R(m.y), `${rr} ${U}`, 15, { fill: CI6.green }));
    ci6Poly(out, [[C.x - R, C.y - R], [C.x + R, C.y - R], [C.x + R, C.y + R], [C.x - R, C.y + R]], { fill: "#FDECEC", stroke: CI6.red, "stroke-width": 3.5 });
    ci6Dim(out, C.x - R, C.y + R + 14, C.x + R, C.y + R + 14, `${2 * rr} ${U}`, CI6.red, 14);
    say.textContent = "초록색 정사각형(원 안)과 빨간색 정사각형(원 밖)이 생겼어요.";
    ci6Then(body, api, opt, "정사각형", "원 안에 꼭 맞는 정사각형을 그렸어요. 원 밖에 꼭 맞는 정사각형도 그려졌어요.");
  });
  body.append(say, s);
}

/* ---------- 5차시: 모눈 칸 칠해 원의 넓이 어림하기(4등분한 한 조각) ---------- */
function ci6GridTruth(r) { const T = []; for (let i = 0; i < r; i++) for (let j = 0; j < r; j++) T.push((i + 1) ** 2 + (j + 1) ** 2 <= r * r ? 1 : (i * i + j * j < r * r ? 2 : 0)); return T; }
function ci6GridCount(r) { const T = ci6GridTruth(r); const g = T.filter(v => v === 1).length; return { g, all: g + T.filter(v => v === 2).length }; }
function ci6Grid(body, api, opt) {
  const r = opt.r, c = Math.min(56, 330 / r), S = r * c, x0 = 30, y0 = 20, W = S + 70, H = S + 60;
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = (r <= 4 ? 16 : 22) + "em";
  const T = ci6GridTruth(r), st = T.map(() => 0);
  const cells = [];
  for (let i = 0; i < r; i++) for (let j = 0; j < r; j++) {
    const e = svgEl("rect", { x: ci6R(x0 + i * c), y: ci6R(y0 + S - (j + 1) * c), width: ci6R(c), height: ci6R(c), fill: "#fff", stroke: "#B8C6D2", "stroke-width": 1.2 });
    e.dataset.c = cells.length; cells.push(e); s.append(e);
  }
  s.append(svgEl("path", { d: `M${x0},${y0 + S} L${x0 + S},${y0 + S} A${S},${S} 0 0 0 ${x0},${y0} Z`, fill: "rgba(228,122,56,.08)", stroke: CI6.ink, "stroke-width": 3, "pointer-events": "none" }));
  ci6Circle(s, x0, y0 + S, 4, { fill: CI6.ink, stroke: "none", "pointer-events": "none" });
  const lab = svgEl("g", { "pointer-events": "none" }); s.append(lab);
  ci6Dim(lab, x0, y0 + S + 18, x0 + S, y0 + S + 18, `반지름 ${r} ${opt.unit}`, CI6.ink, 14);
  s.append(txt(x0 + S + 6, y0 + 10, `1칸 = 1 ${opt.unit}×1 ${opt.unit}`, 12, { "text-anchor": "end", fill: CI6.gray, "pointer-events": "none" }));
  const COL = ["#fff", "rgba(46,139,87,.55)", "rgba(228,122,56,.55)"];
  let pen = 1;
  const cnt = h("p", { class: "ci6read" });
  const show = () => { cells.forEach((e, k) => e.setAttribute("fill", COL[st[k]])); cnt.textContent = `초록 ${st.filter(v => v === 1).length}칸 · 주황 ${st.filter(v => v === 2).length}칸`; };
  const pens = h("div", { class: "ci6btns" });
  [["초록: 원 안에 완전히 들어간 칸", 1], ["주황: 원이 걸친 칸", 2], ["지우개", 0]].forEach(([t, v]) => pens.append(h("button", { type: "button", class: v === 1 ? "ci6-pick" : "", onclick: e => { pen = v; [...pens.children].forEach(b => b.classList.remove("ci6-pick")); e.currentTarget.classList.add("ci6-pick"); } }, t)));
  const at = p => { const i = Math.floor((p.x - x0) / c), j = Math.floor((y0 + S - p.y) / c); return i >= 0 && j >= 0 && i < r && j < r ? i * r + j : -1; };
  let painting = false;
  dragOn(s, p => { if (body.ci6Fin) return false; const k = at(p); if (k < 0) return false; painting = true; clearTimeout(tm); st[k] = pen; show(); return true; },
    p => { if (!painting) return; const k = at(p); if (k >= 0 && st[k] !== pen) { st[k] = pen; show(); } }, () => { painting = false; kick(); });
  show();
  const check = () => {
    api.tryOnce(); const ans = cnt.textContent;
    let msg = null;
    if (st.some((v, k) => v && !T[k])) msg = "원과 만나지 않는 칸을 칠했어요. 지우개로 지워요.";
    else if (st.some((v, k) => v === 1 && T[k] === 2)) msg = "초록 칸 중에 원의 둘레가 지나가는 칸이 있어요. 칸 전체가 원 안에 들어가야 초록이에요.";
    else if (st.some((v, k) => v === 2 && T[k] === 1)) msg = "주황 칸 중에 원 안에 완전히 들어간 칸이 있어요. 그 칸은 초록으로 칠해요.";
    else if (T.some((v, k) => v === 1 && st[k] !== 1)) msg = "원 안에 완전히 들어간 칸을 모두 초록으로 칠해요.";
    else if (T.some((v, k) => v === 2 && st[k] !== 2)) msg = "원의 둘레가 조금이라도 지나가는 칸을 모두 주황으로 칠해요.";
    if (msg) { api.fail(msg, ans); return false; }
    ci6Then(body, api, opt, ans, "칸을 알맞게 칠했어요."); return true;   /* → api.done( */
  };
  const need = T.filter(v => v).length;
  const kick0 = autoRun(() => st.filter(v => v).length >= need, () => st.join(""), check, 0);
  let tm = null; const kick = () => { clearTimeout(tm); tm = setTimeout(kick0, 1200); };
  body.append(h("p", { class: "ci6small" }, "원을 4등분한 한 조각이에요. 칸을 누르거나 끌어서 칠해요. 다 칠하고 손을 떼면 저절로 확인해요."), pens, s, cnt);
}

/* ---------- 6차시: 원을 잘라 이어 붙이기 ---------- */
function ci6Cut(body, api, opt) {   /* 끝나면 ci6Then → api.done( */
  const W = 640, H = 250, R = 78, C = { x: 110, y: 125 }, X0 = 250, Y0 = 82;
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "36em";
  ci6Circle(s, C.x, C.y, R, { stroke: "#C9D3DA", "stroke-width": 1.5, "stroke-dasharray": "5 4" });
  const lay = svgEl("g"), lab = svgEl("g", { "pointer-events": "none" }); s.append(lay, lab);
  let n = opt.start || 8, arranged = false, busy = false, secs = [];
  const tried = new Set(), need = opt.need || 3;
  const say = h("p", { class: "ci6read" });
  const build = () => {
    lay.innerHTML = ""; lab.innerHTML = ""; secs = []; arranged = false;
    const t = 2 * Math.PI / n, cs = Math.cos(t / 2), sn = Math.sin(t / 2), w = 2 * R * sn, half = n / 2;
    const dS = `M0,0 L${ci6R(R * cs)},${ci6R(-R * sn)} A${R},${R} 0 0 1 ${ci6R(R * cs)},${ci6R(R * sn)} Z`, dA = `M${ci6R(R * cs)},${ci6R(-R * sn)} A${R},${R} 0 0 1 ${ci6R(R * cs)},${ci6R(R * sn)}`;
    for (let j = 0; j < half; j++) for (const low of [true, false]) {
      const a0 = low ? Math.PI - (j + .5) * t : -Math.PI + (j + .5) * t;
      const g = svgEl("g"); g.append(svgEl("path", { d: dS, fill: low ? "#F7C9A5" : "#BFD9F2", stroke: low ? "#C9744A" : "#3F79B5", "stroke-width": n > 32 ? .6 : 1.2 }));
      if (opt.labels && low) g.append(svgEl("path", { d: dA, fill: "none", stroke: CI6.red, "stroke-width": 3.5 }));
      lay.append(g);
      secs.push({ g, from: { x: C.x, y: C.y, a: a0 }, to: low ? { x: X0 + j * w, y: Y0, a: Math.PI / 2 } : { x: X0 + j * w + w / 2, y: Y0 + R * cs, a: -Math.PI / 2 } });
    }
    if (opt.labels) ci6Line(lab, C.x, C.y, C.x, C.y - R, CI6.green, 3);
    secs.forEach(q => put(q, 0));
    say.textContent = `원을 ${n}등분했어요. ‘이어 붙이기’를 눌러 보세요.`;
    syncBtns();
  };
  const put = (q, t) => { const e = t * t * (3 - 2 * t), x = q.from.x + (q.to.x - q.from.x) * e, y = q.from.y + (q.to.y - q.from.y) * e, a = q.from.a + (q.to.a - q.from.a) * e; q.g.setAttribute("transform", `translate(${ci6R(x)},${ci6R(y)}) rotate(${ci6R(a * 180 / Math.PI)})`); };
  const anim = (fwd, cb) => { busy = true; const t0 = performance.now(), T = 1100; const step = now => { const t = Math.min(1, (now - t0) / T); secs.forEach(q => put(q, fwd ? t : 1 - t)); if (t < 1) requestAnimationFrame(step); else { busy = false; cb && cb(); } }; requestAnimationFrame(step); };
  const labels = () => {
    const t = 2 * Math.PI / n, cs = Math.cos(t / 2), w = 2 * R * Math.sin(t / 2), half = n / 2, xl = X0 - w / 2, xr = X0 + (half - .5) * w;
    ci6Line(lab, xl, Y0 + R + 14, xr, Y0 + R + 14, CI6.red, 2); ci6Line(lab, xl, Y0 + R + 8, xl, Y0 + R + 20, CI6.red, 2); ci6Line(lab, xr, Y0 + R + 8, xr, Y0 + R + 20, CI6.red, 2);
    lab.append(txt((xl + xr) / 2, Y0 + R + 32, "(원주)×½", 15, { fill: CI6.red }));
    ci6Line(lab, X0 + 2, Y0, X0 + w / 2 + 2, Y0 + R * cs, CI6.green, 3.5); lab.append(txt(X0 - 30, Y0 + R / 2, "반지름", 14, { fill: CI6.green }));
    lab.append(txt(C.x, C.y + R + 24, "빨간 선: 원주의 ½", 13, { fill: CI6.red }), txt(C.x + 30, C.y - R / 2, "반지름", 13, { fill: CI6.green }));
  };
  const nb = h("div", { class: "ci6btns" });
  const go = h("button", { type: "button", onclick: () => {
    if (busy) return;
    if (!arranged) anim(true, () => {
      arranged = true; tried.add(n); syncBtns();
      say.textContent = n <= 8 ? `${n}조각을 이어 붙였어요. 평행사변형과 비슷한 모양이에요.` : n <= 16 ? `${n}조각을 이어 붙였어요. 사각형에 더 가까워졌어요.` : `${n}조각을 이어 붙였어요. 직사각형에 아주 가까워졌어요.`;
      if (opt.labels) labels();
      if (tried.size >= need) ci6Then(body, api, opt, [...tried].join("·") + "등분", "여러 번 잘라 이어 붙여 보았어요.");
      else api.hint(`○ 다른 수로도 잘라 이어 붙여 봐요. (${tried.size}/${need})`);
    });
    else { lab.innerHTML = ""; if (opt.labels) ci6Line(lab, C.x, C.y, C.x, C.y - R, CI6.green, 3); anim(false, () => { arranged = false; syncBtns(); say.textContent = `원을 ${n}등분했어요.`; }); }
  } }, "이어 붙이기");
  const syncBtns = () => { [...nb.children].forEach(b => { if (b.dataset.n) b.classList.toggle("ci6-pick", +b.dataset.n === n); }); go.textContent = arranged ? "원으로 되돌리기" : "이어 붙이기"; };
  [8, 16, 32, 64].forEach(m => nb.append(h("button", { type: "button", "data-n": m, onclick: () => { if (busy) return; n = m; build(); } }, `${m}등분`)));
  nb.append(go);
  body.append(nb, say, s);
  build();
}

/* ---------- 7차시: 조각을 옮겨 모양 바꾸기 ---------- */
function ci6Move(body, api, opt) {   /* 끝나면 ci6Then → api.done( */
  const s = makeSvg(opt.W, opt.H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = opt.maxW || "30em";
  const bg = svgEl("g"); opt.bg(bg); s.append(bg);
  const pcs = opt.pieces.map((p, i) => { const g = svgEl("g", { "data-pc": i }); g.style.cursor = "grab"; g.append(svgEl("path", { d: p.d, fill: p.fill, stroke: p.stroke || CI6.ink, "stroke-width": 2.5, "stroke-dasharray": p.dash || "none" })); s.append(g); return Object.assign({ g, x: p.at[0], y: p.at[1], rot: p.rot0 || 0, fixed: false }, p); });
  const fg = svgEl("g", { "pointer-events": "none" }); s.append(fg);
  const put = q => q.g.setAttribute("transform", `translate(${ci6R(q.x)},${ci6R(q.y)}) rotate(${ci6R(q.rot)})`);
  pcs.forEach(put);
  const say = h("p", { class: "ci6read" }, opt.say || "조각을 끌어 옮겨요.");
  let cur = null, off = null;
  const allIn = () => pcs.every(q => q.fixed);
  dragOn(s, (p, e) => { const t = e.target.closest && e.target.closest("[data-pc]"); if (!t) return false; const q = pcs[+t.dataset.pc]; if (q.fixed) return false; cur = q; off = { x: p.x - q.x, y: p.y - q.y }; s.insertBefore(q.g, fg); return true; },
    p => { if (!cur) return; cur.x = p.x - off.x; cur.y = p.y - off.y; put(cur); },
    () => {
      if (!cur) return; const q = cur; cur = null;
      if (Math.hypot(q.x - q.to[0], q.y - q.to[1]) < (opt.tol || 26)) {
        q.fixed = true; const fx = q.x, fy = q.y, fr = q.rot, tr = q.rot1 == null ? q.rot : q.rot1, t0 = performance.now();
        const step = now => { const t = Math.min(1, (now - t0) / 450); q.x = fx + (q.to[0] - fx) * t; q.y = fy + (q.to[1] - fy) * t; q.rot = fr + (tr - fr) * t; put(q); if (t < 1) requestAnimationFrame(step); else if (allIn()) { if (opt.after) opt.after(fg); say.textContent = opt.doneSay || "모양을 바꾸었어요."; ci6Then(body, api, opt, "옮기기", opt.doneSay); } };
        requestAnimationFrame(step);
        if (q.rot1 != null && q.rot1 !== q.rot) api.hint("조각을 돌려서 꼭 맞게 넣었어요.");
      } else api.hint(opt.miss || "조각이 들어갈 자리를 찾아 옮겨요.");
    });
  const reset = h("button", { type: "button", onclick: () => { if (body.ci6Fin) return; pcs.forEach((q, i) => { q.fixed = false; q.x = opt.pieces[i].at[0]; q.y = opt.pieces[i].at[1]; q.rot = opt.pieces[i].rot0 || 0; put(q); }); } }, "처음으로");
  body.append(say, s, h("div", { class: "ci6btns" }, reset));
}

/* ---------- 6차시: 원 모양 물건으로 넓이 문제 만들기 ---------- */
function ci6Make(body, api, opt) {
  const list = opt.items;
  let pick = null;
  const chips = h("div", { class: "ci6chips" });
  const nameIn = h("input", { type: "text", placeholder: "물건 이름", "aria-label": "물건 이름", style: "width:8em;max-width:100%;font-size:1.05em" });
  const dIn = h("input", { type: "text", inputmode: "decimal", placeholder: "지름", "aria-label": "지름", style: "width:5em;max-width:100%;font-size:1.05em;text-align:center" });
  const own = h("p", { class: "sent hidden" }, "내가 찾은 ", nameIn, "의 지름은 ", dIn, " cm입니다.");
  const prob = h("div", { class: "ci6box" }, "물건을 골라 문제를 만들어요.");
  const ansIn = h("input", { type: "text", inputmode: "decimal", "aria-label": "넓이", style: "width:6em;max-width:100%;font-size:1.1em;text-align:center" });
  const cur = () => pick === "own" ? { name: nameIn.value.trim() || "물건", d: ci6Num(dIn.value) } : list[pick];
  const showProb = () => { const c = cur(); prob.textContent = c && c.d > 0 ? `내가 찾은 ${c.name}의 지름은 ${ci6S(c.d)} cm입니다. 이 물건의 넓이는 몇 cm²인가요? (원주율 3.14)` : "지름을 써서 문제를 만들어요."; };
  list.forEach((it, i) => chips.append(h("button", { type: "button", onclick: e => { pick = i; [...chips.children].forEach(b => b.classList.remove("ci6-pick")); e.currentTarget.classList.add("ci6-pick"); own.classList.add("hidden"); showProb(); } }, `${it.name} (지름 ${it.d} cm)`)));
  chips.append(h("button", { type: "button", onclick: e => { pick = "own"; [...chips.children].forEach(b => b.classList.remove("ci6-pick")); e.currentTarget.classList.add("ci6-pick"); own.classList.remove("hidden"); showProb(); } }, "내가 찾은 물건"));
  nameIn.addEventListener("input", showProb); dIn.addEventListener("input", showProb);
  const check = () => {
    api.tryOnce(); const c = pick == null ? null : cur(), v = ci6Num(ansIn.value);
    if (!c) { api.fail("먼저 물건을 골라 문제를 만들어요.", "-"); return false; }
    if (!(c.d > 0) || c.d > 500) { api.fail("지름을 알맞은 수로 써요(cm).", dIn.value); return false; }
    const r = c.d / 2, A = ci6Area(r);
    if (Math.abs(v - A) < 1e-9) { ansIn.readOnly = true; api.done(`${c.name} 지름 ${ci6S(c.d)} cm → ${ci6S(A)} cm²`, `반지름이 ${ci6S(r)} cm이므로 ${ci6S(r)}×${ci6S(r)}×3.14=${ci6S(A)} (cm²)예요.`); return true; }
    if (Math.abs(v - ci6Area(c.d)) < 1e-9) api.fail("지름을 두 번 곱했어요. 지름을 2로 나누어 반지름을 먼저 구해요.", ansIn.value);
    else if (Math.abs(v - ci6Circ(c.d)) < 1e-9) api.fail("그건 원주예요. 원의 넓이는 (반지름)×(반지름)×(원주율)이에요.", ansIn.value);
    else api.fail("(반지름)×(반지름)×(원주율)로 다시 계산해 봐요. 계산기를 써도 돼요.", ansIn.value);
    return false;
  };
  const kick = autoRun(() => pick != null && ansIn.value.trim() !== "" && (pick !== "own" || dIn.value.trim() !== ""), () => [pick, nameIn.value, dIn.value, ansIn.value].join("|"), check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  ansIn.addEventListener("input", e => { if (!e.isComposing) later(900); }); ansIn.addEventListener("change", () => later(200));
  ansIn.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); ansIn.blur(); } });
  body.append(chips, own, prob, h("p", { class: "sent" }, "답: ", ansIn, " cm²"), ci6Calc());
}

/* ---------- 10차시: 땅을 더 넓게 차지해 보아요 ---------- */
function ci6Land(body, api, opt) {
  const GW = 16, GH = 12, c = 24, m = 8, W = GW * c + 2 * m, H = GH * c + 2 * m;
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "30em";
  s.append(svgEl("rect", { x: m, y: m, width: GW * c, height: GH * c, fill: "#fff", stroke: CI6.ink, "stroke-width": 2 }));
  for (let i = 1; i < GW; i++) ci6Line(s, m + i * c, m, m + i * c, m + GH * c, "#D7E1E9", 1);
  for (let j = 1; j < GH; j++) ci6Line(s, m, m + j * c, m + GW * c, m + j * c, "#D7E1E9", 1);
  const lay = svgEl("g"); s.append(lay);
  const ghost = ci6Circle(s, -100, -100, 10, { stroke: CI6.gray, "stroke-width": 2, "stroke-dasharray": "5 4", "pointer-events": "none" });
  const P = [{ name: "파랑", col: CI6.blue, fill: "rgba(43,123,214,.22)", sum: 0, n: 0 }, { name: "빨강", col: CI6.red, fill: "rgba(214,69,69,.22)", sum: 0, n: 0 }];
  const circles = []; let turn = 0, die = 0, ph = "roll", turns = 0, over = false;
  const fits = (x, y, r) => x - r >= 0 && x + r <= GW && y - r >= 0 && y + r <= GH && circles.every(q => (x - q.x) ** 2 + (y - q.y) ** 2 >= (r + q.r) ** 2);
  const anyFit = r => { for (let x = 0; x <= GW; x++) for (let y = 0; y <= GH; y++) if (fits(x, y, r)) return true; return false; };
  const cards = P.map(p => h("div", { class: "ci6pl" }));
  const say = h("p", { class: "ci6read" }), dieBox = h("span", { class: "ci6die" }, "?");
  const areaIn = h("input", { type: "text", inputmode: "decimal", "aria-label": "원의 넓이", style: "width:6em;max-width:100%;font-size:1.1em;text-align:center" });
  const rLab = h("span");
  const askRow = h("p", { class: "sent hidden" }, "반지름이 ", rLab, " cm인 원의 넓이: ", areaIn, " cm² ");
  const okBtn = h("button", { type: "button", class: "ci6ctog" }, "넓이 확인");
  askRow.append(okBtn);
  const rollBtn = h("button", { type: "button", class: "ci6ctog" }, "주사위 굴리기");
  const endBtn = h("button", { type: "button", class: "ci6ctog", disabled: "disabled" }, "놀이 끝내기");
  const sync = () => {
    P.forEach((p, i) => { cards[i].innerHTML = ""; cards[i].append(h("div", { style: `color:${p.col}` }, `${p.name} (${p.n}개)`), h("div", {}, `넓이의 합 ${ci6S(p.sum)} cm²`)); cards[i].classList.toggle("ci6-turn", !over && i === turn); });
    rollBtn.disabled = over || ph !== "roll"; endBtn.disabled = over || turns < 6;
  };
  const pass = why => { say.textContent = `${why} ${P[1 - turn].name} 차례예요. 주사위를 굴려요.`; turn = 1 - turn; ph = "roll"; turns++; askRow.classList.add("hidden"); ghost.setAttribute("cx", -100); sync(); if (!anyFit(1)) finish(); };
  const finish = () => {
    if (over) return; over = true; ph = "end"; askRow.classList.add("hidden"); sync();
    const [a, b] = P, res = a.sum === b.sum ? "비겼어요" : `${(a.sum > b.sum ? a : b).name}이 이겼어요`;
    say.textContent = `놀이 끝! 파랑 ${ci6S(a.sum)} cm², 빨강 ${ci6S(b.sum)} cm² → ${res}.`;
    api.done(`파랑 ${ci6S(a.sum)}, 빨강 ${ci6S(b.sum)}`, opt.ok);
  };
  rollBtn.addEventListener("click", () => {
    if (ph !== "roll" || over) return; die = 1 + Math.floor(Math.random() * 6); dieBox.textContent = String(die); rLab.textContent = String(die);
    if (!anyFit(die)) return pass(`${P[turn].name}: ${ci6Jo(die, "이/가")} 나왔지만 반지름이 ${die} cm인 원을 그릴 자리가 없어요.`);
    ph = "area"; areaIn.value = ""; askRow.classList.remove("hidden"); say.textContent = `${P[turn].name}: ${ci6Jo(die, "이/가")} 나왔어요. 반지름이 ${die} cm인 원의 넓이를 구해요.`; areaIn.focus(); sync();
  });
  okBtn.addEventListener("click", () => {
    if (ph !== "area") return; const v = ci6Num(areaIn.value);
    if (Math.abs(v - ci6Area(die)) < 1e-9) { ph = "place"; askRow.classList.add("hidden"); say.textContent = `맞아요! ${die}×${die}×3.14=${ci6S(ci6Area(die))} (cm²). 모눈의 점을 눌러 원의 중심을 정해요. 다른 원과 겹치면 안 돼요(한 점에서 만나는 것은 돼요).`; sync(); }
    else pass(`${P[turn].name}: 넓이가 틀렸어요(${die}×${die}×3.14=${ci6S(ci6Area(die))}).`);
  });
  endBtn.addEventListener("click", finish);
  const pt = p => ({ x: Math.round((p.x - m) / c), y: Math.round((p.y - m) / c) });
  s.addEventListener("pointermove", e => { if (ph !== "place") return; const q = pt(svgPt(s, e)); ghost.setAttribute("cx", m + q.x * c); ghost.setAttribute("cy", m + q.y * c); ghost.setAttribute("r", die * c); ghost.setAttribute("stroke", fits(q.x, q.y, die) ? P[turn].col : CI6.gray); });
  s.addEventListener("click", e => {
    if (ph !== "place") return; const q = pt(svgPt(s, e));
    if (!fits(q.x, q.y, die)) { say.textContent = "그곳에는 그릴 수 없어요. 모눈종이 밖으로 나가거나 다른 원과 겹쳐요. 다른 점을 눌러요."; return; }
    const p = P[turn]; circles.push({ x: q.x, y: q.y, r: die });
    ci6Circle(lay, m + q.x * c, m + q.y * c, die * c, { fill: p.fill, stroke: p.col, "stroke-width": 2.5 });
    lay.append(txt(m + q.x * c, m + q.y * c, ci6S(ci6Area(die)), die === 1 ? 8 : die === 2 ? 11 : 14, { fill: p.col }));
    p.sum = ci6R(p.sum + ci6Area(die)); p.n++;
    pass(`${p.name}: 반지름 ${die} cm인 원을 그렸어요.`);
  });
  sync(); say.textContent = "파랑부터 시작해요. 주사위를 굴려요.";
  body.append(h("div", { class: "ci6score" }, ...cards), h("div", { class: "ci6btns" }, rollBtn, dieBox, endBtn), say, askRow, s, ci6Calc(), h("p", { class: "ci6small" }, "여섯 차례가 지나면 ‘놀이 끝내기’로 끝낼 수 있어요. 반지름 1 cm인 원도 그릴 자리가 없으면 저절로 끝나요."));
}

/* ---------- 7·11차시 그림 ---------- */
/* 7차시 활동 2【추정】: 반지름 5 cm인 반원에서 오른쪽 작은 반원을 파내고 왼쪽 아래에 작은 반원을 붙인 모양 */
const CI6_HALF = { X: 230, Y: 150, R: 100 };
function ci6HalfBg(g, lab) {
  const { X, Y, R } = CI6_HALF, r = R / 2;
  g.append(svgEl("path", { d: `M${X - R},${Y} A${R},${R} 0 0 1 ${X + R},${Y} A${r},${r} 0 0 0 ${X},${Y} Z`, fill: CI6.pink, stroke: CI6.ink, "stroke-width": 2.5 }));
  g.append(svgEl("path", { d: `M${X + R},${Y} A${r},${r} 0 0 0 ${X},${Y}`, fill: "none", stroke: CI6.gray, "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
  ci6Line(g, X, Y, X, Y - R, CI6.blue, 2.5); g.append(txt(X - 26, Y - R / 2, lab || "5 cm", 15, { fill: CI6.blue }));
  ci6Circle(g, X, Y, 3, { fill: CI6.ink, stroke: "none" });
}
const CI6_BUMP = `M-50,0 A50,50 0 0 0 50,0 Z`;
/* 7차시 활동 3 왼쪽【추정】: 반지름 8 cm인 반원 + 지름 8 cm인 반원 */
function ci6L7aFig(n) {
  const L = (n || 8) + " cm";
  return ci6Fig(380, 250, s => {
    const k = 13, X = 190, Y = 140, R = 8 * k, r = 4 * k;
    s.append(svgEl("path", { d: `M${X - R},${Y} A${R},${R} 0 0 1 ${X + R},${Y} L${X + R},${Y} A${r},${r} 0 0 1 ${X},${Y} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2.5 }));
    ci6Line(s, X - R, Y, X, Y, CI6.ink, 2.5);
    ci6Dim(s, X - R, Y + 18, X, Y + 18, L, CI6.ink, 14); ci6Dim(s, X, Y - 14, X + R, Y - 14, L, CI6.blue, -12);
    ci6Circle(s, X, Y, 3, { fill: CI6.ink, stroke: "none" });
  }, "18em");
}
/* 7차시 활동 3 오른쪽: 한 변 14 cm 정사각형, 네 모서리에 반지름 7 cm 사분원(색칠하지 않은 부분) */
const CI6_SQ = { x: 30, y: 30, k: 12 };
function ci6SqStarBg(g, holes, lab) {
  const { x, y, k } = CI6_SQ, S = 14 * k, r = 7 * k;
  g.append(svgEl("rect", { x, y, width: S, height: S, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2.5 }));
  [[x, y, 0], [x + S, y, 90], [x + S, y + S, 180], [x, y + S, 270]].forEach(([cx, cy, rot]) => g.append(svgEl("path", { d: `M0,0 L${r},0 A${r},${r} 0 0 1 0,${r} Z`, fill: "#fff", stroke: holes ? CI6.gray : CI6.ink, "stroke-width": holes ? 1.5 : 2, "stroke-dasharray": holes ? "5 4" : "none", transform: `translate(${cx},${cy}) rotate(${rot})` })));
  ci6Dim(g, x, y + S + 16, x + S, y + S + 16, lab || "14 cm", CI6.ink, 14);
}
function ci6SqStarFig(lab) { return ci6Fig(250, 240, g => ci6SqStarBg(g, false, lab), "13em"); }
/* 수학익힘 유사 문제 그림 */
function ci6SemiFig(d, k, lab) { return ci6Fig(d * k + 60, d * k / 2 + 60, s => { const X = 30, Y = d * k / 2 + 22, R = d * k / 2; s.append(svgEl("path", { d: `M${X},${Y} A${R},${R} 0 0 1 ${X + 2 * R},${Y} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2.5 })); ci6Dim(s, X, Y + 16, X + 2 * R, Y + 16, lab, CI6.ink, 14); }, "12em"); }
function ci6QuarterFig(R, k, lab, fill) { return ci6Fig(R * k + 70, R * k + 60, s => { const X = 30, Y = R * k + 20; s.append(svgEl("path", { d: `M${X},${Y} L${X + R * k},${Y} A${R * k},${R * k} 0 0 0 ${X},${Y - R * k} Z`, fill: fill || "#CFE8C9", stroke: CI6.ink, "stroke-width": 2.5 })); ci6Dim(s, X, Y + 16, X + R * k, Y + 16, lab, CI6.ink, 14); }, "11em"); }
function ci6TwoSqFig(lab) {
  return ci6Fig(460, 240, s => {
    const k = 9, S = 18 * k, ax = 30, ay = 20, bx = 260;
    s.append(svgEl("rect", { x: ax, y: ay, width: S, height: S, fill: "#fff", stroke: CI6.ink, "stroke-width": 2 }));
    s.append(svgEl("path", { d: `M${ax},${ay + S} L${ax + S},${ay + S} A${S},${S} 0 0 0 ${ax},${ay} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2 }));
    s.append(svgEl("rect", { x: bx, y: ay, width: S, height: S, fill: "#fff", stroke: CI6.ink, "stroke-width": 2 }));
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const x = bx + i * S / 2, y = ay + j * S / 2, r = S / 2; s.append(svgEl("path", { d: `M${x},${y + r} L${x + r},${y + r} A${r},${r} 0 0 0 ${x},${y} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 1.6 })); }
    ci6Line(s, bx + S / 2, ay, bx + S / 2, ay + S, CI6.ink, 1.6); ci6Line(s, bx, ay + S / 2, bx + S, ay + S / 2, CI6.ink, 1.6);
    s.append(txt(ax + S / 2, ay + S + 22, `가 (${lab || "18 cm"})`, 15), txt(bx + S / 2, ay + S + 22, `나 (${lab || "18 cm"})`, 15));
  }, "24em");
}
function ci6BigMinusFig(labR, labr) {
  return ci6Fig(330, 190, s => {
    const k = 6.5, X = 165, Y = 160, R = 20 * k, r = 10 * k;
    s.append(svgEl("path", { d: `M${X - R},${Y} A${R},${R} 0 0 1 ${X + R},${Y} A${r},${r} 0 0 0 ${X},${Y} A${r},${r} 0 0 0 ${X - R},${Y} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2.5 }));
    ci6Line(s, X, Y, X - R * .6, Y - R * .8, CI6.red, 2); s.append(txt(X - R * .3 - 24, Y - R * .4 - 8, labR || "20 cm", 14, { fill: CI6.red }));
    ci6Dim(s, X - R, Y + 14, X - r, Y + 14, labr || "10 cm", CI6.ink, 12);
    ci6Circle(s, X, Y, 3, { fill: CI6.ink, stroke: "none" });
  }, "17em");
}
/* 지도서 계산기 예시: 지름 12 cm 반원에서 지름 8 cm 반원을 빼고 지름 4 cm 반원을 붙인 모양 */
function ci6YinFig(la, lb, lc) {
  return ci6Fig(340, 240, s => {
    const k = 22, X = 40, Y = 145;
    s.append(svgEl("path", { d: `M${X},${Y} A${6 * k},${6 * k} 0 0 1 ${X + 12 * k},${Y} A${4 * k},${4 * k} 0 0 0 ${X + 4 * k},${Y} A${2 * k},${2 * k} 0 0 1 ${X},${Y} Z`, fill: "#F7C9A5", stroke: CI6.ink, "stroke-width": 2.5 }));
    ci6Line(s, X, Y, X + 12 * k, Y, CI6.gray, 1.2, { "stroke-dasharray": "4 4" });
    ci6Dim(s, X, Y - 10, X + 4 * k, Y - 10, la || "4 cm", CI6.ink, -10); ci6Dim(s, X + 4 * k, Y + 14, X + 12 * k, Y + 14, lb || "8 cm", CI6.ink, 12); ci6Dim(s, X, Y + 68, X + 12 * k, Y + 68, lc || "12 cm", CI6.ink, 14);
  }, "18em");
}
/* 원 모양 악기 */
function ci6InstrFig() {
  return ci6Fig(520, 190, s => {
    [["징", 90, 72, "#D9B23C", "#8A6A12"], ["탬버린", 260, 62, "#F3E3C3", "#B5792C"], ["소고", 425, 50, "#F6E2CF", "#B5452C"]].forEach(([n, x, r, f, st]) => {
      ci6Circle(s, x, 92, r, { fill: f, stroke: st, "stroke-width": 5 });
      if (n === "징") ci6Circle(s, x, 92, r * .35, { fill: "#C9A02E", stroke: st, "stroke-width": 2 });
      if (n === "탬버린") for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ci6Circle(s, x + r * Math.cos(a), 92 + r * Math.sin(a), 6, { fill: "#C0C6CC", stroke: "#7A8188" }); }
      if (n === "소고") { s.append(svgEl("path", { d: `M${x - 18},${84} q18,-26 36,0 q-18,26 -36,0`, fill: "#3F79B5" })); ci6Line(s, x, 92 + r, x, 92 + r + 30, "#8A5A2B", 7); }
      s.append(txt(x, 182, n, 16));
    });
  }, "28em");
}
//@@LESSONS
