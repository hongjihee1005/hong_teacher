//@@APP
const APP={title:"우리 반 요리 교실", unit:"4-2 수학 1. 분수의 덧셈과 뺄셈", key:"s42-fracadd-v1", welcome:"우리 반 요리 교실에 온 것을 환영해요", intro:"4학년 3반 친구들과 나눔 파티 요리를 준비하며, 주스·반죽·리본·밀가루의 양을 분수로 더하고 빼 봐요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(sem2/u1-fracadd.tb.js)의 f1 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   (입력칸 0.9초 · 고르기 0.26초 · 색칠·끌기·카드 넣기 1.2초) 이 파일에서 새로 만든 그림은 앞글자 f1s. */
/* ===== 1. 분수의 덧셈과 뺄셈 단원 조작 부품 (앞글자 f1) =====
   글 속 분수 표기: [3/7] 진분수·가분수, [2 1/4] 대분수, [□/5]·[3+5/7](분자에 식)도 됨.
   화면에서는 f1 관찰자가 이 표기를 위아래(분자/분모)로 쌓은 분수로 바꾸어 보여 줘요. 읽어 주기는 '7분의 3'으로 읽어요. */

/*f1-core*/
const F1_SRC = "\\[(?:(\\d+|□) )?([0-9□]+(?:[+−-][0-9□]+)?)\\/([0-9□]+)\\]";
const f1Re = () => new RegExp(F1_SRC, "g");
/* 칸에 쓴 글(자연수·분자·분모) → 수 */
function f1Raw(ws, ns, ds) {
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
function f1Str(s) {
  s = String(s).trim().replace(/^\[|\]$/g, "").trim();
  let m = s.match(/^(\d+)$/); if (m) return f1Raw(m[1], "", "");
  m = s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/); if (m) return f1Raw(m[1] || "", m[2], m[3]);
  return null;
}
const f1Eq = (a, b) => a.num * b.den === b.num * a.den;
const f1G = (a, b) => b ? f1G(b, a % b) : Math.abs(a);
function f1R(num, den) { const g = f1G(num, den) || 1; return { num: num / g, den: den / g }; }
/* 분모가 den인 교과서 꼴: 대분수(자연수) */
function f1Form(num, den) { const w = Math.floor(num / den), r = num % den; return r === 0 ? String(w) : w === 0 ? `${r}/${den}` : `${w} ${r}/${den}`; }
const f1Tk = s => /\//.test(String(s)) ? `[${s}]` : String(s);
/* 교과서 답 표기: 대분수(=가분수) */
function f1Book(num, den) {
  const m = f1Form(num, den), imp = `[${num}/${den}]`;
  if (num % den === 0) return num > 0 && den > 1 ? `${m} (=${imp})` : m;
  return num > den ? `${f1Tk(m)} (=${imp})` : f1Tk(m);
}
/* 식 계산: "[1 3/5]+[2 4/5]", "3−[1 3/4]", "4−[1 1/8]−[5/8]" (덧셈·뺄셈만) */
function f1Eval(e) {
  let rest = String(e).replace(/−/g, "-").replace(/\s+/g, " ").trim(), acc = null, op = "+";
  while (rest.length) {
    const m = rest.match(/^(\[[^\]]+\]|\d+)\s*/); if (!m) return null;
    const v = f1Str(m[1]); if (!v || v.err) return null;
    acc = acc == null ? f1R(v.num, v.den) : f1R(op === "+" ? acc.num * v.den + v.num * acc.den : acc.num * v.den - v.num * acc.den, acc.den * v.den);
    rest = rest.slice(m[0].length);
    if (!rest.length) break;
    const o = rest.match(/^([+\-])\s*/); if (!o) return null;
    op = o[1]; rest = rest.slice(o[0].length);
  }
  return acc;
}
function f1Den(s) { const m = String(s || "").match(/\/(\d+)\]?/); return m ? +m[1] : 0; }
/* 받침에 맞는 조사(분수는 분자를 마지막에 읽으므로 분자의 끝 숫자 기준): f1J("[3/7]", "은는") → "[3/7]은" */
function f1J(s, pair) {
  const str = String(s), core = str.replace(/\/[0-9□]+\]/g, "]"), digits = core.replace(/[^0-9]/g, ""), c = /[0-9]\]?$/.test(core) ? digits[digits.length - 1] : core.replace(/\]$/, "").slice(-1);
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"] };
  const [a, b] = M[pair];
  if (pair === "으로") return str + (has && !rieul ? a : b);
  return str + (has ? a : b);
}
/* 학생 답 판정: 값으로 판정, 분모가 다르면(약분 등) 안내만, 분수 부분이 1 이상인 대분수는 다시 */
function f1Judge(r, a, den) {
  if (r.err === "empty") return { code: "empty", msg: "빈칸에 답을 써요." };
  if (r.err === "half") return { code: "half", msg: "분수는 분자와 분모를 모두 써요." };
  if (r.err) return { code: "bad", msg: "칸에는 수만 써요." };
  const t = f1Str(a);
  if (!f1Eq(r, t)) return { code: "wrong" };
  if (r.hasF && den && r.d !== den) return { code: "diffden", msg: `값은 같아요. 이 단원에서는 분모를 ${f1J(den, "으로")} 그대로 두고 써요.` };
  if (r.hasF && r.hasW && r.n >= r.d) return { code: "improper", msg: `분수 부분 ${f1J(`[${r.n}/${r.d}]`, "은는")} 1이거나 1보다 커요. 1만큼을 자연수 부분으로 옮겨 대분수로 나타내요.` };
  if (r.hasF && r.n === 0) return { code: "zero", msg: "분자가 0이면 자연수만 써요." };
  return { code: "ok" };
}
function f1Key(r) { return r.err ? "" : r.hasF ? (r.hasW ? `${r.w} ${r.n}/${r.d}` : `${r.n}/${r.d}`) : String(r.w); }
/* 흔한 실수 찾기 (두 수의 덧셈·뺄셈) */
function f1Diag(e, r) {
  if (!e || r.err) return null;
  const m = String(e).replace(/−/g, "-").match(/^\s*(\[[^\]]+\]|\d+)\s*([+\-])\s*(\[[^\]]+\]|\d+)\s*$/); if (!m) return null;
  const A = f1Str(m[1]), B = f1Str(m[3]), op = m[2], d = A.d || B.d, one = `[${d}/${d}]`;
  if (!A || !B || !d) return null;
  if (op === "+" && r.hasF && A.hasF && B.hasF && A.d === B.d && r.d === A.d + B.d) return "분모끼리 더하면 안 돼요. 분모는 그대로 쓰고 분자끼리만 더해요.";
  if (op === "-" && r.hasF && A.hasF && B.hasF && A.d === B.d && r.d === 0) return "분모는 그대로 쓰고 분자끼리만 빼요.";
  if (op === "+" && A.hasF && B.hasF && A.n + B.n >= d && (A.w || B.w)) { const fc = f1R((A.w + B.w) * d + (A.n + B.n - d), d); if (f1Eq(r, fc)) return `분수 부분끼리 더한 ${f1J(`[${A.n + B.n}/${d}]`, "은는")} 1과 ${f1J(`[${A.n + B.n - d}/${d}]`, "이에요")}. 그 1을 자연수 부분에 더해야 해요.`; }
  if (op === "-" && A.hasF && B.hasF && A.n < B.n) {
    const sw = f1R((A.w - B.w) * d + (B.n - A.n), d); if (A.w > B.w && f1Eq(r, sw)) return `분수 부분끼리 뺄 수 없는데 큰 분자에서 작은 분자를 뺐어요. 자연수에서 1만큼을 ${f1J(one, "으로")} 바꾸어 빼요.`;
    const nb = f1R((A.w - B.w) * d + (A.n + d - B.n), d); if (f1Eq(r, nb)) return `1만큼을 ${f1J(one, "으로")} 바꾸었으면 자연수 부분은 1 작아져요.`;
  }
  if (op === "-" && !A.hasF && B.hasF && A.w > B.w) { const at = f1R((A.w - B.w) * d + B.n, d); if (f1Eq(r, at)) return `자연수끼리만 빼고 분수 부분은 그대로 붙였어요. 자연수에서 1만큼을 ${f1J(one, "으로")} 바꾸어 빼요.`; }
  return null;
}
/* 읽기 글: [3/7] → 7분의 3, [2 1/4] → 2와 4분의 1 */
function f1Plain(s) {
  return String(s == null ? "" : s).replace(f1Re(), (m, w, n, d) => `${w ? w + "와 " : ""}${d}분의 ${n}`);
}
/*f1-core-end*/

function f1Style() {
  if (document.getElementById("f1-style")) return;
  const s = document.createElement("style"); s.id = "f1-style";
  s.textContent = `
.f1fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.f1fw{margin-right:.1em}
.f1q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.f1q>.f1n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.f1q>.f1d{padding:.05em .14em 0}
.f1frin .f1q{font-size:.92em}
.f1frin .f1n{padding-bottom:.14em}.f1frin .f1d{padding-top:.14em}
.f1inp{display:inline-flex;align-items:center;gap:.15em;vertical-align:middle}
.f1qi{display:inline-flex;flex-direction:column;align-items:stretch;gap:.12em}
.f1bar{display:block;height:.17em;background:var(--ink);border-radius:.1em}
input.f1i,input.f1box{box-sizing:border-box;width:2.3em;height:1.65em;padding:0;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.f1iw{height:2.1em;width:2.1em}
input.f1box.f1wide{width:3.6em}
.f1eq{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .45em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin-top:.25em}
.f1lab{color:var(--pine)}
.f1res{color:var(--ok);font-size:.85em}
.f1cl{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .3em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin:.4em 0;line-height:1.9}
.f1tag{background:var(--pine-soft);color:var(--pine);border-radius:.5em;padding:0 .55em;font-size:.82em}
.f1chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.f1chs .opt{padding:.05em .55em}
.f1stage{margin:.2em 0 .4em}
.f1stage svg{width:100%;height:auto;max-height:66vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.f1tip{font-family:Jua,sans-serif;color:var(--night);margin:.3em 0}
.f1tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.4em 0}
.f1tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em}
.f1tools button.f1on{background:var(--night);color:#fff;border-color:var(--night)}
.f1est{background:var(--ring-soft);border-radius:.6em;padding:.4em .7em;margin-bottom:.4em}
.f1ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.f1grp{border:2px solid var(--line);border-radius:.8em;padding:.4em .7em;margin:.45em 0}
.f1grp .f1gt{font-family:Jua,sans-serif;color:var(--night)}
.f1grp .f1gi{display:inline-flex;flex-wrap:wrap;align-items:center;gap:.3em;margin:.25em 1.2em .25em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08)}
.f1pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:2.6em;margin:.3em 0 .6em}
.f1bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,11em),1fr));gap:.6em}
.f1bin{border:2px dashed var(--line);border-radius:.8em;padding:.4em;min-height:5em;display:flex;flex-direction:column;gap:.35em}
.f1binh{font-family:Jua,sans-serif;background:var(--pine-soft);color:var(--pine);border:0;border-radius:.6em;padding:.3em .6em}
.f1binl{display:flex;flex-wrap:wrap;gap:.35em}
.opt.f1on{border-color:var(--ring);background:var(--ring-soft)}
.f1crd{font-family:Jua,sans-serif}
.f1mt{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.6em 1.4em;align-items:start}
.f1mc{display:flex;flex-direction:column;gap:.5em}
.f1mc .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);text-align:center}
.f1badge{display:inline-grid;place-items:center;min-width:1.5em;height:1.5em;border-radius:50%;color:#fff;font-size:.8em;margin-left:.3em}
.f1cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.f1cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2em;text-align:center}
.f1slot{min-width:1.7em;min-height:1.5em;font-family:Jua,sans-serif;border:2px dashed var(--ring);border-radius:.4em;background:#fff;padding:0 .2em}
.f1lad{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.f1lad>*{display:flex;flex-direction:column;align-items:center;gap:.25em;padding:0 .15em;text-align:center}
.f1lad .opt{font-family:Jua,sans-serif;width:100%;text-align:center;padding:.35em .2em}
.f1house{font-family:Jua,sans-serif;color:var(--pine);font-size:.9em}
.f1lsvg svg{width:100%;height:auto;display:block}
.f1score{width:100%;border-collapse:collapse;font-size:var(--fs-s);margin-top:.4em}
.f1score td,.f1score th{border:1px solid var(--line);padding:.2em .35em;text-align:center}
.f1score th{background:var(--pine-soft);font-weight:400;font-family:Jua,sans-serif}
.f1card2{border:3px solid var(--night);border-radius:var(--r);padding:.5em .8em;background:#fff;display:flex;flex-wrap:wrap;gap:.4em 1.6em;margin:.3em 0}
.f1card2>div{min-width:12em}
.f1card2 b{color:var(--pine);font-family:Jua,sans-serif;font-weight:400}
`;
  document.head.append(s);
}
/* 분수 모양 요소 */
function f1FracEl(w, n, d) {
  return h("span", { class: "f1fr" }, w != null && w !== "" ? h("span", { class: "f1fw" }, String(w)) : null,
    h("span", { class: "f1q" }, h("span", { class: "f1n" }, String(n)), h("span", { class: "f1d" }, String(d))));
}
function f1RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = f1Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(f1FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function f1RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return f1RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(f1RenderText);
}
(function f1Boot() {
  f1Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") f1RenderText(m.target); else m.addedNodes.forEach(f1RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(f1Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
/* 엔진 부품의 '답 따라 쓰기' 글은 읽는 말(7분의 3)로 바꿔 줌 */
function f1A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(f1Plain) }) }); }
const f1Quiz0 = quiz, f1Blanks0 = blanks;
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done(을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return f1Quiz0(body, f1A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return f1Blanks0(body, f1A(api), parts, o); };

function f1Gate(api, ready, msg) {
  return Object.assign({}, api, { done: (ans, m, lv) => ready() ? api.done(ans, m, lv) : api.fail(typeof msg === "function" ? msg() : msg, ans) });
}
const F1_F = ["#F6C08A", "#9CC6EC", "#A9D8A2", "#D7B5E6"], F1_S = ["#D9822B", "#2B7BD6", "#2E8B57", "#8E5BC9"];
/* SVG 글: [분수] 표기를 쌓은 분수로 그림 */
function f1Cw(ch, s) { return /[가-힣]/.test(ch) ? s * .95 : /[0-9]/.test(ch) ? s * .56 : ch === " " ? s * .3 : /[A-Za-z]/.test(ch) ? s * .55 : s * .6; }
function f1Segs(str) {
  const out = []; let last = 0; const re = f1Re(); let m;
  while ((m = re.exec(str))) { if (m.index > last) out.push({ t: str.slice(last, m.index) }); out.push({ w: m[1], n: m[2], d: m[3] }); last = m.index + m[0].length; }
  if (last < str.length) out.push({ t: str.slice(last) });
  return out;
}
function f1SvgLine(str, x, y, size = 24, opt = {}) {
  const g = svgEl("g", { "pointer-events": "none" }), fs = size * .8, fill = opt.fill || INK;
  const tw = t => [...t].reduce((a, c) => a + f1Cw(c, size), 0);
  const fw = s => Math.max(String(s.n).length, String(s.d).length) * fs * .6 + 8;
  const segs = f1Segs(String(str));
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
function f1In(label) {
  const mk = (cls, al) => {
    const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "f1i " + cls, "aria-label": (label ? f1Plain(label) + " " : "") + al });
    i.addEventListener("input", () => { const v = i.value.replace(/[^0-9]/g, "").slice(0, 3); if (v !== i.value) i.value = v; });
    return i;
  };
  const w = mk("f1iw", "자연수 부분"), n = mk("f1in", "분자"), d = mk("f1id", "분모");
  const el = h("span", { class: "f1inp" }, w, h("span", { class: "f1qi" }, n, h("span", { class: "f1bar" }, "​"), d));
  el.get = () => f1Raw(w.value, n.value, d.value);
  el.paint = ok => [w, n, d].forEach(x => { x.style.borderColor = ok == null ? "" : ok ? "var(--ok)" : "var(--no)"; });
  el.text = () => { const r = el.get(); return r.err ? "-" : f1Key(r); };
  el.sig = () => [w, n, d].map(x => x.value).join("/");
  /* 다 썼나요? 분자·분모를 둘 다 썼으면 다 쓴 것. 자연수만 썼으면 이 칸을 떠났을 때(Enter·다른 곳 누르기) 다 쓴 것 — 대분수를 쓰는 중에 확인하지 않게 */
  el.full = () => { const N = n.value.trim(), D = d.value.trim(), W = w.value.trim(); if (N || D) return !!(N && D); return !!W && !el.contains(document.activeElement); };
  return el;
}
/* 입력칸에 autoRun 걸기: 쓸 때·칸을 떠날 때 확인 시계를 다시 맞추고, Enter는 칸을 떠나요 */
function f1Hook(el, auto) {
  el.addEventListener("input", auto); el.addEventListener("change", auto);
  el.addEventListener("focusout", () => setTimeout(auto, 0));
  el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); if (e.target.blur) e.target.blur(); } });
}
function f1Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 3, class: "f1box", "aria-label": "빈칸" });
  i.exp = String(exp); i.full = () => i.value.trim() !== ""; i.sig = () => i.value.trim();
  return i;
}
/* 어림 상자 */
function f1EstBox(api, e, onOk) {
  const row = h("div", { class: "opts" });
  e.o.forEach((c, i) => row.append(h("button", { class: "opt", onclick: ev => {
    [...row.children].forEach(x => x.classList.remove("good", "bad", "on"));
    if (i === e.a) { ev.currentTarget.classList.add("good"); onOk(); api.hint(e.ok || "좋아요. 이제 정확하게 구해 봐요."); }
    else { ev.currentTarget.classList.add("bad"); api.fail((e.why && e.why[i]) || "자연수 부분만 보고 어림해 봐요.", "[어림] " + c); }
  } }, c)));
  return h("div", { class: "f1est" }, h("div", { class: "jua" }, "먼저 어림해요 · " + e.q), row);
}

/* ① 식과 답 (분수 답은 같은 분모의 가분수·대분수·자연수 모두 정답, 약분한 답은 '값은 같아요' 안내)
   items: {q?, e:"[3/8]+[4/8]" (보이는 식) | x (확인용 식), a:"7/8", unit, den, why:{"학생 답":"까닭"}, lab, g:"묶음 제목"}
          | {q, e|x, n: 수} | {q, pick:[…], a: 번호, why:{번호:"까닭"}}  */
function f1Calc(body, api, items, opt = {}) {
  f1Style();
  const rows = []; const wrap = h("div");
  let grp = null, gName = null;
  items.forEach((it, k) => {
    const R = { it }; const ex = it.e || it.x;
    let host;
    if (it.g) {
      if (it.g !== gName) { gName = it.g; grp = h("div", { class: "f1grp" }, h("div", { class: "f1gt" }, it.g)); wrap.append(grp); }
      host = h("span", { class: "f1gi" }); grp.append(host);
    } else {
      gName = null; const box = h("div", { class: "qitem" });
      if (it.q) box.append(h("div", { class: "jua" }, (items.filter(x => !x.g).length > 1 ? (k + 1) + ". " : "") + it.q));
      host = h("div", { class: "f1eq" }); box.append(host); wrap.append(box);
    }
    if (it.pick) {
      R.kind = "pick"; R.sel = null;
      const row = h("span", { class: "opts" });
      it.pick.forEach((o, oi) => row.append(h("button", { class: "opt", onclick: ev => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); R.sel = oi; } }, o)));
      R.row = row; if (it.e) host.append(h("span", {}, it.e)); host.append(row);
    } else if (it.n != null) {
      R.kind = "n";
      if (ex && !it.noEval) { const v = f1Eval(ex); if (!v || v.num !== it.n * v.den) throw new Error(`답 확인 필요: ${ex} = ${it.n}`); }
      R.inp = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "f1box f1wide", "aria-label": f1Plain(it.lab || it.e || it.q || "답") });
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "f1lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    } else {
      R.kind = "f";
      R.t = f1Str(it.a); if (!R.t || R.t.err) throw new Error("답 형식 오류: " + it.a);
      R.den = it.den || f1Den(ex) || f1Den(it.a) || 1;
      if (ex && !it.noEval) { const v = f1Eval(ex); if (!v || !f1Eq(v, R.t)) throw new Error(`답 확인 필요: ${ex} = ${it.a}`); }
      R.inp = f1In(it.lab || it.e || "답");
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "f1lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    }
    R.res = h("span", { class: "f1res hidden" }, "​"); host.append(R.res);
    rows.push(R);
  });
  const ansText = R => {
    const head = f1Plain(R.it.e || R.it.lab || "답");
    if (R.kind === "pick") return `${f1Plain(R.it.q || R.it.e || "")} ${f1Plain(R.it.pick[R.it.a])}`.trim();
    if (R.kind === "n") return `${head} ${R.it.n}${R.it.unit ? " " + R.it.unit : ""}`;
    return `${head} ${f1Plain(f1Tk(R.it.a))}${R.it.unit ? " " + R.it.unit : ""}`;
  };
  api.provide({ words: opt.words || ["분모는 그대로", "분자끼리 계산", "자연수 부분", "분수 부분", "가분수", "대분수"], answers: rows.map(ansText) });
  const judge = () => {
    let bad = null, hint = null; const given = [];
    rows.forEach(R => {
      const it = R.it;
      if (R.kind === "pick") {
        const g = R.sel === it.a; [...R.row.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === R.sel) b.classList.add(g ? "good" : "bad"); });
        given.push(R.sel == null ? "-" : f1Plain(it.pick[R.sel]));
        if (!g && !bad) bad = R.sel == null ? "고르지 않은 문제가 있어요." : (it.why && it.why[R.sel]) || "고른 것을 다시 살펴봐요.";
        return;
      }
      if (R.kind === "n") {
        const s = R.inp.value.replace(/[\s,]/g, ""), g = /^\d+$/.test(s) && +s === it.n;
        R.inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; given.push(s || "-");
        if (!g && !bad) bad = s === "" ? "빈칸에 답을 써요." : (it.why && it.why[s]) || opt.bad || "다시 생각해 봐요.";
        return;
      }
      const r = R.inp.get(), J = f1Judge(r, it.a, R.den); given.push(R.inp.text());
      if (J.code === "ok") { R.inp.paint(true); return; }
      if (J.code === "diffden" || J.code === "zero") { R.inp.paint(null); if (!hint) hint = J.msg; return; }
      R.inp.paint(false);
      if (!bad) bad = (it.why && it.why[f1Key(r)]) || J.msg || f1Diag(it.e || it.x, r) || opt.bad || `${f1J(`[1/${R.den}]`, "이가")} 몇 개인지 세어 다시 계산해 봐요.`;
    });
    if (bad) { api.fail(bad, given.join(" / ")); return false; }
    if (hint) { api.tryOnce(); api.hint(hint); return false; }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + f1Book(num, den); R.res.classList.remove("hidden"); } });
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요! 가분수로 써도, 대분수로 써도 맞아요.");
    return true;
  };
  const ready = () => {
    if (!rows.every(R => R.kind === "pick" ? R.sel != null : R.kind === "n" ? R.inp.value.trim() !== "" : R.inp.full())) return false;
    const m = opt.pre && opt.pre(); if (m) { api.hint(m); return false; }
    return true;
  };
  const auto = autoRun(ready, () => rows.map(R => R.kind === "pick" ? String(R.sel) : R.kind === "n" ? R.inp.value.trim() : R.inp.sig()).join("§"), judge, rows.some(R => R.kind !== "pick") ? 900 : 260);
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
  rows.forEach(R => { if (R.inp) f1Hook(R.inp, auto); });
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return auto;
}

/* ② 차례대로 빈칸 채우기 (계산 과정)
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 수 칸 | {q:[자연수, 분자, 분모]} 각 자리는 고정값·"?답"(칸)·배열(분자에 ["?3","+","?2"]) | {f:"4 2/5"} 분수 입력(값 판정) | {c:[…], a}
   '='가 있고 한글이 없는 줄은 '='로 나눈 값이 모두 같은지 스스로 확인해요. */
function f1Chain(body, api, rows, opt = {}) {
  f1Style();
  const ins = [], chs = [], plains = [];
  const wrap = h("div");
  const ex = v => v == null ? "" : Array.isArray(v) ? v.map(ex).join("") : String(v)[0] === "?" ? String(v).slice(1) : String(v);
  const jsNum = v => ex(v).replace(/−/g, "-");
  const jsStr = s => String(s).replace(f1Re(), (m, w, n, d) => `(${w && w !== "□" ? w : 0}+(${n.replace(/−/g, "-")})/(${d}))`).replace(/−/g, "-").replace(/×/g, "*");
  const cell = v => {
    if (v == null) return null;
    if (Array.isArray(v)) return h("span", { style: "display:inline-flex;align-items:center;gap:.1em" }, v.map(cell));
    if (String(v)[0] === "?") { const b = f1Box(String(v).slice(1)); ins.push(b); return b; }
    return h("span", {}, String(v));
  };
  rows.forEach(row => {
    const parts = Array.isArray(row) ? row : row.p;
    const line = h("div", { class: "f1cl" });
    if (row.t) line.append(h("span", { class: "f1tag" }, row.t));
    let plain = row.t ? row.t + " " : "", js = "", hangul = false;
    parts.forEach(pt => {
      if (typeof pt === "string" || typeof pt === "number") {
        const s = String(pt); line.append(h("span", {}, s)); plain += f1Plain(s) + " "; js += jsStr(s); if (/[가-힣□]/.test(s)) hangul = true;
      } else if (pt.i != null) {
        const b = f1Box(pt.i); ins.push(b); line.append(b); plain += pt.i + " "; js += `(${pt.i})`;
      } else if (pt.q) {
        const [W, N, D] = pt.q;
        line.append(h("span", { class: "f1fr f1frin" }, W != null ? h("span", { class: "f1fw" }, cell(W)) : null, h("span", { class: "f1q" }, h("span", { class: "f1n" }, cell(N)), h("span", { class: "f1d" }, cell(D)))));
        plain += f1Plain(`[${W != null ? ex(W) + " " : ""}${ex(N)}/${ex(D)}]`) + " ";
        js += `(${W != null ? jsNum(W) : 0}+(${jsNum(N)})/(${jsNum(D)}))`;
      } else if (pt.f) {
        const fi = f1In("답"); fi.target = pt.f; fi.den = pt.den || f1Den(pt.f) || 0; ins.push(fi); line.append(fi);
        plain += f1Plain(f1Tk(pt.f)) + " "; const v = f1Str(pt.f); js += `(${v.num}/${v.den})`;
      } else if (pt.c) {
        const C = { a: pt.a, sel: null }; const sp = h("span", { class: "f1chs" });
        pt.c.forEach((o, oi) => sp.append(h("button", { class: "opt", onclick: ev => { [...sp.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); C.sel = oi; } }, o)));
        C.el = sp; chs.push(C); line.append(sp); plain += f1Plain(pt.c[pt.a]) + " "; hangul = true;
      }
    });
    wrap.append(line); plains.push(plain.replace(/\s+/g, " ").trim());
    if (!hangul && js.includes("=")) {
      const vals = js.split("=").filter(s => s.trim()).map(s => { try { return Function(`return (${s})`)(); } catch (e) { return NaN; } });
      if (vals.some(v => !isFinite(v) || Math.abs(v - vals[0]) > 1e-9)) throw new Error("식 확인 필요: " + plain);
    }
  });
  api.provide({ words: opt.words || ["분모는 그대로", "분자끼리", "자연수 부분끼리", "분수 부분끼리", "가분수", "1 = 분모와 분자가 같은 분수"], answers: plains });
  const judge = () => {
    let ok = true, hint = null; const given = [];
    ins.forEach(x => {
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = f1Judge(x.get(), x.target, x.den); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "diffden" || J.code === "zero") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
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
  ins.forEach(x => f1Hook(x, auto));
  body.append(wrap);
  return auto;
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 */
function f1Ask(host, api, ready, msg, opt) {
  const g = f1Gate(api, ready, msg), pre = () => ready() ? null : (typeof msg === "function" ? msg() : msg);
  if (opt.ask) return f1Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad, pre });
  if (opt.askCalc) return f1Calc(host, g, opt.askCalc, { ok: opt.ok, pre });
  api.provide({ words: [], answers: [] });
  /* 물을 것이 없으면 조작을 마치는 대로 저절로 통과 */
  return autoRun(ready, () => "ok", () => { api.tryOnce(); api.done("조작 완료", opt.ok); return true; }, 1200);
}

/* ③ 막대 색칠하기: bars [{name, k, col}]  opt: d, ask(줄)·askCalc, ok */
function f1Bars(body, api, opt) {
  f1Style();
  let kick = () => {};   /* 조작할 때마다 저절로 확인 시계를 다시 맞춰요 */
  const d = opt.d, bars = opt.bars, W = 900, LX = 210, BW = 660, BH = 62, GP = 42, H = bars.length * (BH + GP) + 14;
  const st = bars.map(() => Array(d).fill(false));
  const svg = makeSvg(W, H);
  const cnt = i => st[i].filter(Boolean).length;
  const draw = () => {
    svg.innerHTML = ""; kick();
    bars.forEach((b, i) => {
      const y = 22 + i * (BH + GP), col = b.col != null ? b.col : i, ok = cnt(i) === b.k;
      svg.append(f1SvgLine(b.name, LX - 18, y + BH / 2 - 9, 25, { anchor: "end" }));
      svg.append(f1SvgLine(`색칠 ${cnt(i)}칸`, LX - 18, y + BH / 2 + 22, 17, { anchor: "end", fill: ok ? "#2E8B57" : "#5B6B6B" }));
      for (let c = 0; c < d; c++) {
        const r = svgEl("rect", { x: LX + c * BW / d, y, width: BW / d, height: BH, fill: st[i][c] ? F1_F[col % 4] : "#fff", stroke: INK, "stroke-width": 2, style: "cursor:pointer" });
        r.addEventListener("click", () => { st[i][c] = !st[i][c]; draw(); });
        svg.append(r);
      }
      svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
    });
  };
  draw();
  const ready = () => bars.every((b, i) => cnt(i) === b.k);
  const ask = h("div", { class: "f1ask" });
  body.append(h("p", { class: "f1tip" }, opt.tip || "칸을 누르면 색칠되고, 한 번 더 누르면 지워져요."), h("div", { class: "f1stage" }, svg), ask);
  kick = f1Ask(ask, api, ready, () => { const i = bars.findIndex((b, k) => cnt(k) !== b.k); return `먼저 ‘${f1Plain(bars[i].name)}’ 막대를 알맞게 색칠해요. 지금 ${cnt(i)}칸이에요.`; }, opt);
}

/* ④ 수직선 뛰기: opt d, max, a, b, op("+"|"-"), ask */
function f1Line(body, api, opt) {
  f1Style();
  let kick = () => {};   /* 조작할 때마다 저절로 확인 시계를 다시 맞춰요 */
  const d = opt.d, max = opt.max, A = f1Str(opt.a), B = f1Str(opt.b), sg = opt.op === "-" ? -1 : 1;
  const aT = A.num * d / A.den, bT = B.num * d / B.den, eT = aT + sg * bT, N = max * d;
  if (!Number.isInteger(aT) || !Number.isInteger(bT) || eT < 0 || eT > N || aT > N) throw new Error("수직선 범위 확인 필요");
  const W = 900, H = 290, X0 = 50, X1 = 860, Y = 205, U = (X1 - X0) / N, X = t => X0 + t * U;
  const hops = []; let wrongs = 0;
  const svg = makeSvg(W, H);
  const tip = h("p", { class: "f1tip" });
  const tok = s => f1Tk(f1Form(f1Str(s).num * d / f1Str(s).den, d));
  const arc = (t0, t1, lab, col) => {
    const len = Math.abs(t1 - t0), hh = 34 + 120 * len / N, x0 = X(t0), x1 = X(t1), mx = (x0 + x1) / 2, cy = Y - 2 * hh;
    const g = svgEl("g", { "pointer-events": "none" });
    g.append(svgEl("path", { d: `M${x0},${Y} Q${mx},${cy} ${x1},${Y}`, fill: "none", stroke: col, "stroke-width": 4 }));
    const dx = x1 - mx, dy = Y - cy, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    g.append(svgEl("path", { d: `M${x1},${Y} L${x1 - 18 * ux - 8 * uy},${Y - 18 * uy + 8 * ux} L${x1 - 18 * ux + 8 * uy},${Y - 18 * uy - 8 * ux}Z`, fill: col }));
    g.append(f1SvgLine(lab, mx, Y - hh - 26, 24, { fill: col }));
    return g;
  };
  const draw = () => {
    svg.innerHTML = ""; kick();
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
    svg.append(svgEl("line", { x1: X0 - 20, y1: Y, x2: X1 + 25, y2: Y, stroke: INK, "stroke-width": 3 }));
    for (let t = 0; t <= N; t++) {
      const big = t % d === 0;
      svg.append(svgEl("line", { x1: X(t), y1: Y - (big ? 17 : 10), x2: X(t), y2: Y + (big ? 17 : 10), stroke: INK, "stroke-width": big ? 3 : 1.8 }));
      if (big) svg.append(txt(X(t), Y + 42, String(t / d), 27));
    }
    if (hops[0]) svg.append(arc(0, aT, tok(opt.a), F1_S[1]));
    if (hops[1]) svg.append(arc(aT, eT, tok(opt.b), F1_S[0]));
    hops.forEach((t, k) => svg.append(svgEl("circle", { cx: X(t), cy: Y, r: 9, fill: F1_S[k ? 0 : 1], stroke: "#fff", "stroke-width": 2 })));
    tip.textContent = hops.length === 0 ? `① 0에서 ${tok(opt.a)}만큼 간 곳을 눌러요. 작은 눈금 한 칸은 [1/${d}]이에요.`
      : hops.length === 1 ? `② 거기에서 ${tok(opt.b)}만큼 ${sg > 0 ? "더 간" : "되돌아온"} 곳을 눌러요.`
      : `수직선에서 ${tok(opt.a)} ${sg > 0 ? "+" : "−"} ${tok(opt.b)}의 결과를 찾았어요.`;
  };
  svg.addEventListener("click", ev => {
    if (hops.length >= 2) return;
    const p = svgPt(svg, ev), t = Math.round((p.x - X0) / U);
    if (t < 0 || t > N) return;
    const want = hops.length === 0 ? aT : eT;
    if (t === want) { hops.push(t); draw(); return; }
    wrongs++;
    api.hint(hops.length === 0 ? `그곳은 0에서 [1/${d}]이 ${t}칸인 곳이에요. ${tok(opt.a)}만큼 간 곳을 찾아요.` : `${f1J(tok(opt.b), "은는")} [1/${d}]이 ${bT}칸이에요. ${sg > 0 ? "오른쪽" : "왼쪽"}으로 칸을 세어 봐요.`);
  });
  draw();
  const ask = h("div", { class: "f1ask" });
  body.append(tip, h("div", { class: "f1stage" }, svg), h("div", { class: "f1tools" }, h("button", { onclick: () => { hops.length = 0; draw(); } }, "처음부터")), ask);
  kick = f1Ask(ask, api, () => hops.length === 2, "먼저 수직선에 두 번 뛰어 나타내요.", opt);
}

/* ⑤ 두 대분수를 색칠하고 모으기(분수 부분의 합이 1이 되면 자연수로): opt d, A:{name,v}, B:{name,v}, est, ask */
function f1Fill(body, api, opt) {
  f1Style();
  let kick = () => {};   /* 조작할 때마다 저절로 확인 시계를 다시 맞춰요 */
  const d = opt.d, A = f1Str(opt.A.v), B = f1Str(opt.B.v), aN = A.num * d / A.den, bN = B.num * d / B.den;
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
        const r = svgEl("rect", { x: LX + c * BW / d, y, width: BW / d, height: BH, fill: v ? F1_F[v - 1] : "#fff", stroke: INK, "stroke-width": 2, style: merged ? "" : "cursor:pointer" });
        if (!merged) r.addEventListener("click", () => { cells[k] = cells[k] === cur ? 0 : cur; draw(); stat(); });
        svg.append(r);
      }
      const hl = merged && carry && i === fb;
      svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: hl ? TENT : INK, "stroke-width": hl ? 7 : 4, "pointer-events": "none" }));
      if (merged && full) svg.append(txt(LX - 30, y + BH / 2, "1", 28, { fill: hl ? TENT : INK }));
      if (hl) svg.append(f1SvgLine(`분수 부분끼리 모여 1`, LX + BW + 10, y + BH / 2, 18, { anchor: "start", fill: TENT }));
    }
  };
  const readout = h("p", { class: "f1tip" });
  const stat = () => { readout.textContent = merged ? `모은 결과: ${f1J(String(wA + wB + (carry ? 1 : 0)), "과와")} [${(fA + fB) % d}/${d}]만큼이에요.` : `${opt.A.name} 색칠 ${count(1)}칸, ${opt.B.name} 색칠 ${count(2)}칸 (한 칸은 [1/${d}])`; };
  const bA = h("button", { class: "f1on", onclick: () => { cur = 1; bA.classList.add("f1on"); bB.classList.remove("f1on"); } }, `${opt.A.name} ${f1Tk(opt.A.v)} 색칠하기`);
  const bB = h("button", { onclick: () => { cur = 2; bB.classList.add("f1on"); bA.classList.remove("f1on"); } }, `${opt.B.name} ${f1Tk(opt.B.v)} 색칠하기`);
  bA.style.borderLeft = `8px solid ${F1_F[0]}`; bB.style.borderLeft = `8px solid ${F1_F[1]}`;
  const mergeBtn = h("button", { onclick: () => {
    if (merged) return;
    if (count(1) !== aN || count(2) !== bN) return api.hint(`${f1J(f1Tk(opt.A.v), "은는")} [1/${d}]이 ${aN}칸, ${f1J(f1Tk(opt.B.v), "은는")} ${bN}칸이에요. 색칠한 칸 수를 확인해요.`);
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
  const ask = h("div", { class: "f1ask" });
  if (opt.est) body.append(f1EstBox(api, opt.est, () => { estOk = true; kick(); }));
  body.append(h("div", { class: "f1tools" }, bA, bB, mergeBtn, reset), readout, h("div", { class: "f1stage" }, svg), ask);
  kick = f1Ask(ask, api, () => merged && estOk, () => !estOk ? "먼저 어림해요." : "두 수를 알맞게 색칠한 다음 ‘모으기’를 눌러요.", opt);
}

/* ⑥ 덜어 내기(×표): 자연수 1은 통째로 ×표 하거나 쪼개어 한 칸씩 ×표. opt d, m(빼어지는 수), s(빼는 수), pie, unit, splitLabel, est, ask */
function f1Take(body, api, opt) {
  f1Style();
  let kick = () => {};   /* 조작할 때마다 저절로 확인 시계를 다시 맞춰요 */
  const d = opt.d, M = f1Str(opt.m), Sb = f1Str(opt.s), mN = M.num * d / M.den, sN = Sb.num * d / Sb.den;
  if (sN > mN) throw new Error("덜어 내기 확인 필요");
  const Wn = Math.floor(mN / d), rn = mN % d;
  const units = [];
  for (let i = 0; i < Wn; i++) units.push({ split: false, whole: false, part: d, cells: Array(d).fill(false) });
  if (rn) units.push({ split: true, whole: false, part: rn, cells: Array(d).fill(false), rest: true });
  let estOk = !opt.est;
  const crossed = () => units.reduce((a, u) => a + (u.split ? u.cells.filter(Boolean).length : u.whole ? d : 0), 0);
  const nU = units.length, pie = !!opt.pie, cols = pie ? nU : nU > 5 ? 2 : 1, rowsN = Math.ceil(nU / cols);
  const W = 900, H = pie ? 330 : 24 + rowsN * 70;
  const svg = makeSvg(W, H);
  const X = (g, x1, y1, x2, y2) => g.append(svgEl("line", { x1, y1, x2, y2, stroke: "#C8472E", "stroke-width": 4, "stroke-linecap": "round", "pointer-events": "none" }));
  const splitBtn = (u, x, y, w) => {
    const g = svgEl("g", { style: "cursor:pointer" });
    g.append(svgEl("rect", { x, y, width: w, height: 40, rx: 10, fill: u.split ? "#EEF2F0" : "#FDF1E8", stroke: u.split ? "#B9C4C0" : TENT, "stroke-width": 2 }));
    g.append(f1SvgLine(u.split ? `1 = [${d}/${d}]` : (opt.splitLabel || "1을 쪼개기"), x + w / 2, y + 20, u.split ? 20 : 19, { fill: u.split ? "#5B6B6B" : "#B85A22" }));
    if (!u.split) g.addEventListener("click", () => { u.split = true; u.whole = false; draw(); });
    return g;
  };
  const draw = () => {
    svg.innerHTML = ""; kick();
    units.forEach((u, i) => {
      if (pie) {
        const cx = (W / nU) * (i + .5), cy = 140, R = 105;
        if (!u.split) {
          const c = svgEl("circle", { cx, cy, r: R, fill: "#F7E3C4", stroke: INK, "stroke-width": 4, style: "cursor:pointer" });
          c.addEventListener("click", () => { u.whole = !u.whole; draw(); }); svg.append(c);
          svg.append(txt(cx, cy, "1", 40, { "pointer-events": "none" }));
          if (u.whole) { const g = svgEl("g"); X(g, cx - 60, cy - 60, cx + 60, cy + 60); X(g, cx + 60, cy - 60, cx - 60, cy + 60); svg.append(g); }
        } else {
          for (let c = 0; c < d; c++) {
            const a0 = -Math.PI / 2 + c * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d, live = c < u.part;
            const p = svgEl("path", { d: `M${cx},${cy} L${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 0 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} Z`, fill: live ? (u.cells[c] ? "#E9ECEB" : "#F7E3C4") : "#fff", stroke: INK, "stroke-width": 2.5, style: live ? "cursor:pointer" : "" });
            if (live) p.addEventListener("click", () => { u.cells[c] = !u.cells[c]; draw(); });
            svg.append(p);
            if (u.cells[c]) { const am = (a0 + a1) / 2, mx = cx + R * .62 * Math.cos(am), my = cy + R * .62 * Math.sin(am), g = svgEl("g"); X(g, mx - 14, my - 14, mx + 14, my + 14); X(g, mx + 14, my - 14, mx - 14, my + 14); svg.append(g); }
          }
          svg.append(svgEl("circle", { cx, cy, r: R, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
        }
        svg.append(splitBtn(u, cx - 95, 262, 190));
        return;
      }
      const col = i % cols, row = Math.floor(i / cols), colW = W / cols;
      const BW = cols === 1 ? 560 : 290, x = col * colW + (cols === 1 ? 120 : 18), y = 14 + row * 70, BH = 48;
      if (!u.split) {
        const r = svgEl("rect", { x, y, width: BW, height: BH, fill: "#F7E3C4", stroke: INK, "stroke-width": 4, style: "cursor:pointer" });
        r.addEventListener("click", () => { u.whole = !u.whole; draw(); }); svg.append(r);
        svg.append(txt(x + BW / 2, y + BH / 2, opt.unit ? `1 ${opt.unit}` : "1", 26, { "pointer-events": "none" }));
        if (u.whole) { const g = svgEl("g"); X(g, x + 10, y + 6, x + BW - 10, y + BH - 6); X(g, x + BW - 10, y + 6, x + 10, y + BH - 6); svg.append(g); }
      } else {
        for (let c = 0; c < d; c++) {
          const live = c < u.part, cx = x + c * BW / d;
          const r = svgEl("rect", { x: cx, y, width: BW / d, height: BH, fill: live ? (u.cells[c] ? "#E9ECEB" : "#F7E3C4") : "#fff", stroke: live ? INK : "#B9C4C0", "stroke-width": 2, "stroke-dasharray": live ? "" : "6 5", style: live ? "cursor:pointer" : "" });
          if (live) r.addEventListener("click", () => { u.cells[c] = !u.cells[c]; draw(); });
          svg.append(r);
          if (u.cells[c]) { const g = svgEl("g"), w = BW / d; X(g, cx + w * .2, y + 10, cx + w * .8, y + BH - 10); X(g, cx + w * .8, y + 10, cx + w * .2, y + BH - 10); svg.append(g); }
        }
        svg.append(svgEl("rect", { x, y, width: u.rest ? BW * u.part / d : BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
      }
      if (cols === 1) { if (u.rest) svg.append(f1SvgLine(`[${u.part}/${d}]`, x - 40, y + BH / 2, 22)); else svg.append(splitBtn(u, x + BW + 18, y + 4, 170)); }
      else if (!u.rest) svg.append(splitBtn(u, x + BW + 8, y + 4, 128));
    });
    readout.textContent = `×표 한 양: [1/${d}]이 ${crossed()}개` + (crossed() ? ` (${f1Tk(f1Form(crossed(), d))}${opt.unit ? " " + opt.unit : ""})` : "");
  };
  const readout = h("p", { class: "f1tip" });
  draw();
  const ask = h("div", { class: "f1ask" });
  if (opt.est) body.append(f1EstBox(api, opt.est, () => { estOk = true; kick(); }));
  body.append(h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.1em 0" }, pie ? "통째로 누르면 1에 ×표, ‘자르기’ 단추를 누르면 조각으로 나뉘어 한 조각씩 ×표 할 수 있어요." : `막대(1)를 누르면 통째로 ×표, ‘쪼개기’를 누르면 1이 ${f1J(`[${d}/${d}]`, "으로")} 나뉘어 한 칸씩 ×표 할 수 있어요.`),
    readout, h("div", { class: "f1stage" }, svg),
    h("div", { class: "f1tools" }, h("button", { onclick: () => { units.forEach(u => { u.whole = false; u.cells.fill(false); if (!u.rest) u.split = false; }); draw(); } }, "처음부터")), ask);
  kick = f1Ask(ask, api, () => crossed() === sN && estOk, () => !estOk ? "먼저 어림해요." : `${f1Tk(opt.s)}${opt.unit ? " " + opt.unit : ""}만큼 ×표 해요. 지금은 [1/${d}]이 ${crossed()}개예요. 남은 칸이 모자라면 1을 쪼개 보세요.`, opt);
}

/* ⑦ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function f1Sort(body, api, opt) {
  f1Style();
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "f1pool" }), binsEl = h("div", { class: "f1bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "f1binl" }); binsEl.append(h("div", { class: "f1bin", onclick: e => { if (e.target.closest(".f1crd")) return; put(bi); } }, h("button", { class: "f1binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt f1crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  let auto = () => {};
  function draw() { els.forEach((el, ci) => { el.classList.toggle("f1on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); auto(); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => f1Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "f1tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "카드를 모두 넣으면 저절로 확인해요."));
  auto = autoRun(() => where.every(w => w >= 0), () => where.join(","), () => {
    let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
    const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
    if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok); return true;
  }, 1200);
}

/* ⑧ 관계있는 것끼리 잇기: left [{t,k}], right [{t,k|null}] (값을 계산해 짝이 맞는지 스스로 확인) */
function f1Match(body, api, opt) {
  f1Style();
  const L = opt.left, R = opt.right, pair = L.map(() => -1); let sel = null;
  L.forEach(l => { const v = f1Eval(l.t); R.forEach(r => { const w = f1Eval(r.t); if (!v || !w || f1Eq(v, w) !== (r.k === l.k)) throw new Error("잇기 확인 필요: " + l.t + " / " + r.t); }); });
  const COL = ["#2B7BD6", "#D9822B", "#2E8B57"];
  const lb = L.map((l, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; draw(); } }, l.t));
  const rb = R.map((r, j) => h("button", { class: "opt", onclick: () => { if (sel == null) return api.hint("먼저 왼쪽 식을 눌러요."); pair[sel] = pair[sel] === j ? -1 : j; sel = null; draw(); } }, r.t));
  const badge = (i) => h("span", { class: "f1badge", style: `background:${COL[i % 3]}` }, String(i + 1));
  let auto = () => {};
  function draw() {
    auto();
    lb.forEach((b, i) => { b.classList.toggle("f1on", sel === i); b.classList.remove("good", "bad"); [...b.querySelectorAll(".f1badge")].forEach(x => x.remove()); b.append(badge(i)); });
    rb.forEach((b, j) => { b.classList.remove("good", "bad"); [...b.querySelectorAll(".f1badge")].forEach(x => x.remove()); pair.forEach((p, i) => { if (p === j) b.append(badge(i)); }); });
  }
  draw();
  api.provide({ words: [], answers: L.map(l => `${f1Plain(l.t)} — ${f1Plain(R.find(r => r.k === l.k).t)}`) });
  body.append(h("p", { class: "f1tip" }, "왼쪽 식을 누르고, 값이 같은 오른쪽 식을 눌러 이어요. 짝이 없는 식도 있어요."),
    h("div", { class: "f1mt" }, h("div", { class: "f1mc" }, lb), h("div", { class: "f1mc" }, rb)),
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "왼쪽 식을 모두 이으면 저절로 확인해요."));
  auto = autoRun(() => pair.every(p => p >= 0), () => pair.join(","), () => {
    let ok = true; pair.forEach((p, i) => { const g = R[p].k === L[i].k; lb[i].classList.add(g ? "good" : "bad"); if (!g) ok = false; });
    const given = pair.map((p, i) => `${i + 1}-${p + 1}`).join(", ");
    if (!ok) { api.fail("값을 계산해 보고 다시 이어요. 가분수와 대분수 중 편리한 꼴로 바꾸어 비교해요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok || "값이 같은 식끼리 잘 이었어요!"); return true;
  }, 1200);
}

/* ⑨ 수 카드로 대분수 만들기: cards, den — 가장 큰 대분수와 가장 작은 대분수, 두 수의 합 */
function f1Cards(body, api, opt) {
  f1Style();
  const cards = opt.cards, den = opt.den;
  let best = null, worst = null;
  cards.forEach(a => cards.forEach(b => { if (a === b || b >= den || a < 1) return; const v = a * den + b; if (!best || v > best.v) best = { w: a, n: b, v }; if (!worst || v < worst.v) worst = { w: a, n: b, v }; }));
  const slots = [{ w: null, n: null }, { w: null, n: null }]; let sel = null;
  const cardRow = h("div", { class: "f1cards" });
  const cBtns = cards.map((c, i) => h("button", { class: "opt", onclick: () => { sel = sel === i ? null : i; cBtns.forEach((b, k) => b.classList.toggle("f1on", sel === k)); } }, String(c)));
  cardRow.append(...cBtns);
  const slotBtn = (s, key) => { const b = h("button", { class: "f1slot", onclick: () => { s[key] = sel == null ? null : cards[sel]; sel = null; cBtns.forEach(x => x.classList.remove("f1on")); paint(); } }, "​"); b.s = s; b.key = key; return b; };
  const sb = [];
  const mixed = s => { const w = slotBtn(s, "w"), n = slotBtn(s, "n"); sb.push(w, n); return h("span", { class: "f1fr f1frin" }, h("span", { class: "f1fw" }, w), h("span", { class: "f1q" }, h("span", { class: "f1n" }, n), h("span", { class: "f1d" }, String(den)))); };
  let auto = () => {};
  const paint = () => { sb.forEach(b => { b.textContent = b.s[b.key] == null ? "​" : String(b.s[b.key]); }); auto(); };
  const sum = f1In("두 수의 합");
  const total = best.v + worst.v;
  api.provide({ words: ["가장 큰 대분수", "가장 작은 대분수"], answers: [`가장 큰 대분수 ${f1Plain(`[${best.w} ${best.n}/${den}]`)}`, `가장 작은 대분수 ${f1Plain(`[${worst.w} ${worst.n}/${den}]`)}`, `합 ${f1Plain(f1Tk(f1Form(total, den)))}`] });
  body.append(h("p", { class: "f1tip" }, "수 카드를 누른 다음 빈칸을 눌러 넣어요. 빈칸을 다시 누르면 지워져요."), cardRow,
    h("div", { class: "f1cl" }, h("span", { class: "f1tag" }, "가장 큰 대분수"), mixed(slots[0])),
    h("div", { class: "f1cl" }, h("span", { class: "f1tag" }, "가장 작은 대분수"), mixed(slots[1])),
    h("div", { class: "f1cl" }, h("span", {}, "두 수의 합 ="), sum),
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "빈칸과 합을 모두 쓰면 저절로 확인해요."));
  const judge = () => {
      const [B, S] = slots, given = `${B.w} ${B.n}/${den}, ${S.w} ${S.n}/${den}, 합 ${sum.text()}`;
      if (B.w === B.n || S.w === S.n) { api.fail("한 대분수에는 서로 다른 카드 2장을 써요.", given); return false; }
      if (B.w !== best.w || B.n !== best.n) { api.fail("가장 큰 대분수는 자연수 부분에 가장 큰 수를, 분자에 그다음으로 큰 수를 놓아요.", given); return false; }
      if (S.w !== worst.w || S.n !== worst.n) { api.fail("가장 작은 대분수는 자연수 부분에 가장 작은 수를, 분자에 그다음으로 작은 수를 놓아요.", given); return false; }
      const J = f1Judge(sum.get(), f1Form(total, den), den);
      if (J.code === "diffden" || J.code === "zero") { sum.paint(null); api.hint(J.msg); return false; }
      if (J.code !== "ok") { sum.paint(false); api.fail(J.msg || f1Diag(`[${best.w} ${best.n}/${den}]+[${worst.w} ${worst.n}/${den}]`, sum.get()) || "자연수 부분끼리, 분수 부분끼리 더해 봐요.", given); return false; }
      sum.paint(true); api.tryOnce();
      api.done(given, opt.ok || `[${best.w} ${best.n}/${den}]+[${worst.w} ${worst.n}/${den}] = ${f1Book(total, den)}. 수 카드로 만든 대분수를 더했어요!`);
      return true;
  };
  auto = autoRun(() => slots.every(x => x.w != null && x.n != null) && sum.full(), () => slots.map(x => x.w + "," + x.n).join("|") + "#" + sum.sig(), judge, 900);
  f1Hook(sum, auto);
}

/* ⑩ 사다리 타기: items [식], perm[i] = i번째 식이 도착하는 집 번호(0부터) */
function f1Ladder(body, api, opt) {
  f1Style();
  const items = opt.items, n = items.length, perm = opt.perm;
  const arr = items.map((_, i) => i), core = [];
  for (let pass = 0; pass < n; pass++) for (let c = 0; c < n - 1; c++) if (perm[arr[c]] > perm[arr[c + 1]]) { [arr[c], arr[c + 1]] = [arr[c + 1], arr[c]]; core.push(c); }
  const rungs = [2, 2].concat(core.slice(0, 1), [0, 0], core.slice(1), [2, 2]);   // 같은 가로줄 두 개는 서로 지워져요
  const walk = i => { let c = i; const pts = []; rungs.forEach((r, k) => { if (c === r || c === r + 1) { pts.push([c, k]); c = c === r ? r + 1 : r; pts.push([c, k]); } }); return { end: c, pts }; };
  items.forEach((e, i) => { if (walk(i).end !== perm[i]) throw new Error("사다리 확인 필요"); });
  const vals = items.map(e => { const v = f1Eval(e); if (!v) throw new Error("사다리 식 확인 필요: " + e); return v; });
  const dens = items.map(e => f1Den(e));
  const W = 800, H = 380, CX = c => 100 + 200 * c, RY = k => 30 + (k + .5) * (320 / rungs.length);
  const svg = makeSvg(W, H); const traced = items.map(() => false);
  const base = () => {
    svg.innerHTML = "";
    for (let c = 0; c < n; c++) svg.append(svgEl("line", { x1: CX(c), y1: 0, x2: CX(c), y2: H, stroke: INK, "stroke-width": 5 }));
    rungs.forEach((r, k) => svg.append(svgEl("line", { x1: CX(r), y1: RY(k), x2: CX(r + 1), y2: RY(k), stroke: INK, "stroke-width": 5 })));
    traced.forEach((t, i) => { if (t) svg.append(pathEl(i, false)); });
  };
  const pathEl = (i, anim) => {
    const w = walk(i); let d = `M${CX(i)},0`; w.pts.forEach(([c, k]) => { d += ` L${CX(c)},${RY(k)}`; }); d += ` L${CX(w.end)},${H}`;
    const p = svgEl("path", { d, fill: "none", stroke: F1_S[i], "stroke-width": 8, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: .8 });
    if (anim) { p.setAttribute("stroke-dasharray", "3000"); p.setAttribute("stroke-dashoffset", "3000"); p.style.transition = "stroke-dashoffset 1.4s linear"; requestAnimationFrame(() => requestAnimationFrame(() => { p.setAttribute("stroke-dashoffset", "0"); })); }
    return p;
  };
  const top = h("div", { class: "f1lad" }), bot = h("div", { class: "f1lad" });
  items.forEach((e, i) => top.append(h("div", {}, h("button", { class: "opt", style: `border-color:${F1_S[i]}`, onclick: () => { traced[i] = true; base(); svg.lastChild && svg.removeChild(svg.lastChild); svg.append(pathEl(i, true)); marks[perm[i]].textContent = `${i + 1}번 식이 왔어요`; } }, `${i + 1}. ${e}`))));
  const marks = [], ins = [];
  for (let j = 0; j < n; j++) { const mk = h("span", { class: "f1house" }, `${j + 1}번 집`), inp = f1In(`${j + 1}번 집`); marks.push(mk); ins.push(inp); bot.append(h("div", {}, mk, inp)); }
  base();
  api.provide({ words: [], answers: items.map((e, i) => `${perm[i] + 1}번 집: ${f1Plain(e)} = ${f1Plain(f1Tk(f1Form(vals[i].num * dens[i] / vals[i].den, dens[i])))}`) });
  body.append(h("p", { class: "f1tip" }, "위의 식을 누르면 사다리를 타고 내려가요. 도착한 집에 그 식의 합 또는 차를 써요."), top, h("div", { class: "f1lsvg" }, svg), bot,
    h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, "네 식을 모두 타 보고 집마다 값을 쓰면 저절로 확인해요."));
  const judge = () => {
      let bad = null, hint = null; const given = [];
      for (let j = 0; j < n; j++) {
        const i = perm.indexOf(j), v = vals[i], den = dens[i], r = ins[j].get(), J = f1Judge(r, f1Form(v.num * den / v.den, den), den); given.push(ins[j].text());
        if (J.code === "ok") ins[j].paint(true);
        else if (J.code === "diffden" || J.code === "zero") { ins[j].paint(null); hint = hint || J.msg; }
        else { ins[j].paint(false); bad = bad || J.msg || f1Diag(items[i], r) || `${j + 1}번 집의 값을 다시 계산해 봐요.`; }
      }
      if (bad) { api.fail(bad, given.join(" / ")); return false; }
      if (hint) { api.tryOnce(); api.hint(hint); return false; }
      api.tryOnce(); api.done(given.join(" / "), opt.ok || "사다리를 타고 합과 차를 모두 구했어요!"); return true;
  };
  const auto = autoRun(() => { const full = ins.every(x => x.full()); if (full && traced.some(t => !t)) api.hint("네 식을 모두 눌러 사다리를 타 보세요."); return full && traced.every(t => t); }, () => ins.map(x => x.sig()).join("§") + "#" + traced.join(","), judge, 900);
  ins.forEach(x => f1Hook(x, auto));
  top.addEventListener("click", () => auto());
}

/* ⑫ 말 튕기기 놀이 (놀이를 더하다) — 말 값과 처음 수는 지도서에 없어 새로 설계:
   처음 수 − (가장 큰 말 세 개의 합) > 0 이어서 어떻게 놀아도 값이 0보다 작아지지 않아요(아래 f1SetOk가 확인). */
const F1_SETS = {
  8: { d: 8, start: 3, pcs: ["1/8", "2/8", "3/8", "4/8", "5/8", "7/8"], kind: "분모가 8인 진분수" },
  6: { d: 6, start: 5, pcs: ["3/6", "5/6", "7/6", "1 2/6", "1 4/6", "11/6"], kind: "분모가 6인 진분수·가분수·대분수" },
  4: { d: 4, start: 7, pcs: ["1/4", "3/4", "6/4", "1 1/4", "2 3/4", "9/4"], kind: "분모가 4인 진분수·가분수·대분수" }
};
function f1SetOk(S) {
  const v = S.pcs.map(p => { const r = f1Str(p); return r && !r.err && r.den === S.d || (r && !r.hasF) ? r.num * S.d / r.den : NaN; });
  if (v.length !== 6 || v.some(x => !Number.isInteger(x) || x <= 0)) return false;
  const s = v.slice().sort((a, b) => b - a);
  return S.start * S.d - s[0] - s[1] - s[2] > 0;
}
function f1Game(body, api, opt) {
  f1Style();
  const sets = (opt.sets || [8]).map(k => F1_SETS[k]);
  sets.forEach(S => { if (!f1SetOk(S)) throw new Error("놀이 말 설계 확인 필요: 분모 " + S.d); });
  const W = 900, H = 560, EDGE = 64, NEAR = 520, R = 38, LX = [330, 570], NAMES = opt.names || ["나", "로봇"];
  const svg = makeSvg(W, H);
  const info = h("p", { class: "f1tip" }), ctrl = h("div", { class: "f1tools" }), score = h("div");
  let S = sets.length === 1 ? sets[0] : null, G = null, pull = 0, pull0 = null;
  const U = (u) => f1Tk(f1Form(u, S.d));
  const pieceU = p => { const r = f1Str(p); return r.num * S.d / r.den; };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const newGame = () => { G = { bag: shuffle(S.pcs.slice()), vals: [S.start * S.d, S.start * S.d], round: 0, phase: "draw", pos: null, log: [], busy: false }; render(); };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
    svg.append(svgEl("rect", { x: 170, y: EDGE, width: 560, height: NEAR - EDGE, rx: 8, fill: "#EBD3AE", stroke: "#A47A45", "stroke-width": 5 }));
    svg.append(svgEl("line", { x1: 170, y1: EDGE, x2: 730, y2: EDGE, stroke: "#C8472E", "stroke-width": 6 }));
    svg.append(txt(450, EDGE - 26, "도착선 (책상 끝 · 넘으면 떨어져요)", 21, { fill: "#C8472E" }));
    svg.append(svgEl("line", { x1: 170, y1: NEAR, x2: 730, y2: NEAR, stroke: "#2F6B57", "stroke-width": 6 }));
    svg.append(txt(450, NEAR + 24, "출발선", 21, { fill: "#2F6B57" }));
    [0, 1].forEach(k => { svg.append(svgEl("line", { x1: LX[k], y1: EDGE + 6, x2: LX[k], y2: NEAR - 6, stroke: "#C9A777", "stroke-width": 2, "stroke-dasharray": "8 8" })); svg.append(txt(LX[k] + (k ? 120 : -120), NEAR - 30, NAMES[k], 24, { fill: F1_S[k ? 0 : 1] })); });
    if (G && G.pos) G.pos.forEach((p, k) => {
      const y = p.fell ? EDGE - 6 : p.y, col = F1_S[k ? 0 : 1];
      const g = svgEl("g", { opacity: p.fell ? .45 : 1 });
      g.append(svgEl("circle", { cx: LX[k], cy: y, r: R, fill: "#fff", stroke: col, "stroke-width": 6 }));
      g.append(f1SvgLine(f1Tk(p.p), LX[k], y, 25, { fill: col }));
      svg.append(g);
      if (p.fell) svg.append(txt(LX[k], EDGE + 52, "떨어졌어요!", 22, { fill: "#C8472E" }));
      if (k === 0 && pull > 0) { svg.append(svgEl("line", { x1: LX[0], y1: y, x2: LX[0], y2: y + pull, stroke: "#1F2F4A", "stroke-width": 4, "stroke-dasharray": "6 5" })); svg.append(svgEl("path", { d: `M${LX[0]},${y - R - 34} l-14,22 h28z`, fill: "#1F2F4A" })); }
    });
  };
  const anim = (k, D, cb) => {
    const p = G.pos[k], y0 = p.y, y1 = y0 - D, t0 = performance.now(), T = 750;
    const step = now => { const t = Math.min(1, (now - t0) / T), e = 1 - Math.pow(1 - t, 3); p.y = y0 - D * e; if (p.y < EDGE - 10) { p.fell = true; } draw(); if (t < 1 && !p.fell) requestAnimationFrame(step); else { if (y1 < EDGE) p.fell = true; draw(); cb(); } };
    requestAnimationFrame(step);
  };
  const launch = pw => {
    if (G.phase !== "flick" || G.busy) return; G.busy = true; pull = 0;
    const D = pw * 2.9 * (.9 + Math.random() * .2);
    anim(0, D, () => setTimeout(() => anim(1, 170 + Math.random() * 270, () => { G.busy = false; compare(); }), 300));
  };
  const compare = () => {
    const dist = G.pos.map(p => p.fell ? Infinity : p.y - EDGE);
    if (dist[0] !== Infinity && Math.abs(dist[0] - dist[1]) < 1) { info.textContent = "두 말이 도착선에서 같은 거리예요! 같은 말로 다시 튕겨요."; G.pos.forEach(p => { p.y = NEAR - R - 4; p.fell = false; }); draw(); return; }
    G.op = dist[0] === Infinity && dist[1] === Infinity ? [-1, -1] : dist[0] < dist[1] ? [1, -1] : [-1, 1];
    G.phase = "calc"; render();
  };
  const exprOf = k => `${U(G.vals[k])} ${G.op[k] > 0 ? "+" : "−"} ${f1Tk(G.pos[k].p)}`;
  const render = () => {
    ctrl.innerHTML = ""; draw();
    if (!S) {
      info.textContent = "어느 주머니로 놀이할까요?";
      sets.forEach(s => ctrl.append(h("button", { onclick: () => { S = s; newGame(); } }, `분모 ${s.d} 주머니 (처음 수 ${s.start})`)));
      score.innerHTML = ""; return;
    }
    const sc = h("table", { class: "f1score" }, h("tr", {}, h("th", {}, "회"), h("th", {}, "나"), h("th", {}, "로봇")), h("tr", {}, h("td", {}, "처음 수"), h("td", {}, String(S.start)), h("td", {}, String(S.start))));
    G.log.forEach((L, i) => sc.append(h("tr", {}, h("td", {}, `${i + 1}회`), h("td", {}, L[0]), h("td", {}, L[1]))));
    score.innerHTML = ""; score.append(h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.2em 0" }, `주머니: ${S.kind} 6개 — ${S.pcs.map(f1Tk).join(", ")}`), sc);
    if (G.phase === "draw") {
      info.textContent = `${G.round + 1}회: 주머니에서 말을 꺼내요. (남은 말 ${G.bag.length}개)`;
      ctrl.append(h("button", { class: "f1on", onclick: () => { const me = G.bag.pop(), bot = G.bag.pop(); G.pos = [{ p: me, y: NEAR - R - 4, fell: false }, { p: bot, y: NEAR - R - 4, fell: false }]; G.phase = "flick"; render(); } }, "주머니에서 말 꺼내기"));
    } else if (G.phase === "flick") {
      info.textContent = `내 말은 ${f1Tk(G.pos[0].p)}, 로봇의 말은 ${f1J(f1Tk(G.pos[1].p), "이에요")}. 내 말을 아래로 당겼다 놓거나, 힘을 골라 ‘튕기기’를 눌러요.`;
      const rng = h("input", { type: "range", min: 1, max: 10, step: 1, value: 6, "aria-label": "튕기는 힘", style: "width:12em" });
      ctrl.append(h("span", {}, "힘"), rng, h("button", { class: "f1on", onclick: () => launch(+rng.value * 15) }, "튕기기"));
    } else if (G.phase === "calc") {
      const why = G.pos[0].fell ? "내 말이 책상 아래로 떨어졌으니" : G.op[0] > 0 ? "내 말이 도착선에 더 가까우니" : "내 말이 도착선에서 더 머니";
      info.textContent = `${why} ${f1J(f1Tk(G.pos[0].p), "을를")} ${G.op[0] > 0 ? "더해요" : "빼요"}. 로봇은 ${G.op[1] > 0 ? "더해요" : "빼요"}.`;
      const inp = f1In("내 값");
      ctrl.append(h("span", { class: "jua" }, exprOf(0) + " ="), inp);
      const calcAuto = autoRun(() => G.phase === "calc" && inp.full(), () => inp.sig(), () => {
        const want = G.vals[0] + G.op[0] * pieceU(G.pos[0].p), r = inp.get(), J = f1Judge(r, f1Form(want, S.d), S.d);
        if (J.code === "diffden" || J.code === "zero") { api.hint(J.msg); return false; }
        if (J.code !== "ok") { inp.paint(false); api.fail(J.msg || f1Diag(exprOf(0).replace(/\s/g, ""), r) || `${f1J(`[1/${S.d}]`, "이가")} 몇 개인지 세어 다시 계산해 봐요.`, `${exprOf(0)} = ${inp.text()}`); return false; }
        G.log.push([`${exprOf(0)} = ${U(want)}`, ""]); G.vals[0] = want;
        const bw = G.vals[1] + G.op[1] * pieceU(G.pos[1].p); G.botWant = bw;
        G.botSay = Math.random() < .35 ? (bw > 1 && Math.random() < .5 ? bw - 1 : bw + 1) : bw;
        G.phase = "bot"; api.hint(`맞았어요! 내 값은 ${f1J(U(want), "이에요")}.`); render(); return true;
      }, 900);
      f1Hook(inp, calcAuto);
    } else if (G.phase === "bot") {
      info.textContent = `로봇: “${exprOf(1)} = ${U(G.botSay)}” 로봇의 계산이 맞는지 확인해 주세요.`;
      const judge = sayRight => {
        const right = G.botSay === G.botWant;
        if (sayRight !== right) return api.fail(right ? "로봇의 계산은 맞았어요. 다시 계산해 봐요." : "로봇의 계산을 다시 해 봐요. 로봇이 틀렸어요.", `로봇 ${U(G.botSay)} 판단 ${sayRight ? "맞아요" : "틀렸어요"}`);
        G.log[G.log.length - 1][1] = `${exprOf(1)} = ${U(G.botWant)}`; G.vals[1] = G.botWant;
        api.hint(right ? "로봇의 계산이 맞았어요." : `잘 찾았어요! 바른 값은 ${f1J(U(G.botWant), "이에요")}. 로봇이 고쳤어요.`);
        G.round++; G.pos = null; G.phase = G.round >= 3 ? "final" : "draw"; render();
      };
      ctrl.append(h("button", { onclick: () => judge(true) }, "맞아요"), h("button", { onclick: () => judge(false) }, "틀렸어요"));
    } else if (G.phase === "final") {
      info.textContent = `세 번 계산했어요. 나 ${U(G.vals[0])}, 로봇 ${U(G.vals[1])}. 누가 이겼나요?`;
      const win = G.vals[0] > G.vals[1] ? 0 : G.vals[0] < G.vals[1] ? 1 : 2;
      ["내가 이겼어요", "로봇이 이겼어요", "비겼어요"].forEach((t, i) => ctrl.append(h("button", { onclick: () => {
        if (i !== win) return api.fail("마지막 값의 크기를 비교해 봐요. 분모가 같으면 자연수 부분, 분자 차례로 비교해요.", t);
        G.phase = "end"; render();
        api.done(G.log.map(L => L.join(" | ")).join(" / ") + ` → ${t}`, `${t}! 분수를 더하고 빼며 놀이를 끝까지 했어요.`);
      } }, t)));
    } else if (G.phase === "end") {
      info.textContent = `놀이 끝! 나 ${U(G.vals[0])}, 로봇 ${U(G.vals[1])}.`;
      ctrl.append(h("button", { class: "f1on", onclick: () => { if (sets.length > 1) S = null; S ? newGame() : (G = null, render()); } }, "한 판 더"));
    }
  };
  dragOn(svg, p => { if (!G || G.phase !== "flick" || G.busy) return false; if (Math.hypot(p.x - LX[0], p.y - G.pos[0].y) > 70) return false; pull0 = p; pull = 0; return true; },
    p => { pull = Math.max(0, Math.min(160, p.y - pull0.y)); draw(); },
    () => { const pw = pull; pull = 0; if (pw > 8) launch(pw); else draw(); });
  if (S) newGame(); else render();
  api.provide({ words: ["도착선에 더 가까우면 더하기", "더 멀거나 떨어지면 빼기"], answers: [] });
  body.append(info, h("div", { class: "f1stage" }, svg), ctrl, score);
}
/* ===== 이야기 버전 그림 (앞글자 f1s) ===== */
(function () {
  if (document.getElementById("f1s-style")) return;
  const s = document.createElement("style"); s.id = "f1s-style";
  s.textContent = `
.f1snote{border:3px dashed #E2A65C;border-radius:var(--r);background:#FFF8EE;padding:.5em .9em;margin:.3em 0 .5em;font-family:Jua,sans-serif;line-height:1.9}
.f1snote b{color:#B4610F;font-weight:400}
.f1snote ul{margin:.1em 0 0 1.1em;padding:0}
`;
  document.head.append(s);
})();
/* 나눔 파티 요리법 쪽지 */
function f1sNote(title, lines) {
  f1Style();
  return h("div", { class: "f1snote" }, h("b", {}, title), h("ul", {}, ...lines.map(t => h("li", {}, t))));
}
/* 생각을 더하다: 파티 음료 재료 카드 (모든 값은 아래 F1S_DRINK에서 계산해 써요) */
const F1S_DRINK = { straw: "1 3/4", choco: "2 2/5", milk: 8, sHave: 6, cHave: 10 };
function f1sRecipe() {
  f1Style();
  return h("div", { class: "f1card2" },
    h("div", {}, h("b", {}, "필요한 재료 (1잔)"), h("div", {}, `딸기 라테: 우유 1컵 + 딸기청 [${F1S_DRINK.straw}] 큰술`), h("div", {}, `초코 우유: 우유 1컵 + 초코 시럽 [${F1S_DRINK.choco}] 큰술`)),
    h("div", {}, h("b", {}, "가지고 있는 재료"), h("div", {}, `우유 ${F1S_DRINK.milk}컵, 딸기청 ${F1S_DRINK.sHave} 큰술, 초코 시럽 ${F1S_DRINK.cHave} 큰술`)),
    h("div", {}, h("b", {}, "주문서"), h("div", {}, "① 딸기 라테 2잔"), h("div", {}, "② 딸기 라테 1잔, 초코 우유 1잔"), h("div", {}, "③ 초코 우유 2잔")));
}
/* 확인 도전: 장 보러 간 길 지도 */
function f1sMap() {
  f1Style();
  const svg = makeSvg(900, 330);
  const P = { school: [130, 250], mart: [450, 80], park: [770, 250] };
  const road = (a, b, lab, ly) => { svg.append(svgEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#C9A777", "stroke-width": 16, "stroke-linecap": "round" })); svg.append(f1SvgLine(lab, (a[0] + b[0]) / 2, ly, 26, { fill: "#1F2F4A" })); };
  road(P.school, P.mart, "[1 2/6] km", 140); road(P.mart, P.park, "[1 4/6] km", 140); road(P.school, P.park, "[2 5/6] km", 290);
  [["school", "학교", "#9CC6EC"], ["mart", "마트", "#F6C08A"], ["park", "공원", "#A9D8A2"]].forEach(([k, n, c]) => {
    const [x, y] = P[k]; svg.append(svgEl("rect", { x: x - 62, y: y - 28, width: 124, height: 56, rx: 12, fill: c, stroke: INK, "stroke-width": 3 }), txt(x, y, n, 22));
  });
  return h("div", { class: "f1stage", style: "max-width:44em" }, svg);
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 요리 교실", lines: [
  "무지개초등학교 4학년 3반은 학기 말 ‘나눔 파티’를 위해 교실에서 요리 교실을 열었어요. 요리 반장 하은, 준서, 서아, 도윤, 지호가 모둠을 나누어 준비해요.",
  "계량컵으로 주스를 붓고, 쿠키 반죽을 모으고, 리본을 잘라 선물 상자를 꾸미고, 밀가루를 덜고, 감자전을 나누어 먹으며 분모가 같은 분수를 더하고 빼요.",
  "마지막에는 파티 음료를 준비하고, 파티 놀이를 하고, 요리 발표회에서 배운 것을 정리해요."],
  one: "우리 반 요리 교실 · 요리 재료의 양을 분수로 더하고 빼며, 분모는 그대로 두고 단위분수의 개수를 계산해요." };
const UNIT_KEYWORDS = ["단위분수", "분모", "분자", "진분수", "가분수", "대분수", "분모는 그대로", "분자끼리 더하기", "분자끼리 빼기", "자연수 부분끼리", "분수 부분끼리", "가분수로 바꾸어 계산", "1 = 분모와 분자가 같은 분수", "1만큼을 분수로 바꾸기", "어림하기"];

const LESSONS = [
{
  id: "s1", no: 1, title: "우리 반 요리 교실을 열어요", soop: "개념 찾기(S)",
  question: "요리를 할 때 분수를 더하거나 빼야 하는 때는 언제일까요?",
  summary: "요리법에는 [3/4] 컵, [1 2/4] 큰술처럼 분수가 많이 나와요. 재료를 모두 얼마 쓰는지 구할 때는 더하고, 남은 양이나 차를 구할 때는 빼요. 3학년 때 배운 분수, 진분수·가분수·대분수, 가분수와 대분수 바꾸기를 떠올려 두면 이 단원을 잘 배울 수 있어요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "다음 주 금요일에 우리 반 ‘나눔 파티’가 열려요. 요리 반장 하은이가 가져온 요리법 쪽지를 보고, 세 칸에 써서 붙여요.", hints: ["쪽지에서 분수가 쓰인 곳을 찾아봐요.", "두 재료를 함께 쓰거나, 쓰고 남은 양을 셀 때를 떠올려요."],
      render: (b, a) => { b.append(f1sNote("🍪 나눔 파티 요리법 쪽지", ["과일 펀치: 포도 주스 [2/5] L, 사과 주스 [1/5] L", "쿠키: 초코 반죽 [2 1/5] kg, 버터 반죽 [1 3/5] kg", "팬케이크: 밀가루 [3 4/5] 컵 중에서 [1 2/5] 컵 쓰기", "선물 상자: 리본 1 m를 8칸으로 나누어 쓰기"]));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "쪽지에 ~이 보여요", hint: "요리법 쪽지에서 보이는 것", ex: ["포도 주스 [2/5] L처럼 분수로 쓴 양이 보여요.", "[2 1/5] kg처럼 자연수와 분수가 함께 있는 수가 보여요."] },
          { t: "생각해요", e: "💭", ph: "~할 때 분수를 더하거나 빼야 할 것 같아요", hint: "분수를 더하거나 뺄 일", ex: ["펀치에 넣은 주스를 모두 구하려면 [2/5]와 [1/5]을 더해야 할 것 같아요.", "밀가루를 쓰고 남은 양은 [3 4/5]에서 [1 2/5]를 빼서 구할 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 계산할까?", hint: "분수 계산에 대해 궁금한 것", ex: ["분수끼리 더할 때 분모도 더해야 할까?", "[2 1/5]과 [1 3/5]처럼 자연수가 있는 분수는 어떻게 더할까?"] }],
          { ok: "요리 교실에는 분수가 가득해요! 이 단원에서 분수를 더하고 빼는 방법을 하나씩 알아봐요." }); } },
    { name: "그려 보기 — 계량컵에 분수 나타내기", inst: "준서가 계량컵 1컵을 똑같이 6칸으로 나누어 우유를 [4/6] 컵 따랐어요. 우유가 든 만큼 색칠하고 빈칸을 채워 보세요.", hints: ["1컵을 똑같이 6으로 나눈 것 중의 4만큼 색칠해요.", "[4/6]는 [1/6]이 몇 개인지 세어 봐요."],
      render: (b, a) => f1Bars(b, a, { d: 6, bars: [{ name: "우유", k: 4, col: 1 }], ask: [
        ["1컵을 똑같이 6으로 나눈 것 중의 4 → ", { q: [null, "?4", "?6"] }, " 컵"],
        ["[4/6]는 [1/6]이 ", { i: "4" }, "개예요."]], ok: "[4/6]는 [1/6]이 4개예요. 분수를 단위분수의 개수로 보면 더하고 빼기 쉬워져요." }) },
    { name: "말해 보기 — 더할까, 뺄까?", inst: "요리 교실에서 생긴 궁금증이에요. 덧셈으로 구하는 것과 뺄셈으로 구하는 것으로 나누어 보세요.", hints: ["‘모두’, ‘함께’ 얼마인지 구할 때는 더해요.", "‘남은’ 양이나 ‘얼마나 더’ 많은지 구할 때는 빼요."],
      render: thenWhy((b, a) => f1Sort(b, a, { bins: ["덧셈으로 구해요", "뺄셈으로 구해요"], cards: [
        { t: "펀치에 넣은 포도 주스와 사과 주스는 모두 몇 L일까?", k: 0 },
        { t: "두 모둠이 만든 쿠키 반죽은 모두 몇 kg일까?", k: 0 },
        { t: "선물 상자 두 개를 꾸미는 데 쓴 리본은 모두 몇 m일까?", k: 0 },
        { t: "밀가루를 덜어 쓰고 남은 양은 몇 컵일까?", k: 1, why: "덜어 쓰고 ‘남은’ 양은 처음 양에서 쓴 양을 빼서 구해요." },
        { t: "빨간 리본은 노란 리본보다 몇 m 더 길까?", k: 1, why: "얼마나 ‘더’ 긴지는 두 길이의 차예요. 빼서 구해요." },
        { t: "감자전 1판 중에서 먹고 남은 양은 얼마일까?", k: 1, why: "먹고 ‘남은’ 양은 1판에서 먹은 양을 빼서 구해요." }],
        ok: "모두 얼마인지는 덧셈으로, 남은 양이나 차는 뺄셈으로 구해요." }),
        { q: "‘남은 양’이나 ‘얼마나 더’를 구할 때 왜 뺄셈을 할까요?", ph: "남은 양은 ~이기 때문이에요", help: ["① 처음 양과 쓴 양(또는 비교하는 두 양)을 떠올려요. → ② 무엇에서 무엇을 덜어 내는지 생각해요.", "‘남은 양은 처음 양에서 ~을 덜어 낸 것이라서 뺄셈으로 구해요.’ 꼴로 써요."],
          ans: "남은 양은 처음 양에서 쓴 양을 덜어 낸 것이고, ‘얼마나 더’는 두 양의 차이라서 뺄셈으로 구해요." }) },
    { name: "약속하기 — 여러 가지 분수", inst: "요리법에 나오는 분수 카드를 진분수, 가분수, 대분수로 나누어 보세요.", hints: ["분자가 분모보다 작으면 진분수, 분자가 분모와 같거나 분모보다 크면 가분수예요.", "자연수와 진분수로 이루어진 분수는 대분수예요."],
      render: (b, a) => f1Sort(b, a, { bins: ["진분수", "가분수", "대분수"], cards: [
        { t: "[2/5]", k: 0 }, { t: "[7/3]", k: 1 }, { t: "[2 1/4]", k: 2 }, { t: "[6/6]", k: 1, why: "[6/6]은 분자와 분모가 같아요. 분자가 분모와 같거나 분모보다 크면 가분수예요." },
        { t: "[5/8]", k: 0 }, { t: "[1 3/7]", k: 2 }, { t: "[9/4]", k: 1 }],
        ok: "진분수는 [2/5], [5/8], 가분수는 [7/3], [6/6], [9/4], 대분수는 [2 1/4], [1 3/7]이에요." }) },
    { name: "확인하기 — 가분수와 대분수 바꾸기", inst: "요리법마다 쓰는 꼴이 달라요. 대분수는 가분수로, 가분수는 대분수로 나타내어 보세요.", hints: ["[1 3/4]에서 자연수 1은 [4/4]예요. [4/4]와 [3/4]을 더해요.", "[11/4]에서 [8/4]은 2예요. 남는 것은 [3/4]이에요."],
      render: (b, a) => f1Chain(b, a, [
        ["[1 3/4] = ", { q: [null, "?7", "4"] }],
        ["[2 2/3] = ", { q: [null, "?8", "3"] }],
        ["[11/4] = ", { q: ["?2", "?3", "4"] }],
        ["[9/5] = ", { q: ["?1", "?4", "5"] }]], { ok: "가분수와 대분수를 자유롭게 바꿀 수 있어요. 요리 교실을 시작할 준비가 됐어요!", bad: "자연수 1은 분모와 분자가 같은 분수예요. 1 = [3/3] = [4/4] = [5/5]를 떠올려요." }) }
  ],
  challenge: { inst: "★ 도전 — 요리법에 나온 분수의 크기를 비교해 보세요.", hints: ["분모가 같으면 분자가 클수록 큰 분수예요.", "단위분수는 분모가 작을수록 커요."],
    render: (b, a) => quiz(b, a, [
      { q: "우유 [3/8] 컵과 [5/8] 컵 중 더 많은 것은?", o: ["[3/8] 컵", "[5/8] 컵"], a: 1 },
      { q: "케이크를 똑같이 5조각으로 나눈 한 조각과 3조각으로 나눈 한 조각 중 더 큰 것은?", o: ["[1/5]", "[1/3]"], a: 1, why: { "0": "단위분수는 분모가 작을수록 커요. 3조각으로 나눈 한 조각이 더 커요." } },
      { q: "[1 3/4]과 [9/4] 중 더 큰 분수는?", o: ["[1 3/4]", "[9/4]"], a: 1, why: { "0": "[1 3/4]을 가분수로 나타내면 [7/4]이에요. [7/4]과 [9/4]를 비교해요." } }],
      { ok: "[5/8], [1/3], [9/4]가 더 커요. 크기를 비교할 때도 가분수와 대분수를 바꾸어 보면 편리해요." }) }
},
{
  id: "s2", no: 2, title: "과일 펀치를 만들어요 ― 진분수의 덧셈", soop: "개념 구축하기(O)",
  question: "분모가 같은 진분수끼리는 어떻게 더할까요?",
  summary: "분모가 같은 분수의 덧셈은 분모는 그대로 쓰고, 분자끼리 더해요. [4/6]+[5/6]는 [1/6]이 4+5=9개이므로 [9/6]이고, 합이 가분수이면 대분수 [1 3/6]으로 나타낼 수 있어요. 가분수로 써도, 대분수로 써도 맞아요.",
  steps: [
    { name: "만져 보기 — 주스 색칠하기", inst: "서아와 준서가 과일 펀치를 만들어요. 1 L를 똑같이 5칸으로 나눈 그림에 서아가 부은 포도 주스 [2/5] L와 준서가 부은 사과 주스 [1/5] L를 색칠해 보세요.", hints: ["포도 주스는 5칸 중 2칸, 사과 주스는 5칸 중 1칸을 색칠해요.", "[2/5]는 [1/5]이 2개예요. 두 주스는 [1/5]이 모두 몇 개일까요?"],
      render: (b, a) => f1Bars(b, a, { d: 5, bars: [{ name: "포도 주스", k: 2, col: 3 }, { name: "사과 주스", k: 1, col: 2 }], ask: [
        ["포도 주스 ", { q: [null, "?2", "?5"] }, " L · 사과 주스 ", { q: [null, "?1", "?5"] }, " L"],
        ["[2/5]는 [1/5]이 ", { i: "2" }, "개, [2/5]+[1/5]은 [1/5]이 ", { i: "3" }, "개예요."],
        ["펀치에 넣은 주스 [2/5]+[1/5] = ", { q: [null, "?3", "?5"] }, " L"]], ok: "펀치에 넣은 주스는 [3/5] L예요. [1/5]이 2개와 1개, 모두 3개예요." }) },
    { name: "그려 보기 — 수직선에서 더하기", inst: "도윤이는 레몬 시럽 [4/6] 컵에 탄산수 [5/6] 컵을 더 부었어요. [4/6]+[5/6]를 수직선에 나타내어 계산해 보세요. 작은 눈금 한 칸은 [1/6]이에요.", hints: ["0에서 오른쪽으로 4칸 간 곳이 [4/6]예요.", "거기에서 5칸을 더 가요. 모두 9칸이에요."],
      render: ruleFirst((b, a) => f1Line(b, a, { d: 6, max: 2, a: "4/6", b: "5/6", op: "+", ask: [
        ["[4/6]는 [1/6]이 ", { i: "4" }, "개, [5/6]는 [1/6]이 ", { i: "5" }, "개 → 합은 [1/6]이 ", { i: "9" }, "개"],
        ["[4/6]+[5/6] = ", { q: [null, ["?4", "+", "?5"], "6"] }, " = ", { q: [null, "?9", "6"] }, " = ", { q: ["?1", "?3", "6"] }]], ok: "수직선에서 [1/6]이 9칸이에요. [4/6]+[5/6] = [9/6] = [1 3/6]이에요. 합이 가분수이면 대분수로 나타낼 수 있어요." }),
        { q: "분모가 같은 두 분수를 더하면 분모와 분자는 어떻게 될까요?", ph: "내 규칙: 분모는 ~, 분자는 ~", help: ["① [4/6]와 [5/6]가 [1/6]이 각각 몇 개인지 떠올려요. → ② 더한 뒤에도 한 칸의 크기가 그대로인지 생각해요.", "‘내 규칙: 분모는 ~하고, 분자는 ~해요.’ 꼴로 써요."],
          ans: "분모는 그대로 6이고, 분자끼리 더해요. [1/6]이 4개와 5개를 더하면 [1/6]이 9개이므로 [9/6] = [1 3/6]이에요." }) },
    { name: "말해 보기 — 지호의 계산", inst: "지호는 [4/6]+[5/6] = [9/12]라고 계산했어요. 무엇이 잘못되었는지 알맞은 말을 골라 보세요.", hints: ["[4/6]와 [5/6]는 모두 [1/6]이 몇 개인 수예요.", "[1/6]이 9개인 수의 분모는 여전히 6이에요."],
      render: thenWhy((b, a) => blanks(b, a, ["지호는 ", { o: ["분모끼리도 더했어요", "분자끼리 뺐어요"], a: 0 }, ". [4/6]와 [5/6]는 모두 ", { o: ["[1/6]", "[1/12]"], a: 0 }, "이 몇 개인 수이므로, 더해도 단위분수의 크기는 바뀌지 않아요. 그래서 분모는 ", { o: ["그대로 6", "12"], a: 0 }, "이고, 분자끼리 더하면 [1/6]이 ", { o: ["9개", "20개"], a: 0 }, "예요."], { ok: "[1/6]이 4개와 5개를 더하면 [1/6]이 9개예요. 자연수 4+5=9처럼 단위분수의 개수를 더해요." }),
        { q: "[9/12]가 틀린 답인 까닭을 크기로 말해 봐요.", ph: "[9/12]는 1보다 ~", help: ["① [9/12]가 1보다 큰지 작은지 생각해요. → ② [4/6]와 [5/6]를 더하면 1보다 큰지 작은지 견주어요.", "‘[9/12]는 1보다 ~지만, [4/6]+[5/6]는 1보다 ~야 해요.’ 꼴로 써요."],
          ans: "[9/12]는 분자가 분모보다 작아서 1보다 작아요. 그런데 [4/6]+[5/6]는 [1/6]이 9개라서 [6/6]인 1보다 커야 하니 [9/12]는 틀린 답이에요." }) },
    { name: "약속하기 — 진분수의 덧셈 방법", inst: "과일 펀치를 만들며 찾은 방법을 약속해요. 알맞은 말을 골라 보세요.", hints: ["분모는 단위분수의 크기, 분자는 단위분수의 개수예요."],
      render: (b, a) => blanks(b, a, ["분모가 같은 분수의 덧셈은 분모는 ", { o: ["그대로 쓰고", "분모끼리 더하고"], a: 0 }, ", 분자끼리 ", { o: ["더합니다", "곱합니다"], a: 0 }, ". 합이 가분수이면 ", { o: ["대분수", "진분수"], a: 0 }, "로 나타낼 수 있어요."], { ok: "분모가 같은 분수의 덧셈은 분모는 그대로 쓰고, 분자끼리 더합니다." }) },
    { name: "확인하기 — 펀치 재료 더하기", inst: "계산해 보세요. 합은 가분수로 써도, 대분수로 써도 맞아요. (자연수만 쓸 때는 Enter를 눌러요.)", hints: ["분모는 그대로, 분자끼리 더해요.", "분자와 분모가 같으면 1이에요."],
      render: (b, a) => f1Calc(b, a, [
        { e: "[2/9]+[5/9]", a: "7/9" }, { e: "[3/8]+[5/8]", a: "1" }, { e: "[5/7]+[4/7]", a: "1 2/7" },
        { q: "하은이는 펀치에 오렌지 주스를 [8/10] L, 탄산수를 [5/10] L 넣었어요. 하은이가 넣은 것은 모두 몇 L일까요?", x: "[8/10]+[5/10]", a: "1 3/10", unit: "L", lab: "[8/10]+[5/10] =" }]) }
  ],
  challenge: { inst: "★ 도전 — 펀치 문제를 풀어 보세요.", hints: ["[5/9]+[□/9]가 1보다 작으려면 분자의 합이 9보다 작아야 해요.", "남은 두 주스의 양을 더해요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "[5/9]+[□/9] < 1에서 □ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?", n: 3, unit: "개", lab: "개수", why: { "4": "□가 4이면 [5/9]+[4/9] = [9/9] = 1이에요. 1보다 작아야 하니 4는 들어갈 수 없어요." } },
      { q: "펀치를 만들고 남은 포도 주스 [4/7] L와 사과 주스 [6/7] L를 한 병에 모으면 모두 몇 L일까요?", x: "[4/7]+[6/7]", a: "1 3/7", unit: "L", lab: "[4/7]+[6/7] =" }]) }
},
{
  id: "s3", no: 3, title: "쿠키 반죽을 모아요 ― 대분수의 덧셈", soop: "개념 구축하기(O)",
  question: "분모가 같은 대분수끼리는 어떻게 더할까요?",
  summary: "대분수의 덧셈은 자연수 부분끼리, 분수 부분끼리 더하거나, 대분수를 가분수로 바꾸어 계산해요. 분수 부분끼리 더한 것이 가분수이면 대분수로 바꾸어 자연수 부분에 더해요. 예: [2 4/6]+[1 5/6] = 3+[9/6] = 3+[1 3/6] = [4 3/6]",
  steps: [
    { name: "만져 보기 — 반죽 색칠하고 모으기", inst: "쿠키 모둠이 초코 반죽 [2 1/5] kg과 버터 반죽 [1 3/5] kg을 만들었어요. 1 kg을 5칸으로 나눈 막대에 두 반죽의 양을 색칠하고 ‘모으기’를 눌러 보세요.", hints: ["[2 1/5] kg은 막대 2개를 다 칠하고 1칸 더, [1 3/5] kg은 막대 1개를 다 칠하고 3칸 더 칠해요.", "‘모으기’를 누르면 자연수 부분끼리, 분수 부분끼리 모여요."],
      render: (b, a) => f1Fill(b, a, { d: 5, A: { name: "초코 반죽", v: "2 1/5" }, B: { name: "버터 반죽", v: "1 3/5" },
        est: { q: "[2 1/5]+[1 3/5]은 몇 kg쯤일까요?", o: ["2 kg쯤", "3 kg쯤", "5 kg쯤"], a: 1, why: { "0": "2 kg쯤과 1 kg쯤을 더해 봐요.", "2": "자연수 부분 2와 1을 더해 봐요." }, ok: "2 kg쯤과 1 kg쯤을 더했으니 3 kg쯤이에요. 이제 그림으로 정확히 구해요." },
        askCalc: [{ e: "[2 1/5]+[1 3/5]", a: "3 4/5", unit: "kg" }], ok: "두 반죽은 모두 [3 4/5] kg이에요. 어림한 3 kg쯤보다 조금 더 많아요." }) },
    { name: "그려 보기 — 분수 부분이 1을 넘으면", inst: "하은이네 모둠은 반죽 [2 4/6] kg, 도윤이네 모둠은 [1 5/6] kg을 만들었어요. 그림에 색칠하고 모은 다음, 자연수 부분끼리, 분수 부분끼리 더해 보세요.", hints: ["분수 부분끼리 더하면 [4/6]+[5/6] = [9/6]예요.", "[9/6]는 [6/6]=1과 [3/6]이에요. 1을 자연수 부분에 더해요."],
      render: ruleFirst((b, a) => f1Fill(b, a, { d: 6, A: { name: "하은 모둠", v: "2 4/6" }, B: { name: "도윤 모둠", v: "1 5/6" }, ask: [
        { t: "방법 1", p: ["[2 4/6]+[1 5/6] = (", { i: "2" }, "+", { i: "1" }, ")+([4/6]+[5/6])"] },
        [" = ", { i: "3" }, "+", { q: [null, "?9", "6"] }, " = 3+", { q: ["?1", "?3", "6"] }, " = ", { q: ["?4", "?3", "6"] }]], ok: "분수 부분끼리 더한 [9/6]에서 생긴 1을 자연수 부분에 더해 [4 3/6]이 되었어요." }),
        { q: "분수 부분끼리 더한 것이 1보다 크면 어떻게 하면 좋을까요?", ph: "내 규칙: 분수 부분의 합이 1보다 크면 ~", help: ["① [4/6]+[5/6]가 1보다 큰지 생각해요. → ② 1만큼은 어디로 옮기면 좋을지 생각해요.", "‘내 규칙: 분수 부분의 합에서 1만큼을 ~에 더해요.’ 꼴로 써요."],
          ans: "분수 부분의 합 [9/6]를 [1 3/6]으로 바꾸고, 그 1을 자연수 부분에 더해요. 그래서 [2 4/6]+[1 5/6] = 3+[1 3/6] = [4 3/6]이에요." }) },
    { name: "말해 보기 — 가분수로 더하기", inst: "이번에는 대분수를 가분수로 나타내어 [2 4/6]+[1 5/6]를 계산하고, 두 방법을 비교해 보세요.", hints: ["[2 4/6] = [16/6], [1 5/6] = [11/6]이에요.", "[27/6]에서 [24/6]는 4예요."],
      render: thenWhy((b, a) => f1Chain(b, a, [
        { t: "방법 2", p: ["[2 4/6]+[1 5/6] = ", { q: [null, "?16", "6"] }, "+", { q: [null, "?11", "6"] }, " = ", { q: [null, "?27", "6"] }, " = ", { q: ["?4", "?3", "6"] }] },
        ["방법 1은 ", { c: ["자연수 부분과 분수 부분으로 나누어서", "대분수를 가분수로 바꾸어"], a: 0 }, " 계산했고,"],
        ["방법 2는 ", { c: ["자연수 부분과 분수 부분으로 나누어서", "대분수를 가분수로 바꾸어"], a: 1 }, " 계산했어요."]], { ok: "두 방법 모두 답은 [4 3/6]이에요." }),
        { q: "나는 어느 방법이 더 편리한가요? 까닭과 함께 써 봐요.", ph: "나는 방법 ~이 더 편리해요. 왜냐하면 ~", help: ["① 방법 1과 방법 2에서 어떤 계산을 했는지 떠올려요. → ② 내가 더 쉽게 느낀 쪽을 골라요.", "‘나는 방법 ~이 더 편리해요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요."],
          ans: "나는 방법 1이 더 편리해요. 자연수 부분은 그대로 더하고 작은 분수만 더하면 되기 때문이에요. (방법 2가 편하다고 써도 까닭이 맞으면 좋아요.)" }) },
    { name: "약속하기 — 대분수의 덧셈 방법", inst: "대분수의 덧셈 방법을 정리해요. 알맞은 말을 골라 보세요.", hints: ["분수 부분의 합이 1이거나 1보다 크면 1을 자연수 부분으로 옮겨요."],
      render: (b, a) => blanks(b, a, ["대분수의 덧셈은 자연수 부분끼리, ", { o: ["분수 부분끼리", "분모끼리"], a: 0 }, " 더하거나, 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 바꾸어 계산해요. 분수 부분끼리 더한 것이 가분수이면 ", { o: ["대분수로 바꾸어 자연수 부분에 더해요", "그대로 두어요"], a: 0 }, "."], { ok: "두 방법 모두 쓸 수 있어요. 어느 방법이 더 옳은 것은 아니에요." }) },
    { name: "확인하기 — 반죽 더하기", inst: "계산해 보세요. 합은 가분수로 써도, 대분수로 써도 맞아요.", hints: ["자연수 부분끼리, 분수 부분끼리 더해요.", "[2 3/5]+[9/5]는 [2 3/5]을 [13/5]으로 바꾸어 계산해도 돼요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[1 2/8]+[3 5/8]", a: "4 7/8" }, { e: "[3 4/9]+[2 7/9]", a: "6 2/9" }, { e: "[2 3/5]+[9/5]", a: "4 2/5" }]) }
  ],
  challenge: { inst: "★ 도전 — 쿠키 상자에 붙일 수 카드 1, 4, 6, 7 중에서 2장을 골라 분모가 8인 대분수를 만들려고 해요. 가장 큰 대분수와 가장 작은 대분수를 만들고, 두 수의 합을 구해 보세요.", hints: ["대분수의 분자는 분모 8보다 작아야 해요.", "가장 큰 대분수는 자연수 부분에 가장 큰 수를 놓아요."],
    render: (b, a) => f1Cards(b, a, { cards: [1, 4, 6, 7], den: 8 }) }
},
{
  id: "s4", no: 4, title: "리본으로 선물 상자를 꾸며요 ― 진분수의 뺄셈", soop: "개념 구축하기(O)",
  question: "분모가 같은 진분수끼리는 어떻게 뺄까요?",
  summary: "분모가 같은 분수의 뺄셈은 분모는 그대로 쓰고, 분자끼리 빼요. [7/9]−[4/9]는 [1/9]이 7−4=3개이므로 [3/9]이에요. 약분은 아직 배우지 않았으니 [3/9] 그대로 써요.",
  steps: [
    { name: "만져 보기 — 리본 색칠하기", inst: "파티 선물 상자를 꾸며요. 리본 1 m를 똑같이 8칸으로 나눈 것 중 빨간 리본은 6칸, 노란 리본은 3칸을 썼어요. 쓴 리본을 각각 색칠해 보세요.", hints: ["빨간 리본은 8칸 중 6칸, 노란 리본은 8칸 중 3칸이에요.", "두 리본의 한 칸 크기가 같으니 칸 수를 비교하면 돼요."],
      render: (b, a) => f1Bars(b, a, { d: 8, bars: [{ name: "빨간 리본", k: 6, col: 0 }, { name: "노란 리본", k: 3, col: 2 }], ask: [
        ["빨간 리본 ", { q: [null, "?6", "?8"] }, " m · 노란 리본 ", { q: [null, "?3", "?8"] }, " m"],
        ["[6/8]과 [3/8]은 [1/8]이 각각 ", { i: "6" }, "개, ", { i: "3" }, "개예요."],
        ["[6/8]−[3/8]은 [1/8]이 ", { i: "3" }, "개 → 빨간 리본을 ", { q: [null, "?3", "?8"] }, " m 더 썼어요."]], ok: "빨간 리본을 노란 리본보다 [3/8] m 더 썼어요. 한 칸 크기가 같으니 칸 수끼리 빼면 돼요." }) },
    { name: "그려 보기 — 수직선에서 빼기", inst: "서아는 리본 [7/9] m 중에서 [4/9] m를 잘라 꽃 모양을 만들었어요. [7/9]−[4/9]를 수직선에 나타내어 계산해 보세요. 작은 눈금 한 칸은 [1/9]이에요.", hints: ["0에서 7칸 간 곳이 [7/9]이에요.", "거기에서 왼쪽으로 4칸 되돌아와요."],
      render: (b, a) => f1Line(b, a, { d: 9, max: 1, a: "7/9", b: "4/9", op: "-", ask: [
        ["[7/9]과 [4/9]는 [1/9]이 각각 ", { i: "7" }, "개, ", { i: "4" }, "개 → 차는 [1/9]이 ", { i: "3" }, "개"],
        ["[7/9]−[4/9] = ", { q: [null, ["?7", "−", "?4"], "9"] }, " = ", { q: [null, "?3", "9"] }]], ok: "[7/9]−[4/9] = [3/9]이에요. 남은 리본은 [3/9] m예요." }) },
    { name: "말해 보기 — 단위분수로 설명하기", inst: "[7/9]−[4/9]를 단위분수의 개수로 설명해 보세요.", hints: ["분자는 [1/9]의 개수예요.", "빼도 한 칸의 크기는 그대로예요."],
      render: thenWhy((b, a) => blanks(b, a, ["[7/9]은 [1/9]이 7개, [4/9]는 [1/9]이 4개예요. [7/9]−[4/9]는 [1/9]이 ", { o: ["3개", "11개", "1개"], a: 0 }, "이므로 ", { o: ["[3/9]", "[3/0]", "[11/9]"], a: 0 }, "이에요. 빼도 단위분수 [1/9]의 크기는 ", { o: ["그대로예요", "작아져요"], a: 0 }, "."], { ok: "자연수 7−4=3처럼 단위분수의 개수를 빼요." }),
        { q: "도윤이는 [7/9]−[4/9] = [3/0]이라고 했어요. 무엇이 잘못되었는지 써 봐요.", ph: "도윤이는 ~도 빼서 틀렸어요", help: ["① 도윤이가 분모를 어떻게 계산했는지 봐요. → ② 빼도 [1/9]의 크기가 그대로인지 생각해요.", "‘~끼리도 빼서 틀렸어요. 분모는 ~이고 답은 ~예요.’ 꼴로 써요."],
          ans: "도윤이는 분모끼리도 빼서 틀렸어요. 빼도 단위분수 [1/9]의 크기는 그대로라서 분모는 9이고, 답은 [3/9]이에요." }) },
    { name: "약속하기 — 진분수의 뺄셈 방법", inst: "리본을 자르며 찾은 방법을 약속해요. 알맞은 말을 골라 보세요.", hints: ["덧셈의 약속을 떠올려요. 분모는 그대로였어요."],
      render: (b, a) => blanks(b, a, ["분모가 같은 분수의 뺄셈은 분모는 ", { o: ["그대로 쓰고", "분모끼리 빼고"], a: 0 }, ", 분자끼리 ", { o: ["뺍니다", "더합니다"], a: 0 }, "."], { ok: "분모가 같은 분수의 뺄셈은 분모는 그대로 쓰고, 분자끼리 뺍니다." }) },
    { name: "확인하기 — 리본 계산하기", inst: "계산해 보세요.", hints: ["분모는 그대로, 분자끼리 빼요.", "[4/6], [6/12]은 그대로 답이에요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[5/6]−[1/6]", a: "4/6" }, { e: "[9/10]−[6/10]", a: "3/10" }, { e: "[4/7]−[2/7]", a: "2/7" },
        { q: "지호는 노란 리본 [11/12] m 중에서 [5/12] m를 썼어요. 남은 노란 리본은 몇 m일까요?", x: "[11/12]−[5/12]", a: "6/12", unit: "m", lab: "[11/12]−[5/12] =" }]) }
  ],
  challenge: { inst: "★ 도전 — [5/8]−[2/8]에 알맞은 리본 문제를 완성하고 해결해 보세요. 문제의 앞부분은 “하은이에게 리본이 [5/8] m 있습니다.”예요.", hints: ["[5/8]에서 [2/8]를 빼는 상황이어야 해요.", "쓰고 ‘남은’ 길이를 묻는 문제가 뺄셈이에요."],
    render: (b, a) => { quiz(b, a, [
      { q: "하은이에게 리본이 [5/8] m 있습니다. 뒤에 이어질 알맞은 문장은?", o: ["그중에서 [2/8] m를 상자에 묶었습니다. 남은 리본은 몇 m인가요?", "준서가 [2/8] m를 더 주었습니다. 리본은 모두 몇 m인가요?", "상자 2개에 리본을 [5/8] m씩 묶었습니다. 쓴 리본은 모두 몇 m인가요?"], a: 0, why: { "1": "리본을 더 받으면 길어져요. 덧셈 상황이에요.", "2": "같은 길이를 여러 번 쓰는 상황은 [5/8]−[2/8]가 아니에요." } },
      { q: "완성한 문제의 답은?", o: ["[3/8] m", "[7/8] m", "[3/0] m"], a: 0, why: { "1": "남은 길이는 빼서 구해요.", "2": "분모는 그대로 써요." } }], { ok: "[5/8]−[2/8] = [3/8]. 남은 리본은 [3/8] m예요." });
      writeStep(b, a, [{ q: "이번에는 [5/8]−[2/8]에 알맞은 리본 문제를 내가 직접 만들어 써 봐요.", tag: "내가 만든 문제", ph: "예) 리본이 [5/8] m 있었는데 …", help: ["① 처음에 있던 리본 [5/8] m로 시작해요. → ② [2/8] m를 쓰거나 잘라 낸 뒤 남은 길이를 물어요.", "‘리본이 [5/8] m 있었는데 ~에 [2/8] m를 썼어요. 남은 리본은 몇 m일까요?’ 꼴로 써요."],
        ans: "서아는 리본이 [5/8] m 있었는데 꽃 모양을 만드는 데 [2/8] m를 썼어요. 남은 리본은 몇 m일까요? (답: [3/8] m)" }]); } }
},
{
  id: "s5", no: 5, title: "밀가루와 설탕을 덜어요 ― 대분수의 뺄셈(1)", soop: "개념 구축하기(O)",
  question: "분수 부분끼리 뺄 수 있는 대분수의 뺄셈은 어떻게 할까요?",
  summary: "분수 부분끼리 뺄 수 있는 대분수의 뺄셈은 자연수 부분끼리, 분수 부분끼리 빼거나, 대분수를 가분수로 바꾸어 계산해요. [4 5/7]−[2 3/7] = (4−2)+([5/7]−[3/7]) = [2 2/7], [4 5/7]−[2 3/7] = [33/7]−[17/7] = [16/7] = [2 2/7]",
  steps: [
    { name: "만져 보기 — 덜어 낸 만큼 ×표", inst: "팬케이크 모둠은 밀가루 [3 4/5] 컵 중에서 [1 2/5] 컵을 덜어 반죽을 만들었어요. 밀가루 그림에서 덜어 낸 만큼 ×표 해 보세요.", hints: ["1컵 막대 하나를 통째로 ×표 하면 1컵을 덜어 낸 거예요.", "[1 2/5] 컵은 1컵과 [2/5] 컵이에요."],
      render: (b, a) => f1Take(b, a, { d: 5, m: "3 4/5", s: "1 2/5", unit: "컵",
        est: { q: "[3 4/5]−[1 2/5]는 몇 컵쯤일까요?", o: ["1컵쯤", "2컵쯤", "4컵쯤"], a: 1, why: { "0": "3컵쯤에서 1컵쯤을 빼 봐요.", "2": "덜어 내고 남은 밀가루는 처음보다 적어요." }, ok: "3컵쯤에서 1컵쯤을 뺐으니 2컵쯤이에요." },
        askCalc: [{ e: "[3 4/5]−[1 2/5]", a: "2 2/5", unit: "컵" }], ok: "남은 밀가루는 [2 2/5] 컵이에요. 어림한 2컵쯤보다 조금 더 많아요." }) },
    { name: "그려 보기 — 나누어 빼기", inst: "설탕 [4 5/7] 큰술 중에서 [2 3/7] 큰술을 반죽에 넣었어요. [4 5/7]−[2 3/7]을 자연수 부분끼리, 분수 부분끼리 빼서 계산해 보세요.", hints: ["자연수 부분끼리 4−2, 분수 부분끼리 [5/7]−[3/7]을 계산해요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "방법 1", p: ["[4 5/7]−[2 3/7] = (", { i: "4" }, "−", { i: "2" }, ")+([5/7]−[3/7])"] },
        [" = ", { i: "2" }, "+", { q: [null, "?2", "7"] }, " = ", { q: ["?2", "?2", "7"] }]], { ok: "자연수 부분은 2, 분수 부분은 [2/7]이므로 [2 2/7]예요." }) },
    { name: "말해 보기 — 가분수로 빼기", inst: "[4 5/7]−[2 3/7]을 가분수로 바꾸어 계산하고, 두 방법을 비교해 보세요.", hints: ["[4 5/7] = [33/7], [2 3/7] = [17/7]이에요.", "[16/7]에서 [14/7]는 2예요."],
      render: thenWhy((b, a) => f1Chain(b, a, [
        { t: "방법 2", p: ["[4 5/7]−[2 3/7] = ", { q: [null, "?33", "7"] }, "−", { q: [null, "?17", "7"] }, " = ", { q: [null, "?16", "7"] }, " = ", { q: ["?2", "?2", "7"] }] },
        ["방법 1은 ", { c: ["자연수 부분과 분수 부분으로 나누어서", "대분수를 가분수로 바꾸어"], a: 0 }, " 계산했고,"],
        ["방법 2는 ", { c: ["자연수 부분과 분수 부분으로 나누어서", "대분수를 가분수로 바꾸어"], a: 1 }, " 계산했어요."]], { ok: "두 방법 모두 [2 2/7]예요. 어느 하나가 옳고 다른 하나가 틀린 것이 아니에요." }),
        { q: "두 방법으로 계산한 답이 같은 까닭은 무엇일까요?", ph: "두 방법 모두 ~이기 때문이에요", help: ["① 두 방법이 어떤 두 수의 차를 구했는지 봐요. → ② 대분수와 가분수는 크기가 같은지 떠올려요.", "‘두 방법 모두 ~의 차를 구했고, 대분수와 가분수는 ~이기 때문이에요.’ 꼴로 써요."],
          ans: "두 방법 모두 [4 5/7]와 [2 3/7]의 차를 구했고, 대분수와 가분수는 꼴만 다르고 크기가 같기 때문이에요." }) },
    { name: "약속하기 — 대분수의 뺄셈 방법", inst: "분수 부분끼리 뺄 수 있는 대분수의 뺄셈 방법을 정리해요.", hints: ["덧셈처럼 두 가지 방법이 있어요."],
      render: (b, a) => blanks(b, a, ["분수 부분끼리 뺄 수 있는 대분수의 뺄셈은 자연수 부분끼리, 분수 부분끼리 ", { o: ["빼거나", "더하거나"], a: 0 }, ", 대분수를 ", { o: ["가분수", "자연수"], a: 0 }, "로 바꾸어 계산해요. 어느 방법으로 계산해도 답은 ", { o: ["같아요", "달라요"], a: 0 }, "."], { ok: "편리한 방법을 골라 계산하고, 친구의 방법도 존중해요." }) },
    { name: "확인하기 — 재료 덜기", inst: "계산해 보세요. 차는 가분수로 써도, 대분수로 써도 맞아요.", hints: ["자연수 부분끼리, 분수 부분끼리 빼요.", "[4 6/10]−[23/10]은 [4 6/10]을 [46/10]으로 바꾸어 계산할 수 있어요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[6 7/9]−[2 3/9]", a: "4 4/9" }, { e: "[5 5/8]−[3 1/8]", a: "2 4/8" }, { e: "[4 6/10]−[23/10]", a: "2 3/10" }]) }
  ],
  challenge: { inst: "★ 도전 — 팬케이크 모둠의 문제를 풀어 보세요.", hints: ["두 수를 같은 꼴(가분수 또는 대분수)로 바꾸어 계산해요.", "[17/6]은 [2 5/6]예요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "차가 [2 3/8]인 것을 골라요.", pick: ["[4 7/8]−[1 4/8]", "[30/8]−[1 5/8]", "[5 6/8]−[3 3/8]"], a: 2, why: { "0": "[4 7/8]−[1 4/8] = [3 3/8]이에요.", "1": "[30/8]−[1 5/8] = [30/8]−[13/8] = [17/8] = [2 1/8]이에요." } },
      { q: "우유가 [17/6] L 있어요. 팬케이크 반죽에 [1 2/6] L를 넣으면 남는 우유는 몇 L일까요?", x: "[17/6]−[1 2/6]", a: "1 3/6", unit: "L", lab: "[17/6]−[1 2/6] =" }]) }
},
{
  id: "s6", no: 6, title: "감자전을 나누어 먹어요 ― 자연수와 분수의 뺄셈", soop: "개념 구축하기(O)",
  question: "(자연수)−(분수)는 어떻게 계산할까요?",
  summary: "자연수에서 분수를 뺄 때는 자연수에서 1만큼을 분모와 분자가 같은 분수로 바꾸어 계산하거나, 자연수와 분수를 모두 가분수로 바꾸어 계산해요. 4−[2 2/5] = [3 5/5]−[2 2/5] = [1 3/5], 4−[2 2/5] = [20/5]−[12/5] = [8/5] = [1 3/5]",
  steps: [
    { name: "만져 보기 — 감자전 자르기", inst: "우리 반이 부친 감자전 1판 중에서 [4/6]판을 먹었어요. 감자전을 6조각으로 자른 다음 먹은 만큼 ×표 해 보세요.", hints: ["1판을 ‘6조각으로 자르기’ 하면 [6/6]이 돼요.", "[4/6]판은 6조각 중 4조각이에요."],
      render: ruleFirst((b, a) => f1Take(b, a, { d: 6, m: "1", s: "4/6", pie: true, splitLabel: "6조각으로 자르기", ask: [
        ["1은 [6/6]이므로 [1/6]이 ", { i: "6" }, "개, [4/6]는 [1/6]이 ", { i: "4" }, "개예요."],
        ["1−[4/6]는 [1/6]이 ", { i: "2" }, "개 → 남은 감자전은 ", { q: [null, "?2", "?6"] }, "판이에요."]], ok: "1을 [6/6]으로 바꾸면 [6/6]−[4/6] = [2/6]예요. 남은 감자전은 [2/6]판이에요." }),
        { q: "1에서 분수를 빼려면 1을 어떻게 바꾸면 좋을까요?", ph: "내 규칙: 1을 ~로 바꾸어요", help: ["① 감자전 1판을 6조각으로 자르면 몇 조각인지 떠올려요. → ② 1을 분수로 나타내는 방법을 생각해요.", "‘내 규칙: 1을 분모와 ~가 같은 분수로 바꾸어 빼요.’ 꼴로 써요."],
          ans: "1을 분모와 분자가 같은 분수로 바꾸어요. 1 = [6/6]이므로 1−[4/6] = [6/6]−[4/6] = [2/6]예요." }) },
    { name: "그려 보기 — 1만큼을 분수로", inst: "감자전 반죽을 만들려고 밀가루 4컵 중에서 [2 2/5] 컵을 썼어요. 1컵을 [5/5]로 쪼개어 [2 2/5] 컵만큼 ×표 한 다음, 빈칸을 채워 보세요.", hints: ["4를 [3 5/5]로 나타낼 수 있어요.", "1 = [5/5]예요. 막대 하나를 쪼개면 [1/5]씩 ×표 할 수 있어요."],
      render: thenWhy((b, a) => f1Take(b, a, { d: 5, m: "4", s: "2 2/5", unit: "컵", ask: [
        { t: "방법 1", p: ["4−[2 2/5] = ", { q: ["?3", "?5", "5"] }, "−[2 2/5]"] },
        [" = (", { i: "3" }, "−", { i: "2" }, ")+(", { q: [null, "?5", "5"] }, "−[2/5]) = ", { i: "1" }, "+", { q: [null, "?3", "5"] }, " = ", { q: ["?1", "?3", "5"] }]], ok: "자연수 4에서 1만큼을 [5/5]로 바꾸어 [3 5/5]로 나타내고 계산했어요." }),
        { q: "4를 [3 5/5]로 바꾸어 계산하는 까닭은 무엇일까요?", ph: "4에는 분수 부분이 없어서 ~", help: ["① 4에서 [2/5]를 바로 뺄 수 있는지 생각해요. → ② 1만큼을 [5/5]로 바꾸면 무엇이 생기는지 봐요.", "‘4에는 ~이 없어서 1만큼을 [5/5]로 바꾸면 ~끼리 뺄 수 있어요.’ 꼴로 써요."],
          ans: "4에는 분수 부분이 없어서 [2/5]를 바로 뺄 수 없어요. 4에서 1만큼을 [5/5]로 바꾸어 [3 5/5]로 나타내면 분수 부분끼리 뺄 수 있어요." }) },
    { name: "말해 보기 — 가분수로 빼기", inst: "4−[2 2/5]를 가분수로 바꾸어 계산하고, 두 방법을 비교해 보세요.", hints: ["4 = [20/5], [2 2/5] = [12/5]예요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "방법 2", p: ["4−[2 2/5] = ", { q: [null, "?20", "5"] }, "−", { q: [null, "?12", "5"] }, " = ", { q: [null, "?8", "5"] }, " = ", { q: ["?1", "?3", "5"] }] },
        ["방법 1은 자연수에서 ", { c: ["1만큼을 분수로 바꾸어", "분수를 자연수로 바꾸어"], a: 0 }, " 자연수 부분과 분수 부분으로 나누어서 계산했고,"],
        ["방법 2는 ", { c: ["자연수와 대분수를 모두 가분수로 바꾸어", "자연수 부분끼리만 빼서"], a: 0 }, " 계산했어요."]], { ok: "두 방법 모두 4−[2 2/5] = [1 3/5]이에요." }) },
    { name: "약속하기 — (자연수)−(분수)", inst: "(자연수)−(분수)의 계산 방법을 정리해요.", hints: ["1 = [2/2] = [3/3] = [4/4] = …"],
      render: (b, a) => blanks(b, a, ["(자연수)−(분수)는 자연수에서 ", { o: ["1만큼을", "분모만큼을"], a: 0 }, " 분모와 분자가 같은 분수로 바꾸어 계산하거나, 자연수와 분수를 모두 ", { o: ["가분수", "진분수"], a: 0 }, "로 바꾸어 계산해요. 예를 들어 3은 ", { o: ["[2 6/6]", "[3 6/6]"], a: 0 }, "으로 나타낼 수 있어요."], { ok: "자연수에서 1만큼을 분수로 바꾸면 분수를 뺄 수 있어요." }) },
    { name: "확인하기 — 남은 양 구하기", inst: "계산해 보세요. 차는 가분수로 써도, 대분수로 써도 맞아요.", hints: ["1 = [7/7], 6 = [5 8/8], 3 = [2 9/9]로 바꾸어 봐요."],
      render: (b, a) => f1Calc(b, a, [{ e: "1−[3/7]", a: "4/7" }, { e: "6−[5/8]", a: "5 3/8" }, { e: "3−[1 4/9]", a: "1 5/9" }]) }
  ],
  challenge: { inst: "★ 도전 — 파티 준비 문제를 풀어 보세요.", hints: ["남은 리본은 5에서 쓴 두 길이를 빼서 구해요.", "두 식을 계산하여 대분수로 바꾸어 비교해요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "리본 5 m가 있어요. 하은이가 [1 3/4] m, 준서가 [2/4] m를 썼어요. 남은 리본은 몇 m일까요?", x: "5−[1 3/4]−[2/4]", a: "2 3/4", unit: "m", lab: "5−[1 3/4]−[2/4] =" },
      { q: "차가 더 큰 것을 골라요.", pick: ["4−[17/6]", "3−[1 4/6]"], a: 1, why: { "0": "4−[17/6] = [7/6] = [1 1/6], 3−[1 4/6] = [1 2/6]예요. 다시 비교해요." } }]) }
},
{
  id: "s7", no: 7, title: "피자 반죽을 떼어 내요 ― 대분수의 뺄셈(2)", soop: "개념 구축하기(O)",
  question: "분수 부분끼리 뺄 수 없는 대분수의 뺄셈은 어떻게 할까요?",
  summary: "분수 부분끼리 뺄 수 없으면 빼어지는 수의 자연수에서 1만큼을 분모와 분자가 같은 분수로 바꾸어 계산하거나, 두 대분수를 가분수로 바꾸어 계산해요. [5 1/4]−[2 3/4] = [4 5/4]−[2 3/4] = [2 2/4], [5 1/4]−[2 3/4] = [21/4]−[11/4] = [10/4] = [2 2/4]",
  steps: [
    { name: "만져 보기 — 반죽을 떼어 내요", inst: "피자 모둠은 반죽 [3 2/5] kg 중에서 [1 4/5] kg을 떼어 첫 번째 피자를 만들었어요. 떼어 낸 반죽만큼 ×표 해 보세요.", hints: ["[2/5]에서는 [4/5]만큼 ×표 할 수 없어요. 어떻게 하면 될까요?", "1 kg 막대 하나를 쪼개면 [5/5]가 되어 한 칸씩 ×표 할 수 있어요."],
      render: ruleFirst((b, a) => f1Take(b, a, { d: 5, m: "3 2/5", s: "1 4/5", unit: "kg",
        est: { q: "[3 2/5]−[1 4/5]는 몇 kg쯤일까요?", o: ["1 kg쯤", "2 kg쯤", "3 kg쯤"], a: 1, why: { "0": "3 kg쯤에서 1 kg쯤을 빼 봐요.", "2": "떼어 내고 남은 반죽은 처음보다 적어요." }, ok: "3 kg쯤에서 1 kg쯤을 뺐으니 2 kg쯤이에요." },
        askCalc: [{ e: "[3 2/5]−[1 4/5]", a: "1 3/5", unit: "kg" }], ok: "남은 반죽은 [1 3/5] kg이에요. 어림한 2 kg쯤보다 조금 더 적어요." }),
        { q: "분수 부분끼리 뺄 수 없을 때는 어떻게 하면 좋을까요?", ph: "내 규칙: 분수 부분끼리 뺄 수 없으면 ~", help: ["① [2/5]에서 [4/5]를 뺄 수 있는지 생각해요. → ② 자연수 3에서 무엇을 빌려 오면 좋을지 생각해요.", "‘내 규칙: 자연수에서 1만큼을 ~로 바꾸어 분수 부분에 더한 뒤 빼요.’ 꼴로 써요."],
          ans: "자연수에서 1만큼을 [5/5]로 바꾸어 분수 부분에 더한 뒤 빼요. [3 2/5] = [2 7/5]이므로 [2 7/5]−[1 4/5] = [1 3/5]이에요." }) },
    { name: "그려 보기 — 1만큼을 분수로", inst: "치즈 [5 1/4] 컵 중에서 [2 3/4] 컵을 피자에 뿌렸어요. [5 1/4]−[2 3/4]을 수직선에 나타낸 다음, 자연수에서 1만큼을 분수로 바꾸어 계산해 보세요.", hints: ["1 = [4/4]이므로 [5 1/4] = [4 5/4]예요.", "수직선에서 [5 1/4]은 0에서 [1/4]이 21칸인 곳이에요."],
      render: (b, a) => f1Line(b, a, { d: 4, max: 6, a: "5 1/4", b: "2 3/4", op: "-", ask: [
        { t: "방법 1", p: ["[5 1/4]−[2 3/4] = ", { q: ["?4", "?5", "4"] }, "−[2 3/4]"] },
        [" = (", { i: "4" }, "−", { i: "2" }, ")+(", { q: [null, "?5", "4"] }, "−[3/4]) = ", { i: "2" }, "+", { q: [null, "?2", "4"] }, " = ", { q: ["?2", "?2", "4"] }]], ok: "[5 1/4]을 [4 5/4]로 나타내면 분수 부분끼리 뺄 수 있어요." }) },
    { name: "말해 보기 — 가분수로 빼기", inst: "[5 1/4]−[2 3/4]을 가분수로 바꾸어 계산하고, 두 방법을 비교해 보세요.", hints: ["[5 1/4] = [21/4], [2 3/4] = [11/4]이에요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "방법 2", p: ["[5 1/4]−[2 3/4] = ", { q: [null, "?21", "4"] }, "−", { q: [null, "?11", "4"] }, " = ", { q: [null, "?10", "4"] }, " = ", { q: ["?2", "?2", "4"] }] },
        ["방법 1은 자연수에서 ", { c: ["1만큼을 분수로 바꾸어", "큰 분자에서 작은 분자를 빼서"], a: 0 }, " 계산했고,"],
        ["방법 2는 ", { c: ["자연수 부분끼리만 빼서", "대분수를 가분수로 바꾸어"], a: 1 }, " 계산했어요."]], { ok: "두 방법 모두 [2 2/4]예요." }) },
    { name: "약속하기 — 지호의 계산 고치기", inst: "지호는 [3 2/6]−[1 5/6]를 (3−1)+([5/6]−[2/6]) = [2 3/6]이라고 계산했어요. 덧셈으로 확인하며 알맞은 말을 골라 보세요.", hints: ["[2 3/6]에 [1 5/6]를 더하면 [3 2/6]가 나올까요?", "빼는 수와 빼어지는 수의 분수 부분을 바꾸어 빼면 안 돼요."],
      render: thenWhy((b, a) => blanks(b, a, ["[2 3/6]에 [1 5/6]를 더하면 [4 2/6]가 돼요. 그래서 지호의 답 [2 3/6]은 ", { o: ["틀렸어요", "맞았어요"], a: 0 }, ". [2/6]에서 [5/6]를 뺄 수 없으니 [3 2/6]를 ", { o: ["[2 8/6]", "[3 8/6]"], a: 0 }, "로 바꾸어 빼요. 그러면 [2 8/6]−[1 5/6] = ", { o: ["[1 3/6]", "[2 3/6]"], a: 0 }, "이에요."], { ok: "뺄셈의 답은 덧셈으로 확인할 수 있어요. [1 3/6]+[1 5/6] = [3 2/6]가 맞아요." }),
        { q: "뺄셈의 답이 맞는지 덧셈으로 확인하는 방법을 써 봐요.", ph: "(답)+(빼는 수)가 ~", help: ["① 구한 답에 빼는 수를 더해 봐요. → ② 그 값이 처음 수(빼어지는 수)와 같은지 봐요.", "‘답에 빼는 수를 더해서 ~가 나오면 맞는 답이에요.’ 꼴로 써요."],
          ans: "구한 답에 빼는 수를 더해서 처음 수가 나오면 맞는 답이에요. [1 3/6]+[1 5/6] = [3 2/6]니까 [1 3/6]이 맞아요." }) },
    { name: "확인하기 — 반죽과 치즈 계산", inst: "계산해 보세요. 차는 가분수로 써도, 대분수로 써도 맞아요.", hints: ["분수 부분끼리 뺄 수 없으면 1만큼을 분수로 바꾸어요.", "가분수로 바꾸어 계산해도 돼요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[4 3/8]−[1 6/8]", a: "2 5/8" }, { e: "[6 2/9]−[3 7/9]", a: "2 4/9" }, { e: "[3 1/5]−[8/5]", a: "1 3/5" }]) }
  ],
  challenge: { inst: "★ 도전 — 피자 모둠의 문제를 풀어 보세요.", hints: ["[5 3/7]−[13/7]을 먼저 계산해요. 대분수로 바꾸면 비교하기 쉬워요.", "두 식을 계산해 대분수로 나타내어 비교해요."],
    render: (b, a) => quiz(b, a, [
      { q: "[5 3/7]−[13/7] > [3 □/7]에서 □ 안에 들어갈 수 있는 자연수를 모두 골라요.", o: ["1", "2", "3", "4", "5"], a: [0, 1, 2], why: { "0,1,2,3": "[5 3/7]−[13/7] = [3 4/7]예요. □가 4이면 두 수가 같아요." } },
      { q: "[4 1/8]−[1 5/8] ○ [3 2/8]−[6/8] — ○ 안에 알맞은 것은?", o: [">", "=", "<"], a: 1 }],
      { bad: "[5 3/7]−[13/7] = [25/7] = [3 4/7]예요. [4 1/8]−[1 5/8] = [2 4/8], [3 2/8]−[6/8] = [2 4/8]예요.", ok: "[3 4/7]보다 작아야 하니 □는 1, 2, 3이에요. 두 식은 모두 [2 4/8]로 같아요." }) }
},
{
  id: "s8", no: 8, title: "생각을 더하다 ― 파티 음료를 준비해요", soop: "탐구 정리하기(O)",
  question: "가지고 있는 재료로 음료를 만들고 남은 재료의 양은 어떻게 구할까요?",
  summary: "주문서별로 쓰는 재료의 양을 표로 정리해 더하면 쓴 양을, 가지고 있는 양에서 쓴 양을 빼면 남은 양을 구할 수 있어요. 남은 재료: 우유 2컵, 딸기청 [3/4] 큰술, 초코 시럽 [2 4/5] 큰술.",
  steps: [
    { name: "만져 보기 — 문제 이해하기", inst: "나눔 파티 날, 음료 모둠이 친구들에게 주문을 받아 음료를 만들어요. 재료 카드를 읽고 알맞은 것을 골라 보세요.", hints: ["구하려는 것은 문제의 마지막에 있어요: 주문서 ①~③의 음료를 만들고 남은 재료의 양.", "초코 우유에는 초코 시럽이 들어가요."],
      render: (b, a) => { b.append(f1sRecipe()); quiz(b, a, [
        { q: "음료 모둠이 구하려는 것은 무엇인가요?", o: ["주문서 ①~③의 음료를 만들고 남은 재료의 양", "음료 한 잔의 값", "만들 수 있는 음료의 수"], a: 0 },
        { q: "초코 우유 1잔에 필요한 초코 시럽은?", o: ["[1 3/4] 큰술", "[2 2/5] 큰술", "10 큰술"], a: 1 },
        { q: "가지고 있는 딸기청은?", o: ["6 큰술", "8 큰술", "10 큰술"], a: 0 }], { ok: "구하려는 것과 주어진 것을 잘 찾았어요." }); } },
    { name: "그려 보기 — 계획 세우기", inst: "어떻게 해결할지 계획해요.", hints: ["‘쓰는 양을 모두’ 구할 때와 ‘남은 양’을 구할 때를 생각해요."],
      render: (b, a) => blanks(b, a, ["쓰는 재료의 양은 주문서별로 쓰는 재료의 양을 ", { o: ["더해요", "빼요"], a: 0 }, ". 남은 재료의 양은 가지고 있는 재료에서 쓴 재료의 양을 ", { o: ["빼요", "더해요"], a: 0 }, ". 주문서별로 쓰는 양을 ", { o: ["표로", "그림 한 장으로"], a: 0 }, " 정리하면 보기 쉬워요."], { ok: "더해서 쓴 양을, 빼서 남은 양을 구해요." }) },
    { name: "말해 보기 — 표 만들기", inst: "주문서별로 쓰는 재료의 양을 구해 표를 완성해 보세요. 쓰지 않는 재료는 칸이 없어요.", hints: ["①은 딸기 라테 2잔이에요. 딸기청은 [1 3/4]+[1 3/4]이에요.", "③의 초코 시럽은 [2 2/5]+[2 2/5]예요."],
      render: (b, a) => f1Calc(b, a, [
        { g: "① 딸기 라테 2잔", lab: "우유", x: "1+1", n: 2, unit: "컵" },
        { g: "① 딸기 라테 2잔", lab: "딸기청", x: "[1 3/4]+[1 3/4]", a: "3 2/4", unit: "큰술" },
        { g: "② 딸기 라테 1잔 · 초코 우유 1잔", lab: "우유", x: "1+1", n: 2, unit: "컵" },
        { g: "② 딸기 라테 1잔 · 초코 우유 1잔", lab: "딸기청", x: "[1 3/4]", a: "1 3/4", unit: "큰술" },
        { g: "② 딸기 라테 1잔 · 초코 우유 1잔", lab: "초코 시럽", x: "[2 2/5]", a: "2 2/5", unit: "큰술" },
        { g: "③ 초코 우유 2잔", lab: "우유", x: "1+1", n: 2, unit: "컵" },
        { g: "③ 초코 우유 2잔", lab: "초코 시럽", x: "[2 2/5]+[2 2/5]", a: "4 4/5", unit: "큰술" }],
        { fig: f1sRecipe, ok: "표를 완성했어요. 이제 재료마다 쓴 양을 모두 더해요." }) },
    { name: "약속하기 — 남은 양 구하기", inst: "표를 보고 재료마다 쓴 양을 모두 구한 다음, 남은 재료의 양을 구해 보세요.", hints: ["딸기청: [3 2/4]+[1 3/4], 초코 시럽: [2 2/5]+[4 4/5]", "남은 양: 6−[5 1/4], 10−[7 1/5]. 자연수에서 1만큼을 분수로 바꾸어요."],
      render: (b, a) => f1Calc(b, a, [
        { g: "쓴 양 모두", lab: "우유 2+2+2 =", x: "2+2+2", n: 6, unit: "컵" },
        { g: "쓴 양 모두", lab: "딸기청 [3 2/4]+[1 3/4] =", x: "[3 2/4]+[1 3/4]", a: "5 1/4", unit: "큰술" },
        { g: "쓴 양 모두", lab: "초코 시럽 [2 2/5]+[4 4/5] =", x: "[2 2/5]+[4 4/5]", a: "7 1/5", unit: "큰술" },
        { g: "남은 양", lab: "우유 8−6 =", x: "8−6", n: 2, unit: "컵" },
        { g: "남은 양", lab: "딸기청 6−[5 1/4] =", x: "6−[5 1/4]", a: "3/4", unit: "큰술" },
        { g: "남은 양", lab: "초코 시럽 10−[7 1/5] =", x: "10−[7 1/5]", a: "2 4/5", unit: "큰술" }],
        { ok: "남은 재료는 우유 2컵, 딸기청 [3/4] 큰술, 초코 시럽 [2 4/5] 큰술이에요." }) },
    { name: "확인하기 — 되돌아보기", inst: "음료 모둠이 문제를 어떻게 해결했는지 되돌아보고 써 보세요.", hints: ["표를 만든 까닭, 더한 것과 뺀 것을 떠올려요."],
      render: (b, a) => writeStep(b, a, [
        { q: "남은 재료의 양을 어떻게 구했는지 설명해 보세요.", tag: "해결 방법", ph: "예) 주문서별로 쓴 양을 표로 정리해 …", help: ["① 표에 무엇을 정리했는지 써요. → ② 무엇을 더하고 무엇을 뺐는지 차례대로 써요.", "‘주문서별로 ~을 표로 정리해 더하고, 가지고 있는 양에서 ~을 빼서 구했어요.’ 꼴로 써요."],
          ans: "주문서별로 쓴 재료의 양을 표로 정리해 재료마다 더하고, 가지고 있는 양에서 쓴 양을 빼서 남은 양을 구했어요." },
        { q: "딸기청을 다른 방법으로도 구할 수 있을까요?", tag: "다른 방법", ph: "예) 딸기 라테는 모두 몇 잔이니까 …", help: ["① 딸기 라테가 주문서 ①~③에서 모두 몇 잔인지 세어 봐요. → ② 그만큼 [1 3/4]을 더하는 방법을 생각해요.", "‘딸기 라테가 모두 ~잔이니까 [1 3/4]을 ~번 더해서 구할 수도 있어요.’ 꼴로 써요."],
          ans: "딸기 라테가 모두 3잔이니까 [1 3/4]을 3번 더해서 [5 1/4] 큰술로 구할 수도 있어요." }]) }
  ],
  challenge: { inst: "★ 도전 — 남은 재료로 주문서 ④ 딸기 라테 2잔을 더 만들려고 해요. 더 필요한 재료의 양을 구해 보세요.", hints: ["딸기 라테 2잔에는 우유 2컵과 딸기청 [3 2/4] 큰술이 필요해요.", "남은 딸기청은 [3/4] 큰술이에요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "모자라는 재료는 무엇인가요?", pick: ["우유", "딸기청", "초코 시럽"], a: 1, why: { "0": "우유는 2컵 남아서 딸기 라테 2잔에 딱 맞아요.", "2": "딸기 라테에는 초코 시럽이 들어가지 않아요." } },
      { q: "더 필요한 딸기청은 몇 큰술일까요?", e: "[3 2/4]−[3/4]", a: "2 3/4", unit: "큰술" }], { ok: "딸기청이 [2 3/4] 큰술 더 필요해요." }) }
},
{
  id: "s9", no: 9, title: "파티 놀이 ― 말을 튕겨 분수를 더하고 빼요", soop: "발표하기(P)",
  question: "말을 튕기는 놀이를 하며 분수를 더하거나 빼 볼까요?",
  summary: "두 말의 위치를 비교하여 내 말이 도착선에 더 가까우면 말에 적힌 분수를 더하고, 더 멀거나 책상 아래로 떨어지면 빼요. 세 번 계산한 뒤 마지막 값이 더 큰 사람이 이겨요. (말의 분수와 처음 수는 이 앱에서 정한 것이에요.)",
  steps: [
    { name: "만져 보기 — 놀이 방법 알아보기", inst: "파티 놀이 시간이에요! 분모가 같은 분수 말 6개를 주머니에 넣고, 차례대로 하나씩 꺼내 책상 위에서 튕겨요. 놀이 방법을 읽고 알맞은 것을 골라 보세요.", hints: ["도착선에 더 가까우면 더하고, 더 멀거나 떨어지면 빼요.", "한 번 쓴 말은 주머니에 다시 넣지 않아요."],
      render: (b, a) => quiz(b, a, [
        { q: "내 말이 친구의 말보다 도착선에 더 가까우면?", o: ["내 말에 적힌 분수를 더해요", "내 말에 적힌 분수를 빼요"], a: 0 },
        { q: "내 말이 책상 아래로 떨어지면?", o: ["내 말에 적힌 분수를 더해요", "내 말에 적힌 분수를 빼요"], a: 1 },
        { q: "놀이에서 이기려면?", o: ["세 번 계산한 마지막 값이 친구보다 커야 해요", "말을 가장 멀리 떨어뜨려야 해요"], a: 0 }], { ok: "도착선에 최대한 가깝게, 하지만 떨어지지 않게 튕겨야 해요." }) },
    { name: "그려 보기 — 준서의 놀이 기록", inst: "준서가 분모가 8인 주머니로 놀이한 기록이에요. 처음 수는 4예요. 차례대로 계산해 보세요.", hints: ["4는 [3 8/8]로 바꾸면 빼기 쉬워요.", "분수 부분의 합이 1이거나 1보다 크면 자연수 부분에 1을 더해요."],
      render: (b, a) => f1Calc(b, a, [
        { q: "1회: 말이 떨어져서 [3/8]을 빼요.", e: "4−[3/8]", a: "3 5/8" },
        { q: "2회: “내 말이 도착선에 더 가까우니 [6/8]을 더해야지.”", e: "[3 5/8]+[6/8]", a: "4 3/8" },
        { q: "3회: 더 멀어서 [7/8]을 빼요.", e: "[4 3/8]−[7/8]", a: "3 4/8" }], { ok: "준서의 마지막 값은 [3 4/8]예요. 계산을 차례대로 잘했어요." }) },
    { name: "말해 보기 — 놀이하기 ① 분모 8", inst: "로봇과 말 튕기기 놀이를 해요. 말을 꺼내 아래로 당겼다 놓거나 힘을 골라 튕기고, 계산 방법에 따라 계산해요(다 쓰면 저절로 확인). 로봇의 계산이 맞는지도 확인해 주세요.", hints: ["너무 세게 튕기면 책상 아래로 떨어져요.", "로봇도 가끔 틀려요. 직접 계산해 보고 판단해요."],
      render: (b, a) => f1Game(b, a, { sets: [8] }) },
    { name: "약속하기 — 놀이하기 ② 분모 6 · 4", inst: "주머니를 바꾸어 놀이해요. 분모가 6이나 4인 진분수, 가분수, 대분수 말이 들어 있어요.", hints: ["대분수와 가분수가 섞여 있으면 같은 꼴로 바꾸어 계산해요.", "분수 부분끼리 뺄 수 없으면 1만큼을 분수로 바꾸어요."],
      render: (b, a) => f1Game(b, a, { sets: [6, 4] }) },
    { name: "확인하기 — 또 다른 놀이", inst: "또 다른 놀이: 이긴 사람이 승리 조건을 고르고, 각자 분수 말을 2개씩 골라 동시에 뒤집어요. 나는 [4/6], [1 3/6]을, 서아는 [8/6], [2/6]를 뒤집었어요. 누가 이길까요?", hints: ["[1 3/6]은 [9/6]예요.", "뺄셈은 큰 분수에서 작은 분수를 빼요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "승리 조건: 두 분수를 더하여 더 큰 수가 나온 사람", o: ["나", "서아", "비겨요"], a: 0, why: { "1": "나: [4/6]+[1 3/6] = [2 1/6], 서아: [8/6]+[2/6] = [1 4/6]예요." } },
        { q: "승리 조건: 큰 분수에서 작은 분수를 빼서 더 큰 수가 나온 사람", o: ["나", "서아", "비겨요"], a: 1, why: { "0": "나: [1 3/6]−[4/6] = [5/6], 서아: [8/6]−[2/6] = [6/6] = 1이에요." } },
        { q: "승리 조건: 큰 분수에서 작은 분수를 빼서 더 작은 수가 나온 사람", o: ["나", "서아", "비겨요"], a: 0 }], { ok: "나의 합 [2 1/6], 서아의 합 [1 4/6] / 나의 차 [5/6], 서아의 차 1이에요." }),
        { q: "‘두 분수를 더하여 더 큰 수’ 조건이면 어떤 말 2개를 고르면 좋을까요?", ph: "~한 말 2개를 고르면 좋아요. 왜냐하면 ~", help: ["① 합이 커지려면 어떤 수끼리 더해야 하는지 생각해요. → ② 그 까닭을 함께 써요.", "‘가장 ~ 분수 말 2개를 고르면 좋아요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요."],
          ans: "가장 큰 분수 말 2개를 고르면 좋아요. 왜냐하면 큰 수끼리 더해야 합이 가장 커지기 때문이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 말의 뒷면에 분모가 4인 분수를 적어 놀이했어요. 처음 수 6에서 [5/4]를 빼고, [2 1/4]을 더하고, [7/4]을 뺐어요. 마지막 값은 얼마일까요?", hints: ["앞에서부터 차례대로 계산해요.", "모두 가분수로 바꾸면 [24/4]−[5/4]+[9/4]−[7/4]이에요."],
    render: (b, a) => f1Calc(b, a, [{ x: "6−[5/4]+[2 1/4]−[7/4]", a: "5 1/4", den: 4, lab: "6−[5/4]+[2 1/4]−[7/4] =" }], { ok: "마지막 값은 [5 1/4]이에요. 분수를 더하고 빼며 끝까지 계산했어요." }) }
},
{
  id: "s10", no: 10, title: "우리 반 요리 발표회 ― 공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분수의 덧셈과 뺄셈을 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
  summary: "분모가 같은 분수의 덧셈과 뺄셈은 분모는 그대로 쓰고 분자끼리 계산해요. 대분수는 자연수 부분끼리, 분수 부분끼리 계산하거나 가분수로 바꾸어 계산해요. 분수 부분끼리 뺄 수 없으면 자연수에서 1만큼을 분수로 바꾸어요. 합이나 차는 가분수로 써도, 대분수로 써도 맞아요.",
  steps: [
    { name: "만져 보기 — 그림 보고 계산하기", inst: "요리 발표회 첫 순서예요. 주스 [2/7] L와 [3/7] L만큼 색칠하고, 그림을 보고 □ 안에 알맞은 수를 써 보세요.", hints: ["[2/7]는 7칸 중 2칸, [3/7]은 7칸 중 3칸이에요.", "분모는 그대로, 분자끼리 더해요."],
      render: (b, a) => f1Bars(b, a, { d: 7, bars: [{ name: "[2/7]", k: 2, col: 0 }, { name: "[3/7]", k: 3, col: 1 }], ask: [
        ["[2/7]+[3/7] = ", { q: [null, ["?2", "+", "?3"], "7"] }, " = ", { q: [null, "?5", "7"] }]], ok: "[2/7]+[3/7] = [5/7]예요. [1/7]이 2개와 3개, 모두 5개예요." }) },
    { name: "그려 보기 — 계산하기", inst: "계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["대분수끼리는 자연수 부분끼리, 분수 부분끼리 계산해요.", "1−[5/9]는 1을 [9/9]로 바꾸어요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[2 4/7]+[3 2/7]", a: "5 6/7" }, { e: "[3 5/6]+[1 4/6]", a: "5 3/6" }, { e: "[9/10]−[4/10]", a: "5/10" }, { e: "1−[5/9]", a: "4/9" }]) },
    { name: "말해 보기 — 이어 보기", inst: "계산 결과가 같은 것끼리 이어 보세요.", hints: ["모두 분모가 9예요. 가분수로 바꾸어 비교하면 편리해요.", "[2 3/9]+[13/9] = [34/9], 5−[11/9] = [34/9]"],
      render: (b, a) => f1Match(b, a, { left: [{ t: "[2 3/9]+[13/9]", k: 1 }, { t: "[4 2/9]−[1 5/9]", k: 2 }], right: [{ t: "5−[11/9]", k: 1 }, { t: "[5 8/9]−[2 3/9]", k: null }, { t: "[11/9]+[13/9]", k: 2 }],
        ok: "[2 3/9]+[13/9] = 5−[11/9] = [3 7/9], [4 2/9]−[1 5/9] = [11/9]+[13/9] = [2 6/9]이에요." }) },
    { name: "약속하기 — 비교하고 고치기", inst: "합과 차의 크기를 비교해요. 그리고 도윤이가 잘못 계산한 곳을 찾아 이유를 고르고 옳게 계산해 보세요. 도윤이의 계산: [6 2/5]−[2 4/5] = 4+[2/5] = [4 2/5]", hints: ["[1 7/10]+[19/10] = [36/10], [6 3/10]−[25/10] = [38/10]이에요.", "[2/5]에서 [4/5]는 뺄 수 없어요. [6 2/5]를 [5 7/5]로 바꾸어요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "크기 비교", p: ["[1 7/10]+[19/10] ", { c: [">", "=", "<"], a: 2 }, " [6 3/10]−[25/10]"] },
        { t: "이유", p: [{ c: ["분수 부분끼리 뺄 수 없는데 큰 분자에서 작은 분자를 뺐어요", "자연수 부분끼리 빼면 안 돼요"], a: 0 }] },
        { t: "옳게", p: ["[6 2/5]−[2 4/5] = ", { q: ["?5", "?7", "5"] }, "−[2 4/5] = ", { i: "3" }, "+", { q: [null, "?3", "5"] }, " = ", { q: ["?3", "?3", "5"] }] }],
        { ok: "[3 6/10] < [3 8/10]이에요. 분수 부분끼리 뺄 수 없으면 1만큼을 [5/5]로 바꾸어 [6 2/5] = [5 7/5]로 계산해요." }) },
    { name: "확인하기 — 사다리 타기", inst: "발표회 마지막 놀이예요. 사다리를 타고 내려가 도착한 집에 합 또는 차를 써 보세요.", hints: ["[5 2/7]−[2 6/7]은 분수 부분끼리 뺄 수 없어요.", "1−[5/12]는 1을 [12/12]로 바꾸어요."],
      render: (b, a) => f1Ladder(b, a, { items: ["[3/10]+[4/10]", "[5 2/7]−[2 6/7]", "[2 5/8]+[1 6/8]", "1−[5/12]"], perm: [2, 0, 3, 1] }) },
    { name: "되돌아보기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["분수의 덧셈과 뺄셈을 배우기 전의 생각을 떠올려요.", "분모는 그대로, 1만큼을 분수로 바꾸기, 가분수로 바꾸어 계산하기를 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "배우기 전의 생각", ex: ["예전에는 분수끼리 더할 때 분모도 더해야 한다고 생각했어요.", "예전에는 4에서 분수를 어떻게 빼는지 몰랐어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 분모는 그대로 두고 분자끼리 계산하면 된다고 생각해요.", "지금은 자연수에서 1만큼을 [5/5]처럼 바꾸면 뺄 수 있다는 것을 알아요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["과일 펀치를 수직선에 나타내 [1/6]이 몇 칸인지 세어 보고 바뀌었어요.", "감자전을 조각으로 잘라 ×표 해 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "★★ 도전 — 파티 재료를 사러 가는 길이에요. 학교에서 마트까지는 [1 2/6] km, 마트에서 공원까지는 [1 4/6] km, 학교에서 공원까지 바로 가면 [2 5/6] km예요.", hints: ["거쳐 가는 거리는 두 거리를 더해요. [6/6]은 1이에요.", "3을 [2 6/6]으로 바꾸어 [2 5/6]를 빼요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "① 학교에서 마트를 거쳐 공원까지 가는 거리는 몇 km일까요?", e: "[1 2/6]+[1 4/6]", a: "3", unit: "km" },
      { q: "② 마트를 거쳐 가는 거리는 바로 가는 거리보다 몇 km 더 멀까요?", e: "3−[2 5/6]", a: "1/6", unit: "km" }], { fig: f1sMap, ok: "거쳐 가면 3 km, 바로 가는 것보다 [1/6] km 더 멀어요." }) }
}
];
