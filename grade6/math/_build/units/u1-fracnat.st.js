//@@APP
const APP={title:"6학년 3반 나눔 빵 공방", unit:"6-1 수학 1. 분수의 나눗셈", key:"s61-fracnat-v1", welcome:"6학년 3반 나눔 빵 공방에 온 것을 환영해요", intro:"새봄초등학교 6학년 3반 친구들이 요리 시간에 ‘나눔 빵 공방’을 열어요. 막대 반죽·우유·딸기잼·설탕·포장 리본을 똑같이 나누고, 구운 빵을 이웃에게 나누며 나누는 수가 자연수인 분수의 나눗셈을 알아봐요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u1-fracnat.tb.js)의 fn6 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   (입력칸 0.9초 · 고르기 0.26초 · 색칠·끌기·카드 넣기 1.2초) 대분수는 쓰는 중에 확인하지 않아요(fn6In.full).
   입력·채점·빈칸 채우기·분류·잇기는 6-2 이야기 버전(u1-fracdiv.st.js)에서 저절로 확인하도록 고친 판을 가져왔어요. 이 파일에서 새로 만든 그림은 앞글자 fn6s. */
/* ===== 6-1 1. 분수의 나눗셈(나누는 수가 자연수) 단원 조작 부품 (앞글자 fn6) =====
   6-2 「분수의 나눗셈」(fd6)·5-2 「분수의 곱셈」(fx2) 부품의 분수 표기·입력·채점을 바탕으로 했어요.
   글 속 분수 표기: [3/7] 진분수·가분수, [2 1/4] 대분수, [4÷2/9](분자에 식)도 됨.
   채점은 값으로 해요: 약분하지 않은 분수, 가분수, 대분수 모두 정답이에요(지도서 유의 사항 ⑥). */
/*fn6-core*/
const FN6_WORDS = ["분자를 자연수로 나누기", "크기가 같은 분수", "×[1/▲]", "가분수로 바꾸기", "약분", "대분수"];
const FN6_SRC = "\\[(?:(\\d+|□) )?([0-9□■●▲♥]+(?:[+−×÷-][0-9□]+)*)\\/([0-9□■●▲♥]+(?:[×÷][0-9□]+)*)\\]";
const fn6Re = () => new RegExp(FN6_SRC, "g");
/* 칸에 쓴 글(자연수·분자·분모) → 수 */
function fn6Raw(ws, ns, ds) {
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
function fn6Str(s) {
  s = String(s).trim().replace(/^\[|\]$/g, "").trim();
  let m = s.match(/^(\d+)$/); if (m) return fn6Raw(m[1], "", "");
  m = s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/); if (m) return fn6Raw(m[1] || "", m[2], m[3]);
  return null;
}
const fn6Eq = (a, b) => a.num * b.den === b.num * a.den;
const fn6G = (a, b) => b ? fn6G(b, a % b) : Math.abs(a);
function fn6R(num, den) { const g = fn6G(num, den) || 1; return { num: num / g, den: den / g }; }
/* 분모가 den인 교과서 꼴: 대분수(자연수) */
function fn6Form(num, den) { const w = Math.floor(num / den), r = num % den; return r === 0 ? String(w) : w === 0 ? `${r}/${den}` : `${w} ${r}/${den}`; }
const fn6Tk = s => /\//.test(String(s)) ? `[${s}]` : String(s);
/* 교과서 답 표기: 대분수(=가분수) */
function fn6Book(num, den) {
  const m = fn6Form(num, den), imp = `[${num}/${den}]`;
  if (num % den === 0) return num > 0 && den > 1 ? `${m} (=${imp})` : m;
  return num > den ? `${fn6Tk(m)} (=${imp})` : fn6Tk(m);
}
/* 끝 글자(분수는 분자) 받침에 맞는 '이에요/예요' */
const fn6Ie = num => "013678".includes(String(num).slice(-1)) ? "이에요" : "예요";
/* 식 계산: "[1 1/5]×3", "[3/5]×[1/2]×[3/4]", "(3×1)+(3×[1/4])", "[2/3]+[2/3]" — 괄호, × ÷ 를 + − 보다 먼저 */
function fn6Eval(e) {
  const src = String(e).replace(/−/g, "-").replace(/\s+/g, " ").trim(); let i = 0;
  const sp = () => { while (src[i] === " ") i++; };
  const mul = (x, y) => fn6R(x.num * y.num, x.den * y.den), add = (x, y, sg) => fn6R(x.num * y.den + sg * y.num * x.den, x.den * y.den);
  function atom() {
    sp();
    if (src[i] === "(") { i++; const v = expr(); sp(); if (src[i] !== ")") throw 0; i++; return v; }
    if (src[i] === "[") { const j = src.indexOf("]", i); if (j < 0) throw 0; const v = fn6Str(src.slice(i, j + 1)); if (!v || v.err) throw 0; i = j + 1; return fn6R(v.num, v.den); }
    const m = src.slice(i).match(/^\d+/); if (!m) throw 0; i += m[0].length; return fn6R(+m[0], 1);
  }
  function term() { let v = atom(); for (;;) { sp(); const c = src[i]; if (c === "×" || c === "*") { i++; v = mul(v, atom()); } else if (c === "÷") { i++; const w = atom(); if (!w.num) throw 0; v = mul(v, fn6R(w.den, w.num)); } else return v; } }
  function expr() { let v = term(); for (;;) { sp(); const c = src[i]; if (c === "+" || c === "-") { i++; v = add(v, term(), c === "+" ? 1 : -1); } else return v; } }
  try { const v = expr(); sp(); return i === src.length ? v : null; } catch (err) { return null; }
}
function fn6Den(s) { const m = String(s || "").match(/\/(\d+)\]?/); return m ? +m[1] : 0; }
/* 받침에 맞는 조사(분수는 분자를 마지막에 읽으므로 분자의 끝 숫자 기준): fn6J("[3/7]", "은는") → "[3/7]은" */
function fn6J(s, pair) {
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
function fn6Judge(r, a) {
  if (r.err === "empty") return { code: "empty", msg: "빈칸에 답을 써요." };
  if (r.err === "half") return { code: "half", msg: "분수는 분자와 분모를 모두 써요." };
  if (r.err) return { code: "bad", msg: "칸에는 수만 써요." };
  const t = fn6Str(a);
  if (!fn6Eq(r, t)) return { code: "wrong" };
  if (r.hasF && r.hasW && r.n >= r.d) return { code: "improper", msg: `값은 맞아요. 그런데 분수 부분 ${fn6J(`[${r.n}/${r.d}]`, "은는")} 1이거나 1보다 커요. 1만큼을 자연수 부분으로 옮겨 대분수로 쓰거나, 가분수로 써요.` };
  if (r.hasF && r.n === 0) return { code: "zero", msg: "분자가 0이면 자연수만 써요." };
  return { code: "ok" };
}
function fn6Key(r) { return r.err ? "" : r.hasF ? (r.hasW ? `${r.w} ${r.n}/${r.d}` : `${r.n}/${r.d}`) : String(r.w); }
/* 유리수 셈 */
const fn6Q = (num, den) => fn6R(num, den);
const fn6Add = (x, y, s = 1) => fn6R(x.num * y.den + s * y.num * x.den, x.den * y.den);
const fn6Lcm = (a, b) => a / fn6G(a, b) * b;
/* 흔한 실수 찾기 (두 수의 나눗셈) — 지도서 오개념(김경미·강완) */
function fn6Diag(e, r) {
  if (!e || !r || r.err) return null;
  const m = String(e).match(/^\s*(\[[^\]]+\]|\d+)\s*÷\s*(\d+)\s*$/); if (!m) return null;
  const A = fn6Str(m[1]), k = +m[2]; if (!A || A.err || !A.num || !k) return null;
  const T = fn6Q(A.num, A.den * k), eq = v => fn6Eq(r, v) && !fn6Eq(T, v);
  if (!A.hasF) return eq(fn6Q(k, A.num)) ? "나누는 수와 나누어지는 수의 자리를 바꾸었어요. ●÷▲의 몫은 나누어지는 수 ●를 분자, 나누는 수 ▲를 분모로 하는 분수예요." : null;
  if (eq(fn6Q(A.num * k, A.den))) return "몫이 나누어지는 수보다 커졌어요. 분모를 자연수로 나누었거나 ÷를 ×로 바꾼 것 같아요. 분자를 자연수로 나누거나 ×[1/▲]로 바꾸어 계산해요.";
  if (A.hasW && A.w > 0 && eq(fn6Q(A.w * A.d + A.n * k, A.d * k))) return "자연수 부분만 나누고 진분수 부분은 나누지 않았어요. 진분수 부분도 똑같이 나누어야 해요.";
  if (A.hasW && A.w > 0 && eq(fn6Q(A.w * A.d * k + A.n, A.d * k))) return "진분수 부분만 나누고 자연수 부분은 나누지 않았어요. 자연수 부분도 똑같이 나누어야 해요.";
  return null;
}
/* 읽기 글: [3/7] → 7분의 3, [2 1/4] → 2와 4분의 1 */
function fn6Plain(s) {
  return String(s == null ? "" : s).replace(fn6Re(), (m, w, n, d) => `${w ? w + "와 " : ""}${d}분의 ${n}`);
}
/*fn6-core-end*/

function fn6Style() {
  if (document.getElementById("fn6-style")) return;
  const s = document.createElement("style"); s.id = "fn6-style";
  s.textContent = `
.fn6fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.fn6fw{margin-right:.1em}
.fn6q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.fn6q>.fn6n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.fn6q>.fn6d{padding:.05em .14em 0}
.fn6frin .fn6q{font-size:.92em}
.fn6frin .fn6n{padding-bottom:.14em}.fn6frin .fn6d{padding-top:.14em}
.fn6inp{display:inline-flex;align-items:center;gap:.15em;vertical-align:middle}
.fn6qi{display:inline-flex;flex-direction:column;align-items:stretch;gap:.12em}
.fn6bar{display:block;height:.17em;background:var(--ink);border-radius:.1em}
input.fn6i,input.fn6box{box-sizing:border-box;width:2.3em;height:1.65em;padding:0;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.fn6iw{height:2.1em;width:2.1em}
input.fn6box.fn6wide{width:3.6em}
.fn6eq{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .45em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin-top:.25em}
.fn6lab{color:var(--pine)}
.fn6res{color:var(--ok);font-size:.85em}
.fn6cl{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .3em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin:.4em 0;line-height:1.9}
.fn6tag{background:var(--pine-soft);color:var(--pine);border-radius:.5em;padding:0 .55em;font-size:.82em}
.fn6chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.fn6chs .opt{padding:.05em .55em}
.fn6stage{margin:.2em 0 .4em}
.fn6stage svg{width:100%;height:auto;max-height:66vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.fn6tip{font-family:Jua,sans-serif;color:var(--night);margin:.3em 0}
.fn6tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.4em 0}
.fn6tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em}
.fn6tools button.fn6on{background:var(--night);color:#fff;border-color:var(--night)}
.fn6est{background:var(--ring-soft);border-radius:.6em;padding:.4em .7em;margin-bottom:.4em}
.fn6ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.fn6grp{border:2px solid var(--line);border-radius:.8em;padding:.4em .7em;margin:.45em 0}
.fn6grp .fn6gt{font-family:Jua,sans-serif;color:var(--night)}
.fn6grp .fn6gi{display:inline-flex;flex-wrap:wrap;align-items:center;gap:.3em;margin:.25em 1.2em .25em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08)}
.fn6pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:2.6em;margin:.3em 0 .6em}
.fn6bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,11em),1fr));gap:.6em}
.fn6bin{border:2px dashed var(--line);border-radius:.8em;padding:.4em;min-height:5em;display:flex;flex-direction:column;gap:.35em}
.fn6binh{font-family:Jua,sans-serif;background:var(--pine-soft);color:var(--pine);border:0;border-radius:.6em;padding:.3em .6em}
.fn6binl{display:flex;flex-wrap:wrap;gap:.35em}
.opt.fn6on{border-color:var(--ring);background:var(--ring-soft)}
.fn6crd{font-family:Jua,sans-serif}
.fn6mt{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.6em 1.4em;align-items:start}
.fn6mc{display:flex;flex-direction:column;gap:.5em}
.fn6mc .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);text-align:center}
.fn6badge{display:inline-grid;place-items:center;min-width:1.5em;height:1.5em;border-radius:50%;color:#fff;font-size:.8em;margin-left:.3em}
.fn6cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.fn6cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2em;text-align:center}
.fn6slot{min-width:1.7em;min-height:1.5em;font-family:Jua,sans-serif;border:2px dashed var(--ring);border-radius:.4em;background:#fff;padding:0 .2em}
.fn6lad{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.fn6lad>*{display:flex;flex-direction:column;align-items:center;gap:.25em;padding:0 .15em;text-align:center}
.fn6lad .opt{font-family:Jua,sans-serif;width:100%;text-align:center;padding:.35em .2em}
.fn6house{font-family:Jua,sans-serif;color:var(--pine);font-size:.9em}
.fn6lsvg svg{width:100%;height:auto;display:block}
.fn6score{width:100%;border-collapse:collapse;font-size:var(--fs-s);margin-top:.4em}
.fn6score td,.fn6score th{border:1px solid var(--line);padding:.2em .35em;text-align:center}
.fn6score th{background:var(--pine-soft);font-weight:400;font-family:Jua,sans-serif}
.fn6card2{border:3px solid var(--night);border-radius:var(--r);padding:.5em .8em;background:#fff;display:flex;flex-wrap:wrap;gap:.4em 1.6em;margin:.3em 0}
.fn6card2>div{min-width:12em}
.fn6card2 b{color:var(--pine);font-family:Jua,sans-serif;font-weight:400}
`;
  document.head.append(s);
}
/* 분수 모양 요소 */
function fn6FracEl(w, n, d) {
  return h("span", { class: "fn6fr" }, w != null && w !== "" ? h("span", { class: "fn6fw" }, String(w)) : null,
    h("span", { class: "fn6q" }, h("span", { class: "fn6n" }, String(n)), h("span", { class: "fn6d" }, String(d))));
}
function fn6RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = fn6Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(fn6FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function fn6RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return fn6RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(fn6RenderText);
}
(function fn6Boot() {
  fn6Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") fn6RenderText(m.target); else m.addedNodes.forEach(fn6RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(fn6Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
/* 엔진 부품의 '답 따라 쓰기' 글은 읽는 말(7분의 3)로 바꿔 줌 */
function fn6A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(fn6Plain) }) }); }
/* 이야기 버전: 보기 순서를 섞어 정답 자리를 짐작하지 못하게 해요(같은 문제는 언제나 같은 순서, 채점은 섞은 순서에 맞춰 바꿈).
   순서에 뜻이 있는 보기(>, <, = · 2점·1점·0점 · ㉠㉡㉢)는 그대로 둬요. */
function fn6Perm(o, seed) {
  const n = o.length, idx = [...Array(n).keys()], S = o.map(x => String(x).trim());
  if (n < 2 || S.every(x => /^[<>=]$/.test(x)) || S.every(x => /점$/.test(x)) || S.some(x => /^[㉠-㉣]/.test(x))) return idx;
  let g = 2166136261; for (const ch of String(seed) + "|" + S.join("|")) { g ^= ch.charCodeAt(0); g = Math.imul(g, 16777619) >>> 0; }
  const rnd = () => { g ^= g << 13; g >>>= 0; g ^= g >>> 17; g ^= g << 5; g >>>= 0; return g / 4294967296; };
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx; /* idx[새 자리] = 원래 번호 */
}
function fn6Mix(o, a, why, seed) {
  const P = fn6Perm(o, seed), inv = []; P.forEach((old, nw) => { inv[old] = nw; });
  const na = Array.isArray(a) ? a.map(x => inv[x]).sort((x, y) => x - y) : inv[a];
  let nw = why;
  if (why) { nw = {}; Object.keys(why).forEach(k => { nw[k.split(",").map(x => inv[+x]).sort((x, y) => x - y).join(",")] = why[k]; }); }
  return { o: P.map(i => o[i]), a: na, why: nw };
}
const fn6MixQ = it => it && it.o && it.a != null ? Object.assign({}, it, fn6Mix(it.o, it.a, it.why, it.q || "")) : it;
const fn6MixB = pt => pt && typeof pt === "object" && pt.o && pt.a != null ? Object.assign({}, pt, { o: fn6Mix(pt.o, pt.a, null, "b").o, a: fn6Mix(pt.o, pt.a, null, "b").a }) : pt;
const fn6Quiz0 = quiz, fn6Blanks0 = blanks;
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done(을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return fn6Quiz0(body, fn6A(api), items.map(fn6MixQ), o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return fn6Blanks0(body, fn6A(api), parts.map(fn6MixB), o); };

function fn6Gate(api, ready, msg) {
  return Object.assign({}, api, { done: (ans, m, lv) => ready() ? api.done(ans, m, lv) : api.fail(typeof msg === "function" ? msg() : msg, ans) });
}
const FN6_F = ["#F6C08A", "#9CC6EC", "#A9D8A2", "#D7B5E6"], FN6_S = ["#D9822B", "#2B7BD6", "#2E8B57", "#8E5BC9"];
/* SVG 글: [분수] 표기를 쌓은 분수로 그림 */
function fn6Cw(ch, s) { return /[가-힣]/.test(ch) ? s * .95 : /[0-9]/.test(ch) ? s * .56 : ch === " " ? s * .3 : /[A-Za-z]/.test(ch) ? s * .55 : s * .6; }
function fn6Segs(str) {
  const out = []; let last = 0; const re = fn6Re(); let m;
  while ((m = re.exec(str))) { if (m.index > last) out.push({ t: str.slice(last, m.index) }); out.push({ w: m[1], n: m[2], d: m[3] }); last = m.index + m[0].length; }
  if (last < str.length) out.push({ t: str.slice(last) });
  return out;
}
function fn6SvgLine(str, x, y, size = 24, opt = {}) {
  const g = svgEl("g", { "pointer-events": "none" }), fs = size * .8, fill = opt.fill || INK;
  const tw = t => [...t].reduce((a, c) => a + fn6Cw(c, size), 0);
  const fw = s => Math.max(String(s.n).length, String(s.d).length) * fs * .6 + 8;
  const segs = fn6Segs(String(str));
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
function fn6In(label) {
  const mk = (cls, al) => {
    const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "fn6i " + cls, "aria-label": (label ? fn6Plain(label) + " " : "") + al });
    i.addEventListener("input", () => { const v = i.value.replace(/[^0-9]/g, "").slice(0, 4); if (v !== i.value) i.value = v; });
    return i;
  };
  const w = mk("fn6iw", "자연수 부분"), n = mk("fn6in", "분자"), d = mk("fn6id", "분모");
  const el = h("span", { class: "fn6inp" }, w, h("span", { class: "fn6qi" }, n, h("span", { class: "fn6bar" }, "​"), d));
  el.get = () => fn6Raw(w.value, n.value, d.value);
  el.paint = ok => [w, n, d].forEach(x => { x.style.borderColor = ok == null ? "" : ok ? "var(--ok)" : "var(--no)"; });
  el.text = () => { const r = el.get(); return r.err ? "-" : fn6Key(r); };
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
function fn6Hook(el, auto) {
  el.addEventListener("input", auto); el.addEventListener("change", auto);
  el.addEventListener("focusout", () => setTimeout(auto, 0));
  el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); if (e.target.blur) e.target.blur(); } });
}
function fn6Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 4, class: "fn6box", "aria-label": "빈칸" });
  i.exp = String(exp);
  if (i.exp.length >= 3) i.classList.add("fn6wide");
  i.full = () => i.value.trim() !== ""; i.sig = () => i.value.trim();
  return i;
}
/* 어림 상자 */
function fn6EstBox(api, e, onOk) {
  const row = h("div", { class: "opts" });
  e.o.forEach((c, i) => row.append(h("button", { class: "opt", onclick: ev => {
    [...row.children].forEach(x => x.classList.remove("good", "bad", "on"));
    if (i === e.a) { ev.currentTarget.classList.add("good"); onOk(); api.hint(e.ok || "좋아요. 이제 정확하게 구해 봐요."); }
    else { ev.currentTarget.classList.add("bad"); api.fail((e.why && e.why[i]) || "자연수 부분만 보고 어림해 봐요.", "[어림] " + c); }
  } }, c)));
  return h("div", { class: "fn6est" }, h("div", { class: "jua" }, "먼저 어림해요 · " + e.q), row);
}

/* ① 식과 답 (분수 답은 같은 분모의 가분수·대분수·자연수 모두 정답, 약분한 답은 '값은 같아요' 안내)
   items: {q?, e:"[3/8]+[4/8]" (보이는 식) | x (확인용 식), a:"7/8", unit, den, why:{"학생 답":"까닭"}, lab, g:"묶음 제목"}
          | {q, e|x, n: 수} | {q, pick:[…], a: 번호, why:{번호:"까닭"}}  */
function fn6Calc(body, api, items, opt = {}) {
  fn6Style();
  items = items.map(it => it.pick ? Object.assign({}, it, (m => ({ pick: m.o, a: m.a, why: m.why }))(fn6Mix(it.pick, it.a, it.why, it.q || ""))) : it);
  const rows = []; const wrap = h("div");
  let grp = null, gName = null;
  items.forEach((it, k) => {
    const R = { it }; const ex = it.e || it.x;
    let host;
    if (it.g) {
      if (it.g !== gName) { gName = it.g; grp = h("div", { class: "fn6grp" }, h("div", { class: "fn6gt" }, it.g)); wrap.append(grp); }
      host = h("span", { class: "fn6gi" }); grp.append(host);
    } else {
      gName = null; const box = h("div", { class: "qitem" });
      if (it.q) box.append(h("div", { class: "jua" }, (items.filter(x => !x.g).length > 1 ? (k + 1) + ". " : "") + it.q));
      host = h("div", { class: "fn6eq" }); box.append(host); wrap.append(box);
    }
    if (it.pick) {
      R.kind = "pick"; R.sel = null;
      const row = h("span", { class: "opts" });
      it.pick.forEach((o, oi) => row.append(h("button", { class: "opt", onclick: ev => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); R.sel = oi; } }, o)));
      R.row = row; if (it.e) host.append(h("span", {}, it.e)); host.append(row);
    } else if (it.n != null) {
      R.kind = "n";
      if (ex && !it.noEval) { const v = fn6Eval(ex); if (!v || v.num !== it.n * v.den) throw new Error(`답 확인 필요: ${ex} = ${it.n}`); }
      R.inp = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "fn6box fn6wide", "aria-label": fn6Plain(it.lab || it.e || it.q || "답") });
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "fn6lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    } else {
      R.kind = "f";
      R.t = fn6Str(it.a); if (!R.t || R.t.err) throw new Error("답 형식 오류: " + it.a);
      R.den = it.den || fn6Den(it.a) || 1;
      if (ex && !it.noEval) { const v = fn6Eval(ex); if (!v || !fn6Eq(v, R.t)) throw new Error(`답 확인 필요: ${ex} = ${it.a}`); }
      R.inp = fn6In(it.lab || it.e || "답"); R.inp.tv = R.t;
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "fn6lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    }
    R.res = h("span", { class: "fn6res hidden" }, "​"); host.append(R.res);
    rows.push(R);
  });
  const ansText = R => {
    const head = fn6Plain(R.it.e || R.it.lab || "답");
    if (R.kind === "pick") return `${fn6Plain(R.it.q || R.it.e || "")} ${fn6Plain(R.it.pick[R.it.a])}`.trim();
    if (R.kind === "n") return `${head} ${R.it.n}${R.it.unit ? " " + R.it.unit : ""}`;
    return `${head} ${fn6Plain(fn6Tk(R.it.a))}${R.it.unit ? " " + R.it.unit : ""}`;
  };
  api.provide({ words: opt.words || FN6_WORDS, answers: rows.map(ansText) });
  const judge = () => {
    let bad = null, hint = null; const given = [];
    rows.forEach(R => {
      const it = R.it;
      if (R.kind === "pick") {
        const g = R.sel === it.a; [...R.row.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === R.sel) b.classList.add(g ? "good" : "bad"); });
        given.push(R.sel == null ? "-" : fn6Plain(it.pick[R.sel]));
        if (!g && !bad) bad = R.sel == null ? "고르지 않은 문제가 있어요." : (it.why && it.why[R.sel]) || "고른 것을 다시 살펴봐요.";
        return;
      }
      if (R.kind === "n") {
        const s = R.inp.value.replace(/[\s,]/g, ""), g = /^\d+$/.test(s) && +s === it.n;
        R.inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; given.push(s || "-");
        if (!g && !bad) bad = s === "" ? "빈칸에 답을 써요." : (it.why && it.why[s]) || opt.bad || "다시 생각해 봐요.";
        return;
      }
      const r = R.inp.get(), J = fn6Judge(r, it.a); given.push(R.inp.text());
      if (J.code === "ok") { R.inp.paint(true); return; }
      if (J.code === "zero" || J.code === "improper") { R.inp.paint(null); if (!hint) hint = J.msg; return; }
      R.inp.paint(false);
      if (!bad) bad = (it.why && it.why[fn6Key(r)]) || J.msg || fn6Diag(it.e || it.x, r) || opt.bad || "다시 계산해 봐요. 분자가 자연수의 배수이면 분자를 자연수로 나누고, 아니면 크기가 같은 분수로 바꾸거나 ×[1/▲]로 계산해요.";
    });
    if (bad) { api.fail(bad, given.join(" / ")); return false; }
    if (hint) { api.tryOnce(); api.hint(hint); return false; }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + fn6Book(num, den); R.res.classList.remove("hidden"); } });
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
  rows.forEach(R => { if (R.inp) fn6Hook(R.inp, auto); });
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return auto;
}
/* ② 차례대로 빈칸 채우기 (계산 과정)
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 수 칸 | {q:[자연수, 분자, 분모]} 각 자리는 고정값·"?답"(칸)·배열(분자에 ["?3","+","?2"]) | {f:"4 2/5"} 분수 입력(값 판정) | {c:[…], a}
   '='가 있고 한글이 없는 줄은 '='로 나눈 값이 모두 같은지 스스로 확인해요. */
function fn6Chain(body, api, rows, opt = {}) {
  fn6Style();
  const mixC = pt => pt && typeof pt === "object" && pt.c ? (m => Object.assign({}, pt, { c: m.o, a: m.a }))(fn6Mix(pt.c, pt.a, null, "c")) : pt;
  rows = rows.map(r => Array.isArray(r) ? r.map(mixC) : Object.assign({}, r, { p: r.p.map(mixC) }));
  const ins = [], chs = [], plains = [], pairs = [];
  const wrap = h("div");
  const ex = v => v == null ? "" : Array.isArray(v) ? v.map(ex).join("") : String(v)[0] === "?" ? String(v).slice(1) : String(v);
  const jsNum = v => ex(v).replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
  const jsStr = s => String(s).replace(fn6Re(), (m, w, n, d) => `(${w && w !== "□" ? w : 0}+(${n.replace(/−/g, "-")})/(${d}))`).replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
  const cell = v => {
    if (v == null) return null;
    if (Array.isArray(v)) return h("span", { style: "display:inline-flex;align-items:center;gap:.1em" }, v.map(cell));
    if (String(v)[0] === "?") { const b = fn6Box(String(v).slice(1)); ins.push(b); return b; }
    return h("span", {}, String(v));
  };
  rows.forEach(row => {
    const parts = Array.isArray(row) ? row : row.p;
    const line = h("div", { class: "fn6cl" });
    if (row.t) line.append(h("span", { class: "fn6tag" }, row.t));
    let plain = row.t ? row.t + " " : "", js = "", hangul = false;
    parts.forEach(pt => {
      if (typeof pt === "string" || typeof pt === "number") {
        const s = String(pt); line.append(h("span", {}, s)); plain += fn6Plain(s) + " "; js += jsStr(s); if (/[가-힣□]/.test(s)) hangul = true;
      } else if (pt.i != null) {
        const b = fn6Box(pt.i); ins.push(b); line.append(b); plain += pt.i + " "; js += `(${pt.i})`;
      } else if (pt.q) {
        const [W, N, D] = pt.q, n0 = ins.length;
        line.append(h("span", { class: "fn6fr fn6frin" }, W != null ? h("span", { class: "fn6fw" }, cell(W)) : null, h("span", { class: "fn6q" }, h("span", { class: "fn6n" }, cell(N)), h("span", { class: "fn6d" }, cell(D)))));
        /* 분자·분모가 모두 빈칸이면 값이 같은 다른 꼴(약분 덜 함·더 함)을 알아봐요 */
        if (W == null && [N, D].every(v => typeof v === "string" && v[0] === "?")) pairs.push([ins[n0], ins[n0 + 1]]);
        plain += fn6Plain(`[${W != null ? ex(W) + " " : ""}${ex(N)}/${ex(D)}]`) + " ";
        js += `(${W != null ? jsNum(W) : 0}+(${jsNum(N)})/(${jsNum(D)}))`;
      } else if (pt.f) {
        const fi = fn6In("답"); fi.target = pt.f; fi.tv = fn6Str(pt.f); ins.push(fi); line.append(fi);
        plain += fn6Plain(fn6Tk(pt.f)) + " "; const v = fn6Str(pt.f); js += `(${v.num}/${v.den})`;
      } else if (pt.c) {
        const C = { a: pt.a, sel: null }; const sp = h("span", { class: "fn6chs" });
        pt.c.forEach((o, oi) => sp.append(h("button", { class: "opt", onclick: ev => { [...sp.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); C.sel = oi; } }, o)));
        C.el = sp; chs.push(C); line.append(sp); plain += fn6Plain(pt.c[pt.a]) + " "; hangul = true;
      }
    });
    wrap.append(line); plains.push(plain.replace(/\s+/g, " ").trim());
    if (!hangul && js.includes("=")) {
      const vals = js.split("=").filter(s => s.trim()).map(s => { try { return Function(`return (${s})`)(); } catch (e) { return NaN; } });
      if (vals.some(v => !isFinite(v) || Math.abs(v - vals[0]) > 1e-9)) throw new Error("식 확인 필요: " + plain);
    }
  });
  api.provide({ words: opt.words || FN6_WORDS, answers: plains });
  const judge = () => {
    let ok = true, hint = null; const given = [];
    const same = new Set();
    pairs.forEach(([nb, db]) => { const a = nb.value.trim(), b = db.value.trim();
      if (/^\d+$/.test(a) && /^[1-9]\d*$/.test(b) && !(a === nb.exp && b === db.exp) && +a * +db.exp === +b * +nb.exp) { same.add(nb); same.add(db);
        hint = hint || (fn6G(+nb.exp, +db.exp) === 1 ? "값은 맞아요. 그런데 더 약분할 수 있어요. 분모와 분자를 최대공약수로 나누어 기약분수로 나타내요." : "값은 맞아요. 그런데 이 칸에는 약분하기 전의 분수를 써요."); } });
    ins.forEach(x => {
      if (same.has(x)) { x.style.borderColor = ""; given.push(x.value.trim()); return; }
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = fn6Judge(x.get(), x.target); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "zero" || J.code === "improper") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
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
  ins.forEach(x => fn6Hook(x, auto));
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return auto;
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 */
function fn6Ask(host, api, ready, msg, opt) {
  const g = fn6Gate(api, ready, msg), pre = () => ready() ? null : (typeof msg === "function" ? msg() : msg);
  if (opt.ask) return fn6Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad, pre });
  if (opt.askCalc) return fn6Calc(host, g, opt.askCalc, { ok: opt.ok, pre });
  api.provide({ words: [], answers: [] });
  /* 물을 것이 없으면 조작을 마치는 대로 저절로 통과 */
  return autoRun(ready, () => "ok", () => { api.tryOnce(); api.done("조작 완료", opt.ok); return true; }, 1200);
}

/* ③ 막대 색칠하기: bars [{name, k, col}]  opt: d, ask(줄)·askCalc, ok */
function fn6Bars(body, api, opt) {
  fn6Style();
  /* 다 하면 fn6Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let auto = () => {};
  const d = opt.d, bars = opt.bars, W = 900, LX = 210, BW = 660, BH = 62, GP = 42, H = bars.length * (BH + GP) + 14;
  const st = bars.map(() => Array(d).fill(false));
  const svg = makeSvg(W, H);
  const cnt = i => st[i].filter(Boolean).length;
  const draw = () => {
    svg.innerHTML = "";
    bars.forEach((b, i) => {
      const y = 22 + i * (BH + GP), col = b.col != null ? b.col : i, ok = cnt(i) === b.k;
      svg.append(fn6SvgLine(b.name, LX - 18, y + BH / 2 - 9, 25, { anchor: "end" }));
      svg.append(fn6SvgLine(`색칠 ${cnt(i)}칸`, LX - 18, y + BH / 2 + 22, 17, { anchor: "end", fill: ok ? "#2E8B57" : "#5B6B6B" }));
      for (let c = 0; c < d; c++) {
        const r = svgEl("rect", { x: LX + c * BW / d, y, width: BW / d, height: BH, fill: st[i][c] ? FN6_F[col % 4] : "#fff", stroke: INK, "stroke-width": 2, style: "cursor:pointer" });
        r.addEventListener("click", () => { st[i][c] = !st[i][c]; draw(); });
        svg.append(r);
      }
      svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
    });
    auto();
  };
  draw();
  const ready = () => bars.every((b, i) => cnt(i) === b.k);
  const ask = h("div", { class: "fn6ask" });
  body.append(h("p", { class: "fn6tip" }, opt.tip || "칸을 누르면 색칠되고, 한 번 더 누르면 지워져요."), h("div", { class: "fn6stage" }, svg), ask);
  auto = fn6Ask(ask, api, ready, () => { const i = bars.findIndex((b, k) => cnt(k) !== b.k); return `먼저 ‘${fn6Plain(bars[i].name)}’ 막대를 알맞게 색칠해요. 지금 ${cnt(i)}칸이에요.`; }, opt);
}
/* ⑦ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function fn6Sort(body, api, opt) {
  fn6Style();
  opt = Object.assign({}, opt, { cards: fn6Perm(opt.cards.map(c => c.t), "sort").map(i => opt.cards[i]) }); /* 카드도 섞어서 놓아요 */
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "fn6pool" }), binsEl = h("div", { class: "fn6bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "fn6binl" }); binsEl.append(h("div", { class: "fn6bin", onclick: e => { if (e.target.closest(".fn6crd")) return; put(bi); } }, h("button", { class: "fn6binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt fn6crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  let auto = () => {};
  function draw() { els.forEach((el, ci) => { el.classList.toggle("fn6on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); auto(); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => fn6Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "fn6tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "카드를 모두 넣으면 저절로 확인해요."));
  auto = autoRun(() => where.every(w => w >= 0), () => where.join(","), () => {
    let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
    const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
    if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok); return true;
  }, 1200);
}

/* ⑧ 관계있는 것끼리 잇기: left [{t,k}], right [{t,k|null}] (값을 계산해 짝이 맞는지 스스로 확인) */
function fn6Match(body, api, opt) {
  fn6Style();
  const L = opt.left, R = opt.right, pair = L.map(() => -1); let sel = null, auto = () => {};
  L.forEach(l => { const v = fn6Eval(l.t); R.forEach(r => { const w = fn6Eval(r.t); if (!v || !w || fn6Eq(v, w) !== (r.k === l.k)) throw new Error("잇기 확인 필요: " + l.t + " / " + r.t); }); });
  const COL = ["#2B7BD6", "#D9822B", "#2E8B57"];
  const lb = L.map((l, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; draw(); } }, l.t));
  const rb = R.map((r, j) => h("button", { class: "opt", onclick: () => { if (sel == null) return api.hint("먼저 왼쪽 식을 눌러요."); pair[sel] = pair[sel] === j ? -1 : j; sel = null; draw(); } }, r.t));
  const badge = (i) => h("span", { class: "fn6badge", style: `background:${COL[i % 3]}` }, String(i + 1));
  function draw() {
    lb.forEach((b, i) => { b.classList.toggle("fn6on", sel === i); b.classList.remove("good", "bad"); [...b.querySelectorAll(".fn6badge")].forEach(x => x.remove()); b.append(badge(i)); });
    rb.forEach((b, j) => { b.classList.remove("good", "bad"); [...b.querySelectorAll(".fn6badge")].forEach(x => x.remove()); pair.forEach((p, i) => { if (p === j) b.append(badge(i)); }); });
    auto();
  }
  draw();
  api.provide({ words: [], answers: L.map(l => `${fn6Plain(l.t)} — ${fn6Plain(R.find(r => r.k === l.k).t)}`) });
  body.append(h("p", { class: "fn6tip" }, "왼쪽 식을 누르고, 값이 같은 오른쪽 식을 눌러 이어요. 짝이 없는 식도 있어요. 모두 이으면 저절로 확인해요."),
    h("div", { class: "fn6mt" }, h("div", { class: "fn6mc" }, lb), h("div", { class: "fn6mc" }, rb)));
  auto = autoRun(() => pair.every(p => p >= 0), () => pair.join(","), () => {
    let ok = true; pair.forEach((p, i) => { const g = R[p].k === L[i].k; lb[i].classList.add(g ? "good" : "bad"); if (!g) ok = false; });
    const given = pair.map((p, i) => `${i + 1}-${p + 1}`).join(", ");
    if (!ok) { api.fail("값을 계산해 보고 다시 이어요. 가분수와 대분수 중 편리한 꼴로 바꾸어 비교해요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok || "값이 같은 식끼리 잘 이었어요!"); return true;
  }, 1200);
}
/* ===== 곱셈 단원 조작 부품 ===== */
function fn6Style2() {
  if (document.getElementById("fn6-style2")) return;
  const s = document.createElement("style"); s.id = "fn6-style2";
  s.textContent = `
.fn6ctl{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.35em 0}
.fn6ctl button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em}
.fn6ctl button.fn6act{background:var(--night);color:#fff;border-color:var(--night)}
.fn6ctl .fn6num{font-family:Jua,sans-serif;min-width:2.2em;text-align:center;font-size:calc(var(--fs)*1.15)}
.fn6rd{font-family:Jua,sans-serif;color:var(--night);margin:.25em 0;min-height:1.4em}
.fn6rd.fn6good{color:var(--ok)}
.fn6cond{border:2px solid var(--line);border-radius:.8em;padding:.4em .7em;margin:.4em 0;font-family:Jua,sans-serif}
.fn6cond div{margin:.15em 0}
.fn6board{display:flex;flex-wrap:wrap;gap:.6em 1.2em;align-items:center;margin:.4em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.25)}
.fn6slot2{min-width:1.8em;min-height:1.55em;font-family:Jua,sans-serif;border:2px dashed var(--ring);border-radius:.4em;background:#fff;padding:0 .2em;font-size:inherit}
.fn6slot2.fn6full{border-style:solid;border-color:var(--night)}
.fn6deck{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.fn6deck .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2.2em;text-align:center}
.fn6deck .opt.fn6used{opacity:.4}
.fn6ccard{display:inline-block;border:3px solid var(--night);border-radius:.7em;padding:.25em .9em;background:#FFF8EE;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.15)}
.fn6score{font-family:Jua,sans-serif;background:var(--pine-soft);color:var(--pine);border-radius:.6em;padding:.2em .7em;display:inline-block}
.fn6log{font-size:var(--fs-s);margin:.3em 0;padding-left:1.2em}
`;
  document.head.append(s);
}
const fn6Num = v => typeof v === "string" ? fn6Str(v) : v;
function fn6Stepper(label, get, set, min, max, onChange) {
  const num = h("span", { class: "fn6num" }, "​");
  const paint = () => { num.textContent = String(get()); };
  const b = (t, dv) => h("button", { onclick: () => { const v = get() + dv; if (v < min || v > max) return; set(v); paint(); onChange(); } }, t);
  const el = h("div", { class: "fn6ctl" }, h("span", { class: "jua" }, label), b("－", -1), num, b("＋", 1));
  el.paint = paint; paint();
  return el;
}
function fn6Style3() {
  if (document.getElementById("fn6-style3")) return;
  const s = document.createElement("style"); s.id = "fn6-style3";
  s.textContent = `
.fn6flip{display:flex;flex-wrap:wrap;align-items:center;gap:.35em .5em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.2);margin:.45em 0}
.fn6flip button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.15em .55em;font-family:Jua,sans-serif;font-size:inherit;color:var(--ink);min-width:2.2em}
.fn6flip button.fn6fl{border-color:var(--ring);background:var(--ring-soft)}
.fn6flip button.fn6op{min-width:2em;font-size:1.1em}
.fn6flip .fn6no{color:var(--muted);font-size:.8em}
.fn6pose{border:2px solid var(--line);border-radius:.8em;padding:.5em .8em;margin:.4em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);line-height:2}
.fn6pose .fn6blank{display:inline-block;min-width:2.6em;border-bottom:2px solid var(--ring);text-align:center;padding:0 .2em}
.fn6sheet{width:100%;border-collapse:collapse;font-size:var(--fs-s);margin:.4em 0}
.fn6sheet td,.fn6sheet th{border:1px solid var(--line);padding:.25em .4em;text-align:center}
.fn6sheet th{background:var(--pine-soft);font-weight:400;font-family:Jua,sans-serif}
.fn6sheet td.fn6me{background:#FFF6E8}
.fn6set{display:inline-block;border:2px dashed var(--night);border-radius:.6em;padding:.1em .6em;margin:.15em .3em .15em 0;font-family:Jua,sans-serif}
.fn6set.fn6used{opacity:.4;text-decoration:line-through}
.fn6dice{display:flex;gap:.5em;flex-wrap:wrap;align-items:center;margin:.3em 0}
`;
  document.head.append(s);
}
const fn6Val = s => { const v = typeof s === "string" ? fn6Str(s) : s; return fn6R(v.num, v.den); };
const fn6Txt = (num, den) => fn6Tk(fn6Form(num, den));
const fn6Lbl = (num, den) => den === 1 ? String(num) : num < den ? `[${num}/${den}]` : `[${fn6Form(num, den)}]`;
/* 단위 뒤 조사: 읽는 말(킬로그램·리터…)의 받침으로 정해요 */
const FN6_UR = { km: "킬로미터", L: "리터", kg: "킬로그램", m: "미터", t: "톤", cm: "센티미터", "cm²": "제곱센티미터", "장": "장", "개": "개" };
function fn6U(u, pair) { const w = FN6_UR[String(u).trim()] || String(u); return u + fn6J(w, pair).slice(w.length); }
/* ④ 넓이 모델(진분수×진분수): 넓이가 1인 정사각형을 나누고 색칠·빗금. opt stages [{dir:"v"|"h"|"h2", d, n, t(이름)}], ask, ok */
let FN6_PAT = 0;
function fn6Area(body, api, opt) {
  fn6Style(); fn6Style2();
  /* 다 하면 fn6Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let auto = () => {};
  const SG = opt.stages, K = SG.map(() => 1), sel = SG.map(() => new Set()), id = "fn6p" + (++FN6_PAT);
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
      svg.append(fn6SvgLine(`${done ? "✓" : i === cur ? "▶" : "·"} ${s.t}`, RX, y, 21, { anchor: "start", fill: col }));
      svg.append(fn6SvgLine(`${s.dir === "v" ? "세로로" : s.dir === "h" ? "가로로" : "다시 가로로"} ${K[i]}등분 · 고른 것 ${sel[i].size}개`, RX + 22, y + 32, 17, { anchor: "start", fill: "#5B6B6B" }));
      y += 82;
    });
    if (allOk()) {
      const tot = kv * kh * kh2, cnt = (vI >= 0 ? sel[vI].size : 1) * (h2I >= 0 ? sel[h2I].size : hI >= 0 ? sel[hI].size : 1);
      svg.append(fn6SvgLine(`전체 ${tot}칸 중 ${h2I >= 0 ? "진한 " : ""}빗금 ${cnt}칸`, RX, y + 6, 22, { anchor: "start", fill: TENT }));
      svg.append(fn6SvgLine(`→ [${cnt}/${tot}]`, RX, y + 54, 28, { anchor: "start", fill: TENT }));
    }
    tabs.forEach((b, i) => b.classList.toggle("fn6act", i === cur));
    steppers.forEach((st, i) => { st.style.display = i === cur ? "" : "none"; st.paint(); });
    auto();
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
  const steppers = SG.map((s, i) => fn6Stepper(`${s.dir === "v" ? "세로로" : s.dir === "h" ? "가로로" : "색칠·빗금 친 줄을 다시 가로로"} 똑같이 나누기:`, () => K[i], v => { K[i] = v; sel[i].clear(); for (let q = i + 1; q < SG.length; q++) if (SG[q].dir === "h2") sel[q].clear(); }, 1, 10, draw));
  const ask = h("div", { class: "fn6ask" });
  body.append(h("p", { class: "fn6tip" }, opt.tip || "단계마다 ‘＋’로 똑같이 나눈 다음, 정사각형을 눌러 색칠하거나 빗금을 그어요. 넓이가 1인 정사각형이에요."),
    h("div", { class: "fn6ctl" }, ...tabs, h("button", { onclick: () => { K.fill(1); sel.forEach(s => s.clear()); cur = 0; draw(); } }, "처음부터")), ...steppers, h("div", { class: "fn6stage" }, svg), ask);
  draw();
  auto = fn6Ask(ask, api, allOk, () => { const i = SG.findIndex((_, q) => !ok(q)), s = SG[i]; return `${s.t}: ${s.dir === "v" ? "세로로" : "가로로"} ${s.d}등분하고 ${s.n}${s.dir === "h2" ? "줄" : "칸"}을 골라요. 지금 ${K[i]}등분, ${sel[i].size}개 골랐어요.`; }, opt);
}

/* ===== 6-1 「분수의 나눗셈」(나누는 수가 자연수) 조작 부품 ===== */
function fn6Style4() {
  if (document.getElementById("fn6-style4")) return;
  const s = document.createElement("style"); s.id = "fn6-style4";
  s.textContent = `
.fn6grp.fn6fin{border-color:var(--ok)}
.fn6flash{display:flex;align-items:center;justify-content:center;min-height:4.2em;border:3px solid var(--night);border-radius:var(--r);background:#FFF8EE;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.9);margin:.4em 0}
.fn6flash.fn6hid{background:#EEF1F0;color:var(--muted);font-size:calc(var(--fs)*1.1)}
.fn6write{display:flex;flex-wrap:wrap;align-items:center;gap:.35em .5em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin:.35em 0}
.fn6grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.4em;margin:.4em 0}
.fn6grid button{min-height:3.6em;border:2px solid var(--line);border-radius:.7em;background:#fff;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.02);padding:.2em;color:var(--ink)}
.fn6grid button.fn6me{background:#D6E8FA;border-color:#2B7BD6}
.fn6grid button.fn6ai{background:#F9D9CF;border-color:#C8472E}
.fn6grid button.fn6open{border-color:var(--ring);background:var(--ring-soft)}
.fn6grid button:disabled{opacity:1;cursor:default}
`;
  document.head.append(s);
}
const FN6_P = ["#F6C08A", "#9CC6EC", "#A9D8A2", "#D7B5E6", "#F3D36B", "#F2A7B8"];

/* 여러 활동을 한 계단에: 모두 끝내야 통과 */
function fn6Both(body, api, parts, opt = {}) {
  fn6Style(); fn6Style4();
  const fin = parts.map(() => false), ans = parts.map(() => ""), info = parts.map(() => ({ words: [], answers: [] }));
  const merge = () => api.provide({ words: [...new Set(info.flatMap(x => x.words))], answers: info.flatMap(x => x.answers) });
  parts.forEach((p, i) => {
    const box = h("div", { class: "fn6grp" });
    if (opt.titles && opt.titles[i]) box.append(h("div", { class: "fn6gt" }, opt.titles[i]));
    body.append(box);
    const sub = Object.assign({}, api, {
      provide: x => { info[i] = { words: (x && x.words) || [], answers: (x && x.answers) || [] }; merge(); },
      done: (a, m) => {
        fin[i] = true; ans[i] = a || ""; box.classList.add("fn6fin");
        if (fin.every(Boolean)) return api.done(ans.join(" / "), opt.ok || m);
        api.hint(`${m || "좋아요!"} 이어서 ${fin.findIndex(d => !d) + 1}번 활동도 해요.`);
      }
    });
    p(box, sub);
  });
}

/* ① 나누어 주기 띠: (자연수)÷(자연수). 크기가 같은 띠 N개(하나가 1)를 d명(개)에게 똑같이 나누어 주어요.
   opt N, d, mode "each"(띠를 모두 똑같이 나누기) | "whole"(먼저 1씩 나누어 주고 남은 띠만 나누기),
       unit(" L"), strip("종이 1장"), who("명"), one("한 명"), tip, ask·askCalc, ok */
function fn6Share(body, api, opt) {
  fn6Style(); fn6Style2(); fn6Style4();
  /* 다 하면 fn6Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let auto = () => {};
  const N = opt.N, d = opt.d, unit = opt.unit || "", one = opt.one || "한 명";
  let mode = opt.mode || "each";
  const q = Math.floor(N / d), r = N % d;
  let nWhole = mode === "whole" ? q * d : 0;
  let K = 1; const sel = new Set(), wsel = new Set();
  const W = 900, LX = 200, BW = 640, BH = 48, GP = 18, H = N * (BH + GP) + 70;
  const svg = makeSvg(W, H);
  const divisible = i => i >= nWhole;
  const ready = () => K === d && wsel.size === q * (mode === "whole" ? 1 : 0) && [...Array(N).keys()].filter(divisible).every(i => [...sel].filter(k => +k.split(":")[0] === i).length === 1);
  /* 다 나누어 주면 다른 사람 몫에도 번호를 붙여 보여 줘요 */
  const owner = () => {
    const o = {};
    if (mode === "whole") { let p = 1; for (let i = 0; i < nWhole; i++) { if (wsel.has(i)) o[i] = 0; else { o[i] = p; p = p % (d - 1) + 1; } } }
    for (let i = nWhole; i < N; i++) { let p = 1; for (let j = 0; j < K; j++) { if (sel.has(`${i}:${j}`)) o[`${i}:${j}`] = 0; else o[`${i}:${j}`] = p++; } }
    return o;
  };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
    const ok = ready(), own = ok ? owner() : null;
    for (let i = 0; i < N; i++) {
      const y = 16 + i * (BH + GP);
      svg.append(fn6SvgLine((nWhole && divisible(i) ? "남은 " : "") + (opt.strip || `1${unit}`), LX - 16, y + BH / 2 + 2, 19, { anchor: "end", fill: nWhole && divisible(i) ? "#B4610F" : "#5B6B6B" }));
      if (!divisible(i)) {
        const on = wsel.has(i), f = on ? FN6_P[0] : ok ? FN6_P[own[i] % 6] : "#fff";
        svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: f, stroke: INK, "stroke-width": 4 }));
        if (ok) svg.append(txt(LX + BW / 2, y + BH / 2 + 7, `${own[i] + 1}번`, 20, { fill: INK }));
        else if (on) svg.append(txt(LX + BW / 2, y + BH / 2 + 7, one, 20, { fill: INK }));
      } else {
        const cw = BW / K;
        for (let j = 0; j < K; j++) {
          const on = sel.has(`${i}:${j}`), f = on ? FN6_P[0] : ok ? FN6_P[own[`${i}:${j}`] % 6] : "#fff";
          svg.append(svgEl("rect", { x: LX + j * cw, y, width: cw, height: BH, fill: f, stroke: INK, "stroke-width": 2 }));
          if (ok) svg.append(txt(LX + (j + .5) * cw, y + BH / 2 + 7, String(own[`${i}:${j}`] + 1), K > 9 ? 15 : 19, { fill: INK }));
        }
        svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4 }));
      }
    }
    /* 0과 1 눈금 */
    const yl = 16 + N * (BH + GP) + 6;
    svg.append(svgEl("line", { x1: LX, y1: yl, x2: LX + BW, y2: yl, stroke: INK, "stroke-width": 2 }));
    [0, 1].forEach(v => { svg.append(svgEl("line", { x1: LX + v * BW, y1: yl - 8, x2: LX + v * BW, y2: yl + 8, stroke: INK, "stroke-width": 3 })); svg.append(txt(LX + v * BW, yl + 26, v ? `1${unit}` : "0", 18)); });
    /* 읽기 */
    const cnt = sel.size, w = wsel.size;
    const cntTxt = (t, n) => n > 1 ? `${t}${unit ? fn6U(unit, "이가") : "이"} ${n}개` : `${t}${unit}`;
    const parts = [w ? cntTxt("1", w) : "", cnt ? cntTxt(`[1/${K}]`, cnt) : ""].filter(Boolean);
    const and = p0 => /개$/.test(p0) ? p0 + "와" : unit ? p0 + fn6U(unit, "과와").slice(unit.length) : fn6J(p0, "과와");
    const pTxt = parts.length === 2 ? `${and(parts[0])} ${parts[1]}` : parts.join("");
    if (ok) rd.textContent = `${one}의 몫: ${pTxt} → ${N}÷${d} = ${mode === "whole" && q ? `${q} + [${r}/${d}] = [${fn6Form(N, d)}]` : `[${N}/${d}]`}${unit}. 번호는 누구의 몫인지 나타내요.`;
    else if (K === 1 && !w) rd.textContent = mode === "whole" && nWhole ? `먼저 ${one}에게 줄 1${unit}짜리를 눌러 골라요. 그다음 남은 ${r}개를 ‘＋’로 똑같이 나누어요.` : `‘＋’를 눌러 띠를 똑같이 나누어 보세요. 나누어 줄 수는 ${fn6J(String(d), "이에요")}.`;
    else rd.textContent = `${one}에게 고른 것: ${parts.length ? pTxt : "아직 없어요"}`;
    rd.classList.toggle("fn6good", ok);
    st.paint(); auto();
  };
  const rd = h("p", { class: "fn6rd" });
  const st = fn6Stepper(mode === "whole" && nWhole ? `남은 ${r}개를 똑같이 나누기:` : "띠를 똑같이 나누기:", () => K, v => { K = v; sel.clear(); }, 1, 12, draw);
  svg.style.cursor = "pointer";
  svg.addEventListener("click", ev => {
    const p = svgPt(svg, ev); if (p.x < LX || p.x > LX + BW) return;
    const i = Math.floor((p.y - 16) / (BH + GP)); if (i < 0 || i >= N || p.y - 16 - i * (BH + GP) > BH) return;
    if (!divisible(i)) { if (wsel.has(i)) wsel.delete(i); else { if (wsel.size >= q) return api.hint(`1${unit}짜리는 ${d}${opt.who || "명"}에게 똑같이 ${q}개씩 나누어 줄 수 있어요.`); wsel.add(i); } return draw(); }
    if (K === 1) return api.hint(`먼저 ‘＋’로 띠를 똑같이 나누어요. ${d}${opt.who || "명"}에게 나누어 주니까 몇 칸으로 나누면 될까요?`);
    const j = Math.min(K - 1, Math.floor((p.x - LX) / (BW / K))), key = `${i}:${j}`;
    if (sel.has(key)) sel.delete(key); else { [...sel].filter(k => +k.split(":")[0] === i).forEach(k => sel.delete(k)); sel.add(key); }
    draw();
  });
  const ask = h("div", { class: "fn6ask" });
  let chooser = "";
  if (opt.choose) {
    const lab = st.querySelector(".jua");
    const mb = [["방법 1: 1씩 먼저 나누어 주기", "whole"], ["방법 2: 처음부터 각각 나누기", "each"]].map(([t, md]) => h("button", { onclick: ev => { mode = md; nWhole = mode === "whole" ? q * d : 0; K = 1; sel.clear(); wsel.clear(); mb.forEach(x => x.classList.toggle("fn6act", x === ev.currentTarget)); lab.textContent = mode === "whole" && nWhole ? `남은 ${r}개를 똑같이 나누기:` : "띠를 똑같이 나누기:"; draw(); } }, t));
    mb.forEach((x, i) => x.classList.toggle("fn6act", (i === 0) === (mode === "whole")));
    chooser = h("div", { class: "fn6ctl" }, h("span", { class: "jua" }, "방법 고르기:"), ...mb);
  }
  body.append(h("p", { class: "fn6tip" }, opt.tip || `‘＋’로 띠를 똑같이 나눈 다음, ${one}에게 줄 부분을 눌러 골라요. 띠 하나에서 한 칸씩 골라요.`),
    chooser, st, rd, h("div", { class: "fn6stage" }, svg), ask);
  draw();
  auto = fn6Ask(ask, api, ready, () => {
    if (mode === "whole" && wsel.size !== q) return `먼저 1${unit}짜리를 ${q}개 골라 ${one}에게 주어요.`;
    if (K !== d) return `띠를 똑같이 ${d}칸으로 나누어요. ${d}${opt.who || "명"}에게 똑같이 나누어 주니까요. 지금 ${K}칸이에요.`;
    return `나눈 띠마다 한 칸씩 골라 ${one}에게 주어요.`;
  }, opt);
}

/* ② (분수)÷(자연수) 띠: 나누어지는 수를 색칠해 두고, 칸을 더 잘게 나눈 다음 한 묶음(÷k)만큼 골라요.
   opt A("4/9"·"2/3"·"4 1/2"), k, m(각 칸을 나눌 수: 나누어떨어지면 1), mode "frac"(가분수 칸) | "mixed"(자연수 부분은 1씩, 진분수 부분만 나누기),
       unit, aName, tip, ask·askCalc, ok */
function fn6Div(body, api, opt) {
  fn6Style(); fn6Style2(); fn6Style4();
  /* 다 하면 fn6Ask 안에서 api.done( 이 불려요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  let auto = () => {};
  const A = fn6Str(opt.A), k = opt.k, unit = opt.unit || "", mode = opt.mode || "frac";
  const den = A.hasF ? A.d : 1, num = A.num, w = A.w, nf = A.hasF ? A.n : 0;
  const m = opt.m || (((mode === "mixed" ? nf : num) % k) ? k : 1);
  if (mode === "mixed" && (w % k || (nf * m) % k)) throw new Error("fn6Div 확인 필요: " + opt.A);
  if (mode === "frac" && (num * m) % k) throw new Error("fn6Div 확인 필요: " + opt.A);
  const U = Math.max(1, Math.ceil(num / den));
  let K = 1; const sel = new Set(), wsel = new Set();
  const W = 900, LX = 40, BW = 820, BH = 64, uw = BW / U, H = 230;
  const svg = makeSvg(W, H);
  const colored = mode === "mixed" ? nf : num; /* 나눌 수 있는 색칠 칸(분모 칸) 수 */
  const need = () => colored * K / k;
  const ready = () => K === m && sel.size === need() && (mode !== "mixed" || wsel.size === w / k);
  /* 칸 번호 c(0부터, 1/den 칸) → 위치: mixed는 자연수 부분 뒤에 진분수 칸 */
  const cellX = c => mode === "mixed" ? LX + w * uw + c * uw / den : LX + c * uw / den;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
    const Y = 40;
    for (let u = 0; u < U; u++) svg.append(svgEl("rect", { x: LX + u * uw, y: Y, width: uw, height: BH, fill: "#fff", stroke: "#B9C4C0", "stroke-width": 2, "stroke-dasharray": "6 5" }));
    if (mode === "mixed") for (let u = 0; u < w; u++) {
      const on = wsel.has(u);
      svg.append(svgEl("rect", { x: LX + u * uw, y: Y, width: uw, height: BH, fill: on ? "#E0823A" : "#F6C08A", stroke: INK, "stroke-width": 3 }));
      if (on) svg.append(txt(LX + (u + .5) * uw, Y + BH / 2 + 7, "한 묶음", 18, { fill: "#fff" }));
    }
    const sw = uw / den / K;
    for (let c = 0; c < colored; c++) for (let s = 0; s < K; s++) {
      const key = c * K + s, on = sel.has(key);
      svg.append(svgEl("rect", { x: cellX(c) + s * sw, y: Y, width: sw, height: BH, fill: on ? "#E0823A" : "#F6C08A", stroke: INK, "stroke-width": s === 0 ? 2.4 : 1.2, "stroke-dasharray": s === 0 ? "" : "4 3" }));
    }
    /* 분모 칸 테두리(색칠 안 된 칸 포함) */
    const totalCells = mode === "mixed" ? den : U * den;
    for (let c = 0; c < totalCells; c++) svg.append(svgEl("rect", { x: cellX(c), y: Y, width: uw / den, height: BH, fill: "none", stroke: INK, "stroke-width": 2.4 }));
    for (let u = 0; u < U; u++) svg.append(svgEl("rect", { x: LX + u * uw, y: Y, width: uw, height: BH, fill: "none", stroke: INK, "stroke-width": 4 }));
    /* 눈금 */
    const yl = Y + BH + 30;
    svg.append(svgEl("line", { x1: LX, y1: yl, x2: LX + BW, y2: yl, stroke: INK, "stroke-width": 2 }));
    for (let u = 0; u <= U; u++) { svg.append(svgEl("line", { x1: LX + u * uw, y1: yl - 9, x2: LX + u * uw, y2: yl + 9, stroke: INK, "stroke-width": 3 })); svg.append(txt(LX + u * uw, yl + 26, u === U && unit ? `${u}${unit}` : String(u), 18)); }
    svg.append(fn6SvgLine(opt.aName || `[${opt.A}]${unit}`, LX, 24, 20, { anchor: "start", fill: "#5B6B6B" }));
    /* 읽기 */
    const fd = den * K, ok = ready();
    const nTxt = need() > 1 ? `[1/${fd}]이 ${need()}개` : `[1/${fd}]`;
    if (ok) rd.textContent = `한 묶음: ${mode === "mixed" ? fn6J(w / k > 1 ? `1이 ${w / k}개` : "1", "과와") + " " : ""}${nTxt} → ${fn6Tk(opt.A)}÷${k} = ${mode === "mixed" ? `${w / k} + [${need()}/${fd}] = [${fn6Form(w / k * fd + need(), fd)}]` : K === 1 ? `[${num}÷${k}/${fd}] = [${need()}/${fd}]` : `[${num * K}/${fd}]÷${k} = [${need()}/${fd}]`}${unit}`;
    else if (K === 1 && (mode === "mixed" ? nf : num) % k) rd.textContent = `색칠한 [1/${den}]${mode === "mixed" ? " 칸" : ""}이 ${colored}개라서 ${k}묶음으로 똑같이 나눌 수 없어요. ‘＋’로 칸을 더 잘게 나누어 보세요.`;
    else if (K !== m) rd.textContent = (colored * K) % k ? `색칠한 칸이 [1/${fd}]이 ${colored * K}개예요. ${k}로 나누어떨어지지 않아요.` : `[1/${fd}]이 ${colored * K}개라 ${k}로 나누어떨어지지만, 이 계단에서는 각 칸을 ${m}칸으로 나누어 봐요.`;
    else rd.textContent = `색칠한 부분은 [1/${fd}]이 ${colored * K}개예요. ${k}묶음 중 한 묶음은 ${need()}칸이에요. 고른 칸: ${sel.size}개${mode === "mixed" ? `, 1짜리 ${wsel.size}개` : ""}`;
    rd.classList.toggle("fn6good", ok);
    st.paint(); auto();
  };
  const rd = h("p", { class: "fn6rd" });
  const st = fn6Stepper(mode === "mixed" ? "진분수 부분의 칸을 똑같이 나누기:" : "각 칸을 똑같이 나누기:", () => K, v => { K = v; sel.clear(); }, 1, 10, draw);
  svg.style.cursor = "pointer";
  svg.addEventListener("click", ev => {
    const p = svgPt(svg, ev); if (p.y < 40 || p.y > 40 + BH) return;
    if (mode === "mixed" && p.x >= LX && p.x < LX + w * uw) {
      const u = Math.floor((p.x - LX) / uw);
      if (wsel.has(u)) wsel.delete(u); else { if (wsel.size >= w / k) return api.hint(`자연수 부분 ${fn6J(String(w), "을를")} ${k}묶음으로 나누면 한 묶음은 ${fn6J(String(w / k), "이에요")}.`); wsel.add(u); }
      return draw();
    }
    const fx = p.x - cellX(0); if (fx < 0) return;
    const c = Math.floor(fx / (uw / den)); if (c >= colored) return api.hint("색칠한 부분 안에서 골라요.");
    if (K === 1 && (mode === "mixed" ? nf : num) % k) return api.hint("먼저 ‘＋’로 각 칸을 더 잘게 나누어요.");
    const s = Math.min(K - 1, Math.floor((fx - c * uw / den) / (uw / den / K))), key = c * K + s;
    sel.has(key) ? sel.delete(key) : sel.add(key);
    draw();
  });
  const ask = h("div", { class: "fn6ask" });
  body.append(h("p", { class: "fn6tip" }, opt.tip || `색칠한 부분이 ${unit ? fn6Tk(opt.A) + fn6U(unit, "이에요") : fn6J(fn6Tk(opt.A), "이에요")}. 필요하면 ‘＋’로 칸을 잘게 나눈 다음, ${k}묶음 중 한 묶음만큼 눌러 골라요.`),
    st, rd, h("div", { class: "fn6stage" }, svg), ask);
  draw();
  auto = fn6Ask(ask, api, ready, () => {
    if (K !== m) return (colored * K) % k ? `색칠한 칸 수가 ${k}로 나누어떨어지도록 각 칸을 똑같이 나누어요. 지금 각 칸이 ${K}칸이에요.` : `이 계단에서는 각 칸을 ${m}칸으로 나누어 봐요.`;
    if (mode === "mixed" && wsel.size !== w / k) return `자연수 부분에서 1짜리를 ${w / k}개 골라요.`;
    return `${k}묶음 중 한 묶음만큼(${need()}칸) 골라요. 지금 ${sel.size}칸이에요.`;
  }, opt);
}

/* ③ 수 카드로 나눗셈 만들기
   boards [{kind:"nat"(□÷□)|"fr"(□/□÷□), goal:"any"|"min"|"max", proper:true, label}], cards, all(카드 모두 한 번씩), tip, ok */
function fn6BVal(kind, v) { return kind === "nat" ? (v[1] ? fn6R(v[0], v[1]) : null) : (v[1] && v[2] ? fn6R(v[0], v[1] * v[2]) : null); }
function fn6BTxt(kind, v) { return kind === "nat" ? `${v[0]}÷${v[1]}` : `[${v[0]}/${v[1]}]÷${v[2]}`; }
function fn6BBest(bd, cards, sign) {
  const n = bd.kind === "nat" ? 2 : 3; let best = null;
  const rec = (pick, used) => {
    if (pick.length === n) { const v = pick.map(i => cards[i]); if (bd.proper && bd.kind === "fr" && v[0] >= v[1]) return; const x = fn6BVal(bd.kind, v); if (x && (!best || sign * (x.num * best.x.den - best.x.num * x.den) > 0)) best = { x, v }; return; }
    cards.forEach((_, i) => { if (!used.has(i)) { used.add(i); pick.push(i); rec(pick, used); pick.pop(); used.delete(i); } });
  };
  rec([], new Set());
  return best;
}
function fn6Build(body, api, opt) {
  fn6Style(); fn6Style2(); fn6Style3();
  const cards = opt.cards, boards = opt.boards;
  const slots = []; let sel = null, auto = () => {}; /* slots: {b, card} */
  const cBtns = cards.map((c, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; paint(); } }, String(c)));
  const quo = [];
  const bests = boards.map(bd => bd.goal === "min" ? fn6BBest(bd, cards, -1) : bd.goal === "max" ? fn6BBest(bd, cards, 1) : null);
  const boxes = boards.map((bd, bi) => {
    const mk = lab => { const S = { b: bi, card: null }; S.el = h("button", { class: "fn6slot2", "aria-label": lab, onclick: () => { if (sel == null) S.card = null; else { slots.forEach(o => { if (o.card === sel) o.card = null; }); S.card = sel; } sel = null; paint(); } }, "​"); slots.push(S); return S.el; };
    const row = h("div", { class: "fn6board" });
    if (bd.kind === "nat") row.append(mk("나누어지는 수"), h("span", {}, "÷"), mk("나누는 수"));
    else row.append(h("span", { class: "fn6fr fn6frin" }, h("span", { class: "fn6q" }, h("span", { class: "fn6n" }, mk("분자")), h("span", { class: "fn6d" }, mk("분모")))), h("span", {}, "÷"), mk("나누는 수"));
    const qi = fn6In("몫"); quo.push(qi); row.append(h("span", {}, "="), qi);
    return h("div", { class: "fn6grp" }, bd.label ? h("div", { class: "fn6gt" }, bd.label) : null, row);
  });
  const paint = () => {
    cBtns.forEach((b, i) => { b.classList.toggle("fn6on", sel === i); b.classList.toggle("fn6used", slots.some(s => s.card === i)); });
    slots.forEach(s => { s.el.textContent = s.card == null ? "​" : String(cards[s.card]); s.el.classList.toggle("fn6full", s.card != null); });
    auto();
  };
  paint();
  api.provide({ words: opt.words || ["진분수", "×[1/▲]", "분자를 자연수로 나누기"], answers: boards.map((bd, i) => bests[i] ? `${fn6Plain(fn6BTxt(bd.kind, bests[i].v))} = ${fn6Plain(fn6Txt(bests[i].x.num, bests[i].x.den))}` : "").filter(Boolean) });
  body.append(h("p", { class: "fn6tip" }, (opt.tip || "수 카드를 누른 다음 빈칸을 눌러 넣어요. 빈칸을 다시 누르면 빠져요. 그리고 몫을 써요.") + " 다 쓰면 저절로 확인해요."), h("div", { class: "fn6deck" }, cBtns), ...boxes);
  const vals = bi => slots.filter(s => s.b === bi).map(s => cards[s.card]);
  const ready = () => {
    if (slots.some(s => s.card == null)) return false;
    boards.forEach((bd, bi) => { quo[bi].tv = fn6BVal(bd.kind, vals(bi)); });
    return quo.every(q => q.full());
  };
  /* 다 맞으면 api.done( 을 불러요 */
  auto = autoRun(ready, () => slots.map(s => s.card).join(",") + "#" + quo.map(q => q.sig()).join("§"), () => {
    if (opt.all && cards.some((_, i) => !slots.some(s => s.card === i))) { api.fail("수 카드를 한 번씩 모두 사용해요.", "-"); return false; }
    const given = []; let bad = null, hint = null;
    boards.forEach((bd, bi) => {
      const v = vals(bi), e = fn6BTxt(bd.kind, v), x = fn6BVal(bd.kind, v), r = quo[bi].get();
      given.push(`${fn6Plain(e)} = ${quo[bi].text()}`);
      if (bad) return;
      const pre = boards.length > 1 ? `${bi + 1}번: ` : "";
      if (bd.proper && bd.kind === "fr" && v[0] >= v[1]) { bad = `${pre}진분수는 분자가 분모보다 작아야 해요.`; return; }
      if (bests[bi] && !fn6Eq(x, bests[bi].x)) { bad = pre + (bd.msg || (bd.goal === "min" ? "몫이 더 작은 나눗셈을 만들 수 있어요." : "몫이 더 큰 나눗셈을 만들 수 있어요.")); return; }
      if (r.err) { quo[bi].paint(false); bad = pre + (r.err === "half" ? "분수는 분자와 분모를 모두 써요." : "몫을 분수나 자연수로 써요."); return; }
      if (!fn6Eq(r, x)) { quo[bi].paint(false); bad = pre + (fn6Diag(e, r) || "몫을 다시 계산해 봐요."); return; }
      quo[bi].paint(true);
      if (r.hasF && r.hasW && r.n >= r.d) hint = hint || "값은 맞아요. 대분수의 분수 부분은 1보다 작게 써요.";
    });
    if (bad) { api.fail(bad, given.join(" / ")); return false; }
    if (hint) { api.tryOnce(); api.hint(hint); return false; }
    api.tryOnce(); api.done(given.join(" / "), opt.ok || "나눗셈을 만들고 몫을 바르게 구했어요!");
    return true;
  }, 900);
  quo.forEach(q => fn6Hook(q, auto));
}

function fn6CardVal(e) { const v = fn6Eval(e); if (!v) throw new Error("카드 확인 필요: " + e); return v; }
/* 카드 식을 쓰는 칸: 나누어지는 수(자연수·분수) ÷ 나누는 수 */
function fn6ExprIn() {
  const a = fn6In("나누어지는 수"), b = fn6Box("0");
  b.setAttribute("aria-label", "나누는 수"); b.classList.add("fn6wide");
  b.addEventListener("input", () => { const v = b.value.replace(/[^0-9]/g, "").slice(0, 2); if (v !== b.value) b.value = v; });
  const el = h("span", { class: "fn6write" }, a, h("span", {}, "÷"), b);
  el.a = a; el.b = b;
  el.read = () => { const r = a.get(), k = b.value.replace(/\s/g, ""); if (r.err || !/^[1-9]\d*$/.test(k)) return null; return { r, k: +k, e: `${fn6Tk(fn6Key(r))}÷${k}` }; };
  el.full = () => a.full() && b.value.trim() !== "";
  el.sig = () => a.sig() + "÷" + b.value.trim();
  el.clear = () => { el.querySelectorAll("input").forEach(x => { x.value = ""; x.style.borderColor = ""; }); };
  return el;
}
/* ④ 놀이: 기억의 이어달리기 — 카드를 잠깐 보고 기억하여 쓰고 계산해요. 점수 2·1·1·0점(교과서). opt cards, rounds, need(옳게 계산한 판 수) */
function fn6Relay(body, api, opt) {
  fn6Style(); fn6Style2(); fn6Style3(); fn6Style4();
  const deck = opt.cards.slice(); let round = 0, score = 0, good = 0, sec = opt.sec || 5, timer = null;
  const log = [], stage = h("div"), scoreEl = h("span", { class: "fn6score" }, "​"), logEl = h("div");
  api.provide({ words: ["맞히고 옳게 계산: 2점", "맞혔으나 잘못 계산: 1점", "맞히지 못했으나 옳게 계산: 1점", "맞히지 못하고 잘못 계산: 0점"], answers: [] });
  const shuffle = () => { for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } };
  shuffle();
  const paintScore = () => { scoreEl.textContent = `${Math.min(round + 1, opt.rounds)}/${opt.rounds}판 · 점수 ${score}점 · 옳게 계산 ${good}번`; };
  const secs = h("div", { class: "fn6ctl" }, h("span", { class: "jua" }, "주문서 보는 시간:"), ...[3, 5, 8].map(s => { const b = h("button", { onclick: () => { sec = s; [...secs.querySelectorAll("button")].forEach(x => x.classList.toggle("fn6act", x === b)); } }, `${s}초`); if (s === sec) b.classList.add("fn6act"); return b; }));
  const deal = () => {
    clearInterval(timer); stage.innerHTML = ""; paintScore();
    const card = deck[round % deck.length], val = fn6CardVal(card);
    const flash = h("div", { class: "fn6flash fn6hid" }, "‘주문서 보기’를 누르면 주문서가 잠깐 보여요.");
    const form = h("div", { class: "hidden" });
    const ex = fn6ExprIn(), q = fn6In("몫"), fb = h("div");
    const A0 = fn6Str(card.split("÷")[0]); ex.a.tv = fn6R(A0.num, A0.den); q.tv = val;
    let left = sec, shown = false, judged = false;
    const flip = h("button", { onclick: () => {
      if (shown) return; shown = true; flip.disabled = true;
      flash.classList.remove("fn6hid"); flash.textContent = card; left = sec;
      const cd = h("p", { class: "fn6rd" }, `${left}초 뒤에 주문서를 덮어요. 잘 기억해요!`); stage.insertBefore(cd, form);
      timer = setInterval(() => { left--; cd.textContent = left > 0 ? `${left}초 뒤에 주문서를 덮어요. 잘 기억해요!` : ""; if (left <= 0) { clearInterval(timer); flash.classList.add("fn6hid"); flash.textContent = "주문서를 덮었어요. 기억한 나눗셈과 몫을 쓰면 저절로 칠판에 올려 확인해요."; form.classList.remove("hidden"); } }, 1000);
    } }, "주문서 보기");
    /* 기억한 나눗셈과 몫을 다 쓰면 저절로 칠판에 올려 점수를 매겨요. 마지막 판이 끝나면 api.done( 을 불러요 */
    const auto = autoRun(() => !judged && shown && left <= 0 && ex.full() && q.full(), () => ex.sig() + "#" + q.sig(), () => {
      const E = ex.read(); if (!E) { api.hint("기억한 나눗셈을 끝까지 써요. 나누는 수는 자연수예요."); return false; }
      const r = q.get(); if (r.err) { api.hint(r.err === "empty" ? "몫을 써요." : r.err === "half" ? "분수는 분자와 분모를 모두 써요." : "몫을 분수나 자연수로 써요."); return false; }
      judged = true; form.querySelectorAll("input").forEach(x => { x.readOnly = true; });
      const same = E.e.replace(/[\[\]]/g, "") === card.replace(/[\[\]]/g, "");
      const right = fn6Eq(r, fn6R(E.r.num, E.r.den * E.k));
      const pt = (same ? 1 : 0) + (right ? 1 : 0);
      score += pt; if (right) good++;
      q.paint(right);
      log.push(`${round + 1}판: ${card} → ${pt}점`);
      fb.append(h("p", { class: "fn6rd" + (pt === 2 ? " fn6good" : "") },
        `주문서: ${card} = ${fn6Book(val.num, val.den)} · ${same ? "나눗셈을 맞혔어요" : "나눗셈을 맞히지 못했어요"}, ${right ? "옳게 계산했어요" : `계산이 틀렸어요(옳은 몫: ${fn6Book(E.r.num, E.r.den * E.k)})`} → ${pt}점`));
      round++; paintScore();
      logEl.innerHTML = ""; logEl.append(h("ol", { class: "fn6log" }, log.map(t => h("li", {}, t))));
      if (round < opt.rounds) fb.append(h("div", { class: "fn6ctl" }, h("button", { onclick: deal }, "이어서 한 판 더")));
      else {
        api.tryOnce();
        const msg = `${opt.rounds}판 끝! 점수 ${score}점, 옳게 계산한 판 ${good}번이에요.`;
        if (good >= opt.need) api.done(`${score}점, 옳은 계산 ${good}번`, msg + " 정확하게 기억하고 계산했어요.");
        else { api.fail(`${msg} ${opt.need}번 이상 옳게 계산하도록 다시 해 봐요.`, `${score}점`); fb.append(h("div", { class: "fn6ctl" }, h("button", { onclick: () => { round = 0; score = 0; good = 0; log.length = 0; logEl.innerHTML = ""; shuffle(); deal(); } }, "처음부터 다시"))); }
      }
      return true;
    }, 900);
    [ex.a, ex.b, q].forEach(x => fn6Hook(x, auto));
    form.append(h("div", { class: "fn6write" }, h("span", { class: "jua" }, "기억한 나눗셈:"), ex), h("div", { class: "fn6write" }, h("span", { class: "jua" }, "계산한 몫:"), q), fb);
    stage.append(h("div", { class: "fn6ctl" }, flip), flash, form);
  };
  body.append(h("p", { class: "fn6tip" }, "‘주문서 보기’를 누르면 나눗셈이 적힌 빵 주문서가 잠깐 보였다가 덮여요. 기억한 나눗셈과 계산한 몫을 쓰면 저절로 확인해요. (주문서는 이 앱이 정한 것이에요.)"),
    secs, h("div", { class: "fn6ctl" }, scoreEl), stage, logEl);
  deal();
}

/* ⑤ 또 다른 놀이(2명): 4×4 카드 판. 카드를 골라 옳게 계산하면 내 카드. 가로·세로·대각선 한 줄을 먼저 완성하면 이겨요. 상대는 컴퓨터예요. */
function fn6Line(body, api, opt) {
  fn6Style(); fn6Style2(); fn6Style3(); fn6Style4();
  let own, cards, open, over, myTurn;
  const grid = h("div", { class: "fn6grid" }), work = h("div"), rd = h("p", { class: "fn6rd" }), ctl = h("div", { class: "fn6ctl" });
  const LINES = [];
  for (let i = 0; i < 4; i++) { LINES.push([0, 1, 2, 3].map(j => i * 4 + j)); LINES.push([0, 1, 2, 3].map(j => j * 4 + i)); }
  LINES.push([0, 5, 10, 15], [3, 6, 9, 12]);
  const line = who => LINES.some(L => L.every(i => own[i] === who));
  api.provide({ words: ["가로·세로·대각선 한 줄", "옳게 계산하면 내 카드"], answers: [] });
  const btns = [...Array(16)].map((_, i) => h("button", { onclick: () => pick(i) }, "?"));
  grid.append(...btns);
  const paint = () => btns.forEach((b, i) => {
    b.className = own[i] === 1 ? "fn6me" : own[i] === 2 ? "fn6ai" : open === i ? "fn6open" : "";
    b.textContent = own[i] ? `${cards[i]}${own[i] === 1 ? " (나)" : " (컴퓨터)"}` : open === i ? cards[i] : "?";
    b.disabled = over || !!own[i];
  });
  /* 이기면 api.done( 을 불러요 */
  const end = () => {
    over = true; paint();
    const me = own.filter(x => x === 1).length, ai = own.filter(x => x === 2).length;
    const win = line(1) || (!line(2) && me > ai);
    rd.textContent = line(1) ? "내 카드로 한 줄을 먼저 완성했어요! 내가 이겼어요." : line(2) ? "컴퓨터가 한 줄을 먼저 완성했어요." : `줄을 완성한 사람이 없어요. 내 카드 ${me}장, 컴퓨터 ${ai}장${me > ai ? "이라 내가 이겼어요." : me === ai ? "으로 비겼어요." : "이라 컴퓨터가 이겼어요."}`;
    rd.classList.toggle("fn6good", win);
    api.tryOnce();
    if (win) api.done(`이김 · 내 카드 ${me}장`, "카드를 옳게 계산해 한 줄을 만들었어요!");
    else { api.hint("한 판 더 해 봐요. 옳게 계산해야 카드를 가질 수 있어요."); ctl.innerHTML = ""; ctl.append(h("button", { onclick: start }, "한 판 더")); }
  };
  const check = () => { if (line(1) || line(2) || own.every(Boolean)) { end(); return true; } return false; };
  const aiTurn = () => {
    myTurn = false; paint();
    setTimeout(() => {
      if (over) return;
      const free = own.map((x, i) => x ? -1 : i).filter(i => i >= 0);
      const i = free[Math.floor(Math.random() * free.length)], okAi = Math.random() < .7, v = fn6CardVal(cards[i]);
      if (okAi) own[i] = 2;
      rd.textContent = `컴퓨터는 ${fn6J(cards[i], "을를")}${okAi ? ` 옳게 계산했어요(= ${fn6Book(v.num, v.den)}). 컴퓨터 카드가 되었어요.` : " 잘못 계산해서 카드를 다시 뒤집어 놓았어요."} 이제 내 차례예요.`;
      rd.classList.remove("fn6good");
      myTurn = true; if (!check()) paint();
    }, 700);
  };
  const pick = i => {
    if (over || own[i] || !myTurn) return;
    open = i; paint(); work.innerHTML = "";
    const q = fn6In("몫"), v = fn6CardVal(cards[i]); q.tv = v;
    let used = false;
    const auto = autoRun(() => !used && q.full(), () => q.sig(), () => {
      const r = q.get(); if (r.err) { api.hint(r.err === "half" ? "분수는 분자와 분모를 모두 써요." : "몫을 분수나 자연수로 써요."); return false; }
      used = true;
      const ok = fn6Eq(r, v);
      if (ok) own[i] = 1;
      rd.textContent = ok ? `옳게 계산했어요! ${cards[i]} = ${fn6Book(v.num, v.den)} · 내 카드가 되었어요.` : `틀렸어요. ${fn6Diag(cards[i], r) ? fn6Diag(cards[i], r) + " " : ""}카드를 다시 뒤집어 놓아요.`;
      rd.classList.toggle("fn6good", ok);
      open = null; work.innerHTML = "";
      if (!check()) aiTurn();
      return true;
    }, 900);
    fn6Hook(q, auto);
    work.append(h("div", { class: "fn6write" }, h("span", {}, cards[i] + " ="), q, h("span", { class: "fn6house" }, "몫을 쓰면 저절로 확인해요")));
  };
  const start = () => {
    cards = opt.cards.slice(); for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    own = Array(16).fill(0); open = null; over = false; myTurn = true; work.innerHTML = ""; ctl.innerHTML = "";
    rd.textContent = "내가 먼저 해요. 카드 한 장을 골라 뒤집어 보세요."; rd.classList.remove("fn6good"); paint();
  };
  body.append(h("p", { class: "fn6tip" }, "카드를 하나 골라 몫을 써요. 옳게 계산하면 내 카드(파랑), 틀리면 다시 뒤집어 놓아요. 그다음은 컴퓨터 차례예요. 가로·세로·대각선으로 내 카드 한 줄을 먼저 완성하면 이겨요."),
    rd, grid, work, ctl);
  start();
}
/* 나눔 빵 주문서(9차시 놀이) — 교과서에 카드 목록이 없어 이 앱이 정한 것이에요. 나누는 수는 모두 한 자리 수예요. */
const FN6S_CARDS = ["[4/5]÷2", "2÷7", "5÷6", "8÷3", "7÷2", "[9/11]÷3", "[3/4]÷2", "[5/7]÷4", "[2/9]÷3", "[7/10]÷5", "[6/13]÷4", "[1 1/2]÷3", "[2 2/3]÷4", "[3 3/4]÷5", "[1 4/5]÷2", "[5 1/3]÷8"];
FN6S_CARDS.forEach(fn6CardVal);

/* ===== 이야기 버전에서 새로 만든 그림 (앞글자 fn6s) ===== */
function fn6sStyle() {
  if (document.getElementById("fn6s-style")) return;
  const s = document.createElement("style"); s.id = "fn6s-style";
  s.textContent = `.fn6snote{border:3px dashed #B4610F;border-radius:var(--r);background:#FFF7EC;padding:.5em .9em;margin:.3em 0 .6em}
.fn6snote b{font-family:Jua,sans-serif;font-weight:400;color:#8A4A0B}
.fn6snote ul{margin:.3em 0 0 1.1em;padding:0}.fn6snote li{margin:.2em 0;line-height:1.9}`;
  document.head.append(s);
}
function fn6sNote(title, lines) {
  fn6Style(); fn6sStyle();
  return h("div", { class: "fn6snote" }, h("b", {}, title), h("ul", {}, ...lines.map(t => h("li", {}, t))));
}
/* 6학년 3반 나눔 빵 공방(교실 요리 시간) 그림 */
function fn6sBakery() {
  const svg = makeSvg(900, 260);
  svg.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 260, fill: "#FFF4E4", rx: 16 }));
  svg.append(svgEl("rect", { x: 0, y: 190, width: 900, height: 70, fill: "#EED9BC" }));
  /* 현수막 */
  svg.append(svgEl("path", { d: "M250 18 L650 18 L640 40 L650 62 L250 62 L260 40 Z", fill: "#F6C08A", stroke: INK, "stroke-width": 3 }));
  svg.append(txt(450, 49, "6학년 3반 나눔 빵 공방", 22));
  /* 오븐 */
  svg.append(svgEl("rect", { x: 40, y: 92, width: 150, height: 100, rx: 8, fill: "#DCE6EA", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("rect", { x: 58, y: 112, width: 114, height: 60, rx: 6, fill: "#F3D36B", stroke: INK, "stroke-width": 2 }));
  [70, 100, 130, 160].forEach(x => svg.append(svgEl("circle", { cx: x, cy: 102, r: 4, fill: INK })));
  svg.append(txt(115, 214, "오븐", 17));
  /* 작업대와 막대 반죽 */
  svg.append(svgEl("rect", { x: 230, y: 150, width: 300, height: 18, fill: "#C99A64", stroke: INK, "stroke-width": 3 }));
  [250, 500].forEach(x => svg.append(svgEl("rect", { x, y: 168, width: 12, height: 26, fill: "#9C6B3E" })));
  [0, 1, 2].forEach(i => svg.append(svgEl("rect", { x: 250, y: 98 + i * 16, width: 170, height: 11, rx: 5.5, fill: "#F7E2B8", stroke: "#B4610F", "stroke-width": 2 })));
  svg.append(txt(335, 92, "막대 반죽", 15, { fill: "#8A4A0B" }));
  /* 우유와 잼 병 */
  svg.append(svgEl("path", { d: "M445 145 L445 105 L455 92 L475 92 L485 105 L485 145 Z", fill: "#fff", stroke: INK, "stroke-width": 2.5 }));
  svg.append(txt(465, 128, "우유", 13));
  [[500, "#E0545A"], [520, "#7A62C9"]].forEach(([x, c]) => { svg.append(svgEl("rect", { x, y: 118, width: 16, height: 27, rx: 3, fill: c, stroke: INK, "stroke-width": 2 })); svg.append(svgEl("rect", { x: x - 1, y: 112, width: 18, height: 7, fill: "#fff", stroke: INK, "stroke-width": 1.5 })); });
  /* 포장 상자와 리본 */
  svg.append(svgEl("rect", { x: 580, y: 112, width: 110, height: 76, fill: "#FBE6CC", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("rect", { x: 628, y: 112, width: 14, height: 76, fill: "#E36F8C" }));
  svg.append(svgEl("path", { d: "M635 112 q-24 -26 -30 -4 q6 12 30 4 q24 8 30 -4 q-6 -22 -30 4 z", fill: "#F2A7B8", stroke: "#C2486A", "stroke-width": 2 }));
  svg.append(txt(635, 214, "나눔 빵 상자", 16));
  /* 빵 바구니 */
  svg.append(svgEl("path", { d: "M730 150 L860 150 L845 192 L745 192 Z", fill: "#D9A55E", stroke: INK, "stroke-width": 3 }));
  [[760, 142], [795, 136], [830, 142]].forEach(([x, y]) => svg.append(svgEl("ellipse", { cx: x, cy: y, rx: 20, ry: 12, fill: "#E9B872", stroke: "#8A4A0B", "stroke-width": 2 })));
  svg.append(txt(795, 214, "이웃에게 나눌 빵", 16));
  return h("div", { class: "fn6stage" }, svg);
}
/* 상자(바구니) n개, 한 개에 물건 per개 — 7~8차시 */
function fn6sBoxes(n, per, label, kind) {
  const W = 900, bw = Math.min(150, (W - 40) / n - 16), H = 190, svg = makeSvg(W, H);
  const x0 = (W - n * (bw + 16) + 16) / 2;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (bw + 16), y = 40;
    if (kind === "basket") svg.append(svgEl("path", { d: `M${x} ${y + 30} L${x + bw} ${y + 30} L${x + bw - 12} ${y + 110} L${x + 12} ${y + 110} Z`, fill: "#D9A55E", stroke: INK, "stroke-width": 3 }));
    else svg.append(svgEl("rect", { x, y: y + 20, width: bw, height: 90, fill: "#FBE6CC", stroke: INK, "stroke-width": 3 }));
    const cols = Math.ceil(per / 2), cw = (bw - 16) / cols;
    for (let k = 0; k < per; k++) {
      const cx = x + 8 + (k % cols + .5) * cw, cy = y + 52 + Math.floor(k / cols) * 34;
      if (kind === "basket") svg.append(svgEl("circle", { cx, cy, r: Math.min(14, cw / 2 - 2), fill: "#B5764A", stroke: "#6B3E1E", "stroke-width": 2 }));
      else svg.append(svgEl("rect", { x: cx - Math.min(16, cw / 2 - 2), y: cy - 13, width: 2 * Math.min(16, cw / 2 - 2), height: 26, rx: 8, fill: "#F2D29B", stroke: "#8A4A0B", "stroke-width": 2 }));
    }
  }
  svg.append(fn6SvgLine(label, W / 2, 26, 20, { fill: "#5B6B6B" }));
  svg.append(txt(W / 2, H - 14, `${n}개 · 한 개에 ${per}개씩`, 18, { fill: "#5B6B6B" }));
  return h("div", { class: "fn6stage" }, svg);
}
/* 직사각형 상자 바닥(6차시) */
function fn6sRect() {
  const svg = makeSvg(900, 230);
  svg.append(svgEl("rect", { x: 250, y: 40, width: 400, height: 140, fill: "#FBE6CC", stroke: INK, "stroke-width": 4 }));
  svg.append(fn6SvgLine("가로 7 cm", 450, 212, 22));
  svg.append(fn6SvgLine("세로 □ cm", 664, 116, 22, { anchor: "start", fill: "#C8472E" }));
  svg.append(fn6SvgLine("넓이 [52 1/2] cm²", 450, 118, 24));
  return h("div", { class: "fn6stage" }, svg);
}
//@@LESSONS
const UNIT_STORY = { title: "6학년 3반 나눔 빵 공방", lines: [
  "새봄초등학교 6학년 3반은 요리 시간에 ‘나눔 빵 공방’을 열어요. 반장 하윤이와 준서, 서아, 지호, 예린, 태오가 모둠을 나누어 반죽을 나누고, 잼과 설탕을 똑같이 넣고, 포장 리본을 나누어 써요.",
  "막대 반죽과 우유를 똑같이 나누며 (자연수)÷(자연수)의 몫을 분수로 나타내고, 딸기잼·설탕·리본을 나누며 (분수)÷(자연수)와 (대분수)÷(자연수)를 알아봐요.",
  "구운 식빵과 머핀을 상자에 담아 이웃에게 나누고, 주문서 이어달리기 놀이와 나눔 빵 발표회로 배운 것을 정리해요."],
  one: "6학년 3반 나눔 빵 공방 · ●÷▲ = [●/▲]. (분수)÷(자연수)는 분자를 자연수로 나누거나, 크기가 같은 분수로 바꾸거나, (분수)×[1/▲]로 계산해요." };
const UNIT_KEYWORDS = ["나누어지는 수", "나누는 수", "분자", "분모", "●÷▲ = [●/▲]", "몫이 1보다 큰 나눗셈", "가분수", "대분수", "크기가 같은 분수", "분자가 자연수의 배수", "(분수)×[1/▲]", "이중 척도 모델", "자연수 부분과 진분수 부분", "문제해결 4단계", "필요 없는 정보", "거꾸로 확인하기"];
const FN6S_NOTE = ["🥖 막대 반죽 3줄을 모둠원 4명이 똑같이 나누어 꽈배기 만들기", "🥛 우유 5 L를 반죽 그릇 3개에 똑같이 나누어 붓기", "🍓 딸기잼 [6/7] kg을 병 3개에 똑같이 나누어 담기", "🍬 설탕 [2/3] kg을 반죽 4덩이에 똑같이 나누어 넣기", "🎀 포장 리본 [6 3/4] m를 3모둠이 똑같이 나누어 쓰기", "📦 다 구운 식빵과 머핀을 상자에 담아 이웃에게 나누기"];

const LESSONS = [
{
  id: "s1", no: 1, title: "나눔 빵 공방을 열어요", soop: "개념 찾기(S)",
  question: "빵을 똑같이 나누어 이웃과 나눌 때 어떤 나눗셈이 필요할까요?",
  summary: "6학년 3반은 요리 시간에 ‘나눔 빵 공방’을 열어 빵을 구워 학교 지킴이 선생님, 급식실 조리사님, 경로당 어르신께 나누어 드려요. 막대 반죽 3줄을 4명이 나누거나 딸기잼 [6/7] kg을 병 3개에 나누어 담을 때처럼, 몫이 자연수가 아닌 나눗셈과 나누어지는 수가 분수인 나눗셈이 필요해요. 이 단원을 배우기 전에 분수, 크기가 같은 분수, 분수의 크기 비교, (분수)×(분수)를 떠올려 두어요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "우리 반이 요리 시간에 ‘나눔 빵 공방’을 열어요! 반장 하윤이가 나누어 준 공방 준비 쪽지를 보고, 세 칸에 써서 붙여요.", hints: ["쪽지에서 ‘똑같이 나누어’가 나오는 곳을 찾아봐요.", "나누어지는 수가 자연수인 것과 분수인 것이 있어요."],
      render: (b, a) => { b.append(fn6sBakery(), fn6sNote("📜 6학년 3반 나눔 빵 공방 준비 쪽지", FN6S_NOTE));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "쪽지에 ~이 보여요", hint: "쪽지에서 보이는 것", ex: ["막대 반죽 3줄을 4명이 나누는 것처럼 작은 수를 큰 수로 나누는 일이 보여요.", "딸기잼 [6/7] kg을 병 3개에 나누는 것처럼 분수를 자연수로 나누는 일이 보여요."] },
          { t: "생각해요", e: "💭", ph: "~을 나누면 한 사람의 몫은 ~일 것 같아요", hint: "나누어 보면 어떻게 될까?", ex: ["막대 반죽 3줄을 4명이 나누면 한 명이 1줄보다 적게 받을 것 같아요.", "우유 5 L를 그릇 3개에 나누면 그릇 하나에 1 L보다 조금 더 부을 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 계산할까?", hint: "분수의 나눗셈에 대해 궁금한 것", ex: ["3÷4처럼 나누어지는 수가 더 작으면 몫을 어떻게 나타낼까?", "[6 3/4]처럼 대분수는 어떻게 똑같이 나눌까?"] }],
          { ok: "공방 준비에는 똑같이 나누는 일이 가득해요! 이 단원에서 하나씩 알아봐요." }); } },
    { name: "그려 보기 — 밀가루 나누기", inst: "밀가루 2 kg을 다섯 모둠에 똑같이 나누어 주려고 해요. 한 모둠에 줄 밀가루의 양을 구하는 식과 몫을 생각해 보세요.", hints: ["전체 밀가루의 양을 모둠 수로 나누어요.", "2는 5보다 작아서 한 모둠에 1 kg씩도 줄 수 없어요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "한 모둠에 줄 밀가루의 양을 구하는 식을 고르세요.", o: ["2÷5", "5÷2", "2×5"], a: 0, why: { "1": "나누는 순서가 바뀌었어요. 전체 2 kg을 5모둠으로 나누어요.", "2": "곱하면 2 kg보다 많아져요. 똑같이 나누어 주니까 나눗셈이에요." } },
        { q: "2÷5의 몫은 어떤 수일까요?", o: ["0과 1 사이의 수예요", "자연수예요", "나눌 수 없어요"], a: 0, why: { "1": "5×1 = 5라서 2÷5의 몫은 1보다 작아요. 자연수가 아니에요.", "2": "밀가루 2 kg도 다섯 모둠에 똑같이 나눌 수 있어요. 한 모둠이 1 kg보다 적게 받을 뿐이에요." } }],
        { ok: "2÷5의 몫은 1보다 작아서 자연수로 나타낼 수 없어요. 이 단원에서 이런 몫을 분수로 나타내는 방법을 배워요." }),
        { q: "2÷5의 몫이 1보다 작은 까닭을 한 줄로 써 봐요.", ph: "다섯 모둠에 1 kg씩 주려면 ~", help: ["① 다섯 모둠에 1 kg씩 주려면 밀가루가 몇 kg 있어야 하는지 생각해요. → ② 가진 밀가루 2 kg과 견주어요.", "‘다섯 모둠에 1 kg씩 주려면 ~ kg이 있어야 하는데 2 kg밖에 없어서 몫은 1보다 작아요.’ 꼴로 써요."],
          ans: "다섯 모둠에 1 kg씩 주려면 5 kg이 있어야 하는데 2 kg밖에 없어서 한 모둠의 몫은 1 kg보다 작아요." }) },
    { name: "말해 보기 — 공방 속 나눗셈 나누기", inst: "공방에서 나눗셈이 필요한 상황이에요. 상황을 알맞은 식의 종류로 나누어 보세요.", hints: ["나누어지는 수(전체의 양)가 자연수인지 분수인지 살펴봐요.", "[1 1/4] L는 대분수예요. 대분수도 분수예요."],
      render: (b, a) => fn6Sort(b, a, { bins: ["(자연수)÷(자연수)", "(분수)÷(자연수)"], cards: [
        { t: "버터 1개를 6명이 똑같이 나누어 써요.", k: 0 }, { t: "초콜릿 칩 7봉지를 반죽 그릇 2개에 똑같이 나누어 넣어요.", k: 0 },
        { t: "달걀물 [3/5] L를 그릇 2개에 똑같이 나누어 담아요.", k: 1 }, { t: "쿠키 반죽 [8/9] kg을 4덩이로 똑같이 나누어요.", k: 1 },
        { t: "넓이가 [5/6] m²이고 가로가 2 m인 직사각형 식탁보의 세로를 구해요.", k: 1 }, { t: "생크림 [1 1/4] L를 컵 5개에 똑같이 나누어 담아요.", k: 1 }],
        bad: "나누어지는 수를 살펴봐요. 전체의 양이 분수이면 (분수)÷(자연수)예요.", ok: "나누는 수가 자연수인 분수의 나눗셈이 공방 곳곳에 있어요." }) },
    { name: "약속하기 — 분수 떠올리기", inst: "3학년, 5학년 때 배운 분수와 크기가 같은 분수를 떠올려요. 막대에 [2/5]만큼 색칠하고 물음에 답해 보세요.", hints: ["[2/5]는 전체를 똑같이 5로 나눈 것 중의 2예요.", "크기가 같은 분수는 분모와 분자에 0이 아닌 같은 수를 곱하여 만들어요."],
      render: (b, a) => fn6Bars(b, a, { d: 5, bars: [{ name: "[2/5]", k: 2 }], ask: [
        ["[2/5]는 [1/5]이 ", { i: "2" }, "개예요."],
        ["[3/4] = ", { q: [null, ["3", "×", "?2"], ["4", "×", "?2"]] }, " = ", { q: [null, "?6", "8"] }],
        ["크기가 같은 분수는 분모와 분자에 0이 아닌 ", { c: ["같은 수를 곱하여", "서로 다른 수를 곱하여"], a: 0 }, " 만들 수 있어요."]],
        ok: "분수와 크기가 같은 분수를 잘 기억하고 있어요. 이 단원에서 자주 써요." }) },
    { name: "확인하기 — 크기 비교와 곱셈 떠올리기", inst: "5학년 때 배운 분수의 크기 비교와 (분수)×(분수)를 떠올려요.", hints: ["[2/3]와 [3/5]을 분모 15로 통분해 보세요.", "(분수)×(분수)는 분자는 분자끼리, 분모는 분모끼리 곱해요."],
      render: (b, a) => fn6Chain(b, a, [
        ["크기 비교: [2/3] = ", { q: [null, "?10", "15"] }, ", [3/5] = ", { q: [null, "?9", "15"] }, " 이므로 [2/3] ", { c: [">", "<", "="], a: 0 }, " [3/5]"],
        ["[3/4]×[1/5] = ", { q: [null, ["3", "×", "?1"], ["4", "×", "?5"]] }, " = ", { q: [null, "?3", "20"] }],
        ["[5/7]×[1/2] = ", { q: [null, "?5", "14"] }]],
        { ok: "분수의 크기 비교와 곱셈을 잘 기억하고 있어요. 이제 분수의 나눗셈을 배워요.", bad: "통분은 분모와 분자에 같은 수를 곱해 분모를 같게 하는 것이에요. 곱셈은 분자끼리, 분모끼리 곱해요." }) }
  ],
  challenge: { inst: "★ 도전 — 이미 배운 계산과 이 단원에서 새로 배울 계산으로 나누어 보세요.", hints: ["나누어떨어지는 (자연수)÷(자연수)와 분수의 덧셈·곱셈은 이미 배웠어요.", "몫을 분수로 나타내는 나눗셈과 분수를 자연수로 나누는 나눗셈은 이 단원에서 배워요."],
    render: (b, a) => fn6Sort(b, a, { bins: ["이미 배웠어요", "이 단원에서 배워요"], cards: [
      { t: "15÷3", k: 0 }, { t: "[2/3]×[1/4]", k: 0 }, { t: "[3/8]+[1/8]", k: 0 },
      { t: "3÷8의 몫을 분수로", k: 1, why: "3÷8의 몫을 분수로 나타내는 것은 이 단원에서 배워요." }, { t: "[4/9]÷2", k: 1 }, { t: "[2 1/2]÷3", k: 1 }],
      bad: "몫을 분수로 나타내거나 분수를 자연수로 나누는 계산은 이 단원에서 배워요.", ok: "이 단원에서 (자연수)÷(자연수)의 몫을 분수로 나타내고, (분수)÷(자연수)를 계산하는 방법과 원리를 알아봐요!" }) }
},
{
  id: "s2", no: 2, title: "꽈배기 반죽 ― 몫이 1보다 작은 (자연수)÷(자연수)", soop: "개념 구축하기(O)",
  question: "몫이 1보다 작은 (자연수)÷(자연수)의 몫은 어떻게 분수로 나타낼까요?",
  summary: "막대 반죽 1줄을 4명이 똑같이 나누면 한 명은 [1/4]줄을 받아요. 1÷4 = [1/4]이에요. 막대 반죽 3줄을 4명이 똑같이 나누면 한 명은 [1/4]줄이 3개인 [3/4]줄을 받아요. 3÷4 = [3/4]이에요. 3이 4보다 작아도 1을 똑같이 4로 나누면 되니까 나눌 수 있어요. (자연수)÷(자연수)의 몫은 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타낼 수 있습니다. ●÷▲ = [●/▲]",
  steps: [
    { name: "만져 보기 — 막대 반죽 1줄", inst: "준서네 모둠 4명이 꽈배기를 만들어요. 길쭉한 막대 반죽 1줄을 4명이 똑같이 나누어 가지려고 해요. ‘＋’로 반죽을 똑같이 나누고, 한 명이 받을 부분을 골라 보세요.", hints: ["4명에게 똑같이 나누어 주니까 반죽을 똑같이 4칸으로 나누어요.", "한 명은 4칸 중 1칸을 받아요."],
      render: thenWhy((b, a) => fn6Share(b, a, { N: 1, d: 4, unit: "줄", strip: "반죽 1줄", who: "명", one: "한 명", ask: [
        ["구하는 식: ", { c: ["1÷4", "4÷1", "1×4"], a: 0 }],
        ["한 명이 받는 반죽의 양: ", { q: [null, "?1", "?4"] }, "줄"]], ok: "1÷4 = [1/4]이에요. 한 명이 반죽을 [1/4]줄 받아요." }),
        { q: "1÷4의 몫을 [1/4]로 나타낼 수 있는 까닭을 써 봐요.", ph: "반죽 1줄을 똑같이 ~", help: ["① 반죽 1줄을 몇 칸으로 나누었는지 떠올려요. → ② 한 명이 그중 몇 칸을 받는지 써요.", "‘반죽 1줄을 똑같이 ~칸으로 나눈 것 중 ~칸이니까 [1/4]이에요.’ 꼴로 써요."],
          ans: "반죽 1줄을 똑같이 4칸으로 나눈 것 중 1칸을 받으니까 한 명의 몫은 [1/4]줄이에요." }) },
    { name: "그려 보기 — 막대 반죽 3줄", inst: "이번에는 막대 반죽 3줄을 4명이 똑같이 나누어 가지려고 해요. 먼저 규칙을 예상한 다음, 반죽마다 똑같이 나누어 한 칸씩 골라 보세요.", hints: ["반죽 3줄을 각각 똑같이 4칸으로 나누어요.", "반죽마다 한 칸씩, 모두 [1/4]줄이 3개예요."],
      render: ruleFirst((b, a) => fn6Share(b, a, { N: 3, d: 4, unit: "줄", strip: "반죽 1줄", who: "명", one: "한 명", ask: [
        ["구하는 식: ", { c: ["3÷4", "4÷3", "3×4"], a: 0 }],
        ["한 명의 몫은 [1/4]줄이 ", { i: "3" }, "개예요."],
        ["3÷4 = ", { q: [null, "?3", "?4"] }, " (줄)"]], ok: "3÷4 = [3/4]이에요. 한 명이 반죽을 [3/4]줄 받아요." }),
        { q: "막대 반죽 3줄을 4명이 똑같이 나누면 한 명의 몫은 얼마일까요? 몫을 분수로 나타내는 규칙을 예상해 봐요.", ph: "내 규칙: 3÷4의 몫은 ~", help: ["① 반죽 1줄을 4명이 나누면 한 명이 [1/4]줄을 받았어요. → ② 반죽이 3줄이면 한 명이 [1/4]줄을 몇 개 받을지 생각해요.", "‘내 규칙: 3÷4의 몫은 [1/4]이 ~개이니까 ~이에요.’ 꼴로 써요."],
          ans: "3÷4의 몫은 [1/4]이 3개이니까 [3/4]이에요. 나누어지는 수 3을 분자, 나누는 수 4를 분모로 써요." }) },
    { name: "말해 보기 — 준서의 생각 고치기", inst: "준서가 말했어요. “3에서 4를 뺄 수 없으니까 3÷4는 나눌 수 없어.” 1÷4의 몫을 이용하여 준서의 생각을 고쳐 보세요.", hints: ["3은 1이 3개예요.", "1÷4 = [1/4]이니까 3÷4는 [1/4]이 몇 개일까요?"],
      render: thenWhy((b, a) => fn6Chain(b, a, [
        ["1÷4 = ", { q: [null, "?1", "?4"] }, "이고, 3은 1이 ", { i: "3" }, "개이므로 3÷4는 [1/4]이 ", { i: "3" }, "개입니다."],
        ["따라서 3÷4 = ", { q: [null, "?3", "?4"] }, "입니다."],
        ["준서의 말은 ", { c: ["틀렸어요", "맞아요"], a: 0 }, ". 반죽 1줄을 똑같이 4로 나누면 되니까요."]],
        { ok: "3÷4는 [1/4]이 3개이므로 [3/4]이에요. 3이 4보다 작아도 나눌 수 있어요.", bad: "빨간 칸을 다시 생각해 봐요. 1÷4 = [1/4]이에요." }),
        { q: "준서에게 3÷4를 나눌 수 있다고 설명하는 말을 써 봐요.", ph: "준서야, 반죽 1줄을 ~", help: ["① 반죽 1줄을 4명이 나눈 몫을 떠올려요. → ② 반죽 3줄이면 그 몫이 몇 개인지 말해요.", "‘준서야, 반죽 1줄을 똑같이 4로 나누면 [1/4]줄이고, 3줄이면 ~가 3개라서 ~야.’ 꼴로 써요."],
          ans: "준서야, 반죽 1줄을 똑같이 4로 나누면 한 명이 [1/4]줄씩 받고, 3줄이면 [1/4]줄이 3개라서 한 명의 몫은 [3/4]줄이야." }) },
    { name: "약속하기 — ●÷▲ = [●/▲]", inst: "(자연수)÷(자연수)의 몫을 분수로 나타내는 방법을 약속해요.", hints: ["3÷4 = [3/4]에서 3과 4는 각각 분수의 어디에 있나요?"],
      render: (b, a) => blanks(b, a, ["(자연수)÷(자연수)의 몫은 나누어지는 수를 ", { o: ["분자", "분모"], a: 0 }, ", 나누는 수를 ", { o: ["분모", "분자"], a: 0 }, "로 하는 분수로 나타낼 수 있습니다. ●÷▲ = ", { o: ["[●/▲]", "[▲/●]"], a: 0 }], { ok: "(자연수)÷(자연수)의 몫은 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타낼 수 있습니다." }) },
    { name: "확인하기 — 공방 재료 나누기", inst: "나눗셈의 몫을 분수로 나타내어 보세요.", hints: ["나누어지는 수를 분자, 나누는 수를 분모에 써요.", "3÷10 = [3/10]이에요."],
      render: (b, a) => fn6Calc(b, a, [{ e: "1÷7", a: "1/7" }, { e: "5÷8", a: "5/8" }, { e: "2÷9", a: "2/9" }, { e: "4÷13", a: "4/13" },
        { q: "버터 3개를 10모둠에 똑같이 나누어 주려고 해요. 한 모둠에 줄 버터는 몇 개일까요?", x: "3÷10", a: "3/10", unit: "개", lab: "3÷10 =" }], { bad: "다시 생각해 봐요. 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 써요." }) }
  ],
  challenge: { inst: "★ 도전 — 공방 퀴즈를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["5÷12의 몫은 나누어지는 수 5가 분자예요.", "몫이 가장 작으려면 가장 작은 수를 가장 큰 수로 나누어요."],
    render: (b, a) => fn6Both(b, a, [
      (x, y) => fn6Calc(x, y, [
        { e: "1÷12", a: "1/12" }, { e: "7÷15", a: "7/15" },
        { q: "몫을 분수로 잘못 나타낸 것을 고르세요.", pick: ["㉠ 5÷12 = [12/5]", "㉡ 4÷9 = [4/9]"], a: 0, why: { "1": "4÷9 = [4/9]는 옳아요. 나누어지는 수 4가 분자예요." } },
        { q: "식용유 2 L를 병 9개에 똑같이 나누어 담았어요. 한 병에 담은 식용유는 몇 L일까요?", x: "2÷9", a: "2/9", unit: "L", lab: "2÷9 =" }], { bad: "다시 생각해 봐요. 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 써요." }),
      (x, y) => fn6Build(x, y, { cards: [3, 8, 4, 7], tip: "수 카드 2장을 골라 몫이 가장 작은 (자연수)÷(자연수)를 만들고 몫을 써요.", boards: [{ kind: "nat", goal: "min", label: "몫이 가장 작은 나눗셈", msg: "몫이 더 작은 나눗셈을 만들 수 있어요. 나누어지는 수는 작게, 나누는 수는 크게 해요." }], ok: "가장 작은 수를 가장 큰 수로 나누면 몫이 가장 작아요. 3÷8 = [3/8]이에요." })],
      { titles: ["① 몫을 분수로", "② 수 카드 3, 8, 4, 7"], ok: "몫이 1보다 작은 (자연수)÷(자연수)의 몫을 분수로 잘 나타냈어요!" }) }
},
{
  id: "s3", no: 3, title: "우유 붓기 ― 몫이 1보다 큰 (자연수)÷(자연수)", soop: "개념 구축하기(O)",
  question: "몫이 1보다 큰 (자연수)÷(자연수)의 몫은 어떻게 분수로 나타낼까요?",
  summary: "우유 5 L를 반죽 그릇 3개에 똑같이 나누어 부으면 그릇 한 개에 [1 2/3] L(= [5/3] L)를 부어요. 방법 1은 1 L씩 나누어 붓고 남은 2 L를 각각 3으로 똑같이 나누어 5÷3 = 1 + [2/3] = [1 2/3]이고, 방법 2는 우유 5 L를 각각 3으로 똑같이 나누어 [1/3]이 5개이므로 5÷3 = [5/3]예요. 두 방법의 몫은 같아요. 몫이 1보다 커도 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타낼 수 있고, 대분수로 나타내지 않아도 돼요.",
  steps: [
    { name: "만져 보기 — 방법 1로 붓기", inst: "서아는 우유 5 L를 반죽 그릇 3개에 똑같이 나누어 부었어요. 그릇 한 개에 부은 우유의 양을 방법 1로 구해 봐요. 먼저 1 L씩 나누어 붓고, 남은 우유를 똑같이 나누어 보세요.", hints: ["우유 3 L는 그릇 3개에 1 L씩 나누어 부을 수 있어요.", "남은 2 L를 각각 똑같이 3칸으로 나누어 한 칸씩 부어요."],
      render: (b, a) => fn6Share(b, a, { N: 5, d: 3, mode: "whole", unit: " L", strip: "우유 1 L", who: "개", one: "그릇 한 개", tip: "먼저 그릇 한 개에 부을 1 L짜리를 누르고, ‘＋’로 남은 우유를 똑같이 나눈 다음 남은 띠마다 한 칸씩 골라요.", ask: [
        ["구하는 식: ", { c: ["5÷3", "3÷5", "5×3"], a: 0 }],
        ["5÷3 = (3÷3) + (2÷3) = ", { i: "1" }, " + ", { q: [null, "?2", "?3"] }, " = ", { q: ["?1", "?2", "3"] }]], ok: "1 L씩 나누어 붓고 남은 2 L를 3으로 나누었어요. 5÷3 = [1 2/3]예요." }) },
    { name: "그려 보기 — 방법 2로 붓기", inst: "이번에는 방법 2로 구해 봐요. 우유 5 L를 각각 똑같이 3칸으로 나누어 그릇 한 개에 부을 양을 골라 보세요.", hints: ["1 L마다 똑같이 3칸으로 나누어 한 칸씩 골라요.", "[1/3] L가 5개예요."],
      render: thenWhy((b, a) => fn6Share(b, a, { N: 5, d: 3, unit: " L", strip: "우유 1 L", who: "개", one: "그릇 한 개", ask: [
        ["5÷3 = (1÷3)+(1÷3)+(1÷3)+(1÷3)+(1÷3) = [1/3]+[1/3]+[1/3]+[1/3]+[1/3] = ", { q: [null, "?5", "?3"] }],
        ["방법 1의 몫 [1 2/3]와 방법 2의 몫 [5/3]는 ", { c: ["같아요", "달라요"], a: 0 }, "."]], ok: "5÷3 = [5/3] = [1 2/3]예요. 그릇 한 개에 부은 우유는 [1 2/3] L(= [5/3] L)예요." }),
        { q: "방법 1과 방법 2의 몫이 같은 까닭을 써 봐요.", ph: "두 방법 모두 ~", help: ["① 두 방법 모두 우유 몇 L를 그릇 몇 개에 나누었는지 떠올려요. → ② [1 2/3]가 [1/3]이 몇 개인지 세어 [5/3]와 견주어요.", "‘두 방법 모두 우유 5 L를 그릇 3개에 똑같이 나누었고, [1 2/3]는 [1/3]이 ~개라서 몫이 같아요.’ 꼴로 써요."],
          ans: "두 방법 모두 우유 5 L를 그릇 3개에 똑같이 나누었고, [1 2/3]는 [1/3]이 5개인 [5/3]와 크기가 같아서 몫이 같아요." }) },
    { name: "말해 보기 — 피자 도우 나누기", inst: "모양과 크기가 같은 피자 도우 7장을 4모둠이 똑같이 나누어 쓰려고 해요. 방법 1과 방법 2 중 하나를 골라 한 모둠이 쓸 수 있는 피자 도우의 양을 분수로 나타내고, 친구에게 설명해 보세요.", hints: ["방법 1: 도우를 1장씩 나누어 주고 남은 3장을 각각 4로 똑같이 나누어요.", "방법 2: 도우 7장을 각각 4로 똑같이 나누어 한 칸씩 골라요."],
      render: thenWhy((b, a) => fn6Share(b, a, { N: 7, d: 4, mode: "whole", choose: true, strip: "도우 1장", unit: "장", who: "모둠", one: "한 모둠", tip: "방법을 고른 다음 띠를 나누고 한 모둠의 몫을 골라요.", ask: [
        ["구하는 식: ", { c: ["7÷4", "4÷7", "7×4"], a: 0 }],
        ["한 모둠이 쓸 수 있는 피자 도우의 양: ", { f: "7/4" }, "장"]], ok: "방법 1로는 1 + [3/4] = [1 3/4]장, 방법 2로는 [1/4]장이 7개라서 [7/4]장이에요. 두 방법의 몫은 같아요." }),
        { q: "내가 고른 방법으로 한 모둠의 몫을 구한 차례를 써 봐요.", ph: "나는 방법 ~로 ~", help: ["① 내가 고른 방법이 1인지 2인지 써요. → ② 도우를 어떻게 나누었는지 차례대로 써요.", "‘나는 방법 1로 도우를 1장씩 나누어 주고 남은 ~장을 각각 4로 나누었어요.’ 또는 ‘나는 방법 2로 도우 7장을 각각 ~로 나누었어요.’ 꼴로 써요."],
          ans: "나는 방법 1로 도우를 한 모둠에 1장씩 나누어 주고, 남은 3장을 각각 똑같이 4로 나누어 [1/4]장씩 3번 더 주었어요. 그래서 한 모둠의 몫은 1 + [3/4] = [1 3/4]장(= [7/4]장)이에요." }) },
    { name: "약속하기 — 몫이 1보다 클 때", inst: "몫이 1보다 큰 (자연수)÷(자연수)의 몫을 분수로 나타내는 방법을 정리해요.", hints: ["5÷3 = [5/3]에서 5와 3이 어디에 있는지 보세요."],
      render: (b, a) => blanks(b, a, ["몫이 1보다 큰 (자연수)÷(자연수)의 몫도 나누어지는 수를 ", { o: ["분자", "분모"], a: 0 }, ", 나누는 수를 ", { o: ["분모", "분자"], a: 0 }, "로 하는 분수로 나타낼 수 있습니다. 9÷4 = ", { o: ["[9/4]", "[4/9]"], a: 0 }, " = [2 1/4]이고, 대분수로 나타내지 ", { o: ["않아도 돼요", "않으면 틀려요"], a: 0 }, "."], { ok: "(자연수)÷(자연수)의 몫은 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타낼 수 있어요." }) },
    { name: "확인하기 — 공방 재료 나누기", inst: "나눗셈의 몫을 분수로 나타내어 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["9÷4 = [9/4]예요.", "15÷7 = [15/7] = [2 1/7]이에요."],
      render: (b, a) => fn6Calc(b, a, [{ e: "9÷4", a: "2 1/4" }, { e: "11÷3", a: "3 2/3" }, { e: "15÷7", a: "2 1/7" }, { e: "17÷6", a: "2 5/6" }], { bad: "다시 생각해 봐요. 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 써요. 대분수로 쓸 때는 자연수 부분과 분수 부분을 잘 나누어요." }) }
  ],
  challenge: { inst: "★ 도전 — 공방 퀴즈를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["나누어지는 수가 나누는 수보다 크면 몫이 1보다 커요.", "어떤 수 × 6 = 66이면 어떤 수는 66÷6이에요."],
    render: (b, a) => fn6Both(b, a, [
      (x, y) => quiz(x, y, [
        { q: "몫이 1보다 큰 나눗셈을 모두 고르세요.", o: ["7÷9", "10÷7", "13÷6"], a: [1, 2], why: { "0": "7이 9보다 작으므로 7÷9 = [7/9]은 1보다 작아요." } },
        { q: "11÷4 ○ 17÷6 에서 ○ 안에 알맞은 것은?", o: [">", "<", "="], a: 1, why: { "0": "11÷4 = [2 3/4], 17÷6 = [2 5/6]예요. 자연수 부분이 같으니 [3/4] = [9/12]와 [5/6] = [10/12]을 비교해요.", "2": "11÷4 = [2 3/4], 17÷6 = [2 5/6]예요. [3/4] = [9/12], [5/6] = [10/12]이라서 같지 않아요." } },
        { q: "19÷5 ○ 22÷7 에서 ○ 안에 알맞은 것은?", o: [">", "<", "="], a: 0, why: { "1": "19÷5 = [3 4/5], 22÷7 = [3 1/7]이에요. 자연수 부분이 같으니 분수 부분을 비교해요.", "2": "19÷5 = [3 4/5], 22÷7 = [3 1/7]이에요. 분수 부분이 달라요." } }]),
      (x, y) => fn6Calc(x, y, [
        { e: "8÷5", a: "1 3/5" }, { e: "20÷9", a: "2 2/9" },
        { q: "넓이가 27 cm²이고 가로가 4 cm인 직사각형 모양 쿠키가 있어요. 이 쿠키의 세로는 몇 cm일까요?", x: "27÷4", a: "6 3/4", unit: "cm", lab: "27÷4 =" },
        { q: "어떤 수를 6으로 나누어야 할 것을 잘못하여 곱했더니 66이 되었어요. 바르게 계산한 몫은?", x: "11÷6", a: "1 5/6", lab: "몫", why: { "6/11": "어떤 수는 66÷6 = 11이에요. 11÷6의 몫은 11이 분자예요." } }], { bad: "다시 생각해 봐요. 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 써요." })],
      { titles: ["① 몫의 크기", "② 몫을 분수로"], ok: "몫이 1보다 큰 (자연수)÷(자연수)도 잘 해결했어요!" }) }
},
{
  id: "s4", no: 4, title: "딸기잼 담기 ― (분수)÷(자연수)", soop: "개념 구축하기(O)",
  question: "(분수)÷(자연수)는 어떻게 계산할까요?",
  summary: "딸기잼 [6/7] kg을 병 3개에 똑같이 나누어 담으면 한 병에 [2/7] kg을 담아요. [6/7]은 [1/7]이 6개이고 6÷3 = 2이므로 [6/7]÷3 = [6÷3/7] = [2/7]예요. 블루베리잼 [2/5] kg처럼 분자 2가 3으로 나누어떨어지지 않으면 [2/5]를 크기가 같은 분수 [6/15]으로 바꾸어 [6/15]÷3 = [6÷3/15] = [2/15]로 계산해요. 분자가 자연수의 배수인 경우에는 분자를 자연수로 나누어 계산하고, 배수가 아닌 경우에는 크기가 같은 분수 중에서 분자가 자연수의 배수인 분수로 바꾸어 계산합니다.",
  steps: [
    { name: "만져 보기 — 딸기잼 나누어 담기", inst: "예린이네 모둠이 딸기잼 [6/7] kg을 만들었어요. 이 잼을 병 3개에 똑같이 나누어 담으려고 해요. 색칠한 [6/7]을 3묶음으로 나눈 것 중 한 묶음을 골라 보세요.", hints: ["[6/7]은 [1/7]이 6개인 수예요.", "6칸을 3묶음으로 나누면 한 묶음은 2칸이에요."],
      render: thenWhy((b, a) => fn6Div(b, a, { A: "6/7", k: 3, unit: " kg", aName: "딸기잼 [6/7] kg", ask: [
        ["구하는 식: ", { c: ["[6/7]÷3", "[6/7]×3", "[3/7]÷6"], a: 0 }],
        ["[6/7]은 [1/7]이 ", { i: "6" }, "개인 수예요. 6÷3 = ", { i: "2" }, "이므로 [6/7]÷3은 [1/7]이 ", { i: "2" }, "개예요."],
        ["[6/7]÷3 = ", { q: [null, ["6", "÷", "?3"], "7"] }, " = ", { q: [null, "?2", "7"] }]], ok: "한 병에 담은 딸기잼은 [2/7] kg이에요. 분자가 나누는 수의 배수이면 분자를 나누어요." }),
        { q: "[6/7]÷3에서 분자 6만 3으로 나누어도 되는 까닭을 써 봐요.", ph: "[6/7]은 [1/7]이 ~", help: ["① [6/7]이 [1/7]이 몇 개인지 생각해요. → ② 그 개수를 3묶음으로 나누면 한 묶음에 몇 개인지 써요.", "‘[6/7]은 [1/7]이 6개이니까 3묶음으로 나누면 [1/7]이 ~개가 되어 ~예요.’ 꼴로 써요."],
          ans: "[6/7]은 [1/7]이 6개이니까 3묶음으로 나누면 한 묶음은 [1/7]이 2개가 되어 [2/7]예요. 조각의 크기 [1/7]은 그대로라서 분자만 나누면 돼요." }) },
    { name: "그려 보기 — 블루베리잼 나누어 담기", inst: "블루베리잼 [2/5] kg은 작은 병 3개에 똑같이 나누어 담으려고 해요. 색칠한 칸이 2칸이라 3묶음으로 나눌 수 없어요. 먼저 규칙을 예상한 다음, 각 칸을 똑같이 나누어 분자가 3으로 나누어떨어지게 만들어 보세요.", hints: ["각 칸을 3칸으로 나누면 [2/5]는 [6/15]이 돼요.", "6칸을 3묶음으로 나누면 한 묶음은 2칸이에요."],
      render: ruleFirst((b, a) => fn6Div(b, a, { A: "2/5", k: 3, m: 3, unit: " kg", aName: "블루베리잼 [2/5] kg", ask: [
        ["[2/5] = ", { q: [null, ["2", "×", "?3"], ["5", "×", "?3"]] }, " = ", { q: [null, "?6", "15"] }],
        ["[2/5]÷3 = [6/15]÷3 = ", { q: [null, ["6", "÷", "?3"], "15"] }, " = ", { q: [null, "?2", "15"] }],
        ["[2/5]÷3의 몫과 [6/15]÷3의 몫은 ", { c: ["서로 같아요", "서로 달라요"], a: 0 }, "."]], ok: "분자가 3으로 나누어떨어지도록 [2/5]와 크기가 같은 분수 [6/15]으로 바꾸었어요. [2/5]÷3 = [2/15]예요." }),
        { q: "분자 2가 3으로 나누어떨어지지 않을 때 [2/5]÷3을 어떻게 계산하면 좋을지 예상해 봐요.", ph: "내 규칙: 분자가 나누어떨어지지 않으면 ~", help: ["① 5학년 때 배운 크기가 같은 분수 만들기를 떠올려요. → ② 분자가 3의 배수가 되려면 분모와 분자에 무엇을 곱하면 좋을지 생각해요.", "‘내 규칙: 분자가 나누어떨어지지 않으면 분모와 분자에 ~을 곱하여 크기가 같은 분수로 바꾸고 분자를 나누어요.’ 꼴로 써요."],
          ans: "분자가 나누어떨어지지 않으면 분모와 분자에 나누는 수 3을 곱하여 [6/15]처럼 분자가 3의 배수인 크기가 같은 분수로 바꾼 다음 분자를 3으로 나누어요. [2/5]÷3 = [6/15]÷3 = [2/15]예요." }) },
    { name: "말해 보기 — 어떻게 계산하면 편리할까", inst: "(분수)÷(자연수)를 어떻게 계산하면 편리한지 친구와 이야기해 보세요.", hints: ["[4/7]÷3: 분자 4는 3으로 나누어떨어지지 않아요. 분자가 3의 배수가 되게 바꾸어요.", "[8/14]의 분자 8은 3의 배수가 아니에요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "[9/10]÷3은 어떻게 계산하면 편리할까요?", o: ["분자 9를 3으로 나누어 [3/10]", "분모 10을 3으로 나누어요", "크기가 같은 분수로 꼭 바꾸어야 해요"], a: 0, why: { "1": "분모를 나누면 안 돼요. 9는 3의 배수이니 분자를 3으로 나누어요.", "2": "9는 3의 배수라서 바로 분자를 나눌 수 있어요." } },
        { q: "[4/7]÷3을 계산하려면 [4/7]를 어떤 분수로 바꾸면 좋을까요?", o: ["[12/21]", "[8/14]", "[4/21]"], a: 0, why: { "1": "[8/14]의 분자 8은 3으로 나누어떨어지지 않아요.", "2": "[4/21]는 [4/7]와 크기가 달라요." } },
        { q: "[4/7]÷3의 몫을 고르세요.", o: ["[4/21]", "[12/7]", "[4/3]"], a: 0, why: { "1": "[4/7]×3을 계산했어요. [12/21]÷3 = [12÷3/21]이에요.", "2": "분모를 3으로 나누면 안 돼요. 3으로 나누면 몫은 [4/7]보다 작아야 해요." } }],
        { ok: "분자가 자연수의 배수이면 분자를 나누고, 아니면 분자가 자연수의 배수인 크기가 같은 분수로 바꾸어 계산해요." }),
        { q: "[4/7]÷3에서 [4/7]를 [12/21]로 바꾼 까닭을 써 봐요.", ph: "분자 4는 ~", help: ["① 분자 4가 3으로 나누어떨어지는지 살펴봐요. → ② [12/21]의 분자는 3으로 나누어떨어지는지 견주어요.", "‘분자 4는 3으로 나누어떨어지지 않아서, 크기는 같고 분자가 ~의 배수인 [12/21]로 바꾸었어요.’ 꼴로 써요."],
          ans: "분자 4는 3으로 나누어떨어지지 않아서, [4/7]와 크기가 같고 분자가 3의 배수인 [12/21]로 바꾸었어요. 그러면 [12/21]÷3 = [4/21]로 계산할 수 있어요." }) },
    { name: "약속하기 — (분수)÷(자연수)", inst: "(분수)÷(자연수)의 계산 방법을 약속해요.", hints: ["[6/7]÷3과 [2/5]÷3을 어떻게 계산했는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["분자가 자연수의 배수인 경우에는 ", { o: ["분자를 자연수로 나누어", "분모를 자연수로 나누어"], a: 0 }, " 계산합니다. 분자가 자연수의 배수가 아닌 경우에는 크기가 같은 분수 중에서 ", { o: ["분자가 자연수의 배수인 분수로", "분모가 가장 작은 분수로"], a: 0 }, " 바꾸어 계산합니다."], { ok: "분자가 자연수의 배수이면 분자를 나누고, 아니면 크기가 같은 분수로 바꾸어 계산해요." }) },
    { name: "확인하기 — 잼과 포장 끈", inst: "계산해 보세요. 그리고 포장 끈 문제를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["[5/8]÷2 = [10/16]÷2, [5/9]÷4 = [20/36]÷4예요.", "3÷5는 나누어떨어지지 않으므로 [3/4]을 [15/20]로 바꾸어요."],
      render: (b, a) => fn6Both(b, a, [
        (x, y) => fn6Calc(x, y, [{ e: "[8/11]÷4", a: "2/11" }, { e: "[5/8]÷2", a: "5/16" }, { e: "[12/13]÷3", a: "4/13" }, { e: "[5/9]÷4", a: "5/36" }]),
        (x, y) => fn6Chain(x, y, [
          ["포장 끈 [3/4] m를 5도막으로 똑같이 잘랐어요. 구하는 식: ", { c: ["[3/4]÷5", "[3/4]×5", "5÷4"], a: 0 }],
          ["3÷5는 나누어떨어지지 않으므로 [3/4]을 ", { q: [null, "?15", "20"] }, "로 바꾸어요."],
          ["[3/4]÷5 = [15/20]÷5 = ", { q: [null, ["15", "÷", "?5"], "20"] }, " = ", { q: [null, "?3", "20"] }],
          ["포장 끈 한 도막은 ", { q: [null, "?3", "20"] }, " m예요."]], { ok: "포장 끈 한 도막은 [3/20] m예요." })],
        { titles: ["① 계산하기", "② 포장 끈 한 도막"], ok: "(분수)÷(자연수)의 계산 원리를 이해하고 식을 세워 계산했어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 공방 퀴즈를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["[5/8]÷3: 분자 5가 3의 배수가 되도록 [15/24]로 바꾸어요.", "[2/3] = [10/15]이니 [8/15]이 더 작아요."],
    render: (b, a) => fn6Both(b, a, [
      (x, y) => fn6Chain(x, y, [
        ["[12/17]÷6 = ", { q: [null, ["12", "÷", "?6"], "17"] }, " = ", { q: [null, "?2", "17"] }],
        ["[5/8]÷3 = ", { q: [null, "?15", "24"] }, "÷3 = ", { q: [null, ["?15", "÷", "3"], "24"] }, " = ", { q: [null, "?5", "24"] }]]),
      (x, y) => fn6Calc(x, y, [
        { e: "[3/11]÷4", a: "3/44" },
        { q: "[8/15], [2/3], 6 중에서 가장 작은 수를 가장 큰 수로 나눈 몫을 구하세요.", x: "[8/15]÷6", a: "4/45", lab: "몫" },
        { q: "바닐라 시럽 [9/13] L를 병 3개에 똑같이 나누어 담았어요. 한 병에 담은 시럽은 몇 L일까요?", x: "[9/13]÷3", a: "3/13", unit: "L", lab: "[9/13]÷3 =" },
        { q: "[5/12]÷4에 알맞은 문제예요. “버터 [5/12] kg을 반죽 4덩이에 똑같이 나누어 넣었습니다. 반죽 한 덩이에 넣은 버터는 몇 kg일까요?”", x: "[5/12]÷4", a: "5/48", unit: "kg", lab: "[5/12]÷4 =" }])],
      { titles: ["① 빈칸 채우기", "② 문제 해결"], ok: "(분수)÷(자연수)를 정확하게 계산했어요!" }) }
},
{
  id: "s5", no: 5, title: "설탕 넣기 ― (분수)÷(자연수)를 분수의 곱셈으로", soop: "개념 구축하기(O)",
  question: "(분수)÷(자연수)를 분수의 곱셈으로 어떻게 나타낼까요?",
  summary: "설탕 [2/3] kg을 반죽 4덩이에 똑같이 나누어 넣으면 한 덩이에 [2/12] kg(= [1/6] kg)을 넣어요. [2/3]÷4는 [2/3]를 4등분한 것 중의 하나이므로 [2/3]의 [1/4]이에요. 그래서 [2/3]÷4 = [2/3]×[1/4] = [2/12]예요. ÷4와 ×[1/4]의 의미는 같아요. (분수)÷(자연수)를 (분수)×[1/(자연수)]로 나타내어 계산할 수 있습니다. ■÷▲ = ■×[1/▲]",
  steps: [
    { name: "만져 보기 — 설탕 나누어 넣기", inst: "지호는 설탕 [2/3] kg을 반죽 4덩이에 똑같이 나누어 넣으려고 해요. 반죽 한 덩이에 넣을 설탕의 양을 알아봐요. 넓이가 1인 정사각형을 설탕 1 kg이라고 생각해요.", hints: ["먼저 세로로 3등분하여 2칸을 색칠해요([2/3] kg).", "그다음 가로로 4등분하여 그중 1줄에 빗금을 그어요."],
      render: thenWhy((b, a) => fn6Area(b, a, { whole: "설탕 1 kg", stages: [{ dir: "v", d: 3, n: 2, t: "설탕 [2/3] kg 색칠하기" }, { dir: "h", d: 4, n: 1, t: "그것을 4등분한 것 중 하나에 빗금" }], ask: [
        ["구하는 식: ", { c: ["[2/3]÷4", "[2/3]×4", "[4/3]÷2"], a: 0 }],
        ["빗금 친 부분은 전체를 ", { i: "12" }, "칸으로 나눈 것 중 ", { i: "2" }, "칸이에요."],
        ["반죽 한 덩이에 넣을 설탕: [2/3]÷4 = ", { f: "2/12" }, " (kg)"]], ok: "빗금 친 부분은 [2/3] kg의 [1/4]만큼이에요! 한 덩이에 [2/12] kg(= [1/6] kg)을 넣어요." }),
        { q: "빗금 친 부분이 [2/3]÷4의 몫인 까닭을 써 봐요.", ph: "색칠한 [2/3]를 4등분한 것 중 ~", help: ["① 색칠한 부분이 무엇을 나타내는지 생각해요. → ② 빗금 친 부분이 색칠한 부분의 얼마만큼인지 써요.", "‘색칠한 [2/3]를 4등분한 것 중 하나에 빗금을 그었으니 빗금 친 부분은 [2/3]의 ~이고, 그것이 [2/3]÷4예요.’ 꼴로 써요."],
          ans: "색칠한 [2/3]를 똑같이 4등분한 것 중 하나에 빗금을 그었으니 빗금 친 부분은 [2/3]의 [1/4]이고, 이것이 [2/3]를 4로 나눈 몫 [2/3]÷4예요." }) },
    { name: "그려 보기 — [4/5]÷2를 곱셈으로", inst: "이번에는 [4/5]÷2를 그림으로 나타내고 분수의 곱셈으로 계산해 봐요. 먼저 ÷2를 곱셈으로 바꾸는 규칙을 예상한 다음, 정사각형을 나누어 보세요.", hints: ["세로로 5등분하여 4칸을 색칠하고, 가로로 2등분하여 1줄에 빗금을 그어요.", "[4/5]÷2는 [4/5]의 [1/2]이에요."],
      render: ruleFirst((b, a) => fn6Area(b, a, { stages: [{ dir: "v", d: 5, n: 4, t: "[4/5] 색칠하기" }, { dir: "h", d: 2, n: 1, t: "그것을 2등분한 것 중 하나에 빗금" }], ask: [
        ["[4/5]÷2 = [4/5]×", { q: [null, "?1", "?2"] }, " = ", { q: [null, ["4", "×", "?1"], ["5", "×", "?2"]] }, " = ", { q: [null, "?4", "10"] }]], ok: "[4/5]÷2 = [4/5]×[1/2] = [4/10]예요. 약분하면 [2/5]예요." }),
        { q: "÷2를 곱셈으로 바꾸면 무엇을 곱하게 될지 예상해 봐요.", ph: "내 규칙: ÷2는 ~를 곱하는 것과 같아요", help: ["① 2등분한 것 중의 하나는 전체의 얼마인지 생각해요. → ② 그래서 ÷2 대신 무엇을 곱하면 될지 써요.", "‘내 규칙: ÷2는 [1/2]을 곱하는 것과 같아요. 2등분한 것 중 하나는 ~이니까요.’ 꼴로 써요."],
          ans: "÷2는 ×[1/2]과 같아요. [4/5]를 2등분한 것 중 하나는 [4/5]의 [1/2]이니까 [4/5]÷2 = [4/5]×[1/2] = [4/10]예요." }) },
    { name: "말해 보기 — ÷4와 ×[1/4]", inst: "÷4와 ×[1/4]의 의미를 비교하여 친구에게 설명해 보세요.", hints: ["4등분한 것 중의 하나는 [1/4]이에요.", "[2/3]÷4 = [2/3]×[1/4]이에요."],
      render: thenWhy((b, a) => fn6Chain(b, a, [
        ["[2/3]÷4의 몫은 [2/3]를 4등분한 것 중의 하나이므로 [2/3]의 ", { q: [null, "?1", "?4"] }, "입니다."],
        ["따라서 [2/3]÷4는 [2/3]×", { q: [null, "?1", "?4"] }, "로 나타낼 수 있습니다."],
        ["[2/3]÷4 = [2/3]×[1/4] = ", { f: "2/12" }],
        ["÷4와 ×[1/4]의 의미는 ", { c: ["같아요", "달라요"], a: 0 }, "."]],
        { ok: "[2/3]÷4는 [2/3]를 똑같이 4로 나눈 것 중 하나이고, [2/3]×[1/4]은 [2/3]를 4등분한 것 중 하나예요. ÷4와 ×[1/4]의 의미는 같아요." }),
        { q: "÷4와 ×[1/4]의 의미가 같은 까닭을 써 봐요.", ph: "[2/3]÷4는 ~이고 [2/3]×[1/4]은 ~", help: ["① [2/3]÷4가 무엇을 뜻하는지 써요. → ② [2/3]×[1/4]이 무엇을 뜻하는지 써서 견주어요.", "‘[2/3]÷4는 [2/3]를 똑같이 4로 나눈 것 중 하나이고, [2/3]×[1/4]은 [2/3]의 ~이라서 같아요.’ 꼴로 써요."],
          ans: "[2/3]÷4는 [2/3]를 똑같이 4로 나눈 것 중 하나이고, [2/3]×[1/4]은 [2/3]를 4등분한 것 중 하나인 [2/3]의 [1/4]이라서 두 의미가 같아요." }) },
    { name: "약속하기 — ■÷▲ = ■×[1/▲]", inst: "(분수)÷(자연수)를 분수의 곱셈으로 나타내는 방법을 약속해요.", hints: ["[2/3]÷4 = [2/3]×[1/4]에서 ÷4가 무엇으로 바뀌었나요?"],
      render: (b, a) => blanks(b, a, ["(분수)÷(자연수)를 (분수)×", { o: ["[1/(자연수)]", "(자연수)"], a: 0 }, "로 나타내어 계산할 수 있습니다. ■÷▲ = ■×", { o: ["[1/▲]", "▲"], a: 0 }], { ok: "(분수)÷(자연수)를 (분수)×[1/▲]로 나타내어 계산할 수 있습니다." }) },
    { name: "확인하기 — 곱셈으로 계산하고 수 카드 나눗셈 만들기", inst: "(분수)÷(자연수)를 분수의 곱셈으로 나타내어 계산하고, 수 카드로 나눗셈을 만들어 보세요. 두 활동을 모두 끝내요. 약분하지 않아도 맞아요.", hints: ["[3/8]÷6 = [3/8]×[1/6]에서 3과 6을 3으로 약분할 수 있어요.", "수 카드 6장을 한 번씩 모두 써서 진분수 2개와 나누는 수 2개를 만들어요."],
      render: (b, a) => fn6Both(b, a, [
        (x, y) => fn6Chain(x, y, [
          ["[5/6]÷3 = [5/6]×", { q: [null, "?1", "?3"] }, " = ", { f: "5/18" }],
          ["[3/8]÷6 = [3/8]×", { q: [null, "?1", "?6"] }, " = ", { f: "1/16" }],
          ["[6/7]÷4 = [6/7]×", { q: [null, "?1", "?4"] }, " = ", { f: "3/14" }],
          ["[7/10]÷5 = [7/10]×", { q: [null, "?1", "?5"] }, " = ", { f: "7/50" }]], { ok: "분수의 곱셈으로 나타내어 계산했어요." }),
        (x, y) => fn6Build(x, y, { cards: [2, 3, 5, 6, 7, 8], all: true, tip: "수 카드 2, 3, 5, 6, 7, 8을 한 번씩 모두 사용하여 (진분수)÷(자연수)를 2개 만들고, 분수의 곱셈으로 계산한 몫을 써요.", boards: [{ kind: "fr", proper: true, label: "나눗셈 ①" }, { kind: "fr", proper: true, label: "나눗셈 ②" }], ok: "조건에 맞는 나눗셈을 만들었어요. 예: [2/3]÷5 = [2/3]×[1/5] = [2/15], [6/7]÷8 = [6/7]×[1/8] = [6/56]" })],
        { titles: ["① 곱셈으로 계산하기", "② 수 카드 2, 3, 5, 6, 7, 8"], ok: "(분수)÷(자연수)를 분수의 곱셈으로 나타내어 계산했어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 공방 퀴즈를 풀어 보세요.", hints: ["[□/36] < [7/36]이므로 □는 7보다 작은 자연수예요.", "정사각형은 네 변의 길이가 같아요."],
    render: (b, a) => fn6Calc(b, a, [
      { e: "[9/11]÷6", a: "3/22" },
      { q: "[5/6]를 8로 나눈 몫을 구하세요.", x: "[5/6]÷8", a: "5/48", lab: "몫" },
      { q: "몫이 가장 큰 것을 고르세요.", pick: ["㉠ [3/4]÷3", "㉡ [5/6]÷2", "㉢ [7/8]÷7"], a: 1, why: { "0": "㉠ = [1/4], ㉡ = [5/12], ㉢ = [1/8]이에요. [1/4] = [3/12]이에요.", "2": "㉠ = [1/4], ㉡ = [5/12], ㉢ = [1/8]이에요." } },
      { q: "포장 리본 [13/15] m를 겹치지 않게 모두 사용하여 정사각형 모양 테두리 한 개를 꾸몄어요. 정사각형의 한 변은 몇 m일까요?", x: "[13/15]÷4", a: "13/60", unit: "m", lab: "[13/15]÷4 =" },
      { q: "[□/36] < [7/9]÷4 에서 □ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?", n: 6, lab: "", unit: "개", why: { "7": "[7/9]÷4 = [7/36]이에요. □는 7보다 작아야 해요.", "5": "1, 2, 3, 4, 5, 6이 모두 들어갈 수 있어요." } }]) }
},
{
  id: "s6", no: 6, title: "포장 리본 ― (대분수)÷(자연수)", soop: "개념 구축하기(O)",
  question: "(대분수)÷(자연수)는 어떻게 계산할까요?",
  summary: "포장 리본 [6 3/4] m를 3모둠이 똑같이 나누면 한 모둠은 [2 1/4] m를 써요. 방법 1은 대분수를 자연수 부분과 진분수 부분으로 나누어 (6÷3) + ([3/4]÷3) = 2 + [1/4] = [2 1/4], 방법 2는 대분수를 가분수로 바꾸어 [27/4]÷3 = [27÷3/4] = [9/4] = [2 1/4]로 계산해요. 자연수 부분이 나누는 수의 배수이면 방법 1이 편리하고, 아니면 가분수로 바꾼 다음 분자가 자연수의 배수인 분수로 바꾸거나 분수의 곱셈으로 나타내어 계산해요.",
  steps: [
    { name: "만져 보기 — 방법 1로 리본 나누기", inst: "선물 상자를 묶을 포장 리본 [6 3/4] m를 3모둠이 똑같이 나누어 쓰려고 해요. 방법 1로 한 모둠이 쓸 리본의 길이를 알아봐요. 자연수 부분과 진분수 부분을 각각 3묶음으로 나누어 한 묶음을 골라 보세요.", hints: ["1 m짜리 6개를 3묶음으로 나누면 한 묶음은 2 m예요.", "[3/4] m는 [1/4] m가 3칸이에요. 3칸을 3묶음으로 나누면 한 묶음은 1칸이에요."],
      render: thenWhy((b, a) => fn6Div(b, a, { A: "6 3/4", k: 3, mode: "mixed", unit: " m", aName: "포장 리본 [6 3/4] m", tip: "1 m짜리 중에서 한 묶음만큼 누르고, [3/4] m에서도 한 묶음만큼 칸을 골라요.", ask: [
        ["구하는 식: ", { c: ["[6 3/4]÷3", "[6 3/4]×3", "6÷3"], a: 0 }],
        ["[6 3/4]÷3 = (6÷3) + ([3/4]÷3) = ", { i: "2" }, " + ", { q: [null, "?1", "?4"] }, " = ", { q: ["?2", "?1", "4"] }]], ok: "대분수를 자연수 부분과 진분수 부분으로 나누어 계산했어요. [6 3/4]÷3 = [2 1/4]이에요." }),
        { q: "방법 1에서 6과 [3/4]을 따로 3으로 나누어도 되는 까닭을 써 봐요.", ph: "[6 3/4]은 6과 [3/4]을 ~", help: ["① [6 3/4]이 어떤 두 수를 더한 것인지 생각해요. → ② 두 부분을 각각 똑같이 나누어 한 묶음씩 모으면 어떻게 되는지 써요.", "‘[6 3/4]은 6과 [3/4]을 더한 수라서 각각 3으로 나누어 더해도 전체를 3으로 나눈 것과 같아요.’ 꼴로 써요."],
          ans: "[6 3/4]은 6과 [3/4]을 더한 수라서 6을 3으로 나눈 2와 [3/4]을 3으로 나눈 [1/4]을 더하면 전체를 3으로 나눈 몫 [2 1/4]과 같아요." }) },
    { name: "그려 보기 — 방법 2로 리본 나누기", inst: "이번에는 방법 2로 구해 봐요. [6 3/4] m는 [1/4] m가 27칸이에요. 27칸을 3묶음으로 나눈 것 중 한 묶음을 골라 보세요.", hints: ["[6 3/4] = [27/4]이에요.", "27칸을 3묶음으로 나누면 한 묶음은 9칸이에요."],
      render: (b, a) => fn6Div(b, a, { A: "6 3/4", k: 3, unit: " m", aName: "포장 리본 [6 3/4] m = [27/4] m", ask: [
        ["[6 3/4] = ", { q: [null, "?27", "4"] }],
        ["[27/4]÷3 = ", { q: [null, ["27", "÷", "?3"], "4"] }, " = ", { q: [null, "?9", "4"] }, " = ", { q: ["?2", "?1", "4"] }],
        ["이 방법은 대분수를 ", { c: ["가분수로 바꾸어", "자연수 부분만 나누어"], a: 0 }, " 계산했어요."]], ok: "두 방법 모두 [2 1/4] m(= [9/4] m)예요." }) },
    { name: "말해 보기 — 서아와 지호의 방법", inst: "[3 1/2]÷4를 서아와 지호의 방법으로 계산하고 비교해 보세요. 서아: “분자가 자연수의 배수인 분수로 바꾸어 계산해 볼까?” 지호: “분수의 곱셈으로 나타내어 계산해 볼까?”", hints: ["[3 1/2] = [7/2]이에요.", "서아: [7/2] = [28/8], 지호: [7/2]×[1/4]"],
      render: thenWhy((b, a) => fn6Chain(b, a, [
        { t: "서아", p: ["[3 1/2]÷4 = [7/2]÷4 = ", { q: [null, "?28", "8"] }, "÷4 = ", { q: [null, ["28", "÷", "?4"], "8"] }, " = ", { f: "7/8" }] },
        { t: "지호", p: ["[3 1/2]÷4 = [7/2]÷4 = [7/2]×", { q: [null, "?1", "?4"] }, " = ", { f: "7/8" }] },
        ["두 사람 모두 대분수를 ", { c: ["가분수로", "자연수로"], a: 0 }, " 바꾼 후 계산했어요."]],
        { ok: "둘 다 [3 1/2]÷4 = [7/8]이에요. 계산 방법은 달라도 몫은 같아요." }),
        { q: "[3 1/2]÷4는 방법 1(자연수 부분과 진분수 부분으로 나누기)보다 가분수로 바꾸는 방법이 편리해요. 그 까닭을 써 봐요.", ph: "자연수 부분 3이 ~", help: ["① 자연수 부분 3을 4로 나누면 자연수가 되는지 생각해요. → ② 그래서 어떤 방법이 더 편리한지 써요.", "‘자연수 부분 3이 4의 배수가 아니어서 ~ 방법이 더 편리해요.’ 꼴로 써요."],
          ans: "자연수 부분 3이 4의 배수가 아니라서 3÷4도 분수로 나타내어 다시 더해야 해요. 그래서 대분수를 가분수로 바꾸어 한 번에 계산하는 방법이 더 편리해요." }) },
    { name: "약속하기 — (대분수)÷(자연수)", inst: "(대분수)÷(자연수)의 계산 방법을 정리해요.", hints: ["방법 1과 방법 2를 떠올려요."],
      render: (b, a) => blanks(b, a, ["(대분수)÷(자연수)는 대분수를 ", { o: ["자연수 부분과 진분수 부분으로", "분자와 분모로"], a: 0 }, " 나누어 계산하거나, 대분수를 ", { o: ["가분수로", "소수로"], a: 0 }, " 바꾸어 계산합니다."], { ok: "대분수를 자연수 부분과 진분수 부분으로 나누어 계산하거나 가분수로 바꾸어 계산해요." }) },
    { name: "확인하기 — 리본과 빵 상자", inst: "편리한 방법으로 계산하고, 빵 상자 바닥의 세로를 구해 보세요. 두 활동을 모두 끝내요.", hints: ["[4 2/5]÷2는 자연수 부분 4가 2의 배수라서 방법 1이 편리해요.", "(직사각형의 넓이) = (가로)×(세로)이므로 (세로) = (넓이)÷(가로)예요."],
      render: (b, a) => fn6Both(b, a, [
        (x, y) => fn6Calc(x, y, [{ e: "[4 2/5]÷2", a: "2 1/5" }, { e: "[2 1/4]÷3", a: "3/4" }, { e: "[3 3/5]÷4", a: "9/10" }, { e: "[1 5/6]÷5", a: "11/30" }]),
        (x, y) => fn6Calc(x, y, [
          { q: "바닥 넓이가 [52 1/2] cm²이고 가로가 7 cm인 직사각형 모양 빵 상자가 있어요. 상자 바닥의 세로를 구하는 식을 고르세요.", pick: ["[52 1/2]÷7", "[52 1/2]×7", "[52 1/2]−7"], a: 0, why: { "1": "(직사각형의 넓이) = (가로)×(세로)이므로 세로는 넓이를 가로로 나누어요.", "2": "넓이에서 길이를 빼면 뜻이 없어요. 넓이를 가로로 나누어요." } },
          { q: "상자 바닥의 세로는 몇 cm일까요?", x: "[52 1/2]÷7", a: "7 1/2", unit: "cm", lab: "[52 1/2]÷7 =" }], { fig: fn6sRect })],
        { titles: ["① 계산하기", "② 빵 상자 바닥의 세로"], ok: "(대분수)÷(자연수)를 알맞은 방법으로 계산했어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 공방 퀴즈를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["[8 4/9] = [76/9]이에요.", "÷5는 ×[1/5]로 바꾸어야 해요. ×5가 아니에요."],
    render: (b, a) => fn6Both(b, a, [
      (x, y) => fn6Chain(x, y, [
        { t: "방법 1", p: ["[8 4/9]÷4 = (8÷4) + ([4/9]÷", { i: "4" }, ") = ", { i: "2" }, " + ", { q: [null, "?1", "9"] }, " = ", { q: ["?2", "?1", "9"] }] },
        { t: "방법 2", p: ["[8 4/9] = ", { q: [null, "?76", "9"] }] },
        { t: "방법 2", p: ["[76/9]÷4 = ", { q: [null, ["76", "÷", "?4"], "9"] }, " = ", { q: [null, "?19", "9"] }] }]),
      (x, y) => fn6Calc(x, y, [
        { e: "[5 5/8]÷5", a: "1 1/8" },
        { q: "몫이 다른 나눗셈을 고르세요.", pick: ["[2 1/3]÷7", "[1 2/3]÷5", "[3 1/3]÷5"], a: 2, why: { "0": "[2 1/3]÷7 = [1/3], [1 2/3]÷5 = [1/3], [3 1/3]÷5 = [2/3]예요.", "1": "[2 1/3]÷7 = [1/3], [1 2/3]÷5 = [1/3], [3 1/3]÷5 = [2/3]예요." } },
        { q: "두 나눗셈의 몫의 합을 구하세요. [1 1/2]÷3, [2 2/3]÷4", x: "[1 1/2]÷3+[2 2/3]÷4", a: "1 1/6", lab: "합" },
        { q: "잘못 계산한 것을 바르게 계산하세요. [3 3/4]÷5 = [15/4]×5 = [75/4] = [18 3/4]", x: "[3 3/4]÷5", a: "3/4", lab: "[3 3/4]÷5 =", why: { "75/4": "÷5를 ×5로 바꾸어 계산했어요. ÷5는 ×[1/5]이에요.", "18 3/4": "÷5를 ×5로 바꾸어 계산했어요. ÷5는 ×[1/5]이에요." } },
        { q: "밀가루 [12 3/5] kg을 6봉지에 똑같이 나누어 담았어요. 한 봉지에 담은 밀가루는 몇 kg일까요?", x: "[12 3/5]÷6", a: "2 1/10", unit: "kg", lab: "[12 3/5]÷6 =" }])],
      { titles: ["① 두 가지 방법", "② 문제 해결"], ok: "(대분수)÷(자연수)를 정확하게 계산했어요!" }) }
},
{
  id: "s7", no: 7, title: "식빵 상자 ― 식빵 1개의 무게 구하기", soop: "탐구 정리하기(O)",
  question: "상자에 든 식빵 1개의 무게를 분수의 나눗셈으로 어떻게 구할까요?",
  summary: "식빵을 4개씩 담은 상자 3개의 무게가 [5 1/4] kg이면 상자 1개는 [5 1/4]÷3 = [21/4]÷3 = [7/4] = [1 3/4] (kg)이에요. 빈 상자 [1/4] kg을 빼면 식빵 4개는 [1 1/2] kg, 식빵 1개는 [1 1/2]÷4 = [3/2]×[1/4] = [3/8] (kg)이에요. 문제를 이해하고, 무엇을 먼저 구할지 계획하고, 해결한 다음, 거꾸로 계산해 되돌아보아요.",
  steps: [
    { name: "만져 보기 — 이해해요", inst: "다 구운 식빵을 경로당 어르신께 나누어 드리려고 상자에 담았어요. 상자 1개에는 무게가 같은 식빵이 4개씩 들어 있어요. 식빵이 들어 있는 상자 3개의 무게는 [5 1/4] kg이고, 빈 상자 1개의 무게는 [1/4] kg이에요. 식빵 1개의 무게는 몇 kg인지 분수로 나타내어 봐요.", hints: ["문제의 마지막 문장에서 구하려는 것을 찾아요.", "주어진 수를 모두 찾아요. 상자 수와 상자 1개에 든 식빵 수를 헷갈리지 않아요."],
      render: (b, a) => { b.append(fn6sBoxes(3, 4, "식빵이 든 상자 3개 = [5 1/4] kg"));
        quiz(b, a, [
          { q: "구하려는 것은 무엇인가요?", o: ["식빵 1개의 무게", "상자 3개의 무게", "빈 상자 1개의 무게"], a: 0 },
          { q: "상자 1개에 든 식빵은 몇 개인가요?", o: ["4개", "3개", "1개"], a: 0, why: { "1": "3은 상자의 수예요. 상자 1개에는 식빵이 4개씩 들어 있어요." } },
          { q: "주어진 조건을 모두 고르세요.", o: ["식빵이 든 상자 3개의 무게 [5 1/4] kg", "빈 상자 1개의 무게 [1/4] kg", "상자 1개에 식빵 4개씩", "상자를 묶은 리본의 길이"], a: [0, 1, 2], why: { "3": "리본의 길이는 문제에 나오지 않아요." } }],
          { ok: "구하려는 것과 주어진 조건을 잘 찾았어요." }); } },
    { name: "그려 보기 — 계획해요", inst: "식빵 1개의 무게를 구하는 차례를 계획해 보세요. 할 일을 차례대로 눌러요.", hints: ["상자 3개의 무게로 상자 1개의 무게를 먼저 구해요.", "상자 1개의 무게에는 빈 상자의 무게도 들어 있어요."],
      render: thenWhy((b, a) => sequence(b, a, ["식빵 4개의 무게를 4로 나누어 식빵 1개의 무게를 구해요.", "상자 3개의 무게를 상자 수 3으로 나누어 식빵이 든 상자 1개의 무게를 구해요.", "상자 1개의 무게에서 빈 상자의 무게를 빼서 식빵 4개의 무게를 구해요."], [1, 2, 0], { ok: "상자 1개 → 식빵 4개 → 식빵 1개 차례로 구해요." }),
        { q: "왜 상자 1개의 무게를 먼저 구할까요?", ph: "주어진 무게는 ~", help: ["① 주어진 [5 1/4] kg이 무엇의 무게인지 살펴봐요. → ② 빈 상자의 무게를 빼려면 무엇이 필요한지 생각해요.", "‘주어진 무게는 상자 ~개를 합한 무게라서, 먼저 상자 1개의 무게를 알아야 ~을 뺄 수 있어요.’ 꼴로 써요."],
          ans: "주어진 [5 1/4] kg은 상자 3개를 합한 무게라서, 먼저 상자 1개의 무게를 알아야 빈 상자 1개의 무게를 빼고 식빵 4개의 무게를 구할 수 있어요." }) },
    { name: "말해 보기 — 해결해요", inst: "계획대로 식빵 1개의 무게를 구해 보세요.", hints: ["[5 1/4] = [21/4]이고, 21은 3으로 나누어떨어져요.", "[1 3/4] − [1/4] = [1 2/4] = [1 1/2]이에요. [1 1/2] = [3/2]이에요."],
      render: (b, a) => fn6Chain(b, a, [
        ["식빵이 든 상자 1개: [5 1/4]÷3 = ", { q: [null, "?21", "4"] }, "÷3 = ", { q: [null, ["21", "÷", "?3"], "4"] }, " = ", { q: [null, "?7", "4"] }, " = ", { q: ["?1", "?3", "4"] }, " (kg)"],
        ["식빵 4개: [1 3/4] − [1/4] = ", { f: "1 1/2" }, " (kg)"],
        ["식빵 1개: [1 1/2]÷4 = ", { q: [null, "?3", "2"] }, "÷4 = [3/2]×", { q: [null, "?1", "?4"] }, " = ", { f: "3/8" }, " (kg)"]],
        { ok: "식빵 1개의 무게는 [3/8] kg이에요." }) },
    { name: "약속하기 — 되돌아봐요", inst: "문제를 잘 해결했나요? 다른 방법으로도 풀어 보고, 조건을 바꾸어 생각해 보세요. 그리고 답이 맞는지 거꾸로 확인하는 방법을 써 보세요.", hints: ["÷3은 ×[1/3]로 바꾸어 계산할 수 있어요.", "상자 1개에 식빵이 3개씩이면 [1 1/2] kg을 3으로 나누어요."],
      render: thenWhy((b, a) => fn6Chain(b, a, [
        { t: "다른 방법", p: ["[5 1/4]÷3 = [21/4]÷3 = [21/4]×", { q: [null, "?1", "?3"] }, " = ", { q: [null, "?21", "12"] }, " = ", { f: "7/4" }] },
        ["조건 바꾸기: 상자 1개에 식빵이 3개씩 들어 있다면 식빵 1개의 무게는 [1 1/2]÷3 = ", { f: "1/2" }, " (kg)이에요."],
        ["해결하지 못했다면 ", { c: ["단계를 다시 확인하고 다른 방법을 찾아요", "답만 보고 넘어가요"], a: 0 }, "."]],
        { ok: "분수의 곱셈으로 나타내어도 몫은 같아요. 조건을 바꾸면 새로운 문제를 만들 수 있어요." }),
        { q: "구한 답 [3/8] kg이 맞는지 거꾸로 확인하는 방법을 써 봐요.", ph: "식빵 1개 [3/8] kg에 ~", help: ["① 식빵 1개의 무게로 식빵 4개의 무게를 구해요. → ② 빈 상자 무게를 더하고 상자 3개의 무게가 되는지 확인해요.", "‘[3/8]×4 = [1 1/2]에 빈 상자 [1/4]을 더하면 ~이고, 3을 곱하면 ~가 되어 맞아요.’ 꼴로 써요."],
          ans: "[3/8]×4 = [1 1/2]에 빈 상자 [1/4]을 더하면 [1 3/4]이고, 상자가 3개이니 [1 3/4]×3 = [5 1/4]이 되어 맞아요." }) },
    { name: "확인하기 — 다른 상자로 확인해요", inst: "다른 모둠은 식빵을 상자 1개에 2개씩 담았어요. 식빵이 들어 있는 상자 5개의 무게는 [6 1/4] kg이고, 빈 상자 1개의 무게는 [1/2] kg이에요. 식빵 1개의 무게를 차례대로 구해 보세요.", hints: ["[6 1/4]÷5 = [25/4]÷5예요.", "[1 1/4] − [1/2] = [5/4] − [2/4]예요."],
      render: (b, a) => fn6Calc(b, a, [
        { lab: "식빵이 든 상자 1개", x: "[6 1/4]÷5", a: "1 1/4", unit: "kg" },
        { lab: "식빵 2개", x: "[6 1/4]÷5−[1/2]", a: "3/4", unit: "kg" },
        { lab: "식빵 1개", x: "([6 1/4]÷5−[1/2])÷2", a: "3/8", unit: "kg" }], { fig: () => fn6sBoxes(5, 2, "식빵이 든 상자 5개 = [6 1/4] kg"), ok: "식빵 1개의 무게는 [3/8] kg이에요. 앞에서 구한 식빵과 무게가 같아요!" }) }
  ],
  challenge: { inst: "★ 도전 — 하윤이가 잼 병 상자로 문제를 만들었어요. 상자 1개에는 무게가 같은 잼 병이 5개씩 들어 있어요. 잼 병이 든 상자 4개의 무게는 [3 1/3] kg이고 빈 상자 1개의 무게는 [1/3] kg이에요. 잼 병 1개의 무게를 구해 보세요.", hints: ["[3 1/3]÷4 = [10/3]÷4 = [10/12]이에요.", "[5/6] − [1/3] = [5/6] − [2/6]예요."],
    render: (b, a) => fn6Calc(b, a, [
      { lab: "잼 병이 든 상자 1개", x: "[3 1/3]÷4", a: "5/6", unit: "kg" },
      { lab: "잼 병 5개", x: "[3 1/3]÷4−[1/3]", a: "1/2", unit: "kg" },
      { lab: "잼 병 1개", x: "([3 1/3]÷4−[1/3])÷5", a: "1/10", unit: "kg" }], { ok: "잼 병 1개의 무게는 [1/10] kg이에요. 4단계로 차근차근 해결했어요!" }) }
},
{
  id: "s8", no: 8, title: "머핀 바구니 ― 스스로 해결하고 새 문제 만들기", soop: "탐구 정리하기(O)",
  question: "필요한 정보를 찾아 스스로 문제를 해결하고, 조건을 바꾸어 새 문제를 만들 수 있을까요?",
  summary: "머핀을 6개씩 담은 바구니 5개의 무게가 [6 1/3] kg이고 빈 바구니가 [2/3] kg이면, 바구니 1개는 [6 1/3]÷5 = [19/15] = [1 4/15] (kg), 머핀 6개는 [1 4/15] − [2/3] = [9/15] (kg), 머핀 1개는 [9/15]÷6 = [1/10] (kg)이에요. 머핀을 구운 시간처럼 필요 없는 정보는 빼고, 거꾸로 계산해 답을 확인해요. 조건을 바꾸면 새로운 문제를 만들 수 있어요.",
  steps: [
    { name: "만져 보기 — 필요한 정보 찾기", inst: "급식실 조리사님께 드릴 머핀을 바구니에 담았어요. 머핀은 오븐에서 25분 동안 구웠어요. 바구니 1개에는 무게가 같은 머핀이 6개씩 들어 있어요. 머핀이 들어 있는 바구니 5개의 무게는 [6 1/3] kg이고, 빈 바구니 1개의 무게는 [2/3] kg이에요. 머핀 1개의 무게는 몇 kg일까요?", hints: ["무게를 구하는 데 쓰이는 수만 골라요.", "구운 시간은 무게와 관계가 있을까요?"],
      render: (b, a) => { b.append(fn6sBoxes(5, 6, "머핀이 든 바구니 5개 = [6 1/3] kg", "basket"));
        quiz(b, a, [
          { q: "구하려는 것은 무엇인가요?", o: ["머핀 1개의 무게", "바구니 5개의 무게", "머핀을 구운 시간"], a: 0 },
          { q: "문제를 푸는 데 필요한 정보를 모두 고르세요.", o: ["바구니 1개에 머핀 6개씩", "머핀이 든 바구니 5개의 무게 [6 1/3] kg", "빈 바구니 1개의 무게 [2/3] kg", "머핀을 구운 시간 25분"], a: [0, 1, 2], why: { "3": "구운 시간은 무게를 구하는 데 필요 없는 정보예요." } },
          { q: "필요 없는 정보는 무엇인가요?", o: ["머핀을 구운 시간 25분", "빈 바구니의 무게", "바구니의 수"], a: 0, why: { "1": "빈 바구니의 무게를 빼야 머핀만의 무게를 알 수 있어요.", "2": "바구니 수로 나누어야 바구니 1개의 무게를 알 수 있어요." } }],
          { ok: "필요한 정보와 필요 없는 정보를 잘 가려냈어요." }); } },
    { name: "그려 보기 — 해결해요", inst: "필요한 정보로 머핀 1개의 무게를 구해 보세요. 바구니 1개 → 머핀 6개 → 머핀 1개 차례로 구해요.", hints: ["[6 1/3] = [19/3]이고, ÷5는 ×[1/5]로 계산할 수 있어요.", "[2/3] = [10/15]이에요."],
      render: thenWhy((b, a) => fn6Chain(b, a, [
        ["머핀이 든 바구니 1개: [6 1/3]÷5 = ", { q: [null, "?19", "3"] }, "÷5 = [19/3]×", { q: [null, "?1", "?5"] }, " = ", { q: [null, "?19", "15"] }, " = ", { q: ["?1", "?4", "15"] }, " (kg)"],
        ["머핀 6개: [1 4/15] − [2/3] = [1 4/15] − ", { q: [null, "?10", "15"] }, " = ", { f: "9/15" }, " (kg)"],
        ["머핀 1개: [9/15]÷6 = ", { f: "1/10" }, " (kg)"]],
        { ok: "머핀 1개의 무게는 [1/10] kg이에요." }),
        { q: "머핀 1개의 무게를 구할 때 6으로 나누는 까닭을 써 봐요.", ph: "바구니 1개에는 ~", help: ["① 바구니 1개에 머핀이 몇 개 들어 있는지 떠올려요. → ② 머핀 6개의 무게와 머핀 1개의 무게 사이의 관계를 생각해요.", "‘바구니 1개에는 무게가 같은 머핀이 ~개씩 들어 있어서, 머핀 ~개의 무게를 ~으로 나누면 머핀 1개의 무게가 돼요.’ 꼴로 써요."],
          ans: "바구니 1개에는 무게가 같은 머핀이 6개씩 들어 있어서, 머핀 6개의 무게를 6으로 똑같이 나누면 머핀 1개의 무게가 돼요." }) },
    { name: "말해 보기 — 거꾸로 확인해요", inst: "구한 답 [1/10] kg이 맞는지 거꾸로 계산해 확인해 봐요. 머핀 1개의 무게로 바구니 5개의 무게를 다시 구해 보세요.", hints: ["머핀 6개는 [1/10]×6이에요.", "[3/5] + [2/3] = [9/15] + [10/15]이에요."],
      render: thenWhy((b, a) => fn6Calc(b, a, [
        { lab: "머핀 6개", x: "[1/10]×6", a: "3/5", unit: "kg" },
        { lab: "머핀 6개와 빈 바구니", x: "[1/10]×6+[2/3]", a: "1 4/15", unit: "kg" },
        { lab: "바구니 5개", x: "([1/10]×6+[2/3])×5", a: "6 1/3", unit: "kg" }], { ok: "거꾸로 계산해 보니 처음 무게 [6 1/3] kg이 나왔어요. 답이 맞아요!" }),
        { q: "거꾸로 계산해 확인하면 좋은 점을 써 봐요.", ph: "거꾸로 계산해서 ~", help: ["① 거꾸로 계산했더니 어떤 수가 나왔는지 떠올려요. → ② 그 수가 문제에 주어진 수와 같으면 무엇을 알 수 있는지 써요.", "‘거꾸로 계산해서 처음에 주어진 ~이 나오면 내가 구한 답이 ~을 알 수 있어요.’ 꼴로 써요."],
          ans: "거꾸로 계산해서 처음에 주어진 무게 [6 1/3] kg이 나오면 내가 구한 답이 맞는지 스스로 확인할 수 있어요." }) },
    { name: "약속하기 — 문제해결 차례와 새 문제", inst: "문제를 해결하는 차례를 정리하고, 조건을 바꾸어 새 문제를 만들어 보세요. 두 활동을 모두 끝내요.", hints: ["이해해요 → 계획해요 → 해결해요 → 되돌아봐요 차례예요.", "바구니에 담는 머핀 수나 전체 무게를 바꾸어 보세요. 답이 깔끔하게 나오는지 직접 계산해 봐요."],
      render: (b, a) => { blanks(b, a, ["문제를 해결할 때는 먼저 구하려는 것과 ", { o: ["필요한 정보를", "답만"], a: 0 }, " 찾아 이해하고, 무엇을 먼저 구할지 ", { o: ["계획한", "외운"], a: 0 }, " 다음 해결하고, 답이 맞는지 ", { o: ["되돌아봐요", "그냥 넘어가요"], a: 0 }, "."], { ok: "이해해요 → 계획해요 → 해결해요 → 되돌아봐요! 이제 아래에 새 문제를 만들어요." });
        writeStep(b, a, [{ q: "조건을 하나 이상 바꾸어 머핀 1개의 무게를 구하는 새 문제를 만들고, 답도 구해 보세요.", tag: "새 문제", ph: "바구니 1개에 머핀이 ~개씩 들어 있고 …", help: ["① 바구니에 담는 머핀 수, 바구니 수, 전체 무게, 빈 바구니 무게 가운데 바꿀 것을 골라요. → ② 바꾼 수로 바구니 1개 → 머핀만 → 머핀 1개 차례로 답을 구해요.", "‘바구니 1개에 머핀이 ~개씩 들어 있고, 머핀이 든 바구니 ~개의 무게가 ~ kg, 빈 바구니 1개의 무게가 ~ kg일 때 머핀 1개의 무게는? (답: ~)’ 꼴로 써요."],
          ans: "바구니 1개에 머핀이 5개씩 들어 있고, 머핀이 든 바구니 4개의 무게가 [4 2/3] kg, 빈 바구니 1개의 무게가 [2/3] kg일 때 머핀 1개의 무게는 몇 kg일까요? (답: [4 2/3]÷4 = [7/6], [7/6] − [2/3] = [1/2], [1/2]÷5 = [1/10]이므로 [1/10] kg)" }], { ok: "새 문제를 만들었어요! 친구와 바꾸어 풀어 봐요." }); } },
    { name: "확인하기 — 친구가 만든 문제 풀기", inst: "예린이가 만든 문제예요. 쿠키 봉지 1개에는 무게가 같은 쿠키가 8개씩 들어 있어요. 쿠키가 든 봉지 4개의 무게는 [1 1/5] kg이고, 빈 봉지 1개의 무게는 [1/20] kg이에요. 쿠키 1개의 무게를 차례대로 구해 보세요.", hints: ["[1 1/5]÷4 = [6/5]÷4 = [6/20]이에요.", "[6/20] − [1/20] = [5/20]예요."],
      render: (b, a) => fn6Calc(b, a, [
        { lab: "쿠키가 든 봉지 1개", x: "[1 1/5]÷4", a: "3/10", unit: "kg" },
        { lab: "쿠키 8개", x: "[1 1/5]÷4−[1/20]", a: "1/4", unit: "kg" },
        { lab: "쿠키 1개", x: "([1 1/5]÷4−[1/20])÷8", a: "1/32", unit: "kg" }], { ok: "쿠키 1개의 무게는 [1/32] kg이에요. 친구가 만든 문제도 4단계로 해결했어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 두 모둠이 쿠키 봉지를 바구니에 담았어요. 하윤이네는 바구니 1개에 쿠키 봉지 3개씩, 봉지가 든 바구니 2개의 무게가 [2 1/2] kg, 빈 바구니 1개가 [1/2] kg이에요. 태오네는 바구니 1개에 쿠키 봉지 4개씩, 봉지가 든 바구니 3개의 무게가 [4 1/5] kg, 빈 바구니 1개가 [3/5] kg이에요. 쿠키 봉지 1개는 어느 모둠이 더 무거울까요?", hints: ["하윤이네: [2 1/2]÷2 = [5/4], [5/4] − [1/2] = [3/4]이에요.", "태오네: [4 1/5]÷3 = [7/5], [7/5] − [3/5] = [4/5]예요."],
    render: (b, a) => fn6Calc(b, a, [
      { lab: "하윤이네 쿠키 봉지 1개", x: "([2 1/2]÷2−[1/2])÷3", a: "1/4", unit: "kg" },
      { lab: "태오네 쿠키 봉지 1개", x: "([4 1/5]÷3−[3/5])÷4", a: "1/5", unit: "kg" },
      { q: "쿠키 봉지 1개가 더 무거운 모둠은?", pick: ["하윤이네", "태오네", "같아요"], a: 0, why: { "1": "[1/4] = [5/20], [1/5] = [4/20]예요.", "2": "[1/4]과 [1/5]은 크기가 달라요. [1/4] = [5/20], [1/5] = [4/20]예요." } }], { ok: "하윤이네 쿠키 봉지 1개([1/4] kg)가 태오네([1/5] kg)보다 더 무거워요." }) }
},
{
  id: "s9", no: 9, title: "주문서 이어달리기 ― 기억하고 전달하고 계산해요", soop: "발표하기(P)",
  question: "분수의 나눗셈 주문서를 정확하게 기억하고 전달하여 옳게 계산할 수 있을까요?",
  summary: "공방에 빵 주문이 몰려 주문서를 모둠원이 차례로 기억해 전달하는 놀이를 해요. 4명씩 모둠을 만들어 한 줄로 서요. 맨 뒷사람이 주문서에 적힌 나눗셈을 화이트보드에 옮겨 쓰고, 앞사람에게 차례로 전달해요. 맨 앞사람은 전달받은 나눗셈을 칠판에 쓰고 계산해요. 주문서를 맞히고 옳게 계산하면 2점, 맞혔으나 잘못 계산하면 1점, 맞히지 못했으나 옳게 계산하면 1점, 둘 다 못 하면 0점이에요. 속도보다 정확하게 쓰고 계산해요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알아보기", inst: "‘주문서 이어달리기’ 놀이 순서를 차례대로 눌러 보세요. (준비물: 나눗셈 주문서 카드, 타이머, 화이트보드, 칠판 펜)", hints: ["먼저 모둠을 만들고 한 줄로 서요.", "맨 앞사람이 마지막에 칠판에 쓰고 계산해요."],
      render: (b, a) => sequence(b, a, ["맨 뒷사람이 주문서 한 장을 뒤집어 확인하고 화이트보드에 옮겨 써요.", "4명씩 모둠을 만들고 순서를 정해 칠판을 바라보고 한 줄로 서요.", "맨 앞사람은 전달받은 나눗셈을 칠판에 쓰고 계산해요.", "바로 앞사람에게 화이트보드를 보여 주고, 앞사람은 외워서 자기 화이트보드에 쓴 뒤 다시 앞사람에게 보여 주어요."], [1, 0, 3, 2], { ok: "정한 시간 동안 맨 앞사람까지 전달해요. 사용한 주문서는 맨 아래에 넣고, 서 있는 순서를 바꾸어 반복해요." }) },
    { name: "그려 보기 — 점수 매기기", inst: "주문서에 적힌 나눗셈은 [8/9]÷4예요. 네 모둠의 맨 앞사람이 칠판에 쓴 것을 보고 점수를 매겨 보세요.", hints: ["주문서와 같은 나눗셈을 썼는지, 쓴 나눗셈을 옳게 계산했는지 두 가지를 봐요.", "약분하지 않은 답도 값이 같으면 옳은 계산이에요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "1모둠: [8/9]÷4 = [2/9]", o: ["2점", "1점", "0점"], a: 0, why: { "1": "주문서를 맞혔고 옳게 계산했으니까 2점이에요.", "2": "주문서를 맞혔고 옳게 계산했으니까 2점이에요." } },
        { q: "2모둠: [8/9]÷4 = [8/36]", o: ["2점", "1점", "0점"], a: 0, why: { "1": "[8/36]을 약분하면 [2/9]예요. 약분하지 않아도 옳게 계산했으니 2점이에요.", "2": "주문서를 맞혔고, [8/36] = [2/9]라서 계산도 옳아요." } },
        { q: "3모둠: [8/9]÷2 = [4/9]", o: ["2점", "1점", "0점"], a: 1, why: { "0": "주문서는 [8/9]÷4인데 [8/9]÷2를 썼어요. 맞히지 못했어요.", "2": "[8/9]÷2 = [4/9]는 옳게 계산했으니까 1점을 얻어요." } },
        { q: "4모둠: [9/8]÷4 = [9/2]", o: ["2점", "1점", "0점"], a: 2, why: { "0": "주문서를 맞히지 못했고, [9/8]÷4 = [9/32]이니 계산도 틀렸어요.", "1": "주문서를 맞히지 못했고, [9/8]÷4 = [9/32]이니 계산도 틀렸어요." } }],
        { ok: "맞히고 옳게 계산 2점, 둘 중 하나만 하면 1점, 둘 다 못 하면 0점이에요." }),
        { q: "2모둠의 ‘[8/9]÷4 = [8/36]’도 2점인 까닭을 써 봐요.", ph: "[8/36]을 약분하면 ~", help: ["① [8/36]을 약분해 봐요. → ② 1모둠의 답과 견주어 값이 같은지 써요.", "‘[8/36]을 약분하면 ~라서 값이 같아요. 기약분수로 나타내지 않아도 ~이에요.’ 꼴로 써요."],
          ans: "[8/36]을 약분하면 [2/9]라서 값이 같아요. 기약분수로 나타내지 않아도 옳게 계산한 것이라 2점이에요." }) },
    { name: "말해 보기 — 이어달리기 하기", inst: "주문서 이어달리기를 해 봐요. 이 앱에서는 내가 주문서를 잠깐 보고 기억했다가, 맨 앞사람이 되어 칠판에 쓰고 계산해요. 5판 중 4판 이상 옳게 계산해 보세요.", hints: ["주문서가 보일 때 분자, 분모, 나누는 수를 소리 내어 외워요.", "분자가 나누는 수의 배수가 아니면 크기가 같은 분수로 바꾸거나 ×[1/▲]로 계산해요."],
      render: (b, a) => fn6Relay(b, a, { cards: FN6S_CARDS, rounds: 5, need: 4, sec: 5 }) },
    { name: "약속하기 — 또 다른 놀이", inst: "또 다른 놀이 방법이에요. 주문서 카드 16장을 가로 4장, 세로 4장으로 뒤집어 놓고 차례로 한 장씩 골라 계산해요. 옳게 계산하면 그 카드에 이름을 써서 놓고, 틀리면 다시 뒤집어 놓아요. 가로·세로·대각선으로 자기 카드 한 줄을 먼저 만들면 이겨요. 줄이 없으면 카드가 많은 사람이 이겨요.", hints: ["줄을 만들 수 있는 자리의 카드를 골라요.", "옳게 계산해야 카드를 가질 수 있어요."],
      render: (b, a) => fn6Line(b, a, { cards: FN6S_CARDS }) },
    { name: "확인하기 — 놀이를 되돌아봐요", inst: "놀이를 되돌아봐요. 지킬 점을 고르고, 가장 헷갈렸던 나눗셈을 써 보세요. 두 활동을 모두 끝내요.", hints: ["친구와 함께하는 놀이예요. 빨리 하는 것보다 정확한 것이 중요해요.", "헷갈렸던 나눗셈을 바르게 계산하는 방법을 함께 써요."],
      render: (b, a) => { quiz(b, a, [
        { q: "놀이할 때 지킬 점을 모두 고르세요.", o: ["화이트보드에 정확하게 써서 전달해요.", "친구의 화이트보드를 보면서 따라 쓰지 않아요.", "잘못 전달되어도 끝까지 집중해 옳게 계산해요.", "맨 앞사람의 계산이 끝날 때까지 기다려 주고 함께 확인해요.", "빨리 끝내려고 앞사람을 재촉해요."], a: [0, 1, 2, 3], why: { "4": "속도보다 정확하게 쓰고 계산하는 것이 중요해요. 친구를 배려해요." } }],
        { ok: "친구를 배려하며 정확하게 전달하고 계산했어요. 이제 아래에 써요." });
        writeStep(b, a, [{ q: "놀이에서 가장 헷갈렸던 나눗셈과 바르게 계산하는 방법을 써 보세요.", tag: "헷갈린 나눗셈", ph: "~÷~가 헷갈렸어요. 바르게 계산하면 ~", help: ["① 놀이에 나온 나눗셈 가운데 헷갈렸던 것을 하나 골라요. → ② 바르게 계산하는 차례를 써요.", "‘~÷~가 헷갈렸어요. 분자가 나누는 수의 배수가 아니라서 ~로 바꾸어 계산하면 ~예요.’ 꼴로 써요."],
          ans: "[5/7]÷4가 헷갈렸어요. 분자 5가 4의 배수가 아니라서 [5/7]×[1/4]로 바꾸어 계산하면 [5/28]예요." }], { ok: "헷갈렸던 것을 바르게 정리했어요!" }); } }
  ],
  challenge: { inst: "★ 도전 — 더 어려운 주문서로 이어달리기를 해 봐요. (분수)÷(자연수)와 (대분수)÷(자연수) 주문서만 나와요. 주문서 보는 시간을 3초로 줄여 5판 중 4판 이상 옳게 계산해 보세요.", hints: ["대분수는 자연수 부분, 분자, 분모, 나누는 수를 차례로 외워요.", "대분수는 가분수로 바꾸어 계산하면 편리해요."],
    render: (b, a) => fn6Relay(b, a, { cards: FN6S_CARDS.slice(5), rounds: 5, need: 4, sec: 3 }) }
},
{
  id: "s10", no: 10, title: "나눔 빵 발표회 ― 공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분수의 나눗셈을 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
  summary: "(자연수)÷(자연수)는 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타내요(2÷7 = [2/7]). (분수)÷(자연수)는 분자가 자연수의 배수이면 분자를 나누고, 아니면 분자가 자연수의 배수인 크기가 같은 분수로 바꾸어 계산하거나([2/3]÷4 = [4/6]÷4 = [1/6]), 분수의 곱셈으로 나타내어 계산해요([2/3]÷4 = [2/3]×[1/4] = [2/12]). (대분수)÷(자연수)는 대분수를 자연수 부분과 진분수 부분으로 나누어 계산하거나 대분수를 가분수로 바꾸어 계산해요. 분모를 자연수로 나누면 안 돼요.",
  steps: [
    { name: "만져 보기 — 그림으로 몫 구하기", inst: "나눔 빵 발표회 첫 순서예요. 2÷7을 그림에 나타내고 몫을 구해 보세요. 띠 2개를 7명에게 똑같이 나누어 준다고 생각해요.", hints: ["띠마다 똑같이 7칸으로 나누어 한 칸씩 골라요.", "1÷7 = [1/7]이고 2는 1이 2개예요."],
      render: (b, a) => fn6Share(b, a, { N: 2, d: 7, strip: "1", who: "명", one: "한 명", ask: [
        ["1÷7 = [1/7]이고 2는 1이 2개이므로 2÷7은 [1/7]이 ", { i: "2" }, "개예요."],
        ["2÷7 = ", { q: [null, "?2", "?7"] }]], ok: "2÷7 = [2/7]예요." }) },
    { name: "그려 보기 — 칸을 가장 적게 나누기", inst: "[2/3]÷4의 몫을 그림에 나타내어 보세요. 색칠한 부분이 [2/3]예요. 이번에는 칸을 가장 적게 나누어 분자가 4로 나누어떨어지게 해 보세요.", hints: ["각 칸을 2칸으로만 나누어도 색칠한 칸이 4칸이 되어 4로 나누어떨어져요.", "[2/3] = [4/6]이고, 4칸을 4묶음으로 나누면 한 묶음은 1칸이에요."],
      render: thenWhy((b, a) => fn6Div(b, a, { A: "2/3", k: 4, m: 2, ask: [
        ["[2/3]÷4 = ", { q: [null, "?4", "6"] }, "÷4 = ", { q: [null, ["?4", "÷", "4"], "6"] }, " = ", { q: [null, "?1", "6"] }]], ok: "[2/3]÷4 = [4/6]÷4 = [1/6]이에요. [8/12]÷4 = [2/12]로 해도 몫은 같아요." }),
        { q: "각 칸을 4칸이 아니라 2칸으로만 나누어도 된 까닭을 써 봐요.", ph: "분자 2에 2를 곱하면 ~", help: ["① 각 칸을 2칸으로 나누면 [2/3]가 어떤 분수가 되는지 생각해요. → ② 그 분수의 분자가 4로 나누어떨어지는지 살펴봐요.", "‘분자 2에 2를 곱하면 ~가 되어 4로 나누어떨어지기 때문이에요. 분자가 나누는 수의 ~가 되기만 하면 돼요.’ 꼴로 써요."],
          ans: "분자 2에 2를 곱하면 4가 되어 4로 나누어떨어지기 때문이에요. 분자가 나누는 수의 배수가 되기만 하면 돼요." }) },
    { name: "말해 보기 — 곱셈으로 계산하기", inst: "분수의 곱셈으로 나타내어 계산해 보세요. 약분하지 않아도 맞아요.", hints: ["÷6은 ×[1/6]로 나타내요.", "[2 2/3]는 먼저 가분수 [8/3]로 바꾸어요."],
      render: (b, a) => fn6Chain(b, a, [
        ["[4/9]÷6 = [4/9]×", { q: [null, "?1", "?6"] }, " = ", { f: "2/27" }],
        ["[3/5]÷9 = [3/5]×", { q: [null, "?1", "?9"] }, " = ", { f: "1/15" }],
        ["[2 2/3]÷4 = ", { q: [null, "?8", "3"] }, "×", { q: [null, "?1", "?4"] }, " = ", { f: "2/3" }]],
        { ok: "(분수)÷(자연수)를 분수의 곱셈으로 나타내어 계산했어요." }) },
    { name: "약속하기 — 잘못 찾고 알려 주기", inst: "[7/12]÷3을 두 친구가 계산했어요. 예린: “분수의 곱셈으로 나타내어 계산했어.” [7/12]÷3 = [7/12]×[1/3] = [7/36] / 태오: “분자를 자연수로 나누어 계산했어.” [7/12]÷3 = [7/12÷3] = [7/4] = [1 3/4] 잘못 계산한 사람을 찾아 바르게 고치고, 그 친구에게 알려 주는 말을 써 보세요.", hints: ["태오는 분자가 아니라 분모를 3으로 나누었어요.", "분자 7이 3의 배수가 되도록 [7/12]을 [21/36]로 바꾸어요."],
      render: (b, a) => { fn6Both(b, a, [
        (x, y) => quiz(x, y, [{ q: "잘못 계산한 사람은 누구인가요?", o: ["예린", "태오"], a: 1, why: { "0": "예린이는 ÷3을 ×[1/3]로 바꾸어 옳게 계산했어요." } }], { ok: "태오는 분자를 자연수로 나누어야 하는데 분모를 자연수로 나누었어요." }),
        (x, y) => fn6Chain(x, y, [
          ["태오가 설명한 방법(분자를 자연수로 나누기)대로: [7/12]÷3 = ", { q: [null, "?21", "36"] }, "÷3 = ", { q: [null, ["21", "÷", "?3"], "36"] }, " = ", { q: [null, "?7", "36"] }]], { ok: "[7/12]÷3 = [21/36]÷3 = [7/36]이에요." })],
        { titles: ["① 잘못 계산한 사람", "② 바르게 계산하기"], ok: "잘못된 곳을 찾고, 설명한 방법대로 바르게 계산했어요! 이제 아래에 알려 주는 말을 써요." });
        writeStep(b, a, [{ q: "태오에게 바르게 계산하는 방법을 알려 주는 말을 써 보세요.", tag: "알려 주는 말", ph: "태오야, 분모를 ~", help: ["① 태오가 잘못한 곳을 한 가지 짚어요. → ② 분자를 나누는 방법으로 바르게 계산하는 차례를 알려 줘요.", "‘태오야, 분모를 3으로 나누면 안 돼. 분자 7이 3으로 나누어떨어지지 않으니까 ~로 바꾼 다음 ~을 3으로 나누면 ~이 돼.’ 꼴로 써요."],
          ans: "태오야, 분모 12를 3으로 나누면 안 돼. 분자 7이 3으로 나누어떨어지지 않으니까 [7/12]을 [21/36]로 바꾼 다음 분자 21을 3으로 나누면 [7/36]이 돼." }], { ok: "고치고 알려 주기까지 했어요!" }); } },
    { name: "확인하기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["분수의 나눗셈을 배우기 전의 생각을 떠올려요.", "●÷▲ = [●/▲], 분자를 나누기, 크기가 같은 분수, ×[1/▲], 대분수 나누기를 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "배우기 전의 생각", ex: ["예전에는 3÷4처럼 작은 수를 큰 수로 나누면 나눌 수 없다고 생각했어요.", "예전에는 분수를 자연수로 나눌 때 분모를 나누어야 한다고 생각했어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 3÷4의 몫을 [3/4]처럼 분수로 나타낼 수 있다는 것을 알아요.", "지금은 분자가 나누어떨어지지 않으면 크기가 같은 분수로 바꾸거나 ×[1/▲]로 계산하면 된다는 것을 알아요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["막대 반죽 3줄을 4명이 나누어 보면서 한 명이 [1/4]줄씩 3번 받는 것을 보고 바뀌었어요.", "설탕 [2/3] kg을 정사각형에 색칠하고 4등분해 보면서 ÷4가 ×[1/4]과 같다는 것을 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "★★ 도전 — 나눔 빵 공방의 마지막 문제를 풀어 보세요.", hints: ["[2 2/5] = [12/5]이고 12는 6으로 나누어떨어져요.", "정사각형은 네 변의 길이가 같아요."],
    render: (b, a) => fn6Calc(b, a, [
      { q: "생크림 [2 2/5] L를 6명이 똑같이 나누어 쓰려고 해요. 한 명이 쓸 수 있는 생크림은 몇 L일까요?", x: "[2 2/5]÷6", a: "2/5", unit: "L", lab: "[2 2/5]÷6 =" },
      { q: "철사 [9/10] m를 겹치지 않게 모두 사용하여 크기가 같은 정사각형 모양 쿠키 틀 3개를 만들었어요. 쿠키 틀 한 개를 만드는 데 사용한 철사는 몇 m일까요?", x: "[9/10]÷3", a: "3/10", unit: "m", lab: "[9/10]÷3 =" },
      { q: "쿠키 틀의 한 변의 길이는 몇 m일까요?", x: "[9/10]÷3÷4", a: "3/40", unit: "m", lab: "[3/10]÷4 =", why: { "3/10": "[3/10] m는 쿠키 틀 한 개의 둘레예요. 정사각형은 변이 4개이니 4로 나누어요." } }],
      { ok: "나눔 빵 공방에서 분수의 나눗셈을 모두 익혔어요! 다음 단원에서는 각기둥과 각뿔을 공부해요." }) }
}
];
