//@@APP
const APP={title:"유기견 보호 센터 분수의 덧셈과 뺄셈", unit:"5-1 수학 5. 분수의 덧셈과 뺄셈(교과서)", key:"t51-fracadd-v1", welcome:"유기견 보호 센터 분수의 덧셈과 뺄셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 유기견 보호 센터에서 봉사 활동을 하는 소윤이와 지후와 함께 분모가 다른 분수를 통분하여 더하고 빼 봐요."};
//@@UNIT
/* ===== 5. 분수의 덧셈과 뺄셈 단원 조작 부품 (앞글자 fa5) =====
   4-2 「분수의 덧셈과 뺄셈」(분모가 같은 분수) 부품을 바탕으로, 분모가 다른 분수에 맞게 고쳤어요.
   글 속 분수 표기: [3/7] 진분수·가분수, [2 1/4] 대분수, [□/5]·[3+5/7](분자에 식)도 됨.
   채점은 값으로 해요: 약분하지 않은 분수, 가분수, 대분수 모두 정답이에요(지도서 채점 원칙). */
/*fa5-core*/
const FA5_SRC = "\\[(?:(\\d+|□) )?([0-9□]+(?:[+−-][0-9□]+)?)\\/([0-9□]+)\\]";
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
  const jsNum = v => ex(v).replace(/−/g, "-");
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
  api.provide({ words: opt.words || ["분모는 그대로", "분자끼리", "자연수 부분끼리", "분수 부분끼리", "가분수", "1 = 분모와 분자가 같은 분수"], answers: plains });
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
