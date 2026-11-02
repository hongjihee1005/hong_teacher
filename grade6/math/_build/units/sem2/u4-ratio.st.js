//@@APP
const APP={title:"우리 반 초록 텃밭 프로젝트", unit:"6-2 수학 4. 비례식과 비례배분", key:"s62-ratio-v1", welcome:"우리 반 초록 텃밭 프로젝트에 온 것을 환영해요", intro:"푸른초등학교 6학년 2반 친구들과 학교 텃밭을 가꾸며, 화분 흙 섞기·액비 물 타기·모종 심기·빗물 모으기·수확물 나누기·텃밭 요리에서 비의 성질, 비례식과 그 성질, 비례배분을 알아봐요."};
//@@UNIT
/* =========================================================
   6-2 수학 4. 비례식과 비례배분 — 단원 조작 부품 (앞글자 rp4) · 이야기 버전
   교과서 버전(u4-ratio.tb.js)의 rp4 부품을 복사해 쓰고, 단추로 확인하던 부품은 아래 '이야기 버전' 묶음에서 저절로 확인하게 다시 썼어요.
   rp4Chain   빈칸 줄(수·분수·비 □ : □·고르기 칩)        rp4Seq   여러 활동을 차례로
   rp4Build   재료 세트를 더하거나 빼며 두 양의 비 만들기(필통·샌드위치·신발·크레파스)
   rp4Machine 전항과 후항에 같은 수를 곱하기·나누기·더하기(모양 비교)
   rp4Simp    소수·분수의 비에 10·100·공배수를 곱하고 공약수로 나누어 간단한 자연수의 비로
   rp4Terms   비례식에서 외항 ◯, 내항 △ 표시하기
   rp4Area    외항의 곱·내항의 곱을 직사각형 넓이로 — 모르는 변을 끌어 넓이를 같게
   rp4Dbl     두 줄 수직선(이중 수직선)에서 짝이 되는 값 찾기
   rp4Gear    톱니바퀴 돌리기          rp4Tape  띠를 끌어 주어진 비로 나누기(비례배분)
   rp4Clay    비 카드를 골라 비례배분 문제 완성하기     rp4Dice  주사위로 비례식 만들기
   rp4Rect    가로·세로의 비가 같은 직사각형 만들기    rp4Scene 새 활용 체험관 둘러보기
   rp4Hand · rp4Meet · rp4Match   10차시 '짝을 찾아 비례식을 세워요' 놀이
   글 속 [3/5] 은 화면에서 세로 분수로, [1 1/2] 는 대분수로 보여요.
   ========================================================= */
/* ---------- 유리수 셈 ---------- */
const rp4G = (a, b) => b ? rp4G(b, a % b) : Math.abs(a);
function rp4Q(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = rp4G(n, d) || 1; return { n: n / g, d: d / g }; }
const rp4Mul = (x, y) => rp4Q(x.n * y.n, x.d * y.d);
const rp4DivQ = (x, y) => rp4Q(x.n * y.d, x.d * y.n);
const rp4Add = (x, y) => rp4Q(x.n * y.d + y.n * x.d, x.d * y.d);
const rp4EqQ = (x, y) => x.n * y.d === y.n * x.d;
/* "12" · "0.8" · "2/3" · "[2/3]" · "1 1/2" → 유리수 */
function rp4P(s) {
  s = String(s == null ? "" : s).trim().replace(/^\[|\]$/g, "").replace(/[,\s]+/g, " ").trim();
  let m;
  if ((m = s.match(/^(\d+)$/))) return rp4Q(+m[1], 1);
  if ((m = s.match(/^(\d*)\.(\d+)$/))) return rp4Q(+((m[1] || "0") + m[2]), 10 ** m[2].length);
  if ((m = s.match(/^(?:(\d+) )?(\d+)\/(\d+)$/))) { const d = +m[3]; if (!d) return null; return rp4Q((m[1] ? +m[1] * d : 0) + +m[2], d); }
  return null;
}
/* 소수로 쓸 수 있으면 소수 글, 아니면 null */
function rp4Dec(q) {
  let k = 0; while (k < 6 && (10 ** k) % q.d) k++;
  if ((10 ** k) % q.d) return null;
  const v = q.n * (10 ** k / q.d); if (!k) return String(v);
  const s = String(v).padStart(k + 1, "0"); return s.slice(0, -k) + "." + s.slice(-k);
}
const rp4Fr = q => q.d === 1 ? String(q.n) : `[${q.n}/${q.d}]`;
function rp4Mix(q) { if (q.d === 1) return String(q.n); const w = Math.floor(q.n / q.d), r = q.n % q.d; return w ? `[${w} ${r}/${q.d}]` : `[${r}/${q.d}]`; }
const rp4Show = (q, mode) => mode === "dec" ? (rp4Dec(q) || rp4Fr(q)) : mode === "mix" ? rp4Mix(q) : rp4Fr(q);
/* "2 : 3" · "[1/2] : [1/3]" → {a, b, v(비율)} */
function rp4R(t) { const [x, y] = String(t).split(":").map(s => rp4P(s.trim())); return { a: x, b: y, v: rp4DivQ(x, y), t: String(t) }; }
const rp4Same = (r1, r2) => rp4EqQ(r1.v, r2.v);

/* ---------- 분수 표기 (글 속 [3/5]) ---------- */
const RP4_SRC = "\\[(?:(\\d+|□) )?([0-9□]+)\\/([0-9□]+)\\]";
const rp4Re = () => new RegExp(RP4_SRC, "g");
function rp4Plain(s) { return String(s == null ? "" : s).replace(rp4Re(), (m, w, n, d) => `${w ? w + "과 " : ""}${d}분의 ${n}`); }
/* 받침에 맞는 조사(분수는 분자를 마지막에 읽음) */
function rp4J(s, pair) {
  const str = String(s), core = str.replace(/\/[0-9□]+\]/g, "]"), digits = core.replace(/[^0-9]/g, "");
  const c = /[0-9]\]?\s*$/.test(core) ? digits[digits.length - 1] : core.replace(/[\]\s]+$/, "").slice(-1);
  let has = false, rieul = false;
  const lat = core.match(/(mL|kg|km|cm|g|m|L)\s*$/);
  if (lat) { has = /^(g|kg)$/.test(lat[1]); }
  else if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"] };
  const [a, b] = M[pair];
  if (pair === "으로") return str + (has && !rieul ? a : b);
  return str + (has ? a : b);
}
function rp4FracEl(w, n, d) {
  return h("span", { class: "rp4fr" }, w != null && w !== "" ? h("span", { class: "rp4fw" }, String(w)) : null,
    h("span", { class: "rp4fq" }, h("span", { class: "rp4fn" }, String(n)), h("span", { class: "rp4fd" }, String(d))));
}
function rp4RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = rp4Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(rp4FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function rp4RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return rp4RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(rp4RenderText);
}
(function rp4Style() {
  const s = document.createElement("style"); s.id = "rp4-style";
  s.textContent = `
.rp4fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.rp4fw{margin-right:.1em}
.rp4fq{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.rp4fq>.rp4fn{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.rp4fq>.rp4fd{padding:.05em .14em 0}
.rp4fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none;max-height:64vh}
.rp4part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.rp4chain{margin:.3em 0}
.rp4cl{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .35em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);margin:.45em 0;line-height:1.8;word-break:keep-all}
.rp4tag{background:var(--pine-soft);color:var(--pine);border-radius:.5em;padding:0 .55em;font-size:.85em}
input.rp4i{box-sizing:border-box;width:3.4em;height:1.7em;padding:0 .15em;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.02);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink);max-width:100%}
input.rp4i.rp4w{width:5em}
.rp4fin{display:inline-flex;flex-direction:column;align-items:stretch;gap:.12em;vertical-align:middle}
.rp4fin input.rp4i{width:2.6em;height:1.5em}
.rp4bar{display:block;height:.17em;background:var(--ink);border-radius:.1em}
.rp4rin{display:inline-flex;align-items:center;gap:.25em}
.rp4chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.rp4chs .opt{padding:.05em .6em}
.opt.rp4on{border-color:var(--ring);background:var(--ring-soft)}
.rp4tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.45em 0}
.rp4tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em;font-family:Jua,sans-serif}
.rp4tools button.rp4sel{background:var(--night);color:#fff;border-color:var(--night)}
.rp4tools button:disabled{opacity:.45}
.rp4read{font-family:Jua,sans-serif;font-size:var(--fs);color:var(--night);line-height:1.6;word-break:keep-all;margin:.25em 0}
.rp4note{font-size:var(--fs-s);color:var(--muted);margin:.2em 0}
.rp4tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.rp4tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.rp4tbl th,.rp4tbl td{border:1.5px solid var(--line);padding:.25em .65em;text-align:center}
.rp4tbl th{background:#F2F5F4;font-family:Jua,sans-serif;font-weight:400}
.rp4hist{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);background:#F7FAF8;border:2px solid var(--line);border-radius:.7em;padding:.35em .7em;margin:.35em 0;line-height:2;word-break:keep-all}
.rp4big{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.6);color:var(--night);text-align:center;margin:.2em 0}
.rp4step{display:inline-flex;align-items:center;gap:.3em}
.rp4step b{min-width:2em;text-align:center;font-family:Jua,sans-serif;font-size:1.2em}
.rp4cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,8.2em),1fr));gap:.5em;margin:.4em 0}
.rp4card{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.15);min-height:2.8em;border:3px solid var(--night);border-radius:.7em;background:#FFFDF6;display:flex;align-items:center;justify-content:center;padding:.2em .3em;cursor:pointer;color:var(--ink)}
.rp4card.rp4pk{background:var(--ring-soft);border-color:var(--ring)}
.rp4card.rp4dn{background:var(--pine-soft);border-color:var(--ok);cursor:default}
.rp4card.rp4gone{opacity:.35;cursor:default}
.rp4card:disabled{cursor:default}
.rp4recipe{border:3px solid var(--night);border-radius:var(--r);background:#FFFDF6;padding:.5em .9em;margin:.3em 0;word-break:keep-all}
.rp4recipe b{font-family:Jua,sans-serif;font-weight:400;color:var(--pine);font-size:1.08em}
.rp4recipe ol{margin:.3em 0 .1em 1.2em;padding:0}
.rp4meet{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.6em 1em;align-items:start}
.rp4meet>div{border:2px solid var(--line);border-radius:.8em;padding:.4em .6em}
.rp4lbl{font-family:Jua,sans-serif;color:var(--pine)}
.rp4props{display:flex;flex-direction:column;gap:.2em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);margin:.3em 0}
.rp4box{border:2px solid var(--line);border-radius:.8em;padding:.4em .7em;margin:.45em 0}
`;
  document.head.append(s);
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") rp4RenderText(m.target); else m.addedNodes.forEach(rp4RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(rp4Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
/* 엔진 부품의 '답 따라 쓰기' 글은 읽는 말(5분의 3)로 */
function rp4A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(rp4Plain) }) }); }
const rp4Quiz0 = quiz, rp4Blanks0 = blanks;
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done( 을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return rp4Quiz0(body, rp4A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return rp4Blanks0(body, rp4A(api), parts, o); };

/* SVG 글: [분수]는 쌓은 분수로 */
function rp4Cw(ch, s) { return /[가-힣]/.test(ch) ? s * .95 : /[0-9]/.test(ch) ? s * .56 : ch === " " ? s * .3 : /[A-Za-z]/.test(ch) ? s * .55 : s * .6; }
function rp4SvgLine(str, x, y, size = 24, opt = {}) {
  const g = svgEl("g", { "pointer-events": "none" }), fs = size * .8, fill = opt.fill || INK;
  const segs = []; let last = 0; const re = rp4Re(); let m; const S = String(str);
  while ((m = re.exec(S))) { if (m.index > last) segs.push({ t: S.slice(last, m.index) }); segs.push({ w: m[1], n: m[2], d: m[3] }); last = m.index + m[0].length; }
  if (last < S.length) segs.push({ t: S.slice(last) });
  const tw = t => [...t].reduce((a, c) => a + rp4Cw(c, size), 0);
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
  g.w = total;
  return g;
}
const rp4Go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
function rp4Tbl(head, rows) {
  return h("div", { class: "rp4tbl" }, h("table", {}, h("tr", {}, head.map(t => h("th", {}, t))), rows.map(r => h("tr", {}, r.map((c, i) => i === 0 ? h("th", {}, c) : h("td", {}, c))))));
}
/* 만지기가 끝난 뒤: ask(빈칸 줄)이 있으면 열고, 없으면 끝 */
function rp4Finish(body, api, opt, ans, msg) {
  const ask = typeof opt.ask === "function" ? opt.ask() : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 빈칸도 채워 봐요."); const box = h("div", { class: "rp4part" }); body.append(box); rp4Chain(box, api, ask, { ok: opt.ok, bad: opt.bad, words: opt.words }); rp4Go(box); }
  else api.done(ans, opt.ok || msg);
}
/* 여러 활동을 차례로 */
function rp4Seq(body, api, parts) {
  let k = 0; const host = h("div"); body.append(host);
  const run = () => {
    const box = h("div", { class: k ? "rp4part" : "" }); host.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); rp4Go(host.lastChild);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}

/* ---------- ① 빈칸 줄 ----------
   lines: [ 토막… ] 또는 {t:"이름표", p:[토막…]}
   토막: "글" | {i:"답"(수·글), w, why} | {f:"3/10"(분수, 값이 같으면 정답), why} | {r:[a,b], any(같은 비율의 자연수 비 모두 정답)} | {c:[…], a:번호, why:{번호:"까닭"}} */
function rp4Inp(wide, label) {
  const i = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "rp4i" + (wide ? " rp4w" : ""), "aria-label": label || "빈칸" });
  return i;
}
function rp4FIn() {
  const n = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "rp4i", "aria-label": "분자" });
  const d = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "rp4i", "aria-label": "분모" });
  const el = h("span", { class: "rp4fin" }, n, h("span", { class: "rp4bar" }, "​"), d);
  el.get = () => { const N = n.value.trim(), D = d.value.trim(); if (!/^\d+$/.test(N) || !/^\d+$/.test(D) || +D === 0) return null; return rp4Q(+N, +D); };
  el.txt = () => `${n.value.trim() || "-"}/${d.value.trim() || "-"}`;
  el.paint = c => [n, d].forEach(x => { x.style.borderColor = c; });
  return el;
}
function rp4RIn() {
  const a = rp4Inp(false, "전항"), b = rp4Inp(false, "후항");
  const el = h("span", { class: "rp4rin" }, a, h("span", {}, ":"), b);
  el.get = () => [rp4P(a.value), rp4P(b.value)];
  el.txt = () => `${a.value.trim() || "-"} : ${b.value.trim() || "-"}`;
  el.paint = c => [a, b].forEach(x => { x.style.borderColor = c; });
  return el;
}

/* ---------- 그림 조각 ---------- */
function rp4Icon(kind, x, y, s, lab) {
  const g = svgEl("g", { transform: `translate(${x},${y})` });
  const A = (t, a) => { const e = svgEl(t, a); g.append(e); return e; };
  if (kind === "btn") { A("circle", { r: s * .38, fill: "#F2B04A", stroke: "#B77514", "stroke-width": 2 }); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => A("circle", { cx: i * s * .1, cy: j * s * .1, r: s * .045, fill: "#8A5208" })); }
  else if (kind === "leather") { A("rect", { x: -s * .45, y: -s * .3, width: s * .9, height: s * .6, rx: 5, fill: "#B07A4C", stroke: "#6E4320", "stroke-width": 2 }); A("rect", { x: -s * .36, y: -s * .21, width: s * .72, height: s * .42, rx: 3, fill: "none", stroke: "#F3DDC3", "stroke-width": 1.5, "stroke-dasharray": "4 3" }); }
  else if (kind === "egg") A("ellipse", { rx: s * .3, ry: s * .38, fill: "#FFF6DF", stroke: "#C9A25D", "stroke-width": 2 });
  else if (kind === "bread") A("path", { d: `M${-s * .4},${s * .38}V${-s * .1}A${s * .4},${s * .3} 0 0 1 ${s * .4},${-s * .1}V${s * .38}Z`, fill: "#F3C77B", stroke: "#B9802E", "stroke-width": 2 });
  else if (kind === "bottle") { A("rect", { x: -s * .18, y: -s * .22, width: s * .36, height: s * .6, rx: 5, fill: "#CBEAF6", stroke: "#2B7BD6", "stroke-width": 2 }); A("rect", { x: -s * .08, y: -s * .4, width: s * .16, height: s * .2, fill: "#2B7BD6" }); }
  else if (kind === "bark") { A("path", { d: `M${-s * .42},${-s * .25}L${s * .3},${-s * .32}L${s * .44},${s * .1}L${s * .1},${s * .32}L${-s * .4},${s * .22}Z`, fill: "#8B6239", stroke: "#53381D", "stroke-width": 2 }); }
  else if (kind === "crayon") { A("rect", { x: -s * .4, y: -s * .13, width: s * .62, height: s * .26, rx: 3, fill: "#E2574C", stroke: "#962A21", "stroke-width": 2 }); A("path", { d: `M${s * .22},${-s * .13}L${s * .42},0L${s * .22},${s * .13}Z`, fill: "#F6D3A7", stroke: "#962A21", "stroke-width": 2 }); }
  else if (kind === "old") { A("rect", { x: -s * .4, y: -s * .2, width: s * .3, height: s * .18, rx: 2, fill: "#A9B4B0", stroke: "#5D6763", "stroke-width": 1.5, transform: "rotate(-14)" }); A("rect", { x: 0, y: -s * .02, width: s * .34, height: s * .18, rx: 2, fill: "#C8B9A3", stroke: "#5D6763", "stroke-width": 1.5, transform: "rotate(10)" }); A("rect", { x: -s * .2, y: s * .14, width: s * .28, height: s * .16, rx: 2, fill: "#B7C9DA", stroke: "#5D6763", "stroke-width": 1.5 }); }
  else if (kind === "case") { A("rect", { x: -s * .48, y: -s * .2, width: s * .96, height: s * .4, rx: s * .18, fill: "#C08A57", stroke: "#6E4320", "stroke-width": 2 }); A("line", { x1: -s * .38, y1: 0, x2: s * .38, y2: 0, stroke: "#FFE7B8", "stroke-width": 2, "stroke-dasharray": "3 3" }); A("circle", { cx: s * .32, cy: 0, r: s * .06, fill: "#F2B04A" }); }
  else if (kind === "sandwich") { A("path", { d: `M${-s * .45},${s * .3}L0,${-s * .35}L${s * .45},${s * .3}Z`, fill: "#F3C77B", stroke: "#B9802E", "stroke-width": 2 }); A("path", { d: `M${-s * .3},${s * .12}L${s * .3},${s * .12}`, stroke: "#FFE45C", "stroke-width": 5 }); }
  else if (kind === "shoe") { A("path", { d: `M${-s * .48},${s * .22}L${-s * .45},${-s * .2}L${-s * .12},${-s * .22}L${s * .05},${-s * .02}L${s * .4},${s * .04}Q${s * .5},${s * .1} ${s * .48},${s * .22}Z`, fill: "#9FD3B0", stroke: "#2E7A4C", "stroke-width": 2 }); A("line", { x1: -s * .48, y1: s * .16, x2: s * .48, y2: s * .16, stroke: "#53381D", "stroke-width": 3 }); }
  else if (kind === "newcr") { A("rect", { x: -s * .42, y: -s * .16, width: s * .64, height: s * .32, rx: 4, fill: "#7D5BD6", stroke: "#45308A", "stroke-width": 2 }); A("path", { d: `M${s * .22},${-s * .16}L${s * .45},0L${s * .22},${s * .16}Z`, fill: "#C9B6F5", stroke: "#45308A", "stroke-width": 2 }); A("rect", { x: -s * .3, y: -s * .16, width: s * .2, height: s * .32, fill: "#FFE45C" }); }
  else if (kind === "wallet") { A("rect", { x: -s * .4, y: -s * .28, width: s * .8, height: s * .56, rx: 5, fill: "#E9F3FB", stroke: "#3B6FA8", "stroke-width": 2 }); A("path", { d: `M${-s * .4},${-s * .1}H${s * .4}`, stroke: "#3B6FA8", "stroke-width": 2 }); A("rect", { x: s * .1, y: -s * .02, width: s * .22, height: s * .14, rx: 3, fill: "#3B6FA8" }); }
  else if (kind === "pot") { A("path", { d: `M${-s * .3},${0}L${s * .3},0L${s * .22},${s * .4}L${-s * .22},${s * .4}Z`, fill: "#D9825B", stroke: "#8A4A2B", "stroke-width": 2 }); A("rect", { x: -s * .36, y: -s * .09, width: s * .72, height: s * .12, rx: 3, fill: "#E39A74", stroke: "#8A4A2B", "stroke-width": 2 }); A("path", { d: `M0,${-s * .09}V${-s * .36}`, stroke: "#2E7A4C", "stroke-width": 3 }); A("ellipse", { cx: -s * .12, cy: -s * .34, rx: s * .13, ry: s * .06, fill: "#5DB37A", stroke: "#2E7A4C", "stroke-width": 1.5 }); A("ellipse", { cx: s * .12, cy: -s * .3, rx: s * .13, ry: s * .06, fill: "#5DB37A", stroke: "#2E7A4C", "stroke-width": 1.5 }); }
  else if (kind === "soil" || kind === "compost" || kind === "water" || kind === "liquid") { const col = { soil: "#B3814F", compost: "#4E3B2A", water: "#8CC8F0", liquid: "#6DBE6A" }[kind]; A("path", { d: `M${-s * .3},${-s * .3}L${s * .3},${-s * .3}L${s * .24},${s * .34}L${-s * .24},${s * .34}Z`, fill: "#F7F5EF", stroke: "#6F6656", "stroke-width": 2 }); A("path", { d: `M${-s * .285},${-s * .12}L${s * .285},${-s * .12}L${s * .24},${s * .34}L${-s * .24},${s * .34}Z`, fill: col }); A("path", { d: `M${s * .3},${-s * .2}h${s * .1}v${s * .26}h${-s * .12}`, fill: "none", stroke: "#6F6656", "stroke-width": 2 }); }
  else if (kind === "can") { A("rect", { x: -s * .26, y: -s * .18, width: s * .44, height: s * .46, rx: 6, fill: "#7FC3A0", stroke: "#2E7A4C", "stroke-width": 2 }); A("path", { d: `M${s * .18},${-s * .02}L${s * .46},${-s * .3}`, stroke: "#2E7A4C", "stroke-width": 5, "stroke-linecap": "round" }); A("path", { d: `M${-s * .2},${-s * .18}Q${-s * .04},${-s * .46} ${s * .12},${-s * .18}`, fill: "none", stroke: "#2E7A4C", "stroke-width": 4 }); }
  else if (kind === "drop") A("path", { d: `M0,${-s * .4}C${s * .32},${-s * .02} ${s * .3},${s * .36} 0,${s * .36}C${-s * .3},${s * .36} ${-s * .32},${-s * .02} 0,${-s * .4}Z`, fill: "#8CC8F0", stroke: "#2B7BD6", "stroke-width": 2 });
  else if (kind === "sprout") { A("path", { d: `M${-s * .3},${s * .36}Q0,${s * .12} ${s * .3},${s * .36}Z`, fill: "#A9784A" }); A("path", { d: `M0,${s * .26}V${-s * .06}`, stroke: "#2E7A4C", "stroke-width": 3 }); A("path", { d: `M0,${-s * .02}C${-s * .1},${-s * .34} ${-s * .4},${-s * .3} ${-s * .38},${-s * .1}C${-s * .3},${s * .02} ${-s * .1},${s * .02} 0,${-s * .02}Z`, fill: "#5DB37A", stroke: "#2E7A4C", "stroke-width": 1.5 }); A("path", { d: `M0,${-s * .06}C${s * .1},${-s * .4} ${s * .4},${-s * .36} ${s * .38},${-s * .16}C${s * .3},${-s * .02} ${s * .1},${-s * .02} 0,${-s * .06}Z`, fill: "#7BC98F", stroke: "#2E7A4C", "stroke-width": 1.5 }); }
  else if (kind === "tray") { A("rect", { x: -s * .44, y: -s * .28, width: s * .88, height: s * .56, rx: 4, fill: "#5B6B66", stroke: "#2F3B37", "stroke-width": 2 }); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) A("rect", { x: -s * .38 + i * s * .26, y: -s * .22 + j * s * .24, width: s * .22, height: s * .2, rx: 2, fill: "#8C6A45" }); }
  else if (kind === "bag") { A("path", { d: `M${-s * .3},${-s * .12}L${s * .3},${-s * .12}L${s * .26},${s * .38}L${-s * .26},${s * .38}Z`, fill: "#E9D3AE", stroke: "#8A6A3A", "stroke-width": 2 }); A("path", { d: `M${-s * .26},${-s * .12}C${-s * .3},${-s * .42} ${-s * .04},${-s * .46} 0,${-s * .2}C${s * .06},${-s * .46} ${s * .32},${-s * .42} ${s * .26},${-s * .12}Z`, fill: "#7BC98F", stroke: "#2E7A4C", "stroke-width": 1.5 }); }
  if (lab) g.append(txt(0, s * .52, lab, Math.max(13, s * .26), { fill: "#3A2A1A" }));
  return g;
}

/* ---------- ② 재료 세트 더하기·빼기 ----------
   opt: {what:"필통", unit:"개", prod:"case", start, target, max, items:[{name, per, unit, icon, lump}], ask, ok} */
function rp4Build(body, api, opt) {
  /* 끝나면 rp4Finish가 api.done( 을 불러요 */
  const its = opt.items, max = opt.max || 6, CW = 118, H = 210;
  let n = opt.start, fin = false;
  const svg = makeSvg(CW * max + 10, H); svg.setAttribute("class", "rp4fig");
  const read = h("div", { class: "rp4read" }, "​");
  const tbl = h("div");
  const draw = () => {
    svg.innerHTML = "";
    for (let i = 0; i < max; i++) {
      const x = 8 + i * CW, on = i < n;
      svg.append(svgEl("rect", { x, y: 6, width: CW - 10, height: H - 12, rx: 12, fill: on ? "#FFFDF6" : "none", stroke: on ? "#C9B79C" : "#E3E7E5", "stroke-width": 2, "stroke-dasharray": on ? "" : "6 6" }));
      if (!on) continue;
      if (opt.prod) svg.append(rp4Icon(opt.prod, x + (CW - 10) / 2, 34, 54));
      its.forEach((it, k) => {
        const y0 = opt.prod ? 86 + k * 64 : 56 + k * 92, cnt = it.lump ? 1 : it.per, lab = it.lump ? `${it.per} ${it.unit}` : "";
        const cols = Math.min(cnt, 3), rows = Math.ceil(cnt / 3), s = rows > 1 ? 26 : cnt > 2 ? 30 : 38;
        for (let j = 0; j < cnt; j++) {
          const c = j % 3, r = Math.floor(j / 3);
          const cx = x + (CW - 10) / 2 + (c - (Math.min(cols, cnt - r * 3) - 1) / 2) * (s + 4), cy = y0 + (rows > 1 ? (r - .5) * (s * .78) : 0);
          svg.append(rp4Icon(it.icon, cx, cy, it.lump ? 46 : s, lab));
        }
      });
    }
    tbl.innerHTML = "";
    tbl.append(rp4Tbl([`${opt.what} 수`, `${n}${opt.unit || "개"}`], its.map(it => [it.name, `${it.per * n}${rp4U(it.unit)}`])));
    read.textContent = `${opt.what} ${n}${opt.unit || "개"}: ${its[0].name} ${its[0].per * n}${rp4U(its[0].unit)}, ${its[1].name} ${its[1].per * n}${rp4U(its[1].unit)} → 비 ${its[0].per * n} : ${its[1].per * n}`;
  };
  const plus = h("button", { onclick: () => { if (fin || n >= max) return; n++; after(); } }, `＋ ${opt.what} 하나 더 만들기`);
  const minus = h("button", { onclick: () => { if (fin || n <= 1) return; n--; after(); } }, `－ ${opt.what} 하나 줄이기`);
  const after = () => {
    draw();
    if (n === opt.target) { fin = true; plus.disabled = minus.disabled = true; rp4Finish(body, api, opt, `${opt.what} ${n}${opt.unit || "개"}`, opt.msg || `${opt.what} ${rp4J(n + (opt.unit || "개"), "을를")} 만들 때의 재료를 살펴봤어요.`); }
    else api.hint(n < opt.target ? `${rp4J(opt.what, "이가")} ${rp4J(opt.target + (opt.unit || "개"), "이가")} 되게 해 봐요.` : `${rp4J(opt.what, "을를")} ${rp4J(opt.target + (opt.unit || "개"), "으로")} 줄여 봐요.`);
  };
  api.provide({ words: ["전항", "후항", "비율"], answers: [] });
  body.append(svg, h("div", { class: "rp4tools" }, plus, minus), read, tbl); draw();
}

/* ---------- ③ 전항과 후항에 같은 수를 ----------
   opt: {start:[1,2], goal:[2,4], ops:["×","÷","+"], ask, ok} */
function rp4Machine(body, api, opt) {
  /* 끝나면 rp4Finish가 api.done( 을 불러요 */
  const st = opt.start.map(v => rp4P(v)), goal = opt.goal.map(v => rp4P(v));
  let cur = st.slice(), op = opt.ops[0], k = 2, fin = false; const hist = [];
  const svg = makeSvg(640, 230); svg.setAttribute("class", "rp4fig");
  const histEl = h("div", { class: "rp4hist" }, "​");
  const msg = h("div", { class: "rp4read" }, "​");
  const RT = (a, b) => `${rp4Fr(a)} : ${rp4Fr(b)}`;
  const draw = () => {
    svg.innerHTML = "";
    const val = q => q.n / q.d, Hh = 120;
    const U = Math.min(30, 250 / Math.max(val(st[0]), val(cur[0])), Hh / Math.max(val(st[1]), val(cur[1])));
    const shape = (a, b, x, col, title) => {
      const W = val(a) * U, hh = val(b) * U;
      svg.append(txt(x, 24, title, 18, { fill: "#4A5A55" }));
      svg.append(svgEl("rect", { x: x - W / 2, y: 50 + (Hh - hh), width: W, height: hh, fill: col, "fill-opacity": .35, stroke: col, "stroke-width": 3, rx: 4 }));
      svg.append(rp4SvgLine(`${rp4Fr(a)} : ${rp4Fr(b)}`, x, 50 + Hh + 30, 22));
    };
    shape(st[0], st[1], 170, "#2B7BD6", "처음 비(가로 : 세로)");
    shape(cur[0], cur[1], 470, rp4EqQ(rp4DivQ(cur[0], cur[1]), rp4DivQ(st[0], st[1])) ? "#2E8B57" : "#C8472E", "지금 비(가로 : 세로)");
  };
  const showHist = () => { histEl.textContent = [RT(st[0], st[1])].concat(hist).join(" "); };
  const opBtns = opt.ops.map(o => h("button", { onclick: e => { op = o; opBtns.forEach(b => b.classList.toggle("rp4sel", b === e.currentTarget)); } }, o === "+" ? "+ 같은 수 더하기" : o === "×" ? "× 같은 수 곱하기" : "÷ 같은 수로 나누기"));
  opBtns[0].classList.add("rp4sel");
  const kEl = h("b", {}, String(k));
  const stepper = h("span", { class: "rp4step" }, h("button", { onclick: () => { k = Math.max(0, k - 1); kEl.textContent = k; } }, "－"), kEl, h("button", { onclick: () => { k = Math.min(12, k + 1); kEl.textContent = k; } }, "＋"));
  const reset = () => { cur = st.slice(); hist.length = 0; showHist(); draw(); };
  const apply = () => {
    if (fin) return;
    if (op === "×" && k === 0) { msg.textContent = `전항과 후항에 0을 곱하면 0 : 0이 되어 비율을 비교할 수 없어요. 0이 아닌 수를 골라요.`; return; }
    if (op === "÷" && k === 0) { msg.textContent = "0으로는 나눌 수 없어요. 0이 아닌 수를 골라요."; return; }
    const K = rp4Q(k, 1), before = cur.slice();
    cur = op === "×" ? cur.map(v => rp4Mul(v, K)) : op === "÷" ? cur.map(v => rp4DivQ(v, K)) : cur.map(v => rp4Add(v, K));
    hist.push(`→(${op}${k})→ ${RT(cur[0], cur[1])}`); showHist(); draw();
    const same = rp4EqQ(rp4DivQ(cur[0], cur[1]), rp4DivQ(st[0], st[1]));
    if (!same) { msg.textContent = `전항과 후항에 같은 수 ${rp4J(String(k), "을를")} 더했더니 비율이 ${rp4Fr(rp4DivQ(before[0], before[1]))}에서 ${rp4J(rp4Fr(rp4DivQ(cur[0], cur[1])), "으로")} 달라졌어요. 모양도 달라졌지요? ‘처음으로’를 눌러 다시 해요.`; return; }
    if (rp4EqQ(cur[0], goal[0]) && rp4EqQ(cur[1], goal[1])) {
      fin = true; msg.textContent = `${rp4J(RT(st[0], st[1]), "과와")} ${rp4J(RT(cur[0], cur[1]), "은는")} 비율이 ${rp4J(rp4Fr(rp4DivQ(st[0], st[1])), "으로")} 같고, 모양도 같아요.`;
      rp4Finish(body, api, opt, hist.join(" "), opt.msg || "비율이 같은 비를 만들었어요.");
    } else msg.textContent = `비율은 ${rp4J(rp4Fr(rp4DivQ(cur[0], cur[1])), "으로")} 처음과 같아요. 목표 ${rp4J(RT(goal[0], goal[1]), "이가")} 되게 해 봐요. 어렵다면 ‘처음으로’를 눌러요.`;
  };
  api.provide({ words: ["전항", "후항", "0이 아닌 같은 수", "비율"], answers: [] });
  body.append(h("div", { class: "rp4big" }, `목표: ${RT(st[0], st[1])} → ${RT(goal[0], goal[1])}`), svg,
    h("div", { class: "rp4tools" }, ...opBtns), h("div", { class: "rp4tools" }, h("span", { class: "jua" }, "같은 수:"), stepper, h("button", { onclick: apply }, "전항과 후항에 함께 하기"), h("button", { onclick: reset }, "처음으로")),
    histEl, msg);
  showHist(); draw();
}

/* ---------- ④ 간단한 자연수의 비로 ----------
   opt: {a:"0.8", b:"0.2", ma:"dec"|"frac"|"mix", mb, simplest, need:"a2dec"|"b2frac", mults:[10,100], ask, ok} */
function rp4Simp(body, api, opt) {
  /* 끝나면 rp4Finish가 api.done( 을 불러요 */
  const T = (s, m) => ({ q: rp4P(s), m, txt: m === "mix" ? `[${s}]` : m === "frac" ? `[${s}]` : String(s) });
  const st = [T(opt.a, opt.ma), T(opt.b, opt.mb)];
  let cur = st.map(x => Object.assign({}, x)), fin = false, conv = false; const hist = [];
  const show = t => t.txt;
  const RT = c => `${show(c[0])} : ${show(c[1])}`;
  const big = h("div", { class: "rp4big" }, "​"), histEl = h("div", { class: "rp4hist" }, "​"), msg = h("div", { class: "rp4read" }, "​");
  const refresh = () => { big.textContent = RT(cur); histEl.textContent = [RT(st)].concat(hist).join(" "); };
  const set = (k, q, m) => { cur[k] = { q, m, txt: rp4Show(q, m === "mix" ? "frac" : m) }; };
  const doOp = (sym, K) => {
    if (fin) return;
    if (!K || K.n === 0) { msg.textContent = "0이 아닌 수를 써요."; return; }
    [0, 1].forEach(k => set(k, sym === "×" ? rp4Mul(cur[k].q, K) : rp4DivQ(cur[k].q, K), cur[k].m));
    hist.push(`→(${sym}${rp4Fr(K)})→ ${RT(cur)}`); refresh(); judge();
  };
  const convert = k => {
    if (fin) return; const t = cur[k];
    if (t.m === "dec") {   /* 소수 → 분수(분모 10, 100…) */
      const s = rp4Dec(t.q) || ""; const dp = (s.split(".")[1] || "").length;
      if (!dp) { msg.textContent = "이미 자연수예요."; return; }
      const D = 10 ** dp; cur[k] = { q: t.q, m: "frac", txt: `[${t.q.n * (D / t.q.d)}/${D}]` };
    } else {               /* 분수 → 소수 */
      const s = rp4Dec(t.q); if (!s) { msg.textContent = `${rp4J(t.txt, "은는")} 소수로 딱 떨어지게 나타내기 어려워요. 분모의 공배수를 곱해 봐요.`; return; }
      cur[k] = { q: t.q, m: "dec", txt: s };
    }
    if ((opt.need === "a2dec" && k === 0 && cur[0].m === "dec") || (opt.need === "b2frac" && k === 1 && cur[1].m === "frac")) conv = true;
    hist.push(`→(${k ? "후항" : "전항"}을 ${cur[k].m === "dec" ? "소수" : "분수"}로)→ ${RT(cur)}`); refresh(); msg.textContent = "​";
  };
  const judge = () => {
    const nat = cur.every(t => t.q.d === 1 && t.q.n > 0);
    if (!nat) { msg.textContent = cur.some(t => t.q.d !== 1) ? "아직 자연수가 아닌 항이 있어요. 소수는 10, 100…을, 분수는 분모의 공배수를 곱해 봐요." : "​"; return; }
    if (opt.need && !conv) { msg.textContent = opt.need === "a2dec" ? "자연수가 되었지만, 이번에는 전항을 소수로 바꾸는 방법으로 해 봐요. ‘처음으로’를 눌러요." : "자연수가 되었지만, 이번에는 후항을 분수로 바꾸는 방법으로 해 봐요. ‘처음으로’를 눌러요."; return; }
    const g = rp4G(cur[0].q.n, cur[1].q.n);
    if (opt.simplest && g > 1) { msg.textContent = `두 항이 모두 자연수가 되었어요(${RT(cur)}). 두 수의 공약수로 나누어 더 간단하게 해 봐요.`; return; }
    fin = true; msg.textContent = `${rp4J(RT(st), "을를")} 간단한 자연수의 비로 나타내면 ${rp4J(RT(cur), "이에요")}.` + (g > 1 ? ` 두 수의 공약수로 나누면 더 간단하게 할 수도 있어요.` : "");
    rp4Finish(body, api, opt, hist.join(" "), opt.msg || `${rp4J(RT(cur), "이가")} 되었어요.`);
  };
  const kIn = rp4Inp(false, "곱하거나 나눌 수");
  const mults = (opt.mults || [10, 100]).map(m => h("button", { onclick: () => doOp("×", rp4Q(m, 1)) }, `× ${m}`));
  const convBtns = [0, 1].map(k => h("button", { onclick: () => convert(k) }, k ? "후항 바꾸기(소수는 분수로, 분수는 소수로)" : "전항 바꾸기(소수는 분수로, 분수는 소수로)"));
  const reset = () => { cur = st.map(x => Object.assign({}, x)); hist.length = 0; conv = false; fin = false; refresh(); msg.textContent = "​"; };
  api.provide({ words: ["10, 100, 1000", "분모의 공배수", "공약수로 나누기", "간단한 자연수의 비"], answers: [] });
  body.append(big,
    h("div", { class: "rp4tools" }, h("span", { class: "jua" }, "전항과 후항에 함께"), ...mults),
    h("div", { class: "rp4tools" }, h("span", { class: "jua" }, "같은 수"), kIn,
      h("button", { onclick: () => doOp("×", rp4P(kIn.value)) }, "× 곱하기"), h("button", { onclick: () => doOp("÷", rp4P(kIn.value)) }, "÷ 나누기")),
    opt.noConv ? h("div", { class: "rp4tools" }, h("button", { onclick: reset }, "처음으로")) : h("div", { class: "rp4tools" }, ...convBtns, h("button", { onclick: reset }, "처음으로")),
    histEl, msg);
  refresh();
}

/* ---------- ⑤ 외항 ◯, 내항 △ ----------
   opt: {props:[[3,8,12,32],…], ask, ok} */

/* ---------- ⑥ 외항의 곱 = 내항의 곱 (넓이) ----------
   opt: {p:[3,5,null,15], max, ask, ok}  — 직사각형 ㉮ 가로 p0·세로 p3, ㉯ 가로 p1·세로 p2 */
function rp4Area(body, api, opt) {
  /* 끝나면 rp4Finish가 api.done( 을 불러요 */
  const p = opt.p.slice(), u = p.indexOf(null);
  const known = u === 0 || u === 3 ? p[1] * p[2] : p[0] * p[3];
  const partner = u === 0 ? p[3] : u === 3 ? p[0] : u === 1 ? p[2] : p[1];
  const ans = known / partner; if (ans !== Math.round(ans)) throw new Error("rp4Area 답이 자연수가 아님");
  const MAX = opt.max || Math.max(ans * 2, ans + 4);
  let v = opt.init || Math.max(1, Math.round(ans / 3)), fin = false;
  const W = 660, H = 360, base = 330, x1 = 40, x2 = 360;
  const dims = () => { const q = p.slice(); q[u] = v; return q; };
  const maxW = Math.max(u === 0 ? MAX : p[0], u === 1 ? MAX : p[1]);
  const maxH = Math.max(u === 3 ? MAX : p[3], u === 2 ? MAX : p[2]);
  const s = Math.min(270 / maxW, 280 / maxH);
  const svg = makeSvg(W, H); svg.setAttribute("class", "rp4fig");
  const read = h("div", { class: "rp4read" }, "​");
  const draw = () => {
    svg.innerHTML = ""; const q = dims();
    const R = [{ x: x1, w: q[0], hh: q[3], c: "#D9822B", t: "외항의 곱", wi: 0, hi: 3 }, { x: x2, w: q[1], hh: q[2], c: "#2B7BD6", t: "내항의 곱", wi: 1, hi: 2 }];
    R.forEach(r => {
      const ww = r.w * s, hh = r.hh * s;
      svg.append(txt(r.x + 130, 18, r.t, 18, { fill: r.c }));
      svg.append(svgEl("rect", { x: r.x, y: base - hh, width: ww, height: hh, fill: r.c, "fill-opacity": .22, stroke: r.c, "stroke-width": 3 }));
      if (s >= 9) { const g = svgEl("g", { stroke: r.c, "stroke-opacity": .35, "stroke-width": 1 });
        for (let i = 1; i < r.w; i++) g.append(svgEl("line", { x1: r.x + i * s, y1: base - hh, x2: r.x + i * s, y2: base }));
        for (let j = 1; j < r.hh; j++) g.append(svgEl("line", { x1: r.x, y1: base - j * s, x2: r.x + ww, y2: base - j * s })); svg.append(g); }
      svg.append(txt(r.x + ww / 2, base + 16, String(r.w), 18, { fill: r.wi === u ? "#C8472E" : INK }));
      svg.append(txt(r.x + ww + 16, base - hh / 2, String(r.hh), 18, { fill: r.hi === u ? "#C8472E" : INK, "text-anchor": "start" }));
      if (r.wi === u) svg.append(svgEl("rect", { x: r.x + ww - 7, y: base - hh / 2 - 22, width: 14, height: 44, rx: 6, fill: "#C8472E" }));
      if (r.hi === u) svg.append(svgEl("rect", { x: r.x + ww / 2 - 22, y: base - hh - 7, width: 44, height: 14, rx: 6, fill: "#C8472E" }));
    });
    const A = q[0] * q[3], B = q[1] * q[2];
    read.textContent = `외항의 곱 ${q[0]} × ${q[3]} = ${A}   ${A === B ? "=" : A > B ? ">" : "<"}   내항의 곱 ${q[1]} × ${q[2]} = ${B}`;
  };
  const isW = u === 0 || u === 1, rx = u === 0 || u === 3 ? x1 : x2;
  dragOn(svg, pt => !fin, pt => {
    const raw = isW ? (pt.x - rx) / s : (base - pt.y) / s;
    v = Math.max(1, Math.min(MAX, Math.round(raw))); draw();
  }, () => check());
  const check = () => {
    if (fin) return; const q = dims();
    if (q[0] * q[3] === q[1] * q[2]) { fin = true; draw(); rp4Finish(body, api, opt, `□=${v}`, `□가 ${v}일 때 두 넓이가 같아요.`); }
    else api.hint("빨간 손잡이를 끌어 두 직사각형의 넓이(곱)가 같아지게 해 봐요.");
  };
  const minus = h("button", { onclick: () => { if (fin) return; v = Math.max(1, v - 1); draw(); check(); } }, "□ 1 줄이기");
  const plusB = h("button", { onclick: () => { if (fin) return; v = Math.min(MAX, v + 1); draw(); check(); } }, "□ 1 늘리기");
  api.provide({ words: ["외항의 곱", "내항의 곱", "같아요"], answers: [] });
  body.append(h("div", { class: "rp4big" }, opt.p.map(x => x == null ? "□" : x).slice(0, 2).join(" : ") + " = " + opt.p.map(x => x == null ? "□" : x).slice(2).join(" : ")),
    svg, h("div", { class: "rp4tools" }, minus, plusB), read);
  draw();
}

/* ---------- ⑦ 두 줄 수직선 ----------
   opt: {top:{name, unit, tick}, bot:{name, unit, tick, snap}, given:[t,b], ask:[t], tmax, ask(빈칸 줄), ok} */

/* ---------- ⑧ 톱니바퀴 ----------
   opt: {r:2, b:5, target:16, ask, ok} — 빨간 톱니 20개, 파란 톱니 8개 */
function rp4Gear(body, api, opt) {
  /* 끝나면 rp4Finish가 api.done( 을 불러요 */
  let R = 0, ang = 0, busy = false, fin = false;
  const svg = makeSvg(640, 300); svg.setAttribute("class", "rp4fig");
  const gearPath = (n, r1, r2) => { let d = ""; for (let i = 0; i < n * 2; i++) { const a0 = i / (n * 2) * Math.PI * 2, a1 = (i + 1) / (n * 2) * Math.PI * 2, r = i % 2 ? r1 : r2; d += `${i ? "L" : "M"}${(r * Math.cos(a0)).toFixed(1)},${(r * Math.sin(a0)).toFixed(1)}L${(r * Math.cos(a1)).toFixed(1)},${(r * Math.sin(a1)).toFixed(1)}`; } return d + "Z"; };
  const gR = svgEl("g"), gB = svgEl("g");
  gR.append(svgEl("path", { d: gearPath(20, 112, 124), fill: "#F08A7E", stroke: "#A3372B", "stroke-width": 3 }), svgEl("circle", { r: 14, fill: "#fff", stroke: "#A3372B", "stroke-width": 3 }), svgEl("line", { x1: 0, y1: 0, x2: 0, y2: -95, stroke: "#A3372B", "stroke-width": 6 }));
  gB.append(svgEl("path", { d: gearPath(8, 41, 53), fill: "#8CB8EC", stroke: "#1F5AA0", "stroke-width": 3 }), svgEl("circle", { r: 9, fill: "#fff", stroke: "#1F5AA0", "stroke-width": 3 }), svgEl("line", { x1: 0, y1: 0, x2: 0, y2: -34, stroke: "#1F5AA0", "stroke-width": 5 }));
  const wR = svgEl("g", { transform: "translate(200,150)" }), wB = svgEl("g", { transform: `translate(${200 + 124 + 41 + 2},150)` });
  wR.append(gR); wB.append(gB); svg.append(wR, wB);
  const ratio = opt.b / opt.r;
  const read = h("div", { class: "rp4read" }, "​");
  const show = () => {
    gR.setAttribute("transform", `rotate(${ang})`); gB.setAttribute("transform", `rotate(${-ang * ratio * (8 / 8) * 1})`);
    const B = R * ratio; read.textContent = `빨간색 톱니바퀴 ${R}바퀴 → 파란색 톱니바퀴 ${Math.round(B * 10) / 10}바퀴`;
  };
  /* 빨간 톱니 20개가 한 바퀴 돌면 파란 톱니(8개)는 20÷8 = 2.5바퀴 */
  const turn = k => {
    if (busy || fin) return; busy = true; const a0 = ang, a1 = ang + 360 * k, t0 = performance.now(), dur = 520 * k;
    const step = t => { const f = Math.min(1, (t - t0) / dur); ang = a0 + (a1 - a0) * f; show(); if (f < 1) requestAnimationFrame(step); else { busy = false; R += k; ang = a1 % 360; show(); after(); } };
    requestAnimationFrame(step);
  };
  const after = () => {
    if (R === opt.target) { fin = true; rp4Finish(body, api, opt, `빨강 ${R}, 파랑 ${R * ratio}`, `빨간색이 ${R}바퀴 돌 때 파란색은 ${R * ratio}바퀴 돌아요.`); }
    else if (R > opt.target) api.hint(`빨간색 톱니바퀴를 ${opt.target}바퀴보다 많이 돌렸어요. ‘처음으로’를 눌러요.`);
    else api.hint(`빨간색 톱니바퀴가 ${opt.target}바퀴 돌 때까지 돌려 봐요.`);
  };
  api.provide({ words: ["2 : 5", "비례식", "외항의 곱 = 내항의 곱"], answers: [] });
  body.append(svg, read, h("div", { class: "rp4tools" }, h("button", { onclick: () => turn(1) }, "빨간색 1바퀴 돌리기"), h("button", { onclick: () => turn(opt.r) }, `빨간색 ${opt.r}바퀴 돌리기`), h("button", { onclick: () => { if (busy || fin) return; R = 0; ang = 0; show(); } }, "처음으로")));
  show();
}

/* ---------- ⑨ 띠를 주어진 비로 나누기 ----------
   opt: {N, unit, snap, ratio:[p,q], names:[A,B], icon, ask, ok} */

/* ---------- ⑩ 비 카드를 골라 문제 완성 ---------- */
function rp4Clay(body, api, opt) {
  const solved = new Set(); const host = h("div");
  const row = h("div", { class: "rp4cards" });
  const btns = opt.cards.map((c, i) => h("button", { class: "rp4card", onclick: () => pick(i) }, c));
  btns.forEach(b => row.append(b));
  const pick = i => {
    btns.forEach((b, k) => b.classList.toggle("rp4pk", k === i && !solved.has(k)));
    host.innerHTML = ""; const [p, q] = opt.cards[i].split(":").map(s => +s.trim()), s = p + q;
    const a1 = opt.total * p / s, a2 = opt.total * q / s;
    host.append(h("p", { class: "rp4read" }, opt.text(opt.cards[i])));
    const sub = Object.assign({}, api, { done: () => {
      solved.add(i); btns[i].classList.remove("rp4pk"); btns[i].classList.add("rp4dn"); btns[i].disabled = true;
      if (solved.size >= opt.need) api.done([...solved].map(k => opt.cards[k]).join(", "), opt.ok);
      else { host.innerHTML = ""; api.hint(`○ 맞았어요! ${opt.total} × [${p}/${s}] = ${a1}, ${opt.total} × [${q}/${s}] = ${a2}. 다른 비 카드도 골라 문제를 하나 더 완성해 봐요.`); }
    } });
    rp4Chain(host, sub, [
      [`${opt.names[0]}: ${opt.total} × `, { f: `${p}/${s}`, why: {} }, " = ", { i: String(a1) }, ` ${opt.unit}`],
      [`${opt.names[1]}: ${opt.total} × `, { f: `${q}/${s}` }, " = ", { i: String(a2) }, ` ${opt.unit}`]],
      { bad: `전체를 (${p}+${q})만큼 등분해요. ${rp4J(opt.names[0], "은는")} 전체의 [${p}/${s}], ${rp4J(opt.names[1], "은는")} 전체의 ${rp4J(`[${q}/${s}]`, "이에요")}.` });
  };
  api.provide({ words: ["비례배분", "전체 × (전항) / (비의 합)"], answers: [] });
  body.append(h("p", { class: "rp4note" }, `보기에서 비 카드를 골라요. ${opt.need}가지 비로 문제를 완성해 풀어 봐요.`), row, host);
}

/* ---------- ⑪ 주사위로 비례식 ---------- */
function rp4Dice(body, api, opt) {
  let got = 0, cur = null; const host = h("div"), face = h("div");
  const dieSvg = n => { const s = makeSvg(90, 90); s.style.width = "4.2em"; s.style.display = "inline-block"; s.append(svgEl("rect", { x: 5, y: 5, width: 80, height: 80, rx: 14, fill: "#fff", stroke: INK, "stroke-width": 3 }));
    const P = { 1: [[45, 45]], 2: [[25, 25], [65, 65]], 3: [[25, 25], [45, 45], [65, 65]], 4: [[25, 25], [65, 25], [25, 65], [65, 65]], 5: [[25, 25], [65, 25], [45, 45], [25, 65], [65, 65]], 6: [[25, 22], [65, 22], [25, 45], [65, 45], [25, 68], [65, 68]] };
    P[n].forEach(([x, y]) => s.append(svgEl("circle", { cx: x, cy: y, r: 7, fill: INK }))); return s; };
  const roll = () => {
    if (cur) return; const a = 1 + Math.floor(Math.random() * 6), b = 1 + Math.floor(Math.random() * 6); cur = [a, b];
    face.innerHTML = ""; face.append(dieSvg(a), h("span", { class: "rp4big", style: "display:inline-block;margin:0 .4em" }, ":"), dieSvg(b));
    host.innerHTML = "";
    const sub = Object.assign({}, api, { done: () => {
      got++; cur = null; host.innerHTML = "";
      if (got >= opt.need) api.done(`${got}번`, opt.ok); else api.hint(`○ 맞았어요! ${a} : ${b} = ${opt.base} : ${rp4J(String(opt.base * b / a), "이에요")}. 주사위를 한 번 더 던져 봐요.`);
    } });
    rp4Chain(host, sub, [[`${a} : ${b} = ${opt.base} : `, { i: String(opt.base * b / a) }], ["외항의 곱 ", { i: String(opt.base * b) }, " = 내항의 곱"]], { bad: `비례식의 성질을 써요. ${a} × □ = ${b} × ${rp4J(String(opt.base), "이에요")}.` });
  };
  api.provide({ words: ["외항의 곱 = 내항의 곱"], answers: [] });
  body.append(h("div", { class: "rp4tools" }, h("button", { onclick: roll }, "주사위 두 번 던지기")), face, host);
}

/* ===================== 이야기 버전에서 새로 쓰거나 바꾼 부품 =====================
   '확인하기' 단추 없이 rp4Auto(=autoRun)로 저절로 확인해요(입력 0.9초 · 고르기 0.26초 · 끌기·누르기 1.2초).
   한 계단에 활동이 둘이면(엔진 hj-multi) 부품 몸통에 api.done( 이 있어야 하나로 세요 — 그래서 부품마다 그 표시를 적어 두었어요. */
const rp4U = u => /^(g|kg|L|mL|cm|m|km)$/.test(u) ? " " + u : u;
/* 저절로 확인: ready() 다 했는지 · sig() 지금 상태 · judge() 맞으면 true. 같은 상태로는 다시 세지 않아요. */
function rp4Auto(root, ready, sig, judge) {
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
const rp4Dg = s => String(s).replace(/[^0-9]/g, "").length;

/* ---------- ① 빈칸 줄 (저절로 확인) ----------
   lines: [ 토막… ] 또는 {t:"이름표", p:[토막…]}
   토막: "글" | {i:"답"(수·글), why} | {f:"3/10"(분수, 값이 같으면 정답), why} | {r:[a,b], any(같은 비율의 자연수 비 모두 정답)} | {c:[…], a:번호, why} */
function rp4Chain(body, api, lines, opt = {}) {
  /* 다 맞으면 api.done( 을 불러요 */
  const ctl = []; const wrap = h("div", { class: "rp4chain" });
  const ansParts = [];
  lines.forEach(L => {
    const row = h("div", { class: "rp4cl" }); let toks = L; const ans = [];
    if (!Array.isArray(L)) { row.append(h("span", { class: "rp4tag" }, L.t)); toks = L.p; ans.push(L.t + ": "); }
    toks.forEach(t => {
      if (typeof t === "string") { row.append(h("span", {}, t)); ans.push(t); }
      else if (t && t.nodeType) { row.append(t); }
      else if (t.i != null) { const el = rp4Inp(t.w || String(t.i).length > 3); ctl.push({ k: "i", t, el }); row.append(el); ans.push(String(t.i)); }
      else if (t.f != null) { const el = rp4FIn(); ctl.push({ k: "f", t, el }); row.append(el); ans.push(String(t.f)); }
      else if (t.r) { const el = rp4RIn(); ctl.push({ k: "r", t, el }); row.append(el); ans.push(`${t.r[0]} : ${t.r[1]}`); }
      else if (t.c) {
        const C = { k: "c", t, sel: null }; const chs = h("span", { class: "rp4chs" });
        t.c.forEach((o, oi) => chs.append(h("button", { class: "opt", onclick: e => { [...chs.children].forEach(b => b.classList.remove("rp4on", "good", "bad")); e.currentTarget.classList.add("rp4on"); C.sel = oi; } }, o)));
        C.el = chs; ctl.push(C); row.append(chs); ans.push(t.c[t.a]);
      }
    });
    wrap.append(row); ansParts.push(ans.join(""));
  });
  api.provide({ words: opt.words || ["전항", "후항", "비율", "외항", "내항", "비례식", "비례배분"], answers: ansParts.map(rp4Plain) });
  const judge1 = C => {
    const t = C.t;
    if (C.k === "i") {
      const v = C.el.value.trim().replace(/[,\s]/g, ""); if (!v) return { ok: false, v };
      const A = rp4P(t.i), V = rp4P(v);
      return { ok: A && V ? rp4EqQ(A, V) : v === String(t.i).replace(/\s/g, ""), v };
    }
    if (C.k === "f") { const q = C.el.get(); return { ok: !!q && rp4EqQ(q, rp4P(t.f)), v: C.el.txt() }; }
    if (C.k === "r") {
      const [x, y] = C.el.get(); const v = C.el.txt();
      if (!x || !y) return { ok: false, v };
      if (t.any) {
        const nat = x.d === 1 && y.d === 1 && x.n > 0 && y.n > 0;
        if (!nat) return { ok: false, v, msg: "전항과 후항이 모두 자연수가 되게 써요." };
        return { ok: x.n * t.r[1] === y.n * t.r[0], v, simp: rp4G(x.n, y.n) > 1 };
      }
      return { ok: rp4EqQ(x, rp4P(t.r[0])) && rp4EqQ(y, rp4P(t.r[1])), v };
    }
    return { ok: C.sel === t.a, v: C.sel == null ? "-" : t.c[C.sel] };
  };
  /* 다 썼는지: 쓰고 있는 칸은 답만큼 숫자를 쓸 때까지 기다려요 */
  const filled = C => {
    const act = document.activeElement;
    const one = (inp, want) => { const v = inp.value.trim(); if (!v || /[.\/]$/.test(v)) return false; return act !== inp || rp4Dg(v) >= rp4Dg(want); };
    if (C.k === "i") return one(C.el, C.t.i);
    if (C.k === "f") { const [n, d] = C.el.querySelectorAll("input"); const [fn, fd] = String(C.t.f).split("/"); return one(n, fn) && one(d, fd); }
    if (C.k === "r") { const [a, b] = C.el.querySelectorAll("input"); return one(a, C.t.r[0]) && one(b, C.t.r[1]); }
    return C.sel != null;
  };
  const sig = () => ctl.map(C => C.k === "c" ? String(C.sel) : C.el.tagName === "INPUT" ? C.el.value.trim() : [...C.el.querySelectorAll("input")].map(x => x.value.trim()).join("/")).join("§");
  const judge = () => {
    api.tryOnce(); let bad = null; const got = []; let simp = false;
    ctl.forEach(C => {
      const r = judge1(C); got.push(r.v); if (r.simp) simp = true;
      const col = r.ok ? "var(--ok)" : "var(--no)";
      if (C.k === "c") { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(r.ok ? "good" : "bad"); }); }
      else if (C.el.paint) C.el.paint(col); else C.el.style.borderColor = col;
      if (!r.ok && !bad) bad = { C, r };
    });
    if (!bad) {
      const extra = simp && opt.simpNote !== false ? " 쓴 비를 공약수로 나누면 더 간단하게 나타낼 수도 있어요." : "";
      api.done(rp4Plain(got.join(" / ")), (opt.ok || "잘했어요!") + extra); return true;
    }
    const t = bad.C.t, key = bad.C.k === "c" ? String(bad.C.sel) : String(bad.r.v).replace(/[\s,]/g, "");
    const why = (t.why && (t.why[key] || t.why[String(bad.r.v)])) || bad.r.msg;
    api.fail(why || opt.bad || "빨간 칸을 다시 생각해 봐요.", rp4Plain(got.join(" / ")));
    return false;
  };
  wrap.rp4ctl = ctl;
  body.append(wrap);
  rp4Auto(wrap, () => ctl.every(filled), sig, judge);
  return wrap;
}

/* ---------- ⑤ 외항 ◯, 내항 △ (네 수를 모두 표시하면 저절로 확인) ---------- */
function rp4Terms(body, api, opt) {
  /* 다 맞으면 rp4Finish가 api.done( 을 불러요 */
  let mode = "o"; const boards = []; const root = h("div");
  const mb = [h("button", { class: "rp4sel", onclick: e => setMode("o", e) }, "◯ 외항 표시"), h("button", { onclick: e => setMode("t", e) }, "△ 내항 표시"), h("button", { onclick: e => setMode("x", e) }, "지우기")];
  const setMode = (m, e) => { mode = m; mb.forEach(b => b.classList.toggle("rp4sel", b === e.currentTarget)); };
  root.append(h("div", { class: "rp4tools" }, ...mb));
  opt.props.forEach(P => {
    const svg = makeSvg(560, 200); svg.setAttribute("class", "rp4fig"); svg.style.maxWidth = "560px";
    const marks = [null, null, null, null], X = [70, 190, 370, 490];
    const draw = (arcs) => {
      svg.innerHTML = "";
      if (arcs) {
        svg.append(svgEl("path", { d: `M${X[0]},62 C${X[0]},10 ${X[3]},10 ${X[3]},62`, fill: "none", stroke: "#D9822B", "stroke-width": 3 }));
        svg.append(txt(280, 42, "외항", 18, { fill: "#B4610F" }));
        svg.append(svgEl("path", { d: `M${X[1]},138 C${X[1]},190 ${X[2]},190 ${X[2]},138`, fill: "none", stroke: "#2B7BD6", "stroke-width": 3 }));
        svg.append(txt(280, 160, "내항", 18, { fill: "#2B7BD6" }));
      }
      svg.append(txt(130, 100, ":", 40), txt(280, 100, "=", 40), txt(430, 100, ":", 40));
      P.forEach((v, i) => {
        const g = svgEl("g", { style: "cursor:pointer" });
        g.append(svgEl("rect", { x: X[i] - 48, y: 64, width: 96, height: 72, fill: "#fff", opacity: 0 }));
        if (marks[i] === "o") g.append(svgEl("circle", { cx: X[i], cy: 100, r: 40, fill: "#FFF1DD", stroke: "#D9822B", "stroke-width": 4 }));
        if (marks[i] === "t") g.append(svgEl("path", { d: `M${X[i]},52 L${X[i] + 48},132 L${X[i] - 48},132 Z`, fill: "#E3EEFB", stroke: "#2B7BD6", "stroke-width": 4 }));
        g.append(rp4SvgLine(String(v), X[i], marks[i] === "t" ? 108 : 100, 36));
        g.addEventListener("click", () => { if (fin) return; marks[i] = mode === "x" ? null : (marks[i] === mode ? null : mode); draw(false); });
        svg.append(g);
      });
    };
    draw(false); root.append(svg);
    boards.push({ marks, draw, P });
  });
  let fin = false;
  const ans = opt.props.map(P => `외항 ${P[0]}, ${P[3]} / 내항 ${P[1]}, ${P[2]}`);
  api.provide({ words: ["외항: 바깥쪽에 있는 두 항", "내항: 안쪽에 있는 두 항"], answers: ans.map(rp4Plain) });
  body.append(root);
  rp4Auto(root, () => boards.every(B => B.marks.every(Boolean)), () => boards.map(B => B.marks.join("")).join("|"), () => {
    api.tryOnce();
    const bad = boards.find(B => !(B.marks[0] === "o" && B.marks[3] === "o" && B.marks[1] === "t" && B.marks[2] === "t"));
    if (bad) {
      const m = bad.marks; let why = "바깥쪽에 있는 두 수에 ◯, 안쪽에 있는 두 수에 △ 해요.";
      if (m[0] === "o" && m[1] === "o") why = "전항과 후항이 아니라, 비례식 전체에서 바깥쪽(맨 앞과 맨 뒤)에 있는 두 수가 외항이에요.";
      api.fail(why, boards.map(B => B.marks.map(x => x === "o" ? "◯" : x === "t" ? "△" : "-").join("")).join(" / ")); return false;
    }
    fin = true; boards.forEach(B => B.draw(true));
    rp4Finish(body, api, opt, ans.join(" | "), "바깥쪽 두 수는 외항, 안쪽 두 수는 내항이에요."); return true;
  });
}

/* ---------- ⑦ 두 줄 수직선 (세모를 놓으면 저절로 확인) ---------- */
function rp4Dbl(body, api, opt) {
  /* 맞으면 rp4Finish가 api.done( 을 불러요 */
  const [gt, gb] = opt.given, at = opt.askAt, ab = at * gb / gt, tmax = opt.tmax, bmax = tmax * gb / gt;
  const L = 560, x0 = 50, yT = 86, yB = 200, snap = opt.bot.snap || opt.bot.tick;
  let v = 0, fin = false;
  const X = (val, mx) => x0 + val / mx * L;
  const root = h("div");
  const svg = makeSvg(660, 262); svg.setAttribute("class", "rp4fig");
  const read = h("div", { class: "rp4read" }, "​");
  const fmt = x => (Math.round(x * 1000) / 1000).toString();
  const uu = (u, val) => u === "개" ? "개" : " " + u;
  const draw = () => {
    svg.innerHTML = "";
    [[yT, opt.top, tmax], [yB, opt.bot, bmax]].forEach(([y, ax, mx]) => {
      svg.append(svgEl("line", { x1: x0, y1: y, x2: x0 + L + 12, y2: y, stroke: INK, "stroke-width": 3 }));
      svg.append(txt(x0 - 10, y === yT ? y - 48 : y - 24, `${ax.name}(${ax.unit})`, 15, { "text-anchor": "start", fill: "#4A5A55" }));
      for (let t = 0; t <= mx + 1e-9; t += ax.tick) { svg.append(svgEl("line", { x1: X(t, mx), y1: y - 7, x2: X(t, mx), y2: y + 7, stroke: INK, "stroke-width": 2 })); svg.append(txt(X(t, mx), y + (y === yT ? -18 : 22), fmt(t), 14, { fill: "#4A5A55" })); }
    });
    svg.append(svgEl("line", { x1: X(gt, tmax), y1: yT, x2: X(gb, bmax), y2: yB, stroke: "#2E8B57", "stroke-width": 3, "stroke-dasharray": "6 5" }));
    svg.append(svgEl("circle", { cx: X(gt, tmax), cy: yT, r: 8, fill: "#2E8B57" }), svgEl("circle", { cx: X(gb, bmax), cy: yB, r: 8, fill: "#2E8B57" }));
    svg.append(svgEl("circle", { cx: X(at, tmax), cy: yT, r: 9, fill: "#D9822B" }));
    svg.append(txt(X(at, tmax) + 8, yT + 26, `${fmt(at)}`, 16, { fill: "#B4610F", "text-anchor": "start" }));
    svg.append(svgEl("line", { x1: X(at, tmax), y1: yT, x2: X(v, bmax), y2: yB, stroke: "#D9822B", "stroke-width": 2, "stroke-dasharray": "3 5" }));
    const mx = X(v, bmax);
    svg.append(svgEl("path", { d: `M${mx},${yB - 4} l-13,26 h26 Z`, fill: fin ? "#2E8B57" : "#C8472E", style: "cursor:grab" }));
    svg.append(txt(mx, yB + 42, `${fmt(v)}`, 16, { fill: fin ? "#2E8B57" : "#C8472E" }));
    read.textContent = `${opt.top.name} ${fmt(at)}${uu(opt.top.unit)}에 짝이 되는 ${opt.bot.name}: ${v ? fmt(v) + uu(opt.bot.unit) : "?"}`;
  };
  const setV = pt => { v = Math.max(0, Math.min(bmax, Math.round(((pt.x - x0) / L * bmax) / snap) * snap)); v = Math.round(v * 1000) / 1000; draw(); };
  dragOn(svg, pt => { if (fin || Math.abs(pt.y - (yB + 10)) >= 55) return false; setV(pt); return true; }, setV);
  const mv = d => { if (fin) return; v = Math.round(Math.max(0, Math.min(bmax, v + d * snap)) * 1000) / 1000; draw(); };
  api.provide({ words: ["두 양의 비", "비율이 같아요", "비례식"], answers: [] });
  root.append(h("p", { class: "rp4note" }, `초록 점선은 알고 있는 짝(위 ${fmt(gt)}, 아래 ${fmt(gb)})이에요. 아래 줄의 빨간 세모를 끌거나 단추를 눌러 ${fmt(at)}의 짝을 찾아요.`), svg, read,
    h("div", { class: "rp4tools" }, h("button", { onclick: () => mv(-1) }, `◀ 세모를 ${fmt(snap)}만큼`), h("button", { onclick: () => mv(1) }, `세모를 ${fmt(snap)}만큼 ▶`)));
  body.append(root);
  rp4Auto(root, () => v > 0, () => String(v), () => {
    api.tryOnce();
    if (Math.abs(v - ab) < 1e-6) { fin = true; draw(); rp4Finish(body, api, opt, `${fmt(at)} ↔ ${fmt(v)}`, `${fmt(at)}의 짝은 ${rp4J(fmt(ab), "이에요")}.`); return true; }
    api.fail(`위의 ${rp4J(fmt(gt), "이가")} ${rp4J(fmt(at), "이가")} 되려면 몇 배를 해야 하는지 생각하고, 아래 수도 같은 배만큼 바꾸어 봐요.`, fmt(v)); return false;
  });
  draw();
}

/* ---------- ⑨ 띠를 주어진 비로 나누기 (막대를 놓으면 저절로 확인) ---------- */
function rp4Tape(body, api, opt) {
  /* 맞으면 rp4Finish가 api.done( 을 불러요 */
  const N = opt.N, [P, Q] = opt.ratio, snap = opt.snap || 1, L = 580, x0 = 40, y0 = 70, TH = 70;
  let v = Math.round(N / 2 / snap) * snap, fin = false;
  const root = h("div");
  const svg = makeSvg(660, 210); svg.setAttribute("class", "rp4fig");
  const read = h("div", { class: "rp4read" }, "​");
  const u = /^(개|장|자루|봉지|포기|컵|판|통|삽)$/.test(opt.unit) ? opt.unit : " " + opt.unit;
  const X = val => x0 + val / N * L;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: x0, y: y0, width: X(v) - x0, height: TH, fill: "#F6C08A", stroke: "#D9822B", "stroke-width": 2 }));
    svg.append(svgEl("rect", { x: X(v), y: y0, width: x0 + L - X(v), height: TH, fill: "#9CC6EC", stroke: "#2B7BD6", "stroke-width": 2 }));
    if (opt.icon) for (let i = 0; i < N; i++) svg.append(rp4Icon(opt.icon, X(i + .5), y0 + TH / 2, Math.min(52, L / N * .8)));
    if (fin) for (let i = 1; i < P + Q; i++) svg.append(svgEl("line", { x1: X(N * i / (P + Q)), y1: y0, x2: X(N * i / (P + Q)), y2: y0 + TH, stroke: INK, "stroke-width": 2, "stroke-dasharray": "5 4" }));
    svg.append(svgEl("rect", { x: X(v) - 7, y: y0 - 20, width: 14, height: TH + 40, rx: 6, fill: fin ? "#2E8B57" : "#C8472E", style: "cursor:ew-resize" }));
    svg.append(txt((x0 + X(v)) / 2, y0 - 26, opt.names[0], 17, { fill: "#B4610F" }), txt((X(v) + x0 + L) / 2, y0 - 26, opt.names[1], 17, { fill: "#1F5AA0" }));
    svg.append(txt((x0 + X(v)) / 2, y0 + TH + 26, `${v}${u}`, 19, { fill: "#B4610F" }), txt((X(v) + x0 + L) / 2, y0 + TH + 26, `${N - v}${u}`, 19, { fill: "#1F5AA0" }));
    svg.append(txt(x0 + L / 2, y0 + TH + 58, `전체 ${N}${u}`, 16, { fill: "#4A5A55" }));
    const g = rp4G(v, N - v) || 1;
    read.textContent = `${opt.names[0]} : ${opt.names[1]} = ${v} : ${N - v}` + (v && N - v && g > 1 ? ` (= ${v / g} : ${(N - v) / g})` : "");
  };
  const setV = pt => { v = Math.max(0, Math.min(N, Math.round(((pt.x - x0) / L * N) / snap) * snap)); draw(); };
  dragOn(svg, pt => { if (fin) return false; setV(pt); return true; }, setV);
  api.provide({ words: ["전체를 (비의 합)만큼 등분", "비례배분"], answers: [] });
  root.append(h("p", { class: "rp4note" }, "빨간 막대를 끌거나 단추를 눌러 띠를 두 부분으로 나눠요."), svg, read,
    h("div", { class: "rp4tools" }, h("button", { onclick: () => { if (fin) return; v = Math.max(0, v - snap); draw(); } }, `◀ ${snap}${u}만큼`), h("button", { onclick: () => { if (fin) return; v = Math.min(N, v + snap); draw(); } }, `${snap}${u}만큼 ▶`)));
  body.append(root);
  rp4Auto(root, () => v > 0 && v < N, () => String(v), () => {
    api.tryOnce();
    if (v * Q === (N - v) * P) { fin = true; draw(); rp4Finish(body, api, opt, `${v} : ${N - v}`, `${rp4J(N + u, "을를")} ${rp4J(P + " : " + Q, "으로")} 나누면 ${rp4J(v + u, "과와")} ${rp4J(N - v + u, "이에요")}. 전체를 ${P}+${Q}=${P + Q}등분했어요.`); return true; }
    api.fail(`지금은 ${rp4J(v + " : " + (N - v), "이에요")}. 전체를 ${P}+${Q}=${P + Q}등분한 것 중 ${P}만큼이 ${opt.names[0]} 몫이에요.`, `${v} : ${N - v}`); return false;
  });
  draw();
}

/* ---------- ⑫ 비율이 같은 직사각형 (놓으면 저절로 확인) ---------- */
function rp4Rect(body, api, opt) {
  /* 맞으면 rp4Finish가 api.done( 을 불러요 */
  const C = 26, GX = 14, GY = 10, ox = 20, oy = 20 + GY * C;
  let w = 1, hh = 1, fin = false;
  const root = h("div");
  const svg = makeSvg(ox * 2 + GX * C, oy + 30, 0); svg.setAttribute("class", "rp4fig");
  const read = h("div", { class: "rp4read" }, "​");
  const draw = () => {
    svg.innerHTML = "";
    const g = svgEl("g", { stroke: "#DCE4E0", "stroke-width": 1 });
    for (let i = 0; i <= GX; i++) g.append(svgEl("line", { x1: ox + i * C, y1: oy - GY * C, x2: ox + i * C, y2: oy }));
    for (let j = 0; j <= GY; j++) g.append(svgEl("line", { x1: ox, y1: oy - j * C, x2: ox + GX * C, y2: oy - j * C }));
    svg.append(g);
    svg.append(svgEl("rect", { x: ox, y: oy - opt.base[1] * C, width: opt.base[0] * C, height: opt.base[1] * C, fill: "#2B7BD6", "fill-opacity": .15, stroke: "#2B7BD6", "stroke-width": 2, "stroke-dasharray": "5 4" }));
    svg.append(svgEl("rect", { x: ox, y: oy - hh * C, width: w * C, height: hh * C, fill: "#D9822B", "fill-opacity": .25, stroke: "#D9822B", "stroke-width": 3 }));
    svg.append(svgEl("circle", { cx: ox + w * C, cy: oy - hh * C, r: 9, fill: fin ? "#2E8B57" : "#C8472E", style: "cursor:move" }));
    read.textContent = `가로 : 세로 = ${w} : ${hh}, 비율 ${rp4Fr(rp4Q(w, hh))}` + (w === opt.base[0] && hh === opt.base[1] ? " (파란 점선과 같은 크기)" : "");
  };
  const setP = pt => { w = Math.max(1, Math.min(GX, Math.round((pt.x - ox) / C))); hh = Math.max(1, Math.min(GY, Math.round((oy - pt.y) / C))); draw(); };
  dragOn(svg, pt => { if (fin) return false; setP(pt); return true; }, setP);
  api.provide({ words: ["가로 : 세로", "비율이 같아요"], answers: [] });
  root.append(h("p", { class: "rp4note" }, `파란 점선은 가로 ${opt.base[0]}칸, 세로 ${opt.base[1]}칸인 ${rp4J(opt.what || "판", "이에요")}. 빨간 점을 끌어 가로와 세로의 비가 ${rp4J(opt.base[0] + " : " + opt.base[1], "과와")} 비율이 같은 더 큰 ${rp4J(opt.what || "판", "을를")} 만들어요.`), svg, read);
  body.append(root);
  rp4Auto(root, () => !(w === 1 && hh === 1), () => w + ":" + hh, () => {
    api.tryOnce();
    if (w * opt.base[1] === hh * opt.base[0] && w > opt.base[0]) { fin = true; draw(); rp4Finish(body, api, opt, `${w} : ${hh}`, `${rp4J(w + " : " + hh, "은는")} ${opt.base[0]} : ${opt.base[1]}의 전항과 후항에 ${rp4J(String(w / opt.base[0]), "을를")} 곱한 비예요. 크기는 달라도 모양이 같아요.`); return true; }
    if (w * opt.base[1] === hh * opt.base[0]) { api.fail("비율은 같지만 파란 점선보다 더 큰 판을 만들어요.", `${w} : ${hh}`); return false; }
    api.fail(`${w} : ${hh}의 비율은 ${rp4Fr(rp4Q(w, hh))}, ${opt.base[0]} : ${opt.base[1]}의 비율은 ${rp4J(rp4Fr(rp4Q(opt.base[0], opt.base[1])), "이에요")}. 가로와 세로에 같은 수를 곱해 봐요.`, `${w} : ${hh}`); return false;
  });
  draw();
}

/* ---------- ⑬ 초록 텃밭 둘러보기 ---------- */
function rp4sGarden(body, api, opt) {
  /* 다섯 곳을 모두 누르면 api.done( 을 불러요 */
  const svg = makeSvg(720, 272); svg.setAttribute("class", "rp4fig");
  const R = (g, a) => g.append(svgEl("rect", a));
  const spots = [
    { x: 20, t: "화분 흙 섞기", say: "모종 화분에 넣는 상토의 양과 퇴비의 양을 비교해요.", draw: (g, x) => { g.append(rp4Icon("pot", x + 66, 110, 70), rp4Icon("soil", x + 40, 188, 38), rp4Icon("compost", x + 92, 188, 38)); } },
    { x: 160, t: "액비 물 타기", say: "물뿌리개에 넣는 액비 원액의 양과 물의 양을 비교해요.", draw: (g, x) => { g.append(rp4Icon("can", x + 66, 110, 74), rp4Icon("liquid", x + 40, 188, 38), rp4Icon("water", x + 92, 188, 38)); } },
    { x: 300, t: "빗물 저금통", say: "빗물이 모인 시간과 모인 빗물의 양을 비교해요.", draw: (g, x) => { R(g, { x: x + 36, y: 96, width: 60, height: 104, rx: 10, fill: "#BFE0F5", stroke: "#2B7BD6", "stroke-width": 2 }); R(g, { x: x + 36, y: 140, width: 60, height: 60, rx: 8, fill: "#6FB2E3" }); [0, 1, 2].forEach(i => g.append(rp4Icon("drop", x + 30 + i * 36, 74 - (i % 2) * 8, 22))); } },
    { x: 440, t: "텃밭 설계도", say: "설계도의 길이와 실제 텃밭의 길이를 비교해요.", draw: (g, x) => { R(g, { x: x + 18, y: 84, width: 96, height: 92, fill: "#FFFFFF", stroke: "#8A7552", "stroke-width": 2 }); R(g, { x: x + 30, y: 100, width: 72, height: 36, fill: "#CDEBC9", stroke: "#2E7A4C", "stroke-width": 2 }); g.append(txt(x + 66, 160, "1 : 50", 16, { fill: "#2F6B57" })); } },
    { x: 580, t: "수확물 나누기", say: "수확한 상추 봉지를 경로당과 아동 센터에 1 : 3으로 나누어요. 주어진 양을 나누는 상황이에요.", draw: (g, x) => { g.append(rp4Icon("bag", x + 40, 120, 48), rp4Icon("bag", x + 92, 120, 48), rp4Icon("bag", x + 66, 178, 48)); } }];
  const found = new Set(); const say = h("div", { class: "rp4read" }, "텃밭 곳곳을 눌러 두 양을 비교하거나 나누는 상황을 찾아봐요.");
  svg.append(svgEl("rect", { x: 0, y: 228, width: 720, height: 44, fill: "#E3D3B8" }));
  svg.append(txt(360, 26, "6학년 2반 초록 텃밭", 24, { fill: "#2F6B57" }));
  spots.forEach((s, i) => {
    const g = svgEl("g", { style: "cursor:pointer" });
    g.append(svgEl("rect", { x: s.x, y: 50, width: 132, height: 175, rx: 12, fill: "#FFFDF6", stroke: "#C9B79C", "stroke-width": 2 }));
    s.draw(g, s.x); g.append(txt(s.x + 66, 250, s.t, 15));
    const mk = svgEl("circle", { cx: s.x + 120, cy: 62, r: 11, fill: "#2E8B57", opacity: 0 }); g.append(mk);
    g.addEventListener("click", () => { found.add(i); mk.setAttribute("opacity", 1); say.textContent = `${s.t}: ${s.say}`;
      if (found.size === spots.length) api.done("텃밭 5곳", opt.ok); else api.hint(`○ ${found.size}곳을 살펴봤어요. 남은 곳도 눌러 봐요.`); });
    svg.append(g);
  });
  api.provide({ words: ["두 양을 비교하기", "주어진 양을 나누기"], answers: [] });
  body.append(svg, say);
}

/* ---------- ⑭ 10차시 놀이: 텃밭 축제 비 카드 (이 앱이 정한 카드 14장, 비율이 같은 카드가 꼭 한 장씩) ---------- */
const RP4_CARDS = ["3 : 5", "9 : 15", "2.4 : 1.6", "3 : 2", "[1/4] : [1/3]", "3 : 4", "5 : 4", "10 : 8", "0.6 : 2.1", "2 : 7", "[2/3] : [1/6]", "4 : 1", "7 : 5", "1.4 : 1"];
const RP4_CR = RP4_CARDS.map(rp4R);
RP4_CR.forEach((c, i) => { const n = RP4_CR.filter((d, j) => j !== i && rp4Same(c, d)).length; if (n !== 1) throw new Error("비 카드 짝 오류: " + c.t); });
const rp4Partner = i => RP4_CR.findIndex((d, j) => j !== i && rp4Same(RP4_CR[i], d));
let RP4_HAND = null, RP4_GOT = [];
/* 카드 고르기: 비율이 다른 카드 4장 (4장을 고르면 저절로 확인) */
function rp4Hand(body, api) {
  /* 알맞게 고르면 api.done( 을 불러요 */
  const order = [6, 1, 12, 4, 9, 2, 13, 0, 10, 7, 3, 5, 11, 8];
  const pk = new Set(); const root = h("div"); const row = h("div", { class: "rp4cards" });
  const btns = order.map(i => h("button", { class: "rp4card", onclick: e => { pk.has(i) ? pk.delete(i) : (pk.size < 4 && pk.add(i)); e.currentTarget.classList.toggle("rp4pk", pk.has(i)); info.textContent = `고른 카드 ${pk.size}장`; } }, RP4_CARDS[i]));
  btns.forEach(b => row.append(b));
  const info = h("div", { class: "rp4read" }, "고른 카드 0장");
  api.provide({ words: ["비율", "비율이 다른 카드"], answers: [] });
  root.append(row, info); body.append(root);
  rp4Auto(root, () => pk.size === 4, () => [...pk].sort().join(","), () => {
    api.tryOnce(); const L = [...pk];
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) if (rp4Same(RP4_CR[L[a]], RP4_CR[L[b]])) { api.fail(`${rp4J(RP4_CARDS[L[a]], "과와")} ${rp4J(RP4_CARDS[L[b]], "은는")} 비율이 ${rp4J(rp4Fr(RP4_CR[L[a]].v), "으로")} 같아요. 한 장을 눌러 빼고 비율이 다른 카드로 바꿔요.`, L.map(i => RP4_CARDS[i]).join(", ")); return false; }
    RP4_HAND = L.slice(); RP4_GOT = [];
    btns.forEach(b => { b.disabled = true; });
    api.done(L.map(i => RP4_CARDS[i]).join(", "), `고른 카드의 비율: ${L.map(i => rp4Fr(RP4_CR[i].v)).join(", ")} — 모두 달라요. 이 카드로 놀이를 해요.`); return true;
  });
}

/* thenWhy 안에서 만지기 + 빈칸(ask)을 쓰는 부품: 빈칸이 ‘왜 그럴까요?’ 칸보다 위에 오게 따로 담아요 */
function rp4In(body, api, fn, opt) { const d = h("div"); body.append(d); return fn(d, api, opt); }
/* 그림·글 상자 */
function rp4sNote(title, lines) { return h("div", { class: "rp4recipe" }, h("b", {}, title), h("ul", { style: "margin:.3em 0 .1em 1.2em;padding:0" }, lines.map(l => h("li", {}, l)))); }
function rp4Recipe(title, lines) { return h("div", { class: "rp4recipe" }, h("b", {}, title), h("ol", {}, lines.map(l => h("li", {}, l)))); }
/* 텃밭 설계도: 가로 8 cm, 설계도 길이 : 실제 길이 = 1 : 50 */
function rp4sPlan() {
  const s = makeSvg(580, 250); s.setAttribute("class", "rp4fig"); s.style.maxWidth = "580px";
  const g = svgEl("g", { stroke: "#DCE4E0", "stroke-width": 1 });
  for (let x = 20; x <= 360; x += 20) g.append(svgEl("line", { x1: x, y1: 20, x2: x, y2: 220 }));
  for (let y = 20; y <= 220; y += 20) g.append(svgEl("line", { x1: 20, y1: y, x2: 360, y2: y }));
  s.append(g);
  s.append(svgEl("rect", { x: 40, y: 60, width: 280, height: 105, fill: "#CDEBC9", stroke: "#2E7A4C", "stroke-width": 3 }));
  [0, 1, 2].forEach(i => s.append(svgEl("line", { x1: 60, y1: 85 + i * 28, x2: 300, y2: 85 + i * 28, stroke: "#8A6A3A", "stroke-width": 3, "stroke-dasharray": "8 6" })));
  s.append(svgEl("line", { x1: 40, y1: 190, x2: 320, y2: 190, stroke: "#C8472E", "stroke-width": 3 }), svgEl("line", { x1: 40, y1: 182, x2: 40, y2: 198, stroke: "#C8472E", "stroke-width": 3 }), svgEl("line", { x1: 320, y1: 182, x2: 320, y2: 198, stroke: "#C8472E", "stroke-width": 3 }));
  s.append(txt(180, 210, "8 cm", 18, { fill: "#C8472E" }));
  s.append(txt(470, 70, "텃밭 설계도", 20), txt(470, 110, "(설계도의 길이) :", 16), txt(470, 135, "(실제 텃밭의 길이)", 16), txt(470, 172, "= 1 : 50", 22, { fill: "#2F6B57" }));
  return s;
}
/* 텃밭 이름표 두 개: 가 12 cm × 9 cm, 나 15 cm × 10 cm */
function rp4sTags() {
  const s = makeSvg(520, 200); s.setAttribute("class", "rp4fig"); s.style.maxWidth = "520px";
  const f = (x, w, hh, nm, lw, lh) => { s.append(svgEl("rect", { x, y: 170 - hh, width: w, height: hh, rx: 6, fill: "#FFF6E3", stroke: "#8A6A3A", "stroke-width": 5 }), txt(x + w / 2, 170 - hh - 16, nm, 20), txt(x + w / 2, 188, lw, 15), txt(x + w + 30, 170 - hh / 2, lh, 15)); };
  f(40, 12 * 8, 9 * 8, "가", "12 cm", "9 cm"); f(270, 15 * 8, 10 * 8, "나", "15 cm", "10 cm");
  return s;
}
/* 모은 카드(짝)로 비례식 세우기 판 — 모은 짝이 4쌍보다 적으면 정해 둔 짝을 보태요 */
function rp4GotCards() {
  const used = new Set(), out = [];
  RP4_GOT.forEach(([x, y]) => { if (out.length >= 8 || used.has(x) || used.has(y)) return; used.add(x); used.add(y); out.push(x, y); });
  [[0, 1], [4, 5], [12, 13], [10, 11], [2, 3], [6, 7], [8, 9]].forEach(([x, y]) => { if (out.length >= 8 || used.has(x) || used.has(y)) return; used.add(x); used.add(y); out.push(x, y); });
  return out.sort((x, y) => (x * 5) % 14 - (y * 5) % 14).map(i => RP4_CARDS[i]);
}
/* 친구 만나기: 친구 카드와 비율이 같은 카드를 꺼내요 */
function rp4Meet(body, api, opt) {
  let hand = (RP4_HAND || [0, 2, 4, 6]).slice(); RP4_GOT = [];
  let good = 0, fr = null, phase = "pick"; const need = opt.rounds || 6;
  const area = h("div", { class: "rp4meet" }), mine = h("div"), friend = h("div"), msg = h("div", { class: "rp4read" }, "​"), score = h("div", { class: "rp4read" }, "​");
  const newFriend = () => {
    const got = RP4_GOT.flat(), pool0 = RP4_CARDS.map((_, i) => i).filter(i => !hand.includes(i) && !got.includes(i));
    const pool = pool0.filter(i => i !== fr).length ? pool0.filter(i => i !== fr) : pool0;
    const want = Math.random() < .55 ? hand.map(rp4Partner).filter(i => pool.includes(i)) : pool.filter(i => !hand.some(k => rp4Same(RP4_CR[i], RP4_CR[k])));
    const list = want.length ? want : pool; fr = list[Math.floor(Math.random() * list.length)]; phase = "pick"; draw();
  };
  const refill = () => { const all = RP4_CARDS.map((_, i) => i).sort(() => Math.random() - .5); hand = []; all.forEach(i => { if (hand.length < 4 && !hand.some(k => rp4Same(RP4_CR[i], RP4_CR[k]))) hand.push(i); }); };
  const draw = () => {
    mine.innerHTML = ""; friend.innerHTML = "";
    mine.append(h("div", { class: "rp4lbl" }, "내 카드"));
    const row = h("div", { class: "rp4cards" }); hand.forEach(i => row.append(h("button", { class: "rp4card", "data-t": RP4_CARDS[i], disabled: phase !== "pick", onclick: () => choose(i) }, RP4_CARDS[i]))); mine.append(row);
    friend.append(h("div", { class: "rp4lbl" }, "만난 친구가 보여 준 카드"), h("div", { class: "rp4cards" }, h("div", { class: "rp4card", "data-t": RP4_CARDS[fr], style: "cursor:default;border-color:#C8472E" }, RP4_CARDS[fr])));
    if (phase === "pick") friend.append(h("div", { class: "rp4tools" }, h("button", { onclick: () => choose(null) }, "비율이 같은 카드가 없어요")));
    if (phase === "rps") friend.append(h("div", { class: "rp4lbl" }, "가위바위보!"), h("div", { class: "rp4tools" }, ...["가위", "바위", "보"].map((t, k) => h("button", { onclick: () => rps(k) }, t))));
    score.textContent = `알맞게 판단한 횟수 ${good}/${need} · 모은 카드 ${RP4_GOT.length * 2}장(${RP4_GOT.length}쌍)`;
  };
  let myCard = null;
  const choose = i => {
    api.tryOnce(); const has = hand.find(k => rp4Same(RP4_CR[k], RP4_CR[fr]));
    if (i == null) {
      if (has != null) return api.fail(`내 카드 ${rp4J(RP4_CARDS[has], "과와")} 친구 카드 ${rp4J(RP4_CARDS[fr], "은는")} 비율이 ${rp4J(rp4Fr(RP4_CR[fr].v), "으로")} 같아요.`, "없음");
      good++; msg.textContent = `맞아요. 친구 카드 ${RP4_CARDS[fr]}의 비율 ${rp4J(rp4Fr(RP4_CR[fr].v), "과와")} 같은 카드가 없어요. 다른 사람을 만나러 가요.`; return next();
    }
    if (!rp4Same(RP4_CR[i], RP4_CR[fr])) return api.fail(`${RP4_CARDS[i]}의 비율은 ${rp4Fr(RP4_CR[i].v)}, ${RP4_CARDS[fr]}의 비율은 ${rp4J(rp4Fr(RP4_CR[fr].v), "으로")} 달라요.`, RP4_CARDS[i]);
    good++; myCard = i; phase = "rps"; msg.textContent = `${RP4_CARDS[i]} = ${RP4_CARDS[fr]} — 비율이 ${rp4J(rp4Fr(RP4_CR[i].v), "으로")} 같아요! 가위바위보를 해요.`; draw();
  };
  const rps = k => {
    const c = Math.floor(Math.random() * 3), N = ["가위", "바위", "보"];
    if (c === k) { msg.textContent = `친구도 ${N[c]}! 비겼어요. 한 번 더 해요.`; return; }
    const win = (k - c + 3) % 3 === 1;
    if (win) { RP4_GOT.push([myCard, fr]); msg.textContent = `친구는 ${N[c]} — 이겼어요! 친구의 카드 ${rp4J(RP4_CARDS[fr], "을를")} 가져와요.`; }
    else { hand = hand.filter(x => x !== myCard); msg.textContent = `친구는 ${N[c]} — 졌어요. 내 카드 ${rp4J(RP4_CARDS[myCard], "을를")} 친구에게 줘요.`; if (!hand.length) { refill(); msg.textContent += " 카드를 모두 잃어서 비율이 다른 카드 4장을 다시 골랐어요."; } }
    next();
  };
  const next = () => { if (good >= need) { phase = "end"; draw(); return api.done(`판단 ${good}번, ${RP4_GOT.length}쌍`, `친구를 ${need}번 만나 알맞게 판단했어요. 모은 카드는 ${RP4_GOT.length}쌍이에요.`); } newFriend(); };
  api.provide({ words: ["비율이 같으면 가위바위보", "비율이 다르면 다른 친구에게"], answers: [] });
  area.append(mine, friend); body.append(area, msg, score); newFriend();
}
/* 짝 맞추기: 카드 두 장을 눌러 비례식 세우기 */
function rp4Match(body, api, opt) {
  const cards = opt.cards.map(t => rp4R(t)); const need = opt.need || cards.length / 2;
  let sel = null, made = 0; const done = new Set(); const t0 = Date.now();
  const row = h("div", { class: "rp4cards" }), props = h("div", { class: "rp4props" }), info = h("div", { class: "rp4read" }, "​");
  const btns = cards.map((c, i) => h("button", { class: "rp4card", "data-t": c.t, onclick: () => tap(i) }, c.t));
  btns.forEach(b => row.append(b));
  const tap = i => {
    if (done.has(i)) return;
    if (sel == null) { sel = i; btns[i].classList.add("rp4pk"); return; }
    if (sel === i) { btns[i].classList.remove("rp4pk"); sel = null; return; }
    const a = sel; sel = null; btns[a].classList.remove("rp4pk"); api.tryOnce();
    if (!rp4Same(cards[a], cards[i])) return api.fail(`${cards[a].t}의 비율은 ${rp4Fr(cards[a].v)}, ${cards[i].t}의 비율은 ${rp4J(rp4Fr(cards[i].v), "으로")} 달라요. 비례식을 세울 수 없어요.`, `${cards[a].t} / ${cards[i].t}`);
    [a, i].forEach(k => { done.add(k); btns[k].classList.add("rp4dn"); btns[k].disabled = true; });
    made++; props.append(h("div", {}, `${cards[a].t} = ${cards[i].t}  (비율 ${rp4Fr(cards[i].v)})`));
    if (made >= need) api.done(props.textContent, (opt.ok || "비례식을 모두 세웠어요!") + (opt.timer ? ` 걸린 시간 ${Math.round((Date.now() - t0) / 1000)}초.` : ""));
    else info.textContent = `비례식 ${made}개를 세웠어요. ${need - made}개 남았어요.`;
  };
  api.provide({ words: ["비율이 같은 두 비", "비례식"], answers: [] });
  body.append(h("p", { class: "rp4note" }, "카드 두 장을 차례로 눌러 비율이 같은 두 비로 비례식을 세워요. 비율을 계산하거나 비의 성질을 이용해 확인해요."), row, props, info);
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 초록 텃밭 프로젝트", lines: [
  "푸른초등학교 6학년 2반은 학교 뒤뜰에 학급 텃밭을 가꾸기로 했어요. 텃밭 반장 지안이와 도현, 예린, 우진, 소윤, 태민, 하린, 민재가 모둠을 나누어 일을 맡았어요.",
  "모종 화분에 넣을 흙을 섞고, 액비에 물을 타고, 고랑에 모종을 심고, 모종판을 세고, 수확한 방울토마토를 바구니에 담고, 수확물을 이웃과 나누면서 비의 성질, 비례식과 그 성질, 비례배분을 알아봐요.",
  "마지막에는 텃밭 채소로 요리를 하고, 텃밭 축제에서 비 카드 놀이를 하고, 수확 잔치에서 배운 것을 발표해요."],
  one: "우리 반 초록 텃밭 프로젝트 · 흙·액비·모종·빗물·수확물에서 비의 성질, 간단한 자연수의 비, 비례식과 그 성질, 비례배분을 알아봐요." };
const UNIT_KEYWORDS = ["전항", "후항", "비율", "비의 성질", "0이 아닌 같은 수", "간단한 자연수의 비", "공배수", "공약수", "비례식", "외항", "내항", "외항의 곱 = 내항의 곱", "같은 차례로 비례식 세우기", "비례배분", "전체를 (비의 합)만큼 등분"];
const RP4S_PLAN = ["🪴 모종 화분 흙: 상토 3컵에 퇴비 2컵씩 섞기", "💧 액비 물 타기: 액비 원액 1컵에 물 5컵", "🌱 상추 고랑: 한 고랑에 모종 4포기, 퇴비 30 g", "🌧️ 빗물 저금통: 일정하게 내리는 비에 빗물이 모여요", "🗺️ 텃밭 설계도: 설계도의 길이와 실제 텃밭의 길이의 비는 1 : 50", "🎁 수확한 상추 12봉지를 경로당과 아동 센터에 1 : 3으로 나누기"];

const LESSONS = [
{
  id: "s1", no: 1, title: "초록 텃밭 계획을 세워요", soop: "개념 찾기(S)",
  question: "텃밭을 가꿀 때 두 양을 비교하거나 주어진 양을 나누는 일에는 무엇이 있을까요?",
  summary: "텃밭에는 상토와 퇴비의 양, 액비 원액과 물의 양, 설계도의 길이와 실제 길이처럼 두 양을 비로 비교하는 일과, 수확물을 정한 비로 나누는 일이 많아요. 비 4 : 10에서 10은 기준량, 4는 비교하는 양이고 비율은 [4/10] = 0.4 = 40 %예요. 이 단원에서는 비의 성질, 간단한 자연수의 비, 비례식과 그 성질, 비례배분을 배워요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "우리 반이 학교 텃밭을 가꾸어요! 텃밭 반장 지안이가 만든 ‘초록 텃밭 계획표’를 보고, 세 칸에 써서 붙여요.", hints: ["계획표에서 두 양이 함께 나오는 곳을 찾아봐요.", "화분이 늘어나면 흙과 퇴비는 어떻게 될지 떠올려요."],
      render: (b, a) => { b.append(rp4sNote("🌿 6학년 2반 초록 텃밭 계획표", RP4S_PLAN));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "계획표에 ~이 보여요", hint: "계획표에서 보이는 것", ex: ["상토 3컵에 퇴비 2컵처럼 두 양을 함께 쓰는 말이 보여요.", "1 : 50, 1 : 3처럼 기호 : 를 쓴 비가 보여요."] },
          { t: "생각해요", e: "💭", ph: "~할 때 비가 필요할 것 같아요", hint: "비가 필요한 일", ex: ["화분을 여러 개 만들 때 상토와 퇴비를 같은 비로 섞어야 흙이 똑같을 것 같아요.", "상추 12봉지를 1 : 3으로 나누려면 몇 봉지씩인지 계산해야 할 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 구할까?", hint: "궁금한 것", ex: ["설계도에서 8 cm인 텃밭은 실제로 몇 cm일까?", "12봉지를 1 : 3으로 나누면 두 곳은 각각 몇 봉지를 받을까?"] }],
          { ok: "텃밭 계획표에는 두 양을 비교하거나 나누는 일이 가득해요! 이 단원에서 하나씩 해결하는 방법을 알아봐요." }); } },
    { name: "그려 보기 — 텃밭 둘러보기", inst: "텃밭 곳곳을 모두 눌러 두 양을 비교하는 상황과 주어진 양을 나누는 상황을 찾아보세요.", hints: ["그림을 눌러요. 다섯 곳 모두 눌러 봐요.", "수확물 나누기는 전체를 둘로 나누는 상황이에요."],
      render: thenWhy((b, a) => rp4sGarden(b, a, { ok: "상토와 퇴비, 액비와 물, 시간과 빗물, 설계도와 실제 길이는 두 양을 비교하고, 상추 봉지는 정한 비로 나누어요." }),
        { q: "‘두 양을 비교하는 상황’과 ‘주어진 양을 나누는 상황’은 어떻게 다를까요?", ph: "두 양을 비교하는 것은 ~, 나누는 것은 ~", help: ["① 화분 흙 섞기에서 무엇과 무엇을 견주는지 떠올려요. → ② 수확물 나누기에서는 무엇이 정해져 있는지 떠올려요.", "‘비교하는 상황은 ~와 ~를 견주고, 나누는 상황은 전체 ~를 ~으로 나누어요.’ 꼴로 써요."],
          ans: "두 양을 비교하는 상황은 상토 3컵과 퇴비 2컵처럼 두 양을 비로 견주어요. 주어진 양을 나누는 상황은 상추 12봉지처럼 전체가 정해져 있고 그것을 1 : 3처럼 정한 비로 나누어요." }) },
    { name: "말해 보기 — 배운 내용 떠올리기", inst: "6학년 1학기에 배운 비와 비율을 떠올려요. 텃밭 고랑 10개 중 4개에 상추를 심었어요. 상추를 심은 고랑 수와 전체 고랑 수를 비교해 보세요.", hints: ["(비교하는 양) : (기준량)으로 써요. 상추를 심은 고랑 수를 전체 고랑 수와 비교해요.", "비율은 (비교하는 양) ÷ (기준량)이에요. 백분율은 비율에 100을 곱해 %를 붙여요."],
      render: (b, a) => rp4Chain(b, a, [
        ["상추를 심은 고랑 수와 전체 고랑 수의 비: ", { r: [4, 10], why: { "10:4": "상추를 심은 고랑 수를 앞에, 전체 고랑 수를 뒤에 써요." } }],
        ["4 : 10은 ‘4 ", { c: ["대", "더하기", "나누기"], a: 0 }, " 10’이라고 읽어요."],
        ["4 : 10에서 기준량은 ", { i: "10", why: { "4": "기호 : 의 오른쪽에 있는 수가 기준량이에요." } }, ", 비교하는 양은 ", { i: "4" }, "예요."],
        ["비율을 분수로 ", { f: "4/10" }, ", 소수로 ", { i: "0.4" }, ", 백분율로 ", { i: "40" }, " %"]],
        { ok: "4 : 10의 비율은 [4/10] = 0.4이고, 백분율로 40 %예요." }) },
    { name: "약속하기 — 배울 차례 정하기", inst: "이 단원에서 배울 내용을 배우는 차례대로 눌러 학습 계획을 세워 보세요.", hints: ["비의 성질을 먼저 배우고, 그것을 이용해 간단한 자연수의 비로 나타내요.", "비례식을 배운 다음 비례식의 성질과 활용을 배우고, 마지막에 비례배분을 배워요."],
      render: (b, a) => sequence(b, a, ["㉠ 비례배분을 해 볼까요", "㉡ 비의 성질을 알아볼까요", "㉢ 비례식을 알아볼까요", "㉣ 간단한 자연수의 비로 나타내어 볼까요", "㉤ 비례식을 활용해 볼까요", "㉥ 비례식의 성질을 알아볼까요"], [1, 3, 2, 5, 4, 0],
        { ok: "비의 성질 → 간단한 자연수의 비 → 비례식 → 비례식의 성질 → 비례식 활용 → 비례배분 차례로 배워요." }) },
    { name: "확인하기 — 텃밭에서 찾은 비", inst: "텃밭 계획표를 보고 물음에 답해 보세요.", hints: ["가로와 세로가 똑같이 3배가 되면 모양은 그대로예요.", "원액이 2배가 되면 물도 2배가 되어야 진하기가 같아요."],
      render: (b, a) => quiz(b, a, [
        { q: "텃밭 설계도를 크게 복사했더니 가로와 세로가 모두 3배가 되었어요. 복사한 설계도에서 세로에 대한 가로의 비율은 처음과 비교하면 어떨까요?", o: ["같아요", "3배가 돼요", "작아져요"], a: 0, why: { "1": "가로도 3배, 세로도 3배가 되었어요. (가로)÷(세로)는 그대로예요.", "2": "가로와 세로가 똑같이 3배가 되었으니 비율은 그대로예요." } },
        { q: "액비 원액 1컵에 물 5컵을 섞어요. 원액을 2컵 넣으면 물은 몇 컵 넣어야 진하기가 같을까요?", o: ["10컵", "6컵", "5컵"], a: 0, why: { "1": "원액이 1컵 늘었다고 물도 1컵만 늘리면 진하기가 달라져요. 원액이 2배가 되었으니 물도 2배예요.", "2": "원액이 2배가 되었으니 물도 5컵의 2배를 넣어요." } },
        { q: "화분 1개에 상토 3컵, 퇴비 2컵을 섞어요. 같은 흙으로 화분 2개를 채우려고 상토를 6컵 넣었다면 퇴비는 몇 컵 넣을까요?", o: ["4컵", "5컵", "3컵"], a: 0, why: { "1": "상토가 3컵 늘었다고 퇴비도 3컵 더하면 비율이 달라져요. 상토가 2배가 되었으니 퇴비도 2배예요.", "2": "퇴비를 1컵만 늘리면 흙의 섞인 정도가 달라져요." } }],
        { ok: "두 양이 같은 배만큼 커지면 비율은 같아요. 원액 2컵에는 물 10컵, 상토 6컵에는 퇴비 4컵이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 텃밭 설계도에서 텃밭의 가로는 8 cm예요. 설계도의 길이와 실제 텃밭의 길이의 비가 1 : 50일 때, 실제 텃밭의 가로는 몇 cm일까요?", hints: ["실제 길이는 설계도 길이의 50배예요.", "8 × 50 = 400이에요. 100 cm = 1 m예요."],
    render: (b, a) => { b.append(rp4sPlan()); rp4Chain(b, a, [
      ["실제 텃밭의 길이는 설계도의 길이의 ", { i: "50" }, "배예요."],
      ["실제 텃밭의 가로: 8 × 50 = ", { i: "400", why: { "58": "8과 50을 더하지 않고 곱해요.", "4000": "8 × 5 = 40이니 8 × 50 = 400이에요." } }, " (cm) = ", { i: "4" }, " m"]],
      { ok: "실제 텃밭의 가로는 400 cm, 곧 4 m예요. 이 단원에서 비례식을 배우면 이런 문제를 더 쉽게 풀 수 있어요." }); } }
},
{
  id: "s2", no: 2, title: "화분 흙을 섞어요 ― 비의 성질", soop: "개념 구축하기(O)",
  question: "비의 전항과 후항에 같은 수를 곱하거나 같은 수로 나누면 비율은 어떻게 될까요?",
  summary: "비 3 : 2에서 기호 : 앞에 있는 3을 전항, 뒤에 있는 2를 후항이라고 해요. 비의 전항과 후항에 0이 아닌 같은 수를 곱하여도 비율은 같고, 비의 전항과 후항을 0이 아닌 같은 수로 나누어도 비율은 같아요. 같은 수를 더하면 비율이 달라져요.",
  steps: [
    { name: "만져 보기 — 모종 화분 두 개", inst: "예린이네 모둠은 모종 화분 1개에 상토 3컵과 퇴비 2컵을 섞어 넣어요. 먼저 규칙을 예상하고, 화분을 두 개 만들어 화분 수에 따른 상토 컵 수와 퇴비 컵 수의 비와 비율을 비교해 보세요.", hints: ["‘모종 화분 하나 더 만들기’를 눌러 화분 두 개에 필요한 흙을 세어요.", "비율은 (상토 컵 수) ÷ (퇴비 컵 수)예요. [6/4]을 약분하면 얼마일까요?"],
      render: ruleFirst((b, a) => rp4Build(b, a, { what: "모종 화분", unit: "개", prod: "pot", start: 1, target: 2, max: 4,
        items: [{ name: "상토", per: 3, unit: "컵", icon: "soil" }, { name: "퇴비", per: 2, unit: "컵", icon: "compost" }],
        ask: [{ t: "화분 한 개", p: ["상토 컵 수와 퇴비 컵 수의 비 ", { r: [3, 2] }, ", 비율 ", { f: "3/2" }] },
          { t: "화분 두 개", p: ["상토 컵 수와 퇴비 컵 수의 비 ", { r: [6, 4], why: { "3:2": "화분 두 개에는 상토 6컵, 퇴비 4컵이 들어요.", "5:4": "상토도 퇴비도 2배가 돼요. 상토는 3컵의 2배인 6컵이에요." } }, ", 비율 ", { f: "6/4" }] },
          ["두 비율은 ", { c: ["같아요", "달라요"], a: 0 }, "."]],
        ok: "3 : 2의 비율은 [3/2], 6 : 4의 비율은 [6/4](=[3/2])로 같아요." }),
        { q: "화분이 2개가 되면 상토 컵 수와 퇴비 컵 수의 비는 어떻게 바뀌고, 비율은 어떻게 될까요?", ph: "내 규칙: 화분이 2개가 되면 ~", help: ["① 화분이 2개가 되면 상토와 퇴비가 각각 몇 배가 되는지 생각해요. → ② 두 수가 같은 배만큼 커질 때 비율이 어떻게 될지 예상해요.", "‘내 규칙: 화분이 2개가 되면 상토와 퇴비가 모두 ~배가 되어 비는 ~이 되고, 비율은 ~.’ 꼴로 써요."],
          ans: "화분이 2개가 되면 상토와 퇴비가 모두 2배가 되어 비는 6 : 4가 돼요. 3 : 2의 전항과 후항에 2를 곱한 것이고, 비율은 [3/2]으로 같아요." }) },
    { name: "그려 보기 — 전항과 후항에 같은 수를", inst: "비 3 : 2에서 기호 : 앞에 있는 3을 전항, 뒤에 있는 2를 후항이라고 해요. 3 : 2의 전항과 후항에 같은 수를 곱하여 9 : 6을 만들어 보세요. ‘같은 수 더하기’나 0을 곱하는 것도 해 보고 모양과 비율을 비교해 보세요.", hints: ["‘× 같은 수 곱하기’를 고르고 같은 수를 3으로 정해요.", "직사각형의 가로 : 세로가 비를 나타내요. 모양이 같으면 비율도 같아요."],
      render: thenWhy((b, a) => rp4In(b, a, rp4Machine, { start: [3, 2], goal: [9, 6], ops: ["×", "+", "÷"],
        ask: [["3 : 2에서 3은 ", { c: ["전항", "후항"], a: 0 }, ", 2는 ", { c: ["전항", "후항"], a: 1 }, "이에요."],
          ["3 : 2의 전항과 후항에 ", { i: "3" }, "을 곱하면 9 : 6이 되고, 비율은 같아요."],
          ["전항과 후항에 0을 곱하면 0 : 0이 되어 비율을 ", { c: ["비교할 수 없어요", "비교할 수 있어요"], a: 0 }, "."]],
        ok: "전항과 후항에 0이 아닌 같은 수를 곱하면 비율이 같아요." }),
        { q: "3 : 2의 전항과 후항에 같은 수 1을 더한 4 : 3은 왜 비율이 달라질까요?", ph: "3 : 2의 비율은 ~이고 4 : 3의 비율은 ~", help: ["① 3 : 2와 4 : 3의 비율을 각각 분수로 나타내요. → ② 두 분수의 크기를 견주어요.", "‘3 : 2의 비율은 ~, 4 : 3의 비율은 ~이라서 ~.’ 꼴로 써요."],
          ans: "3 : 2의 비율은 [3/2]이고 4 : 3의 비율은 [4/3]이라 서로 달라요. 같은 수를 더하면 두 수가 같은 배만큼 커지는 것이 아니라서 섞인 정도가 바뀌어요." }) },
    { name: "말해 보기 — 물뿌리개 한 통의 액비", inst: "우진이는 물뿌리개 2통에 액비 원액 2컵과 물 10컵을 넣었어요. 물뿌리개를 한 통으로 줄여 보고, 물뿌리개 수에 따른 원액 컵 수와 물 컵 수의 비와 비율을 비교해 보세요.", hints: ["‘물뿌리개 하나 줄이기’를 눌러요.", "[2/10]를 약분하면 [1/5]이에요."],
      render: (b, a) => rp4Build(b, a, { what: "물뿌리개", unit: "통", prod: "can", start: 2, target: 1, max: 2,
        items: [{ name: "액비 원액", per: 1, unit: "컵", icon: "liquid" }, { name: "물", per: 5, unit: "컵", icon: "water" }],
        ask: [{ t: "물뿌리개 두 통", p: ["원액 컵 수와 물 컵 수의 비 ", { r: [2, 10] }, ", 비율 ", { f: "2/10" }] },
          { t: "물뿌리개 한 통", p: ["원액 컵 수와 물 컵 수의 비 ", { r: [1, 5] }, ", 비율 ", { f: "1/5" }] },
          ["2 : 10의 전항과 후항을 ", { i: "2" }, "로 나누면 1 : 5가 되고, 두 비율은 ", { c: ["같아요", "달라요"], a: 0 }, ". 0으로는 ", { c: ["나눌 수 없어요", "나눌 수 있어요"], a: 0 }, "."]],
        ok: "2 : 10과 1 : 5의 비율은 [1/5]로 같아요. 전항과 후항을 0이 아닌 같은 수로 나누어도 비율은 같아요." }) },
    { name: "약속하기 — 비의 성질", inst: "알게 된 점을 약속으로 정리해요.", hints: ["0을 곱하면 0 : 0이 되고, 0으로는 나눌 수 없어요.", "같은 수를 더하면 비율이 달라졌지요?"],
      render: (b, a) => blanks(b, a, ["비 3 : 2에서 기호 : 앞에 있는 3을 ", { o: ["전항", "후항"], a: 0 }, ", 뒤에 있는 2를 ", { o: ["전항", "후항"], a: 1 }, "이라고 해요. 비의 전항과 후항에 ", { o: ["0이 아닌 같은 수", "0", "서로 다른 수"], a: 0 }, "를 곱하여도 비율은 같습니다. 비의 전항과 후항을 0이 아닌 같은 수로 ", { o: ["나누어도", "더해도"], a: 0 }, " 비율은 같습니다."],
        { ok: "비의 전항과 후항에 0이 아닌 같은 수를 곱하여도, 0이 아닌 같은 수로 나누어도 비율은 같습니다." }) },
    { name: "확인하기 — 비율이 같은 비 만들기", inst: "텃밭 흙과 액비를 여러 양으로 만들려고 해요. 비의 성질을 이용하여 빈칸에 알맞은 수를 써 보세요.", hints: ["4 : 7의 전항과 후항에 4를 곱해요.", "42는 6의 7배예요. 후항 13에도 7을 곱해요."],
      render: (b, a) => rp4Chain(b, a, [
        ["4 : 7 → 4 × 4 : 7 × 4 → ", { r: [16, 28] }],
        ["54 : 36 → 54 ÷ 9 : 36 ÷ 9 → ", { r: [6, 4] }],
        ["6 : 13 = 42 : ", { i: "91", why: { "49": "전항에 36을 더했다고 후항에도 36을 더하면 비율이 달라져요. 6에 7을 곱해 42가 되었어요." } }],
        ["8 : 56 = ", { i: "1" }, " : 7"]],
        { ok: "4 : 7 = 16 : 28, 54 : 36 = 6 : 4, 6 : 13 = 42 : 91, 8 : 56 = 1 : 7이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 비의 성질 문제를 풀고, 텃밭 이름표를 만들어 보세요.", hints: ["비의 성질을 설명할 때 ‘0이 아닌’이 중요해요.", "15 : 10의 전항과 후항을 5로 나누면 3 : 2예요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [
        ["9 : 16에서 전항은 ", { i: "9" }, ", 후항은 ", { i: "16" }, "이에요."],
        ["30 : 45와 비율이 같은 비를 하나 써 보세요: ", { r: [2, 3], any: true }]], { ok: "30 : 45와 비율이 같은 비는 2 : 3, 6 : 9, 60 : 90처럼 여러 가지예요.", simpNote: false }),
      (bx, ax) => quiz(bx, ax, [
        { q: "비의 성질을 잘못 설명한 것을 골라요.", o: ["㉠ 비의 전항과 후항을 0으로 나누어도 비율은 같습니다.", "㉡ 비의 전항과 후항에 4를 곱하여도 비율은 같습니다.", "㉢ 비의 전항과 후항을 3으로 나누어도 비율은 같습니다."], a: 0, why: { "1": "4는 0이 아니므로 맞는 설명이에요.", "2": "3은 0이 아니므로 맞는 설명이에요." } },
        { q: "가로와 세로의 비가 3 : 2와 비율이 같은 텃밭 이름표를 골라요.", fig: rp4sTags, o: ["가", "나"], a: 1, why: { "0": "가는 12 : 9예요. 3으로 나누면 4 : 3이에요." } }],
        { ok: "0으로는 나눌 수 없으므로 ㉠이 틀렸어요. 나 이름표는 15 : 10 = 3 : 2예요." }),
      (bx, ax) => rp4Rect(bx, ax, { base: [3, 2], what: "이름표", ok: "크기는 달라도 가로와 세로의 비율이 같으면 모양이 같아요." })]) }
},
{
  id: "s3", no: 3, title: "영양제를 섞어요 ― 간단한 자연수의 비", soop: "개념 구축하기(O)",
  question: "소수나 분수의 비를 간단한 자연수의 비로 어떻게 나타낼까요?",
  summary: "비의 성질을 이용하면 소수나 분수의 비를 간단한 자연수의 비로 나타낼 수 있어요. (소수) : (소수)는 10, 100, 1000…을 곱하고, (분수) : (분수)는 두 분모의 공배수를 곱해요. (분수) : (소수)는 분수를 소수로 바꾸거나 소수를 분수로 바꾸어 나타내요. 자연수의 비가 되면 두 수의 공약수로 나누어 더 간단하게 해요. ‘간단한’ 비는 한 가지만 있는 것이 아니에요.",
  steps: [
    { name: "만져 보기 — 물 1.2 L와 영양제 0.3 L", inst: "도현이는 고추 모종에 줄 물 1.2 L에 식물 영양제 0.3 L를 섞으려고 해요. 물의 양과 영양제의 양의 비 1.2 : 0.3을 먼저 어떻게 바꿀지 예상하고, 간단한 자연수의 비로 나타내 보세요.", hints: ["소수 한 자리 수이므로 전항과 후항에 10을 곱해요.", "12 : 3을 두 수의 공약수 3으로 나누어요."],
      render: ruleFirst((b, a) => rp4Simp(b, a, { a: "1.2", b: "0.3", ma: "dec", mb: "dec", simplest: true, noConv: true,
        ask: [["소수 한 자리 수이므로 전항과 후항에 ", { i: "10" }, "을 곱하면 ", { r: [12, 3] }, "이고, 다시 ", { i: "3" }, "으로 나누면 ", { r: [4, 1] }, "이에요."]],
        ok: "1.2 : 0.3 = 12 : 3 = 4 : 1이에요. 물과 영양제를 4 : 1로 섞어요." }),
        { q: "소수의 비를 자연수의 비로 바꾸려면 전항과 후항에 어떤 수를 곱하면 될까요?", ph: "내 규칙: 소수 한 자리 수는 ~을 곱하면", help: ["① 1.2와 0.3이 소수 몇 자리 수인지 살펴요. → ② 소수 한 자리 수를 자연수로 만드는 수를 떠올려요.", "‘내 규칙: 소수 한 자리 수는 전항과 후항에 ~을 곱하면 자연수가 돼요.’ 꼴로 써요."],
          ans: "소수 한 자리 수는 전항과 후항에 10을 곱하면 자연수가 돼요. 1.2 : 0.3에 10을 곱하면 12 : 3이고, 공약수 3으로 나누면 4 : 1이에요." }) },
    { name: "그려 보기 — 분수의 비", inst: "소윤이는 퇴비 [3/4]포대와 상토 [5/6]포대를 섞으려고 해요. 퇴비 양과 상토 양의 비 [3/4] : [5/6]를 간단한 자연수의 비로 나타내 보세요. 전항과 후항에 어떤 수를 곱해야 할까요?", hints: ["두 분모 4와 6의 공배수를 곱하면 분모가 없어져요.", "12를 곱하면 [3/4]×12 = 9, [5/6]×12 = 10이에요."],
      render: thenWhy((b, a) => rp4In(b, a, rp4Simp, { a: "3/4", b: "5/6", ma: "frac", mb: "frac", simplest: true, noConv: true, mults: [4, 6, 12],
        ask: [["두 분모 4와 6의 ", { c: ["공배수", "공약수"], a: 0 }, "인 ", { i: "12" }, "를 곱하면 ", { r: [9, 10] }, "이에요."]],
        ok: "[3/4] : [5/6] = 9 : 10이에요." }),
        { q: "[3/4] : [5/6]에 12 대신 24를 곱해도 될까요?", ph: "24도 4와 6의 ~이라서 ~", help: ["① 24가 4와 6의 공배수인지 살펴요. → ② 24를 곱한 비를 공약수로 나누면 어떻게 되는지 생각해요.", "‘24도 ~이라서 곱하면 ~ : ~이 되고, ~로 나누면 ~ : ~이 돼요.’ 꼴로 써요."],
          ans: "네, 24도 4와 6의 공배수라서 곱하면 18 : 20이 되고, 공약수 2로 나누면 9 : 10이 돼요. 최소공배수 12를 곱하면 한 번에 9 : 10이 돼요." }) },
    { name: "말해 보기 — (분수) : (소수) 두 가지 방법", inst: "태민이가 액비 [3/4] L와 물 0.5 L를 섞었어요. [3/4] : 0.5를 두 가지 방법으로 간단한 자연수의 비로 나타내고, 어느 방법이 편리했는지 말해 보세요.", hints: ["방법 1: ‘전항 바꾸기’로 [3/4]을 0.75로 바꾼 다음 100을 곱해요.", "방법 2: ‘후항 바꾸기’로 0.5를 [5/10]로 바꾼 다음 두 분모 4와 10의 공배수 20을 곱해요."],
      render: (b, a) => { rp4Seq(b, a, [
        { title: "방법 1 전항을 소수로 바꾸어 나타내기", run: (bx, ax) => rp4Simp(bx, ax, { a: "3/4", b: "0.5", ma: "frac", mb: "dec", need: "a2dec", simplest: true, ok: "[3/4] = 0.75, 0.75 : 0.5 = 75 : 50 = 3 : 2예요." }) },
        { title: "방법 2 후항을 분수로 바꾸어 나타내기", run: (bx, ax) => rp4Simp(bx, ax, { a: "3/4", b: "0.5", ma: "frac", mb: "dec", need: "b2frac", simplest: true, mults: [10, 20, 100], ok: "0.5 = [5/10], [3/4] : [5/10] = 15 : 10 = 3 : 2예요. 두 방법 모두 3 : 2가 돼요." }) }]);
        writeStep(b, a, [{ q: "두 방법 중 어느 방법이 더 편리했는지 까닭과 함께 써 보세요.", tag: "편리한 방법", ph: "나는 ~ 방법이 편리했어요. 왜냐하면 ~",
          help: ["① 두 방법에서 곱한 수와 나눈 수를 떠올려요. → ② 계산이 더 쉬웠던 방법을 골라 까닭을 써요.", "‘나는 ~을 ~로 바꾸는 방법이 편리했어요. ~하면 ~이 되기 때문이에요.’ 꼴로 써요."],
          ans: "전항을 소수로 바꾸는 방법이 편리했어요. [3/4] = 0.75로 바꾸면 소수끼리의 비가 되어 100을 곱하면 75 : 50이 되고, 25로 나누면 3 : 2가 되기 때문이에요." }]); } },
    { name: "약속하기 — 간단한 자연수의 비로 나타내기", inst: "간단한 자연수의 비로 나타내는 방법을 정리해요.", hints: ["소수 두 자리 수는 100을 곱하면 자연수가 돼요.", "분수의 분모를 없애려면 분모의 공배수를 곱해요."],
      render: (b, a) => blanks(b, a, ["(소수) : (소수)는 전항과 후항에 ", { o: ["10, 100, 1000…", "두 분모의 공배수"], a: 0 }, "을 곱하고, (분수) : (분수)는 전항과 후항에 ", { o: ["두 분모의 공배수", "두 분자의 합"], a: 0 }, "를 곱해요. 자연수의 비가 되면 두 수의 ", { o: ["공약수", "공배수"], a: 0 }, "로 나누어 더 간단하게 나타낼 수 있어요. (분수) : (소수)는 ", { o: ["분수를 소수로, 또는 소수를 분수로 바꾸어", "분수와 소수를 그대로 두고"], a: 0 }, " 나타내요."],
        { ok: "최소공배수뿐 아니라 다른 공배수를 곱해도 돼요. 그다음 공약수로 나누면 더 간단해져요." }) },
    { name: "확인하기 — 간단한 자연수의 비로", inst: "간단한 자연수의 비로 나타내 보세요. 비율이 같은 자연수의 비라면 정답이에요.", hints: ["[2/7] : [1/2]은 분모 7과 2의 공배수 14를 곱해요.", "[1 1/3] = [4/3]예요. 2.5 : [1/4]은 [1/4] = 0.25로 바꾸어 100을 곱해 봐요."],
      render: (b, a) => rp4Chain(b, a, [
        ["0.9 : 1.2 → ", { r: [3, 4], any: true }],
        ["[2/7] : [1/2] → ", { r: [4, 7], any: true, why: { "2:1": "분자끼리만 비로 쓰면 안 돼요. 두 분모의 공배수 14를 곱해요." } }],
        ["2.5 : [1/4] → ", { r: [10, 1], any: true }],
        ["[1 1/3] : [1/2] → ", { r: [8, 3], any: true }]],
        { ok: "예를 들어 3 : 4, 4 : 7, 10 : 1, 8 : 3으로 나타낼 수 있어요." }) }
  ],
  challenge: { inst: "★ 도전 — 텃밭에서 생긴 비를 간단한 자연수의 비로 나타내 보세요.", hints: ["[2/5] = 0.4, 0.43 = [43/100]이에요.", "고추 모종은 90 − 54 = 36포기예요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [
        { t: "방법 1", p: ["[2/5] = ", { i: "0.4" }, " → 0.4 : 0.43 → ", { r: [40, 43] }] },
        { t: "방법 2", p: ["0.43 = ", { f: "43/100" }, " → [2/5] : [43/100] → ", { r: [40, 43] }] }], { ok: "두 방법 모두 40 : 43이에요." }),
      (bx, ax) => rp4Chain(bx, ax, [
        ["3.5 : 2.8 → ", { r: [5, 4], any: true }], ["[5/6] : [3/8] → ", { r: [20, 9], any: true }],
        ["42 : 54 → ", { r: [7, 9], any: true }], ["1.3 : [7/10] → ", { r: [13, 7], any: true }]], { ok: "예를 들어 5 : 4, 20 : 9, 7 : 9, 13 : 7이에요." }),
      (bx, ax) => quiz(bx, ax, [{ q: "간단한 자연수의 비로 나타낸 것 중 잘못 나타낸 것을 골라요.", o: ["㉠ [1 1/4] : 1.5 → 5 : 6", "㉡ 2.4 : 0.9 → 8 : 3", "㉢ 0.6 : [4/5] → 4 : 3"], a: 2,
        why: { "0": "[1 1/4] = 1.25예요. 1.25 : 1.5에 100을 곱하면 125 : 150, 25로 나누면 5 : 6이에요.", "1": "2.4 : 0.9에 10을 곱하면 24 : 9, 3으로 나누면 8 : 3이에요." } }],
        { ok: "㉢ 0.6 : [4/5] = 0.6 : 0.8 = 3 : 4예요. 4 : 3은 전항과 후항을 바꾸어 썼어요." }),
      (bx, ax) => rp4Chain(bx, ax, [
        ["벌레를 쫓는 물을 만들려고 물 1.5 L에 식초 0.25 L를 섞었어요. 물 양 : 식초 양 → ", { r: [6, 1], any: true }],
        ["텃밭 모종 90포기 중 상추가 54포기이고 나머지는 모두 고추예요. 상추 수 : 고추 수 → ", { r: [3, 2], any: true, why: { "54:90": "90은 전체 모종 수예요. 고추는 90 − 54 = 36포기예요." } }]],
        { ok: "1.5 : 0.25 = 150 : 25 = 6 : 1, 54 : 36 = 3 : 2예요." })]) }
},
{
  id: "s4", no: 4, title: "상추 모종을 심어요 ― 비례식", soop: "개념 구축하기(O)",
  question: "비율이 같은 두 비를 어떻게 식으로 나타낼까요?",
  summary: "비율이 같은 두 비를 기호 =를 사용하여 4 : 30=8 : 60과 같이 나타낸 식을 비례식이라고 해요. 비례식 4 : 30=8 : 60에서 바깥쪽에 있는 4와 60을 외항, 안쪽에 있는 30과 8을 내항이라고 해요.",
  steps: [
    { name: "만져 보기 — 상추 고랑 두 개", inst: "하린이네 모둠은 텃밭 한 고랑에 상추 모종 4포기를 심고 퇴비 30 g을 뿌려요. 고랑을 두 개로 늘려 보고, 모종 수와 퇴비의 양의 비와 비율을 비교해 보세요.", hints: ["‘상추 고랑 하나 더 만들기’를 눌러요.", "[4/30]와 [8/60]을 약분하면 둘 다 [2/15]예요."],
      render: thenWhy((b, a) => rp4In(b, a, rp4Build, { what: "상추 고랑", unit: "개", start: 1, target: 2, max: 3,
        items: [{ name: "상추 모종", per: 4, unit: "포기", icon: "sprout" }, { name: "퇴비", per: 30, unit: "g", icon: "compost", lump: true }],
        ask: [{ t: "한 고랑", p: ["모종 수와 퇴비의 양의 비 ", { r: [4, 30] }, ", 비율 ", { f: "4/30" }] },
          { t: "두 고랑", p: ["모종 수와 퇴비의 양의 비 ", { r: [8, 60] }, ", 비율 ", { f: "8/60" }] },
          ["두 비율은 약분하면 ", { f: "2/15" }, "로 같아요."]],
        ok: "4 : 30과 8 : 60의 비율은 [2/15]로 같아요. 비율이 같으니 기호 =를 사용하면 좋겠어요." }),
        { q: "4 : 30과 8 : 60을 기호 =로 이어 쓸 수 있는 까닭은 무엇일까요?", ph: "두 비의 비율이 ~", help: ["① 두 비의 비율을 각각 구해 약분해요. → ② 8 : 60이 4 : 30에 어떤 수를 곱한 비인지 찾아요.", "‘두 비의 비율이 ~로 같기 때문이에요. 8 : 60은 4 : 30의 전항과 후항에 ~를 곱한 비예요.’ 꼴로 써요."],
          ans: "두 비의 비율이 [2/15]로 같기 때문이에요. 8 : 60은 4 : 30의 전항과 후항에 2를 곱한 비라서 비율이 같아요." }) },
    { name: "그려 보기 — 외항 ◯, 내항 △", inst: "비율이 같은 두 비를 기호 =를 사용하여 4 : 30=8 : 60과 같이 나타낼 수 있어요. 이와 같은 식을 비례식이라고 해요. 비례식에서 바깥쪽에 있는 두 수에 ◯, 안쪽에 있는 두 수에 △를 해 보세요.", hints: ["바깥쪽은 맨 앞의 4와 맨 뒤의 60이에요.", "안쪽은 기호 = 의 양옆에 있는 30과 8이에요."],
      render: (b, a) => rp4Terms(b, a, { props: [[4, 30, 8, 60]], ok: "4 : 30=8 : 60에서 바깥쪽 4와 60은 외항, 안쪽 30과 8은 내항이에요." }) },
    { name: "말해 보기 — 외항과 전항은 달라요", inst: "비례식에서 외항에 ◯표, 내항에 △표 해 보세요. 그리고 외항과 전항이 어떻게 다른지 말해 보세요.", hints: ["3 : 7=15 : 35에서 바깥쪽은 3과 35예요.", "40 : 24=5 : 3에서 안쪽은 24와 5예요."],
      render: thenWhy((b, a) => rp4Terms(b, a, { props: [[3, 7, 15, 35], [40, 24, 5, 3]], ok: "3 : 7=15 : 35의 외항은 3, 35, 내항은 7, 15예요. 40 : 24=5 : 3의 외항은 40, 3, 내항은 24, 5예요." }),
        { q: "외항과 전항은 어떻게 다를까요?", ph: "전항은 ~이고, 외항은 ~", help: ["① 전항은 한 비에서 어느 자리에 있는 항인지 떠올려요. → ② 외항은 비례식 전체에서 어느 자리에 있는지 떠올려요.", "‘전항은 ~에서 기호 : 앞에 있는 항이고, 외항은 ~에서 바깥쪽에 있는 두 항이에요.’ 꼴로 써요."],
          ans: "전항은 한 비에서 기호 : 앞에 있는 항이고, 외항은 비례식 전체에서 바깥쪽에 있는 두 항이에요. 3 : 7=15 : 35에서 전항은 3과 15, 외항은 3과 35예요." }) },
    { name: "약속하기 — 비례식, 외항과 내항", inst: "비례식과 외항, 내항을 약속해요.", hints: ["비율이 같은 두 비를 기호 =로 나타낸 식이에요.", "바깥쪽 두 항과 안쪽 두 항의 이름을 떠올려요."],
      render: (b, a) => blanks(b, a, ["비율이 같은 두 비를 기호 =를 사용하여 4 : 30=8 : 60과 같이 나타낸 식을 ", { o: ["비례식", "비율", "비"], a: 0 }, "이라고 합니다. 비례식 4 : 30=8 : 60에서 바깥쪽에 있는 4와 60을 ", { o: ["외항", "내항", "전항"], a: 0 }, ", 안쪽에 있는 30과 8을 ", { o: ["외항", "내항", "후항"], a: 1 }, "이라고 합니다."],
        { ok: "비례식에서 바깥쪽 두 항은 외항, 안쪽 두 항은 내항이에요." }) },
    { name: "확인하기 — 비례식 세우기", inst: "비의 성질을 이용하여 비례식을 세우고, 보기에서 비율이 같은 두 비를 찾아 비례식을 세워 보세요.", hints: ["3 : 8의 전항 3에 5를 곱하면 15예요.", "보기의 비를 간단한 자연수의 비로 나타내 비율을 비교해요. 1.2 : 1에 5를 곱하면?"],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => rp4Chain(bx, ax, [
          ["3 : 8은 전항과 후항에 ", { i: "5" }, "를 곱한 15 : ", { i: "40" }, "과 비율이 같으므로 비례식은 3 : 8=15 : ", { i: "40" }],
          ["42 : 18은 전항과 후항을 ", { i: "6" }, "으로 나눈 ", { i: "7" }, " : 3과 비율이 같으므로 비례식은 42 : 18=", { i: "7" }, " : 3"]],
          { ok: "3 : 8=15 : 40, 42 : 18=7 : 3이에요." }),
        { title: "보기: 6 : 5, [1/6] : [1/5], 1.2 : 1, 18 : 20", run: (bx, ax) => rp4Match(bx, ax, { cards: ["6 : 5", "[1/6] : [1/5]", "1.2 : 1", "18 : 20"], need: 1, ok: "6 : 5=1.2 : 1이에요. [1/6] : [1/5] = 5 : 6, 18 : 20 = 9 : 10은 비율이 달라요." }) }]) }
  ],
  challenge: { inst: "★ 도전 — 비례식 문제를 풀어 보세요.", hints: ["외항은 비례식 전체의 바깥쪽에 있는 두 수예요.", "5 : 9의 전항과 후항에 3을 곱하면 15 : 27이에요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [
        ["5 : 8의 비율 ", { f: "5/8" }, ", 15 : 24의 비율 ", { f: "15/24" }, " → 비례식 5 : 8=15 : 24"],
        ["7 : 12 →(×3)→ 21 : ", { i: "36" }, "이므로 7 : 12=21 : ", { i: "36" }],
        ["45 : 27 →(÷9)→ ", { i: "5" }, " : 3이므로 45 : 27=", { i: "5" }, " : 3"]], { ok: "5 : 8=15 : 24, 7 : 12=21 : 36, 45 : 27=5 : 3이에요." }),
      (bx, ax) => quiz(bx, ax, [{ q: "비례식 14 : 6=7 : 3을 옳게 설명한 사람을 골라요.", o: ["예린: 외항은 14와 3, 내항은 6과 7이야.", "우진: 외항은 14와 6이고, 내항은 7과 3이야."], a: 0, why: { "1": "14와 6은 앞의 비의 전항과 후항이에요. 외항은 바깥쪽의 14와 3, 내항은 안쪽의 6과 7이에요." } }], { ok: "예린이가 옳아요. 외항은 14와 3, 내항은 6과 7이에요." }),
      { title: "비율이 같은 두 비를 찾아 비례식을 세워요.", run: (bx, ax) => rp4Match(bx, ax, { cards: ["12 : 16", "20 : 25", "9 : 12"], need: 1, ok: "12 : 16=9 : 12예요. 둘 다 비율이 [3/4]이에요." }) },
      (bx, ax) => rp4Chain(bx, ax, [["비율은 [5/9]이고 내항은 27과 5인 비례식: ", { i: "15" }, " : 27=5 : ", { i: "9" }]], { ok: "15 : 27=5 : 9예요. 15 : 27의 전항과 후항을 3으로 나누면 5 : 9예요." })]) }
},
{
  id: "s5", no: 5, title: "모종판을 세어요 ― 비례식의 성질", soop: "개념 구축하기(O)",
  question: "비례식에서 외항의 곱과 내항의 곱은 어떤 관계가 있을까요?",
  summary: "비례식에서 외항의 곱과 내항의 곱은 같아요. 1 : 6=1×5 : 6×5에서 외항의 곱은 1×6×5, 내항의 곱은 6×1×5이므로 같아요. 이 성질을 이용하면 비례식의 □ 안에 알맞은 수를 구할 수 있어요.",
  steps: [
    { name: "만져 보기 — 모종판 다섯 판", inst: "민재는 모종판 1판에 상추 모종이 6포기씩 들어 있는 것을 보았어요. 모종판을 5판까지 늘려 보고, 먼저 규칙을 예상한 다음 비례식을 세워 보세요.", hints: ["‘모종판 하나 더 만들기’를 4번 눌러요.", "1 : 6의 전항과 후항에 5를 곱하면 5 : 30이에요."],
      render: ruleFirst((b, a) => rp4Build(b, a, { what: "모종판", unit: "판", start: 1, target: 5, max: 5,
        items: [{ name: "모종판", per: 1, unit: "판", icon: "tray" }, { name: "상추 모종", per: 6, unit: "포기", icon: "sprout" }],
        ask: [["1 : 6 →(×", { i: "5" }, ")→ 5 : 30이므로 비례식은 1 : 6=", { i: "5" }, " : ", { i: "30" }],
          ["외항의 곱: 1 × ", { i: "30" }, " = ", { i: "30" }],
          ["내항의 곱: 6 × ", { i: "5" }, " = ", { i: "30" }],
          ["외항의 곱과 내항의 곱은 ", { c: ["같아요", "달라요"], a: 0 }, "."]],
        ok: "1 : 6=5 : 30에서 외항의 곱 1×30과 내항의 곱 6×5는 모두 30으로 같아요." }),
        { q: "비례식 1 : 6=5 : 30에서 바깥쪽 두 수의 곱과 안쪽 두 수의 곱은 어떤 관계일까요?", ph: "내 규칙: 바깥쪽 두 수의 곱과 안쪽 두 수의 곱은 ~", help: ["① 바깥쪽 두 수와 안쪽 두 수를 찾아요. → ② 두 곱을 어림해 보고 크기를 예상해요.", "‘내 규칙: 바깥쪽 두 수의 곱과 안쪽 두 수의 곱은 ~.’ 꼴로 써요."],
          ans: "외항의 곱 1×30=30과 내항의 곱 6×5=30이 같아요. 비례식에서는 외항의 곱과 내항의 곱이 언제나 같아요." }) },
    { name: "그려 보기 — 넓이로 보는 두 곱", inst: "태민이는 3 : 7의 전항과 후항에 4를 곱해 비례식 3 : 7=12 : □를 세웠어요. 외항의 곱과 내항의 곱을 직사각형의 넓이로 나타냈어요. 빨간 손잡이를 끌거나 단추를 눌러 두 넓이가 같아지는 □를 찾아보세요.", hints: ["7에 4를 곱하면 □예요.", "내항의 곱은 7 × 12 = 84예요. 3 × □가 84가 되게 해요."],
      render: (b, a) => rp4Area(b, a, { p: [3, 7, 12, null], max: 40,
        ask: [["3 : 7=12 : ", { i: "28" }], ["외항의 곱 3 × 28 = ", { i: "84" }, ", 내항의 곱 7 × 12 = ", { i: "84" }]],
        ok: "3 : 7=12 : 28에서 외항의 곱과 내항의 곱은 84로 같아요." }) },
    { name: "말해 보기 — 왜 같을까요?", inst: "외항의 곱과 내항의 곱이 왜 같은지 이야기해 보세요.", hints: ["12는 3×4, 28은 7×4예요.", "곱하는 순서를 바꾸어도 곱은 같아요."],
      render: thenWhy((b, a) => blanks(b, a, ["3 : 7=3×4 : 7×4이므로 외항의 곱 3×28은 ", { o: ["3×7×4", "3×4×4"], a: 0 }, "이고, 내항의 곱 7×12는 ", { o: ["7×3×4", "7×7×4"], a: 0 }, "예요. 곱하는 수가 같고 순서만 다르므로 외항의 곱과 내항의 곱은 ", { o: ["같아요", "달라요"], a: 0 }, "."],
        { ok: "3 : 7=3×4 : 7×4의 외항의 곱은 3×7×4, 내항의 곱은 7×3×4이므로 같아요." }),
        { q: "다른 비례식에서도 외항의 곱과 내항의 곱이 같을까요? 까닭을 써요.", ph: "네, 2 : 5=2×■ : 5×■에서 ~", help: ["① 2 : 5의 전항과 후항에 같은 수 ■를 곱한 비례식을 생각해요. → ② 외항의 곱과 내항의 곱을 곱하는 수로 나누어 써 봐요.", "‘네, 외항의 곱은 ~×~×■, 내항의 곱은 ~×~×■이라서 ~.’ 꼴로 써요."],
          ans: "네. 2 : 5=2×■ : 5×■에서 외항의 곱은 2×5×■, 내항의 곱은 5×2×■예요. 곱하는 수가 같고 순서만 달라서 언제나 같아요." }) },
    { name: "약속하기 — 비례식의 성질", inst: "비례식의 성질을 약속해요.", hints: ["외항은 바깥쪽 두 항, 내항은 안쪽 두 항이에요."],
      render: (b, a) => blanks(b, a, ["비례식에서 ", { o: ["외항의 곱과 내항의 곱", "전항의 합과 후항의 합"], a: 0 }, "은 ", { o: ["같습니다", "다릅니다"], a: 0 }, "."],
        { ok: "비례식에서 외항의 곱과 내항의 곱은 같습니다." }) },
    { name: "확인하기 — 비례식 완성하기", inst: "비례식의 성질을 이용하여 비례식을 완성해 보세요. 직사각형의 넓이가 같아지게 □를 찾아요.", hints: ["4 : 5=□ : 20에서 외항의 곱은 4 × 20 = 80이에요. 5 × □ = 80이에요.", "□ : 9=24 : 27에서 내항의 곱은 9 × 24 = 216이에요. □ × 27 = 216이에요."],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => rp4Area(bx, ax, { p: [4, 5, null, 20], ask: [["외항의 곱 4 × 20 = ", { i: "80" }, " → 5 × □ = 80 → □ = ", { i: "16" }]], ok: "4 : 5=16 : 20이에요." }),
        (bx, ax) => rp4Area(bx, ax, { p: [null, 9, 24, 27], max: 16, ask: [["내항의 곱 9 × 24 = ", { i: "216" }, " → □ × 27 = 216 → □ = ", { i: "8" }]], ok: "8 : 9=24 : 27이에요." })]) }
  ],
  challenge: { inst: "★ 도전 — 비례식의 성질 문제를 풀어 보세요.", hints: ["15 : ㉠=3 : ㉡에서 외항은 15와 ㉡, 내항은 ㉠과 3이에요.", "1.5 : 2=3 : 5에서 외항의 곱 1.5×5와 내항의 곱 2×3을 비교해요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [["비례식 15 : ㉠=3 : ㉡에서 외항의 곱이 120일 때 ㉡ = ", { i: "8" }, ", ㉠ = ", { i: "40" }]], { ok: "15×㉡=120이므로 ㉡=8, 내항의 곱도 120이므로 ㉠×3=120, ㉠=40이에요." }),
      (bx, ax) => rp4Chain(bx, ax, [
        ["8 : 3=24 : 9 → 외항의 곱 8 × 9 = ", { i: "72" }, ", 내항의 곱 3 × 24 = ", { i: "72" }],
        ["7 : 4=□ : 12 → 4 × □ = ", { i: "84" }, ", □ = ", { i: "21" }],
        ["36 : 20=□ : 5 → □ = ", { i: "9" }, "      2 : 9=14 : □ → □ = ", { i: "63" }],
        ["5 : 6=㉠ : ㉡에서 외항의 곱이 210이면 ㉠ = ", { i: "35" }, ", ㉡ = ", { i: "42" }]], { ok: "외항의 곱과 내항의 곱이 같다는 성질로 모두 구했어요." }),
      (bx, ax) => quiz(bx, ax, [
        { q: "비례식의 성질을 이용하여 비례식을 모두 찾아요.", o: ["3 : 8=12 : 32", "1.5 : 2=3 : 5", "[2/3] : [1/2]=4 : 3"], a: [0, 2] },
        { q: "□ 안에 알맞은 수가 더 작은 것을 골라요. ㉠ □ : 8=15 : 24  ㉡ 3.6 : □=9 : 5", o: ["㉠", "㉡"], a: 1, why: { "0": "㉠ □×24=120이므로 □=5, ㉡ □×9=18이므로 □=2예요." } }],
        { bad: "외항의 곱과 내항의 곱을 각각 계산해 비교해요. 1.5×5=7.5, 2×3=6이에요.", ok: "3×32=8×12=96, [2/3]×3=[1/2]×4=2이므로 두 식이 비례식이에요. ㉠은 5, ㉡은 2예요." })]) }
},
{
  id: "s6", no: 6, title: "수확물을 담아요 ― 비례식 활용", soop: "개념 구축하기(O)",
  question: "비례식을 이용하여 텃밭에서 생긴 문제를 어떻게 해결할까요?",
  summary: "구하려는 것을 □라 하고, 두 양의 비를 같은 차례(예: 시간 : 물의 양 = 시간 : 물의 양)로 써서 비례식을 세워요. 비례식의 성질(외항의 곱 = 내항의 곱), 비의 성질(전항과 후항에 같은 수 곱하기), 비율(두 비율이 같음)을 이용해 □를 구할 수 있어요.",
  steps: [
    { name: "만져 보기 — 방울토마토 바구니", inst: "방울토마토를 수확했어요! 지안이네 모둠은 방울토마토를 크기가 같은 바구니에 똑같은 개수씩 담아요. “방울토마토 60개를 담는 데 바구니 3개가 필요해. 그럼 200개를 담으려면 바구니가 몇 개 필요할까?” 두 줄 수직선에서 200개의 짝을 찾아보세요.", hints: ["방울토마토 20개마다 바구니 1개예요.", "비례식 60 : 3=200 : □에서 외항의 곱과 내항의 곱이 같아요."],
      render: thenWhy((b, a) => rp4In(b, a, rp4Dbl, { top: { name: "방울토마토 수", unit: "개", tick: 20 }, bot: { name: "바구니 수", unit: "개", tick: 1, snap: 1 }, given: [60, 3], askAt: 200, tmax: 240,
        ask: [["방울토마토 60개일 때 방울토마토 수와 바구니 수의 비: ", { r: [60, 3] }],
          ["바구니를 □개라 하면 비례식은 60 : 3=200 : □"],
          ["60 × □ = 3 × 200 = ", { i: "600" }, ", □ = ", { i: "10" }, " (개)"]],
        ok: "방울토마토 200개를 담는 데 바구니 10개가 필요해요." }),
        { q: "왜 60 : 3=200 : □처럼 두 비를 같은 차례로 써야 할까요?", ph: "앞의 비가 (방울토마토 수) : (바구니 수)이면 ~", help: ["① 60 : 3에서 60과 3이 각각 무엇을 나타내는지 살펴요. → ② 뒤의 비 200 : □에서도 같은 자리에 같은 것이 와야 하는지 생각해요.", "‘앞의 비가 ~ : ~이니까 뒤의 비도 ~ : ~ 차례로 써야 비율을 견줄 수 있어요.’ 꼴로 써요."],
          ans: "앞의 비가 (방울토마토 수) : (바구니 수)이니까 뒤의 비도 같은 차례로 200 : □라고 써야 두 비의 비율을 견줄 수 있어요. 차례를 바꾸면 다른 양끼리 견주게 되어 답이 틀려요." }) },
    { name: "그려 보기 — 텃밭 물 펌프", inst: "텃밭의 물 펌프는 일정한 빠르기로 4분 동안 물 10 L를 퍼 올려요. 18분 동안에는 물을 몇 L 퍼 올릴까요? 두 줄 수직선에서 18분의 짝을 찾고, 우진이의 방법으로 구해 보세요.", hints: ["4분마다 10 L씩이니까 2분이면 5 L예요.", "시간 : 물의 양 = 시간 : 물의 양 차례로 비례식을 세워요."],
      render: (b, a) => rp4Dbl(b, a, { top: { name: "시간", unit: "분", tick: 2 }, bot: { name: "물의 양", unit: "L", tick: 5, snap: 5 }, given: [4, 10], askAt: 18, tmax: 20,
        ask: [{ t: "우진 · 비례식의 성질", p: ["4 : 10=18 : □ → 4 × □ = 10 × 18 = ", { i: "180" }, ", □ = ", { i: "45" }] }],
        ok: "물 펌프가 18분 동안 퍼 올리는 물은 45 L예요." }) },
    { name: "말해 보기 — 여러 가지 방법", inst: "소윤이와 민재의 방법으로도 물 펌프가 18분 동안 퍼 올리는 물의 양을 구하고, 내가 좋아하는 방법을 말해 보세요.", hints: ["4가 18이 되려면 [18/4] = [9/2]를 곱해요.", "두 비율 [4/10]와 [18/□]이 같아요. [4/10] = [2/5]예요."],
      render: (b, a) => { rp4Chain(b, a, [
        { t: "소윤 · 비의 성질", p: ["4 : 10의 전항과 후항에 ", { f: "9/2" }, "를 곱하면 18 : ", { i: "45" }] },
        { t: "민재 · 비율", p: ["[4/10] = [18/□]에서 □ = ", { i: "45" }] },
        ["물 펌프가 18분 동안 퍼 올리는 물은 ", { i: "45" }, " L예요."]],
        { ok: "비례식의 성질, 비의 성질, 비율 중 어느 방법으로도 45 L예요." });
        writeStep(b, a, [{ q: "세 가지 방법 중 내가 가장 좋아하는 방법과 그 까닭을 써 보세요.", tag: "좋아하는 방법", ph: "나는 ~의 방법이 좋아요. 왜냐하면 ~",
          help: ["① 우진(비례식의 성질)·소윤(비의 성질)·민재(비율)의 방법을 떠올려요. → ② 계산이 쉽거나 이해가 잘 된 방법을 골라 까닭을 써요.", "‘나는 ~의 방법이 좋아요. ~하면 ~을 바로 구할 수 있기 때문이에요.’ 꼴로 써요."],
          ans: "나는 우진이의 비례식의 성질이 좋아요. 4 : 10=18 : □를 세우고 외항의 곱과 내항의 곱이 같다는 것만 이용하면 4×□=180이라서 □=45를 바로 구할 수 있기 때문이에요." }]); } },
    { name: "약속하기 — 같은 차례로 비례식 세우기", inst: "비례식을 활용해 문제를 해결하는 방법을 정리해요.", hints: ["두 비에서 같은 자리에는 같은 종류의 양이 와요.", "□를 구할 때 외항의 곱과 내항의 곱이 같다는 성질을 써요."],
      render: (b, a) => blanks(b, a, ["구하려는 것을 □라 하고, 두 비의 차례를 ", { o: ["같게", "다르게"], a: 0 }, " 하여 비례식을 세워요. 그다음 ", { o: ["외항의 곱과 내항의 곱이 같다는 성질", "전항과 후항의 합이 같다는 성질"], a: 0 }, "을 이용하거나 비의 성질, 비율을 이용해 □를 구해요."],
        { ok: "두 비의 차례를 같게 세우고, 비례식의 성질이나 비의 성질·비율로 □를 구해요." }) },
    { name: "확인하기 — 바르게 세우고 풀기", inst: "비례식을 바르게 세웠는지 살펴보고, 주사위로 비례식을 만들어 보세요. 주사위를 두 번 던져 나온 눈의 수를 차례대로 비로 나타내고(예: 3, 2 → 3 : 2), 그 비와 60 : □의 비율이 같다고 보고 □를 구해요.", hints: ["두 비의 차례(시간 : 물의 양)를 같게 써요.", "3 : 2=60 : □이면 3 × □ = 2 × 60이에요."],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "물 펌프 문제(4분 동안 10 L, 18분 동안 □ L)의 비례식을 바르게 세운 것은?", o: ["4 : 10=18 : □", "4 : 10=□ : 18", "10 : 4=18 : □"], a: 0,
          why: { "1": "앞의 비는 시간 : 물의 양, 뒤의 비는 물의 양 : 시간이 되었어요. 두 비의 차례를 같게 써요.", "2": "앞의 비는 물의 양 : 시간, 뒤의 비는 시간 : 물의 양이에요. 같은 차례로 써요." } }], { ok: "시간 : 물의 양 = 시간 : 물의 양처럼 두 비의 차례를 같게 세워요." }),
        (bx, ax) => rp4Dice(bx, ax, { base: 60, need: 2, ok: "주사위로 만든 비례식을 비례식의 성질로 풀었어요." })]) }
  ],
  challenge: { inst: "★ 도전 — 텃밭 문제를 비례식을 세워 해결해 보세요.", hints: ["2 : 7=6 : □처럼 같은 차례로 세워요.", "3 : 4.5=□ : 7.5에서 4.5 × □ = 3 × 7.5예요."],
    render: (b, a) => rp4Chain(b, a, [
      ["퇴비와 흙을 2 : 7로 섞어요. 퇴비가 6삽이면 흙은 ", { i: "21", why: { "11": "퇴비가 4삽 늘었다고 흙도 4삽 더하면 안 돼요. 퇴비가 3배가 되었으니 흙도 3배예요." } }, "삽"],
      ["가로와 세로의 비가 3 : 5인 텃밭 안내판의 세로가 40 cm이면 가로는 ", { i: "24" }, " cm"],
      ["씨앗 5봉지가 4500원이면 같은 씨앗 8봉지는 ", { i: "7200" }, "원"],
      ["일정하게 내리는 비에 빗물 저금통에 3시간 동안 빗물 4.5 L가 모였어요. 빗물 7.5 L가 모이는 데 걸리는 시간은 ", { i: "5" }, "시간"]],
      { ok: "2 : 7=6 : 21, 3 : 5=24 : 40, 5 : 4500=8 : 7200, 3 : 4.5=5 : 7.5예요." }) }
},
{
  id: "s7", no: 7, title: "수확물을 나누어요 ― 비례배분", soop: "개념 구축하기(O)",
  question: "전체를 주어진 비로 어떻게 나눌까요?",
  summary: "전체를 주어진 비로 나누는 것을 비례배분이라고 해요. 상추 12봉지를 1 : 3으로 나누려면 전체를 (1+3)만큼 등분하여 12 × [1/4] = 3(봉지), 12 × [3/4] = 9(봉지)로 나눠요.",
  steps: [
    { name: "만져 보기 — 상추 봉지 나누기", inst: "우리 반은 수확한 상추를 동네 경로당과 아동 센터에 나누어 드리기로 했어요. 경로당과 아동 센터에 1 : 3으로 나누려고 해요. 먼저 어떻게 나눌지 예상하고, 상추 4봉지, 그다음 12봉지를 1 : 3으로 나누어 보세요.", hints: ["상추 4봉지는 1봉지와 3봉지로 나눠요.", "상추 12봉지는 3봉지씩 묶으면 4묶음이에요. 1묶음과 3묶음으로 나눠요."],
      render: ruleFirst((b, a) => rp4Seq(b, a, [
        { title: "상추 4봉지를 1 : 3으로", run: (bx, ax) => rp4Tape(bx, ax, { N: 4, unit: "봉지", snap: 1, ratio: [1, 3], names: ["경로당", "아동 센터"], icon: "bag" }) },
        { title: "상추 12봉지를 1 : 3으로", run: (bx, ax) => rp4Tape(bx, ax, { N: 12, unit: "봉지", snap: 1, ratio: [1, 3], names: ["경로당", "아동 센터"], icon: "bag", ok: "상추를 3봉지씩 묶으면 1묶음은 3봉지, 3묶음은 9봉지예요." }) }]),
        { q: "상추 12봉지를 1 : 3으로 나누면 경로당과 아동 센터는 각각 몇 봉지를 받을까요? 어떻게 나눌지 예상해요.", ph: "내 예상: 전체를 ~묶음으로 나누면 ~", help: ["① 1 : 3이면 전체를 몇 묶음으로 똑같이 나누면 좋을지 생각해요. → ② 한 묶음이 몇 봉지인지 어림해요.", "‘내 예상: 전체를 ~묶음으로 나누면 한 묶음은 ~봉지라서 경로당은 ~봉지, 아동 센터는 ~봉지예요.’ 꼴로 써요."],
          ans: "전체를 1+3=4묶음으로 똑같이 나누면 한 묶음은 12÷4=3(봉지)예요. 경로당은 1묶음인 3봉지, 아동 센터는 3묶음인 9봉지를 받아요." }) },
    { name: "그려 보기 — 전체의 몇 분의 몇", inst: "전체를 1로 생각하고 1 : 3으로 나누려면 전체를 (1+3)만큼 등분해야 해요. 두 곳에 드릴 상추는 전체의 몇 분의 몇인지 알아보고 계산해 보세요.", hints: ["전체를 4등분한 것 중 1만큼은 [1/4]이에요.", "12 × [3/4]은 12를 4로 나눈 것의 3배예요."],
      render: thenWhy((b, a) => rp4Chain(b, a, [
        ["경로당: 12 × ", { f: "1/4", why: { "1/3": "1 : 3은 전체를 3등분하는 것이 아니에요. 전체를 (1+3)=4만큼 등분해요." } }, " = ", { i: "3" }, "(봉지)"],
        ["아동 센터: 12 × ", { f: "3/4", why: { "3/1": "전체를 (1+3)=4만큼 등분한 것 중 3만큼이에요." } }, " = ", { i: "9" }, "(봉지)"]],
        { ok: "경로당에 3봉지, 아동 센터에 9봉지를 드려요." }),
        { q: "1 : 3으로 나눌 때 왜 전체를 4등분할까요?", ph: "1 : 3은 경로당이 ~만큼, 아동 센터가 ~만큼이니까 ~", help: ["① 1 : 3에서 두 곳이 각각 몇 만큼씩 받는지 살펴요. → ② 두 몫을 모으면 모두 몇 만큼인지 더해 봐요.", "‘1 : 3은 ~만큼과 ~만큼을 받는 것이라서 모두 ~만큼이니까 전체를 ~등분해요.’ 꼴로 써요."],
          ans: "1 : 3은 경로당이 1만큼, 아동 센터가 3만큼을 받는 것이라 모두 1+3=4만큼이에요. 그래서 전체를 4등분해 경로당은 [1/4], 아동 센터는 [3/4]을 받아요." }) },
    { name: "말해 보기 — 울타리 끈 나누기", inst: "1모둠과 2모둠이 텃밭 울타리를 묶을 끈 800 cm를 3 : 5로 나누어 가지려고 해요. 끈을 나누어 보고, 각각 몇 cm씩 가지면 되는지 구해 보세요.", hints: ["전체를 (3+5)=8만큼 등분해요.", "1모둠은 전체의 [3/8], 2모둠은 전체의 [5/8]예요."],
      render: (b, a) => rp4Tape(b, a, { N: 800, unit: "cm", snap: 50, ratio: [3, 5], names: ["1모둠", "2모둠"],
        ask: [["1모둠: 800 × ", { f: "3/8" }, " = ", { i: "300" }, " (cm)"], ["2모둠: 800 × ", { f: "5/8" }, " = ", { i: "500" }, " (cm)"]],
        ok: "1모둠은 300 cm, 2모둠은 500 cm를 가지면 돼요." }) },
    { name: "약속하기 — 비례배분", inst: "비례배분을 약속해요.", hints: ["전체를 주어진 비로 나누는 것이에요.", "1 : 3이면 1+3=4만큼 등분해요."],
      render: (b, a) => blanks(b, a, ["전체를 주어진 비로 나누는 것을 ", { o: ["비례배분", "비례식", "비율"], a: 0 }, "이라고 합니다. 전체를 1 : 3으로 나누려면 전체를 ", { o: ["(1+3)만큼", "1만큼", "3만큼"], a: 0 }, " 등분하여 전체의 [1/4]과 [3/4]으로 나눠요."],
        { ok: "전체를 주어진 비로 나누는 것을 비례배분이라고 합니다." }) },
    { name: "확인하기 — 문제를 만들어 풀기", inst: "보기에서 비 카드를 골라 문제를 완성하고, 답을 구해 보세요. 문제: “퇴비 840 g을 □(으)로 나누어 상추밭과 고추밭에 뿌렸습니다. 상추밭과 고추밭에 뿌린 퇴비는 각각 몇 g인가요?”", hints: ["3 : 4를 고르면 전체를 7만큼 등분해요.", "상추밭은 840 × (전항) ÷ (비의 합)으로 구해요."],
      render: (b, a) => rp4Clay(b, a, { total: 840, cards: ["1 : 2", "3 : 4", "5 : 7", "2 : 5"], need: 2, names: ["상추밭", "고추밭"], unit: "g",
        text: c => `퇴비 840 g을 ${rp4J(c, "으로")} 나누어 상추밭과 고추밭에 뿌렸습니다. 상추밭과 고추밭에 뿌린 퇴비는 각각 몇 g인가요?`,
        ok: "1 : 2면 280 g·560 g, 3 : 4면 360 g·480 g, 5 : 7이면 350 g·490 g, 2 : 5면 240 g·600 g이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 텃밭 비례배분 문제를 풀어 보세요.", hints: ["2 : 3이면 전체를 5만큼 등분해요.", "2시간은 120분이에요. 잡초 뽑기는 전체의 [5/8]예요."],
    render: (b, a) => rp4Chain(b, a, [
      ["씨앗 30개를 지안이와 도현이가 2 : 3으로 나누면 지안 ", { i: "12", why: { "15": "똑같이 둘로 나눈 것이 아니에요. 전체를 (2+3)=5만큼 등분해요." } }, "개, 도현 ", { i: "18" }, "개"],
      ["96을 5 : 3으로 나누면 96 × [5/8] = ", { i: "60" }, ", 96 × [3/8] = ", { i: "36" }],
      ["모종값 18000원을 두 반이 5 : 4로 나누어 내면 2반 ", { i: "10000" }, "원, 3반 ", { i: "8000" }, "원"],
      ["화분 흙 45컵을 예린이와 우진이가 4 : 5로 나누면 예린 ", { i: "20" }, "컵, 우진 ", { i: "25" }, "컵"],
      ["2시간 동안 물 주기와 잡초 뽑기를 3 : 5로 나누어 하면 잡초 뽑는 시간은 ", { i: "75", why: { "45": "그것은 물 주는 시간이에요. 잡초 뽑기는 전체의 [5/8]예요.", "60": "똑같이 반씩 나눈 것이 아니에요. 120 × [5/8]를 계산해요." } }, "분"]],
      { ok: "12개·18개, 60·36, 10000원·8000원, 20컵·25컵, 75분이에요." }) }
},
{
  id: "s89", no: "8~9", title: "텃밭 요리 교실 ― 재료의 양을 구해요", soop: "탐구 정리하기(O)",
  question: "비례식과 비례배분을 이용하여 요리 재료의 양을 어떻게 구할까요?",
  summary: "조리법의 기준 인분과 만들려는 인분으로 비례식을 세워 재료의 양을 구하고, 섞은 재료는 주어진 비로 비례배분해요. 문제해결은 이해해요 → 계획해요 → 해결해요 → 되돌아봐요 차례로 해요. 상추겉절이 6인분: 상추 300 g, 양파 36 g, 부추 54 g. 방울토마토 주스 5인분: 방울토마토 750 g, 우유 250 mL, 요구르트 150 mL.",
  steps: [
    { name: "이해해요 — 조리법 살펴보기", inst: "실과 시간에 텃밭에서 딴 상추로 상추겉절이를 만들어요(수학+실과). 하린이네 모둠 6명이 조리법을 보고 상추겉절이 6인분을 만들려고 해요. 6인분에 필요한 상추, 양파, 부추의 양은 각각 몇 g인지 구하려고 해요. 문제를 이해해 보세요.", hints: ["조리법 제목 옆의 (4인분)을 살펴요.", "참기름은 양이 정해져 있지 않아요. 재료의 양을 구하는 데 쓰지 않아요."],
      render: (b, a) => { b.append(rp4Recipe("상추겉절이(4인분)", ["상추 200 g을 씻어서 먹기 좋게 뜯습니다.", "양파와 부추를 썰어서 2 : 3으로 섞은 것 60 g을 상추에 넣습니다.", "양념을 넣고 참기름을 조금 둘러 버무립니다."]));
        quiz(b, a, [
          { q: "조리법은 몇 인분을 기준으로 쓰여 있나요?", o: ["4인분", "6인분", "2인분"], a: 0 },
          { q: "하린이네 모둠이 만들려는 양은?", o: ["6인분", "4인분", "60인분"], a: 0 },
          { q: "양파와 부추를 섞는 비는?", o: ["2 : 3", "3 : 2", "4 : 6"], a: 0, why: { "1": "양파와 부추의 차례로 2 : 3이에요." } },
          { q: "문제를 해결하는 데 필요하지 않은 정보는?", o: ["참기름을 조금 두른다는 것", "상추 200 g", "섞은 것 60 g"], a: 0 }],
          { ok: "조리법은 4인분 기준이고 6인분을 만들어요. 양파와 부추는 2 : 3으로 섞어요. 참기름은 필요하지 않아요." }); } },
    { name: "계획해요 — 해결 계획 세우기", inst: "“조리법과 만들려고 하는 양이 각각 몇 인분인지를 이용하여 비로 나타내어 볼까?” 해결 계획을 세워 보세요.", hints: ["인분 수와 재료의 양의 비가 같아야 해요.", "섞은 것을 양파와 부추로 나누는 것은 전체를 주어진 비로 나누는 것이에요."],
      render: (b, a) => blanks(b, a, ["상추의 양은 (인분 수) : (상추의 양)으로 ", { o: ["비례식", "비례배분"], a: 0 }, "을 세워 구하고, 섞은 것의 양도 ", { o: ["비례식", "비례배분"], a: 0 }, "을 세워 구해요. 양파와 부추의 양은 섞은 것의 양을 2 : 3으로 ", { o: ["비례배분해요", "더해요"], a: 0 }, "."],
        { ok: "상추와 섞은 것은 비례식으로, 양파와 부추는 비례배분으로 구해요." }) },
    { name: "해결해요 ① — 비례식으로", inst: "6인분에 필요한 상추의 양과 섞은 것의 양을 비례식으로 구해 보세요.", hints: ["4 : 200=6 : □에서 4 × □ = 200 × 6이에요.", "4 : 60=6 : □에서 4 × □ = 60 × 6이에요."],
      render: (b, a) => rp4Chain(b, a, [
        { t: "상추", p: ["4 : 200=6 : □ → 4 × □ = ", { i: "1200" }, ", □ = ", { i: "300" }, " (g)"] },
        { t: "섞은 것", p: ["4 : 60=6 : □ → 4 × □ = ", { i: "360" }, ", □ = ", { i: "90", why: { "60": "60 g은 4인분이에요. 6인분은 더 많아요.", "62": "인분이 2 늘었다고 2 g만 더하면 안 돼요." } }, " (g)"] }],
        { ok: "6인분에는 상추 300 g, 섞은 것 90 g이 필요해요." }) },
    { name: "해결해요 ② — 비례배분으로", inst: "섞은 것 90 g을 양파와 부추 2 : 3으로 나누어 보세요.", hints: ["전체를 (2+3)=5만큼 등분해요.", "양파는 90 × [2/5]예요."],
      render: (b, a) => rp4Tape(b, a, { N: 90, unit: "g", snap: 6, ratio: [2, 3], names: ["양파", "부추"],
        ask: [["양파: 90 × ", { f: "2/5" }, " = ", { i: "36" }, " (g)"], ["부추: 90 × ", { f: "3/5" }, " = ", { i: "54" }, " (g)"]],
        ok: "상추겉절이 6인분에는 상추 300 g, 양파 36 g, 부추 54 g이 필요해요." }) },
    { name: "되돌아봐요 — 다른 방법 찾기", inst: "잘 해결했는지 되돌아보고, 다른 방법도 찾아보세요.", hints: ["4인분을 1인분으로 만든 다음 6인분으로 만들 수도 있어요.", "6인분은 4인분의 [6/4] = [3/2]배예요."],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => rp4Chain(bx, ax, [["다른 방법: 6인분은 4인분의 ", { f: "3/2" }, "배이므로 상추는 200 × [3/2] = ", { i: "300" }, " (g)"],
          ["4인분 → 1인분 → 6인분: 200 ÷ 4 = ", { i: "50" }, ", 50 × 6 = ", { i: "300" }, " (g)"]], { ok: "어느 방법으로 구해도 300 g이에요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "내가 해결한 방법을 친구에게 설명하듯 써 보세요.", tag: "해결 방법", ph: "4인분과 6인분의 비를 이용해 비례식 4 : 200=6 : □를 세웠어요. ~",
          help: ["① 상추와 섞은 것을 어떤 식으로 구했는지 써요. → ② 양파와 부추를 어떻게 나누었는지 이어서 써요.", "‘먼저 비례식 ~을 세워 ~을 구했어요. 그다음 ~을 ~으로 비례배분했어요.’ 꼴로 써요."],
          ans: "먼저 비례식 4 : 200=6 : □를 세워 외항의 곱과 내항의 곱이 같다는 성질로 상추 300 g을 구했어요. 섞은 것도 4 : 60=6 : □로 90 g을 구한 다음, 90 g을 2 : 3으로 비례배분해서 양파 36 g, 부추 54 g을 구했어요." }])]) }
  ],
  challenge: { inst: "★ 도전 — 방울토마토 주스(3인분) 조리법이에요. 소윤이네 모둠이 주스 5인분을 만들려고 해요. 5인분에 필요한 방울토마토, 우유, 요구르트의 양을 구해 보세요. 이번에는 조리법이 몇 인분 기준인지 꼭 확인해요.", hints: ["이 조리법은 3인분 기준이에요. 3 : 450=5 : □예요.", "섞은 것 400 mL를 5 : 3으로 나누면 전체를 8만큼 등분해요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => { bx.append(rp4Recipe("방울토마토 주스(3인분)", ["방울토마토 450 g을 씻어 꼭지를 땁니다.", "우유와 요구르트를 5 : 3으로 섞은 것 240 mL를 붓고 갈아 줍니다."]));
        rp4Chain(bx, ax, [
          { t: "방울토마토", p: ["3 : 450=5 : □ → 3 × □ = ", { i: "2250" }, ", □ = ", { i: "750", why: { "450": "450 g은 3인분이에요. 5인분은 더 많아요." } }, " (g)"] },
          { t: "섞은 것", p: ["3 : 240=5 : □ → 3 × □ = ", { i: "1200" }, ", □ = ", { i: "400" }, " (mL)"] }], { ok: "5인분에는 방울토마토 750 g, 섞은 것 400 mL가 필요해요." }); },
      (bx, ax) => rp4Tape(bx, ax, { N: 400, unit: "mL", snap: 10, ratio: [5, 3], names: ["우유", "요구르트"],
        ask: [["우유: 400 × ", { f: "5/8" }, " = ", { i: "250" }, " (mL)"], ["요구르트: 400 × ", { f: "3/8" }, " = ", { i: "150" }, " (mL)"]],
        ok: "방울토마토 주스 5인분에는 방울토마토 750 g, 우유 250 mL, 요구르트 150 mL가 필요해요." })]) }
},
{
  id: "s10", no: 10, title: "텃밭 축제 놀이 ― 짝을 찾아 비례식을 세워요", soop: "발표하기(P)",
  question: "비율이 같은 두 비를 찾아 비례식을 세울 수 있을까요?",
  summary: "카드에 적힌 비의 비율을 구하거나 비의 성질을 이용해 비율이 같은 두 비를 찾고, 기호 =를 사용하여 비례식으로 나타내요(예: 3 : 5=9 : 15). 이 앱의 비 카드 14장은 이 앱이 정한 카드예요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알기", inst: "텃밭 축제 날, 우리 반은 ‘짝을 찾아 비례식을 세워요’ 놀이를 해요(인원: 학급 전체, 준비물: 비 카드, 타이머, 놀이 시간 예: 5분). 놀이 순서대로 눌러 보세요.", hints: ["먼저 비율이 다른 카드 4장을 골라요.", "시간이 끝나면 자리로 돌아와 비례식을 세우고 발표해요."],
      render: (b, a) => sequence(b, a, ["㉠ 정해진 시간이 끝나면 자리로 돌아와 모은 카드로 비례식을 세워요.", "㉡ 카드를 살펴보며 비율을 구하고, 비율이 다른 카드 4장을 골라요.", "㉢ 돌아다니다 친구를 만나면 카드를 한 장씩 골라 동시에 보여 줘요.", "㉣ 세운 비례식을 발표하고 맞는지 서로 확인해요. 가장 많은 비례식을 세운 사람이 이겨요.", "㉤ 두 비의 비율이 같으면 가위바위보를 하여 이긴 사람이 상대의 카드를 가져와요."], [1, 2, 4, 0, 3],
        { ok: "카드 4장 고르기 → 만나서 카드 보여 주기 → 비율이 같으면 가위바위보 → 시간이 끝나면 비례식 세우기 → 발표하고 확인하기예요. 카드를 모두 잃으면 4장을 다시 골라 참여해요." }) },
    { name: "그려 보기 — 카드 고르기", inst: "텃밭 축제 비 카드 14장이에요(이 앱이 정한 카드예요). 카드를 살펴보며 비율을 구하고, 비율이 다른 카드 4장을 골라 보세요.", hints: ["3 : 5와 9 : 15처럼 비율이 같은 카드는 함께 고르지 않아요.", "[1/4] : [1/3]은 12를 곱하면 3 : 4예요. 2.4 : 1.6은 10을 곱하고 8로 나누면 3 : 2예요."],
      render: (b, a) => rp4Hand(b, a) },
    { name: "말해 보기 — 친구 만나기", inst: "축제 마당을 돌아다니다 친구를 만났어요. 친구가 보여 준 카드와 비율이 같은 카드가 내게 있으면 그 카드를 눌러 꺼내고, 없으면 ‘비율이 같은 카드가 없어요’를 눌러요. 비율이 같으면 가위바위보를 해요. 6번 알맞게 판단해 보세요.", hints: ["친구 카드의 비율을 구한 다음 내 카드의 비율과 비교해요.", "소수나 분수의 비는 간단한 자연수의 비로 바꾸어 비교하면 쉬워요."],
      render: (b, a) => rp4Meet(b, a, { rounds: 6 }) },
    { name: "약속하기 — 모은 카드로 비례식 세우기", inst: "정해진 시간이 끝났어요. 자리로 돌아와 모은 카드를 이용하여 비례식을 세워 보세요(모은 카드가 적으면 친구 카드를 보태어 4쌍으로 했어요).", hints: ["카드 두 장을 차례로 눌러요.", "비율이 같은 두 카드만 비례식이 돼요."],
      render: (b, a) => rp4Match(b, a, { cards: rp4GotCards(), ok: "모은 카드로 비례식을 모두 세웠어요!" }) },
    { name: "확인하기 — 친구의 비례식 확인하기", inst: "친구들이 발표한 비례식이 맞는지 서로 확인해 보세요.", hints: ["두 비의 비율을 구해 같은지 확인해요.", "5 : 4와 4 : 5는 전항과 후항이 바뀌어 비율이 달라요."],
      render: (b, a) => quiz(b, a, [
        { q: "맞는 비례식을 모두 골라요.", o: ["3 : 5=9 : 15", "5 : 4=4 : 5", "[2/3] : [1/6]=4 : 1", "0.6 : 2.1=7 : 2", "2.4 : 1.6=3 : 2"], a: [0, 2, 4] },
        { q: "비율이 같은 두 비를 찾는 방법으로 알맞지 않은 것은?", o: ["두 비의 비율을 구해 비교해요.", "간단한 자연수의 비로 나타내어 비교해요.", "전항과 후항에 같은 수를 더해 봐요."], a: 2, why: { "0": "비율을 구해 비교하는 것은 알맞은 방법이에요.", "1": "간단한 자연수의 비로 나타내 비교하는 것은 알맞은 방법이에요." } }],
        { bad: "5 : 4의 비율은 [5/4], 4 : 5의 비율은 [4/5]예요. 0.6 : 2.1은 2 : 7이에요.", ok: "3 : 5=9 : 15, [2/3] : [1/6]=4 : 1, 2.4 : 1.6=3 : 2가 맞는 비례식이에요. 같은 수를 더하면 비율이 달라져요." }) }
  ],
  challenge: { inst: "★ 도전 — 또 다른 놀이: 비 카드 14장을 모두 펼쳐 놓고 비례식 7개를 가장 빨리 세워 보세요.", hints: ["먼저 자연수의 비 카드를 간단히 해 두면 짝을 찾기 쉬워요.", "1.4 : 1에 5를 곱하면 7 : 5예요."],
    render: (b, a) => rp4Match(b, a, { cards: [4, 9, 0, 13, 6, 11, 2, 8, 1, 12, 5, 10, 3, 7].map(i => RP4_CARDS[i]), timer: true, ok: "비례식 7개를 모두 세웠어요!" }) }
},
{
  id: "s11", no: 11, title: "텃밭 수확 잔치 ― 배운 내용을 발표해요", soop: "발표하기(P)",
  question: "비례식과 비례배분에 대해 공부한 내용을 잘 알고 있나요?",
  summary: "비의 전항과 후항에 0이 아닌 같은 수를 곱하거나 0이 아닌 같은 수로 나누어도 비율은 같아요. 비율이 같은 두 비를 기호 =로 나타낸 식이 비례식이고, 바깥쪽 두 항은 외항, 안쪽 두 항은 내항이에요. 비례식에서 외항의 곱과 내항의 곱은 같아요. 전체를 주어진 비로 나누는 것을 비례배분이라고 해요.",
  steps: [
    { name: "만져 보기 — 비의 성질", inst: "수확 잔치에서 모둠마다 배운 내용을 발표해요. 먼저 비의 성질 문제를 풀어 보세요.", hints: ["18 : 24를 6으로 나누면 3 : 4, 3으로 나누면 6 : 8, 2를 곱하면 36 : 48이에요.", "[1/3] : [3/4]에 12를 곱하면 4 : 9예요."],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "18 : 24와 비율이 같은 비를 모두 골라요.", o: ["3 : 4", "6 : 8", "9 : 16", "36 : 48", "24 : 30"], a: [0, 1, 3] }], { bad: "18 : 24의 비율은 [18/24] = [3/4]이에요. 24 : 30은 18 : 24에 6을 더한 비예요.", ok: "3 : 4, 6 : 8, 36 : 48이 18 : 24와 비율이 같아요." }),
        (bx, ax) => rp4Chain(bx, ax, [["[1/3] : [3/4]=4 : ", { i: "9" }], ["21 : 28=", { i: "3" }, " : 4"]], { ok: "[1/3] : [3/4]=4 : 9, 21 : 28=3 : 4예요." })]) },
    { name: "그려 보기 — 간단한 자연수의 비", inst: "간단한 자연수의 비로 나타내 보세요.", hints: ["2.4 : 3.6에 10을 곱하고 12로 나누어요.", "[1 2/5] = [7/5]이에요. 분모 5와 2의 공배수 10을 곱해요."],
      render: (b, a) => rp4Chain(b, a, [
        ["2.4 : 3.6 → ", { r: [2, 3], any: true }], ["[3/8] : [5/6] → ", { r: [9, 20], any: true }],
        ["0.25 : [3/10] → ", { r: [5, 6], any: true }], ["[1 2/5] : [1/2] → ", { r: [14, 5], any: true }]],
        { ok: "예를 들어 2 : 3, 9 : 20, 5 : 6, 14 : 5예요." }) },
    { name: "말해 보기 — 비례식의 성질", inst: "비례식의 성질을 이용하여 □ 안에 알맞은 수를 구해 보세요.", hints: ["8 : 5=40 : □에서 8 × □ = 5 × 40이에요.", "36 : □=9 : 5에서 □ × 9 = 36 × 5예요."],
      render: (b, a) => rp4Chain(b, a, [
        ["8 : 5=40 : ", { i: "25" }], ["14 : 49=", { i: "2" }, " : 7"],
        ["", { i: "10" }, " : 6=45 : 27"], ["36 : ", { i: "20" }, "=9 : 5"]],
        { ok: "25, 2, 10, 20이에요. 외항의 곱과 내항의 곱이 같아요." }) },
    { name: "약속하기 — 비례배분과 비례식 활용", inst: "수확 잔치 준비 문제예요.", hints: ["750 mL를 2 : 3으로 나누면 전체를 5만큼 등분해요.", "설계도에서 4 cm가 200 cm이면 1 cm는 50 cm예요."],
      render: (b, a) => rp4Seq(b, a, [
        { title: "방울토마토 주스 750 mL를 1모둠과 2모둠이 2 : 3으로 나누어 마시려고 해요.", run: (bx, ax) => rp4Tape(bx, ax, { N: 750, unit: "mL", snap: 30, ratio: [2, 3], names: ["1모둠", "2모둠"],
          ask: [["1모둠: 750 × ", { f: "2/5" }, " = ", { i: "300" }, " (mL)"], ["2모둠: 750 × ", { f: "3/5" }, " = ", { i: "450" }, " (mL)"]], ok: "1모둠은 300 mL, 2모둠은 450 mL를 마시면 돼요." }) },
        { title: "새 텃밭 설계도에 실제 길이가 200 cm인 화단을 4 cm로 그렸어요. 설계도에 7 cm로 그린 꽃길의 실제 길이는 몇 cm일까요?", run: (bx, ax) => rp4Dbl(bx, ax, { top: { name: "설계도의 길이", unit: "cm", tick: 1 }, bot: { name: "실제 길이", unit: "cm", tick: 50, snap: 50 }, given: [4, 200], askAt: 7, tmax: 10,
          ask: [{ t: "방법 1 비의 성질", p: ["설계도 길이의 비 4 : 7에 ", { i: "50" }, "을 곱하면 실제 길이의 비 200 : ", { i: "350" }] },
            { t: "방법 2 비례식의 성질", p: ["4 : 7=200 : □ → 4 × □ = ", { i: "1400" }, ", □ = ", { i: "350" }, " (cm)"] }],
          ok: "꽃길의 실제 길이는 350 cm예요." }) }]) },
    { name: "확인하기 — 궁금했던 것 돌아보기", inst: "단원에서 배운 내용을 정리하고, 1차시에 궁금했던 것을 해결했는지 돌아보며 발표할 내용을 써 보세요.", hints: ["비례식 2 : 7=10 : 35에서 바깥쪽은 2와 35예요.", "20을 1 : 3으로 나누면 20 × [1/4]과 20 × [3/4]이에요."],
      render: wonderRecall((b, a) => { blanks(b, a, ["비의 전항과 후항에 0이 아닌 같은 수를 곱하여도, 0이 아닌 같은 수로 ", { o: ["나누어도", "더해도"], a: 0 }, " 비율은 같습니다. 2 : 7=10 : 35에서 2와 35를 ", { o: ["외항", "내항"], a: 0 }, ", 7과 10을 ", { o: ["외항", "내항"], a: 1 }, "이라고 하고, 외항의 곱과 내항의 곱은 ", { o: ["같습니다", "다릅니다"], a: 0 }, ". 20을 1 : 3으로 비례배분하면 ", { o: ["5와 15", "10과 10", "1과 3"], a: 0 }, "예요."],
          { ok: "비의 성질, 비례식과 그 성질, 비례배분을 잘 정리했어요." });
        writeStep(b, a, [
          { q: "1차시에 궁금했던 것 하나를 골라, 이제 어떻게 해결할 수 있는지 써 보세요.", tag: "궁금증 해결", ph: "나는 ~이 궁금했어요. 이제는 ~",
            help: ["① 위의 ‘1차시에 내가 궁금했던 것’에서 하나를 골라요. → ② 이 단원에서 배운 방법(비례식, 비례배분 등)으로 어떻게 해결하는지 써요.", "‘나는 ~이 궁금했어요. 이제는 ~을 이용해서 ~라고 구할 수 있어요.’ 꼴로 써요."],
            ans: "나는 상추 12봉지를 1 : 3으로 나누면 몇 봉지씩인지 궁금했어요. 이제는 전체를 1+3=4만큼 등분하는 비례배분을 이용해서 12×[1/4]=3(봉지), 12×[3/4]=9(봉지)라고 구할 수 있어요." },
          { q: "생활에서 비례식이나 비례배분을 써 보고 싶은 곳을 써 보세요.", tag: "생활에 쓰기", ph: "예) 친구와 간식을 나눌 때 ~",
            help: ["① 집이나 학교에서 두 양을 견주거나 나누는 일을 떠올려요. → ② 그때 비례식이나 비례배분을 어떻게 쓸지 써요.", "‘~할 때 ~을 ~ : ~로 나누려고 비례배분을 쓰고 싶어요.’ 꼴로 써요."],
            ans: "친구와 함께 돈을 모아 간식을 살 때 낸 돈의 비로 간식을 비례배분하고 싶어요. 예를 들어 2 : 3으로 돈을 냈다면 간식 20개를 8개와 12개로 나눠요." }]); }) }
  ],
  challenge: { inst: "★ 도전 — 둘레가 240 cm이고 가로와 세로의 비가 5 : 7인 직사각형 모양의 꽃밭 틀을 만들려고 해요. 꽃밭 틀의 가로와 세로는 각각 몇 cm일까요?", hints: ["둘레는 가로와 세로를 두 번씩 더한 길이예요. 가로와 세로의 합은 240 ÷ 2예요.", "가로와 세로의 합 120 cm를 5 : 7로 비례배분해요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [["가로와 세로의 합: 240 ÷ 2 = ", { i: "120", why: { "240": "둘레 240 cm는 가로와 세로를 두 번씩 더한 길이예요. 둘레를 그대로 나누면 안 돼요." } }, " (cm)"]], { ok: "가로와 세로의 합은 120 cm예요. 이것을 5 : 7로 나눠요." }),
      (bx, ax) => rp4Tape(bx, ax, { N: 120, unit: "cm", snap: 5, ratio: [5, 7], names: ["가로", "세로"],
        ask: [["가로: 120 × ", { f: "5/12" }, " = ", { i: "50" }, " (cm)"], ["세로: 120 × ", { f: "7/12" }, " = ", { i: "70" }, " (cm)"]], ok: "꽃밭 틀의 가로는 50 cm, 세로는 70 cm예요. 다음 단원에서는 원의 둘레와 넓이를 배워요." })]) }
}
];
