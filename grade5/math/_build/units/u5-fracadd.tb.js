//@@APP
const APP={title:"유기견 보호 센터 분수의 덧셈과 뺄셈", unit:"5-1 수학 5. 분수의 덧셈과 뺄셈(교과서)", key:"t51-fracadd-v1", welcome:"유기견 보호 센터 분수의 덧셈과 뺄셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 유기견 보호 센터에서 봉사 활동을 하는 소윤이와 지후와 함께 분모가 다른 분수를 통분하여 더하고 빼 봐요."};
//@@UNIT
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
function fa5A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(fa5Plain) }) }); }
const fa5Quiz0 = quiz, fa5Blanks0 = blanks;
quiz = (b, a, items, o) => fa5Quiz0(b, fa5A(a), items, o);
blanks = (b, a, parts, o) => fa5Blanks0(b, fa5A(a), parts, o);

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
  return el;
}
function fa5Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 3, class: "fa5box", "aria-label": "빈칸" });
  i.exp = String(exp);
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

/* ① 식과 답 (분수 답은 같은 분모의 가분수·대분수·자연수 모두 정답, 약분한 답은 '값은 같아요' 안내)
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
      R.inp = fa5In(it.lab || it.e || "답");
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
  api.provide({ words: opt.words || ["분모는 그대로", "분자끼리 계산", "자연수 부분", "분수 부분", "가분수", "대분수"], answers: rows.map(ansText) });
  const btn = h("button", { class: "big", onclick: () => {
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
      const r = R.inp.get(), J = fa5Judge(r, it.a, R.den); given.push(R.inp.text());
      if (J.code === "ok") { R.inp.paint(true); return; }
      if (J.code === "diffden" || J.code === "zero") { R.inp.paint(null); if (!hint) hint = J.msg; return; }
      R.inp.paint(false);
      if (!bad) bad = (it.why && it.why[fa5Key(r)]) || J.msg || fa5Diag(it.e || it.x, r) || opt.bad || `${fa5J(`[1/${R.den}]`, "이가")} 몇 개인지 세어 다시 계산해 봐요.`;
    });
    if (bad) return api.fail(bad, given.join(" / "));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + fa5Book(num, den); R.res.classList.remove("hidden"); } });
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요! 가분수로 써도, 대분수로 써도 맞아요.");
  } }, "확인하기");
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, btn));
}
/* ② 차례대로 빈칸 채우기 (계산 과정)
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 수 칸 | {q:[자연수, 분자, 분모]} 각 자리는 고정값·"?답"(칸)·배열(분자에 ["?3","+","?2"]) | {f:"4 2/5"} 분수 입력(값 판정) | {c:[…], a}
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
        const fi = fa5In("답"); fi.target = pt.f; fi.den = pt.den || fa5Den(pt.f) || 0; ins.push(fi); line.append(fi);
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
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    let ok = true, hint = null; const given = [];
    ins.forEach(x => {
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = fa5Judge(x.get(), x.target, x.den); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "diffden" || J.code === "zero") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
    });
    chs.forEach(C => { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(C.sel === C.a ? "good" : "bad"); }); if (C.sel !== C.a) ok = false; given.push(C.sel == null ? "-" : C.el.children[C.sel].textContent); });
    if (!ok) return api.fail(opt.bad || "빨간 칸을 다시 생각해 봐요.", given.join(","));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce(); api.done(given.join(","), opt.ok || "차례대로 잘 계산했어요!");
  } }, "확인하기")));
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 */
function fa5Ask(host, api, ready, msg, opt) {
  const g = fa5Gate(api, ready, msg);
  if (opt.ask) return fa5Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad });
  if (opt.askCalc) return fa5Calc(host, g, opt.askCalc, { ok: opt.ok });
  api.provide({ words: [], answers: [] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { api.tryOnce(); ready() ? api.done("조작 완료", opt.ok) : api.fail(typeof msg === "function" ? msg() : msg, "-"); } }, "확인하기")));
}

/* ③ 막대 색칠하기: bars [{name, k, col}]  opt: d, ask(줄)·askCalc, ok */
function fa5Bars(body, api, opt) {
  fa5Style();
  const d = opt.d, bars = opt.bars, W = 900, LX = 210, BW = 660, BH = 62, GP = 42, H = bars.length * (BH + GP) + 14;
  const st = bars.map(() => Array(d).fill(false));
  const svg = makeSvg(W, H);
  const cnt = i => st[i].filter(Boolean).length;
  const draw = () => {
    svg.innerHTML = "";
    bars.forEach((b, i) => {
      const y = 22 + i * (BH + GP), col = b.col != null ? b.col : i, ok = cnt(i) === b.k;
      svg.append(fa5SvgLine(b.name, LX - 18, y + BH / 2 - 9, 25, { anchor: "end" }));
      svg.append(fa5SvgLine(`색칠 ${cnt(i)}칸`, LX - 18, y + BH / 2 + 22, 17, { anchor: "end", fill: ok ? "#2E8B57" : "#5B6B6B" }));
      for (let c = 0; c < d; c++) {
        const r = svgEl("rect", { x: LX + c * BW / d, y, width: BW / d, height: BH, fill: st[i][c] ? FA5_F[col % 4] : "#fff", stroke: INK, "stroke-width": 2, style: "cursor:pointer" });
        r.addEventListener("click", () => { st[i][c] = !st[i][c]; draw(); });
        svg.append(r);
      }
      svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
    });
  };
  draw();
  const ready = () => bars.every((b, i) => cnt(i) === b.k);
  const ask = h("div", { class: "fa5ask" });
  body.append(h("p", { class: "fa5tip" }, opt.tip || "칸을 누르면 색칠되고, 한 번 더 누르면 지워져요."), h("div", { class: "fa5stage" }, svg), ask);
  fa5Ask(ask, api, ready, () => { const i = bars.findIndex((b, k) => cnt(k) !== b.k); return `먼저 ‘${fa5Plain(bars[i].name)}’ 막대를 알맞게 색칠해요. 지금 ${cnt(i)}칸이에요.`; }, opt);
}
/* ⑦ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function fa5Sort(body, api, opt) {
  fa5Style();
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "fa5pool" }), binsEl = h("div", { class: "fa5bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "fa5binl" }); binsEl.append(h("div", { class: "fa5bin", onclick: e => { if (e.target.closest(".fa5crd")) return; put(bi); } }, h("button", { class: "fa5binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt fa5crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  function draw() { els.forEach((el, ci) => { el.classList.toggle("fa5on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => fa5Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "fa5tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (where.some(w => w < 0)) return api.fail("아직 넣지 않은 카드가 있어요.", "-");
      let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
      if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); return api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); }
      api.tryOnce(); api.done(given, opt.ok);
    } }, "확인하기")));
}

/* ⑧ 관계있는 것끼리 잇기: left [{t,k}], right [{t,k|null}] (값을 계산해 짝이 맞는지 스스로 확인) */
function fa5Match(body, api, opt) {
  fa5Style();
  const L = opt.left, R = opt.right, pair = L.map(() => -1); let sel = null;
  L.forEach(l => { const v = fa5Eval(l.t); R.forEach(r => { const w = fa5Eval(r.t); if (!v || !w || fa5Eq(v, w) !== (r.k === l.k)) throw new Error("잇기 확인 필요: " + l.t + " / " + r.t); }); });
  const COL = ["#2B7BD6", "#D9822B", "#2E8B57"];
  const lb = L.map((l, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; draw(); } }, l.t));
  const rb = R.map((r, j) => h("button", { class: "opt", onclick: () => { if (sel == null) return api.hint("먼저 왼쪽 식을 눌러요."); pair[sel] = pair[sel] === j ? -1 : j; sel = null; draw(); } }, r.t));
  const badge = (i) => h("span", { class: "fa5badge", style: `background:${COL[i % 3]}` }, String(i + 1));
  function draw() {
    lb.forEach((b, i) => { b.classList.toggle("fa5on", sel === i); b.classList.remove("good", "bad"); [...b.querySelectorAll(".fa5badge")].forEach(x => x.remove()); b.append(badge(i)); });
    rb.forEach((b, j) => { b.classList.remove("good", "bad"); [...b.querySelectorAll(".fa5badge")].forEach(x => x.remove()); pair.forEach((p, i) => { if (p === j) b.append(badge(i)); }); });
  }
  draw();
  api.provide({ words: [], answers: L.map(l => `${fa5Plain(l.t)} — ${fa5Plain(R.find(r => r.k === l.k).t)}`) });
  body.append(h("p", { class: "fa5tip" }, "왼쪽 식을 누르고, 값이 같은 오른쪽 식을 눌러 이어요. 짝이 없는 식도 있어요."),
    h("div", { class: "fa5mt" }, h("div", { class: "fa5mc" }, lb), h("div", { class: "fa5mc" }, rb)),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (pair.some(p => p < 0)) return api.fail("왼쪽 식을 모두 이어요.", "-");
      let ok = true; pair.forEach((p, i) => { const g = R[p].k === L[i].k; lb[i].classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = pair.map((p, i) => `${i + 1}-${p + 1}`).join(", ");
      if (!ok) return api.fail("값을 계산해 보고 다시 이어요. 가분수와 대분수 중 편리한 꼴로 바꾸어 비교해요.", given);
      api.tryOnce(); api.done(given, opt.ok || "값이 같은 식끼리 잘 이었어요!");
    } }, "확인하기")));
}

/* ④ 통분 막대: 두 분수 막대의 한 칸을 똑같이 더 잘게 나누어 조각의 크기를 같게 만들어요.
   opt: A, B(진분수), names, op("+"|"-"|null), d(이 크기로 맞추기, 없으면 공배수 아무것이나), ask·askCalc, ok */
function fa5Split(body, api, opt) {
  fa5Style();
  const A = fa5Str(opt.A), B = fa5Str(opt.B), V = [A, B], names = opt.names || [opt.A, opt.B];
  if (V.some(v => !v || v.err || v.num >= v.den)) throw new Error("통분 막대는 진분수만: " + opt.A + ", " + opt.B);
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
    svg.innerHTML = "";
    let y = 16;
    [0, 1].forEach(i => {
      const d = dOf(i), n = V[i].num * k[i];
      cellsRow(y, d, c => c < n ? FA5_F[i] : null, null, names[i]);
      for (let c = 1; c < V[i].den; c++) svg.append(svgEl("line", { x1: LX + c * UW / V[i].den, y1: y - 4, x2: LX + c * UW / V[i].den, y2: y + BH + 4, stroke: INK, "stroke-width": 4 }));
      svg.append(fa5SvgLine(`= [${n}/${d}]`, LX + UW + 12, y + BH / 2, 24, { anchor: "start", fill: FA5_S[i] }));
      labs[i].textContent = k[i] === 1 ? `한 칸 그대로 → [${n}/${d}]` : `한 칸을 ${k[i]}칸으로 → [${n}/${d}]`;
      y += BH + GP;
    });
    if (same() && opt.op) {
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
  fa5Ask(ask, api, ready, () => !same() ? "먼저 두 막대의 조각 크기를 같게 만들어요. 두 분모의 공배수를 생각해 봐요." : `이번에는 한 칸이 [1/${opt.d}]이 되게 나누어요.`, opt);
}

/* ⑤ 두 대분수를 색칠하고 모으기(분수 부분의 합이 1이 되면 자연수로): opt d(공통분모), A:{name,v}, B:{name,v}, est, ask */
function fa5Fill(body, api, opt) {
  fa5Style();
  const d = opt.d, A = fa5Str(opt.A.v), B = fa5Str(opt.B.v), aN = A.num * d / A.den, bN = B.num * d / B.den;
  if (!Number.isInteger(aN) || !Number.isInteger(bN)) throw new Error("공통분모 확인 필요");
  const nb = Math.ceil(aN / d) + Math.ceil(bN / d);
  let cells = Array(nb * d).fill(0), cur = 1, merged = false, estOk = !opt.est;
  const W = 900, LX = 110, BW = 600, BH = 44, GP = 14, H = 24 + nb * (BH + GP);
  const svg = makeSvg(W, H);
  const count = k => cells.filter(c => c === k).length;
  const fA = aN % d, fB = bN % d, wA = (aN - fA) / d, wB = (bN - fB) / d, fb = wA + wB, carry = fA + fB >= d;
  const draw = () => {
    svg.innerHTML = "";
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
  if (opt.est) body.append(fa5EstBox(api, opt.est, () => { estOk = true; }));
  body.append(h("div", { class: "fa5tools" }, bA, bB, mergeBtn, reset), readout, h("div", { class: "fa5stage" }, svg), ask);
  fa5Ask(ask, api, () => merged && estOk, () => !estOk ? "먼저 어림해요." : "두 수를 알맞게 색칠한 다음 ‘모으기’를 눌러요.", opt);
}

/* ⑥ 덜어 내기(×표): 공통분모 d로 나눈 막대. 자연수 1은 통째로 ×표 하거나 쪼개어 한 칸씩 ×표. opt d, m(빼어지는 수), s(빼는 수), unit, est, ask */
function fa5Take(body, api, opt) {
  fa5Style();
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
  const draw = () => {
    svg.innerHTML = "";
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
  const readout = h("p", { class: "fa5tip" });
  draw();
  const ask = h("div", { class: "fa5ask" });
  if (opt.est) body.append(fa5EstBox(api, opt.est, () => { estOk = true; }));
  body.append(h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.1em 0" }, opt.tip || `막대 하나가 1이고, 작은 칸 하나는 [1/${d}]이에요. 막대(1)를 누르면 통째로 ×표, ‘1을 쪼개기’를 누르면 1이 ${fa5J(`[${d}/${d}]`, "으로")} 나뉘어 한 칸씩 ×표 할 수 있어요.`),
    readout, h("div", { class: "fa5stage" }, svg),
    h("div", { class: "fa5tools" }, h("button", { onclick: () => { units.forEach(u => { u.whole = false; u.cells.fill(false); if (!u.rest) u.split = false; }); draw(); } }, "처음부터")), ask);
  fa5Ask(ask, api, () => crossed() === sN && estOk, () => !estOk ? "먼저 어림해요." : `${fa5Tk(opt.s)}${opt.unit ? " " + opt.unit : ""}만큼 ×표 해요. ${fa5J(fa5Tk(opt.s), "을를")} 분모가 ${d}인 분수로 바꾸어 칸 수를 세어 봐요. 지금은 [1/${d}]이 ${crossed()}개예요.`, opt);
}

/* ⑨ 수 카드로 대분수 만들기 (자연수·분자·분모 모두 카드): groups [{name, cards, kind:"max"|"min"}], op("+"|"-") — 두 대분수의 합 또는 차 */
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
  const sum = fa5In(op > 0 ? "두 수의 합" : "두 수의 차");
  G.forEach(x => {
    const used = () => ["w", "n", "d"].map(k => x.slot[k]).filter(v => v != null);
    const cBtns = x.g.cards.map((c, i) => h("button", { class: "opt", onclick: () => { x.sel = x.sel === i ? null : i; cBtns.forEach((b, k) => b.classList.toggle("fa5on", x.sel === k)); } }, String(c)));
    const sb = {};
    const slotBtn = key => { const b = h("button", { class: "fa5slot", "aria-label": { w: "자연수", n: "분자", d: "분모" }[key], onclick: () => { x.slot[key] = x.sel == null ? null : x.sel; x.sel = null; cBtns.forEach(c => c.classList.remove("fa5on")); paint(); } }, "​"); sb[key] = b; return b; };
    const paint = () => { ["w", "n", "d"].forEach(k => { sb[k].textContent = x.slot[k] == null ? "​" : String(x.g.cards[x.slot[k]]); }); cBtns.forEach((b, i) => b.style.opacity = used().includes(i) ? .45 : 1); };
    const mixed = h("span", { class: "fa5fr fa5frin" }, h("span", { class: "fa5fw" }, slotBtn("w")), h("span", { class: "fa5q" }, h("span", { class: "fa5n" }, slotBtn("n")), h("span", { class: "fa5d" }, slotBtn("d"))));
    x.box = h("div", { class: "fa5grp" }, h("div", { class: "fa5gt" }, `${x.g.name} — 수 카드 ${x.g.cards.join(", ")}`), h("div", { class: "fa5cards" }, cBtns), h("div", { class: "fa5cl" }, h("span", { class: "fa5tag" }, x.g.kind === "max" ? "가장 큰 대분수" : "가장 작은 대분수"), mixed));
  });
  api.provide({ words: ["가장 큰 대분수", "가장 작은 대분수"], answers: G.map(x => `${x.g.name}: ${fa5Plain(`[${x.best.w} ${x.best.n}/${x.best.d}]`)}`).concat([`${op > 0 ? "합" : "차"} ${fa5Plain(fa5Tk(fa5Form(total.num, total.den)))}`]) });
  body.append(h("p", { class: "fa5tip" }, "수 카드를 누른 다음 빈칸(자연수·분자·분모)을 눌러 넣어요. 빈칸을 다시 누르면 지워져요. 카드는 한 번씩만 써요."), ...G.map(x => x.box),
    h("div", { class: "fa5cl" }, h("span", {}, op > 0 ? "두 대분수의 합 =" : "두 대분수의 차 ="), sum),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      const val = x => ["w", "n", "d"].map(k => x.slot[k] == null ? null : x.g.cards[x.slot[k]]);
      const given = G.map(x => val(x).map(v => v == null ? "□" : v).join(" ")).join(", ") + ` / ${sum.text()}`;
      for (const x of G) {
        const [w, n, d] = val(x), ids = ["w", "n", "d"].map(k => x.slot[k]);
        if (ids.some(v => v == null)) return api.fail(`${x.g.name}의 빈칸에 수 카드를 모두 넣어요.`, given);
        if (new Set(ids).size < 3) return api.fail("수 카드는 한 번씩만 써요.", given);
        if (n >= d) return api.fail("대분수의 분수 부분은 진분수예요. 분자가 분모보다 작아야 해요.", given);
        if (w !== x.best.w || n !== x.best.n || d !== x.best.d) return api.fail(x.g.kind === "max" ? "가장 큰 대분수는 자연수 부분에 가장 큰 수를 놓고, 남은 두 카드로 진분수를 만들어요." : "가장 작은 대분수는 자연수 부분에 가장 작은 수를 놓고, 남은 두 카드로 진분수를 만들어요.", given);
      }
      const J = fa5Judge(sum.get(), fa5Form(total.num, total.den));
      if (J.code === "zero") { sum.paint(null); return api.hint(J.msg); }
      if (J.code !== "ok") { sum.paint(false); return api.fail(J.msg || fa5Diag(`${fa5Tk(`${G[0].best.w} ${G[0].best.n}/${G[0].best.d}`)}${op > 0 ? "+" : "-"}${fa5Tk(`${G[1].best.w} ${G[1].best.n}/${G[1].best.d}`)}`, sum.get()) || "두 대분수를 통분한 다음 자연수 부분끼리, 분수 부분끼리 계산해 봐요.", given); }
      sum.paint(true); api.tryOnce();
      api.done(given, opt.ok || `${fa5Tk(`${G[0].best.w} ${G[0].best.n}/${G[0].best.d}`)} ${op > 0 ? "+" : "−"} ${fa5Tk(`${G[1].best.w} ${G[1].best.n}/${G[1].best.d}`)} = ${fa5Book(total.num, total.den)}이에요!`);
    } }, "확인하기")));
}

/* ⑩ 수 카드로 진분수를 만들고 친구의 진분수와 더하기 (3차시 창의) */
function fa5Proper(body, api, opt) {
  fa5Style();
  const cards = opt.cards, all = [];
  cards.forEach(n => cards.forEach(d => { if (n < d) all.push({ n, d }); }));
  const slot = { n: null, d: null }; let sel = null, mine = null, friend = null;
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
    fBox.append(h("span", { class: "fa5tag" }, "친구가 만든 진분수"), h("span", { class: "jua" }, `[${friend.n}/${friend.d}]`));
    sumRow.classList.remove("hidden");
    api.hint(`내 진분수는 [${n}/${d}], 친구의 진분수는 [${friend.n}/${friend.d}]이에요. 통분하여 더해 봐요.`);
  } }, "내 진분수 정하기");
  api.provide({ words: ["통분", "분모는 그대로", "분자끼리 더하기"], answers: ["예) [7/8]+[5/6] = [21/24]+[20/24] = [41/24] = [1 17/24]"] });
  body.append(h("p", { class: "fa5tip" }, `수 카드 ${cards.join(", ")} 중에서 2장을 골라 한 번씩만 사용하여 진분수를 만들어요. 카드를 누르고 분자나 분모 칸을 눌러요.`),
    h("div", { class: "fa5cards" }, cBtns), h("div", { class: "fa5cl" }, h("span", { class: "fa5tag" }, "내가 만든 진분수"), frac, h("span", { class: "fa5tools" }, fix)), fBox, sumRow, table,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (!mine) return api.fail("먼저 수 카드로 진분수를 만들고 ‘내 진분수 정하기’를 눌러요.", "-");
      const e = `[${mine.n}/${mine.d}]+[${friend.n}/${friend.d}]`, v = fa5Eval(e), r = sum.get(), J = fa5Judge(r, fa5Form(v.num, v.den));
      if (J.code === "zero") { sum.paint(null); return api.hint(J.msg); }
      if (J.code !== "ok") { sum.paint(false); return api.fail(J.msg || fa5Diag(e, r) || "두 분모의 곱이나 최소공배수를 공통분모로 하여 통분한 다음 분자끼리 더해 봐요.", `${e} = ${sum.text()}`); }
      sum.paint(true); api.tryOnce();
      table.append(h("tr", {}, h("td", {}, `[${mine.n}/${mine.d}]`), h("td", {}, `[${friend.n}/${friend.d}]`), h("td", {}, fa5Book(v.num, v.den))));
      api.done(`${e} = ${sum.text()}`, `${e} = ${fa5Book(v.num, v.den)}. 내가 만든 진분수와 친구의 진분수를 통분하여 더했어요!`);
    } }, "확인하기")));
}

/* ⑪ 음표 (8차시) — 4분음표를 1박으로 */
const FA5_NOTE = { s: { b: "1/4", name: "16분음표" }, e: { b: "1/2", name: "8분음표" }, de: { b: "3/4", name: "점 8분음표" }, q: { b: "1", name: "4분음표" }, dq: { b: "1 1/2", name: "점 4분음표" }, hf: { b: "2", name: "2분음표" } };
function fa5DrawNote(g, t, x, y, col = INK) {
  const head = svgEl("ellipse", { cx: x, cy: y, rx: 12, ry: 8.5, transform: `rotate(-22 ${x} ${y})`, fill: t === "hf" ? "#fff" : col, stroke: col, "stroke-width": 3 });
  g.append(head, svgEl("line", { x1: x + 10.5, y1: y - 3, x2: x + 10.5, y2: y - 62, stroke: col, "stroke-width": 3 }));
  const flag = yy => svgEl("path", { d: `M${x + 10.5},${yy} C${x + 22},${yy + 10} ${x + 32},${yy + 18} ${x + 24},${yy + 36}`, fill: "none", stroke: col, "stroke-width": 4, "stroke-linecap": "round" });
  if (t === "e" || t === "de") g.append(flag(y - 62));
  if (t === "s") g.append(flag(y - 62), flag(y - 48));
  if (t === "de" || t === "dq") g.append(svgEl("circle", { cx: x + 22, cy: y + 1, r: 4, fill: col }));
}
function fa5NoteFig(types, opt = {}) {
  return () => {
    fa5Style();
    const n = types.length, W = Math.max(220, 110 + n * 90), svg = makeSvg(W, 140), g = svgEl("g");
    svg.append(svgEl("line", { x1: 10, y1: 100, x2: W - 10, y2: 100, stroke: "#9AA8A4", "stroke-width": 2 }));
    types.forEach((t, i) => { fa5DrawNote(g, t, 70 + i * 90, 100); if (opt.label) g.append(txt(70 + i * 90 + 6, 128, FA5_NOTE[t].name, 15, { fill: "#5B6B6B" })); });
    svg.append(g);
    return h("div", { class: "fa5stage", style: `max-width:${Math.min(40, 8 + n * 7)}em` }, svg);
  };
}
/* 마디 완성하기: measures [{beats, notes:[…], one?:true(음표 하나만), label}], top(박자표 위 수) */
function fa5Music(body, api, opt) {
  fa5Style();
  const ms = opt.measures.map(m => ({ m, add: [] }));
  let cur = 0;
  const beatsOf = list => list.reduce((a, t) => fa5Add(a, fa5Str(FA5_NOTE[t].b)), { num: 0, den: 1 });
  ms.forEach(M => { const g = beatsOf(M.m.notes), rest = fa5Add(fa5Q(M.m.beats, 1), g, -1); if (rest.num <= 0) throw new Error("마디 확인 필요"); M.need = rest; });
  const NW = 74, W = 900;
  const svg = makeSvg(W, 100);
  const draw = () => {
    svg.innerHTML = "";
    let y = 30;
    ms.forEach((M, i) => {
      const list = M.m.notes, slotN = Math.max(1, M.add.length), w = 120 + (list.length + slotN) * NW + 30, x0 = Math.max(10, (W - w) / 2), yl = y + 92;
      const isCur = i === cur;
      svg.append(fa5SvgLine(M.m.label || `${i + 1}번째 마디`, x0, y + 6, 20, { anchor: "start", fill: "#5B6B6B" }));
      svg.append(svgEl("line", { x1: x0, y1: yl, x2: x0 + w, y2: yl, stroke: INK, "stroke-width": 2 }));
      svg.append(svgEl("line", { x1: x0, y1: yl - 40, x2: x0, y2: yl + 40, stroke: INK, "stroke-width": 3 }), svgEl("line", { x1: x0 + w, y1: yl - 40, x2: x0 + w, y2: yl + 40, stroke: INK, "stroke-width": 3 }));
      svg.append(txt(x0 + 36, yl - 20, String(M.m.beats), 30), txt(x0 + 36, yl + 20, "4", 30));
      const g = svgEl("g", { "pointer-events": "none" });
      list.forEach((t, k) => fa5DrawNote(g, t, x0 + 100 + k * NW, yl));
      const sx = x0 + 100 + list.length * NW - 26, sw = slotN * NW + 12;
      const slot = svgEl("rect", { x: sx, y: yl - 82, width: sw, height: 112, rx: 10, fill: isCur ? "#FFF6EC" : "#fff", stroke: isCur ? TENT : "#B9C4C0", "stroke-width": 3, "stroke-dasharray": "8 6", style: "cursor:pointer" });
      slot.addEventListener("click", () => { cur = i; draw(); });
      svg.append(slot);
      M.add.forEach((t, k) => fa5DrawNote(g, t, sx + 26 + k * NW, yl, "#B85A22"));
      if (!M.add.length) svg.append(txt(sx + sw / 2, yl - 24, "?", 34, { fill: "#B85A22", "pointer-events": "none" }));
      svg.append(g);
      const now = beatsOf(list.concat(M.add));
      svg.append(fa5SvgLine(`음표의 박을 모두 더하면  ${fa5Tk(fa5Form(now.num, now.den))}박 / ${M.m.beats}박이 되어야 해요`, W / 2, yl + 62, 20, { fill: now.num === M.m.beats * now.den ? "#2E8B57" : "#5B6B6B" }));
      y += 200;
    });
    svg.setAttribute("viewBox", `0 0 ${W} ${y - 10}`);
  };
  const pal = h("div", { class: "fa5tools" });
  Object.keys(FA5_NOTE).forEach(t => {
    const ic = makeSvg(46, 80), g = svgEl("g"); fa5DrawNote(g, t, 16, 66); ic.append(g); ic.style.width = "1.6em"; ic.style.verticalAlign = "middle";
    pal.append(h("button", { onclick: () => { const M = ms[cur]; if (M.add.length >= 4) return api.hint("빈칸에는 음표를 4개까지 넣을 수 있어요."); if (M.m.one && M.add.length >= 1) return api.hint("이 빈칸에는 음표 하나만 넣어요. ‘한 개 빼기’로 바꾸어 보세요."); M.add.push(t); draw(); } }, ic, ` ${FA5_NOTE[t].name} [${FA5_NOTE[t].b}]박`.replace("[1]박", "1박").replace("[2]박", "2박")));
  });
  const tools = h("div", { class: "fa5tools" },
    h("button", { onclick: () => { ms[cur].add.pop(); draw(); } }, "한 개 빼기"),
    h("button", { onclick: () => fa5Play(ms[cur].m.notes.concat(ms[cur].add)) }, "리듬 들어 보기"));
  draw();
  api.provide({ words: ms.map(M => FA5_NOTE[M.m.ans || "q"].name), answers: ms.map((M, i) => `${M.m.label || i + 1 + "번째 마디"}: 모자란 박 ${fa5Plain(fa5Tk(fa5Form(M.need.num, M.need.den)))}박${M.m.ans ? " → " + FA5_NOTE[M.m.ans].name : ""}`) });
  body.append(h("p", { class: "fa5tip" }, opt.tip || "아래 음표 단추를 누르면 주황색 빈칸에 음표가 들어가요. 마디의 박을 모두 더해 박자표에 맞게 만들어요."), pal, tools, h("div", { class: "fa5stage" }, svg),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      const given = ms.map(M => M.add.map(t => FA5_NOTE[t].name).join("+") || "-").join(" / ");
      for (let i = 0; i < ms.length; i++) {
        const M = ms[i];
        if (!M.add.length) { cur = i; draw(); return api.fail(`${M.m.label || i + 1 + "번째 마디"}의 빈칸에 음표를 넣어요.`, given); }
        const v = beatsOf(M.add);
        if (!fa5Eq(v, M.need)) { cur = i; draw(); const now = beatsOf(M.m.notes); return api.fail(`${M.m.label || i + 1 + "번째 마디"}: 이미 있는 음표가 ${fa5Tk(fa5Form(now.num, now.den))}박이에요. ${M.m.beats}박이 되려면 몇 박이 더 필요한지 분모를 같게 하여 계산해 봐요. 지금 넣은 음표는 ${fa5Tk(fa5Form(v.num, v.den))}박이에요.`, given); }
      }
      api.tryOnce(); api.done(given, opt.ok || "모든 마디가 박자표에 맞게 완성되었어요!");
    } }, "확인하기")));
}
function fa5Play(list) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ac = fa5Play.ac || (fa5Play.ac = new AC()); let t = ac.currentTime + .05; const beat = .55;
    list.forEach(tp => { const v = fa5Str(FA5_NOTE[tp].b), dur = v.num / v.den * beat; const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 660; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.25, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + Math.max(.08, dur * .8)); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur); t += dur; });
  } catch (e) { /* 소리를 못 내도 괜찮아요 */ }
}

/* ⑫ 신나는 분수 윷놀이 (9차시) — 놀이판 칸의 분수는 지도서에 없어 새로 정했어요(분수 주사위의 분수와 같은 칸은 없음). */
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
    svg.append(svgEl("rect", { x: 20, y: 20, width: 660, height: 660, rx: 24, fill: "#F6E7CF", stroke: "#A47A45", "stroke-width": 5 }));
    const L = (a, b) => svg.append(svgEl("line", { x1: NODE[a][0], y1: NODE[a][1], x2: NODE[b][0], y2: NODE[b][1], stroke: "#B48A55", "stroke-width": 5 }));
    L("o0", "o5"); L("o5", "o10"); L("o10", "o15"); L("o15", "o0"); L("o5", "o15"); L("o10", "o0");
    Object.entries(NODE).forEach(([id, [x, y]]) => {
      const big = ["o0", "o5", "o10", "o15", "C"].includes(id);
      svg.append(svgEl("circle", { cx: x, cy: y, r: big ? 42 : 34, fill: id === "o0" ? "#DDEFE6" : "#fff", stroke: big ? TENT : "#8A6A3E", "stroke-width": big ? 5 : 3 }));
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
      info.textContent = "모둠별 말을 몇 개로 놀이할까요? (교과서 놀이는 말 2개예요)";
      [1, 2].forEach(n => ctrl.append(h("button", { class: n === 2 ? "fa5on" : "", onclick: () => newGame(n) }, `말 ${n}개로 놀이하기`)));
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
      const [n, f] = G.dice, inp = fa5In("계산 결과");
      info.textContent = f[0] === "+" ? `도착한 칸의 수와 분수 주사위의 수를 더해요.` : `도착한 칸의 수와 분수 주사위의 수의 차를 구해요. (큰 수)−(작은 수)로 식을 세워요.`;
      ctrl.append(h("span", { class: "jua" }, `${G.expr} =`), inp, h("button", { class: "fa5on", onclick: () => {
        const v = fa5Eval(G.expr), r = inp.get(), J = fa5Judge(r, fa5Form(v.num, v.den));
        if (J.code === "empty" || J.code === "half" || J.code === "bad" || J.code === "zero") return api.hint(J.msg);
        const p = G.P[0][G.prev.j];
        if (J.code !== "ok") {
          Object.keys(p).forEach(k => delete p[k]); Object.assign(p, G.prev.prev);
          G.log.push(`나: ${G.expr} = ${inp.text()} ✗ → 말을 원래 칸으로 되돌려요 (바른 답 ${fa5Book(v.num, v.den)})`);
          api.fail(J.msg || fa5Diag(G.expr, r) || `바른 답은 ${fa5Book(v.num, v.den)}이에요. 두 분수를 통분해서 다시 계산해 봐요. 말은 원래 칸으로 돌아가요.`, `${G.expr} = ${inp.text()}`);
          return endTurn(0, false);
        }
        G.ok++; const got = capture(0, node(p));
        G.log.push(`나: ${G.expr} = ${fa5Book(v.num, v.den)} ✓${got ? " · 로봇 말을 잡았어요! 한 번 더" : ""}`);
        api.hint(`맞았어요! 말은 그 칸에 그대로 있어요.${got ? " 로봇의 말을 잡았으니 한 번 더 던져요." : ""}`);
        endTurn(0, got);
      } }, "계산 확인"));
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

/* ⑬ 또 다른 놀이: 카드로 덧셈·뺄셈 (9차시) — 카드에 쓸 수는 지도서 조건(노랑 분모 2~5, 파랑 분모 6~9)에 맞춰 정했어요. */
function fa5CardGame(body, api, opt) {
  fa5Style();
  const YEL = opt.yel || ["1/2", "2/3", "3/4", "4/5", "1 2/3", "2 1/5"], BLU = opt.blu || ["5/6", "3/7", "5/8", "7/9", "1 1/6", "2 3/8"];
  YEL.forEach(y => BLU.forEach(b => { if (fa5Eq(fa5Str(y), fa5Str(b))) throw new Error("카드 값 확인 필요"); }));
  const ROUNDS = opt.rounds || 5;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const info = h("p", { class: "fa5tip" }), area = h("div"), table = h("table", { class: "fa5score" });
  let R = null, round = 0, score = [0, 0], rows = [];
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
      info.textContent = `${round + 1}번째 판: 카드를 보기 전에 ‘덧셈’ 또는 ‘뺄셈’을 먼저 말해요(골라요).`;
      area.append(h("div", { class: "fa5tools" }, h("button", { class: "fa5on", onclick: () => { R.op = "+"; render(); } }, "덧셈"), h("button", { class: "fa5on", onclick: () => { R.op = "-"; render(); } }, "뺄셈")));
      return;
    }
    const pickRow = (list, key, col, name) => h("div", { class: "fa5cl" }, h("span", { class: "fa5tag", style: `background:${col}` }, name),
      ...list.map((v, i) => h("button", { class: "opt fa5crd" + (R[key] === i ? " fa5on" : ""), style: `background:${R[key] === i ? "#fff" : col};min-width:3em`, onclick: () => { if (R[key] != null) return; R[key] = i; render(); } }, R[key] === i ? fa5Tk(v) : "?")));
    info.textContent = `${R.op === "+" ? "덧셈" : "뺄셈"}을 골랐어요. 노란 카드와 파란 카드를 한 장씩 뒤집어요.`;
    area.append(pickRow(R.ys, "y", "#FCE9A6", "노란 카드"), pickRow(R.bs, "b", "#CFE3F7", "파란 카드"));
    if (R.y != null && R.b != null) {
      const e = exprOf(R.op, R.ys[R.y], R.bs[R.b]), v = fa5Eval(e), inp = fa5In("계산 결과");
      area.append(h("div", { class: "fa5cl" }, h("span", { class: "jua" }, `${e} =`), inp, h("span", { class: "fa5tools" }, h("button", { class: "fa5on", onclick: () => {
        const r = inp.get(), J = fa5Judge(r, fa5Form(v.num, v.den));
        if (J.code === "empty" || J.code === "half" || J.code === "bad" || J.code === "zero") return api.hint(J.msg);
        const ok = J.code === "ok";
        if (!ok) api.fail(J.msg || fa5Diag(e, r) || `바른 답은 ${fa5Book(v.num, v.den)}이에요. 통분하여 다시 계산해 봐요.`, `${e} = ${inp.text()}`);
        const rop = Math.random() < .5 ? "+" : "-", ry = YEL[Math.floor(Math.random() * 6)], rb = BLU[Math.floor(Math.random() * 6)], re = exprOf(rop, ry, rb), rv = fa5Eval(re);
        if (ok) score[0]++; score[1]++;
        const cmp = ok ? v.num * rv.den - rv.num * v.den : -1;
        if (cmp > 0) score[0]++; else if (cmp < 0) score[1]++;
        rows.push([`${e} = ${ok ? fa5Book(v.num, v.den) + " ✓" : inp.text() + " ✗"}${cmp > 0 ? " (+1 큼)" : ""}`, `${re} = ${fa5Book(rv.num, rv.den)} ✓${cmp < 0 ? " (+1 큼)" : ""}`]);
        round++;
        if (round >= ROUNDS && !R.reported) { R.reported = true; drawTable(); api.done(rows.map(r => r[0]).join(" / "), `${ROUNDS}판을 모두 했어요! 나 ${score[0]}점, 로봇 ${score[1]}점이에요.`); }
        else if (ok) api.hint(`맞았어요! 로봇은 ${re} = ${fa5Book(rv.num, rv.den)}이에요.`);
        start();
      } }, "계산 확인"))));
    }
  };
  start();
  api.provide({ words: ["덧셈", "뺄셈", "(큰 수)−(작은 수)"], answers: [] });
  body.append(h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.1em 0" }, "규칙: 계산이 맞으면 1점, 두 사람 중 계산 결과가 더 큰 사람은 1점을 더 얻어요. 뺄셈은 (큰 수)−(작은 수)로 해요."), info, area, table);
}
/* 1차시 도입 그림: 하루 24시간 중 잠자는 시간 (수치는 이 앱의 예시) */
function fa5Sleep() {
  fa5Style();
  const svg = makeSvg(900, 230), LX = 170, UW = 680, Y = [40, 130];
  [["세 발가락 나무늘보", "14 4/5", FA5_F[2]], ["말", "2 9/10", FA5_F[0]]].forEach(([n, v, c], i) => {
    const t = fa5Str(v), w = UW * t.num / t.den / 24;
    svg.append(svgEl("rect", { x: LX, y: Y[i], width: UW, height: 50, fill: "#fff", stroke: INK, "stroke-width": 2 }), svgEl("rect", { x: LX, y: Y[i], width: w, height: 50, fill: c, stroke: INK, "stroke-width": 2 }));
    for (let k = 0; k <= 24; k += 6) svg.append(svgEl("line", { x1: LX + UW * k / 24, y1: Y[i] + 50, x2: LX + UW * k / 24, y2: Y[i] + 58, stroke: INK, "stroke-width": 2 }));
    svg.append(fa5SvgLine(n, LX - 12, Y[i] + 25, 21, { anchor: "end" }), fa5SvgLine(`[${v}]시간`, LX + w + 12, Y[i] + 25, 22, { anchor: "start", fill: "#1F2F4A" }));
  });
  [0, 6, 12, 18, 24].forEach(k => svg.append(txt(LX + UW * k / 24, 218, `${k}시간`, 17, { fill: "#5B6B6B" })));
  return h("div", { class: "fa5stage" }, svg);
}
//@@LESSONS
const UNIT_STORY = { title: "유기견 보호 센터의 소윤이와 지후", lines: [
  "유기견과 관련된 책을 읽고 관심이 많아진 소윤이와 지후는 유기견 보호 센터에 봉사 활동을 하러 가요. 센터에서는 사료 주기, 함께 산책하기, 간식 만들기 같은 봉사를 해요.",
  "입구에서 상담소까지의 거리, 나누어 준 사료, 청소에 쓴 물, 덜어 낸 영양제, 산책한 거리, 고구마 간식에서 분모가 다른 분수를 통분하여 더하고 빼요.",
  "교과서 「수학 5-1」 5. 분수의 덧셈과 뺄셈의 차시 순서 그대로 만들었어요."],
  one: "분수의 덧셈과 뺄셈 · 분모가 다른 분수는 통분한 후 분모는 그대로 쓰고 분자끼리 더하거나 빼요." };
const UNIT_KEYWORDS = ["통분", "공통분모", "두 분모의 곱", "최소공배수", "분모는 그대로", "분자끼리 더하기", "분자끼리 빼기", "진분수", "가분수", "대분수", "자연수는 자연수끼리, 분수는 분수끼리", "가분수로 나타내어 계산", "1만큼을 분수로 나타내기", "어림셈", "기약분수"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 유기견 보호 센터에 가요", soop: "개념 찾기(S)",
  question: "분수의 덧셈과 뺄셈, 자연수의 덧셈과 뺄셈은 어떤 공통점과 차이점이 있을까요?",
  summary: "우리 주변에는 분모가 다른 분수를 더하거나 빼야 하는 상황이 많아요. 미술 시간에 짝과 함께 사용한 철사의 길이는 덧셈으로, 요리에 사용하고 남은 재료의 양은 뺄셈으로 구해요. 4학년 때 배운 분모가 같은 분수의 덧셈과 뺄셈, 5학년 4단원에서 배운 통분을 떠올려 두면 이 단원을 잘 배울 수 있어요.",
  steps: [
    { name: "살펴보기", inst: "잠자는 세 발가락 나무늘보와 말의 그림이에요. 나무늘보는 하루에 [14 4/5]시간 정도, 말은 하루에 [2 9/10]시간 정도 잔대요. (이 앱에서 정한 예시 값이에요.)", hints: ["‘얼마나 더’ 자는지는 두 시간의 차예요.", "두 분수의 분모 5와 10을 비교해 보세요."],
      render: (b, a) => quiz(b, a, [
        { q: "나무늘보는 말보다 하루에 몇 시간 더 자는지 구하는 식은?", fig: fa5Sleep, o: ["[14 4/5]+[2 9/10]", "[14 4/5]−[2 9/10]"], a: 1, why: { "0": "‘더 자는 시간’은 두 시간의 차예요. 빼서 구해요." } },
        { q: "두 분수 [14 4/5]와 [2 9/10]의 분모는 어떤가요?", o: ["분모가 5와 10으로 서로 달라요", "분모가 같아요"], a: 0, why: { "1": "[4/5]의 분모는 5, [9/10]의 분모는 10이에요." } }],
        { ok: "분모가 다른 분수의 뺄셈이에요. 이 단원에서 분모가 다른 분수를 더하고 빼는 방법을 배워요." }) },
    { name: "이야기하기", inst: "소윤이와 지후는 유기견 보호 센터에서 봉사 활동을 해요. 우리 주변의 상황을 덧셈으로 구하는 것과 뺄셈으로 구하는 것으로 나누어 보세요.", hints: ["‘모두’ 얼마인지 구할 때는 더해요.", "‘남은’ 양이나 ‘얼마나 더’ 많은지 구할 때는 빼요."],
      render: (b, a) => fa5Sort(b, a, { bins: ["덧셈으로 구해요", "뺄셈으로 구해요"], cards: [
        { t: "미술 시간에 짝과 함께 사용한 철사의 길이는 모두 몇 m일까?", k: 0 },
        { t: "입구에서 운동장을 지나 상담소까지의 거리는 몇 km일까?", k: 0 },
        { t: "소윤이와 지후가 나누어 준 사료는 모두 몇 kg일까?", k: 0 },
        { t: "요리에 사용하고 남은 재료의 양은 얼마일까?", k: 1, why: "사용하고 ‘남은’ 양은 처음 양에서 사용한 양을 빼서 구해요." },
        { t: "나무늘보는 말보다 하루에 몇 시간 더 잘까?", k: 1, why: "몇 시간 ‘더’ 자는지는 두 시간의 차예요. 빼서 구해요." },
        { t: "지후는 소윤이보다 몇 km 더 많이 걸었을까?", k: 1, why: "‘더 많이’ 걸은 거리는 두 거리의 차예요." }],
        ok: "모두 얼마인지는 덧셈으로, 남은 양이나 차는 뺄셈으로 구해요. 자연수의 덧셈·뺄셈과 같아요." }) },
    { name: "떠올리기 ① 분모가 같은 분수", inst: "4학년 때 배운 분모가 같은 분수의 덧셈과 뺄셈을 떠올려 계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["분모가 같으면 분모는 그대로 쓰고 분자끼리 더하거나 빼요.", "[3 1/4]−[1 3/4]은 분수 부분끼리 뺄 수 없어요. 자연수 1만큼을 [4/4]로 바꾸어요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[3/7]+[5/7]", a: "1 1/7" }, { e: "[1 3/5]+[2 4/5]", a: "4 2/5" }, { e: "[5/6]−[2/6]", a: "3/6" }, { e: "[3 1/4]−[1 3/4]", a: "1 2/4" }], { ok: "분모가 같으면 분모는 그대로 두고 분자끼리 계산했어요. 분모가 다르면 어떻게 할까요?" }) },
    { name: "떠올리기 ② 통분", inst: "4단원에서 배운 통분을 떠올려요. [3/4]와 [1/6]의 막대를 더 잘게 나누어 한 칸의 크기를 같게 만들어 보세요. 이번에는 두 분모의 최소공배수로 맞춰 봐요.", hints: ["4와 6의 최소공배수는 12예요.", "[3/4]의 한 칸을 3칸으로, [1/6]의 한 칸을 2칸으로 나누면 한 칸이 [1/12]이 돼요."],
      render: (b, a) => fa5Split(b, a, { A: "3/4", B: "1/6", op: null, d: 12, ask: [
        ["([3/4], [1/6]) → (", { q: [null, "?9", "12"] }, ", ", { q: [null, "?2", "12"] }, ")"]], ok: "분모가 다른 분수를 분모가 같은 분수로 나타내는 것을 통분이라고 해요. [3/4] = [9/12], [1/6] = [2/12]이에요." }) },
    { name: "확인하기", inst: "대분수와 가분수를 바꾸고, 분모가 다른 분수의 크기를 비교해 보세요.", hints: ["[2 1/4]에서 2는 [8/4]이에요.", "크기를 비교할 때는 통분해서 분자를 비교해요. [3/4] = [9/12], [5/6] = [10/12]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        ["[2 1/4] = ", { q: [null, "?9", "4"] }],
        ["[13/5] = ", { q: ["?2", "?3", "5"] }],
        ["[3/4] ", { c: [">", "=", "<"], a: 2 }, " [5/6]"],
        ["[2/3] ", { c: [">", "=", "<"], a: 0 }, " [3/5]"]], { ok: "대분수와 가분수를 바꾸고, 통분하여 크기를 비교할 수 있어요. 분모가 다른 분수의 덧셈과 뺄셈을 배울 준비가 됐어요!", bad: "가분수와 대분수는 1 = [4/4] = [5/5]을 떠올려 바꾸고, 크기 비교는 통분하여 분자를 비교해요." }) }
  ],
  challenge: { inst: "곰곰! 계산하기 전에 어림해 보세요. 나무늘보는 하루에 [14 4/5]시간, 말은 [2 9/10]시간 정도 자요(이 앱의 예시 값).", hints: ["[14 4/5]는 15에 가깝고, [2 9/10]는 3에 가까워요.", "15−3은 얼마일까요?"],
    render: (b, a) => quiz(b, a, [
      { q: "나무늘보는 말보다 하루에 약 몇 시간 더 잘까요?", fig: fa5Sleep, o: ["약 8시간", "약 12시간", "약 17시간"], a: 1, why: { "0": "15시간쯤에서 3시간쯤을 빼 봐요.", "2": "더하면 안 돼요. 차를 어림해요." } },
      { q: "정확한 값은 약 12시간보다 조금 클까요, 조금 작을까요?", o: ["조금 작아요", "조금 커요"], a: 0, why: { "1": "[14 4/5]는 15보다 [1/5]만큼 작고, [2 9/10]는 3보다 [1/10]만큼 작아요. 빼어지는 수가 더 많이 작아요." } }],
      { ok: "어림하면 약 12시간이에요. 정확한 값은 7차시에서 배운 방법으로 구할 수 있어요." }) }
},
{
  id: "t2", no: 2, title: "진분수의 덧셈을 해 볼까요(1)", soop: "개념 구축하기(O)",
  question: "합이 1보다 작은 분모가 다른 진분수의 덧셈은 어떻게 할까요?",
  summary: "분모가 다른 분수의 덧셈은 분수를 통분한 후 분모는 그대로 쓰고 분자끼리 더합니다. [1/2]+[1/3] = [3/6]+[2/6] = [5/6]. 두 분모의 곱을 공통분모로 하면 공통분모를 구하기 쉽고, 두 분모의 최소공배수를 공통분모로 하면 계산한 결과를 약분할 필요가 없거나 간단해요.",
  steps: [
    { name: "만져 보기", inst: "유기견 보호 센터 입구에서 운동장까지의 거리는 [1/2] km, 운동장에서 상담소까지의 거리는 [1/3] km예요. 입구에서 운동장을 지나 상담소까지의 거리를 알아보려고 해요. 두 막대의 한 칸을 더 잘게 나누어 조각의 크기를 같게 만들어 보세요.", hints: ["조각의 크기가 다르면 바로 더할 수 없어요.", "[1/2]의 한 칸을 3칸으로, [1/3]의 한 칸을 2칸으로 나누면 한 칸이 [1/6]이 돼요."],
      render: (b, a) => fa5Split(b, a, { A: "1/2", B: "1/3", names: ["[1/2] km", "[1/3] km"], op: "+", d: 6, ask: [
        ["[1/2] = ", { q: [null, "?3", "6"] }],
        ["[1/3] = ", { q: [null, "?2", "6"] }],
        ["[1/2]+[1/3] = ", { q: [null, "?3", "6"] }, "+", { q: [null, "?2", "6"] }, " = ", { q: [null, "?5", "6"] }]], ok: "입구에서 운동장을 지나 상담소까지의 거리는 [5/6] km예요. 통분하여 분모를 같게 한 다음 분자끼리 더했어요." }) },
    { name: "그려 보기", inst: "[1/4]+[3/10]을 두 가지 방법으로 계산해 보세요. 방법 1은 두 분모의 곱을, 방법 2는 두 분모의 최소공배수를 공통분모로 해요.", hints: ["4×10 = 40, 4와 10의 최소공배수는 20이에요.", "분모에 곱한 수를 분자에도 똑같이 곱해야 해요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 두 분모의 곱", p: ["[1/4]+[3/10] = ", { q: [null, ["1", "×", "?10"], ["4", "×", "?10"]] }, "+", { q: [null, ["3", "×", "?4"], ["10", "×", "?4"]] }, " = ", { q: [null, "?10", "?40"] }, "+", { q: [null, "?12", "?40"] }, " = ", { q: [null, "?22", "40"] }] },
        { t: "방법 2 · 최소공배수", p: ["[1/4]+[3/10] = ", { q: [null, ["1", "×", "?5"], ["4", "×", "?5"]] }, "+", { q: [null, ["3", "×", "?2"], ["10", "×", "?2"]] }, " = ", { q: [null, "?5", "?20"] }, "+", { q: [null, "?6", "?20"] }, " = ", { q: [null, "?11", "20"] }] }],
        { ok: "방법 1은 [22/40], 방법 2는 [11/20]이에요. [22/40]을 약분하면 [11/20]이므로 두 답은 크기가 같아요." }) },
    { name: "말해 보기", inst: "두 방법을 비교해 보세요. 알맞은 말을 골라요.", hints: ["40은 4×10으로 바로 구할 수 있어요.", "[22/40]은 약분해야 [11/20]이 돼요."],
      render: (b, a) => blanks(b, a, ["두 분모의 곱을 공통분모로 하여 통분하면 ", { o: ["공통분모를 구하기 쉽고", "약분할 필요가 없고"], a: 0 }, ", 두 분모의 최소공배수를 공통분모로 하여 통분하면 계산한 결과를 ", { o: ["약분할 필요가 없거나 간단해요", "반드시 약분해야 해요"], a: 0 }, ". [22/40]을 약분하면 ", { o: ["[11/20]", "[11/40]", "[22/20]"], a: 0 }, "이에요."], { ok: "두 방법 모두 맞아요. 자신에게 편리한 방법을 골라 계산해요." }) },
    { name: "약속하기", inst: "분모가 다른 분수의 덧셈 방법을 약속해요.", hints: ["분모가 다르면 먼저 분모를 같게 만들어요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 분수의 덧셈은 분수를 ", { o: ["통분한 후", "약분한 후"], a: 0 }, " 분모는 ", { o: ["그대로 쓰고", "분모끼리 더하고"], a: 0 }, " 분자끼리 ", { o: ["더합니다", "곱합니다"], a: 0 }, "."], { ok: "분모가 다른 분수의 덧셈은 분수를 통분한 후 분모는 그대로 쓰고 분자끼리 더합니다." }) },
    { name: "확인하기", inst: "계산해 보세요. 약분하지 않은 분수로 써도 맞아요.", hints: ["9와 15의 최소공배수는 45예요.", "[2/5]를 분모가 20인 분수로 나타내면 [8/20]이에요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[4/9]+[7/15]", a: "41/45", den: 45 }, { e: "[3/8]+[1/6]", a: "13/24", den: 24 },
        { q: "물 로켓을 꾸미는 데 색 테이프를 지훈이는 [3/20] m, 다연이는 [2/5] m 사용했어요. 두 사람이 사용한 색 테이프는 모두 몇 m일까요?", x: "[3/20]+[2/5]", a: "11/20", unit: "m", lab: "[3/20]+[2/5] =", why: { "5/25": "분모는 분모끼리, 분자는 분자끼리 더하면 안 돼요. [2/5]를 분모가 20인 분수로 바꾸어요.", "5/20": "분모만 20으로 바꾸고 분자는 그대로 두었어요. [2/5] = [8/20]이에요." } }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["[1/9]이 2개인 수는 [2/9], [1/27]이 11개인 수는 [11/27]이에요.", "[3/8]을 분모가 32인 분수로 나타내면 [12/32]예요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "재범: “[1/9]이 2개인 수야.” 은지: “[1/27]이 11개인 수야.” 두 사람이 설명하는 분수의 합은?", x: "[2/9]+[11/27]", a: "17/27", lab: "합" },
      { q: "[5/32], [3/8], [5/16] 중에서 가장 큰 분수와 가장 작은 분수의 합은?", x: "[3/8]+[5/32]", a: "17/32", lab: "합", why: { "15/32": "[5/16]이 가장 큰 분수가 아니에요. 통분하면 [3/8] = [12/32], [5/16] = [10/32]예요." } },
      { q: "이서는 파란색 리본 [7/10] m와 분홍색 리본 [1/4] m를 가지고 있어요. 리본은 모두 몇 m일까요?", x: "[7/10]+[1/4]", a: "19/20", unit: "m", lab: "[7/10]+[1/4] =" }]) }
},
{
  id: "t3", no: 3, title: "진분수의 덧셈을 해 볼까요(2)", soop: "개념 구축하기(O)",
  question: "합이 1보다 큰 분모가 다른 진분수의 덧셈은 어떻게 할까요?",
  summary: "합이 1보다 큰 진분수의 덧셈도 두 분모의 곱이나 최소공배수를 공통분모로 하여 통분한 후 분모는 그대로 쓰고 분자끼리 더해요. 합이 가분수이면 대분수로 나타낼 수 있어요. [3/4]+[5/8] = [6/8]+[5/8] = [11/8] = [1 3/8]",
  steps: [
    { name: "만져 보기", inst: "유기견들에게 사료를 소윤이는 [3/4] kg, 지후는 [5/8] kg 나누어 주었어요. 두 막대의 조각 크기를 같게 만들고, 나누어 준 사료가 모두 몇 kg인지 알아보세요.", hints: ["[5/8]의 한 칸은 [1/8]이에요. [3/4]의 한 칸을 2칸으로 나누어 봐요.", "[3/4] = [6/8]이에요. [1/8]이 6개와 5개를 더해요."],
      render: (b, a) => fa5Split(b, a, { A: "3/4", B: "5/8", names: ["소윤 [3/4] kg", "지후 [5/8] kg"], op: "+", d: 8, ask: [
        ["[3/4] = ", { q: [null, "?6", "8"] }],
        ["[3/4]+[5/8] = ", { q: [null, "?6", "8"] }, "+[5/8] = ", { q: [null, "?11", "8"] }, " = ", { q: ["?1", "?3", "8"] }]], ok: "소윤이와 지후가 나누어 준 사료는 모두 [1 3/8] kg이에요. 합이 1보다 커서 대분수로 나타냈어요." }) },
    { name: "그려 보기", inst: "[7/10]+[5/12]를 두 가지 방법으로 계산해 보세요.", hints: ["10×12 = 120, 10과 12의 최소공배수는 60이에요.", "[134/120] = [1 14/120]이에요. 약분하면 [1 7/60]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 두 분모의 곱", p: ["[7/10]+[5/12] = ", { q: [null, ["7", "×", "?12"], ["10", "×", "?12"]] }, "+", { q: [null, ["5", "×", "?10"], ["12", "×", "?10"]] }, " = ", { q: [null, "?84", "120"] }, "+", { q: [null, "?50", "120"] }, " = ", { q: [null, "?134", "120"] }, " = ", { q: ["?1", "?14", "120"] }] },
        { t: "방법 2 · 최소공배수", p: ["[7/10]+[5/12] = ", { q: [null, ["7", "×", "?6"], ["10", "×", "?6"]] }, "+", { q: [null, ["5", "×", "?5"], ["12", "×", "?5"]] }, " = ", { q: [null, "?42", "60"] }, "+", { q: [null, "?25", "60"] }, " = ", { q: [null, "?67", "60"] }, " = ", { q: ["?1", "?7", "60"] }] }],
        { ok: "[1 14/120]을 약분하면 [1 7/60]이에요. 두 방법의 답은 크기가 같아요." }) },
    { name: "말해 보기", inst: "친구가 [9/14]+[6/7]을 잘못 계산했어요. 잘못된 까닭을 고르고 옳게 계산해 보세요.", hints: ["[6/7]의 분모 7에 2를 곱했으면 분자 6에도 2를 곱해야 해요.", "[6/7] = [12/14]예요."],
      render: (b, a) => fa5Chain(b, a, [
        ["잘못된 계산: [9/14]+[6/7] = [9/14]+[6/14] = [15/14]"],
        ["까닭: ", { c: ["분모에만 2를 곱하고 분자에는 곱하지 않았어요", "분모끼리 더했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[9/14]+[6/7] = [9/14]+", { q: [null, ["6", "×", "?2"], ["7", "×", "?2"]] }, " = [9/14]+", { q: [null, "?12", "14"] }, " = ", { q: [null, "?21", "14"] }, " = ", { q: ["?1", "?7", "14"] }] }],
        { ok: "분모에 곱한 수를 분자에도 곱해야 크기가 같은 분수가 돼요. [9/14]+[6/7] = [21/14] = [1 7/14]이고, 약분하면 [1 1/2]이에요." }) },
    { name: "약속하기", inst: "합이 1보다 큰 진분수의 덧셈 방법을 정리해요.", hints: ["공통분모로는 두 분모의 곱도, 최소공배수도 쓸 수 있어요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 진분수의 덧셈은 두 분모의 ", { o: ["곱이나 최소공배수", "합이나 차"], a: 0 }, "를 공통분모로 하여 통분한 후 분모는 그대로 쓰고 분자끼리 더합니다. 합이 가분수이면 ", { o: ["대분수", "진분수"], a: 0 }, "로 나타낼 수 있어요."], { ok: "가분수로 답해도, 약분하지 않아도 맞아요. 대분수로 나타내면 크기를 알기 쉬워요." }) },
    { name: "확인하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["7과 9의 최소공배수는 63, 15와 20의 최소공배수는 60이에요.", "크기를 비교할 때는 두 식을 각각 계산한 다음 통분하여 비교해요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[6/7]+[8/9]", a: "1 47/63", den: 63 }, { e: "[13/15]+[11/20]", a: "1 5/12", den: 60 }, { e: "[4/5]+[2/3]", a: "1 7/15", den: 15 }, { e: "[7/12]+[5/8]", a: "1 5/24", den: 24 },
        { q: "계산 결과의 크기를 비교해요.", e: "[41/45]+[7/15] ○ [4/9]+[17/30]", pick: [">", "=", "<"], a: 0, why: { "2": "[41/45]+[7/15] = [62/45] = [1 17/45], [4/9]+[17/30] = [91/90] = [1 1/90]이에요. 분수 부분을 통분하여 비교해요.", "1": "두 식을 계산해 보면 값이 달라요." } }]) }
  ],
  challenge: { inst: "수 카드 4, 5, 6, 7, 8 중에서 2장을 골라 한 번씩만 사용하여 진분수를 만들고, 내가 만든 진분수와 친구가 만든 진분수의 합을 구해 보세요.", hints: ["진분수는 분자가 분모보다 작아요.", "두 분모의 곱이나 최소공배수로 통분하여 더해요."],
    render: (b, a) => fa5Proper(b, a, { cards: [4, 5, 6, 7, 8] }) }
},
{
  id: "t4", no: 4, title: "대분수의 덧셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "분모가 다른 대분수의 덧셈은 어떻게 할까요?",
  summary: "대분수의 덧셈은 두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 더하거나, 대분수를 가분수로 나타내고 두 가분수를 통분하여 더해요. [1 3/4]+[2 1/8] = [1 6/8]+[2 1/8] = 3+[7/8] = [3 7/8], [1 3/4]+[2 1/8] = [14/8]+[17/8] = [31/8] = [3 7/8]",
  steps: [
    { name: "만져 보기", inst: "소윤이는 청소하는 데 같은 크기의 통으로 물을 [2 2/3]통 사용한 후 부족하여 [1 1/2]통 더 사용했어요. 먼저 어림한 다음, 한 통을 6칸으로 나눈 막대에 두 양을 색칠하고 모아 보세요.", hints: ["[2 2/3] = [2 4/6], [1 1/2] = [1 3/6]이에요.", "‘모으기’를 누르면 자연수 부분끼리, 분수 부분끼리 모여요."],
      render: (b, a) => fa5Fill(b, a, { d: 6, A: { name: "처음", v: "2 2/3" }, B: { name: "더", v: "1 1/2" },
        est: { q: "청소하는 데 물을 4통보다 많이 사용했을까요, 적게 사용했을까요?", o: ["4통보다 많아요", "4통보다 적어요"], a: 0, why: { "1": "[2 2/3]는 [2 1/2]보다 커요. 여기에 [1 1/2]을 더하면 얼마보다 클까요?" }, ok: "[2 2/3]는 [2 1/2]보다 크고 여기에 [1 1/2]을 더하므로 4통은 넘을 것 같아요." },
        askCalc: [{ e: "[2 2/3]+[1 1/2]", a: "4 1/6", unit: "통" }], ok: "청소하는 데 사용한 물은 모두 [4 1/6]통이에요. 어림한 결과와 비슷해요." }) },
    { name: "그려 보기", inst: "[1 3/4]+[2 1/8]을 두 가지 방법으로 계산해 보세요.", hints: ["방법 1: [1 3/4] = [1 6/8]로 통분한 다음 자연수끼리, 분수끼리 더해요.", "방법 2: [1 3/4] = [7/4] = [14/8], [2 1/8] = [17/8]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 자연수끼리, 분수끼리", p: ["[1 3/4]+[2 1/8] = ", { q: ["?1", "?6", "8"] }, "+[2 1/8] = (", { i: "1" }, "+", { i: "2" }, ")+(", { q: [null, "?6", "8"] }, "+[1/8]) = ", { q: ["?3", "?7", "8"] }] },
        { t: "방법 2 · 가분수로", p: ["[1 3/4]+[2 1/8] = ", { q: [null, "?7", "4"] }, "+", { q: [null, "?17", "8"] }, " = ", { q: [null, "?14", "8"] }, "+[17/8] = ", { q: [null, "?31", "8"] }, " = ", { q: ["?3", "?7", "8"] }] }],
        { ok: "두 방법 모두 [3 7/8]이에요." }) },
    { name: "말해 보기", inst: "[2 3/5]+[3 5/6]을 두 가지 방법으로 계산하고, 두 방법을 설명해 보세요.", hints: ["5와 6의 최소공배수는 30이에요.", "분수 부분의 합 [43/30]은 [1 13/30]이에요. 1을 자연수 부분에 더해요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1", p: ["[2 3/5]+[3 5/6] = ", { q: ["2", "?18", "30"] }, "+", { q: ["3", "?25", "30"] }, " = ", { i: "5" }, "+", { q: [null, "?43", "30"] }, " = ", { q: ["?6", "?13", "30"] }] },
        { t: "방법 2", p: ["[2 3/5]+[3 5/6] = ", { q: [null, "?13", "5"] }, "+", { q: [null, "?23", "6"] }, " = ", { q: [null, "?78", "30"] }, "+", { q: [null, "?115", "30"] }, " = ", { q: [null, "?193", "30"] }, " = ", { q: ["?6", "?13", "30"] }] },
        ["방법 1은 ", { c: ["자연수는 자연수끼리, 분수는 분수끼리 더했어요", "대분수를 가분수로 나타내어 더했어요"], a: 0 }],
        ["방법 2는 ", { c: ["자연수는 자연수끼리, 분수는 분수끼리 더했어요", "대분수를 가분수로 나타내어 더했어요"], a: 1 }]],
        { ok: "두 방법 모두 [6 13/30]이에요. 방법 1에서는 분수 부분의 합 [43/30]에서 생긴 1을 자연수 부분에 더했어요." }) },
    { name: "약속하기", inst: "분모가 다른 대분수의 덧셈 방법을 정리해요.", hints: ["두 가지 방법 모두 먼저 통분해요."],
      render: (b, a) => blanks(b, a, ["두 대분수를 통분하여 ", { o: ["자연수는 자연수끼리, 분수는 분수끼리", "분모는 분모끼리, 분자는 분자끼리"], a: 0 }, " 더하거나, 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내고 두 가분수를 통분하여 더합니다. 분수 부분의 합이 1이거나 1보다 크면 ", { o: ["1을 자연수 부분에 더해요", "그대로 두어요"], a: 0 }, "."], { ok: "상황에 따라 편리한 방법을 골라 계산해요." }) },
    { name: "확인하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["15와 12의 최소공배수는 60, 15와 10의 최소공배수는 30이에요.", "분수 부분의 합이 1보다 크면 1을 자연수 부분에 더해요."],
      render: (b, a) => fa5Calc(b, a, [
        { q: "예준이는 자전거를 어제는 [1 2/15]시간, 오늘은 [1 7/12]시간 탔어요. 모두 몇 시간 탔을까요?", x: "[1 2/15]+[1 7/12]", a: "2 43/60", unit: "시간", lab: "[1 2/15]+[1 7/12] =", den: 60 },
        { e: "[1 2/15]+[2 9/10]", a: "4 1/30", den: 30 }, { e: "[4 5/9]+[2 7/27]", a: "6 22/27", den: 27 },
        { q: "혜리는 고구마를 [1 3/5] kg 캤고, 윤호는 혜리보다 [2 1/7] kg 더 캤어요. 윤호가 캔 고구마는 몇 kg일까요?", x: "[1 3/5]+[2 1/7]", a: "3 26/35", unit: "kg", lab: "[1 3/5]+[2 1/7] =", den: 35 }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["[1 7/8]+[4 5/12]를 먼저 계산해요.", "합보다 작은 자연수를 모두 세어요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "합이 다른 하나를 골라요.", pick: ["㉠ [2 1/4]+[3 1/6]", "㉡ [3 1/2]+[2 1/6]", "㉢ [3 1/3]+[2 1/12]"], a: 1, why: { "0": "㉠ = [5 5/12], ㉢ = [5 5/12]로 합이 같아요.", "2": "㉠ = [5 5/12], ㉢ = [5 5/12]로 합이 같아요." } },
      { q: "[1 7/8]+[4 5/12]를 계산해요.", x: "[1 7/8]+[4 5/12]", a: "6 7/24", lab: "[1 7/8]+[4 5/12] =", den: 24 },
      { q: "[1 7/8]+[4 5/12] > □에서 □ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?", n: 6, unit: "개", lab: "개수", why: { "5": "합은 [6 7/24]이에요. 6도 [6 7/24]보다 작으니 들어갈 수 있어요.", "7": "7은 [6 7/24]보다 커서 들어갈 수 없어요." } }]) }
},
{
  id: "t5", no: 5, title: "진분수의 뺄셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "분모가 다른 진분수의 뺄셈은 어떻게 할까요?",
  summary: "분모가 다른 분수의 뺄셈은 분수를 통분한 후 분모는 그대로 쓰고 분자끼리 뺍니다. [5/6]−[1/2] = [5/6]−[3/6] = [2/6]. 두 분모의 곱이나 최소공배수를 공통분모로 쓸 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "소윤이는 유기견들에게 영양제를 주기 위해 영양제 [5/6] g 중에서 [1/2] g을 덜어 냈어요. 막대에 [5/6]만큼 색칠되어 있어요. [1/2]만큼 ×표 해 보세요.", hints: ["한 칸은 [1/6]이에요. [1/2]은 [1/6]이 몇 개일까요?", "[1/2] = [3/6]이에요. 3칸에 ×표 해요."],
      render: (b, a) => fa5Take(b, a, { d: 6, m: "5/6", s: "1/2", unit: "g", ask: [
        ["[1/2] = ", { q: [null, "?3", "6"] }],
        ["[5/6]−[1/2] = [5/6]−", { q: [null, "?3", "6"] }, " = ", { q: [null, "?2", "6"] }]], ok: "남은 영양제는 [2/6] g이에요. 약분하면 [1/3] g이에요." }) },
    { name: "그려 보기", inst: "[2/9]−[1/6]을 두 가지 방법으로 계산해 보세요.", hints: ["9×6 = 54, 9와 6의 최소공배수는 18이에요.", "[3/54]를 약분하면 [1/18]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 두 분모의 곱", p: ["[2/9]−[1/6] = ", { q: [null, ["2", "×", "?6"], ["9", "×", "?6"]] }, "−", { q: [null, ["1", "×", "?9"], ["6", "×", "?9"]] }, " = ", { q: [null, "?12", "54"] }, "−", { q: [null, "?9", "54"] }, " = ", { q: [null, "?3", "54"] }] },
        { t: "방법 2 · 최소공배수", p: ["[2/9]−[1/6] = ", { q: [null, ["2", "×", "?2"], ["9", "×", "?2"]] }, "−", { q: [null, ["1", "×", "?3"], ["6", "×", "?3"]] }, " = ", { q: [null, "?4", "18"] }, "−", { q: [null, "?3", "18"] }, " = ", { q: [null, "?1", "18"] }] }],
        { ok: "[3/54]을 약분하면 [1/18]이에요. 최소공배수로 통분하면 약분할 필요가 없어요." }) },
    { name: "말해 보기", inst: "유나는 [5/8]−[3/10]을 다음과 같이 계산했어요. 유나와 다른 방법으로 계산하고, 두 방법을 비교해 보세요.", hints: ["8과 10의 최소공배수는 40이에요.", "유나의 공통분모 80은 8×10이에요."],
      render: (b, a) => fa5Chain(b, a, [
        ["유나의 방법: [5/8]−[3/10] = [50/80]−[24/80] = [26/80] = [13/40]"],
        { t: "다른 방법", p: ["[5/8]−[3/10] = ", { q: [null, ["5", "×", "?5"], ["8", "×", "?5"]] }, "−", { q: [null, ["3", "×", "?4"], ["10", "×", "?4"]] }, " = ", { q: [null, "?25", "40"] }, "−", { q: [null, "?12", "40"] }, " = ", { q: [null, "?13", "40"] }] },
        ["유나의 공통분모 80은 두 분모의 ", { c: ["곱", "최소공배수"], a: 0 }, "이고, 40은 두 분모의 ", { c: ["곱", "최소공배수"], a: 1 }, "예요."]],
        { ok: "두 방법 모두 [13/40]이에요. 어느 방법이든 자신에게 편리한 방법으로 계산하면 돼요." }) },
    { name: "약속하기", inst: "분모가 다른 분수의 뺄셈 방법을 약속해요.", hints: ["덧셈의 약속을 떠올려요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 분수의 뺄셈은 분수를 ", { o: ["통분한 후", "약분한 후"], a: 0 }, " 분모는 ", { o: ["그대로 쓰고", "분모끼리 빼고"], a: 0 }, " 분자끼리 ", { o: ["뺍니다", "더합니다"], a: 0 }, "."], { ok: "분모가 다른 분수의 뺄셈은 분수를 통분한 후 분모는 그대로 쓰고 분자끼리 뺍니다." }) },
    { name: "확인하기", inst: "계산해 보세요. 약분하지 않은 분수로 써도 맞아요.", hints: ["7과 5의 최소공배수는 35예요.", "분모끼리, 분자끼리 빼면 안 돼요."],
      render: (b, a) => fa5Calc(b, a, [
        { q: "케이크를 만드는 데 다연이는 우유를 [6/7] L, 시우는 [2/5] L 사용했어요. 다연이는 시우보다 우유를 몇 L 더 사용했을까요?", x: "[6/7]-[2/5]", a: "16/35", unit: "L", lab: "[6/7]−[2/5] =", den: 35, why: { "4/2": "분모는 분모끼리, 분자는 분자끼리 빼면 안 돼요. 먼저 통분해요." } },
        { e: "[4/5]−[1/2]", a: "3/10", den: 10 }, { e: "[7/9]−[1/6]", a: "11/18", den: 18 }, { e: "[7/8]−[3/10]", a: "23/40", den: 40 }, { e: "[11/12]−[1/15]", a: "17/20", den: 60 }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["어떤 수 + [2/7] = [16/21]이에요. 어떤 수는 [16/21]−[2/7]이에요.", "[3/7]과 [2/9]를 통분하면 [27/63], [14/63]이에요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "어떤 수에서 [2/7]를 빼야 하는데 잘못하여 더했더니 [16/21]이 되었어요. 어떤 수는?", x: "[16/21]-[2/7]", a: "10/21", lab: "어떤 수", den: 21 },
      { q: "바르게 계산한 값은?", x: "[10/21]-[2/7]", a: "4/21", lab: "바른 값", den: 21 },
      { q: "실과 시간에 모형을 꾸미는 데 색 테이프를 유진이는 [3/7] m, 동원이는 [2/9] m 사용했어요. 누가 더 많이 사용했을까요?", pick: ["유진", "동원"], a: 0, why: { "1": "통분하면 [3/7] = [27/63], [2/9] = [14/63]이에요." } },
      { q: "몇 m 더 많이 사용했을까요?", x: "[3/7]-[2/9]", a: "13/63", unit: "m", lab: "[3/7]−[2/9] =", den: 63 }]) }
},
{
  id: "t6", no: 6, title: "대분수의 뺄셈을 해 볼까요(1)", soop: "개념 구축하기(O)",
  question: "분수 부분끼리 뺄 수 있는 분모가 다른 대분수의 뺄셈은 어떻게 할까요?",
  summary: "두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 빼거나, 대분수를 가분수로 나타내고 두 가분수를 통분하여 빼요. [3 5/6]−[1 2/3] = [3 5/6]−[1 4/6] = 2+[1/6] = [2 1/6], [3 5/6]−[1 2/3] = [23/6]−[10/6] = [13/6] = [2 1/6]",
  steps: [
    { name: "만져 보기", inst: "유기견들을 산책시키는 데 지후는 [1 1/2] km, 소윤이는 [1 1/5] km를 걸었어요. 1 km를 10칸으로 나눈 막대에 지후가 걸은 거리가 있어요. 소윤이가 걸은 거리만큼 ×표 하여 지후가 몇 km 더 걸었는지 알아보세요.", hints: ["[1 1/5] = [1 2/10]이에요. 1 km 막대 하나와 2칸에 ×표 해요.", "남은 칸이 지후가 더 걸은 거리예요."],
      render: (b, a) => fa5Take(b, a, { d: 10, m: "1 1/2", s: "1 1/5", unit: "km", ask: [
        ["[1 1/2] = ", { q: ["1", "?5", "10"] }],
        ["[1 1/5] = ", { q: ["1", "?2", "10"] }],
        ["[1 1/2]−[1 1/5] = ", { q: ["1", "?5", "10"] }, "−", { q: ["1", "?2", "10"] }, " = ", { q: [null, "?3", "10"] }]], ok: "지후는 소윤이보다 [3/10] km 더 많이 걸었어요." }) },
    { name: "그려 보기", inst: "[3 5/6]−[1 2/3]을 두 가지 방법으로 계산해 보세요.", hints: ["[1 2/3] = [1 4/6]이에요.", "[3 5/6] = [23/6], [1 2/3] = [5/3] = [10/6]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 자연수끼리, 분수끼리", p: ["[3 5/6]−[1 2/3] = [3 5/6]−", { q: ["1", "?4", "6"] }, " = (", { i: "3" }, "−", { i: "1" }, ")+([5/6]−", { q: [null, "?4", "6"] }, ") = ", { q: ["?2", "?1", "6"] }] },
        { t: "방법 2 · 가분수로", p: ["[3 5/6]−[1 2/3] = ", { q: [null, "?23", "6"] }, "−", { q: [null, "?5", "3"] }, " = [23/6]−", { q: [null, "?10", "6"] }, " = ", { q: [null, "?13", "6"] }, " = ", { q: ["?2", "?1", "6"] }] }],
        { ok: "두 방법 모두 [2 1/6]이에요. 자연수끼리 뺀 2와 분수끼리 뺀 [1/6]을 더했어요." }) },
    { name: "말해 보기", inst: "[4 3/4]−[2 1/6]을 두 가지 방법으로 계산하고, 두 방법의 좋은 점을 말해 보세요.", hints: ["4와 6의 최소공배수는 12예요.", "[4 3/4] = [19/4] = [57/12], [2 1/6] = [13/6] = [26/12]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1", p: ["[4 3/4]−[2 1/6] = ", { q: ["4", "?9", "12"] }, "−", { q: ["2", "?2", "12"] }, " = ", { q: ["?2", "?7", "12"] }] },
        { t: "방법 2", p: ["[4 3/4]−[2 1/6] = ", { q: [null, "?19", "4"] }, "−", { q: [null, "?13", "6"] }, " = ", { q: [null, "?57", "12"] }, "−", { q: [null, "?26", "12"] }, " = ", { q: [null, "?31", "12"] }, " = ", { q: ["?2", "?7", "12"] }] },
        ["자연수는 자연수끼리, 분수는 분수끼리 계산하면 ", { c: ["분수 부분의 계산이 편리해요", "자연수 부분을 따로 계산하지 않아도 돼요"], a: 0 }],
        ["대분수를 가분수로 나타내어 계산하면 ", { c: ["분수 부분의 계산이 편리해요", "자연수 부분과 분수 부분을 따로 계산하지 않아서 편리해요"], a: 1 }]],
        { ok: "두 방법 모두 [2 7/12]예요. 상황에 따라 편리한 방법을 골라요." }) },
    { name: "약속하기", inst: "분수 부분끼리 뺄 수 있는 대분수의 뺄셈 방법을 정리해요.", hints: ["(자연수끼리 뺀 결과) + (분수끼리 뺀 결과)예요."],
      render: (b, a) => blanks(b, a, ["두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 ", { o: ["빼거나", "더하거나"], a: 0 }, ", 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 나타내고 두 가분수를 통분하여 뺍니다. 자연수끼리 뺀 결과와 분수끼리 뺀 결과는 ", { o: ["더해요", "빼요"], a: 0 }, "."], { ok: "자연수끼리 뺀 결과와 분수끼리 뺀 결과를 빼면 안 돼요. 두 결과를 더해 대분수로 나타내요." }) },
    { name: "확인하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["4와 20의 최소공배수는 20이에요.", "자연수끼리, 분수끼리 빼고 두 결과를 더해요."],
      render: (b, a) => fa5Calc(b, a, [
        { q: "세계에서 가장 긴 공룡 발자국의 길이는 [1 3/4] m, 두 번째로 긴 공룡 발자국의 길이는 [1 11/20] m라고 해요(교과서의 수와 다를 수 있어요). 두 발자국의 길이의 차는 몇 m일까요?", x: "[1 3/4]-[1 11/20]", a: "1/5", unit: "m", lab: "[1 3/4]−[1 11/20] =", den: 20 },
        { e: "[4 4/5]−[2 1/3]", a: "2 7/15", den: 15 }, { e: "[5 3/4]−[3 3/8]", a: "2 3/8", den: 8 }, { e: "[8 5/6]−[3 1/14]", a: "5 16/21", den: 42 }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["16과 12의 최소공배수는 48이에요.", "‘~보다 ~만큼 더 작은 수’는 빼서 구해요."],
    render: (b, a) => fa5Calc(b, a, [
      { q: "수지네 집에서 문구점까지는 [2 13/16] km, 도서관까지는 [1 7/12] km예요. 문구점은 도서관보다 몇 km 더 멀까요?", x: "[2 13/16]-[1 7/12]", a: "1 11/48", unit: "km", lab: "[2 13/16]−[1 7/12] =", den: 48 },
      { q: "승민: “[7 11/15]보다 [1 9/20]만큼 더 작은 수야.” 승민이가 설명하는 수는?", x: "[7 11/15]-[1 9/20]", a: "6 17/60", lab: "수", den: 60 },
      { q: "두 수 [2 25/32]와 [1 3/8]의 차는?", x: "[2 25/32]-[1 3/8]", a: "1 13/32", lab: "차", den: 32 }]) }
},
{
  id: "t7", no: 7, title: "대분수의 뺄셈을 해 볼까요(2)", soop: "개념 구축하기(O)",
  question: "분수 부분끼리 뺄 수 없는 분모가 다른 대분수의 뺄셈은 어떻게 할까요?",
  summary: "분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 1만큼을 분수로 나타내어 계산해요. [4 1/2]−[1 2/3] = [4 3/6]−[1 4/6] = [3 9/6]−[1 4/6] = 2+[5/6] = [2 5/6]. 대분수를 가분수로 나타내어 [27/6]−[10/6] = [17/6] = [2 5/6]으로 계산할 수도 있어요.",
  steps: [
    { name: "만져 보기", inst: "유기견들의 간식을 만드는 데 고구마를 소윤이는 [2 1/3] kg, 지후는 [1 3/4] kg 사용했어요. 1 kg을 12칸으로 나눈 막대에 소윤이가 사용한 양이 있어요. 지후가 사용한 양만큼 ×표 해 보세요.", hints: ["[1 3/4] = [1 9/12]이에요. 1 kg 막대 하나와 9칸에 ×표 해요.", "칸이 모자라면 ‘1을 쪼개기’를 눌러 1을 [12/12]로 바꾸어요."],
      render: (b, a) => fa5Take(b, a, { d: 12, m: "2 1/3", s: "1 3/4", unit: "kg", ask: [
        ["[2 1/3] = ", { q: ["2", "?4", "12"] }, " = ", { q: ["1", "?16", "12"] }],
        ["[1 3/4] = ", { q: ["1", "?9", "12"] }],
        ["[2 1/3]−[1 3/4] = ", { q: ["1", "?16", "12"] }, "−", { q: ["1", "?9", "12"] }, " = ", { q: [null, "?7", "12"] }]], ok: "소윤이는 지후보다 고구마를 [7/12] kg 더 많이 사용했어요. [4/12]에서 [9/12]를 뺄 수 없어서 1만큼을 [12/12]로 바꾸었어요." }) },
    { name: "그려 보기", inst: "[4 1/2]−[1 2/3]을 두 가지 방법으로 계산해 보세요.", hints: ["[4 3/6]−[1 4/6]에서 [3/6]에서 [4/6]을 뺄 수 없어요. [4 3/6] = [3 9/6]이에요.", "[4 1/2] = [9/2] = [27/6], [1 2/3] = [5/3] = [10/6]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        { t: "방법 1 · 자연수끼리, 분수끼리", p: ["[4 1/2]−[1 2/3] = ", { q: ["4", "?3", "6"] }, "−", { q: ["1", "?4", "6"] }, " = ", { q: ["?3", "?9", "6"] }, "−[1 4/6] = (", { i: "3" }, "−", { i: "1" }, ")+(", { q: [null, "?9", "6"] }, "−[4/6]) = ", { q: ["?2", "?5", "6"] }] },
        { t: "방법 2 · 가분수로", p: ["[4 1/2]−[1 2/3] = ", { q: [null, "?9", "2"] }, "−", { q: [null, "?5", "3"] }, " = ", { q: [null, "?27", "6"] }, "−", { q: [null, "?10", "6"] }, " = ", { q: [null, "?17", "6"] }, " = ", { q: ["?2", "?5", "6"] }] }],
        { ok: "두 방법 모두 [2 5/6]이에요." }) },
    { name: "말해 보기", inst: "예준이는 [3 1/4]−[2 5/8]을 가분수로 나타내어 계산했어요. 예준이와 다른 방법으로 계산해 보세요.", hints: ["[3 1/4] = [3 2/8]이에요. [2/8]에서 [5/8]을 뺄 수 없어요.", "[3 2/8] = [2 10/8]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        ["예준이의 방법: [3 1/4]−[2 5/8] = [13/4]−[21/8] = [26/8]−[21/8] = [5/8]"],
        { t: "다른 방법", p: ["[3 1/4]−[2 5/8] = ", { q: ["3", "?2", "8"] }, "−[2 5/8] = ", { q: ["?2", "?10", "8"] }, "−[2 5/8] = ", { q: [null, "?5", "8"] }] },
        ["[2/8]에서 [5/8]을 뺄 수 없어서 자연수 부분의 ", { c: ["1만큼을 분수로", "분모를 분자로"], a: 0 }, " 나타내었어요."]],
        { ok: "[3 2/8]의 자연수 부분에서 1만큼을 [8/8]로 바꾸어 [2 10/8]로 나타냈어요. 답은 [5/8]이에요." }) },
    { name: "약속하기", inst: "분수 부분끼리 뺄 수 없을 때의 계산 방법을 약속해요.", hints: ["1 = [8/8] = [12/12]처럼 1은 분모와 분자가 같은 분수예요."],
      render: (b, a) => blanks(b, a, ["분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 ", { o: ["1만큼을", "분수 부분만큼을"], a: 0 }, " 분수로 나타내어 계산해요. 이때 자연수 부분은 ", { o: ["1 작아져요", "그대로예요"], a: 0 }, "."], { ok: "분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 1만큼을 분수로 나타내어 계산해요." }) },
    { name: "확인하기", inst: "[5 1/6]−[2 4/9]에 알맞은 문제를 고르고 해결해 보세요. 다른 식도 계산해 보세요.", hints: ["‘얼마나 더 긴지’는 뺄셈으로 구해요.", "6과 9의 최소공배수는 18이에요. [5 3/18] = [4 21/18]이에요."],
      render: (b, a) => fa5Calc(b, a, [
        { q: "[5 1/6]−[2 4/9]에 알맞은 문제는?", pick: ["민규의 리본은 [5 1/6] m, 유진이의 리본은 [2 4/9] m예요. 민규의 리본은 유진이의 리본보다 몇 m 더 길까요?", "민규의 리본은 [5 1/6] m, 유진이의 리본은 [2 4/9] m예요. 두 사람의 리본은 모두 몇 m일까요?"], a: 0, why: { "1": "‘모두’ 몇 m인지 구하는 문제는 덧셈이에요." } },
        { q: "고른 문제를 해결해요.", x: "[5 1/6]-[2 4/9]", a: "2 13/18", unit: "m", lab: "[5 1/6]−[2 4/9] =", den: 18 },
        { e: "[3 5/8]−[1 3/4]", a: "1 7/8", den: 8 }, { e: "[4 5/12]−[2 8/15]", a: "1 53/60", den: 60 }]) }
  ],
  challenge: { inst: "수 카드 2, 5, 8을 한 번씩만 사용하여 가장 큰 대분수와 가장 작은 대분수를 만들고, 두 수의 차를 구해 보세요.", hints: ["가장 큰 대분수는 자연수 부분에 가장 큰 수를 놓아요.", "가장 작은 대분수는 자연수 부분에 가장 작은 수를 놓아요."],
    render: (b, a) => fa5Mixed(b, a, { groups: [{ name: "① 큰 수", cards: [2, 5, 8], kind: "max" }, { name: "② 작은 수", cards: [2, 5, 8], kind: "min" }], op: "-" }) }
},
{
  id: "t8", no: 8, title: "생각을 더하다 ― 음표로 분수의 덧셈을 해 볼까요", soop: "탐구 정리하기(O)",
  question: "음표의 길이를 분수로 나타내어 악보를 완성할 수 있을까요?",
  summary: "4분음표(♩)를 1박으로 하면 8분음표는 [1/2]박, 16분음표는 [1/4]박이에요. 점 8분음표는 8분음표와 16분음표를 더한 길이로 [1/2]+[1/4] = [3/4]박이에요. 한 마디 안 음표의 박을 분모가 다른 분수의 덧셈으로 더하면 박자표에 맞는지 알 수 있어요.",
  steps: [
    { name: "음표의 박 알아보기", inst: "「비행기」 악보의 2/4박자는 4분음표를 1박으로 하여 각 마디가 모두 2박으로 이루어져 있다는 뜻이에요. 음표의 박을 알아보세요.", hints: ["8분음표 2개가 4분음표 1개와 같아요.", "16분음표 2개가 8분음표 1개와 같아요."],
      render: (b, a) => quiz(b, a, [
        { q: "4분음표를 1박으로 하면 8분음표는 몇 박일까요?", fig: fa5NoteFig(["q", "e", "s"], { label: true }), o: ["[1/2]박", "2박", "[1/8]박"], a: 0, why: { "1": "8분음표는 4분음표의 반만큼 길어요.", "2": "8분음표라고 [1/8]박이 아니에요. 4분음표를 1박으로 하면 반이에요." } },
        { q: "16분음표는 몇 박일까요?", o: ["[1/4]박", "[1/16]박", "4박"], a: 0, why: { "1": "16분음표는 8분음표의 반이에요. [1/2]의 반은?" } },
        { q: "음표 머리 오른쪽에 작은 점이 있는 점음표에서 점의 길이는?", o: ["본 음표 길이의 반", "본 음표 길이와 같음"], a: 0 }],
        { ok: "4분음표 1박, 8분음표 [1/2]박, 16분음표 [1/4]박이에요. 점은 본 음표 길이의 반을 나타내요." }) },
    { name: "점 8분음표", inst: "점 8분음표는 몇 박인지 분수의 덧셈으로 구해 보세요.", hints: ["점 8분음표 = 8분음표 + (8분음표의 반) = 8분음표 + 16분음표예요.", "[1/2] = [2/4]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        ["점 8분음표 = 8분음표 + 16분음표"],
        ["[1/2]+[1/4] = ", { q: [null, "?2", "4"] }, "+[1/4] = ", { q: [null, "?3", "4"] }],
        ["그래서 점 8분음표는 ", { q: [null, "?3", "?4"] }, "박이에요."]], { fig: fa5NoteFig(["de"]), ok: "점 8분음표는 [3/4]박이에요." }) },
    { name: "마디 확인하기", inst: "㉠ 마디에는 점 8분음표, 16분음표, 8분음표, 8분음표가 있어요. ㉠ 마디가 2/4박자에 맞는지 박을 더해 확인해 보세요.", hints: ["[3/4]+[1/4]+[1/2]+[1/2]을 분모가 4인 분수로 나타내어 더해요.", "[8/4] = 2예요."],
      render: (b, a) => fa5Chain(b, a, [
        ["[3/4]+[1/4]+[1/2]+[1/2] = [3/4]+[1/4]+", { q: [null, "?2", "4"] }, "+", { q: [null, "?2", "4"] }, " = ", { q: [null, "?8", "4"] }, " = ", { i: "2" }],
        ["그래서 ㉠ 마디는 2/4박자가 ", { c: ["맞아요", "아니에요"], a: 0 }, "."]], { fig: fa5NoteFig(["de", "s", "e", "e"]), ok: "㉠ 마디의 음표를 모두 더하면 2박이에요. 2/4박자가 맞아요." }) },
    { name: "음표 넣기", inst: "㉡ 마디에는 8분음표, 8분음표, 점 8분음표가 있어요. 빈칸에 알맞은 음표 하나를 넣어 2/4박자에 맞게 완성해 보세요.", hints: ["[1/2]+[1/2]+[3/4] = [7/4] = [1 3/4]박이에요.", "2−[1 3/4] = [1/4]박이에요. [1/4]박인 음표는?"],
      render: (b, a) => fa5Music(b, a, { measures: [{ beats: 2, notes: ["e", "e", "de"], one: true, ans: "s", label: "㉡ 마디 (2/4박자)" }], ok: "[1/2]+[1/2]+[3/4] = [7/4] = [1 3/4]박이므로 [1/4]박인 16분음표가 들어가요." }) },
    { name: "악보 완성하기", inst: "4/4박자 악보예요. 마디마다 4박이 되도록 빈칸에 알맞은 음표를 넣어 보세요. 첫 번째 마디는 음표 하나만 넣어요.", hints: ["첫 번째 마디: [1/2]+1+1+[3/4] = [13/4] = [3 1/4]박이에요. 4박이 되려면 [3/4]박이 더 필요해요.", "두 번째 마디: [1/4]+[1/2]+[1/2]+[3/4] = [8/4] = 2박이에요. 2박이 더 필요해요."],
      render: (b, a) => fa5Music(b, a, { measures: [{ beats: 4, notes: ["e", "q", "q", "de"], one: true, ans: "de", label: "첫 번째 마디 (4/4박자)" }, { beats: 4, notes: ["s", "e", "e", "de"], ans: "hf", label: "두 번째 마디 (4/4박자)" }], ok: "첫 번째 마디에는 [3/4]박인 점 8분음표, 두 번째 마디에는 2박만큼(예: 2분음표) 들어가요. 악보가 완성됐어요!" }) }
  ],
  challenge: { inst: "완성한 리듬에 맞추어 나만의 가사를 지어 보세요. (예: 따 스 한 햇 살 살 랑 살 랑 봄 바 람)", hints: ["음표 하나에 한 글자씩 붙여요.", "점 8분음표처럼 긴 음표에는 길게 부를 글자를 붙여 봐요."],
    render: (b, a) => writeStep(b, a, [
      { q: "나만의 가사", tag: "가사", ph: "음표 하나에 한 글자씩 써 봐요." },
      { q: "음표의 길이를 분수로 나타내어 더해 보니 어떤 점이 좋았나요?", tag: "생각", ph: "예: 한 마디에 박이 맞는지 정확하게 알 수 있었어요." }]) }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 신나는 분수 윷놀이", soop: "발표하기(P)",
  question: "윷놀이를 하며 분모가 다른 분수의 덧셈과 뺄셈을 해 볼까요?",
  summary: "주사위와 분수 주사위를 던져 나온 눈의 수만큼 말을 옮기고, 도착한 칸의 분수와 분수 주사위의 분수의 합 또는 차를 구해요. 계산이 맞으면 그 칸에 두고, 틀리면 원래 칸으로 되돌려요. 뺄셈은 (큰 수)−(작은 수)로 식을 세우고, 기약분수가 아닌 분수나 가분수로 답해도 돼요.",
  steps: [
    { name: "놀이 방법 알아보기", inst: "신나는 분수 윷놀이의 방법이에요. 놀이 순서대로 차례로 눌러 보세요.", hints: ["먼저 놀이 순서를 정하고 주사위를 던져요.", "계산 결과가 맞는지에 따라 말을 두거나 되돌려요."],
      render: (b, a) => sequence(b, a, ["나온 눈의 수만큼 말을 이동해요.", "가위바위보로 놀이 순서를 정해요.", "계산이 맞으면 그 칸에 두고, 틀리면 원래 칸으로 되돌려요.", "주사위와 분수 주사위를 동시에 던져요.", "칸의 분수와 분수 주사위의 분수의 합 또는 차를 구해요."], [1, 3, 0, 4, 2], { ok: "가위바위보 → 주사위 던지기 → 말 이동 → 계산 → 맞으면 그대로, 틀리면 되돌리기예요." }) },
    { name: "연습하기", inst: "놀이에서 하는 계산을 미리 연습해 보세요.", hints: ["10과 8의 최소공배수는 40이에요.", "뺄셈은 (큰 수)−(작은 수)로 식을 세워요."],
      render: (b, a) => fa5Calc(b, a, [
        { q: "말이 [2 7/10] 칸에 도착했고, 분수 주사위에서 ‘−[1 3/8]’이 나왔어요.", e: "[2 7/10]−[1 3/8]", a: "1 13/40", den: 40 },
        { q: "칸의 분수가 [1/4]이고 분수 주사위에서 ‘−[2/3]’이 나왔을 때 알맞은 식은?", pick: ["[2/3]−[1/4]", "[1/4]−[2/3]"], a: 0, why: { "1": "[1/4]은 [2/3]보다 작아서 뺄 수 없어요. (큰 수)−(작은 수)로 식을 세워요." } },
        { q: "그 식을 계산해요.", x: "[2/3]-[1/4]", a: "5/12", lab: "[2/3]−[1/4] =", den: 12 }]) },
    { name: "윷놀이 하기", inst: "로봇과 분수 윷놀이를 해 보세요. ★ 칸에 멈추면 지름길로 가고, 다른 편 말이 있는 칸에 멈추면 그 말을 잡고 한 번 더 던져요. 모든 말이 먼저 놀이판을 다 돌아 나오면 이겨요.", hints: ["분수 주사위가 ♥이면 계산하지 않고 그 칸에 그대로 둬요.", "뺄셈은 (큰 수)−(작은 수)예요. 통분한 후 분자끼리 계산해요."],
      render: (b, a) => fa5Yut(b, a, {}) },
    { name: "또 다른 놀이", inst: "카드 놀이도 해 봐요. 노란 카드에는 분모가 2, 3, 4, 5인 분수, 파란 카드에는 분모가 6, 7, 8, 9인 분수가 쓰여 있어요. 카드를 보기 전에 덧셈이나 뺄셈을 고르고, 카드를 한 장씩 뒤집어 계산해요.", hints: ["계산이 맞으면 1점, 계산 결과가 더 큰 사람은 1점을 더 얻어요.", "뺄셈은 (큰 수)−(작은 수)로 해요."],
      render: (b, a) => fa5CardGame(b, a, {}) },
    { name: "되돌아보기", inst: "놀이를 되돌아보아요.", hints: ["계산을 정확하게 해야 말을 옮길 수 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "윷놀이에서 이기려면 어떻게 하면 좋을까요? 알맞은 것을 모두 골라요.", o: ["정확하게 계산해요", "다른 편의 말을 잡아요", "★ 지름길 칸에 멈추도록 말을 골라 옮겨요", "계산하지 않고 빨리 옮겨요"], a: [0, 1, 2], why: { "0,1,2,3": "계산하지 않으면 말을 옮길 수 없어요." } },
        { q: "계산 결과가 [10/12]일 때, 약분하여 [5/6]로 쓰지 않아도 맞을까요?", o: ["맞아요. 값이 같으면 정답이에요", "틀려요. 꼭 약분해야 해요"], a: 0 }],
        { ok: "정확하게 계산하는 것이 가장 중요해요. 기약분수가 아니어도, 가분수여도 값이 같으면 맞아요." }) }
  ],
  challenge: { inst: "놀이판에서 나올 수 있는 계산을 해 보세요.", hints: ["통분한 후 분자끼리 계산해요.", "분수 부분끼리 뺄 수 없으면 1만큼을 분수로 나타내요."],
    render: (b, a) => fa5Calc(b, a, [{ e: "[1 7/8]+[1/2]", a: "2 3/8", den: 8 }, { e: "[2 1/3]−[1/2]", a: "1 5/6", den: 6 }, { e: "[5/9]+[2/5]", a: "43/45", den: 45 }, { e: "[1 1/6]−[1/4]", a: "11/12", den: 12 }]) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분모가 다른 분수의 덧셈과 뺄셈을 할 수 있나요?",
  summary: "분모가 다른 분수의 덧셈과 뺄셈은 분모를 통분한 후 분모는 그대로 쓰고 분자끼리 계산해요. 대분수는 자연수는 자연수끼리, 분수는 분수끼리 계산하거나 가분수로 나타내어 계산해요. 분수 부분끼리 뺄 수 없으면 자연수 부분의 1만큼을 분수로 나타내어 계산해요.",
  steps: [
    { name: "1. 그림으로 계산하기", inst: "[4/5]와 [1/3]의 막대를 한 칸이 [1/15]이 되게 나누어 [4/5]−[1/3]을 계산해 보세요.", hints: ["[4/5]의 한 칸을 3칸으로, [1/3]의 한 칸을 5칸으로 나누어요.", "[4/5] = [12/15], [1/3] = [5/15]이에요."],
      render: (b, a) => fa5Split(b, a, { A: "4/5", B: "1/3", op: "-", d: 15, ask: [
        ["[4/5]−[1/3] = ", { q: [null, "?12", "15"] }, "−", { q: [null, "?5", "15"] }, " = ", { q: [null, "?7", "15"] }]], ok: "[4/5]−[1/3] = [12/15]−[5/15] = [7/15]이에요." }) },
    { name: "2. 빈칸 채우기", inst: "□ 안에 알맞은 수를 써넣으세요.", hints: ["2와 7의 최소공배수는 14예요.", "분모에 곱한 수를 분자에도 곱해요."],
      render: (b, a) => fa5Chain(b, a, [
        ["[1/2]+[2/7] = ", { q: [null, ["1", "×", "?7"], ["2", "×", "?7"]] }, "+", { q: [null, ["2", "×", "?2"], ["7", "×", "?2"]] }, " = ", { q: [null, "?7", "14"] }, "+", { q: [null, "?4", "14"] }, " = ", { q: [null, "?11", "14"] }]], { ok: "[1/2]+[2/7] = [7/14]+[4/14] = [11/14]이에요." }) },
    { name: "3~5. 계산하기", inst: "계산해 보세요. 가분수로 써도, 약분하지 않아도 맞아요.", hints: ["7과 9의 최소공배수는 63, 8과 10의 최소공배수는 40이에요.", "[2 1/6]−[1 1/5]은 분수 부분끼리 뺄 수 없어요. [2 5/30] = [1 35/30]이에요."],
      render: (b, a) => fa5Calc(b, a, [{ e: "[3 5/7]+[1 4/9]", a: "5 10/63", den: 63 }, { e: "[7 3/8]−[3 1/10]", a: "4 11/40", den: 40 },
        { q: "계산 결과의 크기를 비교해요.", e: "[5/6]+[3/8] ○ [5 5/6]−[4 3/4]", pick: [">", "=", "<"], a: 0, why: { "2": "[5/6]+[3/8] = [1 5/24], [5 5/6]−[4 3/4] = [1 1/12] = [1 2/24]이에요.", "1": "두 식을 계산해 보면 값이 달라요." } },
        { q: "유나는 일주일 동안 줄넘기를 [2 1/6]시간, 오래달리기를 [1 1/5]시간 했어요. 줄넘기를 몇 시간 더 했을까요?", x: "[2 1/6]-[1 1/5]", a: "29/30", unit: "시간", lab: "[2 1/6]−[1 1/5] =", den: 30 },
        { q: "1차시의 나무늘보는 하루에 [14 4/5]시간, 말은 [2 9/10]시간 잔다면(이 앱의 예시 값) 나무늘보는 말보다 몇 시간 더 잘까요?", x: "[14 4/5]-[2 9/10]", a: "11 9/10", unit: "시간", lab: "[14 4/5]−[2 9/10] =", den: 10 }]) },
    { name: "6. 잘못 찾기", inst: "잘못 계산한 부분을 찾아 까닭을 고르고 옳게 계산해 보세요.", hints: ["[4 9/24]에서 1만큼을 분수로 바꾸면 자연수 부분은 1 작아져요.", "[4 9/24] = [3 33/24]이에요."],
      render: (b, a) => fa5Chain(b, a, [
        ["잘못된 계산: [4 3/8]−[2 7/12] = [4 9/24]−[2 14/24] = [4 33/24]−[2 14/24] = [2 19/24]"],
        ["까닭: ", { c: ["1만큼을 분수로 나타냈는데 자연수 부분을 그대로 두었어요", "통분을 잘못했어요"], a: 0 }],
        { t: "옳은 계산", p: ["[4 9/24]−[2 14/24] = ", { q: ["?3", "?33", "24"] }, "−[2 14/24] = ", { q: ["?1", "?19", "24"] }] }],
        { ok: "[4 9/24]에서 1만큼을 분수로 나타내면 [3 33/24]이에요. 옳은 답은 [1 19/24]이에요." }) },
    { name: "7. 수 카드 문제", inst: "지훈이는 수 카드 2, 5, 9를, 서윤이는 수 카드 4, 6, 7을 가지고 있어요. 각자 수 카드를 한 번씩만 사용하여 가장 큰 대분수를 만들고, 두 대분수의 합을 구해 보세요.", hints: ["가장 큰 대분수는 자연수 부분에 가장 큰 수 카드를 놓고, 남은 카드로 진분수를 만들어요.", "5와 6의 곱 30을 공통분모로 통분해요."],
      render: (b, a) => fa5Mixed(b, a, { groups: [{ name: "지훈", cards: [2, 5, 9], kind: "max" }, { name: "서윤", cards: [4, 6, 7], kind: "max" }], op: "+" }) }
  ],
  challenge: { inst: "확인하고 정리해요. 빈칸을 채워 이 단원에서 배운 계산을 정리해 보세요.", hints: ["진분수의 덧셈·뺄셈은 통분한 후 분자끼리 계산해요.", "대분수는 자연수끼리·분수끼리 계산하거나 가분수로 나타내어 계산해요."],
    render: (b, a) => fa5Chain(b, a, [
      { t: "진분수의 덧셈", p: ["[2/3]+[1/5] = ", { q: [null, "?10", "15"] }, "+", { q: [null, "?3", "15"] }, " = ", { q: [null, "?13", "15"] }] },
      { t: "진분수의 뺄셈", p: ["[7/8]−[1/4] = [7/8]−", { q: [null, "?2", "8"] }, " = ", { q: [null, "?5", "8"] }] },
      { t: "대분수의 덧셈", p: ["[1 1/6]+[1 1/4] = ", { q: [null, "?14", "12"] }, "+", { q: [null, "?15", "12"] }, " = ", { q: [null, "?29", "12"] }, " = ", { q: ["?2", "?5", "12"] }] },
      { t: "대분수의 뺄셈", p: ["[3 1/2]−[1 1/5] = ", { q: ["3", "?5", "10"] }, "−", { q: ["1", "?2", "10"] }, " = ", { q: ["?2", "?3", "10"] }] }],
      { ok: "분모가 다른 분수의 덧셈과 뺄셈은 분모를 통분한 후 분모는 그대로 쓰고 분자끼리 계산해요. 단원 정리 끝!" }) }
}
];
