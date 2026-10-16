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
function ra4Say(q) { const d = ra4Dec(q); return `${ra4Fr(q)}${d && q.d !== 1 ? " = " + d : ""}${q.n <= q.d ? ` = ${ra4Pc(q)} %` : ""}`; }

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
  wrap.ra4ctl = ctl; wrap.ra4btn = btn;
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
    api.hint(`○ ${got} — 맞아요! 기호 : 의 오른쪽이 기준량이에요. 이어서 아래 문장도 비로 나타내 봐요.`);
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
    svg.append(txt(x0 + B.n * cell, yB - 38, "기준량 전체 = 1", 15, { "text-anchor": "end", fill: "#2B7BD6" }));
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
    read.textContent = `${opt.part} ${fmt(N * k / K)}${U}일 때 ${opt.mode === "pct" ? "백분율 " + fmt(100 * k / K) + " %" : "비율 " + fmt(k / K)}`;
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
      return api.fail(`${items[0].t}의 비율은 ${ra4Say(items[0].v)}, ${items[bad].t}의 비율은 ${ra4J(ra4Say(items[bad].v), "이에요")}. 다시 이어 봐요.`, got);
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
      if (sel.size !== P.size || [...sel].some(i => !P.has(i))) return api.fail(`계획에 있는 가전제품은 ${ra4J(opt.plan.map(i => opt.items[i].name).join(", "), "이에요")}.`, got);
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
    if (ra4EqQ(r[0], r[1])) return api.fail(`두 사람의 비율이 ${ra4J(ra4Fr(r[0]), "으로")} 같아져서 누가 더 높은지 비교할 수 없어요. 수를 바꿔 봐요.`, v.join(" / "));
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
  const show = () => { row.innerHTML = ""; P[k].forEach(t => row.append(h("div", { class: "ra4card ra4up", "data-t": t }, t))); cnt.textContent = `${k + 1} / ${P.length}번째 카드 두 장`; };
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
      b.textContent = o || open ? RA4_CARDS[deck[pos]] : "?"; b.dataset.t = o || open ? RA4_CARDS[deck[pos]] : "";
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
    if (same && real) { owner[p] = owner[q] = "me"; me += 2; up = []; comMem.delete(p); comMem.delete(q); msg.textContent = `맞아요! ${a}, ${b}의 비율은 ${ra4J(ra4Fr(RA4_CV[deck[p]]), "으로")} 같아요. 카드를 가져오고 한 번 더 뒤집어요.`; paint(); if (!left().length) finish(); return; }
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
      if (real) { owner[p] = owner[q] = "com"; com += 2; comMem.delete(p); comMem.delete(q); up = []; msg.textContent = `컴퓨터가 ${RA4_CARDS[deck[p]]}, ${ra4J(RA4_CARDS[deck[q]], "을를")} 찾아 가져갔어요(비율 ${ra4Fr(RA4_CV[deck[p]])}). 컴퓨터가 한 번 더 해요.`; paint(); if (!left().length) return finish(); return comTurn(); }
      msg.textContent = `컴퓨터가 뒤집은 ${RA4_CARDS[deck[p]]}, ${ra4J(RA4_CARDS[deck[q]], "은는")} 비율이 달라요. 자리를 기억해 두었다가 내 차례에 찾아요.`;
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
    names.forEach((nm, i) => area.append(h("div", { class: "ra4pl", onclick: () => pick(i) }, nm, h("div", { class: "ra4card " + (flipped ? "ra4up" : "ra4back"), "data-t": flipped ? deck[r * 4 + i] : "" }, flipped ? deck[r * 4 + i] : "?"))));
    score.innerHTML = ""; names.forEach((nm, i) => score.append(h("span", {}, `${nm} ${got[i]}장`)));
    flipBtn.disabled = flipped || r >= R;
  };
  const pick = i => {
    if (!flipped || r >= R) return;
    api.tryOnce(); const cs = deck.slice(r * 4, r * 4 + 4), v = cs.map(ra4V);
    let b = 0; v.forEach((x, j) => { if (rule(r) === "high" ? ra4Lt(v[b], x) : ra4Lt(x, v[b])) b = j; });
    if (i !== b) return api.fail(`${cs.map(c => `${c} → ${ra4Dec(ra4V(c)) || ra4Fr(ra4V(c))}`).join(", ")}. 같은 표현(소수)으로 바꾸어 비교해 봐요.`, `${names[i]}`);
    got[b] += 4; msg.textContent = `맞아요! ${names[b]}의 카드 ${cs[b]}(= ${ra4Dec(v[b])})의 비율이 가장 ${rule(r) === "high" ? "높아요" : "낮아요"}. ${ra4J(names[b], "이가")} 카드 4장을 가져가요.`;
    r++; flipped = false;
    if (r >= R) { draw(); const mx = Math.max(...got), win = names.filter((_, j) => got[j] === mx); return api.done(names.map((n, j) => `${n} ${got[j]}장`).join(", "), `놀이 끝! ${ra4J(win.join(", "), "이가")}${win.length > 1 ? " 함께" : ""} 가장 많이 가져갔어요.`); }
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
      if (seen.has(i)) g.append(svgEl("path", { d: `M${p.x + 18},${p.y - 28} l6,7 l12,-14`, stroke: "#2E8B57", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }));
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
{
  id: "t1", no: 1, title: "단원 도입 ― 휴양림에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 두 양을 비교하는 상황에는 무엇이 있을까요?",
  summary: "두 양을 비교할 때 한 양이 다른 양의 몇 배인지 알아볼 수 있어요. 파르테논 신전을 앞에서 봤을 때 가로는 높이의 [9/4]배예요. 이 단원에서는 두 수 비교하기, 비, 비율, 백분율과 비율·백분율이 생활에서 사용되는 경우를 배워요.",
  steps: [
    { name: "살펴보기", inst: "그리스 아테네의 파르테논 신전 그림이에요. “파르테논 신전을 앞에서 봤을 때 가로는 높이의 [9/4]배래.” 그림을 보고 물음에 답한 다음, 모눈에서 가로가 높이의 [9/4]배인 직사각형을 만들어 보세요.", hints: ["[9/4]는 1보다 커요. 가로가 높이보다 길어요.", "[9/4]배는 높이를 4로 나눈 것의 9배예요. 높이가 4칸이면 가로는 9칸이에요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [
          { q: "그림은 어떤 상황을 나타내고 있나요?", fig: ra4Parthenon, o: ["파르테논 신전의 가로와 높이를 비교하는 상황", "파르테논 신전의 기둥 수를 세는 상황", "파르테논 신전까지의 거리를 재는 상황"], a: 0 },
          { q: "가로는 높이의 [9/4]배예요. 가로와 높이 중 더 긴 것은 무엇일까요?", o: ["가로", "높이"], a: 0, why: { "1": "[9/4]는 1보다 커요. 가로가 높이의 1배보다 크니 가로가 더 길어요." } }],
          { ok: "가로가 높이의 [9/4]배이니 가로가 더 길어요." }),
        (bx, ax) => ra4Rect(bx, ax, { W: 12, H: 6, w0: 4, h0: 4, lockH: true, nw: "가로", nh: "높이", base: "h", unit: "칸", fill: "#E9E2D0",
          tasks: [{ goal: "높이는 4칸이에요. 가로가 높이의 [9/4]배가 되게 빨간 점을 끌어 보세요.", test: (w, hh) => w * 4 === 9 * hh, why: (w, hh) => `지금 가로는 높이의 [${w}/${hh}]배예요. 높이 4칸을 4로 나눈 1칸의 9배가 가로예요.` }],
          ok: "가로 9칸, 높이 4칸 — 가로는 높이의 [9/4]배예요." })]) },
    { name: "배울 내용 살펴보기", inst: "이 단원에서 어떤 내용을 공부할지 책장을 넘겨 알아봐요. 배울 차례대로 스티커를 붙이듯 눌러 보세요.", hints: ["두 수를 비교하는 것부터 시작해서 비, 비율을 배워요.", "비율이 사용되는 경우를 배운 다음 백분율과 백분율이 사용되는 경우를 배워요."],
      render: (b, a) => sequence(b, a, ["㉠ 백분율을 알아볼까요", "㉡ 두 수를 비교해 볼까요", "㉢ 비율이 사용되는 경우를 알아볼까요", "㉣ 비를 알아볼까요", "㉤ 백분율이 사용되는 경우를 알아볼까요", "㉥ 비율을 알아볼까요"], [1, 3, 5, 2, 0, 4],
        { ok: "두 수 비교하기 → 비 → 비율 → 비율이 사용되는 경우 → 백분율 → 백분율이 사용되는 경우 차례로 배워요." }) },
    { name: "배운 내용 떠올리기", inst: "3학년, 5학년에 배운 분수와 소수, 대응 관계를 떠올려요. 빈칸을 채워 보세요.", hints: ["[3/5]는 분모를 10으로 만들면 [6/10]이에요.", "0.25 = [25/100]이에요. 약분해도 돼요. [2/5] = 0.4예요."],
      render: (b, a) => ra4Chain(b, a, [
        ["[3/5]를 소수로 나타내면 ", { i: "0.6", why: { "0.35": "분자와 분모를 이어 쓰지 않아요. [3/5] = [6/10] = 0.6이에요." } }],
        ["0.25를 분수로 나타내면 ", { f: "1/4" }],
        ["[2/5] ", { c: [">", "=", "<"], a: 2, why: { "0": "[2/5]를 소수로 나타내면 0.4예요. 0.4와 0.45를 비교해요." } }, " 0.45"],
        ["탁자 한 개에 의자가 4개씩 있어요. 탁자 수를 □, 의자 수를 △라고 할 때 △ = □ ", { c: ["× 4", "+ 4", "÷ 4"], a: 0, why: { "1": "탁자가 2개이면 의자는 8개예요. 2 + 4가 아니라 2 × 4예요." } }]],
        { ok: "[3/5] = 0.6, 0.25 = [1/4], [2/5] < 0.45, △ = □ × 4예요." }) },
    { name: "휴양림 둘러보기", inst: "“민석이네 가족은 주리네 가족과 함께 휴양림에 방문했어요. 휴양림에서 집라인도 타고 물고기도 잡고 농구도 하며 즐거운 시간을 보냈어요.” 장면의 동그라미를 모두 눌러 두 양을 비교하는 상황을 찾아보세요.", hints: ["동그라미가 6개 있어요. 초록색으로 바뀌지 않은 곳을 찾아 눌러요.", "모노레일, 유자차, 계곡 낚시, 산책로 안내 지도, 농구 골대, 설문 조사가 있어요."],
      render: (b, a) => ra4Scene(b, a, { ok: "어른 수와 어린이 수, 유자청과 물의 양, 통발과 미끼통, 실제 거리와 지도에서의 거리, 던진 횟수와 넣은 횟수, 설문 결과에서 두 양을 비교할 수 있어요." }) },
    { name: "확인하기", inst: "우리 주변에서 두 양을 비교하는 상황을 떠올려 보세요.", hints: ["두 가지 양이 함께 나오는 상황을 찾아요.", "텔레비전 화면은 가로와 세로, 반은 남학생 수와 여학생 수를 비교할 수 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "두 양을 비교하는 상황을 모두 골라요.", o: ["텔레비전 화면의 가로와 세로 비교하기", "우리 반 남학생 수와 여학생 수 비교하기", "요리할 때 넣는 재료의 양 비교하기", "오늘의 날짜를 달력에서 찾기"], a: [0, 1, 2] }],
        { bad: "날짜를 찾는 것은 두 양을 비교하는 상황이 아니에요. 나머지는 모두 두 양을 비교해요.", ok: "텔레비전의 가로와 세로, 남학생 수와 여학생 수, 요리 재료의 양처럼 우리 주변에는 두 양을 비교하는 상황이 많아요." }) }
  ],
  challenge: { inst: "파르테논 신전을 공책에 가로 18 cm, 높이 8 cm로 그렸어요. 그린 그림의 가로는 높이의 몇 배일까요? 그리고 두 양을 비교해 본 경험을 써 보세요.", hints: ["가로가 높이의 몇 배인지는 18 ÷ 8로 구해요.", "18 ÷ 8 = [18/8]이고, 약분하면 [9/4]예요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [["가로는 높이의 18 ÷ 8 = ", { f: "9/4" }, "배"]], { ok: "[18/8] = [9/4]배 — 실제 신전과 같은 관계로 그렸어요." }),
      (bx, ax) => writeStep(bx, ax, [{ q: "두 양을 비교해 본 경험을 써 보세요.", tag: "비교한 경험", ph: "예) 라면을 끓일 때 물의 양과 면의 양을 비교했어요." }])]) }
},
{
  id: "t2", no: 2, title: "두 수를 비교해 볼까요", soop: "개념 구축하기(O)",
  question: "두 양의 크기를 어떻게 비교할 수 있을까요?",
  summary: "두 양을 비교할 때 뺄셈으로 차이를 비교할 수도 있고, 나눗셈으로 한 양이 다른 양의 몇 배인지 비교할 수도 있어요. 모노레일 한 대에 어른 6명, 어린이 3명이 타면 어른 수는 어린이 수의 2배, 어린이 수는 어른 수의 [1/2]배예요. 두 양이 함께 늘어나도 몇 배인지는 변하지 않아요.",
  steps: [
    { inst: "“집라인 체험장으로 가는 모노레일 한 대에는 어른이 6명, 어린이가 3명 탈 수 있습니다.” 모노레일을 두 대로 늘려 보고, 모노레일에 탈 수 있는 어른 수와 어린이 수를 비교해 보세요.", hints: ["‘모노레일 하나 더’를 눌러 두 대로 만들어요.", "어른 수가 어린이 수의 몇 배인지는 6 ÷ 3, 어린이 수가 어른 수의 몇 배인지는 3 ÷ 6으로 구해요."],
      render: (b, a) => ra4Build(b, a, { what: "모노레일", unit: "대", prod: "car", start: 1, target: 2, max: 3,
        items: [{ name: "어른 수", per: 6, unit: "명", icon: "adult" }, { name: "어린이 수", per: 3, unit: "명", icon: "child" }],
        ask: [["모노레일 한 대: 어른 ", { i: "6" }, "명, 어린이 ", { i: "3" }, "명"],
          ["어른 수는 어린이 수의 6 ÷ 3 = ", { i: "2", why: { "3": "6 − 3 = 3은 차이예요. 몇 배인지 구할 때는 나눗셈을 해요.", "0.5": "어린이 수가 기준이에요. 어른 수 6을 어린이 수 3으로 나눠요." } }, "배"],
          ["어린이 수는 어른 수의 3 ÷ 6 = ", { f: "1/2" }, "배"],
          ["모노레일 두 대에 탈 수 있는 어린이가 6명일 때 어른은 6 × 2 = ", { i: "12", why: { "9": "어린이보다 3명 많은 것이 아니라 어린이 수의 2배예요." } }, "명까지 탈 수 있어요."]],
        ok: "어른 수는 어린이 수의 2배, 어린이 수는 어른 수의 [1/2]배예요. 모노레일 두 대에도 어른 12명은 어린이 6명의 2배예요." }) },
    { inst: "물 1컵과 밀가루 3컵으로 수제비 반죽 한 개를 만들 수 있어요. 반죽을 세 개까지 늘려 보고, 반죽 수에 따른 물의 양과 밀가루의 양을 비교해 보세요.", hints: ["반죽 하나에 물 1컵, 밀가루 3컵이 늘어나요. 네 개면 물 4컵이에요.", "반죽 두 개는 물 2컵, 밀가루 6컵이에요. 6 ÷ 2를 해 봐요."],
      render: (b, a) => ra4Build(b, a, { what: "반죽", unit: "개", prod: "dough", start: 1, target: 3, max: 4,
        items: [{ name: "물의 양", per: 1, unit: "컵", icon: "water" }, { name: "밀가루의 양", per: 3, unit: "컵", icon: "flour" }],
        ask: [{ t: "표의 ? 칸", p: ["반죽 네 개: 물 ", { i: "4" }, "컵, 밀가루 ", { i: "12" }, "컵"] },
          ["반죽 두 개의 밀가루 양은 물 양의 6 ÷ 2 = ", { i: "3", why: { "4": "6 − 2 = 4는 차이예요. 몇 배인지는 나눗셈으로 구해요." } }, "배"],
          ["반죽 다섯 개일 때 밀가루 양은 물 양의 ", { i: "3", why: { "10": "밀가루 15컵에서 물 5컵을 빼면 10이에요. 몇 배인지 나눗셈으로 구해요." } }, "배예요."],
          ["그렇게 생각한 까닭: ", { c: ["반죽 수가 늘어나도 밀가루 양은 항상 물 양의 3배이기 때문이에요.", "밀가루가 물보다 항상 2컵 많기 때문이에요."], a: 0, why: { "1": "반죽 두 개면 밀가루가 물보다 4컵, 세 개면 6컵 많아요. 차이는 변하지만 몇 배인지는 변하지 않아요." } }]],
        ok: "반죽 수가 늘어나도 밀가루 양은 언제나 물 양의 3배예요. 나눗셈으로 비교하면 두 양의 관계를 하나의 수로 나타낼 수 있어요." }) },
    { inst: "반찬 가게에서 호박전 400 g과 꼬치전 100 g을 한 통에 담아 팔아요. 통을 두 개로 늘려 보고, 통 수에 따른 호박전의 양과 꼬치전의 양을 비교해 보세요.", hints: ["두 양 사이의 관계를 생각해 보세요. 한 통이 늘 때마다 호박전 400 g, 꼬치전 100 g이 늘어나요.", "400 ÷ 100 = 4예요. 통 수가 늘어나도 이 관계는 같아요."],
      render: (b, a) => ra4Build(b, a, { what: "통", head: "통 수", unit: "통", prod: "box", start: 1, target: 2, max: 4,
        items: [{ name: "호박전의 양", per: 400, unit: "g", icon: "jeon", lump: true }, { name: "꼬치전의 양", per: 100, unit: "g", icon: "kkochi", lump: true }],
        ask: [["세 통: 호박전 1200 g, 꼬치전 ", { i: "300" }, " g"],
          ["네 통: 호박전 ", { i: "1600" }, " g, 꼬치전 ", { i: "400" }, " g"],
          ["다섯 통일 때 호박전의 양은 꼬치전의 양의 ", { i: "4", why: { "1500": "2000 − 500 = 1500은 차이예요. 몇 배인지 나눗셈으로 구해요." } }, "배"],
          ["까닭: 통 수가 늘어나도 호박전의 양은 항상 꼬치전의 양의 ", { i: "4" }, "배이기 때문이에요."]],
        ok: "통 수에 따른 호박전의 양은 항상 꼬치전의 양의 4배예요." }) },
    { name: "정리하기", inst: "두 양을 비교하는 방법을 정리해요.", hints: ["반죽이 늘어날 때 밀가루와 물의 차이는 2컵, 4컵, 6컵으로 변했어요.", "밀가루 양 ÷ 물 양은 언제나 3이었어요."],
      render: (b, a) => blanks(b, a, ["두 양을 비교할 때 뺄셈으로 ", { o: ["차이", "몇 배"], a: 0 }, "를 비교할 수도 있고, 나눗셈으로 한 양이 다른 양의 ", { o: ["몇 배", "차이"], a: 0 }, "인지 비교할 수도 있어요. 반죽 수가 늘어나면 밀가루 양과 물 양의 차이는 ", { o: ["변하지만", "변하지 않지만"], a: 0 }, ", 밀가루 양이 물 양의 몇 배인지는 ", { o: ["변하지 않아요", "변해요"], a: 0 }, "."],
        { ok: "나눗셈으로 비교하면 두 양이 함께 늘어나도 관계가 변하지 않아요." }) },
    { inst: "수학익힘 문제예요. 나비와 벌, 쿠키와 사탕을 비교해 보세요.", hints: ["나비 8마리, 벌 2마리예요. 8 ÷ 2를 해요.", "한 봉지에 쿠키 3개, 사탕 6개예요. 네 봉지면 쿠키는 3 × 4개예요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [
          { q: "나비의 수는 벌의 수의 몇 배일까요?", fig: ra4BugFig, o: ["4배", "[1/4]배", "6배"], a: 0, why: { "1": "나비 수를 벌 수로 나눠요. 8 ÷ 2 = 4예요.", "2": "8 − 2 = 6은 차이예요. 몇 배인지는 나눗셈으로 구해요." } },
          { q: "벌의 수는 나비의 수의 몇 배일까요?", o: ["[1/4]배", "4배", "2배"], a: 0, why: { "1": "벌 수를 나비 수로 나눠요. 2 ÷ 8 = [2/8] = [1/4]이에요." } }],
          { ok: "나비 수는 벌 수의 4배, 벌 수는 나비 수의 [1/4]배예요." }),
        (bx, ax) => ra4Chain(bx, ax, [
          ["쿠키 3개와 사탕 6개를 한 봉지에 담아요. 네 봉지의 쿠키는 ", { i: "12" }, "개"],
          ["두 봉지의 사탕 ", { i: "12" }, "개, 세 봉지의 사탕 ", { i: "18" }, "개, 네 봉지의 사탕 ", { i: "24" }, "개"],
          ["봉지 수에 따른 사탕의 수는 쿠키의 수의 ", { i: "2", why: { "3": "6 − 3 = 3은 차이예요. 6 ÷ 3을 해요." } }, "배예요."]],
          { ok: "봉지 수가 늘어나도 사탕의 수는 쿠키의 수의 2배예요." })]) }
  ],
  challenge: { inst: "색칠한 칸 수와 색칠하지 않은 칸 수를 잘못 비교한 것을 찾아 옳게 고쳐 보세요. 컵케이크도 비교해 보세요.", hints: ["색칠한 칸은 8칸, 색칠하지 않은 칸은 2칸이에요.", "8 ÷ 2 = 4, 2 ÷ 8 = [1/4]이에요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => quiz(bx, ax, [{ q: "잘못 비교한 것을 골라요.", fig: () => ra4GridFig(5, 2, 8), o: ["㉠ 색칠한 칸 수는 색칠하지 않은 칸 수의 3배입니다.", "㉡ 색칠하지 않은 칸 수는 색칠한 칸 수의 [1/4]배입니다."], a: 0, why: { "1": "2 ÷ 8 = [2/8] = [1/4]이에요. ㉡은 맞게 비교했어요." } }], { ok: "㉠이 잘못 비교했어요." }),
      (bx, ax) => ra4Chain(bx, ax, [
        ["옳게 고치기: 색칠한 칸 수는 색칠하지 않은 칸 수의 ", { i: "4", why: { "6": "8 − 2 = 6은 차이예요. 8 ÷ 2를 해요." } }, "배입니다."],
        ["컵케이크 한 개에 우유 2컵과 밀가루 4컵이 들어가요. 컵케이크 세 개를 만들 때 밀가루 양은 우유 양의 ", { i: "2", why: { "6": "밀가루 12컵에서 우유 6컵을 빼면 6이에요. 12 ÷ 6을 해요." } }, "배예요."]],
        { ok: "색칠한 칸 수는 색칠하지 않은 칸 수의 4배예요. 컵케이크를 몇 개 만들어도 밀가루 양은 우유 양의 2배예요." })]) }
},
{
  id: "t3", no: 3, title: "비를 알아볼까요", soop: "개념 구축하기(O)",
  question: "두 양의 관계를 기호를 사용하여 어떻게 나타낼까요?",
  summary: "한 양을 기준으로 다른 양이 몇 배가 되는지 비교하기 위해 기호 : 을 사용하여 나타낸 것을 비라고 해요. 1 : 4는 1 대 4라고 읽고, 1과 4의 비, 1의 4에 대한 비, 4에 대한 1의 비라고도 읽어요. 기호 : 의 오른쪽에 있는 4가 기준량, 왼쪽에 있는 1이 비교하는 양이에요.",
  steps: [
    { inst: "민석이가 주리네 가족에게 대접하려고 유자차를 만들어요. “유자청 1컵과 물 4컵을 섞으면 가장 맛있는 유자차를 만들 수 있어.” 유자차를 세 병까지 만들어 보고, 병 수에 따른 유자청의 양과 물의 양을 비교해 보세요.", hints: ["‘유자차 하나 더’를 눌러 세 병을 만들어요.", "물의 양 ÷ 유자청의 양 = 4 ÷ 1, 유자청의 양 ÷ 물의 양 = 1 ÷ 4예요."],
      render: (b, a) => ra4Build(b, a, { what: "유자차", head: "유자차 병 수", unit: "병", prod: "bottle", start: 1, target: 3, max: 3,
        items: [{ name: "유자청의 양", per: 1, unit: "컵", icon: "yuja" }, { name: "물의 양", per: 4, unit: "컵", icon: "water" }],
        ask: [["유자차 병 수에 따른 물의 양은 유자청의 양의 ", { i: "4", why: { "3": "4 − 1 = 3은 차이예요. 몇 배인지 나눗셈으로 구해요." } }, "배예요."],
          ["유자청의 양은 물의 양의 ", { f: "1/4" }, "배예요."],
          ["비교한 방법: ", { c: ["곱셈(나눗셈)을 이용하여 한 양이 다른 양의 몇 배인지 구했어요.", "뺄셈을 이용하여 두 양의 차이를 구했어요."], a: 0 }]],
        ok: "유자차를 몇 병 만들어도 물의 양은 유자청의 양의 4배, 유자청의 양은 물의 양의 [1/4]배예요." }) },
    { inst: "한 양을 기준으로 다른 양이 몇 배인지 기호 : 을 사용하여 나타내요. 기준이 되는 양을 기호 : 의 오른쪽에 놓아요. 양 카드를 □에 놓아 비를 만들어 보세요.", hints: ["‘물의 양에 대한’ — ‘~에 대한’ 앞에 있는 양이 기준이에요. 기준은 오른쪽 □에 놓아요.", "물의 양에 대한 유자청의 양의 비는 유자청 1을 왼쪽, 물 4를 오른쪽에 놓아요."],
      render: (b, a) => ra4Slots(b, a, { chips: [{ t: "유자청 1컵", v: 1, nm: "유자청의 양" }, { t: "물 4컵", v: 4, nm: "물의 양" }],
        tasks: [{ q: "물의 양에 대한 유자청의 양의 비", a: [0, 1] }, { q: "유자청의 양에 대한 물의 양의 비", a: [1, 0] }],
        ok: "물의 양에 대한 유자청의 양의 비는 1 : 4, 유자청의 양에 대한 물의 양의 비는 4 : 1이에요. 기호 : 의 오른쪽이 기준량이에요." }) },
    { inst: "비를 여러 가지 방법으로 읽어 보세요.", hints: ["1 : 4에서 기준량은 오른쪽의 4예요. ‘4에 대한’이라고 읽어요.", "‘1의 4에 대한 비’도 4가 기준이에요. ‘1에 대한 4의 비’는 1이 기준이 되어 달라요."],
      render: (b, a) => quiz(b, a, [
        { q: "1 : 4를 바르게 읽은 것을 모두 골라요.", o: ["1 대 4", "1과 4의 비", "1의 4에 대한 비", "4에 대한 1의 비", "1에 대한 4의 비", "4의 1에 대한 비"], a: [0, 1, 2, 3] },
        { q: "축구 경기에서 우리 반이 2점, 옆 반이 3점을 얻어 점수를 2 : 3이라고 썼어요. 이 2 : 3은 한 양이 다른 양의 몇 배인지 나타낸 비일까요?", o: ["아니에요. 경기 점수를 나타낸 것이에요.", "네, 비예요."], a: 0, why: { "1": "경기 점수 2 : 3은 두 팀의 점수를 나란히 쓴 것이에요. 한 양을 기준으로 다른 양이 몇 배인지 나타낸 비가 아니에요." } }],
        { bad: "‘~에 대한’ 앞에 오는 수가 기준량이고, 기준량은 기호 : 의 오른쪽에 있어요. 1 : 4의 기준량은 4예요.", ok: "1 : 4는 1 대 4, 1과 4의 비, 1의 4에 대한 비, 4에 대한 1의 비라고 읽어요. 경기 점수 2 : 3은 비가 아니에요." }) },
    { inst: "알게 된 점을 약속으로 정리해요.", hints: ["두 양을 비교할 때 쓴 기호는 : 이에요.", "1 : 4에서 오른쪽 4가 기준량이에요."],
      render: (b, a) => blanks(b, a, ["한 양을 기준으로 다른 양이 몇 배가 되는지 비교하기 위해 기호 ", { o: [":", "+", "="], a: 0 }, "을 사용하여 나타낸 것을 ", { o: ["비", "백분율"], a: 0 }, "라고 합니다. 두 양 1과 4를 비교할 때 1 : 4라 쓰고, ", { o: ["1 대 4", "4 대 1"], a: 0 }, "라고 읽습니다. 1 : 4에서 1은 ", { o: ["비교하는 양", "기준량"], a: 0 }, ", 4는 ", { o: ["비교하는 양", "기준량"], a: 1 }, "입니다."],
        { ok: "기호 : 의 오른쪽은 기준량, 왼쪽은 비교하는 양이에요." }) },
    { inst: "시내버스 기본요금과 초콜릿을 비로 나타내 보세요.", hints: ["‘어린이의 기본요금에 대한’이니 어린이 요금 400원이 기준량이에요.", "처음 초콜릿 10개 중 4개를 먹으면 남은 초콜릿은 6개예요."],
      render: (b, a) => ra4Seq(b, a, [
        { title: "시내버스 기본요금은 어른 1200원, 어린이 400원이에요.", run: (bx, ax) => ra4Slots(bx, ax, { chips: [{ t: "어른 1200원", v: 1200, nm: "어른의 기본요금" }, { t: "어린이 400원", v: 400, nm: "어린이의 기본요금" }],
          tasks: [{ q: "어린이의 기본요금에 대한 어른의 기본요금의 비", a: [0, 1] }], ok: "어린이의 기본요금에 대한 어른의 기본요금의 비는 1200 : 400이에요." }) },
        (bx, ax) => ra4Chain(bx, ax, [
          ["1200 : 400에서 기준량은 ", { i: "400" }, ", 비교하는 양은 ", { i: "1200" }],
          ["이 비를 400 : 1200으로 나타낼 수 ", { c: ["없어요", "있어요"], a: 0, why: { "1": "400 : 1200은 어른 요금에 대한 어린이 요금의 비예요. 기준량이 바뀌었어요." } }, ". 비교하는 양은 기호 : 의 ", { c: ["왼쪽", "오른쪽"], a: 0 }, ", 기준량은 ", { c: ["왼쪽", "오른쪽"], a: 1 }, "에 써요."]],
          { ok: "비교하는 양은 기호 : 의 왼쪽에, 기준량은 오른쪽에 써서 1200 : 400으로 나타내요." }),
        { title: "초콜릿 10개 중 4개를 먹었어요. 초콜릿을 눌러 4개를 먹어 보세요.", run: (bx, ax) => ra4Choc(bx, ax, { total: 10, eat: 4,
          ask: [["처음에 있던 초콜릿 수에 대한 먹은 초콜릿 수의 비 ", { r: [4, 10], why: { "10:4": "‘처음에 있던 초콜릿 수에 대한’이니 처음 초콜릿 수 10이 기준량이에요. 오른쪽에 써요." } }],
            ["처음에 있던 초콜릿 수에 대한 남은 초콜릿 수의 비 ", { r: [6, 10], why: { "10:6": "처음 초콜릿 수 10이 기준량이에요." } }],
            ["남은 초콜릿 수에 대한 먹은 초콜릿 수의 비 ", { r: [4, 6], why: { "6:4": "‘남은 초콜릿 수에 대한’이니 남은 초콜릿 수 6이 기준량이에요." } }],
            ["먹은 초콜릿 수에 대한 남은 초콜릿 수의 비 ", { r: [6, 4], why: { "4:6": "‘먹은 초콜릿 수에 대한’이니 먹은 초콜릿 수 4가 기준량이에요." } }]],
          ok: "4 : 10, 6 : 10, 4 : 6, 6 : 4예요. 무엇이 기준량인지에 따라 비가 달라져요." }) }]) }
  ],
  challenge: { inst: "수학익힘 문제와 교실에서 비 찾기예요.", hints: ["‘8에 대한’이니 8이 기준량이에요. 25 : 8로 써요.", "파란색 구슬은 35 − 22 = 13개예요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [
        ["15 : 18에서 기준량은 ", { i: "18" }, ", 비교하는 양은 ", { i: "15" }],
        ["10 대 11 → ", { r: [10, 11] }, "   8에 대한 25의 비 → ", { r: [25, 8], why: { "8:25": "‘8에 대한’이니 8이 기준량이에요. 8을 오른쪽에 써요." } }],
        ["구슬 35개 중 빨간색이 22개, 나머지는 파란색이에요. 빨간색 구슬 수와 파란색 구슬 수의 비 ", { r: [22, 13], why: { "22:35": "파란색 구슬 수는 35 − 22 = 13이에요." } }],
        ["전체 구슬 수에 대한 파란색 구슬 수의 비 ", { r: [13, 35], why: { "35:13": "전체 구슬 수 35가 기준량이에요." } }],
        ["스케치북 2500원, 공책 900원이에요. 스케치북 가격에 대한 공책 가격의 비 ", { r: [900, 2500] }]],
        { ok: "기준량은 기호 : 의 오른쪽에 써요." }),
      (bx, ax) => writeStep(bx, ax, [{ q: "보기처럼 교실에서 비교할 수 있는 두 양을 찾아 비를 쓰고, 여러 가지 방법으로 읽어 보세요. (보기: 안경을 쓴 사람 수와 안경을 쓰지 않은 사람 수의 비 12 : 9 — 12 대 9, 12와 9의 비, 12의 9에 대한 비, 9에 대한 12의 비)", tag: "교실에서 찾은 비", ph: "예) 책의 가로와 세로의 비는 21 : 27이에요. 21 대 27, 21과 27의 비, 21의 27에 대한 비, 27에 대한 21의 비라고 읽어요." }])]) }
},
{
  id: "t4", no: 4, title: "비율을 알아볼까요", soop: "개념 구축하기(O)",
  question: "기준량에 대한 비교하는 양의 크기를 어떻게 나타낼까요?",
  summary: "기준량에 대한 비교하는 양의 크기를 비율이라고 해요. (비율) = (비교하는 양) ÷ (기준량)이에요. 비 2 : 5를 비율로 나타내면 [2/5] 또는 0.4예요. 비율은 분수로도 소수로도 나타낼 수 있고, 1보다 작을 수도 클 수도 있어요.",
  steps: [
    { inst: "“낚시 도구 한 세트에는 통발 2개와 미끼통 5개가 들어 있습니다.” 미끼통 막대 전체를 1로 볼 때 통발 막대의 길이는 얼마일까요? 수직선 아래의 빨간 표시를 끌어 통발 막대의 끝에 맞춰 보세요.", hints: ["미끼통 막대 끝이 수직선의 1이에요. 1을 10칸으로 나눈 눈금이 있어요.", "통발 막대는 미끼통 5칸 중 2칸만큼이에요. 2 ÷ 5 = 0.4예요."],
      render: (b, a) => ra4Comp(b, a, { base: { name: "미끼통", n: 5, icon: "bait" }, comp: { name: "통발", n: 2, icon: "trap" },
        ask: [["미끼통의 수에 대한 통발의 수의 비 ", { r: [2, 5], why: { "5:2": "‘미끼통의 수에 대한’이니 미끼통 5가 기준량이에요. 오른쪽에 써요." } }],
          ["기준량 ", { i: "5" }, ", 비교하는 양 ", { i: "2" }],
          ["통발의 수는 미끼통의 수의 2 ÷ 5 = ", { f: "2/5" }, "배, 소수로 ", { i: "0.4", why: { "2.5": "5 ÷ 2를 했어요. 비교하는 양 2를 기준량 5로 나눠요." } }, "배예요."]],
        ok: "통발의 수는 미끼통의 수의 [2/5]배(0.4배)예요." }) },
    { inst: "직사각형 모양의 메모지 가, 나, 다가 있어요. 메모지의 가로에 대한 세로의 비와 그 크기를 분수와 소수로 나타내 보세요.", hints: ["가로에 대한 세로의 비 — 가로가 기준량이에요. (세로) : (가로)로 써요.", "가는 3 : 5 → [3/5] = 0.6, 다는 6 : 10 → [6/10] = 0.6이에요."],
      render: (b, a) => { b.append(ra4MemoFig()); ra4Chain(b, a, [
        { t: "가", p: ["비 ", { r: [3, 5], why: { "5:3": "가로가 기준량이에요. 가로 5를 오른쪽에 써요." } }, " 분수 ", { f: "3/5" }, " 소수 ", { i: "0.6" }] },
        { t: "나", p: ["비 ", { r: [6, 5], why: { "5:6": "가로가 기준량이에요. 가로 5를 오른쪽에 써요." } }, " 분수 ", { f: "6/5" }, " 소수 ", { i: "1.2", why: { "0.83": "가로 5를 세로 6으로 나누지 않아요. 세로 6을 가로 5로 나눠요." } }] },
        { t: "다", p: ["비 ", { r: [6, 10], why: { "10:6": "가로가 기준량이에요. 가로 10을 오른쪽에 써요." } }, " 분수 ", { f: "6/10" }, " 소수 ", { i: "0.6" }] },
        ["가로에 대한 세로의 비율이 같은 메모지: ", { c: ["가와 다", "가와 나", "나와 다"], a: 0, why: { "1": "가는 0.6, 나는 1.2예요." } }],
        ["비율이 1보다 큰 메모지: ", { c: ["가", "나", "다"], a: 1 }]],
        { ok: "가와 다는 가로와 세로가 달라도 비율이 0.6으로 같아요. 나는 비율이 1.2로 1보다 커요." }); } },
    { inst: "메모지를 직접 만들어 보세요. 빨간 점을 끌어 가로와 세로를 바꾸고, 목표에 맞으면 확인해요.", hints: ["가로에 대한 세로의 비율이 1이려면 세로 ÷ 가로 = 1, 세로와 가로가 같아야 해요.", "비율 0.6 = [6/10]이에요. 가로 10 cm일 때 세로는 몇 cm일까요?"],
      render: (b, a) => ra4Rect(b, a, { W: 12, H: 9, w0: 5, h0: 3, base: "w",
        tasks: [{ goal: "가로에 대한 세로의 비율이 1인 메모지를 만들어 보세요.", test: (w, hh) => w === hh, why: (w, hh) => `지금 비율은 ${ra4J(`[${hh}/${w}]`, "이에요")}. 세로와 가로가 같아야 비율이 1이에요.` },
          { goal: "가와 크기는 다르지만 가로에 대한 세로의 비율이 가(0.6)와 같은 메모지를 만들어 보세요.", test: (w, hh) => 5 * hh === 3 * w && w !== 5, why: (w, hh) => w === 5 && hh === 3 ? "가와 크기가 같아요. 크기가 다른 메모지를 만들어요." : `지금 비율은 ${ra4J(`[${hh}/${w}]`, "이에요")}. ${ra4J(`[${hh}/${w}]`, "이가")} [3/5] = 0.6과 같아지게 해 봐요.` }],
        ok: "가로와 세로가 같으면 비율이 1인 정사각형이 돼요. 가로 10 cm, 세로 6 cm도 비율이 0.6이에요. 가로와 세로가 다르더라도 비율은 같을 수 있어요." }) },
    { inst: "알게 된 점을 약속으로 정리해요.", hints: ["통발 2를 미끼통 5로 나누었어요.", "2 ÷ 5 = [2/5] = 0.4예요."],
      render: (b, a) => blanks(b, a, ["기준량에 대한 비교하는 양의 크기를 ", { o: ["비율", "백분율"], a: 0 }, "이라고 합니다. (비율) = (비교하는 양) ", { o: ["÷", "×", "−"], a: 0 }, " (기준량)입니다. 비 2 : 5를 비율로 나타내면 ", { o: ["[2/5]", "[5/2]"], a: 0 }, " 또는 ", { o: ["0.4", "2.5"], a: 0 }, "입니다."],
        { ok: "(비율) = (비교하는 양) ÷ (기준량)이고, 비율은 분수나 소수로 나타내요." }) },
    { inst: "채린이는 포도즙 1 L를 넣어 포도 음료 2 L를, 도훈이는 포도즙 2 L를 넣어 포도 음료 8 L를 만들었어요. 포도 음료의 양에 대한 포도즙의 양의 비율을 분수와 소수로 나타내 보세요.", hints: ["포도 음료의 양이 기준량, 포도즙의 양이 비교하는 양이에요.", "채린: 1 ÷ 2, 도훈: 2 ÷ 8이에요."],
      render: (b, a) => { b.append(ra4Juice()); ra4Chain(b, a, [
        { t: "채린", p: ["분수 ", { f: "1/2" }, " 소수 ", { i: "0.5", why: { "2": "2 ÷ 1을 했어요. 포도즙 1 L를 포도 음료 2 L로 나눠요." } }] },
        { t: "도훈", p: ["분수 ", { f: "2/8" }, " 소수 ", { i: "0.25", why: { "4": "8 ÷ 2를 했어요. 포도즙 2 L를 포도 음료 8 L로 나눠요." } }] },
        ["비율은 ", { c: ["분수로도 소수로도 나타낼 수 있어요.", "분수로만 나타낼 수 있어요."], a: 0 }]],
        { ok: "채린이는 [1/2] = 0.5, 도훈이는 [2/8] = 0.25예요. 비율은 분수와 소수로 모두 나타낼 수 있어요." }); } }
  ],
  challenge: { inst: "수학익힘 문제예요.", hints: ["20에 대한 9의 비는 9 : 20, 12와 15의 비는 12 : 15예요.", "165 ÷ 300 = 0.55예요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [
        ["7 : 10을 비율로 나타내면 분수 ", { f: "7/10" }, ", 소수 ", { i: "0.7" }],
        ["4와 5의 비: 기준량 ", { i: "5" }, ", 비교하는 양 ", { i: "4" }, ", 비율(소수) ", { i: "0.8", why: { "1.25": "5 ÷ 4를 했어요. 비교하는 양 4를 기준량 5로 나눠요." } }],
        ["25에 대한 16의 비: 기준량 ", { i: "25" }, ", 비율 ", { f: "16/25" }, " = ", { i: "0.64" }]], { ok: "4와 5의 비는 [4/5] = 0.8, 25에 대한 16의 비는 [16/25] = 0.64예요." }),
      { title: "비율이 같은 것끼리 이어 보세요.", run: (bx, ax) => ra4Link(bx, ax, { heads: ["비", "비율"], cols: [["3 : 5", { t: "20에 대한 9의 비", v: "9 : 20" }, { t: "12와 15의 비", v: "12 : 15" }], ["0.45", "[4/5]", "0.6"]], ok: "3 : 5 — 0.6, 20에 대한 9의 비 — 0.45, 12와 15의 비 — [4/5]예요." }) },
      (bx, ax) => ra4Chain(bx, ax, [
        ["전시회 입장객 300명 중 어린이가 165명이에요. 전체 입장객 수에 대한 어린이 수의 비율 ", { f: "165/300" }, " = ", { i: "0.55" }],
        ["같은 시각에 높이 4 m인 나무의 그림자는 2 m, 높이 2 m인 나무의 그림자는 1 m예요. 높이에 대한 그림자 길이의 비율은 ", { i: "0.5", why: { "2": "높이를 그림자로 나누었어요. 그림자 길이를 높이로 나눠요." } }, "와 ", { i: "0.5" }, "로 ", { c: ["같아요", "달라요"], a: 0 }]],
        { ok: "같은 시각에 두 나무의 높이에 대한 그림자 길이의 비율은 0.5로 같아요." })]) }
},
{
  id: "t5", no: 5, title: "비율이 사용되는 경우를 알아볼까요", soop: "개념 구축하기(O)",
  question: "생활에서 비율은 어떤 경우에 사용될까요?",
  summary: "비율은 지도(실제 거리에 대한 지도에서의 거리), 판매한 비율(처음에 있던 개수에 대한 판매한 개수), 인구(넓이에 대한 인구), 빠르기(걸린 시간에 대한 간 거리) 등에 사용돼요. 기준량과 비교하는 양을 찾아 비율을 분수나 소수로 나타낸 다음 크기를 비교해요.",
  steps: [
    { inst: "실제 거리 300 m를 1 cm로 나타낸 산책로 안내 지도와 실제 거리 700 m를 1 cm로 나타낸 휴양림 안내 지도가 있어요. 산책로 입구에서 전망대까지의 실제 거리 2100 m를 두 지도에 빨간 선으로 그려 보세요(전망대까지의 거리는 이 앱에서 정한 수예요).", hints: ["산책로 안내 지도에서 1 cm는 300 m예요. 2100 m는 300 m의 몇 배일까요?", "산책로 안내 지도에는 7 cm, 휴양림 안내 지도에는 3 cm로 그려요."],
      render: (b, a) => ra4Map(b, a, { real: 2100, maps: [{ name: "산책로 안내 지도", per: 300 }, { name: "휴양림 안내 지도", per: 700 }],
        ask: [["기준량: ", { c: ["실제 거리", "지도에서의 거리"], a: 0 }, ", 비교하는 양: ", { c: ["실제 거리", "지도에서의 거리"], a: 1 }],
          ["거리를 비교할 때에는 먼저 단위를 같게 나타내요. 300 m = ", { i: "30000", why: { "3000": "1 m = 100 cm예요. 300 m = 300 × 100 cm예요." } }, " cm, 700 m = ", { i: "70000" }, " cm"],
          ["산책로 안내 지도의 비 1 : ", { i: "30000" }, ", 비율 ", { f: "1/30000" }],
          ["휴양림 안내 지도의 비 1 : ", { i: "70000" }, ", 비율 ", { f: "1/70000" }],
          ["비율이 더 높은 지도: ", { c: ["산책로 안내 지도", "휴양림 안내 지도"], a: 0, why: { "1": "분자가 1로 같을 때는 분모가 작을수록 큰 수예요. [1/30000]이 [1/70000]보다 커요." } }],
          ["비율이 높아질수록 같은 장소가 지도에서 더 ", { c: ["자세하게", "작고 간단하게"], a: 0 }, " 나타내어져요."]],
        ok: "산책로 안내 지도의 비율 [1/30000]이 더 높아요. 비율이 높을수록 같은 장소가 지도에 더 크고 자세하게 나타나요." }) },
    { inst: "과일 가게에서 하루 동안 사과 200개 중 110개, 감 400개 중 160개를 팔았어요. 처음에 있던 과일 수에 대한 판매한 과일 수의 비율을 이중 테이프로 알아보세요.", hints: ["위 테이프를 판매한 개수만큼 색칠하면 아래 테이프에서 비율을 읽을 수 있어요.", "사과: 110 ÷ 200 = 0.55, 감: 160 ÷ 400 = 0.4예요."],
      render: (b, a) => ra4Seq(b, a, [
        { title: "사과", run: (bx, ax) => ra4Tape2(bx, ax, { N: 200, unit: "개", steps: 20, target: 110, whole: "처음에 있던 사과 수", part: "판매한 사과 수", mode: "ratio",
          ask: [["사과: 비율 ", { f: "110/200" }, " = ", { i: "0.55" }]], ok: "사과는 [110/200] = 0.55예요." }) },
        { title: "감", run: (bx, ax) => ra4Tape2(bx, ax, { N: 400, unit: "개", steps: 20, target: 160, whole: "처음에 있던 감 수", part: "판매한 감 수", mode: "ratio",
          ask: [["감: 비율 ", { f: "160/400" }, " = ", { i: "0.4" }]], ok: "감은 [160/400] = 0.4예요." }) },
        (bx, ax) => ra4Chain(bx, ax, [
          ["기준량: ", { c: ["처음에 있던 과일 수", "판매한 과일 수"], a: 0 }, ", 비교하는 양: ", { c: ["처음에 있던 과일 수", "판매한 과일 수"], a: 1 }],
          ["판매한 비율이 더 높은 과일: ", { c: ["사과", "감"], a: 0, why: { "1": "판매한 개수는 감(160개)이 더 많지만, 비율은 사과 0.55가 감 0.4보다 높아요." } }]],
          { ok: "판매한 개수는 감이 더 많지만 판매한 비율은 사과(0.55)가 감(0.4)보다 높아요." })]) },
    { inst: "하늘시와 바다시의 인구와 넓이예요. 넓이에 대한 인구의 비율을 구해 비교해 보세요. 수가 크면 계산기를 써도 좋아요.", hints: ["넓이가 기준량, 인구가 비교하는 양이에요. (인구) ÷ (넓이)를 해요.", "하늘시: 2500000 ÷ 1600, 바다시: 1740000 ÷ 1200을 계산기로 해 봐요."],
      render: (b, a) => { b.append(ra4Tbl(["도시", "인구(명)", "넓이(km²)"], [["하늘시", "2500000", "1600"], ["바다시", "1740000", "1200"]]), ra4Calc()); ra4Chain(b, a, [
        ["기준량: ", { c: ["넓이", "인구"], a: 0 }, ", 비교하는 양: ", { c: ["넓이", "인구"], a: 1 }],
        ["하늘시: 2500000 ÷ 1600 = ", { i: "1562.5", w: true, why: { "0.00064": "1600 ÷ 2500000을 했어요. 인구를 넓이로 나눠요." } }],
        ["바다시: 1740000 ÷ 1200 = ", { i: "1450", w: true }],
        ["넓이에 대한 인구의 비율이 더 높은 도시: ", { c: ["하늘시", "바다시"], a: 0 }],
        ["비율이 낮아질수록 같은 넓이에 사는 사람 수는 ", { c: ["더 적어져요", "더 많아져요"], a: 0 }]],
        { ok: "하늘시 1562.5, 바다시 1450으로 하늘시의 비율이 더 높아요. 같은 넓이에 사는 사람이 하늘시에 더 많아요." }); } },
    { name: "정리하기", inst: "생활에서 비율을 비교하는 방법을 정리해요.", hints: ["지도에서는 실제 거리, 과일 가게에서는 처음에 있던 과일 수가 기준량이었어요.", "300 m와 1 cm를 비교할 때 단위를 cm로 같게 했어요."],
      render: (b, a) => blanks(b, a, ["생활에서 비율을 비교할 때는 먼저 ", { o: ["기준량과 비교하는 양", "두 양의 합"], a: 0 }, "을 찾아요. 그다음 (비교하는 양) ÷ (기준량)으로 비율을 구해 ", { o: ["분수나 소수", "두 양의 차"], a: 0 }, "로 나타내고 크기를 비교해요. 거리를 비교할 때에는 먼저 ", { o: ["단위를 같게", "수를 크게"], a: 0 }, " 나타내야 해요."],
        { ok: "기준량과 비교하는 양을 찾고, 단위를 같게 하여 비율을 구한 다음 비교해요." }) },
    { name: "문제 만들기", inst: "우리 주변에서 비율이 사용되는 경우(설탕물의 진하기, 야구 선수의 타율, 자동차의 빠르기 등)를 떠올려 보세요. 먼저 보기 문제를 풀고, 조건을 바꾸어 비율을 비교하는 문제를 만들어 풀어 보세요.", hints: ["걸린 시간이 기준량, 간 거리가 비교하는 양이에요. (간 거리) ÷ (걸린 시간)을 해요.", "서희: 50 ÷ 20 = 2.5, 연우: 60 ÷ 30 = 2예요."],
      render: (b, a) => ra4Seq(b, a, [
        { title: "보기: 서희는 자전거를 타고 50 m를 가는 데 20초가 걸렸고, 연우는 자전거를 타고 60 m를 가는 데 30초가 걸렸습니다. 걸린 시간에 대한 간 거리의 비율이 더 높은 사람은 누구인가요?", run: (bx, ax) => ra4Chain(bx, ax, [
          ["서희: 50 ÷ 20 = ", { i: "2.5", why: { "0.4": "20 ÷ 50을 했어요. 간 거리를 걸린 시간으로 나눠요." } }],
          ["연우: 60 ÷ 30 = ", { i: "2", why: { "0.5": "30 ÷ 60을 했어요. 간 거리를 걸린 시간으로 나눠요." } }],
          ["비율이 더 높은 사람: ", { c: ["서희", "연우"], a: 0, why: { "1": "간 거리는 연우가 더 길지만 비율은 서희 2.5가 연우 2보다 높아요." } }]], { ok: "서희의 비율이 2.5로 더 높아요." }) },
        { title: "이제 거리와 시간을 바꾸어 새 문제를 만들어 보세요.", run: (bx, ax) => ra4Make(bx, ax, { base: [["서희", 50, 20], ["연우", 60, 30]] }) }]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 기준량과 비교하는 양을 먼저 찾아요.", hints: ["매실 음료의 양이 기준량이에요. 경민 [20/180] = [1/9], 지수 [30/210] = [1/7]이에요.", "분자가 1로 같으면 분모가 작은 분수가 더 커요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [
        ["경민이는 매실액 20 mL로 매실 음료 180 mL를 만들었어요. 매실 음료의 양에 대한 매실액의 양의 비율 ", { f: "20/180" }],
        ["지수는 매실액 30 mL로 매실 음료 210 mL를 만들었어요. 비율 ", { f: "30/210" }],
        ["비율이 더 높은 사람: ", { c: ["경민", "지수"], a: 1, why: { "0": "[20/180] = [1/9], [30/210] = [1/7]이에요. [1/7]이 더 커요." } }]], { ok: "지수의 비율 [1/7]이 경민이의 [1/9]보다 높아요." }),
      (bx, ax) => ra4Chain(bx, ax, [
        ["가 자동차는 60 km를 12분, 나 자동차는 90 km를 15분 동안 달렸어요. 걸린 시간에 대한 달린 거리의 비율: 가 ", { i: "5" }, ", 나 ", { i: "6" }],
        ["비율이 더 낮은 자동차: ", { c: ["가", "나"], a: 0 }],
        ["곰 인형 150개 중 63개, 토끼 인형 160개 중 72개를 팔았어요. 판매한 비율(소수): 곰 인형 ", { i: "0.42" }, ", 토끼 인형 ", { i: "0.45" }, " → 더 높은 것 ", { c: ["곰 인형", "토끼 인형"], a: 1 }],
        ["1반은 25명 중 20명, 2반은 20명 중 15명이 도서관에 갔어요. 비율(소수): 1반 ", { i: "0.8" }, ", 2반 ", { i: "0.75" }, " → 더 높은 반 ", { c: ["1반", "2반"], a: 0 }],
        ["가 도시는 인구 150000명·넓이 375 km², 나 도시는 인구 135000명·넓이 270 km²예요. 넓이에 대한 인구의 비율: 가 ", { i: "400" }, ", 나 ", { i: "500" }, " → 더 낮은 도시 ", { c: ["가", "나"], a: 0 }]],
        { ok: "기준량과 비교하는 양을 찾아 비율을 구하면 쉽게 비교할 수 있어요." })]) }
},
{
  id: "t6", no: 6, title: "백분율을 알아볼까요", soop: "개념 구축하기(O)",
  question: "기준량이 다른 비율을 쉽게 비교하는 방법은 무엇일까요?",
  summary: "기준량을 100으로 할 때의 비율을 백분율이라고 해요. 백분율은 기호 %를 사용하여 나타내고, 비율 [1/100]을 1 %라 쓰고 1 퍼센트라고 읽어요. 비율을 백분율로 나타내려면 기준량이 100인 비율로 바꾸거나, 비율에 100을 곱해서 나온 값에 %를 붙여요.",
  steps: [
    { inst: "농구공 던져 넣기를 해요. “난 공을 20번 던져서 7번 넣었어!”(주리) “나는 공을 25번 던져서 8번 넣었어!”(민석) 던진 횟수만큼 칸이 있는 모눈에 넣은 횟수만큼 색칠해 보세요.", hints: ["주리 모눈은 20칸, 민석이 모눈은 25칸이에요.", "주리는 7칸, 민석이는 8칸을 색칠해요."],
      render: (b, a) => ra4Grid(b, a, { grids: [{ name: "주리", title: "주리(공을 20번 던짐)", cols: 10, rows: 2, target: 7 }, { name: "민석", title: "민석(공을 25번 던짐)", cols: 5, rows: 5, target: 8, col: "#7FB8E6" }],
        ask: [["공을 던진 횟수에 대한 공을 넣은 횟수의 비율: 주리 ", { f: "7/20" }, ", 민석 ", { f: "8/25" }],
          ["던진 횟수가 다를 때 쉽게 비교하는 방법: ", { c: ["던진 횟수(기준량)를 같게 한 다음 비교해요.", "넣은 횟수만 비교해요."], a: 0, why: { "1": "민석이가 1번 더 넣었지만 던진 횟수도 5번 더 많아요. 넣은 횟수만으로는 알 수 없어요." } }]],
        ok: "기준량(던진 횟수)이 다르면 기준량을 같게 하여 비교하면 쉬워요." }) },
    { inst: "두 사람이 공을 100번씩 던졌다면 각각 몇 번 넣었을지 생각해 보고, 100칸 모눈에 색칠해 보세요.", hints: ["100은 20의 5배예요. 주리는 7번의 5배를 넣는다고 생각해요.", "100은 25의 4배예요. 민석이는 8번의 4배예요."],
      render: (b, a) => ra4Grid(b, a, { cell: 24, grids: [{ name: "주리", title: "주리가 100번 던졌다면", cols: 10, rows: 10, target: 35 }, { name: "민석", title: "민석이가 100번 던졌다면", cols: 10, rows: 10, target: 32, col: "#7FB8E6" }],
        ask: [["주리: 100 = 20 × 5이므로 7 × 5 = ", { i: "35" }, "(번)"],
          ["민석: 100 = 25 × 4이므로 8 × 4 = ", { i: "32" }, "(번)"],
          ["공을 던진 횟수에 대한 공을 넣은 횟수의 비율이 더 높은 사람: ", { c: ["주리", "민석"], a: 0, why: { "1": "100번 던졌을 때 주리는 35번, 민석이는 32번 넣어요." } }]],
        ok: "기준량을 100으로 같게 하니 주리 35, 민석 32로 쉽게 비교할 수 있어요." }) },
    { inst: "어항에 있는 물고기 25마리 중 구피가 14마리예요. 구피 수는 전체 물고기 수의 몇 %인지 두 가지 방법으로 알아보세요. 먼저 이중 테이프의 위쪽을 구피 수만큼 색칠해 보세요.", hints: ["위 테이프 한 칸은 물고기 1마리예요. 14칸을 색칠해요.", "방법 1: 분모 25에 4를 곱하면 100이에요. 방법 2: [14/25] = 0.56, 0.56 × 100 = 56이에요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => ra4Tape2(bx, ax, { N: 25, unit: "마리", steps: 25, target: 14, whole: "전체 물고기 수", part: "구피 수", mode: "pct",
          ask: [{ t: "방법 1 기준량을 100으로 바꾸기", p: ["[14/25]의 분모와 분자에 ", { i: "4" }, "를 곱하면 [14/25] = [□/100], □ = ", { i: "56" }, " → ", { i: "56" }, " %"] },
            { t: "방법 2 비율에 100 곱하기", p: ["[14/25] = ", { i: "0.56" }, ", 0.56 × 100 = ", { i: "56" }, " → 56 %"] }],
          ok: "구피 수는 전체 물고기 수의 56 %예요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "두 방법을 비교해 보세요.", o: ["방법 1은 기준량을 100으로 할 때의 비율로 바꾸었고, 방법 2는 비율에 100을 곱해서 나온 값에 %를 붙였어요.", "두 방법으로 구한 백분율은 서로 달라요."], a: 0, why: { "1": "두 방법 모두 56 %로 같아요. 바꾸는 방법만 달라요." } }], { ok: "두 방법 모두 56 %예요. 편리한 방법을 골라 써요." })]) },
    { inst: "알게 된 점을 약속으로 정리해요.", hints: ["100번 던졌을 때로 바꾸어 비교했어요.", "[1/100]을 1 %라고 써요."],
      render: (b, a) => blanks(b, a, ["기준량을 ", { o: ["100", "10", "1"], a: 0 }, "으로 할 때의 비율을 ", { o: ["백분율", "비율"], a: 0 }, "이라고 합니다. 백분율은 기호 ", { o: ["%", ":"], a: 0 }, "를 사용하여 나타냅니다. 비율 [1/100]을 1 %라 쓰고, ", { o: ["1 퍼센트", "100 퍼센트"], a: 0 }, "라고 읽습니다."],
        { ok: "기준량을 100으로 할 때의 비율이 백분율이에요. [1/100] = 1 %(1 퍼센트)예요." }) },
    { inst: "비율을 백분율로 나타내 보세요.", hints: ["[1/25] = [4/100]이에요. 또는 [1/25] × 100 = 4예요.", "0.45 × 100 = 45, 0.7 × 100 = 70이에요."],
      render: (b, a) => ra4Chain(b, a, [
        ["[1/25] → ", { i: "4", why: { "25": "25 ÷ 1을 하지 않아요. [1/25]에 100을 곱하면 4예요.", "0.04": "0.04는 비율이에요. 100을 곱해서 %를 붙여요." } }, " %"],
        ["[11/20] → ", { i: "55", why: { "0.55": "0.55는 비율이에요. 100을 곱해요." } }, " %"],
        ["0.45 → ", { i: "45", why: { "0.45": "0.45는 비율이에요. 0.45 × 100 = 45예요.", "4.5": "0.45에 10이 아니라 100을 곱해요." } }, " %"],
        ["0.7 → ", { i: "70", why: { "7": "0.7에 10이 아니라 100을 곱해요. 0.7 × 100 = 70이에요.", "0.7": "0.7은 비율이에요. 100을 곱해요." } }, " %"]],
        { ok: "[1/25] = 4 %, [11/20] = 55 %, 0.45 = 45 %, 0.7 = 70 %예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요.", hints: ["100칸 중 색칠한 칸 수가 곧 백분율이에요.", "모두 백분율로 바꾸면 비교하기 쉬워요. 0.53 = 53 %, [27/50] = 54 %예요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [
        ["[46/100]을 백분율로 쓰면 ", { i: "46" }, " %이고, ", { c: ["46 퍼센트", "46 대 100"], a: 0 }, "라고 읽어요."],
        ["[17/20] = 0.85 = ", { i: "85" }, " %"], ["[14/25] = ", { i: "0.56" }, " = ", { i: "56" }, " %"], ["[13/25] = ", { i: "0.52" }, " = ", { i: "52" }, " %"]], { ok: "[46/100] = 46 %, [17/20] = 85 %, [14/25] = 56 %, [13/25] = 52 %예요." }),
      (bx, ax) => quiz(bx, ax, [{ q: "전체에 대한 색칠한 부분은 몇 %일까요?", fig: () => ra4GridFig(10, 10, 63), o: ["63 %", "37 %", "0.63 %"], a: 0, why: { "1": "37칸은 색칠하지 않은 부분이에요.", "2": "0.63은 비율이에요. 백분율로는 63 %예요." } }], { ok: "100칸 중 63칸이니 63 %예요." }),
      { title: "비율이 낮은 것부터 차례로 눌러 보세요.", run: (bx, ax) => sequence(bx, ax, ["㉠ 57 %", "㉡ 0.53", "㉢ [27/50]", "㉣ 51 %"], [3, 1, 2, 0], { ok: "51 % < 53 % < 54 % < 57 %이니 ㉣, ㉡, ㉢, ㉠ 차례예요." }) },
      (bx, ax) => ra4Chain(bx, ax, [
        ["자전거 50대 중 두발자전거가 37대예요. 방법 1: [37/50] = [□/100], □ = ", { i: "74" }],
        ["방법 2: [37/50] × 100 = ", { i: "74" }, " → 두발자전거는 전체 자전거의 ", { i: "74" }, " %"]], { ok: "두발자전거는 전체 자전거의 74 %예요." })]) }
},
{
  id: "t7", no: 7, title: "백분율이 사용되는 경우를 알아볼까요", soop: "개념 구축하기(O)",
  question: "생활에서 백분율은 어떤 경우에 사용될까요?",
  summary: "백분율은 설문 조사 결과, 불량품의 비율, 할인 금액의 비율, 이자의 비율처럼 생활의 여러 곳에 쓰여요. (비교하는 양) ÷ (기준량)에 100을 곱하고 %를 붙여 나타낸 다음 비교해요.",
  steps: [
    { inst: "민석이는 휴양림 홍보 자료에서 휴양림을 찾는 이유에 대한 설문 조사 결과를 보았어요. 먼저 ‘휴식’을 고른 사람 수가 전체의 몇 %인지 이중 테이프로 알아보고, 나머지도 백분율로 나타내 보세요.", hints: ["위 테이프 전체는 200명이에요. 110명만큼 색칠해요.", "[16/200] × 100 = 8, [10/200] × 100 = 5, [64/200] × 100 = 32예요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => { bx.append(ra4Tbl(["휴양림을 찾는 이유", "사람 수(명)"], [["① 휴식", "110"], ["② 가족, 친구와 시간 보내기", "16"], ["③ 음식 직접 만들어 먹기", "10"], ["④ 숲속에서 먹고 자는 것 경험", "64"], ["합계", "200"]]));
          ra4Tape2(bx, ax, { N: 200, unit: "명", steps: 100, target: 110, whole: "설문 조사에 참여한 사람 수", part: "‘휴식’을 고른 사람 수", mode: "pct",
            ask: [["① 휴식: [110/200] × 100 = ", { i: "55" }, " %"]], ok: "‘휴식’을 고른 사람은 전체의 55 %예요." }); },
        (bx, ax) => ra4Chain(bx, ax, [
          ["② [16/200] × 100 = ", { i: "8" }, " %   ③ [10/200] × 100 = ", { i: "5" }, " %   ④ [64/200] × 100 = ", { i: "32" }, " %"],
          ["50 % 이상인 항목: ", { c: ["①", "④", "②"], a: 0 }],
          ["10 % 미만인 항목: ", { c: ["②와 ③", "③만", "①과 ④"], a: 0, why: { "1": "②는 8 %로 10 %보다 작아요." } }]],
          { ok: "휴식 55 %, 가족·친구와 시간 보내기 8 %, 음식 만들어 먹기 5 %, 숲속에서 먹고 자기 32 %예요. 백분율로 나타내니 비교하기 쉬워요." })]) },
    { inst: "가 공장에서는 드론 500대를 만들었는데 그중 35대가 불량품이었고, 나 공장에서는 드론 600대를 만들었는데 그중 48대가 불량품이었어요. 만든 드론 수에 대한 불량품 수의 비율을 백분율로 나타내 비교해 보세요.", hints: ["만든 드론 수가 기준량, 불량품 수가 비교하는 양이에요.", "[35/500] × 100 = 7, [48/600] × 100 = 8이에요."],
      render: (b, a) => ra4Seq(b, a, [
        { title: "가 공장", run: (bx, ax) => ra4Tape2(bx, ax, { N: 500, unit: "대", steps: 100, target: 35, whole: "가 공장에서 만든 드론 수", part: "불량품 수", mode: "pct",
          ask: [["가 공장: [35/500] × 100 = ", { i: "7", why: { "0.07": "0.07은 비율이에요. 100을 곱해요." } }, " %"]], ok: "가 공장의 불량품은 7 %예요." }) },
        { title: "나 공장", run: (bx, ax) => ra4Tape2(bx, ax, { N: 600, unit: "대", steps: 100, target: 48, whole: "나 공장에서 만든 드론 수", part: "불량품 수", mode: "pct",
          ask: [["나 공장: [48/600] × 100 = ", { i: "8" }, " %"]], ok: "나 공장의 불량품은 8 %예요." }) },
        (bx, ax) => ra4Chain(bx, ax, [["불량품의 비율이 더 낮은 공장: ", { c: ["가 공장", "나 공장"], a: 0, why: { "1": "나 공장은 8 %, 가 공장은 7 %예요. 7 %가 더 낮아요." } }]],
          { ok: "7 % < 8 %이니 가 공장의 불량품 비율이 더 낮아요." })]) },
    { inst: "판매 금액이 5500원인 장난감을 할인하여 3300원에, 판매 금액이 4000원인 스케치북을 할인하여 2600원에 팔아요. 판매 금액에 대한 할인 금액의 비율을 백분율로 나타내 보세요.", hints: ["할인 금액은 (판매 금액) − (할인한 뒤 가격)이에요.", "장난감: [2200/5500] × 100 = 40, 스케치북: [1400/4000] × 100 = 35예요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => ra4Chain(bx, ax, [["장난감 할인 금액: 5500 − 3300 = ", { i: "2200" }, "(원)"], ["스케치북 할인 금액: 4000 − 2600 = ", { i: "1400" }, "(원)"]], { ok: "할인 금액은 장난감 2200원, 스케치북 1400원이에요." }),
        { title: "장난감", run: (bx, ax) => ra4Tape2(bx, ax, { N: 5500, unit: "원", steps: 100, target: 2200, whole: "장난감 판매 금액", part: "할인 금액", mode: "pct",
          ask: [["[2200/5500] × 100 = ", { i: "40", why: { "60": "3300원은 할인한 뒤의 가격이에요. 할인 금액 2200원을 판매 금액으로 나눠요." } }, " %"]], ok: "장난감은 판매 금액의 40 %를 할인해요." }) },
        { title: "스케치북", run: (bx, ax) => ra4Tape2(bx, ax, { N: 4000, unit: "원", steps: 100, target: 1400, whole: "스케치북 판매 금액", part: "할인 금액", mode: "pct",
          ask: [["[1400/4000] × 100 = ", { i: "35", why: { "65": "2600원은 할인한 뒤의 가격이에요. 할인 금액 1400원을 판매 금액으로 나눠요." } }, " %"]], ok: "스케치북은 판매 금액의 35 %를 할인해요." }) },
        (bx, ax) => ra4Chain(bx, ax, [["판매 금액에 대한 할인 금액의 비율이 더 높은 상품: ", { c: ["장난감", "스케치북"], a: 0 }]], { ok: "40 % > 35 %이니 장난감의 할인 비율이 더 높아요." })]) },
    { name: "정리하기", inst: "생활에서 백분율이 쓰이는 경우를 정리해요.", hints: ["불량품의 비율, 할인 금액의 비율을 백분율로 나타냈어요.", "기준량이 500대, 600대로 달라도 백분율로 나타내니 쉽게 비교했어요."],
      render: (b, a) => blanks(b, a, ["백분율은 설문 조사 결과, 불량품의 비율, 물건의 ", { o: ["할인 금액의 비율", "무게"], a: 0 }, ", 은행의 이자의 비율처럼 생활의 여러 곳에 쓰여요. 백분율로 나타내려면 (비교하는 양) ÷ (기준량)에 ", { o: ["100", "10"], a: 0 }, "을 곱하고 %를 붙여요. 기준량이 달라도 백분율로 나타내면 ", { o: ["쉽게 비교할 수 있어요", "비교할 수 없어요"], a: 0 }, "."],
        { ok: "백분율은 기준량을 100으로 같게 한 비율이라서 비교하기 편리해요." }) },
    { inst: "1년 동안 은행에 예금한 돈과 받은 이자예요. 예금한 돈에 대한 이자의 비율을 백분율로 나타내 보세요.", hints: ["예금한 돈이 기준량, 이자가 비교하는 양이에요.", "[4800/120000] × 100 = 4, [6300/210000] × 100 = 3이에요."],
      render: (b, a) => { b.append(ra4Tbl(["은행", "예금한 돈(원)", "이자(원)"], [["행복 은행", "120000", "4800"], ["희망 은행", "210000", "6300"]])); ra4Chain(b, a, [
        ["행복 은행: [4800/120000] × 100 = ", { i: "4" }, " %"],
        ["희망 은행: [6300/210000] × 100 = ", { i: "3" }, " %"],
        ["예금할 돈이 같다면 더 이익인 은행: ", { c: ["행복 은행", "희망 은행"], a: 0 }],
        ["까닭: ", { c: ["예금한 돈에 대한 이자의 비율이 더 높기 때문이에요.", "받은 이자가 더 많기 때문이에요."], a: 0, why: { "1": "이자는 희망 은행이 더 많지만 예금한 돈도 더 많아요. 비율로 비교해요." } }]],
        { ok: "행복 은행의 이자 비율(4 %)이 희망 은행(3 %)보다 높아서, 같은 돈을 예금하면 행복 은행이 더 이익이에요." }); } }
  ],
  challenge: { inst: "수학익힘 문제예요. 백분율로 나타내 비교해 보세요.", hints: ["(비교하는 양) ÷ (기준량) × 100을 해요.", "인상 금액은 (올해 가격) − (작년 가격)이고, 작년 가격이 기준량이에요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [
        ["가 공장은 가방 450개 중 9개, 나 공장은 500개 중 15개가 불량품이에요. 가 ", { i: "2" }, " %, 나 ", { i: "3" }, " % → 더 낮은 공장 ", { c: ["가", "나"], a: 0 }],
        ["알뜰 은행은 70000원을 예금해 이자 2100원, 든든 은행은 80000원을 예금해 이자 3200원을 받았어요. 알뜰 ", { i: "3" }, " %, 든든 ", { i: "4" }, " % → 더 높은 은행 ", { c: ["알뜰", "든든"], a: 1 }]], { ok: "가 공장 2 %, 든든 은행 4 %예요." }),
      (bx, ax) => ra4Chain(bx, ax, [
        ["티셔츠 25000원에서 2000원, 바지 42000원에서 2940원을 할인했어요. 티셔츠 ", { i: "8" }, " %, 바지 ", { i: "7" }, " % → 할인 비율이 더 높은 옷 ", { c: ["티셔츠", "바지"], a: 0 }],
        ["아름 공연장은 250석 중 185석, 사랑 공연장은 220석 중 165석이 예매되었어요. 아름 ", { i: "74" }, " %, 사랑 ", { i: "75" }, " % → 더 높은 곳 ", { c: ["아름 공연장", "사랑 공연장"], a: 1 }],
        ["두부는 작년 3200원에서 올해 3680원, 설탕은 4500원에서 5310원이 되었어요. 작년 가격에 대한 인상 금액의 비율: 두부 ", { i: "15", why: { "115": "3680 ÷ 3200을 했어요. 인상 금액 480원을 작년 가격으로 나눠요." } }, " %, 설탕 ", { i: "18" }, " % → 더 높은 것 ", { c: ["두부", "설탕"], a: 1 }]],
        { ok: "티셔츠 8 %, 사랑 공연장 75 %, 설탕 18 %가 더 높아요." })]) }
},
{
  id: "t8", no: 8, title: "생각을 더하다 ― 에너지 절약, 실천해요!", soop: "탐구 정리하기(O)",
  question: "이번 달에 줄이려는 전기 사용량은 지난달 전기 사용량의 몇 %일까요?",
  summary: "kWh(킬로와트시)는 전기 사용량의 단위예요. 지난달 전기 사용량이 기준량, 줄이려는 전기 사용량이 비교하는 양이에요. 유준이네는 14 : 280, 비율 [14/280] = 0.05, 백분율 5 %이고, 예은이네는 27 : 270, 비율 [27/270] = 0.1, 백분율 10 %예요.",
  steps: [
    { name: "청구서 읽기", inst: "유준이와 어머니가 전기 요금 청구서를 보고 이야기하고 있어요. “지난달 우리 집의 전기 사용량은 280 kWh였어.” “평균 사용량보다 많이 사용했네.” “가전제품의 사용을 줄여 전기를 절약해야겠어요.” 청구서를 읽어 보세요.", hints: ["kWh(킬로와트시)는 전기 사용량의 단위예요.", "우리 집 막대의 끝이 우리 집 사용량이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "유준이네 집의 지난달 전기 사용량은 몇 kWh일까요?", fig: () => ra4BillFig([208, 248, 268, 288, 328], 268, 280), o: ["280 kWh", "268 kWh", "328 kWh"], a: 0, why: { "1": "268 kWh는 같은 넓이 집들의 평균 사용량이에요." } },
        { q: "유준이네 집은 평균 사용량과 비교하여 어떻게 사용했나요?", o: ["평균보다 많이 사용했어요.", "평균보다 적게 사용했어요."], a: 0, why: { "1": "280 kWh는 평균 268 kWh보다 많아요." } }],
        { ok: "유준이네 집은 지난달 280 kWh를 사용해 평균(268 kWh)보다 많이 사용했어요." }) },
    { name: "줄일 가전제품", inst: "유준이네 가족은 이번 달에 세 가전제품의 사용을 줄이려고 해요. 계획: 텔레비전 5 kWh, 세탁기 3 kWh, 건조기 6 kWh를 줄여요(다른 가전제품의 전기 사용량은 지난달과 같아요). 계획에 있는 가전제품을 모두 골라 보세요.", hints: ["텔레비전, 세탁기, 건조기를 골라요. 냉장고와 전기밥솥은 이 앱에서 더한 가전제품으로, 계획에 없어요.", "5 + 3 + 6을 계산해요."],
      render: (b, a) => ra4Save(b, a, { items: [{ name: "텔레비전", kwh: 5 }, { name: "냉장고", kwh: 4 }, { name: "세탁기", kwh: 3 }, { name: "전기밥솥", kwh: 2 }, { name: "건조기", kwh: 6 }], plan: [0, 2, 4],
        ask: () => [["줄이려는 전기 사용량: 5 + 3 + 6 = ", { i: "14" }, " (kWh)"]], ok: "줄이려는 전기 사용량은 모두 14 kWh예요." }) },
    { name: "비와 비율", inst: "줄이려는 전기 사용량과 지난달 전기 사용량을 비와 비율로 나타내 보세요.", hints: ["지난달 전기 사용량이 기준량이에요. 기호 : 의 오른쪽에 써요.", "14 ÷ 280 = [14/280] = [1/20] = 0.05예요."],
      render: (b, a) => ra4Chain(b, a, [
        ["지난달 전기 사용량에 대한 줄이려는 전기 사용량의 비: ", { r: [14, 280], why: { "280:14": "지난달 전기 사용량 280이 기준량이에요. 오른쪽에 써요." } }],
        ["기준량 ", { i: "280" }, ", 비교하는 양 ", { i: "14" }],
        ["비율: 분수 ", { f: "14/280" }, ", 소수 ", { i: "0.05", why: { "20": "280 ÷ 14를 했어요. 14를 280으로 나눠요.", "0.5": "14 ÷ 280 = 0.05예요. 소수점 자리를 확인해요." } }]],
        { ok: "14 : 280의 비율은 [14/280] = 0.05예요." }) },
    { name: "백분율로", inst: "이중 테이프의 위쪽을 줄이려는 전기 사용량만큼 색칠하고, 줄이려는 전기 사용량은 지난달 전기 사용량의 몇 %인지 구해 보세요.", hints: ["위 테이프 한 칸은 7 kWh예요. 14 kWh는 2칸이에요.", "[14/280] × 100 = 5예요."],
      render: (b, a) => ra4Tape2(b, a, { N: 280, unit: "kWh", steps: 40, target: 14, whole: "지난달 전기 사용량", part: "줄이려는 전기 사용량", mode: "pct",
        ask: [["[14/280] × 100 = ", { i: "5", why: { "0.05": "0.05는 비율이에요. 100을 곱하고 %를 붙여요.", "20": "280 ÷ 14를 했어요. 14를 280으로 나눠요." } }, " → ", { i: "5" }, " %"]],
        ok: "유준이네 가족이 줄이려는 전기 사용량은 지난달 전기 사용량의 5 %예요." }) },
    { name: "예은이네 가족", inst: "예은이네 가족은 이번 달에 식기세척기 15 kWh, 진공청소기 12 kWh의 사용을 줄여 전기를 절약하려고 해요. 예은이네 집의 지난달 전기 사용량이 270 kWh였을 때 줄이려는 전기 사용량은 지난달 전기 사용량의 몇 %인지 구해 보세요.", hints: ["유준이네처럼 차례대로 구해요. 줄이려는 양은 15 + 12예요.", "[27/270] = [1/10] = 0.1이고, 0.1 × 100 = 10이에요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "예은이네 집의 지난달 전기 사용량은 몇 kWh일까요?", fig: () => ra4BillFig([190, 230, 250, 270, 310], 250, 270), o: ["270 kWh", "250 kWh", "310 kWh"], a: 0, why: { "1": "250 kWh는 같은 넓이 집들의 평균 사용량이에요." } }], { ok: "예은이네 집은 270 kWh를 사용했어요." }),
        (bx, ax) => ra4Chain(bx, ax, [
          ["줄이려는 전기 사용량: 15 + 12 = ", { i: "27" }, " (kWh)"],
          ["비 ", { r: [27, 270], why: { "270:27": "지난달 전기 사용량 270이 기준량이에요." } }, ", 기준량 ", { i: "270" }, ", 비교하는 양 ", { i: "27" }],
          ["비율 ", { f: "27/270" }, " = ", { i: "0.1" }, ", 백분율 ", { i: "10" }, " %"]],
          { ok: "예은이네 가족이 줄이려는 전기 사용량은 지난달 전기 사용량의 10 %예요." })]) }
  ],
  challenge: { inst: "우리 집의 지난달 전기 사용량이 200 kWh라고 해요(이 앱에서 정한 수). 줄이고 싶은 가전제품을 골라 절약 계획을 세우고, 줄이려는 전기 사용량은 지난달 전기 사용량의 몇 %인지 구해 보세요.", hints: ["고른 가전제품의 kWh를 모두 더해요.", "기준량이 200이니 (줄이려는 양) ÷ 200 × 100을 해요."],
    render: (b, a) => ra4Save(b, a, { items: [{ name: "에어컨", kwh: 16 }, { name: "텔레비전", kwh: 4 }, { name: "세탁기", kwh: 2 }, { name: "건조기", kwh: 6 }, { name: "전기밥솥", kwh: 4 }, { name: "컴퓨터", kwh: 8 }], btn: "이렇게 절약할래요",
      ask: s => [["줄이려는 전기 사용량: ", { i: String(s) }, " (kWh)"], ["지난달 전기 사용량에 대한 줄이려는 전기 사용량의 비: ", { r: [s, 200], why: { [`200:${s}`]: "지난달 전기 사용량 200이 기준량이에요." } }], ["백분율: ", { i: String(s / 2) }, " %"]],
      ok: "우리 집 절약 계획을 세우고 백분율로 나타냈어요. 가족과 함께 실천해 봐요!" }) }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 비율이 같은 카드를 찾아요!", soop: "발표하기(P)",
  question: "비, 비율, 백분율을 비교하여 비율이 같은 카드를 찾을 수 있을까요?",
  summary: "비가 적혀 있으면 비율로 바꾸고, 두 비율을 분수·소수·백분율 중 같은 표현으로 나타내어 비교해요. 예를 들어 1 : 4 = [1/4] = 0.25 = 25 %예요. 이 앱의 비와 비율 카드 24장은 이 앱이 정한 카드예요(교과서 부록 카드와 달라요).",
  steps: [
    { name: "놀이 방법", inst: "‘비율이 같은 카드를 찾아요!’ 놀이 방법이에요(인원 2~4명, 준비물: 비와 비율 카드 24장). 놀이 순서대로 눌러 보세요.", hints: ["먼저 카드를 섞어 뒤집어 놓고 순서를 정해요.", "카드 2장을 뒤집어 비율이 같은지 판단해요. 남은 카드가 없을 때 끝나요."],
      render: (b, a) => sequence(b, a, ["㉠ 남은 카드가 없을 때까지 놀이를 계속하고, 카드를 더 많이 가져간 사람이 이겨요.", "㉡ 카드 24장을 섞어 책상 위에 뒤집어 놓고, 가위바위보로 놀이 순서를 정해요.", "㉢ 비율이 같으면 카드를 가져오고 계속 뒤집어요. 비율이 다르면 다시 뒤집어 원래 자리에 두고 차례가 넘어가요.", "㉣ 순서대로 카드 2장을 골라 뒤집어요."], [1, 3, 2, 0],
        { ok: "카드 섞기 → 2장 뒤집기 → 비율이 같으면 가져오고, 다르면 다시 뒤집기 → 카드가 없을 때까지 반복해요." }) },
    { name: "카드 살펴보기", inst: "놀이를 하기 전에 연습해요. 카드 두 장의 비율이 같은지 판단해 보세요.", hints: ["비는 (비교하는 양) ÷ (기준량)으로 비율을 구해요. 6 : 8 = [6/8] = 0.75예요.", "백분율은 100으로 나누어 소수로 바꿔요. 75 % = 0.75, 4 % = 0.04예요."],
      render: (b, a) => ra4Same(b, a, { pairs: [["6 : 8", "75 %"], ["2 : 5", "0.25"], ["[3/20]", "15 %"], ["0.4", "4 %"], ["9 : 12", "[3/4]"], ["5 : 4", "0.8"]],
        ok: "비율이 같은지 알맞게 판단했어요. 분수, 소수, 백분율 중 같은 표현으로 바꾸면 쉬워요." }) },
    { name: "놀이하기", inst: "컴퓨터와 놀이를 해요. 내 차례에 카드 2장을 뒤집고, 두 카드의 비율이 같은지 단추로 판단해요. 맞게 판단하면 카드를 가져오고 한 번 더 해요. 카드를 더 많이 가져간 사람이 이겨요.", hints: ["컴퓨터가 뒤집은 카드의 자리도 기억해 두면 짝을 찾기 쉬워요.", "비율이 같은 카드는 꼭 한 장씩 있어요. 비는 비율로, 백분율은 소수로 바꾸어 비교해요."],
      render: (b, a) => ra4Memory(b, a, { mem: .5 }) },
    { name: "말해 보기", inst: "놀이를 하며 생각한 것을 말해 보세요.", hints: ["1 : 4 = [1/4] = 0.25 = 25 %예요.", "4 : 1은 기준량이 1이라 비율이 4예요."],
      render: (b, a) => quiz(b, a, [
        { q: "놀이에서 이기려면 어떻게 하면 좋을까요?", o: ["뒤집었던 카드의 자리와 비율을 기억해요.", "카드를 아무렇게나 빨리 뒤집어요."], a: 0 },
        { q: "1 : 4와 비율이 같은 카드를 모두 골라요.", o: ["25 %", "[1/4]", "0.4", "4 : 1", "0.25"], a: [0, 1, 4] },
        { q: "두 카드의 비율이 같은지 어떻게 알 수 있을까요?", o: ["비는 비율로 바꾸고, 분수·소수·백분율 중 같은 표현으로 나타내어 비교해요.", "카드에 적힌 수의 생김새가 비슷한지 봐요."], a: 0 }],
        { bad: "1 : 4의 비율은 [1/4] = 0.25 = 25 %예요. 4 : 1은 비율이 4, 0.4는 40 %예요.", ok: "같은 표현으로 바꾸어 비교하면 비율이 같은 카드를 정확히 찾을 수 있어요." }) },
    { inst: "비율이 같은 카드를 찾아 확인해 보세요.", hints: ["9 : 20 = [9/20] = 0.45예요.", "0.6 = [6/10] = [3/5] = 60 %예요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "비율이 같은 카드끼리 짝 지은 것이 아닌 것을 골라요.", o: ["7 : 20 — 35 %", "6 : 5 — 1.2", "[3/25] — 12 %", "9 : 20 — 0.9"], a: 3, why: { "0": "7 ÷ 20 = 0.35 = 35 %예요. 비율이 같아요.", "1": "6 ÷ 5 = 1.2예요. 비율이 같아요.", "2": "[3/25] = [12/100] = 12 %예요. 비율이 같아요." } }], { ok: "9 : 20의 비율은 0.45예요. 0.9와 달라요." }),
        (bx, ax) => ra4Chain(bx, ax, [["0.6을 백분율로 나타내면 ", { i: "60" }, " %, 기약분수로 나타내면 ", { f: "3/5" }]], { ok: "0.6 = 60 % = [3/5]예요." })]) }
  ],
  challenge: { inst: "또 다른 놀이: 네 사람이 비율 카드를 동시에 한 장씩 뒤집고, 비율이 가장 높은 사람이 뒤집은 카드를 모두 가져가요. 4판부터는 규칙을 바꾸어 비율이 가장 낮은 사람이 가져가요. 지도서의 비율 카드 24장으로 6판을 해 보세요.", hints: ["분수, 소수, 백분율을 모두 소수로 바꾸면 비교하기 쉬워요.", "[22/25] = 0.88, [3/20] = 0.15, 58 % = 0.58이에요."],
    render: (b, a) => ra4High(b, a, {}) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "비와 비율에 대해 공부한 내용을 잘 알고 있나요?",
  summary: "한 양을 기준으로 다른 양이 몇 배가 되는지 비교하기 위해 기호 : 을 사용하여 나타낸 것이 비예요. 2 : 5에서 2는 비교하는 양, 5는 기준량이에요. 기준량에 대한 비교하는 양의 크기가 비율이고, 2 : 5의 비율은 [2/5] = 0.4예요. 기준량을 100으로 할 때의 비율이 백분율이고, 0.4는 40 %예요.",
  steps: [
    { name: "두 양 비교하기", inst: "1번. 노란색 물감 60 g과 파란색 물감 40 g을 섞어 초록색 물감 한 병을 만들어요. 병을 두 개로 늘려 보고, 표를 완성하여 두 양을 비교해 보세요.", hints: ["한 병이 늘 때마다 노란색 60 g, 파란색 40 g이 늘어나요.", "60 ÷ 40 = [60/40] = [3/2] = 1.5예요. 몇 병이든 같아요."],
      render: (b, a) => ra4Build(b, a, { what: "초록색 물감", head: "초록색 물감 병 수", unit: "병", prod: "bottle", start: 1, target: 2, max: 4,
        items: [{ name: "노란색 물감의 양", per: 60, unit: "g", icon: "yuja", lump: true }, { name: "파란색 물감의 양", per: 40, unit: "g", icon: "water", lump: true }],
        ask: [["세 병: 파란색 물감 ", { i: "120" }, " g"], ["네 병: 노란색 물감 ", { i: "240" }, " g, 파란색 물감 ", { i: "160" }, " g"],
          ["다섯 병일 때 노란색 물감의 양은 파란색 물감의 양의 ", { i: "3/2", w: true, why: { "100": "300 − 200 = 100은 차이예요. 300 ÷ 200을 해요." } }, "배, 열 병일 때도 ", { i: "3/2", w: true }, "배 (분수나 소수로 써요)"]],
        ok: "노란색 물감의 양은 언제나 파란색 물감의 양의 [3/2]배(1.5배)예요." }) },
    { name: "비로 나타내기", inst: "2번, 3번 문제예요.", hints: ["‘사과 수에 대한’이니 사과 수 3이 기준량이에요.", "6 : 20 = [6/20] = [3/10] = 0.3 = 30 %예요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => { bx.append(ra4AppleCarrot()); ra4Chain(bx, ax, [
          ["2. 사과 수와 당근 수의 비 ", { r: [3, 4], why: { "4:3": "‘사과 수와 당근 수의 비’는 사과 수를 앞에, 당근 수를 뒤에 써요." } }],
          ["사과 수에 대한 당근 수의 비 ", { r: [4, 3], why: { "3:4": "‘사과 수에 대한’이니 사과 수 3이 기준량이에요. 오른쪽에 써요." } }]], { ok: "사과 수와 당근 수의 비는 3 : 4, 사과 수에 대한 당근 수의 비는 4 : 3이에요." }); },
        { title: "3. 비율이 같은 것끼리 이어 보세요.", run: (bx, ax) => ra4Link(bx, ax, { heads: ["비", "분수", "소수", "백분율"], cols: [["6 : 20", "9 : 12", "5 : 25"], ["[3/4]", "[1/5]", "[3/10]"], ["0.3", "0.75", "0.2"], ["75 %", "20 %", "30 %"]],
          ok: "6 : 20 — [3/10] — 0.3 — 30 %, 9 : 12 — [3/4] — 0.75 — 75 %, 5 : 25 — [1/5] — 0.2 — 20 %예요." }) }]) },
    { name: "비율 구하기", inst: "4번, 5번 문제예요.", hints: ["묽은 수산화 나트륨 용액의 양이 기준량이에요.", "여학생은 25 − 10 = 15명이에요. [15/25] × 100을 해 봐요."],
      render: (b, a) => ra4Seq(b, a, [
        { title: "4. 하진: “묽은 수산화 나트륨 용액 20 mL에 지시약을 넣은 다음 묽은 염산 30 mL를 섞었더니 붉은색으로 변했어.” 지원: “묽은 수산화 나트륨 용액 16 mL에 지시약을 넣은 다음 묽은 염산 12 mL를 섞었더니 푸른색으로 변했어.” 묽은 수산화 나트륨 용액의 양에 대한 묽은 염산의 양의 비율을 구해 보세요.", run: (bx, ax) => ra4Chain(bx, ax, [
          ["지원: 분수 ", { f: "12/16" }, ", 소수 ", { i: "0.75", why: { "1.33": "16 ÷ 12를 했어요. 염산의 양 12를 용액의 양 16으로 나눠요." } }],
          ["하진: 분수 ", { f: "30/20" }, ", 소수 ", { i: "1.5" }]], { ok: "지원 [12/16] = 0.75, 하진 [30/20] = 1.5예요." }) },
        (bx, ax) => quiz(bx, ax, [{ q: "5. 서희네 반 학생 25명 중 남학생은 10명이에요. 잘못 설명한 것을 골라요.", o: ["㉠ 전체 학생 수에 대한 남학생 수의 비율은 [2/5]입니다.", "㉡ 여학생 수에 대한 남학생 수의 비는 10 : 15입니다.", "㉢ 여학생 수는 전체 학생 수의 6 %입니다."], a: 2,
          why: { "0": "10 ÷ 25 = [10/25] = [2/5]예요. 맞는 설명이에요.", "1": "여학생은 25 − 10 = 15명이고, 여학생 수가 기준량이라 10 : 15예요. 맞는 설명이에요." } }], { ok: "㉢이 잘못 설명했어요." }),
        (bx, ax) => ra4Chain(bx, ax, [["까닭: 여학생 수는 전체 학생 수의 [15/25] × 100 = ", { i: "60", why: { "6": "[15/25] = 0.6이에요. 0.6에 100을 곱해야 백분율이에요." } }, " %이기 때문이에요."]], { ok: "여학생 수는 전체 학생 수의 60 %예요." })]) },
    { name: "백분율 활용", inst: "6번. 판매 금액이 4500원인 딸기잼을 할인하여 3600원에, 판매 금액이 8000원인 사과잼을 할인하여 6800원에 팔아요. 연우는 판매 금액에 대한 할인 금액의 비율이 더 높은 잼을 샀어요.", hints: ["할인 금액은 딸기잼 900원, 사과잼 1200원이에요.", "[900/4500] × 100 = 20, [1200/8000] × 100 = 15예요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => ra4Chain(bx, ax, [["딸기잼 할인 금액: 4500 − 3600 = ", { i: "900" }, "(원)   사과잼 할인 금액: 8000 − 6800 = ", { i: "1200" }, "(원)"]], { ok: "할인 금액은 딸기잼 900원, 사과잼 1200원이에요." }),
        { title: "딸기잼", run: (bx, ax) => ra4Tape2(bx, ax, { N: 4500, unit: "원", steps: 100, target: 900, whole: "딸기잼 판매 금액", part: "할인 금액", mode: "pct",
          ask: [["딸기잼: [900/4500] × 100 = ", { i: "20", why: { "80": "3600원은 할인한 뒤의 가격이에요. 할인 금액 900원을 판매 금액으로 나눠요." } }, " %"]], ok: "딸기잼은 20 %를 할인해요." }) },
        (bx, ax) => ra4Chain(bx, ax, [["사과잼: [1200/8000] × 100 = ", { i: "15" }, " %"], ["연우가 산 잼: ", { c: ["딸기잼", "사과잼"], a: 0, why: { "1": "할인 금액은 사과잼이 더 많지만, 할인 비율은 딸기잼 20 %가 사과잼 15 %보다 높아요." } }]], { ok: "딸기잼 20 % > 사과잼 15 %이니 연우는 딸기잼을 샀어요." })]) },
    { name: "확인하고 정리해요", inst: "확인하고 정리해요. 단원에서 배운 내용을 정리해 보세요.", hints: ["2 : 5에서 오른쪽 5가 기준량이에요.", "0.4 × 100 = 40이에요."],
      render: (b, a) => blanks(b, a, ["한 양을 기준으로 다른 양이 몇 배가 되는지 비교하기 위해 기호 :을 사용하여 나타낸 것을 ", { o: ["비", "백분율"], a: 0 }, "라고 합니다. 2 : 5에서 2는 ", { o: ["비교하는 양", "기준량"], a: 0 }, ", 5는 ", { o: ["비교하는 양", "기준량"], a: 1 }, "입니다. 기준량에 대한 비교하는 양의 크기를 비율이라고 하고, 2 : 5의 비율은 [2/5] = ", { o: ["0.4", "2.5"], a: 0 }, "입니다. 기준량을 ", { o: ["100", "10"], a: 0 }, "으로 할 때의 비율을 백분율이라고 하고, 0.4는 ", { o: ["40 %", "4 %"], a: 0 }, "라고 씁니다."],
        { ok: "비, 비율, 백분율을 잘 정리했어요. 다음 단원에서는 여러 가지 그래프를 배워요." }) }
  ],
  challenge: { inst: "비율을 비교하고, 이 단원에서 기억에 남는 내용을 정리해 보세요.", hints: ["모두 백분율로 바꾸어 비교해요. 0.38 = 38 %, [9/25] = 36 %예요.", "기억에 남는 내용은 글, 그림, 기호 등 나만의 방법으로 써요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => quiz(bx, ax, [{ q: "비율이 가장 높은 것을 골라요.", o: ["㉠ 0.38", "㉡ [9/25]", "㉢ 37 %", "㉣ 7 : 20"], a: 0, why: { "1": "[9/25] = [36/100] = 36 %예요.", "2": "0.38 = 38 %라서 37 %보다 높아요.", "3": "7 : 20 = [7/20] = 35 %예요." } }], { ok: "0.38 = 38 %, [9/25] = 36 %, 37 %, 7 : 20 = 35 %이니 ㉠이 가장 높아요." }),
      (bx, ax) => writeStep(bx, ax, [
        { q: "이 단원에서 기억에 남는 내용을 나만의 방법(글, 그림, 기호 등)으로 정리해 써 보세요.", tag: "기억에 남는 내용", ph: "예) 비율은 (비교하는 양) ÷ (기준량)이에요. 3 : 4는 3/4 = 0.75 = 75 %예요." },
        { q: "생활에서 비율이나 백분율이 쓰이는 곳을 하나 찾아 써 보세요.", tag: "생활 속 비율", ph: "예) 가게의 30 % 할인, 야구 선수의 타율, 지도의 축척" }])]) }
}
];
