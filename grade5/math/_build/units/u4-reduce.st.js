//@@APP
const APP={title:"우리 반 과일 가게 놀이", unit:"5-1 수학 4. 약분과 통분", key:"s51-reduce-v1", welcome:"우리 반 과일 가게 놀이에 온 것을 환영해요", intro:"새봄초등학교 5학년 3반 친구들과 알록달록 과일 가게를 열어, 파이와 수박을 똑같이 나누고 주스 양과 가격표의 무게를 비교하며 약분과 통분을 배워요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u4-reduce.tb.js)의 rd4 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   (입력칸 0.9초 · 고르기 0.26초 · 색칠·옮기기·카드 놓기 1.2초) 이 파일에서 새로 만든 그림은 앞글자 rd4s. */
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
.rd4hide{display:none!important}
.rd4note{border:2px solid #E2C9A0;background:#FFF7E8;border-radius:.8em;padding:.5em .9em;margin:.3em 0 .6em;word-break:keep-all}
.rd4notet{font-family:Jua,sans-serif;color:var(--night)}
.rd4note ul{margin:.3em 0 0 1.1em;padding:0}.rd4note li{margin:.15em 0}
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
/* 이름 있는 function으로 다시 씌워야 엔진이 한 계단의 활동 수를 셀 수 있어요(hj-multi: done( 이 든 함수만 셈) */
quiz = function quiz(body, api, items, opts) { return rd4Quiz0(body, Object.assign(rd4A(api), { done: (x, m, l) => api.done(x, m, l) }), items, opts); };
blanks = function blanks(body, api, parts, opts) { return rd4Blanks0(body, Object.assign(rd4A(api), { done: (x, m, l) => api.done(x, m, l) }), parts, opts); };

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
  el.inputs = [w, n, d].filter(Boolean);
  el.filled = needW => n.value.trim() !== "" && d.value.trim() !== "" && (!needW || (w && w.value.trim() !== ""));
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
function rd4OrderEl(labels, onchange) {
  const picked = [], row = h("span", { class: "rd4chs" });
  const btns = labels.map((t, i) => h("button", { class: "opt", onclick: () => {
    if (picked.includes(i)) return; picked.push(i);
    btns[i].classList.add("on"); btns[i].prepend(h("span", { class: "rd4ord" }, String(picked.length)));
    onchange && onchange();
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

/* ===== 이야기 버전 부품: '확인하기' 단추 없이 autoRun으로 저절로 확인해요 =====
   (입력칸 0.9초 · 고르기 0.26초 · 색칠·옮기기·카드 놓기 1.2초)
   조작 부품은 조작을 다 끝내면 아래 물음(ask·askCalc)이 나타나요. 물음이 없으면 조작을 마치면 바로 통과해요.
   모든 조작 부품은 스스로 api.done( 을 불러요(한 계단에 활동이 둘 이상일 때 엔진이 모두 세도록). */
function rd4Hook(el, auto) {
  el.addEventListener("input", () => auto()); el.addEventListener("change", () => auto());
  el.addEventListener("focusout", () => setTimeout(() => auto(), 0));
  el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); el.blur(); } });
}
/* 조작이 끝나면 물음을 보여 주거나(ask·askCalc) 계단을 마쳐요(fin). 돌려주는 함수를 조작할 때마다 불러요. */
function rd4Then(host, api, ready, opt, fin) {
  rd4Style();
  if (opt.ask || opt.askCalc) {
    host.classList.add("rd4hide");
    const pre = () => ready() ? null : (typeof opt.wait === "function" ? opt.wait() : opt.wait) || "먼저 위의 활동을 끝내요.";
    const sub = opt.ask ? rd4Chain(host, api, opt.ask, { ok: opt.ok, bad: opt.bad, pre }) : rd4Calc(host, api, opt.askCalc, { ok: opt.ok, pre });
    let shown = false;
    return () => {
      if (shown) { if (ready()) sub(); return; }
      if (!ready()) return;
      shown = true; host.classList.remove("rd4hide");
      api.hint(opt.mid || "○ 좋아요! 이어서 아래 물음에 답해요.");
      setTimeout(() => { try { host.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) {} }, 60);
    };
  }
  api.provide({ words: [], answers: [] });
  return autoRun(ready, () => "끝", () => { api.tryOnce(); fin(opt.doneText || "조작 완료", opt.ok); return true; }, 1200);
}

/* ① 답 쓰기 여러 개 — 다 쓰거나 다 고르면 저절로 확인
   item: {q, e?, a:"2/5", den?, red?, irr?, from?, mixed?, why}   분수 칸
         {q, n:수, unit, why}                                        수 칸(소수도 됨)
         {q, set:[수…], why:{miss}}                                  여러 수(쉼표로, Enter로 마침)
         {q, eq:"6/8", count:3}                                      크기가 같은 분수 여러 개 만들기
         {q, pick:[…], a:번호|[번호…], why:{번호|miss}}             고르기
         {q, cmp:[A, B]}                                             >, =, < 고르기(답은 계산)
         {q, order:[글|{t, v}], asc?}                                 큰(작은) 차례로 누르기(답은 계산)
   opt: ok, bad, words, pre(): 아직 안 되면 안내 글 */
function rd4Calc(body, api, items, opt = {}) {
  rd4Style();
  let auto = () => {};
  const poke = () => auto();
  const rows = [], wrap = h("div");
  const nq = items.filter(x => x.q).length; let qn = 0;
  items.forEach(it => {
    const R = { it };
    let box;
    if (it.q || !rows.length) { box = h("div", { class: "qitem" }); if (it.q) { qn++; box.append(h("div", { class: "jua" }, (nq > 1 ? qn + ". " : "") + it.q + (it.pick && Array.isArray(it.a) ? " (모두 고르세요)" : ""))); } wrap.append(box); }
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
        poke();
      } }, o)));
      R.row = row; if (it.e) host.append(h("span", {}, it.e)); host.append(row);
    } else if (it.cmp) {
      R.kind = "cmp"; R.ans = rd4Sign(rd4Cmp(it.cmp[0], it.cmp[1])); R.sel = null;
      const row = h("span", { class: "rd4chs" });
      [">", "=", "<"].forEach(s => row.append(h("button", { class: "opt", onclick: ev => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); R.sel = s; poke(); } }, s)));
      R.row = row; host.append(h("span", {}, it.cmp[0]), row, h("span", {}, it.cmp[1]));
    } else if (it.order) {
      R.kind = "order";
      const labs = it.order.map(o => typeof o === "string" ? o : o.t), vals = it.order.map(o => typeof o === "string" ? o : o.v);
      R.labs = labs; R.vals = vals; R.ans = rd4Rank(vals, it.asc);
      R.el = rd4OrderEl(labs, poke); host.append(h("span", { class: "rd4lab" }, it.asc ? "작은 수부터 차례로 눌러요" : "큰 수부터 차례로 눌러요"), R.el);
    } else if (it.set) {
      R.kind = "set";
      R.inp = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "rd4box rd4set", "aria-label": rd4Plain(it.q || "답"), placeholder: "예: 1, 2, 3" });
      host.append(h("span", { class: "rd4lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
      box.append(h("div", { class: "rd4log" }, "쉼표(,)로 나누어 쓰고, 다 쓰면 Enter를 눌러요."));
      rd4Hook(R.inp, poke);
    } else if (it.n != null) {
      R.kind = "n";
      if (it.chk && it.chk() !== it.n) throw new Error(`답 확인 필요: ${it.q} = ${it.n}`);
      R.inp = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "rd4box rd4wide", "aria-label": rd4Plain(it.lab || it.e || it.q || "답") });
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "rd4lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
      rd4Hook(R.inp, poke);
    } else if (it.eq) {
      R.kind = "eq"; R.ins = [];
      for (let k = 0; k < (it.count || 3); k++) { const fi = rd4In("크기가 같은 분수 " + (k + 1)); R.ins.push(fi); host.append(fi); fi.inputs.forEach(x => rd4Hook(x, poke)); if (k < (it.count || 3) - 1) host.append(h("span", {}, ",")); }
    } else {
      R.kind = "f";
      if (!rd4Val(it.a)) throw new Error("답 형식 오류: " + it.a);
      if (it.from && !rd4Same(it.from, it.a)) throw new Error(`답 확인 필요: ${it.from} = ${it.a}`);
      if (it.den && rd4ND(it.a)[1] !== it.den) throw new Error(`분모 확인 필요: ${it.a}`);
      if (it.irr && rd4G(...rd4ND(it.a)) !== 1) throw new Error(`기약분수 확인 필요: ${it.a}`);
      R.inp = rd4In(it.lab || it.e || "답", it.mixed);
      R.needW = !!it.mixed && rd4Cmp(it.a, "1") >= 0;
      host.append(it.e ? h("span", {}, it.e + " =") : h("span", { class: "rd4lab" }, it.lab || "답"), R.inp, it.unit ? h("span", {}, it.unit) : "");
      R.inp.inputs.forEach(x => rd4Hook(x, poke));
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
  const full = R => {
    if (R.kind === "pick") return R.sel.size >= (R.multi ? R.it.a.length : 1);
    if (R.kind === "cmp") return R.sel != null;
    if (R.kind === "order") return R.el.get().length === R.labs.length;
    if (R.kind === "set") return R.inp.value.trim() !== "" && document.activeElement !== R.inp;
    if (R.kind === "n") return R.inp.value.trim() !== "";
    if (R.kind === "eq") return R.ins.every(fi => fi.filled());
    return R.inp.filled(R.needW);
  };
  const ready = () => {
    if (!rows.every(full)) return false;
    const m = opt.pre && opt.pre(); if (m) { api.hint(m); return false; }
    return true;
  };
  const sign = () => rows.map(R => R.kind === "pick" ? [...R.sel].sort((a, b) => a - b).join(".") : R.kind === "cmp" ? R.sel : R.kind === "order" ? R.el.get().join(".")
    : R.kind === "eq" ? R.ins.map(fi => fi.text()).join(",") : R.kind === "f" ? R.inp.text() : R.inp.value.trim()).join("§");
  const run = () => {
    let bad = null; const given = [];
    rows.forEach(R => {
      const it = R.it;
      if (R.kind === "pick") {
        const v = [...R.sel], want = Array.isArray(it.a) ? it.a : [it.a];
        const g = v.length === want.length && want.every(x => R.sel.has(x));
        [...R.row.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (R.sel.has(i) && (g || !want.includes(i))) b.classList.add(g ? "good" : "bad"); });
        given.push(v.length ? v.map(i => rd4Plain(it.pick[i])).join("·") : "-");
        if (!g && !bad) { const wrongSel = v.slice().sort((a, b) => a - b).find(i => !want.includes(i)); bad = (wrongSel != null && it.why && it.why[wrongSel]) || (wrongSel == null && it.why && it.why.miss) || (wrongSel == null && R.multi ? "알맞은 것을 모두 골라요. 빠뜨린 것이 있어요." : "빨간 보기를 다시 살펴봐요."); }
        return;
      }
      if (R.kind === "cmp") {
        const g = R.sel === R.ans;
        [...R.row.children].forEach(b => { b.classList.remove("good", "bad"); if (b.textContent.trim() === R.sel) b.classList.add(g ? "good" : "bad"); });
        given.push(R.sel || "-");
        if (!g && !bad) bad = (it.why && it.why[R.sel]) || "두 수를 통분하거나, 분수를 소수로(소수를 분수로) 나타내어 다시 비교해 봐요.";
        return;
      }
      if (R.kind === "order") {
        const v = R.el.get(), g = v.length === R.ans.length && v.every((x, k) => x === R.ans[k]);
        R.el.paint(g); given.push(v.map(i => rd4Plain(R.labs[i])).join(">") || "-");
        if (!g && !bad) bad = "차례가 달라요. ‘다시’를 누르고 두 수씩 짝 지어 비교해 봐요.";
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
    if (bad) { api.fail(bad, given.join(" / ")); return false; }
    api.tryOnce();
    api.done(given.join(" / "), opt.ok || "정확하게 해결했어요!");
    return true;
  };
  auto = autoRun(ready, sign, run, rows.some(R => ["set", "n", "eq", "f"].includes(R.kind)) ? 900 : 260);
  if (opt.fig) body.append(opt.fig());
  body.append(wrap);
  return poke;
}

/* ② 계산 과정 빈칸 — 칸을 모두 채우고 고르면 저절로 확인
   rows: [ [parts…] | {t:"방법 1", p:[parts…]} ]
   part: "글([분수] 가능)" | {i:"3"} 칸(그대로 같아야 정답) | {q:[자연수, 분자, 분모]} 쌓은 분수(자리마다 고정 글·"?답"·배열 ["12÷","?2"]) | {f:"3/6", den, irr, red, from} 분수 입력(값 판정) | {c:[…], a} 고르기 | {ord:[…], asc} 차례 정하기
   수와 =만 있는 줄은 '='로 나눈 값이 모두 같은지 스스로 확인해요. */
function rd4Chain(body, api, rows, opt = {}) {
  rd4Style();
  let auto = () => {};
  const poke = () => auto();
  const ins = [], chs = [], ords = [], plains = [];
  const wrap = h("div");
  const ex = v => v == null ? "" : Array.isArray(v) ? v.map(ex).join("") : String(v)[0] === "?" ? String(v).slice(1) : String(v);
  const jsNum = v => ex(v).replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
  const jsStr = s => String(s).replace(rd4Re(), (m, w, n, d) => `(${w || 0}+(${n})/(${d}))`).replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
  const cell = v => {
    if (v == null) return null;
    if (Array.isArray(v)) return h("span", { style: "display:inline-flex;align-items:center;gap:.1em" }, v.map(cell));
    if (String(v)[0] === "?") { const b = rd4Box(String(v).slice(1)); ins.push(b); rd4Hook(b, poke); return b; }
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
        const b = rd4Box(pt.i); ins.push(b); rd4Hook(b, poke); line.append(b); plain += pt.i; js += `(${pt.i})`;
      } else if (pt.q) {
        const [W, N, D] = pt.q;
        line.append(h("span", { class: "rd4fr rd4frin" }, W != null ? h("span", { class: "rd4fw" }, cell(W)) : null, h("span", { class: "rd4q" }, h("span", { class: "rd4n" }, cell(N)), h("span", { class: "rd4d" }, cell(D)))));
        const en = ex(N), ed = ex(D);
        plain += /^\d+$/.test(en) && /^\d+$/.test(ed) ? rd4Plain(`[${W != null ? ex(W) + " " : ""}${en}/${ed}]`) : `${W != null ? ex(W) + "와 " : ""}${ed}분의 ${en}`;
        js += `(${W != null ? jsNum(W) : 0}+(${jsNum(N)})/(${jsNum(D)}))`;
      } else if (pt.f) {
        const fi = rd4In("답"); fi.it = Object.assign({ a: pt.f }, pt); ins.push(fi); fi.inputs.forEach(x => rd4Hook(x, poke)); line.append(fi);
        if (pt.from && !rd4Same(pt.from, pt.f)) throw new Error("답 확인 필요: " + pt.from + " = " + pt.f);
        if (pt.den && rd4ND(pt.f)[1] !== pt.den) throw new Error("분모 확인 필요: " + pt.f);
        plain += rd4Plain(rd4Tk(pt.f)); const v = rd4Val(pt.f); js += `(${v.num}/${v.den})`;
      } else if (pt.c) {
        const C = { a: pt.a, sel: null }; const sp = h("span", { class: "rd4chs" });
        pt.c.forEach((o, oi) => sp.append(h("button", { class: "opt", onclick: ev => { [...sp.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); C.sel = oi; poke(); } }, o)));
        C.el = sp; chs.push(C); line.append(sp); plain += pt.c[pt.a]; math = false;
      } else if (pt.ord) {
        const O = { ans: rd4Rank(pt.ord, pt.asc), labs: pt.ord, el: rd4OrderEl(pt.ord, poke) };
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
  const ready = () => {
    const full = ins.every(x => x.exp != null ? x.value.trim() !== "" : x.filled()) && chs.every(C => C.sel != null) && ords.every(O => O.el.get().length === O.labs.length);
    if (!full) return false;
    const m = opt.pre && opt.pre(); if (m) { api.hint(m); return false; }
    return true;
  };
  const sign = () => ins.map(x => x.exp != null ? x.value.trim() : x.text()).concat(chs.map(C => C.sel), ords.map(O => O.el.get().join("."))).join("§");
  const run = () => {
    let ok = true, msg = null; const given = [];
    ins.forEach(x => {
      if (x.exp != null) { const v = x.value.replace(/\s/g, ""), g = v === x.exp || (/^[\d.]+$/.test(v) && /^[\d.]+$/.test(x.exp) && rd4Val(v) && rd4Same(v, x.exp)); x.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; given.push(v || "-"); }
      else { const J = rd4JudgeF(x.get(), x.it); given.push(x.text()); x.paint(J.ok); if (!J.ok) { ok = false; msg = msg || J.msg; } }
    });
    chs.forEach(C => { [...C.el.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (i === C.sel) b.classList.add(C.sel === C.a ? "good" : "bad"); }); if (C.sel !== C.a) ok = false; given.push(C.sel == null ? "-" : C.el.children[C.sel].textContent); });
    ords.forEach(O => { const v = O.el.get(), g = v.length === O.ans.length && v.every((x, k) => x === O.ans[k]); O.el.paint(g); if (!g) { ok = false; msg = msg || "차례가 달라요. ‘다시’를 누르고 두 수씩 짝 지어 비교해 봐요."; } given.push(v.map(i => rd4Plain(O.labs[i])).join(">") || "-"); });
    if (!ok) { api.fail(msg || opt.bad || "빨간 칸을 다시 생각해 봐요.", given.join(",")); return false; }
    api.tryOnce(); api.done(given.join(","), opt.ok || "차례대로 잘 해결했어요!");
    return true;
  };
  auto = autoRun(ready, sign, run, ins.length ? 900 : 260);
  body.append(wrap);
  return poke;
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
/* 두 분수를 공통분모 D로 통분하는 줄(곱셈 과정까지): ([3/10], [7/15]) → ((3×15)/(10×15), (7×10)/(15×10)) = ([45/150], [70/150]) */
function rd4TongRow(a, b, D, tag) {
  const [na, da] = rd4ND(a), [nb, db] = rd4ND(b);
  if (D % da || D % db) throw new Error("공통분모 확인 필요: " + D);
  const ka = D / da, kb = D / db;
  const p = [`(${rd4Tk(a)}, ${rd4Tk(b)}) → (`, { q: [null, [`${na}×`, "?" + ka], [`${da}×`, "?" + ka]] }, ", ", { q: [null, [`${nb}×`, "?" + kb], [`${db}×`, "?" + kb]] }, ") = (", { q: [null, "?" + na * ka, "?" + D] }, ", ", { q: [null, "?" + nb * kb, "?" + D] }, ")"];
  return tag ? { t: tag, p } : p;
}

/* ③ 막대·원(파이·수박) 색칠하기: bars [{name, d, k, col}], shape "bar"|"pie", tip, ask·askCalc, ok */
function rd4Bars(body, api, opt) {
  rd4Style();
  const bars = opt.bars, pie = opt.shape === "pie", nb = bars.length;
  const st = bars.map(b => Array(b.d).fill(false));
  const cnt = i => st[i].filter(Boolean).length;
  const ready = () => bars.every((b, i) => cnt(i) === b.k);
  let poke = () => {};
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
          p.addEventListener("click", () => { st[i][c] = !st[i][c]; draw(); poke(); });
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
          r.addEventListener("click", () => { st[i][c] = !st[i][c]; draw(); poke(); });
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
  poke = rd4Then(ask, api, ready, Object.assign({ wait: () => { const i = bars.findIndex((b, k) => cnt(k) !== b.k); return i < 0 ? null : `먼저 ‘${rd4Plain(bars[i].name)}’만큼 알맞게 색칠해요. 지금 ${cnt(i)}칸이에요.`; } }, opt), (x, m) => api.done(x, m));
}

/* ④ 칸 수 바꾸기: bars [{name, v}] 같은 칸 수로 나눔, parts [칸 수…], start, need [찾아야 할 칸 수…]
   칸 수 단추를 누르면 색칠한 끝이 칸의 경계와 맞을 때 저절로 기록돼요.
   fold: true 이면 색종이를 반으로 계속 접었다 펴기(칸 수 2배씩, max까지) */
function rd4Split(body, api, opt) {
  rd4Style();
  const bars = opt.bars, V = bars.map(b => rd4Val(b.v)), nb = bars.length;
  const own = nb === 1 ? rd4ND(bars[0].v)[1] : null;
  let n = opt.start || V[0].den;
  const found = [];
  let poke = () => {};
  const aligned = k => V.every(v => (v.num * k) % v.den === 0);
  const fr = (i, k) => rd4F(V[i].num * k / V[i].den, k);
  const W = 900, fold = !!opt.fold;
  const LX = opt.lx || 210, BW = W - LX - 130, BH = 56, GP = 50, H = fold ? 380 : nb * (BH + GP) + 20;
  const svg = makeSvg(W, H);
  const readout = h("div", { class: "rd4tip" });
  const chips = h("div", { class: "rd4chips" });
  const tools = h("div", { class: "rd4tools" });
  const draw = () => {
    svg.innerHTML = "";
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
    chips.append(h("span", { class: "rd4lab" }, "찾은 분수: "));
    if (!found.length) chips.append(h("span", { class: "rd4log" }, "아직 없어요"));
    found.forEach(k => chips.append(h("span", { class: "rd4chip" }, bars.map((b, i) => fr(i, k)).join(", "))));
  };
  const record = () => {
    if (!aligned(n)) { api.hint(nb > 1 ? "두 막대의 색칠한 끝이 모두 칸의 경계와 맞아야 분수로 나타낼 수 있어요. 다른 칸 수로 나누어 봐요." : "색칠한 끝이 칸의 경계와 맞지 않아요. 그러면 분수로 딱 맞게 나타낼 수 없어요. 다른 칸 수로 나누어 봐요."); return; }
    if (n === own && !fold) { api.hint("처음 분수 그대로예요. 다른 칸 수로 나누어 봐요."); return; }
    if (found.includes(n)) { api.hint("이미 찾았어요. 다른 칸 수로도 나누어 봐요."); return; }
    found.push(n); draw();
    api.hint(nb > 1 ? `${n}칸으로 나누니 ${rd4J(bars.map((b, i) => fr(i, n)).join(", "), "이가")} 되었어요. 분모가 같아졌어요!` : `${rd4J(fr(0, n), "을를")} 찾았어요.`);
  };
  if (fold) {
    tools.append(h("button", { onclick: () => { if (n * 2 > (opt.max || 8)) return api.hint("이번에는 여기까지 접어요. 찾은 분수를 살펴봐요."); n *= 2; draw(); record(); poke(); } }, "반으로 한 번 더 접었다 펴기"),
      h("button", { onclick: () => { n = opt.start || V[0].den; draw(); } }, "처음 색종이로"));
  } else {
    tools.append(h("span", { class: "rd4lab" }, "똑같이 나누기:"));
    (opt.parts || []).forEach(k => tools.append(h("button", { "data-n": k, onclick: () => { n = k; draw(); record(); poke(); } }, `${k}칸`)));
  }
  draw();
  const need = opt.need || [];
  const ready = () => need.every(k => found.includes(k));
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || (fold ? "단추를 눌러 색종이를 반으로 접었다 펴요. 빨간색 부분을 분수로 나타내 봐요." : "칸 수 단추를 눌러 막대를 똑같이 나누어 봐요. 색칠한 끝이 칸의 경계와 딱 맞으면 그 분수가 저절로 기록돼요.")), tools, h("div", { class: "rd4stage" }, svg), readout, chips, ask);
  poke = rd4Then(ask, api, ready, Object.assign({ wait: () => { const k = need.find(x => !found.includes(x)); return k == null ? null : fold ? "색종이를 끝까지 접어 보며 분수를 모두 찾아요." : `아직 찾지 않은 분수가 있어요. ${k}칸으로도 나누어 봐요.`; } }, opt), (x, m) => api.done(x, m));
}

/* ⑤ 약분하기: v "16/40", divs [÷ 단추], once(한 번에 기약분수로) */
function rd4Reduce(body, api, opt) {
  rd4Style();
  const [n0, d0] = rd4ND(opt.v);
  let path = [{ n: n0, d: d0, k: null }], poke = () => {};
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
    if (rd4G(z.n, z.d) === 1) api.hint(opt.once && path.length > 2 ? `${rd4J(rd4F(z.n, z.d), "이가")} 되었어요. 이번에는 한 번에 나누어 ${rd4J(rd4F(z.n, z.d), "을를")} 만들어 봐요. ‘처음부터’를 눌러요.` : `${rd4F(z.n, z.d)}의 분모와 분자의 공약수는 1뿐이에요.`);
    else api.hint(`분모와 분자를 ${rd4J(String(k), "으로")} 나누었어요. 더 나눌 수 있을까요?`);
    poke();
  } }, `÷ ${k}`)));
  const reset = h("button", { onclick: () => { path = [path[0]]; draw(); } }, "처음부터");
  draw();
  const ready = () => rd4G(cur().n, cur().d) === 1 && (!opt.once || path.length === 2);
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "÷ 단추를 누르면 분모와 분자를 그 수로 나누어요. 분모와 분자의 공약수가 1뿐일 때까지 나누어 봐요."), nums, h("div", { class: "rd4tools" }, reset), chain, h("div", { class: "rd4stage" }, svg), ask);
  poke = rd4Then(ask, api, ready, Object.assign({ wait: () => opt.once && rd4G(cur().n, cur().d) === 1 ? "한 번에 나누어 기약분수를 만들어 봐요. 분모와 분자를 무엇으로 나누어야 할까요?" : "먼저 더 나눌 수 없을 때까지 분모와 분자를 공약수로 나누어요." }, opt), (x, m) => api.done(x, m));
}

/* ⑥ 크기가 같은 분수를 늘어놓고 분모가 같은 짝 찾기: a, b, m(몇 배까지) */
function rd4Common(body, api, opt) {
  rd4Style();
  const m = opt.m || 6, FS = [rd4ND(opt.a), rd4ND(opt.b)];
  const rows = FS.map(([n, d], r) => ({ n, d, cards: Array.from({ length: m }, (_, i) => ({ k: i + 1, n: n * (i + 1), d: d * (i + 1), r })) }));
  const dens = rows.map(R => R.cards.map(c => c.d));
  const targets = dens[0].filter(x => dens[1].includes(x));
  if (!targets.length) throw new Error("분모가 같은 짝이 없어요");
  let phase = "fill", pick = null, poke = () => {}; const found = [];
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
        if (c.el.classList.contains("rd4pr")) return;
        if (!pick || pick.r === c.r) { if (pick) pick.el.classList.remove("rd4pk"); pick = c; el.classList.add("rd4pk"); return; }
        const a = pick; pick = null; a.el.classList.remove("rd4pk");
        if (a.d !== c.d) { a.el.classList.add("rd4no"); c.el.classList.add("rd4no"); setTimeout(() => { a.el.classList.remove("rd4no"); c.el.classList.remove("rd4no"); }, 700); return api.hint(`분모가 ${a.d}, ${c.d}로 달라요. 분모가 같은 두 분수를 찾아요.`); }
        if (!found.includes(c.d)) found.push(c.d);
        a.el.classList.add("rd4pr"); c.el.classList.add("rd4pr");
        const A = a.r === 0 ? a : c, B = a.r === 0 ? c : a;
        pairs.append(h("span", { class: "rd4chip" }, `(${rd4F(A.n, A.d)}, ${rd4F(B.n, B.d)})`));
        api.hint(found.length >= targets.length ? "분모가 같은 짝을 모두 찾았어요!" : `분모가 ${c.d}로 같은 짝을 찾았어요. 또 있을까요?`);
        poke();
      });
      line.append(el);
    });
    box.append(line); wrap.append(box);
  });
  /* 분자 칸을 모두 채우면 저절로 확인 */
  const fillAuto = autoRun(() => phase === "fill" && inputs.every(i => i.value.trim() !== ""), () => inputs.map(i => i.value.trim()).join(","), () => {
    let ok = true;
    inputs.forEach(i => { const g = i.value.replace(/\s/g, "") === String(i.card.n); i.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g) ok = false; });
    if (!ok) { api.fail("빨간 칸을 다시 계산해요. 분모에 곱한 수(×2, ×3, …)를 분자에도 곱해요.", inputs.map(i => i.value.trim()).join(",")); return false; }
    phase = "pair"; inputs.forEach(i => { i.disabled = true; });
    info.textContent = "이제 위 줄에서 한 장, 아래 줄에서 한 장을 눌러 분모가 같은 분수의 짝을 모두 찾아요.";
    api.hint("크기가 같은 분수를 모두 만들었어요. 분모가 같은 짝을 찾아봐요.");
    return true;
  }, 900);
  inputs.forEach(i => rd4Hook(i, fillAuto));
  info.textContent = "분모에 곱한 수만큼 분자에도 곱하여 빈칸을 채워요. 다 채우면 저절로 확인해요.";
  const ask = h("div", { class: "rd4ask" });
  body.append(info, wrap, h("div", { class: "rd4chips" }, h("span", { class: "rd4lab" }, "찾은 짝: "), pairs), ask);
  const ready = () => phase === "pair" && targets.every(t => found.includes(t));
  poke = rd4Then(ask, api, ready, Object.assign({ wait: () => phase === "fill" ? "먼저 크기가 같은 분수의 분자를 모두 채워요." : "분모가 같은 짝을 모두 찾아요." }, opt), (x, m) => api.done(x, m));
}

/* ⑦ 분수 막대 + 세로 자: rows [1, 6, 9, 15], need ["3/9", "10/15"] (그 위치에 자를 놓아 봐야 함) */
function rd4Wall(body, api, opt) {
  rd4Style();
  const rows = opt.rows, L = rows.reduce((a, d) => rd4Lcm(a, d), 1);
  const W = 900, LX = 30, BW = 840, RH = 50, GP = 10, TOP = 44, H = TOP + rows.length * (RH + GP) + 10;
  const X = t => LX + BW * t / L;
  let t = 0, poke = () => {}; const seen = new Set();
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
  const at = p => Math.max(0, Math.min(L, Math.round((p.x - LX) / BW * L)));
  dragOn(svg, p => { t = at(p); draw(); }, p => { t = at(p); draw(); }, () => { seen.add(t); poke(); });
  draw();
  const need = (opt.need || []).map(s => { const v = rd4Val(s); return v.num * L / v.den; });
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "빨간 세로 자를 끌어 칸의 끝에 맞추면, 그 자리에서 끝이 맞는 분수가 색칠돼요."), h("div", { class: "rd4stage" }, svg), readout, ask);
  poke = rd4Then(ask, api, () => need.every(x => seen.has(x)), Object.assign({ wait: () => { const x = need.find(v => !seen.has(v)); return x == null ? null : `세로 자를 ${rd4Tk(opt.need[need.indexOf(x)])}의 끝에 놓아 봐요.`; } }, opt), (x, m) => api.done(x, m));
}

/* ⑧ 수직선에 놓기: max, t(1을 몇 칸으로), lab "dec"(눈금마다 소수), items [{name, v}] */
function rd4Place(body, api, opt) {
  rd4Style();
  const max = opt.max || 1, T = opt.t || 10, N = max * T, W = 900, X0 = 60, X1 = 840, Y = 130, H = 210, U = (X1 - X0) / N, X = k => X0 + k * U;
  const items = opt.items.map(it => { const v = rd4Val(it.v), k = v.num * T / v.den; if (!Number.isInteger(k) || k < 0 || k > N) throw new Error("수직선 확인 필요: " + it.v); return Object.assign({ k, at: null }, it); });
  let cur = 0, poke = () => {};
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
    api.hint(nx >= 0 ? `‘${it.name}’의 자리를 찾았어요. 남은 수도 놓아 봐요.` : "모두 알맞은 자리에 놓았어요. 어느 쪽이 더 오른쪽에 있나요?");
    poke();
  });
  draw();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "아래 단추로 수를 고른 다음, 수직선에서 그 수의 자리를 눌러요."), btns, h("div", { class: "rd4stage" }, svg), ask);
  poke = rd4Then(ask, api, () => items.every(it => it.at === it.k), Object.assign({ wait: "먼저 수직선에 수를 모두 놓아요." }, opt), (x, m) => api.done(x, m));
}

/* ⑨ 100칸 모눈 색칠: grids [{name, k}] (한 칸 = 1/100, 누른 칸까지 차례로 색칠) */
function rd4Hund(body, api, opt) {
  rd4Style();
  const G = opt.grids, C = 24, GW = 240, GAP = 80, W = G.length * GW + (G.length - 1) * GAP + 60, H = GW + 110;
  const cnt = G.map(() => 0);
  let poke = () => {};
  const svg = makeSvg(W, H);
  const draw = () => {
    svg.innerHTML = "";
    G.forEach((g, i) => {
      const x0 = 30 + i * (GW + GAP), y0 = 50;
      svg.append(rd4SvgLine(g.name, x0 + GW / 2, 24, 24));
      for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
        const idx = r * 10 + c;
        const rc = svgEl("rect", { x: x0 + c * C, y: y0 + r * C, width: C, height: C, fill: idx < cnt[i] ? RD4_F[i % 5] : "#fff", stroke: "#8A9A97", "stroke-width": 1, style: "cursor:pointer" });
        rc.addEventListener("click", () => { cnt[i] = cnt[i] === idx + 1 ? idx : idx + 1; draw(); poke(); });
        svg.append(rc);
      }
      svg.append(svgEl("rect", { x: x0, y: y0, width: GW, height: GW, fill: "none", stroke: INK, "stroke-width": 3, "pointer-events": "none" }));
      svg.append(rd4SvgLine(`색칠 ${cnt[i]}칸 = [${cnt[i]}/100]`, x0 + GW / 2, y0 + GW + 34, 21, { fill: cnt[i] === g.k ? "#2E8B57" : "#5B6B6B" }));
    });
  };
  draw();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "모눈 한 칸은 [1/100]이에요. 칸을 누르면 첫 칸부터 그 칸까지 색칠돼요(같은 칸을 한 번 더 누르면 한 칸 지워져요)."), h("div", { class: "rd4stage" }, svg), ask);
  poke = rd4Then(ask, api, () => G.every((g, i) => cnt[i] === g.k), Object.assign({ wait: () => { const i = G.findIndex((g, k) => cnt[k] !== g.k); return i < 0 ? null : `먼저 ‘${rd4Plain(G[i].name)}’만큼 색칠해요. 지금 ${cnt[i]}칸이에요.`; } }, opt), (x, m) => api.done(x, m));
}

/* ⑩ 나누어 놓기: bins [이름…], cards [{t, b, why}] — 카드를 모두 놓으면 저절로 확인 */
function rd4Sort(body, api, opt) {
  rd4Style();
  const cards = opt.cards, place = cards.map(() => null);
  let sel = null;
  const pool = h("div", { class: "rd4pool" }), bins = h("div", { class: "rd4bins" });
  const lists = opt.bins.map(() => h("div", { class: "rd4binl" }));
  const run = () => {
    let bad = null;
    cards.forEach((c, i) => { const g = place[i] === c.b; btn[i].classList.remove("good", "bad"); btn[i].classList.add(g ? "good" : "bad"); if (!g && !bad) bad = c.why || `‘${rd4Plain(c.t)}’ 카드를 다시 살펴봐요.`; });
    const given = opt.bins.map((nm, b) => cards.filter((c, i) => place[i] === b).map(c => rd4Plain(c.t)).join("·")).join(" / ");
    if (bad) { api.fail(bad + " 빨간 카드를 눌러 다시 놓아 봐요.", given); return false; }
    api.tryOnce(); api.done(given, opt.ok || "모두 알맞게 나누었어요!");
    return true;
  };
  const auto = autoRun(() => place.every(p => p != null), () => place.join(","), run, 1200);
  const btn = cards.map((c, i) => h("button", { class: "opt", onclick: () => {
    if (place[i] != null) { place[i] = null; sel = null; return draw(); }
    sel = sel === i ? null : i; draw();
  } }, c.t));
  opt.bins.forEach((nm, b) => bins.append(h("div", { class: "rd4bin" }, h("button", { class: "rd4binh", onclick: () => {
    if (sel == null) return api.hint("먼저 위의 카드를 하나 눌러요.");
    place[sel] = b; sel = null; draw(); auto();
  } }, nm + " ▼"), lists[b])));
  const draw = () => {
    pool.innerHTML = ""; lists.forEach(l => { l.innerHTML = ""; });
    cards.forEach((c, i) => { if (place[i] == null) btn[i].classList.remove("good", "bad"); btn[i].classList.toggle("rd4sel", sel === i); (place[i] == null ? pool : lists[place[i]]).append(btn[i]); });
    if (!pool.children.length) pool.append(h("span", { class: "rd4log" }, "카드를 모두 놓았어요. 저절로 확인해요."));
  };
  draw();
  api.provide({ words: opt.words || [], answers: opt.bins.map((nm, b) => `${rd4Plain(nm)}: ${cards.filter(c => c.b === b).map(c => rd4Plain(c.t)).join(", ")}`) });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "카드를 누른 다음, 알맞은 칸의 제목을 눌러 옮겨요. 놓은 카드를 누르면 다시 위로 돌아와요."), pool, bins);
}

/* ⑪ 수 카드로 분수 만들기: nums [분자…], cards [분모로 쓸 수 카드…] → 가장 큰 분수 찾기 */
function rd4Cards(body, api, opt) {
  rd4Style();
  const nums = opt.nums, cards = opt.cards, slot = nums.map(() => null);
  let sel = null, solved = false, poke = () => {};
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
        if (j !== big) { ev.currentTarget.classList.add("bad"); return api.fail(rd4Explain(f, fr[big]) + " 두 분수씩 짝 지어 통분해 봐요.", rd4Plain(rd4Tk(f))); }
        ev.currentTarget.classList.add("good"); solved = true;
        const ord = rd4Rank(fr, true);
        log.innerHTML = "";
        [[0, 1], [1, 2], [0, 2]].forEach(([x, y]) => log.append(h("p", { class: "rd4log" }, rd4Explain(fr[x], fr[y]))));
        log.append(h("p", { class: "rd4tip" }, `${ord.map(i => rd4Tk(fr[i])).join(" < ")} → 가장 큰 분수는 ${rd4J(rd4Tk(fr[big]), "이에요")}.`));
        api.hint("가장 큰 분수를 찾았어요!");
        poke();
      } }, rd4Tk(f))));
      pickBox.append(row);
    }
  };
  draw();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, opt.tip || "수 카드를 누른 다음 분모 자리(□)를 눌러 분수를 만들어요. 분모 자리를 다시 누르면 카드가 돌아와요."),
    h("div", { class: "rd4row" }, h("div", { class: "rd4rowt" }, "수 카드"), cardRow), h("div", { class: "rd4row" }, h("div", { class: "rd4rowt" }, "만든 분수"), fracRow), pickBox, log,
    h("div", { class: "rd4tools" }, h("button", { onclick: () => { if (solved) return; slot.fill(null); sel = null; log.innerHTML = ""; draw(); } }, "다시 만들기")), ask);
  poke = rd4Then(ask, api, () => solved, Object.assign({ doneText: "가장 큰 분수 찾기" }, opt), (x, m) => api.done(x, m));
}

/* ===== 놀이 ===== */
let RD4_MY = null;   // '카드 만들기'에서 만든 내 카드 4장
/* 카드 만들기: 진분수 2장(분모 2~9), 1보다 작은 소수 한 자리 수, 1보다 작은 소수 두 자리 수 — 네 칸을 다 쓰면 저절로 확인 */
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
  const run = () => {
    const v1 = d1.value.trim(), v2 = d2.value.trim();
    const bad = chkF(f1, 1) || chkF(f2, 2) || (!/^0\.[1-9]$/.test(v1) ? "③번 카드는 0.1부터 0.9까지의 소수 한 자리 수로 써요." : null) || (!/^0\.\d[1-9]$/.test(v2) ? "④번 카드는 0.01부터 0.99까지의 소수 두 자리 수로 써요(예: 0.45)." : null);
    [f1, f2].forEach((fi, k) => fi.paint(!chkF(fi, k + 1)));
    d1.style.borderColor = /^0\.[1-9]$/.test(v1) ? "var(--ok)" : "var(--no)"; d2.style.borderColor = /^0\.\d[1-9]$/.test(v2) ? "var(--ok)" : "var(--no)";
    if (bad) { api.fail(bad, [f1.text(), f2.text(), v1, v2].join(", ")); return false; }
    const a = f1.get(), b = f2.get();
    RD4_MY = [rd4F(a.n, a.d), rd4F(b.n, b.d), v1, v2];
    show.innerHTML = ""; RD4_MY.forEach(c => show.append(h("span", { class: "rd4card" }, c, h("small", {}, "내 카드"))));
    api.tryOnce(); api.done(RD4_MY.join(", "), "카드를 완성했어요! 이 카드로 놀이를 해요.");
    return true;
  };
  const auto = autoRun(() => f1.filled() && f2.filled() && d1.value.trim() !== "" && d2.value.trim() !== "", () => [f1.text(), f2.text(), d1.value.trim(), d2.value.trim()].join("§"), run, 900);
  [...f1.inputs, ...f2.inputs, d1, d2].forEach(x => rd4Hook(x, auto));
  body.append(h("p", { class: "rd4tip" }, "빈 카드 4장에 내가 놀이에 쓸 수를 자유롭게 써넣어요. 네 장을 다 쓰면 저절로 확인해요."), grid, show);
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
/* 손가락 접어! 나와 가게 친구 3명, 모두의 카드 24장을 섞어 한 판에 한 장씩 — 끝까지 하면 통과 */
function rd4Game(body, api, opt) {
  rd4Style();
  const P = ["나", "지우", "도윤", "수아"], PN = ["내", "지우의", "도윤이의", "수아의"], PT = ["나는", "지우는", "도윤이는", "수아는"];
  const others = [["[3/4]", "0.2", "[5/6]", "0.55", "[2/5]", "0.9"], ["[1/3]", "0.8", "[5/9]", "0.35", "[3/7]", "0.68"], ["[4/5]", "0.1", "[2/9]", "0.64", "[5/8]", "0.4"]];
  let deck, fingers, round, total, hands, cond, pick, phase, done = false, poke = () => {};
  const top = h("div", { class: "rd4tip" }), say = h("div"), grid = h("div", { class: "rd4players" }), ctl = h("div", { class: "rd4tools" }), log = h("div");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const should = i => i !== cond.by && rd4Cmp(hands[i], cond.v) === (cond.sign === ">" ? 1 : -1);
  const word = s => s === ">" ? "큰" : "작은";
  const condText = () => `${cond.v}보다 ${word(cond.sign)} 수를 가지고 있는 사람 모두 손가락 하나 접어!`;
  function start() {
    const my = (RD4_MY || ["[2/3]", "[3/8]", "0.6", "0.45"]).concat(["[1/2]", "0.75"]);
    deck = shuffle([...my, ...others.flat()]); total = Math.floor(deck.length / 4);
    fingers = [5, 5, 5, 5]; round = 0; log.innerHTML = ""; deal();
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
    say.innerHTML = ""; say.append(h("div", { class: "rd4say" }, `놀이 끝! 펼친 손가락이 가장 많은 사람: ${win.join(", ")} (${mx}개). ${win.includes("나") ? "축하해요!" : "새 판에서는 조건을 더 잘 만들어 봐요."}`));
    poke();
  }
  function render() {
    top.textContent = phase === "end" ? "놀이가 끝났어요." : `${round + 1}번째 판 (모두 ${total}판) · ${P[round % 4]} 차례`;
    grid.innerHTML = "";
    P.forEach((p, i) => {
      const el = h("button", { class: "rd4pl" + (i === 0 ? " rd4me" : "") + (pick && pick.has(i) ? " rd4pk" : "") + (cond && cond.by === i ? " rd4spk" : ""), onclick: () => {
        if (phase !== "pick") return;
        if (cond.by === i) return api.hint("조건을 말한 사람은 손가락을 접지 않아요.");
        pick.has(i) ? pick.delete(i) : pick.add(i); render();
      } }, h("span", { class: "rd4pn" }, p + (cond && cond.by === i ? " (조건을 말함)" : "")), rd4Hand(fingers[i]), h("span", { class: "rd4pc" }, phase === "end" ? "​" : hands[i]));
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
  poke = rd4Then(ask, api, () => done, Object.assign({ doneText: "손가락 접어! 놀이 끝" }, opt), (x, m) => api.done(x, m));
}
/* 통분 놀이: 카드 2장(분모 2~9 진분수)을 두 분모의 최소공배수로 통분, need점 모으기 — 두 칸을 다 쓰면 저절로 확인 */
function rd4Tong(body, api, opt) {
  rd4Style();
  const need = opt.need || 4;
  let score = 0, A, B, L, last = "", poke = () => {};
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
  const run = () => {
    if (score >= need) return true;
    const ra = fa.get(), rb = fb.get();
    const ja = rd4JudgeF(ra, { a: rd4F(A[0], A[1]), den: L, from: rd4F(A[0], A[1]) }), jb = rd4JudgeF(rb, { a: rd4F(B[0], B[1]), den: L, from: rd4F(B[0], B[1]) });
    fa.paint(ja.ok); fb.paint(jb.ok);
    if (!ja.ok || !jb.ok) {
      const r = !ja.ok ? ra : rb, F = !ja.ok ? A : B;
      const sameVal = !r.err && r.hasF && rd4Same(rd4Key(r), rd4F(F[0], F[1]));
      api.hint(sameVal ? `값은 같아요. 그런데 공통분모는 ${rd4J(String(A[1]), "과와")} ${B[1]}의 최소공배수 ${rd4J(String(L), "이에요")}.` : (!ja.ok ? ja.msg : jb.msg) || "두 분모의 최소공배수를 구하고, 분모에 곱한 수만큼 분자에도 곱해요.");
      return false;
    }
    score++;
    log.prepend(h("p", { class: "rd4log" }, `(${rd4F(A[0], A[1])}, ${rd4F(B[0], B[1])}) → (${rd4F(A[0] * L / A[1], L)}, ${rd4F(B[0] * L / B[1], L)}) 1점!`));
    if (score >= need) { sc.textContent = `점수 ${score}점 / ${need}점 — 놀이 끝!`; fa.inputs.concat(fb.inputs).forEach(x => { x.disabled = true; }); poke(); return true; }
    api.hint("맞아요! 1점. 새 카드 2장이에요."); gen();
    return false;
  };
  const auto = autoRun(() => fa.filled() && fb.filled(), () => `${score}|${last}|${fa.text()}|${fb.text()}`, run, 900);
  fa.inputs.concat(fb.inputs).forEach(x => rd4Hook(x, auto));
  gen();
  const ask = h("div", { class: "rd4ask" });
  body.append(h("p", { class: "rd4tip" }, "뒤집은 카드 2장을 두 분모의 최소공배수를 공통분모로 하여 통분해요. 두 칸을 다 쓰면 저절로 확인하고, 옳게 통분하면 1점이에요."), sc, cardsEl, eq, log, ask);
  poke = rd4Then(ask, api, () => score >= need, Object.assign({ doneText: `통분 놀이 ${need}점` }, opt), (x, m) => api.done(x, m));
}

/* ===== 그림 (이야기 버전, 앞글자 rd4s) ===== */
function rd4sNote(title, lines) { return h("div", { class: "rd4note" }, h("div", { class: "rd4notet" }, title), h("ul", {}, ...lines.map(l => h("li", {}, l)))); }
/* 우리 반 과일 가게 */
function rd4sShopFig() {
  const s = makeSvg(900, 330);
  s.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 330, fill: "#FFF8EC" }));
  s.append(svgEl("rect", { x: 0, y: 284, width: 900, height: 46, fill: "#E8DCC4" }));
  for (let k = 0; k < 12; k++) s.append(svgEl("path", { d: `M${k * 75},70 h75 v34 q-37.5,22 -75,0 z`, fill: k % 2 ? "#fff" : "#F4A9A0", stroke: "#C8472E", "stroke-width": 1.5 }));
  s.append(svgEl("rect", { x: 250, y: 12, width: 400, height: 50, rx: 14, fill: "#2E8B57" }));
  s.append(txt(450, 38, "5학년 3반 알록달록 과일 가게", 26, { fill: "#fff" }));
  s.append(svgEl("rect", { x: 30, y: 200, width: 840, height: 84, rx: 8, fill: "#F7E3C3", stroke: "#8A7A66", "stroke-width": 2.5 }));
  /* 수박 반 통 */
  s.append(svgEl("path", { d: "M70,200 a70,70 0 0 0 140,0 z", fill: "#3E8E41" }), svgEl("path", { d: "M80,200 a60,60 0 0 0 120,0 z", fill: "#F05A5A" }));
  [[110, 220], [140, 232], [170, 220]].forEach(([x, y]) => s.append(svgEl("ellipse", { cx: x, cy: y, rx: 3, ry: 5, fill: "#222" })));
  /* 사과 파이(6조각) */
  s.append(svgEl("circle", { cx: 310, cy: 172, r: 52, fill: "#E9B872", stroke: "#B07A3A", "stroke-width": 3 }));
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; s.append(svgEl("line", { x1: 310, y1: 172, x2: 310 + 52 * Math.cos(a), y2: 172 + 52 * Math.sin(a), stroke: "#B07A3A", "stroke-width": 2 })); }
  /* 주스 컵 두 개 */
  [[440, "#F28B82", .75], [520, "#A9D8A2", .5]].forEach(([x, c, f]) => {
    s.append(svgEl("rect", { x, y: 196 - 90 * f, width: 56, height: 90 * f, fill: c }));
    s.append(svgEl("path", { d: `M${x},100 L${x},196 L${x + 56},196 L${x + 56},100`, fill: "none", stroke: INK, "stroke-width": 3 }));
  });
  /* 바나나·귤 */
  s.append(svgEl("path", { d: "M630,150 q50,60 110,10 q-50,30 -110,-10 z", fill: "#F6D44A", stroke: "#B08A1A", "stroke-width": 2.5 }));
  [[790, 178], [830, 178], [810, 150]].forEach(([x, y]) => s.append(svgEl("circle", { cx: x, cy: y, r: 20, fill: "#F59E2E", stroke: "#C4721A", "stroke-width": 2 })));
  /* 가격표 */
  [[140, "수박"], [310, "사과 파이"], [480, "주스 바"], [690, "바나나"], [810, "귤"]].forEach(([x, t]) => {
    s.append(svgEl("rect", { x: x - 52, y: 236, width: 104, height: 36, rx: 6, fill: "#fff", stroke: "#8A7A66", "stroke-width": 2 }));
    s.append(txt(x, 255, t, 19, { fill: "#4A3B2A" }));
  });
  return h("div", { class: "rd4stage" }, s);
}
/* 크기가 같은 컵 여러 개에 주스를 담은 그림: list [{f:"2/3", name:"딸기"}] (눈금은 분모만큼 똑같이 나눔) */
function rd4sCups(list) {
  return () => {
    const n = list.length, W = 900, s = makeSvg(W, 360);
    const cols = ["#F28B82", "#A9D8A2", "#F6C08A", "#D7B5E6"];
    list.forEach((o, i) => {
      const [nn, d] = rd4ND(o.f), w = 150, x = W / n * (i + .5) - w / 2, y0 = 40, hh = 230, top = y0 + hh * (1 - nn / d);
      s.append(svgEl("rect", { x, y: top, width: w, height: y0 + hh - top, fill: cols[i % 4] }));
      for (let k = 1; k < d; k++) s.append(svgEl("line", { x1: x, y1: y0 + hh * k / d, x2: x + 24, y2: y0 + hh * k / d, stroke: "#5B6B6B", "stroke-width": 2 }));
      s.append(svgEl("path", { d: `M${x},${y0 - 10} L${x},${y0 + hh} L${x + w},${y0 + hh} L${x + w},${y0 - 10}`, fill: "none", stroke: INK, "stroke-width": 4 }));
      s.append(rd4SvgLine(`${o.name} ${rd4Tk(o.f)}컵`, x + w / 2, y0 + hh + 40, 24));
    });
    return h("div", { class: "rd4stage" }, s);
  };
}

//@@LESSONS
const UNIT_STORY = { title: "우리 반 과일 가게 놀이", lines: [
  "새봄초등학교 5학년 3반은 ‘알록달록 과일 가게 놀이’를 열기로 했어요. 가게 대표 지우, 주스 바를 맡은 도윤, 가격표 담당 수아, 과일 자르기 담당 건우, 장부 담당 채린이가 가게를 준비해요.",
  "파이와 수박을 똑같이 나누며 크기가 같은 분수를 만들고, 판매 기록을 약분하여 간단하게 적고, 분모가 다른 주스의 양을 통분하여 비교하고, 분수와 소수로 쓴 가격표의 무게를 견주어요.",
  "가게를 여는 날에는 ‘손가락 접어!’ 놀이를 하고, 정산을 마친 뒤 배운 것을 발표해요."],
  one: "우리 반 과일 가게 놀이 · 파이를 나누고 주스 양을 견주며 약분과 통분으로 분수와 소수의 크기를 비교해요." };
const UNIT_KEYWORDS = ["크기가 같은 분수", "분모와 분자에 같은 수를 곱하기", "분모와 분자를 같은 수로 나누기", "0이 아닌 같은 수", "공약수", "최대공약수", "약분", "기약분수", "통분", "공통분모", "두 분모의 곱", "공배수", "최소공배수", "분수를 소수로", "소수를 분수로", "1/2을 기준으로"];

/* ===== 4. 약분과 통분 — 이야기 버전 (11차시) ===== */
/* 1/2 기준 분류 카드: 분자를 2배 한 수와 분모를 비교 */
const rd4HalfCard = (lab, f) => { const [n, d] = rd4ND(f); if (2 * n === d) throw new Error("1/2과 같은 분수"); return { t: `${lab} ${rd4Tk(f)} km`, b: 2 * n > d ? 1 : 0, why: `${lab}: 분자 ${n}을(를) 2배 한 ${2 * n}${2 * n > d ? "은(는) 분모 " + d + "보다 커요. 그래서 [1/2] km보다 멀어요." : "은(는) 분모 " + d + "보다 작아요. 그래서 [1/2] km보다 가까워요."}`.replace(/(\d+)을\(를\)/, (m, x) => rd4J(x, "을를")).replace(/(\d+)은\(는\)/, (m, x) => rd4J(x, "은는")) }; };
/* 조건에 맞는 분수 세기 */
const rd4Count = (den, ok) => { let c = 0; for (let k = 1; k < den; k++) if (ok(k)) c++; return c; };

const LESSONS = [
{
  id: "s1", no: 1, title: "우리 반 과일 가게 놀이를 준비해요", soop: "개념 찾기(S)",
  question: "과일 가게 놀이를 준비할 때 분수는 어디에 쓰일까요?",
  summary: "과일을 똑같이 나누고, 판매 기록을 적고, 주스의 양과 과일의 무게를 비교할 때 분수와 소수를 써요. 분모가 달라도 크기가 같은 분수가 있어요. 이 단원에서는 크기가 같은 분수를 만들고, 분수를 간단하게 나타내는 약분과 분모를 같게 하는 통분을 배워 분수와 소수의 크기를 비교해요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "새봄초등학교 5학년 3반은 다음 주에 ‘알록달록 과일 가게 놀이’를 열어요. 가게 대표 지우가 준비 회의에서 가게 그림과 준비 메모를 보여 주었어요. 세 칸에 내 생각을 써서 붙여요.", hints: ["메모에서 분수와 소수가 나오는 곳을 찾아봐요.", "조각 수가 다른데 양이 같은지, 분모가 다른 두 분수 중 어느 것이 큰지 궁금한 점을 떠올려 봐요."],
      render: (b, a) => { b.append(rd4sShopFig(), rd4sNote("📝 과일 가게 준비 메모", [
          "건우: 수박 한 통을 똑같이 8조각으로 잘라 4조각을 팔았어요. ‘수박 반 통 팔림’이라고 써도 될까요?",
          "수아: 사과 파이를 우리 모둠은 6조각 중 3조각, 옆 모둠은 2조각 중 1조각 먹었대요.",
          "도윤: 같은 컵에 딸기 주스 [3/4]컵, 키위 주스 [2/3]컵을 담았어요. 어느 주스가 더 많을까요?",
          "채린: 딸기 24팩 중 18팩이 팔렸어요. 장부에 [18/24]이라고 쓰니 너무 복잡해요.",
          "지우: 가격표에 바나나는 [3/5] kg, 포도는 0.7 kg이라고 쓰여 있어요."]));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "그림과 메모에서 ~이 보여요", hint: "그림과 메모에서 보이는 것", ex: ["수박 8조각 중 4조각을 팔았다고 쓰여 있어요.", "딸기 주스는 [3/4]컵, 키위 주스는 [2/3]컵이라고 쓰여 있어요."] },
          { t: "생각해요", e: "💭", ph: "~은 ~일 것 같아요", hint: "메모를 보고 든 생각", ex: ["수박 8조각 중 4조각은 반 통과 양이 같을 것 같아요.", "분모가 달라서 딸기 주스와 키위 주스 중 어느 것이 많은지 바로 알기 어려울 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 할까?", hint: "가게를 준비하며 궁금한 것", ex: ["장부에 쓴 분수를 더 간단한 분수로 나타낼 수 있을까?", "분모가 다른 분수나 분수와 소수는 어떻게 크기를 비교할까?"] }],
          { ok: "과일 가게 준비 속에 분수가 가득해요! 이 단원에서 하나씩 해결 방법을 찾아봐요." }); } },
    { name: "그려 보기 — 수박 조각 색칠하기", inst: "건우가 크기가 같은 수박 두 통을 잘랐어요. 한 통은 똑같이 8조각으로 나누어 4조각을, 다른 한 통은 똑같이 2조각으로 나누어 1조각을 팔았어요. 판 만큼 색칠해 보세요.", hints: ["첫째 수박은 8조각 중 4조각을 색칠해요.", "둘째 수박은 2조각 중 1조각을 색칠해요. 두 수박의 색칠한 부분을 견주어 봐요."],
      render: thenWhy((b, a) => rd4Bars(b, a, { shape: "pie", bars: [{ name: "8조각 중 4조각", d: 8, k: 4 }, { name: "2조각 중 1조각", d: 2, k: 1, col: 4 }],
        askCalc: [{ q: "판 수박의 양을 비교해 보세요.", pick: ["8조각 중 4조각이 더 많아요.", "2조각 중 1조각이 더 많아요.", "판 양이 같아요."], a: 2, why: { "0": "조각 수가 많다고 양이 많은 것은 아니에요. 색칠한 부분의 크기를 견주어 봐요.", "1": "한 조각이 크다고 판 양이 더 많은 것은 아니에요. 색칠한 부분의 크기를 견주어 봐요." } },
          { q: "판 양을 분수로 나타내면?", pick: ["[4/8]와 [1/2]", "[4/8]와 [1/4]", "[8/4]과 [2/1]"], a: 0, why: { "1": "2조각 중 1조각은 [1/2]이에요.", "2": "분모는 전체를 똑같이 나눈 수, 분자는 판 조각 수예요." } }],
        ok: "[4/8]와 [1/2]은 분모와 분자는 달라도 크기가 같아요." }),
        { q: "조각 수가 다른데 판 수박의 양이 같은 까닭을 써 보세요.", ph: "8조각 중 4조각은 ~", help: ["① 8조각 중 4조각이 수박 한 통의 얼마만큼인지 생각해요. → ② 2조각 중 1조각과 견주어요.", "‘8조각 중 4조각은 한 통의 ~이고, 2조각 중 1조각도 ~이라서 양이 같아요.’ 꼴로 써요."],
          ans: "8조각 중 4조각은 수박 한 통의 절반이고, 2조각 중 1조각도 한 통의 절반이라서 판 양이 같아요. 조각이 작아진 만큼 조각 수가 많아졌어요." }) },
    { name: "말해 보기 — 나누고 견주어 본 경험", inst: "음식을 똑같이 나누어 본 경험과, 분모가 다른 두 분수의 크기를 견주어 본 경험을 떠올려 써 보세요.", hints: ["피자, 케이크, 과일을 친구나 가족과 똑같이 나누어 본 적이 있나요?", "물병이나 우유갑에 남은 양을 견주어 본 적이 있나요?"],
      render: (b, a) => writeStep(b, a, [
        { q: "음식을 똑같이 나누어 먹거나 담아 본 경험을 써 보세요.", tag: "나누기", ph: "예: 피자 한 판을 8조각으로 나누어 친구와 4조각씩 먹었어요.", help: ["① 무엇을 몇 조각으로 똑같이 나누었는지 써요. → ② 몇 명이 몇 조각씩 먹었는지 써요.", "‘○○을 □조각으로 똑같이 나누어 △명이 ☆조각씩 먹었어요.’ 꼴로 써요."], ans: "케이크 한 개를 똑같이 6조각으로 잘라 가족 3명이 2조각씩 먹었어요. 한 사람이 케이크의 [2/6]만큼 먹은 셈이에요." },
        { q: "분모가 다른 두 분수의 크기를 견주어 본 경험을 써 보세요.", tag: "분수 비교", ph: "예: 우유가 2분의 1만큼, 3분의 2만큼 남은 두 병을 견주어 봤어요.", help: ["① 무엇의 양을 견주었는지 써요. → ② 어떻게 견주었는지(눈으로, 그림으로) 써요.", "‘○○이 □만큼, △만큼 남아서 ~으로 견주어 보았어요.’ 꼴로 써요."], ans: "물통 두 개에 물이 [1/2]만큼, [3/4]만큼 남아 있어서 물의 높이를 눈으로 견주어 [3/4]만큼 남은 물통이 더 많다고 생각했어요." }]) },
    { name: "약속하기 — 이 단원에서 배울 것", inst: "지우가 단원의 차례를 넘겨 보며 배울 내용을 살펴봐요. 알맞은 것을 골라 보세요.", hints: ["이 단원은 약분과 통분 단원이에요.", "분수를 간단하게 나타내는 것은 약분, 분모를 같게 나타내는 것은 통분이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "이 단원에서 배울 내용을 모두 고르세요.", o: ["크기가 같은 분수 알아보기·만들기", "약분과 기약분수", "통분과 공통분모", "분수와 소수의 크기 비교", "분수의 곱셈"], a: [0, 1, 2, 3], why: { "4": "분수의 곱셈은 5학년 2학기에 배워요." } },
        { q: "채린이의 장부에 적힌 [18/24]처럼 분모와 분자가 큰 분수를 간단하게 나타내는 것과 관계있는 것은?", o: ["분수를 간단하게 나타내기(약분)", "분모를 같게 나타내기(통분)"], a: 0, why: { "1": "통분은 분모가 다른 분수의 분모를 같게 나타내는 것이에요." } },
        { q: "딸기 주스 [3/4]컵과 키위 주스 [2/3]컵의 양을 견주려면 무엇이 필요할까요?", o: ["두 분수의 분모를 같게 나타내기(통분)", "두 분수의 분자끼리 더하기"], a: 0, why: { "1": "분자끼리 더해도 어느 주스가 더 많은지 알 수 없어요." } }],
        { ok: "약분과 통분을 공부할 준비가 되었어요." }) },
    { name: "확인하기 — 배운 내용 떠올리기", inst: "이 단원에서 쓸 내용을 떠올려 풀어 보세요(3학년 분수와 소수, 5학년 2단원 약수와 배수). 다 쓰면 저절로 확인해요.", hints: ["소수 한 자리 수는 분모가 10인 분수로 나타낼 수 있어요. 0.6은 [1/10]이 6개예요.", "최대공약수는 공약수 중에서 가장 큰 수, 최소공배수는 공배수 중에서 가장 작은 수예요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "0.6을 분수로 나타내 보세요.", a: "6/10", den: 10 },
        { q: "[7/10]을 소수로 나타내 보세요.", n: 0.7 },
        { q: "분모가 같은 분수의 크기를 비교해 보세요.", cmp: ["[4/9]", "[7/9]"] },
        { q: "소수의 크기를 비교해 보세요.", cmp: ["0.45", "0.5"], why: { ">": "0.45의 자리 수가 많다고 더 큰 수가 아니에요. 소수 첫째 자리 4와 5를 먼저 비교해요." } },
        { q: "18과 24의 최대공약수를 구해 보세요.", n: 6, chk: () => rd4G(18, 24), why: { "2": "2도 공약수이지만 가장 큰 공약수를 찾아요.", "3": "3도 공약수이지만 가장 큰 공약수를 찾아요." } },
        { q: "6과 9의 최소공배수를 구해 보세요.", n: 18, chk: () => rd4Lcm(6, 9), why: { "54": "54도 공배수이지만 가장 작은 공배수를 찾아요." } }],
        { ok: "배운 내용을 잘 기억하고 있어요. 이 단원에서는 공약수로 약분하고, 공배수로 통분해요." }) }
  ],
  challenge: { inst: "★ 도전 — 배운 내용을 한 번 더 떠올려 보세요.", hints: ["소수 두 자리 수는 분모가 100인 분수로 나타내요.", "20과 30의 공약수는 1, 2, 5, 10이에요."], render: (b, a) => rd4Calc(b, a, [
    { q: "0.35를 분수로 나타내 보세요.", a: "35/100", den: 100 },
    { q: "[9/100]를 소수로 나타내 보세요.", n: 0.09, why: { "0.9": "[9/100]는 [1/100]이 9개예요. 소수 둘째 자리 수예요." } },
    { q: "분모가 같은 분수의 크기를 비교해 보세요.", cmp: ["[11/12]", "[5/12]"] },
    { q: "20과 30의 최대공약수를 구해 보세요.", n: 10, chk: () => rd4G(20, 30) },
    { q: "8과 12의 최소공배수를 구해 보세요.", n: 24, chk: () => rd4Lcm(8, 12), why: { "96": "96도 공배수이지만 가장 작은 공배수를 찾아요." } },
    { q: "소수의 크기를 비교해 보세요.", cmp: ["1.4", "1.38"], why: { "<": "자연수 부분이 같으면 소수 첫째 자리 4와 3을 먼저 비교해요." } }],
    { ok: "준비 완료! 약분과 통분을 배울 수 있어요." }) }
},
{
  id: "s2", no: 2, title: "사과 파이를 나누어요 ― 크기가 같은 분수", soop: "개념 구축하기(O)",
  question: "조각 수가 달라도 같은 양이라고 할 수 있을까요?",
  summary: "분모와 분자는 달라도 크기가 같은 분수가 있어요. 분수만큼 그림에 색칠했을 때 색칠한 부분의 크기가 같으면 크기가 같은 분수예요. [1/3]과 [2/6], [2/3], [4/6], [8/12], [3/4]과 [6/8], [9/12]는 크기가 같은 분수예요.",
  steps: [
    { name: "만져 보기 — 사과 파이 나누기", inst: "건우가 크기가 같은 사과 파이 두 판을 구웠어요. 수아는 똑같이 3조각으로 나눈 파이에서 1조각을, 채린이는 똑같이 6조각으로 나눈 파이에서 2조각을 접시에 담았어요. 담은 만큼 색칠해 보세요.", hints: ["수아의 파이는 3조각 중 1조각을 색칠해요.", "채린이의 파이는 6조각 중 2조각을 색칠해요. 색칠한 부분의 크기를 견주어 봐요."],
      render: (b, a) => rd4Bars(b, a, { shape: "pie", bars: [{ name: "수아 [1/3]", d: 3, k: 1 }, { name: "채린 [2/6]", d: 6, k: 2 }],
        askCalc: [{ q: "수아와 채린이가 담은 파이의 양을 비교해 보세요.", pick: ["수아가 더 많이 담았어요.", "채린이가 더 많이 담았어요.", "두 사람이 담은 양은 같아요."], a: 2, why: { "0": "한 조각이 크다고 더 많이 담은 것은 아니에요. 색칠한 부분의 크기를 견주어 봐요.", "1": "조각 수가 많다고 더 많이 담은 것은 아니에요. 색칠한 부분의 크기를 견주어 봐요." } }],
        ok: "색칠한 부분의 크기가 같으므로 [1/3]과 [2/6]는 크기가 같아요. 두 사람이 담은 양은 같아요." }) },
    { name: "그려 보기 — 바나나 케이크 막대", inst: "건우는 길이가 같은 바나나 케이크 3개를 각각 3칸, 6칸, 12칸으로 똑같이 나누어 [2/3], [4/6], [8/12]만큼 팔았어요. 판 만큼 색칠하고 크기를 비교해 보세요.", hints: ["[4/6]는 6칸 중 4칸, [8/12]은 12칸 중 8칸을 색칠해요.", "색칠한 부분의 끝이 한 줄로 맞는지 살펴봐요."],
      render: (b, a) => rd4Bars(b, a, { bars: [{ name: "[2/3]", d: 3, k: 2 }, { name: "[4/6]", d: 6, k: 4 }, { name: "[8/12]", d: 12, k: 8 }],
        askCalc: [{ q: "세 분수의 크기를 비교해 보세요.", pick: ["[8/12]이 가장 커요.", "[2/3]가 가장 커요.", "세 분수의 크기가 모두 같아요."], a: 2, why: { "0": "분자가 크다고 큰 분수는 아니에요. 색칠한 부분의 끝을 견주어 봐요.", "1": "한 칸이 크다고 큰 분수는 아니에요. 색칠한 부분의 끝을 견주어 봐요." } },
          { q: "[2/3]와 크기가 같은 분수를 하나 더 고르세요.", pick: ["[6/9]", "[5/9]", "[3/4]"], a: 0, why: { "1": "[5/9]는 9칸 중 5칸이에요. [2/3]와 크기가 같으려면 9칸 중 6칸이어야 해요.", "2": "분모와 분자에 1씩 더한 [3/4]은 [2/3]와 크기가 달라요." } }],
        ok: "[2/3], [4/6], [8/12]은 색칠한 부분의 끝이 한 줄로 맞아요. 크기가 같은 분수예요." }) },
    { name: "말해 보기 — 분수 막대에서 찾기", inst: "지우가 가게 벽에 붙일 분수 막대를 만들었어요. 빨간 세로 자를 끌어 [3/4]의 끝과 [1/2]의 끝에 놓아 보고, 끝이 맞는 분수를 찾아보세요.", hints: ["[3/4]의 끝에 자를 놓으면 [1/8] 막대와 [1/12] 막대에서도 끝이 맞는 곳이 있어요.", "[1/2]의 끝은 [2/4], [4/8], [6/12]의 끝과 같아요."],
      render: thenWhy((b, a) => rd4Wall(b, a, { rows: [1, 2, 4, 8, 12], need: ["3/4", "1/2"],
        askCalc: [{ q: "[3/4]과 크기가 같은 분수를 모두 고르세요.", pick: ["[6/8]", "[9/12]", "[7/8]", "[8/12]"], a: [0, 1], why: { "2": "[7/8]의 끝은 [3/4]의 끝보다 오른쪽에 있어요.", "3": "[8/12]의 끝은 [3/4]의 끝보다 왼쪽에 있어요." } },
          { q: "[1/2]과 크기가 같은 분수를 모두 고르세요.", pick: ["[2/4]", "[4/8]", "[6/12]", "[5/12]"], a: [0, 1, 2], why: { "3": "[5/12]의 끝은 [1/2]의 끝보다 왼쪽에 있어요." } }],
        ok: "[3/4] = [6/8] = [9/12], [1/2] = [2/4] = [4/8] = [6/12]이에요." }),
        { q: "분모가 다른데도 크기가 같은 분수가 생기는 까닭을 써 보세요.", ph: "한 칸을 더 작게 나누면 ~", help: ["① 한 칸을 더 작게 나누면 칸 수(분모)가 어떻게 되는지 생각해요. → ② 색칠한 양은 어떻게 되는지 생각해요.", "‘한 칸을 더 작게 나누면 ~가 많아지지만 색칠한 양은 ~라서 크기가 같아요.’ 꼴로 써요."],
          ans: "한 칸을 더 작게 나누면 칸 수(분모)와 색칠한 칸 수(분자)가 많아지지만, 색칠한 부분의 양은 그대로라서 분모와 분자가 달라도 크기가 같은 분수가 생겨요." }) },
    { name: "약속하기 — 크기가 같은 분수", inst: "알게 된 것을 정리해 보세요.", hints: ["[1/3]과 [2/6]는 분모와 분자가 다르지만 그림에서 크기가 같았어요.", "[3/4]의 끝과 [6/8]의 끝이 맞았어요."],
      render: (b, a) => blanks(b, a, ["[1/3]과 [2/6], [2/3]와 [4/6]처럼 분모와 분자는 달라도 ", { o: ["크기가 같은", "크기가 다른"], a: 0 }, " 분수가 있어요. 분수만큼 그림에 색칠했을 때 색칠한 부분의 크기가 ", { o: ["같으면", "다르면"], a: 0 }, " 크기가 같은 분수예요. [3/4]과 ", { o: ["[6/8]", "[3/8]", "[4/8]"], a: 0 }, "도 크기가 같은 분수예요."], { ok: "분모와 분자는 달라도 크기가 같은 분수가 있어요." }) },
    { name: "확인하기 — 가격표 막대", inst: "수아가 가격표 막대에 [3/5], [6/10], [8/15]만큼 색칠하려고 해요. 색칠하고 크기가 같은 분수를 찾아보세요.", hints: ["[6/10]은 10칸 중 6칸, [8/15]은 15칸 중 8칸을 색칠해요.", "[4/12]를 막대에 색칠했다고 생각해 봐요. 12칸 중 4칸은 3칸 중 1칸과 끝이 맞아요."],
      render: (b, a) => rd4Bars(b, a, { bars: [{ name: "[3/5]", d: 5, k: 3 }, { name: "[6/10]", d: 10, k: 6 }, { name: "[8/15]", d: 15, k: 8 }],
        askCalc: [{ q: "크기가 같은 분수를 모두 고르세요.", pick: ["[3/5]", "[6/10]", "[8/15]"], a: [0, 1], why: { "2": "[8/15]의 끝은 [3/5]의 끝보다 왼쪽에 있어요. [3/5]과 크기가 같으려면 15칸 중 9칸이어야 해요." } },
          { q: "[4/12]와 크기가 같은 분수를 모두 고르세요.", pick: ["[1/3]", "[2/6]", "[3/12]", "[2/4]"], a: [0, 1], why: { "2": "[3/12]은 [4/12]보다 한 칸 적어요.", "3": "[2/4]는 [1/2]과 크기가 같아요." } }],
        ok: "그림에 나타내면 크기가 같은 분수를 찾을 수 있어요. [3/5] = [6/10], [4/12] = [1/3] = [2/6]예요." }) }
  ],
  challenge: { inst: "★ 도전 — 다른 분수 막대에서 빨간 세로 자를 끌어 [2/3]의 끝과 [5/15]의 끝에 놓아 보고, 크기가 같은 분수를 찾아보세요.", hints: ["[2/3]의 끝에 자를 놓으면 [1/6], [1/9], [1/15] 막대에서도 끝이 맞아요.", "[5/15]의 끝은 [1/3]의 끝과 같아요."],
    render: (b, a) => rd4Wall(b, a, { rows: [1, 3, 6, 9, 15], need: ["2/3", "5/15"],
      askCalc: [{ q: "[2/3]와 크기가 같은 분수를 모두 고르세요.", pick: ["[4/6]", "[6/9]", "[10/15]", "[5/9]"], a: [0, 1, 2], why: { "3": "[5/9]의 끝은 [2/3]의 끝보다 왼쪽에 있어요." } },
        { q: "[5/15]와 크기가 같은 분수를 모두 고르세요.", pick: ["[1/3]", "[2/6]", "[3/9]", "[4/9]"], a: [0, 1, 2], why: { "3": "[4/9]의 끝은 [5/15]의 끝보다 오른쪽에 있어요." } }],
      ok: "[2/3] = [4/6] = [6/9] = [10/15], [5/15] = [1/3] = [2/6] = [3/9]이에요." }) }
},
{
  id: "s3", no: 3, title: "가격표 색종이를 접어요 ― 크기가 같은 분수 만들기", soop: "개념 구축하기(O)",
  question: "분모와 분자를 어떻게 하면 크기가 같은 분수를 만들 수 있을까요?",
  summary: "분모와 분자에 각각 0이 아닌 같은 수를 곱하면 크기가 같은 분수가 돼요. [1/3] = [2/6] = [3/9] = [4/12] = … 분모와 분자를 각각 0이 아닌 같은 수로 나누어도 크기가 같은 분수가 돼요. [8/12] = [4/6] = [2/3]",
  steps: [
    { name: "만져 보기 — 색종이 접었다 펴기", inst: "수아가 가격표를 만들 색종이의 [1/3]을 빨간색으로 칠했어요. 단추를 눌러 색종이를 반으로 계속 접었다 펴며, 빨간색 부분을 분수로 나타내 보세요.", hints: ["반으로 한 번 접었다 펴면 칸 수가 2배가 돼요.", "빨간색 부분은 6칸 중 2칸, 12칸 중 4칸이에요."],
      render: ruleFirst((b, a) => rd4Split(b, a, { fold: true, bars: [{ name: "가격표 색종이", v: "1/3" }], start: 3, max: 12, need: [6, 12],
        ask: [["한 번 접었다 펴면: ", { f: "2/6", den: 6 }, "   두 번 접었다 펴면: ", { f: "4/12", den: 12 }], rd4MulRow("1/3", 2), rd4MulRow("1/3", 4)],
        ok: "분모와 분자에 각각 2, 4를 곱했더니 [1/3]과 크기가 같은 [2/6], [4/12]가 되었어요." }),
        { q: "색종이를 반으로 접었다 펼 때마다 분모와 분자는 어떻게 될까요?", ph: "내 규칙: 반으로 접을 때마다 ~", help: ["① 반으로 접으면 전체 칸 수가 어떻게 되는지 떠올려요. → ② 빨간 칸 수도 어떻게 되는지 생각해요.", "‘내 규칙: 반으로 접을 때마다 분모는 ~, 분자는 ~가 돼요.’ 꼴로 써요."],
          ans: "반으로 접을 때마다 전체 칸 수(분모)도, 빨간 칸 수(분자)도 2배가 돼요. 분모와 분자에 같은 수를 곱해도 빨간색 부분의 크기는 그대로예요." }) },
    { name: "그려 보기 — 딸기 우유 막대 나누기", inst: "도윤이가 딸기 우유 한 팩의 [8/12]만큼 컵에 따랐어요. [8/12]만큼 색칠한 막대를 6칸, 3칸으로 똑같이 나누어 [8/12]과 크기가 같은 분수를 만들어 보세요.", hints: ["6칸으로 나누면 색칠한 부분은 6칸 중 몇 칸일까요?", "12 ÷ 2 = 6, 8 ÷ 2 = 4예요."],
      render: (b, a) => rd4Split(b, a, { bars: [{ name: "[8/12]", v: "8/12" }], parts: [12, 6, 5, 4, 3], start: 12, need: [6, 3],
        ask: [rd4MulRow("8/12", 2, "÷"), rd4MulRow("8/12", 4, "÷")],
        ok: "분모와 분자를 각각 2, 4로 나누었더니 [8/12]과 크기가 같은 [4/6], [2/3]가 되었어요." }) },
    { name: "말해 보기 — 만든 방법 말하기", inst: "크기가 같은 분수를 만든 방법을 말해 보세요.", hints: ["[2/5] = [4/10]에서 분모 5에 2를 곱해 10, 분자 2에도 2를 곱해 4가 되었어요.", "[0/0]은 분수가 아니에요. 0을 곱하면 모든 분수가 [0/0]이 되어 버려요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "[2/5] = [4/10] = [6/15] = [8/20] = …에서 분모와 분자를 어떻게 했나요?", o: ["분모와 분자에 각각 같은 수 2, 3, 4를 곱했어요.", "분모에만 2, 3, 4를 곱했어요.", "분모와 분자에 같은 수를 더했어요."], a: 0, why: { "1": "분모에만 곱하면 분자 2가 그대로라서 [2/10]처럼 크기가 달라져요.", "2": "5 × 2 = 10, 2 × 2 = 4예요. 더한 것이 아니라 곱했어요." } },
        { q: "[18/24] = [9/12] = [6/8] = [3/4]에서 분모와 분자를 어떻게 했나요?", o: ["분모와 분자를 각각 같은 수 2, 3, 6으로 나누었어요.", "분모만 2, 3, 6으로 나누었어요.", "분모와 분자를 서로 다른 수로 나누었어요."], a: 0, why: { "1": "분모만 나누면 크기가 달라져요. 18 ÷ 2 = 9처럼 분자도 나누었어요.", "2": "24 ÷ 2 = 12, 18 ÷ 2 = 9처럼 같은 수로 나누었어요." } },
        { q: "분모와 분자에 0을 곱하면 어떻게 될까요?", o: ["[1/4]도 [1/5]도 [0/0]이 되어, 크기가 다른 분수끼리 같다고 해야 하는 이상한 일이 생겨요.", "언제나 크기가 같은 분수가 돼요."], a: 0, why: { "1": "[1/4]과 [1/5]은 크기가 달라요. 그런데 0을 곱하면 둘 다 [0/0]이 되어 버려요." } }],
        { ok: "분모와 분자에 0이 아닌 같은 수를 곱하거나, 0이 아닌 같은 수로 나누어야 크기가 같은 분수가 돼요." }),
        { q: "크기가 같은 분수를 만들 때 왜 ‘0이 아닌 같은 수’를 곱하거나 나누어야 할까요?", ph: "0을 곱하면 ~", help: ["① 0을 곱하면 분모가 어떻게 되는지 생각해요. → ② 분모와 분자에 서로 다른 수를 곱하면 어떻게 되는지 생각해요.", "‘0을 곱하면 ~, 서로 다른 수를 곱하면 ~라서 0이 아닌 같은 수를 써야 해요.’ 꼴로 써요."],
          ans: "0을 곱하면 분모가 0이 되어 분수가 될 수 없고, 0으로는 나눌 수 없어요. 또 분모와 분자에 서로 다른 수를 곱하면 크기가 달라지니 0이 아닌 같은 수를 써야 해요." }) },
    { name: "약속하기 — 크기가 같은 분수 만들기", inst: "크기가 같은 분수를 만드는 방법을 정리해 보세요.", hints: ["[1/3] = [2/6]는 분모와 분자에 각각 2를 곱했어요.", "[8/12] = [4/6]는 분모와 분자를 각각 2로 나누었어요."],
      render: (b, a) => blanks(b, a, ["분모와 분자에 각각 ", { o: ["0이 아닌 같은 수", "서로 다른 수"], a: 0 }, "를 곱하면 크기가 같은 분수가 돼요. 분모와 분자를 각각 0이 아닌 같은 수로 ", { o: ["나누면", "더하면", "빼면"], a: 0 }, " 크기가 같은 분수가 돼요."], { ok: "곱하거나 나누어서 크기가 같은 분수를 만들 수 있어요." }) },
    { name: "확인하기 — 포도 가격표", inst: "수아가 포도 한 송이 [4/10] kg을 다른 분수로도 써 보려고 해요. [4/10]와 크기가 같은 분수를 3개 만들어 보세요. 다 쓰면 저절로 확인해요.", hints: ["분모와 분자에 각각 2를 곱하면 [8/20]이에요.", "분모와 분자를 각각 2로 나누면 [2/5]예요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "[4/10]와 크기가 같은 분수를 3개 만들어 보세요.", eq: "4/10", count: 3 },
        { q: "어떤 방법으로 만들었나요?", pick: ["분모와 분자에 각각 0이 아닌 같은 수를 곱하거나, 분모와 분자를 각각 0이 아닌 같은 수로 나누었어요.", "분모와 분자에 같은 수를 더했어요.", "분모에만 같은 수를 곱했어요."], a: 0, why: { "1": "[4/10]의 분모와 분자에 1을 더한 [5/11]는 [4/10]와 크기가 달라요.", "2": "분모에만 곱하면 [4/20]처럼 크기가 작아져요." } }],
        { ok: "[4/10] = [8/20] = [12/30] = [16/40], [4/10] = [2/5]처럼 여러 가지 분수를 만들 수 있어요." }) }
  ],
  challenge: { inst: "★ 도전 — 크기가 같은 분수가 되도록 빈칸에 알맞은 수를 써넣으세요.", hints: ["[5/6] = [10/□]: 분자에 2를 곱했으니 분모에도 2를 곱해요.", "[36/48] = [□/24]: 48 ÷ 2 = 24이니 분자도 2로 나누어요."],
    render: (b, a) => rd4Chain(b, a, [
      ["[5/6] = ", { q: [null, "10", "?12"] }, " = ", { q: [null, "?15", "18"] }],
      ["[36/48] = ", { q: [null, "?18", "24"] }, " = ", { q: [null, "9", "?12"] }, " = ", { q: [null, "?3", "4"] }],
      ["[3/8] = ", { q: [null, "?6", "16"] }, " = ", { q: [null, "?9", "24"] }, " = ", { q: [null, "12", "?32"] }],
      ["[2/7] = ", { q: [null, "?12", "42"] }]],
      { ok: "분모와 분자에 같은 수를 곱하거나 같은 수로 나누어 크기가 같은 분수를 척척 만들었어요!" }) }
},
{
  id: "s4", no: 4, title: "판매 기록을 간단하게 ― 약분과 기약분수", soop: "개념 구축하기(O)",
  question: "장부에 적은 [12/18]를 더 간단한 분수로 나타낼 수 있을까요?",
  summary: "분모와 분자를 1이 아닌 공약수로 나누어 간단한 분수로 나타내는 것을 약분한다고 해요. [2/3]처럼 분모와 분자의 공약수가 1뿐인 분수를 기약분수라고 해요. 한 번에 기약분수로 나타내려면 분모와 분자를 두 수의 최대공약수로 나누어요.",
  steps: [
    { name: "만져 보기 — 판매 기록 막대", inst: "채린이가 딸기 18팩 중 12팩이 팔렸다고 장부에 [12/18]로 적었어요. [12/18]만큼 색칠한 막대를 9칸, 6칸, 3칸으로 똑같이 나누어 간단한 분수로 나타내 보세요.", hints: ["9칸으로 나누면 색칠한 부분은 9칸 중 6칸이에요.", "18과 12를 모두 나누어떨어지게 하는 수로 나누어요."],
      render: (b, a) => rd4Split(b, a, { bars: [{ name: "[12/18]", v: "12/18" }], parts: [18, 9, 8, 6, 4, 3], start: 18, need: [9, 6, 3],
        ask: [rd4MulRow("12/18", 2, "÷"), rd4MulRow("12/18", 3, "÷"), rd4MulRow("12/18", 6, "÷"), ["공통으로 나눈 수 2, 3, 6은 분모 18과 분자 12의 ", { c: ["공약수", "공배수", "최소공배수"], a: 0 }, "예요."]],
        ok: "분모와 분자를 18과 12의 공약수 2, 3, 6으로 나누었더니 [6/9], [4/6], [2/3]가 되었어요." }) },
    { name: "그려 보기 — 귤 판매 기록 약분하기", inst: "귤은 36개 중 24개가 팔려서 [24/36]로 적었어요. ÷ 단추로 분모와 분자를 공약수로 나누어, 더 이상 나눌 수 없을 때까지 나누어 보세요.", hints: ["36과 24를 모두 나누어떨어지게 하는 수를 찾아요.", "36과 24의 공약수는 1, 2, 3, 4, 6, 12예요."],
      render: ruleFirst((b, a) => rd4Reduce(b, a, { v: "24/36", divs: [2, 3, 4, 5, 6, 7, 8, 9, 12],
        askCalc: [{ q: "36과 24의 공약수를 모두 써 보세요.", set: [1, 2, 3, 4, 6, 12], why: { "8": "36 ÷ 8은 나누어떨어지지 않아요.", "9": "24 ÷ 9는 나누어떨어지지 않아요.", "24": "36 ÷ 24는 나누어떨어지지 않아요.", "36": "24 ÷ 36은 나누어떨어지지 않아요.", miss: "1도 공약수예요. 36과 24의 약수를 모두 구해 함께 들어 있는 수를 찾아요." } },
          { q: "더 이상 나눌 수 없는 가장 간단한 분수는?", a: "2/3", irr: true, from: "24/36" }],
        ok: "[24/36]를 끝까지 나누면 [2/3]가 돼요. [2/3]의 분모와 분자의 공약수는 1뿐이에요." }),
        { q: "분모와 분자를 더 이상 나눌 수 없을 때까지 나누면 분모와 분자의 공약수는 어떻게 될까요?", ph: "내 규칙: 끝까지 나누면 공약수가 ~", help: ["① 더 이상 나눌 수 없다는 말이 무슨 뜻인지 생각해요. → ② 그때 분모와 분자의 공약수가 무엇뿐일지 예상해요.", "‘내 규칙: 끝까지 나누면 분모와 분자의 공약수가 ~뿐이에요.’ 꼴로 써요."],
          ans: "끝까지 나누면 분모와 분자의 공약수가 1뿐인 분수가 돼요. [24/36]는 [2/3]가 되고, 3과 2의 공약수는 1뿐이에요." }) },
    { name: "말해 보기 — 한 번에 간단하게", inst: "분수를 간단하게 나타내는 방법을 말해 보세요.", hints: ["한 번에 [2/3]가 되려면 36과 24의 공약수 중 가장 큰 수로 나누어요.", "분모와 분자의 공약수가 1뿐이면 더 나눌 수 없어요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "[24/36]를 한 번에 [2/3]로 나타내려면 분모와 분자를 무엇으로 나누어야 하나요?", o: ["36과 24의 최대공약수 12", "36과 24의 최소공배수 72", "2"], a: 0, why: { "1": "72로는 36도 24도 나눌 수 없어요.", "2": "2로 나누면 [12/18]가 되어 더 나누어야 해요." } },
        { q: "분모와 분자의 공약수가 1뿐인 분수를 모두 고르세요.", o: ["[3/7]", "[6/9]", "[5/8]", "[10/12]"], a: [0, 2], why: { "1": "[6/9]은 3으로 더 나눌 수 있어요.", "3": "[10/12]은 2로 더 나눌 수 있어요." } },
        { q: "[24/36]를 간단하게 나타낼 때 [24/36] = [2/3]처럼 바로 써도 되나요?", o: ["네, 약분은 [24/36] = [2/3]와 같이 나타낼 수도 있어요.", "아니요, 한 번에 2로만 나누어야 해요."], a: 0, why: { "1": "공약수라면 어떤 수로 나누어도 돼요. 최대공약수로 나누면 한 번에 끝나요." } }],
        { ok: "분모와 분자를 최대공약수로 나누면 한 번에 가장 간단한 분수가 돼요." }),
        { q: "최대공약수로 나누면 왜 한 번에 가장 간단한 분수가 될까요?", ph: "최대공약수는 ~", help: ["① 최대공약수가 분모와 분자를 함께 나누는 수 중 어떤 수인지 떠올려요. → ② 그 수로 나눈 뒤 남은 분모와 분자의 공약수를 생각해요.", "‘최대공약수는 ~ 수라서, 그 수로 나누면 남은 분모와 분자의 공약수가 ~뿐이에요.’ 꼴로 써요."],
          ans: "최대공약수는 분모와 분자를 함께 나눌 수 있는 가장 큰 수라서, 그 수로 나누면 남은 분모와 분자의 공약수가 1뿐이 되어 더 나눌 수 없어요." }) },
    { name: "약속하기 — 약분과 기약분수", inst: "약분과 기약분수의 뜻을 정리해 보세요.", hints: ["[12/18]의 분모와 분자를 공약수 2, 3, 6으로 나누었어요.", "[2/3]는 분모와 분자의 공약수가 1뿐이에요."],
      render: (b, a) => blanks(b, a, ["분모와 분자를 1이 아닌 ", { o: ["공약수", "공배수", "아무 수"], a: 0 }, "로 나누어 간단한 분수로 나타내는 것을 ", { o: ["약분한다", "통분한다"], a: 0 }, "고 해요. [2/3]처럼 분모와 분자의 공약수가 1뿐인 분수를 ", { o: ["기약분수", "단위분수", "가분수"], a: 0 }, "라고 해요."], { ok: "약분과 기약분수의 뜻을 알았어요." }) },
    { name: "확인하기 — 장부 정리하기", inst: "채린이의 장부에 적힌 분수를 약분해 보세요. 약분한 분수는 기약분수가 아니어도 모두 정답이에요. 마지막 문제는 기약분수로 나타내요.", hints: ["분모와 분자를 공약수로 나누어요. 예: [6/16] = [3/8]", "사과는 30개 중 12개가 팔렸으니 [12/30]예요. 30과 12의 최대공약수 6으로 나누어요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "[6/16]을 약분해 보세요.", a: "3/8", red: true, from: "6/16" },
        { q: "[15/35]를 약분해 보세요.", a: "3/7", red: true, from: "15/35" },
        { q: "[18/27]을 약분해 보세요.", a: "2/3", red: true, from: "18/27" },
        { q: "[28/42]을 약분해 보세요.", a: "2/3", red: true, from: "28/42" },
        { q: "가게에 사과 30개가 있었는데 12개가 팔렸어요. 팔린 사과는 전체의 얼마인지 기약분수로 나타내 보세요.", a: "2/5", irr: true, from: "12/30" }],
        { ok: "[6/16] = [3/8], [15/35] = [3/7], [18/27] = [2/3], [28/42] = [2/3]처럼 기약분수로 나타낸 것도, [14/21]처럼 중간까지 약분한 것도 모두 약분한 분수예요." }) }
  ],
  challenge: { inst: "★ 도전 — 약분과 기약분수를 이용하여 해결해 보세요.", hints: ["56과 42의 최대공약수로 나누면 한 번에 기약분수가 돼요.", "60과 36의 공약수는 1, 2, 3, 4, 6, 12예요. 1이 아닌 공약수로 나누어요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "56과 42의 최대공약수를 구해 보세요.", n: 14, chk: () => rd4G(56, 42), why: { "7": "7도 공약수이지만 가장 큰 공약수를 찾아요.", "2": "2도 공약수이지만 가장 큰 공약수를 찾아요." } },
      { q: "[42/56]를 기약분수로 나타내 보세요.", a: "3/4", irr: true, from: "42/56" },
      { q: "[18/48]을 약분한 분수를 모두 고르세요.", pick: ["[9/24]", "[6/16]", "[3/8]", "[6/24]"], a: [0, 1, 2], why: { "3": "48 ÷ 2 = 24, 18 ÷ 3 = 6이에요. 분모와 분자를 서로 다른 수로 나누면 안 돼요." } },
      { q: "[36/60]을 잘못 말한 사람은 누구인가요? 도윤: “기약분수로 나타내면 [3/5]이야.” 채린: “약분하여 만들 수 있는 분수는 모두 4개야.”", pick: ["도윤", "채린"], a: rd4AllRed("36/60").length === 4 ? 0 : 1, why: { "0": "60과 36의 최대공약수는 12예요. [36/60] = [3/5]이니 도윤이의 말은 맞아요." } },
      { q: "분모가 15인 진분수 중에서 기약분수는 모두 몇 개인가요?", n: rd4Count(15, k => rd4G(k, 15) === 1), unit: "개", chk: () => [1, 2, 4, 7, 8, 11, 13, 14].length, why: { "14": "분모가 15인 진분수는 14개이지만, 그중 [3/15], [5/15]처럼 약분되는 분수는 기약분수가 아니에요." } }],
      { ok: `약분과 기약분수 문제를 해결했어요! [36/60]을 약분한 분수는 ${rd4AllRed("36/60").join(", ")}로 ${rd4AllRed("36/60").length}개예요.` }) }
},
{
  id: "s5", no: 5, title: "주스 바 메뉴판 ― 통분", soop: "개념 구축하기(O)",
  question: "분모가 다른 두 주스의 양을 분모가 같은 분수로 나타낼 수 있을까요?",
  summary: "분모가 다른 분수의 분모를 같게 나타내는 것을 통분한다고 하고, 통분한 분모를 공통분모라고 해요. 두 분모의 공배수는 모두 공통분모가 될 수 있어요. 두 분모의 곱이나 두 분모의 최소공배수를 공통분모로 하여 통분할 수 있어요.",
  steps: [
    { name: "만져 보기 — 주스 막대 나누기", inst: "주스 바를 맡은 도윤이가 크기가 같은 컵에 딸기 주스를 [2/3]컵, 키위 주스를 [3/4]컵 담았어요. 두 막대를 같은 칸 수로 나누어, 색칠한 끝이 모두 칸의 경계와 맞는 때를 찾아보세요.", hints: ["6칸으로 나누면 딸기 주스 막대는 맞지만 키위 주스 막대는 맞지 않아요.", "두 분모 3과 4의 공배수인 12칸으로 나누어 봐요."],
      render: ruleFirst((b, a) => { b.append(rd4sCups([{ f: "2/3", name: "딸기" }, { f: "3/4", name: "키위" }])());
        rd4Split(b, a, { bars: [{ name: "딸기 [2/3]", v: "2/3" }, { name: "키위 [3/4]", v: "3/4" }], parts: [3, 4, 6, 8, 12], start: 3, need: [12], lx: 230,
          ask: [rd4MulRow("2/3", 4), rd4MulRow("3/4", 3), ["주스가 더 많은 컵: ", { c: ["딸기 주스", "키위 주스"], a: 1 }]],
          ok: "[2/3] = [8/12], [3/4] = [9/12]예요. 분모가 같아지니 분자만 비교하면 돼요. 키위 주스가 더 많아요." }); },
        { q: "두 막대를 몇 칸으로 나누어야 두 분수의 분모가 같아질까요?", ph: "내 규칙: 3과 4의 ~인 칸 수로 나누면", help: ["① 3칸 막대와 4칸 막대의 칸 경계가 함께 맞으려면 칸 수가 어떤 수여야 할지 생각해요. → ② 3과 4로 모두 나누어떨어지는 수를 떠올려요.", "‘내 규칙: 3과 4의 ~인 칸 수로 나누면 분모가 같아져요.’ 꼴로 써요."],
          ans: "두 분모 3과 4의 공배수인 12칸, 24칸, …으로 나누면 두 분수의 분모가 같아져요. 가장 작은 칸 수는 3과 4의 최소공배수 12예요." }) },
    { name: "그려 보기 — 공통분모 찾기", inst: "도윤이는 망고 주스 [5/6]컵과 포도 주스 [4/9]컵도 분모를 같게 나타내 보려고 해요. 크기가 같은 분수를 분모가 작은 것부터 늘어놓고, 분모가 같은 짝을 모두 찾아보세요.", hints: ["[5/6]의 분모와 분자에 2, 3, 4, …를 곱해 크기가 같은 분수를 만들어요.", "분모 18과 36이 두 줄에 모두 있어요."],
      render: (b, a) => rd4Common(b, a, { a: "5/6", b: "4/9", m: 6,
        askCalc: [{ q: "찾은 짝의 분모 18, 36은 6과 9의 무엇인가요?", pick: ["공배수", "공약수"], a: 0, why: { "1": "18과 36은 6으로도 9로도 나누어떨어지는 수예요. 6과 9의 공약수는 1, 3이에요." } },
          { q: "분모가 같은 짝 중 분모가 가장 작은 18은 6과 9의 무엇인가요?", pick: ["최소공배수", "최대공약수", "두 분모의 곱"], a: 0, why: { "1": "6과 9의 최대공약수는 3이에요.", "2": "6 × 9 = 54예요. 18은 54보다 작아요." } }],
        ok: "([5/6], [4/9])를 통분하면 ([15/18], [8/18]) 또는 ([30/36], [16/36])이 돼요. 공통분모 18, 36은 6과 9의 공배수예요." }) },
    { name: "말해 보기 — 두 가지 방법으로 통분하기", inst: "채린이가 메뉴판에 레몬에이드 [3/10]컵, 자몽에이드 [7/15]컵을 적었어요. 두 분수를 두 분모의 곱과 두 분모의 최소공배수를 공통분모로 하여 각각 통분해 보세요.", hints: ["두 분모의 곱은 10 × 15 = 150이에요. [3/10]의 분모와 분자에 15를 곱해요.", "10과 15의 최소공배수는 30이에요. [3/10]에는 3을, [7/15]에는 2를 곱해요."],
      render: thenWhy((b, a) => rd4Chain(b, a, [rd4TongRow("3/10", "7/15", 10 * 15, "두 분모의 곱"), rd4TongRow("3/10", "7/15", rd4Lcm(10, 15), "최소공배수")],
        { ok: "곱 150으로 하면 ([45/150], [70/150]), 최소공배수 30으로 하면 ([9/30], [14/30])이에요." }),
        { q: "두 방법 중 어떤 방법이 더 편리한지 까닭과 함께 써 보세요.", ph: "~ 방법이 더 편리해요. 왜냐하면 ~", help: ["① 두 분모의 곱으로 할 때 좋은 점과 불편한 점을 떠올려요. → ② 최소공배수로 할 때 좋은 점과 불편한 점을 떠올려요.", "‘○○ 방법은 ~하지만 ~해요. 그래서 나는 ~ 방법이 편리해요.’ 꼴로 써요."],
          ans: "두 분모의 곱으로 하면 최소공배수를 구하지 않아도 되지만 수가 커져요. 최소공배수로 하면 최소공배수를 구해야 하지만 수가 작아서 계산이 간단해요. 그래서 수가 작은 최소공배수 방법이 더 편리해요." }) },
    { name: "약속하기 — 통분과 공통분모", inst: "통분과 공통분모의 뜻을 정리해 보세요.", hints: ["[2/3]와 [3/4]을 [8/12]과 [9/12]로 분모를 같게 나타냈어요.", "공통분모 12, 24, 36, …은 3과 4의 공배수예요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 분수의 분모를 같게 나타내는 것을 ", { o: ["통분한다", "약분한다"], a: 0 }, "고 하고, 통분한 분모를 ", { o: ["공통분모", "기약분수", "공약수"], a: 0 }, "라고 해요. 두 분모의 ", { o: ["공배수", "공약수"], a: 0 }, "는 모두 공통분모가 될 수 있어요."], { ok: "통분과 공통분모의 뜻을 알았어요." }) },
    { name: "확인하기 — 메뉴판 통분하기", inst: "메뉴판의 분수를 통분해 보세요. 다 쓰면 저절로 확인해요.", hints: ["8과 6의 최소공배수는 24예요. [5/8]에는 3을, [1/6]에는 4를 곱해요.", "공통분모는 두 분모의 공배수예요. 8로도 12로도 나누어떨어지는 수를 골라요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "[5/8]와 [1/6]을 두 분모의 최소공배수를 공통분모로 하여 통분해 보세요.", e: "[5/8]", a: "15/24", den: rd4Lcm(8, 6), from: "5/8" },
        { e: "[1/6]", a: "4/24", den: rd4Lcm(8, 6), from: "1/6" },
        { q: "[2/9]와 [1/4]을 두 분모의 곱을 공통분모로 하여 통분해 보세요.", e: "[2/9]", a: "8/36", den: 9 * 4, from: "2/9" },
        { e: "[1/4]", a: "9/36", den: 9 * 4, from: "1/4" },
        { q: "[3/8]과 [5/12]의 공통분모가 될 수 있는 수를 모두 고르세요.", pick: ["12", "24", "36", "48", "60"], a: [1, 3], why: { "0": "12는 8로 나누어떨어지지 않아요.", "2": "36은 8로 나누어떨어지지 않아요.", "4": "60은 8로 나누어떨어지지 않아요." } }],
        { ok: "([5/8], [1/6]) → ([15/24], [4/24]), ([2/9], [1/4]) → ([8/36], [9/36])이에요. 공통분모는 두 분모의 공배수 24, 48, …이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 통분을 이용하여 해결해 보세요.", hints: ["분모에 곱한 수만큼 분자에도 곱해야 해요.", "통분하기 전의 분수는 통분한 분수를 약분하여 기약분수로 나타내면 돼요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "수아가 ([2/5], [3/4])를 ([2/20], [3/20])으로 잘못 통분했어요. 옳게 통분해 보세요.", e: "[2/5]", a: "8/20", den: 20, from: "2/5" },
      { e: "[3/4]", a: "15/20", den: 20, from: "3/4" },
      { q: "두 기약분수를 통분하였더니 [10/24], [9/24]가 되었어요. 통분하기 전의 두 기약분수를 써 보세요.", e: "[10/24]", a: "5/12", irr: true, from: "10/24" },
      { e: "[9/24]", a: "3/8", irr: true, from: "9/24" },
      { q: "[7/10]과 [4/15]를 통분할 때 가장 작은 공통분모는?", n: 30, chk: () => rd4Lcm(10, 15), why: { "150": "150도 공통분모이지만 가장 작은 공통분모는 10과 15의 최소공배수예요." } }],
      { ok: "분모와 분자에 같은 수를 곱해야 옳게 통분할 수 있어요. 통분한 분수를 약분하면 처음 분수로 돌아가요." }) }
},
{
  id: "s6", no: 6, title: "어느 주스가 더 많이 남았을까? ― 분수의 크기 비교", soop: "개념 구축하기(O)",
  question: "분모가 다른 분수의 크기는 어떻게 비교할까요?",
  summary: "분모가 다른 두 분수의 크기를 비교할 때에는 두 분수를 통분하여 분자의 크기를 비교해요. 세 분수는 두 분수씩 짝 지어 차례대로 비교해요. 대분수는 자연수 부분을 먼저 비교하고, 같으면 분수 부분을 통분하여 비교해요.",
  steps: [
    { name: "만져 보기 — 남은 주스 비교하기", inst: "가게를 마칠 때 크기가 같은 병에 망고 주스는 [5/8]만큼, 포도 주스는 [7/12]만큼 남았어요. 두 막대를 같은 칸 수로 나누어 분모를 같게 한 다음 비교해 보세요.", hints: ["8과 12의 공배수인 칸 수로 나누어 봐요.", "8과 12의 최소공배수는 24예요."],
      render: (b, a) => rd4Split(b, a, { bars: [{ name: "망고 [5/8]", v: "5/8" }, { name: "포도 [7/12]", v: "7/12" }], parts: [8, 12, 16, 24], start: 8, need: [24], lx: 230,
        ask: [rd4PairRow("5/8", "7/12", 24), ["더 많이 남은 주스: ", { c: ["망고 주스", "포도 주스"], a: 0 }]],
        ok: "[5/8] = [15/24], [7/12] = [14/24]예요. 그래서 망고 주스가 더 많이 남았어요." }) },
    { name: "그려 보기 — 세 가지 주스 비교하기", inst: "주스 세 병이 남았어요. 사과 주스 [3/5]병, 배 주스 [4/7]병, 귤 주스 [5/9]병이에요. 두 분수씩 짝 지어 통분하여 비교하고, 많이 남은 것부터 차례로 눌러 보세요.", hints: ["([3/5], [4/7])는 35로, ([4/7], [5/9])는 63으로, ([3/5], [5/9])는 45로 통분해요.", "[3/5] > [4/7]이고 [4/7] > [5/9]이면 [3/5]이 가장 커요."],
      render: (b, a) => rd4Chain(b, a, [rd4PairRow("3/5", "4/7", 35), rd4PairRow("4/7", "5/9", 63), rd4PairRow("3/5", "5/9", 45), ["많이 남은 것부터: ", { ord: ["[3/5]", "[4/7]", "[5/9]"] }]],
        { ok: "[3/5] > [4/7] > [5/9]예요. 사과 주스가 가장 많이 남았어요." }) },
    { name: "말해 보기 — 통분하지 않고 비교하기", inst: "건우는 통분하지 않고도 크기를 비교하는 방법이 있다고 해요. 알맞은 것을 골라 보세요.", hints: ["[4/5]는 1보다 [1/5]만큼 작고, [6/7]은 1보다 [1/7]만큼 작아요.", "분자가 같으면 한 칸이 큰 쪽이 더 커요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "[4/5]와 [6/7] 중 더 큰 분수는?", o: ["[6/7] — 1에서 모자란 [1/7]이 [1/5]보다 작아요.", "[4/5] — 분모가 더 작아요."], a: 0, why: { "1": "분모가 작다고 큰 분수는 아니에요. 1에서 모자란 양 [1/5]과 [1/7]을 견주어 봐요." } },
        { q: "[3/8]과 [3/10]처럼 분자가 같으면 어느 분수가 더 클까요?", o: ["분모가 작은 [3/8]", "분모가 큰 [3/10]"], a: 0, why: { "1": "분자가 같으면 한 칸이 큰 쪽, 곧 분모가 작은 쪽이 더 커요." } },
        { q: "[2 1/3]과 [1 5/6] 중 더 큰 분수는?", o: ["[2 1/3]", "[1 5/6]"], a: 0, why: { "1": "대분수는 자연수 부분을 먼저 비교해요. 2가 1보다 커요." } }],
        { ok: "1에서 모자란 양, 같은 분자, 자연수 부분을 보고도 크기를 비교할 수 있어요." }),
        { q: "분모가 다른 두 분수의 크기를 비교할 때 통분하는 까닭을 써 보세요.", ph: "분모가 다르면 한 칸의 크기가 ~", help: ["① 분모가 다르면 한 칸의 크기가 어떤지 생각해요. → ② 통분하면 무엇만 비교하면 되는지 생각해요.", "‘분모가 다르면 ~라서 분자만 보고 비교할 수 없어요. 통분하면 ~’ 꼴로 써요."],
          ans: "분모가 다르면 한 칸의 크기가 달라서 분자만 보고 비교할 수 없어요. 통분하여 분모를 같게 하면 한 칸의 크기가 같아지니 분자만 비교하면 돼요." }) },
    { name: "약속하기 — 분모가 다른 분수의 크기 비교", inst: "분모가 다른 분수의 크기를 비교하는 방법을 정리해 보세요.", hints: ["([5/8], [7/12])를 24로 통분하여 ([15/24], [14/24])로 나타냈어요.", "세 분수는 두 분수씩 짝 지어 비교했어요."],
      render: (b, a) => blanks(b, a, ["분모가 다른 두 분수의 크기를 비교할 때에는 두 분수를 ", { o: ["통분하여", "약분하여", "더하여"], a: 0 }, " 비교해요. 통분한 다음에는 ", { o: ["분자", "분모"], a: 0 }, "가 큰 쪽이 더 큰 분수예요. 세 분수는 ", { o: ["두 분수씩 짝 지어", "한꺼번에 더해서"], a: 0 }, " 차례대로 비교해요."], { ok: "통분하면 분모가 다른 분수의 크기를 비교할 수 있어요." }) },
    { name: "확인하기 — 남은 과일 비교하기", inst: "지우가 오늘 남은 과일의 양을 비교해요. >, =, < 중 알맞은 것을 고르고, 차례를 정해 보세요.", hints: ["([5/6], [7/9])는 18로, ([3/7], [4/9])는 63으로 통분해요.", "[2 3/8]과 [2 5/12]는 자연수 부분이 같으니 분수 부분을 24로 통분해요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "두 분수의 크기를 비교해 보세요.", cmp: ["[5/6]", "[7/9]"] },
        { cmp: ["[3/7]", "[4/9]"] },
        { cmp: ["[2 3/8]", "[2 5/12]"] },
        { cmp: ["[6/9]", "[4/6]"], why: { ">": "[6/9]과 [4/6]를 18로 통분하면 둘 다 [12/18]가 돼요.", "<": "[6/9]과 [4/6]를 18로 통분하면 둘 다 [12/18]가 돼요." } },
        { q: "남은 양이 많은 것부터 차례로 눌러 보세요.", order: ["[2/3]", "[5/8]", "[7/12]"] }],
        { ok: "[5/6] > [7/9], [3/7] < [4/9], [2 3/8] < [2 5/12], [6/9] = [4/6]예요. 24로 통분하면 [16/24] > [15/24] > [14/24]예요." }) }
  ],
  challenge: { inst: "★ 도전 — 수아가 수 카드 5, 7, 8을 한 번씩만 써서 분자가 1, 2, 3인 분수 3개를 만들어요. 만든 분수 중 가장 큰 분수를 찾고, 아래 문제도 해결해 보세요. 두 가지를 모두 해야 해요.", hints: ["두 분수씩 짝 지어 통분하여 비교해요.", "[5/12]와 [□/18]을 36으로 통분하면 [15/36]와 [(□ × 2)/36]이에요."],
    render: (b, a) => { rd4Cards(b, a, { nums: [1, 2, 3], cards: [5, 7, 8], ok: "만든 세 분수를 두 개씩 통분하여 가장 큰 분수를 찾았어요." });
      rd4Calc(b, a, [{ q: "[5/12] > [□/18]에서 □ 안에 들어갈 수 있는 자연수는 모두 몇 개인가요?", n: 7, unit: "개", chk: () => rd4Count(18, k => rd4Cmp("5/12", `${k}/18`) > 0), why: { "8": "□가 8이면 [8/18] = [16/36]이고 [5/12] = [15/36]이라서 [5/12]가 더 작아요.", "6": "□가 7이어도 [7/18] = [14/36]이라서 [5/12] = [15/36]보다 작아요." } }],
        { ok: "36으로 통분하면 □ × 2가 15보다 작아야 하니 □는 1부터 7까지 7개예요." }); } }
},
{
  id: "s7", no: 7, title: "가격표의 무게를 비교해요 ― 분수와 소수", soop: "개념 구축하기(O)",
  question: "분수와 소수로 쓴 가격표의 무게는 어떻게 비교할까요?",
  summary: "분수를 분모가 10, 100인 분수로 고친 다음 소수로 나타내어 비교하거나, 소수를 분모가 10, 100인 분수로 나타낸 다음 통분하여 비교해요. 소수 한 자리 수는 분모가 10인 분수로, 소수 두 자리 수는 분모가 100인 분수로 나타내요.",
  steps: [
    { name: "만져 보기 — 수직선에 무게 놓기", inst: "가격표 담당 수아가 바나나 한 송이에 [3/5] kg, 포도 한 송이에 0.7 kg이라고 썼어요. 두 무게를 수직선에 놓아 보고 어느 것이 더 무거운지 알아보세요.", hints: ["[3/5]의 분모와 분자에 2를 곱하면 [6/10]이에요.", "[6/10]은 0.6이에요. 0.6과 0.7 중 더 오른쪽에 있는 수가 더 커요."],
      render: (b, a) => rd4Place(b, a, { max: 1, t: 10, lab: "dec", items: [{ name: "바나나 [3/5]", v: "3/5" }, { name: "포도 0.7", v: "0.7" }],
        ask: [["[3/5] = ", { q: [null, ["3×", "?2"], ["5×", "?2"]] }, " = ", { q: [null, "?6", "10"] }, " = ", { i: "0.6" }], ["더 무거운 과일: ", { c: ["바나나", "포도"], a: 1 }]],
        ok: "[3/5] = [6/10] = 0.6이고 0.6 < 0.7이에요. 포도가 더 무거워요." }) },
    { name: "그려 보기 — 100칸 모눈에 나타내기", inst: "사과 한 봉지는 [7/20] kg, 배 한 개는 0.4 kg이에요. 모눈 한 칸을 [1/100] kg으로 보고, 두 무게만큼 색칠해 비교해 보세요.", hints: ["[7/20]의 분모와 분자에 5를 곱하면 [35/100]예요. 35칸을 색칠해요.", "0.4는 [40/100]이에요. 40칸을 색칠해요."],
      render: thenWhy((b, a) => rd4Hund(b, a, { grids: [{ name: "사과 [7/20] kg", k: 35 }, { name: "배 0.4 kg", k: 40 }],
        ask: [["[7/20] = ", { q: [null, ["7×", "?5"], ["20×", "?5"]] }, " = ", { q: [null, "?35", "100"] }, " = ", { i: "0.35" }], ["0.4 = ", { q: [null, "?40", "100"] }], ["[7/20] ", { c: [">", "=", "<"], a: 2 }, " 0.4"]],
        ok: "[7/20] = [35/100] = 0.35이고 0.4 = [40/100]이에요. 사과 한 봉지가 배 한 개보다 가벼워요." }),
        { q: "분수를 소수로 나타내려면 어떻게 하면 좋을까요?", ph: "분모를 ~으로 만들어요", help: ["① 소수는 분모가 10, 100인 분수와 같다는 것을 떠올려요. → ② 분모를 10이나 100으로 만들려면 무엇을 곱해야 하는지 생각해요.", "‘분모와 분자에 같은 수를 곱해서 분모를 ~으로 만든 다음 소수로 나타내요.’ 꼴로 써요."],
          ans: "분모와 분자에 같은 수를 곱해서 분모를 10이나 100으로 만들어요. [7/20]은 분모와 분자에 5를 곱해 [35/100]가 되니까 0.35예요." }) },
    { name: "말해 보기 — 두 가지 방법", inst: "채린이는 귤 한 봉지 [3/4] kg과 키위 한 봉지 0.8 kg을 비교하려고 해요. 두 가지 방법으로 비교한 다음, 내가 편리한 방법을 써 보세요. 두 가지를 모두 해야 계단을 올라요.", hints: ["[3/4]의 분모와 분자에 25를 곱하면 [75/100]예요.", "0.8 = [8/10] = [80/100]이에요."],
      render: (b, a) => { rd4Chain(b, a, [{ t: "분수를 소수로", p: ["[3/4] = ", { q: [null, ["3×", "?25"], ["4×", "?25"]] }, " = ", { q: [null, "?75", "100"] }, " = ", { i: "0.75" }] },
          { t: "소수를 분수로", p: ["0.8 = ", { q: [null, "?8", "10"] }, " = ", { q: [null, "?80", "100"] }] }, ["그래서 0.8 ", { c: [">", "=", "<"], a: 0 }, " [3/4]"]],
          { ok: "[3/4] = 0.75이고 0.8 = [80/100]이에요. 어느 방법으로 해도 키위 한 봉지가 더 무거워요." });
        writeStep(b, a, [{ q: "두 방법 중 나는 어느 방법이 더 편리한지 까닭과 함께 써 보세요.", tag: "편리한 방법", ph: "나는 ~ 방법이 편리해요. 왜냐하면 ~", help: ["① 분수를 소수로 바꾸었을 때와 소수를 분수로 바꾸었을 때를 떠올려요. → ② 어느 쪽이 비교하기 쉬웠는지 골라요.", "‘나는 ~를 ~로 나타내는 방법이 편리해요. 왜냐하면 ~’ 꼴로 써요."],
          ans: "나는 분수를 소수로 나타내는 방법이 편리해요. [3/4]을 0.75로 바꾸면 0.8과 소수 첫째 자리끼리 바로 비교할 수 있기 때문이에요." }]); } },
    { name: "약속하기 — 분수와 소수의 크기 비교", inst: "분수와 소수의 크기를 비교하는 방법을 정리해 보세요.", hints: ["[3/5]을 0.6으로 나타내어 0.7과 비교했어요.", "0.8을 [80/100]으로 나타내어 비교하기도 했어요."],
      render: (b, a) => blanks(b, a, ["분수와 소수의 크기를 비교할 때에는 분수를 ", { o: ["소수", "자연수"], a: 0 }, "로 나타내어 비교하거나, 소수를 ", { o: ["분수", "자연수"], a: 0 }, "로 나타내어 비교해요. 소수 두 자리 수는 분모가 ", { o: ["100", "10", "1000"], a: 0 }, "인 분수로 나타낼 수 있어요."], { ok: "분수와 소수 중 한쪽으로 나타내면 크기를 비교할 수 있어요." }) },
    { name: "확인하기 — 과일 상자 무게", inst: "가격표의 무게를 비교해 보세요. 다 쓰거나 고르면 저절로 확인해요.", hints: ["[1/4] = [25/100] = 0.25이고, [13/20] = [65/100] = 0.65예요.", "[1 7/25] = [1 28/100] = 1.28이고, [1 1/20] = 1.05예요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "두 수의 크기를 비교해 보세요.", cmp: ["[1/4]", "0.3"] },
        { cmp: ["0.65", "[13/20]"], why: { ">": "[13/20]의 분모와 분자에 5를 곱하면 [65/100] = 0.65예요.", "<": "[13/20]의 분모와 분자에 5를 곱하면 [65/100] = 0.65예요." } },
        { cmp: ["1.3", "[1 7/25]"] },
        { q: "[9/25]를 소수로 나타내 보세요.", n: 0.36, why: { "0.9": "분모가 100인 분수로 나타내 봐요. [9/25] = [36/100]이에요." } },
        { q: "과일 상자의 무게가 가 [4/5] kg, 나 0.78 kg, 다 [1 1/20] kg이에요. 무거운 것부터 차례로 눌러 보세요.", order: [{ t: "가", v: "4/5" }, { t: "나", v: "0.78" }, { t: "다", v: "1 1/20" }] }],
        { ok: "[1/4] < 0.3, 0.65 = [13/20], 1.3 > [1 7/25]이에요. 가 0.8 kg, 나 0.78 kg, 다 1.05 kg이라서 다, 가, 나 차례로 무거워요." }) }
  ],
  challenge: { inst: "★ 도전 — 0.45보다 크고 [3/5]보다 작은 분수 중에서 분모가 40인 기약분수를 찾아보세요.", hints: ["0.45 = [45/100] = [9/20] = [18/40], [3/5] = [24/40]예요.", "[19/40]부터 [23/40]까지 중에서 약분되지 않는 분수를 찾아요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "조건에 맞는 기약분수는 모두 몇 개인가요?", n: 3, unit: "개", chk: () => rd4Count(40, k => rd4Cmp(`${k}/40`, "0.45") > 0 && rd4Cmp(`${k}/40`, "3/5") < 0 && rd4G(k, 40) === 1) },
      { q: "그 기약분수를 모두 고르세요.", pick: ["[19/40]", "[20/40]", "[21/40]", "[23/40]", "[25/40]"], a: [0, 2, 3], why: { "1": "[20/40]은 약분하면 [1/2]이 되어 기약분수가 아니에요.", "4": "[25/40]는 [3/5] = [24/40]보다 커요." } }],
      { ok: "[18/40]과 [24/40] 사이의 기약분수는 [19/40], [21/40], [23/40]이에요." }) }
},
{
  id: "s8", no: 8, title: "배달 거리를 어림해요 ― [1/2]을 기준으로", soop: "개념 구축하기(O)",
  question: "통분하지 않고도 분수의 크기를 비교할 수 있을까요?",
  summary: "[1/2]과 크기가 같은 분수는 분모가 분자의 2배예요. 분자를 2배 한 수가 분모보다 작으면 [1/2]보다 작고, 분모보다 크면 [1/2]보다 커요. [1/2]을 기준으로 하면 통분하지 않고도 크기를 어림하여 비교할 수 있어요.",
  steps: [
    { name: "만져 보기 — 막대로 견주기", inst: "과일 가게에서 이웃에 과일 바구니를 배달하기로 했어요. 학교에서 도서관까지는 [3/8] km, 경로당까지는 [4/7] km예요. 길이가 같은 막대에 [3/8], [1/2], [4/7]만큼 색칠하고 [1/2]과 견주어 보세요.", hints: ["[3/8]은 8칸 중 3칸, [4/7]는 7칸 중 4칸을 색칠해요.", "색칠한 끝이 [1/2]의 끝보다 왼쪽이면 [1/2]보다 짧아요."],
      render: (b, a) => rd4Bars(b, a, { bars: [{ name: "도서관 [3/8]", d: 8, k: 3 }, { name: "[1/2]", d: 2, k: 1, col: 4 }, { name: "경로당 [4/7]", d: 7, k: 4 }],
        askCalc: [{ q: "도서관까지의 거리 [3/8] km는 [1/2] km보다", pick: ["짧아요", "길어요"], a: 0 }, { q: "경로당까지의 거리 [4/7] km는 [1/2] km보다", pick: ["길어요", "짧아요"], a: 0 }],
        ok: "[3/8] < [1/2] < [4/7]예요. 도서관은 [1/2] km보다 가깝고, 경로당은 [1/2] km보다 멀어요." }) },
    { name: "그려 보기 — [1/2]과 견주는 규칙", inst: "[1/2]과 크기가 같은 분수를 살펴보고, 분자와 분모를 견주어 [1/2]보다 큰지 작은지 알아보세요.", hints: ["[1/2] = [2/4] = [3/6] = [5/10]처럼 분모는 분자의 2배예요.", "[3/8]의 분자 3을 2배 하면 6이에요. 6과 분모 8을 견주어요."],
      render: ruleFirst((b, a) => rd4Chain(b, a, [["[1/2] = ", { q: [null, "2", "?4"] }, " = ", { q: [null, "3", "?6"] }, " = ", { q: [null, "?5", "10"] }],
          ["[1/2]과 크기가 같은 분수는 분모가 분자의 ", { c: ["2배", "3배", "절반"], a: 0 }, "예요."],
          ["[3/8]: 분자 3의 2배는 ", { i: String(3 * 2) }, "이고, 분모 8보다 ", { c: ["작아요", "커요"], a: 0 }],
          ["[4/7]: 분자 4의 2배는 ", { i: String(4 * 2) }, "이고, 분모 7보다 ", { c: ["커요", "작아요"], a: 0 }]],
        { ok: "분자를 2배 한 수가 분모보다 작으면 [1/2]보다 작고, 크면 [1/2]보다 커요." }),
        { q: "통분하지 않고 어떤 분수가 [1/2]보다 큰지 작은지 알아보는 규칙을 예상해 보세요.", ph: "내 규칙: 분자를 ~ 한 수와 분모를 견주어 ~", help: ["① [1/2]과 크기가 같은 분수에서 분모와 분자의 관계를 떠올려요. → ② 분자를 2배 한 수와 분모를 견주면 어떻게 될지 예상해요.", "‘내 규칙: 분자를 2배 한 수가 분모보다 ~면 [1/2]보다 ~.’ 꼴로 써요."],
          ans: "분자를 2배 한 수가 분모보다 작으면 [1/2]보다 작고, 분모보다 크면 [1/2]보다 커요. 같으면 [1/2]과 크기가 같아요." }) },
    { name: "말해 보기 — 배달 지도 만들기", inst: "지우가 배달할 곳을 [1/2] km보다 가까운 곳과 먼 곳으로 나누어 배달 지도를 만들어요. 카드를 알맞은 칸에 놓아 보세요.", hints: ["분자를 2배 한 수가 분모보다 작으면 [1/2] km보다 가까워요.", "[11/20]의 분자 11을 2배 하면 22이고, 22는 20보다 커요."],
      render: thenWhy((b, a) => rd4Sort(b, a, { bins: ["[1/2] km보다 가까운 곳", "[1/2] km보다 먼 곳"],
        cards: [rd4HalfCard("도서관", "3/8"), rd4HalfCard("경로당", "5/9"), rd4HalfCard("우체국", "7/16"), rd4HalfCard("공원", "7/12"), rd4HalfCard("아파트", "6/13"), rd4HalfCard("보건소", "11/20")],
        ok: "도서관, 우체국, 아파트는 [1/2] km보다 가깝고, 경로당, 공원, 보건소는 [1/2] km보다 멀어요." }),
        { q: "아파트까지 [6/13] km가 [1/2] km보다 가깝다는 것을 통분하지 않고 어떻게 알 수 있나요?", ph: "13분의 6의 분자 6을 2배 하면 ~", help: ["① 분자 6을 2배 한 수를 구해요. → ② 그 수와 분모 13을 견주어요.", "‘분자를 2배 한 수 ~는 분모 ~보다 ~라서 [1/2] km보다 ~.’ 꼴로 써요."],
          ans: "[6/13]의 분자 6을 2배 하면 12이고, 12는 분모 13보다 작아요. 그래서 [6/13] km는 [1/2] km보다 가까워요." }) },
    { name: "약속하기 — [1/2]을 기준으로 비교하기", inst: "[1/2]을 기준으로 비교하는 방법을 정리해 보세요.", hints: ["[3/8]: 3 × 2 = 6 < 8이라서 [1/2]보다 작았어요.", "[4/7]: 4 × 2 = 8 > 7이라서 [1/2]보다 컸어요."],
      render: (b, a) => blanks(b, a, ["분자를 2배 한 수가 분모보다 작으면 [1/2]보다 ", { o: ["작고", "크고"], a: 0 }, ", 분자를 2배 한 수가 분모보다 크면 [1/2]보다 ", { o: ["커요", "작아요"], a: 0 }, ". 그래서 [1/2]을 ", { o: ["기준으로", "분모로"], a: 0 }, " 하면 통분하지 않고도 크기를 어림할 수 있어요."], { ok: "[1/2]을 기준으로 하면 분수의 크기를 빠르게 어림할 수 있어요." }) },
    { name: "확인하기 — [1/2]을 기준으로 비교하기", inst: "[1/2]을 기준으로 생각하여 해결해 보세요.", hints: ["[4/9]: 4 × 2 = 8 < 9, [5/8]: 5 × 2 = 10 > 8이에요.", "분자를 2배 한 수가 분모와 같으면 [1/2]과 크기가 같아요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "[1/2]을 기준으로 두 분수의 크기를 비교해 보세요.", cmp: ["[4/9]", "[5/8]"] },
        { cmp: ["[7/12]", "[5/11]"] },
        { q: "[1/2]보다 큰 분수를 모두 고르세요.", pick: ["[5/9]", "[7/15]", "[9/17]", "[6/12]"], a: [0, 2], why: { "1": "분자 7의 2배 14는 분모 15보다 작아요. 그래서 [7/15]은 [1/2]보다 작아요.", "3": "분자 6의 2배 12는 분모 12와 같아요. [6/12]은 [1/2]과 크기가 같아요." } }],
        { ok: "[4/9] < [1/2] < [5/8], [7/12] > [1/2] > [5/11]예요. [1/2]을 기준으로 하면 통분하지 않아도 돼요." }) }
  ],
  challenge: { inst: "★ 도전 — [1/2]을 기준으로 생각하여 해결해 보세요.", hints: ["[8/15]: 16 > 15, [9/19]: 18 < 19예요.", "[5/11]는 [1/2]보다 작고, [7/13]은 [1/2]보다 커요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "두 분수의 크기를 비교해 보세요.", cmp: ["[8/15]", "[9/19]"] },
      { q: "학교에서 가 [5/11] km, 나 [7/13] km, 다 [1/2] km예요. 가까운 곳부터 차례로 눌러 보세요.", order: [{ t: "가", v: "5/11" }, { t: "나", v: "7/13" }, { t: "다", v: "1/2" }], asc: true }],
      { ok: "[8/15] > [1/2] > [9/19]예요. 가까운 곳부터 가, 다, 나예요." }) }
},
{
  id: "s9", no: 9, title: "과일 가게 정산 회의", soop: "탐구 정리하기(O)",
  question: "약분과 통분을 어떻게 이용하면 가게 기록을 잘 정리할 수 있을까요?",
  summary: "크기가 같은 분수를 만드는 방법(분모와 분자에 0이 아닌 같은 수를 곱하거나 나누기)으로 약분과 통분을 해요. 약분하면 분수를 간단하게 나타낼 수 있고, 통분하면 분모가 다른 분수의 크기를 비교할 수 있어요.",
  steps: [
    { name: "만져 보기 — 한 번에 약분하기", inst: "채린이가 정산표를 정리해요. 귤 60개 중 45개가 팔려서 [45/60]로 적었어요. 이번에는 ÷ 단추를 한 번만 눌러 바로 기약분수로 나타내 보세요.", hints: ["한 번에 기약분수로 만들려면 최대공약수로 나누어요.", "60과 45의 최대공약수는 15예요."],
      render: (b, a) => rd4Reduce(b, a, { v: "45/60", once: true, divs: [2, 3, 4, 5, 6, 9, 15],
        askCalc: [{ q: "60과 45의 최대공약수는?", n: 15, chk: () => rd4G(60, 45), why: { "5": "5도 공약수이지만 가장 큰 공약수를 찾아요.", "3": "3도 공약수이지만 가장 큰 공약수를 찾아요." } },
          { q: "[45/60]를 기약분수로 나타내면?", a: "3/4", irr: true, from: "45/60" }],
        ok: "60과 45의 최대공약수 15로 나누면 한 번에 [45/60] = [3/4]이에요." }) },
    { name: "그려 보기 — 세 모둠 판매량 비교", inst: "세 모둠이 파이를 팔았어요. 사과 파이는 [5/6]판, 블루베리 파이는 [7/9]판, 복숭아 파이는 [11/12]판이 팔렸어요. 두 분수씩 통분하여 비교하고, 많이 팔린 것부터 차례로 눌러 보세요.", hints: ["([5/6], [7/9])는 18로, ([7/9], [11/12])는 36으로, ([5/6], [11/12])는 12로 통분해요.", "[11/12]이 가장 커요."],
      render: (b, a) => rd4Chain(b, a, [rd4PairRow("5/6", "7/9", 18), rd4PairRow("7/9", "11/12", 36), rd4PairRow("5/6", "11/12", 12), ["많이 팔린 것부터: ", { ord: ["[5/6]", "[7/9]", "[11/12]"] }]],
        { ok: "[11/12] > [5/6] > [7/9]이에요. 복숭아 파이가 가장 많이 팔렸어요." }) },
    { name: "말해 보기 — 약분과 통분 정리", inst: "정산 회의에서 약분과 통분이 언제 쓸모 있었는지 이야기해요. 내 생각을 써 보세요.", hints: ["장부에 적은 [12/18], [24/36]를 떠올려요.", "딸기 주스와 키위 주스, 망고 주스와 포도 주스를 비교한 일을 떠올려요."],
      render: (b, a) => writeStep(b, a, [
        { q: "과일 가게를 준비하면서 약분이 편리했던 때를 써 보세요.", tag: "약분", ph: "장부에 ~을 적을 때 ~", help: ["① 장부에 적은 분수 중 복잡했던 분수를 떠올려요. → ② 약분하니 무엇이 좋았는지 써요.", "‘○○을 □로 적으면 복잡했는데 ~로 약분하니 ~했어요.’ 꼴로 써요."], ans: "딸기 18팩 중 12팩이 팔린 것을 [12/18]로 적으면 복잡했는데, 6으로 약분하여 [2/3]로 적으니 3팩 중 2팩꼴로 팔렸다는 것을 한눈에 알 수 있었어요." },
        { q: "통분이 꼭 필요했던 때를 써 보세요.", tag: "통분", ph: "~와 ~ 중 어느 것이 많은지 알려고 ~", help: ["① 분모가 다른 두 양을 비교한 일을 떠올려요. → ② 무엇으로 통분했는지 써요.", "‘○○와 △△ 중 어느 것이 많은지 알려고 □로 통분하여 비교했어요.’ 꼴로 써요."], ans: "딸기 주스 [2/3]컵과 키위 주스 [3/4]컵 중 어느 것이 많은지 알려고 12로 통분하여 [8/12]과 [9/12]로 비교했어요." }]) },
    { name: "약속하기 — 약분과 통분", inst: "약분과 통분을 함께 정리해 보세요.", hints: ["약분은 나누어서, 통분은 곱해서 분모를 바꾸었어요.", "두 가지 모두 크기가 같은 분수를 만드는 방법을 이용해요."],
      render: (b, a) => blanks(b, a, ["분모와 분자를 공약수로 나누어 간단하게 나타내는 것은 ", { o: ["약분", "통분"], a: 0 }, "이고, 분모가 다른 분수의 분모를 같게 나타내는 것은 ", { o: ["통분", "약분"], a: 0 }, "이에요. 두 가지 모두 분모와 분자에 0이 아닌 같은 수를 곱하거나 나누어도 ", { o: ["크기가 같다", "크기가 커진다"], a: 0 }, "는 성질을 이용해요."], { ok: "약분과 통분은 크기가 같은 분수를 만드는 방법에서 나왔어요." }) },
    { name: "확인하기 — 정산표 마무리", inst: "정산표의 마지막 문제를 해결해 보세요. 다 쓰거나 고르면 저절로 확인해요.", hints: ["40과 24의 최대공약수는 8이에요.", "[5/8] = [625/1000] = 0.625예요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "[24/40]를 기약분수로 나타내 보세요.", a: "3/5", irr: true, from: "24/40" },
        { q: "[3/4]과 [5/6]를 두 분모의 최소공배수로 통분해 보세요.", e: "[3/4]", a: "9/12", den: rd4Lcm(4, 6), from: "3/4" },
        { e: "[5/6]", a: "10/12", den: rd4Lcm(4, 6), from: "5/6" },
        { q: "두 수의 크기를 비교해 보세요.", cmp: ["[5/8]", "0.6"] },
        { cmp: ["[3/7]", "[2/5]"] }],
        { ok: "[24/40] = [3/5], ([3/4], [5/6]) → ([9/12], [10/12]), [5/8] = 0.625 > 0.6, [3/7] = [15/35] > [14/35] = [2/5]예요." }) }
  ],
  challenge: { inst: "★ 도전 — 정산을 마치고 남은 주스를 살펴봐요. 크기가 같은 병 세 개에 주스가 가 [5/6] L, 나 [5/8] L, 다 [9/10] L 남았어요.", hints: ["가와 나는 분자가 같아요. 분모가 작은 쪽이 더 커요.", "[3/8] = [9/24], [2/3] = [16/24]이에요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "가장 많이 남은 병은?", pick: ["가", "나", "다"], a: rd4Rank(["5/6", "5/8", "9/10"])[0], why: { "0": "([5/6], [9/10])을 30으로 통분하면 ([25/30], [27/30])이에요." } },
      { q: "가장 적게 남은 병은?", pick: ["가", "나", "다"], a: rd4Rank(["5/6", "5/8", "9/10"], true)[0], why: { "0": "[5/6]와 [5/8]는 분자가 같아요. 분모가 큰 쪽이 더 작아요." } },
      { q: "[3/8]보다 크고 [2/3]보다 작은 분수 중에서 분모가 24인 기약분수를 모두 고르세요.", pick: ["[10/24]", "[11/24]", "[13/24]", "[15/24]", "[17/24]"], a: [1, 2], why: { "0": "[10/24]은 2로 약분돼요.", "3": "[15/24]는 3으로 약분돼요.", "4": "[17/24]은 [2/3] = [16/24]보다 커요." } }],
      { ok: "다 > 가 > 나 차례로 많이 남았어요. [9/24]와 [16/24] 사이의 기약분수는 [11/24], [13/24]이에요." }) }
},
{
  id: "s10", no: 10, title: "과일 가게 놀이 날 ― 손가락 접어!", soop: "발표하기(P)",
  question: "분수와 소수의 크기를 재빨리 비교할 수 있을까요?",
  summary: "카드에 적힌 수와 크기를 비교하는 조건을 만들어 놀이해요. 분수를 소수로 나타내거나 소수를 분수로 나타내어 비교하면 돼요. 조건을 말하는 사람은 자신이 조건에 해당되지 않게, 다른 사람이 많이 접도록 조건을 만들어요.",
  steps: [
    { name: "놀이 방법 알기", inst: "과일 가게 놀이 날, 손님을 기다리는 동안 지우가 ‘손가락 접어!’ 놀이를 하자고 했어요. 놀이 방법을 차례대로 눌러 보세요.", hints: ["먼저 순서를 정하고 손가락을 펼쳐요.", "카드를 가져온 다음 조건을 말해요."],
      render: (b, a) => sequence(b, a, ["㉠ 조건에 해당하는 사람은 모두 손가락을 하나 접어요.", "㉡ 가위바위보로 순서를 정하고, 왼손을 들어 손가락을 모두 펼쳐요.", "㉢ 자기 차례가 되면 카드의 수와 크기를 비교하는 조건을 말해요.", "㉣ 카드가 없을 때까지 되풀이하고, 펼친 손가락이 많은 사람이 이겨요.", "㉤ 각자 카드를 한 장씩 가져와 수가 보이도록 놓아요."], [1, 4, 2, 0, 3], { ok: "놀이 방법을 알았어요. 사용한 카드는 한쪽에 모아 두어요." }) },
    { name: "카드 만들기", inst: "놀이에 쓸 내 카드를 만들어요. 빈 카드 4장에 진분수 2장(분모는 2부터 9까지), 1보다 작은 소수 한 자리 수 1장, 1보다 작은 소수 두 자리 수 1장을 써요.", hints: ["진분수는 분자가 분모보다 작은 분수예요. 예: [3/8]", "1보다 작은 소수 두 자리 수는 0.45처럼 써요."],
      render: (b, a) => rd4Maker(b, a, {}) },
    { name: "규칙 알기", inst: "놀이에서 손가락을 접을지 판단해 보세요.", hints: ["[3/5] = [6/10] = 0.6이에요. 0.6과 크기가 같은 수는 0.6보다 큰 수가 아니에요.", "[2/3]는 약 0.67, [5/8]는 0.625예요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "도윤이가 “0.6보다 큰 수를 가지고 있는 사람 모두 손가락 하나 접어!”라고 했어요. 손가락을 접어야 하는 카드를 모두 고르세요.", pick: ["[2/3]", "[3/5]", "0.55", "[5/8]"], a: [0, 3], why: { "1": "[3/5] = [6/10] = 0.6이에요. 0.6과 크기가 같으니 0.6보다 큰 수가 아니에요.", "2": "0.55는 0.6보다 작아요." } },
        { q: "수아가 [1/2] 카드를 가지고 있어요. 다른 사람 카드가 0.45, [3/4], 0.7일 때 수아가 말하면 좋은 조건은?", pick: ["“[1/2]보다 큰 수를 가진 사람 접어!”", "“[1/2]보다 작은 수를 가진 사람 접어!”"], a: 0, why: { "1": "[1/2]보다 작은 수는 0.45 하나뿐이에요. 더 많은 사람이 접는 조건을 골라 봐요." } },
        { q: "조건을 말하는 사람은 어떻게 조건을 만들어야 할까요?", pick: ["자신은 조건에 해당되지 않도록 만들어요.", "자신도 손가락을 꼭 접도록 만들어요."], a: 0 }],
        { ok: "분수와 소수를 같은 꼴로 나타내면 누가 접어야 하는지 바로 알 수 있어요." }) },
    { name: "놀이하기", inst: "지우, 도윤, 수아와 함께 ‘손가락 접어!’ 놀이를 해요. 놀이를 끝까지 하면 계단을 올라요.", hints: ["분수를 소수로 바꾸어 생각하면 비교하기 쉬워요.", "내 차례에는 다른 사람이 많이 접도록 ‘큰 수’와 ‘작은 수’ 중에서 골라요."],
      render: (b, a) => rd4Game(b, a, { ok: "끝까지 놀이를 했어요! 분수와 소수의 크기를 비교하는 힘이 자랐어요." }) },
    { name: "이기는 비법 말하기", inst: "놀이를 해 보니 어떻게 하면 이길 수 있었나요? 손님에게 알려 줄 비법을 써 보세요.", hints: ["내 카드가 아주 크거나 작을 때 어떤 조건을 말하면 좋을지 생각해요.", "분수와 소수를 같은 꼴로 바꾸어 비교한 방법을 떠올려요."],
      render: (b, a) => writeStep(b, a, [{ q: "‘손가락 접어!’ 놀이에서 이기는 비법을 써 보세요.", tag: "비법", ph: "내 카드가 ~이면 ~보다 ~ 수를 가진 사람 접어라고 말해요", help: ["① 내 카드가 큰 수일 때와 작은 수일 때 어떤 조건이 좋은지 생각해요. → ② 다른 사람 카드를 빨리 비교하는 방법도 써요.", "‘내 카드가 ~이면 ‘~보다 ~ 수’라고 말해요. 분수는 ~로 바꾸어 비교해요.’ 꼴로 써요."],
        ans: "내 카드가 작은 수이면 ‘내 수보다 큰 수를 가진 사람 접어!’, 큰 수이면 ‘내 수보다 작은 수를 가진 사람 접어!’라고 말하면 많은 사람이 접어요. 분수는 소수로 바꾸어 비교하면 빨라요." }]) }
  ],
  challenge: { inst: "★ 도전 — 또 다른 놀이, ‘통분 놀이’를 해 봐요. 뒤집은 카드 2장의 두 분모의 최소공배수를 공통분모로 하여 통분하면 1점, 4점을 모으면 성공이에요.", hints: ["두 분모의 최소공배수를 먼저 구해요.", "분모에 곱한 수만큼 분자에도 곱해요."],
    render: (b, a) => rd4Tong(b, a, { need: 4, ok: "최소공배수로 척척 통분했어요!" }) }
},
{
  id: "s11", no: 11, title: "과일 가게 놀이를 마치고 발표해요", soop: "발표하기(P)",
  question: "과일 가게 놀이에서 배운 약분과 통분을 친구들에게 설명할 수 있나요?",
  summary: "크기가 같은 분수는 분모와 분자에 0이 아닌 같은 수를 곱하거나 나누어 만들어요. 약분은 분모와 분자를 공약수로 나누어 간단하게 나타내는 것, 통분은 분모가 다른 분수의 분모를 같게 나타내는 것이에요. 분모가 다른 분수는 통분하여, 분수와 소수는 한쪽으로 나타내어 크기를 비교해요.",
  steps: [
    { name: "만져 보기 — 가게 결산", inst: "과일 가게 놀이를 마치고 결산을 해요. 다 쓰거나 고르면 저절로 확인해요.", hints: ["40과 32의 최대공약수는 8이에요.", "[4/5] = 0.8이에요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "사과 파이 40조각 중 32조각이 팔렸어요. 팔린 양을 기약분수로 나타내 보세요.", a: "4/5", irr: true, from: "32/40" },
        { q: "크기가 같은 수박 두 통이 [3/8]통, [5/12]통 남았어요. 남은 양을 비교해 보세요.", cmp: ["[3/8]", "[5/12]"] },
        { q: "바나나 [4/5] kg과 사과 0.85 kg의 무게를 비교해 보세요.", cmp: ["[4/5]", "0.85"] }],
        { ok: `[32/40] = [4/5], [3/8] = [9/24] < [10/24] = [5/12], [4/5] = 0.8 < 0.85예요.` }) },
    { name: "그려 보기 — 발표 자료 만들기", inst: "지우가 발표 자료를 만들어요. 레몬 주스 [5/12] L와 라임 주스 [7/18] L를 두 가지 방법으로 통분하여 비교해 보세요.", hints: ["두 분모의 곱은 12 × 18 = 216이에요.", "12와 18의 최소공배수는 36이에요."],
      render: (b, a) => rd4Chain(b, a, [rd4TongRow("5/12", "7/18", 12 * 18, "두 분모의 곱"), rd4TongRow("5/12", "7/18", rd4Lcm(12, 18), "최소공배수"), ["그래서 [5/12] ", { c: [">", "=", "<"], a: [">", "=", "<"].indexOf(rd4Sign(rd4Cmp("5/12", "7/18"))) }, " [7/18]"]],
        { ok: "([5/12], [7/18]) → ([90/216], [84/216]) 또는 ([15/36], [14/36])이에요. 레몬 주스가 더 많아요." }) },
    { name: "말해 보기 — 우리 가게 발표", inst: "과일 가게 놀이에서 배운 것을 반 친구들 앞에서 발표하려고 해요. 발표할 내용을 써 보세요.", hints: ["장부를 정리할 때, 주스를 비교할 때, 가격표를 볼 때를 떠올려요.", "어떤 수학을 썼고 무엇이 좋았는지 써요."],
      render: (b, a) => writeStep(b, a, [
        { q: "약분을 가게의 어디에 썼는지 발표해 보세요.", tag: "약분", ph: "장부에 적은 ~을 ~", help: ["① 약분한 분수를 하나 골라요. → ② 무엇으로 나누었고 어떻게 되었는지 써요.", "‘장부의 ○○을 □로 약분하여 △로 나타냈더니 ~했어요.’ 꼴로 써요."], ans: "장부에 적은 귤 판매 기록 [24/36]를 최대공약수 12로 약분하여 [2/3]로 나타냈더니 얼마나 팔렸는지 한눈에 알 수 있었어요." },
        { q: "통분을 가게의 어디에 썼는지 발표해 보세요.", tag: "통분", ph: "~ 주스와 ~ 주스를 ~", help: ["① 분모가 다른 두 양을 비교한 일을 골라요. → ② 공통분모를 무엇으로 했는지 써요.", "‘○○와 △△를 비교하려고 □를 공통분모로 하여 통분했어요.’ 꼴로 써요."], ans: "망고 주스 [5/8]병과 포도 주스 [7/12]병을 비교하려고 8과 12의 최소공배수 24를 공통분모로 하여 [15/24]와 [14/24]로 통분했어요. 망고 주스가 더 많이 남았어요." },
        { q: "분수와 소수의 크기를 어떻게 비교했는지 발표해 보세요.", tag: "분수와 소수", ph: "가격표의 ~ kg과 ~ kg을 ~", help: ["① 가격표의 분수와 소수를 하나씩 골라요. → ② 어느 한쪽으로 바꾸어 비교한 방법을 써요.", "‘○ kg을 소수(분수)로 나타내어 △ kg과 비교했어요.’ 꼴로 써요."], ans: "바나나 [3/5] kg을 [6/10] = 0.6 kg으로 나타내어 포도 0.7 kg과 비교했어요. 포도가 더 무거웠어요." }]) },
    { name: "확인하기 — 마무리 문제", inst: "마무리 문제를 해결해 보세요. 다 쓰거나 고르면 저절로 확인해요.", hints: ["[30/45]의 분모와 분자를 3, 5, 15로 나누거나 2를 곱해 봐요.", "12와 8의 최소공배수는 24예요."],
      render: (b, a) => rd4Calc(b, a, [
        { q: "[30/45]과 크기가 같은 분수를 모두 고르세요.", pick: ["[2/3]", "[6/9]", "[10/15]", "[3/5]", "[60/90]"], a: [0, 1, 2, 4], why: { "3": "[3/5]은 분자 30을 10으로, 분모 45를 9로 나눈 것이라 크기가 달라요." } },
        { q: "[7/12]과 [5/8]를 통분할 때 가장 작은 공통분모는?", n: rd4Lcm(12, 8), chk: () => 24, why: { "96": "96도 공통분모이지만 가장 작은 공통분모는 12와 8의 최소공배수예요." } },
        { q: "[7/12]과 [5/8] 중 더 큰 분수는?", pick: ["[7/12]", "[5/8]"], a: rd4Rank(["7/12", "5/8"])[0], why: { "0": "24로 통분하면 [14/24]와 [15/24]예요." } }],
        { ok: "[30/45] = [2/3] = [6/9] = [10/15] = [60/90]이에요. [7/12] = [14/24] < [15/24] = [5/8]예요." }) },
    { name: "되돌아보기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["약분과 통분을 배우기 전의 생각을 떠올려요.", "수박 조각, 장부 약분, 주스 통분, 가격표 비교를 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "배우기 전의 생각", ex: ["예전에는 조각 수가 많으면 더 많이 먹은 거라고 생각했어요.", "예전에는 분모가 다른 분수는 그림을 그려야만 비교할 수 있다고 생각했어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 [4/8]와 [1/2]처럼 분모와 분자가 달라도 크기가 같은 분수가 있다는 것을 알아요.", "지금은 통분하여 분모를 같게 하면 분자만 비교하면 된다고 생각해요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["수박 조각을 색칠해 보고 8조각 중 4조각과 2조각 중 1조각이 같다는 것을 보고 바뀌었어요.", "주스 막대를 12칸으로 나누어 [8/12]과 [9/12]로 비교해 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "★★ 도전 — 단원을 마무리하는 문제예요.", hints: ["[3/7]의 분모와 분자에 6을 곱하면 처음 분수예요.", "0.4 = [16/40], [5/8] = [25/40]예요. 그 사이에서 약분되지 않는 분수를 세어 봐요."],
    render: (b, a) => rd4Calc(b, a, [
      { q: "어떤 분수의 분모와 분자를 6으로 나누어 약분하였더니 [3/7]이 되었어요. 처음 분수는?", a: "18/42", den: 7 * 6 },
      { q: "0.4보다 크고 [5/8]보다 작은 분수 중에서 분모가 40인 기약분수는 모두 몇 개인가요?", n: 4, unit: "개", chk: () => rd4Count(40, k => rd4Cmp(`${k}/40`, "0.4") > 0 && rd4Cmp(`${k}/40`, "5/8") < 0 && rd4G(k, 40) === 1) }],
      { ok: "처음 분수는 [18/42]이고, 0.4와 [5/8] 사이의 기약분수는 [17/40], [19/40], [21/40], [23/40] 4개예요. 단원을 끝까지 해냈어요!" }) }
}
];
