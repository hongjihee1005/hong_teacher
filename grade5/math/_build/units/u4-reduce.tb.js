//@@APP
const APP={title:"세계 음식 축제 약분과 통분", unit:"5-1 수학 4. 약분과 통분(교과서)", key:"t51-reduce-v1", welcome:"세계 음식 축제 약분과 통분 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 준서와 하은이, 유주가 세계 음식 축제의 체험장을 돌아보며 크기가 같은 분수를 찾고, 분수를 약분하고 통분하여 분수와 소수의 크기를 비교해요."};
//@@UNIT
/* ===== 5-1 수학 4. 약분과 통분 — 단원 조작 부품 (앞글자 rd4) =====
   글 속 분수 표기: [3/4] 진분수·가분수, [2 3/4] 대분수. 화면에서는 위아래로 쌓은 분수로 보이고, 읽어 주기는 '4분의 3'으로 읽어요.
   모든 수는 분수(정수 분자·분모)로 정확하게 계산해요. 정답은 화면을 그릴 때 다시 계산해서 맞지 않으면 오류를 내요.
   rd4Bars    막대·원(피자·그릇)을 눌러 분수만큼 색칠하기
   rd4Split   색칠한 막대(색종이·바비큐·토마토…)를 몇 칸으로 나눌지 바꾸어 크기가 같은 분수 찾기 · 여러 막대를 같은 칸 수로 나누면 통분
   rd4Reduce  ÷ 단추로 분모와 분자를 공약수로 나누어 약분하기(막대 그림이 함께 바뀜)
   rd4Common  크기가 같은 분수를 늘어놓고 분모가 같은 짝 찾기(공통분모)
   rd4Wall    분수 막대에서 세로 자를 끌어 끝이 맞는 분수 찾기
   rd4Place   수직선에 분수와 소수 놓기 · rd4Hund 100칸 모눈 색칠하기
   rd4Sort    카드를 알맞은 곳으로 나누기 · rd4Cards 수 카드로 분수를 만들어 가장 큰 분수 찾기
   rd4Maker · rd4Game · rd4Tong  놀이: 카드 만들기 · 손가락 접어! · 통분 놀이
   rd4Calc · rd4Chain  답 쓰기(분수·수·고르기·>,=,<·차례 정하기) · 계산 과정 빈칸 */

/*rd4-core*/
const RD4_SRC = "\\[(?:(\\d+) )?(\\d+|□)\\/(\\d+|□)\\]";
const rd4Re = () => new RegExp(RD4_SRC, "g");
function rd4Plain(s) { return String(s == null ? "" : s).replace(rd4Re(), (m, w, n, d) => `${w ? w + "와 " : ""}${d}분의 ${n}`); }
const rd4G = (a, b) => b ? rd4G(b, a % b) : Math.abs(a);
const rd4Lcm = (a, b) => a / rd4G(a, b) * b;
function rd4Q(num, den) { if (den < 0) { num = -num; den = -den; } const g = rd4G(num, den) || 1; return { num: num / g, den: den / g }; }
/* 칸에 쓴 글(자연수·분자·분모) → 수 */
function rd4Raw(ws, ns, ds) {
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
const rd4Key = r => r.err ? "" : r.hasF ? (r.hasW ? `${r.w} ${r.n}/${r.d}` : `${r.n}/${r.d}`) : String(r.w);
/* "[2 3/4]"·"3/4"·"2 3/4"·"0.45"·"3" → {num, den}(기약) */
function rd4Val(s) {
  if (s && typeof s === "object") return rd4Q(s.num, s.den);
  const t = String(s).trim().replace(/^\[|\]$/g, "").trim();
  let m = t.match(/^(\d+)$/); if (m) return rd4Q(+m[1], 1);
  m = t.match(/^(\d*)\.(\d+)$/); if (m) return rd4Q(+((m[1] || "0") + m[2]), 10 ** m[2].length);
  m = t.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/); if (m && +m[3]) return rd4Q((m[1] ? +m[1] : 0) * +m[3] + +m[2], +m[3]);
  return null;
}
/* 약분하지 않은 그대로의 [분자, 분모] */
function rd4ND(s) { const m = String(s).replace(/[\[\]]/g, "").trim().match(/^(\d+)\/(\d+)$/); if (!m) throw new Error("분수 형식 오류: " + s); return [+m[1], +m[2]]; }
function rd4Cmp(a, b) { const x = rd4Val(a), y = rd4Val(b); if (!x || !y) throw new Error("수 형식 오류: " + a + ", " + b); const d = x.num * y.den - y.num * x.den; return d > 0 ? 1 : d < 0 ? -1 : 0; }
const rd4Same = (a, b) => rd4Cmp(a, b) === 0;
const rd4Sign = c => c > 0 ? ">" : c < 0 ? "<" : "=";
const rd4Tk = s => /\//.test(String(s)) && !/^\[/.test(String(s)) ? `[${s}]` : String(s);
const rd4F = (n, d) => `[${n}/${d}]`;
/* 받침에 맞는 조사(분수는 분자를 마지막에 읽으므로 분자의 끝 숫자 기준): rd4J("[3/7]", "은는") → "[3/7]은" */
function rd4J(s, pair) {
  const str = String(s), core = str.replace(/\/[0-9□]+\]/g, "]"), digits = core.replace(/[^0-9]/g, ""), c = /[0-9]\]?$/.test(core) ? digits[digits.length - 1] : core.replace(/\]$/, "").slice(-1);
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"] };
  const [a, b] = M[pair];
  if (pair === "으로") return str + (has && !rieul ? a : b);
  return str + (has ? a : b);
}
/* 분모가 2와 5로만 된 분수 → 소수 글 */
function rd4DecStr(v) {
  const q = rd4Val(v);
  for (let k = 0; k <= 6; k++) { const p = 10 ** k; if (p % q.den === 0) { const n = q.num * (p / q.den); if (!k) return String(n); const s = String(n).padStart(k + 1, "0"); return s.slice(0, -k) + "." + s.slice(-k); } }
  return null;
}
/* 소수 글 → 분모가 10, 100…인 분수 글 */
function rd4DecFrac(s) { const m = String(s).match(/^(\d*)\.(\d+)$/); if (!m) return null; const den = 10 ** m[2].length, num = +((m[1] || "0") + m[2]); return { num, den, t: `[${num}/${den}]` }; }
/* 두 수(분수·소수)를 통분하여 비교하는 풀이 글 */
function rd4Explain(a, b) {
  const part = s => { const d = rd4DecFrac(s); if (d) return { pre: `${s} = ${d.t}`, n: d.num, d: d.den }; const v = /\//.test(s) ? rd4ND(s) : [+s, 1]; return { pre: "", n: v[0], d: v[1] }; };
  if (rd4DecFrac(a) && rd4DecFrac(b)) return `높은 자리부터 차례로 비교하면 ${a} ${rd4Sign(rd4Cmp(a, b))} ${rd4J(b, "이에요")}.`;
  const A = part(a), B = part(b), L = rd4Lcm(A.d, B.d), na = A.n * L / A.d, nb = B.n * L / B.d;
  const pre = [A.pre, B.pre].filter(Boolean).join(", ");
  const sg = rd4Sign(rd4Cmp(a, b));
  const lead = (pre ? pre + "이고, " : "") + (A.d === B.d ? "" : `분모를 ${rd4J(String(L), "으로")} 같게 하면 ${rd4Tk(a)} → ${rd4F(na, L)}, ${rd4Tk(b)} → ${rd4F(nb, L)}이므로 `);
  return `${lead}${rd4Tk(a)} ${sg} ${rd4J(rd4Tk(b), "이에요")}.`;
}
/* 흔한 실수 찾기(지도서 오개념: 분모에만 곱하기·서로 다른 수로 나누기 등) */
function rd4Diag(from, r) {
  if (!from || !r || r.err || !r.hasF || r.hasW) return null;
  const [n0, d0] = rd4ND(from);
  if (r.n === n0 && r.d !== d0 && r.d % d0 === 0) return `분모에만 ${rd4J(String(r.d / d0), "을를")} 곱했어요. 분자에도 같은 수를 곱해야 크기가 같아요.`;
  if (r.n === n0 && r.d !== d0 && d0 % r.d === 0) return "분모만 나누었어요. 분자도 같은 수로 나누어야 크기가 같아요.";
  if (r.d !== d0 && r.d % d0 === 0 && r.n % n0 === 0 && r.d / d0 !== r.n / n0) return "분모와 분자에 서로 다른 수를 곱했어요. 0이 아닌 같은 수를 곱해야 크기가 같아요.";
  if (r.d !== d0 && d0 % r.d === 0 && r.n && n0 % r.n === 0 && d0 / r.d !== n0 / r.n) return "분모와 분자를 서로 다른 수로 나누었어요. 0이 아닌 같은 수로 나누어야 크기가 같아요.";
  return null;
}
/*rd4-core-end*/

function rd4Style() {
  if (document.getElementById("rd4-style")) return;
  const s = document.createElement("style"); s.id = "rd4-style";
  s.textContent = `
.rd4fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.rd4fw{margin-right:.1em}
.rd4q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.rd4q>.rd4n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.rd4q>.rd4d{padding:.05em .14em 0}
.rd4frin .rd4q{font-size:.92em}
.rd4frin .rd4n{padding-bottom:.14em}.rd4frin .rd4d{padding-top:.14em}
.rd4inp{display:inline-flex;align-items:center;gap:.15em;vertical-align:middle}
.rd4qi{display:inline-flex;flex-direction:column;align-items:stretch;gap:.12em}
.rd4bar{display:block;height:.17em;background:var(--ink);border-radius:.1em}
input.rd4i,input.rd4box{box-sizing:border-box;width:2.5em;height:1.65em;padding:0;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.rd4iw{height:2.1em;width:2.1em}
input.rd4wide{width:4.6em}
input.rd4set{width:11em;max-width:100%}
.rd4eq{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .45em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin-top:.25em}
.rd4eq>.opts{flex-basis:100%;font-size:calc(var(--fs)*.95)}
.rd4lab{color:var(--pine)}
.rd4cl{display:flex;flex-wrap:wrap;align-items:center;gap:.3em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.12);margin:.4em 0;line-height:1.9;word-break:keep-all}
.rd4tag{background:var(--pine-soft);color:var(--pine);border-radius:.5em;padding:0 .55em;font-size:.82em}
.rd4chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.rd4chs .opt{padding:.05em .55em}
.rd4stage{margin:.2em 0 .4em}
.rd4stage svg{width:100%;height:auto;max-height:62vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r);touch-action:none}
.rd4tip{font-family:Jua,sans-serif;color:var(--night);margin:.3em 0;word-break:keep-all}
.rd4tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.4em 0}
.rd4tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em;word-break:keep-all}
.rd4tools button.rd4on{background:var(--night);color:#fff;border-color:var(--night)}
.rd4ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.rd4chips{display:flex;flex-wrap:wrap;gap:.35em;margin:.3em 0;align-items:center}
.rd4chip{border:2px solid var(--ok);background:#E3F4EA;border-radius:.6em;padding:.05em .55em;font-family:Jua,sans-serif}
.rd4pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:2.6em;margin:.3em 0 .6em}
.rd4pool .opt,.rd4binl .opt{font-family:Jua,sans-serif;word-break:keep-all}
.rd4bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,13em),1fr));gap:.6em}
.rd4bin{border:2px dashed var(--line);border-radius:.8em;padding:.4em;min-height:5em;display:flex;flex-direction:column;gap:.35em}
.rd4binh{font-family:Jua,sans-serif;background:var(--pine-soft);color:var(--pine);border:0;border-radius:.6em;padding:.3em .6em;word-break:keep-all}
.rd4binl{display:flex;flex-wrap:wrap;gap:.35em}
.opt.rd4sel{border-color:var(--ring);background:var(--ring-soft)}
.rd4row{margin:.45em 0}
.rd4rowt{font-family:Jua,sans-serif;color:var(--night);margin-bottom:.25em;word-break:keep-all}
.rd4cards{display:flex;flex-wrap:wrap;gap:.45em;align-items:stretch}
.rd4card{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:.15em;border:2px solid var(--line);border-radius:.7em;background:#fff;padding:.3em .5em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.1);min-width:3.4em;color:var(--ink)}
button.rd4card{cursor:pointer}
.rd4card small{font-size:.65em;color:var(--muted)}
.rd4card.rd4pk{border-color:var(--ring);background:var(--ring-soft)}
.rd4card.rd4pr{border-color:var(--ok);background:#E3F4EA}
.rd4card.rd4no{border-color:var(--no);background:#FBE7E2}
.rd4chain{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.15);display:flex;flex-wrap:wrap;align-items:center;gap:.2em .35em;margin:.3em 0}
.rd4arr{font-size:.72em;color:var(--pine);background:var(--pine-soft);border-radius:.5em;padding:0 .4em}
.rd4num{display:flex;flex-wrap:wrap;gap:.35em;margin:.3em 0}
.rd4num button{min-width:3.4em;border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .5em;font-family:Jua,sans-serif;font-size:1.05em}
.rd4players{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,9.5em),1fr));gap:.5em;margin:.4em 0}
.rd4pl{border:3px solid var(--line);border-radius:var(--r);background:#fff;padding:.4em;display:flex;flex-direction:column;align-items:center;gap:.2em;text-align:center;font:inherit;color:var(--ink)}
.rd4pl.rd4me{border-color:#E47A38}
.rd4pl.rd4pk{border-color:var(--ring);background:var(--ring-soft)}
.rd4pl.rd4spk{box-shadow:0 0 0 4px #F4C54288}
.rd4pn{font-family:Jua,sans-serif;color:var(--night)}
.rd4pc{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.55);min-height:2.3em;display:flex;align-items:center}
.rd4pl svg{width:4.4em;height:auto}
.rd4say{border:2px solid #E2C9A0;background:#FFF7E8;border-radius:.7em;padding:.4em .7em;font-family:Jua,sans-serif;word-break:keep-all;margin:.3em 0}
.rd4ord{display:inline-grid;place-items:center;min-width:1.4em;height:1.4em;border-radius:50%;background:var(--night);color:#fff;font-size:.72em;margin-right:.3em}
.rd4log{font-size:var(--fs-s);color:var(--muted);word-break:keep-all;margin:.2em 0}
.rd4maker{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,13em),1fr));gap:.6em;margin:.4em 0}
.rd4maker>div{border:2px solid var(--line);border-radius:.8em;padding:.5em;background:#fff;display:flex;flex-direction:column;gap:.35em;align-items:flex-start}
.rd4maker b{font-family:Jua,sans-serif;font-weight:400;color:var(--night);word-break:keep-all}
`;
  document.head.append(s);
}
/* 분수 모양 요소 */
function rd4FracEl(w, n, d) {
  return h("span", { class: "rd4fr" }, w != null && w !== "" ? h("span", { class: "rd4fw" }, String(w)) : null,
    h("span", { class: "rd4q" }, h("span", { class: "rd4n" }, String(n)), h("span", { class: "rd4d" }, String(d))));
}
function rd4RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = rd4Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(rd4FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function rd4RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return rd4RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(rd4RenderText);
}
(function rd4Boot() {
  rd4Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") rd4RenderText(m.target); else m.addedNodes.forEach(rd4RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(rd4Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
/* 엔진 부품의 '답 따라 쓰기' 글은 읽는 말(4분의 3)로 바꿔 줌 */
function rd4A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(rd4Plain) }) }); }
const rd4Quiz0 = quiz, rd4Blanks0 = blanks;
quiz = (b, a, items, o) => rd4Quiz0(b, rd4A(a), items, o);
blanks = (b, a, parts, o) => rd4Blanks0(b, rd4A(a), parts, o);

function rd4Gate(api, ready, msg) {
  return Object.assign({}, api, { done: (ans, m, lv) => ready() ? api.done(ans, m, lv) : api.fail(typeof msg === "function" ? msg() : msg, ans) });
}
const RD4_F = ["#F6C08A", "#9CC6EC", "#A9D8A2", "#D7B5E6", "#F4A9A0"], RD4_S = ["#D9822B", "#2B7BD6", "#2E8B57", "#8E5BC9", "#C8472E"];
/* SVG 글: [분수] 표기를 쌓은 분수로 그림 */
function rd4Cw(ch, s) { return /[가-힣]/.test(ch) ? s * .95 : /[0-9]/.test(ch) ? s * .56 : ch === " " ? s * .3 : /[A-Za-z]/.test(ch) ? s * .55 : s * .6; }
function rd4Segs(str) {
  const out = []; let last = 0; const re = rd4Re(); let m;
  while ((m = re.exec(str))) { if (m.index > last) out.push({ t: str.slice(last, m.index) }); out.push({ w: m[1], n: m[2], d: m[3] }); last = m.index + m[0].length; }
  if (last < str.length) out.push({ t: str.slice(last) });
  return out;
}
function rd4SvgLine(str, x, y, size = 24, opt = {}) {
  const g = svgEl("g", { "pointer-events": "none" }), fs = size * .8, fill = opt.fill || INK;
  const tw = t => [...t].reduce((a, c) => a + rd4Cw(c, size), 0);
  const fw = s => Math.max(String(s.n).length, String(s.d).length) * fs * .6 + 8;
  const segs = rd4Segs(String(str));
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

/* 분수 입력칸(분자/분모, mixed면 자연수 칸도) */
function rd4In(label, mixed) {
  const mk = (cls, al) => {
    const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "rd4i " + cls, "aria-label": (label ? rd4Plain(label) + " " : "") + al });
    i.addEventListener("input", () => { const v = i.value.replace(/[^0-9]/g, "").slice(0, 3); if (v !== i.value) i.value = v; });
    return i;
  };
  const w = mixed ? mk("rd4iw", "자연수 부분") : null, n = mk("", "분자"), d = mk("", "분모");
  const el = h("span", { class: "rd4inp" }, w, h("span", { class: "rd4qi" }, n, h("span", { class: "rd4bar" }, "​"), d));
  el.get = () => rd4Raw(w ? w.value : "", n.value, d.value);
  el.paint = ok => [w, n, d].filter(Boolean).forEach(x => { x.style.borderColor = ok == null ? "" : ok ? "var(--ok)" : "var(--no)"; });
  el.text = () => { const r = el.get(); return r.err ? "-" : rd4Key(r); };
  el.clear = () => [w, n, d].filter(Boolean).forEach(x => { x.value = ""; x.style.borderColor = ""; });
  return el;
}
function rd4Box(exp, wide) {
  const i = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", maxlength: 6, class: "rd4box" + (wide || String(exp).length > 2 ? " rd4wide" : ""), "aria-label": "빈칸" });
  i.exp = String(exp);
  return i;
}
/* 분수 답 판정: 값이 같으면 정답. den(분모 지정)·red(약분한 분수 모두)·irr(기약분수만) */
function rd4JudgeF(r, it) {
  if (r.err === "empty") return { ok: false, msg: "빈칸에 답을 써요." };
  if (r.err === "half") return { ok: false, msg: "분수는 분자와 분모를 모두 써요." };
  if (r.err) return { ok: false, msg: "칸에는 수만 써요." };
  const t = rd4Val(it.a);
  if (r.num * t.den !== t.num * r.den) return { ok: false, msg: (it.why && it.why[rd4Key(r)]) || (it.from && rd4Diag(it.from, r)) || null };
  if (it.den && (!r.hasF || r.hasW || r.d !== it.den)) return { ok: false, msg: `값은 같아요. 분모가 ${it.den}인 분수로 나타내요.` };
  if (it.red) { const f = rd4ND(it.from); if (!r.hasF || r.hasW || r.d >= f[1]) return { ok: false, msg: "약분하면 분모가 처음보다 작아져요. 분모와 분자를 1이 아닌 공약수로 나누어요." }; }
  if (it.irr && r.hasF && rd4G(r.n, r.d) > 1) { const g = rd4G(r.n, r.d); return { ok: false, msg: `값은 같아요. 그런데 ${rd4J(String(r.n), "과와")} ${r.d}의 공약수 ${rd4J(String(g), "으로")} 더 나눌 수 있어요. 기약분수로 나타내요.` }; }
  return { ok: true };
}
/* 약분한 분수 모두(보기 글) */
function rd4AllRed(s) { const [n, d] = rd4ND(s), g = rd4G(n, d), out = []; for (let k = 2; k <= g; k++) if (g % k === 0) out.push(rd4F(n / k, d / k)); return out; }

/* 차례 정하기(누른 차례대로 번호) */
function rd4OrderEl(labels) {
  const picked = [], row = h("span", { class: "rd4chs" });
  const btns = labels.map((t, i) => h("button", { class: "opt", onclick: () => {
    if (picked.includes(i)) return; picked.push(i);
    btns[i].classList.add("on"); btns[i].prepend(h("span", { class: "rd4ord" }, String(picked.length)));
  } }, t));
  btns.forEach(b => row.append(b));
  const reset = h("button", { class: "opt", onclick: () => { picked.length = 0; btns.forEach(b => { b.classList.remove("on", "good", "bad"); const o = b.querySelector(".rd4ord"); o && o.remove(); }); } }, "다시");
  row.append(reset);
  row.get = () => picked.slice();
  row.paint = ok => btns.forEach(b => { b.classList.remove("good", "bad"); if (b.classList.contains("on")) b.classList.add(ok ? "good" : "bad"); });
  return row;
}
/* 값의 큰 차례(desc) 또는 작은 차례(asc) 번호 — 같은 값이 있으면 오류 */
function rd4Rank(vals, asc) {
  const idx = vals.map((_, i) => i).sort((i, j) => (asc ? 1 : -1) * rd4Cmp(vals[i], vals[j]));
  for (let k = 1; k < idx.length; k++) if (rd4Same(vals[idx[k - 1]], vals[idx[k]])) throw new Error("차례 정하기에 크기가 같은 수가 있어요");
  return idx;
}

/* ① 답 쓰기 여러 개
   item: {q, e?, a:"2/5", den?, red?, irr?, from?, mixed?, why}   분수 칸
         {q, n:수, unit, why}                                        수 칸(소수도 됨)
         {q, set:[수…], why:{miss}}                                  여러 수(쉼표로)
         {q, eq:"6/8", count:3}                                      크기가 같은 분수 여러 개 만들기
         {q, pick:[…], a:번호|[번호…], why:{번호|miss}}             고르기
         {q, cmp:[A, B]}                                             >, =, < 고르기(답은 계산)
         {q, order:[글|{t, v}], asc?}                                 큰(작은) 차례로 누르기(답은 계산)  */
function rd4Calc(body, api, items, opt = {}) {
  rd4Style();
  const rows = [], wrap = h("div");
  const nq = items.filter(x => x.q).length; let qn = 0;
  items.forEach(it => {
    const R = { it };
    let box;
    if (it.q || !rows.length) { box = h("div", { class: "qitem" }); if (it.q) { qn++; box.append(h("div", { class: "jua" }, (nq > 1 ? qn + ". " : "") + it.q)); } wrap.append(box); }
    else box = wrap.lastChild;
    if (it.fig) box.append(it.fig());
    const host = h("div", { class: "rd4eq" }); box.append(host);
    if (it.pick) {
      R.kind = "pick"; R.multi = Array.isArray(it.a); R.sel = new Set();
      const row = h("div", { class: "opts" });
      it.pick.forEach((o, oi) => row.append(h("button", { class: "opt", onclick: ev => {
        [...row.children].forEach(b => b.classList.remove("good", "bad"));
        if (R.multi) { R.sel.has(oi) ? R.sel.delete(oi) : R.sel.add(oi); ev.currentTarget.classList.toggle("on"); }
        else { R.sel.clear(); R.sel.add(oi); [...row.children].forEach(b => b.classList.remove("on")); ev.currentTarget.classList.add("on"); }
      } }, o)));
      R.row = row; if (it.e) host.append(h("span", {}, it.e)); host.append(row);
    } else if (it.cmp) {
      R.kind = "cmp"; R.ans = rd4Sign(rd4Cmp(it.cmp[0], it.cmp[1])); R.sel = null;
      const row = h("span", { class: "rd4chs" });
      [">", "=", "<"].forEach(s => row.append(h("button", { class: "opt", onclick: ev => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); R.sel = s; } }, s)));
      R.row = row; host.append(h("span", {}, it.cmp[0]), row, h("span", {}, it.cmp[1]));
    } else if (it.order) {
      R.kind = "order";
      const labs = it.order.map(o => typeof o === "string" ? o : o.t), vals = it.order.map(o => typeof o === "string" ? o : o.v);
      R.labs = labs; R.vals = vals; R.ans = rd4Rank(vals, it.asc);
      R.el = rd4OrderEl(labs); host.append(h("span", { class: "rd4lab" }, it.asc ? "작은 수부터 차례로 눌러요" : "큰 수부터 차례로 눌러요"), R.el);
    } else if (it.set) {
      R.kind = "set";
      R.inp = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "rd4box rd4set", "aria-label": rd4Plain(it.q || "답"), placeholder: "예: 1, 2, 3" });
      host.append(h("span", { class: "rd4lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    } else if (it.n != null) {
      R.kind = "n";
      if (it.chk && it.chk() !== it.n) throw new Error(`답 확인 필요: ${it.q} = ${it.n}`);
      R.inp = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "rd4box rd4wide", "aria-label": rd4Plain(it.lab || it.e || it.q || "답") });
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "rd4lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    } else if (it.eq) {
      R.kind = "eq"; R.ins = [];
      for (let k = 0; k < (it.count || 3); k++) { const fi = rd4In("크기가 같은 분수 " + (k + 1)); R.ins.push(fi); host.append(fi); if (k < (it.count || 3) - 1) host.append(h("span", {}, ",")); }
    } else {
      R.kind = "f";
      if (!rd4Val(it.a)) throw new Error("답 형식 오류: " + it.a);
      if (it.from && !rd4Same(it.from, it.a)) throw new Error(`답 확인 필요: ${it.from} = ${it.a}`);
      if (it.den && rd4ND(it.a)[1] !== it.den) throw new Error(`분모 확인 필요: ${it.a}`);
      if (it.irr && rd4G(...rd4ND(it.a)) !== 1) throw new Error(`기약분수 확인 필요: ${it.a}`);
      R.inp = rd4In(it.lab || it.e || "답", it.mixed);
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "rd4lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
    }
    rows.push(R);
  });
  const ansText = R => {
    const it = R.it, head = rd4Plain(it.e || it.lab || "답");
    if (R.kind === "pick") return (Array.isArray(it.a) ? it.a : [it.a]).map(i => rd4Plain(it.pick[i])).join(", ");
    if (R.kind === "cmp") return rd4Plain(`${it.cmp[0]} ${R.ans} ${it.cmp[1]}`);
    if (R.kind === "order") return R.ans.map(i => rd4Plain(R.labs[i])).join(it.asc ? " < " : " > ");
    if (R.kind === "set") return it.set.join(", ");
    if (R.kind === "n") return `${head} ${it.n}${it.unit ? " " + it.unit : ""}`;
    if (R.kind === "eq") { const [n, d] = rd4ND(it.eq); return [2, 3, 4].map(k => rd4Plain(rd4F(n * k, d * k))).join(", "); }
    return `${head} ${rd4Plain(rd4Tk(it.a))}${it.unit ? " " + it.unit : ""}`;
  };
  api.provide({ words: opt.words || ["분모와 분자에 같은 수를 곱하기", "분모와 분자를 같은 수로 나누기", "공약수", "최대공약수", "공배수", "최소공배수", "통분"], answers: rows.map(ansText) });
  const btn = h("button", { class: "big", onclick: () => {
    let bad = null; const given = [];
    rows.forEach(R => {
      const it = R.it;
      if (R.kind === "pick") {
        const v = [...R.sel], want = Array.isArray(it.a) ? it.a : [it.a];
        const g = v.length === want.length && want.every(x => R.sel.has(x));
        [...R.row.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (R.sel.has(i)) b.classList.add(want.includes(i) ? "good" : "bad"); });
        given.push(v.length ? v.map(i => rd4Plain(it.pick[i])).join("·") : "-");
        if (!g && !bad) { const wrongSel = v.find(i => !want.includes(i)); bad = !v.length ? "고르지 않은 문제가 있어요." : (wrongSel != null && it.why && it.why[wrongSel]) || (wrongSel == null && it.why && it.why.miss) || (wrongSel == null && R.multi ? "알맞은 것을 모두 골라요. 빠뜨린 것이 있어요." : "빨간 보기를 다시 살펴봐요."); }
        return;
      }
      if (R.kind === "cmp") {
        const g = R.sel === R.ans;
        [...R.row.children].forEach(b => { b.classList.remove("good", "bad"); if (b.textContent.trim() === R.sel) b.classList.add(g ? "good" : "bad"); });
        given.push(R.sel || "-");
        if (!g && !bad) bad = R.sel == null ? "○ 안에 >, =, < 중 하나를 골라요." : (it.why && it.why[R.sel]) || "두 수를 통분하거나, 분수를 소수로(소수를 분수로) 나타내어 다시 비교해 봐요.";
        return;
      }
      if (R.kind === "order") {
        const v = R.el.get(), g = v.length === R.ans.length && v.every((x, k) => x === R.ans[k]);
        R.el.paint(g); given.push(v.map(i => rd4Plain(R.labs[i])).join(">") || "-");
        if (!g && !bad) bad = v.length < R.ans.length ? "모두 차례대로 눌러요." : "차례가 달라요. ‘다시’를 누르고 두 수씩 짝 지어 비교해 봐요.";
        return;
      }
      if (R.kind === "set") {
        const nums = R.inp.value.split(/[^0-9]+/).filter(Boolean).map(Number), u = [...new Set(nums)].sort((a, b) => a - b), want = it.set.slice().sort((a, b) => a - b);
        const g = u.length === want.length && u.every((x, k) => x === want[k]);
        R.inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; given.push(R.inp.value || "-");
        if (!g && !bad) { const extra = u.find(x => !want.includes(x)); bad = !u.length ? "빈칸에 답을 써요." : (extra != null && it.why && it.why[extra]) || (extra == null ? (it.why && it.why.miss) || "빠뜨린 수가 있어요." : `${rd4J(String(extra), "은는")} 알맞지 않아요.`); }
        return;
      }
      if (R.kind === "n") {
        const s = R.inp.value.replace(/[\s,]/g, ""), v = rd4Val(s), g = !!v && rd4Same(v, String(it.n));
        R.inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; given.push(s || "-");
        if (!g && !bad) bad = s === "" ? "빈칸에 답을 써요." : (it.why && it.why[s]) || opt.bad || "다시 생각해 봐요.";
        return;
      }
      if (R.kind === "eq") {
        const seen = new Set(), [n0, d0] = rd4ND(it.eq);
        R.ins.forEach(fi => {
          const r = fi.get(); given.push(fi.text());
          let msg = null;
          if (r.err) msg = r.err === "empty" ? "빈칸에 분수를 써요." : "분자와 분모를 모두 수로 써요.";
          else if (!r.hasF || r.hasW) msg = "분수로 써요.";
          else if (r.num * d0 !== n0 * r.den) msg = rd4Diag(it.eq, r) || `${rd4J(rd4Tk(rd4Key(r)), "은는")} ${rd4J(rd4Tk(it.eq), "과와")} 크기가 달라요.`;
          else if (r.n === n0 && r.d === d0) msg = `${rd4J(rd4Tk(it.eq), "은는")} 처음 분수예요. 다른 분수를 만들어요.`;
          else if (seen.has(rd4Key(r))) msg = "같은 분수를 두 번 썼어요. 서로 다른 분수를 만들어요.";
          if (!msg) seen.add(rd4Key(r));
          fi.paint(!msg); if (msg && !bad) bad = msg;
        });
        return;
      }
      const r = R.inp.get(), J = rd4JudgeF(r, it); given.push(R.inp.text());
      R.inp.paint(J.ok);
      if (!J.ok && !bad) bad = J.msg || opt.bad || "다시 생각해 봐요.";
    });
    if (bad) return api.fail(bad, given.join(" / "));
    api.tryOnce();
    api.done(given.join(" / "), opt.ok || "정확하게 해결했어요!");
  } }, "확인하기");
  if (opt.fig) body.append(opt.fig());
  body.append(wrap, h("div", { class: "actions" }, btn));
}

/* ② 계산 과정 빈칸
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 칸(그대로 같아야 정답) | {q:[자연수, 분자, 분모]} 쌓은 분수(자리마다 고정 글·"?답"·배열 ["12÷","?2"]) | {f:"3/6", den, irr, red, from} 분수 입력(값 판정) | {c:[…], a} 고르기 | {ord:[…], asc} 차례 정하기
   수와 =만 있는 줄은 '='로 나눈 값이 모두 같은지 스스로 확인해요. */
function rd4Chain(body, api, rows, opt = {}) {
  rd4Style();
  const ins = [], chs = [], ords = [], plains = [];
  const wrap = h("div");
  const ex = v => v == null ? "" : Array.isArray(v) ? v.map(ex).join("") : String(v)[0] === "?" ? String(v).slice(1) : String(v);
  const jsNum = v => ex(v).replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
  const jsStr = s => String(s).replace(rd4Re(), (m, w, n, d) => `(${w || 0}+(${n})/(${d}))`).replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
  const cell = v => {
    if (v == null) return null;
    if (Array.isArray(v)) return h("span", { style: "display:inline-flex;align-items:center;gap:.1em" }, v.map(cell));
    if (String(v)[0] === "?") { const b = rd4Box(String(v).slice(1)); ins.push(b); return b; }
    return h("span", {}, String(v));
  };
  rows.forEach(row => {
    const parts = Array.isArray(row) ? row : row.p;
    const line = h("div", { class: "rd4cl" });
    if (row.t) line.append(h("span", { class: "rd4tag" }, row.t));
    let plain = row.t ? row.t + " " : "", js = "", math = true;
    parts.forEach(pt => {
      if (typeof pt === "string" || typeof pt === "number") {
        const s = String(pt); line.append(h("span", {}, s)); plain += rd4Plain(s); js += jsStr(s);
        if (!/^[\s\d.=+×÷−\-]*$/.test(s.replace(rd4Re(), ""))) math = false;
      } else if (pt.i != null) {
        const b = rd4Box(pt.i); ins.push(b); line.append(b); plain += pt.i; js += `(${pt.i})`;
      } else if (pt.q) {
        const [W, N, D] = pt.q;
        line.append(h("span", { class: "rd4fr rd4frin" }, W != null ? h("span", { class: "rd4fw" }, cell(W)) : null, h("span", { class: "rd4q" }, h("span", { class: "rd4n" }, cell(N)), h("span", { class: "rd4d" }, cell(D)))));
        const en = ex(N), ed = ex(D);
        plain += /^\d+$/.test(en) && /^\d+$/.test(ed) ? rd4Plain(`[${W != null ? ex(W) + " " : ""}${en}/${ed}]`) : `${W != null ? ex(W) + "와 " : ""}${ed}분의 ${en}`;
        js += `(${W != null ? jsNum(W) : 0}+(${jsNum(N)})/(${jsNum(D)}))`;
      } else if (pt.f) {
        const fi = rd4In("답"); fi.it = Object.assign({ a: pt.f }, pt); ins.push(fi); line.append(fi);
        if (pt.from && !rd4Same(pt.from, pt.f)) throw new Error("답 확인 필요: " + pt.from + " = " + pt.f);
        plain += rd4Plain(rd4Tk(pt.f)); const v = rd4Val(pt.f); js += `(${v.num}/${v.den})`;
      } else if (pt.c) {
        const C = { a: pt.a, sel: null }; const sp = h("span", { class: "rd4chs" });
        pt.c.forEach((o, oi) => sp.append(h("button", { class: "opt", onclick: ev => { [...sp.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); C.sel = oi; } }, o)));
        C.el = sp; chs.push(C); line.append(sp); plain += pt.c[pt.a]; math = false;
      } else if (pt.ord) {
        const O = { ans: rd4Rank(pt.ord, pt.asc), labs: pt.ord, el: rd4OrderEl(pt.ord) };
        ords.push(O); line.append(O.el); plain += O.ans.map(i => rd4Plain(pt.ord[i])).join(pt.asc ? " < " : " > "); math = false;
      }
    });
    wrap.append(line); plains.push(plain.replace(/\s+/g, " ").trim());
    if (math && js.includes("=")) {
      const vals = js.split("=").filter(s => s.trim()).map(s => { try { return Function(`return (${s})`)(); } catch (e) { return NaN; } });
      if (vals.some(v => !isFinite(v) || Math.abs(v - vals[0]) > 1e-9)) throw new Error("식 확인 필요: " + plain);
    }
  });
  api.provide({ words: opt.words || ["분모와 분자에 같은 수를 곱하기", "분모와 분자를 같은 수로 나누기", "공약수", "공배수", "최소공배수", "통분"], answers: plains });
  body.append(wrap, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    let ok = true, msg = null; const given = [];
    ins.forEach(x => {
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp || (/^[\d.]+$/.test(v) && /^[\d.]+$/.test(x.exp) && rd4Val(v) && rd4Same(v, x.exp)); x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = rd4JudgeF(x.get(), x.it); given.push(x.text()); x.paint(J.ok); if (!J.ok) { ok = false; msg = msg || J.msg; } }
    });
    chs.forEach(C => { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(C.sel === C.a ? "good" : "bad"); }); if (C.sel !== C.a) ok = false; given.push(C.sel == null ? "-" : C.el.children[C.sel].textContent); });
    ords.forEach(O => { const v = O.el.get(), g = v.length === O.ans.length && v.every((x, k) => x === O.ans[k]); O.el.paint(g); if (!g) ok = false; given.push(v.map(i => rd4Plain(O.labs[i])).join(">") || "-"); });
    if (!ok) return api.fail(msg || opt.bad || "빨간 칸을 다시 생각해 봐요.", given.join(","));
    api.tryOnce(); api.done(given.join(","), opt.ok || "차례대로 잘 해결했어요!");
  } }, "확인하기")));
}
/* 계산 줄 만들기: [1/2] = (1×2)/(2×2) = [2/4]  ·  [12/18] = (12÷2)/(18÷2) = [6/9] */
function rd4MulRow(f, k, op = "×", tag) {
  const [n, d] = rd4ND(f); const N = op === "×" ? n * k : n / k, D = op === "×" ? d * k : d / k;
  if (!Number.isInteger(N) || !Number.isInteger(D)) throw new Error("나누어떨어지지 않음: " + f + " ÷ " + k);
  const p = [rd4F(n, d) + " = ", { q: [null, [`${n}${op}`, "?" + k], [`${d}${op}`, "?" + k]] }, " = ", { q: [null, "?" + N, "?" + D] }];
  return tag ? { t: tag, p } : p;
}
/* 두 분수를 공통분모 D로 통분하여 비교하는 줄: ([4/6], [3/8]) → ([16/24], [9/24]) → [4/6] ○ [3/8] */
function rd4PairRow(a, b, D, tag) {
  const [na, da] = rd4ND(a), [nb, db] = rd4ND(b);
  if (D % da || D % db) throw new Error("공통분모 확인 필요: " + D);
  const s = rd4Sign(rd4Cmp(a, b));
  const p = [`(${rd4Tk(a)}, ${rd4Tk(b)}) → (`, { q: [null, "?" + na * D / da, String(D)] }, ", ", { q: [null, "?" + nb * D / db, String(D)] }, `) → ${rd4Tk(a)} `, { c: [">", "=", "<"], a: [">", "=", "<"].indexOf(s) }, ` ${rd4Tk(b)}`];
  return tag ? { t: tag, p } : p;
}
/* 조작이 끝나야 아래 문제를 풀 수 있게 */
function rd4Ask(host, api, ready, msg, opt) {
  const g = rd4Gate(api, ready, msg);
  if (opt.ask) return rd4Chain(host, g, opt.ask, { ok: opt.ok, bad: opt.bad });
  if (opt.askCalc) return rd4Calc(host, g, opt.askCalc, { ok: opt.ok });
  api.provide({ words: [], answers: [] });
  host.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => { api.tryOnce(); ready() ? api.done(opt.doneText || "조작 완료", opt.ok) : api.fail(typeof msg === "function" ? msg() : msg, "-"); } }, "확인하기")));
}

/* ③ 막대·원 색칠하기: bars [{name, d, k, col}], shape "bar"|"pie", tip, ask·askCalc, ok */
function rd4Bars(body, api, opt) {
  rd4Style();
  const bars = opt.bars, pie = opt.shape === "pie", nb = bars.length;
  const st = bars.map(b => Array(b.d).fill(false));
  const cnt = i => st[i].filter(Boolean).length;
  const ready = () => bars.every((b, i) => cnt(i) === b.k);
  const W = 900, LX = opt.lx || 230, BW = W - LX - 30, BH = 54, GP = 40;
  const R = Math.min(118, W / nb / 2 - 34), H = pie ? 2 * R + 110 : nb * (BH + GP) + 24;
  const svg = makeSvg(W, H);
  const draw = () => {
    svg.innerHTML = "";
    bars.forEach((b, i) => {
      const col = b.col != null ? b.col : i, ok = cnt(i) === b.k;
      if (pie) {
        const cx = W / nb * (i + .5), cy = R + 20;
        for (let c = 0; c < b.d; c++) {
          const a0 = -Math.PI / 2 + 2 * Math.PI * c / b.d, a1 = a0 + 2 * Math.PI / b.d;
          const p = b.d === 1 ? svgEl("circle", { cx, cy, r: R }) : svgEl("path", { d: `M${cx},${cy} L${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} Z` });
          p.setAttribute("fill", st[i][c] ? RD4_F[col % 5] : "#fff"); p.setAttribute("stroke", INK); p.setAttribute("stroke-width", 2.5); p.setAttribute("style", "cursor:pointer");
          p.addEventListener("click", () => { st[i][c] = !st[i][c]; draw(); });
          svg.append(p);
        }
        svg.append(svgEl("circle", { cx, cy, r: R, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
        svg.append(rd4SvgLine(b.name, cx, cy + R + 36, 25));
        svg.append(rd4SvgLine(`색칠 ${cnt(i)}칸`, cx, cy + R + 70, 18, { fill: ok ? "#2E8B57" : "#5B6B6B" }));
      } else {
        const y = 18 + i * (BH + GP);
        svg.append(rd4SvgLine(b.name, LX - 18, y + BH / 2 - 8, 25, { anchor: "end" }));
        svg.append(rd4SvgLine(`색칠 ${cnt(i)}칸`, LX - 18, y + BH / 2 + 22, 17, { anchor: "end", fill: ok ? "#2E8B57" : "#5B6B6B" }));
        for (let c = 0; c < b.d; c++) {
          const r = svgEl("rect", { x: LX + c * BW / b.d, y, width: BW / b.d, height: BH, fill: st[i][c] ? RD4_F[col % 5] : "#fff", stroke: INK, "stroke-width": 2, style: "cursor:pointer" });
          r.addEventListener("click", () => { st[i][c] = !st[i][c]; draw(); });
          svg.append(r);
        }
        svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4, "pointer-events": "none" }));
      }
    });
    /* 모두 알맞게 색칠하면 색칠한 끝(앞에서부터 같은 양)에 점선 */
    if (!pie && ready() && opt.line !== false) {
      const xs = new Map();
      bars.forEach((b, i) => { const x = LX + BW * b.k / b.d; const key = Math.round(x * 100); if (!xs.has(key)) xs.set(key, { x, col: b.col != null ? b.col : i }); });
      xs.forEach(o => svg.append(svgEl("line", { x1: o.x, y1: 6, x2: o.x, y2: H - 6, stroke: RD4_S[o.col % 5], "stroke-width": 3, "stroke-dasharray": "8 6", "pointer-events": "none" })));
    }
  };
  draw();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || (pie ? "조각을 누르면 색칠되고, 한 번 더 누르면 지워져요." : "칸을 누르면 색칠되고, 한 번 더 누르면 지워져요. 다 칠하면 색칠한 양의 끝에 점선이 나타나요.")), h("div", { class: "rd4stage" }, svg), ask);
  rd4Ask(ask, api, ready, () => { const i = bars.findIndex((b, k) => cnt(k) !== b.k); return `먼저 ‘${rd4Plain(bars[i].name)}’만큼 알맞게 색칠해요. 지금 ${cnt(i)}칸이에요.`; }, opt);
}

/* ④ 칸 수 바꾸기: bars [{name, v}] 같은 칸 수로 나눔, parts [칸 수…], start, need [기록해야 할 칸 수…]
   fold: true 이면 색종이를 반으로 계속 접었다 펴기(칸 수 2배씩, max까지, 저절로 기록) */
function rd4Split(body, api, opt) {
  rd4Style();
  const bars = opt.bars, V = bars.map(b => rd4Val(b.v)), nb = bars.length;
  let n = opt.start || V[0].den;
  const found = [];
  const aligned = k => V.every(v => (v.num * k) % v.den === 0);
  const fr = (i, k) => rd4F(V[i].num * k / V[i].den, k);
  const W = 900, fold = !!opt.fold;
  const LX = opt.lx || 210, BW = W - LX - 130, BH = 56, GP = 50, H = fold ? 380 : nb * (BH + GP) + 20;
  const svg = makeSvg(W, H);
  const readout = h("div", { class: "rd4tip" });
  const chips = h("div", { class: "rd4chips" });
  const draw = () => {
    svg.innerHTML = "";
    const al = aligned(n);
    if (fold) {
      const S = 300, x0 = 230, y0 = 30;
      svg.append(svgEl("rect", { x: x0, y: y0, width: S, height: S, fill: "#fff", stroke: INK, "stroke-width": 3 }));
      svg.append(svgEl("rect", { x: x0, y: y0, width: S * V[0].num / V[0].den, height: S, fill: "#F28B82", stroke: "none" }));
      for (let k = 1; k < n; k++) svg.append(svgEl("line", { x1: x0 + S * k / n, y1: y0, x2: x0 + S * k / n, y2: y0 + S, stroke: "#5B6B6B", "stroke-width": 2.5, "stroke-dasharray": "9 6" }));
      svg.append(svgEl("rect", { x: x0, y: y0, width: S, height: S, fill: "none", stroke: INK, "stroke-width": 4 }));
      svg.append(rd4SvgLine(bars[0].name, x0 + S / 2, y0 + S + 26, 22));
      svg.append(rd4SvgLine(`${n}칸 중 ${V[0].num * n / V[0].den}칸`, 720, 120, 24));
      svg.append(rd4SvgLine(fr(0, n), 720, 190, 44, { fill: "#C8472E" }));
    } else {
      bars.forEach((b, i) => {
        const y = 16 + i * (BH + GP), col = b.col != null ? b.col : i;
        svg.append(rd4SvgLine(b.name, LX - 18, y + BH / 2, 24, { anchor: "end" }));
        svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "#fff" }));
        svg.append(svgEl("rect", { x: LX, y, width: BW * V[i].num / V[i].den, height: BH, fill: RD4_F[col % 5] }));
        for (let k = 1; k < n; k++) svg.append(svgEl("line", { x1: LX + BW * k / n, y1: y, x2: LX + BW * k / n, y2: y + BH, stroke: INK, "stroke-width": n > 30 ? 1.2 : 2 }));
        svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4 }));
        const ex = LX + BW * V[i].num / V[i].den, ok = (V[i].num * n) % V[i].den === 0;
        svg.append(svgEl("path", { d: `M${ex},${y + BH + 3} l-9,15 h18 z`, fill: ok ? "#2E8B57" : "#C8472E" }));
        svg.append(ok ? rd4SvgLine(fr(i, n), LX + BW + 22, y + BH / 2, 30, { anchor: "start", fill: "#2E8B57" }) : txt(LX + BW + 40, y + BH / 2, "?", 30, { fill: "#C8472E" }));
      });
    }
    readout.textContent = fold ? `지금 색종이는 똑같이 ${n}칸으로 나누어져 있어요. 빨간색 부분은 ${n}칸 중 ${V[0].num * n / V[0].den}칸 → ${fr(0, n)}`
      : bars.map((b, i) => (V[i].num * n) % V[i].den === 0 ? `${b.name} → ${n}칸 중 ${V[i].num * n / V[i].den}칸 = ${fr(i, n)}` : `${b.name} → 색칠한 끝이 칸의 경계와 맞지 않아요`).join(" · ");
    [...tools.querySelectorAll("button[data-n]")].forEach(btn => btn.classList.toggle("rd4on", +btn.dataset.n === n));
    chips.innerHTML = "";
    chips.append(h("span", { class: "rd4lab" }, "기록한 분수: "));
    if (!found.length) chips.append(h("span", { class: "rd4log" }, "아직 없어요"));
    found.forEach(k => chips.append(h("span", { class: "rd4chip" }, bars.map((b, i) => fr(i, k)).join(", "))));
  };
  const record = auto => {
    if (!aligned(n)) { if (!auto) api.hint(nb > 1 ? "두 막대의 색칠한 끝이 모두 칸의 경계와 맞아야 분수로 나타낼 수 있어요. 다른 칸 수로 나누어 봐요." : "색칠한 끝이 칸의 경계와 맞지 않아요. 그러면 분수로 딱 맞게 나타낼 수 없어요. 다른 칸 수로 나누어 봐요."); return; }
    if (found.includes(n)) { if (!auto) api.hint("이미 기록했어요. 다른 칸 수로도 나누어 봐요."); return; }
    found.push(n); draw();
    api.hint(nb > 1 ? `${n}칸으로 나누니 ${rd4J(bars.map((b, i) => fr(i, n)).join(", "), "이가")} 되었어요. 분모가 같아졌어요!` : `${rd4J(fr(0, n), "을를")} 기록했어요.`);
  };
  const tools = h("div", { class: "rd4tools" });
  if (fold) {
    tools.append(h("button", { onclick: () => { if (n * 2 > (opt.max || 8)) return api.hint("이번에는 여기까지 접어요. 기록한 분수를 살펴봐요."); n *= 2; draw(); record(true); } }, "반으로 한 번 더 접었다 펴기"),
      h("button", { onclick: () => { n = opt.start || V[0].den; draw(); } }, "처음 색종이로"));
  } else {
    tools.append(h("span", { class: "rd4lab" }, "똑같이 나누기:"));
    (opt.parts || []).forEach(k => tools.append(h("button", { "data-n": k, onclick: () => { n = k; draw(); } }, `${k}칸`)));
    tools.append(h("button", { onclick: () => record(false) }, "이 분수 기록하기"));
  }
  draw();
  const need = opt.need || [];
  const ready = () => need.every(k => found.includes(k));
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || (fold ? "단추를 눌러 색종이를 반으로 접었다 펴요. 빨간색 부분을 분수로 나타내 봐요." : "칸 수 단추를 눌러 막대를 똑같이 나누어 보고, 색칠한 끝이 칸의 경계와 딱 맞으면 ‘이 분수 기록하기’를 눌러요.")), tools, h("div", { class: "rd4stage" }, svg), readout, chips, ask);
  rd4Ask(ask, api, ready, () => { const k = need.find(x => !found.includes(x)); return fold ? "색종이를 끝까지 접어 보며 분수를 모두 기록해요." : `아직 기록하지 않은 분수가 있어요. ${k}칸으로도 나누어 봐요.`; }, opt);
}

/* ⑤ 약분하기: v "16/40", divs [÷ 단추], once(한 번에 기약분수로) */
function rd4Reduce(body, api, opt) {
  rd4Style();
  const [n0, d0] = rd4ND(opt.v);
  let path = [{ n: n0, d: d0, k: null }];
  const cur = () => path[path.length - 1];
  const W = 900, LX = 200, BW = 640, BH = 50, H = 2 * (BH + 48) + 10;
  const svg = makeSvg(W, H);
  const chain = h("div", { class: "rd4chain" });
  const draw = () => {
    svg.innerHTML = "";
    [{ n: n0, d: d0, lab: "처음" }, Object.assign({ lab: "지금" }, cur())].forEach((f, i) => {
      const y = 18 + i * (BH + 48);
      svg.append(rd4SvgLine(`${f.lab} ${rd4F(f.n, f.d)}`, LX - 16, y + BH / 2, 24, { anchor: "end" }));
      svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "#fff" }));
      svg.append(svgEl("rect", { x: LX, y, width: BW * f.n / f.d, height: BH, fill: RD4_F[i ? 2 : 0] }));
      for (let k = 1; k < f.d; k++) svg.append(svgEl("line", { x1: LX + BW * k / f.d, y1: y, x2: LX + BW * k / f.d, y2: y + BH, stroke: INK, "stroke-width": f.d > 30 ? 1.2 : 2 }));
      svg.append(svgEl("rect", { x: LX, y, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 4 }));
    });
    const x = LX + BW * n0 / d0;
    svg.append(svgEl("line", { x1: x, y1: 8, x2: x, y2: H - 6, stroke: RD4_S[4], "stroke-width": 3, "stroke-dasharray": "8 6" }));
    chain.innerHTML = "";
    path.forEach((f, i) => {
      if (i) chain.append(h("span", {}, "="), h("span", { class: "rd4arr" }, `÷${f.k}`));
      chain.append(h("span", {}, rd4F(f.n, f.d)));
    });
    if (rd4G(cur().n, cur().d) === 1) chain.append(h("span", { class: "rd4chip" }, "더 나눌 수 없어요"));
  };
  const nums = h("div", { class: "rd4num" });
  (opt.divs || [2, 3, 4, 5, 6, 7, 8, 9]).forEach(k => nums.append(h("button", { onclick: () => {
    const c = cur();
    if (rd4G(c.n, c.d) === 1) return api.hint(`${rd4F(c.n, c.d)}의 분모와 분자의 공약수는 1뿐이에요. 더 이상 나눌 수 없어요.`);
    if (c.n % k || c.d % k) return api.hint(`${rd4J(String(k), "은는")} ${rd4J(String(c.d), "과와")} ${c.n}의 공약수가 아니에요. ${c.d} ÷ ${k}, ${c.n} ÷ ${k} 중 나누어떨어지지 않는 것이 있어요.`);
    path.push({ n: c.n / k, d: c.d / k, k }); draw();
    const z = cur();
    if (rd4G(z.n, z.d) === 1) api.hint(opt.once && path.length > 2 ? `${rd4F(z.n, z.d)}이 되었어요. 이번에는 한 번에 나누어 ${rd4F(z.n, z.d)}을 만들어 봐요. 처음부터 해 봐요.` : `${rd4F(z.n, z.d)}의 분모와 분자의 공약수는 1뿐이에요.`);
    else api.hint(`분모와 분자를 ${rd4J(String(k), "으로")} 나누었어요. 더 나눌 수 있을까요?`);
  } }, `÷ ${k}`)));
  const reset = h("button", { onclick: () => { path = [path[0]]; draw(); } }, "처음부터");
  draw();
  const ready = () => rd4G(cur().n, cur().d) === 1 && (!opt.once || path.length === 2);
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "÷ 단추를 누르면 분모와 분자를 그 수로 나누어요. 분모와 분자의 공약수가 1뿐일 때까지 나누어 봐요."), nums, h("div", { class: "rd4tools" }, reset), chain, h("div", { class: "rd4stage" }, svg), ask);
  rd4Ask(ask, api, ready, () => opt.once && rd4G(cur().n, cur().d) === 1 ? "한 번에 나누어 기약분수를 만들어 봐요. 분모와 분자를 무엇으로 나누어야 할까요?" : "먼저 더 나눌 수 없을 때까지 분모와 분자를 공약수로 나누어요.", opt);
}

/* ⑥ 크기가 같은 분수를 늘어놓고 분모가 같은 짝 찾기: a, b, m(몇 배까지) */
function rd4Common(body, api, opt) {
  rd4Style();
  const m = opt.m || 6, FS = [rd4ND(opt.a), rd4ND(opt.b)];
  const rows = FS.map(([n, d], r) => ({ n, d, cards: Array.from({ length: m }, (_, i) => ({ k: i + 1, n: n * (i + 1), d: d * (i + 1), r })) }));
  const dens = rows.map(R => R.cards.map(c => c.d));
  const targets = dens[0].filter(x => dens[1].includes(x));
  if (!targets.length) throw new Error("분모가 같은 짝이 없어요");
  let phase = "fill", pick = null; const found = [];
  const wrap = h("div");
  const info = h("p", { class: "rd4tip" });
  const pairs = h("div", { class: "rd4chips" });
  const inputs = [];
  rows.forEach((R, r) => {
    const box = h("div", { class: "rd4row" }, h("div", { class: "rd4rowt" }, `${rd4J(rd4F(R.n, R.d), "과와")} 크기가 같은 분수 (분모가 작은 것부터)`));
    const line = h("div", { class: "rd4cards" });
    R.cards.forEach(c => {
      let el;
      if (c.k === 1) el = h("button", { class: "rd4card" }, h("span", {}, rd4F(c.n, c.d)), h("small", {}, "처음 분수"));
      else {
        const inp = rd4Box(c.n); inp.card = c; inputs.push(inp);
        el = h("button", { class: "rd4card" }, h("span", { class: "rd4fr rd4frin" }, h("span", { class: "rd4q" }, h("span", { class: "rd4n" }, inp), h("span", { class: "rd4d" }, String(c.d)))), h("small", {}, `×${c.k}`));
      }
      c.el = el;
      el.addEventListener("click", ev => {
        if (phase !== "pair") return;
        if (ev.target.tagName === "INPUT") return;
        if (found.includes(c.d) && targets.includes(c.d) && c.el.classList.contains("rd4pr")) return;
        if (!pick || pick.r === c.r) { if (pick) pick.el.classList.remove("rd4pk"); pick = c; el.classList.add("rd4pk"); return; }
        const a = pick; pick = null; a.el.classList.remove("rd4pk");
        if (a.d !== c.d) { a.el.classList.add("rd4no"); c.el.classList.add("rd4no"); setTimeout(() => { a.el.classList.remove("rd4no"); c.el.classList.remove("rd4no"); }, 700); return api.hint(`분모가 ${a.d}, ${c.d}로 달라요. 분모가 같은 두 분수를 찾아요.`); }
        if (!found.includes(c.d)) found.push(c.d);
        a.el.classList.add("rd4pr"); c.el.classList.add("rd4pr");
        const A = a.r === 0 ? a : c, B = a.r === 0 ? c : a;
        pairs.append(h("span", { class: "rd4chip" }, `(${rd4F(A.n, A.d)}, ${rd4F(B.n, B.d)})`));
        api.hint(found.length >= targets.length ? "분모가 같은 짝을 모두 찾았어요!" : `분모가 ${c.d}로 같은 짝을 찾았어요. 또 있을까요?`);
      });
      line.append(el);
    });
    box.append(line); wrap.append(box);
  });
  const fillBtn = h("button", { onclick: () => {
    let ok = true;
    inputs.forEach(i => { const g = i.value.replace(/\s/g, "") === String(i.card.n); i.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; });
    if (!ok) return api.hint(`빨간 칸을 다시 계산해요. 분모에 곱한 수(×2, ×3, …)를 분자에도 곱해요.`);
    phase = "pair"; inputs.forEach(i => { i.disabled = true; });
    fillBtn.disabled = true;
    info.textContent = "이제 위 줄에서 한 장, 아래 줄에서 한 장을 눌러 분모가 같은 분수의 짝을 모두 찾아요.";
    api.hint("크기가 같은 분수를 모두 만들었어요. 분모가 같은 짝을 찾아봐요.");
  } }, "분자 다 썼어요");
  info.textContent = "분모에 곱한 수만큼 분자에도 곱하여 빈칸을 채운 다음 ‘분자 다 썼어요’를 눌러요.";
  const ask = h("div", { class: "rd4ask" });
  body.append(info, wrap, h("div", { class: "rd4tools" }, fillBtn), h("div", { class: "rd4chips" }, h("span", { class: "rd4lab" }, "찾은 짝: "), pairs), ask);
  const ready = () => phase === "pair" && targets.every(t => found.includes(t));
  rd4Ask(ask, api, ready, () => phase === "fill" ? "먼저 크기가 같은 분수의 분자를 모두 채워요." : "분모가 같은 짝을 모두 찾아요.", opt);
}

/* ⑦ 분수 막대 + 세로 자: rows [1, 6, 9, 15], need ["3/9", "10/15"] (그 위치에 자를 놓아 봐야 함) */
function rd4Wall(body, api, opt) {
  rd4Style();
  const rows = opt.rows, L = rows.reduce((a, d) => rd4Lcm(a, d), 1);
  const W = 900, LX = 30, BW = 840, RH = 50, GP = 10, TOP = 44, H = TOP + rows.length * (RH + GP) + 10;
  const X = t => LX + BW * t / L;
  let t = 0; const seen = new Set();
  const svg = makeSvg(W, H);
  const readout = h("p", { class: "rd4tip" });
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
    rows.forEach((d, i) => {
      const y = TOP + i * (RH + GP), on = t > 0 && (t * d) % L === 0, m = t * d / L;
      for (let c = 0; c < d; c++) {
        const x = LX + BW * c / d, w = BW / d;
        svg.append(svgEl("rect", { x, y, width: w, height: RH, fill: on && c < m ? RD4_F[i % 5] : "#fff", stroke: INK, "stroke-width": 2 }));
        if (w >= 40) svg.append(d === 1 ? txt(x + w / 2, y + RH / 2, "1", 24) : rd4SvgLine(`[1/${d}]`, x + w / 2, y + RH / 2, 20));
      }
    });
    svg.append(svgEl("line", { x1: X(t), y1: 18, x2: X(t), y2: H - 4, stroke: "#C8472E", "stroke-width": 4 }));
    svg.append(svgEl("circle", { cx: X(t), cy: 20, r: 13, fill: "#C8472E", style: "cursor:grab" }));
    const al = rows.filter(d => d > 1 && t > 0 && (t * d) % L === 0).map(d => rd4F(t * d / L, d));
    readout.textContent = t === 0 ? "빨간 세로 자를 끌어 옮겨 봐요." : al.length > 1 ? `자의 자리에서 끝이 맞는 분수: ${al.join(" = ")} — 크기가 같은 분수예요.` : al.length === 1 ? `자의 자리에서 끝이 맞는 분수는 ${al[0]}뿐이에요.` : "이 자리에서는 끝이 맞는 분수가 없어요.";
  };
  dragOn(svg, p => { t = Math.max(0, Math.min(L, Math.round((p.x - LX) / BW * L))); draw(); }, p => { t = Math.max(0, Math.min(L, Math.round((p.x - LX) / BW * L))); draw(); }, () => { seen.add(t); });
  draw();
  const need = (opt.need || []).map(s => { const v = rd4Val(s); return v.num * L / v.den; });
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "빨간 세로 자를 끌어 칸의 끝에 맞추면, 그 자리에서 끝이 맞는 분수가 색칠돼요."), h("div", { class: "rd4stage" }, svg), readout, ask);
  rd4Ask(ask, api, () => need.every(x => seen.has(x)), () => { const x = need.find(v => !seen.has(v)); const s = opt.need[need.indexOf(x)]; return `세로 자를 ${rd4Tk(s)}의 끝에 놓아 봐요.`; }, opt);
}

/* ⑧ 수직선에 놓기: max, t(1을 몇 칸으로), lab "dec"(눈금마다 소수), items [{name, v}] */
function rd4Place(body, api, opt) {
  rd4Style();
  const max = opt.max || 1, T = opt.t || 10, N = max * T, W = 900, X0 = 60, X1 = 840, Y = 130, H = 210, U = (X1 - X0) / N, X = k => X0 + k * U;
  const items = opt.items.map(it => { const v = rd4Val(it.v), k = v.num * T / v.den; if (!Number.isInteger(k) || k < 0 || k > N) throw new Error("수직선 확인 필요: " + it.v); return Object.assign({ k, at: null }, it); });
  let cur = 0;
  const svg = makeSvg(W, H);
  const btns = h("div", { class: "rd4tools" });
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));
    svg.append(svgEl("line", { x1: X0 - 20, y1: Y, x2: X1 + 25, y2: Y, stroke: INK, "stroke-width": 3 }));
    for (let k = 0; k <= N; k++) {
      const big = k % T === 0, mid = !big && T % 2 === 0 && k % (T / 2) === 0;
      svg.append(svgEl("line", { x1: X(k), y1: Y - (big ? 18 : mid ? 14 : 10), x2: X(k), y2: Y + (big ? 18 : mid ? 14 : 10), stroke: INK, "stroke-width": big ? 3 : 1.8 }));
      if (big) svg.append(txt(X(k), Y + 44, String(k / T), 26));
      else if (opt.lab === "dec") svg.append(txt(X(k), Y + 40, rd4DecStr(rd4F(k, T)), 17, { fill: "#5B6B6B" }));
    }
    items.forEach((it, i) => {
      if (it.at == null) return;
      const col = RD4_S[(it.col != null ? it.col : i) % 5], up = i % 2 === 0;
      svg.append(svgEl("circle", { cx: X(it.at), cy: Y, r: 10, fill: col, stroke: "#fff", "stroke-width": 2 }));
      svg.append(svgEl("line", { x1: X(it.at), y1: Y - 12, x2: X(it.at), y2: up ? Y - 48 : Y - 30, stroke: col, "stroke-width": 2 }));
      svg.append(rd4SvgLine(it.name, X(it.at), up ? Y - 72 : Y - 50, 22, { fill: col }));
    });
    [...btns.children].forEach((b, i) => b.classList.toggle("rd4on", i === cur));
  };
  items.forEach((it, i) => btns.append(h("button", { onclick: () => { cur = i; draw(); } }, it.name)));
  svg.addEventListener("click", ev => {
    const p = svgPt(svg, ev), k = Math.round((p.x - X0) / U);
    if (k < 0 || k > N || cur == null) return;
    const it = items[cur];
    if (k !== it.k) return api.hint(`그곳은 ${rd4J(opt.lab === "dec" ? rd4DecStr(rd4F(k, T)) : rd4F(k, T), "이에요")}. ‘${it.name}’의 자리를 다시 찾아봐요.${opt.lab === "dec" ? "" : ` 작은 눈금 한 칸은 ${rd4J(rd4F(1, T), "이에요")}.`}`);
    it.at = k; const nx = items.findIndex(x => x.at == null); if (nx >= 0) cur = nx;
    draw();
    api.hint(nx >= 0 ? `‘${it.name}’의 자리를 찾았어요. 다음 수도 놓아 봐요.` : "모두 알맞은 자리에 놓았어요. 어느 쪽이 더 오른쪽에 있나요?");
  });
  draw();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "아래 단추로 수를 고른 다음, 수직선에서 그 수의 자리를 눌러요."), btns, h("div", { class: "rd4stage" }, svg), ask);
  rd4Ask(ask, api, () => items.every(it => it.at === it.k), "먼저 수직선에 수를 모두 놓아요.", opt);
}

/* ⑨ 100칸 모눈 색칠: grids [{name, k}] (한 칸 = 1/100, 누른 칸까지 차례로 색칠) */
function rd4Hund(body, api, opt) {
  rd4Style();
  const G = opt.grids, C = 24, GW = 240, GAP = 80, W = G.length * GW + (G.length - 1) * GAP + 60, H = GW + 110;
  const cnt = G.map(() => 0);
  const svg = makeSvg(W, H);
  const draw = () => {
    svg.innerHTML = "";
    G.forEach((g, i) => {
      const x0 = 30 + i * (GW + GAP), y0 = 50;
      svg.append(rd4SvgLine(g.name, x0 + GW / 2, 24, 24));
      for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
        const idx = r * 10 + c;
        const rc = svgEl("rect", { x: x0 + c * C, y: y0 + r * C, width: C, height: C, fill: idx < cnt[i] ? RD4_F[i % 5] : "#fff", stroke: "#8A9A97", "stroke-width": 1, style: "cursor:pointer" });
        rc.addEventListener("click", () => { cnt[i] = cnt[i] === idx + 1 ? idx : idx + 1; draw(); });
        svg.append(rc);
      }
      svg.append(svgEl("rect", { x: x0, y: y0, width: GW, height: GW, fill: "none", stroke: INK, "stroke-width": 3, "pointer-events": "none" }));
      svg.append(rd4SvgLine(`색칠 ${cnt[i]}칸 = [${cnt[i]}/100]`, x0 + GW / 2, y0 + GW + 34, 21, { fill: cnt[i] === g.k ? "#2E8B57" : "#5B6B6B" }));
    });
  };
  draw();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "모눈 한 칸은 [1/100]이에요. 칸을 누르면 첫 칸부터 그 칸까지 색칠돼요(같은 칸을 한 번 더 누르면 한 칸 지워져요)."), h("div", { class: "rd4stage" }, svg), ask);
  rd4Ask(ask, api, () => G.every((g, i) => cnt[i] === g.k), () => { const i = G.findIndex((g, k) => cnt[k] !== g.k); return `먼저 ‘${rd4Plain(G[i].name)}’만큼 색칠해요. 지금 ${cnt[i]}칸이에요.`; }, opt);
}

/* ⑩ 나누어 놓기: bins [이름…], cards [{t, b, why}] */
function rd4Sort(body, api, opt) {
  rd4Style();
  const cards = opt.cards, place = cards.map(() => null);
  let sel = null;
  const pool = h("div", { class: "rd4pool" }), bins = h("div", { class: "rd4bins" });
  const lists = opt.bins.map(() => h("div", { class: "rd4binl" }));
  const btn = cards.map((c, i) => h("button", { class: "opt", onclick: () => {
    if (place[i] != null) { place[i] = null; sel = null; return draw(); }
    sel = sel === i ? null : i; draw();
  } }, c.t));
  opt.bins.forEach((nm, b) => bins.append(h("div", { class: "rd4bin" }, h("button", { class: "rd4binh", onclick: () => {
    if (sel == null) return api.hint("먼저 위의 카드를 하나 눌러요.");
    place[sel] = b; sel = null; draw();
  } }, nm + " ▼"), lists[b])));
  const draw = () => {
    pool.innerHTML = ""; lists.forEach(l => { l.innerHTML = ""; });
    cards.forEach((c, i) => { btn[i].classList.remove("good", "bad"); btn[i].classList.toggle("rd4sel", sel === i); (place[i] == null ? pool : lists[place[i]]).append(btn[i]); });
    if (!pool.children.length) pool.append(h("span", { class: "rd4log" }, "카드를 모두 놓았어요. 확인해 봐요."));
  };
  draw();
  api.provide({ words: opt.words || [], answers: opt.bins.map((nm, b) => `${rd4Plain(nm)}: ${cards.filter(c => c.b === b).map(c => rd4Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "카드를 누른 다음, 알맞은 칸의 제목을 눌러 옮겨요. 놓은 카드를 누르면 다시 위로 돌아와요."), pool, bins, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (place.some(p => p == null)) return api.fail("아직 놓지 않은 카드가 있어요.", "-");
    let bad = null;
    cards.forEach((c, i) => { const g = place[i] === c.b; btn[i].classList.add(g ? "good" : "bad"); if (!g && !bad) bad = c.why || `‘${rd4Plain(c.t)}’ 카드를 다시 살펴봐요.`; });
    const given = opt.bins.map((nm, b) => cards.filter((c, i) => place[i] === b).map(c => rd4Plain(c.t)).join("·")).join(" / ");
    if (bad) return api.fail(bad, given);
    api.tryOnce(); api.done(given, opt.ok || "모두 알맞게 나누었어요!");
  } }, "확인하기")));
}

/* ⑪ 수 카드로 분수 만들기: nums [분자…], cards [분모로 쓸 수 카드…] → 가장 큰 분수 찾기 */
function rd4Cards(body, api, opt) {
  rd4Style();
  const nums = opt.nums, cards = opt.cards, slot = nums.map(() => null);
  let sel = null, solved = false;
  const cardRow = h("div", { class: "rd4cards" }), fracRow = h("div", { class: "rd4cards" }), pickBox = h("div"), log = h("div");
  const cBtn = cards.map((c, i) => h("button", { class: "rd4card", onclick: () => { if (solved) return; if (slot.includes(i)) return; sel = sel === i ? null : i; draw(); } }, String(c)));
  const sBtn = nums.map((n, j) => h("button", { class: "rd4card", onclick: () => {
    if (solved) return;
    if (sel == null) { if (slot[j] != null) { slot[j] = null; draw(); } else api.hint("먼저 수 카드를 하나 눌러요."); return; }
    slot[j] = sel; sel = null; draw();
  } }));
  const draw = () => {
    cardRow.innerHTML = ""; fracRow.innerHTML = "";
    cBtn.forEach((b, i) => { b.classList.toggle("rd4pk", sel === i); b.disabled = slot.includes(i); b.style.opacity = slot.includes(i) ? ".35" : ""; cardRow.append(b); });
    sBtn.forEach((b, j) => {
      b.innerHTML = "";
      b.append(h("span", { class: "rd4fr rd4frin" }, h("span", { class: "rd4q" }, h("span", { class: "rd4n" }, String(nums[j])), h("span", { class: "rd4d" }, slot[j] == null ? "□" : String(cards[slot[j]])))));
      fracRow.append(b);
    });
    pickBox.innerHTML = "";
    if (slot.every(s => s != null)) {
      const fr = nums.map((n, j) => `${n}/${cards[slot[j]]}`);
      pickBox.append(h("p", { class: "rd4tip" }, "만든 세 분수 중 가장 큰 분수를 눌러요."));
      const row = h("div", { class: "opts" });
      fr.forEach((f, j) => row.append(h("button", { class: "opt", onclick: ev => {
        if (solved) return;
        const big = rd4Rank(fr)[0];
        if (j !== big) { ev.currentTarget.classList.add("bad"); const other = fr[big]; return api.hint(rd4Explain(f, other) + " 두 분수씩 짝 지어 통분해 봐요."); }
        ev.currentTarget.classList.add("good"); solved = true;
        const ord = rd4Rank(fr, true);
        log.innerHTML = "";
        [[0, 1], [1, 2], [0, 2]].forEach(([x, y]) => log.append(h("p", { class: "rd4log" }, rd4Explain(fr[x], fr[y]))));
        log.append(h("p", { class: "rd4tip" }, `${ord.map(i => rd4Tk(fr[i])).join(" < ")} → 가장 큰 분수는 ${rd4J(rd4Tk(fr[big]), "이에요")}.`));
        api.hint("가장 큰 분수를 찾았어요!");
      } }, rd4Tk(f))));
      pickBox.append(row);
    }
  };
  draw();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "수 카드를 누른 다음 분모 자리(□)를 눌러 분수를 만들어요. 분모 자리를 다시 누르면 카드가 돌아와요."),
    h("div", { class: "rd4row" }, h("div", { class: "rd4rowt" }, "수 카드"), cardRow), h("div", { class: "rd4row" }, h("div", { class: "rd4rowt" }, "만든 분수"), fracRow), pickBox, log,
    h("div", { class: "rd4tools" }, h("button", { onclick: () => { slot.fill(null); sel = null; solved = false; log.innerHTML = ""; draw(); } }, "다시 만들기")), ask);
  rd4Ask(ask, api, () => solved, () => slot.some(s => s == null) ? "먼저 수 카드로 분수 3개를 만들어요." : "만든 세 분수 중 가장 큰 분수를 찾아 눌러요.", Object.assign({ doneText: "가장 큰 분수 찾기" }, opt));
}

/* ===== 놀이 ===== */
let RD4_MY = null;   // 9차시 '카드 만들기'에서 만든 내 카드 4장
/* 카드 만들기: 진분수 2장(분모 2~9), 1보다 작은 소수 한 자리 수, 1보다 작은 소수 두 자리 수 */
function rd4Maker(body, api, opt) {
  rd4Style();
  const f1 = rd4In("진분수 카드 1"), f2 = rd4In("진분수 카드 2");
  const d1 = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "rd4box rd4wide", "aria-label": "소수 한 자리 수 카드", placeholder: "0.□" });
  const d2 = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "rd4box rd4wide", "aria-label": "소수 두 자리 수 카드", placeholder: "0.□□" });
  const show = h("div", { class: "rd4cards" });
  const grid = h("div", { class: "rd4maker" },
    h("div", {}, h("b", {}, "① 진분수 (분모는 2~9)"), f1), h("div", {}, h("b", {}, "② 진분수 (분모는 2~9)"), f2),
    h("div", {}, h("b", {}, "③ 1보다 작은 소수 한 자리 수"), d1), h("div", {}, h("b", {}, "④ 1보다 작은 소수 두 자리 수"), d2));
  api.provide({ words: ["진분수", "소수 한 자리 수", "소수 두 자리 수"], answers: ["예: [2/3], [3/8], 0.6, 0.45"] });
  const chkF = (fi, k) => { const r = fi.get(); if (r.err || !r.hasF || r.hasW) return `${k}번 카드에 분수를 써요.`; if (r.d < 2 || r.d > 9) return `${k}번 카드의 분모는 2부터 9까지의 수 중에서 써요.`; if (r.n < 1 || r.n >= r.d) return `${k}번 카드는 분자가 분모보다 작은 진분수로 써요(분자는 1 이상).`; return null; };
  body.append(h("p", { class: "rd4tip" }, "빈 카드 4장에 내가 놀이에 쓸 수를 자유롭게 써넣어요."), grid, show, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const v1 = d1.value.trim(), v2 = d2.value.trim();
    const bad = chkF(f1, 1) || chkF(f2, 2) || (!/^0\.[1-9]$/.test(v1) ? "③번 카드는 0.1부터 0.9까지의 소수 한 자리 수로 써요." : null) || (!/^0\.\d[1-9]$/.test(v2) ? "④번 카드는 0.01부터 0.99까지의 소수 두 자리 수로 써요(예: 0.45)." : null);
    [f1, f2].forEach((fi, k) => fi.paint(!chkF(fi, k + 1)));
    d1.style.borderColor = /^0\.[1-9]$/.test(v1) ? "var(--ok)" : "var(--no)"; d2.style.borderColor = /^0\.\d[1-9]$/.test(v2) ? "var(--ok)" : "var(--no)";
    if (bad) return api.fail(bad, [f1.text(), f2.text(), v1, v2].join(", "));
    const a = f1.get(), b = f2.get();
    RD4_MY = [rd4F(a.n, a.d), rd4F(b.n, b.d), v1, v2];
    show.innerHTML = ""; RD4_MY.forEach(c => show.append(h("span", { class: "rd4card" }, c, h("small", {}, "내 카드"))));
    api.tryOnce(); api.done(RD4_MY.join(", "), "카드를 완성했어요! 이 카드로 놀이를 해요.");
  } }, "카드 완성")));
}
/* 손 그림: 펼친 손가락 up개 */
function rd4Hand(up) {
  const s = makeSvg(120, 120);
  const X = [36, 53, 70, 87];
  for (let j = 0; j < 4; j++) { const on = j + 1 < up; s.append(svgEl("rect", { x: X[j] - 7, y: on ? 12 : 44, width: 14, height: on ? 58 : 24, rx: 7, fill: on ? "#FFD9B8" : "#E3CDBB", stroke: "#B9825A", "stroke-width": 2.5 })); }
  s.append(svgEl("rect", { x: 26, y: 56, width: 70, height: 54, rx: 18, fill: "#FFD9B8", stroke: "#B9825A", "stroke-width": 3 }));
  const th = up >= 1;
  s.append(svgEl("rect", { x: 6, y: th ? 48 : 66, width: 14, height: th ? 44 : 26, rx: 7, fill: th ? "#FFD9B8" : "#E3CDBB", stroke: "#B9825A", "stroke-width": 2.5, transform: "rotate(-32 20 90)" }));
  s.append(txt(61, 88, String(up), 26, { fill: "#8A5A36" }));
  return s;
}
/* 손가락 접어! 나와 컴퓨터 친구 3명, 모두의 카드 24장을 섞어 한 판에 한 장씩 */
function rd4Game(body, api, opt) {
  rd4Style();
  const P = ["나", "하은", "유주", "준서"], PN = ["내", "하은이의", "유주의", "준서의"], PT = ["나는", "하은이는", "유주는", "준서는"];
  const others = [["[3/4]", "0.2", "[5/6]", "0.55", "[2/5]", "0.9"], ["[1/3]", "0.8", "[5/9]", "0.35", "[3/7]", "0.68"], ["[4/5]", "0.1", "[2/9]", "0.64", "[5/8]", "0.4"]];
  let deck, fingers, round, total, hands, cond, pick, phase, done = false;
  const top = h("div", { class: "rd4tip" }), say = h("div"), grid = h("div", { class: "rd4players" }), ctl = h("div", { class: "rd4tools" }), log = h("div");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const should = i => i !== cond.by && rd4Cmp(hands[i], cond.v) === (cond.sign === ">" ? 1 : -1);
  const word = s => s === ">" ? "큰" : "작은";
  const condText = () => `${cond.v}보다 ${word(cond.sign)} 수를 가지고 있는 사람 모두 손가락 하나 접어!`;
  function start() {
    const my = (RD4_MY || ["[2/3]", "[3/8]", "0.6", "0.45"]).concat(["[1/2]", "0.75"]);
    deck = shuffle([...my, ...others.flat()]); total = Math.floor(deck.length / 4);
    fingers = [5, 5, 5, 5]; round = 0; done = false; log.innerHTML = ""; deal();
  }
  function deal() {
    if (round >= total) return finish();
    hands = P.map(() => deck.pop()); pick = new Set(); cond = null; phase = "talk";
    const by = round % 4;
    if (by !== 0) {
      const cnt = s => [0, 1, 2, 3].filter(i => i !== by && rd4Cmp(hands[i], hands[by]) === (s === ">" ? 1 : -1)).length;
      cond = { by, v: hands[by], sign: cnt("<") > cnt(">") ? "<" : ">" }; phase = "pick";
    }
    render();
  }
  function finish() {
    done = true; phase = "end";
    const mx = Math.max(...fingers), win = P.filter((p, i) => fingers[i] === mx);
    render();
    say.innerHTML = ""; say.append(h("div", { class: "rd4say" }, `놀이 끝! 펼친 손가락이 가장 많은 사람: ${win.join(", ")} (${mx}개). ${win.includes("나") ? "축하해요!" : "다음 판에는 조건을 더 잘 만들어 봐요."}`));
    api.hint("놀이를 마쳤어요. 아래 ‘확인하기’를 눌러요.");
  }
  function render() {
    top.textContent = phase === "end" ? "놀이가 끝났어요." : `${round + 1}번째 판 (모두 ${total}판) · ${P[round % 4]} 차례`;
    grid.innerHTML = "";
    P.forEach((p, i) => {
      const el = h("button", { class: "rd4pl" + (i === 0 ? " rd4me" : "") + (pick && pick.has(i) ? " rd4pk" : "") + (cond && cond.by === i ? " rd4spk" : ""), onclick: () => {
        if (phase !== "pick") return;
        if (cond.by === i) return api.hint("조건을 말한 사람은 손가락을 접지 않아요.");
        pick.has(i) ? pick.delete(i) : pick.add(i); render();
      } }, h("span", { class: "rd4pn" }, p + (cond && cond.by === i ? " (조건을 말함)" : "")), rd4Hand(fingers[i]), h("span", { class: "rd4pc" }, phase === "end" ? "" : hands[i]));
      grid.append(el);
    });
    say.innerHTML = ""; ctl.innerHTML = "";
    if (phase === "talk") {
      say.append(h("div", { class: "rd4say" }, `내 카드는 ${rd4J(hands[0], "이에요")}. 어떤 조건을 말할까요? 다른 사람이 많이 접을수록 좋아요.`));
      [">", "<"].forEach(sg => ctl.append(h("button", { onclick: () => { cond = { by: 0, v: hands[0], sign: sg }; phase = "pick"; render(); } }, `${hands[0]}보다 ${word(sg)} 수를 가진 사람 접어!`)));
    } else if (phase === "pick") {
      say.append(h("div", { class: "rd4say" }, `${P[cond.by]}: “${condText()}”`));
      say.append(h("p", { class: "rd4tip" }, "손가락을 접어야 하는 사람을 모두 눌러 고르고 ‘판정하기’를 눌러요(아무도 없으면 바로 눌러요)."));
      ctl.append(h("button", { onclick: judge }, "판정하기"));
    } else if (phase === "next") {
      ctl.append(h("button", { onclick: () => { round++; deal(); } }, round + 1 >= total ? "결과 보기" : "이어서 한 판"));
    } else if (phase === "end") {
      ctl.append(h("button", { onclick: start }, "새로 놀이하기"));
    }
  }
  function judge() {
    const want = [0, 1, 2, 3].filter(should);
    const miss = want.find(i => !pick.has(i)), extra = [...pick].find(i => !want.includes(i));
    if (miss != null || extra != null) {
      const i = miss != null ? miss : extra;
      return api.hint(`${PN[i]} 카드 ${hands[i]}: ${rd4Explain(hands[i], cond.v)} 그래서 ${PT[i]} 손가락을 ${miss != null ? "접어야 해요" : "접지 않아요"}.`);
    }
    want.forEach(i => { fingers[i] = Math.max(0, fingers[i] - 1); });
    log.prepend(h("p", { class: "rd4log" }, `${round + 1}번째 판: ${P[cond.by]} “${condText()}” → ${want.length ? want.map(i => P[i]).join(", ") + " 접음" : "아무도 접지 않음"}`));
    api.hint(want.length ? `맞아요! ${want.map(i => P[i]).join(", ")} 손가락 하나 접어요.` : "맞아요! 이번에는 아무도 접지 않아요.");
    phase = "next"; render();
  }
  start();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, "모두의 카드 24장을 섞어 한 판에 한 장씩 가져와요. 크기가 같은 수는 ‘큰 수’도 ‘작은 수’도 아니에요."), top, grid, say, ctl, log, ask);
  rd4Ask(ask, api, () => done, "놀이를 끝까지 해요.", Object.assign({ doneText: "손가락 접어! 놀이 끝" }, opt));
}
/* 통분 놀이: 카드 2장(분모 2~9 진분수)을 두 분모의 최소공배수로 통분, need점 모으기 */
function rd4Tong(body, api, opt) {
  rd4Style();
  const need = opt.need || 4;
  let score = 0, A, B, L, last = "";
  const cardsEl = h("div", { class: "rd4cards" }), eq = h("div"), sc = h("div", { class: "rd4tip" }), log = h("div");
  const fa = rd4In("첫째 카드 통분"), fb = rd4In("둘째 카드 통분");
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function gen() {
    let d1, d2, key;
    do { d1 = rnd(2, 9); d2 = rnd(2, 9); A = [rnd(1, d1 - 1), d1]; B = [rnd(1, d2 - 1), d2]; key = A.join("/") + B.join("/"); } while (d1 === d2 || key === last);
    last = key; L = rd4Lcm(d1, d2);
    cardsEl.innerHTML = ""; [A, B].forEach(f => cardsEl.append(h("span", { class: "rd4card" }, rd4F(f[0], f[1]))));
    fa.clear(); fb.clear();
    sc.textContent = `점수 ${score}점 / ${need}점`;
  }
  eq.append(h("div", { class: "rd4eq" }, h("span", {}, "("), fa, h("span", {}, ","), fb, h("span", {}, ")")));
  const btn = h("button", { onclick: () => {
    if (score >= need) return api.hint("이미 놀이를 마쳤어요. 아래 ‘확인하기’를 눌러요.");
    const ra = fa.get(), rb = fb.get();
    const ja = rd4JudgeF(ra, { a: rd4F(A[0], A[1]), den: L, from: rd4F(A[0], A[1]) }), jb = rd4JudgeF(rb, { a: rd4F(B[0], B[1]), den: L, from: rd4F(B[0], B[1]) });
    fa.paint(ja.ok); fb.paint(jb.ok);
    if (!ja.ok || !jb.ok) {
      const r = !ja.ok ? ra : rb, F = !ja.ok ? A : B;
      const sameDen = !r.err && r.hasF && rd4Same(rd4Key(r), rd4F(F[0], F[1]));
      return api.hint(sameDen ? `값은 같아요. 그런데 공통분모는 ${rd4J(String(A[1]), "과와")} ${B[1]}의 최소공배수예요.` : (!ja.ok ? ja.msg : jb.msg) || "두 분모의 최소공배수를 구하고, 분모에 곱한 수만큼 분자에도 곱해요.");
    }
    score++;
    log.prepend(h("p", { class: "rd4log" }, `(${rd4F(A[0], A[1])}, ${rd4F(B[0], B[1])}) → (${rd4F(A[0] * L / A[1], L)}, ${rd4F(B[0] * L / B[1], L)}) 1점!`));
    if (score >= need) { sc.textContent = `점수 ${score}점 / ${need}점 — 놀이 끝!`; return api.hint("최소공배수로 척척 통분했어요! 아래 ‘확인하기’를 눌러요."); }
    api.hint("맞아요! 1점. 다음 카드 2장이에요."); gen();
  } }, "통분했어요");
  gen();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, "뒤집은 카드 2장의 두 분모의 최소공배수를 공통분모로 하여 통분해요. 옳게 통분하면 1점이에요."), sc, cardsEl, eq, h("div", { class: "rd4tools" }, btn), log, ask);
  rd4Ask(ask, api, () => score >= need, () => `${need}점을 모을 때까지 통분해요. 지금 ${score}점이에요.`, Object.assign({ doneText: `통분 놀이 ${need}점` }, opt));
}

/* ===== 그림 ===== */
function rd4FestFig() {
  const s = makeSvg(900, 320);
  s.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 320, fill: "#FFF8EC" }));
  s.append(svgEl("rect", { x: 0, y: 268, width: 900, height: 52, fill: "#E8DCC4" }));
  s.append(svgEl("rect", { x: 260, y: 12, width: 380, height: 50, rx: 14, fill: "#E47A38" }));
  s.append(txt(450, 38, "세계 음식 축제", 30, { fill: "#fff" }));
  s.append(svgEl("path", { d: "M10,82 Q450,118 890,82", fill: "none", stroke: "#8A7A66", "stroke-width": 2 }));
  for (let k = 0; k < 22; k++) { const x = 24 + k * 40, y = 82 + 36 * (1 - ((x - 450) / 440) ** 2) * .5 + 0; s.append(svgEl("path", { d: `M${x - 10},${y} L${x + 10},${y} L${x},${y + 18} Z`, fill: RD4_S[k % 5] })); }
  const B = [["스위스", "퐁뒤"], ["미국", "브라우니"], ["아르헨티나", "바비큐"], ["멕시코", "타코"], ["이탈리아", "젤라토"], ["필리핀", "망고주스"]];
  B.forEach(([c, f], i) => {
    const x = 14 + i * 147, w = 135;
    for (let k = 0; k < 5; k++) s.append(svgEl("rect", { x: x + k * w / 5, y: 128, width: w / 5, height: 34, fill: k % 2 ? "#fff" : RD4_F[i % 5], stroke: "#8A7A66", "stroke-width": 1 }));
    s.append(svgEl("rect", { x: x + 6, y: 162, width: 5, height: 106, fill: "#8A7A66" }), svgEl("rect", { x: x + w - 11, y: 162, width: 5, height: 106, fill: "#8A7A66" }));
    s.append(svgEl("rect", { x, y: 214, width: w, height: 54, rx: 4, fill: "#F7E3C3", stroke: "#8A7A66", "stroke-width": 2 }));
    s.append(txt(x + w / 2, 186, c, 19, { fill: "#4A3B2A" }));
    s.append(txt(x + w / 2, 241, f, 19, { fill: RD4_S[i % 5] }));
  });
  return h("div", { class: "rd4stage" }, s);
}
/* 크기가 같은 두 유리컵에 물을 a, b만큼 (눈금은 분모만큼 똑같이 나눔) */
function rd4CupsFig(a, b) {
  const s = makeSvg(900, 360);
  [a, b].forEach((f, i) => {
    const [n, d] = rd4ND(f), x = 210 + i * 300, y0 = 40, w = 170, hh = 240, top = y0 + hh * (1 - n / d);
    s.append(svgEl("rect", { x, y: top, width: w, height: y0 + hh - top, fill: "#BFE0F7" }));
    for (let k = 1; k < d; k++) s.append(svgEl("line", { x1: x, y1: y0 + hh * k / d, x2: x + 26, y2: y0 + hh * k / d, stroke: "#5B6B6B", "stroke-width": 2 }));
    s.append(svgEl("path", { d: `M${x},${y0 - 10} L${x},${y0 + hh} L${x + w},${y0 + hh} L${x + w},${y0 - 10}`, fill: "none", stroke: INK, "stroke-width": 4 }));
    s.append(rd4SvgLine(`${rd4Tk(f)}만큼`, x + w / 2, y0 + hh + 46, 26));
  });
  return h("div", { class: "rd4stage" }, s);
}
//@@LESSONS
const UNIT_STORY = { title: "세계 음식 축제에 간 준서", lines: [
  "준서는 하은이, 유주와 함께 세계 음식 축제에 갔어요. 스위스 퐁뒤, 미국 브라우니, 아르헨티나 바비큐, 멕시코 타코, 이탈리아 젤라토, 필리핀 망고주스 체험장을 차례로 돌아보아요.",
  "음식을 나누어 담고 비교하면서 크기가 같은 분수를 만들고, 분수를 약분하고 통분하여 분수와 소수의 크기를 비교해요.",
  "교과서 「수학 5-1」 4. 약분과 통분의 차시 순서 그대로 만들었어요."],
  one: "세계 음식 축제에 간 준서 · 크기가 같은 분수를 만들고, 약분과 통분으로 분수의 크기를 비교해요." };
const UNIT_KEYWORDS = ["크기가 같은 분수", "분모와 분자에 같은 수를 곱하기", "분모와 분자를 같은 수로 나누기", "0이 아닌 같은 수", "공약수", "최대공약수", "약분", "기약분수", "통분", "공통분모", "두 분모의 곱", "공배수", "최소공배수", "분수를 소수로", "소수를 분수로", "1/2을 기준으로"];

/* ===== 4. 약분과 통분 — 교과서 차시 버전 (10차시) ===== */
const RD4_CMP = [">", "=", "<"];
/* 1/2 기준 분류 카드: 분자를 2배 한 수와 분모를 비교 */
const rd4HalfCard = (lab, f) => { const [n, d] = rd4ND(f); if (2 * n === d) throw new Error("1/2과 같은 분수"); return { t: `${lab} ${rd4Tk(f)} km`, b: 2 * n > d ? 1 : 0, why: `${lab}: 분자 ${n}을(를) 2배 한 ${2 * n}${2 * n > d ? "은(는) 분모 " + d + "보다 커요. 그래서 [1/2] km보다 멀어요." : "은(는) 분모 " + d + "보다 작아요. 그래서 [1/2] km보다 가까워요."}`.replace(/(\d+)을\(를\)/, (m, x) => rd4J(x, "을를")).replace(/(\d+)은\(는\)/, (m, x) => rd4J(x, "은는")) }; };

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 세계 음식 축제에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 약분과 통분은 언제 쓰일까요?",
  summary: "분모가 달라도 크기가 같은 분수가 있어요. 이 단원에서는 크기가 같은 분수를 만들고, 분수를 간단하게 나타내는 약분과 분모를 같게 하는 통분을 배워 분수와 소수의 크기를 비교해요.",
  steps: [
    { name: "그림 살펴보기", inst: "준서는 친구들과 함께 세계 음식 축제에 갔어요. 여러 나라의 전통 음식을 맛보고 직접 만들어 보는 체험을 할 수 있대요. 그림을 살펴보세요.", hints: ["그림 위쪽 현수막을 읽어 봐요.", "체험장마다 나라 이름과 음식 이름이 쓰여 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "준서와 친구들은 어디에 갔나요?", o: ["세계 음식 축제", "과학 박물관", "운동회"], a: 0, fig: rd4FestFig },
        { q: "그림 속 체험장이 아닌 것은?", o: ["멕시코 타코 만들기", "필리핀 망고주스", "이탈리아 젤라토", "일본 초밥 만들기"], a: 3 },
        { q: "유리컵에 물을 많이 넣을수록 높은 소리가 나요. 크기가 같은 두 컵에 물을 각각 [1/2]만큼, [5/6]만큼 넣으면 어느 컵에서 더 높은 소리가 날까요?", o: ["[1/2]만큼 넣은 컵", "[5/6]만큼 넣은 컵", "두 컵의 소리가 같아요"], a: 1, fig: () => rd4CupsFig("1/2", "5/6"), why: { "0": "그림에서 물의 높이를 견주어 봐요. 물이 더 많은 컵에서 더 높은 소리가 나요." } }],
        { ok: "분모가 다른 [1/2]과 [5/6]의 크기를 비교했어요. 이 단원에서는 그림 없이도 분모가 다른 분수의 크기를 비교하는 방법을 배워요." }) },
    { name: "만져 보기", inst: "크기가 같은 피자 두 판이 있어요. 한 판은 똑같이 4조각으로 나누어 2조각을, 다른 한 판은 똑같이 2조각으로 나누어 1조각을 먹었어요. 먹은 만큼 색칠해 보세요.", hints: ["첫째 피자는 4조각 중 2조각을 색칠해요.", "둘째 피자는 2조각 중 1조각을 색칠해요."],
      render: (b, a) => rd4Bars(b, a, { shape: "pie", bars: [{ name: "4조각 중 2조각", d: 4, k: 2 }, { name: "2조각 중 1조각", d: 2, k: 1 }],
        askCalc: [{ q: "먹은 피자의 양을 비교해 보세요.", pick: ["4조각 중 2조각이 더 많아요.", "2조각 중 1조각이 더 많아요.", "먹은 양이 같아요."], a: 2, why: { "0": "조각 수가 많다고 양이 많은 것은 아니에요. 색칠한 부분의 크기를 견주어 봐요." } },
          { q: "먹은 양을 분수로 나타내면?", pick: ["[2/4]와 [1/2]", "[2/4]와 [1/4]", "[4/2]와 [2/1]"], a: 0 }],
        ok: "[2/4]와 [1/2]은 분모와 분자는 달라도 크기가 같아요." }) },
    { name: "말해 보기", inst: "준서처럼 세계 여러 나라의 문화를 경험해 본 일과, 생활에서 분모가 다른 분수의 크기를 비교해 본 경험을 떠올려 써 보세요.", hints: ["몽골에서 온 친구와 친하게 지낸 일, 세계 여러 나라 문화 축제에 가 본 일을 떠올려요.", "남은 우유의 양, 먹은 케이크의 양을 비교해 본 일을 떠올려요."],
      render: (b, a) => writeStep(b, a, [
        { q: "세계 여러 나라의 문화를 경험해 본 일을 써 보세요.", tag: "경험", ph: "예: 세계 여러 나라 문화 축제에 가서 다른 나라 음식을 먹어 보았어요." },
        { q: "생활에서 분모가 다른 분수의 크기를 비교해 본 경험을 써 보세요.", tag: "분수 비교", ph: "예: 우유가 [1/2]만큼, [2/3]만큼 남은 두 병 중 어느 병에 더 많이 남았는지 비교해 봤어요." },
        { q: "이 단원에서 무엇이 궁금한가요?", tag: "궁금", ph: "예: 그림을 그리지 않고 분모가 다른 분수의 크기를 비교하는 방법이 궁금해요." }]) },
    { name: "배운 내용 떠올리기", inst: "이 단원에서 쓸 내용을 떠올려 풀어 보세요. (3학년 분수와 소수, 5학년 2단원 약수와 배수)", hints: ["소수 한 자리 수는 분모가 10인 분수로 나타낼 수 있어요. 0.7은 [1/10]이 7개예요.", "최대공약수는 공약수 중에서 가장 큰 수, 최소공배수는 공배수 중에서 가장 작은 수예요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "0.7을 분수로 나타내 보세요.", a: "7/10", den: 10 },
        { q: "[3/10]을 소수로 나타내 보세요.", n: 0.3 },
        { q: "분모가 같은 분수의 크기를 비교해 보세요.", cmp: ["[5/8]", "[3/8]"] },
        { q: "소수의 크기를 비교해 보세요.", cmp: ["0.6", "0.58"], why: { "<": "0.58의 자리 수가 많다고 더 큰 수가 아니에요. 소수 첫째 자리 6과 5를 먼저 비교해요." } },
        { q: "12와 18의 최대공약수를 구해 보세요.", n: 6, chk: () => rd4G(12, 18), why: { "2": "2도 공약수이지만 가장 큰 공약수를 찾아요.", "3": "3도 공약수이지만 가장 큰 공약수를 찾아요." } },
        { q: "4와 6의 최소공배수를 구해 보세요.", n: 12, chk: () => rd4Lcm(4, 6), why: { "24": "24도 공배수이지만 가장 작은 공배수를 찾아요." } }],
        { ok: "배운 내용을 잘 기억하고 있어요. 이 단원에서는 공약수로 약분하고, 공배수로 통분해요." }) },
    { name: "확인하기", inst: "이 단원에서 배울 내용을 확인해요.", hints: ["책장을 넘겨 단원에서 배울 내용을 살펴봐요.", "분수의 곱셈은 5학년 2학기에 배워요."],
      render: (b, a) => quiz(b, a, [
        { q: "이 단원에서 배울 내용을 모두 고르세요.", o: ["크기가 같은 분수 알아보기·만들기", "약분과 기약분수", "통분과 공통분모", "분수와 소수의 크기 비교", "분수의 곱셈"], a: [0, 1, 2, 3] },
        { q: "약분과 통분이 쓰이는 때로 알맞은 것은?", o: ["분모가 다른 두 분수의 크기를 비교할 때", "자연수의 덧셈을 할 때", "시각을 읽을 때"], a: 0 }],
        { ok: "약분과 통분을 공부할 준비가 되었어요. 다음 시간에는 크기가 같은 분수를 알아봐요." }) }
  ],
  challenge: { inst: "배운 내용을 한 번 더 떠올려 보세요.", hints: ["소수 두 자리 수는 분모가 100인 분수로 나타내요.", "16과 24의 공약수는 1, 2, 4, 8이에요."], render: (b, a) => rd4Calc(b, a, [
    { q: "0.25를 분수로 나타내 보세요.", a: "25/100", den: 100 },
    { q: "분모가 같은 분수의 크기를 비교해 보세요.", cmp: ["[7/9]", "[4/9]"] },
    { q: "소수의 크기를 비교해 보세요.", cmp: ["1.3", "1.25"], why: { "<": "자연수 부분이 같으면 소수 첫째 자리 3과 2를 비교해요." } },
    { q: "16과 24의 최대공약수를 구해 보세요.", n: 8, chk: () => rd4G(16, 24) },
    { q: "6과 8의 최소공배수를 구해 보세요.", n: 24, chk: () => rd4Lcm(6, 8), why: { "48": "48도 공배수이지만 가장 작은 공배수를 찾아요." } }],
    { ok: "준비 완료! 약분과 통분을 배울 수 있어요." }) }
},
{
  id: "t2", no: 2, title: "크기가 같은 분수를 알아볼까요", soop: "개념 구축하기(O)",
  question: "준서와 하은이가 담은 치즈의 양을 어떻게 비교할 수 있을까요?",
  summary: "분모와 분자는 달라도 크기가 같은 분수가 있어요. [1/2]과 [2/4], [1/3], [2/6], [3/9], [4/12], …는 크기가 같은 분수예요. 분수만큼 그림에 색칠하여 비교하면 알 수 있어요.",
  steps: [
    { inst: "스위스 체험장에서 퐁뒤를 먹으려고 치즈를 녹였어요. 크기가 같은 그릇에 준서는 [1/2]만큼, 하은이는 [2/4]만큼 담았어요. 그릇 그림에 담은 치즈의 양만큼 색칠해 보세요.", hints: ["준서의 그릇은 똑같이 2로 나눈 것 중 1을 색칠해요.", "하은이의 그릇은 똑같이 4로 나눈 것 중 2를 색칠해요."],
      render: (b, a) => rd4Bars(b, a, { shape: "pie", bars: [{ name: "준서 [1/2]", d: 2, k: 1 }, { name: "하은 [2/4]", d: 4, k: 2 }],
        askCalc: [{ q: "준서와 하은이가 담은 치즈의 양을 비교해 보세요.", pick: ["준서가 더 많이 담았어요.", "하은이가 더 많이 담았어요.", "두 사람이 담은 치즈의 양은 같아요."], a: 2, why: { "1": "하은이는 4칸 중 2칸이에요. 색칠한 부분의 크기를 견주어 봐요.", "0": "색칠한 부분의 크기를 견주어 봐요." } }],
        ok: "색칠한 부분의 크기가 같으므로 [1/2]과 [2/4]는 크기가 같아요. 두 사람이 담은 치즈의 양은 같아요." }) },
    { inst: "길이가 같은 막대 3개에 [1/3], [2/6], [3/9]만큼 색칠하고 크기를 비교해 보세요.", hints: ["[2/6]는 6칸 중 2칸, [3/9]는 9칸 중 3칸을 색칠해요.", "색칠한 부분의 끝이 한 줄로 맞는지 살펴봐요."],
      render: (b, a) => rd4Bars(b, a, { bars: [{ name: "[1/3]", d: 3, k: 1 }, { name: "[2/6]", d: 6, k: 2 }, { name: "[3/9]", d: 9, k: 3 }],
        askCalc: [{ q: "세 분수의 크기를 비교해 보세요.", pick: ["[1/3]이 가장 커요.", "[3/9]가 가장 커요.", "세 분수의 크기가 모두 같아요."], a: 2, why: { "1": "분자가 크다고 큰 분수는 아니에요. 색칠한 부분의 끝을 견주어 봐요." } },
          { q: "[1/3], [2/6], [3/9] 다음에 올 크기가 같은 분수는?", pick: ["[4/12]", "[4/10]", "[3/12]"], a: 0, why: { "1": "분모가 3씩, 분자가 1씩 커지고 있어요." } }],
        ok: "[1/3], [2/6], [3/9], [4/12], …는 크기가 같은 분수예요." }) },
    { inst: "[3/4], [6/8], [9/12]만큼 막대에 색칠하고, 크기를 비교하여 이야기해 보세요.", hints: ["[6/8]은 8칸 중 6칸, [9/12]는 12칸 중 9칸이에요.", "색칠한 부분의 끝이 한 줄로 맞으면 크기가 같아요."],
      render: (b, a) => rd4Bars(b, a, { bars: [{ name: "[3/4]", d: 4, k: 3 }, { name: "[6/8]", d: 8, k: 6 }, { name: "[9/12]", d: 12, k: 9 }],
        askCalc: [{ q: "세 분수의 크기를 비교해 보세요.", pick: ["세 분수의 크기가 모두 같아요.", "[9/12]가 가장 커요.", "[3/4]이 가장 작아요."], a: 0 },
          { q: "어떻게 알 수 있나요?", pick: ["색칠한 부분의 끝이 한 줄로 맞아요.", "분모가 클수록 큰 분수예요.", "분자가 클수록 큰 분수예요."], a: 0, why: { "1": "분모가 크다고 큰 분수는 아니에요. 그림에서 세 분수의 크기가 같아요.", "2": "분자가 크다고 큰 분수는 아니에요. 그림에서 세 분수의 크기가 같아요." } }],
        ok: "[3/4], [6/8], [9/12]는 색칠한 부분의 크기가 같으므로 크기가 같은 분수예요." }) },
    { name: "약속하기", inst: "알게 된 것을 정리해 보세요.", hints: ["[1/3]과 [2/6]은 분모와 분자가 다르지만 그림에서 크기가 같았어요.", "[3/4]과 [6/8]도 크기가 같았어요."],
      render: (b, a) => blanks(b, a, ["[1/3], [2/6], [3/9], [4/12], …처럼 분모와 분자는 달라도 ", { o: ["크기가 같은", "크기가 다른"], a: 0 }, " 분수가 있어요. [1/2]과 ", { o: ["[2/4]", "[2/3]", "[1/4]"], a: 0 }, ", [3/4]과 ", { o: ["[6/8]", "[3/8]", "[4/8]"], a: 0 }, "도 크기가 같은 분수예요."]) },
    { name: "확인하기", inst: "수학익힘 문제예요. [1/5], [2/10], [3/15]만큼 색칠하고 크기를 비교해 보세요.", hints: ["[2/10]는 10칸 중 2칸, [3/15]는 15칸 중 3칸이에요.", "[2/6]과 [4/12]를 막대에 색칠했다고 생각해 봐요. [1/3]과 견주어 봐요."],
      render: (b, a) => rd4Bars(b, a, { bars: [{ name: "[1/5]", d: 5, k: 1 }, { name: "[2/10]", d: 10, k: 2 }, { name: "[3/15]", d: 15, k: 3 }],
        askCalc: [{ q: "[1/5], [2/10], [3/15]는 어떤 분수인가요?", pick: ["크기가 같은 분수", "크기가 다른 분수"], a: 0 },
          { q: "[2/6], [4/12], [5/18] 중 크기가 같은 분수를 모두 고르세요.", pick: ["[2/6]", "[4/12]", "[5/18]"], a: [0, 1], why: { "2": "[5/18]는 18칸 중 5칸이에요. [2/6]과 크기가 같으려면 18칸 중 6칸이어야 해요." } },
          { q: "[9/12]와 크기가 같은 분수를 모두 고르세요.", pick: ["[6/8]", "[5/8]", "[3/4]", "[2/4]"], a: [0, 2], why: { "1": "[5/8]는 8칸 중 5칸이에요. 앞에서 색칠한 [6/8]과 견주어 봐요.", "3": "[2/4]는 [1/2]과 크기가 같아요." } }],
        ok: "그림에 나타내면 크기가 같은 분수를 찾을 수 있어요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 분수 막대에서 빨간 세로 자를 끌어 [3/9]과 [10/15]의 끝에 놓아 보고, 크기가 같은 분수를 찾아보세요.", hints: ["[3/9]의 끝에 자를 놓으면 끝이 맞는 다른 막대가 있어요.", "[10/15]의 끝은 [6/9]의 끝과 같아요."],
    render: (b, a) => rd4Wall(b, a, { rows: [1, 6, 9, 15], need: ["3/9", "10/15"],
      askCalc: [{ q: "[3/9]과 크기가 같은 분수를 모두 고르세요.", pick: ["[2/6]", "[3/6]", "[5/15]", "[4/15]"], a: [0, 2], why: { "1": "[3/6]은 [1/2]과 크기가 같아요. 자를 [3/9]의 끝에 놓고 살펴봐요.", "3": "[4/15]의 끝은 [3/9]의 끝보다 조금 더 가요." } },
        { q: "[10/15]과 크기가 같은 분수를 모두 고르세요.", pick: ["[4/6]", "[5/6]", "[6/9]", "[7/9]"], a: [0, 2] }],
      ok: "[3/9] = [2/6] = [5/15], [10/15] = [4/6] = [6/9]이에요." }) }
},
{
  id: "t3", no: 3, title: "크기가 같은 분수를 만들어 볼까요", soop: "개념 구축하기(O)",
  question: "하은이와 유주가 준서와 같은 양만큼 브라우니를 먹으려면 각각 얼마만큼 먹어야 할까요?",
  summary: "분모와 분자에 각각 0이 아닌 같은 수를 곱하면 크기가 같은 분수가 돼요. [1/2] = [2/4] = [3/6] = [4/8] = … 분모와 분자를 각각 0이 아닌 같은 수로 나누어도 크기가 같은 분수가 돼요. [12/18] = [6/9] = [4/6] = [2/3]",
  steps: [
    { inst: "미국 체험장에서 준서는 브라우니를 [1/2]만큼 먹었어요. 하은이는 크기가 같은 브라우니를 똑같이 4조각으로, 유주는 똑같이 8조각으로 나누었어요. 반을 빨간색으로 칠한 색종이를 반으로 계속 접었다 펴며, 빨간색 부분을 분수로 나타내 보세요.", hints: ["반으로 한 번 더 접으면 칸 수가 2배가 돼요.", "빨간색 부분은 4칸 중 2칸, 8칸 중 4칸이에요."],
      render: (b, a) => rd4Split(b, a, { fold: true, bars: [{ name: "색종이", v: "1/2" }], start: 2, max: 8, need: [4, 8],
        ask: [["하은이가 먹어야 하는 양: ", { f: "2/4", den: 4 }, "  유주가 먹어야 하는 양: ", { f: "4/8", den: 8 }], rd4MulRow("1/2", 2), rd4MulRow("1/2", 4)],
        ok: "분모와 분자에 각각 2, 4를 곱했더니 [1/2]과 크기가 같은 [2/4], [4/8]이 되었어요." }) },
    { inst: "[12/18]만큼 색칠한 막대가 있어요. 막대를 9칸, 6칸으로 똑같이 나누어 [12/18]와 크기가 같은 분수를 만들어 보세요.", hints: ["9칸으로 나누면 색칠한 부분은 9칸 중 몇 칸일까요?", "18 ÷ 2 = 9, 12 ÷ 2 = 6이에요."],
      render: (b, a) => rd4Split(b, a, { bars: [{ name: "[12/18]", v: "12/18" }], parts: [18, 9, 6, 5, 4, 3], start: 18, need: [9, 6],
        ask: [rd4MulRow("12/18", 2, "÷"), rd4MulRow("12/18", 3, "÷"), rd4MulRow("12/18", 6, "÷")],
        ok: "분모와 분자를 각각 2, 3, 6으로 나누었더니 [12/18]와 크기가 같은 [6/9], [4/6], [2/3]이 되었어요." }) },
    { inst: "크기가 같은 분수를 만든 방법을 말해 보세요.", hints: ["[1/2] = [2/4]에서 분모 2에 2를 곱해 4, 분자 1에도 2를 곱해 2가 되었어요.", "[0/0]은 분수가 아니에요. 0을 곱하면 모든 분수가 [0/0]이 되어 버려요."],
      render: (b, a) => quiz(b, a, [
        { q: "[1/2] = [2/4] = [3/6] = [4/8] = …에서 분모와 분자를 어떻게 했나요?", o: ["분모와 분자에 각각 같은 수 2, 3, 4를 곱했어요.", "분모에만 2, 3, 4를 곱했어요.", "분모와 분자에 서로 다른 수를 곱했어요."], a: 0 },
        { q: "[12/18] = [6/9] = [4/6] = [2/3]에서 분모와 분자를 어떻게 했나요?", o: ["분모와 분자를 각각 같은 수 2, 3, 6으로 나누었어요.", "분모만 2, 3, 6으로 나누었어요.", "분모와 분자를 서로 다른 수로 나누었어요."], a: 0 },
        { q: "분모와 분자에 0을 곱하면 어떻게 될까요?", o: ["[1/5], [1/6], [1/7]이 모두 [0/0]이 되어, 크기가 다른 분수끼리 같다고 해야 하는 이상한 일이 생겨요.", "언제나 크기가 같은 분수가 돼요."], a: 0, why: { "1": "[1/5]과 [1/7]은 크기가 달라요. 그런데 0을 곱하면 둘 다 [0/0]이 되어 버려요." } }],
        { ok: "분모와 분자에 0이 아닌 같은 수를 곱하거나, 0이 아닌 같은 수로 나누어야 크기가 같은 분수가 돼요." }) },
    { name: "약속하기", inst: "크기가 같은 분수를 만드는 방법을 정리해 보세요.", hints: ["[1/2] = [2/4]는 분모와 분자에 각각 2를 곱했어요.", "[12/18] = [6/9]는 분모와 분자를 각각 2로 나누었어요."],
      render: (b, a) => blanks(b, a, ["분모와 분자에 각각 ", { o: ["0이 아닌 같은 수", "서로 다른 수"], a: 0 }, "를 곱하면 크기가 같은 분수가 돼요. 분모와 분자를 각각 0이 아닌 같은 수로 ", { o: ["나누면", "더하면", "빼면"], a: 0 }, " 크기가 같은 분수가 돼요."]) },
    { name: "확인하기", inst: "[6/8]과 크기가 같은 분수를 3개 만들어 보고, 만든 방법을 이야기해 보세요.", hints: ["분모와 분자에 각각 2를 곱하면 [12/16]이에요.", "분모와 분자를 각각 2로 나누면 [3/4]이에요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "[6/8]과 크기가 같은 분수를 3개 만들어 보세요.", eq: "6/8", count: 3 },
        { q: "어떤 방법으로 만들었나요?", pick: ["분모와 분자에 각각 0이 아닌 같은 수를 곱하거나, 분모와 분자를 각각 0이 아닌 같은 수로 나누었어요.", "분모와 분자에 같은 수를 더했어요.", "분모에만 같은 수를 곱했어요."], a: 0, why: { "1": "[6/8]의 분모와 분자에 1을 더한 [7/9]는 [6/8]과 크기가 달라요." } }],
        { ok: "[6/8] = [12/16] = [18/24] = [24/32], [6/8] = [3/4]처럼 여러 가지 분수를 만들 수 있어요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 크기가 같은 분수가 되도록 빈칸에 알맞은 수를 써넣으세요.", hints: ["[3/7] = [6/□]: 분자에 2를 곱했으니 분모에도 2를 곱해요.", "[45/72] = [□/24]: 72 ÷ 3 = 24이니 분자도 3으로 나누어요."],
    render: (b, a) => rd4Chain(b, a, [
      ["[3/7] = ", { q: [null, "6", "?14"] }, " = ", { q: [null, "?9", "21"] }],
      ["[45/72] = ", { q: [null, "?15", "24"] }, " = ", { q: [null, "5", "?8"] }],
      ["[4/5] = ", { q: [null, "?8", "10"] }, " = ", { q: [null, "?12", "15"] }, " = ", { q: [null, "16", "?20"] }],
      ["[24/64] = ", { q: [null, "12", "?32"] }, " = ", { q: [null, "?6", "16"] }, " = ", { q: [null, "3", "?8"] }],
      ["[4/15] = ", { q: [null, "?24", "90"] }],
      ["[2/9] = [4/18] = ", { q: [null, "?6", "27"] }, " = ", { q: [null, "?8", "36"] }]],
      { ok: "분모와 분자에 같은 수를 곱하거나 같은 수로 나누어 크기가 같은 분수를 척척 만들었어요!" }) }
},
{
  id: "t4", no: 4, title: "분수를 간단하게 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "준서가 먹은 바비큐의 양 [8/16]을 간단한 분수로 어떻게 나타낼 수 있을까요?",
  summary: "분모와 분자를 1이 아닌 공약수로 나누어 간단한 분수로 나타내는 것을 약분한다고 해요. [1/2]과 같이 분모와 분자의 공약수가 1뿐인 분수를 기약분수라고 해요. 기약분수로 나타내려면 분모와 분자를 두 수의 최대공약수로 나누어요.",
  steps: [
    { inst: "아르헨티나 체험장에서 준서는 숯불에 오랫동안 익힌 바비큐 한 개를 [8/16]만큼 먹었어요. [8/16]만큼 색칠한 막대를 8칸, 4칸, 2칸으로 똑같이 나누어 간단한 분수로 나타내 보세요.", hints: ["8칸으로 나누면 색칠한 부분은 8칸 중 4칸이에요.", "16과 8을 모두 나누어떨어지게 하는 수로 나누어요."],
      render: (b, a) => rd4Split(b, a, { bars: [{ name: "[8/16]", v: "8/16" }], parts: [16, 8, 5, 4, 3, 2], start: 16, need: [8, 4, 2],
        ask: [rd4MulRow("8/16", 2, "÷"), rd4MulRow("8/16", 4, "÷"), rd4MulRow("8/16", 8, "÷"), ["공통으로 나눈 수 2, 4, 8은 분모 16과 분자 8의 ", { c: ["공약수", "공배수", "최소공배수"], a: 0 }, "예요."]],
        ok: "분모와 분자를 16과 8의 공약수 2, 4, 8로 나누었더니 [4/8], [2/4], [1/2]이 되었어요." }) },
    { inst: "[16/40]을 간단한 분수로 나타내 봐요. ÷ 단추로 분모와 분자를 공약수로 나누어, 더 이상 나눌 수 없을 때까지 나누어 보세요.", hints: ["40과 16을 모두 나누어떨어지게 하는 수를 찾아요.", "40과 16의 공약수는 1, 2, 4, 8이에요."],
      render: (b, a) => rd4Reduce(b, a, { v: "16/40", divs: [2, 3, 4, 5, 6, 7, 8],
        askCalc: [{ q: "40과 16의 공약수를 모두 써 보세요.", set: [1, 2, 4, 8], why: { miss: "1도 공약수예요. 40과 16의 약수를 모두 구해 함께 들어 있는 수를 찾아요." } },
          { q: "더 이상 나눌 수 없는 가장 간단한 분수는?", a: "2/5", irr: true, from: "16/40" }],
        ok: "[16/40] = [8/20] = [4/10] = [2/5]이에요. [2/5]의 분모와 분자의 공약수는 1뿐이에요." }) },
    { inst: "분수를 간단하게 나타내는 방법을 말해 보세요.", hints: ["한 번에 [2/5]가 되려면 40과 16의 공약수 중 가장 큰 수로 나누어요.", "분모와 분자의 공약수가 1뿐이면 더 나눌 수 없어요."],
      render: (b, a) => quiz(b, a, [
        { q: "[16/40]을 한 번에 [2/5]로 나타내려면 분모와 분자를 무엇으로 나누어야 하나요?", o: ["40과 16의 최대공약수 8", "40과 16의 최소공배수 80", "2"], a: 0, why: { "2": "2로 나누면 [8/20]이 되어 더 나누어야 해요." } },
        { q: "분모와 분자의 공약수가 1뿐인 분수를 모두 고르세요.", o: ["[1/2]", "[4/8]", "[2/5]", "[4/10]"], a: [0, 2], why: { "1": "[4/8]은 2, 4로 더 나눌 수 있어요.", "3": "[4/10]은 2로 더 나눌 수 있어요." } },
        { q: "[8/16]을 간단하게 나타낼 때 [8/16] = [1/2]처럼 써도 되나요?", o: ["네, 약분은 [8/16] = [1/2]과 같이 나타낼 수도 있어요.", "아니요, 한 번에 2로만 나누어야 해요."], a: 0 }],
        { ok: "분모와 분자를 최대공약수로 나누면 한 번에 가장 간단한 분수가 돼요." }) },
    { name: "약속하기", inst: "약분과 기약분수의 뜻을 정리해 보세요.", hints: ["[8/16]의 분모와 분자를 공약수 2, 4, 8로 나누었어요.", "[1/2]은 분모와 분자의 공약수가 1뿐이에요."],
      render: (b, a) => blanks(b, a, ["분모와 분자를 1이 아닌 ", { o: ["공약수", "공배수", "아무 수"], a: 0 }, "로 나누어 간단한 분수로 나타내는 것을 ", { o: ["약분한다", "통분한다"], a: 0 }, "고 해요. [1/2]과 같이 분모와 분자의 공약수가 1뿐인 분수를 ", { o: ["기약분수", "단위분수", "가분수"], a: 0 }, "라고 해요."]) },
    { name: "확인하기", inst: "분수를 약분해 보세요. 약분한 분수는 기약분수가 아니어도 모두 정답이에요. 마지막 문제는 기약분수로 나타내요.", hints: ["분모와 분자를 공약수로 나누어요. 예: [8/24] = [4/12]", "농구공을 넣은 횟수는 [6/20]이에요. 20과 6의 최대공약수 2로 나누어요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "[8/24]을 약분해 보세요.", a: "1/3", red: true, from: "8/24" },
        { q: "[12/32]를 약분해 보세요.", a: "3/8", red: true, from: "12/32" },
        { q: "[25/45]를 약분해 보세요.", a: "5/9", red: true, from: "25/45" },
        { q: "[48/60]을 약분해 보세요.", a: "4/5", red: true, from: "48/60" },
        { q: "서윤이가 농구공 넣기 연습을 했어요. 농구공을 20번 던져서 6번 넣었다면 넣은 횟수는 전체의 얼마인지 기약분수로 나타내 보세요.", a: "3/10", irr: true, from: "6/20", why: { "6/20": "[6/20]은 2로 약분할 수 있어요." } }],
        { ok: "[8/24] = [1/3], [12/32] = [3/8], [25/45] = [5/9], [48/60] = [4/5]처럼 기약분수로 나타낸 것도, [4/12]처럼 중간까지 약분한 것도 모두 약분한 분수예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 약분과 기약분수를 이용하여 해결해 보세요.", hints: ["30과 24의 최대공약수로 나누면 한 번에 기약분수가 돼요.", "40과 48의 공약수는 1, 2, 4, 8이에요. 1이 아닌 공약수로 나누어요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "30과 24의 최대공약수를 구해 보세요.", n: 6, chk: () => rd4G(30, 24) },
      { q: "[24/30]을 기약분수로 나타내 보세요.", a: "4/5", irr: true, from: "24/30" },
      { q: "[20/50]을 약분한 분수를 모두 고르세요.", pick: ["[10/25]", "[4/10]", "[2/5]", "[5/20]"], a: [0, 1, 2], why: { "3": "[5/20]은 [20/50]과 크기가 달라요. 분모와 분자를 같은 수로 나누었는지 살펴봐요." } },
      { q: "[40/56]을 약분한 분수를 모두 고르세요.", pick: ["[20/28]", "[10/14]", "[5/7]", "[8/14]"], a: [0, 1, 2], why: { "3": "40 ÷ 5 = 8, 56 ÷ 4 = 14예요. 분모와 분자를 서로 다른 수로 나누면 안 돼요." } },
      { q: "[40/48]을 잘못 약분한 사람은 누구인가요? 소희: “기약분수로 나타내면 [5/6]야.” 진우: “약분하여 만들 수 있는 분수는 모두 4개야.”", pick: ["소희", "진우"], a: 1, why: { "0": "48과 40의 최대공약수는 8이에요. [40/48] = [5/6]이니 소희의 말은 맞아요." } },
      { q: "도서관에 있는 책 81권 중 54권이 만화책이에요. 만화책은 전체의 얼마인지 기약분수로 나타내 보세요.", a: "2/3", irr: true, from: "54/81" },
      { q: "분모가 22인 진분수 중에서 분모와 분자의 합이 30보다 작은 기약분수는 모두 몇 개인가요?", n: 4, unit: "개", chk: () => { let c = 0; for (let n = 1; n < 22; n++) if (22 + n < 30 && rd4G(n, 22) === 1) c++; return c; } }],
      { ok: "공약수와 최대공약수로 약분과 기약분수 문제를 해결했어요! 진우가 말한 분수는 [20/24], [10/12], [5/6] 3개뿐이에요." }) }
},
{
  id: "t5", no: 5, title: "분모가 같은 분수로 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "준서와 하은이 중 누가 토마토를 더 많이 사용했을까요?",
  summary: "분모가 다른 분수의 분모를 같게 나타내는 것을 통분한다고 하고, 통분한 분모를 공통분모라고 해요. 두 분모의 곱이나 두 분모의 최소공배수를 공통분모로 하여 통분할 수 있어요.",
  steps: [
    { inst: "멕시코 체험장에서 타코를 만드는 데 크기가 같은 토마토를 준서는 [1/2]개, 하은이는 [2/3]개 사용했어요. 두 막대를 같은 칸 수로 나누어, 색칠한 끝이 모두 칸의 경계와 맞는 때를 찾아 기록해 보세요.", hints: ["2칸으로 나누면 준서의 막대는 맞지만 하은이의 막대는 맞지 않아요.", "두 분모 2와 3의 곱인 6칸으로 나누어 봐요."],
      render: (b, a) => rd4Split(b, a, { bars: [{ name: "준서 [1/2]", v: "1/2" }, { name: "하은 [2/3]", v: "2/3" }], parts: [2, 3, 4, 5, 6], start: 2, need: [6], lx: 230,
        ask: [rd4MulRow("1/2", 3), rd4MulRow("2/3", 2), ["토마토를 더 많이 사용한 사람: ", { c: ["준서", "하은"], a: 1 }]],
        ok: "[1/2] = [3/6], [2/3] = [4/6]이에요. 분모가 같으니 분자만 비교하면 돼요. 하은이가 토마토를 더 많이 사용했어요." }) },
    { inst: "[3/4]과 [5/6]을 분모가 같은 분수로 나타내 봐요. 크기가 같은 분수를 분모가 작은 것부터 5개씩 만들고, 분모가 같은 짝을 모두 찾아보세요.", hints: ["[3/4]의 분모와 분자에 2를 곱하면 [6/8], 3을 곱하면 [9/12]예요.", "분모가 12인 분수와 분모가 24인 분수가 두 줄에 모두 있어요."],
      render: (b, a) => rd4Common(b, a, { a: "3/4", b: "5/6", m: 6,
        askCalc: [{ q: "분모가 같은 짝의 분모 12, 24는 4와 6의 무엇인가요?", pick: ["공배수", "공약수"], a: 0 }],
        ok: "([3/4], [5/6])은 ([9/12], [10/12]), ([18/24], [20/24])로 나타낼 수 있어요. 12와 24는 4와 6의 공배수예요." }) },
    { inst: "분모가 같은 분수의 짝을 보고 알게 된 것을 말해 보세요.", hints: ["4의 배수: 4, 8, 12, 16, 20, 24, … / 6의 배수: 6, 12, 18, 24, …", "공배수는 모두 공통분모가 될 수 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "12는 4와 6의 무엇인가요?", o: ["최소공배수", "최대공약수", "곱"], a: 0 },
        { q: "[3/4]과 [5/6]의 분모를 같게 할 때 분모가 될 수 있는 수를 모두 고르세요.", o: ["12", "24", "36", "18", "48"], a: [0, 1, 2, 4], why: { "3": "18은 6의 배수이지만 4의 배수가 아니에요." } },
        { q: "두 분모의 곱 4 × 6 = 24도 분모가 될 수 있나요?", o: ["네, 24는 4와 6의 공배수예요.", "아니요, 최소공배수만 쓸 수 있어요."], a: 0, why: { "1": "공배수라면 어떤 수든 같은 분모로 쓸 수 있어요. 두 분모의 곱은 언제나 두 분모의 공배수예요." } }],
        { ok: "두 분모의 공배수는 모두 같은 분모가 될 수 있어요. 그중 가장 작은 수는 최소공배수예요." }) },
    { name: "약속하기", inst: "통분과 공통분모의 뜻을 정리해 보세요.", hints: ["([3/4], [5/6])을 ([9/12], [10/12])로 나타냈어요.", "같게 나타낸 분모 12를 부르는 이름이 있어요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 분수의 분모를 같게 나타내는 것을 ", { o: ["통분한다", "약분한다"], a: 0 }, "고 하고, 통분한 분모를 ", { o: ["공통분모", "기약분수", "공약수"], a: 0 }, "라고 해요."]) },
    { name: "확인하기", inst: "[7/8]과 [5/12]을 두 가지 방법으로 통분하고, 두 방법을 비교해 보세요.", hints: ["두 분모의 곱: 8 × 12 = 96", "두 분모의 최소공배수: 8과 12의 최소공배수는 24예요."],
      render: (b, a) => rd4Chain(b, a, [
        rd4MulRow("7/8", 12, "×", "두 분모의 곱 96"), rd4MulRow("5/12", 8, "×", "두 분모의 곱 96"),
        rd4MulRow("7/8", 3, "×", "최소공배수 24"), rd4MulRow("5/12", 2, "×", "최소공배수 24"),
        ["두 분모의 곱을 공통분모로 하면 최소공배수를 구하지 않아도 되지만 분모와 분자가 ", { c: ["커져서 계산이 복잡해요", "작아져서 계산이 간단해요"], a: 0 }, "."],
        ["최소공배수를 공통분모로 하면 최소공배수를 구해야 하지만 수가 ", { c: ["작아서 계산이 간단해요", "커서 계산이 복잡해요"], a: 0 }, "."]],
        { ok: "([7/8], [5/12])은 ([84/96], [40/96]) 또는 ([21/24], [10/24])로 통분할 수 있어요. 편리한 방법을 골라 써요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 분수를 통분해 보세요.", hints: ["두 분모의 곱: 8 × 10 = 80, 최소공배수: 40", "잘못 통분한 것은 분모에만 곱했어요. 분자에도 같은 수를 곱해요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "[5/8]과 [9/10]을 두 분모의 곱을 공통분모로 하여 통분해 보세요.", e: "[5/8]", a: "50/80", den: 80, from: "5/8" }, { e: "[9/10]", a: "72/80", den: 80, from: "9/10" },
      { q: "[5/8]과 [9/10]을 두 분모의 최소공배수를 공통분모로 하여 통분해 보세요.", e: "[5/8]", a: "25/40", den: 40, from: "5/8" }, { e: "[9/10]", a: "36/40", den: 40, from: "9/10" },
      { q: "[7/16]과 [3/40]의 공통분모가 될 수 있는 수를 모두 고르세요.", pick: ["40", "80", "120", "160", "200"], a: [1, 3], why: { "0": "40은 16의 배수가 아니에요.", "2": "120은 16의 배수가 아니에요.", "4": "200은 16의 배수가 아니에요." } },
      { q: "90을 공통분모로 하여 [4/15]와 [7/9]을 통분해 보세요.", e: "[4/15]", a: "24/90", den: 90, from: "4/15" }, { e: "[7/9]", a: "70/90", den: 90, from: "7/9" },
      { q: "누군가 [3/4]과 [7/10]을 ([3/20], [7/20])으로 잘못 통분했어요. 옳게 통분해 보세요.", e: "[3/4]", a: "15/20", den: 20, from: "3/4" }, { e: "[7/10]", a: "14/20", den: 20, from: "7/10" },
      { q: "두 기약분수를 통분하였더니 [16/56], [20/□]이 되었어요. □ 안에 알맞은 수를 써 보세요.", n: 56 },
      { q: "통분하기 전의 두 기약분수를 구해 보세요.", e: "[16/56]", a: "2/7", irr: true, from: "16/56" }, { e: "[20/56]", a: "5/14", irr: true, from: "20/56" }],
      { ok: "곱으로도, 최소공배수로도 척척 통분했어요!" }) }
},
{
  id: "t6", no: 6, title: "분수의 크기를 비교해 볼까요", soop: "개념 구축하기(O)",
  question: "딸기 맛 젤라토와 초코 맛 젤라토 중 어느 맛이 더 많이 남아 있을까요?",
  summary: "분모가 다른 두 분수의 크기를 비교할 때에는 두 분수를 통분하여 비교해요. 세 분수는 두 분수끼리 통분하여 차례대로 비교해요. 대분수는 자연수 부분을 먼저 비교하고, 같으면 분수 부분을 통분하여 비교해요.",
  steps: [
    { inst: "이탈리아 체험장에서 크기가 같은 통에 딸기 맛 젤라토는 [5/6]만큼, 초코 맛 젤라토는 [7/10]만큼 남아 있어요. 두 막대를 같은 칸 수로 나누어 보고, 두 분모의 곱(60칸)과 최소공배수(30칸)로 나눈 것을 모두 기록해 보세요.", hints: ["6과 10의 곱은 60, 최소공배수는 30이에요.", "같은 칸 수로 나누면 색칠한 칸 수(분자)만 비교하면 돼요."],
      render: (b, a) => rd4Split(b, a, { bars: [{ name: "딸기 맛 [5/6]", v: "5/6" }, { name: "초코 맛 [7/10]", v: "7/10" }], parts: [6, 10, 12, 20, 30, 60], start: 6, need: [30, 60], lx: 240,
        ask: [rd4MulRow("5/6", 10, "×", "곱 60"), rd4MulRow("7/10", 6, "×", "곱 60"), rd4PairRow("5/6", "7/10", 30, "최소공배수 30"), ["더 많이 남은 젤라토: ", { c: ["딸기 맛", "초코 맛"], a: 0 }]],
        ok: "[50/60] > [42/60], [25/30] > [21/30]이므로 [5/6] > [7/10]이에요. 딸기 맛 젤라토가 더 많이 남아 있어요." }) },
    { inst: "세 분수 [4/6], [3/8], [5/9]의 크기를 비교해 봐요. 두 분수끼리 통분하여 비교한 다음, 큰 분수부터 차례로 눌러 보세요.", hints: ["([4/6], [3/8])은 24로, ([3/8], [5/9])는 72로, ([4/6], [5/9])는 18로 통분해요.", "[4/6]이 두 분수보다 모두 커요."],
      render: (b, a) => rd4Chain(b, a, [rd4PairRow("4/6", "3/8", 24), rd4PairRow("3/8", "5/9", 72), rd4PairRow("4/6", "5/9", 18), ["큰 분수부터: ", { ord: ["[4/6]", "[3/8]", "[5/9]"] }]],
        { ok: "[4/6] > [5/9] > [3/8]이에요. 두 분수끼리 통분하여 차례대로 비교했어요." }) },
    { inst: "분수의 크기를 비교하는 방법을 말해 보세요.", hints: ["분모가 커지면 한 칸의 크기는 작아져요.", "대분수는 자연수 부분이 클수록 커요."],
      render: (b, a) => quiz(b, a, [
        { q: "분모가 다른 세 분수의 크기를 비교하는 방법으로 알맞은 것은?", o: ["두 분수끼리 통분하여 차례대로 비교해요.", "분모가 큰 분수가 더 커요.", "분자만 비교해요."], a: 0, why: { "1": "분모가 크면 한 칸의 크기가 작아져요. 분모가 크다고 큰 분수는 아니에요.", "2": "분모가 다르면 분자만 비교할 수 없어요. 먼저 통분해요." } },
        { q: "[2 3/4]과 [2 4/5]처럼 대분수의 크기를 비교할 때 먼저 할 일은?", o: ["자연수 부분을 먼저 비교해요.", "분모를 먼저 비교해요."], a: 0 },
        { q: "자연수 부분이 같은 [2 3/4]과 [2 4/5]은 어떻게 비교하나요?", o: ["분수 부분 [3/4]과 [4/5]을 통분하여 비교해요.", "분자 3과 4만 비교해요."], a: 0 }],
        { ok: "대분수는 자연수 부분을 먼저 비교하고, 자연수 부분이 같으면 분수 부분을 통분하여 비교해요." }) },
    { name: "약속하기", inst: "분모가 다른 분수의 크기를 비교하는 방법을 정리해 보세요.", hints: ["[5/6]과 [7/10]을 [25/30]과 [21/30]으로 나타내어 비교했어요.", "분모가 같으면 분자가 클수록 큰 분수예요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 두 분수의 크기를 비교할 때에는 두 분수를 ", { o: ["통분하여", "약분하여", "더하여"], a: 0 }, " 비교해요. 통분한 다음에는 ", { o: ["분자", "분모"], a: 0 }, "가 큰 쪽이 더 큰 분수예요."]) },
    { name: "확인하기", inst: "두 분수의 크기를 비교하여 ○ 안에 >, =, <를 알맞게 고르고, 세 분수의 크기를 비교해 보세요.", hints: ["[5/11]과 [4/9]은 99로 통분해요.", "□ 안의 수는 [5/14] = [15/42], [□/21] = [□×2/42]로 생각해요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "두 분수의 크기를 비교해 보세요.", cmp: ["[5/11]", "[4/9]"] }, { cmp: ["[5/6]", "[11/12]"] }, { cmp: ["[2 3/4]", "[2 4/5]"] }, { cmp: ["[3/10]", "[8/25]"] }, { cmp: ["[4 5/8]", "[4 7/12]"] },
        { q: "[4/9], [1/3], [2/5]를 큰 분수부터 차례로 눌러 보세요.", order: ["[4/9]", "[1/3]", "[2/5]"] },
        { q: "1부터 9까지의 수 중에서 □ 안에 들어갈 수 있는 수는 모두 몇 개인가요?   [5/14] > [□/21]", n: 7, unit: "개", chk: () => { let c = 0; for (let k = 1; k <= 9; k++) if (rd4Cmp("5/14", `${k}/21`) > 0) c++; return c; } }],
        { ok: "분모가 다른 분수도 통분하면 크기를 쉽게 비교할 수 있어요." }) }
  ],
  challenge: { inst: "수 카드 5, 7, 9를 한 번씩만 사용하여 분자가 1, 2, 4인 분수를 3개 만들고, 만든 세 분수의 크기를 비교하여 가장 큰 분수를 찾아보세요.", hints: ["예를 들어 [1/5], [2/7], [4/9]를 만들 수 있어요.", "두 분수씩 짝 지어 통분하여 비교해요."],
    render: (b, a) => rd4Cards(b, a, { nums: [1, 2, 4], cards: [5, 7, 9], ok: "만든 세 분수를 두 분수씩 통분하여 비교하고 가장 큰 분수를 찾았어요. 다른 방법으로 분수를 만들어 다시 해 봐도 좋아요." }) }
},
{
  id: "t7", no: 7, title: "분수와 소수의 크기를 비교해 볼까요", soop: "개념 구축하기(O)",
  question: "망고주스를 [2/5] L 따른 준서와 0.3 L 따른 하은이 중 누가 더 많이 따랐을까요?",
  summary: "분수와 소수의 크기를 비교할 때에는 분수를 분모가 10, 100인 분수로 나타낸 다음 소수로 나타내어 비교하거나, 소수를 분수로 나타내어 비교해요. 소수 한 자리 수는 분모가 10인 분수로, 소수 두 자리 수는 분모가 100인 분수로 나타내요.",
  steps: [
    { inst: "필리핀 체험장에서 망고주스를 준서는 [2/5] L, 하은이는 0.3 L 따랐어요. 수직선에 두 수를 놓아 보세요.", hints: ["[2/5]의 분모와 분자에 2를 곱하면 분모가 10인 분수가 돼요.", "[2/5] = [4/10] = 0.4예요."],
      render: (b, a) => rd4Place(b, a, { max: 1, t: 10, lab: "dec", items: [{ name: "준서 [2/5] L", v: "2/5" }, { name: "하은 0.3 L", v: "0.3" }],
        ask: [["[2/5] = ", { q: [null, ["2×", "?2"], ["5×", "?2"]] }, " = ", { q: [null, "?4", "10"] }, " = ", { i: "0.4" }], ["0.3 = ", { q: [null, "?3", "?10"] }, ",  [2/5] = ", { q: [null, "?4", "?10"] }], ["[2/5] ", { c: RD4_CMP, a: 0 }, " 0.3"], ["망고주스를 더 많이 따른 사람: ", { c: ["준서", "하은"], a: 0 }]],
        ok: "[2/5] = 0.4이고 0.4 > 0.3이에요. 0.3 = [3/10]이고 [4/10] > [3/10]이에요. 준서가 더 많이 따랐어요." }) },
    { inst: "[8/25]과 0.48의 크기를 비교해 봐요. 모눈 한 칸은 [1/100]이에요. 두 수만큼 모눈에 색칠해 보세요.", hints: ["[8/25]의 분모와 분자에 4를 곱하면 분모가 100이 돼요.", "0.48은 [1/100]이 48개예요."],
      render: (b, a) => rd4Hund(b, a, { grids: [{ name: "[8/25]", k: 32 }, { name: "0.48", k: 48 }],
        ask: [["[8/25] = ", { q: [null, ["8×", "?4"], ["25×", "?4"]] }, " = ", { q: [null, "?32", "100"] }, " = ", { i: "0.32" }], ["0.48 = ", { q: [null, "?48", "100"] }, " = ", { q: [null, ["48÷", "?4"], ["100÷", "?4"]] }, " = ", { q: [null, "?12", "?25"] }], ["[8/25] ", { c: RD4_CMP, a: 2 }, " 0.48"]],
        ok: "[8/25] = 0.32 < 0.48, 또는 [8/25] < [12/25] = 0.48이에요." }) },
    { inst: "0.7과 [3/5]의 크기를 두 가지 방법으로 비교해 보세요.", hints: ["방법 1: [3/5]을 분모가 10인 분수로 나타낸 다음 소수로 나타내요.", "방법 2: 0.7을 분모가 10인 분수로 나타내요."],
      render: (b, a) => rd4Chain(b, a, [
        { t: "방법 1 분수를 소수로", p: ["[3/5] = ", { q: [null, "?6", "10"] }, " = ", { i: "0.6" }] },
        { t: "방법 1", p: ["0.7 ", { c: RD4_CMP, a: 0 }, " 0.6이므로 0.7 ", { c: RD4_CMP, a: 0 }, " [3/5]"] },
        { t: "방법 2 소수를 분수로", p: ["0.7 = ", { q: [null, "?7", "?10"] }, ",  [3/5] = ", { q: [null, "?6", "?10"] }, "  →  0.7 ", { c: RD4_CMP, a: 0 }, " [3/5]"] },
        ["소수 한 자리 수는 분모가 ", { c: ["10", "100"], a: 0 }, "인 분수로, 소수 두 자리 수는 분모가 ", { c: ["10", "100"], a: 1 }, "인 분수로 나타내요."]],
        { ok: "분수를 소수로 나타내면 높은 자리부터 비교하고, 소수를 분수로 나타내면 분모를 같게 하여 분자를 비교해요." }) },
    { name: "약속하기", inst: "분수와 소수의 크기를 비교하는 방법을 정리해 보세요.", hints: ["[2/5]을 0.4로 바꾸어 0.3과 비교했어요.", "0.3을 [3/10]으로 바꾸어 [4/10]과 비교했어요."],
      render: (b, a) => blanks(b, a, ["분수와 소수의 크기를 비교할 때에는 분수를 ", { o: ["소수", "자연수"], a: 0 }, "로 나타내어 비교하거나 소수를 ", { o: ["분수", "자연수"], a: 0 }, "로 나타내어 비교해요."]) },
    { name: "확인하기", inst: "분수와 소수의 크기를 비교하여 문제를 해결해 보세요.", hints: ["[9/20] = [45/100] = 0.45, [1 9/50] = [1 18/100] = 1.18", "[1 3/25] = [1 12/100] = 1.12예요. 가는 1 kg보다 가벼워요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "두 수의 크기를 비교해 보세요.", cmp: ["[1/2]", "0.5"] }, { cmp: ["[9/20]", "0.41"] }, { cmp: ["1.07", "[1 9/50]"], why: { ">": "[1 9/50] = [1 18/100] = 1.18이에요. 소수 첫째 자리를 비교해요." } },
        { q: "시우가 수확한 채소 바구니의 무게예요. 가: [97/100] kg, 나: 1.02 kg, 다: [1 3/25] kg. 무거운 것부터 차례로 눌러 보세요.", order: [{ t: "가 [97/100] kg", v: "97/100" }, { t: "나 1.02 kg", v: "1.02" }, { t: "다 [1 3/25] kg", v: "1 3/25" }] }],
        { ok: "분수를 소수로, 소수를 분수로 나타내어 크기를 비교했어요. 다 > 나 > 가 순서로 무거워요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 분수와 소수의 크기를 비교해 보세요.", hints: ["0.39 = [39/100], [7/20] = [35/100]", "0.39 = [39/100]이고 [44/100]보다 작은 분수는 [40/100], [41/100], [42/100], [43/100]이에요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "[1/2]을 소수로 나타내 보세요.", n: 0.5 },
      { q: "두 수의 크기를 비교해 보세요.", cmp: ["[1/2]", "0.7"] }, { cmp: ["0.39", "[7/20]"] }, { cmp: ["[3/4]", "0.7"] }, { cmp: ["8.41", "[8 20/50]"] },
      { q: "[5/8]보다 큰 수를 고르세요.", pick: ["0.6", "[15/25]", "0.74"], a: 2, why: { "0": "[5/8] = [625/1000] = 0.625예요. 0.6은 0.625보다 작아요.", "1": "[15/25] = [60/100] = 0.6이에요. [5/8] = 0.625보다 작아요." } },
      { q: "0.39보다 크고 [44/100]보다 작은 분수 중에서 분모가 100인 기약분수를 모두 고르세요.", pick: ["[40/100]", "[41/100]", "[42/100]", "[43/100]"], a: [1, 3], why: { "0": "[40/100]은 분모와 분자를 20으로 나눌 수 있어 기약분수가 아니에요.", "2": "[42/100]는 분모와 분자를 2로 나눌 수 있어 기약분수가 아니에요." } },
      { q: "분모가 20인 분수 중에서 [4 11/20]보다 크고 4.7보다 작은 분수는 모두 몇 개인가요?", n: 2, unit: "개", chk: () => { let c = 0; for (let k = 0; k < 20; k++) if (rd4Cmp(`4 ${k}/20`, "4 11/20") > 0 && rd4Cmp(`4 ${k}/20`, "4.7") < 0) c++; return c; } }],
      { ok: "4.7 = [4 14/20]이니 [4 12/20], [4 13/20] 2개예요. 분수와 소수를 자유롭게 바꾸어 비교했어요!" }) }
},
{
  id: "t8", no: 8, title: "생각을 더하다 ― [1/2]을 기준으로 길이를 비교해 볼까요", soop: "탐구 정리하기(O)",
  question: "통분하지 않고 [1/2] km를 기준으로 둘레길 코스의 길이를 비교할 수 있을까요?",
  summary: "[1/2]과 크기가 같은 분수 [2/4], [3/6], [4/8]은 분모가 분자의 2배예요. 분자를 2배 한 수가 분모보다 작으면 [1/2]보다 작고, 분자를 2배 한 수가 분모보다 크면 [1/2]보다 커요.",
  steps: [
    { inst: "승아는 아버지와 함께 둘레길을 걸으려고 해요. 4코스는 [3/4] km, 5코스는 [2/8] km예요. 아버지께서 “통분하지 않고 [1/2] km를 기준으로 비교할 수도 있단다.”라고 하셨어요. 막대에 [2/8], [1/2], [3/4]만큼 색칠해 보세요.", hints: ["[2/8]는 8칸 중 2칸이에요.", "색칠한 끝을 [1/2]의 끝과 견주어 봐요."],
      render: (b, a) => rd4Bars(b, a, { bars: [{ name: "5코스 [2/8]", d: 8, k: 2 }, { name: "[1/2]", d: 2, k: 1, col: 4 }, { name: "4코스 [3/4]", d: 4, k: 3, col: 1 }],
        askCalc: [{ q: "[2/8]는 [1/2]보다", pick: ["작아요", "커요"], a: 0 }, { q: "[3/4]은 [1/2]보다", pick: ["작아요", "커요"], a: 1 }, { q: "4코스와 5코스 중 길이가 더 긴 코스는?", pick: ["4코스", "5코스"], a: 0 }],
        ok: "[2/8]는 [1/2]보다 작고, [3/4]은 [1/2]보다 커요. 그래서 4코스가 5코스보다 길어요." }) },
    { inst: "[1/2]과 크기가 같은 분수를 만들고, 분모와 분자 사이의 관계를 알아보세요.", hints: ["[1/2]의 분모와 분자에 2를 곱하면 [2/4]예요.", "4는 2의 2배, 6은 3의 2배예요."],
      render: (b, a) => rd4Chain(b, a, [
        ["[1/2] = ", { q: [null, "?2", "4"] }, " = ", { q: [null, "?3", "6"] }, " = ", { q: [null, "?4", "8"] }],
        ["분모 4, 6, 8은 분자 2, 3, 4를 ", { c: ["2배", "3배"], a: 0 }, " 한 수예요."]],
        { ok: "[1/2]과 크기가 같은 분수는 분모가 분자의 2배예요." }) },
    { inst: "둘레길 표지판의 코스 길이를 [1/2]보다 짧은 코스와 긴 코스로 나누어 살펴봐요. 분자를 2배 한 수를 구하고 분모와 비교해 보세요.", hints: ["[1/4]: 1 × 2 = 2는 분모 4보다 작아요.", "[7/8]: 7 × 2 = 14는 분모 8보다 커요."],
      render: (b, a) => rd4Chain(b, a, [
        { t: "짧은 코스", p: ["1코스 [1/4]: 1 × 2 = ", { i: "2" }, ",  3코스 [3/10]: 3 × 2 = ", { i: "6" }, ",  5코스 [2/8]: 2 × 2 = ", { i: "4" }] },
        ["→ 분자를 2배 한 수는 분모보다 ", { c: ["작아요", "커요"], a: 0 }],
        { t: "긴 코스", p: ["2코스 [7/8]: 7 × 2 = ", { i: "14" }, ",  4코스 [3/4]: 3 × 2 = ", { i: "6" }, ",  6코스 [5/6]: 5 × 2 = ", { i: "10" }] },
        ["→ 분자를 2배 한 수는 분모보다 ", { c: ["작아요", "커요"], a: 1 }]],
        { ok: "[1/2]보다 작은 분수는 분자를 2배 한 수가 분모보다 작고, [1/2]보다 큰 분수는 분자를 2배 한 수가 분모보다 커요." }) },
    { name: "약속하기", inst: "[1/2] km를 기준으로 비교하는 방법을 정리해 보세요.", hints: ["[2/8]: 2 × 2 = 4 < 8이고 [1/2]보다 짧았어요.", "[3/4]: 3 × 2 = 6 > 4이고 [1/2]보다 길었어요."],
      render: (b, a) => blanks(b, a, ["분자를 2배 한 수가 분모보다 작으면 [1/2] km보다 ", { o: ["짧고", "길고"], a: 0 }, ", 분자를 2배 한 수가 분모보다 크면 [1/2] km보다 ", { o: ["길어요", "짧아요"], a: 0 }, "."]) },
    { name: "확인하기", inst: "캠핑장 시설까지의 거리예요. [1/2] km를 기준으로 가까운 곳과 먼 곳으로 나누어 보세요.", hints: ["화장실 [3/8] km: 3 × 2 = 6은 8보다 작아요.", "사무실 [7/10] km: 7 × 2 = 14는 10보다 커요."],
      render: (b, a) => rd4Sort(b, a, { bins: ["[1/2] km보다 가까운 곳", "[1/2] km보다 먼 곳"],
        cards: [rd4HalfCard("화장실", "3/8"), rd4HalfCard("사무실", "7/10"), rd4HalfCard("매점", "7/16"), rd4HalfCard("샤워장", "13/20"), rd4HalfCard("체육 시설", "5/12"), rd4HalfCard("주차장", "9/14")],
        ok: "가까운 곳은 화장실, 매점, 체육 시설이고, 먼 곳은 사무실, 샤워장, 주차장이에요. 통분하지 않고도 [1/2]을 기준으로 비교했어요." }) }
  ],
  challenge: { inst: "통분하지 않고 수 감각으로 두 분수의 크기를 비교해 보세요.", hints: ["[4/5]은 1보다 [1/5]만큼, [6/7]은 1보다 [1/7]만큼 작아요. [1/7]이 [1/5]보다 작아요.", "[9/13]의 분모와 분자에 2를 곱하면 [18/26]이에요. 분자가 같으면 분모가 작을수록 커요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "[4/5]와 [6/7]은 1보다 각각 [1/5], [1/7]만큼 작아요.", cmp: ["[4/5]", "[6/7]"] },
      { q: "[1/2]을 기준으로 비교해 보세요.", cmp: ["[7/11]", "[6/13]"] },
      { q: "분자를 같게 하여 비교해 보세요. ([9/13] = [18/26])", cmp: ["[18/25]", "[9/13]"] },
      { q: "[1/2]보다 큰 분수를 모두 고르세요.", pick: ["[5/12]", "[8/15]", "[11/20]", "[9/18]", "[7/16]"], a: [1, 2], why: { "0": "5 × 2 = 10은 12보다 작아요.", "3": "9 × 2 = 18은 분모 18과 같아요. [9/18] = [1/2]이에요.", "4": "7 × 2 = 14는 16보다 작아요." } }],
      { ok: "1과의 차이, [1/2] 기준, 분자 같게 하기로 통분하지 않고도 크기를 비교했어요!" }) }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 손가락 접어!", soop: "발표하기(P)",
  question: "분모가 다른 분수, 분수와 소수의 크기를 빠르게 비교할 수 있을까요?",
  summary: "분모가 다른 분수는 통분하여, 분수와 소수는 분수를 소수로(또는 소수를 분수로) 나타내어 크기를 비교해요. 크기가 같은 두 수는 ‘큰 수’도 ‘작은 수’도 아니에요.",
  steps: [
    { name: "카드 만들기", inst: "놀이 준비: 빈 카드 4장에 진분수, 1보다 작은 소수 한 자리 수, 1보다 작은 소수 두 자리 수를 자유롭게 써넣어요. 진분수의 분모는 2부터 9까지의 수 중에서 써요.", hints: ["진분수는 분자가 분모보다 작은 분수예요. 예: [3/8]", "소수 한 자리 수 예: 0.6, 소수 두 자리 수 예: 0.45"],
      render: (b, a) => rd4Maker(b, a, {}) },
    { name: "놀이 방법 알기", inst: "놀이 방법을 순서대로 눌러 보세요.", hints: ["먼저 순서를 정하고 손가락을 펼쳐요.", "조건에 해당하는 사람이 손가락을 접은 다음, 사용한 카드는 한쪽에 모아요."],
      render: (b, a) => sequence(b, a, ["㉠ 조건에 해당하는 사람은 모두 손가락을 하나 접어요.", "㉡ 가위바위보로 순서를 정하고, 왼손을 들어 손가락을 모두 펼쳐요.", "㉢ 자기 차례가 되면 카드에 적힌 수와 크기를 비교하는 조건을 만들어 말해요.", "㉣ 각자 카드를 한 장씩 가져와 수가 보이도록 놓아요.", "㉤ 사용한 카드는 한쪽에 모아 두어요."], [1, 3, 2, 0, 4], { ok: "남은 카드가 없을 때까지 놀이를 되풀이하고, 펼친 손가락이 많은 사람이 이겨요." }) },
    { name: "조건 판단하기", inst: "하은이가 0.64 카드를 들고 “0.64보다 큰 수를 가지고 있는 사람 모두 손가락 하나 접어!”라고 말했어요.", hints: ["[7/10] = 0.7, [1/2] = 0.5예요.", "0.75와 0.64는 소수 둘째 자리까지 비교해요."],
      render: (b, a) => quiz(b, a, [
        { q: "손가락을 접어야 하는 사람을 모두 고르세요. (준서 0.75, 유주 [1/2], 나 [7/10])", o: ["준서 0.75", "유주 [1/2]", "나 [7/10]"], a: [0, 2], why: { "1": "[1/2] = 0.5는 0.64보다 작아요." } },
        { q: "놀이에서 이기려면 조건을 어떻게 만들면 좋을까요?", o: ["조건에 해당하는 사람이 많도록, 나는 해당하지 않도록 만들어요.", "내가 손가락을 접도록 만들어요."], a: 0 }],
        { ok: "조건을 말할 때는 내 카드와 다른 사람의 카드를 견주어 보고 조건을 잘 만들어야 해요." }) },
    { name: "놀이 약속", inst: "놀이를 할 때 지킬 약속을 정리해 보세요.", hints: ["조건을 말한 사람이 손가락을 접으면 손해예요.", "손가락을 적게 접은 사람이 이겨요."],
      render: (b, a) => blanks(b, a, ["조건을 말하는 사람은 자신이 조건에 ", { o: ["해당되지 않도록", "해당되도록"], a: 0 }, " 조건을 만들어요. 남은 카드가 없을 때 펼친 손가락이 ", { o: ["많은", "적은"], a: 0 }, " 사람이 이겨요. 승부보다 크기를 바르게 비교하는 것이 중요해요."]) },
    { name: "놀이하기", inst: "하은, 유주, 준서와 함께 ‘손가락 접어!’ 놀이를 해요. 내 차례에는 조건을 고르고, 판마다 손가락을 접어야 하는 사람을 모두 골라 판정해요.", hints: ["분수와 소수를 비교할 때에는 소수를 분수로 나타내어 통분해 봐요. 예: 0.35 = [35/100]", "조건을 말한 사람은 접지 않아요. 크기가 같은 수도 접지 않아요."],
      render: (b, a) => rd4Game(b, a, { ok: "끝까지 놀이를 했어요! 분수와 소수의 크기를 비교하는 힘이 자랐어요." }) }
  ],
  challenge: { name: "또 다른 놀이", inst: "통분 놀이: 분모가 2부터 9까지인 진분수 카드를 2장씩 뒤집어요. 두 분모의 최소공배수를 공통분모로 하여 통분하고, 옳게 통분하면 1점을 얻어요. 4점을 모아 보세요.", hints: ["두 분모의 최소공배수를 먼저 구해요. 예: 4와 6의 최소공배수는 12", "분모에 곱한 수만큼 분자에도 곱해요."],
    render: (b, a) => rd4Tong(b, a, { need: 4, ok: "최소공배수를 공통분모로 하여 척척 통분했어요!" }) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "약분과 통분에 대해 배운 내용을 잘 알고 있나요?",
  summary: "크기가 같은 분수는 분모와 분자에 0이 아닌 같은 수를 곱하거나 나누어 만들어요. 분모와 분자를 공약수로 나누는 것이 약분, 분모를 같게 나타내는 것이 통분이에요. 분모가 다른 분수는 통분하여, 분수와 소수는 한 가지로 나타내어 크기를 비교해요.",
  steps: [
    { name: "내 힘으로 풀어요 ①", inst: "[1/4], [3/8], [3/12]만큼 색칠하고, 크기가 같은 분수를 찾아보세요.", hints: ["[3/8]은 8칸 중 3칸, [3/12]은 12칸 중 3칸이에요.", "[24/30]의 분모와 분자를 6으로 나누면 [4/5]예요."],
      render: (b, a) => rd4Bars(b, a, { bars: [{ name: "[1/4]", d: 4, k: 1 }, { name: "[3/8]", d: 8, k: 3 }, { name: "[3/12]", d: 12, k: 3 }],
        askCalc: [{ q: "크기가 같은 두 분수를 고르세요.", pick: ["[1/4]", "[3/8]", "[3/12]"], a: [0, 2], why: { "1": "[3/8]의 색칠한 끝은 [1/4]의 끝보다 더 가요." } },
          { q: "[24/30]와 크기가 같은 분수를 모두 고르세요.", pick: ["[4/5]", "[10/15]", "[48/60]", "[8/10]", "[70/90]"], a: [0, 2, 3], why: { "1": "[24/30] = [12/15]예요. [10/15]은 크기가 달라요.", "4": "[24/30] = [72/90]이에요. [70/90]은 크기가 달라요." } }],
        ok: "[1/4] = [3/12]이고, [24/30] = [4/5] = [8/10] = [48/60]이에요." }) },
    { name: "내 힘으로 풀어요 ②", inst: "분수를 약분하고, 두 가지 방법으로 통분해 보세요. 약분한 분수는 기약분수가 아니어도 정답이에요.", hints: ["[16/36]의 분모와 분자를 공약수 2나 4로 나누어요.", "두 분모의 곱: 6 × 10 = 60, 최소공배수: 30"],
      render: (b, a) => rd4Calc(b, a, [
        { q: "[16/36]을 약분해 보세요.", a: "4/9", red: true, from: "16/36" },
        { q: "[40/60]을 약분해 보세요.", a: "2/3", red: true, from: "40/60" },
        { q: "[5/6]와 [3/10]을 두 분모의 곱을 공통분모로 하여 통분해 보세요.", e: "[5/6]", a: "50/60", den: 60, from: "5/6" }, { e: "[3/10]", a: "18/60", den: 60, from: "3/10" },
        { q: "[5/6]와 [3/10]을 두 분모의 최소공배수를 공통분모로 하여 통분해 보세요.", e: "[5/6]", a: "25/30", den: 30, from: "5/6" }, { e: "[3/10]", a: "9/30", den: 30, from: "3/10" }],
        { ok: "약분과 통분을 정확하게 했어요." }) },
    { name: "내 힘으로 풀어요 ③", inst: "두 수의 크기를 비교하여 ○ 안에 >, =, <를 알맞게 고르세요.", hints: ["[4/7]과 [6/11]은 77로 통분해요.", "[3/4] = [75/100] = 0.75, 0.64 = [64/100]"],
      render: (b, a) => rd4Calc(b, a, [
        { q: "두 수의 크기를 비교해 보세요.", cmp: ["[4/7]", "[6/11]"] }, { cmp: ["[2 2/3]", "[2 3/6]"] }, { cmp: ["[3/4]", "0.9"] }, { cmp: ["0.64", "[16/25]"] }],
        { ok: "분수끼리는 통분하여, 분수와 소수는 한 가지로 나타내어 비교했어요." }) },
    { name: "내 힘으로 풀어요 ④", inst: "크기가 같은 비커에 온도가 같은 물을 넣고 소금을 녹였더니, 물의 양이 많을수록 녹은 소금이 많았어요. 넣은 물의 양은 가 [5/6]컵, 나 [5/8]컵, 다 [9/10]컵이에요. 두 분수끼리 통분하여 차례대로 비교해 보세요.", hints: ["가와 나는 24로, 가와 다는 30으로 통분해요.", "물의 양이 많은 차례는 다, 가, 나예요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "가와 나를 24로 통분해 보세요.", e: "가 [5/6]", a: "20/24", den: 24, from: "5/6" }, { e: "나 [5/8]", a: "15/24", den: 24, from: "5/8" },
        { q: "가와 다를 30으로 통분해 보세요.", e: "가 [5/6]", a: "25/30", den: 30, from: "5/6" }, { e: "다 [9/10]", a: "27/30", den: 30, from: "9/10" },
        { q: "녹은 소금이 가장 많은 비커는?", pick: ["가", "나", "다"], a: 2 },
        { q: "녹은 소금이 가장 적은 비커는?", pick: ["가", "나", "다"], a: 1 }],
        { ok: "다 > 가 > 나이므로 녹은 소금이 가장 많은 비커는 다, 가장 적은 비커는 나예요." }) },
    { name: "확인하고 정리해요", inst: "이 단원에서 배운 내용을 정리해 보세요.", hints: ["크기가 같은 분수는 분모와 분자에 같은 수를 곱하거나 같은 수로 나누어 만들어요.", "[1/4] = [25/100] = 0.25예요."],
      render: (b, a) => rd4Chain(b, a, [
        rd4MulRow("1/3", 2, "×", "크기가 같은 분수"),
        rd4MulRow("12/15", 3, "÷", "약분"),
        ["분모와 분자를 1이 아닌 공약수로 나누어 간단한 분수로 나타내는 것을 ", { c: ["약분한다", "통분한다"], a: 0 }, "고 해요."],
        ["분모가 다른 분수의 분모를 같게 나타내는 것을 ", { c: ["약분한다", "통분한다"], a: 1 }, "고 해요."],
        rd4MulRow("3/4", 8, "×", "통분(곱 32)"), rd4MulRow("5/8", 4, "×", "통분(곱 32)"),
        { t: "분수와 소수", p: ["[1/4] = ", { q: [null, "?25", "100"] }, " = ", { i: "0.25" }] },
        ["[1/4] ", { c: RD4_CMP, a: 2 }, " 0.5"]],
        { ok: "약분과 통분을 잘 정리했어요. 다음 단원에서는 통분을 이용하여 분모가 다른 분수의 덧셈과 뺄셈을 배워요." }) }
  ],
  challenge: { inst: "문제를 해결해 보세요.", hints: ["[3/8]과 [7/12]을 24로 통분하면 [9/24], [14/24]예요.", "[10/24]은 2로, [12/24]는 12로 약분할 수 있어요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "[3/8]보다 크고 [7/12]보다 작은 분수 중에서 분모가 24인 기약분수를 모두 고르세요.", pick: ["[10/24]", "[11/24]", "[12/24]", "[13/24]", "[14/24]"], a: [1, 3], why: { "0": "[10/24]은 분모와 분자를 2로 나눌 수 있어 기약분수가 아니에요.", "2": "[12/24]는 [1/2]으로 약분할 수 있어 기약분수가 아니에요.", "4": "[14/24]는 [7/12]과 크기가 같아요. [7/12]보다 작은 분수를 찾아요." } },
      { q: "[2/3], [3/5], [5/8]을 큰 분수부터 차례로 눌러 보세요.", order: ["[2/3]", "[3/5]", "[5/8]"] },
      { q: "두 수의 크기를 비교해 보세요.", cmp: ["[13/20]", "0.6"] },
      { q: "[36/48]을 기약분수로 나타내 보세요.", a: "3/4", irr: true, from: "36/48" }],
      { ok: "배운 내용을 활용하여 문제를 척척 해결했어요!" }) }
}
];
