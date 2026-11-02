//@@APP
const APP={title:"수학 체험 마을 원의 둘레와 넓이", unit:"6-2 수학 5. 원의 둘레와 넓이(교과서)", key:"t62-circle-v1", welcome:"수학 체험 마을 원의 둘레와 넓이 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 채안이와 현준이를 따라 수학 체험 마을을 둘러보며 나무 바퀴의 둘레를 그리고, 원을 굴려 원주를 재고, 원주율을 구하고, 모눈을 칠하고 원을 잘라 이어 붙여 원의 넓이를 알아봐요."};
//@@UNIT
/* =========================================================
   6-2 수학 5. 원의 둘레와 넓이 — 단원 조작 부품 (앞글자 ci6)
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
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); });
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) return api.done(ans, opts.ok);
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(ci6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
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
function ci6Scene(body, api, opt) {
  const W = 640, H = 360, s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "36em";
  s.append(svgEl("rect", { x: 0, y: 0, width: W, height: 210, fill: CI6.sky }), svgEl("rect", { x: 0, y: 210, width: W, height: 150, fill: CI6.grass }));
  s.append(svgEl("path", { d: "M0,250 C140,236 260,262 360,246 C460,232 560,258 640,244 L640,262 C560,276 460,250 360,264 C260,280 140,254 0,268 Z", fill: "#EADBC0" }));
  const items = [], found = new Set();
  const add = (name, circ, draw, ring) => { const g = svgEl("g", { "data-it": items.length }); g.style.cursor = "pointer"; draw(g); s.append(g); items.push({ name, circ, g, ring }); };
  /* 나무로 만든 집 */
  add("집의 벽", false, g => g.append(svgEl("rect", { x: 40, y: 110, width: 150, height: 110, fill: "#D9A066", stroke: CI6.wood2, "stroke-width": 3 })));
  add("지붕", false, g => g.append(svgEl("polygon", { points: "28,112 115,46 202,112", fill: "#B35A3C", stroke: "#7A3523", "stroke-width": 3 })));
  add("문", false, g => g.append(svgEl("rect", { x: 128, y: 150, width: 42, height: 70, fill: "#8A5A2B", stroke: "#5C3A1A", "stroke-width": 3 })));
  add("원 모양 창문", true, g => { g.append(svgEl("circle", { cx: 80, cy: 160, r: 24, fill: "#BFE0F5", stroke: CI6.wood2, "stroke-width": 4 })); ci6Line(g, 56, 160, 104, 160, CI6.wood2, 2.5); ci6Line(g, 80, 136, 80, 184, CI6.wood2, 2.5); }, [80, 160, 32]);
  /* 원 모양 분수와 꽃밭 */
  add("원 모양 분수", true, g => { g.append(svgEl("circle", { cx: 300, cy: 300, r: 44, fill: "#9FB3BF", stroke: "#5E7480", "stroke-width": 3 }), svgEl("circle", { cx: 300, cy: 300, r: 34, fill: CI6.water })); g.append(svgEl("path", { d: "M300,300 q-14,-30 -20,-8 M300,300 q14,-30 20,-8 M300,300 v-30", stroke: "#4A90D9", "stroke-width": 3, fill: "none" })); }, [300, 300, 52]);
  add("원 모양 꽃밭", true, g => { g.append(svgEl("circle", { cx: 420, cy: 305, r: 40, fill: "#8CC084", stroke: "#4F8A47", "stroke-width": 3 })); [[0, 0], [16, -14], [-18, 10], [10, 20], [-14, -18], [24, 8]].forEach(([a, b], i) => g.append(svgEl("circle", { cx: 420 + a, cy: 305 + b, r: 6, fill: ["#F28C9C", "#FFD24D", "#F28C9C", "#B58CE0", "#FFD24D", "#F28C9C"][i] }))); }, [420, 305, 48]);
  /* 물레방아 */
  add("물레방아 바퀴", true, g => { g.append(svgEl("circle", { cx: 560, cy: 140, r: 62, fill: "none", stroke: CI6.wood2, "stroke-width": 9 })); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ci6Line(g, 560, 140, 560 + 58 * Math.cos(a), 140 + 58 * Math.sin(a), "#B9773E", 5); g.append(svgEl("rect", { x: ci6R(560 + 62 * Math.cos(a) - 7), y: ci6R(140 + 62 * Math.sin(a) - 7), width: 14, height: 14, fill: "#B9773E", stroke: CI6.wood2, transform: `rotate(${k * 45} ${ci6R(560 + 62 * Math.cos(a))} ${ci6R(140 + 62 * Math.sin(a))})` })); } g.append(svgEl("circle", { cx: 560, cy: 140, r: 10, fill: CI6.wood2 })); }, [560, 140, 74]);
  add("표지판", false, g => { g.append(svgEl("rect", { x: 232, y: 120, width: 6, height: 92, fill: CI6.wood2 }), svgEl("rect", { x: 210, y: 104, width: 50, height: 50, fill: "#FFE7A0", stroke: CI6.wood2, "stroke-width": 3 })); g.append(txt(235, 129, "마을", 13)); });
  /* 수레 */
  add("수레 짐칸", false, g => g.append(svgEl("rect", { x: 330, y: 160, width: 110, height: 46, fill: "#C98E55", stroke: CI6.wood2, "stroke-width": 3 })));
  add("수레의 나무 바퀴", true, g => { g.append(svgEl("circle", { cx: 360, cy: 216, r: 26, fill: "#E8C08A", stroke: CI6.wood2, "stroke-width": 5 })); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ci6Line(g, 360, 216, 360 + 23 * Math.cos(a), 216 + 23 * Math.sin(a), CI6.wood2, 2.5); } }, [360, 216, 32]);
  const need = items.filter(it => it.circ).length;
  const say = h("p", { class: "ci6read" }, `원 모양을 찾아 눌러요. (0/${need})`);
  const rings = svgEl("g", { "pointer-events": "none" }); s.append(rings);
  s.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest("[data-it]"); if (!t || body.ci6Fin) return;
    const it = items[+t.dataset.it];
    if (!it.circ) { api.tryOnce(); return api.fail(`${ci6Jo(it.name, "은/는")} 원 모양이 아니에요. 어느 쪽에서 보아도 둥글고 끝이 없는 모양을 찾아요.`, it.name); }
    if (found.has(it.name)) return;
    found.add(it.name); ci6Circle(rings, it.ring[0], it.ring[1], it.ring[2], { stroke: CI6.green, "stroke-width": 4, "stroke-dasharray": "8 5" });
    say.textContent = `원 모양을 찾아 눌러요. (${found.size}/${need}) ${[...found].join(", ")}`;
    if (found.size === need) ci6Then(body, api, opt, [...found].join(", "), "수학 체험 마을의 원을 모두 찾았어요.");
    else api.hint(`○ ${ci6Jo(it.name, "을/를")} 찾았어요.`);
  });
  body.append(say, s);
}

/* ---------- 1차시 도전: 같은 길이의 끈으로 만든 도형에 바둑돌 넣기 ---------- */
function ci6String(body, api, opt) {
  const P = 24, k = 22, W = 420, H = 300, C = { x: 198, y: 132 };   // 1칸 = 1 cm, 바둑돌은 1 cm 간격
  const shapes = {
    tri: { name: "정삼각형", inside: (x, y, m) => { const a = 8, hh = a * Math.sqrt(3) / 2, V = [[0, -hh * 2 / 3], [a / 2, hh / 3], [-a / 2, hh / 3]]; return V.every(([x1, y1], e) => { const [x2, y2] = V[(e + 1) % 3]; return ((x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)) / Math.hypot(x2 - x1, y2 - y1) >= m; }); },
      draw: g => { const a = 8, hh = a * Math.sqrt(3) / 2; ci6Poly(g, [[C.x, C.y - hh * 2 / 3 * k], [C.x + a / 2 * k, C.y + hh / 3 * k], [C.x - a / 2 * k, C.y + hh / 3 * k]], { stroke: CI6.red, "stroke-width": 4 }); } },
    sq: { name: "정사각형", inside: (x, y, m) => Math.abs(x) <= 3 - m && Math.abs(y) <= 3 - m, draw: g => ci6Poly(g, [[C.x - 3 * k, C.y - 3 * k], [C.x + 3 * k, C.y - 3 * k], [C.x + 3 * k, C.y + 3 * k], [C.x - 3 * k, C.y + 3 * k]], { stroke: CI6.red, "stroke-width": 4 }) },
    ci: { name: "원", inside: (x, y, m) => Math.hypot(x, y) <= P / (2 * Math.PI) - m, draw: g => ci6Circle(g, C.x, C.y, P / (2 * Math.PI) * k, { stroke: CI6.red, "stroke-width": 4 }) } };
  /* 바둑돌 자리: 1 cm 간격 점. 바둑돌(반지름 8/k cm)이 끈 안에 통째로 들어가야 하고, 도형마다 가장 많이 들어가게 점의 자리를 0.05 cm씩 옮겨 고름 */
  const SR = 8 / k;
  const count = sh => { let best = { n: -1, pts: [] }; for (let dx = 0; dx < 1; dx += .05) for (let dy = 0; dy < 1; dy += .05) { const pts = []; for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const x = i + dx, y = j + dy; if (shapes[sh].inside(x, y, SR)) pts.push([x, y]); } if (pts.length > best.n) best = { n: pts.length, pts }; } return best; };
  const res = {}; Object.keys(shapes).forEach(kk => { res[kk] = count(kk); });
  const best = Object.keys(shapes).reduce((a, b) => res[a].n >= res[b].n ? a : b);
  const s = makeSvg(W, H, k); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "24em";
  const lay = svgEl("g"); s.append(lay);
  const say = h("p", { class: "ci6read" }, "도형을 골라 끈 24 cm로 만들어 보세요.");
  const seen = new Set(), chips = h("div", { class: "ci6chips" });
  const show = kk => {
    lay.innerHTML = ""; shapes[kk].draw(lay);
    res[kk].pts.forEach(([x, y]) => lay.append(svgEl("circle", { cx: ci6R(C.x + x * k), cy: ci6R(C.y + y * k), r: 8, fill: "#2B2B2B", stroke: "#000" })));
    [...chips.children].forEach(b => b.classList.toggle("ci6-pick", b.dataset.k === kk));
    seen.add(kk); say.textContent = `끈 24 cm로 만든 ${shapes[kk].name}에는 바둑돌이 ${res[kk].n}개 들어가요.`;
    if (seen.size === 3) ci6Then(body, api, Object.assign({}, opt, { ask: [{ q: "끈의 길이가 같을 때 바둑돌이 가장 많이 들어가는 도형은 무엇인가요?", parts: [{ o: ["정삼각형", "정사각형", "원"], a: ["tri", "sq", "ci"].indexOf(best) }] },
      { q: "둘레가 같을 때 넓이가 가장 넓은 도형은", parts: [{ o: ["정삼각형", "정사각형", "원"], a: ["tri", "sq", "ci"].indexOf(best) }, "이에요."] }] }), "", "세 도형을 모두 만들어 보았어요.");
  };
  Object.keys(shapes).forEach(kk => chips.append(h("button", { type: "button", "data-k": kk, onclick: () => show(kk) }, shapes[kk].name)));
  body.append(chips, say, s);
}

/* ---------- 2차시: 나무 바퀴에 원의 중심·지름·둘레 표시하기 ---------- */
function ci6Wheel(body, api, opt) {
  const W = 420, C = { x: 210, y: 210 }, R = 170;
  const s = makeSvg(W, W); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "21em";
  ci6Circle(s, C.x, C.y, R, { fill: CI6.wood, stroke: CI6.wood2, "stroke-width": 4 });
  ci6Circle(s, C.x, C.y, R - 26, { fill: "#FFF8EC", stroke: CI6.wood2, "stroke-width": 3 });
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; ci6Line(s, C.x + 22 * Math.cos(a), C.y + 22 * Math.sin(a), C.x + (R - 27) * Math.cos(a), C.y + (R - 27) * Math.sin(a), "#C98E55", 13); }
  ci6Circle(s, C.x, C.y, 26, { fill: "#B9773E", stroke: CI6.wood2, "stroke-width": 3 });
  const lay = svgEl("g", { "pointer-events": "none" }); s.append(lay);
  const msgs = ["① 바퀴에서 찾을 수 있는 가장 큰 원의 중심을 눌러요.", "② 가장 큰 원의 둘레(바퀴의 가장 바깥) 위의 한 점에서 원의 중심을 지나 반대쪽 둘레까지 끌어 지름을 그어요.", "③ 철판을 덧댈 곳, 가장 큰 원의 둘레를 따라 한 바퀴 그려요.", "가장 큰 원의 중심, 지름, 둘레를 모두 표시했어요."];
  const say = h("p", { class: "ci6read" }, msgs[0]);
  let ph = 0, p0 = null, line = null, trail = null, pts = [];
  const tr = sweepTracker();
  const finish = () => { ph = 3; say.textContent = msgs[3]; ci6Then(body, api, opt, "중심·지름·둘레 표시", "가장 큰 원의 중심, 지름, 둘레를 표시했어요."); };
  dragOn(s, p => {
    if (ph === 0) {
      if (dist(p, C) < 26) { ph = 1; ci6Circle(lay, C.x, C.y, 7, { fill: CI6.red, stroke: "#fff", "stroke-width": 2 }); lay.append(txt(C.x + 30, C.y - 34, "원의 중심", 16, { fill: CI6.red })); say.textContent = msgs[1]; api.hint("원의 중심을 찾았어요."); }
      else api.hint("바퀴의 한가운데를 눌러 봐요.");
      return false;
    }
    if (ph === 1) {
      if (Math.abs(dist(p, C) - R) > 24) { api.hint("가장 큰 원의 둘레(바퀴의 가장 바깥) 위에서 시작해요."); return false; }
      p0 = p; line = ci6Line(lay, p.x, p.y, p.x, p.y, CI6.blue, 5); return true;
    }
    if (ph === 2) {
      if (Math.abs(dist(p, C) - R) > 28) { api.hint("바퀴의 가장 바깥 둘레를 따라 그려요."); return false; }
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
  body.append(say, s, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { if (ph < 3) { api.tryOnce(); api.fail(["원의 중심을 먼저 눌러요.", "지름을 그어요.", "둘레를 한 바퀴 다 그려요."][ph]); } } }, "확인하기")));
}

/* ---------- 2차시: 원을 굴리고 정육각형·정사각형의 둘레를 수직선에 늘이기 ---------- */
function ci6Unroll(body, api, opt) {
  const k = 60, x0 = 70, W = 640, H = 500, base = 292;     // 1 cm = 60
  const rows = { hex: { y: 382, v: 1, col: CI6.green, name: "정육각형의 둘레", want: 6 }, sq: { y: 432, v: 1, col: CI6.red, name: "정사각형의 둘레", want: 8 } };
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "36em";
  /* 위 오른쪽: 원 안의 정육각형과 원 밖의 정사각형 */
  const F = { x: 530, y: 88 };
  ci6Poly(s, [[F.x - k, F.y - k], [F.x + k, F.y - k], [F.x + k, F.y + k], [F.x - k, F.y + k]], { stroke: CI6.red, "stroke-width": 3, fill: "#FDECEC" });
  ci6Circle(s, F.x, F.y, k, { fill: "#fff", stroke: CI6.blue, "stroke-width": 3 });
  ci6Poly(s, [0, 1, 2, 3, 4, 5].map(i => [F.x + k * Math.cos(i * Math.PI / 3), F.y + k * Math.sin(i * Math.PI / 3)]), { stroke: CI6.green, "stroke-width": 3, fill: "#E3F4EA" });
  ci6Line(s, F.x, F.y, F.x + k, F.y, CI6.ink, 2); s.append(txt(F.x + k / 2, F.y - 11, "1 cm", 14));
  ci6Line(s, F.x - k, F.y + k + 12, F.x + k, F.y + k + 12, CI6.ink, 1.5); s.append(txt(F.x, F.y + k + 26, "2 cm", 14));
  /* 수직선과 세로 눈금선 */
  for (let i = 0; i <= 9; i++) ci6Line(s, x0 + i * k, base + 6, x0 + i * k, 464, "#DCE4E0", 1.2, { "stroke-dasharray": "4 4" });
  ci6Line(s, x0 - 8, 467, x0 + 9 * k + 8, 467, CI6.ink, 2);
  for (let i = 0; i <= 18; i++) { const x = x0 + i * k / 2; ci6Line(s, x, 467, x, i % 2 ? 474 : 479, CI6.ink, 1.6); if (i % 2 === 0) s.append(txt(x, 491, String(i / 2), 14)); }
  s.append(txt(x0 - 36, 491, "(cm)", 12, { fill: CI6.gray }));
  /* 원의 지름 막대 */
  ci6Line(s, x0, 332, x0 + 2 * k, 332, CI6.gray, 9); s.append(txt(x0 + 2 * k + 10, 332, "원의 지름 (2 cm)", 14, { "text-anchor": "start", fill: CI6.gray }));
  /* 끌어서 늘이는 막대 */
  Object.values(rows).forEach(r => {
    r.bar = ci6Line(s, x0, r.y, x0 + r.v * k, r.y, r.col, 9);
    s.append(txt(x0, r.y - 24, r.name, 14, { "text-anchor": "start", fill: r.col }));
    r.hd = ci6Circle(s, x0 + r.v * k, r.y, 12, { fill: "#fff", stroke: r.col, "stroke-width": 3.5 }); r.hd.style.cursor = "ew-resize";
    r.lab = txt(x0 + r.v * k + 18, r.y, "1 cm", 14, { fill: r.col, "text-anchor": "start" }); s.append(r.lab);
  });
  const set = (r, v) => { r.v = v; const x = x0 + v * k; r.bar.setAttribute("x2", x); r.hd.setAttribute("cx", x); r.lab.setAttribute("x", Math.min(x + 18, W - 40)); r.lab.textContent = ci6S(v) + " cm"; };
  /* 굴리는 원 */
  const roll = svgEl("g"); roll.append(svgEl("circle", { cx: 0, cy: 0, r: k, fill: "#EAF3FD", stroke: CI6.blue, "stroke-width": 3 }));
  ci6Line(roll, 0, 0, 0, k, CI6.gray, 2); roll.append(svgEl("circle", { cx: 0, cy: k, r: 6, fill: CI6.red }));
  const trace = ci6Line(s, x0, base, x0, base, CI6.blue, 9); s.append(roll);
  ci6Line(s, x0 - 10, base + 6, x0 + 9 * k, base + 6, "#B9C4CC", 1.5);
  const place = d => { roll.setAttribute("transform", `translate(${ci6R(x0 + d * k)},${base - k}) rotate(${ci6R(d * 180 / Math.PI)})`); trace.setAttribute("x2", ci6R(x0 + d * k)); };
  place(0);
  let rolled = false, rolling = false;
  const circLab = txt(x0 + 4, base + 22, "", 14, { "text-anchor": "start", fill: CI6.blue }); s.append(circLab);
  const rollBtn = h("button", { type: "button", onclick: () => {
    if (rolling) return; rolling = true; const t0 = performance.now(), T = 1800;
    const step = now => { const t = Math.min(1, (now - t0) / T); place(t * 2 * Math.PI); if (t < 1) requestAnimationFrame(step); else { rolling = false; rolled = true; circLab.textContent = "원주(원이 한 바퀴 굴러간 길이)"; api.hint("빨간 점이 다시 땅에 닿을 때까지 한 바퀴 굴렀어요. 파란 선의 길이가 원주예요."); } };
    requestAnimationFrame(step);
  } }, "원 한 바퀴 굴리기");
  let cur = null;
  dragOn(s, p => { cur = Object.values(rows).find(r => Math.hypot(p.x - (x0 + r.v * k), p.y - r.y) < 26) || null; return !!cur; },
    p => { if (cur) set(cur, Math.max(.5, Math.min(9, Math.round((p.x - x0) / k * 2) / 2))); }, () => { cur = null; });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = `정육각형 ${rows.hex.v} cm, 정사각형 ${rows.sq.v} cm`;
    if (!rolled) return api.fail("‘원 한 바퀴 굴리기’를 눌러 원주를 먼저 수직선에 나타내요.", ans);
    if (rows.hex.v !== 6) return api.fail("정육각형의 한 변은 원의 반지름과 같은 1 cm예요. 변 6개의 길이를 모두 더한 만큼 초록 막대를 늘여요.", ans);
    if (rows.sq.v !== 8) return api.fail("정사각형의 한 변은 원의 지름과 같은 2 cm예요. 변 4개의 길이를 모두 더한 만큼 빨간 막대를 늘여요.", ans);
    ci6Then(body, api, opt, ans, "정육각형의 둘레는 6 cm, 정사각형의 둘레는 8 cm예요.");
  } }, "확인하기");
  body.append(h("div", { class: "ci6btns" }, rollBtn), s, h("p", { class: "ci6small" }, "초록·빨간 막대 끝의 동그라미를 끌어 길이를 바꿔요(0.5 cm씩)."), h("div", { class: "actions" }, check));
}

/* ---------- 3차시: 삼각자로 지름 재고 실로 원주 재기 ---------- */
function ci6ObjG(g, kind, cx, cy, r) {
  if (kind === "candle") { ci6Circle(g, cx, cy, r, { fill: "#FFF3D6", stroke: "#D9B36A", "stroke-width": 3 }); ci6Circle(g, cx, cy, r * .7, { stroke: "#EAD3A0", "stroke-width": 2 }); ci6Circle(g, cx, cy, r * .12, { fill: "#5C3A1A", stroke: "none" }); }
  else if (kind === "clock") { ci6Circle(g, cx, cy, r, { fill: "#fff", stroke: "#4A6A8A", "stroke-width": 4 }); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ci6Line(g, cx + r * .82 * Math.cos(a), cy + r * .82 * Math.sin(a), cx + r * .92 * Math.cos(a), cy + r * .92 * Math.sin(a), CI6.ink, 2.5); } ci6Line(g, cx, cy, cx, cy - r * .6, CI6.ink, 3.5); ci6Line(g, cx, cy, cx + r * .45, cy + r * .1, CI6.ink, 3.5); }
  else if (kind === "tray") { ci6Circle(g, cx, cy, r, { fill: "#E9C79C", stroke: "#A8743F", "stroke-width": 3 }); ci6Circle(g, cx, cy, r * .85, { fill: "#F3DDBE", stroke: "#C8955C", "stroke-width": 2 }); }
  else if (kind === "button") { ci6Circle(g, cx, cy, r, { fill: "#F6B38E", stroke: "#C9744A", "stroke-width": 3 }); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => ci6Circle(g, cx + a * r * .25, cy + b * r * .25, r * .1, { fill: "#8A4A2A", stroke: "none" })); }
  else if (kind === "plate") { ci6Circle(g, cx, cy, r, { fill: "#fff", stroke: "#7FA8C9", "stroke-width": 3 }); ci6Circle(g, cx, cy, r * .65, { stroke: "#BFD6E8", "stroke-width": 2 }); }
  else if (kind === "pan") { ci6Circle(g, cx, cy, r, { fill: "#4A4F55", stroke: "#2B2F33", "stroke-width": 4 }); ci6Circle(g, cx, cy, r * .88, { fill: "#5E646B", stroke: "none" }); }
}
function ci6Lab(body, api, opt) {
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
function ci6Roll(body, api, opt) {
  const D = opt.d, k = 28, x0 = 95, gy = 222, r = D / 2 * k, W = 720, H = 280, goal = x0 + D * Math.PI * k;
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "38em";
  s.append(svgEl("rect", { x: 0, y: gy, width: W, height: H - gy, fill: "#EADBC0" }));
  ci6Line(s, 0, gy, W, gy, "#8A6A45", 3);
  for (let m = 0; m <= 22; m++) { const x = x0 + m * k; ci6Line(s, x, gy, x, gy + (m % 2 ? 7 : 12), CI6.ink, 1.4); if (m % 2 === 0) s.append(txt(x, gy + 46, String(m), 13)); }
  s.append(txt(x0 - 40, gy + 46, "(m)", 12, { fill: CI6.gray }));
  const trace = ci6Line(s, x0, gy + 3, x0, gy + 3, CI6.blue, 6);
  const bars = svgEl("g"); s.append(bars);
  const wheel = svgEl("g"); wheel.style.cursor = "grab";
  wheel.append(svgEl("circle", { cx: 0, cy: 0, r, fill: "rgba(217,160,102,.25)", stroke: CI6.wood2, "stroke-width": 7 }));
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ci6Line(wheel, 0, 0, r * Math.cos(a), r * Math.sin(a), "#B9773E", 5); wheel.append(svgEl("rect", { x: ci6R(r * Math.cos(a + Math.PI / 8) - 8), y: ci6R(r * Math.sin(a + Math.PI / 8) - 8), width: 16, height: 16, fill: "#B9773E", stroke: CI6.wood2, transform: `rotate(${i * 45 + 22.5} ${ci6R(r * Math.cos(a + Math.PI / 8))} ${ci6R(r * Math.sin(a + Math.PI / 8))})` })); }
  wheel.append(svgEl("circle", { cx: 0, cy: 0, r: 10, fill: CI6.wood2 }), svgEl("circle", { cx: 0, cy: r, r: 8, fill: CI6.red, stroke: "#fff", "stroke-width": 2 }));
  s.append(wheel);
  ci6Line(s, x0, gy - 2 * r - 14, x0, gy, CI6.red, 1.5, { "stroke-dasharray": "4 4" }); s.append(txt(x0, gy - 2 * r - 24, "출발", 13, { fill: CI6.red }));
  let cx = x0, done = false, off = 0;
  const place = () => { wheel.setAttribute("transform", `translate(${ci6R(cx)},${gy - r}) rotate(${ci6R((cx - x0) / r * 180 / Math.PI)})`); trace.setAttribute("x2", ci6R(cx)); };
  place();
  const say = h("p", { class: "ci6read" }, `지름이 ${D} m인 물레방아 바퀴를 끌어 오른쪽으로 굴려요. 빨간 점이 다시 땅에 닿을 때까지 한 바퀴만 굴려요.`);
  dragOn(s, p => { if (done || dist(p, { x: cx, y: gy - r }) > r + 10) return false; off = p.x - cx; return true; },
    p => { cx = Math.max(x0, Math.min(x0 + 20 * k, p.x - off)); place(); },
    () => {
      const m = (cx - x0) / k;
      if (Math.abs(cx - goal) < .5 * k) {
        cx = goal; place(); done = true;
        for (let i = 0; i < 3; i++) ci6Line(bars, x0 + i * D * k + 2, gy - 12, x0 + (i + 1) * D * k - 2, gy - 12, i % 2 ? CI6.purple : CI6.org, 7);
        ci6Line(bars, x0 + 3 * D * k + 2, gy - 12, goal, gy - 12, CI6.green, 7);
        [0, 1, 2].forEach(i => bars.append(txt(x0 + (i + .5) * D * k, gy - 26, `지름 ${D} m`, 13, { fill: i % 2 ? CI6.purple : CI6.org })));
        say.textContent = `한 바퀴 굴렀어요! 바퀴가 굴러간 거리(원주)에는 지름 ${D} m가 3번 들어가고 조금 남아요.`;
        ci6Then(body, api, opt, "한 바퀴", "바퀴가 한 바퀴 굴러간 거리가 원주예요.");
      } else if (cx > goal) api.hint("한 바퀴보다 더 굴렀어요. 빨간 점이 처음으로 다시 땅에 닿는 곳까지만 굴려요.");
      else if (m > .3) api.hint("빨간 점이 다시 땅에 닿을 때까지 더 굴려요.");
    });
  const reset = h("button", { type: "button", onclick: () => { if (done) return; cx = x0; place(); } }, "처음 자리로");
  body.append(say, s, h("div", { class: "ci6btns" }, reset), h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { if (!done) { api.tryOnce(); api.fail("바퀴를 끌어 꼭 한 바퀴만 굴려요. 빨간 점이 다시 땅에 닿는 곳이에요."); } } }, "확인하기")));
}

/* ---------- 4차시: 지름을 바꾸며 원주 맞추기 ---------- */
function ci6Diam(body, api, opt) {
  const W = 360, H = 300, C = { x: 180, y: 150 };
  const s = makeSvg(W, H); s.setAttribute("class", "ci6fig"); s.style.maxWidth = "20em";
  const ring = ci6Circle(s, C.x, C.y, 60, { fill: "#E5DDD2", stroke: "#7A6A5A", "stroke-width": 4 });
  const dl = ci6Line(s, C.x - 60, C.y, C.x + 60, C.y, CI6.red, 3); const dt = txt(C.x, C.y - 14, "", 16, { fill: CI6.red }); s.append(dt);
  const out = h("p", { class: "ci6read" });
  const rng = h("input", { type: "range", min: String(opt.min), max: String(opt.max), step: "1", value: String(opt.start), "aria-label": "지름", style: "width:100%;max-width:22em" });
  const upd = () => { const d = +rng.value, rr = d * 3.4; ring.setAttribute("r", ci6R(rr)); dl.setAttribute("x1", ci6R(C.x - rr)); dl.setAttribute("x2", ci6R(C.x + rr)); dt.textContent = `지름 ${d} cm`;
    const c = ci6Circ(d); out.textContent = `지름 ${d} cm → 원주 ${d}×3.14 = ${ci6S(c)} cm ${Math.abs(c - opt.C) < 1e-9 ? "← 단면의 원주와 같아요!" : c < opt.C ? "(단면의 원주보다 짧아요)" : "(단면의 원주보다 길어요)"}`; };
  rng.addEventListener("input", upd); upd();
  body.append(h("div", { class: "ci6box" }, `기둥의 단면의 원주: ${ci6S(opt.C)} cm`), s, rng, out,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { api.tryOnce(); if (Math.abs(ci6Circ(+rng.value) - opt.C) < 1e-9) ci6Then(body, api, opt, `지름 ${rng.value} cm`, `지름이 ${rng.value} cm일 때 원주가 ${ci6S(opt.C)} cm가 돼요.`); else api.fail(`원주가 ${ci6S(opt.C)} cm가 되도록 막대를 움직여 지름을 바꿔요.`, `지름 ${rng.value} cm`); } }, "확인하기")));
}

/* ---------- 5차시: 원 안·밖 정사각형 그리기 ---------- */
function ci6InOut(body, api, opt) {
  const W = 360, C = { x: 180, y: 180 }, R = 120, rr = opt.r;
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
    const m = { x: (C.x + Q[0].x) / 2, y: (C.y + Q[0].y) / 2 }; inn.append(txt(ci6R(m.x + 16), ci6R(m.y), `${rr} m`, 15, { fill: CI6.green }));
    ci6Poly(out, [[C.x - R, C.y - R], [C.x + R, C.y - R], [C.x + R, C.y + R], [C.x - R, C.y + R]], { fill: "#FDECEC", stroke: CI6.red, "stroke-width": 3.5 });
    ci6Dim(out, C.x - R, C.y + R + 14, C.x + R, C.y + R + 14, `${2 * rr} m`, CI6.red, 14);
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
  dragOn(s, p => { if (body.ci6Fin) return false; const k = at(p); if (k < 0) return false; painting = true; st[k] = pen; show(); return true; },
    p => { if (!painting) return; const k = at(p); if (k >= 0 && st[k] !== pen) { st[k] = pen; show(); } }, () => { painting = false; });
  show();
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = cnt.textContent;
    let msg = null;
    if (st.some((v, k) => v && !T[k])) msg = "원과 만나지 않는 칸을 칠했어요. 지우개로 지워요.";
    else if (st.some((v, k) => v === 1 && T[k] === 2)) msg = "초록 칸 중에 원의 둘레가 지나가는 칸이 있어요. 칸 전체가 원 안에 들어가야 초록이에요.";
    else if (st.some((v, k) => v === 2 && T[k] === 1)) msg = "주황 칸 중에 원 안에 완전히 들어간 칸이 있어요. 그 칸은 초록으로 칠해요.";
    else if (T.some((v, k) => v === 1 && st[k] !== 1)) msg = "원 안에 완전히 들어간 칸을 모두 초록으로 칠해요.";
    else if (T.some((v, k) => v === 2 && st[k] !== 2)) msg = "원의 둘레가 조금이라도 지나가는 칸을 모두 주황으로 칠해요.";
    if (msg) return api.fail(msg, ans);
    ci6Then(body, api, opt, ans, "칸을 알맞게 칠했어요.");
  } }, "확인하기");
  body.append(h("p", { class: "ci6small" }, "원을 4등분한 한 조각이에요. 칸을 누르거나 끌어서 칠해요."), pens, s, cnt, h("div", { class: "actions" }, check));
}

/* ---------- 6차시: 원을 잘라 이어 붙이기 ---------- */
function ci6Cut(body, api, opt) {
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
function ci6Move(body, api, opt) {
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
  body.append(say, s, h("div", { class: "ci6btns" }, reset), h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { if (!allIn()) { api.tryOnce(); api.fail(opt.miss || "조각을 모두 옮겨 모양을 바꾸어요."); } } }, "확인하기")));
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
  body.append(chips, own, prob, h("p", { class: "sent" }, "답: ", ansIn, " cm²"), ci6Calc(), h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const c = pick == null ? null : cur(), v = ci6Num(ansIn.value);
    if (!c) return api.fail("먼저 물건을 골라 문제를 만들어요.", "-");
    if (!(c.d > 0) || c.d > 500) return api.fail("지름을 알맞은 수로 써요(cm).", dIn.value);
    const r = c.d / 2, A = ci6Area(r);
    if (Math.abs(v - A) < 1e-9) return api.done(`${c.name} 지름 ${ci6S(c.d)} cm → ${ci6S(A)} cm²`, `반지름이 ${ci6S(r)} cm이므로 ${ci6S(r)}×${ci6S(r)}×3.14=${ci6S(A)} (cm²)예요.`);
    if (Math.abs(v - ci6Area(c.d)) < 1e-9) return api.fail("지름을 두 번 곱했어요. 지름을 2로 나누어 반지름을 먼저 구해요.", ansIn.value);
    if (Math.abs(v - ci6Circ(c.d)) < 1e-9) return api.fail("그건 원주예요. 원의 넓이는 (반지름)×(반지름)×(원주율)이에요.", ansIn.value);
    api.fail("(반지름)×(반지름)×(원주율)로 다시 계산해 봐요. 계산기를 써도 돼요.", ansIn.value);
  } }, "확인하기")));
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
function ci6HalfBg(g) {
  const { X, Y, R } = CI6_HALF, r = R / 2;
  g.append(svgEl("path", { d: `M${X - R},${Y} A${R},${R} 0 0 1 ${X + R},${Y} A${r},${r} 0 0 0 ${X},${Y} Z`, fill: CI6.pink, stroke: CI6.ink, "stroke-width": 2.5 }));
  g.append(svgEl("path", { d: `M${X + R},${Y} A${r},${r} 0 0 0 ${X},${Y}`, fill: "none", stroke: CI6.gray, "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
  ci6Line(g, X, Y, X, Y - R, CI6.blue, 2.5); g.append(txt(X - 26, Y - R / 2, "5 cm", 15, { fill: CI6.blue }));
  ci6Circle(g, X, Y, 3, { fill: CI6.ink, stroke: "none" });
}
const CI6_BUMP = `M-50,0 A50,50 0 0 0 50,0 Z`;
/* 7차시 활동 3 왼쪽【추정】: 반지름 8 cm인 반원 + 지름 8 cm인 반원 */
function ci6L7aFig() {
  return ci6Fig(380, 250, s => {
    const k = 13, X = 190, Y = 140, R = 8 * k, r = 4 * k;
    s.append(svgEl("path", { d: `M${X - R},${Y} A${R},${R} 0 0 1 ${X + R},${Y} L${X + R},${Y} A${r},${r} 0 0 1 ${X},${Y} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2.5 }));
    ci6Line(s, X - R, Y, X, Y, CI6.ink, 2.5);
    ci6Dim(s, X - R, Y + 18, X, Y + 18, "8 cm", CI6.ink, 14); ci6Dim(s, X, Y - 14, X + R, Y - 14, "8 cm", CI6.blue, -12);
    ci6Circle(s, X, Y, 3, { fill: CI6.ink, stroke: "none" });
  }, "18em");
}
/* 7차시 활동 3 오른쪽: 한 변 14 cm 정사각형, 네 모서리에 반지름 7 cm 사분원(색칠하지 않은 부분) */
const CI6_SQ = { x: 30, y: 30, k: 12 };
function ci6SqStarBg(g, holes) {
  const { x, y, k } = CI6_SQ, S = 14 * k, r = 7 * k;
  g.append(svgEl("rect", { x, y, width: S, height: S, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2.5 }));
  [[x, y, 0], [x + S, y, 90], [x + S, y + S, 180], [x, y + S, 270]].forEach(([cx, cy, rot]) => g.append(svgEl("path", { d: `M0,0 L${r},0 A${r},${r} 0 0 1 0,${r} Z`, fill: "#fff", stroke: holes ? CI6.gray : CI6.ink, "stroke-width": holes ? 1.5 : 2, "stroke-dasharray": holes ? "5 4" : "none", transform: `translate(${cx},${cy}) rotate(${rot})` })));
  ci6Dim(g, x, y + S + 16, x + S, y + S + 16, "14 cm", CI6.ink, 14);
}
function ci6SqStarFig() { return ci6Fig(250, 240, g => ci6SqStarBg(g, false), "13em"); }
/* 수학익힘 유사 문제 그림 */
function ci6SemiFig(d, k, lab) { return ci6Fig(d * k + 60, d * k / 2 + 60, s => { const X = 30, Y = d * k / 2 + 22, R = d * k / 2; s.append(svgEl("path", { d: `M${X},${Y} A${R},${R} 0 0 1 ${X + 2 * R},${Y} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2.5 })); ci6Dim(s, X, Y + 16, X + 2 * R, Y + 16, lab, CI6.ink, 14); }, "12em"); }
function ci6QuarterFig(R, k, lab, fill) { return ci6Fig(R * k + 70, R * k + 60, s => { const X = 30, Y = R * k + 20; s.append(svgEl("path", { d: `M${X},${Y} L${X + R * k},${Y} A${R * k},${R * k} 0 0 0 ${X},${Y - R * k} Z`, fill: fill || "#CFE8C9", stroke: CI6.ink, "stroke-width": 2.5 })); ci6Dim(s, X, Y + 16, X + R * k, Y + 16, lab, CI6.ink, 14); }, "11em"); }
function ci6TwoSqFig() {
  return ci6Fig(460, 240, s => {
    const k = 9, S = 18 * k, ax = 30, ay = 20, bx = 260;
    s.append(svgEl("rect", { x: ax, y: ay, width: S, height: S, fill: "#fff", stroke: CI6.ink, "stroke-width": 2 }));
    s.append(svgEl("path", { d: `M${ax},${ay + S} L${ax + S},${ay + S} A${S},${S} 0 0 0 ${ax},${ay} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2 }));
    s.append(svgEl("rect", { x: bx, y: ay, width: S, height: S, fill: "#fff", stroke: CI6.ink, "stroke-width": 2 }));
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const x = bx + i * S / 2, y = ay + j * S / 2, r = S / 2; s.append(svgEl("path", { d: `M${x},${y + r} L${x + r},${y + r} A${r},${r} 0 0 0 ${x},${y} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 1.6 })); }
    ci6Line(s, bx + S / 2, ay, bx + S / 2, ay + S, CI6.ink, 1.6); ci6Line(s, bx, ay + S / 2, bx + S, ay + S / 2, CI6.ink, 1.6);
    s.append(txt(ax + S / 2, ay + S + 22, "가 (18 cm)", 15), txt(bx + S / 2, ay + S + 22, "나 (18 cm)", 15));
  }, "24em");
}
function ci6BigMinusFig() {
  return ci6Fig(330, 190, s => {
    const k = 6.5, X = 165, Y = 160, R = 20 * k, r = 10 * k;
    s.append(svgEl("path", { d: `M${X - R},${Y} A${R},${R} 0 0 1 ${X + R},${Y} A${r},${r} 0 0 0 ${X},${Y} A${r},${r} 0 0 0 ${X - R},${Y} Z`, fill: "#BFD9F2", stroke: CI6.ink, "stroke-width": 2.5 }));
    ci6Line(s, X, Y, X - R * .6, Y - R * .8, CI6.red, 2); s.append(txt(X - R * .3 - 24, Y - R * .4 - 8, "20 cm", 14, { fill: CI6.red }));
    ci6Dim(s, X - R, Y + 14, X - r, Y + 14, "10 cm", CI6.ink, 12);
    ci6Circle(s, X, Y, 3, { fill: CI6.ink, stroke: "none" });
  }, "17em");
}
/* 지도서 계산기 예시: 지름 12 cm 반원에서 지름 8 cm 반원을 빼고 지름 4 cm 반원을 붙인 모양 */
function ci6YinFig() {
  return ci6Fig(340, 240, s => {
    const k = 22, X = 40, Y = 145;
    s.append(svgEl("path", { d: `M${X},${Y} A${6 * k},${6 * k} 0 0 1 ${X + 12 * k},${Y} A${4 * k},${4 * k} 0 0 0 ${X + 4 * k},${Y} A${2 * k},${2 * k} 0 0 1 ${X},${Y} Z`, fill: "#F7C9A5", stroke: CI6.ink, "stroke-width": 2.5 }));
    ci6Line(s, X, Y, X + 12 * k, Y, CI6.gray, 1.2, { "stroke-dasharray": "4 4" });
    ci6Dim(s, X, Y - 10, X + 4 * k, Y - 10, "4 cm", CI6.ink, -10); ci6Dim(s, X + 4 * k, Y + 14, X + 12 * k, Y + 14, "8 cm", CI6.ink, 12); ci6Dim(s, X, Y + 68, X + 12 * k, Y + 68, "12 cm", CI6.ink, 14);
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
const UNIT_STORY = { title: "채안이와 현준이의 수학 체험 마을", lines: [
  "채안이와 현준이는 수학 체험 마을에 갔어요. 고대 그리스 수학자 복장을 한 선생님의 안내에 따라 마을을 둘러보며 원 모양 창문, 분수와 꽃밭, 물레방아, 수레의 나무 바퀴처럼 마을 곳곳에서 원을 찾았어요.",
  "두 친구와 함께 나무 바퀴의 둘레를 그리고, 원을 굴려 원주를 재고, 원주율을 구하고, 모눈을 칠하고 원을 잘라 이어 붙여 원의 넓이를 구하는 방법을 알아봐요.",
  "교과서 「수학 6-2」 5. 원의 둘레와 넓이의 차시 순서 그대로 만들었어요."],
  one: "원의 둘레와 넓이 · 수학 체험 마을에서 원을 굴리고, 재고, 자르고, 이어 붙여 봐요." };
const UNIT_KEYWORDS = ["원의 중심", "반지름", "지름", "원주", "원주율", "3.14", "정육각형", "정사각형", "어림", "모눈", "원의 넓이", "직사각형", "반원", "계산기"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 원의 둘레와 넓이", soop: "개념 찾기(S)",
  question: "원의 둘레와 원의 넓이는 어떻게 구할 수 있을까요?",
  summary: "인공위성이 지구를 한 바퀴 도는 거리, 바퀴의 둘레, 원 모양 꽃밭의 넓이처럼 우리 주변에는 원의 둘레와 넓이를 구해야 하는 상황이 많아요. 원의 둘레는 끈을 감아 잴 수도 있고, 원의 넓이는 원을 다각형으로 바꾸어 생각할 수도 있어요. 이 단원에서는 원주, 원주율, 원의 넓이를 알아봐요.",
  steps: [
    { name: "이야기 보기", inst: "“지구 주위를 원 모양으로 돌면서 기상과 우주를 관측하는 인공위성이 있대. 이 인공위성이 지구를 한 바퀴 도는 거리는 어떻게 구할 수 있을까?” 그림을 보고 답해 보세요.", hints: ["인공위성은 지구 주위를 원 모양으로 돌아요.", "한 바퀴 도는 거리는 원의 둘레와 같아요."],
      render: (b, a) => quiz(b, a, [
        { q: "인공위성이 지구를 한 바퀴 도는 거리는 무엇과 같을까요?", fig: ci6SatFig, o: ["인공위성이 도는 원의 둘레", "인공위성이 도는 원의 넓이", "지구의 반지름"], a: 0, why: { "1": "넓이는 원 안쪽 평면의 크기예요. 한 바퀴 도는 ‘거리’는 길이예요.", "2": "반지름은 원의 중심에서 원 위의 한 점까지의 거리예요." } },
        { q: "우리 주변에서 원 모양을 찾을 수 있는 것을 모두 골라 보세요.", o: ["시계", "자전거 바퀴", "대관람차", "책상 윗면", "교실 문"], a: [0, 1, 2] }],
        { ok: "인공위성이 한 바퀴 도는 거리는 원의 둘레와 같아요. 시계, 자전거 바퀴, 대관람차에서도 원을 찾을 수 있어요." }) },
    { name: "원 찾기", inst: "채안이와 현준이는 수학 체험 마을에 갔어요. 고대 그리스 수학자 복장을 한 선생님의 안내에 따라 마을을 둘러보며 곳곳에서 원을 찾았어요. 그림에서 원 모양을 모두 찾아 눌러 보세요.", hints: ["나무로 만든 집의 창문을 살펴봐요.", "분수와 꽃밭, 물레방아, 수레에도 원이 있어요.", "지붕, 문, 표지판, 수레 짐칸은 원 모양이 아니에요."],
      render: (b, a) => ci6Scene(b, a, { ask: [{ q: "원의 둘레와 넓이는 어떻게 구할 수 있을지 생각해 보았어요. 알맞은 방법을 모두 골라 보세요.", parts: [{ o: ["둘레를 따라 끈을 감고 그 길이를 재요", "원 모양을 다각형으로 바꾼 뒤 다각형의 넓이를 구하는 방법을 이용해요", "원의 지름만 재면 둘레가 지름과 같아요"], multi: true, a: [0, 1], why: { "0,1,2": "원의 둘레는 지름보다 훨씬 길어요." } }] }],
        ok: "원의 둘레는 끈을 감아 잴 수 있고, 원의 넓이는 원을 다각형으로 바꾸어 생각해 볼 수 있어요." }) },
    { name: "떠올리기 ① 원", inst: "배운 내용을 떠올려 보세요. (수학익힘 ‘이전에 배웠어요’ ― 원의 구성 요소)", hints: ["원의 한가운데에 있는 점을 원의 중심이라고 해요.", "원의 중심과 원 위의 한 점을 이은 선분이 반지름이에요.", "원 위의 두 점을 이은 선분이 원의 중심을 지나면 지름이에요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: ci6PartsFig, parts: ["점 ㅇ은 원의 ", { o: ["중심", "지름", "반지름"], a: 0 }, "이고, 선분 ㅇㄱ은 원의 ", { o: ["중심", "지름", "반지름"], a: 2 }, ", 선분 ㄴㄷ은 원의 ", { o: ["중심", "지름", "반지름"], a: 1 }, "이에요."] },
        { parts: ["반지름이 3 cm인 원의 지름은 ", { n: 6, why: { "3": "지름은 반지름의 2배예요.", "1.5": "지름은 반지름을 2로 나눈 것이 아니라 2배예요." } }, " cm예요."] }],
        { ok: "점 ㅇ은 원의 중심, 선분 ㅇㄱ은 반지름, 선분 ㄴㄷ은 지름이에요. 지름은 반지름의 2배예요." }) },
    { name: "떠올리기 ② 계산", inst: "배운 내용을 떠올려 보세요. (수학익힘 ‘이전에 배웠어요’ ― 다각형의 둘레와 넓이, 소수의 곱셈과 나눗셈)", hints: ["정육각형은 여섯 변의 길이가 모두 같아요.", "삼각형의 넓이는 (밑변의 길이)×(높이)÷2예요.", "자연수의 곱셈·나눗셈처럼 계산한 뒤 소수점을 찍어요. 계산기를 써도 돼요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["한 변이 4 cm인 정육각형의 둘레는 ", { n: 24, why: { "16": "정육각형은 변이 6개예요." } }, " cm예요."] },
        { parts: ["한 변이 6 cm인 정사각형의 넓이는 ", { n: 36, why: { "24": "그건 둘레예요. 넓이는 (한 변의 길이)×(한 변의 길이)예요." } }, " cm²예요."] },
        { parts: ["밑변의 길이가 6 cm, 높이가 4 cm인 삼각형의 넓이는 ", { n: 12, why: { "24": "삼각형의 넓이는 (밑변의 길이)×(높이)÷2예요." } }, " cm²예요."] },
        { parts: ["2.5×3.14 = ", { n: 7.85 }, ",  18.84÷3.14 = ", { n: 6 }] }],
        { ok: "정육각형의 둘레 24 cm, 정사각형의 넓이 36 cm², 삼각형의 넓이 12 cm², 2.5×3.14=7.85, 18.84÷3.14=6이에요.", calc: true }) },
    { name: "확인하기", inst: "이 단원에서 배울 내용을 살펴보고, 알고 싶은 것을 써 보세요.", hints: ["원의 둘레, 원주율, 원의 넓이를 배워요.", "자전거 바퀴, 피자처럼 원 모양 물건을 떠올려 봐요."],
      render: (b, a) => writeStep(b, a, [
        { q: "원의 둘레나 넓이를 구해야 하는 상황을 써 보세요.", tag: "상황", ph: "예) 자전거 바퀴가 한 바퀴 굴러간 거리를 알고 싶을 때" },
        { q: "이 단원에서 알고 싶은 것을 써 보세요.", tag: "알고 싶은 것", ph: "예) 원의 둘레를 재지 않고도 구하는 방법이 궁금해요." }]) }
  ],
  challenge: { inst: "어느 도형에 바둑돌이 가장 많이 들어갈까요? 길이가 24 cm로 같은 끈으로 정삼각형, 정사각형, 원을 만들고, 안에 바둑돌을 1 cm 간격으로 겹치지 않게 넣어 보세요. 세 도형을 모두 만들어 봐요.", hints: ["단추를 눌러 세 도형을 하나씩 만들어 봐요.", "바둑돌의 수를 비교해요.", "둘레가 같으면 원의 넓이가 가장 넓어요."],
    render: (b, a) => ci6String(b, a, { ok: "둘레가 같을 때 원 안에 바둑돌이 가장 많이 들어가요. 원은 둘레가 같은 도형 가운데 넓이가 가장 넓어요." }) }
},
{
  id: "t2", no: 2, title: "원주를 알아볼까요", soop: "개념 구축하기(O)",
  question: "원주는 무엇이고, 원주와 지름 사이에는 어떤 관계가 있을까요?",
  summary: "원의 둘레를 원주라고 해요. 반지름이 1 cm인 원에서 원 안의 정육각형의 둘레는 6 cm로 지름 2 cm의 3배, 원 밖의 정사각형의 둘레는 8 cm로 지름의 4배예요. 원주는 정육각형의 둘레보다 길고 정사각형의 둘레보다 짧으므로, 원주는 지름의 3배보다 길고 4배보다 짧아요.",
  steps: [
    { name: "만져 보기", inst: "“원 모양인 나무 바퀴가 구를 때 땅에 닿는 부분에 철판을 꼭 맞게 덧대야겠어.” 수학 체험 마을의 아름다운 길가에 있는 수레의 나무 바퀴에서 철판이 떨어졌어요. 나무 바퀴에서 찾을 수 있는 가장 큰 원의 중심, 지름, 둘레를 차례로 표시해 보세요. (철판이나 바퀴의 두께는 생각하지 않아요.)", hints: ["바퀴의 한가운데가 원의 중심이에요.", "지름은 원 위의 한 점에서 원의 중심을 지나 반대쪽 원 위의 점까지 이은 선분이에요.", "둘레는 바퀴의 가장 바깥을 따라 한 바퀴 그려요."],
      render: (b, a) => ci6Wheel(b, a, { ask: [{ q: "철판을 덧대야 하는 부분은 어디인가요?", parts: [{ o: ["나무 바퀴에서 찾을 수 있는 가장 큰 원의 둘레", "가장 큰 원의 지름", "원의 중심", "바퀴살"], a: 0, why: { "1": "지름은 원의 안쪽을 가로지르는 선분이라 땅에 닿지 않아요." } }] }],
        ok: "바퀴가 구를 때 땅에 닿는 부분은 가장 큰 원의 둘레예요. 그곳에 철판을 덧대요." }) },
    { name: "약속하기", inst: "약속을 완성해 보세요.", hints: ["원의 둘레를 부르는 새 이름을 배워요.", "‘원주’의 ‘주’는 둘레라는 뜻이에요."],
      render: (b, a) => blanks(b, a, ["원의 둘레를 ", { o: ["원주", "지름", "원주율", "반지름"], a: 0 }, "라고 합니다."], { ok: "원의 둘레를 원주라고 해요." }) },
    { name: "그려 보기", inst: "반지름이 1 cm인 원이 있어요. 원 안에 꼭 맞는 정육각형(초록)과 원 밖에 꼭 맞는 정사각형(빨강)의 둘레를 수직선에 나타내어 원주와 비교해 보세요. 먼저 원을 한 바퀴 굴려 원주를 수직선에 나타내요.", hints: ["정육각형의 한 변의 길이는 원의 반지름과 같은 1 cm예요.", "정사각형의 한 변의 길이는 원의 지름과 같은 2 cm예요.", "정육각형의 둘레는 1×6, 정사각형의 둘레는 2×4예요."],
      render: (b, a) => ci6Unroll(b, a, { ask: [
        { parts: ["원주는 정육각형의 둘레보다 ", { o: ["깁니다", "짧습니다"], a: 0 }, ". 원주는 정사각형의 둘레보다 ", { o: ["깁니다", "짧습니다"], a: 1 }, "."] },
        { parts: ["정육각형의 둘레 6 cm는 원의 지름 2 cm의 ", { n: 3, why: { "6": "6 cm가 지름 2 cm의 몇 배인지 구해요. 6÷2를 계산해요." } }, "배, 정사각형의 둘레 8 cm는 원의 지름의 ", { n: 4, why: { "8": "8÷2를 계산해요." } }, "배예요."] }],
        ok: "정육각형의 둘레(6 cm)는 지름의 3배, 정사각형의 둘레(8 cm)는 지름의 4배예요. 원주는 그 사이에 있어요." }) },
    { name: "말해 보기", inst: "수직선에 나타낸 원주를 보며 원주와 지름의 관계를 말해 보세요.", hints: ["파란 선(원주)의 끝은 6과 7 사이에 있었어요.", "6 cm와 8 cm의 한가운데는 7 cm예요.", "원주는 정육각형의 둘레에 더 가까워요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["원주는 지름의 ", { n: 3 }, "배보다 길고, ", { n: 4 }, "배보다 짧습니다."] },
        { parts: ["(지름)×", { n: 3 }, " < (원주),  (원주) < (지름)×", { n: 4 }] },
        { q: "“원주는 3배와 4배의 한가운데쯤이니까 지름의 약 3.5배야.”라는 말은 옳을까요?", parts: [{ o: ["옳지 않아요. 원주는 정사각형의 둘레보다 정육각형의 둘레에 더 가까워요", "옳아요. 원주는 정확히 한가운데에 있어요"], a: 0, why: { "1": "수직선에서 원주(파란 선)는 7 cm보다 짧았어요. 6 cm에 더 가까웠지요." } }] }],
        { ok: "원주는 지름의 3배보다 길고 4배보다 짧아요. 3배에 더 가까워서 3.5배보다는 짧아요." }) },
    { name: "확인하기", inst: "반지름이 10 cm인 원의 원주를 어림해 보세요. 원 안에 꼭 맞는 정육각형과 원 밖에 꼭 맞는 정사각형의 둘레를 이용해요.", hints: ["정육각형의 한 변의 길이는 반지름과 같은 10 cm예요.", "정사각형의 한 변의 길이는 지름과 같은 20 cm예요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: () => ci6HexSqFig("10 cm"), parts: ["정육각형의 둘레: 10×6 = ", { n: 60, why: { "40": "정육각형은 변이 6개예요." } }, " (cm)"] },
        { parts: ["정사각형의 둘레: 20×4 = ", { n: 80, why: { "40": "정사각형의 한 변은 반지름이 아니라 지름(20 cm)과 같아요." } }, " (cm)"] },
        { parts: [{ n: 60 }, " cm < (반지름이 10 cm인 원의 원주) < ", { n: 80 }, " cm"] }],
        { ok: "60 cm < (원주) < 80 cm예요. 원주는 지름 20 cm의 3배보다 길고 4배보다 짧아요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 원주를 어림하고, 원주와 더 비슷한 길이를 나타낸 사람을 찾아보세요.", hints: ["반지름이 7 cm이면 정육각형의 둘레는 7×6, 정사각형의 둘레는 14×4예요.", "지름이 4 cm인 원의 원주는 4×3=12(cm)보다 길고 4×4=16(cm)보다 짧아요.", "11 cm는 12 cm보다 짧아서 원주가 될 수 없어요."],
    render: (b, a) => ci6Ask(b, a, [
      { q: "반지름이 7 cm인 원", fig: () => ci6HexSqFig("7 cm", "11em"), parts: [{ n: 42 }, " cm < (원주) < ", { n: 56, why: { "28": "정사각형의 한 변은 지름 14 cm와 같아요." } }, " cm"] },
      { q: "지름이 4 cm인 원의 원주를 민하는 11 cm, 은호는 13 cm로 수직선에 나타냈어요.", parts: ["원주와 더 비슷한 길이를 나타낸 사람은 ", { o: ["민하", "은호"], a: 1, why: { "0": "원주는 지름의 3배인 12 cm보다 길어야 해요. 11 cm는 될 수 없어요." } }, "예요. 원주는 ", { n: 12 }, " cm보다 길고 ", { n: 16 }, " cm보다 짧기 때문이에요."] }],
    { ok: "42 cm < (원주) < 56 cm예요. 지름이 4 cm인 원의 원주는 12 cm보다 길고 16 cm보다 짧아서 은호가 나타낸 13 cm가 더 비슷해요." }) }
},
{
  id: "t3", no: 3, title: "원주율을 알아볼까요", soop: "개념 구축하기(O)",
  question: "원의 지름에 대한 원주의 비율은 얼마일까요?",
  summary: "원의 지름에 대한 원주의 비율을 원주율이라고 해요. (원주율)=(원주)÷(지름)이에요. 원주율은 원의 크기와 상관없이 일정해요. 원주율을 소수로 나타내면 3.1415926535897932…와 같이 끝없이 계속되므로 반올림하여 소수 둘째 자리까지 나타낸 값인 3.14로 사용해요.",
  steps: [
    { name: "만져 보기", inst: "채안이와 현준이는 나무로 만든 집의 탁자 위에 있는 여러 가지 원 모양 물건의 원주와 지름을 재어 보았어요. 물건 양쪽에 삼각자를 대어 지름을 재고, 둘레에 실을 감았다 펴서 원주를 재어 보세요.", hints: ["오른쪽 삼각자를 끌어 물건에 꼭 닿게 대요. 두 삼각자 사이의 거리가 지름이에요.", "둘레를 따라 손가락으로 한 바퀴 그리면 실이 감겨요.", "감은 실을 펴면 줄자로 길이를 잴 수 있어요."],
      render: (b, a) => ci6Lab(b, a, { items: [{ name: "양초", kind: "candle", C: 22, d: 7 }, { name: "시계", kind: "clock", C: 55, d: 17.5 }, { name: "쟁반", kind: "tray", C: 77, d: 24.5 }],
        ask: [{ parts: ["원주가 가장 긴 물건은 ", { o: ["양초", "시계", "쟁반"], a: 2 }, "이고, 지름도 ", { o: ["가장 길어요", "가장 짧아요"], a: 0 }, "."] }],
        ok: "양초는 원주 22 cm·지름 7 cm, 시계는 원주 55 cm·지름 17.5 cm, 쟁반은 원주 77 cm·지름 24.5 cm예요. 지름이 길수록 원주도 길어요." }) },
    { name: "그려 보기", inst: "(원주)÷(지름)을 계산기로 구하고, 반올림하여 소수 둘째 자리까지 나타내어 보세요.", hints: ["22÷7=3.142…예요.", "소수 셋째 자리 숫자가 2이므로 버려요.", "55÷17.5, 77÷24.5도 계산기로 구해요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: () => h("div", { class: "ci6tbl" }, h("table", {}, h("tr", {}, h("th", {}, "물건"), h("th", {}, "원주(cm)"), h("th", {}, "지름(cm)")), ...[["양초", 22, 7], ["시계", 55, 17.5], ["쟁반", 77, 24.5]].map(([n, c, d]) => h("tr", {}, h("td", {}, n), h("td", {}, String(c)), h("td", {}, String(d)))))),
          parts: ["양초: 22÷7 = 3.142… → ", { n: 3.14, why: { "3.142": "반올림하여 소수 둘째 자리까지 나타내요.", "3.15": "소수 셋째 자리 숫자가 2이므로 버려요." } }] },
        { parts: ["시계: 55÷17.5 → ", { n: 3.14 }, ",  쟁반: 77÷24.5 → ", { n: 3.14 }] },
        { parts: ["세 물건의 (원주)÷(지름)은 ", { o: ["모두 같아요", "모두 달라요"], a: 0 }, ". 원의 크기와 상관없이 지름에 대한 원주의 비율은 ", { o: ["일정해요", "커져요"], a: 0, why: { "1": "지름이 길어지면 원주도 같은 비율로 길어져요. 비율은 그대로예요." } }, "."] }],
      { ok: "세 물건 모두 (원주)÷(지름)이 약 3.14예요. 원의 크기와 상관없이 지름에 대한 원주의 비율은 일정해요.", calc: true }) },
    { name: "약속하기", inst: "약속을 완성해 보세요.", hints: ["지름이 기준량, 원주가 비교하는 양이에요.", "비율은 (비교하는 양)÷(기준량)이에요.", "3.1415…를 반올림하여 소수 둘째 자리까지 나타내요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["원의 지름에 대한 원주의 비율을 ", { o: ["원주율", "원주", "지름"], a: 0 }, "이라고 합니다."] },
        { parts: ["(원주율) = ", { o: ["(원주)", "(지름)"], a: 0 }, " ÷ ", { o: ["(원주)", "(지름)"], a: 1, why: { "0": "지름에 대한 원주의 비율이에요. 기준량인 지름으로 나누어요." } }] },
        { fig: () => h("div", { class: "ci6box", style: "font-family:monospace;word-break:break-all;color:var(--muted)" }, "3.14159265358979323846264338327950288419716939937510582097494459…"),
          parts: ["원주율을 소수로 나타내면 3.1415926535897932…와 같이 끝없이 계속되므로 반올림하여 소수 둘째 자리까지 나타낸 값인 ", { n: 3.14, why: { "3.1": "소수 둘째 자리까지 나타내요.", "3.15": "소수 셋째 자리 숫자가 1이므로 버려요." } }, "로 사용합니다."] }],
      { ok: "원의 지름에 대한 원주의 비율을 원주율이라고 하고, (원주율)=(원주)÷(지름)이에요. 원주율은 3.14로 사용해요." }) },
    { name: "말해 보기", inst: "“세종특별자치시에 있는 금강보행교는 둘레가 1446 m이고 지름이 460 m인 원 모양의 다리입니다.” 원주율을 구하고, 우리 주변 원 모양 물건의 원주율도 구해 보세요. (계산기를 써요.)", hints: ["1446÷460=3.143…이에요.", "단추는 9.42÷3, 접시는 47.1÷15, 프라이팬은 62.8÷20이에요.", "아주 큰 원도, 작은 원도 원주율은 같아요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["금강보행교: 1446÷460 = 3.143… → 반올림하여 소수 둘째 자리까지 나타내면 ", { n: 3.14 }] },
        { fig: () => h("div", { class: "ci6tbl" }, h("table", {}, h("tr", {}, h("th", {}, "물건"), h("th", {}, "원주(cm)"), h("th", {}, "지름(cm)")), ...[["단추", 9.42, 3], ["접시", 47.1, 15], ["프라이팬", 62.8, 20]].map(([n, c, d]) => h("tr", {}, h("td", {}, n), h("td", {}, String(c)), h("td", {}, String(d)))))),
          parts: ["단추 ", { n: 3.14 }, ", 접시 ", { n: 3.14 }, ", 프라이팬 ", { n: 3.14 }] },
        { q: "직접 재어 보니 원주율이 3.2처럼 조금 다르게 나왔어요. 그 까닭으로 알맞은 것은?", parts: [{ o: ["원주를 잴 때 실이 늘어나거나 틈이 생기는 것처럼 재는 데 오차가 있었기 때문이에요", "그 물건만 원주율이 다르기 때문이에요"], a: 0, why: { "1": "원주율은 모든 원에서 일정해요. 재는 과정에서 오차가 생긴 거예요." } }] }],
      { ok: "금강보행교도, 단추·접시·프라이팬도 원주율이 3.14예요. 다르게 나오면 재는 과정에서 생긴 오차예요. 실을 틈 없이 감고 여러 번 재면 오차를 줄일 수 있어요.", calc: true }) },
    { name: "확인하기", inst: "수학익힘 문제예요. 원주율을 구하고, 옳은 설명을 찾아보세요.", hints: ["(원주율)=(원주)÷(지름)이에요.", "87.92÷28과 78.5÷25를 비교해요.", "원주율은 원의 크기와 상관없이 일정해요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["지름이 16 cm, 원주가 50.24 cm인 원: (원주율) = ", { n: 50.24 }, " ÷ ", { n: 16 }, " = ", { n: 3.14 }] },
        { parts: ["(원주 87.92 cm, 지름 28 cm인 원의 원주율) ", { o: [">", "=", "<"], a: 1 }, " (원주 78.5 cm, 지름 25 cm인 원의 원주율)"] },
        { q: "원주율을 옳게 설명한 것을 모두 골라 보세요.", parts: [{ o: ["㉠ 원주율은 (원주)÷(지름)으로 구할 수 있습니다.", "㉡ 원의 크기에 따라 원주율은 달라집니다.", "㉢ 원주는 지름의 약 3.14배입니다."], multi: true, a: [0, 2] }] },
        { q: "나현: “원주율을 소수로 나타내면 끝없이 계속되기 때문이야.” 규민: “원의 지름에 대한 원주의 비율이 일정하지 않기 때문이야.” 원주율을 3.14처럼 어림하여 사용하는 까닭을 옳게 말한 사람은?", parts: [{ o: ["나현", "규민"], a: 0, why: { "1": "원의 지름에 대한 원주의 비율은 일정해요." } }] }],
      { ok: "원주율은 3.14이고, 두 원의 원주율은 같아요. 옳은 설명은 ㉠, ㉢이고, 원주율이 끝없이 계속되는 소수라서 어림하여 사용해요.", calc: true }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 원주율을 반올림하여 소수 둘째 자리까지 나타내어 보세요. 계산기를 써요.", hints: ["47.12÷15=3.1413…이에요.", "56.55÷18=3.1416…, 81.68÷26=3.1415…예요.", "기계 공학처럼 정밀한 분야에서는 원주율을 3.1416으로 어림하기도 해요."],
    render: (b, a) => ci6Ask(b, a, [
      { fig: () => h("div", { class: "ci6tbl" }, h("table", {}, h("tr", {}, h("th", {}, "원주(cm)"), h("td", {}, "47.12"), h("td", {}, "56.55"), h("td", {}, "81.68")), h("tr", {}, h("th", {}, "지름(cm)"), h("td", {}, "15"), h("td", {}, "18"), h("td", {}, "26")))),
        parts: ["원주율: ", { n: 3.14 }, ", ", { n: 3.14 }, ", ", { n: 3.14 }] },
      { parts: ["3.14159…를 반올림하여 소수 넷째 자리까지 나타내면 ", { n: 3.1416, why: { "3.1415": "소수 다섯째 자리 숫자가 9이므로 올려요." } }, "예요."] }],
    { ok: "세 원의 원주율은 모두 3.14예요. 소수 넷째 자리까지 나타내면 3.1416이에요.", calc: true }) }
},
{
  id: "t4", no: 4, title: "원주와 지름을 구해 볼까요", soop: "개념 구축하기(O)",
  question: "원주율을 이용하여 원주와 지름을 어떻게 구할까요?",
  summary: "(원주율)=(원주)÷(지름)이므로 (원주)=(지름)×(원주율), (지름)=(원주)÷(원주율)이에요. 지름이 6 m인 물레방아 바퀴의 원주는 6×3.14=18.84 (m)이고, 단면의 원주가 100.48 cm인 기둥의 지름은 100.48÷3.14=32 (cm)예요.",
  steps: [
    { name: "만져 보기", inst: "채안이와 현준이는 물레방아에서 원 모양 바퀴를 보았어요. “물레방아 바퀴의 원주를 구하기 위해 무엇을 알아야 할까?” “지름에 대한 원주의 비율을 이용할 수 있을까?” 지름이 6 m인 물레방아 바퀴를 한 바퀴 굴려 보세요.", hints: ["바퀴를 끌어 오른쪽으로 굴려요.", "빨간 점이 다시 땅에 닿으면 한 바퀴예요.", "한 바퀴 굴러간 거리가 원주예요."],
      render: (b, a) => ci6Roll(b, a, { d: 6, ask: [
        { parts: ["지름에 대한 원주의 비율은 ", { o: ["원주율", "반지름"], a: 0 }, "이고, ", { n: 3.14 }, "로 사용해요."] },
        { parts: ["(원주율) = (원주)÷(지름)이므로 (원주) = (", { o: ["지름", "원주율", "반지름"], a: 0 }, ")×(", { o: ["지름", "원주율", "반지름"], a: 1 }, ")"] },
        { parts: ["물레방아 바퀴의 원주: 6×3.14 = ", { n: 18.84, why: { "9.42": "지름이 6 m예요. 반지름이 아니라 지름에 원주율을 곱해요.", "1884": "소수점의 위치를 확인해요." } }, " (m)"] }],
        ok: "(원주)=(지름)×(원주율)이에요. 물레방아 바퀴의 원주는 6×3.14=18.84 (m)예요.", calc: true }) },
    { name: "그려 보기", inst: "물레방아 옆에 단면이 원 모양인 기둥이 있어요. 기둥의 단면의 원주는 100.48 cm예요. 막대를 움직여 지름을 바꾸어 보며 단면의 원주와 같아지는 지름을 찾아보세요.", hints: ["지름이 길어지면 원주도 길어져요.", "원주가 100.48 cm보다 짧으면 지름을 늘여요.", "(지름)=(원주)÷(원주율)로 확인해요."],
      render: (b, a) => ci6Diam(b, a, { min: 20, max: 40, start: 25, C: 100.48, ask: [
        { parts: ["지름을 구하려면 기둥의 단면의 ", { o: ["원주", "넓이"], a: 0 }, "와 원주율을 알아야 해요."] },
        { parts: ["(지름) = (", { o: ["원주", "원주율"], a: 0 }, ")÷(", { o: ["원주", "원주율"], a: 1 }, ") = 100.48÷3.14 = ", { n: 32, why: { "315.5072": "곱하지 않고 나누어요. (지름)=(원주)÷(원주율)이에요.", "16": "16은 반지름이에요. (원주)÷(원주율)은 지름이에요." } }, " (cm)"] }],
        ok: "(지름)=(원주)÷(원주율)이에요. 기둥의 지름은 100.48÷3.14=32 (cm)예요.", calc: true }) },
    { name: "말해 보기", inst: "악기에서 볼 수 있는 원의 원주와 지름을 구해 보세요. (계산기를 써도 돼요.)", hints: ["징의 원주는 36×3.14예요.", "탬버린의 지름은 84.78÷3.14예요.", "소고의 원주는 21×3.14예요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: ci6InstrFig, parts: ["징: 지름 36 cm → 원주 ", { n: 113.04 }, " cm"] },
        { parts: ["탬버린: 원주 84.78 cm → 지름 ", { n: 27, why: { "266.2092": "원주를 알 때 지름은 (원주)÷(원주율)로 구해요." } }, " cm"] },
        { parts: ["소고: 지름 21 cm → 원주 ", { n: 65.94 }, " cm"] }],
      { ok: "징의 원주는 113.04 cm, 탬버린의 지름은 27 cm, 소고의 원주는 65.94 cm예요. 원주를 직접 재지 않아도 지름만 알면 원주를 구할 수 있어 편리해요.", calc: true }) },
    { name: "약속하기", inst: "원주와 지름을 구하는 방법을 정리해 보세요.", hints: ["(원주율)=(원주)÷(지름)에서 출발해요.", "곱셈과 나눗셈의 관계를 생각해요."],
      render: (b, a) => blanks(b, a, ["(원주) = (지름)×(", { o: ["원주율", "지름", "원주"], a: 0 }, "),  (지름) = (원주)", { o: ["÷", "×"], a: 0 }, "(원주율)"], { ok: "(원주)=(지름)×(원주율), (지름)=(원주)÷(원주율)이에요." }) },
    { name: "확인하기", inst: "수학익힘 문제예요. 원주와 지름을 구해 보세요.", hints: ["(원주)=(지름)×3.14예요.", "(지름)=(원주)÷3.14예요.", "컴퍼스를 4 cm만큼 벌려 그린 원은 반지름이 4 cm예요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["지름이 12 cm인 원의 원주: ", { n: 12 }, "×3.14 = ", { n: 37.68 }, " (cm)"] },
        { parts: ["원주가 28.26 cm인 원의 지름: ", { n: 28.26 }, "÷3.14 = ", { n: 9 }, " (cm)"] },
        { q: "컴퍼스를 4 cm만큼 벌려 그린 원의 원주는 몇 cm인가요?", parts: ["원주: ", { n: 25.12, why: { "12.56": "컴퍼스를 벌린 만큼이 반지름이에요. 지름은 8 cm예요." } }, " cm"] },
        { parts: ["원주가 109.9 cm인 원 모양 시계의 지름: ", { n: 35 }, " cm"] }],
      { ok: "37.68 cm, 9 cm, 25.12 cm, 35 cm예요.", calc: true }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 원의 크기를 비교하고, 원주를 활용하여 문제를 해결해 보세요.", hints: ["원주가 40.82 cm인 원의 지름은 40.82÷3.14예요.", "반지름이 75 m이면 지름은 150 m예요.", "한 바퀴의 거리에 4를 곱해요."],
    render: (b, a) => ci6Ask(b, a, [
      { q: "㉠ 지름이 12 cm인 원  ㉡ 원주가 40.82 cm인 원", parts: ["㉡의 지름은 ", { n: 13 }, " cm이므로 더 큰 원은 ", { o: ["㉠", "㉡"], a: 1, why: { "0": "㉠의 원주는 37.68 cm이고, ㉡의 원주는 40.82 cm예요." } }, "이에요."] },
      { q: "반지름이 75 m인 원 모양 운동장을 4바퀴 달렸어요.", parts: ["달린 거리는 ", { n: 1884, why: { "942": "반지름이 75 m이니 지름은 150 m예요.", "471": "한 바퀴가 아니라 4바퀴예요." } }, " m예요."] },
      { q: "육상 트랙에서 출발선과 도착선이 같은 곳에서 한 바퀴를 달리면 안쪽 트랙과 바깥쪽 트랙 중 어느 쪽이 더 짧은 거리를 달릴까요?", parts: [{ o: ["안쪽 트랙", "바깥쪽 트랙", "똑같아요"], a: 0, why: { "1": "바깥쪽 트랙은 원의 지름이 더 길어서 원주도 더 길어요." } }] }],
    { ok: "㉡이 지름 13 cm로 더 커요. 운동장을 4바퀴 달린 거리는 150×3.14×4=1884 (m)예요. 안쪽 트랙은 지름이 짧아 원주도 짧아요.", calc: true }) }
},
{
  id: "t5", no: 5, title: "원의 넓이를 어림해 볼까요", soop: "개념 구축하기(O)",
  question: "원의 넓이를 어떻게 어림할 수 있을까요?",
  summary: "원의 넓이는 원 안에 꼭 맞는 정사각형의 넓이보다 넓고, 원 밖에 꼭 맞는 정사각형의 넓이보다 좁아요. 반지름이 5 m인 원의 넓이는 50 m²보다 넓고 100 m²보다 좁아요. 모눈을 이용하면 원 안에 완전히 들어간 칸(60칸)보다 넓고 원이 걸친 칸까지 센 칸(88칸)보다 좁다고 어림할 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "수학 체험 마을에는 반지름이 5 m인 원 모양 텃밭이 있어요. 텃밭에 당근 모종이 빼곡해요. “텃밭의 넓이를 어떻게 어림할 수 있을까?” 원 위의 점 4개를 눌러 원 안에 꼭 맞는 정사각형을 그려 보세요.", hints: ["서로 마주 보는 두 점을 이은 선분이 원의 지름이 되게 골라요.", "위·오른쪽·아래·왼쪽 점을 골라도 돼요.", "원 안의 정사각형은 삼각형 4개로 나눌 수 있어요."],
      render: (b, a) => ci6InOut(b, a, { r: 5, ask: [
        { parts: ["원의 넓이는 초록색 정사각형의 넓이보다 ", { o: ["넓고", "좁고"], a: 0 }, ", 빨간색 정사각형의 넓이보다 ", { o: ["넓어요", "좁아요"], a: 1 }, "."] },
        { parts: ["초록색 정사각형의 넓이: (5×5÷2)×4 = ", { n: 50, why: { "25": "삼각형 하나의 넓이가 12.5 m²이고, 삼각형이 4개예요.", "100": "삼각형의 넓이는 (밑변의 길이)×(높이)÷2예요." } }, " (m²)"] },
        { parts: ["빨간색 정사각형의 넓이: 10×10 = ", { n: 100 }, " (m²)"] },
        { parts: [{ n: 50 }, " m² < (반지름이 5 m인 원 모양 텃밭의 넓이) < ", { n: 100 }, " m²"] }],
        ok: "원 안 정사각형은 삼각형 4개로 (5×5÷2)×4=50 (m²), 원 밖 정사각형은 10×10=100 (m²)예요. 텃밭의 넓이는 50 m²보다 넓고 100 m²보다 좁아요." }) },
    { name: "그려 보기", inst: "반지름이 5 m인 원을 1칸이 1 m×1 m인 모눈 위에 그렸어요. “전체를 4등분한 모양에서 모눈을 세어 본 후 4배 해도 돼.” 4등분한 한 조각에서 원 안에 완전히 들어간 칸은 초록, 원이 걸친 칸은 주황으로 칠해 보세요.", hints: ["칸 전체가 원 안에 있으면 초록이에요.", "원의 둘레가 칸을 지나가면 주황이에요.", "꼭짓점 하나만 원 위에 닿은 칸은 원 안에 들어간 칸이에요."],
      render: (b, a) => { const q = ci6GridCount(5); return ci6Grid(b, a, { r: 5, unit: "m", ask: [
        { parts: ["한 조각에서 초록 칸은 ", { n: q.g }, "칸이므로 초록색 선 안쪽(원 안에 완전히 들어간 칸)은 모두 ", { n: q.g * 4, why: { [q.g]: "4등분한 한 조각에서 센 칸 수예요. 4배 해요." } }, "칸 → ", { n: q.g * 4 }, " m²"] },
        { parts: ["초록과 주황 칸을 합하면 ", { n: q.all }, "칸이므로 빨간색 선 안쪽(원이 걸친 칸까지)은 모두 ", { n: q.all * 4, why: { [q.all]: "4배 해요." } }, "칸 → ", { n: q.all * 4 }, " m²"] },
        { parts: [{ n: q.g * 4 }, " m² < (원의 넓이) < ", { n: q.all * 4 }, " m²"] }],
        ok: `원의 넓이는 ${q.g * 4} m²보다 넓고 ${q.all * 4} m²보다 좁아요. 걸친 칸을 어떻게 세느냐에 따라 어림한 값은 조금씩 달라질 수 있어요.` }); } },
    { name: "말해 보기", inst: "원 모양 과자의 넓이를 정사각형이나 모눈을 이용하여 어림해 보세요.", hints: ["반지름이 3 cm이면 원 안 정사각형은 (3×3÷2)×4, 원 밖 정사각형은 6×6이에요.", "모눈은 4등분한 한 조각에서 세고 4배 해요."],
      render: (b, a) => ci6Chain(b, a, [
        { title: "왼쪽 과자(반지름 3 cm) ― 정사각형으로 어림하기", run: (bx, ax) => ci6Ask(bx, ax, [
          { fig: () => ci6SqFig("3 cm"), parts: ["초록색: (3×3÷2)×4 = ", { n: 18 }, " (cm²), 빨간색: 6×6 = ", { n: 36 }, " (cm²)"] },
          { parts: [{ n: 18 }, " cm² < (과자의 넓이) < ", { n: 36 }, " cm²"] }], { ok: "18 cm² < (과자의 넓이) < 36 cm²예요." }) },
        { title: "오른쪽 과자(반지름 4 cm) ― 1 cm 모눈으로 어림하기", run: (bx, ax) => { const q = ci6GridCount(4); return ci6Grid(bx, ax, { r: 4, unit: "cm", ask: [
          { parts: ["초록색 선 안쪽 ", { n: q.g * 4 }, "칸 = ", { n: q.g * 4 }, " cm², 빨간색 선 안쪽 ", { n: q.all * 4 }, "칸 = ", { n: q.all * 4 }, " cm²"] },
          { parts: [{ n: q.g * 4 }, " cm² < (과자의 넓이) < ", { n: q.all * 4 }, " cm²"] }], ok: `왼쪽 과자는 18 cm²보다 넓고 36 cm²보다 좁고, 오른쪽 과자는 ${q.g * 4} cm²보다 넓고 ${q.all * 4} cm²보다 좁아요.` }); } }]) },
    { name: "정리하기", inst: "원의 넓이를 어림하는 방법을 정리해 보세요.", hints: ["원은 원 밖 정사각형 안에 들어가요.", "원 안 정사각형은 원 안에 들어가요.", "어림한 값은 어떻게 세느냐에 따라 조금씩 다를 수 있어요."],
      render: (b, a) => blanks(b, a, ["원의 넓이는 원 안에 꼭 맞는 정사각형의 넓이보다 ", { o: ["넓고", "좁고"], a: 0 }, ", 원 밖에 꼭 맞는 정사각형의 넓이보다 ", { o: ["넓어요", "좁아요"], a: 1 }, ". 모눈으로 어림할 때 원이 걸친 칸을 세느냐 세지 않느냐에 따라 어림한 값이 ", { o: ["달라질 수 있어요", "언제나 같아요"], a: 0 }, "."], { ok: "원의 넓이는 원 안 정사각형보다 넓고 원 밖 정사각형보다 좁아요. 어림하는 방법에 따라 값이 조금씩 달라도 괜찮아요." }) },
    { name: "확인하기", inst: "수학익힘 문제예요. 반지름이 6 cm인 원의 넓이를 원 안과 원 밖의 정사각형을 이용하여 어림해 보세요.", hints: ["원 안 정사각형은 밑변과 높이가 6 cm인 삼각형 4개예요.", "원 밖 정사각형의 한 변은 지름 12 cm예요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: () => ci6SqFig("6 cm"), parts: ["원 안의 정사각형: ", { n: 72, why: { "36": "삼각형 하나는 6×6÷2=18 (cm²)이고, 4개예요.", "144": "원 안 정사각형은 원 밖 정사각형의 절반이에요." } }, " cm², 원 밖의 정사각형: ", { n: 144 }, " cm²"] },
        { parts: ["원의 넓이는 ", { n: 72 }, " cm²보다 넓고 ", { n: 144 }, " cm²보다 좁습니다."] }],
      { ok: "(6×6÷2)×4=72 (cm²), 12×12=144 (cm²)이므로 원의 넓이는 72 cm²보다 넓고 144 cm²보다 좁아요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 모눈과 정육각형을 이용하여 원의 넓이를 어림해 보세요.", hints: ["반지름이 7 cm인 원을 4등분한 한 조각에서 칸을 세고 4배 해요.", "원 안 정육각형은 삼각형 ㄱㅇㄴ이 6개예요.", "원 밖 정육각형은 삼각형 ㄷㅇㄹ이 6개예요."],
    render: (b, a) => ci6Chain(b, a, [
      { title: "① 1 cm 모눈으로 반지름 7 cm인 원의 넓이 어림하기", run: (bx, ax) => { const q = ci6GridCount(7); return ci6Grid(bx, ax, { r: 7, unit: "cm", ask: [{ parts: ["원의 넓이는 ", { n: q.g * 4 }, " cm²보다 넓고 ", { n: q.all * 4 }, " cm²보다 좁습니다."] }], ok: `원의 넓이는 ${q.g * 4} cm²보다 넓고 ${q.all * 4} cm²보다 좁아요.` }); } },
      { title: "② 정육각형으로 어림하기", run: (bx, ax) => ci6Ask(bx, ax, [
        { fig: ci6HexHexFig, parts: ["삼각형 ㄱㅇㄴ의 넓이가 21 cm²일 때 원 안의 정육각형의 넓이: ", { n: 126, why: { "84": "정육각형은 삼각형 6개로 나누어져요." } }, " cm²"] },
        { parts: ["삼각형 ㄷㅇㄹ의 넓이가 28 cm²일 때 원 밖의 정육각형의 넓이: ", { n: 168 }, " cm²"] },
        { parts: [{ n: 126 }, " cm² < (원의 넓이) < ", { n: 168 }, " cm²"] }], { ok: "21×6=126 (cm²), 28×6=168 (cm²)이므로 원의 넓이는 126 cm²보다 넓고 168 cm²보다 좁아요." }) }]) }
},
{
  id: "t6", no: 6, title: "원의 넓이를 구하는 방법을 알아볼까요", soop: "개념 구축하기(O)",
  question: "직사각형의 넓이를 이용하여 원의 넓이를 어떻게 구할까요?",
  summary: "원을 한없이 잘라 이어 붙이면 직사각형이 돼요. 직사각형의 가로는 (원주)×½, 세로는 원의 반지름이에요. (원의 넓이)=(반지름)×(원주)×½=(반지름)×(지름)×(원주율)×½=(반지름)×(반지름)×(원주율)이에요.",
  steps: [
    { name: "만져 보기", inst: "원의 넓이를 어떻게 구하면 좋을지 생각해 보아요. 원을 8등분, 16등분, 32등분, 64등분으로 잘라 위아래로 번갈아 이어 붙여 보세요. 이어 붙이기 전에 어떤 도형이 될지 먼저 예상해 봐요. (세 가지 이상 해 봐요.)", hints: ["주황 조각은 아래쪽 반원, 파란 조각은 위쪽 반원에서 왔어요.", "조각이 많을수록 모양이 어떻게 바뀌는지 살펴봐요.", "64등분하면 직사각형에 아주 가까워요."],
      render: (b, a) => ci6Cut(b, a, { start: 8, need: 3, ask: [
        { parts: ["원을 8등분하여 이어 붙이면 ", { o: ["평행사변형", "삼각형", "원"], a: 0 }, "과 비슷한 모양이 돼요."] },
        { parts: ["자르는 횟수가 많아질수록 ", { o: ["직사각형", "삼각형", "원"], a: 0 }, "에 가까워져요. 그래서 원의 넓이를 구할 때 ", { o: ["직사각형의 넓이", "삼각형의 넓이"], a: 0 }, "를 이용할 수 있어요."] }],
        ok: "원을 한없이 잘라 이어 붙이면 직사각형이 돼요. 그래서 직사각형의 넓이를 이용해 원의 넓이를 구할 수 있어요." }) },
    { name: "그려 보기", inst: "원을 잘게 잘라 이어 붙인 모양에서 원주의 ½(빨간 선)과 반지름(초록 선)이 어디로 가는지 살펴보세요.", hints: ["빨간 선은 원주의 절반이에요. 이어 붙이면 아래쪽 변이 돼요.", "조각의 옆변은 원의 반지름이에요. 이어 붙이면 높이가 돼요."],
      render: (b, a) => ci6Cut(b, a, { start: 32, need: 1, labels: true, ask: [
        { parts: ["직사각형의 가로는 원의 ", { o: ["(원주)×½", "지름", "반지름"], a: 0 }, "과 같고, 세로는 원의 ", { o: ["반지름", "지름", "원주"], a: 0, why: { "1": "조각의 옆변은 원의 중심에서 원 위까지, 반지름이에요." } }, "과 같아요."] }],
        ok: "직사각형의 가로는 (원주)×½, 세로는 반지름이에요." }) },
    { name: "약속하기", inst: "직사각형의 넓이를 이용하여 원의 넓이를 구하는 식을 완성해 보세요.", hints: ["(원주)=(지름)×(원주율)이에요.", "(지름)×½=(반지름)이에요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["(원의 넓이) = (직사각형의 넓이) = (세로)×(가로) = (반지름)×(", { o: ["원주", "지름", "반지름"], a: 0 }, ")×½"] },
        { parts: ["= (반지름)×(지름)×(", { o: ["원주율", "반지름"], a: 0 }, ")×½"] },
        { parts: ["= (반지름)×(", { o: ["반지름", "지름", "원주"], a: 0, why: { "1": "(지름)×½은 반지름이에요." } }, ")×(", { o: ["원주율", "지름"], a: 0 }, ")"] }],
      { ok: "(원의 넓이)=(반지름)×(반지름)×(원주율)이에요. 공식을 외우기보다 왜 그런지 설명할 수 있어야 해요." }) },
    { name: "말해 보기", inst: "원 모양 물건의 넓이를 구해 보세요. 맨홀 뚜껑은 반지름이 30 cm(원주 188.4 cm)이고, 거울은 지름이 50 cm예요. (계산기를 써도 돼요.)", hints: ["맨홀 뚜껑: 30×30×3.14예요.", "거울은 지름이 50 cm이니 반지름은 25 cm예요.", "지름을 그대로 곱하지 않아요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["맨홀 뚜껑의 넓이: 30×30×3.14 = ", { n: 2826, why: { "94.2": "반지름을 두 번 곱해요.", "11304": "반지름은 30 cm예요. 지름을 곱하지 않아요." } }, " (cm²)"] },
        { parts: ["거울의 반지름은 ", { n: 25 }, " cm이므로 거울의 넓이는 ", { n: 1962.5, why: { "7850": "지름 50 cm를 두 번 곱했어요. 반지름 25 cm로 구해요." } }, " cm²예요."] },
        { q: "맨홀 뚜껑의 넓이를 (반지름)×(원주)×½로도 구할 수 있을까요?", parts: ["30×188.4×½ = ", { n: 2826 }, " (cm²)이므로 ", { o: ["구할 수 있어요", "구할 수 없어요"], a: 0 }] }],
      { ok: "맨홀 뚜껑의 넓이는 2826 cm², 거울의 넓이는 1962.5 cm²예요.", calc: true }) },
    { name: "확인하기", inst: "원 모양 물건을 골라 넓이를 구하는 문제를 만들고 풀어 보세요. 내가 찾은 물건의 지름을 직접 써도 돼요.", hints: ["지름을 2로 나누어 반지름을 구해요.", "(반지름)×(반지름)×3.14를 계산해요.", "계산기를 써도 돼요."],
      render: (b, a) => ci6Make(b, a, { items: [{ name: "벽시계", d: 30 }, { name: "단추", d: 2 }] }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 원의 넓이를 구하고 비교해 보세요.", hints: ["반지름이 5 cm인 원의 원주는 31.4 cm예요.", "넓이가 113.04 cm²인 원은 반지름이 6 cm예요.", "직사각형 종이에 그릴 수 있는 가장 큰 원의 지름은 짧은 변의 길이와 같아요."],
    render: (b, a) => ci6Ask(b, a, [
      { q: "반지름이 5 cm인 원을 한없이 잘라 이어 붙여 직사각형을 만들었어요.", parts: ["가로 ", { n: 15.7, why: { "31.4": "가로는 원주의 ½이에요." } }, " cm, 세로 ", { n: 5 }, " cm → 원의 넓이 ", { n: 78.5 }, " cm²"] },
      { parts: ["지름이 22 cm인 원의 넓이: ", { n: 379.94, why: { "1519.76": "반지름 11 cm로 구해요." } }, " cm²"] },
      { q: "넓이가 좁은 컵 받침부터 차례로: ㉠ 지름이 8 cm인 컵 받침  ㉡ 넓이가 113.04 cm²인 컵 받침  ㉢ 반지름이 3 cm인 컵 받침", parts: [{ o: ["㉠", "㉡", "㉢"], a: 2 }, " → ", { o: ["㉠", "㉡", "㉢"], a: 0 }, " → ", { o: ["㉠", "㉡", "㉢"], a: 1 }] },
      { q: "가로 36 cm, 세로 30 cm인 직사각형 모양 종이에 그릴 수 있는 가장 큰 원의 넓이는?", parts: [{ n: 706.5, why: { "1017.36": "원의 지름은 짧은 변 30 cm보다 길 수 없어요." } }, " cm²"] }],
    { ok: "78.5 cm², 379.94 cm², ㉢(28.26 cm²)→㉠(50.24 cm²)→㉡(113.04 cm²), 706.5 cm²예요.", calc: true }) }
},
{
  id: "t7", no: 7, title: "원의 넓이를 활용해 볼까요", soop: "개념 구축하기(O)",
  question: "원의 넓이를 구하는 방법을 활용하여 여러 가지 도형의 넓이를 어떻게 구할까요?",
  summary: "빨간색 꽃밭처럼 중심이 같은 두 원 사이의 넓이는 큰 원의 넓이에서 작은 원의 넓이를 빼요(50.24−3.14=47.1 m²). 도형의 일부분을 옮겨 반원으로 바꾸거나(78.5÷2=39.25 cm²), 색칠한 부분을 나누거나 합쳐 원을 만들어 넓이를 구해요.",
  steps: [
    { name: "만져 보기", inst: "채안이와 현준이는 수학 체험 마을에 있는 정원에 도착하여 안내도를 보았어요. “빨간색 꽃밭 안에 작은 원 모양의 분수가 있어.” “빨간색 꽃밭의 넓이는 몇 m²일까?” 분수(작은 원)를 끌어 꽃밭 밖의 점선 자리로 옮겨 보세요.", hints: ["가운데 파란 원을 끌어 오른쪽 점선 원에 놓아요.", "큰 원에서 작은 원을 빼면 빨간색 꽃밭이 남아요.", "큰 원의 반지름은 4 m, 작은 원의 반지름은 1 m예요."],
      render: (b, a) => ci6Move(b, a, { W: 460, H: 250, maxW: "25em", say: "분수(작은 원)를 점선 자리로 옮겨요.",
        bg: g => { const k = 25; ci6Circle(g, 130, 125, 4 * k, { fill: "#E56B6F", stroke: CI6.ink, "stroke-width": 2.5 }); ci6Circle(g, 130, 125, k, { fill: "#fff", stroke: CI6.gray, "stroke-width": 1.5, "stroke-dasharray": "5 4" }); ci6Line(g, 130, 125, 130 + 4 * k * .8, 125 + 4 * k * .6, CI6.ink, 2); g.append(txt(130 + 52, 125 + 22, "4 m", 15, { fill: "#fff" })); ci6Circle(g, 360, 125, k, { stroke: CI6.blue, "stroke-width": 2, "stroke-dasharray": "5 4" }); g.append(txt(360, 125 + k + 18, "작은 원", 14, { fill: CI6.blue })); },
        pieces: [{ d: "M-25,0 A25,25 0 1 1 25,0 A25,25 0 1 1 -25,0 Z", fill: "#BFE0F5", stroke: "#3F79B5", at: [130, 125], to: [360, 125] }],
        after: fg => { ci6Line(fg, 360, 125, 385, 125, CI6.ink, 2); fg.append(txt(372, 112, "1 m", 13)); },
        doneSay: "큰 원에서 작은 원(분수)을 뺀 나머지가 빨간색 꽃밭이에요.",
        ask: [
          { parts: ["큰 원과 작은 원의 넓이를 구하려면 큰 원과 작은 원의 ", { o: ["반지름", "둘레의 색"], a: 0 }, "을 알아야 해요."] },
          { parts: ["반지름이 4 m인 큰 원의 넓이: 4×4×3.14 = ", { n: 50.24 }, " (m²)"] },
          { parts: ["반지름이 1 m인 작은 원의 넓이: 1×1×3.14 = ", { n: 3.14 }, " (m²)"] },
          { parts: ["빨간색 꽃밭의 넓이: 50.24−3.14 = ", { n: 47.1, why: { "53.38": "큰 원에서 작은 원을 빼요." } }, " (m²)"] }],
        ok: "빨간색 꽃밭의 넓이는 큰 원의 넓이에서 작은 원의 넓이를 빼서 50.24−3.14=47.1 (m²)예요.", calc: true }) },
    { name: "그려 보기", inst: "색칠한 부분의 모양을 살펴보세요. “넓이를 구하기 쉬운 모양이 되도록 바꾸어 볼까?” 왼쪽 아래에 붙은 작은 반원을 끌어 오른쪽의 빈 곳(점선)에 넣어 보세요.", hints: ["작은 반원을 오른쪽 빈 곳에 가져가면 돌아서 꼭 맞게 들어가요.", "옮기면 반지름이 5 cm인 반원이 돼요.", "반원의 넓이는 원의 넓이를 2로 나누어 구해요."],
      render: (b, a) => ci6Move(b, a, { W: 460, H: 230, maxW: "24em", say: "작은 반원을 끌어 빈 곳에 넣어요.", bg: ci6HalfBg, tol: 34,
        pieces: [{ d: CI6_BUMP, fill: CI6.pink, at: [CI6_HALF.X - 50, CI6_HALF.Y], to: [CI6_HALF.X + 50, CI6_HALF.Y], rot0: 0, rot1: 180 }],
        doneSay: "옮기고 나니 반지름이 5 cm인 반원이 되었어요.",
        ask: [
          { parts: ["색칠한 부분은 일부분을 옮기면 반지름이 ", { n: 5 }, " cm인 ", { o: ["반원", "원", "정사각형"], a: 0 }, "이 돼요."] },
          { parts: ["반지름이 5 cm인 원의 넓이: 5×5×3.14 = ", { n: 78.5 }, " (cm²)"] },
          { parts: ["색칠한 부분의 넓이: 78.5÷2 = ", { n: 39.25, why: { "78.5": "반원은 원의 절반이에요. 2로 나누어요." } }, " (cm²)"] }],
        ok: "일부분을 옮기면 반지름이 5 cm인 반원이 되므로 색칠한 부분의 넓이는 78.5÷2=39.25 (cm²)예요.", calc: true }) },
    { name: "말해 보기", inst: "색칠한 부분의 넓이를 구해 보세요. 반지름이 8 cm인 반원과 지름이 8 cm인 반원으로 이루어진 도형이에요.", hints: ["큰 반원: 8×8×3.14÷2예요.", "지름이 8 cm인 반원은 반지름이 4 cm예요.", "두 반원의 넓이를 더해요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: ci6L7aFig, parts: ["반지름이 8 cm인 반원: 8×8×3.14÷2 = ", { n: 100.48 }, " (cm²)"] },
        { parts: ["지름이 8 cm인 반원: 4×4×3.14÷2 = ", { n: 25.12, why: { "100.48": "지름이 8 cm이니 반지름은 4 cm예요." } }, " (cm²)"] },
        { parts: ["색칠한 부분의 넓이: ", { n: 125.6 }, " cm²"] }],
      { ok: "100.48+25.12=125.6 (cm²)예요. 색칠한 부분을 두 반원으로 나누어 구했어요.", calc: true }) },
    { name: "모양 바꾸기", inst: "한 변이 14 cm인 정사각형이에요. 네 모서리의 색칠하지 않은 부분(흰 부분)을 끌어 오른쪽 점선 원에 모아 보세요.", hints: ["흰 조각 하나는 반지름이 7 cm인 원의 ¼이에요.", "흰 조각 4개를 모으면 지름이 14 cm인 원이 돼요.", "정사각형의 넓이에서 원의 넓이를 빼요."],
      render: (b, a) => { const { x, y, k } = CI6_SQ, S = 14 * k, r = 7 * k, cx = 370, cy = y + S / 2;
        return ci6Move(b, a, { W: 470, H: 240, maxW: "26em", say: "흰 조각 4개를 점선 원으로 옮겨요.", tol: 22,
          bg: g => { ci6SqStarBg(g, true); ci6Circle(g, cx, cy, r, { stroke: CI6.gray, "stroke-width": 1.5, "stroke-dasharray": "5 4" }); ci6Line(g, cx - r, cy, cx + r, cy, CI6.gray, 1, { "stroke-dasharray": "3 4" }); ci6Line(g, cx, cy - r, cx, cy + r, CI6.gray, 1, { "stroke-dasharray": "3 4" }); },
          pieces: [[x, y, 0], [x + S, y, 90], [x + S, y + S, 180], [x, y + S, 270]].map(([px, py, rot]) => ({ d: `M0,0 L${r},0 A${r},${r} 0 0 1 0,${r} Z`, fill: "#fff", stroke: CI6.ink, at: [px, py], to: [cx, cy], rot0: rot, rot1: rot })),
          after: fg => ci6Dim(fg, cx - r, cy + r + 14, cx + r, cy + r + 14, "14 cm", CI6.ink, 14),
          doneSay: "흰 조각 4개가 모여 지름이 14 cm인 원이 되었어요.",
          ask: [
            { parts: ["정사각형의 넓이: 14×14 = ", { n: 196 }, " (cm²)"] },
            { parts: ["색칠하지 않은 부분을 합친 원의 넓이: 7×7×3.14 = ", { n: 153.86, why: { "615.44": "지름이 14 cm이니 반지름은 7 cm예요." } }, " (cm²)"] },
            { parts: ["색칠한 부분의 넓이: 196−153.86 = ", { n: 42.14 }, " (cm²)"] }],
          ok: "색칠하지 않은 부분을 합치면 지름이 14 cm인 원이 되므로 196−153.86=42.14 (cm²)예요.", calc: true }); } },
    { name: "확인하기", inst: "수학익힘 문제예요. 도형의 넓이를 구해 보세요.", hints: ["양쪽의 반원 2개를 합치면 원 1개가 돼요.", "운동장: 직사각형 65×40에 반지름이 20 m인 원을 더해요.", "도형: 직사각형 16×8에 반지름이 4 cm인 원을 더해요."],
      render: (b, a) => ci6Ask(b, a, [
        { q: "직사각형 양쪽에 반원을 붙인 모양의 운동장 넓이를 구해 보세요.", fig: () => ci6StadiumFig(65, 40, 3.2, "65 m", "40 m", "#CFE8C9", "20em"), parts: ["직사각형 ", { n: 2600 }, " m² + 반원 2개 ", { n: 1256, why: { "5024": "반원 2개는 지름이 40 m, 반지름이 20 m인 원 1개예요." } }, " m² = ", { n: 3856 }, " m²"] },
        { q: "도형의 넓이를 구해 보세요.", fig: () => ci6StadiumFig(16, 8, 12, "16 cm", "8 cm", "#F7C9A5", "18em"), parts: [{ n: 178.24, why: { "128": "양쪽 반원의 넓이도 더해요.", "328.96": "반원의 반지름은 4 cm예요." } }, " cm²"] }],
      { ok: "운동장의 넓이는 2600+1256=3856 (m²), 도형의 넓이는 128+50.24=178.24 (cm²)예요.", calc: true }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 반원과 사분원의 넓이를 이용하여 색칠한 부분의 넓이를 구해 보세요.", hints: ["지름이 4 cm인 반원의 반지름은 2 cm예요.", "가는 반지름 18 cm인 사분원 1개, 나는 반지름 9 cm인 사분원 4개예요.", "반지름이 12 m인 사분원은 원의 넓이를 4로 나누어요."],
    render: (b, a) => ci6Ask(b, a, [
      { fig: () => ci6SemiFig(4, 40, "4 cm"), parts: ["색칠한 부분의 넓이: ", { n: 6.28, why: { "12.56": "반원이에요. 원의 넓이를 2로 나누어요.", "25.12": "지름이 4 cm이니 반지름은 2 cm예요." } }, " cm²"] },
      { q: "한 변이 18 cm인 정사각형 가와 나에서 색칠한 부분의 넓이를 비교해 보세요.", fig: ci6TwoSqFig, parts: ["(가의 색칠한 부분) ", { o: [">", "=", "<"], a: 1, why: { "0": "가: 18×18×3.14÷4=254.34, 나: 9×9×3.14÷4×4=254.34예요." } }, " (나의 색칠한 부분)"] },
      { q: "반지름이 20 cm인 반원에서 반지름이 10 cm인 반원 2개를 뺀 모양이에요.", fig: ci6BigMinusFig, parts: ["색칠한 부분의 넓이: ", { n: 314 }, " cm²"] },
      { q: "반지름이 12 m인 원을 4등분한 모양(사분원)의 텃밭이에요.", fig: () => ci6QuarterFig(12, 12, "12 m"), parts: ["텃밭의 넓이: ", { n: 113.04, why: { "452.16": "원의 ¼이에요. 4로 나누어요." } }, " m²"] }],
    { ok: "6.28 cm², 가와 나는 같아요(254.34 cm²), 628−314=314 (cm²), 452.16÷4=113.04 (m²)예요.", calc: true }) }
},
{
  id: "t8", no: "8~9", title: "생각을 더하다 ― 어느 메뉴를 고를까요", soop: "탐구 정리하기(O)",
  question: "가격이 같을 때 피자를 더 많이 먹을 수 있는 메뉴는 무엇일까요?",
  summary: "피자의 두께가 같으면 넓이가 넓을수록 더 많이 먹을 수 있어요. 성민이의 메뉴 1(지름 32 cm 1판)은 16×16×3.14=803.84 (cm²), 메뉴 2(지름 20 cm 2판)는 10×10×3.14×2=628 (cm²)이라서 메뉴 1을 골라요. 서현이의 메뉴 1(지름 30 cm 1판)은 706.5 cm², 메뉴 2(지름 22 cm 2판)는 759.88 cm²라서 메뉴 2를 골라요.",
  steps: [
    { name: "이해해요", inst: "“성민이는 피자를 더 많이 먹을 수 있는 메뉴를 주문하려고 합니다. 원 모양 피자의 두께가 모두 같을 때 어느 메뉴를 골라야 할지 구해 봅시다.” 메뉴 1은 지름이 32 cm인 피자 1판(20000원), 메뉴 2는 지름이 20 cm인 피자 2판(20000원)이에요. 피자를 끌어 겹쳐 보아도 돼요.", hints: ["두 메뉴의 가격은 같아요.", "두께가 같으므로 넓이를 비교해요.", "메뉴 2는 피자 2판의 넓이를 더해요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: () => ci6PizzaFig([{ name: "메뉴 1", d: 32, n: 1, price: 20000 }, { name: "메뉴 2", d: 20, n: 2, price: 20000 }], 3.2), q: "구하려는 것은 무엇인가요?", parts: [{ o: ["피자를 더 많이 먹을 수 있는 메뉴", "더 싼 메뉴", "피자의 두께"], a: 0 }] },
        { q: "무엇을 비교해야 하나요?", parts: [{ o: ["메뉴 1 피자 한 판의 넓이와 메뉴 2 피자 2판의 넓이의 합", "두 메뉴 피자의 지름", "두 메뉴 피자의 판 수"], a: 0, why: { "1": "지름만 보면 판 수를 생각하지 못해요.", "2": "판 수만 보면 피자의 크기를 생각하지 못해요." } }] },
        { parts: ["피자의 지름: 메뉴 1은 ", { n: 32 }, " cm, 메뉴 2는 ", { n: 20 }, " cm예요."] }],
      { ok: "피자를 더 많이 먹을 수 있는 메뉴를 구하려면 메뉴 1 피자 한 판의 넓이와 메뉴 2 피자 2판의 넓이의 합을 비교해요." }) },
    { name: "계획해요", inst: "어떻게 해결할지 계획해 보세요.", hints: ["원의 넓이를 구하려면 반지름이 필요해요.", "메뉴 2는 피자가 2판이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "메뉴 1의 넓이는 어떻게 구하나요?", o: ["지름이 32 cm인 원의 넓이를 구해요", "지름이 32 cm인 원의 원주를 구해요"], a: 0 },
        { q: "메뉴 2의 넓이는 어떻게 구하나요?", o: ["지름이 20 cm인 원 2개의 넓이의 합을 구해요", "지름이 40 cm인 원 1개의 넓이를 구해요", "지름이 20 cm인 원 1개의 넓이를 구해요"], a: 0, why: { "1": "지름이 20 cm인 피자 2판을 붙여도 지름이 40 cm인 피자가 되지 않아요.", "2": "피자가 2판이에요." } },
        { q: "원의 넓이를 구하려면 먼저 무엇을 구해야 하나요?", o: ["반지름", "원주", "원주율"], a: 0 }],
        { ok: "메뉴 1은 지름이 32 cm인 원의 넓이, 메뉴 2는 지름이 20 cm인 원 2개의 넓이의 합을 구해 비교해요. 먼저 반지름을 구해요." }) },
    { name: "해결해요", inst: "계획대로 문제를 해결해 보세요. (계산기를 써도 돼요.)", hints: ["반지름은 지름의 ½이에요.", "메뉴 1: 16×16×3.14예요.", "메뉴 2: 10×10×3.14×2예요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["반지름: 메뉴 1은 32÷2 = ", { n: 16 }, " (cm), 메뉴 2는 20÷2 = ", { n: 10 }, " (cm)"] },
        { parts: ["메뉴 1의 넓이: 16×16×3.14 = ", { n: 803.84, why: { "3215.36": "지름이 아니라 반지름 16 cm로 구해요." } }, " (cm²)"] },
        { parts: ["메뉴 2의 넓이: 10×10×3.14×2 = ", { n: 628, why: { "314": "피자가 2판이에요. 2를 곱해요." } }, " (cm²)"] },
        { parts: ["803.84 ", { o: [">", "=", "<"], a: 0 }, " 628이므로 ", { o: ["메뉴 1", "메뉴 2"], a: 0 }, "을 골라야 해요."] }],
      { ok: "메뉴 1은 803.84 cm², 메뉴 2는 628 cm²이므로 성민이는 메뉴 1을 골라야 해요.", calc: true }) },
    { name: "되돌아봐요", inst: "문제를 해결한 과정을 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "문제를 해결한 방법을 친구에게 설명하듯이 써 보세요.", tag: "해결 방법", ph: "예) 지름을 2로 나누어 반지름을 구하고, 원의 넓이를 구해 비교했어요." },
        { q: "다른 방법으로 해결할 수 있을지 써 보세요.", tag: "다른 방법", ph: "예) 3.14를 곱하기 전에 16×16=256과 10×10×2=200만 비교해도 돼요." }]) },
    { name: "스스로 해결해요", inst: "“서현이는 피자를 더 많이 먹을 수 있는 메뉴를 주문하려고 합니다. 원 모양 피자의 두께가 모두 같을 때 어느 메뉴를 골라야 할지 구해 봅시다.” 메뉴 1은 지름이 30 cm인 피자 1판(18000원), 메뉴 2는 지름이 22 cm인 피자 2판(18000원)이에요.", hints: ["반지름은 15 cm와 11 cm예요.", "메뉴 2는 11×11×3.14×2예요.", "이번에는 성민이 문제와 결과가 달라요. 지름만 보고 판단하지 않아요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: () => ci6PizzaFig([{ name: "메뉴 1", d: 30, n: 1, price: 18000 }, { name: "메뉴 2", d: 22, n: 2, price: 18000 }], 3.2), parts: ["메뉴 1의 넓이: ", { n: 706.5, why: { "2826": "반지름 15 cm로 구해요." } }, " cm²"] },
        { parts: ["메뉴 2의 넓이: ", { n: 759.88, why: { "379.94": "피자가 2판이에요." } }, " cm²"] },
        { parts: ["서현이가 골라야 하는 메뉴는 ", { o: ["메뉴 1", "메뉴 2"], a: 1, why: { "0": "706.5 cm²보다 759.88 cm²가 더 넓어요." } }, "예요."] }],
      { ok: "메뉴 1은 15×15×3.14=706.5 (cm²), 메뉴 2는 11×11×3.14×2=759.88 (cm²)이므로 서현이는 메뉴 2를 골라야 해요. 이번에는 작은 피자 2판이 더 많아요!", calc: true }) }
  ],
  challenge: { inst: "조건을 바꾸어 새 문제를 만들어 보았어요. 지름이 20 cm인 피자 몇 판의 넓이의 합이 지름이 40 cm인 피자 1판의 넓이와 같을까요?", hints: ["지름이 40 cm인 피자의 반지름은 20 cm예요.", "20×20×3.14=1256, 10×10×3.14=314예요.", "1256은 314의 몇 배인지 구해요."],
    render: (b, a) => ci6Ask(b, a, [
      { parts: ["지름이 40 cm인 피자 1판의 넓이: ", { n: 1256 }, " cm²,  지름이 20 cm인 피자 1판의 넓이: ", { n: 314 }, " cm²"] },
      { parts: ["지름이 20 cm인 피자 ", { n: 4, why: { "2": "지름이 2배이면 넓이는 2×2=4(배)가 돼요." } }, "판의 넓이의 합이 지름이 40 cm인 피자 1판의 넓이와 같아요."] }],
    { ok: "1256÷314=4이므로 4판이에요. 지름이 2배가 되면 넓이는 4배가 돼요.", calc: true }) }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 땅을 더 넓게 차지해 보아요", soop: "발표하기(P)",
  question: "원의 넓이를 정확하게 구하여 땅을 더 넓게 차지해 볼까요?",
  summary: "두 사람이 번갈아 주사위를 던져 나온 눈의 수를 반지름으로 하는 원의 넓이를 구해요. 넓이를 옳게 구하면 모눈종이에 원을 겹치지 않게 그리고(한 점에서 만나는 것은 돼요) 원 안에 넓이를 써요. 원을 더 그릴 수 없을 때까지 하고, 그린 원의 넓이의 합이 더 큰 사람이 이겨요.",
  steps: [
    { name: "놀이 방법 알기", inst: "놀이 방법을 읽고 답해 보세요. 준비하기: ① 가위바위보로 놀이 순서를 정해요. ② 서로 다른 색의 색연필을 골라요. 놀이 방법: 1. 순서대로 주사위를 던져서 나온 눈의 수를 반지름으로 하는 원의 넓이를 구해요. 상대방은 넓이가 맞는지 계산기로 확인해요. 2. 원의 넓이를 옳게 구하면 모눈종이에 원을 그리고 원 안에 넓이를 써요. 3. 원의 넓이를 잘못 구하거나 원을 그릴 자리가 없으면 상대방에게 차례가 넘어가요. 4. 원을 더 이상 그리지 못할 때까지 반복하고, 그린 원의 넓이의 합이 더 큰 사람이 이겨요.", hints: ["주사위 눈의 수가 원의 반지름이에요.", "넓이를 잘못 구하면 차례가 넘어가요.", "넓이의 합이 큰 사람이 이겨요."],
      render: (b, a) => quiz(b, a, [
        { q: "주사위를 던져 3이 나왔어요. 어떤 원의 넓이를 구해야 하나요?", o: ["반지름이 3 cm인 원", "지름이 3 cm인 원", "원주가 3 cm인 원"], a: 0 },
        { q: "차례가 상대방에게 넘어가는 경우를 모두 골라 보세요.", o: ["원의 넓이를 잘못 구했을 때", "원을 그릴 자리가 없을 때", "원의 넓이를 옳게 구했을 때"], a: [0, 1] },
        { q: "놀이에서 이기려면 무엇이 중요할까요?", o: ["원의 넓이를 옳게 구하고 원을 그릴 자리를 잘 정하는 것", "주사위를 세게 던지는 것"], a: 0 }],
        { ok: "주사위 눈의 수를 반지름으로 하는 원의 넓이를 옳게 구해야 원을 그릴 수 있어요." }) },
    { name: "넓이 미리 구하기", inst: "주사위 눈의 수를 반지름으로 하는 원의 넓이를 미리 구해 보세요. (계산기를 써도 돼요.)", hints: ["(반지름)×(반지름)×3.14예요.", "2×2×3.14=12.56이에요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["반지름 1 cm: ", { n: ci6Area(1) }, " cm²,  반지름 2 cm: ", { n: ci6Area(2), why: { "6.28": "반지름에 3.14만 곱했어요. 반지름을 두 번 곱해요." } }, " cm²,  반지름 3 cm: ", { n: ci6Area(3) }, " cm²"] },
        { parts: ["반지름 4 cm: ", { n: ci6Area(4) }, " cm²,  반지름 5 cm: ", { n: ci6Area(5) }, " cm²,  반지름 6 cm: ", { n: ci6Area(6) }, " cm²"] }],
      { ok: "3.14, 12.56, 28.26, 50.24, 78.5, 113.04 (cm²)예요.", calc: true }) },
    { name: "그리는 규칙", inst: "원을 그릴 때 다른 원과 한 점에서 만나는 것은 되지만 원을 겹쳐 그리는 것은 안 돼요. 그릴 수 있는 경우를 골라 보세요.", hints: ["두 원의 중심 사이의 거리와 두 반지름의 합을 비교해요.", "중심 사이의 거리가 반지름의 합과 같으면 한 점에서 만나요."],
      render: (b, a) => quiz(b, a, [
        { q: "반지름이 3 cm인 원이 그려져 있어요. 중심 사이의 거리가 5 cm가 되게 반지름이 2 cm인 원을 그리면 어떻게 되나요?", fig: () => ci6Fig(300, 150, s => { const k = 22; ci6Circle(s, 90, 75, 3 * k, { fill: "rgba(43,123,214,.22)", stroke: CI6.blue, "stroke-width": 2.5 }); ci6Circle(s, 90 + 5 * k, 75, 2 * k, { fill: "rgba(214,69,69,.22)", stroke: CI6.red, "stroke-width": 2.5 }); ci6Dim(s, 90, 75, 90 + 5 * k, 75, "5 cm", CI6.ink, -12); }, "15em"),
          o: ["한 점에서 만나므로 그릴 수 있어요", "겹치므로 그릴 수 없어요"], a: 0, why: { "1": "3+2=5이므로 두 원은 한 점에서만 만나요." } },
        { q: "중심 사이의 거리가 4 cm가 되게 반지름이 3 cm인 원과 반지름이 2 cm인 원을 그리면 어떻게 되나요?", o: ["한 점에서 만나요", "겹쳐요"], a: 1, why: { "0": "4는 3+2=5보다 작으니 두 원이 겹쳐요." } }],
        { ok: "중심 사이의 거리가 두 반지름의 합과 같으면 한 점에서 만나서 그릴 수 있고, 더 짧으면 겹쳐서 그릴 수 없어요." }) },
    { name: "땅따먹기 놀이", inst: "짝과 함께 놀이해 보세요(파랑과 빨강). 주사위를 굴리고 원의 넓이를 쓴 뒤, 맞으면 모눈의 점을 눌러 원의 중심을 정해요. 원이 모눈종이 밖으로 나가거나 다른 원과 겹치면 안 돼요.", hints: ["큰 원은 넓은 빈자리에 그려요.", "작은 원은 남은 틈새에 그릴 수 있어요.", "계산기로 넓이를 확인해도 돼요."],
      render: (b, a) => ci6Land(b, a, { ok: "놀이를 끝까지 했어요! 원의 넓이를 정확하게 구해야 땅을 차지할 수 있었지요?" }) },
    { name: "되돌아보기", inst: "놀이를 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "반지름을 알 때 원의 넓이를 구하는 방법을 써 보세요.", tag: "방법", ph: "예) (반지름)×(반지름)×(원주율)로 구해요." },
        { q: "땅을 더 넓게 차지하려면 어떻게 하면 좋을지 써 보세요.", tag: "전략", ph: "예) 큰 원이 들어갈 자리를 남겨 두고 작은 원은 구석에 그려요." }]) }
  ],
  challenge: { inst: "또 다른 놀이 방법이에요. 주사위 눈의 수를 반지름으로 하는 원의 원주를 구하고, 먼저 원을 7개 그리는 사람이 나오거나 더 그릴 수 없을 때까지 해서 원주의 합이 큰 사람이 이겨요. 놀이가 끝난 뒤 두 사람의 원주의 합을 구해 보세요.", hints: ["반지름이 3 cm이면 지름은 6 cm, 원주는 6×3.14=18.84 (cm)예요.", "파랑: 반지름 3, 2, 5, 3, 3, 5", "빨강: 반지름 2, 2, 6, 4, 4, 3, 2"],
    render: (b, a) => { const blue = [3, 2, 5, 3, 3, 5], red = [2, 2, 6, 4, 4, 3, 2], sum = L => ci6R(L.reduce((t, r) => t + ci6Circ(2 * r), 0));
      return ci6Ask(b, a, [
        { parts: ["반지름 1 cm인 원의 원주: ", { n: ci6Circ(2) }, " cm,  반지름 6 cm인 원의 원주: ", { n: ci6Circ(12), why: { [ci6Circ(6)]: "반지름이 6 cm이니 지름은 12 cm예요." } }, " cm"] },
        { q: `파랑이 그린 원의 반지름: ${blue.join(" cm, ")} cm`, parts: ["파랑의 원주의 합: ", { n: sum(blue) }, " cm"] },
        { q: `빨강이 그린 원의 반지름: ${red.join(" cm, ")} cm`, parts: ["빨강의 원주의 합: ", { n: sum(red) }, " cm"] },
        { parts: ["이긴 사람은 ", { o: ["파랑", "빨강"], a: sum(blue) > sum(red) ? 0 : 1 }, "이에요."] }],
      { ok: `파랑은 ${ci6S(sum(blue))} cm, 빨강은 ${ci6S(sum(red))} cm이므로 빨강이 이겼어요.`, calc: true }); } }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "원주와 원주율, 원의 넓이를 구할 수 있나요?",
  summary: "원의 둘레를 원주라고 하고, 원주는 지름의 3배보다 길고 4배보다 짧아요. 원의 지름에 대한 원주의 비율을 원주율이라고 하고 3.14로 어림하여 사용해요. (원주)=(지름)×(원주율), (지름)=(원주)÷(원주율), (원의 넓이)=(반지름)×(반지름)×(원주율)이에요.",
  steps: [
    { name: "원주와 지름", inst: "내 힘으로 풀어요. 그림과 수를 보고 답해 보세요.", hints: ["원 안의 정육각형의 둘레는 지름의 3배, 원 밖의 정사각형의 둘레는 지름의 4배예요.", "(지름)=(원주)÷(원주율), (원주)=(지름)×(원주율)이에요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: () => ci6HexSqFig("반지름", "11em"), parts: ["(지름)×", { n: 3 }, " < (원주),  (원주) < (지름)×", { n: 4 }] },
        { parts: ["원주가 282.6 cm인 원의 지름: ", { n: 90, why: { "45": "45는 반지름이에요. (원주)÷(원주율)은 지름이에요." } }, " cm"] },
        { parts: ["지름이 110 cm인 원의 원주: ", { n: 345.4 }, " cm"] }],
      { ok: "원주는 지름의 3배보다 길고 4배보다 짧아요. 282.6÷3.14=90 (cm), 110×3.14=345.4 (cm)예요.", calc: true }) },
    { name: "원의 넓이", inst: "원의 넓이와 색칠한 부분의 넓이를 구해 보세요.", hints: ["지름이 12 cm이면 반지름은 6 cm예요.", "큰 원의 반지름은 2+3=5 (cm)예요.", "반원 2개를 합치면 반지름이 3 cm인 원이 돼요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["반지름이 8 cm인 원: ", { n: 200.96 }, " cm²,  지름이 12 cm인 원: ", { n: 113.04, why: { "452.16": "지름이 12 cm이니 반지름 6 cm로 구해요." } }, " cm²"] },
        { q: "중심이 같은 두 원이에요. 색칠한 부분의 넓이를 구해 보세요.", fig: () => ci6DonutFig(5, 2, 20, "2 cm", ["band", "3 cm"], "cm", "12em"), parts: [{ n: 65.94, why: { "15.7": "큰 원의 반지름은 3 cm가 아니라 2+3=5 (cm)예요.", "28.26": "큰 원의 반지름은 2+3=5 (cm)예요." } }, " cm²"] },
        { q: "직사각형 양쪽에 반원을 붙인 도형의 넓이를 구해 보세요.", fig: () => ci6StadiumFig(7, 6, 20, "7 cm", "6 cm", "#BFD9F2", "17em"), parts: [{ n: 70.26, why: { "42": "양쪽 반원의 넓이도 더해요.", "155.04": "반원의 반지름은 3 cm예요." } }, " cm²"] }],
      { ok: "200.96 cm², 113.04 cm², 78.5−12.56=65.94 (cm²), 42+28.26=70.26 (cm²)예요.", calc: true }) },
    { name: "잘못 고치기", inst: "원에 대해 잘못 설명한 사람을 찾아 이름을 쓰고, 옳게 고쳐 보세요.", hints: ["원주율은 (원주)÷(지름)이에요.", "모든 원에서 원주율은 같아요."],
      render: (b, a) => ci6Ask(b, a, [
        { fig: () => ci6Talk([["시후:", "원의 지름이 길어지면 원주도 길어져."], ["은채:", "원주율은 원의 지름에 대한 원주의 비율이야."], ["재민:", "원의 크기에 따라 원주율은 달라져."]]),
          parts: ["잘못 설명한 사람: ", { o: ["시후", "은채", "재민"], a: 2, why: { "0": "지름이 길어지면 원주도 길어져요. 옳은 말이에요.", "1": "원주율은 원의 지름에 대한 원주의 비율이에요. 옳은 말이에요." } }] },
        { parts: ["옳게 고치기: ", { o: ["원의 크기와 상관없이 원주율은 일정해.", "원이 클수록 원주율도 커져.", "원이 작을수록 원주율이 커져."], a: 0 }] }],
      { ok: "재민이가 잘못 말했어요. 원의 크기와 상관없이 원주율은 일정해요." }) },
    { name: "탁자의 넓이", inst: "원주가 251.2 cm인 원 모양 탁자의 넓이는 몇 cm²인지 구해 보세요.", hints: ["먼저 원주로 지름을 구해요.", "지름을 2로 나누어 반지름을 구해요.", "(반지름)×(반지름)×3.14예요."],
      render: (b, a) => ci6Ask(b, a, [
        { parts: ["지름: 251.2÷3.14 = ", { n: 80 }, " (cm)"] },
        { parts: ["반지름: 80÷2 = ", { n: 40 }, " (cm)"] },
        { parts: ["탁자의 넓이: 40×40×3.14 = ", { n: 5024, why: { "20096": "지름이 아니라 반지름 40 cm로 구해요." } }, " (cm²)"] }],
      { ok: "지름 80 cm, 반지름 40 cm이므로 탁자의 넓이는 5024 cm²예요.", calc: true }) },
    { name: "확인하고 정리해요", inst: "배운 내용을 정리해 보세요.", hints: ["원의 둘레를 부르는 이름을 떠올려요.", "원의 넓이는 직사각형의 넓이를 이용해 구했어요."],
      render: (b, a) => blanks(b, a, ["원의 둘레를 ", { o: ["원주", "원주율"], a: 0 }, "라고 합니다. 원의 지름에 대한 원주의 비율을 ", { o: ["원주", "원주율"], a: 1 }, "이라고 하고, 3.14로 어림하여 사용합니다. (원주)=(", { o: ["지름", "반지름"], a: 0 }, ")×(원주율), (지름)=(원주)÷(원주율), (원의 넓이)=(반지름)×(", { o: ["반지름", "지름"], a: 0 }, ")×(원주율)"],
        { ok: "원주, 원주율, 원주와 지름을 구하는 방법, 원의 넓이를 구하는 방법을 모두 정리했어요! 다음에는 원기둥, 원뿔, 구를 공부해요." }) }
  ],
  challenge: { inst: "지름이 4 cm, 8 cm, 12 cm인 반원으로 만든 도형이에요. 큰 반원(지름 12 cm)에서 지름 8 cm인 반원만큼 빼고, 지름 4 cm인 반원을 붙였어요. 도형의 둘레와 넓이를 구해 보세요. (계산기를 써요.)", hints: ["둘레는 세 반원의 곡선 길이의 합이에요. 반원의 곡선은 원주의 ½이에요.", "4×3.14÷2=6.28, 8×3.14÷2=12.56, 12×3.14÷2=18.84예요.", "넓이: 6.28+(56.52−25.12)예요."],
    render: (b, a) => ci6Ask(b, a, [
      { fig: ci6YinFig, parts: ["도형의 둘레: ", { n: 37.68 }, " cm"] },
      { parts: ["도형의 넓이: ", { n: 37.68, why: { "87.92": "지름 8 cm인 반원은 빼야 해요." } }, " cm²"] }],
    { ok: "둘레는 6.28+12.56+18.84=37.68 (cm), 넓이는 6.28+(56.52−25.12)=37.68 (cm²)예요.", calc: true }) }
}
];
