//@@APP
const APP={title:"새 활용 체험관 비례식과 비례배분", unit:"6-2 수학 4. 비례식과 비례배분(교과서)", key:"t62-ratio-v1", welcome:"새 활용 체험관 비례식과 비례배분 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 새 활용(업사이클링) 체험관을 찾은 서영이와 함께 필통·가방·신발·크레파스·지갑을 만들며 비의 성질, 비례식과 그 성질, 비례배분을 알아봐요."};
//@@UNIT
/* =========================================================
   6-2 수학 4. 비례식과 비례배분 — 단원 조작 부품 (앞글자 rp4)
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
quiz = (b, a, items, o) => rp4Quiz0(b, rp4A(a), items, o);
blanks = (b, a, parts, o) => rp4Blanks0(b, rp4A(a), parts, o);

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
function rp4Chain(body, api, lines, opt = {}) {
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
  const judge = C => {
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
  const btn = h("button", { class: "big", onclick: () => {
    api.tryOnce(); let bad = null; const got = []; let simp = false;
    ctl.forEach(C => {
      const r = judge(C); got.push(r.v); if (r.simp) simp = true;
      const col = r.ok ? "var(--ok)" : "var(--no)";
      if (C.k === "c") { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(r.ok ? "good" : "bad"); }); }
      else if (C.el.paint) C.el.paint(col); else C.el.style.borderColor = col;
      if (!r.ok && !bad) bad = { C, r };
    });
    if (!bad) {
      const extra = simp && opt.simpNote !== false ? " 쓴 비를 공약수로 나누면 더 간단하게 나타낼 수도 있어요." : "";
      return api.done(rp4Plain(got.join(" / ")), (opt.ok || "잘했어요!") + extra);
    }
    const t = bad.C.t, key = bad.C.k === "c" ? String(bad.C.sel) : String(bad.r.v).replace(/[\s,]/g, "");
    const why = (t.why && (t.why[key] || t.why[String(bad.r.v)])) || bad.r.msg;
    api.fail(why || opt.bad || "빨간 칸을 다시 생각해 봐요.", rp4Plain(got.join(" / ")));
  } }, opt.btn || "확인하기");
  wrap.rp4ctl = ctl; wrap.rp4btn = btn;
  body.append(wrap, h("div", { class: "actions" }, btn));
  return wrap;
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
  if (lab) g.append(txt(0, s * .52, lab, Math.max(13, s * .26), { fill: "#3A2A1A" }));
  return g;
}

/* ---------- ② 재료 세트 더하기·빼기 ----------
   opt: {what:"필통", unit:"개", prod:"case", start, target, max, items:[{name, per, unit, icon, lump}], ask, ok} */
function rp4Build(body, api, opt) {
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
    tbl.append(rp4Tbl([`${opt.what} 수`, `${n}${opt.unit || "개"}`], its.map(it => [it.name, `${it.per * n}${it.unit === "g" ? " g" : it.unit}`])));
    read.textContent = `${opt.what} ${n}${opt.unit || "개"}: ${its[0].name} ${its[0].per * n}${its[0].unit === "g" ? " g" : its[0].unit}, ${its[1].name} ${its[1].per * n}${its[1].unit === "g" ? " g" : its[1].unit} → 비 ${its[0].per * n} : ${its[1].per * n}`;
  };
  const plus = h("button", { onclick: () => { if (fin || n >= max) return; n++; after(); } }, `＋ ${opt.what} 하나 더 만들기`);
  const minus = h("button", { onclick: () => { if (fin || n <= 1) return; n--; after(); } }, `－ ${opt.what} 하나 줄이기`);
  const after = () => {
    draw();
    if (n === opt.target) { fin = true; plus.disabled = minus.disabled = true; rp4Finish(body, api, opt, `${opt.what} ${n}${opt.unit || "개"}`, opt.msg || `${opt.what} ${rp4J(n + (opt.unit || "개"), "을를")} 만들 때의 재료를 살펴봤어요.`); }
    else api.hint(n < opt.target ? `${rp4J(opt.what, "이가")} ${opt.target}${opt.unit || "개"}가 되게 해 봐요.` : `${rp4J(opt.what, "을를")} ${opt.target}${opt.unit || "개"}로 줄여 봐요.`);
  };
  api.provide({ words: ["전항", "후항", "비율"], answers: [] });
  body.append(svg, h("div", { class: "rp4tools" }, plus, minus), read, tbl); draw();
}

/* ---------- ③ 전항과 후항에 같은 수를 ----------
   opt: {start:[1,2], goal:[2,4], ops:["×","÷","+"], ask, ok} */
function rp4Machine(body, api, opt) {
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
function rp4Terms(body, api, opt) {
  let mode = "o"; const boards = [];
  const mb = [h("button", { class: "rp4sel", onclick: e => setMode("o", e) }, "◯ 외항 표시"), h("button", { onclick: e => setMode("t", e) }, "△ 내항 표시"), h("button", { onclick: e => setMode("x", e) }, "지우기")];
  const setMode = (m, e) => { mode = m; mb.forEach(b => b.classList.toggle("rp4sel", b === e.currentTarget)); };
  body.append(h("div", { class: "rp4tools" }, ...mb));
  opt.props.forEach(P => {
    const svg = makeSvg(560, 200); svg.setAttribute("class", "rp4fig"); svg.style.maxWidth = "560px";
    const marks = [null, null, null, null], X = [70, 190, 370, 490];
    const draw = (arcs) => {
      svg.innerHTML = "";
      if (arcs) {
        svg.append(svgEl("path", { d: `M${X[0]},62 C${X[0]},10 ${X[3]},10 ${X[3]},62`, fill: "none", stroke: "#D9822B", "stroke-width": 3 }));
        svg.append(txt(280, 22, "외항", 18, { fill: "#B4610F" }));
        svg.append(svgEl("path", { d: `M${X[1]},138 C${X[1]},190 ${X[2]},190 ${X[2]},138`, fill: "none", stroke: "#2B7BD6", "stroke-width": 3 }));
        svg.append(txt(280, 182, "내항", 18, { fill: "#2B7BD6" }));
      }
      svg.append(txt(130, 100, ":", 40), txt(280, 100, "=", 40), txt(430, 100, ":", 40));
      P.forEach((v, i) => {
        const g = svgEl("g", { style: "cursor:pointer" });
        g.append(svgEl("rect", { x: X[i] - 48, y: 64, width: 96, height: 72, fill: "#fff", opacity: 0 }));
        if (marks[i] === "o") g.append(svgEl("circle", { cx: X[i], cy: 100, r: 40, fill: "#FFF1DD", stroke: "#D9822B", "stroke-width": 4 }));
        if (marks[i] === "t") g.append(svgEl("path", { d: `M${X[i]},52 L${X[i] + 48},132 L${X[i] - 48},132 Z`, fill: "#E3EEFB", stroke: "#2B7BD6", "stroke-width": 4 }));
        g.append(rp4SvgLine(String(v), X[i], marks[i] === "t" ? 108 : 100, 36));
        g.addEventListener("click", () => { marks[i] = mode === "x" ? null : (marks[i] === mode ? null : mode); draw(false); });
        svg.append(g);
      });
    };
    draw(false); body.append(svg);
    boards.push({ marks, draw, P });
  });
  const ans = opt.props.map(P => `외항 ${P[0]}, ${P[3]} / 내항 ${P[1]}, ${P[2]}`);
  api.provide({ words: ["외항: 바깥쪽에 있는 두 항", "내항: 안쪽에 있는 두 항"], answers: ans.map(rp4Plain) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const bad = boards.find(B => !(B.marks[0] === "o" && B.marks[3] === "o" && B.marks[1] === "t" && B.marks[2] === "t"));
    if (bad) {
      const m = bad.marks; let why = "바깥쪽에 있는 두 수에 ◯, 안쪽에 있는 두 수에 △ 해요.";
      if (m[0] === "o" && m[1] === "o") why = "전항과 후항이 아니라, 비례식 전체에서 바깥쪽(맨 앞과 맨 뒤)에 있는 두 수가 외항이에요.";
      else if (m.some(x => !x)) why = "네 수 모두에 ◯ 또는 △를 해요.";
      return api.fail(why, boards.map(B => B.marks.map(x => x === "o" ? "◯" : x === "t" ? "△" : "-").join("")).join(" / "));
    }
    boards.forEach(B => B.draw(true));
    rp4Finish(body, api, opt, ans.join(" | "), "바깥쪽 두 수는 외항, 안쪽 두 수는 내항이에요.");
  } }, "확인하기")));
}

/* ---------- ⑥ 외항의 곱 = 내항의 곱 (넓이) ----------
   opt: {p:[3,5,null,15], max, ask, ok}  — 직사각형 ㉮ 가로 p0·세로 p3, ㉯ 가로 p1·세로 p2 */
function rp4Area(body, api, opt) {
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
function rp4Dbl(body, api, opt) {
  const [gt, gb] = opt.given, at = opt.askAt, ab = at * gb / gt, tmax = opt.tmax, bmax = tmax * gb / gt;
  const L = 560, x0 = 50, yT = 86, yB = 200, snap = opt.bot.snap || opt.bot.tick;
  let v = 0, fin = false;
  const X = (val, mx) => x0 + val / mx * L;
  const svg = makeSvg(660, 262); svg.setAttribute("class", "rp4fig");
  const read = h("div", { class: "rp4read" }, "​");
  const fmt = x => (Math.round(x * 1000) / 1000).toString();
  const draw = () => {
    svg.innerHTML = "";
    [[yT, opt.top, tmax], [yB, opt.bot, bmax]].forEach(([y, ax, mx]) => {
      svg.append(svgEl("line", { x1: x0, y1: y, x2: x0 + L + 12, y2: y, stroke: INK, "stroke-width": 3 }));
      svg.append(txt(x0 - 10, y === yT ? y - 48 : y - 24, `${ax.name}(${ax.unit})`, 15, { "text-anchor": "start", fill: "#4A5A55" }));
      for (let t = 0; t <= mx + 1e-9; t += ax.tick) { svg.append(svgEl("line", { x1: X(t, mx), y1: y - 7, x2: X(t, mx), y2: y + 7, stroke: INK, "stroke-width": 2 })); if (ax.lab !== false) svg.append(txt(X(t, mx), y + (y === yT ? -18 : 22), fmt(t), 14, { fill: "#4A5A55" })); }
    });
    svg.append(svgEl("line", { x1: X(gt, tmax), y1: yT, x2: X(gb, bmax), y2: yB, stroke: "#2E8B57", "stroke-width": 3, "stroke-dasharray": "6 5" }));
    svg.append(svgEl("circle", { cx: X(gt, tmax), cy: yT, r: 8, fill: "#2E8B57" }), svgEl("circle", { cx: X(gb, bmax), cy: yB, r: 8, fill: "#2E8B57" }));
    svg.append(svgEl("circle", { cx: X(at, tmax), cy: yT, r: 9, fill: "#D9822B" }));
    svg.append(txt(X(at, tmax), yT + 26, `${fmt(at)}`, 16, { fill: "#B4610F" }));
    svg.append(svgEl("line", { x1: X(at, tmax), y1: yT, x2: X(v, bmax), y2: yB, stroke: "#D9822B", "stroke-width": 2, "stroke-dasharray": "3 5" }));
    const mx = X(v, bmax);
    svg.append(svgEl("path", { d: `M${mx},${yB - 4} l-13,26 h26 Z`, fill: fin ? "#2E8B57" : "#C8472E", style: "cursor:grab" }));
    svg.append(txt(mx, yB + 42, `${fmt(v)}`, 16, { fill: fin ? "#2E8B57" : "#C8472E" }));
    read.textContent = `${opt.top.name} ${fmt(at)}${opt.top.unit === "개" ? "개" : " " + opt.top.unit}에 짝이 되는 ${opt.bot.name}: ${v ? fmt(v) + (opt.bot.unit === "개" ? "개" : " " + opt.bot.unit) : "?"}`;
  };
  dragOn(svg, pt => !fin && Math.abs(pt.y - (yB + 10)) < 55, pt => { v = Math.max(0, Math.min(bmax, Math.round(((pt.x - x0) / L * bmax) / snap) * snap)); v = Math.round(v * 1000) / 1000; draw(); });
  api.provide({ words: ["두 양의 비", "비율이 같아요", "비례식"], answers: [] });
  body.append(h("p", { class: "rp4note" }, `초록 점선은 알고 있는 짝(위 ${fmt(gt)}, 아래 ${fmt(gb)})이에요. 아래 줄의 빨간 세모를 끌어 ${fmt(at)}의 짝을 찾아요.`), svg, read,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (fin) return; api.tryOnce();
      if (Math.abs(v - ab) < 1e-6) { fin = true; draw(); rp4Finish(body, api, opt, `${fmt(at)} ↔ ${fmt(v)}`, `${fmt(at)}의 짝은 ${rp4J(fmt(ab), "이에요")}.`); }
      else api.fail(`위의 ${rp4J(fmt(gt), "이가")} ${rp4J(fmt(at), "이가")} 되려면 몇 배를 해야 하는지 생각하고, 아래 수도 같은 배만큼 바꾸어 봐요.`, fmt(v));
    } }, "여기로 정했어요")));
  draw();
}

/* ---------- ⑧ 톱니바퀴 ----------
   opt: {r:2, b:5, target:16, ask, ok} — 빨간 톱니 20개, 파란 톱니 8개 */
function rp4Gear(body, api, opt) {
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
function rp4Tape(body, api, opt) {
  const N = opt.N, [P, Q] = opt.ratio, snap = opt.snap || 1, L = 580, x0 = 40, y0 = 70, TH = 70;
  let v = Math.round(N / 2 / snap) * snap, fin = false;
  const svg = makeSvg(660, 210); svg.setAttribute("class", "rp4fig");
  const read = h("div", { class: "rp4read" }, "​");
  const u = opt.unit === "개" || opt.unit === "장" || opt.unit === "자루" ? opt.unit : " " + opt.unit;
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
  dragOn(svg, () => !fin, pt => { v = Math.max(0, Math.min(N, Math.round(((pt.x - x0) / L * N) / snap) * snap)); draw(); });
  api.provide({ words: ["전체를 (비의 합)만큼 등분", "비례배분"], answers: [] });
  body.append(h("p", { class: "rp4note" }, "빨간 막대를 끌어 띠를 두 부분으로 나눠요."), svg, read,
    h("div", { class: "rp4tools" }, h("button", { onclick: () => { if (fin) return; v = Math.max(0, v - snap); draw(); } }, `◀ ${snap}${u} 옮기기`), h("button", { onclick: () => { if (fin) return; v = Math.min(N, v + snap); draw(); } }, `${snap}${u} 옮기기 ▶`)),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (fin) return; api.tryOnce();
      if (v * Q === (N - v) * P && v > 0) { fin = true; draw(); rp4Finish(body, api, opt, `${v} : ${N - v}`, `${rp4J(N + u, "을를")} ${rp4J(P + " : " + Q, "으로")} 나누면 ${rp4J(v + u, "과와")} ${rp4J(N - v + u, "이에요")}. 전체를 ${P}+${Q}=${P + Q}등분했어요.`); }
      else api.fail(`지금은 ${rp4J(v + " : " + (N - v), "이에요")}. 전체를 ${P}+${Q}=${P + Q}등분한 것 중 ${P}만큼이 ${opt.names[0]} 몫이에요.`, `${v} : ${N - v}`);
    } }, "이렇게 나눌래요")));
  draw();
}

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
      { bad: `전체를 (${p}+${q})만큼 등분해요. ${rp4J(opt.names[0], "은는")} 전체의 [${p}/${s}], ${rp4J(opt.names[1], "은는")} 전체의 [${q}/${s}]예요.` });
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
    rp4Chain(host, sub, [[`${a} : ${b} = ${opt.base} : `, { i: String(opt.base * b / a) }], ["외항의 곱 ", { i: String(opt.base * b) }, " = 내항의 곱"]], { bad: `비례식의 성질을 써요. ${a} × □ = ${b} × ${opt.base}예요.` });
  };
  api.provide({ words: ["외항의 곱 = 내항의 곱"], answers: [] });
  body.append(h("div", { class: "rp4tools" }, h("button", { onclick: roll }, "주사위 두 번 던지기")), face, host);
}

/* ---------- ⑫ 비율이 같은 직사각형 ---------- */
function rp4Rect(body, api, opt) {
  const C = 26, GX = 14, GY = 10, ox = 20, oy = 20 + GY * C;
  let w = 1, hh = 1, fin = false;
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
  dragOn(svg, () => !fin, pt => { w = Math.max(1, Math.min(GX, Math.round((pt.x - ox) / C))); hh = Math.max(1, Math.min(GY, Math.round((oy - pt.y) / C))); draw(); });
  api.provide({ words: ["가로 : 세로", "비율이 같아요"], answers: [] });
  body.append(h("p", { class: "rp4note" }, `파란 점선은 가로 ${opt.base[0]}칸, 세로 ${opt.base[1]}칸인 액자예요. 빨간 점을 끌어 가로와 세로의 비가 ${rp4J(opt.base[0] + " : " + opt.base[1], "과와")} 비율이 같은 더 큰 액자를 만들어요.`), svg, read,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (fin) return; api.tryOnce();
      if (w * opt.base[1] === hh * opt.base[0] && w !== opt.base[0]) { fin = true; draw(); rp4Finish(body, api, opt, `${w} : ${hh}`, `${rp4J(w + " : " + hh, "은는")} ${opt.base[0]} : ${opt.base[1]}의 전항과 후항에 ${rp4J(String(w / opt.base[0]), "을를")} 곱한 비예요. 크기는 달라도 모양이 같아요.`); }
      else if (w === opt.base[0] && hh === opt.base[1]) api.fail("파란 점선과 같은 크기예요. 더 큰 액자를 만들어요.", `${w} : ${hh}`);
      else api.fail(`${w} : ${hh}의 비율은 ${rp4Fr(rp4Q(w, hh))}, ${opt.base[0]} : ${opt.base[1]}의 비율은 ${rp4J(rp4Fr(rp4Q(opt.base[0], opt.base[1])), "이에요")}. 가로와 세로에 같은 수를 곱해 봐요.`, `${w} : ${hh}`);
    } }, "확인하기")));
  draw();
}

/* ---------- ⑬ 새 활용 체험관 둘러보기 ---------- */
function rp4Scene(body, api, opt) {
  const svg = makeSvg(720, 272); svg.setAttribute("class", "rp4fig");
  const spots = [
    { x: 20, t: "현수막 가방 꾸미기", ok: true, say: "가방을 꾸밀 때 사용한 빨간색 물감과 파란색 물감의 양을 비교해요.", draw: g => { g.append(svgEl("rect", { x: 28, y: 120, width: 64, height: 70, rx: 8, fill: "#F0E6D2", stroke: "#8A7552", "stroke-width": 2 })); g.append(svgEl("rect", { x: 97, y: 150, width: 24, height: 40, rx: 4, fill: "#E2574C" }), svgEl("rect", { x: 97, y: 175, width: 24, height: 15, fill: "#962A21" })); g.append(svgEl("rect", { x: 125, y: 165, width: 20, height: 25, rx: 4, fill: "#2B7BD6" })); } },
    { x: 160, t: "친환경 신발 부스", ok: true, say: "신발을 만들 때 필요한 페트병 수와 나무껍질의 양을 비교해요.", draw: g => { g.append(rp4Icon("shoe", 215, 140, 70)); g.append(rp4Icon("bottle", 190, 190, 34), rp4Icon("bottle", 215, 190, 34), rp4Icon("bark", 255, 190, 40)); } },
    { x: 300, t: "병뚜껑 모으기", ok: true, say: "모은 병뚜껑 수와 필요한 상자 수를 비교해요.", draw: g => { g.append(svgEl("rect", { x: 320, y: 140, width: 100, height: 60, fill: "#D9B98A", stroke: "#8A6A3A", "stroke-width": 2 })); [0, 1, 2, 3, 4, 5].forEach(i => g.append(svgEl("circle", { cx: 332 + i * 15, cy: 130 - (i % 2) * 8, r: 7, fill: ["#E2574C", "#2B7BD6", "#2E8B57", "#F2B04A", "#7D5BD6", "#E2574C"][i] }))); } },
    { x: 440, t: "헌 크레파스 녹이기", ok: true, say: "새 크레파스 수와 필요한 헌 크레파스의 양을 비교해요.", draw: g => { g.append(rp4Icon("old", 480, 150, 60), rp4Icon("newcr", 530, 185, 60)); } },
    { x: 580, t: "우유갑 지갑 기부", ok: true, say: "만든 지갑을 두 센터에 나누어 기부해요. 주어진 양을 나누는 상황이에요.", draw: g => { g.append(rp4Icon("wallet", 620, 140, 50), rp4Icon("wallet", 670, 140, 50), rp4Icon("wallet", 645, 185, 50)); } }];
  const found = new Set(); const say = h("div", { class: "rp4read" }, "체험 부스를 눌러 두 양을 비교하거나 나누는 상황을 찾아봐요.");
  svg.append(svgEl("rect", { x: 0, y: 228, width: 720, height: 44, fill: "#EFE7DA" }));
  svg.append(txt(360, 26, "새 활용 체험관", 24, { fill: "#2F6B57" }));
  spots.forEach((s, i) => {
    const g = svgEl("g", { style: "cursor:pointer" });
    g.append(svgEl("rect", { x: s.x, y: 50, width: 132, height: 175, rx: 12, fill: "#FFFDF6", stroke: "#C9B79C", "stroke-width": 2 }));
    s.draw(g); g.append(txt(s.x + 66, 250, s.t, 15));
    const mk = svgEl("circle", { cx: s.x + 120, cy: 62, r: 11, fill: "#2E8B57", opacity: 0 }); g.append(mk);
    g.addEventListener("click", () => { found.add(i); mk.setAttribute("opacity", 1); say.textContent = `${s.t}: ${s.say}`;
      if (found.size === spots.length) api.done("체험관 5곳", opt.ok); else api.hint(`○ ${found.size}곳을 살펴봤어요. 남은 부스도 눌러 봐요.`); });
    svg.append(g);
  });
  api.provide({ words: ["두 양을 비교하기", "주어진 양을 나누기"], answers: [] });
  body.append(svg, say);
}

/* ---------- ⑭ 10차시 놀이: 비 카드 (이 앱이 정한 카드) ----------
   교과서 '준비물 5' 비 카드 목록이 지도서 글에 없어, 비율이 같은 카드가 꼭 한 장씩 있도록 이 앱이 14장을 정했어요. */
const RP4_CARDS = ["2 : 3", "4 : 6", "3.4 : 4.9", "34 : 49", "[1/2] : [1/3]", "3 : 2", "5 : 8", "15 : 24", "0.7 : 0.2", "7 : 2", "[2/5] : [3/10]", "4 : 3", "9 : 12", "3 : 4"];
const RP4_CR = RP4_CARDS.map(rp4R);
RP4_CR.forEach((c, i) => { const n = RP4_CR.filter((d, j) => j !== i && rp4Same(c, d)).length; if (n !== 1) throw new Error("비 카드 짝 오류: " + c.t); });
const rp4Partner = i => RP4_CR.findIndex((d, j) => j !== i && rp4Same(RP4_CR[i], d));
let RP4_HAND = null, RP4_GOT = [];
/* 카드 고르기: 비율이 다른 카드 4장 */
function rp4Hand(body, api) {
  const order = [6, 1, 12, 4, 9, 2, 13, 0, 10, 7, 3, 5, 11, 8];
  const pk = new Set(); const row = h("div", { class: "rp4cards" });
  const btns = order.map(i => h("button", { class: "rp4card", onclick: e => { pk.has(i) ? pk.delete(i) : (pk.size < 4 && pk.add(i)); e.currentTarget.classList.toggle("rp4pk", pk.has(i)); info.textContent = `고른 카드 ${pk.size}장`; } }, RP4_CARDS[i]));
  btns.forEach(b => row.append(b));
  const info = h("div", { class: "rp4read" }, "고른 카드 0장");
  api.provide({ words: ["비율", "비율이 다른 카드"], answers: [] });
  body.append(row, info, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const L = [...pk];
    if (L.length !== 4) return api.fail("카드를 4장 골라요.", `${L.length}장`);
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) if (rp4Same(RP4_CR[L[a]], RP4_CR[L[b]])) return api.fail(`${rp4J(RP4_CARDS[L[a]], "과와")} ${rp4J(RP4_CARDS[L[b]], "은는")} 비율이 ${rp4J(rp4Fr(RP4_CR[L[a]].v), "으로")} 같아요. 비율이 다른 카드 4장을 골라요.`, L.map(i => RP4_CARDS[i]).join(", "));
    RP4_HAND = L.slice(); RP4_GOT = [];
    api.done(L.map(i => RP4_CARDS[i]).join(", "), `고른 카드의 비율: ${L.map(i => rp4Fr(RP4_CR[i].v)).join(", ")} — 모두 달라요. 이 카드로 놀이를 해요.`);
  } }, "이 카드로 할래요")));
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

/* 모은 카드(짝)로 비례식 세우기 판 — 모은 짝이 3쌍보다 적으면 정해 둔 짝을 보태요 */
function rp4GotCards() {
  const used = new Set(), out = [];
  RP4_GOT.forEach(([x, y]) => { if (out.length >= 8 || used.has(x) || used.has(y)) return; used.add(x); used.add(y); out.push(x, y); });
  [[0, 1], [4, 5], [12, 13], [10, 11], [2, 3], [6, 7], [8, 9]].forEach(([x, y]) => { if (out.length >= 8 || used.has(x) || used.has(y)) return; used.add(x); used.add(y); out.push(x, y); });
  return out.sort((x, y) => (x * 5) % 14 - (y * 5) % 14).map(i => RP4_CARDS[i]);
}
/* 그림 */
function rp4Dabo() {
  const s = makeSvg(560, 260); s.setAttribute("class", "rp4fig"); s.style.maxWidth = "560px";
  const x = 200, g = svgEl("g", { fill: "#D9D2C3", stroke: "#6F6656", "stroke-width": 2 });
  g.append(svgEl("rect", { x: x - 70, y: 210, width: 140, height: 24 }), svgEl("rect", { x: x - 50, y: 160, width: 100, height: 50 }), svgEl("rect", { x: x - 62, y: 150, width: 124, height: 10 }),
    svgEl("rect", { x: x - 36, y: 110, width: 72, height: 40 }), svgEl("polygon", { points: `${x - 48},110 ${x + 48},110 ${x},90` }), svgEl("rect", { x: x - 22, y: 64, width: 44, height: 26 }), svgEl("rect", { x: x - 30, y: 58, width: 60, height: 8 }), svgEl("rect", { x: x - 5, y: 26, width: 10, height: 32 }));
  s.append(g);
  s.append(svgEl("line", { x1: x + 95, y1: 26, x2: x + 95, y2: 234, stroke: "#C8472E", "stroke-width": 3 }), svgEl("line", { x1: x + 85, y1: 26, x2: x + 105, y2: 26, stroke: "#C8472E", "stroke-width": 3 }), svgEl("line", { x1: x + 85, y1: 234, x2: x + 105, y2: 234, stroke: "#C8472E", "stroke-width": 3 }));
  s.append(txt(x + 140, 130, "105 cm", 20, { fill: "#C8472E" }));
  s.append(txt(450, 80, "다보탑 모형", 20), txt(450, 120, "(모형의 높이) :", 17), txt(450, 145, "(실제 다보탑의 높이)", 17), txt(450, 180, "= 1 : 9.8", 22, { fill: "#2F6B57" }));
  return s;
}
function rp4Recipe(title, lines) { return h("div", { class: "rp4recipe" }, h("b", {}, title), h("ol", {}, lines.map(l => h("li", {}, l)))); }
function rp4Frames() {
  const s = makeSvg(520, 230); s.setAttribute("class", "rp4fig"); s.style.maxWidth = "520px";
  const f = (x, w, hh, nm, lw, lh) => { s.append(svgEl("rect", { x, y: 200 - hh, width: w, height: hh, fill: "#FFF6E3", stroke: "#8A6A3A", "stroke-width": 6 }), txt(x + w / 2, 200 - hh - 16, nm, 20), txt(x + w / 2, 218, lw, 15), txt(x + w + 26, 200 - hh / 2, lh, 15)); };
  f(40, 15 * 7, 18 * 7, "가", "15 cm", "18 cm"); f(270, 16 * 7, 24 * 7, "나", "16 cm", "24 cm");
  return s;
}
//@@LESSONS
const UNIT_STORY = { title: "새 활용 체험관에 간 서영이", lines: [
  "서영이는 새 활용(업사이클링) 체험관에 방문했어요. 현수막 가방을 물감으로 꾸미고, 페트병과 나무껍질로 만든 신발을 구경하고, 헌 크레파스를 녹여 새 크레파스를 만들고, 병뚜껑을 모아 기부하고, 우유갑으로 지갑을 만들어 나누어 기부해요.",
  "필통의 단추와 가죽, 물감의 양, 신발의 재료, 크레파스의 무게, 병뚜껑과 상자, 지갑 나누기에서 비의 성질과 비례식, 비례배분을 알아봐요.",
  "교과서 「수학 6-2」 4. 비례식과 비례배분의 차시 순서 그대로 만들었어요."],
  one: "비례식과 비례배분 · 비율이 같은 두 비를 기호 =로 나타낸 식이 비례식이고, 외항의 곱과 내항의 곱은 같아요. 전체를 주어진 비로 나누는 것이 비례배분이에요." };
const UNIT_KEYWORDS = ["전항", "후항", "비율", "비의 성질", "0이 아닌 같은 수", "간단한 자연수의 비", "공배수", "공약수", "비례식", "외항", "내항", "외항의 곱 = 내항의 곱", "비례배분", "전체를 (비의 합)만큼 등분"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 새 활용 체험관에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 비례식과 비례배분을 이용할 수 있는 상황에는 무엇이 있을까요?",
  summary: "두 양을 비교할 때 비를 써요. 비 3 : 5에서 기호 : 의 오른쪽에 있는 5가 기준량, 왼쪽에 있는 3이 비교하는 양이고, 비율은 [3/5] = 0.6 = 60 %예요. 이 단원에서는 비의 성질, 간단한 자연수의 비, 비례식과 비례식의 성질, 비례배분을 배워요.",
  steps: [
    { name: "살펴보기", inst: "국립중앙박물관에 다보탑 모형이 있어요. 모형의 높이는 105 cm이고, 모형의 높이와 실제 다보탑의 높이의 비는 1 : 9.8이에요. 그림을 보고 물음에 답해 보세요.", hints: ["1 : 9.8은 ‘1 대 9.8’이라고 읽어요. 기호 : 의 오른쪽이 기준량이에요.", "1 : 9.8은 모형의 높이가 1일 때 실제 높이가 9.8이라는 뜻이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "그림은 어떤 상황을 나타내고 있나요?", fig: rp4Dabo, o: ["모형의 높이와 비를 보고 실제 다보탑의 높이를 궁금해하는 상황", "다보탑 모형의 무게를 재는 상황", "다보탑을 만든 해를 세는 상황"], a: 0 },
        { q: "모형의 높이와 실제 다보탑의 높이의 비 1 : 9.8에서 기준량은 무엇을 나타낼까요?", o: ["실제 다보탑의 높이", "모형의 높이"], a: 0, why: { "1": "기호 : 의 오른쪽에 있는 9.8이 기준량이에요. 9.8은 실제 다보탑의 높이를 나타내요." } },
        { q: "실제 다보탑의 높이는 모형의 높이와 비교하면 어떨까요?", o: ["모형 높이의 9.8배예요", "모형보다 9.8 cm 더 높아요", "모형보다 낮아요"], a: 0, why: { "1": "1 : 9.8은 모형이 1일 때 실제가 9.8이라는 뜻이에요. 더하는 것이 아니라 9.8배예요.", "2": "9.8은 1보다 커요. 실제 다보탑이 모형보다 높아요." } }],
        { ok: "실제 다보탑의 높이는 모형 높이(105 cm)의 9.8배예요. 이 단원에서 이런 문제를 해결하는 방법을 배워요." }) },
    { name: "배울 내용 살펴보기", inst: "책장을 넘겨 이 단원에서 어떤 내용을 공부할지 알아봐요. 배울 차례대로 스티커를 붙이듯 눌러 보세요.", hints: ["비의 성질을 먼저 배우고, 그것을 이용해 간단한 자연수의 비로 나타내요.", "비례식을 배운 다음 비례식의 성질과 활용을 배우고, 마지막에 비례배분을 배워요."],
      render: (b, a) => sequence(b, a, ["㉠ 비례배분을 해 볼까요", "㉡ 비의 성질을 알아볼까요", "㉢ 비례식을 알아볼까요", "㉣ 간단한 자연수의 비로 나타내어 볼까요", "㉤ 비례식을 활용해 볼까요", "㉥ 비례식의 성질을 알아볼까요"], [1, 3, 2, 5, 4, 0],
        { ok: "비의 성질 → 간단한 자연수의 비 → 비례식 → 비례식의 성질 → 비례식 활용 → 비례배분 차례로 배워요." }) },
    { name: "배운 내용 떠올리기", inst: "6학년 1학기에 배운 비와 비율을 떠올려요. 서영이가 빨간색 물감 3컵과 파란색 물감 5컵을 섞었어요. 빨간색 물감 양과 파란색 물감 양을 비교해 보세요.", hints: ["(비교하는 양) : (기준량)으로 써요. 빨간색 물감 양을 파란색 물감 양과 비교해요.", "비율은 (비교하는 양) ÷ (기준량)이에요. 백분율은 비율에 100을 곱해 %를 붙여요."],
      render: (b, a) => rp4Chain(b, a, [
        ["빨간색 물감 양과 파란색 물감 양의 비: ", { r: [3, 5], why: { "5:3": "빨간색 물감 양을 앞에, 파란색 물감 양을 뒤에 써요." } }],
        ["3 : 5는 ‘3 ", { c: ["대", "더하기", "나누기"], a: 0 }, " 5’라고 읽어요."],
        ["3 : 5에서 기준량은 ", { i: "5", why: { "3": "기호 : 의 오른쪽에 있는 수가 기준량이에요." } }, ", 비교하는 양은 ", { i: "3" }, "이에요."],
        ["비율을 분수로 ", { f: "3/5" }, ", 소수로 ", { i: "0.6" }, ", 백분율로 ", { i: "60" }, " %"]],
        { ok: "3 : 5의 비율은 [3/5] = 0.6이고, 백분율로 60 %예요." }) },
    { name: "체험관 둘러보기", inst: "“서영이가 새 활용 체험관에 방문했어요. 두 가지 색의 물감을 섞어 현수막으로 만든 가방을 꾸미는 체험을 하고, 페트병과 나무껍질로 만든 신발을 보러 갔어요. 헌 크레파스를 모아 녹여 새 크레파스도 만들었어요.” 체험 부스를 모두 눌러 두 양을 비교하거나 주어진 양을 나누는 상황을 찾아보세요.", hints: ["부스 그림을 눌러요. 다섯 곳 모두 눌러 봐요.", "가방 꾸미기에서는 두 물감의 양을, 신발 부스에서는 페트병 수와 나무껍질양을 비교해요."],
      render: (b, a) => rp4Scene(b, a, { ok: "두 물감의 양, 페트병 수와 나무껍질양, 병뚜껑 수와 상자 수, 새 크레파스 수와 헌 크레파스양을 비교하고, 지갑은 두 센터에 나누어요." }) },
    { name: "확인하기", inst: "생활에서 비율이 같은 두 비를 찾아보거나 주어진 양을 나누어 본 경험을 떠올려 답해 보세요.", hints: ["가로와 세로가 모두 2배가 되면 모양은 그대로예요.", "설탕이 2배가 되면 물도 2배가 되어야 맛이 같아요."],
      render: (b, a) => quiz(b, a, [
        { q: "컴퓨터 화면 사진을 크게 출력했더니 가로와 세로가 모두 2배가 되었어요. 출력한 사진의 세로에 대한 가로의 비율은 처음과 비교하면 어떨까요?", o: ["같아요", "2배가 돼요", "작아져요"], a: 0, why: { "1": "가로도 2배, 세로도 2배가 되었어요. (가로)÷(세로)는 그대로예요.", "2": "가로와 세로가 똑같이 2배가 되었으니 비율은 그대로예요." } },
        { q: "요리할 때 설탕과 물을 1 : 4로 섞어요. 설탕을 2컵 넣으면 물은 몇 컵 넣어야 맛이 같을까요?", o: ["8컵", "5컵", "4컵"], a: 0, why: { "1": "설탕이 1컵 늘었다고 물도 1컵만 늘리면 맛이 달라져요. 설탕이 2배가 되었으니 물도 2배예요.", "2": "설탕이 2배가 되었으니 물도 4컵의 2배를 넣어요." } }],
        { ok: "가로와 세로가 같은 배만큼 커지면 비율은 같아요. 설탕 2컵에는 물 8컵을 넣어요." }) }
  ],
  challenge: { inst: "다보탑 모형의 높이는 105 cm이고, 모형의 높이와 실제 다보탑의 높이의 비는 1 : 9.8이에요. 실제 다보탑의 높이는 몇 cm일까요?", hints: ["실제 높이는 모형 높이의 9.8배예요.", "105 × 9.8 = 105 × 98 ÷ 10이에요."],
    render: (b, a) => rp4Chain(b, a, [
      ["실제 다보탑의 높이는 모형의 높이의 ", { i: "9.8" }, "배예요."],
      ["실제 다보탑의 높이: 105 × 9.8 = ", { i: "1029", why: { "114.8": "105와 9.8을 더하지 않고 곱해요.", "10290": "소수점의 위치를 다시 확인해요. 105 × 98 = 10290이니 105 × 9.8은 그 [1/10]이에요." } }, " (cm)"]],
      { ok: "실제 다보탑의 높이는 1029 cm예요. 이 단원에서 비례식을 배우면 이런 문제를 더 쉽게 풀 수 있어요." }) }
},
{
  id: "t2", no: 2, title: "비의 성질을 알아볼까요", soop: "개념 구축하기(O)",
  question: "비의 전항과 후항에 같은 수를 곱하거나 같은 수로 나누면 비율은 어떻게 될까요?",
  summary: "비 1 : 2에서 기호 : 앞에 있는 1을 전항, 뒤에 있는 2를 후항이라고 해요. 비의 전항과 후항에 0이 아닌 같은 수를 곱하여도 비율은 같고, 비의 전항과 후항을 0이 아닌 같은 수로 나누어도 비율은 같아요. 같은 수를 더하면 비율이 달라져요.",
  steps: [
    { inst: "서영이는 필통을 만들어 볼 수 있는 공간으로 갔어요. 단추 1개와 자투리 가죽 2장을 이용하여 필통을 한 개 만들 수 있어요. 필통을 두 개 만들어 보고, 필통 수에 따른 단추 수와 자투리 가죽 수의 비를 구하고 그 비율을 비교해 보세요.", hints: ["‘필통 하나 더 만들기’를 눌러 필통 두 개에 필요한 재료를 세어요.", "비율은 (단추 수) ÷ (자투리 가죽 수)예요. [2/4]를 약분하면 얼마일까요?"],
      render: (b, a) => rp4Build(b, a, { what: "필통", unit: "개", prod: "case", start: 1, target: 2, max: 4,
        items: [{ name: "단추", per: 1, unit: "개", icon: "btn" }, { name: "자투리 가죽", per: 2, unit: "장", icon: "leather" }],
        ask: [{ t: "필통 한 개", p: ["단추 수와 자투리 가죽 수의 비 ", { r: [1, 2] }, ", 비율 ", { f: "1/2" }] },
          { t: "필통 두 개", p: ["단추 수와 자투리 가죽 수의 비 ", { r: [2, 4], why: { "1:2": "필통 두 개에는 단추 2개, 가죽 4장이 들어요." } }, ", 비율 ", { f: "2/4" }] },
          ["두 비율은 ", { c: ["같아요", "달라요"], a: 0 }, "."]],
        ok: "1 : 2의 비율은 [1/2], 2 : 4의 비율은 [2/4](=[1/2])로 같아요." }) },
    { inst: "비 1 : 2에서 기호 : 앞에 있는 1을 전항, 뒤에 있는 2를 후항이라고 해요. 1 : 2의 전항과 후항에 같은 수를 곱하여 2 : 4를 만들어 보세요. ‘같은 수 더하기’나 0을 곱하는 것도 해 보고 모양과 비율을 비교해 보세요.", hints: ["‘× 같은 수 곱하기’를 고르고 같은 수를 2로 정해요.", "직사각형의 가로 : 세로가 비를 나타내요. 모양이 같으면 비율도 같아요."],
      render: (b, a) => rp4Machine(b, a, { start: [1, 2], goal: [2, 4], ops: ["×", "+", "÷"],
        ask: [["1 : 2에서 1은 ", { c: ["전항", "후항"], a: 0 }, ", 2는 ", { c: ["전항", "후항"], a: 1 }, "이에요."],
          ["1 : 2의 전항과 후항에 ", { i: "2" }, "를 곱하면 2 : 4가 되고, 비율은 같아요."],
          ["전항과 후항에 0을 곱하면 0 : 0이 되어 비율을 ", { c: ["비교할 수 없어요", "비교할 수 있어요"], a: 0 }, "."]],
        ok: "전항과 후항에 0이 아닌 같은 수를 곱하면 비율이 같아요. 같은 수를 더하면 비율이 달라져요." }) },
    { inst: "“달걀 6개와 식빵 4장으로 샌드위치를 두 개 만들 수 있고, 달걀 3개와 식빵 2장으로 샌드위치를 한 개 만들 수 있습니다.” 샌드위치를 한 개로 줄여 보고, 샌드위치 수에 따른 달걀 수와 식빵 수의 비와 비율을 비교해 보세요.", hints: ["‘샌드위치 하나 줄이기’를 눌러요.", "[6/4]를 약분하면 [3/2]예요."],
      render: (b, a) => rp4Build(b, a, { what: "샌드위치", unit: "개", prod: "sandwich", start: 2, target: 1, max: 2,
        items: [{ name: "달걀", per: 3, unit: "개", icon: "egg" }, { name: "식빵", per: 2, unit: "장", icon: "bread" }],
        ask: [{ t: "샌드위치 두 개", p: ["달걀 수와 식빵 수의 비 ", { r: [6, 4] }, ", 비율 ", { f: "6/4" }] },
          { t: "샌드위치 한 개", p: ["달걀 수와 식빵 수의 비 ", { r: [3, 2] }, ", 비율 ", { f: "3/2" }] },
          ["6 : 4의 전항과 후항을 ", { i: "2" }, "로 나누면 3 : 2가 되고, 두 비율은 ", { c: ["같아요", "달라요"], a: 0 }, ". 0으로는 ", { c: ["나눌 수 없어요", "나눌 수 있어요"], a: 0 }, "."]],
        ok: "6 : 4와 3 : 2의 비율은 [3/2]로 같아요. 전항과 후항을 0이 아닌 같은 수로 나누어도 비율은 같아요." }) },
    { inst: "알게 된 점을 약속으로 정리해요.", hints: ["0을 곱하면 0 : 0이 되고, 0으로는 나눌 수 없어요.", "같은 수를 더하면 비율이 달라졌지요?"],
      render: (b, a) => blanks(b, a, ["비 1 : 2에서 기호 : 앞에 있는 1을 ", { o: ["전항", "후항"], a: 0 }, ", 뒤에 있는 2를 ", { o: ["전항", "후항"], a: 1 }, "이라고 해요. 비의 전항과 후항에 ", { o: ["0이 아닌 같은 수", "0", "서로 다른 수"], a: 0 }, "를 곱하여도 비율은 같습니다. 비의 전항과 후항을 0이 아닌 같은 수로 ", { o: ["나누어도", "더해도"], a: 0 }, " 비율은 같습니다."],
        { ok: "비의 전항과 후항에 0이 아닌 같은 수를 곱하여도, 0이 아닌 같은 수로 나누어도 비율은 같습니다." }) },
    { inst: "비율이 같은 비를 만들려고 해요. 비의 성질을 이용하여 빈칸에 알맞은 수를 써 보세요.", hints: ["3 : 5의 전항과 후항에 3을 곱해요.", "35는 5의 7배예요. 후항 11에도 7을 곱해요."],
      render: (b, a) => rp4Chain(b, a, [
        ["3 : 5 → 3 × 3 : 5 × 3 → ", { r: [9, 15] }],
        ["48 : 36 → 48 ÷ 4 : 36 ÷ 4 → ", { r: [12, 9] }],
        ["5 : 11 = 35 : ", { i: "77", why: { "41": "전항에 30을 더했다고 후항에도 30을 더하면 비율이 달라져요. 5에 7을 곱해 35가 되었어요." } }],
        ["7 : 42 = ", { i: "1", why: { "49": "후항 42를 7로 나누어 6이 되었어요. 전항 7도 7로 나누어요." } }, " : 6"]],
        { ok: "3 : 5 = 9 : 15, 48 : 36 = 12 : 9, 5 : 11 = 35 : 77, 7 : 42 = 1 : 6이에요." }) }
  ],
  challenge: { inst: "수학익힘 문제와 액자 만들기예요.", hints: ["비의 성질을 설명할 때 ‘0이 아닌’이 중요해요.", "16 : 24의 전항과 후항을 8로 나누면 2 : 3이에요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [
        ["8 : 14에서 전항은 ", { i: "8" }, ", 후항은 ", { i: "14" }, "이에요."],
        ["20 : 50과 비율이 같은 비를 하나 써 보세요: ", { r: [2, 5], any: true }]], { ok: "20 : 50과 비율이 같은 비는 10 : 25, 40 : 100, 2 : 5처럼 여러 가지예요.", simpNote: false }),
      (bx, ax) => quiz(bx, ax, [
        { q: "비의 성질을 잘못 설명한 것을 골라요.", o: ["㉠ 비의 전항과 후항을 6으로 나누어도 비율은 같습니다.", "㉡ 비의 전항과 후항에 0을 곱하여도 비율은 같습니다.", "㉢ 비의 전항과 후항에 5를 곱하여도 비율은 같습니다."], a: 1, why: { "0": "6은 0이 아니므로 맞는 설명이에요.", "2": "5는 0이 아니므로 맞는 설명이에요." } },
        { q: "가로와 세로의 비가 2 : 3과 비율이 같은 액자를 골라요.", fig: rp4Frames, o: ["가", "나"], a: 1, why: { "0": "가는 15 : 18이에요. 3으로 나누면 5 : 6이에요." } }],
        { ok: "0을 곱하면 0 : 0이 되므로 ㉡이 틀렸어요. 나 액자는 16 : 24 = 2 : 3이에요." }),
      (bx, ax) => rp4Rect(bx, ax, { base: [2, 3], ok: "크기는 달라도 가로와 세로의 비율이 같으면 모양이 같아요." })]) }
},
{
  id: "t3", no: 3, title: "간단한 자연수의 비로 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "소수나 분수의 비를 간단한 자연수의 비로 어떻게 나타낼까요?",
  summary: "비의 성질을 이용하면 소수나 분수의 비를 간단한 자연수의 비로 나타낼 수 있어요. (소수) : (소수)는 10, 100, 1000…을 곱하고, (분수) : (분수)는 두 분모의 공배수를 곱해요. (분수) : (소수)는 분수를 소수로 바꾸거나 소수를 분수로 바꾸어 나타내요. 자연수의 비가 되면 두 수의 공약수로 나누어 더 간단하게 해요. ‘간단한’ 비는 한 가지만 있는 것이 아니에요.",
  steps: [
    { inst: "서영이는 버려진 현수막으로 만든 가방을 꾸미는 공간에 왔어요. “빨간색 물감 0.8 L와 파란색 물감 0.2 L를 섞어서 보라색 물감을 만들어야지.” 빨간색 물감의 양과 파란색 물감의 양의 비 0.8 : 0.2를 간단한 자연수의 비로 나타내 보세요.", hints: ["소수 한 자리 수이므로 전항과 후항에 10을 곱해요.", "8 : 2를 두 수의 공약수 2로 나누어요."],
      render: (b, a) => rp4Simp(b, a, { a: "0.8", b: "0.2", ma: "dec", mb: "dec", simplest: true, noConv: true,
        ask: [["소수 한 자리 수이므로 전항과 후항에 ", { i: "10" }, "을 곱하면 ", { r: [8, 2] }, "이고, 다시 ", { i: "2" }, "로 나누면 ", { r: [4, 1] }, "이에요."]],
        ok: "0.8 : 0.2 = 8 : 2 = 4 : 1이에요. 빨간색 물감과 파란색 물감을 4 : 1로 섞어요." }) },
    { inst: "[2/3] : [4/9]를 간단한 자연수의 비로 나타내 보세요. 전항과 후항에 어떤 수를 곱해야 할까요?", hints: ["두 분모 3과 9의 공배수를 곱하면 분모가 없어져요.", "9를 곱하면 6 : 4, 공약수 2로 나누면 3 : 2예요."],
      render: (b, a) => rp4Simp(b, a, { a: "2/3", b: "4/9", ma: "frac", mb: "frac", simplest: true, noConv: true, mults: [3, 9],
        ask: [["두 분모 3과 9의 ", { c: ["공배수", "공약수"], a: 0 }, "인 ", { i: "9" }, "를 곱하면 ", { r: [6, 4] }, "이고, 2로 나누면 ", { r: [3, 2] }, "예요."]],
        ok: "[2/3] : [4/9] = 6 : 4 = 3 : 2예요. 18, 27처럼 다른 공배수를 곱해도 공약수로 나누면 3 : 2가 돼요." }) },
    { inst: "[2/5] : 0.6을 간단한 자연수의 비로 나타내려고 해요. 두 가지 방법으로 나타내 보세요.", hints: ["방법 1: ‘전항 바꾸기’로 [2/5]를 0.4로 바꾼 다음 10을 곱해요.", "방법 2: ‘후항 바꾸기’로 0.6을 [6/10]으로 바꾼 다음 10을 곱해요."],
      render: (b, a) => rp4Seq(b, a, [
        { title: "방법 1 전항을 소수로 바꾸어 나타내기", run: (bx, ax) => rp4Simp(bx, ax, { a: "2/5", b: "0.6", ma: "frac", mb: "dec", need: "a2dec", simplest: true, ok: "[2/5] = 0.4, 0.4 : 0.6 = 4 : 6 = 2 : 3이에요." }) },
        { title: "방법 2 후항을 분수로 바꾸어 나타내기", run: (bx, ax) => rp4Simp(bx, ax, { a: "2/5", b: "0.6", ma: "frac", mb: "dec", need: "b2frac", simplest: true, ok: "0.6 = [6/10], [2/5] : [6/10] = 4 : 6 = 2 : 3이에요. 두 방법 모두 2 : 3이 돼요." }) }]) },
    { name: "정리하기", inst: "간단한 자연수의 비로 나타내는 방법을 정리해요.", hints: ["소수 두 자리 수는 100을 곱하면 자연수가 돼요.", "분수의 분모를 없애려면 분모의 공배수를 곱해요."],
      render: (b, a) => blanks(b, a, ["(소수) : (소수)는 전항과 후항에 ", { o: ["10, 100, 1000…", "두 분모의 공배수"], a: 0 }, "을 곱하고, (분수) : (분수)는 전항과 후항에 ", { o: ["두 분모의 공배수", "두 분자의 합"], a: 0 }, "를 곱해요. 자연수의 비가 되면 두 수의 ", { o: ["공약수", "공배수"], a: 0 }, "로 나누어 더 간단하게 나타낼 수 있어요. (분수) : (소수)는 ", { o: ["분수를 소수로, 또는 소수를 분수로 바꾸어", "분수와 소수를 그대로 두고"], a: 0 }, " 나타내요."],
        { ok: "최소공배수뿐 아니라 다른 공배수를 곱해도 돼요. 그다음 공약수로 나누면 더 간단해져요." }) },
    { inst: "간단한 자연수의 비로 나타내 보세요. 비율이 같은 자연수의 비라면 정답이에요.", hints: ["[3/5] : [1/7]은 분모 5와 7의 공배수 35를 곱해요.", "[1 1/2] = [3/2]예요. 1.5 : [1/4]은 [1/4] = 0.25로 바꾸어 100을 곱해 봐요."],
      render: (b, a) => rp4Chain(b, a, [
        ["0.7 : 0.5 → ", { r: [7, 5], any: true }],
        ["[3/5] : [1/7] → ", { r: [21, 5], any: true, why: { "3:1": "분자끼리만 비로 쓰면 안 돼요. 두 분모의 공배수 35를 곱해요." } }],
        ["1.5 : [1/4] → ", { r: [6, 1], any: true }],
        ["[1 1/2] : [1/6] → ", { r: [9, 1], any: true }]],
        { ok: "예를 들어 7 : 5, 21 : 5, 6 : 1, 9 : 1로 나타낼 수 있어요." }) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["[1/4] = 0.25, 0.37 = [37/100]이에요.", "공깃돌의 초록색은 126 − 80 = 46개예요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [
        { t: "방법 1", p: ["[1/4] = ", { i: "0.25" }, " → 0.25 : 0.37 → ", { r: [25, 37] }] },
        { t: "방법 2", p: ["0.37 = ", { f: "37/100" }, " → [1/4] : [37/100] → ", { r: [25, 37] }] }], { ok: "두 방법 모두 25 : 37이에요." }),
      (bx, ax) => rp4Chain(bx, ax, [
        ["4.6 : 1.3 → ", { r: [46, 13], any: true }], ["[5/8] : [4/5] → ", { r: [25, 32], any: true }],
        ["30 : 36 → ", { r: [5, 6], any: true }], ["1.7 : [9/10] → ", { r: [17, 9], any: true }]], { ok: "예를 들어 46 : 13, 25 : 32, 5 : 6, 17 : 9예요." }),
      (bx, ax) => quiz(bx, ax, [{ q: "간단한 자연수의 비로 나타낸 것 중 잘못 나타낸 것을 골라요.", o: ["㉠ [1 3/4] : 2.1 → 5 : 6", "㉡ 1.4 : 0.5 → 14 : 5", "㉢ 0.3 : [8/9] → 27 : 8"], a: 2,
        why: { "0": "[1 3/4] = 1.75예요. 1.75 : 2.1에 100을 곱하면 175 : 210, 35로 나누면 5 : 6이에요.", "1": "1.4 : 0.5에 10을 곱하면 14 : 5예요." } }],
        { ok: "㉢ 0.3 : [8/9]에 90을 곱하면 27 : 80이에요. 27 : 8은 잘못 나타냈어요." }),
      (bx, ax) => rp4Chain(bx, ax, [
        ["딸기청 0.32 L와 우유 1.3 L를 섞었어요. 딸기청 양 : 우유 양 → ", { r: [16, 65], any: true }],
        ["공깃돌 126개 중 노란색이 80개이고 나머지는 모두 초록색이에요. 노란색 수 : 초록색 수 → ", { r: [40, 23], any: true, why: { "80:126": "126은 전체 공깃돌 수예요. 초록색은 126 − 80 = 46개예요." } }]],
        { ok: "0.32 : 1.3 = 32 : 130 = 16 : 65, 80 : 46 = 40 : 23이에요." })]) }
},
{
  id: "t4", no: 4, title: "비례식을 알아볼까요", soop: "개념 구축하기(O)",
  question: "비율이 같은 두 비를 어떻게 식으로 나타낼까요?",
  summary: "비율이 같은 두 비를 기호 =를 사용하여 6 : 20=12 : 40과 같이 나타낸 식을 비례식이라고 해요. 비례식 6 : 20=12 : 40에서 바깥쪽에 있는 6과 40을 외항, 안쪽에 있는 20과 12를 내항이라고 해요.",
  steps: [
    { inst: "이번에는 친환경 신발을 소개하는 부스에 도착했어요. “페트병과 나무껍질을 활용하여 만든 신발이에요. 친환경 신발 한 켤레당 페트병 6개와 나무껍질 20 g이 필요해요.” 신발을 두 켤레 만들어 보고, 페트병 수와 나무껍질양의 비와 비율을 비교해 보세요.", hints: ["‘친환경 신발 하나 더 만들기’를 눌러요.", "[6/20]과 [12/40]을 약분하면 둘 다 [3/10]이에요."],
      render: (b, a) => rp4Build(b, a, { what: "친환경 신발", unit: "켤레", prod: "shoe", start: 1, target: 2, max: 3,
        items: [{ name: "페트병", per: 6, unit: "개", icon: "bottle" }, { name: "나무껍질", per: 20, unit: "g", icon: "bark", lump: true }],
        ask: [{ t: "한 켤레", p: ["페트병 수와 나무껍질양의 비 ", { r: [6, 20] }, ", 비율 ", { f: "6/20" }] },
          { t: "두 켤레", p: ["페트병 수와 나무껍질양의 비 ", { r: [12, 40] }, ", 비율 ", { f: "12/40" }] },
          ["두 비율은 약분하면 ", { f: "3/10" }, "으로 같아요."]],
        ok: "6 : 20과 12 : 40의 비율은 [3/10]으로 같아요. 비율이 같으니 기호 =를 사용하면 좋겠어요." }) },
    { inst: "비율이 같은 두 비를 기호 =를 사용하여 6 : 20=12 : 40과 같이 나타낼 수 있어요. 이와 같은 식을 비례식이라고 해요. 비례식에서 바깥쪽에 있는 두 수에 ◯, 안쪽에 있는 두 수에 △를 해 보세요.", hints: ["바깥쪽은 맨 앞의 6과 맨 뒤의 40이에요.", "안쪽은 기호 = 의 양옆에 있는 20과 12예요."],
      render: (b, a) => rp4Terms(b, a, { props: [[6, 20, 12, 40]], ok: "6 : 20=12 : 40에서 바깥쪽 6과 40은 외항, 안쪽 20과 12는 내항이에요." }) },
    { inst: "비례식에서 외항에 ◯표, 내항에 △표 해 보세요. 전항·후항과 헷갈리지 않게 비례식 전체에서 바깥쪽과 안쪽을 살펴요.", hints: ["3 : 8=12 : 32에서 바깥쪽은 3과 32예요.", "24 : 16=3 : 2에서 안쪽은 16과 3이에요."],
      render: (b, a) => rp4Terms(b, a, { props: [[3, 8, 12, 32], [24, 16, 3, 2]], ok: "3 : 8=12 : 32의 외항은 3, 32, 내항은 8, 12예요. 24 : 16=3 : 2의 외항은 24, 2, 내항은 16, 3이에요." }) },
    { inst: "비례식과 외항, 내항을 약속해요.", hints: ["비율이 같은 두 비를 기호 =로 나타낸 식이에요.", "바깥쪽 두 항과 안쪽 두 항의 이름을 떠올려요."],
      render: (b, a) => blanks(b, a, ["비율이 같은 두 비를 기호 =를 사용하여 6 : 20=12 : 40과 같이 나타낸 식을 ", { o: ["비례식", "비율", "비"], a: 0 }, "이라고 합니다. 비례식 6 : 20=12 : 40에서 바깥쪽에 있는 6과 40을 ", { o: ["외항", "내항", "전항"], a: 0 }, ", 안쪽에 있는 20과 12를 ", { o: ["외항", "내항", "후항"], a: 1 }, "이라고 합니다."],
        { ok: "비례식에서 바깥쪽 두 항은 외항, 안쪽 두 항은 내항이에요." }) },
    { inst: "비의 성질을 이용하여 비례식을 세우고, 보기에서 비율이 같은 두 비를 찾아 비례식을 세워 보세요.", hints: ["2 : 9의 전항 2에 6을 곱하면 12예요.", "보기의 비를 간단한 자연수의 비로 나타내 비율을 비교해요. 1.6 : 1.4에 5를 곱하면?"],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => rp4Chain(bx, ax, [
          ["2 : 9는 전항과 후항에 ", { i: "6" }, "을 곱한 12 : ", { i: "54" }, "와 비율이 같으므로 비례식은 2 : 9=12 : ", { i: "54" }],
          ["10 : 6은 전항과 후항을 ", { i: "2" }, "로 나눈 ", { i: "5" }, " : 3과 비율이 같으므로 비례식은 10 : 6=", { i: "5" }, " : 3"]],
          { ok: "2 : 9=12 : 54, 10 : 6=5 : 3이에요." }),
        { title: "보기: 8 : 7, [1/8] : [1/7], 1.6 : 1.4, 24 : 28", run: (bx, ax) => rp4Match(bx, ax, { cards: ["8 : 7", "[1/8] : [1/7]", "1.6 : 1.4", "24 : 28"], need: 1, ok: "8 : 7=1.6 : 1.4예요. [1/8] : [1/7] = 7 : 8, 24 : 28 = 6 : 7은 비율이 달라요." } ) }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["외항은 비례식 전체의 바깥쪽에 있는 두 수예요.", "8 : 11의 전항과 후항에 3을 곱하면 24 : 33이에요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [
        ["4 : 9의 비율 ", { f: "4/9" }, ", 12 : 27의 비율 ", { f: "12/27" }, " → 비례식 4 : 9=12 : 27"],
        ["3 : 17 →(×2)→ 6 : ", { i: "34" }, "이므로 3 : 17=6 : ", { i: "34" }],
        ["40 : 25 →(÷5)→ ", { i: "8" }, " : 5이므로 40 : 25=", { i: "8" }, " : 5"]], { ok: "4 : 9=12 : 27, 3 : 17=6 : 34, 40 : 25=8 : 5예요." }),
      (bx, ax) => quiz(bx, ax, [{ q: "비례식 20 : 16=5 : 4를 옳게 설명한 사람을 골라요.", o: ["나현: 20 : 16과 5 : 4는 비율이 같아.", "은호: 외항은 20과 16이고, 내항은 5와 4야."], a: 0, why: { "1": "20 : 16=5 : 4에서 외항은 바깥쪽의 20과 4, 내항은 안쪽의 16과 5예요." } }], { ok: "나현이가 옳아요. 외항은 20과 4, 내항은 16과 5예요." }),
      { title: "비율이 같은 두 비를 찾아 비례식을 세워요.", run: (bx, ax) => rp4Match(bx, ax, { cards: ["10 : 14", "21 : 28", "15 : 21"], need: 1, ok: "10 : 14=15 : 21이에요. 둘 다 비율이 [5/7]이에요." }) },
      (bx, ax) => rp4Chain(bx, ax, [["비율은 [8/11]이고 내항은 33과 8인 비례식: ", { i: "24" }, " : 33=8 : ", { i: "11" }]], { ok: "24 : 33=8 : 11이에요. 24 : 33의 전항과 후항을 3으로 나누면 8 : 11이에요." })]) }
},
{
  id: "t5", no: 5, title: "비례식의 성질을 알아볼까요", soop: "개념 구축하기(O)",
  question: "비례식에서 외항의 곱과 내항의 곱은 어떤 관계가 있을까요?",
  summary: "비례식에서 외항의 곱과 내항의 곱은 같아요. 1 : 4=1×6 : 4×6에서 외항의 곱은 1×4×6, 내항의 곱은 4×1×6이므로 같아요. 이 성질을 이용하면 비례식의 □ 안에 알맞은 수를 구할 수 있어요.",
  steps: [
    { inst: "헌 크레파스로 새 크레파스를 만드는 공간에 왔어요. “새 크레파스 1개를 만드는 데 헌 크레파스 4 g이 필요하고, 새 크레파스 6개를 만드는 데 헌 크레파스 24 g이 필요해요.” 새 크레파스를 6개까지 만들어 보고 비례식을 세워 보세요.", hints: ["‘새 크레파스 하나 더 만들기’를 5번 눌러요.", "1 : 4의 전항과 후항에 6을 곱하면 6 : 24예요."],
      render: (b, a) => rp4Build(b, a, { what: "새 크레파스", unit: "개", start: 1, target: 6, max: 6,
        items: [{ name: "새 크레파스", per: 1, unit: "개", icon: "newcr" }, { name: "헌 크레파스", per: 4, unit: "g", icon: "old", lump: true }],
        ask: [["1 : 4 →(×", { i: "6" }, ")→ 6 : 24이므로 비례식은 1 : 4=", { i: "6" }, " : ", { i: "24" }],
          ["외항의 곱: 1 × ", { i: "24" }, " = ", { i: "24" }],
          ["내항의 곱: 4 × ", { i: "6" }, " = ", { i: "24" }],
          ["외항의 곱과 내항의 곱은 ", { c: ["같아요", "달라요"], a: 0 }, "."]],
        ok: "1 : 4=6 : 24에서 외항의 곱 1×24와 내항의 곱 4×6은 모두 24로 같아요." }) },
    { inst: "2 : 11의 전항과 후항에 3을 곱하여 비례식 2 : 11=6 : □를 세웠어요. 외항의 곱과 내항의 곱을 직사각형의 넓이로 나타냈어요. 빨간 손잡이를 끌어 두 넓이가 같아지는 □를 찾아보세요.", hints: ["11에 3을 곱하면 □예요.", "내항의 곱은 11 × 6 = 66이에요. 2 × □가 66이 되게 해요."],
      render: (b, a) => rp4Area(b, a, { p: [2, 11, 6, null], max: 40,
        ask: [["2 : 11=6 : ", { i: "33" }], ["외항의 곱 2 × 33 = ", { i: "66" }, ", 내항의 곱 11 × 6 = ", { i: "66" }]],
        ok: "2 : 11=6 : 33에서 외항의 곱과 내항의 곱은 66으로 같아요." }) },
    { inst: "외항의 곱과 내항의 곱이 왜 같은지 이야기해 보세요.", hints: ["6은 2×3, 33은 11×3이에요.", "곱하는 순서를 바꾸어도 곱은 같아요."],
      render: (b, a) => blanks(b, a, ["2 : 11=2×3 : 11×3이므로 외항의 곱 2×33은 ", { o: ["2×11×3", "2×3×3"], a: 0 }, "이고, 내항의 곱 11×6은 ", { o: ["11×2×3", "11×3×3"], a: 0 }, "이에요. 곱하는 수가 같고 순서만 다르므로 외항의 곱과 내항의 곱은 ", { o: ["같아요", "달라요"], a: 0 }, "."],
        { ok: "1 : 4=1×■ : 4×■의 외항의 곱은 1×4×■, 내항의 곱은 4×1×■이므로 언제나 같아요." }) },
    { inst: "비례식의 성질을 약속해요.", hints: ["외항은 바깥쪽 두 항, 내항은 안쪽 두 항이에요."],
      render: (b, a) => blanks(b, a, ["비례식에서 ", { o: ["외항의 곱과 내항의 곱", "전항의 합과 후항의 합"], a: 0 }, "은 ", { o: ["같습니다", "다릅니다"], a: 0 }, "."],
        { ok: "비례식에서 외항의 곱과 내항의 곱은 같습니다." }) },
    { inst: "비례식의 성질을 이용하여 비례식을 완성해 보세요. 직사각형의 넓이가 같아지게 □를 찾아요.", hints: ["3 : 5=□ : 15에서 외항의 곱은 3 × 15 = 45예요. 5 × □ = 45예요.", "□ : 7=42 : 21에서 내항의 곱은 7 × 42 = 294예요. □ × 21 = 294예요."],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => rp4Area(bx, ax, { p: [3, 5, null, 15], ask: [["외항의 곱 3 × 15 = ", { i: "45" }, " → 5 × □ = 45 → □ = ", { i: "9" }]], ok: "3 : 5=9 : 15예요." }),
        (bx, ax) => rp4Area(bx, ax, { p: [null, 7, 42, 21], max: 28, ask: [["내항의 곱 7 × 42 = ", { i: "294" }, " → □ × 21 = 294 → □ = ", { i: "14" }]], ok: "14 : 7=42 : 21이에요." })]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["20 : ㉠=4 : ㉡에서 외항은 20과 ㉡, 내항은 ㉠과 4예요.", "0.8 : 1.2=1 : 4에서 외항의 곱 0.8×4와 내항의 곱 1.2×1을 비교해요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [["비례식 20 : ㉠=4 : ㉡에서 외항의 곱이 100일 때 ㉡ = ", { i: "5" }, ", ㉠ = ", { i: "25" }]], { ok: "20×㉡=100이므로 ㉡=5, 내항의 곱도 100이므로 ㉠×4=100, ㉠=25예요." }),
      (bx, ax) => rp4Chain(bx, ax, [
        ["6 : 5=18 : 15 → 외항의 곱 6 × 15 = ", { i: "90" }, ", 내항의 곱 5 × 18 = ", { i: "90" }],
        ["5 : 3=□ : 9 → 3 × □ = ", { i: "45" }, ", □ = ", { i: "15" }],
        ["28 : 16=□ : 4 → □ = ", { i: "7" }, "      3 : 8=27 : □ → □ = ", { i: "72" }],
        ["4 : 9=㉠ : ㉡에서 외항의 곱이 180이면 ㉠ = ", { i: "20" }, ", ㉡ = ", { i: "45" }]], { ok: "외항의 곱과 내항의 곱이 같다는 성질로 모두 구했어요." }),
      (bx, ax) => quiz(bx, ax, [
        { q: "비례식의 성질을 이용하여 비례식을 모두 찾아요.", o: ["2 : 7=10 : 35", "0.8 : 1.2=1 : 4", "[3/4] : [1/8]=6 : 1"], a: [0, 2] },
        { q: "□ 안에 알맞은 수가 더 작은 것을 골라요. ㉠ □ : 6=10 : 12  ㉡ 4.2 : □=7 : 5", o: ["㉠", "㉡"], a: 1, why: { "0": "㉠ □×12=60이므로 □=5, ㉡ □×7=21이므로 □=3이에요." } }],
        { bad: "외항의 곱과 내항의 곱을 각각 계산해 비교해요. 0.8×4=3.2, 1.2×1=1.2예요.", ok: "2×35=7×10=70, [3/4]×1=[1/8]×6=[3/4]이므로 두 식이 비례식이에요. ㉠은 5, ㉡은 3이에요." })]) }
},
{
  id: "t6", no: 6, title: "비례식을 활용해 볼까요", soop: "개념 구축하기(O)",
  question: "비례식을 이용하여 생활 속 문제를 어떻게 해결할까요?",
  summary: "구하려는 것을 □라 하고, 두 양의 비를 같은 차례(예: 시간 : 거리 = 시간 : 거리)로 써서 비례식을 세워요. 비례식의 성질(외항의 곱 = 내항의 곱), 비의 성질(전항과 후항에 같은 수 곱하기), 비율(두 비율이 같음)을 이용해 □를 구할 수 있어요.",
  steps: [
    { inst: "새 활용 체험관에서는 버려지는 병뚜껑을 모아 크기가 같은 상자에 똑같은 개수씩 담아 새 활용 센터에 기부하려고 해요. “병뚜껑 100개를 담는 데 상자 2개가 필요하다는데 그럼 250개를 담는 데 필요한 상자는 몇 개일까?” 두 줄 수직선에서 250개의 짝을 찾아보세요.", hints: ["병뚜껑 50개마다 상자 1개예요.", "비례식 100 : 2=250 : □에서 외항의 곱과 내항의 곱이 같아요."],
      render: (b, a) => rp4Dbl(b, a, { top: { name: "병뚜껑 수", unit: "개", tick: 50 }, bot: { name: "상자 수", unit: "개", tick: 1, snap: 1 }, given: [100, 2], askAt: 250, tmax: 300,
        ask: [["병뚜껑 100개일 때 병뚜껑 수와 상자 수의 비: ", { r: [100, 2] }],
          ["상자를 □개라 하면 비례식은 100 : 2=250 : □"],
          ["100 × □ = 2 × 250 = ", { i: "500" }, ", □ = ", { i: "5" }, " (개)"]],
        ok: "병뚜껑 250개를 담는 데 상자 5개가 필요해요." }) },
    { inst: "“장난감의 빨간색 톱니바퀴가 2바퀴 회전할 때 파란색 톱니바퀴는 5바퀴 회전합니다.” 빨간색 톱니바퀴를 16바퀴 돌려 보고, 파란색 톱니바퀴는 몇 바퀴 회전하는지 비례식으로 구해 보세요.", hints: ["‘빨간색 2바퀴 돌리기’를 8번 눌러요.", "2 : 5=16 : □에서 2 × □ = 5 × 16이에요."],
      render: (b, a) => rp4Gear(b, a, { r: 2, b: 5, target: 16,
        ask: [["빨간색 톱니바퀴와 파란색 톱니바퀴의 회전수의 비: ", { r: [2, 5] }],
          ["비례식 2 : 5=16 : □ → 2 × □ = 5 × 16 = ", { i: "80" }, ", □ = ", { i: "40" }, " (바퀴)"]],
        ok: "빨간색 톱니바퀴가 16바퀴 회전할 때 파란색 톱니바퀴는 40바퀴 회전해요." }) },
    { inst: "“일정한 빠르기로 달리는 고속 열차가 10분 동안 30 km를 이동하였습니다.” 이 열차가 45분 동안 이동한 거리를 구하려고 해요. 두 줄 수직선에서 45분의 짝을 찾고, 시후의 방법으로 구해 보세요.", hints: ["10분마다 30 km씩 가요. 5분이면 15 km예요.", "시간 : 거리 = 시간 : 거리 차례로 비례식을 세워요."],
      render: (b, a) => rp4Dbl(b, a, { top: { name: "시간", unit: "분", tick: 5 }, bot: { name: "거리", unit: "km", tick: 15, snap: 15 }, given: [10, 30], askAt: 45, tmax: 50,
        ask: [{ t: "시후 · 비례식의 성질", p: ["10 : 30=45 : □ → 10 × □ = 30 × 45 = ", { i: "1350" }, ", □ = ", { i: "135" }] }],
        ok: "열차가 45분 동안 이동한 거리는 135 km예요." }) },
    { name: "여러 방법", inst: "은채와 재민이의 방법으로도 열차가 45분 동안 이동한 거리를 구해 보세요.", hints: ["10이 45가 되려면 [45/10] = [9/2]를 곱해요.", "두 비율 [10/30]과 [45/□]가 같아요. [10/30] = [1/3]이에요."],
      render: (b, a) => rp4Chain(b, a, [
        { t: "은채 · 비의 성질", p: ["10 : 30의 전항과 후항에 ", { f: "9/2" }, "를 곱하면 45 : ", { i: "135" }] },
        { t: "재민 · 비율", p: ["[10/30] = [45/□]에서 □ = ", { i: "135" }] },
        ["열차가 45분 동안 이동한 거리는 ", { i: "135" }, " km예요."]],
        { ok: "비례식의 성질, 비의 성질, 비율 중 어느 방법으로도 135 km예요." }) },
    { inst: "비례식을 바르게 세웠는지 살펴보고, 주사위로 비례식을 만들어 보세요. 주사위를 두 번 던져 나온 눈의 수를 차례대로 비로 나타내고(예: 3, 2 → 3 : 2), 그 비와 60 : □의 비율이 같다고 보고 □를 구해요.", hints: ["두 비의 차례(시간 : 거리)를 같게 써요.", "3 : 2=60 : □이면 3 × □ = 2 × 60이에요."],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "고속 열차 문제(10분 동안 30 km, 45분 동안 □ km)의 비례식을 바르게 세운 것은?", o: ["10 : 30=45 : □", "10 : 30=□ : 45", "30 : 10=45 : □"], a: 0,
          why: { "1": "앞의 비는 시간 : 거리, 뒤의 비는 거리 : 시간이 되었어요. 두 비의 차례를 같게 써요.", "2": "앞의 비는 거리 : 시간, 뒤의 비는 시간 : 거리예요. 같은 차례로 써요." } }], { ok: "시간 : 거리 = 시간 : 거리처럼 두 비의 차례를 같게 세워요." }),
        (bx, ax) => rp4Dice(bx, ax, { base: 60, need: 2, ok: "주사위로 만든 비례식을 비례식의 성질로 풀었어요." })]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요. 비례식을 세워 구해요.", hints: ["5 : 4=15 : □처럼 같은 차례로 세워요.", "6 : 18=□ : 27에서 18 × □ = 6 × 27이에요."],
    render: (b, a) => rp4Chain(b, a, [
      ["밀가루와 물을 5 : 4로 섞어요. 밀가루가 15컵이면 물은 ", { i: "12" }, "컵"],
      ["가로와 세로의 비가 5 : 7인 동화책의 세로가 28 cm이면 가로는 ", { i: "20" }, " cm"],
      ["과자 8봉지가 6800원이면 같은 과자 12봉지는 ", { i: "10200" }, "원"],
      ["6시간에 18분씩 늦어지는 시계가 27분 늦어지는 데 걸리는 시간은 ", { i: "9" }, "시간"]],
      { ok: "5 : 4=15 : 12, 5 : 7=20 : 28, 8 : 6800=12 : 10200, 6 : 18=9 : 27이에요." }) }
},
{
  id: "t7", no: 7, title: "비례배분을 해 볼까요", soop: "개념 구축하기(O)",
  question: "전체를 주어진 비로 어떻게 나눌까요?",
  summary: "전체를 주어진 비로 나누는 것을 비례배분이라고 해요. 지갑 10개를 2 : 3으로 나누려면 전체를 (2+3)만큼 등분하여 10 × [2/5] = 4(개), 10 × [3/5] = 6(개)로 나눠요.",
  steps: [
    { inst: "마지막으로 서영이는 지갑을 만드는 체험을 했어요. “내가 우유갑을 이용하여 만든 지갑 10개를 행복 새 활용 센터와 나눔 새 활용 센터에 2 : 3으로 나누어 기부해야겠다.” 먼저 지갑 5개, 그다음 지갑 10개를 2 : 3으로 나누어 보세요.", hints: ["지갑 5개는 2개와 3개로 나눠요.", "지갑 10개는 2개씩 묶으면 5묶음이에요. 2묶음과 3묶음으로 나눠요."],
      render: (b, a) => rp4Seq(b, a, [
        { title: "지갑 5개를 2 : 3으로", run: (bx, ax) => rp4Tape(bx, ax, { N: 5, unit: "개", snap: 1, ratio: [2, 3], names: ["행복 새 활용 센터", "나눔 새 활용 센터"], icon: "wallet" }) },
        { title: "지갑 10개를 2 : 3으로", run: (bx, ax) => rp4Tape(bx, ax, { N: 10, unit: "개", snap: 1, ratio: [2, 3], names: ["행복 새 활용 센터", "나눔 새 활용 센터"], icon: "wallet", ok: "지갑을 2개씩 묶으면 2묶음은 4개, 3묶음은 6개예요." }) }]) },
    { inst: "전체를 1로 생각하고 2 : 3으로 나누려면 전체를 (2+3)만큼 등분해야 해요. 두 센터에 기부할 지갑은 전체의 몇 분의 몇인지 알아보고 계산해 보세요.", hints: ["전체를 5등분한 것 중 2만큼은 [2/5]예요.", "10 × [2/5]는 10을 5로 나눈 것의 2배예요."],
      render: (b, a) => rp4Chain(b, a, [
        ["행복 새 활용 센터: 10 × ", { f: "2/5", why: { "1/2": "2 : 3은 전체를 둘로 나누는 것이 아니에요. 전체를 (2+3)=5만큼 등분해요." } }, " = ", { i: "4" }, "(개)"],
        ["나눔 새 활용 센터: 10 × ", { f: "3/5", why: { "1/3": "전체를 3등분하는 것이 아니에요. 전체를 (2+3)=5만큼 등분해요." } }, " = ", { i: "6" }, "(개)"]],
        { ok: "행복 새 활용 센터에 4개, 나눔 새 활용 센터에 6개를 기부해요." }) },
    { inst: "“하윤이와 승우가 종이띠 600 cm를 1 : 3으로 나누어 가지려고 합니다.” 종이띠를 나누어 보고, 각각 몇 cm씩 가지면 되는지 구해 보세요.", hints: ["전체를 (1+3)=4만큼 등분해요.", "하윤이는 전체의 [1/4], 승우는 전체의 [3/4]이에요."],
      render: (b, a) => rp4Tape(b, a, { N: 600, unit: "cm", snap: 50, ratio: [1, 3], names: ["하윤", "승우"],
        ask: [["하윤: 600 × ", { f: "1/4" }, " = ", { i: "150" }, " (cm)"], ["승우: 600 × ", { f: "3/4" }, " = ", { i: "450" }, " (cm)"]],
        ok: "하윤이는 150 cm, 승우는 450 cm를 가지면 돼요." }) },
    { inst: "비례배분을 약속해요.", hints: ["전체를 주어진 비로 나누는 것이에요.", "2 : 3이면 2+3=5만큼 등분해요."],
      render: (b, a) => blanks(b, a, ["전체를 주어진 비로 나누는 것을 ", { o: ["비례배분", "비례식", "비율"], a: 0 }, "이라고 합니다. 전체를 2 : 3으로 나누려면 전체를 ", { o: ["(2+3)만큼", "2만큼", "3만큼"], a: 0 }, " 등분하여 전체의 [2/5]와 [3/5]으로 나눠요."],
        { ok: "전체를 주어진 비로 나누는 것을 비례배분이라고 합니다." }) },
    { inst: "보기에서 비 1개를 골라 문제를 완성하고, 답을 구해 보세요. 문제: “점토 720 g을 □(으)로 나누어 컵과 컵 받침을 만들었습니다. 컵과 컵 받침을 만드는 데 사용한 점토의 무게는 각각 몇 g인가요?”", hints: ["3 : 2를 고르면 전체를 5만큼 등분해요.", "컵은 720 × (전항) ÷ (비의 합)으로 구해요."],
      render: (b, a) => rp4Clay(b, a, { total: 720, cards: ["2 : 1", "3 : 2", "5 : 3", "7 : 2"], need: 2, names: ["컵", "컵 받침"], unit: "g",
        text: c => `점토 720 g을 ${rp4J(c, "으로")} 나누어 컵과 컵 받침을 만들었습니다. 컵과 컵 받침을 만드는 데 사용한 점토의 무게는 각각 몇 g인가요?`,
        ok: "2 : 1이면 480 g·240 g, 3 : 2면 432 g·288 g, 5 : 3이면 450 g·270 g, 7 : 2면 560 g·160 g이에요." }) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["1 : 3이면 전체를 4만큼 등분해요.", "1시간은 60분이에요. 운동은 전체의 [3/5]이에요."],
    render: (b, a) => rp4Chain(b, a, [
      ["연필 20자루를 다은이와 정민이가 1 : 3으로 나누면 다은 ", { i: "5", why: { "10": "똑같이 둘로 나눈 것이 아니에요. 전체를 (1+3)=4만큼 등분해요." } }, "자루, 정민 ", { i: "15" }, "자루"],
      ["88을 7 : 4로 나누면 88 × [7/11] = ", { i: "56" }, ", 88 × [4/11] = ", { i: "32" }],
      ["14000원짜리 장난감을 형과 규온이가 4 : 3으로 나누어 내면 형 ", { i: "8000" }, "원, 규온 ", { i: "6000" }, "원"],
      ["색종이 40장을 서준이와 은지가 3 : 5로 나누면 서준 ", { i: "15" }, "장, 은지 ", { i: "25" }, "장"],
      ["1시간 동안 청소와 운동을 2 : 3으로 나누어 하면 운동 시간은 ", { i: "36", why: { "20": "운동은 전체를 3등분한 것이 아니에요. 전체를 (2+3)=5만큼 등분한 것 중 3만큼이에요.", "30": "똑같이 반씩 나눈 것이 아니에요. 60 × [3/5]을 계산해요." } }, "분"]],
      { ok: "5자루·15자루, 56·32, 8000원·6000원, 15장·25장, 36분이에요." }) }
},
{
  id: "t89", no: "8~9", title: "생각을 더하다 ― 재료의 양을 구해 볼까요", soop: "탐구 정리하기(O)",
  question: "비례식과 비례배분을 이용하여 요리 재료의 양을 어떻게 구할까요?",
  summary: "조리법의 기준 인분과 만들려는 인분으로 비례식을 세워 재료의 양을 구하고, 섞은 재료는 주어진 비로 비례배분해요. 문제해결은 이해해요 → 계획해요 → 해결해요 → 되돌아봐요 차례로 해요. 토마토파스타 3인분: 면 270 g, 토마토 810 g, 양파 270 g. 당근볶음밥 3인분: 찬밥 600 g, 당근 72 g, 양파 48 g.",
  steps: [
    { name: "이해해요", inst: "다음은 토마토파스타 조리법의 일부분이에요. 하람이가 조리법을 보고 토마토파스타 3인분을 만들려고 해요. 3인분을 만들 때 필요한 파스타 면, 토마토, 양파의 양은 각각 몇 g인지 구하려고 해요. 문제를 이해해 보세요.", hints: ["조리법 제목 옆의 (2인분)을 살펴요.", "면을 삶는 시간은 재료의 양을 구하는 데 쓰지 않아요."],
      render: (b, a) => { b.append(rp4Recipe("토마토파스타(2인분)", ["파스타 면 180 g을 8분 동안 삶습니다.", "토마토와 양파를 썰어서 3 : 1로 섞은 것 720 g을 프라이팬에 넣고 볶습니다."]));
        quiz(b, a, [
          { q: "조리법은 몇 인분을 기준으로 쓰여 있나요?", o: ["2인분", "3인분", "1인분"], a: 0 },
          { q: "하람이가 만들려는 양은?", o: ["3인분", "2인분", "8인분"], a: 0 },
          { q: "토마토와 양파를 섞는 비는?", o: ["3 : 1", "1 : 3", "2 : 3"], a: 0, why: { "1": "토마토와 양파의 차례로 3 : 1이에요." } },
          { q: "문제를 해결하는 데 필요하지 않은 정보는?", o: ["면을 8분 동안 삶는다는 것", "파스타 면 180 g", "섞은 것 720 g"], a: 0 }],
          { ok: "조리법은 2인분 기준이고 3인분을 만들어요. 토마토와 양파는 3 : 1로 섞어요. 삶는 시간은 필요하지 않아요." }); } },
    { name: "계획해요", inst: "“조리법과 만들려고 하는 양이 각각 몇 인분인지를 이용하여 비로 나타내어 볼까?” 해결 계획을 세워 보세요.", hints: ["인분 수와 재료의 양의 비가 같아야 해요.", "섞은 것을 토마토와 양파로 나누는 것은 전체를 주어진 비로 나누는 것이에요."],
      render: (b, a) => blanks(b, a, ["파스타 면의 양은 (인분 수) : (면의 양)으로 ", { o: ["비례식", "비례배분"], a: 0 }, "을 세워 구하고, 섞은 것의 양도 ", { o: ["비례식", "비례배분"], a: 0 }, "을 세워 구해요. 토마토와 양파의 양은 섞은 것의 양을 3 : 1로 ", { o: ["비례배분해요", "더해요"], a: 0 }, "."],
        { ok: "면과 섞은 것은 비례식으로, 토마토와 양파는 비례배분으로 구해요." }) },
    { name: "해결해요 ①", inst: "3인분에 필요한 파스타 면의 양과 섞은 것의 양을 비례식으로 구해 보세요.", hints: ["2 : 180=3 : □에서 2 × □ = 180 × 3이에요.", "2 : 720=3 : □에서 2 × □ = 720 × 3이에요."],
      render: (b, a) => rp4Chain(b, a, [
        { t: "파스타 면", p: ["2 : 180=3 : □ → 2 × □ = ", { i: "540" }, ", □ = ", { i: "270" }, " (g)"] },
        { t: "섞은 것", p: ["2 : 720=3 : □ → 2 × □ = ", { i: "2160" }, ", □ = ", { i: "1080", why: { "720": "720 g은 2인분이에요. 3인분은 더 많아요." } }, " (g)"] }],
        { ok: "3인분에는 파스타 면 270 g, 섞은 것 1080 g이 필요해요." }) },
    { name: "해결해요 ②", inst: "섞은 것 1080 g을 토마토와 양파 3 : 1로 나누어 보세요.", hints: ["전체를 (3+1)=4만큼 등분해요.", "토마토는 1080 × [3/4]이에요."],
      render: (b, a) => rp4Tape(b, a, { N: 1080, unit: "g", snap: 30, ratio: [3, 1], names: ["토마토", "양파"],
        ask: [["토마토: 1080 × ", { f: "3/4" }, " = ", { i: "810" }, " (g)"], ["양파: 1080 × ", { f: "1/4" }, " = ", { i: "270" }, " (g)"]],
        ok: "토마토파스타 3인분에는 파스타 면 270 g, 토마토 810 g, 양파 270 g이 필요해요." }) },
    { name: "되돌아봐요", inst: "잘 해결했는지 되돌아보고, 다른 방법도 찾아보세요.", hints: ["2인분을 1인분으로 만든 다음 3인분으로 만들 수도 있어요.", "3인분은 2인분의 [3/2]배예요."],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => rp4Chain(bx, ax, [["다른 방법: 3인분은 2인분의 ", { f: "3/2" }, "배이므로 파스타 면은 180 × [3/2] = ", { i: "270" }, " (g)"],
          ["2인분 → 1인분 → 3인분: 180 ÷ 2 = ", { i: "90" }, ", 90 × 3 = ", { i: "270" }, " (g)"]], { ok: "어느 방법으로 구해도 270 g이에요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "내가 해결한 방법을 친구에게 설명하듯 써 보세요.", tag: "해결 방법", ph: "예) 2인분과 3인분의 비를 이용해 비례식 2 : 180=3 : □를 세웠어요. 외항의 곱과 내항의 곱이 같으니까…" }])]) }
  ],
  challenge: { inst: "다음은 당근볶음밥 조리법의 일부분이에요. 도연이가 조리법을 보고 당근볶음밥 3인분을 만들려고 해요. 3인분을 만들 때 필요한 찬밥, 당근, 양파의 양은 각각 몇 g인지 구해 보세요. 이번에는 조리법이 몇 인분 기준인지 꼭 확인해요.", hints: ["이 조리법은 4인분 기준이에요. 4 : 800=3 : □예요.", "섞은 것 120 g을 3 : 2로 나누면 전체를 5만큼 등분해요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => { bx.append(rp4Recipe("당근볶음밥(4인분)", ["찬밥 800 g을 준비합니다.", "당근과 양파를 썰어서 3 : 2로 섞은 것 160 g을 프라이팬에 넣고 볶습니다."]));
        rp4Chain(bx, ax, [
          { t: "찬밥", p: ["4 : 800=3 : □ → 4 × □ = ", { i: "2400" }, ", □ = ", { i: "600", why: { "1200": "이 조리법은 2인분이 아니라 4인분 기준이에요." } }, " (g)"] },
          { t: "섞은 것", p: ["4 : 160=3 : □ → 4 × □ = ", { i: "480" }, ", □ = ", { i: "120", why: { "240": "이 조리법은 4인분 기준이에요." } }, " (g)"] }], { ok: "3인분에는 찬밥 600 g, 섞은 것 120 g이 필요해요." }); },
      (bx, ax) => rp4Tape(bx, ax, { N: 120, unit: "g", snap: 4, ratio: [3, 2], names: ["당근", "양파"],
        ask: [["당근: 120 × ", { f: "3/5" }, " = ", { i: "72" }, " (g)"], ["양파: 120 × ", { f: "2/5" }, " = ", { i: "48" }, " (g)"]],
        ok: "당근볶음밥 3인분에는 찬밥 600 g, 당근 72 g, 양파 48 g이 필요해요." })]) }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 짝을 찾아 비례식을 세워요", soop: "발표하기(P)",
  question: "비율이 같은 두 비를 찾아 비례식을 세울 수 있을까요?",
  summary: "카드에 적힌 비의 비율을 구하거나 비의 성질을 이용해 비율이 같은 두 비를 찾고, 기호 =를 사용하여 비례식으로 나타내요(예: 2 : 3=4 : 6). 이 앱의 비 카드 14장은 이 앱이 정한 카드예요.",
  steps: [
    { name: "놀이 방법", inst: "‘짝을 찾아 비례식을 세워요’ 놀이 방법이에요(인원: 학급 전체, 준비물: 비 카드, 타이머, 놀이 시간 예: 5분). 놀이 순서대로 눌러 보세요.", hints: ["먼저 비율이 다른 카드 4장을 골라요.", "시간이 끝나면 자리로 돌아와 비례식을 세우고 발표해요."],
      render: (b, a) => sequence(b, a, ["㉠ 정해진 시간이 끝나면 자리로 돌아와 모은 카드로 비례식을 세워요.", "㉡ 카드를 살펴보며 비율을 구하고, 비율이 다른 카드 4장을 골라요.", "㉢ 돌아다니다 사람을 만나면 카드를 한 장씩 골라 동시에 보여 줘요.", "㉣ 세운 비례식을 발표하고 맞는지 서로 확인해요. 가장 많은 비례식을 세운 사람이 이겨요.", "㉤ 두 비의 비율이 같으면 가위바위보를 하여 이긴 사람이 상대의 카드를 가져와요."], [1, 2, 4, 0, 3],
        { ok: "카드 4장 고르기 → 만나서 카드 보여 주기 → 비율이 같으면 가위바위보 → 시간이 끝나면 비례식 세우기 → 발표하고 확인하기예요. 카드를 모두 잃으면 4장을 다시 골라 참여해요." }) },
    { name: "카드 고르기", inst: "이 앱이 정한 비 카드 14장이에요(교과서 카드와 다를 수 있어요). 카드를 살펴보며 비율을 구하고, 비율이 다른 카드 4장을 골라 보세요.", hints: ["2 : 3과 4 : 6처럼 비율이 같은 카드는 함께 고르지 않아요.", "[1/2] : [1/3]은 6을 곱하면 3 : 2예요. 9 : 12는 3으로 나누면 3 : 4예요."],
      render: (b, a) => rp4Hand(b, a) },
    { name: "친구 만나기", inst: "교실을 돌아다니다 친구를 만났어요. 친구가 보여 준 카드와 비율이 같은 카드가 내게 있으면 그 카드를 눌러 꺼내고, 없으면 ‘비율이 같은 카드가 없어요’를 눌러요. 비율이 같으면 가위바위보를 해요. 6번 알맞게 판단해 보세요.", hints: ["친구 카드의 비율을 구한 다음 내 카드의 비율과 비교해요.", "소수나 분수의 비는 간단한 자연수의 비로 바꾸어 비교하면 쉬워요."],
      render: (b, a) => rp4Meet(b, a, { rounds: 6 }) },
    { name: "비례식 세우기", inst: "정해진 시간이 끝났어요. 자리로 돌아와 모은 카드를 이용하여 비례식을 세워 보세요(모은 카드가 적으면 친구 카드를 보태어 4쌍으로 했어요).", hints: ["카드 두 장을 차례로 눌러요.", "비율이 같은 두 카드만 비례식이 돼요."],
      render: (b, a) => rp4Match(b, a, { cards: rp4GotCards(), ok: "모은 카드로 비례식을 모두 세웠어요!" }) },
    { name: "확인하기", inst: "친구들이 발표한 비례식이 맞는지 서로 확인해 보세요.", hints: ["두 비의 비율을 구해 같은지 확인해요.", "3 : 4와 4 : 3은 전항과 후항이 바뀌어 비율이 달라요."],
      render: (b, a) => quiz(b, a, [
        { q: "맞는 비례식을 모두 골라요.", o: ["2 : 3=4 : 6", "3 : 4=4 : 3", "[1/2] : [1/3]=3 : 2", "0.7 : 0.2=2 : 7", "9 : 12=3 : 4"], a: [0, 2, 4] },
        { q: "비율이 같은 두 비를 찾는 방법으로 알맞지 않은 것은?", o: ["두 비의 비율을 구해 비교해요.", "간단한 자연수의 비로 나타내어 비교해요.", "전항과 후항에 같은 수를 더해 봐요."], a: 2, why: { "0": "비율을 구해 비교하는 것은 알맞은 방법이에요.", "1": "간단한 자연수의 비로 나타내 비교하는 것은 알맞은 방법이에요." } }],
        { bad: "3 : 4의 비율은 [3/4], 4 : 3의 비율은 [4/3]이에요. 0.7 : 0.2는 7 : 2예요.", ok: "2 : 3=4 : 6, [1/2] : [1/3]=3 : 2, 9 : 12=3 : 4가 맞는 비례식이에요. 같은 수를 더하면 비율이 달라져요." }) }
  ],
  challenge: { inst: "또 다른 놀이: 비 카드 14장을 모두 펼쳐 놓고 비례식 7개를 가장 빨리 세워 보세요.", hints: ["먼저 자연수의 비 카드를 간단히 해 두면 짝을 찾기 쉬워요.", "3.4 : 4.9에 10을 곱하면 34 : 49예요."],
    render: (b, a) => rp4Match(b, a, { cards: [4, 9, 0, 13, 6, 11, 2, 8, 1, 12, 5, 10, 3, 7].map(i => RP4_CARDS[i]), timer: true, ok: "비례식 7개를 모두 세웠어요!" }) }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "비례식과 비례배분에 대해 공부한 내용을 잘 알고 있나요?",
  summary: "비의 전항과 후항에 0이 아닌 같은 수를 곱하거나 0이 아닌 같은 수로 나누어도 비율은 같아요. 비율이 같은 두 비를 기호 =로 나타낸 식이 비례식이고, 바깥쪽 두 항은 외항, 안쪽 두 항은 내항이에요. 비례식에서 외항의 곱과 내항의 곱은 같아요. 전체를 주어진 비로 나누는 것을 비례배분이라고 해요.",
  steps: [
    { name: "비의 성질", inst: "1번, 3번 문제예요. 비의 성질을 이용해요.", hints: ["16 : 20을 4로 나누면 4 : 5, 2로 나누면 8 : 10, 4를 곱하면 64 : 80이에요.", "[1/5] : [2/7]에 35를 곱하면 7 : 10이에요."],
      render: (b, a) => rp4Seq(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "1. 16 : 20과 비율이 같은 비를 모두 골라요.", o: ["2 : 5", "4 : 5", "8 : 10", "36 : 40", "64 : 80"], a: [1, 2, 4] }], { bad: "16 : 20의 비율은 [16/20] = [4/5]예요. 36 : 40은 16 : 20에 20을 더한 비예요.", ok: "4 : 5, 8 : 10, 64 : 80이 16 : 20과 비율이 같아요." }),
        (bx, ax) => rp4Chain(bx, ax, [["3. [1/5] : [2/7]=7 : ", { i: "10" }], ["15 : 20=", { i: "3" }, " : 4"]], { ok: "[1/5] : [2/7]=7 : 10, 15 : 20=3 : 4예요." })]) },
    { name: "간단한 자연수의 비", inst: "2번. 간단한 자연수의 비로 나타내 보세요.", hints: ["3.6 : 4.8에 10을 곱하고 12로 나누어요.", "[1 1/6] = [7/6]이에요. 분모 6과 8의 공배수 24를 곱해요."],
      render: (b, a) => rp4Chain(b, a, [
        ["3.6 : 4.8 → ", { r: [3, 4], any: true }], ["[2/5] : [4/9] → ", { r: [9, 10], any: true }],
        ["0.3 : [9/20] → ", { r: [2, 3], any: true }], ["[1 1/6] : [1/8] → ", { r: [28, 3], any: true }]],
        { ok: "예를 들어 3 : 4, 9 : 10, 2 : 3, 28 : 3이에요." }) },
    { name: "비례식의 성질", inst: "4번. 비례식의 성질을 이용하여 □ 안에 알맞은 수를 구해 보세요.", hints: ["9 : 7=45 : □에서 9 × □ = 7 × 45예요.", "32 : □=8 : 4에서 □ × 8 = 32 × 4예요."],
      render: (b, a) => rp4Chain(b, a, [
        ["9 : 7=45 : ", { i: "35" }], ["12 : 63=", { i: "4" }, " : 21"],
        ["", { i: "10" }, " : 4=60 : 24"], ["32 : ", { i: "16" }, "=8 : 4"]],
        { ok: "35, 4, 10, 16이에요. 외항의 곱과 내항의 곱이 같아요." }) },
    { name: "비례배분과 활용", inst: "5번, 6번 문제예요.", hints: ["900 mL를 3 : 2로 나누면 전체를 5만큼 등분해요.", "지도에서 5 cm가 300 m이면 1 cm는 60 m예요."],
      render: (b, a) => rp4Seq(b, a, [
        { title: "5. 하윤이와 시후가 우유 900 mL를 3 : 2로 나누어 마시려고 해요.", run: (bx, ax) => rp4Tape(bx, ax, { N: 900, unit: "mL", snap: 30, ratio: [3, 2], names: ["하윤", "시후"],
          ask: [["하윤: 900 × ", { f: "3/5" }, " = ", { i: "540" }, " (mL)"], ["시후: 900 × ", { f: "2/5" }, " = ", { i: "360" }, " (mL)"]], ok: "하윤이는 540 mL, 시후는 360 mL를 마시면 돼요." }) },
        { title: "6. 은채는 실제 집과 학교 사이의 거리 300 m를 마을 지도에 5 cm로 그렸어요. 학교와 도서관 사이의 거리를 지도에 12 cm로 그렸다면 실제 거리는 몇 m일까요?", run: (bx, ax) => rp4Dbl(bx, ax, { top: { name: "지도 거리", unit: "cm", tick: 1 }, bot: { name: "실제 거리", unit: "m", tick: 60, snap: 60 }, given: [5, 300], askAt: 12, tmax: 15,
          ask: [{ t: "방법 1 비의 성질", p: ["지도 거리의 비 5 : 12에 ", { i: "60" }, "을 곱하면 실제 거리의 비 300 : ", { i: "720" }] },
            { t: "방법 2 비례식의 성질", p: ["5 : 12=300 : □ → 5 × □ = ", { i: "3600" }, ", □ = ", { i: "720" }, " (m)"] }],
          ok: "학교와 도서관 사이의 실제 거리는 720 m예요." }) }]) },
    { name: "확인하고 정리해요", inst: "확인하고 정리해요(자기주도4). 단원에서 배운 내용을 정리해 보세요.", hints: ["비례식 2 : 7=10 : 35에서 바깥쪽은 2와 35예요.", "20을 1 : 3으로 나누면 20 × [1/4]과 20 × [3/4]이에요."],
      render: (b, a) => blanks(b, a, ["비의 전항과 후항에 0이 아닌 같은 수를 곱하여도, 0이 아닌 같은 수로 ", { o: ["나누어도", "더해도"], a: 0 }, " 비율은 같습니다. 2 : 7=10 : 35에서 2와 35를 ", { o: ["외항", "내항"], a: 0 }, ", 7과 10을 ", { o: ["외항", "내항"], a: 1 }, "이라고 하고, 외항의 곱과 내항의 곱은 ", { o: ["같습니다", "다릅니다"], a: 0 }, ". 20을 1 : 3으로 비례배분하면 ", { o: ["5와 15", "10과 10", "1과 3"], a: 0 }, "예요."],
        { ok: "비의 성질, 비례식과 그 성질, 비례배분을 잘 정리했어요. 다음 단원에서는 원의 둘레와 넓이를 배워요." }) }
  ],
  challenge: { inst: "7번. 목공 체험에서 둘레가 210 cm이고 가로와 세로의 비가 3 : 4인 직사각형 모양의 나무판을 만들려고 해요. 나무판의 가로와 세로는 각각 몇 cm일까요? 그리고 이 단원에서 기억에 남는 내용을 정리해 보세요.", hints: ["둘레는 가로와 세로를 두 번씩 더한 길이예요. 가로와 세로의 합은 210 ÷ 2예요.", "가로와 세로의 합 105 cm를 3 : 4로 비례배분해요."],
    render: (b, a) => rp4Seq(b, a, [
      (bx, ax) => rp4Chain(bx, ax, [["가로와 세로의 합: 210 ÷ 2 = ", { i: "105", why: { "210": "둘레 210 cm는 가로와 세로를 두 번씩 더한 길이예요. 둘레를 그대로 나누면 안 돼요." } }, " (cm)"]], { ok: "가로와 세로의 합은 105 cm예요. 이것을 3 : 4로 나눠요." }),
      (bx, ax) => rp4Tape(bx, ax, { N: 105, unit: "cm", snap: 5, ratio: [3, 4], names: ["가로", "세로"],
        ask: [["가로: 105 × ", { f: "3/7" }, " = ", { i: "45" }, " (cm)"], ["세로: 105 × ", { f: "4/7" }, " = ", { i: "60" }, " (cm)"]], ok: "나무판의 가로는 45 cm, 세로는 60 cm예요." }),
      (bx, ax) => writeStep(bx, ax, [
        { q: "이 단원에서 기억에 남는 내용을 나만의 방법(글, 그림, 기호 등)으로 정리해 써 보세요.", tag: "기억에 남는 내용", ph: "예) 비례식에서 외항의 곱과 내항의 곱은 같아요. 그래서 3 : 5=□ : 15는 5 × □ = 45로 풀어요." },
        { q: "생활에서 비례식이나 비례배분을 써 보고 싶은 곳을 써 보세요.", tag: "생활에 쓰기", ph: "예) 친구와 간식을 나눌 때 낸 돈의 비로 비례배분하고 싶어요." }])]) }
}
];
