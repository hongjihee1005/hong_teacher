//@@APP
const APP={title:"6학년 2반 숲속 수련회", unit:"6-2 수학 1. 분수의 나눗셈", key:"s62-fracdiv-v1", welcome:"6학년 2반 숲속 수련회에 온 것을 환영해요", intro:"한빛초등학교 6학년 2반 친구들과 1박 2일 숲속 수련회를 다녀오며, 주스 나누기·숲길 걷기·버스·보리차 물통·쿠키 반죽·간식 장보기에서 분수의 나눗셈을 알아봐요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u1-fracdiv.tb.js)의 fd6 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   (입력칸 0.9초 · 고르기 0.26초 · 색칠·끌기·카드 넣기 1.2초) 대분수는 쓰는 중에 확인하지 않아요(fd6In.full). 이 파일에서 새로 만든 그림은 앞글자 fd6s. */
/* ===== 6-2 1. 분수의 나눗셈 단원 조작 부품 (앞글자 fd6) =====
   5-2 「분수의 곱셈」 부품(분수 표기·입력·채점)을 바탕으로 나눗셈에 맞게 고쳤어요.
   글 속 분수 표기: [3/7] 진분수·가분수, [2 1/4] 대분수, [□/5]·[3+5/7](분자에 식)도 됨.
   채점은 값으로 해요: 약분하지 않은 분수, 가분수, 대분수 모두 정답이에요(지도서 채점 원칙). */
/*fd6-core*/
const FD6_WORDS = ["분자끼리 나누기", "통분", "분자와 분모를 바꾸어 곱하기", "가분수로 바꾸기", "약분", "대분수"];
const FD6_SRC = "\\[(?:(\\d+|□) )?([0-9□■●▲♥]+(?:[+−×÷-][0-9□]+)*)\\/([0-9□■●▲♥]+(?:×[0-9□]+)*)\\]";
const fd6Re = () => new RegExp(FD6_SRC, "g");
/* 칸에 쓴 글(자연수·분자·분모) → 수 */
function fd6Raw(ws, ns, ds) {
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
function fd6Str(s) {
  s = String(s).trim().replace(/^\[|\]$/g, "").trim();
  let m = s.match(/^(\d+)$/); if (m) return fd6Raw(m[1], "", "");
  m = s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/); if (m) return fd6Raw(m[1] || "", m[2], m[3]);
  return null;
}
const fd6Eq = (a, b) => a.num * b.den === b.num * a.den;
const fd6G = (a, b) => b ? fd6G(b, a % b) : Math.abs(a);
function fd6R(num, den) { const g = fd6G(num, den) || 1; return { num: num / g, den: den / g }; }
/* 분모가 den인 교과서 꼴: 대분수(자연수) */
function fd6Form(num, den) { const w = Math.floor(num / den), r = num % den; return r === 0 ? String(w) : w === 0 ? `${r}/${den}` : `${w} ${r}/${den}`; }
const fd6Tk = s => /\//.test(String(s)) ? `[${s}]` : String(s);
/* 교과서 답 표기: 대분수(=가분수) */
function fd6Book(num, den) {
  const m = fd6Form(num, den), imp = `[${num}/${den}]`;
  if (num % den === 0) return num > 0 && den > 1 ? `${m} (=${imp})` : m;
  return num > den ? `${fd6Tk(m)} (=${imp})` : fd6Tk(m);
}
/* 끝 글자(분수는 분자) 받침에 맞는 '이에요/예요' */
const fd6Ie = num => "013678".includes(String(num).slice(-1)) ? "이에요" : "예요";
/* 식 계산: "[1 1/5]×3", "[3/5]×[1/2]×[3/4]", "(3×1)+(3×[1/4])", "[2/3]+[2/3]" — 괄호, × ÷ 를 + − 보다 먼저 */
function fd6Eval(e) {
  const src = String(e).replace(/−/g, "-").replace(/\s+/g, " ").trim(); let i = 0;
  const sp = () => { while (src[i] === " ") i++; };
  const mul = (x, y) => fd6R(x.num * y.num, x.den * y.den), add = (x, y, sg) => fd6R(x.num * y.den + sg * y.num * x.den, x.den * y.den);
  function atom() {
    sp();
    if (src[i] === "(") { i++; const v = expr(); sp(); if (src[i] !== ")") throw 0; i++; return v; }
    if (src[i] === "[") { const j = src.indexOf("]", i); if (j < 0) throw 0; const v = fd6Str(src.slice(i, j + 1)); if (!v || v.err) throw 0; i = j + 1; return fd6R(v.num, v.den); }
    const m = src.slice(i).match(/^\d+/); if (!m) throw 0; i += m[0].length; return fd6R(+m[0], 1);
  }
  function term() { let v = atom(); for (;;) { sp(); const c = src[i]; if (c === "×" || c === "*") { i++; v = mul(v, atom()); } else if (c === "÷") { i++; const w = atom(); if (!w.num) throw 0; v = mul(v, fd6R(w.den, w.num)); } else return v; } }
  function expr() { let v = term(); for (;;) { sp(); const c = src[i]; if (c === "+" || c === "-") { i++; v = add(v, term(), c === "+" ? 1 : -1); } else return v; } }
  try { const v = expr(); sp(); return i === src.length ? v : null; } catch (err) { return null; }
}
function fd6Den(s) { const m = String(s || "").match(/\/(\d+)\]?/); return m ? +m[1] : 0; }
/* 받침에 맞는 조사(분수는 분자를 마지막에 읽으므로 분자의 끝 숫자 기준): fd6J("[3/7]", "은는") → "[3/7]은" */
function fd6J(s, pair) {
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
function fd6Judge(r, a) {
  if (r.err === "empty") return { code: "empty", msg: "빈칸에 답을 써요." };
  if (r.err === "half") return { code: "half", msg: "분수는 분자와 분모를 모두 써요." };
  if (r.err) return { code: "bad", msg: "칸에는 수만 써요." };
  const t = fd6Str(a);
  if (!fd6Eq(r, t)) return { code: "wrong" };
  if (r.hasF && r.hasW && r.n >= r.d) return { code: "improper", msg: `값은 맞아요. 그런데 분수 부분 ${fd6J(`[${r.n}/${r.d}]`, "은는")} 1이거나 1보다 커요. 1만큼을 자연수 부분으로 옮겨 대분수로 쓰거나, 가분수로 써요.` };
  if (r.hasF && r.n === 0) return { code: "zero", msg: "분자가 0이면 자연수만 써요." };
  return { code: "ok" };
}
function fd6Key(r) { return r.err ? "" : r.hasF ? (r.hasW ? `${r.w} ${r.n}/${r.d}` : `${r.n}/${r.d}`) : String(r.w); }
/* 유리수 셈 */
const fd6Q = (num, den) => fd6R(num, den);
const fd6Add = (x, y, s = 1) => fd6R(x.num * y.den + s * y.num * x.den, x.den * y.den);
const fd6Lcm = (a, b) => a / fd6G(a, b) * b;
/* 흔한 실수 찾기 (두 수의 나눗셈) — 지도서 오개념(김경미·강완) */
function fd6Diag(e, r) {
  if (!e || !r || r.err) return null;
  const m = String(e).match(/^\s*(\[[^\]]+\]|\d+)\s*÷\s*(\[[^\]]+\]|\d+)\s*$/); if (!m) return null;
  const A = fd6Str(m[1]), B = fd6Str(m[2]); if (!A || !B || A.err || B.err || !A.num || !B.num) return null;
  const T = fd6Q(A.num * B.den, A.den * B.num), eq = v => fd6Eq(r, v) && !fd6Eq(T, v);
  if (eq(fd6Q(A.num * B.num, A.den * B.den))) return "나눗셈을 곱셈으로 바꾸기만 하고 나누는 분수를 그대로 곱했어요. 나누는 분수의 분자와 분모를 바꾸어 곱해요.";
  if (eq(fd6Q(A.den * B.num, A.num * B.den))) return "나누어지는 수의 분자와 분모를 바꾸었어요. 분자와 분모를 바꾸는 것은 나누는 수예요.";
  if (eq(fd6Q(A.den * B.den, A.num * B.num))) return "두 분수의 분자와 분모를 모두 바꾸었어요. 나누는 수만 분자와 분모를 바꾸어 곱해요.";
  if (eq(fd6Q(B.num * A.den, B.den * A.num))) return "나누는 수와 나누어지는 수의 순서를 바꾸어 계산했어요. ÷ 앞의 수를 뒤의 수로 나누어요.";
  if (A.hasF && B.hasF && A.d !== B.d && eq(fd6Q(A.num, B.num))) return "분모가 다른데 분자끼리만 나누었어요. 먼저 통분하여 분모를 같게 한 다음 분자끼리 나누어요.";
  if (A.hasW && A.hasF && A.w > 0 && B.hasF && eq(fd6Q(A.w * B.num * A.d + A.n * B.den, B.num * A.d))) return "자연수 부분은 그대로 두고 진분수 부분만 나누었어요. 대분수를 가분수로 바꾸어 계산해요.";
  return null;
}
/* 읽기 글: [3/7] → 7분의 3, [2 1/4] → 2와 4분의 1 */
function fd6Plain(s) {
  return String(s == null ? "" : s).replace(fd6Re(), (m, w, n, d) => `${w ? w + "와 " : ""}${d}분의 ${n}`);
}
/*fd6-core-end*/

function fd6Style() {
  if (document.getElementById("fd6-style")) return;
  const s = document.createElement("style"); s.id = "fd6-style";
  s.textContent = `
.fd6fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.fd6fw{margin-right:.1em}
.fd6q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.fd6q>.fd6n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.fd6q>.fd6d{padding:.05em .14em 0}
.fd6frin .fd6q{font-size:.92em}
.fd6frin .fd6n{padding-bottom:.14em}.fd6frin .fd6d{padding-top:.14em}
.fd6inp{display:inline-flex;align-items:center;gap:.15em;vertical-align:middle}
.fd6qi{display:inline-flex;flex-direction:column;align-items:stretch;gap:.12em}
.fd6bar{display:block;height:.17em;background:var(--ink);border-radius:.1em}
input.fd6i,input.fd6box{box-sizing:border-box;width:2.3em;height:1.65em;padding:0;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.fd6iw{height:2.1em;width:2.1em}
input.fd6box.fd6wide{width:3.6em}
.fd6eq{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .45em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin-top:.25em}
.fd6lab{color:var(--pine)}
.fd6res{color:var(--ok);font-size:.85em}
.fd6cl{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .3em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin:.4em 0;line-height:1.9}
.fd6tag{background:var(--pine-soft);color:var(--pine);border-radius:.5em;padding:0 .55em;font-size:.82em}
.fd6chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.fd6chs .opt{padding:.05em .55em}
.fd6stage{margin:.2em 0 .4em}
.fd6stage svg{width:100%;height:auto;max-height:66vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.fd6tip{font-family:Jua,sans-serif;color:var(--night);margin:.3em 0}
.fd6tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.4em 0}
.fd6tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em}
.fd6tools button.fd6on{background:var(--night);color:#fff;border-color:var(--night)}
.fd6est{background:var(--ring-soft);border-radius:.6em;padding:.4em .7em;margin-bottom:.4em}
.fd6ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.fd6grp{border:2px solid var(--line);border-radius:.8em;padding:.4em .7em;margin:.45em 0}
.fd6grp .fd6gt{font-family:Jua,sans-serif;color:var(--night)}
.fd6grp .fd6gi{display:inline-flex;flex-wrap:wrap;align-items:center;gap:.3em;margin:.25em 1.2em .25em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08)}
.fd6pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:2.6em;margin:.3em 0 .6em}
.fd6bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,11em),1fr));gap:.6em}
.fd6bin{border:2px dashed var(--line);border-radius:.8em;padding:.4em;min-height:5em;display:flex;flex-direction:column;gap:.35em}
.fd6binh{font-family:Jua,sans-serif;background:var(--pine-soft);color:var(--pine);border:0;border-radius:.6em;padding:.3em .6em}
.fd6binl{display:flex;flex-wrap:wrap;gap:.35em}
.opt.fd6on{border-color:var(--ring);background:var(--ring-soft)}
.fd6crd{font-family:Jua,sans-serif}
.fd6mt{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.6em 1.4em;align-items:start}
.fd6mc{display:flex;flex-direction:column;gap:.5em}
.fd6mc .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);text-align:center}
.fd6badge{display:inline-grid;place-items:center;min-width:1.5em;height:1.5em;border-radius:50%;color:#fff;font-size:.8em;margin-left:.3em}
.fd6cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.fd6cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2em;text-align:center}
.fd6slot{min-width:1.7em;min-height:1.5em;font-family:Jua,sans-serif;border:2px dashed var(--ring);border-radius:.4em;background:#fff;padding:0 .2em}
.fd6lad{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.fd6lad>*{display:flex;flex-direction:column;align-items:center;gap:.25em;padding:0 .15em;text-align:center}
.fd6lad .opt{font-family:Jua,sans-serif;width:100%;text-align:center;padding:.35em .2em}
.fd6house{font-family:Jua,sans-serif;color:var(--pine);font-size:.9em}
.fd6lsvg svg{width:100%;height:auto;display:block}
.fd6score{width:100%;border-collapse:collapse;font-size:var(--fs-s);margin-top:.4em}
.fd6score td,.fd6score th{border:1px solid var(--line);padding:.2em .35em;text-align:center}
.fd6score th{background:var(--pine-soft);font-weight:400;font-family:Jua,sans-serif}
.fd6card2{border:3px solid var(--night);border-radius:var(--r);padding:.5em .8em;background:#fff;display:flex;flex-wrap:wrap;gap:.4em 1.6em;margin:.3em 0}
.fd6card2>div{min-width:12em}
.fd6card2 b{color:var(--pine);font-family:Jua,sans-serif;font-weight:400}
`;
  document.head.append(s);
}
/* 분수 모양 요소 */
function fd6FracEl(w, n, d) {
  return h("span", { class: "fd6fr" }, w != null && w !== "" ? h("span", { class: "fd6fw" }, String(w)) : null,
    h("span", { class: "fd6q" }, h("span", { class: "fd6n" }, String(n)), h("span", { class: "fd6d" }, String(d))));
}
function fd6RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = fd6Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(fd6FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function fd6RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return fd6RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(fd6RenderText);
}
(function fd6Boot() {
  fd6Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") fd6RenderText(m.target); else m.addedNodes.forEach(fd6RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(fd6Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
/* 엔진 부품의 '답 따라 쓰기' 글은 읽는 말(7분의 3)로 바꿔 줌 */
function fd6A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(fd6Plain) }) }); }
const fd6Quiz0 = quiz, fd6Blanks0 = blanks;
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done(을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return fd6Quiz0(body, fd6A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return fd6Blanks0(body, fd6A(api), parts, o); };

function fd6Gate(api, ready, msg) {
  return Object.assign({}, api, { done: (ans, m, lv) => ready() ? api.done(ans, m, lv) : api.fail(typeof msg === "function" ? msg() : msg, ans) });
}
const FD6_F = ["#F6C08A", "#9CC6EC", "#A9D8A2", "#D7B5E6"], FD6_S = ["#D9822B", "#2B7BD6", "#2E8B57", "#8E5BC9"];
/* SVG 글: [분수] 표기를 쌓은 분수로 그림 */
function fd6Cw(ch, s) { return /[가-힣]/.test(ch) ? s * .95 : /[0-9]/.test(ch) ? s * .56 : ch === " " ? s * .3 : /[A-Za-z]/.test(ch) ? s * .55 : s * .6; }
function fd6Segs(str) {
  const out = []; let last = 0; const re = fd6Re(); let m;
  while ((m = re.exec(str))) { if (m.index > last) out.push({ t: str.slice(last, m.index) }); out.push({ w: m[1], n: m[2], d: m[3] }); last = m.index + m[0].length; }
  if (last < str.length) out.push({ t: str.slice(last) });
  return out;
}
function fd6SvgLine(str, x, y, size = 24, opt = {}) {
  const g = svgEl("g", { "pointer-events": "none" }), fs = size * .8, fill = opt.fill || INK;
  const tw = t => [...t].reduce((a, c) => a + fd6Cw(c, size), 0);
  const fw = s => Math.max(String(s.n).length, String(s.d).length) * fs * .6 + 8;
  const segs = fd6Segs(String(str));
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
function fd6In(label) {
  const mk = (cls, al) => {
    const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "fd6i " + cls, "aria-label": (label ? fd6Plain(label) + " " : "") + al });
    i.addEventListener("input", () => { const v = i.value.replace(/[^0-9]/g, "").slice(0, 4); if (v !== i.value) i.value = v; });
    return i;
  };
  const w = mk("fd6iw", "자연수 부분"), n = mk("fd6in", "분자"), d = mk("fd6id", "분모");
  const el = h("span", { class: "fd6inp" }, w, h("span", { class: "fd6qi" }, n, h("span", { class: "fd6bar" }, "​"), d));
  el.get = () => fd6Raw(w.value, n.value, d.value);
  el.paint = ok => [w, n, d].forEach(x => { x.style.borderColor = ok == null ? "" : ok ? "var(--ok)" : "var(--no)"; });
  el.text = () => { const r = el.get(); return r.err ? "-" : fd6Key(r); };
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
function fd6Hook(el, auto) {
  el.addEventListener("input", auto); el.addEventListener("change", auto);
  el.addEventListener("focusout", () => setTimeout(auto, 0));
  el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); if (e.target.blur) e.target.blur(); } });
}
function fd6Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 4, class: "fd6box", "aria-label": "빈칸" });
  i.exp = String(exp); i.full = () => i.value.trim() !== ""; i.sig = () => i.value.trim();
  return i;
}
/* 어림 상자 */
function fd6EstBox(api, e, onOk) {
  const row = h("div", { class: "opts" });
  e.o.forEach((c, i) => row.append(h("button", { class: "opt", onclick: ev => {
    [...row.children].forEach(x => x.classList.remove("good", "bad", "on"));
    if (i === e.a) { ev.currentTarget.classList.add("good"); onOk(); api.hint(e.ok || "좋아요. 이제 정확하게 구해 봐요."); }
    else { ev.currentTarget.classList.add("bad"); api.fail((e.why && e.why[i]) || "자연수 부분만 보고 어림해 봐요.", "[어림] " + c); }
  } }, c)));
  return h("div", { class: "fd6est" }, h("div", { class: "jua" }, "먼저 어림해요 · " + e.q), row);
}

/* ① 식과 답 (값이 같으면 정답: 약분하지 않은 분수·가분수·대분수 모두) — '확인하기' 단추 없이 저절로 확인해요
   items: {q?, e:"[3/8]×4" (보이는 식) | x (확인용 식), a:"3/2", unit, den, why:{"학생 답":"까닭"}, lab, g:"묶음 제목"}
          | {q, e|x, n: 수} | {q, pick:[…], a: 번호, why:{번호:"까닭"}}  */
function fd6Calc(body, api, items, opt = {}) {
  fd6Style();
  const rows = []; const wrap = h("div");
  let grp = null, gName = null;
  items.forEach((it, k) => {
    const R = { it }; const ex = it.e || it.x;
    let host;
    if (it.g) {
      if (it.g !== gName) { gName = it.g; grp = h("div", { class: "fd6grp" }, h("div", { class: "fd6gt" }, it.g)); wrap.append(grp); }
      host = h("span", { class: "fd6gi" }); grp.append(host);
    } else {
      gName = null; const box = h("div", { class: "qitem" });
      if (it.q) box.append(h("div", { class: "jua" }, (items.filter(x => !x.g).length > 1 ? (k + 1) + ". " : "") + it.q));
      host = h("div", { class: "fd6eq" }); box.append(host); wrap.append(box);
    }
    if (it.pick) {
      R.kind = "pick"; R.sel = null;
      const row = h("span", { class: "opts" });
      it.pick.forEach((o, oi) => row.append(h("button", { class: "opt", onclick: ev => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); R.sel = oi; } }, o)));
      R.row = row; if (it.e) host.append(h("span", {}, it.e)); host.append(row);
    } else if (it.n != null) {
      R.kind = "n";
      if (ex && !it.noEval) { const v = fd6Eval(ex); if (!v || v.num !== it.n * v.den) throw new Error(`답 확인 필요: ${ex} = ${it.n}`); }
      R.inp = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "fd6box fd6wide", "aria-label": fd6Plain(it.lab || it.e || it.q || "답") });
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "fd6lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    } else {
      R.kind = "f";
      R.t = fd6Str(it.a); if (!R.t || R.t.err) throw new Error("답 형식 오류: " + it.a);
      R.den = it.den || fd6Den(it.a) || 1;
      if (ex && !it.noEval) { const v = fd6Eval(ex); if (!v || !fd6Eq(v, R.t)) throw new Error(`답 확인 필요: ${ex} = ${it.a}`); }
      R.inp = fd6In(it.lab || it.e || "답"); R.inp.tv = R.t;
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "fd6lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    }
    R.res = h("span", { class: "fd6res hidden" }, "​"); host.append(R.res);
    rows.push(R);
  });
  const ansText = R => {
    const head = fd6Plain(R.it.e || R.it.lab || "답");
    if (R.kind === "pick") return `${fd6Plain(R.it.q || R.it.e || "")} ${fd6Plain(R.it.pick[R.it.a])}`.trim();
    if (R.kind === "n") return `${head} ${R.it.n}${R.it.unit ? " " + R.it.unit : ""}`;
    return `${head} ${fd6Plain(fd6Tk(R.it.a))}${R.it.unit ? " " + R.it.unit : ""}`;
  };
  api.provide({ words: opt.words || FD6_WORDS, answers: rows.map(ansText) });
  const judge = () => {
    let bad = null, hint = null; const given = [];
    rows.forEach(R => {
      const it = R.it;
      if (R.kind === "pick") {
        const g = R.sel === it.a; [...R.row.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === R.sel) b.classList.add(g ? "good" : "bad"); });
        given.push(R.sel == null ? "-" : fd6Plain(it.pick[R.sel]));
        if (!g && !bad) bad = R.sel == null ? "고르지 않은 문제가 있어요." : (it.why && it.why[R.sel]) || "고른 것을 다시 살펴봐요.";
        return;
      }
      if (R.kind === "n") {
        const s = R.inp.value.replace(/[\s,]/g, ""), g = /^\d+$/.test(s) && +s === it.n;
        R.inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; given.push(s || "-");
        if (!g && !bad) bad = s === "" ? "빈칸에 답을 써요." : (it.why && it.why[s]) || opt.bad || "다시 생각해 봐요.";
        return;
      }
      const r = R.inp.get(), J = fd6Judge(r, it.a); given.push(R.inp.text());
      if (J.code === "ok") { R.inp.paint(true); return; }
      if (J.code === "zero" || J.code === "improper") { R.inp.paint(null); if (!hint) hint = J.msg; return; }
      R.inp.paint(false);
      if (!bad) bad = (it.why && it.why[fd6Key(r)]) || J.msg || fd6Diag(it.e || it.x, r) || opt.bad || "다시 계산해 봐요. 분모가 같으면 분자끼리 나누고, 분모가 다르면 통분해요. 곱셈으로 바꿀 때는 나누는 분수의 분자와 분모를 바꾸어요.";
    });
    if (bad) { api.fail(bad, given.join(" / ")); return false; }
    if (hint) { api.tryOnce(); api.hint(hint); return false; }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + fd6Book(num, den); R.res.classList.remove("hidden"); } });
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
  rows.forEach(R => { if (R.inp) fd6Hook(R.inp, auto); });
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return auto;
}

/* ② 차례대로 빈칸 채우기 (계산 과정) — 저절로 확인
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 수 칸 | {q:[자연수, 분자, 분모]} 각 자리는 고정값·"?답"(칸)·배열(["3","×","?2"]) | {f:"4 2/5"} 분수 입력(값 판정) | {c:[…], a}
   '='가 있고 한글이 없는 줄은 '='로 나눈 값이 모두 같은지 스스로 확인해요. */
function fd6Chain(body, api, rows, opt = {}) {
  fd6Style();
  const ins = [], chs = [], plains = [], pairs = [];
  const wrap = h("div");
  const ex = v => v == null ? "" : Array.isArray(v) ? v.map(ex).join("") : String(v)[0] === "?" ? String(v).slice(1) : String(v);
  const jsNum = v => ex(v).replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
  const jsStr = s => String(s).replace(fd6Re(), (m, w, n, d) => `(${w && w !== "□" ? w : 0}+(${n.replace(/−/g, "-")})/(${d}))`).replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
  const cell = v => {
    if (v == null) return null;
    if (Array.isArray(v)) return h("span", { style: "display:inline-flex;align-items:center;gap:.1em" }, v.map(cell));
    if (String(v)[0] === "?") { const b = fd6Box(String(v).slice(1)); ins.push(b); return b; }
    return h("span", {}, String(v));
  };
  rows.forEach(row => {
    const parts = Array.isArray(row) ? row : row.p;
    const line = h("div", { class: "fd6cl" });
    if (row.t) line.append(h("span", { class: "fd6tag" }, row.t));
    let plain = row.t ? row.t + " " : "", js = "", hangul = false;
    parts.forEach(pt => {
      if (typeof pt === "string" || typeof pt === "number") {
        const s = String(pt); line.append(h("span", {}, s)); plain += fd6Plain(s) + " "; js += jsStr(s); if (/[가-힣□]/.test(s)) hangul = true;
      } else if (pt.i != null) {
        const b = fd6Box(pt.i); ins.push(b); line.append(b); plain += pt.i + " "; js += `(${pt.i})`;
      } else if (pt.q) {
        const [W, N, D] = pt.q, n0 = ins.length;
        line.append(h("span", { class: "fd6fr fd6frin" }, W != null ? h("span", { class: "fd6fw" }, cell(W)) : null, h("span", { class: "fd6q" }, h("span", { class: "fd6n" }, cell(N)), h("span", { class: "fd6d" }, cell(D)))));
        /* 분자·분모가 모두 빈칸이면 값이 같은 다른 꼴(약분 덜 함·더 함)을 알아봐요 */
        if (W == null && [N, D].every(v => typeof v === "string" && v[0] === "?")) pairs.push([ins[n0], ins[n0 + 1]]);
        plain += fd6Plain(`[${W != null ? ex(W) + " " : ""}${ex(N)}/${ex(D)}]`) + " ";
        js += `(${W != null ? jsNum(W) : 0}+(${jsNum(N)})/(${jsNum(D)}))`;
      } else if (pt.f) {
        const fi = fd6In("답"); fi.target = pt.f; fi.tv = fd6Str(pt.f); ins.push(fi); line.append(fi);
        plain += fd6Plain(fd6Tk(pt.f)) + " "; const v = fd6Str(pt.f); js += `(${v.num}/${v.den})`;
      } else if (pt.c) {
        const C = { a: pt.a, sel: null }; const sp = h("span", { class: "fd6chs" });
        pt.c.forEach((o, oi) => sp.append(h("button", { class: "opt", onclick: ev => { [...sp.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); C.sel = oi; } }, o)));
        C.el = sp; chs.push(C); line.append(sp); plain += fd6Plain(pt.c[pt.a]) + " "; hangul = true;
      }
    });
    wrap.append(line); plains.push(plain.replace(/\s+/g, " ").trim());
    if (!hangul && js.includes("=")) {
      const vals = js.split("=").filter(s => s.trim()).map(s => { try { return Function(`return (${s})`)(); } catch (e) { return NaN; } });
      if (vals.some(v => !isFinite(v) || Math.abs(v - vals[0]) > 1e-9)) throw new Error("식 확인 필요: " + plain);
    }
  });
  api.provide({ words: opt.words || FD6_WORDS, answers: plains });
  const judge = () => {
    let ok = true, hint = null; const given = [];
    const same = new Set();
    pairs.forEach(([nb, db]) => { const a = nb.value.trim(), b = db.value.trim();
      if (/^\d+$/.test(a) && /^[1-9]\d*$/.test(b) && !(a === nb.exp && b === db.exp) && +a * +db.exp === +b * +nb.exp) { same.add(nb); same.add(db);
        hint = hint || (fd6G(+nb.exp, +db.exp) === 1 ? "값은 맞아요. 그런데 더 약분할 수 있어요. 분모와 분자를 최대공약수로 나누어 기약분수로 나타내요." : "값은 맞아요. 그런데 이 칸에는 약분하기 전의 분수를 써요."); } });
    ins.forEach(x => {
      if (same.has(x)) { x.style.borderColor = ""; given.push(x.value.trim()); return; }
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = fd6Judge(x.get(), x.target); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "zero" || J.code === "improper") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
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
  ins.forEach(x => fd6Hook(x, auto));
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return auto;
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 (돌려주는 함수를 조작할 때마다 부르면 확인 시계를 다시 맞춰요) */
function fd6Ask(host, api, ready, msg, opt) {
  const g = fd6Gate(api, ready, msg), pre = () => ready() ? null : (typeof msg === "function" ? msg() : msg);
  if (opt.ask) return fd6Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad, pre });
  if (opt.askCalc) return fd6Calc(host, g, opt.askCalc, { ok: opt.ok, pre });
  api.provide({ words: [], answers: [] });
  /* 물을 것이 없으면 조작을 마치는 대로 저절로 통과 */
  return autoRun(ready, () => "ok", () => { api.tryOnce(); api.done("조작 완료", opt.ok); return true; }, 1200);
}

/* ③ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function fd6Sort(body, api, opt) {
  fd6Style();
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "fd6pool" }), binsEl = h("div", { class: "fd6bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "fd6binl" }); binsEl.append(h("div", { class: "fd6bin", onclick: e => { if (e.target.closest(".fd6crd")) return; put(bi); } }, h("button", { class: "fd6binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt fd6crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  let auto = () => {};
  function draw() { els.forEach((el, ci) => { el.classList.toggle("fd6on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); auto(); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => fd6Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "fd6tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "카드를 모두 넣으면 저절로 확인해요."));
  auto = autoRun(() => where.every(w => w >= 0), () => where.join(","), () => {
    let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
    const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
    if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok); return true;
  }, 1200);
}

/* ===== 곱셈 단원 조작 부품 ===== */
function fd6Style2() {
  if (document.getElementById("fd6-style2")) return;
  const s = document.createElement("style"); s.id = "fd6-style2";
  s.textContent = `
.fd6ctl{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.35em 0}
.fd6ctl button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em}
.fd6ctl button.fd6act{background:var(--night);color:#fff;border-color:var(--night)}
.fd6ctl .fd6num{font-family:Jua,sans-serif;min-width:2.2em;text-align:center;font-size:calc(var(--fs)*1.15)}
.fd6rd{font-family:Jua,sans-serif;color:var(--night);margin:.25em 0;min-height:1.4em}
.fd6rd.fd6good{color:var(--ok)}
.fd6cond{border:2px solid var(--line);border-radius:.8em;padding:.4em .7em;margin:.4em 0;font-family:Jua,sans-serif}
.fd6cond div{margin:.15em 0}
.fd6board{display:flex;flex-wrap:wrap;gap:.6em 1.2em;align-items:center;margin:.4em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.25)}
.fd6slot2{min-width:1.8em;min-height:1.55em;font-family:Jua,sans-serif;border:2px dashed var(--ring);border-radius:.4em;background:#fff;padding:0 .2em;font-size:inherit}
.fd6slot2.fd6full{border-style:solid;border-color:var(--night)}
.fd6deck{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.fd6deck .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2.2em;text-align:center}
.fd6deck .opt.fd6used{opacity:.4}
.fd6ccard{display:inline-block;border:3px solid var(--night);border-radius:.7em;padding:.25em .9em;background:#FFF8EE;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.15)}
.fd6score{font-family:Jua,sans-serif;background:var(--pine-soft);color:var(--pine);border-radius:.6em;padding:.2em .7em;display:inline-block}
.fd6log{font-size:var(--fs-s);margin:.3em 0;padding-left:1.2em}
`;
  document.head.append(s);
}
const fd6Num = v => typeof v === "string" ? fd6Str(v) : v;
function fd6Stepper(label, get, set, min, max, onChange) {
  const num = h("span", { class: "fd6num" }, "​");
  const paint = () => { num.textContent = String(get()); };
  const b = (t, dv) => h("button", { onclick: () => { const v = get() + dv; if (v < min || v > max) return; set(v); paint(); onChange(); } }, t);
  const el = h("div", { class: "fd6ctl" }, h("span", { class: "jua" }, label), b("－", -1), num, b("＋", 1));
  el.paint = paint; paint();
  return el;
}


/* ===== 나눗셈 단원 조작 부품 ===== */
function fd6Style3() {
  if (document.getElementById("fd6-style3")) return;
  const s = document.createElement("style"); s.id = "fd6-style3";
  s.textContent = `
.fd6flip{display:flex;flex-wrap:wrap;align-items:center;gap:.35em .5em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.2);margin:.45em 0}
.fd6flip button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.15em .55em;font-family:Jua,sans-serif;font-size:inherit;color:var(--ink);min-width:2.2em}
.fd6flip button.fd6fl{border-color:var(--ring);background:var(--ring-soft)}
.fd6flip button.fd6op{min-width:2em;font-size:1.1em}
.fd6flip .fd6no{color:var(--muted);font-size:.8em}
.fd6pose{border:2px solid var(--line);border-radius:.8em;padding:.5em .8em;margin:.4em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);line-height:2}
.fd6pose .fd6blank{display:inline-block;min-width:2.6em;border-bottom:2px solid var(--ring);text-align:center;padding:0 .2em}
.fd6sheet{width:100%;border-collapse:collapse;font-size:var(--fs-s);margin:.4em 0}
.fd6sheet td,.fd6sheet th{border:1px solid var(--line);padding:.25em .4em;text-align:center}
.fd6sheet th{background:var(--pine-soft);font-weight:400;font-family:Jua,sans-serif}
.fd6sheet td.fd6me{background:#FFF6E8}
.fd6set{display:inline-block;border:2px dashed var(--night);border-radius:.6em;padding:.1em .6em;margin:.15em .3em .15em 0;font-family:Jua,sans-serif}
.fd6set.fd6used{opacity:.4;text-decoration:line-through}
.fd6dice{display:flex;gap:.5em;flex-wrap:wrap;align-items:center;margin:.3em 0}
`;
  document.head.append(s);
}
const fd6Val = s => { const v = typeof s === "string" ? fd6Str(s) : s; return fd6R(v.num, v.den); };
const fd6Txt = (num, den) => fd6Tk(fd6Form(num, den));
const fd6Lbl = (num, den) => den === 1 ? String(num) : num < den ? `[${num}/${den}]` : `[${fd6Form(num, den)}]`;


/* ① 덜어 내기(묶기) 띠 모델: 나누어지는 수 A에서 나누는 수 B만큼씩 덜어 내요.
   opt A("7/10"·"4 1/2"·"6"), B("1/10"·"3/4"), unit, aName, bName, word(묶음 이름: "화분"), pie(원 모양), cd(공통분모, 기본 최소공배수), tip, ask·askCalc, ok
   분모가 다르면(또는 자연수이면) 먼저 ‘＋’로 한 칸을 똑같이 나누어 두 띠의 칸 크기를 같게 해요. 띠를 누를 때마다 한 묶음씩 덜어 내요. */
function fd6Scoop(body, api, opt) {
  fd6Style(); fd6Style2();
  /* 다 하면 fd6Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};
  const A = fd6Str(opt.A), B = fd6Str(opt.B), unit = opt.unit || "", word = opt.word || "묶음", one = opt.one || word;
  const gTxt = n => opt.cnt ? `${n}${opt.cnt}` : `${word} ${n}개`;
  const Av = fd6Val(opt.A), Bv = fd6Val(opt.B);
  const dA = A.hasF ? A.d : 1, dB = B.hasF ? B.d : 1, cd = opt.cd || fd6Lcm(dA, dB);
  if (cd % dA || cd % dB) throw new Error("덜어 내기 확인 필요: " + opt.A + "÷" + opt.B);
  const T = Av.num * cd / Av.den, g = Bv.num * cd / Bv.den, full = Math.floor(T / g), rem = T % g;
  let kA = 1, kB = 1, p = 0, remOn = false;
  const needA = dA !== cd, needB = dB !== cd;
  const same = () => dA * kA === cd && dB * kB === cd;
  const U = Math.max(1, Math.ceil(Av.num / Av.den), Math.ceil(Bv.num / Bv.den));
  const W = 900, LX = 185, BW = 690, uw = BW / U;
  const svg = makeSvg(W, 300);
  const bar = (y, val, den, cells, fillFn, label, sub) => {
    /* 1마다 점선 틀 */
    for (let u = 0; u < U; u++) svg.append(svgEl("rect", { x: LX + u * uw, y, width: uw, height: 54, fill: "#fff", stroke: "#B9C4C0", "stroke-width": 2, "stroke-dasharray": "6 5" }));
    const cw = uw / den;
    for (let c = 0; c < cells; c++) svg.append(svgEl("rect", { x: LX + c * cw, y, width: cw, height: 54, fill: fillFn(c) || "#fff", stroke: INK, "stroke-width": cells > 30 ? 1.2 : 2 }));
    svg.append(svgEl("rect", { x: LX, y, width: cells * cw, height: 54, fill: "none", stroke: INK, "stroke-width": 4 }));
    svg.append(fd6SvgLine(label, LX - 14, y + 20, 19, { anchor: "end" }));
    if (sub) svg.append(fd6SvgLine(sub, LX - 14, y + 46, 15, { anchor: "end", fill: "#5B6B6B" }));
  };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: 300, fill: "transparent" }));
    const ok = same(), cA = dA * kA, cB = dB * kB;
    /* 나누는 수 띠 */
    bar(20, Bv, cB, Bv.num * cB / Bv.den, () => "#9CC6EC", opt.bName || `[${opt.B}]`, "나누는 수");
    /* 나누어지는 수 띠 */
    const y2 = 120, nA = Av.num * cA / Av.den;
    bar(y2, Av, cA, nA, c => {
      if (!ok) return "#F6C08A";
      const gi = Math.floor(c / g);
      if (gi < p) return FD6_F[gi % 4];
      if (remOn && gi === full) return "#F3D36B";
      return "#FBE6CC";
    }, opt.aName || `[${opt.A}]`, "나누어지는 수");
    if (ok) {
      const cw = uw / cA;
      for (let i = 0; i < p; i++) {
        const x1 = LX + i * g * cw, x2 = LX + (i + 1) * g * cw, yb = y2 + 64;
        svg.append(svgEl("path", { d: `M${x1 + 3} ${yb} L${x1 + 3} ${yb + 10} L${x2 - 3} ${yb + 10} L${x2 - 3} ${yb}`, fill: "none", stroke: FD6_S[i % 4], "stroke-width": 3 }));
        svg.append(txt((x1 + x2) / 2, yb + 28, String(i + 1), 18, { fill: FD6_S[i % 4] }));
      }
      if (remOn) {
        const x1 = LX + full * g * cw, x2 = x1 + rem * cw, yb = y2 + 64;
        svg.append(svgEl("path", { d: `M${x1 + 3} ${yb} L${x1 + 3} ${yb + 10} L${x2 - 3} ${yb + 10} L${x2 - 3} ${yb}`, fill: "none", stroke: "#B8860B", "stroke-width": 3 }));
        /* 남은 부분 위에 한 묶음 크기 점선 */
        svg.append(svgEl("rect", { x: x1, y: y2 - 6, width: Math.min(g * cw, W - 6 - x1), height: 66, fill: "none", stroke: "#B8860B", "stroke-width": 2.5, "stroke-dasharray": "7 5" }));
        svg.append(fd6SvgLine(`한 ${one}의 [${rem}/${g}]`, Math.min(W - 70, Math.max(LX + 70, (x1 + x2) / 2)), yb + 34, 18, { fill: "#8A6400" }));
      }
    }
    /* 눈금 */
    const yl = 262;
    svg.append(svgEl("line", { x1: LX, y1: yl, x2: LX + BW, y2: yl, stroke: INK, "stroke-width": 2 }));
    for (let u = 0; u <= U; u++) { svg.append(svgEl("line", { x1: LX + u * uw, y1: yl - 9, x2: LX + u * uw, y2: yl + 9, stroke: INK, "stroke-width": 3 })); svg.append(txt(LX + u * uw, yl + 24, u === U && unit ? `${u}${unit}` : String(u), 18)); }
    /* 읽기 글 */
    if (!ok) rd.textContent = `칸의 크기가 달라요(나누어지는 수 한 칸: [1/${cA}]${unit}, 나누는 수 한 칸: [1/${cB}]${unit}). ‘＋’로 칸을 똑같이 나누어 크기를 같게 해 보세요.`;
    else if (!p && !remOn) rd.textContent = `두 띠의 한 칸 크기가 같아요(한 칸: [1/${cd}]${unit}). 나누어지는 수는 ${T}칸, 나누는 수는 ${g}칸이에요. 아래 띠를 눌러 ${g}칸씩 덜어 내 보세요.`;
    else rd.textContent = [p ? gTxt(p) : "", remOn ? `한 ${one}의 [${rem}/${g}]` : ""].filter(Boolean).join(" + ") + (ready() ? ` → ${fd6Tk(opt.A)}÷${fd6Tk(opt.B)} = ${fd6Txt(T, g)}` : rem && p === full ? ` · 남은 ${rem}칸은 한 ${one}(${g}칸)의 얼마만큼일까요? 남은 부분을 눌러 보세요.` : "");
    rd.classList.toggle("fd6good", ready());
    stA && stA.paint(); stB && stB.paint();
    kick();
  };
  const ready = () => same() && p === full && (!rem || remOn);
  const scoop = () => {
    if (!same()) return api.hint("먼저 ‘＋’로 칸을 똑같이 나누어 두 띠의 칸 크기를 같게 해요.");
    if (p < full) p++;
    else if (rem && !remOn) remOn = true;
    else return api.hint(`더 덜어 낼 수 없어요. ${rem ? `${fd6J(gTxt(full), "과와")} 한 ${one}의 ${fd6J(`[${rem}/${g}]`, "이에요")}` : fd6J(gTxt(full), "이에요")}.`);
    draw();
  };
  const back = () => { if (remOn) remOn = false; else if (p) p--; draw(); };
  const rd = h("p", { class: "fd6rd" });
  const stA = needA ? fd6Stepper("나누어지는 수의 한 칸을 똑같이:", () => kA, v => { kA = v; p = 0; remOn = false; }, 1, Math.max(12, cd / dA), draw) : null;
  const stB = needB ? fd6Stepper("나누는 수의 한 칸을 똑같이:", () => kB, v => { kB = v; p = 0; remOn = false; }, 1, Math.max(12, cd / dB), draw) : null;
  svg.style.cursor = "pointer"; svg.addEventListener("click", scoop);
  draw();
  const ask = h("div", { class: "fd6ask" });
  body.append(h("p", { class: "fd6tip" }, opt.tip || `아래 띠(나누어지는 수)를 누를 때마다 위 띠(나누는 수)만큼씩 덜어 내요.`),
    stA || "", stB || "", h("div", { class: "fd6ctl" }, h("button", { onclick: scoop }, "한 번 덜어 내기"), h("button", { onclick: back }, "하나 되돌리기")), rd, h("div", { class: "fd6stage" }, svg), ask);
  kick = fd6Ask(ask, api, ready, () => !same() ? `칸의 크기를 같게 해요. 두 띠의 한 칸이 모두 [1/${cd}]${unit ? fd6U(unit, "이가") : "이"} 되게 나누어요.` : p < full ? `${g}칸씩 덜어 내요. 지금 ${p}번 덜어 냈어요.` : "남은 부분을 눌러 한 묶음의 얼마만큼인지 알아봐요.", opt);
}


/* ② 원 모양(파이) 덜어 내기: 분모가 같은 경우. opt A, B, word, unit, ask */
function fd6Pie(body, api, opt) {
  fd6Style(); fd6Style2();
  /* 다 하면 fd6Ask 안에서 api.done( 이 불려요 */
  let kick = () => {};
  const Av = fd6Val(opt.A), Bv = fd6Val(opt.B), d = fd6Lcm(Av.den, Bv.den), T = Av.num * d / Av.den, g = Bv.num * d / Bv.den, full = Math.floor(T / g), rem = T % g, word = opt.word || "묶음", one = opt.one || word;
  const gTxt = n => opt.cnt ? `${n}${opt.cnt}` : `${word} ${n}개`;
  let p = 0, remOn = false;
  const W = 900, H = 340, cx = 250, cy = 170, R = 140;
  const svg = makeSvg(W, H);
  const sector = (i, fill) => { const a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d;
    return svgEl("path", { d: `M${cx} ${cy} L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z`, fill, stroke: INK, "stroke-width": 3 }); };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
    for (let i = 0; i < d; i++) {
      const gi = Math.floor(i / g);
      const f = i >= T ? "#F4F1EA" : gi < p ? FD6_F[gi % 4] : remOn && gi === full ? "#F3D36B" : "#E9C79C";
      svg.append(sector(i, f));
      if (i < T && (gi < p || (remOn && gi === full))) { const am = -Math.PI / 2 + (i + .5) * 2 * Math.PI / d; svg.append(txt(cx + R * .62 * Math.cos(am), cy + R * .62 * Math.sin(am), gi < p ? String(gi + 1) : "?", 22, { fill: INK })); }
    }
    svg.append(svgEl("circle", { cx, cy, r: R, fill: "none", stroke: INK, "stroke-width": 5 }));
    let y = 70; const X = 470;
    svg.append(fd6SvgLine(opt.aName || `[${opt.A}]`, X, y, 24, { anchor: "start" })); y += 56;
    svg.append(fd6SvgLine(`한 ${one}: ${opt.bName || `[${opt.B}]`}`, X, y, 22, { anchor: "start", fill: "#2B7BD6" })); y += 60;
    svg.append(fd6SvgLine(p || remOn ? `${gTxt(p)}${remOn ? ` + 한 ${one}의 [${rem}/${g}]` : ""}` : "원을 눌러 나누어 주어요.", X, y, 22, { anchor: "start", fill: ready() ? "#2E8B57" : TENT }));
    kick();
  };
  const ready = () => p === full && (!rem || remOn);
  const scoop = () => { if (p < full) p++; else if (rem && !remOn) remOn = true; else return api.hint(`더 나누어 줄 수 없어요. ${fd6J(gTxt(full), "이에요")}.`); draw(); };
  svg.style.cursor = "pointer"; svg.addEventListener("click", scoop);
  draw();
  const ask = h("div", { class: "fd6ask" });
  body.append(h("p", { class: "fd6tip" }, opt.tip || `원을 누를 때마다 [${opt.B}]씩 한 ${one}에게 나누어 주어요.`),
    h("div", { class: "fd6ctl" }, h("button", { onclick: scoop }, "한 번 나누어 주기"), h("button", { onclick: () => { if (remOn) remOn = false; else if (p) p--; draw(); } }, "하나 되돌리기")), h("div", { class: "fd6stage" }, svg), ask);
  kick = fd6Ask(ask, api, ready, () => `[${opt.B}]씩 나누어 주어요. 지금 ${fd6J(gTxt(p), "이에요")}.`, opt);
}


/* 단위 뒤 조사: 읽는 말(킬로그램·리터…)의 받침으로 정해요 */
const FD6_UR = { km: "킬로미터", L: "리터", "원": "원", kg: "킬로그램", m: "미터", g: "그램", "시간": "시간", "수조": "수조" };
function fd6U(u, pair) { const w = FD6_UR[String(u).trim()] || String(u); return u + fd6J(w, pair).slice(w.length); }
/* 아래 수직선의 양 읽기: pre가 있으면 '수조의 [1/3]', '수조 1개'처럼 읽어요 */
function fd6P(it, x) { return it.pre ? (x === "1" ? `${it.pre} 1개` : `${it.pre}의 ${x}`) : `${x}${it.bot}`; }
function fd6PJ(it, x, pair) { return it.pre ? fd6J(fd6P(it, x), pair) : x + fd6U(it.bot, pair); }
/* ③ 이중 척도 모델: 위는 양(km·L·원·kg), 아래는 수직선(시간·수조·kg·m). 아래 a/b일 때 위 Q.
   items [{Q:"6", a:2, b:3, top:"km", bot:"시간", name}] — 표시를 [1/b]로 옮기면 ÷a, 1로 옮기면 ×b. 모든 모델을 끝내야 해요. */
function fd6Double(body, api, opt) {
  fd6Style(); fd6Style2();
  /* 다 하면 fd6Ask 안에서 api.done( 이 불려요 */
  let kick = () => {}, estOk = !opt.est;
  const items = opt.items, st = items.map(() => ({ pos: null, stage: 0 }));
  const wrap = h("div");
  const svgs = items.map((it, k) => {
    const a = it.a, b = it.b, Q = fd6Val(it.Q), seg = fd6R(Q.num, Q.den * a), one = fd6R(seg.num * b, seg.den);
    const W = 900, LX = 140, BW = 680, H = 300, YT = 70, YB = 210, step = BW / b;
    const svg = makeSvg(W, H);
    const S = st[k]; S.pos = a;
    const lab = v => fd6Lbl(v.num, v.den);
    const draw = () => {
      svg.innerHTML = "";
      svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
      if (it.name) svg.append(fd6SvgLine(it.name, 16, 22, 18, { anchor: "start", fill: "#5B6B6B" }));
      /* 위 띠: b조각 */
      for (let i = 0; i < b; i++) {
        const on = i < S.pos, x = LX + i * step;
        svg.append(svgEl("rect", { x, y: YT, width: step, height: 50, fill: on ? (S.stage >= 1 && i === 0 && S.pos === 1 ? "#F2A65A" : "#F6C08A") : "#fff", stroke: INK, "stroke-width": 2, "stroke-dasharray": on ? "" : "6 5" }));
      }
      svg.append(svgEl("rect", { x: LX, y: YT, width: S.pos * step, height: 50, fill: "none", stroke: INK, "stroke-width": 4 }));
      svg.append(fd6SvgLine(it.top, LX - 16, YT + 25, 20, { anchor: "end" }));
      /* 위 값 표시 */
      const showTop = (j, v, col) => { const x = LX + j * step; svg.append(svgEl("line", { x1: x, y1: YT - 6, x2: x, y2: YT + 56, stroke: col, "stroke-width": 3 })); svg.append(fd6SvgLine(`${lab(v)}${it.top}`, x, YT - 26, 20, { fill: col })); };
      showTop(a, Q, INK);
      if (S.stage >= 1) showTop(1, seg, "#C8472E");
      if (S.stage >= 2) showTop(b, one, "#2E8B57");
      /* 아래 수직선 */
      svg.append(svgEl("line", { x1: LX, y1: YB, x2: LX + BW, y2: YB, stroke: INK, "stroke-width": 4 }));
      for (let j = 0; j <= b; j++) {
        const x = LX + j * step;
        svg.append(svgEl("line", { x1: x, y1: YB - 12, x2: x, y2: YB + 12, stroke: INK, "stroke-width": j === 0 || j === b ? 4 : 2.5 }));
        svg.append(fd6SvgLine(j === 0 ? "0" : j === b ? "1" : `[${j}/${b}]`, x, YB + 44, 19));
      }
      svg.append(fd6SvgLine(it.bot, LX - 16, YB, 20, { anchor: "end" }));
      /* 화살표 */
      const arc = (j1, j2, y, hgt, t, col) => { const x1 = LX + j1 * step, x2 = LX + j2 * step, m = (x1 + x2) / 2, c = y - hgt;
        svg.append(svgEl("path", { d: `M${x1} ${y} Q${m} ${c} ${x2} ${y}`, fill: "none", stroke: col, "stroke-width": 3 }));
        svg.append(svgEl("circle", { cx: x2, cy: y, r: 5, fill: col }));
        svg.append(svgEl("rect", { x: m - 22, y: y - hgt / 2 - 13, width: 44, height: 24, rx: 6, fill: "#fff" }));
        svg.append(fd6SvgLine(t, m, y - hgt / 2 - 1, 19, { fill: col })); };
      /* ×b 화살표를 먼저 그려 ÷a 글자가 위에 보이게 */
      if (S.stage >= 2) arc(1, b, YB - 14, 92, `×${b}`, "#2E8B57");
      if (S.stage >= 1) arc(a, 1, YB - 14, 36, `÷${a}`, "#C8472E");
      /* 움직이는 표시 */
      const mx = LX + S.pos * step;
      svg.append(svgEl("polygon", { points: `${mx},${YB - 4} ${mx - 13},${YB - 28} ${mx + 13},${YB - 28}`, fill: TENT, "pointer-events": "none" }));
      const U_ = (u, pr) => fd6U(u, pr);
      rds[k].textContent = S.stage === 0 ? `${fd6P(it, `[${a}/${b}]`)}에 ${lab(Q)}${U_(it.top, "이에요")}. 먼저 ${fd6PJ(it, `[1/${b}]`, "으로")} 표시를 옮겨 보세요.`
        : S.stage === 1 ? `${fd6PJ(it, `[1/${b}]`, "은는")} ${fd6PJ(it, `[${a}/${b}]`, "을를")} ${fd6J(String(a), "으로")} 나눈 것이니 ${lab(Q)}÷${a} = ${lab(seg)}${U_(it.top, "이에요")}. 이제 ${fd6PJ(it, "1", "으로")} 옮겨 보세요.`
        : `${fd6PJ(it, "1", "은는")} ${fd6P(it, `[1/${b}]`)}의 ${b}배이니 ${lab(seg)}×${b} = ${lab(one)}${U_(it.top, "이에요")}.`;
      rds[k].classList.toggle("fd6good", S.stage === 2);
      kick();
    };
    const move = j => {
      if (S.stage === 0) { if (j !== 1) return api.hint(`먼저 ${fd6PJ(it, `[1/${b}]`, "으로")} 옮겨요. ${fd6PJ(it, `[1/${b}]`, "은는")} ${fd6PJ(it, `[${a}/${b}]`, "을를")} ${fd6J(String(a), "으로")} 나눈 것이에요.`); S.stage = 1; S.pos = 1; }
      else if (S.stage === 1) { if (j !== b) return api.hint(`이제 ${fd6PJ(it, "1", "으로")} 옮겨요. 1은 [1/${b}]의 ${b}배예요.`); S.stage = 2; S.pos = b; }
      draw();
    };
    const jAt = p => Math.round((p.x - LX) / step);
    svg.style.cursor = "pointer";
    dragOn(svg, p => p.y > YB - 70 && p.y < YB + 70 && p.x > LX - step / 2 && p.x < LX + BW + step / 2,
      p => { const j = jAt(p); if (j >= 0 && j <= b && j !== S.pos && ((S.stage === 0 && j === 1) || (S.stage === 1 && j === b))) move(j); },
      p => { const j = jAt(p); if (j >= 0 && j <= b && j !== S.pos) move(j); });
    svg.draw = draw; return svg;
  });
  const rds = items.map(() => h("p", { class: "fd6rd" }));
  items.forEach((it, k) => { wrap.append(rds[k], h("div", { class: "fd6stage" }, svgs[k])); svgs[k].draw(); });
  const ask = h("div", { class: "fd6ask" });
  if (opt.est) body.append(fd6EstBox(api, opt.est, () => { estOk = true; kick(); }));
  body.append(h("p", { class: "fd6tip" }, opt.tip || "아래 수직선의 눈금을 누르거나 주황 표시를 끌어 옮겨요."), wrap,
    h("div", { class: "fd6ctl" }, h("button", { onclick: () => { st.forEach((S, k) => { S.stage = 0; S.pos = items[k].a; svgs[k].draw(); }); } }, "처음부터")), ask);
  kick = fd6Ask(ask, api, () => estOk && st.every(S => S.stage === 2), () => { if (!estOk) return "먼저 위에서 어림해요."; const k = st.findIndex(S => S.stage < 2), it = items[k]; return st[k].stage === 0 ? `${items.length > 1 ? (k + 1) + "번 그림: " : ""}표시를 ${fd6PJ(it, `[1/${it.b}]`, "으로")} 옮겨요.` : `${items.length > 1 ? (k + 1) + "번 그림: " : ""}표시를 ${fd6PJ(it, "1", "으로")} 옮겨요.`; }, opt);
}


/* ④ 나눗셈을 곱셈으로 바꾸기: ÷를 누르면 ×로, 분수를 누르면 분자와 분모가 바뀌어요. — 저절로 확인
   rows [{A:"4/5", B:"2/3"}] — 나누는 수만 뒤집고 ×로 바꾼 다음 값을 써요. 줄마다 값을 다 쓰면 확인해요. */
function fd6Flip(body, api, opt) {
  fd6Style(); fd6Style2(); fd6Style3();
  const R = opt.rows.map(r => { const A = fd6Val(r.A), B = fd6Val(r.B); return { r, A, B, fa: false, fb: false, mul: false, T: fd6R(A.num * B.den, A.den * B.num) }; });
  const fr = (v, f) => { const n = f ? v.den : v.num, d = f ? v.num : v.den; return d === 1 ? String(n) : `[${n}/${d}]`; };
  const wrap = h("div");
  let auto = () => {};
  R.forEach((S, i) => {
    const line = h("div", { class: "fd6flip" });
    const ba = h("button", { "aria-label": "나누어지는 수" }), bo = h("button", { class: "fd6op", "aria-label": "연산 기호" }), bb = h("button", { "aria-label": "나누는 수" });
    S.inp = fd6In("값"); S.inp.tv = S.T;
    const paint = () => { ba.textContent = fr(S.A, S.fa); bb.textContent = fr(S.B, S.fb); bo.textContent = S.mul ? "×" : "÷"; ba.classList.toggle("fd6fl", S.fa); bb.classList.toggle("fd6fl", S.fb); bo.classList.toggle("fd6fl", S.mul); };
    ba.onclick = () => { S.fa = !S.fa; paint(); auto(); }; bb.onclick = () => { S.fb = !S.fb; paint(); auto(); }; bo.onclick = () => { S.mul = !S.mul; paint(); auto(); };
    paint();
    if (R.length > 1) line.append(h("span", { class: "fd6no" }, `${i + 1})`));
    line.append(h("span", {}, `${fr(S.A, false)}÷${fr(S.B, false)} =`), ba, bo, bb, h("span", {}, "="), S.inp);
    wrap.append(line);
  });
  api.provide({ words: ["나눗셈을 곱셈으로", "나누는 분수의 분자와 분모를 바꾸기"], answers: R.map(S => fd6Plain(`${fr(S.A, false)}÷${fr(S.B, false)} = ${fr(S.A, false)}×${fr(S.B, true)} = ${fd6Txt(S.T.num, S.T.den)}`)) });
  const judge = () => {
    const given = []; let bad = null, hint = null;
    R.forEach(S => {
      given.push(`${S.mul ? "×" : "÷"}${S.fa ? "앞뒤집음" : ""}${S.fb ? "뒤뒤집음" : ""}=${S.inp.text()}`);
      if (bad) return;
      if (!S.mul && !S.fa && !S.fb) bad = "÷를 눌러 ×로 바꾸고, 나누는 분수를 눌러 분자와 분모를 바꾸어요.";
      else if (!S.mul) bad = "분수를 뒤집었으면 ÷도 ×로 바꾸어야 해요.";
      else if (S.fa && S.fb) bad = "두 분수를 모두 바꾸었어요. 분자와 분모를 바꾸는 것은 나누는 수만이에요.";
      else if (S.fa) bad = "나누어지는 수(앞의 분수)를 바꾸었어요. 분자와 분모를 바꾸는 것은 나누는 수(뒤의 분수)예요.";
      else if (!S.fb) bad = "×로만 바꾸면 곱셈이 되어 값이 달라져요. 나누는 분수의 분자와 분모도 바꾸어요.";
      else {
        const r = S.inp.get(), J = fd6Judge(r, `${S.T.num}/${S.T.den}`);
        if (J.code === "ok") S.inp.paint(true);
        else if (J.code === "improper" || J.code === "zero") { S.inp.paint(null); hint = hint || J.msg; }
        else { S.inp.paint(false); bad = J.msg || "곱셈식을 다시 계산해 봐요. 분자는 분자끼리, 분모는 분모끼리 곱해요."; }
      }
    });
    if (bad) { api.fail(bad, given.join(" / ")); return false; }
    if (hint) { api.tryOnce(); api.hint(hint); return false; }
    api.tryOnce(); api.done(given.join(" / "), opt.ok || "나눗셈을 곱셈으로 바꾸고 나누는 분수의 분자와 분모를 바꾸어 계산했어요!");
    return true;
  };
  auto = autoRun(() => R.every(S => S.inp.full()), () => R.map(S => `${S.mul}${S.fa}${S.fb}${S.inp.sig()}`).join("§"), judge, 900);
  R.forEach(S => fd6Hook(S.inp, auto));
  body.append(h("p", { class: "fd6tip" }, opt.tip || "기호 ÷를 누르면 ×로 바뀌고, 분수를 누르면 분자와 분모가 바뀌어요. 나눗셈과 값이 같은 곱셈식을 만든 다음 값을 써요. 값을 다 쓰면 저절로 확인해요."), wrap);
}

/* ⑤ 수 카드로 분수의 나눗셈 만들기 — 저절로 확인
   board: {shape:[[분자,분모],[분자,분모]] (null = 빈칸), goal:"any"|"max"|"min", proper:true(진분수만), avoid:["3/5÷4/7"], label}
   fd6BuildUI(host, cards, board, onCheck) : 빈칸을 다 채우고 몫을 쓰면 onCheck({err} | {e, val, r, right, given}) — true를 돌려주면 끝 */
function fd6ShapeVals(shape, vals) { let i = 0; return shape.map(f => f.map(x => x == null ? vals[i++] : x)); }
function fd6ShapeTxt(shape, vals) { const f = fd6ShapeVals(shape, vals); return `[${f[0][0]}/${f[0][1]}]÷[${f[1][0]}/${f[1][1]}]`; }
function fd6ShapeVal(shape, vals, proper) { const f = fd6ShapeVals(shape, vals); if (f.some(([n, d]) => !d || !n || (proper && n >= d))) return null; return fd6R(f[0][0] * f[1][1], f[0][1] * f[1][0]); }
function fd6Slots(shape) { return shape.reduce((a, f) => a + f.filter(x => x == null).length, 0); }
function fd6Best(board, cards, sign) {
  const s = fd6Slots(board.shape); let best = null;
  const rec = (pick, used) => {
    if (pick.length === s) { const v = fd6ShapeVal(board.shape, pick.map(i => cards[i]), board.proper); if (v && (!best || sign * (v.num * best.v.den - best.v.num * v.den) > 0)) best = { v, idx: pick.slice() }; return; }
    cards.forEach((_, i) => { if (!used.has(i)) { used.add(i); pick.push(i); rec(pick, used); pick.pop(); used.delete(i); } });
  };
  rec([], new Set());
  return best;
}
function fd6BuildUI(host, cards, board, onCheck) {
  fd6Style(); fd6Style2(); fd6Style3();
  const shape = board.shape, nS = fd6Slots(shape), slot = Array(nS).fill(null);
  let sel = null, auto = () => {};
  const cBtns = cards.map((c, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; paint(); } }, String(c)));
  const sBtns = [];
  const mkS = lab => { const k = sBtns.length; const b = h("button", { class: "fd6slot2", "aria-label": lab, onclick: () => { if (sel == null) slot[k] = null; else { const old = slot.indexOf(sel); if (old >= 0) slot[old] = null; slot[k] = sel; } sel = null; paint(); } }, "​"); sBtns.push(b); return b; };
  const boardEl = h("div", { class: "fd6board" });
  shape.forEach((f, fi) => {
    if (fi) boardEl.append(h("span", {}, "÷"));
    const part = (x, lab) => x == null ? mkS(lab) : h("span", {}, String(x));
    boardEl.append(h("span", { class: "fd6fr fd6frin" }, h("span", { class: "fd6q" }, h("span", { class: "fd6n" }, part(f[0], "분자")), h("span", { class: "fd6d" }, part(f[1], "분모")))));
  });
  const quo = fd6In("몫");
  boardEl.append(h("span", {}, "="), quo);
  const paint = () => {
    cBtns.forEach((b, i) => { b.classList.toggle("fd6on", sel === i); b.classList.toggle("fd6used", slot.includes(i)); });
    sBtns.forEach((b, k) => { b.textContent = slot[k] == null ? "​" : String(cards[slot[k]]); b.classList.toggle("fd6full", slot[k] != null); });
    auto();
  };
  paint();
  if (board.label) host.append(h("div", { class: "jua", style: "margin-top:.4em" }, board.label));
  host.append(h("div", { class: "fd6deck" }, cBtns), boardEl);
  const vals = () => slot.map(i => i == null ? null : cards[i]);
  const ready = () => {
    if (slot.some(s => s == null)) return false;
    quo.tv = fd6ShapeVal(shape, vals(), board.proper) || null;
    return quo.full();
  };
  auto = autoRun(ready, () => slot.join(",") + "#" + quo.sig(), () => {
    const vs = vals(), e = fd6ShapeTxt(shape, vs), val = fd6ShapeVal(shape, vs, board.proper);
    if (!val) return onCheck({ err: board.proper ? "진분수는 분자가 분모보다 작아야 해요." : "분수를 다시 만들어요.", e }) === true;
    const r = quo.get();
    if (r.err) { quo.paint(false); return onCheck({ err: r.err === "half" ? "분수는 분자와 분모를 모두 써요." : "몫을 분수나 자연수로 써요.", e }) === true; }
    const right = fd6Eq(r, val); quo.paint(right);
    return onCheck({ e, val, r, right, given: `${fd6Plain(e)} = ${quo.text()}` }) === true;
  }, 900);
  fd6Hook(quo, auto);
  return auto;
}
function fd6Build(body, api, opt) {
  fd6Style(); fd6Style2(); fd6Style3();
  const boards = opt.boards, cards = opt.cards, okSet = new Set(), given = boards.map(() => "-");
  const bests = boards.map(bd => bd.goal === "max" ? fd6Best(bd, cards, 1) : bd.goal === "min" ? fd6Best(bd, cards, -1) : null);
  api.provide({ words: ["나누는 수가 작을수록 몫이 커요", "분자끼리 나누기", "나누는 분수의 분자와 분모를 바꾸어 곱하기"],
    answers: boards.map((bd, i) => bests[i] ? `${fd6Plain(fd6ShapeTxt(bd.shape, bests[i].idx.map(k => cards[k])))} = ${fd6Plain(fd6Txt(bests[i].v.num, bests[i].v.den))}` : "").filter(Boolean) });
  body.append(h("p", { class: "fd6tip" }, opt.tip || "수 카드를 누른 다음 빈칸을 눌러 넣어요. 빈칸을 다시 누르면 빠져요. 그리고 몫을 써요. 다 쓰면 저절로 확인해요."));
  boards.forEach((bd, i) => {
    const box = h("div", { class: "fd6grp" }); body.append(box);
    fd6BuildUI(box, cards, bd, R => {
      given[i] = R.given || R.e || "-";
      const pre = boards.length > 1 ? `${i + 1}번 판: ` : "";
      okSet.delete(i);
      if (R.err) { api.fail(pre + R.err, given.join(" / ")); return false; }
      if (bd.avoid && bd.avoid.includes(R.e.replace(/[\[\]]/g, ""))) { api.fail(pre + "친구가 만든 나눗셈과 같아요. 다른 나눗셈을 만들어 보세요.", given.join(" / ")); return false; }
      if (bests[i] && !fd6Eq(R.val, bests[i].v)) { api.fail(pre + (bd.msg || (bd.goal === "max" ? "몫이 더 큰 나눗셈을 만들 수 있어요. 나누는 수를 작게 해 봐요." : "몫이 더 작은 나눗셈을 만들 수 있어요. 나누는 수를 크게 해 봐요.")), given.join(" / ")); return false; }
      if (!R.right) { api.fail(pre + (fd6Diag(R.e, R.r) || "몫을 다시 계산해 봐요."), given.join(" / ")); return false; }
      if (R.r.hasF && R.r.hasW && R.r.n >= R.r.d) { api.hint("값은 맞아요. 대분수의 분수 부분은 1보다 작게 써요."); return false; }
      okSet.add(i); api.tryOnce();
      if (okSet.size === boards.length) api.done(given.join(" / "), opt.ok || "나눗셈을 만들고 몫을 바르게 구했어요!");
      else api.hint(`○ ${pre}맞아요! 남은 판도 만들어 봐요.`);
      return true;
    });
  });
}

/* ⑥ 문제 완성하기: 보기 분수 중 서로 다른 두 개를 골라 문장을 완성하고 몫을 구해요(저절로 확인). opt fr:[…], s:[앞 글, 가운데 글, 뒤 글], unit */
function fd6Pose(body, api, opt) {
  fd6Style(); fd6Style2(); fd6Style3();
  const fr = opt.fr; let p = null, q = null, auto = () => {};
  const b1 = h("span", { class: "fd6blank" }, "​"), b2 = h("span", { class: "fd6blank" }, "​");
  const row = (lab, set) => { const r = h("div", { class: "fd6ctl" }, h("span", { class: "jua" }, lab)); fr.forEach((f, i) => r.append(h("button", { class: "opt", onclick: ev => { set(i); [...r.querySelectorAll(".opt")].forEach(x => x.classList.remove("fd6on")); ev.currentTarget.classList.add("fd6on"); paint(); } }, `[${f}]`))); return r; };
  const val = () => fd6R(fd6Val(fr[p]).num * fd6Val(fr[q]).den, fd6Val(fr[p]).den * fd6Val(fr[q]).num);
  const paint = () => { b1.textContent = p == null ? "​" : `[${fr[p]}]`; b2.textContent = q == null ? "​" : `[${fr[q]}]`; auto(); };
  const quo = fd6In("몫");
  api.provide({ words: ["통분", "분자끼리 나누기"], answers: [] });
  body.append(h("p", { class: "fd6tip" }, "두 줄에서 분수를 하나씩 골라 문제를 완성하고, 답을 구해요. 두 분수는 서로 달라야 해요. 답을 다 쓰면 저절로 확인해요."),
    row(opt.l1 || "첫째 칸:", i => { p = i; }), row(opt.l2 || "둘째 칸:", i => { q = i; }),
    h("div", { class: "fd6pose" }, opt.s[0], b1, opt.s[1], b2, opt.s[2]),
    h("div", { class: "fd6cl" }, h("span", {}, opt.ansLab || "답:"), quo, h("span", {}, opt.unit || "")));
  auto = autoRun(() => { if (p == null || q == null) return false; quo.tv = val(); return quo.full(); }, () => `${p},${q}#${quo.sig()}`, () => {
    if (p === q) { api.fail("서로 다른 두 분수를 골라요.", fr[p]); return false; }
    const v = val(), r = quo.get(), e = `[${fr[p]}]÷[${fr[q]}]`, given = `${fd6Plain(e)} = ${quo.text()}`;
    if (r.err) { quo.paint(false); api.fail(r.err === "half" ? "분수는 분자와 분모를 모두 써요." : "답을 분수나 자연수로 써요.", given); return false; }
    if (!fd6Eq(r, v)) { quo.paint(false); api.fail(fd6Diag(e, r) || `${fd6J(fd6Plain(e), "을를")} 다시 계산해 봐요. 통분한 다음 분자끼리 나누어요.`, given); return false; }
    quo.paint(true); api.tryOnce(); api.done(given, (opt.ok || "문제를 만들고 답을 구했어요!") + ` ${e} = ${fd6Book(v.num, v.den)}`);
    return true;
  }, 900);
  fd6Hook(quo, auto);
}

/* ⑦ 놀이 ‘다를까요, 같을까요’: 세트마다 수 카드 4장을 한 번씩 모두 써서 나눗셈을 만들고 몫을 구해요.
   친구 셋의 활동지(이 앱이 정한 것)와 비교해 점수: 같은 나눗셈이 없으면 2점, 있으면 1점, 옳게 계산하면 1점 더.
   opt sets [{cards, fr:[{name, e:[a,b,c,d], q:"몫"}]}], need(옳게 계산한 판 수) — 놀이가 끝나면 api.done( 을 불러요 */
function fd6Game(body, api, opt) {
  fd6Style(); fd6Style2(); fd6Style3();
  const sets = opt.sets, need = opt.need || 3; let round = 0, score = 0, good = 0; const log = [];
  const friends = sets[0].fr.map(f => f.name), fScore = friends.map(() => 0);
  const scoreEl = h("span", { class: "fd6score" }, "​"), stage = h("div"), logEl = h("div");
  api.provide({ words: ["같은 나눗셈이 없으면 2점", "같은 나눗셈이 있으면 1점", "옳게 계산하면 1점 추가"], answers: [] });
  const key = (a, b, c, d) => `${a}/${b}÷${c}/${d}`;
  const val = (a, b, c, d) => fd6R(a * d, b * c);
  const paintScore = () => { scoreEl.textContent = `${Math.min(round + 1, sets.length)}/${sets.length}판 · 내 점수 ${score}점 · ` + friends.map((n, i) => `${n} ${fScore[i]}점`).join(" · "); };
  const deal = () => {
    stage.innerHTML = "";
    const S = sets[round]; let doneR = false;
    paintScore();
    stage.append(h("div", { class: "fd6ctl" }, h("span", { class: "jua" }, `${round + 1}판 수 카드:`), h("span", { class: "fd6ccard" }, S.cards.join(", "))));
    const fb = h("div");
    fd6BuildUI(stage, S.cards, { shape: [[null, null], [null, null]] }, R => {
      if (doneR) return true;
      if (R.err) { api.hint(R.err); return false; }
      doneR = true;
      const me = R.e.replace(/[\[\]]/g, ""), rows = [{ name: "나", k: me, q: fd6Key(R.r), ok: R.right, me: true }];
      S.fr.forEach(f => { const v = val(...f.e), qq = fd6Str(f.q); rows.push({ name: f.name, k: key(...f.e), q: f.q, ok: !!qq && !qq.err && fd6Eq(qq, v) }); });
      const tbl = h("table", { class: "fd6sheet" }, h("tr", {}, h("th", {}, "이름"), h("th", {}, "나눗셈"), h("th", {}, "몫"), h("th", {}, "같은 나눗셈"), h("th", {}, "계산"), h("th", {}, "점수")));
      rows.forEach((rw, i) => {
        const dup = rows.some((o, j) => j !== i && o.k === rw.k), pt = (dup ? 1 : 2) + (rw.ok ? 1 : 0);
        rw.pt = pt;
        const [x, y] = rw.k.split("÷");
        tbl.append(h("tr", {}, h("td", { class: rw.me ? "fd6me" : "" }, rw.name), h("td", {}, `[${x}]÷[${y}]`), h("td", {}, fd6Tk(rw.q)), h("td", {}, dup ? "있어요" : "없어요"), h("td", {}, rw.ok ? "옳아요" : "틀렸어요"), h("td", {}, `${pt}점`)));
      });
      score += rows[0].pt; rows.slice(1).forEach((rw, i) => { fScore[i] += rw.pt; });
      if (R.right) good++;
      const [x, y] = me.split("÷"), v = R.val;
      log.push(`${round + 1}판: [${x}]÷[${y}] → ${rows[0].pt}점`);
      fb.append(h("p", { class: "fd6rd" + (R.right ? " fd6good" : "") }, R.right ? `옳게 계산했어요! [${x}]÷[${y}] = ${fd6Book(v.num, v.den)}` : `몫이 틀렸어요. 옳은 몫: [${x}]÷[${y}] = ${fd6Book(v.num, v.den)} ${fd6Diag(R.e, R.r) || ""}`), tbl);
      round++; paintScore();
      logEl.innerHTML = ""; logEl.append(h("ol", { class: "fd6log" }, log.map(t => h("li", {}, t))));
      if (round < sets.length) fb.append(h("div", { class: "fd6ctl" }, h("button", { onclick: deal }, "이어서 한 판 더")));
      else {
        api.tryOnce();
        const top = Math.max(score, ...fScore), win = score === top;
        const msg = `${sets.length}판 끝! 내 점수 ${score}점 · ${friends.map((n, i) => `${n} ${fScore[i]}점`).join(" · ")}. ${win ? "내가 가장 높아요(같은 점수 포함)!" : "친구가 더 높아요."} 옳게 계산한 판은 ${good}번이에요.`;
        if (good >= need) api.done(`${score}점, 옳은 계산 ${good}번`, msg);
        else { api.fail(`${msg} ${need}번 이상 옳게 계산하도록 다시 해 봐요.`, `${score}점`); fb.append(h("div", { class: "fd6ctl" }, h("button", { onclick: () => { round = 0; score = 0; good = 0; fScore.fill(0); log.length = 0; logEl.innerHTML = ""; deal(); } }, "처음부터 다시"))); }
      }
      return true;
    });
    stage.append(fb);
  };
  body.append(h("p", { class: "fd6tip" }, "수 카드 4장을 한 번씩 모두 써서 나눗셈을 만들고 몫을 써요. 몫을 다 쓰면 저절로 친구 셋의 활동지와 비교해 점수를 매겨요."),
    h("div", { class: "fd6ctl" }, scoreEl), stage, logEl);
  deal();
}

/* ⑧ 관계있는 것끼리 잇기(저절로 확인): left [{t,k}], right [{t,k|null}] (값을 계산해 짝이 맞는지 스스로 확인) */
function fd6Match(body, api, opt) {
  fd6Style();
  const L = opt.left, R = opt.right, pair = L.map(() => -1); let sel = null, auto = () => {};
  L.forEach(l => { const v = fd6Eval(l.t); R.forEach(r => { const w = fd6Eval(r.t); if (!v || !w || fd6Eq(v, w) !== (r.k === l.k)) throw new Error("잇기 확인 필요: " + l.t + " / " + r.t); }); });
  const COL = ["#2B7BD6", "#D9822B", "#2E8B57"];
  const lb = L.map((l, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; draw(); } }, l.t));
  const rb = R.map((r, j) => h("button", { class: "opt", onclick: () => { if (sel == null) return api.hint("먼저 왼쪽 식을 눌러요."); pair[sel] = pair[sel] === j ? -1 : j; sel = null; draw(); } }, r.t));
  const badge = (i) => h("span", { class: "fd6badge", style: `background:${COL[i % 3]}` }, String(i + 1));
  function draw() {
    lb.forEach((b, i) => { b.classList.toggle("fd6on", sel === i); b.classList.remove("good", "bad"); [...b.querySelectorAll(".fd6badge")].forEach(x => x.remove()); b.append(badge(i)); });
    rb.forEach((b, j) => { b.classList.remove("good", "bad"); [...b.querySelectorAll(".fd6badge")].forEach(x => x.remove()); pair.forEach((p, i) => { if (p === j) b.append(badge(i)); }); });
    auto();
  }
  draw();
  api.provide({ words: [], answers: L.map(l => `${fd6Plain(l.t)} — ${fd6Plain(R.find(r => r.k === l.k).t)}`) });
  body.append(h("p", { class: "fd6tip" }, "왼쪽 식을 누르고, 값이 같은 오른쪽 수를 눌러 이어요. 짝이 없는 수도 있어요. 모두 이으면 저절로 확인해요."),
    h("div", { class: "fd6mt" }, h("div", { class: "fd6mc" }, lb), h("div", { class: "fd6mc" }, rb)));
  auto = autoRun(() => pair.every(p => p >= 0), () => pair.join(","), () => {
    let ok = true; pair.forEach((p, i) => { const g = R[p].k === L[i].k; lb[i].classList.add(g ? "good" : "bad"); if (!g) ok = false; });
    const given = pair.map((p, i) => `${i + 1}-${p + 1}`).join(", ");
    if (!ok) { api.fail("값을 계산해 보고 다시 이어요. 가분수와 대분수 중 편리한 꼴로 바꾸어 비교해요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok || "값이 같은 식끼리 잘 이었어요!"); return true;
  }, 1200);
}

/* ===== 이야기 버전에서 새로 만든 그림 (앞글자 fd6s) ===== */
function fd6sStyle() {
  if (document.getElementById("fd6s-style")) return;
  const s = document.createElement("style"); s.id = "fd6s-style";
  s.textContent = `.fd6snote{border:3px dashed #3E7C59;border-radius:var(--r);background:#F1F8F2;padding:.5em .9em;margin:.3em 0 .6em}
.fd6snote b{font-family:Jua,sans-serif;font-weight:400;color:#2C5E42}
.fd6snote ul{margin:.3em 0 0 1.1em;padding:0}.fd6snote li{margin:.2em 0;line-height:1.9}`;
  document.head.append(s);
}
function fd6sNote(title, lines) {
  fd6Style(); fd6sStyle();
  return h("div", { class: "fd6snote" }, h("b", {}, title), h("ul", {}, ...lines.map(t => h("li", {}, t))));
}
/* 숲속 수련원 그림 */
function fd6sCamp() {
  const svg = makeSvg(900, 250);
  svg.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 250, fill: "#EAF5FB", rx: 16 }));
  svg.append(svgEl("rect", { x: 0, y: 180, width: 900, height: 70, fill: "#CFE8C4" }));
  svg.append(svgEl("path", { d: "M0 180 L130 80 L240 180 Z", fill: "#9CCB8E", stroke: "#4E8A47", "stroke-width": 3 }));
  svg.append(svgEl("path", { d: "M170 180 L320 60 L470 180 Z", fill: "#B5D9A4", stroke: "#4E8A47", "stroke-width": 3 }));
  /* 나무 */
  [[60, 190], [520, 186], [850, 190]].forEach(([x, y]) => { svg.append(svgEl("rect", { x: x - 6, y: y - 30, width: 12, height: 30, fill: "#9C6B3E" })); svg.append(svgEl("circle", { cx: x, cy: y - 48, r: 26, fill: "#6FB063", stroke: "#3F7D39", "stroke-width": 2 })); });
  /* 수련원 건물 */
  svg.append(svgEl("rect", { x: 560, y: 110, width: 200, height: 72, fill: "#F6D9A8", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("path", { d: "M545 112 L660 62 L775 112 Z", fill: "#C8472E", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("rect", { x: 645, y: 140, width: 30, height: 42, fill: "#9C6B3E", stroke: INK, "stroke-width": 2 }));
  [[585, 130], [710, 130]].forEach(([x, y]) => svg.append(svgEl("rect", { x, y, width: 30, height: 22, fill: "#fff", stroke: INK, "stroke-width": 2 })));
  svg.append(txt(660, 100, "숲속 수련원", 18));
  /* 텐트와 모닥불 */
  svg.append(svgEl("path", { d: "M300 200 L360 135 L420 200 Z", fill: "#7FB2E5", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("path", { d: "M360 135 L345 200 L375 200 Z", fill: "#fff", stroke: INK, "stroke-width": 2 }));
  svg.append(svgEl("path", { d: "M465 205 l12 -30 l12 30 Z", fill: "#F2A65A", stroke: "#C8472E", "stroke-width": 2 }));
  svg.append(svgEl("line", { x1: 455, y1: 210, x2: 500, y2: 202, stroke: "#9C6B3E", "stroke-width": 5 }));
  svg.append(svgEl("line", { x1: 455, y1: 202, x2: 500, y2: 210, stroke: "#9C6B3E", "stroke-width": 5 }));
  /* 버스 */
  svg.append(svgEl("rect", { x: 90, y: 196, width: 160, height: 34, rx: 8, fill: "#F3D36B", stroke: INK, "stroke-width": 3 }));
  [[125, 232], [215, 232]].forEach(([x, y]) => svg.append(svgEl("circle", { cx: x, cy: y, r: 9, fill: INK })));
  svg.append(txt(170, 218, "6학년 2반", 15));
  return h("div", { class: "fd6stage" }, svg);
}

//@@LESSONS
const UNIT_STORY = { title: "6학년 2반 숲속 수련회", lines: [
  "한빛초등학교 6학년 2반이 1박 2일 숲속 수련회를 떠나요. 반장 서준이와 지안, 하람, 도현, 유진, 민서가 모둠을 나누어 음료·요리·팔찌 만들기·숲길 걷기·간식 장보기를 준비해요.",
  "주스를 컵에 나누어 따르고, 숲길이 몇 배 긴지 견주고, 버스가 1시간 동안 가는 거리와 물통 가득 들어가는 보리차를 구하며 나누는 수가 분수인 나눗셈을 알아봐요.",
  "마지막에는 캠프파이어 수 카드 놀이와 수련회 발표회에서 배운 것을 정리해요."],
  one: "6학년 2반 숲속 수련회 · 분모가 같으면 분자끼리 나누고, 분모가 다르면 통분한 다음 분자끼리 나눠요. (분수)÷(분수)는 나누는 분수의 분자와 분모를 바꾸어 곱해도 돼요." };
const UNIT_KEYWORDS = ["덜어 내기", "단위분수의 개수", "분자끼리 나누기", "통분", "몇 배", "1시간 동안(단위 비율)", "이중 척도 모델", "자연수를 분자로 나누고 분모를 곱하기", "나눗셈을 곱셈으로 바꾸기", "나누는 분수의 분자와 분모를 바꾸기", "가분수로 바꾸기", "대분수", "1 kg의 가격", "몫이 나누어지는 수보다 커질 수 있어요"];
const FD6S_NOTE = ["🧃 모둠 음료: 매실 주스 [4/5] L를 컵 하나에 [1/5] L씩 따르기", "🚌 버스: 수련원까지 45 km를 [3/4]시간 동안 가요", "🎗️ 팔찌 만들기: 끈 8 m를 [2/3] m씩 자르기", "🫙 보리차: [3/4] L를 부었더니 물통의 [3/5]만큼 찼어요", "🥜 간식: 두 마트의 견과 값 비교하기"];
/* 놀이 친구 활동지: ok가 false인 친구는 나눗셈을 곱셈으로 잘못 계산했어요(지도서 오개념 ④) */
const fd6sF = (name, e, ok) => { const [p, q, r, s] = e, v = ok ? fd6R(p * s, q * r) : fd6R(p * r, q * s); return { name, e, q: fd6Form(v.num, v.den) }; };
const FD6S_SETS = [
  { cards: [2, 3, 5, 7], fr: [fd6sF("서준", [2, 3, 5, 7], true), fd6sF("지안", [2, 3, 5, 7], false), fd6sF("하람", [3, 5, 2, 7], true)] },
  { cards: [3, 4, 5, 8], fr: [fd6sF("서준", [3, 4, 5, 8], true), fd6sF("지안", [5, 8, 3, 4], true), fd6sF("하람", [3, 8, 4, 5], false)] },
  { cards: [2, 5, 6, 9], fr: [fd6sF("서준", [2, 9, 5, 6], true), fd6sF("지안", [5, 6, 2, 9], true), fd6sF("하람", [2, 9, 5, 6], true)] },
  { cards: [3, 4, 7, 10], fr: [fd6sF("서준", [3, 10, 4, 7], false), fd6sF("지안", [7, 10, 3, 4], true), fd6sF("하람", [3, 4, 7, 10], true)] }];
/* 점수 매기기 예시 활동지(이 앱에서 정한 것) */
function fd6sSheet() {
  fd6Style(); fd6Style3();
  const t = h("table", { class: "fd6sheet" }, h("tr", {}, h("th", {}, "친구"), h("th", {}, "만든 나눗셈"), h("th", {}, "쓴 몫")));
  [["서준", "[2/3]÷[5/7]", "[14/15]"], ["지안", "[2/3]÷[5/7]", "[10/21]"], ["하람", "[3/5]÷[2/7]", "[2 1/10]"], ["도현", "[5/7]÷[2/3]", "[10/21]"]]
    .forEach(r => t.append(h("tr", {}, ...r.map(c => h("td", {}, c)))));
  return h("div", {}, h("p", { class: "jua" }, "수 카드 2, 3, 5, 7로 만든 네 친구의 1판 활동지"), t);
}

const LESSONS = [
{
  id: "s1", no: 1, title: "숲속 수련회를 준비해요", soop: "개념 찾기(S)",
  question: "수련회를 준비할 때 분수의 나눗셈을 써야 하는 때는 언제일까요?",
  summary: "수련회 준비 쪽지에는 [4/5] L를 [1/5] L씩 따르기, 8 m를 [2/3] m씩 자르기, [3/4]시간 동안 45 km를 갈 때 1시간 동안 가는 거리처럼 나누는 수가 분수인 나눗셈이 필요한 일이 많아요. [4/5] L에서 [1/5] L를 4번 덜어 낼 수 있으니 [4/5]÷[1/5] = 4예요. 이 단원을 배우기 전에 통분, (분수)×(분수), (자연수)÷(자연수)의 몫을 분수로 나타내기, (분수)÷(자연수)를 떠올려 두어요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "우리 반이 1박 2일 숲속 수련회를 떠나요! 반장 서준이가 나누어 준 준비 쪽지를 보고, 세 칸에 써서 붙여요.", hints: ["쪽지에서 분수가 쓰인 곳을 찾아봐요. ‘~씩 나누기’, ‘~씩 자르기’처럼 나누는 일이 있나요?", "‘1시간 동안’, ‘물통 가득’처럼 1만큼의 양을 구하는 일도 찾아봐요."],
      render: (b, a) => { b.append(fd6sCamp(), fd6sNote("📜 6학년 2반 수련회 준비 쪽지", FD6S_NOTE));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "쪽지에 ~이 보여요", hint: "쪽지에서 보이는 것", ex: ["주스 [4/5] L를 [1/5] L씩 따르는 것처럼 분수를 분수로 나누는 일이 보여요.", "끈 8 m를 [2/3] m씩 자르는 것처럼 자연수를 분수로 나누는 일이 보여요."] },
          { t: "생각해요", e: "💭", ph: "~을 구하려면 ~해야 할 것 같아요", hint: "분수로 계산해야 할 일", ex: ["주스를 몇 컵 따를 수 있는지 구하려면 [4/5]에서 [1/5]을 몇 번 덜어 내는지 세면 될 것 같아요.", "버스가 1시간 동안 가는 거리는 45 km보다 길 것 같아요. [3/4]시간은 1시간보다 짧으니까요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 계산할까?", hint: "분수의 나눗셈에 대해 궁금한 것", ex: ["분모가 다른 분수끼리는 어떻게 나눌까?", "나눗셈을 했는데 몫이 처음 수보다 커질 수도 있을까?"] }],
          { ok: "수련회 준비에는 분수의 나눗셈이 가득해요! 이 단원에서 하나씩 알아봐요." }); } },
    { name: "그려 보기 — 주스 따르기", inst: "유진이네 모둠은 매실 주스 [4/5] L를 컵 하나에 [1/5] L씩 따르려고 해요. 몇 컵을 따를 수 있을까요? 띠를 눌러 [1/5] L씩 덜어 내 보세요.", hints: ["띠를 누를 때마다 [1/5] L씩 덜어 내요.", "[4/5]는 [1/5]이 4개예요."],
      render: thenWhy((b, a) => fd6Scoop(b, a, { A: "4/5", B: "1/5", unit: " L", cnt: "컵", one: "컵", aName: "주스 [4/5] L", bName: "컵 1개 [1/5] L",
        askCalc: [{ lab: "따를 수 있는 컵", x: "[4/5]÷[1/5]", n: 4, unit: "컵", why: { "5": "띠 전체가 아니라 주스가 있는 칸만 덜어 내요. 주스는 [1/5]이 4개예요." } }], ok: "[4/5] L에서 [1/5] L를 4번 덜어 낼 수 있으니 4컵을 따를 수 있어요. 이것을 [4/5]÷[1/5]로 나타내요." }),
        { q: "몇 컵을 따를 수 있는지 왜 나눗셈으로 구할까요?", ph: "전체 주스에서 ~를 몇 번 ~", help: ["① 전체 주스의 양과 한 컵에 따르는 양을 찾아요. → ② 한 컵의 양을 몇 번 덜어 낼 수 있는지 생각해요.", "‘전체 [4/5] L에서 한 컵 ~ L를 몇 번 덜어 낼 수 있는지 구하는 것이라서 ~으로 구해요.’ 꼴로 써요."],
          ans: "전체 주스 [4/5] L에서 한 컵의 양 [1/5] L를 몇 번 덜어 낼 수 있는지 구하는 것이라서 나눗셈 [4/5]÷[1/5]로 구해요." }) },
    { name: "말해 보기 — 수련회 속 나눗셈 찾기", inst: "수련회에서 나눗셈이 필요한 상황이에요. 알맞은 식을 골라 보세요.", hints: ["‘몇 명’, ‘몇 배’, ‘몇 컵’을 구할 때는 나눗셈을 써요.", "전체의 양을 한 번에 쓰는 양으로, 또는 비교하는 양을 기준이 되는 양으로 나누어요."],
      render: (b, a) => quiz(b, a, [
        { q: "공예 시간에 찰흙 [5/6] kg을 한 사람에게 [1/6] kg씩 나누어 주면 몇 명에게 줄 수 있을까요?", o: ["[5/6]÷[1/6]", "[5/6]×[1/6]", "[1/6]÷[5/6]"], a: 0, why: { "1": "곱하면 [5/6] kg보다 적은 양이 돼요. 전체 찰흙을 한 사람에게 주는 양으로 나누어요.", "2": "나누는 순서가 바뀌었어요. 전체 찰흙의 양을 한 사람에게 주는 양으로 나누어요." } },
        { q: "하람이네 모둠은 숲길을 [3/4] km, 도현이네 모둠은 [3/8] km 걸었어요. 하람이네가 걸은 거리는 도현이네가 걸은 거리의 몇 배일까요?", o: ["[3/4]÷[3/8]", "[3/8]÷[3/4]", "[3/4]−[3/8]"], a: 0, why: { "1": "하람이네가 도현이네의 몇 배인지 구하므로 하람이네 거리를 도현이네 거리로 나누어요.", "2": "빼면 얼마나 더 걸었는지를 구하게 돼요. 몇 배인지는 나눗셈으로 구해요." } },
        { q: "물 3 L를 한 컵에 [1/4] L씩 담으면 몇 컵이 될까요?", o: ["3÷[1/4]", "[1/4]÷3", "3×[1/4]"], a: 0, why: { "1": "[1/4]÷3은 [1/4] L를 셋으로 나눈 양이에요. 3 L에 [1/4] L가 몇 번 들어가는지 구해요.", "2": "곱하면 3 L보다 적은 양이 돼요. 3 L를 한 컵의 양으로 나누어요." } }],
        { ok: "나누는 수가 분수인 나눗셈이 수련회 곳곳에 있어요." }) },
    { name: "약속하기 — 통분과 곱셈 떠올리기", inst: "5학년 때 배운 통분과 (분수)×(분수)를 떠올려요.", hints: ["[2/5]와 [3/4]은 분모의 곱 20으로 통분할 수 있어요.", "[5/6]와 [4/9]의 분모의 최소공배수는 18이에요. (분수)×(분수)는 분자는 분자끼리, 분모는 분모끼리 곱해요."],
      render: (b, a) => fd6Chain(b, a, [
        ["([2/5], [3/4])를 통분하면 (", { q: [null, "?8", "20"] }, ", ", { q: [null, "?15", "20"] }, ")"],
        ["([5/6], [4/9])를 최소공배수로 통분하면 (", { q: [null, "?15", "18"] }, ", ", { q: [null, "?8", "18"] }, ")"],
        ["[3/4]×[2/7] = ", { q: [null, ["3", "×", "?2"], ["4", "×", "?7"]] }, " = ", { q: [null, "?3", "14"] }]],
        { ok: "통분과 분수의 곱셈을 잘 기억하고 있어요. 분수의 나눗셈에서 자주 써요.", bad: "통분은 분모와 분자에 같은 수를 곱해 분모를 같게 하는 것이에요. 곱셈은 분자끼리, 분모끼리 곱해요." }) },
    { name: "확인하기 — 나눗셈 떠올리기", inst: "6학년 1학기에 배운 (자연수)÷(자연수)의 몫을 분수로 나타내기와 (분수)÷(자연수)를 떠올려요.", hints: ["4÷7의 몫은 [4/7]예요. ■÷▲ = [■/▲]예요.", "[2/5]÷3은 [2/5]×[1/3]로 계산할 수 있어요."],
      render: (b, a) => fd6Chain(b, a, [
        ["4÷7 = ", { q: [null, "?4", "?7"] }],
        ["9÷4 = ", { q: [null, "?9", "4"] }, " = ", { q: ["?2", "?1", "4"] }],
        ["[6/7]÷3 = ", { q: [null, ["6", "÷", "?3"], "7"] }, " = ", { q: [null, "?2", "7"] }],
        ["[2/5]÷3 = [2/5]×", { q: [null, "?1", "?3"] }, " = ", { q: [null, "?2", "15"] }]],
        { ok: "(자연수)÷(자연수)와 (분수)÷(자연수)를 잘 기억하고 있어요. 이제 나누는 수가 분수인 나눗셈을 배워요." }) }
  ],
  challenge: { inst: "★ 도전 — 지금까지 배운 계산과 이 단원에서 새로 배울 계산으로 나누어 보세요.", hints: ["나누는 수가 자연수인 나눗셈은 6학년 1학기에 배웠어요.", "나누는 수가 분수인 나눗셈은 이 단원에서 배워요."],
    render: (b, a) => fd6Sort(b, a, { bins: ["이미 배웠어요", "이 단원에서 배워요"], cards: [
      { t: "[6/7]÷3", k: 0 }, { t: "4÷9", k: 0 }, { t: "[2/3]×[1/4]", k: 0 },
      { t: "[5/8]÷[3/8]", k: 1 }, { t: "8÷[2/5]", k: 1 }, { t: "[2 1/3]÷[1/2]", k: 1 }],
      bad: "나누는 수를 살펴봐요. 나누는 수가 분수이면 이 단원에서 배워요.", ok: "나누는 수가 분수인 나눗셈을 이 단원에서 배워요. 계산 방법과 그 원리를 알아봐요!" }) }
},
{
  id: "s2", no: 2, title: "찰흙과 피자 ― 분모가 같은 (분수)÷(분수) ⑴", soop: "개념 구축하기(O)",
  question: "분모가 같고 분자끼리 나누어떨어지는 (분수)÷(분수)는 어떻게 계산할까요?",
  summary: "[5/6]÷[1/6]은 [5/6]에서 [1/6]을 몇 번 덜어 낼 수 있는지와 같아요. [5/6]는 [1/6]이 5개이므로 [5/6]÷[1/6] = 5예요. [6/7]은 [1/7]이 6개, [2/7]는 [1/7]이 2개이므로 [6/7]÷[2/7] = 6÷2 = 3이에요. 분모가 같은 (분수)÷(분수)는 분자끼리 나누어 계산합니다.",
  steps: [
    { name: "만져 보기 — 찰흙 나누기", inst: "수련회 첫날 공예 시간이에요. 민서는 찰흙 [5/6] kg을 친구 한 명에게 [1/6] kg씩 나누어 주려고 해요. 띠를 눌러 [1/6] kg씩 덜어 내 보세요.", hints: ["띠를 누를 때마다 한 명에게 [1/6] kg씩 나누어 주어요.", "[5/6]는 [1/6]이 몇 개일까요?"],
      render: (b, a) => fd6Scoop(b, a, { A: "5/6", B: "1/6", unit: " kg", cnt: "명", one: "사람", aName: "찰흙 [5/6] kg", bName: "한 명 [1/6] kg", ask: [
        ["구하는 식: ", { c: ["[5/6]÷[1/6]", "[5/6]×[1/6]", "[1/6]÷[5/6]"], a: 0 }],
        ["[5/6] kg은 [1/6] kg이 ", { i: "5" }, "개예요. [1/6] kg씩 ", { i: "5" }, "번 덜어 낼 수 있어요."],
        ["[5/6]÷[1/6] = ", { i: "5" }],
        ["찰흙을 ", { i: "5" }, "명에게 나누어 줄 수 있어요."]], ok: "[5/6]÷[1/6] = 5예요. 찰흙을 5명에게 나누어 줄 수 있어요." }) },
    { name: "그려 보기 — [6/7]÷[2/7]", inst: "이번에는 [6/7]÷[2/7]를 알아봐요. 먼저 계산 규칙을 예상한 다음, 띠에서 [2/7]씩 덜어 내 보세요.", hints: ["[6/7]은 [1/7]이 6개, [2/7]는 [1/7]이 2개예요.", "[1/7]이 6개인 것을 2개씩 묶으면 몇 묶음일까요?"],
      render: ruleFirst((b, a) => fd6Scoop(b, a, { A: "6/7", B: "2/7", ask: [
        ["[6/7]은 [1/7]이 ", { i: "6" }, "개이고, [2/7]는 [1/7]이 ", { i: "2" }, "개예요."],
        ["[6/7]은 [2/7]가 ", { i: "3" }, "개예요."],
        ["[6/7]÷[2/7] = ", { i: "6" }, "÷", { i: "2" }, " = ", { i: "3" }]], ok: "[6/7]÷[2/7]는 분자끼리 나눈 6÷2와 같아요. 몫은 3이에요." }),
        { q: "분모가 같은 (분수)÷(분수)는 어떻게 계산할까요?", ph: "내 규칙: 분모가 같으면 ~", help: ["① [6/7]과 [2/7]가 각각 [1/7]이 몇 개인지 생각해요. → ② 분모와 분자 가운데 어느 것끼리 계산하면 되는지 생각해요.", "‘내 규칙: 분모가 같으면 ~끼리 나누어요.’ 꼴로 써요."],
          ans: "분모가 같으면 분자끼리 나누어요. [6/7]÷[2/7] = 6÷2 = 3이에요." }) },
    { name: "말해 보기 — 피자 나누기", inst: "저녁에 모둠 피자가 왔어요. 8조각 피자 중 6조각, 곧 [6/8]판이 남았어요. 한 사람에게 [2/8]판씩 나누어 주려고 해요. 그림을 눌러 나누어 주고, 몇 명에게 줄 수 있는지 설명해 보세요.", hints: ["원을 누를 때마다 한 사람에게 [2/8]판씩 나누어 주어요.", "[6/8]은 [1/8]이 6개, [2/8]는 [1/8]이 2개예요."],
      render: thenWhy((b, a) => fd6Pie(b, a, { A: "6/8", B: "2/8", cnt: "명", one: "사람", aName: "피자 [6/8]판", bName: "[2/8]판", ask: [
        ["식: [6/8]÷[2/8] = ", { i: "3" }],
        ["설명: [6/8]은 [1/8]이 ", { i: "6" }, "개, [2/8]는 [1/8]이 ", { i: "2" }, "개이므로 6÷2를 계산하면 ", { c: ["3명", "4명", "2명"], a: 0 }, "에게 나누어 줄 수 있어요."]], ok: "[6/8]÷[2/8] = 6÷2 = 3이에요. 3명에게 나누어 줄 수 있어요." }),
        { q: "분모가 같을 때 분자끼리만 나누어도 되는 까닭은 무엇일까요?", ph: "분모가 같으면 두 분수가 같은 크기의 ~", help: ["① [6/8]과 [2/8]가 어떤 크기의 조각으로 되어 있는지 살펴봐요. → ② 분자가 무엇을 나타내는지 생각해요.", "‘분모가 같으면 두 분수가 모두 [1/8] 조각으로 되어 있어서, 조각 수인 ~끼리 나누면 돼요.’ 꼴로 써요."],
          ans: "분모가 같으면 두 분수가 모두 같은 크기의 조각([1/8])으로 되어 있어서, 조각의 수인 분자끼리 나누면 몇 번 덜어 낼 수 있는지 알 수 있어요." }) },
    { name: "약속하기 — 분모가 같은 (분수)÷(분수)", inst: "찰흙과 피자에서 찾은 계산 방법을 약속해요.", hints: ["[6/7]÷[2/7] = 6÷2에서 분모 7은 어떻게 되었나요?"],
      render: (b, a) => blanks(b, a, ["분모가 같은 (분수)÷(분수)는 ", { o: ["분자끼리 나누어", "분모끼리 나누어", "분자끼리 곱하여"], a: 0 }, " 계산합니다. [■/●]÷[▲/●] = ", { o: ["■÷▲", "●÷●", "■×▲"], a: 0 }], { ok: "분모가 같은 (분수)÷(분수)는 분자끼리 나누어 계산합니다." }) },
    { name: "확인하기 — 공예 재료 계산", inst: "계산해 보세요.", hints: ["분모가 같으니 분자끼리 나누어요.", "[12/13]÷[2/13] = 12÷2예요."],
      render: (b, a) => fd6Calc(b, a, [
        { e: "[4/5]÷[1/5]", n: 4 }, { e: "[9/11]÷[3/11]", n: 3 },
        { e: "[8/9]÷[4/9]", n: 2, why: { "32": "곱하면 안 돼요. 분자끼리 나누어 8÷4를 계산해요.", "4": "8에서 4를 빼면 안 돼요. 8÷4를 계산해요." } }, { e: "[12/13]÷[2/13]", n: 6 },
        { q: "하람이는 리본 [10/11] m를 [2/11] m씩 잘라 이름표를 꾸며요. 이름표를 몇 개 꾸밀 수 있을까요?", x: "[10/11]÷[2/11]", n: 5, unit: "개", lab: "[10/11]÷[2/11] =" }]) }
  ],
  challenge: { inst: "★ 도전 — 수련회 퀴즈를 풀어 보세요.", hints: ["분모가 같으니 분자끼리 나누어요.", "[14/15]÷[2/15] = 14÷2 = 7이에요. 7보다 작은 자연수 중 가장 큰 수는?"],
    render: (b, a) => fd6Calc(b, a, [
      { q: "몫이 3인 것을 골라요.", pick: ["㉠ [6/7]÷[3/7]", "㉡ [9/10]÷[3/10]", "㉢ [8/13]÷[2/13]"], a: 1, why: { "0": "6÷3 = 2예요.", "2": "8÷2 = 4예요." } },
      { q: "[14/15]÷[2/15] > □ 에서 □ 안에 들어갈 수 있는 가장 큰 자연수는?", n: 6, lab: "□ =", why: { "7": "몫은 7이에요. 7보다 작아야 하니 7은 들어갈 수 없어요." } }]) }
},
{
  id: "s3", no: 3, title: "레모네이드 컵 ― 분모가 같은 (분수)÷(분수) ⑵", soop: "개념 구축하기(O)",
  question: "분모가 같고 분자끼리 나누어떨어지지 않는 (분수)÷(분수)는 어떻게 계산할까요?",
  summary: "레모네이드 [7/8] L를 [3/8] L 컵에 담으면 2컵과 1컵의 [1/3]만큼, 곧 [2 1/3]컵이 돼요. [8/11]÷[3/11]은 [1/11]이 8개인 것을 3개씩 묶는 것과 같아 8÷3 = [8/3] = [2 2/3]예요. 분자끼리 나누어떨어지지 않으면 몫을 분수로 나타내요. 대분수로 나타내지 않아도 돼요. 나누는 수가 더 크면 몫은 1보다 작아요.",
  steps: [
    { name: "만져 보기 — 레모네이드 담기", inst: "도현이네 모둠이 레모네이드 [7/8] L를 만들었어요. 들이가 [3/8] L인 컵에 모두 옮겨 담으면 몇 컵이 될까요? 띠를 눌러 [3/8] L씩 담아 보세요.", hints: ["세 칸이 한 컵이에요. 남은 한 칸은 한 컵의 얼마만큼일까요?", "한 컵은 세 칸이니, 한 칸은 한 컵의 [1/3]이에요."],
      render: (b, a) => fd6Scoop(b, a, { A: "7/8", B: "3/8", unit: " L", cnt: "컵", one: "컵", aName: "레모네이드 [7/8] L", bName: "컵 1개 [3/8] L", ask: [
        ["구하는 식: ", { c: ["[7/8]÷[3/8]", "[3/8]÷[7/8]", "[7/8]×[3/8]"], a: 0 }],
        ["", { i: "2" }, "컵과 1컵의 ", { q: [null, "?1", "?3"] }, "만큼이 돼요."],
        ["[7/8]÷[3/8] = ", { q: ["?2", "?1", "3"] }]], ok: "레모네이드를 모두 옮겨 담으면 [2 1/3]컵이 돼요." }) },
    { name: "그려 보기 — 나누어떨어지지 않을 때", inst: "[8/11]÷[3/11]을 알아봐요. [3/11]씩 묶고, 남는 부분이 한 묶음의 얼마만큼인지 살펴보세요.", hints: ["[3/11]씩 2번 묶으면 [2/11]가 남아요.", "남는 2칸은 한 묶음(3칸)의 [2/3]예요."],
      render: thenWhy((b, a) => fd6Scoop(b, a, { A: "8/11", B: "3/11", ask: [
        ["[8/11]은 [3/11]씩 ", { i: "2" }, "번 묶을 수 있어요. 남는 부분은 [3/11]의 ", { q: [null, "?2", "?3"] }, "이에요."],
        ["[8/11]÷[3/11] = ", { i: "8" }, "÷", { i: "3" }, " = ", { q: [null, "?8", "3"] }, " = ", { q: ["?2", "?2", "3"] }]], ok: "[8/11]÷[3/11] = 8÷3 = [8/3] = [2 2/3]예요. 분자끼리 나누고, 나누어떨어지지 않으면 몫을 분수로 나타내요." }),
        { q: "분자끼리 나누어떨어지지 않을 때 몫을 어떻게 나타낼까요?", ph: "8÷3의 몫을 ~처럼 ~", help: ["① 6학년 1학기에 (자연수)÷(자연수)의 몫을 어떻게 나타냈는지 떠올려요. → ② 8÷3을 분수로 나타내 봐요.", "‘8÷3의 몫을 [8/3]처럼 ~로 나타내요. 대분수로 바꾸면 ~이에요.’ 꼴로 써요."],
          ans: "분자끼리 나눈 8÷3의 몫을 [8/3]처럼 분수로 나타내요. 대분수로 바꾸면 [2 2/3]예요." }) },
    { name: "말해 보기 — 나누는 수가 더 크면?", inst: "[4/7]÷[5/7]처럼 나누는 수가 더 크면 어떻게 될까요? 띠를 눌러 덜어 내 보고, 몫이 1보다 큰지 작은지 이야기해 보세요.", hints: ["[5/7]만큼은 한 번도 덜어 낼 수 없어요. 남은 부분이 한 묶음의 얼마만큼인지 보세요.", "[4/7]는 [5/7]의 [4/5]만큼이에요."],
      render: thenWhy((b, a) => fd6Scoop(b, a, { A: "4/7", B: "5/7", ask: [
        ["[4/7]는 [5/7]의 ", { q: [null, "?4", "?5"] }, "만큼이에요."],
        ["[4/7]÷[5/7] = ", { i: "4" }, "÷", { i: "5" }, " = ", { q: [null, "?4", "5"] }],
        ["나누는 수가 나누어지는 수보다 크면 몫은 ", { c: ["1보다 작아요", "1보다 커요"], a: 0 }, "."]], ok: "[4/7]÷[5/7] = 4÷5 = [4/5]예요. 나누는 수가 더 크면 몫은 1보다 작아요." }),
        { q: "[4/7]÷[5/7]의 몫이 1보다 작은 까닭을 써 봐요.", ph: "[5/7]를 한 번도 ~", help: ["① [4/7]에서 [5/7]를 한 번이라도 덜어 낼 수 있는지 생각해요. → ② 그래서 몫이 1보다 큰지 작은지 정해요.", "‘[4/7]는 [5/7]보다 작아서 한 번도 덜어 낼 수 없으니 몫은 1보다 ~아요.’ 꼴로 써요."],
          ans: "[4/7]는 [5/7]보다 작아서 [5/7]를 한 번도 덜어 낼 수 없어요. 한 묶음의 [4/5]만큼만 되니 몫은 1보다 작아요." }) },
    { name: "약속하기 — 나누어떨어지지 않는 (분수)÷(분수)", inst: "레모네이드에서 찾은 계산 방법을 정리해요.", hints: ["8÷3의 몫은 [8/3]처럼 분수로 나타낼 수 있어요."],
      render: (b, a) => blanks(b, a, ["분모가 같은 (분수)÷(분수)는 ", { o: ["분자끼리 나누어", "분모끼리 나누어"], a: 0 }, " 계산해요. 분자끼리 나누어떨어지지 않으면 몫을 ", { o: ["분수로", "소수로만"], a: 0 }, " 나타내요. [■/●]÷[▲/●] = ■÷▲ = ", { o: ["[■/▲]", "[▲/■]"], a: 0 }, "이고, 대분수로 나타내지 않아도 돼요."], { ok: "분모가 같은 (분수)÷(분수)는 분자끼리 나누어 계산하고, 나누어떨어지지 않으면 몫을 분수로 나타내요." }) },
    { name: "확인하기 — 요리 재료 계산", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["분자끼리 나누어요. 2÷5 = [2/5]예요.", "9÷7 = [9/7] = [1 2/7]예요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[2/7]÷[5/7]", a: "2/5", why: { "5/2": "나누는 순서가 바뀌었어요. 2÷5예요.", "2 1/2": "나누는 순서가 바뀌었어요. 2÷5예요." } }, { e: "[5/12]÷[7/12]", a: "5/7" }, { e: "[9/10]÷[7/10]", a: "1 2/7" }, { e: "[11/13]÷[4/13]", a: "2 3/4" },
        { q: "모둠 요리에 쌀 [11/12] kg이 있어요. 냄비 하나에 쌀을 [5/12] kg씩 넣으면 몇 냄비가 될까요?", x: "[11/12]÷[5/12]", a: "2 1/5", unit: "냄비", lab: "[11/12]÷[5/12] =" }]) }
  ],
  challenge: { inst: "★ 도전 — 수 카드 3, 4, 5, 6, 7 중 1장을 골라 □ 안에 써넣어, 첫째 판에는 몫이 가장 큰 나눗셈을, 둘째 판에는 몫이 가장 작은 나눗셈을 만들고 계산해 보세요.", hints: ["분모가 같으니 8÷□를 생각해요. 나누는 수가 작을수록 몫이 커요.", "8÷3 = [8/3], 8÷7 = [8/7]이에요."],
    render: (b, a) => fd6Build(b, a, { cards: [3, 4, 5, 6, 7], tip: "수 카드를 누른 다음 □를 눌러 넣고, 몫을 써요. 다 쓰면 저절로 확인해요.", boards: [
      { shape: [[8, 9], [null, 9]], goal: "max", label: "① 몫이 가장 큰 나눗셈" },
      { shape: [[8, 9], [null, 9]], goal: "min", label: "② 몫이 가장 작은 나눗셈" }], ok: "나누는 수가 작을수록 몫이 커요. [8/9]÷[3/9] = [8/3] = [2 2/3], [8/9]÷[7/9] = [8/7] = [1 1/7]이에요." }) }
},
{
  id: "s4", no: 4, title: "숲길 걷기 ― 분모가 다른 (분수)÷(분수)", soop: "개념 구축하기(O)",
  question: "분모가 다른 (분수)÷(분수)는 어떻게 계산할까요?",
  summary: "솔숲 길 [2/3] km가 개울 길 [1/6] km의 몇 배인지 구하려면 [2/3]÷[1/6]을 계산해요. [2/3]는 [4/6]와 같고 [4/6]는 [1/6]이 4개이므로 4배예요. 분모가 다른 (분수)÷(분수)는 통분한 다음 분자끼리 나누어 계산해요. [3/4]÷[2/5] = [15/20]÷[8/20] = 15÷8 = [15/8] = [1 7/8].",
  steps: [
    { name: "만져 보기 — 솔숲 길과 개울 길", inst: "둘째 날 아침, 숲길 걷기를 해요. 솔숲 길은 [2/3] km, 개울 길은 [1/6] km예요. 솔숲 길은 개울 길의 몇 배일까요? 두 띠의 칸 크기가 달라요. 먼저 칸을 나누어 크기를 같게 한 다음 덜어 내 보세요.", hints: ["[1/3]을 똑같이 2칸으로 나누면 한 칸은 [1/6]이에요.", "[2/3]는 [1/6]이 몇 개일까요?"],
      render: (b, a) => fd6Scoop(b, a, { A: "2/3", B: "1/6", unit: " km", cnt: "배", one: "묶음", aName: "솔숲 길 [2/3] km", bName: "개울 길 [1/6] km", ask: [
        ["구하는 식: ", { c: ["[2/3]÷[1/6]", "[1/6]÷[2/3]", "[2/3]×[1/6]"], a: 0 }],
        ["[2/3] = ", { q: [null, "?4", "6"] }, "이고, [4/6]는 [1/6]이 ", { i: "4" }, "개예요."],
        ["[2/3]÷[1/6] = ", { i: "4" }],
        ["솔숲 길은 개울 길의 ", { i: "4" }, "배예요."]], ok: "[2/3]를 [4/6]로 통분하니 분자끼리 나눌 수 있어요. 솔숲 길은 개울 길의 4배예요." }) },
    { name: "그려 보기 — [3/4]÷[2/5]", inst: "[3/4]÷[2/5]를 알아봐요. 분모가 다를 때에는 어떻게 할까요? 먼저 규칙을 예상한 다음, 두 띠의 한 칸이 모두 [1/20]이 되게 나누고 덜어 내 보세요.", hints: ["[1/4]을 5칸으로, [1/5]을 4칸으로 나누면 한 칸은 [1/20]이에요.", "[15/20]에서 [8/20]을 한 번 덜어 내면 7칸이 남아요."],
      render: ruleFirst((b, a) => fd6Scoop(b, a, { A: "3/4", B: "2/5", ask: [
        ["[3/4]÷[2/5] = ", { q: [null, "?15", "20"] }, "÷", { q: [null, "?8", "20"] }, " = ", { i: "15" }, "÷", { i: "8" }, " = ", { q: [null, "?15", "?8"] }, " = ", { q: ["?1", "?7", "8"] }],
        ["분모가 다르면 먼저 ", { c: ["통분하여 분모를 같게 해요", "분자끼리 바로 나누어요"], a: 0 }, "."]], ok: "분모가 다르면 통분한 다음 분자끼리 나누어요. [3/4]÷[2/5] = [15/8] = [1 7/8]이에요." }),
        { q: "분모가 다른 (분수)÷(분수)는 어떻게 계산할까요?", ph: "내 규칙: 분모가 다르면 먼저 ~", help: ["① 지난 시간에 분모가 같을 때 어떻게 계산했는지 떠올려요. → ② 분모가 다르면 무엇을 먼저 하면 분모가 같아질지 생각해요.", "‘내 규칙: 분모가 다르면 먼저 ~하여 분모를 같게 한 다음 ~끼리 나누어요.’ 꼴로 써요."],
          ans: "분모가 다르면 먼저 통분하여 분모를 같게 한 다음 분자끼리 나누어요. [3/4]÷[2/5] = [15/20]÷[8/20] = 15÷8 = [15/8]예요." }) },
    { name: "말해 보기 — 문제 만들기", inst: "보기의 분수 중 서로 다른 두 개를 골라 문제를 완성하고, 답을 구해 보세요. 만든 문제는 짝과 바꾸어 풀어 봐요.", hints: ["보리차의 양을 생수의 양으로 나누어요.", "통분한 다음 분자끼리 나누어요. 예: [2/3]÷[3/4] = [8/12]÷[9/12] = 8÷9"],
      render: thenWhy((b, a) => fd6Pose(b, a, { fr: ["1/2", "3/5", "2/3", "3/4"], l1: "보리차:", l2: "생수:", s: ["보온병에 보리차가 ", " L, 물병에 생수가 ", " L 있어요. 보리차의 양은 생수의 양의 몇 배인가요?"], ansLab: "답:", unit: "배", ok: "문제를 완성하고 답을 구했어요." }),
        { q: "내가 만든 문제를 어떻게 풀었는지 짝에게 설명해 봐요.", ph: "두 분수의 분모가 달라서 먼저 ~", help: ["① 두 분수의 분모가 같은지 다른지 살펴봐요. → ② 통분한 분수와 분자끼리 나눈 식을 차례대로 말해요.", "‘분모가 달라서 먼저 ~로 통분했어요. 그다음 ~÷~를 계산해 ~배예요.’ 꼴로 써요."],
          ans: "두 분수의 분모가 달라서 먼저 통분했어요. 예를 들어 [2/3]÷[3/4]이면 [8/12]÷[9/12]로 바꾼 다음 분자끼리 나누어 8÷9 = [8/9]배예요." }) },
    { name: "약속하기 — 분모가 다른 (분수)÷(분수)", inst: "숲길에서 찾은 계산 방법을 약속해요.", hints: ["[3/4]÷[2/5]는 [15/20]÷[8/20]로 바꾸었어요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 (분수)÷(분수)는 ", { o: ["통분하여", "약분하여"], a: 0 }, " 분모를 같게 한 다음 ", { o: ["분자끼리 나누어", "분모끼리 나누어"], a: 0 }, " 계산합니다."], { ok: "분모가 다른 (분수)÷(분수)는 통분한 다음 분자끼리 나누어 계산합니다." }) },
    { name: "확인하기 — 숲길 계산", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도, 약분하지 않아도 맞아요.", hints: ["[5/6]÷[5/12] = [10/12]÷[5/12]예요.", "[7/9]÷[5/6] = [14/18]÷[15/18]예요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[5/6]÷[5/12]", n: 2, why: { "1": "분모가 다른데 분자끼리만 나누었어요. 먼저 통분해요." } }, { e: "[4/5]÷[1/3]", a: "2 2/5" }, { e: "[3/8]÷[1/2]", a: "3/4" }, { e: "[7/9]÷[5/6]", a: "14/15" },
        { q: "계곡 길은 [5/6] km, 솔숲 길은 [2/3] km예요. 계곡 길은 솔숲 길의 몇 배일까요?", x: "[5/6]÷[2/3]", a: "1 1/4", unit: "배", lab: "[5/6]÷[2/3] =" }]) }
  ],
  challenge: { inst: "★ 도전 — 숲길 퀴즈를 풀어 보세요.", hints: ["몫을 하나씩 계산해 비교해요. ㉡ [5/6]÷[2/9] = [15/18]÷[4/18]", "나누는 수가 작을수록 몫이 커요."],
    render: (b, a) => fd6Calc(b, a, [
      { q: "몫이 가장 큰 것을 골라요.", pick: ["㉠ [3/5]÷[3/10]", "㉡ [5/6]÷[2/9]", "㉢ [7/8]÷[3/4]"], a: 1, why: { "0": "㉠ = 2, ㉡ = [15/4] = [3 3/4], ㉢ = [7/6] = [1 1/6]이에요.", "2": "㉠ = 2, ㉡ = [15/4] = [3 3/4], ㉢ = [7/6] = [1 1/6]이에요." } },
      { q: "수 카드 3, 4, 5, 6 중 1장을 골라 [5/8]÷[□/7]의 □ 안에 써넣어 몫이 가장 큰 (진분수)÷(진분수)를 만들려고 해요. 어떤 카드를 넣을까요?", pick: ["3", "4", "5", "6"], a: 0, why: { "1": "나누는 수가 작을수록 몫이 커요. 4보다 작은 카드가 있어요.", "2": "나누는 수가 작을수록 몫이 커요. 가장 작은 카드를 넣어요.", "3": "6을 넣으면 몫이 가장 작아요. 나누는 수가 작을수록 몫이 커요." } },
      { q: "그때의 몫을 구해 보세요.", e: "[5/8]÷[3/7]", a: "1 11/24" }]) }
},
{
  id: "s5", no: 5, title: "수련원 가는 버스 ― (자연수)÷(분수)", soop: "개념 구축하기(O)",
  question: "(자연수)÷(분수)는 어떻게 계산할까요?",
  summary: "버스가 45 km를 가는 데 [3/4]시간이 걸렸다면 1시간 동안 가는 거리는 45÷[3/4]이에요. [1/4]시간 동안 45÷3 = 15 (km), 1시간 동안 15×4 = 60 (km)를 가요. (자연수)÷(분수)는 자연수를 분수의 분자로 나누고 분모를 곱하여 계산하거나, 자연수를 나누는 수와 분모가 같은 분수로 바꾼 다음 분자끼리 나누어 계산해요. 45÷[3/4] = (45÷3)×4 = 60, 45÷[3/4] = [180/4]÷[3/4] = 180÷3 = 60. 1보다 작은 수로 나누면 몫이 나누어지는 수보다 커요.",
  steps: [
    { name: "만져 보기 — 버스는 1시간에 몇 km?", inst: "수련원 가는 버스가 일정한 빠르기로 45 km를 가는 데 [3/4]시간이 걸렸어요. 같은 빠르기로 1시간 동안 몇 km를 갈 수 있을까요? 먼저 쉬운 수로 어림한 다음, 아래 수직선의 표시를 [1/4]시간, 1시간으로 차례로 옮겨 보세요.", hints: ["[1/4]시간은 [3/4]시간을 3으로 나눈 것과 같아요.", "1시간은 [1/4]시간을 4배 한 것과 같아요."],
      render: thenWhy((b, a) => fd6Double(b, a, { items: [{ Q: "45", a: 3, b: 4, top: " km", bot: "시간", name: "수련원 가는 버스" }],
        est: { q: "45 km를 가는 데 3시간이 걸렸다면 1시간 동안 몇 km를 갈까요?", o: ["15 km", "135 km", "48 km"], a: 0, why: { "1": "1시간은 3시간보다 짧아요. 45÷3을 계산해요.", "2": "45에 3을 더하면 안 돼요. 45÷3을 계산해요." }, ok: "45÷3 = 15, 1시간 동안 15 km예요. 3시간 대신 [3/4]시간이면 식은 45÷[3/4]이에요." },
        ask: [
          ["구하는 식: ", { c: ["45÷[3/4]", "45×[3/4]", "[3/4]÷45"], a: 0 }],
          ["[1/4]시간 동안: 45÷", { i: "3" }, " = ", { i: "15" }, " (km)"],
          ["1시간 동안: 15×", { i: "4" }, " = ", { i: "60" }, " (km)"]], ok: "버스는 1시간 동안 60 km를 갈 수 있어요. 45를 [3/4]으로 나누었더니 몫이 45보다 커졌어요!" }),
        { q: "45÷[3/4]의 몫이 45보다 커진 까닭은 무엇일까요?", ph: "[3/4]시간은 1시간보다 ~", help: ["① [3/4]시간과 1시간의 길이를 견주어요. → ② 짧은 시간에 45 km를 갔다면 1시간 동안은 어떨지 생각해요.", "‘[3/4]시간은 1시간보다 ~아서, 1시간 동안은 45 km보다 ~ 가요.’ 꼴로 써요."],
          ans: "[3/4]시간은 1시간보다 짧아요. 짧은 시간에 45 km를 갔으니 1시간 동안은 45 km보다 더 멀리 가요. 그래서 1보다 작은 수로 나누면 몫이 커져요." }) },
    { name: "그려 보기 — 두 가지 방법", inst: "그림에서 알아낸 것을 이용하여 45÷[3/4]을 두 가지 방법으로 계산해 보세요.", hints: ["그림 이용: 자연수 45를 분자 3으로 나누고 분모 4를 곱해요.", "45 = [180/4]이에요."],
      render: (b, a) => fd6Chain(b, a, [
        { t: "그림 이용", p: ["45÷[3/4] = (45÷", { i: "3" }, ")×", { i: "4" }, " = ", { i: "60" }] },
        { t: "분수로 바꾸기", p: ["45÷[3/4] = ", { q: [null, "?180", "4"] }, "÷[3/4] = ", { i: "180" }, "÷", { i: "3" }, " = ", { i: "60" }] },
        ["첫째 방법은 자연수를 분수의 ", { c: ["분자로 나누고 분모를 곱했어요", "분모로 나누고 분자를 곱했어요"], a: 0 }, "."],
        ["둘째 방법은 자연수를 ", { c: ["나누는 수와 분모가 같은 분수로 바꾸고 분자끼리 나누었어요", "자연수끼리 곱했어요"], a: 0 }, "."]],
        { ok: "두 방법 모두 45÷[3/4] = 60이에요." }) },
    { name: "말해 보기 — 팔찌 끈 자르기", inst: "저녁에 팔찌를 만들어요. 지안이는 끈 8 m를 [2/3] m씩 잘라 팔찌를 만들려고 해요. 1 m를 똑같이 나누어 [2/3] m씩 덜어 내 보고, 팔찌를 몇 개 만들 수 있는지 구해 보세요.", hints: ["1 m를 똑같이 3칸으로 나누면 한 칸은 [1/3] m예요.", "8÷[2/3] = (8÷2)×3이에요."],
      render: (b, a) => fd6Scoop(b, a, { A: "8", B: "2/3", unit: " m", word: "팔찌", aName: "끈 8 m", bName: "팔찌 1개 [2/3] m", ask: [
        ["8÷[2/3] = (8÷", { i: "2" }, ")×", { i: "3" }, " = ", { i: "12" }],
        ["팔찌를 ", { i: "12" }, "개 만들 수 있어요."]], ok: "8÷[2/3] = 12예요. 팔찌 12개를 만들 수 있어요." }) },
    { name: "약속하기 — (자연수)÷(분수)", inst: "버스와 팔찌에서 찾은 계산 방법을 정리해요.", hints: ["45÷[3/4] = (45÷3)×4, 45÷[3/4] = [180/4]÷[3/4]을 떠올려요."],
      render: (b, a) => blanks(b, a, ["(자연수)÷(분수)는 자연수를 분수의 ", { o: ["분자로 나누고 분모를 곱하여", "분모로 나누고 분자를 곱하여"], a: 0 }, " 계산하거나, 자연수를 나누는 수와 ", { o: ["분모가 같은 분수로", "분자가 같은 분수로"], a: 0 }, " 바꾼 다음 분자끼리 나누어 계산해요."], { ok: "(자연수)÷(분수)를 두 가지 방법으로 계산할 수 있어요." }) },
    { name: "확인하기 — 수련원 계산", inst: "계산해 보세요.", hints: ["6÷[1/4] = (6÷1)×4예요.", "15÷[3/7] = (15÷3)×7이에요."],
      render: (b, a) => fd6Calc(b, a, [
        { e: "6÷[1/4]", n: 24, why: { "1 1/2": "곱셈을 했어요. 6을 분자 1로 나누고 분모 4를 곱해요.", "3/2": "곱셈을 했어요. 6을 분자 1로 나누고 분모 4를 곱해요." } }, { e: "4÷[2/5]", n: 10 },
        { e: "10÷[5/6]", n: 12 }, { e: "15÷[3/7]", n: 35 },
        { q: "물 3 L를 한 컵에 [3/10] L씩 나누어 담으면 몇 컵이 될까요?", x: "3÷[3/10]", n: 10, unit: "컵", lab: "3÷[3/10] =" }]) }
  ],
  challenge: { inst: "★ 도전 — 버스 퀴즈를 풀어 보세요.", hints: ["50÷[5/6] = (50÷5)×6이에요.", "8÷[□/9] = (8÷□)×9 = [72/□]이 자연수가 되려면 □는 72의 약수예요."],
    render: (b, a) => fd6Calc(b, a, [
      { q: "몫이 다른 것을 골라요.", pick: ["㉠ 6÷[2/5]", "㉡ 9÷[3/5]", "㉢ 12÷[3/4]", "㉣ 10÷[2/3]"], a: 2, why: { "0": "6÷[2/5] = (6÷2)×5 = 15예요. ㉡, ㉣도 15예요.", "1": "9÷[3/5] = (9÷3)×5 = 15예요. ㉠, ㉣도 15예요.", "3": "10÷[2/3] = (10÷2)×3 = 15예요. ㉠, ㉡도 15예요." } },
      { q: "돌아오는 버스는 50 km를 가는 데 [5/6]시간이 걸렸어요. 같은 빠르기로 1시간 동안 몇 km를 갈까요?", x: "50÷[5/6]", n: 60, unit: "km", lab: "50÷[5/6] =" },
      { q: "8÷[□/9]의 몫이 자연수일 때, □ 안에 들어갈 수 있는 9보다 작은 자연수를 모두 고른 것은?", pick: ["1, 2, 3, 4, 6, 8", "2, 4, 6, 8", "1, 2, 3, 4, 6", "1, 3, 9"], a: 0, why: { "1": "8÷[1/9] = 72, 8÷[3/9] = 24도 자연수예요.", "2": "8÷[8/9] = 9도 자연수예요.", "3": "□는 9보다 작아야 해요. 그리고 8÷[2/9] = 36도 자연수예요." } }]) }
},
{
  id: "s6", no: 6, title: "보리차 물통 ― (분수)÷(분수)를 분수의 곱셈으로", soop: "개념 구축하기(O)",
  question: "(분수)÷(분수)를 분수의 곱셈으로 어떻게 나타낼 수 있을까요?",
  summary: "보리차 [3/4] L로 물통의 [3/5]이 찼다면, 물통의 [1/5]에는 [3/4]÷3 = [1/4] (L), 물통 가득은 [1/4]×5 = [5/4] = [1 1/4] (L)이에요. [3/4]÷[3/5] = [3/4]÷3×5 = [3/4]×[1/3]×5 = [3/4]×[5/3]. (분수)÷(분수)를 분수의 곱셈으로 나타내어 계산할 때에는 나눗셈을 곱셈으로 바꾸고 나누는 분수의 분자와 분모를 바꾸어 계산합니다.",
  steps: [
    { name: "만져 보기 — 물통 가득 채우기", inst: "숲길을 걷기 전에 서준이가 빈 물통에 보리차 [3/4] L를 부었더니 물통의 [3/5]만큼 찼어요. 물통을 가득 채우려면 보리차가 몇 L 필요할까요? 아래 수직선의 표시를 물통의 [1/5], 물통 1개로 차례로 옮겨 보세요.", hints: ["물통의 [1/5]만큼은 물통의 [3/5]만큼을 3으로 나눈 것과 같아요.", "물통을 가득 채우는 양은 물통의 [1/5]만큼 들어 있는 양을 5배 한 것과 같아요."],
      render: (b, a) => fd6Double(b, a, { items: [{ Q: "3/4", a: 3, b: 5, top: " L", bot: "물통", pre: "물통", name: "보리차" }], ask: [
        ["구하는 식: ", { c: ["[3/4]÷[3/5]", "[3/4]×[3/5]", "[3/5]÷[3/4]"], a: 0 }],
        ["물통의 [1/5]만큼: [3/4]÷", { i: "3" }, " = ", { q: [null, "?1", "4"] }, " (L)"],
        ["물통 가득: [1/4]×", { i: "5" }, " = ", { q: [null, "?5", "4"] }, " = ", { q: ["?1", "?1", "4"] }, " (L)"]], ok: "물통을 가득 채우려면 보리차 [1 1/4] L가 필요해요." }) },
    { name: "그려 보기 — 곱셈으로 나타내기", inst: "그림에서 한 계산을 이어서 [3/4]÷[3/5]을 분수의 곱셈으로 나타내 보세요. ÷3은 ×[1/3]로 나타낼 수 있어요. 먼저 규칙을 예상해 봐요.", hints: ["[3/4]÷3 = [3/4]×[1/3]이에요.", "×[1/3]×5는 ×[5/3]와 같아요."],
      render: ruleFirst((b, a) => fd6Chain(b, a, [
        ["[3/4]÷[3/5] = [3/4]÷", { i: "3" }, "×", { i: "5" }, " = [3/4]×", { q: [null, "?1", "?3"] }, "×5 = [3/4]×", { q: [null, "?5", "?3"] }, " = ", { q: [null, "?15", "12"] }, " = ", { q: ["?1", "?1", "4"] }],
        ["[3/4]÷[3/5]을 [3/4]×[5/3]로 나타낼 수 ", { c: ["있어요", "없어요"], a: 0 }, ". [3/4]에 [1/3]을 곱하고 5배 하기 때문이에요."]],
        { ok: "[3/4]÷[3/5] = [3/4]×[5/3]예요. 나누는 분수 [3/5]의 분자와 분모가 바뀌었어요!" }),
        { q: "(분수)÷(분수)를 곱셈으로 바꾸는 규칙을 예상해 봐요.", ph: "내 규칙: ÷를 ×로 바꾸고 ~", help: ["① ÷3과 ×5가 어디에서 나왔는지 [3/5]을 보며 생각해요. → ② 나누는 분수가 곱셈식에서 어떻게 바뀌는지 예상해요.", "‘내 규칙: ÷를 ×로 바꾸고 나누는 분수의 ~와 ~를 바꾸어 곱해요.’ 꼴로 써요."],
          ans: "나눗셈을 곱셈으로 바꾸고 나누는 분수의 분자와 분모를 바꾸어 곱해요. [3/4]÷[3/5] = [3/4]×[5/3]예요." }) },
    { name: "말해 보기 — 무엇을 뒤집을까?", inst: "나눗셈을 곱셈으로 바꾸어 보세요. ÷를 누르면 ×로, 분수를 누르면 분자와 분모가 바뀌어요. 어느 분수를 바꾸어야 할지 친구와 이야기해 보세요.", hints: ["분자와 분모를 바꾸는 것은 나누는 수(÷ 뒤의 분수)예요.", "[2/3]÷[4/7] = [2/3]×[7/4]이에요."],
      render: thenWhy((b, a) => fd6Flip(b, a, { rows: [{ A: "3/4", B: "3/5" }, { A: "2/3", B: "4/7" }, { A: "5/8", B: "5/6" }] }),
        { q: "나누는 분수만 분자와 분모를 바꾸는 까닭은 무엇일까요?", ph: "÷[3/5]은 ÷3을 하고 ~", help: ["① ÷[3/5]이 ‘÷3’과 ‘×5’로 바뀐 것을 떠올려요. → ② 나누어지는 수 [3/4]은 바뀌었는지 살펴봐요.", "‘÷[3/5]은 ÷3을 하고 ×5를 하는 것과 같아서 ×[5/3]가 돼요. 나누어지는 수는 ~’ 꼴로 써요."],
          ans: "÷[3/5]은 ÷3을 하고 ×5를 하는 것과 같아서 ×[5/3]가 돼요. 나누어지는 수 [3/4]은 그대로 두고 나누는 분수만 분자와 분모가 바뀌어요." }) },
    { name: "약속하기 — 곱셈으로 나타내기", inst: "(분수)÷(분수)를 분수의 곱셈으로 나타내는 방법을 약속해요.", hints: ["[3/4]÷[3/5] = [3/4]×[5/3]에서 무엇이 바뀌었나요?"],
      render: (b, a) => blanks(b, a, ["(분수)÷(분수)를 분수의 곱셈으로 나타내어 계산할 때에는 나눗셈을 ", { o: ["곱셈으로", "덧셈으로"], a: 0 }, " 바꾸고 ", { o: ["나누는 분수의", "나누어지는 분수의", "두 분수의"], a: 0 }, " 분자와 분모를 바꾸어 계산합니다. [■/●]÷[▲/♥] = ", { o: ["[■/●]×[♥/▲]", "[●/■]×[▲/♥]", "[■/●]×[▲/♥]"], a: 0 }], { ok: "나눗셈을 곱셈으로 바꾸고 나누는 분수의 분자와 분모를 바꾸어 계산합니다." }) },
    { name: "확인하기 — 곱셈으로 계산하기", inst: "분수의 곱셈으로 나타내어 계산해 보세요. 약분할 수 있으면 먼저 약분해도 돼요.", hints: ["[2/5]÷[3/7] = [2/5]×[7/3]이에요.", "[9/14]÷[3/7] = [9/14]×[7/3]에서 9와 3, 14와 7을 약분해요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[2/5]÷[3/7]", a: "14/15" }, { e: "[5/6]÷[3/4]", a: "1 1/9" }, { e: "[9/14]÷[3/7]", a: "1 1/2" }, { e: "[4/9]÷[8/15]", a: "5/6" }]) }
  ],
  challenge: { inst: "★ 도전 — 모둠 깃발 문제를 풀어 보세요.", hints: ["(직사각형의 넓이) = (가로)×(세로)이므로 (가로) = (넓이)÷(세로)예요.", "㉡은 나누어지는 수 [4/5]의 분자와 분모를 바꾸었어요."],
    render: (b, a) => fd6Calc(b, a, [
      { e: "[3/10]÷[4/5]", a: "3/8" },
      { q: "옳게 계산한 것을 골라요.", pick: ["㉠ [7/12]÷[7/8] = [7/12]×[8/7] = [2/3]", "㉡ [4/5]÷[2/9] = [5/4]×[2/9] = [5/18]"], a: 0, why: { "1": "㉡은 나누어지는 수의 분자와 분모를 바꾸었어요. [4/5]÷[2/9] = [4/5]×[9/2] = [18/5]이에요." } },
      { q: "넓이가 [5/6] m²이고 세로가 [2/3] m인 직사각형 모양 모둠 깃발의 가로는 몇 m일까요?", x: "[5/6]÷[2/3]", a: "1 1/4", unit: "m", lab: "[5/6]÷[2/3] =" }]) }
},
{
  id: "s7", no: 7, title: "쿠키 반죽 ― (대분수)÷(분수)", soop: "개념 구축하기(O)",
  question: "(대분수)÷(분수)는 어떻게 계산할까요?",
  summary: "쿠키 반죽 [2 1/2] kg을 한 판에 [5/8] kg씩 나누려면 [2 1/2]÷[5/8]를 계산해요. 서준이처럼 [5/2]÷[5/8] = [20/8]÷[5/8] = 20÷5 = 4로 통분하여 계산하거나, 지안이처럼 [5/2]÷[5/8] = [5/2]×[8/5] = 4로 분수의 곱셈으로 계산해요. (대분수)÷(분수)는 대분수를 가분수로 바꾼 다음 통분하여 분자끼리 나누거나 분수의 곱셈으로 나타내어 계산해요.",
  steps: [
    { name: "만져 보기 — 쿠키 반죽 나누기", inst: "둘째 날 오후, 쿠키 굽기 시간이에요. 쿠키 반죽 [2 1/2] kg을 한 판에 [5/8] kg씩 나누어 구우려고 해요. 몇 판을 구울 수 있을까요? 칸의 크기를 같게 한 다음 [5/8] kg씩 덜어 내 보세요.", hints: ["[1/2]을 똑같이 4칸으로 나누면 [1/8]이에요.", "[2 1/2] = [5/2] = [20/8]이에요. [5/8]는 [1/8]이 5개예요."],
      render: (b, a) => fd6Scoop(b, a, { A: "2 1/2", B: "5/8", unit: " kg", cnt: "판", one: "판", aName: "반죽 [2 1/2] kg", bName: "한 판 [5/8] kg", ask: [
        ["구하는 식: ", { c: ["[2 1/2]÷[5/8]", "[5/8]÷[2 1/2]", "[2 1/2]×[5/8]"], a: 0 }],
        ["[2 1/2] = ", { q: [null, "?5", "2"] }, " = ", { q: [null, "?20", "8"] }],
        ["쿠키를 ", { i: "4" }, "판 구울 수 있어요."]], ok: "[2 1/2] kg은 [5/8] kg씩 4번 덜어 낼 수 있어요. 쿠키를 4판 구울 수 있어요." }) },
    { name: "그려 보기 — 서준이와 지안이의 방법", inst: "서준이와 지안이가 [2 1/2]÷[5/8]를 서로 다른 방법으로 계산했어요. 빈칸을 채워 보세요.", hints: ["두 사람 모두 먼저 대분수를 가분수로 바꾸었어요.", "지안이는 나누는 분수 [5/8]의 분자와 분모를 바꾸어 곱했어요."],
      render: thenWhy((b, a) => fd6Chain(b, a, [
        { t: "서준", p: ["“통분하여 계산해 볼까?” [2 1/2]÷[5/8] = ", { q: [null, "?5", "2"] }, "÷[5/8] = ", { q: [null, "?20", "8"] }, "÷[5/8] = ", { i: "20" }, "÷", { i: "5" }, " = ", { i: "4" }] },
        { t: "지안", p: ["“분수의 곱셈으로 나타내어 계산해 볼까?” [2 1/2]÷[5/8] = [5/2]÷[5/8] = [5/2]×", { q: [null, "?8", "?5"] }, " = ", { i: "4" }] },
        ["두 사람 모두 먼저 대분수를 ", { c: ["가분수로 바꾸었어요", "자연수와 분수로 나누었어요"], a: 0 }, "."]],
        { ok: "두 방법 모두 [2 1/2]÷[5/8] = 4예요." }),
        { q: "대분수를 먼저 가분수로 바꾸는 까닭은 무엇일까요?", ph: "대분수 그대로는 ~", help: ["① [2 1/2]을 그대로 두면 통분하거나 분자와 분모를 바꾸기 어려운 까닭을 생각해요. → ② 가분수로 바꾸면 무엇이 쉬워지는지 써요.", "‘대분수는 자연수 부분이 따로 있어서 ~하기 어려워요. 가분수로 바꾸면 ~’ 꼴로 써요."],
          ans: "대분수는 자연수 부분이 따로 있어서 바로 통분하거나 분자와 분모를 바꾸기 어려워요. 가분수로 바꾸면 분수 하나가 되어 (분수)÷(분수)처럼 계산할 수 있어요." }) },
    { name: "말해 보기 — 대분수끼리 나누기", inst: "쿠키 장식용 초콜릿 [1 3/5] kg은 설탕 가루 [1 1/3] kg의 몇 배일까요? [1 3/5]÷[1 1/3]을 두 가지 방법으로 계산해 보세요.", hints: ["[1 3/5] = [8/5], [1 1/3] = [4/3]예요.", "[8/5]과 [4/3]의 공통분모는 15예요."],
      render: thenWhy((b, a) => fd6Chain(b, a, [
        { t: "방법 1", p: ["[1 3/5]÷[1 1/3] = ", { q: [null, "?8", "5"] }, "÷", { q: [null, "?4", "3"] }, " = ", { q: [null, "?24", "15"] }, "÷", { q: [null, "?20", "15"] }, " = ", { i: "24" }, "÷", { i: "20" }, " = ", { q: [null, "?24", "20"] }, " = ", { q: ["?1", "?1", "5"] }] },
        { t: "방법 2", p: ["[1 3/5]÷[1 1/3] = [8/5]÷[4/3] = [8/5]×", { q: [null, "?3", "?4"] }, " = ", { q: [null, "?24", "20"] }, " = ", { q: ["?1", "?1", "5"] }] }],
        { ok: "두 방법 모두 [1 1/5]배예요. 편리한 방법을 골라 계산해요." }),
        { q: "두 방법 중 어느 방법이 더 편리했나요? 까닭과 함께 써 봐요.", ph: "나는 방법 ~이 더 편리했어요. 왜냐하면 ~", help: ["① 방법 1과 방법 2에서 계산한 단계 수를 견주어요. → ② 통분하는 수가 클 때와 작을 때를 생각해요.", "‘나는 방법 ~가 더 편리했어요. 왜냐하면 ~하지 않아도 되기 때문이에요.’ 꼴로 써요."],
          ans: "나는 방법 2가 더 편리했어요. 왜냐하면 통분하지 않고 나누는 분수의 분자와 분모를 바꾸어 곱하기만 하면 되기 때문이에요." }) },
    { name: "약속하기 — (대분수)÷(분수)", inst: "(대분수)÷(분수)의 계산 방법을 정리해요.", hints: ["서준이와 지안이가 가장 먼저 한 일을 떠올려요."],
      render: (b, a) => blanks(b, a, ["(대분수)÷(분수)는 대분수를 ", { o: ["가분수로", "진분수로"], a: 0 }, " 바꾼 다음 ", { o: ["통분하여 분자끼리 나누거나", "자연수끼리 나누거나"], a: 0 }, " 분수의 곱셈으로 나타내어 계산해요."], { ok: "대분수를 가분수로 바꾼 다음 통분하여 분자끼리 나누거나 분수의 곱셈으로 나타내어 계산해요." }) },
    { name: "확인하기 — 쿠키 재료 계산", inst: "계산해 보세요. 편리한 방법으로 계산하고, 가분수로 써도 대분수로 써도 맞아요.", hints: ["먼저 대분수를 가분수로 바꾸어요.", "[1 3/4]÷[2 1/3] = [7/4]×[3/7]에서 7과 7을 약분해요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[1 1/6]÷[7/9]", a: "1 1/2" }, { e: "[2 2/3]÷[4/5]", a: "3 1/3" }, { e: "[1 3/4]÷[2 1/3]", a: "3/4" }, { e: "[3 1/2]÷[1 1/4]", a: "2 4/5" }]) }
  ],
  challenge: { inst: "★ 도전 — 쿠키 나눔 문제를 풀어 보세요.", hints: ["[7 1/2] = [15/2], [1 1/4] = [5/4]예요.", "어떤 수 × [3/4] = [1 1/2]이므로 어떤 수 = [1 1/2]÷[3/4]이에요."],
    render: (b, a) => fd6Calc(b, a, [
      { q: "구운 쿠키 [7 1/2] kg을 한 봉지에 [1 1/4] kg씩 담아 다른 반에 나누어 주어요. 몇 봉지가 될까요?", x: "[7 1/2]÷[1 1/4]", n: 6, unit: "봉지", lab: "[7 1/2]÷[1 1/4] =" },
      { q: "몫의 크기를 비교해 보세요. [2 1/4]÷[3/4] ○ [3 1/3]÷[1 1/9]", pick: [">", "=", "<"], a: 1, why: { "0": "[2 1/4]÷[3/4] = [9/4]×[4/3] = 3, [3 1/3]÷[1 1/9] = [10/3]×[9/10] = 3이에요.", "2": "[2 1/4]÷[3/4] = 3, [3 1/3]÷[1 1/9] = 3이에요. 두 몫이 같아요." } },
      { q: "어떤 수를 [3/4]으로 나누어야 할 것을 잘못하여 곱했더니 [1 1/2]이 되었어요. 바르게 계산한 값은?", x: "[1 1/2]÷[3/4]÷[3/4]", a: "2 2/3", lab: "바르게 계산한 값" }]) }
},
{
  id: "s8", no: 8, title: "간식 장보기 ― 어느 마트가 더 저렴할까요", soop: "개념 구축하기(O)",
  question: "두 마트 중 어느 마트에서 견과를 사는 것이 더 저렴할까요?",
  summary: "양이 다른 두 마트의 값을 비교하려면 1 kg의 가격을 구해 비교해요. 햇살 마트 견과 1 kg은 4800÷[3/5] = (4800÷3)×5 = 8000(원), 바람 마트 견과 1 kg은 6300÷[3/4] = (6300÷3)×4 = 8400(원)이므로 햇살 마트가 더 저렴해요. 햇살 마트 귤 1 kg은 2000÷[2/3] = 3000(원), 바람 마트 귤 1 kg은 2400÷[5/6] = 2880(원)이므로 귤은 바람 마트가 더 저렴해요.",
  steps: [
    { name: "만져 보기 — 문제 이해하기", inst: "수련회 간식으로 견과를 사려고 해요. 햇살 마트에서는 견과 [3/5] kg을 4800원에, 바람 마트에서는 견과 [3/4] kg을 6300원에 팔아요. 어느 마트에서 사는 것이 더 저렴할까요?", hints: ["두 마트의 견과 양이 달라서 값만 보고는 비교할 수 없어요.", "같은 양, 곧 1 kg의 가격으로 비교해요."],
      render: (b, a) => quiz(b, a, [
        { q: "구하려는 것은 무엇인가요?", o: ["어느 마트에서 견과를 사는 것이 더 저렴한지", "견과를 모두 몇 kg 살 수 있는지", "두 마트 견과 값의 합"], a: 0, why: { "1": "산 견과의 양을 묻지 않았어요.", "2": "값을 더하는 문제가 아니에요." } },
        { q: "무엇을 비교하면 될까요?", o: ["두 마트 견과 1 kg의 가격", "두 마트 견과의 값(4800원과 6300원)", "두 마트 견과의 양"], a: 0, why: { "1": "견과의 양이 서로 달라서 값만 비교하면 안 돼요.", "2": "양만 비교하면 어느 마트가 저렴한지 알 수 없어요." } }],
        { ok: "두 마트 견과 1 kg의 가격을 비교하면 돼요." }) },
    { name: "그려 보기 — 계획 세우기", inst: "견과 1 kg의 가격을 구하는 식을 세워 보세요. “견과 5 kg이 1000원이라면 1 kg의 가격은 1000÷5 = 200(원)이야.”", hints: ["(1 kg의 가격) = (값)÷(견과의 양)이에요.", "자연수로 바꾸어 생각한 1000÷5처럼 값을 양으로 나누어요."],
      render: thenWhy((b, a) => blanks(b, a, ["햇살 마트 견과 1 kg의 가격: ", { o: ["4800÷[3/5]", "[3/5]÷4800", "4800×[3/5]"], a: 0 }, " / 바람 마트 견과 1 kg의 가격: ", { o: ["6300÷[3/4]", "[3/4]÷6300", "6300×[3/4]"], a: 0 }], { ok: "값을 견과의 양으로 나누면 1 kg의 가격이에요." }),
        { q: "1 kg의 가격을 구할 때 왜 값을 양으로 나눌까요?", ph: "5 kg이 1000원이면 ~처럼 ~", help: ["① 쉬운 자연수(5 kg에 1000원)로 바꾸어 생각해요. → ② 그 식을 분수로 된 양에도 똑같이 써 봐요.", "‘5 kg이 1000원이면 1000÷5로 1 kg의 가격을 구하는 것처럼, ~도 값÷양으로 구해요.’ 꼴로 써요."],
          ans: "5 kg이 1000원이면 1000÷5 = 200원이 1 kg의 가격인 것처럼, 양이 분수여도 값을 양으로 나누면 1 kg의 가격이 돼요." }) },
    { name: "말해 보기 — 해결하기", inst: "두 그림에서 표시를 차례로 옮겨 견과 1 kg의 가격을 구하고, 더 저렴한 마트를 골라 보세요.", hints: ["햇살 마트: [1/5] kg은 4800÷3 = 1600(원), 1 kg은 1600×5 = 8000(원)이에요.", "바람 마트: [1/4] kg은 6300÷3 = 2100(원), 1 kg은 2100×4 = 8400(원)이에요."],
      render: (b, a) => fd6Double(b, a, { items: [{ Q: "4800", a: 3, b: 5, top: "원", bot: " kg", name: "햇살 마트 견과" }, { Q: "6300", a: 3, b: 4, top: "원", bot: " kg", name: "바람 마트 견과" }], ask: [
        { t: "햇살", p: ["4800÷[3/5] = (4800÷", { i: "3" }, ")×", { i: "5" }, " = ", { i: "8000" }] },
        { t: "바람", p: ["6300÷[3/4] = (6300÷", { i: "3" }, ")×", { i: "4" }, " = ", { i: "8400" }] },
        ["1 kg의 가격이 더 싼 ", { c: ["햇살 마트", "바람 마트"], a: 0 }, "에서 사는 것이 더 저렴해요."]], ok: "햇살 마트 견과는 1 kg에 8000원, 바람 마트 견과는 1 kg에 8400원이에요. 햇살 마트가 더 저렴해요." }) },
    { name: "약속하기 — 한 번 더 해결하기", inst: "귤도 사야 해요. 햇살 마트에서는 귤 [2/3] kg을 2000원에, 바람 마트에서는 귤 [5/6] kg을 2400원에 팔아요. 어느 마트에서 귤을 사는 것이 더 저렴할까요?", hints: ["2000÷[2/3] = (2000÷2)×3이에요.", "2400÷[5/6] = (2400÷5)×6이에요."],
      render: (b, a) => fd6Calc(b, a, [
        { q: "햇살 마트 귤 1 kg의 가격", e: "2000÷[2/3]", n: 3000, unit: "원" },
        { q: "바람 마트 귤 1 kg의 가격", e: "2400÷[5/6]", n: 2880, unit: "원", why: { "2000": "곱셈을 했어요. 값을 귤의 양으로 나누어요." } },
        { q: "더 저렴한 마트는?", pick: ["햇살 마트", "바람 마트"], a: 1, why: { "0": "1 kg의 가격이 3000원 > 2880원이에요. 귤 값만 보면 햇살 마트가 싸 보이지만 양이 달라요." } }], { ok: "귤은 바람 마트가 1 kg에 2880원으로 더 저렴해요. 값이 더 비싸도 양이 많으면 더 저렴할 수 있어요." }) },
    { name: "확인하기 — 되돌아보기", inst: "문제를 잘 해결했나요? 다른 방법으로도 풀어 보고, 해결한 방법을 되돌아보며 써 보세요.", hints: ["4800 = [24000/5]이에요. 자연수를 분모가 같은 분수로 바꾸어 분자끼리 나눌 수 있어요.", "값과 양이 모두 다를 때 무엇을 같게 맞추었는지 떠올려요."],
      render: (b, a) => writeStep(b, a, [
        { q: "4800÷[3/5]을 다른 방법으로 계산해 보세요.", tag: "다른 방법", ph: "예) 4800을 분모가 5인 분수로 바꾸면 …", help: ["① 4800을 분모가 5인 분수로 바꾸어요. → ② 분자끼리 나누어요.", "‘4800을 [~/5]로 바꾸면 [~/5]÷[3/5] = ~÷3 = ~이에요.’ 꼴로 써요."],
          ans: "4800을 분모가 5인 분수 [24000/5]으로 바꾸면 [24000/5]÷[3/5] = 24000÷3 = 8000이에요." },
        { q: "값도 양도 다를 때 어느 쪽이 더 저렴한지 어떻게 알 수 있나요?", tag: "해결 방법", ph: "예) 같은 양인 1 kg의 가격을 …", help: ["① 값만, 양만 비교하면 안 되는 까닭을 생각해요. → ② 무엇을 같게 맞추어 비교했는지 써요.", "‘양이 달라서 값만 비교하면 안 돼요. ~의 가격을 나눗셈으로 구해 비교해요.’ 꼴로 써요."],
          ans: "양이 달라서 값만 비교하면 안 돼요. 값을 양으로 나누어 같은 양인 1 kg의 가격을 구해 비교하면 어느 쪽이 더 저렴한지 알 수 있어요." }]) }
  ],
  challenge: { inst: "★ 도전 — 하람이네 모둠은 숲길 [9/10] km를 [3/4]시간 동안, 도현이네 모둠은 [4/5] km를 [2/3]시간 동안 걸었어요. 1시간 동안 걷는 거리로 비교하면 어느 모둠이 더 빨리 걸었을까요?", hints: ["(1시간 동안 걷는 거리) = (거리)÷(걸린 시간)이에요.", "[9/10]÷[3/4] = [9/10]×[4/3], [4/5]÷[2/3] = [4/5]×[3/2]이에요."],
    render: (b, a) => fd6Calc(b, a, [
      { q: "하람이네 모둠이 1시간 동안 걷는 거리", e: "[9/10]÷[3/4]", a: "1 1/5", unit: "km" },
      { q: "도현이네 모둠이 1시간 동안 걷는 거리", e: "[4/5]÷[2/3]", a: "1 1/5", unit: "km" },
      { q: "더 빨리 걸은 모둠은?", pick: ["하람이네", "도현이네", "빠르기가 같아요"], a: 2, why: { "0": "두 모둠 모두 1시간 동안 [1 1/5] km를 걸어요.", "1": "두 모둠 모두 1시간 동안 [1 1/5] km를 걸어요." } }], { ok: "두 모둠 모두 1시간 동안 [1 1/5] km를 걸어요. 걸은 거리와 시간은 달라도 빠르기는 같아요!" }) }
},
{
  id: "s9", no: 9, title: "수련회 보고서 ― 분수의 나눗셈을 정리해요", soop: "탐구 정리하기(O)",
  question: "분수의 나눗셈은 어떤 상황에서 쓰고, 어떻게 계산할까요?",
  summary: "분수의 나눗셈은 몇 번 덜어 낼 수 있는지(몇 개), 몇 배인지, 1만큼은 얼마인지(1시간 동안·1 kg의 가격·물통 가득)를 구할 때 써요. 분모가 같으면 분자끼리 나누고, 분모가 다르면 통분한 다음 분자끼리 나누거나 나누는 분수의 분자와 분모를 바꾸어 곱해요. 나누는 수가 1보다 작으면 몫은 나누어지는 수보다 커지고, 1보다 크면 작아져요.",
  steps: [
    { name: "만져 보기 — 수련회 상황 나누기", inst: "수련회 보고서를 만들어요. 수련회에서 푼 나눗셈 문제를 무엇을 구하는지에 따라 나누어 보세요.", hints: ["‘몇 컵’, ‘몇 개’는 몇 번 덜어 낼 수 있는지 구하는 것이에요.", "‘1시간 동안’, ‘물통 가득’은 1만큼의 양을 구하는 것이에요."],
      render: thenWhy((b, a) => fd6Sort(b, a, { bins: ["몇 번 덜어 낼까요", "몇 배일까요", "1만큼은 얼마일까요"], cards: [
        { t: "주스 [4/5] L를 [1/5] L씩 따르면 몇 컵?", k: 0, why: "주스에서 [1/5] L를 몇 번 덜어 내는지 구해요." },
        { t: "끈 8 m를 [2/3] m씩 자르면 팔찌 몇 개?", k: 0, why: "끈에서 [2/3] m를 몇 번 덜어 내는지 구해요." },
        { t: "솔숲 길 [2/3] km는 개울 길 [1/6] km의 몇 배?", k: 1, why: "두 거리를 견주어 몇 배인지 구해요." },
        { t: "초콜릿 [1 3/5] kg은 설탕 가루 [1 1/3] kg의 몇 배?", k: 1, why: "두 무게를 견주어 몇 배인지 구해요." },
        { t: "45 km를 [3/4]시간에 → 1시간에 몇 km?", k: 2, why: "1시간 동안 가는 거리, 곧 1만큼의 양을 구해요." },
        { t: "보리차 [3/4] L로 물통의 [3/5]이 참 → 물통 가득은?", k: 2, why: "물통 1개만큼의 양을 구해요." }],
        ok: "세 가지 상황 모두 분수의 나눗셈으로 풀었어요." }),
        { q: "세 가지 상황은 서로 다르지만 모두 어떤 계산으로 풀었나요?", ph: "세 가지 모두 ~으로 풀어요", help: ["① 각 묶음에서 쓴 식을 하나씩 떠올려요. → ② 식의 공통점을 찾아요.", "‘세 가지 모두 ~으로 풀어요. 예를 들어 ~은 ~이에요.’ 꼴로 써요."],
          ans: "세 가지 모두 나눗셈으로 풀어요. 예를 들어 컵 수는 [4/5]÷[1/5], 몇 배는 [2/3]÷[1/6], 1시간 동안 가는 거리는 45÷[3/4]이에요." }) },
    { name: "그려 보기 — 몫은 항상 작아질까?", inst: "나눗셈을 하면 몫은 항상 나누어지는 수보다 작아질까요? 먼저 규칙을 예상한 다음, 몫이 나누어지는 수보다 큰지 작은지 나누어 보세요.", hints: ["나누는 수가 1보다 작은지 큰지 살펴봐요.", "[3/4]÷[1/2] = [3/2]은 [3/4]보다 커요."],
      render: ruleFirst((b, a) => fd6Sort(b, a, { bins: ["몫이 나누어지는 수보다 커요", "몫이 나누어지는 수보다 작아요"], cards: [
        { t: "[3/4]÷[1/2]", k: 0, why: "[3/4]÷[1/2] = [3/2]이에요. 나누는 수 [1/2]이 1보다 작아요." },
        { t: "6÷[2/3]", k: 0, why: "6÷[2/3] = 9예요. 나누는 수 [2/3]가 1보다 작아요." },
        { t: "[2/3]÷[3/4]", k: 0, why: "[2/3]÷[3/4] = [8/9]이에요. [8/9]은 [2/3]보다 커요. 나누는 수 [3/4]이 1보다 작아요." },
        { t: "[4/5]÷2", k: 1, why: "[4/5]÷2 = [2/5]예요. 나누는 수 2가 1보다 커요." },
        { t: "[5/6]÷[1 1/4]", k: 1, why: "[5/6]÷[1 1/4] = [2/3]예요. 나누는 수 [1 1/4]이 1보다 커요." },
        { t: "[9/10]÷[1 1/2]", k: 1, why: "[9/10]÷[1 1/2] = [3/5]이에요. 나누는 수 [1 1/2]이 1보다 커요." }],
        ok: "나누는 수가 1보다 작으면 몫이 커지고, 1보다 크면 몫이 작아져요." }),
        { q: "나눗셈을 하면 몫은 항상 작아질까요? 내 규칙을 예상해 봐요.", ph: "내 규칙: 나누는 수가 1보다 ~이면 ~", help: ["① 버스 문제(45÷[3/4] = 60)를 떠올려요. → ② 나누는 수가 1보다 작을 때와 클 때로 나누어 예상해요.", "‘내 규칙: 나누는 수가 1보다 작으면 몫이 ~지고, 1보다 크면 ~져요.’ 꼴로 써요."],
          ans: "나누는 수가 1보다 작으면 몫이 나누어지는 수보다 커지고, 나누는 수가 1보다 크면 몫이 나누어지는 수보다 작아져요." }) },
    { name: "말해 보기 — 두 방법 견주기", inst: "[5/6]÷[2/9]를 통분하는 방법과 곱셈으로 바꾸는 방법으로 계산하고, 어떤 방법이 편리한지 이야기해 보세요.", hints: ["[5/6]와 [2/9]의 분모의 최소공배수는 18이에요.", "[5/6]÷[2/9] = [5/6]×[9/2]예요."],
      render: thenWhy((b, a) => fd6Chain(b, a, [
        { t: "통분하기", p: ["[5/6]÷[2/9] = ", { q: [null, "?15", "18"] }, "÷", { q: [null, "?4", "18"] }, " = ", { i: "15" }, "÷", { i: "4" }, " = ", { q: [null, "?15", "4"] }, " = ", { q: ["?3", "?3", "4"] }] },
        { t: "곱셈으로", p: ["[5/6]÷[2/9] = [5/6]×", { q: [null, "?9", "?2"] }, " = ", { q: [null, "?45", "12"] }, " = ", { q: ["?3", "?3", "4"] }] }],
        { ok: "두 방법 모두 [3 3/4]이에요." }),
        { q: "분모가 같을 때와 다를 때, 어떤 방법이 편리할까요?", ph: "분모가 같으면 ~, 분모가 다르면 ~", help: ["① 분모가 같은 나눗셈과 다른 나눗셈을 하나씩 떠올려요. → ② 각각 어떤 방법이 계산이 짧았는지 견주어요.", "‘분모가 같으면 ~끼리 나누는 것이 편리하고, 분모가 다르면 ~이 편리해요.’ 꼴로 써요."],
          ans: "분모가 같으면 분자끼리 나누는 것이 편리하고, 분모가 다르면 통분하지 않아도 되는 곱셈 방법(나누는 분수의 분자와 분모를 바꾸어 곱하기)이 편리해요." }) },
    { name: "약속하기 — 분수의 나눗셈 정리", inst: "수련회 보고서에 분수의 나눗셈 계산 방법을 정리해요.", hints: ["분모가 같을 때, 다를 때, 자연수를 나눌 때, 대분수일 때를 떠올려요."],
      render: (b, a) => blanks(b, a, ["분모가 같은 (분수)÷(분수)는 ", { o: ["분자끼리 나누고", "분모끼리 나누고"], a: 0 }, ", 분모가 다르면 ", { o: ["통분한 다음 분자끼리 나누어요", "분자끼리 바로 나누어요"], a: 0 }, ". (분수)÷(분수)는 ", { o: ["나누는 분수의", "나누어지는 분수의"], a: 0 }, " 분자와 분모를 바꾸어 곱해도 돼요. 대분수는 먼저 ", { o: ["가분수로", "진분수로"], a: 0 }, " 바꾸어요."], { ok: "분수의 나눗셈 계산 방법을 모두 정리했어요." }) },
    { name: "확인하기 — 같은 값 잇기와 한 줄 정리", inst: "나눗셈의 몫을 찾아 이은 다음, 보고서에 한 줄 정리를 써 보세요.", hints: ["[2 1/3]÷[7/9] = [7/3]×[9/7]예요.", "[3/5]÷[9/10] = [6/10]÷[9/10]예요."],
      render: (b, a) => { fd6Match(b, a, { left: [{ t: "[7/8]÷[1/8]", k: 1 }, { t: "[2 1/3]÷[7/9]", k: 2 }, { t: "[3/5]÷[9/10]", k: 3 }], right: [{ t: "[2/3]", k: 3 }, { t: "7", k: 1 }, { t: "[1 1/2]", k: null }, { t: "3", k: 2 }], ok: "몫을 바르게 이었어요! 이제 아래에 한 줄 정리를 써요." });
        writeStep(b, a, [{ q: "분수의 나눗셈에서 가장 중요하다고 생각한 것을 한 줄로 정리해 보세요.", tag: "한 줄 정리", ph: "분수의 나눗셈은 ~", help: ["① 이번 단원에서 배운 계산 방법 가운데 하나를 골라요. → ② 그 방법을 왜 쓰는지 함께 써요.", "‘분수의 나눗셈은 ~하면 쉽게 계산할 수 있어요. 왜냐하면 ~’ 꼴로 써요."],
          ans: "분수의 나눗셈은 나누는 분수의 분자와 분모를 바꾸어 곱하면 쉽게 계산할 수 있어요. 왜냐하면 ÷[▲/♥]는 ÷▲를 하고 ×♥를 하는 것과 같기 때문이에요." }], { ok: "보고서를 완성했어요!" }); } }
  ],
  challenge: { inst: "★ 도전 — 보고서의 마지막 퀴즈를 풀어 보세요.", hints: ["나누는 수가 1보다 작으면 몫이 커져요.", "[4/9]÷[2/3] = [4/9]×[3/2]이에요."],
    render: (b, a) => fd6Calc(b, a, [
      { q: "몫이 [5/7]보다 큰 것을 골라요.", pick: ["㉠ [5/7]÷[1 1/3]", "㉡ [5/7]÷[3/4]", "㉢ [5/7]÷2"], a: 1, why: { "0": "나누는 수 [1 1/3]이 1보다 커서 몫이 [5/7]보다 작아요.", "2": "나누는 수 2가 1보다 커서 몫이 [5/7]보다 작아요." } },
      { e: "[4/9]÷[2/3]", a: "2/3" }, { e: "5÷[5/8]", n: 8 }, { e: "[1 2/5]÷[7/10]", n: 2 }]) }
},
{
  id: "s10", no: 10, title: "캠프파이어 놀이 ― 다를까요, 같을까요", soop: "발표하기(P)",
  question: "수 카드로 친구와 다른 분수의 나눗셈을 만들고 옳게 계산할 수 있나요?",
  summary: "모둠이 함께 수 카드 4장을 정하고, 그 카드를 한 번씩 모두 사용하여 각자 분수의 나눗셈을 만들고 계산해요. 같은 나눗셈이 없으면 2점, 같은 나눗셈이 있으면 1점, 옳게 계산하면 1점을 더 얻어요. 4판 동안 얻은 점수의 합이 가장 큰 사람이 이겨요. 이기려면 친구들과 서로 다른 나눗셈을 만들고 옳게 계산해야 해요. 속도보다 정확하게 계산해요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알아보기", inst: "캠프파이어 앞에서 ‘다를까요, 같을까요’ 수 카드 놀이를 해요. 놀이 방법을 차례대로 눌러 보세요.", hints: ["수 카드를 정하는 것이 먼저예요.", "점수는 활동지를 친구들과 함께 확인한 다음에 얻어요."],
      render: (b, a) => sequence(b, a, ["활동지를 친구들과 함께 확인하고 규칙에 따라 점수를 얻어요.", "모둠이 함께 수 카드 4장을 정해요.", "4판을 하고 점수의 합이 가장 큰 사람이 이겨요.", "수 카드를 한 번씩 모두 사용하여 각자 분수의 나눗셈을 만들고 몫을 써요."], [1, 3, 0, 2], { ok: "같은 나눗셈이 없으면 2점, 있으면 1점, 옳게 계산하면 1점을 더 얻어요." }) },
    { name: "그려 보기 — 점수 매기기", inst: "수 카드 2, 3, 5, 7로 네 친구가 만든 1판 활동지예요. 규칙에 따라 각 친구의 점수를 매겨 보세요. 규칙: 같은 나눗셈이 없으면 2점, 있으면 1점, 옳게 계산하면 1점 추가.", hints: ["[2/3]÷[5/7]는 두 사람이 만들었어요.", "[2/3]÷[5/7] = [14/15], [3/5]÷[2/7] = [21/10], [5/7]÷[2/3] = [15/14]예요."],
      render: (b, a) => quiz(b, a, [
        { q: "서준: [2/3]÷[5/7] = [14/15]", fig: fd6sSheet, o: ["1점", "2점", "3점"], a: 1, why: { "0": "같은 나눗셈이 있어서 1점, 옳게 계산해서 1점 더해 2점이에요.", "2": "[2/3]÷[5/7]를 만든 친구가 또 있어요. 같은 나눗셈이 있으면 1점이에요." } },
        { q: "지안: [2/3]÷[5/7] = [10/21]", o: ["1점", "2점", "3점"], a: 0, why: { "1": "[10/21]은 곱셈을 한 값이라 틀렸어요. 같은 나눗셈이 있으니 1점뿐이에요.", "2": "같은 나눗셈이 있고 계산도 틀렸어요." } },
        { q: "하람: [3/5]÷[2/7] = [2 1/10]", o: ["1점", "2점", "3점"], a: 2, why: { "0": "[3/5]÷[2/7]를 만든 친구는 하람이뿐이에요.", "1": "[3/5]÷[2/7] = [3/5]×[7/2] = [21/10] = [2 1/10]로 옳게 계산했어요. 1점을 더해요." } },
        { q: "도현: [5/7]÷[2/3] = [10/21]", o: ["1점", "2점", "3점"], a: 1, why: { "0": "같은 나눗셈이 없으니 2점이에요. 계산은 틀렸으니 더하지 않아요.", "2": "[5/7]÷[2/3] = [5/7]×[3/2] = [15/14]예요. 계산이 틀려서 1점을 더하지 않아요." } }],
        { ok: "서준 2점, 지안 1점, 하람 3점, 도현 2점이에요." }) },
    { name: "말해 보기 — 잘못 고치기", inst: "지안이와 도현이의 계산이 왜 틀렸는지 살펴보고 바르게 고쳐 보세요.", hints: ["지안이는 [2/3]÷[5/7]를 [2/3]×[5/7]로 계산했어요.", "나누는 분수의 분자와 분모를 바꾸어 곱해요."],
      render: (b, a) => fd6Chain(b, a, [
        ["두 친구가 틀린 까닭: ", { c: ["나누는 분수를 그대로 곱했어요", "통분을 잘못했어요"], a: 0 }],
        ["[2/3]÷[5/7] = [2/3]×", { q: [null, "?7", "?5"] }, " = ", { q: [null, "?14", "15"] }],
        ["[5/7]÷[2/3] = [5/7]×", { q: [null, "?3", "?2"] }, " = ", { q: [null, "?15", "14"] }, " = ", { q: ["?1", "?1", "14"] }]],
        { ok: "잘못 계산하면 모둠 친구들과 함께 틀린 곳을 찾아 고쳐요." }) },
    { name: "약속하기 — 친구와 다른 나눗셈", inst: "같은 수 카드 2, 3, 5, 7로, 네 친구와 다른 나눗셈을 만들고 옳게 계산해 보세요. 친구들이 만든 나눗셈: [2/3]÷[5/7], [3/5]÷[2/7], [5/7]÷[2/3]", hints: ["진분수뿐 아니라 가분수도 만들 수 있어요. 예: [7/2]÷[5/3]", "나누는 분수의 분자와 분모를 바꾸어 곱해요."],
      render: thenWhy((b, a) => fd6Build(b, a, { cards: [2, 3, 5, 7], boards: [{ shape: [[null, null], [null, null]], goal: "any", avoid: ["2/3÷5/7", "3/5÷2/7", "5/7÷2/3"], label: "나만의 나눗셈" }], ok: "친구와 다른 나눗셈을 만들어 옳게 계산했으니 3점을 얻을 수 있어요!" }),
        { q: "친구와 다른 나눗셈을 만들려면 어떻게 하면 좋을까요?", ph: "같은 카드라도 ~", help: ["① 같은 카드로 만들 수 있는 나눗셈을 여러 가지 떠올려요. → ② 친구들이 잘 만들지 않을 것 같은 꼴을 생각해요.", "‘같은 카드라도 ~ 자리를 바꾸면 다른 나눗셈이 돼요. ~도 만들 수 있어요.’ 꼴로 써요."],
          ans: "같은 카드라도 분자와 분모 자리를 바꾸거나 나누어지는 수와 나누는 수를 바꾸면 다른 나눗셈이 돼요. 친구들이 잘 만들지 않는 가분수도 만들 수 있어요." }) },
    { name: "확인하기 — 놀이하기", inst: "캠프파이어 놀이를 4판 해요. 수 카드와 친구 셋(서준·지안·하람)의 활동지는 이 앱이 정한 것이에요. 4판 중 3판 이상 옳게 계산하면 통과예요.", hints: ["친구와 다른 나눗셈을 만들면 2점이에요.", "몫은 나누는 분수의 분자와 분모를 바꾸어 곱하거나, 통분하여 분자끼리 나누어 구해요."],
      render: (b, a) => fd6Game(b, a, { need: 3, sets: FD6S_SETS }) }
  ],
  challenge: { inst: "★ 도전 — 수 카드 2, 4, 5, 8을 한 번씩 모두 사용하여 (진분수)÷(진분수)를 만들려고 해요. 몫이 가장 큰 나눗셈을 만들고 계산해 보세요.", hints: ["나누어지는 수는 크게, 나누는 수는 작게 만들어요.", "진분수여야 하니 분자가 분모보다 작아야 해요. 여러 식을 계산해 비교해 봐요."],
    render: (b, a) => fd6Build(b, a, { cards: [2, 4, 5, 8], boards: [{ shape: [[null, null], [null, null]], goal: "max", proper: true, label: "몫이 가장 큰 (진분수)÷(진분수)", msg: "몫이 더 큰 나눗셈을 만들 수 있어요. 나누어지는 수는 1에 가깝게, 나누는 수는 작게 만들어 봐요." }], ok: "몫이 가장 큰 나눗셈은 [4/5]÷[2/8] = [3 1/5]이에요." }) }
},
{
  id: "s11", no: 11, title: "수련회 발표회 ― 공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분수의 나눗셈을 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
  summary: "분모가 같은 (분수)÷(분수)는 분자끼리 나누어요. 분모가 다르면 통분한 다음 분자끼리 나누어요. (자연수)÷(분수)는 자연수를 분자로 나누고 분모를 곱해요. (분수)÷(분수)는 나누는 분수의 분자와 분모를 바꾸어 곱해도 돼요. (대분수)÷(분수)는 대분수를 가분수로 바꾸어 계산해요. 나누는 수가 1보다 작으면 몫이 나누어지는 수보다 커져요.",
  steps: [
    { name: "만져 보기 — 띠로 확인하기", inst: "수련회 발표회 첫 순서예요. [9/10]÷[3/10]을 띠에서 덜어 내 보고 계산해 보세요.", hints: ["[9/10]는 [1/10]이 9개예요.", "9÷3을 계산해요."],
      render: (b, a) => fd6Scoop(b, a, { A: "9/10", B: "3/10", ask: [
        ["[9/10]는 [1/10]이 ", { i: "9" }, "개이고, [3/10]은 [1/10]이 ", { i: "3" }, "개예요."],
        ["[9/10]÷[3/10] = ", { i: "9" }, "÷", { i: "3" }, " = ", { i: "3" }]], ok: "[9/10]÷[3/10] = 9÷3 = 3이에요." }) },
    { name: "그려 보기 — 계산하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도, 약분하지 않아도 맞아요.", hints: ["[7/8]÷[7/16] = [14/16]÷[7/16]이에요.", "[2 1/5]÷[3/10] = [11/5]×[10/3]이에요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[5/9]÷[8/9]", a: "5/8" }, { e: "[7/8]÷[7/16]", n: 2 }, { e: "12÷[4/7]", n: 21 }, { e: "[2 1/5]÷[3/10]", a: "7 1/3" }]) },
    { name: "말해 보기 — 장작 1 m의 무게", inst: "캠프파이어에 쓴 굵기가 일정한 장작 [3/4] m의 무게가 [4 1/2] kg이에요. 이 장작 1 m의 무게는 몇 kg일까요? 표시를 [1/4] m, 1 m로 옮겨 본 다음 두 가지 방법으로 구해 보세요.", hints: ["[4 1/2] = [9/2]예요.", "방법 1은 통분하여 분자끼리, 방법 2는 분수의 곱셈으로 계산해요."],
      render: (b, a) => fd6Double(b, a, { items: [{ Q: "4 1/2", a: 3, b: 4, top: " kg", bot: " m", name: "장작" }], ask: [
        { t: "방법 1", p: ["[4 1/2]÷[3/4] = ", { q: [null, "?9", "2"] }, "÷[3/4] = ", { q: [null, "?18", "4"] }, "÷[3/4] = ", { i: "18" }, "÷", { i: "3" }, " = ", { i: "6" }] },
        { t: "방법 2", p: ["[4 1/2]÷[3/4] = [9/2]×", { q: [null, "?4", "?3"] }, " = ", { q: [null, "?36", "6"] }, " = ", { i: "6" }] }], ok: "장작 1 m의 무게는 6 kg이에요." }) },
    { name: "약속하기 — 고치고 알려 주기", inst: "도현이가 [2 2/5]÷[3/5]을 계산했는데 답이 이상해요. 잘못된 까닭을 고르고 옳게 계산한 다음, 도현이에게 바르게 계산하는 방법을 알려 주는 말을 써 보세요. 도현이의 계산: [2 2/5]÷[3/5] = 2와 ([2/5]÷[3/5]) = [2 2/3]", hints: ["대분수를 가분수로 바꾸지 않았어요. [2 2/5] = [12/5]예요.", "[12/5]÷[3/5] = 12÷3이에요."],
      render: (b, a) => { fd6Chain(b, a, [
        ["까닭: ", { c: ["대분수를 가분수로 바꾸지 않고 진분수 부분만 나누었어요", "나누는 분수를 그대로 곱했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[2 2/5]÷[3/5] = ", { q: [null, "?12", "5"] }, "÷[3/5] = ", { i: "12" }, "÷", { i: "3" }, " = ", { i: "4" }] }],
        { ok: "옳은 답은 4예요. 이제 아래에 알려 주는 말을 써요." });
        writeStep(b, a, [{ q: "도현이에게 바르게 계산하는 방법을 알려 주는 말을 써 보세요.", tag: "알려 주는 말", ph: "도현아, 대분수는 먼저 ~", help: ["① 도현이가 잘못한 곳을 한 가지 짚어요. → ② 바르게 계산하는 차례를 알려 줘요.", "‘도현아, 대분수는 먼저 ~로 바꾼 다음에 ~해야 해. 그러면 ~가 나와.’ 꼴로 써요."],
          ans: "도현아, 대분수는 먼저 가분수 [12/5]로 바꾼 다음에 나누어야 해. 그러면 [12/5]÷[3/5] = 12÷3 = 4가 나와." }], { ok: "고치고 알려 주기까지 했어요!" }); } },
    { name: "확인하기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["분수의 나눗셈을 배우기 전의 생각을 떠올려요.", "분자끼리 나누기, 통분, 나누는 분수의 분자와 분모를 바꾸어 곱하기, 몫이 커질 수도 있는 것을 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "배우기 전의 생각", ex: ["예전에는 나눗셈을 하면 몫이 항상 작아진다고 생각했어요.", "예전에는 분모가 다른 분수끼리 어떻게 나누는지 몰랐어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 1보다 작은 수로 나누면 몫이 나누어지는 수보다 커진다는 것을 알아요.", "지금은 나누는 분수의 분자와 분모를 바꾸어 곱하면 된다는 것을 알아요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["버스가 [3/4]시간 동안 45 km를 갈 때 1시간 동안 60 km를 가는 것을 수직선에서 보고 바뀌었어요.", "솔숲 길과 개울 길 띠의 칸을 똑같이 나누어 덜어 내 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "★★ 도전 — 수련원 화단 문제를 풀어 보세요.", hints: ["(직사각형의 넓이) = (가로)×(세로)예요.", "1 m²에 뿌린 퇴비는 (퇴비의 양)÷(넓이)예요."],
    render: (b, a) => fd6Calc(b, a, [
      { q: "4÷[3/8] > □ 에서 □ 안에 들어갈 수 있는 가장 큰 자연수는?", n: 10, lab: "□ =", why: { "11": "4÷[3/8] = [32/3] = [10 2/3]예요. 11은 몫보다 커요." } },
      { q: "가로 [5/6] m, 세로 [3/5] m인 직사각형 모양 화단의 넓이는 몇 m²일까요?", x: "[5/6]×[3/5]", a: "1/2", unit: "m²", lab: "[5/6]×[3/5] =" },
      { q: "이 화단에 퇴비 [3/4] kg을 고르게 뿌렸어요. 화단 1 m²에 뿌린 퇴비는 몇 kg일까요?", x: "[3/4]÷[1/2]", a: "1 1/2", unit: "kg", lab: "[3/4]÷[1/2] =" }],
      { ok: "화단 1 m²에 퇴비 [1 1/2] kg을 뿌렸어요. 다음 단원에서는 소수의 나눗셈을 공부해요." }) }
}
];
