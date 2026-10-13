//@@APP
const APP={title:"한옥 마을 분수의 곱셈", unit:"5-2 수학 2. 분수의 곱셈(교과서)", key:"t52-fracmul-v1", welcome:"한옥 마을 분수의 곱셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 한옥 마을에서 전통문화를 체험하는 하준이와 사촌 동생 나은이와 함께 분수의 곱셈을 알아봐요."};
//@@UNIT
/* ===== 5-2 2. 분수의 곱셈 단원 조작 부품 (앞글자 fx2) =====
   5-1 「분수의 덧셈과 뺄셈」 부품(분수 표기·입력·채점)을 바탕으로 곱셈에 맞게 고쳤어요.
   글 속 분수 표기: [3/7] 진분수·가분수, [2 1/4] 대분수, [□/5]·[3+5/7](분자에 식)도 됨.
   채점은 값으로 해요: 약분하지 않은 분수, 가분수, 대분수 모두 정답이에요(지도서 채점 원칙). */
/*fx2-core*/
const FX2_SRC = "\\[(?:(\\d+|□) )?([0-9□]+(?:[+−×-][0-9□]+)*)\\/([0-9□]+(?:×[0-9□]+)*)\\]";
const fx2Re = () => new RegExp(FX2_SRC, "g");
/* 칸에 쓴 글(자연수·분자·분모) → 수 */
function fx2Raw(ws, ns, ds) {
  const t = v => String(v == null ? "" : v).replace(/\s/g, "");
  const W = t(ws), N = t(ns), D = t(ds);
  if (!W && !N && !D) return { err: "empty" };
  if ([W, N, D].some(x => x && !/^\d+$/.test(x))) return { err: "bad" };
  if ((N && !D) || (!N && D)) return { err: "half" };
  const w = W ? +W : 0;
  if (!N) return { w, n: 0, d: 0, hasW: true, hasF: false, num: w, den: 1 };
  const n = +N, d = +D;
  if (d === 0) return { err: "bad" };
  return { w, n, d, hasW: !!W, hasF: true, num: w * d + n, den: d };
}
/* "2 1/4" · "9/4" · "3" · "[2 1/4]" → 수 */
function fx2Str(s) {
  s = String(s).trim().replace(/^\[|\]$/g, "").trim();
  let m = s.match(/^(\d+)$/); if (m) return fx2Raw(m[1], "", "");
  m = s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/); if (m) return fx2Raw(m[1] || "", m[2], m[3]);
  return null;
}
const fx2Eq = (a, b) => a.num * b.den === b.num * a.den;
const fx2G = (a, b) => b ? fx2G(b, a % b) : Math.abs(a);
function fx2R(num, den) { const g = fx2G(num, den) || 1; return { num: num / g, den: den / g }; }
/* 분모가 den인 교과서 꼴: 대분수(자연수) */
function fx2Form(num, den) { const w = Math.floor(num / den), r = num % den; return r === 0 ? String(w) : w === 0 ? `${r}/${den}` : `${w} ${r}/${den}`; }
const fx2Tk = s => /\//.test(String(s)) ? `[${s}]` : String(s);
/* 교과서 답 표기: 대분수(=가분수) */
function fx2Book(num, den) {
  const m = fx2Form(num, den), imp = `[${num}/${den}]`;
  if (num % den === 0) return num > 0 && den > 1 ? `${m} (=${imp})` : m;
  return num > den ? `${fx2Tk(m)} (=${imp})` : fx2Tk(m);
}
/* 끝 글자(분수는 분자) 받침에 맞는 '이에요/예요' */
const fx2Ie = num => "013678".includes(String(num).slice(-1)) ? "이에요" : "예요";
/* 식 계산: "[1 1/5]×3", "[3/5]×[1/2]×[3/4]", "(3×1)+(3×[1/4])", "[2/3]+[2/3]" — 괄호, × ÷ 를 + − 보다 먼저 */
function fx2Eval(e) {
  const src = String(e).replace(/−/g, "-").replace(/\s+/g, " ").trim(); let i = 0;
  const sp = () => { while (src[i] === " ") i++; };
  const mul = (x, y) => fx2R(x.num * y.num, x.den * y.den), add = (x, y, sg) => fx2R(x.num * y.den + sg * y.num * x.den, x.den * y.den);
  function atom() {
    sp();
    if (src[i] === "(") { i++; const v = expr(); sp(); if (src[i] !== ")") throw 0; i++; return v; }
    if (src[i] === "[") { const j = src.indexOf("]", i); if (j < 0) throw 0; const v = fx2Str(src.slice(i, j + 1)); if (!v || v.err) throw 0; i = j + 1; return fx2R(v.num, v.den); }
    const m = src.slice(i).match(/^\d+/); if (!m) throw 0; i += m[0].length; return fx2R(+m[0], 1);
  }
  function term() { let v = atom(); for (;;) { sp(); const c = src[i]; if (c === "×" || c === "*") { i++; v = mul(v, atom()); } else if (c === "÷") { i++; const w = atom(); if (!w.num) throw 0; v = mul(v, fx2R(w.den, w.num)); } else return v; } }
  function expr() { let v = term(); for (;;) { sp(); const c = src[i]; if (c === "+" || c === "-") { i++; v = add(v, term(), c === "+" ? 1 : -1); } else return v; } }
  try { const v = expr(); sp(); return i === src.length ? v : null; } catch (err) { return null; }
}
function fx2Den(s) { const m = String(s || "").match(/\/(\d+)\]?/); return m ? +m[1] : 0; }
/* 받침에 맞는 조사(분수는 분자를 마지막에 읽으므로 분자의 끝 숫자 기준): fx2J("[3/7]", "은는") → "[3/7]은" */
function fx2J(s, pair) {
  const str = String(s), core = str.replace(/\/[0-9□]+\]/g, "]"), digits = core.replace(/[^0-9]/g, ""), c = /[0-9]\]?$/.test(core) ? digits[digits.length - 1] : core.replace(/\]$/, "").slice(-1);
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"] };
  const [a, b] = M[pair];
  if (pair === "으로") return str + (has && !rieul ? a : b);
  return str + (has ? a : b);
}
/* 학생 답 판정: 값이 같으면 정답(약분 안 한 분수·가분수·대분수 모두). 분수 부분이 1 이상인 대분수만 다시 */
function fx2Judge(r, a) {
  if (r.err === "empty") return { code: "empty", msg: "빈칸에 답을 써요." };
  if (r.err === "half") return { code: "half", msg: "분수는 분자와 분모를 모두 써요." };
  if (r.err) return { code: "bad", msg: "칸에는 수만 써요." };
  const t = fx2Str(a);
  if (!fx2Eq(r, t)) return { code: "wrong" };
  if (r.hasF && r.hasW && r.n >= r.d) return { code: "improper", msg: `값은 맞아요. 그런데 분수 부분 ${fx2J(`[${r.n}/${r.d}]`, "은는")} 1이거나 1보다 커요. 1만큼을 자연수 부분으로 옮겨 대분수로 쓰거나, 가분수로 써요.` };
  if (r.hasF && r.n === 0) return { code: "zero", msg: "분자가 0이면 자연수만 써요." };
  return { code: "ok" };
}
function fx2Key(r) { return r.err ? "" : r.hasF ? (r.hasW ? `${r.w} ${r.n}/${r.d}` : `${r.n}/${r.d}`) : String(r.w); }
/* 유리수 셈 */
const fx2Q = (num, den) => fx2R(num, den);
const fx2Add = (x, y, s = 1) => fx2R(x.num * y.den + s * y.num * x.den, x.den * y.den);
const fx2Lcm = (a, b) => a / fx2G(a, b) * b;
/* 흔한 실수 찾기 (두 수의 곱셈) — 지도서 오개념 */
function fx2Diag(e, r) {
  if (!e || !r || r.err) return null;
  const m = String(e).match(/^\s*(\[[^\]]+\]|\d+)\s*×\s*(\[[^\]]+\]|\d+)\s*$/); if (!m) return null;
  const A = fx2Str(m[1]), B = fx2Str(m[2]); if (!A || !B || A.err || B.err) return null;
  const T = fx2Q(A.num * B.num, A.den * B.den), eq = v => fx2Eq(r, v) && !fx2Eq(T, v);
  const mixed = X => X.hasF && X.w > 0, prop = X => X.hasF && !X.w, whole = X => !X.hasF;
  /* 대분수의 분모와 자연수를 바로 약분 */
  for (const [M, K] of [[A, B], [B, A]]) if (mixed(M) && whole(K)) {
    const g = fx2G(M.d, K.w);
    if (g > 1 && eq(fx2Q((M.w * (M.d / g) + M.n) * (K.w / g), M.d / g))) return "대분수의 분모와 자연수를 바로 약분하면 안 돼요. 대분수를 가분수로 바꾼 다음 약분해요.";
    if (eq(fx2Q(M.w * K.w * M.d + M.n, M.d))) return "자연수 부분에만 곱했어요. 진분수 부분에도 자연수를 곱해야 해요.";
  }
  /* 진분수 부분끼리만 약분 */
  if (mixed(A) && mixed(B)) {
    const g1 = fx2G(A.n, B.d), g2 = fx2G(B.n, A.d);
    if (g1 * g2 > 1) { const a2 = fx2Q(A.w * (A.d / g2) + A.n / g1, A.d / g2), b2 = fx2Q(B.w * (B.d / g1) + B.n / g2, B.d / g1); if (eq(fx2Q(a2.num * b2.num, a2.den * b2.den))) return "대분수를 가분수로 나타내지 않고 진분수 부분끼리 약분했어요. 먼저 대분수를 가분수로 바꾸어요."; }
    if (eq(fx2Q(A.w * B.w * A.d * B.d + A.n * B.n, A.d * B.d))) return "자연수는 자연수끼리, 진분수는 진분수끼리만 곱하면 안 돼요. 가분수로 바꾸어 곱하거나, 곱하는 대분수를 자연수와 진분수로 나누어 각각 곱한 다음 더해요.";
  }
  /* 분모에도 자연수를 곱함 */
  for (const [F, K] of [[A, B], [B, A]]) if (F.hasF && whole(K) && K.w > 1 && eq(fx2Q(F.num, F.den * K.w))) return "분모에는 곱하지 않아요. 분모는 그대로 쓰고 분자에 자연수를 곱해요.";
  /* 분수끼리 더함 */
  if (A.hasF && B.hasF && eq(fx2Q(A.num * B.den + B.num * A.den, A.den * B.den))) return "두 분수를 더했어요. 곱셈은 분자는 분자끼리, 분모는 분모끼리 곱해요.";
  if (prop(A) && prop(B) && eq(fx2Q(A.n * B.n, A.d + B.d))) return "분모끼리 더하면 안 돼요. 분모도 분모끼리 곱해요.";
  return null;
}
/* 읽기 글: [3/7] → 7분의 3, [2 1/4] → 2와 4분의 1 */
function fx2Plain(s) {
  return String(s == null ? "" : s).replace(fx2Re(), (m, w, n, d) => `${w ? w + "와 " : ""}${d}분의 ${n}`);
}
/*fx2-core-end*/

function fx2Style() {
  if (document.getElementById("fx2-style")) return;
  const s = document.createElement("style"); s.id = "fx2-style";
  s.textContent = `
.fx2fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.fx2fw{margin-right:.1em}
.fx2q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.fx2q>.fx2n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.fx2q>.fx2d{padding:.05em .14em 0}
.fx2frin .fx2q{font-size:.92em}
.fx2frin .fx2n{padding-bottom:.14em}.fx2frin .fx2d{padding-top:.14em}
.fx2inp{display:inline-flex;align-items:center;gap:.15em;vertical-align:middle}
.fx2qi{display:inline-flex;flex-direction:column;align-items:stretch;gap:.12em}
.fx2bar{display:block;height:.17em;background:var(--ink);border-radius:.1em}
input.fx2i,input.fx2box{box-sizing:border-box;width:2.3em;height:1.65em;padding:0;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.fx2iw{height:2.1em;width:2.1em}
input.fx2box.fx2wide{width:3.6em}
.fx2eq{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .45em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin-top:.25em}
.fx2lab{color:var(--pine)}
.fx2res{color:var(--ok);font-size:.85em}
.fx2cl{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .3em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin:.4em 0;line-height:1.9}
.fx2tag{background:var(--pine-soft);color:var(--pine);border-radius:.5em;padding:0 .55em;font-size:.82em}
.fx2chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.fx2chs .opt{padding:.05em .55em}
.fx2stage{margin:.2em 0 .4em}
.fx2stage svg{width:100%;height:auto;max-height:66vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.fx2tip{font-family:Jua,sans-serif;color:var(--night);margin:.3em 0}
.fx2tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.4em 0}
.fx2tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em}
.fx2tools button.fx2on{background:var(--night);color:#fff;border-color:var(--night)}
.fx2est{background:var(--ring-soft);border-radius:.6em;padding:.4em .7em;margin-bottom:.4em}
.fx2ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.fx2grp{border:2px solid var(--line);border-radius:.8em;padding:.4em .7em;margin:.45em 0}
.fx2grp .fx2gt{font-family:Jua,sans-serif;color:var(--night)}
.fx2grp .fx2gi{display:inline-flex;flex-wrap:wrap;align-items:center;gap:.3em;margin:.25em 1.2em .25em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08)}
.fx2pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:2.6em;margin:.3em 0 .6em}
.fx2bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,11em),1fr));gap:.6em}
.fx2bin{border:2px dashed var(--line);border-radius:.8em;padding:.4em;min-height:5em;display:flex;flex-direction:column;gap:.35em}
.fx2binh{font-family:Jua,sans-serif;background:var(--pine-soft);color:var(--pine);border:0;border-radius:.6em;padding:.3em .6em}
.fx2binl{display:flex;flex-wrap:wrap;gap:.35em}
.opt.fx2on{border-color:var(--ring);background:var(--ring-soft)}
.fx2crd{font-family:Jua,sans-serif}
.fx2mt{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.6em 1.4em;align-items:start}
.fx2mc{display:flex;flex-direction:column;gap:.5em}
.fx2mc .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);text-align:center}
.fx2badge{display:inline-grid;place-items:center;min-width:1.5em;height:1.5em;border-radius:50%;color:#fff;font-size:.8em;margin-left:.3em}
.fx2cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.fx2cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2em;text-align:center}
.fx2slot{min-width:1.7em;min-height:1.5em;font-family:Jua,sans-serif;border:2px dashed var(--ring);border-radius:.4em;background:#fff;padding:0 .2em}
.fx2lad{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.fx2lad>*{display:flex;flex-direction:column;align-items:center;gap:.25em;padding:0 .15em;text-align:center}
.fx2lad .opt{font-family:Jua,sans-serif;width:100%;text-align:center;padding:.35em .2em}
.fx2house{font-family:Jua,sans-serif;color:var(--pine);font-size:.9em}
.fx2lsvg svg{width:100%;height:auto;display:block}
.fx2score{width:100%;border-collapse:collapse;font-size:var(--fs-s);margin-top:.4em}
.fx2score td,.fx2score th{border:1px solid var(--line);padding:.2em .35em;text-align:center}
.fx2score th{background:var(--pine-soft);font-weight:400;font-family:Jua,sans-serif}
.fx2card2{border:3px solid var(--night);border-radius:var(--r);padding:.5em .8em;background:#fff;display:flex;flex-wrap:wrap;gap:.4em 1.6em;margin:.3em 0}
.fx2card2>div{min-width:12em}
.fx2card2 b{color:var(--pine);font-family:Jua,sans-serif;font-weight:400}
`;
  document.head.append(s);
}
/* 분수 모양 요소 */
function fx2FracEl(w, n, d) {
  return h("span", { class: "fx2fr" }, w != null && w !== "" ? h("span", { class: "fx2fw" }, String(w)) : null,
    h("span", { class: "fx2q" }, h("span", { class: "fx2n" }, String(n)), h("span", { class: "fx2d" }, String(d))));
}
function fx2RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = fx2Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(fx2FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function fx2RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return fx2RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(fx2RenderText);
}
(function fx2Boot() {
  fx2Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") fx2RenderText(m.target); else m.addedNodes.forEach(fx2RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(fx2Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
/* 엔진 부품의 '답 따라 쓰기' 글은 읽는 말(7분의 3)로 바꿔 줌 */
function fx2A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(fx2Plain) }) }); }
const fx2Quiz0 = quiz, fx2Blanks0 = blanks;
quiz = (b, a, items, o) => fx2Quiz0(b, fx2A(a), items, o);
blanks = (b, a, parts, o) => fx2Blanks0(b, fx2A(a), parts, o);

function fx2Gate(api, ready, msg) {
  return Object.assign({}, api, { done: (ans, m, lv) => ready() ? api.done(ans, m, lv) : api.fail(typeof msg === "function" ? msg() : msg, ans) });
}
const FX2_F = ["#F6C08A", "#9CC6EC", "#A9D8A2", "#D7B5E6"], FX2_S = ["#D9822B", "#2B7BD6", "#2E8B57", "#8E5BC9"];
/* SVG 글: [분수] 표기를 쌓은 분수로 그림 */
function fx2Cw(ch, s) { return /[가-힣]/.test(ch) ? s * .95 : /[0-9]/.test(ch) ? s * .56 : ch === " " ? s * .3 : /[A-Za-z]/.test(ch) ? s * .55 : s * .6; }
function fx2Segs(str) {
  const out = []; let last = 0; const re = fx2Re(); let m;
  while ((m = re.exec(str))) { if (m.index > last) out.push({ t: str.slice(last, m.index) }); out.push({ w: m[1], n: m[2], d: m[3] }); last = m.index + m[0].length; }
  if (last < str.length) out.push({ t: str.slice(last) });
  return out;
}
function fx2SvgLine(str, x, y, size = 24, opt = {}) {
  const g = svgEl("g", { "pointer-events": "none" }), fs = size * .8, fill = opt.fill || INK;
  const tw = t => [...t].reduce((a, c) => a + fx2Cw(c, size), 0);
  const fw = s => Math.max(String(s.n).length, String(s.d).length) * fs * .6 + 8;
  const segs = fx2Segs(String(str));
  const wid = s => s.t != null ? tw(s.t) : (s.w ? tw(s.w) + 3 : 0) + fw(s);
  const total = segs.reduce((a, s) => a + wid(s), 0);
  let cx = opt.anchor === "start" ? x : opt.anchor === "end" ? x - total : x - total / 2;
  const T = (xx, yy, t, sz) => txt(xx, yy, t, sz, { "text-anchor": "start", fill, style: "white-space:pre" });
  segs.forEach(s => {
    const ww = wid(s);
    if (s.t != null) g.append(T(cx, y, s.t, size));
    else {
      let fx = cx;
      if (s.w) { g.append(T(fx, y, s.w, size)); fx += tw(s.w) + 3; }
      const f = fw(s), mid = fx + f / 2;
      g.append(txt(mid, y - fs * .6, s.n, fs, { fill }), svgEl("line", { x1: fx + 2, y1: y, x2: fx + f - 2, y2: y, stroke: fill, "stroke-width": Math.max(1.6, size / 13) }), txt(mid, y + fs * .64, s.d, fs, { fill }));
    }
    cx += ww;
  });
  return g;
}

/* 분수 입력칸(자연수 □ + 분자/분모) */
function fx2In(label) {
  const mk = (cls, al) => {
    const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "fx2i " + cls, "aria-label": (label ? fx2Plain(label) + " " : "") + al });
    i.addEventListener("input", () => { const v = i.value.replace(/[^0-9]/g, "").slice(0, 4); if (v !== i.value) i.value = v; });
    return i;
  };
  const w = mk("fx2iw", "자연수 부분"), n = mk("fx2in", "분자"), d = mk("fx2id", "분모");
  const el = h("span", { class: "fx2inp" }, w, h("span", { class: "fx2qi" }, n, h("span", { class: "fx2bar" }, "​"), d));
  el.get = () => fx2Raw(w.value, n.value, d.value);
  el.paint = ok => [w, n, d].forEach(x => { x.style.borderColor = ok == null ? "" : ok ? "var(--ok)" : "var(--no)"; });
  el.text = () => { const r = el.get(); return r.err ? "-" : fx2Key(r); };
  return el;
}
function fx2Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 4, class: "fx2box", "aria-label": "빈칸" });
  i.exp = String(exp);
  return i;
}
/* 어림 상자 */
function fx2EstBox(api, e, onOk) {
  const row = h("div", { class: "opts" });
  e.o.forEach((c, i) => row.append(h("button", { class: "opt", onclick: ev => {
    [...row.children].forEach(x => x.classList.remove("good", "bad", "on"));
    if (i === e.a) { ev.currentTarget.classList.add("good"); onOk(); api.hint(e.ok || "좋아요. 이제 정확하게 구해 봐요."); }
    else { ev.currentTarget.classList.add("bad"); api.fail((e.why && e.why[i]) || "자연수 부분만 보고 어림해 봐요.", "[어림] " + c); }
  } }, c)));
  return h("div", { class: "fx2est" }, h("div", { class: "jua" }, "먼저 어림해요 · " + e.q), row);
}

/* ① 식과 답 (분수 답은 같은 분모의 가분수·대분수·자연수 모두 정답, 약분한 답은 '값은 같아요' 안내)
   items: {q?, e:"[3/8]+[4/8]" (보이는 식) | x (확인용 식), a:"7/8", unit, den, why:{"학생 답":"까닭"}, lab, g:"묶음 제목"}
          | {q, e|x, n: 수} | {q, pick:[…], a: 번호, why:{번호:"까닭"}}  */
function fx2Calc(body, api, items, opt = {}) {
  fx2Style();
  const rows = []; const wrap = h("div");
  let grp = null, gName = null;
  items.forEach((it, k) => {
    const R = { it }; const ex = it.e || it.x;
    let host;
    if (it.g) {
      if (it.g !== gName) { gName = it.g; grp = h("div", { class: "fx2grp" }, h("div", { class: "fx2gt" }, it.g)); wrap.append(grp); }
      host = h("span", { class: "fx2gi" }); grp.append(host);
    } else {
      gName = null; const box = h("div", { class: "qitem" });
      if (it.q) box.append(h("div", { class: "jua" }, (items.filter(x => !x.g).length > 1 ? (k + 1) + ". " : "") + it.q));
      host = h("div", { class: "fx2eq" }); box.append(host); wrap.append(box);
    }
    if (it.pick) {
      R.kind = "pick"; R.sel = null;
      const row = h("span", { class: "opts" });
      it.pick.forEach((o, oi) => row.append(h("button", { class: "opt", onclick: ev => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); R.sel = oi; } }, o)));
      R.row = row; if (it.e) host.append(h("span", {}, it.e)); host.append(row);
    } else if (it.n != null) {
      R.kind = "n";
      if (ex && !it.noEval) { const v = fx2Eval(ex); if (!v || v.num !== it.n * v.den) throw new Error(`답 확인 필요: ${ex} = ${it.n}`); }
      R.inp = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "fx2box fx2wide", "aria-label": fx2Plain(it.lab || it.e || it.q || "답") });
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "fx2lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    } else {
      R.kind = "f";
      R.t = fx2Str(it.a); if (!R.t || R.t.err) throw new Error("답 형식 오류: " + it.a);
      R.den = it.den || fx2Den(it.a) || 1;
      if (ex && !it.noEval) { const v = fx2Eval(ex); if (!v || !fx2Eq(v, R.t)) throw new Error(`답 확인 필요: ${ex} = ${it.a}`); }
      R.inp = fx2In(it.lab || it.e || "답");
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "fx2lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    }
    R.res = h("span", { class: "fx2res hidden" }, "​"); host.append(R.res);
    rows.push(R);
  });
  const ansText = R => {
    const head = fx2Plain(R.it.e || R.it.lab || "답");
    if (R.kind === "pick") return `${fx2Plain(R.it.q || R.it.e || "")} ${fx2Plain(R.it.pick[R.it.a])}`.trim();
    if (R.kind === "n") return `${head} ${R.it.n}${R.it.unit ? " " + R.it.unit : ""}`;
    return `${head} ${fx2Plain(fx2Tk(R.it.a))}${R.it.unit ? " " + R.it.unit : ""}`;
  };
  api.provide({ words: opt.words || ["분모는 그대로", "분자에 자연수를 곱하기", "분자는 분자끼리", "분모는 분모끼리", "가분수로 바꾸기", "약분", "대분수"], answers: rows.map(ansText) });
  const btn = h("button", { class: "big", onclick: () => {
    let bad = null, hint = null; const given = [];
    rows.forEach(R => {
      const it = R.it;
      if (R.kind === "pick") {
        const g = R.sel === it.a; [...R.row.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === R.sel) b.classList.add(g ? "good" : "bad"); });
        given.push(R.sel == null ? "-" : fx2Plain(it.pick[R.sel]));
        if (!g && !bad) bad = R.sel == null ? "고르지 않은 문제가 있어요." : (it.why && it.why[R.sel]) || "고른 것을 다시 살펴봐요.";
        return;
      }
      if (R.kind === "n") {
        const s = R.inp.value.replace(/[\s,]/g, ""), g = /^\d+$/.test(s) && +s === it.n;
        R.inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; given.push(s || "-");
        if (!g && !bad) bad = s === "" ? "빈칸에 답을 써요." : (it.why && it.why[s]) || opt.bad || "다시 생각해 봐요.";
        return;
      }
      const r = R.inp.get(), J = fx2Judge(r, it.a, R.den); given.push(R.inp.text());
      if (J.code === "ok") { R.inp.paint(true); return; }
      if (J.code === "diffden" || J.code === "zero" || J.code === "improper") { R.inp.paint(null); if (!hint) hint = J.msg; return; }
      R.inp.paint(false);
      if (!bad) bad = (it.why && it.why[fx2Key(r)]) || J.msg || fx2Diag(it.e || it.x, r) || opt.bad || "분자는 분자끼리, 분모는 분모끼리 곱했는지 다시 살펴봐요. 대분수는 가분수로 바꾸어 계산해요.";
    });
    if (bad) return api.fail(bad, given.join(" / "));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + fx2Book(num, den); R.res.classList.remove("hidden"); } });
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요! 약분하지 않아도, 가분수로 써도, 대분수로 써도 맞아요.");
  } }, "확인하기");
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, btn));
}
/* ② 차례대로 빈칸 채우기 (계산 과정)
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 수 칸 | {q:[자연수, 분자, 분모]} 각 자리는 고정값·"?답"(칸)·배열(분자에 ["?3","+","?2"]) | {f:"4 2/5"} 분수 입력(값 판정) | {c:[…], a}
   '='가 있고 한글이 없는 줄은 '='로 나눈 값이 모두 같은지 스스로 확인해요. */
function fx2Chain(body, api, rows, opt = {}) {
  fx2Style();
  const ins = [], chs = [], plains = [], pairs = [];
  const wrap = h("div");
  const ex = v => v == null ? "" : Array.isArray(v) ? v.map(ex).join("") : String(v)[0] === "?" ? String(v).slice(1) : String(v);
  const jsNum = v => ex(v).replace(/−/g, "-").replace(/×/g, "*");
  const jsStr = s => String(s).replace(fx2Re(), (m, w, n, d) => `(${w && w !== "□" ? w : 0}+(${n.replace(/−/g, "-")})/(${d}))`).replace(/−/g, "-").replace(/×/g, "*");
  const cell = v => {
    if (v == null) return null;
    if (Array.isArray(v)) return h("span", { style: "display:inline-flex;align-items:center;gap:.1em" }, v.map(cell));
    if (String(v)[0] === "?") { const b = fx2Box(String(v).slice(1)); ins.push(b); return b; }
    return h("span", {}, String(v));
  };
  rows.forEach(row => {
    const parts = Array.isArray(row) ? row : row.p;
    const line = h("div", { class: "fx2cl" });
    if (row.t) line.append(h("span", { class: "fx2tag" }, row.t));
    let plain = row.t ? row.t + " " : "", js = "", hangul = false;
    parts.forEach(pt => {
      if (typeof pt === "string" || typeof pt === "number") {
        const s = String(pt); line.append(h("span", {}, s)); plain += fx2Plain(s) + " "; js += jsStr(s); if (/[가-힣□]/.test(s)) hangul = true;
      } else if (pt.i != null) {
        const b = fx2Box(pt.i); ins.push(b); line.append(b); plain += pt.i + " "; js += `(${pt.i})`;
      } else if (pt.q) {
        const [W, N, D] = pt.q, n0 = ins.length;
        line.append(h("span", { class: "fx2fr fx2frin" }, W != null ? h("span", { class: "fx2fw" }, cell(W)) : null, h("span", { class: "fx2q" }, h("span", { class: "fx2n" }, cell(N)), h("span", { class: "fx2d" }, cell(D)))));
        /* 분자·분모가 모두 빈칸이면 값이 같은 다른 꼴(약분 덜 함·더 함)을 알아봐요 */
        if (W == null && [N, D].every(v => typeof v === "string" && v[0] === "?")) pairs.push([ins[n0], ins[n0 + 1]]);
        plain += fx2Plain(`[${W != null ? ex(W) + " " : ""}${ex(N)}/${ex(D)}]`) + " ";
        js += `(${W != null ? jsNum(W) : 0}+(${jsNum(N)})/(${jsNum(D)}))`;
      } else if (pt.f) {
        const fi = fx2In("답"); fi.target = pt.f; fi.den = pt.den || fx2Den(pt.f) || 0; ins.push(fi); line.append(fi);
        plain += fx2Plain(fx2Tk(pt.f)) + " "; const v = fx2Str(pt.f); js += `(${v.num}/${v.den})`;
      } else if (pt.c) {
        const C = { a: pt.a, sel: null }; const sp = h("span", { class: "fx2chs" });
        pt.c.forEach((o, oi) => sp.append(h("button", { class: "opt", onclick: ev => { [...sp.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); C.sel = oi; } }, o)));
        C.el = sp; chs.push(C); line.append(sp); plain += fx2Plain(pt.c[pt.a]) + " "; hangul = true;
      }
    });
    wrap.append(line); plains.push(plain.replace(/\s+/g, " ").trim());
    if (!hangul && js.includes("=")) {
      const vals = js.split("=").filter(s => s.trim()).map(s => { try { return Function(`return (${s})`)(); } catch (e) { return NaN; } });
      if (vals.some(v => !isFinite(v) || Math.abs(v - vals[0]) > 1e-9)) throw new Error("식 확인 필요: " + plain);
    }
  });
  api.provide({ words: opt.words || ["분모는 그대로", "분자에 자연수를 곱하기", "분자는 분자끼리", "분모는 분모끼리", "가분수로 바꾸기", "약분"], answers: plains });
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    let ok = true, hint = null; const given = [];
    const same = new Set();
    pairs.forEach(([nb, db]) => { const a = nb.value.trim(), b = db.value.trim();
      if (/^\d+$/.test(a) && /^[1-9]\d*$/.test(b) && !(a === nb.exp && b === db.exp) && +a * +db.exp === +b * +nb.exp) { same.add(nb); same.add(db);
        hint = hint || (fx2G(+nb.exp, +db.exp) === 1 ? "값은 맞아요. 그런데 더 약분할 수 있어요. 분모와 분자를 최대공약수로 나누어 기약분수로 나타내요." : "값은 맞아요. 그런데 이 칸에는 약분하기 전의 분수를 써요."); } });
    ins.forEach(x => {
      if (same.has(x)) { x.style.borderColor = ""; given.push(x.value.trim()); return; }
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = fx2Judge(x.get(), x.target, x.den); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "diffden" || J.code === "zero" || J.code === "improper") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
    });
    chs.forEach(C => { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(C.sel === C.a ? "good" : "bad"); }); if (C.sel !== C.a) ok = false; given.push(C.sel == null ? "-" : C.el.children[C.sel].textContent); });
    if (!ok) return api.fail(opt.bad || "빨간 칸을 다시 생각해 봐요.", given.join(","));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce(); api.done(given.join(","), opt.ok || "차례대로 잘 계산했어요!");
  } }, "확인하기")));
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 */
function fx2Ask(host, api, ready, msg, opt) {
  const g = fx2Gate(api, ready, msg);
  if (opt.ask) return fx2Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad });
  if (opt.askCalc) return fx2Calc(host, g, opt.askCalc, { ok: opt.ok });
  api.provide({ words: [], answers: [] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { api.tryOnce(); ready() ? api.done("조작 완료", opt.ok) : api.fail(typeof msg === "function" ? msg() : msg, "-"); } }, "확인하기")));
}

/* ③ 막대 색칠하기: bars [{name, k, col}]  opt: d, ask(줄)·askCalc, ok */
function fx2Bars(body, api, opt) {
  fx2Style();
  const d = opt.d, bars = opt.bars, W = 900, LX = 210, BW = 660, BH = 62, GP = 42, H = bars.length * (BH + GP) + 14;
  const st = bars.map(() => Array(d).fill(false));
  const svg = makeSvg(W, H);
  const cnt = i => st[i].filter(Boolean).length;
  const draw = () => {
    svg.innerHTML = "";
    bars.forEach((b, i) => {
      const y = 22 + i * (BH + GP), col = b.col != null ? b.col : i, ok = cnt(i) === b.k;
      svg.append(fx2SvgLine(b.name, LX - 18, y + BH / 2 - 9, 25, { anchor: "end" }));
      svg.append(fx2SvgLine(`색칠 ${cnt(i)}칸`, LX - 18, y + BH / 2 + 22, 17, { anchor: "end", fill: ok ? "#2E8B57" : "#5B6B6B" }));
      for (let c = 0; c < d; c++) {
        const r = svgEl("rect", { x: LX + c * BW / d, y, width: BW / d, height: BH, fill: st[i][c] ? FX2_F[col % 4] : "#fff", stroke: INK, "stroke-width": 2, style: "cursor:pointer" });
        r.addEventListener("click", () => { st[i][c] = !st[i][c]; draw(); });
        svg.append(r);
      }
      svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
    });
  };
  draw();
  const ready = () => bars.every((b, i) => cnt(i) === b.k);
  const ask = h("div", { class: "fx2ask" });
  body.append(h("p", { class: "fx2tip" }, opt.tip || "칸을 누르면 색칠되고, 한 번 더 누르면 지워져요."), h("div", { class: "fx2stage" }, svg), ask);
  fx2Ask(ask, api, ready, () => { const i = bars.findIndex((b, k) => cnt(k) !== b.k); return `먼저 ‘${fx2Plain(bars[i].name)}’ 막대를 알맞게 색칠해요. 지금 ${cnt(i)}칸이에요.`; }, opt);
}
/* ⑦ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function fx2Sort(body, api, opt) {
  fx2Style();
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "fx2pool" }), binsEl = h("div", { class: "fx2bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "fx2binl" }); binsEl.append(h("div", { class: "fx2bin", onclick: e => { if (e.target.closest(".fx2crd")) return; put(bi); } }, h("button", { class: "fx2binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt fx2crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  function draw() { els.forEach((el, ci) => { el.classList.toggle("fx2on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => fx2Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "fx2tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (where.some(w => w < 0)) return api.fail("아직 넣지 않은 카드가 있어요.", "-");
      let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
      if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); return api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); }
      api.tryOnce(); api.done(given, opt.ok);
    } }, "확인하기")));
}

/* ⑧ 관계있는 것끼리 잇기: left [{t,k}], right [{t,k|null}] (값을 계산해 짝이 맞는지 스스로 확인) */
function fx2Match(body, api, opt) {
  fx2Style();
  const L = opt.left, R = opt.right, pair = L.map(() => -1); let sel = null;
  L.forEach(l => { const v = fx2Eval(l.t); R.forEach(r => { const w = fx2Eval(r.t); if (!v || !w || fx2Eq(v, w) !== (r.k === l.k)) throw new Error("잇기 확인 필요: " + l.t + " / " + r.t); }); });
  const COL = ["#2B7BD6", "#D9822B", "#2E8B57"];
  const lb = L.map((l, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; draw(); } }, l.t));
  const rb = R.map((r, j) => h("button", { class: "opt", onclick: () => { if (sel == null) return api.hint("먼저 왼쪽 식을 눌러요."); pair[sel] = pair[sel] === j ? -1 : j; sel = null; draw(); } }, r.t));
  const badge = (i) => h("span", { class: "fx2badge", style: `background:${COL[i % 3]}` }, String(i + 1));
  function draw() {
    lb.forEach((b, i) => { b.classList.toggle("fx2on", sel === i); b.classList.remove("good", "bad"); [...b.querySelectorAll(".fx2badge")].forEach(x => x.remove()); b.append(badge(i)); });
    rb.forEach((b, j) => { b.classList.remove("good", "bad"); [...b.querySelectorAll(".fx2badge")].forEach(x => x.remove()); pair.forEach((p, i) => { if (p === j) b.append(badge(i)); }); });
  }
  draw();
  api.provide({ words: [], answers: L.map(l => `${fx2Plain(l.t)} — ${fx2Plain(R.find(r => r.k === l.k).t)}`) });
  body.append(h("p", { class: "fx2tip" }, "왼쪽 식을 누르고, 값이 같은 오른쪽 식을 눌러 이어요. 짝이 없는 식도 있어요."),
    h("div", { class: "fx2mt" }, h("div", { class: "fx2mc" }, lb), h("div", { class: "fx2mc" }, rb)),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (pair.some(p => p < 0)) return api.fail("왼쪽 식을 모두 이어요.", "-");
      let ok = true; pair.forEach((p, i) => { const g = R[p].k === L[i].k; lb[i].classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = pair.map((p, i) => `${i + 1}-${p + 1}`).join(", ");
      if (!ok) return api.fail("값을 계산해 보고 다시 이어요. 가분수와 대분수 중 편리한 꼴로 바꾸어 비교해요.", given);
      api.tryOnce(); api.done(given, opt.ok || "값이 같은 식끼리 잘 이었어요!");
    } }, "확인하기")));
}


/* ===== 곱셈 단원 조작 부품 ===== */
function fx2Style2() {
  if (document.getElementById("fx2-style2")) return;
  const s = document.createElement("style"); s.id = "fx2-style2";
  s.textContent = `
.fx2ctl{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.35em 0}
.fx2ctl button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em}
.fx2ctl button.fx2act{background:var(--night);color:#fff;border-color:var(--night)}
.fx2ctl .fx2num{font-family:Jua,sans-serif;min-width:2.2em;text-align:center;font-size:calc(var(--fs)*1.15)}
.fx2rd{font-family:Jua,sans-serif;color:var(--night);margin:.25em 0;min-height:1.4em}
.fx2rd.fx2good{color:var(--ok)}
.fx2cond{border:2px solid var(--line);border-radius:.8em;padding:.4em .7em;margin:.4em 0;font-family:Jua,sans-serif}
.fx2cond div{margin:.15em 0}
.fx2board{display:flex;flex-wrap:wrap;gap:.6em 1.2em;align-items:center;margin:.4em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.25)}
.fx2slot2{min-width:1.8em;min-height:1.55em;font-family:Jua,sans-serif;border:2px dashed var(--ring);border-radius:.4em;background:#fff;padding:0 .2em;font-size:inherit}
.fx2slot2.fx2full{border-style:solid;border-color:var(--night)}
.fx2deck{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.fx2deck .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2.2em;text-align:center}
.fx2deck .opt.fx2used{opacity:.4}
.fx2ccard{display:inline-block;border:3px solid var(--night);border-radius:.7em;padding:.25em .9em;background:#FFF8EE;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.15)}
.fx2score{font-family:Jua,sans-serif;background:var(--pine-soft);color:var(--pine);border-radius:.6em;padding:.2em .7em;display:inline-block}
.fx2log{font-size:var(--fs-s);margin:.3em 0;padding-left:1.2em}
`;
  document.head.append(s);
}
const fx2Num = v => typeof v === "string" ? fx2Str(v) : v;
function fx2Stepper(label, get, set, min, max, onChange) {
  const num = h("span", { class: "fx2num" }, "​");
  const paint = () => { num.textContent = String(get()); };
  const b = (t, dv) => h("button", { onclick: () => { const v = get() + dv; if (v < min || v > max) return; set(v); paint(); onChange(); } }, t);
  const el = h("div", { class: "fx2ctl" }, h("span", { class: "jua" }, label), b("－", -1), num, b("＋", 1));
  el.paint = paint; paint();
  return el;
}

/* ① 같은 양을 여러 번 붓기(분수×자연수): opt d(1을 나눈 칸 수), amt("1/4"·"3/5"·"1 1/5"), k(번), unit, what(무엇을), est, ask·askCalc, ok
   진분수는 1짜리 막대를 차례로 채우고, 대분수는 한 번 부은 양을 한 줄로 그린 뒤 '모으기'로 자연수끼리·진분수끼리 모아요. */
function fx2Pour(body, api, opt) {
  fx2Style(); fx2Style2();
  const d = opt.d, A = fx2Str(opt.amt), k = opt.k, unit = opt.unit || "";
  if (!A || A.err || d % A.den) throw new Error("붓기 확인 필요: " + opt.amt);
  const per = A.num * d / A.den, total = per * k, mixed = A.hasW && A.w > 0, maxP = k + 2;
  const nBars = Math.max(1, Math.ceil(per * maxP / d));
  let p = 0, merged = false, estOk = !opt.est;
  const W = 900, LX = 120, BW = 620;
  const svg = makeSvg(W, 100);
  const row = (x, y, w, cells, fillFn, frameW, dashed) => {
    for (let c = 0; c < cells; c++) svg.append(svgEl("rect", { x: x + c * w / cells, y, width: w / cells, height: 50, fill: fillFn(c) || "#fff", stroke: dashed ? "#B9C4C0" : INK, "stroke-width": 2, "stroke-dasharray": dashed ? "6 5" : "" }));
    svg.append(svgEl("rect", { x, y, width: frameW == null ? w : frameW, height: 50, fill: "none", stroke: INK, "stroke-width": 4 }));
  };
  const draw = () => {
    svg.innerHTML = ""; let y = 14;
    if (!mixed) {
      const need = Math.max(1, Math.ceil(per * p / d), Math.ceil(total / d));
      for (let i = 0; i < Math.min(need, nBars); i++) {
        row(LX, y, BW, d, c => { const g = i * d + c; return g < per * p ? FX2_F[Math.floor(g / per) % 4] : null; });
        svg.append(txt(LX - 50, y + 25, `1${unit}`, 22));
        y += 66;
      }
    } else if (!merged) {
      const uw = 260;
      for (let j = 0; j < p; j++) {
        svg.append(txt(48, y + 25, `${j + 1}번째`, 18, { fill: FX2_S[j % 4] }));
        for (let w = 0; w < A.w; w++) { row(LX + w * (uw + 12), y, uw, d, () => FX2_F[j % 4]); }
        const fx = LX + A.w * (uw + 12) + 20;
        row(fx, y, uw, d, c => c < A.n ? FX2_F[j % 4] : null, uw * A.n / d, true);
        y += 66;
      }
      if (!p) { svg.append(fx2SvgLine(`‘한 번 담기’를 눌러 [${opt.amt}]${unit}씩 담아 보세요.`, W / 2, y + 25, 20, { fill: "#5B6B6B" })); y += 66; }
    } else {
      const wn = A.w * k, uw = Math.min(200, (W - LX - 30) / wn - 10);
      svg.append(fx2SvgLine("자연수끼리", LX - 12, y + 25, 18, { anchor: "end" }));
      for (let w = 0; w < wn; w++) row(LX + w * (uw + 10), y, uw, d, () => FX2_F[Math.floor(w / A.w) % 4]);
      svg.append(fx2SvgLine(`= ${wn}`, LX + wn * (uw + 10) + 6, y + 25, 22, { anchor: "start", fill: TENT }));
      y += 74;
      const fn = A.n * k, bars = Math.max(1, Math.ceil(fn / d));
      for (let i = 0; i < bars; i++) {
        if (!i) svg.append(fx2SvgLine("진분수끼리", LX - 12, y + 25, 18, { anchor: "end" }));
        row(LX, y, 400, d, c => { const g = i * d + c; return g < fn ? FX2_F[Math.floor(g / A.n) % 4] : null; });
        if (!i) svg.append(fx2SvgLine(`= [${fn}/${d}]`, LX + 412, y + 25, 22, { anchor: "start", fill: TENT }));
        y += 66;
      }
    }
    svg.setAttribute("viewBox", `0 0 ${W} ${y + 4}`);
    const amtTxt = `[${opt.amt}]${unit}`;
    rd.textContent = merged ? `자연수끼리 ${A.w * k}, 진분수끼리 [${A.n * k}/${d}] → 모두 ${fx2Tk(fx2Form(total, d))}${unit}`
      : p ? `${amtTxt}씩 ${p}번 담았어요 → ${amtTxt}의 ${p}배` : "아직 담지 않았어요.";
    rd.classList.toggle("fx2good", p === k);
  };
  const rd = h("p", { class: "fx2rd" });
  const pour = h("button", { onclick: () => { if (!estOk) return api.hint("먼저 위에서 어림해요."); if (merged) return; if (p >= maxP) return api.hint(`그만! ${k}번만 담으면 돼요.`); p++; draw(); } }, `한 번 담기 (+[${opt.amt}]${unit})`);
  const undo = h("button", { onclick: () => { if (merged) { merged = false; draw(); return; } if (p > 0) { p--; draw(); } } }, "하나 덜기");
  const tools = h("div", { class: "fx2ctl" }, pour, undo);
  if (mixed) tools.append(h("button", { onclick: () => { if (p !== k) return api.hint(`먼저 ${k}번 담아요. 지금 ${p}번이에요.`); merged = true; draw(); api.hint("자연수 부분은 자연수끼리, 진분수 부분은 진분수끼리 모았어요!"); } }, "모으기"));
  draw();
  const ask = h("div", { class: "fx2ask" });
  if (opt.est) body.append(fx2EstBox(api, opt.est, () => { estOk = true; }));
  body.append(h("p", { class: "fx2tip" }, opt.tip || `막대 하나가 1${unit}이고 작은 칸 하나는 [1/${d}]${unit}이에요.`), tools, rd, h("div", { class: "fx2stage" }, svg), ask);
  fx2Ask(ask, api, () => p === k && (!mixed || merged) && estOk, () => !estOk ? "먼저 어림해요." : p !== k ? `[${opt.amt}]${unit}씩 ${k}번 담아요. 지금 ${p}번 담았어요.` : "‘모으기’를 눌러 자연수끼리, 진분수끼리 모아 봐요.", opt);
}

/* ② 수직선에서 같은 길이만큼 뛰기: opt max(끝 수), d(1을 나눈 눈금), step("6/5"), k, unit, ask */
function fx2Jump(body, api, opt) {
  fx2Style(); fx2Style2();
  const max = opt.max, d = opt.d, S = fx2Str(opt.step), k = opt.k;
  const st = S.num * d / S.den; if (!Number.isInteger(st)) throw new Error("뛰기 확인 필요");
  const W = 900, X0 = 60, X1 = 860, Y = 170, n = max * d, gap = (X1 - X0) / n;
  const marks = [0];
  const svg = makeSvg(W, 230);
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: 230, fill: "transparent" }));
    svg.append(svgEl("line", { x1: X0 - 10, y1: Y, x2: X1 + 20, y2: Y, stroke: INK, "stroke-width": 4 }));
    for (let i = 0; i <= n; i++) {
      const x = X0 + i * gap, big = i % d === 0;
      svg.append(svgEl("line", { x1: x, y1: Y - (big ? 16 : 9), x2: x, y2: Y + (big ? 16 : 9), stroke: INK, "stroke-width": big ? 4 : 2 }));
      if (big) svg.append(txt(x, Y + 36, String(i / d), 24));
    }
    for (let j = 1; j < marks.length; j++) {
      const a = X0 + marks[j - 1] * gap, b = X0 + marks[j] * gap, mid = (a + b) / 2, top = Y - 60 - (j % 2) * 18;
      svg.append(svgEl("path", { d: `M${a} ${Y - 6} Q${mid} ${top - 40} ${b} ${Y - 6}`, fill: "none", stroke: FX2_S[(j - 1) % 4], "stroke-width": 4 }));
      svg.append(svgEl("polygon", { points: `${b} ${Y - 4},${b - 12} ${Y - 18},${b + 2} ${Y - 20}`, fill: FX2_S[(j - 1) % 4] }));
      svg.append(fx2SvgLine(`[${opt.step}]`, mid, top - 8, 20, { fill: FX2_S[(j - 1) % 4] }));
    }
    marks.forEach(m => svg.append(svgEl("circle", { cx: X0 + m * gap, cy: Y, r: 8, fill: TENT })));
    const last = marks[marks.length - 1];
    rd.textContent = marks.length > 1 ? `${marks.length - 1}번 뛰었어요. 지금 [${fx2Form(last, d)}]에 있어요.` : `0에서 출발해요. 한 번에 [${opt.step}]만큼 뛰어요.`;
    rd.classList.toggle("fx2good", marks.length - 1 === k);
  };
  const rd = h("p", { class: "fx2rd" });
  svg.style.cursor = "pointer";
  svg.addEventListener("click", ev => {
    const pt = svgPt(svg, ev), i = Math.round((pt.x - X0) / gap);
    if (i < 0 || i > n) return;
    const last = marks[marks.length - 1];
    if (marks.length - 1 >= k) return api.hint(`${k}번 다 뛰었어요.`);
    if (i - last !== st) return api.hint(`한 번에 [${opt.step}]만큼 뛰어요. [${opt.step}]은 작은 눈금 ${st}칸이에요. 지금 고른 곳까지는 ${i - last}칸이에요.`);
    marks.push(i); draw();
  });
  draw();
  const ask = h("div", { class: "fx2ask" });
  body.append(h("p", { class: "fx2tip" }, opt.tip || `수직선의 눈금을 눌러 [${opt.step}]만큼씩 ${k}번 뛰어 보세요. 작은 눈금 한 칸은 [1/${d}]이에요.`),
    rd, h("div", { class: "fx2stage" }, svg), h("div", { class: "fx2ctl" }, h("button", { onclick: () => { marks.length = 1; draw(); } }, "처음부터")), ask);
  fx2Ask(ask, api, () => marks.length - 1 === k, () => `[${opt.step}]만큼씩 ${k}번 뛰어요. 지금 ${marks.length - 1}번 뛰었어요.`, opt);
}

/* ③ 자연수의 분수만큼(자연수×분수): N 길이 막대를 똑같이 나누고 몇 부분을 색칠해요.
   opt N, d, n, unit, name, whole(1이면 위에 'N×1' 막대도 색칠), est, ask·askCalc, ok */
function fx2Part(body, api, opt) {
  fx2Style(); fx2Style2();
  const N = opt.N, d = opt.d, n = opt.n, unit = opt.unit || "", c = d / fx2G(N, d), cells = N * c;
  let k = 1, sel = new Set(), wholeOn = false, estOk = !opt.est;
  const W = 900, LX = 150, BW = 680;
  const svg = makeSvg(W, 100);
  const xAt = v => LX + v / N * BW;
  const draw = () => {
    svg.innerHTML = ""; let y = 18;
    if (opt.whole) {
      const r = svgEl("rect", { x: LX, y, width: BW, height: 50, fill: wholeOn ? "#9CC6EC" : "#fff", stroke: INK, "stroke-width": 4, style: "cursor:pointer" });
      r.addEventListener("click", () => { wholeOn = !wholeOn; draw(); });
      svg.append(r);
      for (let i = 1; i < N; i++) svg.append(svgEl("line", { x1: xAt(i), y1: y, x2: xAt(i), y2: y + 50, stroke: INK, "stroke-width": 2, "pointer-events": "none" }));
      svg.append(fx2SvgLine(`${N}×1`, LX - 14, y + 25, 22, { anchor: "end" }));
      if (wholeOn) svg.append(fx2SvgLine(`${N}${unit}`, LX + BW / 2, y + 25, 22, { fill: "#1F4E8C" }));
      y += 76;
    }
    const pw = BW / k;
    for (let j = 0; j < k; j++) {
      const r = svgEl("rect", { x: LX + j * pw, y, width: pw, height: 56, fill: sel.has(j) ? "#F6C08A" : "#fff", stroke: "none", style: "cursor:pointer" });
      r.addEventListener("click", () => { sel.has(j) ? sel.delete(j) : sel.add(j); draw(); });
      svg.append(r);
    }
    for (let i = 1; i < cells; i++) { const x = LX + i * BW / cells, big = i % c === 0; svg.append(svgEl("line", { x1: x, y1: y + (big ? 0 : 14), x2: x, y2: y + 56 - (big ? 0 : 14), stroke: INK, "stroke-width": big ? 3 : 1.5, "pointer-events": "none" })); }
    svg.append(svgEl("rect", { x: LX, y, width: BW, height: 56, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
    for (let j = 1; j < k; j++) svg.append(svgEl("line", { x1: LX + j * pw, y1: y - 12, x2: LX + j * pw, y2: y + 68, stroke: "#C8472E", "stroke-width": 4, "stroke-dasharray": "8 6", "pointer-events": "none" }));
    svg.append(fx2SvgLine(opt.name || `${N}${unit}`, LX - 14, y + 28, 22, { anchor: "end" }));
    y += 74;
    for (let i = 0; i <= N; i++) { svg.append(svgEl("line", { x1: xAt(i), y1: y - 8, x2: xAt(i), y2: y + 6, stroke: INK, "stroke-width": 2 })); if (N <= 16 || i % 2 === 0) svg.append(txt(xAt(i), y + 22, String(i), 18)); }
    svg.append(svgEl("line", { x1: LX, y1: y, x2: LX + BW, y2: y, stroke: INK, "stroke-width": 2 }));
    y += 38;
    svg.setAttribute("viewBox", `0 0 ${W} ${y}`);
    const m = sel.size, val = fx2R(m * N, k);
    rd.textContent = k === 1 ? `아직 나누지 않았어요. ‘＋’를 눌러 ${fx2J(`${N}${unit}`, "을를")} 똑같이 나누어 보세요.`
      : `${fx2J(`${N}${unit}`, "을를")} 똑같이 ${k}부분으로 나누었어요. 한 부분은 ${fx2Tk(fx2Form(N, k))}${unit}` + (m ? ` · 색칠한 ${m}부분은 ${fx2Tk(fx2Form(val.num, val.den))}${unit}` : "");
    rd.classList.toggle("fx2good", ready());
  };
  const rd = h("p", { class: "fx2rd" });
  const ctl = fx2Stepper("똑같이 나누기:", () => k, v => { k = v; sel = new Set([...sel].filter(j => j < k)); }, 1, 12, draw);
  const ready = () => k === d && sel.size === n && (!opt.whole || wholeOn) && estOk;
  draw();
  const ask = h("div", { class: "fx2ask" });
  if (opt.est) body.append(fx2EstBox(api, opt.est, () => { estOk = true; draw(); }));
  body.append(h("p", { class: "fx2tip" }, opt.tip || "‘＋’, ‘－’로 막대를 똑같이 나누고, 나눈 부분을 눌러 색칠해요."), ctl, rd, h("div", { class: "fx2stage" }, svg), ask);
  fx2Ask(ask, api, ready, () => !estOk ? "먼저 어림해요." : opt.whole && !wholeOn ? `먼저 ‘${N}×1’ 막대를 눌러 색칠해요.` : k !== d ? `${fx2J(`${N}${unit}`, "을를")} 똑같이 ${d}부분으로 나누어요. 지금 ${k}부분이에요.` : `나눈 ${d}부분 중 ${n}부분을 색칠해요. 지금 ${sel.size}부분이에요.`, opt);
}

/* ④ 넓이 모델(진분수×진분수): 넓이가 1인 정사각형을 나누고 색칠·빗금. opt stages [{dir:"v"|"h"|"h2", d, n, t(이름)}], ask, ok */
let FX2_PAT = 0;
function fx2Area(body, api, opt) {
  fx2Style(); fx2Style2();
  const SG = opt.stages, K = SG.map(() => 1), sel = SG.map(() => new Set()), id = "fx2p" + (++FX2_PAT);
  let cur = 0;
  const W = 900, X0 = 40, Y0 = 30, S = 440;
  const svg = makeSvg(W, 516);
  const vI = SG.findIndex(s => s.dir === "v"), hI = SG.findIndex(s => s.dir === "h"), h2I = SG.findIndex(s => s.dir === "h2");
  const ok = i => {
    const s = SG[i]; if (K[i] !== s.d || sel[i].size !== s.n) return false;
    if (s.dir === "h2") { const per = K[h2I]; for (const g of sel[i]) if (!sel[hI].has(Math.floor(g / per))) return false; }
    return true;
  };
  const allOk = () => SG.every((_, i) => ok(i));
  const defs = () => {
    const d = svgEl("defs");
    const mk = (pid, col, ang, w) => { const p = svgEl("pattern", { id: pid, width: 12, height: 12, patternUnits: "userSpaceOnUse", patternTransform: `rotate(${ang})` }); p.append(svgEl("line", { x1: 0, y1: 0, x2: 0, y2: 12, stroke: col, "stroke-width": w })); d.append(p); };
    mk(id + "a", "#2B7BD6", 45, 3.2); mk(id + "b", "#8E1F1F", -45, 3.2);
    return d;
  };
  const draw = () => {
    svg.innerHTML = ""; svg.append(defs());
    const kv = vI >= 0 ? K[vI] : 1, kh = hI >= 0 ? K[hI] : 1, kh2 = h2I >= 0 ? K[h2I] : 1;
    const cw = S / kv, rh = S / kh, sh = rh / kh2;
    svg.append(svgEl("rect", { x: X0, y: Y0, width: S, height: S, fill: "#fff" }));
    if (vI >= 0) sel[vI].forEach(c => svg.append(svgEl("rect", { x: X0 + c * cw, y: Y0, width: cw, height: S, fill: "#F6C08A" })));
    if (hI >= 0) sel[hI].forEach(r => { const cols = vI >= 0 ? [...sel[vI]] : []; cols.forEach(c => svg.append(svgEl("rect", { x: X0 + c * cw, y: Y0 + r * rh, width: cw, height: rh, fill: `url(#${id}a)` }))); });
    if (h2I >= 0) sel[h2I].forEach(g => { const cols = vI >= 0 ? [...sel[vI]] : []; cols.forEach(c => svg.append(svgEl("rect", { x: X0 + c * cw, y: Y0 + g * sh, width: cw, height: sh, fill: `url(#${id}b)` }))); });
    for (let i = 1; i < kv; i++) svg.append(svgEl("line", { x1: X0 + i * cw, y1: Y0, x2: X0 + i * cw, y2: Y0 + S, stroke: INK, "stroke-width": 3 }));
    for (let i = 1; i < kh; i++) svg.append(svgEl("line", { x1: X0, y1: Y0 + i * rh, x2: X0 + S, y2: Y0 + i * rh, stroke: INK, "stroke-width": 3 }));
    for (let i = 1; i < kh * kh2; i++) if (i % kh2) svg.append(svgEl("line", { x1: X0, y1: Y0 + i * sh, x2: X0 + S, y2: Y0 + i * sh, stroke: INK, "stroke-width": 1.6, "stroke-dasharray": "7 5" }));
    svg.append(svgEl("rect", { x: X0, y: Y0, width: S, height: S, fill: "none", stroke: INK, "stroke-width": 5 }));
    svg.append(txt(X0 + S / 2, Y0 + S + 26, opt.whole || "전체 = 1", 20));
    /* 오른쪽 기록 */
    const RX = X0 + S + 40; let y = Y0 + 20;
    SG.forEach((s, i) => {
      const done = ok(i), col = done ? "#2E8B57" : i === cur ? TENT : "#5B6B6B";
      svg.append(fx2SvgLine(`${done ? "✓" : i === cur ? "▶" : "·"} ${s.t}`, RX, y, 21, { anchor: "start", fill: col }));
      svg.append(fx2SvgLine(`${s.dir === "v" ? "세로로" : s.dir === "h" ? "가로로" : "다시 가로로"} ${K[i]}등분 · 고른 것 ${sel[i].size}개`, RX + 22, y + 32, 17, { anchor: "start", fill: "#5B6B6B" }));
      y += 82;
    });
    if (allOk()) {
      const tot = kv * kh * kh2, cnt = (vI >= 0 ? sel[vI].size : 1) * (h2I >= 0 ? sel[h2I].size : hI >= 0 ? sel[hI].size : 1);
      svg.append(fx2SvgLine(`전체 ${tot}칸 중 ${h2I >= 0 ? "진한 " : ""}빗금 ${cnt}칸`, RX, y + 6, 22, { anchor: "start", fill: TENT }));
      svg.append(fx2SvgLine(`→ [${cnt}/${tot}]`, RX, y + 54, 28, { anchor: "start", fill: TENT }));
    }
    tabs.forEach((b, i) => b.classList.toggle("fx2act", i === cur));
    steppers.forEach((st, i) => { st.style.display = i === cur ? "" : "none"; st.paint(); });
  };
  svg.addEventListener("click", ev => {
    const pt = svgPt(svg, ev); if (pt.x < X0 || pt.x > X0 + S || pt.y < Y0 || pt.y > Y0 + S) return;
    const s = SG[cur], fx = (pt.x - X0) / S, fy = (pt.y - Y0) / S;
    if (cur > 0 && !ok(cur - 1)) return api.hint("앞 단계를 먼저 끝내요.");
    if (K[cur] === 1) return api.hint("먼저 ‘＋’를 눌러 똑같이 나누어요.");
    let j;
    if (s.dir === "v") j = Math.floor(fx * K[cur]);
    else if (s.dir === "h") j = Math.floor(fy * K[cur]);
    else j = Math.floor(fy * K[hI] * K[cur]);
    j = Math.min(j, (s.dir === "h2" ? K[hI] * K[cur] : K[cur]) - 1);
    sel[cur].has(j) ? sel[cur].delete(j) : sel[cur].add(j);
    if (ok(cur) && cur < SG.length - 1) cur++;
    draw();
  });
  svg.style.cursor = "pointer";
  const tabs = SG.map((s, i) => h("button", { onclick: () => { if (i > 0 && !ok(i - 1)) return api.hint("앞 단계를 먼저 끝내요."); cur = i; draw(); } }, `${i + 1}단계`));
  const steppers = SG.map((s, i) => fx2Stepper(`${s.dir === "v" ? "세로로" : s.dir === "h" ? "가로로" : "색칠·빗금 친 줄을 다시 가로로"} 똑같이 나누기:`, () => K[i], v => { K[i] = v; sel[i].clear(); for (let q = i + 1; q < SG.length; q++) if (SG[q].dir === "h2") sel[q].clear(); }, 1, 10, draw));
  const ask = h("div", { class: "fx2ask" });
  body.append(h("p", { class: "fx2tip" }, opt.tip || "단계마다 ‘＋’로 똑같이 나눈 다음, 정사각형을 눌러 색칠하거나 빗금을 그어요. 넓이가 1인 정사각형이에요."),
    h("div", { class: "fx2ctl" }, ...tabs, h("button", { onclick: () => { K.fill(1); sel.forEach(s => s.clear()); cur = 0; draw(); } }, "처음부터")), ...steppers, h("div", { class: "fx2stage" }, svg), ask);
  draw();
  fx2Ask(ask, api, allOk, () => { const i = SG.findIndex((_, q) => !ok(q)), s = SG[i]; return `${s.t}: ${s.dir === "v" ? "세로로" : "가로로"} ${s.d}등분하고 ${s.n}${s.dir === "h2" ? "줄" : "칸"}을 골라요. 지금 ${K[i]}등분, ${sel[i].size}개 골랐어요.`; }, opt);
}

/* ⑤ 직사각형 넓이(대분수×대분수): opt A(가로), B(세로), unit, mode 1(곱하는 대분수 나누기) | 2(가분수 칸), est, ask */
function fx2Mat(body, api, opt) {
  fx2Style(); fx2Style2();
  const A = fx2Str(opt.A), B = fx2Str(opt.B), U = 200, X0 = 150, Y0 = 50;
  const wA = A.num / A.den * U, hB = B.num / B.den * U;
  let cut = 0, cols = 1, rows = 1, estOk = !opt.est;
  const W = 900, H = Y0 + Math.max(hB, U) + 70;
  const svg = makeSvg(W, H);
  const step = U / B.den;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
    svg.append(fx2SvgLine(`가로 [${opt.A}] m`, X0 + wA / 2, Y0 - 24, 22));
    svg.append(fx2SvgLine(`세로 [${opt.B}] m`, X0 - 16, Y0 + hB / 2, 20, { anchor: "end" }));
    if (opt.mode === 1) {
      const top = cut ? cut * step : hB;
      svg.append(svgEl("rect", { x: X0, y: Y0, width: wA, height: top, fill: cut ? "#9CC6EC" : "#E9DCC0" }));
      if (cut) svg.append(svgEl("rect", { x: X0, y: Y0 + top, width: wA, height: hB - top, fill: "#F6E08A" }));
      svg.append(svgEl("rect", { x: X0, y: Y0, width: wA, height: hB, fill: "none", stroke: INK, "stroke-width": 4 }));
      if (cut) {
        const a = fx2R(cut, B.den), b = fx2R(B.num - cut, B.den);
        svg.append(fx2SvgLine(`[${opt.A}]×${fx2Tk(fx2Form(a.num, a.den))}`, X0 + wA / 2, Y0 + top / 2, 21));
        svg.append(fx2SvgLine(`[${opt.A}]×${fx2Tk(fx2Form(b.num, b.den))}`, X0 + wA + 18, Y0 + top + (hB - top) / 2, 20, { anchor: "start" }));
        svg.append(fx2SvgLine(`세로 ${fx2Tk(fx2Form(a.num, a.den))} m`, X0 + wA + 18, Y0 + top / 2, 18, { anchor: "start", fill: "#5B6B6B" }));
        svg.append(svgEl("line", { x1: X0 - 10, y1: Y0 + top, x2: X0 + wA + 10, y2: Y0 + top, stroke: "#C8472E", "stroke-width": 5 }));
      }
      const hy = Y0 + (cut ? cut * step : hB / 2);
      const hd = svgEl("circle", { cx: X0 + wA + 6, cy: hy, r: 14, fill: TENT, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" });
      svg.append(hd);
      svg.append(txt(X0 + wA + 6, hy, "↕", 16, { fill: "#fff", "pointer-events": "none" }));
      for (let i = 0; i <= B.num; i++) svg.append(svgEl("line", { x1: X0 - 8, y1: Y0 + i * step, x2: X0, y2: Y0 + i * step, stroke: INK, "stroke-width": 2 }));
    } else {
      svg.append(svgEl("rect", { x: X0, y: Y0, width: U, height: U, fill: "#FDF1E8", stroke: TENT, "stroke-width": 3, "stroke-dasharray": "9 6" }));
      svg.append(svgEl("rect", { x: X0, y: Y0, width: wA, height: hB, fill: "rgba(156,198,236,.45)" }));
      const cw = U / cols, rh = U / rows, fitC = Math.abs(wA / cw - Math.round(wA / cw)) < 1e-6, fitR = Math.abs(hB / rh - Math.round(hB / rh)) < 1e-6;
      const xe = Math.max(wA, U), ye = Math.max(hB, U);
      for (let x = cw; x < xe - 1e-6; x += cw) svg.append(svgEl("line", { x1: X0 + x, y1: Y0, x2: X0 + x, y2: Y0 + ye, stroke: INK, "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
      for (let y = rh; y < ye - 1e-6; y += rh) svg.append(svgEl("line", { x1: X0, y1: Y0 + y, x2: X0 + xe, y2: Y0 + y, stroke: INK, "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
      svg.append(svgEl("rect", { x: X0, y: Y0, width: wA, height: hB, fill: "none", stroke: INK, "stroke-width": 4 }));
      svg.append(fx2SvgLine("1 m²", X0 + U / 2, Y0 + U + 22, 18, { fill: TENT }));
      const RX = X0 + Math.max(wA, U) + 50;
      svg.append(fx2SvgLine(`한 칸: 가로 ${fx2Tk(fx2Form(1, cols))} m, 세로 ${fx2Tk(fx2Form(1, rows))} m`, RX, Y0 + 30, 20, { anchor: "start" }));
      if (fitC && fitR) {
        const nc = Math.round(wA / cw), nr = Math.round(hB / rh);
        svg.append(fx2SvgLine(`멍석: ${nc}×${nr} = ${nc * nr}칸`, RX, Y0 + 80, 20, { anchor: "start" }));
        svg.append(fx2SvgLine(`1 m²: ${cols}×${rows} = ${cols * rows}칸`, RX, Y0 + 124, 20, { anchor: "start", fill: TENT }));
        svg.append(fx2SvgLine(`→ 한 칸은 [1/${cols * rows}] m²`, RX, Y0 + 172, 22, { anchor: "start", fill: "#2E8B57" }));
      } else svg.append(fx2SvgLine("칸이 멍석 끝에 딱 맞지 않아요.", RX, Y0 + 80, 19, { anchor: "start", fill: "#C8472E" }));
    }
  };
  if (opt.mode === 1) {
    let drag = false;
    dragOn(svg, p => { if (p.x < X0 + wA - 30 || p.x > X0 + wA + 40) return false; drag = true; return true; },
      p => { if (!drag) return; const v = Math.round((p.y - Y0) / step); cut = Math.max(1, Math.min(B.num - 1, v)); draw(); },
      () => { drag = false; rdUpd(); });
  }
  const rd = h("p", { class: "fx2rd" });
  const ready = () => estOk && (opt.mode === 1 ? cut === B.den : cols === A.den && rows === B.den);
  const rdUpd = () => { rd.textContent = opt.mode === 1 ? (cut ? (cut === B.den ? `세로를 1 m와 [${B.n}/${B.den}] m로 나누었어요.` : "세로가 1 m인 곳에서 나누어 봐요.") : "주황 손잡이를 위아래로 끌어 세로를 나누어 보세요.") : ""; rd.classList.toggle("fx2good", ready()); };
  const ctl = h("div");
  if (opt.mode === 2) ctl.append(
    fx2Stepper("가로 1 m를 똑같이:", () => cols, v => { cols = v; }, 1, 8, () => { draw(); rdUpd(); }),
    fx2Stepper("세로 1 m를 똑같이:", () => rows, v => { rows = v; }, 1, 8, () => { draw(); rdUpd(); }));
  draw(); rdUpd();
  const ask = h("div", { class: "fx2ask" });
  if (opt.est) body.append(fx2EstBox(api, opt.est, () => { estOk = true; rdUpd(); }));
  body.append(h("p", { class: "fx2tip" }, opt.tip || (opt.mode === 1 ? "주황 손잡이를 위아래로 끌어 세로를 자연수 부분과 진분수 부분으로 나누어요." : "‘＋’, ‘－’로 가로와 세로의 1 m를 똑같이 나누어요. 주황 점선 정사각형이 1 m²예요.")), ctl, rd, h("div", { class: "fx2stage" }, svg), ask);
  fx2Ask(ask, api, ready, () => !estOk ? "먼저 어림해요." : opt.mode === 1 ? "세로를 1 m와 나머지로 나누어요. 손잡이를 1 m 눈금에 맞춰요." : `칸이 멍석 끝에 딱 맞도록 가장 크게 나누어요. 가로는 [${opt.A}]의 분모, 세로는 [${opt.B}]의 분모를 생각해 봐요.`, opt);
}

/* ⑥ 투표 조건: 학년 회원 N명, 참석 > N×[1/2], 찬성 > 참석×[2/3] — 가장 적은 참석 인원·찬성표 찾기. opt N, ask */
function fx2VoteMin(N) { const att = Math.floor(N / 2) + 1, v = Math.floor(att * 2 / 3) + 1; return { att, v }; }
function fx2Vote(body, api, opt) {
  fx2Style(); fx2Style2();
  const N = opt.N, best = fx2VoteMin(N);
  let a = 0, v = 0, mode = 0;
  const per = 15, rowsN = Math.ceil(N / per), W = 900, cell = 52, H = 30 + rowsN * cell + 10;
  const svg = makeSvg(W, H);
  const draw = () => {
    svg.innerHTML = "";
    for (let i = 0; i < N; i++) {
      const x = 40 + (i % per) * cell + cell / 2, y = 24 + Math.floor(i / per) * cell + cell / 2;
      const g = svgEl("g", { style: "cursor:pointer" });
      const at = i < a, vo = i < v;
      g.append(svgEl("circle", { cx: x, cy: y - 8, r: 9, fill: at ? (vo ? "#2E8B57" : "#2B7BD6") : "#D5DCD9" }));
      g.append(svgEl("path", { d: `M${x - 15} ${y + 18} Q${x} ${y - 6} ${x + 15} ${y + 18}Z`, fill: at ? (vo ? "#2E8B57" : "#2B7BD6") : "#D5DCD9" }));
      if (vo) g.append(txt(x + 15, y - 16, "✓", 15, { fill: "#2E8B57" }));
      g.append(svgEl("rect", { x: x - cell / 2, y: y - cell / 2, width: cell, height: cell, fill: "transparent" }));
      g.addEventListener("click", () => { if (mode === 0) { a = i + 1; if (v > a) v = a; } else { if (i >= a) return api.hint("찬성표는 회의에 참석한 회원만 낼 수 있어요."); v = i + 1; } paint(); });
      svg.append(g);
    }
  };
  const c1 = h("div"), c2 = h("div"), c3 = h("div");
  const paint = () => {
    draw(); sa.paint(); sv.paint();
    const h1 = fx2R(N, 2), h2 = fx2R(a * 2, 3), ok1 = a * 2 > N, ok2 = v * 3 > a * 2;
    c1.textContent = `① 참석 ${a}명 — 학년 전체 회원 수의 [1/2]: ${N}×[1/2] = ${fx2Tk(fx2Form(h1.num, h1.den))} → ${ok1 ? "보다 많아요 ✓" : "보다 많지 않아요 ✗"}`;
    c2.textContent = `② 찬성 ${v}표 — 참석한 회원 수의 [2/3]: ${a}×[2/3] = ${fx2Tk(fx2Form(h2.num, h2.den))} → ${ok2 ? "보다 많아요 ✓" : "보다 많지 않아요 ✗"}`;
    c3.textContent = ok1 && ok2 ? "의견이 통과돼요! 🎉" : "아직 통과되지 않아요.";
    c1.style.color = ok1 ? "var(--ok)" : "var(--no)"; c2.style.color = ok2 ? "var(--ok)" : "var(--no)";
  };
  const sa = fx2Stepper("참석한 회원:", () => a, x => { a = x; if (v > a) v = a; }, 0, N, paint);
  const sv = fx2Stepper("찬성표:", () => v, x => { v = x; }, 0, N, () => { if (v > a) { v = a; api.hint("찬성표는 참석한 회원 수보다 많을 수 없어요."); } paint(); });
  const mb = [h("button", { class: "fx2act", onclick: () => setMode(0) }, "사람을 눌러 참석 정하기"), h("button", { onclick: () => setMode(1) }, "사람을 눌러 찬성 정하기")];
  const setMode = m => { mode = m; mb.forEach((b, i) => b.classList.toggle("fx2act", i === m)); };
  const ask = h("div", { class: "fx2ask" });
  body.append(h("p", { class: "fx2tip" }, `회원 ${N}명이에요. ‘＋’, ‘－’나 사람 그림을 눌러 참석 인원과 찬성표를 정하고, 의견이 통과되는 가장 적은 수를 찾아보세요.`),
    h("div", { class: "fx2ctl" }, ...mb), sa, sv, h("div", { class: "fx2cond" }, c1, c2, c3), h("div", { class: "fx2stage" }, svg), ask);
  paint();
  fx2Ask(ask, api, () => a === best.att && v === best.v, () => {
    if (a * 2 <= N || v * 3 <= a * 2) return "아직 의견이 통과되지 않아요. 두 조건을 모두 만족하게 해 봐요.";
    if (a !== best.att) return "통과는 돼요. 그런데 참석 인원을 더 줄일 수 있어요. ①을 만족하는 가장 적은 수를 찾아요.";
    return "통과는 돼요. 그런데 찬성표를 더 줄일 수 있어요. ②를 만족하는 가장 적은 수를 찾아요.";
  }, opt);
}

/* ⑦ 수 카드로 분수의 곱셈식 만들기: opt cards, shape(["p","w"]…), goal "any"|"max", label, ok
   p 진분수(분자·분모) · m 대분수(자연수·분자·분모) · w 자연수. 카드는 한 번씩만. 곱은 값으로 채점. */
const FX2_KIND = { p: "진분수", m: "대분수", w: "자연수" };
function fx2Slots(shape) { return shape.reduce((a, t) => a + (typeof t === "number" ? 0 : t === "p" ? 2 : t === "m" ? 3 : 1), 0); }
function fx2ShapeVal(shape, vals) {
  let i = 0, acc = fx2R(1, 1);
  for (const t of shape) {
    let v;
    if (typeof t === "number") v = fx2R(t, 1);
    else if (t === "w") v = fx2R(vals[i++], 1);
    else if (t === "p") { const n = vals[i++], d = vals[i++]; if (n >= d) return null; v = fx2R(n, d); }
    else { const w = vals[i++], n = vals[i++], d = vals[i++]; if (n >= d) return null; v = fx2R(w * d + n, d); }
    acc = fx2R(acc.num * v.num, acc.den * v.den);
  }
  return acc;
}
function fx2ShapeTxt(shape, vals) {
  let i = 0;
  return shape.map(t => typeof t === "number" ? String(t) : t === "w" ? String(vals[i++]) : t === "p" ? `[${vals[i++]}/${vals[i++]}]` : `[${vals[i++]} ${vals[i++]}/${vals[i++]}]`).join("×");
}
function fx2Best(shape, cards) {
  const s = fx2Slots(shape); let best = null;
  const rec = (pick, used) => {
    if (pick.length === s) { const v = fx2ShapeVal(shape, pick.map(i => cards[i])); if (v && (!best || v.num * best.v.den > best.v.num * v.den)) best = { v, idx: pick.slice() }; return; }
    cards.forEach((_, i) => { if (!used.has(i)) { used.add(i); pick.push(i); rec(pick, used); pick.pop(); used.delete(i); } });
  };
  rec([], new Set());
  return best;
}
function fx2BuildUI(host, opt, onCheck) {
  fx2Style(); fx2Style2();
  const cards = opt.cards, shape = opt.shape, nS = fx2Slots(shape), slot = Array(nS).fill(null);
  let sel = null;
  const cBtns = cards.map((c, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; paint(); } }, String(c)));
  const sBtns = [];
  const mkS = (lab) => { const k = sBtns.length; const b = h("button", { class: "fx2slot2", "aria-label": lab, onclick: () => { if (sel == null) slot[k] = null; else { const old = slot.indexOf(sel); if (old >= 0) slot[old] = null; slot[k] = sel; } sel = null; paint(); } }, "​"); sBtns.push(b); return b; };
  const board = h("div", { class: "fx2board" });
  shape.forEach((t, ti) => {
    if (ti) board.append(h("span", {}, "×"));
    if (typeof t === "number") board.append(h("span", {}, String(t)));
    else if (t === "w") board.append(mkS("자연수"));
    else {
      const w = t === "m" ? mkS("자연수 부분") : null;
      const n = mkS("분자"), d = mkS("분모");
      board.append(h("span", { class: "fx2fr fx2frin" }, w ? h("span", { class: "fx2fw" }, w) : null, h("span", { class: "fx2q" }, h("span", { class: "fx2n" }, n), h("span", { class: "fx2d" }, d))));
    }
  });
  const prod = fx2In("곱");
  const paint = () => {
    cBtns.forEach((b, i) => { b.classList.toggle("fx2on", sel === i); b.classList.toggle("fx2used", slot.includes(i)); });
    sBtns.forEach((b, k) => { b.textContent = slot[k] == null ? "​" : String(cards[slot[k]]); b.classList.toggle("fx2full", slot[k] != null); });
  };
  paint();
  host.append(h("p", { class: "fx2tip" }, opt.tip || "수 카드를 누른 다음 빈칸을 눌러 넣어요. 빈칸을 다시 누르면 빠져요. 카드는 한 번씩만 써요."),
    h("div", { class: "fx2deck" }, cBtns), board, h("div", { class: "fx2cl" }, h("span", {}, "곱 ="), prod),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      const vals = slot.map(i => i == null ? null : cards[i]);
      const txtE = vals.some(v => v == null) ? "" : fx2ShapeTxt(shape, vals);
      if (vals.some(v => v == null)) return onCheck({ err: "빈칸에 수 카드를 모두 넣어요." });
      const val = fx2ShapeVal(shape, vals);
      if (!val) return onCheck({ err: "진분수는 분자가 분모보다 작아야 해요. 대분수의 분수 부분도 진분수예요.", e: txtE });
      const r = prod.get();
      if (r.err) { prod.paint(false); return onCheck({ err: r.err === "empty" ? "곱을 써요." : "곱을 분수나 자연수로 써요.", e: txtE }); }
      const right = fx2Eq(r, val);
      prod.paint(right);
      onCheck({ e: txtE, val, r, right, given: `${fx2Plain(txtE)} = ${prod.text()}` });
    } }, "확인하기")));
}
function fx2Build(body, api, opt) {
  const best = fx2Best(opt.shape, opt.cards);
  api.provide({ words: ["분자는 분자끼리", "분모는 분모끼리", "진분수", "대분수"], answers: opt.goal === "max" ? [`${fx2Plain(fx2ShapeTxt(opt.shape, best.idx.map(i => opt.cards[i])))} = ${fx2Plain(fx2Tk(fx2Form(best.v.num, best.v.den)))}`] : [] });
  fx2BuildUI(body, opt, R => {
    if (R.err) return api.fail(R.err, R.e || "-");
    if (opt.goal === "max" && !fx2Eq(R.val, best.v)) return api.fail(opt.maxMsg || "곱이 더 큰 식을 만들 수 있어요. 자연수와 분자는 크게, 분모는 작게 해 봐요.", R.given);
    if (!R.right) return api.fail(fx2Diag(R.e, R.r) || "곱을 다시 계산해 봐요. 분자는 분자끼리, 분모는 분모끼리 곱해요.", R.given);
    api.tryOnce(); api.done(R.given, (opt.ok ? opt.ok + " " : "") + `${R.e} = ${fx2Book(R.val.num, R.val.den)}`);
  });
}

/* ⑧ 놀이: 조건 카드 뽑기 → 수 카드로 식 만들기 → 곱이 맞으면 1점, 가장 큰 곱이면 2점 더. opt rounds, need(통과 점수) */
const FX2_COND = [
  { t: "(진분수)×(자연수)", shape: ["p", "w"] }, { t: "(자연수)×(진분수)", shape: ["w", "p"] },
  { t: "(대분수)×(자연수)", shape: ["m", "w"] }, { t: "(자연수)×(대분수)", shape: ["w", "m"] },
  { t: "(진분수)×(진분수)", shape: ["p", "p"] }];
function fx2Game(body, api, opt) {
  fx2Style(); fx2Style2();
  const R = opt.rounds || 5; let round = 0, score = 0; const log = [];
  const scoreEl = h("span", { class: "fx2score" }, "​"), logEl = h("ol", { class: "fx2log" }), stage = h("div");
  api.provide({ words: ["자연수와 분자는 크게", "분모는 작게"], answers: [] });
  const deal = () => {
    stage.innerHTML = ""; round++;
    const cond = FX2_COND[Math.floor(Math.random() * FX2_COND.length)];
    const deck = [1, 2, 3, 4, 5, 6, 7, 8, 9]; const cards = [];
    for (let i = 0; i < fx2Slots(cond.shape); i++) cards.push(deck.splice(Math.floor(Math.random() * deck.length), 1)[0]);
    cards.sort((x, y) => x - y);
    const best = fx2Best(cond.shape, cards);
    scoreEl.textContent = `${round}/${R}판 · 내 점수 ${score}점`;
    let doneR = false;
    stage.append(h("div", { class: "fx2ctl" }, h("span", { class: "jua" }, "조건 카드:"), h("span", { class: "fx2ccard" }, cond.t)));
    const fb = h("p", { class: "fx2rd" });
    fx2BuildUI(stage, { cards, shape: cond.shape }, Rr => {
      if (doneR) return;
      if (Rr.err) return api.hint(Rr.err);
      doneR = true; let pt = 0, msg;
      const big = fx2Eq(Rr.val, best.v), bestTxt = `${fx2ShapeTxt(cond.shape, best.idx.map(i => cards[i]))} = ${fx2Tk(fx2Form(best.v.num, best.v.den))}`;
      if (Rr.right) { pt = 1 + (big ? 2 : 0); msg = big ? `곱이 맞고, 가장 큰 곱이에요! 3점` : `곱이 맞아요. 1점 · 가장 큰 곱: ${bestTxt}`; }
      else msg = `곱이 틀렸어요. 0점 · ${Rr.e} = ${fx2Tk(fx2Form(Rr.val.num, Rr.val.den))}`;
      score += pt; log.push(`${cond.t} ${Rr.e} → ${pt}점`);
      logEl.innerHTML = ""; log.forEach(t => logEl.append(h("li", {}, t)));
      fb.textContent = msg; fb.classList.toggle("fx2good", Rr.right);
      scoreEl.textContent = `${round}/${R}판 · 내 점수 ${score}점`;
      if (round < R) stage.append(h("div", { class: "fx2ctl" }, h("button", { onclick: deal }, "이어서 한 판 더")));
      else {
        api.tryOnce();
        if (score >= (opt.need || 3)) api.done(`${R}판 ${score}점`, `놀이 끝! ${R}판에서 ${score}점을 얻었어요.`);
        else { api.fail(`${R}판에서 ${score}점이에요. ${opt.need || 3}점 이상이 되도록 다시 해 봐요.`, `${score}점`); stage.append(h("div", { class: "fx2ctl" }, h("button", { onclick: () => { round = 0; score = 0; log.length = 0; logEl.innerHTML = ""; deal(); } }, "처음부터 다시"))); }
      }
    });
    stage.append(fb);
  };
  body.append(h("div", { class: "fx2ctl" }, scoreEl), stage, logEl);
  deal();
}

/* 향유고래 그림 */
function fx2Whale() {
  const svg = makeSvg(900, 250);
  svg.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 250, fill: "#EAF4FB", rx: 16 }));
  const L = 120, R = 760, Y = 120;
  svg.append(svgEl("path", { d: `M${L} ${Y - 55} L${L + 230} ${Y - 60} Q${R - 60} ${Y - 55} ${R - 40} ${Y} Q${R - 60} ${Y + 40} ${L + 230} ${Y + 50} L${L + 40} ${Y + 50} Q${L} ${Y + 40} ${L} ${Y} Z`, fill: "#5E6E86", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("path", { d: `M${R - 40} ${Y} L${R + 40} ${Y - 40} L${R + 20} ${Y} L${R + 40} ${Y + 40} Z`, fill: "#5E6E86", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("circle", { cx: L + 150, cy: Y + 10, r: 6, fill: "#fff" }));
  const hx = L + (R - L) / 3;
  svg.append(svgEl("line", { x1: hx, y1: Y - 70, x2: hx, y2: Y + 62, stroke: TENT, "stroke-width": 4, "stroke-dasharray": "8 6" }));
  svg.append(svgEl("line", { x1: L, y1: Y + 85, x2: R, y2: Y + 85, stroke: INK, "stroke-width": 3 }));
  [L, R].forEach(x => svg.append(svgEl("line", { x1: x, y1: Y + 75, x2: x, y2: Y + 95, stroke: INK, "stroke-width": 3 })));
  svg.append(txt((L + R) / 2, Y + 110, "몸길이 16 m", 22));
  svg.append(fx2SvgLine("머리 길이 = 몸길이의 [1/3]", (L + hx) / 2, Y - 88, 20, { fill: TENT }));
  return h("div", { class: "fx2stage" }, svg);
}
/* 태극기 그림 (가로 72 cm) */
function fx2Flag() {
  const svg = makeSvg(900, 300), w = 360, hh = 240, x = 270, y = 20;
  svg.append(svgEl("rect", { x, y, width: w, height: hh, fill: "#fff", stroke: INK, "stroke-width": 3 }));
  const cx = x + w / 2, cy = y + hh / 2, r = hh / 4;
  svg.append(svgEl("circle", { cx, cy, r, fill: "#003478" }));
  svg.append(svgEl("path", { d: `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} A${r / 2} ${r / 2} 0 0 1 ${cx} ${cy} A${r / 2} ${r / 2} 0 0 0 ${cx - r} ${cy}Z`, fill: "#C8102E" }));
  /* 건(왼쪽 위 ☰)·감(오른쪽 위 ☵)·리(왼쪽 아래 ☲)·곤(오른쪽 아래 ☷): 1이면 가운데가 끊긴 막대 */
  [[x + 50, y + 45, [0, 0, 0]], [x + w - 50, y + 45, [1, 0, 1]], [x + 50, y + hh - 45, [0, 1, 0]], [x + w - 50, y + hh - 45, [1, 1, 1]]].forEach(([px, py, pat]) => pat.forEach((cut, i) => {
    const tf = `rotate(${(px < cx) === (py < cy) ? -34 : 34} ${px} ${py})`, yy = py - 16 + i * 12;
    if (cut) [[px - 22, 19], [px + 3, 19]].forEach(([xx, ww]) => svg.append(svgEl("rect", { x: xx, y: yy, width: ww, height: 7, fill: INK, transform: tf })));
    else svg.append(svgEl("rect", { x: px - 22, y: yy, width: 44, height: 7, fill: INK, transform: tf }));
  }));
  svg.append(svgEl("line", { x1: cx - r, y1: cy + r + 18, x2: cx + r, y2: cy + r + 18, stroke: TENT, "stroke-width": 3 }));
  svg.append(fx2SvgLine("지름 = 세로의 [1/2]", cx, cy + r + 38, 17, { fill: TENT }));
  svg.append(txt(cx, y + hh + 24, "가로 72 cm", 20));
  svg.append(txt(x - 70, cy, "세로 ?", 20));
  return h("div", { class: "fx2stage" }, svg);
}
//@@LESSONS
const UNIT_STORY = { title: "한옥 마을의 하준이와 나은이", lines: [
  "하준이는 외국에서 놀러 온 사촌 동생 나은이에게 우리나라 전통문화를 소개해 주려고 한복을 입고 한옥 마을에 왔어요. 맷돌로 콩 갈기, 인절미 만들기, 전통 빗자루 만들기, 돌담길 걷기, 조각보 만들기, 멍석 만들기를 체험해요.",
  "맷돌에 넣은 물, 인절미에 쓴 콩고물, 빗자루에 묶은 끈, 돌담길을 걸은 거리, 조각보에 쓴 천, 멍석의 넓이에서 분수의 곱셈을 알아봐요.",
  "교과서 「수학 5-2」 2. 분수의 곱셈의 차시 순서 그대로 만들었어요."],
  one: "분수의 곱셈 · (분수)×(자연수)는 분모는 그대로 쓰고 분자에 자연수를 곱하고, (분수)×(분수)는 분자는 분자끼리, 분모는 분모끼리 곱해요." };
const UNIT_KEYWORDS = ["동수누가(같은 수를 여러 번 더하기)", "분모는 그대로", "분자에 자연수를 곱하기", "자연수와 분자를 곱하기", "분수만큼(분수 배)", "분자는 분자끼리", "분모는 분모끼리", "약분", "자연수와 진분수의 합", "가분수로 나타내기", "대분수", "어림셈", "넓이 모델", "곱하는 순서를 바꾸어도 결과가 같아요"];
const FX2_V57 = fx2VoteMin(57), FX2_V63 = fx2VoteMin(63), FX2_V59 = fx2VoteMin(59);

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 한옥 마을에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 분수의 곱셈을 이용할 수 있는 상황에는 무엇이 있을까요?",
  summary: "분수의 곱셈은 분수의 덧셈과 관련이 있어요. [1/4]+[1/4]+[1/4]처럼 같은 분수를 여러 번 더하는 것은 [1/4]×3으로 나타낼 수 있어요. 이 단원에서는 (분수)×(자연수), (자연수)×(분수), 진분수의 곱셈, (대분수)×(대분수)를 배워요. 분수만큼은 얼마인지, 대분수와 가분수 바꾸기, 분모가 같은 분수의 덧셈, 약분을 떠올려 두면 좋아요.",
  steps: [
    { name: "살펴보기", inst: "바닷속을 헤엄치는 향유고래 그림이에요. 향유고래는 이빨을 가진 동물 중 가장 큰 동물이고, 머리 길이가 몸길이의 [1/3]만큼이나 된대요. 몸길이가 16 m라면 머리 길이는 몇 m일까요?", hints: ["몸길이의 [1/3]만큼은 몸길이의 [1/3]배예요.", "머리는 몸의 일부분이니 몸길이보다 짧아요."],
      render: (b, a) => quiz(b, a, [
        { q: "머리 길이를 구하는 식으로 알맞은 것은?", fig: fx2Whale, o: ["16×[1/3]", "16+[1/3]", "16−[1/3]"], a: 0, why: { "1": "더하면 몸길이보다 길어져요. 몸길이의 [1/3]만큼은 16×[1/3]로 나타내요.", "2": "16−[1/3]은 몸길이보다 [1/3] m 짧은 길이예요. 몸길이의 [1/3]만큼은 16×[1/3]로 나타내요." } },
        { q: "머리 길이는 몸길이 16 m와 비교하면 어떨까요?", o: ["16 m보다 짧아요", "16 m보다 길어요", "16 m와 같아요"], a: 0, why: { "1": "[1/3]은 1보다 작아요. 16의 [1/3]만큼은 16보다 작아요.", "2": "[1/3]은 1이 아니에요. 16의 [1/3]만큼은 16보다 작아요." } }],
        { ok: "몸길이의 [1/3]만큼은 16×[1/3]로 나타내요. 분수를 곱했더니 16보다 작아져요. 이 단원에서 이런 분수의 곱셈을 배워요." }) },
    { name: "이야기하기", inst: "하준이와 사촌 동생 나은이는 한옥 마을에서 전통문화를 체험해요. 1인분에 물이 [1 1/2]컵 필요한 음식을 8인분 만들려고 해요. 분수의 곱셈은 분수의 덧셈과 어떤 관련이 있을까요?", hints: ["8인분이면 1인분의 물을 8번 넣어요.", "같은 수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요. 3+3+3+3 = 3×4처럼요."],
      render: (b, a) => blanks(b, a, ["물 [1 1/2]컵을 8번 넣는 것은 [1 1/2]을 ", { o: ["8번 더하는 것", "8로 나누는 것", "8에서 빼는 것"], a: 0 }, "과 같아요. 같은 수를 여러 번 더하는 것은 ", { o: ["곱셈", "뺄셈"], a: 0 }, "으로 나타낼 수 있으므로 ", { o: ["[1 1/2]×8", "[1 1/2]+8", "[1 1/2]−8"], a: 0 }, "로 나타내요."], { ok: "[1 1/2]을 8번 더한 것은 [1 1/2]×8이에요. 분수의 곱셈은 같은 분수를 여러 번 더하는 덧셈과 관련이 있어요." }) },
    { name: "떠올리기 ① 분수만큼", inst: "3학년 때 배운 ‘분수만큼은 얼마인지’를 떠올려요. 인절미 12개의 [3/4]은 몇 개일까요? 12개를 똑같이 4부분으로 나누고 3부분을 색칠해 보세요.", hints: ["12를 똑같이 4부분으로 나누면 한 부분은 3이에요.", "12의 [3/4]은 4부분 중 3부분이에요."],
      render: (b, a) => fx2Part(b, a, { N: 12, d: 4, n: 3, unit: "개", name: "인절미 12개", askCalc: [{ lab: "12의 [3/4]", n: 9, unit: "개", why: { "3": "3은 한 부분이에요. 3부분을 모두 세어요.", "4": "4부분으로 나누었어요. 색칠한 3부분이 몇 개인지 세어요." } }], ok: "12의 [1/4]은 3이고, 12의 [3/4]은 3의 3배인 9예요." }) },
    { name: "떠올리기 ② 대분수와 덧셈", inst: "대분수와 가분수를 바꾸고, 분모가 같은 진분수의 덧셈을 해 보세요.", hints: ["[2 1/4]에서 2는 [8/4]이에요.", "분모가 같은 분수의 덧셈은 분모는 그대로 쓰고 분자끼리 더해요."],
      render: (b, a) => fx2Chain(b, a, [
        ["[2 1/4] = ", { q: [null, "?9", "4"] }],
        ["[13/5] = ", { q: ["?2", "?3", "5"] }],
        ["[2/7]+[3/7] = ", { q: [null, "?5", "7"] }],
        ["[3/8]+[3/8]+[3/8] = ", { q: [null, "?9", "8"] }, " = ", { q: ["?1", "?1", "8"] }]], { ok: "대분수와 가분수를 바꾸고, 분모가 같은 분수를 더할 수 있어요. [3/8]을 3번 더한 것은 [3/8]×3과 같아요.", bad: "1 = [4/4] = [5/5]를 떠올려 바꾸고, 덧셈은 분모는 그대로 두고 분자끼리 더해요." }) },
    { name: "확인하기", inst: "약분을 떠올려요. 분수를 기약분수로 나타내 보세요.", hints: ["분모와 분자를 공약수로 나누어요.", "기약분수는 분모와 분자의 공약수가 1뿐인 분수예요. 최대공약수로 나누면 한 번에 돼요."],
      render: (b, a) => fx2Chain(b, a, [
        ["[6/8] = ", { q: [null, "?3", "?4"] }],
        ["[10/15] = ", { q: [null, "?2", "?3"] }],
        ["[12/18] = ", { q: [null, "?2", "?3"] }]], { ok: "약분을 잘 기억하고 있어요. 분수의 곱셈에서도 약분을 자주 써요.", bad: "분모와 분자를 최대공약수로 나누어 기약분수로 나타내요." }) }
  ],
  challenge: { inst: "1인분에 물이 [1 1/2]컵 필요한 음식을 8인분 만들려면 물은 모두 몇 컵 필요할까요? [1 1/2]을 8번 더해서 구해 보세요.", hints: ["자연수 부분 1을 8번 더하면 8이에요.", "[1/2]을 8번 더하면 [8/2] = 4예요."],
    render: (b, a) => fx2Calc(b, a, [
      { q: "필요한 물은 모두 몇 컵일까요?", x: "[1 1/2]×8", n: 12, unit: "컵", lab: "[1 1/2]×8 =", why: { "8": "자연수 부분만 더했어요. [1/2]을 8번 더한 것도 더해요.", "9": "[1/2]을 8번 더하면 [8/2] = 4예요." } },
      { q: "[1/3]+[1/3]+[1/3]+[1/3]+[1/3]을 곱셈식으로 나타내면?", pick: ["[1/3]×5", "[5/3]×5", "[1/15]"], a: 0, why: { "1": "[1/3]을 5번 더했어요. 더한 수는 [1/3]이에요.", "2": "분모끼리 더하면 안 돼요. [1/3]을 5번 더하면 [5/3]예요." } }],
      { ok: "물은 모두 12컵 필요해요. 같은 분수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요." }) }
},
{
  id: "t2", no: 2, title: "(진분수)×(자연수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(진분수)×(자연수)는 어떻게 계산할까요?",
  summary: "(진분수)×(자연수)는 분수의 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산해요. [3/5]×2 = [3/5]+[3/5] = [3×2/5] = [6/5] = [1 1/5]. 약분은 분자와 자연수를 곱한 후에 해도 되고, 분모와 자연수를 먼저 약분해도 돼요.",
  steps: [
    { name: "만져 보기", inst: "하준이와 나은이는 맷돌로 콩을 갈아 두부를 만드는 체험장에 왔어요. 나은이는 같은 컵으로 물을 [1/4]컵씩 3번 넣었어요. 물을 담아 보고, 넣은 물은 모두 몇 컵인지 알아보세요.", hints: ["‘한 번 담기’를 3번 눌러요.", "[1/4]컵씩 3번은 [1/4]컵의 3배, [1/4]×3이에요."],
      render: (b, a) => fx2Pour(b, a, { d: 4, amt: "1/4", k: 3, unit: "컵", ask: [
        ["[1/4]컵씩 3번 넣은 것은 [1/4]컵의 ", { i: "3" }, "배이므로 [1/4]×", { i: "3" }, "으로 나타내요."],
        ["[1/4]×3 = [1/4]+[1/4]+[1/4] = ", { q: [null, "?3", "4"] }]], ok: "넣은 물은 모두 [3/4]컵이에요. [1/4]×3은 [1/4]을 3번 더한 것과 같아요." }) },
    { name: "그려 보기", inst: "[3/5]×2를 그림으로 알아보세요. 막대에 [3/5]만큼씩 2번 색칠한 다음 계산해요.", hints: ["[3/5]은 [1/5]이 3개예요. 2번이면 [1/5]이 몇 개일까요?", "분모 5는 그대로 두고 분자 3에 2를 곱해요."],
      render: (b, a) => fx2Pour(b, a, { d: 5, amt: "3/5", k: 2, tip: "막대 하나가 1이고 작은 칸 하나는 [1/5]이에요.", ask: [
        ["[3/5]×2 = [3/5]+[3/5] = ", { q: [null, ["3", "+", "?3"], "5"] }, " = ", { q: [null, ["3", "×", "?2"], "5"] }, " = ", { q: [null, "?6", "5"] }, " = ", { q: ["?1", "?1", "5"] }]], ok: "[3/5]×2 = [6/5] = [1 1/5]이에요. 분모는 그대로 쓰고 분자에 자연수를 곱했어요." }) },
    { name: "말해 보기", inst: "윤호와 예린이가 [3/10]×8을 서로 다른 방법으로 계산했어요. 빈칸을 채우고, 약분을 언제 했는지 살펴보세요.", hints: ["윤호는 3×8을 먼저 하고 [24/10]를 약분했어요.", "예린이는 분모 10과 자연수 8을 2로 먼저 약분했어요. 10은 5가 되고 8은 4가 돼요."],
      render: (b, a) => fx2Chain(b, a, [
        { t: "윤호", p: ["[3/10]×8 = ", { q: [null, ["3", "×", "?8"], "10"] }, " = ", { q: [null, "?24", "10"] }, " = ", { q: [null, "?12", "5"] }, " = ", { q: ["?2", "?2", "5"] }] },
        { t: "예린", p: ["분모 10과 자연수 8을 ", { i: "2" }, "로 약분하면 [3/10]×8 = ", { q: [null, ["3", "×", "?4"], "?5"] }, " = ", { q: [null, "?12", "5"] }, " = ", { q: ["?2", "?2", "5"] }] },
        ["윤호는 ", { c: ["분자와 자연수를 곱한 후 약분했어요", "분모와 자연수를 먼저 약분했어요"], a: 0 }],
        ["예린이는 ", { c: ["분자와 자연수를 곱한 후 약분했어요", "분모와 자연수를 먼저 약분했어요"], a: 1 }]],
        { ok: "약분을 언제 하든 결과는 [2 2/5]로 같아요. 편리한 방법을 골라 계산해요." }) },
    { name: "약속하기", inst: "(진분수)×(자연수)의 계산 방법을 약속해요.", hints: ["[3/5]×2 = [3×2/5]에서 분모 5는 어떻게 되었나요?"],
      render: (b, a) => blanks(b, a, ["(진분수)×(자연수)는 분수의 분모는 ", { o: ["그대로 쓰고", "자연수를 곱하고"], a: 0 }, " 분자에 ", { o: ["자연수를 곱하여", "자연수를 더하여"], a: 0 }, " 계산합니다. 약분은 ", { o: ["곱한 후에 해도 되고, 먼저 해도 돼요", "반드시 곱하기 전에 해야 해요"], a: 0 }, "."], { ok: "(진분수)×(자연수)는 분수의 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산합니다." }) },
    { name: "확인하기", inst: "계산해 보세요. 약분하지 않아도, 가분수로 써도 맞아요.", hints: ["[5/6]×4에서 6과 4를 2로 약분할 수 있어요.", "[3/4]×8에서 4와 8을 4로 약분하면 3×2예요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[2/7]×2", a: "4/7" }, { e: "[5/6]×4", a: "3 1/3" }, { e: "[3/4]×8", n: 6, why: { "24": "분자 3에 8을 곱한 [24/4]는 6이에요." } },
        { q: "한 변의 길이가 [3/4] cm인 정육각형의 둘레는 몇 cm일까요?", x: "[3/4]×6", a: "4 1/2", unit: "cm", lab: "[3/4]×6 =" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["[2/9]×18에서 9와 18을 9로 약분하면 2×2예요.", "두 식을 각각 계산하여 대분수로 비교해요."],
    render: (b, a) => fx2Calc(b, a, [
      { e: "[5/6]×3", a: "2 1/2" }, { e: "[2/9]×18", n: 4 }, { q: "빈 곳에 알맞은 수를 써요.", e: "[3/14]×7", a: "1 1/2" },
      { q: "곱의 크기를 비교해요.", e: "[3/10]×8 ○ [8/35]×7", pick: [">", "=", "<"], a: 0, why: { "1": "[3/10]×8 = [2 2/5], [8/35]×7 = [1 3/5]이에요.", "2": "[3/10]×8 = [2 2/5], [8/35]×7 = [1 3/5]이에요." } },
      { q: "연서는 한 묶음에 [11/20] m인 털실을 12묶음 샀어요. 연서가 산 털실은 모두 몇 m일까요?", x: "[11/20]×12", a: "6 3/5", unit: "m", lab: "[11/20]×12 =" }]) }
},
{
  id: "t3", no: 3, title: "(대분수)×(자연수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(대분수)×(자연수)는 어떻게 계산할까요?",
  summary: "(대분수)×(자연수)는 대분수를 자연수와 진분수의 합으로 나타내어 계산하거나, 대분수를 가분수로 나타내어 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산해요. [1 1/5]×3 = 3+[3/5] = [3 3/5], [1 1/5]×3 = [6/5]×3 = [18/5] = [3 3/5]. 대분수의 분모와 자연수를 바로 약분하면 결과가 달라져요.",
  steps: [
    { name: "만져 보기", inst: "인절미 체험장이에요. 만든 떡에 콩고물을 묻혀 고소한 인절미를 만들어요. 하준이는 한 봉지에 [1 1/5] kg인 콩고물을 3봉지 사용했어요. 먼저 어림한 다음, 콩고물을 3봉지 담고 ‘모으기’를 눌러 자연수끼리, 진분수끼리 모아 보세요.", hints: ["한 봉지는 1 kg 막대 하나와 [1/5] kg 한 칸이에요.", "자연수끼리 모으면 1×3, 진분수끼리 모으면 [1/5]×3이에요."],
      render: (b, a) => fx2Pour(b, a, { d: 5, amt: "1 1/5", k: 3, unit: " kg", tip: "막대 하나가 1 kg이고 작은 칸 하나는 [1/5] kg이에요.",
        est: { q: "사용한 콩고물은 몇 kg쯤일까요?", o: ["3 kg보다 조금 더 많아요", "3 kg보다 적어요", "6 kg쯤이에요"], a: 0, why: { "1": "[1 1/5]은 1보다 커요. 1×3 = 3이니 3 kg보다 많아요.", "2": "[1 1/5]은 2보다 훨씬 작아요. 2×3 = 6보다 작아요." }, ok: "1×3 = 3이고 [1 1/5]은 1보다 조금 크니까 3 kg보다 조금 더 많을 거예요." },
        ask: [{ t: "방법 1", p: ["[1 1/5]×3 = (1+1+1)+([1/5]+[1/5]+[1/5]) = (1×", { i: "3" }, ")+([1/5]×", { i: "3" }, ") = ", { i: "3" }, "+", { q: [null, "?3", "5"] }, " = ", { q: ["?3", "?3", "5"] }] }],
        ok: "사용한 콩고물은 [3 3/5] kg이에요. 어림한 ‘3 kg보다 조금 더’와 비슷해요. 대분수를 자연수와 진분수의 합으로 나타내어 계산했어요." }) },
    { name: "그려 보기", inst: "[1 1/5]을 가분수로 나타내면 [6/5]이에요. 수직선에서 [6/5]만큼씩 3번 뛰어 [1 1/5]×3을 알아보세요.", hints: ["[6/5]은 작은 눈금 6칸이에요.", "가분수로 바꾸면 분모는 그대로 쓰고 분자에 자연수를 곱해요."],
      render: (b, a) => fx2Jump(b, a, { max: 4, d: 5, step: "6/5", k: 3, ask: [
        { t: "방법 2", p: ["[1 1/5]×3 = ", { q: [null, "?6", "5"] }, "×3 = ", { q: [null, ["6", "×", "?3"], "5"] }, " = ", { q: [null, "?18", "5"] }, " = ", { q: ["?3", "?3", "5"] }] }],
        ok: "[6/5]씩 3번 뛰면 [18/5] = [3 3/5]에 도착해요. 방법 1과 결과가 같아요." }) },
    { name: "말해 보기", inst: "주아와 수현이가 [2 2/9]×6을 대분수를 가분수로 바꾸어 계산했어요. 빈칸을 채우고 두 방법을 비교해 보세요.", hints: ["[2 2/9] = [20/9]이에요.", "수현이는 가분수로 바꾼 뒤 분모 9와 자연수 6을 3으로 약분했어요."],
      render: (b, a) => fx2Chain(b, a, [
        { t: "주아", p: ["[2 2/9]×6 = ", { q: [null, "?20", "9"] }, "×6 = ", { q: [null, ["20", "×", "?6"], "9"] }, " = ", { q: [null, "?120", "9"] }, " = ", { q: [null, "?40", "3"] }, " = ", { q: ["?13", "?1", "3"] }] },
        { t: "수현", p: ["[2 2/9]×6 = [20/9]×6 = ", { q: [null, ["20", "×", "?2"], "?3"] }, " = ", { q: [null, "?40", "3"] }, " = ", { q: ["?13", "?1", "3"] }] },
        ["주아는 분자에 자연수를 곱한 후 약분했고, 수현이는 ", { c: ["가분수로 바꾼 뒤 분모와 자연수를 약분한 후 계산했어요", "대분수의 분모와 자연수를 바로 약분했어요"], a: 0 }, "."],
        ["대분수의 분모 9와 자연수 6을 바로 약분하면 ", { c: ["결과가 달라져요", "결과가 같아요"], a: 0 }, "."]],
        { ok: "두 방법 모두 [13 1/3]이에요. 약분은 대분수를 가분수로 바꾼 뒤에 해요." }) },
    { name: "약속하기", inst: "(대분수)×(자연수)의 계산 방법을 정리해요.", hints: ["방법 1은 [1 1/5]을 1+[1/5]로, 방법 2는 [6/5]으로 나타냈어요."],
      render: (b, a) => blanks(b, a, ["(대분수)×(자연수)는 대분수를 ", { o: ["자연수와 진분수의 합", "분자와 분모의 합"], a: 0 }, "으로 나타내어 계산하거나, 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내어 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산해요."], { ok: "두 방법 모두 쓸 수 있어요. 편리한 방법을 골라 계산해요." }) },
    { name: "확인하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["[2 5/6] = [17/6]이에요. 6과 8을 2로 약분할 수 있어요.", "[1 3/10] = [13/10]이에요. 10과 5를 5로 약분해요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[1 1/7]×4", a: "4 4/7" }, { e: "[2 5/6]×8", a: "22 2/3" }, { e: "[1 3/10]×5", a: "6 1/2" },
        { q: "민지는 주말농장에서 감자를 [1 7/12] kg 캤어요. 어머니는 민지가 캔 감자의 4배를 캤어요. 어머니가 캔 감자는 몇 kg일까요?", x: "[1 7/12]×4", a: "6 1/3", unit: "kg", lab: "[1 7/12]×4 =" }]) }
  ],
  challenge: { inst: "친구가 [1 7/10]×6을 잘못 계산했어요. 잘못된 까닭을 고르고 옳게 계산해 보세요. 그리고 수 [7 3/4], 12, 8, [3 5/6] 중 가장 작은 수와 가장 큰 수의 곱도 구해요.", hints: ["대분수를 가분수로 바꾼 뒤에 약분해요. [1 7/10] = [17/10]이에요.", "가장 작은 수는 [3 5/6], 가장 큰 수는 12예요. [3 5/6] = [23/6]이에요."],
    render: (b, a) => fx2Chain(b, a, [
      ["잘못된 계산: [1 7/10]×6 = [1 7/5]×3 = [12/5]×3 = [36/5] = [7 1/5]"],
      ["까닭: ", { c: ["대분수를 가분수로 바꾸지 않고 대분수의 분모와 자연수를 약분했어요", "분모에도 자연수를 곱했어요"], a: 0 }],
      { t: "옳은 계산", p: ["[1 7/10]×6 = ", { q: [null, "?17", "10"] }, "×6 = ", { q: [null, ["17", "×", "?3"], "5"] }, " = ", { q: [null, "?51", "5"] }, " = ", { q: ["?10", "?1", "5"] }] },
      ["가장 작은 수와 가장 큰 수의 곱: ", { f: "46" }]],
      { ok: "옳은 계산은 [10 1/5]이고, [3 5/6]×12 = 46이에요." }) }
},
{
  id: "t4", no: 4, title: "(자연수)×(진분수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(자연수)×(진분수)는 어떻게 계산할까요?",
  summary: "6의 [1/3]은 6의 [1/3]배와 같고 6×[1/3]로 나타내요. (자연수)×(진분수)는 분수의 분모는 그대로 쓰고 자연수와 분자를 곱하여 계산해요. 2×[2/3] = [2×2/3] = [4/3] = [1 1/3]. 두 수의 곱셈은 순서를 바꾸어 계산해도 결과가 같아요.",
  steps: [
    { name: "만져 보기", inst: "전통 빗자루 체험장이에요. 갈대, 수수, 싸리 같은 재료로 만든 빗자루 대에 끈을 묶어요. 나은이는 끈 6 m의 [1/3]만큼을 사용했어요. 6 m 막대를 똑같이 3부분으로 나누고 1부분을 색칠해 보세요.", hints: ["6의 [1/3]은 6을 똑같이 3으로 나눈 것 중 1이에요.", "6의 3배는 6×3이니까, 6의 [1/3]배는 6×[1/3]이에요."],
      render: (b, a) => fx2Part(b, a, { N: 6, d: 3, n: 1, unit: " m", name: "끈 6 m", askCalc: [{ lab: "6×[1/3] =", x: "6×[1/3]", n: 2, unit: "m", why: { "18": "6의 [1/3]배는 6을 3으로 나눈 것 중 1이에요. 6×3이 아니에요.", "3": "6을 똑같이 3부분으로 나누면 한 부분은 2예요." } }],
        ok: "6의 [1/3]은 6의 [1/3]배와 같아요. 6×[1/3] = 2이므로 나은이가 사용한 끈은 2 m예요." }) },
    { name: "그려 보기", inst: "2×[1/3]과 2×[2/3]를 그림으로 알아보세요. 0부터 2까지의 막대를 똑같이 3부분으로 나누고 2×[2/3]만큼(2부분) 색칠해요. 각각의 1을 3등분한 작은 눈금도 살펴보세요.", hints: ["2를 똑같이 3부분으로 나누면 한 부분은 [1/3]이 2개인 [2/3]예요.", "2×[2/3]는 2×[1/3]의 2배예요."],
      render: (b, a) => fx2Part(b, a, { N: 2, d: 3, n: 2, name: "2", ask: [
        ["2×[1/3] = ", { q: [null, "?2", "3"] }],
        ["2×[2/3] = (2×[1/3])×", { i: "2" }, " = ", { q: [null, "?2", "3"] }, "×2 = ", { q: [null, ["2", "×", "?2"], "3"] }, " = ", { q: [null, "?4", "3"] }, " = ", { q: ["?1", "?1", "3"] }]],
        ok: "2×[1/3]은 [1/3]이 2개인 [2/3]이고, 2×[2/3]는 그 2배인 [4/3] = [1 1/3]이에요." }) },
    { name: "말해 보기", inst: "(진분수)×(자연수)인 [2/3]×2와 (자연수)×(진분수)인 2×[2/3]를 계산하여 비교해 보세요.", hints: ["두 식 모두 분모 3은 그대로 쓰고 2와 2를 곱해요."],
      render: (b, a) => fx2Chain(b, a, [
        ["[2/3]×2 = ", { q: [null, ["2", "×", "?2"], "3"] }, " = ", { q: [null, "?4", "3"] }, " = ", { q: ["?1", "?1", "3"] }],
        ["2×[2/3] = ", { q: [null, ["2", "×", "?2"], "3"] }, " = ", { q: [null, "?4", "3"] }, " = ", { q: ["?1", "?1", "3"] }],
        ["두 곱셈은 계산 방법과 결과가 ", { c: ["같아요", "달라요"], a: 0 }, ". 두 수의 곱셈은 순서를 바꾸어 계산해도 결과가 ", { c: ["같아요", "달라져요"], a: 0 }, "."]],
        { ok: "두 수의 곱셈은 순서를 바꾸어 계산해도 계산 결과가 같습니다." }) },
    { name: "약속하기", inst: "(자연수)×(진분수)의 계산 방법을 약속해요.", hints: ["6의 3배가 6×3인 것처럼 6의 [1/3]배는 6×[1/3]이에요."],
      render: (b, a) => blanks(b, a, ["6의 [1/3]은 6의 [1/3]배와 같으므로 ", { o: ["6×[1/3]", "6+[1/3]", "6−[1/3]"], a: 0 }, "로 나타내요. (자연수)×(진분수)는 분수의 분모는 ", { o: ["그대로 쓰고", "자연수를 곱하고"], a: 0 }, " 자연수와 ", { o: ["분자를 곱하여", "분모를 곱하여"], a: 0 }, " 계산합니다."], { ok: "(자연수)×(진분수)는 분수의 분모는 그대로 쓰고 자연수와 분자를 곱하여 계산합니다." }) },
    { name: "확인하기", inst: "계산해 보세요. 약분하지 않아도, 가분수로 써도 맞아요.", hints: ["7×[1/5] = [7/5]이에요.", "12×[4/9]에서 12와 9를 3으로 약분할 수 있어요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "3×[1/4]", a: "3/4" }, { e: "7×[1/5]", a: "1 2/5" }, { e: "5×[3/8]", a: "1 7/8" }, { e: "12×[4/9]", a: "5 1/3" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["40×[9/20]에서 40과 20을 20으로 약분하면 2×9예요.", "곱하는 두 수의 순서만 바뀐 식은 곱이 같아요."],
    render: (b, a) => fx2Calc(b, a, [
      { e: "2×[3/4]", a: "1 1/2" }, { e: "10×[11/12]", a: "9 1/6" }, { e: "12×[5/8]", a: "7 1/2" },
      { q: "어항에 물고기가 40마리 있어요. 그중 [9/20]만큼이 수컷이에요. 수컷은 몇 마리일까요?", x: "40×[9/20]", n: 18, unit: "마리", lab: "40×[9/20] =" },
      { q: "곱이 다른 사람은 누구일까요? 승민: 15×[7/10] · 은서: 10×[7/15] · 준희: [7/15]×10", pick: ["승민", "은서", "준희"], a: 0, why: { "1": "은서와 준희의 식은 곱하는 두 수의 순서만 바뀌었어요. 곱이 같아요.", "2": "은서와 준희의 식은 곱하는 두 수의 순서만 바뀌었어요. 곱이 같아요." } }]) }
},
{
  id: "t5", no: 5, title: "(자연수)×(대분수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(자연수)×(대분수)는 어떻게 계산할까요?",
  summary: "(자연수)×(대분수)는 대분수를 자연수와 진분수의 합으로 나타내어 계산하거나, 대분수를 가분수로 나타내어 분모는 그대로 쓰고 자연수와 분자를 곱하여 계산해요. 3×[1 1/4] = 3+[3/4] = [3 3/4], 3×[1 1/4] = 3×[5/4] = [15/4] = [3 3/4]. (자연수)×(진분수)는 (자연수)×1보다 작고, (자연수)×(대분수)는 (자연수)×1보다 커요.",
  steps: [
    { name: "만져 보기", inst: "한옥 마을의 아름다운 돌담길이에요. 나은이는 3 km를 걸으려고 하고, 하준이는 나은이가 걸으려는 거리의 [1 1/4]만큼을 걸으려고 해요. 먼저 어림한 다음, ‘3×1’ 막대를 색칠하고, 3 km를 똑같이 4부분으로 나누어 3×[1/4]만큼 색칠해 보세요.", hints: ["3 km의 [1 1/4]만큼은 3×1과 3×[1/4]을 더한 것이에요.", "3을 똑같이 4부분으로 나누면 한 부분은 [3/4]이에요."],
      render: (b, a) => fx2Part(b, a, { N: 3, d: 4, n: 1, unit: " km", name: "3×[1/4]", whole: 1,
        est: { q: "하준이는 몇 km쯤 걸을까요?", o: ["3 km보다 조금 더 많이", "3 km보다 적게", "6 km쯤"], a: 0, why: { "1": "[1 1/4]은 1보다 커요. 3×1 = 3보다 많아요.", "2": "[1 1/4]은 2보다 작아요. 3×2 = 6보다 적어요." }, ok: "3×1 = 3이고 [1 1/4]은 1보다 조금 크니까 3 km보다 조금 더 많이 걸을 거예요." },
        ask: [{ t: "방법 1", p: ["3×[1 1/4] = (3×1)+(3×[1/4]) = ", { i: "3" }, "+", { q: [null, "?3", "4"] }, " = ", { q: ["?3", "?3", "4"] }] }],
        ok: "3×[1 1/4] = [3 3/4]이에요. 대분수를 자연수와 진분수의 합으로 나타내어 계산했어요." }) },
    { name: "그려 보기", inst: "이번에는 [1 1/4]을 가분수로 나타내어 3×[1 1/4]을 계산해 보세요.", hints: ["[1 1/4] = [5/4]예요.", "분모 4는 그대로 쓰고 3과 5를 곱해요."],
      render: (b, a) => fx2Chain(b, a, [
        { t: "방법 2", p: ["3×[1 1/4] = 3×", { q: [null, "?5", "4"] }, " = ", { q: [null, ["3", "×", "?5"], "4"] }, " = ", { q: [null, "?15", "4"] }, " = ", { q: ["?3", "?3", "4"] }] },
        ["하준이가 걸으려는 거리는 ", { f: "3 3/4" }, " km로, 어림한 ‘3 km보다 조금 더’와 ", { c: ["비슷해요", "많이 달라요"], a: 0 }, "."]],
        { ok: "두 방법 모두 [3 3/4] km예요." }) },
    { name: "말해 보기", inst: "4×[2/5], 4×1, 4×[1 2/5]의 크기를 비교해 보세요. 1을 기준으로 [2/5]와 [1 2/5]의 크기를 생각해 봐요.", hints: ["[2/5]는 1보다 작고, [1 2/5]는 1보다 커요.", "4×[1 2/5] = 4×[7/5]이에요."],
      render: (b, a) => fx2Chain(b, a, [
        ["4×[2/5] ", { c: [">", "=", "<"], a: 2 }, " 4×1 ", { c: [">", "=", "<"], a: 2 }, " 4×[1 2/5]"],
        ["4×[2/5] = ", { f: "1 3/5" }],
        ["4×[1 2/5] = 4×[7/5] = ", { f: "5 3/5" }],
        ["(자연수)×(진분수)는 (자연수)×1보다 ", { c: ["더 작고", "더 크고"], a: 0 }, ", (자연수)×(대분수)는 (자연수)×1보다 ", { c: ["더 커요", "더 작아요"], a: 0 }, "."]],
        { ok: "1보다 작은 수를 곱하면 곱이 처음 수보다 작아지고, 1보다 큰 수를 곱하면 커져요. 곱셈을 하면 항상 커지는 것은 아니에요." }) },
    { name: "약속하기", inst: "(자연수)×(대분수)의 계산 방법을 정리해요.", hints: ["방법 1은 (3×1)+(3×[1/4]), 방법 2는 3×[5/4]였어요."],
      render: (b, a) => blanks(b, a, ["(자연수)×(대분수)는 대분수를 ", { o: ["자연수와 진분수의 합", "분자와 분모의 합"], a: 0 }, "으로 나타내어 계산하거나, 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내어 분모는 그대로 쓰고 ", { o: ["자연수와 분자를 곱하여", "자연수와 분모를 곱하여"], a: 0 }, " 계산해요."], { ok: "두 방법 중 편리한 방법을 골라 계산해요." }) },
    { name: "확인하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["[1 1/5] = [6/5], [2 2/9] = [20/9], [1 2/3] = [5/3]예요.", "9×[5/3]에서 9와 3을 3으로 약분하면 3×5예요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "7×[1 1/5]", a: "8 2/5" }, { e: "5×[2 2/9]", a: "11 1/9" }, { e: "9×[1 2/3]", n: 15 },
        { q: "세로가 4 m인 텃밭의 가로는 세로의 [1 5/8]배예요. 텃밭의 가로는 몇 m일까요?", x: "4×[1 5/8]", a: "6 1/2", unit: "m", lab: "4×[1 5/8] =" }]) }
  ],
  challenge: { inst: "수 카드 1, 4, 6을 한 번씩 모두 사용하여 가장 큰 대분수를 만들고, 2와 그 대분수의 곱을 구해 보세요.", hints: ["가장 큰 대분수는 자연수 부분에 가장 큰 수를 놓아요.", "남은 두 카드로 진분수를 만들어요. 분자가 분모보다 작아야 해요."],
    render: (b, a) => fx2Build(b, a, { cards: [1, 4, 6], shape: [2, "m"], goal: "max", maxMsg: "가장 큰 대분수가 아니에요. 자연수 부분에 가장 큰 수를 놓고, 남은 두 카드로 진분수를 만들어요.", ok: "가장 큰 대분수는 [6 1/4]이에요." }) }
},
{
  id: "t67", no: "6~7", title: "진분수의 곱셈을 알아볼까요", soop: "개념 구축하기(O)",
  question: "진분수의 곱셈은 어떻게 계산할까요?",
  summary: "(진분수)×(진분수)는 분자는 분자끼리, 분모는 분모끼리 곱하여 계산해요. [4/5]×[2/3] = [4×2/5×3] = [8/15]. 분모끼리의 곱은 전체를 똑같이 나눈 칸 수, 분자끼리의 곱은 빗금 친 칸 수예요. 세 분수의 곱셈도 같은 방법으로 해요. 나눈 조각의 크기는 모두 같아야 해요.",
  steps: [
    { name: "만져 보기", inst: "조각보 체험장이에요. 조각보는 색색의 천 조각을 이어 만든 것이에요. 하준이는 빨간색 천 한 장의 [1/5] 중에서 [1/3]만큼을 사용했어요. 넓이가 1인 천을 세로로 5등분하여 1칸을 색칠하고(1단계), 가로로 3등분하여 색칠한 부분의 [1/3]만큼 빗금을 그어 보세요(2단계).", hints: ["[1/5]의 [1/3]은 [1/5]×[1/3]이에요.", "전체를 5×3 = 15칸으로 나눈 것 중 1칸이에요."],
      render: (b, a) => fx2Area(b, a, { whole: "빨간색 천 한 장 = 1", stages: [{ dir: "v", d: 5, n: 1, t: "[1/5] 색칠하기" }, { dir: "h", d: 3, n: 1, t: "그 [1/3]만큼 빗금" }], ask: [
        ["[1/5]×[1/3] = ", { q: [null, "1", ["5", "×", "?3"]] }, " = ", { q: [null, "?1", "?15"] }]],
        ok: "하준이가 사용한 천은 빨간색 천 전체의 [1/15]이에요. 전체를 똑같이 5×3 = 15칸으로 나눈 것 중 1칸이에요." }) },
    { name: "그려 보기", inst: "[4/5]×[2/3]를 그림으로 알아보세요. 전체를 세로로 5등분한 것 중 4를 색칠하고, 가로로 3등분하여 색칠한 부분의 [2/3]만큼 빗금을 그어 보세요.", hints: ["어떤 수의 [2/3]는 어떤 수를 3등분한 것 중 2예요.", "빗금 친 칸은 4×2 = 8칸, 전체는 5×3 = 15칸이에요."],
      render: (b, a) => fx2Area(b, a, { stages: [{ dir: "v", d: 5, n: 4, t: "[4/5] 색칠하기" }, { dir: "h", d: 3, n: 2, t: "그 [2/3]만큼 빗금" }], ask: [
        ["전체를 똑같이 5×3 = ", { i: "15" }, "칸으로 나누었고, 빗금 친 부분은 4×2 = ", { i: "8" }, "칸이에요."],
        ["[4/5]×[2/3] = ", { q: [null, ["4", "×", "?2"], ["5", "×", "?3"]] }, " = ", { q: [null, "?8", "?15"] }]],
        ok: "[4/5]×[2/3] = [8/15]이에요. 분자끼리 곱한 8은 빗금 친 칸 수, 분모끼리 곱한 15는 전체 칸 수예요." }) },
    { name: "세 분수의 곱셈", inst: "[3/5]×[1/2]×[3/4]을 그림으로 알아보세요. [3/5]을 색칠하고(1단계), 그 [1/2]만큼 빗금을 긋고(2단계), 빗금 친 줄을 다시 4등분하여 그중 3만큼 진하게 빗금을 그어 보세요(3단계).", hints: ["3단계에서는 빗금 친 줄 안의 작은 줄을 3개 골라요.", "전체는 5×2×4 = 40칸, 진한 빗금은 3×1×3 = 9칸이에요."],
      render: (b, a) => fx2Area(b, a, { stages: [{ dir: "v", d: 5, n: 3, t: "[3/5] 색칠하기" }, { dir: "h", d: 2, n: 1, t: "그 [1/2]만큼 빗금" }, { dir: "h2", d: 4, n: 3, t: "다시 그 [3/4]만큼 진한 빗금" }], ask: [
        ["전체를 똑같이 5×2×4 = ", { i: "40" }, "칸으로 나누었고, 진한 빗금은 3×1×3 = ", { i: "9" }, "칸이에요."],
        ["[3/5]×[1/2]×[3/4] = ", { q: [null, ["3", "×", "1", "×", "?3"], ["5", "×", "2", "×", "?4"]] }, " = ", { q: [null, "?9", "?40"] }]],
        ok: "세 분수의 곱셈도 분자는 분자끼리, 분모는 분모끼리 곱해요. [3/5]×[1/2]×[3/4] = [9/40]예요." }) },
    { name: "여러 가지 방법", inst: "윤호와 가은이가 [7/10]×[15/28]를 서로 다른 방법으로 계산했어요. 빈칸을 채우고 비교해 보세요.", hints: ["7과 28을 7로 약분하면 1과 4, 15와 10을 5로 약분하면 3과 2예요.", "가은이는 곱하기 전에 [7/10]과 [15/28]를 먼저 약분했어요."],
      render: (b, a) => fx2Chain(b, a, [
        { t: "윤호", p: ["[7/10]×[15/28] = ", { q: [null, ["7", "×", "15"], ["10", "×", "28"]] }, " = ", { q: [null, ["?1", "×", "?3"], ["?2", "×", "?4"]] }, " = ", { q: [null, "?3", "?8"] }] },
        { t: "가은", p: ["[7/10]×[15/28] = ", { q: [null, "?1", "?2"] }, "×", { q: [null, "?3", "?4"] }, " = ", { q: [null, "?3", "?8"] }] },
        ["윤호는 분자끼리, 분모끼리 곱하는 과정에서 약분했고, 가은이는 ", { c: ["먼저 약분한 후 곱했어요", "곱한 후에 약분했어요"], a: 0 }, "."]],
        { ok: "두 방법 모두 [3/8]이에요. 약분을 먼저 하면 곱하는 수가 작아져 계산이 쉬워요." }) },
    { name: "약속하기", inst: "(진분수)×(진분수)의 계산 방법을 약속해요.", hints: ["[4/5]×[2/3] = [4×2/5×3]이었어요."],
      render: (b, a) => blanks(b, a, ["(진분수)×(진분수)는 분자는 ", { o: ["분자끼리", "분모끼리"], a: 0 }, ", 분모는 ", { o: ["분모끼리", "분자끼리"], a: 0 }, " 곱하여 계산합니다. 분모끼리의 곱은 전체를 똑같이 나눈 ", { o: ["칸 수", "빗금 친 칸 수"], a: 0 }, ", 분자끼리의 곱은 ", { o: ["빗금 친 칸 수", "전체 칸 수"], a: 0 }, "예요."], { ok: "(진분수)×(진분수)는 분자는 분자끼리, 분모는 분모끼리 곱하여 계산합니다." }) },
    { name: "확인하기", inst: "계산해 보세요. 약분하지 않아도 맞아요.", hints: ["[7/12]×[9/14]에서 7과 14, 12와 9를 약분할 수 있어요.", "[4/7]×[5/8]×[1/3]에서 4와 8을 4로 약분해요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[1/3]×[1/4]", a: "1/12" }, { e: "[7/9]×[5/8]", a: "35/72" }, { e: "[7/12]×[9/14]", a: "3/8" }, { e: "[4/7]×[5/8]×[1/3]", a: "5/42" },
        { q: "반 학생의 [4/7]는 여학생이고, 여학생 중 [7/12]은 안경을 썼어요. 안경을 쓴 여학생은 반 전체의 얼마일까요?", x: "[4/7]×[7/12]", a: "1/3", lab: "[4/7]×[7/12] =" }]) }
  ],
  challenge: { inst: "수 카드 2, 3, 5, 6, 8, 9 중에서 4장을 골라 한 번씩만 사용하여 진분수의 곱셈식을 만들고 계산해 보세요. 여러 가지 식을 만들 수 있어요.", hints: ["진분수는 분자가 분모보다 작아요.", "예를 들어 [2/5]×[8/9]처럼 만들 수 있어요."],
    render: (b, a) => fx2Build(b, a, { cards: [2, 3, 5, 6, 8, 9], shape: ["p", "p"], goal: "any", ok: "진분수의 곱셈식을 만들어 계산했어요!" }) }
},
{
  id: "t8", no: 8, title: "(대분수)×(대분수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(대분수)×(대분수)는 어떻게 계산할까요?",
  summary: "(대분수)×(대분수)는 곱하는 대분수를 자연수와 진분수의 합으로 나타내어 계산하거나 두 대분수를 가분수로 나타내어 계산해요. [1 1/2]×[1 1/4] = ([1 1/2]×1)+([1 1/2]×[1/4]) = [1 1/2]+[3/8] = [1 7/8], [1 1/2]×[1 1/4] = [3/2]×[5/4] = [15/8] = [1 7/8]. 대분수를 가분수로 바꾸지 않고 진분수 부분끼리 약분하면 안 돼요.",
  steps: [
    { name: "만져 보기", inst: "멍석 체험장이에요. 멍석은 짚으로 만든 큰 깔개로, 바닥에 깔거나 곡식을 널어 말릴 때 써요. 하준이네가 만든 직사각형 멍석은 가로 [1 1/2] m, 세로 [1 1/4] m예요. 먼저 넓이를 어림한 다음, 세로를 1 m와 [1/4] m로 나누어 보세요.", hints: ["(직사각형의 넓이) = (가로)×(세로)예요.", "파란 부분은 [1 1/2]×1, 노란 부분은 [1 1/2]×[1/4]이에요."],
      render: (b, a) => fx2Mat(b, a, { A: "1 1/2", B: "1 1/4", mode: 1,
        est: { q: "멍석의 넓이는 약 몇 m²일까요?", o: ["약 2 m²", "약 1 m²", "약 4 m²"], a: 0, why: { "1": "가로 [1 1/2] m는 약 2 m, 세로 [1 1/4] m는 약 1 m예요.", "2": "가로는 약 2 m, 세로는 약 1 m예요. 2×1은 얼마일까요?" }, ok: "가로가 약 2 m, 세로가 약 1 m이니까 넓이는 약 2 m²예요." },
        ask: [{ t: "방법 1", p: ["[1 1/2]×[1 1/4] = ([1 1/2]×1)+([1 1/2]×[1/4]) = [1 1/2]+([3/2]×[1/4]) = [1 1/2]+", { q: [null, "?3", "?8"] }, " = ", { q: [null, "?12", "8"] }, "+[3/8] = ", { q: [null, "?15", "8"] }, " = ", { q: ["?1", "?7", "8"] }] }],
        ok: "파란 부분과 노란 부분의 넓이를 더하면 [1 7/8] m²예요." }) },
    { name: "그려 보기", inst: "이번에는 두 대분수를 가분수로 나타내어 계산해요. 가로와 세로의 1 m를 똑같이 나누어 칸이 멍석 끝에 딱 맞게 해 보세요. 점선 정사각형이 1 m²예요.", hints: ["가로 [1 1/2] m는 [1/2] m가 3칸, 세로 [1 1/4] m는 [1/4] m가 5칸이에요.", "1 m² 안에는 2×4 = 8칸이 들어가요. 한 칸은 [1/8] m²예요."],
      render: (b, a) => fx2Mat(b, a, { A: "1 1/2", B: "1 1/4", mode: 2, ask: [
        { t: "방법 2", p: ["[1 1/2]×[1 1/4] = ", { q: [null, "?3", "2"] }, "×", { q: [null, "?5", "4"] }, " = ", { q: [null, ["3", "×", "?5"], ["2", "×", "?4"]] }, " = ", { q: [null, "?15", "8"] }, " = ", { q: ["?1", "?7", "8"] }] },
        ["멍석의 넓이는 ", { f: "1 7/8" }, " m²로, 어림한 약 2 m²와 ", { c: ["비슷해요", "많이 달라요"], a: 0 }, "."]],
        ok: "[1/8] m²인 칸이 15칸이므로 [15/8] = [1 7/8] m²예요. 방법 1과 결과가 같아요." }) },
    { name: "말해 보기", inst: "친구가 [3 7/8]×[2 4/5]를 잘못 계산했어요. 잘못된 까닭을 고르고 옳게 계산해 보세요.", hints: ["대분수를 가분수로 바꾸기 전에 진분수 부분끼리 약분하면 안 돼요.", "[3 7/8] = [31/8], [2 4/5] = [14/5]예요. 14와 8을 2로 약분해요."],
      render: (b, a) => fx2Chain(b, a, [
        ["잘못된 계산: [3 7/8]×[2 4/5] = [3 7/2]×[2 1/5] = [13/2]×[11/5] = [143/10] = [14 3/10]"],
        ["까닭: ", { c: ["대분수를 가분수로 나타내지 않고 진분수 부분끼리 약분했어요", "분모끼리 더했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[3 7/8]×[2 4/5] = ", { q: [null, "?31", "8"] }, "×", { q: [null, "?14", "5"] }, " = ", { q: [null, ["31", "×", "?7"], ["?4", "×", "5"]] }, " = ", { q: [null, "?217", "20"] }, " = ", { q: ["?10", "?17", "20"] }] }],
        { ok: "옳은 답은 [10 17/20]이에요. 약분은 대분수를 가분수로 바꾼 다음에 해요." }) },
    { name: "약속하기", inst: "(대분수)×(대분수)의 계산 방법을 약속해요.", hints: ["방법 1은 [1 1/4]을 1과 [1/4]로 나누었고, 방법 2는 두 수를 가분수로 바꾸었어요."],
      render: (b, a) => blanks(b, a, ["(대분수)×(대분수)는 곱하는 대분수를 ", { o: ["자연수와 진분수의 합", "두 분수의 차"], a: 0 }, "으로 나타내어 계산하거나 두 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내어 계산합니다. 약분은 대분수를 가분수로 ", { o: ["바꾼 뒤에", "바꾸기 전에"], a: 0 }, " 해요."], { ok: "곱하는 대분수를 자연수와 진분수의 합으로 나타내어 계산하거나 두 대분수를 가분수로 나타내어 계산합니다." }) },
    { name: "확인하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["먼저 대분수를 가분수로 바꾸어요.", "[4 1/6]×[2 2/5] = [25/6]×[12/5]에서 25와 5, 6과 12를 약분해요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[2 1/2]×[1 5/8]", a: "4 1/16" }, { e: "[3 1/5]×[3 1/3]", a: "10 2/3" }, { e: "[1 3/4]×[2 4/7]", a: "4 1/2" }, { e: "[4 1/6]×[2 2/5]", n: 10 },
        { q: "수현이는 롤러스케이트를 [2 5/8] km 탔고, 주아는 수현이가 탄 거리의 [1 3/5]배를 탔어요. 주아가 탄 거리는 몇 km일까요?", x: "[2 5/8]×[1 3/5]", a: "4 1/5", unit: "km", lab: "[2 5/8]×[1 3/5] =" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["[6 2/9] = [56/9], [1 1/8] = [9/8]예요.", "5분 30초는 [5 1/2]분이에요."],
    render: (b, a) => fx2Calc(b, a, [
      { e: "[2 2/3]×[1 3/4]", a: "4 2/3" }, { e: "[2 1/2]×[4 3/5]", a: "11 1/2" },
      { q: "서하: “[6 2/9]의 [1 1/8]배인 수야.” 서하가 설명하는 수는?", x: "[6 2/9]×[1 1/8]", n: 7, lab: "[6 2/9]×[1 1/8] =" },
      { q: "1분에 [6 7/11] L씩 물이 나오는 수도로 5분 30초 동안 받은 물은 몇 L일까요?", x: "[6 7/11]×[5 1/2]", a: "36 1/2", unit: "L", lab: "[6 7/11]×[5 1/2] =" }]) }
},
{
  id: "t9", no: 9, title: "생각을 더하다 ― 투표 과정에도 분수의 곱셈을 활용해요", soop: "탐구 정리하기(O)",
  question: "환경 지킴이 학년별 회의에서 의견이 통과되려면 찬성표를 최소 몇 표 받아야 할까요?",
  summary: `의견이 통과되려면 ① 학년 전체 회원 수의 [1/2]보다 많은 회원이 회의에 참석하고 ② 참석한 회원 수의 [2/3]보다 많은 회원의 찬성표를 받아야 해요. 5학년 57명: 57×[1/2] = [28 1/2]이므로 최소 ${FX2_V57.att}명 참석, ${FX2_V57.att}×[2/3] = [19 1/3]이므로 최소 ${FX2_V57.v}표. 곱이 자연수로 나오면 ‘보다 많은’이므로 그 수에 1을 더해요.`,
  steps: [
    { name: "이해해요", inst: "‘환경 지킴이 회원 모집’ 공고문이에요. 환경 지킴이는 지역 환경을 지키기 위해 여러 가지 활동을 해요. 학년별 회의에서 제안한 의견이 투표를 통해 통과되면 지역 행사가 될 수 있어요. 통과 조건: ① 학년 전체 회원 수의 [1/2]보다 많은 회원이 회의에 참석해야 해요. ② 참석한 회원 수의 [2/3]보다 많은 회원의 찬성표를 받아야 해요.", hints: ["문제에서 ‘최소 몇 표’를 묻고 있어요.", "‘5보다 많은’ 자연수는 6, 7, 8, …이에요. 5는 들어가지 않아요."],
      render: (b, a) => quiz(b, a, [
        { q: "5학년 환경 지킴이 회원은 57명이에요. 이 문제에서 구하려는 것은?", o: ["의견이 통과되기 위한 최소 찬성표 수", "회의에 참석한 회원 수", "5학년 회원 수"], a: 0, why: { "1": "참석 인원은 찬성표를 구하는 데 필요한 중간 값이에요.", "2": "5학년 회원 수는 57명으로 이미 주어졌어요." } },
        { q: "회원이 10명인 학년이에요. 10×[1/2] = 5예요. 회의가 열리려면 최소 몇 명이 참석해야 할까요?", o: ["5명", "6명", "4명"], a: 1, why: { "0": "5명은 5와 같아요. ‘5보다 많은’ 자연수는 6부터예요.", "2": "4명은 5보다 적어요." } }],
        { ok: "구하려는 것은 최소 찬성표 수이고, ‘보다 많은’은 그 수를 넣지 않아요." }) },
    { name: "계획해요", inst: "문제를 어떻게 풀지 계획을 세워 보세요.", hints: ["참석 조건은 학년 전체 회원 수의 [1/2], 찬성 조건은 참석한 회원 수의 [2/3]예요."],
      render: (b, a) => blanks(b, a, ["먼저 ", { o: ["57×[1/2]", "57×[2/3]"], a: 0 }, "을 계산하여 그보다 많은 가장 작은 자연수로 최소 참석 인원을 구해요. 그다음 (최소 참석 인원)×", { o: ["[2/3]", "[1/2]"], a: 0 }, "를 계산하여 그보다 많은 가장 작은 자연수로 최소 찬성표를 구해요."], { ok: "계획을 세웠어요. 이제 해결해 봐요." }) },
    { name: "해결해요", inst: "5학년 회원 57명이에요. 참석 인원과 찬성표를 바꾸어 보며 의견이 통과되는 가장 적은 수를 찾고, 식으로 확인해 보세요.", hints: ["57×[1/2] = [28 1/2]이에요. [28 1/2]보다 많은 가장 작은 자연수는?", `${FX2_V57.att}×[2/3] = [19 1/3]이에요. [19 1/3]보다 많은 가장 작은 자연수는?`],
      render: (b, a) => fx2Vote(b, a, { N: 57, ask: [
        ["57×[1/2] = ", { q: [null, "?57", "2"] }, " = ", { q: ["?28", "?1", "2"] }],
        ["→ 회의에 최소 ", { i: String(FX2_V57.att) }, "명이 참석해야 해요."],
        [{ i: String(FX2_V57.att) }, "×[2/3] = ", { q: [null, "?58", "3"] }, " = ", { q: ["?19", "?1", "3"] }],
        ["→ 찬성표를 최소 ", { i: String(FX2_V57.v) }, "표 받아야 해요."]],
        ok: `5학년의 의견이 통과되려면 찬성표를 최소 ${FX2_V57.v}표 받아야 해요.` }) },
    { name: "한 번 더 해요", inst: "6학년 환경 지킴이 회원은 63명이에요. 의견이 통과되려면 찬성표를 최소 몇 표 받아야 할까요?", hints: ["63×[1/2] = [31 1/2]이에요.", `${FX2_V63.att}×[2/3] = [21 1/3]이에요.`],
      render: (b, a) => fx2Chain(b, a, [
        ["63×[1/2] = ", { q: [null, "?63", "2"] }, " = ", { q: ["?31", "?1", "2"] }],
        ["→ 회의에 최소 ", { i: String(FX2_V63.att) }, "명이 참석해야 해요."],
        [{ i: String(FX2_V63.att) }, "×[2/3] = ", { q: [null, "?64", "3"] }, " = ", { q: ["?21", "?1", "3"] }],
        ["→ 찬성표를 최소 ", { i: String(FX2_V63.v) }, "표 받아야 해요."]],
        { ok: `6학년은 최소 ${FX2_V63.att}명이 참석하고, 찬성표를 최소 ${FX2_V63.v}표 받아야 해요.` }) },
    { name: "되돌아봐요", inst: "해결 과정을 되돌아봐요. 곱이 자연수로 딱 나올 때를 조심해요.", hints: ["30×[2/3] = 20이에요. ‘20보다 많은’ 자연수는 21부터예요.", "최소 찬성표는 최소 인원이 참석했을 때를 생각한 값이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "어느 학년 회의에 30명이 참석했어요. 30×[2/3] = 20이에요. 의견이 통과되려면 찬성표를 최소 몇 표 받아야 할까요?", o: ["20표", "21표", "19표"], a: 1, why: { "0": "20표는 20과 같아요. 20보다 많은 찬성표가 필요해요.", "2": "19표는 20보다 적어요." } },
        { q: "57명인 5학년에서 30명이 참석하면 필요한 최소 찬성표는 어떻게 될까요?", o: ["29명이 참석할 때(20표)보다 1표 더 많은 21표가 필요해요", "참석 인원과 상관없이 20표예요"], a: 0, why: { "1": "찬성표는 참석한 회원 수의 [2/3]보다 많아야 해요. 참석 인원이 달라지면 필요한 표도 달라져요." } }],
        { ok: "곱이 자연수로 나오면 그 수에 1을 더해야 ‘보다 많은’ 조건을 만족해요. 최소 찬성표는 최소 인원이 참석했을 때 가장 적어요." }) }
  ],
  challenge: { inst: "4학년 환경 지킴이 회원은 59명이라고 해요(이 앱에서 정한 수). 의견이 통과되기 위한 최소 찬성표를 구해 보세요. 곱이 자연수로 나올 때 조심해요!", hints: ["59×[1/2] = [29 1/2]이므로 최소 30명이 참석해요.", "30×[2/3] = 20이에요. 20보다 많아야 해요."],
    render: (b, a) => fx2Vote(b, a, { N: 59, ask: [
      ["59×[1/2] = ", { q: [null, "?59", "2"] }, " = ", { q: ["?29", "?1", "2"] }],
      ["→ 회의에 최소 ", { i: String(FX2_V59.att) }, "명이 참석해야 해요."],
      [{ i: String(FX2_V59.att) }, "×[2/3] = ", { i: "20" }],
      ["→ 찬성표를 최소 ", { i: String(FX2_V59.v) }, "표 받아야 해요."]],
      ok: `30×[2/3] = 20처럼 곱이 자연수이면 20표로는 안 되고, 최소 ${FX2_V59.v}표가 필요해요.` }) }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 어떻게 만들어야 곱이 더 클까요", soop: "발표하기(P)",
  question: "조건에 맞는 분수의 곱셈식에서 곱을 더 크게 만들려면 어떻게 해야 할까요?",
  summary: "3~4명이 수 카드와 조건 카드로 놀이를 해요. 조건 카드에 맞게 수 카드를 한 번씩만 사용하여 식을 만들고 계산해요. 곱이 맞으면 1점, 곱이 가장 큰 사람은 2점을 더 얻어요. 곱이 더 큰 식을 만들려면 자연수끼리의 곱이나 분수의 분자끼리의 곱은 크게, 분모의 곱은 작게 만들어요.",
  steps: [
    { name: "놀이 방법", inst: "놀이 방법을 차례대로 눌러 보세요. 인원은 3~4명이고, 놀이 카드(수 카드, 조건 카드)를 써요.", hints: ["카드를 섞어 쌓아 두는 것이 먼저예요.", "점수를 얻는 것은 식을 만들고 계산한 다음이에요."],
      render: (b, a) => sequence(b, a, ["가위바위보로 놀이 순서를 정해요.", "곱이 맞으면 1점, 곱이 가장 큰 사람은 2점을 더 얻어요.", "수 카드끼리, 조건 카드끼리 잘 섞어서 뒤집어 쌓아 두어요.", "가져온 수 카드를 한 번씩만 사용하여 조건에 맞는 식을 만들고 계산해요.", "조건 카드 한 장을 뒤집어 내려놓고, 조건에 맞게 각자 수 카드를 가져와요."], [2, 0, 4, 3, 1], { ok: "이렇게 5회를 반복하고, 점수의 합이 가장 높은 사람이 이겨요." }) },
    { name: "예시 살펴보기", inst: "조건 카드 ‘(대분수)×(자연수)’가 나왔어요. 수 카드 9, 1, 6, 4로 만든 식을 살펴보세요.", hints: ["[9 1/6] = [55/6]예요.", "6과 4를 2로 약분할 수 있어요."],
      render: (b, a) => fx2Calc(b, a, [
        { q: "[9 1/6]×4는 조건 카드에 맞나요?", pick: ["맞아요", "맞지 않아요"], a: 0, why: { "1": "[9 1/6]은 대분수, 4는 자연수예요. 수 카드도 한 번씩만 썼어요." } },
        { e: "[9 1/6]×4", a: "36 2/3" }], { ok: "[9 1/6]×4 = [36 2/3]예요. “내가 만든 식의 곱이 가장 커!”라고 했는데, 정말 가장 클까요?" }) },
    { name: "곱을 크게", inst: "같은 수 카드 9, 1, 6, 4로 ‘(대분수)×(자연수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.", hints: ["곱하는 자연수와 대분수의 자연수 부분을 크게 해 봐요.", "진분수 부분은 분자는 크게, 분모는 작게 하는 것이 좋아요. 여러 식을 계산해 비교해 봐요."],
      render: (b, a) => fx2Build(b, a, { cards: [9, 1, 6, 4], shape: ["m", "w"], goal: "max", ok: "예시 [9 1/6]×4보다 곱이 훨씬 커요." }) },
    { name: "곱을 크게 하는 방법", inst: "곱이 더 큰 식을 만드는 방법과 주의할 점을 정리해요.", hints: ["분모가 작을수록 분수의 크기가 커요."],
      render: (b, a) => blanks(b, a, ["곱이 더 큰 식을 만들려면 자연수끼리의 곱이나 분수의 분자끼리의 곱은 ", { o: ["크게", "작게"], a: 0 }, ", 분모의 곱은 ", { o: ["작게", "크게"], a: 0 }, " 만들어요. 수 카드는 ", { o: ["한 번씩만", "여러 번"], a: 0 }, " 사용하고, ", { o: ["조건에 맞는 식", "아무 식"], a: 0 }, "을 만들어야 해요."], { ok: "이제 놀이를 해 봐요!" }) },
    { name: "놀이하기", inst: "조건 카드와 수 카드가 무작위로 나와요. 5판을 하며 조건에 맞는 식을 만들고 계산해요. 곱이 맞으면 1점, 그 카드로 만들 수 있는 가장 큰 곱이면 2점을 더 얻어요. 3점 이상이면 통과예요.", hints: ["진분수는 분자가 분모보다 작아요. 대분수의 분수 부분도 진분수예요.", "곱을 크게 하려면 자연수와 분자는 크게, 분모는 작게 해요."],
      render: (b, a) => fx2Game(b, a, { rounds: 5, need: 3 }) }
  ],
  challenge: { inst: "수 카드 2, 3, 5, 7을 한 번씩 모두 사용하여 ‘(진분수)×(진분수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.", hints: ["분모 두 개에 들어갈 수와 분자 두 개에 들어갈 수를 나누어 생각해요.", "진분수여야 하니 분자가 분모보다 작아야 해요. 여러 식을 계산해 비교해 봐요."],
    render: (b, a) => fx2Build(b, a, { cards: [2, 3, 5, 7], shape: ["p", "p"], goal: "max", ok: "곱이 가장 큰 식을 찾았어요!" }) }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분수의 곱셈을 잘 할 수 있나요?",
  summary: "(분수)×(자연수)는 분모는 그대로 쓰고 분자에 자연수를 곱해요. (자연수)×(분수)는 대분수를 가분수로 나타내어 계산할 수 있어요. (진분수)×(진분수)는 분자는 분자끼리, 분모는 분모끼리 곱해요. (대분수)×(대분수)는 가분수로 나타내어 계산해요. 기약분수가 아니거나 가분수여도 정답이에요.",
  steps: [
    { name: "그림 보고 계산하기", inst: "막대에 [2/3]만큼씩 2번 색칠하고 [2/3]×2를 계산해 보세요.", hints: ["[2/3]는 [1/3]이 2개예요.", "분모 3은 그대로 쓰고 분자 2에 2를 곱해요."],
      render: (b, a) => fx2Pour(b, a, { d: 3, amt: "2/3", k: 2, tip: "막대 하나가 1이고 작은 칸 하나는 [1/3]이에요.", ask: [
        ["[2/3]×2 = [2/3]+[2/3] = ", { q: [null, ["2", "+", "?2"], "3"] }, " = ", { q: [null, ["2", "×", "?2"], "3"] }, " = ", { q: [null, "?4", "3"] }, " = ", { q: ["?1", "?1", "3"] }]], ok: "[2/3]×2 = [4/3] = [1 1/3]이에요." }) },
    { name: "두 가지 방법", inst: "3×[1 2/5]를 두 가지 방법으로 계산해 보세요.", hints: ["방법 1: [1 2/5] = 1+[2/5]예요.", "방법 2: [1 2/5] = [7/5]이에요."],
      render: (b, a) => fx2Chain(b, a, [
        { t: "방법 1", p: ["3×[1 2/5] = (3×1)+(3×[2/5]) = ", { i: "3" }, "+", { q: [null, "?6", "5"] }, " = 3+", { q: ["?1", "?1", "5"] }, " = ", { q: ["?4", "?1", "5"] }] },
        { t: "방법 2", p: ["3×[1 2/5] = 3×", { q: [null, "?7", "5"] }, " = ", { q: [null, ["3", "×", "?7"], "5"] }, " = ", { q: [null, "?21", "5"] }, " = ", { q: ["?4", "?1", "5"] }] }],
        { ok: "두 방법 모두 [4 1/5]이에요." }) },
    { name: "계산하기", inst: "계산해 보세요. 약분하지 않아도, 가분수로 써도 맞아요.", hints: ["[1 4/5] = [9/5], [2 1/7] = [15/7], [4 2/3] = [14/3]예요.", "약분할 수 있는 수끼리 먼저 약분하면 계산이 쉬워요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[1 4/5]×2", a: "3 3/5" }, { e: "6×[5/8]", a: "3 3/4" }, { e: "[3/4]×[6/7]", a: "9/14" }, { e: "[2 1/7]×[4 2/3]", n: 10 }]) },
    { name: "크기 비교", inst: "계산 결과의 크기를 비교하여 >, =, < 중 알맞은 것을 골라 보세요.", hints: ["4×[2 5/6] = [34/3], [1 5/8]×10 = [65/4]예요.", "[3/4]×[7/12]×[3/5]에서 분자끼리, 분모끼리 곱해 보세요."],
      render: (b, a) => fx2Calc(b, a, [
        { e: "4×[2 5/6] ○ [1 5/8]×10", pick: [">", "=", "<"], a: 2, why: { "0": "4×[2 5/6] = [11 1/3], [1 5/8]×10 = [16 1/4]이에요.", "1": "4×[2 5/6] = [11 1/3], [1 5/8]×10 = [16 1/4]이에요." } },
        { e: "[3/10]×[7/8] ○ [3/4]×[7/12]×[3/5]", pick: [">", "=", "<"], a: 1, why: { "0": "두 식 모두 계산하면 [21/80]이에요.", "2": "두 식 모두 계산하면 [21/80]이에요." } }]) },
    { name: "잘못 고치기", inst: "친구가 [1 5/8]×[2 4/5]를 잘못 계산했어요. 잘못된 까닭을 고르고 옳게 계산해 보세요.", hints: ["대분수를 가분수로 바꾼 뒤에 약분해요.", "[1 5/8] = [13/8], [2 4/5] = [14/5]예요."],
      render: (b, a) => fx2Chain(b, a, [
        ["잘못된 계산: [1 5/8]×[2 4/5] = [1 5/2]×[2 1/5] = [7/2]×[11/5] = [77/10] = [7 7/10]"],
        ["까닭: ", { c: ["대분수를 가분수로 나타내지 않고 약분했어요", "분자끼리 곱했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[1 5/8]×[2 4/5] = ", { q: [null, "?13", "8"] }, "×", { q: [null, "?14", "5"] }, " = ", { q: [null, ["13", "×", "?7"], ["?4", "×", "5"]] }, " = ", { q: [null, "?91", "20"] }, " = ", { q: ["?4", "?11", "20"] }] }],
        { ok: "옳은 답은 [4 11/20]이에요. 곱하는 대분수를 자연수와 진분수로 나누어 계산해도 같은 답이 나와요." }) },
    { name: "태극기", inst: "태극기의 가로는 72 cm예요. 세로는 가로의 [2/3]이고, 가운데 태극 문양의 지름은 세로의 [1/2]이에요.", hints: ["(세로) = (가로)×[2/3]예요.", "(지름) = (세로)×[1/2]이에요."],
      render: (b, a) => fx2Calc(b, a, [
        { q: "태극기의 세로는 몇 cm일까요?", x: "72×[2/3]", n: 48, unit: "cm", lab: "72×[2/3] =", why: { "108": "72의 [2/3]만큼은 72보다 작아요. 72를 3으로 나눈 것 중 2예요." } },
        { q: "태극 문양의 지름은 몇 cm일까요?", x: "48×[1/2]", n: 24, unit: "cm", lab: "(세로)×[1/2] =", why: { "36": "지름은 세로의 [1/2]이에요. 가로가 아니라 세로 48 cm의 [1/2]을 구해요." } }],
        { fig: fx2Flag, ok: "세로는 48 cm, 태극 문양의 지름은 24 cm예요. 분수의 곱셈은 생활에서 많이 쓰여요." }) }
  ],
  challenge: { inst: "확인하고 정리해요. 네 가지 분수의 곱셈을 계산하며 단원을 정리해 보세요.", hints: ["(분수)×(자연수)는 분모는 그대로, 분자에 자연수를 곱해요.", "대분수가 있으면 가분수로 나타내어 계산해요."],
    render: (b, a) => fx2Chain(b, a, [
      { t: "(분수)×(자연수)", p: ["[2/7]×3 = ", { q: [null, ["2", "×", "?3"], "7"] }, " = ", { q: [null, "?6", "7"] }] },
      { t: "(자연수)×(분수)", p: ["2×[1 5/6] = 2×", { q: [null, "?11", "6"] }, " = ", { q: [null, "?11", "3"] }, " = ", { q: ["?3", "?2", "3"] }] },
      { t: "(진분수)×(진분수)", p: ["[2/9]×[4/5] = ", { q: [null, ["2", "×", "?4"], ["9", "×", "?5"]] }, " = ", { q: [null, "?8", "?45"] }] },
      { t: "(대분수)×(대분수)", p: ["[1 3/7]×[2 1/2] = ", { q: [null, "?10", "7"] }, "×", { q: [null, "?5", "2"] }, " = ", { q: [null, "?25", "7"] }, " = ", { q: ["?3", "?4", "7"] }] }],
      { ok: "분수의 곱셈을 모두 정리했어요. 다음 시간에는 합동과 대칭을 공부해요." }) }
}
];
