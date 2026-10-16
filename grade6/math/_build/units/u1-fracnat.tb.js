//@@APP
const APP={title:"생태 도시 푸름시 분수의 나눗셈", unit:"6-1 수학 1. 분수의 나눗셈(교과서)", key:"t61-fracnat-v1", welcome:"생태 도시 푸름시 분수의 나눗셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 생태 도시 푸름시를 방문한 민아와 친구들과 함께 나누는 수가 자연수인 분수의 나눗셈을 알아봐요."};
//@@UNIT
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
const fn6Quiz0 = quiz, fn6Blanks0 = blanks;
quiz = (b, a, items, o) => fn6Quiz0(b, fn6A(a), items, o);
blanks = (b, a, parts, o) => fn6Blanks0(b, fn6A(a), parts, o);

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
  return el;
}
function fn6Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 4, class: "fn6box", "aria-label": "빈칸" });
  i.exp = String(exp);
  if (i.exp.length >= 3) i.classList.add("fn6wide");
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
      R.inp = fn6In(it.lab || it.e || "답");
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
  const btn = h("button", { class: "big", onclick: () => {
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
      const r = R.inp.get(), J = fn6Judge(r, it.a, R.den); given.push(R.inp.text());
      if (J.code === "ok") { R.inp.paint(true); return; }
      if (J.code === "diffden" || J.code === "zero" || J.code === "improper") { R.inp.paint(null); if (!hint) hint = J.msg; return; }
      R.inp.paint(false);
      if (!bad) bad = (it.why && it.why[fn6Key(r)]) || J.msg || fn6Diag(it.e || it.x, r) || opt.bad || "다시 계산해 봐요. 분자가 자연수의 배수이면 분자를 자연수로 나누고, 아니면 크기가 같은 분수로 바꾸거나 ×[1/▲]로 계산해요.";
    });
    if (bad) return api.fail(bad, given.join(" / "));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + fn6Book(num, den); R.res.classList.remove("hidden"); } });
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요! 약분하지 않아도, 가분수로 써도, 대분수로 써도 맞아요.");
  } }, "확인하기");
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, btn));
}
/* ② 차례대로 빈칸 채우기 (계산 과정)
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 수 칸 | {q:[자연수, 분자, 분모]} 각 자리는 고정값·"?답"(칸)·배열(분자에 ["?3","+","?2"]) | {f:"4 2/5"} 분수 입력(값 판정) | {c:[…], a}
   '='가 있고 한글이 없는 줄은 '='로 나눈 값이 모두 같은지 스스로 확인해요. */
function fn6Chain(body, api, rows, opt = {}) {
  fn6Style();
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
        const fi = fn6In("답"); fi.target = pt.f; fi.den = pt.den || fn6Den(pt.f) || 0; ins.push(fi); line.append(fi);
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
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    let ok = true, hint = null; const given = [];
    const same = new Set();
    pairs.forEach(([nb, db]) => { const a = nb.value.trim(), b = db.value.trim();
      if (/^\d+$/.test(a) && /^[1-9]\d*$/.test(b) && !(a === nb.exp && b === db.exp) && +a * +db.exp === +b * +nb.exp) { same.add(nb); same.add(db);
        hint = hint || (fn6G(+nb.exp, +db.exp) === 1 ? "값은 맞아요. 그런데 더 약분할 수 있어요. 분모와 분자를 최대공약수로 나누어 기약분수로 나타내요." : "값은 맞아요. 그런데 이 칸에는 약분하기 전의 분수를 써요."); } });
    ins.forEach(x => {
      if (same.has(x)) { x.style.borderColor = ""; given.push(x.value.trim()); return; }
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = fn6Judge(x.get(), x.target, x.den); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "diffden" || J.code === "zero" || J.code === "improper") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
    });
    chs.forEach(C => { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(C.sel === C.a ? "good" : "bad"); }); if (C.sel !== C.a) ok = false; given.push(C.sel == null ? "-" : C.el.children[C.sel].textContent); });
    if (!ok) return api.fail(opt.bad || "빨간 칸을 다시 생각해 봐요.", given.join(","));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce(); api.done(given.join(","), opt.ok || "차례대로 잘 계산했어요!");
  } }, "확인하기")));
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 */
function fn6Ask(host, api, ready, msg, opt) {
  const g = fn6Gate(api, ready, msg);
  if (opt.ask) return fn6Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad });
  if (opt.askCalc) return fn6Calc(host, g, opt.askCalc, { ok: opt.ok });
  api.provide({ words: [], answers: [] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { api.tryOnce(); ready() ? api.done("조작 완료", opt.ok) : api.fail(typeof msg === "function" ? msg() : msg, "-"); } }, "확인하기")));
}

/* ③ 막대 색칠하기: bars [{name, k, col}]  opt: d, ask(줄)·askCalc, ok */
function fn6Bars(body, api, opt) {
  fn6Style();
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
  };
  draw();
  const ready = () => bars.every((b, i) => cnt(i) === b.k);
  const ask = h("div", { class: "fn6ask" });
  body.append(h("p", { class: "fn6tip" }, opt.tip || "칸을 누르면 색칠되고, 한 번 더 누르면 지워져요."), h("div", { class: "fn6stage" }, svg), ask);
  fn6Ask(ask, api, ready, () => { const i = bars.findIndex((b, k) => cnt(k) !== b.k); return `먼저 ‘${fn6Plain(bars[i].name)}’ 막대를 알맞게 색칠해요. 지금 ${cnt(i)}칸이에요.`; }, opt);
}
/* ⑦ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function fn6Sort(body, api, opt) {
  fn6Style();
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "fn6pool" }), binsEl = h("div", { class: "fn6bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "fn6binl" }); binsEl.append(h("div", { class: "fn6bin", onclick: e => { if (e.target.closest(".fn6crd")) return; put(bi); } }, h("button", { class: "fn6binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt fn6crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  function draw() { els.forEach((el, ci) => { el.classList.toggle("fn6on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => fn6Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "fn6tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (where.some(w => w < 0)) return api.fail("아직 넣지 않은 카드가 있어요.", "-");
      let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
      if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); return api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); }
      api.tryOnce(); api.done(given, opt.ok);
    } }, "확인하기")));
}

/* ⑧ 관계있는 것끼리 잇기: left [{t,k}], right [{t,k|null}] (값을 계산해 짝이 맞는지 스스로 확인) */
function fn6Match(body, api, opt) {
  fn6Style();
  const L = opt.left, R = opt.right, pair = L.map(() => -1); let sel = null;
  L.forEach(l => { const v = fn6Eval(l.t); R.forEach(r => { const w = fn6Eval(r.t); if (!v || !w || fn6Eq(v, w) !== (r.k === l.k)) throw new Error("잇기 확인 필요: " + l.t + " / " + r.t); }); });
  const COL = ["#2B7BD6", "#D9822B", "#2E8B57"];
  const lb = L.map((l, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; draw(); } }, l.t));
  const rb = R.map((r, j) => h("button", { class: "opt", onclick: () => { if (sel == null) return api.hint("먼저 왼쪽 식을 눌러요."); pair[sel] = pair[sel] === j ? -1 : j; sel = null; draw(); } }, r.t));
  const badge = (i) => h("span", { class: "fn6badge", style: `background:${COL[i % 3]}` }, String(i + 1));
  function draw() {
    lb.forEach((b, i) => { b.classList.toggle("fn6on", sel === i); b.classList.remove("good", "bad"); [...b.querySelectorAll(".fn6badge")].forEach(x => x.remove()); b.append(badge(i)); });
    rb.forEach((b, j) => { b.classList.remove("good", "bad"); [...b.querySelectorAll(".fn6badge")].forEach(x => x.remove()); pair.forEach((p, i) => { if (p === j) b.append(badge(i)); }); });
  }
  draw();
  api.provide({ words: [], answers: L.map(l => `${fn6Plain(l.t)} — ${fn6Plain(R.find(r => r.k === l.k).t)}`) });
  body.append(h("p", { class: "fn6tip" }, "왼쪽 식을 누르고, 값이 같은 오른쪽 식을 눌러 이어요. 짝이 없는 식도 있어요."),
    h("div", { class: "fn6mt" }, h("div", { class: "fn6mc" }, lb), h("div", { class: "fn6mc" }, rb)),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (pair.some(p => p < 0)) return api.fail("왼쪽 식을 모두 이어요.", "-");
      let ok = true; pair.forEach((p, i) => { const g = R[p].k === L[i].k; lb[i].classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = pair.map((p, i) => `${i + 1}-${p + 1}`).join(", ");
      if (!ok) return api.fail("값을 계산해 보고 다시 이어요. 가분수와 대분수 중 편리한 꼴로 바꾸어 비교해요.", given);
      api.tryOnce(); api.done(given, opt.ok || "값이 같은 식끼리 잘 이었어요!");
    } }, "확인하기")));
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
  fn6Ask(ask, api, allOk, () => { const i = SG.findIndex((_, q) => !ok(q)), s = SG[i]; return `${s.t}: ${s.dir === "v" ? "세로로" : "가로로"} ${s.d}등분하고 ${s.n}${s.dir === "h2" ? "줄" : "칸"}을 골라요. 지금 ${K[i]}등분, ${sel[i].size}개 골랐어요.`; }, opt);
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
    st.paint();
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
  fn6Ask(ask, api, ready, () => {
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
    st.paint();
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
  fn6Ask(ask, api, ready, () => {
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
  const slots = []; let sel = null; /* slots: {b, k, card} */
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
  };
  paint();
  api.provide({ words: opt.words || ["진분수", "×[1/▲]", "분자를 자연수로 나누기"], answers: boards.map((bd, i) => bests[i] ? `${fn6Plain(fn6BTxt(bd.kind, bests[i].v))} = ${fn6Plain(fn6Txt(bests[i].x.num, bests[i].x.den))}` : "").filter(Boolean) });
  body.append(h("p", { class: "fn6tip" }, opt.tip || "수 카드를 누른 다음 빈칸을 눌러 넣어요. 빈칸을 다시 누르면 빠져요. 그리고 몫을 써요."), h("div", { class: "fn6deck" }, cBtns), ...boxes,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (slots.some(s => s.card == null)) return api.fail("빈칸에 수 카드를 모두 넣어요.", "-");
      if (opt.all && cards.some((_, i) => !slots.some(s => s.card === i))) return api.fail("수 카드를 한 번씩 모두 사용해요.", "-");
      const given = []; let bad = null, hint = null;
      boards.forEach((bd, bi) => {
        const v = slots.filter(s => s.b === bi).map(s => cards[s.card]), e = fn6BTxt(bd.kind, v), x = fn6BVal(bd.kind, v), r = quo[bi].get();
        given.push(`${fn6Plain(e)} = ${quo[bi].text()}`);
        if (bad) return;
        if (bd.proper && bd.kind === "fr" && v[0] >= v[1]) { bad = `${bi + 1}번: 진분수는 분자가 분모보다 작아야 해요.`; return; }
        if (bests[bi] && !fn6Eq(x, bests[bi].x)) { bad = bd.msg || (bd.goal === "min" ? "몫이 더 작은 나눗셈을 만들 수 있어요." : "몫이 더 큰 나눗셈을 만들 수 있어요."); return; }
        if (r.err) { quo[bi].paint(false); bad = r.err === "empty" ? "몫을 써요." : r.err === "half" ? "분수는 분자와 분모를 모두 써요." : "몫을 분수나 자연수로 써요."; return; }
        if (!fn6Eq(r, x)) { quo[bi].paint(false); bad = fn6Diag(e, r) || `${bi + 1}번 몫을 다시 계산해 봐요.`; return; }
        quo[bi].paint(true);
        if (r.hasF && r.hasW && r.n >= r.d) hint = hint || "값은 맞아요. 대분수의 분수 부분은 1보다 작게 써요.";
      });
      if (bad) return api.fail(bad, given.join(" / "));
      if (hint) { api.tryOnce(); return api.hint(hint); }
      api.tryOnce(); api.done(given.join(" / "), opt.ok || "나눗셈을 만들고 몫을 바르게 구했어요!");
    } }, "확인하기")));
}

/* 나눗셈 카드(9차시 놀이) — 교과서에 카드 목록이 없어 이 앱이 정한 카드예요(첫 장 [6/7]÷2만 교과서 예시) */
const FN6_CARDS = ["[6/7]÷2", "3÷4", "5÷8", "7÷3", "9÷4", "[8/9]÷4", "[9/10]÷3", "[3/5]÷2", "[4/7]÷3", "[5/6]÷4", "[2/9]÷5", "[1 1/3]÷2", "[2 1/4]÷3", "[3 3/5]÷6", "[1 3/8]÷2", "[4 2/3]÷7"];
function fn6CardVal(e) { const v = fn6Eval(e); if (!v) throw new Error("카드 확인 필요: " + e); return v; }
/* 카드 식을 쓰는 칸: 나누어지는 수(자연수·분수) ÷ 나누는 수 */
function fn6ExprIn() {
  const a = fn6In("나누어지는 수"), b = fn6Box("0");
  b.setAttribute("aria-label", "나누는 수"); b.classList.add("fn6wide");
  const el = h("span", { class: "fn6write" }, a, h("span", {}, "÷"), b);
  el.read = () => { const r = a.get(), k = b.value.replace(/\s/g, ""); if (r.err || !/^[1-9]\d*$/.test(k)) return null; return { r, k: +k, e: `${fn6Tk(fn6Key(r))}÷${k}` }; };
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
  const secs = h("div", { class: "fn6ctl" }, h("span", { class: "jua" }, "카드 보는 시간:"), ...[3, 5, 8].map(s => { const b = h("button", { onclick: () => { sec = s; [...secs.querySelectorAll("button")].forEach(x => x.classList.toggle("fn6act", x === b)); } }, `${s}초`); if (s === sec) b.classList.add("fn6act"); return b; }));
  const deal = () => {
    clearInterval(timer); stage.innerHTML = ""; paintScore();
    const card = deck[round % deck.length], val = fn6CardVal(card);
    const flash = h("div", { class: "fn6flash fn6hid" }, "‘카드 뒤집기’를 누르면 카드가 잠깐 보여요.");
    const form = h("div", { class: "hidden" });
    const ex = fn6ExprIn(), q = fn6In("몫"), fb = h("div");
    let left = sec, shown = false, judged = false;
    const flip = h("button", { onclick: () => {
      if (shown) return; shown = true; flip.disabled = true;
      flash.classList.remove("fn6hid"); flash.textContent = card; left = sec;
      const cd = h("p", { class: "fn6rd" }, `${left}초 뒤에 카드가 뒤집혀요. 잘 기억해요!`); stage.insertBefore(cd, form);
      timer = setInterval(() => { left--; cd.textContent = left > 0 ? `${left}초 뒤에 카드가 뒤집혀요. 잘 기억해요!` : ""; if (left <= 0) { clearInterval(timer); flash.classList.add("fn6hid"); flash.textContent = "카드를 뒤집어 놓았어요. 기억한 나눗셈을 써요."; form.classList.remove("hidden"); } }, 1000);
    } }, "카드 뒤집기");
    form.append(h("div", { class: "fn6write" }, h("span", { class: "jua" }, "기억한 나눗셈:"), ex), h("div", { class: "fn6write" }, h("span", { class: "jua" }, "계산한 몫:"), q),
      h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
        if (judged) return;
        const E = ex.read(); if (!E) return api.hint("기억한 나눗셈을 끝까지 써요. 나누는 수는 자연수예요.");
        const r = q.get(); if (r.err) return api.hint(r.err === "empty" ? "몫을 써요." : "몫을 분수나 자연수로 써요.");
        judged = true;
        const same = E.e.replace(/[\[\]]/g, "") === card.replace(/[\[\]]/g, "");
        const right = fn6Eq(r, fn6R(E.r.num, E.r.den * E.k));
        const pt = (same ? 1 : 0) + (right ? 1 : 0);
        score += pt; if (right) good++;
        q.paint(right);
        log.push(`${round + 1}판: ${card} → ${pt}점`);
        fb.append(h("p", { class: "fn6rd" + (pt === 2 ? " fn6good" : "") },
          `카드: ${card} = ${fn6Book(val.num, val.den)} · ${same ? "나눗셈을 맞혔어요" : "나눗셈을 맞히지 못했어요"}, ${right ? "옳게 계산했어요" : `계산이 틀렸어요(옳은 몫: ${fn6Book(E.r.num, E.r.den * E.k)})`} → ${pt}점`));
        round++; paintScore();
        logEl.innerHTML = ""; logEl.append(h("ol", { class: "fn6log" }, log.map(t => h("li", {}, t))));
        if (round < opt.rounds) fb.append(h("div", { class: "fn6ctl" }, h("button", { onclick: deal }, "이어서 한 판 더")));
        else {
          api.tryOnce();
          const msg = `${opt.rounds}판 끝! 점수 ${score}점, 옳게 계산한 판 ${good}번이에요.`;
          if (good >= opt.need) api.done(`${score}점, 옳은 계산 ${good}번`, msg + " 정확하게 기억하고 계산했어요.");
          else { api.fail(`${msg} ${opt.need}번 이상 옳게 계산하도록 다시 해 봐요.`, `${score}점`); fb.append(h("div", { class: "fn6ctl" }, h("button", { onclick: () => { round = 0; score = 0; good = 0; log.length = 0; logEl.innerHTML = ""; shuffle(); deal(); } }, "처음부터 다시"))); }
        }
      } }, "칠판에 쓰고 계산하기")), fb);
    stage.append(h("div", { class: "fn6ctl" }, flip), flash, form);
  };
  body.append(h("p", { class: "fn6tip" }, "‘카드 뒤집기’를 누르면 나눗셈 카드가 잠깐 보였다가 뒤집혀요. 기억한 나눗셈을 쓰고 계산해요. (카드는 이 앱이 정한 것이에요.)"),
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
    const q = fn6In("몫"), v = fn6CardVal(cards[i]);
    work.append(h("div", { class: "fn6write" }, h("span", {}, cards[i] + " ="), q, h("button", { class: "big", onclick: () => {
      const r = q.get(); if (r.err) return api.hint(r.err === "empty" ? "몫을 써요." : "몫을 분수나 자연수로 써요.");
      const ok = fn6Eq(r, v);
      if (ok) own[i] = 1;
      rd.textContent = ok ? `옳게 계산했어요! ${cards[i]} = ${fn6Book(v.num, v.den)} · 내 카드가 되었어요.` : `틀렸어요. ${fn6Diag(cards[i], r) ? fn6Diag(cards[i], r) + " " : ""}카드를 다시 뒤집어 놓아요.`;
      rd.classList.toggle("fn6good", ok);
      open = null; work.innerHTML = "";
      if (!check()) aiTurn();
    } }, "계산 내기")));
  };
  const start = () => {
    cards = opt.cards.slice(); for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    own = Array(16).fill(0); open = null; over = false; myTurn = true; work.innerHTML = ""; ctl.innerHTML = "";
    rd.textContent = "내가 먼저 해요. 카드 한 장을 골라 뒤집어 보세요."; rd.classList.remove("fn6good"); paint();
  };
  body.append(h("p", { class: "fn6tip" }, "카드를 하나 골라 계산해요. 옳게 계산하면 내 카드(파랑), 틀리면 다시 뒤집어 놓아요. 그다음은 컴퓨터 차례예요. 가로·세로·대각선으로 내 카드 한 줄을 먼저 완성하면 이겨요."),
    rd, grid, work, ctl);
  start();
}

/* 푸름시 그림 */
function fn6Scene() {
  const svg = makeSvg(900, 280);
  svg.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 280, fill: "#EAF5FB", rx: 16 }));
  svg.append(svgEl("rect", { x: 0, y: 200, width: 900, height: 80, fill: "#CFE8C4" }));
  /* 시청과 옥상 정원 */
  svg.append(svgEl("rect", { x: 40, y: 90, width: 170, height: 112, fill: "#F2E3C9", stroke: INK, "stroke-width": 3 }));
  [0, 1, 2].forEach(i => [0, 1].forEach(j => svg.append(svgEl("rect", { x: 60 + i * 50, y: 115 + j * 40, width: 28, height: 22, fill: "#fff", stroke: INK, "stroke-width": 2 }))));
  svg.append(svgEl("rect", { x: 40, y: 78, width: 170, height: 14, fill: "#7CB86A", stroke: INK, "stroke-width": 2 }));
  [70, 120, 170].forEach(x => svg.append(svgEl("circle", { cx: x, cy: 68, r: 14, fill: "#5FA052", stroke: INK, "stroke-width": 2 })));
  svg.append(txt(125, 228, "옥상 정원", 18));
  /* 하천과 다슬기 */
  svg.append(svgEl("path", { d: "M250 280 C300 220 330 220 380 200 C420 185 440 230 470 280 Z", fill: "#8CC4EA", stroke: "#4B8DBF", "stroke-width": 3 }));
  [[320, 250], [360, 236], [400, 258]].forEach(([x, y]) => svg.append(svgEl("ellipse", { cx: x, cy: y, rx: 9, ry: 6, fill: "#6B4F2A" })));
  svg.append(txt(360, 192, "다슬기 풀어 주기", 18));
  /* 발전소 */
  svg.append(svgEl("rect", { x: 500, y: 120, width: 140, height: 82, fill: "#DCE6EA", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("rect", { x: 610, y: 70, width: 22, height: 52, fill: "#B9C4C0", stroke: INK, "stroke-width": 2 }));
  svg.append(svgEl("path", { d: "M545 150 l12 -20 l-4 14 l12 -2 l-14 22 l4 -14 z", fill: "#F3D36B", stroke: INK, "stroke-width": 1.5 }));
  svg.append(txt(570, 228, "친환경 에너지 발전소", 17));
  /* 생태 통로 */
  svg.append(svgEl("path", { d: "M680 200 L680 150 Q770 95 860 150 L860 200 L830 200 L830 160 Q770 125 710 160 L710 200 Z", fill: "#9BCB86", stroke: INK, "stroke-width": 3 }));
  svg.append(svgEl("rect", { x: 660, y: 200, width: 220, height: 14, fill: "#8A8F94" }));
  svg.append(txt(770, 238, "생태 통로", 18));
  svg.append(txt(450, 34, "생태 도시 푸름시", 24, { fill: "#2F6B57" }));
  return h("div", { class: "fn6stage" }, svg);
}
/* 평행사변형 그림(6차시) */
function fn6Para() {
  const svg = makeSvg(900, 230);
  svg.append(svgEl("polygon", { points: "260,40 700,40 620,180 180,180", fill: "#FBE6CC", stroke: INK, "stroke-width": 4 }));
  svg.append(svgEl("line", { x1: 260, y1: 40, x2: 260, y2: 180, stroke: "#C8472E", "stroke-width": 3, "stroke-dasharray": "8 6" }));
  svg.append(svgEl("rect", { x: 260, y: 164, width: 16, height: 16, fill: "none", stroke: "#C8472E", "stroke-width": 2 }));
  svg.append(fn6SvgLine("높이 □ cm", 272, 112, 22, { anchor: "start", fill: "#C8472E" }));
  svg.append(fn6SvgLine("7 cm", 400, 212, 22));
  svg.append(fn6SvgLine("넓이 [8 3/4] cm²", 510, 112, 24));
  return h("div", { class: "fn6stage" }, svg);
}
/* 정삼각형 두 개(10차시) */
function fn6Tri() {
  const svg = makeSvg(900, 240);
  [180, 520].forEach(x => svg.append(svgEl("polygon", { points: `${x},180 ${x + 180},180 ${x + 90},${(180 - 90 * Math.sqrt(3)).toFixed(1)}`, fill: "#E3F0FA", stroke: "#8A6400", "stroke-width": 5 })));
  svg.append(fn6SvgLine("철사 [8/9] m를 모두 사용해요", 450, 216, 20, { fill: "#5B6B6B" }));
  return h("div", { class: "fn6stage" }, svg);
}
//@@LESSONS
const UNIT_STORY = { title: "생태 도시 푸름시에 간 민아", lines: [
  "민아와 친구들은 생태 도시로 이름난 푸름시를 방문해요. 시청 앞 기념 도장 종이, 옥상 정원의 물, 하천에 풀어 주는 다슬기, 친환경 에너지 발전소의 가스, 생태 통로의 유도울타리 철망을 똑같이 나누어 보아요.",
  "(자연수)÷(자연수)의 몫을 분수로 나타내고, 나누는 수가 자연수인 (분수)÷(자연수)와 (대분수)÷(자연수)를 띠를 나누고 고르며 알아봐요.",
  "교과서 「수학 6-1」 1. 분수의 나눗셈의 차시 순서 그대로 만들었어요."],
  one: "분수의 나눗셈 · ●÷▲ = [●/▲]. (분수)÷(자연수)는 분자를 자연수로 나누거나, 크기가 같은 분수로 바꾸거나, (분수)×[1/▲]로 계산해요." };
const UNIT_KEYWORDS = ["나누어지는 수", "나누는 수", "분자", "분모", "●÷▲ = [●/▲]", "몫이 1보다 큰 나눗셈", "가분수", "대분수", "크기가 같은 분수", "분자가 자연수의 배수", "(분수)×[1/▲]", "이중 척도 모델", "자연수 부분과 진분수 부분", "문제해결 4단계"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 생태 도시 푸름시에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 분수의 나눗셈이 필요한 상황에는 무엇이 있을까요?",
  summary: "민아와 친구들은 사람과 자연환경이 조화를 이루어 살아가는 생태 도시 푸름시를 방문해요. 옥상 정원 가꾸기, 다슬기 풀어 주기, 친환경 에너지 발전소, 생태 통로에 분수의 나눗셈이 쓰여요. 종이 1장을 4명이 나누어 가질 때나 음료 [2/3] L를 컵 2개에 나누어 담을 때처럼 몫이 자연수가 아닌 나눗셈이 생활 곳곳에 있어요. 이 단원을 배우기 전에 분수, 크기가 같은 분수, 분수의 크기 비교, (분수)×(분수)를 떠올려 두어요.",
  steps: [
    { name: "살펴보기", inst: "민아와 친구들은 생태 도시로 이름난 ‘푸름시’를 방문했어요. 생태 도시는 사람과 자연환경이 조화를 이루어 살아갈 수 있도록 체계를 갖춘 도시예요. 그림을 살펴보세요.", hints: ["그림에 적힌 이름을 읽어 보세요.", "공장 굴뚝의 검은 연기는 그림에 없어요."],
      render: (b, a) => quiz(b, a, [
        { q: "푸름시에서 사람과 자연이 함께 살아가기 위해 하는 일로 그림에 나온 것을 모두 고르세요.", fig: fn6Scene, o: ["옥상 정원 가꾸기", "하천에 다슬기 풀어 주기", "친환경 에너지 발전소", "야생 동물을 위한 생태 통로", "공장 굴뚝의 검은 연기"], a: [0, 1, 2, 3], why: { "4": "검은 연기는 그림에 없어요. 푸름시는 자연환경을 지키는 생태 도시예요." } },
        { q: "생태 도시의 뜻을 고르세요.", o: ["사람과 자연환경이 조화를 이루어 살아갈 수 있도록 체계를 갖춘 도시", "높은 건물이 가장 많은 도시", "사람이 살지 않는 도시"], a: 0 }],
        { ok: "푸름시 곳곳을 다니며 분수의 나눗셈을 알아봐요." }) },
    { name: "생각해 보기", inst: "“코끼리거북은 세계에서 가장 느린 파충류로 1시간에 270 m를 이동한대. 그럼 1분 동안 몇 m를 이동하는 걸까?”(출처: 아시아투데이, 2024)", hints: ["1시간은 60분이에요.", "전체 거리를 시간(분)으로 똑같이 나누어요."],
      render: (b, a) => quiz(b, a, [
        { q: "1분 동안 이동하는 거리를 구하는 식을 고르세요.", o: ["270÷60", "60÷270", "270×60"], a: 0, why: { "1": "나누는 순서가 바뀌었어요. 270 m를 60분으로 똑같이 나누어요.", "2": "곱하면 1시간보다 긴 시간 동안 간 거리처럼 커져요. 270 m를 60으로 나누어요." } },
        { q: "270÷60의 몫은 어떤 수일까요?", o: ["자연수로 나누어떨어지지 않아요", "꼭 자연수예요"], a: 0, why: { "1": "60×4 = 240, 60×5 = 300이라서 270÷60의 몫은 4와 5 사이예요." } }],
        { ok: "270÷60의 몫은 자연수로 나누어떨어지지 않아요. 이 단원에서 이런 나눗셈의 몫을 분수로 나타내는 방법을 배워요." }) },
    { name: "생활 속 나눗셈", inst: "우리 주변에서 (자연수)÷(자연수), (분수)÷(자연수)가 필요한 상황을 찾아봐요. 상황을 알맞은 식의 종류로 나누어 보세요.", hints: ["나누어지는 수(전체의 양)가 자연수인지 분수인지 살펴봐요.", "[1 1/2] m는 대분수예요. 대분수도 분수예요."],
      render: (b, a) => fn6Sort(b, a, { bins: ["(자연수)÷(자연수)", "(분수)÷(자연수)"], cards: [
        { t: "종이 1장을 4명이 똑같이 나누어 가져요.", k: 0 }, { t: "음료수 2 L를 물통 3개에 똑같이 나누어 담아요.", k: 0 },
        { t: "음료 [2/3] L를 컵 2개에 똑같이 나누어 담아요.", k: 1 }, { t: "설탕 [5/7] kg을 그릇 2개에 똑같이 나누어 담아요.", k: 1 },
        { t: "넓이가 [3/5] m²이고 가로가 4 m인 직사각형의 세로를 구해요.", k: 1 }, { t: "끈 [1 1/2] m를 5부분으로 똑같이 나누어 잘라요.", k: 1 }],
        bad: "나누어지는 수를 살펴봐요. 전체의 양이 분수이면 (분수)÷(자연수)예요.", ok: "나누는 수가 자연수인 분수의 나눗셈이 생활 곳곳에 있어요." }) },
    { name: "떠올리기 ① 분수", inst: "3학년, 5학년 때 배운 분수 알아보기와 크기가 같은 분수를 떠올려요. 막대에 [3/4]만큼 색칠하고 물음에 답해 보세요.", hints: ["[3/4]은 전체를 똑같이 4로 나눈 것 중의 3이에요.", "크기가 같은 분수는 분모와 분자에 0이 아닌 같은 수를 곱하여 만들어요."],
      render: (b, a) => fn6Bars(b, a, { d: 4, bars: [{ name: "[3/4]", k: 3 }], ask: [
        ["[3/4]은 [1/4]이 ", { i: "3" }, "개예요."],
        ["[2/3] = ", { q: [null, ["2", "×", "?2"], ["3", "×", "?2"]] }, " = ", { q: [null, "?10", "15"] }],
        ["크기가 같은 분수는 분모와 분자에 0이 아닌 ", { c: ["같은 수를 곱하여", "서로 다른 수를 곱하여"], a: 0 }, " 만들 수 있어요."]],
        ok: "분수와 크기가 같은 분수를 잘 기억하고 있어요. 이 단원에서 자주 써요." }) },
    { name: "떠올리기 ② 비교와 곱셈", inst: "5학년 때 배운 분수의 크기 비교와 (분수)×(분수)를 떠올려요.", hints: ["[3/4]과 [5/7]를 분모 28로 통분해 보세요.", "(분수)×(분수)는 분자는 분자끼리, 분모는 분모끼리 곱해요."],
      render: (b, a) => fn6Chain(b, a, [
        ["크기 비교: [3/4] = ", { q: [null, "?21", "28"] }, ", [5/7] = ", { q: [null, "?20", "28"] }, " 이므로 [3/4] ", { c: [">", "<", "="], a: 0 }, " [5/7]"],
        ["[4/5]×[1/3] = ", { q: [null, ["4", "×", "?1"], ["5", "×", "?3"]] }, " = ", { q: [null, "?4", "15"] }],
        ["[5/6]×[1/2] = ", { q: [null, "?5", "12"] }]],
        { ok: "분수의 크기 비교와 곱셈을 잘 기억하고 있어요. 이제 분수의 나눗셈을 배워요.", bad: "통분은 분모와 분자에 같은 수를 곱해 분모를 같게 하는 것이에요. 곱셈은 분자끼리, 분모끼리 곱해요." }) }
  ],
  challenge: { inst: "배울 내용을 살펴봐요. 책장을 넘기며 이 단원에서 배울 내용을 교과서 차례대로 눌러 보세요.", hints: ["(자연수)÷(자연수)를 먼저 배우고, (분수)÷(자연수)를 배워요.", "(대분수)÷(자연수)는 가장 나중에 배워요."],
    render: (b, a) => sequence(b, a, ["(분수)÷(자연수)를 분수의 곱셈으로 나타내기", "(자연수)÷(자연수)의 몫을 분수로 나타내기 ― 몫이 1보다 작은 경우", "(대분수)÷(자연수) 알아보기", "(자연수)÷(자연수)의 몫을 분수로 나타내기 ― 몫이 1보다 큰 경우", "(분수)÷(자연수) 알아보기"], [1, 3, 4, 0, 2],
      { ok: "몫이 1보다 작은 경우 → 1보다 큰 경우 → (분수)÷(자연수) → 분수의 곱셈으로 → (대분수)÷(자연수) 차례로 배워요." }) }
},
{
  id: "t2", no: 2, title: "(자연수)÷(자연수)의 몫을 분수로 나타내어 볼까요 ⑴", soop: "개념 구축하기(O)",
  question: "몫이 1보다 작은 (자연수)÷(자연수)의 몫은 어떻게 분수로 나타낼까요?",
  summary: "종이 1장을 5명에게 똑같이 나누어 주면 한 명은 [1/5]장을 받아요. 1÷5 = [1/5]이에요. 종이 3장을 5명에게 똑같이 나누어 주면 한 명은 [1/5]장이 3개인 [3/5]장을 받아요. 3÷5 = [3/5]이에요. (자연수)÷(자연수)의 몫은 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타낼 수 있습니다. ●÷▲ = [●/▲]",
  steps: [
    { inst: "민아와 친구들은 푸름시청 앞에 모였어요. 선생님께서 길쭉한 직사각형 모양의 종이 한 장을 들고 말씀하셨어요. “이 종이를 5명에게 똑같이 나누어 줄게요. 푸름시 곳곳을 다니며 방문지마다 기념 도장을 찍어 보세요.” 한 명에게 줄 수 있는 종이의 양을 알아봐요.", hints: ["5명에게 똑같이 나누어 주니까 종이를 똑같이 5칸으로 나누어요.", "한 명은 5칸 중 1칸을 받아요."],
      render: (b, a) => fn6Share(b, a, { N: 1, d: 5, unit: "장", strip: "종이 1장", who: "명", one: "한 명", ask: [
        ["구하는 식: ", { c: ["1÷5", "5÷1", "1×5"], a: 0 }],
        ["한 명에게 줄 수 있는 종이의 양: ", { q: [null, "?1", "?5"] }, "장"],
        ["1÷(자연수)의 몫은 1을 ", { c: ["분자", "분모"], a: 0 }, ", 나누는 자연수를 ", { c: ["분모", "분자"], a: 0 }, "로 하는 분수로 나타낼 수 있어요."]], ok: "1÷5 = [1/5]이에요. 한 명에게 종이를 [1/5]장 줄 수 있어요." }) },
    { inst: "크기가 같은 종이 3장을 5명에게 똑같이 나누어 주려고 해요. 한 명에게 줄 수 있는 종이의 양을 구해 보세요. 종이마다 똑같이 나누어 한 칸씩 골라 보세요.", hints: ["종이 3장을 각각 똑같이 5칸으로 나누어요.", "종이마다 한 칸씩, 모두 [1/5]장이 3개예요."],
      render: (b, a) => fn6Share(b, a, { N: 3, d: 5, unit: "장", strip: "종이 1장", who: "명", one: "한 명", ask: [
        ["구하는 식: ", { c: ["3÷5", "5÷3", "3×5"], a: 0 }],
        ["한 명의 몫은 [1/5]장이 ", { i: "3" }, "개예요."],
        ["3÷5 = ", { q: [null, "?3", "?5"] }, " (장)"]], ok: "3÷5 = [3/5]이에요. 한 명에게 종이를 [3/5]장 줄 수 있어요." }) },
    { inst: "1÷5의 몫을 이용하여 3÷5의 몫을 친구에게 설명해 보세요.", hints: ["3은 1이 3개예요.", "1÷5 = [1/5]이니까 3÷5는 [1/5]이 몇 개일까요?"],
      render: (b, a) => fn6Chain(b, a, [
        ["1÷5 = ", { q: [null, "?1", "?5"] }, "이고, 3은 1이 ", { i: "3" }, "개이므로 3÷5는 [1/5]이 ", { i: "3" }, "개입니다."],
        ["따라서 3÷5 = ", { q: [null, "?3", "?5"] }, "입니다."],
        ["“3에서 5를 뺄 수 없으니까 3÷5는 나눌 수 없어.”라는 말은 ", { c: ["틀렸어요", "맞아요"], a: 0 }, ". 1을 똑같이 5로 나누면 되니까요."]],
        { ok: "3÷5는 [1/5]이 3개이므로 [3/5]이에요. 3이 5보다 작아도 나눌 수 있어요.", bad: "빨간 칸을 다시 생각해 봐요. 1÷5 = [1/5]이에요." }) },
    { inst: "(자연수)÷(자연수)의 몫을 분수로 나타내는 방법을 약속해요.", hints: ["3÷5 = [3/5]에서 3과 5는 각각 분수의 어디에 있나요?"],
      render: (b, a) => blanks(b, a, ["(자연수)÷(자연수)의 몫은 나누어지는 수를 ", { o: ["분자", "분모"], a: 0 }, ", 나누는 수를 ", { o: ["분모", "분자"], a: 0 }, "로 하는 분수로 나타낼 수 있습니다. ●÷▲ = ", { o: ["[●/▲]", "[▲/●]"], a: 0 }], { ok: "(자연수)÷(자연수)의 몫은 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타낼 수 있습니다." }) },
    { inst: "나눗셈의 몫을 분수로 나타내어 보세요.", hints: ["나누어지는 수를 분자, 나누는 수를 분모에 써요.", "6÷7 = [6/7]이에요."],
      render: (b, a) => fn6Calc(b, a, [{ e: "1÷8", a: "1/8" }, { e: "6÷7", a: "6/7" }, { e: "4÷9", a: "4/9" }, { e: "3÷11", a: "3/11" }], { bad: "다시 생각해 봐요. 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 써요." }) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["8÷15의 몫은 나누어지는 수 8이 분자예요.", "몫이 가장 작으려면 가장 작은 수를 가장 큰 수로 나누어요."],
    render: (b, a) => fn6Both(b, a, [
      (x, y) => fn6Calc(x, y, [
        { e: "1÷11", a: "1/11" }, { e: "6÷17", a: "6/17" }, { e: "3÷14", a: "3/14" },
        { q: "몫을 분수로 잘못 나타낸 것을 고르세요.", pick: ["㉠ 8÷15 = [15/8]", "㉡ 7÷10 = [7/10]"], a: 0, why: { "1": "7÷10 = [7/10]은 옳아요. 나누어지는 수 7이 분자예요." } },
        { q: "철사 5 m를 7도막으로 똑같이 잘랐어요. 한 도막은 몇 m일까요?", x: "5÷7", a: "5/7", unit: "m", lab: "5÷7 =" }], { bad: "다시 생각해 봐요. 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 써요." }),
      (x, y) => fn6Build(x, y, { cards: [5, 9, 6, 2], tip: "수 카드 2장을 골라 몫이 가장 작은 (자연수)÷(자연수)를 만들고 몫을 써요.", boards: [{ kind: "nat", goal: "min", label: "몫이 가장 작은 나눗셈", msg: "몫이 더 작은 나눗셈을 만들 수 있어요. 나누어지는 수는 작게, 나누는 수는 크게 해요." }], ok: "가장 작은 수를 가장 큰 수로 나누면 몫이 가장 작아요. 2÷9 = [2/9]예요." })],
      { titles: ["① 몫을 분수로", "② 수 카드 5, 9, 6, 2"], ok: "몫이 1보다 작은 (자연수)÷(자연수)의 몫을 분수로 잘 나타냈어요!" }) }
},
{
  id: "t3", no: 3, title: "(자연수)÷(자연수)의 몫을 분수로 나타내어 볼까요 ⑵", soop: "개념 구축하기(O)",
  question: "몫이 1보다 큰 (자연수)÷(자연수)의 몫은 어떻게 분수로 나타낼까요?",
  summary: "물 4 L를 화분 3개에 똑같이 나누어 주면 화분 한 개에 [1 1/3] L(= [4/3] L)를 주어요. 방법 1은 1 L씩 나누어 주고 남은 1 L를 3으로 똑같이 나누어 4÷3 = 1 + [1/3] = [1 1/3]이고, 방법 2는 물 4 L를 각각 3으로 똑같이 나누어 [1/3]이 4개이므로 4÷3 = [4/3]예요. 두 방법의 몫은 같아요. 몫이 1보다 커도 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타낼 수 있고, 대분수로 나타내지 않아도 돼요.",
  steps: [
    { inst: "민아는 시청 옥상 정원에 갔어요. 작은 연못과 다양한 식물이 있었어요. 민아는 물 4 L를 화분 3개에 똑같이 나누어 주었어요. 화분 한 개에 준 물의 양을 방법 1로 구해 봐요. 먼저 1 L씩 나누어 주고, 남은 물을 똑같이 나누어 보세요.", hints: ["물 3 L는 화분 3개에 1 L씩 나누어 줄 수 있어요.", "남은 1 L를 똑같이 3칸으로 나누어 한 칸을 주어요."],
      render: (b, a) => fn6Share(b, a, { N: 4, d: 3, mode: "whole", unit: " L", strip: "물 1 L", who: "개", one: "화분 한 개", tip: "먼저 화분 한 개에 줄 1 L짜리를 누르고, ‘＋’로 남은 물을 똑같이 나눈 다음 한 칸을 골라요.", ask: [
        ["구하는 식: ", { c: ["4÷3", "3÷4", "4×3"], a: 0 }],
        ["4÷3 = (3÷3) + (1÷3) = ", { i: "1" }, " + ", { q: [null, "?1", "?3"] }, " = ", { q: ["?1", "?1", "3"] }]], ok: "1 L씩 나누어 주고 남은 1 L를 3으로 나누었어요. 4÷3 = [1 1/3]이에요." }) },
    { inst: "이번에는 방법 2로 구해 봐요. 물 4 L를 각각 똑같이 3칸으로 나누어 화분 한 개에 줄 양을 골라 보세요.", hints: ["1 L마다 똑같이 3칸으로 나누어 한 칸씩 골라요.", "[1/3] L가 4개예요."],
      render: (b, a) => fn6Share(b, a, { N: 4, d: 3, unit: " L", strip: "물 1 L", who: "개", one: "화분 한 개", ask: [
        ["4÷3 = (1÷3)+(1÷3)+(1÷3)+(1÷3) = [1/3]+[1/3]+[1/3]+[1/3] = ", { q: [null, "?4", "?3"] }],
        ["방법 1의 몫 [1 1/3]과 방법 2의 몫 [4/3]는 ", { c: ["같아요", "달라요"], a: 0 }, "."]], ok: "4÷3 = [4/3] = [1 1/3]이에요. 화분 한 개에 준 물은 [1 1/3] L(= [4/3] L)예요." }) },
    { inst: "모양과 크기가 같은 쿠키 5개를 4명이 똑같이 나누어 먹으려고 해요. 방법 1과 방법 2 중 하나를 골라 한 명이 먹을 수 있는 쿠키의 양을 분수로 나타내고, 친구에게 설명해 보세요.", hints: ["방법 1: 쿠키를 1개씩 나누어 주고 남은 1개를 4로 똑같이 나누어요.", "방법 2: 쿠키 5개를 각각 4로 똑같이 나누어 한 칸씩 골라요."],
      render: (b, a) => fn6Share(b, a, { N: 5, d: 4, mode: "whole", choose: true, strip: "쿠키 1개", unit: "개", who: "명", one: "한 명", tip: "방법을 고른 다음 띠를 나누고 한 명의 몫을 골라요.", ask: [
        ["구하는 식: ", { c: ["5÷4", "4÷5", "5×4"], a: 0 }],
        ["한 명이 먹을 수 있는 쿠키의 양: ", { f: "5/4" }, "개"]], ok: "방법 1로는 1 + [1/4] = [1 1/4]개, 방법 2로는 [1/4]개가 5개라서 [5/4]개예요. 두 방법의 몫은 같아요." }) },
    { inst: "몫이 1보다 큰 (자연수)÷(자연수)의 몫을 분수로 나타내는 방법을 정리해요.", hints: ["4÷3 = [4/3]에서 4와 3이 어디에 있는지 보세요."],
      render: (b, a) => blanks(b, a, ["몫이 1보다 큰 (자연수)÷(자연수)의 몫도 나누어지는 수를 ", { o: ["분자", "분모"], a: 0 }, ", 나누는 수를 ", { o: ["분모", "분자"], a: 0 }, "로 하는 분수로 나타낼 수 있습니다. 7÷5 = ", { o: ["[7/5]", "[5/7]"], a: 0 }, " = [1 2/5]이고, 대분수로 나타내지 ", { o: ["않아도 돼요", "않으면 틀려요"], a: 0 }, "."], { ok: "(자연수)÷(자연수)의 몫은 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타낼 수 있어요." }) },
    { inst: "나눗셈의 몫을 분수로 나타내어 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["7÷5 = [7/5]이에요.", "13÷8 = [13/8] = [1 5/8]예요."],
      render: (b, a) => fn6Calc(b, a, [{ e: "7÷5", a: "1 2/5" }, { e: "8÷3", a: "2 2/3" }, { e: "13÷8", a: "1 5/8" }, { e: "16÷9", a: "1 7/9" }], { bad: "다시 생각해 봐요. 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 써요. 대분수로 쓸 때는 자연수 부분과 분수 부분을 잘 나누어요." }) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["나누어지는 수가 나누는 수보다 크면 몫이 1보다 커요.", "어떤 수 × 8 = 72이면 어떤 수는 72÷8이에요."],
    render: (b, a) => fn6Both(b, a, [
      (x, y) => quiz(x, y, [
        { q: "몫이 1보다 큰 나눗셈을 모두 고르세요.", o: ["8÷13", "12÷11", "14÷9"], a: [1, 2], why: { "0": "8이 13보다 작으므로 8÷13 = [8/13]은 1보다 작아요." } },
        { q: "16÷9 ○ 18÷7 에서 ○ 안에 알맞은 것은?", o: [">", "<", "="], a: 1, why: { "0": "16÷9 = [1 7/9], 18÷7 = [2 4/7]예요. 자연수 부분을 비교해요." } },
        { q: "13÷4 ○ 23÷8 에서 ○ 안에 알맞은 것은?", o: [">", "<", "="], a: 0, why: { "1": "13÷4 = [3 1/4], 23÷8 = [2 7/8]이에요. 자연수 부분을 비교해요." } }]),
      (x, y) => fn6Calc(x, y, [
        { e: "7÷6", a: "1 1/6" }, { e: "11÷5", a: "2 1/5" }, { e: "16÷3", a: "5 1/3" }, { e: "23÷12", a: "1 11/12" },
        { q: "넓이가 21 cm²이고 가로가 4 cm인 직사각형의 세로는 몇 cm일까요?", x: "21÷4", a: "5 1/4", unit: "cm", lab: "21÷4 =" },
        { q: "어떤 수를 8로 나누어야 할 것을 잘못하여 곱했더니 72가 되었어요. 바르게 계산한 몫은?", x: "9÷8", a: "1 1/8", lab: "몫", why: { "8/9": "어떤 수는 72÷8 = 9예요. 9÷8의 몫은 9가 분자예요." } }], { bad: "다시 생각해 봐요. 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 써요." })],
      { titles: ["① 몫의 크기", "② 몫을 분수로"], ok: "몫이 1보다 큰 (자연수)÷(자연수)도 잘 해결했어요!" }) }
},
{
  id: "t4", no: 4, title: "(분수)÷(자연수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(분수)÷(자연수)는 어떻게 계산할까요?",
  summary: "다슬기 [4/9] t을 트럭 2대에 똑같이 나누어 실으면 한 대에 [2/9] t을 실어요. [4/9]는 [1/9]이 4개이고 4÷2 = 2이므로 [4/9]÷2 = [4÷2/9] = [2/9]예요. [2/3]÷5처럼 분자가 나누어떨어지지 않으면 [2/3]를 크기가 같은 분수 [10/15]으로 바꾸어 [10/15]÷5 = [10÷5/15] = [2/15]로 계산해요. 분자가 자연수의 배수인 경우에는 분자를 자연수로 나누어 계산하고, 배수가 아닌 경우에는 크기가 같은 분수 중에서 분자가 자연수의 배수인 분수로 바꾸어 계산합니다.",
  steps: [
    { inst: "푸름시의 하천에서 ‘다슬기 풀어 주기’ 행사가 열렸어요. 다슬기는 물을 깨끗하게 만들고 생태계를 보호해요. 다슬기 [4/9] t을 트럭 2대에 똑같이 나누어 실었어요. 트럭 한 대에 실은 다슬기의 양을 알아봐요. 색칠한 [4/9]를 2묶음으로 나눈 것 중 한 묶음을 골라 보세요.", hints: ["[4/9]는 [1/9]이 4개인 수예요.", "4칸을 2묶음으로 나누면 한 묶음은 2칸이에요."],
      render: (b, a) => fn6Div(b, a, { A: "4/9", k: 2, unit: " t", aName: "다슬기 [4/9] t", ask: [
        ["구하는 식: ", { c: ["[4/9]÷2", "[4/9]×2", "[2/9]÷4"], a: 0 }],
        ["[4/9]는 [1/9]이 ", { i: "4" }, "개인 수예요. 4÷2 = ", { i: "2" }, "이므로 [4/9]÷2는 [1/9]이 ", { i: "2" }, "개예요."],
        ["[4/9]÷2 = ", { q: [null, ["4", "÷", "?2"], "9"] }, " = ", { q: [null, "?2", "9"] }]], ok: "트럭 한 대에 실은 다슬기는 [2/9] t이에요. 분자가 나누는 수의 배수이면 분자를 나누어요." }) },
    { inst: "[2/3]÷5를 어떻게 계산하는지 알아봐요. 색칠한 칸이 2칸이라 5묶음으로 나눌 수 없어요. 각 칸을 똑같이 나누어 분자가 5로 나누어떨어지게 만들어 보세요.", hints: ["각 칸을 5칸으로 나누면 [2/3]는 [10/15]이 돼요.", "10칸을 5묶음으로 나누면 한 묶음은 2칸이에요."],
      render: (b, a) => fn6Div(b, a, { A: "2/3", k: 5, m: 5, ask: [
        ["[2/3] = ", { q: [null, ["2", "×", "?5"], ["3", "×", "?5"]] }, " = ", { q: [null, "?10", "15"] }],
        ["[2/3]÷5 = [10/15]÷5 = ", { q: [null, ["10", "÷", "?5"], "15"] }, " = ", { q: [null, "?2", "15"] }],
        ["[2/3]÷5의 몫과 [10/15]÷5의 몫은 ", { c: ["서로 같아요", "서로 달라요"], a: 0 }, "."]], ok: "분자가 5로 나누어떨어지도록 [2/3]와 크기가 같은 분수 [10/15]으로 바꾸었어요. [2/3]÷5 = [2/15]예요." }) },
    { inst: "(분수)÷(자연수)를 계산하는 방법을 친구에게 설명해 보세요.", hints: ["[3/5]÷2: 분자 3은 2로 나누어떨어지지 않아요. 분자가 2의 배수가 되게 바꾸어요.", "[9/15]의 분자 9는 2의 배수가 아니에요."],
      render: (b, a) => quiz(b, a, [
        { q: "[8/9]÷4는 어떻게 계산하면 편리할까요?", o: ["분자 8을 4로 나누어 [2/9]", "분모 9를 4로 나누어요", "크기가 같은 분수로 꼭 바꾸어야 해요"], a: 0, why: { "1": "분모를 나누면 안 돼요. 8은 4의 배수이니 분자를 4로 나누어요.", "2": "8은 4의 배수라서 바로 분자를 나눌 수 있어요." } },
        { q: "[3/5]÷2를 계산하려면 [3/5]을 어떤 분수로 바꾸면 좋을까요?", o: ["[6/10]", "[9/15]", "[3/10]"], a: 0, why: { "1": "[9/15]의 분자 9는 2로 나누어떨어지지 않아요.", "2": "[3/10]은 [3/5]과 크기가 달라요." } },
        { q: "[3/5]÷2의 몫을 고르세요.", o: ["[3/10]", "[6/5]", "[3/2]"], a: 0, why: { "1": "[3/5]×2를 계산했어요. [6/10]÷2 = [6÷2/10]이에요.", "2": "분모를 2로 나누면 안 돼요." } }],
        { ok: "분자가 자연수의 배수이면 분자를 나누고, 아니면 분자가 자연수의 배수인 크기가 같은 분수로 바꾸어 계산해요." }) },
    { inst: "(분수)÷(자연수)의 계산 방법을 약속해요.", hints: ["[4/9]÷2와 [2/3]÷5를 어떻게 계산했는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["분자가 자연수의 배수인 경우에는 ", { o: ["분자를 자연수로 나누어", "분모를 자연수로 나누어"], a: 0 }, " 계산합니다. 분자가 자연수의 배수가 아닌 경우에는 크기가 같은 분수 중에서 ", { o: ["분자가 자연수의 배수인 분수로", "분모가 가장 작은 분수로"], a: 0 }, " 바꾸어 계산합니다."], { ok: "분자가 자연수의 배수이면 분자를 나누고, 아니면 크기가 같은 분수로 바꾸어 계산해요." }) },
    { inst: "계산해 보세요. 그리고 리본 문제를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["[3/5]÷2 = [6/10]÷2, [10/13]÷6 = [30/39]÷6이에요.", "5÷8은 나누어떨어지지 않으므로 [5/6]를 [40/48]으로 바꾸어요."],
      render: (b, a) => fn6Both(b, a, [
        (x, y) => fn6Calc(x, y, [{ e: "[6/11]÷3", a: "2/11" }, { e: "[3/5]÷2", a: "3/10" }, { e: "[8/9]÷4", a: "2/9" }, { e: "[10/13]÷6", a: "5/39" }]),
        (x, y) => fn6Chain(x, y, [
          ["리본 [5/6] m를 8도막으로 똑같이 잘랐어요. 구하는 식: ", { c: ["[5/6]÷8", "[5/6]×8", "8÷6"], a: 0 }],
          ["5÷8은 나누어떨어지지 않으므로 [5/6]를 ", { q: [null, "?40", "48"] }, "으로 바꾸어요."],
          ["[5/6]÷8 = [40/48]÷8 = ", { q: [null, ["40", "÷", "?8"], "48"] }, " = ", { q: [null, "?5", "48"] }],
          ["리본 한 도막은 ", { q: [null, "?5", "48"] }, " m예요."]], { ok: "리본 한 도막은 [5/48] m예요." })],
        { titles: ["① 계산하기", "② 리본 한 도막"], ok: "(분수)÷(자연수)의 계산 원리를 이해하고 식을 세워 계산했어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["[3/7]÷8: 분자 3이 8의 배수가 되도록 [24/56]로 바꾸어요.", "가장 작은 수는 [9/14], 가장 큰 수는 4예요."],
    render: (b, a) => fn6Both(b, a, [
      (x, y) => fn6Chain(x, y, [
        ["[12/13]÷4 = ", { q: [null, ["12", "÷", "?4"], "13"] }, " = ", { q: [null, "?3", "13"] }],
        ["[3/7]÷8 = ", { q: [null, "?24", "56"] }, "÷8 = ", { q: [null, ["?24", "÷", "8"], "56"] }, " = ", { q: [null, "?3", "56"] }]]),
      (x, y) => fn6Calc(x, y, [
        { e: "[10/11]÷9", a: "10/99" },
        { q: "[9/14], [5/7], 4 중에서 가장 작은 수를 가장 큰 수로 나눈 몫을 구하세요.", x: "[9/14]÷4", a: "9/56", lab: "몫" },
        { q: "페인트 [12/23] L를 3통에 똑같이 나누어 담았어요. 한 통에 담은 페인트는 몇 L일까요?", x: "[12/23]÷3", a: "4/23", unit: "L", lab: "[12/23]÷3 =" },
        { q: "[7/12]÷6에 알맞은 문제예요. “나무 막대 [7/12] m를 6도막으로 똑같이 나누었습니다. 한 도막은 몇 m일까요?”", x: "[7/12]÷6", a: "7/72", unit: "m", lab: "[7/12]÷6 =" }])],
      { titles: ["① 빈칸 채우기", "② 문제 해결"], ok: "(분수)÷(자연수)를 정확하게 계산했어요!" }) }
},
{
  id: "t5", no: 5, title: "(분수)÷(자연수)를 분수의 곱셈으로 나타내어 볼까요", soop: "탐구 정리하기(O)",
  question: "(분수)÷(자연수)를 분수의 곱셈으로 어떻게 나타낼까요?",
  summary: "가스 [4/5] t을 발전기 3대에 똑같이 나누어 넣으면 한 대에 [4/15] t을 넣어요. [4/5]÷3은 [4/5]를 3등분한 것 중의 하나이므로 [4/5]의 [1/3]이에요. 그래서 [4/5]÷3 = [4/5]×[1/3] = [4/15]예요. ÷3과 ×[1/3]의 의미는 같아요. (분수)÷(자연수)를 (분수)×[1/(자연수)]로 나타내어 계산할 수 있습니다. ■÷▲ = ■×[1/▲]",
  steps: [
    { inst: "푸름시에는 친환경 에너지 발전소가 있어요. 음식물 쓰레기를 이용하여 만든 가스 [4/5] t을 발전기 3대에 똑같이 나누어 전기 에너지로 바꾸었어요. 발전기 한 대에 나누어 넣은 가스의 양을 알아봐요. 넓이가 1인 사각형을 가스 1 t이라고 생각해요.", hints: ["먼저 세로로 5등분하여 4칸을 색칠해요([4/5] t).", "그다음 가로로 3등분하여 그중 1줄에 빗금을 그어요."],
      render: (b, a) => fn6Area(b, a, { whole: "가스 1 t", stages: [{ dir: "v", d: 5, n: 4, t: "가스 [4/5] t 색칠하기" }, { dir: "h", d: 3, n: 1, t: "그것을 3등분한 것 중 하나에 빗금" }], ask: [
        ["구하는 식: ", { c: ["[4/5]÷3", "[4/5]×3", "[3/5]÷4"], a: 0 }],
        ["빗금 친 부분은 전체를 ", { i: "15" }, "칸으로 나눈 것 중 ", { i: "4" }, "칸이에요."],
        ["발전기 한 대에 넣은 가스: [4/5]÷3 = ", { q: [null, "?4", "?15"] }, " (t)"]], ok: "빗금 친 부분은 [4/5] t의 [1/3]만큼이네요! 발전기 한 대에 [4/15] t을 넣었어요." }) },
    { inst: "[3/4]÷2를 그림으로 나타내고 분수의 곱셈으로 계산해 보세요.", hints: ["세로로 4등분하여 3칸을 색칠하고, 가로로 2등분하여 1줄에 빗금을 그어요.", "[3/4]÷2는 [3/4]의 [1/2]이에요."],
      render: (b, a) => fn6Area(b, a, { stages: [{ dir: "v", d: 4, n: 3, t: "[3/4] 색칠하기" }, { dir: "h", d: 2, n: 1, t: "그것을 2등분한 것 중 하나에 빗금" }], ask: [
        ["[3/4]÷2 = [3/4]×", { q: [null, "?1", "?2"] }, " = ", { q: [null, ["3", "×", "?1"], ["4", "×", "?2"]] }, " = ", { q: [null, "?3", "8"] }]], ok: "[3/4]÷2 = [3/4]×[1/2] = [3/8]이에요." }) },
    { inst: "÷3과 ×[1/3]의 의미를 비교하여 친구에게 설명해 보세요.", hints: ["3등분한 것 중의 하나는 [1/3]이에요.", "[4/5]÷3 = [4/5]×[1/3]이에요."],
      render: (b, a) => fn6Chain(b, a, [
        ["[4/5]÷3의 몫은 [4/5]를 3등분한 것 중의 하나이므로 [4/5]의 ", { q: [null, "?1", "?3"] }, "입니다."],
        ["따라서 [4/5]÷3은 [4/5]×", { q: [null, "?1", "?3"] }, "로 나타낼 수 있습니다."],
        ["[4/5]÷3 = [4/5]×[1/3] = ", { q: [null, "?4", "?15"] }],
        ["÷3과 ×[1/3]의 의미는 ", { c: ["같아요", "달라요"], a: 0 }, "."]],
        { ok: "[4/5]÷3은 [4/5]를 똑같이 3으로 나눈 것 중 하나이고, [4/5]×[1/3]은 [4/5]를 3등분한 것 중 하나예요. ÷3과 ×[1/3]의 의미는 같아요." }) },
    { inst: "(분수)÷(자연수)를 분수의 곱셈으로 나타내는 방법을 약속해요.", hints: ["[4/5]÷3 = [4/5]×[1/3]에서 ÷3이 무엇으로 바뀌었나요?"],
      render: (b, a) => blanks(b, a, ["(분수)÷(자연수)를 (분수)×", { o: ["[1/(자연수)]", "(자연수)"], a: 0 }, "로 나타내어 계산할 수 있습니다. ■÷▲ = ■×", { o: ["[1/▲]", "▲"], a: 0 }], { ok: "(분수)÷(자연수)를 (분수)×[1/▲]로 나타내어 계산할 수 있습니다." }) },
    { inst: "(분수)÷(자연수)를 분수의 곱셈으로 나타내어 계산하고, 수 카드로 나눗셈을 만들어 보세요. 두 활동을 모두 끝내요. 약분하지 않아도 맞아요.", hints: ["[9/10]÷6 = [9/10]×[1/6]에서 9와 6을 3으로 약분할 수 있어요.", "수 카드 6장을 한 번씩 모두 써서 진분수 2개와 나누는 수 2개를 만들어요."],
      render: (b, a) => fn6Both(b, a, [
        (x, y) => fn6Chain(x, y, [
          ["[3/4]÷2 = [3/4]×", { q: [null, "?1", "?2"] }, " = ", { f: "3/8" }],
          ["[9/10]÷6 = [9/10]×", { q: [null, "?1", "?6"] }, " = ", { f: "3/20" }],
          ["[4/7]÷5 = [4/7]×", { q: [null, "?1", "?5"] }, " = ", { f: "4/35" }],
          ["[8/11]÷10 = [8/11]×", { q: [null, "?1", "?10"] }, " = ", { f: "4/55" }]], { ok: "분수의 곱셈으로 나타내어 계산했어요." }),
        (x, y) => fn6Build(x, y, { cards: [4, 5, 6, 7, 8, 9], all: true, tip: "수 카드 4~9를 한 번씩 모두 사용하여 (진분수)÷(자연수)를 2개 만들고, 분수의 곱셈으로 계산한 몫을 써요.", boards: [{ kind: "fr", proper: true, label: "나눗셈 ①" }, { kind: "fr", proper: true, label: "나눗셈 ②" }], ok: "조건에 맞는 나눗셈을 만들었어요. 예: [4/9]÷7 = [4/9]×[1/7] = [4/63], [5/8]÷6 = [5/8]×[1/6] = [5/48]" })],
        { titles: ["① 곱셈으로 계산하기", "② 수 카드 4, 5, 6, 7, 8, 9"], ok: "(분수)÷(자연수)를 분수의 곱셈으로 나타내어 계산했어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["[□/32] < [5/32]이므로 □는 5보다 작은 자연수예요.", "정사각형은 네 변의 길이가 같아요."],
    render: (b, a) => fn6Calc(b, a, [
      { e: "[10/13]÷5", a: "2/13" },
      { q: "[7/9]을 6으로 나눈 몫을 구하세요.", x: "[7/9]÷6", a: "7/54", lab: "몫" },
      { q: "몫이 가장 작은 것을 고르세요.", pick: ["㉠ [7/8]÷2", "㉡ [3/4]÷4", "㉢ [5/16]÷5"], a: 2, why: { "0": "㉠ = [7/16], ㉡ = [3/16], ㉢ = [1/16]이에요.", "1": "㉠ = [7/16], ㉡ = [3/16], ㉢ = [1/16]이에요." } },
      { q: "끈 [11/12] m를 겹치지 않게 모두 사용하여 정사각형 한 개를 만들었어요. 정사각형의 한 변은 몇 m일까요?", x: "[11/12]÷4", a: "11/48", unit: "m", lab: "[11/12]÷4 =" },
      { q: "[□/32] < [5/8]÷4 에서 □ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?", n: 4, lab: "", unit: "개", why: { "5": "[5/8]÷4 = [5/32]예요. □는 5보다 작아야 해요.", "3": "1, 2, 3, 4가 모두 들어갈 수 있어요." } }]) }
},
{
  id: "t6", no: 6, title: "(대분수)÷(자연수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(대분수)÷(자연수)는 어떻게 계산할까요?",
  summary: "철망 [4 1/2] km로 유도울타리 4개를 똑같이 만들면 한 개에 [1 1/8] km를 써요. 방법 1은 대분수를 자연수 부분과 진분수 부분으로 나누어 (4÷4) + ([1/2]÷4) = 1 + [1/8] = [1 1/8], 방법 2는 대분수를 가분수로 바꾸어 [9/2]÷4 = [36/8]÷4 = [9/8] = [1 1/8]로 계산해요. 가분수로 바꾼 다음에는 분자가 자연수의 배수인 분수로 바꾸거나 분수의 곱셈으로 나타내어 계산할 수 있어요.",
  steps: [
    { inst: "푸름시의 생태 통로에 갔어요. 유도울타리는 야생 동물이 생태 통로로 안전하게 이동할 수 있도록 설치하는 구조물이에요. 길이가 [4 1/2] km인 철망을 똑같이 나누어 유도울타리 4개를 만들었어요. 방법 1로 한 개에 쓴 철망의 길이를 알아봐요. 자연수 부분과 진분수 부분을 각각 4묶음으로 나누어 한 묶음을 골라 보세요.", hints: ["1 km짜리 4개를 4묶음으로 나누면 한 묶음은 1 km예요.", "[1/2] km를 똑같이 4칸으로 나누면 한 칸은 [1/8] km예요."],
      render: (b, a) => fn6Div(b, a, { A: "4 1/2", k: 4, mode: "mixed", m: 4, unit: " km", aName: "철망 [4 1/2] km", tip: "1 km짜리 하나를 누르고, ‘＋’로 [1/2] km를 똑같이 나눈 다음 한 칸을 골라요.", ask: [
        ["구하는 식: ", { c: ["[4 1/2]÷4", "[4 1/2]×4", "4÷4"], a: 0 }],
        ["[4 1/2]÷4 = (4÷4) + ([1/2]÷4) = ", { i: "1" }, " + ", { q: [null, "?1", "?8"] }, " = ", { q: ["?1", "?1", "8"] }]], ok: "대분수를 자연수 부분과 진분수 부분으로 나누어 계산했어요. [4 1/2]÷4 = [1 1/8]이에요." }) },
    { inst: "이번에는 방법 2로 구해 봐요. [4 1/2]은 [1/2]이 9개예요. 분자 9가 4로 나누어떨어지지 않으니 각 칸을 똑같이 나눈 다음 4묶음 중 한 묶음을 골라 보세요.", hints: ["각 칸을 4칸으로 나누면 [1/8]이 36개예요.", "36칸을 4묶음으로 나누면 한 묶음은 9칸이에요."],
      render: (b, a) => fn6Div(b, a, { A: "4 1/2", k: 4, m: 4, unit: " km", aName: "철망 [4 1/2] km = [9/2] km", ask: [
        ["[4 1/2] = ", { q: [null, "?9", "2"] }, " = ", { q: [null, "?36", "8"] }],
        ["[4 1/2]÷4 = [36/8]÷4 = ", { q: [null, ["36", "÷", "?4"], "8"] }, " = ", { q: [null, "?9", "8"] }, " = ", { q: ["?1", "?1", "8"] }],
        ["이 방법은 대분수를 ", { c: ["가분수로 바꾸어", "자연수 부분만 나누어"], a: 0 }, " 계산했어요."]], ok: "두 방법 모두 [1 1/8] km(= [9/8] km)예요. 자연수 부분이 나누는 수의 배수이면 방법 1이 편리해요." }) },
    { inst: "[2 1/3]÷5를 지원이와 도훈이의 방법으로 계산하고 비교해 보세요. 지원: “분자가 자연수의 배수인 분수로 바꾸어 계산해 볼까?” 도훈: “분수의 곱셈으로 나타내어 계산해 볼까?”", hints: ["[2 1/3] = [7/3]이에요.", "지원: [7/3] = [35/15], 도훈: [7/3]×[1/5]"],
      render: (b, a) => fn6Chain(b, a, [
        { t: "지원", p: ["[2 1/3]÷5 = [7/3]÷5 = ", { q: [null, "?35", "15"] }, "÷5 = ", { q: [null, ["35", "÷", "?5"], "15"] }, " = ", { f: "7/15" }] },
        { t: "도훈", p: ["[2 1/3]÷5 = [7/3]÷5 = [7/3]×", { q: [null, "?1", "?5"] }, " = ", { f: "7/15" }] },
        ["두 사람 모두 대분수를 ", { c: ["가분수로", "자연수로"], a: 0 }, " 바꾼 후 계산했어요."],
        ["지원이는 ", { c: ["분자가 자연수의 배수인 분수로 바꾸어", "분수의 곱셈으로 나타내어"], a: 0 }, ", 도훈이는 ", { c: ["분수의 곱셈으로 나타내어", "분자가 자연수의 배수인 분수로 바꾸어"], a: 0 }, " 계산했어요."]],
        { ok: "둘 다 [2 1/3]÷5 = [7/15]이에요. 계산 방법은 달라도 몫은 같아요." }) },
    { inst: "(대분수)÷(자연수)의 계산 방법을 정리해요.", hints: ["방법 1과 방법 2를 떠올려요."],
      render: (b, a) => blanks(b, a, ["(대분수)÷(자연수)는 대분수를 ", { o: ["자연수 부분과 진분수 부분으로", "분자와 분모로"], a: 0 }, " 나누어 계산하거나, 대분수를 ", { o: ["가분수로", "소수로"], a: 0 }, " 바꾸어 계산합니다."], { ok: "대분수를 자연수 부분과 진분수 부분으로 나누어 계산하거나 가분수로 바꾸어 계산해요." }) },
    { inst: "편리한 방법으로 계산하고, 평행사변형의 높이를 구해 보세요. 두 활동을 모두 끝내요.", hints: ["[5 1/2]÷5는 자연수 부분 5가 5의 배수라서 방법 1이 편리해요.", "(높이) = (넓이)÷(밑변의 길이)예요."],
      render: (b, a) => fn6Both(b, a, [
        (x, y) => fn6Calc(x, y, [{ e: "[5 1/2]÷5", a: "1 1/10" }, { e: "[1 2/3]÷6", a: "5/18" }, { e: "[4 3/7]÷2", a: "2 3/14" }, { e: "[2 2/5]÷3", a: "4/5" }]),
        (x, y) => fn6Calc(x, y, [
          { q: "넓이가 [8 3/4] cm²이고 밑변의 길이가 7 cm인 평행사변형의 높이를 구하는 식을 고르세요.", pick: ["[8 3/4]÷7", "[8 3/4]×7", "7÷[8 3/4]"], a: 0, why: { "1": "(평행사변형의 넓이) = (밑변의 길이)×(높이)이므로 높이는 넓이를 밑변의 길이로 나누어요.", "2": "넓이를 밑변의 길이로 나누어요. 순서가 바뀌었어요." } },
          { q: "평행사변형의 높이는 몇 cm일까요?", x: "[8 3/4]÷7", a: "1 1/4", unit: "cm", lab: "[8 3/4]÷7 =" }], { fig: fn6Para })],
        { titles: ["① 계산하기", "② 평행사변형의 높이"], ok: "(대분수)÷(자연수)를 알맞은 방법으로 계산했어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요. 두 활동을 모두 끝내요.", hints: ["[5 5/7] = [40/7]이에요.", "÷3은 ×[1/3]로 바꾸어야 해요. ×3이 아니에요."],
    render: (b, a) => fn6Both(b, a, [
      (x, y) => fn6Chain(x, y, [
        { t: "방법 1", p: ["[5 5/7]÷5 = (5÷5) + ([5/7]÷", { i: "5" }, ") = ", { i: "1" }, " + ", { q: [null, "?1", "7"] }, " = ", { q: ["?1", "?1", "7"] }] },
        { t: "방법 2", p: ["[5 5/7] = ", { q: [null, "?40", "7"] }] },
        { t: "방법 2", p: ["[40/7]÷5 = ", { q: [null, ["40", "÷", "?5"], "7"] }, " = ", { q: [null, "?8", "7"] }] }]),
      (x, y) => fn6Calc(x, y, [
        { e: "[4 3/8]÷5", a: "7/8" },
        { q: "몫이 다른 나눗셈을 고르세요.", pick: ["[3 2/3]÷5", "[2 1/5]÷3", "[1 11/15]÷2"], a: 2, why: { "0": "[3 2/3]÷5 = [11/15], [2 1/5]÷3 = [11/15], [1 11/15]÷2 = [13/15]이에요.", "1": "[3 2/3]÷5 = [11/15], [2 1/5]÷3 = [11/15], [1 11/15]÷2 = [13/15]이에요." } },
        { q: "두 나눗셈의 몫의 합을 구하세요. [2 2/7]÷4, [1 1/6]÷2", x: "[2 2/7]÷4+[1 1/6]÷2", a: "1 13/84", lab: "합" },
        { q: "잘못 계산한 것을 바르게 계산하세요. [2 7/10]÷3 = [27/10]×3 = [81/10] = [8 1/10]", x: "[2 7/10]÷3", a: "9/10", lab: "[2 7/10]÷3 =", why: { "81/10": "÷3을 ×3으로 바꾸어 계산했어요. ÷3은 ×[1/3]이에요.", "8 1/10": "÷3을 ×3으로 바꾸어 계산했어요. ÷3은 ×[1/3]이에요." } },
        { q: "설탕 [18 4/5] kg을 4봉지에 똑같이 나누어 담았어요. 한 봉지에 담은 설탕은 몇 kg일까요?", x: "[18 4/5]÷4", a: "4 7/10", unit: "kg", lab: "[18 4/5]÷4 =" }])],
      { titles: ["① 두 가지 방법", "② 문제 해결"], ok: "(대분수)÷(자연수)를 정확하게 계산했어요!" }) }
},
{
  id: "t78", no: "7~8", title: "생각을 더하다 ― 1개의 무게를 구해 볼까요", soop: "탐구 정리하기(O)",
  question: "상자에 든 물건 1개의 무게를 분수의 나눗셈으로 어떻게 구할까요?",
  summary: "배려시가 산불로 어려움을 겪는 희망군에 구호 텐트를 기부했어요. 텐트가 든 상자 3개의 무게가 [29 1/2] kg이면 상자 1개는 [29 1/2]÷3 = [59/6] = [9 5/6] (kg), 빈 상자 [5/6] kg을 빼면 텐트 2개는 9 kg, 텐트 1개는 9÷2 = [4 1/2] (kg)이에요. 사과 1개의 무게도 [27 1/5]÷8 = [3 2/5], [3 2/5] − [2/5] = 3, 3÷10 = [3/10] (kg)으로 구해요. 문제를 이해하고, 계획을 세우고, 해결하고, 되돌아보아요.",
  steps: [
    { name: "이해해요", inst: "배려시가 희망군에 구호 텐트를 기부했습니다. 상자 1개에는 무게가 같은 구호 텐트가 2개씩 들어 있습니다. 구호 텐트가 들어 있는 상자 3개의 무게는 [29 1/2] kg이고 빈 상자 1개의 무게는 [5/6] kg일 때, 구호 텐트 1개의 무게는 몇 kg인지 분수로 나타내어 봅시다.", hints: ["문제의 마지막 문장에서 구하려는 것을 찾아요.", "주어진 수를 모두 찾아요."],
      render: (b, a) => quiz(b, a, [
        { q: "구하려는 것은 무엇인가요?", o: ["구호 텐트 1개의 무게", "상자 3개의 무게", "빈 상자 1개의 무게"], a: 0 },
        { q: "상자 1개에 든 구호 텐트는 몇 개인가요?", o: ["2개", "3개", "1개"], a: 0, why: { "1": "3은 상자의 수예요. 상자 1개에는 텐트가 2개씩 들어 있어요." } },
        { q: "주어진 조건을 모두 고르세요.", o: ["텐트가 든 상자 3개의 무게 [29 1/2] kg", "빈 상자 1개의 무게 [5/6] kg", "상자 1개에 텐트 2개씩", "텐트 1개의 무게 [4 1/2] kg"], a: [0, 1, 2], why: { "3": "텐트 1개의 무게는 우리가 구해야 하는 것이에요." } }],
        { ok: "구하려는 것과 주어진 조건을 잘 찾았어요." }) },
    { name: "계획해요", inst: "구호 텐트 1개의 무게를 구하는 차례를 계획해 보세요. 할 일을 차례대로 눌러요.", hints: ["상자 3개의 무게로 상자 1개의 무게를 먼저 구해요.", "상자 1개의 무게에는 빈 상자의 무게도 들어 있어요."],
      render: (b, a) => sequence(b, a, ["텐트 2개의 무게를 2로 나누어 텐트 1개의 무게를 구해요.", "상자 3개의 무게를 상자 수 3으로 나누어 텐트가 든 상자 1개의 무게를 구해요.", "상자 1개의 무게에서 빈 상자의 무게를 빼서 텐트 2개의 무게를 구해요."], [1, 2, 0], { ok: "상자 1개 → 텐트 2개 → 텐트 1개 차례로 구해요." }) },
    { name: "해결해요", inst: "계획대로 구호 텐트 1개의 무게를 구해 보세요.", hints: ["[29 1/2] = [59/2]이고, ÷3은 ×[1/3]로 계산할 수 있어요.", "[9 5/6] − [5/6] = 9예요."],
      render: (b, a) => fn6Chain(b, a, [
        ["텐트가 든 상자 1개: [29 1/2]÷3 = ", { q: [null, "?59", "2"] }, "÷3 = [59/2]×", { q: [null, "?1", "?3"] }, " = ", { q: [null, "?59", "6"] }, " = ", { q: ["?9", "?5", "6"] }, " (kg)"],
        ["텐트 2개: [9 5/6] − [5/6] = ", { i: "9" }, " (kg)"],
        ["텐트 1개: 9÷2 = ", { q: [null, "?9", "?2"] }, " = ", { q: ["?4", "?1", "2"] }, " (kg)"]],
        { ok: "구호 텐트 1개의 무게는 [4 1/2] kg(= [9/2] kg)이에요." }) },
    { name: "한 번 더 해요", inst: "희망군은 보답으로 배려시에 사과를 전달했습니다. 상자 1개에는 무게가 같은 사과가 10개씩 들어 있습니다. 사과가 들어 있는 상자 8개의 무게는 [27 1/5] kg이고 빈 상자 1개의 무게는 [2/5] kg일 때, 사과 1개의 무게는 몇 kg인지 분수로 나타내어 봅시다.", hints: ["[27 1/5] = [136/5]이고 136과 8은 8로 약분할 수 있어요.", "사과 10개가 3 kg이면 사과 1개는 3÷10이에요."],
      render: (b, a) => fn6Chain(b, a, [
        ["사과가 든 상자 1개: [27 1/5]÷8 = ", { q: [null, "?136", "5"] }, "÷8 = ", { q: [null, "?17", "5"] }, " = ", { q: ["?3", "?2", "5"] }, " (kg)"],
        ["사과 10개: [3 2/5] − [2/5] = ", { i: "3" }, " (kg)"],
        ["사과 1개: 3÷10 = ", { f: "3/10" }, " (kg)"]],
        { ok: "사과 1개의 무게는 [3/10] kg이에요. 4단계를 떠올려 스스로 해결했어요." }) },
    { name: "되돌아봐요", inst: "문제를 잘 해결했나요? 다른 방법으로도 풀어 보고, 조건을 바꾸어 생각해 보세요.", hints: ["[59/2]의 분자와 분모에 3을 곱하면 분자가 3의 배수가 돼요.", "상자 1개에 텐트가 3개씩이면 9 kg을 3으로 나누어요."],
      render: (b, a) => fn6Chain(b, a, [
        { t: "다른 방법", p: ["[29 1/2]÷3 = [59/2]÷3 = ", { q: [null, "?177", "6"] }, "÷3 = ", { q: [null, ["177", "÷", "?3"], "6"] }, " = ", { q: [null, "?59", "6"] }] },
        ["조건 바꾸기: 상자 1개에 텐트가 3개씩 들어 있다면 텐트 1개의 무게는 9÷3 = ", { i: "3" }, " (kg)이에요."],
        ["해결하지 못했다면 ", { c: ["단계를 다시 확인하고 다른 방법을 찾아요", "답만 보고 넘어가요"], a: 0 }, "."]],
        { ok: "분자가 자연수의 배수인 분수로 바꾸어도 몫은 같아요. 조건을 바꾸면 새로운 문제를 만들 수 있어요." }) }
  ],
  challenge: { inst: "조건을 바꾼 새 문제예요(이 앱이 정한 수). 상자 1개에는 무게가 같은 물병이 3개씩 들어 있어요. 물병이 들어 있는 상자 4개의 무게는 [18 2/3] kg이고 빈 상자 1개의 무게는 [1/6] kg이에요. 물병 1개의 무게를 구해 보세요.", hints: ["[18 2/3]÷4 = [56/3]÷4 = [14/3] = [4 2/3]예요.", "[4 2/3] − [1/6] = [28/6] − [1/6]이에요."],
    render: (b, a) => fn6Calc(b, a, [
      { lab: "물병이 든 상자 1개", x: "[18 2/3]÷4", a: "4 2/3", unit: "kg" },
      { lab: "물병 3개", x: "[18 2/3]÷4−[1/6]", a: "4 1/2", unit: "kg" },
      { lab: "물병 1개", x: "([18 2/3]÷4−[1/6])÷3", a: "1 1/2", unit: "kg" }], { ok: "물병 1개의 무게는 [1 1/2] kg이에요. 4단계로 차근차근 해결했어요!" }) }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 기억의 이어달리기! 전달하고 계산해요", soop: "발표하기(P)",
  question: "분수의 나눗셈을 정확하게 기억하고 전달하여 옳게 계산할 수 있을까요?",
  summary: "4명씩 모둠을 만들어 한 줄로 서요. 맨 뒷사람이 나눗셈 카드를 화이트보드에 옮겨 쓰고, 앞사람에게 차례로 전달해요. 맨 앞사람은 전달받은 나눗셈을 칠판에 쓰고 계산해요. 카드를 맞히고 옳게 계산하면 2점, 맞혔으나 잘못 계산하면 1점, 맞히지 못했으나 옳게 계산하면 1점, 둘 다 못 하면 0점이에요. 속도보다 정확하게 쓰고 계산해요.",
  steps: [
    { name: "놀이 준비", inst: "놀이 순서를 차례대로 눌러 보세요. (준비물: 나눗셈 카드, 타이머, 화이트보드, 칠판 펜)", hints: ["먼저 모둠을 만들고 한 줄로 서요.", "맨 앞사람이 마지막에 칠판에 쓰고 계산해요."],
      render: (b, a) => sequence(b, a, ["맨 뒷사람이 카드 한 장을 뒤집어 확인하고 화이트보드에 옮겨 써요.", "4명씩 모둠을 만들고 순서를 정해 칠판을 바라보고 한 줄로 서요.", "맨 앞사람은 전달받은 나눗셈을 칠판에 쓰고 계산해요.", "바로 앞사람에게 화이트보드를 보여 주고, 앞사람은 외워서 자기 화이트보드에 쓴 다음 다시 앞사람에게 보여 주어요."], [1, 0, 3, 2], { ok: "정한 시간 동안 맨 앞사람까지 전달해요. 사용한 카드는 쌓아 둔 카드의 맨 아래에 넣고, 서 있는 순서를 바꾸어 반복해요." }) },
    { name: "점수 매기기", inst: "카드에 적힌 나눗셈은 [6/7]÷2예요. 맨 앞사람이 칠판에 쓴 것을 보고 점수를 매겨 보세요.", hints: ["카드와 같은 나눗셈을 썼는지, 쓴 나눗셈을 옳게 계산했는지 두 가지를 봐요.", "잘못 전달되어도 옳게 계산하면 1점이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "[6/7]÷2 = [3/7]", o: ["2점", "1점", "0점"], a: 0, why: { "1": "카드를 맞혔고 옳게 계산했으니까 2점이에요." } },
        { q: "[6/7]÷2 = [3/14]", o: ["2점", "1점", "0점"], a: 1, why: { "0": "[6/7]÷2 = [3/7]이에요. 맞혔으나 잘못 계산했어요.", "2": "카드는 맞혔으니까 1점을 얻어요." } },
        { q: "[6/7]÷3 = [2/7]", o: ["2점", "1점", "0점"], a: 1, why: { "0": "카드는 맞히지 못했어요.", "2": "[6/7]÷3 = [2/7]는 옳게 계산했으니까 1점을 얻어요." } },
        { q: "[5/7]÷2 = [10/7]", o: ["2점", "1점", "0점"], a: 2, why: { "0": "카드를 맞히지 못했고, [5/7]÷2 = [5/14]이니 계산도 틀렸어요.", "1": "카드를 맞히지 못했고, [5/7]÷2 = [5/14]이니 계산도 틀렸어요." } }],
        { ok: "맞히고 옳게 계산 2점, 둘 중 하나만 하면 1점, 둘 다 못 하면 0점이에요." }) },
    { name: "이어달리기", inst: "기억의 이어달리기를 해 봐요. 이 앱에서는 내가 카드를 잠깐 보고 기억했다가, 맨 앞사람이 되어 칠판에 쓰고 계산해요. 5판 중 4판 이상 옳게 계산해 보세요.", hints: ["카드가 보일 때 분자, 분모, 나누는 수를 소리 내어 외워요.", "분자가 나누는 수의 배수가 아니면 크기가 같은 분수로 바꾸거나 ×[1/▲]로 계산해요."],
      render: (b, a) => fn6Relay(b, a, { cards: FN6_CARDS, rounds: 5, need: 4, sec: 5 }) },
    { name: "또 다른 놀이", inst: "또 다른 놀이 방법이에요. 나눗셈 카드 16장을 가로 4장, 세로 4장으로 뒤집어 놓고 차례로 한 장씩 골라 계산해요. 옳게 계산하면 그 카드에 이름을 써서 놓고, 틀리면 다시 뒤집어 놓아요. 가로·세로·대각선으로 자기 카드 한 줄을 먼저 만들면 이겨요. 줄이 없으면 카드가 많은 사람이 이겨요.", hints: ["줄을 만들 수 있는 자리의 카드를 골라요.", "옳게 계산해야 카드를 가질 수 있어요."],
      render: (b, a) => fn6Line(b, a, { cards: FN6_CARDS }) },
    { name: "되돌아봐요", inst: "놀이를 되돌아봐요.", hints: ["친구와 함께하는 놀이예요.", "빨리 하는 것보다 정확한 것이 중요해요."],
      render: (b, a) => quiz(b, a, [
        { q: "놀이할 때 지킬 점을 모두 고르세요.", o: ["화이트보드에 정확하게 써서 전달해요.", "친구의 화이트보드를 보면서 따라 쓰지 않아요.", "잘못 전달되어도 끝까지 집중해 옳게 계산해요.", "맨 앞사람의 계산이 끝날 때까지 기다려 주고 함께 확인해요.", "빨리 끝내려고 앞사람을 재촉해요."], a: [0, 1, 2, 3], why: { "4": "속도보다 정확하게 쓰고 계산하는 것이 중요해요. 친구를 배려해요." } }],
        { ok: "친구를 배려하며 정확하게 전달하고 계산했어요." }) }
  ],
  challenge: { inst: "더 어려운 카드로 이어달리기를 해 봐요. (분수)÷(자연수)와 (대분수)÷(자연수) 카드만 나와요. 카드 보는 시간을 3초로 줄여 5판 중 4판 이상 옳게 계산해 보세요.", hints: ["대분수는 자연수 부분, 분자, 분모, 나누는 수를 차례로 외워요.", "대분수는 가분수로 바꾸어 계산하면 편리해요."],
    render: (b, a) => fn6Relay(b, a, { cards: FN6_CARDS.slice(5), rounds: 5, need: 4, sec: 3 }) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분수의 나눗셈에서 배운 내용을 확인해 볼까요?",
  summary: "(자연수)÷(자연수)는 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타내요(5÷7 = [5/7]). (분수)÷(자연수)는 분자를 자연수로 나누어 계산하거나([2/11]÷5 = [10/55]÷5 = [2/55]), 분수의 곱셈으로 나타내어 계산해요([2/11]÷5 = [2/11]×[1/5] = [2/55]). (대분수)÷(자연수)는 대분수를 자연수 부분과 진분수 부분으로 나누어 계산하거나 대분수를 가분수로 바꾸어 계산해요.",
  steps: [
    { name: "그림으로 몫 구하기", inst: "5÷6을 그림에 나타내고 몫을 구해 보세요. 띠 5개를 6명에게 똑같이 나누어 준다고 생각해요.", hints: ["띠마다 똑같이 6칸으로 나누어 한 칸씩 골라요.", "1÷6 = [1/6]이고 5는 1이 5개예요."],
      render: (b, a) => fn6Share(b, a, { N: 5, d: 6, strip: "1", who: "명", one: "한 명", ask: [
        ["1÷6 = [1/6]이고 5는 1이 5개이므로 5÷6은 [1/6]이 ", { i: "5" }, "개예요."],
        ["5÷6 = ", { q: [null, "?5", "?6"] }]], ok: "5÷6 = [5/6]예요." }) },
    { name: "빗금으로 몫 나타내기", inst: "보기 [2/3]÷3 = [6/9]÷3 = [6÷3/9] = [2/9]처럼 [3/4]÷5의 몫을 그림에 나타내어 보세요. 색칠한 부분이 [3/4]이에요.", hints: ["각 칸을 5칸으로 나누면 [3/4] = [15/20]예요.", "15칸을 5묶음으로 나누면 한 묶음은 3칸이에요. 어느 칸이든 3칸이면 돼요."],
      render: (b, a) => fn6Div(b, a, { A: "3/4", k: 5, m: 5, ask: [
        ["[3/4]÷5 = ", { q: [null, "?15", "20"] }, "÷5 = ", { q: [null, ["?15", "÷", "5"], "20"] }, " = ", { q: [null, "?3", "20"] }]], ok: "색칠한 부분 중 3칸을 골라 [3/20]을 나타냈어요." }) },
    { name: "곱셈으로 계산하기", inst: "분수의 곱셈으로 나타내어 계산해 보세요. 약분하지 않아도 맞아요.", hints: ["÷5는 ×[1/5]로 나타내요.", "[2 1/5]은 먼저 가분수 [11/5]로 바꾸어요."],
      render: (b, a) => fn6Chain(b, a, [
        ["[5/8]÷5 = [5/8]×", { q: [null, "?1", "?5"] }, " = ", { f: "1/8" }],
        ["[6/11]÷8 = [6/11]×", { q: [null, "?1", "?8"] }, " = ", { f: "3/44" }],
        ["[5/7]÷4 = [5/7]×", { q: [null, "?1", "?4"] }, " = ", { f: "5/28" }],
        ["[2 1/5]÷3 = ", { q: [null, "?11", "5"] }, "×", { q: [null, "?1", "?3"] }, " = ", { f: "11/15" }]],
        { ok: "(분수)÷(자연수)를 분수의 곱셈으로 나타내어 계산했어요." }) },
    { name: "잘못 찾기", inst: "[7/8]÷4를 두 친구가 계산했어요. 서희: “분수의 곱셈으로 나타내어 계산했어.” [7/8]÷4 = [7/8]×[1/4] = [7/32] / 연우: “분자를 자연수로 나누어 계산했어.” [7/8]÷4 = [7/8÷4] = [7/2] = [3 1/2]", hints: ["연우는 분자가 아니라 분모를 4로 나누었어요.", "분자 7이 4의 배수가 되도록 [7/8]을 [28/32]로 바꾸어요."],
      render: (b, a) => fn6Both(b, a, [
        (x, y) => quiz(x, y, [{ q: "잘못 계산한 사람은 누구인가요?", o: ["서희", "연우"], a: 1, why: { "0": "서희는 ÷4를 ×[1/4]로 바꾸어 옳게 계산했어요." } }], { ok: "연우는 분자를 자연수로 나누어야 하는데 분모를 자연수로 나누었어요." }),
        (x, y) => fn6Chain(x, y, [
          ["연우가 설명한 방법(분자를 자연수로 나누기)대로: [7/8]÷4 = ", { q: [null, "?28", "32"] }, "÷4 = ", { q: [null, ["28", "÷", "?4"], "32"] }, " = ", { q: [null, "?7", "32"] }]], { ok: "[7/8]÷4 = [28/32]÷4 = [7/32]이에요." })],
      { titles: ["① 잘못 계산한 사람", "② 바르게 계산하기"], ok: "잘못된 곳을 찾고, 설명한 방법대로 바르게 계산했어요!" }) },
    { name: "생활 속 문제", inst: "문제를 풀어 보세요.", hints: ["[1 1/5] = [6/5] = [12/10]예요.", "정삼각형은 세 변의 길이가 같아요."],
      render: (b, a) => fn6Calc(b, a, [
        { q: "우유 [1 1/5] L를 4명이 똑같이 나누어 마시려고 해요. 한 명이 마실 수 있는 우유는 몇 L일까요?", x: "[1 1/5]÷4", a: "3/10", unit: "L", lab: "[1 1/5]÷4 =" },
        { q: "철사 [8/9] m를 겹치지 않게 모두 사용하여 크기가 같은 정삼각형 2개를 만들었어요. 정삼각형 한 개를 만드는 데 사용한 철사는 몇 m일까요?", x: "[8/9]÷2", a: "4/9", unit: "m", lab: "[8/9]÷2 =" },
        { q: "정삼각형의 한 변의 길이는 몇 m일까요?", x: "[8/9]÷2÷3", a: "4/27", unit: "m", lab: "[4/9]÷3 =", why: { "4/9": "[4/9] m는 정삼각형 한 개의 둘레예요. 변이 3개이니 3으로 나누어요." } }], { fig: fn6Tri }) },
    { name: "확인하고 정리해요", inst: "단원에서 배운 내용을 정리해요. 두 활동을 모두 끝내요.", hints: ["방법 1은 분자가 자연수의 배수가 되게 바꾸어요.", "방법 2는 ×[1/5]로 바꾸어요."],
      render: (b, a) => fn6Both(b, a, [
        (x, y) => fn6Chain(x, y, [
          ["(자연수)÷(자연수): 5÷7 = ", { q: [null, "?5", "7"] }],
          { t: "방법 1", p: ["[2/11]÷5 = ", { q: [null, "?10", "55"] }, "÷5 = [10÷5/55] = ", { q: [null, "?2", "55"] }] },
          { t: "방법 2", p: ["[2/11]÷5 = [2/11]×", { q: [null, "?1", "?5"] }, " = ", { q: [null, "?2", "55"] }] }]),
        (x, y) => blanks(x, y, ["(대분수)÷(자연수)는 대분수를 자연수 부분과 진분수 부분으로 나누어 계산하거나 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 바꾸어 계산합니다."], { ok: "대분수를 가분수로 바꾸어 계산할 수 있어요." })],
        { titles: ["① (자연수)÷(자연수)와 (분수)÷(자연수)", "② (대분수)÷(자연수)"], ok: "분수의 나눗셈을 잘 정리했어요. 다음 시간에는 각기둥과 각뿔을 배워요." }) }
  ],
  challenge: { inst: "나눗셈의 몫을 찾아 이어 보세요. 짝이 없는 몫도 있어요.", hints: ["[2 2/5]÷4 = [12/5]÷4예요.", "7÷4 = [7/4] = [1 3/4]이에요."],
    render: (b, a) => fn6Match(b, a, { left: [{ t: "[9/10]÷3", k: 0 }, { t: "[2 2/5]÷4", k: 1 }, { t: "7÷4", k: 2 }, { t: "[5/6]÷5", k: 3 }],
      right: [{ t: "[3/5]", k: 1 }, { t: "[1/6]", k: 3 }, { t: "[4/7]", k: null }, { t: "[1 3/4]", k: 2 }, { t: "[3/10]", k: 0 }], ok: "나눗셈의 몫을 바르게 찾았어요!" }) }
}
];
