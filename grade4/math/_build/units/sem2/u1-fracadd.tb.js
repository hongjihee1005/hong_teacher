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
/* 받침에 맞는 조사(수의 마지막 숫자 읽기 기준): f1J("[3/7]", "은는") → "[3/7]은" */
function f1J(s, pair) {
  const str = String(s), digits = str.replace(/[^0-9]/g, ""), c = digits ? digits[digits.length - 1] : str[str.length - 1];
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
  if (op === "+" && A.hasF && B.hasF && A.n + B.n >= d && (A.w || B.w)) { const fc = f1R((A.w + B.w) * d + (A.n + B.n - d), d); if (f1Eq(r, fc)) return `분수 부분끼리 더한 ${f1J(`[${A.n + B.n}/${d}]`, "은는")} 1과 [${A.n + B.n - d}/${d}]예요. 그 1을 자연수 부분에 더해야 해요.`; }
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
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "f1lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : null);
    } else {
      R.kind = "f";
      R.t = f1Str(it.a); if (!R.t || R.t.err) throw new Error("답 형식 오류: " + it.a);
      R.den = it.den || f1Den(ex) || f1Den(it.a) || 1;
      if (ex && !it.noEval) { const v = f1Eval(ex); if (!v || !f1Eq(v, R.t)) throw new Error(`답 확인 필요: ${ex} = ${it.a}`); }
      R.inp = f1In(it.lab || it.e || "답");
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "f1lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : null);
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
    api.hint(hops.length === 0 ? `그곳은 0에서 [1/${d}]이 ${t}칸인 곳이에요. ${tok(opt.a)}만큼 간 곳을 찾아요.` : `${tok(opt.b)}는 [1/${d}]이 ${bT}칸이에요. ${sg > 0 ? "오른쪽" : "왼쪽"}으로 칸을 세어 봐요.`);
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
  const stat = () => { readout.textContent = merged ? `모은 결과: 자연수 ${wA + wB + (carry ? 1 : 0)}과(와) [${(fA + fB) % d}/${d}]만큼이에요.` : `${opt.A.name} 색칠 ${count(1)}칸, ${opt.B.name} 색칠 ${count(2)}칸 (한 칸은 [1/${d}])`; };
  const bA = h("button", { class: "f1on", onclick: () => { cur = 1; bA.classList.add("f1on"); bB.classList.remove("f1on"); } }, `${opt.A.name} ${f1Tk(opt.A.v)} 색칠하기`);
  const bB = h("button", { onclick: () => { cur = 2; bB.classList.add("f1on"); bA.classList.remove("f1on"); } }, `${opt.B.name} ${f1Tk(opt.B.v)} 색칠하기`);
  bA.style.borderLeft = `8px solid ${F1_F[0]}`; bB.style.borderLeft = `8px solid ${F1_F[1]}`;
  const mergeBtn = h("button", { onclick: () => {
    if (merged) return;
    if (count(1) !== aN || count(2) !== bN) return api.hint(`${f1Tk(opt.A.v)}는 [1/${d}]이 ${aN}칸, ${f1Tk(opt.B.v)}는 ${bN}칸이에요. 색칠한 칸 수를 확인해요.`);
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
  body.append(h("p", { class: "inst", style: "font-size:var(--fs-s);margin:.1em 0" }, pie ? "통째로 누르면 1에 ×표, ‘자르기’ 단추를 누르면 조각으로 나뉘어 한 조각씩 ×표 할 수 있어요." : `막대(1)를 누르면 통째로 ×표, ‘쪼개기’를 누르면 1이 [${d}/${d}]로 나뉘어 한 칸씩 ×표 할 수 있어요.`),
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
      info.textContent = `내 말은 ${f1Tk(G.pos[0].p)}, 로봇의 말은 ${f1Tk(G.pos[1].p)}예요. 내 말을 아래로 당겼다 놓거나, 힘을 골라 ‘튕기기’를 눌러요.`;
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
        G.phase = "bot"; api.hint(`맞았어요! 내 값은 ${U(want)}예요.`); render();
      } }, "계산 확인"));
    } else if (G.phase === "bot") {
      info.textContent = `로봇: “${exprOf(1)} = ${U(G.botSay)}” 로봇의 계산이 맞는지 확인해 주세요.`;
      const judge = sayRight => {
        const right = G.botSay === G.botWant;
        if (sayRight !== right) return api.fail(right ? "로봇의 계산은 맞았어요. 다시 계산해 봐요." : "로봇의 계산을 다시 해 봐요. 로봇이 틀렸어요.", `로봇 ${U(G.botSay)} 판단 ${sayRight ? "맞아요" : "틀렸어요"}`);
        G.log[G.log.length - 1][1] = `${exprOf(1)} = ${U(G.botWant)}`; G.vals[1] = G.botWant;
        api.hint(right ? "로봇의 계산이 맞았어요." : `잘 찾았어요! 바른 값은 ${U(G.botWant)}예요. 로봇이 고쳤어요.`);
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
