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
  const W = 900, LX = 230, UW = 620, BH = 56, GP = 46;
  const svg = makeSvg(W, 100);
  const dOf = i => V[i].den * k[i], same = () => dOf(0) === dOf(1);
  const ctl = h("div");
  const labs = [0, 1].map(() => h("span", { class: "jua" }));
  const btn = (i, dk) => h("button", { onclick: () => { const nk = k[i] + dk; if (nk < 1) return; if (V[i].den * nk > MAXD) return api.hint(`그림으로는 한 막대를 ${MAXD}칸까지만 나눌 수 있어요. 더 작은 공통분모를 찾아봐요.`); k[i] = nk; draw(); } }, dk > 0 ? "더 잘게 ＋" : "－ 되돌리기");
  [0, 1].forEach(i => ctl.append(h("div", { class: "fa5tools" }, h("span", { class: "fa5tag", style: `border-left:8px solid ${FA5_F[i]}` }, fa5Plain(names[i]) === names[i] ? names[i] : names[i]), btn(i, -1), labs[i], btn(i, 1))));
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
      svg.append(fa5SvgLine(`음표의 박을 모두 더하면 ${fa5Tk(fa5Form(now.num, now.den))}박 / ${M.m.beats}박이 되어야 해요`, W / 2, yl + 62, 20, { fill: now.num === M.m.beats * now.den ? "#2E8B57" : "#5B6B6B" }));
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
    if (q.done) msg += " 이 다 돌았어요!";
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
