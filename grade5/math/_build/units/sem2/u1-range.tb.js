//@@APP
const APP={title:"농산물 축제 수의 범위와 어림", unit:"5-2 수학 1. 수의 범위와 어림하기(교과서)", key:"t52-range-v1", welcome:"농산물 축제 수의 범위와 어림 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 크리에이터 정우와 함께 마을 농산물 축제를 둘러보며 이상·이하·초과·미만으로 수의 범위를 수직선에 나타내고, 올림·버림·반올림으로 알맞게 어림해요."};
//@@UNIT
/* =========================================================
   5-2 수학 1. 수의 범위와 어림하기 — 단원 조작 부품 (앞글자 rg1)
   수는 모두 코드로 계산해서 채점해요(올림·버림·반올림은 0.001 단위 정수로 바꾸어 계산).
   rg1Line    수직선에 ●(포함)·○(포함하지 않음) 점을 찍고 범위 쪽으로 선 긋기
   rg1LineFig 범위를 나타낸 수직선 그림(읽기용)
   rg1Mark    수 카드에 ○표·△표 하기(범위에 드는 수 찾기)
   rg1Sort    카드를 알맞은 칸(등급·체급·어림 방법)으로 옮기기
   rg1Pack    상자에 담기(올림)·바꾸기(버림): 상자 수를 늘리고 줄이며 최소·최대 찾기
   rg1Digits  구하려는 자리 숫자를 눌러 아래 수를 살펴보고 올림·버림·반올림하기
   rg1Coaster 롤러코스터 수직선에 수를 놓고 가까운 쪽으로 굴러가게 하기(반올림)
   rg1Lock    여행 가방 비밀번호 자물쇠 돌리기
   rg1Fee     택배 요금표에서 무게·크기가 속하는 칸 찾기
   rg1Cards   수 카드로 수를 만들어 조건 확인하기
   rg1Fest    농산물 축제 그림 둘러보기
   rg1Make·rg1Game·rg1Dice  놀이: 알쏭달쏭 수를 잡아요 / 주사위 어림 놀이
   rg1Ask     빈칸(수)·고르기를 한 번에 채점, rg1Chain 활동을 차례로 열기
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.rg1fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:manipulation}
.rg1figs{max-width:42em}
.rg1small{font-size:var(--fs-s);color:var(--muted);word-break:keep-all}
.rg1part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.rg1doneP{opacity:.72}
.rg1q{font-family:"Jua",sans-serif;color:var(--night);margin:.3em 0;word-break:keep-all;line-height:1.5}
.rg1tools{display:flex;flex-wrap:wrap;gap:.35em;margin:.3em 0}
.rg1tools button,.rg1btn{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .7em;font-size:1em;word-break:keep-all}
.rg1tools button.rg1on{background:var(--night);color:#fff;border-color:var(--night)}
.rg1read{font-family:"Jua",sans-serif;color:var(--night);word-break:keep-all;margin:.25em 0}
.rg1tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.rg1tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.rg1tbl th,.rg1tbl td{border:1.5px solid var(--line);padding:.25em .6em;text-align:center}
.rg1tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.rg1tbl td.rg1cell{cursor:pointer}
.rg1tbl td.rg1pk{background:#DCEAFB;outline:3px solid #2B7BD6;outline-offset:-3px}
.rg1tbl td.rg1good{background:#E3F4EA}
.rg1tbl td.rg1bad{background:#FBE7E2}
.rg1tray{display:flex;flex-wrap:wrap;gap:.4em;min-height:2.8em;padding:.4em;border:2px dashed var(--line);border-radius:12px;background:#FFFEFB;margin:.3em 0}
.rg1bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(10.5em,1fr));gap:.5em;margin:.4em 0}
.rg1bin{border:2px solid var(--line);border-radius:12px;background:#fff;padding:.35em .45em;min-height:5.2em;cursor:pointer;min-width:0}
.rg1bin.rg1tgt{border-color:#2B7BD6;background:#F2F7FD}
.rg1bint{font-family:"Jua",sans-serif;color:var(--night);word-break:keep-all;margin-bottom:.3em;font-size:.95em;line-height:1.35}
.rg1bin .rg1in{display:flex;flex-wrap:wrap;gap:.3em}
.rg1card{border:2px solid #E2C9A0;background:#FFF7E8;border-radius:.6em;padding:.25em .6em;font-size:1em;word-break:keep-all;max-width:100%;text-align:left}
.rg1card.rg1pk{border-color:#2B7BD6;background:#DCEAFB;box-shadow:0 0 0 2px #2B7BD6}
.rg1good{border-color:var(--ok)!important;background:#E3F4EA!important}
.rg1bad{border-color:var(--no)!important;background:#FBE7E2!important}
.rg1marks{display:flex;flex-wrap:wrap;gap:.5em;margin:.4em 0}
.rg1mk{border:2px solid var(--line);border-radius:12px;background:#fff;padding:.3em .5em;text-align:center;min-width:5.2em}
.rg1mk b{display:block;font-family:"Jua",sans-serif;font-size:1.25em;color:var(--night);word-break:keep-all}
.rg1mk small{display:block;color:var(--muted);font-size:var(--fs-s)}
.rg1mk button{border:2px solid var(--line);background:#fff;border-radius:.5em;min-width:2.2em;font-size:1.05em;margin:.15em .1em 0;padding:.05em .3em;color:#B7C2BF}
.rg1mk button.rg1on{color:#fff;background:#2B7BD6;border-color:#2B7BD6}
.rg1mk button.rg1on.rg1tri{background:#E47A38;border-color:#E47A38}
.rg1digs{display:flex;flex-wrap:wrap;gap:.6em;margin:.3em 0}
.rg1row{border:2px solid var(--line);border-radius:12px;background:#fff;padding:.4em .6em;flex:1 1 17em;min-width:0}
.rg1num{display:inline-flex;align-items:flex-start;gap:.15em;margin:.2em 0;flex-wrap:wrap}
.rg1d{display:inline-flex;flex-direction:column;align-items:center;border:none;background:none;padding:0;cursor:pointer}
.rg1d span{display:grid;place-items:center;width:1.75em;height:2em;border:2px solid var(--line);border-radius:.45em;background:#fff;font-family:"Jua",sans-serif;font-size:1.3em;color:var(--night)}
.rg1d small{font-size:.62em;color:var(--muted);margin-top:.15em;white-space:nowrap}
.rg1d.rg1tgt span{border-color:#2B7BD6;background:#DCEAFB;box-shadow:0 0 0 2px #2B7BD6}
.rg1d.rg1low span{background:#FFE9D6;border-color:#E47A38}
.rg1dot{font-family:"Jua",sans-serif;font-size:1.5em;line-height:1;padding-top:.55em}
.rg1say{font-size:var(--fs-s);color:#8A4A12;background:#FFF4E6;border-radius:.5em;padding:.2em .5em;margin:.2em 0;word-break:keep-all}
.rg1ans{display:flex;flex-wrap:wrap;align-items:center;gap:.35em;margin-top:.25em}
.rg1ans input{width:7em;font-size:1.1em;text-align:center}
.rg1ctl{display:flex;flex-wrap:wrap;gap:.35em;align-items:center;margin:.3em 0}
.rg1ctl button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em;font-size:1.05em}
.rg1ctl b{font-family:"Jua",sans-serif;color:var(--night);word-break:keep-all}
.rg1lock{display:flex;gap:.5em;justify-content:center;margin:.5em 0}
.rg1dial{display:flex;flex-direction:column;align-items:center;gap:.2em}
.rg1dial button{border:2px solid var(--line);background:#fff;border-radius:.5em;width:2.6em;font-size:1em}
.rg1dial b{display:grid;place-items:center;width:1.8em;height:2.1em;border:3px solid #6B7B78;border-radius:.4em;background:#FFFDF5;font-family:"Jua",sans-serif;font-size:1.7em}
.rg1notes{display:grid;grid-template-columns:repeat(auto-fill,minmax(5.2em,1fr));gap:.45em;margin:.4em 0}
.rg1note{border:none;background:#FFF2A8;box-shadow:0 2px 4px rgba(0,0,0,.15);border-radius:.3em;padding:.5em .2em;font-family:"Jua",sans-serif;font-size:1.15em;color:#3B3B1E}
.rg1note:nth-child(3n){background:#CFEFFF}.rg1note:nth-child(3n+1){background:#FFD6E0}
.rg1note.rg1gone{visibility:hidden}
.rg1prob{border:3px solid #E47A38;background:#FFF4E6;border-radius:12px;padding:.5em .8em;margin:.4em 0;font-family:"Jua",sans-serif;word-break:keep-all;line-height:1.5}
.rg1score{display:flex;flex-wrap:wrap;gap:.6em;font-family:"Jua",sans-serif;margin:.3em 0}
.rg1score span{border:2px solid var(--line);border-radius:.6em;padding:.15em .6em;background:#fff}
.rg1score span.rg1turn{border-color:#2B7BD6;background:#DCEAFB}
.rg1mk3{display:grid;grid-template-columns:repeat(auto-fit,minmax(15em,1fr));gap:.6em;margin:.4em 0}
.rg1sticky{background:#FFF8C9;border:2px solid #E8D27A;border-radius:10px;padding:.5em .6em;min-width:0}
.rg1sticky input{font-size:1.05em;text-align:center}
.rg1opts{display:flex;flex-wrap:wrap;gap:.25em;margin:.25em 0}
.rg1opts button{border:2px solid var(--line);background:#fff;border-radius:.5em;padding:.1em .5em;font-size:.95em}
.rg1opts button.rg1on{background:var(--night);color:#fff;border-color:var(--night)}
.rg1dice{display:inline-flex;gap:.4em;vertical-align:middle}
.rg1dice svg{width:3em;height:3em}
.rg1cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.4em 0}
.rg1cards button{width:2.6em;height:3.3em;border:3px solid #9DC0EA;border-radius:.5em;background:#fff;font-family:"Jua",sans-serif;font-size:1.5em}
.rg1cards button:disabled{opacity:.35}
.rg1made{display:flex;flex-wrap:wrap;gap:.35em;margin:.3em 0}
.rg1made span{border:2px solid var(--ok);background:#E3F4EA;border-radius:.6em;padding:.1em .6em;font-family:"Jua",sans-serif}
.rg1spot{cursor:pointer}
.rg1msg{border:2px solid #9DC0EA;background:#F2F7FD;border-radius:12px;padding:.45em .7em;margin:.3em 0;word-break:keep-all;min-height:2.6em}
.rg1say2 textarea{width:100%;min-height:4.5em;font-size:1em}
`;
  document.head.append(s);
})();

const RG1C = { ink: "#1D2A2A", blue: "#2B7BD6", red: "#D64545", green: "#2E8B57", org: "#E47A38", gray: "#8795A1", axis: "#3A4A48", rng: "#D9532B", sky: "#DCEAFB" };
const rg1F = x => String(Math.round(x * 1e6) / 1e6);
function rg1Num(s) { const t = String(s).replace(/[\s,]/g, "").replace(/[가-힣a-zA-Z²℃%]+$/, ""); return t === "" || isNaN(+t) ? NaN : +t; }
const rg1Eq = (a, b) => Math.abs(a - b) < 1e-9;
/* 받침: 수는 읽는 소리(0 영·십·백·천·만 → 받침 있음, 2 이·4 사·5 오·9 구 → 없음) */
function rg1Last(w) { return String(w).trim().replace(/[^가-힣A-Za-z0-9²]+$/, ""); }
function rg1Jong(w) {
  const s = rg1Last(w);
  const c = s.charCodeAt(s.length - 1);
  if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 !== 0;
  if (/m²$/.test(s)) return false;
  if (/[0-9]$/.test(s)) return /[013678]$/.test(s);
  return /(cm|m|mm|km|L|mL)$/.test(s) ? false : /g$/.test(s);
}
function rg1J(w, pair) {
  const [a, b] = pair.split("/");
  if (pair === "으로/로") { const s = rg1Last(w), c = s.charCodeAt(s.length - 1);
    if (/[0-9]$/.test(s)) return w + (/[036]$/.test(s) ? "으로" : "로");
    if (c >= 0xAC00 && c <= 0xD7A3) { const j = (c - 0xAC00) % 28; return w + (j === 0 || j === 8 ? "로" : "으로"); }
    return w + "로"; }
  return w + (rg1Jong(w) ? a : b);
}
/* ---------- 어림 계산(0.001 단위 정수) ---------- */
const RG1PN = { 6: "백만", 5: "십만", 4: "만", 3: "천", 2: "백", 1: "십", 0: "일", "-1": "소수 첫째", "-2": "소수 둘째", "-3": "소수 셋째" };
const rg1PN = p => RG1PN[p];
const rg1PL = p => p < 0 ? RG1PN[p] + " 자리" : RG1PN[p] + "의 자리";
function rg1Rnd(n, m, p) {
  const V = Math.round(+n * 1000), u = Math.round(Math.pow(10, p + 3));
  const q = m === "올림" ? Math.ceil(V / u) : m === "버림" ? Math.floor(V / u) : Math.floor((V + u / 2) / u);
  return Math.round(q * u) / 1000;
}
function rg1Low(n) { const s = String(n); const k = s.indexOf("."); return k < 0 ? (s.match(/0*$/)[0].length) : -(s.length - k - 1); }
/* ---------- 수의 범위 ---------- */
function rg1RName(r) {
  const a = r.lo != null ? `${rg1F(r.lo)} ${r.loInc ? "이상" : "초과"}` : "", b = r.hi != null ? `${rg1F(r.hi)} ${r.hiInc ? "이하" : "미만"}` : "";
  return [a, b].filter(Boolean).join(" ") + "인 수";
}
function rg1In(r, v) {
  if (r.lo != null && (r.loInc ? v < r.lo - 1e-9 : v <= r.lo + 1e-9)) return false;
  if (r.hi != null && (r.hiInc ? v > r.hi + 1e-9 : v >= r.hi - 1e-9)) return false;
  return true;
}

/* ---------- 여러 활동을 차례로 ---------- */
function rg1Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "rg1part" : "" }); body.append(box);
    const last = k === parts.length - 1, my = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (my !== k) return;
      if (last) return api.done(ans, msg, lv);
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.classList.add("rg1doneP"); box.querySelectorAll("button,input,textarea").forEach(e => { e.disabled = true; });
      k++; run();
    } });
    parts[my](box, sub);
    if (my) setTimeout(() => { try { box.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
  };
  run();
}

/* ---------- 빈칸(수)·고르기 묶음 ---------- */
function rg1Ask(host, api, items, opts = {}) {
  const wrap = h("div", { class: "rg1ask" }), all = [];
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
        const len = String(pt.n).length, w = pt.w || (len > 6 ? "8em" : len > 4 ? "6em" : "4.2em");
        const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "답", style: `width:${w};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : rg1F(pt.n);
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : pt.nodeType ? " " : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : rg1Eq(rg1Num(s.inp.value), s.pt.n);
  const val = s => s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-");
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) { [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); }); }
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) return api.done(ans, opts.ok);
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : rg1F(rg1Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}

/* ---------- 수직선 ---------- */
function rg1Geo(o) {
  const W = o.W || 760, m = o.m || 44, k = (W - 2 * m) / (o.to - o.from);
  return { W, m, k, X: v => m + (v - o.from) * k, V: x => o.from + (x - m) / k };
}
const rg1Mult = (v, q) => q > 0 && Math.abs(v / q - Math.round(v / q)) < 1e-6;
function rg1Axis(g, o, G, y) {
  const step = o.step || 1, n = Math.round((o.to - o.from) / step), lab = o.lab || (n > 12 ? step * 5 : step);
  g.append(svgEl("line", { x1: G.X(o.from) - 26, y1: y, x2: G.X(o.to) + 26, y2: y, stroke: RG1C.axis, "stroke-width": 2.5 }));
  g.append(svgEl("path", { d: `M${G.X(o.to) + 30},${y} l-10,-6 v12 z`, fill: RG1C.axis }));
  g.append(svgEl("path", { d: `M${G.X(o.from) - 30},${y} l10,-6 v12 z`, fill: RG1C.axis }));
  for (let i = 0; i <= n; i++) {
    const v = o.from + i * step, x = G.X(v), L = rg1Mult(v, lab), M = o.mid && rg1Mult(v, o.mid);
    const tl = L ? 13 : M ? 10 : 7;
    g.append(svgEl("line", { x1: x, y1: y - tl, x2: x, y2: y + tl, stroke: RG1C.axis, "stroke-width": L ? 2.2 : 1.4 }));
    if (L) g.append(txt(x, y + 30, rg1F(v), o.fs || 19));
  }
}
function rg1DrawRange(g, G, o, y, r) {
  const C = r.color || RG1C.rng, endR = G.X(o.to) + 24, endL = G.X(o.from) - 24;
  if (r.line) {
    const a = r.line[0] === -Infinity ? endL : G.X(r.line[0]), b = r.line[1] === Infinity ? endR : G.X(r.line[1]);
    g.append(svgEl("line", { x1: a, y1: y - 22, x2: b, y2: y - 22, stroke: C, "stroke-width": 6, "stroke-linecap": "round" }));
  }
  (r.pts || []).forEach(p => {
    const x = G.X(p.v);
    g.append(svgEl("line", { x1: x, y1: y - 22, x2: x, y2: y, stroke: C, "stroke-width": 1.5, "stroke-dasharray": "3 3" }));
    g.append(svgEl("circle", { cx: x, cy: y - 22, r: 8.5, fill: p.inc ? C : "#fff", stroke: C, "stroke-width": 3.2 }));
  });
}
/* 범위 r({lo,loInc,hi,hiInc}) → 그림 상태 */
function rg1Shape(r) {
  const pts = []; if (r.lo != null) pts.push({ v: r.lo, inc: !!r.loInc }); if (r.hi != null) pts.push({ v: r.hi, inc: !!r.hiInc });
  return { pts, line: [r.lo != null ? r.lo : -Infinity, r.hi != null ? r.hi : Infinity] };
}
function rg1LineFig(o, r) {
  const G = rg1Geo(o), H = 92, svg = makeSvg(G.W, H); svg.setAttribute("class", "rg1fig");
  if (o.maxW) svg.style.maxWidth = o.maxW;
  const g = svgEl("g"); svg.append(g); rg1Axis(g, o, G, 50);
  if (r) rg1DrawRange(g, G, o, 50, rg1Shape(r));
  return svg;
}
/* 수직선에 범위 나타내기: o={from,to,step,lab,mid,snap, r:{lo,loInc,hi,hiInc}, q, ok} */
function rg1Line(host, api, o) {
  const T = o.r, G = rg1Geo(o), H = 112, Y = 64, snap = o.snap || o.step || 1;
  const st = { pts: [], line: null, tool: "in" };
  if (o.q) host.append(h("p", { class: "rg1q" }, o.q));
  if (o.fig) host.append(typeof o.fig === "function" ? o.fig() : o.fig);
  const tools = h("div", { class: "rg1tools" });
  const TB = [["in", "● 포함하는 점"], ["out", "○ 포함하지 않는 점"], ["line", "━ 선 긋기"]].map(([k, t]) => {
    const b = h("button", { onclick: () => { st.tool = k; TB.forEach(x => x.classList.toggle("rg1on", x === b)); } }, t); return b; });
  TB[0].classList.add("rg1on");
  tools.append(...TB, h("button", { onclick: () => { st.pts = []; st.line = null; draw(); } }, "↺ 지우기"));
  const svg = makeSvg(G.W, H); svg.setAttribute("class", "rg1fig"); svg.style.cursor = "pointer";
  const base = svgEl("g"), lay = svgEl("g"), hov = svgEl("g"); svg.append(base, lay, hov); rg1Axis(base, o, G, Y);
  const read = h("div", { class: "rg1small" }, "수직선 위를 눌러요. 눈금 위에 손을 올리면 그 자리의 수가 보여요.");
  const snapV = x => { const v = o.from + Math.round((G.V(x) - o.from) / snap) * snap; return Math.max(o.from, Math.min(o.to, Math.round(v * 1e6) / 1e6)); };
  function draw() { lay.innerHTML = ""; rg1DrawRange(lay, G, o, Y, { pts: st.pts, line: st.line }); }
  svg.addEventListener("pointermove", e => {
    const p = svgPt(svg, e); hov.innerHTML = "";
    if (p.x < G.X(o.from) - 12 || p.x > G.X(o.to) + 12) return;
    const v = snapV(p.x), x = G.X(v);
    hov.append(svgEl("line", { x1: x, y1: Y - 34, x2: x, y2: Y + 6, stroke: RG1C.blue, "stroke-width": 1.5, opacity: .6 }), txt(x, 14, rg1F(v), 16, { fill: RG1C.blue }));
  });
  svg.addEventListener("pointerleave", () => { hov.innerHTML = ""; });
  svg.addEventListener("pointerdown", e => {
    const p = svgPt(svg, e);
    if (st.tool === "line") {
      const c = G.V(p.x);
      if (!st.pts.length) return api.hint("먼저 점을 찍은 다음 선을 그어요.");
      const ps = st.pts.map(q => q.v).sort((a, b) => a - b);
      if (ps.some(v => Math.abs(G.X(v) - p.x) < 6)) return api.hint("점의 왼쪽이나 오른쪽, 선을 그을 쪽을 눌러요.");
      if (ps.length === 1) st.line = c > ps[0] ? [ps[0], Infinity] : [-Infinity, ps[0]];
      else st.line = c < ps[0] ? [-Infinity, ps[0]] : c > ps[1] ? [ps[1], Infinity] : [ps[0], ps[1]];
      return draw();
    }
    if (p.x < G.X(o.from) - 14 || p.x > G.X(o.to) + 14) return;
    const v = snapV(p.x), inc = st.tool === "in", ex = st.pts.find(q => rg1Eq(q.v, v));
    if (ex) { if (ex.inc === inc) st.pts = st.pts.filter(q => q !== ex); else ex.inc = inc; }
    else { if (st.pts.length >= 2) return api.hint("점은 두 개까지 찍을 수 있어요. 점을 다시 누르면 지워져요."); st.pts.push({ v, inc }); }
    st.line = null; read.textContent = st.pts.length ? "찍은 점: " + st.pts.map(q => rg1F(q.v) + (q.inc ? " ●" : " ○")).join(", ") : "수직선 위를 눌러요."; draw();
  });
  const name = rg1RName(T), want = rg1Shape(T);
  api.provide({ words: ["●", "○", name], answers: [name + ": " + want.pts.map(q => rg1F(q.v) + (q.inc ? "에 ●" : "에 ○")).join(", ") + (T.lo != null && T.hi != null ? ", 두 점 사이에 선" : T.lo != null ? ", 오른쪽으로 선" : ", 왼쪽으로 선")] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const ans = st.pts.map(q => rg1F(q.v) + (q.inc ? "●" : "○")).join(",") + (st.line ? " 선" + st.line.map(v => isFinite(v) ? rg1F(v) : (v > 0 ? "→" : "←")).join("~") : " 선없음");
    const msg = (() => {
      if (!st.pts.length) return "수직선 위를 눌러 범위의 끝이 되는 수에 점을 찍어요.";
      const extra = st.pts.find(q => !want.pts.some(w => rg1Eq(w.v, q.v)));
      if (extra) return `${rg1J(rg1F(extra.v), "은/는")} 범위의 끝이 되는 수가 아니에요. 문제에 나온 수를 수직선에서 찾아 점을 찍어요.`;
      if (st.pts.length < want.pts.length) return "범위의 끝이 되는 수가 두 개예요. 점을 하나 더 찍어요.";
      for (const w of want.pts) {
        const q = st.pts.find(z => rg1Eq(z.v, w.v)); if (q.inc === w.inc) continue;
        const word = w.v === T.lo ? (T.loInc ? "이상" : "초과") : (T.hiInc ? "이하" : "미만");
        return w.inc ? `${rg1J("‘" + word + "’", "은/는")} ${rg1J(rg1F(w.v), "을/를")} 포함해요. 포함되는 수는 ●로 나타내요.` : `${rg1J("‘" + word + "’", "은/는")} ${rg1J(rg1F(w.v), "을/를")} 포함하지 않아요. 포함되지 않는 수는 ○로 나타내요.`;
      }
      if (!st.line) return "점을 찍었으면 ‘선 긋기’를 고르고 범위에 들어가는 쪽을 눌러 선을 그어요.";
      if (!(rg1Eq(st.line[0], want.line[0]) || (st.line[0] === -Infinity && want.line[0] === -Infinity)) || !(rg1Eq(st.line[1], want.line[1]) || (st.line[1] === Infinity && want.line[1] === Infinity))) {
        if (T.lo != null && T.hi != null) return "두 조건을 모두 만족하는 수는 두 점 사이에 있어요. 두 점 사이를 눌러 선을 그어요.";
        return T.lo != null ? `${rg1J("‘" + (T.loInc ? "이상" : "초과") + "’", "은/는")} ${rg1F(T.lo)}보다 큰 수 쪽이에요. 수직선에서 큰 수는 오른쪽에 있어요.` : `${rg1J("‘" + (T.hiInc ? "이하" : "미만") + "’", "은/는")} ${rg1F(T.hi)}보다 작은 수 쪽이에요. 수직선에서 작은 수는 왼쪽에 있어요.`;
      }
      return null;
    })();
    if (msg) return api.fail(msg, ans);
    api.done(name + " " + ans, o.ok || `${name}를 수직선에 바르게 나타냈어요.`);
  } }, "확인하기");
  host.append(tools, svg, read, h("div", { class: "actions" }, check));
}

/* ---------- 수 카드에 ○표·△표 ---------- */
function rg1Mark(host, api, o) {
  const st = o.vals.map(() => new Set());
  if (o.q) host.append(h("p", { class: "rg1q" }, o.q));
  const wrap = h("div", { class: "rg1marks" }), cells = [];
  const nm = mk => mk.name || rg1RName(mk);
  o.vals.forEach((v, i) => {
    const btns = o.marks.map((mk, j) => { const b = h("button", { class: mk.sym === "△" ? "rg1tri" : "", "aria-label": nm(mk), onclick: () => { st[i].has(j) ? st[i].delete(j) : st[i].add(j); b.classList.toggle("rg1on"); cell.classList.remove("rg1good", "rg1bad"); } }, mk.sym); return b; });
    const cell = h("div", { class: "rg1mk" }, o.labels ? h("small", {}, o.labels[i]) : null, h("b", {}, rg1F(v) + (o.unit ? " " + o.unit : "")), h("div", {}, ...btns));
    cells.push(cell); wrap.append(cell);
  });
  host.append(h("div", { class: "rg1small" }, o.marks.map(mk => `${mk.sym}: ${nm(mk)}`).join("   ·   ")), wrap);
  const right = o.marks.map(mk => o.vals.filter(v => rg1In(mk, v)));
  api.provide({ words: o.marks.map(nm), answers: o.marks.map((mk, j) => `${mk.sym}: ${right[j].map(rg1F).join(", ")}`) });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); let first = null;
    o.vals.forEach((v, i) => { let ok = true; o.marks.forEach((mk, j) => { if (rg1In(mk, v) !== st[i].has(j)) { ok = false; if (!first) first = { v, mk, i, j }; } }); cells[i].classList.remove("rg1good", "rg1bad"); if (st[i].size || !ok) cells[i].classList.add(ok ? "rg1good" : "rg1bad"); });
    const ans = o.marks.map((mk, j) => mk.sym + ":" + o.vals.filter((v, i) => st[i].has(j)).map(rg1F).join(",")).join(" / ");
    if (!first) return api.done(ans, o.ok);
    const { v, mk } = first, inR = rg1In(mk, v), name = nm(mk), vs = rg1F(v);
    const bound = [mk.lo, mk.hi].some(b => b != null && rg1Eq(b, v));
    let msg;
    const wd = rg1Eq(mk.lo, v) ? (mk.loInc ? "이상" : "초과") : (mk.hiInc ? "이하" : "미만");
    if (inR) msg = bound ? `${rg1J(vs, "은/는")} ${name}에 들어가요. ${rg1J("‘" + wd + "’", "은/는")} ${rg1J(vs, "과/와")} 같은 수도 포함해요.` : `${mk.sym}표를 하지 않은 수 중에 ${rg1J(name, "이/가")} 더 있어요.`;
    else msg = bound ? `${rg1J(vs, "은/는")} ${name}에 들어가지 않아요. ${rg1J("‘" + wd + "’", "은/는")} ${rg1J(vs, "을/를")} 포함하지 않아요.` : `${rg1J(vs, "은/는")} ${rg1J(name, "이/가")} 아니에요. ${mk.sym}표를 다시 살펴봐요.`;
    api.fail(msg, ans);
  } }, "확인하기")));
}

/* ---------- 카드 나누기 ---------- */
function rg1Sort(host, api, o) {
  const where = o.cards.map(() => -1); let pick = -1;
  if (o.q) host.append(h("p", { class: "rg1q" }, o.q));
  const tray = h("div", { class: "rg1tray" }), bins = o.bins.map(b => h("div", { class: "rg1bin" }, h("div", { class: "rg1bint" }, b), h("div", { class: "rg1in" })));
  const cardEls = o.cards.map((c, i) => h("button", { class: "rg1card", onclick: e => { e.stopPropagation(); pick = pick === i ? -1 : i; paint(); } }, c.t));
  function paint() {
    cardEls.forEach((el, i) => { el.classList.toggle("rg1pk", pick === i); (where[i] < 0 ? tray : bins[where[i]].lastChild).append(el); });
    bins.forEach(b => b.classList.toggle("rg1tgt", pick >= 0));
    if (!tray.children.length) tray.append(h("span", { class: "rg1small" }, "카드를 모두 옮겼어요.")); else [...tray.querySelectorAll("span.rg1small")].forEach(x => x.remove());
  }
  bins.forEach((b, k) => b.addEventListener("click", () => { if (pick < 0) return api.hint("먼저 카드를 누른 다음 넣을 칸을 눌러요."); where[pick] = k; cardEls[pick].classList.remove("rg1good", "rg1bad"); pick = -1; paint(); }));
  tray.addEventListener("click", () => { if (pick < 0) return; where[pick] = -1; pick = -1; paint(); });
  host.append(h("div", { class: "rg1small" }, "카드를 누르고, 넣을 칸을 눌러요. 잘못 넣은 카드는 다시 눌러 옮길 수 있어요."), tray, h("div", { class: "rg1bins" }, ...bins));
  paint();
  api.provide({ words: o.bins, answers: o.bins.map((b, k) => `${b}: ${o.cards.filter(c => c.b === k).map(c => c.t).join(", ") || "없음"}`) });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const ans = o.bins.map((b, k) => b + ":" + o.cards.filter((c, i) => where[i] === k).map(c => c.t).join(",")).join(" / ");
    if (where.some(w => w < 0)) return api.fail("아직 옮기지 않은 카드가 있어요. 카드를 모두 칸에 넣어요.", ans);
    let bad = -1; o.cards.forEach((c, i) => { const ok = where[i] === c.b; cardEls[i].classList.remove("rg1good", "rg1bad"); cardEls[i].classList.add(ok ? "rg1good" : "rg1bad"); if (!ok && bad < 0) bad = i; });
    if (bad < 0) return api.done(ans, o.ok);
    const c = o.cards[bad]; api.fail((c.why && c.why[where[bad]]) || c.why0 || o.bad || "빨간 카드를 다시 살펴봐요. 어느 범위에 들어가는지 경계의 수를 잘 살펴요.", ans);
  } }, "확인하기")));
}

/* ---------- 상자에 담기(올림) · 바꾸기(버림) ----------
   o={n,u,mode:"ceil"|"floor", item, unit, box, bu(상자 단위), q, read(k), ok} */
function rg1Pack(host, api, o) {
  const n = o.n, u = o.u, need = o.mode === "ceil" ? Math.ceil(n / u) : Math.floor(n / u), KM = Math.ceil(n / u) + 2, S = KM * u;
  let k = 0;
  if (o.q) host.append(h("p", { class: "rg1q" }, o.q));
  const W = 760, m = 30, X = v => m + v * (W - 2 * m) / S, svg = makeSvg(W, 150); svg.setAttribute("class", "rg1fig");
  const lay = svgEl("g"); svg.append(lay);
  const read = h("b", {});
  const lab = KM <= 12 ? u : KM <= 30 ? 5 * u : 10 * u;
  function draw() {
    lay.innerHTML = "";
    lay.append(txt(m, 14, o.boxName || o.box, 15, { "text-anchor": "start", fill: RG1C.blue }));
    for (let i = 0; i < k; i++) {
      const x0 = X(i * u), x1 = X((i + 1) * u), over = o.mode === "floor" && (i + 1) * u > n;
      lay.append(svgEl("rect", { x: x0 + 1, y: 24, width: Math.max(1, x1 - x0 - 2), height: 34, rx: 3, fill: over ? "#FBE7E2" : "#DCEAFB", stroke: over ? RG1C.red : RG1C.blue, "stroke-width": 2 }));
      if (x1 - x0 > 46) lay.append(txt((x0 + x1) / 2, 41, rg1F(u), 14, { fill: RG1C.blue }));
    }
    lay.append(txt(m, 72, o.itemName || o.item, 15, { "text-anchor": "start", fill: "#B5541C" }));
    lay.append(svgEl("rect", { x: X(0), y: 80, width: X(n) - X(0), height: 26, fill: "#F6C27A", stroke: "#B5541C", "stroke-width": 2 }));
    const cov = Math.min(k * u, n);
    if (cov < n) lay.append(svgEl("rect", { x: X(cov), y: 80, width: X(n) - X(cov), height: 26, fill: o.mode === "ceil" ? "#F4A3A3" : "#D5DBD9", stroke: o.mode === "ceil" ? RG1C.red : RG1C.gray, "stroke-width": 2, "stroke-dasharray": "5 3" }));
    if (k * u > n && o.mode === "ceil") lay.append(svgEl("rect", { x: X(n), y: 24, width: X(k * u) - X(n), height: 34, fill: "url(#rg1hatch)", opacity: .9 }));
    lay.append(svgEl("line", { x1: X(0), y1: 116, x2: X(S), y2: 116, stroke: RG1C.axis, "stroke-width": 1.5 }));
    for (let v = 0; v <= S + 1e-9; v += u) { const L = rg1Mult(v, lab); lay.append(svgEl("line", { x1: X(v), y1: 116 - (L ? 7 : 4), x2: X(v), y2: 116 + (L ? 7 : 4), stroke: RG1C.axis, "stroke-width": L ? 1.8 : 1 })); if (L) lay.append(txt(X(v), 134, rg1F(v), 13)); }
    lay.append(svgEl("line", { x1: X(n), y1: 76, x2: X(n), y2: 120, stroke: "#B5541C", "stroke-width": 2 }));
    read.textContent = o.read(k);
  }
  const defs = svgEl("defs"); defs.innerHTML = '<pattern id="rg1hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#9DC0EA" stroke-width="3"/></pattern>'; svg.prepend(defs);
  const set = d => { k = Math.max(0, Math.min(KM, k + d)); draw(); };
  const ctl = h("div", { class: "rg1ctl" }, h("button", { onclick: () => set(-10) }, "− 10"), h("button", { onclick: () => set(-1) }, "− 1"), h("button", { onclick: () => set(1) }, "+ 1"), h("button", { onclick: () => set(10) }, "+ 10"), read);
  host.append(svg, ctl); draw();
  api.provide({ words: [o.mode === "ceil" ? "최소" : "최대", o.box], answers: [o.read(need)] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = o.read(k);
    if (k === need) return api.done(ans, o.ok);
    if (o.mode === "ceil") api.fail(k * u < n ? `아직 ${rg1F(n - k * u)}${o.unit}${rg1Jong(o.unit) ? "이" : "가"} 남아요. ${o.lack || "모두 담을 수 있게 더 늘려요."}` : `${o.box} 하나를 빼도 ${o.item}${rg1Jong(o.item) ? "을" : "를"} 모두 ${o.verb || "담을"} 수 있어요. ‘최소’를 생각해요.`, ans);
    else api.fail(k * u > n ? `${o.item}${rg1Jong(o.item) ? "이" : "가"} 모자라요. ${rg1F(k * u)}${o.unit}${rg1Jong(o.unit) ? "이" : "가"} 있어야 해요.` : `남은 ${rg1J(rg1F(n - k * u) + o.unit, "으로/로")} 한 번 더 ${o.verb || "바꿀"} 수 있어요. ‘최대’를 생각해요.`, ans);
  } }, "확인하기")));
}

/* ---------- 자리 숫자를 눌러 올림·버림·반올림 ----------
   o.tasks=[{n:"243", m:"올림", p:1, unit:"개", pre:"호두과자 "}] */
function rg1Digits(host, api, o) {
  const rows = [];
  const wrap = h("div", { class: "rg1digs" });
  if (o.q) host.append(h("p", { class: "rg1q" }, o.q));
  if (o.fig) host.append(typeof o.fig === "function" ? o.fig() : o.fig);
  o.tasks.forEach(t => {
    const s = String(t.n), k = s.indexOf("."), L = k < 0 ? s.length : k, ans = rg1Rnd(s, t.m, t.p);
    const row = { t, ans, tap: o.tap === false, el: null };
    const num = h("div", { class: "rg1num" }), say = h("div", { class: "rg1say", hidden: true });
    const digs = [];
    [...s].forEach((ch, i) => {
      if (ch === ".") { num.append(h("span", { class: "rg1dot" }, ".")); return; }
      const ex = i < L ? L - 1 - i : -(i - L);
      const d = h("button", { class: "rg1d", "aria-label": rg1PL(ex) + " 숫자 " + ch, onclick: () => {
        if (row.tap && o.tap === false) return;
        if (ex !== t.p) { api.hint(`그 숫자 ${rg1J(ch, "은/는")} ${rg1PL(ex)} 숫자예요. ${rg1PL(t.p)} 숫자를 찾아 눌러요.`); return; }
        row.tap = true; digs.forEach(z => { z.d.classList.toggle("rg1tgt", z.ex === t.p); z.d.classList.toggle("rg1low", z.ex < t.p); });
        const V = Math.round(+s * 1000), U = Math.round(Math.pow(10, t.p + 3)), below = (V % U) / 1000, next = s[i + 1] === "." ? s[i + 2] : s[i + 1];
        const unitV = rg1F(Math.pow(10, t.p));
        say.hidden = false;
        say.textContent = t.m === "올림" ? (below ? `${rg1PL(t.p)} 아래 수 ${rg1J(rg1F(below), "을/를")} ${rg1J(unitV, "으로/로")} 생각해서 올려요.` : `${rg1PL(t.p)} 아래 수가 모두 0이라 그대로예요.`)
          : t.m === "버림" ? (below ? `${rg1PL(t.p)} 아래 수 ${rg1J(rg1F(below), "을/를")} 0으로 생각해서 버려요.` : `${rg1PL(t.p)} 아래 수가 모두 0이라 그대로예요.`)
          : `바로 아래 자리인 ${rg1PL(t.p - 1)} 숫자가 ${rg1J(next, "이에요/예요")}. ${+next >= 5 ? "5, 6, 7, 8, 9이니 올려요." : "0, 1, 2, 3, 4이니 버려요."}`;
        if (o.noSay) say.hidden = true;
      } }, h("span", {}, ch), ex < 0 ? h("small", {}, "소수", h("br"), rg1PN(ex).slice(3)) : h("small", {}, rg1PN(ex)));
      digs.push({ d, ex }); num.append(d);
    });
    const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "어림한 수" });
    row.inp = inp;
    row.el = h("div", { class: "rg1row" }, h("div", { class: "jua" }, `${t.pre || ""}${rg1J(s, "을/를")} ${t.m}하여 ${rg1PL(t.p)}까지 나타내요.`),
      o.tap === false ? null : h("div", { class: "rg1small" }, `${rg1PL(t.p)} 숫자를 눌러요.`), num, say,
      h("div", { class: "rg1ans" }, h("span", {}, "→"), inp, t.unit ? h("span", {}, t.unit) : null));
    rows.push(row); wrap.append(row.el);
  });
  host.append(wrap);
  api.provide({ words: [...new Set(o.tasks.map(t => t.m))].concat(["구하려는 자리"]), answers: rows.map(r => `${r.t.n} → ${rg1F(r.ans)}${r.t.unit || ""}`) });
  const whyOf = (t, w) => {
    if (rg1Eq(w, +t.n)) return `${rg1J(String(t.n), "을/를")} 그대로 썼어요. ${rg1PL(t.p)} 아래 수를 어떻게 할지 생각해요.`;
    for (const m of ["올림", "버림", "반올림"]) if (m !== t.m && rg1Eq(rg1Rnd(t.n, m, t.p), w) && !rg1Eq(rg1Rnd(t.n, t.m, t.p), w)) return `${rg1J(rg1F(w), "은/는")} ${m}한 값이에요. ${t.m === "올림" ? "올림은 아래 수를 올려서" : t.m === "버림" ? "버림은 아래 수를 버려서" : "반올림은 바로 아래 자리 숫자를 보고"} 나타내요.`;
    for (let p = -3; p <= 6; p++) if (p !== t.p && rg1Eq(rg1Rnd(t.n, t.m, p), w) && rg1Low(t.n) < p) return `${rg1J(rg1F(w), "은/는")} ${rg1PL(p)}까지 나타낸 수예요. ${rg1PL(t.p)}까지 나타내요.`;
    return null;
  };
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); let msg = null;
    const ans = rows.map(r => r.inp.value.trim() || "-").join(" / ");
    rows.forEach(r => {
      const w = rg1Num(r.inp.value), ok = rg1Eq(w, r.ans);
      r.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)";
      if (!msg && !r.tap) msg = `먼저 ‘${r.t.n}’에서 ${rg1PL(r.t.p)} 숫자를 눌러 살펴봐요.`;
      if (!msg && !ok) msg = isNaN(w) ? "빈칸에 수를 써요." : (whyOf(r.t, w) || `${r.t.m}의 뜻을 다시 생각해요.`);
    });
    if (msg) return api.fail(msg, ans);
    api.done(ans, o.ok);
  } }, "확인하기")));
}

/* ---------- 롤러코스터 수직선(반올림) ----------
   o={a,b,v,step(눈금),snap,tol,unit,q,ok} */
function rg1Coaster(host, api, o) {
  const a = o.a, b = o.b, U = b - a, step = o.step || U / 10, snap = o.snap || step, tol = o.tol == null ? 0 : o.tol;
  const W = 760, m = 60, Y = 206, X = v => m + (v - a) * (W - 2 * m) / U, V = x => a + (x - m) * U / (W - 2 * m);
  const yC = t => Y - 26 - 120 * Math.pow(Math.sin(Math.PI * t), 2);
  if (o.q) host.append(h("p", { class: "rg1q" }, o.q));
  const svg = makeSvg(W, 250); svg.setAttribute("class", "rg1fig"); svg.style.cursor = "pointer";
  const g = svgEl("g"), lay = svgEl("g"), hov = svgEl("g"); svg.append(g, lay, hov);
  let d = ""; for (let i = 0; i <= 80; i++) { const t = i / 80; d += (i ? "L" : "M") + X(a + t * U).toFixed(1) + "," + yC(t).toFixed(1); }
  g.append(svgEl("path", { d, fill: "none", stroke: "#B9A68A", "stroke-width": 6, "stroke-linecap": "round" }));
  for (let i = 1; i < 10; i++) { const t = i / 10; g.append(svgEl("line", { x1: X(a + t * U), y1: yC(t) + 3, x2: X(a + t * U), y2: Y - 10, stroke: "#D8CBB4", "stroke-width": 2 })); }
  g.append(txt(X(a + U / 2), yC(.5) - 18, "꼭대기", 14, { fill: "#8C6F4E" }));
  g.append(svgEl("line", { x1: X(a) - 30, y1: Y, x2: X(b) + 30, y2: Y, stroke: RG1C.axis, "stroke-width": 2.5 }));
  const n = Math.round(U / step);
  for (let i = 0; i <= n; i++) { const v = a + i * step, L = i === 0 || i === n || i * 2 === n; g.append(svgEl("line", { x1: X(v), y1: Y - (L ? 12 : 7), x2: X(v), y2: Y + (L ? 12 : 7), stroke: RG1C.axis, "stroke-width": L ? 2.2 : 1.3 })); if (L) g.append(txt(X(v), Y + 30, rg1F(v), 17)); }
  const ctl = h("div", { class: "rg1ctl" }), info = h("div", { class: "rg1small" }, `수직선을 눌러 ${rg1F(o.v)}의 자리에 ↓를 놓아요. 손을 올리면 그 자리의 수가 보여요.`);
  let placed = false, busy = false;
  const snapV = x => Math.max(a, Math.min(b, Math.round(Math.round((V(x) - a) / snap) * snap * 1e6) / 1e6 + a));
  svg.addEventListener("pointermove", e => { if (placed) return; const p = svgPt(svg, e); hov.innerHTML = ""; if (p.x < X(a) - 10 || p.x > X(b) + 10) return; const v = snapV(p.x); hov.append(svgEl("line", { x1: X(v), y1: Y - 30, x2: X(v), y2: Y, stroke: RG1C.blue, opacity: .6 }), txt(X(v), 14, rg1F(v), 15, { fill: RG1C.blue })); });
  svg.addEventListener("pointerleave", () => { hov.innerHTML = ""; });
  const ball = (t) => { lay.querySelectorAll(".rg1ball").forEach(x => x.remove()); const c = svgEl("circle", { class: "rg1ball", cx: X(a + t * U), cy: yC(t) - 11, r: 11, fill: RG1C.red, stroke: "#fff", "stroke-width": 2 }); lay.append(c); };
  svg.addEventListener("pointerdown", e => {
    if (placed || busy) return; const p = svgPt(svg, e); if (p.x < X(a) - 12 || p.x > X(b) + 12) return;
    const v = snapV(p.x); lay.innerHTML = "";
    const ok = Math.abs(v - o.v) <= tol + 1e-9, x = X(ok ? o.v : v);
    lay.append(svgEl("path", { d: `M${x},${Y - 40} v28 m-8,-10 l8,10 l8,-10`, fill: "none", stroke: ok ? RG1C.blue : RG1C.gray, "stroke-width": 3 }), txt(x, Y - 50, rg1F(ok ? o.v : v), 16, { fill: ok ? RG1C.blue : RG1C.gray }));
    if (!ok) return api.hint(`↓를 놓은 곳은 ${rg1F(v)}예요. ${rg1F(o.v)}의 자리를 다시 찾아 눌러요.`);
    placed = true; hov.innerHTML = ""; ball((o.v - a) / U);
    info.textContent = `${rg1F(o.v)}에 공을 올려놓았어요. 공은 어느 쪽 골짜기로 굴러갈까요? (더 가까운 쪽을 골라요.)`;
    ctl.append(h("button", { onclick: () => pickSide(a) }, `← ${rg1F(a)} 쪽`), h("button", { onclick: () => pickSide(b) }, `${rg1F(b)} 쪽 →`));
  });
  function pickSide(s) {
    if (busy) return; api.tryOnce();
    const right = (o.v - a) * 2 >= U ? b : a;
    if (s !== right) return api.fail(`${rg1F(o.v)}에서 ${rg1F(s)}까지는 ${rg1F(Math.abs(o.v - s))}, ${rg1F(right)}까지는 ${rg1F(Math.abs(o.v - right))}만큼 떨어져 있어요. 더 가까운 쪽으로 굴러가요.`, rg1F(s));
    busy = true; let t = (o.v - a) / U; const goal = s === a ? 0 : 1;
    const tick = () => { t += (goal - t) * .18; if (Math.abs(goal - t) < .004) t = goal; ball(t); if (t !== goal) requestAnimationFrame(tick); else api.done(`${rg1F(o.v)} → ${rg1F(s)}`, o.ok || `${rg1J(rg1F(o.v), "은/는")} ${rg1F(s)}에 더 가까워요.`); };
    tick();
  }
  api.provide({ words: ["더 가까운 쪽"], answers: [`${rg1J(rg1F(o.v), "은/는")} ${rg1F((o.v - a) * 2 >= U ? b : a)}에 더 가까워요.`] });
  host.append(svg, info, ctl);
}

/* ---------- 자물쇠 ---------- */
function rg1Lock(host, api, o) {
  const d = [0, 0, 0];
  const show = d.map(() => h("b", {}, "0"));
  host.append(h("div", { class: "rg1lock" }, ...d.map((_, i) => h("div", { class: "rg1dial" },
    h("button", { "aria-label": "올리기", onclick: () => { d[i] = (d[i] + 1) % 10; show[i].textContent = d[i]; } }, "▲"), show[i],
    h("button", { "aria-label": "내리기", onclick: () => { d[i] = (d[i] + 9) % 10; show[i].textContent = d[i]; } }, "▼")))));
  api.provide({ words: ["버림", "십의 자리"], answers: ["비밀번호 " + o.ans] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const v = d[0] * 100 + d[1] * 10 + d[2];
    if (v === o.ans) return api.done(String(v), o.ok);
    api.fail(o.why(v), String(v));
  } }, "🔓 열어 보기")));
}

/* ---------- 택배 요금 ---------- */
const RG1FEE = [{ w: [null, 2], s: [null, 60], f: 6000 }, { w: [2, 10], s: [60, 120], f: 7000 }, { w: [10, 20], s: [120, 140], f: 8000 }, { w: [20, 30], s: [140, 160], f: 9000 }];
const rg1FeeTxt = (r, u) => r[0] == null ? `${r[1]} ${u} 이하` : `${r[0]} ${u} 초과 ${r[1]} ${u} 이하`;
const rg1FeeRow = (key, v) => RG1FEE.findIndex(r => (r[key][0] == null || v > r[key][0]) && v <= r[key][1]);
function rg1BoxFig(o) {
  const svg = makeSvg(360, 210); svg.setAttribute("class", "rg1fig"); svg.style.maxWidth = "17em";
  const P = (pts, f) => svgEl("polygon", { points: pts.map(p => p.join(",")).join(" "), fill: f, stroke: "#8C6F4E", "stroke-width": 2.5, "stroke-linejoin": "round" });
  svg.append(P([[60, 80], [230, 80], [230, 180], [60, 180]], "#E8C9A0"), P([[60, 80], [120, 40], [290, 40], [230, 80]], "#F2DAB8"), P([[230, 80], [290, 40], [290, 140], [230, 180]], "#D9B385"));
  svg.append(svgEl("line", { x1: 145, y1: 80, x2: 205, y2: 40, stroke: "#C9A16F", "stroke-width": 6 }));
  if (o.e) {
    svg.append(txt(145, 198, `㉠ ${o.e[0]} cm`, 16), txt(318, 92, "㉢", 16), txt(318, 112, `${o.e[2]} cm`, 15), txt(300, 18, `㉡ ${o.e[1]} cm`, 16));
  } else svg.append(txt(145, 198, `크기 ${o.size} cm`, 16));
  svg.append(svgEl("rect", { x: 20, y: 120, width: 92, height: 40, rx: 8, fill: "#fff", stroke: RG1C.blue, "stroke-width": 2 }), txt(66, 141, `${o.kg} kg`, 18, { fill: RG1C.blue }));
  svg.append(txt(175, 132, o.name || "", 18, { fill: "#6B4A2A" }));
  return svg;
}
function rg1FeeTable(pick) {
  const tb = h("table"), cells = { w: [], s: [] };
  tb.append(h("tr", {}, h("th", {}, "무게"), h("th", {}, "크기(세 변의 합)"), h("th", {}, "요금")));
  RG1FEE.forEach((r, i) => {
    const cw = h("td", { class: pick ? "rg1cell" : "" }, rg1FeeTxt(r.w, "kg")), cs = h("td", { class: pick ? "rg1cell" : "" }, rg1FeeTxt(r.s, "cm"));
    cells.w.push(cw); cells.s.push(cs); tb.append(h("tr", {}, cw, cs, h("td", {}, `${r.f}원`)));
  });
  return { el: h("div", { class: "rg1tbl" }, tb), cells };
}
function rg1Fee(host, api, o) {
  const size = o.e ? o.e[0] + o.e[1] + o.e[2] : o.size, wr = rg1FeeRow("w", o.kg), sr = rg1FeeRow("s", size), fee = Math.max(RG1FEE[wr].f, RG1FEE[sr].f);
  const sel = { w: -1, s: -1 };
  if (o.q) host.append(h("p", { class: "rg1q" }, o.q));
  host.append(rg1BoxFig(o));
  const sizeIn = h("input", { type: "text", inputmode: "numeric", style: "width:5em;font-size:1.1em;text-align:center", "aria-label": "상자의 크기" });
  if (o.e) host.append(h("p", { class: "sent" }, `상자의 크기: ${o.e[0]} + ${o.e[1]} + ${o.e[2]} = `, sizeIn, " cm"));
  host.append(h("div", { class: "rg1small" }, `요금표에서 무게(${o.kg} kg)가 속하는 칸과 크기가 속하는 칸을 하나씩 눌러요.`));
  const T = rg1FeeTable(true); host.append(T.el);
  ["w", "s"].forEach(key => T.cells[key].forEach((c, i) => c.addEventListener("click", () => { sel[key] = i; T.cells[key].forEach((x, j) => { x.classList.toggle("rg1pk", j === i); x.classList.remove("rg1good", "rg1bad"); }); })));
  const feeIn = h("input", { type: "text", inputmode: "numeric", style: "width:6em;font-size:1.1em;text-align:center", "aria-label": "택배 요금" });
  host.append(h("p", { class: "sent" }, `${o.name || "상자"}의 택배 요금: `, feeIn, " 원"));
  api.provide({ words: ["더 높은 요금", rg1FeeTxt(RG1FEE[wr].w, "kg"), rg1FeeTxt(RG1FEE[sr].s, "cm")], answers: [`${o.e ? `크기 ${size} cm, ` : ""}무게 ${RG1FEE[wr].f}원, 크기 ${RG1FEE[sr].f}원 → ${fee}원`] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const sv = rg1Num(sizeIn.value), fv = rg1Num(feeIn.value);
    const ans = `${o.e ? "크기 " + (sizeIn.value || "-") + " / " : ""}무게칸 ${sel.w + 1} / 크기칸 ${sel.s + 1} / ${feeIn.value || "-"}원`;
    const mark = (key, ok) => { if (sel[key] >= 0) T.cells[key][sel[key]].classList.add(ok ? "rg1good" : "rg1bad"); };
    if (o.e && sv !== size) { sizeIn.style.borderColor = "var(--no)"; return api.fail("상자의 크기는 ㉠, ㉡, ㉢ 세 길이를 모두 더해서 구해요.", ans); }
    if (o.e) sizeIn.style.borderColor = "var(--ok)";
    if (sel.w < 0 || sel.s < 0) return api.fail("요금표에서 무게 칸과 크기 칸을 하나씩 눌러요.", ans);
    mark("w", sel.w === wr); mark("s", sel.s === sr);
    if (sel.w !== wr) return api.fail(`${o.kg} kg은 ‘${rg1FeeTxt(RG1FEE[sel.w].w, "kg")}’에 들어가지 않아요. ‘초과’는 그 수를 포함하지 않고, ‘이하’는 포함해요.`, ans);
    if (sel.s !== sr) return api.fail(`${size} cm는 ‘${rg1FeeTxt(RG1FEE[sel.s].s, "cm")}’에 들어가지 않아요. 경계의 수를 포함하는지 살펴봐요.`, ans);
    if (fv !== fee) { feeIn.style.borderColor = "var(--no)"; return api.fail(RG1FEE[wr].f !== RG1FEE[sr].f && fv === Math.min(RG1FEE[wr].f, RG1FEE[sr].f) ? "무게에 따른 요금과 크기에 따른 요금이 다르면 더 높은 요금으로 정해요." : "고른 두 칸의 요금을 살펴보고, 다르면 더 높은 요금을 써요.", ans); }
    feeIn.style.borderColor = "var(--ok)";
    api.done(ans, o.ok || `무게 ${RG1FEE[wr].f}원, 크기 ${RG1FEE[sr].f}원이라 택배 요금은 ${fee}원이에요.`);
  } }, "확인하기")));
}

/* ---------- 수 카드로 수 만들기 ----------
   o={cards:[3,5,8], tasks:[{q, kind:"best"|"all", ok:n=>bool, cmp:"max"|"min", show:n=>글}]} */
function rg1Cards(host, api, o) {
  const perms = []; const go = (pre, rest) => { if (!rest.length) return perms.push(+pre.join("")); rest.forEach((c, i) => go(pre.concat(c), rest.filter((_, j) => j !== i))); }; go([], o.cards);
  let ti = 0, cur = [], found = new Set();
  const qEl = h("p", { class: "rg1q" }), shown = h("div", { class: "rg1read" }), made = h("div", { class: "rg1made" }), msg = h("div", { class: "rg1small" });
  const btns = o.cards.map((c, i) => h("button", { onclick: () => { if (cur.includes(i)) return; cur.push(i); paint(); } }, String(c)));
  const row = h("div", { class: "rg1cards" }, ...btns);
  const paint = () => { btns.forEach((b, i) => { b.disabled = cur.includes(i); }); shown.textContent = "만든 수: " + (cur.map(i => o.cards[i]).join("") || "□□□".slice(0, o.cards.length)); };
  const T = () => o.tasks[ti];
  const target = t => { const ok = perms.filter(t.ok); return t.kind === "all" ? ok : [t.cmp === "max" ? Math.max(...ok) : Math.min(...ok)]; };
  function start() { cur = []; found = new Set(); made.innerHTML = ""; qEl.textContent = T().q; paint(); msg.textContent = T().kind === "all" ? "카드를 눌러 수를 만들고 ‘이 수 넣기’를 눌러요. 조건에 맞는 수를 모두 찾아요." : "카드를 눌러 수를 만들고 ‘이 수로 확인’을 눌러요."; sub.textContent = T().kind === "all" ? "이 수 넣기" : "이 수로 확인"; }
  const sub = h("button", { class: "big", onclick: () => {
    if (cur.length < o.cards.length) return api.hint("카드를 모두 한 번씩 써서 수를 만들어요.");
    const v = +cur.map(i => o.cards[i]).join(""), t = T(), tg = target(t); api.tryOnce();
    if (t.kind === "all") {
      if (!t.ok(v)) { api.fail(`${v}${t.show ? " → " + t.show(v) : ""}. 조건에 맞지 않아요.`, String(v)); cur = []; paint(); return; }
      if (!found.has(v)) { found.add(v); made.append(h("span", {}, String(v))); }
      cur = []; paint();
      if (found.size < tg.length) return api.hint(`${v}${t.show ? " → " + t.show(v) : ""}. 조건에 맞아요! 다른 수도 만들어 봐요.`);
    } else {
      if (v !== tg[0]) { api.fail(!t.ok(v) ? `${v}${rg1Jong(String(v)) ? "은" : "는"} 조건에 맞지 않아요.` : `${v}${rg1Jong(String(v)) ? "은" : "는"} 조건에 맞지만 ${t.cmp === "max" ? "더 큰" : "더 작은"} 수를 만들 수 있어요.`, String(v)); cur = []; paint(); return; }
    }
    if (ti < o.tasks.length - 1) { api.hint(`○ ${t.kind === "all" ? [...found].join(", ") : v} — 맞아요! 아래 문제도 이어서 해 봐요.`); ti++; start(); return; }
    api.done(t.kind === "all" ? [...found].join(", ") : String(v), o.ok);
  } });
  host.append(qEl, row, shown, h("div", { class: "rg1ctl" }, h("button", { onclick: () => { cur = []; paint(); } }, "↺ 다시 만들기")), made, msg, h("div", { class: "actions" }, sub));
  api.provide({ words: ["수 카드"], answers: o.tasks.map(t => t.q + " " + target(t).join(", ")) });
  start();
}

/* ---------- 문장 쓰기(낱말 두 개 이상 사용) ---------- */
function rg1Say(host, api, o) {
  const t = h("textarea", { placeholder: o.ph || "여기에 써요" });
  host.append(h("div", { class: "rg1say2" }, h("div", { class: "jua" }, o.q), t));
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const v = t.value.trim(), used = o.words.filter(w => v.includes(w));
    api.tryOnce();
    if (v.length < 8) return api.fail("상황을 조금 더 자세히 써 봐요.", v);
    if (used.length < (o.need || 2)) return api.fail(`${o.words.map(w => "‘" + w + "’").join(", ")} 중에서 ${o.need || 2}개를 넣어 써요. 지금은 ${used.length}개를 썼어요.`, v);
    if (!/[0-9]/.test(v)) return api.fail("범위의 기준이 되는 수도 함께 써요.", v);
    api.done(v, o.ok);
  } }, "다 썼어요")));
}

/* ---------- 농산물 축제 그림 ---------- */
const RG1FEST = [
  { id: "gate", name: "축제 입구", say: "방문자 수 기계에 ‘오늘 방문자 3482명’이 떠 있어요. 정우: “방문자 수를 어림하여 시청자들에게 전달하면 좋을 텐데….”" },
  { id: "apple", name: "사과 매장", say: "상인: “무게가 180 g과 같거나 무거운 사과만 골라 진열해요.” (180 g, 170 g, 181 g, 179 g, 183 g …)" },
  { id: "jige", name: "농기구 체험장(지게 체험)", say: "안내판: “안전을 위해 키가 110 cm보다 큰 사람만 지게 체험에 참여할 수 있어요.”" },
  { id: "walnut", name: "호두과자 판매장", say: "점원: “호두과자를 10개씩 담은 상자와 100개씩 담은 상자로 팔아요.”" },
  { id: "gift", name: "기념품 받는 곳", say: "안내 직원: “스티커 10개는 사과주스 1병, 스티커 100개는 모자 1개로 바꿀 수 있어요.”" },
  { id: "mush", name: "버섯 매장", say: "주인: “어제 판매액은 4836200원이었고, 오늘 예상 판매액은 5370000원이에요.”" },
  { id: "pie", name: "사과파이 판매점", say: "점원: “사과파이를 한 상자에 10개씩 담아 판매하고 있어요.”" },
  { id: "bus", name: "축제 버스 정류장", say: "기사님: “버스를 한 번 운행할 때 10명씩 탈 수 있어요.”" }];
function rg1FestSvg(onPick) {
  const svg = makeSvg(880, 470); svg.setAttribute("class", "rg1fig");
  svg.append(svgEl("rect", { x: 0, y: 0, width: 880, height: 470, fill: "#EAF5FB" }), svgEl("rect", { x: 0, y: 70, width: 880, height: 400, fill: "#E5F1D9" }));
  svg.append(svgEl("rect", { x: 240, y: 10, width: 400, height: 46, rx: 23, fill: "#fff", stroke: RG1C.org, "stroke-width": 3 }), txt(440, 34, "우리 마을 농산물 축제", 24, { fill: "#B5541C" }));
  const els = {};
  RG1FEST.forEach((f, i) => {
    const cx = 110 + (i % 4) * 220, top = 82 + Math.floor(i / 4) * 192, g = svgEl("g", { class: "rg1spot", tabindex: 0, role: "button", "aria-label": f.name });
    const col = ["#E47A38", "#D64545", "#7A5BB0", "#A0672E", "#2B7BD6", "#6B7B78", "#C24C7A", "#2E8B57"][i];
    const card = svgEl("rect", { x: cx - 100, y: top, width: 200, height: 176, rx: 14, fill: "#fff", stroke: "#C9D6D1", "stroke-width": 2.5 });
    g.append(card);
    g.append(svgEl("path", { d: `M${cx - 92},${top + 40} L${cx - 80},${top + 10} H${cx + 80} L${cx + 92},${top + 40} Z`, fill: col, opacity: .85 }));
    for (let k = 0; k < 6; k++) g.append(svgEl("path", { d: `M${cx - 92 + k * 30.7},${top + 40} q15.3,12 30.7,0`, fill: col }));
    g.append(txt(cx, top + 27, f.name.replace("(지게 체험)", ""), 15, { fill: "#fff" }));
    const ic = svgEl("g", { transform: `translate(${cx},${top + 104})` });
    const C = (x, y, r, fill, st) => svgEl("circle", { cx: x, cy: y, r, fill, stroke: st || "none", "stroke-width": 2 });
    const R = (x, y, w, hh, fill, st, rx) => svgEl("rect", { x, y, width: w, height: hh, rx: rx || 3, fill, stroke: st || "none", "stroke-width": 2 });
    if (f.id === "gate") { ic.append(R(-62, -34, 124, 56, "#24323A", "#111", 8), txt(0, -6, "3482", 30, { fill: "#7CF29A", "font-family": "monospace" }), txt(0, 40, "방문자 수", 14, { fill: "#4A5A57" })); }
    if (f.id === "apple") { [[-40, 0], [-12, -6], [16, 2], [44, -4]].forEach(([x, y]) => ic.append(C(x, y, 14, "#E0473B", "#A12A20"), svgEl("line", { x1: x, y1: y - 14, x2: x + 3, y2: y - 22, stroke: "#5B3A1E", "stroke-width": 2.5 }))); ic.append(R(-60, 16, 120, 12, "#C9A16F"), txt(0, 46, "180 g 이상만", 14, { fill: "#A12A20" })); }
    if (f.id === "jige") { ic.append(svgEl("path", { d: "M-20,30 L-6,-40 M20,30 L6,-40 M-16,10 H16 M-12,-12 H12", stroke: "#8C6F4E", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }), R(36, -44, 16, 74, "#fff", "#7A5BB0"), svgEl("line", { x1: 30, y1: -20, x2: 58, y2: -20, stroke: RG1C.red, "stroke-width": 3 }), txt(-50, -20, "110 cm", 13, { fill: "#7A5BB0" }), txt(0, 46, "키 110 cm 초과", 14, { fill: "#7A5BB0" })); }
    if (f.id === "walnut") { ic.append(R(-60, -26, 54, 40, "#F2DAB8", "#A0672E"), R(6, -36, 54, 50, "#F2DAB8", "#A0672E"), txt(-33, -6, "10개", 14, { fill: "#6B4A2A" }), txt(33, -11, "100개", 14, { fill: "#6B4A2A" })); for (let k = 0; k < 4; k++) ic.append(C(-48 + k * 8, 24, 4, "#A0672E")); ic.append(txt(0, 46, "상자로 팔아요", 14, { fill: "#6B4A2A" })); }
    if (f.id === "gift") { ic.append(R(-58, -30, 26, 44, "#FFE08A", "#C99A1A", 6), svgEl("path", { d: "M8,4 a26,22 0 0 1 52,0 z", fill: "#2B7BD6" }), R(4, 2, 60, 8, "#1E5FA8", null, 3), txt(-2, -18, "→", 18), txt(0, 46, "스티커 10개·100개", 14, { fill: "#1E5FA8" })); }
    if (f.id === "mush") { [[-34, 0], [0, -8], [34, 0]].forEach(([x, y]) => ic.append(R(x - 6, y, 12, 22, "#F5EBDD", "#B9A68A"), svgEl("path", { d: `M${x - 22},${y + 2} a22,18 0 0 1 44,0 z`, fill: "#A86B3C" }))); ic.append(txt(0, 46, "판매액 4836200원", 14, { fill: "#4A5A57" })); }
    if (f.id === "pie") { ic.append(svgEl("path", { d: "M-46,14 a46,34 0 0 1 92,0 z", fill: "#E9B562", stroke: "#A0672E", "stroke-width": 2 }), svgEl("path", { d: "M-30,4 l14,-14 M-6,0 l14,-14 M18,4 l14,-14", stroke: "#A0672E", "stroke-width": 2.5 }), R(-56, 14, 112, 10, "#C9A16F"), txt(0, 46, "한 상자에 10개", 14, { fill: "#A0672E" })); }
    if (f.id === "bus") { ic.append(R(-62, -32, 124, 50, "#2E8B57", "#1E5E3B", 10), ...[-44, -18, 8].map(x => R(x, -24, 20, 16, "#DCEAFB")), C(-38, 20, 9, "#333"), C(38, 20, 9, "#333"), txt(0, 46, "한 번에 10명", 14, { fill: "#1E5E3B" })); }
    g.append(ic);
    const mark = svgEl("g", { visibility: "hidden" }); mark.append(C(cx + 82, top + 58, 13, RG1C.green), txt(cx + 82, top + 59, "✓", 16, { fill: "#fff" })); g.append(mark);
    const fire = () => { card.setAttribute("stroke", RG1C.green); mark.setAttribute("visibility", "visible"); onPick(i); };
    g.addEventListener("click", fire); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") fire(); });
    els[f.id] = g; svg.append(g);
  });
  return svg;
}
function rg1Fest(host, api, o) {
  const seen = new Set(), msg = h("div", { class: "rg1msg" }, "그림에서 축제의 여러 곳을 눌러 정우와 함께 둘러봐요."), cnt = h("div", { class: "rg1small" }, `둘러본 곳: 0 / ${RG1FEST.length}`);
  host.append(rg1FestSvg(i => { seen.add(i); msg.textContent = `${RG1FEST[i].name} · ${RG1FEST[i].say}`; cnt.textContent = `둘러본 곳: ${seen.size} / ${RG1FEST.length}`; if (seen.size === RG1FEST.length && !o.ask) api.done("축제 둘러보기", o.ok); if (seen.size === RG1FEST.length && o.ask && !askBox.children.length) { askBox.hidden = false; api.hint("○ 축제를 모두 둘러봤어요. 아래 물음에 답해 봐요."); rg1Ask(askBox, api, o.ask, { ok: o.ok }); } }), msg, cnt);
  const askBox = h("div", { class: "rg1part", hidden: true }); host.append(askBox);
  api.provide({ words: RG1FEST.map(f => f.name), answers: [] });
}

/* ---------- 놀이: 알쏭달쏭 수를 잡아요 ----------
   칠판의 답 쪽지(교과서 그림): 400, 420, 1230, 2000, 425, 600, 680, 1000, 530, 450, 427, 430, 500, 500
   교과서 그림에 문제가 없어 이 자료에서 문제를 지었어요(올림 5 · 버림 5 · 반올림 4). 답은 화면을 그릴 때 다시 계산해 검사해요. */
const RG1BOARD = [400, 420, 1230, 2000, 425, 600, 680, 1000, 530, 450, 427, 430, 500, 500];
const RG1GAME = [
  { n: "437", m: "버림", p: 2 }, { n: "416", m: "올림", p: 1 }, { n: "1234", m: "반올림", p: 1 }, { n: "2345", m: "버림", p: 3 },
  { n: "424.6", m: "반올림", p: 0 }, { n: "512", m: "올림", p: 2 }, { n: "689", m: "버림", p: 1 }, { n: "1080", m: "버림", p: 2 },
  { n: "521", m: "올림", p: 1 }, { n: "457", m: "버림", p: 1 }, { n: "426.1", m: "올림", p: 0 }, { n: "434", m: "반올림", p: 1 },
  { n: "409", m: "올림", p: 2 }, { n: "549", m: "반올림", p: 2 }];
(function () { RG1GAME.forEach((g, i) => { if (!rg1Eq(rg1Rnd(g.n, g.m, g.p), RG1BOARD[i])) throw new Error("놀이 문제 답이 칠판과 달라요: " + g.n); }); })();
const rg1GQ = g => `${rg1J(g.n, "을/를")} ${g.m}하여 ${rg1PL(g.p)}까지 나타내면?`;
function rg1Game(host, api, o) {
  const notes = RG1BOARD.map((v, i) => ({ v, i, gone: false }));
  let basket = RG1GAME.map((g, i) => i).sort(() => Math.random() - .5), cur = -1, turn = 0, score = [0, 0], solved = 0;
  const sc = [h("span", {}, ""), h("span", {}, "")], prob = h("div", { class: "rg1prob" }, "바구니에서 문제 쪽지를 뽑아요.");
  const board = h("div", { class: "rg1notes" }), left = h("div", { class: "rg1small" });
  const btns = notes.map(nt => { const b = h("button", { class: "rg1note", onclick: () => pick(nt, b) }, String(nt.v)); board.append(b); return b; });
  const drawBtn = h("button", { class: "big", onclick: () => { if (cur >= 0) return api.hint("먼저 지금 문제의 답 쪽지를 칠판에서 찾아요."); cur = basket.shift(); prob.textContent = `${turn ? "나" : "가"} 모둠 문제 · ${rg1GQ(RG1GAME[cur])}`; paint(); } }, "🧺 바구니에서 문제 뽑기");
  function paint() { sc[0].textContent = `가 모둠 ${score[0]}점`; sc[1].textContent = `나 모둠 ${score[1]}점`; sc.forEach((s, i) => s.classList.toggle("rg1turn", i === turn)); left.textContent = `바구니에 남은 문제: ${basket.length + (cur >= 0 ? 1 : 0)}장 · 맞힌 문제: ${solved} / ${RG1GAME.length}`; drawBtn.disabled = cur >= 0; }
  function pick(nt, b) {
    if (cur < 0) return api.hint("먼저 바구니에서 문제를 뽑아요.");
    const g = RG1GAME[cur], right = rg1Rnd(g.n, g.m, g.p); api.tryOnce();
    if (rg1Eq(nt.v, right)) {
      score[turn]++; solved++; nt.gone = true; b.classList.add("rg1gone");
      api.hint(`○ ${rg1GQ(g).replace("나타내면?", "나타내면")} ${rg1J(rg1F(right), "이에요/예요")}. ${turn ? "나" : "가"} 모둠 1점!`);
    } else {
      basket.push(cur);
      api.fail(`${rg1J(String(nt.v), "은/는")} 답이 아니에요. ${g.m === "반올림" ? `바로 아래 자리인 ${rg1PL(g.p - 1)} 숫자를 살펴봐요` : `${rg1PL(g.p)} 아래 수를 ${g.m === "올림" ? "올려요" : "버려요"}`}. 이 문제는 바구니로 돌아가요.`, `${g.n} → ${nt.v}`);
    }
    cur = -1; turn = 1 - turn; paint();
    if (solved === RG1GAME.length) { prob.textContent = `놀이 끝! 가 모둠 ${score[0]}점, 나 모둠 ${score[1]}점`; api.done(`가 ${score[0]} : 나 ${score[1]}`, o.ok); }
  }
  host.append(h("div", { class: "rg1score" }, ...sc), drawBtn, prob, h("div", { class: "rg1small" }, "칠판에 붙은 답 쪽지(교과서 그림의 답) — 알맞은 답 쪽지를 눌러요."), board, left);
  api.provide({ words: ["올림", "버림", "반올림"], answers: [] });
  paint();
}
/* 문제 만들기(붙임쪽지 2장) */
function rg1Make(host, api, o) {
  const N = o.n || 2, PL = [4, 3, 2, 1, 0, -1, -2], notes = [];
  const grid = h("div", { class: "rg1mk3" });
  for (let i = 0; i < N; i++) {
    const st = { m: null, p: null };
    const numIn = h("input", { type: "text", inputmode: "decimal", style: "width:7em", "aria-label": "수" }), ansIn = h("input", { type: "text", inputmode: "decimal", style: "width:7em", "aria-label": "답" });
    const mB = ["올림", "버림", "반올림"].map(m => h("button", { onclick: () => { st.m = m; mB.forEach(b => b.classList.toggle("rg1on", b.textContent === m)); } }, m));
    const pB = PL.map(p => h("button", { onclick: () => { st.p = p; pB.forEach((b, j) => b.classList.toggle("rg1on", PL[j] === p)); } }, rg1PN(p)));
    const box = h("div", { class: "rg1sticky" }, h("div", { class: "jua" }, `붙임쪽지 ${i + 1}`), h("div", {}, "수: ", numIn), h("div", { class: "rg1opts" }, ...mB), h("div", { class: "rg1small" }, "어느 자리까지?"), h("div", { class: "rg1opts" }, ...pB), h("div", {}, "답(다른 쪽지): ", ansIn));
    notes.push({ st, numIn, ansIn, box }); grid.append(box);
  }
  host.append(grid);
  api.provide({ words: ["올림", "버림", "반올림", "구하려는 자리"], answers: [] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); let msg = null; const out = [];
    notes.forEach((nt, i) => {
      if (msg) return; const s = nt.numIn.value.replace(/[\s,]/g, ""), v = rg1Num(s);
      const tag = `붙임쪽지 ${i + 1}: `;
      if (!/^\d+(\.\d{1,3})?$/.test(s) || v <= 0) return (msg = tag + "어림할 수를 써요(소수는 셋째 자리까지).");
      if (!nt.st.m || nt.st.p == null) return (msg = tag + "어림하는 방법과 나타낼 자리를 골라요.");
      const intLen = String(Math.floor(v)).length;
      if (nt.st.p >= intLen) return (msg = tag + `${s}에는 ${rg1PL(nt.st.p)}가 없어요. 수에 있는 자리를 골라요.`);
      if (rg1Low(s) >= nt.st.p) return (msg = tag + `${rg1PL(nt.st.p)} 아래 수가 모두 0이라 어림해도 그대로예요. 더 높은 자리를 골라 봐요.`);
      const right = rg1Rnd(s, nt.st.m, nt.st.p), w = rg1Num(nt.ansIn.value);
      nt.box.classList.remove("rg1good", "rg1bad");
      if (!rg1Eq(w, right)) { nt.box.classList.add("rg1bad"); return (msg = tag + `모둠 친구가 확인해 보니 답이 달라요. ${rg1J(s, "을/를")} ${nt.st.m}하여 ${rg1PL(nt.st.p)}까지 다시 나타내 봐요.`); }
      nt.box.classList.add("rg1good"); out.push(`${s} ${nt.st.m} ${rg1PN(nt.st.p)} → ${rg1F(right)}`);
    });
    if (!msg && N > 1 && new Set(notes.map(n => n.st.m)).size < 2) msg = "올림, 버림, 반올림 문제를 골고루 만들어요. 두 쪽지의 어림 방법을 다르게 해요.";
    if (msg) return api.fail(msg, out.join(" / "));
    api.done(out.join(" / "), o.ok);
  } }, "모둠 친구와 확인하기")));
}
/* 또 다른 놀이: 주사위 두 개로 둘레·넓이 → 반올림하여 십의 자리까지 */
function rg1Dice(host, api, o) {
  const goal = o.goal || 3; let round = 0, pts = 0, cur = null, call = null;
  const face = n => { const s = makeSvg(60, 60); s.append(svgEl("rect", { x: 3, y: 3, width: 54, height: 54, rx: 10, fill: "#fff", stroke: RG1C.ink, "stroke-width": 3 })); const P = { 1: [[30, 30]], 2: [[18, 18], [42, 42]], 3: [[16, 16], [30, 30], [44, 44]], 4: [[18, 18], [42, 18], [18, 42], [42, 42]], 5: [[16, 16], [44, 16], [30, 30], [16, 44], [44, 44]], 6: [[18, 15], [42, 15], [18, 30], [42, 30], [18, 45], [42, 45]] }[n]; P.forEach(([x, y]) => s.append(svgEl("circle", { cx: x, cy: y, r: 5, fill: RG1C.ink }))); return s; };
  const dice = h("span", { class: "rg1dice" }), info = h("div", { class: "rg1read" }, "‘둘레’ 또는 ‘넓이’를 외치고 주사위를 던져요."), sc = h("div", { class: "rg1score" });
  const v1 = h("input", { type: "text", inputmode: "numeric", style: "width:5em;font-size:1.1em;text-align:center", "aria-label": "둘레 또는 넓이" }), v2 = h("input", { type: "text", inputmode: "numeric", style: "width:5em;font-size:1.1em;text-align:center", "aria-label": "어림한 값" });
  const form = h("div", { hidden: true }, h("p", { class: "sent" }, h("span", { class: "rg1call" }, ""), v1, " cm 또는 cm² → 반올림하여 십의 자리까지: ", v2));
  const roll = c => { if (cur) return api.hint("먼저 지금 직사각형의 값을 구해요."); call = c; cur = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]; dice.innerHTML = ""; dice.append(face(cur[0]), face(cur[1])); info.textContent = `“${c}!” 가로 ${cur[0]} cm, 세로 ${cur[1]} cm인 직사각형의 ${c}를 구하고 반올림하여 십의 자리까지 나타내요.`; form.querySelector(".rg1call").textContent = `${c}: `; v1.value = v2.value = ""; form.hidden = false; };
  const paint = () => { sc.innerHTML = ""; sc.append(h("span", {}, `${round}회`), h("span", {}, `점수 ${pts}점`)); };
  host.append(h("div", { class: "rg1ctl" }, h("button", { onclick: () => roll("둘레") }, "🎲 “둘레!” 던지기"), h("button", { onclick: () => roll("넓이") }, "🎲 “넓이!” 던지기"), dice), info, form, sc);
  api.provide({ words: ["둘레", "넓이", "반올림"], answers: [] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (!cur) return api.hint("먼저 주사위를 던져요.");
    api.tryOnce();
    const val = call === "둘레" ? (cur[0] + cur[1]) * 2 : cur[0] * cur[1], est = rg1Rnd(val, "반올림", 1), a = rg1Num(v1.value), b = rg1Num(v2.value);
    if (a !== val) return api.fail(call === "둘레" ? "둘레는 (가로 + 세로) × 2로 구해요." : "넓이는 가로 × 세로로 구해요.", `${v1.value}/${v2.value}`);
    if (b !== est) return api.fail(`${call}는 ${rg1J(String(val), "이/가")} 맞아요. 반올림하여 십의 자리까지 나타내려면 일의 자리 숫자를 살펴봐요.`, `${v1.value}/${v2.value}`);
    round++; pts += 2; cur = null; form.hidden = true; paint();
    info.textContent = `${call} ${val} → ${est}. 두 가지 모두 맞혀 2점!`;
    if (round >= goal) api.done(`${round}회 ${pts}점`, o.ok); else api.hint(`○ ${round}회 성공! 주사위를 다시 던져요.`);
  } }, "확인하기")));
  paint();
}
/* 독도 그림(외교부 독도 2024의 수) */
function rg1Dokdo() {
  const svg = makeSvg(640, 260); svg.setAttribute("class", "rg1fig"); svg.style.maxWidth = "32em";
  svg.append(svgEl("rect", { x: 0, y: 0, width: 640, height: 260, fill: "#DFF0FA" }), svgEl("rect", { x: 0, y: 190, width: 640, height: 70, fill: "#9CCBE8" }));
  svg.append(svgEl("path", { d: "M70,200 L120,120 L170,60 L215,95 L250,150 L290,200 Z", fill: "#7DA36B", stroke: "#4E6E42", "stroke-width": 3 }));
  svg.append(svgEl("path", { d: "M350,200 L390,150 L440,110 L490,140 L540,200 Z", fill: "#8FB27C", stroke: "#4E6E42", "stroke-width": 3 }));
  svg.append(txt(180, 220, "서도", 20, { fill: "#1D3A2A" }), txt(445, 220, "동도", 20, { fill: "#1D3A2A" }));
  svg.append(txt(170, 40, "높이 168.5 m", 17, { fill: "#B5541C" }), txt(445, 92, "높이 98.6 m", 17, { fill: "#B5541C" }));
  svg.append(svgEl("rect", { x: 330, y: 14, width: 290, height: 34, rx: 8, fill: "#fff", stroke: RG1C.blue, "stroke-width": 2 }), txt(475, 32, "독도 전체 넓이 187554 m²", 16, { fill: RG1C.blue }));
  return svg;
}
//@@LESSONS
const UNIT_STORY = { title: "농산물 축제에서 수의 범위와 어림하기", lines: [
  "크리에이터 정우는 가족과 함께 우리 마을 농산물 축제에 왔어요. 사과 매장, 지게 체험장, 호두과자 판매장, 기념품 받는 곳, 버섯 매장 곳곳을 촬영하며 수의 범위와 어림이 필요한 상황을 찾아요.",
  "이상·이하·초과·미만으로 수의 범위를 수직선에 나타내고, 올림·버림·반올림으로 상황에 알맞게 어림해요.",
  "교과서 「수학 5-2」 1. 수의 범위와 어림하기의 차시 순서 그대로 만들었어요."],
  one: "수의 범위와 어림하기 · 정우와 함께 농산물 축제에서 이상·이하·초과·미만과 올림·버림·반올림을 알아봐요." };
const UNIT_KEYWORDS = ["이상", "이하", "초과", "미만", "수의 범위", "수직선", "● 포함해요", "○ 포함하지 않아요", "두 조건을 모두 만족", "어림", "올림", "버림", "반올림", "구하려는 자리", "아래 수", "바로 아래 자리의 숫자", "최소", "최대"];

/* 표 그리기 */
function rg1Tab(heads, rows, cap) {
  const tb = h("table"); tb.append(h("tr", {}, ...heads.map(x => h("th", {}, x))));
  rows.forEach(r => tb.append(h("tr", {}, ...r.map(x => h("td", {}, x)))));
  return h("div", {}, cap ? h("div", { class: "rg1read" }, cap) : null, h("div", { class: "rg1tbl" }, tb));
}
const RG1DUST = [["좋음", "0 이상 15 이하"], ["보통", "16 이상 35 이하"], ["나쁨", "36 이상 75 이하"], ["매우 나쁨", "76 이상"]];
const rg1DustTab = () => h("div", {}, rg1Tab(["등급", "초미세 먼지 농도(마이크로그램)"], RG1DUST, "초미세 먼지 등급"), h("p", { class: "rg1small" }, "마이크로그램: 무게의 단위 중 하나로, 1 마이크로그램은 1 g의 백만분의 1이에요. (출처: 에어코리아, 2024)"));
const RG1TYPE = [["1급", "350 초과"], ["2급", "250 초과 350 이하"], ["3급", "150 초과 250 이하"], ["4급", "150 이하"]];
const rg1Sign = () => { const s = makeSvg(200, 120); s.setAttribute("class", "rg1fig"); s.style.maxWidth = "9em"; s.append(svgEl("rect", { x: 0, y: 0, width: 200, height: 120, fill: "#FFF8E0" }), svgEl("circle", { cx: 100, cy: 60, r: 48, fill: "#fff", stroke: "#D64545", "stroke-width": 12 }), txt(100, 63, "30", 40)); return s; };
const RG1L = (from, to, extra) => Object.assign({ from, to }, extra || {});
const rg1Fig = (ax, r, maxW) => () => rg1LineFig(Object.assign({ maxW: maxW || "34em" }, ax), r);

const LESSONS = [
{
  id: "r1", no: 1, title: "단원 도입 ― 우리 마을 농산물 축제", soop: "개념 찾기(S)",
  question: "우리 주변에서 수의 범위나 어림이 필요한 상황에는 어떤 것이 있을까요?",
  summary: "놀이기구를 탈 때, 버스 요금을 낼 때, 승강기에 탈 때처럼 기준보다 크거나 작은 수의 범위가 필요한 상황이 있어요. 또 방문자 3482명을 약 3500명이라고 말하는 것처럼 대략의 수, 어림이 필요한 상황도 있어요.",
  steps: [
    { name: "축제 둘러보기", inst: "크리에이터 정우가 우리 마을 농산물 축제에 왔어요. “우리 마을에 농산물 축제가 열린다고?” 그림의 여러 곳을 눌러 정우와 함께 축제를 둘러보세요.", hints: ["그림 속 가게와 체험장을 하나씩 모두 눌러요.", "축제 입구의 방문자 수 기계를 살펴봐요."],
      render: (b, a) => rg1Fest(b, a, { ask: [{ q: "축제 입구의 방문자 수 기계에 나온 오늘 방문자는 몇 명인가요?", parts: [{ n: 3482 }, " 명"] }],
        ok: "축제에서 정우는 사과를 진열하고, 지게 체험을 하고, 호두과자를 팔고, 기념품을 받는 모습을 촬영했어요. 오늘 방문자는 벌써 3482명이에요." }) },
    { name: "범위와 어림 찾기", inst: "축제에서 찾은 상황을 ‘수의 범위가 필요한 상황’과 ‘어림이 필요한 상황’으로 나누어 보세요.", hints: ["‘~과 같거나 무거운’, ‘~보다 큰’처럼 기준이 되는 수보다 크거나 작은 수를 찾는 것은 수의 범위예요.", "‘최소 몇 상자’, ‘최대 몇 병’, ‘약 몇 명’처럼 대략의 수를 구하는 것은 어림이에요."],
      render: (b, a) => rg1Sort(b, a, { bins: ["수의 범위가 필요해요 (기준보다 크거나 작은 수)", "어림이 필요해요 (대략의 수, 최소·최대)"],
        cards: [{ t: "180 g과 같거나 무거운 사과만 진열하기", b: 0 }, { t: "키가 110 cm보다 큰 사람만 지게 체험하기", b: 0 }, { t: "체감 온도 33 ℃ 이상이면 폭염 주의보", b: 0 },
          { t: "호두과자 243개를 10개씩 담은 상자로 최소 몇 개 살까?", b: 1 }, { t: "스티커 228개로 사과주스를 최대 몇 병 바꿀까?", b: 1 }, { t: "방문자 3482명을 약 몇 명이라고 전할까?", b: 1 }],
        ok: "기준보다 크거나 작은 수를 찾을 때는 수의 범위가, 대략의 수나 최소·최대를 구할 때는 어림이 필요해요." }) },
    { name: "체감 온도", inst: "체감 온도는 사람이 느끼는 더위나 추위를 수로 나타낸 것이에요. 체감 온도가 33 ℃ 이상인 상태가 2일 이상 계속될 것으로 예상되면 폭염 주의보, 35 ℃ 이상인 상태가 2일 이상 계속될 것으로 예상되면 폭염 경보를 발표해요. (출처: 질병관리청, 2024)", hints: ["33 ℃ 이상에는 33 ℃도 들어가요.", "35 ℃ 이상이면 폭염 경보예요. 35 ℃도 들어가요.", "2일 이상 계속되어야 발표해요."],
      render: (b, a) => rg1Ask(b, a, [{ parts: [
        "체감 온도 34 ℃가 3일 계속될 것으로 예상될 때: ", { o: ["폭염 주의보", "폭염 경보", "발표하지 않아요"], a: 0, why: { "1": "폭염 경보는 35 ℃ 이상일 때예요. 34 ℃는 35 ℃보다 낮아요." } }, h("br"),
        "체감 온도 35 ℃가 2일 계속될 것으로 예상될 때: ", { o: ["폭염 주의보", "폭염 경보", "발표하지 않아요"], a: 1, why: { "0": "‘35 ℃ 이상’에는 35 ℃도 들어가요. 그래서 폭염 경보예요.", "2": "35 ℃가 2일 계속되면 ‘2일 이상’에 들어가요." } }, h("br"),
        "체감 온도 32 ℃가 4일 계속될 것으로 예상될 때: ", { o: ["폭염 주의보", "폭염 경보", "발표하지 않아요"], a: 2, why: { "0": "32 ℃는 33 ℃보다 낮아서 33 ℃ 이상이 아니에요." } }] }],
        { ok: "33 ℃ 이상, 35 ℃ 이상, 2일 이상처럼 기준이 되는 수와 같거나 큰 수를 정해 두면 폭염 특보를 알맞게 발표할 수 있어요." }) },
    { name: "배울 내용 살펴보기", inst: "책장을 넘겨 이 단원에서 배울 내용을 살펴봐요. 배우는 순서대로 눌러 보세요.", hints: ["수의 범위(이상·이하 → 초과·미만 → 활용)를 먼저 배워요.", "어림하기는 올림 → 버림 → 반올림 → 활용 순서예요."],
      render: (b, a) => sequence(b, a, ["버림", "이상과 이하", "반올림", "수의 범위를 활용하여 문제 해결하기", "올림", "초과와 미만", "올림, 버림, 반올림을 활용하여 문제 해결하기"], [1, 5, 3, 4, 0, 2, 6],
        { ok: "이상과 이하 → 초과와 미만 → 수의 범위 활용 → 올림 → 버림 → 반올림 → 어림 활용 순서로 배워요." }) },
    { name: "배운 내용 떠올리기", inst: "※ 이 자료에서 만든 문제예요(수학익힘 ‘이전에 배웠어요’ 문제는 확인하지 못했어요). 3·4학년 때 배운 길이·들이 어림하기와 큰 수의 크기 비교하기를 떠올려 보세요.", hints: ["어림은 자로 재지 않고 대강 짐작하는 것이에요. 한 뼘이 약 15 cm예요.", "자릿수가 같으면 높은 자리의 숫자부터 비교해요."],
      render: (b, a) => rg1Ask(b, a, [
        { q: "길이와 들이를 어림해 보세요.", parts: ["새 색연필의 길이는 약 ", { o: ["2 cm", "17 cm", "170 cm"], a: 1 }, "예요.", h("br"), "작은 우유갑의 들이는 약 ", { o: ["2 mL", "200 mL", "20 L"], a: 1 }, "예요."] },
        { q: "두 수의 크기를 비교하여 > 또는 <를 골라 보세요.", parts: ["3482 ", { o: [">", "<"], a: 0, why: { "1": "천의 자리, 백의 자리가 같아요. 십의 자리 숫자 8과 2를 비교해요." } }, " 3428", h("br"), "52300 ", { o: [">", "<"], a: 1, why: { "0": "523000은 여섯 자리 수, 52300은 다섯 자리 수예요. 자릿수가 많은 수가 더 커요." } }, " 523000"] }],
        { ok: "길이와 들이를 어림하고, 큰 수의 크기를 비교할 수 있어요. 이번 단원에서는 수의 범위와 어림하는 방법을 더 자세히 배워요." }) }
  ],
  challenge: { inst: "수학 이야기: 부등호 ‘>’와 ‘<’는 영국의 수학자 오트레드(1574~1660)가 『수학의 열쇠』라는 책에서 처음 사용했다고 해요. 그때는 모양이 지금과 달랐고, 그 뒤 토머스 해리엇(1560~1621)이 지금과 같은 모양을 만들었어요. 이야기를 읽고 물음에 답해 보세요.", hints: ["처음 쓴 사람과 지금 모양을 만든 사람이 달라요.", "45.6은 45.60과 같아요. 소수 첫째 자리 숫자를 비교해요."],
    render: (b, a) => rg1Ask(b, a, [
      { parts: ["부등호를 처음 사용한 사람: ", { o: ["오트레드", "해리엇"], a: 0 }, h("br"), "지금과 같은 모양을 만든 사람: ", { o: ["오트레드", "해리엇"], a: 1 }] },
      { parts: ["45.6 ", { o: [">", "<"], a: 0, why: { "1": "자연수 부분이 같으니 소수 첫째 자리 숫자 6과 0을 비교해요." } }, " 45.06", h("br"), "3482 ", { o: [">", "<"], a: 1 }, " 3500"] }],
      { ok: "부등호를 쓰면 두 수의 크기를 간단하게 나타낼 수 있어요. 이 단원에서는 한 수와 크기를 비교하여 수의 범위를 나타내요." }) }
},
{
  id: "r2", no: 2, title: "이상과 이하를 알아볼까요", soop: "개념 구축하기(O)",
  question: "180과 같거나 큰 수, 145와 같거나 작은 수를 어떻게 나타낼 수 있을까요?",
  summary: "180, 181, 183과 같이 180과 같거나 큰 수를 180 이상인 수라고 하고, 143, 144.6, 145와 같이 145와 같거나 작은 수를 145 이하인 수라고 해요. 수직선에서 ●은 그 수가 포함된다는 것을 뜻해요. 이상은 ●에서 오른쪽으로, 이하는 ●에서 왼쪽으로 선을 그어요.",
  steps: [
    { inst: "축제 첫째 날 아침, 상인들이 사과의 무게를 재어 진열하고 있어요. “180 g과 같거나 무거운 사과만 골라 진열하려고 해요.” 사과 카드를 알맞은 칸으로 옮겨 보세요.", hints: ["180 g과 ‘같은’ 사과도 진열해요.", "179 g과 170 g은 180 g보다 가벼워요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Sort(x, y, { bins: ["진열해요 (180 g과 같거나 무거운 사과)", "진열하지 않아요"],
          cards: [{ t: "🍎 180 g", b: 0, why: { 1: "180 g은 180 g과 같아요. ‘같거나 무거운’ 사과에 들어가요." } }, { t: "🍎 170 g", b: 1 }, { t: "🍎 181 g", b: 0 }, { t: "🍎 179 g", b: 1, why: { 0: "179 g은 180 g보다 가벼워요." } }, { t: "🍎 183 g", b: 0 }],
          ok: "180 g, 181 g, 183 g인 사과를 진열해요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["진열하는 사과 중에서 가장 가벼운 사과의 무게는 ", { n: 180, why: { "181": "180 g과 같은 사과도 진열해요." } }, " g이에요."] }], { ok: "180과 같은 수도, 180보다 큰 수도 모두 ‘180과 같거나 큰 수’예요." })]) },
    { inst: "180과 같거나 큰 수를 수직선에 나타내 보세요. 180은 진열하는 무게에 포함되니 ‘● 포함하는 점’으로 180에 점을 찍고, ‘선 긋기’를 골라 더 큰 수 쪽을 눌러 선을 그어요.", hints: ["‘● 포함하는 점’을 고르고 180 눈금을 눌러요.", "‘선 긋기’를 고르고 180보다 오른쪽을 눌러요. 수직선에서는 오른쪽으로 갈수록 큰 수예요."],
      render: (b, a) => rg1Line(b, a, Object.assign(RG1L(179, 183), { r: { lo: 180, loInc: true }, ok: "180에 ●을 찍고 오른쪽으로 선을 그었어요. ●은 180이 포함된다는 것을 뜻해요." })) },
    { inst: "지유네 모둠의 학생별 제자리멀리뛰기 기록이에요. 145 cm와 같거나 짧은 기록에 ○표를 하고, 145와 같거나 작은 수를 수직선에 나타내 보세요.", hints: ["145 cm와 같은 기록에도 ○표를 해요.", "144.6은 145보다 작아요. 147.8은 145보다 커요.", "145에 ●을 찍고 작은 수 쪽, 왼쪽으로 선을 그어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Mark(x, y, { vals: [143, 147.8, 145, 144.6, 148], labels: ["지유", "승민", "채희", "우진", "민서"], unit: "cm", marks: [{ sym: "○", hi: 145, hiInc: true, name: "145와 같거나 작은 수" }],
          ok: "143 cm, 145 cm, 144.6 cm가 145 cm와 같거나 짧은 기록이에요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(142, 146), { q: "145와 같거나 작은 수를 수직선에 나타내 보세요.", r: { hi: 145, hiInc: true }, ok: "145에 ●을 찍고 왼쪽으로 선을 그었어요." }))]) },
    { inst: "수직선 그림을 보고 약속을 완성해 보세요.", hints: ["‘같거나 큰 수’는 이상, ‘같거나 작은 수’는 이하예요.", "●은 그 수가 범위에 들어간다는 표시예요."],
      render: (b, a) => rg1Ask(b, a, [
        { fig: rg1Fig(RG1L(179, 183), { lo: 180, loInc: true }), parts: ["180, 181, 183과 같이 180과 같거나 큰 수를 180 ", { o: ["이상", "이하"], a: 0 }, "인 수라고 합니다."] },
        { fig: rg1Fig(RG1L(142, 146), { hi: 145, hiInc: true }), parts: ["143, 144.6, 145와 같이 145와 같거나 작은 수를 145 ", { o: ["이상", "이하"], a: 1, why: { "0": "145보다 작은 쪽, 왼쪽으로 선이 그어져 있어요." } }, "인 수라고 합니다."] },
        { parts: ["수직선의 ●은 그 수가 ", { o: ["포함된다는", "포함되지 않는다는"], a: 0 }, " 것을 의미해요."] }],
        { ok: "180과 같거나 큰 수는 180 이상인 수, 145와 같거나 작은 수는 145 이하인 수예요. ●은 그 수가 포함된다는 뜻이에요." }) },
    { inst: "이상인 수와 이하인 수를 찾고, 어린이 보호 구역 표지판의 수의 범위를 그림에 나타내 보세요.", hints: ["68 이상에는 68이, 52 이하에는 52가 들어가요.", "54와 67.9는 어느 쪽에도 들어가지 않아요.", "‘30 이하’는 30과 같거나 작은 수예요. 30에 ●, 왼쪽으로 선을 그어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Mark(x, y, { q: "68 이상인 수에 모두 ○표, 52 이하인 수에 모두 △표 해 보세요.", vals: [54, 48.7, 75, 67.9, 68, 68.3, 52], marks: [{ sym: "○", lo: 68, loInc: true }, { sym: "△", hi: 52, hiInc: true }],
          ok: "68 이상인 수는 75, 68, 68.3이고, 52 이하인 수는 48.7, 52예요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(27, 33), { fig: rg1Sign, q: "어린이 보호 구역의 표지판은 자동차가 한 시간에 30 km 이하의 빠르기로 가야 한다는 뜻이에요. 30 이하인 수를 그림에 나타내 보세요.", r: { hi: 30, hiInc: true }, ok: "30 이하인 수는 30과 같거나 작은 수예요. 30에 ●을 찍고 왼쪽으로 선을 그어요." }))]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 이상과 이하를 생각하며 풀어 보세요.", hints: ["37 이하에는 37보다 작은 수만 있어요. 36.5와 34를 찾아요.", "130.0 cm는 130 cm와 같아요.", "‘이상’은 그 수를 포함해요. 16 이상인 수 중에서 가장 작은 수는 16이에요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Mark(x, y, { q: "37 이하인 수에 모두 ○표 해 보세요.", vals: [39, 42, 36.5, 34, 40.7], marks: [{ sym: "○", hi: 37, hiInc: true }], ok: "36.5와 34가 37 이하인 수예요." }),
      (x, y) => rg1Ask(x, y, [
        { q: "그림에 나타낸 수의 범위를 써 보세요.", fig: rg1Fig(RG1L(54, 61), { hi: 59, hiInc: true }), parts: [{ n: 59 }, " ", { o: ["이상", "이하"], a: 1 }, "인 수"] },
        { q: "키가 130 cm 이하인 사람은 탈 수 없는 놀이기구가 있어요. 준호 140.2 cm, 유라 130.0 cm, 성욱 126.9 cm, 채영 137.4 cm 중 이 놀이기구를 탈 수 없는 사람은 몇 명인가요?", parts: [{ n: 2, why: { "1": "130.0 cm는 130 cm와 같아요. ‘130 cm 이하’에 들어가요." } }, " 명"] },
        { q: "성호: “16 이상인 수 중에서 가장 작은 수는 17이야.” 아영: “53 이하인 수는 53과 같거나 작은 수야.” 해미: “20.1은 20 이상인 수야.”", parts: ["수의 범위에 대해 잘못 말한 사람은 ", { o: ["성호", "아영", "해미"], a: 0 }, "예요. 바르게 고치면 16 이상인 수 중에서 가장 작은 수는 ", { n: 16, why: { "17": "‘이상’은 16을 포함해요." } }, "이에요."] }],
        { ok: "59 이하인 수, 2명(유라, 성욱)이에요. 16 이상인 수에는 16이 포함되므로 가장 작은 수는 16이에요." })]) }
},
{
  id: "r3", no: 3, title: "초과와 미만을 알아볼까요", soop: "개념 구축하기(O)",
  question: "110보다 큰 수, 64보다 작은 수를 어떻게 나타낼 수 있을까요?",
  summary: "110.8, 113, 113.2와 같이 110보다 큰 수를 110 초과인 수라고 하고, 59, 60, 63과 같이 64보다 작은 수를 64 미만인 수라고 해요. 수직선에서 ○은 그 수가 포함되지 않는다는 것을 뜻해요. 초과와 미만에는 기준이 되는 수가 들어가지 않아요.",
  steps: [
    { inst: "“지게 체험을 하려면 조건이 있네요?” 안전을 위해 키가 110 cm보다 큰 사람만 지게 체험에 참여할 수 있어요. 학생들의 키 카드를 알맞은 칸으로 옮겨 보세요.", hints: ["110 cm보다 ‘큰’ 키만 참여할 수 있어요. 110 cm와 같은 키는 참여할 수 없어요.", "110.8 cm는 110 cm보다 커요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Sort(x, y, { bins: ["참여할 수 있어요 (110 cm보다 큰 키)", "참여할 수 없어요"],
          cards: [{ t: "시원 109 cm", b: 1 }, { t: "소은 113.2 cm", b: 0 }, { t: "현서 113 cm", b: 0 }, { t: "도진 110 cm", b: 1, why: { 0: "110 cm는 110 cm보다 크지 않아요. 키가 110 cm와 같으면 참여할 수 없어요." } }, { t: "수민 110.8 cm", b: 0, why: { 1: "110.8 cm는 110 cm보다 0.8 cm 더 커요." } }],
          ok: "113.2 cm, 113 cm, 110.8 cm인 학생이 지게 체험에 참여할 수 있어요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["키가 110 cm인 도진이는 지게 체험에 참여할 수 ", { o: ["있어요", "없어요"], a: 1, why: { "0": "110 cm보다 ‘큰’ 사람만 참여할 수 있어요. 110은 110보다 크지 않아요." } }, "."] }], { ok: "기준이 되는 110 cm는 ‘110보다 큰 수’에 들어가지 않아요." })]) },
    { inst: "110보다 큰 수를 수직선에 나타내 보세요. 110은 포함되지 않으니 ‘○ 포함하지 않는 점’으로 110에 점을 찍고, 더 큰 수 쪽으로 선을 그어요.", hints: ["‘○ 포함하지 않는 점’을 고르고 110 눈금을 눌러요.", "‘선 긋기’를 고르고 110보다 오른쪽을 눌러요."],
      render: (b, a) => rg1Line(b, a, Object.assign(RG1L(109, 113), { r: { lo: 110, loInc: false }, ok: "110에 ○을 찍고 오른쪽으로 선을 그었어요. ○은 110이 포함되지 않는다는 것을 뜻해요." })) },
    { inst: "민준이네 모둠의 학생별 왕복 오래달리기 기록이에요. 64회보다 적은 기록에 ○표를 하고, 64보다 작은 수를 수직선에 나타내 보세요.", hints: ["64회와 같은 기록은 64회보다 적지 않아요.", "64에 ○을 찍고 작은 수 쪽, 왼쪽으로 선을 그어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Mark(x, y, { vals: [68, 60, 64, 63, 59], labels: ["민준", "소민", "승호", "서율", "지완"], unit: "회", marks: [{ sym: "○", hi: 64, hiInc: false, name: "64보다 작은 수" }],
          ok: "60회, 63회, 59회가 64회보다 적은 기록이에요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(59, 65), { q: "64보다 작은 수를 수직선에 나타내 보세요.", r: { hi: 64, hiInc: false }, ok: "64에 ○을 찍고 왼쪽으로 선을 그었어요." }))]) },
    { inst: "수직선 그림을 보고 약속을 완성해 보세요.", hints: ["‘보다 큰 수’는 초과, ‘보다 작은 수’는 미만이에요.", "○은 그 수가 범위에 들어가지 않는다는 표시예요."],
      render: (b, a) => rg1Ask(b, a, [
        { fig: rg1Fig(RG1L(109, 113), { lo: 110 }), parts: ["110.8, 113, 113.2와 같이 110보다 큰 수를 110 ", { o: ["이상", "초과", "미만"], a: 1, why: { "0": "110은 포함되지 않아요(○). ‘이상’은 110을 포함해요." } }, "인 수라고 합니다."] },
        { fig: rg1Fig(RG1L(59, 65), { hi: 64 }), parts: ["59, 60, 63과 같이 64보다 작은 수를 64 ", { o: ["이하", "초과", "미만"], a: 2, why: { "0": "64는 포함되지 않아요(○). ‘이하’는 64를 포함해요." } }, "인 수라고 합니다."] },
        { parts: ["수직선의 ○은 그 수가 ", { o: ["포함된다는", "포함되지 않는다는"], a: 1 }, " 것을 의미해요."] }],
        { ok: "110보다 큰 수는 110 초과인 수, 64보다 작은 수는 64 미만인 수예요. ○은 그 수가 포함되지 않는다는 뜻이에요." }) },
    { inst: "초과인 수와 미만인 수를 찾고, 경고음이 울리는 엘리베이터를 찾아 보세요.", hints: ["59.6 초과에는 59.6이, 48.2 미만에는 48.2가 들어가지 않아요.", "1500 kg을 ‘초과’하면 경고음이 울려요. 1500 kg일 때는 울리지 않아요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Mark(x, y, { q: "59.6 초과인 수에 모두 ○표, 48.2 미만인 수에 모두 △표 해 보세요.", vals: [48, 60, 59.6, 48.2, 63, 46.5, 59.7], marks: [{ sym: "○", lo: 59.6, loInc: false }, { sym: "△", hi: 48.2, hiInc: false }],
          ok: "59.6 초과인 수는 60, 63, 59.7이고, 48.2 미만인 수는 48, 46.5예요." }),
        (x, y) => rg1Ask(x, y, [{ q: "무게가 1500 kg을 초과하면 경고음이 울리는 엘리베이터가 있어요. 엘리베이터 안의 무게가 각각 다음과 같을 때 경고음이 울리는 경우를 모두 골라 보세요.",
          parts: [{ o: ["가 엘리베이터 1500 kg", "나 엘리베이터 1290 kg", "다 엘리베이터 1510 kg"], multi: true, a: [2], why: { "0,2": "1500 kg은 1500 kg을 초과하지 않아요. ‘초과’는 1500을 포함하지 않아요.", "0": "1500 kg은 1500 kg을 초과하지 않아요. ‘초과’는 1500을 포함하지 않아요." } }] }],
          { ok: "1510 kg일 때만 경고음이 울려요. 1500 kg은 1500 초과인 수가 아니에요." })]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 초과와 미만을 생각하며 풀어 보세요.", hints: ["42 미만에는 42가 들어가지 않아요.", "14.6에 ○을 찍고 왼쪽으로 선을 그어요. 작은 눈금 한 칸은 0.1이에요.", "600 미만인 세 자리 수는 백의 자리 숫자가 5 이하예요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Mark(x, y, { q: "42 미만인 수에 모두 ○표 해 보세요.", vals: [41.5, 57, 42, 36, 42.9], marks: [{ sym: "○", hi: 42, hiInc: false }], ok: "41.5와 36이 42 미만인 수예요." }),
      (x, y) => rg1Line(x, y, Object.assign(RG1L(14, 15, { step: .1, lab: 1, mid: .5 }), { q: "14.6 미만인 수를 그림에 나타내 보세요. (작은 눈금 한 칸은 0.1이에요.)", r: { hi: 14.6, hiInc: false }, ok: "14.6에 ○을 찍고 왼쪽으로 선을 그었어요." })),
      (x, y) => rg1Ask(x, y, [{ q: "비행기 수하물 무게가 12 kg을 초과하면 추가 요금을 내야 해요. 가 11.9 kg, 나 18.1 kg, 다 12 kg, 라 13.7 kg 중 추가 요금을 내야 하는 수하물을 모두 골라 보세요.",
        parts: [{ o: ["가", "나", "다", "라"], multi: true, a: [1, 3], why: { "1,2,3": "12 kg은 12 kg을 초과하지 않아요." } }] }], { ok: "나(18.1 kg)와 라(13.7 kg)가 12 kg 초과예요." }),
      (x, y) => rg1Cards(x, y, { cards: [3, 5, 8], tasks: [
        { q: "수 카드 3, 5, 8을 한 번씩 써서 세 자리 수를 만들어요. 600 미만인 수 중에서 가장 큰 수를 만들어 보세요.", kind: "best", ok: n => n < 600, cmp: "max" },
        { q: "이번에는 700 초과인 수 중에서 가장 작은 수를 만들어 보세요.", kind: "best", ok: n => n > 700, cmp: "min" }],
        ok: "600 미만인 수 중에서 가장 큰 수는 583, 700 초과인 수 중에서 가장 작은 수는 835예요." })]) }
},
{
  id: "r4", no: 4, title: "수의 범위를 활용하여 문제를 해결해 볼까요", soop: "개념 구축하기(O)",
  question: "이상, 이하, 초과, 미만을 함께 사용하여 수의 범위를 어떻게 나타낼 수 있을까요?",
  summary: "16 이상 35 이하인 수는 16과 같거나 크고 35와 같거나 작은 수로, 두 조건을 모두 만족하는 수예요. 수직선에는 16과 35에 ●을 찍고 두 점 사이에 선을 그어요. 이상·이하는 ●, 초과·미만은 ○로 나타내요.",
  steps: [
    { inst: "축제가 열린 날 오후 2시에 축제 장소의 초미세 먼지 농도는 25 마이크로그램이에요. 초미세 먼지 등급표를 보고 어느 등급인지 알아보고, 그 등급의 범위를 수직선에 나타내 보세요.", hints: ["25는 16과 같거나 크고 35와 같거나 작아요.", "16과 35에 모두 ●을 찍어요. 수직선의 긴 눈금은 10, 20, 30, 40이고, 중간 눈금은 5씩이에요.", "‘선 긋기’를 고르고 두 점 사이를 눌러요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Ask(x, y, [{ fig: rg1DustTab, parts: ["25 마이크로그램은 ", { o: ["좋음", "보통", "나쁨", "매우 나쁨"], a: 1, why: { "0": "좋음은 15 이하예요. 25는 15보다 커요." } }, " 등급이에요."] }], { ok: "25는 16 이상 35 이하인 수라서 ‘보통’이에요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(10, 40, { lab: 10, mid: 5 }), { q: "‘보통’ 등급의 범위(16 이상 35 이하인 수)를 수직선에 나타내 보세요.", r: { lo: 16, loInc: true, hi: 35, hiInc: true }, ok: "16과 35에 ●을 찍고 두 점 사이에 선을 그었어요. 16과 35도 ‘보통’에 들어가요." }))]) },
    { inst: "16과 35를 이상, 이하, 초과, 미만으로 나타낸 여러 가지 범위를 수직선에 나타내 보세요.", hints: ["이상·이하는 ●, 초과·미만은 ○로 나타내요.", "두 점을 찍은 다음 ‘선 긋기’로 두 점 사이를 눌러요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Line(x, y, Object.assign(RG1L(10, 40, { lab: 10, mid: 5 }), { q: "① 16 이상 35 미만인 수", r: { lo: 16, loInc: true, hi: 35, hiInc: false } })),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(10, 40, { lab: 10, mid: 5 }), { q: "② 16 초과 35 이하인 수", r: { lo: 16, loInc: false, hi: 35, hiInc: true } })),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(10, 40, { lab: 10, mid: 5 }), { q: "③ 16 초과 35 미만인 수", r: { lo: 16, loInc: false, hi: 35, hiInc: false }, ok: "16과 35를 포함하는지에 따라 ●과 ○을 다르게 찍었어요." }))]) },
    { inst: "아윤이네 모둠의 학생별 타자 수와 등급별 타자 수예요. 학생 카드를 알맞은 등급으로 옮기고, 2급의 범위를 수직선에 나타내 보세요.", hints: ["350타는 ‘350 초과’가 아니라 ‘250 초과 350 이하’에 들어가요.", "246타와 237타는 250타보다 적어요.", "250은 ○, 350은 ●으로 찍어요. 큰 눈금은 100, 중간 눈금은 50, 작은 눈금은 10씩이에요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Sort(x, y, { bins: RG1TYPE.map(r => `${r[0]} (${r[1]})`),
          cards: [{ t: "아윤 285타", b: 1 }, { t: "준수 246타", b: 2, why: { 1: "246은 250보다 작아서 250 초과가 아니에요." } }, { t: "민성 350타", b: 1, why: { 0: "350은 350 초과가 아니에요. 350을 포함하는 ‘350 이하’에 들어가요." } }, { t: "지현 237타", b: 2 }],
          ok: "2급에 속하는 학생은 아윤이와 민성이에요. 준수와 지현이는 3급이에요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(100, 400, { step: 10, lab: 100, mid: 50 }), { q: "2급의 범위(250 초과 350 이하인 수)를 수직선에 나타내 보세요.", r: { lo: 250, loInc: false, hi: 350, hiInc: true }, ok: "250에 ○, 350에 ●을 찍고 두 점 사이에 선을 그었어요." }))]) },
    { inst: "수직선 그림을 보고 알맞은 수의 범위를 골라 약속을 완성해 보세요.", hints: ["●은 포함(이상·이하), ○은 포함하지 않음(초과·미만)이에요.", "왼쪽 점은 이상이나 초과, 오른쪽 점은 이하나 미만으로 읽어요."],
      render: (b, a) => { const O = ["16 이상 35 이하인 수", "16 이상 35 미만인 수", "16 초과 35 이하인 수", "16 초과 35 미만인 수"], ax = RG1L(10, 40, { lab: 10, mid: 5 });
        return rg1Ask(b, a, [
          { fig: rg1Fig(ax, { lo: 16, hi: 35 }), parts: [{ o: O, a: 3 }] },
          { fig: rg1Fig(ax, { lo: 16, loInc: true, hi: 35, hiInc: true }), parts: [{ o: O, a: 0 }] },
          { fig: rg1Fig(ax, { lo: 16, hi: 35, hiInc: true }), parts: [{ o: O, a: 2 }] },
          { fig: rg1Fig(ax, { lo: 16, loInc: true, hi: 35 }), parts: [{ o: O, a: 1 }] }],
          { title: "수의 범위를 이상, 이하, 초과, 미만을 이용하여 그림에 나타내면 다음과 같아요.", ok: "수의 범위는 경계의 수를 포함하면 ●(이상·이하), 포함하지 않으면 ○(초과·미만)로 나타내요." }); } },
    { inst: "우리 주변에서 수의 범위를 활용하는 상황을 찾아 이야기해 봐요.", hints: ["6세 이상 13세 미만에는 6세가 들어가고 13세는 들어가지 않아요.", "놀이기구의 키 제한, 박물관 입장료, 비행기 수하물 무게처럼 범위가 정해진 상황을 떠올려요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Mark(x, y, { q: "“우리 지역에서 6세 이상 13세 미만인 어린이의 마을버스 요금은 400원이야.” 마을버스 요금 400원을 내는 나이에 모두 ○표 해 보세요.", vals: [5, 6, 9, 12, 13, 15], unit: "세", marks: [{ sym: "○", lo: 6, loInc: true, hi: 13, hiInc: false }],
          ok: "6세, 9세, 12세가 6세 이상 13세 미만이에요." }),
        (x, y) => rg1Say(x, y, { q: "우리 주변에서 수의 범위를 활용하는 상황을 찾아 ‘이상’, ‘이하’, ‘초과’, ‘미만’ 중에서 2개를 사용하여 써 보세요.", words: ["이상", "이하", "초과", "미만"], need: 2, ph: "예) 8세 이상 19세 미만은 박물관 입장료가 2000원입니다.",
          ok: "수의 범위를 사용하면 요금이나 조건을 정확하게 정할 수 있어요." })]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 수의 범위를 활용하여 문제를 해결해 보세요.", hints: ["38 g은 25 g 초과 50 g 이하예요.", "53 이상 57 이하에는 53과 57도 들어가요.", "자연수 부분은 6, 7, 8 중에서, 소수 첫째 자리 숫자는 3, 4, 5, 6, 7 중에서 골라요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Ask(x, y, [{ fig: () => rg1Tab(["무게", "우편 요금"], [["5 g 이하", "400원"], ["5 g 초과 25 g 이하", "430원"], ["25 g 초과 50 g 이하", "450원"]], "무게별 우편 요금 (출처: 우정사업본부, 2024)"),
        parts: ["무게가 38 g인 편지를 보낼 때 우편 요금은 ", { n: 450, why: { "430": "38 g은 25 g보다 무거워요." } }, "원이에요."] }], { ok: "38 g은 25 g 초과 50 g 이하라서 450원이에요." }),
      (x, y) => rg1Line(x, y, Object.assign(RG1L(5, 50, { step: 5, lab: 5 }), { q: "38 g이 속하는 무게의 범위를 수직선에 나타내 보세요.", r: { lo: 25, loInc: false, hi: 50, hiInc: true } })),
      (x, y) => rg1Sort(x, y, { q: "남학생 씨름 체급표의 일부예요. 경장급 40 kg 이하, 소장급 40 kg 초과 45 kg 이하, …, 청장급 50 kg 초과 55 kg 이하 (출처: 대한씨름협회, 2024). 청장급에 속하는 학생을 찾아 보세요.",
        bins: ["청장급이에요 (50 kg 초과 55 kg 이하)", "청장급이 아니에요"], cards: [{ t: "지환 52 kg", b: 0 }, { t: "민찬 55 kg", b: 0, why: { 1: "55 kg은 ‘55 kg 이하’에 들어가요." } }, { t: "도준 46 kg", b: 1 }, { t: "재영 39 kg", b: 1 }],
        ok: "지환이와 민찬이가 청장급이에요." }),
      (x, y) => rg1Ask(x, y, [
        { q: "51.8, 54, 57, 60, 53.2 중에서 53 이상 57 이하인 수는 모두 몇 개인가요?", parts: [{ n: 3, why: { "2": "57도 ‘57 이하’에 들어가요." } }, " 개"] },
        { q: "74, 75, 76, 77, 78이 모두 속하는 수의 범위를 ‘이상’과 ‘미만’을 사용하여 나타낸 것을 골라 보세요.", parts: [{ o: ["74 이상 78 미만인 수", "74 이상 79 미만인 수", "75 이상 79 미만인 수"], a: 1, why: { "0": "78은 78 미만인 수가 아니에요.", "2": "74는 75 이상인 수가 아니에요." } }] },
        { q: "보물 상자 비밀번호: 자연수 부분은 5 초과 9 미만이고, 소수 첫째 자리 숫자는 3 이상 8 미만인 소수 한 자리 수 중에서 가장 작은 수예요.", parts: ["비밀번호: ", { n: 6.3, why: { "5.3": "자연수 부분은 5 ‘초과’라서 5는 안 돼요.", "6.4": "소수 첫째 자리 숫자는 3 ‘이상’이라 3도 돼요." } }] }],
        { ok: "54, 57, 53.2 세 개, 74 이상 79 미만인 수, 비밀번호는 6.3이에요." })]) }
},
{
  id: "r5", no: 5, title: "올림을 알아볼까요", soop: "개념 구축하기(O)",
  question: "호두과자 243개를 상자로 살 때 최소로 사야 하는 호두과자의 수를 어떻게 구할 수 있을까요?",
  summary: "구하려는 자리의 아래 수를 올려서 나타내는 방법을 올림이라고 해요. 243을 올림하여 십의 자리까지 나타내면 3을 10으로 생각하여 250, 백의 자리까지 나타내면 43을 100으로 생각하여 300이에요. 올림한 수는 원래 수와 같거나 커요.",
  steps: [
    { inst: "호두과자 판매장에서 다른 반 선생님이 호두과자 243개를 사서 학생들에게 나누어 주려고 해요. 호두과자는 10개씩 담은 상자와 100개씩 담은 상자로 팔아요. 상자 수를 늘리고 줄여 최소로 사야 하는 상자 수를 찾아보세요.", hints: ["상자 24개면 240개라서 3개가 부족해요.", "남은 3개를 사려면 상자를 하나 더 사야 해요.", "100개씩 담은 상자 2개면 200개라서 43개가 부족해요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Pack(x, y, { q: "① 10개씩 담은 상자로 사요.", n: 243, u: 10, mode: "ceil", item: "호두과자", itemName: "필요한 호두과자 243개", unit: "개", box: "상자", boxName: "10개씩 담은 상자", read: k => `10개씩 담은 상자 ${k}개 → 호두과자 ${k * 10}개`, ok: "상자 25개, 호두과자 250개를 사야 해요. 24상자(240개)로는 3개가 부족해요." }),
        (x, y) => rg1Pack(x, y, { q: "② 100개씩 담은 상자로 사요.", n: 243, u: 100, mode: "ceil", item: "호두과자", itemName: "필요한 호두과자 243개", unit: "개", box: "상자", boxName: "100개씩 담은 상자", read: k => `100개씩 담은 상자 ${k}개 → 호두과자 ${k * 100}개`, ok: "상자 3개, 호두과자 300개를 사야 해요. 2상자(200개)로는 43개가 부족해요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["호두과자를 10개씩 담은 상자로 산다면 최소 ", { n: 250, why: { "240": "240개면 3개가 부족해요." } }, "개, 100개씩 담은 상자로 산다면 최소 ", { n: 300, why: { "200": "200개면 43개가 부족해요." } }, "개를 사야 해요."] }],
          { ok: "10개씩 담은 상자로는 250개, 100개씩 담은 상자로는 300개를 사야 해요." })]) },
    { inst: "243을 어림하는 방법을 숫자로 살펴봐요. 구하려는 자리의 숫자를 누르면 그 아래 수를 어떻게 생각하는지 보여요.", hints: ["십의 자리까지 나타낼 때는 일의 자리 숫자 3을 10으로 생각해요.", "백의 자리까지 나타낼 때는 43을 100으로 생각해요."],
      render: (b, a) => rg1Digits(b, a, { tasks: [{ n: "243", m: "올림", p: 1 }, { n: "243", m: "올림", p: 2 }], ok: "243을 올림하여 십의 자리까지 나타내면 250, 백의 자리까지 나타내면 300이에요." }) },
    { inst: "음식점에서 12500원인 음식을 10000원짜리 지폐로만 계산하려고 해요. 지폐를 몇 장 내야 하는지 알아보세요.", hints: ["10000원짜리 지폐 1장으로는 2500원이 부족해요.", "만의 자리 아래 수인 2500을 10000으로 생각해요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Pack(x, y, { n: 12500, u: 10000, mode: "ceil", item: "음식값", itemName: "음식값 12500원", unit: "원", box: "지폐", boxName: "10000원짜리 지폐", verb: "낼", lack: "음식값을 모두 낼 수 있게 지폐를 더 내요.", read: k => `10000원짜리 지폐 ${k}장 → ${k * 10000}원`, ok: "10000원짜리 지폐 2장, 최소 20000원을 내야 해요." }),
        (x, y) => rg1Digits(x, y, { tasks: [{ n: "12500", m: "올림", p: 4, unit: "원" }], ok: "12500을 올림하여 만의 자리까지 나타내면 20000이에요. 만의 자리 아래 수인 2500을 10000으로 생각했어요." })]) },
    { inst: "올림의 약속을 완성해 보세요.", hints: ["243 → 250 → 300처럼 아래 수를 올려서 나타냈어요."],
      render: (b, a) => rg1Ask(b, a, [
        { parts: ["구하려는 자리의 아래 수를 ", { o: ["올려서", "버려서"], a: 0 }, " 나타내는 방법을 ", { o: ["올림", "버림", "반올림"], a: 0 }, "이라고 합니다."] },
        { parts: ["올림하여 나타낸 수는 원래 수와 같거나 ", { o: ["커요", "작아요"], a: 0 }, "."] }],
        { ok: "구하려는 자리의 아래 수를 올려서 나타내는 방법을 올림이라고 해요." }) },
    { inst: "소수를 올림하고, 잘못 어림한 사람을 찾아 고쳐 보세요.", hints: ["2.378을 소수 첫째 자리까지 나타낼 때는 0.078을 0.1로 생각해요.", "소수 둘째 자리까지는 0.008을 0.01로 생각해요.", "1248을 올림하면 1248보다 같거나 커야 해요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Digits(x, y, { q: "보기: 5.146을 올림하여 소수 첫째 자리까지 나타내면 5.2, 소수 둘째 자리까지 나타내면 5.15예요. 2.378을 올림해 보세요.", tasks: [{ n: "2.378", m: "올림", p: -1 }, { n: "2.378", m: "올림", p: -2 }], ok: "2.378을 올림하여 소수 첫째 자리까지 나타내면 2.4, 소수 둘째 자리까지 나타내면 2.38이에요." }),
        (x, y) => rg1Ask(x, y, [{ q: "주아와 은찬이는 분리배출하려고 모은 우유갑의 무게를 올림하여 백의 자리까지 나타내었어요. 주아(1572 g): “내가 모은 우유갑의 무게를 어림하면 1600 g이야.” 은찬(1248 g): “내가 모은 우유갑의 무게를 어림하면 1200 g이야.”",
          parts: ["잘못 어림한 사람: ", { o: ["주아", "은찬"], a: 1, why: { "0": "1572를 올림하여 백의 자리까지 나타내면 72를 100으로 생각해서 1600이에요." } }, h("br"), "바르게 고치면 “내가 모은 우유갑의 무게를 어림하면 ", { n: 1300, why: { "1200": "1200은 1248보다 작아요. 올림하면 원래 수와 같거나 커져요." } }, " g이야.”"] }],
          { ok: "은찬이가 잘못 어림했어요. 1248을 올림하여 백의 자리까지 나타내면 48을 100으로 생각해서 1300이에요." })]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 올림을 이용하여 풀어 보세요.", hints: ["올림하면 원래 수와 같거나 커져요.", "45□8을 올림하여 십의 자리까지 나타낸 수가 4530이면 45□8은 4521부터 4530 사이의 수예요.", "탁구공 1425개를 100개씩 담으면 25개가 남아요. 남은 공도 담아야 해요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Ask(x, y, [
        { parts: ["298을 올림하여 십의 자리까지 나타내면 ", { o: ["290", "300", "310"], a: 1, why: { "0": "290은 298보다 작아요. 올림한 수는 원래 수와 같거나 커요.", "2": "8을 10으로 생각하면 298 → 300이에요." } }, h("br"), "36.51을 올림하여 소수 첫째 자리까지 나타내면 ", { n: 36.6, why: { "36.5": "36.5는 버림한 수예요. 0.01을 0.1로 생각해요." } }] },
        { q: "올림하여 십의 자리까지 나타내면 십의 자리 숫자가 2가 되는 수를 모두 골라 보세요.", parts: [{ o: ["729", "845", "720", "697", "713"], multi: true, a: [2, 4], why: { "0,2,4": "729를 올림하면 730이에요." } }] }],
        { ok: "300, 36.6이에요. 720은 그대로 720, 713은 720이 되어 십의 자리 숫자가 2예요." }),
      (x, y) => rg1Ask(x, y, [
        { q: "은결: 5202를 올림하여 백의 자리까지 / 소민: 5419를 올림하여 십의 자리까지 / 슬아: 5100을 올림하여 천의 자리까지", parts: ["나타낸 수가 가장 작은 사람은 ", { o: ["은결", "소민", "슬아"], a: 0 }, "이에요."] },
        { parts: ["45□8을 올림하여 십의 자리까지 나타내면 4530이에요. □ 안에 알맞은 수는 ", { n: 2 }, "예요."] },
        { q: "탁구공 1425개를 100개씩 담는 상자에만 담아서 팔려고 해요.", parts: ["상자에 담아야 하는 탁구공은 최소 ", { n: 1500 }, "개이고, 상자는 최소 ", { n: 15, why: { "14": "14상자에는 1400개만 담을 수 있어 25개가 남아요." } }, "상자 필요해요."] }],
        { ok: "은결이는 5300, 소민이는 5420, 슬아는 6000이라 은결이가 가장 작아요. □는 2, 탁구공은 1500개, 15상자예요." })]) }
},
{
  id: "r6", no: 6, title: "버림을 알아볼까요", soop: "개념 구축하기(O)",
  question: "스티커 228개를 기념품으로 바꿀 때 최대로 사용할 수 있는 스티커의 수를 어떻게 구할 수 있을까요?",
  summary: "구하려는 자리의 아래 수를 버려서 나타내는 방법을 버림이라고 해요. 228을 버림하여 십의 자리까지 나타내면 8을 0으로 생각하여 220, 백의 자리까지 나타내면 28을 0으로 생각하여 200이에요. 버림한 수는 원래 수와 같거나 작아요.",
  steps: [
    { inst: "축제에서 모은 스티커가 228개예요. 안내 직원: “스티커 10개는 사과주스 1병으로 바꿀 수 있고, 스티커 100개는 모자 1개로 바꿀 수 있어요.” 바꾸는 횟수를 늘리고 줄여 최대로 사용할 수 있는 스티커의 수를 찾아보세요.", hints: ["스티커 8개로는 사과주스를 바꿀 수 없어요.", "스티커 28개로는 모자를 바꿀 수 없어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Pack(x, y, { q: "① 스티커 10개씩 사과주스로 바꿔요.", n: 228, u: 10, mode: "floor", item: "스티커", itemName: "모은 스티커 228개", unit: "개", box: "사과주스", boxName: "사과주스로 바꾼 스티커(10개씩)", verb: "바꿀", read: k => k * 10 > 228 ? `사과주스 ${k}병 → 스티커가 ${k * 10 - 228}개 모자라요` : `사과주스 ${k}병 → 스티커 ${k * 10}개 사용, ${228 - k * 10}개 남음`, ok: "사과주스 22병으로 바꾸고 스티커 220개를 사용해요. 남은 8개로는 바꿀 수 없어요." }),
        (x, y) => rg1Pack(x, y, { q: "② 스티커 100개씩 모자로 바꿔요.", n: 228, u: 100, mode: "floor", item: "스티커", itemName: "모은 스티커 228개", unit: "개", box: "모자", boxName: "모자로 바꾼 스티커(100개씩)", verb: "바꿀", read: k => k * 100 > 228 ? `모자 ${k}개 → 스티커가 ${k * 100 - 228}개 모자라요` : `모자 ${k}개 → 스티커 ${k * 100}개 사용, ${228 - k * 100}개 남음`, ok: "모자 2개로 바꾸고 스티커 200개를 사용해요. 남은 28개로는 바꿀 수 없어요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["사과주스로 바꿀 때 최대 ", { n: 220, why: { "230": "230개를 쓰려면 스티커가 2개 모자라요." } }, "개, 모자로 바꿀 때 최대 ", { n: 200, why: { "300": "300개를 쓰려면 스티커가 72개 모자라요." } }, "개의 스티커를 사용할 수 있어요."] }],
          { ok: "사과주스로는 220개, 모자로는 200개의 스티커를 사용할 수 있어요." })]) },
    { inst: "228을 어림하는 방법을 숫자로 살펴봐요. 구하려는 자리의 숫자를 누르면 그 아래 수를 어떻게 생각하는지 보여요.", hints: ["십의 자리까지 나타낼 때는 일의 자리 숫자 8을 0으로 생각해요.", "백의 자리까지 나타낼 때는 28을 0으로 생각해요."],
      render: (b, a) => rg1Digits(b, a, { tasks: [{ n: "228", m: "버림", p: 1 }, { n: "228", m: "버림", p: 2 }], ok: "228을 버림하여 십의 자리까지 나타내면 220, 백의 자리까지 나타내면 200이에요." }) },
    { inst: "문구점에서 23140원으로 1000원짜리 공책을 사려고 해요. 공책을 살 수 있는 돈은 최대 얼마인지 알아보세요.", hints: ["공책 23권이면 23000원이에요.", "남은 140원으로는 공책을 살 수 없어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Pack(x, y, { n: 23140, u: 1000, mode: "floor", item: "가진 돈", itemName: "가진 돈 23140원", unit: "원", box: "공책", boxName: "1000원짜리 공책", verb: "살", read: k => k * 1000 > 23140 ? `공책 ${k}권 → ${k * 1000 - 23140}원이 모자라요` : `공책 ${k}권 → ${k * 1000}원, 남은 돈 ${23140 - k * 1000}원`, ok: "공책 23권을 살 수 있어요. 공책을 살 수 있는 돈은 최대 23000원이에요." }),
        (x, y) => rg1Digits(x, y, { tasks: [{ n: "23140", m: "버림", p: 3, unit: "원" }], ok: "23140을 버림하여 천의 자리까지 나타내면 23000이에요. 천의 자리 아래 수인 140을 0으로 생각했어요." })]) },
    { inst: "버림의 약속을 완성해 보세요.", hints: ["228 → 220 → 200처럼 아래 수를 버려서 나타냈어요."],
      render: (b, a) => rg1Ask(b, a, [
        { parts: ["구하려는 자리의 아래 수를 ", { o: ["올려서", "버려서"], a: 1 }, " 나타내는 방법을 ", { o: ["올림", "버림", "반올림"], a: 1 }, "이라고 합니다."] },
        { parts: ["버림하여 나타낸 수는 원래 수와 같거나 ", { o: ["커요", "작아요"], a: 1 }, ". 올림은 ‘최소’, 버림은 ‘", { o: ["최소", "최대"], a: 1 }, "’를 구할 때 쓸 수 있어요."] }],
        { ok: "구하려는 자리의 아래 수를 버려서 나타내는 방법을 버림이라고 해요." }) },
    { inst: "과일의 무게를 버림하여 나타내고, 여행 가방의 비밀번호를 구해 보세요.", hints: ["214.357을 소수 둘째 자리까지 나타낼 때는 0.007을 0으로 생각해요.", "버림하여 십의 자리까지 나타내면 420이 되는 수는 420부터 429까지예요.", "그중 일의 자리 숫자가 1인 수를 찾아 자물쇠를 돌려요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Digits(x, y, { q: "사과 214.357 g을 버림하여 소수 첫째 자리까지 나타내면 214.3 g이에요. 빈칸을 채워 보세요.", tasks: [{ pre: "사과 ", n: "214.357", m: "버림", p: -2, unit: "g" }, { pre: "배 ", n: "520.413", m: "버림", p: -1, unit: "g" }], ok: "사과는 214.35 g, 배는 520.4 g이에요. (배를 소수 둘째 자리까지 나타내면 520.41 g)" }),
        (x, y) => { x.append(h("p", { class: "rg1q" }, "여행 가방의 비밀번호를 구해 보세요. “비밀번호를 버림하여 십의 자리까지 나타내면 420이야.” “비밀번호의 일의 자리 숫자는 1이야.”"));
          return rg1Lock(x, y, { ans: 421, why: v => Math.floor(v / 10) * 10 !== 420 ? `${rg1J(String(v).padStart(3, "0"), "을/를")} 버림하여 십의 자리까지 나타내면 ${Math.floor(v / 10) * 10}이에요. 420이 되어야 해요.` : "버림하여 십의 자리까지 나타내면 420이 맞아요. 일의 자리 숫자도 살펴봐요.", ok: "비밀번호는 421이에요. 421을 버림하여 십의 자리까지 나타내면 420이에요." }); }]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 버림을 이용하여 풀어 보세요.", hints: ["버림하면 원래 수와 같거나 작아져요.", "버림하여 백의 자리까지 나타내면 1700이 되는 수는 1700부터 1799까지예요.", "125 초과 132 이하인 수 중에서 버림하여 십의 자리까지 130이 되는 수는 130, 131, 132예요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Ask(x, y, [
        { parts: ["239를 버림하여 십의 자리까지 나타내면 ", { o: ["230", "240", "250"], a: 0, why: { "1": "240은 239보다 커요. 버림한 수는 원래 수와 같거나 작아요." } }, h("br"), "7.914를 버림하여 소수 둘째 자리까지 나타내면 ", { n: 7.91 }] },
        { q: "버림하여 백의 자리까지 나타내면 1700이 되는 수를 모두 골라 보세요.", parts: [{ o: ["1812", "1708", "1790", "1656"], multi: true, a: [1, 2] }] },
        { q: "버림하여 소수 첫째 자리까지 나타낸 수가 다른 하나를 골라 보세요.", parts: [{ o: ["㉠ 2.615", "㉡ 2.738", "㉢ 2.609"], a: 1 }] }],
        { ok: "230, 7.91이에요. 1708과 1790은 1700이 돼요. ㉠과 ㉢은 2.6, ㉡은 2.7이에요." }),
      (x, y) => rg1Ask(x, y, [
        { q: "승아는 3718을 버림하여 천의 자리까지, 영호는 2194를 버림하여 십의 자리까지 나타냈어요.", parts: ["두 사람이 나타낸 수의 합은 ", { n: 5190 }, "이에요."] },
        { q: "달걀 1846개를 한 상자에 10개씩 포장하여 팔려고 해요.", parts: ["팔 수 있는 달걀은 최대 ", { n: 1840 }, "개이고, 최대 ", { n: 184, why: { "185": "185상자를 채우려면 달걀이 4개 모자라요." } }, "상자까지 팔 수 있어요."] },
        { q: "125 초과 132 이하인 자연수 중에서 버림하여 십의 자리까지 나타내면 130이 되는 수가 있어요.", parts: ["그중에서 가장 작은 수는 ", { n: 130, why: { "126": "126을 버림하면 120이에요." } }, "이에요."] }],
        { ok: "3000+2190=5190, 달걀은 1840개 184상자, 가장 작은 수는 130이에요." })]) }
},
{
  id: "r7", no: 7, title: "반올림을 알아볼까요", soop: "개념 구축하기(O)",
  question: "축제에 방문한 사람 3482명을 어떻게 어림할 수 있을까요?",
  summary: "구하려는 자리 바로 아래 자리의 숫자가 0, 1, 2, 3, 4이면 버리고, 5, 6, 7, 8, 9이면 올려서 나타내는 방법을 반올림이라고 해요. 3482를 반올림하여 십의 자리까지 나타내면 일의 자리 숫자가 2이므로 3480, 백의 자리까지 나타내면 십의 자리 숫자가 8이므로 3500이에요.",
  steps: [
    { inst: "축제에 방문한 사람은 3482명이에요. 롤러코스터 수직선에 3482를 ↓로 나타내고, 공이 어느 쪽 골짜기로 굴러갈지 골라 보세요. 꼭대기에서 더 가까운 쪽으로 굴러가요.", hints: ["3480~3490 수직선은 눈금 한 칸이 1이에요. 3480에서 오른쪽으로 2칸 가요.", "3400~3500 수직선은 눈금 한 칸이 10이에요. 3480과 3490 사이에 놓아요.", "3482는 3480에서 2, 3490에서 8만큼 떨어져 있어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Coaster(x, y, { q: "① 3480과 3490 사이의 수직선 (눈금 한 칸: 1)", a: 3480, b: 3490, v: 3482, step: 1, snap: 1, ok: "3482는 3490보다 3480에 더 가까워요. 십의 자리까지 어림하면 3480명이에요." }),
        (x, y) => rg1Coaster(x, y, { q: "② 3400과 3500 사이의 수직선 (눈금 한 칸: 10)", a: 3400, b: 3500, v: 3482, step: 10, snap: 1, tol: 2, ok: "3482는 3400보다 3500에 더 가까워요. 백의 자리까지 어림하면 3500명이에요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["방문한 사람 수를 십의 자리까지 어림하면 ", { n: 3480, why: { "3490": "3482는 3490보다 3480에 더 가까워요." } }, "명, 백의 자리까지 어림하면 ", { n: 3500, why: { "3400": "3482는 3400보다 3500에 더 가까워요." } }, "명이에요."] }],
          { ok: "십의 자리까지는 3480명, 백의 자리까지는 3500명으로 어림할 수 있어요." })]) },
    { name: "자리 숫자 살펴보기", inst: "3482를 어림한 수를 자리 숫자로 살펴봐요. 구하려는 자리의 숫자를 누르면 바로 아래 자리의 숫자가 보여요.", hints: ["십의 자리까지 나타낼 때는 일의 자리 숫자 2를 봐요.", "백의 자리까지 나타낼 때는 십의 자리 숫자 8을 봐요."],
      render: (b, a) => rg1Digits(b, a, { tasks: [{ n: "3482", m: "반올림", p: 1 }, { n: "3482", m: "반올림", p: 2 }], ok: "일의 자리 숫자가 2이므로 버려서 3480, 십의 자리 숫자가 8이므로 올려서 3500이에요." }) },
    { inst: "넓이가 26331 m²인 야구장이 있어요. 야구장의 넓이를 반올림하여 나타내 보세요.", hints: ["천의 자리까지 나타낼 때는 백의 자리 숫자 3을 봐요.", "만의 자리까지 나타낼 때는 천의 자리 숫자 6을 봐요."],
      render: (b, a) => rg1Digits(b, a, { tasks: [{ pre: "야구장의 넓이 ", n: "26331", m: "반올림", p: 3, unit: "m²" }, { pre: "야구장의 넓이 ", n: "26331", m: "반올림", p: 4, unit: "m²" }], ok: "백의 자리 숫자가 3이라 버려서 26000 m², 천의 자리 숫자가 6이라 올려서 30000 m²예요." }) },
    { inst: "반올림의 약속을 완성해 보세요.", hints: ["롤러코스터 꼭대기는 5예요. 5는 0부터 9까지 10개 수 중 오른쪽 절반에 있어요.", "3485의 일의 자리 숫자는 5예요."],
      render: (b, a) => rg1Ask(b, a, [
        { parts: ["구하려는 자리 바로 아래 자리의 숫자가 0, 1, 2, 3, 4이면 ", { o: ["버리고", "올리고"], a: 0 }, ", 5, 6, 7, 8, 9이면 ", { o: ["버려서", "올려서"], a: 1 }, " 나타내는 방법을 ", { o: ["올림", "버림", "반올림"], a: 2 }, "이라고 합니다."] },
        { parts: ["롤러코스터 꼭대기에 있는 3485를 반올림하여 십의 자리까지 나타내면 ", { n: 3490, why: { "3480": "바로 아래 자리 숫자가 5이면 올려요. 5는 0~9 중 오른쪽 절반에 있어요." } }, "이에요."] }],
        { ok: "바로 아래 자리의 숫자가 0~4이면 버리고 5~9이면 올려요. 이 방법이 반올림이에요." }) },
    { inst: "소수를 반올림하고, 독도 그림에서 수를 골라 반올림해 보세요.", hints: ["6.253을 소수 첫째 자리까지 나타낼 때는 소수 둘째 자리 숫자 5를 봐요.", "187554를 만의 자리까지 나타낼 때는 천의 자리 숫자 7을 봐요.", "168.5를 일의 자리까지 나타낼 때는 소수 첫째 자리 숫자 5를 봐요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Digits(x, y, { q: "보기: 7.936을 반올림하여 소수 첫째 자리까지 나타내면 7.9, 소수 둘째 자리까지 나타내면 7.94예요. 6.253을 반올림해 보세요.", tasks: [{ n: "6.253", m: "반올림", p: -1 }, { n: "6.253", m: "반올림", p: -2 }], ok: "6.253 → 6.3(소수 둘째 자리 숫자 5를 올림), 6.25(소수 셋째 자리 숫자 3을 버림)예요." }),
        (x, y) => rg1Ask(x, y, [{ q: "독도에 대해 조사하여 그린 그림이에요. (출처: 외교부 독도, 2024)", fig: rg1Dokdo,
          parts: ["독도의 전체 넓이를 반올림하여 만의 자리까지 나타내면 ", { n: 190000, why: { "180000": "천의 자리 숫자가 7이라 올려요." } }, " m²", h("br"),
            "서도의 높이를 반올림하여 일의 자리까지 나타내면 ", { n: 169, why: { "168": "소수 첫째 자리 숫자가 5라 올려요." } }, " m", h("br"),
            "동도의 높이를 반올림하여 일의 자리까지 나타내면 ", { n: 99 }, " m"] }],
          { ok: "독도의 넓이는 약 190000 m², 서도의 높이는 약 169 m, 동도의 높이는 약 99 m예요." })]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 반올림을 이용하여 풀어 보세요.", hints: ["반올림은 구하려는 자리 바로 아래 자리의 숫자만 봐요.", "6.253을 반올림하여 일의 자리까지 나타내면 소수 첫째 자리 숫자 2를 봐요.", "214985 + 189863을 먼저 계산해요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Ask(x, y, [
        { parts: ["4056을 반올림하여 천의 자리까지 나타내면 ", { o: ["4000", "5000", "6000"], a: 0, why: { "1": "백의 자리 숫자가 0이라 버려요." } }, h("br"), "13.458을 반올림하여 소수 첫째 자리까지 나타내면 ", { n: 13.5, why: { "13.4": "소수 둘째 자리 숫자가 5라 올려요." } }] },
        { q: "반올림하여 십의 자리까지 나타낸 수가 2480이 아닌 수를 골라 보세요.", parts: [{ o: ["2477", "2484", "2486", "2479"], a: 2 }] },
        { parts: ["하루네 집에서 학교까지의 거리 284 m를 반올림하여 백의 자리까지 나타내면 ", { n: 300 }, " m예요."] }],
        { ok: "4000, 13.5예요. 2486은 2490이 돼요. 284 m는 약 300 m예요." }),
      (x, y) => rg1Ask(x, y, [
        { q: "㉠ 6.253을 반올림하여 일의 자리까지, ㉡ 6.174를 반올림하여 소수 첫째 자리까지, ㉢ 6.319를 반올림하여 소수 둘째 자리까지 나타내 보세요.", parts: ["㉠ ", { n: 6 }, ", ㉡ ", { n: 6.2 }, ", ㉢ ", { n: 6.32 }, h("br"), "작은 수부터 차례대로: ", { o: ["㉠, ㉡, ㉢", "㉡, ㉠, ㉢", "㉢, ㉡, ㉠"], a: 0 }] },
        { q: "어느 지역의 남자 관람객은 214985명, 여자 관람객은 189863명이에요.", parts: ["전체 관람객은 ", { n: 404848 }, "명이고, 반올림하여 만의 자리까지 나타내면 ", { n: 400000, why: { "410000": "천의 자리 숫자가 4라 버려요." } }, "명이에요."] }],
        { ok: "6 < 6.2 < 6.32예요. 전체 관람객 404848명은 약 400000명이에요." })]) }
},
{
  id: "r8", no: 8, title: "올림, 버림, 반올림을 활용하여 문제를 해결해 볼까요", soop: "개념 구축하기(O)",
  question: "실생활 상황에 알맞은 어림 방법은 어떻게 고를까요?",
  summary: "10개씩 담고 남은 것은 팔 수 없으면 버림(최대), 남은 사람도 모두 타야 하면 올림(최소), 대략의 값을 말할 때는 반올림을 써요. 사과파이 485개는 48상자까지 팔 수 있고, 124명이 모두 타려면 버스는 13번 운행해야 해요.",
  steps: [
    { inst: "사과파이 판매점: “사과파이 485개를 한 상자에 10개씩 담아 판매하고 있어요.” “그럼 사과파이를 최대 몇 상자까지 판매할 수 있나요?” 10개보다 적은 사과파이는 어떻게 해야 할지 생각해 보세요.", hints: ["10개씩 담고 남은 사과파이 5개는 한 상자를 채울 수 없어요.", "남은 것을 버리고 생각하는 방법이에요.", "상자 48개면 480개를 담고 5개가 남아요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Ask(x, y, [{ parts: ["알맞은 어림 방법: ", { o: ["올림", "버림", "반올림"], a: 1, why: { "0": "올림하면 490이 되어 49상자예요. 사과파이는 485개뿐인데 49상자 모두 10개씩 담을 수 있을까요?", "2": "485는 반올림하면 490이지만 483이라면 480이 돼요. 반올림은 남은 사과파이를 어떻게 할지 생각하지 않아요." } }] }], { ok: "10개씩 담고 남은 사과파이 5개는 팔 수 없으므로 버림해요." }),
        (x, y) => rg1Pack(x, y, { n: 485, u: 10, mode: "floor", item: "사과파이", itemName: "사과파이 485개", unit: "개", box: "상자", boxName: "10개씩 담은 상자", verb: "채울", read: k => k * 10 > 485 ? `상자 ${k}개 → 사과파이가 ${k * 10 - 485}개 모자라요` : `상자 ${k}개 → 사과파이 ${k * 10}개, 남은 사과파이 ${485 - k * 10}개`, ok: "485를 버림하여 십의 자리까지 나타내면 480이에요. 48상자까지 팔 수 있어요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["사과파이는 최대 ", { n: 48, why: { "49": "49상자를 채우려면 사과파이가 5개 모자라요." } }, "상자까지 판매할 수 있어요."] }], { ok: "485 → 480 → 48상자예요." })]) },
    { inst: "축제 버스 정류장: “버스를 한 번 운행할 때 10명씩 탈 수 있어요.” “124명이 모두 타려면 버스는 최소 몇 번 운행해야 하는 걸까?” 10명보다 적은 인원은 어떻게 해야 할지 생각해 보세요.", hints: ["10명씩 타고 남은 4명도 버스를 타야 해요.", "남은 사람을 위해 한 번 더 운행해요.", "124를 올림하여 십의 자리까지 나타내면 130이에요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Ask(x, y, [{ parts: ["알맞은 어림 방법: ", { o: ["올림", "버림", "반올림"], a: 0, why: { "1": "버림하면 120이 되어 12번 운행해요. 그러면 남은 4명은 어떻게 하죠?", "2": "반올림하면 120이 되어 12번 운행해요. 그러면 남은 4명은 어떻게 하죠?" } }] }], { ok: "10명씩 타고 남은 4명도 타야 하므로 올림해요." }),
        (x, y) => rg1Pack(x, y, { n: 124, u: 10, mode: "ceil", item: "사람", itemName: "버스를 탈 사람 124명", unit: "명", box: "버스 운행", boxName: "버스 운행(한 번에 10명)", verb: "태울", lack: "모두 탈 수 있게 운행 횟수를 늘려요.", read: k => `버스 ${k}번 운행 → ${k * 10}명까지 탈 수 있어요`, ok: "124를 올림하여 십의 자리까지 나타내면 130이에요. 버스는 13번 운행해야 해요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["버스는 최소 ", { n: 13, why: { "12": "12번 운행하면 120명만 탈 수 있어 4명이 남아요." } }, "번 운행해야 해요."] }], { ok: "124 → 130 → 13번이에요." })]) },
    { inst: "버섯 매장: “어제 판매액은 4836200원이었고, 오늘 예상 판매액은 5370000원이에요.” 어제 판매액과 오늘 예상 판매액을 반올림하여 나타내 보세요.", hints: ["십만의 자리까지 나타낼 때는 만의 자리 숫자를 봐요.", "백만의 자리까지 나타낼 때는 십만의 자리 숫자를 봐요."],
      render: (b, a) => rg1Digits(b, a, { tasks: [{ pre: "어제 판매액 ", n: "4836200", m: "반올림", p: 5, unit: "원" }, { pre: "오늘 예상 판매액 ", n: "5370000", m: "반올림", p: 5, unit: "원" }, { pre: "어제 판매액 ", n: "4836200", m: "반올림", p: 6, unit: "원" }, { pre: "오늘 예상 판매액 ", n: "5370000", m: "반올림", p: 6, unit: "원" }],
        ok: "십만의 자리까지는 어제 4800000원, 오늘 5400000원이고, 백만의 자리까지는 둘 다 5000000원이에요." }) },
    { name: "정리하기", inst: "여러 가지 상황에 알맞은 어림 방법을 찾아 카드를 옮겨 보세요.", hints: ["남은 것까지 모두 담거나 태워야 하면 올림이에요.", "남은 것은 쓸 수 없고 최대를 구하면 버림이에요.", "가장 가까운 값이나 대략의 수를 말하면 반올림이에요."],
      render: (b, a) => rg1Sort(b, a, { bins: ["올림", "버림", "반올림"],
        cards: [{ t: "한 개에 10명까지 앉는 의자에 246명이 모두 앉을 때 필요한 최소 의자 수", b: 0 }, { t: "동전 7300원을 1000원짜리 지폐로 최대 몇 장 바꿀 수 있을까?", b: 1 }, { t: "발 길이 21.8 cm를 1 cm 단위로 가장 가까운 눈금으로 나타내기", b: 2 },
          { t: "복숭아 572개를 10개씩 상자에 담아 최대 몇 개를 팔까?", b: 1 }, { t: "학생 307명에게 1자루씩 주려고 10자루씩 묶음으로 연필을 살 때 최소 몇 자루?", b: 0 }, { t: "줄넘기 459번을 대략 몇 번 했다고 말하기", b: 2 }, { t: "끈 734 cm를 1 m씩 잘라 최대 몇 도막을 만들까?", b: 1 }],
        ok: "남은 것도 모두 필요하면 올림, 남은 것을 쓸 수 없으면 버림, 가까운 값을 말할 때는 반올림을 써요." }) },
    { inst: "어림하는 방법을 바르게 골랐는지 확인해 보세요.", hints: ["3159를 올림하여 백의 자리까지 나타내면 3200이에요. 반올림하면 십의 자리 숫자 5를 보고 올려요.", "1800 + 1500 = 3300원을 1000원짜리 지폐로만 내려면 올림해야 해요."],
      render: (b, a) => rg1Ask(b, a, [
        { q: "3159를 어림하여 3200으로 나타내는 방법을 모두 골라 보세요.", parts: [{ o: ["올림하여 십의 자리까지", "올림하여 백의 자리까지", "버림하여 백의 자리까지", "반올림하여 백의 자리까지", "반올림하여 천의 자리까지"], multi: true, a: [1, 3], why: { "1": "3200이 되는 방법이 하나 더 있어요. 반올림도 살펴봐요.", "3": "3200이 되는 방법이 하나 더 있어요. 올림도 살펴봐요." } }] },
        { q: "1800원인 크림빵과 1500원인 감자빵을 1000원짜리 지폐로만 사려고 해요. 서빈: “반올림하여 3000원을 내야 해.” 하영: “올림하여 4000원을 내야 해.” 영은: “버림하여 3000원을 내야 해.”", parts: ["바르게 말한 사람은 ", { o: ["서빈", "하영", "영은"], a: 1, why: { "0": "3000원을 내면 300원이 부족해요.", "2": "3000원을 내면 300원이 부족해요." } }, "이에요."] }],
        { ok: "3159는 올림이나 반올림하여 백의 자리까지 나타내면 3200이에요. 빵값 3300원은 올림하여 4000원을 내야 해요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 알맞은 어림 방법으로 문제를 해결해 보세요.", hints: ["7300원을 1000원짜리 지폐로 바꾸면 남은 300원은 바꿀 수 없어요.", "246명이 모두 앉아야 해요.", "도하는 가장 가까운 눈금을 읽었어요."],
    render: (b, a) => rg1Ask(b, a, [
      { q: "동전 7300원을 1000원짜리 지폐로 바꾸려고 해요.", parts: ["7300원을 ", { o: ["올림", "버림", "반올림"], a: 1 }, "하여 ", { n: 7000 }, "원으로 생각하면, 지폐로 최대 ", { n: 7 }, "장까지 바꿀 수 있어요."] },
      { q: "한 개에 10명까지 앉을 수 있는 긴 의자에 246명이 모두 앉으려고 해요.", parts: ["필요한 의자는 최소 ", { n: 25, why: { "24": "24개에는 240명만 앉을 수 있어 6명이 남아요." } }, "개예요."] },
      { q: "도하: 발 길이 21.8 cm를 1 cm 단위로 가장 가까운 눈금을 읽어 22 cm / 준기: 복숭아 572개를 10개씩 담아 570개 / 하림: 끈 734 cm를 1 m씩 잘라 7개", parts: ["어림하는 방법이 다른 사람은 ", { o: ["도하", "준기", "하림"], a: 0 }, "예요."] }],
      { ok: "7300 → 7000원, 지폐 7장, 의자 25개예요. 도하는 반올림, 준기와 하림이는 버림을 했어요." }) }
},
{
  id: "r9", no: 9, title: "생각을 더하다 ― 택배 요금은 얼마일까요", soop: "탐구 정리하기(O)",
  question: "상자의 무게와 크기가 속하는 수의 범위를 이용하여 택배 요금을 구할 수 있을까요?",
  summary: "택배 요금은 상자의 무게와 크기에 따라 정해지고, 무게에 따른 요금과 크기에 따른 요금이 다르면 더 높은 요금으로 정해요. 상자의 크기는 가로, 세로, 높이의 합이에요. 무게와 크기가 각각 어느 범위(초과·이하)에 속하는지 찾아 요금을 구해요.",
  steps: [
    { name: "요금표 살펴보기", inst: "수학+경제: 택배 요금은 보낼 물건을 담은 상자의 무게와 크기에 따라 정해지고, 무게에 따른 요금과 크기에 따른 요금이 다른 경우 더 높은 요금으로 정해져요. (출처: 찾기쉬운 생활법령정보, 2024) 상자의 무게가 3 kg, 크기가 50 cm라면 택배 요금은 얼마일까요?", hints: ["3 kg은 2 kg 초과 10 kg 이하예요.", "50 cm는 60 cm 이하예요.", "7000원과 6000원 중 더 높은 요금으로 정해요."],
      render: (b, a) => rg1Fee(b, a, { name: "예시 상자", kg: 3, size: 50, ok: "무게에 따른 요금은 7000원, 크기에 따른 요금은 6000원이라 더 높은 7000원이에요." }) },
    { name: "가 상자", inst: "시온이네 반 친구들이 전학 간 친구에게 선물을 보내려고 상자 2개를 준비했어요. 가 상자의 택배 요금을 구해 보세요. 상자의 크기는 ㉠, ㉡, ㉢의 합으로 구해요.", hints: ["27 + 24 + 20 = 71 (cm)", "5 kg은 2 kg 초과 10 kg 이하, 71 cm는 60 cm 초과 120 cm 이하예요."],
      render: (b, a) => rg1Fee(b, a, { name: "가 상자", kg: 5, e: [27, 24, 20] }) },
    { name: "나 상자", inst: "나 상자의 택배 요금을 구하고, 상자 2개의 택배 요금을 모두 더해 보세요.", hints: ["30 + 32 + 28 = 90 (cm)", "12 kg은 10 kg 초과 20 kg 이하라서 8000원이에요.", "무게 8000원, 크기 7000원이면 더 높은 8000원이에요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Fee(x, y, { name: "나 상자", kg: 12, e: [30, 32, 28] }),
        (x, y) => rg1Ask(x, y, [{ parts: ["가 상자 7000원 + 나 상자 8000원 = ", { n: 15000 }, "원"] }], { ok: "시온이네 반이 내야 하는 택배 요금은 모두 15000원이에요." })]) },
    { name: "아영이와 동생", inst: "아영이와 동생이 할아버지께 생신 선물을 보내려고 상자를 하나씩 준비했어요. 두 상자의 택배 요금을 구해 보세요.", hints: ["아영: 38 + 35 + 30 = 103 (cm)", "동생: 40 + 42 + 48 = 130 (cm), 120 cm 초과 140 cm 이하예요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Fee(x, y, { name: "아영이의 상자", kg: 6, e: [38, 35, 30] }),
        (x, y) => rg1Fee(x, y, { name: "동생의 상자", kg: 8, e: [40, 42, 48] }),
        (x, y) => rg1Ask(x, y, [{ parts: ["두 상자의 택배 요금은 모두 ", { n: 15000 }, "원이에요."] }], { ok: "아영이의 상자 7000원, 동생의 상자 8000원으로 모두 15000원이에요." })]) },
    { name: "되돌아보기", inst: "문제를 해결한 방법을 되돌아봐요. 무게의 범위를 수직선에 나타내 보면 경계의 수를 헷갈리지 않아요.", hints: ["2 kg 초과는 2에 ○, 10 kg 이하는 10에 ●이에요.", "무게와 크기 중 하나만 보면 요금이 틀릴 수 있어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Line(x, y, Object.assign(RG1L(0, 12), { q: "7000원인 무게의 범위(2 kg 초과 10 kg 이하)를 수직선에 나타내 보세요.", r: { lo: 2, loInc: false, hi: 10, hiInc: true } })),
        (x, y) => rg1Ask(x, y, [{ parts: ["택배 요금을 구할 때는 무게가 속하는 범위와 크기가 속하는 범위를 ", { o: ["모두", "하나만"], a: 0 }, " 찾고, 두 요금이 다르면 ", { o: ["더 높은", "더 낮은"], a: 0 }, " 요금으로 정해요."] }],
          { ok: "무게와 크기의 범위를 모두 찾고, 더 높은 요금으로 정했어요." })]) }
  ],
  challenge: { inst: "※ 이 자료에서 만든 문제예요(수를 바꾸어 다시 해 보기). 경계에 있는 수에 주의하여 택배 요금을 구해 보세요.", hints: ["10 kg은 ‘10 kg 이하’에 들어가요. 120 cm도 ‘120 cm 이하’에 들어가요.", "2 kg은 ‘2 kg 이하’, 141 cm는 140 cm 초과 160 cm 이하예요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Fee(x, y, { name: "다 상자", kg: 10, e: [50, 40, 30], ok: "10 kg은 2 kg 초과 10 kg 이하, 120 cm는 60 cm 초과 120 cm 이하라서 7000원이에요." }),
      (x, y) => rg1Fee(x, y, { name: "라 상자", kg: 2, e: [60, 41, 40], ok: "무게 2 kg은 6000원, 크기 141 cm는 9000원이라 더 높은 9000원이에요." })]) }
},
{
  id: "r10", no: 10, title: "놀이를 더하다 ― 알쏭달쏭 수를 잡아요", soop: "탐구 정리하기(O)",
  question: "올림, 버림, 반올림을 이용한 문제를 만들고 답을 찾을 수 있을까요?",
  summary: "올림은 구하려는 자리의 아래 수를 올리고, 버림은 버리고, 반올림은 바로 아래 자리의 숫자가 0~4이면 버리고 5~9이면 올려요. 답이 비슷한 수(420, 425, 427, 430)가 많으니 어느 자리까지 나타내는지 꼭 확인해요.",
  steps: [
    { name: "놀이 방법 알기", inst: "반 전체가 두 모둠으로 나누어 하는 놀이예요(준비물: 붙임쪽지, 바구니). 준비하기 순서대로 눌러 보세요.", hints: ["먼저 붙임쪽지를 나누어 가져요.", "문제와 답을 쓰고 확인한 다음에 바구니와 칠판에 붙여요."],
      render: (b, a) => sequence(b, a, ["문제를 쓴 붙임쪽지는 접어 바구니에 넣고, 답을 쓴 붙임쪽지는 칠판에 붙여요.", "반 전체를 두 모둠으로 나누고, 붙임쪽지를 한 사람당 2장씩 나누어 가져요.", "모둠에서 문제를 풀 순서를 정해요.", "한 장에는 올림, 버림, 반올림 중 하나를 이용한 문제를, 다른 한 장에는 답을 써요.", "모둠원끼리 문제와 답이 맞는지 확인해요."], [1, 3, 4, 0, 2],
        { ok: "붙임쪽지 나누기 → 문제와 답 쓰기 → 확인하기 → 바구니와 칠판에 붙이기 → 순서 정하기예요." }) },
    { name: "문제 만들기", inst: "붙임쪽지 2장에 올림, 버림, 반올림을 이용한 문제를 만들어 보세요. 어림할 수와 방법, 나타낼 자리를 고르고 답을 쓰면 모둠 친구(컴퓨터)가 맞는지 확인해 줘요.", hints: ["예) 437을 버림하여 백의 자리까지 → 400", "두 쪽지의 어림 방법을 다르게 해요.", "수에 있는 자리를 골라야 해요. 243에는 천의 자리가 없어요."],
      render: (b, a) => rg1Make(b, a, { n: 2, ok: "문제와 답이 맞아요. 문제 쪽지는 접어 바구니에, 답 쪽지는 칠판에 붙여요." }) },
    { name: "놀이하기", inst: "모둠별로 차례대로 바구니에서 문제를 뽑아 읽고, 칠판에 붙은 답 쪽지 중에서 알맞은 답을 찾아 눌러요. 맞히면 1점! 틀린 문제는 바구니로 돌아가요. 모든 문제를 풀 때까지 해 보세요. (※ 교과서 그림에는 답 쪽지만 있어서 문제는 이 자료에서 만들었어요.)", hints: ["올림·버림은 구하려는 자리의 아래 수를, 반올림은 바로 아래 자리의 숫자를 봐요.", "420, 425, 427, 430처럼 비슷한 답이 있어요. 어느 자리까지인지 확인해요."],
      render: (b, a) => rg1Game(b, a, { ok: "모든 문제의 답을 찾았어요. 점수를 더 많이 얻은 모둠이 이겨요!" }) },
    { name: "전략 세우기", inst: "놀이에서 헷갈렸던 문제를 다시 살펴봐요.", hints: ["올림·버림·반올림을 각각 계산해 보고 500이 되는지 확인해요.", "426.1을 올림하여 일의 자리까지 나타내면 소수 첫째 자리 0.1을 1로 생각해요."],
      render: (b, a) => rg1Ask(b, a, [
        { q: "칠판에 답 쪽지 500이 2장 있어요. 답이 500인 문제를 모두 골라 보세요.", parts: [{ o: ["409를 올림하여 백의 자리까지", "549를 반올림하여 백의 자리까지", "590을 버림하여 백의 자리까지", "550을 반올림하여 백의 자리까지", "451을 버림하여 십의 자리까지"], multi: true, a: [0, 1, 2], why: { "0,1,2,3": "550을 반올림하면 십의 자리 숫자 5를 올려서 600이에요." } }] },
        { parts: ["426.1을 올림하여 일의 자리까지 나타내면 ", { n: 427 }, ", 424.6을 반올림하여 일의 자리까지 나타내면 ", { n: 425 }, "이에요."] }],
        { ok: "같은 답이 나오는 문제도 여러 가지 만들 수 있어요. 어느 자리까지 나타내는지 꼭 확인해요." }) },
    { inst: "놀이를 하며 생각한 것을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 답을 빨리 찾은 나만의 방법을 써 보세요.", tag: "나의 방법", ph: "예) 반올림 문제는 구하려는 자리 바로 아래 숫자만 보고 5보다 작은지 큰지 먼저 생각했어요." },
        { q: "놀이를 하며 지킨 약속이나 알게 된 점을 써 보세요.", tag: "알게 된 점", ph: "예) 뛰지 않고 걸어가서 답을 찾았어요. 올림, 버림, 반올림 문제를 골고루 만들면 더 재미있어요." }]) }
  ],
  challenge: { inst: "또 다른 놀이: 4명이 주사위 2개로 해요. ‘둘레’나 ‘넓이’를 외치며 주사위 2개를 던지고, 두 눈의 수를 직사각형의 가로와 세로로 하여 둘레 또는 넓이를 구한 다음 반올림하여 십의 자리까지 나타내요. 3번 성공해 보세요.", hints: ["둘레 = (가로 + 세로) × 2, 넓이 = 가로 × 세로", "예) 4와 6을 던져 ‘넓이!’ → 24 → 20, ‘둘레!’ → 20 → 20"],
    render: (b, a) => rg1Dice(b, a, { goal: 3, ok: "둘레와 넓이를 구하고 반올림하여 십의 자리까지 잘 나타냈어요." }) }
},
{
  id: "r11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "수의 범위와 올림, 버림, 반올림을 이용하여 문제를 해결할 수 있을까요?",
  summary: "이상·이하는 경계의 수를 포함하고(●), 초과·미만은 포함하지 않아요(○). 올림은 구하려는 자리의 아래 수를 올리고, 버림은 버리고, 반올림은 바로 아래 자리의 숫자가 0~4이면 버리고 5~9이면 올려요. 상황에 따라 알맞은 어림 방법을 골라요.",
  steps: [
    { name: "이상과 이하", inst: "46 이상인 수에 모두 ○표, 49 이하인 수에 모두 △표 해 보세요. 두 가지 표를 모두 하는 수도 있어요.", hints: ["46과 49는 두 범위에 모두 들어가요.", "46 이상: 46, 49, 77, 80 / 49 이하: 17, 28.5, 46, 49"],
      render: (b, a) => rg1Mark(b, a, { vals: [46, 17, 77, 28.5, 49, 80], marks: [{ sym: "○", lo: 46, loInc: true }, { sym: "△", hi: 49, hiInc: true }], ok: "46 이상인 수는 46, 77, 49, 80이고, 49 이하인 수는 46, 17, 28.5, 49예요." }) },
    { name: "범위를 그림에", inst: "수의 범위를 수직선에 나타내 보세요. 한쪽 끝이라도 ●, ○이 틀리면 다른 범위가 돼요.", hints: ["32 이상은 32에 ●, 35 미만은 35에 ○이에요.", "41.5는 41과 42 사이 한가운데예요. 41.5 초과는 ○이에요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Line(x, y, Object.assign(RG1L(30, 37), { q: "① 32 이상 35 미만인 수", r: { lo: 32, loInc: true, hi: 35, hiInc: false } })),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(39, 46, { snap: .5 }), { q: "② 41.5 초과 43 이하인 수 (눈금과 눈금 사이 한가운데도 누를 수 있어요.)", r: { lo: 41.5, loInc: false, hi: 43, hiInc: true }, ok: "41.5에 ○, 43에 ●을 찍고 두 점 사이에 선을 그었어요." }))]) },
    { name: "학생 수 어림하기", inst: "학교별 학생 수를 올림, 버림, 반올림하여 백의 자리까지 나타내 보세요.", hints: ["282 → 올림 300, 버림 200, 반올림은 십의 자리 숫자 8을 봐요.", "308 → 올림 400, 버림 300, 반올림은 십의 자리 숫자 0을 봐요."],
      render: (b, a) => rg1Ask(b, a, [{ fig: () => rg1Tab(["학교", "하늘 초등학교", "새싹 초등학교"], [["학생 수(명)", "282", "308"]], "학교별 학생 수"),
        parts: ["하늘 초등학교: 올림 ", { n: 300 }, ", 버림 ", { n: 200 }, ", 반올림 ", { n: 300 }, h("br"), "새싹 초등학교: 올림 ", { n: 400, why: { "300": "308을 올림하면 8을 100으로 생각해서 400이에요." } }, ", 버림 ", { n: 300 }, ", 반올림 ", { n: 300 }] }],
        { ok: "하늘 초등학교 300, 200, 300 / 새싹 초등학교 400, 300, 300이에요." }) },
    { name: "어림 방법과 범위", inst: "알맞은 어림 방법을 고르고, 수의 범위를 이용하여 입장료를 구해 보세요.", hints: ["100켤레를 채우지 못한 양말은 상자에 담아 기부할 수 없어요.", "8세는 ‘8세 이상 14세 미만’에 들어가요.", "47세와 45세는 20세 이상 65세 미만이에요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Ask(x, y, [{ q: "가은: “양말 357켤레를 상자 1개에 100켤레씩 담아 기부하려면 최대 몇 켤레까지 담을 수 있을까?”", parts: ["필요한 어림 방법: ", { o: ["올림", "버림", "반올림"], a: 1, why: { "0": "올림하면 400켤레인데 양말은 357켤레뿐이에요.", "2": "반올림하면 400켤레인데 양말은 357켤레뿐이에요." } }, " → 최대 ", { n: 300 }, "켤레"] }], { ok: "남은 57켤레는 상자를 채울 수 없으므로 버림하여 300켤레예요." }),
        (x, y) => rg1Sort(x, y, { q: "수현이네 가족이 미술 전시회에 가려고 해요. 가족을 알맞은 입장료 칸으로 옮겨 보세요.", bins: ["8세 미만: 무료", "8세 이상 14세 미만: 2000원", "14세 이상 20세 미만: 4000원", "20세 이상 65세 미만: 7000원", "65세 이상: 무료"],
          cards: [{ t: "수현 11세", b: 1 }, { t: "아버지 47세", b: 3 }, { t: "어머니 45세", b: 3 }, { t: "동생 8세", b: 1, why: { 0: "8세는 8세 미만이 아니에요. ‘8세 이상’에 들어가요." } }],
          ok: "수현이와 동생은 2000원, 아버지와 어머니는 7000원이에요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["수현이네 가족의 입장료는 모두 ", { n: 18000, why: { "16000": "동생(8세)도 2000원을 내요." } }, "원이에요."] }], { ok: "7000 + 7000 + 2000 + 2000 = 18000(원)이에요." })]) },
    { name: "확인하고 정리하기", inst: "수의 범위와 어림하기를 정리해 보세요.", hints: ["양 끝이 ●이면 이상·이하, ○이면 초과·미만이에요.", "417을 버림하여 십의 자리까지 → 7을 0으로", "791을 반올림하여 백의 자리까지 → 십의 자리 숫자 9를 봐요."],
      render: (b, a) => rg1Ask(b, a, [
        { fig: rg1Fig(RG1L(5, 11), { lo: 6, loInc: true, hi: 10, hiInc: true }, "26em"), parts: ["6 이상 10 ", { o: ["이하", "미만"], a: 0 }, "인 수"] },
        { fig: rg1Fig(RG1L(12, 17), { lo: 13, hi: 16 }, "26em"), parts: ["13 ", { o: ["이상", "초과"], a: 1 }, " 16 미만인 수"] },
        { parts: ["252를 올림하여 십의 자리까지 나타내면 260이에요.", h("br"), "417을 버림하여 십의 자리까지 나타내면 ", { n: 410 }, h("br"), "791을 반올림하여 백의 자리까지 나타내면 ", { n: 800, why: { "700": "십의 자리 숫자가 9라 올려요." } }] }],
        { ok: "수의 범위와 올림, 버림, 반올림은 실생활에서 많이 이용돼요." }) }
  ],
  challenge: { inst: "수 카드 6, 1, 3을 한 번씩 모두 사용하여 세 자리 수를 만들려고 해요. 만든 수를 올림하여 백의 자리까지 나타내면 200이 되는 수를 모두 찾아보세요.", hints: ["올림하여 백의 자리까지 나타내면 200이 되는 세 자리 수는 101부터 200까지예요.", "백의 자리 숫자가 1인 수를 만들어요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Cards(x, y, { cards: [6, 1, 3], tasks: [{ q: "올림하여 백의 자리까지 나타내면 200이 되는 수를 모두 만들어 넣어 보세요.", kind: "all", ok: n => rg1Rnd(n, "올림", 2) === 200, show: n => `올림하여 백의 자리까지 나타내면 ${rg1Rnd(n, "올림", 2)}` }], ok: "136과 163이에요." }),
      (x, y) => rg1Ask(x, y, [{ parts: ["윤호: “올림하여 백의 자리까지 나타내었을 때 200이면 백의 자리 숫자는 ", { n: 1 }, "이구나.” 가은: “그럼 만들 수 있는 세 자리 수는 모두 ", { n: 2 }, "개야.”"] }], { ok: "백의 자리 숫자가 1인 136, 163으로 모두 2개예요." })]) }
}
];
