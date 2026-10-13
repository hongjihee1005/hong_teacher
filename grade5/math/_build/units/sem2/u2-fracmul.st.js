//@@APP
const APP={title:"우리 반 전통 음식 장터", unit:"5-2 수학 2. 분수의 곱셈", key:"s52-fracmul-v1", welcome:"우리 반 전통 음식 장터에 온 것을 환영해요", intro:"누리초등학교 5학년 3반 친구들과 전통 음식 장터를 준비하며, 식혜 재료·보자기 끈·약과 쟁반·떡 반죽·학급 투표에서 분수의 곱셈을 알아봐요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u2-fracmul.tb.js)의 fx2 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   (입력칸 0.9초 · 고르기 0.26초 · 색칠·끌기·카드 넣기 1.2초) 대분수는 쓰는 중에 확인하지 않아요(fx2In.full). 이 파일에서 새로 만든 그림은 앞글자 fx2s. */
/* ===== 5-2 2. 분수의 곱셈 단원 조작 부품 (앞글자 fx2) =====
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
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done(을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return fx2Quiz0(body, fx2A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return fx2Blanks0(body, fx2A(api), parts, o); };

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
  el.sig = () => [w, n, d].map(x => x.value).join("/");
  /* 다 썼나요? (대분수를 쓰는 중에는 확인하지 않아요)
     · 분자·분모를 둘 다 쓰고 자연수도 썼으면 다 쓴 것
     · 자연수 없이 분자·분모만 썼을 때: 답이 1보다 큰데 진분수만 쓰고 아직 칸 안에 있으면 자연수 부분을 쓰는 중일 수 있어 칸을 떠날 때 확인
     · 자연수만 썼으면 칸을 떠났을 때(Enter·다른 곳 누르기) 다 쓴 것 */
  el.tv = null;
  el.full = () => {
    const W = w.value.trim(), N = n.value.trim(), D = d.value.trim(), inside = el.contains(document.activeElement);
    if (N || D) {
      if (!(N && D)) return false;
      if (W || !inside || !el.tv) return true;
      return !(el.tv.num >= el.tv.den && +N < +D);
    }
    return !!W && !inside;
  };
  return el;
}
/* 입력칸에 autoRun 걸기: 쓸 때·칸을 떠날 때 확인 시계를 다시 맞추고, Enter는 칸을 떠나요 */
function fx2Hook(el, auto) {
  el.addEventListener("input", auto); el.addEventListener("change", auto);
  el.addEventListener("focusout", () => setTimeout(auto, 0));
  el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); if (e.target.blur) e.target.blur(); } });
}
function fx2Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 4, class: "fx2box", "aria-label": "빈칸" });
  i.exp = String(exp); i.full = () => i.value.trim() !== ""; i.sig = () => i.value.trim();
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

/* ① 식과 답 (값이 같으면 정답: 약분하지 않은 분수·가분수·대분수 모두) — '확인하기' 단추 없이 저절로 확인해요
   items: {q?, e:"[3/8]×4" (보이는 식) | x (확인용 식), a:"3/2", unit, den, why:{"학생 답":"까닭"}, lab, g:"묶음 제목"}
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
      R.inp = fx2In(it.lab || it.e || "답"); R.inp.tv = R.t;
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
  const judge = () => {
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
      const r = R.inp.get(), J = fx2Judge(r, it.a); given.push(R.inp.text());
      if (J.code === "ok") { R.inp.paint(true); return; }
      if (J.code === "zero" || J.code === "improper") { R.inp.paint(null); if (!hint) hint = J.msg; return; }
      R.inp.paint(false);
      if (!bad) bad = (it.why && it.why[fx2Key(r)]) || J.msg || fx2Diag(it.e || it.x, r) || opt.bad || "분자는 분자끼리, 분모는 분모끼리 곱했는지 다시 살펴봐요. 대분수는 가분수로 바꾸어 계산해요.";
    });
    if (bad) { api.fail(bad, given.join(" / ")); return false; }
    if (hint) { api.tryOnce(); api.hint(hint); return false; }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + fx2Book(num, den); R.res.classList.remove("hidden"); } });
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요! 약분하지 않아도, 가분수로 써도, 대분수로 써도 맞아요.");
    return true;
  };
  const ready = () => {
    if (!rows.every(R => R.kind === "pick" ? R.sel != null : R.kind === "n" ? R.inp.value.trim() !== "" : R.inp.full())) return false;
    const m = opt.pre && opt.pre(); if (m) { api.hint(m); return false; }
    return true;
  };
  const auto = autoRun(ready, () => rows.map(R => R.kind === "pick" ? String(R.sel) : R.kind === "n" ? R.inp.value.trim() : R.inp.sig()).join("§"), judge, rows.some(R => R.kind !== "pick") ? 900 : 260);
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
  rows.forEach(R => { if (R.inp) fx2Hook(R.inp, auto); });
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return auto;
}

/* ② 차례대로 빈칸 채우기 (계산 과정) — 저절로 확인
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 수 칸 | {q:[자연수, 분자, 분모]} 각 자리는 고정값·"?답"(칸)·배열(["3","×","?2"]) | {f:"4 2/5"} 분수 입력(값 판정) | {c:[…], a}
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
        const fi = fx2In("답"); fi.target = pt.f; fi.tv = fx2Str(pt.f); ins.push(fi); line.append(fi);
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
  const judge = () => {
    let ok = true, hint = null; const given = [];
    const same = new Set();
    pairs.forEach(([nb, db]) => { const a = nb.value.trim(), b = db.value.trim();
      if (/^\d+$/.test(a) && /^[1-9]\d*$/.test(b) && !(a === nb.exp && b === db.exp) && +a * +db.exp === +b * +nb.exp) { same.add(nb); same.add(db);
        hint = hint || (fx2G(+nb.exp, +db.exp) === 1 ? "값은 맞아요. 그런데 더 약분할 수 있어요. 분모와 분자를 최대공약수로 나누어 기약분수로 나타내요." : "값은 맞아요. 그런데 이 칸에는 약분하기 전의 분수를 써요."); } });
    ins.forEach(x => {
      if (same.has(x)) { x.style.borderColor = ""; given.push(x.value.trim()); return; }
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = fx2Judge(x.get(), x.target); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "zero" || J.code === "improper") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
    });
    chs.forEach(C => { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(C.sel === C.a ? "good" : "bad"); }); if (C.sel !== C.a) ok = false; given.push(C.sel == null ? "-" : C.el.children[C.sel].textContent); });
    if (!ok) { api.fail(opt.bad || "빨간 칸을 다시 생각해 봐요.", given.join(",")); return false; }
    if (hint) { api.tryOnce(); api.hint(hint); return false; }
    api.tryOnce(); api.done(given.join(","), opt.ok || "차례대로 잘 계산했어요!"); return true;
  };
  const ready = () => {
    if (!ins.every(x => x.full()) || chs.some(C => C.sel == null)) return false;
    const m = opt.pre && opt.pre(); if (m) { api.hint(m); return false; }
    return true;
  };
  const auto = autoRun(ready, () => ins.map(x => x.sig()).join("§") + "#" + chs.map(C => C.sel).join(","), judge, ins.length ? 900 : 260);
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
  ins.forEach(x => fx2Hook(x, auto));
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return auto;
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 (돌려주는 함수를 조작할 때마다 부르면 확인 시계를 다시 맞춰요) */
function fx2Ask(host, api, ready, msg, opt) {
  const g = fx2Gate(api, ready, msg), pre = () => ready() ? null : (typeof msg === "function" ? msg() : msg);
  if (opt.ask) return fx2Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad, pre });
  if (opt.askCalc) return fx2Calc(host, g, opt.askCalc, { ok: opt.ok, pre });
  api.provide({ words: [], answers: [] });
  /* 물을 것이 없으면 조작을 마치는 대로 저절로 통과 */
  return autoRun(ready, () => "ok", () => { api.tryOnce(); api.done("조작 완료", opt.ok); return true; }, 1200);
}

/* ③ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function fx2Sort(body, api, opt) {
  fx2Style();
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "fx2pool" }), binsEl = h("div", { class: "fx2bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "fx2binl" }); binsEl.append(h("div", { class: "fx2bin", onclick: e => { if (e.target.closest(".fx2crd")) return; put(bi); } }, h("button", { class: "fx2binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt fx2crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  let auto = () => {};
  function draw() { els.forEach((el, ci) => { el.classList.toggle("fx2on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); auto(); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => fx2Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "fx2tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "카드를 모두 넣으면 저절로 확인해요."));
  auto = autoRun(() => where.every(w => w >= 0), () => where.join(","), () => {
    let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
    const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
    if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok); return true;
  }, 1200);
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
  /* 다 하면 fx2Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};
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
    rd.classList.toggle("fx2good", p === k); kick();
  };
  const rd = h("p", { class: "fx2rd" });
  const pour = h("button", { onclick: () => { if (!estOk) return api.hint("먼저 위에서 어림해요."); if (merged) return; if (p >= maxP) return api.hint(`그만! ${k}번만 담으면 돼요.`); p++; draw(); } }, `한 번 담기 (+[${opt.amt}]${unit})`);
  const undo = h("button", { onclick: () => { if (merged) { merged = false; draw(); return; } if (p > 0) { p--; draw(); } } }, "하나 덜기");
  const tools = h("div", { class: "fx2ctl" }, pour, undo);
  if (mixed) tools.append(h("button", { onclick: () => { if (p !== k) return api.hint(`먼저 ${k}번 담아요. 지금 ${p}번이에요.`); merged = true; draw(); api.hint("자연수 부분은 자연수끼리, 진분수 부분은 진분수끼리 모았어요!"); } }, "모으기"));
  draw();
  const ask = h("div", { class: "fx2ask" });
  if (opt.est) body.append(fx2EstBox(api, opt.est, () => { estOk = true; kick(); }));
  body.append(h("p", { class: "fx2tip" }, opt.tip || `막대 하나가 1${unit}이고 작은 칸 하나는 [1/${d}]${unit}이에요.`), tools, rd, h("div", { class: "fx2stage" }, svg), ask);
  kick = fx2Ask(ask, api, () => p === k && (!mixed || merged) && estOk, () => !estOk ? "먼저 어림해요." : p !== k ? `[${opt.amt}]${unit}씩 ${k}번 담아요. 지금 ${p}번 담았어요.` : "‘모으기’를 눌러 자연수끼리, 진분수끼리 모아 봐요.", opt);
}

/* ② 수직선에서 같은 길이만큼 뛰기: opt max(끝 수), d(1을 나눈 눈금), step("6/5"), k, unit, ask */
function fx2Jump(body, api, opt) {
  fx2Style(); fx2Style2();
  /* 다 하면 fx2Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};
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
    rd.classList.toggle("fx2good", marks.length - 1 === k); kick();
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
  kick = fx2Ask(ask, api, () => marks.length - 1 === k, () => `[${opt.step}]만큼씩 ${k}번 뛰어요. 지금 ${marks.length - 1}번 뛰었어요.`, opt);
}

/* ③ 자연수의 분수만큼(자연수×분수): N 길이 막대를 똑같이 나누고 몇 부분을 색칠해요.
   opt N, d, n, unit, name, whole(1이면 위에 'N×1' 막대도 색칠), est, ask·askCalc, ok */
function fx2Part(body, api, opt) {
  fx2Style(); fx2Style2();
  /* 다 하면 fx2Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};
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
    rd.classList.toggle("fx2good", ready()); kick();
  };
  const rd = h("p", { class: "fx2rd" });
  const ctl = fx2Stepper("똑같이 나누기:", () => k, v => { k = v; sel = new Set([...sel].filter(j => j < k)); }, 1, 12, draw);
  const ready = () => k === d && sel.size === n && (!opt.whole || wholeOn) && estOk;
  draw();
  const ask = h("div", { class: "fx2ask" });
  if (opt.est) body.append(fx2EstBox(api, opt.est, () => { estOk = true; draw(); }));
  body.append(h("p", { class: "fx2tip" }, opt.tip || "‘＋’, ‘－’로 막대를 똑같이 나누고, 나눈 부분을 눌러 색칠해요."), ctl, rd, h("div", { class: "fx2stage" }, svg), ask);
  kick = fx2Ask(ask, api, ready, () => !estOk ? "먼저 어림해요." : opt.whole && !wholeOn ? `먼저 ‘${N}×1’ 막대를 눌러 색칠해요.` : k !== d ? `${fx2J(`${N}${unit}`, "을를")} 똑같이 ${d}부분으로 나누어요. 지금 ${k}부분이에요.` : `나눈 ${d}부분 중 ${n}부분을 색칠해요. 지금 ${sel.size}부분이에요.`, opt);
}

/* ④ 넓이 모델(진분수×진분수): 넓이가 1인 정사각형을 나누고 색칠·빗금. opt stages [{dir:"v"|"h"|"h2", d, n, t(이름)}], ask, ok */
let FX2_PAT = 0;
function fx2Area(body, api, opt) {
  fx2Style(); fx2Style2();
  /* 다 하면 fx2Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};
  const SG = opt.stages, K = SG.map(() => 1), sel = SG.map(() => new Set()), id = "fx2p" + (++FX2_PAT);
  let cur = 0;
  const W = 900, X0 = 40, Y0 = 30, S = 440;
  const svg = makeSvg(W, 500);
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
    steppers.forEach((st, i) => { st.style.display = i === cur ? "" : "none"; st.paint(); }); kick();
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
  kick = fx2Ask(ask, api, allOk, () => { const i = SG.findIndex((_, q) => !ok(q)), s = SG[i]; return `${s.t}: ${s.dir === "v" ? "세로로" : "가로로"} ${s.d}등분하고 ${s.n}${s.dir === "h2" ? "줄" : "칸"}을 골라요. 지금 ${K[i]}등분, ${sel[i].size}개 골랐어요.`; }, opt);
}

/* ⑤ 직사각형 넓이(대분수×대분수): opt A(가로), B(세로), unit, mode 1(곱하는 대분수 나누기) | 2(가분수 칸), est, ask */
function fx2Mat(body, api, opt) {
  fx2Style(); fx2Style2();
  /* 다 하면 fx2Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};
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
        svg.append(fx2SvgLine(`${opt.what || "멍석"}: ${nc}×${nr} = ${nc * nr}칸`, RX, Y0 + 80, 20, { anchor: "start" }));
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
  const rdUpd = () => { rd.textContent = opt.mode === 1 ? (cut ? (cut === B.den ? `세로를 1 m와 [${B.n}/${B.den}] m로 나누었어요.` : "세로가 1 m인 곳에서 나누어 봐요.") : "주황 손잡이를 위아래로 끌어 세로를 나누어 보세요.") : ""; rd.classList.toggle("fx2good", ready()); kick(); };
  const ctl = h("div");
  if (opt.mode === 2) ctl.append(
    fx2Stepper("가로 1 m를 똑같이:", () => cols, v => { cols = v; }, 1, 8, () => { draw(); rdUpd(); }),
    fx2Stepper("세로 1 m를 똑같이:", () => rows, v => { rows = v; }, 1, 8, () => { draw(); rdUpd(); }));
  draw(); rdUpd();
  const ask = h("div", { class: "fx2ask" });
  if (opt.est) body.append(fx2EstBox(api, opt.est, () => { estOk = true; rdUpd(); }));
  body.append(h("p", { class: "fx2tip" }, opt.tip || (opt.mode === 1 ? "주황 손잡이를 위아래로 끌어 세로를 자연수 부분과 진분수 부분으로 나누어요." : "‘＋’, ‘－’로 가로와 세로의 1 m를 똑같이 나누어요. 주황 점선 정사각형이 1 m²예요.")), ctl, rd, h("div", { class: "fx2stage" }, svg), ask);
  kick = fx2Ask(ask, api, ready, () => !estOk ? "먼저 어림해요." : opt.mode === 1 ? "세로를 1 m와 나머지로 나누어요. 손잡이를 1 m 눈금에 맞춰요." : `칸이 멍석 끝에 딱 맞도록 가장 크게 나누어요. 가로는 [${opt.A}]의 분모, 세로는 [${opt.B}]의 분모를 생각해 봐요.`, opt);
}

/* ⑥ 투표 조건: 학년 회원 N명, 참석 > N×[1/2], 찬성 > 참석×[2/3] — 가장 적은 참석 인원·찬성표 찾기. opt N, ask */
function fx2VoteMin(N) { const att = Math.floor(N / 2) + 1, v = Math.floor(att * 2 / 3) + 1; return { att, v }; }
function fx2Vote(body, api, opt) {
  fx2Style(); fx2Style2();
  /* 다 하면 fx2Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};
  const N = opt.N, best = fx2VoteMin(N), WHO = opt.who || "회원", ALL = opt.all || "학년 전체 회원 수";
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
      g.addEventListener("click", () => { if (mode === 0) { a = i + 1; if (v > a) v = a; } else { if (i >= a) return api.hint("찬성표는 회의에 참석한 " + WHO + "만 낼 수 있어요."); v = i + 1; } paint(); });
      svg.append(g);
    }
  };
  const c1 = h("div"), c2 = h("div"), c3 = h("div");
  const paint = () => {
    draw(); sa.paint(); sv.paint();
    const h1 = fx2R(N, 2), h2 = fx2R(a * 2, 3), ok1 = a * 2 > N, ok2 = v * 3 > a * 2;
    c1.textContent = `① 참석 ${a}명 — ${ALL}의 [1/2]: ${N}×[1/2] = ${fx2Tk(fx2Form(h1.num, h1.den))} → ${ok1 ? "보다 많아요 ✓" : "보다 많지 않아요 ✗"}`;
    c2.textContent = `② 찬성 ${v}표 — 참석한 ${WHO} 수의 [2/3]: ${a}×[2/3] = ${fx2Tk(fx2Form(h2.num, h2.den))} → ${ok2 ? "보다 많아요 ✓" : "보다 많지 않아요 ✗"}`;
    c3.textContent = ok1 && ok2 ? "의견이 통과돼요! 🎉" : "아직 통과되지 않아요.";
    c1.style.color = ok1 ? "var(--ok)" : "var(--no)"; c2.style.color = ok2 ? "var(--ok)" : "var(--no)"; kick();
  };
  const sa = fx2Stepper("참석한 " + WHO + ":", () => a, x => { a = x; if (v > a) v = a; }, 0, N, paint);
  const sv = fx2Stepper("찬성표:", () => v, x => { v = x; }, 0, N, () => { if (v > a) { v = a; api.hint("찬성표는 참석한 회원 수보다 많을 수 없어요."); } paint(); });
  const mb = [h("button", { class: "fx2act", onclick: () => setMode(0) }, "사람을 눌러 참석 정하기"), h("button", { onclick: () => setMode(1) }, "사람을 눌러 찬성 정하기")];
  const setMode = m => { mode = m; mb.forEach((b, i) => b.classList.toggle("fx2act", i === m)); };
  const ask = h("div", { class: "fx2ask" });
  body.append(h("p", { class: "fx2tip" }, `${WHO} ${N}명이에요. ‘＋’, ‘－’나 사람 그림을 눌러 참석 인원과 찬성표를 정하고, 의견이 통과되는 가장 적은 수를 찾아보세요.`),
    h("div", { class: "fx2ctl" }, ...mb), sa, sv, h("div", { class: "fx2cond" }, c1, c2, c3), h("div", { class: "fx2stage" }, svg), ask);
  paint();
  kick = fx2Ask(ask, api, () => a === best.att && v === best.v, () => {
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
  let sel = null, auto = () => {};
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
    auto();
  };
  paint();
  host.append(h("p", { class: "fx2tip" }, opt.tip || "수 카드를 누른 다음 빈칸을 눌러 넣어요. 빈칸을 다시 누르면 빠져요. 카드는 한 번씩만 써요."),
    h("div", { class: "fx2deck" }, cBtns), board, h("div", { class: "fx2cl" }, h("span", {}, "곱 ="), prod),
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "빈칸에 카드를 모두 넣고 곱을 쓰면 저절로 확인해요."));
  const vals = () => slot.map(i => i == null ? null : cards[i]);
  const ready = () => {
    if (slot.some(s => s == null)) return false;
    const v = fx2ShapeVal(shape, vals()); prod.tv = v || null;   /* 곱이 1보다 크면 대분수를 쓰는 동안 기다려요 */
    return prod.full();
  };
  auto = autoRun(ready, () => slot.join(",") + "#" + prod.sig(), () => {
    const vs = vals(), txtE = fx2ShapeTxt(shape, vs), val = fx2ShapeVal(shape, vs);
    if (!val) return onCheck({ err: "진분수는 분자가 분모보다 작아야 해요. 대분수의 분수 부분도 진분수예요.", e: txtE }) === true;
    const r = prod.get();
    if (r.err) { prod.paint(false); return onCheck({ err: "곱을 분수나 자연수로 써요.", e: txtE }) === true; }
    const right = fx2Eq(r, val);
    prod.paint(right);
    return onCheck({ e: txtE, val, r, right, given: `${fx2Plain(txtE)} = ${prod.text()}` }) === true;
  }, 900);
  fx2Hook(prod, auto);
  return auto;
}
function fx2Build(body, api, opt) {
  const best = fx2Best(opt.shape, opt.cards);
  api.provide({ words: ["분자는 분자끼리", "분모는 분모끼리", "진분수", "대분수"], answers: opt.goal === "max" ? [`${fx2Plain(fx2ShapeTxt(opt.shape, best.idx.map(i => opt.cards[i])))} = ${fx2Plain(fx2Tk(fx2Form(best.v.num, best.v.den)))}`] : [] });
  return fx2BuildUI(body, opt, R => {
    if (R.err) { api.fail(R.err, R.e || "-"); return false; }
    if (opt.goal === "max" && !fx2Eq(R.val, best.v)) { api.fail(opt.maxMsg || "곱이 더 큰 식을 만들 수 있어요. 자연수와 분자는 크게, 분모는 작게 해 봐요.", R.given); return false; }
    if (!R.right) { api.fail(fx2Diag(R.e, R.r) || "곱을 다시 계산해 봐요. 분자는 분자끼리, 분모는 분모끼리 곱해요.", R.given); return false; }
    api.tryOnce(); api.done(R.given, (opt.ok ? opt.ok + " " : "") + `${R.e} = ${fx2Book(R.val.num, R.val.den)}`);
    return true;
  });
}

/* ⑧ 놀이: 조건 카드 뽑기 → 수 카드로 식 만들기 → 곱이 맞으면 1점, 가장 큰 곱이면 2점 더. opt rounds, need(통과 점수) */
const FX2_COND = [
  { t: "(진분수)×(자연수)", shape: ["p", "w"] }, { t: "(자연수)×(진분수)", shape: ["w", "p"] },
  { t: "(대분수)×(자연수)", shape: ["m", "w"] }, { t: "(자연수)×(대분수)", shape: ["w", "m"] },
  { t: "(진분수)×(진분수)", shape: ["p", "p"] }];
function fx2Game(body, api, opt) {
  fx2Style(); fx2Style2();
  /* 놀이가 끝나면 api.done( 을 불러요 */
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
      if (doneR) return true;
      if (Rr.err) { api.hint(Rr.err); return false; }
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
      return true;
    });
    stage.append(fb);
  };
  body.append(h("div", { class: "fx2ctl" }, scoreEl), stage, logEl);
  deal();
}

/* ===== 이야기 버전에서 새로 만든 그림 (앞글자 fx2s) ===== */
function fx2sStyle() {
  if (document.getElementById("fx2s-style")) return;
  const s = document.createElement("style"); s.id = "fx2s-style";
  s.textContent = `.fx2snote{border:3px dashed #B0643A;border-radius:var(--r);background:#FFF6EC;padding:.5em .9em;margin:.3em 0 .6em}
.fx2snote b{font-family:Jua,sans-serif;font-weight:400;color:#8A4A22}
.fx2snote ul{margin:.3em 0 0 1.1em;padding:0}.fx2snote li{margin:.2em 0;line-height:1.9}`;
  document.head.append(s);
}
function fx2sNote(title, lines) {
  fx2Style(); fx2sStyle();
  return h("div", { class: "fx2snote" }, h("b", {}, title), h("ul", {}, ...lines.map(t => h("li", {}, t))));
}
/* 장터 현수막 그림: 가로 90 cm, 세로 = 가로의 [2/5], 글자 높이 = 세로의 [3/4] */
function fx2sBanner() {
  const svg = makeSvg(900, 300), w = 450, hh = 180, x = 225, y = 40;
  svg.append(svgEl("rect", { x, y, width: w, height: hh, fill: "#FFF1DE", stroke: INK, "stroke-width": 3, rx: 6 }));
  svg.append(svgEl("rect", { x: x + 30, y: y + hh / 8, width: w - 60, height: hh * 3 / 4, fill: "none", stroke: TENT, "stroke-width": 2, "stroke-dasharray": "8 6" }));
  svg.append(txt(x + w / 2, y + hh / 2, "5학년 3반 전통 음식 장터", 34, { fill: "#8A4A22" }));
  svg.append(svgEl("line", { x1: x, y1: y + hh + 22, x2: x + w, y2: y + hh + 22, stroke: INK, "stroke-width": 3 }));
  svg.append(txt(x + w / 2, y + hh + 44, "가로 90 cm", 20));
  svg.append(fx2SvgLine("세로 = 가로의 [2/5]", x - 14, y + hh / 2 - 20, 18, { anchor: "end" }));
  svg.append(fx2SvgLine("글자 높이 = 세로의 [3/4]", x + w + 14, y + hh / 2 - 20, 18, { anchor: "start", fill: TENT }));
  return h("div", { class: "fx2stage" }, svg);
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 전통 음식 장터", lines: [
  "누리초등학교 5학년 3반은 학교 축제 날 ‘전통 음식 장터’를 열기로 했어요. 장터 반장 도윤이와 서아, 지호, 하은, 민준, 유나가 모둠을 나누어 식혜·인절미·약과·다식을 준비하고 보자기로 선물 꾸러미를 싸요.",
  "식혜 여러 병에 들어갈 쌀, 여러 판의 떡 반죽, 끈과 리본의 분수만큼, 약과 쟁반에서 ‘분수의 분수만큼’, 손님 돗자리의 넓이를 구하며 분수의 곱셈을 알아봐요.",
  "마지막에는 수익금 쓰임을 정하는 학급 투표, 장터 놀이 마당, 장터 발표회에서 배운 것을 정리해요."],
  one: "우리 반 전통 음식 장터 · (분수)×(자연수)는 분모는 그대로 쓰고 분자에 자연수를 곱하고, (분수)×(분수)는 분자는 분자끼리, 분모는 분모끼리 곱해요." };
const UNIT_KEYWORDS = ["같은 수를 여러 번 더하기", "분모는 그대로", "분자에 자연수를 곱하기", "자연수와 분자를 곱하기", "분수만큼(분수 배)", "분자는 분자끼리", "분모는 분모끼리", "약분", "자연수와 진분수의 합", "가분수로 나타내기", "대분수", "어림하기", "넓이 모델", "곱하는 순서를 바꾸어도 곱이 같아요", "1보다 작은 수를 곱하면 작아져요"];
const FX2_V27 = fx2VoteMin(27), FX2_V75 = fx2VoteMin(75), FX2_V47 = fx2VoteMin(47);
const FX2S_NOTE = ["🍶 식혜: 한 병에 쌀 [2/5]컵 → 3병 만들기", "🎀 보자기 끈: 6 m의 [2/3]만큼 잘라 쓰기", "🍪 약과 쟁반: 쟁반의 [3/4]에 한지 깔기, 그 [1/2]에 약과 올리기", "🍡 인절미 반죽: 한 판에 찹쌀가루 [1 1/4] kg → 4판"];

const LESSONS = [
{
  id: "s1", no: 1, title: "전통 음식 장터를 열어요", soop: "개념 찾기(S)",
  question: "장터를 준비할 때 분수의 곱셈을 써야 하는 때는 언제일까요?",
  summary: "장터 준비 쪽지에는 [2/5]컵씩 3병, 6 m의 [2/3]만큼, 쟁반의 [3/4]의 [1/2]처럼 분수의 곱셈이 필요한 일이 많아요. 같은 분수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요. [2/5]+[2/5]+[2/5] = [2/5]×3. 어떤 수의 분수만큼을 구할 때도 곱셈을 써요. 1보다 작은 분수를 곱하면 처음 수보다 작아져요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "우리 반이 전통 음식 장터를 열기로 했어요! 장터 반장 도윤이가 가져온 준비 쪽지를 보고, 세 칸에 써서 붙여요.", hints: ["쪽지에서 분수가 쓰인 곳을 찾아봐요. 같은 양을 여러 번 쓰는 곳이 있나요?", "‘~의 [2/3]만큼’처럼 어떤 양의 일부분을 구하는 곳도 찾아봐요."],
      render: (b, a) => { b.append(fx2sNote("📜 5학년 3반 장터 준비 쪽지", FX2S_NOTE));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "쪽지에 ~이 보여요", hint: "쪽지에서 보이는 것", ex: ["식혜 한 병에 쌀 [2/5]컵처럼 분수로 나타낸 양이 보여요.", "[1 1/4] kg처럼 자연수와 분수가 함께 있는 대분수가 보여요."] },
          { t: "생각해요", e: "💭", ph: "~을 구하려면 ~해야 할 것 같아요", hint: "분수로 계산해야 할 일", ex: ["식혜 3병에 넣을 쌀은 [2/5]컵을 3번 더하면 될 것 같아요.", "끈 6 m의 [2/3]만큼은 6 m보다 짧을 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 계산할까?", hint: "분수 계산에 대해 궁금한 것", ex: ["분수에 자연수를 곱하는 것은 어떻게 계산할까?", "쟁반의 [3/4]의 [1/2]처럼 분수의 분수만큼은 어떻게 구할까?"] }],
          { ok: "장터 준비에는 분수의 곱셈이 가득해요! 이 단원에서 분수의 곱셈을 하나씩 알아봐요." }); } },
    { name: "그려 보기 — 더하기를 곱하기로", inst: "서아네 모둠은 식혜를 3병 만들어요. 한 병에 쌀이 [2/5]컵 들어가요. 넣을 쌀을 덧셈과 곱셈으로 나타내 보세요.", hints: ["3병이면 [2/5]컵을 3번 넣어요.", "같은 수를 여러 번 더하는 것은 곱셈으로 나타내요. 4+4+4 = 4×3처럼요."],
      render: thenWhy((b, a) => blanks(b, a, ["식혜 3병에 넣을 쌀은 [2/5]+[2/5]+[2/5]컵이에요. 이것은 [2/5]를 ", { o: ["3번 더한 것", "3으로 나눈 것", "3에서 뺀 것"], a: 0 }, "이므로 곱셈식 ", { o: ["[2/5]×3", "[2/5]+3", "[6/15]"], a: 0 }, "으로 나타낼 수 있어요."], { ok: "[2/5]를 3번 더한 것은 [2/5]×3이에요. 분수의 곱셈은 같은 분수를 여러 번 더하는 덧셈과 이어져 있어요." }),
        { q: "같은 분수를 여러 번 더한 것을 왜 곱셈으로 나타낼 수 있을까요?", ph: "4+4+4를 ~처럼 ~", help: ["① 자연수에서 같은 수를 여러 번 더한 것을 어떻게 나타냈는지 떠올려요. → ② 분수도 똑같이 생각해요.", "‘4+4+4를 4×3으로 나타내는 것처럼, [2/5]를 3번 더한 것도 ~으로 나타내요.’ 꼴로 써요."],
          ans: "4+4+4를 4×3으로 나타내는 것처럼, 같은 수를 여러 번 더하는 것은 곱셈이에요. 그래서 [2/5]를 3번 더한 것도 [2/5]×3으로 나타낼 수 있어요." }) },
    { name: "말해 보기 — 분수만큼 떠올리기", inst: "3학년 때 배운 ‘분수만큼은 얼마인지’를 떠올려요. 하은이가 송편 15개 중 [2/5]만큼을 손님 맛보기용으로 덜어 놓기로 했어요. 15개를 똑같이 5부분으로 나누고 2부분을 색칠해 보세요.", hints: ["15를 똑같이 5부분으로 나누면 한 부분은 3이에요.", "15의 [2/5]는 5부분 중 2부분이에요."],
      render: (b, a) => fx2Part(b, a, { N: 15, d: 5, n: 2, unit: "개", name: "송편 15개", askCalc: [{ lab: "15의 [2/5]", n: 6, unit: "개", why: { "3": "3은 한 부분이에요. 색칠한 2부분을 모두 세어요.", "5": "5는 나눈 부분의 수예요. 색칠한 2부분에 송편이 몇 개인지 세어요." } }], ok: "15의 [1/5]은 3이고, 15의 [2/5]는 3의 2배인 6이에요. 맛보기용 송편은 6개예요." }) },
    { name: "약속하기 — 대분수·가분수·약분 떠올리기", inst: "장터 계산에 자주 쓸 것들을 떠올려요. 대분수와 가분수를 바꾸고, 분수를 기약분수로 나타내 보세요.", hints: ["[1 3/4]에서 1은 [4/4]예요.", "기약분수는 분모와 분자를 최대공약수로 나누면 한 번에 돼요."],
      render: (b, a) => fx2Chain(b, a, [
        ["[1 3/4] = ", { q: [null, "?7", "4"] }],
        ["[11/3] = ", { q: ["?3", "?2", "3"] }],
        ["[6/9]을 기약분수로 나타내면 ", { q: [null, "?2", "?3"] }],
        ["[12/16]를 기약분수로 나타내면 ", { q: [null, "?3", "?4"] }]], { ok: "대분수와 가분수를 바꾸고 약분할 수 있어요. 분수의 곱셈에서 자주 써요.", bad: "1 = [4/4] = [3/3]을 떠올려 바꾸고, 기약분수는 분모와 분자를 최대공약수로 나누어요." }) },
    { name: "확인하기 — 곱하면 항상 커질까?", inst: "자연수끼리 곱하면 곱이 커졌어요. 분수를 곱할 때도 그럴까요? 쪽지를 보고 생각해 보세요.", hints: ["6 m의 [2/3]만큼은 6 m를 3부분으로 나눈 것 중 2부분이에요.", "[1 1/4] kg씩 4판이면 1 kg씩 4판보다 많아요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "보자기 끈 6 m의 [2/3]만큼은 6 m와 비교하면 어떨까요?", o: ["6 m보다 짧아요", "6 m보다 길어요", "6 m와 같아요"], a: 0, why: { "1": "[2/3]는 1보다 작아요. 6 m의 일부분만 쓰니까 6 m보다 짧아요.", "2": "[2/3]는 1이 아니에요. 6 m를 3부분으로 나눈 것 중 2부분만 써요." } },
        { q: "인절미 반죽 [1 1/4] kg씩 4판은 4 kg과 비교하면 어떨까요?", o: ["4 kg보다 많아요", "4 kg보다 적어요", "4 kg과 같아요"], a: 0, why: { "1": "[1 1/4]은 1보다 커요. 1 kg씩 4판인 4 kg보다 많아요.", "2": "[1 1/4]은 1보다 [1/4]만큼 커요. 4 kg보다 많아요." } }],
        { ok: "1보다 작은 분수를 곱하면 처음 수보다 작아지고, 1보다 큰 수를 곱하면 커져요." }),
        { q: "6 m의 [2/3]만큼이 6 m보다 짧은 까닭을 써 봐요.", ph: "[2/3]는 ~보다 작아서 ~", help: ["① [2/3]와 1의 크기를 견주어요. → ② 6 m 전체를 쓰는지, 일부분만 쓰는지 생각해요.", "‘[2/3]는 1보다 작아서, 6 m의 ~만 쓰기 때문이에요.’ 꼴로 써요."],
          ans: "[2/3]는 1보다 작아서, 6 m를 3부분으로 나눈 것 중 2부분, 즉 6 m의 일부분만 쓰기 때문이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 쪽지의 인절미 반죽을 계산해 보세요. 한 판에 찹쌀가루 [1 1/4] kg씩 4판을 만들어요. [1 1/4]을 4번 더해서 구해 보세요.", hints: ["자연수 부분 1을 4번 더하면 4예요.", "[1/4]을 4번 더하면 [4/4] = 1이에요."],
    render: (b, a) => fx2Calc(b, a, [
      { q: "필요한 찹쌀가루는 모두 몇 kg일까요?", x: "[1 1/4]×4", n: 5, unit: "kg", lab: "[1 1/4]×4 =", why: { "4": "자연수 부분만 더했어요. [1/4]을 4번 더한 것도 더해요.", "8": "[1/4]을 4번 더하면 [4/4] = 1이에요." } },
      { q: "[3/7]+[3/7]+[3/7]+[3/7]을 곱셈식으로 나타내면?", pick: ["[3/7]×4", "[12/28]", "[3/7]+4"], a: 0, why: { "1": "분모끼리 더하면 안 돼요. [3/7]을 4번 더한 것은 [3/7]×4예요.", "2": "[3/7]+4는 [3/7]에 4를 더한 것이에요. [3/7]을 4번 더한 것은 곱셈이에요." } }],
      { ok: "찹쌀가루는 모두 5 kg 필요해요. 같은 분수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요." }) }
},
{
  id: "s2", no: 2, title: "식혜 만들기 ― (진분수)×(자연수)", soop: "개념 구축하기(O)",
  question: "(진분수)×(자연수)는 어떻게 계산할까요?",
  summary: "(진분수)×(자연수)는 분수의 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산해요. [2/5]×3 = [2/5]+[2/5]+[2/5] = [2×3/5] = [6/5] = [1 1/5]. 약분은 분자와 자연수를 곱한 뒤에 해도 되고, 분모와 자연수를 먼저 약분해도 돼요.",
  steps: [
    { name: "만져 보기 — 식혜 쌀 담기", inst: "서아네 모둠이 식혜를 만들어요. 한 병에 쌀을 [2/5]컵씩, 모두 3병을 만들어요. 먼저 계산 규칙을 예상한 다음, 쌀을 3번 담아 보세요.", hints: ["‘한 번 담기’를 3번 눌러요.", "[2/5]컵씩 3번은 [2/5]컵의 3배, [2/5]×3이에요."],
      render: ruleFirst((b, a) => fx2Pour(b, a, { d: 5, amt: "2/5", k: 3, unit: "컵", ask: [
        ["[2/5]컵씩 3번 담은 것은 [2/5]컵의 ", { i: "3" }, "배이므로 [2/5]×", { i: "3" }, "으로 나타내요."],
        ["[2/5]×3 = [2/5]+[2/5]+[2/5] = ", { q: [null, ["2", "×", "?3"], "5"] }, " = ", { q: [null, "?6", "5"] }, " = ", { f: "1 1/5" }]], ok: "식혜 3병에 넣을 쌀은 [1 1/5]컵이에요. [2/5]×3은 분모 5는 그대로 두고 분자 2에 3을 곱한 [6/5]이에요." }),
        { q: "(진분수)×(자연수)는 어떻게 계산할까요?", ph: "내 규칙: 분모는 ~, 분자는 ~", help: ["① [2/5]를 3번 더하면 [1/5]이 몇 개가 되는지 생각해요. → ② 분모와 분자 가운데 무엇이 바뀌는지 생각해요.", "‘내 규칙: 분모는 ~ 쓰고, 분자에 ~을 곱해요.’ 꼴로 써요."],
          ans: "분모는 그대로 쓰고 분자에 자연수를 곱해요. [2/5]×3 = [2×3/5] = [6/5]이에요." }) },
    { name: "그려 보기 — 수정과 계피물", inst: "지호는 수정과 한 통에 계피물을 [5/6] L씩 넣어요. 2통을 만들려면 계피물은 몇 L 필요할까요? 막대에 [5/6]만큼씩 2번 담고 계산해 보세요.", hints: ["[5/6]는 [1/6]이 5개예요. 2번이면 [1/6]이 몇 개일까요?", "분모 6은 그대로 두고 분자 5에 2를 곱해요."],
      render: (b, a) => fx2Pour(b, a, { d: 6, amt: "5/6", k: 2, unit: " L", tip: "막대 하나가 1 L이고 작은 칸 하나는 [1/6] L예요.", ask: [
        ["[5/6]×2 = [5/6]+[5/6] = ", { q: [null, ["5", "+", "?5"], "6"] }, " = ", { q: [null, ["5", "×", "?2"], "6"] }, " = ", { q: [null, "?10", "6"] }, " = ", { f: "1 4/6" }]], ok: "계피물은 [10/6] L = [1 4/6] L 필요해요. 약분하면 [1 2/3] L예요. 분모는 그대로 쓰고 분자에 자연수를 곱했어요." }) },
    { name: "말해 보기 — 약분은 언제 할까?", inst: "식혜 한 병에 설탕을 [5/12]컵씩 넣어요. 8병이면 설탕은 몇 컵일까요? 서아와 지호가 [5/12]×8을 서로 다른 방법으로 계산했어요. 빈칸을 채우고 비교해 보세요.", hints: ["서아는 5×8을 먼저 하고 [40/12]을 약분했어요.", "지호는 분모 12와 자연수 8을 최대공약수 4로 먼저 약분했어요. 12는 3이 되고 8은 2가 돼요."],
      render: thenWhy((b, a) => fx2Chain(b, a, [
        { t: "서아", p: ["[5/12]×8 = ", { q: [null, ["5", "×", "?8"], "12"] }, " = ", { q: [null, "?40", "12"] }, " = ", { q: [null, "?10", "3"] }, " = ", { f: "3 1/3" }] },
        { t: "지호", p: ["12와 8의 최대공약수 ", { i: "4" }, "로 먼저 약분하면 [5/12]×8 = ", { q: [null, ["5", "×", "?2"], "?3"] }, " = ", { q: [null, "?10", "3"] }, " = ", { f: "3 1/3" }] },
        ["서아는 ", { c: ["분자와 자연수를 곱한 뒤 약분했어요", "분모와 자연수를 먼저 약분했어요"], a: 0 }],
        ["지호는 ", { c: ["분자와 자연수를 곱한 뒤 약분했어요", "분모와 자연수를 먼저 약분했어요"], a: 1 }]],
        { ok: "두 방법 모두 [3 1/3]컵이에요. 약분을 언제 하든 결과는 같아요." }),
        { q: "약분을 먼저 하면 어떤 점이 좋을까요?", ph: "먼저 약분하면 곱하는 수가 ~", help: ["① 서아와 지호가 곱한 수의 크기를 견주어 봐요. → ② 어느 쪽 계산이 더 쉬웠는지 생각해요.", "‘먼저 약분하면 곱하는 수가 ~져서 계산이 ~해요.’ 꼴로 써요."],
          ans: "먼저 약분하면 곱하는 수가 작아져서 계산이 쉬워요. 지호는 5×2만 하면 되었지만 서아는 5×8을 하고 다시 약분해야 했어요." }) },
    { name: "약속하기 — (진분수)×(자연수)", inst: "식혜를 만들며 찾은 방법을 약속해요.", hints: ["[2/5]×3 = [2×3/5]에서 분모 5는 어떻게 되었나요?"],
      render: (b, a) => blanks(b, a, ["(진분수)×(자연수)는 분수의 분모는 ", { o: ["그대로 쓰고", "자연수를 곱하고"], a: 0 }, " 분자에 ", { o: ["자연수를 곱하여", "자연수를 더하여"], a: 0 }, " 계산합니다. 약분은 ", { o: ["곱한 뒤에 해도 되고, 먼저 해도 돼요", "반드시 곱하기 전에 해야 해요"], a: 0 }, "."], { ok: "(진분수)×(자연수)는 분수의 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산합니다." }) },
    { name: "확인하기 — 장터 재료 계산", inst: "계산해 보세요. 약분하지 않아도, 가분수로 써도 맞아요.", hints: ["[5/9]×6에서 9와 6을 3으로 약분할 수 있어요.", "[3/8]×12에서 8과 12를 4로 약분하면 [3×3/2]예요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[3/7]×2", a: "6/7" }, { e: "[7/10]×4", a: "2 4/5" }, { e: "[5/9]×6", a: "3 1/3" },
        { q: "민준이는 약과 한 개에 조청을 [3/8]컵씩 발라요. 약과 12개에는 조청이 모두 몇 컵 필요할까요?", x: "[3/8]×12", a: "4 1/2", unit: "컵", lab: "[3/8]×12 =", why: { "3/96": "분모에는 곱하지 않아요. 분모 8은 그대로 쓰고 분자 3에 12를 곱해요." } }]) }
  ],
  challenge: { inst: "★ 도전 — 장터 문제를 풀어 보세요.", hints: ["정사각형의 둘레는 한 변의 길이의 4배예요.", "[5/6]×3 = [2 1/2], [3/4]×4 = 3이에요."],
    render: (b, a) => fx2Calc(b, a, [
      { q: "한 변이 [4/9] m인 정사각형 돗자리의 둘레는 몇 m일까요?", x: "[4/9]×4", a: "1 7/9", unit: "m", lab: "[4/9]×4 =" },
      { q: "곱의 크기를 비교해요.", e: "[5/6]×3 ○ [3/4]×4", pick: [">", "=", "<"], a: 2, why: { "0": "[5/6]×3 = [15/6] = [2 1/2], [3/4]×4 = 3이에요.", "1": "[5/6]×3 = [2 1/2], [3/4]×4 = 3이에요. 같지 않아요." } }]) }
},
{
  id: "s3", no: 3, title: "인절미 반죽 ― (대분수)×(자연수)", soop: "개념 구축하기(O)",
  question: "(대분수)×(자연수)는 어떻게 계산할까요?",
  summary: "(대분수)×(자연수)는 대분수를 자연수와 진분수의 합으로 나타내어 계산하거나, 대분수를 가분수로 나타내어 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산해요. [1 2/5]×3 = 3+[6/5] = [4 1/5], [1 2/5]×3 = [7/5]×3 = [21/5] = [4 1/5]. 대분수의 분모와 자연수를 바로 약분하면 결과가 달라져요.",
  steps: [
    { name: "만져 보기 — 반죽 모으기", inst: "하은이네 모둠은 인절미 반죽을 만들어요. 한 판에 찹쌀가루 [1 2/5] kg씩 3판을 만들어요. 먼저 어림한 다음, 찹쌀가루를 3판 담고 ‘모으기’를 눌러 자연수끼리, 진분수끼리 모아 보세요.", hints: ["한 판은 1 kg 막대 하나와 [1/5] kg 두 칸이에요.", "자연수끼리 모으면 1×3, 진분수끼리 모으면 [2/5]×3이에요."],
      render: (b, a) => fx2Pour(b, a, { d: 5, amt: "1 2/5", k: 3, unit: " kg", tip: "막대 하나가 1 kg이고 작은 칸 하나는 [1/5] kg이에요.",
        est: { q: "필요한 찹쌀가루는 몇 kg쯤일까요?", o: ["3 kg보다 많고 6 kg보다 적어요", "3 kg보다 적어요", "6 kg보다 많아요"], a: 0, why: { "1": "[1 2/5]는 1보다 커요. 1×3 = 3이니 3 kg보다 많아요.", "2": "[1 2/5]는 2보다 작아요. 2×3 = 6보다 적어요." }, ok: "1×3 = 3, 2×3 = 6이고 [1 2/5]는 1과 2 사이니까 3 kg과 6 kg 사이일 거예요." },
        ask: [{ t: "방법 1", p: ["[1 2/5]×3 = (1+1+1)+([2/5]+[2/5]+[2/5]) = (1×", { i: "3" }, ")+([2/5]×", { i: "3" }, ") = ", { i: "3" }, "+", { q: [null, "?6", "5"] }, " = ", { f: "4 1/5" }] }],
        ok: "필요한 찹쌀가루는 [4 1/5] kg이에요. 어림한 대로 3 kg과 6 kg 사이예요. 대분수를 자연수와 진분수의 합으로 나타내어 계산했어요." }) },
    { name: "그려 보기 — 가분수로 뛰기", inst: "[1 2/5]를 가분수로 나타내면 [7/5]이에요. 수직선에서 [7/5]만큼씩 3번 뛰어 [1 2/5]×3을 알아보세요.", hints: ["[7/5]은 작은 눈금 7칸이에요.", "가분수로 바꾸면 분모는 그대로 쓰고 분자에 자연수를 곱해요."],
      render: (b, a) => fx2Jump(b, a, { max: 5, d: 5, step: "7/5", k: 3, ask: [
        { t: "방법 2", p: ["[1 2/5]×3 = ", { q: [null, "?7", "5"] }, "×3 = ", { q: [null, ["7", "×", "?3"], "5"] }, " = ", { q: [null, "?21", "5"] }, " = ", { f: "4 1/5" }] }],
        ok: "[7/5]씩 3번 뛰면 [21/5] = [4 1/5]에 도착해요. 방법 1과 결과가 같아요." }) },
    { name: "말해 보기 — 하은이의 실수", inst: "하은이가 떡고물 [2 5/6] kg씩 4판의 양을 계산했는데 답이 이상해요. 잘못된 까닭을 고르고 옳게 계산해 보세요.", hints: ["대분수를 가분수로 바꾸기 전에 분모 6과 자연수 4를 약분했어요.", "[2 5/6] = [17/6]이에요. 가분수로 바꾼 다음 6과 4를 2로 약분해요."],
      render: thenWhy((b, a) => fx2Chain(b, a, [
        ["하은이의 계산: [2 5/6]×4 = [2 5/3]×2 = [11/3]×2 = [22/3] = [7 1/3]"],
        ["까닭: ", { c: ["대분수를 가분수로 바꾸지 않고 대분수의 분모와 자연수를 약분했어요", "분모에도 자연수를 곱했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[2 5/6]×4 = ", { q: [null, "?17", "6"] }, "×4 = ", { q: [null, ["17", "×", "?2"], "?3"] }, " = ", { q: [null, "?34", "3"] }, " = ", { f: "11 1/3" }] }],
        { ok: "옳은 답은 [11 1/3] kg이에요. 약분은 대분수를 가분수로 바꾼 다음에 해요." }),
        { q: "대분수의 분모와 자연수를 바로 약분하면 왜 안 될까요?", ph: "[2 5/6]의 분모 6은 ~에만 ~", help: ["① [2 5/6]에서 분모 6이 어느 부분의 분모인지 살펴봐요. → ② 자연수 부분 2는 어떻게 되는지 생각해요.", "‘분모 6은 진분수 부분에만 있어서, 바로 약분하면 자연수 부분 ~이 ~되지 않아요.’ 꼴로 써요."],
          ans: "[2 5/6]에서 분모 6은 진분수 부분 [5/6]에만 있어서, 바로 약분하면 자연수 부분 2는 함께 나누어지지 않아요. 그래서 가분수 [17/6]로 바꾼 다음 약분해야 해요." }) },
    { name: "약속하기 — (대분수)×(자연수)", inst: "인절미 반죽에서 찾은 두 방법을 정리해요.", hints: ["방법 1은 [1 2/5]를 1+[2/5]로, 방법 2는 [7/5]로 나타냈어요."],
      render: (b, a) => blanks(b, a, ["(대분수)×(자연수)는 대분수를 ", { o: ["자연수와 진분수의 합", "분자와 분모의 합"], a: 0 }, "으로 나타내어 계산하거나, 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내어 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산해요. 약분은 대분수를 가분수로 ", { o: ["바꾼 뒤에", "바꾸기 전에"], a: 0 }, " 해요."], { ok: "두 방법 모두 쓸 수 있어요. 편리한 방법을 골라 계산해요." }) },
    { name: "확인하기 — 떡 반죽 계산", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["[2 3/8] = [19/8]예요. 8과 4를 4로 약분할 수 있어요.", "[3 1/4] = [13/4]이에요. 4와 6을 2로 약분해요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[1 1/6]×5", a: "5 5/6" }, { e: "[2 3/8]×4", a: "9 1/2" }, { e: "[3 1/4]×6", a: "19 1/2" },
        { q: "꿀떡 반죽은 한 판에 찹쌀가루가 [1 3/5] kg 들어가요. 5판을 만들려면 찹쌀가루는 몇 kg 필요할까요?", x: "[1 3/5]×5", n: 8, unit: "kg", lab: "[1 3/5]×5 =", why: { "5": "자연수 부분만 곱했어요. 진분수 부분 [3/5]에도 5를 곱해요.", "3": "1×5 = 5와 [3/5]×5 = 3을 더해야 해요." } }]) }
  ],
  challenge: { inst: "★ 도전 — 수 카드 2, 5, 7을 한 번씩 모두 사용하여 가장 큰 대분수를 만들고, 그 대분수와 3의 곱을 구해 보세요.", hints: ["가장 큰 대분수는 자연수 부분에 가장 큰 수를 놓아요.", "남은 두 카드로 진분수를 만들어요. 분자가 분모보다 작아야 해요."],
    render: (b, a) => fx2Build(b, a, { cards: [2, 5, 7], shape: ["m", 3], goal: "max", maxMsg: "가장 큰 대분수가 아니에요. 자연수 부분에 가장 큰 수를 놓고, 남은 두 카드로 진분수를 만들어요.", ok: "가장 큰 대분수는 [7 2/5]예요." }) }
},
{
  id: "s4", no: 4, title: "보자기 끈과 리본 ― (자연수)×(진분수)", soop: "개념 구축하기(O)",
  question: "(자연수)×(진분수)는 어떻게 계산할까요?",
  summary: "8의 [1/4]은 8의 [1/4]배와 같고 8×[1/4]로 나타내요. (자연수)×(진분수)는 분수의 분모는 그대로 쓰고 자연수와 분자를 곱하여 계산해요. 3×[3/4] = [3×3/4] = [9/4] = [2 1/4]. 두 수의 곱셈은 순서를 바꾸어 계산해도 결과가 같아요.",
  steps: [
    { name: "만져 보기 — 끈 잘라 쓰기", inst: "유나는 선물 꾸러미를 보자기로 싸요. 보자기 매듭 장식에 끈 8 m의 [1/4]만큼을 잘라 썼어요. 8 m 막대를 똑같이 4부분으로 나누고 1부분을 색칠해 보세요.", hints: ["8의 [1/4]은 8을 똑같이 4로 나눈 것 중 1이에요.", "8의 2배는 8×2이니까, 8의 [1/4]배는 8×[1/4]이에요."],
      render: thenWhy((b, a) => fx2Part(b, a, { N: 8, d: 4, n: 1, unit: " m", name: "끈 8 m", askCalc: [{ lab: "8×[1/4] =", x: "8×[1/4]", n: 2, unit: "m", why: { "32": "8의 [1/4]배는 8을 4로 나눈 것 중 1이에요. 8×4가 아니에요.", "4": "8을 똑같이 4부분으로 나누었어요. 한 부분은 몇 m인지 세어요." } }],
        ok: "8의 [1/4]은 8의 [1/4]배와 같아요. 8×[1/4] = 2이므로 유나가 쓴 끈은 2 m예요." }),
        { q: "8 m의 [1/4]만큼을 왜 8×[1/4]로 나타낼 수 있을까요?", ph: "8의 2배가 ~인 것처럼 ~", help: ["① 8의 2배, 8의 3배를 곱셈식으로 어떻게 나타내는지 떠올려요. → ② ‘8의 [1/4]만큼’을 ‘8의 [1/4]배’로 바꾸어 생각해요.", "‘8의 2배를 8×2로 나타내는 것처럼, 8의 [1/4]배도 ~로 나타내요.’ 꼴로 써요."],
          ans: "8의 2배를 8×2로 나타내는 것처럼, 8의 [1/4]만큼은 8의 [1/4]배라서 8×[1/4]로 나타낼 수 있어요." }) },
    { name: "그려 보기 — 리본의 [3/4]만큼", inst: "도윤이는 리본 3 m의 [3/4]만큼으로 꽃 매듭을 만들어요. 3 m 막대를 똑같이 4부분으로 나누고 3부분을 색칠한 다음, 작은 눈금을 보며 계산해 보세요.", hints: ["3을 똑같이 4부분으로 나누면 한 부분은 [1/4]이 3개인 [3/4]이에요.", "3×[3/4]은 3×[1/4]의 3배예요."],
      render: (b, a) => fx2Part(b, a, { N: 3, d: 4, n: 3, unit: " m", name: "리본 3 m", ask: [
        ["3×[1/4] = ", { q: [null, "?3", "4"] }],
        ["3×[3/4] = (3×[1/4])×", { i: "3" }, " = ", { q: [null, "?3", "4"] }, "×3 = ", { q: [null, ["3", "×", "?3"], "4"] }, " = ", { q: [null, "?9", "4"] }, " = ", { f: "2 1/4" }]],
        ok: "3×[1/4]은 [1/4]이 3개인 [3/4]이고, 3×[3/4]은 그 3배인 [9/4] = [2 1/4]이에요. 도윤이가 쓴 리본은 [2 1/4] m예요." }) },
    { name: "말해 보기 — 순서를 바꾸면?", inst: "[3/4] m씩 리본 3개와 3 m의 [3/4]만큼은 길이가 같을까요? (진분수)×(자연수)인 [3/4]×3과 (자연수)×(진분수)인 3×[3/4]을 계산하여 비교해 보세요.", hints: ["두 식 모두 분모 4는 그대로 쓰고 3과 3을 곱해요."],
      render: thenWhy((b, a) => fx2Chain(b, a, [
        ["[3/4]×3 = ", { q: [null, ["3", "×", "?3"], "4"] }, " = ", { q: [null, "?9", "4"] }],
        ["3×[3/4] = ", { q: [null, ["3", "×", "?3"], "4"] }, " = ", { q: [null, "?9", "4"] }],
        ["두 곱은 ", { c: ["같아요", "달라요"], a: 0 }, ". 두 수의 곱셈은 순서를 바꾸어 계산해도 결과가 ", { c: ["같아요", "달라져요"], a: 0 }, "."]],
        { ok: "두 수의 곱셈은 순서를 바꾸어 계산해도 계산 결과가 같아요." }),
        { q: "[3/4]×3과 3×[3/4]의 곱이 같은 까닭을 써 봐요.", ph: "두 식 모두 분모 4는 ~, 분자는 ~", help: ["① 두 식을 계산할 때 분모를 어떻게 했는지 견주어요. → ② 분자에서 무엇과 무엇을 곱했는지 견주어요.", "‘두 식 모두 분모 4는 그대로 두고 ~과 ~을 곱해서 ~가 되기 때문이에요.’ 꼴로 써요."],
          ans: "두 식 모두 분모 4는 그대로 두고 분자 3과 자연수 3을 곱해서 [9/4]가 되기 때문이에요. 계산하는 방법이 같아서 곱도 같아요." }) },
    { name: "약속하기 — (자연수)×(진분수)", inst: "끈과 리본에서 찾은 방법을 약속해요.", hints: ["8의 2배가 8×2인 것처럼 8의 [1/4]배는 8×[1/4]이에요."],
      render: (b, a) => blanks(b, a, ["8의 [1/4]은 8의 [1/4]배와 같으므로 ", { o: ["8×[1/4]", "8+[1/4]", "8−[1/4]"], a: 0 }, "로 나타내요. (자연수)×(진분수)는 분수의 분모는 ", { o: ["그대로 쓰고", "자연수를 곱하고"], a: 0 }, " 자연수와 ", { o: ["분자를 곱하여", "분모를 곱하여"], a: 0 }, " 계산합니다."], { ok: "(자연수)×(진분수)는 분수의 분모는 그대로 쓰고 자연수와 분자를 곱하여 계산합니다." }) },
    { name: "확인하기 — 장터 손님 계산", inst: "계산해 보세요. 약분하지 않아도, 가분수로 써도 맞아요.", hints: ["10×[3/4]에서 10과 4를 2로 약분할 수 있어요.", "36×[5/9]에서 36과 9를 9로 약분하면 4×5예요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "5×[1/6]", a: "5/6" }, { e: "4×[2/7]", a: "1 1/7" }, { e: "10×[3/4]", a: "7 1/2" },
        { q: "장터 첫 시간에 손님 36명이 왔어요. 그중 [5/9]가 식혜를 샀어요. 식혜를 산 손님은 몇 명일까요?", x: "36×[5/9]", n: 20, unit: "명", lab: "36×[5/9] =", why: { "4": "36의 [1/9]은 4명이에요. [5/9]는 그 5배예요.", "180": "분모 9로도 나누어야 해요. 36×[5/9] = [36×5/9]예요." } }]) }
  ],
  challenge: { inst: "★ 도전 — 장터 퀴즈를 풀어 보세요.", hints: ["곱하는 두 수의 순서만 바뀐 식은 곱이 같아요.", "15×[4/9]에서 15와 9를 3으로 약분하면 [5×4/3]이에요."],
    render: (b, a) => fx2Calc(b, a, [
      { q: "곱이 다른 친구는 누구일까요? 도윤: 12×[5/6] · 유나: [5/6]×12 · 민준: 6×[5/12]", pick: ["도윤", "유나", "민준"], a: 2, why: { "0": "도윤이와 유나의 식은 곱하는 두 수의 순서만 바뀌었어요. 곱이 같아요.", "1": "도윤이와 유나의 식은 곱하는 두 수의 순서만 바뀌었어요. 곱이 같아요." } },
      { q: "다식 틀 한 판에 콩가루를 15 g 넣는데, 장식용으로 그 [4/9]만큼을 따로 덜었어요. 덜어 낸 콩가루는 몇 g일까요?", x: "15×[4/9]", a: "6 2/3", unit: "g", lab: "15×[4/9] =" }]) }
},
{
  id: "s5", no: 5, title: "현수막 줄 ― (자연수)×(대분수)", soop: "개념 구축하기(O)",
  question: "(자연수)×(대분수)는 어떻게 계산할까요?",
  summary: "(자연수)×(대분수)는 대분수를 자연수와 진분수의 합으로 나타내어 계산하거나, 대분수를 가분수로 나타내어 분모는 그대로 쓰고 자연수와 분자를 곱하여 계산해요. 4×[1 1/3] = 4+[4/3] = [5 1/3], 4×[1 1/3] = 4×[4/3] = [16/3] = [5 1/3]. (자연수)×(진분수)는 (자연수)×1보다 작고, (자연수)×(대분수)는 (자연수)×1보다 커요.",
  steps: [
    { name: "만져 보기 — 현수막 줄 길이", inst: "장터 입구에 현수막을 달아요. 도윤이가 줄 4 m를 준비했는데, 서아가 “그 줄의 [1 1/3]배는 있어야 해!”라고 했어요. 먼저 어림한 다음, ‘4×1’ 막대를 색칠하고 4 m를 똑같이 3부분으로 나누어 4×[1/3]만큼 색칠해 보세요.", hints: ["4 m의 [1 1/3]배는 4×1과 4×[1/3]을 더한 것이에요.", "4를 똑같이 3부분으로 나누면 한 부분은 [4/3]예요."],
      render: (b, a) => fx2Part(b, a, { N: 4, d: 3, n: 1, unit: " m", name: "4×[1/3]", whole: 1,
        est: { q: "필요한 줄은 몇 m쯤일까요?", o: ["4 m보다 조금 더 길어요", "4 m보다 짧아요", "8 m쯤이에요"], a: 0, why: { "1": "[1 1/3]은 1보다 커요. 4×1 = 4보다 길어요.", "2": "[1 1/3]은 2보다 작아요. 4×2 = 8보다 짧아요." }, ok: "4×1 = 4이고 [1 1/3]은 1보다 조금 크니까 4 m보다 조금 더 길 거예요." },
        ask: [{ t: "방법 1", p: ["4×[1 1/3] = (4×1)+(4×[1/3]) = ", { i: "4" }, "+", { q: [null, "?4", "3"] }, " = ", { f: "5 1/3" }] }],
        ok: "필요한 줄은 [5 1/3] m예요. 대분수를 자연수와 진분수의 합으로 나타내어 계산했어요." }) },
    { name: "그려 보기 — 가분수로 계산하기", inst: "이번에는 [1 1/3]을 가분수로 나타내어 4×[1 1/3]을 계산해 보세요.", hints: ["[1 1/3] = [4/3]예요.", "분모 3은 그대로 쓰고 4와 4를 곱해요."],
      render: (b, a) => fx2Chain(b, a, [
        { t: "방법 2", p: ["4×[1 1/3] = 4×", { q: [null, "?4", "3"] }, " = ", { q: [null, ["4", "×", "?4"], "3"] }, " = ", { q: [null, "?16", "3"] }, " = ", { f: "5 1/3" }] },
        ["필요한 줄은 [5 1/3] m로, 어림한 ‘4 m보다 조금 더’와 ", { c: ["비슷해요", "많이 달라요"], a: 0 }, "."]],
        { ok: "두 방법 모두 [5 1/3] m예요." }) },
    { name: "말해 보기 — 1보다 작은 수, 큰 수", inst: "식혜 6 L의 [3/4]만큼, 1배만큼, [1 3/4]배만큼을 비교해요. 1을 기준으로 [3/4]과 [1 3/4]의 크기를 생각해 보세요.", hints: ["[3/4]은 1보다 작고, [1 3/4]은 1보다 커요.", "6×[1 3/4] = 6×[7/4]이에요."],
      render: thenWhy((b, a) => fx2Chain(b, a, [
        ["6×[3/4] ", { c: [">", "=", "<"], a: 2 }, " 6×1 ", { c: [">", "=", "<"], a: 2 }, " 6×[1 3/4]"],
        ["6×[3/4] = ", { f: "4 1/2" }],
        ["6×[1 3/4] = 6×[7/4] = ", { f: "10 1/2" }]],
        { ok: "1보다 작은 수를 곱하면 곱이 처음 수보다 작아지고, 1보다 큰 수를 곱하면 커져요. 곱셈을 하면 항상 커지는 것은 아니에요." }),
        { q: "6에 [3/4]을 곱하면 왜 6보다 작아질까요?", ph: "6×[3/4]은 6을 ~", help: ["① 6×[3/4]이 6의 무엇만큼인지 떠올려요. → ② 6 전체인지, 6의 일부분인지 생각해요.", "‘6×[3/4]은 6을 4부분으로 나눈 것 중 ~만이라서 6보다 작아요.’ 꼴로 써요."],
          ans: "6×[3/4]은 6을 4부분으로 나눈 것 중 3부분만이라서 6보다 작아요. 1보다 작은 수를 곱하면 처음 수의 일부분만 구하는 것이기 때문이에요." }) },
    { name: "약속하기 — (자연수)×(대분수)", inst: "현수막 줄에서 찾은 방법을 정리해요.", hints: ["방법 1은 (4×1)+(4×[1/3]), 방법 2는 4×[4/3]였어요."],
      render: (b, a) => blanks(b, a, ["(자연수)×(대분수)는 대분수를 ", { o: ["자연수와 진분수의 합", "분자와 분모의 합"], a: 0 }, "으로 나타내어 계산하거나, 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내어 분모는 그대로 쓰고 ", { o: ["자연수와 분자를 곱하여", "자연수와 분모를 곱하여"], a: 0 }, " 계산해요. (자연수)×(대분수)는 (자연수)×1보다 ", { o: ["커요", "작아요"], a: 0 }, "."], { ok: "두 방법 중 편리한 방법을 골라 계산해요." }) },
    { name: "확인하기 — 장터 물건 계산", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["[1 1/4] = [5/4], [2 2/7] = [16/7], [1 3/4] = [7/4]이에요.", "8×[7/4]에서 8과 4를 4로 약분하면 2×7이에요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "5×[1 1/4]", a: "6 1/4" }, { e: "3×[2 2/7]", a: "6 6/7" }, { e: "8×[1 3/4]", n: 14 },
        { q: "약과를 한 봉지에 6개씩 담았어요. 민준이네 모둠은 [2 1/2]봉지만큼의 약과를 팔았어요. 판 약과는 몇 개일까요?", x: "6×[2 1/2]", n: 15, unit: "개", lab: "6×[2 1/2] =", why: { "13": "6×2 = 12에 6×[1/2] = 3을 더해요.", "12": "6×2만 계산했어요. 6×[1/2]도 더해요." } }]) }
  ],
  challenge: { inst: "★ 도전 — 계산하지 않고 곱이 10보다 작은지 큰지 어림하여 나누어 보세요.", hints: ["10에 1보다 작은 수를 곱하면 10보다 작아요.", "10에 1보다 큰 수를 곱하면 10보다 커요."],
    render: (b, a) => fx2Sort(b, a, { bins: ["10보다 작아요", "10보다 커요"], cards: [
      { t: "10×[3/5]", k: 0 }, { t: "10×[1 1/8]", k: 1, why: "[1 1/8]은 1보다 커요. 10에 1보다 큰 수를 곱하면 10보다 커요." }, { t: "10×[9/10]", k: 0, why: "[9/10]는 1보다 작아요. 1에 가깝지만 10보다는 작아요." },
      { t: "10×[2 1/3]", k: 1 }, { t: "[4/5]×10", k: 0, why: "순서를 바꾸면 10×[4/5]예요. [4/5]는 1보다 작아요." }],
      ok: "곱하는 수가 1보다 작으면 10보다 작고, 1보다 크면 10보다 커요." }) }
},
{
  id: "s6", no: 6, title: "약과 쟁반 ― 진분수의 곱셈", soop: "개념 구축하기(O)",
  question: "진분수끼리의 곱셈은 어떻게 계산할까요?",
  summary: "(진분수)×(진분수)는 분자는 분자끼리, 분모는 분모끼리 곱하여 계산해요. [2/3]×[3/5] = [2×3/3×5] = [6/15]. 넓이가 1인 쟁반에서 분모끼리의 곱은 전체를 똑같이 나눈 칸 수, 분자끼리의 곱은 빗금 친 칸 수예요. 나눈 조각의 크기는 모두 같아야 해요.",
  steps: [
    { name: "만져 보기 — 쟁반의 [1/4]의 [1/2]", inst: "민준이네 모둠은 약과를 담을 네모 쟁반을 꾸며요. 쟁반의 [1/4]에 한지를 깔고, 한지를 깐 부분의 [1/2]에 약과를 올렸어요. 먼저 규칙을 예상한 다음, 쟁반을 세로로 4등분하여 1칸을 색칠하고(1단계), 가로로 2등분하여 색칠한 부분의 [1/2]만큼 빗금을 그어 보세요(2단계).", hints: ["[1/4]의 [1/2]은 [1/4]×[1/2]이에요.", "전체를 4×2 = 8칸으로 나눈 것 중 1칸이에요."],
      render: ruleFirst((b, a) => fx2Area(b, a, { whole: "약과 쟁반 = 1", stages: [{ dir: "v", d: 4, n: 1, t: "[1/4]에 한지 깔기" }, { dir: "h", d: 2, n: 1, t: "그 [1/2]에 약과 올리기" }], ask: [
        ["[1/4]×[1/2] = ", { q: [null, "1", ["4", "×", "?2"]] }, " = ", { q: [null, "?1", "?8"] }]],
        ok: "약과를 올린 부분은 쟁반 전체의 [1/8]이에요. 전체를 똑같이 4×2 = 8칸으로 나눈 것 중 1칸이에요." }),
        { q: "단위분수끼리 곱하면 결과는 어떻게 될까요?", ph: "내 규칙: 분자는 ~, 분모는 ~", help: ["① 쟁반 전체가 몇 칸으로 나뉠지 생각해요. → ② 그중 약과를 올린 칸이 몇 칸일지 생각해요.", "‘내 규칙: 분자는 ~이고, 분모는 두 분모를 ~한 수예요.’ 꼴로 써요."],
          ans: "[1/4]×[1/2]은 전체를 4×2 = 8칸으로 나눈 것 중 1칸이라서 [1/8]이에요. 단위분수끼리 곱하면 분자는 1, 분모는 두 분모의 곱이 돼요." }) },
    { name: "그려 보기 — 다식 쟁반", inst: "하은이는 다른 쟁반의 [2/3]에 꽃무늬 한지를 깔고, 그 [3/5]에 다식을 올렸어요. 쟁반을 세로로 3등분하여 2칸을 색칠하고, 가로로 5등분하여 색칠한 부분의 [3/5]만큼 빗금을 그어 보세요.", hints: ["어떤 수의 [3/5]은 어떤 수를 5등분한 것 중 3이에요.", "빗금 친 칸은 2×3 = 6칸, 전체는 3×5 = 15칸이에요."],
      render: (b, a) => fx2Area(b, a, { whole: "다식 쟁반 = 1", stages: [{ dir: "v", d: 3, n: 2, t: "[2/3]에 한지 깔기" }, { dir: "h", d: 5, n: 3, t: "그 [3/5]에 다식 올리기" }], ask: [
        ["전체를 똑같이 3×5 = ", { i: "15" }, "칸으로 나누었고, 빗금 친 부분은 2×3 = ", { i: "6" }, "칸이에요."],
        ["[2/3]×[3/5] = ", { q: [null, ["2", "×", "?3"], ["3", "×", "?5"]] }, " = ", { q: [null, "?6", "?15"] }]],
        ok: "[2/3]×[3/5] = [6/15]이에요. 약분하면 [2/5]예요. 분자끼리 곱한 6은 빗금 친 칸 수, 분모끼리 곱한 15는 전체 칸 수예요." }) },
    { name: "말해 보기 — 곱한 수의 뜻", inst: "다식 쟁반 그림에서 분모끼리의 곱과 분자끼리의 곱이 무엇을 뜻하는지 골라 보세요.", hints: ["쟁반 전체를 몇 칸으로 나누었는지 세어 봐요.", "빗금 친 칸을 세어 봐요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "[2/3]×[3/5]에서 분모끼리 곱한 15(= 3×5)는 그림에서 무엇일까요?", o: ["쟁반 전체를 똑같이 나눈 칸 수", "빗금 친 칸 수", "색칠한 세로줄 수"], a: 0, why: { "1": "빗금 친 칸은 6칸이에요. 15는 쟁반 전체의 칸 수예요.", "2": "색칠한 세로줄은 2줄이에요. 15는 쟁반 전체의 칸 수예요." } },
        { q: "분자끼리 곱한 6(= 2×3)은 그림에서 무엇일까요?", o: ["다식을 올린(빗금 친) 칸 수", "쟁반 전체의 칸 수", "가로로 나눈 줄 수"], a: 0, why: { "1": "쟁반 전체는 15칸이에요. 6은 빗금 친 칸 수예요.", "2": "가로로는 5줄로 나누었어요. 6은 빗금 친 칸 수예요." } }],
        { ok: "분모끼리의 곱은 전체를 똑같이 나눈 칸 수, 분자끼리의 곱은 빗금 친 칸 수예요." }),
        { q: "진분수끼리 곱할 때 분모끼리 곱하는 까닭을 써 봐요.", ph: "세로로 ~등분, 가로로 ~등분하면 ~", help: ["① 쟁반을 세로로 몇 등분, 가로로 몇 등분했는지 떠올려요. → ② 그러면 전체가 몇 칸이 되는지 생각해요.", "‘세로로 3등분, 가로로 5등분하면 전체가 3×5 = ~칸이 되어서, 한 칸은 ~이기 때문이에요.’ 꼴로 써요."],
          ans: "세로로 3등분, 가로로 5등분하면 전체가 3×5 = 15칸으로 나뉘어서 한 칸이 [1/15]이 되기 때문이에요. 그래서 분모는 분모끼리 곱해요." }) },
    { name: "약속하기 — (진분수)×(진분수)", inst: "쟁반에서 찾은 방법을 약속해요.", hints: ["[2/3]×[3/5] = [2×3/3×5]이었어요."],
      render: (b, a) => blanks(b, a, ["(진분수)×(진분수)는 분자는 ", { o: ["분자끼리", "분모끼리"], a: 0 }, ", 분모는 ", { o: ["분모끼리", "분자끼리"], a: 0 }, " 곱하여 계산합니다. 이때 넓이 모델에서 나눈 조각의 크기는 모두 ", { o: ["같아야 해요", "달라도 돼요"], a: 0 }, "."], { ok: "(진분수)×(진분수)는 분자는 분자끼리, 분모는 분모끼리 곱하여 계산합니다." }) },
    { name: "확인하기 — 장터 자리 계산", inst: "계산해 보세요. 약분하지 않아도 맞아요.", hints: ["[5/8]×[4/9]에서 4와 8을 4로 약분할 수 있어요.", "[5/6]×[3/10]에서 5와 10, 3과 6을 약분할 수 있어요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[1/6]×[1/3]", a: "1/18" }, { e: "[3/4]×[5/7]", a: "15/28" }, { e: "[5/8]×[4/9]", a: "5/18" },
        { q: "학교 마당의 [5/6]가 장터 자리이고, 장터 자리의 [3/10]이 떡 코너예요. 떡 코너는 학교 마당 전체의 얼마일까요?", x: "[5/6]×[3/10]", a: "1/4", lab: "[5/6]×[3/10] =", why: { "8/16": "분자끼리, 분모끼리 더하면 안 돼요. 분자는 분자끼리, 분모는 분모끼리 곱해요." } }]) }
  ],
  challenge: { inst: "★ 도전 — 진분수를 곱하면 커질까요, 작아질까요? 크기를 비교해 보세요.", hints: ["[2/3]×[4/5]는 [2/3]의 [4/5]만큼이에요. [4/5]는 1보다 작아요.", "[7/8]×[8/9]을 계산하면 [56/72]이에요."],
    render: (b, a) => fx2Calc(b, a, [
      { e: "[2/3]×[4/5] ○ [2/3]", pick: [">", "=", "<"], a: 2, why: { "0": "1보다 작은 [4/5]를 곱하면 [2/3]보다 작아져요. [8/15] < [10/15]이에요.", "1": "[2/3]×[4/5] = [8/15]이고 [2/3] = [10/15]이에요." } },
      { e: "[7/8]×[8/9] ○ [7/9]", pick: [">", "=", "<"], a: 1, why: { "0": "[7/8]×[8/9] = [56/72]을 약분하면 [7/9]이에요.", "2": "[7/8]×[8/9] = [56/72]을 약분하면 [7/9]이에요." } }],
      { ok: "1보다 작은 진분수를 곱하면 곱은 처음 분수보다 작아져요. [7/8]×[8/9]은 8끼리 약분하면 [7/9]이에요." }) }
},
{
  id: "s7", no: 7, title: "조각보 꾸미기 ― 세 분수의 곱셈과 약분", soop: "개념 구축하기(O)",
  question: "세 분수의 곱셈은 어떻게 하고, 약분은 언제 하면 편리할까요?",
  summary: "세 분수의 곱셈도 분자는 분자끼리, 분모는 분모끼리 곱해요. [3/4]×[1/2]×[2/3] = [3×1×2/4×2×3] = [6/24]. 약분은 분자끼리, 분모끼리 곱하는 과정에서 해도 되고, 곱하기 전에 먼저 해도 돼요. 먼저 약분하면 곱하는 수가 작아져 계산이 쉬워요.",
  steps: [
    { name: "만져 보기 — 조각보 물들이기", inst: "유나는 장터에서 팔 조각보를 꾸며요. 천의 [3/4]에 노란 물을 들이고(1단계), 그중 [1/2]에 꽃수를 놓고(2단계), 꽃수를 놓은 부분의 [2/3]에 금실을 더했어요(3단계). 그림으로 나타내 보세요.", hints: ["3단계에서는 빗금 친 줄 안의 작은 줄을 2개 골라요.", "전체는 4×2×3 = 24칸, 진한 빗금은 3×1×2 = 6칸이에요."],
      render: (b, a) => fx2Area(b, a, { whole: "조각보 천 = 1", stages: [{ dir: "v", d: 4, n: 3, t: "[3/4]에 물들이기" }, { dir: "h", d: 2, n: 1, t: "그 [1/2]에 꽃수" }, { dir: "h2", d: 3, n: 2, t: "다시 그 [2/3]에 금실" }], ask: [
        ["전체를 똑같이 4×2×3 = ", { i: "24" }, "칸으로 나누었고, 진한 빗금은 3×1×2 = ", { i: "6" }, "칸이에요."],
        ["[3/4]×[1/2]×[2/3] = ", { q: [null, ["3", "×", "1", "×", "?2"], ["4", "×", "2", "×", "?3"]] }, " = ", { q: [null, "?6", "?24"] }]],
        ok: "금실을 더한 부분은 천 전체의 [6/24]이에요. 약분하면 [1/4]이에요. 세 분수의 곱셈도 분자는 분자끼리, 분모는 분모끼리 곱해요." }) },
    { name: "그려 보기 — 두 가지 약분 방법", inst: "식혜 [4/9] L 중 [3/8]만큼을 시음 컵에 따랐어요. 시음 컵의 식혜는 몇 L일까요? 서아와 민준이가 [4/9]×[3/8]을 서로 다른 방법으로 계산했어요.", hints: ["4와 8을 4로 약분하면 1과 2, 3과 9를 3으로 약분하면 1과 3이에요.", "민준이는 곱하기 전에 두 분수를 먼저 약분했어요."],
      render: thenWhy((b, a) => fx2Chain(b, a, [
        { t: "서아", p: ["[4/9]×[3/8] = ", { q: [null, ["4", "×", "3"], ["9", "×", "8"]] }, " = ", { q: [null, ["?1", "×", "?1"], ["?3", "×", "?2"]] }, " = ", { q: [null, "?1", "?6"] }] },
        { t: "민준", p: ["[4/9]×[3/8] = ", { q: [null, "?1", "?3"] }, "×", { q: [null, "?1", "?2"] }, " = ", { q: [null, "?1", "?6"] }] },
        ["서아는 분자끼리, 분모끼리 곱하는 과정에서 약분했고, 민준이는 ", { c: ["곱하기 전에 먼저 약분했어요", "곱한 뒤에 약분했어요"], a: 0 }, "."]],
        { ok: "두 방법 모두 [1/6] L예요. 약분을 언제 하든 결과는 같아요." }),
        { q: "[4/9]×[3/8]에서 4와 8을 약분해도 되는 까닭은 무엇일까요?", ph: "분자끼리, 분모끼리 곱하면 4와 8이 ~", help: ["① [4/9]×[3/8] = [4×3/9×8]에서 4와 8이 각각 어디에 있는지 살펴봐요. → ② 한 분수의 분자와 분모를 같은 수로 나누는 것과 같은지 생각해요.", "‘[4×3/9×8]에서 4는 ~에, 8은 ~에 있어서 같은 수로 나누어도 크기가 같아요.’ 꼴로 써요."],
          ans: "[4×3/9×8]처럼 하나의 분수로 보면 4는 분자에, 8은 분모에 있어요. 분자와 분모를 같은 수 4로 나누는 것이라 분수의 크기가 변하지 않아요." }) },
    { name: "말해 보기 — 수 카드로 식 만들기", inst: "장터 쉬는 시간에 수 카드 놀이를 해요. 수 카드 2, 3, 4, 5, 7, 9 중에서 4장을 골라 한 번씩만 사용하여 진분수의 곱셈식을 만들고 곱을 써 보세요. 여러 가지 식을 만들 수 있어요.", hints: ["진분수는 분자가 분모보다 작아요.", "예를 들어 [2/5]×[3/7]처럼 만들 수 있어요."],
      render: thenWhy((b, a) => fx2Build(b, a, { cards: [2, 3, 4, 5, 7, 9], shape: ["p", "p"], goal: "any", ok: "진분수의 곱셈식을 만들어 계산했어요!" }),
        { q: "내가 만든 식의 곱은 곱한 두 진분수보다 클까요, 작을까요? 까닭도 써 봐요.", ph: "곱은 두 진분수보다 ~. 왜냐하면 ~", help: ["① 내 식의 곱과 두 진분수의 크기를 견주어 봐요. → ② 진분수는 1보다 큰지 작은지 생각해요.", "‘곱은 두 진분수보다 작아요. 왜냐하면 진분수는 1보다 ~서, 곱하면 ~만 구하기 때문이에요.’ 꼴로 써요."],
          ans: "곱은 두 진분수보다 작아요. 진분수는 1보다 작아서, 어떤 수에 진분수를 곱하면 그 수의 일부분만 구하게 되기 때문이에요." }) },
    { name: "약속하기 — 세 분수와 약분", inst: "조각보와 식혜에서 알게 된 것을 약속해요.", hints: ["[3/4]×[1/2]×[2/3] = [3×1×2/4×2×3]였어요."],
      render: (b, a) => blanks(b, a, ["세 분수의 곱셈도 분자는 ", { o: ["분자끼리", "분모끼리"], a: 0 }, ", 분모는 분모끼리 곱해요. 약분은 곱하는 과정에서 해도 되고 ", { o: ["곱하기 전에 먼저 해도 돼요", "반드시 다 곱한 뒤에만 해요"], a: 0 }, ". 먼저 약분하면 곱하는 수가 ", { o: ["작아져 계산이 쉬워요", "커져 계산이 어려워요"], a: 0 }, "."], { ok: "편리한 때에 약분하며 분자는 분자끼리, 분모는 분모끼리 곱해요." }) },
    { name: "확인하기 — 조각보와 식혜 계산", inst: "계산해 보세요. 약분하지 않아도 맞아요.", hints: ["[7/8]×[4/21]에서 7과 21, 4와 8을 약분할 수 있어요.", "[9/10]×[2/3]×[1/2]에서 9와 3을 3으로, 분자 2와 분모 2를 2로 약분할 수 있어요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[2/3]×[3/4]×[1/5]", a: "1/10" }, { e: "[5/6]×[9/10]", a: "3/4" }, { e: "[7/8]×[4/21]", a: "1/6" },
        { q: "식혜 [9/10] L 중 [2/3]를 시음 컵에 따르고, 그중 [1/2]을 선생님께 드렸어요. 선생님께 드린 식혜는 몇 L일까요?", x: "[9/10]×[2/3]×[1/2]", a: "3/10", unit: "L", lab: "[9/10]×[2/3]×[1/2] =" }]) }
  ],
  challenge: { inst: "★ 도전 — 지호가 어떤 수에 [3/4]을 곱해야 할 것을 잘못하여 [3/4]을 뺐더니 [1/8]이 되었어요.", hints: ["어떤 수 − [3/4] = [1/8]이므로 어떤 수 = [1/8]+[3/4]이에요.", "어떤 수를 구한 다음 [3/4]을 곱해요."],
    render: (b, a) => fx2Calc(b, a, [
      { q: "어떤 수는 얼마일까요?", x: "[1/8]+[3/4]", a: "7/8", lab: "어떤 수 =", why: { "5/8": "어떤 수에서 [3/4]을 뺐더니 [1/8]이 되었어요. 거꾸로 [1/8]에 [3/4]을 더해요." } },
      { q: "바르게 계산한 값은 얼마일까요?", x: "[7/8]×[3/4]", a: "21/32", lab: "어떤 수×[3/4] =" }], { ok: "어떤 수는 [7/8]이고, 바르게 계산하면 [7/8]×[3/4] = [21/32]이에요." }) }
},
{
  id: "s8", no: 8, title: "손님 돗자리 ― (대분수)×(대분수)", soop: "개념 구축하기(O)",
  question: "(대분수)×(대분수)는 어떻게 계산할까요?",
  summary: "(대분수)×(대분수)는 곱하는 대분수를 자연수와 진분수의 합으로 나타내어 계산하거나 두 대분수를 가분수로 나타내어 계산해요. [1 2/3]×[1 1/2] = ([1 2/3]×1)+([1 2/3]×[1/2]) = [1 2/3]+[5/6] = [2 1/2], [1 2/3]×[1 1/2] = [5/3]×[3/2] = [15/6] = [2 1/2]. 대분수를 가분수로 바꾸지 않고 진분수 부분끼리 약분하면 안 돼요.",
  steps: [
    { name: "만져 보기 — 돗자리 나누기", inst: "장터 손님이 앉을 돗자리를 만들어요. 직사각형 돗자리는 가로 [1 2/3] m, 세로 [1 1/2] m예요. 먼저 넓이를 어림한 다음, 세로를 1 m와 [1/2] m로 나누어 보세요.", hints: ["(직사각형의 넓이) = (가로)×(세로)예요.", "파란 부분은 [1 2/3]×1, 노란 부분은 [1 2/3]×[1/2]이에요."],
      render: (b, a) => fx2Mat(b, a, { A: "1 2/3", B: "1 1/2", mode: 1, what: "돗자리",
        est: { q: "돗자리의 넓이는 몇 m²쯤일까요?", o: ["1 m²보다 넓고 4 m²보다 좁아요", "1 m²보다 좁아요", "4 m²보다 넓어요"], a: 0, why: { "1": "가로와 세로가 모두 1 m보다 길어요. 1×1 = 1보다 넓어요.", "2": "가로와 세로가 모두 2 m보다 짧아요. 2×2 = 4보다 좁아요." }, ok: "가로와 세로가 1 m와 2 m 사이니까 넓이는 1 m²와 4 m² 사이일 거예요." },
        ask: [{ t: "방법 1", p: ["[1 2/3]×[1 1/2] = ([1 2/3]×1)+([1 2/3]×[1/2]) = [1 2/3]+([5/3]×[1/2]) = [1 2/3]+", { q: [null, "?5", "?6"] }, " = ", { q: [null, "?10", "6"] }, "+[5/6] = ", { q: [null, "?15", "6"] }, " = ", { f: "2 1/2" }] }],
        ok: "파란 부분과 노란 부분의 넓이를 더하면 [2 1/2] m²예요. 어림한 대로 1 m²와 4 m² 사이예요." }) },
    { name: "그려 보기 — 가분수로 칸 세기", inst: "이번에는 두 대분수를 가분수로 나타내어 계산해요. 가로와 세로의 1 m를 똑같이 나누어 칸이 돗자리 끝에 딱 맞게 해 보세요. 점선 정사각형이 1 m²예요.", hints: ["가로 [1 2/3] m는 [1/3] m가 5칸, 세로 [1 1/2] m는 [1/2] m가 3칸이에요.", "1 m² 안에는 3×2 = 6칸이 들어가요. 한 칸은 [1/6] m²예요."],
      render: (b, a) => fx2Mat(b, a, { A: "1 2/3", B: "1 1/2", mode: 2, what: "돗자리", tip: "‘＋’, ‘－’로 가로와 세로의 1 m를 똑같이 나누어요. 주황 점선 정사각형이 1 m²예요.", ask: [
        { t: "방법 2", p: ["[1 2/3]×[1 1/2] = ", { q: [null, "?5", "3"] }, "×", { q: [null, "?3", "2"] }, " = ", { q: [null, ["5", "×", "?3"], ["3", "×", "?2"]] }, " = ", { q: [null, "?15", "6"] }, " = ", { f: "2 1/2" }] },
        ["돗자리의 넓이는 어림한 범위(1 m²와 4 m² 사이)에 ", { c: ["들어가요", "들어가지 않아요"], a: 0 }, "."]],
        ok: "[1/6] m²인 칸이 15칸이므로 [15/6] = [2 1/2] m²예요. 방법 1과 결과가 같아요." }) },
    { name: "말해 보기 — 지호의 실수", inst: "지호가 [2 3/4]×[1 5/9]를 계산했는데 답이 이상해요. 잘못된 까닭을 고르고 옳게 계산해 보세요.", hints: ["대분수를 가분수로 바꾸기 전에 진분수 부분끼리 약분하면 안 돼요.", "[2 3/4] = [11/4], [1 5/9] = [14/9]예요. 14와 4를 2로 약분해요."],
      render: thenWhy((b, a) => fx2Chain(b, a, [
        ["지호의 계산: [2 3/4]×[1 5/9] = [2 1/4]×[1 5/3] = [9/4]×[8/3] = 6"],
        ["까닭: ", { c: ["대분수를 가분수로 나타내지 않고 진분수 부분끼리 약분했어요", "분모끼리 더했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[2 3/4]×[1 5/9] = ", { q: [null, "?11", "4"] }, "×", { q: [null, "?14", "9"] }, " = ", { q: [null, ["11", "×", "?7"], ["?2", "×", "9"]] }, " = ", { q: [null, "?77", "18"] }, " = ", { f: "4 5/18" }] }],
        { ok: "옳은 답은 [4 5/18]예요. 약분은 대분수를 가분수로 바꾼 다음에 해요." }),
        { q: "[2 3/4]의 3과 [1 5/9]의 9를 바로 약분하면 왜 안 될까요?", ph: "[2 3/4]의 분자는 3이 아니라 ~", help: ["① [2 3/4]을 가분수로 바꾸면 분자가 얼마인지 살펴봐요. → ② 3이 정말 곱하는 분수의 분자인지 생각해요.", "‘[2 3/4]을 가분수로 바꾸면 분자는 ~이라서, 3과 9를 약분하는 것은 ~예요.’ 꼴로 써요."],
          ans: "[2 3/4]을 가분수로 바꾸면 [11/4]이라서 실제로 곱하는 분자는 3이 아니라 11이에요. 그래서 3과 9를 약분하면 다른 수를 계산하게 돼요." }) },
    { name: "약속하기 — (대분수)×(대분수)", inst: "돗자리에서 찾은 방법을 약속해요.", hints: ["방법 1은 [1 1/2]을 1과 [1/2]로 나누었고, 방법 2는 두 수를 가분수로 바꾸었어요."],
      render: (b, a) => blanks(b, a, ["(대분수)×(대분수)는 곱하는 대분수를 ", { o: ["자연수와 진분수의 합", "두 분수의 차"], a: 0 }, "으로 나타내어 계산하거나 두 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내어 계산합니다. 약분은 대분수를 가분수로 ", { o: ["바꾼 뒤에", "바꾸기 전에"], a: 0 }, " 해요."], { ok: "곱하는 대분수를 자연수와 진분수의 합으로 나타내어 계산하거나 두 대분수를 가분수로 나타내어 계산합니다." }) },
    { name: "확인하기 — 장터 넓이와 길이", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["먼저 대분수를 가분수로 바꾸어요.", "[3 1/2]×[1 3/7] = [7/2]×[10/7]에서 7과 7, 2와 10을 약분해요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[1 1/3]×[2 1/4]", n: 3 }, { e: "[2 2/5]×[1 1/6]", a: "2 4/5" }, { e: "[3 1/2]×[1 3/7]", n: 5 },
        { q: "지호는 장터 안내 리본을 [1 3/4] m 만들었고, 유나는 지호가 만든 리본의 [2 1/3]배를 만들었어요. 유나가 만든 리본은 몇 m일까요?", x: "[1 3/4]×[2 1/3]", a: "4 1/12", unit: "m", lab: "[1 3/4]×[2 1/3] =" }]) }
  ],
  challenge: { inst: "★ 도전 — 장터 부엌에서 생긴 문제를 풀어 보세요.", hints: ["[2 2/5] = [12/5], [3 3/4] = [15/4]예요.", "[3 1/3] = [10/3], [2 1/4] = [9/4]예요."],
    render: (b, a) => fx2Calc(b, a, [
      { q: "수도에서 1분에 [2 2/5] L씩 물이 나와요. [3 3/4]분 동안 받은 물은 몇 L일까요?", x: "[2 2/5]×[3 3/4]", n: 9, unit: "L", lab: "[2 2/5]×[3 3/4] =" },
      { q: "떡 판 하나의 넓이는 [3 1/3] m²예요. 큰 떡 판은 그 [2 1/4]배예요. 큰 떡 판의 넓이는 몇 m²일까요?", x: "[3 1/3]×[2 1/4]", a: "7 1/2", unit: "m²", lab: "[3 1/3]×[2 1/4] =" }]) }
},
{
  id: "s9", no: 9, title: "수익금 투표 ― 생각을 모아요", soop: "탐구 정리하기(O)",
  question: "학급 회의에서 의견이 통과되려면 찬성표를 최소 몇 표 받아야 할까요?",
  summary: `장터 수익금 쓰임을 정하는 학급 회의 규칙: ① 반 전체 학생 수의 [1/2]보다 많은 학생이 참석하고 ② 참석한 학생 수의 [2/3]보다 많은 찬성표를 받아야 해요. 27명인 우리 반: 27×[1/2] = [13 1/2]이므로 최소 ${FX2_V27.att}명 참석, ${FX2_V27.att}×[2/3] = [9 1/3]이므로 최소 ${FX2_V27.v}표. 곱이 자연수로 나오면 ‘보다 많은’이므로 그 수에 1을 더해요.`,
  steps: [
    { name: "만져 보기 — 회의 규칙 읽기", inst: "장터가 끝나고 수익금이 생겼어요! 수익금을 어디에 쓸지 학급 회의에서 투표로 정해요. 우리 반은 27명이에요. 회의 규칙: ① 반 전체 학생 수의 [1/2]보다 많은 학생이 회의에 참석해야 해요. ② 참석한 학생 수의 [2/3]보다 많은 찬성표를 받아야 의견이 통과돼요.", hints: ["문제에서 ‘최소 몇 표’를 묻고 있어요.", "‘5보다 많은’ 자연수는 6, 7, 8, …이에요. 5는 들어가지 않아요."],
      render: (b, a) => quiz(b, a, [
        { q: "이 문제에서 구하려는 것은 무엇일까요?", o: ["의견이 통과되기 위한 최소 찬성표 수", "회의에 참석한 학생 수", "우리 반 학생 수"], a: 0, why: { "1": "참석 인원은 찬성표를 구하는 데 필요한 중간 값이에요.", "2": "우리 반 학생 수는 27명으로 이미 주어졌어요." } },
        { q: "학생이 10명인 모둠이라면 10×[1/2] = 5예요. 회의가 열리려면 최소 몇 명이 참석해야 할까요?", o: ["5명", "6명", "4명"], a: 1, why: { "0": "5명은 5와 같아요. ‘5보다 많은’ 자연수는 6부터예요.", "2": "4명은 5보다 적어요." } }],
        { ok: "구하려는 것은 최소 찬성표 수이고, ‘보다 많은’에는 그 수가 들어가지 않아요." }) },
    { name: "그려 보기 — 계획 세우기", inst: "문제를 어떻게 풀지 계획을 세워 보세요.", hints: ["참석 조건은 반 전체 학생 수의 [1/2], 찬성 조건은 참석한 학생 수의 [2/3]예요."],
      render: (b, a) => blanks(b, a, ["먼저 ", { o: ["27×[1/2]", "27×[2/3]"], a: 0 }, "을 계산하여 그보다 많은 가장 작은 자연수로 최소 참석 인원을 구해요. 그다음 (최소 참석 인원)×", { o: ["[2/3]", "[1/2]"], a: 0 }, "를 계산하여 그보다 많은 가장 작은 자연수로 최소 찬성표를 구해요."], { ok: "계획을 세웠어요. 이제 해결해 봐요." }) },
    { name: "말해 보기 — 우리 반 투표", inst: "우리 반 27명이에요. 참석 인원과 찬성표를 바꾸어 보며 의견이 통과되는 가장 적은 수를 찾고, 식으로 확인해 보세요.", hints: ["27×[1/2] = [13 1/2]이에요. [13 1/2]보다 많은 가장 작은 자연수는?", `${FX2_V27.att}×[2/3] = [9 1/3]이에요. [9 1/3]보다 많은 가장 작은 자연수는?`],
      render: (b, a) => fx2Vote(b, a, { N: 27, who: "학생", all: "반 전체 학생 수", ask: [
        ["27×[1/2] = ", { q: [null, "?27", "2"] }, " = ", { q: ["?13", "?1", "2"] }],
        ["→ 회의에 최소 ", { i: String(FX2_V27.att) }, "명이 참석해야 해요."],
        [{ i: String(FX2_V27.att) }, "×[2/3] = ", { q: [null, "?28", "3"] }, " = ", { q: ["?9", "?1", "3"] }],
        ["→ 찬성표를 최소 ", { i: String(FX2_V27.v) }, "표 받아야 해요."]],
        ok: `우리 반 의견이 통과되려면 최소 ${FX2_V27.att}명이 참석하고, 찬성표를 최소 ${FX2_V27.v}표 받아야 해요.` }) },
    { name: "약속하기 — 5학년 장터 위원회", inst: "5학년 전체 장터 위원회도 같은 규칙으로 투표해요. 위원은 75명이에요. 의견이 통과되려면 찬성표를 최소 몇 표 받아야 할까요?", hints: ["75×[1/2] = [37 1/2]이에요.", `${FX2_V75.att}×[2/3] = [25 1/3]이에요.`],
      render: (b, a) => fx2Chain(b, a, [
        ["75×[1/2] = ", { q: [null, "?75", "2"] }, " = ", { q: ["?37", "?1", "2"] }],
        ["→ 회의에 최소 ", { i: String(FX2_V75.att) }, "명이 참석해야 해요."],
        [{ i: String(FX2_V75.att) }, "×[2/3] = ", { q: [null, "?76", "3"] }, " = ", { q: ["?25", "?1", "3"] }],
        ["→ 찬성표를 최소 ", { i: String(FX2_V75.v) }, "표 받아야 해요."]],
        { ok: `5학년 장터 위원회는 최소 ${FX2_V75.att}명이 참석하고, 찬성표를 최소 ${FX2_V75.v}표 받아야 해요.` }) },
    { name: "확인하기 — 되돌아보기", inst: "우리가 문제를 어떻게 해결했는지 되돌아보고 써 보세요.", hints: ["두 번 곱한 식을 차례대로 떠올려요.", "‘보다 많은’ 때문에 어떻게 했는지 떠올려요."],
      render: (b, a) => writeStep(b, a, [
        { q: "우리 반의 최소 찬성표를 어떻게 구했는지 설명해 보세요.", tag: "해결 방법", ph: "예) 먼저 27×[1/2]을 계산하여 …", help: ["① 최소 참석 인원을 어떤 식으로 구했는지 써요. → ② 그 인원으로 최소 찬성표를 어떤 식으로 구했는지 차례대로 써요.", "‘27×[1/2] = ~보다 많은 ~명이 참석하고, ~×[2/3] = ~보다 많은 ~표가 필요해요.’ 꼴로 써요."],
          ans: `27×[1/2] = [13 1/2]보다 많아야 하므로 최소 ${FX2_V27.att}명이 참석하고, ${FX2_V27.att}×[2/3] = [9 1/3]보다 많아야 하므로 찬성표는 최소 ${FX2_V27.v}표가 필요해요.` },
        { q: "곱이 자연수로 딱 나누어떨어질 때는 무엇을 조심해야 할까요?", tag: "조심할 점", ph: "예) 30×[2/3] = 20이면 …", help: ["① 30명이 참석해서 30×[2/3] = 20일 때를 생각해요. → ② 20표로 ‘20보다 많은’ 조건을 만족하는지 따져요.", "‘곱이 자연수이면 그 수는 들어가지 않으니, 그 수에 ~을 더해야 해요.’ 꼴로 써요."],
          ans: "곱이 자연수이면 ‘보다 많은’ 조건에 그 수는 들어가지 않으니, 그 수에 1을 더해야 해요. 30명이 참석하면 30×[2/3] = 20이므로 21표가 필요해요." }]) }
  ],
  challenge: { inst: "★ 도전 — 5학년과 6학년이 함께하는 학교 장터 위원회는 47명이라고 해요(이 앱에서 정한 수). 의견이 통과되기 위한 최소 찬성표를 구해 보세요. 곱이 자연수로 나올 때 조심해요!", hints: ["47×[1/2] = [23 1/2]이므로 최소 24명이 참석해요.", "24×[2/3] = 16이에요. 16보다 많아야 해요."],
    render: (b, a) => fx2Vote(b, a, { N: 47, who: "위원", all: "전체 위원 수", ask: [
      ["47×[1/2] = ", { q: [null, "?47", "2"] }, " = ", { q: ["?23", "?1", "2"] }],
      ["→ 회의에 최소 ", { i: String(FX2_V47.att) }, "명이 참석해야 해요."],
      [{ i: String(FX2_V47.att) }, "×[2/3] = ", { i: "16" }],
      ["→ 찬성표를 최소 ", { i: String(FX2_V47.v) }, "표 받아야 해요."]],
      ok: `24×[2/3] = 16처럼 곱이 자연수이면 16표로는 안 되고, 최소 ${FX2_V47.v}표가 필요해요.` }) }
},
{
  id: "s10", no: 10, title: "장터 놀이 마당 ― 곱이 더 큰 식 만들기", soop: "발표하기(P)",
  question: "조건에 맞는 분수의 곱셈식에서 곱을 더 크게 만들려면 어떻게 해야 할까요?",
  summary: "조건 카드에 맞게 수 카드를 한 번씩만 사용하여 식을 만들고 계산해요. 곱이 맞으면 1점, 그 카드로 만들 수 있는 가장 큰 곱이면 2점을 더 얻어요. 곱이 더 큰 식을 만들려면 자연수끼리의 곱이나 분자끼리의 곱은 크게, 분모의 곱은 작게 만들어요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알아보기", inst: "장터 놀이 마당에서 ‘곱 키우기 카드 놀이’를 해요. 조건 카드 한 장을 뒤집고, 조건에 맞게 수 카드를 가져와 한 번씩만 사용하여 식을 만들고 계산해요. 곱이 맞으면 1점, 가장 큰 곱이면 2점을 더 얻어요.", hints: ["수 카드는 한 번씩만 써요.", "진분수는 분자가 분모보다 작아요."],
      render: (b, a) => quiz(b, a, [
        { q: "조건 카드가 ‘(진분수)×(자연수)’일 때 알맞은 식은?", o: ["[2/9]×6", "[9/2]×6", "6×[2/9]"], a: 0, why: { "1": "[9/2]는 분자가 분모보다 커서 진분수가 아니에요.", "2": "6×[2/9]는 (자연수)×(진분수)예요. 조건 카드의 순서대로 만들어요." } },
        { q: "곱을 맞게 계산했지만 가장 큰 곱은 아니라면 몇 점일까요?", o: ["1점", "3점", "0점"], a: 0, why: { "1": "3점은 곱이 맞고(1점) 가장 큰 곱일 때(2점 더) 얻어요.", "2": "곱이 맞으면 1점을 얻어요." } }],
        { ok: "놀이 방법을 알았어요. 곱이 맞아야 점수를 얻고, 가장 큰 곱이면 점수를 더 얻어요." }) },
    { name: "그려 보기 — 지호의 식", inst: "지호가 조건 카드 ‘(진분수)×(자연수)’와 수 카드 2, 6, 9로 식 [2/9]×6을 만들었어요. 계산하고, 더 큰 곱을 만들 수 있는지 생각해 보세요.", hints: ["9와 6을 3으로 약분할 수 있어요.", "[2/6]×9도 조건에 맞아요. 계산해 보세요."],
      render: (b, a) => fx2Calc(b, a, [
        { e: "[2/9]×6", a: "1 1/3" },
        { e: "[2/6]×9", n: 3 },
        { q: "지호의 식보다 곱이 더 큰 식은?", pick: ["[2/6]×9", "[6/9]×2", "없어요"], a: 0, why: { "1": "[6/9]×2 = [12/9] = [1 1/3]이라서 지호의 식과 곱이 같아요.", "2": "[2/6]×9 = 3이라서 [1 1/3]보다 커요." } }], { ok: "같은 카드로도 자리를 바꾸면 곱이 달라져요. [2/6]×9 = 3이 [2/9]×6 = [1 1/3]보다 커요." }) },
    { name: "말해 보기 — 가장 큰 곱 만들기", inst: "같은 수 카드 2, 6, 9로 ‘(진분수)×(자연수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.", hints: ["곱하는 자연수를 크게 해 봐요.", "분자와 자연수의 곱은 크게, 분모는 작게 해요."],
      render: thenWhy((b, a) => fx2Build(b, a, { cards: [2, 6, 9], shape: ["p", "w"], goal: "max", ok: "가장 큰 곱을 찾았어요!" }),
        { q: "어떻게 하면 곱이 커지는지 까닭과 함께 써 봐요.", ph: "가장 큰 수 9를 ~에 놓으면 ~", help: ["① [2/6]×9와 [2/9]×6에서 분자×자연수와 분모를 견주어요. → ② 분모가 작을수록 분수가 어떻게 되는지 생각해요.", "‘가장 큰 수 9를 ~에 놓아야 분자와 자연수의 곱이 ~지고, 분모는 ~아져서 곱이 커져요.’ 꼴로 써요."],
          ans: "가장 큰 수 9를 자연수 자리에 놓으면 분자와 자연수의 곱(2×9 = 18)은 크고 분모(6)는 작아져서 곱이 커져요. 9를 분모에 놓으면 분모가 커져서 곱이 작아져요." }) },
    { name: "약속하기 — 곱을 크게 하는 방법", inst: "곱이 더 큰 식을 만드는 방법과 주의할 점을 정리해요.", hints: ["분모가 작을수록 분수의 크기가 커요."],
      render: (b, a) => blanks(b, a, ["곱이 더 큰 식을 만들려면 자연수끼리의 곱이나 분자끼리의 곱은 ", { o: ["크게", "작게"], a: 0 }, ", 분모의 곱은 ", { o: ["작게", "크게"], a: 0 }, " 만들어요. 수 카드는 ", { o: ["한 번씩만", "여러 번"], a: 0 }, " 사용하고, ", { o: ["조건에 맞는 식", "아무 식"], a: 0 }, "을 만들어야 해요."], { ok: "이제 놀이를 해 봐요!" }) },
    { name: "확인하기 — 곱 키우기 놀이", inst: "조건 카드와 수 카드가 무작위로 나와요. 5판을 하며 조건에 맞는 식을 만들고 곱을 써요. 곱이 맞으면 1점, 그 카드로 만들 수 있는 가장 큰 곱이면 2점을 더 얻어요. 3점 이상이면 통과예요.", hints: ["진분수는 분자가 분모보다 작아요. 대분수의 분수 부분도 진분수예요.", "곱을 크게 하려면 자연수와 분자는 크게, 분모는 작게 해요."],
      render: (b, a) => fx2Game(b, a, { rounds: 5, need: 3 }) }
  ],
  challenge: { inst: "★ 도전 — 수 카드 3, 4, 5, 8을 한 번씩 모두 사용하여 ‘(진분수)×(진분수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.", hints: ["분모 두 개에 들어갈 수와 분자 두 개에 들어갈 수를 나누어 생각해요.", "진분수여야 하니 분자가 분모보다 작아야 해요. 여러 식을 계산해 비교해 봐요."],
    render: (b, a) => fx2Build(b, a, { cards: [3, 4, 5, 8], shape: ["p", "p"], goal: "max", ok: "곱이 가장 큰 식을 찾았어요!" }) }
},
{
  id: "s11", no: 11, title: "장터 발표회 ― 공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분수의 곱셈을 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
  summary: "(분수)×(자연수)는 분모는 그대로 쓰고 분자에 자연수를 곱해요. (자연수)×(분수)는 분모는 그대로 쓰고 자연수와 분자를 곱해요. (진분수)×(진분수)는 분자는 분자끼리, 분모는 분모끼리 곱해요. 대분수가 있으면 가분수로 나타내거나 자연수와 진분수의 합으로 나타내어 계산해요. 1보다 작은 수를 곱하면 곱이 작아져요. 약분하지 않아도, 가분수로 써도 맞아요.",
  steps: [
    { name: "만져 보기 — 그림으로 곱하기", inst: "장터 발표회 첫 순서예요. 다식 한 판에 콩가루가 [3/4]컵 들어가요. 3판을 만든 양을 막대에 담고 [3/4]×3을 계산해 보세요.", hints: ["[3/4]은 [1/4]이 3개예요.", "분모 4는 그대로 쓰고 분자 3에 3을 곱해요."],
      render: (b, a) => fx2Pour(b, a, { d: 4, amt: "3/4", k: 3, unit: "컵", ask: [
        ["[3/4]×3 = [3/4]+[3/4]+[3/4] = ", { q: [null, ["3", "×", "?3"], "4"] }, " = ", { q: [null, "?9", "4"] }, " = ", { f: "2 1/4" }]], ok: "콩가루는 [9/4]컵 = [2 1/4]컵이에요." }) },
    { name: "그려 보기 — 계산하기", inst: "계산해 보세요. 약분하지 않아도, 가분수로 써도 맞아요.", hints: ["약분할 수 있는 수끼리 먼저 약분하면 계산이 쉬워요.", "[2 2/3] = [8/3], [1 1/8] = [9/8]예요."],
      render: (b, a) => fx2Calc(b, a, [{ e: "[5/6]×9", a: "7 1/2" }, { e: "8×[3/10]", a: "2 2/5" }, { e: "[4/9]×[3/8]", a: "1/6" }, { e: "[2 2/3]×[1 1/8]", n: 3 }]) },
    { name: "말해 보기 — 크기 비교", inst: "계산 결과의 크기를 비교하여 >, =, < 중 알맞은 것을 골라 보세요.", hints: ["9×[1 1/6] = [63/6], [2 3/4]×4 = 11이에요.", "1보다 작은 수를 곱하면 처음 수보다 작아져요."],
      render: (b, a) => fx2Calc(b, a, [
        { e: "9×[1 1/6] ○ [2 3/4]×4", pick: [">", "=", "<"], a: 2, why: { "0": "9×[1 1/6] = [10 1/2], [2 3/4]×4 = 11이에요.", "1": "9×[1 1/6] = [10 1/2], [2 3/4]×4 = 11이에요." } },
        { e: "[2/5]×[5/6] ○ [1/3]", pick: [">", "=", "<"], a: 1, why: { "0": "[2/5]×[5/6] = [10/30]을 약분하면 [1/3]이에요.", "2": "[2/5]×[5/6] = [10/30]을 약분하면 [1/3]이에요." } },
        { e: "[3/4]×[8/9] ○ [3/4]", pick: [">", "=", "<"], a: 2, why: { "0": "[8/9]은 1보다 작아요. 1보다 작은 수를 곱하면 [3/4]보다 작아져요.", "1": "[8/9]은 1이 아니에요. [3/4]×[8/9] = [2/3]예요." } }]) },
    { name: "약속하기 — 고치고 알려 주기", inst: "민준이가 떡고물 [1 3/8] kg씩 6판의 양을 계산했어요. 잘못된 까닭을 고르고 옳게 계산한 다음, 민준이에게 바르게 계산하는 방법을 알려 주는 말을 써 보세요. 민준이의 계산: [1 3/8]×6 = [1 3/4]×3 = [7/4]×3 = [21/4] = [5 1/4]", hints: ["대분수를 가분수로 바꾼 뒤에 약분해요. [1 3/8] = [11/8]이에요.", "[11/8]×6에서 8과 6을 2로 약분하면 [11×3/4]이에요."],
      render: (b, a) => { fx2Chain(b, a, [
        ["까닭: ", { c: ["대분수를 가분수로 바꾸지 않고 대분수의 분모와 자연수를 약분했어요", "분자끼리 곱했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[1 3/8]×6 = ", { q: [null, "?11", "8"] }, "×6 = ", { q: [null, ["11", "×", "?3"], "4"] }, " = ", { q: [null, "?33", "4"] }, " = ", { f: "8 1/4" }] }],
        { ok: "옳은 답은 [8 1/4] kg이에요. 이제 아래에 알려 주는 말을 써요." });
        writeStep(b, a, [{ q: "민준이에게 바르게 계산하는 방법을 알려 주는 말을 써 보세요.", tag: "알려 주는 말", ph: "민준아, 대분수는 먼저 ~", help: ["① 민준이가 잘못한 곳을 한 가지 짚어요. → ② 바르게 계산하는 차례를 알려 줘요.", "‘민준아, 대분수는 먼저 ~로 바꾼 다음에 ~해야 해. 그러면 ~가 나와.’ 꼴로 써요."],
          ans: "민준아, 대분수는 먼저 가분수 [11/8]로 바꾼 다음에 8과 6을 약분해야 해. 그러면 [11/8]×6 = [33/4] = [8 1/4]이 나와." }], { ok: "고치고 알려 주기까지 했어요!" }); } },
    { name: "되돌아보기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["분수의 곱셈을 배우기 전의 생각을 떠올려요.", "분모는 그대로, 분자는 분자끼리, 가분수로 바꾸기, 1보다 작은 수를 곱하면 작아지는 것을 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "배우기 전의 생각", ex: ["예전에는 곱셈을 하면 항상 수가 커진다고 생각했어요.", "예전에는 쟁반의 [3/4]의 [1/2]이 얼마인지 어떻게 구하는지 몰랐어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 1보다 작은 분수를 곱하면 곱이 작아진다는 것을 알아요.", "지금은 분수끼리 곱할 때 분자는 분자끼리, 분모는 분모끼리 곱한다는 것을 알아요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["끈 8 m를 4부분으로 나누어 1부분을 색칠해 보고 바뀌었어요.", "약과 쟁반을 세로와 가로로 나누어 빗금 친 칸을 세어 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "★★ 도전 — 장터 현수막을 만들어요. 현수막의 가로는 90 cm이고, 세로는 가로의 [2/5]예요. 가운데 글자의 높이는 세로의 [3/4]이에요.", hints: ["(세로) = (가로)×[2/5]예요.", "(글자 높이) = (세로)×[3/4]이에요."],
    render: (b, a) => fx2Calc(b, a, [
      { q: "현수막의 세로는 몇 cm일까요?", x: "90×[2/5]", n: 36, unit: "cm", lab: "90×[2/5] =", why: { "225": "90의 [2/5]만큼은 90보다 작아요. 90을 5로 나눈 것 중 2예요.", "18": "90의 [1/5]은 18이에요. [2/5]는 그 2배예요." } },
      { q: "글자의 높이는 몇 cm일까요?", x: "36×[3/4]", n: 27, unit: "cm", lab: "(세로)×[3/4] =", why: { "67": "가로가 아니라 세로 36 cm의 [3/4]을 구해요." } }],
      { fig: fx2sBanner, ok: "세로는 36 cm, 글자 높이는 27 cm예요. 분수의 곱셈은 장터 준비에도 많이 쓰여요. 다음 단원에서는 합동과 대칭을 공부해요." }) }
}
];
