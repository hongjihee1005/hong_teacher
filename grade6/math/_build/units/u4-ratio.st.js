//@@APP
const APP={title:"우리 반 방송부 여론 조사", unit:"6-1 수학 4. 비와 비율", key:"s61-ratio-v1", welcome:"우리 반 방송부 여론 조사에 온 것을 환영해요", intro:"한빛초등학교 6학년 3반 방송부 ‘한빛 소식’ 친구들과 체험 부스·간식 꾸러미·미숫가루 음료·방송 화면·우리 동네 지도·퀴즈 대결·선거 투표율·문구점 할인율을 취재하며 두 양의 비교, 비와 비율, 백분율을 알아봐요."};
//@@UNIT
/* =========================================================
   6-1 수학 4. 비와 비율 — 단원 조작 부품 (앞글자 ra4) · 이야기 버전
   교과서 버전(u4-ratio.tb.js)의 ra4 부품을 복사해 쓰고, 단추로 확인하던 부품(빈칸 줄·비 만들기·모눈 직사각형·가전제품 고르기)은
   아래 '이야기 버전' 묶음에서 저절로 확인하게 다시 썼어요.
   ra4Chain  빈칸 줄(수·분수·비 □ : □·고르기 칩)          ra4Seq   여러 활동을 차례로
   ra4Build  묶음(체험 부스·꾸러미·음료·물감)을 하나씩 더하며 두 양 비교하기
   ra4Slots  양 카드를 비교하는 양·기준량 자리에 놓아 비 만들기     ra4Candy 막대사탕 나누어 주기(눌러서)
   ra4Comp   두 막대와 수직선으로 몇 배인지 재기          ra4Rect  모눈에서 화면 모서리를 끌어 가로·세로 바꾸기
   ra4Map    두 지도에 같은 거리 그리기(축척)           ra4Calc  계산기
   ra4Tape2  이중 테이프(양 ↔ 백분율)                  ra4Grid  모눈 칸 색칠하기
   ra4Link   비율이 같은 것끼리 잇기                    ra4Save  줄일 가전제품 고르기
   ra4Make   비율 비교 문제 만들기                      ra4sStudio 방송부 기획 보드 둘러보기
   ra4Same · ra4Memory · ra4High   9차시 '비율이 같은 카드를 찾아요!' 퀴즈쇼 놀이
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
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done( 을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return ra4Quiz0(body, ra4A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return ra4Blanks0(body, ra4A(api), parts, o); };

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

/* ---------- 그림 조각 ---------- */
function ra4Icon0(kind, x, y, s, lab) {
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
  /* 끝나면 ra4Finish가 api.done( 을 불러요 */
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
  const plus = h("button", { onclick: () => { if (fin || n >= max) return; n++; after(); } }, opt.more || `＋ ${opt.what} 하나 더`);
  const minus = h("button", { onclick: () => { if (fin || n <= 1) return; n--; after(); } }, opt.less || `－ ${opt.what} 하나 빼기`);
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

/* ---------- ④ 초콜릿 먹기 ---------- opt: {total, eat, ask, ok} */

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
      if (v[i]) svg.append(txt(x0 + v[i] * cm, y + 44, `${v[i]} cm → ${v[i] * M.per} m`, 15, { fill: ok ? "#2E8B57" : "#C8472E" }));
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

/* ---------- ⑭ 9차시 놀이 ----------
   이 앱이 정한 비와 비율 카드 24장(교과서 부록 카드는 지도서에 없어서 새로 정함): 비율이 같은 카드가 꼭 한 장씩 있어요(12쌍). */
/* 지도서의 '또 다른 놀이' 비율 카드 24장 */
const RA4_HIGH = ["[1/10]", "[35/100]", "[22/25]", "[3/20]", "[1/5]", "[27/100]", "[1/4]", "[7/10]", "0.09", "0.36", "0.8", "0.45", "0.95", "0.56", "0.64", "0.76", "5 %", "35 %", "8 %", "40 %", "90 %", "16 %", "50 %", "58 %"];
const ra4Shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const ra4Why = (a, b) => `${a}의 비율은 ${ra4Say(ra4V(a))}, ${b}의 비율은 ${ra4J(ra4Say(ra4V(b)), "이에요")}.`;

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
    score.innerHTML = ""; score.append(h("span", {}, `나 ${me}장`), h("span", {}, `컴퓨터 ${com}장`), h("span", {}, `남은 카드 ${owner.filter(o => !o).length}장`), h("span", {}, turn === "me" ? "▶ 내 차례" : turn === "com" ? "▶ 컴퓨터 차례" : "놀이 끝"));
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
    const end = r >= R, rr = end ? R - 1 : r, up = flipped || end;
    ruleEl.textContent = end ? `${R}판을 모두 했어요. 마지막 판의 카드예요.` : `${r + 1}판 / ${R}판 · 규칙: 비율이 가장 ${rule(r) === "high" ? "높은" : "낮은"} 사람이 카드를 모두 가져가요.`;
    names.forEach((nm, i) => area.append(h("div", { class: "ra4pl", onclick: () => pick(i) }, nm, h("div", { class: "ra4card " + (up ? "ra4up" : "ra4back"), "data-t": up ? deck[rr * 4 + i] : "" }, up ? deck[rr * 4 + i] : "?"))));
    score.innerHTML = ""; names.forEach((nm, i) => score.append(h("span", {}, `${nm} ${got[i]}장`)));
    flipBtn.disabled = flipped || r >= R;
  };
  const pick = i => {
    if (!flipped || r >= R) return;
    api.tryOnce(); const cs = deck.slice(r * 4, r * 4 + 4), v = cs.map(ra4V);
    let b = 0; v.forEach((x, j) => { if (rule(r) === "high" ? ra4Lt(v[b], x) : ra4Lt(x, v[b])) b = j; });
    if (i !== b) return api.fail(`${cs.map(c => `${c} → ${ra4Dec(ra4V(c)) || ra4Fr(ra4V(c))}`).join(", ")}. 같은 표현(소수)으로 바꾸어 비교해 봐요.`, `${names[i]}`);
    got[b] += 4; msg.textContent = `맞아요! ${names[b]}의 카드 ${cs[b]}${cs[b] === ra4Dec(v[b]) ? "" : `(= ${ra4Dec(v[b])})`}의 비율이 가장 ${rule(r) === "high" ? "높아요" : "낮아요"}. ${ra4J(names[b], "이가")} 카드 4장을 가져가요.`;
    r++; flipped = false;
    if (r >= R) { draw(); const mx = Math.max(...got), win = names.filter((_, j) => got[j] === mx); return api.done(names.map((n, j) => `${n} ${got[j]}장`).join(", "), `놀이 끝! ${ra4J(win.join(", "), "이가")}${win.length > 1 ? " 함께" : ""} 가장 많이 가져갔어요.`); }
    draw();
  };
  api.provide({ words: ["소수로 바꾸어", "가장 높은", "가장 낮은"], answers: [] });
  body.append(ruleEl, area, h("div", { class: "ra4tools" }, flipBtn), msg, score); draw();
}

/* ---------- 정해진 그림 ---------- */
/* 휴양림 둘러보기: 장면의 곳곳을 눌러 비교할 수 있는 두 양을 찾아요 */

/* ===================== 이야기 버전에서 새로 쓰거나 바꾼 부품 =====================
   '확인하기' 단추 없이 ra4Auto(=autoRun)로 저절로 확인해요(입력 0.9초 · 고르기 0.26초 · 끌기·누르기 1.2초).
   한 계단에 활동이 둘이면(엔진 hj-multi) 부품 몸통에 api.done( 이 있어야 하나로 세요 — 그래서 부품마다 그 표시를 적어 두었어요. */
(function ra4sStyle() {
  const s = document.createElement("style"); s.id = "ra4s-style";
  s.textContent = `
.ra4s-note{background:#FFFDF6;border:2px solid var(--line);border-radius:.8em;padding:.5em .9em;margin:.3em 0 .6em;word-break:keep-all}
.ra4s-note b{font-family:Jua,sans-serif;font-weight:400;color:var(--night)}
.ra4s-note ul{margin:.3em 0 .1em 1.2em;padding:0}
.ra4s-note li{margin:.12em 0}
`;
  document.head.append(s);
})();
/* 저절로 확인: ready() 다 했는지 · sig() 지금 상태 · judge() 맞으면 true. 같은 상태로는 다시 세지 않아요. */
function ra4Auto(root, ready, sig, judge) {
  let last = null, fin = false;
  const run = () => { if (fin) return true; if (!root.isConnected) { fin = true; return true; } const s = sig(); if (s === last) return false; last = s; if (judge() === true) fin = true; return fin; };
  const A = {}; [260, 900, 1200].forEach(w => { A[w] = autoRun(ready, sig, run, w); });
  const kick = w => A[w || 900]();
  root.addEventListener("input", () => kick(900));
  root.addEventListener("change", () => kick(900));
  root.addEventListener("focusout", e => { if (e.target.matches && e.target.matches("input")) setTimeout(() => kick(900), 0); });
  root.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches && e.target.matches("input")) { e.preventDefault(); e.target.blur(); } });
  root.addEventListener("click", e => { const b = e.target.closest && e.target.closest("button"); if (b) kick(b.classList.contains("opt") ? 260 : 1200); });
  root.addEventListener("pointerup", e => { if (e.target.closest && e.target.closest("svg")) kick(1200); });
  return kick;
}
const ra4Dg = s => String(s).replace(/[^0-9]/g, "").length;

/* ---------- ① 빈칸 줄 (저절로 확인) ----------
   lines: [ 토막… ] 또는 {t:"이름표", p:[토막…]}
   토막: "글" | {i:"답"(수·분수·소수, 값이 같으면 정답), why} | {f:"3/10"(분수 칸, 값이 같으면 정답), why} | {r:[a,b](비 칸), why} | {c:[…], a:번호, why:{번호:"까닭"}} */
function ra4Chain(body, api, lines, opt = {}) {
  /* 다 맞으면 api.done( 을 불러요 */
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
  const judge1 = C => {
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
  /* 다 썼는지: 쓰고 있는 칸은 답만큼 숫자를 쓸 때까지 기다려요 */
  const filled = C => {
    const act = document.activeElement;
    const one = (inp, want) => { const v = inp.value.trim(); if (!v || /[.\/]$/.test(v)) return false; return act !== inp || ra4Dg(v) >= ra4Dg(want); };
    if (C.k === "i") return one(C.el, C.t.i);
    if (C.k === "f") { const [n, d] = C.el.querySelectorAll("input"); const [fn, fd] = String(C.t.f).split("/"); return one(n, fn) && one(d, fd); }
    if (C.k === "r") { const [a, b] = C.el.querySelectorAll("input"); return one(a, C.t.r[0]) && one(b, C.t.r[1]); }
    return C.sel != null;
  };
  const sig = () => ctl.map(C => C.k === "c" ? String(C.sel) : C.el.tagName === "INPUT" ? C.el.value.trim() : [...C.el.querySelectorAll("input")].map(x => x.value.trim()).join("/")).join("§");
  const judge = () => {
    api.tryOnce(); let bad = null; const got = [];
    ctl.forEach(C => {
      const r = judge1(C); got.push(r.v);
      const col = r.ok ? "var(--ok)" : "var(--no)";
      if (C.k === "c") { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(r.ok ? "good" : "bad"); }); }
      else if (C.el.paint) C.el.paint(col); else C.el.style.borderColor = col;
      if (!r.ok && !bad) bad = { C, r };
    });
    if (!bad) { api.done(ra4Plain(got.join(" / ")), opt.ok || "잘했어요!"); return true; }
    const t = bad.C.t, key = bad.C.k === "c" ? String(bad.C.sel) : String(bad.r.v).replace(/[\s,]/g, "");
    const why = t.why && (t.why[key] || t.why[String(bad.r.v)]);
    api.fail(why || opt.bad || "빨간 칸을 다시 생각해 봐요.", ra4Plain(got.join(" / ")));
    return false;
  };
  wrap.ra4ctl = ctl;
  body.append(wrap);
  ra4Auto(wrap, () => ctl.every(filled), sig, judge);
  return wrap;
}

/* ---------- 그림 조각 (이야기 버전에서 더한 것: 마이크·스피커·건전지·쿠키·주스·막대사탕·미숫가루·우유·물감) ---------- */
const RA4S_ICONS = ["mic", "speaker", "battery", "cookie", "juice", "candy", "misu", "milk", "redpaint", "whitepaint", "empty"];
function ra4Icon(kind, x, y, s, lab) {
  if (!RA4S_ICONS.includes(kind)) return ra4Icon0(kind, x, y, s, lab);
  const g = svgEl("g", { transform: `translate(${x},${y})` });
  const A = (t, a) => { const e = svgEl(t, a); g.append(e); return e; };
  const cup = (fill, st) => { A("path", { d: `M${-s * .32},${-s * .34}H${s * .32}L${s * .24},${s * .36}H${-s * .24}Z`, fill, stroke: st, "stroke-width": 2 }); A("path", { d: `M${-s * .32},${-s * .34}H${s * .32}`, stroke: st, "stroke-width": 3 }); };
  if (kind === "mic") {
    A("rect", { x: -s * .07, y: -s * .04, width: s * .14, height: s * .44, rx: s * .05, fill: "#4A4F5A", stroke: "#22262E", "stroke-width": 1.5 });
    A("circle", { cy: -s * .2, r: s * .19, fill: "#B9C2CF", stroke: "#22262E", "stroke-width": 2 });
    A("path", { d: `M${-s * .14},${-s * .2}H${s * .14}M0,${-s * .36}V${-s * .04}`, stroke: "#6A7380", "stroke-width": 1.2 });
  } else if (kind === "speaker") {
    A("rect", { x: -s * .26, y: -s * .38, width: s * .52, height: s * .76, rx: s * .06, fill: "#3E4652", stroke: "#1E232B", "stroke-width": 2 });
    A("circle", { cy: -s * .17, r: s * .1, fill: "#9AA6B6", stroke: "#1E232B", "stroke-width": 1.5 });
    A("circle", { cy: s * .14, r: s * .17, fill: "#9AA6B6", stroke: "#1E232B", "stroke-width": 1.5 });
    A("circle", { cy: s * .14, r: s * .06, fill: "#3E4652" });
  } else if (kind === "battery") {
    A("rect", { x: -s * .14, y: -s * .34, width: s * .28, height: s * .68, rx: s * .04, fill: "#F2B33D", stroke: "#8A5A10", "stroke-width": 2 });
    A("rect", { x: -s * .14, y: s * .06, width: s * .28, height: s * .28, fill: "#3A3A3A" });
    A("rect", { x: -s * .06, y: -s * .41, width: s * .12, height: s * .07, fill: "#8A5A10" });
  } else if (kind === "cookie") {
    A("circle", { r: s * .32, fill: "#E3B26B", stroke: "#8A5A20", "stroke-width": 2 });
    [[-.12, -.1], [.1, -.14], [.02, .08], [-.14, .14], [.16, .1]].forEach(([i, j]) => A("circle", { cx: i * s, cy: j * s, r: s * .045, fill: "#5A3418" }));
  } else if (kind === "juice") {
    A("path", { d: `M${-s * .1},${-s * .45}H${s * .1}V${-s * .3}L${s * .2},${-s * .16}V${s * .42}H${-s * .2}V${-s * .16}L${-s * .1},${-s * .3}Z`, fill: "#FFB547", stroke: "#B5650F", "stroke-width": 2 });
    A("rect", { x: -s * .2, y: -s * .02, width: s * .4, height: s * .2, fill: "#fff", "fill-opacity": .75 });
  } else if (kind === "candy") {
    A("line", { x1: 0, y1: s * .02, x2: 0, y2: s * .44, stroke: "#C9B79C", "stroke-width": 3 });
    A("circle", { cy: -s * .16, r: s * .22, fill: "#F48FB1", stroke: "#B03A6A", "stroke-width": 2 });
    A("path", { d: `M0,${-s * .16}m${-s * .12},0a${s * .12},${s * .12} 0 1,1 ${s * .12},${s * .12}`, fill: "none", stroke: "#fff", "stroke-width": 2.5 });
  } else if (kind === "empty") {
    A("circle", { cy: -s * .06, r: s * .26, fill: "none", stroke: "#B7A99A", "stroke-width": 2, "stroke-dasharray": "4 4" });
  } else if (kind === "misu") cup("#E8D2A6", "#9A7A3A");
  else if (kind === "milk") cup("#FFFFFF", "#7A8FA6");
  else if (kind === "redpaint") cup("#E2574C", "#962A21");
  else if (kind === "whitepaint") cup("#FFFFFF", "#8A8F96");
  if (lab) g.append(txt(0, s * .5, lab, Math.max(13, s * .3), { fill: "#3A2A1A" }));
  return g;
}

/* ---------- ③ 비 만들기: 양 카드를 자리에 놓기 (두 칸을 채우면 저절로 확인) ----------
   opt: {chips:[{t:"미숫가루 1컵", v:1, nm:"미숫가루의 양"}], tasks:[{q:"우유의 양에 대한 미숫가루의 양의 비", a:[0,1]}], ok} */
function ra4Slots(body, api, opt) {
  /* 모든 문장을 비로 나타내면 api.done( 을 불러요 */
  const chips = opt.chips; let k = 0, pick = null, fin = false; const put = [null, null];
  const root = h("div");
  const phrase = h("div", { class: "ra4phrase" }, "​");
  const row = h("div", { class: "ra4chips" });
  const cbtn = chips.map((c, i) => h("button", { class: "ra4chip", onclick: () => { if (fin) return; pick = pick === i ? null : i; cbtn.forEach((b, j) => b.classList.toggle("ra4pk", j === pick)); } }, c.t));
  cbtn.forEach(b => row.append(b));
  const lab = [h("small", {}, "​"), h("small", {}, "​")];
  const sl = [0, 1].map(s => h("button", { class: "ra4slot", "aria-label": s ? "기호 : 의 오른쪽" : "기호 : 의 왼쪽", onclick: () => {
    if (fin) return;
    if (pick == null) { if (put[s] != null) { put[s] = null; paint(); } else api.hint("먼저 위의 양 카드를 눌러 골라요."); return; }
    put[s] = pick; pick = null; cbtn.forEach(b => b.classList.remove("ra4pk")); paint();
  } }, "□"));
  const paint = () => sl.forEach((b, s) => { b.textContent = put[s] == null ? "□" : String(chips[put[s]].v); b.classList.toggle("ra4full", put[s] != null); });
  const log = h("div", { class: "ra4read" }, "​");
  const show = () => { phrase.textContent = `${k + 1}. ${opt.tasks[k].q}`; put[0] = put[1] = null; lab.forEach(l => { l.textContent = "​"; }); paint(); };
  let kick = null;
  const judge = () => {
    if (fin) return true;
    api.tryOnce(); const T = opt.tasks[k];
    const got = `${chips[put[0]].v} : ${chips[put[1]].v}`;
    if (put[0] === T.a[1] && put[1] === T.a[0]) { api.fail(T.why || `‘~에 대한’ 앞에 있는 ${ra4J(chips[T.a[1]].nm, "이가")} 기준량이에요. 기준량은 기호 : 의 오른쪽에 써요.`, got); return false; }
    if (put[0] !== T.a[0] || put[1] !== T.a[1]) { api.fail(`‘${T.q}’에서 비교하는 두 양을 다시 찾아봐요.`, got); return false; }
    lab[0].textContent = "비교하는 양"; lab[1].textContent = "기준량";
    log.append(h("div", {}, `✔ ${T.q}: ${got}`));
    if (k === opt.tasks.length - 1) { fin = true; api.done(log.textContent, opt.ok); return true; }
    api.hint(`○ ${got} — 맞아요! 기호 : 의 오른쪽이 기준량이에요. 이어서 아래 문장도 비로 나타내 봐요.`);
    k++; setTimeout(() => { if (ra4Alive(root)) show(); }, 900); return false;
  };
  api.provide({ words: ["~에 대한", "기준량", "비교하는 양", "기호 : 의 오른쪽"], answers: opt.tasks.map(T => `${chips[T.a[0]].v} : ${chips[T.a[1]].v}`) });
  root.append(h("p", { class: "ra4note" }, "양 카드를 누른 뒤 □를 눌러 놓아요. 두 칸을 다 채우면 저절로 확인해요. 놓은 카드를 다시 빼려면 □를 눌러요."), row, phrase,
    h("div", { class: "ra4slots" }, h("div", { class: "ra4sl" }, sl[0], lab[0]), h("span", { class: "ra4colon" }, ":"), h("div", { class: "ra4sl" }, sl[1], lab[1])), log);
  body.append(root);
  kick = ra4Auto(root, () => !fin && put[0] != null && put[1] != null, () => `${k}|${put.join(",")}`, judge);
  show();
}

/* ---------- ④ 막대사탕 나누어 주기 ---------- opt: {total, eat, name, ask, ok} */
function ra4Candy(body, api, opt) {
  /* 알맞게 나누어 주면 ra4Finish가 api.done( 을 불러요 */
  const N = opt.total, gone = new Set(), nm = opt.name || "막대사탕"; let fin = false;
  const cols = 6, S = 84;
  const svg = makeSvg(cols * S + 20, Math.ceil(N / cols) * 84 + 20); svg.setAttribute("class", "ra4fig"); svg.style.maxWidth = "540px";
  const read = h("div", { class: "ra4read" }, "​");
  const draw = () => {
    svg.innerHTML = "";
    for (let i = 0; i < N; i++) {
      const x = 10 + (i % cols) * S + S / 2, y = 10 + Math.floor(i / cols) * 84 + 42;
      const g = svgEl("g", { style: fin ? "cursor:default" : "cursor:pointer" });
      g.append(svgEl("rect", { x: x - S / 2 + 4, y: y - 38, width: S - 8, height: 76, fill: "#FFFDF6" }), ra4Icon(gone.has(i) ? "empty" : "candy", x, y, 72));
      g.addEventListener("click", () => { if (fin) return; gone.has(i) ? gone.delete(i) : gone.add(i); after(); });
      svg.append(g);
    }
    read.textContent = `처음 ${nm} ${N}개 · 나누어 준 ${nm} ${gone.size}개 · 남은 ${nm} ${N - gone.size}개`;
  };
  const after = () => {
    draw();
    if (gone.size === opt.eat) { fin = true; draw(); ra4Finish(body, api, opt, `나누어 준 ${opt.eat}개, 남은 ${N - opt.eat}개`, `${nm} ${opt.eat}개를 나누어 주었어요. 남은 ${nm}은 ${N - opt.eat}개예요.`); }
    else if (gone.size > opt.eat) api.hint(`${opt.eat}개만 나누어 줘요. 나누어 준 것을 다시 누르면 되돌릴 수 있어요.`);
  };
  api.provide({ words: RA4_WORDS, answers: [] });
  body.append(h("p", { class: "ra4note" }, `나누어 줄 ${nm}을 눌러요. 누른 것은 빈자리로 바뀌어요.`), svg, read); draw();
}

/* ---------- ⑥ 모눈 직사각형 (끌기를 멈추면 저절로 확인) ----------
   opt: {W, H, w0, h0, nw, nh, base:"w"(가로가 기준량), tasks:[{goal, test:(w,h)=>bool, why:(w,h)=>글}], ok} */
function ra4Rect(body, api, opt) {
  /* 목표를 모두 이루면 api.done( 을 불러요 */
  const W = opt.W || 12, Hh = opt.H || 9, u = 40, ox = 100, oy = 20;
  let w = opt.w0, hh = opt.h0, k = 0, fin = false, kick = null;
  const root = h("div");
  const svg = makeSvg(ox + W * u + 30, oy + Hh * u + 44); svg.setAttribute("class", "ra4fig"); svg.style.maxWidth = "620px";
  const goal = h("div", { class: "ra4phrase" }, "​"), read = h("div", { class: "ra4read" }, "​"), log = h("div", { class: "ra4note" });
  const nw = opt.nw || "가로", nh = opt.nh || "세로";
  const draw = () => {
    svg.innerHTML = "";
    for (let i = 0; i <= W; i++) svg.append(svgEl("line", { x1: ox + i * u, y1: oy, x2: ox + i * u, y2: oy + Hh * u, stroke: "#DCE4E0", "stroke-width": 1 }));
    for (let j = 0; j <= Hh; j++) svg.append(svgEl("line", { x1: ox, y1: oy + j * u, x2: ox + W * u, y2: oy + j * u, stroke: "#DCE4E0", "stroke-width": 1 }));
    const by = oy + Hh * u;
    svg.append(svgEl("rect", { x: ox, y: by - hh * u, width: w * u, height: hh * u, fill: opt.fill || "#CFE6FA", "fill-opacity": .85, stroke: "#2B6FB8", "stroke-width": 3 }));
    svg.append(txt(ox + w * u / 2, by + 22, `${nw} ${w} cm`, 17, { fill: "#4A5A55" }));
    svg.append(txt(ox - 8, by - hh * u / 2, `${nh} ${hh} cm`, 17, { "text-anchor": "end", fill: "#4A5A55" }));
    svg.append(svgEl("circle", { cx: ox + w * u, cy: by - hh * u, r: 12, fill: fin ? "#2E8B57" : "#C8472E", stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }));
    const q = ra4Q(hh, w), d = ra4Dec(q);
    read.textContent = `${nw} ${w} cm, ${nh} ${hh} cm → ${nw}에 대한 ${nh}의 비 ${hh} : ${w}, 비율 [${hh}/${w}]${d ? " = " + d : ""}`;
  };
  const show = () => { goal.textContent = `${k + 1}. ${opt.tasks[k].goal}`; };
  const setFrom = p => { if (fin) return; w = Math.max(1, Math.min(W, Math.round((p.x - ox) / u))); hh = Math.max(1, Math.min(Hh, Math.round((oy + Hh * u - p.y) / u))); draw(); };
  dragOn(svg, p => { if (fin) return false; setFrom(p); return true; }, setFrom);
  const judge = () => {
    if (fin) return true;
    const T = opt.tasks[k];
    if (!T.test(w, hh)) { api.hint("△ " + (T.why ? T.why(w, hh) : "모양을 다시 바꿔 봐요.")); return false; }
    api.tryOnce(); log.append(h("div", {}, `✔ ${T.goal.replace(/만들어 보세요\.$/, "만들었어요")} → ${nw} ${w} cm, ${nh} ${hh} cm`));
    if (k === opt.tasks.length - 1) { fin = true; draw(); api.done(log.textContent, typeof opt.ok === "function" ? opt.ok(w, hh) : opt.ok); return true; }
    api.hint("○ 맞아요! 아래 목표도 해 봐요."); k++; show(); setTimeout(() => kick && kick(1200), 0); return false;
  };
  api.provide({ words: ["가로", "세로", "기준량", "비율"], answers: [] });
  root.append(goal, svg, h("p", { class: "ra4note" }, "빨간 점을 끌어 모양을 바꿔요. 손을 떼면 저절로 확인해요."), read, log);
  body.append(root);
  kick = ra4Auto(root, () => !fin, () => `${k}|${w}|${hh}`, judge);
  show(); draw();
}

/* ---------- ⑫ 줄일 가전제품 고르기 ----------
   opt: {items:[{name, kwh}], plan:[번호…](정해진 계획 — 다 고르면 저절로 확인) 또는 없음(마음대로 — '이렇게 줄일래요' 단추), ask:(합)=>[…], ok} */
function ra4Save(body, api, opt) {
  /* 고르기를 마치면 ra4Finish가 api.done( 을 불러요 */
  const sel = new Set(); let fin = false;
  const root = h("div");
  const grid = h("div", { class: "ra4apps" });
  const sum = () => [...sel].reduce((a, i) => a + opt.items[i].kwh, 0);
  const read = h("div", { class: "ra4read" }, "​");
  const btns = opt.items.map((it, i) => h("button", { class: "ra4app", onclick: e => { if (fin) return; sel.has(i) ? sel.delete(i) : sel.add(i); e.currentTarget.classList.toggle("ra4pk", sel.has(i)); show(); } }, it.name, h("b", {}, `${it.kwh} kWh 줄이기`)));
  btns.forEach(b => grid.append(b));
  const show = () => { read.textContent = `고른 가전제품 ${sel.size}개 · 줄이려는 전기 사용량은 모두 몇 kWh일까요?`; };
  const commit = () => {
    if (fin) return true;
    const got = [...sel].map(i => opt.items[i].name).join(", ") || "-";
    if (opt.plan) {
      api.tryOnce();
      const P = new Set(opt.plan);
      if (sel.size !== P.size || [...sel].some(i => !P.has(i))) { api.fail(`계획에 있는 가전제품은 ${ra4J(opt.plan.map(i => opt.items[i].name).join(", "), "이에요")}.`, got); return false; }
    } else if (!sel.size) { api.hint("줄일 가전제품을 하나 이상 골라요."); return false; }
    fin = true; btns.forEach(b => { b.disabled = true; }); if (go) go.disabled = true;
    const s = sum();
    ra4Finish(body, api, Object.assign({}, opt, { ask: opt.ask(s, [...sel]) }), `${got} (${s} kWh)`, "줄일 가전제품을 골랐어요.");
    return true;
  };
  const go = opt.plan ? null : h("button", { class: "big", onclick: () => commit() }, opt.btn || "이렇게 줄일래요");
  api.provide({ words: ["kWh", "기준량", "비교하는 양", "백분율"], answers: [] });
  root.append(grid, read); if (go) root.append(h("div", { class: "actions" }, go));
  body.append(root); show();
  if (opt.plan) ra4Auto(root, () => !fin && sel.size === opt.plan.length, () => [...sel].sort((x, y) => x - y).join(","), commit);
}

/* ---------- ⑬ 비율 비교 문제 만들기 ----------
   달리기 기록(달린 거리·걸린 시간)을 바꾸어 새 문제를 만들고 직접 풀어요. opt: {base:[[이름, 거리, 시간], …]} */
function ra4Make(body, api, opt) {
  /* 만든 문제를 풀면 ra4Chain이 api.done( 을 불러요 */
  const D = opt.base;
  const ins = D.map(p => [ra4Inp(false, p[0] + " 거리"), ra4Inp(false, p[0] + " 시간")]);
  ins.forEach((p, i) => { p[0].value = D[i][1]; p[1].value = D[i][2]; });
  const form = h("div", {}, D.map((p, i) => h("div", { class: "ra4mk" }, `${ra4J(p[0], "은는")}`, ins[i][0], "m를 달리는 데", ins[i][1], "초가 걸렸어요.")));
  const out = h("div");
  let fin = false;
  const make = h("button", { class: "big", onclick: () => {
    if (fin) return;
    const v = ins.map(p => p.map(x => x.value.trim()));
    if (v.some(p => p.some(s => !/^\d+$/.test(s) || +s === 0 || +s > 9999))) return api.hint("거리와 시간은 0이 아닌 자연수(9999까지)로 써요.");
    if (v.every((p, i) => +p[0] === D[i][1] && +p[1] === D[i][2])) return api.hint("보기와 다른 수로 조건을 바꾸어 새 문제를 만들어요.");
    const r = v.map(p => ra4Q(+p[0], +p[1]));
    if (ra4EqQ(r[0], r[1])) return api.hint(`두 사람의 비율이 ${ra4J(ra4Fr(r[0]), "으로")} 같아져서 누가 더 높은지 비교할 수 없어요. 수를 바꿔 봐요.`);
    fin = true; make.disabled = true; ins.flat().forEach(x => { x.disabled = true; });
    const hi = ra4Lt(r[0], r[1]) ? 1 : 0;
    out.append(h("div", { class: "ra4phrase" }, `내가 만든 문제: ${ra4J(D[0][0], "은는")} ${v[0][0]} m를 달리는 데 ${v[0][1]}초가 걸렸고, ${ra4J(D[1][0], "은는")} ${v[1][0]} m를 달리는 데 ${v[1][1]}초가 걸렸습니다. 걸린 시간에 대한 달린 거리의 비율이 더 높은 사람은 누구인가요?`));
    ra4Chain(out, api, [
      [`${D[0][0]}의 비율: ${v[0][0]} ÷ ${v[0][1]} = `, { i: ra4Dec(r[0]) || `${r[0].n}/${r[0].d}`, w: true }],
      [`${D[1][0]}의 비율: ${v[1][0]} ÷ ${v[1][1]} = `, { i: ra4Dec(r[1]) || `${r[1].n}/${r[1].d}`, w: true }],
      ["비율이 더 높은 사람: ", { c: [D[0][0], D[1][0]], a: hi }]],
      { ok: `${D[hi][0]}의 비율이 더 높아요. 같은 시간 동안 더 멀리 달렸다는 뜻이에요. 내가 만든 문제를 친구와 바꾸어 풀어 봐요.` });
    out.append(h("p", { class: "ra4note" }, "비율이 나누어떨어지지 않으면 분수(예: 7/3)로 써도 돼요."));
    ra4Go(out);
  } }, "이 조건으로 문제 만들기");
  api.provide({ words: ["걸린 시간에 대한 달린 거리의 비율", "(달린 거리) ÷ (걸린 시간)"], answers: [] });
  body.append(form, h("div", { class: "actions" }, make), out);
}

/* ---------- 9차시 놀이 카드 ----------
   이야기 버전의 비와 비율 카드 24장(이 앱이 정함): 비율이 같은 카드가 꼭 한 장씩 있어요(12쌍). */
const RA4_CARDS = ["2 : 5", "40 %", "3 : 4", "0.75", "9 : 30", "[3/10]", "[1/4]", "25 %", "7 : 10", "70 %", "0.15", "[3/20]",
  "8 : 5", "1.6", "[2/25]", "8 %", "0.9", "90 %", "12 : 20", "[3/5]", "0.05", "[1/20]", "4 : 25", "16 %"];
const RA4_CV = RA4_CARDS.map(ra4V);
RA4_CV.forEach((v, i) => { const n = RA4_CV.filter((w, j) => j !== i && ra4EqQ(v, w)).length; if (n !== 1) throw new Error("비율 카드 짝 오류: " + RA4_CARDS[i]); });

/* ---------- 이야기 그림 ---------- */
function ra4sNote(title, lines) { return h("div", { class: "ra4s-note" }, h("b", {}, title), h("ul", {}, lines.map(l => h("li", {}, l)))); }
const RA4S_PLAN = ["🎤 방송 체험 부스: 한 번 열 때 6학년 도우미 4명, 저학년 참가자 8명", "🥛 건강 코너: 미숫가루 1컵에 우유 3컵을 섞은 음료 소개", "📺 화면 이야기: 교실 텔레비전 화면과 휴대폰 화면의 모양 비교",
  "🏀 학급 대항 농구 대회: 지호는 슛 16번 중 12번 성공", "🗳️ 전교 어린이 회장 선거: 6학년 160명 중 136명이 투표", "🏷️ 문구점 할인 행사: 3000원짜리 스케치북을 2400원에"];
/* 방송실 기획 보드 둘러보기: 곳곳을 눌러 비교할 수 있는 두 양을 찾아요 */
function ra4sStudio(body, api, opt) {
  /* 여섯 곳을 모두 누르면 api.done( 을 불러요 */
  const SP = [
    { x: 110, y: 112, k: "mic", t: "방송 체험 부스", d: "체험 부스를 한 번 열 때 6학년 도우미 4명이 저학년 참가자 8명을 도와요. → 도우미 수와 참가자 수를 비교해요." },
    { x: 330, y: 92, k: "tv", t: "방송 화면", d: "교실 텔레비전 화면은 옆으로 길고, 휴대폰으로 찍은 영상 화면은 위아래로 길어요. → 화면의 가로와 세로를 비교해요." },
    { x: 560, y: 100, k: "vote", t: "회장 선거 소식", d: "6학년 학생 160명 중 136명이 투표했어요. → 전체 학생 수와 투표한 학생 수를 비교해요." },
    { x: 250, y: 232, k: "misu", t: "건강 코너", d: "미숫가루 1컵에 우유 3컵을 섞어 음료를 만들어요. → 미숫가루의 양과 우유의 양을 비교해요." },
    { x: 440, y: 236, k: "hoop", t: "농구 대회 소식", d: "지호는 슛을 16번 던져서 12번 넣었어요. → 던진 횟수와 성공한 횟수를 비교해요." },
    { x: 600, y: 240, k: "tag", t: "할인 행사 소식", d: "3000원짜리 스케치북을 600원 할인하여 2400원에 팔아요. → 판매 금액과 할인 금액을 비교해요." }];
  const seen = new Set(); let fin = false;
  const svg = makeSvg(680, 340); svg.setAttribute("class", "ra4fig");
  const info = h("div", { class: "ra4phrase" }, "기획 보드의 동그라미를 눌러 보세요.");
  const read = h("div", { class: "ra4read" }, "​");
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: 680, height: 340, fill: "#FFF6E3" }));
    svg.append(svgEl("rect", { x: 10, y: 8, width: 660, height: 324, rx: 16, fill: "#F3EAD7", stroke: "#B9A27A", "stroke-width": 3 }));
    svg.append(svgEl("rect", { x: 22, y: 18, width: 112, height: 30, rx: 8, fill: "#E2574C" }), txt(78, 34, "방송 중", 17, { fill: "#fff" }));
    svg.append(txt(400, 34, "6학년 3반 방송부 ‘한빛 소식’ 기획 보드", 18, { fill: "#5A4A30" }));
    SP.forEach((p, i) => {
      const g = svgEl("g", { style: "cursor:pointer" });
      g.append(svgEl("circle", { cx: p.x, cy: p.y, r: 36, fill: seen.has(i) ? "#DDEDE5" : "#FFFDF6", stroke: seen.has(i) ? "#2E8B57" : "#E47A38", "stroke-width": 3 }));
      if (p.k === "hoop") { g.append(svgEl("rect", { x: p.x - 18, y: p.y - 24, width: 36, height: 24, fill: "#fff", stroke: "#5A4A30", "stroke-width": 2 }), svgEl("ellipse", { cx: p.x, cy: p.y + 4, rx: 14, ry: 5, fill: "none", stroke: "#E2574C", "stroke-width": 3 }), svgEl("circle", { cx: p.x + 10, cy: p.y + 18, r: 8, fill: "#F08A24" })); }
      else if (p.k === "tv") { g.append(svgEl("rect", { x: p.x - 24, y: p.y - 16, width: 48, height: 30, rx: 3, fill: "#2C4166", stroke: "#1E232B", "stroke-width": 2 }), svgEl("rect", { x: p.x + 8, y: p.y - 12, width: 12, height: 22, rx: 2, fill: "#9FD0F2" }), svgEl("line", { x1: p.x - 8, y1: p.y + 20, x2: p.x + 8, y2: p.y + 20, stroke: "#1E232B", "stroke-width": 3 })); }
      else if (p.k === "vote") { g.append(svgEl("rect", { x: p.x - 20, y: p.y - 8, width: 40, height: 28, fill: "#fff", stroke: "#3B6FA8", "stroke-width": 2 }), svgEl("rect", { x: p.x - 10, y: p.y - 10, width: 20, height: 4, fill: "#3B6FA8" }), svgEl("rect", { x: p.x - 7, y: p.y - 26, width: 14, height: 18, fill: "#FFF3B0", stroke: "#B48A12", "stroke-width": 1.5 })); }
      else if (p.k === "tag") { g.append(svgEl("path", { d: `M${p.x - 22},${p.y - 12}H${p.x + 10}L${p.x + 24},${p.y}L${p.x + 10},${p.y + 12}H${p.x - 22}Z`, fill: "#FFE08A", stroke: "#B48A12", "stroke-width": 2 }), txt(p.x - 4, p.y + 1, "%", 16, { fill: "#8A5A10" })); }
      else g.append(ra4Icon(p.k, p.x, p.y, 54));
      g.append(txt(p.x, p.y + 50, p.t, 14, { fill: "#2F3B33" }));
      if (seen.has(i)) g.append(svgEl("path", { d: `M${p.x + 18},${p.y - 30} l6,7 l12,-14`, stroke: "#2E8B57", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }));
      g.addEventListener("click", () => { seen.add(i); info.textContent = `${p.t}: ${p.d}`; draw(); after(); });
      svg.append(g);
    });
    read.textContent = `살펴본 곳 ${seen.size} / ${SP.length}`;
  };
  const after = () => { if (fin) return; if (seen.size === SP.length) { fin = true; api.done(`${SP.length}곳`, opt.ok || "기획 보드에서 두 양을 비교하는 소식을 모두 찾았어요."); } else api.hint(`○ ${seen.size}곳을 살펴봤어요. 남은 곳도 눌러 봐요.`); };
  api.provide({ words: ["두 양을 비교해요"], answers: [] });
  body.append(svg, info, read); draw();
}
/* 마이크 3개와 건전지 12개 */
function ra4sMicFig() {
  const s = makeSvg(600, 150); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "600px";
  for (let i = 0; i < 3; i++) s.append(ra4Icon("mic", 50 + i * 62, 76, 78));
  for (let i = 0; i < 12; i++) s.append(ra4Icon("battery", 270 + (i % 6) * 52, 42 + Math.floor(i / 6) * 66, 56));
  s.append(svgEl("line", { x1: 235, y1: 10, x2: 235, y2: 140, stroke: "#C9D4CF", "stroke-width": 2, "stroke-dasharray": "5 5" }));
  return s;
}
/* 방송 화면에 띄울 사진 세 장(가·나·다) */
function ra4sPhotoFig() {
  const s = makeSvg(640, 240); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "640px";
  const u = 22, base = 205;
  [["가", 8, 6, 60, "#CFE6FA"], ["나", 5, 8, 330, "#FBE2C8"], ["다", 4, 3, 500, "#D9EED5"]].forEach(([n, w, hh, x, c]) => {
    s.append(svgEl("rect", { x, y: base - hh * u, width: w * u, height: hh * u, fill: c, stroke: "#4A5A6A", "stroke-width": 2.5 }));
    s.append(txt(x + w * u / 2, base - hh * u / 2, n, 24));
    s.append(txt(x + w * u / 2, base + 18, `${w} cm`, 15), txt(x - 6, base - hh * u / 2, `${hh} cm`, 13, { "text-anchor": "end" }));
  });
  return s;
}
/* 매실 음료 두 컵(원액과 음료의 양) */
function ra4sJars() {
  const s = makeSvg(600, 240); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "600px";
  const jar = (x, cap, juice, nm) => {
    const W = 110, Hh = 170, y = 34, H = Hh * cap / 8;
    s.append(svgEl("rect", { x, y: y + Hh - H, width: W, height: H, fill: "#EAF3D6", stroke: "#5C7A2A", "stroke-width": 2 }));
    s.append(svgEl("rect", { x, y: y + Hh - Hh * juice / 8, width: W, height: Hh * juice / 8, fill: "#7FA33A", "fill-opacity": .8 }));
    for (let i = 1; i < cap; i++) s.append(svgEl("line", { x1: x, y1: y + Hh - Hh * i / 8, x2: x + 14, y2: y + Hh - Hh * i / 8, stroke: "#5C7A2A", "stroke-width": 1.5 }));
    s.append(txt(x + W / 2, 18, nm, 16), txt(x + W + 10, y + Hh - Hh * juice / 16, `매실 원액 ${juice}컵`, 14, { "text-anchor": "start", fill: "#3E5A12" }), txt(x + W + 10, y + Hh - H + 10, `매실 음료 ${cap}컵`, 14, { "text-anchor": "start", fill: "#4A5A55" }));
  };
  jar(40, 5, 1, "서윤"); jar(320, 8, 2, "하준");
  return s;
}
/* 특집 방송 간식: 주스 2병, 쿠키 5개 */
function ra4sTreatFig() {
  const s = makeSvg(560, 120); s.setAttribute("class", "ra4fig"); s.style.maxWidth = "560px";
  for (let i = 0; i < 2; i++) s.append(ra4Icon("juice", 50 + i * 66, 60, 70));
  for (let i = 0; i < 5; i++) s.append(ra4Icon("cookie", 250 + i * 66, 60, 66));
  return s;
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 방송부 여론 조사", lines: [
  "한빛초등학교 6학년 3반에는 학교 소식을 전하는 방송부 ‘한빛 소식’이 있어요. 방송부장 서윤이와 아나운서 지호, 기자 하준, 작가 민서, 카메라 담당 태오, 편집 담당 수아, 리포터 은재가 함께 방송을 만들어요.",
  "방송 체험 부스와 간식 꾸러미, 건강 코너의 미숫가루 음료, 방송 화면의 모양, 우리 동네 지도와 농구 대회·이어달리기 소식, 방송 퀴즈 대결, 어린이 회장 선거 투표율과 문구점 할인율에서 두 양을 비교하며 비와 비율, 백분율을 알아봐요.",
  "마지막에는 에너지 절약 캠페인 방송을 만들고, 비율 퀴즈쇼를 녹화하고, 우리 반 여론 조사 결과를 특집 방송으로 발표해요."],
  one: "우리 반 방송부 여론 조사 · 한 양을 기준으로 다른 양이 몇 배인지 기호 : 으로 나타낸 것이 비예요. 기준량에 대한 비교하는 양의 크기가 비율이고, 기준량을 100으로 할 때의 비율이 백분율(%)이에요." };
const UNIT_KEYWORDS = ["몇 배", "나눗셈으로 비교", "비", "기호 :", "대", "~에 대한", "기준량", "비교하는 양", "비율", "(비교하는 양) ÷ (기준량)", "분수", "소수", "백분율", "%", "퍼센트"];

const LESSONS = [
{
  id: "s1", no: 1, title: "방송부 첫 회의 ― 무엇을 비교할까요", soop: "개념 찾기(S)",
  question: "학교 소식을 전할 때 두 양을 비교하는 일에는 무엇이 있을까요?",
  summary: "방송부가 전할 소식에는 체험 부스의 도우미 수와 참가자 수, 음료의 미숫가루와 우유의 양, 화면의 가로와 세로, 투표한 학생 수와 전체 학생 수, 판매 금액과 할인 금액처럼 두 양을 비교하는 일이 많아요. 이 단원에서는 두 양을 나눗셈으로 비교하고, 비와 비율, 백분율로 나타내는 방법을 배워요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "6학년 3반 방송부 ‘한빛 소식’이 이번 달 방송을 준비해요! 방송부장 서윤이가 만든 기획표를 보고, 세 칸에 써서 붙여요.", hints: ["기획표에서 두 가지 양이 함께 나오는 곳을 찾아봐요.", "‘4명과 8명’, ‘160명 중 136명’처럼 두 수를 견줄 수 있는 곳을 떠올려요."],
      render: (b, a) => { b.append(ra4sNote("📻 한빛 소식 이번 달 방송 기획표", RA4S_PLAN));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "기획표에 ~이 보여요", hint: "기획표에서 보이는 것", ex: ["체험 부스에 6학년 도우미 4명과 저학년 참가자 8명이 보여요.", "6학년 160명 중 136명이 투표했다는 소식이 보여요."] },
          { t: "생각해요", e: "💭", ph: "~을 비교할 수 있을 것 같아요", hint: "비교할 수 있는 두 양", ex: ["참가자 수가 도우미 수의 몇 배인지 비교할 수 있을 것 같아요.", "스케치북 가격이 얼마나 많이 내렸는지 비교할 수 있을 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 나타낼까?", hint: "궁금한 것", ex: ["투표한 학생이 전체의 얼마만큼인지 어떻게 나타낼까?", "슛을 많이 던진 사람과 적게 던진 사람의 실력은 어떻게 비교할까?"] }],
          { ok: "방송 기획표에는 두 양을 비교하는 소식이 가득해요! 이 단원에서 비교하는 방법을 하나씩 알아봐요." }); } },
    { name: "그려 보기 — 기획 보드 둘러보기", inst: "방송실 기획 보드의 소식을 모두 눌러, 어떤 두 양을 비교할 수 있는지 살펴보세요.", hints: ["동그라미를 눌러요. 여섯 곳을 모두 눌러 봐요.", "소식마다 함께 나오는 두 가지 수를 찾아봐요."],
      render: thenWhy((b, a) => ra4sStudio(b, a, { ok: "도우미 수와 참가자 수, 미숫가루와 우유의 양, 화면의 가로와 세로, 던진 횟수와 성공한 횟수, 전체 학생 수와 투표한 학생 수, 판매 금액과 할인 금액을 비교할 수 있어요." }),
        { q: "둘러본 소식 하나를 골라, 무엇과 무엇을 어떻게 비교할 수 있는지 써 보세요.", ph: "~에서는 ~와 ~를 비교해요", help: ["① 소식 하나를 골라 함께 나오는 두 수를 찾아요. → ② ‘몇 명 더 많은지’와 ‘몇 배인지’ 중 어떻게 비교할지 생각해요.", "‘~에서는 ~와 ~를 비교해요. ~은 ~보다 ~ 많고, ~의 ~배예요.’ 꼴로 써요."],
          ans: "방송 체험 부스에서는 6학년 도우미 수와 저학년 참가자 수를 비교해요. 참가자 8명은 도우미 4명보다 4명 많고, 도우미 수의 2배예요." }) },
    { name: "말해 보기 — 배운 내용 떠올리기", inst: "3학년과 5학년에 배운 내용을 떠올려요. 빈칸을 채워 보세요.", hints: ["[3/10]은 0.1이 3개예요. 0.75는 [75/100]예요.", "[2/5]를 소수로 바꾸면 0.4예요. 0.4와 0.3을 비교해요."],
      render: (b, a) => ra4Chain(b, a, [
        ["[3/10]을 소수로 나타내면 ", { i: "0.3", why: { "3.1": "[3/10]은 0.1이 3개인 수예요.", "0.03": "[3/100]이 0.03이에요. [3/10]은 0.3이에요." } }],
        ["0.75를 분수로 나타내면 ", { f: "75/100" }, "예요."],
        ["간식 꾸러미 한 개에 쿠키가 4개씩 들어 있어요. (쿠키 수) = (꾸러미 수) × ", { i: "4" }],
        ["[2/5]와 0.3 중 더 큰 수는 ", { c: ["[2/5]", "0.3"], a: 0, why: { "1": "[2/5] = [4/10] = 0.4예요. 0.4가 0.3보다 커요." } }, "예요."]],
        { ok: "[3/10] = 0.3, 0.75 = [75/100] = [3/4], (쿠키 수) = (꾸러미 수) × 4, [2/5] = 0.4 > 0.3이에요." }) },
    { name: "약속하기 — 배울 차례 정하기", inst: "이 단원에서 배울 내용을 배우는 차례대로 눌러 방송 준비 계획을 세워 보세요.", hints: ["두 수를 비교하는 방법을 먼저 배우고, 그것을 기호로 나타낸 비를 배워요.", "비율을 배운 다음 백분율을 배우고, 배운 것이 생활에 쓰이는 경우를 알아봐요."],
      render: (b, a) => sequence(b, a, ["㉠ 백분율을 알아봐요", "㉡ 두 수를 비교해요", "㉢ 비율이 사용되는 경우를 알아봐요", "㉣ 비를 알아봐요", "㉤ 백분율이 사용되는 경우를 알아봐요", "㉥ 비율을 알아봐요"], [1, 3, 5, 2, 0, 4],
        { ok: "두 수 비교 → 비 → 비율 → 비율이 사용되는 경우 → 백분율 → 백분율이 사용되는 경우 차례로 배워요." }) },
    { name: "확인하기 — 기획표에서 찾은 비교", inst: "기획표의 ‘방송 체험 부스’를 보고 물음에 답해 보세요. 체험 부스를 한 번 열 때 6학년 도우미 4명이 저학년 참가자 8명을 도와요.", hints: ["‘몇 명 더 많다’는 뺄셈으로, ‘몇 배’는 나눗셈으로 비교해요.", "도우미가 2배가 되면 참가자도 2배가 되어야 도우미 한 명이 맡는 참가자 수가 같아요."],
      render: (b, a) => quiz(b, a, [
        { q: "도우미 수와 참가자 수를 바르게 비교한 것을 모두 골라요.", o: ["저학년 참가자는 6학년 도우미보다 4명 많아요.", "저학년 참가자 수는 6학년 도우미 수의 2배예요.", "6학년 도우미 수는 저학년 참가자 수의 2배예요."], a: [0, 1],
          why: { "0": "참가자 수는 도우미 수의 몇 배인지로도 비교할 수 있어요. 8 ÷ 4를 해 봐요.", "1": "8 − 4로 차이를 비교한 설명도 맞아요.", "0,2": "도우미 4명은 참가자 8명보다 적어요. 4 ÷ 8 = [1/2]이니 도우미 수는 참가자 수의 [1/2]배예요.", "1,2": "도우미 4명은 참가자 8명보다 적어요. 4 ÷ 8 = [1/2]이니 도우미 수는 참가자 수의 [1/2]배예요." } },
        { q: "체험 부스를 넓혀 6학년 도우미를 8명으로 늘렸어요. 도우미 한 명이 맡는 참가자 수를 그대로 하려면 저학년 참가자는 몇 명이 될까요?", o: ["16명", "12명", "10명"], a: 0,
          why: { "1": "도우미가 4명 늘었다고 참가자도 4명만 늘리면 도우미 한 명이 맡는 참가자 수가 줄어요. 참가자 수는 도우미 수의 2배예요.", "2": "참가자 수는 언제나 도우미 수의 2배예요. 8 × 2를 해 봐요." } }],
        { ok: "참가자 수는 도우미 수보다 4명 많고, 도우미 수의 2배예요. 도우미가 8명이면 참가자는 16명이에요. 다음 시간에는 두 수를 비교하는 방법을 더 알아봐요." }) }
  ],
  challenge: { inst: "★ 도전 — 방송부 깃발의 가로는 60 cm, 세로는 40 cm예요. 가로와 세로를 몇 배로 비교해 보세요.", hints: ["가로가 세로의 몇 배인지는 60 ÷ 40으로 구해요.", "[60/40]을 약분하면 [3/2]이고, 소수로 1.5예요."],
    render: (b, a) => ra4Chain(b, a, [
      ["가로는 세로의 60 ÷ 40 = ", { f: "3/2", why: { "20/1": "60 − 40 = 20은 차이예요. 몇 배인지는 나눗셈으로 구해요." } }, " = ", { i: "1.5", why: { "20": "60 − 40 = 20은 차이예요. 60 ÷ 40을 해요." } }, "배"],
      ["세로는 가로의 40 ÷ 60 = ", { f: "2/3", why: { "3/2": "세로를 가로로 나누어요. 40 ÷ 60 = [40/60] = [2/3]예요." } }, "배"]],
      { ok: "가로는 세로의 [3/2]배(1.5배), 세로는 가로의 [2/3]배예요. 이 단원에서 이런 비교를 더 편리하게 나타내는 방법을 배워요." }) }
},
{
  id: "s2", no: 2, title: "체험 부스와 간식 꾸러미 ― 두 수를 비교해요", soop: "개념 구축하기(O)",
  question: "두 양의 크기를 어떻게 비교할 수 있을까요?",
  summary: "두 양을 비교할 때 뺄셈으로 차이를 비교할 수도 있고, 나눗셈으로 한 양이 다른 양의 몇 배인지 비교할 수도 있어요. 체험 부스를 한 번 열 때 6학년 도우미 4명, 저학년 참가자 8명이면 참가자 수는 도우미 수의 2배, 도우미 수는 참가자 수의 [1/2]배예요. 두 양이 함께 늘어나도 몇 배인지는 변하지 않아요.",
  steps: [
    { name: "만져 보기 — 체험 부스 두 번 열기", inst: "방송 체험 부스를 한 번 열 때 6학년 도우미 4명이 저학년 참가자 8명을 도와요. 체험 부스를 두 번 열어 보고, 도우미 수와 참가자 수를 비교해 보세요.", hints: ["‘체험 부스 한 번 더 열기’를 눌러 두 번으로 만들어요.", "참가자 수가 도우미 수의 몇 배인지는 8 ÷ 4, 도우미 수가 참가자 수의 몇 배인지는 4 ÷ 8로 구해요."],
      render: (b, a) => ra4Build(b, a, { what: "체험 부스", head: "체험 부스를 연 횟수", unit: "번", prod: "mic", start: 1, target: 2, max: 3, more: "＋ 체험 부스 한 번 더 열기", less: "－ 한 번 줄이기",
        items: [{ name: "6학년 도우미 수", per: 4, unit: "명", icon: "adult" }, { name: "저학년 참가자 수", per: 8, unit: "명", icon: "child" }],
        ask: [["체험 부스 한 번: 6학년 도우미 ", { i: "4" }, "명, 저학년 참가자 ", { i: "8" }, "명"],
          ["저학년 참가자 수는 6학년 도우미 수의 8 ÷ 4 = ", { i: "2", why: { "4": "8 − 4 = 4는 차이예요. 몇 배인지 구할 때는 나눗셈을 해요.", "0.5": "도우미 수가 기준이에요. 참가자 수 8을 도우미 수 4로 나눠요." } }, "배"],
          ["6학년 도우미 수는 저학년 참가자 수의 4 ÷ 8 = ", { f: "1/2", why: { "2/1": "도우미 수 4를 참가자 수 8로 나눠요. 4 ÷ 8 = [4/8] = [1/2]이에요." } }, "배"],
          ["체험 부스 두 번에 참가한 저학년이 16명일 때 6학년 도우미는 16 ÷ 2 = ", { i: "8", why: { "12": "참가자보다 4명 적은 것이 아니라 참가자 수의 [1/2]배예요.", "32": "도우미 수는 참가자 수의 [1/2]배예요. 16을 2로 나눠요." } }, "명이에요."]],
        ok: "참가자 수는 도우미 수의 2배, 도우미 수는 참가자 수의 [1/2]배예요. 부스를 두 번 열어도 참가자 16명은 도우미 8명의 2배예요." }) },
    { name: "그려 보기 — 간식 꾸러미 늘리기", inst: "방송부원 간식 꾸러미 한 개에는 주스 1병과 쿠키 4개가 들어 있어요. 먼저 규칙을 예상하고, 꾸러미를 세 개까지 늘려 보며 꾸러미 수에 따른 주스 수와 쿠키 수를 비교해 보세요.", hints: ["꾸러미 하나가 늘 때마다 주스 1병, 쿠키 4개가 늘어나요. 네 개면 주스 4병이에요.", "꾸러미 두 개는 주스 2병, 쿠키 8개예요. 8 ÷ 2를 해 봐요."],
      render: ruleFirst((b, a) => ra4Build(b, a, { what: "간식 꾸러미", head: "꾸러미 수", unit: "개", prod: "box", start: 1, target: 3, max: 4,
        items: [{ name: "주스 수", per: 1, unit: "병", icon: "juice" }, { name: "쿠키 수", per: 4, unit: "개", icon: "cookie" }],
        ask: [{ t: "표의 ? 칸", p: ["꾸러미 네 개: 주스 ", { i: "4" }, "병, 쿠키 ", { i: "16" }, "개"] },
          ["꾸러미 두 개의 쿠키 수는 주스 수의 8 ÷ 2 = ", { i: "4", why: { "6": "8 − 2 = 6은 차이예요. 몇 배인지는 나눗셈으로 구해요." } }, "배"],
          ["꾸러미가 열 개일 때 쿠키 수는 주스 수의 ", { i: "4", why: { "30": "쿠키 40개에서 주스 10병을 빼면 30이에요. 몇 배인지는 나눗셈으로 구해요.", "40": "쿠키는 40개이지만, 몇 배인지 물었어요. 40 ÷ 10을 해요." } }, "배예요."],
          ["그렇게 생각한 까닭: ", { c: ["꾸러미 수가 늘어나도 쿠키 수는 항상 주스 수의 4배이기 때문이에요.", "쿠키가 주스보다 항상 3개 많기 때문이에요."], a: 0, why: { "1": "꾸러미 두 개면 쿠키가 주스보다 6개, 세 개면 9개 많아요. 차이는 변하지만 몇 배인지는 변하지 않아요." } }]],
        ok: "꾸러미 수가 늘어나도 쿠키 수는 언제나 주스 수의 4배예요." }),
        { q: "꾸러미가 늘어나면 쿠키 수는 주스 수의 몇 배가 될까요?", ph: "내 규칙: 꾸러미가 늘어나도 쿠키 수는 ~", help: ["① 꾸러미 한 개에 주스와 쿠키가 몇 개씩인지 봐요. → ② 꾸러미가 2개, 3개가 될 때 두 수가 어떻게 늘어나는지 예상해요.", "‘내 규칙: 꾸러미가 늘어나도 쿠키 수는 주스 수의 ~배예요.’ 꼴로 써요."],
          ans: "꾸러미가 늘어나도 쿠키 수는 언제나 주스 수의 4배예요. 꾸러미 세 개면 주스 3병, 쿠키 12개이고 12 ÷ 3 = 4예요." }) },
    { name: "말해 보기 — 차이와 몇 배", inst: "간식 꾸러미 표를 보고 쿠키 수와 주스 수를 뺄셈과 나눗셈으로 각각 비교해 보세요. 그리고 나눗셈으로 비교하면 좋은 점을 써 보세요. 두 활동을 모두 해야 계단을 올라가요.", hints: ["차이는 쿠키 수 − 주스 수, 몇 배는 쿠키 수 ÷ 주스 수예요.", "꾸러미가 늘어날 때 차이는 3, 6, 9로 변하지만 몇 배인지는 늘 4예요."],
      render: (b, a) => { b.append(ra4Tbl(["꾸러미 수", "한 개", "두 개", "세 개", "네 개"], [["주스 수(병)", "1", "2", "3", "4"], ["쿠키 수(개)", "4", "8", "12", "16"]]));
        ra4Chain(b, a, [
          ["쿠키 수 − 주스 수: 한 개일 때 3, 두 개일 때 ", { i: "6" }, ", 세 개일 때 ", { i: "9" }],
          ["쿠키 수 ÷ 주스 수: 한 개일 때 4, 두 개일 때 ", { i: "4", why: { "6": "8 − 2 = 6은 차이예요. 8 ÷ 2를 해요." } }, ", 세 개일 때 ", { i: "4" }],
          ["꾸러미 수가 늘어날 때 변하지 않는 것은 ", { c: ["차이", "몇 배인지"], a: 1, why: { "0": "차이는 3, 6, 9로 변했어요." } }, "예요."]],
          { ok: "차이는 3, 6, 9로 변하지만 쿠키 수는 언제나 주스 수의 4배예요." });
        writeStep(b, a, [{ q: "두 양을 나눗셈으로 비교하면 뺄셈으로 비교할 때보다 어떤 점이 좋을까요?", tag: "나눗셈 비교의 좋은 점", ph: "나눗셈으로 비교하면 ~",
          help: ["① 꾸러미가 늘어날 때 차이가 어떻게 변했는지 봐요. → ② 몇 배인지는 어떻게 되었는지 견주어요.", "‘뺄셈으로 비교하면 ~이 변하지만, 나눗셈으로 비교하면 ~.’ 꼴로 써요."],
          ans: "뺄셈으로 비교하면 차이가 3, 6, 9로 변하지만, 나눗셈으로 비교하면 쿠키 수가 언제나 주스 수의 4배예요. 그래서 두 양의 관계를 하나의 수로 나타낼 수 있어요." }]); } },
    { name: "약속하기 — 두 양을 비교하는 방법", inst: "알게 된 점을 약속으로 정리해요.", hints: ["꾸러미가 늘어날 때 쿠키와 주스의 차이는 3, 6, 9로 변했어요.", "쿠키 수 ÷ 주스 수는 언제나 4였어요."],
      render: (b, a) => blanks(b, a, ["두 양을 비교할 때 뺄셈으로 ", { o: ["차이", "몇 배"], a: 0 }, "를 비교할 수도 있고, 나눗셈으로 한 양이 다른 양의 ", { o: ["몇 배", "차이"], a: 0 }, "인지 비교할 수도 있어요. 꾸러미 수가 늘어나면 쿠키 수와 주스 수의 차이는 ", { o: ["변하지만", "변하지 않지만"], a: 0 }, ", 쿠키 수가 주스 수의 몇 배인지는 ", { o: ["변하지 않아요", "변해요"], a: 0 }, "."],
        { ok: "나눗셈으로 비교하면 두 양이 함께 늘어나도 관계가 변하지 않아요." }) },
    { name: "확인하기 — 방송 장비 비교하기", inst: "방송실 장비와 응원 현수막을 보고 두 양을 비교해 보세요.", hints: ["마이크 3개, 건전지 12개예요. 12 ÷ 3을 해요.", "현수막 한 장에 별 스티커 2장, 하트 스티커 6장이에요. 세 장이면 별 스티커는 2 × 3장이에요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [
          { q: "건전지 수는 마이크 수의 몇 배일까요?", fig: ra4sMicFig, o: ["4배", "[1/4]배", "9배"], a: 0, why: { "1": "건전지 수를 마이크 수로 나눠요. 12 ÷ 3 = 4예요.", "2": "12 − 3 = 9는 차이예요. 몇 배인지는 나눗셈으로 구해요." } },
          { q: "마이크 수는 건전지 수의 몇 배일까요?", o: ["[1/4]배", "4배", "3배"], a: 0, why: { "1": "마이크 수를 건전지 수로 나눠요. 3 ÷ 12 = [3/12] = [1/4]이에요.", "2": "마이크 3개는 건전지 12개보다 적어요. 3 ÷ 12를 해요." } }],
          { ok: "건전지 수는 마이크 수의 4배, 마이크 수는 건전지 수의 [1/4]배예요." }),
        (bx, ax) => ra4Chain(bx, ax, [
          ["응원 현수막 한 장에 별 스티커 2장과 하트 스티커 6장을 붙여요. 현수막 세 장의 별 스티커는 ", { i: "6" }, "장, 하트 스티커는 ", { i: "18" }, "장"],
          ["현수막 네 장의 별 스티커는 ", { i: "8" }, "장, 하트 스티커는 ", { i: "24" }, "장"],
          ["현수막 수에 따른 하트 스티커 수는 별 스티커 수의 ", { i: "3", why: { "4": "6 − 2 = 4는 차이예요. 6 ÷ 2를 해요.", "16": "24 − 8 = 16은 차이예요. 24 ÷ 8을 해요." } }, "배예요."]],
          { ok: "현수막이 늘어나도 하트 스티커 수는 별 스티커 수의 3배예요." })]) }
  ],
  challenge: { inst: "★ 도전 — 편집 담당 수아가 만든 자막 판에서 색칠한 칸 수와 색칠하지 않은 칸 수를 잘못 비교한 것을 찾아 옳게 고쳐 보세요. 샌드위치도 비교해 보세요.", hints: ["색칠한 칸은 9칸, 색칠하지 않은 칸은 3칸이에요.", "9 ÷ 3 = 3, 3 ÷ 9 = [1/3]이에요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => quiz(bx, ax, [{ q: "잘못 비교한 것을 골라요.", fig: () => ra4GridFig(4, 3, 9), o: ["㉠ 색칠한 칸 수는 색칠하지 않은 칸 수의 6배입니다.", "㉡ 색칠하지 않은 칸 수는 색칠한 칸 수의 [1/3]배입니다."], a: 0, why: { "1": "3 ÷ 9 = [3/9] = [1/3]이에요. ㉡은 맞게 비교했어요." } }], { ok: "㉠이 잘못 비교했어요. 9 − 3 = 6은 차이예요." }),
      (bx, ax) => ra4Chain(bx, ax, [
        ["옳게 고치기: 색칠한 칸 수는 색칠하지 않은 칸 수의 ", { i: "3", why: { "6": "9 − 3 = 6은 차이예요. 9 ÷ 3을 해요." } }, "배입니다."],
        ["샌드위치 한 개에 빵 2장과 치즈 1장이 들어가요. 샌드위치 다섯 개를 만들 때 빵 수는 치즈 수의 ", { i: "2", why: { "5": "빵 10장에서 치즈 5장을 빼면 5예요. 10 ÷ 5를 해요." } }, "배예요."]],
        { ok: "색칠한 칸 수는 색칠하지 않은 칸 수의 3배예요. 샌드위치를 몇 개 만들어도 빵 수는 치즈 수의 2배예요." })]) }
},
{
  id: "s3", no: 3, title: "건강 코너 미숫가루 ― 비를 알아봐요", soop: "개념 구축하기(O)",
  question: "두 양을 기호 : 을 사용하여 어떻게 나타낼까요?",
  summary: "한 양을 기준으로 다른 양이 몇 배가 되는지 비교하기 위해 기호 : 을 사용하여 나타낸 것을 비라고 해요. 두 양 1과 3을 비교할 때 1 : 3이라 쓰고 1 대 3이라고 읽어요. 1 : 3은 1과 3의 비, 1의 3에 대한 비, 3에 대한 1의 비라고도 읽어요. 1 : 3에서 기호 : 의 오른쪽에 있는 3이 기준량, 왼쪽에 있는 1이 비교하는 양이에요.",
  steps: [
    { name: "만져 보기 — 미숫가루 음료 세 병", inst: "건강 코너에서 작가 민서가 미숫가루 음료 만드는 법을 소개해요. “미숫가루 1컵에 우유 3컵을 섞으면 고소한 음료 한 병이 돼요.” 음료를 세 병까지 만들어 보고, 병 수에 따른 미숫가루의 양과 우유의 양을 비교해 보세요.", hints: ["한 병이 늘 때마다 미숫가루 1컵, 우유 3컵이 늘어나요.", "우유의 양 ÷ 미숫가루의 양, 미숫가루의 양 ÷ 우유의 양을 구해요."],
      render: (b, a) => ra4Build(b, a, { what: "미숫가루 음료", head: "음료 병 수", unit: "병", prod: "bottle", start: 1, target: 3, max: 3,
        items: [{ name: "미숫가루의 양", per: 1, unit: "컵", icon: "misu" }, { name: "우유의 양", per: 3, unit: "컵", icon: "milk" }],
        ask: [{ t: "표", p: ["두 병: 미숫가루 ", { i: "2" }, "컵, 우유 ", { i: "6" }, "컵 / 세 병: 미숫가루 ", { i: "3" }, "컵, 우유 ", { i: "9" }, "컵"] },
          ["병 수에 따른 우유의 양은 미숫가루의 양의 ", { i: "3", why: { "2": "3 − 1 = 2는 차이예요. 3 ÷ 1을 해요.", "6": "9 − 3 = 6은 차이예요. 9 ÷ 3을 해요." } }, "배, 미숫가루의 양은 우유의 양의 ", { f: "1/3", why: { "3/1": "미숫가루의 양을 우유의 양으로 나눠요. 1 ÷ 3 = [1/3]이에요." } }, "배예요."]],
        ok: "몇 병을 만들어도 우유의 양은 미숫가루의 양의 3배, 미숫가루의 양은 우유의 양의 [1/3]배예요." }) },
    { name: "그려 보기 — 기호 : 로 나타내기", inst: "두 양을 비교할 때 기호 : 을 써서 나타낼 수 있어요. 기준량은 기호 : 의 오른쪽, 비교하는 양은 왼쪽에 써요. 양 카드를 □에 놓아 문장을 비로 나타내 보세요.", hints: ["‘우유의 양에 대한’이니 우유의 양이 기준량이에요. 오른쪽 □에 놓아요.", "‘미숫가루의 양에 대한’이면 미숫가루의 양이 기준량이에요."],
      render: thenWhy((b, a) => ra4Slots(b, a, { chips: [{ t: "미숫가루 1컵", v: 1, nm: "미숫가루의 양" }, { t: "우유 3컵", v: 3, nm: "우유의 양" }],
        tasks: [{ q: "우유의 양에 대한 미숫가루의 양의 비", a: [0, 1] }, { q: "미숫가루의 양에 대한 우유의 양의 비", a: [1, 0] }],
        ok: "우유의 양에 대한 미숫가루의 양의 비는 1 : 3, 미숫가루의 양에 대한 우유의 양의 비는 3 : 1이에요." }),
        { q: "1 : 3과 3 : 1은 왜 서로 다른 비일까요?", ph: "1 : 3은 ~을 기준으로 ~", help: ["① 1 : 3과 3 : 1에서 기호 : 의 오른쪽에 있는 양이 각각 무엇인지 찾아요. → ② 기준량이 같은지 견주어요.", "‘1 : 3은 ~을 기준으로 ~을 비교한 것이고, 3 : 1은 ~을 기준으로 ~을 비교한 것이에요.’ 꼴로 써요."],
          ans: "1 : 3은 우유의 양 3을 기준으로 미숫가루의 양 1을 비교한 것이고, 3 : 1은 미숫가루의 양 1을 기준으로 우유의 양 3을 비교한 것이에요. 기준량이 달라서 서로 다른 비예요." }) },
    { name: "말해 보기 — 비를 읽는 여러 방법", inst: "리포터 은재가 구립 수영장 소식을 전해요. “구립 수영장 입장료는 어른 4500원, 어린이 1500원이에요.” 입장료를 비로 나타내고 여러 가지 방법으로 읽어 보세요. 경기 점수도 살펴봐요.", hints: ["‘어린이 입장료에 대한’이니 어린이 입장료 1500이 기준량이에요. 오른쪽에 써요.", "경기 점수는 두 반의 점수를 나란히 쓴 것이에요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => ra4Chain(bx, ax, [
          ["어린이 입장료에 대한 어른 입장료의 비: ", { r: [4500, 1500], why: { "1500:4500": "‘어린이 입장료에 대한’이라고 했으니 어린이 입장료가 기준량이에요. 기준량은 기호 : 의 오른쪽에 써요." } }],
          ["이 비에서 기준량은 ", { i: "1500", why: { "4500": "기호 : 의 오른쪽에 있는 수가 기준량이에요." } }, "원, 비교하는 양은 ", { i: "4500" }, "원이에요."],
          ["4500 : 1500은 ‘4500 ", { c: ["대", "더하기", "나누기"], a: 0 }, " 1500’, ‘4500과 1500의 비’, ‘1500에 대한 4500의 비’, ‘4500의 1500에 ", { c: ["대한", "더한"], a: 0 }, " 비’라고 읽어요."]],
          { ok: "어린이 입장료에 대한 어른 입장료의 비는 4500 : 1500이에요. 1500이 기준량, 4500이 비교하는 양이에요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "방송부가 학급 피구 경기 결과를 ‘3반 2 : 3 5반’이라고 전했어요. 이 2 : 3은 이 단원에서 배우는 비일까요?", o: ["아니에요. 두 반이 얻은 점수를 나란히 쓴 것이에요.", "네. 5반 점수에 대한 3반 점수의 비예요."], a: 0,
          why: { "1": "경기 점수 2 : 3은 한 양을 기준으로 다른 양이 몇 배인지 비교한 것이 아니에요. 두 반의 점수를 나란히 적은 것이에요." } }],
          { ok: "경기 점수에 쓰는 2 : 3은 두 양의 상대적인 크기를 나타내는 비가 아니에요." })]) },
    { name: "약속하기 — 비", inst: "알게 된 점을 약속으로 정리해요.", hints: ["기호 : 을 쓰고 ‘대’라고 읽어요.", "기호 : 의 오른쪽에 있는 수가 기준량이에요."],
      render: (b, a) => blanks(b, a, ["한 양을 기준으로 다른 양이 몇 배가 되는지 비교하기 위해 기호 ", { o: [":", "+", "="], a: 0 }, "을 사용하여 나타낸 것을 ", { o: ["비", "백분율"], a: 0 }, "라고 합니다. 두 양 1과 3을 비교할 때 1 : 3이라 쓰고, ", { o: ["1 대 3", "3 대 1"], a: 0 }, "이라고 읽습니다. 1 : 3은 1과 3의 비, ", { o: ["1의 3에 대한 비", "3의 1에 대한 비"], a: 0 }, ", 3에 대한 1의 비라고도 읽습니다. 1 : 3에서 3은 ", { o: ["기준량", "비교하는 양"], a: 0 }, ", 1은 ", { o: ["비교하는 양", "기준량"], a: 0 }, "입니다."],
        { ok: "기호 : 의 오른쪽이 기준량, 왼쪽이 비교하는 양이에요. ‘~에 대한’ 앞에 있는 것이 기준량이에요." }) },
    { name: "확인하기 — 막대사탕 나누어 주기", inst: "방송부장 서윤이가 막대사탕 12개 중 5개를 퀴즈 정답자에게 나누어 주었어요. 나누어 준 막대사탕 5개를 눌러 보고, 여러 가지 비로 나타내 보세요.", hints: ["막대사탕을 5개 눌러요. 남은 막대사탕은 12 − 5 = 7개예요.", "‘~에 대한’ 앞에 있는 수를 기호 : 의 오른쪽에 써요."],
      render: (b, a) => ra4Candy(b, a, { total: 12, eat: 5,
        ask: [["처음에 있던 막대사탕 수에 대한 나누어 준 막대사탕 수의 비: ", { r: [5, 12], why: { "12:5": "처음에 있던 막대사탕 수 12가 기준량이에요. 오른쪽에 써요." } }],
          ["처음에 있던 막대사탕 수에 대한 남은 막대사탕 수의 비: ", { r: [7, 12], why: { "5:12": "남은 막대사탕은 12 − 5 = 7개예요.", "12:7": "처음에 있던 막대사탕 수 12가 기준량이에요." } }],
          ["남은 막대사탕 수에 대한 나누어 준 막대사탕 수의 비: ", { r: [5, 7], why: { "7:5": "‘남은 막대사탕 수에 대한’이니 남은 수 7이 기준량이에요. 오른쪽에 써요." } }],
          ["나누어 준 막대사탕 수에 대한 남은 막대사탕 수의 비: ", { r: [7, 5], why: { "5:7": "‘나누어 준 막대사탕 수에 대한’이니 나누어 준 수 5가 기준량이에요." } }]],
        ok: "5 : 12, 7 : 12, 5 : 7, 7 : 5 — 무엇을 기준으로 하는지에 따라 비가 달라져요." }) }
  ],
  challenge: { inst: "★ 도전 — 카메라 담당 태오가 찍은 사진 30장 중 인물 사진은 18장, 나머지는 풍경 사진이에요. 비로 나타내 보고, 우리 교실에서도 비를 찾아 써 보세요.", hints: ["풍경 사진은 30 − 18 = 12장이에요.", "교실의 남학생 수와 여학생 수, 책의 가로와 세로처럼 두 양을 찾아요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [
        ["인물 사진 수와 풍경 사진 수의 비: ", { r: [18, 12], why: { "12:18": "‘인물 사진 수와 풍경 사진 수의 비’는 인물 사진 수를 앞에 써요." } }],
        ["전체 사진 수에 대한 풍경 사진 수의 비: ", { r: [12, 30], why: { "30:12": "전체 사진 수 30이 기준량이에요. 오른쪽에 써요.", "18:30": "풍경 사진은 30 − 18 = 12장이에요." } }],
        ["25에 대한 9의 비: ", { r: [9, 25], why: { "25:9": "‘25에 대한’이니 25가 기준량이에요. 오른쪽에 써요." } }]],
        { ok: "인물 사진 수와 풍경 사진 수의 비는 18 : 12, 전체 사진 수에 대한 풍경 사진 수의 비는 12 : 30, 25에 대한 9의 비는 9 : 25예요." }),
      (bx, ax) => writeStep(bx, ax, [{ q: "우리 교실에서 비교할 수 있는 두 양을 찾아 비로 쓰고, 여러 가지 방법으로 읽어 보세요.", tag: "교실에서 찾은 비", ph: "예) 우리 반 남학생 수와 여학생 수의 비는 ~ : ~이에요. ~ 대 ~, ~",
        help: ["① 교실에서 수를 셀 수 있는 두 양을 찾아요(사람 수, 물건 수, 길이). → ② 비로 쓰고, ‘대’, ‘~와 ~의 비’, ‘~에 대한 ~의 비’로 읽어요.", "‘~와 ~의 비는 □ : △예요. □ 대 △, □와 △의 비, △에 대한 □의 비라고 읽어요.’ 꼴로 써요."],
        ans: "우리 반 남학생 수와 여학생 수의 비는 12 : 13이에요. 12 대 13, 12와 13의 비, 12의 13에 대한 비, 13에 대한 12의 비라고 읽어요." }])]) }
},
{
  id: "s4", no: 4, title: "방송 화면 모양 ― 비율을 알아봐요", soop: "개념 구축하기(O)",
  question: "기준량에 대한 비교하는 양의 크기를 어떻게 나타낼까요?",
  summary: "기준량에 대한 비교하는 양의 크기를 비율이라고 해요. (비율) = (비교하는 양) ÷ (기준량)이에요. 비 4 : 5를 비율로 나타내면 [4/5] 또는 0.8이에요. 비율은 분수로도 소수로도 나타낼 수 있고, 1보다 작을 수도 클 수도 있어요. 크기가 달라도 비율이 같을 수 있어요.",
  steps: [
    { name: "만져 보기 — 스피커는 마이크의 몇 배", inst: "방송실에 마이크 5개와 스피커 4개가 있어요. 마이크 막대 전체를 1로 보고, 수직선의 빨간 표시를 끌어 스피커 막대의 끝에 맞춰 보세요. 스피커 수는 마이크 수의 몇 배일까요?", hints: ["마이크 막대 전체가 수직선의 1이에요. 빨간 표시를 스피커 막대 끝에 맞춰요.", "4 ÷ 5 = [4/5] = 0.8이에요."],
      render: (b, a) => ra4Comp(b, a, { base: { name: "마이크", n: 5, icon: "mic" }, comp: { name: "스피커", n: 4, icon: "speaker" },
        ask: [["마이크 수에 대한 스피커 수의 비: ", { r: [4, 5], why: { "5:4": "‘마이크 수에 대한’이니 마이크 수 5가 기준량이에요. 오른쪽에 써요." } }],
          ["기준량은 ", { i: "5" }, ", 비교하는 양은 ", { i: "4" }],
          ["스피커 수는 마이크 수의 4 ÷ 5 = ", { f: "4/5", why: { "5/4": "비교하는 양 4를 기준량 5로 나눠요. [4/5]예요." } }, " = ", { i: "0.8", why: { "1.25": "5 ÷ 4가 아니라 비교하는 양 4를 기준량 5로 나눠요." } }, "배"]],
        ok: "스피커 수는 마이크 수의 [4/5]배, 곧 0.8배예요. 이렇게 기준량에 대한 비교하는 양의 크기를 비율이라고 해요." }) },
    { name: "그려 보기 — 사진 세 장의 비율", inst: "편집 담당 수아가 방송 화면에 띄울 사진 세 장을 골랐어요. 각 사진의 가로에 대한 세로의 비를 쓰고, 비율을 분수와 소수로 나타내 보세요.", hints: ["‘가로에 대한’이니 가로가 기준량이에요. 세로 : 가로로 써요.", "가는 [6/8] = [3/4] = 0.75, 다는 [3/4] = 0.75예요."],
      render: thenWhy((b, a) => { b.append(ra4sPhotoFig()); ra4Chain(b, a, [
        { t: "가", p: ["비 ", { r: [6, 8], why: { "8:6": "‘가로에 대한’이니 가로 8이 기준량이에요. 세로 6을 앞에, 가로 8을 뒤에 써요." } }, ", 비율 ", { f: "6/8" }, " = ", { i: "0.75" }] },
        { t: "나", p: ["비 ", { r: [8, 5], why: { "5:8": "가로 5가 기준량이에요. 세로 8을 앞에 써요." } }, ", 비율 ", { f: "8/5" }, " = ", { i: "1.6", why: { "0.625": "5 ÷ 8을 했어요. 세로 8을 가로 5로 나눠요." } }] },
        { t: "다", p: ["비 ", { r: [3, 4] }, ", 비율 ", { f: "3/4" }, " = ", { i: "0.75" }] },
        ["비율이 같은 사진: ", { c: ["가와 다", "가와 나", "나와 다"], a: 0, why: { "1": "가는 0.75, 나는 1.6이에요.", "2": "나는 1.6, 다는 0.75예요." } }, " / 비율이 1보다 큰 사진: ", { c: ["가", "나", "다"], a: 1, why: { "0": "가의 비율 0.75는 1보다 작아요.", "2": "다의 비율 0.75는 1보다 작아요." } }]],
        { ok: "가 [6/8] = 0.75, 나 [8/5] = 1.6, 다 [3/4] = 0.75예요. 가와 다는 크기가 달라도 비율이 같아요." }); },
        { q: "가와 다는 크기가 다른데 왜 가로에 대한 세로의 비율이 같을까요?", ph: "가는 다의 가로와 세로를 ~", help: ["① 가와 다의 가로, 세로를 각각 견주어요. → ② 가로와 세로가 똑같이 몇 배가 되었는지 살펴요.", "‘가는 다의 가로와 세로를 모두 ~배 한 것이라서 비율이 ~로 같아요.’ 꼴로 써요."],
          ans: "가는 가로 8 cm, 세로 6 cm이고 다는 가로 4 cm, 세로 3 cm예요. 가는 다의 가로와 세로를 모두 2배 한 것이라서 가로에 대한 세로의 비율이 [3/4] = 0.75로 같아요." }) },
    { name: "말해 보기 — 화면 모양 바꾸기", inst: "모눈 위의 화면 모서리(빨간 점)를 끌어 목표에 맞는 화면을 만들어 보세요. 그리고 비율에 따라 화면 모양이 어떻게 다른지 써 보세요. 두 활동을 모두 해야 계단을 올라가요.", hints: ["비율이 1이면 가로와 세로가 같아요. 비율이 0.5이면 세로가 가로의 반이에요.", "비율이 1보다 크면 세로가 가로보다 길어요."],
      render: (b, a) => { ra4Rect(b, a, { W: 12, H: 9, w0: 4, h0: 3,
        tasks: [{ goal: "가로에 대한 세로의 비율이 1인 화면을 만들어 보세요.", test: (w, hh) => w === hh, why: (w, hh) => `지금 비율은 [${hh}/${w}]이에요. 가로와 세로의 길이를 같게 해 봐요.` },
          { goal: "가로에 대한 세로의 비율이 0.5인 화면을 만들어 보세요.", test: (w, hh) => w === 2 * hh, why: (w, hh) => `지금 비율은 [${hh}/${w}]이에요. 세로가 가로의 반이 되게 해 봐요.` },
          { goal: "가로에 대한 세로의 비율이 1보다 큰 화면을 만들어 보세요.", test: (w, hh) => hh > w, why: (w, hh) => `지금 비율은 [${hh}/${w}]이에요. 세로를 가로보다 길게 해 봐요.` }],
        ok: "비율이 1이면 정사각형, 1보다 작으면 옆으로 긴 화면, 1보다 크면 위아래로 긴 화면이에요." });
        writeStep(b, a, [{ q: "가로에 대한 세로의 비율이 1보다 작은 화면과 1보다 큰 화면은 모양이 어떻게 다른가요?", tag: "비율과 화면 모양", ph: "비율이 1보다 작으면 ~, 1보다 크면 ~",
          help: ["① 비율이 1보다 작을 때 세로와 가로 중 어느 쪽이 긴지 떠올려요. → ② 1보다 클 때와 견주어요.", "‘비율이 1보다 작으면 세로가 가로보다 ~해서 ~ 화면이고, 1보다 크면 ~.’ 꼴로 써요."],
          ans: "비율이 1보다 작으면 세로가 가로보다 짧아서 옆으로 긴 화면이고, 1보다 크면 세로가 가로보다 길어서 위아래로 긴 화면이에요. 비율이 1이면 정사각형이에요." }]); } },
    { name: "약속하기 — 비율", inst: "알게 된 점을 약속으로 정리해요.", hints: ["스피커 수 4를 마이크 수 5로 나누었어요.", "[4/5] = [8/10] = 0.8이에요."],
      render: (b, a) => blanks(b, a, ["기준량에 대한 비교하는 양의 크기를 ", { o: ["비율", "백분율"], a: 0 }, "이라고 합니다. (비율) = (비교하는 양) ", { o: ["÷", "×", "−"], a: 0 }, " (기준량)입니다. 비 4 : 5를 비율로 나타내면 [4/5] 또는 ", { o: ["0.8", "1.25"], a: 0 }, "입니다. 비율은 분수로도 소수로도 ", { o: ["나타낼 수 있어요", "나타낼 수 없어요"], a: 0 }, "."],
        { ok: "(비율) = (비교하는 양) ÷ (기준량)이에요. 4 : 5의 비율은 [4/5] = 0.8이에요." }) },
    { name: "확인하기 — 매실 음료의 진하기", inst: "서윤이는 매실 원액 1컵을 넣어 매실 음료 5컵을, 하준이는 매실 원액 2컵을 넣어 매실 음료 8컵을 만들었어요. 매실 음료의 양에 대한 매실 원액의 양의 비율을 구해 보세요.", hints: ["매실 음료의 양이 기준량이에요. 원액의 양을 음료의 양으로 나눠요.", "서윤 1 ÷ 5 = 0.2, 하준 2 ÷ 8 = 0.25예요."],
      render: (b, a) => { b.append(ra4sJars()); ra4Chain(b, a, [
        ["서윤: 분수 ", { f: "1/5", why: { "5/1": "음료의 양 5가 기준량이에요. 1 ÷ 5를 해요." } }, ", 소수 ", { i: "0.2", why: { "5": "5 ÷ 1을 했어요. 원액의 양 1을 음료의 양 5로 나눠요." } }],
        ["하준: 분수 ", { f: "2/8" }, ", 소수 ", { i: "0.25", why: { "4": "8 ÷ 2를 했어요. 원액의 양 2를 음료의 양 8로 나눠요." } }],
        ["매실 음료의 양에 대한 매실 원액의 양의 비율이 더 높은 사람: ", { c: ["서윤", "하준"], a: 1, why: { "0": "서윤이는 0.2, 하준이는 0.25예요. 0.25가 더 커요." } }]],
        { ok: "서윤이는 [1/5] = 0.2, 하준이는 [2/8] = 0.25예요. 하준이의 음료가 비율이 더 높아 더 진해요." }); } }
  ],
  challenge: { inst: "★ 도전 — 비율을 분수와 소수로 나타내고, 같은 시각에 국기 게양대와 방송부원의 그림자를 비교해 보세요.", hints: ["7 : 20의 비율은 7 ÷ 20이에요.", "높이에 대한 그림자 길이의 비율은 (그림자 길이) ÷ (높이)예요. 400 ÷ 600, 100 ÷ 150을 해 봐요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [
        ["7 : 20의 비율: 분수 ", { f: "7/20" }, ", 소수 ", { i: "0.35" }],
        ["16에 대한 12의 비 ", { r: [12, 16], why: { "16:12": "‘16에 대한’이니 16이 기준량이에요." } }, ", 비율 소수로 ", { i: "0.75" }]],
        { ok: "7 : 20 = [7/20] = 0.35, 12 : 16 = [12/16] = 0.75예요." }),
      (bx, ax) => ra4Chain(bx, ax, [
        ["국기 게양대 높이 600 cm, 그림자 400 cm → 높이에 대한 그림자 길이의 비율 ", { f: "2/3", why: { "3/2": "높이 600이 기준량이에요. 그림자 400을 높이 600으로 나눠요." } }],
        ["방송부원 키 150 cm, 그림자 100 cm → 비율 ", { f: "2/3" }],
        ["같은 시각에 높이에 대한 그림자 길이의 비율은 ", { c: ["같아요", "달라요"], a: 0, why: { "1": "[400/600]과 [100/150]을 약분하면 모두 [2/3]예요." } }, "."]],
        { ok: "[400/600] = [100/150] = [2/3]예요. 같은 시각에는 높이에 대한 그림자 길이의 비율이 같아요." })]) }
},
{
  id: "s5", no: 5, title: "우리 동네 소식 ― 비율이 사용되는 경우", soop: "개념 구축하기(O)",
  question: "생활에서 비율은 어떤 경우에 사용될까요?",
  summary: "실제 거리에 대한 지도에서의 거리의 비율, 던진 횟수에 대한 성공한 횟수의 비율, 걸린 시간에 대한 달린 거리의 비율, 넓이에 대한 인구의 비율, 소금물의 양에 대한 소금의 양의 비율처럼 비율은 생활 곳곳에 쓰여요. 먼저 기준량과 비교하는 양을 찾고, (비교하는 양) ÷ (기준량)으로 비율을 구해 크기를 비교해요.",
  steps: [
    { name: "만져 보기 — 두 지도에 같은 거리 그리기", inst: "기자 하준이가 ‘우리 동네 소식’에 쓸 지도 두 장을 준비했어요. 학교 주변 지도는 실제 거리 200 m를 1 cm로, 우리 구 안내 지도는 실제 거리 500 m를 1 cm로 나타냈어요. 두 지도에 실제 거리 1000 m를 선으로 그려 보세요.", hints: ["학교 주변 지도는 1 cm가 200 m예요. 1000 m는 몇 cm일까요?", "우리 구 안내 지도는 1 cm가 500 m예요. 거리를 비교할 때는 먼저 단위를 같게 해요. 1 m = 100 cm예요."],
      render: (b, a) => ra4Map(b, a, { real: 1000, maps: [{ name: "학교 주변 지도", per: 200 }, { name: "우리 구 안내 지도", per: 500 }],
        ask: [["실제 거리를 cm로 나타내면 200 m = ", { i: "20000" }, " cm, 500 m = ", { i: "50000" }, " cm"],
          ["실제 거리에 대한 지도에서의 거리의 비: 학교 주변 지도 ", { r: [1, 20000], why: { "20000:1": "실제 거리가 기준량이에요. 오른쪽에 써요.", "1:200": "단위를 같게 해요. 200 m = 20000 cm예요." } }, ", 우리 구 안내 지도 ", { r: [1, 50000], why: { "1:500": "단위를 같게 해요. 500 m = 50000 cm예요." } }],
          ["비율: 학교 주변 지도 ", { f: "1/20000" }, ", 우리 구 안내 지도 ", { f: "1/50000" }],
          ["비율이 더 높은 지도: ", { c: ["학교 주변 지도", "우리 구 안내 지도"], a: 0, why: { "1": "분자가 같으면 분모가 작을수록 큰 분수예요. [1/20000]이 [1/50000]보다 커요." } }, " — 비율이 높을수록 같은 곳이 지도에 더 ", { c: ["자세하게", "작게"], a: 0 }, " 나타나요."]],
        ok: "학교 주변 지도는 [1/20000], 우리 구 안내 지도는 [1/50000]이에요. 비율이 높은 학교 주변 지도에 같은 거리가 더 길게, 더 자세히 나타나요." }) },
    { name: "그려 보기 — 성공률과 빠르기", inst: "아나운서 지호가 학급 대항 농구 대회와 이어달리기 연습 소식을 전해요. 기준량과 비교하는 양을 찾아 비율을 구하고 비교해 보세요.", hints: ["슛은 던진 횟수가 기준량이에요. 12 ÷ 16, 14 ÷ 20을 해요.", "달리기는 걸린 시간이 기준량이에요. 100 ÷ 20, 60 ÷ 10을 해요."],
      render: (b, a) => ra4Seq(b, a, [
        { title: "농구 대회: 3반 지호는 슛을 16번 던져 12번, 5반 도윤이는 20번 던져 14번 넣었어요.", run: (bx, ax) => ra4Chain(bx, ax, [
          ["기준량은 ", { c: ["던진 횟수", "넣은 횟수"], a: 0 }, ", 비교하는 양은 ", { c: ["던진 횟수", "넣은 횟수"], a: 1 }],
          ["지호: ", { f: "12/16" }, " = ", { i: "0.75" }, "   도윤: ", { f: "14/20" }, " = ", { i: "0.7" }],
          ["던진 횟수에 대한 넣은 횟수의 비율이 더 높은 사람: ", { c: ["지호", "도윤"], a: 0, why: { "1": "도윤이가 2번 더 넣었지만 4번 더 던졌어요. 비율은 지호 0.75, 도윤 0.7이에요." } }]],
          { ok: "지호 0.75 > 도윤 0.7이에요. 넣은 횟수가 적어도 비율은 지호가 더 높아요." }) },
        { title: "이어달리기: 태오는 100 m를 20초에, 은재는 60 m를 10초에 달렸어요.", run: (bx, ax) => ra4Chain(bx, ax, [
          ["걸린 시간에 대한 달린 거리의 비율: 태오 100 ÷ 20 = ", { i: "5", why: { "0.2": "걸린 시간이 기준량이에요. 달린 거리 100을 걸린 시간 20으로 나눠요." } }, ", 은재 60 ÷ 10 = ", { i: "6" }],
          ["비율이 더 높은 사람은 ", { c: ["태오", "은재"], a: 1, why: { "0": "태오는 5, 은재는 6이에요. 6이 더 커요." } }, "이고, 이 사람이 더 ", { c: ["빨라요", "느려요"], a: 0, why: { "1": "1초 동안 더 멀리 달렸으니 더 빨라요." } }, "."]],
          { ok: "태오는 1초에 5 m, 은재는 1초에 6 m를 달린 셈이에요. 비율이 높은 은재가 더 빨라요." }) }]) },
    { name: "말해 보기 — 두 구의 인구 밀도", inst: "‘우리 동네 소식’에서 두 구의 인구와 넓이를 비교해요. 넓이에 대한 인구의 비율을 구해 보세요. 큰 수의 나눗셈은 계산기를 써도 좋아요.", hints: ["넓이가 기준량, 인구가 비교하는 양이에요.", "360000 ÷ 24 = 15000, 420000 ÷ 35 = 12000이에요."],
      render: thenWhy((b, a) => { b.append(ra4Tbl(["구", "인구(명)", "넓이(km²)"], [["해오름구", "360000", "24"], ["달빛구", "420000", "35"]]), ra4Calc()); ra4Chain(b, a, [
        ["기준량은 ", { c: ["넓이", "인구"], a: 0 }, ", 비교하는 양은 ", { c: ["넓이", "인구"], a: 1 }],
        ["해오름구: 360000 ÷ 24 = ", { i: "15000" }],
        ["달빛구: 420000 ÷ 35 = ", { i: "12000" }],
        ["넓이에 대한 인구의 비율이 더 높은 구: ", { c: ["해오름구", "달빛구"], a: 0, why: { "1": "달빛구는 인구가 더 많지만 넓이도 더 넓어요. 비율을 구해 비교해요." } }]],
        { ok: "해오름구 15000, 달빛구 12000이에요. 해오름구가 넓이에 대한 인구의 비율이 더 높아요." }); },
        { q: "넓이에 대한 인구의 비율이 높다는 것은 무엇을 뜻할까요?", ph: "비율이 높을수록 같은 넓이에 ~", help: ["① 15000이 1 km²에 사는 사람 수와 어떤 관계인지 생각해요. → ② 두 구를 견주어요.", "‘비율이 높을수록 같은 넓이에 사는 사람이 ~. 해오름구는 1 km²에 ~명이 사는 셈이에요.’ 꼴로 써요."],
          ans: "넓이에 대한 인구의 비율이 높을수록 같은 넓이에 사는 사람이 더 많아요. 해오름구는 1 km²에 15000명, 달빛구는 12000명이 사는 셈이라 해오름구가 더 붐벼요." }) },
    { name: "약속하기 — 생활 속 비율", inst: "생활에서 비율을 비교하는 방법을 정리해요.", hints: ["먼저 무엇을 기준으로 하는지 찾아요.", "분수나 소수로 나타내면 크기를 비교할 수 있어요."],
      render: (b, a) => blanks(b, a, ["생활에서 비율을 비교할 때는 먼저 ", { o: ["기준량과 비교하는 양", "두 양의 합"], a: 0 }, "을 찾아요. 그다음 (비교하는 양) ÷ (기준량)으로 비율을 구해 ", { o: ["분수나 소수", "덧셈식"], a: 0 }, "로 나타내고 크기를 비교해요. 걸린 시간에 대한 달린 거리의 비율이 높을수록 ", { o: ["더 빠르고", "더 느리고"], a: 0 }, ", 넓이에 대한 인구의 비율이 높을수록 같은 넓이에 사는 사람이 ", { o: ["더 많아요", "더 적어요"], a: 0 }, "."],
        { ok: "지도, 성공률, 빠르기, 인구 밀도처럼 생활 속 비율도 기준량과 비교하는 양을 찾아 구해요." }) },
    { name: "확인하기 — 과학실 소금물", inst: "과학실에서 민서는 소금 20 g을 넣어 소금물 100 g을, 태오는 소금 30 g을 넣어 소금물 200 g을 만들었어요. 소금물의 양에 대한 소금의 양의 비율을 구하고, 더 진한 소금물을 찾아보세요.", hints: ["소금물의 양이 기준량이에요.", "20 ÷ 100 = 0.2, 30 ÷ 200 = 0.15예요."],
      render: (b, a) => ra4Chain(b, a, [
        ["민서: ", { f: "20/100" }, " = ", { i: "0.2", why: { "5": "100 ÷ 20을 했어요. 소금의 양 20을 소금물의 양 100으로 나눠요.", "0.25": "소금물의 양 100이 기준량이에요. 20 ÷ 100을 해요." } }],
        ["태오: ", { f: "30/200" }, " = ", { i: "0.15", why: { "0.3": "소금물의 양 200이 기준량이에요. 30 ÷ 200을 해요." } }],
        ["소금의 양의 비율이 더 높아 더 진한 소금물: ", { c: ["민서의 소금물", "태오의 소금물"], a: 0, why: { "1": "태오가 소금을 더 많이 넣었지만 소금물도 더 많아요. 비율은 민서 0.2, 태오 0.15예요." } }]],
        { ok: "민서 0.2 > 태오 0.15예요. 소금을 적게 넣었어도 민서의 소금물이 더 진해요." }) }
  ],
  challenge: { inst: "★ 도전 — 이어달리기 기록의 조건을 바꾸어 새로운 비율 비교 문제를 만들고, 직접 풀어 보세요.", hints: ["두 사람의 달린 거리나 걸린 시간을 다른 수로 바꿔요.", "(달린 거리) ÷ (걸린 시간)으로 비율을 구해요."],
    render: (b, a) => ra4Make(b, a, { base: [["태오", 100, 20], ["은재", 60, 10]] }) }
},
{
  id: "s6", no: 6, title: "방송 퀴즈 대결 ― 백분율을 알아봐요", soop: "개념 구축하기(O)",
  question: "기준량이 다른 비율을 쉽게 비교하는 방법은 무엇일까요?",
  summary: "기준량을 100으로 할 때의 비율을 백분율이라고 해요. 백분율은 기호 %를 사용하여 나타내고, 비율 [1/100]을 1 %라 쓰고 1 퍼센트라고 읽어요. 비율을 백분율로 나타내려면 기준량이 100인 비율로 바꾸거나, 비율에 100을 곱해서 나온 값에 %를 붙여요.",
  steps: [
    { name: "만져 보기 — 맞힌 문제 색칠하기", inst: "방송 퀴즈 대결이 열렸어요. “나는 20문제 중 13문제를 맞혔어!”(수아) “나는 25문제 중 16문제를 맞혔어!”(은재) 푼 문제 수만큼 칸이 있는 모눈에 맞힌 문제 수만큼 색칠해 보세요.", hints: ["수아 모눈은 20칸, 은재 모눈은 25칸이에요.", "수아는 13칸, 은재는 16칸을 색칠해요."],
      render: (b, a) => ra4Grid(b, a, { grids: [{ name: "수아", title: "수아(20문제를 풂)", cols: 10, rows: 2, target: 13 }, { name: "은재", title: "은재(25문제를 풂)", cols: 5, rows: 5, target: 16, col: "#7FB8E6" }],
        ask: [["푼 문제 수에 대한 맞힌 문제 수의 비율: 수아 ", { f: "13/20" }, ", 은재 ", { f: "16/25" }],
          ["푼 문제 수가 다를 때 쉽게 비교하는 방법: ", { c: ["푼 문제 수(기준량)를 같게 한 뒤 비교해요.", "맞힌 문제 수만 비교해요."], a: 0, why: { "1": "은재가 3문제 더 맞혔지만 푼 문제도 5문제 더 많아요. 맞힌 문제 수만으로는 알 수 없어요." } }]],
        ok: "기준량(푼 문제 수)이 다르면 기준량을 같게 하여 비교하면 쉬워요." }) },
    { name: "그려 보기 — 100문제였다면", inst: "두 사람이 같은 실력으로 퀴즈를 100문제씩 풀었다면 각각 몇 문제를 맞혔을지 먼저 예상하고, 100칸 모눈에 색칠해 보세요.", hints: ["100은 20의 5배예요. 수아는 13문제의 5배를 맞힌다고 생각해요.", "100은 25의 4배예요. 은재는 16문제의 4배예요."],
      render: ruleFirst((b, a) => ra4Grid(b, a, { cell: 24, grids: [{ name: "수아", title: "수아가 100문제를 풀었다면", cols: 10, rows: 10, target: 65 }, { name: "은재", title: "은재가 100문제를 풀었다면", cols: 10, rows: 10, target: 64, col: "#7FB8E6" }],
        ask: [["수아: 100 = 20 × 5이므로 13 × 5 = ", { i: "65", why: { "93": "20에 80을 더해 100이 되었다고 13에도 80을 더하면 안 돼요. 100은 20의 5배예요." } }, "(문제)"],
          ["은재: 100 = 25 × 4이므로 16 × 4 = ", { i: "64", why: { "91": "25에 75를 더해 100이 되었다고 16에도 75를 더하면 안 돼요. 100은 25의 4배예요." } }, "(문제)"],
          ["푼 문제 수에 대한 맞힌 문제 수의 비율이 더 높은 사람: ", { c: ["수아", "은재"], a: 0, why: { "1": "100문제를 풀었을 때 수아는 65문제, 은재는 64문제를 맞혀요." } }]],
        ok: "기준량을 100으로 같게 하니 수아 65, 은재 64로 쉽게 비교할 수 있어요." }),
        { q: "두 사람이 100문제씩 풀었다면 몇 문제를 맞혔을지 어떻게 알 수 있을까요?", ph: "내 규칙: 푼 문제 수가 100이 되도록 ~", help: ["① 20과 25가 각각 몇 배가 되면 100이 되는지 생각해요. → ② 맞힌 문제 수도 같은 배만큼 늘린다고 예상해요.", "‘내 규칙: 푼 문제 수를 ~배 하여 100으로 만들면 맞힌 문제 수도 ~배 해요.’ 꼴로 써요."],
          ans: "푼 문제 수를 100으로 같게 바꾸어요. 100은 20의 5배이니 수아는 13 × 5 = 65문제, 100은 25의 4배이니 은재는 16 × 4 = 64문제를 맞힌 셈이에요." }) },
    { name: "말해 보기 — 백분율로 나타내는 두 방법", inst: "방송부가 학생 50명에게 물었더니 38명이 아침 방송을 매일 듣는다고 답했어요. 아침 방송을 매일 듣는 학생 수는 답한 학생 수의 몇 %인지 두 가지 방법으로 알아보세요. 먼저 이중 테이프의 위쪽을 38명만큼 색칠해요.", hints: ["위 테이프 한 칸은 학생 1명이에요. 38칸을 색칠해요.", "방법 1: 분모 50에 2를 곱하면 100이에요. 방법 2: [38/50] = 0.76, 0.76 × 100 = 76이에요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => ra4Tape2(bx, ax, { N: 50, unit: "명", steps: 50, target: 38, whole: "답한 학생 수", part: "매일 듣는 학생 수", mode: "pct",
          ask: [{ t: "방법 1 기준량을 100으로 바꾸기", p: ["[38/50]의 분모와 분자에 ", { i: "2" }, "를 곱하면 [38/50] = [□/100], □ = ", { i: "76" }, " → ", { i: "76" }, " %"] },
            { t: "방법 2 비율에 100 곱하기", p: ["[38/50] = ", { i: "0.76" }, ", 0.76 × 100 = ", { i: "76" }, " → 76 %"] }],
          ok: "아침 방송을 매일 듣는 학생은 답한 학생의 76 %예요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "두 방법을 비교해 보세요.", o: ["방법 1은 기준량을 100으로 할 때의 비율로 바꾸었고, 방법 2는 비율에 100을 곱해서 나온 값에 %를 붙였어요.", "두 방법으로 구한 백분율은 서로 달라요."], a: 0, why: { "1": "두 방법 모두 76 %로 같아요. 바꾸는 방법만 달라요." } }], { ok: "두 방법 모두 76 %예요. 편리한 방법을 골라 써요." })]) },
    { name: "약속하기 — 백분율", inst: "알게 된 점을 약속으로 정리해요.", hints: ["100문제를 풀었을 때로 바꾸어 비교했어요.", "[1/100]을 1 %라고 써요."],
      render: (b, a) => blanks(b, a, ["기준량을 ", { o: ["100", "10", "1"], a: 0 }, "으로 할 때의 비율을 ", { o: ["백분율", "비율"], a: 0 }, "이라고 합니다. 백분율은 기호 ", { o: ["%", ":"], a: 0 }, "를 사용하여 나타냅니다. 비율 [1/100]을 1 %라 쓰고, ", { o: ["1 퍼센트", "100 퍼센트"], a: 0 }, "라고 읽습니다."],
        { ok: "기준량을 100으로 할 때의 비율이 백분율이에요. [1/100] = 1 %(1 퍼센트)예요." }) },
    { name: "확인하기 — 비율을 백분율로", inst: "방송 퀴즈 대결의 마지막 문제예요. 비율을 백분율로 나타내 보세요.", hints: ["[3/20] = [15/100]예요. 또는 [3/20] × 100 = 15예요.", "0.62 × 100 = 62, 0.4 × 100 = 40이에요."],
      render: (b, a) => ra4Chain(b, a, [
        ["[3/20] → ", { i: "15", why: { "0.15": "0.15는 비율이에요. 100을 곱해서 %를 붙여요.", "3": "분자를 그대로 쓰면 안 돼요. 분모를 100으로 만들면 [15/100]예요." } }, " %"],
        ["[9/25] → ", { i: "36", why: { "0.36": "0.36은 비율이에요. 100을 곱해요.", "9": "분모를 100으로 만들어요. [9/25] = [36/100]이에요." } }, " %"],
        ["0.62 → ", { i: "62", why: { "6.2": "0.62에 10이 아니라 100을 곱해요.", "0.62": "0.62는 비율이에요. 0.62 × 100 = 62예요." } }, " %"],
        ["0.4 → ", { i: "40", why: { "4": "0.4에 10이 아니라 100을 곱해요. 0.4 × 100 = 40이에요.", "0.4": "0.4는 비율이에요. 100을 곱해요." } }, " %"]],
        { ok: "[3/20] = 15 %, [9/25] = 36 %, 0.62 = 62 %, 0.4 = 40 %예요." }) }
  ],
  challenge: { inst: "★ 도전 — 백분율 문제를 풀어 보세요.", hints: ["100칸 중 색칠한 칸 수가 곧 백분율이에요.", "모두 백분율로 바꾸면 비교하기 쉬워요. 0.48 = 48 %, [23/50] = 46 %예요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [
        ["[58/100]을 백분율로 쓰면 ", { i: "58" }, " %이고, ", { c: ["58 퍼센트", "58 대 100"], a: 0 }, "라고 읽어요."],
        ["[7/20] = ", { i: "0.35" }, " = ", { i: "35" }, " %"]], { ok: "[58/100] = 58 %(58 퍼센트), [7/20] = 0.35 = 35 %예요." }),
      (bx, ax) => quiz(bx, ax, [{ q: "전체에 대한 색칠한 부분은 몇 %일까요?", fig: () => ra4GridFig(10, 10, 47), o: ["47 %", "53 %", "0.47 %"], a: 0, why: { "1": "53칸은 색칠하지 않은 부분이에요.", "2": "0.47은 비율이에요. 백분율로는 47 %예요." } }], { ok: "100칸 중 47칸이니 47 %예요." }),
      { title: "비율이 낮은 것부터 차례로 눌러 보세요.", run: (bx, ax) => sequence(bx, ax, ["㉠ 0.48", "㉡ 45 %", "㉢ [23/50]", "㉣ 0.5"], [1, 2, 0, 3], { ok: "45 % < 46 % < 48 % < 50 %이니 ㉡, ㉢, ㉠, ㉣ 차례예요." }) }]) }
},
{
  id: "s7", no: 7, title: "선거와 할인 소식 ― 백분율이 사용되는 경우", soop: "개념 구축하기(O)",
  question: "생활에서 백분율은 어떤 경우에 사용될까요?",
  summary: "백분율은 투표율, 설문 조사 결과, 할인율, 불량품의 비율, 이자의 비율처럼 생활의 여러 곳에 쓰여요. (비교하는 양) ÷ (기준량)에 100을 곱하고 %를 붙여 나타낸 다음 비교해요. 할인 금액이 더 많다고 할인율이 꼭 더 높은 것은 아니에요.",
  steps: [
    { name: "만져 보기 — 어린이 회장 선거 투표율", inst: "아나운서 지호가 전교 어린이 회장 선거 소식을 전해요. “6학년 학생 160명 중 136명이 투표했어요.” 먼저 이중 테이프로 6학년 투표율을 알아보고, 5학년과 비교해 보세요.", hints: ["위 테이프 전체는 160명이고, 한 칸은 8명이에요. 136명만큼 색칠해요.", "5학년은 150명 중 132명이 투표했어요. [132/150] × 100을 해요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => ra4Tape2(bx, ax, { N: 160, unit: "명", steps: 20, target: 136, whole: "6학년 학생 수", part: "투표한 6학년 학생 수", mode: "pct",
          ask: [["6학년 투표율: [136/160] × 100 = ", { i: "85", why: { "24": "160 − 136 = 24는 투표하지 않은 학생 수예요." } }, " %"]], ok: "6학년 학생의 85 %가 투표했어요." }),
        (bx, ax) => ra4Chain(bx, ax, [
          ["5학년은 150명 중 132명이 투표했어요. 5학년 투표율: [132/150] × 100 = ", { i: "88" }, " %"],
          ["투표율이 더 높은 학년: ", { c: ["5학년", "6학년"], a: 0, why: { "1": "투표한 학생 수는 6학년이 더 많지만, 투표율은 5학년 88 %가 6학년 85 %보다 높아요." } }]],
          { ok: "5학년 88 % > 6학년 85 %예요. 투표한 학생 수가 적어도 투표율은 더 높을 수 있어요." })]) },
    { name: "그려 보기 — 좋아하는 방송 코너", inst: "방송부가 전교생 200명에게 가장 좋아하는 방송 코너를 물었어요. 각 코너를 고른 학생 수가 전체의 몇 %인지 나타내 보세요.", hints: ["설문에 답한 전체 200명이 기준량이에요.", "[84/200] × 100 = 42, [56/200] × 100 = 28이에요."],
      render: thenWhy((b, a) => { b.append(ra4Tbl(["방송 코너", "학생 수(명)", "백분율(%)"], [["① 음악 신청", "84", "?"], ["② 방송 퀴즈", "56", "?"], ["③ 학교 소식", "36", "?"], ["④ 날씨와 급식", "24", "?"], ["합계", "200", "100"]]));
        ra4Chain(b, a, [
          ["① 음악 신청 ", { i: "42" }, " %   ② 방송 퀴즈 ", { i: "28" }, " %"],
          ["③ 학교 소식 ", { i: "18" }, " %   ④ 날씨와 급식 ", { i: "12", why: { "24": "24명은 학생 수예요. [24/200] × 100을 해요." } }, " %"],
          ["30 % 이상인 코너: ", { c: ["음악 신청", "방송 퀴즈", "음악 신청, 방송 퀴즈"], a: 0, why: { "1": "방송 퀴즈는 28 %라서 30 %보다 낮아요.", "2": "방송 퀴즈는 28 %라서 30 %보다 낮아요." } }],
          ["20 % 미만인 코너를 모두 고르면: ", { c: ["학교 소식, 날씨와 급식", "날씨와 급식", "방송 퀴즈, 날씨와 급식"], a: 0, why: { "1": "학교 소식도 18 %라서 20 %보다 낮아요.", "2": "방송 퀴즈는 28 %예요. 학교 소식은 18 %예요." } }]],
          { ok: "음악 신청 42 %, 방송 퀴즈 28 %, 학교 소식 18 %, 날씨와 급식 12 %예요. 모두 더하면 100 %예요." }); },
        { q: "설문 결과를 학생 수 대신 백분율로 알리면 무엇이 좋을까요?", ph: "백분율로 알리면 ~", help: ["① 학생 수 84명만 들었을 때와 42 %를 들었을 때를 견주어요. → ② 전체 가운데 얼마만큼인지 알 수 있는지 생각해요.", "‘백분율로 알리면 전체를 ~으로 보고 ~인지 한눈에 알 수 있어요.’ 꼴로 써요."],
          ans: "백분율로 알리면 전체를 100으로 보고 얼마만큼인지 한눈에 알 수 있어요. 음악 신청 코너는 42 %라서 전체의 절반보다 조금 적은 학생이 골랐다는 것을 쉽게 알 수 있어요." }) },
    { name: "말해 보기 — 문구점 할인율", inst: "리포터 은재가 학교 앞 문구점 할인 행사를 취재했어요. 3000원짜리 스케치북을 할인하여 2400원에, 10000원짜리 필통을 할인하여 8500원에 팔아요. 판매 금액에 대한 할인 금액의 비율을 구하고, 할인 금액과 할인율을 견주어 써 보세요. 두 활동을 모두 해야 계단을 올라가요.", hints: ["할인 금액은 판매 금액 − 할인한 가격이에요.", "[600/3000] × 100 = 20, [1500/10000] × 100 = 15예요."],
      render: (b, a) => { ra4Chain(b, a, [
          ["할인 금액: 스케치북 3000 − 2400 = ", { i: "600" }, "(원), 필통 10000 − 8500 = ", { i: "1500" }, "(원)"],
          ["판매 금액에 대한 할인 금액의 비율: 스케치북 [600/3000] × 100 = ", { i: "20", why: { "80": "2400 ÷ 3000 × 100 = 80은 판매 금액에 대한 할인한 가격의 비율이에요. 할인 금액 600원을 판매 금액 3000원으로 나눠요." } }, " %, 필통 [1500/10000] × 100 = ", { i: "15", why: { "85": "할인한 가격 8500원이 아니라 할인 금액 1500원을 판매 금액으로 나눠요." } }, " %"],
          ["할인율이 더 높은 물건: ", { c: ["스케치북", "필통"], a: 0, why: { "1": "할인 금액은 필통이 더 많지만, 할인율은 스케치북 20 %가 필통 15 %보다 높아요." } }]],
          { ok: "스케치북 20 %, 필통 15 %예요. 할인 금액은 필통이 더 많아도 할인율은 스케치북이 더 높아요." });
        writeStep(b, a, [{ q: "할인 금액이 더 많은 물건이 할인율도 꼭 더 높을까요?", tag: "할인 금액과 할인율", ph: "아니에요. 할인 금액은 ~",
          help: ["① 스케치북과 필통의 할인 금액을 견주어요. → ② 두 물건의 할인율을 견주고, 할인율이 무엇을 기준으로 하는지 떠올려요.", "‘할인 금액은 ~이 더 많지만, 판매 금액에 대한 할인 금액의 비율은 ~이라서 ~.’ 꼴로 써요."],
          ans: "아니에요. 할인 금액은 필통이 1500원으로 더 많지만, 판매 금액에 대한 할인 금액의 비율은 스케치북이 20 %, 필통이 15 %라서 스케치북의 할인율이 더 높아요." }]); } },
    { name: "약속하기 — 생활 속 백분율", inst: "생활에서 백분율이 쓰이는 경우를 정리해요.", hints: ["투표율은 전체 학생 수가 기준량이에요.", "할인율은 판매 금액에 대한 할인 금액의 비율이에요."],
      render: (b, a) => blanks(b, a, ["백분율은 투표율, 설문 조사 결과, 물건의 ", { o: ["할인율", "무게"], a: 0 }, ", 불량품의 비율처럼 생활의 여러 곳에 쓰여요. 백분율로 나타내려면 (비교하는 양) ÷ (기준량)에 ", { o: ["100", "10"], a: 0 }, "을 곱하고 %를 붙여요. 할인율은 ", { o: ["판매 금액에 대한 할인 금액", "할인 금액에 대한 판매 금액"], a: 0 }, "의 비율이에요."],
        { ok: "생활 속 백분율도 기준량과 비교하는 양을 찾아 구해요." }) },
    { name: "확인하기 — 건전지 불량률", inst: "방송부가 마이크용 건전지를 두 가게에서 샀어요. 가 가게에서 산 건전지 400개 중 12개, 나 가게에서 산 건전지 250개 중 10개가 불량품이었어요. 산 건전지 수에 대한 불량품 수의 비율을 백분율로 나타내고 비교해 보세요.", hints: ["[12/400] × 100 = 3이에요.", "[10/250] × 100 = 4예요. 불량품의 비율이 낮을수록 좋은 가게예요."],
      render: (b, a) => ra4Chain(b, a, [
        ["가 가게: [12/400] × 100 = ", { i: "3", why: { "0.03": "0.03은 비율이에요. 100을 곱해 %로 나타내요." } }, " %"],
        ["나 가게: [10/250] × 100 = ", { i: "4", why: { "0.04": "0.04는 비율이에요. 100을 곱해 %로 나타내요." } }, " %"],
        ["불량품의 비율이 더 낮은 가게: ", { c: ["가 가게", "나 가게"], a: 0, why: { "1": "불량품 수는 나 가게가 더 적지만, 비율은 가 가게 3 %가 나 가게 4 %보다 낮아요." } }]],
        { ok: "가 가게 3 % < 나 가게 4 %예요. 불량품의 비율이 더 낮은 가 가게에서 사는 것이 좋겠어요." }) }
  ],
  challenge: { inst: "★ 도전 — 방송부 공연 예매율과 은행 이자의 비율을 백분율로 나타내 비교해 보세요.", hints: ["예매율은 전체 좌석 수가 기준량이에요. [255/300] × 100, [216/240] × 100을 해요.", "이자의 비율은 예금한 돈이 기준량이에요. [1500/50000] × 100, [2400/60000] × 100을 해요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Chain(bx, ax, [
        ["방송부 공연 1회는 300석 중 255석, 2회는 240석 중 216석이 예매되었어요. 1회 ", { i: "85" }, " %, 2회 ", { i: "90" }, " %"],
        ["전체 좌석 수에 대한 예매 좌석 수의 비율이 더 높은 공연: ", { c: ["1회", "2회"], a: 1, why: { "0": "예매 좌석 수는 1회가 더 많지만 예매율은 2회가 90 %로 더 높아요." } }]],
        { ok: "1회 85 %, 2회 90 %예요. 2회 공연의 예매율이 더 높아요." }),
      (bx, ax) => { bx.append(ra4Tbl(["은행", "1년 동안 예금한 돈(원)", "이자(원)"], [["가 은행", "50000", "1500"], ["나 은행", "60000", "2400"]])); ra4Chain(bx, ax, [
        ["예금한 돈에 대한 이자의 비율: 가 은행 ", { i: "3" }, " %, 나 은행 ", { i: "4" }, " %"],
        ["같은 돈을 예금한다면 이자를 더 많이 받을 수 있는 은행: ", { c: ["가 은행", "나 은행"], a: 1, why: { "0": "가 은행은 3 %, 나 은행은 4 %예요. 비율이 더 높은 은행에서 이자를 더 받아요." } }]],
        { ok: "가 은행 3 %, 나 은행 4 %예요. 같은 돈을 예금하면 이자의 비율이 더 높은 나 은행이 이익이에요." }); }]) }
},
{
  id: "s8", no: 8, title: "에너지 절약 캠페인 방송", soop: "탐구 정리하기(O)",
  question: "이번 달에 줄이려는 전기 사용량은 지난달 전기 사용량의 몇 %일까요?",
  summary: "kWh(킬로와트시)는 전기 사용량의 단위예요. 지난달 전기 사용량이 기준량, 줄이려는 전기 사용량이 비교하는 양이에요. 서윤이네는 18 : 300, 비율 [18/300] = 0.06, 백분율 6 %이고, 하준이네는 20 : 250, 비율 [20/250] = 0.08, 백분율 8 %예요. 비와 비율, 백분율을 차례로 구하면 생활 속 문제를 해결할 수 있어요.",
  steps: [
    { name: "만져 보기 — 전기 요금 청구서 읽기", inst: "방송부가 에너지 절약 캠페인 방송을 준비해요. 방송부장 서윤이가 집에서 받은 전기 요금 청구서를 가져왔어요. “지난달 우리 집 전기 사용량은 300 kWh래. 같은 넓이 집들의 평균보다 많아.” 청구서를 읽어 보세요.", hints: ["kWh(킬로와트시)는 전기 사용량의 단위예요.", "우리 집 막대의 끝이 우리 집 사용량이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "서윤이네 집의 지난달 전기 사용량은 몇 kWh일까요?", fig: () => ra4BillFig([240, 260, 280, 300, 320], 280, 300), o: ["300 kWh", "280 kWh", "320 kWh"], a: 0, why: { "1": "280 kWh는 같은 넓이 집들의 평균 사용량이에요.", "2": "320은 눈금의 끝이에요. 우리 집 막대의 끝을 읽어요." } },
        { q: "서윤이네 집은 평균 사용량과 비교하여 어떻게 사용했나요?", o: ["평균보다 20 kWh 많이 사용했어요.", "평균보다 20 kWh 적게 사용했어요."], a: 0, why: { "1": "300 kWh는 평균 280 kWh보다 많아요." } }],
        { ok: "서윤이네 집은 지난달 300 kWh를 사용해 평균(280 kWh)보다 20 kWh 많이 사용했어요." }) },
    { name: "그려 보기 — 줄일 가전제품 고르기", inst: "서윤이네 가족은 이번 달에 텔레비전 6 kWh, 에어컨 9 kWh, 컴퓨터 3 kWh만큼 사용을 줄이기로 했어요(다른 가전제품의 전기 사용량은 지난달과 같아요). 계획에 있는 가전제품을 모두 골라 보세요. 다 고르면 저절로 확인해요.", hints: ["텔레비전, 에어컨, 컴퓨터를 골라요.", "6 + 9 + 3을 계산해요. 지난달 전기 사용량이 기준량이에요."],
      render: (b, a) => ra4Save(b, a, { items: [{ name: "텔레비전", kwh: 6 }, { name: "헤어드라이어", kwh: 5 }, { name: "에어컨", kwh: 9 }, { name: "컴퓨터", kwh: 3 }, { name: "전기밥솥", kwh: 4 }], plan: [0, 2, 3],
        ask: () => [["줄이려는 전기 사용량: 6 + 9 + 3 = ", { i: "18" }, " (kWh)"],
          ["지난달 전기 사용량에 대한 줄이려는 전기 사용량의 비: ", { r: [18, 300], why: { "300:18": "지난달 전기 사용량 300이 기준량이에요. 오른쪽에 써요." } }],
          ["기준량 ", { i: "300" }, ", 비교하는 양 ", { i: "18" }]],
        ok: "줄이려는 전기 사용량은 18 kWh이고, 비는 18 : 300이에요." }) },
    { name: "말해 보기 — 몇 %일까요", inst: "이중 테이프의 위쪽을 줄이려는 전기 사용량만큼 색칠하고, 줄이려는 전기 사용량을 비율과 백분율로 나타내 보세요.", hints: ["위 테이프 한 칸은 6 kWh예요. 18 kWh는 3칸이에요.", "18 ÷ 300 = 0.06이고, 0.06 × 100 = 6이에요."],
      render: thenWhy((b, a) => ra4Tape2(b, a, { N: 300, unit: "kWh", steps: 50, target: 18, whole: "지난달 전기 사용량", part: "줄이려는 전기 사용량", mode: "pct",
        ask: [["비율: 분수 ", { f: "18/300" }, ", 소수 ", { i: "0.06", why: { "0.6": "18 ÷ 300 = 0.06이에요. 소수점 자리를 확인해요.", "16.6": "300 ÷ 18을 했어요. 18을 300으로 나눠요." } }],
          ["[18/300] × 100 = ", { i: "6", why: { "0.06": "0.06은 비율이에요. 100을 곱하고 %를 붙여요." } }, " → 6 %"]],
        ok: "서윤이네 가족이 줄이려는 전기 사용량은 지난달 전기 사용량의 6 %예요." }),
        { q: "이 문제에서 왜 지난달 전기 사용량이 기준량일까요?", ph: "줄이려는 전기 사용량을 ~과 비교하기 때문이에요", help: ["① ‘지난달 전기 사용량의 몇 %’에서 무엇을 무엇과 비교하는지 찾아요. → ② 기준이 되는 양을 골라 까닭을 써요.", "‘줄이려는 전기 사용량을 ~과 비교하기 때문이에요. ~이 기준량이에요.’ 꼴로 써요."],
          ans: "줄이려는 전기 사용량이 지난달 전기 사용량의 얼마만큼인지 알아보는 것이라서, 지난달 전기 사용량 300 kWh를 기준으로 비교하기 때문이에요." }) },
    { name: "약속하기 — 백분율로 나타내는 차례", inst: "생활 속 문제를 백분율로 해결하는 차례를 정리해요. 하는 차례대로 눌러 보세요.", hints: ["먼저 줄이려는 양을 모두 구해요.", "기준량과 비교하는 양을 찾은 다음 비율을 구하고, 마지막에 100을 곱해요."],
      render: (b, a) => sequence(b, a, ["㉠ 비율에 100을 곱해 %를 붙여요.", "㉡ 기준량과 비교하는 양을 찾아 비로 나타내요.", "㉢ (비교하는 양) ÷ (기준량)으로 비율을 구해요.", "㉣ 줄이려는 전기 사용량을 모두 더해요."], [3, 1, 2, 0],
        { ok: "줄이려는 양 구하기 → 기준량·비교하는 양 찾기 → 비율 구하기 → 백분율로 나타내기 차례예요." }) },
    { name: "확인하기 — 하준이네 가족", inst: "기자 하준이네 가족은 이번 달에 식기세척기 12 kWh, 진공청소기 8 kWh만큼 사용을 줄여 전기를 절약하려고 해요. 하준이네 집의 지난달 전기 사용량을 청구서에서 읽고, 줄이려는 전기 사용량은 지난달 전기 사용량의 몇 %인지 구해 보세요.", hints: ["서윤이네처럼 차례대로 구해요. 줄이려는 양은 12 + 8이에요.", "[20/250] = 0.08이고, 0.08 × 100 = 8이에요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "하준이네 집의 지난달 전기 사용량은 몇 kWh일까요?", fig: () => ra4BillFig([200, 220, 240, 260, 280], 240, 250), o: ["250 kWh", "240 kWh", "280 kWh"], a: 0, why: { "1": "240 kWh는 같은 넓이 집들의 평균 사용량이에요.", "2": "280은 눈금의 끝이에요. 우리 집 막대의 끝을 읽어요." } }], { ok: "하준이네 집은 250 kWh를 사용했어요." }),
        (bx, ax) => ra4Chain(bx, ax, [
          ["줄이려는 전기 사용량: 12 + 8 = ", { i: "20" }, " (kWh)"],
          ["비 ", { r: [20, 250], why: { "250:20": "지난달 전기 사용량 250이 기준량이에요." } }, ", 기준량 ", { i: "250" }, ", 비교하는 양 ", { i: "20" }],
          ["비율 ", { f: "20/250" }, " = ", { i: "0.08" }, ", 백분율 ", { i: "8", why: { "0.08": "0.08은 비율이에요. 100을 곱해요.", "12.5": "250 ÷ 20을 했어요. 20을 250으로 나눠요." } }, " %"]],
          { ok: "하준이네 가족이 줄이려는 전기 사용량은 지난달 전기 사용량의 8 %예요." })]) }
  ],
  challenge: { inst: "★ 도전 — 우리 집의 지난달 전기 사용량이 200 kWh라고 해요(이 앱에서 정한 수). 줄이고 싶은 가전제품을 골라 절약 계획을 세우고 몇 %인지 구한 다음, 캠페인 방송 원고를 써 보세요.", hints: ["고른 가전제품의 kWh를 모두 더해요.", "기준량이 200이니 (줄이려는 양) ÷ 200 × 100을 해요."],
    render: (b, a) => ra4Seq(b, a, [
      (bx, ax) => ra4Save(bx, ax, { items: [{ name: "에어컨", kwh: 12 }, { name: "텔레비전", kwh: 4 }, { name: "세탁기", kwh: 8 }, { name: "컴퓨터", kwh: 6 }, { name: "전기밥솥", kwh: 2 }, { name: "헤어드라이어", kwh: 2 }], btn: "이렇게 줄일래요",
        ask: s => [["줄이려는 전기 사용량: ", { i: String(s) }, " (kWh)"], ["지난달 전기 사용량에 대한 줄이려는 전기 사용량의 비: ", { r: [s, 200], why: { [`200:${s}`]: "지난달 전기 사용량 200이 기준량이에요." } }], ["백분율: ", { i: String(s / 2) }, " %"]],
        ok: "우리 집 절약 계획을 세우고 백분율로 나타냈어요." }),
      (bx, ax) => writeStep(bx, ax, [{ q: "내 절약 계획을 넣어 에너지 절약 캠페인 방송 원고를 한두 문장으로 써 보세요.", tag: "캠페인 원고", ph: "예) 우리 집은 이번 달에 ~를 줄여 지난달 전기 사용량의 ~ %를 아끼기로 했어요.",
        help: ["① 줄이기로 한 가전제품과 줄이려는 양을 떠올려요. → ② 지난달 사용량의 몇 %인지 넣어 친구들에게 함께하자고 권해요.", "‘우리 집은 ~를 줄여 지난달 전기 사용량의 ~ %를 아끼기로 했어요. 여러분도 ~.’ 꼴로 써요."],
        ans: "우리 집은 이번 달에 에어컨과 텔레비전 사용을 줄여 16 kWh를 아끼기로 했어요. 지난달 전기 사용량 200 kWh의 8 %예요. 여러분도 쓰지 않는 전기 제품의 전원을 꺼 주세요." }])]) }
},
{
  id: "s9", no: 9, title: "비율 퀴즈쇼 녹화 ― 비율이 같은 카드를 찾아요", soop: "발표하기(P)",
  question: "비, 비율, 백분율을 비교하여 비율이 같은 카드를 찾을 수 있을까요?",
  summary: "비가 적혀 있으면 비율로 바꾸고, 두 비율을 분수·소수·백분율 중 같은 표현으로 나타내어 비교해요. 예를 들어 2 : 5 = [2/5] = 0.4 = 40 %예요. 이 앱의 비와 비율 카드 24장은 이야기 버전에서 정한 카드예요(교과서 부록 카드와 달라요).",
  steps: [
    { name: "만져 보기 — 퀴즈쇼 놀이 방법", inst: "방송부가 ‘비율이 같은 카드를 찾아요!’ 퀴즈쇼를 녹화해요(인원 2~4명, 준비물: 비와 비율 카드 24장). 놀이 순서대로 눌러 보세요.", hints: ["먼저 카드를 섞어 뒤집어 놓고 순서를 정해요.", "카드 2장을 뒤집어 비율이 같은지 판단해요. 남은 카드가 없을 때 끝나요."],
      render: (b, a) => sequence(b, a, ["㉠ 남은 카드가 없을 때까지 놀이를 계속하고, 카드를 더 많이 가져간 사람이 이겨요.", "㉡ 카드 24장을 섞어 책상 위에 뒤집어 놓고, 가위바위보로 놀이 순서를 정해요.", "㉢ 비율이 같으면 카드를 가져오고 계속 뒤집어요. 비율이 다르면 다시 뒤집어 원래 자리에 두고 차례가 넘어가요.", "㉣ 순서대로 카드 2장을 골라 뒤집어요."], [1, 3, 2, 0],
        { ok: "카드 섞기 → 2장 뒤집기 → 비율이 같으면 가져오고, 다르면 다시 뒤집기 → 카드가 없을 때까지 반복해요." }) },
    { name: "그려 보기 — 리허설: 카드 두 장 비교", inst: "녹화 전에 리허설을 해요. 카드 두 장의 비율이 같은지 판단해 보세요.", hints: ["비는 (비교하는 양) ÷ (기준량)으로 비율을 구해요. 4 : 5 = [4/5] = 0.8이에요.", "백분율은 100으로 나누어 소수로 바꿔요. 80 % = 0.8, 6 % = 0.06이에요."],
      render: (b, a) => ra4Same(b, a, { pairs: [["4 : 5", "80 %"], ["3 : 10", "0.03"], ["[7/20]", "35 %"], ["0.6", "6 %"], ["15 : 20", "[3/4]"], ["5 : 2", "0.4"]],
        ok: "비율이 같은지 알맞게 판단했어요. 분수, 소수, 백분율 중 같은 표현으로 바꾸면 쉬워요." }) },
    { name: "말해 보기 — 퀴즈쇼 녹화", inst: "컴퓨터와 퀴즈쇼를 해요. 내 차례에 카드 2장을 뒤집고, 두 카드의 비율이 같은지 단추로 판단해요. 맞게 판단하면 카드를 가져오고 한 번 더 해요. 카드를 더 많이 가져간 사람이 이겨요.", hints: ["컴퓨터가 뒤집은 카드의 자리도 기억해 두면 짝을 찾기 쉬워요.", "비율이 같은 카드는 꼭 한 장씩 있어요. 비는 비율로, 백분율은 소수로 바꾸어 비교해요."],
      render: (b, a) => ra4Memory(b, a, { mem: .5 }) },
    { name: "약속하기 — 비율이 같은 카드 찾는 방법", inst: "퀴즈쇼를 하며 생각한 것을 정리해요.", hints: ["2 : 5 = [2/5] = 0.4 = 40 %예요.", "5 : 2는 기준량이 2라서 비율이 2.5예요."],
      render: (b, a) => quiz(b, a, [
        { q: "퀴즈쇼에서 이기려면 어떻게 하면 좋을까요?", o: ["뒤집었던 카드의 자리와 비율을 기억해요.", "카드를 아무렇게나 빨리 뒤집어요."], a: 0 },
        { q: "2 : 5와 비율이 같은 카드를 모두 골라요.", o: ["40 %", "[2/5]", "0.25", "5 : 2", "0.4"], a: [0, 1, 4] },
        { q: "두 카드의 비율이 같은지 어떻게 알 수 있을까요?", o: ["비는 비율로 바꾸고, 분수·소수·백분율 중 같은 표현으로 나타내어 비교해요.", "카드에 적힌 수의 생김새가 비슷한지 봐요."], a: 0 }],
        { bad: "2 : 5의 비율은 [2/5] = 0.4 = 40 %예요. 5 : 2는 비율이 2.5, 0.25는 25 %예요.", ok: "같은 표현으로 바꾸어 비교하면 비율이 같은 카드를 정확히 찾을 수 있어요." }) },
    { name: "확인하기 — 시청자 퀴즈 만들기", inst: "퀴즈쇼 마지막에 시청자 퀴즈를 내요. 먼저 짝이 아닌 카드를 찾고, 시청자에게 낼 카드 짝을 만들어 보세요.", hints: ["4 : 25 = [4/25] = [16/100] = 16 %예요.", "비율이 같은 비, 분수, 소수, 백분율을 하나씩 떠올려 짝을 지어요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "비율이 같은 카드끼리 짝 지은 것이 아닌 것을 골라요.", o: ["9 : 30 — [3/10]", "8 : 5 — 1.6", "[2/25] — 8 %", "4 : 25 — 0.4"], a: 3, why: { "0": "9 ÷ 30 = [9/30] = [3/10]이에요. 비율이 같아요.", "1": "8 ÷ 5 = 1.6이에요. 비율이 같아요.", "2": "[2/25] = [8/100] = 8 %예요. 비율이 같아요." } }], { ok: "4 : 25의 비율은 [4/25] = 0.16이에요. 0.4와 달라요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "시청자에게 낼 ‘비율이 같은 카드’ 한 쌍을 만들고, 왜 비율이 같은지 설명해 보세요.", tag: "시청자 퀴즈", ph: "예) ~ : ~ 카드와 ~ % 카드는 비율이 같아요. 왜냐하면 ~",
          help: ["① 비 하나를 정해 비율을 분수나 소수로 구해요. → ② 같은 비율을 다른 표현(백분율 등)으로 바꾸어 짝 카드를 만들어요.", "‘□ : △ 카드와 ○ % 카드는 비율이 같아요. □ ÷ △ = ~이고, ~ × 100 = ○이기 때문이에요.’ 꼴로 써요."],
          ans: "6 : 20 카드와 30 % 카드는 비율이 같아요. 6 ÷ 20 = [6/20] = 0.3이고, 0.3 × 100 = 30이라서 30 %이기 때문이에요." }])]) }
  ],
  challenge: { inst: "★ 도전 — 또 다른 놀이: 네 사람이 비율 카드를 동시에 한 장씩 뒤집고, 비율이 가장 높은 사람이 뒤집은 카드를 모두 가져가요. 4판부터는 규칙을 바꾸어 비율이 가장 낮은 사람이 가져가요. 비율 카드 24장으로 6판을 해 보세요.", hints: ["분수, 소수, 백분율을 모두 소수로 바꾸면 비교하기 쉬워요.", "[22/25] = 0.88, [3/20] = 0.15, 58 % = 0.58이에요."],
    render: (b, a) => ra4High(b, a, {}) }
},
{
  id: "s10", no: 10, title: "여론 조사 특집 방송 ― 배운 것을 발표해요", soop: "발표하기(P)",
  question: "비와 비율, 백분율로 우리 반 여론 조사 결과를 전할 수 있을까요?",
  summary: "한 양을 기준으로 다른 양이 몇 배가 되는지 비교하기 위해 기호 : 을 사용하여 나타낸 것이 비예요. 3 : 5에서 3은 비교하는 양, 5는 기준량이에요. 기준량에 대한 비교하는 양의 크기가 비율이고, 3 : 5의 비율은 [3/5] = 0.6이에요. 기준량을 100으로 할 때의 비율이 백분율이고, 0.6은 60 %예요.",
  steps: [
    { name: "만져 보기 — 무대 배경 물감 섞기", inst: "특집 방송 무대 배경을 칠할 분홍색 물감을 만들어요. 빨간색 물감 20 g과 흰색 물감 50 g을 섞으면 분홍색 물감 한 통이 돼요. 통을 두 개로 늘려 보고, 표를 완성하여 두 양을 비교해 보세요.", hints: ["한 통이 늘 때마다 빨간색 20 g, 흰색 50 g이 늘어나요.", "50 ÷ 20 = [50/20] = [5/2] = 2.5예요. 몇 통이든 같아요."],
      render: (b, a) => ra4Build(b, a, { what: "분홍색 물감", head: "분홍색 물감 통 수", unit: "통", prod: "box", start: 1, target: 2, max: 4,
        items: [{ name: "빨간색 물감의 양", per: 20, unit: "g", icon: "redpaint", lump: true }, { name: "흰색 물감의 양", per: 50, unit: "g", icon: "whitepaint", lump: true }],
        ask: [["세 통: 빨간색 물감 60 g, 흰색 물감 ", { i: "150" }, " g"], ["네 통: 빨간색 물감 ", { i: "80" }, " g, 흰색 물감 ", { i: "200" }, " g"],
          ["다섯 통일 때 흰색 물감의 양은 빨간색 물감의 양의 ", { i: "2.5", w: true, why: { "150": "250 − 100 = 150은 차이예요. 250 ÷ 100을 해요." } }, "배예요. (분수나 소수로 써요)"]],
        ok: "흰색 물감의 양은 언제나 빨간색 물감의 양의 [5/2]배(2.5배)예요." }) },
    { name: "그려 보기 — 비와 비율 잇기", inst: "특집 방송 간식 상자에 주스 2병과 쿠키 5개가 있어요. 비로 나타내고, 비율이 같은 것끼리 이어 보세요.", hints: ["‘주스 수에 대한’이니 주스 수 2가 기준량이에요.", "8 : 20 = [8/20] = [2/5] = 0.4 = 40 %예요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => { bx.append(ra4sTreatFig()); ra4Chain(bx, ax, [
          ["주스 수와 쿠키 수의 비 ", { r: [2, 5], why: { "5:2": "‘주스 수와 쿠키 수의 비’는 주스 수를 앞에, 쿠키 수를 뒤에 써요." } }],
          ["주스 수에 대한 쿠키 수의 비 ", { r: [5, 2], why: { "2:5": "‘주스 수에 대한’이니 주스 수 2가 기준량이에요. 오른쪽에 써요." } }]], { ok: "주스 수와 쿠키 수의 비는 2 : 5, 주스 수에 대한 쿠키 수의 비는 5 : 2예요." }); },
        { title: "비율이 같은 것끼리 이어 보세요.", run: (bx, ax) => ra4Link(bx, ax, { heads: ["비", "분수", "소수", "백분율"], cols: [["8 : 20", "9 : 15", "7 : 28"], ["[3/5]", "[1/4]", "[2/5]"], ["0.25", "0.4", "0.6"], ["60 %", "40 %", "25 %"]],
          ok: "8 : 20 — [2/5] — 0.4 — 40 %, 9 : 15 — [3/5] — 0.6 — 60 %, 7 : 28 — [1/4] — 0.25 — 25 %예요." }) }]) },
    { name: "말해 보기 — 여론 조사 결과 살펴보기", inst: "방송부가 우리 반 학생 25명에게 ‘쉬는 시간을 10분 늘리는 것’에 찬성하는지 물었더니 15명이 찬성하고 나머지는 반대했어요. 결과를 잘못 설명한 것을 찾고 까닭을 써 보세요.", hints: ["반대한 학생은 25 − 15 = 10명이에요.", "[10/25] × 100을 해 봐요."],
      render: (b, a) => ra4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "잘못 설명한 것을 골라요.", o: ["㉠ 전체 학생 수에 대한 찬성한 학생 수의 비율은 [3/5]입니다.", "㉡ 반대한 학생 수에 대한 찬성한 학생 수의 비는 15 : 10입니다.", "㉢ 반대한 학생 수는 전체 학생 수의 4 %입니다."], a: 2,
          why: { "0": "15 ÷ 25 = [15/25] = [3/5]이에요. 맞는 설명이에요.", "1": "반대한 학생은 25 − 15 = 10명이고, 반대한 학생 수가 기준량이라 15 : 10이에요. 맞는 설명이에요." } }], { ok: "㉢이 잘못 설명했어요." }),
        (bx, ax) => ra4Chain(bx, ax, [["까닭: 반대한 학생 수는 전체 학생 수의 [10/25] × 100 = ", { i: "40", why: { "4": "[10/25] = 0.4예요. 0.4에 100을 곱해야 백분율이에요.", "60": "60 %는 찬성한 학생의 백분율이에요. 반대한 학생은 10명이에요." } }, " %이기 때문이에요."]], { ok: "반대한 학생 수는 전체 학생 수의 40 %, 찬성한 학생 수는 60 %예요." })]) },
    { name: "약속하기 — 비, 비율, 백분율 정리", inst: "특집 방송에서 소개할 내용을 정리해요.", hints: ["3 : 5에서 오른쪽 5가 기준량이에요.", "0.6 × 100 = 60이에요."],
      render: (b, a) => blanks(b, a, ["한 양을 기준으로 다른 양이 몇 배가 되는지 비교하기 위해 기호 :을 사용하여 나타낸 것을 ", { o: ["비", "백분율"], a: 0 }, "라고 합니다. 3 : 5에서 3은 ", { o: ["비교하는 양", "기준량"], a: 0 }, ", 5는 ", { o: ["비교하는 양", "기준량"], a: 1 }, "입니다. 기준량에 대한 비교하는 양의 크기를 비율이라고 하고, 3 : 5의 비율은 [3/5] = ", { o: ["0.6", "1.6"], a: 0 }, "입니다. 기준량을 ", { o: ["100", "10"], a: 0 }, "으로 할 때의 비율을 백분율이라고 하고, 0.6은 ", { o: ["60 %", "6 %"], a: 0 }, "라고 씁니다."],
        { ok: "비, 비율, 백분율을 잘 정리했어요. 다음 단원에서는 이 비율로 띠그래프와 원그래프를 그려요." }) },
    { name: "확인하기 — 특집 방송 원고 쓰기", inst: "1차시에 붙인 ‘궁금해요’ 쪽지를 다시 보고, 여론 조사 특집 방송 원고를 써서 발표해 보세요.", hints: ["궁금했던 것 중 하나를 골라 배운 것(비, 비율, 백분율)으로 답해요.", "여론 조사 결과는 ‘전체 ~명 중 ~명, 곧 ~ %’처럼 백분율을 넣어 전해요."],
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "1차시에 궁금했던 것 중 하나를 골라, 이 단원에서 배운 것으로 답해 보세요.", tag: "궁금했던 것의 답", ph: "예) 투표한 학생이 전체의 얼마만큼인지는 ~로 나타내요.",
          help: ["① 위의 ‘궁금했던 것’ 쪽지 중 하나를 골라요. → ② 비, 비율, 백분율 중 무엇으로 답할 수 있는지 찾아 수를 넣어 써요.", "‘~이 궁금했어요. ~을 기준량으로 하면 비율은 ~이고, 백분율로 ~ %예요.’ 꼴로 써요."],
          ans: "투표한 학생이 전체의 얼마만큼인지 궁금했어요. 전체 학생 수 160명을 기준량으로 하면 투표한 136명의 비율은 [136/160] = 0.85이고, 백분율로 85 %예요." },
        { q: "우리 반 여론 조사 결과(25명 중 15명 찬성)를 비율이나 백분율을 넣어 특집 방송 원고로 써 보세요.", tag: "특집 방송 원고", ph: "예) 우리 반 학생 25명 중 ~명이 찬성했어요. ~",
          help: ["① 전체 학생 수와 찬성한 학생 수를 찾아 비율을 구해요. → ② 백분율로 바꾸어 듣는 사람이 알기 쉽게 써요.", "‘우리 반 학생 25명 중 ~명이 찬성했어요. 찬성한 학생은 전체의 ~ %예요.’ 꼴로 써요."],
          ans: "우리 반 학생 25명 중 15명이 쉬는 시간 늘리기에 찬성했어요. 찬성한 학생은 전체의 [15/25] = 0.6, 곧 60 %이고, 반대한 학생은 40 %예요." }], { ok: "특집 방송 원고를 완성했어요! 친구들 앞에서 아나운서처럼 발표해 봐요." })) }
  ],
  challenge: { inst: "★ 도전 — 방송부 기념품 가게의 할인율을 비교하고, 비율이 가장 높은 것을 찾아보세요.", hints: ["할인 금액은 배지 400원, 열쇠고리 450원이에요.", "모두 백분율로 바꾸어 비교해요. 0.42 = 42 %, [11/25] = 44 %, 9 : 20 = 45 %예요."],
    render: (b, a) => ra4Seq(b, a, [
      { title: "판매 금액이 2000원인 배지를 1600원에, 3000원인 열쇠고리를 2550원에 팔아요.", run: (bx, ax) => ra4Tape2(bx, ax, { N: 2000, unit: "원", steps: 100, target: 400, whole: "배지 판매 금액", part: "배지 할인 금액", mode: "pct",
        ask: [["배지 할인 금액 2000 − 1600 = ", { i: "400" }, "(원), 할인율 [400/2000] × 100 = ", { i: "20", why: { "80": "1600원은 할인한 뒤의 가격이에요. 할인 금액 400원을 판매 금액으로 나눠요." } }, " %"],
          ["열쇠고리 할인 금액 3000 − 2550 = ", { i: "450" }, "(원), 할인율 [450/3000] × 100 = ", { i: "15" }, " %"],
          ["할인율이 더 높은 기념품: ", { c: ["배지", "열쇠고리"], a: 0, why: { "1": "할인 금액은 열쇠고리가 더 많지만, 할인율은 배지 20 %가 열쇠고리 15 %보다 높아요." } }]],
        ok: "배지 20 % > 열쇠고리 15 %예요." }) },
      (bx, ax) => quiz(bx, ax, [{ q: "비율이 가장 높은 것을 골라요.", o: ["㉠ 0.42", "㉡ [11/25]", "㉢ 43 %", "㉣ 9 : 20"], a: 3, why: { "0": "0.42 = 42 %예요. 9 : 20 = 45 %보다 낮아요.", "1": "[11/25] = [44/100] = 44 %예요. 45 %보다 낮아요.", "2": "43 %는 9 : 20 = 45 %보다 낮아요." } }], { ok: "0.42 = 42 %, [11/25] = 44 %, 43 %, 9 : 20 = [9/20] = 45 %이니 ㉣이 가장 높아요." })]) }
}
];
