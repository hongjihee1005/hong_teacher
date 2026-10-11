//@@APP
const APP={title:"우리 반 텃밭 가꾸기", unit:"5-1 수학 5. 분수의 덧셈과 뺄셈", key:"s51-fracadd-v1", welcome:"우리 반 텃밭 가꾸기 교실에 온 것을 환영해요", intro:"새솔초등학교 5학년 2반 친구들과 학교 텃밭을 가꾸며, 물·거름·고랑 길이·수확한 채소의 양을 분모가 다른 분수로 통분하여 더하고 빼 봐요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u5-fracadd.tb.js)의 fa5 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   (입력칸 0.9초 · 고르기 0.26초 · 색칠·끌기·카드 넣기 1.2초) 대분수는 쓰는 중에 확인하지 않아요(fa5In.full). 이 파일에서 새로 만든 그림은 앞글자 fa5s. */
/* ===== 5. 분수의 덧셈과 뺄셈 단원 조작 부품 (앞글자 fa5) =====
   4-2 「분수의 덧셈과 뺄셈」(분모가 같은 분수) 부품을 바탕으로, 분모가 다른 분수에 맞게 고쳤어요.
   글 속 분수 표기: [3/7] 진분수·가분수, [2 1/4] 대분수, [□/5]·[3+5/7](분자에 식)도 됨.
   채점은 값으로 해요: 약분하지 않은 분수, 가분수, 대분수 모두 정답이에요(지도서 채점 원칙). */
/*fa5-core*/
const FA5_SRC = "\\[(?:(\\d+|□) )?([0-9□]+(?:[+−×-][0-9□]+)?)\\/([0-9□]+(?:×[0-9□]+)?)\\]";
const fa5Re = () => new RegExp(FA5_SRC, "g");
/* 칸에 쓴 글(자연수·분자·분모) → 수 */
function fa5Raw(ws, ns, ds) {
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
function fa5Str(s) {
  s = String(s).trim().replace(/^\[|\]$/g, "").trim();
  let m = s.match(/^(\d+)$/); if (m) return fa5Raw(m[1], "", "");
  m = s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/); if (m) return fa5Raw(m[1] || "", m[2], m[3]);
  return null;
}
const fa5Eq = (a, b) => a.num * b.den === b.num * a.den;
const fa5G = (a, b) => b ? fa5G(b, a % b) : Math.abs(a);
function fa5R(num, den) { const g = fa5G(num, den) || 1; return { num: num / g, den: den / g }; }
/* 분모가 den인 교과서 꼴: 대분수(자연수) */
function fa5Form(num, den) { const w = Math.floor(num / den), r = num % den; return r === 0 ? String(w) : w === 0 ? `${r}/${den}` : `${w} ${r}/${den}`; }
const fa5Tk = s => /\//.test(String(s)) ? `[${s}]` : String(s);
/* 교과서 답 표기: 대분수(=가분수) */
function fa5Book(num, den) {
  const m = fa5Form(num, den), imp = `[${num}/${den}]`;
  if (num % den === 0) return num > 0 && den > 1 ? `${m} (=${imp})` : m;
  return num > den ? `${fa5Tk(m)} (=${imp})` : fa5Tk(m);
}
/* 식 계산: "[1 3/5]+[2 4/5]", "3−[1 3/4]", "4−[1 1/8]−[5/8]" (덧셈·뺄셈만) */
function fa5Eval(e) {
  let rest = String(e).replace(/−/g, "-").replace(/\s+/g, " ").trim(), acc = null, op = "+";
  while (rest.length) {
    const m = rest.match(/^(\[[^\]]+\]|\d+)\s*/); if (!m) return null;
    const v = fa5Str(m[1]); if (!v || v.err) return null;
    acc = acc == null ? fa5R(v.num, v.den) : fa5R(op === "+" ? acc.num * v.den + v.num * acc.den : acc.num * v.den - v.num * acc.den, acc.den * v.den);
    rest = rest.slice(m[0].length);
    if (!rest.length) break;
    const o = rest.match(/^([+\-])\s*/); if (!o) return null;
    op = o[1]; rest = rest.slice(o[0].length);
  }
  return acc;
}
function fa5Den(s) { const m = String(s || "").match(/\/(\d+)\]?/); return m ? +m[1] : 0; }
/* 받침에 맞는 조사(분수는 분자를 마지막에 읽으므로 분자의 끝 숫자 기준): fa5J("[3/7]", "은는") → "[3/7]은" */
function fa5J(s, pair) {
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
function fa5Judge(r, a) {
  if (r.err === "empty") return { code: "empty", msg: "빈칸에 답을 써요." };
  if (r.err === "half") return { code: "half", msg: "분수는 분자와 분모를 모두 써요." };
  if (r.err) return { code: "bad", msg: "칸에는 수만 써요." };
  const t = fa5Str(a);
  if (!fa5Eq(r, t)) return { code: "wrong" };
  if (r.hasF && r.hasW && r.n >= r.d) return { code: "improper", msg: `값은 맞아요. 그런데 분수 부분 ${fa5J(`[${r.n}/${r.d}]`, "은는")} 1이거나 1보다 커요. 1만큼을 자연수 부분으로 옮겨 대분수로 쓰거나, 가분수로 써요.` };
  if (r.hasF && r.n === 0) return { code: "zero", msg: "분자가 0이면 자연수만 써요." };
  return { code: "ok" };
}
function fa5Key(r) { return r.err ? "" : r.hasF ? (r.hasW ? `${r.w} ${r.n}/${r.d}` : `${r.n}/${r.d}`) : String(r.w); }
/* 유리수 셈 */
const fa5Q = (num, den) => fa5R(num, den);
const fa5Add = (x, y, s = 1) => fa5R(x.num * y.den + s * y.num * x.den, x.den * y.den);
const fa5Lcm = (a, b) => a / fa5G(a, b) * b;
/* 흔한 실수 찾기 (분모가 다른 두 수의 덧셈·뺄셈) — 지도서 오류 유형 */
function fa5Diag(e, r) {
  if (!e || !r || r.err) return null;
  const m = String(e).replace(/−/g, "-").match(/^\s*(\[[^\]]+\]|\d+)\s*([+\-])\s*(\[[^\]]+\]|\d+)\s*$/); if (!m) return null;
  const A = fa5Str(m[1]), B = fa5Str(m[3]), sg = m[2] === "-" ? -1 : 1;
  if (!A || !B || A.err || B.err || !A.hasF || !B.hasF) return null;
  const T = fa5Add(A, B, sg), R = { num: r.num, den: r.den }, eq = v => fa5Eq(R, v);
  const fA = fa5Q(A.n, A.d), fB = fa5Q(B.n, B.d), W = A.w + sg * B.w;
  /* 분모끼리, 분자끼리 */
  if (A.d !== B.d && A.d + sg * B.d > 0 && A.n + sg * B.n >= 0) {
    const bad = fa5Add(fa5Q(W, 1), fa5Q(A.n + sg * B.n, A.d + sg * B.d));
    if (eq(bad) && !eq(T)) return `분모는 분모끼리, 분자는 분자끼리 ${sg > 0 ? "더하면" : "빼면"} 안 돼요. 먼저 두 분수를 통분해서 분모를 같게 만들어요.`;
  }
  /* 분모만 바꾸고 분자는 그대로 */
  if (r.hasF && r.d % A.d === 0 && r.d % B.d === 0 && A.d !== B.d && A.n + sg * B.n >= 0) {
    const bad = fa5Add(fa5Q(W, 1), fa5Q(A.n + sg * B.n, r.d));
    if (eq(bad) && !eq(T)) return `분모만 ${fa5J(r.d, "으로")} 바꾸고 분자는 그대로 두었어요. 분모에 곱한 수를 분자에도 곱해야 크기가 같은 분수가 돼요.`;
  }
  if (sg > 0 && (A.w || B.w) && fa5Add(fA, fB).num >= fa5Add(fA, fB).den && eq(fa5Add(T, fa5Q(1, 1), -1))) return "분수 부분끼리 더한 값이 1이거나 1보다 커요. 그 1을 자연수 부분에 더해야 해요.";
  if (sg < 0 && A.w >= 1) {
    const fd = fa5Add(fA, fB, -1);
    if (fd.num < 0) {
      if (eq(fa5Add(fa5Q(A.w - B.w, 1), fa5Add(fB, fA, -1)))) return "분수 부분끼리 뺄 수 없는데 작은 분수에서 큰 분수를 거꾸로 뺐어요. 자연수 부분에서 1만큼을 분수로 바꾸어 빼요.";
      if (eq(fa5Add(T, fa5Q(1, 1)))) return "1만큼을 분수로 바꾸었으면 자연수 부분은 1 작아져요.";
    } else if (fd.num > 0 && A.w > B.w && eq(fa5Add(fa5Q(A.w - B.w, 1), fd, -1))) return "자연수끼리 뺀 결과와 분수끼리 뺀 결과는 더해야 해요. (자연수 부분) + (분수 부분)이에요.";
  }
  return null;
}
/* 읽기 글: [3/7] → 7분의 3, [2 1/4] → 2와 4분의 1 */
function fa5Plain(s) {
  return String(s == null ? "" : s).replace(fa5Re(), (m, w, n, d) => `${w ? w + "와 " : ""}${d}분의 ${n}`);
}
/*fa5-core-end*/

function fa5Style() {
  if (document.getElementById("fa5-style")) return;
  const s = document.createElement("style"); s.id = "fa5-style";
  s.textContent = `
.fa5fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.fa5fw{margin-right:.1em}
.fa5q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.fa5q>.fa5n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.fa5q>.fa5d{padding:.05em .14em 0}
.fa5frin .fa5q{font-size:.92em}
.fa5frin .fa5n{padding-bottom:.14em}.fa5frin .fa5d{padding-top:.14em}
.fa5inp{display:inline-flex;align-items:center;gap:.15em;vertical-align:middle}
.fa5qi{display:inline-flex;flex-direction:column;align-items:stretch;gap:.12em}
.fa5bar{display:block;height:.17em;background:var(--ink);border-radius:.1em}
input.fa5i,input.fa5box{box-sizing:border-box;width:2.3em;height:1.65em;padding:0;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.fa5iw{height:2.1em;width:2.1em}
input.fa5box.fa5wide{width:3.6em}
.fa5eq{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .45em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin-top:.25em}
.fa5lab{color:var(--pine)}
.fa5res{color:var(--ok);font-size:.85em}
.fa5cl{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .3em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin:.4em 0;line-height:1.9}
.fa5tag{background:var(--pine-soft);color:var(--pine);border-radius:.5em;padding:0 .55em;font-size:.82em}
.fa5chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.fa5chs .opt{padding:.05em .55em}
.fa5stage{margin:.2em 0 .4em}
.fa5stage svg{width:100%;height:auto;max-height:66vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.fa5tip{font-family:Jua,sans-serif;color:var(--night);margin:.3em 0}
.fa5tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.4em 0}
.fa5tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em}
.fa5tools button.fa5on{background:var(--night);color:#fff;border-color:var(--night)}
.fa5est{background:var(--ring-soft);border-radius:.6em;padding:.4em .7em;margin-bottom:.4em}
.fa5ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.fa5grp{border:2px solid var(--line);border-radius:.8em;padding:.4em .7em;margin:.45em 0}
.fa5grp .fa5gt{font-family:Jua,sans-serif;color:var(--night)}
.fa5grp .fa5gi{display:inline-flex;flex-wrap:wrap;align-items:center;gap:.3em;margin:.25em 1.2em .25em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08)}
.fa5pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:2.6em;margin:.3em 0 .6em}
.fa5bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,11em),1fr));gap:.6em}
.fa5bin{border:2px dashed var(--line);border-radius:.8em;padding:.4em;min-height:5em;display:flex;flex-direction:column;gap:.35em}
.fa5binh{font-family:Jua,sans-serif;background:var(--pine-soft);color:var(--pine);border:0;border-radius:.6em;padding:.3em .6em}
.fa5binl{display:flex;flex-wrap:wrap;gap:.35em}
.opt.fa5on{border-color:var(--ring);background:var(--ring-soft)}
.fa5crd{font-family:Jua,sans-serif}
.fa5mt{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.6em 1.4em;align-items:start}
.fa5mc{display:flex;flex-direction:column;gap:.5em}
.fa5mc .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);text-align:center}
.fa5badge{display:inline-grid;place-items:center;min-width:1.5em;height:1.5em;border-radius:50%;color:#fff;font-size:.8em;margin-left:.3em}
.fa5cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.fa5cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2em;text-align:center}
.fa5slot{min-width:1.7em;min-height:1.5em;font-family:Jua,sans-serif;border:2px dashed var(--ring);border-radius:.4em;background:#fff;padding:0 .2em}
.fa5lad{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.fa5lad>*{display:flex;flex-direction:column;align-items:center;gap:.25em;padding:0 .15em;text-align:center}
.fa5lad .opt{font-family:Jua,sans-serif;width:100%;text-align:center;padding:.35em .2em}
.fa5house{font-family:Jua,sans-serif;color:var(--pine);font-size:.9em}
.fa5lsvg svg{width:100%;height:auto;display:block}
.fa5score{width:100%;border-collapse:collapse;font-size:var(--fs-s);margin-top:.4em}
.fa5score td,.fa5score th{border:1px solid var(--line);padding:.2em .35em;text-align:center}
.fa5score th{background:var(--pine-soft);font-weight:400;font-family:Jua,sans-serif}
.fa5card2{border:3px solid var(--night);border-radius:var(--r);padding:.5em .8em;background:#fff;display:flex;flex-wrap:wrap;gap:.4em 1.6em;margin:.3em 0}
.fa5card2>div{min-width:12em}
.fa5card2 b{color:var(--pine);font-family:Jua,sans-serif;font-weight:400}
`;
  document.head.append(s);
}
/* 분수 모양 요소 */
function fa5FracEl(w, n, d) {
  return h("span", { class: "fa5fr" }, w != null && w !== "" ? h("span", { class: "fa5fw" }, String(w)) : null,
    h("span", { class: "fa5q" }, h("span", { class: "fa5n" }, String(n)), h("span", { class: "fa5d" }, String(d))));
}
function fa5RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = fa5Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(fa5FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function fa5RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return fa5RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(fa5RenderText);
}
(function fa5Boot() {
  fa5Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") fa5RenderText(m.target); else m.addedNodes.forEach(fa5RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(fa5Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
/* 엔진 부품의 '답 따라 쓰기' 글은 읽는 말(7분의 3)로 바꿔 줌 */
/* 엔진 부품의 '답 따라 쓰기' 글은 읽는 말(7분의 3)로 바꿔 줌 */
function fa5A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(fa5Plain) }) }); }
const fa5Quiz0 = quiz, fa5Blanks0 = blanks;
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done(을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return fa5Quiz0(body, fa5A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return fa5Blanks0(body, fa5A(api), parts, o); };

function fa5Gate(api, ready, msg) {
  return Object.assign({}, api, { done: (ans, m, lv) => ready() ? api.done(ans, m, lv) : api.fail(typeof msg === "function" ? msg() : msg, ans) });
}
const FA5_F = ["#F6C08A", "#9CC6EC", "#A9D8A2", "#D7B5E6"], FA5_S = ["#D9822B", "#2B7BD6", "#2E8B57", "#8E5BC9"];
/* SVG 글: [분수] 표기를 쌓은 분수로 그림 */
function fa5Cw(ch, s) { return /[가-힣]/.test(ch) ? s * .95 : /[0-9]/.test(ch) ? s * .56 : ch === " " ? s * .3 : /[A-Za-z]/.test(ch) ? s * .55 : s * .6; }
function fa5Segs(str) {
  const out = []; let last = 0; const re = fa5Re(); let m;
  while ((m = re.exec(str))) { if (m.index > last) out.push({ t: str.slice(last, m.index) }); out.push({ w: m[1], n: m[2], d: m[3] }); last = m.index + m[0].length; }
  if (last < str.length) out.push({ t: str.slice(last) });
  return out;
}
function fa5SvgLine(str, x, y, size = 24, opt = {}) {
  const g = svgEl("g", { "pointer-events": "none" }), fs = size * .8, fill = opt.fill || INK;
  const tw = t => [...t].reduce((a, c) => a + fa5Cw(c, size), 0);
  const fw = s => Math.max(String(s.n).length, String(s.d).length) * fs * .6 + 8;
  const segs = fa5Segs(String(str));
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
function fa5In(label) {
  const mk = (cls, al) => {
    const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "fa5i " + cls, "aria-label": (label ? fa5Plain(label) + " " : "") + al });
    i.addEventListener("input", () => { const v = i.value.replace(/[^0-9]/g, "").slice(0, 3); if (v !== i.value) i.value = v; });
    return i;
  };
  const w = mk("fa5iw", "자연수 부분"), n = mk("fa5in", "분자"), d = mk("fa5id", "분모");
  const el = h("span", { class: "fa5inp" }, w, h("span", { class: "fa5qi" }, n, h("span", { class: "fa5bar" }, "​"), d));
  el.get = () => fa5Raw(w.value, n.value, d.value);
  el.paint = ok => [w, n, d].forEach(x => { x.style.borderColor = ok == null ? "" : ok ? "var(--ok)" : "var(--no)"; });
  el.text = () => { const r = el.get(); return r.err ? "-" : fa5Key(r); };
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
function fa5Hook(el, auto) {
  el.addEventListener("input", auto); el.addEventListener("change", auto);
  el.addEventListener("focusout", () => setTimeout(auto, 0));
  el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); if (e.target.blur) e.target.blur(); } });
}
function fa5Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 3, class: "fa5box", "aria-label": "빈칸" });
  i.exp = String(exp); i.full = () => i.value.trim() !== ""; i.sig = () => i.value.trim();
  return i;
}
/* 어림 상자 */
function fa5EstBox(api, e, onOk) {
  const row = h("div", { class: "opts" });
  e.o.forEach((c, i) => row.append(h("button", { class: "opt", onclick: ev => {
    [...row.children].forEach(x => x.classList.remove("good", "bad", "on"));
    if (i === e.a) { ev.currentTarget.classList.add("good"); onOk(); api.hint(e.ok || "좋아요. 이제 정확하게 구해 봐요."); }
    else { ev.currentTarget.classList.add("bad"); api.fail((e.why && e.why[i]) || "자연수 부분만 보고 어림해 봐요.", "[어림] " + c); }
  } }, c)));
  return h("div", { class: "fa5est" }, h("div", { class: "jua" }, "먼저 어림해요 · " + e.q), row);
}

/* ① 식과 답 (값이 같으면 정답: 약분하지 않은 분수·가분수·대분수 모두)
   items: {q?, e:"[3/8]+[4/8]" (보이는 식) | x (확인용 식), a:"7/8", unit, den, why:{"학생 답":"까닭"}, lab, g:"묶음 제목"}
          | {q, e|x, n: 수} | {q, pick:[…], a: 번호, why:{번호:"까닭"}}  */
function fa5Calc(body, api, items, opt = {}) {
  fa5Style();
  const rows = []; const wrap = h("div");
  let grp = null, gName = null;
  items.forEach((it, k) => {
    const R = { it }; const ex = it.e || it.x;
    let host;
    if (it.g) {
      if (it.g !== gName) { gName = it.g; grp = h("div", { class: "fa5grp" }, h("div", { class: "fa5gt" }, it.g)); wrap.append(grp); }
      host = h("span", { class: "fa5gi" }); grp.append(host);
    } else {
      gName = null; const box = h("div", { class: "qitem" });
      if (it.q) box.append(h("div", { class: "jua" }, (items.filter(x => !x.g).length > 1 ? (k + 1) + ". " : "") + it.q));
      host = h("div", { class: "fa5eq" }); box.append(host); wrap.append(box);
    }
    if (it.pick) {
      R.kind = "pick"; R.sel = null;
      const row = h("span", { class: "opts" });
      it.pick.forEach((o, oi) => row.append(h("button", { class: "opt", onclick: ev => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); R.sel = oi; } }, o)));
      R.row = row; if (it.e) host.append(h("span", {}, it.e)); host.append(row);
    } else if (it.n != null) {
      R.kind = "n";
      if (ex && !it.noEval) { const v = fa5Eval(ex); if (!v || v.num !== it.n * v.den) throw new Error(`답 확인 필요: ${ex} = ${it.n}`); }
      R.inp = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "fa5box fa5wide", "aria-label": fa5Plain(it.lab || it.e || it.q || "답") });
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "fa5lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    } else {
      R.kind = "f";
      R.t = fa5Str(it.a); if (!R.t || R.t.err) throw new Error("답 형식 오류: " + it.a);
      R.den = it.den || fa5Den(ex) || fa5Den(it.a) || 1;
      if (ex && !it.noEval) { const v = fa5Eval(ex); if (!v || !fa5Eq(v, R.t)) throw new Error(`답 확인 필요: ${ex} = ${it.a}`); }
      R.inp = fa5In(it.lab || it.e || "답"); R.inp.tv = R.t;
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "fa5lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    }
    R.res = h("span", { class: "fa5res hidden" }, "​"); host.append(R.res);
    rows.push(R);
  });
  const ansText = R => {
    const head = fa5Plain(R.it.e || R.it.lab || "답");
    if (R.kind === "pick") return `${fa5Plain(R.it.q || R.it.e || "")} ${fa5Plain(R.it.pick[R.it.a])}`.trim();
    if (R.kind === "n") return `${head} ${R.it.n}${R.it.unit ? " " + R.it.unit : ""}`;
    return `${head} ${fa5Plain(fa5Tk(R.it.a))}${R.it.unit ? " " + R.it.unit : ""}`;
  };
  api.provide({ words: opt.words || ["통분", "분모는 그대로", "분자끼리 계산", "자연수 부분", "분수 부분", "가분수", "대분수"], answers: rows.map(ansText) });
  const judge = () => {
    let bad = null, hint = null; const given = [];
    rows.forEach(R => {
      const it = R.it;
      if (R.kind === "pick") {
        const g = R.sel === it.a; [...R.row.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === R.sel) b.classList.add(g ? "good" : "bad"); });
        given.push(R.sel == null ? "-" : fa5Plain(it.pick[R.sel]));
        if (!g && !bad) bad = R.sel == null ? "고르지 않은 문제가 있어요." : (it.why && it.why[R.sel]) || "고른 것을 다시 살펴봐요.";
        return;
      }
      if (R.kind === "n") {
        const s = R.inp.value.replace(/[\s,]/g, ""), g = /^\d+$/.test(s) && +s === it.n;
        R.inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; given.push(s || "-");
        if (!g && !bad) bad = s === "" ? "빈칸에 답을 써요." : (it.why && it.why[s]) || opt.bad || "다시 생각해 봐요.";
        return;
      }
      const r = R.inp.get(), J = fa5Judge(r, it.a); given.push(R.inp.text());
      if (J.code === "ok") { R.inp.paint(true); return; }
      if (J.code === "zero") { R.inp.paint(null); if (!hint) hint = J.msg; return; }
      R.inp.paint(false);
      if (!bad) bad = (it.why && it.why[fa5Key(r)]) || J.msg || fa5Diag(it.e || it.x, r) || opt.bad || "두 분수를 통분한 다음 다시 계산해 봐요.";
    });
    if (bad) { api.fail(bad, given.join(" / ")); return false; }
    if (hint) { api.tryOnce(); api.hint(hint); return false; }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + fa5Book(num, den); R.res.classList.remove("hidden"); } });
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요! 약분하지 않아도, 가분수로 써도 맞아요.");
    return true;
  };
  const ready = () => {
    if (!rows.every(R => R.kind === "pick" ? R.sel != null : R.kind === "n" ? R.inp.value.trim() !== "" : R.inp.full())) return false;
    const m = opt.pre && opt.pre(); if (m) { api.hint(m); return false; }
    return true;
  };
  const auto = autoRun(ready, () => rows.map(R => R.kind === "pick" ? String(R.sel) : R.kind === "n" ? R.inp.value.trim() : R.inp.sig()).join("§"), judge, rows.some(R => R.kind !== "pick") ? 900 : 260);
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
  rows.forEach(R => { if (R.inp) fa5Hook(R.inp, auto); });
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return auto;
}

/* ② 차례대로 빈칸 채우기 (계산 과정)
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 수 칸 | {q:[자연수, 분자, 분모]} 각 자리는 고정값·"?답"(칸)·배열(["1","×","?8"]) | {f:"4 2/5"} 분수 입력(값 판정) | {c:[…], a}
   '='가 있고 한글이 없는 줄은 '='로 나눈 값이 모두 같은지 스스로 확인해요. */
function fa5Chain(body, api, rows, opt = {}) {
  fa5Style();
  const ins = [], chs = [], plains = [];
  const wrap = h("div");
  const ex = v => v == null ? "" : Array.isArray(v) ? v.map(ex).join("") : String(v)[0] === "?" ? String(v).slice(1) : String(v);
  const jsNum = v => ex(v).replace(/−/g, "-").replace(/×/g, "*");
  const jsStr = s => String(s).replace(fa5Re(), (m, w, n, d) => `(${w && w !== "□" ? w : 0}+(${n.replace(/−/g, "-")})/(${d}))`).replace(/−/g, "-").replace(/×/g, "*");
  const cell = v => {
    if (v == null) return null;
    if (Array.isArray(v)) return h("span", { style: "display:inline-flex;align-items:center;gap:.1em" }, v.map(cell));
    if (String(v)[0] === "?") { const b = fa5Box(String(v).slice(1)); ins.push(b); return b; }
    return h("span", {}, String(v));
  };
  rows.forEach(row => {
    const parts = Array.isArray(row) ? row : row.p;
    const line = h("div", { class: "fa5cl" });
    if (row.t) line.append(h("span", { class: "fa5tag" }, row.t));
    let plain = row.t ? row.t + " " : "", js = "", hangul = false;
    parts.forEach(pt => {
      if (typeof pt === "string" || typeof pt === "number") {
        const s = String(pt); line.append(h("span", {}, s)); plain += fa5Plain(s) + " "; js += jsStr(s); if (/[가-힣□]/.test(s)) hangul = true;
      } else if (pt.i != null) {
        const b = fa5Box(pt.i); ins.push(b); line.append(b); plain += pt.i + " "; js += `(${pt.i})`;
      } else if (pt.q) {
        const [W, N, D] = pt.q;
        line.append(h("span", { class: "fa5fr fa5frin" }, W != null ? h("span", { class: "fa5fw" }, cell(W)) : null, h("span", { class: "fa5q" }, h("span", { class: "fa5n" }, cell(N)), h("span", { class: "fa5d" }, cell(D)))));
        plain += fa5Plain(`[${W != null ? ex(W) + " " : ""}${ex(N)}/${ex(D)}]`) + " ";
        js += `(${W != null ? jsNum(W) : 0}+(${jsNum(N)})/(${jsNum(D)}))`;
      } else if (pt.f) {
        const fi = fa5In("답"); fi.target = pt.f; fi.tv = fa5Str(pt.f); ins.push(fi); line.append(fi);
        plain += fa5Plain(fa5Tk(pt.f)) + " "; const v = fa5Str(pt.f); js += `(${v.num}/${v.den})`;
      } else if (pt.c) {
        const C = { a: pt.a, sel: null }; const sp = h("span", { class: "fa5chs" });
        pt.c.forEach((o, oi) => sp.append(h("button", { class: "opt", onclick: ev => { [...sp.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); C.sel = oi; } }, o)));
        C.el = sp; chs.push(C); line.append(sp); plain += fa5Plain(pt.c[pt.a]) + " "; hangul = true;
      }
    });
    wrap.append(line); plains.push(plain.replace(/\s+/g, " ").trim());
    if (!hangul && js.includes("=")) {
      const vals = js.split("=").filter(s => s.trim()).map(s => { try { return Function(`return (${s})`)(); } catch (e) { return NaN; } });
      if (vals.some(v => !isFinite(v) || Math.abs(v - vals[0]) > 1e-9)) throw new Error("식 확인 필요: " + plain);
    }
  });
  api.provide({ words: opt.words || ["통분", "분모는 그대로", "분자끼리", "자연수 부분끼리", "분수 부분끼리", "가분수"], answers: plains });
  const judge = () => {
    let ok = true, hint = null; const given = [];
    ins.forEach(x => {
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = fa5Judge(x.get(), x.target); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "zero") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
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
  ins.forEach(x => fa5Hook(x, auto));
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return auto;
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 */
function fa5Ask(host, api, ready, msg, opt) {
  const g = fa5Gate(api, ready, msg), pre = () => ready() ? null : (typeof msg === "function" ? msg() : msg);
  if (opt.ask) return fa5Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad, pre });
  if (opt.askCalc) return fa5Calc(host, g, opt.askCalc, { ok: opt.ok, pre });
  api.provide({ words: [], answers: [] });
  /* 물을 것이 없으면 조작을 마치는 대로 저절로 통과 */
  return autoRun(ready, () => "ok", () => { api.tryOnce(); api.done("조작 완료", opt.ok); return true; }, 1200);
}

/* ③ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function fa5Sort(body, api, opt) {
  fa5Style();
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "fa5pool" }), binsEl = h("div", { class: "fa5bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "fa5binl" }); binsEl.append(h("div", { class: "fa5bin", onclick: e => { if (e.target.closest(".fa5crd")) return; put(bi); } }, h("button", { class: "fa5binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt fa5crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  let auto = () => {};
  function draw() { els.forEach((el, ci) => { el.classList.toggle("fa5on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); auto(); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => fa5Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "fa5tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "카드를 모두 넣으면 저절로 확인해요."));
  auto = autoRun(() => where.every(w => w >= 0), () => where.join(","), () => {
    let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
    const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
    if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok); return true;
  }, 1200);
}

/* ④ 관계있는 것끼리 잇기: left [{t,k}], right [{t,k|null}] (값을 계산해 짝이 맞는지 스스로 확인) */
function fa5Match(body, api, opt) {
  fa5Style();
  const L = opt.left, R = opt.right, pair = L.map(() => -1); let sel = null;
  L.forEach(l => { const v = fa5Eval(l.t); R.forEach(r => { const w = fa5Eval(r.t); if (!v || !w || fa5Eq(v, w) !== (r.k === l.k)) throw new Error("잇기 확인 필요: " + l.t + " / " + r.t); }); });
  const COL = ["#2B7BD6", "#D9822B", "#2E8B57"];
  const lb = L.map((l, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; draw(); } }, l.t));
  const rb = R.map((r, j) => h("button", { class: "opt", onclick: () => { if (sel == null) return api.hint("먼저 왼쪽 식을 눌러요."); pair[sel] = pair[sel] === j ? -1 : j; sel = null; draw(); } }, r.t));
  const badge = (i) => h("span", { class: "fa5badge", style: `background:${COL[i % 3]}` }, String(i + 1));
  let auto = () => {};
  function draw() {
    auto();
    lb.forEach((b, i) => { b.classList.toggle("fa5on", sel === i); b.classList.remove("good", "bad"); [...b.querySelectorAll(".fa5badge")].forEach(x => x.remove()); b.append(badge(i)); });
    rb.forEach((b, j) => { b.classList.remove("good", "bad"); [...b.querySelectorAll(".fa5badge")].forEach(x => x.remove()); pair.forEach((p, i) => { if (p === j) b.append(badge(i)); }); });
  }
  draw();
  api.provide({ words: [], answers: L.map(l => `${fa5Plain(l.t)} — ${fa5Plain(R.find(r => r.k === l.k).t)}`) });
  body.append(h("p", { class: "fa5tip" }, "왼쪽 식을 누르고, 값이 같은 오른쪽 식을 눌러 이어요. 짝이 없는 식도 있어요."),
    h("div", { class: "fa5mt" }, h("div", { class: "fa5mc" }, lb), h("div", { class: "fa5mc" }, rb)),
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "왼쪽 식을 모두 이으면 저절로 확인해요."));
  auto = autoRun(() => pair.every(p => p >= 0), () => pair.join(","), () => {
    let ok = true; pair.forEach((p, i) => { const g = R[p].k === L[i].k; lb[i].classList.add(g ? "good" : "bad"); if (!g) ok = false; });
    const given = pair.map((p, i) => `${i + 1}-${p + 1}`).join(", ");
    if (!ok) { api.fail("값을 계산해 보고 다시 이어요. 통분하여 비교하면 편리해요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok || "값이 같은 식끼리 잘 이었어요!"); return true;
  }, 1200);
}

/* ⑤ 통분 막대: 두 분수 막대의 한 칸을 똑같이 더 잘게 나누어 조각의 크기를 같게 만들어요.
   opt: A, B(진분수), names, op("+"|"-"|null), d(이 크기로 맞추기), ask·askCalc, ok — 다 하면 fa5Ask가 api.done( 을 불러요 */
function fa5Split(body, api, opt) {
  fa5Style();
  /* 다 하면 fa5Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};   /* 조작할 때마다 저절로 확인 시계를 다시 맞춰요 */
  const A = fa5Str(opt.A), B = fa5Str(opt.B), V = [A, B], names = opt.names || [opt.A, opt.B];
  if (V.some(v => !v || v.err || v.num >= v.den)) throw new Error("통분 막대는 진분수만: " + opt.A + ", " + opt.B);
  if (opt.op === "-" && fa5Add(A, B, -1).num <= 0) throw new Error("통분 막대 뺄셈 확인 필요");
  const k = [1, 1], MAXD = opt.maxd || 48, sg = opt.op === "-" ? -1 : 1;
  const W = 900, LX = 215, UW = 580, BH = 56, GP = 46;
  const svg = makeSvg(W, 100);
  const dOf = i => V[i].den * k[i], same = () => dOf(0) === dOf(1);
  const ctl = h("div");
  const labs = [0, 1].map(() => h("span", { class: "jua" }));
  const btn = (i, dk) => h("button", { onclick: () => { const nk = k[i] + dk; if (nk < 1) return; if (V[i].den * nk > MAXD) return api.hint(`그림으로는 한 막대를 ${MAXD}칸까지만 나눌 수 있어요. 더 작은 공통분모를 찾아봐요.`); k[i] = nk; draw(); } }, dk > 0 ? "더 잘게 ＋" : "－ 되돌리기");
  [0, 1].forEach(i => ctl.append(h("div", { class: "fa5tools" }, h("span", { class: "fa5tag", style: `border-left:8px solid ${FA5_F[i]}` }, names[i]), btn(i, -1), labs[i], btn(i, 1))));
  const readout = h("p", { class: "fa5tip" });
  const cellsRow = (y, d, fill, cross, label, labCol) => {
    for (let c = 0; c < d; c++) {
      const f = fill(c);
      svg.append(svgEl("rect", { x: LX + c * UW / d, y, width: UW / d, height: BH, fill: f || "#fff", stroke: INK, "stroke-width": d > 30 ? 1 : 1.6 }));
      if (cross && cross(c)) { const x0 = LX + c * UW / d, w = UW / d; svg.append(svgEl("line", { x1: x0 + w * .2, y1: y + 10, x2: x0 + w * .8, y2: y + BH - 10, stroke: "#C8472E", "stroke-width": 3 }), svgEl("line", { x1: x0 + w * .8, y1: y + 10, x2: x0 + w * .2, y2: y + BH - 10, stroke: "#C8472E", "stroke-width": 3 })); }
    }
    svg.append(svgEl("rect", { x: LX, y, width: UW, height: BH, fill: "none", stroke: INK, "stroke-width": 4 }));
    if (label) svg.append(fa5SvgLine(label, LX - 16, y + BH / 2, 24, { anchor: "end", fill: labCol || INK }));
  };
  const draw = () => {
    svg.innerHTML = ""; kick();
    let y = 16;
    [0, 1].forEach(i => {
      const d = dOf(i), n = V[i].num * k[i];
      cellsRow(y, d, c => c < n ? FA5_F[i] : null, null, names[i]);
      for (let c = 1; c < V[i].den; c++) svg.append(svgEl("line", { x1: LX + c * UW / V[i].den, y1: y - 4, x2: LX + c * UW / V[i].den, y2: y + BH + 4, stroke: INK, "stroke-width": 4 }));
      svg.append(fa5SvgLine(`= [${n}/${d}]`, LX + UW + 12, y + BH / 2, 24, { anchor: "start", fill: FA5_S[i] }));
      labs[i].textContent = k[i] === 1 ? `한 칸 그대로 → [${n}/${d}]` : `한 칸을 ${k[i]}칸으로 → [${n}/${d}]`;
      y += BH + GP;
    });
    if (same() && opt.op && (!opt.d || dOf(0) === opt.d)) {
      const d = dOf(0), a = V[0].num * k[0], b = V[1].num * k[1];
      if (sg > 0) {
        const t = a + b, rows = Math.ceil(t / d);
        for (let r = 0; r < rows; r++) { cellsRow(y, d, c => { const g = r * d + c; return g < a ? FA5_F[0] : g < t ? FA5_F[1] : null; }, null, r === 0 ? "합" : "", TENT); y += BH + 16; }
        svg.append(fa5SvgLine(`[${a}/${d}]+[${b}/${d}] = [${t}/${d}]`, LX + UW / 2, y + 14, 25, { fill: TENT })); y += 46;
      } else {
        cellsRow(y, d, c => c < a ? FA5_F[0] : null, c => c >= a - b && c < a, "차", TENT); y += BH + 16;
        svg.append(fa5SvgLine(`[${a}/${d}]−[${b}/${d}] = [${a - b}/${d}]`, LX + UW / 2, y + 14, 25, { fill: TENT })); y += 46;
      }
    }
    svg.setAttribute("viewBox", `0 0 ${W} ${y + 4}`);
    readout.textContent = same() ? (opt.d && dOf(0) !== opt.d ? `두 막대의 조각 크기가 같아졌어요([1/${dOf(0)}]). 이번에는 한 칸이 [1/${opt.d}]이 되게 맞춰 봐요.` : `두 막대의 조각 크기가 [1/${dOf(0)}]로 같아졌어요. 이것이 통분이에요!`)
      : `지금 한 칸의 크기: 위 [1/${dOf(0)}], 아래 [1/${dOf(1)}] — 아직 달라요.`;
  };
  draw();
  const ready = () => same() && (!opt.d || dOf(0) === opt.d);
  const ask = h("div", { class: "fa5ask" });
  body.append(h("p", { class: "fa5tip" }, opt.tip || "‘더 잘게’를 눌러 막대의 한 칸을 똑같이 더 잘게 나누어요. 두 막대의 조각 크기가 같아지게 만들어 보세요."), ctl, readout, h("div", { class: "fa5stage" }, svg), ask);
  kick = fa5Ask(ask, api, ready, () => !same() ? "먼저 두 막대의 조각 크기를 같게 만들어요. 두 분모의 공배수를 생각해 봐요." : `이번에는 한 칸이 [1/${opt.d}]이 되게 나누어요.`, opt);
}

/* ⑥ 두 대분수를 색칠하고 모으기: opt d(공통분모), A:{name,v}, B:{name,v}, est, ask·askCalc — 다 하면 fa5Ask가 api.done( 을 불러요 */
function fa5Fill(body, api, opt) {
  fa5Style();
  /* 다 하면 fa5Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};
  const d = opt.d, A = fa5Str(opt.A.v), B = fa5Str(opt.B.v), aN = A.num * d / A.den, bN = B.num * d / B.den;
  if (!Number.isInteger(aN) || !Number.isInteger(bN)) throw new Error("공통분모 확인 필요");
  const nb = Math.ceil(aN / d) + Math.ceil(bN / d);
  let cells = Array(nb * d).fill(0), cur = 1, merged = false, estOk = !opt.est;
  const W = 900, LX = 110, BW = 600, BH = 44, GP = 14, H = 24 + nb * (BH + GP);
  const svg = makeSvg(W, H);
  const count = k => cells.filter(c => c === k).length;
  const fA = aN % d, fB = bN % d, wA = (aN - fA) / d, wB = (bN - fB) / d, fb = wA + wB, carry = fA + fB >= d;
  const draw = () => {
    svg.innerHTML = ""; kick();
    for (let i = 0; i < nb; i++) {
      const y = 14 + i * (BH + GP), full = cells.slice(i * d, i * d + d).every(c => c);
      for (let c = 0; c < d; c++) {
        const k = i * d + c, v = cells[k];
        const r = svgEl("rect", { x: LX + c * BW / d, y, width: BW / d, height: BH, fill: v ? FA5_F[v - 1] : "#fff", stroke: INK, "stroke-width": 2, style: merged ? "" : "cursor:pointer" });
        if (!merged) r.addEventListener("click", () => { cells[k] = cells[k] === cur ? 0 : cur; draw(); stat(); });
        svg.append(r);
      }
      const hl = merged && carry && i === fb;
      svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: hl ? TENT : INK, "stroke-width": hl ? 7 : 4, "pointer-events": "none" }));
      if (merged && full) svg.append(txt(LX - 30, y + BH / 2, "1", 28, { fill: hl ? TENT : INK }));
      if (hl) svg.append(fa5SvgLine(`분수 부분끼리 모여 1`, LX + BW + 10, y + BH / 2, 18, { anchor: "start", fill: TENT }));
    }
  };
  const readout = h("p", { class: "fa5tip" });
  const stat = () => { readout.textContent = merged ? `모은 결과: ${fa5J(String(wA + wB + (carry ? 1 : 0)), "과와")} [${(fA + fB) % d}/${d}]만큼이에요.` : `${opt.A.name} 색칠 ${count(1)}칸, ${opt.B.name} 색칠 ${count(2)}칸 (막대 하나가 1, 한 칸은 [1/${d}])`; };
  const bA = h("button", { class: "fa5on", onclick: () => { cur = 1; bA.classList.add("fa5on"); bB.classList.remove("fa5on"); } }, `${opt.A.name} ${fa5Tk(opt.A.v)} 색칠하기`);
  const bB = h("button", { onclick: () => { cur = 2; bB.classList.add("fa5on"); bA.classList.remove("fa5on"); } }, `${opt.B.name} ${fa5Tk(opt.B.v)} 색칠하기`);
  bA.style.borderLeft = `8px solid ${FA5_F[0]}`; bB.style.borderLeft = `8px solid ${FA5_F[1]}`;
  const mergeBtn = h("button", { onclick: () => {
    if (merged) return;
    if (count(1) !== aN || count(2) !== bN) return api.hint(`한 칸은 [1/${d}]이에요. 두 수를 분모가 ${d}인 분수로 바꾸어 색칠할 칸 수를 세어 봐요. 지금 ${count(1)}칸, ${count(2)}칸이에요.`);
    if (!estOk) return api.hint("먼저 위에서 어림해요.");
    merged = true; const out = [];
    for (let i = 0; i < wA * d; i++) out.push(1); for (let i = 0; i < wB * d; i++) out.push(2);
    for (let i = 0; i < fA; i++) out.push(1); for (let i = 0; i < fB; i++) out.push(2);
    while (out.length < cells.length) out.push(0);
    cells = out; draw(); stat();
    api.hint(carry ? `자연수 부분끼리 모으고, 분수 부분끼리 모았더니 [${fA}/${d}]+[${fB}/${d}]에서 1이 생겼어요!` : "자연수 부분끼리, 분수 부분끼리 모았어요.");
  } }, "모으기");
  const reset = h("button", { onclick: () => { cells = Array(nb * d).fill(0); merged = false; draw(); stat(); } }, "처음부터");
  draw(); stat();
  const ask = h("div", { class: "fa5ask" });
  if (opt.est) body.append(fa5EstBox(api, opt.est, () => { estOk = true; kick(); }));
  body.append(h("div", { class: "fa5tools" }, bA, bB, mergeBtn, reset), readout, h("div", { class: "fa5stage" }, svg), ask);
  kick = fa5Ask(ask, api, () => merged && estOk, () => !estOk ? "먼저 어림해요." : "두 수를 알맞게 색칠한 다음 ‘모으기’를 눌러요.", opt);
}

/* ⑦ 덜어 내기(×표): 공통분모 d로 나눈 막대. 자연수 1은 통째로 ×표 하거나 쪼개어 한 칸씩 ×표. opt d, m, s, unit, est, ask — 다 하면 fa5Ask가 api.done( 을 불러요 */
function fa5Take(body, api, opt) {
  fa5Style();
  /* 다 하면 fa5Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let kick = () => {};
  const d = opt.d, M = fa5Str(opt.m), Sb = fa5Str(opt.s), mN = M.num * d / M.den, sN = Sb.num * d / Sb.den;
  if (!Number.isInteger(mN) || !Number.isInteger(sN) || sN > mN) throw new Error("덜어 내기 확인 필요");
  const Wn = Math.floor(mN / d), rn = mN % d;
  const units = [];
  for (let i = 0; i < Wn; i++) units.push({ split: false, whole: false, part: d, cells: Array(d).fill(false) });
  if (rn) units.push({ split: true, whole: false, part: rn, cells: Array(d).fill(false), rest: true });
  let estOk = !opt.est;
  const crossed = () => units.reduce((a, u) => a + (u.split ? u.cells.filter(Boolean).length : u.whole ? d : 0), 0);
  const nU = units.length;
  const W = 900, H = 24 + nU * 70;
  const svg = makeSvg(W, H);
  const X = (g, x1, y1, x2, y2) => g.append(svgEl("line", { x1, y1, x2, y2, stroke: "#C8472E", "stroke-width": 4, "stroke-linecap": "round", "pointer-events": "none" }));
  const splitBtn = (u, x, y, w) => {
    const g = svgEl("g", { style: "cursor:pointer" });
    g.append(svgEl("rect", { x, y, width: w, height: 40, rx: 10, fill: u.split ? "#EEF2F0" : "#FDF1E8", stroke: u.split ? "#B9C4C0" : TENT, "stroke-width": 2 }));
    g.append(fa5SvgLine(u.split ? `1 = [${d}/${d}]` : "1을 쪼개기", x + w / 2, y + 20, u.split ? 20 : 19, { fill: u.split ? "#5B6B6B" : "#B85A22" }));
    if (!u.split) g.addEventListener("click", () => { u.split = true; u.whole = false; draw(); });
    return g;
  };
  const readout = h("p", { class: "fa5tip" });
  const draw = () => {
    svg.innerHTML = ""; kick();
    units.forEach((u, i) => {
      const BW = 560, x = 120, y = 14 + i * 70, BH = 48;
      if (!u.split) {
        const r = svgEl("rect", { x, y, width: BW, height: BH, fill: "#F7E3C4", stroke: INK, "stroke-width": 4, style: "cursor:pointer" });
        r.addEventListener("click", () => { u.whole = !u.whole; draw(); }); svg.append(r);
        svg.append(txt(x + BW / 2, y + BH / 2, opt.unit ? `1 ${opt.unit}` : "1", 26, { "pointer-events": "none" }));
        if (u.whole) { const g = svgEl("g"); X(g, x + 10, y + 6, x + BW - 10, y + BH - 6); X(g, x + BW - 10, y + 6, x + 10, y + BH - 6); svg.append(g); }
      } else {
        for (let c = 0; c < d; c++) {
          const live = c < u.part, cx = x + c * BW / d;
          const r = svgEl("rect", { x: cx, y, width: BW / d, height: BH, fill: live ? (u.cells[c] ? "#E9ECEB" : "#F7E3C4") : "#fff", stroke: live ? INK : "#B9C4C0", "stroke-width": d > 20 ? 1.2 : 2, "stroke-dasharray": live ? "" : "6 5", style: live ? "cursor:pointer" : "" });
          if (live) r.addEventListener("click", () => { u.cells[c] = !u.cells[c]; draw(); });
          svg.append(r);
          if (u.cells[c]) { const g = svgEl("g"), w = BW / d; X(g, cx + w * .2, y + 10, cx + w * .8, y + BH - 10); X(g, cx + w * .8, y + 10, cx + w * .2, y + BH - 10); svg.append(g); }
        }
        svg.append(svgEl("rect", { x, y, width: u.rest ? BW * u.part / d : BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
      }
      if (u.rest) svg.append(fa5SvgLine(`[${u.part}/${d}]`, x - 44, y + BH / 2, 22)); else svg.append(splitBtn(u, x + BW + 18, y + 4, 170));
    });
    readout.textContent = `×표 한 양: [1/${d}]이 ${crossed()}개` + (crossed() ? ` (${fa5Tk(fa5Form(crossed(), d))}${opt.unit ? " " + opt.unit : ""})` : "");
  };
  draw();
  const ask = h("div", { class: "fa5ask" });
  if (opt.est) body.append(fa5EstBox(api, opt.est, () => { estOk = true; kick(); }));
  body.append(h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.1em 0" }, opt.tip || `막대 하나가 1이고, 작은 칸 하나는 [1/${d}]이에요. 막대(1)를 누르면 통째로 ×표, ‘1을 쪼개기’를 누르면 1이 ${fa5J(`[${d}/${d}]`, "으로")} 나뉘어 한 칸씩 ×표 할 수 있어요.`),
    readout, h("div", { class: "fa5stage" }, svg),
    h("div", { class: "fa5tools" }, h("button", { onclick: () => { units.forEach(u => { u.whole = false; u.cells.fill(false); if (!u.rest) u.split = false; }); draw(); } }, "처음부터")), ask);
  kick = fa5Ask(ask, api, () => crossed() === sN && estOk, () => !estOk ? "먼저 어림해요." : `${fa5Tk(opt.s)}${opt.unit ? " " + opt.unit : ""}만큼 ×표 해요. ${fa5J(fa5Tk(opt.s), "을를")} 분모가 ${d}인 분수로 바꾸어 칸 수를 세어 봐요. 지금은 [1/${d}]이 ${crossed()}개예요.`, opt);
}

/* ⑧ 수 카드로 대분수 만들기 (자연수·분자·분모 모두 카드): groups [{name, cards, kind:"max"|"min"}], op("+"|"-") — 두 대분수의 합 또는 차 */
function fa5Mixed(body, api, opt) {
  fa5Style();
  const op = opt.op === "-" ? -1 : 1;
  const bestOf = g => {
    let best = null; const c = g.cards;
    c.forEach((w, i) => c.forEach((n, j) => c.forEach((d, k) => { if (i === j || j === k || i === k || n >= d) return; const v = w + n / d; if (!best || (g.kind === "max" ? v > best.v : v < best.v)) best = { w, n, d, v }; })));
    return best;
  };
  const G = opt.groups.map(g => ({ g, best: bestOf(g), slot: { w: null, n: null, d: null }, sel: null }));
  const bv = G.map(x => fa5Str(`${x.best.w} ${x.best.n}/${x.best.d}`));
  const total = fa5Add(bv[0], bv[1], op);
  if (total.num <= 0) throw new Error("카드 대분수 확인 필요");
  const sum = fa5In(op > 0 ? "두 수의 합" : "두 수의 차"); sum.tv = total;
  let auto = () => {};
  G.forEach(x => {
    const used = () => ["w", "n", "d"].map(k => x.slot[k]).filter(v => v != null);
    const cBtns = x.g.cards.map((c, i) => h("button", { class: "opt", onclick: () => { x.sel = x.sel === i ? null : i; cBtns.forEach((b, k) => b.classList.toggle("fa5on", x.sel === k)); } }, String(c)));
    const sb = {};
    const slotBtn = key => { const b = h("button", { class: "fa5slot", "aria-label": { w: "자연수", n: "분자", d: "분모" }[key], onclick: () => { x.slot[key] = x.sel == null ? null : x.sel; x.sel = null; cBtns.forEach(c => c.classList.remove("fa5on")); paint(); } }, "​"); sb[key] = b; return b; };
    const paint = () => { ["w", "n", "d"].forEach(k => { sb[k].textContent = x.slot[k] == null ? "​" : String(x.g.cards[x.slot[k]]); }); cBtns.forEach((b, i) => b.style.opacity = used().includes(i) ? .45 : 1); auto(); };
    const mixed = h("span", { class: "fa5fr fa5frin" }, h("span", { class: "fa5fw" }, slotBtn("w")), h("span", { class: "fa5q" }, h("span", { class: "fa5n" }, slotBtn("n")), h("span", { class: "fa5d" }, slotBtn("d"))));
    x.box = h("div", { class: "fa5grp" }, h("div", { class: "fa5gt" }, `${x.g.name} — 수 카드 ${x.g.cards.join(", ")}`), h("div", { class: "fa5cards" }, cBtns), h("div", { class: "fa5cl" }, h("span", { class: "fa5tag" }, x.g.kind === "max" ? "가장 큰 대분수" : "가장 작은 대분수"), mixed));
  });
  const ex = `${fa5Tk(`${G[0].best.w} ${G[0].best.n}/${G[0].best.d}`)}${op > 0 ? "+" : "-"}${fa5Tk(`${G[1].best.w} ${G[1].best.n}/${G[1].best.d}`)}`;
  api.provide({ words: ["가장 큰 대분수", "가장 작은 대분수"], answers: G.map(x => `${x.g.name}: ${fa5Plain(`[${x.best.w} ${x.best.n}/${x.best.d}]`)}`).concat([`${op > 0 ? "합" : "차"} ${fa5Plain(fa5Tk(fa5Form(total.num, total.den)))}`]) });
  body.append(h("p", { class: "fa5tip" }, "수 카드를 누른 다음 빈칸(자연수·분자·분모)을 눌러 넣어요. 빈칸을 다시 누르면 지워져요. 카드는 한 번씩만 써요."), ...G.map(x => x.box),
    h("div", { class: "fa5cl" }, h("span", {}, op > 0 ? "두 대분수의 합 =" : "두 대분수의 차 ="), sum),
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "빈칸과 답을 모두 쓰면 저절로 확인해요."));
  const val = x => ["w", "n", "d"].map(k => x.slot[k] == null ? null : x.g.cards[x.slot[k]]);
  const judge = () => {
    const given = G.map(x => val(x).map(v => v == null ? "□" : v).join(" ")).join(", ") + ` / ${sum.text()}`;
    for (const x of G) {
      const [w, n, d] = val(x), ids = ["w", "n", "d"].map(k => x.slot[k]);
      if (new Set(ids).size < 3) { api.fail("한 대분수에서 수 카드는 한 번씩만 써요.", given); return false; }
      if (n >= d) { api.fail("대분수의 분수 부분은 진분수예요. 분자가 분모보다 작아야 해요.", given); return false; }
      if (w !== x.best.w || n !== x.best.n || d !== x.best.d) { api.fail(x.g.kind === "max" ? "가장 큰 대분수는 자연수 부분에 가장 큰 수를 놓고, 남은 두 카드로 진분수를 만들어요." : "가장 작은 대분수는 자연수 부분에 가장 작은 수를 놓고, 남은 두 카드로 진분수를 만들어요.", given); return false; }
    }
    const J = fa5Judge(sum.get(), fa5Form(total.num, total.den));
    if (J.code === "zero") { sum.paint(null); api.hint(J.msg); return false; }
    if (J.code !== "ok") { sum.paint(false); api.fail(J.msg || fa5Diag(ex, sum.get()) || "두 대분수를 통분한 다음 자연수 부분끼리, 분수 부분끼리 계산해 봐요.", given); return false; }
    sum.paint(true); api.tryOnce();
    api.done(given, opt.ok || `${fa5Tk(`${G[0].best.w} ${G[0].best.n}/${G[0].best.d}`)} ${op > 0 ? "+" : "−"} ${fa5Tk(`${G[1].best.w} ${G[1].best.n}/${G[1].best.d}`)} = ${fa5Book(total.num, total.den)}이에요!`);
    return true;
  };
  auto = autoRun(() => G.every(x => ["w", "n", "d"].every(k => x.slot[k] != null)) && sum.full(), () => G.map(x => val(x).join(",")).join("|") + "#" + sum.sig(), judge, 900);
  fa5Hook(sum, auto);
}

/* ⑨ 수 카드로 진분수를 만들고 친구의 진분수와 더하기 */
function fa5Proper(body, api, opt) {
  fa5Style();
  const cards = opt.cards, all = [];
  cards.forEach(n => cards.forEach(d => { if (n < d) all.push({ n, d }); }));
  const slot = { n: null, d: null }; let sel = null, mine = null, friend = null, v = null;
  const cBtns = cards.map((c, i) => h("button", { class: "opt", onclick: () => { if (mine) return; sel = sel === i ? null : i; cBtns.forEach((b, k) => b.classList.toggle("fa5on", sel === k)); } }, String(c)));
  const sb = {};
  const slotBtn = key => { const b = h("button", { class: "fa5slot", "aria-label": key === "n" ? "분자" : "분모", onclick: () => { if (mine) return; slot[key] = sel; sel = null; cBtns.forEach(c => c.classList.remove("fa5on")); paint(); } }, "​"); sb[key] = b; return b; };
  const paint = () => ["n", "d"].forEach(k => { sb[k].textContent = slot[k] == null ? "​" : String(cards[slot[k]]); });
  const frac = h("span", { class: "fa5fr fa5frin" }, h("span", { class: "fa5q" }, h("span", { class: "fa5n" }, slotBtn("n")), h("span", { class: "fa5d" }, slotBtn("d"))));
  const fBox = h("div", { class: "fa5cl" }), sumRow = h("div", { class: "fa5cl hidden" }), sum = fa5In("두 진분수의 합");
  const table = h("table", { class: "fa5score" }, h("tr", {}, h("th", {}, "내가 만든 진분수"), h("th", {}, "친구가 만든 진분수"), h("th", {}, "합")));
  sumRow.append(h("span", { class: "jua" }, "두 진분수의 합 ="), sum);
  const fix = h("button", { onclick: () => {
    if (mine) return;
    if (slot.n == null || slot.d == null) return api.hint("분자와 분모에 수 카드를 하나씩 넣어요.");
    if (slot.n === slot.d) return api.hint("수 카드는 한 번씩만 써요.");
    const n = cards[slot.n], d = cards[slot.d];
    if (n >= d) return api.hint("진분수는 분자가 분모보다 작은 분수예요. 카드를 바꾸어 봐요.");
    mine = { n, d };
    const pool = all.filter(f => f.d !== d && f.n * d + n * f.d > f.d * d);
    friend = pool[Math.floor(Math.random() * pool.length)] || all.find(f => f.d !== d);
    v = fa5Eval(`[${mine.n}/${mine.d}]+[${friend.n}/${friend.d}]`); sum.tv = v;
    fBox.append(h("span", { class: "fa5tag" }, "친구가 만든 진분수"), h("span", { class: "jua" }, `[${friend.n}/${friend.d}]`));
    sumRow.classList.remove("hidden");
    api.hint(`내 진분수는 [${n}/${d}], 친구의 진분수는 [${friend.n}/${friend.d}]이에요. 통분하여 더해 봐요. 다 쓰면 저절로 확인해요.`);
  } }, "내 진분수 정하기");
  api.provide({ words: ["통분", "분모는 그대로", "분자끼리 더하기"], answers: ["예) [5/6]+[3/4] = [10/12]+[9/12] = [19/12] = [1 7/12]"] });
  body.append(h("p", { class: "fa5tip" }, `수 카드 ${cards.join(", ")} 중에서 2장을 골라 한 번씩만 사용하여 진분수를 만들어요. 카드를 누르고 분자나 분모 칸을 눌러요.`),
    h("div", { class: "fa5cards" }, cBtns), h("div", { class: "fa5cl" }, h("span", { class: "fa5tag" }, "내가 만든 진분수"), frac, h("span", { class: "fa5tools" }, fix)), fBox, sumRow, table);
  const auto = autoRun(() => !!mine && sum.full(), () => sum.sig(), () => {
    const e = `[${mine.n}/${mine.d}]+[${friend.n}/${friend.d}]`, r = sum.get(), J = fa5Judge(r, fa5Form(v.num, v.den));
    if (J.code === "zero") { sum.paint(null); api.hint(J.msg); return false; }
    if (J.code !== "ok") { sum.paint(false); api.fail(J.msg || fa5Diag(e, r) || "두 분모의 곱이나 최소공배수를 공통분모로 하여 통분한 다음 분자끼리 더해 봐요.", `${e} = ${sum.text()}`); return false; }
    sum.paint(true); api.tryOnce();
    table.append(h("tr", {}, h("td", {}, `[${mine.n}/${mine.d}]`), h("td", {}, `[${friend.n}/${friend.d}]`), h("td", {}, fa5Book(v.num, v.den))));
    api.done(`${e} = ${sum.text()}`, `${e} = ${fa5Book(v.num, v.den)}. 내가 만든 진분수와 친구의 진분수를 통분하여 더했어요!`);
    return true;
  }, 900);
  fa5Hook(sum, auto);
}

/* ⑩ 신나는 분수 윷놀이 — 놀이판 칸의 분수는 교과서에 없어 새로 정했어요(분수 주사위의 분수와 같은 칸은 없음). 놀이가 끝나면 api.done( */
const FA5_YUT_VAL = ["2/3", "5/8", "1 1/4", "3/10", "7/12", "1 2/5", "4/9", "5/6", "2 1/3", "3/7", "1 5/6", "7/8", "2/9", "1 3/4", "4/5", "3/8", "2 1/2", "5/12", "1 1/3", "9/10", "3/5", "1 7/8", "5/9", "2 3/4", "1/8", "1 1/6", "7/10", "1 1/2"];
const FA5_YUT_DIE = ["+1/2", "−1/3", "+1/4", "−1/6", "+2/5", "♥"];
function fa5Yut(body, api, opt) {
  fa5Style();
  const NODE = {}, S = 560, M = 70, at = (x, y) => [M + x * S, M + y * S];
  for (let i = 0; i < 20; i++) {
    let p; if (i <= 5) p = [1, 1 - i / 5]; else if (i <= 10) p = [1 - (i - 5) / 5, 0]; else if (i <= 15) p = [0, (i - 10) / 5]; else p = [(i - 15) / 5, 1];
    NODE["o" + i] = at(...p);
  }
  Object.assign(NODE, { a1: at(5 / 6, 1 / 6), a2: at(4 / 6, 2 / 6), C: at(.5, .5), b1: at(2 / 6, 4 / 6), b2: at(1 / 6, 5 / 6), c1: at(1 / 6, 1 / 6), c2: at(2 / 6, 2 / 6), d1: at(4 / 6, 4 / 6), d2: at(5 / 6, 5 / 6) });
  const ids = [...Array(19)].map((_, i) => "o" + (i + 1)).concat(["a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2", "C"]);
  const VAL = {}; ids.forEach((id, i) => VAL[id] = FA5_YUT_VAL[i]);
  FA5_YUT_DIE.forEach(f => { if (f === "♥") return; const dv = fa5Str(f.slice(1)); ids.forEach(id => { if (fa5Eq(fa5Str(VAL[id]), dv)) throw new Error("윷판 칸 분수 확인 필요"); }); });
  const R0 = [...Array(20)].map((_, i) => "o" + i).concat(["END"]), R5 = ["o5", "a1", "a2", "C", "b1", "b2", "o15", "o16", "o17", "o18", "o19", "END"], R10 = ["o10", "c1", "c2", "C", "d1", "d2", "END"], RC = ["C", "d1", "d2", "END"];
  const ROUTES = { R0, R5, R10, RC };
  const node = p => p.home ? null : p.done ? "END" : ROUTES[p.r][p.i];
  const move = (p, n) => {
    const q = { r: p.home ? "R0" : p.r, i: p.home ? 0 : p.i, home: false, done: false };
    q.i += n; const R = ROUTES[q.r];
    if (q.i >= R.length - 1) { q.done = true; return q; }
    const id = R[q.i];
    if (q.r === "R0" && id === "o5") { q.r = "R5"; q.i = 0; } else if (q.r === "R0" && id === "o10") { q.r = "R10"; q.i = 0; } else if (q.r === "R5" && id === "C") { q.r = "RC"; q.i = 0; }
    return q;
  };
  const W = 1000, H = 700, svg = makeSvg(W, H);
  const info = h("p", { class: "fa5tip" }), ctrl = h("div", { class: "fa5tools" }), logBox = h("div");
  const COL = [FA5_S[1], FA5_S[0]], NAMES = ["나", "로봇"];
  let G = null;
  const newGame = n => { G = { n, P: [0, 1].map(() => [...Array(n)].map(() => ({ home: true, done: false }))), turn: 0, phase: "roll", log: [], ok: 0, last: null }; render(); };
  const tk = s => fa5Tk(s);
  const exprFor = (id, f) => {
    const v = VAL[id], fv = f.slice(1);
    if (f[0] === "+") return `${tk(v)}+${tk(fv)}`;
    return fa5Eval(`${tk(v)}-${tk(fv)}`).num > 0 ? `${tk(v)}−${tk(fv)}` : `${tk(fv)}−${tk(v)}`;
  };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 20, y: 20, width: 660, height: 660, rx: 24, fill: "#E9F2DC", stroke: "#7A8F4E", "stroke-width": 5 }));
    const L = (a, b) => svg.append(svgEl("line", { x1: NODE[a][0], y1: NODE[a][1], x2: NODE[b][0], y2: NODE[b][1], stroke: "#9DB06A", "stroke-width": 5 }));
    L("o0", "o5"); L("o5", "o10"); L("o10", "o15"); L("o15", "o0"); L("o5", "o15"); L("o10", "o0");
    Object.entries(NODE).forEach(([id, [x, y]]) => {
      const big = ["o0", "o5", "o10", "o15", "C"].includes(id);
      svg.append(svgEl("circle", { cx: x, cy: y, r: big ? 42 : 34, fill: id === "o0" ? "#DDEFE6" : "#fff", stroke: big ? TENT : "#6F7F45", "stroke-width": big ? 5 : 3 }));
      if (id === "o0") svg.append(txt(x, y, "출발", 22, { fill: PINE }));
      else svg.append(fa5SvgLine(tk(VAL[id]), x, y, 21));
      if (["o5", "o10", "C"].includes(id)) svg.append(txt(x + 30, y - 32, "★", 22, { fill: TENT }));
    });
    if (G) {
      const here = {};
      G.P.forEach((ps, k) => ps.forEach((p, j) => { const id = node(p); if (!id || id === "END") return; (here[id] = here[id] || []).push([k, j]); }));
      Object.entries(here).forEach(([id, list]) => list.forEach(([k, j], m) => {
        const [x, y] = NODE[id], ox = (m - (list.length - 1) / 2) * 30;
        svg.append(svgEl("circle", { cx: x + ox, cy: y + 30, r: 15, fill: COL[k], stroke: "#fff", "stroke-width": 3 }), txt(x + ox, y + 31, String(j + 1), 16, { fill: "#fff" }));
      }));
      [0, 1].forEach(k => {
        const y0 = 120 + k * 280;
        svg.append(txt(840, y0 - 70, `${NAMES[k]}의 말`, 26, { fill: COL[k] }));
        svg.append(txt(840, y0 - 30, "기다리는 말", 18, { fill: "#5B6B6B" }), txt(840, y0 + 60, "다 돈 말", 18, { fill: "#5B6B6B" }));
        G.P[k].forEach((p, j) => {
          if (p.home) svg.append(svgEl("circle", { cx: 800 + j * 40, cy: y0 + 5, r: 16, fill: COL[k] }), txt(800 + j * 40, y0 + 6, String(j + 1), 16, { fill: "#fff" }));
          if (p.done) svg.append(svgEl("circle", { cx: 800 + j * 40, cy: y0 + 95, r: 16, fill: "#fff", stroke: COL[k], "stroke-width": 4 }), txt(800 + j * 40, y0 + 96, "✓", 16, { fill: COL[k] }));
        });
      });
      if (G.last) svg.append(txt(840, 640, G.last, 22, { fill: "#1F2F4A" }));
    }
  };
  const capture = (k, id) => { let got = false; G.P[1 - k].forEach(p => { if (!p.home && !p.done && node(p) === id) { p.home = true; p.r = null; got = true; } }); return got; };
  const win = k => G.P[k].every(p => p.done);
  const endTurn = (k, again) => {
    if (win(k)) { G.phase = "end"; G.winner = k; render(); return; }
    if (again) { G.phase = k === 0 ? "roll" : "robot"; render(); if (k === 1) setTimeout(robot, 900); return; }
    G.turn = 1 - k; G.phase = G.turn === 0 ? "roll" : "robot"; render();
    if (G.turn === 1) setTimeout(robot, 900);
  };
  const roll = () => [1 + Math.floor(Math.random() * 6), FA5_YUT_DIE[Math.floor(Math.random() * 6)]];
  const robot = () => {
    if (!G || G.phase !== "robot") return;
    const [n, f] = roll(), ps = G.P[1], cand = ps.map((p, j) => [p, j]).filter(([p]) => !p.done);
    let pick = cand.find(([p]) => { const q = move(p, n); return !q.done && G.P[0].some(o => !o.home && !o.done && node(o) === node(q)); }) || cand.sort((a, b) => (b[0].home ? -1 : b[0].i) - (a[0].home ? -1 : a[0].i))[0];
    const [p, j] = pick, q = move(p, n); Object.assign(p, q);
    let msg = `로봇: 주사위 ${n}, 분수 주사위 ${f} → 말 ${j + 1}`;
    if (q.done) msg += "이 다 돌았어요!";
    else if (f !== "♥") { const e = exprFor(node(q), f), v = fa5Eval(e); msg += ` · ${e} = ${fa5Book(v.num, v.den)} (맞았어요)`; }
    else msg += " · ♥라서 계산하지 않아요";
    const got = !q.done && capture(1, node(q));
    if (got) msg += " · 내 말을 잡았어요! 로봇이 한 번 더 던져요.";
    G.log.push(msg); G.last = `로봇: 주사위 ${n}, ${f}`;
    endTurn(1, got);
  };
  const render = () => {
    ctrl.innerHTML = ""; draw();
    logBox.innerHTML = "";
    if (G && G.log.length) logBox.append(h("div", { class: "fa5grp" }, h("div", { class: "fa5gt" }, "놀이 기록"), ...G.log.slice(-6).map(t => h("div", {}, t))));
    if (!G) {
      info.textContent = "모둠별 말을 몇 개로 놀이할까요? (말 1개로 하면 빨리 끝나요)";
      [1, 2].forEach(n => ctrl.append(h("button", { class: n === 1 ? "fa5on" : "", onclick: () => newGame(n) }, `말 ${n}개로 놀이하기`)));
      return;
    }
    if (G.phase === "roll") {
      info.textContent = "내 차례예요. 주사위와 분수 주사위를 함께 던져요.";
      ctrl.append(h("button", { class: "fa5on", onclick: () => { const [n, f] = roll(); G.dice = [n, f]; G.last = `나: 주사위 ${n}, ${f}`; G.phase = "pick"; render(); } }, "주사위 던지기"));
    } else if (G.phase === "pick") {
      const [n, f] = G.dice, mov = G.P[0].map((p, j) => [p, j]).filter(([p]) => !p.done);
      info.textContent = `주사위 ${n}, 분수 주사위 ${f}이 나왔어요. 움직일 말을 골라요. (★ 칸에 멈추면 지름길로 가요)`;
      mov.forEach(([p, j]) => ctrl.append(h("button", { onclick: () => {
        const prev = Object.assign({}, p), q = move(p, n); Object.assign(p, q); G.prev = { j, prev };
        if (q.done) { G.log.push(`나: 주사위 ${n} → 말 ${j + 1}이 다 돌았어요!`); return endTurn(0, false); }
        if (f === "♥") { const got = capture(0, node(q)); G.log.push(`나: 주사위 ${n}, ♥ → 계산하지 않고 그대로${got ? " · 로봇 말을 잡았어요! 한 번 더" : ""}`); return endTurn(0, got); }
        G.expr = exprFor(node(q), f); G.phase = "calc"; render();
      } }, `말 ${j + 1}${p.home ? "(새로 출발)" : ""} 움직이기`)));
    } else if (G.phase === "calc") {
      const f = G.dice[1], inp = fa5In("계산 결과"), v = fa5Eval(G.expr); inp.tv = v;
      info.textContent = (f[0] === "+" ? "도착한 칸의 수와 분수 주사위의 수를 더해요." : "도착한 칸의 수와 분수 주사위의 수의 차를 구해요. (큰 수)−(작은 수)로 식을 세워요.") + " 다 쓰면 저절로 확인해요.";
      ctrl.append(h("span", { class: "jua" }, `${G.expr} =`), inp);
      const calcAuto = autoRun(() => G.phase === "calc" && inp.full(), () => inp.sig(), () => {
        const r = inp.get(), J = fa5Judge(r, fa5Form(v.num, v.den));
        if (J.code === "empty" || J.code === "half" || J.code === "bad" || J.code === "zero") { api.hint(J.msg); return false; }
        const p = G.P[0][G.prev.j];
        if (J.code !== "ok") {
          Object.keys(p).forEach(k => delete p[k]); Object.assign(p, G.prev.prev);
          G.log.push(`나: ${G.expr} = ${inp.text()} ✗ → 말을 원래 칸으로 되돌려요 (바른 답 ${fa5Book(v.num, v.den)})`);
          api.fail(J.msg || fa5Diag(G.expr, r) || `바른 답은 ${fa5Book(v.num, v.den)}이에요. 두 분수를 통분해서 다시 계산해 봐요. 말은 원래 칸으로 돌아가요.`, `${G.expr} = ${inp.text()}`);
          endTurn(0, false); return true;
        }
        G.ok++; const got = capture(0, node(p));
        G.log.push(`나: ${G.expr} = ${fa5Book(v.num, v.den)} ✓${got ? " · 로봇 말을 잡았어요! 한 번 더" : ""}`);
        api.hint(`맞았어요! 말은 그 칸에 그대로 있어요.${got ? " 로봇의 말을 잡았으니 한 번 더 던져요." : ""}`);
        endTurn(0, got); return true;
      }, 900);
      fa5Hook(inp, calcAuto);
    } else if (G.phase === "robot") {
      info.textContent = "로봇 차례예요…";
    } else if (G.phase === "end") {
      info.textContent = `${G.winner === 0 ? "내가" : "로봇이"} 모든 말을 먼저 놀이판에서 내보냈어요! 내가 맞힌 계산은 ${G.ok}번이에요.`;
      ctrl.append(h("button", { class: "fa5on", onclick: () => { G = null; render(); } }, "한 판 더"));
      if (!G.reported) { G.reported = true; api.done(`${G.winner === 0 ? "승" : "패"}, 맞힌 계산 ${G.ok}번`, `${G.winner === 0 ? "이겼어요!" : "아쉽게 졌지만 끝까지 놀이했어요!"} 분모가 다른 분수를 ${G.ok}번 정확하게 더하고 뺐어요.`); }
    }
  };
  render();
  api.provide({ words: ["통분", "(큰 수)−(작은 수)", "♥는 계산하지 않아요"], answers: [] });
  body.append(info, ctrl, h("div", { class: "fa5stage" }, svg), logBox);
}

/* ⑪ 카드 놀이: 덧셈·뺄셈 (노랑 분모 2~5, 파랑 분모 6~9) — 5판이 끝나면 api.done( */
function fa5CardGame(body, api, opt) {
  fa5Style();
  const YEL = opt.yel || ["1/2", "2/3", "3/4", "4/5", "1 2/3", "2 1/5"], BLU = opt.blu || ["5/6", "3/7", "5/8", "7/9", "1 1/6", "2 3/8"];
  YEL.forEach(y => BLU.forEach(b => { if (fa5Eq(fa5Str(y), fa5Str(b))) throw new Error("카드 값 확인 필요"); }));
  const ROUNDS = opt.rounds || 5;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const info = h("p", { class: "fa5tip" }), area = h("div"), table = h("table", { class: "fa5score" });
  let R = null, round = 0, score = [0, 0], rows = [], reported = false;
  const exprOf = (op, y, b) => op === "+" ? `${fa5Tk(y)}+${fa5Tk(b)}` : fa5Eval(`${fa5Tk(y)}-${fa5Tk(b)}`).num > 0 ? `${fa5Tk(y)}−${fa5Tk(b)}` : `${fa5Tk(b)}−${fa5Tk(y)}`;
  const start = () => { R = { op: null, ys: shuffle(YEL), bs: shuffle(BLU), y: null, b: null }; render(); };
  const drawTable = () => {
    table.innerHTML = ""; table.append(h("tr", {}, h("th", {}, "판"), h("th", {}, "나"), h("th", {}, "로봇")));
    rows.forEach((r, i) => table.append(h("tr", {}, h("td", {}, `${i + 1}`), h("td", {}, r[0]), h("td", {}, r[1]))));
    table.append(h("tr", {}, h("th", {}, "점수"), h("th", {}, `${score[0]}점`), h("th", {}, `${score[1]}점`)));
  };
  const render = () => {
    area.innerHTML = ""; drawTable();
    if (round >= ROUNDS) {
      const t = score[0] > score[1] ? "내가 이겼어요!" : score[0] < score[1] ? "로봇이 이겼어요!" : "비겼어요!";
      info.textContent = `${ROUNDS}판이 끝났어요. ${t}`;
      area.append(h("div", { class: "fa5tools" }, h("button", { class: "fa5on", onclick: () => { round = 0; score = [0, 0]; rows = []; start(); } }, "한 판 더")));
      return;
    }
    if (!R.op) {
      info.textContent = `${round + 1}번째 판: 카드를 보기 전에 ‘덧셈’ 또는 ‘뺄셈’을 먼저 골라요.`;
      area.append(h("div", { class: "fa5tools" }, h("button", { class: "fa5on", onclick: () => { R.op = "+"; render(); } }, "덧셈"), h("button", { class: "fa5on", onclick: () => { R.op = "-"; render(); } }, "뺄셈")));
      return;
    }
    const pickRow = (list, key, col, name) => h("div", { class: "fa5cl" }, h("span", { class: "fa5tag", style: `background:${col}` }, name),
      ...list.map((v, i) => h("button", { class: "opt fa5crd" + (R[key] === i ? " fa5on" : ""), style: `background:${R[key] === i ? "#fff" : col};min-width:3em`, onclick: () => { if (R[key] != null) return; R[key] = i; render(); } }, R[key] === i ? fa5Tk(v) : "?")));
    info.textContent = `${R.op === "+" ? "덧셈" : "뺄셈"}을 골랐어요. 노란 카드와 파란 카드를 한 장씩 뒤집어요.`;
    area.append(pickRow(R.ys, "y", "#FCE9A6", "노란 카드"), pickRow(R.bs, "b", "#CFE3F7", "파란 카드"));
    if (R.y != null && R.b != null) {
      const e = exprOf(R.op, R.ys[R.y], R.bs[R.b]), v = fa5Eval(e), inp = fa5In("계산 결과"); inp.tv = v;
      area.append(h("div", { class: "fa5cl" }, h("span", { class: "jua" }, `${e} =`), inp), h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "다 쓰면 저절로 확인해요."));
      const cur = R;
      const a2 = autoRun(() => R === cur && inp.full(), () => inp.sig(), () => {
        const r = inp.get(), J = fa5Judge(r, fa5Form(v.num, v.den));
        if (J.code === "empty" || J.code === "half" || J.code === "bad" || J.code === "zero") { api.hint(J.msg); return false; }
        const ok = J.code === "ok";
        if (!ok) api.fail(J.msg || fa5Diag(e, r) || `바른 답은 ${fa5Book(v.num, v.den)}이에요. 통분하여 다시 계산해 봐요.`, `${e} = ${inp.text()}`);
        const rop = Math.random() < .5 ? "+" : "-", ry = YEL[Math.floor(Math.random() * 6)], rb = BLU[Math.floor(Math.random() * 6)], re = exprOf(rop, ry, rb), rv = fa5Eval(re);
        if (ok) score[0]++; score[1]++;
        const cmp = ok ? v.num * rv.den - rv.num * v.den : -1;
        if (cmp > 0) score[0]++; else if (cmp < 0) score[1]++;
        rows.push([`${e} = ${ok ? fa5Book(v.num, v.den) + " ✓" : inp.text() + " ✗"}${cmp > 0 ? " (+1 큼)" : ""}`, `${re} = ${fa5Book(rv.num, rv.den)} ✓${cmp < 0 ? " (+1 큼)" : ""}`]);
        round++;
        if (round >= ROUNDS && !reported) { reported = true; drawTable(); api.done(rows.map(r => r[0]).join(" / "), `${ROUNDS}판을 모두 했어요! 나 ${score[0]}점, 로봇 ${score[1]}점이에요.`); }
        else if (ok) api.hint(`맞았어요! 로봇은 ${re} = ${fa5Book(rv.num, rv.den)}이에요.`);
        start(); return true;
      }, 900);
      fa5Hook(inp, a2);
    }
  };
  start();
  api.provide({ words: ["덧셈", "뺄셈", "(큰 수)−(작은 수)"], answers: [] });
  body.append(h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.1em 0" }, "규칙: 계산이 맞으면 1점, 두 사람 중 계산 결과가 더 큰 사람은 1점을 더 얻어요. 뺄셈은 (큰 수)−(작은 수)로 해요."), info, area, table);
}

/* ===== 이야기 버전에서 새로 만든 그림 (앞글자 fa5s) ===== */
function fa5sStyle() {
  if (document.getElementById("fa5s-style")) return;
  const s = document.createElement("style"); s.id = "fa5s-style";
  s.textContent = `.fa5snote{border:3px dashed #7A8F4E;border-radius:var(--r);background:#F6FAEE;padding:.5em .9em;margin:.3em 0 .6em}
.fa5snote b{font-family:Jua,sans-serif;font-weight:400;color:#4E6A2A}
.fa5snote ul{margin:.3em 0 0 1.1em;padding:0}.fa5snote li{margin:.2em 0;line-height:1.9}`;
  document.head.append(s);
}
function fa5sNote(title, lines) {
  fa5Style(); fa5sStyle();
  return h("div", { class: "fa5snote" }, h("b", {}, title), h("ul", {}, ...lines.map(t => h("li", {}, t))));
}
/* 탐구 정리: 수확 기록 카드 (값은 FA5S_HV에서 계산해 써요) */
const FA5S_HV = { let: "1 3/4", pep: "5/6", tom: "2 2/3", give: "2 1/2" };
function fa5sHarvest() {
  fa5Style();
  return h("div", { class: "fa5card2" },
    h("div", {}, h("b", {}, "수확한 채소"), h("div", {}, `상추 [${FA5S_HV.let}] kg`), h("div", {}, `고추 [${FA5S_HV.pep}] kg`), h("div", {}, `방울토마토 [${FA5S_HV.tom}] kg`)),
    h("div", {}, h("b", {}, "나눔 계획"), h("div", {}, `급식실에 보내기: [${FA5S_HV.give}] kg`), h("div", {}, "나머지는 반 친구들 가족과 나누기")));
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 텃밭 가꾸기", lines: [
  "새솔초등학교 5학년 2반은 학교 뒤뜰에 우리 반 텃밭을 얻었어요. 텃밭 반장 서진이와 하린, 민재, 예나, 태오, 지안이가 모둠을 나누어 상추·고추·방울토마토·고구마를 길러요.",
  "아침저녁으로 물을 주고, 거름을 뿌리고, 고랑 길이를 재고, 덩굴이 자란 길이를 비교하고, 수확한 채소를 나누며 분모가 다른 분수를 통분하여 더하고 빼요.",
  "마지막에는 수확한 채소로 나눔 계획을 세우고, 텃밭 놀이 한마당과 텃밭 발표회에서 배운 것을 정리해요."],
  one: "우리 반 텃밭 가꾸기 · 물·거름·고랑·수확한 채소의 양을 통분하여 분모는 그대로, 분자끼리 더하고 빼요." };
const UNIT_KEYWORDS = ["통분", "공통분모", "두 분모의 곱", "최소공배수", "분모는 그대로", "분자끼리 더하기", "분자끼리 빼기", "진분수", "가분수", "대분수", "자연수는 자연수끼리, 분수는 분수끼리", "가분수로 나타내어 계산", "1만큼을 분수로 나타내기", "어림하기", "약분"];

const LESSONS = [
{
  id: "s1", no: 1, title: "우리 반 텃밭을 열어요", soop: "개념 찾기(S)",
  question: "텃밭을 가꿀 때 분모가 다른 분수를 더하거나 빼야 하는 때는 언제일까요?",
  summary: "텃밭 계획 쪽지에는 [1/2] L, [3/4] kg, [4 1/2] m처럼 분모가 다른 분수가 많이 나와요. 모두 얼마인지 구할 때는 더하고, 남은 양이나 차를 구할 때는 빼요. 분모가 다르면 조각의 크기가 달라서, 먼저 통분하여 조각의 크기를 같게 만들어야 해요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "우리 반 텃밭이 생겼어요! 텃밭 반장 서진이가 가져온 텃밭 계획 쪽지를 보고, 세 칸에 써서 붙여요.", hints: ["쪽지에서 분수가 쓰인 곳을 찾아봐요. 분모가 서로 같은가요?", "두 양을 합하거나, 쓰고 남은 양을 셀 때를 떠올려요."],
      render: (b, a) => { b.append(fa5sNote("🌱 5학년 2반 텃밭 계획 쪽지", ["상추 물 주기: 아침 [1/2] L, 저녁 [1/3] L", "거름: 상추 칸 [3/4] kg, 고추 칸 [2/5] kg", "고랑 길이: 첫째 고랑 [4 1/2] m, 둘째 고랑 [3 2/3] m", "물통: 물 [5 1/4] L 중에서 [1 5/6] L 쓰기"]));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "쪽지에 ~이 보여요", hint: "쪽지에서 보이는 것", ex: ["[1/2] L와 [1/3] L처럼 분모가 다른 분수가 보여요.", "[4 1/2] m처럼 자연수와 분수가 함께 있는 대분수가 보여요."] },
          { t: "생각해요", e: "💭", ph: "~할 때 분수를 더하거나 빼야 할 것 같아요", hint: "분수를 더하거나 뺄 일", ex: ["상추에 하루 동안 준 물을 구하려면 [1/2]과 [1/3]을 더해야 할 것 같아요.", "물통에 남은 물은 [5 1/4]에서 [1 5/6]를 빼서 구할 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 계산할까?", hint: "분수 계산에 대해 궁금한 것", ex: ["분모가 2와 3으로 다른데 분자끼리 그냥 더해도 될까?", "[5 1/4]에서 [1 5/6]처럼 분수 부분이 더 큰 수는 어떻게 뺄까?"] }],
          { ok: "텃밭에는 분모가 다른 분수가 가득해요! 이 단원에서 분모가 다른 분수를 더하고 빼는 방법을 하나씩 알아봐요." }); } },
    { name: "그려 보기 — 거름 막대의 조각 맞추기", inst: "거름을 상추 칸에 [3/4] kg, 고추 칸에 [2/5] kg 뿌리기로 했어요. 4단원에서 배운 통분을 떠올려, 두 막대의 한 칸을 더 잘게 나누어 한 칸이 [1/20]이 되게 만들어 보세요.", hints: ["4와 5의 최소공배수는 20이에요.", "[3/4]의 한 칸을 5칸으로, [2/5]의 한 칸을 4칸으로 나누어요."],
      render: (b, a) => fa5Split(b, a, { A: "3/4", B: "2/5", names: ["상추 칸 [3/4] kg", "고추 칸 [2/5] kg"], op: null, d: 20, ask: [
        ["[3/4] = ", { q: [null, "?15", "20"] }],
        ["[2/5] = ", { q: [null, "?8", "20"] }],
        ["그래서 [3/4] ", { c: [">", "=", "<"], a: 0 }, " [2/5]"]], ok: "통분하면 [3/4] = [15/20], [2/5] = [8/20]이에요. 조각의 크기가 같아지면 칸 수로 비교하고 계산할 수 있어요." }) },
    { name: "말해 보기 — 더할까, 뺄까?", inst: "텃밭에서 생긴 궁금증이에요. 덧셈으로 구하는 것과 뺄셈으로 구하는 것으로 나누어 보세요.", hints: ["‘모두’ 얼마인지 구할 때는 더해요.", "‘남은’ 양이나 ‘얼마나 더’ 많은지 구할 때는 빼요."],
      render: thenWhy((b, a) => fa5Sort(b, a, { bins: ["덧셈으로 구해요", "뺄셈으로 구해요"], cards: [
        { t: "상추에 아침과 저녁에 준 물은 모두 몇 L일까?", k: 0 },
        { t: "상추 칸과 고추 칸에 뿌린 거름은 모두 몇 kg일까?", k: 0 },
        { t: "첫째 고랑과 둘째 고랑의 길이를 합하면 몇 m일까?", k: 0 },
        { t: "물통에서 물을 쓰고 남은 양은 몇 L일까?", k: 1, why: "쓰고 ‘남은’ 양은 처음 양에서 쓴 양을 빼서 구해요." },
        { t: "첫째 고랑은 둘째 고랑보다 몇 m 더 길까?", k: 1, why: "얼마나 ‘더’ 긴지는 두 길이의 차예요. 빼서 구해요." },
        { t: "상추 칸에 고추 칸보다 거름을 몇 kg 더 뿌렸을까?", k: 1, why: "몇 kg ‘더’ 뿌렸는지는 두 양의 차예요." }],
        ok: "모두 얼마인지는 덧셈으로, 남은 양이나 차는 뺄셈으로 구해요. 자연수의 덧셈·뺄셈과 같아요." }),
        { q: "‘얼마나 더’를 구할 때 왜 뺄셈을 할까요?", ph: "얼마나 더는 ~이기 때문이에요", help: ["① 비교하는 두 양을 떠올려요. → ② 큰 양에서 작은 양만큼을 덜어 내면 무엇이 남는지 생각해요.", "‘얼마나 더는 두 양의 ~라서, 큰 양에서 작은 양을 빼서 구해요.’ 꼴로 써요."],
          ans: "얼마나 더 많은지는 두 양의 차이라서, 큰 양에서 작은 양을 빼면 더 많은 만큼이 남아요. 그래서 뺄셈으로 구해요." }) },
    { name: "약속하기 — 분모가 같을 때 떠올리기", inst: "4학년 때 배운 분모가 같은 분수의 덧셈과 뺄셈을 떠올려 계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["분모가 같으면 분모는 그대로 쓰고 분자끼리 더하거나 빼요.", "[4 1/5]−[1 3/5]은 분수 부분끼리 뺄 수 없어요. 자연수 1만큼을 [5/5]로 바꾸어요."],
      render: thenWhy((b, a) => fa5Calc(b, a, [{ e: "[2/7]+[4/7]", a: "6/7" }, { e: "[1 5/8]+[2 6/8]", a: "4 3/8" }, { e: "[7/9]−[4/9]", a: "3/9" }, { e: "[4 1/5]−[1 3/5]", a: "2 3/5" }], { ok: "분모가 같으면 분모는 그대로 두고 분자끼리 계산했어요." }),
        { q: "상추에 준 물 [1/2] L와 [1/3] L는 왜 바로 분자끼리 더할 수 없을까요?", ph: "[1/2]과 [1/3]은 조각의 크기가 ~", help: ["① [1/2]과 [1/3]의 한 조각 크기를 견주어 봐요. → ② 크기가 다른 조각을 그냥 세어도 되는지 생각해요.", "‘[1/2]과 [1/3]은 한 조각의 크기가 달라서, 먼저 ~해야 해요.’ 꼴로 써요."],
          ans: "[1/2]과 [1/3]은 한 조각의 크기가 달라서 조각 수를 그냥 더할 수 없어요. 먼저 통분하여 조각의 크기를 같게 만들어야 해요." }) },
    { name: "확인하기 — 가분수·대분수와 크기 비교", inst: "텃밭 쪽지의 분수를 바꾸고, 분모가 다른 분수의 크기를 비교해 보세요.", hints: ["[3 2/5]에서 3은 [15/5]예요.", "크기를 비교할 때는 통분해서 분자를 비교해요. [5/8] = [15/24], [2/3] = [16/24]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        ["[3 2/5] = ", { q: [null, "?17", "5"] }],
        ["[23/6] = ", { q: ["?3", "?5", "6"] }],
        ["[5/8] ", { c: [">", "=", "<"], a: 2 }, " [2/3]"],
        ["[7/10] ", { c: [">", "=", "<"], a: 0 }, " [3/5]"]], { ok: "대분수와 가분수를 바꾸고, 통분하여 크기를 비교할 수 있어요. 분모가 다른 분수를 더하고 뺄 준비가 됐어요!", bad: "가분수와 대분수는 1 = [5/5] = [6/6]을 떠올려 바꾸고, 크기 비교는 통분하여 분자를 비교해요." }) }
  ],
  challenge: { inst: "★ 도전 — 계산하기 전에 어림해 보세요. 물통에 물이 [5 1/4] L 있었는데 [1 5/6] L를 썼어요.", hints: ["[5 1/4]은 5에 가깝고, [1 5/6]는 2에 가까워요.", "5−2는 얼마일까요?"],
    render: (b, a) => quiz(b, a, [
      { q: "남은 물은 약 몇 L일까요?", o: ["약 3 L", "약 4 L", "약 7 L"], a: 0, why: { "1": "[1 5/6]는 1보다 2에 훨씬 가까워요. 5에서 2쯤을 빼 봐요.", "2": "쓰고 남은 양이므로 더하면 안 돼요. 차를 어림해요." } },
      { q: "정확한 값은 3 L보다 조금 많을까요, 조금 적을까요?", o: ["조금 많아요", "조금 적어요"], a: 0, why: { "1": "[5 1/4]은 5보다 [1/4]만큼 크고, [1 5/6]는 2보다 [1/6]만큼 작아요. 처음 양은 더 크고 쓴 양은 더 작으니 남은 양은 3 L보다 많아요." } }],
      { ok: "남은 물은 3 L보다 조금 많아요. 정확한 값은 7차시에서 배우는 방법으로 구할 수 있어요." }) }
},
{
  id: "s2", no: 2, title: "아침저녁 물 주기 ― 진분수의 덧셈(1)", soop: "개념 구축하기(O)",
  question: "합이 1보다 작은 분모가 다른 진분수의 덧셈은 어떻게 할까요?",
  summary: "분모가 다른 분수의 덧셈은 분수를 통분한 후 분모는 그대로 쓰고 분자끼리 더합니다. [2/5]+[1/3] = [6/15]+[5/15] = [11/15]. 두 분모의 곱을 공통분모로 하면 공통분모를 구하기 쉽고, 두 분모의 최소공배수를 공통분모로 하면 계산한 결과를 약분할 필요가 없거나 간단해요.",
  steps: [
    { name: "만져 보기 — 물의 양 조각 맞추기", inst: "하린이는 상추 칸에 아침에 물을 [2/5] L, 저녁에 [1/3] L 주었어요. 하루 동안 준 물은 모두 몇 L일까요? 두 막대의 한 칸을 더 잘게 나누어 조각의 크기를 같게 만들어 보세요.", hints: ["5와 3의 공배수는 15, 30, …이에요. 한 칸이 [1/15]이 되게 나누어 봐요.", "[2/5]의 한 칸을 3칸으로, [1/3]의 한 칸을 5칸으로 나누면 한 칸이 [1/15]이 돼요."],
      render: ruleFirst((b, a) => fa5Split(b, a, { A: "2/5", B: "1/3", names: ["아침 [2/5] L", "저녁 [1/3] L"], op: "+", d: 15, ask: [
        ["[2/5] = ", { q: [null, "?6", "15"] }],
        ["[1/3] = ", { q: [null, "?5", "15"] }],
        ["[2/5]+[1/3] = ", { q: [null, "6", "15"] }, "+", { q: [null, "5", "15"] }, " = ", { q: [null, "?11", "15"] }]], ok: "하린이가 하루 동안 준 물은 [11/15] L예요. 통분하여 조각의 크기를 같게 한 다음 분자끼리 더했어요." }),
        { q: "분모가 다른 두 분수는 어떻게 더하면 될까요?", ph: "내 규칙: 먼저 ~", help: ["① [2/5]와 [1/3]의 조각 크기가 같은지 생각해요. → ② 조각 크기를 같게 만든 다음 무엇을 더할지 생각해요.", "‘내 규칙: 먼저 ~하고, 분모는 ~, 분자는 ~해요.’ 꼴로 써요."],
          ans: "먼저 두 분수를 통분해 조각의 크기를 같게 만든 다음, 분모는 그대로 쓰고 분자끼리 더해요. [2/5]+[1/3] = [6/15]+[5/15] = [11/15]이에요." }) },
    { name: "그려 보기 — 두 가지 방법으로 통분하기", inst: "민재는 고추 모종에 물을 [1/6] L, 가지 모종에 [3/8] L 주었어요. [1/6]+[3/8]을 두 가지 방법으로 계산해 보세요. 방법 1은 두 분모의 곱을, 방법 2는 두 분모의 최소공배수를 공통분모로 해요.", hints: ["6×8 = 48, 6과 8의 최소공배수는 24예요.", "분모에 곱한 수를 분자에도 똑같이 곱해야 해요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 두 분모의 곱", p: ["[1/6]+[3/8] = ", { q: [null, ["1", "×", "?8"], ["6", "×", "?8"]] }, "+", { q: [null, ["3", "×", "?6"], ["8", "×", "?6"]] }, " = ", { q: [null, "?8", "48"] }, "+", { q: [null, "?18", "48"] }, " = ", { q: [null, "?26", "48"] }] },
        { t: "방법 2 · 최소공배수", p: ["[1/6]+[3/8] = ", { q: [null, ["1", "×", "?4"], ["6", "×", "?4"]] }, "+", { q: [null, ["3", "×", "?3"], ["8", "×", "?3"]] }, " = ", { q: [null, "?4", "24"] }, "+", { q: [null, "?9", "24"] }, " = ", { q: [null, "?13", "24"] }] }],
        { ok: "방법 1은 [26/48], 방법 2는 [13/24]이에요. [26/48]을 약분하면 [13/24]이므로 두 답은 크기가 같아요." }) },
    { name: "말해 보기 — 어느 방법이 편할까?", inst: "두 방법을 비교해 보세요. 알맞은 말을 골라요.", hints: ["48은 6×8로 바로 구할 수 있어요.", "[26/48]은 약분해야 [13/24]이 돼요."],
      render: thenWhy((b, a) => blanks(b, a, ["두 분모의 곱을 공통분모로 하여 통분하면 ", { o: ["공통분모를 구하기 쉽고", "약분할 필요가 없고"], a: 0 }, ", 두 분모의 최소공배수를 공통분모로 하여 통분하면 계산한 결과를 ", { o: ["약분할 필요가 없거나 간단해요", "반드시 약분해야 해요"], a: 0 }, ". [26/48]을 약분하면 ", { o: ["[13/24]", "[13/48]", "[26/24]"], a: 0 }, "이에요."], { ok: "두 방법 모두 맞아요. 자신에게 편리한 방법을 골라 계산해요." }),
        { q: "나라면 어느 방법으로 통분할지 까닭과 함께 써 봐요.", ph: "나는 ~을 공통분모로 할래요. 왜냐하면 ~", help: ["① 두 방법에서 공통분모를 어떻게 구했는지 떠올려요. → ② 계산한 뒤 약분을 해야 했는지 견주어요.", "‘나는 두 분모의 ~을 공통분모로 할래요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요."],
          ans: "나는 두 분모의 최소공배수를 공통분모로 할래요. 수가 작아서 계산이 쉽고, 계산한 결과를 약분하지 않아도 되기 때문이에요. (두 분모의 곱이 편하다고 써도 까닭이 맞으면 좋아요.)" }) },
    { name: "약속하기 — 분모가 다른 분수의 덧셈", inst: "물 주기에서 찾은 방법을 약속해요.", hints: ["분모가 다르면 먼저 분모를 같게 만들어요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 분수의 덧셈은 분수를 ", { o: ["통분한 후", "약분한 후"], a: 0 }, " 분모는 ", { o: ["그대로 쓰고", "분모끼리 더하고"], a: 0 }, " 분자끼리 ", { o: ["더합니다", "곱합니다"], a: 0 }, "."], { ok: "분모가 다른 분수의 덧셈은 분수를 통분한 후 분모는 그대로 쓰고 분자끼리 더합니다." }) },
    { name: "확인하기 — 텃밭 물 계산하기", inst: "계산해 보세요. 약분하지 않은 분수로 써도 맞아요.", hints: ["12와 8의 최소공배수는 24, 7과 3의 최소공배수는 21이에요.", "[3/5]를 분모가 20인 분수로 나타내면 [12/20]예요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[5/12]+[3/8]", a: "19/24", den: 24 }, { e: "[2/7]+[1/3]", a: "13/21", den: 21 },
        { q: "예나는 방울토마토 칸에 액체 비료 [1/4] L와 물 [3/5] L를 섞어 뿌렸어요. 뿌린 것은 모두 몇 L일까요?", x: "[1/4]+[3/5]", a: "17/20", unit: "L", lab: "[1/4]+[3/5] =", why: { "4/9": "분모는 분모끼리, 분자는 분자끼리 더하면 안 돼요. 먼저 통분해요.", "4/20": "분모만 20으로 바꾸고 분자는 그대로 두었어요. [1/4] = [5/20], [3/5] = [12/20]예요." } }]) }
  ],
  challenge: { inst: "★ 도전 — 텃밭 퀴즈를 풀어 보세요.", hints: ["[1/10]이 3개인 수는 [3/10], [1/15]이 4개인 수는 [4/15]예요.", "[5/8]를 분모가 16인 분수로 나타내면 [10/16]이에요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "태오: “[1/10]이 3개인 수야.” 지안: “[1/15]이 4개인 수야.” 두 사람이 말한 분수의 합은?", x: "[3/10]+[4/15]", a: "17/30", lab: "합" },
      { q: "[3/16], [1/4], [5/8] 중에서 가장 큰 분수와 가장 작은 분수의 합은?", x: "[5/8]+[3/16]", a: "13/16", lab: "합", why: { "7/16": "[1/4]는 가장 작은 분수가 아니에요. 통분하면 [1/4] = [4/16]이고, [3/16]이 더 작아요.", "14/16": "[1/4]는 가장 큰 분수가 아니에요. [5/8] = [10/16]이 가장 커요." } }]) }
},
{
  id: "s3", no: 3, title: "거름 뿌리기 ― 진분수의 덧셈(2)", soop: "개념 구축하기(O)",
  question: "합이 1보다 큰 분모가 다른 진분수의 덧셈은 어떻게 할까요?",
  summary: "합이 1보다 큰 진분수의 덧셈도 두 분모의 곱이나 최소공배수를 공통분모로 하여 통분한 후 분모는 그대로 쓰고 분자끼리 더해요. 합이 가분수이면 대분수로 나타낼 수 있어요. [5/6]+[3/4] = [10/12]+[9/12] = [19/12] = [1 7/12]",
  steps: [
    { name: "만져 보기 — 거름 막대 합치기", inst: "서진이와 태오는 거름을 상추 칸에 [5/6] kg, 고추 칸에 [3/4] kg 뿌렸어요. 두 막대의 조각 크기를 같게 만들고, 뿌린 거름이 모두 몇 kg인지 알아보세요.", hints: ["6과 4의 최소공배수는 12예요.", "[5/6] = [10/12], [3/4] = [9/12]예요. [1/12]이 모두 몇 개일까요?"],
      render: (b, a) => fa5Split(b, a, { A: "5/6", B: "3/4", names: ["상추 칸 [5/6] kg", "고추 칸 [3/4] kg"], op: "+", d: 12, ask: [
        ["[5/6] = ", { q: [null, "?10", "12"] }],
        ["[3/4] = ", { q: [null, "?9", "12"] }],
        ["[5/6]+[3/4] = ", { q: [null, "10", "12"] }, "+", { q: [null, "9", "12"] }, " = ", { q: [null, "?19", "12"] }, " = ", { q: ["?1", "?7", "12"] }]], ok: "뿌린 거름은 모두 [1 7/12] kg이에요. 합이 1보다 커서 대분수로 나타냈어요." }) },
    { name: "그려 보기 — 두 가지 방법으로 더하기", inst: "예나네 모둠은 오이 칸에 거름을 [4/9] kg, 가지 칸에 [5/6] kg 뿌렸어요. [4/9]+[5/6]를 두 가지 방법으로 계산해 보세요.", hints: ["9×6 = 54, 9와 6의 최소공배수는 18이에요.", "[69/54] = [1 15/54]예요. 약분하면 [1 5/18]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 두 분모의 곱", p: ["[4/9]+[5/6] = ", { q: [null, ["4", "×", "?6"], ["9", "×", "?6"]] }, "+", { q: [null, ["5", "×", "?9"], ["6", "×", "?9"]] }, " = ", { q: [null, "?24", "54"] }, "+", { q: [null, "?45", "54"] }, " = ", { q: [null, "?69", "54"] }, " = ", { q: ["?1", "?15", "54"] }] },
        { t: "방법 2 · 최소공배수", p: ["[4/9]+[5/6] = ", { q: [null, ["4", "×", "?2"], ["9", "×", "?2"]] }, "+", { q: [null, ["5", "×", "?3"], ["6", "×", "?3"]] }, " = ", { q: [null, "?8", "18"] }, "+", { q: [null, "?15", "18"] }, " = ", { q: [null, "?23", "18"] }, " = ", { q: ["?1", "?5", "18"] }] }],
        { ok: "[1 15/54]를 약분하면 [1 5/18]이에요. 두 방법의 답은 크기가 같아요." }) },
    { name: "말해 보기 — 지안이의 계산 고치기", inst: "지안이가 [5/8]+[3/4]을 잘못 계산했어요. 잘못된 까닭을 고르고 옳게 계산해 보세요.", hints: ["[3/4]의 분모 4에 2를 곱했으면 분자 3에도 2를 곱해야 해요.", "[3/4] = [6/8]이에요."],
      render: thenWhy((b, a) => fa5Chain(b, a, [
        ["지안이의 계산: [5/8]+[3/4] = [5/8]+[3/8] = [8/8] = 1"],
        ["까닭: ", { c: ["분모에만 2를 곱하고 분자에는 곱하지 않았어요", "분모끼리 더했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[5/8]+[3/4] = [5/8]+", { q: [null, ["3", "×", "?2"], ["4", "×", "?2"]] }, " = [5/8]+", { q: [null, "?6", "8"] }, " = ", { q: [null, "?11", "8"] }, " = ", { q: ["?1", "?3", "8"] }] }],
        { ok: "[5/8]+[3/4] = [11/8] = [1 3/8]이에요. 분모에 곱한 수를 분자에도 곱해야 크기가 같은 분수가 돼요." }),
        { q: "분모에 곱한 수를 분자에도 곱해야 하는 까닭을 써 봐요.", ph: "분모에만 곱하면 ~", help: ["① [3/4]의 분모에만 2를 곱한 [3/8]이 [3/4]과 크기가 같은지 생각해요. → ② 크기가 같은 분수를 만드는 방법을 떠올려요.", "‘분모에만 곱하면 크기가 ~ 분수가 되어서, 분모와 분자에 ~을 곱해야 해요.’ 꼴로 써요."],
          ans: "분모에만 2를 곱하면 [3/8]처럼 크기가 더 작은 분수가 되어요. 분모와 분자에 같은 수를 곱해야 [6/8]처럼 크기가 같은 분수가 돼요." }) },
    { name: "약속하기 — 합이 1보다 클 때", inst: "합이 1보다 큰 진분수의 덧셈 방법을 정리해요.", hints: ["공통분모로는 두 분모의 곱도, 최소공배수도 쓸 수 있어요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 진분수의 덧셈은 두 분모의 ", { o: ["곱이나 최소공배수", "합이나 차"], a: 0 }, "를 공통분모로 하여 통분한 후 분모는 그대로 쓰고 분자끼리 더합니다. 합이 가분수이면 ", { o: ["대분수", "진분수"], a: 0 }, "로 나타낼 수 있어요."], { ok: "가분수로 답해도, 약분하지 않아도 맞아요. 대분수로 나타내면 크기를 알기 쉬워요." }) },
    { name: "확인하기 — 거름 계산하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["4와 10의 최소공배수는 20, 9와 12의 최소공배수는 36이에요.", "크기를 비교할 때는 두 식을 각각 계산한 다음 통분하여 비교해요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[3/4]+[9/10]", a: "1 13/20", den: 20 }, { e: "[8/9]+[5/12]", a: "1 11/36", den: 36 }, { e: "[5/7]+[1/2]", a: "1 3/14", den: 14 },
        { q: "계산 결과의 크기를 비교해요.", e: "[7/8]+[1/3] ○ [5/6]+[3/10]", pick: [">", "=", "<"], a: 0, why: { "2": "[7/8]+[1/3] = [29/24] = [1 5/24], [5/6]+[3/10] = [34/30] = [1 2/15]이에요. 분수 부분 [5/24]와 [2/15]를 통분하여 비교해요.", "1": "두 식을 계산해 보면 값이 달라요." } }]) }
  ],
  challenge: { inst: "★ 도전 — 텃밭 이름표에 붙일 수 카드 3, 4, 5, 6, 8 중에서 2장을 골라 한 번씩만 사용하여 진분수를 만들고, 친구가 만든 진분수와의 합을 구해 보세요.", hints: ["진분수는 분자가 분모보다 작아요.", "두 분모의 곱이나 최소공배수로 통분하여 더해요."],
    render: (b, a) => fa5Proper(b, a, { cards: [3, 4, 5, 6, 8] }) }
},
{
  id: "s4", no: 4, title: "물뿌리개로 물 주기 ― 대분수의 덧셈", soop: "개념 구축하기(O)",
  question: "분모가 다른 대분수의 덧셈은 어떻게 할까요?",
  summary: "대분수의 덧셈은 두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 더하거나, 대분수를 가분수로 나타내고 두 가분수를 통분하여 더해요. 분수 부분의 합이 1이거나 1보다 크면 1을 자연수 부분에 더해요. [1 3/4]+[2 1/2] = [1 3/4]+[2 2/4] = 3+[5/4] = [4 1/4]",
  steps: [
    { name: "만져 보기 — 물 색칠하고 모으기", inst: "민재는 물뿌리개로 텃밭에 물을 [1 3/4] L 준 다음, 흙이 말라 보여서 [2 1/2] L를 더 주었어요. 먼저 어림한 다음, 1 L를 4칸으로 나눈 막대에 두 양을 색칠하고 모아 보세요.", hints: ["[2 1/2] = [2 2/4]예요. 한 칸은 [1/4] L예요.", "‘모으기’를 누르면 자연수 부분끼리, 분수 부분끼리 모여요."],
      render: (b, a) => fa5Fill(b, a, { d: 4, A: { name: "처음", v: "1 3/4" }, B: { name: "더", v: "2 1/2" },
        est: { q: "민재가 준 물은 4 L보다 많을까요, 적을까요?", o: ["4 L보다 많아요", "4 L보다 적어요"], a: 0, why: { "1": "[1 3/4]은 [1 1/2]보다 커요. [1 1/2]+[2 1/2]은 4예요." } , ok: "[1 3/4]은 [1 1/2]보다 크고 여기에 [2 1/2]를 더하므로 4 L는 넘을 것 같아요." },
        askCalc: [{ e: "[1 3/4]+[2 1/2]", a: "4 1/4", unit: "L" }], ok: "민재가 준 물은 모두 [4 1/4] L예요. 어림한 대로 4 L보다 조금 많아요." }) },
    { name: "그려 보기 — 두 가지 방법으로 더하기", inst: "하린이네 모둠은 상추 모종을 심는 데 흙을 [2 1/3]포대, 거름을 섞은 흙을 [1 3/5]포대 썼어요. [2 1/3]+[1 3/5]을 두 가지 방법으로 계산해 보세요.", hints: ["방법 1: 3과 5의 최소공배수 15로 통분한 다음 자연수끼리, 분수끼리 더해요.", "방법 2: [2 1/3] = [7/3], [1 3/5] = [8/5]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 자연수끼리, 분수끼리", p: ["[2 1/3]+[1 3/5] = ", { q: ["?2", "?5", "15"] }, "+", { q: ["?1", "?9", "15"] }, " = (", { i: "2" }, "+", { i: "1" }, ")+(", { q: [null, "5", "15"] }, "+", { q: [null, "9", "15"] }, ") = ", { q: ["?3", "?14", "15"] }] },
        { t: "방법 2 · 가분수로", p: ["[2 1/3]+[1 3/5] = ", { q: [null, "?7", "3"] }, "+", { q: [null, "?8", "5"] }, " = ", { q: [null, "?35", "15"] }, "+", { q: [null, "?24", "15"] }, " = ", { q: [null, "?59", "15"] }, " = ", { q: ["?3", "?14", "15"] }] }],
        { ok: "두 방법 모두 [3 14/15]포대예요." }) },
    { name: "말해 보기 — 편리한 방법 고르기", inst: "고랑에 깔 짚을 첫째 날 [3 5/8] kg, 둘째 날 [1 5/6] kg 날랐어요. [3 5/8]+[1 5/6]를 두 가지 방법으로 계산하고, 두 방법을 설명해 보세요.", hints: ["8과 6의 최소공배수는 24예요.", "분수 부분의 합 [35/24]는 [1 11/24]이에요. 1을 자연수 부분에 더해요."],
      render: thenWhy((b, a) => fa5Chain(b, a, [
        { t: "방법 1", p: ["[3 5/8]+[1 5/6] = ", { q: ["3", "?15", "24"] }, "+", { q: ["1", "?20", "24"] }, " = ", { i: "4" }, "+", { q: [null, "?35", "24"] }, " = ", { q: ["?5", "?11", "24"] }] },
        { t: "방법 2", p: ["[3 5/8]+[1 5/6] = ", { q: [null, "?29", "8"] }, "+", { q: [null, "?11", "6"] }, " = ", { q: [null, "?87", "24"] }, "+", { q: [null, "?44", "24"] }, " = ", { q: [null, "?131", "24"] }, " = ", { q: ["?5", "?11", "24"] }] },
        ["방법 1은 ", { c: ["자연수는 자연수끼리, 분수는 분수끼리 더했어요", "대분수를 가분수로 나타내어 더했어요"], a: 0 }],
        ["방법 2는 ", { c: ["자연수는 자연수끼리, 분수는 분수끼리 더했어요", "대분수를 가분수로 나타내어 더했어요"], a: 1 }]],
        { ok: "두 방법 모두 [5 11/24] kg이에요. 방법 1에서는 분수 부분의 합 [35/24]에서 생긴 1을 자연수 부분에 더했어요." }),
        { q: "나는 어느 방법이 더 편리한가요? 까닭과 함께 써 봐요.", ph: "나는 방법 ~이 더 편리해요. 왜냐하면 ~", help: ["① 방법 1과 방법 2에서 다룬 수의 크기를 견주어 봐요. → ② 내가 더 쉽게 느낀 쪽을 골라요.", "‘나는 방법 ~이 더 편리해요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요."],
          ans: "나는 방법 1이 더 편리해요. 가분수로 바꾸면 [131/24]처럼 분자가 커지는데, 방법 1은 작은 분수만 더하면 되기 때문이에요. (방법 2가 편하다고 써도 까닭이 맞으면 좋아요.)" }) },
    { name: "약속하기 — 대분수의 덧셈 방법", inst: "분모가 다른 대분수의 덧셈 방법을 정리해요.", hints: ["두 가지 방법 모두 먼저 통분해요."],
      render: (b, a) => blanks(b, a, ["두 대분수를 통분하여 ", { o: ["자연수는 자연수끼리, 분수는 분수끼리", "분모는 분모끼리, 분자는 분자끼리"], a: 0 }, " 더하거나, 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내고 두 가분수를 통분하여 더합니다. 분수 부분의 합이 1이거나 1보다 크면 ", { o: ["1을 자연수 부분에 더해요", "그대로 두어요"], a: 0 }, "."], { ok: "상황에 따라 편리한 방법을 골라 계산해요." }) },
    { name: "확인하기 — 고랑과 물 계산하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["9와 6의 최소공배수는 18, 4와 10의 최소공배수는 20이에요.", "분수 부분의 합이 1보다 크면 1을 자연수 부분에 더해요."],
      render: (b, a) => fa5Calc(b, a, [
        { e: "[2 4/9]+[1 5/6]", a: "4 5/18", den: 18 }, { e: "[3 1/4]+[2 3/10]", a: "5 11/20", den: 20 },
        { q: "서진이네 모둠이 만든 첫째 고랑은 [4 2/3] m, 둘째 고랑은 [3 3/4] m예요. 두 고랑의 길이를 합하면 모두 몇 m일까요?", x: "[4 2/3]+[3 3/4]", a: "8 5/12", unit: "m", lab: "[4 2/3]+[3 3/4] =", den: 12 }]) }
  ],
  challenge: { inst: "★ 도전 — 텃밭 퀴즈를 풀어 보세요.", hints: ["[1 5/8]+[3 2/3]를 먼저 계산해요.", "합보다 작은 자연수를 모두 세어요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "합이 다른 하나를 골라요.", pick: ["㉠ [1 1/2]+[2 1/3]", "㉡ [2 1/6]+[1 2/3]", "㉢ [1 3/4]+[2 1/6]"], a: 2, why: { "0": "㉠ = [3 5/6], ㉡ = [3 5/6]로 합이 같아요.", "1": "㉠ = [3 5/6], ㉡ = [3 5/6]로 합이 같아요." } },
      { q: "[1 5/8]+[3 2/3]를 계산해요.", x: "[1 5/8]+[3 2/3]", a: "5 7/24", lab: "[1 5/8]+[3 2/3] =", den: 24 },
      { q: "[1 5/8]+[3 2/3] > □에서 □ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?", n: 5, unit: "개", lab: "개수", why: { "4": "합은 [5 7/24]이에요. 5도 [5 7/24]보다 작으니 들어갈 수 있어요.", "6": "6은 [5 7/24]보다 커서 들어갈 수 없어요." } }]) }
},
{
  id: "s5", no: 5, title: "액체 비료 덜어 내기 ― 진분수의 뺄셈", soop: "개념 구축하기(O)",
  question: "분모가 다른 진분수의 뺄셈은 어떻게 할까요?",
  summary: "분모가 다른 분수의 뺄셈은 분수를 통분한 후 분모는 그대로 쓰고 분자끼리 뺍니다. [3/4]−[1/3] = [9/12]−[4/12] = [5/12]. 두 분모의 곱이나 최소공배수를 공통분모로 쓸 수 있어요.",
  steps: [
    { name: "만져 보기 — 덜어 낸 비료", inst: "예나는 액체 비료 [3/4] L 중에서 [1/3] L를 덜어 내어 물에 섞었어요. 남은 액체 비료는 몇 L일까요? 두 막대의 조각 크기를 같게 만들어 보세요.", hints: ["4와 3의 최소공배수는 12예요.", "[3/4] = [9/12], [1/3] = [4/12]예요. [9/12]에서 [4/12]를 덜어 내요."],
      render: ruleFirst((b, a) => fa5Split(b, a, { A: "3/4", B: "1/3", names: ["처음 [3/4] L", "덜어 낸 [1/3] L"], op: "-", d: 12, ask: [
        ["[3/4] = ", { q: [null, "?9", "12"] }],
        ["[1/3] = ", { q: [null, "?4", "12"] }],
        ["[3/4]−[1/3] = ", { q: [null, "9", "12"] }, "−", { q: [null, "4", "12"] }, " = ", { q: [null, "?5", "12"] }]], ok: "남은 액체 비료는 [5/12] L예요. 통분한 다음 분자끼리 뺐어요." }),
        { q: "분모가 다른 두 분수의 뺄셈은 어떻게 하면 될까요?", ph: "내 규칙: 먼저 ~", help: ["① 덧셈할 때 먼저 무엇을 했는지 떠올려요. → ② 조각 크기를 같게 만든 다음 무엇을 뺄지 생각해요.", "‘내 규칙: 먼저 ~하고, 분모는 ~, 분자는 ~해요.’ 꼴로 써요."],
          ans: "덧셈처럼 먼저 통분하고, 분모는 그대로 쓰고 분자끼리 빼요. [3/4]−[1/3] = [9/12]−[4/12] = [5/12]예요." }) },
    { name: "그려 보기 — 두 가지 방법으로 빼기", inst: "고추 칸 물통에 물이 [5/6] L 있었는데 [3/8] L를 썼어요. [5/6]−[3/8]을 두 가지 방법으로 계산해 보세요.", hints: ["6×8 = 48, 6과 8의 최소공배수는 24예요.", "[22/48]를 약분하면 [11/24]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 두 분모의 곱", p: ["[5/6]−[3/8] = ", { q: [null, ["5", "×", "?8"], ["6", "×", "?8"]] }, "−", { q: [null, ["3", "×", "?6"], ["8", "×", "?6"]] }, " = ", { q: [null, "?40", "48"] }, "−", { q: [null, "?18", "48"] }, " = ", { q: [null, "?22", "48"] }] },
        { t: "방법 2 · 최소공배수", p: ["[5/6]−[3/8] = ", { q: [null, ["5", "×", "?4"], ["6", "×", "?4"]] }, "−", { q: [null, ["3", "×", "?3"], ["8", "×", "?3"]] }, " = ", { q: [null, "?20", "24"] }, "−", { q: [null, "?9", "24"] }, " = ", { q: [null, "?11", "24"] }] }],
        { ok: "[22/48]를 약분하면 [11/24]이에요. 최소공배수로 통분하면 약분할 필요가 없어요." }) },
    { name: "말해 보기 — 태오와 다른 방법", inst: "태오는 [7/10]−[1/4]를 두 분모의 곱으로 통분해 계산했어요. 태오와 다른 방법으로 계산해 보세요.", hints: ["10과 4의 최소공배수는 20이에요.", "[7/10] = [14/20], [1/4] = [5/20]예요."],
      render: thenWhy((b, a) => fa5Chain(b, a, [
        { t: "태오의 방법", p: ["[7/10]−[1/4] = [28/40]−[10/40] = [18/40] = [9/20]"] },
        { t: "다른 방법", p: ["[7/10]−[1/4] = ", { q: [null, ["7", "×", "?2"], ["10", "×", "?2"]] }, "−", { q: [null, ["1", "×", "?5"], ["4", "×", "?5"]] }, " = ", { q: [null, "?14", "20"] }, "−", { q: [null, "?5", "20"] }, " = ", { q: [null, "?9", "20"] }] }],
        { ok: "두 방법 모두 [9/20]예요. 최소공배수 20으로 통분하면 약분하지 않아도 돼요." }),
        { q: "태오의 방법과 내 방법을 비교해 말해 봐요.", ph: "태오는 ~을, 나는 ~을 공통분모로 했어요", help: ["① 두 방법의 공통분모가 각각 무엇인지 써요. → ② 계산한 결과를 약분해야 했는지 견주어요.", "‘태오는 ~을, 나는 ~을 공통분모로 했어요. 그래서 ~’ 꼴로 써요."],
          ans: "태오는 두 분모의 곱 40을, 나는 최소공배수 20을 공통분모로 했어요. 태오는 [18/40]을 약분해야 했지만 나는 바로 [9/20]가 나왔어요." }) },
    { name: "약속하기 — 분모가 다른 분수의 뺄셈", inst: "덜어 낸 비료에서 찾은 방법을 약속해요.", hints: ["덧셈과 마찬가지로 먼저 분모를 같게 만들어요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 분수의 뺄셈은 분수를 ", { o: ["통분한 후", "약분한 후"], a: 0 }, " 분모는 ", { o: ["그대로 쓰고", "분모끼리 빼고"], a: 0 }, " 분자끼리 ", { o: ["뺍니다", "더합니다"], a: 0 }, "."], { ok: "분모가 다른 분수의 뺄셈은 분수를 통분한 후 분모는 그대로 쓰고 분자끼리 뺍니다." }) },
    { name: "확인하기 — 빗물과 비료 계산하기", inst: "계산해 보세요. 약분하지 않은 분수로 써도 맞아요.", hints: ["9와 6의 최소공배수는 18, 5와 7의 최소공배수는 35예요.", "[5/6] = [10/12], [3/4] = [9/12]예요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[7/9]−[1/6]", a: "11/18", den: 18 }, { e: "[4/5]−[3/7]", a: "13/35", den: 35 },
        { q: "비가 온 뒤 상추 칸 물받이에는 빗물이 [5/6] L, 고추 칸 물받이에는 [3/4] L 모였어요. 상추 칸 물받이에 빗물이 몇 L 더 많이 모였을까요?", x: "[5/6]−[3/4]", a: "1/12", unit: "L", lab: "[5/6]−[3/4] =", why: { "2/2": "분모는 분모끼리, 분자는 분자끼리 빼면 안 돼요. 먼저 통분해요." } }]) }
  ],
  challenge: { inst: "★ 도전 — 지안이가 비료 계산을 하다가 실수했어요. 어떤 수에서 [1/4]를 빼야 하는데 잘못하여 더했더니 [11/12]이 되었어요.", hints: ["어떤 수 + [1/4] = [11/12]이에요. 어떤 수는 [11/12]−[1/4]예요.", "바르게 계산하려면 어떤 수에서 [1/4]를 빼요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "어떤 수는 얼마일까요?", x: "[11/12]−[1/4]", a: "8/12", lab: "어떤 수", den: 12 },
      { q: "바르게 계산하면 얼마일까요?", x: "[8/12]−[1/4]", a: "5/12", lab: "바르게 계산한 값", den: 12 }], { ok: "어떤 수는 [8/12]([2/3])이고, 바르게 계산하면 [5/12]예요." }) }
},
{
  id: "s6", no: 6, title: "덩굴 길이 비교하기 ― 대분수의 뺄셈(1)", soop: "개념 구축하기(O)",
  question: "분수 부분끼리 뺄 수 있는 분모가 다른 대분수의 뺄셈은 어떻게 할까요?",
  summary: "대분수의 뺄셈은 두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 빼거나, 대분수를 가분수로 나타내고 통분하여 빼요. 자연수끼리 뺀 결과와 분수끼리 뺀 결과는 더해요. [2 3/4]−[1 1/6] = [2 9/12]−[1 2/12] = 1+[7/12] = [1 7/12]",
  steps: [
    { name: "만져 보기 — 덩굴 길이 덜어 내기", inst: "지안이네 모둠의 호박 덩굴은 [2 3/4] m, 오이 덩굴은 [1 1/6] m 자랐어요. 호박 덩굴은 오이 덩굴보다 몇 m 더 길까요? 먼저 어림한 다음, 1 m를 12칸으로 나눈 막대에 [1 1/6] m만큼 ×표 해 보세요.", hints: ["[1 1/6] = [1 2/12]예요. 1 m 막대 하나와 작은 칸 2개에 ×표 해요.", "남은 칸을 세어 봐요."],
      render: (b, a) => fa5Take(b, a, { d: 12, m: "2 3/4", s: "1 1/6", unit: "m",
        est: { q: "호박 덩굴은 오이 덩굴보다 약 몇 m 더 길까요?", o: ["약 1 m", "약 2 m", "약 4 m"], a: 1, why: { "0": "[2 3/4]은 3에 가깝고, [1 1/6]은 1에 가까워요.", "2": "더 긴 만큼은 두 길이의 차예요. 더하면 안 돼요." }, ok: "[2 3/4]은 3에 가깝고 [1 1/6]은 1에 가까우니 약 2 m 더 길 것 같아요." },
        ask: [
          ["[2 3/4] = ", { q: ["2", "?9", "12"] }],
          ["[1 1/6] = ", { q: ["1", "?2", "12"] }],
          ["[2 3/4]−[1 1/6] = ", { q: ["2", "9", "12"] }, "−", { q: ["1", "2", "12"] }, " = ", { q: ["?1", "?7", "12"] }]], ok: "호박 덩굴이 [1 7/12] m 더 길어요. 어림한 약 2 m와 비슷해요." }) },
    { name: "그려 보기 — 두 가지 방법으로 빼기", inst: "고추 칸 둘레에 친 줄은 [4 5/6] m, 가지 칸 둘레에 친 줄은 [2 3/8] m예요. [4 5/6]−[2 3/8]을 두 가지 방법으로 계산해 보세요.", hints: ["6과 8의 최소공배수는 24예요.", "방법 2: [4 5/6] = [29/6], [2 3/8] = [19/8]예요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 자연수끼리, 분수끼리", p: ["[4 5/6]−[2 3/8] = ", { q: ["4", "?20", "24"] }, "−", { q: ["2", "?9", "24"] }, " = (", { i: "4" }, "−", { i: "2" }, ")+(", { q: [null, "20", "24"] }, "−", { q: [null, "9", "24"] }, ") = ", { q: ["?2", "?11", "24"] }] },
        { t: "방법 2 · 가분수로", p: ["[4 5/6]−[2 3/8] = ", { q: [null, "?29", "6"] }, "−", { q: [null, "?19", "8"] }, " = ", { q: [null, "?116", "24"] }, "−", { q: [null, "?57", "24"] }, " = ", { q: [null, "?59", "24"] }, " = ", { q: ["?2", "?11", "24"] }] }],
        { ok: "두 방법 모두 [2 11/24] m예요. 방법 1은 분수 부분의 계산이 간단하고, 방법 2는 자연수 부분과 분수 부분을 따로 계산하지 않아도 돼요." }) },
    { name: "말해 보기 — 민재의 계산 고치기", inst: "민재가 [3 2/3]−[1 1/4]를 잘못 계산했어요. 민재의 계산: [3 2/3]−[1 1/4] = [3 8/12]−[1 3/12] = 2−[5/12] = [1 7/12]. 잘못된 까닭을 고르고 옳게 계산해 보세요.", hints: ["[3 8/12]은 3과 [8/12]을 더한 수예요.", "(3−1)+([8/12]−[3/12])을 계산해요."],
      render: thenWhy((b, a) => fa5Chain(b, a, [
        ["까닭: ", { c: ["자연수끼리 뺀 결과와 분수끼리 뺀 결과를 더해야 하는데 뺐어요", "통분을 잘못했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[3 2/3]−[1 1/4] = [3 8/12]−[1 3/12] = ", { i: "2" }, "+", { q: [null, "?5", "12"] }, " = ", { q: ["?2", "?5", "12"] }] }],
        { ok: "[3 2/3]−[1 1/4] = [2 5/12]이에요. 자연수끼리 뺀 2와 분수끼리 뺀 [5/12]을 더해요." }),
        { q: "자연수끼리 뺀 결과와 분수끼리 뺀 결과를 더해야 하는 까닭을 써 봐요.", ph: "[3 8/12]은 3과 [8/12]을 ~", help: ["① 대분수 [3 8/12]이 어떤 두 수를 합한 수인지 생각해요. → ② 각각 뺀 두 결과를 합해야 처음 수의 차가 되는지 생각해요.", "‘대분수는 자연수와 분수를 ~ 수라서, 나누어 뺀 두 결과를 ~해야 해요.’ 꼴로 써요."],
          ans: "대분수 [3 8/12]은 3과 [8/12]을 더한 수예요. 그래서 3−1과 [8/12]−[3/12]을 각각 구한 다음 두 결과를 더해야 처음 두 수의 차가 돼요." }) },
    { name: "약속하기 — 대분수의 뺄셈 방법", inst: "분수 부분끼리 뺄 수 있는 대분수의 뺄셈 방법을 정리해요.", hints: ["두 방법 모두 먼저 통분해요."],
      render: (b, a) => blanks(b, a, ["두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 빼고 두 결과를 ", { o: ["더하거나", "빼거나"], a: 0 }, ", 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내고 통분하여 뺍니다. 자연수끼리, 분수끼리 계산하면 ", { o: ["분수 부분의 계산이 편리하고", "약분을 꼭 해야 하고"], a: 0 }, ", 가분수로 나타내면 자연수 부분과 분수 부분을 따로 계산하지 않아서 편리해요."], { ok: "상황에 따라 편리한 방법을 골라 계산해요." }) },
    { name: "확인하기 — 덩굴과 감자 계산하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["10과 4의 최소공배수는 20, 9와 6의 최소공배수는 18이에요.", "자연수끼리 뺀 결과와 분수끼리 뺀 결과를 더해요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[5 7/10]−[2 1/4]", a: "3 9/20", den: 20 }, { e: "[6 5/9]−[3 1/6]", a: "3 7/18", den: 18 },
        { q: "태오네 모둠은 감자를 [3 4/5] kg 캐어 그중 [1 1/2] kg을 급식실에 보냈어요. 남은 감자는 몇 kg일까요?", x: "[3 4/5]−[1 1/2]", a: "2 3/10", unit: "kg", lab: "[3 4/5]−[1 1/2] =", den: 10 }]) }
  ],
  challenge: { inst: "★ 도전 — 텃밭 퀴즈를 풀어 보세요.", hints: ["‘더 작은 수’는 빼서 구해요.", "4와 6의 최소공배수는 12예요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "[5 3/4]보다 [2 1/6]만큼 더 작은 수는?", x: "[5 3/4]−[2 1/6]", a: "3 7/12", lab: "답", den: 12 },
      { q: "물통 두 개에 물이 [4 5/6] L, [2 1/4] L 들어 있어요. 두 물통에 든 물의 양의 차는 몇 L일까요?", x: "[4 5/6]−[2 1/4]", a: "2 7/12", unit: "L", lab: "[4 5/6]−[2 1/4] =", den: 12 }]) }
},
{
  id: "s7", no: 7, title: "고구마 나누어 먹기 ― 대분수의 뺄셈(2)", soop: "개념 구축하기(O)",
  question: "분수 부분끼리 뺄 수 없는 분모가 다른 대분수의 뺄셈은 어떻게 할까요?",
  summary: "분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 1만큼을 분수로 나타내어 계산해요. 이때 자연수 부분은 1 작아져요. [3 1/4]−[1 2/3] = [3 3/12]−[1 8/12] = [2 15/12]−[1 8/12] = [1 7/12]. 대분수를 가분수로 나타내어 계산해도 돼요.",
  steps: [
    { name: "만져 보기 — 고구마 덜어 내기", inst: "서진이네 모둠은 고구마를 [3 1/4] kg 캤어요. 그중 [1 2/3] kg을 쪄서 반 친구들과 나누어 먹었어요. 남은 고구마는 몇 kg일까요? 1 kg 막대를 12칸으로 나누어 [1 2/3] kg만큼 ×표 해 보세요.", hints: ["[1 2/3] = [1 8/12]이에요. 1 kg 막대 하나와 작은 칸 8개에 ×표 해요.", "남은 작은 칸은 3개뿐이에요. ‘1을 쪼개기’로 1 kg을 [12/12]로 나누어요."],
      render: ruleFirst((b, a) => fa5Take(b, a, { d: 12, m: "3 1/4", s: "1 2/3", unit: "kg", ask: [
        ["[3 1/4] = ", { q: ["3", "?3", "12"] }],
        ["[1 2/3] = ", { q: ["1", "?8", "12"] }],
        ["[3 1/4]−[1 2/3] = ", { q: ["?2", "?15", "12"] }, "−", { q: ["1", "8", "12"] }, " = ", { q: ["?1", "?7", "12"] }]], ok: "남은 고구마는 [1 7/12] kg이에요. [3 3/12]의 1만큼을 [12/12]로 바꾸어 [2 15/12]로 만든 다음 뺐어요." }),
        { q: "분수 부분끼리 뺄 수 없을 때는 어떻게 하면 될까요?", ph: "내 규칙: 자연수 부분에서 ~", help: ["① [3/12]에서 [8/12]을 뺄 수 있는지 생각해요. → ② 자연수 부분의 1을 어떻게 바꾸면 좋을지 생각해요.", "‘내 규칙: 자연수 부분에서 1만큼을 ~로 바꾸어 분수 부분에 더한 다음 빼요.’ 꼴로 써요."],
          ans: "자연수 부분에서 1만큼을 [12/12]로 바꾸어 분수 부분에 더해요. [3 3/12]을 [2 15/12]로 바꾸면 [2 15/12]−[1 8/12] = [1 7/12]이에요." }) },
    { name: "그려 보기 — 두 가지 방법으로 빼기", inst: "고구마 줄기를 [5 1/6] m 걷어서 그중 [2 3/4] m로 바구니를 엮었어요. 남은 줄기의 길이를 두 가지 방법으로 구해 보세요.", hints: ["6과 4의 최소공배수는 12예요. [5 2/12]에서 1만큼을 [12/12]로 바꾸면 [4 14/12]예요.", "방법 2: [5 1/6] = [31/6], [2 3/4] = [11/4]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 자연수끼리, 분수끼리", p: ["[5 1/6]−[2 3/4] = ", { q: ["5", "?2", "12"] }, "−", { q: ["2", "?9", "12"] }, " = ", { q: ["?4", "?14", "12"] }, "−", { q: ["2", "9", "12"] }, " = ", { q: ["?2", "?5", "12"] }] },
        { t: "방법 2 · 가분수로", p: ["[5 1/6]−[2 3/4] = ", { q: [null, "?31", "6"] }, "−", { q: [null, "?11", "4"] }, " = ", { q: [null, "?62", "12"] }, "−", { q: [null, "?33", "12"] }, " = ", { q: [null, "?29", "12"] }, " = ", { q: ["?2", "?5", "12"] }] }],
        { ok: "남은 줄기는 [2 5/12] m예요. 두 방법의 답이 같아요." }) },
    { name: "말해 보기 — 하린이의 계산 고치기", inst: "하린이가 [4 1/6]−[1 3/4]을 계산했어요. 하린이의 계산: [4 1/6]−[1 3/4] = [4 2/12]−[1 9/12] = [4 14/12]−[1 9/12] = [3 5/12]. 잘못된 까닭을 고르고 옳게 계산해 보세요.", hints: ["1만큼을 [12/12]로 바꾸었으면 자연수 부분은 4에서 3이 돼요.", "[4 2/12] = [3 14/12]예요."],
      render: thenWhy((b, a) => fa5Chain(b, a, [
        ["까닭: ", { c: ["1만큼을 분수로 바꾸었는데 자연수 부분 4를 그대로 두었어요", "분수 부분끼리 더했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[4 2/12]−[1 9/12] = ", { q: ["?3", "?14", "12"] }, "−[1 9/12] = ", { q: ["?2", "?5", "12"] }] }],
        { ok: "[4 1/6]−[1 3/4] = [2 5/12]예요. 1만큼을 분수로 바꾸면 자연수 부분은 1 작아져요." }),
        { q: "1만큼을 분수로 바꾸면 자연수 부분이 왜 1 작아질까요?", ph: "1을 [12/12]로 바꾸어 ~", help: ["① 자연수 부분에서 꺼낸 1이 어디로 갔는지 생각해요. → ② 바꾸기 전과 후의 크기가 같아야 함을 떠올려요.", "‘1을 [12/12]로 바꾸어 ~에 더했으니, 자연수 부분에서는 1을 ~야 크기가 그대로예요.’ 꼴로 써요."],
          ans: "자연수 부분의 1을 [12/12]로 바꾸어 분수 부분에 더했으니, 자연수 부분에서는 그 1을 빼야 크기가 그대로예요. 그래서 [4 2/12] = [3 14/12]예요." }) },
    { name: "약속하기 — 분수 부분끼리 뺄 수 없을 때", inst: "분수 부분끼리 뺄 수 없는 대분수의 뺄셈 방법을 정리해요.", hints: ["자연수 부분에서 1만큼을 분수로 나타내요."],
      render: (b, a) => blanks(b, a, ["분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 ", { o: ["1만큼을 분수로 나타내어", "분모만큼을 분자에 더하여"], a: 0 }, " 계산해요. 이때 자연수 부분은 ", { o: ["1 작아져요", "그대로예요"], a: 0 }, ". 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내어 통분한 다음 빼도 돼요."], { ok: "분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 1만큼을 분수로 나타내어 계산해요." }) },
    { name: "확인하기 — 고구마와 물 계산하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["5와 3의 최소공배수는 15, 8과 6의 최소공배수는 24예요.", "분수 부분끼리 뺄 수 없으면 1만큼을 분수로 바꾸어요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[6 2/5]−[3 2/3]", a: "2 11/15", den: 15 }, { e: "[4 1/8]−[2 5/6]", a: "1 7/24", den: 24 },
        { q: "텃밭 물통에 물이 [5 1/3] L 있었는데 아침에 [2 4/5] L를 썼어요. 남은 물은 몇 L일까요?", x: "[5 1/3]−[2 4/5]", a: "2 8/15", unit: "L", lab: "[5 1/3]−[2 4/5] =", den: 15 }]) }
  ],
  challenge: { inst: "★ 도전 — [4 1/3]−[1 4/5]를 계산하고, 이 식에 알맞은 텃밭 문제를 만들어 보세요.", hints: ["3과 5의 최소공배수는 15예요. [4 5/15]−[1 12/15]는 분수 부분끼리 뺄 수 없어요.", "처음 양에서 쓴 양을 빼거나, 두 양의 차를 묻는 문제를 만들어요."],
    render: (b, a) => { fa5Calc(b, a, [{ e: "[4 1/3]−[1 4/5]", a: "2 8/15", den: 15 }], { ok: "[4 1/3]−[1 4/5] = [3 20/15]−[1 12/15] = [2 8/15]이에요." });
      writeStep(b, a, [{ q: "[4 1/3]−[1 4/5]에 알맞은 텃밭 문제를 만들어 써 봐요.", tag: "내가 만든 문제", ph: "예) 텃밭 물통에 물이 [4 1/3] L 있었는데 …", help: ["① 처음에 있던 양 [4 1/3]로 시작해요. → ② [1 4/5]만큼 쓰거나 비교하는 상황을 만들고 남은 양이나 차를 물어요.", "‘~이 [4 1/3] ○ 있었는데 ~에 [1 4/5] ○를 썼어요. 남은 ~은 몇 ○일까요?’ 꼴로 써요."],
        ans: "텃밭 물통에 물이 [4 1/3] L 있었는데 오이 칸에 [1 4/5] L를 주었어요. 남은 물은 몇 L일까요? (답: [2 8/15] L)" }]); } }
},
{
  id: "s8", no: 8, title: "수확한 채소 나누기 ― 생각을 모아요", soop: "탐구 정리하기(O)",
  question: "수확한 채소의 무게를 더하고 빼서 나눔 계획을 세워 볼까요?",
  summary: "세 분수를 더할 때는 두 수씩 차례대로 더하거나, 세 분모의 공통분모로 한꺼번에 통분하여 더해요. 수확한 채소는 모두 [1 3/4]+[5/6]+[2 2/3] = [5 1/4] kg이고, 급식실에 [2 1/2] kg을 보내면 [2 3/4] kg이 남아요.",
  steps: [
    { name: "만져 보기 — 문제 이해하기", inst: "드디어 수확하는 날이에요! 수확 기록 카드를 읽고 알맞은 것을 골라 보세요.", hints: ["구하려는 것은 급식실에 보내고 남는 채소의 무게예요.", "카드의 ‘수확한 채소’ 칸을 살펴봐요."],
      render: (b, a) => { b.append(fa5sHarvest()); quiz(b, a, [
        { q: "우리 반이 구하려는 것은 무엇인가요?", o: ["급식실에 보내고 남는 채소의 무게", "수확한 채소의 가격", "채소를 나누어 줄 친구의 수"], a: 0 },
        { q: "수확한 방울토마토는 몇 kg인가요?", o: ["[2 2/3] kg", "[1 3/4] kg", "[5/6] kg"], a: 0 },
        { q: "급식실에 보낼 채소는 몇 kg인가요?", o: ["[2 1/2] kg", "[2 2/3] kg", "[5 1/4] kg"], a: 0 }], { ok: "구하려는 것과 주어진 것을 잘 찾았어요." }); } },
    { name: "그려 보기 — 계획 세우기", inst: "어떻게 해결할지 계획해요.", hints: ["‘모두’ 얼마인지와 ‘남는’ 양을 구할 때를 생각해요.", "4, 6, 3의 최소공배수는 12예요."],
      render: (b, a) => blanks(b, a, ["수확한 채소의 무게는 세 채소의 무게를 모두 ", { o: ["더해요", "빼요"], a: 0 }, ". 남는 채소는 수확한 무게에서 급식실에 보낼 무게를 ", { o: ["빼요", "더해요"], a: 0 }, ". 세 분수를 더할 때는 ", { o: ["두 수씩 차례대로 더하거나 세 분모의 공통분모로 통분해요", "분모끼리 모두 더해요"], a: 0 }, "."], { ok: "더해서 수확한 무게를, 빼서 남는 무게를 구해요." }) },
    { name: "말해 보기 — 차례대로 계산하기", inst: "계획대로 차례대로 계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["[1 3/4]+[5/6] = [1 9/12]+[10/12]이에요.", "[5 3/12]−[2 6/12]은 분수 부분끼리 뺄 수 없어요. 1만큼을 [12/12]로 바꾸어요."],
      render: thenWhy((b, a) => fa5Calc(b, a, [
        { g: "① 상추와 고추", lab: "[1 3/4]+[5/6] =", x: "[1 3/4]+[5/6]", a: "2 7/12", unit: "kg", den: 12 },
        { g: "② 방울토마토까지", lab: "[2 7/12]+[2 2/3] =", x: "[2 7/12]+[2 2/3]", a: "5 3/12", unit: "kg", den: 12 },
        { g: "③ 급식실에 보내고 남는 채소", lab: "[5 3/12]−[2 1/2] =", x: "[5 3/12]−[2 1/2]", a: "2 9/12", unit: "kg", den: 12 }],
        { fig: fa5sHarvest, ok: "수확한 채소는 모두 [5 3/12] kg([5 1/4] kg)이고, 급식실에 보내면 [2 9/12] kg([2 3/4] kg)이 남아요." }),
        { q: "세 분수를 한꺼번에 통분한다면 공통분모로 무엇을 쓰면 좋을까요?", ph: "4, 6, 3의 ~", help: ["① 세 분모 4, 6, 3을 써요. → ② 세 수의 공배수 중 가장 작은 수를 찾아요.", "‘4, 6, 3의 최소공배수인 ~를 공통분모로 써요.’ 꼴로 써요."],
          ans: "4, 6, 3의 최소공배수인 12를 공통분모로 써요. [1 9/12]+[10/12]+[2 8/12] = 3+[27/12] = [5 3/12]이에요." }) },
    { name: "약속하기 — 값이 같은 식 잇기", inst: "나눔 계획을 다시 확인해요. 계산 결과가 같은 식끼리 이어 보세요.", hints: ["모두 분모를 12로 통분하면 비교하기 쉬워요.", "[1 3/4]+[5/6] = [2 7/12], [5 1/4]−[2 1/2] = [2 3/4]이에요."],
      render: (b, a) => fa5Match(b, a, { left: [{ t: "[1 3/4]+[5/6]", k: 1 }, { t: "[5 1/4]−[2 1/2]", k: 2 }], right: [{ t: "[3 1/3]−[3/4]", k: 1 }, { t: "[1 1/6]+[1 7/12]", k: 2 }, { t: "[2 2/3]+[1/6]", k: null }],
        ok: "[1 3/4]+[5/6] = [3 1/3]−[3/4] = [2 7/12], [5 1/4]−[2 1/2] = [1 1/6]+[1 7/12] = [2 3/4]이에요." }) },
    { name: "확인하기 — 되돌아보기", inst: "우리 반이 문제를 어떻게 해결했는지 되돌아보고 써 보세요.", hints: ["무엇을 더하고 무엇을 뺐는지 떠올려요.", "통분할 때 쓴 공통분모를 떠올려요."],
      render: (b, a) => writeStep(b, a, [
        { q: "남는 채소의 무게를 어떻게 구했는지 설명해 보세요.", tag: "해결 방법", ph: "예) 세 채소의 무게를 차례대로 더하고 …", help: ["① 무엇을 더했는지 써요. → ② 그다음 무엇에서 무엇을 뺐는지 차례대로 써요.", "‘세 채소의 무게를 통분하여 ~하고, 그 합에서 ~을 빼서 구했어요.’ 꼴로 써요."],
          ans: "세 채소의 무게를 통분하여 차례대로 더해 [5 1/4] kg을 구하고, 그 합에서 급식실에 보낼 [2 1/2] kg을 빼서 [2 3/4] kg을 구했어요." },
        { q: "계산 결과가 알맞은지 어떻게 확인할 수 있을까요?", tag: "확인 방법", ph: "예) 어림해 보면 …", help: ["① 세 무게를 가까운 자연수로 어림해 봐요. → ② 어림한 값과 계산한 값을 견주어요.", "‘어림하면 약 ~ kg에서 약 ~ kg을 빼서 약 ~ kg이니까 알맞아요.’ 꼴로 써요."],
          ans: "어림하면 2+1+3 = 6에서 약 [2 1/2]을 빼서 약 [3 1/2] kg쯤이에요. 수확한 무게를 조금 크게 어림했으니 [2 3/4] kg은 알맞은 답이에요." }]) }
  ],
  challenge: { inst: "★ 도전 — 남은 [2 3/4] kg으로 가족 나눔 봉지를 만들어요. 첫째 봉지에 [1 1/3] kg, 둘째 봉지에 [7/8] kg을 담았어요. 담고 남은 채소는 몇 kg일까요?", hints: ["앞에서부터 차례대로 빼요.", "4, 3, 8의 최소공배수는 24예요."],
    render: (b, a) => fa5Calc(b, a, [{ x: "[2 3/4]−[1 1/3]−[7/8]", a: "13/24", den: 24, unit: "kg", lab: "[2 3/4]−[1 1/3]−[7/8] =" }], { ok: "담고 남은 채소는 [13/24] kg이에요. 세 수를 차례대로 계산했어요." }) }
},
{
  id: "s9", no: 9, title: "텃밭 놀이 한마당 ― 분수 윷놀이", soop: "발표하기(P)",
  question: "놀이를 하며 분모가 다른 분수를 정확하게 더하고 뺄 수 있을까요?",
  summary: "주사위 눈만큼 말을 옮기고, 분수 주사위의 ‘+’, ‘−’에 따라 도착한 칸의 분수와 분수 주사위의 분수를 더하거나 빼요. 뺄셈은 (큰 수)−(작은 수)로 식을 세워요. 계산이 맞으면 말이 그 칸에 남고, 틀리면 원래 칸으로 돌아가요. 약분하지 않은 분수나 가분수로 답해도 맞아요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알아보기", inst: "수확을 마친 날, 텃밭 놀이 한마당이 열렸어요! 분수 윷놀이의 방법을 읽고 알맞은 것을 골라 보세요. 주사위 눈만큼 말을 옮기고, 분수 주사위에 따라 도착한 칸의 분수와 더하거나 빼요.", hints: ["♥가 나오면 계산하지 않아요.", "뺄셈은 (큰 수)−(작은 수)로 식을 세워요."],
      render: (b, a) => quiz(b, a, [
        { q: "분수 주사위에서 ♥가 나오면?", o: ["계산하지 않고 말을 그 칸에 그대로 두어요", "말을 처음으로 되돌려요"], a: 0 },
        { q: "계산 결과가 틀리면?", o: ["말을 옮기기 전에 있던 칸으로 되돌려요", "말을 한 칸 더 옮겨요"], a: 0 },
        { q: "도착한 칸이 [1/8]이고 분수 주사위가 −[1/6]일 때 세울 식은?", o: ["[1/6]−[1/8]", "[1/8]−[1/6]"], a: 0, why: { "1": "[1/8]은 [1/6]보다 작아요. 큰 수에서 작은 수를 빼요." } }], { ok: "놀이 방법을 알았어요. 이기려면 계산을 정확하게 해야 해요." }) },
    { name: "그려 보기 — 예나의 놀이 기록", inst: "예나가 윷놀이를 하며 계산한 기록이에요. 차례대로 계산해 보세요.", hints: ["8과 2의 최소공배수는 8, 5와 3의 최소공배수는 15예요.", "6과 8의 최소공배수는 24예요."],
      render: (b, a) => fa5Calc(b, a, [
        { q: "도착한 칸 [5/8], 분수 주사위 +[1/2]", e: "[5/8]+[1/2]", a: "1 1/8", den: 8 },
        { q: "도착한 칸 [1 2/5], 분수 주사위 −[1/3]", e: "[1 2/5]−[1/3]", a: "1 1/15", den: 15 },
        { q: "도착한 칸 [1/8], 분수 주사위 −[1/6]", e: "[1/6]−[1/8]", a: "1/24", den: 24 }], { ok: "예나의 계산을 모두 맞혔어요. 이제 직접 놀이해 봐요!" }) },
    { name: "말해 보기 — 분수 윷놀이 하기", inst: "로봇과 분수 윷놀이를 해요. 주사위를 던지고 말을 골라 움직인 다음, 계산 결과를 쓰면 저절로 확인해요. 모든 말이 먼저 놀이판을 나오면 이겨요.", hints: ["★ 칸에 멈추면 지름길로 가요.", "통분한 다음 분자끼리 더하거나 빼요."],
      render: (b, a) => fa5Yut(b, a, {}) },
    { name: "약속하기 — 카드 놀이 하기", inst: "또 다른 놀이예요. 카드를 보기 전에 덧셈이나 뺄셈을 고르고, 노란 카드와 파란 카드를 한 장씩 뒤집어 계산해요. 5판을 해요.", hints: ["노란 카드는 분모가 2~5, 파란 카드는 분모가 6~9예요.", "계산이 맞으면 1점, 결과가 더 크면 1점을 더 얻어요."],
      render: (b, a) => fa5CardGame(b, a, {}) },
    { name: "확인하기 — 이기는 전략 찾기", inst: "놀이에서 나온 카드로 생각해 보세요.", hints: ["[4/5]와 [7/9]은 모두 [1/2]보다 커요.", "[3/7]은 [3/8]보다 커요. 더 큰 수를 빼면 차는 작아져요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "[4/5]+[7/9]은 1보다 클까요, 작을까요?", o: ["1보다 커요", "1보다 작아요"], a: 0, why: { "1": "[4/5]와 [7/9]은 모두 [1/2]보다 커요. [1/2]보다 큰 수 두 개를 더하면 1보다 커요." } },
        { q: "[1 2/3]−[5/6]은?", o: ["[5/6]", "[1 1/6]", "[3/6]"], a: 0, why: { "1": "[1 2/3] = [1 4/6]예요. [4/6]에서 [5/6]는 뺄 수 없으니 1만큼을 [6/6]으로 바꾸어요.", "2": "분모는 그대로 두고 통분하여 분자끼리 빼요. [10/6]−[5/6]예요." } },
        { q: "[3/4]−[3/7]과 [3/4]−[3/8] 중 차가 더 큰 것은?", o: ["[3/4]−[3/7]", "[3/4]−[3/8]"], a: 1, why: { "0": "[3/7]은 [3/8]보다 커요. 더 큰 수를 빼면 차는 더 작아져요." } }], { ok: "[4/5]+[7/9] = [1 26/45], [1 2/3]−[5/6] = [5/6], [3/4]−[3/8] = [3/8]이 [3/4]−[3/7] = [9/28]보다 커요." }),
        { q: "카드 놀이에서 결과가 큰 사람이 1점을 더 얻으려면 덧셈과 뺄셈 중 무엇을 고르면 좋을까요?", ph: "~을 고르면 좋아요. 왜냐하면 ~", help: ["① 두 수를 더한 결과와 뺀 결과 중 어느 쪽이 더 큰지 생각해요. → ② 그 까닭을 함께 써요.", "‘~을 고르면 좋아요. 왜냐하면 ~하면 결과가 ~지기 때문이에요.’ 꼴로 써요."],
          ans: "덧셈을 고르면 좋아요. 두 수를 더하면 결과가 두 수보다 커지고, 빼면 큰 수보다 작아지기 때문이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 윷판에서 나올 수 있는 계산을 해 보세요.", hints: ["[2 1/3]−[3/4]은 분수 부분끼리 뺄 수 없어요.", "8과 5의 최소공배수는 40이에요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "도착한 칸 [2 1/3], 분수 주사위 −[3/4]", e: "[2 1/3]−[3/4]", a: "1 7/12", den: 12 },
      { q: "도착한 칸 [1 7/8], 분수 주사위 +[2/5]", e: "[1 7/8]+[2/5]", a: "2 11/40", den: 40 }], { ok: "윷판 계산을 정확하게 했어요!" }) }
},
{
  id: "s10", no: 10, title: "우리 반 텃밭 발표회 ― 공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분모가 다른 분수의 덧셈과 뺄셈을 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
  summary: "분모가 다른 분수의 덧셈과 뺄셈은 통분한 후 분모는 그대로 쓰고 분자끼리 계산해요. 공통분모로는 두 분모의 곱이나 최소공배수를 써요. 대분수는 자연수끼리·분수끼리 계산하거나 가분수로 나타내어 계산하고, 분수 부분끼리 뺄 수 없으면 자연수 부분의 1만큼을 분수로 나타내요. 약분하지 않아도, 가분수로 써도 맞아요.",
  steps: [
    { name: "만져 보기 — 그림으로 빼기", inst: "텃밭 발표회 첫 순서예요. 지안이는 씨앗 [5/6]봉지 중 [2/9]봉지를 심었어요. 두 막대의 조각 크기를 같게 만들고 남은 씨앗을 구해 보세요.", hints: ["6과 9의 최소공배수는 18이에요.", "[5/6] = [15/18], [2/9] = [4/18]예요."],
      render: (b, a) => fa5Split(b, a, { A: "5/6", B: "2/9", names: ["처음 [5/6]봉지", "심은 [2/9]봉지"], op: "-", d: 18, ask: [
        ["[5/6]−[2/9] = ", { q: [null, "?15", "18"] }, "−", { q: [null, "?4", "18"] }, " = ", { q: [null, "?11", "18"] }]], ok: "남은 씨앗은 [11/18]봉지예요. 통분한 다음 분자끼리 뺐어요." }) },
    { name: "그려 보기 — 계산하기", inst: "계산해 보세요. 약분하지 않아도, 가분수로 써도 맞아요.", hints: ["대분수는 자연수끼리, 분수끼리 계산하거나 가분수로 나타내어 계산해요.", "[6 3/10]−[2 3/4]은 분수 부분끼리 뺄 수 없어요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[1/3]+[2/7]", a: "13/21", den: 21 }, { e: "[2 5/6]+[1 3/8]", a: "4 5/24", den: 24 }, { e: "[7/12]−[2/9]", a: "13/36", den: 36 }, { e: "[6 3/10]−[2 3/4]", a: "3 11/20", den: 20 }]) },
    { name: "말해 보기 — 비교하고 고치기", inst: "두 계산 결과의 크기를 비교해요. 그리고 태오가 잘못 계산한 곳을 찾아 까닭을 고르고 옳게 계산해 보세요. 태오의 계산: [6 2/9]−[3 5/6] = [6 4/18]−[3 15/18] = [6 22/18]−[3 15/18] = [3 7/18]", hints: ["[3/4]+[2/5] = [1 3/20], [3 1/2]−[2 1/3] = [1 1/6]이에요. 분수 부분을 통분하여 비교해요.", "[6 4/18]에서 1만큼을 [18/18]로 바꾸면 [5 22/18]예요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "크기 비교", p: ["[3/4]+[2/5] ", { c: [">", "=", "<"], a: 2 }, " [3 1/2]−[2 1/3]"] },
        { t: "까닭", p: [{ c: ["1만큼을 분수로 바꾸었는데 자연수 부분 6을 그대로 두었어요", "통분을 잘못했어요"], a: 0 }] },
        { t: "옳게", p: ["[6 4/18]−[3 15/18] = ", { q: ["?5", "?22", "18"] }, "−[3 15/18] = ", { q: ["?2", "?7", "18"] }] }],
        { ok: "[1 3/20] < [1 1/6]이에요. 그리고 [6 2/9]−[3 5/6] = [5 22/18]−[3 15/18] = [2 7/18]이에요." }) },
    { name: "약속하기 — 수 카드로 대분수 만들기", inst: "발표회 퀴즈예요. 서진이는 수 카드 3, 4, 8로 가장 큰 대분수를, 하린이는 수 카드 2, 5, 7로 가장 작은 대분수를 만들어요. 두 대분수의 차를 구해 보세요.", hints: ["가장 큰 대분수는 자연수 부분에 가장 큰 수를, 가장 작은 대분수는 자연수 부분에 가장 작은 수를 놓아요.", "남은 두 카드로 진분수를 만들어요."],
      render: (b, a) => fa5Mixed(b, a, { groups: [{ name: "서진", cards: [3, 4, 8], kind: "max" }, { name: "하린", cards: [2, 5, 7], kind: "min" }], op: "-" }) },
    { name: "되돌아보기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["분모가 다른 분수를 배우기 전의 생각을 떠올려요.", "통분, 두 가지 방법, 1만큼을 분수로 나타내기를 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "배우기 전의 생각", ex: ["예전에는 [1/2]+[1/3]을 분모끼리, 분자끼리 더해 [2/5]라고 생각했어요.", "예전에는 [5 1/4]에서 [1 5/6]를 어떻게 빼는지 몰랐어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 먼저 통분하고 분모는 그대로, 분자끼리 더해야 한다는 것을 알아요.", "지금은 자연수 부분의 1만큼을 [12/12]처럼 바꾸면 뺄 수 있다는 것을 알아요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["물 주기 막대를 더 잘게 나누어 조각 크기를 맞춰 보고 바뀌었어요.", "고구마 막대의 1을 쪼개어 ×표 해 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "★★ 도전 — 교문에서 텃밭까지는 [2/5] km, 텃밭에서 꽃밭까지는 [1/2] km, 교문에서 꽃밭까지 바로 가면 [5/6] km예요.", hints: ["거쳐 가는 거리는 두 거리를 더해요.", "10과 6의 최소공배수는 30이에요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "① 교문에서 텃밭을 거쳐 꽃밭까지 가는 거리는 몇 km일까요?", e: "[2/5]+[1/2]", a: "9/10", unit: "km", den: 10 },
      { q: "② 텃밭을 거쳐 가는 거리는 바로 가는 거리보다 몇 km 더 멀까요?", e: "[9/10]−[5/6]", a: "2/30", unit: "km", den: 30 }], { ok: "거쳐 가면 [9/10] km, 바로 가는 것보다 [2/30] km([1/15] km) 더 멀어요." }) }
}
];
