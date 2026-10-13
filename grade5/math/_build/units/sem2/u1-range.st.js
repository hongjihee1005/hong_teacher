//@@APP
const APP={title:"우리 반 현장 체험 학습 준비", unit:"5-2 수학 1. 수의 범위와 어림하기", key:"s52-range-v1", welcome:"우리 반 현장 체험 학습 준비에 온 것을 환영해요", intro:"푸른초등학교 5학년 1반이 별빛 놀이공원으로 현장 체험 학습을 떠나요. 놀이 기구의 키 기준과 나이별 입장료를 이상·이하·초과·미만으로 살펴보고, 기념품 묶음은 올림, 동전을 지폐로 바꾸는 돈은 버림, 예상 방문자 수와 거리는 반올림으로 어림해요. 마지막에는 짐을 학교로 보낼 택배 요금도 정해요."};
//@@UNIT
/* =========================================================
   5-2 수학 1. 수의 범위와 어림하기 — 이야기 버전 단원 조작 부품 (앞글자 rg1, 이야기 전용 rgs)
   교과서 버전(u1-range.tb.js)의 rg1 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   기다리는 시간: 입력칸 900ms(Enter는 blur) · 보기 고르기 260ms · 점 찍기·카드 옮기기·상자 늘리기 1200ms(손을 뗀 뒤).
   수는 모두 코드로 계산해서 채점해요(올림·버림·반올림은 0.001 단위 정수로 바꾸어 계산).
   rg1Line    수직선에 ●(포함)·○(포함하지 않음) 점을 찍고 범위 쪽으로 선 긋기 (점과 선을 다 그리면 확인)
   rg1LineFig 범위를 나타낸 수직선 그림(읽기용)
   rg1Mark    수 카드에 ○표·△표 하기 (표시한 수가 필요한 만큼 되면 확인)
   rg1Sort    카드를 알맞은 칸으로 옮기기 (모두 옮기면 확인)
   rg1Pack    묶음·지폐 수를 늘리고 줄이며 최소(올림)·최대(버림) 찾기
   rg1Digits  구하려는 자리 숫자를 눌러 아래 수를 살펴보고 올림·버림·반올림하기
   rg1Coaster 롤러코스터 수직선에 수를 놓고 가까운 쪽으로 굴러가게 하기(반올림)
   rg1Lock    사물함 비밀번호 자물쇠 (여러 번 돌려 보는 것이 활동이라 '열어 보기' 단추를 남김)
   rg1Fee     택배 요금표에서 무게·크기가 속하는 칸 찾기
   rg1Cards   수 카드로 수를 만들어 조건 확인하기
   rg1Say     수의 범위를 쓴 문장 쓰기('다 썼어요')
   rgsTrip    별빛 놀이공원 안내도 둘러보기   rgsBoardFig 준비 회의 칠판
   rg1Make·rg1Game·rg1Dice  놀이: 알쏭달쏭 어림 퀴즈 / 주사위 어림 놀이
   rg1Ask     빈칸(수)·고르기를 한 번에 채점, rg1Chain 활동을 차례로 열기
   엔진의 hj-multi(한 계단 여러 활동 세기)가 이 부품들을 활동으로 셀 수 있게, 부품마다 매개변수를 (body, api, …)로 쓰고 api.done( 길을 둡니다.
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.rg1fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:manipulation}
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
.rg1ctl button.rg1on{background:var(--night);color:#fff;border-color:var(--night)}
.rg1ctl b{font-family:"Jua",sans-serif;color:var(--night);word-break:keep-all}
.rg1lock{display:flex;gap:.5em;justify-content:center;margin:.5em 0}
.rg1dial{display:flex;flex-direction:column;align-items:center;gap:.2em}
.rg1dial button{border:2px solid var(--line);background:#fff;border-radius:.5em;width:2.6em;font-size:1em}
.rg1dial b{display:grid;place-items:center;width:1.8em;height:2.1em;border:3px solid #6B7B78;border-radius:.4em;background:#FFFDF5;font-family:"Jua",sans-serif;font-size:1.7em}
.rg1notes{display:grid;grid-template-columns:repeat(auto-fill,minmax(5.6em,1fr));gap:.45em;margin:.4em 0}
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
/* 저절로 확인: 기다리는 시간을 그때그때 다르게(입력 900·고르기 260·조작 1200) */
function rg1Auto(ready, sign, run) {
  const kick = autoRun(ready, sign, run, 0); let tm = null;
  return w => { clearTimeout(tm); tm = setTimeout(kick, w == null ? 900 : w); };
}
function rg1Inp(inp, later) {
  inp.addEventListener("input", e => { inp.style.borderColor = ""; if (!e.isComposing) later(900); });
  inp.addEventListener("change", () => later(200));
  inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); inp.blur(); } });
}

/* ---------- 여러 활동을 차례로 (마지막 활동을 마치면 api.done( ) ---------- */
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

/* ---------- 빈칸(수)·고르기 묶음: 다 채우면 저절로 확인 → api.done( ---------- */
function rg1Ask(body, api, items, opts = {}) {
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
  const filled = s => s.pt.o ? (s.pt.multi ? s.v.size >= s.pt.a.length : s.v != null) : s.inp.value.trim() !== "";
  const check = () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) { [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); }); }
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) { all.forEach(s => { if (s.inp) s.inp.readOnly = true; }); api.done(ans, opts.ok); return true; }
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : rg1F(rg1Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
    return false;
  };
  const hasIn = all.some(s => !s.pt.o);
  const later = rg1Auto(() => all.every(filled), () => all.map(val).join("\u0001") + "|" + all.map(s => s.v instanceof Set ? [...s.v].sort().join(",") : "").join(";"), check);
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) later(hasIn ? 600 : 260); });
  all.forEach(s => { if (s.inp) rg1Inp(s.inp, later); });
  body.append(wrap);
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
/* 수직선에 범위 나타내기: o={from,to,step,lab,mid,snap, r:{lo,loInc,hi,hiInc}, q, ok}
   점을 필요한 만큼 찍고 선까지 그으면 1.2초 뒤 저절로 확인 → api.done( */
function rg1Line(body, api, o) {
  const T = o.r, G = rg1Geo(o), H = 112, Y = 64, snap = o.snap || o.step || 1;
  const st = { pts: [], line: null, tool: "in" }; let fin = false;
  if (o.q) body.append(h("p", { class: "rg1q" }, o.q));
  if (o.fig) body.append(typeof o.fig === "function" ? o.fig() : o.fig);
  const tools = h("div", { class: "rg1tools" });
  const TB = [["in", "● 포함하는 점"], ["out", "○ 포함하지 않는 점"], ["line", "━ 선 긋기"]].map(([k, t]) => {
    const b = h("button", { onclick: () => { st.tool = k; TB.forEach(x => x.classList.toggle("rg1on", x === b)); } }, t); return b; });
  TB[0].classList.add("rg1on");
  tools.append(...TB, h("button", { onclick: () => { if (fin) return; st.pts = []; st.line = null; draw(); } }, "↺ 지우기"));
  const svg = makeSvg(G.W, H); svg.setAttribute("class", "rg1fig"); svg.style.cursor = "pointer";
  const base = svgEl("g"), lay = svgEl("g"), hov = svgEl("g"); svg.append(base, lay, hov); rg1Axis(base, o, G, Y);
  const read = h("div", { class: "rg1small" }, "수직선 위를 눌러요. 눈금 위에 손을 올리면 그 자리의 수가 보여요.");
  const snapV = x => { const v = o.from + Math.round((G.V(x) - o.from) / snap) * snap; return Math.max(o.from, Math.min(o.to, Math.round(v * 1e6) / 1e6)); };
  function draw() { lay.innerHTML = ""; rg1DrawRange(lay, G, o, Y, { pts: st.pts, line: st.line }); }
  const name = rg1RName(T), want = rg1Shape(T);
  const judge = () => {
    api.tryOnce();
    const ans = st.pts.map(q => rg1F(q.v) + (q.inc ? "●" : "○")).join(",") + (st.line ? " 선" + st.line.map(v => isFinite(v) ? rg1F(v) : (v > 0 ? "→" : "←")).join("~") : " 선없음");
    const msg = (() => {
      const extra = st.pts.find(q => !want.pts.some(w => rg1Eq(w.v, q.v)));
      if (extra) return `${rg1J(rg1F(extra.v), "은/는")} 범위의 끝이 되는 수가 아니에요. 문제에 나온 수를 수직선에서 찾아 점을 찍어요.`;
      for (const w of want.pts) {
        const q = st.pts.find(z => rg1Eq(z.v, w.v)); if (!q || q.inc === w.inc) continue;
        const word = w.v === T.lo ? (T.loInc ? "이상" : "초과") : (T.hiInc ? "이하" : "미만");
        return w.inc ? `${rg1J("‘" + word + "’", "은/는")} ${rg1J(rg1F(w.v), "을/를")} 포함해요. 포함되는 수는 ●로 나타내요.` : `${rg1J("‘" + word + "’", "은/는")} ${rg1J(rg1F(w.v), "을/를")} 포함하지 않아요. 포함되지 않는 수는 ○로 나타내요.`;
      }
      const same = (a, b) => a === b || rg1Eq(a, b);
      if (!same(st.line[0], want.line[0]) || !same(st.line[1], want.line[1])) {
        if (T.lo != null && T.hi != null) return "두 조건을 모두 만족하는 수는 두 점 사이에 있어요. 두 점 사이를 눌러 선을 그어요.";
        return T.lo != null ? `${rg1J("‘" + (T.loInc ? "이상" : "초과") + "’", "은/는")} ${rg1F(T.lo)}보다 큰 수 쪽이에요. 수직선에서 큰 수는 오른쪽에 있어요.` : `${rg1J("‘" + (T.hiInc ? "이하" : "미만") + "’", "은/는")} ${rg1F(T.hi)}보다 작은 수 쪽이에요. 수직선에서 작은 수는 왼쪽에 있어요.`;
      }
      return null;
    })();
    if (msg) { api.fail(msg, ans); return false; }
    fin = true; api.done(name + " " + ans, o.ok || `${rg1J(name, "을/를")} 수직선에 바르게 나타냈어요.`); return true;
  };
  const later = rg1Auto(() => st.pts.length >= want.pts.length && !!st.line, () => JSON.stringify([st.pts, st.line ? st.line.map(String) : null]), judge);
  svg.addEventListener("pointermove", e => {
    const p = svgPt(svg, e); hov.innerHTML = "";
    if (p.x < G.X(o.from) - 12 || p.x > G.X(o.to) + 12) return;
    const v = snapV(p.x), x = G.X(v);
    hov.append(svgEl("line", { x1: x, y1: Y - 34, x2: x, y2: Y + 6, stroke: RG1C.blue, "stroke-width": 1.5, opacity: .6 }), txt(x, 14, rg1F(v), 16, { fill: RG1C.blue }));
  });
  svg.addEventListener("pointerleave", () => { hov.innerHTML = ""; });
  svg.addEventListener("pointerdown", e => {
    if (fin) return;
    const p = svgPt(svg, e);
    if (st.tool === "line") {
      const c = G.V(p.x);
      if (!st.pts.length) return api.hint("먼저 점을 찍은 다음 선을 그어요.");
      const ps = st.pts.map(q => q.v).sort((a, b) => a - b);
      if (ps.some(v => Math.abs(G.X(v) - p.x) < 6)) return api.hint("점의 왼쪽이나 오른쪽, 선을 그을 쪽을 눌러요.");
      if (ps.length === 1) st.line = c > ps[0] ? [ps[0], Infinity] : [-Infinity, ps[0]];
      else st.line = c < ps[0] ? [-Infinity, ps[0]] : c > ps[1] ? [ps[1], Infinity] : [ps[0], ps[1]];
      draw();
      if (st.pts.length < want.pts.length) api.hint("범위의 끝이 되는 수가 두 개예요. 점을 하나 더 찍은 다음 선을 다시 그어요.");
      return later(1200);
    }
    if (p.x < G.X(o.from) - 14 || p.x > G.X(o.to) + 14) return;
    const v = snapV(p.x), inc = st.tool === "in", ex = st.pts.find(q => rg1Eq(q.v, v));
    if (ex) { if (ex.inc === inc) st.pts = st.pts.filter(q => q !== ex); else ex.inc = inc; }
    else { if (st.pts.length >= 2) return api.hint("점은 두 개까지 찍을 수 있어요. 점을 다시 누르면 지워져요."); st.pts.push({ v, inc }); }
    st.line = null; read.textContent = st.pts.length ? "찍은 점: " + st.pts.map(q => rg1F(q.v) + (q.inc ? " ●" : " ○")).join(", ") + " · 이제 ‘선 긋기’로 선을 그어요." : "수직선 위를 눌러요."; draw();
  });
  api.provide({ words: ["●", "○", name], answers: [name + ": " + want.pts.map(q => rg1F(q.v) + (q.inc ? "에 ●" : "에 ○")).join(", ") + (T.lo != null && T.hi != null ? ", 두 점 사이에 선" : T.lo != null ? ", 오른쪽으로 선" : ", 왼쪽으로 선")] });
  body.append(tools, svg, read, h("div", { class: "rg1small" }, "점을 찍고 선까지 그으면 저절로 확인해요."));
}

/* ---------- 수 카드에 ○표·△표 (필요한 만큼 표시하면 1.2초 뒤 확인 → api.done( ) ---------- */
function rg1Mark(body, api, o) {
  const st = o.vals.map(() => new Set());
  if (o.q) body.append(h("p", { class: "rg1q" }, o.q));
  const wrap = h("div", { class: "rg1marks" }), cells = [];
  const nm = mk => mk.name || rg1RName(mk);
  const right = o.marks.map(mk => o.vals.filter(v => rg1In(mk, v)));
  const need = right.reduce((s, r) => s + r.length, 0);
  const judge = () => {
    api.tryOnce(); let first = null;
    o.vals.forEach((v, i) => { let ok = true; o.marks.forEach((mk, j) => { if (rg1In(mk, v) !== st[i].has(j)) { ok = false; if (!first) first = { v, mk }; } }); cells[i].classList.remove("rg1good", "rg1bad"); if (st[i].size || !ok) cells[i].classList.add(ok ? "rg1good" : "rg1bad"); });
    const ans = o.marks.map((mk, j) => mk.sym + ":" + o.vals.filter((v, i) => st[i].has(j)).map(rg1F).join(",")).join(" / ");
    if (!first) { api.done(ans, o.ok); return true; }
    const { v, mk } = first, inR = rg1In(mk, v), name = nm(mk), vs = rg1F(v);
    const bound = [mk.lo, mk.hi].some(b => b != null && rg1Eq(b, v));
    const wd = mk.lo != null && rg1Eq(mk.lo, v) ? (mk.loInc ? "이상" : "초과") : (mk.hiInc ? "이하" : "미만");
    let msg;
    if (inR) msg = bound ? `${rg1J(vs, "은/는")} ${name}에 들어가요. ${rg1J("‘" + wd + "’", "은/는")} ${rg1J(vs, "과/와")} 같은 수도 포함해요.` : `${mk.sym}표를 하지 않은 수 중에 ${rg1J(name, "이/가")} 더 있어요.`;
    else msg = bound ? `${rg1J(vs, "은/는")} ${name}에 들어가지 않아요. ${rg1J("‘" + wd + "’", "은/는")} ${rg1J(vs, "을/를")} 포함하지 않아요.` : `${rg1J(vs, "은/는")} ${rg1J(name, "이/가")} 아니에요. ${mk.sym}표를 다시 살펴봐요.`;
    api.fail(msg, ans); return false;
  };
  const later = rg1Auto(() => st.reduce((s, x) => s + x.size, 0) >= need, () => st.map(x => [...x].sort().join("")).join("|"), judge);
  o.vals.forEach((v, i) => {
    const btns = o.marks.map((mk, j) => { const b = h("button", { class: mk.sym === "△" ? "rg1tri" : "", "aria-label": nm(mk), onclick: () => { st[i].has(j) ? st[i].delete(j) : st[i].add(j); b.classList.toggle("rg1on"); cell.classList.remove("rg1good", "rg1bad"); later(1200); } }, mk.sym); return b; });
    const cell = h("div", { class: "rg1mk" }, o.labels ? h("small", {}, o.labels[i]) : null, h("b", {}, rg1F(v) + (o.unit ? " " + o.unit : "")), h("div", {}, ...btns));
    cells.push(cell); wrap.append(cell);
  });
  body.append(h("div", { class: "rg1small" }, o.marks.map(mk => `${mk.sym}: ${nm(mk)}`).join("   ·   ")), wrap);
  api.provide({ words: o.marks.map(nm), answers: o.marks.map((mk, j) => `${mk.sym}: ${right[j].map(rg1F).join(", ")}`) });
}

/* ---------- 카드 나누기 (모두 옮기면 1.2초 뒤 확인 → api.done( ) ---------- */
function rg1Sort(body, api, o) {
  const where = o.cards.map(() => -1); let pick = -1;
  if (o.q) body.append(h("p", { class: "rg1q" }, o.q));
  if (o.fig) body.append(typeof o.fig === "function" ? o.fig() : o.fig);
  const tray = h("div", { class: "rg1tray" }), bins = o.bins.map(b => h("div", { class: "rg1bin" }, h("div", { class: "rg1bint" }, b), h("div", { class: "rg1in" })));
  const cardEls = o.cards.map((c, i) => h("button", { class: "rg1card", onclick: e => { e.stopPropagation(); pick = pick === i ? -1 : i; paint(); } }, c.t));
  function paint() {
    cardEls.forEach((el, i) => { el.classList.toggle("rg1pk", pick === i); (where[i] < 0 ? tray : bins[where[i]].lastChild).append(el); });
    bins.forEach(b => b.classList.toggle("rg1tgt", pick >= 0));
    if (!tray.querySelector(".rg1card")) { if (!tray.querySelector("span.rg1small")) tray.append(h("span", { class: "rg1small" }, "카드를 모두 옮겼어요.")); } else [...tray.querySelectorAll("span.rg1small")].forEach(x => x.remove());
  }
  const judge = () => {
    api.tryOnce();
    const ans = o.bins.map((b, k) => b + ":" + o.cards.filter((c, i) => where[i] === k).map(c => c.t).join(",")).join(" / ");
    let bad = -1; o.cards.forEach((c, i) => { const ok = where[i] === c.b; cardEls[i].classList.remove("rg1good", "rg1bad"); cardEls[i].classList.add(ok ? "rg1good" : "rg1bad"); if (!ok && bad < 0) bad = i; });
    if (bad < 0) { api.done(ans, o.ok); return true; }
    const c = o.cards[bad]; api.fail((c.why && c.why[where[bad]]) || c.why0 || o.bad || "빨간 카드를 다시 살펴봐요. 어느 범위에 들어가는지 경계의 수를 잘 살펴요.", ans); return false;
  };
  const later = rg1Auto(() => where.every(w => w >= 0), () => where.join(","), judge);
  bins.forEach((b, k) => b.addEventListener("click", () => { if (pick < 0) return api.hint("먼저 카드를 누른 다음 넣을 칸을 눌러요."); where[pick] = k; cardEls[pick].classList.remove("rg1good", "rg1bad"); pick = -1; paint(); later(1200); }));
  tray.addEventListener("click", () => { if (pick < 0) return; where[pick] = -1; pick = -1; paint(); });
  body.append(h("div", { class: "rg1small" }, "카드를 누르고, 넣을 칸을 눌러요. 잘못 넣은 카드는 다시 눌러 옮길 수 있어요. 모두 옮기면 저절로 확인해요."), tray, h("div", { class: "rg1bins" }, ...bins));
  paint();
  api.provide({ words: o.bins, answers: o.bins.map((b, k) => `${b}: ${o.cards.filter(c => c.b === k).map(c => c.t).join(", ") || "없음"}`) });
}

/* ---------- 묶음에 담기(올림) · 지폐로 바꾸기(버림) ----------
   o={n,u,mode:"ceil"|"floor", item, itemName, unit, box, boxName, verb, lack, read(k), q, ok}
   올림은 모두 담겼을 때, 버림은 더 바꿀 수 없을 때(또는 넘쳤을 때) 1.2초 뒤 확인 → api.done( */
function rg1Pack(body, api, o) {
  const n = o.n, u = o.u, need = o.mode === "ceil" ? Math.ceil(n / u) : Math.floor(n / u), KM = Math.ceil(n / u) + 2, S = KM * u;
  let k = 0;
  if (o.q) body.append(h("p", { class: "rg1q" }, o.q));
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
      if (x1 - x0 > 52) lay.append(txt((x0 + x1) / 2, 41, rg1F(u), 14, { fill: RG1C.blue }));
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
  const judge = () => {
    api.tryOnce(); const ans = o.read(k);
    if (k === need) { ctl.querySelectorAll("button").forEach(b => { b.disabled = true; }); api.done(ans, o.ok); return true; }
    if (o.mode === "ceil") api.fail(k * u < n ? `아직 ${rg1F(n - k * u)}${o.unit}${rg1Jong(o.unit) ? "이" : "가"} 남아요. ${o.lack || "모두 담을 수 있게 더 늘려요."}` : `${o.box} 하나를 빼도 ${o.item}${rg1Jong(o.item) ? "을" : "를"} 모두 ${o.verb || "담을"} 수 있어요. ‘최소’를 생각해요.`, ans);
    else api.fail(k * u > n ? `${o.item}${rg1Jong(o.item) ? "이" : "가"} 모자라요. ${rg1F(k * u)}${o.unit}${rg1Jong(o.unit) ? "이" : "가"} 있어야 해요.` : `남은 ${rg1J(rg1F(n - k * u) + o.unit, "으로/로")} 한 번 더 ${o.verb || "바꿀"} 수 있어요. ‘최대’를 생각해요.`, ans);
    return false;
  };
  const later = rg1Auto(() => o.mode === "ceil" ? k * u >= n : n - k * u < u, () => String(k), judge);
  const set = d => { k = Math.max(0, Math.min(KM, k + d)); draw(); later(1200); };
  const ctl = h("div", { class: "rg1ctl" }, h("button", { onclick: () => set(-10) }, "− 10"), h("button", { onclick: () => set(-1) }, "− 1"), h("button", { onclick: () => set(1) }, "+ 1"), h("button", { onclick: () => set(10) }, "+ 10"), read);
  body.append(svg, ctl, h("div", { class: "rg1small" }, o.mode === "ceil" ? "모두 담길 만큼 늘리면 저절로 확인해요." : "더 바꿀 수 없을 만큼 늘리면 저절로 확인해요."));
  draw();
  api.provide({ words: [o.mode === "ceil" ? "최소" : "최대", o.box], answers: [o.read(need)] });
}

/* ---------- 자리 숫자를 눌러 올림·버림·반올림 ----------
   o.tasks=[{n:"136", m:"올림", p:1, unit:"개", pre:"열쇠고리 "}]  모든 줄의 자리를 누르고 답을 쓰면 저절로 확인 → api.done( */
function rg1Digits(body, api, o) {
  const rows = [];
  const wrap = h("div", { class: "rg1digs" });
  if (o.q) body.append(h("p", { class: "rg1q" }, o.q));
  if (o.fig) body.append(typeof o.fig === "function" ? o.fig() : o.fig);
  const whyOf = (t, w) => {
    if (rg1Eq(w, +t.n)) return `${rg1J(String(t.n), "을/를")} 그대로 썼어요. ${rg1PL(t.p)} 아래 수를 어떻게 할지 생각해요.`;
    for (const m of ["올림", "버림", "반올림"]) if (m !== t.m && rg1Eq(rg1Rnd(t.n, m, t.p), w) && !rg1Eq(rg1Rnd(t.n, t.m, t.p), w)) return `${rg1J(rg1F(w), "은/는")} ${m}한 값이에요. ${t.m === "올림" ? "올림은 아래 수를 올려서" : t.m === "버림" ? "버림은 아래 수를 버려서" : "반올림은 바로 아래 자리 숫자를 보고"} 나타내요.`;
    for (let p = -3; p <= 6; p++) if (p !== t.p && rg1Eq(rg1Rnd(t.n, t.m, p), w) && rg1Low(t.n) < p) return `${rg1J(rg1F(w), "은/는")} ${rg1PL(p)}까지 나타낸 수예요. ${rg1PL(t.p)}까지 나타내요.`;
    return null;
  };
  const judge = () => {
    api.tryOnce(); let msg = null;
    const ans = rows.map(r => r.inp.value.trim() || "-").join(" / ");
    rows.forEach(r => {
      const w = rg1Num(r.inp.value), ok = rg1Eq(w, r.ans);
      r.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)";
      if (!msg && !ok) msg = isNaN(w) ? "빈칸에 수를 써요." : (whyOf(r.t, w) || `${r.t.m}의 뜻을 다시 생각해요.`);
    });
    if (msg) { api.fail(msg, ans); return false; }
    rows.forEach(r => { r.inp.readOnly = true; });
    api.done(ans, o.ok); return true;
  };
  const later = rg1Auto(() => rows.every(r => r.tap && r.inp.value.trim() !== ""), () => rows.map(r => r.inp.value.trim()).join("|"), judge);
  o.tasks.forEach(t => {
    const s = String(t.n), k = s.indexOf("."), L = k < 0 ? s.length : k, ans = rg1Rnd(s, t.m, t.p);
    const row = { t, ans, tap: o.tap === false, el: null };
    const num = h("div", { class: "rg1num" }), say = h("div", { class: "rg1say", hidden: true });
    const digs = [];
    [...s].forEach((ch, i) => {
      if (ch === ".") { num.append(h("span", { class: "rg1dot" }, ".")); return; }
      const ex = i < L ? L - 1 - i : -(i - L);
      const d = h("button", { class: "rg1d", "aria-label": rg1PL(ex) + " 숫자 " + ch, onclick: () => {
        if (o.tap === false) return;
        if (ex !== t.p) { api.hint(`그 숫자 ${rg1J(ch, "은/는")} ${rg1PL(ex)} 숫자예요. ${rg1PL(t.p)} 숫자를 찾아 눌러요.`); return; }
        row.tap = true; digs.forEach(z => { z.d.classList.toggle("rg1tgt", z.ex === t.p); z.d.classList.toggle("rg1low", z.ex < t.p); });
        const V = Math.round(+s * 1000), U = Math.round(Math.pow(10, t.p + 3)), below = (V % U) / 1000, next = s[i + 1] === "." ? s[i + 2] : s[i + 1];
        const unitV = rg1F(Math.pow(10, t.p));
        say.hidden = false;
        say.textContent = t.m === "올림" ? (below ? `${rg1PL(t.p)} 아래 수 ${rg1J(rg1F(below), "을/를")} ${rg1J(unitV, "으로/로")} 생각해서 올려요.` : `${rg1PL(t.p)} 아래 수가 모두 0이라 그대로예요.`)
          : t.m === "버림" ? (below ? `${rg1PL(t.p)} 아래 수 ${rg1J(rg1F(below), "을/를")} 0으로 생각해서 버려요.` : `${rg1PL(t.p)} 아래 수가 모두 0이라 그대로예요.`)
          : `바로 아래 자리인 ${rg1PL(t.p - 1)} 숫자가 ${rg1J(next, "이에요/예요")}. ${+next >= 5 ? "5, 6, 7, 8, 9이니 올려요." : "0, 1, 2, 3, 4이니 버려요."}`;
        if (o.noSay) say.hidden = true;
        later(900);
      } }, h("span", {}, ch), ex < 0 ? h("small", {}, "소수", h("br"), rg1PN(ex).slice(3)) : h("small", {}, rg1PN(ex)));
      digs.push({ d, ex }); num.append(d);
    });
    const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "어림한 수" });
    row.inp = inp; rg1Inp(inp, later);
    inp.addEventListener("input", () => { if (!row.tap && inp.value.trim()) api.hint(`먼저 ‘${t.n}’에서 ${rg1PL(t.p)} 숫자를 눌러 살펴봐요.`); });
    row.el = h("div", { class: "rg1row" }, h("div", { class: "jua" }, `${t.pre || ""}${rg1J(s, "을/를")} ${t.m}하여 ${rg1PL(t.p)}까지 나타내요.`),
      o.tap === false ? null : h("div", { class: "rg1small" }, `${rg1PL(t.p)} 숫자를 눌러요.`), num, say,
      h("div", { class: "rg1ans" }, h("span", {}, "→"), inp, t.unit ? h("span", {}, t.unit) : null));
    rows.push(row); wrap.append(row.el);
  });
  body.append(wrap);
  api.provide({ words: [...new Set(o.tasks.map(t => t.m))].concat(["구하려는 자리"]), answers: rows.map(r => `${r.t.n} → ${rg1F(r.ans)}${r.t.unit || ""}`) });
}

/* ---------- 롤러코스터 수직선(반올림) ----------
   o={a,b,v,step(눈금),snap,tol,q,ok}  ↓를 놓고 굴러갈 쪽을 고르면 확인 → api.done( */
function rg1Coaster(body, api, o) {
  const a = o.a, b = o.b, U = b - a, step = o.step || U / 10, snap = o.snap || step, tol = o.tol == null ? 0 : o.tol;
  const W = 760, m = 60, Y = 206, X = v => m + (v - a) * (W - 2 * m) / U, V = x => a + (x - m) * U / (W - 2 * m);
  const yC = t => Y - 26 - 120 * Math.pow(Math.sin(Math.PI * t), 2);
  if (o.q) body.append(h("p", { class: "rg1q" }, o.q));
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
  let placed = false, busy = false, chosen = null;
  const mid = (o.v - a) * 2 === U, right = (o.v - a) * 2 >= U ? b : a;
  const snapV = x => Math.max(a, Math.min(b, Math.round(Math.round((V(x) - a) / snap) * snap * 1e6) / 1e6 + a));
  svg.addEventListener("pointermove", e => { if (placed) return; const p = svgPt(svg, e); hov.innerHTML = ""; if (p.x < X(a) - 10 || p.x > X(b) + 10) return; const v = snapV(p.x); hov.append(svgEl("line", { x1: X(v), y1: Y - 30, x2: X(v), y2: Y, stroke: RG1C.blue, opacity: .6 }), txt(X(v), 14, rg1F(v), 15, { fill: RG1C.blue })); });
  svg.addEventListener("pointerleave", () => { hov.innerHTML = ""; });
  const ball = (t) => { lay.querySelectorAll(".rg1ball").forEach(x => x.remove()); const c = svgEl("circle", { class: "rg1ball", cx: X(a + t * U), cy: yC(t) - 11, r: 11, fill: RG1C.red, stroke: "#fff", "stroke-width": 2 }); lay.append(c); };
  function pickSide() {
    const s = chosen; if (busy) return false; api.tryOnce();
    if (s !== right) {
      api.fail(mid ? `${rg1F(o.v)}는 두 골짜기에서 똑같이 ${rg1F(U / 2)}만큼 떨어진 꼭대기에 있어요. 반올림에서는 꼭대기의 공(바로 아래 자리 숫자 5)을 큰 쪽으로 굴려요.`
        : `${rg1F(o.v)}에서 ${rg1F(s)}까지는 ${rg1F(Math.abs(o.v - s))}, ${rg1F(right)}까지는 ${rg1F(Math.abs(o.v - right))}만큼 떨어져 있어요. 더 가까운 쪽으로 굴러가요.`, rg1F(s));
      return false;
    }
    busy = true; let t = (o.v - a) / U; const goal = s === a ? 0 : 1;
    const tick = () => { t += (goal - t) * .18; if (Math.abs(goal - t) < .004) t = goal; ball(t); if (t !== goal) requestAnimationFrame(tick); else api.done(`${rg1F(o.v)} → ${rg1F(s)}`, o.ok || `${rg1J(rg1F(o.v), "은/는")} ${rg1F(s)}에 더 가까워요.`); };
    tick(); return true;
  }
  const later = rg1Auto(() => chosen != null, () => String(chosen), pickSide);
  svg.addEventListener("pointerdown", e => {
    if (placed || busy) return; const p = svgPt(svg, e); if (p.x < X(a) - 12 || p.x > X(b) + 12) return;
    const v = snapV(p.x); lay.innerHTML = "";
    const ok = Math.abs(v - o.v) <= tol + 1e-9, x = X(ok ? o.v : v);
    lay.append(svgEl("path", { d: `M${x},${Y - 40} v28 m-8,-10 l8,10 l8,-10`, fill: "none", stroke: ok ? RG1C.blue : RG1C.gray, "stroke-width": 3 }), txt(x, Y - 50, rg1F(ok ? o.v : v), 16, { fill: ok ? RG1C.blue : RG1C.gray }));
    if (!ok) return api.hint(`↓를 놓은 곳은 ${rg1F(v)}예요. ${rg1F(o.v)}의 자리를 다시 찾아 눌러요.`);
    placed = true; hov.innerHTML = ""; ball((o.v - a) / U);
    info.textContent = `${rg1F(o.v)}에 공을 올려놓았어요. 공은 어느 쪽 골짜기로 굴러갈까요?`;
    const sb = [a, b].map(sv => h("button", { onclick: () => { if (busy) return; chosen = sv; sb.forEach(x => x.classList.toggle("rg1on", x.textContent.includes(rg1F(sv)))); later(260); } }, sv === a ? `← ${rg1F(a)} 쪽` : `${rg1F(b)} 쪽 →`));
    ctl.append(...sb);
  });
  api.provide({ words: [mid ? "꼭대기는 큰 쪽" : "더 가까운 쪽"], answers: [`${rg1F(o.v)} → ${rg1F(right)}`] });
  body.append(svg, info, ctl);
}

/* ---------- 자물쇠 (여러 번 돌려 보는 것이 활동이라 '열어 보기' 단추) → api.done( ---------- */
function rg1Lock(body, api, o) {
  const d = [0, 0, 0];
  const show = d.map(() => h("b", {}, "0"));
  body.append(h("div", { class: "rg1lock" }, ...d.map((_, i) => h("div", { class: "rg1dial" },
    h("button", { "aria-label": "올리기", onclick: () => { d[i] = (d[i] + 1) % 10; show[i].textContent = d[i]; } }, "▲"), show[i],
    h("button", { "aria-label": "내리기", onclick: () => { d[i] = (d[i] + 9) % 10; show[i].textContent = d[i]; } }, "▼")))));
  api.provide({ words: o.words || ["버림", "십의 자리"], answers: ["비밀번호 " + o.ans] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const v = d[0] * 100 + d[1] * 10 + d[2];
    if (v === o.ans) return api.done(String(v), o.ok);
    api.fail(o.why(v), String(v));
  } }, "🔓 열어 보기")));
}

/* ---------- 택배 요금 ---------- (찾기쉬운 생활법령정보, 2024의 요금표 — 교과서와 같은 표) */
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
  tb.append(h("tr", {}, h("th", {}, "무게"), h("th", {}, "크기(세 변의 길이의 합)"), h("th", {}, "요금")));
  RG1FEE.forEach((r, i) => {
    const cw = h("td", { class: pick ? "rg1cell" : "" }, rg1FeeTxt(r.w, "kg")), cs = h("td", { class: pick ? "rg1cell" : "" }, rg1FeeTxt(r.s, "cm"));
    cells.w.push(cw); cells.s.push(cs); tb.append(h("tr", {}, cw, cs, h("td", {}, `${r.f}원`)));
  });
  return { el: h("div", { class: "rg1tbl" }, tb), cells };
}
/* 크기(세 변의 합)·두 칸·요금을 모두 채우면 저절로 확인 → api.done( */
function rg1Fee(body, api, o) {
  const size = o.e ? o.e[0] + o.e[1] + o.e[2] : o.size, wr = rg1FeeRow("w", o.kg), sr = rg1FeeRow("s", size), fee = Math.max(RG1FEE[wr].f, RG1FEE[sr].f);
  const sel = { w: -1, s: -1 };
  if (o.q) body.append(h("p", { class: "rg1q" }, o.q));
  body.append(rg1BoxFig(o));
  const sizeIn = h("input", { type: "text", inputmode: "numeric", style: "width:5em;font-size:1.1em;text-align:center", "aria-label": "상자의 크기" });
  if (o.e) body.append(h("p", { class: "sent" }, `상자의 크기: ${o.e[0]} + ${o.e[1]} + ${o.e[2]} = `, sizeIn, " cm"));
  body.append(h("div", { class: "rg1small" }, `요금표에서 무게(${o.kg} kg)가 속하는 칸과 크기가 속하는 칸을 하나씩 눌러요.`));
  const T = rg1FeeTable(true); body.append(T.el);
  const feeIn = h("input", { type: "text", inputmode: "numeric", style: "width:6em;font-size:1.1em;text-align:center", "aria-label": "택배 요금" });
  body.append(h("p", { class: "sent" }, `${o.name || "상자"}의 택배 요금: `, feeIn, " 원"));
  const judge = () => {
    api.tryOnce(); const sv = rg1Num(sizeIn.value), fv = rg1Num(feeIn.value);
    const ans = `${o.e ? "크기 " + (sizeIn.value || "-") + " / " : ""}무게칸 ${sel.w + 1} / 크기칸 ${sel.s + 1} / ${feeIn.value || "-"}원`;
    const mark = (key, ok) => { T.cells[key].forEach(c => c.classList.remove("rg1good", "rg1bad")); if (sel[key] >= 0) T.cells[key][sel[key]].classList.add(ok ? "rg1good" : "rg1bad"); };
    if (o.e && sv !== size) { sizeIn.style.borderColor = "var(--no)"; api.fail("상자의 크기는 ㉠, ㉡, ㉢ 세 길이를 모두 더해서 구해요.", ans); return false; }
    if (o.e) sizeIn.style.borderColor = "var(--ok)";
    mark("w", sel.w === wr); mark("s", sel.s === sr);
    if (sel.w !== wr) { api.fail(`${o.kg} kg은 ‘${rg1FeeTxt(RG1FEE[sel.w].w, "kg")}’에 들어가지 않아요. ‘초과’는 그 수를 포함하지 않고, ‘이하’는 포함해요.`, ans); return false; }
    if (sel.s !== sr) { api.fail(`${size} cm는 ‘${rg1FeeTxt(RG1FEE[sel.s].s, "cm")}’에 들어가지 않아요. 경계의 수를 포함하는지 살펴봐요.`, ans); return false; }
    if (fv !== fee) { feeIn.style.borderColor = "var(--no)"; api.fail(RG1FEE[wr].f !== RG1FEE[sr].f && fv === Math.min(RG1FEE[wr].f, RG1FEE[sr].f) ? "무게에 따른 요금과 크기에 따른 요금이 다르면 더 높은 요금으로 정해요." : "고른 두 칸의 요금을 살펴보고, 다르면 더 높은 요금을 써요.", ans); return false; }
    feeIn.style.borderColor = "var(--ok)"; sizeIn.readOnly = feeIn.readOnly = true;
    api.done(ans, o.ok || `무게 ${RG1FEE[wr].f}원, 크기 ${RG1FEE[sr].f}원이라 택배 요금은 ${fee}원이에요.`); return true;
  };
  const later = rg1Auto(() => (!o.e || sizeIn.value.trim() !== "") && sel.w >= 0 && sel.s >= 0 && feeIn.value.trim() !== "", () => [sizeIn.value, sel.w, sel.s, feeIn.value].join("|"), judge);
  ["w", "s"].forEach(key => T.cells[key].forEach((c, i) => c.addEventListener("click", () => { sel[key] = i; T.cells[key].forEach((x, j) => { x.classList.toggle("rg1pk", j === i); x.classList.remove("rg1good", "rg1bad"); }); later(600); })));
  rg1Inp(sizeIn, later); rg1Inp(feeIn, later);
  api.provide({ words: ["더 높은 요금", rg1FeeTxt(RG1FEE[wr].w, "kg"), rg1FeeTxt(RG1FEE[sr].s, "cm")], answers: [`${o.e ? `크기 ${size} cm, ` : ""}무게 ${RG1FEE[wr].f}원, 크기 ${RG1FEE[sr].f}원 → ${fee}원`] });
}

/* ---------- 수 카드로 수 만들기 (카드를 다 쓰면 저절로 확인 → api.done( ) ----------
   o={cards:[3,6,9], tasks:[{q, kind:"best"|"all", ok:n=>bool, cmp:"max"|"min", show:n=>글}]} */
function rg1Cards(body, api, o) {
  const perms = []; const go = (pre, rest) => { if (!rest.length) return perms.push(+pre.join("")); rest.forEach((c, i) => go(pre.concat(c), rest.filter((_, j) => j !== i))); }; go([], o.cards);
  let ti = 0, cur = [], found = new Set(), seq = 0;
  const qEl = h("p", { class: "rg1q" }), shown = h("div", { class: "rg1read" }), made = h("div", { class: "rg1made" }), msg = h("div", { class: "rg1small" });
  const btns = o.cards.map((c, i) => h("button", { onclick: () => { if (cur.includes(i)) return; cur.push(i); seq++; paint(); later(600); } }, String(c)));
  const row = h("div", { class: "rg1cards" }, ...btns);
  const paint = () => { btns.forEach((b, i) => { b.disabled = cur.includes(i); }); shown.textContent = "만든 수: " + (cur.map(i => o.cards[i]).join("") || "□□□".slice(0, o.cards.length)); };
  const T = () => o.tasks[ti];
  const target = t => { const ok = perms.filter(t.ok); return t.kind === "all" ? ok : [t.cmp === "max" ? Math.max(...ok) : Math.min(...ok)]; };
  function start() { cur = []; found = new Set(); made.innerHTML = ""; qEl.textContent = T().q; paint(); msg.textContent = T().kind === "all" ? "카드를 눌러 수를 만들어요. 조건에 맞는 수를 모두 찾아요. 카드를 다 쓰면 저절로 확인해요." : "카드를 눌러 수를 만들어요. 카드를 다 쓰면 저절로 확인해요."; }
  const judge = () => {
    const v = +cur.map(i => o.cards[i]).join(""), t = T(), tg = target(t); api.tryOnce();
    if (t.kind === "all") {
      if (!t.ok(v)) { api.fail(`${v}${t.show ? " → " + t.show(v) : ""}. 조건에 맞지 않아요.`, String(v)); cur = []; paint(); return false; }
      if (!found.has(v)) { found.add(v); made.append(h("span", {}, String(v))); }
      cur = []; paint();
      if (found.size < tg.length) { api.hint(`${v}${t.show ? " → " + t.show(v) : ""}. 조건에 맞아요! 다른 수도 만들어 봐요.`); return false; }
    } else if (v !== tg[0]) { api.fail(!t.ok(v) ? `${rg1J(String(v), "은/는")} 조건에 맞지 않아요.` : `${rg1J(String(v), "은/는")} 조건에 맞지만 ${t.cmp === "max" ? "더 큰" : "더 작은"} 수를 만들 수 있어요.`, String(v)); cur = []; paint(); return false; }
    if (ti < o.tasks.length - 1) { api.hint(`○ ${t.kind === "all" ? [...found].join(", ") : v} — 맞아요! 아래 문제도 이어서 해 봐요.`); ti++; start(); return false; }
    btns.forEach(b => { b.disabled = true; });
    api.done(t.kind === "all" ? [...found].join(", ") : String(v), o.ok); return true;
  };
  const later = rg1Auto(() => cur.length === o.cards.length, () => seq + ":" + ti, judge);
  body.append(qEl, row, shown, h("div", { class: "rg1ctl" }, h("button", { onclick: () => { cur = []; paint(); } }, "↺ 다시 만들기")), made, msg);
  api.provide({ words: ["수 카드"], answers: o.tasks.map(t => t.q + " " + target(t).join(", ")) });
  start();
}

/* ---------- 문장 쓰기(낱말 두 개 이상) — 글쓰기라 '다 썼어요' 단추 → api.done( ---------- */
function rg1Say(body, api, o) {
  const t = h("textarea", { placeholder: o.ph || "여기에 써요" });
  const hp = helpPop(o.help, t);
  body.append(h("div", { class: "rg1say2 hlpwrap" }, h("div", { class: "jua hlpq" }, h("span", { class: "hlpt" }, o.q), hp[0]), t, hp[1]));
  const act = h("div", { class: "actions" });
  act.append(h("button", { class: "big", onclick: () => {
    const v = t.value.trim(), used = o.words.filter(w => v.includes(w));
    api.tryOnce();
    if (v.length < 8) return api.fail("상황을 조금 더 자세히 써 봐요.", v);
    if (used.length < (o.need || 2)) return api.fail(`${o.words.map(w => "‘" + w + "’").join(", ")} 중에서 ${o.need || 2}개를 넣어 써요. 지금은 ${used.length}개를 썼어요.`, v);
    if (!/[0-9]/.test(v)) return api.fail("범위의 기준이 되는 수도 함께 써요.", v);
    t.readOnly = true; api.done(v, o.ok);
    if (o.ans) ansShow([["예시", o.ans]], act);
  } }, "다 썼어요"));
  body.append(act);
}

/* ---------- 이야기 그림: 준비 회의 칠판 ---------- */
function rgsBoardFig() {
  const svg = makeSvg(880, 380); svg.setAttribute("class", "rg1fig"); svg.style.maxWidth = "40em";
  svg.append(svgEl("rect", { x: 0, y: 0, width: 880, height: 380, fill: "#F6EFE2" }), svgEl("rect", { x: 30, y: 20, width: 820, height: 320, rx: 10, fill: "#2F5D4E", stroke: "#8C6F4E", "stroke-width": 10 }));
  svg.append(txt(440, 58, "현장 체험 학습 준비 — 별빛 놀이공원", 28, { fill: "#FFF8D6" }));
  const L = ["① 놀이 기구마다 탈 수 있는 키 기준 확인하기", "② 나이별 입장료 알아보고 단체 입장권 값 내기", "③ 5학년 136명에게 줄 기념품 열쇠고리 사기", "④ 모둠 간식비 동전을 지폐로 바꾸기", "⑤ 오늘 예상 방문자 수·학교에서 가는 거리 알아보기", "⑥ 만든 작품과 짐은 학교로 택배 보내기"];
  L.forEach((t, i) => svg.append(txt(80, 104 + i * 38, t, 22, { fill: "#fff", "text-anchor": "start" })));
  svg.append(svgEl("rect", { x: 640, y: 344, width: 70, height: 14, rx: 4, fill: "#fff" }), txt(440, 368, "준비 위원장 지호가 칠판에 적었어요.", 16, { fill: "#6B4A2A" }));
  return svg;
}

/* ---------- 이야기 그림: 별빛 놀이공원 안내도 (여덟 곳을 모두 누르면 → 물음 rg1Ask → api.done( ) ---------- */
const RGSTRIP = [
  { id: "gate", name: "매표소", say: "요금표: 4세 미만 무료, 4세 이상 13세 미만 어린이 15000원, 13세 이상 19세 미만 청소년 20000원, 19세 이상 65세 미만 어른 25000원, 65세 이상 12000원" },
  { id: "coaster", name: "회오리 열차", say: "안내판: “키가 140 cm와 같거나 큰 사람만 탈 수 있어요.”" },
  { id: "bumper", name: "범퍼카", say: "안내판: “키가 120 cm보다 큰 어린이는 혼자 운전할 수 있어요.”" },
  { id: "shop", name: "기념품 가게", say: "점원: “열쇠고리는 10개 묶음과 100개 상자로만 팔아요.”" },
  { id: "coin", name: "동전 교환기", say: "안내: “동전을 넣으면 1000원짜리나 10000원짜리 지폐로 바꿔 줘요. 남는 동전은 돌려줘요.”" },
  { id: "screen", name: "방문자 전광판", say: "전광판: ‘오늘 예상 방문자 2637명’ — 도윤: “약 몇 명이라고 말하면 좋을까?”" },
  { id: "road", name: "길 안내판", say: "안내판: ‘푸른초등학교 → 별빛 놀이공원 47.36 km’" },
  { id: "parcel", name: "택배 보내는 곳", say: "안내: “상자의 무게와 크기에 따라 택배 요금이 달라요.”" }];
function rgsTripSvg(onPick) {
  const svg = makeSvg(880, 470); svg.setAttribute("class", "rg1fig");
  svg.append(svgEl("rect", { x: 0, y: 0, width: 880, height: 470, fill: "#EAF5FB" }), svgEl("rect", { x: 0, y: 70, width: 880, height: 400, fill: "#E5F1D9" }));
  svg.append(svgEl("rect", { x: 240, y: 10, width: 400, height: 46, rx: 23, fill: "#fff", stroke: RG1C.org, "stroke-width": 3 }), txt(440, 34, "별빛 놀이공원 안내도", 24, { fill: "#B5541C" }));
  RGSTRIP.forEach((f, i) => {
    const cx = 110 + (i % 4) * 220, top = 82 + Math.floor(i / 4) * 192, g = svgEl("g", { class: "rg1spot", tabindex: 0, role: "button", "aria-label": f.name });
    const col = ["#E47A38", "#D64545", "#7A5BB0", "#A0672E", "#2B7BD6", "#6B7B78", "#2E8B57", "#C24C7A"][i];
    const card = svgEl("rect", { x: cx - 100, y: top, width: 200, height: 176, rx: 14, fill: "#fff", stroke: "#C9D6D1", "stroke-width": 2.5 });
    g.append(card);
    g.append(svgEl("path", { d: `M${cx - 92},${top + 40} L${cx - 80},${top + 10} H${cx + 80} L${cx + 92},${top + 40} Z`, fill: col, opacity: .85 }));
    for (let k = 0; k < 6; k++) g.append(svgEl("path", { d: `M${cx - 92 + k * 30.7},${top + 40} q15.3,12 30.7,0`, fill: col }));
    g.append(txt(cx, top + 27, f.name, 16, { fill: "#fff" }));
    const ic = svgEl("g", { transform: `translate(${cx},${top + 104})` });
    const C = (x, y, r, fill, st) => svgEl("circle", { cx: x, cy: y, r, fill, stroke: st || "none", "stroke-width": 2 });
    const R = (x, y, w, hh, fill, st, rx) => svgEl("rect", { x, y, width: w, height: hh, rx: rx || 3, fill, stroke: st || "none", "stroke-width": 2 });
    if (f.id === "gate") { ic.append(R(-56, -40, 112, 58, "#FFF4E6", "#E47A38", 8), txt(0, -22, "어린이 15000원", 13, { fill: "#8A4A12" }), txt(0, -2, "청소년 20000원", 13, { fill: "#8A4A12" }), txt(0, 40, "나이별 입장료", 14, { fill: "#8A4A12" })); }
    if (f.id === "coaster") { ic.append(svgEl("path", { d: "M-64,22 C-40,-50 -10,-50 0,10 S40,-40 64,-6", fill: "none", stroke: "#D64545", "stroke-width": 5 }), C(-28, -28, 7, "#2B7BD6"), txt(0, 40, "키 140 cm 이상", 14, { fill: "#A12A20" })); }
    if (f.id === "bumper") { ic.append(R(-46, -24, 92, 38, "#B9A3E3", "#7A5BB0", 16), C(-24, 18, 8, "#333"), C(24, 18, 8, "#333"), svgEl("line", { x1: 0, y1: -24, x2: 0, y2: -46, stroke: "#7A5BB0", "stroke-width": 3 }), txt(0, 40, "키 120 cm 초과", 14, { fill: "#7A5BB0" })); }
    if (f.id === "shop") { ic.append(R(-60, -26, 54, 40, "#F2DAB8", "#A0672E"), R(6, -36, 54, 50, "#F2DAB8", "#A0672E"), txt(-33, -6, "10개", 14, { fill: "#6B4A2A" }), txt(33, -11, "100개", 14, { fill: "#6B4A2A" }), txt(0, 40, "열쇠고리 묶음", 14, { fill: "#6B4A2A" })); }
    if (f.id === "coin") { ic.append(C(-38, -10, 14, "#F2CC3B", "#B58B12"), C(-14, -4, 14, "#D9DDE0", "#7B8389"), txt(10, -8, "→", 20), R(26, -26, 40, 26, "#CFE8C4", "#4E8C3A"), txt(0, 40, "동전 → 지폐", 14, { fill: "#1E5FA8" })); }
    if (f.id === "screen") { ic.append(R(-62, -40, 124, 56, "#24323A", "#111", 8), txt(0, -12, "2637", 30, { fill: "#7CF29A", "font-family": "monospace" }), txt(0, 40, "오늘 예상 방문자", 14, { fill: "#4A5A57" })); }
    if (f.id === "road") { ic.append(R(-6, -20, 12, 50, "#8C6F4E"), svgEl("path", { d: "M-62,-44 H50 L66,-30 L50,-16 H-62 Z", fill: "#2E8B57" }), txt(-2, -30, "47.36 km", 15, { fill: "#fff" }), txt(0, 40, "학교에서 거리", 14, { fill: "#1E5E3B" })); }
    if (f.id === "parcel") { ic.append(R(-40, -36, 80, 54, "#E8C9A0", "#8C6F4E"), svgEl("line", { x1: 0, y1: -36, x2: 0, y2: 18, stroke: "#C9A16F", "stroke-width": 6 }), txt(0, 40, "무게·크기 요금표", 14, { fill: "#8C3A5E" })); }
    g.append(ic);
    const mark = svgEl("g", { visibility: "hidden" }); mark.append(C(cx + 82, top + 58, 13, RG1C.green), txt(cx + 82, top + 59, "✓", 16, { fill: "#fff" })); g.append(mark);
    const fire = () => { card.setAttribute("stroke", RG1C.green); mark.setAttribute("visibility", "visible"); onPick(i); };
    g.addEventListener("click", fire); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") fire(); });
    svg.append(g);
  });
  return svg;
}
function rgsTrip(body, api, o) {
  const seen = new Set(), msg = h("div", { class: "rg1msg" }, "안내도에서 여러 곳을 눌러 친구들과 함께 둘러봐요."), cnt = h("div", { class: "rg1small" }, `둘러본 곳: 0 / ${RGSTRIP.length}`);
  const askBox = h("div", { class: "rg1part", hidden: true });
  body.append(rgsTripSvg(i => {
    seen.add(i); msg.textContent = `${RGSTRIP[i].name} · ${RGSTRIP[i].say}`; cnt.textContent = `둘러본 곳: ${seen.size} / ${RGSTRIP.length}`;
    if (seen.size < RGSTRIP.length) return;
    if (!o.ask) return api.done("안내도 둘러보기", o.ok);
    if (askBox.children.length) return;
    askBox.hidden = false; api.hint("○ 여덟 곳을 모두 둘러봤어요. 아래 물음에 답해 봐요."); rg1Ask(askBox, api, o.ask, { ok: o.ok });
  }), msg, cnt, askBox);
  api.provide({ words: RGSTRIP.map(f => f.name), answers: [] });
}

/* ---------- 놀이: 알쏭달쏭 어림 퀴즈 ----------
   o.game=[{n,m,p}] — 답 쪽지는 화면을 그릴 때 rg1Rnd로 계산해요. 모든 문제를 맞히면 api.done( */
function rg1Game(body, api, o) {
  const G = o.game, board = G.map(g => rg1Rnd(g.n, g.m, g.p));
  const order = board.map((v, i) => i).sort((x, y) => board[x] - board[y]);
  let basket = G.map((g, i) => i).sort(() => Math.random() - .5), cur = -1, turn = 0, score = [0, 0], solved = 0;
  const sc = [h("span", {}, ""), h("span", {}, "")], prob = h("div", { class: "rg1prob" }, "바구니에서 문제 쪽지를 뽑아요.");
  const boardEl = h("div", { class: "rg1notes" }), left = h("div", { class: "rg1small" });
  const notes = order.map(i => ({ v: board[i], gone: false }));
  notes.forEach(nt => { const b = h("button", { class: "rg1note", onclick: () => pick(nt, b) }, rg1F(nt.v)); boardEl.append(b); });
  const gq = g => `${rg1J(g.n, "을/를")} ${g.m}하여 ${rg1PL(g.p)}까지 나타내면?`;
  const drawBtn = h("button", { class: "big", onclick: () => { if (cur >= 0) return api.hint("먼저 지금 문제의 답 쪽지를 칠판에서 찾아요."); cur = basket.shift(); prob.textContent = `${turn ? "나" : "가"} 모둠 문제 · ${G[cur].pre || ""}${gq(G[cur])}`; paint(); } }, "🧺 바구니에서 문제 뽑기");
  function paint() { sc[0].textContent = `가 모둠 ${score[0]}점`; sc[1].textContent = `나 모둠 ${score[1]}점`; sc.forEach((s, i) => s.classList.toggle("rg1turn", i === turn)); left.textContent = `바구니에 남은 문제: ${basket.length + (cur >= 0 ? 1 : 0)}장 · 맞힌 문제: ${solved} / ${G.length}`; drawBtn.disabled = cur >= 0 || solved === G.length; }
  function pick(nt, b) {
    if (nt.gone) return;
    if (cur < 0) return api.hint("먼저 바구니에서 문제를 뽑아요.");
    const g = G[cur], right = rg1Rnd(g.n, g.m, g.p); api.tryOnce();
    if (rg1Eq(nt.v, right)) {
      score[turn]++; solved++; nt.gone = true; b.classList.add("rg1gone");
      api.hint(`○ ${gq(g).replace("나타내면?", "나타내면")} ${rg1J(rg1F(right), "이에요/예요")}. ${turn ? "나" : "가"} 모둠 1점!`);
    } else {
      basket.push(cur);
      api.fail(`${rg1J(rg1F(nt.v), "은/는")} 답이 아니에요. ${g.m === "반올림" ? `바로 아래 자리인 ${rg1PL(g.p - 1)} 숫자를 살펴봐요` : `${rg1PL(g.p)} 아래 수를 ${g.m === "올림" ? "올려요" : "버려요"}`}. 이 문제는 바구니로 돌아가요.`, `${g.n} → ${rg1F(nt.v)}`);
    }
    cur = -1; turn = 1 - turn; paint();
    if (solved === G.length) { prob.textContent = `놀이 끝! 가 모둠 ${score[0]}점, 나 모둠 ${score[1]}점`; api.done(`가 ${score[0]} : 나 ${score[1]}`, o.ok); }
  }
  body.append(h("div", { class: "rg1score" }, ...sc), drawBtn, prob, h("div", { class: "rg1small" }, "칠판에 붙은 답 쪽지 — 알맞은 답 쪽지를 눌러요."), boardEl, left);
  api.provide({ words: ["올림", "버림", "반올림"], answers: [] });
  paint();
}
/* 문제 만들기(붙임쪽지 2장) — 모두 채우면 저절로 확인 → api.done( */
function rg1Make(body, api, o) {
  const N = o.n || 2, PL = [4, 3, 2, 1, 0, -1, -2], notes = [];
  const grid = h("div", { class: "rg1mk3" });
  let later = () => { };
  for (let i = 0; i < N; i++) {
    const st = { m: null, p: null };
    const numIn = h("input", { type: "text", inputmode: "decimal", style: "width:7em", "aria-label": "수" }), ansIn = h("input", { type: "text", inputmode: "decimal", style: "width:7em", "aria-label": "답" });
    const mB = ["올림", "버림", "반올림"].map(m => h("button", { onclick: () => { st.m = m; mB.forEach(b => b.classList.toggle("rg1on", b.textContent === m)); later(600); } }, m));
    const pB = PL.map(p => h("button", { onclick: () => { st.p = p; pB.forEach((b, j) => b.classList.toggle("rg1on", PL[j] === p)); later(600); } }, rg1PN(p)));
    const box = h("div", { class: "rg1sticky" }, h("div", { class: "jua" }, `붙임쪽지 ${i + 1}`), h("div", {}, "수: ", numIn), h("div", { class: "rg1opts" }, ...mB), h("div", { class: "rg1small" }, "어느 자리까지?"), h("div", { class: "rg1opts" }, ...pB), h("div", {}, "답(다른 쪽지): ", ansIn));
    notes.push({ st, numIn, ansIn, box }); grid.append(box);
  }
  const judge = () => {
    api.tryOnce(); let msg = null; const out = [];
    notes.forEach((nt, i) => {
      if (msg) return; const s = nt.numIn.value.replace(/[\s,]/g, ""), v = rg1Num(s);
      const tag = `붙임쪽지 ${i + 1}: `;
      if (!/^\d+(\.\d{1,3})?$/.test(s) || v <= 0) return (msg = tag + "어림할 수를 써요(소수는 셋째 자리까지).");
      const intLen = String(Math.floor(v)).length;
      if (nt.st.p >= intLen) return (msg = tag + `${s}에는 ${rg1PL(nt.st.p)}가 없어요. 수에 있는 자리를 골라요.`);
      if (rg1Low(s) >= nt.st.p) return (msg = tag + `${rg1PL(nt.st.p)} 아래 수가 모두 0이라 어림해도 그대로예요. 더 높은 자리를 골라 봐요.`);
      const right = rg1Rnd(s, nt.st.m, nt.st.p), w = rg1Num(nt.ansIn.value);
      nt.box.classList.remove("rg1good", "rg1bad");
      if (!rg1Eq(w, right)) { nt.box.classList.add("rg1bad"); return (msg = tag + `모둠 친구가 확인해 보니 답이 달라요. ${rg1J(s, "을/를")} ${nt.st.m}하여 ${rg1PL(nt.st.p)}까지 다시 나타내 봐요.`); }
      nt.box.classList.add("rg1good"); out.push(`${s} ${nt.st.m} ${rg1PN(nt.st.p)} → ${rg1F(right)}`);
    });
    if (!msg && N > 1 && new Set(notes.map(n => n.st.m)).size < 2) msg = "올림, 버림, 반올림 문제를 골고루 만들어요. 두 쪽지의 어림 방법을 다르게 해요.";
    if (msg) { api.fail(msg, out.join(" / ")); return false; }
    api.done(out.join(" / "), o.ok); return true;
  };
  later = rg1Auto(() => notes.every(nt => nt.numIn.value.trim() && nt.ansIn.value.trim() && nt.st.m && nt.st.p != null), () => notes.map(nt => [nt.numIn.value, nt.st.m, nt.st.p, nt.ansIn.value].join(",")).join("|"), judge);
  notes.forEach(nt => { rg1Inp(nt.numIn, later); rg1Inp(nt.ansIn, later); });
  body.append(grid, h("div", { class: "rg1small" }, "두 쪽지를 모두 채우면 모둠 친구가 저절로 확인해 줘요."));
  api.provide({ words: ["올림", "버림", "반올림", "구하려는 자리"], answers: [] });
}
/* 또 다른 놀이: 주사위 두 개로 둘레·넓이 → 반올림하여 십의 자리까지 (goal회 성공하면 api.done( ) */
function rg1Dice(body, api, o) {
  const goal = o.goal || 3; let round = 0, pts = 0, cur = null, call = null, rid = 0;
  const face = n => { const s = makeSvg(60, 60); s.append(svgEl("rect", { x: 3, y: 3, width: 54, height: 54, rx: 10, fill: "#fff", stroke: RG1C.ink, "stroke-width": 3 })); const P = { 1: [[30, 30]], 2: [[18, 18], [42, 42]], 3: [[16, 16], [30, 30], [44, 44]], 4: [[18, 18], [42, 18], [18, 42], [42, 42]], 5: [[16, 16], [44, 16], [30, 30], [16, 44], [44, 44]], 6: [[18, 15], [42, 15], [18, 30], [42, 30], [18, 45], [42, 45]] }[n]; P.forEach(([x, y]) => s.append(svgEl("circle", { cx: x, cy: y, r: 5, fill: RG1C.ink }))); return s; };
  const dice = h("span", { class: "rg1dice" }), info = h("div", { class: "rg1read" }, "‘둘레’ 또는 ‘넓이’를 외치고 주사위를 던져요."), sc = h("div", { class: "rg1score" });
  const v1 = h("input", { type: "text", inputmode: "numeric", style: "width:5em;font-size:1.1em;text-align:center", "aria-label": "둘레 또는 넓이" }), v2 = h("input", { type: "text", inputmode: "numeric", style: "width:5em;font-size:1.1em;text-align:center", "aria-label": "어림한 값" });
  const callEl = h("span", {}, ""), unitEl = h("span", {}, "");
  const form = h("div", { hidden: true }, h("p", { class: "sent" }, callEl, v1, unitEl, " → 반올림하여 십의 자리까지: ", v2));
  const roll = c => { if (cur) return api.hint("먼저 지금 직사각형의 값을 구해요."); if (round >= goal) return; call = c; rid++; cur = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]; dice.innerHTML = ""; dice.append(face(cur[0]), face(cur[1])); info.textContent = `“${c}!” 가로 ${cur[0]} cm, 세로 ${cur[1]} cm인 직사각형의 ${c}를 구하고 반올림하여 십의 자리까지 나타내요.`; callEl.textContent = `${c}: `; unitEl.textContent = c === "둘레" ? " cm" : " cm²"; v1.value = v2.value = ""; v1.style.borderColor = v2.style.borderColor = ""; form.hidden = false; };
  const paint = () => { sc.innerHTML = ""; sc.append(h("span", {}, `${round}회 성공`), h("span", {}, `점수 ${pts}점`)); };
  const judge = () => {
    api.tryOnce();
    const val = call === "둘레" ? (cur[0] + cur[1]) * 2 : cur[0] * cur[1], est = rg1Rnd(val, "반올림", 1), a = rg1Num(v1.value), b = rg1Num(v2.value);
    if (a !== val) { v1.style.borderColor = "var(--no)"; api.fail(call === "둘레" ? "둘레는 (가로 + 세로) × 2로 구해요." : "넓이는 가로 × 세로로 구해요.", `${v1.value}/${v2.value}`); return false; }
    v1.style.borderColor = "var(--ok)";
    if (b !== est) { v2.style.borderColor = "var(--no)"; api.fail(`${call}는 ${rg1J(String(val), "이/가")} 맞아요. 반올림하여 십의 자리까지 나타내려면 일의 자리 숫자를 살펴봐요.`, `${v1.value}/${v2.value}`); return false; }
    round++; pts += 2; cur = null; form.hidden = true; paint();
    info.textContent = `${call} ${val} → ${est}. 두 가지 모두 맞혀 2점!`;
    if (round >= goal) { api.done(`${round}회 ${pts}점`, o.ok); return true; }
    api.hint(`○ ${round}회 성공! 주사위를 다시 던져요.`); return false;
  };
  const later = rg1Auto(() => !!cur && v1.value.trim() !== "" && v2.value.trim() !== "", () => rid + "|" + v1.value + "|" + v2.value, judge);
  rg1Inp(v1, later); rg1Inp(v2, later);
  body.append(h("div", { class: "rg1ctl" }, h("button", { onclick: () => roll("둘레") }, "🎲 “둘레!” 던지기"), h("button", { onclick: () => roll("넓이") }, "🎲 “넓이!” 던지기"), dice), info, form, sc);
  api.provide({ words: ["둘레", "넓이", "반올림"], answers: [] });
  paint();
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 현장 체험 학습 준비", lines: [
  "푸른초등학교 5학년 1반이 별빛 놀이공원으로 현장 체험 학습을 떠나요. 준비 위원장 지호, 돈 관리 담당 서연, 길 안내 담당 도윤, 질문 대장 하린이가 강 선생님과 함께 준비해요.",
  "놀이 기구마다 탈 수 있는 키 기준, 나이별 입장료, 만보기 걷기 배지 기준을 이상·이하·초과·미만으로 살펴보고 수직선에 나타내요.",
  "기념품 열쇠고리는 올림, 동전을 지폐로 바꾸는 돈은 버림, 예상 방문자 수와 거리는 반올림으로 어림하고, 짐을 학교로 보낼 택배 요금을 정한 뒤 보고회까지 마쳐요."],
  one: "우리 반 현장 체험 학습 준비 · 놀이 기구 키 기준과 입장료를 수의 범위로 나타내고, 기념품·용돈·방문자 수를 올림·버림·반올림으로 어림해요." };
const UNIT_KEYWORDS = ["이상", "이하", "초과", "미만", "수의 범위", "수직선", "● 포함해요", "○ 포함하지 않아요", "두 조건을 모두 만족", "어림", "올림", "버림", "반올림", "구하려는 자리", "아래 수", "바로 아래 자리의 숫자", "최소", "최대"];

/* ---- 표·그림 ---- */
function rg1Tab(heads, rows, cap) {
  const tb = h("table"); tb.append(h("tr", {}, ...heads.map(x => h("th", {}, x))));
  rows.forEach(r => tb.append(h("tr", {}, ...r.map(x => h("td", {}, x === "" ? "​" : x)))));
  return h("div", {}, cap ? h("div", { class: "rg1read" }, cap) : null, h("div", { class: "rg1tbl" }, tb));
}
const RG1L = (from, to, extra) => Object.assign({ from, to }, extra || {});
const rg1Fig = (ax, r, maxW) => () => rg1LineFig(Object.assign({ maxW: maxW || "34em" }, ax), r);
const rgsSign = n => () => { const s = makeSvg(200, 120); s.setAttribute("class", "rg1fig"); s.style.maxWidth = "9em"; s.append(svgEl("rect", { x: 0, y: 0, width: 200, height: 120, fill: "#FFF8E0" }), svgEl("circle", { cx: 100, cy: 60, r: 48, fill: "#fff", stroke: "#D64545", "stroke-width": 12 }), txt(100, 63, String(n), 40)); return s; };
/* 별빛 놀이공원 나이별 입장료 (이야기 속 요금표) */
const RGS_AGE = [{ k: "무료", lo: null, hi: 4, f: 0 }, { k: "어린이", lo: 4, hi: 13, f: 15000 }, { k: "청소년", lo: 13, hi: 19, f: 20000 }, { k: "어른", lo: 19, hi: 65, f: 25000 }, { k: "경로", lo: 65, hi: null, f: 12000 }];
const rgsAgeTxt = r => r.lo == null ? `${r.hi}세 미만` : r.hi == null ? `${r.lo}세 이상` : `${r.lo}세 이상 ${r.hi}세 미만`;
const rgsAgeRow = a => RGS_AGE.findIndex(r => (r.lo == null || a >= r.lo) && (r.hi == null || a < r.hi));
const rgsAgeTab = () => rg1Tab(["구분", "나이", "입장료"], RGS_AGE.map(r => [r.k, rgsAgeTxt(r), r.f ? `${r.f}원` : "무료"]), "별빛 놀이공원 나이별 입장료");
/* 걷기 배지 기준(만보기 걸음 수) */
const RGS_BADGE = [["금 배지", "12000 초과"], ["은 배지", "9000 초과 12000 이하"], ["동 배지", "6000 초과 9000 이하"], ["참가 배지", "6000 이하"]];
const rgsBadgeTab = () => rg1Tab(["배지", "걸음 수(걸음)"], RGS_BADGE, "체험 학습 걷기 배지 기준");
/* 10차시 놀이 문제(답 쪽지는 rg1Game이 계산) — 이 단원 이야기에 나온 수 */
const RGS_GAME = [
  { n: "136", m: "올림", p: 1 }, { n: "23460", m: "버림", p: 3 }, { n: "2637", m: "반올림", p: 2 }, { n: "47.36", m: "반올림", p: 0 },
  { n: "158", m: "버림", p: 1 }, { n: "3.472", m: "올림", p: -1 }, { n: "127", m: "올림", p: 1 }, { n: "4386", m: "버림", p: 2 },
  { n: "2650", m: "반올림", p: 2 }, { n: "365", m: "버림", p: 1 }, { n: "38400", m: "올림", p: 4 }, { n: "158462", m: "반올림", p: 3 }];
(function rgsSelfCheck() {   // 자료를 바꾸어도 답이 맞는지 확인
  const ans = RGS_GAME.map(g => rg1Rnd(g.n, g.m, g.p));
  if (new Set(ans).size !== ans.length) throw new Error("놀이 문제의 답이 겹쳐요");
  const fam = [11, 45, 43, 4, 67].map(a => RGS_AGE[rgsAgeRow(a)].f).reduce((x, y) => x + y, 0);
  if (fam !== 92000) throw new Error("하린이네 가족 입장료가 " + fam);
  const fee = (kg, e) => Math.max(RG1FEE[rg1FeeRow("w", kg)].f, RG1FEE[rg1FeeRow("s", e[0] + e[1] + e[2])].f);
  if (fee(1.5, [30, 25, 20]) + fee(11, [40, 35, 30]) !== 15000) throw new Error("택배 요금 합이 달라요");
  [[136, "올림", 1, 140], [136, "올림", 2, 200], [23460, "버림", 3, 23000], [23460, "버림", 4, 20000], [2637, "반올림", 1, 2640], [2637, "반올림", 2, 2600], [2650, "반올림", 2, 2700],
   [3846500, "반올림", 5, 3800000], [3846500, "반올림", 6, 4000000], [4271000, "반올림", 5, 4300000], [4271000, "반올림", 6, 4000000], [47.36, "반올림", 0, 47], [47.36, "반올림", -1, 47.4],
   [158462, "반올림", 4, 160000], [158462, "반올림", 3, 158000], [3.472, "올림", -1, 3.5], [3.472, "올림", -2, 3.48], [4.386, "버림", -1, 4.3], [4.386, "버림", -2, 4.38]]
    .forEach(([n, m, p, w]) => { if (!rg1Eq(rg1Rnd(n, m, p), w)) throw new Error(`${n} ${m} ${p} → ${rg1Rnd(n, m, p)}`); });
})();

const LESSONS = [
{
  id: "s1", no: 1, title: "현장 체험 학습 준비 회의", soop: "개념 찾기(S)",
  question: "현장 체험 학습을 준비할 때 수의 범위나 어림이 필요한 곳은 어디일까요?",
  summary: "놀이 기구의 키 기준이나 나이별 입장료처럼 기준이 되는 수보다 크거나 작은 수를 정할 때는 수의 범위가 필요해요. 기념품을 최소 몇 묶음 살지, 동전을 지폐로 최대 얼마까지 바꿀지, 방문자 2637명을 약 몇 명이라고 말할지처럼 대략의 수를 구할 때는 어림이 필요해요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "푸른초등학교 5학년 1반이 다음 달에 별빛 놀이공원으로 현장 체험 학습을 가요. 준비 위원장 지호가 칠판에 준비할 일을 적었어요. 칠판을 보고 떠오르는 것을 세 칸에 써서 붙여요.", hints: ["키 기준, 나이별 입장료, 기념품 136명, 동전과 지폐, 방문자 수, 거리, 택배가 보여요.", "기준보다 큰지 작은지 따지는 일과, 대략 얼마쯤인지 알아보는 일을 나누어 생각해 봐요."],
      render: (b, a) => { b.append(rgsBoardFig()); panes(b, a, [
        { t: "보여요", e: "👀", ph: "칠판에 ~이 보여요", hint: "칠판에 적힌 준비할 일", ex: ["놀이 기구마다 탈 수 있는 키 기준을 확인한다고 적혀 있어요.", "5학년 136명에게 줄 기념품 열쇠고리를 산다고 적혀 있어요."] },
        { t: "생각해요", e: "💭", ph: "~하려면 ~을 따져야 해요", hint: "수의 범위나 어림이 필요한 까닭", ex: ["키가 기준과 똑같은 친구도 탈 수 있는지 따져 봐야 할 것 같아요.", "열쇠고리를 묶음으로만 판다면 136개보다 많이 사야 할 것 같아요."] },
        { t: "궁금해요", e: "❓", ph: "~은 어떻게 할까?", hint: "수의 범위와 어림에 대해 궁금한 것", ex: ["‘140 cm 이상’에 140 cm도 들어갈까?", "오늘 예상 방문자 2637명을 대략 몇 명이라고 말하면 좋을까?"] }],
        { ok: "체험 학습 준비 곳곳에 수의 범위와 어림이 숨어 있어요! 이 단원에서 하나씩 해결해 봐요." }); } },
    { name: "그려 보기 — 놀이공원 안내도 둘러보기", inst: "강 선생님이 별빛 놀이공원 안내도를 나누어 주셨어요. 안내도의 여덟 곳을 모두 눌러 무엇을 알아봐야 하는지 살펴보세요.", hints: ["안내도의 여덟 곳을 하나씩 모두 눌러요.", "방문자 전광판과 길 안내판의 수를 잘 읽어 두어요."],
      render: (b, a) => rgsTrip(b, a, { ask: [
        { q: "방문자 전광판에 나온 오늘 예상 방문자는 몇 명인가요?", parts: [{ n: 2637 }, " 명"] },
        { q: "길 안내판에 나온 학교에서 놀이공원까지의 거리는 몇 km인가요?", parts: [{ n: 47.36, why: { "47": "길 안내판에는 소수 둘째 자리까지 47.36 km라고 적혀 있어요." } }, " km"] }],
        ok: "매표소·회오리 열차·범퍼카에는 범위를 정하는 기준이, 기념품 가게·동전 교환기·전광판·길 안내판에는 어림이 필요한 수가 있어요." }) },
    { name: "말해 보기 — 범위일까, 어림일까", inst: "돈 관리 담당 서연이가 준비하며 찾은 일을 카드로 적었어요. ‘수의 범위가 필요한 일’과 ‘어림이 필요한 일’로 나누어 보세요.", hints: ["‘~ 이상’, ‘~ 미만’처럼 기준이 되는 수보다 크거나 작은 수를 정하는 것은 수의 범위예요.", "‘최소 몇 묶음’, ‘최대 얼마’, ‘약 몇 명’처럼 대략의 수를 구하는 것은 어림이에요."],
      render: thenWhy((b, a) => rg1Sort(b, a, { bins: ["수의 범위가 필요해요 (기준보다 크거나 작은 수)", "어림이 필요해요 (대략의 수, 최소·최대)"],
        cards: [{ t: "키 140 cm 이상만 회오리 열차 타기", b: 0 }, { t: "4세 이상 13세 미만은 어린이 입장료", b: 0 }, { t: "대기 시간이 30분 미만인 놀이 기구부터 타기", b: 0 },
          { t: "열쇠고리 136개를 10개 묶음으로 최소 몇 묶음 살까?", b: 1 }, { t: "동전 23460원을 1000원짜리 지폐로 최대 얼마까지 바꿀까?", b: 1 }, { t: "예상 방문자 2637명을 약 몇 명이라고 말할까?", b: 1 }],
        ok: "기준보다 크거나 작은 수를 정할 때는 수의 범위가, 대략의 수나 최소·최대를 구할 때는 어림이 필요해요." }),
        { q: "‘예상 방문자 2637명을 약 몇 명이라고 말할까?’에 어림이 필요한 까닭을 써 볼까요?", ph: "방문자 수는 ~", help: ["① 방문자 수를 친구들에게 알려 줄 때 정확한 수가 꼭 필요한지 생각해요. → ② 대략의 수로 말하면 좋은 점을 써요.", "‘방문자 수는 ~이 꼭 필요하지 않고, 약 ~명처럼 말하면 ~하므로 어림이 필요해요.’ 꼴로 써요."], ans: "방문자 수는 정확한 수가 꼭 필요하지 않고 예상한 수라서, 약 2600명처럼 대략의 수로 말하면 알기 쉬우므로 어림이 필요해요." }) },
    { name: "약속하기 — 3·4학년 때 배운 것", inst: "※ 이 자료에서 만든 문제예요. 길 안내 담당 도윤이가 3·4학년 때 배운 길이·들이 어림하기와 큰 수의 크기 비교를 떠올려요.", hints: ["어림은 재지 않고 대강 짐작하는 것이에요. 교실 문의 높이가 약 2 m예요.", "자릿수가 같으면 높은 자리의 숫자부터 비교해요."],
      render: (b, a) => rg1Ask(b, a, [
        { q: "길이와 들이를 어림해 보세요.", parts: ["체험 학습 버스 한 대의 길이는 약 ", { o: ["1 m", "11 m", "110 m"], a: 1, why: { "0": "1 m는 내 두 팔을 벌린 길이보다 짧아요. 버스는 교실 길이쯤 돼요.", "2": "110 m는 운동장 한 바퀴의 절반쯤이에요. 버스는 그보다 훨씬 짧아요." } }, "예요.", h("br"), "내 물병의 들이는 약 ", { o: ["50 mL", "500 mL", "50 L"], a: 1, why: { "0": "50 mL는 작은 숟가락 열 번쯤이에요.", "2": "50 L는 큰 물통 몇 개를 채울 만큼이에요." } }, "예요."] },
        { q: "두 수의 크기를 비교하여 > 또는 <를 골라 보세요.", parts: ["2637 ", { o: [">", "<"], a: 0, why: { "1": "천의 자리가 같아요. 백의 자리 숫자 6과 3을 비교해요." } }, " 2367", h("br"), "47360 ", { o: [">", "<"], a: 1, why: { "0": "473600은 여섯 자리 수, 47360은 다섯 자리 수예요. 자릿수가 많은 수가 더 커요." } }, " 473600"] }],
        { ok: "길이와 들이를 어림하고, 큰 수의 크기를 비교할 수 있어요. 이번 단원에서는 수의 범위와 어림하는 방법을 더 자세히 배워요." }) },
    { name: "확인하기 — 무엇을 배울까요", inst: "이 단원에서 배울 내용이에요. 배우는 순서대로 눌러 보세요.", hints: ["수의 범위(이상·이하 → 초과·미만 → 활용)를 먼저 배워요.", "어림하기는 올림 → 버림 → 반올림 → 활용 순서예요."],
      render: (b, a) => sequence(b, a, ["버림", "이상과 이하", "반올림", "수의 범위를 활용하여 문제 해결하기", "올림", "초과와 미만", "올림, 버림, 반올림을 활용하여 문제 해결하기"], [1, 5, 3, 4, 0, 2, 6],
        { ok: "이상과 이하 → 초과와 미만 → 수의 범위 활용 → 올림 → 버림 → 반올림 → 어림 활용 순서로 체험 학습을 준비해요." }) }
  ],
  challenge: { inst: "하린이가 찾은 수학 이야기예요. 부등호 ‘>’와 ‘<’는 영국의 수학자 오트레드(1574~1660)가 『수학의 열쇠』라는 책에서 처음 사용했다고 해요. 그때는 모양이 지금과 달랐고, 그 뒤 토머스 해리엇(1560~1621)이 지금과 같은 모양을 만들었어요. 이야기를 읽고 물음에 답해 보세요.", hints: ["처음 쓴 사람과 지금 모양을 만든 사람이 달라요.", "47.36은 47.360과 같아요. 소수 둘째 자리 숫자를 비교해요."],
    render: (b, a) => rg1Ask(b, a, [
      { parts: ["부등호를 처음 사용한 사람: ", { o: ["오트레드", "해리엇"], a: 0 }, h("br"), "지금과 같은 모양을 만든 사람: ", { o: ["오트레드", "해리엇"], a: 1 }] },
      { parts: ["47.36 ", { o: [">", "<"], a: 0, why: { "1": "47.36은 47.360이에요. 소수 둘째 자리 숫자 6과 0을 비교해요." } }, " 47.306", h("br"), "2637 ", { o: [">", "<"], a: 1 }, " 2700"] }],
      { ok: "부등호를 쓰면 두 수의 크기를 간단하게 나타낼 수 있어요. 이 단원에서는 기준이 되는 수와 크기를 비교하여 수의 범위를 나타내요." }) }
},
{
  id: "s2", no: 2, title: "회오리 열차를 탈 수 있을까 ― 이상과 이하", soop: "개념 구축하기(O)",
  question: "140과 같거나 큰 수, 5와 같거나 작은 수를 어떻게 나타낼 수 있을까요?",
  summary: "140, 145.5, 152와 같이 140과 같거나 큰 수를 140 이상인 수라고 하고, 3.9, 4.8, 5와 같이 5와 같거나 작은 수를 5 이하인 수라고 해요. 수직선에서 ●은 그 수가 포함된다는 뜻이에요. 이상은 ●에서 오른쪽으로, 이하는 ●에서 왼쪽으로 선을 그어요.",
  steps: [
    { name: "만져 보기 — 회오리 열차 키 기준", inst: "놀이공원 누리집에 ‘회오리 열차는 키가 140 cm와 같거나 큰 사람만 탈 수 있어요.’라고 적혀 있어요. 하린: “140 cm인 사람은 탈 수 있을까?” 먼저 예상을 쓰고, 누리집에 나온 예시 키 카드를 알맞은 칸으로 옮겨 보세요.", hints: ["140 cm와 ‘같은’ 키도 탈 수 있어요.", "139.9 cm는 140 cm보다 0.1 cm 작아요."],
      render: ruleFirst((b, a) => rg1Chain(b, a, [
        (x, y) => rg1Sort(x, y, { bins: ["탈 수 있어요 (140 cm와 같거나 큰 키)", "탈 수 없어요"],
          cards: [{ t: "가 138 cm", b: 1 }, { t: "나 140 cm", b: 0, why: { 1: "140 cm는 140 cm와 같아요. ‘같거나 큰’ 키에 들어가요." } }, { t: "다 145.5 cm", b: 0 }, { t: "라 139.9 cm", b: 1, why: { 0: "139.9 cm는 140 cm보다 작아요." } }, { t: "마 152 cm", b: 0 }],
          ok: "140 cm, 145.5 cm, 152 cm인 사람이 회오리 열차를 탈 수 있어요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["탈 수 있는 키 중에서 가장 작은 키는 ", { n: 140, why: { "145.5": "140 cm와 같은 키도 탈 수 있어요." } }, " cm예요."] }], { ok: "140과 같은 수도, 140보다 큰 수도 모두 ‘140과 같거나 큰 수’예요." })]),
        { q: "140 cm와 키가 같은 사람도 회오리 열차를 탈 수 있을지 예상해 써요.", ph: "내 예상: ~", help: ["① 안내 글에서 ‘같거나 큰’이라는 말을 찾아요. → ② 140 cm가 그 말에 들어가는지 써요.", "‘~와 같거나 큰 사람이 탈 수 있으므로 140 cm인 사람은 ~.’ 꼴로 써요."], ans: "140 cm와 같거나 큰 사람이 탈 수 있으므로, 140 cm와 같은 키인 사람도 탈 수 있어요. 140도 ‘140과 같거나 큰 수’에 들어가요." }) },
    { name: "그려 보기 — 140과 같거나 큰 수", inst: "140과 같거나 큰 수를 수직선에 나타내 보세요. 140은 탈 수 있는 키에 포함되니 ‘● 포함하는 점’으로 140에 점을 찍고, ‘선 긋기’를 골라 더 큰 수 쪽을 눌러 선을 그어요.", hints: ["‘● 포함하는 점’을 고르고 140 눈금을 눌러요.", "‘선 긋기’를 고르고 140보다 오른쪽을 눌러요. 수직선에서는 오른쪽으로 갈수록 큰 수예요."],
      render: (b, a) => rg1Line(b, a, Object.assign(RG1L(138, 143), { r: { lo: 140, loInc: true }, ok: "140에 ●을 찍고 오른쪽으로 선을 그었어요. ●은 140이 포함된다는 것을 뜻해요." })) },
    { name: "말해 보기 — 짐 보관함에 넣을 수 있을까", inst: "놀이 기구 옆 짐 보관함에는 무게가 5 kg과 같거나 가벼운 가방만 넣을 수 있어요. 지호네 모둠 가방 무게를 보고 넣을 수 있는 가방에 ○표를 하고, 5와 같거나 작은 수를 수직선에 나타내 보세요.", hints: ["5 kg과 같은 가방에도 ○표를 해요.", "4.8은 5보다 작고, 5.3은 5보다 커요.", "5에 ●을 찍고 작은 수 쪽, 왼쪽으로 선을 그어요."],
      render: thenWhy((b, a) => rg1Chain(b, a, [
        (x, y) => rg1Mark(x, y, { vals: [4.8, 5.3, 5, 3.9, 6.1], labels: ["지호", "서연", "도윤", "하린", "민우"], unit: "kg", marks: [{ sym: "○", hi: 5, hiInc: true, name: "5와 같거나 작은 수" }],
          ok: "4.8 kg, 5 kg, 3.9 kg인 가방을 보관함에 넣을 수 있어요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(2, 7), { q: "5와 같거나 작은 수를 수직선에 나타내 보세요.", r: { hi: 5, hiInc: true }, ok: "5에 ●을 찍고 왼쪽으로 선을 그었어요." }))]),
        { q: "무게가 5 kg인 도윤이의 가방도 보관함에 넣을 수 있는 까닭을 써 볼까요?", ph: "보관함에는 ~", help: ["① 보관함에 넣을 수 있는 가방의 조건을 다시 읽어요. → ② 5 kg이 그 조건에 들어가는지 써요.", "‘보관함에는 5 kg과 ~ 가방을 넣을 수 있으므로, 5 kg인 가방도 ~.’ 꼴로 써요."], ans: "보관함에는 5 kg과 같거나 가벼운 가방을 넣을 수 있으므로, 5 kg과 같은 도윤이의 가방도 넣을 수 있어요. 5와 같거나 작은 수에는 5도 들어가요." }) },
    { name: "약속하기 — 이상과 이하", inst: "수직선 그림을 보고 약속을 완성해 보세요.", hints: ["‘같거나 큰 수’는 이상, ‘같거나 작은 수’는 이하예요.", "●은 그 수가 범위에 들어간다는 표시예요."],
      render: (b, a) => rg1Ask(b, a, [
        { fig: rg1Fig(RG1L(138, 143), { lo: 140, loInc: true }), parts: ["140, 145.5, 152와 같이 140과 같거나 큰 수를 140 ", { o: ["이상", "이하"], a: 0, why: { "1": "140보다 큰 쪽, 오른쪽으로 선이 그어져 있어요." } }, "인 수라고 합니다."] },
        { fig: rg1Fig(RG1L(2, 7), { hi: 5, hiInc: true }), parts: ["3.9, 4.8, 5와 같이 5와 같거나 작은 수를 5 ", { o: ["이상", "이하"], a: 1, why: { "0": "5보다 작은 쪽, 왼쪽으로 선이 그어져 있어요." } }, "인 수라고 합니다."] },
        { parts: ["수직선의 ●은 그 수가 ", { o: ["포함된다는", "포함되지 않는다는"], a: 0 }, " 것을 의미해요."] }],
        { ok: "140과 같거나 큰 수는 140 이상인 수, 5와 같거나 작은 수는 5 이하인 수예요. ●은 그 수가 포함된다는 뜻이에요." }) },
    { name: "확인하기 — 이상인 수, 이하인 수", inst: "이상인 수와 이하인 수를 찾고, 놀이공원 안 꼬마 자동차 길의 표지판을 보고 수의 범위를 그림에 나타내 보세요.", hints: ["75 이상에는 75가, 60 이하에는 60이 들어가요.", "66과 74.9는 어느 쪽에도 들어가지 않아요.", "표지판은 한 시간에 20 km 이하의 빠르기로 달려야 한다는 뜻이에요. 20에 ●, 왼쪽으로 선을 그어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Mark(x, y, { q: "75 이상인 수에 모두 ○표, 60 이하인 수에 모두 △표 해 보세요.", vals: [58, 75, 74.9, 81, 60, 66, 60.2], marks: [{ sym: "○", lo: 75, loInc: true }, { sym: "△", hi: 60, hiInc: true }],
          ok: "75 이상인 수는 75, 81이고, 60 이하인 수는 58, 60이에요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(17, 23), { fig: rgsSign(20), q: "꼬마 자동차 길의 표지판은 한 시간에 20 km 이하의 빠르기로 달려야 한다는 뜻이에요. 20 이하인 수를 그림에 나타내 보세요.", r: { hi: 20, hiInc: true }, ok: "20 이하인 수는 20과 같거나 작은 수예요. 20에 ●을 찍고 왼쪽으로 선을 그어요." }))]) }
  ],
  challenge: { inst: "이상과 이하를 생각하며 풀어 보세요.", hints: ["45 이하에는 45와 45보다 작은 수가 들어가요.", "125.0 cm는 125 cm와 같아요.", "‘이하’는 그 수를 포함해요. 25 이하인 수 중에서 가장 큰 수는 25예요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Mark(x, y, { q: "45 이하인 수에 모두 ○표 해 보세요.", vals: [47, 44.5, 45, 52.3, 39], marks: [{ sym: "○", hi: 45, hiInc: true }], ok: "44.5, 45, 39가 45 이하인 수예요." }),
      (x, y) => rg1Ask(x, y, [
        { q: "그림에 나타낸 수의 범위를 써 보세요.", fig: rg1Fig(RG1L(86, 91), { lo: 88, loInc: true }), parts: [{ n: 88 }, " ", { o: ["이상", "이하"], a: 0, why: { "1": "88에서 오른쪽, 큰 수 쪽으로 선이 그어져 있어요." } }, "인 수"] },
        { q: "꼬마 기차는 키가 125 cm 이하인 어린이가 보호자와 함께 타야 해요. 누리집 예시 어린이 가 125.0 cm, 나 131.2 cm, 다 124.8 cm, 라 126 cm 중에서 보호자와 함께 타야 하는 어린이는 몇 명인가요?", parts: [{ n: 2, why: { "1": "125.0 cm는 125 cm와 같아요. ‘125 cm 이하’에 들어가요." } }, " 명"] },
        { q: "지호: “30 이상인 수에는 30도 들어가.” 도윤: “25 이하인 수 중에서 가장 큰 수는 24야.” 하린: “12.5는 12 이상인 수야.”", parts: ["수의 범위에 대해 잘못 말한 사람은 ", { o: ["지호", "도윤", "하린"], a: 1 }, "예요. 바르게 고치면 25 이하인 수 중에서 가장 큰 수는 ", { n: 25, why: { "24": "‘이하’는 25를 포함해요." } }, "예요."] }],
        { ok: "88 이상인 수, 2명(가, 다)이에요. 25 이하인 수에는 25가 포함되므로 가장 큰 수는 25예요." })]) }
},
{
  id: "s3", no: 3, title: "범퍼카를 혼자 운전할 수 있을까 ― 초과와 미만", soop: "개념 구축하기(O)",
  question: "120보다 큰 수, 30보다 작은 수를 어떻게 나타낼 수 있을까요?",
  summary: "120.3, 124.5, 131과 같이 120보다 큰 수를 120 초과인 수라고 하고, 18, 27과 같이 30보다 작은 수를 30 미만인 수라고 해요. 수직선에서 ○은 그 수가 포함되지 않는다는 뜻이에요. 초과와 미만에는 기준이 되는 수가 들어가지 않아요.",
  steps: [
    { name: "만져 보기 — 범퍼카 키 기준", inst: "범퍼카 안내판: ‘키가 120 cm보다 큰 어린이는 혼자 운전할 수 있어요.’ 하린: “이번에는 ‘같거나’라는 말이 없네?” 먼저 예상을 쓰고, 누리집 예시 키 카드를 알맞은 칸으로 옮겨 보세요.", hints: ["120 cm보다 ‘큰’ 키만 혼자 운전할 수 있어요. 120 cm와 같은 키는 혼자 운전할 수 없어요.", "120.3 cm는 120 cm보다 0.3 cm 커요."],
      render: ruleFirst((b, a) => rg1Chain(b, a, [
        (x, y) => rg1Sort(x, y, { bins: ["혼자 운전할 수 있어요 (120 cm보다 큰 키)", "혼자 운전할 수 없어요"],
          cards: [{ t: "가 119 cm", b: 1 }, { t: "나 124.5 cm", b: 0 }, { t: "다 120 cm", b: 1, why: { 0: "120 cm는 120 cm보다 크지 않아요. 키가 120 cm와 같으면 혼자 운전할 수 없어요." } }, { t: "라 120.3 cm", b: 0, why: { 1: "120.3 cm는 120 cm보다 0.3 cm 더 커요." } }, { t: "마 131 cm", b: 0 }],
          ok: "124.5 cm, 120.3 cm, 131 cm인 어린이가 혼자 운전할 수 있어요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["키가 120 cm인 어린이는 범퍼카를 혼자 운전할 수 ", { o: ["있어요", "없어요"], a: 1, why: { "0": "120 cm보다 ‘큰’ 어린이만 혼자 운전할 수 있어요. 120은 120보다 크지 않아요." } }, "."] }], { ok: "기준이 되는 120 cm는 ‘120보다 큰 수’에 들어가지 않아요." })]),
        { q: "키가 120 cm인 어린이도 범퍼카를 혼자 운전할 수 있을지 예상해 써요.", ph: "내 예상: ~", help: ["① 회오리 열차의 ‘같거나 큰’과 범퍼카의 ‘보다 큰’을 견주어요. → ② 120 cm가 들어가는지 예상해 써요.", "‘범퍼카는 120 cm~ 어린이만 운전할 수 있으므로 120 cm인 어린이는 ~.’ 꼴로 써요."], ans: "범퍼카는 120 cm보다 큰 어린이만 혼자 운전할 수 있으므로, 120 cm와 같은 키인 어린이는 혼자 운전할 수 없어요. 120은 120보다 큰 수가 아니에요." }) },
    { name: "그려 보기 — 120보다 큰 수", inst: "120보다 큰 수를 수직선에 나타내 보세요. 120은 포함되지 않으니 ‘○ 포함하지 않는 점’으로 120에 점을 찍고, 더 큰 수 쪽으로 선을 그어요.", hints: ["‘○ 포함하지 않는 점’을 고르고 120 눈금을 눌러요.", "‘선 긋기’를 고르고 120보다 오른쪽을 눌러요."],
      render: (b, a) => rg1Line(b, a, Object.assign(RG1L(118, 123), { r: { lo: 120, loInc: false }, ok: "120에 ○을 찍고 오른쪽으로 선을 그었어요. ○은 120이 포함되지 않는다는 것을 뜻해요." })) },
    { name: "말해 보기 — 대기 시간이 짧은 놀이 기구", inst: "도윤: “대기 시간이 30분보다 짧은 놀이 기구부터 타자!” 놀이공원 앱에 나온 대기 시간을 보고 30분보다 짧은 놀이 기구에 ○표를 하고, 30보다 작은 수를 수직선에 나타내 보세요.", hints: ["30분과 같은 대기 시간은 30분보다 짧지 않아요.", "30에 ○을 찍고 작은 수 쪽, 왼쪽으로 선을 그어요."],
      render: thenWhy((b, a) => rg1Chain(b, a, [
        (x, y) => rg1Mark(x, y, { vals: [45, 18, 30, 27, 33], labels: ["회오리 열차", "회전목마", "범퍼카", "바이킹", "하늘 자전거"], unit: "분", marks: [{ sym: "○", hi: 30, hiInc: false, name: "30보다 작은 수" }],
          ok: "회전목마(18분)와 바이킹(27분)의 대기 시간이 30분보다 짧아요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(26, 32), { q: "30보다 작은 수를 수직선에 나타내 보세요.", r: { hi: 30, hiInc: false }, ok: "30에 ○을 찍고 왼쪽으로 선을 그었어요." }))]),
        { q: "대기 시간이 30분인 범퍼카를 먼저 타지 않는 까닭을 써 볼까요?", ph: "30분보다 ~", help: ["① 도윤이가 정한 조건을 다시 읽어요. → ② 30분이 그 조건에 들어가는지 써요.", "‘30분보다 ~ 놀이 기구부터 타기로 했는데, 범퍼카는 ~이라서 ~.’ 꼴로 써요."], ans: "30분보다 짧은 놀이 기구부터 타기로 했는데, 범퍼카는 대기 시간이 30분과 같아서 30분보다 짧지 않아요. 30보다 작은 수에는 30이 들어가지 않아요." }) },
    { name: "약속하기 — 초과와 미만", inst: "수직선 그림을 보고 약속을 완성해 보세요.", hints: ["‘보다 큰 수’는 초과, ‘보다 작은 수’는 미만이에요.", "○은 그 수가 범위에 들어가지 않는다는 표시예요."],
      render: (b, a) => rg1Ask(b, a, [
        { fig: rg1Fig(RG1L(118, 123), { lo: 120 }), parts: ["120.3, 124.5, 131과 같이 120보다 큰 수를 120 ", { o: ["이상", "초과", "미만"], a: 1, why: { "0": "120은 포함되지 않아요(○). ‘이상’은 120을 포함해요.", "2": "120보다 큰 쪽, 오른쪽으로 선이 그어져 있어요." } }, "인 수라고 합니다."] },
        { fig: rg1Fig(RG1L(26, 32), { hi: 30 }), parts: ["18, 27과 같이 30보다 작은 수를 30 ", { o: ["이하", "초과", "미만"], a: 2, why: { "0": "30은 포함되지 않아요(○). ‘이하’는 30을 포함해요.", "1": "30보다 작은 쪽, 왼쪽으로 선이 그어져 있어요." } }, "인 수라고 합니다."] },
        { parts: ["수직선의 ○은 그 수가 ", { o: ["포함된다는", "포함되지 않는다는"], a: 1 }, " 것을 의미해요."] }],
        { ok: "120보다 큰 수는 120 초과인 수, 30보다 작은 수는 30 미만인 수예요. ○은 그 수가 포함되지 않는다는 뜻이에요." }) },
    { name: "확인하기 — 초과인 수, 미만인 수", inst: "초과인 수와 미만인 수를 찾고, 경고음이 울리는 전망대 승강기를 찾아보세요.", hints: ["32.5 초과에는 32.5가, 18 미만에는 18이 들어가지 않아요.", "1200 kg을 ‘초과’하면 경고음이 울려요. 1200 kg일 때는 울리지 않아요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Mark(x, y, { q: "32.5 초과인 수에 모두 ○표, 18 미만인 수에 모두 △표 해 보세요.", vals: [18, 32.6, 17.9, 32.5, 40, 12, 33], marks: [{ sym: "○", lo: 32.5, loInc: false }, { sym: "△", hi: 18, hiInc: false }],
          ok: "32.5 초과인 수는 32.6, 40, 33이고, 18 미만인 수는 17.9, 12예요." }),
        (x, y) => rg1Ask(x, y, [{ q: "놀이공원 전망대 승강기는 안의 무게가 1200 kg을 초과하면 경고음이 울려요. 승강기 안의 무게가 각각 다음과 같을 때 경고음이 울리는 경우를 모두 골라 보세요.",
          parts: [{ o: ["가 승강기 1200 kg", "나 승강기 1185 kg", "다 승강기 1230 kg"], multi: true, a: [2], why: { "0": "1200 kg은 1200 kg을 초과하지 않아요. ‘초과’는 1200을 포함하지 않아요.", "0,2": "1200 kg은 1200 kg을 초과하지 않아요. ‘초과’는 1200을 포함하지 않아요.", "1": "1185 kg은 1200 kg보다 가벼워요." } }] }],
          { ok: "1230 kg일 때만 경고음이 울려요. 1200 kg은 1200 초과인 수가 아니에요." })]) }
  ],
  challenge: { inst: "초과와 미만을 생각하며 풀어 보세요.", hints: ["26 미만에는 26이 들어가지 않아요.", "8.3에 ○을 찍고 오른쪽으로 선을 그어요. 작은 눈금 한 칸은 0.1이에요.", "700 미만인 세 자리 수는 백의 자리 숫자가 6 이하예요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Mark(x, y, { q: "26 미만인 수에 모두 ○표 해 보세요.", vals: [25.9, 26, 31, 19, 26.4], marks: [{ sym: "○", hi: 26, hiInc: false }], ok: "25.9와 19가 26 미만인 수예요." }),
      (x, y) => rg1Line(x, y, Object.assign(RG1L(8, 9, { step: .1, lab: 1, mid: .5 }), { q: "8.3 초과인 수를 그림에 나타내 보세요. (작은 눈금 한 칸은 0.1이에요.)", r: { lo: 8.3, loInc: false }, ok: "8.3에 ○을 찍고 오른쪽으로 선을 그었어요." })),
      (x, y) => rg1Ask(x, y, [{ q: "놀이공원 짐 보관소에서는 짐의 무게가 10 kg을 초과하면 큰 사물함을 써야 해요. 가 9.9 kg, 나 10 kg, 다 10.4 kg, 라 15.2 kg 중 큰 사물함을 써야 하는 짐을 모두 골라 보세요.",
        parts: [{ o: ["가", "나", "다", "라"], multi: true, a: [2, 3], why: { "1,2": "10 kg은 10 kg을 초과하지 않아요.", "1,3": "10 kg은 10 kg을 초과하지 않아요.", "0,2": "9.9 kg은 10 kg보다 가벼워요." } }] }], { ok: "다(10.4 kg)와 라(15.2 kg)가 10 kg 초과예요." }),
      (x, y) => rg1Cards(x, y, { cards: [3, 6, 9], tasks: [
        { q: "사물함 번호를 정해요. 수 카드 3, 6, 9를 한 번씩 써서 세 자리 수를 만들어요. 700 미만인 수 중에서 가장 큰 수를 만들어 보세요.", kind: "best", ok: n => n < 700, cmp: "max" },
        { q: "이번에는 400 초과인 수 중에서 가장 작은 수를 만들어 보세요.", kind: "best", ok: n => n > 400, cmp: "min" }],
        ok: "700 미만인 수 중에서 가장 큰 수는 693, 400 초과인 수 중에서 가장 작은 수는 639예요." })]) }
},
{
  id: "s4", no: 4, title: "입장료와 걷기 배지 ― 수의 범위 활용하기", soop: "개념 구축하기(O)",
  question: "이상, 이하, 초과, 미만을 함께 사용하여 수의 범위를 어떻게 나타낼 수 있을까요?",
  summary: "4 이상 13 미만인 수는 4와 같거나 크고 13보다 작은 수로, 두 조건을 모두 만족하는 수예요. 수직선에는 4에 ●, 13에 ○을 찍고 두 점 사이에 선을 그어요. 경계의 수를 포함하면 ●(이상·이하), 포함하지 않으면 ○(초과·미만)로 나타내요.",
  steps: [
    { name: "만져 보기 — 나이별 입장료", inst: "서연이가 매표소의 나이별 입장료 표를 보며 손님들의 입장료를 알아봐요. 손님 카드를 알맞은 칸으로 옮기고, 어린이 요금의 나이 범위를 수직선에 나타내 보세요.", hints: ["4세는 ‘4세 미만’이 아니라 ‘4세 이상 13세 미만’에 들어가요.", "13세는 13세 미만이 아니에요. 19세, 65세도 경계의 수를 잘 살펴요.", "4에는 ●, 13에는 ○을 찍고 두 점 사이에 선을 그어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Sort(x, y, { fig: rgsAgeTab, bins: RGS_AGE.map(r => `${r.k} (${rgsAgeTxt(r)})`),
          cards: [{ t: "아기 2세", b: 0 }, { t: "동생 4세", b: 1, why: { 0: "4세는 4세 미만이 아니에요. 4세 이상에 들어가요." } }, { t: "우리 반 친구 11세", b: 1 }, { t: "중학생 13세", b: 2, why: { 1: "13세는 13세 미만이 아니에요. 13세 이상 19세 미만에 들어가요." } }, { t: "대학생 도우미 19세", b: 3, why: { 2: "19세는 19세 미만이 아니에요." } }, { t: "할머니 65세", b: 4, why: { 3: "65세는 65세 미만이 아니에요. 65세 이상에 들어가요." } }],
          ok: "2세는 무료, 4세와 11세는 어린이, 13세는 청소년, 19세는 어른, 65세는 경로 요금이에요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(0, 20, { lab: 5 }), { q: "어린이 요금의 나이 범위(4 이상 13 미만인 수)를 수직선에 나타내 보세요. (작은 눈금 한 칸은 1이에요.)", r: { lo: 4, loInc: true, hi: 13, hiInc: false }, ok: "4에 ●, 13에 ○을 찍고 두 점 사이에 선을 그었어요. 4세는 어린이 요금이고 13세는 아니에요." }))]) },
    { name: "그려 보기 — 경곗값이 같은 여러 범위", inst: "꼬마 기차, 하늘 자전거, 회전 그네는 모두 110 cm와 130 cm를 기준으로 탈 수 있는 키를 정했어요. 범위를 수직선에 나타내 보세요.", hints: ["이상·이하는 ●, 초과·미만은 ○로 나타내요.", "두 점을 찍은 다음 ‘선 긋기’로 두 점 사이를 눌러요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Line(x, y, Object.assign(RG1L(100, 140, { lab: 10, mid: 5 }), { q: "① 꼬마 기차: 110 이상 130 이하인 수", r: { lo: 110, loInc: true, hi: 130, hiInc: true } })),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(100, 140, { lab: 10, mid: 5 }), { q: "② 하늘 자전거: 110 초과 130 미만인 수", r: { lo: 110, loInc: false, hi: 130, hiInc: false } })),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(100, 140, { lab: 10, mid: 5 }), { q: "③ 회전 그네: 110 초과 130 이하인 수", r: { lo: 110, loInc: false, hi: 130, hiInc: true }, ok: "110과 130을 포함하는지에 따라 ●과 ○을 다르게 찍었어요." }))]) },
    { name: "말해 보기 — 걷기 배지 받기", inst: "체험 학습 날에는 만보기를 차고 걸은 걸음 수로 배지를 받아요. 지난 주말에 연습으로 걸은 걸음 수를 보고 친구 카드를 알맞은 배지 칸으로 옮기고, 은 배지의 범위를 수직선에 나타내 보세요.", hints: ["12000걸음은 ‘12000 초과’가 아니라 ‘9000 초과 12000 이하’에 들어가요.", "9000걸음은 9000 초과가 아니에요.", "9000에는 ○, 12000에는 ●을 찍어요. 큰 눈금은 1000, 작은 눈금은 500씩이에요."],
      render: thenWhy((b, a) => rg1Chain(b, a, [
        (x, y) => rg1Sort(x, y, { fig: rgsBadgeTab, bins: RGS_BADGE.map(r => `${r[0]} (${r[1]})`),
          cards: [{ t: "지호 9000걸음", b: 2, why: { 1: "9000은 9000 초과가 아니에요. 9000을 포함하는 ‘9000 이하’에 들어가요." } }, { t: "서연 12450걸음", b: 0 }, { t: "도윤 8760걸음", b: 2 }, { t: "하린 12000걸음", b: 1, why: { 0: "12000은 12000 초과가 아니에요. 12000을 포함하는 ‘12000 이하’에 들어가요." } }, { t: "민우 6000걸음", b: 3, why: { 2: "6000은 6000 초과가 아니에요. ‘6000 이하’에 들어가요." } }],
          ok: "서연이는 금 배지, 하린이는 은 배지, 지호와 도윤이는 동 배지, 민우는 참가 배지예요." }),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(5000, 14000, { step: 500, lab: 1000 }), { q: "은 배지의 범위(9000 초과 12000 이하인 수)를 수직선에 나타내 보세요.", r: { lo: 9000, loInc: false, hi: 12000, hiInc: true }, ok: "9000에 ○, 12000에 ●을 찍고 두 점 사이에 선을 그었어요." }))]),
        { q: "하린이는 12000걸음을 걸었는데 금 배지가 아니라 은 배지를 받는 까닭을 써 볼까요?", ph: "금 배지는 ~", help: ["① 금 배지와 은 배지의 범위에서 12000을 찾아요. → ② 12000이 어느 범위에 포함되는지 써요.", "‘금 배지는 12000 ~이라서 12000이 ~, 은 배지는 ~ 12000 ~라서 12000이 ~.’ 꼴로 써요."], ans: "금 배지는 12000 초과라서 12000이 들어가지 않고, 은 배지는 9000 초과 12000 이하라서 12000이 들어가요. 그래서 하린이는 은 배지를 받아요." }) },
    { name: "약속하기 — 두 조건을 모두 만족하는 수", inst: "수직선 그림을 보고 알맞은 수의 범위를 골라 약속을 완성해 보세요.", hints: ["●은 포함(이상·이하), ○은 포함하지 않음(초과·미만)이에요.", "왼쪽 점은 이상이나 초과, 오른쪽 점은 이하나 미만으로 읽어요."],
      render: (b, a) => { const O = ["110 이상 130 이하인 수", "110 이상 130 미만인 수", "110 초과 130 이하인 수", "110 초과 130 미만인 수"], ax = RG1L(100, 140, { lab: 10, mid: 5 });
        return rg1Ask(b, a, [
          { fig: rg1Fig(ax, { lo: 110, loInc: true, hi: 130 }), parts: [{ o: O, a: 1, why: { "0": "130에는 ○이 찍혀 있어요. 130은 포함되지 않아요.", "3": "110에는 ●이 찍혀 있어요. 110은 포함돼요." } }] },
          { fig: rg1Fig(ax, { lo: 110, hi: 130, hiInc: true }), parts: [{ o: O, a: 2, why: { "0": "110에는 ○이 찍혀 있어요. 110은 포함되지 않아요.", "3": "130에는 ●이 찍혀 있어요." } }] },
          { parts: ["110 이상 130 이하인 수는 110과 같거나 크고, 130과 같거나 작은 수예요. 두 조건을 ", { o: ["모두 만족하는", "하나만 만족해도 되는"], a: 0, why: { "1": "140은 110과 같거나 크지만 130보다 커요. 두 조건을 모두 만족해야 범위에 들어가요." } }, " 수예요."] }],
          { title: "수의 범위를 이상, 이하, 초과, 미만을 이용하여 그림에 나타내면 다음과 같아요.", ok: "경계의 수를 포함하면 ●(이상·이하), 포함하지 않으면 ○(초과·미만)로 나타내요. ‘■ 이상 ▲ 이하’는 두 조건을 모두 만족하는 수예요." }); } },
    { name: "확인하기 — 우리 주변의 수의 범위", inst: "범위에 들어가는 수의 개수를 세고, 우리 주변에서 수의 범위를 활용하는 상황을 찾아 써 보세요. 두 활동을 모두 해야 계단을 올라가요.", hints: ["53 이상 57 이하에는 53과 57도 들어가요.", "놀이 기구 키 기준, 입장료, 짐 무게처럼 범위가 정해진 상황을 떠올려요."],
      render: (b, a) => {
        rg1Ask(b, a, [{ q: "51.8, 54, 57, 60, 53.2, 56.9 중에서 53 이상 57 이하인 수는 모두 몇 개인가요?", parts: [{ n: 4, why: { "3": "57도 ‘57 이하’에 들어가요.", "5": "51.8은 53보다 작아요." } }, " 개"] }], { ok: "54, 57, 53.2, 56.9로 4개예요." });
        rg1Say(b, a, { q: "우리 주변에서 수의 범위를 활용하는 상황을 찾아 ‘이상’, ‘이하’, ‘초과’, ‘미만’ 중에서 2개를 사용하여 써 보세요.", words: ["이상", "이하", "초과", "미만"], need: 2, ph: "예) 4세 이상 13세 미만은 어린이 입장료 15000원을 내요.",
          help: ["① 요금, 키 기준, 무게 제한처럼 범위가 정해진 상황을 하나 골라요. → ② 기준이 되는 수 두 개와 이상·이하·초과·미만 중 두 낱말을 넣어 써요.", "‘~세 이상 ~세 미만은 ~이에요.’ 꼴로 써요."], ans: "우리 동네 수영장은 키가 100 cm 이상 130 cm 미만인 어린이는 어린이 풀에서 놀 수 있어요.",
          ok: "수의 범위를 사용하면 요금이나 조건을 정확하게 정할 수 있어요." }); } }
  ],
  challenge: { inst: "수의 범위를 활용하여 문제를 해결해 보세요.", hints: ["61 이상 65 미만에는 61, 62, 63, 64가 모두 들어가요.", "41.5는 41과 42 사이의 가운데예요. 41.5에는 ○, 43에는 ●이에요.", "자연수 부분은 4, 5, 6 중에서, 소수 첫째 자리 숫자는 2, 3, 4, 5 중에서 골라요."],
    render: (b, a) => rg1Chain(b, a, [
      (x, y) => rg1Ask(x, y, [{ q: "61, 62, 63, 64가 모두 속하는 수의 범위를 ‘이상’과 ‘미만’을 사용하여 나타낸 것을 골라 보세요.", parts: [{ o: ["61 이상 64 미만인 수", "61 이상 65 미만인 수", "62 이상 65 미만인 수"], a: 1, why: { "0": "64는 64 미만인 수가 아니에요.", "2": "61은 62 이상인 수가 아니에요." } }] }], { ok: "61 이상 65 미만인 수에 61, 62, 63, 64가 모두 들어가요." }),
      (x, y) => rg1Line(x, y, Object.assign(RG1L(39, 46, { step: .5, lab: 1 }), { q: "41.5 초과 43 이하인 수를 수직선에 나타내 보세요. (작은 눈금 한 칸은 0.5예요.)", r: { lo: 41.5, loInc: false, hi: 43, hiInc: true }, ok: "41.5에 ○, 43에 ●을 찍고 두 점 사이에 선을 그었어요." })),
      (x, y) => rg1Ask(x, y, [{ q: "사물함 비밀번호 힌트: 자연수 부분은 3 초과 7 미만이고, 소수 첫째 자리 숫자는 2 이상 6 미만인 소수 한 자리 수 중에서 가장 큰 수예요.", parts: ["비밀번호: ", { n: 6.5, why: { "7.5": "자연수 부분은 7 ‘미만’이라서 7은 안 돼요.", "6.6": "소수 첫째 자리 숫자는 6 ‘미만’이라서 6은 안 돼요." } }] }], { ok: "자연수 부분은 6, 소수 첫째 자리 숫자는 5가 가장 커서 6.5예요." })]) }
},
{
  id: "s5", no: 5, title: "기념품 열쇠고리를 사요 ― 올림", soop: "개념 구축하기(O)",
  question: "열쇠고리 136개가 필요할 때 묶음으로 최소 몇 개를 사야 할까요?",
  summary: "구하려는 자리의 아래 수를 올려서 나타내는 방법을 올림이라고 해요. 136을 올림하여 십의 자리까지 나타내면 6을 10으로 생각하여 140, 백의 자리까지 나타내면 36을 100으로 생각하여 200이에요. 올림한 수는 처음 수와 같거나 커요.",
  steps: [
    { name: "만져 보기 — 열쇠고리 묶음 늘리기", inst: "체험 학습 기념으로 5학년 학생 136명에게 열쇠고리를 하나씩 나누어 주려고 해요. 기념품 가게에서는 열쇠고리를 10개 묶음과 100개 상자로만 팔아요. 서연: “최소 몇 개를 사야 모두 받을 수 있을까?” 먼저 예상을 쓰고, 묶음과 상자 수를 늘리고 줄여 보세요.", hints: ["10개 묶음 13개면 130개라서 6개가 부족해요.", "남은 6개를 사려면 묶음 하나를 더 사야 해요.", "100개 상자 1개로는 36개가 부족해요."],
      render: ruleFirst((b, a) => rg1Chain(b, a, [
        (x, y) => rg1Pack(x, y, { q: "① 10개 묶음으로 사요.", n: 136, u: 10, mode: "ceil", item: "열쇠고리", itemName: "필요한 열쇠고리 136개", unit: "개", box: "묶음", boxName: "10개 묶음", read: k => `10개 묶음 ${k}개 → 열쇠고리 ${k * 10}개`, ok: "10개 묶음 14개, 열쇠고리 140개를 사야 해요. 13묶음(130개)으로는 6개가 부족해요." }),
        (x, y) => rg1Pack(x, y, { q: "② 100개 상자로 사요.", n: 136, u: 100, mode: "ceil", item: "열쇠고리", itemName: "필요한 열쇠고리 136개", unit: "개", box: "상자", boxName: "100개 상자", read: k => `100개 상자 ${k}개 → 열쇠고리 ${k * 100}개`, ok: "100개 상자 2개, 열쇠고리 200개를 사야 해요. 1상자(100개)로는 36개가 부족해요." })]),
        { q: "열쇠고리를 10개 묶음으로만 살 때 최소 몇 개를 사야 할지 예상하고 까닭을 써요.", ph: "내 예상: ~개, 왜냐하면 ~", help: ["① 10개 묶음 13개는 몇 개인지 생각해요. → ② 모자라는 열쇠고리가 있으면 어떻게 해야 할지 써요.", "‘13묶음은 ~개라서 ~개가 부족하므로, 한 묶음을 더 사서 최소 ~개를 사야 해요.’ 꼴로 써요."], ans: "10개 묶음 13개는 130개라서 6개가 부족해요. 한 묶음을 더 사서 최소 140개를 사야 136명이 모두 받을 수 있어요." }) },
    { name: "그려 보기 — 숫자로 올림하기", inst: "136을 어림하는 방법을 숫자로 살펴봐요. 구하려는 자리의 숫자를 누르면 그 아래 수를 어떻게 생각하는지 보여요.", hints: ["십의 자리까지 나타낼 때는 일의 자리 숫자 6을 10으로 생각해요.", "백의 자리까지 나타낼 때는 36을 100으로 생각해요."],
      render: (b, a) => rg1Digits(b, a, { tasks: [{ pre: "열쇠고리 ", n: "136", m: "올림", p: 1, unit: "개" }, { pre: "열쇠고리 ", n: "136", m: "올림", p: 2, unit: "개" }], ok: "136을 올림하여 십의 자리까지 나타내면 140, 백의 자리까지 나타내면 200이에요." }) },
    { name: "말해 보기 — 단체 입장권 값 내기", inst: "단체 입장권 값은 모두 38400원이에요. 강 선생님이 10000원짜리 지폐로만 낸다면 최소 얼마를 내야 할까요? 지폐 수를 정하고, 숫자로도 올림해 보세요.", hints: ["10000원짜리 지폐 3장이면 30000원이라 8400원이 모자라요.", "만의 자리 아래 수인 8400을 10000으로 생각해요."],
      render: thenWhy((b, a) => rg1Chain(b, a, [
        (x, y) => rg1Pack(x, y, { n: 38400, u: 10000, mode: "ceil", item: "입장권 값", itemName: "단체 입장권 값 38400원", unit: "원", box: "지폐", boxName: "10000원짜리 지폐", verb: "낼", lack: "입장권 값을 모두 낼 수 있게 지폐를 더 내요.", read: k => `10000원짜리 지폐 ${k}장 → ${k * 10000}원`, ok: "10000원짜리 지폐 4장, 최소 40000원을 내야 해요." }),
        (x, y) => rg1Digits(x, y, { tasks: [{ pre: "입장권 값 ", n: "38400", m: "올림", p: 4, unit: "원" }], ok: "38400을 올림하여 만의 자리까지 나타내면 40000이에요. 만의 자리 아래 수인 8400을 10000으로 생각했어요." })]),
        { q: "38400원을 낼 때 30000원이 아니라 40000원을 내야 하는 까닭을 써 볼까요?", ph: "30000원을 내면 ~", help: ["① 30000원을 내면 얼마가 모자라는지 계산해요. → ② 모자라지 않으려면 만의 자리 아래 수를 어떻게 생각해야 하는지 써요.", "‘30000원을 내면 ~원이 모자라요. 만의 자리 아래 수 ~을 ~으로 생각해 올려서 최소 ~원을 내야 해요.’ 꼴로 써요."], ans: "30000원을 내면 8400원이 모자라요. 만의 자리 아래 수 8400을 10000으로 생각해 올려서 최소 40000원을 내야 해요." }) },
    { name: "약속하기 — 올림", inst: "약속하기를 완성해 보세요.", hints: ["136의 6을 10으로, 36을 100으로 생각했어요.", "올리면 처음 수보다 작아질 수 없어요."],
      render: (b, a) => blanks(b, a, ["구하려는 자리의 ", { o: ["아래 수", "윗자리 수"], a: 0 }, "를 ", { o: ["올려서", "버려서"], a: 0 }, " 나타내는 방법을 ", { o: ["올림", "버림", "반올림"], a: 0 }, "이라고 합니다. 올림한 수는 처음 수와 ", { o: ["같거나 커요", "같거나 작아요"], a: 0 }, "."],
        { ok: "구하려는 자리의 아래 수를 올려서 나타내는 방법이 올림이에요. 올림한 수는 처음 수와 같거나 커요." }) },
    { name: "확인하기 — 소수 올림과 잘못 어림한 친구", inst: "간식 가방의 무게를 올림하고, 페트병 무게를 잘못 어림한 친구를 찾아 고쳐 보세요.", hints: ["3.472를 소수 첫째 자리까지 올림할 때는 0.072를 0.1로 생각해요.", "3105를 올림하여 백의 자리까지 나타내면 아래 수 5를 100으로 생각해요. 3100보다 커져요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Digits(x, y, { q: "모둠 간식 가방의 무게는 3.472 kg이에요. 올림해 보세요.", tasks: [{ pre: "간식 가방 ", n: "3.472", m: "올림", p: -1, unit: "kg" }, { pre: "간식 가방 ", n: "3.472", m: "올림", p: -2, unit: "kg" }], ok: "3.472를 올림하여 소수 첫째 자리까지 나타내면 3.5, 소수 둘째 자리까지 나타내면 3.48이에요." }),
        (x, y) => rg1Ask(x, y, [{ q: "놀이공원 ‘재활용 체험관’에 가져갈 페트병의 무게를 올림하여 백의 자리까지 나타냈어요. 도윤: “내가 모은 페트병 2716 g은 약 2800 g이야.” 서연: “내가 모은 페트병 3105 g은 약 3100 g이야.”",
          parts: ["잘못 어림한 사람은 ", { o: ["도윤", "서연"], a: 1, why: { "0": "2716을 올림하여 백의 자리까지 나타내면 16을 100으로 생각해 2800이 맞아요." } }, "이에요. 바르게 고치면 ", { n: 3200, why: { "3100": "3100은 버림한 값이에요. 올림은 아래 수 5를 100으로 생각해 올려요." } }, " g이에요."] }],
          { ok: "3105를 올림하여 백의 자리까지 나타내면 3200이에요. 올림한 수는 처음 수보다 작아질 수 없어요." })]) }
  ],
  challenge: { inst: "올림을 생각하며 풀어 보세요.", hints: ["397의 일의 자리 7을 10으로 생각해요.", "올림하여 십의 자리까지 나타낸 수의 십의 자리 숫자를 하나씩 살펴봐요.", "1836병을 100병씩 담으면 1800병을 담고 36병이 남아요."],
    render: (b, a) => rg1Ask(b, a, [
      { q: "397을 올림하여 십의 자리까지 나타낸 수를 골라 보세요.", parts: [{ o: ["390", "400", "410"], a: 1, why: { "0": "390은 버림한 값이에요.", "2": "397보다 큰 수 중에서 십의 자리까지 나타낸 가장 작은 수를 찾아요." } }] },
      { q: "올림하여 십의 자리까지 나타내면 십의 자리 숫자가 4가 되는 수를 모두 골라 보세요.", parts: [{ o: ["836", "541", "640", "457", "633"], multi: true, a: [0, 2, 4], why: { "0,2": "633을 올림하면 640이에요.", "0,4": "640은 일의 자리가 0이라 그대로 640이에요." } }] },
      { q: "62□7을 올림하여 십의 자리까지 나타내면 6250이에요.", parts: ["□ 안에 알맞은 수는 ", { n: 4, why: { "5": "6257을 올림하면 6260이에요." } }, "예요."] },
      { q: "생수 1836병을 100병씩 상자에 모두 담아 체험 학습 버스에 실으려고 해요.", parts: ["상자로 최소 ", { n: 1900, why: { "1800": "1800병이면 36병을 담지 못해요." } }, "병을 담을 수 있게 ", { n: 19 }, "상자가 필요해요."] }],
      { ok: "400, 836·640·633, 4, 1900병(19상자)이에요." }) }
},
{
  id: "s6", no: 6, title: "동전을 지폐로 바꿔요 ― 버림", soop: "개념 구축하기(O)",
  question: "동전 23460원을 지폐로 바꿀 때 최대 얼마까지 바꿀 수 있을까요?",
  summary: "구하려는 자리의 아래 수를 버려서 나타내는 방법을 버림이라고 해요. 23460을 버림하여 천의 자리까지 나타내면 460을 0으로 생각하여 23000, 만의 자리까지 나타내면 3460을 0으로 생각하여 20000이에요. 버림한 수는 처음 수와 같거나 작아요.",
  steps: [
    { name: "만져 보기 — 동전을 지폐로", inst: "서연이네 모둠이 간식비로 모은 동전이 23460원이에요. 놀이공원의 동전 교환기는 동전을 1000원짜리나 10000원짜리 지폐로 바꿔 주고, 남는 동전은 돌려줘요. 먼저 예상을 쓰고, 지폐 장수를 늘리고 줄여 보세요.", hints: ["1000원짜리 지폐 23장이면 23000원이고 460원이 남아요.", "남은 460원으로는 1000원짜리 지폐를 더 받을 수 없어요.", "10000원짜리 지폐는 2장까지 받을 수 있어요."],
      render: ruleFirst((b, a) => rg1Chain(b, a, [
        (x, y) => rg1Pack(x, y, { q: "① 1000원짜리 지폐로 바꿔요.", n: 23460, u: 1000, mode: "floor", item: "동전", itemName: "모은 동전 23460원", unit: "원", box: "지폐", boxName: "1000원짜리 지폐", verb: "바꿀", read: k => k * 1000 > 23460 ? `1000원짜리 지폐 ${k}장 → 동전이 ${k * 1000 - 23460}원 모자라요` : `1000원짜리 지폐 ${k}장 → ${k * 1000}원, 남는 동전 ${23460 - k * 1000}원`, ok: "1000원짜리 지폐 23장, 최대 23000원까지 바꿀 수 있어요. 남는 동전은 460원이에요." }),
        (x, y) => rg1Pack(x, y, { q: "② 10000원짜리 지폐로 바꿔요.", n: 23460, u: 10000, mode: "floor", item: "동전", itemName: "모은 동전 23460원", unit: "원", box: "지폐", boxName: "10000원짜리 지폐", verb: "바꿀", read: k => k * 10000 > 23460 ? `10000원짜리 지폐 ${k}장 → 동전이 ${k * 10000 - 23460}원 모자라요` : `10000원짜리 지폐 ${k}장 → ${k * 10000}원, 남는 동전 ${23460 - k * 10000}원`, ok: "10000원짜리 지폐 2장, 최대 20000원까지 바꿀 수 있어요. 남는 동전은 3460원이에요." })]),
        { q: "동전 23460원을 1000원짜리 지폐로 바꾸면 최대 얼마까지 바꿀 수 있을지 예상하고 까닭을 써요.", ph: "내 예상: ~원, 왜냐하면 ~", help: ["① 1000원짜리 지폐 23장은 얼마인지 생각해요. → ② 남는 동전으로 지폐를 더 받을 수 있는지 써요.", "‘23장을 받으면 ~원이 남는데, ~원으로는 지폐를 더 받을 수 없으므로 최대 ~원이에요.’ 꼴로 써요."], ans: "1000원짜리 지폐 23장을 받으면 460원이 남는데, 460원으로는 1000원짜리 지폐를 더 받을 수 없으므로 최대 23000원까지 바꿀 수 있어요." }) },
    { name: "그려 보기 — 숫자로 버림하기", inst: "23460을 어림하는 방법을 숫자로 살펴봐요. 구하려는 자리의 숫자를 누르면 그 아래 수를 어떻게 생각하는지 보여요.", hints: ["천의 자리까지 나타낼 때는 천의 자리 아래 수인 460을 0으로 생각해요.", "만의 자리까지 나타낼 때는 3460을 0으로 생각해요."],
      render: (b, a) => rg1Digits(b, a, { tasks: [{ pre: "동전 ", n: "23460", m: "버림", p: 3, unit: "원" }, { pre: "동전 ", n: "23460", m: "버림", p: 4, unit: "원" }], ok: "23460을 버림하여 천의 자리까지 나타내면 23000, 만의 자리까지 나타내면 20000이에요." }) },
    { name: "말해 보기 — 젤리 봉지 만들기", inst: "간식으로 산 젤리 158개를 10개씩 봉지에 담아 모둠에 나누어 주려고 해요. 10개씩 꽉 찬 봉지는 최대 몇 개 만들 수 있을까요? 봉지 수를 늘리고 줄여 보세요.", hints: ["봉지 15개면 젤리 150개를 담고 8개가 남아요.", "남은 8개로는 10개씩 꽉 찬 봉지를 만들 수 없어요."],
      render: thenWhy((b, a) => rg1Chain(b, a, [
        (x, y) => rg1Pack(x, y, { n: 158, u: 10, mode: "floor", item: "젤리", itemName: "젤리 158개", unit: "개", box: "봉지", boxName: "10개씩 담은 봉지", verb: "채울", read: k => k * 10 > 158 ? `봉지 ${k}개 → 젤리가 ${k * 10 - 158}개 모자라요` : `봉지 ${k}개 → 젤리 ${k * 10}개, 남은 젤리 ${158 - k * 10}개`, ok: "10개씩 꽉 찬 봉지를 15개 만들 수 있어요. 젤리 8개가 남아요." }),
        (x, y) => rg1Ask(x, y, [{ parts: ["10개씩 담은 젤리는 최대 ", { n: 150, why: { "160": "160개를 담으려면 젤리가 2개 모자라요." } }, "개예요. 158을 버림하여 십의 자리까지 나타내면 ", { n: 150 }, "이에요."] }], { ok: "158을 버림하여 십의 자리까지 나타내면 150이에요." })]),
        { q: "남은 젤리 8개로 봉지를 하나 더 만들지 않는 까닭을 써 볼까요?", ph: "10개씩 꽉 채워야 하는데 ~", help: ["① 한 봉지에 몇 개를 담기로 했는지 떠올려요. → ② 남은 8개로 한 봉지를 채울 수 있는지 써요.", "‘10개씩 ~ 하는데 남은 젤리는 ~개라 ~하므로, 일의 자리 수 8을 ~으로 생각해 버려요.’ 꼴로 써요."], ans: "10개씩 꽉 채워야 하는데 남은 젤리는 8개라 10개가 안 되므로 봉지를 더 만들 수 없어요. 그래서 일의 자리 수 8을 0으로 생각해 버려요." }) },
    { name: "약속하기 — 버림", inst: "약속하기를 완성해 보세요.", hints: ["23460의 460을 0으로, 3460을 0으로 생각했어요.", "버리면 처음 수보다 커질 수 없어요."],
      render: (b, a) => blanks(b, a, ["구하려는 자리의 아래 수를 ", { o: ["올려서", "버려서"], a: 1 }, " 나타내는 방법을 ", { o: ["올림", "버림", "반올림"], a: 1 }, "이라고 합니다. 버림한 수는 처음 수와 ", { o: ["같거나 커요", "같거나 작아요"], a: 1 }, "."],
        { ok: "구하려는 자리의 아래 수를 버려서 나타내는 방법이 버림이에요. 버림한 수는 처음 수와 같거나 작아요." }) },
    { name: "확인하기 — 짐 무게와 사물함 비밀번호", inst: "짐 무게를 버림하고, 체험관 사물함의 비밀번호를 찾아보세요.", hints: ["4.386을 소수 첫째 자리까지 버림하면 0.086을 0으로 생각해요.", "버림하여 십의 자리까지 나타내면 560이 되는 수는 560부터 569까지예요.", "일의 자리 숫자가 8이에요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Digits(x, y, { q: "도윤이네 모둠 짐의 무게는 4.386 kg이에요. 버림해 보세요.", tasks: [{ pre: "짐 ", n: "4.386", m: "버림", p: -1, unit: "kg" }, { pre: "짐 ", n: "4.386", m: "버림", p: -2, unit: "kg" }], ok: "4.386을 버림하여 소수 첫째 자리까지 나타내면 4.3, 소수 둘째 자리까지 나타내면 4.38이에요." }),
        (x, y) => { x.append(h("p", { class: "rg1q" }, "하린: “사물함 비밀번호를 버림하여 십의 자리까지 나타내면 560이야.” 지호: “비밀번호의 일의 자리 숫자는 8이야.” 다이얼을 돌려 사물함을 열어 보세요."));
          return rg1Lock(x, y, { ans: 568, why: v => Math.floor(v / 10) * 10 !== 560 ? `${rg1J(String(v).padStart(3, "0"), "을/를")} 버림하여 십의 자리까지 나타내면 ${Math.floor(v / 10) * 10}이에요. 560이 되어야 해요.` : "버림하여 십의 자리까지 나타내면 560이 맞아요. 일의 자리 숫자도 살펴봐요.", ok: "비밀번호는 568이에요. 568을 버림하여 십의 자리까지 나타내면 560이에요." }); }]) }
  ],
  challenge: { inst: "버림을 생각하며 풀어 보세요.", hints: ["674의 일의 자리 4를 0으로 생각해요.", "버림하여 백의 자리까지 4500이 되는 수는 4500부터 4599까지예요.", "4826을 버림하여 천의 자리까지, 3157을 버림하여 십의 자리까지 나타낸 다음 더해요."],
    render: (b, a) => rg1Ask(b, a, [
      { q: "674를 버림하여 십의 자리까지 나타낸 수를 골라 보세요.", parts: [{ o: ["660", "670", "680"], a: 1, why: { "2": "680은 올림한 값이에요." } }] },
      { q: "버림하여 백의 자리까지 나타내면 4500이 되는 수를 모두 골라 보세요.", parts: [{ o: ["4591", "4612", "4500", "4499", "4567"], multi: true, a: [0, 2, 4], why: { "0,4": "4500은 백의 자리 아래 수가 0이라 그대로 4500이에요.", "0,2": "4567도 버림하면 4500이에요." } }] },
      { q: "지호는 4826을 버림하여 천의 자리까지, 하린이는 3157을 버림하여 십의 자리까지 나타냈어요.", parts: ["두 사람이 나타낸 수의 합은 ", { n: 7150, why: { "7983": "버림한 수끼리 더해요. 4000과 3150을 더해요.", "8150": "4826을 버림하여 천의 자리까지 나타내면 4000이에요." } }, "이에요."] },
      { q: "기념 엽서 1846장을 10장씩 묶어 팔려고 해요.", parts: ["10장씩 묶어 팔 수 있는 엽서는 최대 ", { n: 1840 }, "장, ", { n: 184 }, "묶음이에요."] }],
      { ok: "670, 4591·4500·4567, 7150, 1840장(184묶음)이에요." }) }
},
{
  id: "s7", no: 7, title: "방문자 수와 거리 ― 반올림", soop: "개념 구축하기(O)",
  question: "오늘 예상 방문자 2637명을 어떻게 어림하면 실제 수에 가까울까요?",
  summary: "구하려는 자리 바로 아래 자리의 숫자가 0, 1, 2, 3, 4이면 버리고, 5, 6, 7, 8, 9이면 올려서 나타내는 방법을 반올림이라고 해요. 2637을 반올림하여 십의 자리까지 나타내면 2640, 백의 자리까지 나타내면 2600이에요. 반올림하면 실제 수에 더 가까운 쪽으로 어림할 수 있어요.",
  steps: [
    { name: "만져 보기 — 공은 어느 쪽으로 굴러갈까", inst: "놀이공원 전광판에 ‘오늘 예상 방문자 2637명’이라고 떠 있어요. 도윤: “2637명을 대략 몇 명이라고 말하면 실제 수에 가까울까?” 롤러코스터 수직선에 2637을 놓고 공이 굴러갈 골짜기를 골라 보세요.", hints: ["2637은 2630에서 7칸, 2640에서 3칸 떨어져 있어요.", "2637은 2600에서 37, 2700에서 63만큼 떨어져 있어요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Coaster(x, y, { q: "① 2630과 2640 사이의 수직선 (눈금 한 칸: 1)", a: 2630, b: 2640, v: 2637, step: 1, snap: 1, ok: "2637은 2630보다 2640에 더 가까워요. 십의 자리까지 어림하면 2640명이에요." }),
        (x, y) => rg1Coaster(x, y, { q: "② 2600과 2700 사이의 수직선 (눈금 한 칸: 10)", a: 2600, b: 2700, v: 2637, step: 10, snap: 1, tol: 2, ok: "2637은 2700보다 2600에 더 가까워요. 백의 자리까지 어림하면 2600명이에요." })]) },
    { name: "그려 보기 — 숫자로 반올림하기", inst: "2637을 반올림하는 방법을 숫자로 살펴봐요. 구하려는 자리의 숫자를 누르면 바로 아래 자리의 숫자를 보고 어떻게 하는지 보여요.", hints: ["십의 자리까지 나타낼 때는 일의 자리 숫자 7을 봐요. 7은 올려요.", "백의 자리까지 나타낼 때는 십의 자리 숫자 3을 봐요. 3은 버려요."],
      render: (b, a) => rg1Digits(b, a, { tasks: [{ pre: "방문자 ", n: "2637", m: "반올림", p: 1, unit: "명" }, { pre: "방문자 ", n: "2637", m: "반올림", p: 2, unit: "명" }], ok: "일의 자리 숫자가 7이라 올려서 2640, 십의 자리 숫자가 3이라 버려서 2600이에요." }) },
    { name: "말해 보기 — 한가운데 있는 수", inst: "하린: “방문자가 2650명이면 2600명과 2700명 중 어느 쪽이라고 할까?” 2650은 롤러코스터의 꼭대기에 있어요. 0부터 9까지 열 개의 숫자 중 0, 1, 2, 3, 4의 다섯 개는 버리고 5, 6, 7, 8, 9의 다섯 개는 올리기로 해요. 2650을 놓고 공이 굴러갈 쪽을 골라 보세요.", hints: ["2650은 2600과 2700에서 똑같이 50만큼 떨어져 있어요.", "바로 아래 자리인 십의 자리 숫자가 5예요. 5는 올리는 쪽이에요."],
      render: thenWhy((b, a) => rg1Coaster(b, a, { a: 2600, b: 2700, v: 2650, step: 10, snap: 10, ok: "2650처럼 꼭대기에 있는 공은 큰 쪽인 2700으로 굴려요. 반올림하여 백의 자리까지 나타내면 2700이에요." }),
        { q: "2650을 반올림하여 백의 자리까지 나타내면 2700이 되는 까닭을 써 볼까요?", ph: "바로 아래 자리인 십의 자리 숫자가 ~", help: ["① 백의 자리 바로 아래 자리 숫자를 찾아요. → ② 그 숫자를 올리는지 버리는지 써요.", "‘바로 아래 자리인 ~의 자리 숫자가 ~이고, 반올림에서는 ~이면 올리기로 했으므로 ~이 돼요.’ 꼴로 써요."], ans: "바로 아래 자리인 십의 자리 숫자가 5이고, 반올림에서는 5, 6, 7, 8, 9이면 올리기로 했으므로 2700이 돼요." }) },
    { name: "약속하기 — 반올림", inst: "약속하기를 완성해 보세요.", hints: ["2637의 일의 자리 7은 올리고, 십의 자리 3은 버렸어요.", "5는 올리는 쪽이에요."],
      render: (b, a) => blanks(b, a, ["구하려는 자리 바로 아래 자리의 숫자가 ", { o: ["0, 1, 2, 3, 4", "5, 6, 7, 8, 9"], a: 0 }, "이면 버리고, ", { o: ["0, 1, 2, 3, 4", "5, 6, 7, 8, 9"], a: 1 }, "이면 올려서 나타내는 방법을 ", { o: ["올림", "버림", "반올림"], a: 2 }, "이라고 합니다."],
        { ok: "바로 아래 자리의 숫자가 0~4이면 버리고, 5~9이면 올리는 방법이 반올림이에요." }) },
    { name: "확인하기 — 거리와 넓이", inst: "길 안내판의 거리 47.36 km와 놀이공원 안내서의 넓이 158462 m²를 반올림해 보세요.", hints: ["47.36을 반올림하여 일의 자리까지 나타낼 때는 소수 첫째 자리 숫자 3을 봐요.", "158462를 반올림하여 만의 자리까지 나타낼 때는 천의 자리 숫자 8을 봐요."],
      render: (b, a) => rg1Digits(b, a, { tasks: [{ pre: "거리 ", n: "47.36", m: "반올림", p: 0, unit: "km" }, { pre: "거리 ", n: "47.36", m: "반올림", p: -1, unit: "km" }, { pre: "넓이 ", n: "158462", m: "반올림", p: 4, unit: "m²" }, { pre: "넓이 ", n: "158462", m: "반올림", p: 3, unit: "m²" }],
        ok: "47.36 km는 약 47 km 또는 47.4 km, 158462 m²는 약 160000 m² 또는 158000 m²예요." }) }
  ],
  challenge: { inst: "반올림을 생각하며 풀어 보세요.", hints: ["5046을 반올림하여 천의 자리까지 나타낼 때는 백의 자리 숫자 0을 봐요.", "반올림하여 십의 자리까지 나타낼 때는 일의 자리 숫자를 봐요.", "남자와 여자 방문자 수를 더한 다음 천의 자리 숫자를 봐요."],
    render: (b, a) => rg1Ask(b, a, [
      { q: "5046을 반올림하여 천의 자리까지 나타낸 수를 골라 보세요.", parts: [{ o: ["4000", "5000", "6000"], a: 1, why: { "2": "6000은 올림한 값이에요. 백의 자리 숫자 0은 버려요." } }] },
      { q: "반올림하여 십의 자리까지 나타낸 수가 3570이 아닌 수를 골라 보세요.", parts: [{ o: ["3566", "3574", "3575", "3569"], a: 2 }] },
      { q: "㉠ 7.352를 반올림하여 일의 자리까지, ㉡ 7.284를 반올림하여 소수 첫째 자리까지, ㉢ 7.315를 반올림하여 소수 둘째 자리까지 나타냈어요.", parts: ["나타낸 수가 가장 큰 것은 ", { o: ["㉠", "㉡", "㉢"], a: 2, why: { "0": "㉠은 7, ㉡은 7.3, ㉢은 7.32예요.", "1": "㉡은 7.3, ㉢은 7.32예요. 7.32가 더 커요." } }, "이에요."] },
      { q: "지난달 별빛 놀이공원의 남자 방문자는 284126명, 여자 방문자는 267853명이었어요.", parts: ["전체 방문자는 ", { n: 551979, w: "8em" }, "명이고, 반올림하여 만의 자리까지 나타내면 약 ", { n: 550000, w: "8em", why: { "560000": "천의 자리 숫자가 1이라 버려요." } }, "명이에요."] }],
      { ok: "5000, 3575(→3580), ㉢(7.32), 551979명 → 약 550000명이에요." }) }
},
{
  id: "s8", no: 8, title: "어떤 어림이 알맞을까 ― 올림·버림·반올림 활용", soop: "개념 구축하기(O)",
  question: "상황에 따라 올림, 버림, 반올림 중 어떤 방법으로 어림해야 할까요?",
  summary: "남는 것 없이 모두 태우거나 담아야 할 때는 올림(최소), 꽉 채운 묶음만 셀 수 있을 때는 버림(최대), 대략 얼마쯤인지 실제 수에 가깝게 말할 때는 반올림을 써요. 같은 수라도 상황을 먼저 이해하고 알맞은 방법을 골라요.",
  steps: [
    { name: "만져 보기 — 순환 버스는 몇 번", inst: "놀이공원 안을 도는 순환 버스는 한 번 운행할 때 10명씩 탈 수 있어요. 5학년 학생 127명이 모두 타려면 버스는 최소 몇 번 운행해야 할까요? 알맞은 어림 방법을 고르고, 운행 횟수를 늘려 보세요.", hints: ["10명씩 타고 남은 7명도 타야 해요.", "127을 올림하여 십의 자리까지 나타내면 130이에요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Ask(x, y, [{ q: "10명보다 적게 남은 학생은 어떻게 해야 할까요?", parts: ["알맞은 어림 방법은 ", { o: ["올림", "버림", "반올림"], a: 0, why: { "1": "버림하면 120명만 타고 7명이 타지 못해요.", "2": "반올림하면 130이지만, 124명이라면 120이 되어 4명이 타지 못해요. 남는 학생도 모두 타야 해요." } }, "이에요."] }], { ok: "남은 학생도 모두 타야 하니 올림해요." }),
        (x, y) => rg1Pack(x, y, { n: 127, u: 10, mode: "ceil", item: "학생", itemName: "버스를 탈 학생 127명", unit: "명", box: "버스 운행", boxName: "버스 운행(한 번에 10명)", verb: "태울", lack: "모두 탈 수 있게 운행 횟수를 늘려요.", read: k => `버스 ${k}번 운행 → ${k * 10}명까지 탈 수 있어요`, ok: "127을 올림하여 십의 자리까지 나타내면 130이에요. 버스는 최소 13번 운행해야 해요." })]) },
    { name: "그려 보기 — 열쇠고리 묶음 팔기", inst: "기념품 가게 점원이 새로 들어온 열쇠고리 365개를 10개씩 묶어 팔려고 해요. 10개씩 꽉 찬 묶음은 최대 몇 묶음까지 팔 수 있을까요? 알맞은 어림 방법을 고르고, 묶음 수를 늘려 보세요.", hints: ["10개씩 묶고 남은 5개는 한 묶음이 되지 않아요.", "365를 버림하여 십의 자리까지 나타내면 360이에요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Ask(x, y, [{ q: "10개보다 적게 남은 열쇠고리는 어떻게 해야 할까요?", parts: ["알맞은 어림 방법은 ", { o: ["올림", "버림", "반올림"], a: 1, why: { "0": "올림하면 370개, 37묶음인데 열쇠고리가 5개 모자라 37번째 묶음을 채울 수 없어요.", "2": "365를 반올림하면 370이 되어 묶음을 채울 수 없어요. 꽉 찬 묶음만 팔 수 있어요." } }, "이에요."] }], { ok: "꽉 찬 묶음만 팔 수 있으니 버림해요." }),
        (x, y) => rg1Pack(x, y, { n: 365, u: 10, mode: "floor", item: "열쇠고리", itemName: "열쇠고리 365개", unit: "개", box: "묶음", boxName: "10개 묶음", verb: "채울", read: k => k * 10 > 365 ? `${k}묶음 → 열쇠고리가 ${k * 10 - 365}개 모자라요` : `${k}묶음 → 열쇠고리 ${k * 10}개, 남은 열쇠고리 ${365 - k * 10}개`, ok: "365를 버림하여 십의 자리까지 나타내면 360이에요. 최대 36묶음까지 팔 수 있어요." })]) },
    { name: "말해 보기 — 방문자 수 어림하기", inst: "놀이공원 안내서에 ‘지난해 방문자 3846500명, 올해 예상 방문자 4271000명’이라고 적혀 있어요. 하린이가 발표 자료에 넣으려고 반올림해요.", hints: ["십만의 자리까지 나타낼 때는 만의 자리 숫자를 봐요.", "백만의 자리까지 나타낼 때는 십만의 자리 숫자를 봐요."],
      render: thenWhy((b, a) => rg1Digits(b, a, { tasks: [{ pre: "지난해 ", n: "3846500", m: "반올림", p: 5, unit: "명" }, { pre: "올해 예상 ", n: "4271000", m: "반올림", p: 5, unit: "명" }, { pre: "지난해 ", n: "3846500", m: "반올림", p: 6, unit: "명" }, { pre: "올해 예상 ", n: "4271000", m: "반올림", p: 6, unit: "명" }],
        ok: "십만의 자리까지는 3800000명, 4300000명이고, 백만의 자리까지는 둘 다 4000000명이에요." }),
        { q: "방문자 수를 말할 때 올림이나 버림보다 반올림이 알맞은 까닭을 써 볼까요?", ph: "방문자 수는 ~", help: ["① 방문자 수를 알려 줄 때 무엇이 필요한지 생각해요(모두 담기? 꽉 채우기? 대략?). → ② 반올림하면 실제 수와 어떤 관계인지 써요.", "‘방문자 수는 ~ 알면 되므로, 실제 수에 ~ 쪽으로 어림하는 반올림이 알맞아요.’ 꼴로 써요."], ans: "방문자 수는 대략 얼마쯤인지 알면 되므로, 실제 수에 더 가까운 쪽으로 어림하는 반올림이 알맞아요." }) },
    { name: "약속하기 — 알맞은 어림 방법", inst: "체험 학습에서 만난 상황 카드를 알맞은 어림 방법 칸으로 옮겨 보세요.", hints: ["모두 앉거나 담아야 하면 올림이에요.", "꽉 채운 묶음이나 지폐만 셀 수 있으면 버림이에요.", "대략 얼마인지 말할 때는 반올림이에요."],
      render: (b, a) => rg1Sort(b, a, { bins: ["올림 (모두 담기·태우기, 최소)", "버림 (꽉 채운 것만, 최대)", "반올림 (대략 가까운 수)"],
        cards: [{ t: "공연장 의자 한 줄에 10명씩, 246명이 모두 앉으려면 최소 몇 줄?", b: 0 }, { t: "동전 7300원을 1000원짜리 지폐로 최대 얼마까지 바꿀까?", b: 1 }, { t: "학교에서 놀이공원까지 47.36 km를 약 몇 km라고 말할까?", b: 2 },
          { t: "사진 엽서 572장을 10장씩 묶어 팔 때 최대 몇 장?", b: 1 }, { t: "생수 1836병을 100병씩 상자에 모두 담을 때 최소 몇 상자?", b: 0 }, { t: "줄넘기를 459번 했다고 친구에게 대략 말하기", b: 2 }],
        ok: "모두 담거나 앉아야 하면 올림, 꽉 채운 것만 셀 수 있으면 버림, 대략 가까운 수를 말할 때는 반올림이에요." }) },
    { name: "확인하기 — 바르게 어림한 친구", inst: "어림이 필요한 문제를 해결해 보세요.", hints: ["7300원을 1000원짜리 지폐로 바꾸면 300원은 바꿀 수 없어요.", "1800 + 1500 = 3300이에요. 1000원짜리 지폐로만 낸다면 모자라지 않아야 해요."],
      render: (b, a) => rg1Ask(b, a, [
        { q: "모둠 동전 7300원을 1000원짜리 지폐로 바꾸려고 해요.", parts: ["7300원을 ", { o: ["올림", "버림", "반올림"], a: 1, why: { "0": "올림하면 8000원인데 동전이 700원 모자라요.", "2": "반올림하면 7000원이지만, 7600원이라면 8000원이 되어 동전이 모자라요. 꽉 찬 지폐만 바꿀 수 있어요." } }, "하여 ", { n: 7000 }, "원으로 바꿀 수 있어요. 지폐는 최대 ", { n: 7 }, "장이에요."] },
        { q: "1800원짜리 기념 배지와 1500원짜리 아이스크림을 사고 1000원짜리 지폐로만 내려고 해요. 지호: “반올림하여 3000원을 내면 돼.” 서연: “올림하여 4000원을 내야 해.” 도윤: “버림하여 3000원을 내면 돼.”", parts: ["바르게 말한 사람은 ", { o: ["지호", "서연", "도윤"], a: 1, why: { "0": "모두 3300원이라 3000원을 내면 300원이 모자라요.", "2": "3000원을 내면 300원이 모자라요." } }, "이에요."] }],
        { ok: "동전 7300원은 버림하여 7000원(7장), 3300원을 1000원짜리 지폐로만 낼 때는 올림하여 4000원을 내야 해요." }) }
  ],
  challenge: { inst: "같은 수가 되는 여러 가지 어림 방법을 찾아보세요.", hints: ["4271을 올림하여 백의 자리까지 나타내면 4300이에요.", "4271을 반올림하여 백의 자리까지 나타낼 때는 십의 자리 숫자 7을 봐요."],
    render: (b, a) => rg1Ask(b, a, [
      { q: "올해 놀이공원 하루 최대 방문자 4271명을 4300명이라고 어림했어요. 어떤 방법으로 어림했는지 두 가지를 찾아보세요.", parts: ["방법 1: ", { o: ["올림", "버림"], a: 0 }, "하여 ", { o: ["십의 자리", "백의 자리", "천의 자리"], a: 1 }, "까지", h("br"), "방법 2: 반올림하여 ", { o: ["십의 자리", "백의 자리", "천의 자리"], a: 1, why: { "0": "반올림하여 십의 자리까지 나타내면 4270이에요." } }, "까지"] },
      { q: "체험관 영상실 의자 한 줄에 10명씩 앉을 수 있어요. 5학년 학생과 선생님 246명이 모두 앉으려면 의자는 최소 몇 줄 필요할까요?", parts: [{ n: 25, why: { "24": "24줄이면 240명만 앉고 6명이 앉지 못해요." } }, " 줄"] }],
      { ok: "4271은 올림하여 백의 자리까지, 반올림하여 백의 자리까지 나타내면 4300이에요. 246명은 올림하여 250명, 25줄이 필요해요." }) }
},
{
  id: "s9", no: 9, title: "짐을 택배로 보내요 ― 택배 요금 정하기", soop: "탐구 정리하기(O)",
  question: "상자의 무게와 크기가 속하는 범위로 택배 요금을 어떻게 정할 수 있을까요?",
  summary: "택배 요금은 상자의 무게와 크기(세 변의 길이의 합)에 따라 정해지고, 무게에 따른 요금과 크기에 따른 요금이 다르면 더 높은 요금으로 정해요. ‘2 kg 초과 10 kg 이하’처럼 경계의 수가 포함되는지 잘 살펴서 속하는 칸을 찾아요.",
  steps: [
    { name: "만져 보기 — 요금표 읽기", inst: "체험관에서 만든 작품과 기념품이 많아서 학교로 택배를 보내기로 했어요. 택배 요금표를 읽어 보세요. 택배 요금은 상자의 무게와 크기에 따라 정해지고, 두 요금이 다르면 더 높은 요금으로 정해요. 상자의 크기는 가로, 세로, 높이의 합이에요. (요금표 출처: 찾기쉬운 생활법령정보, 2024)", hints: ["2 kg은 ‘2 kg 이하’에 들어가요.", "120 cm는 ‘60 cm 초과 120 cm 이하’에 들어가요."],
      render: (b, a) => rg1Ask(b, a, [{ fig: () => rg1FeeTable(false).el, parts: [
        "무게가 2 kg인 상자의 무게 요금은 ", { o: ["6000원", "7000원"], a: 0, why: { "1": "2 kg은 ‘2 kg 초과’가 아니에요. ‘2 kg 이하’에 들어가요." } }, "이에요.", h("br"),
        "크기가 120 cm인 상자의 크기 요금은 ", { o: ["7000원", "8000원"], a: 0, why: { "1": "120 cm는 ‘120 cm 초과’가 아니에요. ‘60 cm 초과 120 cm 이하’에 들어가요." } }, "이에요.", h("br"),
        "무게 요금이 6000원, 크기 요금이 7000원이면 택배 요금은 ", { o: ["6000원", "7000원", "13000원"], a: 1, why: { "0": "두 요금이 다르면 더 높은 요금으로 정해요.", "2": "두 요금을 더하지 않아요. 더 높은 요금 하나로 정해요." } }, "이에요."] }],
        { ok: "경계의 수를 잘 살피고, 두 요금이 다르면 더 높은 요금으로 정해요." }) },
    { name: "그려 보기 — 가 상자의 요금", inst: "지호네 모둠의 가 상자는 무게가 1.5 kg이고, 가로·세로·높이가 30 cm, 25 cm, 20 cm예요. 크기를 구하고 요금표에서 알맞은 칸을 찾아 요금을 구해 보세요.", hints: ["크기는 30 + 25 + 20을 계산해요.", "무게 1.5 kg은 2 kg 이하예요.", "크기 75 cm는 60 cm 초과 120 cm 이하예요."],
      render: (b, a) => rg1Fee(b, a, { name: "가 상자", kg: 1.5, e: [30, 25, 20] }) },
    { name: "말해 보기 — 나 상자의 요금", inst: "서연이네 모둠의 나 상자는 무게가 11 kg이고, 가로·세로·높이가 40 cm, 35 cm, 30 cm예요. 크기를 구하고 요금을 구해 보세요.", hints: ["크기는 40 + 35 + 30 = 105(cm)예요.", "11 kg은 10 kg 초과 20 kg 이하예요.", "무게 요금과 크기 요금 중 더 높은 요금을 골라요."],
      render: thenWhy((b, a) => rg1Fee(b, a, { name: "나 상자", kg: 11, e: [40, 35, 30] }),
        { q: "나 상자의 택배 요금이 7000원이 아니라 8000원인 까닭을 써 볼까요?", ph: "무게 11 kg은 ~", help: ["① 무게 요금과 크기 요금을 각각 찾아요. → ② 두 요금이 다를 때 어떻게 정하는지 써요.", "‘무게 11 kg은 ~라서 ~원, 크기 105 cm는 ~라서 ~원이에요. 두 요금이 다르면 ~ 요금으로 정하므로 ~원이에요.’ 꼴로 써요."], ans: "무게 11 kg은 10 kg 초과 20 kg 이하라서 8000원, 크기 105 cm는 60 cm 초과 120 cm 이하라서 7000원이에요. 두 요금이 다르면 더 높은 요금으로 정하므로 8000원이에요." }) },
    { name: "약속하기 — 모두 얼마일까", inst: "가 상자와 나 상자를 함께 보낼 때의 요금을 구하고, 택배 요금을 정하는 방법을 정리해 보세요.", hints: ["가 상자 7000원, 나 상자 8000원이에요.", "무게와 크기가 경계의 수와 같으면 ‘이하’ 칸에 들어가요."],
      render: (b, a) => rg1Ask(b, a, [
        { parts: ["가 상자 ", { n: 7000 }, "원 + 나 상자 ", { n: 8000 }, "원 = 모두 ", { n: 15000, why: { "14000": "나 상자는 무게 요금이 더 높아서 8000원이에요." } }, "원"] },
        { parts: ["택배 요금은 상자의 무게와 크기가 속하는 ", { o: ["수의 범위", "가장 큰 수"], a: 0 }, "를 찾아 정하고, 두 요금이 다르면 ", { o: ["더 높은", "더 낮은"], a: 0 }, " 요금으로 정해요."] }],
        { ok: "두 상자를 보내는 데 모두 15000원이 들어요. 무게와 크기가 속하는 범위를 찾고 더 높은 요금으로 정해요." }) },
    { name: "확인하기 — 하린이와 도윤이의 상자", inst: "하린이네 다 상자와 도윤이네 라 상자의 택배 요금도 구해 보세요.", hints: ["다 상자: 45 + 40 + 38 = 123(cm), 6.5 kg이에요.", "라 상자: 55 + 38 + 27 = 120(cm), 2 kg이에요. 경계의 수를 잘 살펴요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Fee(x, y, { name: "다 상자", kg: 6.5, e: [45, 40, 38], ok: "무게 6.5 kg은 7000원, 크기 123 cm는 120 cm 초과 140 cm 이하라서 8000원이에요. 더 높은 8000원이에요." }),
        (x, y) => rg1Fee(x, y, { name: "라 상자", kg: 2, e: [55, 38, 27], ok: "무게 2 kg은 2 kg 이하라서 6000원, 크기 120 cm는 60 cm 초과 120 cm 이하라서 7000원이에요. 더 높은 7000원이에요." })]) }
  ],
  challenge: { inst: "조건을 바꾸어 생각해 보세요. 도윤이네 모둠이 짐을 하나 더 넣었더니 상자 무게가 10.4 kg, 크기가 105 cm가 되었어요.", hints: ["10.4 kg은 10 kg 초과라서 8000원이에요.", "10 kg 이하가 되면 7000원이에요. 10.4 − 10을 계산해요."],
    render: (b, a) => rg1Ask(b, a, [
      { parts: ["지금 택배 요금은 ", { n: 8000, why: { "7000": "10.4 kg은 10 kg을 초과해요. 무게 요금이 8000원이에요." } }, "원이에요."] },
      { q: "짐을 조금 빼서 7000원으로 보내려고 해요.", parts: ["상자 무게가 ", { o: ["10 kg 미만", "10 kg 이하", "10 kg 초과"], a: 1, why: { "0": "10 kg도 ‘2 kg 초과 10 kg 이하’에 들어가서 7000원이에요. 10 kg까지 돼요." } }, "가 되어야 하므로, 짐을 적어도 ", { n: 0.4, why: { "0.5": "10.4 kg에서 0.4 kg을 빼면 10 kg이 되어 7000원이에요." } }, " kg 빼야 해요."] }],
      { ok: "10.4 kg은 8000원이에요. 무게가 10 kg 이하가 되도록 적어도 0.4 kg을 빼면 7000원으로 보낼 수 있어요." }) }
},
{
  id: "s10", no: 10, title: "알쏭달쏭 어림 퀴즈 놀이", soop: "발표하기(P)",
  question: "올림, 버림, 반올림을 이용한 문제를 만들고 해결할 수 있을까요?",
  summary: "올림·버림·반올림 문제를 만들 때는 어림할 수, 어림 방법, 나타낼 자리를 정해요. 올림은 아래 수를 올리고, 버림은 아래 수를 버리고, 반올림은 바로 아래 자리 숫자를 보고 정해요. 놀이를 할 때는 걸어가고, 친구를 응원해요.",
  steps: [
    { name: "만져 보기 — 놀이 방법", inst: "체험 학습을 마치고 돌아온 날, 지호가 ‘알쏭달쏭 어림 퀴즈 놀이’를 준비했어요. (반 전체 두 모둠, 준비물: 붙임쪽지, 바구니) 놀이 방법을 차례대로 눌러 보세요.", hints: ["문제와 답을 먼저 쓰고, 맞는지 확인해요.", "문제 쪽지는 바구니에, 답 쪽지는 칠판에 붙인 다음 놀이를 시작해요."],
      render: (b, a) => sequence(b, a, ["바구니에서 뽑은 문제를 함께 읽고, 출발선의 친구가 칠판으로 걸어가 답 쪽지를 찾아요.", "붙임쪽지 한 장에 올림·버림·반올림 문제를, 다른 한 장에 답을 써요.", "모둠원끼리 문제와 답이 맞는지 확인해요.", "문제 쪽지는 접어 바구니에, 답 쪽지는 칠판에 붙여요.", "모든 모둠원이 문제를 풀 때까지 하고, 점수가 많은 모둠이 이겨요."], [1, 2, 3, 0, 4],
        { ok: "문제와 답 쓰기 → 모둠 확인 → 바구니와 칠판에 붙이기 → 뽑아서 답 찾기 → 점수 비교 순서예요." }) },
    { name: "그려 보기 — 문제 만들기", inst: "체험 학습에서 만난 수로 붙임쪽지 두 장에 문제를 만들어 보세요. 어림할 수를 쓰고, 어림 방법과 나타낼 자리를 고른 다음, 답도 써요. 두 쪽지의 어림 방법은 다르게 해요.", hints: ["예) 2637을 반올림하여 백의 자리까지 → 2600", "구하려는 자리 아래 수가 모두 0이면 어림해도 그대로라 문제가 되지 않아요."],
      render: (b, a) => rg1Make(b, a, { n: 2, ok: "문제와 답이 맞아요. 문제 쪽지는 접어 바구니에, 답 쪽지는 칠판에 붙여요." }) },
    { name: "말해 보기 — 퀴즈 놀이", inst: "가 모둠과 나 모둠이 번갈아 바구니에서 문제를 뽑아요. 칠판에서 알맞은 답 쪽지를 찾아 눌러 보세요. 틀린 문제는 바구니로 돌아가요.", hints: ["올림·버림은 구하려는 자리 아래 수를 보고, 반올림은 바로 아래 자리 숫자를 봐요.", "소수 문제는 소수점의 자리를 잘 살펴요."],
      render: thenWhy((b, a) => rg1Game(b, a, { game: RGS_GAME, ok: "모든 문제의 답을 찾았어요. 점수를 더 많이 얻은 모둠이 이겨요!" }),
        { q: "놀이에서 가장 헷갈렸던 문제를 하나 골라, 답을 찾은 방법을 써 볼까요?", ph: "예) 2650을 반올림하여 백의 자리까지 나타내는 문제가 ~", help: ["① 헷갈렸던 문제를 하나 골라요. → ② 어떤 자리의 숫자를 보고 어떻게 했는지 차례대로 써요.", "‘~을 ~하여 ~까지 나타내는 문제였어요. ~의 자리 숫자가 ~이라서 ~했어요.’ 꼴로 써요."], ans: "2650을 반올림하여 백의 자리까지 나타내는 문제가 헷갈렸어요. 바로 아래 자리인 십의 자리 숫자가 5라서 올려서 2700이 답이에요." }) },
    { name: "약속하기 — 주사위 어림 놀이", inst: "또 다른 놀이예요. ‘둘레’나 ‘넓이’를 외치며 주사위 두 개를 던지고, 두 눈의 수를 가로·세로로 하는 직사각형의 둘레나 넓이를 구한 뒤 반올림하여 십의 자리까지 나타내요. 3회 성공하면 끝나요.", hints: ["둘레는 (가로 + 세로) × 2, 넓이는 가로 × 세로예요.", "반올림하여 십의 자리까지 나타낼 때는 일의 자리 숫자를 봐요. 예) 24 → 20, 25 → 30"],
      render: (b, a) => rg1Dice(b, a, { goal: 3, ok: "둘레와 넓이를 구하고 반올림하여 십의 자리까지 잘 나타냈어요." }) },
    { name: "확인하기 — 놀이를 돌아봐요", inst: "놀이에서 나온 문제를 다시 풀어 보세요.", hints: ["3.472를 올림하여 소수 첫째 자리까지 나타내면 0.072를 0.1로 생각해요.", "올림한 수는 처음 수와 같거나 크고, 버림한 수는 처음 수와 같거나 작아요."],
      render: (b, a) => rg1Ask(b, a, [
        { parts: ["4386을 버림하여 백의 자리까지 나타내면 ", { n: 4300, why: { "4400": "4400은 올림하거나 반올림한 값이에요. 버림은 아래 수 86을 0으로 생각해요." } }, "이고, 3.472를 올림하여 소수 첫째 자리까지 나타내면 ", { n: 3.5, why: { "3.4": "3.4는 버림한 값이에요." } }, "예요."] },
        { parts: ["올림한 수는 처음 수와 ", { o: ["같거나 커요", "같거나 작아요"], a: 0 }, ". 버림한 수는 처음 수와 ", { o: ["같거나 커요", "같거나 작아요"], a: 1 }, "."] }],
        { ok: "4386 → 4300, 3.472 → 3.5예요. 올림하면 같거나 커지고, 버림하면 같거나 작아져요." }) }
  ],
  challenge: { inst: "수 카드 놀이예요. 수 카드 2, 5, 7을 한 번씩 써서 세 자리 수를 만들어요.", hints: ["반올림하여 백의 자리까지 나타내면 500이 되는 수는 450 이상 550 미만이에요.", "올림하여 백의 자리까지 나타내면 300이 되는 수는 200 초과 300 이하예요."],
    render: (b, a) => rg1Cards(b, a, { cards: [2, 5, 7], tasks: [
      { q: "반올림하여 백의 자리까지 나타내면 500이 되는 수 중에서 가장 큰 수를 만들어 보세요.", kind: "best", ok: n => rg1Rnd(n, "반올림", 2) === 500, cmp: "max" },
      { q: "올림하여 백의 자리까지 나타내면 300이 되는 수 중에서 가장 작은 수를 만들어 보세요.", kind: "best", ok: n => rg1Rnd(n, "올림", 2) === 300, cmp: "min" }],
      ok: "반올림하여 500이 되는 수는 527, 올림하여 300이 되는 수 중 가장 작은 수는 257이에요." }) }
},
{
  id: "s11", no: 11, title: "현장 체험 학습 보고회", soop: "발표하기(P)",
  question: "수의 범위와 어림하기로 체험 학습을 어떻게 준비했는지 발표할 수 있나요?",
  summary: "이상·이하는 경계의 수를 포함하고(●), 초과·미만은 포함하지 않아요(○). 올림은 아래 수를 올리고(최소), 버림은 아래 수를 버리고(최대), 반올림은 바로 아래 자리 숫자가 0~4이면 버리고 5~9이면 올려요. 상황에 알맞은 방법을 골라 어림해요.",
  steps: [
    { name: "만져 보기 — 이상인 수와 이하인 수", inst: "보고회 날이에요! 지호가 낸 첫 번째 문제예요. 38 이상인 수에 모두 ○표, 41 이하인 수에 모두 △표 해 보세요. 한 수에 ○표와 △표를 함께 할 수도 있어요.", hints: ["38과 41은 두 범위에 모두 들어가요.", "38 이상인 수는 38과 같거나 큰 수, 41 이하인 수는 41과 같거나 작은 수예요."],
      render: (b, a) => rg1Mark(b, a, { vals: [38, 12, 55, 27.5, 41, 60], marks: [{ sym: "○", lo: 38, loInc: true }, { sym: "△", hi: 41, hiInc: true }],
        ok: "38 이상인 수는 38, 55, 41, 60이고, 41 이하인 수는 38, 12, 27.5, 41이에요. 38과 41은 두 범위에 모두 들어가요." }) },
    { name: "그려 보기 — 범위를 그림으로", inst: "서연이가 낸 문제예요. 수의 범위를 수직선에 나타내 보세요.", hints: ["22에는 ●, 25에는 ○이에요.", "16.5는 16과 17 사이의 가운데예요. 16.5에는 ○, 18에는 ●이에요."],
      render: (b, a) => rg1Chain(b, a, [
        (x, y) => rg1Line(x, y, Object.assign(RG1L(20, 27), { q: "① 22 이상 25 미만인 수", r: { lo: 22, loInc: true, hi: 25, hiInc: false } })),
        (x, y) => rg1Line(x, y, Object.assign(RG1L(14, 21, { step: .5, lab: 1 }), { q: "② 16.5 초과 18 이하인 수 (작은 눈금 한 칸은 0.5예요.)", r: { lo: 16.5, loInc: false, hi: 18, hiInc: true }, ok: "16.5에 ○, 18에 ●을 찍고 두 점 사이에 선을 그었어요." }))]) },
    { name: "말해 보기 — 두 학교의 학생 수", inst: "도윤이가 낸 문제예요. 별빛 놀이공원에 같은 날 함께 온 두 학교의 학생 수예요. 올림, 버림, 반올림하여 백의 자리까지 나타내 보세요.", hints: ["286을 올림하면 300, 버림하면 200이에요.", "314를 반올림할 때는 십의 자리 숫자 1을 봐요."],
      render: thenWhy((b, a) => rg1Ask(b, a, [
        { fig: () => rg1Tab(["학교", "학생 수(명)"], [["푸른초등학교", "286"], ["햇살초등학교", "314"]], "학교별 학생 수"),
          parts: ["푸른초등학교 286명 → 올림 ", { n: 300 }, ", 버림 ", { n: 200 }, ", 반올림 ", { n: 300, why: { "200": "십의 자리 숫자 8은 올려요." } }, h("br"), "햇살초등학교 314명 → 올림 ", { n: 400 }, ", 버림 ", { n: 300 }, ", 반올림 ", { n: 300, why: { "400": "십의 자리 숫자 1은 버려요." } }] }],
        { ok: "286은 올림 300, 버림 200, 반올림 300이고, 314는 올림 400, 버림 300, 반올림 300이에요." }),
        { q: "286과 314를 반올림하여 백의 자리까지 나타내면 둘 다 300이 되는 까닭을 써 볼까요?", ph: "286은 ~, 314는 ~", help: ["① 286과 314가 각각 200, 300, 400 중 어디에 더 가까운지 생각해요. → ② 반올림은 더 가까운 쪽으로 어림한다는 것을 써요.", "‘286은 ~보다 ~에 더 가깝고, 314도 ~보다 ~에 더 가까워서 둘 다 ~이 돼요.’ 꼴로 써요."], ans: "286은 200보다 300에 더 가깝고, 314도 400보다 300에 더 가까워서 반올림하면 둘 다 300이 돼요." }) },
    { name: "약속하기 — 하린이네 가족 입장료", inst: "하린이는 다음 주말에 가족과 함께 별빛 놀이공원에 다시 가기로 했어요. 하린 11세, 아버지 45세, 어머니 43세, 동생 4세, 할머니 67세예요. 나이별 입장료 표를 보고 모두 얼마를 내야 하는지 구해 보세요.", hints: ["동생 4세는 ‘4세 이상 13세 미만’이라 어린이 요금이에요.", "할머니 67세는 65세 이상이라 12000원이에요."],
      render: (b, a) => rg1Ask(b, a, [{ fig: rgsAgeTab,
        parts: ["하린 ", { n: 15000 }, "원 + 아버지 ", { n: 25000 }, "원 + 어머니 ", { n: 25000 }, "원 + 동생 ", { n: 15000, why: { "0": "4세는 ‘4세 미만’이 아니에요. 4세 이상 13세 미만이라 어린이 요금이에요." } }, "원 + 할머니 ", { n: 12000, why: { "25000": "67세는 65세 이상이라 12000원이에요." } }, "원 = 모두 ", { n: 92000, w: "6em" }, "원"] }],
        { ok: "15000 + 25000 + 25000 + 15000 + 12000 = 92000(원)이에요." }) },
    { name: "확인하기 — 처음 궁금증 돌아보기", inst: "1차시에 붙인 ‘궁금해요’ 쪽지를 다시 보고, 체험 학습 준비를 마무리하는 글을 써 보세요.", hints: ["궁금했던 것을 이제 수의 범위나 어림으로 답할 수 있는지 살펴봐요.", "직접 수직선에 나타내거나 묶음을 늘려 본 활동을 떠올려요."],
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "1차시에 궁금했던 것 하나에 이제 답해 보세요.", tag: "궁금증에 답하기", ph: "예) ‘140 cm 이상’에 140 cm도 들어가는지 궁금했어요. ~", help: ["① 궁금했던 것을 하나 골라요. → ② 배운 것(이상·이하·초과·미만, 올림·버림·반올림)으로 답해요.", "‘~이 궁금했어요. 이제 ~라는 것을 알아요. 예를 들어 ~.’ 꼴로 써요."], ans: "‘140 cm 이상’에 140 cm도 들어가는지 궁금했어요. 이제 ‘이상’은 기준이 되는 수를 포함한다는 것을 알아요. 그래서 140 cm인 사람도 회오리 열차를 탈 수 있어요." },
        { q: "체험 학습을 준비하며 가장 기억에 남는 수의 범위나 어림 활동을 소개해 보세요.", tag: "기억에 남는 활동", ph: "예) 열쇠고리 136개를 10개 묶음으로 산 것이 ~", help: ["① 가장 기억에 남는 활동을 골라요. → ② 무엇을 알게 되었는지 차례대로 써요.", "‘~을 했어요. ~해 보니 ~라는 것을 알게 되었어요.’ 꼴로 써요."], ans: "열쇠고리 136개를 10개 묶음으로 사는 활동을 했어요. 13묶음이면 6개가 모자라서 올림하여 140개를 사야 한다는 것을 알게 되었어요. 모두 받아야 할 때는 올림이 알맞아요." }])) }
  ],
  challenge: { inst: "보고회 마지막 문제예요. 수 카드 3, 5, 1을 한 번씩 써서 세 자리 수를 만들어요. 지호: “올림하여 백의 자리까지 나타내었을 때 400이면 백의 자리 숫자는 3이구나.”", hints: ["올림하여 백의 자리까지 400이 되는 수는 300 초과 400 이하예요.", "백의 자리 숫자가 3인 수를 모두 만들어 봐요."],
    render: (b, a) => rg1Cards(b, a, { cards: [3, 5, 1], tasks: [{ q: "올림하여 백의 자리까지 나타내면 400이 되는 수를 모두 만들어 보세요.", kind: "all", ok: n => rg1Rnd(n, "올림", 2) === 400, show: n => `올림하여 백의 자리까지 나타내면 ${rg1Rnd(n, "올림", 2)}` }],
      ok: "315와 351, 2개예요. 체험 학습 준비 끝!" }) }
}
];
