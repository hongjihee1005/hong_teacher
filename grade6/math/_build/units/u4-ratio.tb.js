//@@APP
const APP={title:"휴양림 비와 비율", unit:"6-1 수학 4. 비와 비율(교과서)", key:"t61-ratio-v1", welcome:"휴양림 비와 비율 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 휴양림에 간 민석이네 가족과 주리네 가족과 함께 모노레일·유자차·낚시·산책 지도·농구 던져 넣기·설문 조사를 살펴보며 두 양의 비교, 비와 비율, 백분율을 알아봐요."};
//@@UNIT
/* =========================================================
   6-1 수학 4. 비와 비율 — 단원 조작 부품 (앞글자 ra4)
   ra4Chain  빈칸 줄(수·분수·비 □ : □·고르기 칩)          ra4Seq   여러 활동을 차례로
   ra4Build  묶음(모노레일·반죽·통·병)을 하나씩 더하며 두 양 비교하기
   ra4Slots  양 카드를 비교하는 양·기준량 자리에 놓아 비 만들기
   ra4Choc   초콜릿 먹기(눌러서)                           ra4Comp  두 막대와 수직선으로 몇 배인지 재기
   ra4Rect   모눈에서 직사각형 모서리를 끌어 가로·세로 바꾸기   ra4Map   두 지도에 같은 거리 그리기(축척)
   ra4Calc   계산기                                       ra4Tape2 이중 테이프(양 ↔ 비율·백분율)
   ra4Grid   모눈 칸 색칠하기                              ra4Link  비율이 같은 것끼리 잇기
   ra4Save   줄일 가전제품 고르기                          ra4Make  비율 비교 문제 만들기
   ra4Same · ra4Memory · ra4High   9차시 '비율이 같은 카드를 찾아요!' 놀이
   글 속 [3/5] 은 화면에서 세로 분수로 보여요.
   ========================================================= */
/* ---------- 유리수 셈 ---------- */
const ra4G = (a, b) => b ? ra4G(b, a % b) : Math.abs(a);
function ra4Q(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = ra4G(n, d) || 1; return { n: n / g, d: d / g }; }
const ra4MulQ = (x, y) => ra4Q(x.n * y.n, x.d * y.d);
const ra4DivQ = (x, y) => ra4Q(x.n * y.d, x.d * y.n);
const ra4EqQ = (x, y) => !!x && !!y && x.n * y.d === y.n * x.d;
const ra4Lt = (x, y) => x.n * y.d < y.n * x.d;
/* "12" · "0.8" · "2/3" · "[2/3]" → 유리수 */
function ra4P(s) {
  s = String(s == null ? "" : s).trim().replace(/^\[|\]$/g, "").replace(/,/g, "").replace(/\s+/g, " ").trim();
  let m;
  if ((m = s.match(/^(\d+)$/))) return ra4Q(+m[1], 1);
  if ((m = s.match(/^(\d*)\.(\d+)$/))) return ra4Q(+((m[1] || "0") + m[2]), 10 ** m[2].length);
  if ((m = s.match(/^(?:(\d+) )?(\d+)\s*\/\s*(\d+)$/))) { const d = +m[3]; if (!d) return null; return ra4Q((m[1] ? +m[1] * d : 0) + +m[2], d); }
  return null;
}
/* 소수로 쓸 수 있으면 소수 글, 아니면 null */
function ra4Dec(q) {
  let k = 0; while (k < 8 && (10 ** k) % q.d) k++;
  if ((10 ** k) % q.d) return null;
  const v = q.n * (10 ** k / q.d); if (!k) return String(v);
  const s = String(v).padStart(k + 1, "0"); return s.slice(0, -k) + "." + s.slice(-k);
}
const ra4Fr = q => q.d === 1 ? String(q.n) : `[${q.n}/${q.d}]`;
const ra4Pc = q => { const p = ra4MulQ(q, ra4Q(100)); return ra4Dec(p) || ra4Fr(p); };
/* 카드 글 "3 : 4" · "[3/4]" · "0.75" · "75 %" → 비율 */
function ra4V(t) {
  const s = String(t).trim();
  if (s.includes(":")) { const [a, b] = s.split(":").map(x => ra4P(x.trim())); return ra4DivQ(a, b); }
  const m = s.match(/^([\d.]+)\s*%$/); if (m) return ra4DivQ(ra4P(m[1]), ra4Q(100));
  return ra4P(s);
}
/* 비율을 세 가지로: [3/4] = 0.75 = 75 % */
function ra4Say(q) { const d = ra4Dec(q); return `${ra4Fr(q)}${d && q.d !== 1 ? " = " + d : ""} = ${ra4Pc(q)} %`; }

/* ---------- 분수 표기 (글 속 [3/5]) ---------- */
const RA4_SRC = "\\[(?:(\\d+|□) )?([0-9□]+)\\/([0-9□]+)\\]";
const ra4Re = () => new RegExp(RA4_SRC, "g");
function ra4Plain(s) { return String(s == null ? "" : s).replace(ra4Re(), (m, w, n, d) => `${w ? w + "과 " : ""}${d}분의 ${n}`); }
/* 받침에 맞는 조사(분수는 분자를 마지막에 읽음, %는 퍼센트) */
function ra4J(s, pair) {
  const str = String(s), core = str.replace(/\/[0-9□]+\]/g, "]"), digits = core.replace(/[^0-9]/g, "");
  const c = /[0-9]\]?\s*$/.test(core) ? digits[digits.length - 1] : core.replace(/[\]\s]+$/, "").slice(-1);
  let has = false, rieul = false;
  const lat = core.match(/(kWh|mL|kg|km|cm|g|m|L|%)\s*$/);
  if (lat) { has = /^(g|kg)$/.test(lat[1]); }
  else if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"] };
  const [a, b] = M[pair];
  if (pair === "으로") return str + (has && !rieul ? a : b);
  return str + (has ? a : b);
}
function ra4FracEl(w, n, d) {
  return h("span", { class: "ra4fr" }, w != null && w !== "" ? h("span", { class: "ra4fw" }, String(w)) : null,
    h("span", { class: "ra4fq" }, h("span", { class: "ra4fn" }, String(n)), h("span", { class: "ra4fd" }, String(d))));
}
function ra4RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = ra4Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(ra4FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function ra4RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return ra4RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(ra4RenderText);
}
(function ra4Style() {
  const s = document.createElement("style"); s.id = "ra4-style";
  s.textContent = `
.ra4fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.ra4fw{margin-right:.1em}
.ra4fq{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.ra4fq>.ra4fn{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.ra4fq>.ra4fd{padding:.05em .14em 0}
.ra4fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none;max-height:62vh}
.ra4part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.ra4chain{margin:.3em 0}
.ra4cl{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .35em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.06);margin:.45em 0;line-height:1.8;word-break:keep-all}
.ra4tag{background:var(--pine-soft);color:var(--pine);border-radius:.5em;padding:0 .55em;font-size:.85em}
input.ra4i{box-sizing:border-box;width:3.6em;height:1.7em;padding:0 .15em;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.02);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink);max-width:100%}
input.ra4i.ra4w{width:5.6em}
.ra4fin{display:inline-flex;flex-direction:column;align-items:stretch;gap:.12em;vertical-align:middle}
.ra4fin input.ra4i{width:3.4em;height:1.5em}
.ra4bar{display:block;height:.17em;background:var(--ink);border-radius:.1em}
.ra4rin{display:inline-flex;align-items:center;gap:.25em}
.ra4chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.ra4chs .opt{padding:.05em .6em}
.opt.ra4on{border-color:var(--ring);background:var(--ring-soft)}
.ra4tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.45em 0}
.ra4tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em;font-family:Jua,sans-serif}
.ra4tools button.ra4sel{background:var(--night);color:#fff;border-color:var(--night)}
.ra4tools button:disabled{opacity:.45}
.ra4read{font-family:Jua,sans-serif;font-size:var(--fs);color:var(--night);line-height:1.6;word-break:keep-all;margin:.25em 0}
.ra4note{font-size:var(--fs-s);color:var(--muted);margin:.2em 0}
.ra4tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.ra4tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.ra4tbl th,.ra4tbl td{border:1.5px solid var(--line);padding:.25em .6em;text-align:center}
.ra4tbl th{background:#F2F5F4;font-family:Jua,sans-serif;font-weight:400}
.ra4big{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.5);color:var(--night);text-align:center;margin:.2em 0}
.ra4chips{display:flex;flex-wrap:wrap;gap:.5em;margin:.4em 0}
.ra4chip{font-family:Jua,sans-serif;border:3px solid var(--line);background:#fff;border-radius:.7em;padding:.3em .8em;cursor:pointer;color:var(--ink)}
.ra4chip.ra4pk{border-color:var(--ring);background:var(--ring-soft)}
.ra4slots{display:flex;align-items:flex-start;justify-content:center;gap:.6em;margin:.5em 0;font-family:Jua,sans-serif}
.ra4slot{min-width:4.6em;min-height:2.2em;border:3px dashed var(--night);border-radius:.6em;background:#FFFDF6;font-size:calc(var(--fs)*1.4);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink)}
.ra4slot.ra4full{border-style:solid}
.ra4colon{font-size:calc(var(--fs)*1.6);line-height:2.1}
.ra4sl{display:flex;flex-direction:column;align-items:center;gap:.2em}
.ra4sl small{font-size:var(--fs-s);color:var(--pine);min-height:1.3em}
.ra4phrase{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);background:#F7FAF8;border:2px solid var(--line);border-radius:.7em;padding:.35em .7em;margin:.35em 0;word-break:keep-all}
.ra4cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,6.4em),1fr));gap:.45em;margin:.4em 0}
.ra4card{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);min-height:2.9em;border:3px solid var(--night);border-radius:.7em;background:#FFFDF6;display:flex;align-items:center;justify-content:center;padding:.2em .3em;cursor:pointer;color:var(--ink)}
.ra4card.ra4back{background:repeating-linear-gradient(45deg,#2C4166,#2C4166 8px,#34507D 8px,#34507D 16px);color:#fff}
.ra4card.ra4up{background:#FFF6D8;border-color:var(--ring)}
.ra4card.ra4me{background:var(--pine-soft);border-color:var(--ok);opacity:.55;cursor:default}
.ra4card.ra4com{background:#F8E1DB;border-color:var(--no);opacity:.55;cursor:default}
.ra4card:disabled{cursor:default}
.ra4link{display:grid;gap:.4em .8em;margin:.4em 0}
.ra4link>div{display:flex;flex-direction:column;gap:.4em}
.ra4link .ra4lh{font-family:Jua,sans-serif;color:var(--pine);text-align:center}
.ra4link button{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:3px solid var(--line);background:#fff;border-radius:.6em;padding:.3em .3em;min-height:2.6em;color:var(--ink);cursor:pointer;word-break:keep-all}
.ra4link button.ra4pk{border-color:var(--ring);background:var(--ring-soft)}
.ra4apps{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,9em),1fr));gap:.5em;margin:.4em 0}
.ra4app{font-family:Jua,sans-serif;border:3px solid var(--line);background:#fff;border-radius:.8em;padding:.4em .5em;cursor:pointer;color:var(--ink);text-align:center;word-break:keep-all}
.ra4app b{display:block;font-weight:400;color:var(--pine)}
.ra4app.ra4pk{border-color:var(--ok);background:var(--pine-soft)}
.ra4players{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,8.5em),1fr));gap:.5em;margin:.4em 0}
.ra4pl{border:3px solid var(--line);border-radius:.8em;background:#fff;padding:.35em .4em;text-align:center;cursor:pointer;font-family:Jua,sans-serif;color:var(--ink)}
.ra4pl .ra4card{cursor:inherit;margin-top:.25em}
.ra4pl.ra4pk{border-color:var(--ring);background:var(--ring-soft)}
.ra4score{display:flex;flex-wrap:wrap;gap:.4em 1em;font-family:Jua,sans-serif;color:var(--night);margin:.3em 0}
.ra4calc{display:inline-grid;grid-template-columns:repeat(4,3.1em);gap:.3em;background:#EEF2F0;border:2px solid var(--line);border-radius:.8em;padding:.5em;margin:.4em 0;max-width:100%}
.ra4calc .ra4scr{grid-column:1/-1;background:#fff;border:2px solid var(--line);border-radius:.4em;text-align:right;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.2);padding:.1em .4em;min-height:1.6em;overflow:hidden;word-break:break-all}
.ra4calc button{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);background:#fff;border-radius:.5em;padding:.25em 0;color:var(--ink)}
.ra4calc button.ra4op{background:#FFF1DE}
.ra4mk{display:flex;flex-wrap:wrap;align-items:center;gap:.3em;font-family:Jua,sans-serif;line-height:2;word-break:keep-all}
`;
  document.head.append(s);
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") ra4RenderText(m.target); else m.addedNodes.forEach(ra4RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(ra4Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
/* 엔진 부품의 '답 따라 쓰기' 글은 읽는 말(5분의 3)로 */
function ra4A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(ra4Plain) }) }); }
const ra4Quiz0 = quiz, ra4Blanks0 = blanks;
quiz = (b, a, items, o) => ra4Quiz0(b, ra4A(a), items, o);
blanks = (b, a, parts, o) => ra4Blanks0(b, ra4A(a), parts, o);

/* SVG 글: [분수]는 쌓은 분수로 */
function ra4Cw(ch, s) { return /[가-힣]/.test(ch) ? s * .95 : /[0-9]/.test(ch) ? s * .56 : ch === " " ? s * .3 : /[A-Za-z]/.test(ch) ? s * .55 : s * .6; }
function ra4SvgLine(str, x, y, size = 24, opt = {}) {
  const g = svgEl("g", { "pointer-events": "none" }), fs = size * .8, fill = opt.fill || INK;
  const segs = []; let last = 0; const re = ra4Re(); let m; const S = String(str);
  while ((m = re.exec(S))) { if (m.index > last) segs.push({ t: S.slice(last, m.index) }); segs.push({ w: m[1], n: m[2], d: m[3] }); last = m.index + m[0].length; }
  if (last < S.length) segs.push({ t: S.slice(last) });
  const tw = t => [...t].reduce((a, c) => a + ra4Cw(c, size), 0);
  const fw = s => Math.max(String(s.n).length, String(s.d).length) * fs * .6 + 8;
  const wid = s => s.t != null ? tw(s.t) : (s.w ? tw(s.w) + 3 : 0) + fw(s);
  const total = segs.reduce((a, s) => a + wid(s), 0);
  let cx = opt.anchor === "start" ? x : opt.anchor === "end" ? x - total : x - total / 2;
  const T = (xx, yy, t, sz) => txt(xx, yy, t, sz, { "text-anchor": "start", fill, style: "white-space:pre" });
  segs.forEach(s => {
    if (s.t != null) g.append(T(cx, y, s.t, size));
    else {
      let fx = cx;
      if (s.w) { g.append(T(fx, y, s.w, size)); fx += tw(s.w) + 3; }
      const f = fw(s), mid = fx + f / 2;
      g.append(txt(mid, y - fs * .6, s.n, fs, { fill }), svgEl("line", { x1: fx + 2, y1: y, x2: fx + f - 2, y2: y, stroke: fill, "stroke-width": Math.max(1.6, size / 13) }), txt(mid, y + fs * .64, s.d, fs, { fill }));
    }
    cx += wid(s);
  });
  return g;
}
const ra4Go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
const ra4Alive = el => document.body.contains(el);
function ra4Tbl(head, rows) {
  return h("div", { class: "ra4tbl" }, h("table", {}, h("tr", {}, head.map(t => h("th", {}, t))), rows.map(r => h("tr", {}, r.map((c, i) => i === 0 ? h("th", {}, c) : h("td", {}, c))))));
}
const RA4_WORDS = ["비", "기준량", "비교하는 양", "비율", "백분율", "%"];
/* 만지기가 끝난 뒤: ask(빈칸 줄)이 있으면 열고, 없으면 끝 */
function ra4Finish(body, api, opt, ans, msg) {
  const ask = typeof opt.ask === "function" ? opt.ask() : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 빈칸도 채워 봐요."); const box = h("div", { class: "ra4part" }); body.append(box); ra4Chain(box, api, ask, { ok: opt.ok, bad: opt.bad, words: opt.words }); ra4Go(box); }
  else api.done(ans, opt.ok || msg);
}
/* 여러 활동을 차례로 */
function ra4Seq(body, api, parts) {
  let k = 0; const host = h("div"); body.append(host);
  const run = () => {
    const box = h("div", { class: k ? "ra4part" : "" }); host.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); ra4Go(host.lastChild);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}

/* ---------- ① 빈칸 줄 ----------
   lines: [ 토막… ] 또는 {t:"이름표", p:[토막…]}
   토막: "글" | {i:"답"(수·분수·소수, 값이 같으면 정답), why} | {f:"3/10"(분수 칸, 값이 같으면 정답), why} | {r:[a,b](비 칸, 그대로 같아야 정답), why} | {c:[…], a:번호, why:{번호:"까닭"}} */
function ra4Inp(wide, label) {
  return h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "ra4i" + (wide ? " ra4w" : ""), "aria-label": label || "빈칸" });
}
function ra4FIn() {
  const n = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "ra4i", "aria-label": "분자" });
  const d = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "ra4i", "aria-label": "분모" });
  const el = h("span", { class: "ra4fin" }, n, h("span", { class: "ra4bar" }, "​"), d);
  el.get = () => { const N = n.value.trim(), D = d.value.trim(); if (!/^\d+$/.test(N) || !/^\d+$/.test(D) || +D === 0) return null; return ra4Q(+N, +D); };
  el.txt = () => `${n.value.trim() || "-"}/${d.value.trim() || "-"}`;
  el.paint = c => [n, d].forEach(x => { x.style.borderColor = c; });
  return el;
}
function ra4RIn(wa, wb) {
  const a = ra4Inp(wa, "비교하는 양"), b = ra4Inp(wb, "기준량");
  const el = h("span", { class: "ra4rin" }, a, h("span", {}, ":"), b);
  el.get = () => [ra4P(a.value), ra4P(b.value)];
  el.txt = () => `${a.value.trim() || "-"} : ${b.value.trim() || "-"}`;
  el.paint = c => [a, b].forEach(x => { x.style.borderColor = c; });
  return el;
}
function ra4Chain(body, api, lines, opt = {}) {
  const ctl = []; const wrap = h("div", { class: "ra4chain" });
  const ansParts = [];
  lines.forEach(L => {
    const row = h("div", { class: "ra4cl" }); let toks = L; const ans = [];
    if (!Array.isArray(L)) { row.append(h("span", { class: "ra4tag" }, L.t)); toks = L.p; ans.push(L.t + ": "); }
    toks.forEach(t => {
      if (typeof t === "string") { row.append(h("span", {}, t)); ans.push(t); }
      else if (t && t.nodeType) { row.append(t); }
      else if (t.i != null) { const el = ra4Inp(t.w || String(t.i).length > 3); ctl.push({ k: "i", t, el }); row.append(el); ans.push(String(t.i)); }
      else if (t.f != null) { const el = ra4FIn(); ctl.push({ k: "f", t, el }); row.append(el); ans.push(`[${t.f}]`); }
      else if (t.r) { const el = ra4RIn(String(t.r[0]).length > 3, String(t.r[1]).length > 3); ctl.push({ k: "r", t, el }); row.append(el); ans.push(`${t.r[0]} : ${t.r[1]}`); }
      else if (t.c) {
        const C = { k: "c", t, sel: null }; const chs = h("span", { class: "ra4chs" });
        t.c.forEach((o, oi) => chs.append(h("button", { class: "opt", onclick: e => { [...chs.children].forEach(b => b.classList.remove("ra4on", "good", "bad")); e.currentTarget.classList.add("ra4on"); C.sel = oi; } }, o)));
        C.el = chs; ctl.push(C); row.append(chs); ans.push(t.c[t.a]);
      }
    });
    wrap.append(row); ansParts.push(ans.join(""));
  });
  api.provide({ words: opt.words || RA4_WORDS, answers: ansParts.map(ra4Plain) });
  const judge = C => {
    const t = C.t;
    if (C.k === "i") {
      const v = C.el.value.trim().replace(/[,\s]/g, ""); if (!v) return { ok: false, v };
      const A = ra4P(t.i), V = ra4P(v);
      return { ok: A && V ? ra4EqQ(A, V) : v === String(t.i).replace(/\s/g, ""), v };
    }
    if (C.k === "f") { const q = C.el.get(); return { ok: !!q && ra4EqQ(q, ra4P(t.f)), v: C.el.txt() }; }
    if (C.k === "r") {
      const [x, y] = C.el.get(); const v = C.el.txt();
      if (!x || !y) return { ok: false, v };
      return { ok: ra4EqQ(x, ra4P(t.r[0])) && ra4EqQ(y, ra4P(t.r[1])), v };
    }
    return { ok: C.sel === t.a, v: C.sel == null ? "-" : t.c[C.sel] };
  };
  const btn = h("button", { class: "big", onclick: () => {
    api.tryOnce(); let bad = null; const got = [];
    ctl.forEach(C => {
      const r = judge(C); got.push(r.v);
      const col = r.ok ? "var(--ok)" : "var(--no)";
      if (C.k === "c") { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(r.ok ? "good" : "bad"); }); }
      else if (C.el.paint) C.el.paint(col); else C.el.style.borderColor = col;
      if (!r.ok && !bad) bad = { C, r };
    });
    if (!bad) return api.done(ra4Plain(got.join(" / ")), opt.ok || "잘했어요!");
    const t = bad.C.t, key = bad.C.k === "c" ? String(bad.C.sel) : String(bad.r.v).replace(/[\s,]/g, "");
    const why = t.why && (t.why[key] || t.why[String(bad.r.v)]);
    api.fail(why || opt.bad || "빨간 칸을 다시 생각해 봐요.", ra4Plain(got.join(" / ")));
  } }, opt.btn || "확인하기");
  body.append(wrap, h("div", { class: "actions" }, btn));
  return wrap;
}

/* ---------- 그림 조각 ---------- */
function ra4Icon(kind, x, y, s, lab) {
  const g = svgEl("g", { transform: `translate(${x},${y})` });
  const A = (t, a) => { const e = svgEl(t, a); g.append(e); return e; };
  const cup = (fill, st) => { A("path", { d: `M${-s * .32},${-s * .34}H${s * .32}L${s * .24},${s * .36}H${-s * .24}Z`, fill, stroke: st, "stroke-width": 2 }); A("path", { d: `M${-s * .32},${-s * .34}H${s * .32}`, stroke: st, "stroke-width": 3 }); };
  const person = (col, k) => { A("circle", { cx: 0, cy: -s * .3 * k, r: s * .14 * k, fill: "#F6D6B8", stroke: "#8A5A3A", "stroke-width": 1.5 }); A("path", { d: `M${-s * .17 * k},${s * .42 * k}V${-s * .06 * k}Q0,${-s * .16 * k} ${s * .17 * k},${-s * .06 * k}V${s * .42 * k}Z`, fill: col, stroke: "#22334A", "stroke-width": 1.5 }); };
  if (kind === "adult") person("#2B7BD6", 1.15);
  else if (kind === "child") person("#E47A38", .82);
  else if (kind === "water") cup("#9FD0F2", "#2B7BD6");
  else if (kind === "flour") cup("#FBF7EE", "#A89270");
  else if (kind === "yuja") cup("#F5C542", "#B48A12");
  else if (kind === "jeon") { A("ellipse", { rx: s * .4, ry: s * .3, fill: "#E9D36A", stroke: "#9C8420", "stroke-width": 2 }); [[-.15, -.05], [.12, .08], [.05, -.13], [-.05, .12]].forEach(([i, j]) => A("circle", { cx: i * s, cy: j * s, r: s * .045, fill: "#5E9A3A" })); }
  else if (kind === "kkochi") { A("line", { x1: -s * .45, y1: 0, x2: s * .45, y2: 0, stroke: "#8B6239", "stroke-width": 3 }); [-.24, 0, .24].forEach((i, k) => A("rect", { x: i * s - s * .1, y: -s * .14, width: s * .2, height: s * .28, rx: 3, fill: ["#E2574C", "#F3C77B", "#5E9A3A"][k], stroke: "#5A3A1A", "stroke-width": 1.5 })); }
  else if (kind === "car") { A("line", { x1: -s * .5, y1: s * .3, x2: s * .5, y2: s * .3, stroke: "#6F6656", "stroke-width": 4 }); A("rect", { x: -s * .45, y: -s * .25, width: s * .9, height: s * .5, rx: s * .12, fill: "#4FA3D9", stroke: "#1F4E79", "stroke-width": 2 }); [-.26, 0, .26].forEach(i => A("rect", { x: i * s - s * .09, y: -s * .16, width: s * .18, height: s * .16, rx: 2, fill: "#E9F6FF" })); }
  else if (kind === "dough") { A("path", { d: `M${-s * .45},${-s * .02}H${s * .45}Q${s * .4},${s * .38} 0,${s * .38}Q${-s * .4},${s * .38} ${-s * .45},${-s * .02}Z`, fill: "#C8D7E3", stroke: "#4D6B82", "stroke-width": 2 }); A("ellipse", { cx: 0, cy: -s * .06, rx: s * .3, ry: s * .14, fill: "#FBF2DD", stroke: "#B9A27A", "stroke-width": 1.5 }); }
  else if (kind === "box") { A("rect", { x: -s * .42, y: -s * .22, width: s * .84, height: s * .5, rx: 4, fill: "#F2E6D0", stroke: "#8A6A3A", "stroke-width": 2 }); A("rect", { x: -s * .46, y: -s * .3, width: s * .92, height: s * .12, rx: 3, fill: "#D9822B", stroke: "#8A6A3A", "stroke-width": 2 }); }
  else if (kind === "bottle") { A("path", { d: `M${-s * .1},${-s * .45}H${s * .1}V${-s * .28}L${s * .22},${-s * .12}V${s * .42}H${-s * .22}V${-s * .12}L${-s * .1},${-s * .28}Z`, fill: "#FCE8A8", stroke: "#B48A12", "stroke-width": 2 }); }
  else if (kind === "trap") { A("ellipse", { rx: s * .42, ry: s * .26, fill: "#DCE9DC", stroke: "#3E6B48", "stroke-width": 2 }); for (let i = -2; i <= 2; i++) A("line", { x1: i * s * .14, y1: -s * .24, x2: i * s * .14, y2: s * .24, stroke: "#3E6B48", "stroke-width": 1.2 }); A("ellipse", { cx: -s * .36, rx: s * .08, ry: s * .16, fill: "#fff", stroke: "#3E6B48", "stroke-width": 1.5 }); }
  else if (kind === "bait") { A("rect", { x: -s * .28, y: -s * .2, width: s * .56, height: s * .42, rx: 4, fill: "#F6D3A7", stroke: "#B9802E", "stroke-width": 2 }); A("rect", { x: -s * .32, y: -s * .28, width: s * .64, height: s * .1, rx: 3, fill: "#E2574C", stroke: "#962A21", "stroke-width": 1.5 }); }
  else if (kind === "choco") { A("rect", { x: -s * .4, y: -s * .26, width: s * .8, height: s * .52, rx: 4, fill: "#7A4A2A", stroke: "#3E2412", "stroke-width": 2 }); A("line", { x1: 0, y1: -s * .26, x2: 0, y2: s * .26, stroke: "#4F2D17", "stroke-width": 1.5 }); A("line", { x1: -s * .4, y1: 0, x2: s * .4, y2: 0, stroke: "#4F2D17", "stroke-width": 1.5 }); }
  else if (kind === "wrap") { A("rect", { x: -s * .4, y: -s * .26, width: s * .8, height: s * .52, rx: 4, fill: "none", stroke: "#B7A99A", "stroke-width": 2, "stroke-dasharray": "4 4" }); }
  else if (kind === "butterfly") { A("ellipse", { cx: -s * .2, cy: -s * .1, rx: s * .2, ry: s * .16, fill: "#F2A7C8", stroke: "#A2386B", "stroke-width": 1.5 }); A("ellipse", { cx: s * .2, cy: -s * .1, rx: s * .2, ry: s * .16, fill: "#F2A7C8", stroke: "#A2386B", "stroke-width": 1.5 }); A("ellipse", { cx: -s * .15, cy: s * .14, rx: s * .14, ry: s * .12, fill: "#F7C6DC", stroke: "#A2386B", "stroke-width": 1.5 }); A("ellipse", { cx: s * .15, cy: s * .14, rx: s * .14, ry: s * .12, fill: "#F7C6DC", stroke: "#A2386B", "stroke-width": 1.5 }); A("rect", { x: -s * .03, y: -s * .25, width: s * .06, height: s * .5, rx: 2, fill: "#3A2A1A" }); }
  else if (kind === "bee") { A("ellipse", { cx: -s * .08, cy: -s * .22, rx: s * .14, ry: s * .1, fill: "#E6F2FA", stroke: "#6A8BA0", "stroke-width": 1.5 }); A("ellipse", { cx: s * .1, cy: -s * .22, rx: s * .14, ry: s * .1, fill: "#E6F2FA", stroke: "#6A8BA0", "stroke-width": 1.5 }); A("ellipse", { rx: s * .3, ry: s * .2, fill: "#F5C542", stroke: "#3A2A1A", "stroke-width": 1.5 }); [-.1, .08].forEach(i => A("rect", { x: i * s, y: -s * .19, width: s * .07, height: s * .38, fill: "#3A2A1A" })); }
  else if (kind === "apple") { A("circle", { r: s * .32, fill: "#E2574C", stroke: "#962A21", "stroke-width": 2 }); A("path", { d: `M0,${-s * .3}q${s * .04},${-s * .14} ${s * .14},${-s * .16}`, stroke: "#5A3A1A", "stroke-width": 2.5, fill: "none" }); A("ellipse", { cx: s * .12, cy: -s * .38, rx: s * .1, ry: s * .05, fill: "#5E9A3A" }); }
  else if (kind === "carrot") { A("path", { d: `M${-s * .14},${-s * .28}L${s * .14},${-s * .28}L0,${s * .42}Z`, fill: "#F08A24", stroke: "#A2520F", "stroke-width": 2 }); A("path", { d: `M0,${-s * .28}l${-s * .12},${-s * .16}M0,${-s * .28}l0,${-s * .18}M0,${-s * .28}l${s * .12},${-s * .16}`, stroke: "#4E8A2F", "stroke-width": 3 }); }
  if (lab) g.append(txt(0, s * .5, lab, Math.max(13, s * .3), { fill: "#3A2A1A" }));
  return g;
}
const RA4_CNT = ["한", "두", "세", "네", "다섯", "여섯"];

/* ---------- ② 묶음 하나씩 더하기 ----------
   opt: {what:"모노레일", unit:"대", prod:"car", start, target, max, items:[{name, per, unit, icon, lump}], ask, ok}
   표는 만든 묶음까지만 수가 보이고, 나머지 칸은 '?'예요. */
function ra4Build(body, api, opt) {
  const its = opt.items, max = opt.max || 4, CW = 150;
  const lay = []; let y0 = opt.prod ? 76 : 16;
  its.forEach(it => { const cnt = it.lump ? 1 : it.per, rows = Math.ceil(cnt / 3); lay.push({ y: y0, rows, cnt }); y0 += rows * 42 + 16; });
  const H = y0 + 6;
  let n = opt.start, fin = false;
  const svg = makeSvg(CW * max + 10, H); svg.setAttribute("class", "ra4fig");
  const read = h("div", { class: "ra4read" }, "​"), tbl = h("div");
  const U = it => it.unit === "g" ? " g" : it.unit;
  const draw = () => {
    svg.innerHTML = "";
    for (let i = 0; i < max; i++) {
      const x = 8 + i * CW, on = i < n, cx = x + (CW - 10) / 2;
      svg.append(svgEl("rect", { x, y: 6, width: CW - 10, height: H - 12, rx: 12, fill: on ? "#FFFDF6" : "none", stroke: on ? "#C9B79C" : "#E3E7E5", "stroke-width": 2, "stroke-dasharray": on ? "" : "6 6" }));
      if (!on) { svg.append(txt(cx, H / 2, "?", 30, { fill: "#C9D4CF" })); continue; }
      if (opt.prod) { svg.append(ra4Icon(opt.prod, cx, 32, 54)); svg.append(txt(cx, 64, `${RA4_CNT[i]} ${opt.unit}`, 14, { fill: "#8A7B66" })); }
      its.forEach((it, k) => {
        const L = lay[k];
        for (let j = 0; j < L.cnt; j++) {
          const c = j % 3, r = Math.floor(j / 3), inRow = Math.min(3, L.cnt - r * 3);
          const ix = cx + (c - (inRow - 1) / 2) * 40, iy = L.y + 20 + r * 42;
          svg.append(ra4Icon(it.icon, ix, iy, it.lump ? 46 : 36, it.lump ? `${it.per}${U(it)}` : ""));
        }
      });
    }
    tbl.innerHTML = "";
    tbl.append(ra4Tbl([opt.head || `${opt.what} 수`].concat(RA4_CNT.slice(0, max).map(c => `${c} ${opt.unit}`)),
      its.map(it => [`${it.name}${it.unit === "g" ? "(g)" : `(${it.unit})`}`].concat(RA4_CNT.slice(0, max).map((_, i) => i < n ? String(it.per * (i + 1)) : "?")))));
    read.textContent = `${opt.what} ${n}${opt.unit}: ` + its.map(it => `${it.name} ${it.per * n}${U(it)}`).join(", ");
  };
  const plus = h("button", { onclick: () => { if (fin || n >= max) return; n++; after(); } }, `＋ ${opt.what} 하나 더`);
  const minus = h("button", { onclick: () => { if (fin || n <= 1) return; n--; after(); } }, `－ ${opt.what} 하나 빼기`);
  const after = () => {
    draw();
    if (n === opt.target) { fin = true; plus.disabled = minus.disabled = true; ra4Finish(body, api, opt, `${opt.what} ${n}${opt.unit}`, opt.msg || `${opt.what} ${n}${opt.unit}일 때의 두 양을 살펴봤어요.`); }
    else api.hint(n < opt.target ? `${opt.what} ${opt.target}${opt.unit}까지 늘려 봐요.` : `${opt.what} ${opt.target}${opt.unit}로 줄여 봐요.`);
  };
  api.provide({ words: ["몇 배", "나눗셈", "곱셈"], answers: [] });
  body.append(svg, h("div", { class: "ra4tools" }, plus, minus), read, tbl); draw();
  if (n === opt.target) after();
}

/* ---------- ③ 비 만들기: 양 카드를 자리에 놓기 ----------
   opt: {chips:[{t:"유자청 1컵", v:1, nm:"유자청의 양"}], tasks:[{q:"물의 양에 대한 유자청의 양의 비", a:[0,1]}], ok} */
function ra4Slots(body, api, opt) {
  const chips = opt.chips; let k = 0, pick = null; const put = [null, null];
  const phrase = h("div", { class: "ra4phrase" }, "​");
  const row = h("div", { class: "ra4chips" });
  const cbtn = chips.map((c, i) => h("button", { class: "ra4chip", onclick: () => { pick = pick === i ? null : i; cbtn.forEach((b, j) => b.classList.toggle("ra4pk", j === pick)); } }, c.t));
  cbtn.forEach(b => row.append(b));
  const lab = [h("small", {}, "​"), h("small", {}, "​")];
  const sl = [0, 1].map(s => h("button", { class: "ra4slot", "aria-label": s ? "기호 : 의 오른쪽" : "기호 : 의 왼쪽", onclick: () => {
    if (pick == null) { if (put[s] != null) { put[s] = null; paint(); } else api.hint("먼저 위의 양 카드를 눌러 골라요."); return; }
    put[s] = pick; pick = null; cbtn.forEach(b => b.classList.remove("ra4pk")); paint();
  } }, "□"));
  const paint = () => sl.forEach((b, s) => { b.textContent = put[s] == null ? "□" : String(chips[put[s]].v); b.classList.toggle("ra4full", put[s] != null); });
  const done = h("div", { class: "ra4read" }, "​");
  const show = () => { phrase.textContent = `${k + 1}. ${opt.tasks[k].q}`; put[0] = put[1] = null; lab.forEach(l => { l.textContent = "​"; }); paint(); };
  const btn = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const T = opt.tasks[k];
    if (put[0] == null || put[1] == null) return api.fail("기호 : 의 양쪽 □에 카드를 하나씩 놓아요.", "-");
    const got = `${chips[put[0]].v} : ${chips[put[1]].v}`;
    if (put[0] === T.a[1] && put[1] === T.a[0]) return api.fail(T.why || `‘~에 대한’ 앞에 있는 ${ra4J(chips[T.a[1]].nm, "이가")} 기준량이에요. 기준량은 기호 : 의 오른쪽에 써요.`, got);
    if (put[0] !== T.a[0] || put[1] !== T.a[1]) return api.fail(`‘${T.q}’에서 비교하는 두 양을 다시 찾아봐요.`, got);
    lab[0].textContent = "비교하는 양"; lab[1].textContent = "기준량";
    done.append(h("div", {}, `✔ ${T.q}: ${got}`));
    if (k === opt.tasks.length - 1) { btn.disabled = true; return api.done(done.textContent, opt.ok); }
    api.hint(`○ ${got} — 맞아요! 기호 : 의 오른쪽이 기준량이에요. 이어서 다음 문장도 비로 나타내 봐요.`.replace("다음 문장", "아래 문장"));
    k++; setTimeout(() => { if (ra4Alive(btn)) show(); }, 900);
  } }, "확인하기");
  api.provide({ words: ["~에 대한", "기준량", "비교하는 양", "기호 : 의 오른쪽"], answers: opt.tasks.map(T => `${chips[T.a[0]].v} : ${chips[T.a[1]].v}`) });
  body.append(h("p", { class: "ra4note" }, "양 카드를 누른 뒤 □를 눌러 놓아요. 놓은 카드를 다시 빼려면 □를 눌러요."), row, phrase,
    h("div", { class: "ra4slots" }, h("div", { class: "ra4sl" }, sl[0], lab[0]), h("span", { class: "ra4colon" }, ":"), h("div", { class: "ra4sl" }, sl[1], lab[1])), done, h("div", { class: "actions" }, btn));
  show();
}

/* ---------- ④ 초콜릿 먹기 ---------- opt: {total, eat, ask, ok} */
function ra4Choc(body, api, opt) {
  const N = opt.total, eaten = new Set(); let fin = false;
  const cols = 5, rows = Math.ceil(N / cols), S = 90;
  const svg = makeSvg(cols * S + 20, rows * 74 + 20); svg.setAttribute("class", "ra4fig"); svg.style.maxWidth = "520px";
  const read = h("div", { class: "ra4read" }, "​");
  const draw = () => {
    svg.innerHTML = "";
    for (let i = 0; i < N; i++) {
      const x = 10 + (i % cols) * S + S / 2, y = 10 + Math.floor(i / cols) * 74 + 37;
      const g = svgEl("g", { style: fin ? "cursor:default" : "cursor:pointer" });
      g.append(svgEl("rect", { x: x - S / 2 + 4, y: y - 34, width: S - 8, height: 68, fill: "#FFFDF6" }), ra4Icon(eaten.has(i) ? "wrap" : "choco", x, y, 76));
      g.addEventListener("click", () => { if (fin) return; eaten.has(i) ? eaten.delete(i) : eaten.add(i); after(); });
      svg.append(g);
    }
    read.textContent = `처음 초콜릿 ${N}개 · 먹은 초콜릿 ${eaten.size}개 · 남은 초콜릿 ${N - eaten.size}개`;
  };
  const after = () => {
    draw();
    if (eaten.size === opt.eat) { fin = true; draw(); ra4Finish(body, api, opt, `먹은 ${opt.eat}개, 남은 ${N - opt.eat}개`, `초콜릿 ${opt.eat}개를 먹었어요. 남은 초콜릿은 ${N - opt.eat}개예요.`); }
    else if (eaten.size > opt.eat) api.hint(`${opt.eat}개만 먹어요. 먹은 초콜릿을 다시 누르면 되돌릴 수 있어요.`);
  };
  api.provide({ words: RA4_WORDS, answers: [] });
  body.append(svg, read); draw();
}

/* ---------- ⑤ 두 막대와 수직선으로 몇 배인지 재기 ----------
   opt: {base:{name, n, icon}, comp:{name, n, icon}, ask, ok}  기준량 막대의 길이를 1로 보고 수직선에서 비교하는 양 막대의 끝을 찾아요(0.1 단위). */
function ra4Comp(body, api, opt) {
  const B = opt.base, C = opt.comp, mx = Math.max(1, Math.ceil(C.n / B.n * 10) / 10);
  const target = Math.round(C.n / B.n * 10);
  const x0 = 70, L = 520 / mx, cell = L / B.n, yB = 70, yC = 150, yN = 240;
  let v = 0, fin = false;
  const svg = makeSvg(660, 300); svg.setAttribute("class", "ra4fig");
  const read = h("div", { class: "ra4read" }, "​");
  const draw = () => {
    svg.innerHTML = "";
    const bar = (y, k, nm, icon, col) => {
      svg.append(txt(x0 - 8, y - 38, `${nm} ${k}개`, 17, { "text-anchor": "start", fill: "#4A5A55" }));
      for (let i = 0; i < k; i++) { svg.append(svgEl("rect", { x: x0 + i * cell, y: y - 22, width: cell, height: 44, fill: col, "fill-opacity": .25, stroke: col, "stroke-width": 2 })); svg.append(ra4Icon(icon, x0 + i * cell + cell / 2, y, Math.min(40, cell * .8))); }
    };
    bar(yB, B.n, B.name, B.icon, "#2B7BD6"); bar(yC, C.n, C.name, C.icon, "#E47A38");
    svg.append(txt(x0 + B.n * cell + 8, yB, "← 기준량", 15, { "text-anchor": "start", fill: "#2B7BD6" }));
    svg.append(svgEl("line", { x1: x0, y1: yN, x2: x0 + mx * L + 6, y2: yN, stroke: INK, "stroke-width": 3 }));
    for (let t = 0; t <= mx * 10 + 1e-9; t++) {
      const x = x0 + t / 10 * L, big = t % 10 === 0 || t % 5 === 0;
      svg.append(svgEl("line", { x1: x, y1: yN - (big ? 10 : 6), x2: x, y2: yN + (big ? 10 : 6), stroke: INK, "stroke-width": 2 }));
      if (t % 10 === 0) svg.append(txt(x, yN + 30, String(t / 10), 18));
    }
    svg.append(svgEl("line", { x1: x0 + B.n * cell, y1: yB + 22, x2: x0 + B.n * cell, y2: yN, stroke: "#2B7BD6", "stroke-width": 2, "stroke-dasharray": "5 5" }));
    const mxp = x0 + v / 10 * L;
    svg.append(svgEl("line", { x1: mxp, y1: yC - 30, x2: mxp, y2: yN, stroke: fin ? "#2E8B57" : "#C8472E", "stroke-width": 2, "stroke-dasharray": "3 4" }));
    svg.append(svgEl("path", { d: `M${mxp},${yN - 4} l-12,-22 h24 Z`, fill: fin ? "#2E8B57" : "#C8472E", style: "cursor:grab" }));
    svg.append(txt(mxp, yN - 40, (v / 10).toString(), 17, { fill: fin ? "#2E8B57" : "#C8472E" }));
  };
  const setFrom = p => { if (fin) return; v = Math.max(0, Math.min(Math.round(mx * 10), Math.round((p.x - x0) / L * 10))); draw(); read.textContent = `${C.name} 막대의 끝을 수직선에서 찾아요: 지금 ${v / 10}`; };
  dragOn(svg, p => { setFrom(p); return true; }, setFrom, () => {
    if (fin) return;
    if (v === target) { fin = true; draw(); read.textContent = `${C.name} 막대는 ${B.name} 막대(1)의 ${v / 10}배예요.`; ra4Finish(body, api, opt, String(v / 10), `${C.name} 수는 ${B.name} 수의 ${v / 10}배예요.`); }
    else if (v) api.hint(`빨간 표시를 ${C.name} 막대의 끝에 맞춰요. ${B.name} 막대 전체가 수직선의 1이에요.`);
  });
  api.provide({ words: ["기준량", "비교하는 양", "몇 배"], answers: [] });
  body.append(svg, read); draw();
}

/* ---------- ⑥ 모눈 직사각형 ----------
   opt: {W, H, w0, h0, lockH, nw:"가로", nh:"세로", base:"w"(기준량이 가로)|"h", tasks:[{goal, test:(w,h)=>bool, why:(w,h)=>글}], ok} */
function ra4Rect(body, api, opt) {
  const W = opt.W || 12, Hh = opt.H || 9, u = 40, ox = 40, oy = 20;
  let w = opt.w0, hh = opt.h0, k = 0, fin = false;
  const svg = makeSvg(ox + W * u + 30, oy + Hh * u + 44); svg.setAttribute("class", "ra4fig"); svg.style.maxWidth = "620px";
  const goal = h("div", { class: "ra4phrase" }, "​"), read = h("div", { class: "ra4read" }, "​");
  const nw = opt.nw || "가로", nh = opt.nh || "세로";
  const draw = () => {
    svg.innerHTML = "";
    for (let i = 0; i <= W; i++) svg.append(svgEl("line", { x1: ox + i * u, y1: oy, x2: ox + i * u, y2: oy + Hh * u, stroke: "#DCE4E0", "stroke-width": 1 }));
    for (let j = 0; j <= Hh; j++) svg.append(svgEl("line", { x1: ox, y1: oy + j * u, x2: ox + W * u, y2: oy + j * u, stroke: "#DCE4E0", "stroke-width": 1 }));
    const by = oy + Hh * u;
    svg.append(svgEl("rect", { x: ox, y: by - hh * u, width: w * u, height: hh * u, fill: opt.fill || "#FFE9A8", "fill-opacity": .85, stroke: "#B48A12", "stroke-width": 3 }));
    svg.append(txt(ox + w * u / 2, by + 22, `${nw} ${w} ${opt.unit || "cm"}`, 17, { fill: "#4A5A55" }));
    svg.append(txt(ox - 8, by - hh * u / 2, `${hh}`, 17, { "text-anchor": "end", fill: "#4A5A55" }));
    svg.append(svgEl("circle", { cx: ox + w * u, cy: by - hh * u, r: 12, fill: fin ? "#2E8B57" : "#C8472E", stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }));
    const q = opt.base === "h" ? ra4Q(w, hh) : ra4Q(hh, w), d = ra4Dec(q);
    read.textContent = opt.base === "h"
      ? `${nw} ${w} ${opt.unit || "cm"}, ${nh} ${hh} ${opt.unit || "cm"} → ${nw}는 ${nh}의 ${ra4Fr(q)}${d && q.d !== 1 ? " (= " + d + ")" : ""}배`
      : `${nw} ${w} cm, ${nh} ${hh} cm → ${nw}에 대한 ${nh}의 비 ${hh} : ${w}, 비율 [${hh}/${w}]${d ? " = " + d : ""}`;
  };
  const show = () => { goal.textContent = `${k + 1}. ${opt.tasks[k].goal}`; };
  const setFrom = p => { if (fin) return; w = Math.max(1, Math.min(W, Math.round((p.x - ox) / u))); if (!opt.lockH) hh = Math.max(1, Math.min(Hh, Math.round((oy + Hh * u - p.y) / u))); draw(); };
  dragOn(svg, p => { setFrom(p); return true; }, setFrom);
  const btn = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const T = opt.tasks[k], got = `${nw} ${w}, ${nh} ${hh}`;
    if (!T.test(w, hh)) return api.fail(T.why ? T.why(w, hh) : "모양을 다시 바꿔 봐요.", got);
    if (k === opt.tasks.length - 1) { fin = true; draw(); btn.disabled = true; return api.done(got, typeof opt.ok === "function" ? opt.ok(w, hh) : opt.ok); }
    api.hint("○ 맞아요! 아래 목표도 해 봐요."); k++; show();
  } }, "이 모양으로 확인하기");
  api.provide({ words: ["가로", "세로", "기준량", "비율"], answers: [] });
  body.append(goal, svg, h("p", { class: "ra4note" }, "빨간 점을 끌어 모양을 바꿔요."), read, h("div", { class: "actions" }, btn));
  show(); draw();
}

/* ---------- ⑦ 두 지도에 같은 거리 그리기 ----------
   opt: {real:2100, maps:[{name, per}], ask, ok}  지도에서 1 cm가 실제 per m예요. */
function ra4Map(body, api, opt) {
  const maps = opt.maps, cm = 62, x0 = 40, MX = 9; const v = maps.map(() => 0); let fin = false;
  const svg = makeSvg(x0 + MX * cm + 40, maps.length * 150 + 10); svg.setAttribute("class", "ra4fig");
  const read = h("div", { class: "ra4read" }, "​");
  const draw = () => {
    svg.innerHTML = "";
    maps.forEach((M, i) => {
      const y = 10 + i * 150;
      svg.append(svgEl("rect", { x: 10, y, width: x0 + MX * cm + 20, height: 140, rx: 12, fill: i ? "#EEF6EA" : "#FFF6E3", stroke: "#C9B79C", "stroke-width": 2 }));
      svg.append(txt(24, y + 22, `${M.name} (실제 거리 ${M.per} m를 1 cm로)`, 17, { "text-anchor": "start", fill: "#4A3A20" }));
      const ry = y + 104;
      svg.append(svgEl("rect", { x: x0, y: ry, width: MX * cm, height: 18, fill: "#fff", stroke: "#8A7B66", "stroke-width": 1.5 }));
      for (let t = 0; t <= MX; t++) { svg.append(svgEl("line", { x1: x0 + t * cm, y1: ry, x2: x0 + t * cm, y2: ry + 10, stroke: "#5A4A30", "stroke-width": 1.5 })); svg.append(txt(x0 + t * cm, ry + 28, String(t), 12, { fill: "#5A4A30" })); }
      svg.append(txt(x0 + MX * cm + 12, ry + 28, "cm", 12, { fill: "#5A4A30" }));
      svg.append(svgEl("circle", { cx: x0, cy: y + 66, r: 8, fill: "#2F6B57" }));
      svg.append(txt(x0, y + 46, "입구", 13, { fill: "#2F6B57" }));
      const ok = v[i] * M.per === opt.real;
      svg.append(svgEl("line", { x1: x0, y1: y + 66, x2: x0 + v[i] * cm, y2: y + 66, stroke: ok ? "#2E8B57" : "#C8472E", "stroke-width": 6, "stroke-linecap": "round" }));
      svg.append(svgEl("circle", { cx: x0 + v[i] * cm, cy: y + 66, r: 12, fill: ok ? "#2E8B57" : "#C8472E", stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }));
      svg.append(txt(x0 + v[i] * cm, y + 44, `${v[i]} cm → ${v[i] * M.per} m`, 15, { fill: ok ? "#2E8B57" : "#C8472E" }));
    });
    read.textContent = maps.map((M, i) => `${M.name}: 지도에서 ${v[i]} cm = 실제 ${v[i] * M.per} m`).join(" · ");
  };
  let cur = 0;
  const setFrom = p => { if (fin) return; v[cur] = Math.max(0, Math.min(MX, Math.round((p.x - x0) / cm))); draw(); };
  dragOn(svg, p => { cur = Math.max(0, Math.min(maps.length - 1, Math.floor((p.y - 10) / 150))); setFrom(p); return true; }, setFrom, () => {
    if (fin) return;
    if (maps.every((M, i) => v[i] * M.per === opt.real)) { fin = true; draw(); ra4Finish(body, api, opt, maps.map((M, i) => `${v[i]} cm`).join(", "), `같은 ${opt.real} m를 ${maps.map((M, i) => `${M.name}에는 ${v[i]} cm`).join(", ")}로 그렸어요.`); }
    else api.hint(`두 지도 모두 실제 거리 ${opt.real} m가 되게 선을 그어요.`);
  });
  api.provide({ words: ["실제 거리", "지도에서의 거리", "기준량", "비율"], answers: [] });
  body.append(svg, read); draw();
}

/* ---------- ⑧ 계산기 ---------- */
function ra4Calc() {
  let cur = "0", acc = null, op = null, fresh = true;
  const scr = h("div", { class: "ra4scr" }, "0");
  const fmt = x => { if (!isFinite(x)) return "나눌 수 없어요"; const r = Math.round(x * 1e8) / 1e8; return String(r); };
  const calc = (a, b, o) => o === "+" ? a + b : o === "−" ? a - b : o === "×" ? a * b : b === 0 ? NaN : a / b;
  const show = () => { scr.textContent = cur; };
  const key = k => {
    if (/^[0-9]$/.test(k)) { cur = fresh || cur === "0" ? k : (cur.length < 12 ? cur + k : cur); fresh = false; }
    else if (k === ".") { if (fresh) { cur = "0."; fresh = false; } else if (!cur.includes(".")) cur += "."; }
    else if (k === "C") { cur = "0"; acc = null; op = null; fresh = true; }
    else if (k === "=") { if (op != null && acc != null) { cur = fmt(calc(acc, +cur, op)); acc = null; op = null; fresh = true; } }
    else { if (op != null && acc != null && !fresh) cur = fmt(calc(acc, +cur, op)); acc = +cur; op = k; fresh = true; }
    show();
  };
  const g = h("div", { class: "ra4calc", "aria-label": "계산기" }, scr);
  ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+", "C"].forEach(k => g.append(h("button", { class: /[÷×−+=C]/.test(k) ? "ra4op" : "", onclick: () => key(k) }, k)));
  return h("div", {}, h("div", { class: "ra4note" }, "계산기 — 큰 수의 나눗셈은 계산기를 써도 좋아요."), g);
}

/* ---------- ⑨ 이중 테이프(양 ↔ 비율·백분율) ----------
   opt: {N, unit, steps, target(위 테이프의 값), whole:"전체 물고기 수", part:"구피 수", mode:"pct"|"ratio", ask, ok}
   위 테이프 0~N을 steps칸으로 나누고, 아래 테이프는 같은 길이로 0~1(비율) 또는 0~100 %(백분율)예요. */
function ra4Tape2(body, api, opt) {
  const N = opt.N, K = opt.steps, x0 = 40, L = 570, yT = 70, yB = 180; let k = 0, fin = false;
  const tk = Math.round(opt.target * K / N);
  const fmt = x => String(Math.round(x * 100) / 100);
  const svg = makeSvg(660, 260); svg.setAttribute("class", "ra4fig");
  const read = h("div", { class: "ra4read" }, "​");
  const U = opt.unit === "g" || opt.unit === "kWh" ? " " + opt.unit : opt.unit;
  const draw = () => {
    svg.innerHTML = "";
    const X = x0 + k / K * L, col = fin ? "#2E8B57" : "#E47A38";
    svg.append(txt(x0, yT - 42, `${opt.whole}(${opt.unit})`, 16, { "text-anchor": "start", fill: "#4A5A55" }));
    svg.append(svgEl("rect", { x: x0, y: yT - 20, width: L, height: 40, fill: "#fff", stroke: "#2B7BD6", "stroke-width": 2 }));
    svg.append(svgEl("rect", { x: x0, y: yT - 20, width: X - x0, height: 40, fill: col, "fill-opacity": .45 }));
    if (K <= 50) for (let i = 1; i < K; i++) svg.append(svgEl("line", { x1: x0 + i / K * L, y1: yT - 20, x2: x0 + i / K * L, y2: yT + 20, stroke: "#9DB7D6", "stroke-width": 1 }));
    svg.append(txt(x0, yT + 34, "0", 15), txt(x0 + L, yT + 34, fmt(N), 15));
    svg.append(txt(x0, yB - 42, opt.mode === "pct" ? "백분율(%)" : "비율", 16, { "text-anchor": "start", fill: "#4A5A55" }));
    svg.append(svgEl("rect", { x: x0, y: yB - 20, width: L, height: 40, fill: "#fff", stroke: "#2F6B57", "stroke-width": 2 }));
    svg.append(svgEl("rect", { x: x0, y: yB - 20, width: X - x0, height: 40, fill: col, "fill-opacity": .45 }));
    for (let i = 0; i <= 10; i++) { const x = x0 + i / 10 * L; svg.append(svgEl("line", { x1: x, y1: yB + 20, x2: x, y2: yB + 28, stroke: "#2F6B57", "stroke-width": 1.5 })); svg.append(txt(x, yB + 40, opt.mode === "pct" ? String(i * 10) : (i === 10 ? "1" : i === 0 ? "0" : "0." + i), 13, { fill: "#2F6B57" })); }
    svg.append(svgEl("line", { x1: X, y1: yT - 26, x2: X, y2: yB + 22, stroke: col, "stroke-width": 3, "stroke-dasharray": "6 4" }));
    svg.append(svgEl("circle", { cx: X, cy: (yT + yB) / 2, r: 13, fill: col, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }));
    svg.append(txt(Math.min(Math.max(X, x0 + 40), x0 + L - 40), yT - 32, `${fmt(N * k / K)}${U}`, 16, { fill: col }));
    const below = opt.mode === "pct" ? `${fmt(100 * k / K)} %` : fmt(k / K);
    svg.append(txt(Math.min(Math.max(X + 44, x0 + 60), x0 + L - 30), (yT + yB) / 2, below, 17, { fill: col }));
    read.textContent = `${opt.part} ${fmt(N * k / K)}${U} ↔ ${opt.mode === "pct" ? "백분율 " + fmt(100 * k / K) + " %" : "비율 " + fmt(k / K)}`;
  };
  const setFrom = p => { if (fin) return; k = Math.max(0, Math.min(K, Math.round((p.x - x0) / L * K))); draw(); };
  dragOn(svg, p => { setFrom(p); return true; }, setFrom, () => {
    if (fin) return;
    if (k === tk) { fin = true; draw(); ra4Finish(body, api, opt, read.textContent, opt.msg || `${opt.part} ${fmt(opt.target)}${U}만큼 색칠했어요. 아래 테이프에서 ${opt.mode === "pct" ? "백분율" : "비율"}을 읽어요.`); }
    else if (k) api.hint(`위 테이프를 ${opt.part} ${fmt(opt.target)}${U}만큼 색칠해요.`);
  });
  api.provide({ words: ["기준량", "비교하는 양", "비율", "백분율"], answers: [] });
  body.append(svg, h("p", { class: "ra4note" }, "주황 점을 끌어 위 테이프를 색칠해요. 두 테이프는 길이가 같아요."), read); draw();
}

/* ---------- ⑩ 모눈 칸 색칠하기 ----------
   opt: {grids:[{name, cols, rows, target}], ask, ok} — 눌러서 끌면 여러 칸을 칠하거나 지워요. */
function ra4Grid(body, api, opt) {
  const G = opt.grids, u = opt.cell || 34; let fin = false;
  const wrap = h("div", { style: "display:flex;flex-wrap:wrap;gap:.8em;align-items:flex-start" });
  const states = G.map(g => new Array(g.cols * g.rows).fill(false));
  const labs = [];
  G.forEach((g, gi) => {
    const svg = makeSvg(g.cols * u + 8, g.rows * u + 8); svg.setAttribute("class", "ra4fig");
    svg.style.width = (g.cols * u + 8) + "px"; svg.style.maxWidth = "100%";
    const cells = [];
    for (let i = 0; i < g.cols * g.rows; i++) { const r = svgEl("rect", { x: 4 + (i % g.cols) * u, y: 4 + Math.floor(i / g.cols) * u, width: u, height: u, fill: "#fff", stroke: "#8DA39A", "stroke-width": 1.5 }); cells.push(r); svg.append(r); }
    const lab = h("div", { class: "ra4read" }, "​"); labs.push(lab);
    const paint = () => { cells.forEach((c, i) => c.setAttribute("fill", states[gi][i] ? (g.col || "#F2A541") : "#fff")); lab.textContent = `${g.name}: 색칠한 칸 ${states[gi].filter(Boolean).length}칸 / 전체 ${g.cols * g.rows}칸`; };
    let mode = true;
    const idx = p => { const c = Math.floor((p.x - 4) / u), r = Math.floor((p.y - 4) / u); return c >= 0 && c < g.cols && r >= 0 && r < g.rows ? r * g.cols + c : -1; };
    dragOn(svg, p => { if (fin) return false; const i = idx(p); if (i < 0) return false; mode = !states[gi][i]; states[gi][i] = mode; paint(); return true; },
      p => { const i = idx(p); if (i >= 0 && states[gi][i] !== mode) { states[gi][i] = mode; paint(); } }, () => check());
    paint();
    wrap.append(h("div", { style: "flex:1 1 auto;min-width:0;max-width:100%" }, h("div", { class: "jua" }, g.title || g.name), svg, lab));
  });
  const check = () => {
    if (fin) return;
    const cnt = states.map(s => s.filter(Boolean).length);
    if (G.every((g, i) => cnt[i] === g.target)) { fin = true; ra4Finish(body, api, opt, cnt.join(", ") + "칸", opt.msg || "알맞게 색칠했어요."); }
    else { const i = G.findIndex((g, j) => cnt[j] !== g.target); api.hint(`${G[i].name}: ${G[i].target}칸을 색칠해요. 지금 ${cnt[i]}칸이에요.`); }
  };
  api.provide({ words: ["기준량", "100칸", "백분율"], answers: [] });
  body.append(h("p", { class: "ra4note" }, "칸을 누르거나 눌러서 끌면 색칠돼요. 칠한 칸을 누르면 지워져요."), wrap);
}
/* 정해 둔 칸이 칠해진 모눈 그림 */
function ra4GridFig(cols, rows, n, col) {
  const u = 26, s = makeSvg(cols * u + 8, rows * u + 8); s.setAttribute("class", "ra4fig"); s.style.maxWidth = Math.min(420, cols * u + 8) + "px";
  for (let i = 0; i < cols * rows; i++) s.append(svgEl("rect", { x: 4 + (i % cols) * u, y: 4 + Math.floor(i / cols) * u, width: u, height: u, fill: i < n ? (col || "#7FB8E6") : "#fff", stroke: "#8DA39A", "stroke-width": 1.2 }));
  return s;
}

/* ---------- ⑪ 비율이 같은 것끼리 잇기 ----------
   opt: {heads:["비","분수",…], cols:[[글 또는 {t, v}], …], ok}  각 줄에서 하나씩 차례로 눌러 이어요. */
function ra4Link(body, api, opt) {
  const C = opt.cols.map(col => col.map(it => typeof it === "string" ? { t: it, v: ra4V(it) } : { t: it.t, v: ra4V(it.v) }));
  const rows = C[0].length, nc = C.length, COL = ["#F2A541", "#7FB8E6", "#9BD39F", "#E7A0C8", "#C6B3F0"];
  const grid = h("div", { class: "ra4link", style: `grid-template-columns:repeat(${nc},minmax(0,1fr))` });
  const used = C.map(col => col.map(() => null)); let chain = [], made = 0;
  const btns = C.map((col, ci) => {
    const box = h("div", {}, h("div", { class: "ra4lh" }, opt.heads ? opt.heads[ci] : ""));
    const bs = col.map((it, ri) => { const b = h("button", { onclick: () => tap(ci, ri) }, it.t); box.append(b); return b; });
    grid.append(box); return bs;
  });
  const list = h("div", { class: "ra4read" }, "​");
  const tap = (ci, ri) => {
    if (used[ci][ri] != null) return;
    if (ci !== chain.length) return api.hint(chain.length ? `${opt.heads ? opt.heads[chain.length] : "이웃한 줄"}에서 이어서 골라요.` : `${opt.heads ? opt.heads[0] : "첫째 줄"}에서 먼저 골라요.`);
    chain.push(ri); btns[ci][ri].classList.add("ra4pk");
    if (chain.length < nc) return;
    api.tryOnce(); const items = chain.map((r, c) => C[c][r]);
    const bad = items.findIndex(it => !ra4EqQ(it.v, items[0].v));
    const got = items.map(it => it.t).join(" — ");
    if (bad >= 0) {
      chain.forEach((r, c) => btns[c][r].classList.remove("ra4pk")); chain = [];
      return api.fail(`${items[0].t}의 비율은 ${ra4Fr(items[0].v)}${ra4Dec(items[0].v) ? " = " + ra4Dec(items[0].v) : ""}이고, ${items[bad].t}의 비율은 ${ra4Fr(items[bad].v)}${ra4Dec(items[bad].v) ? " = " + ra4Dec(items[bad].v) : ""}이에요. 다시 이어 봐요.`, got);
    }
    const color = COL[made % COL.length];
    chain.forEach((r, c) => { used[c][r] = made; const b = btns[c][r]; b.classList.remove("ra4pk"); b.style.background = color; b.style.borderColor = color; b.disabled = true; });
    made++; chain = []; list.append(h("div", {}, `✔ ${got}`));
    if (made === rows) api.done(list.textContent, opt.ok || "비율이 같은 것끼리 모두 이었어요!");
  };
  api.provide({ words: ["비율", "분수", "소수", "백분율"], answers: [] });
  body.append(h("p", { class: "ra4note" }, `왼쪽 줄부터 차례로 하나씩 눌러 비율이 같은 것끼리 이어요.`), grid, list);
}

/* ---------- ⑫ 줄일 가전제품 고르기 ----------
   opt: {items:[{name, kwh}], plan:[번호…](정해진 계획) 또는 없음(마음대로), base, ask:(합)=>[…], ok} */
function ra4Save(body, api, opt) {
  const sel = new Set(); let fin = false;
  const grid = h("div", { class: "ra4apps" });
  const sum = () => [...sel].reduce((a, i) => a + opt.items[i].kwh, 0);
  const read = h("div", { class: "ra4read" }, "​");
  const btns = opt.items.map((it, i) => h("button", { class: "ra4app", onclick: e => { if (fin) return; sel.has(i) ? sel.delete(i) : sel.add(i); e.currentTarget.classList.toggle("ra4pk", sel.has(i)); show(); } }, it.name, h("b", {}, `${it.kwh} kWh 줄이기`)));
  btns.forEach(b => grid.append(b));
  const show = () => { read.textContent = `고른 가전제품 ${sel.size}개 · 줄이려는 전기 사용량은 모두 몇 kWh일까요?`; };
  const go = h("button", { class: "big", onclick: () => {
    if (fin) return; api.tryOnce();
    const got = [...sel].map(i => opt.items[i].name).join(", ") || "-";
    if (opt.plan) {
      const P = new Set(opt.plan);
      if (sel.size !== P.size || [...sel].some(i => !P.has(i))) return api.fail(`계획에 있는 가전제품은 ${opt.plan.map(i => opt.items[i].name).join(", ")}이에요.`, got);
    } else if (!sel.size) return api.fail("줄일 가전제품을 하나 이상 골라요.", got);
    fin = true; go.disabled = true; btns.forEach(b => { b.disabled = true; });
    const s = sum();
    ra4Finish(body, api, Object.assign({}, opt, { ask: opt.ask(s, [...sel]) }), `${got} (${s} kWh)`, "줄일 가전제품을 골랐어요.");
  } }, opt.btn || "이 가전제품을 줄일래요");
  api.provide({ words: ["kWh", "기준량", "비교하는 양", "백분율"], answers: [] });
  body.append(grid, read, h("div", { class: "actions" }, go)); show();
}
/* 전기 요금 청구서 그림 */
function ra4BillFig(ticks, avg, mine) {
  const s = makeSvg(600, 230); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "600px";
  const x0 = 140, x1 = 560, lo = ticks[0], hi = ticks[ticks.length - 1], X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
  s.append(svgEl("rect", { x: 6, y: 6, width: 588, height: 218, rx: 14, fill: "#FFFDF6", stroke: "#C9B79C", "stroke-width": 2 }));
  s.append(txt(300, 30, "전기 요금 청구서 · 지난달 전기 사용량은?", 18, { fill: "#4A3A20" }));
  [["동일 면적 평균", avg, "#9DB7D6", 80], ["우리 집", mine, "#E47A38", 132]].forEach(([n, v, c, y]) => {
    s.append(txt(x0 - 10, y, n, 16, { "text-anchor": "end" }));
    s.append(svgEl("rect", { x: x0, y: y - 15, width: X(v) - x0, height: 30, fill: c, rx: 4 }));
    s.append(txt(X(v) + 8, y, `${v} kWh`, 15, { "text-anchor": "start" }));
  });
  s.append(svgEl("line", { x1: x0, y1: 168, x2: x1, y2: 168, stroke: INK, "stroke-width": 2 }));
  ticks.forEach(t => { s.append(svgEl("line", { x1: X(t), y1: 164, x2: X(t), y2: 172, stroke: INK, "stroke-width": 2 })); s.append(txt(X(t), 188, String(t), 13)); });
  s.append(txt(300, 212, "(kWh)", 12, { fill: "#5B6B6B" }));
  return s;
}

/* ---------- ⑬ 비율 비교 문제 만들기 ----------
   보기의 조건(두 사람의 간 거리·걸린 시간)을 바꾸어 새 문제를 만들고 직접 풀어요. */
function ra4Make(body, api, opt) {
  const D = opt.base; // [[이름, 거리, 시간], [이름, 거리, 시간]]
  const ins = D.map(p => [ra4Inp(false, p[0] + " 거리"), ra4Inp(false, p[0] + " 시간")]);
  ins.forEach((p, i) => { p[0].value = D[i][1]; p[1].value = D[i][2]; });
  const form = h("div", {}, D.map((p, i) => h("div", { class: "ra4mk" }, `${p[0]}는 자전거를 타고`, ins[i][0], "m를 가는 데", ins[i][1], "초가 걸렸어요.")));
  const out = h("div");
  let fin = false;
  const make = h("button", { class: "big", onclick: () => {
    if (fin) return;
    const v = ins.map(p => p.map(x => x.value.trim()));
    if (v.some(p => p.some(s => !/^\d+$/.test(s) || +s === 0 || +s > 9999))) return api.fail("거리와 시간은 0이 아닌 자연수(9999까지)로 써요.", "-");
    if (v.every((p, i) => +p[0] === D[i][1] && +p[1] === D[i][2])) return api.fail("보기와 다른 수로 조건을 바꾸어 새 문제를 만들어요.", "보기와 같음");
    const r = v.map(p => ra4Q(+p[0], +p[1]));
    if (ra4EqQ(r[0], r[1])) return api.fail(`두 사람의 비율이 ${ra4Fr(r[0])}로 같아져서 누가 더 높은지 비교할 수 없어요. 수를 바꿔 봐요.`, v.join(" / "));
    fin = true; make.disabled = true; ins.flat().forEach(x => { x.disabled = true; });
    const hi = ra4Lt(r[0], r[1]) ? 1 : 0;
    out.append(h("div", { class: "ra4phrase" }, `내가 만든 문제: ${D[0][0]}는 자전거를 타고 ${v[0][0]} m를 가는 데 ${v[0][1]}초가 걸렸고, ${D[1][0]}는 자전거를 타고 ${v[1][0]} m를 가는 데 ${v[1][1]}초가 걸렸습니다. 걸린 시간에 대한 간 거리의 비율이 더 높은 사람은 누구인가요?`));
    ra4Chain(out, api, [
      [`${D[0][0]}의 비율: ${v[0][0]} ÷ ${v[0][1]} = `, { i: ra4Dec(r[0]) || `${r[0].n}/${r[0].d}`, w: true }],
      [`${D[1][0]}의 비율: ${v[1][0]} ÷ ${v[1][1]} = `, { i: ra4Dec(r[1]) || `${r[1].n}/${r[1].d}`, w: true }],
      ["비율이 더 높은 사람: ", { c: [D[0][0], D[1][0]], a: hi }]],
      { ok: `${D[hi][0]}의 비율이 더 높아요. 내가 만든 문제를 친구와 바꾸어 풀어 봐요.` });
    out.append(h("p", { class: "ra4note" }, "비율이 나누어떨어지지 않으면 분수(예: 7/3)로 써도 돼요."));
    ra4Go(out);
  } }, "이 조건으로 문제 만들기");
  api.provide({ words: ["걸린 시간에 대한 간 거리의 비율", "(간 거리) ÷ (걸린 시간)"], answers: [] });
  body.append(form, h("div", { class: "actions" }, make), out);
}

/* ---------- ⑭ 9차시 놀이 ----------
   이 앱이 정한 비와 비율 카드 24장(교과서 부록 카드는 지도서에 없어서 새로 정함): 비율이 같은 카드가 꼭 한 장씩 있어요(12쌍). */
const RA4_CARDS = ["1 : 4", "25 %", "3 : 5", "0.6", "7 : 20", "35 %", "6 : 30", "[1/5]", "9 : 20", "0.45", "6 : 5", "1.2",
  "[3/4]", "75 %", "[4/5]", "0.8", "[1/2]", "50 %", "[3/25]", "12 %", "[7/10]", "0.7", "0.4", "40 %"];
const RA4_CV = RA4_CARDS.map(ra4V);
RA4_CV.forEach((v, i) => { const n = RA4_CV.filter((w, j) => j !== i && ra4EqQ(v, w)).length; if (n !== 1) throw new Error("비율 카드 짝 오류: " + RA4_CARDS[i]); });
/* 지도서의 '또 다른 놀이' 비율 카드 24장 */
const RA4_HIGH = ["[1/10]", "[35/100]", "[22/25]", "[3/20]", "[1/5]", "[27/100]", "[1/4]", "[7/10]", "0.09", "0.36", "0.8", "0.45", "0.95", "0.56", "0.64", "0.76", "5 %", "35 %", "8 %", "40 %", "90 %", "16 %", "50 %", "58 %"];
const ra4Shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const ra4Why = (a, b) => `${a}의 비율은 ${ra4Say(ra4V(a))}, ${b}의 비율은 ${ra4Say(ra4V(b))}예요.`;

/* 두 카드의 비율 판단 연습 — opt: {pairs:[[a,b],…]} */
function ra4Same(body, api, opt) {
  let k = 0; const P = opt.pairs;
  const row = h("div", { class: "ra4cards", style: "grid-template-columns:repeat(2,minmax(0,1fr));max-width:24em" });
  const cnt = h("div", { class: "ra4read" }, "​"), log = h("div", { class: "ra4note" });
  const show = () => { row.innerHTML = ""; P[k].forEach(t => row.append(h("div", { class: "ra4card ra4up" }, t))); cnt.textContent = `${k + 1} / ${P.length}번째 카드 두 장`; };
  const judge = same => {
    api.tryOnce(); const [a, b] = P[k], real = ra4EqQ(ra4V(a), ra4V(b));
    if (same !== real) return api.fail(`${ra4Why(a, b)} ${real ? "비율이 같아요." : "비율이 달라요."}`, `${a} / ${b}: ${same ? "같아요" : "달라요"}`);
    log.append(h("div", {}, `✔ ${a}, ${b} → ${real ? "같아요" : "달라요"} (${ra4Fr(ra4V(a))}${real ? "" : ", " + ra4Fr(ra4V(b))})`));
    if (k === P.length - 1) { bs.forEach(b => { b.disabled = true; }); return api.done(log.textContent, opt.ok || "비율이 같은지 모두 알맞게 판단했어요!"); }
    api.hint(`○ 맞아요. ${ra4Why(a, b)}`); k++; show();
  };
  const bs = [h("button", { onclick: () => judge(true) }, "비율이 같아요"), h("button", { onclick: () => judge(false) }, "비율이 달라요")];
  api.provide({ words: ["분수", "소수", "백분율", "같은 표현으로"], answers: [] });
  body.append(row, cnt, h("div", { class: "ra4tools" }, ...bs), log); show();
}

/* 짝 찾기 놀이(나 ↔ 컴퓨터) — 카드 두 장을 뒤집고 비율이 같은지 내가 판단해요 */
function ra4Memory(body, api, opt) {
  const deck = ra4Shuffle(RA4_CARDS.map((t, i) => i));
  const owner = deck.map(() => null), seen = new Set(), comMem = new Map();
  let turn = "me", up = [], me = 0, com = 0, busy = false, over = false;
  const grid = h("div", { class: "ra4cards", style: "grid-template-columns:repeat(auto-fill,minmax(min(100%,5.6em),1fr))" });
  const msg = h("div", { class: "ra4read" }, "​"), score = h("div", { class: "ra4score" });
  const bs = [h("button", { onclick: () => judge(true) }, "비율이 같아요"), h("button", { onclick: () => judge(false) }, "비율이 달라요")];
  const tools = h("div", { class: "ra4tools" }, ...bs);
  const cards = deck.map((ci, pos) => { const b = h("button", { class: "ra4card ra4back", "aria-label": "뒤집힌 카드", onclick: () => tapCard(pos) }, "?"); grid.append(b); return b; });
  const paint = () => {
    cards.forEach((b, pos) => {
      const o = owner[pos], open = up.includes(pos);
      b.className = "ra4card" + (o === "me" ? " ra4me" : o === "com" ? " ra4com" : open ? " ra4up" : " ra4back");
      b.textContent = o || open ? RA4_CARDS[deck[pos]] : "?";
      b.disabled = !!o;
    });
    score.innerHTML = ""; score.append(h("span", {}, `나 ${me}장`), h("span", {}, `컴퓨터 ${com}장`), h("span", {}, `남은 카드 ${owner.filter(o => !o).length}장`), h("span", {}, turn === "me" ? "▶ 내 차례" : "▶ 컴퓨터 차례"));
    tools.style.visibility = turn === "me" && up.length === 2 && !busy ? "visible" : "hidden";
  };
  const remember = pos => { seen.add(pos); if (Math.random() < (opt.mem || .5)) comMem.set(pos, deck[pos]); };
  const left = () => owner.map((o, p) => o ? -1 : p).filter(p => p >= 0);
  const finish = () => {
    if (over) return; over = true; turn = "-"; paint();
    const res = me > com ? "내가 이겼어요!" : me < com ? "컴퓨터가 이겼어요. 한 판 더 하면 더 잘할 수 있어요." : "비겼어요!";
    msg.textContent = `놀이 끝! 나 ${me}장, 컴퓨터 ${com}장 — ${res}`;
    api.done(`나 ${me}장, 컴퓨터 ${com}장`, `놀이 끝! 나 ${me}장, 컴퓨터 ${com}장 — ${res}`);
  };
  const tapCard = pos => {
    if (over || busy || turn !== "me" || owner[pos] || up.includes(pos) || up.length >= 2) return;
    up.push(pos); remember(pos); paint();
    msg.textContent = up.length === 2 ? "두 카드의 비율이 같나요? 아래 단추로 판단해요." : "카드를 한 장 더 뒤집어요.";
  };
  const judge = same => {
    if (busy || up.length !== 2 || turn !== "me") return;
    api.tryOnce(); const [p, q] = up, a = RA4_CARDS[deck[p]], b = RA4_CARDS[deck[q]], real = ra4EqQ(RA4_CV[deck[p]], RA4_CV[deck[q]]);
    if (same && real) { owner[p] = owner[q] = "me"; me += 2; up = []; comMem.delete(p); comMem.delete(q); msg.textContent = `맞아요! ${a}, ${b}의 비율은 ${ra4Fr(RA4_CV[deck[p]])}로 같아요. 카드를 가져오고 한 번 더 뒤집어요.`; paint(); if (!left().length) finish(); return; }
    if (same && !real) api.fail(`${ra4Why(a, b)} 비율이 달라서 카드를 가져올 수 없어요.`, `${a} / ${b}`);
    else if (!same && real) api.fail(`사실은 비율이 같아요. ${ra4Why(a, b)} 가져올 기회를 놓쳤어요.`, `${a} / ${b}`);
    else msg.textContent = `맞아요. ${ra4Why(a, b)} 비율이 달라서 카드를 다시 뒤집어 놓아요.`;
    busy = true; paint();
    setTimeout(() => { if (!ra4Alive(grid)) return; up = []; busy = false; turn = "com"; paint(); comTurn(); }, 1600);
  };
  const comTurn = () => {
    if (over || !ra4Alive(grid)) return;
    const L = left(); if (!L.length) return finish();
    let pick = null;
    const known = [...comMem.keys()].filter(p => !owner[p]);
    for (let i = 0; i < known.length && !pick; i++) for (let j = i + 1; j < known.length; j++) if (ra4EqQ(RA4_CV[deck[known[i]]], RA4_CV[deck[known[j]]])) { pick = [known[i], known[j]]; break; }
    const flip = (pos, then) => setTimeout(() => { if (!ra4Alive(grid)) return; up.push(pos); remember(pos); paint(); then(); }, 900);
    const second = () => {
      const p = up[0], mate = known.find(k => k !== p && ra4EqQ(RA4_CV[deck[k]], RA4_CV[deck[p]]));
      const pool = L.filter(k => k !== p);
      const q = mate != null ? mate : pool.filter(k => !comMem.has(k))[0] != null ? ra4Shuffle(pool.filter(k => !comMem.has(k)))[0] : ra4Shuffle(pool)[0];
      flip(q, settle);
    };
    const settle = () => setTimeout(() => {
      if (!ra4Alive(grid)) return;
      const [p, q] = up, real = ra4EqQ(RA4_CV[deck[p]], RA4_CV[deck[q]]);
      if (real) { owner[p] = owner[q] = "com"; com += 2; comMem.delete(p); comMem.delete(q); up = []; msg.textContent = `컴퓨터가 ${RA4_CARDS[deck[p]]}, ${RA4_CARDS[deck[q]]}를 찾아 가져갔어요(비율 ${ra4Fr(RA4_CV[deck[p]])}). 컴퓨터가 한 번 더 해요.`; paint(); if (!left().length) return finish(); return comTurn(); }
      msg.textContent = `컴퓨터가 뒤집은 ${RA4_CARDS[deck[p]]}, ${RA4_CARDS[deck[q]]}는 비율이 달라요. 자리를 기억해 두었다가 내 차례에 찾아요.`;
      setTimeout(() => { if (!ra4Alive(grid)) return; up = []; turn = "me"; paint(); }, 1500);
    }, 900);
    msg.textContent = "컴퓨터가 카드를 뒤집어요…";
    if (pick) flip(pick[0], () => flip(pick[1], settle));
    else { const un = L.filter(k => !comMem.has(k)); flip(un.length ? ra4Shuffle(un)[0] : ra4Shuffle(L)[0], second); }
  };
  api.provide({ words: ["비율이 같으면 가져와요", "비율이 다르면 다시 뒤집어요"], answers: [] });
  body.append(score, grid, msg, tools); paint();
  msg.textContent = "내 차례예요. 카드 두 장을 눌러 뒤집어요.";
}

/* 또 다른 놀이: 네 사람이 동시에 한 장씩 뒤집고 비율이 가장 높은(낮은) 사람이 가져가요 */
function ra4High(body, api, opt) {
  const names = ["나", "친구 1", "친구 2", "친구 3"], R = 6;
  const rule = r => (r < 3 ? "high" : "low");
  let deck;
  for (let t = 0; t < 400; t++) {
    deck = ra4Shuffle(RA4_HIGH);
    let ok = true;
    for (let r = 0; r < R && ok; r++) {
      const v = deck.slice(r * 4, r * 4 + 4).map(ra4V), best = v.reduce((m, x) => rule(r) === "high" ? (ra4Lt(m, x) ? x : m) : (ra4Lt(x, m) ? x : m));
      if (v.filter(x => ra4EqQ(x, best)).length > 1) ok = false;
    }
    if (ok) break;
  }
  let r = 0, flipped = false; const got = names.map(() => 0);
  const area = h("div", { class: "ra4players" }), msg = h("div", { class: "ra4read" }, "​"), score = h("div", { class: "ra4score" });
  const ruleEl = h("div", { class: "ra4phrase" }, "​");
  const flipBtn = h("button", { onclick: () => { flipped = true; draw(); msg.textContent = `카드를 모두 뒤집었어요. 비율이 가장 ${rule(r) === "high" ? "높은" : "낮은"} 사람을 눌러요.`; } }, "모두 동시에 뒤집기");
  const draw = () => {
    area.innerHTML = "";
    ruleEl.textContent = `${r + 1}판 / ${R}판 · 규칙: 비율이 가장 ${rule(r) === "high" ? "높은" : "낮은"} 사람이 카드를 모두 가져가요.`;
    names.forEach((nm, i) => area.append(h("div", { class: "ra4pl", onclick: () => pick(i) }, nm, h("div", { class: "ra4card " + (flipped ? "ra4up" : "ra4back") }, flipped ? deck[r * 4 + i] : "?"))));
    score.innerHTML = ""; names.forEach((nm, i) => score.append(h("span", {}, `${nm} ${got[i]}장`)));
    flipBtn.disabled = flipped || r >= R;
  };
  const pick = i => {
    if (!flipped || r >= R) return;
    api.tryOnce(); const cs = deck.slice(r * 4, r * 4 + 4), v = cs.map(ra4V);
    let b = 0; v.forEach((x, j) => { if (rule(r) === "high" ? ra4Lt(v[b], x) : ra4Lt(x, v[b])) b = j; });
    if (i !== b) return api.fail(`${cs.map(c => `${c} → ${ra4Dec(ra4V(c)) || ra4Fr(ra4V(c))}`).join(", ")}. 같은 표현(소수)으로 바꾸어 비교해 봐요.`, `${names[i]}`);
    got[b] += 4; msg.textContent = `맞아요! ${names[b]}의 ${cs[b]}(= ${ra4Dec(v[b])})가 가장 ${rule(r) === "high" ? "높아요" : "낮아요"}. ${names[b]}가 카드 4장을 가져가요.`;
    r++; flipped = false;
    if (r >= R) { draw(); const mx = Math.max(...got), win = names.filter((_, j) => got[j] === mx); return api.done(names.map((n, j) => `${n} ${got[j]}장`).join(", "), `놀이 끝! ${win.join(", ")}${win.length > 1 ? "가 함께" : "가"} 가장 많이 가져갔어요.`); }
    draw();
  };
  api.provide({ words: ["소수로 바꾸어", "가장 높은", "가장 낮은"], answers: [] });
  body.append(ruleEl, area, h("div", { class: "ra4tools" }, flipBtn), msg, score); draw();
}

/* ---------- 정해진 그림 ---------- */
function ra4Parthenon() {
  const s = makeSvg(560, 300); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "560px";
  const u = 40, x = 100, y = 40, W = 9 * u, H = 4 * u;
  s.append(svgEl("rect", { x: 0, y: 0, width: 560, height: 300, fill: "#EAF4FB" }));
  s.append(svgEl("polygon", { points: `${x},${y + 30} ${x + W / 2},${y} ${x + W},${y + 30}`, fill: "#E9E2D0", stroke: "#8A7B5E", "stroke-width": 2 }));
  s.append(svgEl("rect", { x, y: y + 30, width: W, height: 16, fill: "#E9E2D0", stroke: "#8A7B5E", "stroke-width": 2 }));
  for (let i = 0; i < 8; i++) s.append(svgEl("rect", { x: x + 10 + i * (W - 30) / 7, y: y + 46, width: 12, height: H - 62, fill: "#F3EEE2", stroke: "#8A7B5E", "stroke-width": 1.5 }));
  s.append(svgEl("rect", { x: x - 6, y: y + H - 16, width: W + 12, height: 16, fill: "#E9E2D0", stroke: "#8A7B5E", "stroke-width": 2 }));
  s.append(svgEl("line", { x1: x, y1: y + H + 22, x2: x + W, y2: y + H + 22, stroke: "#C8472E", "stroke-width": 3 }), txt(x + W / 2, y + H + 42, "가로", 18, { fill: "#C8472E" }));
  s.append(svgEl("line", { x1: x + W + 26, y1: y, x2: x + W + 26, y2: y + H, stroke: "#2B7BD6", "stroke-width": 3 }), txt(x + W + 52, y + H / 2, "높이", 18, { fill: "#2B7BD6" }));
  s.append(ra4SvgLine("파르테논 신전(앞에서 본 모습) · 가로는 높이의 [9/4]배", 280, 278, 16, { fill: "#4A5A55" }));
  return s;
}
/* 휴양림 둘러보기: 장면의 곳곳을 눌러 비교할 수 있는 두 양을 찾아요 */
function ra4Scene(body, api, opt) {
  const SP = [
    { x: 215, y: 118, k: "car", t: "모노레일", d: "집라인 체험장으로 가는 모노레일 한 대에는 어른 6명, 어린이 3명이 탈 수 있어요. → 어른 수와 어린이 수를 비교해요." },
    { x: 470, y: 205, k: "bottle", t: "유자차", d: "유자청 1컵과 물 4컵을 섞어 유자차 한 병을 만들어요. → 유자청의 양과 물의 양을 비교해요." },
    { x: 300, y: 290, k: "trap", t: "계곡 낚시", d: "낚시 도구 한 세트에는 통발 2개와 미끼통 5개가 들어 있어요. → 통발 수와 미끼통 수를 비교해요." },
    { x: 610, y: 205, k: "map", t: "산책로 안내 지도", d: "실제 거리 300 m를 1 cm로 나타낸 지도예요. → 실제 거리와 지도에서의 거리를 비교해요." },
    { x: 80, y: 160, k: "hoop", t: "농구 골대", d: "주리는 공을 20번 던져서 7번, 민석이는 공을 25번 던져서 8번 넣었어요. → 던진 횟수와 넣은 횟수를 비교해요." },
    { x: 560, y: 70, k: "board", t: "설문 조사", d: "휴양림 홍보 자료에 휴양림을 찾는 이유를 조사한 결과가 있어요. → 전체 사람 수와 각 항목을 고른 사람 수를 비교해요." }];
  const seen = new Set(); let fin = false;
  const svg = makeSvg(680, 340); svg.setAttribute("class", "ra4fig");
  const info = h("div", { class: "ra4phrase" }, "장면의 동그라미를 눌러 보세요.");
  const read = h("div", { class: "ra4read" }, "​");
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: 680, height: 340, fill: "#E6F3E1" }));
    svg.append(svgEl("path", { d: "M0,130 L120,50 L230,120 L360,24 L500,110 L680,56 V0 H0Z", fill: "#BFDDB5" }));
    svg.append(svgEl("path", { d: "M0,310 C160,260 260,330 420,290 S610,262 680,290 V340 H0Z", fill: "#9FD0F2" }));
    svg.append(svgEl("line", { x1: 60, y1: 240, x2: 370, y2: 34, stroke: "#6F6656", "stroke-width": 4 }));
    for (let i = 0; i < 11; i++) { const tx = 140 + i * 50, ty = 222 + (i % 3) * 10; if (Math.abs(tx - 470) < 30 || Math.abs(tx - 610) < 30) continue; svg.append(svgEl("polygon", { points: `${tx},${ty} ${tx - 14},${ty + 34} ${tx + 14},${ty + 34}`, fill: "#4E8A2F" })); }
    SP.forEach((p, i) => {
      const g = svgEl("g", { style: "cursor:pointer" });
      g.append(svgEl("circle", { cx: p.x, cy: p.y, r: 34, fill: seen.has(i) ? "#DDEDE5" : "#FFFDF6", stroke: seen.has(i) ? "#2E8B57" : "#E47A38", "stroke-width": 3 }));
      if (p.k === "hoop") { g.append(svgEl("rect", { x: p.x - 18, y: p.y - 24, width: 36, height: 24, fill: "#fff", stroke: "#5A4A30", "stroke-width": 2 }), svgEl("ellipse", { cx: p.x, cy: p.y + 4, rx: 14, ry: 5, fill: "none", stroke: "#E2574C", "stroke-width": 3 }), svgEl("circle", { cx: p.x + 10, cy: p.y + 18, r: 8, fill: "#F08A24" })); }
      else if (p.k === "map") { g.append(svgEl("rect", { x: p.x - 20, y: p.y - 16, width: 40, height: 30, fill: "#FFF6E3", stroke: "#8A6A3A", "stroke-width": 2 }), svgEl("path", { d: `M${p.x - 14},${p.y + 8} L${p.x - 2},${p.y - 4} L${p.x + 6},${p.y + 4} L${p.x + 14},${p.y - 10}`, stroke: "#C8472E", "stroke-width": 2, fill: "none" })); }
      else if (p.k === "board") { g.append(svgEl("rect", { x: p.x - 22, y: p.y - 18, width: 44, height: 30, fill: "#fff", stroke: "#3B6FA8", "stroke-width": 2 })); [8, 16, 22].forEach((hh, j) => g.append(svgEl("rect", { x: p.x - 16 + j * 12, y: p.y + 8 - hh, width: 8, height: hh, fill: "#7FB8E6" }))); }
      else g.append(ra4Icon(p.k, p.x, p.y, 50));
      g.append(txt(p.x, p.y + 46, p.t, 14, { fill: "#2F3B33" }));
      if (seen.has(i)) g.append(txt(p.x + 26, p.y - 26, "✓", 18, { fill: "#2E8B57" }));
      g.addEventListener("click", () => { seen.add(i); info.textContent = `${p.t}: ${p.d}`; draw(); after(); });
      svg.append(g);
    });
    read.textContent = `찾은 곳 ${seen.size} / ${SP.length}`;
  };
  const after = () => { if (!fin && seen.size === SP.length) { fin = true; api.done(`${SP.length}곳`, opt.ok || "휴양림에서 두 양을 비교하는 상황을 모두 찾았어요."); } };
  api.provide({ words: ["두 양을 비교해요"], answers: [] });
  body.append(svg, info, read); draw();
}
function ra4AppleCarrot() {
  const s = makeSvg(520, 120); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "520px";
  for (let i = 0; i < 3; i++) s.append(ra4Icon("apple", 50 + i * 60, 60, 60));
  for (let i = 0; i < 4; i++) s.append(ra4Icon("carrot", 270 + i * 60, 60, 66));
  return s;
}
function ra4BugFig() {
  const s = makeSvg(560, 130); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "560px";
  for (let i = 0; i < 8; i++) s.append(ra4Icon("butterfly", 40 + (i % 4) * 62, 36 + Math.floor(i / 4) * 56, 56));
  for (let i = 0; i < 2; i++) s.append(ra4Icon("bee", 360 + i * 80, 64, 64));
  s.append(svgEl("line", { x1: 300, y1: 10, x2: 300, y2: 120, stroke: "#C9D4CF", "stroke-width": 2, "stroke-dasharray": "5 5" }));
  return s;
}
function ra4Juice() {
  const s = makeSvg(560, 230); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "560px";
  const jar = (x, cap, juice, nm) => {
    const W = 120, Hh = 170, y = 30, H = Hh * cap / 8;
    s.append(svgEl("rect", { x, y: y + Hh - H, width: W, height: H, fill: "#E8D9F2", stroke: "#6B3E8A", "stroke-width": 2 }));
    s.append(svgEl("rect", { x, y: y + Hh - Hh * juice / 8, width: W, height: Hh * juice / 8, fill: "#7D3C98", "fill-opacity": .75 }));
    for (let i = 1; i < cap; i++) s.append(svgEl("line", { x1: x, y1: y + Hh - Hh * i / 8, x2: x + 14, y2: y + Hh - Hh * i / 8, stroke: "#6B3E8A", "stroke-width": 1.5 }));
    s.append(txt(x + W / 2, 18, nm, 16), txt(x + W + 10, y + Hh - Hh * juice / 16, `포도즙 ${juice} L`, 14, { "text-anchor": "start", fill: "#5A2A70" }), txt(x + W + 10, y + Hh - H + 10, `포도 음료 ${cap} L`, 14, { "text-anchor": "start", fill: "#4A5A55" }));
  };
  jar(40, 2, 1, "채린"); jar(310, 8, 2, "도훈");
  return s;
}
function ra4MemoFig() {
  const s = makeSvg(620, 230); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "620px";
  const u = 26, base = 190;
  [["가", 5, 3, 30], ["나", 5, 6, 220], ["다", 10, 6, 360]].forEach(([n, w, hh, x]) => {
    s.append(svgEl("rect", { x, y: base - hh * u, width: w * u, height: hh * u, fill: "#FFF3B0", stroke: "#B48A12", "stroke-width": 2.5 }));
    s.append(txt(x + w * u / 2, base - hh * u / 2, n, 22));
    s.append(txt(x + w * u / 2, base + 18, `${w} cm`, 15), txt(x - 6, base - hh * u / 2, `${hh} cm`, 13, { "text-anchor": "end" }));
  });
  return s;
}
//@@LESSONS
const UNIT_STORY = { title: "휴양림에 간 민석이와 주리", lines: [
  "민석이네 가족은 주리네 가족과 함께 휴양림에 방문했어요. 휴양림에서 모노레일을 타고 집라인도 타고, 계곡에서 물고기도 잡고, 농구도 하며 즐거운 시간을 보냈어요.",
  "모노레일의 어른 수와 어린이 수, 유자차의 유자청과 물, 낚시 도구, 산책로 안내 지도, 농구공 던져 넣기, 휴양림 설문 조사에서 두 양을 비교하며 비와 비율, 백분율을 알아봐요.",
  "교과서 「수학 6-1」 4. 비와 비율의 차시 순서 그대로 만들었어요."],
  one: "비와 비율 · 한 양을 기준으로 다른 양이 몇 배인지 기호 : 으로 나타낸 것이 비예요. 기준량에 대한 비교하는 양의 크기가 비율이고, 기준량을 100으로 할 때의 비율이 백분율(%)이에요." };
const UNIT_KEYWORDS = ["몇 배", "곱셈(나눗셈) 비교", "비", "기호 :", "대", "~에 대한", "기준량", "비교하는 양", "비율", "(비교하는 양) ÷ (기준량)", "분수", "소수", "백분율", "%", "퍼센트"];

const LESSONS = [
];
