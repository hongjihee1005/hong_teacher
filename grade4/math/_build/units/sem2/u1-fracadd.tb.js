//@@APP
const APP={title:"우주 호텔 분수의 덧셈과 뺄셈", unit:"4-2 수학 1. 분수의 덧셈과 뺄셈(교과서)", key:"t42-fracadd-v1", welcome:"우주 호텔 분수의 덧셈과 뺄셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 우주 호텔에 사는 시우와 지구에서 온 친구 혜지와 함께 분모가 같은 분수를 더하고 빼 봐요."};
//@@UNIT
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
quiz = (b, a, items, o) => f1Quiz0(b, f1A(a), items, o);
blanks = (b, a, parts, o) => f1Blanks0(b, f1A(a), parts, o);

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
  return el;
}
function f1Box(exp) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 3, class: "f1box", "aria-label": "빈칸" });
  i.exp = String(exp);
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
  const btn = h("button", { class: "big", onclick: () => {
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
    if (bad) return api.fail(bad, given.join(" / "));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce();
    rows.forEach(R => { if (R.kind === "f") { const k = R.den / R.t.den; const num = Number.isInteger(k) ? R.t.num * k : R.t.num, den = Number.isInteger(k) ? R.den : R.t.den; R.res.textContent = "→ " + f1Book(num, den); R.res.classList.remove("hidden"); } });
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요! 가분수로 써도, 대분수로 써도 맞아요.");
  } }, "확인하기");
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, btn));
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
  body.append(wrap, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    let ok = true, hint = null; const given = [];
    ins.forEach(x => {
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp; x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = f1Judge(x.get(), x.target, x.den); given.push(x.text()); if (J.code === "ok") x.paint(true); else if (J.code === "diffden" || J.code === "zero") { x.paint(null); hint = hint || J.msg; } else { x.paint(false); ok = false; } }
    });
    chs.forEach(C => { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(C.sel === C.a ? "good" : "bad"); }); if (C.sel !== C.a) ok = false; given.push(C.sel == null ? "-" : C.el.children[C.sel].textContent); });
    if (!ok) return api.fail(opt.bad || "빨간 칸을 다시 생각해 봐요.", given.join(","));
    if (hint) { api.tryOnce(); return api.hint(hint); }
    api.tryOnce(); api.done(given.join(","), opt.ok || "차례대로 잘 계산했어요!");
  } }, "확인하기")));
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 */
function f1Ask(host, api, ready, msg, opt) {
  const g = f1Gate(api, ready, msg);
  if (opt.ask) return f1Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad });
  if (opt.askCalc) return f1Calc(host, g, opt.askCalc, { ok: opt.ok });
  api.provide({ words: [], answers: [] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { api.tryOnce(); ready() ? api.done("조작 완료", opt.ok) : api.fail(typeof msg === "function" ? msg() : msg, "-"); } }, "확인하기")));
}

/* ③ 막대 색칠하기: bars [{name, k, col}]  opt: d, ask(줄)·askCalc, ok */
function f1Bars(body, api, opt) {
  f1Style();
  const d = opt.d, bars = opt.bars, W = 900, LX = 210, BW = 660, BH = 62, GP = 42, H = bars.length * (BH + GP) + 14;
  const st = bars.map(() => Array(d).fill(false));
  const svg = makeSvg(W, H);
  const cnt = i => st[i].filter(Boolean).length;
  const draw = () => {
    svg.innerHTML = "";
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
  f1Ask(ask, api, ready, () => { const i = bars.findIndex((b, k) => cnt(k) !== b.k); return `먼저 ‘${f1Plain(bars[i].name)}’ 막대를 알맞게 색칠해요. 지금 ${cnt(i)}칸이에요.`; }, opt);
}

/* ④ 수직선 뛰기: opt d, max, a, b, op("+"|"-"), ask */
function f1Line(body, api, opt) {
  f1Style();
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
    svg.innerHTML = "";
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
  f1Ask(ask, api, () => hops.length === 2, "먼저 수직선에 두 번 뛰어 나타내요.", opt);
}

/* ⑤ 두 대분수를 색칠하고 모으기(분수 부분의 합이 1이 되면 자연수로): opt d, A:{name,v}, B:{name,v}, est, ask */
function f1Fill(body, api, opt) {
  f1Style();
  const d = opt.d, A = f1Str(opt.A.v), B = f1Str(opt.B.v), aN = A.num * d / A.den, bN = B.num * d / B.den;
  const nb = Math.ceil(aN / d) + Math.ceil(bN / d);
  let cells = Array(nb * d).fill(0), cur = 1, merged = false, estOk = !opt.est;
  const W = 900, LX = 130, BW = 640, BH = 44, GP = 14, H = 24 + nb * (BH + GP);
  const svg = makeSvg(W, H);
  const count = k => cells.filter(c => c === k).length;
  const fA = aN % d, fB = bN % d, wA = (aN - fA) / d, wB = (bN - fB) / d, fb = wA + wB, carry = fA + fB >= d;
  const draw = () => {
    svg.innerHTML = "";
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
  if (opt.est) body.append(f1EstBox(api, opt.est, () => { estOk = true; }));
  body.append(h("div", { class: "f1tools" }, bA, bB, mergeBtn, reset), readout, h("div", { class: "f1stage" }, svg), ask);
  f1Ask(ask, api, () => merged && estOk, () => !estOk ? "먼저 어림해요." : "두 수를 알맞게 색칠한 다음 ‘모으기’를 눌러요.", opt);
}

/* ⑥ 덜어 내기(×표): 자연수 1은 통째로 ×표 하거나 쪼개어 한 칸씩 ×표. opt d, m(빼어지는 수), s(빼는 수), pie, unit, splitLabel, est, ask */
function f1Take(body, api, opt) {
  f1Style();
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
    svg.innerHTML = "";
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
  if (opt.est) body.append(f1EstBox(api, opt.est, () => { estOk = true; }));
  body.append(h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.1em 0" }, pie ? "통째로 누르면 1에 ×표, ‘자르기’ 단추를 누르면 조각으로 나뉘어 한 조각씩 ×표 할 수 있어요." : `막대(1)를 누르면 통째로 ×표, ‘쪼개기’를 누르면 1이 ${f1J(`[${d}/${d}]`, "으로")} 나뉘어 한 칸씩 ×표 할 수 있어요.`),
    readout, h("div", { class: "f1stage" }, svg),
    h("div", { class: "f1tools" }, h("button", { onclick: () => { units.forEach(u => { u.whole = false; u.cells.fill(false); if (!u.rest) u.split = false; }); draw(); } }, "처음부터")), ask);
  f1Ask(ask, api, () => crossed() === sN && estOk, () => !estOk ? "먼저 어림해요." : `${f1Tk(opt.s)}${opt.unit ? " " + opt.unit : ""}만큼 ×표 해요. 지금은 [1/${d}]이 ${crossed()}개예요. 남은 칸이 모자라면 1을 쪼개 보세요.`, opt);
}

/* ⑦ 분류하기: cards [{t, k(bin 번호)}], bins [이름] */
function f1Sort(body, api, opt) {
  f1Style();
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "f1pool" }), binsEl = h("div", { class: "f1bins" });
  const lists = opt.bins.map((b, bi) => { const list = h("div", { class: "f1binl" }); binsEl.append(h("div", { class: "f1bin", onclick: e => { if (e.target.closest(".f1crd")) return; put(bi); } }, h("button", { class: "f1binh" }, b), list)); return list; });
  const els = opt.cards.map((c, ci) => h("button", { class: "opt f1crd", onclick: () => { if (where[ci] >= 0) { where[ci] = -1; sel = null; } else sel = sel === ci ? null : ci; draw(); } }, c.t));
  function put(bi) { if (sel == null) return api.hint("먼저 카드를 누르고, 넣을 곳을 눌러요."); where[sel] = bi; sel = null; draw(); }
  function draw() { els.forEach((el, ci) => { el.classList.toggle("f1on", sel === ci); el.classList.remove("good", "bad"); (where[ci] < 0 ? pool : lists[where[ci]]).append(el); }); }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.k === bi).map(c => f1Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "f1tip" }, "카드를 누른 다음, 알맞은 곳을 눌러 넣어요. 넣은 카드를 다시 누르면 빠져요."), pool, binsEl,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (where.some(w => w < 0)) return api.fail("아직 넣지 않은 카드가 있어요.", "-");
      let ok = true; els.forEach((el, ci) => { const g = where[ci] === opt.cards[ci].k; el.classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = opt.bins.map((b, bi) => `${b}:${opt.cards.filter((c, ci) => where[ci] === bi).map(c => c.t).join(",")}`).join(" / ");
      if (!ok) { const ci = opt.cards.findIndex((c, k) => where[k] !== c.k); return api.fail((opt.cards[ci].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); }
      api.tryOnce(); api.done(given, opt.ok);
    } }, "확인하기")));
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
  function draw() {
    lb.forEach((b, i) => { b.classList.toggle("f1on", sel === i); b.classList.remove("good", "bad"); [...b.querySelectorAll(".f1badge")].forEach(x => x.remove()); b.append(badge(i)); });
    rb.forEach((b, j) => { b.classList.remove("good", "bad"); [...b.querySelectorAll(".f1badge")].forEach(x => x.remove()); pair.forEach((p, i) => { if (p === j) b.append(badge(i)); }); });
  }
  draw();
  api.provide({ words: [], answers: L.map(l => `${f1Plain(l.t)} — ${f1Plain(R.find(r => r.k === l.k).t)}`) });
  body.append(h("p", { class: "f1tip" }, "왼쪽 식을 누르고, 값이 같은 오른쪽 식을 눌러 이어요. 짝이 없는 식도 있어요."),
    h("div", { class: "f1mt" }, h("div", { class: "f1mc" }, lb), h("div", { class: "f1mc" }, rb)),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (pair.some(p => p < 0)) return api.fail("왼쪽 식을 모두 이어요.", "-");
      let ok = true; pair.forEach((p, i) => { const g = R[p].k === L[i].k; lb[i].classList.add(g ? "good" : "bad"); if (!g) ok = false; });
      const given = pair.map((p, i) => `${i + 1}-${p + 1}`).join(", ");
      if (!ok) return api.fail("값을 계산해 보고 다시 이어요. 가분수와 대분수 중 편리한 꼴로 바꾸어 비교해요.", given);
      api.tryOnce(); api.done(given, opt.ok || "값이 같은 식끼리 잘 이었어요!");
    } }, "확인하기")));
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
  const paint = () => sb.forEach(b => { b.textContent = b.s[b.key] == null ? "​" : String(b.s[b.key]); });
  const sum = f1In("두 수의 합");
  const total = best.v + worst.v;
  api.provide({ words: ["가장 큰 대분수", "가장 작은 대분수"], answers: [`가장 큰 대분수 ${f1Plain(`[${best.w} ${best.n}/${den}]`)}`, `가장 작은 대분수 ${f1Plain(`[${worst.w} ${worst.n}/${den}]`)}`, `합 ${f1Plain(f1Tk(f1Form(total, den)))}`] });
  body.append(h("p", { class: "f1tip" }, "수 카드를 누른 다음 빈칸을 눌러 넣어요. 빈칸을 다시 누르면 지워져요."), cardRow,
    h("div", { class: "f1cl" }, h("span", { class: "f1tag" }, "가장 큰 대분수"), mixed(slots[0])),
    h("div", { class: "f1cl" }, h("span", { class: "f1tag" }, "가장 작은 대분수"), mixed(slots[1])),
    h("div", { class: "f1cl" }, h("span", {}, "두 수의 합 ="), sum),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      const [B, S] = slots, given = `${B.w} ${B.n}/${den}, ${S.w} ${S.n}/${den}, 합 ${sum.text()}`;
      if ([B.w, B.n, S.w, S.n].some(v => v == null)) return api.fail("빈칸에 수 카드를 모두 넣어요.", given);
      if (B.w === B.n || S.w === S.n) return api.fail("한 대분수에는 서로 다른 카드 2장을 써요.", given);
      if (B.w !== best.w || B.n !== best.n) return api.fail("가장 큰 대분수는 자연수 부분에 가장 큰 수를, 분자에 그다음으로 큰 수를 놓아요.", given);
      if (S.w !== worst.w || S.n !== worst.n) return api.fail("가장 작은 대분수는 자연수 부분에 가장 작은 수를, 분자에 그다음으로 작은 수를 놓아요.", given);
      const J = f1Judge(sum.get(), f1Form(total, den), den);
      if (J.code === "diffden" || J.code === "zero") { sum.paint(null); return api.hint(J.msg); }
      if (J.code !== "ok") { sum.paint(false); return api.fail(J.msg || f1Diag(`[${best.w} ${best.n}/${den}]+[${worst.w} ${worst.n}/${den}]`, sum.get()) || "자연수 부분끼리, 분수 부분끼리 더해 봐요.", given); }
      sum.paint(true); api.tryOnce();
      api.done(given, opt.ok || `[${best.w} ${best.n}/${den}]+[${worst.w} ${worst.n}/${den}] = ${f1Book(total, den)}. 수 카드로 만든 대분수를 더했어요!`);
    } }, "확인하기")));
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
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (traced.some(t => !t)) return api.fail("네 식을 모두 눌러 사다리를 타 보세요.", "-");
      let bad = null, hint = null; const given = [];
      for (let j = 0; j < n; j++) {
        const i = perm.indexOf(j), v = vals[i], den = dens[i], r = ins[j].get(), J = f1Judge(r, f1Form(v.num * den / v.den, den), den); given.push(ins[j].text());
        if (J.code === "ok") ins[j].paint(true);
        else if (J.code === "diffden" || J.code === "zero") { ins[j].paint(null); hint = hint || J.msg; }
        else { ins[j].paint(false); bad = bad || J.msg || f1Diag(items[i], r) || `${j + 1}번 집의 값을 다시 계산해 봐요.`; }
      }
      if (bad) return api.fail(bad, given.join(" / "));
      if (hint) { api.tryOnce(); return api.hint(hint); }
      api.tryOnce(); api.done(given.join(" / "), opt.ok || "사다리를 타고 합과 차를 모두 구했어요!");
    } }, "확인하기")));
}

/* ⑪ 동전 무게 저울 (단원 도입) */
function f1Coins(body, api, opt) {
  f1Style();
  const W = 900, H = 420, PX = 450, PY = 120, L = 250;
  const coins = [{ name: "100원", r: 52, w: opt.w100, home: [340, 365], fill: "#D5D8DA", rim: "#8A9196", pan: null },
    { name: "10원", r: 42, w: opt.w10, home: [560, 365], fill: "#E8B27A", rim: "#A86A2E", pan: null }];
  coins.forEach(c => { c.x = c.home[0]; c.y = c.home[1]; });
  const svg = makeSvg(W, H); let drag = null;
  const heavy = c => c === coins[0] ? 2 : 1;
  const tilt = () => { let a = 0; coins.forEach(c => { if (c.pan != null) a += (c.pan === 0 ? 1 : -1) * heavy(c); }); return Math.max(-9, Math.min(9, a * 3)); };
  const panAt = k => { const a = tilt() * Math.PI / 180, s = k === 0 ? -1 : 1; return [PX + s * L * Math.cos(a), PY - s * L * Math.sin(a) + 120]; };
  const coinG = c => {
    const g = svgEl("g", { style: "cursor:grab" });
    g.append(svgEl("circle", { cx: c.x, cy: c.y, r: c.r, fill: c.fill, stroke: c.rim, "stroke-width": 5 }), txt(c.x, c.y, c.name, c.r * .55));
    return g;
  };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
    svg.append(svgEl("path", { d: `M${PX - 60},${H - 20} L${PX + 60},${H - 20} L${PX + 12},${PY} L${PX - 12},${PY}Z`, fill: "#C9D4CF" }));
    const a = tilt() * Math.PI / 180;
    svg.append(svgEl("line", { x1: PX - L * Math.cos(a), y1: PY + L * Math.sin(a), x2: PX + L * Math.cos(a), y2: PY - L * Math.sin(a), stroke: INK, "stroke-width": 8, "stroke-linecap": "round" }));
    svg.append(svgEl("circle", { cx: PX, cy: PY, r: 12, fill: TENT }));
    [0, 1].forEach(k => {
      const [x, y] = panAt(k), ex = x, ey = y - 120;
      svg.append(svgEl("line", { x1: ex, y1: ey, x2: x - 80, y2: y, stroke: "#5B6B6B", "stroke-width": 2 }), svgEl("line", { x1: ex, y1: ey, x2: x + 80, y2: y, stroke: "#5B6B6B", "stroke-width": 2 }));
      svg.append(svgEl("path", { d: `M${x - 95},${y} Q${x},${y + 40} ${x + 95},${y}Z`, fill: "#EEF2F0", stroke: INK, "stroke-width": 3 }));
      const c = coins.find(c => c.pan === k);
      if (c) { c.x = x; c.y = y - c.r + 8; svg.append(f1SvgLine(`${f1Tk(c.w)} g`, x, y + 58, 26, { fill: "#1F2F4A" })); }
    });
    coins.forEach(c => svg.append(coinG(c)));
    if (coins.every(c => c.pan == null)) svg.append(txt(PX, H - 72, "동전을 끌어 접시에 올려요", 22, { fill: "#5B6B6B" }));
  };
  dragOn(svg, p => { drag = coins.find(c => Math.hypot(p.x - c.x, p.y - c.y) < c.r + 10) || null; if (!drag) return false; drag.pan = null; return true; },
    p => { drag.x = p.x; drag.y = p.y; draw(); },
    () => { const c = drag; drag = null; let best = null; [0, 1].forEach(k => { const [x, y] = panAt(k); const dd = Math.hypot(c.x - x, c.y - (y - 30)); if (dd < 140 && !coins.some(o => o !== c && o.pan === k) && (!best || dd < best.d)) best = { k, d: dd }; });
      if (best) c.pan = best.k; else { c.x = c.home[0]; c.y = c.home[1]; } draw(); });
  draw();
  const ask = h("div", { class: "f1ask" });
  body.append(h("div", { class: "f1stage" }, svg), ask);
  f1Ask(ask, api, () => coins.every(c => c.pan != null), "두 동전을 모두 저울 접시에 올려요.", opt);
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
  const W = 900, H = 560, EDGE = 64, NEAR = 520, R = 38, LX = [330, 570], NAMES = ["나", "로봇"];
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
      ctrl.append(h("span", { class: "jua" }, exprOf(0) + " ="), inp, h("button", { class: "f1on", onclick: () => {
        const want = G.vals[0] + G.op[0] * pieceU(G.pos[0].p), r = inp.get(), J = f1Judge(r, f1Form(want, S.d), S.d);
        if (J.code === "diffden" || J.code === "zero") return api.hint(J.msg);
        if (J.code !== "ok") { inp.paint(false); return api.fail(J.msg || f1Diag(exprOf(0).replace(/\s/g, ""), r) || `${f1J(`[1/${S.d}]`, "이가")} 몇 개인지 세어 다시 계산해 봐요.`, `${exprOf(0)} = ${inp.text()}`); }
        G.log.push([`${exprOf(0)} = ${U(want)}`, ""]); G.vals[0] = want;
        const bw = G.vals[1] + G.op[1] * pieceU(G.pos[1].p); G.botWant = bw;
        G.botSay = Math.random() < .35 ? (bw > 1 && Math.random() < .5 ? bw - 1 : bw + 1) : bw;
        G.phase = "bot"; api.hint(`맞았어요! 내 값은 ${f1J(U(want), "이에요")}.`); render();
      } }, "계산 확인"));
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

/* 생각을 더하다: 음료 재료 카드 */
function f1Recipe() {
  f1Style();
  return h("div", { class: "f1card2" },
    h("div", {}, h("b", {}, "필요한 재료 (1잔)"), h("div", {}, "매실에이드: 탄산수 1병 + 매실청 [2 3/4] 큰술"), h("div", {}, "레모네이드: 탄산수 1병 + 레몬청 [3 1/3] 큰술")),
    h("div", {}, h("b", {}, "가지고 있는 재료"), h("div", {}, "탄산수 10병, 매실청 9 큰술, 레몬청 15 큰술")),
    h("div", {}, h("b", {}, "주문서"), h("div", {}, "① 매실에이드 1잔, 레모네이드 2잔"), h("div", {}, "② 매실에이드 2잔"), h("div", {}, "③ 레모네이드 2잔")));
}
/* 공부한 내용을 확인해요 6번: 은우네 동네 지도 */
function f1Map() {
  f1Style();
  const svg = makeSvg(900, 330);
  const P = { home: [130, 250], post: [450, 80], art: [770, 250] };
  const road = (a, b, lab, ly) => { svg.append(svgEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#C9A777", "stroke-width": 16, "stroke-linecap": "round" })); svg.append(f1SvgLine(lab, (a[0] + b[0]) / 2, ly, 26, { fill: "#1F2F4A" })); };
  road(P.home, P.post, "[1 5/8] km", 140); road(P.post, P.art, "[1 3/8] km", 140); road(P.home, P.art, "[2 6/8] km", 290);
  [["home", "은우네 집", "#9CC6EC"], ["post", "우체국", "#F6C08A"], ["art", "미술관", "#A9D8A2"]].forEach(([k, n, c]) => {
    const [x, y] = P[k]; svg.append(svgEl("rect", { x: x - 62, y: y - 28, width: 124, height: 56, rx: 12, fill: c, stroke: INK, "stroke-width": 3 }), txt(x, y, n, 22));
  });
  return h("div", { class: "f1stage", style: "max-width:44em" }, svg);
}
//@@LESSONS
const UNIT_STORY = { title: "우주 호텔의 시우와 혜지", lines: [
  "미래의 어느 날, 시우는 부모님과 함께 우주 호텔에 살고 있어요. 지구에서 온 친구 혜지와 함께 우주 채소를 키우고, 우주 식량을 먹고, 찰흙으로 우주 탐사선도 만들어요.",
  "우유 나누어 마시기, 재배기에 물 주기, 수수깡 나비, 실뜨기, 생일 떡케이크, 찰흙 탐사선에서 분모가 같은 분수를 더하고 빼요.",
  "교과서 「수학 4-2」 1. 분수의 덧셈과 뺄셈의 차시 순서 그대로 만들었어요."],
  one: "분수의 덧셈과 뺄셈 · 분수를 단위분수의 개수로 보고, 분모는 그대로 두고 분자끼리 더하고 빼요." };
const UNIT_KEYWORDS = ["단위분수", "분모", "분자", "진분수", "가분수", "대분수", "분모는 그대로", "분자끼리 더하기", "분자끼리 빼기", "자연수 부분끼리", "분수 부분끼리", "가분수로 바꾸어 계산", "1 = 분모와 분자가 같은 분수", "1만큼을 분수로 바꾸기", "어림하기"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 우주 호텔에서 분수를 만나요", soop: "개념 찾기(S)",
  question: "분수의 덧셈과 뺄셈은 자연수의 덧셈과 뺄셈과 어떤 공통점과 차이점이 있을까요?",
  summary: "우리 주변에는 분수를 더하거나 빼야 하는 상황이 많아요. 음식을 만들 때 쓰는 재료의 양을 모두 구할 때는 더하고, 먹고 남은 양이나 차를 구할 때는 빼요. 3학년 때 배운 분수, 분수의 크기 비교, 진분수·가분수·대분수를 떠올려 두면 이 단원을 잘 배울 수 있어요.",
  steps: [
    { name: "살펴보기", inst: "자판기는 동전의 무게로 어떤 동전인지 구별한대요. 100원짜리 동전은 [5 21/50] g, 10원짜리 동전은 [1 11/50] g이에요(한국은행, 2023). 두 동전을 끌어 저울 접시에 하나씩 올려 보세요.", hints: ["동전을 눌러 끌어 접시 위에 놓아요.", "100원짜리 동전과 10원짜리 동전은 무게가 서로 달라서 저울이 기울어요."],
      render: (b, a) => f1Coins(b, a, { w100: "5 21/50", w10: "1 11/50", ok: "100원짜리 동전 쪽으로 저울이 기울었어요. 두 동전의 무게의 차는 몇 g일까요? 이 단원에서 분수의 뺄셈으로 구할 수 있어요." }) },
    { name: "이야기하기", inst: "우리 주변에서 분수의 덧셈과 뺄셈을 할 수 있는 상황이에요. 덧셈으로 구하는 것과 뺄셈으로 구하는 것으로 나누어 보세요.", hints: ["‘모두’, ‘함께’ 얼마인지 구할 때는 더해요.", "‘남은’ 양이나 ‘얼마나 더’ 많은지 구할 때는 빼요."],
      render: (b, a) => f1Sort(b, a, { bins: ["덧셈으로 구해요", "뺄셈으로 구해요"], cards: [
        { t: "음식을 만들 때 사용한 재료의 양은 모두 얼마일까?", k: 0 },
        { t: "미술 시간에 함께 사용한 철사의 길이는 모두 몇 m일까?", k: 0 },
        { t: "두 재배기에 준 물의 양은 모두 몇 L일까?", k: 0 },
        { t: "먹고 남은 피자의 양은 얼마일까?", k: 1, why: "먹고 ‘남은’ 양은 처음 양에서 먹은 양을 빼서 구해요." },
        { t: "누가 음료수를 얼마나 더 많이 가지고 있을까?", k: 1, why: "얼마나 ‘더’ 많은지는 두 양의 차예요. 빼서 구해요." },
        { t: "100원짜리와 10원짜리 동전의 무게의 차는 몇 g일까?", k: 1, why: "무게의 ‘차’는 무거운 쪽에서 가벼운 쪽을 빼서 구해요." }],
        ok: "모두 얼마인지는 덧셈으로, 남은 양이나 차는 뺄셈으로 구해요." }) },
    { name: "떠올리기 ① 분수", inst: "곰곰! 3학년 때 배운 분수를 떠올려요. 막대 전체를 똑같이 5로 나눈 것 중의 3만큼 색칠하고 빈칸을 채워 보세요.", hints: ["전체를 똑같이 5로 나눈 것 중의 3은 [3/5]이에요.", "[3/5]은 [1/5]이 3개예요."],
      render: (b, a) => f1Bars(b, a, { d: 5, bars: [{ name: "[3/5]", k: 3 }], ask: [
        ["전체를 똑같이 5로 나눈 것 중의 3 → ", { q: [null, "?3", "?5"] }],
        ["[3/5]은 [1/5]이 ", { i: "3" }, "개예요."]], ok: "[3/5]은 [1/5]이 3개예요. 이렇게 단위분수의 개수로 보면 분수를 더하고 빼기 쉬워요." }) },
    { name: "떠올리기 ② 여러 가지 분수", inst: "진분수, 가분수, 대분수를 떠올려 분수 카드를 나누어 보세요.", hints: ["분자가 분모보다 작으면 진분수, 분자가 분모와 같거나 분모보다 크면 가분수예요.", "자연수와 진분수로 이루어진 분수는 대분수예요."],
      render: (b, a) => f1Sort(b, a, { bins: ["진분수", "가분수", "대분수"], cards: [
        { t: "[3/7]", k: 0 }, { t: "[9/4]", k: 1 }, { t: "[1 2/5]", k: 2 }, { t: "[5/5]", k: 1, why: "[5/5]는 분자와 분모가 같아요. 분자가 분모와 같거나 분모보다 크면 가분수예요." },
        { t: "[2/9]", k: 0 }, { t: "[3 1/6]", k: 2 }, { t: "[11/6]", k: 1 }],
        ok: "진분수는 [3/7], [2/9], 가분수는 [9/4], [5/5], [11/6], 대분수는 [1 2/5], [3 1/6]이에요." }) },
    { name: "확인하기", inst: "대분수는 가분수로, 가분수는 대분수로 나타내어 보세요. 이 단원에서 자주 쓰여요.", hints: ["[2 1/4]에서 자연수 2는 [8/4]이에요. [8/4]과 [1/4]을 더해요.", "[13/5]에서 [10/5]은 2예요. 남는 것은 [3/5]이에요."],
      render: (b, a) => f1Chain(b, a, [
        ["[2 1/4] = ", { q: [null, "?9", "4"] }],
        ["[1 3/5] = ", { q: [null, "?8", "5"] }],
        ["[13/5] = ", { q: ["?2", "?3", "5"] }],
        ["[11/6] = ", { q: ["?1", "?5", "6"] }]], { ok: "가분수와 대분수를 자유롭게 바꿀 수 있어요. 분수의 덧셈과 뺄셈을 배울 준비가 됐어요!", bad: "자연수 1은 분모와 분자가 같은 분수예요. 1 = [4/4] = [5/5] = [6/6]을 떠올려요." }) }
  ],
  challenge: { inst: "곰곰! 분수의 크기를 비교해 보세요.", hints: ["분모가 같으면 분자가 클수록 큰 분수예요.", "단위분수는 분모가 작을수록 커요."],
    render: (b, a) => quiz(b, a, [
      { q: "[5/8]와 [3/8] 중 더 큰 분수는?", o: ["[5/8]", "[3/8]"], a: 0 },
      { q: "[1/4]과 [1/6] 중 더 큰 분수는?", o: ["[1/4]", "[1/6]"], a: 0, why: { "1": "단위분수는 분모가 작을수록 커요. 4로 나눈 한 조각이 6으로 나눈 한 조각보다 커요." } },
      { q: "[2 1/3]과 [8/3] 중 더 큰 분수는?", o: ["[2 1/3]", "[8/3]"], a: 1, why: { "0": "[2 1/3]을 가분수로 나타내면 [7/3]이에요. [7/3]과 [8/3]을 비교해요." } }],
      { ok: "[5/8], [1/4], [8/3]이 더 커요. 크기를 비교할 때도 가분수와 대분수를 바꾸어 보면 편리해요." }) }
},
{
  id: "t2", no: 2, title: "진분수의 덧셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "분모가 같은 진분수의 덧셈은 어떻게 할까요?",
  summary: "분모가 같은 분수의 덧셈은 분모는 그대로 쓰고, 분자끼리 더해요. [3/7]+[5/7]는 [1/7]이 3+5=8개이므로 [8/7]이고, 합이 가분수이면 대분수 [1 1/7]로 나타낼 수 있어요.",
  steps: [
    { name: "색칠해 보기", inst: "로봇 선생님이 우유 전체를 똑같이 4로 나눈 것 중의 2만큼은 시우에게, 1만큼은 혜지에게 따라 주었어요. 두 사람이 마신 우유의 양을 색칠해 보세요.", hints: ["시우는 4칸 중 2칸, 혜지는 4칸 중 1칸을 색칠해요.", "[2/4]는 [1/4]이 2개예요. 두 사람이 마신 양은 [1/4]이 모두 몇 개일까요?"],
      render: (b, a) => f1Bars(b, a, { d: 4, bars: [{ name: "시우", k: 2, col: 0 }, { name: "혜지", k: 1, col: 1 }], ask: [
        ["시우가 마신 양 ", { q: [null, "?2", "?4"] }, " · 혜지가 마신 양 ", { q: [null, "?1", "?4"] }],
        ["[2/4]는 [1/4]이 ", { i: "2" }, "개, [2/4]+[1/4]은 [1/4]이 ", { i: "3" }, "개예요."],
        ["두 사람이 마신 우유의 양 [2/4]+[1/4] = 전체의 ", { q: [null, "?3", "?4"] }]], ok: "시우와 혜지가 마신 우유는 전체의 [3/4]이에요. [1/4]이 2개와 1개, 모두 3개예요." }) },
    { name: "수직선에 나타내기", inst: "[3/7]+[5/7]를 수직선에 나타내어 계산해 보세요. 작은 눈금 한 칸은 [1/7]이에요.", hints: ["0에서 오른쪽으로 3칸 간 곳이 [3/7]이에요.", "거기에서 5칸을 더 가요. 모두 8칸이에요."],
      render: (b, a) => f1Line(b, a, { d: 7, max: 2, a: "3/7", b: "5/7", op: "+", ask: [
        ["[3/7]은 [1/7]이 ", { i: "3" }, "개, [5/7]는 [1/7]이 ", { i: "5" }, "개 → 합은 [1/7]이 ", { i: "8" }, "개"],
        ["[3/7]+[5/7] = ", { q: [null, ["?3", "+", "?5"], "7"] }, " = ", { q: [null, "?8", "7"] }, " = ", { q: ["?1", "?1", "7"] }]], ok: "수직선에서 [1/7]이 8칸이에요. [3/7]+[5/7] = [8/7] = [1 1/7]이에요. 합이 가분수이면 대분수로 나타낼 수 있어요." }) },
    { name: "말해 보기", inst: "친구가 [3/7]+[5/7] = [8/14]이라고 계산했어요. 무엇이 잘못되었는지 알맞은 말을 골라 보세요.", hints: ["[3/7]과 [5/7]는 모두 [1/7]이 몇 개인 수예요.", "[1/7]이 8개인 수의 분모는 여전히 7이에요."],
      render: (b, a) => blanks(b, a, ["친구는 ", { o: ["분모끼리도 더했어요", "분자끼리 뺐어요"], a: 0 }, ". [3/7]과 [5/7]는 모두 ", { o: ["[1/7]", "[1/14]"], a: 0 }, "이 몇 개인 수이므로, 더해도 단위분수는 바뀌지 않아요. 그래서 분모는 ", { o: ["그대로 7", "14"], a: 0 }, "이고, 분자끼리 더하면 [1/7]이 ", { o: ["8개", "15개"], a: 0 }, "예요."], { ok: "[1/7]이 3개와 5개를 더하면 [1/7]이 8개예요. 자연수 3+5=8처럼 단위분수의 개수를 더해요." }) },
    { name: "약속하기", inst: "진분수의 덧셈 방법을 약속해요. 알맞은 말을 골라 보세요.", hints: ["분모는 단위분수의 크기, 분자는 단위분수의 개수예요."],
      render: (b, a) => blanks(b, a, ["분모가 같은 분수의 덧셈은 분모는 ", { o: ["그대로 쓰고", "분모끼리 더하고"], a: 0 }, ", 분자끼리 ", { o: ["더합니다", "곱합니다"], a: 0 }, ". 합이 가분수이면 ", { o: ["대분수", "진분수"], a: 0 }, "로 나타낼 수 있어요."], { ok: "분모가 같은 분수의 덧셈은 분모는 그대로 쓰고, 분자끼리 더합니다." }) },
    { name: "확인하기", inst: "계산해 보세요. 합은 가분수로 써도, 대분수로 써도 맞아요.", hints: ["분모는 그대로, 분자끼리 더해요.", "분자와 분모가 같으면 1이에요."],
      render: (b, a) => f1Calc(b, a, [
        { e: "[3/8]+[4/8]", a: "7/8" }, { e: "[7/9]+[2/9]", a: "1" }, { e: "[4/6]+[5/6]", a: "1 3/6" },
        { q: "재생비누를 만드는 데 폐식용유를 예지는 [4/5] L, 수호는 [2/5] L 사용했어요. 두 사람이 사용한 폐식용유는 모두 몇 L일까요?", x: "[4/5]+[2/5]", a: "1 1/5", unit: "L", lab: "[4/5]+[2/5] =" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["걸은 거리와 버스를 탄 거리를 더해요.", "[3/7]+[□/7]이 1보다 작으려면 분자의 합이 7보다 작아야 해요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "민혁이는 집에서 출발하여 [6/10] km는 걷고 [7/10] km는 버스를 타고 학교에 갔어요. 집에서 학교까지의 거리는 몇 km일까요?", x: "[6/10]+[7/10]", a: "1 3/10", unit: "km", lab: "[6/10]+[7/10] =" },
      { q: "[3/7]+[□/7] < 1에서 □ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?", n: 3, unit: "개", lab: "개수", why: { "4": "□가 4이면 [3/7]+[4/7] = [7/7] = 1이에요. 1보다 작아야 하니 4는 들어갈 수 없어요." } }]) }
},
{
  id: "t3", no: 3, title: "대분수의 덧셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "분모가 같은 대분수의 덧셈은 어떻게 할까요?",
  summary: "대분수의 덧셈은 자연수 부분끼리, 분수 부분끼리 더하거나, 대분수를 가분수로 바꾸어 계산해요. 분수 부분끼리 더한 것이 가분수이면 대분수로 바꾸어 자연수 부분에 더해요. 예: [1 3/5]+[2 4/5] = 3+[7/5] = 3+[1 2/5] = [4 2/5]",
  steps: [
    { name: "색칠하고 모으기", inst: "우주 호텔 재배실에서 배추를 심은 재배기에는 물을 [2 1/4] L, 무를 심은 재배기에는 [1 2/4] L 사용했어요. 1 L를 4칸으로 나눈 막대에 두 물의 양을 색칠하고 모아 보세요.", hints: ["[2 1/4] L는 막대 2개를 다 칠하고 1칸 더, [1 2/4] L는 막대 1개를 다 칠하고 2칸 더 칠해요.", "‘모으기’를 누르면 자연수 부분끼리, 분수 부분끼리 모여요."],
      render: (b, a) => f1Fill(b, a, { d: 4, A: { name: "배추", v: "2 1/4" }, B: { name: "무", v: "1 2/4" },
        est: { q: "[2 1/4]+[1 2/4]는 몇 L쯤일까요?", o: ["2 L쯤", "3 L쯤", "5 L쯤"], a: 1, why: { "0": "2 L쯤과 1 L쯤을 더해 봐요.", "2": "자연수 부분 2와 1을 더해 봐요." }, ok: "2 L쯤과 1 L쯤을 더했으니 3 L쯤이에요. 이제 그림으로 정확히 구해요." },
        askCalc: [{ e: "[2 1/4]+[1 2/4]", a: "3 3/4", unit: "L" }], ok: "재배기에 사용한 물은 모두 [3 3/4] L예요. 어림한 3 L쯤보다 조금 더 많아요." }) },
    { name: "방법 1 · 나누어 더하기", inst: "[1 3/5]+[2 4/5]를 그림에 색칠하고 모은 다음, 자연수 부분끼리, 분수 부분끼리 더해 보세요.", hints: ["분수 부분끼리 더하면 [3/5]+[4/5] = [7/5]이에요.", "[7/5]은 [5/5]=1과 [2/5]예요. 1을 자연수 부분에 더해요."],
      render: (b, a) => f1Fill(b, a, { d: 5, A: { name: "가", v: "1 3/5" }, B: { name: "나", v: "2 4/5" }, ask: [
        { t: "방법 1", p: ["[1 3/5]+[2 4/5] = (", { i: "1" }, "+", { i: "2" }, ")+([3/5]+[4/5])"] },
        [" = ", { i: "3" }, "+", { q: [null, "?7", "5"] }, " = 3+", { q: ["?1", "?2", "5"] }, " = ", { q: ["?4", "?2", "5"] }]], ok: "분수 부분끼리 더한 [7/5]에서 생긴 1을 자연수 부분에 더해 [4 2/5]가 되었어요." }) },
    { name: "방법 2 · 가분수로", inst: "이번에는 대분수를 가분수로 나타내어 [1 3/5]+[2 4/5]를 계산하고, 두 방법을 비교해 보세요.", hints: ["[1 3/5] = [8/5], [2 4/5] = [14/5]예요.", "[22/5]에서 [20/5]은 4예요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "방법 2", p: ["[1 3/5]+[2 4/5] = ", { q: [null, "?8", "5"] }, "+", { q: [null, "?14", "5"] }, " = ", { q: [null, "?22", "5"] }, " = ", { q: ["?4", "?2", "5"] }] },
        ["방법 1은 ", { c: ["자연수 부분과 분수 부분으로 나누어서", "대분수를 가분수로 바꾸어"], a: 0 }, " 계산했고,"],
        ["방법 2는 ", { c: ["자연수 부분과 분수 부분으로 나누어서", "대분수를 가분수로 바꾸어"], a: 1 }, " 계산했어요."]], { ok: "두 방법 모두 답은 [4 2/5]예요. 편리한 방법을 골라 계산해요." }) },
    { name: "정리하기", inst: "대분수의 덧셈 방법을 정리해요. 알맞은 말을 골라 보세요.", hints: ["분수 부분의 합이 1이거나 1보다 크면 1을 자연수 부분으로 옮겨요."],
      render: (b, a) => blanks(b, a, ["대분수의 덧셈은 자연수 부분끼리, ", { o: ["분수 부분끼리", "분모끼리"], a: 0 }, " 더하거나, 대분수를 ", { o: ["가분수", "진분수"], a: 0 }, "로 바꾸어 계산해요. 분수 부분끼리 더한 것이 가분수이면 ", { o: ["대분수로 바꾸어 자연수 부분에 더해요", "그대로 두어요"], a: 0 }, "."], { ok: "두 방법 모두 쓸 수 있어요. 어느 방법이 더 옳은 것은 아니에요." }) },
    { name: "확인하기", inst: "계산해 보세요. 합은 가분수로 써도, 대분수로 써도 맞아요.", hints: ["자연수 부분끼리, 분수 부분끼리 더해요.", "[3 5/8]+[10/8]은 [3 5/8]를 [29/8]로 바꾸어 계산해도 돼요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[1 1/7]+[2 4/7]", a: "3 5/7" }, { e: "[2 5/6]+[3 2/6]", a: "6 1/6" }, { e: "[3 5/8]+[10/8]", a: "4 7/8" }]) }
  ],
  challenge: { inst: "수 카드 3, 6, 8, 9 중에서 2장을 골라 분모가 11인 대분수를 만들려고 해요. 가장 큰 대분수와 가장 작은 대분수를 만들고, 두 수의 합을 구해 보세요.", hints: ["대분수의 분자는 분모 11보다 작아야 해요.", "가장 큰 대분수는 자연수 부분에 가장 큰 수를 놓아요."],
    render: (b, a) => f1Cards(b, a, { cards: [3, 6, 8, 9], den: 11 }) }
},
{
  id: "t4", no: 4, title: "진분수의 뺄셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "분모가 같은 진분수의 뺄셈은 어떻게 할까요?",
  summary: "분모가 같은 분수의 뺄셈은 분모는 그대로 쓰고, 분자끼리 빼요. [5/6]−[2/6]는 [1/6]이 5−2=3개이므로 [3/6]이에요. 약분은 아직 배우지 않았으니 [3/6] 그대로 써요.",
  steps: [
    { name: "색칠해 보기", inst: "시우와 혜지는 수수깡 1개를 똑같이 7조각으로 나눈 것 중 4조각을 날개에, 3조각을 몸통에 붙여 나비를 꾸몄어요. 사용한 수수깡을 각각 색칠해 보세요.", hints: ["날개는 7칸 중 4칸, 몸통은 7칸 중 3칸이에요.", "두 막대의 조각 크기가 같으니 칸 수를 비교하면 돼요."],
      render: (b, a) => f1Bars(b, a, { d: 7, bars: [{ name: "날개", k: 4, col: 2 }, { name: "몸통", k: 3, col: 3 }], ask: [
        ["날개 ", { q: [null, "?4", "?7"] }, " · 몸통 ", { q: [null, "?3", "?7"] }],
        ["[4/7]와 [3/7]은 [1/7]이 각각 ", { i: "4" }, "개, ", { i: "3" }, "개예요."],
        ["[4/7]−[3/7]은 [1/7]이 ", { i: "1" }, "개 → 날개에 전체의 ", { q: [null, "?1", "?7"] }, "만큼 더 사용했어요."]], ok: "날개에는 몸통보다 수수깡을 전체의 [1/7]만큼 더 많이 사용했어요." }) },
    { name: "수직선에 나타내기", inst: "[5/6]−[2/6]를 수직선에 나타내어 계산해 보세요. 작은 눈금 한 칸은 [1/6]이에요.", hints: ["0에서 5칸 간 곳이 [5/6]예요.", "거기에서 왼쪽으로 2칸 되돌아와요."],
      render: (b, a) => f1Line(b, a, { d: 6, max: 1, a: "5/6", b: "2/6", op: "-", ask: [
        ["[5/6]와 [2/6]는 [1/6]이 각각 ", { i: "5" }, "개, ", { i: "2" }, "개 → 차는 [1/6]이 ", { i: "3" }, "개"],
        ["[5/6]−[2/6] = ", { q: [null, ["?5", "−", "?2"], "6"] }, " = ", { q: [null, "?3", "6"] }]], ok: "[5/6]−[2/6] = [3/6]이에요. [1/6]이 5개에서 2개를 빼면 3개가 남아요." }) },
    { name: "말해 보기", inst: "[5/6]−[2/6]를 단위분수의 개수로 설명해 보세요.", hints: ["분자는 [1/6]의 개수예요."],
      render: (b, a) => blanks(b, a, ["[5/6]는 [1/6]이 5개, [2/6]는 [1/6]이 2개예요. [5/6]−[2/6]는 [1/6]이 ", { o: ["3개", "7개", "1개"], a: 0 }, "이므로 ", { o: ["[3/6]", "[3/0]", "[7/6]"], a: 0 }, "이에요. 빼도 단위분수 [1/6]의 크기는 ", { o: ["그대로예요", "작아져요"], a: 0 }, "."], { ok: "자연수 5−2=3처럼 단위분수의 개수를 빼요." }) },
    { name: "약속하기", inst: "진분수의 뺄셈 방법을 약속해요. 알맞은 말을 골라 보세요.", hints: ["덧셈의 약속을 떠올려요. 분모는 그대로였어요."],
      render: (b, a) => blanks(b, a, ["분모가 같은 분수의 뺄셈은 분모는 ", { o: ["그대로 쓰고", "분모끼리 빼고"], a: 0 }, ", 분자끼리 ", { o: ["뺍니다", "더합니다"], a: 0 }, "."], { ok: "분모가 같은 분수의 뺄셈은 분모는 그대로 쓰고, 분자끼리 뺍니다." }) },
    { name: "확인하기", inst: "계산해 보세요.", hints: ["분모는 그대로, 분자끼리 빼요.", "[2/8], [3/9]은 그대로 답이에요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[3/4]−[2/4]", a: "1/4" }, { e: "[6/8]−[4/8]", a: "2/8" }, { e: "[8/9]−[5/9]", a: "3/9" }]) }
  ],
  challenge: { inst: "[4/5]−[3/5]에 알맞은 문제를 완성하고 해결해 보세요. 문제의 앞부분은 “물병에 물이 [4/5] L 들어 있습니다.”예요.", hints: ["[4/5]에서 [3/5]을 빼는 상황이어야 해요.", "마시고 ‘남은’ 양을 묻는 문제가 뺄셈이에요."],
    render: (b, a) => quiz(b, a, [
      { q: "물병에 물이 [4/5] L 들어 있습니다. 뒤에 이어질 알맞은 문장은?", o: ["그중에서 [3/5] L를 마셨습니다. 마시고 남은 물의 양은 몇 L인가요?", "[3/5] L를 더 부었습니다. 물은 모두 몇 L인가요?", "물병 3개에 물이 [4/5] L씩 들어 있습니다. 물은 모두 몇 L인가요?"], a: 0, why: { "1": "더 부으면 물이 늘어나요. 덧셈 상황이에요.", "2": "같은 양이 여러 개 있는 상황은 뺄셈이 아니에요." } },
      { q: "완성한 문제의 답은?", o: ["[1/5] L", "[7/5] L", "[1/0] L"], a: 0, why: { "1": "남은 양은 빼서 구해요.", "2": "분모는 그대로 써요." } }], { ok: "[4/5]−[3/5] = [1/5]. 마시고 남은 물은 [1/5] L예요." }) }
},
{
  id: "t5", no: 5, title: "대분수의 뺄셈을 해 볼까요(1)", soop: "개념 구축하기(O)",
  question: "분수 부분끼리 뺄 수 있는 대분수의 뺄셈은 어떻게 할까요?",
  summary: "분수 부분끼리 뺄 수 있는 대분수의 뺄셈은 자연수 부분끼리, 분수 부분끼리 빼거나, 대분수를 가분수로 바꾸어 계산해요. [2 4/5]−[1 2/5] = (2−1)+([4/5]−[2/5]) = [1 2/5], [2 4/5]−[1 2/5] = [14/5]−[7/5] = [7/5] = [1 2/5]",
  steps: [
    { name: "×표 해 보기", inst: "전망대에서 혜지는 실 [3 3/4] m 중에서 [1 1/4] m를 사용하여 시우에게 실뜨기를 가르쳐 주었어요. 실 그림에서 사용한 만큼 ×표 해 보세요.", hints: ["1 m 막대 하나를 통째로 ×표 하면 1 m를 쓴 거예요.", "[1 1/4] m는 1 m와 [1/4] m예요."],
      render: (b, a) => f1Take(b, a, { d: 4, m: "3 3/4", s: "1 1/4", unit: "m",
        est: { q: "[3 3/4]−[1 1/4]은 몇 m쯤일까요?", o: ["1 m쯤", "2 m쯤", "4 m쯤"], a: 1, why: { "0": "3 m쯤에서 1 m쯤을 빼 봐요.", "2": "남은 실은 처음보다 짧아요." }, ok: "3 m쯤에서 1 m쯤을 뺐으니 2 m쯤이에요." },
        askCalc: [{ e: "[3 3/4]−[1 1/4]", a: "2 2/4", unit: "m" }], ok: "사용하고 남은 실은 [2 2/4] m예요. 어림한 2 m쯤보다 조금 더 길어요." }) },
    { name: "방법 1 · 나누어 빼기", inst: "[2 4/5]−[1 2/5]를 자연수 부분끼리, 분수 부분끼리 빼서 계산해 보세요.", hints: ["자연수 부분끼리 2−1, 분수 부분끼리 [4/5]−[2/5]를 계산해요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "방법 1", p: ["[2 4/5]−[1 2/5] = (", { i: "2" }, "−", { i: "1" }, ")+([4/5]−[2/5])"] },
        [" = ", { i: "1" }, "+", { q: [null, "?2", "5"] }, " = ", { q: ["?1", "?2", "5"] }]], { ok: "자연수 부분은 1, 분수 부분은 [2/5]이므로 [1 2/5]예요." }) },
    { name: "방법 2 · 가분수로", inst: "[2 4/5]−[1 2/5]를 가분수로 바꾸어 계산하고, 두 방법을 비교해 보세요.", hints: ["[2 4/5] = [14/5], [1 2/5] = [7/5]이에요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "방법 2", p: ["[2 4/5]−[1 2/5] = ", { q: [null, "?14", "5"] }, "−", { q: [null, "?7", "5"] }, " = ", { q: [null, "?7", "5"] }, " = ", { q: ["?1", "?2", "5"] }] },
        ["방법 1은 ", { c: ["자연수 부분과 분수 부분으로 나누어서", "대분수를 가분수로 바꾸어"], a: 0 }, " 계산했고,"],
        ["방법 2는 ", { c: ["자연수 부분과 분수 부분으로 나누어서", "대분수를 가분수로 바꾸어"], a: 1 }, " 계산했어요."]], { ok: "두 방법 모두 [1 2/5]예요. 어느 하나가 옳고 다른 하나가 틀린 것이 아니에요." }) },
    { name: "정리하기", inst: "분수 부분끼리 뺄 수 있는 대분수의 뺄셈 방법을 정리해요.", hints: ["덧셈처럼 두 가지 방법이 있어요."],
      render: (b, a) => blanks(b, a, ["분수 부분끼리 뺄 수 있는 대분수의 뺄셈은 자연수 부분끼리, 분수 부분끼리 ", { o: ["빼거나", "더하거나"], a: 0 }, ", 대분수를 ", { o: ["가분수", "자연수"], a: 0 }, "로 바꾸어 계산해요. 어느 방법으로 계산해도 답은 ", { o: ["같아요", "달라요"], a: 0 }, "."], { ok: "편리한 방법을 골라 계산하고, 친구의 방법도 존중해요." }) },
    { name: "확인하기", inst: "계산해 보세요. 차는 가분수로 써도, 대분수로 써도 맞아요.", hints: ["자연수 부분끼리, 분수 부분끼리 빼요.", "[5 9/11]−[18/11]은 [5 9/11]를 [64/11]로 바꾸어 계산할 수 있어요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[8 5/6]−[4 4/6]", a: "4 1/6" }, { e: "[7 6/8]−[1 2/8]", a: "6 4/8" }, { e: "[5 9/11]−[18/11]", a: "4 2/11" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["두 수를 같은 꼴(가분수 또는 대분수)로 바꾸어 계산해요.", "[20/8]은 [2 4/8]예요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "차가 [3 3/7]인 것을 골라요.", pick: ["[4 5/7]−[2 2/7]", "[8 4/7]−[36/7]", "[7 6/7]−[3 3/7]"], a: 1, why: { "0": "[4 5/7]−[2 2/7] = [2 3/7]이에요.", "2": "[7 6/7]−[3 3/7] = [4 3/7]이에요." } },
      { q: "밀가루가 [20/8] kg 있어요. 빵을 만드는 데 [1 3/8] kg을 사용하면 남는 밀가루는 몇 kg일까요?", x: "[20/8]−[1 3/8]", a: "1 1/8", unit: "kg", lab: "[20/8]−[1 3/8] =" }]) }
},
{
  id: "t6", no: 6, title: "자연수와 분수의 뺄셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "(자연수)−(분수)는 어떻게 계산할까요?",
  summary: "자연수에서 분수를 뺄 때는 자연수에서 1만큼을 분모와 분자가 같은 분수로 바꾸어 계산하거나, 자연수와 분수를 모두 가분수로 바꾸어 계산해요. 3−[1 3/4] = [2 4/4]−[1 3/4] = [1 1/4], 3−[1 3/4] = [12/4]−[7/4] = [5/4] = [1 1/4]",
  steps: [
    { name: "×표 해 보기", inst: "시우의 생일에 아버지가 떡케이크를 만들어 주셨어요. 시우와 혜지는 떡케이크 1판 중에서 [5/8]판을 먹었어요. 떡케이크를 8조각으로 자른 다음 먹은 만큼 ×표 해 보세요.", hints: ["1판을 ‘8조각으로 자르기’ 하면 [8/8]이 돼요.", "[5/8]판은 8조각 중 5조각이에요."],
      render: (b, a) => f1Take(b, a, { d: 8, m: "1", s: "5/8", pie: true, splitLabel: "8조각으로 자르기", ask: [
        ["1은 [8/8]이므로 [1/8]이 ", { i: "8" }, "개, [5/8]는 [1/8]이 ", { i: "5" }, "개예요."],
        ["1−[5/8]는 [1/8]이 ", { i: "3" }, "개 → 남은 떡케이크는 ", { q: [null, "?3", "?8"] }, "판이에요."]], ok: "1을 [8/8]로 바꾸면 [8/8]−[5/8] = [3/8]이에요. 남은 떡케이크는 [3/8]판이에요." }) },
    { name: "방법 1 · 1만큼을 분수로", inst: "3−[1 3/4]을 계산해요. 1을 [4/4]로 쪼개어 [1 3/4]만큼 ×표 한 다음, 빈칸을 채워 보세요.", hints: ["3을 [2 4/4]로 나타낼 수 있어요.", "1 = [4/4]예요. 막대 하나를 쪼개면 [1/4]씩 ×표 할 수 있어요."],
      render: (b, a) => f1Take(b, a, { d: 4, m: "3", s: "1 3/4", ask: [
        { t: "방법 1", p: ["3−[1 3/4] = ", { q: ["?2", "?4", "4"] }, "−[1 3/4]"] },
        [" = (", { i: "2" }, "−", { i: "1" }, ")+(", { q: [null, "?4", "4"] }, "−[3/4]) = ", { i: "1" }, "+", { q: [null, "?1", "4"] }, " = ", { q: ["?1", "?1", "4"] }]], ok: "자연수 3에서 1만큼을 [4/4]로 바꾸어 [2 4/4]로 나타내고 계산했어요." }) },
    { name: "방법 2 · 가분수로", inst: "3−[1 3/4]을 가분수로 바꾸어 계산하고, 두 방법을 비교해 보세요.", hints: ["3 = [12/4], [1 3/4] = [7/4]이에요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "방법 2", p: ["3−[1 3/4] = ", { q: [null, "?12", "4"] }, "−", { q: [null, "?7", "4"] }, " = ", { q: [null, "?5", "4"] }, " = ", { q: ["?1", "?1", "4"] }] },
        ["방법 1은 자연수에서 ", { c: ["1만큼을 분수로 바꾸어", "분수를 자연수로 바꾸어"], a: 0 }, " 자연수 부분과 분수 부분으로 나누어서 계산했고,"],
        ["방법 2는 ", { c: ["자연수와 대분수를 모두 가분수로 바꾸어", "자연수 부분끼리만 빼서"], a: 0 }, " 계산했어요."]], { ok: "두 방법 모두 3−[1 3/4] = [1 1/4]이에요." }) },
    { name: "정리하기", inst: "(자연수)−(분수)의 계산 방법을 정리해요.", hints: ["1 = [2/2] = [3/3] = [4/4] = …"],
      render: (b, a) => blanks(b, a, ["(자연수)−(분수)는 자연수에서 ", { o: ["1만큼을", "분모만큼을"], a: 0 }, " 분모와 분자가 같은 분수로 바꾸어 계산하거나, 자연수와 분수를 모두 ", { o: ["가분수", "진분수"], a: 0 }, "로 바꾸어 계산해요. 예를 들어 4는 ", { o: ["[3 5/5]", "[4 5/5]"], a: 0 }, "로 나타낼 수 있어요."], { ok: "자연수에서 1만큼을 분수로 바꾸면 분수를 뺄 수 있어요." }) },
    { name: "확인하기", inst: "계산해 보세요. 차는 가분수로 써도, 대분수로 써도 맞아요.", hints: ["1 = [6/6], 5 = [4 7/7], 4 = [3 5/5]로 바꾸어 봐요."],
      render: (b, a) => f1Calc(b, a, [{ e: "1−[4/6]", a: "2/6" }, { e: "5−[6/7]", a: "4 1/7" }, { e: "4−[2 2/5]", a: "1 3/5" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["남은 철사는 4에서 사용한 두 길이를 빼서 구해요.", "두 식을 계산하여 대분수로 바꾸어 비교해요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "철사 4 m가 있어요. 민서가 [1 1/8] m, 도현이가 [5/8] m를 사용했어요. 남은 철사는 몇 m일까요?", x: "4−[1 1/8]−[5/8]", a: "2 2/8", unit: "m", lab: "4−[1 1/8]−[5/8] =" },
      { q: "차가 더 큰 것을 골라요.", pick: ["5−[23/10]", "4−[1 2/10]"], a: 1, why: { "0": "5−[23/10] = [27/10] = [2 7/10], 4−[1 2/10] = [2 8/10]이에요. 다시 비교해요." } }]) }
},
{
  id: "t7", no: 7, title: "대분수의 뺄셈을 해 볼까요(2)", soop: "개념 구축하기(O)",
  question: "분수 부분끼리 뺄 수 없는 대분수의 뺄셈은 어떻게 할까요?",
  summary: "분수 부분끼리 뺄 수 없으면 빼어지는 수의 자연수에서 1만큼을 분모와 분자가 같은 분수로 바꾸어 계산하거나, 두 대분수를 가분수로 바꾸어 계산해요. [4 1/3]−[1 2/3] = [3 4/3]−[1 2/3] = [2 2/3], [4 1/3]−[1 2/3] = [13/3]−[5/3] = [8/3] = [2 2/3]",
  steps: [
    { name: "×표 해 보기", inst: "시우와 혜지는 찰흙 [3 3/6] kg 중에서 [1 4/6] kg을 사용하여 우주 탐사선을 만들었어요. 사용한 찰흙만큼 ×표 해 보세요.", hints: ["[3/6]에서는 [4/6]만큼 ×표 할 수 없어요. 어떻게 하면 될까요?", "1 kg 막대 하나를 쪼개면 [6/6]이 되어 한 칸씩 ×표 할 수 있어요."],
      render: (b, a) => f1Take(b, a, { d: 6, m: "3 3/6", s: "1 4/6", unit: "kg",
        est: { q: "[3 3/6]−[1 4/6]는 몇 kg쯤일까요?", o: ["1 kg쯤", "2 kg쯤", "3 kg쯤"], a: 1, why: { "0": "3 kg쯤에서 1 kg쯤을 빼 봐요.", "2": "사용하고 남은 양은 처음보다 적어요." }, ok: "3 kg쯤에서 1 kg쯤을 뺐으니 2 kg쯤이에요." },
        askCalc: [{ e: "[3 3/6]−[1 4/6]", a: "1 5/6", unit: "kg" }], ok: "사용하고 남은 찰흙은 [1 5/6] kg이에요. 어림한 2 kg쯤보다 조금 더 적어요." }) },
    { name: "방법 1 · 1만큼을 분수로", inst: "[4 1/3]−[1 2/3]를 수직선에 나타낸 다음, 자연수에서 1만큼을 분수로 바꾸어 계산해 보세요.", hints: ["1 = [3/3]이므로 [4 1/3] = [3 4/3]예요.", "수직선에서 [4 1/3]은 0에서 [1/3]이 13칸인 곳이에요."],
      render: (b, a) => f1Line(b, a, { d: 3, max: 5, a: "4 1/3", b: "1 2/3", op: "-", ask: [
        { t: "방법 1", p: ["[4 1/3]−[1 2/3] = ", { q: ["?3", "?4", "3"] }, "−[1 2/3]"] },
        [" = (", { i: "3" }, "−", { i: "1" }, ")+(", { q: [null, "?4", "3"] }, "−[2/3]) = ", { i: "2" }, "+", { q: [null, "?2", "3"] }, " = ", { q: ["?2", "?2", "3"] }]], ok: "[4 1/3]을 [3 4/3]로 나타내면 분수 부분끼리 뺄 수 있어요." }) },
    { name: "방법 2 · 가분수로", inst: "[4 1/3]−[1 2/3]를 가분수로 바꾸어 계산하고, 두 방법을 비교해 보세요.", hints: ["[4 1/3] = [13/3], [1 2/3] = [5/3]예요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "방법 2", p: ["[4 1/3]−[1 2/3] = ", { q: [null, "?13", "3"] }, "−", { q: [null, "?5", "3"] }, " = ", { q: [null, "?8", "3"] }, " = ", { q: ["?2", "?2", "3"] }] },
        ["방법 1은 자연수에서 ", { c: ["1만큼을 분수로 바꾸어", "큰 분자에서 작은 분자를 빼서"], a: 0 }, " 계산했고,"],
        ["방법 2는 ", { c: ["자연수 부분끼리만 빼서", "대분수를 가분수로 바꾸어"], a: 1 }, " 계산했어요."]], { ok: "두 방법 모두 [2 2/3]예요." }) },
    { name: "정리하기", inst: "친구가 [2 1/4]−[1 3/4]을 (2−1)+([3/4]−[1/4]) = [1 2/4]라고 계산했어요. 알맞은 말을 골라 정리해 보세요.", hints: ["[1 2/4]+[1 3/4]을 계산하면 [2 1/4]이 나올까요?", "빼는 수와 빼어지는 수의 분수 부분을 바꾸어 빼면 안 돼요."],
      render: (b, a) => blanks(b, a, ["[1 2/4]+[1 3/4] = [3 1/4]이므로 [1 2/4]는 ", { o: ["틀린 답이에요", "맞는 답이에요"], a: 0 }, ". 분수 부분끼리 뺄 수 없을 때는 자연수에서 1만큼을 ", { o: ["분모와 분자가 같은 분수", "[1/10]"], a: 0 }, "로 바꾸어 [2 1/4]을 ", { o: ["[1 5/4]", "[2 5/4]"], a: 0 }, "로 나타낸 다음 빼요. 그러면 [1 5/4]−[1 3/4] = ", { o: ["[2/4]", "[1 2/4]"], a: 0 }, "이에요."], { ok: "뺄셈의 답은 덧셈으로 확인할 수 있어요. [2/4]+[1 3/4] = [2 1/4]이 맞아요." }) },
    { name: "확인하기", inst: "계산해 보세요. 차는 가분수로 써도, 대분수로 써도 맞아요.", hints: ["분수 부분끼리 뺄 수 없으면 1만큼을 분수로 바꾸어요.", "가분수로 바꾸어 계산해도 돼요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[3 2/4]−[1 3/4]", a: "1 3/4" }, { e: "[5 1/7]−[2 5/7]", a: "2 3/7" }, { e: "[2 4/8]−[14/8]", a: "6/8" }]) }
  ],
  challenge: { inst: "수학익힘 문제를 풀어 보세요.", hints: ["[6 2/4]−[15/4]를 먼저 계산해요. 대분수로 바꾸면 비교하기 쉬워요.", "두 식을 계산해 대분수로 나타내어 비교해요."],
    render: (b, a) => quiz(b, a, [
      { q: "[6 2/4]−[15/4] > [2 □/4]에서 □ 안에 들어갈 수 있는 자연수를 모두 골라요.", o: ["1", "2", "3"], a: [0, 1], why: {} },
      { q: "[4 2/9]−[2 6/9] ○ [3 5/9]−[16/9] — ○ 안에 알맞은 것은?", o: [">", "=", "<"], a: 2 }],
      { bad: "[6 2/4]−[15/4] = [11/4] = [2 3/4]이에요. [4 2/9]−[2 6/9] = [1 5/9], [3 5/9]−[16/9] = [1 7/9]이에요.", ok: "[2 3/4]보다 작아야 하니 □는 1, 2예요. [1 5/9] < [1 7/9]이에요." }) }
},
{
  id: "t8", no: 8, title: "생각을 더하다 ― 주어진 재료로 음료를 만들어 볼까요", soop: "탐구 정리하기(O)",
  question: "주어진 재료로 음료를 만들고 남은 재료의 양은 어떻게 구할까요?",
  summary: "주문서별로 사용하는 재료의 양을 표로 정리하고 더하면 사용한 양을, 가지고 있는 양에서 사용한 양을 빼면 남은 양을 구할 수 있어요. 남은 재료: 탄산수 3병, 매실청 [3/4] 큰술, 레몬청 [1 2/3] 큰술.",
  steps: [
    { name: "이해해요", inst: "세아는 학교에서 친구들과 함께 일일 찻집을 열었어요. 가지고 있는 재료로 주문서 ①~③의 음료를 만들었어요. 문제를 읽고 알맞은 것을 골라 보세요.", hints: ["구하려는 것은 문제의 마지막 문장에 있어요.", "레모네이드에는 레몬청이 들어가요."],
      render: (b, a) => { b.append(f1Recipe()); quiz(b, a, [
        { q: "구하려는 것은 무엇인가요?", o: ["주문서 ①~③의 음료를 만들고 남은 재료의 양", "음료 한 잔의 값", "만들 수 있는 음료의 수"], a: 0 },
        { q: "레모네이드 1잔에 필요한 레몬청은?", o: ["[2 3/4] 큰술", "[3 1/3] 큰술", "15 큰술"], a: 1 },
        { q: "가지고 있는 매실청은?", o: ["9 큰술", "10 큰술", "15 큰술"], a: 0 }], { ok: "구하려는 것과 주어진 것을 잘 찾았어요." }); } },
    { name: "계획해요", inst: "어떻게 해결할지 계획해요.", hints: ["‘사용하는 양을 모두’ 구할 때와 ‘남은 양’을 구할 때를 생각해요."],
      render: (b, a) => blanks(b, a, ["사용하는 재료의 양은 주문서별로 사용하는 재료의 양을 ", { o: ["더해요", "빼요"], a: 0 }, ". 남은 재료의 양은 가지고 있는 재료에서 사용한 재료의 양을 ", { o: ["빼요", "더해요"], a: 0 }, ". 주문서별로 사용하는 양을 ", { o: ["표로", "그림 한 장으로"], a: 0 }, " 정리하면 보기 쉬워요."], { ok: "더해서 사용한 양을, 빼서 남은 양을 구해요." }) },
    { name: "해결해요 ① 표 만들기", inst: "주문서별로 사용하는 재료의 양을 구해 표를 완성해 보세요. 사용하지 않는 재료는 칸이 없어요.", hints: ["①은 매실에이드 1잔과 레모네이드 2잔이에요. 레몬청은 [3 1/3]+[3 1/3]이에요.", "②의 매실청은 [2 3/4]+[2 3/4]이에요."],
      render: (b, a) => f1Calc(b, a, [
        { g: "① 매실에이드 1잔 · 레모네이드 2잔", lab: "탄산수", x: "1+1+1", n: 3, unit: "병" },
        { g: "① 매실에이드 1잔 · 레모네이드 2잔", lab: "매실청", x: "[2 3/4]", a: "2 3/4", unit: "큰술" },
        { g: "① 매실에이드 1잔 · 레모네이드 2잔", lab: "레몬청", x: "[3 1/3]+[3 1/3]", a: "6 2/3", unit: "큰술" },
        { g: "② 매실에이드 2잔", lab: "탄산수", x: "1+1", n: 2, unit: "병" },
        { g: "② 매실에이드 2잔", lab: "매실청", x: "[2 3/4]+[2 3/4]", a: "5 2/4", unit: "큰술" },
        { g: "③ 레모네이드 2잔", lab: "탄산수", x: "1+1", n: 2, unit: "병" },
        { g: "③ 레모네이드 2잔", lab: "레몬청", x: "[3 1/3]+[3 1/3]", a: "6 2/3", unit: "큰술" }],
        { fig: f1Recipe, ok: "표를 완성했어요. 이제 재료마다 사용한 양을 모두 더해요." }) },
    { name: "해결해요 ② 남은 양", inst: "표를 보고 재료마다 사용한 양을 모두 구한 다음, 남은 재료의 양을 구해 보세요.", hints: ["매실청: [2 3/4]+[5 2/4], 레몬청: [6 2/3]+[6 2/3]", "남은 양: 9−[8 1/4], 15−[13 1/3]. 자연수에서 1만큼을 분수로 바꾸어요."],
      render: (b, a) => f1Calc(b, a, [
        { g: "사용한 양 모두", lab: "탄산수", x: "3+2+2", n: 7, unit: "병" },
        { g: "사용한 양 모두", lab: "매실청 [2 3/4]+[5 2/4] =", x: "[2 3/4]+[5 2/4]", a: "8 1/4", unit: "큰술" },
        { g: "사용한 양 모두", lab: "레몬청 [6 2/3]+[6 2/3] =", x: "[6 2/3]+[6 2/3]", a: "13 1/3", unit: "큰술" },
        { g: "남은 양", lab: "탄산수 10−7 =", x: "10−7", n: 3, unit: "병" },
        { g: "남은 양", lab: "매실청 9−[8 1/4] =", x: "9−[8 1/4]", a: "3/4", unit: "큰술" },
        { g: "남은 양", lab: "레몬청 15−[13 1/3] =", x: "15−[13 1/3]", a: "1 2/3", unit: "큰술" }],
        { ok: "남은 재료는 탄산수 3병, 매실청 [3/4] 큰술, 레몬청 [1 2/3] 큰술이에요." }) },
    { name: "되돌아봐요", inst: "문제를 어떻게 해결했는지 되돌아보고 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "남은 재료의 양을 어떻게 구했는지 설명해 보세요.", tag: "해결 방법", ph: "예) 주문서별로 사용한 양을 표로 정리해 더하고, 가지고 있는 양에서 빼서 구했어요." },
        { q: "다른 방법으로도 구할 수 있을까요?", tag: "다른 방법", ph: "예) 레몬청은 레모네이드가 모두 4잔이니까 [3 1/3]을 4번 더해서 구할 수도 있어요." }]) }
  ],
  challenge: { inst: "척척! 남은 재료로 주문서 ④ 레모네이드 1잔을 만들려고 해요. 더 필요한 재료의 양을 구해 보세요.", hints: ["레모네이드 1잔에는 탄산수 1병과 레몬청 [3 1/3] 큰술이 필요해요.", "남은 레몬청은 [1 2/3] 큰술이에요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "모자라는 재료는 무엇인가요?", pick: ["탄산수", "매실청", "레몬청"], a: 2, why: { "0": "탄산수는 3병 남아서 충분해요.", "1": "레모네이드에는 매실청이 들어가지 않아요." } },
      { q: "더 필요한 레몬청은 몇 큰술일까요?", e: "[3 1/3]−[1 2/3]", a: "1 2/3", unit: "큰술" }], { ok: "레몬청이 [1 2/3] 큰술 더 필요해요." }) }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 말을 튕겨 분수를 더하거나 빼 볼까요", soop: "발표하기(P)",
  question: "말을 튕기는 놀이를 하며 분수를 더하거나 빼 볼까요?",
  summary: "두 말의 위치를 비교하여 내 말이 도착선에 더 가까우면 말에 적힌 분수를 더하고, 더 멀거나 책상 아래로 떨어지면 빼요. 세 번 계산한 뒤 마지막 값이 더 큰 사람이 이겨요. (말의 분수와 처음 수는 이 앱에서 정한 것이에요.)",
  steps: [
    { name: "놀이 방법 알아보기", inst: "놀이 방법을 읽고 알맞은 것을 골라 보세요. 분모가 같은 분수 말 6개를 주머니에 넣고, 차례대로 하나씩 꺼내 책상 위에서 튕겨요.", hints: ["도착선에 더 가까우면 더하고, 더 멀거나 떨어지면 빼요.", "한 번 쓴 말은 주머니에 다시 넣지 않아요."],
      render: (b, a) => quiz(b, a, [
        { q: "내 말이 친구의 말보다 도착선에 더 가까우면?", o: ["내 말에 적힌 분수를 더해요", "내 말에 적힌 분수를 빼요"], a: 0 },
        { q: "내 말이 책상 아래로 떨어지면?", o: ["내 말에 적힌 분수를 더해요", "내 말에 적힌 분수를 빼요"], a: 1 },
        { q: "놀이에서 이기려면?", o: ["세 번 계산한 마지막 값이 친구보다 커야 해요", "말을 가장 멀리 떨어뜨려야 해요"], a: 0 }], { ok: "도착선에 최대한 가깝게, 하지만 떨어지지 않게 튕겨야 해요." }) },
    { name: "연습하기", inst: "분모가 8인 주머니로 놀이한 친구의 계산이에요. 처음 수는 3이에요. 차례대로 계산해 보세요.", hints: ["[3 2/8]는 [2 10/8]으로 바꾸면 [5/8]를 빼기 쉬워요.", "분수 부분의 합이 1이거나 1보다 크면 자연수 부분에 1을 더해요."],
      render: (b, a) => f1Calc(b, a, [
        { q: "1회: “내 말이 도착선에 더 가까우니 [2/8]를 더해야지.”", e: "3+[2/8]", a: "3 2/8" },
        { q: "2회: 말이 떨어져서 [5/8]를 빼요.", e: "[3 2/8]−[5/8]", a: "2 5/8" },
        { q: "3회: 더 가까워서 [7/8]을 더해요.", e: "[2 5/8]+[7/8]", a: "3 4/8" }], { ok: "“나는 [3 4/8]니까 내가 이겼어!” 계산을 차례대로 잘했어요." }) },
    { name: "놀이하기 ① 분모 8", inst: "로봇과 말 튕기기 놀이를 해요. 말을 꺼내 아래로 당겼다 놓거나 힘을 골라 튕기고, 계산 방법에 따라 계산해요. 로봇의 계산이 맞는지도 확인해 주세요.", hints: ["너무 세게 튕기면 책상 아래로 떨어져요.", "로봇도 가끔 틀려요. 직접 계산해 보고 판단해요."],
      render: (b, a) => f1Game(b, a, { sets: [8] }) },
    { name: "놀이하기 ② 분모 6 · 4", inst: "주머니를 바꾸어 놀이해요. 분모가 6이나 4인 진분수, 가분수, 대분수 말이 들어 있어요.", hints: ["대분수와 가분수가 섞여 있으면 같은 꼴로 바꾸어 계산해요.", "분수 부분끼리 뺄 수 없으면 1만큼을 분수로 바꾸어요."],
      render: (b, a) => f1Game(b, a, { sets: [6, 4] }) },
    { name: "또 다른 놀이", inst: "또 다른 놀이: 이긴 사람이 승리 조건을 고르고, 각자 분수 말을 2개씩 골라 동시에 뒤집어요. 나는 [5/6], [1 2/6]를, 친구는 [7/6], [3/6]을 뒤집었어요. 누가 이길까요?", hints: ["[1 2/6]는 [8/6]이에요.", "뺄셈은 큰 분수에서 작은 분수를 빼요."],
      render: (b, a) => quiz(b, a, [
        { q: "승리 조건: 두 분수를 더하여 더 큰 수가 나온 사람", o: ["나", "친구", "비겨요"], a: 0, why: { "1": "나: [5/6]+[1 2/6] = [2 1/6], 친구: [7/6]+[3/6] = [1 4/6]예요." } },
        { q: "승리 조건: 큰 분수에서 작은 분수를 빼서 더 큰 수가 나온 사람", o: ["나", "친구", "비겨요"], a: 1, why: { "0": "나: [1 2/6]−[5/6] = [3/6], 친구: [7/6]−[3/6] = [4/6]예요." } },
        { q: "승리 조건: 큰 분수에서 작은 분수를 빼서 더 작은 수가 나온 사람", o: ["나", "친구", "비겨요"], a: 0 }], { ok: "나의 합 [2 1/6], 친구의 합 [1 4/6] / 나의 차 [3/6], 친구의 차 [4/6]예요." }) }
  ],
  challenge: { inst: "말의 뒷면에 분모가 4인 분수를 적어 놀이했어요. 처음 수 7에서 [6/4]을 빼고, [2 3/4]을 더하고, [9/4]를 뺐어요. 마지막 값은 얼마일까요?", hints: ["앞에서부터 차례대로 계산해요.", "모두 가분수로 바꾸면 [28/4]−[6/4]+[11/4]−[9/4]예요."],
    render: (b, a) => f1Calc(b, a, [{ x: "7−[6/4]+[2 3/4]−[9/4]", a: "6", den: 4, lab: "7−[6/4]+[2 3/4]−[9/4] =" }], { ok: "마지막 값은 6이에요. 분수를 더하고 빼며 끝까지 계산했어요." }) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "분수의 덧셈과 뺄셈을 얼마나 잘 이해했는지 확인해 볼까요?",
  summary: "분모가 같은 분수의 덧셈과 뺄셈은 분모는 그대로 쓰고 분자끼리 계산해요. 대분수는 자연수 부분끼리, 분수 부분끼리 계산하거나 가분수로 바꾸어 계산해요. 분수 부분끼리 뺄 수 없으면 자연수에서 1만큼을 분수로 바꾸어요. 합이나 차는 가분수로 써도, 대분수로 써도 맞아요.",
  steps: [
    { name: "그림 보고 계산하기", inst: "척척! 1번: [3/6]과 [2/6]만큼 색칠하고, 그림을 보고 □ 안에 알맞은 수를 써 보세요.", hints: ["[3/6]은 6칸 중 3칸, [2/6]는 6칸 중 2칸이에요.", "분모는 그대로, 분자끼리 더해요."],
      render: (b, a) => f1Bars(b, a, { d: 6, bars: [{ name: "[3/6]", k: 3, col: 0 }, { name: "[2/6]", k: 2, col: 1 }], ask: [
        ["[3/6]+[2/6] = ", { q: [null, ["?3", "+", "?2"], "6"] }, " = ", { q: [null, "?5", "6"] }]], ok: "[3/6]+[2/6] = [5/6]예요. [1/6]이 3개와 2개, 모두 5개예요." }) },
    { name: "계산하기", inst: "2번: 계산해 보세요. 가분수로 써도, 대분수로 써도 맞아요.", hints: ["대분수끼리는 자연수 부분끼리, 분수 부분끼리 계산해요.", "1−[4/5]는 1을 [5/5]로 바꾸어요."],
      render: (b, a) => f1Calc(b, a, [{ e: "[3 6/10]+[4 3/10]", a: "7 9/10" }, { e: "[1 8/9]+[2 5/9]", a: "4 4/9" }, { e: "[7/8]−[5/8]", a: "2/8" }, { e: "1−[4/5]", a: "1/5" }]) },
    { name: "이어 보기", inst: "3번: 계산 결과가 같은 것끼리 이어 보세요.", hints: ["모두 분모가 7이에요. 가분수로 바꾸어 비교하면 편리해요.", "[1 1/7]+[8/7] = [16/7], 3−[5/7] = [16/7]"],
      render: (b, a) => f1Match(b, a, { left: [{ t: "[1 1/7]+[8/7]", k: 1 }, { t: "[3 2/7]−[1 5/7]", k: 2 }], right: [{ t: "3−[5/7]", k: 1 }, { t: "[4 6/7]−[2 3/7]", k: null }, { t: "[5/7]+[6/7]", k: 2 }],
        ok: "[1 1/7]+[8/7] = 3−[5/7] = [2 2/7], [3 2/7]−[1 5/7] = [5/7]+[6/7] = [1 4/7]예요." }) },
    { name: "비교하고 고치기", inst: "4번: 합과 차의 크기를 비교해요. 5번: 잘못 계산한 곳을 찾아 이유를 고르고 옳게 계산해 보세요. 잘못된 계산: [5 1/4]−[3 2/4] = 2+[1/4] = [2 1/4]", hints: ["[2 8/12]+[17/12] = [49/12], [7 4/12]−[41/12] = [47/12]이에요.", "[1/4]에서 [2/4]는 뺄 수 없어요. [5 1/4]을 [4 5/4]로 바꾸어요."],
      render: (b, a) => f1Chain(b, a, [
        { t: "4번", p: ["[2 8/12]+[17/12] ", { c: [">", "=", "<"], a: 0 }, " [7 4/12]−[41/12]"] },
        { t: "5번 이유", p: [{ c: ["분수 부분끼리 뺄 수 없는데 큰 분자에서 작은 분자를 뺐어요", "자연수 부분끼리 빼면 안 돼요"], a: 0 }] },
        { t: "옳게", p: ["[5 1/4]−[3 2/4] = ", { q: ["?4", "?5", "4"] }, "−[3 2/4] = ", { i: "1" }, "+", { q: [null, "?3", "4"] }, " = ", { q: ["?1", "?3", "4"] }] }],
        { ok: "[4 1/12] > [3 11/12]이에요. 분수 부분끼리 뺄 수 없으면 1만큼을 [4/4]로 바꾸어 [5 1/4] = [4 5/4]로 계산해요." }) },
    { name: "꼭꼭! 사다리 타기", inst: "꼭꼭! 확인하고 정리해요. 사다리를 타고 내려가 도착한 집에 합 또는 차를 써 보세요.", hints: ["[4 7/10]−[1 8/10]은 분수 부분끼리 뺄 수 없어요.", "1−[2/9]는 1을 [9/9]로 바꾸어요."],
      render: (b, a) => f1Ladder(b, a, { items: ["[6/11]+[4/11]", "[4 7/10]−[1 8/10]", "[1 3/6]+[2 4/6]", "1−[2/9]"], perm: [1, 3, 0, 2] }) }
  ],
  challenge: { inst: "★★ 은우네 집에서 우체국까지는 [1 5/8] km, 우체국에서 미술관까지는 [1 3/8] km, 은우네 집에서 미술관까지 바로 가면 [2 6/8] km예요.", hints: ["거쳐 가는 거리는 두 거리를 더해요. [8/8]은 1이에요.", "3을 [2 8/8]로 바꾸어 [2 6/8]을 빼요."],
    render: (b, a) => f1Calc(b, a, [
      { q: "① 은우네 집에서 우체국을 거쳐 미술관까지 가는 거리는 몇 km일까요?", e: "[1 5/8]+[1 3/8]", a: "3", unit: "km" },
      { q: "② 우체국을 거쳐 가는 거리는 바로 가는 거리보다 몇 km 더 멀까요?", e: "3−[2 6/8]", a: "2/8", unit: "km" }], { fig: f1Map, ok: "거쳐 가면 3 km, 바로 가는 것보다 [2/8] km 더 멀어요." }) }
}
];
