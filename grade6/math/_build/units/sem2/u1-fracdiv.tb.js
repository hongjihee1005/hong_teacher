//@@APP
const APP={title:"남극 과학 기지 분수의 나눗셈", unit:"6-2 수학 1. 분수의 나눗셈(교과서)", key:"t62-fracdiv-v1", welcome:"남극 과학 기지 분수의 나눗셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 남극 과학 기지 대원인 삼촌의 생활을 살펴보는 준혁이와 함께 분수의 나눗셈을 알아봐요."};
//@@UNIT
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
quiz = (b, a, items, o) => fd6Quiz0(b, fd6A(a), items, o);
blanks = (b, a, parts, o) => fd6Blanks0(b, fd6A(a), parts, o);

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
  return el;
}
function fd6Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 4, class: "fd6box", "aria-label": "빈칸" });
  i.exp = String(exp);
  if (i.exp.length >= 3) i.classList.add("fd6wide");
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

/* ① 식과 답 (분수 답은 같은 분모의 가분수·대분수·자연수 모두 정답, 약분한 답은 '값은 같아요' 안내)
   items: {q?, e:"[3/8]+[4/8]" (보이는 식) | x (확인용 식), a:"7/8", unit, den, why:{"학생 답":"까닭"}, lab, g:"묶음 제목"}
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
      R.inp = fd6In(it.lab || it.e || "답");
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
  const btn = h("button", { class: "big", onclick: () => {
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
      const r = R.inp.get(), J = fd6Judge(r, it.a, R.den); given.push(R.inp.text());
      if (J.code === "ok") { R.inp.paint(true); return; }
      if (J.code === "diffden" || J.code === "zero" || J.code === "improper") { R.inp.paint(null); if (!hint) hint = J.msg; return; }
      R.inp.paint(false);
      if (!bad) bad = (it.why && it.why[fd6Key(r)]) || J.msg || fd6Diag(it.e || it.x, r) || opt.bad || "다시 계산해 봐요. 분모가 같으면 분자끼리 나누고, 분모가 다르면 통분해요. 곱셈으로 바꿀 때는 나누는 분수의 분자와 분모를 바꾸어요.";
    });
    if (bad) return api.fail(bad, given.join(" / "));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + fd6Book(num, den); R.res.classList.remove("hidden"); } });
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요! 약분하지 않아도, 가분수로 써도, 대분수로 써도 맞아요.");
  } }, "확인하기");
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, btn));
}
/* ② 차례대로 빈칸 채우기 (계산 과정)
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 수 칸 | {q:[자연수, 분자, 분모]} 각 자리는 고정값·"?답"(칸)·배열(분자에 ["?3","+","?2"]) | {f:"4 2/5"} 분수 입력(값 판정) | {c:[…], a}
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
        const fi = fd6In("답"); fi.target = pt.f; fi.den = pt.den || fd6Den(pt.f) || 0; ins.push(fi); line.append(fi);
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
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    let ok = true, hint = null; const given = [];
    const same = new Set();
    pairs.forEach(([nb, db]) => { const a = nb.value.trim(), b = db.value.trim();
      if (/^\d+$/.test(a) && /^[1-9]\d*$/.test(b) && !(a === nb.exp && b === db.exp) && +a * +db.exp === +b * +nb.exp) { same.add(nb); same.add(db);
        hint = hint || (fd6G(+nb.exp, +db.exp) === 1 ? "값은 맞아요. 그런데 더 약분할 수 있어요. 분모와 분자를 최대공약수로 나누어 기약분수로 나타내요." : "값은 맞아요. 그런데 이 칸에는 약분하기 전의 분수를 써요."); } });
    ins.forEach(x => {
      if (same.has(x)) { x.style.borderColor = ""; given.push(x.value.trim()); return; }
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = fd6Judge(x.get(), x.target, x.den); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "diffden" || J.code === "zero" || J.code === "improper") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
    });
    chs.forEach(C => { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(C.sel === C.a ? "good" : "bad"); }); if (C.sel !== C.a) ok = false; given.push(C.sel == null ? "-" : C.el.children[C.sel].textContent); });
    if (!ok) return api.fail(opt.bad || "빨간 칸을 다시 생각해 봐요.", given.join(","));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce(); api.done(given.join(","), opt.ok || "차례대로 잘 계산했어요!");
  } }, "확인하기")));
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 */
function fd6Ask(host, api, ready, msg, opt) {
  const g = fd6Gate(api, ready, msg);
  if (opt.ask) return fd6Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad });
  if (opt.askCalc) return fd6Calc(host, g, opt.askCalc, { ok: opt.ok });
  api.provide({ words: [], answers: [] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { api.tryOnce(); ready() ? api.done("조작 완료", opt.ok) : api.fail(typeof msg === "function" ? msg() : msg, "-"); } }, "확인하기")));
}

/* ③ 막대 색칠하기: bars [{name, k, col}]  opt: d, ask(줄)·askCalc, ok */
function fd6Bars(body, api, opt) {
  fd6Style();
  const d = opt.d, bars = opt.bars, W = 900, LX = 210, BW = 660, BH = 62, GP = 42, H = bars.length * (BH + GP) + 14;
  const st = bars.map(() => Array(d).fill(false));
  const svg = makeSvg(W, H);
  const cnt = i => st[i].filter(Boolean).length;
  const draw = () => {
    svg.innerHTML = "";
    bars.forEach((b, i) => {
      const y = 22 + i * (BH + GP), col = b.col != null ? b.col : i, ok = cnt(i) === b.k;
      svg.append(fd6SvgLine(b.name, LX - 18, y + BH / 2 - 9, 25, { anchor: "end" }));
      svg.append(fd6SvgLine(`색칠 ${cnt(i)}칸`, LX - 18, y + BH / 2 + 22, 17, { anchor: "end", fill: ok ? "#2E8B57" : "#5B6B6B" }));
      for (let c = 0; c < d; c++) {
        const r = svgEl("rect", { x: LX + c * BW / d, y, width: BW / d, height: BH, fill: st[i][c] ? FD6_F[col % 4] : "#fff", stroke: INK, "stroke-width": 2, style: "cursor:pointer" });
        r.addEventListener("click", () => { st[i][c] = !st[i][c]; draw(); });
        svg.append(r);
      }
      svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
    });
  };
  draw();
  const ready = () => bars.every((b, i) => cnt(i) === b.k);
  const ask = h("div", { class: "fd6ask" });
  body.append(h("p", { class: "fd6tip" }, opt.tip || "칸을 누르면 색칠되고, 한 번 더 누르면 지워져요."), h("div", { class: "fd6stage" }, svg), ask);
  fd6Ask(ask, api, ready, () => { const i = bars.findIndex((b, k) => cnt(k) !== b.k); return `먼저 ‘${fd6Plain(bars[i].name)}’ 막대를 알맞게 색칠해요. 지금 ${cnt(i)}칸이에요.`; }, opt);
}
/* ⑦ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function fd6Sort(body, api, opt) {
  fd6Style();
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "fd6pool" }), binsEl = h("div", { class: "fd6bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "fd6binl" }); binsEl.append(h("div", { class: "fd6bin", onclick: e => { if (e.target.closest(".fd6crd")) return; put(bi); } }, h("button", { class: "fd6binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt fd6crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  function draw() { els.forEach((el, ci) => { el.classList.toggle("fd6on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => fd6Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "fd6tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (where.some(w => w < 0)) return api.fail("아직 넣지 않은 카드가 있어요.", "-");
      let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
      if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); return api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); }
      api.tryOnce(); api.done(given, opt.ok);
    } }, "확인하기")));
}

/* ⑧ 관계있는 것끼리 잇기: left [{t,k}], right [{t,k|null}] (값을 계산해 짝이 맞는지 스스로 확인) */
function fd6Match(body, api, opt) {
  fd6Style();
  const L = opt.left, R = opt.right, pair = L.map(() => -1); let sel = null;
  L.forEach(l => { const v = fd6Eval(l.t); R.forEach(r => { const w = fd6Eval(r.t); if (!v || !w || fd6Eq(v, w) !== (r.k === l.k)) throw new Error("잇기 확인 필요: " + l.t + " / " + r.t); }); });
  const COL = ["#2B7BD6", "#D9822B", "#2E8B57"];
  const lb = L.map((l, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; draw(); } }, l.t));
  const rb = R.map((r, j) => h("button", { class: "opt", onclick: () => { if (sel == null) return api.hint("먼저 왼쪽 식을 눌러요."); pair[sel] = pair[sel] === j ? -1 : j; sel = null; draw(); } }, r.t));
  const badge = (i) => h("span", { class: "fd6badge", style: `background:${COL[i % 3]}` }, String(i + 1));
  function draw() {
    lb.forEach((b, i) => { b.classList.toggle("fd6on", sel === i); b.classList.remove("good", "bad"); [...b.querySelectorAll(".fd6badge")].forEach(x => x.remove()); b.append(badge(i)); });
    rb.forEach((b, j) => { b.classList.remove("good", "bad"); [...b.querySelectorAll(".fd6badge")].forEach(x => x.remove()); pair.forEach((p, i) => { if (p === j) b.append(badge(i)); }); });
  }
  draw();
  api.provide({ words: [], answers: L.map(l => `${fd6Plain(l.t)} — ${fd6Plain(R.find(r => r.k === l.k).t)}`) });
  body.append(h("p", { class: "fd6tip" }, "왼쪽 식을 누르고, 값이 같은 오른쪽 식을 눌러 이어요. 짝이 없는 식도 있어요."),
    h("div", { class: "fd6mt" }, h("div", { class: "fd6mc" }, lb), h("div", { class: "fd6mc" }, rb)),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (pair.some(p => p < 0)) return api.fail("왼쪽 식을 모두 이어요.", "-");
      let ok = true; pair.forEach((p, i) => { const g = R[p].k === L[i].k; lb[i].classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = pair.map((p, i) => `${i + 1}-${p + 1}`).join(", ");
      if (!ok) return api.fail("값을 계산해 보고 다시 이어요. 가분수와 대분수 중 편리한 꼴로 바꾸어 비교해요.", given);
      api.tryOnce(); api.done(given, opt.ok || "값이 같은 식끼리 잘 이었어요!");
    } }, "확인하기")));
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

/* ① 같은 양을 여러 번 붓기(분수×자연수): opt d(1을 나눈 칸 수), amt("1/4"·"3/5"·"1 1/5"), k(번), unit, what(무엇을), est, ask·askCalc, ok
   진분수는 1짜리 막대를 차례로 채우고, 대분수는 한 번 부은 양을 한 줄로 그린 뒤 '모으기'로 자연수끼리·진분수끼리 모아요. */


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
  fd6Ask(ask, api, ready, () => !same() ? `칸의 크기를 같게 해요. 두 띠의 한 칸이 모두 [1/${cd}]${unit ? fd6U(unit, "이가") : "이"} 되게 나누어요.` : p < full ? `${g}칸씩 덜어 내요. 지금 ${p}번 덜어 냈어요.` : "남은 부분을 눌러 한 묶음의 얼마만큼인지 알아봐요.", opt);
}

/* ② 원 모양(파이) 덜어 내기: 분모가 같은 경우. opt A, B, word, unit, ask */
function fd6Pie(body, api, opt) {
  fd6Style(); fd6Style2();
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
  };
  const ready = () => p === full && (!rem || remOn);
  const scoop = () => { if (p < full) p++; else if (rem && !remOn) remOn = true; else return api.hint(`더 나누어 줄 수 없어요. ${fd6J(gTxt(full), "이에요")}.`); draw(); };
  svg.style.cursor = "pointer"; svg.addEventListener("click", scoop);
  draw();
  const ask = h("div", { class: "fd6ask" });
  body.append(h("p", { class: "fd6tip" }, opt.tip || `원을 누를 때마다 [${opt.B}]씩 한 ${one}에게 나누어 주어요.`),
    h("div", { class: "fd6ctl" }, h("button", { onclick: scoop }, "한 번 나누어 주기"), h("button", { onclick: () => { if (remOn) remOn = false; else if (p) p--; draw(); } }, "하나 되돌리기")), h("div", { class: "fd6stage" }, svg), ask);
  fd6Ask(ask, api, ready, () => `[${opt.B}]씩 나누어 주어요. 지금 ${fd6J(gTxt(p), "이에요")}.`, opt);
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
  if (opt.est) body.append(fd6EstBox(api, opt.est, () => {}));
  body.append(h("p", { class: "fd6tip" }, opt.tip || "아래 수직선의 눈금을 누르거나 주황 표시를 끌어 옮겨요."), wrap,
    h("div", { class: "fd6ctl" }, h("button", { onclick: () => { st.forEach((S, k) => { S.stage = 0; S.pos = items[k].a; svgs[k].draw(); }); } }, "처음부터")), ask);
  fd6Ask(ask, api, () => st.every(S => S.stage === 2), () => { const k = st.findIndex(S => S.stage < 2), it = items[k]; return st[k].stage === 0 ? `${items.length > 1 ? (k + 1) + "번 그림: " : ""}표시를 ${fd6PJ(it, `[1/${it.b}]`, "으로")} 옮겨요.` : `${items.length > 1 ? (k + 1) + "번 그림: " : ""}표시를 ${fd6PJ(it, "1", "으로")} 옮겨요.`; }, opt);
}

/* ④ 나눗셈을 곱셈으로 바꾸기: ÷를 누르면 ×로, 분수를 누르면 분자와 분모가 바뀌어요.
   rows [{A:"4/5", B:"2/3"}] — 나누는 수만 뒤집고 ×로 바꾼 다음 값을 써요. */
function fd6Flip(body, api, opt) {
  fd6Style(); fd6Style2(); fd6Style3();
  const R = opt.rows.map(r => { const A = fd6Val(r.A), B = fd6Val(r.B); return { r, A, B, fa: false, fb: false, mul: false, T: fd6R(A.num * B.den, A.den * B.num) }; });
  const fr = (v, f) => { const n = f ? v.den : v.num, d = f ? v.num : v.den; return d === 1 ? String(n) : `[${n}/${d}]`; };
  const wrap = h("div");
  R.forEach((S, i) => {
    const line = h("div", { class: "fd6flip" });
    const ba = h("button", { "aria-label": "나누어지는 수" }), bo = h("button", { class: "fd6op", "aria-label": "연산 기호" }), bb = h("button", { "aria-label": "나누는 수" });
    S.inp = fd6In("값");
    const paint = () => { ba.textContent = fr(S.A, S.fa); bb.textContent = fr(S.B, S.fb); bo.textContent = S.mul ? "×" : "÷"; ba.classList.toggle("fd6fl", S.fa); bb.classList.toggle("fd6fl", S.fb); bo.classList.toggle("fd6fl", S.mul); };
    ba.onclick = () => { S.fa = !S.fa; paint(); }; bb.onclick = () => { S.fb = !S.fb; paint(); }; bo.onclick = () => { S.mul = !S.mul; paint(); };
    paint();
    if (R.length > 1) line.append(h("span", { class: "fd6no" }, `${i + 1})`));
    line.append(h("span", {}, `${fr(S.A, false)}÷${fr(S.B, false)} =`), ba, bo, bb, h("span", {}, "="), S.inp);
    wrap.append(line);
  });
  api.provide({ words: ["나눗셈을 곱셈으로", "나누는 분수의 분자와 분모를 바꾸기"], answers: R.map(S => fd6Plain(`${fr(S.A, false)}÷${fr(S.B, false)} = ${fr(S.A, false)}×${fr(S.B, true)} = ${fd6Txt(S.T.num, S.T.den)}`)) });
  body.append(h("p", { class: "fd6tip" }, opt.tip || "기호 ÷를 누르면 ×로 바뀌고, 분수를 누르면 분자와 분모가 바뀌어요. 나눗셈과 값이 같은 곱셈식을 만든 다음 값을 써요."), wrap,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
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
      if (bad) return api.fail(bad, given.join(" / "));
      if (hint) { api.tryOnce(); return api.hint(hint); }
      api.tryOnce(); api.done(given.join(" / "), opt.ok || "나눗셈을 곱셈으로 바꾸고 나누는 분수의 분자와 분모를 바꾸어 계산했어요!");
    } }, "확인하기")));
}

/* ⑤ 수 카드로 분수의 나눗셈 만들기
   board: {shape:[[분자,분모],[분자,분모]] (null = 빈칸), goal:"any"|"max"|"min", proper:true(진분수만), avoid:["3/5÷4/7"], all:true(카드 모두 쓰기), label}
   fd6BuildUI(host, cards, board) → {read()} : {err} 또는 {e, val, r, right} */
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
function fd6BuildUI(host, cards, board) {
  fd6Style(); fd6Style2(); fd6Style3();
  const shape = board.shape, nS = fd6Slots(shape), slot = Array(nS).fill(null);
  let sel = null;
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
  };
  paint();
  if (board.label) host.append(h("div", { class: "jua", style: "margin-top:.4em" }, board.label));
  host.append(h("div", { class: "fd6deck" }, cBtns), boardEl);
  return {
    read() {
      const vals = slot.map(i => i == null ? null : cards[i]);
      if (vals.some(v => v == null)) return { err: "빈칸에 수 카드를 모두 넣어요." };
      const e = fd6ShapeTxt(shape, vals), val = fd6ShapeVal(shape, vals, board.proper);
      if (!val) return { err: board.proper ? "진분수는 분자가 분모보다 작아야 해요." : "분수를 다시 만들어요.", e };
      const r = quo.get();
      if (r.err) { quo.paint(false); return { err: r.err === "empty" ? "몫을 써요." : r.err === "half" ? "분수는 분자와 분모를 모두 써요." : "몫을 분수나 자연수로 써요.", e }; }
      const right = fd6Eq(r, val); quo.paint(right);
      return { e, val, r, right, given: `${fd6Plain(e)} = ${quo.text()}` };
    },
    reset() { slot.fill(null); sel = null; paint(); quo.querySelectorAll("input").forEach(x => { x.value = ""; }); quo.paint(null); }
  };
}
function fd6Build(body, api, opt) {
  fd6Style(); fd6Style2(); fd6Style3();
  const boards = opt.boards, cards = opt.cards;
  const bests = boards.map(bd => bd.goal === "max" ? fd6Best(bd, cards, 1) : bd.goal === "min" ? fd6Best(bd, cards, -1) : null);
  api.provide({ words: ["나누는 수가 작을수록 몫이 커요", "분자끼리 나누기", "나누는 분수의 분자와 분모를 바꾸어 곱하기"],
    answers: boards.map((bd, i) => bests[i] ? `${fd6Plain(fd6ShapeTxt(bd.shape, bests[i].idx.map(k => cards[k])))} = ${fd6Plain(fd6Txt(bests[i].v.num, bests[i].v.den))}` : "").filter(Boolean) });
  body.append(h("p", { class: "fd6tip" }, opt.tip || "수 카드를 누른 다음 빈칸을 눌러 넣어요. 빈칸을 다시 누르면 빠져요. 그리고 몫을 써요."));
  const uis = boards.map(bd => { const box = h("div", { class: "fd6grp" }); body.append(box); return fd6BuildUI(box, cards, bd); });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const given = []; let bad = null, hint = null;
    uis.forEach((ui, i) => {
      const R = ui.read(), bd = boards[i]; given.push(R.given || R.e || "-");
      if (bad) return;
      if (R.err) { bad = R.err; return; }
      if (bd.avoid && bd.avoid.includes(R.e.replace(/[\[\]]/g, ""))) { bad = "친구가 만든 나눗셈과 같아요. 다른 나눗셈을 만들어 보세요."; return; }
      if (bests[i] && !fd6Eq(R.val, bests[i].v)) { bad = (bd.goal === "max" ? bd.msg || "몫이 더 큰 나눗셈을 만들 수 있어요. 나누는 수를 작게 해 봐요." : bd.msg || "몫이 더 작은 나눗셈을 만들 수 있어요. 나누는 수를 크게 해 봐요."); return; }
      if (!R.right) { bad = fd6Diag(R.e, R.r) || "몫을 다시 계산해 봐요."; return; }
      if (R.r.hasF && R.r.hasW && R.r.n >= R.r.d) hint = hint || "값은 맞아요. 대분수의 분수 부분은 1보다 작게 써요.";
    });
    if (bad) return api.fail(bad, given.join(" / "));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce(); api.done(given.join(" / "), opt.ok || "나눗셈을 만들고 몫을 바르게 구했어요!");
  } }, "확인하기")));
}

/* ⑥ 문제 완성하기: 보기 분수 중 서로 다른 두 개를 골라 문장을 완성하고 몫을 구해요. opt fr:[…], s:[앞 글, 가운데 글, 뒤 글], unit */
function fd6Pose(body, api, opt) {
  fd6Style(); fd6Style2(); fd6Style3();
  const fr = opt.fr; let p = null, q = null;
  const b1 = h("span", { class: "fd6blank" }, "​"), b2 = h("span", { class: "fd6blank" }, "​");
  const row = (lab, set) => { const r = h("div", { class: "fd6ctl" }, h("span", { class: "jua" }, lab)); fr.forEach((f, i) => r.append(h("button", { class: "opt", onclick: ev => { set(i); [...r.querySelectorAll(".opt")].forEach(x => x.classList.remove("fd6on")); ev.currentTarget.classList.add("fd6on"); paint(); } }, `[${f}]`))); return r; };
  const paint = () => { b1.textContent = p == null ? "​" : `[${fr[p]}]`; b2.textContent = q == null ? "​" : `[${fr[q]}]`; };
  const quo = fd6In("몫");
  api.provide({ words: ["통분", "분자끼리 나누기"], answers: [] });
  body.append(h("p", { class: "fd6tip" }, "두 줄에서 분수를 하나씩 골라 문제를 완성하고, 답을 구해요. 두 분수는 서로 달라야 해요."),
    row(opt.l1 || "첫째 칸:", i => { p = i; }), row(opt.l2 || "둘째 칸:", i => { q = i; }),
    h("div", { class: "fd6pose" }, opt.s[0], b1, opt.s[1], b2, opt.s[2]),
    h("div", { class: "fd6cl" }, h("span", {}, opt.ansLab || "답:"), quo, h("span", {}, opt.unit || "")),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (p == null || q == null) return api.fail("두 칸에 들어갈 분수를 모두 골라요.", "-");
      if (p === q) return api.fail("서로 다른 두 분수를 골라요.", fr[p]);
      const v = fd6R(fd6Val(fr[p]).num * fd6Val(fr[q]).den, fd6Val(fr[p]).den * fd6Val(fr[q]).num), r = quo.get(), e = `[${fr[p]}]÷[${fr[q]}]`;
      const given = `${fd6Plain(e)} = ${quo.text()}`;
      if (r.err) { quo.paint(false); return api.fail(r.err === "empty" ? "답을 써요." : "답을 분수나 자연수로 써요.", given); }
      if (!fd6Eq(r, v)) { quo.paint(false); return api.fail(fd6Diag(e, r) || `${fd6J(fd6Plain(e), "을를")} 다시 계산해 봐요. 통분한 다음 분자끼리 나누어요.`, given); }
      quo.paint(true); api.tryOnce(); api.done(given, (opt.ok || "문제를 만들고 답을 구했어요!") + ` ${e} = ${fd6Book(v.num, v.den)}`);
    } }, "확인하기")));
}

/* ⑦ 놀이 ‘다를까요, 같을까요’: 세트마다 수 카드 4장을 한 번씩 모두 써서 나눗셈을 만들고 몫을 구해요.
   친구 셋(1회는 교과서 예시, 2~6회는 이 앱에서 정한 활동지)과 비교해 점수: 같은 나눗셈이 없으면 2점, 있으면 1점, 옳게 계산하면 1점 더.
   opt sets [{cards, by, fr:[{name, e:[a,b,c,d], q:"몫"}]}], need(옳게 계산한 판 수) */
function fd6Game(body, api, opt) {
  fd6Style(); fd6Style2(); fd6Style3();
  const sets = opt.sets, need = opt.need || 4; let round = 0, score = 0, good = 0; const log = [];
  const friends = sets[0].fr.map(f => f.name), fScore = friends.map(() => 0);
  const scoreEl = h("span", { class: "fd6score" }, "​"), stage = h("div"), logEl = h("div");
  api.provide({ words: ["같은 나눗셈이 없으면 2점", "같은 나눗셈이 있으면 1점", "옳게 계산하면 1점 추가"], answers: [] });
  const key = (a, b, c, d) => `${a}/${b}÷${c}/${d}`;
  const val = (a, b, c, d) => fd6R(a * d, b * c);
  const paintScore = () => { scoreEl.textContent = `${Math.min(round + 1, sets.length)}/${sets.length}회 · 내 점수 ${score}점 · ` + friends.map((n, i) => `${n} ${fScore[i]}점`).join(" · "); };
  const deal = () => {
    stage.innerHTML = "";
    const S = sets[round]; let doneR = false;
    paintScore();
    stage.append(h("div", { class: "fd6ctl" }, h("span", { class: "jua" }, `${round + 1}회 수 카드 세트:`), h("span", { class: "fd6ccard" }, S.cards.join(", ")), h("span", { class: "fd6no" }, S.by)));
    const ui = fd6BuildUI(stage, S.cards, { shape: [[null, null], [null, null]] });
    const fb = h("div");
    stage.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (doneR) return;
      const R = ui.read(); if (R.err) return api.hint(R.err);
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
      log.push(`${round + 1}회: [${x}]÷[${y}] → ${rows[0].pt}점`);
      fb.append(h("p", { class: "fd6rd" + (R.right ? " fd6good" : "") }, R.right ? `옳게 계산했어요! [${x}]÷[${y}] = ${fd6Book(v.num, v.den)}` : `몫이 틀렸어요. 옳은 몫: [${x}]÷[${y}] = ${fd6Book(v.num, v.den)} ${fd6Diag(R.e, R.r) || ""}`), tbl);
      round++; paintScore();
      logEl.innerHTML = ""; logEl.append(h("ol", { class: "fd6log" }, log.map(t => h("li", {}, t))));
      if (round < sets.length) fb.append(h("div", { class: "fd6ctl" }, h("button", { onclick: deal }, "이어서 한 판 더")));
      else {
        api.tryOnce();
        const top = Math.max(score, ...fScore), win = score === top;
        const msg = `6회 끝! 내 점수 ${score}점 · ${friends.map((n, i) => `${n} ${fScore[i]}점`).join(" · ")}. ${win ? "내가 가장 높아요(같은 점수 포함)!" : "친구가 더 높아요."} 옳게 계산한 판은 ${good}번이에요.`;
        if (good >= need) api.done(`${score}점, 옳은 계산 ${good}번`, msg);
        else { api.fail(`${msg} ${need}번 이상 옳게 계산하도록 다시 해 봐요.`, `${score}점`); fb.append(h("div", { class: "fd6ctl" }, h("button", { onclick: () => { round = 0; score = 0; good = 0; fScore.fill(0); log.length = 0; logEl.innerHTML = ""; deal(); } }, "처음부터 다시"))); }
      }
    } }, "내 나눗셈 내기")), fb);
  };
  body.append(h("p", { class: "fd6tip" }, "수 카드 4장을 한 번씩 모두 써서 나눗셈을 만들고 몫을 써요. 친구 셋의 활동지(1회는 교과서 예시, 2~6회는 이 앱이 정한 것)와 비교해 점수를 얻어요."),
    h("div", { class: "fd6ctl" }, scoreEl), stage, logEl);
  deal();
}

/* ⑧ 또 다른 놀이: 주사위를 4번 던져 나온 수로 나눗셈 만들기 */
function fd6Dice(body, api, opt) {
  fd6Style(); fd6Style2(); fd6Style3();
  const host = h("div"), roll = h("button", {}, "주사위 4번 던지기");
  let cur = null;
  const go = () => {
    host.innerHTML = "";
    const cards = [1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 6));
    host.append(h("div", { class: "fd6dice" }, h("span", { class: "jua" }, "나온 수:"), ...cards.map(c => h("span", { class: "fd6ccard" }, String(c)))));
    cur = fd6BuildUI(host, cards, { shape: [[null, null], [null, null]] });
  };
  roll.onclick = go;
  api.provide({ words: ["나온 수를 한 번씩 모두 쓰기"], answers: [] });
  body.append(h("p", { class: "fd6tip" }, "주사위를 4번 던져 나온 수를 한 번씩 모두 써서 나눗셈을 만들고 몫을 써요. 같은 수가 두 번 나오면 두 번 써요."),
    h("div", { class: "fd6ctl" }, roll), host,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (!cur) return api.fail("먼저 주사위를 던져요.", "-");
      const R = cur.read(); if (R.err) return api.fail(R.err, R.e || "-");
      if (!R.right) return api.fail(fd6Diag(R.e, R.r) || "몫을 다시 계산해 봐요.", R.given);
      api.tryOnce(); api.done(R.given, `옳게 계산했어요! ${R.e} = ${fd6Book(R.val.num, R.val.den)}`);
    } }, "확인하기")));
  go();
}

/* 남극 과학 기지 그림 */
function fd6Scene() {
  const svg = makeSvg(900, 260);
  svg.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 260, fill: "#E6F2FB", rx: 16 }));
  svg.append(svgEl("rect", { x: 0, y: 170, width: 900, height: 90, fill: "#BFDDF2" }));
  svg.append(svgEl("path", { d: "M30 175 L120 70 L170 120 L230 60 L320 175 Z", fill: "#fff", stroke: "#7FA8C9", "stroke-width": 3 }));
  /* 기지 */
  svg.append(svgEl("rect", { x: 360, y: 110, width: 170, height: 62, fill: "#F2A65A", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("rect", { x: 380, y: 125, width: 26, height: 20, fill: "#fff", stroke: INK, "stroke-width": 2 }));
  svg.append(svgEl("rect", { x: 420, y: 125, width: 26, height: 20, fill: "#fff", stroke: INK, "stroke-width": 2 }));
  svg.append(svgEl("rect", { x: 470, y: 135, width: 30, height: 37, fill: "#9C6B3E", stroke: INK, "stroke-width": 2 }));
  svg.append(txt(445, 95, "과학 기지", 20));
  /* 배 */
  svg.append(svgEl("path", { d: "M600 195 L800 195 L770 228 L625 228 Z", fill: "#C8472E", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("rect", { x: 660, y: 165, width: 80, height: 30, fill: "#fff", stroke: INK, "stroke-width": 3 }));
  svg.append(txt(700, 245, "아라온호", 17));
  /* 펭귄 */
  [[250, 200], [285, 205]].forEach(([x, y]) => { svg.append(svgEl("ellipse", { cx: x, cy: y, rx: 13, ry: 20, fill: INK })); svg.append(svgEl("ellipse", { cx: x, cy: y + 4, rx: 8, ry: 14, fill: "#fff" })); svg.append(svgEl("circle", { cx: x, cy: y - 22, r: 9, fill: INK })); svg.append(svgEl("path", { d: `M${x + 6} ${y - 22} l8 3 l-8 3z`, fill: "#F2A65A" })); });
  svg.append(txt(268, 240, "펭귄 마을", 17));
  return h("div", { class: "fd6stage" }, svg);
}
/* 놀이 예시 활동지(교과서 26쪽) */
function fd6Sheets() {
  fd6Style(); fd6Style3();
  const t = h("table", { class: "fd6sheet" }, h("tr", {}, h("th", {}, "친구"), h("th", {}, "만든 나눗셈"), h("th", {}, "쓴 몫"), h("th", {}, "말풍선")));
  [["가", "[3/5]÷[4/7]", "[1 1/20]", "같은 나눗셈이 있고 옳게 계산했어!"], ["나", "[5/7]÷[3/4]", "[15/28]", "같은 나눗셈이 없고 잘못 계산했어!"], ["다", "[3/5]÷[4/7]", "[12/35]", "같은 나눗셈이 있고 잘못 계산했어!"], ["라", "[3/7]÷[4/5]", "[15/28]", "같은 나눗셈이 없고 옳게 계산했어!"]]
    .forEach(r => t.append(h("tr", {}, ...r.map(c => h("td", {}, c)))));
  return h("div", {}, h("p", { class: "jua" }, "수 카드 3, 4, 5, 7로 만든 네 친구의 1회 활동지"), t);
}

//@@LESSONS
/* 10차시 놀이 수 카드 세트: 여섯 세트 모두 교과서 보기 그대로(교과서 26쪽). 1회 친구 활동지는 교과서 예시, 2~6회 친구 활동지는 이 앱이 정한 것 */
const FD6_SETS = [
  { cards: [3, 7, 5, 4], by: "(교과서 보기 · 교과서 예시 활동지)", fr: [{ name: "하윤", e: [3, 5, 4, 7], q: "1 1/20" }, { name: "재민", e: [5, 7, 3, 4], q: "15/28" }, { name: "소민", e: [3, 7, 4, 5], q: "15/28" }] },
  { cards: [11, 9, 8, 7], by: "(교과서 보기)", fr: [{ name: "하윤", e: [7, 8, 9, 11], q: "1 5/72" }, { name: "재민", e: [8, 9, 7, 11], q: "1 25/63" }, { name: "소민", e: [7, 8, 9, 11], q: "63/88" }] },
  { cards: [15, 7, 4, 12], by: "(교과서 보기)", fr: [{ name: "하윤", e: [4, 7, 12, 15], q: "5/7" }, { name: "재민", e: [12, 15, 4, 7], q: "1 2/5" }, { name: "소민", e: [7, 12, 4, 15], q: "7/45" }] },
  { cards: [23, 15, 6, 4], by: "(교과서 보기)", fr: [{ name: "하윤", e: [4, 6, 15, 23], q: "1 1/45" }, { name: "재민", e: [4, 15, 6, 23], q: "46/45" }, { name: "소민", e: [4, 6, 15, 23], q: "1 1/45" }] },
  { cards: [16, 3, 7, 10], by: "(교과서 보기)", fr: [{ name: "하윤", e: [3, 7, 10, 16], q: "24/35" }, { name: "재민", e: [10, 16, 3, 7], q: "1 11/24" }, { name: "소민", e: [3, 10, 7, 16], q: "21/160" }] },
  { cards: [2, 7, 6, 13], by: "(교과서 보기)", fr: [{ name: "하윤", e: [2, 7, 6, 13], q: "13/21" }, { name: "재민", e: [6, 7, 2, 13], q: "5 4/7" }, { name: "소민", e: [2, 7, 6, 13], q: "12/91" }] }];
const UNIT_STORY = { title: "남극 과학 기지의 준혁이네 삼촌", lines: [
  "준혁이네 삼촌은 남극에 있는 과학 기지 대원이에요. 준혁이는 삼촌과 영상 통화를 하며 과학 기지의 생활을 살펴봐요. 식물 공장의 비료, 바닷물로 만든 식수, 펭귄 마을의 쓰레기, 쇄빙선 아라온호, 바닷물을 담은 수조, 운석을 담는 페트리 접시가 나와요.",
  "나누는 수가 분수인 나눗셈을 덜어 내기, 통분, 띠와 수직선을 함께 쓴 그림(이중 척도 모델), 분수의 곱셈으로 알아봐요.",
  "교과서 「수학 6-2」 1. 분수의 나눗셈의 차시 순서 그대로 만들었어요."],
  one: "분수의 나눗셈 · 분모가 같으면 분자끼리 나누고, 분모가 다르면 통분한 다음 분자끼리 나눠요. (분수)÷(분수)는 나누는 분수의 분자와 분모를 바꾸어 곱해도 돼요." };
const UNIT_KEYWORDS = ["덜어 내기", "단위분수의 개수", "분자끼리 나누기", "통분", "몇 배", "1시간 동안(단위 비율)", "이중 척도 모델", "자연수를 분자로 나누고 분모를 곱하기", "나눗셈을 곱셈으로 바꾸기", "나누는 분수의 분자와 분모를 바꾸기", "가분수로 바꾸기", "대분수", "1 kg의 가격", "몫이 나누어지는 수보다 커질 수 있어요"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 남극 과학 기지에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 분수의 나눗셈을 이용할 수 있는 상황에는 무엇이 있을까요?",
  summary: "준혁이네 삼촌은 남극 과학 기지 대원이에요. 과학 기지에서는 펭귄 마을의 쓰레기를 줍고, 바닷물을 분석하고, 운석을 연구해요. 반죽을 일정한 양씩 나누어 굽거나, 한 양이 다른 양의 몇 배인지 알아볼 때 분수의 나눗셈이 필요해요. 이 단원을 배우기 전에 통분, (분수)×(분수), (자연수)÷(자연수)의 몫을 분수로 나타내기, (분수)÷(자연수)를 떠올려 두어요.",
  steps: [
    { name: "살펴보기", inst: "준혁이는 남극 과학 기지에 있는 삼촌과 영상 통화를 해요. “여기는 정말 멋져. 파란 하늘 아래 눈부신 얼음과 빙산이 끝없이 펼쳐져 있어.” 과학 기지에서는 펭귄을 보호하기 위해 펭귄 마을의 쓰레기를 줍기도 하고, 기후 변화를 연구하기 위해 바닷물을 분석하기도 해요. 또 우주 환경을 파악하기 위해 운석을 연구하기도 해요.", hints: ["삼촌의 이야기를 다시 읽어 보세요.", "사막은 남극에 없어요."],
      render: (b, a) => quiz(b, a, [
        { q: "과학 기지에서 하는 일로 이야기에 나온 것을 모두 고르세요.", fig: fd6Scene, o: ["펭귄 마을의 쓰레기 줍기", "바닷물 분석하기", "운석 연구하기", "사막의 모래 조사하기"], a: [0, 1, 2], why: { "3": "이야기에 사막은 나오지 않아요. 남극은 얼음과 빙산이 펼쳐진 곳이에요." } },
        { q: "우리나라가 남극에 세운 과학 기지를 고르세요.", o: ["세종 과학 기지", "장보고 과학 기지", "두 기지 모두"], a: 2, why: { "0": "우리나라 최초의 남극 기지는 세종 과학 기지이고, 두 번째는 장보고 과학 기지예요.", "1": "우리나라 최초의 남극 기지는 세종 과학 기지이고, 두 번째는 장보고 과학 기지예요." } }],
        { ok: "삼촌의 과학 기지 생활을 살펴보며 분수의 나눗셈을 알아봐요." }) },
    { name: "만져 보기", inst: "와플은 1800년대 말 대한제국 황실에서도 만들어 먹었대요(출처: 서울신문, 2024). 와플 반죽 [3/4] L를 [1/4] L씩 나누어 굽는다면 와플을 몇 개 만들 수 있을까요? 띠를 눌러 [1/4] L씩 덜어 내 보세요.", hints: ["띠를 누를 때마다 [1/4] L씩 덜어 내요.", "[3/4]은 [1/4]이 3개예요."],
      render: (b, a) => fd6Scoop(b, a, { A: "3/4", B: "1/4", unit: " L", cnt: "개", one: "와플", aName: "반죽 [3/4] L", bName: "와플 1개 [1/4] L",
        askCalc: [{ lab: "만들 수 있는 와플", x: "[3/4]÷[1/4]", n: 3, unit: "개", why: { "4": "띠 전체가 아니라 반죽이 있는 칸만 덜어 내요." } }], ok: "[3/4] L에서 [1/4] L를 3번 덜어 낼 수 있으니 와플을 3개 만들 수 있어요. 이것을 [3/4]÷[1/4]로 나타내요. 이 단원에서 이런 나눗셈을 배워요." }) },
    { name: "생활 속 나눗셈", inst: "요리를 할 때에도 분수의 나눗셈이 필요해요. 상황에 알맞은 식을 골라 보세요.", hints: ["‘몇 그릇’, ‘몇 배’, ‘몇 컵’을 구할 때는 나눗셈을 써요.", "전체의 양을 한 번에 쓰는 양으로 나누어요."],
      render: (b, a) => quiz(b, a, [
        { q: "밀가루 [3/5] kg을 그릇 한 개에 [1/5] kg씩 담으면 그릇 몇 개가 필요할까요?", o: ["[3/5]÷[1/5]", "[3/5]×[1/5]", "[1/5]÷[3/5]"], a: 0, why: { "1": "곱하면 [3/5] kg보다 적은 양이 돼요. 전체를 한 그릇의 양으로 나누어요.", "2": "나누는 순서가 바뀌었어요. 전체 밀가루의 양을 한 그릇에 담는 양으로 나누어요." } },
        { q: "간장 [2/3]컵과 다진 마늘 [1/6]컵을 넣었어요. 간장은 다진 마늘의 몇 배일까요?", o: ["[2/3]÷[1/6]", "[1/6]÷[2/3]", "[2/3]−[1/6]"], a: 0, why: { "1": "간장이 마늘의 몇 배인지 구하므로 간장의 양을 마늘의 양으로 나누어요.", "2": "빼면 얼마나 더 많은지를 구하게 돼요. 몇 배인지는 나눗셈으로 구해요." } },
        { q: "딸기 [1/6] kg으로 요구르트 한 컵을 만들어요. 딸기 2 kg으로는 몇 컵을 만들 수 있을까요?", o: ["2÷[1/6]", "[1/6]÷2", "2×[1/6]"], a: 0, why: { "1": "[1/6]÷2는 [1/6] kg을 둘로 나눈 양이에요. 딸기 2 kg에 [1/6] kg이 몇 번 들어가는지 구해요.", "2": "곱하면 2 kg보다 적은 양이 돼요. 2 kg을 한 컵에 쓰는 양으로 나누어요." } }],
        { ok: "나누는 수가 분수인 나눗셈이 생활 곳곳에 있어요." }) },
    { name: "떠올리기 ① 통분과 곱셈", inst: "5학년 때 배운 통분과 (분수)×(분수)를 떠올려요.", hints: ["[3/4]과 [2/7]는 분모의 곱 28로 통분할 수 있어요.", "(분수)×(분수)는 분자는 분자끼리, 분모는 분모끼리 곱해요."],
      render: (b, a) => fd6Chain(b, a, [
        ["([3/4], [2/7])을 통분하면 (", { q: [null, "?21", "28"] }, ", ", { q: [null, "?8", "28"] }, ")"],
        ["([5/6], [3/8])을 최소공배수로 통분하면 (", { q: [null, "?20", "24"] }, ", ", { q: [null, "?9", "24"] }, ")"],
        ["[2/3]×[3/5] = ", { q: [null, ["2", "×", "?3"], ["3", "×", "?5"]] }, " = ", { q: [null, "?2", "5"] }]],
        { ok: "통분과 분수의 곱셈을 잘 기억하고 있어요. 분수의 나눗셈에서 자주 써요.", bad: "통분은 분모와 분자에 같은 수를 곱해 분모를 같게 하는 것이에요. 곱셈은 분자끼리, 분모끼리 곱해요." }) },
    { name: "떠올리기 ② 나눗셈", inst: "6학년 1학기에 배운 (자연수)÷(자연수)의 몫을 분수로 나타내기와 (분수)÷(자연수)를 떠올려요.", hints: ["3÷5의 몫은 [3/5]이에요. ■÷▲ = [■/▲]예요.", "[3/4]÷2는 [3/4]×[1/2]로 계산할 수 있어요."],
      render: (b, a) => fd6Chain(b, a, [
        ["3÷5 = ", { q: [null, "?3", "?5"] }],
        ["7÷4 = ", { q: [null, "?7", "4"] }, " = ", { q: ["?1", "?3", "4"] }],
        ["[4/5]÷2 = ", { q: [null, ["4", "÷", "?2"], "5"] }, " = ", { q: [null, "?2", "5"] }],
        ["[3/4]÷2 = [3/4]×", { q: [null, "?1", "?2"] }, " = ", { q: [null, "?3", "8"] }]],
        { ok: "(자연수)÷(자연수)와 (분수)÷(자연수)를 잘 기억하고 있어요. 이제 나누는 수가 분수인 나눗셈을 배워요." }) }
  ],
  challenge: { inst: "배울 내용을 살펴봐요. 지금까지 배운 계산과 이 단원에서 새로 배울 계산으로 나누어 보세요.", hints: ["나누는 수가 자연수인 나눗셈은 6학년 1학기에 배웠어요.", "나누는 수가 분수인 나눗셈은 이 단원에서 배워요."],
    render: (b, a) => fd6Sort(b, a, { bins: ["이미 배웠어요", "이 단원에서 배워요"], cards: [
      { t: "[4/5]÷2", k: 0 }, { t: "3÷5", k: 0 }, { t: "[3/4]×[2/5]", k: 0 },
      { t: "[7/9]÷[2/9]", k: 1 }, { t: "6÷[2/3]", k: 1 }, { t: "[4 1/2]÷[3/4]", k: 1 }],
      bad: "나누는 수를 살펴봐요. 나누는 수가 분수이면 이 단원에서 배워요.", ok: "나누는 수가 분수인 나눗셈을 이 단원에서 배워요. 분수의 나눗셈의 계산 방법과 그 원리를 알아봐요!" }) }
},
{
  id: "t2", no: 2, title: "분모가 같은 (분수)÷(분수)를 알아볼까요 ⑴", soop: "개념 구축하기(O)",
  question: "분모가 같고 분자끼리 나누어떨어지는 (분수)÷(분수)는 어떻게 계산할까요?",
  summary: "[7/10]÷[1/10]은 [7/10]에서 [1/10]을 몇 번 덜어 낼 수 있는지와 같아요. [7/10]은 [1/10]이 7개이므로 [7/10]÷[1/10] = 7이에요. [4/9]는 [1/9]이 4개, [2/9]는 [1/9]이 2개이므로 [4/9]÷[2/9] = 4÷2 = 2예요. 분모가 같은 (분수)÷(분수)는 분자끼리 나누어 계산합니다.",
  steps: [
    { name: "만져 보기", inst: "과학 기지에는 식물 공장이 있어요. 덕분에 대원들이 신선한 채소를 먹을 수 있지요. 식물 공장에서 비료 [7/10] kg을 화분 한 개에 [1/10] kg씩 나누어 주려고 해요. 띠를 눌러 [1/10] kg씩 덜어 내 보세요.", hints: ["띠를 누를 때마다 화분 한 개에 [1/10] kg씩 나누어 주어요.", "전체 비료의 양을 화분 한 개에 주는 비료의 양으로 나누어요."],
      render: (b, a) => fd6Scoop(b, a, { A: "7/10", B: "1/10", unit: " kg", word: "화분", aName: "비료 [7/10] kg", bName: "화분 1개 [1/10] kg", ask: [
        ["구하는 식: ", { c: ["[7/10]÷[1/10]", "[7/10]×[1/10]", "[1/10]÷[7/10]"], a: 0 }],
        ["[7/10] kg은 [1/10] kg이 ", { i: "7" }, "개예요. [7/10] kg에서 [1/10] kg을 ", { i: "7" }, "번 덜어 낼 수 있어요."],
        ["[7/10]÷[1/10] = ", { i: "7" }],
        ["비료를 화분 ", { i: "7" }, "개에 나누어 줄 수 있어요."]], ok: "[7/10]÷[1/10] = 7이에요. 화분 7개에 나누어 줄 수 있어요." }) },
    { name: "그려 보기", inst: "[4/9]÷[2/9]를 어떻게 계산하는지 알아봐요. 띠에서 [2/9]씩 덜어 내 보세요.", hints: ["[4/9]는 [1/9]이 4개, [2/9]는 [1/9]이 2개예요.", "[1/9]이 4개인 것을 2개씩 묶으면 몇 묶음일까요?"],
      render: (b, a) => fd6Scoop(b, a, { A: "4/9", B: "2/9", ask: [
        ["[4/9]는 [1/9]이 ", { i: "4" }, "개이고, [2/9]는 [1/9]이 ", { i: "2" }, "개예요."],
        ["[4/9]는 [2/9]가 ", { i: "2" }, "개예요."],
        ["[4/9]÷[2/9] = ", { i: "4" }, "÷", { i: "2" }, " = ", { i: "2" }]], ok: "[4/9]÷[2/9]는 분자끼리 나눈 4÷2와 같아요. 몫은 2예요." }) },
    { name: "말해 보기", inst: "호두파이 [4/5]판을 한 사람에게 [1/5]판씩 나누어 주려고 해요. 그림을 눌러 나누어 주고, 몇 명에게 나누어 줄 수 있는지 친구에게 설명해 보세요.", hints: ["원을 누를 때마다 한 사람에게 [1/5]판씩 나누어 주어요.", "[4/5]는 [1/5]이 몇 개일까요?"],
      render: (b, a) => fd6Pie(b, a, { A: "4/5", B: "1/5", cnt: "명", one: "사람", aName: "호두파이 [4/5]판", bName: "[1/5]판", ask: [
        ["식: [4/5]÷[1/5] = ", { i: "4" }],
        ["설명: [4/5]는 [1/5]이 ", { i: "4" }, "개이므로 ", { c: ["4명", "5명", "1명"], a: 0 }, "에게 나누어 줄 수 있어요."]], ok: "[4/5]는 [1/5]이 4개이므로 4명에게 나누어 줄 수 있어요. 그림으로 덜어 내며 설명했어요." }) },
    { name: "약속하기", inst: "분모가 같은 (분수)÷(분수)의 계산 방법을 약속해요.", hints: ["[4/9]÷[2/9] = 4÷2에서 분모 9는 어떻게 되었나요?"],
      render: (b, a) => blanks(b, a, ["분모가 같은 (분수)÷(분수)는 ", { o: ["분자끼리 나누어", "분모끼리 나누어", "분자끼리 곱하여"], a: 0 }, " 계산합니다. [■/●]÷[▲/●] = ", { o: ["■÷▲", "●÷●", "■×▲"], a: 0 }], { ok: "분모가 같은 (분수)÷(분수)는 분자끼리 나누어 계산합니다." }) },
    { name: "확인하기", inst: "계산해 보세요.", hints: ["분모가 같으니 분자끼리 나누어요.", "[10/17]÷[2/17] = 10÷2예요."],
      render: (b, a) => fd6Calc(b, a, [
        { e: "[2/3]÷[1/3]", n: 2 }, { e: "[8/19]÷[1/19]", n: 8 },
        { e: "[6/7]÷[3/7]", n: 2, why: { "18": "곱하면 안 돼요. 분자끼리 나누어 6÷3을 계산해요.", "3": "6에서 3을 빼면 안 돼요. 6÷3을 계산해요." } }, { e: "[10/17]÷[2/17]", n: 5 }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["[3/4]은 [1/4]이 3개예요. 분모가 같으면 분자끼리 나누어요.", "[15/17]÷[3/17] = 15÷3 = 5예요. 5보다 작은 자연수 중 가장 큰 수는?"],
    render: (b, a) => fd6Calc(b, a, [
      { q: "[3/4]에서 [1/4]을 몇 번 덜어 낼 수 있나요?", e: "[3/4]÷[1/4]", n: 3 },
      { e: "[4/7]÷[1/7]", n: 4 }, { e: "[6/13]÷[2/13]", n: 3 },
      { e: "[18/19]÷[9/19]", n: 2 }, { e: "[18/19]÷[6/19]", n: 3 },
      { q: "몫이 4인 것을 골라요.", pick: ["㉠ [2/5]÷[1/5]", "㉡ [8/15]÷[4/15]", "㉢ [16/21]÷[4/21]"], a: 2, why: { "0": "2÷1 = 2예요.", "1": "8÷4 = 2예요." } },
      { q: "꽃 한 송이를 만드는 데 철사 [3/20] m가 필요해요. 철사 [9/20] m로 꽃을 몇 송이 만들 수 있을까요?", x: "[9/20]÷[3/20]", n: 3, unit: "송이", lab: "[9/20]÷[3/20] =" },
      { q: "[15/17]÷[3/17] > □ 에서 □ 안에 들어갈 수 있는 가장 큰 자연수는?", n: 4, lab: "□ =", why: { "5": "몫은 5예요. 5보다 작아야 하니 5는 들어갈 수 없어요." } }]) }
},
{
  id: "t3", no: 3, title: "분모가 같은 (분수)÷(분수)를 알아볼까요 ⑵", soop: "개념 구축하기(O)",
  question: "분모가 같고 분자끼리 나누어떨어지지 않는 (분수)÷(분수)는 어떻게 계산할까요?",
  summary: "식수 [7/9] L를 [2/9] L 컵에 담으면 3컵과 1컵의 반인 [1/2]컵, 곧 [3 1/2]컵이 돼요. [5/7]÷[2/7]는 [1/7]이 5개인 것을 2개씩 묶는 것과 같아 5÷2 = [5/2] = [2 1/2]이에요. 분자끼리 나누어떨어지지 않으면 몫을 분수로 나타내요. 대분수로 나타내지 않아도 돼요.",
  steps: [
    { name: "만져 보기", inst: "과학 기지에서는 바닷물로 식수를 만들어 마셔요. 식수 [7/9] L를 들이가 [2/9] L인 컵에 옮겨 담으려고 해요. 식수를 모두 옮겨 담으면 몇 컵이 될까요? 띠를 눌러 [2/9] L씩 담아 보세요.", hints: ["두 칸이 한 컵이에요. 남은 한 칸은 한 컵의 얼마만큼일까요?", "1컵의 반은 [1/2]컵이에요."],
      render: (b, a) => fd6Scoop(b, a, { A: "7/9", B: "2/9", unit: " L", cnt: "컵", one: "컵", aName: "식수 [7/9] L", bName: "컵 1개 [2/9] L", ask: [
        ["구하는 식: ", { c: ["[7/9]÷[2/9]", "[2/9]÷[7/9]", "[7/9]×[2/9]"], a: 0 }],
        ["", { i: "3" }, "컵과 1컵의 반인 ", { q: [null, "?1", "?2"] }, "컵이 돼요."],
        ["[7/9]÷[2/9] = ", { q: ["?3", "?1", "2"] }]], ok: "식수를 모두 옮겨 담으면 [3 1/2]컵이 돼요." }) },
    { name: "그려 보기", inst: "[5/7]÷[2/7]를 어떻게 계산하는지 알아봐요. [2/7]씩 묶고, 남는 부분이 한 묶음의 얼마만큼인지 살펴보세요.", hints: ["남는 부분은 한 묶음의 반만큼이에요.", "[5/7]는 [1/7]이 5개, [2/7]는 [1/7]이 2개예요."],
      render: (b, a) => fd6Scoop(b, a, { A: "5/7", B: "2/7", ask: [
        ["[5/7]는 [2/7]씩 ", { i: "2" }, "번 묶을 수 있어요. 남는 부분은 [2/7]의 ", { q: [null, "?1", "?2"] }, "이에요."],
        ["[5/7]÷[2/7] = ", { q: ["?2", "?1", "2"] }],
        ["[5/7]÷[2/7] = ", { i: "5" }, "÷", { i: "2" }, " = ", { q: [null, "?5", "2"] }, " = ", { q: ["?2", "?1", "2"] }]], ok: "[5/7]÷[2/7] = 5÷2 = [5/2] = [2 1/2]이에요. 분자끼리 나누고, 나누어떨어지지 않으면 몫을 분수로 나타내요." }) },
    { name: "말해 보기", inst: "[3/5]÷[4/5]처럼 나누는 수가 더 크면 어떻게 될까요? 띠를 눌러 덜어 내 보고, 몫이 1보다 큰지 작은지 이야기해 보세요.", hints: ["[4/5]만큼은 한 번도 덜어 낼 수 없어요. 남은 부분이 한 묶음의 얼마만큼인지 보세요.", "[3/5]은 [4/5]의 [3/4]만큼이에요."],
      render: (b, a) => fd6Scoop(b, a, { A: "3/5", B: "4/5", ask: [
        ["[3/5]은 [4/5]의 ", { q: [null, "?3", "?4"] }, "만큼이에요."],
        ["[3/5]÷[4/5] = ", { i: "3" }, "÷", { i: "4" }, " = ", { q: [null, "?3", "4"] }],
        ["나누는 수가 나누어지는 수보다 크면 몫은 ", { c: ["1보다 작아요", "1보다 커요"], a: 0 }, "."]], ok: "[3/5]÷[4/5] = 3÷4 = [3/4]이에요. 나누는 수가 더 크면 몫은 1보다 작아요." }) },
    { name: "약속하기", inst: "분모가 같고 분자끼리 나누어떨어지지 않는 (분수)÷(분수)의 계산 방법을 정리해요.", hints: ["5÷2의 몫은 [5/2]처럼 분수로 나타낼 수 있어요."],
      render: (b, a) => blanks(b, a, ["분모가 같은 (분수)÷(분수)는 ", { o: ["분자끼리 나누어", "분모끼리 나누어"], a: 0 }, " 계산해요. 분자끼리 나누어떨어지지 않으면 몫을 ", { o: ["분수로", "소수로만"], a: 0 }, " 나타내요. [■/●]÷[▲/●] = ■÷▲ = ", { o: ["[■/▲]", "[▲/■]"], a: 0 }, "이고, 대분수로 나타내지 않아도 돼요."], { ok: "분모가 같은 (분수)÷(분수)는 분자끼리 나누어 계산하고, 나누어떨어지지 않으면 몫을 분수로 나타내요." }) },
    { name: "확인하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["분자끼리 나누어요. 3÷4 = [3/4]이에요.", "7÷5 = [7/5] = [1 2/5]예요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[3/5]÷[4/5]", a: "3/4", why: { "4/3": "나누는 순서가 바뀌었어요. 3÷4예요." } }, { e: "[2/15]÷[11/15]", a: "2/11" }, { e: "[7/8]÷[5/8]", a: "1 2/5" }, { e: "[7/10]÷[3/10]", a: "2 1/3" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요. 그다음 수 카드 4, 5, 6, 7, 8 중 1장을 골라 □ 안에 써넣어, 첫째 판에는 몫이 가장 큰 나눗셈을, 둘째 판에는 몫이 가장 작은 나눗셈을 만들고 계산해 보세요.", hints: ["분모가 같으면 분자끼리 나누어요. 나누어떨어지지 않으면 몫을 분수로 나타내요.", "수 카드 문제: 분모가 같으니 9÷□를 생각해요. 나누는 수가 작을수록 몫이 커요. 9÷4 = [9/4], 9÷8 = [9/8]예요."],
    /* 수학익힘 12~13쪽 유사 문제(지도서 6-2 183쪽, 2026-10-24 실제 수로 더함) → 다 맞히면 수 카드 문제 */
    render: (b, a) => {
      const top = h("div"), bot = h("div", { class: "hidden" }); b.append(top, bot);
      bot.append(h("div", { class: "jua" }, "잘했어요! 이제 수 카드로 나눗셈을 만들어 보세요."));
      const host = h("div"); bot.append(host);
      let bp = null;
      fd6Calc(top, Object.assign({}, a, { done: () => { if (!bot.classList.contains("hidden")) return; bot.classList.remove("hidden"); if (bp) a.provide(bp); } }), [
        { q: "[9/11]에서 [2/11]를 몇 번 덜어 낼 수 있는지 생각하며 계산해 보세요.", e: "[9/11]÷[2/11]", a: "4 1/2" },
        { q: "계산해 보세요.", e: "[5/7]÷[6/7]", a: "5/6", why: { "6/5": "나누는 순서가 바뀌었어요. 5÷6이에요." } },
        { q: "계산해 보세요.", e: "[7/10]÷[3/10]", a: "2 1/3" },
        { q: "몫이 더 큰 것을 골라요.", pick: ["[5/8]÷[3/8]", "[6/13]÷[7/13]"], a: 0, why: { "1": "[6/13]÷[7/13] = [6/7]로 1보다 작고, [5/8]÷[3/8] = [5/3]로 1보다 커요." } },
        { q: "두 나눗셈의 몫의 차를 구해 보세요. [13/15]÷[11/15], [9/19]÷[11/19]", x: "[13/15]÷[11/15]-[9/19]÷[11/19]", a: "4/11", lab: "몫의 차" },
        { q: "어느 자동차가 일정한 빠르기로 [17/20] km를 가는 데 [9/20]분이 걸렸어요. 같은 빠르기로 1분 동안 갈 수 있는 거리는 몇 km일까요?", x: "[17/20]÷[9/20]", a: "1 8/9", unit: "km", lab: "[17/20]÷[9/20] =" },
        { q: "두 분수의 분모는 12이고, 7÷11을 이용하여 계산할 수 있는 (진분수)÷(진분수)를 골라요.", pick: ["[7/12]÷[11/12]", "[11/12]÷[7/12]", "[7/11]÷[12/11]"], a: 0, why: { "1": "11÷7로 계산하는 나눗셈이에요.", "2": "분모가 12가 아니에요." } },
        { q: "그 나눗셈을 계산해 보세요.", e: "[7/12]÷[11/12]", a: "7/11" }]);
      /* 수 카드 판은 미리 만들어 두고(활동지에도 들어가게) 익힘을 다 맞히면 보여 줌. 정답 보기도 그때 수 카드 답으로 바꿈 */
      fd6Build(host, Object.assign({}, a, { provide: x => { bp = x; } }), { cards: [4, 5, 6, 7, 8], tip: "수 카드를 누른 다음 □를 눌러 넣고, 몫을 써요.", boards: [
          { shape: [[9, 13], [null, 13]], goal: "max", label: "① 몫이 가장 큰 나눗셈" },
          { shape: [[9, 13], [null, 13]], goal: "min", label: "② 몫이 가장 작은 나눗셈" }], ok: "나누는 수가 작을수록 몫이 커요. [9/13]÷[4/13] = [9/4] = [2 1/4], [9/13]÷[8/13] = [9/8] = [1 1/8]이에요." });
    } }
},
{
  id: "t4", no: 4, title: "분모가 다른 (분수)÷(분수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "분모가 다른 (분수)÷(분수)는 어떻게 계산할까요?",
  summary: "어제 주운 쓰레기 [3/5] kg은 오늘 주운 [1/10] kg의 몇 배인지 구하려면 [3/5]÷[1/10]을 계산해요. [3/5]은 [6/10]과 같고 [6/10]은 [1/10]이 6개이므로 6배예요. 분모가 다른 (분수)÷(분수)는 통분한 다음 분자끼리 나누어 계산해요. [3/4]÷[4/7] = [21/28]÷[16/28] = 21÷16 = [21/16] = [1 5/16].",
  steps: [
    { name: "만져 보기", inst: "삼촌이 펭귄 마을에서 쓰레기를 어제는 [3/5] kg, 오늘은 [1/10] kg 주웠어요. 어제 주운 쓰레기의 양은 오늘 주운 쓰레기의 양의 몇 배일까요? 두 띠의 칸 크기가 달라요. 먼저 칸을 나누어 크기를 같게 한 다음 덜어 내 보세요.", hints: ["[1/5]을 똑같이 2칸으로 나누면 한 칸은 [1/10]이에요.", "[3/5]은 [1/10]이 몇 개일까요?"],
      render: (b, a) => fd6Scoop(b, a, { A: "3/5", B: "1/10", unit: " kg", cnt: "배", one: "묶음", aName: "어제 [3/5] kg", bName: "오늘 [1/10] kg", ask: [
        ["구하는 식: ", { c: ["[3/5]÷[1/10]", "[1/10]÷[3/5]", "[3/5]×[1/10]"], a: 0 }],
        ["[3/5] = ", { q: [null, "?6", "10"] }, "이고, [6/10]은 [1/10]이 ", { i: "6" }, "개예요."],
        ["[3/5]÷[1/10] = ", { i: "6" }],
        ["어제 주운 쓰레기의 양은 오늘의 ", { i: "6" }, "배예요."]], ok: "[3/5]을 [6/10]으로 통분하니 분자끼리 나눌 수 있어요. 6배예요." }) },
    { name: "그려 보기", inst: "[3/4]÷[4/7]를 알아봐요. 분모가 다를 때에는 어떻게 할까요? 두 띠의 한 칸이 모두 [1/28]이 되게 나눈 다음 덜어 내 보세요.", hints: ["[1/4]을 7칸으로, [1/7]을 4칸으로 나누면 한 칸은 [1/28]이에요.", "[21/28]에서 [16/28]을 한 번 덜어 내면 5칸이 남아요."],
      render: (b, a) => fd6Scoop(b, a, { A: "3/4", B: "4/7", ask: [
        ["[3/4]÷[4/7] = ", { q: [null, "?21", "28"] }, "÷", { q: [null, "?16", "28"] }, " = ", { i: "21" }, "÷", { i: "16" }, " = ", { q: [null, "?21", "?16"] }, " = ", { q: ["?1", "?5", "16"] }],
        ["분모가 다르면 먼저 ", { c: ["통분하여 분모를 같게 해요", "분자끼리 바로 나누어요"], a: 0 }, "."]], ok: "분모가 다르면 통분한 다음 분자끼리 나누어요. [3/4]÷[4/7] = [21/16] = [1 5/16]예요." }) },
    { name: "말해 보기", inst: "보기의 분수 중 서로 다른 두 개를 골라 문제를 완성하고, 답을 구해 보세요.", hints: ["포도주스의 양을 오렌지주스의 양으로 나누어요.", "통분한 다음 분자끼리 나누어요. 예: [4/7]÷[5/8] = [32/56]÷[35/56] = 32÷35"],
      render: (b, a) => fd6Pose(b, a, { fr: ["1/3", "2/5", "4/7", "5/8"], l1: "포도주스:", l2: "오렌지주스:", s: ["포도주스가 ", " L, 오렌지주스가 ", " L 있습니다. 포도주스의 양은 오렌지주스의 양의 몇 배인가요?"], ansLab: "답:", unit: "배", ok: "문제를 완성하고 답을 구했어요. 친구가 만든 문제와 바꾸어 풀어 보세요." }) },
    { name: "약속하기", inst: "분모가 다른 (분수)÷(분수)의 계산 방법을 약속해요.", hints: ["[3/4]÷[4/7]는 [21/28]÷[16/28]으로 바꾸었어요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 (분수)÷(분수)는 ", { o: ["통분하여", "약분하여"], a: 0 }, " 분모를 같게 한 다음 ", { o: ["분자끼리 나누어", "분모끼리 나누어"], a: 0 }, " 계산합니다."], { ok: "분모가 다른 (분수)÷(분수)는 통분한 다음 분자끼리 나누어 계산합니다." }) },
    { name: "확인하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도, 약분하지 않아도 맞아요.", hints: ["[6/7]÷[3/14] = [12/14]÷[3/14]이에요.", "[5/6]÷[3/8] = [20/24]÷[9/24]예요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[6/7]÷[3/14]", n: 4, why: { "2": "분모가 다른데 분자끼리만 나누었어요. 먼저 통분해요." } }, { e: "[7/10]÷[1/2]", a: "1 2/5" }, { e: "[2/3]÷[3/4]", a: "8/9" }, { e: "[5/6]÷[3/8]", a: "2 2/9" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["[3/4] = [6/8]이에요. 분모가 다르면 통분한 다음 분자끼리 나누어요.", "몫을 하나씩 계산해 비교해요. ㉡ [7/8]÷[1/3] = [21/24]÷[8/24]"],
    render: (b, a) => fd6Calc(b, a, [
      { e: "[3/4]÷[1/8]", n: 6 },
      { e: "[7/18]÷[4/9]", a: "7/8" }, { e: "[9/10]÷[8/15]", a: "1 11/16" }, { e: "[4/7]÷[3/5]", a: "20/21" },
      { q: "몫이 가장 큰 것을 골라요.", pick: ["㉠ [8/21]÷[5/6]", "㉡ [7/8]÷[1/3]", "㉢ [3/4]÷[7/10]"], a: 1, why: { "0": "㉠ = [16/35], ㉡ = [21/8] = [2 5/8], ㉢ = [15/14] = [1 1/14]이에요.", "2": "㉠ = [16/35], ㉡ = [21/8] = [2 5/8], ㉢ = [15/14] = [1 1/14]이에요." } },
      { q: "민수네 집에서 병원까지는 [2/3] km, 공원까지는 [11/12] km예요. 병원까지의 거리는 공원까지의 거리의 몇 배일까요?", x: "[2/3]÷[11/12]", a: "8/11", unit: "배", lab: "[2/3]÷[11/12] =" },
      { q: "수 카드 2, 4, 6, 8 중 1장을 골라 [7/15]÷[□/9]의 □ 안에 써넣어 몫이 가장 큰 (진분수)÷(진분수)를 만들려고 해요. 어떤 카드를 넣을까요?", pick: ["2", "4", "6", "8"], a: 0, why: { "1": "나누는 수가 작을수록 몫이 커요. 4보다 작은 카드가 있어요.", "2": "나누는 수가 작을수록 몫이 커요. 가장 작은 카드를 넣어요.", "3": "8을 넣으면 몫이 가장 작아요. 나누는 수가 작을수록 몫이 커요." } },
      { q: "그때의 몫을 구해 보세요.", e: "[7/15]÷[2/9]", a: "2 1/10" }]) }
},
{
  id: "t5", no: 5, title: "(자연수)÷(분수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(자연수)÷(분수)는 어떻게 계산할까요?",
  summary: "아라온호가 6 km를 가는 데 [2/3]시간이 걸렸다면 1시간 동안 가는 거리는 6÷[2/3]예요. [1/3]시간 동안 6÷2 = 3 (km), 1시간 동안 3×3 = 9 (km)를 가요. (자연수)÷(분수)는 자연수를 분수의 분자로 나누고 분모를 곱하여 계산하거나, 자연수를 나누는 수와 분모가 같은 분수로 바꾼 다음 분자끼리 나누어 계산해요. 6÷[2/3] = (6÷2)×3 = 9, 6÷[2/3] = [18/3]÷[2/3] = 18÷2 = 9.",
  steps: [
    { name: "만져 보기", inst: "아라온호는 바다의 얼음을 깨고 항해하는 배로, 남극 또는 북극에서 연구를 하고 물품을 보급해요. 아라온호가 일정한 빠르기로 6 km를 가는 데 [2/3]시간이 걸렸어요. 같은 빠르기로 1시간 동안 몇 km를 갈 수 있을까요? 먼저 쉬운 수로 생각한 다음, 아래 수직선의 표시를 [1/3]시간, 1시간으로 차례로 옮겨 보세요.", hints: ["[1/3]시간은 [2/3]시간을 2로 나눈 것과 같아요.", "1시간은 [1/3]시간을 3배 한 것과 같아요."],
      render: (b, a) => fd6Double(b, a, { items: [{ Q: "6", a: 2, b: 3, top: " km", bot: "시간", name: "아라온호" }],
        est: { q: "6 km를 가는 데 2시간이 걸렸다면 1시간 동안 몇 km를 갈까요?", o: ["3 km", "12 km", "8 km"], a: 0, why: { "1": "1시간은 2시간보다 짧아요. 6÷2를 계산해요.", "2": "6에 2를 더하면 안 돼요. 6÷2를 계산해요." }, ok: "6÷2 = 3, 1시간 동안 3 km예요. 2시간 대신 [2/3]시간이면 식은 6÷[2/3]예요." },
        ask: [
          ["구하는 식: ", { c: ["6÷[2/3]", "6×[2/3]", "[2/3]÷6"], a: 0 }],
          ["[1/3]시간 동안: 6÷", { i: "2" }, " = ", { i: "3" }, " (km)"],
          ["1시간 동안: 3×", { i: "3" }, " = ", { i: "9" }, " (km)"]], ok: "아라온호는 1시간 동안 9 km를 갈 수 있어요. 6을 [2/3]로 나누었더니 몫이 6보다 커졌어요!" }) },
    { name: "그려 보기", inst: "그림에서 알아낸 것을 이용하여 6÷[2/3]를 두 가지 방법으로 계산해 보세요.", hints: ["그림 이용: 자연수 6을 분자 2로 나누고 분모 3을 곱해요.", "6 = [18/3]이에요."],
      render: (b, a) => fd6Chain(b, a, [
        { t: "그림 이용", p: ["6÷[2/3] = (6÷", { i: "2" }, ")×", { i: "3" }, " = ", { i: "9" }] },
        { t: "분수로 바꾸기", p: ["6÷[2/3] = ", { q: [null, "?18", "3"] }, "÷[2/3] = ", { i: "18" }, "÷", { i: "2" }, " = ", { i: "9" }] },
        ["첫째 방법은 자연수를 분수의 ", { c: ["분자로 나누고 분모를 곱했어요", "분모로 나누고 분자를 곱했어요"], a: 0 }, "."],
        ["둘째 방법은 자연수를 ", { c: ["나누는 수와 분모가 같은 분수로 바꾸고 분자끼리 나누었어요", "자연수끼리 곱했어요"], a: 0 }, "."]],
        { ok: "두 방법 모두 6÷[2/3] = 9예요." }) },
    { name: "말해 보기", inst: "리본 6 m를 [3/4] m씩 나누어 상자를 포장하려고 해요. 1 m를 똑같이 나누어 [3/4] m씩 덜어 내 보고, 상자를 몇 개 포장할 수 있는지 구해 보세요.", hints: ["1 m를 똑같이 4칸으로 나누면 한 칸은 [1/4] m예요.", "6÷[3/4] = (6÷3)×4예요."],
      render: (b, a) => fd6Scoop(b, a, { A: "6", B: "3/4", unit: " m", word: "상자", aName: "리본 6 m", bName: "상자 1개 [3/4] m", ask: [
        ["6÷[3/4] = (6÷", { i: "3" }, ")×", { i: "4" }, " = ", { i: "8" }],
        ["상자를 ", { i: "8" }, "개 포장할 수 있어요."]], ok: "6÷[3/4] = 8이에요. 상자 8개를 포장할 수 있어요." }) },
    { name: "약속하기", inst: "(자연수)÷(분수)의 계산 방법을 정리해요.", hints: ["6÷[2/3] = (6÷2)×3, 6÷[2/3] = [18/3]÷[2/3]를 떠올려요."],
      render: (b, a) => blanks(b, a, ["(자연수)÷(분수)는 자연수를 분수의 ", { o: ["분자로 나누고 분모를 곱하여", "분모로 나누고 분자를 곱하여"], a: 0 }, " 계산하거나, 자연수를 나누는 수와 ", { o: ["분모가 같은 분수로", "분자가 같은 분수로"], a: 0 }, " 바꾼 다음 분자끼리 나누어 계산해요."], { ok: "(자연수)÷(분수)를 두 가지 방법으로 계산할 수 있어요." }) },
    { name: "확인하기", inst: "계산해 보세요.", hints: ["9÷[1/5] = (9÷1)×5예요.", "24÷[8/11] = (24÷8)×11이에요."],
      render: (b, a) => fd6Calc(b, a, [
        { e: "9÷[1/5]", n: 45, why: { "9/5": "곱셈을 했어요. 9를 분자 1로 나누고 분모 5를 곱해요." } }, { e: "3÷[3/7]", n: 7 },
        { e: "14÷[7/10]", n: 20 }, { e: "24÷[8/11]", n: 33 }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["12÷[2/3] = (12÷2)×3이에요.", "6÷[□/13] = (6÷□)×13 = [78/□]이 자연수가 되려면 □는 78의 약수예요."],
    render: (b, a) => fd6Calc(b, a, [
      { e: "12÷[2/3]", n: 18 }, { e: "5÷[1/6]", n: 30 }, { e: "21÷[7/8]", n: 24 }, { e: "18÷[9/11]", n: 22 },
      { q: "몫이 다른 것을 골라요.", pick: ["㉠ 4÷[1/3]", "㉡ 8÷[2/3]", "㉢ 10÷[5/8]", "㉣ 9÷[3/4]"], a: 2, why: { "0": "4÷[1/3] = (4÷1)×3 = 12예요. ㉡, ㉣도 12예요.", "1": "8÷[2/3] = (8÷2)×3 = 12예요. ㉠, ㉣도 12예요.", "3": "9÷[3/4] = (9÷3)×4 = 12예요. ㉠, ㉡도 12예요." } },
      { q: "서연이는 색 테이프 15 m를 [5/6] m씩 잘랐어요. 색 테이프는 몇 도막이 될까요?", x: "15÷[5/6]", n: 18, unit: "도막", lab: "15÷[5/6] =" },
      { q: "6÷[□/13]의 몫이 자연수일 때, □ 안에 들어갈 수 있는 9보다 작은 자연수를 모두 고른 것은?", pick: ["1, 2, 3, 6", "1, 2, 3, 4, 6", "2, 3, 6", "1, 2, 3, 6, 8"], a: 0, why: { "1": "6÷[4/13] = [78/4]은 자연수가 아니에요.", "2": "6÷[1/13] = 78도 자연수예요.", "3": "6÷[8/13] = [78/8]은 자연수가 아니에요." } }]) }
},
{
  id: "t6", no: 6, title: "(분수)÷(분수)를 분수의 곱셈으로 나타내어 볼까요", soop: "탐구 정리하기(O)",
  question: "(분수)÷(분수)를 분수의 곱셈으로 어떻게 나타낼 수 있을까요?",
  summary: "바닷물 [4/5] L로 수조의 [2/3]가 찼다면, 수조의 [1/3]에는 [4/5]÷2 = [2/5] (L), 수조 가득은 [2/5]×3 = [6/5] = [1 1/5] (L)이에요. [4/5]÷[2/3] = [4/5]÷2×3 = [4/5]×[1/2]×3 = [4/5]×[3/2]. (분수)÷(분수)를 분수의 곱셈으로 나타내어 계산할 때에는 나눗셈을 곱셈으로 바꾸고 나누는 분수의 분자와 분모를 바꾸어 계산합니다.",
  steps: [
    { name: "만져 보기", inst: "과학 기지에서 바닷물을 연구한 결과는 기후 변화의 연구 자료로 쓰여요. 바닷물 [4/5] L를 빈 수조에 옮겨 담았더니 수조의 [2/3]만큼 찼어요. 수조를 가득 채울 수 있는 바닷물은 몇 L일까요? 아래 수직선의 표시를 수조의 [1/3], 수조 1개로 차례로 옮겨 보세요.", hints: ["수조의 [1/3]만큼은 수조의 [2/3]만큼을 2로 나눈 것과 같아요.", "수조를 가득 채우는 양은 수조의 [1/3]만큼 들어 있는 양을 3배 한 것과 같아요."],
      render: (b, a) => fd6Double(b, a, { items: [{ Q: "4/5", a: 2, b: 3, top: " L", bot: "수조", pre: "수조", name: "바닷물" }], ask: [
        ["구하는 식: ", { c: ["[4/5]÷[2/3]", "[4/5]×[2/3]", "[2/3]÷[4/5]"], a: 0 }],
        ["수조의 [1/3]만큼: [4/5]÷", { i: "2" }, " = ", { q: [null, "?2", "5"] }, " (L)"],
        ["수조 가득: [2/5]×", { i: "3" }, " = ", { q: [null, "?6", "5"] }, " = ", { q: ["?1", "?1", "5"] }, " (L)"]], ok: "수조를 가득 채울 수 있는 바닷물은 [1 1/5] L예요." }) },
    { name: "그려 보기", inst: "그림에서 한 계산을 이어서 [4/5]÷[2/3]를 분수의 곱셈으로 나타내 보세요. ÷2는 ×[1/2]로 나타낼 수 있어요.", hints: ["[4/5]÷2 = [4/5]×[1/2]이에요.", "×[1/2]×3은 ×[3/2]과 같아요."],
      render: (b, a) => fd6Chain(b, a, [
        ["[4/5]÷[2/3] = [4/5]÷", { i: "2" }, "×", { i: "3" }, " = [4/5]×", { q: [null, "?1", "?2"] }, "×3 = [4/5]×", { q: [null, "?3", "?2"] }, " = ", { q: [null, "?6", "5"] }, " = ", { q: ["?1", "?1", "5"] }],
        ["[4/5]÷[2/3]를 [4/5]×[3/2]으로 나타낼 수 ", { c: ["있어요", "없어요"], a: 0 }, ". [4/5]에 [1/2]을 곱하고 3배 하기 때문이에요."]],
        { ok: "[4/5]÷[2/3] = [4/5]×[3/2]이에요. 나누는 분수 [2/3]의 분자와 분모가 바뀌었어요!" }) },
    { name: "말해 보기", inst: "나눗셈을 곱셈으로 바꾸어 보세요. ÷를 누르면 ×로, 분수를 누르면 분자와 분모가 바뀌어요. 어느 분수를 바꾸어야 할지 친구와 이야기해 보세요.", hints: ["분자와 분모를 바꾸는 것은 나누는 수(÷ 뒤의 분수)예요.", "[5/6]÷[2/7] = [5/6]×[7/2]이에요."],
      render: (b, a) => fd6Flip(b, a, { rows: [{ A: "4/5", B: "2/3" }, { A: "5/6", B: "2/7" }, { A: "5/12", B: "5/6" }] }) },
    { name: "약속하기", inst: "(분수)÷(분수)를 분수의 곱셈으로 나타내는 방법을 약속해요.", hints: ["[4/5]÷[2/3] = [4/5]×[3/2]에서 무엇이 바뀌었나요?"],
      render: (b, a) => blanks(b, a, ["(분수)÷(분수)를 분수의 곱셈으로 나타내어 계산할 때에는 나눗셈을 ", { o: ["곱셈으로", "덧셈으로"], a: 0 }, " 바꾸고 ", { o: ["나누는 분수의", "나누어지는 분수의", "두 분수의"], a: 0 }, " 분자와 분모를 바꾸어 계산합니다. [■/●]÷[▲/♥] = ", { o: ["[■/●]×[♥/▲]", "[●/■]×[▲/♥]", "[■/●]×[▲/♥]"], a: 0 }], { ok: "나눗셈을 곱셈으로 바꾸고 나누는 분수의 분자와 분모를 바꾸어 계산합니다." }) },
    { name: "확인하기", inst: "분수의 곱셈으로 나타내어 계산해 보세요. 약분할 수 있으면 먼저 약분해도 돼요.", hints: ["[3/7]÷[4/11] = [3/7]×[11/4]이에요.", "[8/21]÷[2/7] = [8/21]×[7/2]에서 8과 2, 21과 7을 약분해요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[3/7]÷[4/11]", a: "1 5/28" }, { e: "[7/10]÷[2/3]", a: "1 1/20" }, { e: "[8/21]÷[2/7]", a: "1 1/3" }, { e: "[2/9]÷[4/15]", a: "5/6" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["(평행사변형의 넓이) = (밑변의 길이)×(높이)이므로 (밑변의 길이) = (넓이)÷(높이)예요.", "㉡은 나누어지는 수 [3/4]의 분자와 분모를 바꾸었어요."],
    render: (b, a) => fd6Calc(b, a, [
      { e: "[1/8]÷[5/9]", a: "9/40" }, { e: "[13/16]÷[3/4]", a: "1 1/12" },
      { q: "옳게 계산한 것을 골라요.", pick: ["㉠ [5/12]÷[5/6] = [5/12]×[6/5] = [1/2]", "㉡ [3/4]÷[11/18] = [4/3]×[11/18] = [22/27]"], a: 0, why: { "1": "㉡은 나누어지는 수의 분자와 분모를 바꾸었어요. [3/4]÷[11/18] = [3/4]×[18/11] = [27/22]이에요." } },
      { q: "넓이가 [7/10] m²이고 높이가 [3/5] m인 평행사변형의 밑변의 길이는 몇 m일까요?", x: "[7/10]÷[3/5]", a: "1 1/6", unit: "m", lab: "[7/10]÷[3/5] =" }]) }
},
{
  id: "t7", no: 7, title: "(대분수)÷(분수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(대분수)÷(분수)는 어떻게 계산할까요?",
  summary: "운석 [4 1/2] g을 페트리 접시 한 개에 [3/4] g씩 담으려면 [4 1/2]÷[3/4]을 계산해요. 하윤이처럼 [9/2]÷[3/4] = [18/4]÷[3/4] = 18÷3 = 6으로 통분하여 계산하거나, 재민이처럼 [9/2]÷[3/4] = [9/2]×[4/3] = 6으로 분수의 곱셈으로 계산해요. (대분수)÷(분수)는 대분수를 가분수로 바꾼 다음 통분하여 분자끼리 나누거나 분수의 곱셈으로 나타내어 계산해요.",
  steps: [
    { name: "만져 보기", inst: "남극에서 많이 발견되는 운석은 우주 환경을 파악하는 자료로 쓰여요. 운석 [4 1/2] g을 페트리 접시 한 개에 [3/4] g씩 나누어 담으려고 해요. 필요한 페트리 접시는 몇 개일까요? 칸의 크기를 같게 한 다음 [3/4] g씩 덜어 내 보세요.", hints: ["[1/2]을 똑같이 2칸으로 나누면 [1/4]이에요.", "[4 1/2] = [9/2] = [18/4]이에요. [3/4]은 [1/4]이 3개예요."],
      render: (b, a) => fd6Scoop(b, a, { A: "4 1/2", B: "3/4", unit: " g", word: "접시", aName: "운석 [4 1/2] g", bName: "접시 1개 [3/4] g", ask: [
        ["구하는 식: ", { c: ["[4 1/2]÷[3/4]", "[3/4]÷[4 1/2]", "[4 1/2]×[3/4]"], a: 0 }],
        ["[4 1/2] = ", { q: [null, "?9", "2"] }, " = ", { q: [null, "?18", "4"] }],
        ["필요한 페트리 접시는 ", { i: "6" }, "개예요."]], ok: "[4 1/2] g은 [3/4] g씩 6번 덜어 낼 수 있어요. 페트리 접시 6개가 필요해요." }) },
    { name: "그려 보기", inst: "하윤이와 재민이가 [4 1/2]÷[3/4]을 서로 다른 방법으로 계산했어요. 빈칸을 채워 보세요.", hints: ["두 사람 모두 먼저 대분수를 가분수로 바꾸었어요.", "재민이는 나누는 분수 [3/4]의 분자와 분모를 바꾸어 곱했어요."],
      render: (b, a) => fd6Chain(b, a, [
        { t: "하윤", p: ["“통분하여 계산해 볼까?” [4 1/2]÷[3/4] = ", { q: [null, "?9", "2"] }, "÷[3/4] = ", { q: [null, "?18", "4"] }, "÷[3/4] = ", { i: "18" }, "÷", { i: "3" }, " = ", { i: "6" }] },
        { t: "재민", p: ["“분수의 곱셈으로 나타내어 계산해 볼까?” [4 1/2]÷[3/4] = [9/2]÷[3/4] = [9/2]×", { q: [null, "?4", "?3"] }, " = ", { i: "6" }] },
        ["두 사람 모두 먼저 대분수를 ", { c: ["가분수로 바꾸었어요", "자연수와 분수로 나누었어요"], a: 0 }, "."]],
        { ok: "두 방법 모두 [4 1/2]÷[3/4] = 6이에요." }) },
    { name: "말해 보기", inst: "[2 3/4]÷[1 1/5]을 두 가지 방법으로 계산해 보세요. 어떤 방법이 더 편리한지 친구와 이야기해 보세요.", hints: ["[2 3/4] = [11/4], [1 1/5] = [6/5]이에요.", "[11/4]과 [6/5]의 공통분모는 20이에요."],
      render: (b, a) => fd6Chain(b, a, [
        { t: "방법 1", p: ["[2 3/4]÷[1 1/5] = ", { q: [null, "?11", "4"] }, "÷", { q: [null, "?6", "5"] }, " = ", { q: [null, "?55", "20"] }, "÷", { q: [null, "?24", "20"] }, " = ", { i: "55" }, "÷", { i: "24" }, " = ", { q: [null, "?55", "24"] }, " = ", { q: ["?2", "?7", "24"] }] },
        { t: "방법 2", p: ["[2 3/4]÷[1 1/5] = [11/4]÷[6/5] = [11/4]×", { q: [null, "?5", "?6"] }, " = ", { q: [null, "?55", "24"] }, " = ", { q: ["?2", "?7", "24"] }] },
        ["두 방법 중 어느 하나만 맞는 것이 ", { c: ["아니에요. 둘 다 맞아요", "맞아요"], a: 0 }, "."]],
        { ok: "두 방법 모두 [2 7/24]이에요. 편리한 방법을 골라 계산해요." }) },
    { name: "약속하기", inst: "(대분수)÷(분수)의 계산 방법을 정리해요.", hints: ["하윤이와 재민이가 가장 먼저 한 일을 떠올려요."],
      render: (b, a) => blanks(b, a, ["(대분수)÷(분수)는 대분수를 ", { o: ["가분수로", "진분수로"], a: 0 }, " 바꾼 다음 ", { o: ["통분하여 분자끼리 나누거나", "자연수끼리 나누거나"], a: 0 }, " 분수의 곱셈으로 나타내어 계산해요."], { ok: "대분수를 가분수로 바꾼 다음 통분하여 분자끼리 나누거나 분수의 곱셈으로 나타내어 계산해요." }) },
    { name: "확인하기", inst: "계산해 보세요. 편리한 방법으로 계산하고, 가분수로 써도 대분수로 써도 맞아요.", hints: ["먼저 대분수를 가분수로 바꾸어요.", "[1 2/5]÷[2 5/8] = [7/5]×[8/21]에서 7과 21을 약분해요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[1 2/9]÷[5/6]", a: "1 7/15" }, { e: "[2 1/4]÷[3/7]", a: "5 1/4" }, { e: "[2 1/3]÷[1 3/5]", a: "1 11/24" }, { e: "[1 2/5]÷[2 5/8]", a: "8/15" }]) }
  ],
  challenge: { inst: "소민이는 쌀 [10 1/2] kg을 한 통에 [1 3/4] kg씩 담아 기부하려고 해요. 필요한 통은 몇 통일까요? 수학익힘 문제도 풀어 보세요.", hints: ["[10 1/2] = [21/2], [1 3/4] = [7/4]이에요.", "어떤 수 × [5/8] = [2 1/12]이므로 어떤 수 = [2 1/12]÷[5/8]예요."],
    render: (b, a) => fd6Calc(b, a, [
      { q: "소민이에게 필요한 통은 몇 통일까요?", x: "[10 1/2]÷[1 3/4]", n: 6, unit: "통", lab: "[10 1/2]÷[1 3/4] =" },
      { e: "[1 1/3]÷[5/8]", a: "2 2/15" }, { e: "[3 3/4]÷[1 4/5]", a: "2 1/12" },
      { q: "몫의 크기를 비교해 보세요. [2 2/15]÷[1 1/7] ○ [2 3/5]÷[1 1/2]", pick: [">", "=", "<"], a: 0, why: { "1": "[2 2/15]÷[1 1/7] = [28/15] = [1 13/15], [2 3/5]÷[1 1/2] = [26/15] = [1 11/15]이에요.", "2": "[2 2/15]÷[1 1/7] = [28/15] = [1 13/15], [2 3/5]÷[1 1/2] = [26/15] = [1 11/15]이에요. 왼쪽이 더 커요." } },
      { q: "[16/5], [4 1/6], [5/7] 중에서 가장 큰 수를 가장 작은 수로 나눈 몫을 구해 보세요.", x: "[4 1/6]÷[5/7]", a: "5 5/6", lab: "몫" },
      { q: "멜론의 무게는 [3 1/2] kg, 배추의 무게는 [1 5/6] kg이에요. 멜론의 무게는 배추의 무게의 몇 배일까요?", x: "[3 1/2]÷[1 5/6]", a: "1 10/11", unit: "배", lab: "[3 1/2]÷[1 5/6] =" },
      { q: "어떤 수를 [5/8]로 나누어야 할 것을 잘못하여 곱했더니 [2 1/12]이 되었어요. 바르게 계산한 값은?", x: "[2 1/12]÷[5/8]÷[5/8]", a: "5 1/3", lab: "바르게 계산한 값" }]) }
},
{
  id: "t89", no: "8~9", title: "생각을 더하다 ― 어느 가게에서 사는 것이 더 저렴할까요", soop: "탐구 정리하기(O)",
  question: "두 가게 중 어느 가게에서 채소를 사는 것이 더 저렴할까요?",
  summary: "양이 다른 두 가게의 값을 비교하려면 1 kg의 가격을 구해 비교해요. 초록 가게 당근 1 kg은 1200÷[2/5] = (1200÷2)×5 = 3000(원), 싱싱 가게 당근 1 kg은 2000÷[5/8] = (2000÷5)×8 = 3200(원)이므로 초록 가게가 더 저렴해요. 달콤 가게 무 1 kg은 900÷[3/4] = 1200(원), 새콤 가게 무 1 kg은 1600÷[8/9] = 1800(원)이므로 달콤 가게가 더 저렴해요.",
  steps: [
    { name: "이해해요", inst: "초록 가게에서는 당근 [2/5] kg을 1200원에, 싱싱 가게에서는 당근 [5/8] kg을 2000원에 팔아요. 어느 가게에서 당근을 사는 것이 더 저렴할까요?", hints: ["두 가게의 당근 양이 달라서 값만 보고는 비교할 수 없어요.", "같은 양, 곧 1 kg의 가격으로 비교해요."],
      render: (b, a) => quiz(b, a, [
        { q: "구하려는 것은 무엇인가요?", o: ["어느 가게에서 당근을 사는 것이 더 저렴한지", "당근을 모두 몇 kg 살 수 있는지", "두 가게 당근 값의 합"], a: 0, why: { "1": "산 당근의 양을 묻지 않았어요.", "2": "값을 더하는 문제가 아니에요." } },
        { q: "무엇을 비교하면 될까요?", o: ["두 가게 당근 1 kg의 가격", "두 가게 당근의 값(1200원과 2000원)", "두 가게 당근의 양"], a: 0, why: { "1": "당근의 양이 서로 달라서 값만 비교하면 안 돼요.", "2": "양만 비교하면 어느 가게가 저렴한지 알 수 없어요." } }],
        { ok: "두 가게 당근 1 kg의 가격을 비교하면 돼요." }) },
    { name: "계획해요", inst: "당근 1 kg의 가격을 구하는 식을 세워 보세요. “당근 5 kg이 1000원이라면 1 kg의 가격은 1000÷5 = 200(원)이야.”", hints: ["(1 kg의 가격) = (값)÷(당근의 양)이에요.", "자연수로 바꾸어 생각한 1000÷5처럼 값을 양으로 나누어요."],
      render: (b, a) => blanks(b, a, ["초록 가게 당근 1 kg의 가격: ", { o: ["1200÷[2/5]", "[2/5]÷1200", "1200×[2/5]"], a: 0 }, " / 싱싱 가게 당근 1 kg의 가격: ", { o: ["2000÷[5/8]", "[5/8]÷2000", "2000×[5/8]"], a: 0 }], { ok: "값을 당근의 양으로 나누면 1 kg의 가격이에요." }) },
    { name: "해결해요", inst: "두 그림에서 표시를 차례로 옮겨 당근 1 kg의 가격을 구하고, 더 저렴한 가게를 골라 보세요.", hints: ["초록 가게: [1/5] kg은 1200÷2 = 600(원), 1 kg은 600×5 = 3000(원)이에요.", "싱싱 가게: [1/8] kg은 2000÷5 = 400(원), 1 kg은 400×8 = 3200(원)이에요."],
      render: (b, a) => fd6Double(b, a, { items: [{ Q: "1200", a: 2, b: 5, top: "원", bot: " kg", name: "초록 가게 당근" }, { Q: "2000", a: 5, b: 8, top: "원", bot: " kg", name: "싱싱 가게 당근" }], ask: [
        { t: "초록", p: ["1200÷[2/5] = (1200÷", { i: "2" }, ")×", { i: "5" }, " = ", { i: "3000" }] },
        { t: "싱싱", p: ["2000÷[5/8] = (2000÷", { i: "5" }, ")×", { i: "8" }, " = ", { i: "3200" }] },
        ["1 kg의 가격이 더 싼 ", { c: ["초록 가게", "싱싱 가게"], a: 0 }, "에서 사는 것이 더 저렴해요."]], ok: "초록 가게 당근은 1 kg에 3000원, 싱싱 가게 당근은 1 kg에 3200원이에요. 초록 가게가 더 저렴해요." }) },
    { name: "한 번 더 해요", inst: "달콤 가게에서는 무 [3/4] kg을 900원에, 새콤 가게에서는 무 [8/9] kg을 1600원에 팔아요. 어느 가게에서 무를 사는 것이 더 저렴할까요?", hints: ["900÷[3/4] = (900÷3)×4예요.", "1600÷[8/9] = (1600÷8)×9예요."],
      render: (b, a) => fd6Calc(b, a, [
        { q: "달콤 가게 무 1 kg의 가격", e: "900÷[3/4]", n: 1200, unit: "원", why: { "675": "곱셈을 했어요. 값을 무의 양으로 나누어요." } },
        { q: "새콤 가게 무 1 kg의 가격", e: "1600÷[8/9]", n: 1800, unit: "원" },
        { q: "더 저렴한 가게는?", pick: ["달콤 가게", "새콤 가게"], a: 0, why: { "1": "1 kg의 가격이 1200원 < 1800원이에요." } }], { ok: "달콤 가게 무 1 kg은 1200원, 새콤 가게 무 1 kg은 1800원이에요. 달콤 가게가 더 저렴해요." }) },
    { name: "되돌아봐요", inst: "문제를 잘 해결했나요? 다른 방법으로도 풀어 보고, 조건을 바꾸어 생각해 보세요.", hints: ["1200 = [6000/5]이에요. 자연수를 분모가 같은 분수로 바꾸어 분자끼리 나눌 수 있어요.", "1800÷[5/8] = (1800÷5)×8이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "1200÷[2/5]를 다른 방법으로 계산한 것으로 알맞은 것은?", o: ["[6000/5]÷[2/5] = 6000÷2 = 3000", "1200×[2/5] = 480", "[2/5]÷1200 = [1/3000]"], a: 0, why: { "1": "곱하면 1 kg이 아니라 [2/5] kg의 가격을 또 줄이게 돼요.", "2": "나누는 순서가 바뀌었어요." } },
        { q: "싱싱 가게가 당근 [5/8] kg을 1800원에 판다면, 어느 가게가 더 저렴할까요?", o: ["싱싱 가게(1 kg에 2880원)", "초록 가게(1 kg에 3000원)"], a: 0, why: { "1": "1800÷[5/8] = (1800÷5)×8 = 2880(원)이에요. 3000원보다 싸요." } }],
        { ok: "분수의 나눗셈으로 1 kg의 가격을 구하면 양이 달라도 값을 비교할 수 있어요." }) }
  ],
  challenge: { inst: "이 앱이 정한 새 문제예요. 해님 가게에서는 고구마 [3/4] kg을 2400원에, 달님 가게에서는 고구마 [2/3] kg을 2000원에 팔아요. 어느 가게에서 사는 것이 더 저렴할까요?", hints: ["2400÷[3/4] = (2400÷3)×4예요.", "2000÷[2/3] = (2000÷2)×3이에요."],
    render: (b, a) => fd6Calc(b, a, [
      { q: "해님 가게 고구마 1 kg의 가격", e: "2400÷[3/4]", n: 3200, unit: "원" },
      { q: "달님 가게 고구마 1 kg의 가격", e: "2000÷[2/3]", n: 3000, unit: "원" },
      { q: "더 저렴한 가게는?", pick: ["해님 가게", "달님 가게"], a: 1, why: { "0": "1 kg의 가격이 3200원 > 3000원이에요. 값이 2000원으로 더 싸 보이는 것과 1 kg의 가격은 달라요." } }], { ok: "달님 가게가 1 kg에 3000원으로 더 저렴해요." }) }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 다를까요, 같을까요", soop: "발표하기(P)",
  question: "수 카드로 친구와 다른 분수의 나눗셈을 만들고 옳게 계산할 수 있나요?",
  summary: "4~6명이 모둠을 이루어 수 카드 세트를 고르고, 세트의 수 카드를 한 번씩 모두 사용하여 분수의 나눗셈을 만들고 계산해요. 같은 나눗셈이 없으면 2점, 같은 나눗셈이 있으면 1점, 옳게 계산하면 1점을 더 얻어요. 6회 동안 얻은 점수의 합이 가장 큰 사람이 이겨요. 이기려면 친구들과 서로 다른 나눗셈을 만들고 옳게 계산해야 해요. 속도보다 정확하게 계산해요.",
  steps: [
    { name: "놀이 방법", inst: "놀이 방법을 차례대로 눌러 보세요. 인원은 4~6명이고, 활동지(수 카드)를 써요.", hints: ["수 카드 세트를 고르는 것이 먼저예요.", "점수는 활동지를 친구들과 함께 확인한 다음에 얻어요."],
      render: (b, a) => sequence(b, a, ["각자 작성한 활동지를 친구들과 함께 확인하고 규칙에 따라 점수를 얻어요.", "모둠별로 보기 중 수 카드 한 세트를 골라요.", "6회 동안 얻은 점수의 합이 가장 큰 사람이 이겨요.", "고른 세트의 수 카드를 한 번씩 모두 사용하여 각자 분수의 나눗셈을 만들고 계산해요.", "위의 과정을 6회 반복해요. 사용한 수 카드 세트는 다시 사용하지 않아요."], [1, 3, 0, 4, 2], { ok: "같은 나눗셈이 없으면 2점, 있으면 1점, 옳게 계산하면 1점을 더 얻어요." }) },
    { name: "점수 매기기", inst: "수 카드 3, 4, 5, 7로 네 친구가 만든 1회 활동지예요(교과서 예시). 규칙에 따라 각 친구의 점수를 매겨 보세요. 규칙: 같은 나눗셈이 없으면 2점, 있으면 1점, 옳게 계산하면 1점 추가.", hints: ["[3/5]÷[4/7]는 두 사람이 만들었어요.", "[3/5]÷[4/7] = [21/20], [5/7]÷[3/4] = [20/21], [3/7]÷[4/5] = [15/28]예요."],
      render: (b, a) => quiz(b, a, [
        { q: "가: [3/5]÷[4/7] = [1 1/20]", fig: fd6Sheets, o: ["1점", "2점", "3점"], a: 1, why: { "0": "같은 나눗셈이 있어서 1점, 옳게 계산해서 1점 더해 2점이에요.", "2": "[3/5]÷[4/7]를 만든 친구가 또 있어요. 같은 나눗셈이 있으면 1점이에요." } },
        { q: "나: [5/7]÷[3/4] = [15/28]", o: ["1점", "2점", "3점"], a: 1, why: { "0": "같은 나눗셈이 없으니 2점이에요. 계산은 틀렸으니 더하지 않아요.", "2": "[5/7]÷[3/4] = [5/7]×[4/3] = [20/21]이에요. 계산이 틀려서 1점을 더하지 않아요." } },
        { q: "다: [3/5]÷[4/7] = [12/35]", o: ["1점", "2점", "3점"], a: 0, why: { "1": "[12/35]는 곱셈을 한 값이라 틀렸어요. 같은 나눗셈이 있으니 1점뿐이에요.", "2": "같은 나눗셈이 있고 계산도 틀렸어요." } },
        { q: "라: [3/7]÷[4/5] = [15/28]", o: ["1점", "2점", "3점"], a: 2, why: { "0": "[3/7]÷[4/5]를 만든 친구는 라뿐이에요.", "1": "[3/7]÷[4/5] = [3/7]×[5/4] = [15/28]로 옳게 계산했어요. 1점을 더해요." } }],
        { ok: "가 2점, 나 2점, 다 1점, 라 3점이에요." }) },
    { name: "잘못 찾기", inst: "다와 나의 계산이 왜 틀렸는지 살펴보고 바르게 고쳐 보세요.", hints: ["다는 [3/5]÷[4/7]를 [3/5]×[4/7]로 계산했어요.", "나누는 분수의 분자와 분모를 바꾸어 곱해요."],
      render: (b, a) => fd6Chain(b, a, [
        ["다가 틀린 까닭: ", { c: ["나누는 분수를 그대로 곱했어요", "통분을 잘못했어요"], a: 0 }],
        ["[3/5]÷[4/7] = [3/5]×", { q: [null, "?7", "?4"] }, " = ", { q: [null, "?21", "20"] }, " = ", { q: ["?1", "?1", "20"] }],
        ["[5/7]÷[3/4] = [5/7]×", { q: [null, "?4", "?3"] }, " = ", { q: [null, "?20", "21"] }]],
        { ok: "잘못 계산하면 모둠 친구들과 함께 틀린 곳을 찾아 고쳐요." }) },
    { name: "다르게 만들기", inst: "같은 수 카드 3, 4, 5, 7로, 네 친구와 다른 나눗셈을 만들고 옳게 계산해 보세요. 친구들이 만든 나눗셈: [3/5]÷[4/7], [5/7]÷[3/4], [3/7]÷[4/5]", hints: ["진분수뿐 아니라 가분수도 만들 수 있어요. 예: [7/3]÷[5/4]", "나누는 분수의 분자와 분모를 바꾸어 곱해요."],
      render: (b, a) => fd6Build(b, a, { cards: [3, 4, 5, 7], boards: [{ shape: [[null, null], [null, null]], goal: "any", avoid: ["3/5÷4/7", "5/7÷3/4", "3/7÷4/5"], label: "나만의 나눗셈" }], ok: "친구와 다른 나눗셈을 만들어 옳게 계산했으니 3점을 얻을 수 있어요!" }) },
    { name: "놀이하기", inst: "6회 놀이를 해요. 수 카드 여섯 세트는 교과서 보기 그대로이고, 1회 친구 활동지는 교과서 예시, 2~6회 친구 활동지는 이 앱이 정한 것이에요. 6판 중 4판 이상 옳게 계산하면 통과예요.", hints: ["친구와 다른 나눗셈을 만들면 2점이에요.", "몫은 나누는 분수의 분자와 분모를 바꾸어 곱하거나, 통분하여 분자끼리 나누어 구해요."],
      render: (b, a) => fd6Game(b, a, { need: 4, sets: FD6_SETS }) }
  ],
  challenge: { inst: "또 다른 놀이 방법이에요. 주사위를 4번 던져 나온 수를 한 번씩 모두 사용하여 분수의 나눗셈을 만들고 계산해 보세요.", hints: ["나온 수가 같으면 같은 수를 두 번 써요.", "몫은 가분수로 써도, 대분수로 써도 맞아요."],
    render: (b, a) => fd6Dice(b, a, {}) }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분수의 나눗셈을 잘 할 수 있나요?",
  summary: "분모가 같은 (분수)÷(분수)는 분자끼리 나누어요. 분모가 다르면 통분한 다음 분자끼리 나누어요. (자연수)÷(분수)는 자연수를 분자로 나누고 분모를 곱해요. (분수)÷(분수)는 나누는 분수의 분자와 분모를 바꾸어 곱해도 돼요. (대분수)÷(분수)는 대분수를 가분수로 바꾸어 계산해요.",
  steps: [
    { name: "단위분수의 개수", inst: "[8/11]÷[2/11]를 띠에서 덜어 내 보고 계산해 보세요.", hints: ["[8/11]은 [1/11]이 8개예요.", "8÷2를 계산해요."],
      render: (b, a) => fd6Scoop(b, a, { A: "8/11", B: "2/11", ask: [
        ["[8/11]은 [1/11]이 ", { i: "8" }, "개이고, [2/11]는 [1/11]이 ", { i: "2" }, "개예요."],
        ["[8/11]÷[2/11] = ", { i: "8" }, "÷", { i: "2" }, " = ", { i: "4" }]], ok: "[8/11]÷[2/11] = 8÷2 = 4예요." }) },
    { name: "계산하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도, 약분하지 않아도 맞아요.", hints: ["[5/7]÷[5/14] = [10/14]÷[5/14]예요.", "[1 3/4]÷[7/9] = [7/4]×[9/7]예요."],
      render: (b, a) => fd6Calc(b, a, [{ e: "[3/8]÷[7/8]", a: "3/7" }, { e: "[5/7]÷[5/14]", n: 2 }, { e: "20÷[5/13]", n: 52 }, { e: "[1 3/4]÷[7/9]", a: "2 1/4" }]) },
    { name: "몫 잇기", inst: "나눗셈의 몫을 찾아 이어 보세요.", hints: ["[1 2/7]÷[1 1/2] = [9/7]×[2/3]예요.", "[3/11]÷[5/22] = [6/22]÷[5/22]예요."],
      render: (b, a) => fd6Match(b, a, { left: [{ t: "[5/6]÷[1/6]", k: 1 }, { t: "[1 2/7]÷[1 1/2]", k: 2 }, { t: "[3/11]÷[5/22]", k: 3 }], right: [{ t: "[1 1/5]", k: 3 }, { t: "5", k: 1 }, { t: "[1 1/6]", k: null }, { t: "[6/7]", k: 2 }], ok: "몫을 바르게 이었어요!" }) },
    { name: "통나무", inst: "굵기가 일정한 통나무 [5/6] m의 무게가 [8 1/2] kg이에요. 이 통나무 1 m의 무게는 몇 kg일까요? 표시를 [1/6] m, 1 m로 옮겨 본 다음 두 가지 방법으로 구해 보세요.", hints: ["[8 1/2] = [17/2]이에요.", "방법 1은 통분하여 분자끼리, 방법 2는 분수의 곱셈으로 계산해요."],
      render: (b, a) => fd6Double(b, a, { items: [{ Q: "8 1/2", a: 5, b: 6, top: " kg", bot: " m", name: "통나무" }], ask: [
        { t: "방법 1", p: ["[8 1/2]÷[5/6] = ", { q: [null, "?17", "2"] }, "÷[5/6] = ", { q: [null, "?51", "6"] }, "÷[5/6] = ", { i: "51" }, "÷", { i: "5" }, " = ", { q: [null, "?51", "5"] }, " = ", { q: ["?10", "?1", "5"] }] },
        { t: "방법 2", p: ["[8 1/2]÷[5/6] = [17/2]×", { q: [null, "?6", "?5"] }, " = ", { q: [null, "?51", "5"] }, " = ", { q: ["?10", "?1", "5"] }] }], ok: "통나무 1 m의 무게는 [10 1/5] kg이에요." }) },
    { name: "생활 속 문제", inst: "문제를 풀어 보세요.", hints: ["4÷[2/5] = (4÷2)×5 = 10이에요. 10보다 작은 자연수 중 가장 큰 수는?", "먼저 담장의 넓이를 구한 다음, 페인트의 양을 넓이로 나누어요."],
      render: (b, a) => fd6Calc(b, a, [
        { q: "4÷[2/5] > □ 에서 □ 안에 들어갈 수 있는 가장 큰 자연수는?", n: 9, lab: "□ =", why: { "10": "몫이 10이에요. 10보다 작아야 하니 10은 들어갈 수 없어요." } },
        { q: "가로 [4/5] m, 세로 [7/10] m인 직사각형 모양의 담장의 넓이는 몇 m²일까요?", x: "[4/5]×[7/10]", a: "14/25", unit: "m²", lab: "[4/5]×[7/10] =" },
        { q: "이 담장을 칠하는 데 페인트 [2/3] L를 사용했어요. 담장 1 m²를 칠하는 데 필요한 페인트는 몇 L일까요?", x: "[2/3]÷[14/25]", a: "1 4/21", unit: "L", lab: "[2/3]÷[14/25] =" }]) }
  ],
  challenge: { inst: "확인하고 정리해요. 빈칸을 채우며 단원을 정리해 보세요.", hints: ["[2/9]와 [3/4]의 공통분모는 36이에요.", "(자연수)÷(분수)는 자연수를 분자로 나누고 분모를 곱해요."],
    render: (b, a) => fd6Chain(b, a, [
      { t: "통분하여 분자끼리", p: ["[2/9]÷[3/4] = ", { q: [null, "?8", "36"] }, "÷", { q: [null, "?27", "36"] }, " = ", { i: "8" }, "÷", { i: "27" }, " = ", { q: [null, "?8", "?27"] }] },
      { t: "분수의 곱셈으로", p: ["[2/9]÷[3/4] = [2/9]×", { q: [null, "?4", "?3"] }, " = ", { q: [null, "?8", "27"] }] },
      { t: "(자연수)÷(분수)", p: ["2÷[2/3] = (2÷", { i: "2" }, ")×3 = ", { i: "3" }] },
      { t: "(대분수)÷(분수)", p: ["대분수를 ", { c: ["가분수", "진분수"], a: 0 }, "로 바꾼 다음 통분하여 계산하거나 분수의 곱셈으로 나타내어 계산해요."] }],
      { ok: "분수의 나눗셈을 모두 정리했어요. 다음 시간에는 소수의 나눗셈을 공부해요." }) }
}
];
