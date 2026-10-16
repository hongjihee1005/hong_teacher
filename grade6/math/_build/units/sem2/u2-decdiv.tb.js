//@@APP
const APP={title:"과학 기술 체험관 소수의 나눗셈", unit:"6-2 수학 2. 소수의 나눗셈(교과서)", key:"t62-decdiv-v1", welcome:"과학 기술 체험관 소수의 나눗셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 지윤이·은우와 함께 과학 기술 체험관의 모래 로봇·스마트 신호등·로봇 실험실·종이접기·가상 현실·식물 공장을 돌아보며 (소수)÷(소수), (자연수)÷(소수)를 계산하고, 몫을 반올림하거나 나누어 주고 남는 양을 구해 봐요."};
//@@UNIT
/* ===== 2. 소수의 나눗셈 단원 조작 부품 (앞글자 dv2) =====
   수는 모두 BigInt 분수(분자/분모)로 계산해서 소수 계산 오차가 없어요.
   글 속 분수 표기: [36/10] → 화면에서 위아래로 쌓은 분수로 보여 줘요.
   화면 글에는 '나누어 주고 남는 양'만 써요(지도서 유의 사항). */

/*dv2-core*/
function dv2Norm(s) { return String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/[．。·]/g, ".").replace(/^\+/, ""); }
function dv2Gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; }
function dv2R(n, d = 1n) { if (d < 0n) { n = -n; d = -d; } const g = dv2Gcd(n, d) || 1n; return { n: n / g, d: d / g }; }
/* "0.5"·".5"·"5."·"3.60" → 분수, 수가 아니면 null */
function dv2P(s) {
  s = dv2Norm(s);
  if (!/^\d*\.?\d*$/.test(s) || !/\d/.test(s)) return null;
  const [i, f = ""] = s.split(".");
  if (f.length > 12) return null;
  return dv2R(BigInt((i || "0") + f), 10n ** BigInt(f.length));
}
const dv2Eq = (x, y) => !!x && !!y && x.n === y.n && x.d === y.d;
const dv2Add = (x, y) => dv2R(x.n * y.d + y.n * x.d, x.d * y.d);
const dv2Sub = (x, y) => dv2R(x.n * y.d - y.n * x.d, x.d * y.d);
const dv2Mul = (x, y) => dv2R(x.n * y.n, x.d * y.d);
const dv2Div = (x, y) => y.n === 0n ? null : dv2R(x.n * y.d, x.d * y.n);
const dv2Pow = k => 10n ** BigInt(k);
/* 식 계산: + − × ÷ (곱셈·나눗셈 먼저) */
function dv2E(e) {
  const t = String(e).replace(/−/g, "-").replace(/[x*]/g, "×").replace(/[\/:]/g, "÷").replace(/\s/g, "");
  const tk = t.match(/[+\-×÷]|[\d.]+/g); if (!tk || tk.join("") !== t) return null;
  let sum = dv2R(0n), sign = 1, cur = dv2P(tk[0]); if (cur == null) return null;
  for (let k = 1; k < tk.length; k += 2) {
    const op = tk[k], v = dv2P(tk[k + 1]); if (v == null) return null;
    if (op === "×") cur = dv2Mul(cur, v);
    else if (op === "÷") { cur = dv2Div(cur, v); if (!cur) return null; }
    else { sum = sign > 0 ? dv2Add(sum, cur) : dv2Sub(sum, cur); sign = op === "+" ? 1 : -1; cur = v; }
  }
  return sign > 0 ? dv2Add(sum, cur) : dv2Sub(sum, cur);
}
/* 나누어떨어지는 소수 글(아니면 null) */
function dv2Exact(r) {
  if (!r) return null;
  let k = 0; while (k < 30 && dv2Pow(k) % r.d !== 0n) k++;
  if (k >= 30) return null;
  return dv2Fix(r, k);
}
/* 소수 k자리까지 버림한 값(분수) */
function dv2TruncR(r, k) { const m = dv2Pow(k), neg = r.n < 0n, n = neg ? -r.n : r.n; const v = n * m / r.d; return dv2R(neg ? -v : v, m); }
/* 소수 k자리까지 반올림한 값(분수) */
function dv2RndR(r, k) { const m = dv2Pow(k); const v = (r.n * m * 2n + r.d) / (2n * r.d); return dv2R(v, m); }
/* 분수 → 소수 k자리 글(끝의 0도 그대로) */
function dv2Fix(r, k) {
  const m = dv2Pow(k), neg = r.n < 0n, n = neg ? -r.n : r.n, v = n * m / r.d;
  const s = v.toString().padStart(k + 1, "0"), i = s.slice(0, s.length - k), f = s.slice(s.length - k);
  return (neg ? "−" : "") + i + (k ? "." + f : "");
}
/* 보여 줄 글: 나누어떨어지면 그 소수, 아니면 셋째 자리까지 + … */
function dv2Str(r, k = 3) { if (!r) return "?"; const s = dv2Exact(r); return s != null ? s : dv2Fix(dv2TruncR(r, k), k) + "…"; }
const dv2V = e => dv2Str(dv2E(e));
function dv2Dn(s) { const m = dv2Norm(s).match(/\.(\d+)/); return m ? m[1].length : 0; }
const DV2PLACE = ["일의 자리", "소수 첫째 자리", "소수 둘째 자리", "소수 셋째 자리", "소수 넷째 자리"];
/* 받침에 맞는 조사(수는 마지막 숫자 읽기로) */
function dv2J(s, pair) {
  const str = String(s), c = str[str.length - 1];
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"], "이라": ["이라", "라"] };
  const [a, b] = M[pair];
  if (pair === "으로") return str + (has && !rieul ? a : b);
  return str + (has ? a : b);
}
const dv2Sp = e => String(e).replace(/÷/g, " ÷ ").replace(/×/g, " × ").replace(/\+/g, " + ").replace(/−/g, " − ");
/* 흔한 실수 찾기 (두 수의 나눗셈): 숫자는 맞고 소수점만 다르면 검산으로 알려 줘요 */
function dv2Diag(e, v) {
  if (!e || v == null) return null;
  const m = String(e).replace(/\s/g, "").match(/^([\d.]+)÷([\d.]+)$/); if (!m) return null;
  const ok = dv2E(e); if (!ok || dv2Eq(ok, v)) return null;
  for (let k = 1; k <= 4; k++) {
    for (const big of [true, false]) {
      const w = big ? dv2Mul(ok, dv2R(dv2Pow(k))) : dv2Div(ok, dv2R(dv2Pow(k)));
      if (dv2Eq(w, v)) {
        const back = dv2Str(dv2Mul(dv2P(m[2]), v));
        return `숫자는 맞는데 몫의 소수점 위치가 달라요. 검산해 봐요: ${m[2]} × ${dv2Str(v)} = ${dv2J(back, "이라")} ${dv2J(m[1], "이가")} 아니에요. 두 수의 소수점을 같은 자리만큼 옮겨 계산해요.`;
      }
    }
  }
  return null;
}
/* 분수 표기 [n/d], [w n/d] */
const DV2FR = "\\[(?:(\\d+) )?([\\d×().]+)\\/([\\d×().]+)\\]";
const dv2Re = () => new RegExp(DV2FR, "g");
function dv2Plain(s) { return String(s == null ? "" : s).replace(dv2Re(), (m, w, n, d) => `${w ? dv2J(w, "과와") + " " : ""}${d}분의 ${n}`); }
/*dv2-core-end*/

function dv2Style() {
  if (document.getElementById("dv2-style")) return;
  const s = document.createElement("style"); s.id = "dv2-style";
  s.textContent = `
.dv2fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.dv2fw{margin-right:.1em}
.dv2q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.dv2q>.dv2n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.dv2q>.dv2d{padding:.05em .14em 0}
.dv2row{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .4em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);margin:.4em 0;line-height:1.8}
input.dv2in{box-sizing:border-box;width:4.8em;height:1.7em;padding:0 .2em;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.dv2in.dv2w{width:8.5em}
input.dv2in.dv2s{width:3.4em}
.dv2fi{display:inline-flex;flex-direction:column;align-items:center;gap:.12em;vertical-align:middle}
.dv2fi input.dv2in{width:3.8em;height:1.45em}
.dv2fi .dv2bar{width:100%;height:0;font-size:0;line-height:0;border-top:.13em solid currentColor}
.dv2chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.dv2chs .opt{padding:.05em .55em}
.opt.dv2on{border-color:var(--ring);background:var(--ring-soft)}
.dv2q2{font-family:Jua,sans-serif;margin-top:.55em}
.dv2grp{border:2px solid var(--line);border-radius:.8em;padding:.35em .7em;margin:.45em 0}
.dv2gt{font-family:Jua,sans-serif;color:var(--night)}
.dv2ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.dv2stage svg{width:100%;height:auto;max-height:58vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r);touch-action:none;user-select:none}
.dv2fig svg{width:100%;height:auto;display:block;max-height:40vh;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.dv2rel{max-width:24em}
.dv2tools{display:flex;flex-wrap:wrap;gap:.4em;align-items:center;margin:.4em 0}
.dv2tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .75em;font-family:Jua,sans-serif;color:var(--ink)}
.dv2tools button:disabled{opacity:.45}
.dv2say{font-family:Jua,sans-serif;color:var(--night);font-size:calc(var(--fs)*1.05);margin:.3em 0}
.dv2say b{color:var(--ring);font-weight:400}
.dv2talk{border-left:5px solid var(--pine);background:#F4FAF6;border-radius:.5em;padding:.35em .8em;margin:.35em 0}
.dv2talk p{margin:.2em 0}
.dv2talk b{color:var(--pine);font-family:Jua,sans-serif;font-weight:400}
.dv2vts{display:flex;flex-wrap:wrap;gap:.8em 1.8em;align-items:flex-start;margin:.3em 0}
.dv2vbox{min-width:0;max-width:100%}
.dv2vcap{font-family:Jua,sans-serif;color:var(--night);font-size:var(--fs)}
.dv2lt{border-collapse:collapse;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.6);margin:.2em 0}
.dv2lt td{width:1.3em;height:1.45em;text-align:center;padding:0;line-height:1;position:relative}
.dv2lt td.dv2dvs{width:auto;padding:0 .1em 0 0;white-space:nowrap;text-align:right}
.dv2lt td.dv2lab{width:auto;white-space:nowrap;text-align:right;font-size:.5em;color:var(--pine);padding-right:.5em}
.dv2lt tr.dv2dd td.dv2dc{border-top:3px solid var(--ink)}
.dv2lt tr.dv2rr td.dv2rc{border-top:2px dashed #9AABA4}
.dv2paren{display:inline-block;transform:scaleY(1.25);margin-left:.05em}
.dv2lt input{box-sizing:border-box;width:1.15em;height:1.3em;font-size:.82em;text-align:center;font-family:Jua,sans-serif;border:2px solid var(--line);border-radius:.3em;padding:0;background:#fff;color:var(--ink)}
.dv2lt tr.dv2memo input{border-style:dashed;font-size:.68em;width:1.1em;height:1.15em;color:#5D6E68}
.dv2lt tr.dv2rr input{border-color:#E0A458}
.dv2g{color:#B3C1BB}
.dv2x{color:#B3C1BB;text-decoration:line-through}
.dv2dot{position:absolute;right:-.12em;bottom:.14em;width:.22em;height:.22em;border-radius:50%;background:#C8472E}
.dv2od{position:absolute;right:-.12em;bottom:.14em;width:.2em;height:.2em;border-radius:50%;border:2px solid #9AABA4;box-sizing:border-box}
.dv2ds{position:relative;display:inline-block;width:.68em;text-align:center}
.dv2ds .dv2dot,.dv2ds .dv2od{right:-.14em}
.dv2lt button.dv2pt,.dv2strip button.dv2pt{position:absolute;right:-.22em;bottom:.02em;width:.42em;height:.42em;border-radius:50%;border:2px dashed #C8472E;background:#fff;padding:0;z-index:2}
.dv2lt button.dv2pt.dv2pon,.dv2strip button.dv2pt.dv2pon{background:#C8472E;border-style:solid}
.dv2memo-cap{font-size:var(--fs-s);color:var(--muted);font-family:"Gowun Dodum",sans-serif}
.dv2strip{display:inline-flex;align-items:flex-end;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.6)}
.dv2strip span.dv2c{position:relative;display:inline-block;width:.95em;text-align:center}
.dv2strip span.dv2c .dv2od{right:-.15em}
.dv2shrow{display:flex;flex-wrap:wrap;align-items:center;gap:.2em .7em;margin:.3em 0;font-family:Jua,sans-serif}
.dv2shrow .dv2op{font-size:calc(var(--fs)*1.5)}
.dv2tag{font-size:var(--fs-s);color:#C8472E;font-family:Jua,sans-serif;min-width:3.5em;display:inline-block;text-align:center}
.dv2res{font-family:Jua,sans-serif;color:var(--pine);font-size:calc(var(--fs)*1.2)}
.dv2dg{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.35);border:2px dashed #C9D4CF;margin:0 .06em;background:#fff;border-radius:.3em;padding:0 .08em;min-width:.9em;color:var(--ink);line-height:1.2}
.dv2dg.dv2pk{border-color:var(--ring);background:var(--ring-soft)}
.dv2pnt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.35)}
.dv2cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.dv2cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2em;text-align:center}
.dv2cards .opt:disabled{opacity:.3}
.dv2slots{display:flex;gap:.3em;margin:.4em 0;flex-wrap:wrap;align-items:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4)}
.dv2slot{min-width:1.7em;height:2em;border:2px dashed var(--ring);border-radius:.4em;background:#fff;font-family:Jua,sans-serif;font-size:1em;padding:0 .2em;color:var(--ink)}
.dv2score{display:flex;flex-wrap:wrap;gap:.6em;font-family:Jua,sans-serif;margin:.3em 0}
.dv2score span{border-radius:.6em;padding:.15em .7em;border:2px solid var(--line)}
.dv2score span.dv2turn{border-color:var(--ring);background:var(--ring-soft)}
.dv2note{font-size:var(--fs-s);color:var(--muted)}
.dv2die{display:inline-grid;place-items:center;width:1.8em;height:1.8em;border:3px solid var(--ink);border-radius:.35em;background:#fff;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.5)}
.dv2bgw{display:flex;flex-wrap:wrap;gap:1em 1.6em;align-items:flex-start}
.dv2bgw>div{flex:1 1 20em;min-width:0;max-width:26em}
.dv2bgw>div+div{flex:1 1 12em;max-width:16em}
.dv2bg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.3em;width:100%}
.dv2bc{position:relative;min-height:4.2em;border:2px solid var(--line);border-radius:.6em;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.15em;padding:.2em;font-family:Jua,sans-serif;font-size:var(--fs);word-break:keep-all;text-align:center}
.dv2bot .dv2bc{min-height:2.6em;font-size:var(--fs-s)}
.dv2bc input{box-sizing:border-box;width:4em;font-family:Jua,sans-serif;font-size:var(--fs);text-align:center;border:2px solid var(--line);border-radius:.3em}
.dv2bc.dv2mk{background:#FFF1D6;border-color:var(--ring)}
.dv2bc.dv2mk::after{content:"";position:absolute;inset:.35em;border:4px solid #C8472E;border-radius:50%;pointer-events:none;opacity:.75}
.dv2bc button.dv2rm{position:absolute;top:.1em;right:.2em;border:none;background:none;color:var(--muted);font-size:.85em;padding:0}
.dv2chips{display:flex;flex-wrap:wrap;gap:.35em;margin:.3em 0}
.dv2chips .opt{font-family:Jua,sans-serif;padding:.1em .5em}
.dv2chips .opt:disabled{opacity:.3}
.dv2jr{display:flex;flex-wrap:wrap;gap:.6em;margin:.3em 0}
.dv2jr>div{border:2px solid #C9D4CF;border-radius:.7em;background:#FFFDF4;padding:.35em .7em;font-size:var(--fs);max-width:22em}
.dv2jr b{font-family:Jua,sans-serif;font-weight:400;color:var(--pine)}
`;
  document.head.append(s);
}
/* 분수 모양 요소와 글 속 분수 바꾸기 */
function dv2FracEl(w, n, d) {
  return h("span", { class: "dv2fr" }, w ? h("span", { class: "dv2fw" }, String(w)) : null,
    h("span", { class: "dv2q" }, h("span", { class: "dv2n" }, String(n)), h("span", { class: "dv2d" }, String(d))));
}
function dv2RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow,input")) return;
  const re = dv2Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(dv2FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function dv2RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return dv2RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(dv2RenderText);
}
(function dv2Boot() {
  dv2Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") dv2RenderText(m.target); else m.addedNodes.forEach(dv2RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(dv2Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
function dv2A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(dv2Plain) }) }); }
const dv2Quiz0 = quiz, dv2Blanks0 = blanks;
quiz = (b, a, items, o) => dv2Quiz0(b, dv2A(a), items, o);
blanks = (b, a, parts, o) => dv2Blanks0(b, dv2A(a), parts, o);

const DV2C = { a: "#F6C08A", b: "#9CC6EC", t: "#F4A7B9", g: "#A9D8A2", line: "#C9D4CF", dark: "#7A8C86", red: "#C8472E", blue: "#2B7BD6", orange: "#E8913A", sand: "#FFF3D6", sea: "#DDF0F8" };
function dv2Fig(svg, cls) { return h("div", { class: cls || "dv2fig" }, svg); }
function dv2Talk(lines) { return h("div", { class: "dv2talk" }, lines.map(([who, t]) => h("p", {}, h("b", {}, who + " "), t))); }
/* 몫이 같은 나눗셈 그림: rows=[["5","1","5"],["50","10","5"]], lab="10배" */
function dv2RelFig(rows, lab) {
  const W = 560, gapY = 92, H = 50 + (rows.length - 1) * gapY + 30, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const xs = { a: 140, o: 228, b: 310, e: 392, q: 468 };
  rows.forEach(([a, b, q], k) => {
    const y = 40 + k * gapY;
    g.append(txt(xs.a, y, a, 30), txt(xs.o, y, "÷", 30), txt(xs.b, y, b, 30), txt(xs.e, y, "=", 30), txt(xs.q, y, q, 30, { fill: "#2E8B57" }));
    if (k) {
      const y0 = y - gapY + 22, y1 = y - 22;
      ["a", "b"].forEach(c => {
        g.append(svgEl("line", { x1: xs[c], y1: y0, x2: xs[c], y2: y1 - 6, stroke: DV2C.red, "stroke-width": 2.5 }), svgEl("path", { d: `M${xs[c] - 6} ${y1 - 10} L${xs[c]} ${y1} L${xs[c] + 6} ${y1 - 10} z`, fill: DV2C.red }));
        g.append(txt(xs[c] + 38, (y0 + y1) / 2, lab, 17, { fill: DV2C.red }));
      });
      g.append(txt(xs.q + 44, (y0 + y1) / 2, "같아요", 16, { fill: "#2E8B57" }));
    }
  });
  return dv2Fig(svg, "dv2fig dv2rel");
}

/* ===== 묻는 칸 만들기 (모든 부품이 함께 씀) =====
   줄(parts): "글" | {n:"4", e:"3.6÷0.9", r:["7÷3",1], why:{"틀린 값":"까닭"}} 수 칸 | {f:["36","10"]} 분수 칸 | {o:[…], a, why} 고르기 | {m:[…], a:[…]} 여러 개 | {el: () => 요소} */
function dv2Reg() { return { items: [], plain: [] }; }
function dv2Parts(parts, reg) {
  const row = h("div", { class: "dv2row" }); const plain = [];
  parts.forEach(pt => {
    if (pt == null) return;
    if (typeof pt === "string" || typeof pt === "number") { row.append(h("span", {}, String(pt))); plain.push(dv2Plain(String(pt))); return; }
    if (pt.el) { row.append(pt.el()); return; }
    if (pt.n != null) {
      const want = dv2P(pt.n); if (want == null) throw new Error("답 형식 오류: " + pt.n);
      if (pt.e) { const v = dv2E(pt.e); if (!dv2Eq(v, want)) throw new Error(`답 확인 필요: ${pt.e} = ${pt.n} (계산 ${dv2Str(v)})`); }
      if (pt.r) { const v = dv2RndR(dv2E(pt.r[0]), pt.r[1]); if (!dv2Eq(v, want)) throw new Error(`반올림 답 확인 필요: ${pt.r[0]} → ${pt.n}`); }
      const inp = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "dv2in" + (pt.w ? " dv2w" : "") + (pt.s ? " dv2s" : ""), "aria-label": "빈칸" });
      row.append(inp); reg.items.push({ k: "n", pt, inp, want }); plain.push(String(pt.n)); return;
    }
    if (pt.f) {
      const ni = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "dv2in", "aria-label": "분자" });
      const di = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "dv2in", "aria-label": "분모" });
      row.append(h("span", { class: "dv2fi" }, ni, h("span", { class: "dv2bar" }, "​"), di));
      reg.items.push({ k: "f", pt, ni, di }); plain.push(`[${pt.f[0]}/${pt.f[1]}]`); return;
    }
    if (pt.o || pt.m) {
      const multi = !!pt.m, list = pt.o || pt.m, sel = new Set(), box = h("span", { class: "dv2chs" });
      list.forEach((o, i) => box.append(h("button", { class: "opt", onclick: ev => {
        if (multi) { sel.has(i) ? sel.delete(i) : sel.add(i); ev.currentTarget.classList.toggle("dv2on"); }
        else { sel.clear(); sel.add(i); [...box.children].forEach(b => b.classList.remove("dv2on")); ev.currentTarget.classList.add("dv2on"); }
        [...box.children].forEach(b => b.classList.remove("good", "bad"));
      } }, o)));
      row.append(box); reg.items.push({ k: multi ? "m" : "o", pt, box, sel });
      plain.push(multi ? pt.a.map(i => list[i]).join(", ") : list[pt.a]); return;
    }
  });
  reg.plain.push(plain.join(" "));
  return row;
}
/* 줄 묶음: rows = [parts | {q:"물음", p:parts} | {fig: () => 요소, q?, p?} | {g:"제목", rows:[…]}] */
function dv2Rows(rows, reg) {
  const wrap = h("div");
  rows.forEach(r => {
    if (Array.isArray(r)) return wrap.append(dv2Parts(r, reg));
    if (r.g) { const g = h("div", { class: "dv2grp" }, h("div", { class: "dv2gt" }, r.g)); g.append(dv2Rows(r.rows, reg)); wrap.append(g); return; }
    if (r.fig) wrap.append(r.fig());
    if (r.q) wrap.append(h("div", { class: "dv2q2" }, r.q));
    if (r.p) wrap.append(dv2Parts(r.p, reg));
  });
  return wrap;
}
const dv2Int = s => { const t = dv2Norm(s); return /^\d+$/.test(t) ? String(BigInt(t)) : null; };
/* 채점: 처음 틀린 곳의 까닭을 돌려줘요 */
function dv2Judge(reg, opt = {}) {
  let bad = null; const given = [];
  reg.items.forEach(it => {
    const pt = it.pt;
    if (it.k === "n") {
      const raw = it.inp.value.trim(), v = dv2P(raw), ok = v != null && dv2Eq(v, it.want);
      it.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; given.push(raw || "-");
      if (!ok && !bad) bad = raw === "" ? "빈칸에 답을 써요." : v == null ? "칸에는 수만 써요. 소수는 0.5처럼 써요." :
        (pt.why && pt.why[dv2Str(v)]) || dv2Diag(pt.e, v) || pt.bad || opt.bad || "빨간 칸을 다시 생각해 봐요.";
      return;
    }
    if (it.k === "f") {
      const nr = it.ni.value.trim(), dr = it.di.value.trim(), n = dv2Int(nr), d = dv2Int(dr);
      const okN = n === String(BigInt(pt.f[0])), okD = d === String(BigInt(pt.f[1]));
      it.ni.style.borderColor = okN ? "var(--ok)" : "var(--no)"; it.di.style.borderColor = okD ? "var(--ok)" : "var(--no)";
      given.push(`${nr || "-"}/${dr || "-"}`);
      if ((!okN || !okD) && !bad) bad = (!nr || !dr) ? "분수의 분자와 분모 칸을 모두 채워요." : n == null || d == null ? "분수 칸에는 자연수만 써요." :
        (pt.why && pt.why[`${n}/${d}`]) || (!okD && /^10+$/.test(pt.f[1]) ? "소수 한 자리 수는 분모가 10인 분수로, 소수 두 자리 수는 분모가 100인 분수로 나타내요. 두 수의 분모를 같게 해요." : null) || pt.bad || "분수 칸을 다시 살펴봐요.";
      return;
    }
    const list = pt.o || pt.m, picked = [...it.sel];
    const ok = it.k === "m" ? picked.length === pt.a.length && pt.a.every(i => it.sel.has(i)) : picked[0] === pt.a;
    [...it.box.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (it.sel.has(i)) b.classList.add(ok ? "good" : "bad"); });
    given.push(picked.length ? picked.map(i => list[i]).join("·") : "-");
    if (!ok && !bad) bad = !picked.length ? "고르지 않은 칸이 있어요." : (it.k === "o" && pt.why && pt.why[picked[0]]) || pt.bad ||
      (it.k === "m" ? "알맞은 것을 모두 골라요. 빠진 것이나 더 고른 것이 있어요." : "고른 것을 다시 살펴봐요.");
  });
  return { bad, given: given.join(" / ") };
}
/* 확인 단추(그림 조작 검사 → 줄 묶음 채점) */
function dv2Check(body, api, reg, opt, pre) {
  body.__dv2 = () => reg;
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const p = pre ? pre() : null;
    if (p && p.bad) return api.fail(p.bad, p.given || "-");
    const r = dv2Judge(reg, opt);
    const g = [p && p.given, r.given].filter(Boolean).join(" / ");
    if (r.bad) return api.fail(r.bad, g);
    api.tryOnce(); api.done(g, opt.ok);
  } }, "확인하기")));
}
/* ① 빈칸 줄 문제 */
function dv2Sent(body, api, rows, opt = {}) {
  dv2Style();
  const reg = dv2Reg();
  if (opt.fig) body.append(opt.fig());
  body.append(dv2Rows(rows, reg));
  api.provide({ words: opt.words || [], answers: reg.plain.filter(Boolean) });
  dv2Check(body, api, reg, opt);
}

/* ===== ② 0.1 칸 막대를 몇 칸씩 묶기 =====
   opt: {n:36, per:9, cell:"0.1", step:"0.9", unit:"kg", asks, ok} — 한 줄에 10칸(=1) */
function dv2Bars(body, api, opt) {
  dv2Style();
  const N = opt.n, per = opt.per, full = Math.floor(N / per), rowsN = Math.ceil(N / 10);
  const cw = 60, x0 = 50, bh = 46, gap = 84, W = x0 * 2 + cw * 10, H = 40 + rowsN * gap;
  const svg = makeSvg(W, H), g = svgEl("g"), pv = svgEl("g"); svg.append(g, pv);
  const groups = []; let drag = -1;
  const step = opt.step || dv2Str(dv2Mul(dv2P(opt.cell || "0.1"), dv2R(BigInt(per))));
  const say = h("div", { class: "dv2say" }, "​");
  const pos = i => ({ x: x0 + (i % 10) * cw, y: 34 + Math.floor(i / 10) * gap });
  const next = () => groups.length * per;
  const draw = () => {
    g.innerHTML = ""; pv.innerHTML = "";
    for (let i = 0; i < N; i++) {
      const p = pos(i), gi = Math.floor(i / per), inG = gi < groups.length;
      g.append(svgEl("rect", { x: p.x, y: p.y, width: cw, height: bh, fill: inG ? (gi % 2 ? DV2C.b : DV2C.a) : "#fff", stroke: DV2C.dark, "stroke-width": 1.4 }));
    }
    for (let r = 0; r < rowsN; r++) {
      const n = Math.min(10, N - r * 10), y = 34 + r * gap;
      g.append(svgEl("rect", { x: x0, y, width: cw * n, height: bh, fill: "none", stroke: INK, "stroke-width": 2.5 }));
      if (n === 10) g.append(txt(x0 - 26, y + bh / 2, "1", 18, { fill: DV2C.dark }));
    }
    // 묶음 선(줄을 넘으면 나누어 그려요)
    groups.forEach((_, k) => {
      const s0 = k * per, e0 = s0 + per - 1;
      for (let r = Math.floor(s0 / 10); r <= Math.floor(e0 / 10); r++) {
        const a = Math.max(s0, r * 10), b = Math.min(e0, r * 10 + 9), pa = pos(a), pb = pos(b);
        g.append(svgEl("rect", { x: pa.x + 3, y: pa.y + 3, width: pb.x + cw - pa.x - 6, height: bh - 6, rx: 12, fill: "none", stroke: DV2C.red, "stroke-width": 3 }));
        if (r === Math.floor(s0 / 10)) g.append(txt(pa.x + 14, pa.y - 9, String(k + 1), 15, { fill: DV2C.red }));
      }
    });
    if (drag >= 0) {
      const s0 = next(), e0 = Math.max(s0, drag);
      for (let i = s0; i <= Math.min(e0, N - 1); i++) { const p = pos(i); pv.append(svgEl("rect", { x: p.x + 4, y: p.y + 4, width: cw - 8, height: bh - 8, fill: "#F4A7B9", opacity: .55 })); }
      pv.append(txt(W / 2, H - 12, `${Math.min(e0, N - 1) - s0 + 1}칸`, 18, { fill: DV2C.red }));
    }
    const left = N - next();
    say.innerHTML = ""; say.append(`${step}씩 `, h("b", {}, String(groups.length)), `묶음 · 묶지 않은 칸 ${left}칸`);
  };
  const at = pt => { for (let r = 0; r < rowsN; r++) { const y = 34 + r * gap; if (pt.y >= y - 8 && pt.y <= y + bh + 8) { const c = Math.floor((pt.x - x0) / cw); const i = r * 10 + c; if (c >= 0 && c < 10 && i < N) return i; } } return -1; };
  const addGroup = () => {
    if (N - next() < per) { say.textContent = `남은 칸이 ${per}칸보다 적어서 더 묶을 수 없어요.`; return false; }
    groups.push(1); draw(); return true;
  };
  dragOn(svg, pt => { const i = at(pt); if (i < 0) return false; if (i < next()) { say.textContent = "이미 묶은 칸이에요. 묶지 않은 칸부터 끌어서 묶어요."; return false; } drag = i; draw(); return true; },
    pt => { const i = at(pt); if (i >= 0) { drag = i; draw(); } },
    () => {
      const len = drag - next() + 1; drag = -1;
      if (len === per) { addGroup(); return; }
      draw(); say.textContent = `${step}는 ${opt.cell || "0.1"}이 ${per}칸이에요. 묶지 않은 첫 칸부터 ${per}칸을 끌어서 묶어요. (지금 ${len}칸)`;
    });
  const tools = h("div", { class: "dv2tools" },
    h("button", { onclick: () => addGroup() }, `${per}칸 한 번에 묶기`),
    h("button", { onclick: () => { groups.pop(); draw(); } }, "마지막 묶음 풀기"),
    h("button", { onclick: () => { groups.length = 0; draw(); } }, "처음으로"));
  draw();
  const reg = dv2Reg();
  const asks = opt.asks ? h("div", { class: "dv2ask" }, dv2Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dv2say" }, opt.tip || `한 칸은 ${opt.cell || "0.1"}이에요. 묶지 않은 첫 칸부터 ${per}칸을 끌어서 ${step}씩 묶어요.`), h("div", { class: "dv2stage" }, svg), say, tools, asks);
  body.__dv2solve = () => { groups.length = 0; for (let k = 0; k < full; k++) groups.push(1); draw(); };
  api.provide({ words: opt.words || [], answers: [`${step}씩 ${full}묶음`].concat(reg.plain) });
  dv2Check(body, api, reg, opt, () => groups.length !== full ? { bad: groups.length < full ? `아직 더 묶을 수 있어요. ${step}씩 끝까지 묶어요.` : "너무 많이 묶었어요.", given: `${groups.length}묶음` } : { given: `${groups.length}묶음` });
}

/* ===== ③ 수직선에서 몇씩 뛰어 세기(묶어 덜어 내기) =====
   opt: {to:"3.75", step:"1.25", max:"4", tick:"1", unit:"m", sub:{k:100, unit:"cm"}, rem:"남는 흙", asks, ok} */
function dv2Line(body, api, opt) {
  dv2Style();
  const TO = dv2P(opt.to), ST = dv2P(opt.step), MX = dv2P(opt.max), TK = dv2P(opt.tick || "1");
  const full = Number(TO.n * ST.d / (TO.d * ST.n));
  const W = 760, x0 = 50, L = 660, y = 96, sy = 196, H = opt.sub ? 250 : 160;
  const svg = makeSvg(W, H), g = svgEl("g"), arcs = svgEl("g"), pv = svgEl("g"); svg.append(g, arcs, pv);
  const X = r => x0 + L * Number(r.n * MX.d) / Number(r.d * MX.n);
  const num = r => Number(r.n) / Number(r.d);
  let hops = 0, drag = null;
  const say = h("div", { class: "dv2say" }, "​");
  const axis = (yy, k, unit) => {
    g.append(svgEl("line", { x1: x0 - 10, y1: yy, x2: x0 + L + 16, y2: yy, stroke: INK, "stroke-width": 3 }), svgEl("path", { d: `M${x0 + L + 16} ${yy - 7} l12 7 l-12 7 z`, fill: INK }));
    const nT = Math.round(num(MX) / num(TK));
    for (let i = 0; i <= nT; i++) {
      const v = dv2Mul(TK, dv2R(BigInt(i))), x = X(v);
      g.append(svgEl("line", { x1: x, y1: yy - 12, x2: x, y2: yy + 12, stroke: INK, "stroke-width": 2 }));
      g.append(txt(x, yy + 30, dv2Str(dv2Mul(v, dv2R(BigInt(k)))), 19));
    }
    if (!opt.sub || k === 1) {   // 0.1 작은 눈금
      const nm = Math.round(num(MX) * 10);
      if (nm <= 120) for (let i = 1; i < nm; i++) { const x = X(dv2R(BigInt(i), 10n)); if (i % 10) g.append(svgEl("line", { x1: x, y1: yy - 6, x2: x, y2: yy + 6, stroke: DV2C.dark, "stroke-width": 1 })); }
    }
    g.append(txt(x0 + L + 30, yy + 30, unit, 17, { fill: DV2C.dark }));
  };
  const draw = () => {
    g.innerHTML = ""; arcs.innerHTML = ""; pv.innerHTML = "";
    axis(y, 1, opt.unit);
    if (opt.sub) axis(sy, opt.sub.k, opt.sub.unit);
    const xt = X(TO);
    g.append(svgEl("path", { d: `M${xt - 9} ${y - 52} l18 0 l-9 14 z`, fill: DV2C.red }), txt(xt, y - 64, `${opt.to} ${opt.unit}`, 18, { fill: DV2C.red }));
    if (opt.sub) g.append(svgEl("line", { x1: xt, y1: y + 44, x2: xt, y2: sy - 14, stroke: DV2C.red, "stroke-width": 1.5, "stroke-dasharray": "5 4" }), txt(xt, sy - 26, dv2Str(dv2Mul(TO, dv2R(BigInt(opt.sub.k)))), 17, { fill: DV2C.red }));
    for (let k = 0; k < hops; k++) {
      const a = X(dv2Mul(ST, dv2R(BigInt(k)))), b = X(dv2Mul(ST, dv2R(BigInt(k + 1)))), m = (a + b) / 2;
      arcs.append(svgEl("path", { d: `M${a} ${y - 4} Q${m} ${y - 58} ${b} ${y - 4}`, fill: "none", stroke: k % 2 ? DV2C.blue : DV2C.orange, "stroke-width": 3 }));
      arcs.append(svgEl("path", { d: `M${b} ${y - 4} l-11 -9 l12 -3 z`, fill: k % 2 ? DV2C.blue : DV2C.orange }));
      arcs.append(txt(m, y - 40, `${k + 1}`, 15, { fill: k % 2 ? DV2C.blue : DV2C.orange }));
      if (opt.sub) {
        const v = dv2Mul(ST, dv2R(BigInt(k + 1)));
        arcs.append(svgEl("circle", { cx: b, cy: sy, r: 6, fill: DV2C.blue }));
        if (!dv2Eq(v, TO)) arcs.append(txt(b, sy - 24, dv2Str(dv2Mul(v, dv2R(BigInt(opt.sub.k)))), 16, { fill: DV2C.blue }));
      }
    }
    if (opt.rem && hops === full) {
      const a = X(dv2Mul(ST, dv2R(BigInt(full))));
      if (xt - a > 1) arcs.append(svgEl("line", { x1: a, y1: y, x2: xt, y2: y, stroke: DV2C.red, "stroke-width": 9, "stroke-linecap": "round", opacity: .75 }), txt((a + xt) / 2 + 18, y + 52, opt.rem, 16, { fill: DV2C.red }));
    }
    if (drag) {
      const a = X(dv2Mul(ST, dv2R(BigInt(hops)))), b = Math.max(a, Math.min(x0 + L, drag.x));
      pv.append(svgEl("path", { d: `M${a} ${y - 4} Q${(a + b) / 2} ${y - 50} ${b} ${y - 4}`, fill: "none", stroke: DV2C.red, "stroke-width": 2, "stroke-dasharray": "6 5" }));
    }
    say.innerHTML = ""; say.append(`${opt.step} ${opt.unit}씩 `, h("b", {}, String(hops)), "번 뛰었어요" + (hops ? ` (${dv2Str(dv2Mul(ST, dv2R(BigInt(hops))))} ${opt.unit}까지)` : "") + ".");
  };
  const hop = () => {
    if (hops + 1 > full) { say.textContent = `더 뛸 수 없어요. 남은 양이 ${opt.step} ${opt.unit}보다 적어요.`; return; }
    hops++; draw();
  };
  dragOn(svg, pt => { const a = X(dv2Mul(ST, dv2R(BigInt(hops)))); if (Math.abs(pt.x - a) < 44 && Math.abs(pt.y - y) < 60) { drag = pt; draw(); return true; } return false; },
    pt => { drag = pt; draw(); },
    pt => { const a = X(dv2Mul(ST, dv2R(BigInt(hops)))), w = X(ST) - x0; drag = null; if (pt.x - a > w * 0.6) hop(); else draw(); });
  const tools = h("div", { class: "dv2tools" },
    h("button", { onclick: hop }, `${opt.step} ${opt.unit}만큼 뛰기`),
    h("button", { onclick: () => { hops = Math.max(0, hops - 1); draw(); } }, "한 번 되돌리기"),
    h("button", { onclick: () => { hops = 0; draw(); } }, "처음으로"));
  draw();
  const reg = dv2Reg();
  const asks = opt.asks ? h("div", { class: "dv2ask" }, dv2Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dv2say" }, opt.tip || `0에서 오른쪽으로 끌거나 단추를 눌러 ${opt.step} ${opt.unit}씩 뛰어 세어요.`), h("div", { class: "dv2stage" }, svg), say, tools, asks);
  body.__dv2solve = () => { hops = full; draw(); };
  api.provide({ words: opt.words || [], answers: [`${opt.step}씩 ${full}번`].concat(reg.plain) });
  dv2Check(body, api, reg, opt, () => hops !== full ? { bad: `${opt.to} ${opt.unit}까지 ${opt.step} ${opt.unit}씩 뛸 수 있는 만큼 끝까지 뛰어 세어요.`, given: `${hops}번` } : { given: `${hops}번` });
}

/* ===== ④ 종이를 똑같이 나누어 접기 =====
   opt: {len:"10", part:"2.5", snap:"0.5", unit:"cm", asks, ok} */
function dv2Fold(body, api, opt) {
  dv2Style();
  const LEN = dv2P(opt.len), PART = dv2P(opt.part), SN = dv2P(opt.snap || "0.5");
  const n = Number(dv2Div(LEN, SN).n), pu = Number(dv2Div(PART, SN).n), cnt = n / pu;
  const W = 760, x0 = 30, Lp = 700, y = 46, bh = 70, ry = 150, H = 205;
  const svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const folds = new Set();
  const say = h("div", { class: "dv2say" }, "​");
  const xs = k => x0 + Lp * k / n;
  const val = k => dv2Str(dv2Mul(SN, dv2R(BigInt(k))));
  const draw = () => {
    g.innerHTML = "";
    g.append(svgEl("rect", { x: x0, y, width: Lp, height: bh, fill: "#FCE8C8", stroke: "#C99A57", "stroke-width": 2.5 }));
    const list = [0, ...[...folds].sort((a, b) => a - b), n];
    for (let i = 0; i + 1 < list.length; i++) {
      const a = xs(list[i]), b = xs(list[i + 1]);
      g.append(txt((a + b) / 2, y + bh / 2, `${val(list[i + 1] - list[i])} ${opt.unit}`, 17, { fill: "#8A5A1E" }));
    }
    folds.forEach(k => g.append(svgEl("line", { x1: xs(k), y1: y - 8, x2: xs(k), y2: y + bh + 8, stroke: DV2C.blue, "stroke-width": 3, "stroke-dasharray": "8 6" })));
    // 자: mm 눈금
    g.append(svgEl("rect", { x: x0, y: ry - 12, width: Lp, height: 44, fill: "#F3F7F5", stroke: DV2C.line }));
    const mm = Math.round(Number(LEN.n) / Number(LEN.d) * 10);
    for (let i = 0; i <= mm; i++) { const x = x0 + Lp * i / mm, big = i % 10 === 0, mid = i % 5 === 0; g.append(svgEl("line", { x1: x, y1: ry - 12, x2: x, y2: ry - 12 + (big ? 20 : mid ? 14 : 8), stroke: INK, "stroke-width": big ? 2 : 1 })); if (big) g.append(txt(x, ry + 20, String(i / 10), 15)); }
    g.append(txt(x0 + Lp - 4, ry + 42, opt.unit, 14, { fill: DV2C.dark, "text-anchor": "end" }));
    say.innerHTML = ""; say.append("접는 선 ", h("b", {}, String(folds.size)), `개 → ${folds.size + 1}칸`);
  };
  svg.addEventListener("pointerdown", e => {
    const pt = svgPt(svg, e); if (pt.y < y - 14 || pt.y > y + bh + 14) return;
    const k = Math.round((pt.x - x0) / Lp * n); if (k <= 0 || k >= n) return;
    folds.has(k) ? folds.delete(k) : folds.add(k); draw();
  });
  const tools = h("div", { class: "dv2tools" }, h("button", { onclick: () => { folds.clear(); draw(); } }, "접는 선 모두 지우기"));
  draw();
  const reg = dv2Reg();
  const asks = opt.asks ? h("div", { class: "dv2ask" }, dv2Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dv2say" }, opt.tip || `종이를 눌러 접는 선을 놓아요(${opt.snap || "0.5"} ${opt.unit}마다 붙어요). 접는 선을 다시 누르면 지워져요.`), h("div", { class: "dv2stage" }, svg), say, tools, asks);
  body.__dv2solve = () => { folds.clear(); for (let k = pu; k < n; k += pu) folds.add(k); draw(); };
  api.provide({ words: opt.words || [], answers: [`${opt.part} ${opt.unit}씩 ${cnt}칸`].concat(reg.plain) });
  dv2Check(body, api, reg, opt, () => {
    const list = [0, ...[...folds].sort((a, b) => a - b), n], eq = list.every((k, i) => i === 0 || k - list[i - 1] === pu);
    return eq ? { given: `${cnt}칸` } : { bad: `칸의 길이가 모두 ${opt.part} ${opt.unit}가 되도록 접는 선을 놓아요. 자의 눈금을 보며 ${opt.part} ${opt.unit}마다 놓아요.`, given: `${folds.size + 1}칸` };
  });
}

/* ===== ⑤ 두 수의 소수점을 옮겨 자연수의 나눗셈으로 바꾸기 =====
   opt: {items:[{a:"3.6", b:"0.9", both:true, shift?:1}], asks, ok} — 숫자는 그대로, 빨간 소수점이 움직여요. */
function dv2Shift(body, api, opt) {
  dv2Style();
  if (opt.fig) body.append(opt.fig());
  const reg = dv2Reg();
  const rows = opt.items.map(it => {
    const A = dv2Norm(it.a), B = dv2Norm(it.b), D = Math.max(dv2Dn(A), dv2Dn(B), it.shift || 0);
    const mk = s => { const [i, f = ""] = s.split("."); const cells = (i + f.padEnd(D, "0")).split("").map((d, k) => ({ d, g: k >= i.length + f.length })); return { cells, p0: i.length - 1, p: i.length - 1 }; };
    const sa = mk(A), sb = mk(B);
    const valOf = s => dv2P(s.cells.slice(0, s.p + 1).map(c => c.d).join("") + "." + s.cells.slice(s.p + 1).map(c => c.d).join(""));
    const tagOf = s => { const k = s.p - s.p0; return k > 0 ? `${dv2Pow(k)}배` : k === 0 ? "그대로" : `[1/${dv2Pow(-k)}]배`; };
    const res = h("span", { class: "dv2res" }, "​");
    const strip = s => {
      const pts = [], tag = h("span", { class: "dv2tag" }, "​");
      const paint = () => {
        pts.forEach((b, j) => b.classList.toggle("dv2pon", j === s.p && j < s.cells.length - 1));
        s.spans.forEach((sp, j) => { const od = sp.querySelector(".dv2od"); if (od) od.style.display = j === s.p0 && s.p !== s.p0 ? "" : "none"; });
        tag.textContent = tagOf(s);
        res.textContent = `→ ${dv2Str(valOf(sa))} ÷ ${dv2Str(valOf(sb))}`;
      };
      s.spans = s.cells.map((c, j) => {
        const b = h("button", { class: "dv2pt", "aria-label": `${j + 1}번째 숫자 뒤에 소수점`, onclick: () => { s.p = j; rows.forEach(r => r.paint()); } }, "​");
        pts.push(b);
        return h("span", { class: "dv2c" + (c.g ? " dv2g" : "") }, c.d, h("span", { class: "dv2od", style: "display:none" }, "​"), b);
      });
      s.paint = paint;
      return h("span", { style: "display:inline-flex;flex-direction:column;align-items:center" }, h("span", { class: "dv2strip" }, s.spans), tag);
    };
    const row = h("div", { class: "dv2shrow" }, strip(sa), h("span", { class: "dv2op" }, "÷"), strip(sb), res);
    const paint = () => { sa.paint(); sb.paint(); };
    const judge = () => {
      const ka = sa.p - sa.p0, kb = sb.p - sb.p0, va = valOf(sa), vb = valOf(sb);
      const isInt = v => v.d === 1n;
      const giv = `${dv2Str(va)}÷${dv2Str(vb)}`;
      if (!ka && !kb) return { bad: `${A} ÷ ${B}: 빨간 동그라미를 눌러 두 수의 소수점을 옮겨요.`, given: giv };
      if (!ka) return { bad: `${A} ÷ ${B}: 나누는 수만 옮겼어요. 나누어지는 수의 소수점도 같은 자리만큼 옮겨야 몫이 같아요.`, given: giv };
      if (!kb) return { bad: `${A} ÷ ${B}: 나누어지는 수만 옮겼어요. 나누는 수의 소수점도 같은 자리만큼 옮겨야 몫이 같아요.`, given: giv };
      if (ka !== kb) return { bad: `${A} ÷ ${B}: 나누어지는 수는 ${ka}자리, 나누는 수는 ${kb}자리 옮겼어요. 두 수의 소수점을 같은 자리만큼 옮겨야(각각 똑같이 10배, 100배 해야) 몫이 같아요.`, given: giv };
      if (ka < 0) return { bad: "소수점을 오른쪽으로 옮겨 두 수를 각각 10배, 100배 해요.", given: giv };
      if (!isInt(vb)) return { bad: `${A} ÷ ${B}: 나누는 수가 자연수가 되도록 소수점을 더 옮겨요.`, given: giv };
      if (it.both && !isInt(va)) return { bad: `${A} ÷ ${B}: 나누어지는 수와 나누는 수가 모두 자연수가 되도록 옮겨요.`, given: giv };
      if (it.shift != null && kb !== it.shift) return { bad: `${A} ÷ ${B}: 이번에는 나누는 수가 자연수가 되는 만큼만(각각 ${dv2Pow(it.shift)}배) 옮겨요.`, given: giv };
      return { given: giv };
    };
    const ans = (() => { const k = it.shift != null ? it.shift : Math.max(dv2Dn(B), it.both ? dv2Dn(A) : 0); const m = dv2R(dv2Pow(k)); return `${A} ÷ ${B} → ${dv2Str(dv2Mul(dv2P(A), m))} ÷ ${dv2Str(dv2Mul(dv2P(B), m))}`; })();
    const solve = () => { const k = it.shift != null ? it.shift : Math.max(dv2Dn(B), it.both ? dv2Dn(A) : 0); sa.p = sa.p0 + k; sb.p = sb.p0 + k; paint(); };
    return { row, paint, judge, ans, solve };
  });
  body.__dv2solve = () => rows.forEach(r => r.solve());
  body.append(h("div", { class: "dv2say" }, opt.tip || "숫자 오른쪽 아래의 빨간 동그라미를 눌러 소수점을 옮겨요. 마지막 숫자 뒤를 누르면 자연수가 돼요. 흐린 0은 소수점 아래에 있다고 생각하는 0이에요."), ...rows.map(r => r.row));
  rows.forEach(r => r.paint());
  if (opt.asks) body.append(h("div", { class: "dv2ask" }, dv2Rows(opt.asks, reg)));
  api.provide({ words: opt.words || ["각각 10배", "각각 100배", "몫은 같아요"], answers: rows.map(r => r.ans).concat(reg.plain) });
  dv2Check(body, api, reg, opt, () => { const rs = rows.map(r => r.judge()), bad = rs.find(r => r.bad); return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") }; });
}

/* ===== ⑥ 세로셈 나눗셈 =====
   pr: {a:"12.4", b:"1.5", shift?, mode:"q"(나누어떨어짐)|"rem"(몫은 자연수, 남는 양)|"tr"(몫을 places자리까지), places, what:"사람 수"}
   두 수의 소수점이 옮겨진 모습(흐린 동그라미 = 처음 소수점, 빨간 점 = 옮긴 소수점)을 보여 주고, 몫(과 남는 양)을 칸에 써요. */
function dv2LongBoard(pr) {
  const A = dv2Norm(pr.a), B = dv2Norm(pr.b), mode = pr.mode || "q";
  const [ai, af = ""] = A.split("."), [bi, bf = ""] = B.split(".");
  const sh = pr.shift != null ? pr.shift : bf.length;
  if (bf.length > sh) throw new Error("나누는 수가 자연수가 되지 않아요: " + B);
  const RA = dv2P(A), RB = dv2P(B), Q = dv2Div(RA, RB);
  let qWant = null, qStr = "", qDec = 0;
  if (mode === "q") { qStr = dv2Exact(Q); if (qStr == null) throw new Error("나누어떨어지지 않아요: " + A + "÷" + B); qWant = Q; qDec = dv2Dn(qStr); }
  else if (mode === "rem") { qWant = dv2R(Q.n / Q.d); qStr = String(qWant.n); }
  else { qDec = pr.places; qStr = dv2Fix(dv2TruncR(Q, qDec), qDec); }
  const remR = mode === "rem" ? dv2Sub(RA, dv2Mul(RB, qWant)) : null;
  const totalDec = Math.max(af.length, sh + qDec);
  const digits = (ai + af.padEnd(totalDec, "0")).split("");
  const nOrig = ai.length + af.length, pOrig = ai.length - 1, pNew = ai.length - 1 + sh, C = digits.length;
  const firstNZ = digits.findIndex(d => d !== "0");
  const dTd = (d, k) => {
    const cls = k >= nOrig ? "dv2g" : (k < firstNZ && k < pNew) ? "dv2x" : "";
    const e = h("td", { class: "dv2dc" }, h("span", { class: cls }, d));
    if (sh && k === pOrig && pOrig !== pNew && (af.length || sh)) e.append(h("span", { class: "dv2od" }, "​"));
    if (k === pNew && pNew < C - 1) e.append(h("span", { class: "dv2dot" }, "​"));
    return e;
  };
  // 나누는 수: 처음 소수점(흐림)과 옮긴 뒤 모습
  const bDig = (bi + bf.padEnd(sh, "0")).split(""), bFirst = bDig.findIndex(d => d !== "0");
  const divTd = h("td", { class: "dv2dvs" }, h("span", {}, bDig.map((d, k) => {
    const s = h("span", { class: "dv2ds" }, h("span", { class: k >= bi.length + bf.length ? "dv2g" : (k < bFirst ? "dv2x" : "") }, d));
    if (sh && k === bi.length - 1) s.append(h("span", { class: "dv2od" }, "​"));
    return s;
  })), h("span", { class: "dv2paren" }, ")"));
  const mkRow = (cls, label) => {
    const ins = [], pts = []; let pIdx = -1;
    const tr = h("tr", { class: cls }, h("td", { class: "dv2lab" }, label || "​"), Array.from({ length: C }, (_, k) => {
      const i = h("input", { type: "text", inputmode: "numeric", maxlength: 1, "aria-label": label || "칸" });
      i.addEventListener("input", () => { i.value = i.value.replace(/[^0-9]/g, "").slice(-1); });
      ins.push(i);
      const b = k < C - 1 ? h("button", { class: "dv2pt", "aria-label": `${k + 1}번째 칸 뒤에 소수점 찍기`, onclick: () => { R.p = R.p === k ? -1 : k; pts.forEach((x, j) => x.classList.toggle("dv2pon", j === R.p)); } }, "​") : null;
      if (b) pts.push(b);
      return h("td", { class: cls === "dv2rr" ? "dv2rc" : "" }, i, b);
    }));
    const R = { tr, ins, pts, p: pIdx };
    return R;
  };
  const qRow = mkRow("dv2qr", "몫");
  const qn = qStr.replace(".", "").replace(/^0+(?=\d)/, "").length;
  const memoN = pr.memo != null ? pr.memo : Math.min(8, 2 * Math.max(1, qn));
  const memoRows = Array.from({ length: memoN }, () => h("tr", { class: "dv2memo" }, h("td", { class: "dv2lab" }, "​"), Array.from({ length: C }, () => h("td", {}, h("input", { type: "text", inputmode: "numeric", maxlength: 1, "aria-label": "계산 메모" })))));
  const rRow = mode === "rem" ? mkRow("dv2rr", "남는 양") : null;
  const tbl = h("table", { class: "dv2lt" }, qRow.tr, h("tr", { class: "dv2dd" }, divTd, digits.map(dTd)), ...memoRows, rRow ? rRow.tr : null);
  const shTxt = sh ? `두 수의 소수점을 오른쪽으로 ${sh}자리씩 옮겼어요(각각 ${dv2Pow(sh)}배).` : "나누는 수가 자연수예요.";
  const cap = pr.cap || `${dv2Sp(A + "÷" + B)}`;
  const el = h("div", { class: "dv2vbox" }, h("div", { class: "dv2vcap" }, cap), h("div", { class: "dv2memo-cap" }, shTxt), h("div", { style: "overflow-x:auto;max-width:100%" }, tbl),
    h("div", { class: "dv2memo-cap" }, "점선 칸은 계산 메모(채점하지 않아요)" + (rRow ? " · 주황 칸에 남는 양을 쓰고 소수점을 찍어요." : "")));
  const shownB = dv2Str(dv2Mul(RB, dv2R(dv2Pow(sh)))), shownA = dv2Str(dv2Mul(RA, dv2R(dv2Pow(sh))));
  const read = R => {
    const v = R.ins.map(x => x.value);
    const first = v.findIndex(x => x !== "");
    if (first < 0) return { empty: true, v };
    const last = v.length - 1 - [...v].reverse().findIndex(x => x !== "");
    return { v, first, last, gap: v.slice(first, last + 1).some(x => x === "") };
  };
  const paint = (R, from, to, ok) => R.ins.forEach((x, k) => { x.style.borderColor = k >= from && k <= to ? (ok ? "var(--ok)" : "var(--no)") : ""; });
  const judgeQ = () => {
    const r = read(qRow);
    if (r.empty) return { bad: `${cap}: 몫을 위 칸에 써요.`, given: "-" };
    if (r.gap) { paint(qRow, r.first, r.last, false); return { bad: "몫의 숫자 사이에 빈칸이 있어요. 빈칸 없이 이어서 써요.", given: r.v.join("") }; }
    const p = qRow.p;
    if (p >= 0 && (p < r.first || p >= r.last)) return { bad: p < r.first ? "소수점 앞(일의 자리)에 숫자가 있어야 해요. 1보다 작은 몫이면 일의 자리에 0을 써요." : "소수점은 숫자 사이에 찍어요.", given: r.v.join("") };
    if (r.v[r.first] === "0" && r.first < r.last && p !== r.first) { paint(qRow, r.first, r.first, false); return { bad: `${cap}: 맨 앞의 0은 쓰지 않아요.`, given: r.v.join("") }; }
    const s = p >= 0 ? r.v.slice(r.first, p + 1).join("") + "." + r.v.slice(p + 1, r.last + 1).join("") : r.v.slice(r.first, r.last + 1).join("");
    const got = dv2P(s), gd = dv2Dn(s);
    let ok = false, expS = qStr;
    if (mode === "tr") { expS = dv2Fix(dv2TruncR(Q, Math.max(gd, qDec)), Math.max(gd, qDec)); ok = gd >= qDec && dv2Eq(got, dv2TruncR(Q, gd)); }
    else ok = dv2Eq(got, qWant);
    paint(qRow, r.first, r.last, ok);
    if (ok) return { ok: true, given: s };
    if (mode === "rem" && gd > 0) return { bad: `${cap}: ${pr.what || "몫"}는 자연수예요. 몫을 자연수 부분까지만 구해요.`, given: s };
    if (mode === "tr" && gd < qDec && dv2Eq(got, dv2TruncR(Q, gd))) return { bad: `${cap}: 몫을 ${DV2PLACE[qDec]}까지 구해요. 0을 내려 계속 나누어요.`, given: s };
    const strip = x => x.replace(".", "").replace(/^0+/, "").replace(/0+$/, "");
    if (strip(s) === strip(expS)) return { bad: `${cap}: 몫의 숫자는 맞는데 소수점 위치가 달라요. 몫의 소수점은 옮긴 나누어지는 수(${shownA})의 소수점 위치에 맞추어 찍어요. 검산: ${B} × ${dv2Str(got)} = ${dv2J(dv2Str(dv2Mul(RB, got)), "이라")} ${dv2J(A, "이가")} 아니에요.`, given: s };
    return { bad: `${cap}: ${shownA} ÷ ${dv2J(shownB, "을를")} 계산하듯이 몫을 다시 구해 봐요.`, given: s };
  };
  const judgeR = () => {
    const r = read(rRow);
    if (r.empty) return { bad: `${cap}: 맨 아래 주황 칸에 남는 양을 써요.`, given: "-" };
    if (r.gap) { paint(rRow, r.first, r.last, false); return { bad: "남는 양의 숫자 사이에 빈칸이 있어요.", given: r.v.join("") }; }
    const P = rRow.p >= 0 ? rRow.p : C - 1;
    let val = dv2R(0n);
    for (let k = r.first; k <= r.last; k++) { const d = BigInt(r.v[k]), e = P - k; val = dv2Add(val, e >= 0 ? dv2R(d * dv2Pow(e)) : dv2R(d, dv2Pow(-e))); }
    const ok = dv2Eq(val, remR);
    paint(rRow, r.first, r.last, ok);
    if (ok) return { ok: true, given: dv2Str(val) };
    const sameDigits = [dv2Pow(1), dv2Pow(2), dv2Pow(3)].some(m => dv2Eq(val, dv2Mul(remR, dv2R(m))) || dv2Eq(val, dv2Div(remR, dv2R(m))));
    if (sameDigits) return { bad: `${cap}: 남는 양의 숫자는 맞는데 소수점 위치가 달라요. 남는 양의 소수점은 나누어지는 수 ${A}의 처음 소수점(흐린 동그라미)에 맞추어 찍어요.`, given: dv2Str(val) };
    return { bad: `${cap}: 몫 ${qStr}에 대한 빼기를 다시 해 봐요. ${shownA} − ${shownB} × ${qStr}를 계산해요.`, given: dv2Str(val) };
  };
  const judge = () => {
    const q = judgeQ(); if (q.bad) return q;
    if (rRow) { const r = judgeR(); if (r.bad) return { bad: r.bad, given: q.given + ", 남는 양 " + r.given }; return { given: q.given + ", 남는 양 " + r.given }; }
    return q;
  };
  const ans = mode === "rem" ? `${dv2Sp(A + "÷" + B)}: 몫 ${qStr}, 남는 양 ${dv2Str(remR)}` : mode === "tr" ? `${dv2Sp(A + "÷" + B)} = ${qStr}…` : `${dv2Sp(A + "÷" + B)} = ${qStr}`;
  el.__solve = () => {
    const put = (R, str, pEnd) => { const [ip, fp = ""] = str.split("."); R.ins.forEach(x => { x.value = ""; }); [...ip].forEach((d, j) => { R.ins[pEnd - ip.length + 1 + j].value = d; }); [...fp].forEach((d, j) => { R.ins[pEnd + 1 + j].value = d; }); R.p = fp ? pEnd : -1; R.pts.forEach((x, j) => x.classList.toggle("dv2pon", j === R.p)); };
    put(qRow, qStr, pNew);
    if (rRow) put(rRow, dv2Str(remR), pOrig);
  };
  return { el, judge, ans };
}
function dv2Long(body, api, opt) {
  dv2Style();
  if (opt.fig) body.append(opt.fig());
  const reg = dv2Reg();
  const boards = opt.probs.map(dv2LongBoard);
  body.append(h("div", { class: "dv2say" }, opt.tip || "옮긴 소수점(빨간 점)을 보고 자연수의 나눗셈처럼 계산해요. 몫을 맨 위 칸에 쓰고, 몫에 소수점이 있으면 숫자 오른쪽 아래 동그라미를 눌러 찍어요."), h("div", { class: "dv2vts" }, boards.map(b => b.el)));
  if (opt.rows) body.append(h("div", { class: "dv2ask" }, dv2Rows(opt.rows, reg)));
  body.__dv2solve = () => boards.forEach(b => b.el.__solve());
  api.provide({ words: opt.words || ["각각 10배", "몫의 소수점", "자연수의 나눗셈"], answers: boards.map(b => b.ans).concat(reg.plain) });
  dv2Check(body, api, reg, opt, () => {
    const rs = boards.map(b => b.judge()), bad = rs.find(r => r.bad);
    return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") };
  });
}

/* ===== ⑦ 몫을 반올림하기: 확인할 숫자를 누르고 어림한 몫 쓰기 =====
   opt: {items:[{e:"7÷3", to:0}], asks, ok} */
function dv2Round(body, api, opt) {
  dv2Style();
  const reg = dv2Reg();
  const items = opt.items.map(it => {
    const Q = dv2E(it.e), show = dv2Fix(dv2TruncR(Q, it.to + 2), it.to + 2), exact = dv2Exact(Q) != null && dv2Dn(dv2Exact(Q)) <= it.to + 2;
    const want = dv2Fix(dv2RndR(Q, it.to), it.to), down = dv2Fix(dv2TruncR(Q, it.to), it.to);
    const intLen = show.indexOf("."), cells = show.replace(".", "").split("");
    const placeOf = k => k < intLen ? intLen - 1 - k : -(k - intLen + 1);   // 0 = 일의 자리, -1 = 소수 첫째 …
    let pick = -1; const btns = [];
    const strip = h("span", { style: "display:inline-flex;align-items:flex-end" }, cells.map((d, k) => {
      const b = h("button", { class: "dv2dg", "aria-label": `${d} 누르기`, onclick: () => { pick = k; btns.forEach((x, j) => x.classList.toggle("dv2pk", j === pick)); } }, d);
      btns.push(b);
      return k === intLen - 1 ? [b, h("span", { class: "dv2pnt" }, ".")] : b;
    }).flat(), exact ? null : h("span", { class: "dv2pnt" }, "…"));
    const why = {}; if (down !== want) why[dv2Str(dv2P(down))] = `바로 아래 자리 숫자가 5이거나 5보다 크면 올려요.`;
    const row = dv2Parts([`${dv2Sp(it.e)} =`, { el: () => strip }, `→ ${DV2PLACE[it.to]}까지:`, { n: want, why, bad: `${DV2PLACE[it.to + 1]} 숫자를 보고 반올림해요.` }], reg);
    const judge = () => {
      if (pick < 0) return { bad: `${dv2Sp(it.e)}: ${DV2PLACE[it.to]}까지 나타낼 때 확인할 숫자를 눌러요.`, given: "-" };
      if (placeOf(pick) !== -(it.to + 1)) return { bad: `${dv2Sp(it.e)}: ${DV2PLACE[it.to]}까지 나타내려면 바로 아래 자리인 ${DV2PLACE[it.to + 1]} 숫자를 봐요.`, given: cells[pick] };
      return { given: cells[pick] };
    };
    row.__solve = () => { pick = intLen + it.to; };
    return { row, judge, ans: `${dv2Sp(it.e)} = ${show}… → ${DV2PLACE[it.to + 1]} 숫자 ${cells[intLen + it.to]}를 보고 ${want}` };
  });
  body.append(h("div", { class: "dv2say" }, opt.tip || "몫에서 확인할 숫자(나타낼 자리의 바로 아래 자리)를 누르고, 반올림한 몫을 칸에 써요."), ...items.map(i => i.row));
  if (opt.asks) body.append(h("div", { class: "dv2ask" }, dv2Rows(opt.asks, reg)));
  body.__dv2solve = () => items.forEach(i => i.row.__solve());
  api.provide({ words: opt.words || ["바로 아래 자리", "반올림"], answers: items.map(i => i.ans).concat(reg.plain.slice(items.length)) });
  dv2Check(body, api, reg, opt, () => { const rs = items.map(i => i.judge()), bad = rs.find(r => r.bad); return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") }; });
}

/* ===== ⑧ 수 카드로 몫이 가장 큰 나눗셈 만들기 (□.□ ÷ □.□) ===== opt: {cards:["2","3","4","6"], asks, ok} */
function dv2Cards(body, api, opt) {
  dv2Style();
  const cards = opt.cards, slots = [null, null, null, null];
  const valOf = s => dv2Div(dv2P(`${cards[s[0]]}.${cards[s[1]]}`), dv2P(`${cards[s[2]]}.${cards[s[3]]}`));
  const perms = []; (function pm(a, rest) { if (!rest.length) return perms.push(a); rest.forEach((x, i) => pm(a.concat([x]), rest.filter((_, j) => j !== i))); })([], cards.map((_, i) => i));
  let best = null, bestP = null; perms.forEach(p => { const v = valOf(p); if (!best || v.n * best.d > best.n * v.d) { best = v; bestP = p; } });
  const cardBox = h("div", { class: "dv2cards" }), slotBox = h("div", { class: "dv2slots" }), res = h("div", { class: "dv2say" }, "​");
  const draw = () => {
    cardBox.innerHTML = ""; slotBox.innerHTML = "";
    cards.forEach((c, i) => cardBox.append(h("button", { class: "opt", disabled: slots.includes(i), onclick: () => { const k = slots.indexOf(null); if (k >= 0) { slots[k] = i; draw(); } } }, c)));
    const sl = k => h("button", { class: "dv2slot", "aria-label": `${k + 1}번째 칸`, onclick: () => { slots[k] = null; draw(); } }, slots[k] == null ? "​" : cards[slots[k]]);
    slotBox.append(sl(0), ".", sl(1), "÷", sl(2), ".", sl(3));
    res.textContent = slots.includes(null) ? "수 카드를 누르면 빈칸에 차례로 들어가요. 칸을 누르면 카드가 돌아가요." : `${cards[slots[0]]}.${cards[slots[1]]} ÷ ${cards[slots[2]]}.${cards[slots[3]]} = ${dv2Str(valOf(slots))}`;
  };
  draw();
  const reg = dv2Reg();
  body.append(cardBox, slotBox, res);
  if (opt.asks) body.append(h("div", { class: "dv2ask" }, dv2Rows(opt.asks, reg)));
  body.__dv2solve = () => { bestP.forEach((c, k) => { slots[k] = c; }); draw(); };
  api.provide({ words: ["나누어지는 수는 크게", "나누는 수는 작게"], answers: [`${cards[bestP[0]]}.${cards[bestP[1]]} ÷ ${cards[bestP[2]]}.${cards[bestP[3]]}`].concat(reg.plain) });
  dv2Check(body, api, reg, opt, () => {
    if (slots.includes(null)) return { bad: "수 카드를 모두 놓아 나눗셈을 만들어요.", given: "-" };
    const v = valOf(slots), g = `${cards[slots[0]]}.${cards[slots[1]]}÷${cards[slots[2]]}.${cards[slots[3]]}`;
    if (!dv2Eq(v, best)) return { bad: "몫이 더 큰 나눗셈을 만들 수 있어요. 나누어지는 수는 크게, 나누는 수는 작게 만들어요.", given: g };
    return { given: g };
  });
}

/* ===== ⑨ 연료를 넣어 목적지까지 가 보기 (8~9차시) =====
   opt: {dist:"337.92", per:"17.6", car:"하이브리드 자동차", color, place:"할머니 댁", asks, ok} */
function dv2Fuel(body, api, opt) {
  dv2Style();
  const DIST = dv2P(opt.dist), PER = dv2P(opt.per), want = dv2Div(DIST, PER);
  const wantT = dv2Mul(want, dv2R(10n)); if (wantT.d !== 1n) throw new Error("연료가 0.1 L 단위가 아니에요");
  const MAXL = 40, MAXKM = 400, W = 760, x0 = 50, L = 660, ry = 92, gy = 178, H = 230;
  const svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  let t = 0;   // 0.1 L 단위
  const say = h("div", { class: "dv2say" }, "​");
  const km = () => dv2Mul(PER, dv2R(BigInt(t), 10n));
  const X = v => x0 + L * Math.min(1, v / MAXKM);
  const house = (x, c) => svgEl("path", { d: `M${x - 18} ${ry - 8} l18 -18 l18 18 v20 h-36 z`, fill: c, stroke: INK, "stroke-width": 2 });
  const draw = () => {
    g.innerHTML = "";
    g.append(svgEl("rect", { x: x0 - 10, y: ry + 2, width: L + 20, height: 22, fill: "#D9DEDC", rx: 6 }), svgEl("line", { x1: x0, y1: ry + 13, x2: x0 + L, y2: ry + 13, stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "14 10" }));
    const xd = X(Number(DIST.n) / Number(DIST.d));
    g.append(house(x0, "#FFE7A8"), txt(x0, ry - 40, "집", 16), house(xd, "#F4C2C2"), txt(xd, ry - 40, `${opt.place || "할머니 댁"} ${opt.dist} km`, 16, { fill: DV2C.red }));
    const kv = km(), xv = X(Number(kv.n) / Number(kv.d));
    const car = svgEl("g", { transform: `translate(${xv},${ry})` });
    car.append(svgEl("rect", { x: -26, y: -8, width: 52, height: 18, rx: 6, fill: opt.color || DV2C.blue }), svgEl("rect", { x: -14, y: -20, width: 28, height: 14, rx: 5, fill: opt.color || DV2C.blue, opacity: .8 }), svgEl("circle", { cx: -14, cy: 12, r: 6, fill: INK }), svgEl("circle", { cx: 14, cy: 12, r: 6, fill: INK }));
    g.append(car);
    // 연료 막대
    g.append(svgEl("rect", { x: x0, y: gy - 14, width: L, height: 28, rx: 8, fill: "#fff", stroke: DV2C.dark, "stroke-width": 2 }), svgEl("rect", { x: x0, y: gy - 14, width: L * t / (MAXL * 10), height: 28, rx: 8, fill: "#F6C08A" }));
    for (let i = 0; i <= MAXL; i += 5) { const x = x0 + L * i / MAXL; g.append(svgEl("line", { x1: x, y1: gy + 14, x2: x, y2: gy + 22, stroke: INK, "stroke-width": 2 }), txt(x, gy + 36, `${i}`, 14)); }
    g.append(svgEl("circle", { cx: x0 + L * t / (MAXL * 10), cy: gy, r: 13, fill: "#fff", stroke: DV2C.red, "stroke-width": 4 }), txt(x0 + L + 4, gy - 26, "연료(L)", 14, { fill: DV2C.dark, "text-anchor": "end" }));
    say.innerHTML = ""; say.append(`연료 `, h("b", {}, dv2Str(dv2R(BigInt(t), 10n)) + " L"), ` → 갈 수 있는 거리 ${dv2Str(kv)} km`);
  };
  dragOn(svg, pt => { if (Math.abs(pt.y - gy) > 34) return false; t = Math.max(0, Math.min(MAXL * 10, Math.round((pt.x - x0) / L * MAXL * 10))); draw(); return true; },
    pt => { t = Math.max(0, Math.min(MAXL * 10, Math.round((pt.x - x0) / L * MAXL * 10))); draw(); });
  const add = d => () => { t = Math.max(0, Math.min(MAXL * 10, t + d)); draw(); };
  const tools = h("div", { class: "dv2tools" }, h("button", { onclick: add(-10) }, "−1 L"), h("button", { onclick: add(-1) }, "−0.1 L"), h("button", { onclick: add(1) }, "+0.1 L"), h("button", { onclick: add(10) }, "+1 L"));
  draw();
  const reg = dv2Reg();
  const asks = opt.asks ? h("div", { class: "dv2ask" }, dv2Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dv2say" }, opt.tip || `${opt.car}는 연료 1 L로 ${opt.per} km를 갈 수 있어요. 연료 막대를 끌고 단추로 0.1 L씩 맞추어 자동차가 ${opt.place || "할머니 댁"}에 딱 도착하게 해 보세요.`), h("div", { class: "dv2stage" }, svg), say, tools, asks);
  body.__dv2solve = () => { t = Number(wantT.n); draw(); };
  api.provide({ words: ["거리 ÷ 1 L로 갈 수 있는 거리"], answers: [`연료 ${dv2Str(want)} L`].concat(reg.plain) });
  dv2Check(body, api, reg, opt, () => {
    const kv = km(), c = kv.n * DIST.d - DIST.n * kv.d, giv = `${dv2Str(dv2R(BigInt(t), 10n))} L`;
    if (c < 0n) return { bad: `아직 ${opt.place || "할머니 댁"}에 도착하지 못했어요. 연료를 더 넣어요.`, given: giv };
    if (c > 0n) return { bad: `${opt.place || "할머니 댁"}을 지나쳤어요. 연료를 조금 빼요.`, given: giv };
    return { given: giv };
  });
}

/* ===== ⑩ 섬나라 여행 놀이판 (10차시) =====
   ❓ 교과서 놀이판의 칸 순서·칸 수는 지도서에서 되살릴 수 없어, 놀이판에 있는 19문제로 이 앱이 정한 놀이판(출발·19칸·도착)을 만들었어요. */
const DV2ISLAND = [
  { e: "2.8÷0.4" }, { e: "7.2÷0.8" }, { e: "3÷0.5" }, { e: "19.2÷3.2" }, { e: "0.52÷0.26" }, { e: "11.5÷2.3" }, { e: "4.02÷1.34" },
  { e: "36÷2.4" }, { e: "2.52÷0.28" }, { e: "8.24÷3.7", r: 0 }, { e: "7.82÷3.4" }, { e: "18÷2.25" }, { e: "3.92÷0.7" }, { e: "19.26÷3.21" },
  { e: "8.28÷4.6" }, { e: "18÷0.45" }, { e: "3.56÷0.4" }, { e: "13.08÷3.27" }, { e: "19÷0.6", r: 1 }];
(function dv2IslandCheck() {
  DV2ISLAND.forEach(c => {
    const q = dv2E(c.e); if (!q) throw new Error("놀이판 식 오류 " + c.e);
    if (c.r == null) { c.ans = dv2Exact(q); if (c.ans == null) throw new Error("나누어떨어지지 않는 칸 " + c.e); }
    else c.ans = dv2Fix(dv2RndR(q, c.r), c.r);
    c.want = dv2P(c.ans);
  });
})();
function dv2Island(body, api, opt) {
  dv2Style();
  const N = DV2ISLAND.length + 2, COLS = 7, cw = 100, ch = 84, gx = 6, gy = 34, x0 = 14, y0 = 26;
  const W = x0 * 2 + COLS * (cw + gx), RWS = Math.ceil(N / COLS), H = y0 + RWS * (ch + gy) + 6;
  const svg = makeSvg(W, H), g = svgEl("g"), tk = svgEl("g"); svg.append(g, tk);
  const P = [{ n: "파랑", c: DV2C.blue }, { n: "빨강", c: DV2C.red }];
  let pos = [0, 0], turn = 0, phase = "roll", start = 0, finished = false, die = 0, busy = false;
  const cell = i => { const r = Math.floor(i / COLS), c = r % 2 ? COLS - 1 - i % COLS : i % COLS; return { x: x0 + c * (cw + gx), y: y0 + r * (ch + gy) }; };
  const drawBoard = () => {
    g.innerHTML = "";
    g.append(svgEl("rect", { x: 2, y: 2, width: W - 4, height: H - 4, rx: 18, fill: DV2C.sea }));
    for (let i = 0; i + 1 < N; i++) { const a = cell(i), b = cell(i + 1); g.append(svgEl("line", { x1: a.x + cw / 2, y1: a.y + ch / 2, x2: b.x + cw / 2, y2: b.y + ch / 2, stroke: "#B9DCEB", "stroke-width": 10 })); }
    for (let i = 0; i < N; i++) {
      const p = cell(i), endC = i === 0 || i === N - 1;
      g.append(svgEl("rect", { x: p.x, y: p.y, width: cw, height: ch, rx: 14, fill: endC ? "#FFE7A8" : DV2C.sand, stroke: "#C99A57", "stroke-width": 2 }));
      if (i === 0) g.append(txt(p.x + cw / 2, p.y + ch / 2, "출발", 22, { fill: "#8A5A1E" }));
      else if (i === N - 1) g.append(txt(p.x + cw / 2, p.y + ch / 2, "도착", 22, { fill: "#8A5A1E" }));
      else {
        const c = DV2ISLAND[i - 1];
        g.append(txt(p.x + 14, p.y + 13, String(i), 12, { fill: DV2C.dark }));
        g.append(txt(p.x + cw / 2, p.y + (c.r == null ? ch / 2 : ch / 2 - 10), c.e, c.e.length > 9 ? 16 : 18));
        if (c.r != null) { g.append(txt(p.x + cw / 2, p.y + ch / 2 + 14, "반올림하여", 12, { fill: DV2C.red }), txt(p.x + cw / 2, p.y + ch / 2 + 28, `${DV2PLACE[c.r]}까지`, 12, Object.assign({ fill: DV2C.red }, c.r ? { textLength: 90, lengthAdjust: "spacingAndGlyphs" } : {}))); }
      }
    }
  };
  const drawTok = () => {
    tk.innerHTML = "";
    P.forEach((pl, k) => { const p = cell(pos[k]); tk.append(svgEl("circle", { cx: p.x + cw - 40 + k * 26, cy: p.y + 2, r: 11, fill: pl.c, stroke: "#fff", "stroke-width": 3 })); });
  };
  const status = h("div", { class: "dv2score" }), say = h("div", { class: "dv2say" }, "​"), ask = h("div", { class: "dv2row" });
  const dieEl = h("span", { class: "dv2die" }, "​");
  const paintStatus = () => { status.innerHTML = ""; P.forEach((p, k) => status.append(h("span", { class: !finished && turn === k ? "dv2turn" : "", style: `border-color:${p.c}` }, `${p.n}: ${pos[k] === N - 1 ? "도착!" : pos[k] ? pos[k] + "번 칸" : "출발"}`))); };
  const endTurn = () => { busy = true; setTimeout(() => { busy = false; ask.innerHTML = ""; turn = 1 - turn; start = pos[turn]; phase = "roll"; paintStatus(); say.textContent = `${P[turn].n} 차례예요. 주사위를 던져요.`; }, 1300); };
  const arrive = () => {
    const k = turn;
    if (pos[k] >= N - 1) { pos[k] = N - 1; drawTok(); finished = true; phase = "end"; paintStatus(); say.textContent = `${P[k].n}이 먼저 도착했어요! ${P[k].n} 승리!`; return; }
    if (pos[k] === pos[1 - k]) { phase = "roll"; say.textContent = `${P[1 - k].n} 말이 있는 칸이에요! 주사위를 한 번 더 던져 이동해요.`; return; }
    phase = "calc";
    const c = DV2ISLAND[pos[k] - 1];
    const inp = h("input", { type: "text", inputmode: "decimal", class: "dv2in", "aria-label": "몫" });
    const go = () => {
      if (phase !== "calc") return;
      const v = dv2P(inp.value); if (v == null) { say.textContent = "몫을 수로 써요."; return; }
      phase = "wait";
      const q = c.r == null ? `${dv2Sp(c.e)} = ${c.ans}` : `${dv2Sp(c.e)} = ${dv2Str(dv2E(c.e))} → ${DV2PLACE[c.r]}까지 ${c.ans}`;
      if (dv2Eq(v, c.want)) say.textContent = `친구가 계산기로 확인했더니 ${q} 맞아요! 말이 그 칸에 머물러요.`;
      else { pos[k] = start; drawTok(); say.textContent = `친구가 계산기로 확인했더니 ${q}예요. 말을 전에 있던 칸으로 돌려놓아요.`; }
      ask.innerHTML = ""; paintStatus(); endTurn();
    };
    inp.addEventListener("keydown", ev => { if (ev.key === "Enter") go(); });
    ask.innerHTML = ""; ask.append(h("span", {}, `${P[k].n}: ${dv2Sp(c.e)}${c.r == null ? "" : ` (${DV2PLACE[c.r]}까지)`} =`), inp, h("button", { class: "opt", onclick: go }, "몫 확인"));
    say.textContent = "도착한 칸의 나눗셈을 계산해 써요. 친구가 계산기로 확인해요.";
    setTimeout(() => inp.focus(), 50);
  };
  const roll = d => {
    if (phase !== "roll" || busy || finished) return;
    die = d || 1 + Math.floor(Math.random() * 6); dieEl.textContent = String(die); phase = "move";
    let left = die;
    const stepF = () => { if (left <= 0 || pos[turn] >= N - 1) { arrive(); return; } pos[turn]++; left--; drawTok(); paintStatus(); setTimeout(stepF, 220); };
    stepF();
  };
  const restart = () => { pos = [0, 0]; turn = 0; start = 0; phase = "roll"; finished = false; busy = false; ask.innerHTML = ""; dieEl.textContent = "​"; drawTok(); paintStatus(); say.textContent = `${P[0].n} 차례예요. 주사위를 던져요.`; };
  drawBoard(); drawTok(); paintStatus();
  body.__dv2isl = { roll, pos: () => pos.slice(), phase: () => phase };
  say.textContent = `${P[0].n} 차례예요. 주사위를 던져요.`;
  body.append(h("div", { class: "dv2note" }, "※ 이 앱이 정한 놀이판이에요. 교과서 놀이판에 있는 19문제를 이 앱에서 새로 늘어놓았어요."), status, h("div", { class: "dv2stage" }, svg),
    h("div", { class: "dv2tools" }, h("button", { onclick: () => roll() }, "주사위 던지기"), dieEl, h("button", { onclick: restart }, "처음부터 다시")), say, ask);
  api.provide({ words: ["소수의 나눗셈", "몫을 반올림"], answers: [] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (!finished) return api.fail("놀이를 끝까지 해요. 말 하나가 도착 칸에 닿으면 끝나요.", `파랑 ${pos[0]}칸, 빨강 ${pos[1]}칸`);
    api.tryOnce(); api.done(`${pos[0] === N - 1 ? "파랑" : "빨강"} 도착`, opt && opt.ok);
  } }, "놀이 끝 확인하기")));
}

/* ===== ⑪ 빙고 (또 다른 놀이) ===== 놀이판의 (소수)÷(소수)·(자연수)÷(소수) 17문제 중 9개로 빙고판을 만들고 로봇 친구와 번갈아 말해요. 3줄을 먼저 만들면 이겨요. */
function dv2Lines(mark) { const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; return L.filter(l => l.every(i => mark[i])).length; }
function dv2Bingo(body, api, opt) {
  dv2Style();
  const POOL = DV2ISLAND.filter(c => c.r == null);
  const mine = Array(9).fill(null), mk = Array(9).fill(false), ins = [], vals = {};
  let bot = [], bmk = Array(9).fill(false), phase = "make", finished = false, busy = false;
  const chips = h("div", { class: "dv2chips" }), board = h("div", { class: "dv2bg" }), botB = h("div", { class: "dv2bg dv2bot" }), say = h("div", { class: "dv2say" }, "​");
  const drawChips = () => { chips.innerHTML = ""; POOL.forEach((c, i) => chips.append(h("button", { class: "opt", disabled: phase !== "make" || mine.includes(i), onclick: () => { const k = mine.indexOf(null); if (k < 0) return; mine[k] = i; drawMine(); drawChips(); } }, c.e))); };
  const drawMine = () => {
    board.innerHTML = ""; ins.length = 0;
    mine.forEach((ci, k) => {
      const c = ci == null ? null : POOL[ci];
      const inp = c ? h("input", { type: "text", inputmode: "decimal", "aria-label": "몫" }) : null;
      if (inp) { inp.value = vals[ci] || ""; inp.disabled = phase !== "make"; inp.addEventListener("input", () => { vals[ci] = inp.value; }); }
      ins[k] = inp;
      board.append(h("div", { class: "dv2bc" + (mk[k] ? " dv2mk" : ""), onclick: () => myCall(k) },
        c ? c.e : "빈칸", inp, c && phase === "make" ? h("button", { class: "dv2rm", "aria-label": "빼기", onclick: ev => { ev.stopPropagation(); mine[k] = null; drawMine(); drawChips(); } }, "✕") : null));
    });
  };
  const drawBot = () => { botB.innerHTML = ""; if (!bot.length) botB.append(h("div", { class: "dv2note", style: "grid-column:1/-1" }, "빙고판을 완성하면 로봇 친구도 빙고판을 만들어요.")); bot.forEach((ci, k) => botB.append(h("div", { class: "dv2bc" + (bmk[k] ? " dv2mk" : "") }, finished ? POOL[ci].e : "?"))); };
  const winCheck = who => {
    const a = dv2Lines(mk), b = dv2Lines(bmk);
    const first = who === "me" ? [a, "내가"] : [b, "로봇 친구가"], second = who === "me" ? [b, "로봇 친구가"] : [a, "내가"];
    if (first[0] >= 3 || second[0] >= 3) { finished = true; phase = "end"; drawBot(); say.textContent = `${first[0] >= 3 ? first[1] : second[1]} 먼저 3줄을 만들었어요! 빙고! (나 ${a}줄, 로봇 친구 ${b}줄)`; return true; }
    return false;
  };
  const myCall = k => {
    if (phase !== "play" || busy || mk[k] || mine[k] == null) return;
    const c = POOL[mine[k]]; mk[k] = true;
    const bi = bot.indexOf(mine[k]); if (bi >= 0) bmk[bi] = true;
    drawMine(); drawBot();
    say.textContent = `내가 말했어요: ${dv2Sp(c.e)} = ${c.ans}` + (bi >= 0 ? " — 로봇 친구도 같은 식이 있어 ○표를 했어요." : "");
    if (winCheck("me")) return;
    busy = true;
    setTimeout(() => {
      const cand = bot.map((ci, j) => j).filter(j => !bmk[j]);
      const j = cand[Math.floor(Math.random() * cand.length)], ci = bot[j], c2 = POOL[ci]; bmk[j] = true;
      const mi = mine.indexOf(ci); if (mi >= 0) mk[mi] = true;
      drawMine(); drawBot(); busy = false;
      say.textContent = `로봇 친구가 말했어요: ${dv2Sp(c2.e)} = ${c2.ans}` + (mi >= 0 ? " — 나에게도 있어서 ○표를 했어요." : "") + " 내 차례예요. 내 빙고판에서 말할 칸을 눌러요.";
      winCheck("bot");
    }, 1100);
  };
  const ready = h("button", { onclick: () => {
    if (phase !== "make") return;
    if (mine.includes(null)) { say.textContent = "빙고판 9칸을 모두 채워요."; return; }
    let bad = 0;
    mine.forEach((ci, k) => { const v = dv2P(ins[k].value), ok = v != null && dv2Eq(v, POOL[ci].want); ins[k].style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok) bad++; });
    if (bad) { say.textContent = `몫이 비었거나 틀린 칸이 ${bad}개 있어요. 빨간 칸을 다시 계산해요.`; return; }
    const idx = POOL.map((_, i) => i); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    bot = idx.slice(0, 9); phase = "play"; drawMine(); drawChips(); drawBot();
    say.textContent = "빙고판 완성! 내 차례예요. 내 빙고판에서 말할 칸을 눌러요.";
  } }, "빙고판 완성하기");
  const again = h("button", { onclick: () => { Object.keys(vals).forEach(k => delete vals[k]); mine.fill(null); mk.fill(false); bmk = Array(9).fill(false); bot = []; phase = "make"; finished = false; busy = false; drawMine(); drawChips(); drawBot(); say.textContent = "식 카드를 눌러 빙고판을 채우고 몫을 써요."; } }, "한 판 더");
  drawChips(); drawMine(); drawBot();
  say.textContent = "식 카드를 눌러 빙고판을 채우고 몫을 써요.";
  body.__dv2bingo = { POOL, mine, ins, mk, bmk, call: myCall, phase: () => phase };
  body.append(h("div", { class: "dv2say" }, "놀이판의 (소수)÷(소수), (자연수)÷(소수) 17문제예요. 9개를 골라 빙고판에 놓고 몫을 써요."), chips,
    h("div", { class: "dv2bgw" }, h("div", {}, h("div", { class: "dv2vcap" }, "내 빙고판"), board), h("div", {}, h("div", { class: "dv2vcap" }, "로봇 친구 빙고판"), botB)),
    h("div", { class: "dv2tools" }, ready, again), say);
  api.provide({ words: ["빙고", "3줄"], answers: [] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (!finished) return api.fail("빙고 놀이를 끝까지 해요. 누군가 3줄을 만들면 끝나요.", phase);
    api.tryOnce(); api.done(`빙고 끝 (나 ${dv2Lines(mk)}줄)`, opt && opt.ok);
  } }, "놀이 끝 확인하기")));
}

/* 로봇 실험실 그림(4차시): 1초 동안 빨간색 로봇 5.89 m, 파란색 로봇 3.1 m */
function dv2RobotFig() {
  const W = 720, H = 186, x0 = 40, s = 100, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  g.append(svgEl("line", { x1: x0, y1: 14, x2: x0, y2: 158, stroke: INK, "stroke-width": 3 }), txt(x0, 176, "출발선", 14));
  [[5.89, DV2C.red, "빨간색 로봇", 46], [3.1, DV2C.blue, "파란색 로봇", 116]].forEach(([d, c, n, y]) => {
    const x = x0 + d * s;
    g.append(svgEl("line", { x1: x0, y1: y, x2: x, y2: y, stroke: c, "stroke-width": 6, opacity: .5 }));
    g.append(svgEl("rect", { x: x - 30, y: y - 22, width: 30, height: 26, rx: 6, fill: c }), svgEl("circle", { cx: x - 20, cy: y - 12, r: 3, fill: "#fff" }), svgEl("circle", { cx: x - 9, cy: y - 12, r: 3, fill: "#fff" }), svgEl("line", { x1: x, y1: y - 30, x2: x, y2: y + 26, stroke: c, "stroke-width": 2, "stroke-dasharray": "4 3" }));
    [-28, -19, -10, -1].forEach(o => g.append(svgEl("line", { x1: x + o, y1: y + 4, x2: x + o - 3, y2: y + 16, stroke: c, "stroke-width": 3 })));
    g.append(txt((x0 + x) / 2, y - 16, `${n} ${d} m`, 16, { fill: c }));
  });
  return dv2Fig(svg);
}
/* 강낭콩 관찰 일지(11차시) */
function dv2Journal() {
  return h("div", { class: "dv2jr" },
    h("div", {}, h("b", {}, "10월 2일 "), "이틀 전보다 잎은 3장 더 생겼고 줄기는 길어졌다. 잎의 수: 5장, 줄기의 길이: 13.5 cm"),
    h("div", {}, h("b", {}, "10월 17일 "), "15일 전보다 잎은 9장 더 생겼고 줄기의 길이는 □배가 되었다. 잎의 수: 14장, 줄기의 길이: 22.95 cm"));
}
//@@LESSONS
const UNIT_STORY = { title: "과학 기술 체험관에 숨어 있는 소수의 나눗셈", lines: [
  "지윤이와 은우는 과학 기술 체험관에 왔어요. 모래를 실어 나르는 로봇을 보고 스마트 신호등도 만들고 가상 현실 체험도 하며 신기한 과학 기술을 만났어요.",
  "모래 로봇, 스마트 신호등의 전선, 로봇 실험실, 종이접기 체험, 가상 현실 체험관, 식물 공장에서 (소수)÷(소수), (자연수)÷(소수)를 계산하고 몫을 반올림하거나 나누어 주고 남는 양을 구해요.",
  "교과서 「수학 6-2」 2. 소수의 나눗셈의 차시 순서 그대로 만들었어요. 지도서에서 두 차시로 묶인 8~9차시는 한 차시 안에서 이어서 해요."],
  one: "소수의 나눗셈 · 지윤이·은우와 함께 과학 기술 체험관에서 나누어지는 수와 나누는 수를 각각 10배, 100배 해도 몫이 같다는 원리로 (소수)÷(소수), (자연수)÷(소수)를 계산해요." };
const UNIT_KEYWORDS = ["소수의 나눗셈", "(소수)÷(소수)", "(자연수)÷(소수)", "각각 10배", "각각 100배", "몫은 같아요", "자연수의 나눗셈", "분수의 나눗셈", "세로셈", "몫의 소수점", "어림셈", "몫을 반올림", "바로 아래 자리", "나누어 주고 남는 양", "검산"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 과학 기술 체험관에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 소수의 나눗셈이 필요한 상황은 어떤 것이 있을까요?",
  summary: "타조가 1시간 동안 70 km를 달린다면 1분 동안 달리는 거리는 70÷60으로 구해요. 음료수 3.6 L를 0.4 L씩 나누어 줄 때(3.6÷0.4), 2.75 m는 0.55 m의 몇 배인지 알아볼 때(2.75÷0.55)처럼 우리 주변에는 소수의 나눗셈이 필요한 상황이 많아요. 이 단원에서는 (소수)÷(소수), (자연수)÷(소수)를 계산하고 몫을 반올림하거나 나누어 주고 남는 양을 구해요.",
  steps: [
    { name: "가장 빠른 타조", inst: "“두 다리로 달리는 동물 중에서 타조가 가장 빠르대.” “타조는 1시간 동안 70 km를 달린다면 같은 빠르기로 1분 동안 달리는 거리는 약 몇 km일까?” 물음에 답해 보세요.", hints: ["1시간은 60분이에요.", "1분 동안 달리는 거리는 전체 거리 70 km를 60으로 나누어 구해요.", "70은 60보다 조금 커요. 그러면 몫은 1보다 조금 커요."],
      render: (b, a) => dv2Sent(b, a, [
        ["1시간은", { n: "60", s: 1 }, "분이에요."],
        ["1분 동안 달리는 거리를 구하는 식은", { o: ["70÷60", "70×60", "60÷70"], a: 0, why: { "1": "1분 동안 달리는 거리는 1시간 동안 달리는 거리보다 짧아요.", "2": "전체 거리 70 km를 60(분)으로 나누어요." } }, "이에요."],
        ["70은 60보다 크므로 타조가 1분 동안 달리는 거리는", { o: ["1 km보다 조금 길어요", "1 km보다 짧아요", "60 km쯤이에요"], a: 0 }, "."]],
        { fig: () => dv2Talk([["은우:", "두 다리로 달리는 동물 중에서 타조가 가장 빠르대."], ["지윤:", "타조는 1시간 동안 70 km를 달린대. 1분 동안에는 약 몇 km를 달릴까?"]]),
          ok: "70÷60=1.166…처럼 몫이 간단한 소수로 나오지 않아요. 이 단원에서 몫을 반올림하는 방법을 배우면 약 1.2 km(소수 첫째 자리까지)라고 나타낼 수 있어요." }) },
    { name: "배울 내용 살펴보기", inst: "“(소수)÷(소수)의 계산은 (소수)÷(자연수)의 계산과 어떤 공통점과 차이점이 있는지 알아볼까요?” 책장을 넘겨 배울 내용을 살펴보고, 배우는 차례대로 눌러 학습 계획을 세워 보세요.", hints: ["먼저 (소수)÷(소수)를 배우고, 다음에는 나누어지는 수가 자연수인 나눗셈을 배워요.", "몫을 반올림하는 방법을 배운 뒤 나누어 주고 남는 양을 알아봐요."],
      render: (b, a) => sequence(b, a, ["㉠ 몫을 반올림하여 나타내기", "㉡ (소수)÷(소수) 알아보기", "㉢ 나누어 주고 남는 양 알아보기", "㉣ (자연수)÷(소수) 알아보기"], [1, 3, 0, 2],
        { ok: "(소수)÷(소수) → (자연수)÷(소수) → 몫을 반올림하여 나타내기 → 나누어 주고 남는 양 차례로 배워요." }) },
    { name: "배운 내용 떠올리기", inst: "반올림, (소수)÷(자연수), (분수)÷(분수)를 떠올려 보세요.", hints: ["반올림은 구하려는 자리의 바로 아래 자리 숫자가 5이거나 5보다 크면 올리고, 5보다 작으면 버려요.", "72÷3=24이고, 7.2는 72의 [1/10]배예요.", "분모가 같은 분수의 나눗셈은 분자끼리 나누어요."],
      render: (b, a) => dv2Sent(b, a, [
        ["3.46을 반올림하여 소수 첫째 자리까지 나타내면", { n: "3.5", why: { "3.4": "소수 둘째 자리 숫자가 6이에요. 5이거나 5보다 크면 올려요." } }, "이에요."],
        ["2.7을 반올림하여 일의 자리까지 나타내면", { n: "3", why: { "2": "소수 첫째 자리 숫자가 7이므로 올려요." } }, "이에요."],
        ["7.2÷3 =", { n: "2.4", e: "7.2÷3", why: { "24": "72÷3=24이고, 7.2는 72의 [1/10]배이니 몫도 [1/10]배예요." } }],
        ["[3/4]÷[1/4] = 3÷1 =", { n: "3", e: "3÷1" }],
        ["[9/10]÷[3/10] = 9÷3 =", { n: "3", e: "9÷3" }]],
        { ok: "반올림, (소수)÷(자연수), 분모가 같은 (분수)÷(분수)를 잘 기억하고 있어요!" }) },
    { name: "체험관 둘러보기", inst: "“지윤이와 은우는 과학 기술 체험관에 왔어요. 모래를 실어 나르는 로봇을 보고 스마트 신호등도 만들고 가상 현실 체험도 하며 신기한 과학 기술을 만날 수 있었어요. 또 종이접기가 첨단 과학 기술에 활용된다는 사실도 알 수 있었어요.” 그림 속 상황을 살펴보세요.", hints: ["같은 양씩 몇 번 덜어 낼 수 있는지, 몇 배인지 알아볼 때 나눗셈을 해요.", "학생 수를 세는 것은 나눗셈이 필요하지 않아요."],
      render: (b, a) => quiz(b, a, [
        { fig: () => dv2Talk([["은우:", "로봇이 모래를 한 번에 0.9 kg씩 실어 나르고 있어."], ["지윤:", "모래가 3.6 kg이면 몇 번 실어 날라야 할까?"]]), q: "모래를 몇 번 실어 날라야 하는지 구하는 식은 무엇일까요?", o: ["3.6÷0.9", "3.6×0.9", "3.6−0.9"], a: 0, why: { "1": "3.6 kg에서 0.9 kg씩 몇 번 덜어 낼 수 있는지 알아봐요. 나눗셈이에요.", "2": "한 번 빼는 것이 아니라 몇 번 덜어 낼 수 있는지 구해요." } },
        { q: "우리 주변에서 소수의 나눗셈이 필요한 상황을 모두 골라 보세요.", o: ["음료수 3.6 L를 한 사람에게 0.4 L씩 나누어 줄 때 몇 명에게 줄 수 있는지 알아보기", "길이가 2.75 m인 철사는 길이가 0.55 m인 철사의 몇 배인지 알아보기", "체험관에 온 학생 수 세기", "전선 3.75 m로 1.25 m씩 쓰는 신호등을 몇 개 만들 수 있는지 알아보기"], a: [0, 1, 3] }],
        { ok: "3.6÷0.4, 2.75÷0.55, 3.75÷1.25처럼 소수로 나누는 상황이 많아요. 정확한 계산 방법은 다음 차시부터 배워요." }) },
    { name: "말해 보기", inst: "과학 기술 체험관 이야기를 듣고, 내 경험과 관련지어 소수의 나눗셈이 필요한 상황을 이야기해 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "과학 기술을 체험해 본 경험이나 체험관에서 해 보고 싶은 체험을 써 보세요.", tag: "체험", ph: "예) 과학 축제에서 가상 현실 기술을 체험해 봤어요." },
        { q: "주변에서 소수의 나눗셈이 필요한 상황을 하나 써 보세요.", tag: "상황", ph: "예) 쿠키 반죽 0.24 kg을 0.02 kg씩 나누어 쿠키를 몇 개 만들 수 있는지 알아볼 때" }]) }
  ],
  challenge: { inst: "음료수 3.6 L를 한 사람에게 0.4 L씩 나누어 주려고 해요. 한 칸이 0.1 L인 막대를 0.4 L씩 묶어 몇 명에게 줄 수 있는지 알아보세요.", hints: ["0.4 L는 0.1 L가 4칸이에요.", "묶지 않은 첫 칸부터 4칸씩 끌어서 묶어요.", "36칸을 4칸씩 묶으면 몇 묶음일까요?"],
    render: (b, a) => dv2Bars(b, a, { n: 36, per: 4, cell: "0.1", step: "0.4",
      asks: [
        ["0.4 L씩 묶으면", { n: "9", s: 1 }, "묶음이므로", { n: "9", s: 1 }, "명에게 나누어 줄 수 있어요."],
        ["식으로 나타내면 3.6÷0.4 =", { n: "9", e: "3.6÷0.4" }]],
      ok: "0.1이 36칸을 4칸씩 묶으면 9묶음이에요. 3.6÷0.4=9, 9명에게 나누어 줄 수 있어요." }) }
},
{
  id: "t2", no: 2, title: "(소수 한 자리 수)÷(소수 한 자리 수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(소수 한 자리 수)÷(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "3.6은 0.1이 36개, 0.9는 0.1이 9개인 수이므로 3.6÷0.9=36÷9=4예요. 나누어지는 수와 나누는 수를 각각 10배 하면 몫은 같아요. 세로셈에서는 두 수의 소수점을 오른쪽으로 한 자리씩 옮겨 자연수의 나눗셈처럼 계산하고, 분수의 나눗셈 [36/10]÷[9/10]=36÷9=4로도 계산할 수 있어요.",
  steps: [
    { inst: "“로봇이 모래 3.6 kg을 한 번에 0.9 kg씩 실어 나르고 있습니다. 모래를 몇 번 실어 날라야 하는지 알아보세요.” 한 칸이 0.1인 막대에서 0.9씩 묶어 보세요. 말풍선: “1은 0.1이 10개야.” “0.9씩 묶으면 몇 번 덜어 낼 수 있을까?”", hints: ["0.9는 0.1이 9칸이에요. 9칸씩 묶어요.", "3.6은 0.1이 36칸이에요.", "36칸을 9칸씩 묶으면 몇 묶음일까요?"],
      render: (b, a) => dv2Bars(b, a, { n: 36, per: 9, cell: "0.1", step: "0.9",
        asks: [
          ["모래를 몇 번 실어 날라야 하는지 구하는 식은", { o: ["3.6÷0.9", "3.6×0.9", "0.9÷3.6"], a: 0 }],
          ["어림셈: 3.6을 4로, 0.9를 1로 어림하면 4÷1 =", { n: "4", s: 1 }, "이므로", { n: "4", s: 1 }, "번쯤 될 것 같아요."],
          ["3.6은 0.1이", { n: "36", s: 1 }, "개, 0.9는 0.1이", { n: "9", s: 1 }, "개인 수예요."],
          ["0.9씩", { n: "4", s: 1 }, "묶음이므로 모래를", { n: "4", s: 1 }, "번 실어 날라야 해요."],
          ["구한 답은 어림셈한 결과와", { o: ["같아요", "많이 달라요"], a: 0 }]],
        ok: "3.6은 0.1이 36개, 0.9는 0.1이 9개이므로 36÷9를 이용해 계산할 수 있어요. 4번 실어 날라야 하고, 어림셈한 4번과 같아요." }) },
    { inst: "3.6÷0.9를 36÷9로 바꾸어 계산해 봐요. 빨간 동그라미를 눌러 두 수의 소수점을 오른쪽으로 옮겨 두 수가 자연수가 되게 해 보세요.", hints: ["소수점을 오른쪽으로 한 자리 옮기면 10배가 돼요.", "두 수의 소수점을 같은 자리만큼 옮겨야 몫이 같아요.", "36÷9=4예요."],
      render: (b, a) => dv2Shift(b, a, { items: [{ a: "3.6", b: "0.9", both: true }],
        asks: [
          ["36÷9 =", { n: "4", e: "36÷9" }, "이므로 3.6÷0.9 =", { n: "4", e: "3.6÷0.9", why: { "0.4": "3.6÷0.9는 36÷9와 몫이 같아요. 검산: 0.9×0.4=0.36이에요." } }],
          ["나누어지는 수와 나누는 수를 각각 10배 하면 몫은", { o: ["같아요", "10배가 돼요", "[1/10]배가 돼요"], a: 0 }],
          { fig: () => dv2RelFig([["5", "1", "5"], ["50", "10", "5"], ["500", "100", "5"]], "10배") },
          ["5÷1 = 50÷10 = 500÷100 =", { n: "5", e: "500÷100" }]],
        ok: "3.6과 0.9를 각각 10배 하면 36÷9가 돼요. 각각 10배 해도 몫은 같으니 3.6÷0.9=36÷9=4예요." }) },
    { inst: "3.6÷0.9를 세로셈으로 계산해 보세요. 말풍선: “나누어지는 수와 나누는 수가 자연수가 되도록 두 수에 각각 10씩 곱해요.” “36을 9로 나눈 몫을 써요.” 그리고 분수의 나눗셈으로도 계산해 보세요.", hints: ["두 수의 소수점이 오른쪽으로 한 자리씩 옮겨졌어요. 9)36처럼 계산해요.", "3.6=[36/10], 0.9=[9/10]이에요.", "분모가 같은 분수의 나눗셈은 분자끼리 나누어요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "3.6", b: "0.9" }],
        rows: [
          { g: "분수의 나눗셈으로 계산하기", rows: [["3.6÷0.9 =", { f: ["36", "10"] }, "÷", { f: ["9", "10"] }, "= 36÷9 =", { n: "4", e: "36÷9" }]] },
          ["두 방법 모두 나누어지는 수와 나누는 수를", { o: ["자연수로 바꾸어", "그대로 두고"], a: 0 }, "계산했어요."]],
        ok: "세로셈은 두 수의 소수점을 한 자리씩 옮겨 9)36으로, 분수의 나눗셈은 [36/10]÷[9/10]=36÷9로 계산해요. 몫은 4예요." }) },
    { inst: "(소수 한 자리 수)÷(소수 한 자리 수)를 계산하는 방법을 정리해 보세요.", hints: ["3.6÷0.9는 두 수를 각각 10배 한 36÷9로 계산했어요.", "소수 한 자리 수는 분모가 10인 분수로 나타낼 수 있어요."],
      render: (b, a) => blanks(b, a, ["(소수 한 자리 수)÷(소수 한 자리 수)는 나누어지는 수와 나누는 수를 각각 ", { o: ["10배", "100배"], a: 0 }, " 하여 ", { o: ["자연수의 나눗셈", "소수의 덧셈"], a: 0 }, "과 같은 방법으로 계산하거나, 분모가 ", { o: ["10", "100"], a: 0 }, "인 분수의 나눗셈으로 나타내어 계산해요. 나누어지는 수와 나누는 수를 각각 10배 해도 몫은 ", { o: ["같아요", "달라져요"], a: 0 }, "."]) },
    { inst: "계산해 보세요.", hints: ["0.8)3.2는 8)32처럼 계산해요.", "1.2)9.6은 12)96처럼 계산해요.", "21.7÷0.7은 217÷7, 14.4÷1.6은 144÷16과 몫이 같아요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "3.2", b: "0.8" }, { a: "9.6", b: "1.2" }],
        rows: [["21.7÷0.7 =", { n: "31", e: "21.7÷0.7" }], ["14.4÷1.6 =", { n: "9", e: "14.4÷1.6" }]],
        ok: "3.2÷0.8=4, 9.6÷1.2=8, 21.7÷0.7=31, 14.4÷1.6=9예요. 두 수를 각각 10배 해서 자연수의 나눗셈으로 계산했어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 물음에 답해 보세요.", hints: ["4.8과 0.6을 각각 10배 하면 48÷6이에요.", "몫이 같으려면 나누어지는 수와 나누는 수를 똑같이 10배 해야 해요.", "설탕 봉지 수는 전체 설탕의 무게를 한 봉지에 담는 무게로 나누어요."],
    render: (b, a) => dv2Sent(b, a, [
      ["4.8÷0.6: 두 수를 각각", { n: "10", s: 1 }, "배 하면 48÷6 =", { n: "8", e: "48÷6" }, "이므로 4.8÷0.6 =", { n: "8", e: "4.8÷0.6" }],
      ["14.4÷0.9와 몫이 같은 나눗셈은", { o: ["14.4÷9", "144÷9"], a: 1, why: { "0": "나누는 수만 10배 하면 몫이 달라져요. 두 수를 똑같이 10배 해야 해요." } }],
      ["8.4÷1.2 =", { n: "7", e: "8.4÷1.2" }, ", 13.5÷1.5 =", { n: "9", e: "13.5÷1.5" }, ", 6.4÷0.8 =", { n: "8", e: "6.4÷0.8" }],
      { q: "끈 64.6 cm를 한 도막에 3.8 cm씩 자르면 몇 도막이 될까요?", p: ["64.6÷3.8 =", { n: "17", e: "64.6÷3.8" }, "(도막)"] },
      { q: "이준이는 설탕 3.5 kg을 0.5 kg씩, 나현이는 설탕 4.2 kg을 0.7 kg씩 봉지에 나누어 담았어요.", p: ["이준", { n: "7", e: "3.5÷0.5", s: 1 }, "봉지, 나현", { n: "6", e: "4.2÷0.7", s: 1 }, "봉지 → 봉지가 더 많은 사람은", { o: ["이준", "나현"], a: 0 }] }],
      { ok: "4.8÷0.6=8, 144÷9, 7·9·8, 17도막, 이준이가 7봉지로 더 많아요. 잘했어요!" }) }
},
{
  id: "t3", no: 3, title: "(소수 두 자리 수)÷(소수 두 자리 수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(소수 두 자리 수)÷(소수 두 자리 수)는 어떻게 계산할까요?",
  summary: "3.75 m=375 cm, 1.25 m=125 cm이므로 3.75÷1.25=375÷125=3이에요. 나누어지는 수와 나누는 수를 각각 100배 하면 몫은 같아요. 세로셈에서는 두 수의 소수점을 오른쪽으로 두 자리씩 옮겨 계산하고, 분수의 나눗셈 [375/100]÷[125/100]=375÷125=3으로도 계산해요.",
  steps: [
    { inst: "“스마트 신호등 1개를 만드는 데 전선 1.25 m가 필요합니다. 전선 3.75 m로 만들 수 있는 스마트 신호등은 몇 개인지 알아보세요.” 수직선에서 1.25 m씩 뛰어 세어 보세요. 아래 수직선은 같은 길이를 cm로 나타낸 것이에요.", hints: ["1.25 m씩 뛰면 1.25, 2.5, 3.75예요.", "1 m=100 cm예요. 3.75 m=375 cm예요.", "나누어지는 수를 크게, 나누는 수를 작게 어림할수록 몫이 커져요."],
      render: (b, a) => dv2Line(b, a, { to: "3.75", step: "1.25", max: "4", tick: "1", unit: "m", sub: { k: 100, unit: "cm" },
        asks: [
          ["만들 수 있는 신호등의 수를 구하는 식은", { o: ["3.75÷1.25", "3.75×1.25", "1.25÷3.75"], a: 0 }],
          ["어림셈: 3.75를 4로, 1.25를 1로 어림하면 4÷1 =", { n: "4", s: 1 }, "이므로 4개쯤이에요."],
          ["나누어지는 수를 크게, 나누는 수를 작게 어림할수록 어림한 몫은", { o: ["커져요", "작아져요"], a: 0 }],
          ["3.75 m =", { n: "375" }, "cm, 1.25 m =", { n: "125" }, "cm이므로 3.75÷1.25 = 375÷125 =", { n: "3", e: "375÷125" }],
          ["만들 수 있는 스마트 신호등은", { n: "3", s: 1 }, "개이고, 어림셈한 결과인 4개와", { o: ["비슷해요", "같아요"], a: 0 }]],
        ok: "m를 cm로 바꾸어도 몫은 같아요. 3.75÷1.25=375÷125=3, 신호등을 3개 만들 수 있어요." }) },
    { inst: "3.75÷1.25를 375÷125로 바꾸어 계산해 봐요. 두 수의 소수점을 옮겨 두 수가 모두 자연수가 되게 해 보세요.", hints: ["소수 두 자리 수는 소수점을 오른쪽으로 두 자리 옮기면 자연수가 돼요.", "소수점을 두 자리 옮기면 100배예요.", "375÷125=3이에요."],
      render: (b, a) => dv2Shift(b, a, { items: [{ a: "3.75", b: "1.25", both: true }],
        asks: [
          ["375÷125 =", { n: "3", e: "375÷125" }, "이므로 3.75÷1.25 =", { n: "3", e: "3.75÷1.25" }],
          ["나누어지는 수와 나누는 수를 각각 100배 하면 몫은", { o: ["같아요", "100배가 돼요"], a: 0 }],
          { fig: () => dv2RelFig([["5", "1", "5"], ["500", "100", "5"], ["50000", "10000", "5"]], "100배") },
          ["5÷1 = 500÷100 = 50000÷10000 =", { n: "5", e: "50000÷10000" }]],
        ok: "3.75와 1.25를 각각 100배 하면 375÷125가 돼요. 몫은 같으니 3.75÷1.25=3이에요." }) },
    { inst: "3.75÷1.25를 세로셈과 분수의 나눗셈으로 계산해 보세요. 말풍선: “나누어지는 수와 나누는 수가 자연수가 되도록 두 수에 각각 100씩 곱해요.” “375를 125로 나눈 몫을 써요.”", hints: ["두 수의 소수점이 오른쪽으로 두 자리씩 옮겨졌어요. 125)375처럼 계산해요.", "125×3=375예요.", "3.75=[375/100], 1.25=[125/100]이에요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "3.75", b: "1.25" }],
        rows: [{ g: "분수의 나눗셈으로 계산하기", rows: [["3.75÷1.25 =", { f: ["375", "100"] }, "÷", { f: ["125", "100"] }, "= 375÷125 =", { n: "3", e: "375÷125" }]] }],
        ok: "두 수를 각각 100배 하여 자연수의 나눗셈으로, 또는 분모가 100인 분수의 나눗셈으로 계산해요. 몫은 3이에요." }) },
    { inst: "(소수 두 자리 수)÷(소수 두 자리 수)를 계산하는 방법을 정리해 보세요.", hints: ["3.75÷1.25는 두 수를 각각 100배 한 375÷125로 계산했어요.", "소수 두 자리 수는 분모가 100인 분수로 나타낼 수 있어요."],
      render: (b, a) => blanks(b, a, ["(소수 두 자리 수)÷(소수 두 자리 수)는 나누어지는 수와 나누는 수를 각각 ", { o: ["100배", "10배"], a: 0 }, " 하여 자연수의 나눗셈과 같은 방법으로 계산하거나, 분모가 ", { o: ["100", "10"], a: 0 }, "인 분수의 나눗셈으로 나타내어 계산해요. 두 수를 똑같이 자연수로 만들어도 몫은 ", { o: ["변하지 않아요", "커져요"], a: 0 }, "."]) },
    { inst: "계산해 보세요.", hints: ["0.16)1.12는 16)112처럼 계산해요.", "1.26)15.12는 126)1512처럼 계산해요.", "5.92÷0.74=592÷74, 45.78÷2.18=4578÷218이에요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "1.12", b: "0.16" }, { a: "15.12", b: "1.26" }],
        rows: [["5.92÷0.74 =", { n: "8", e: "5.92÷0.74" }], ["45.78÷2.18 =", { n: "21", e: "45.78÷2.18" }]],
        ok: "1.12÷0.16=7, 15.12÷1.26=12, 5.92÷0.74=8, 45.78÷2.18=21이에요. 몫을 소수로 예상해 소수점을 올려 찍지 않았어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 물음에 답해 보세요.", hints: ["0.98과 0.14를 각각 100배 하면 98÷14예요.", "곱셈으로 검산해 봐요. 1.71×8은 15.39가 될까요?", "3.42÷0.57의 몫보다 작은 자연수를 세어요."],
    render: (b, a) => dv2Sent(b, a, [
      ["0.98÷0.14: 각각", { n: "100", s: 1 }, "배 하면 98÷14 =", { n: "7", e: "98÷14" }, "→ 0.98÷0.14 =", { n: "7", e: "0.98÷0.14" }],
      ["3.64÷0.28 =", { n: "13", e: "3.64÷0.28" }, ", 14.88÷1.86 =", { n: "8", e: "14.88÷1.86" }, ", 4.38÷0.73 =", { n: "6", e: "4.38÷0.73" }],
      ["잘못 계산한 것은", { o: ["㉠ 3.92÷0.56=7", "㉡ 25.68÷2.14=12", "㉢ 15.39÷1.71=8"], a: 2, why: { "0": "검산: 0.56×7=3.92이므로 옳아요.", "1": "검산: 2.14×12=25.68이므로 옳아요." } }, "이고, 옳은 몫은", { n: "9", e: "15.39÷1.71" }, "이에요."],
      { q: "우유 11.25 L를 한 병에 1.25 L씩 나누어 담으면 몇 병이 될까요?", p: ["11.25÷1.25 =", { n: "9", e: "11.25÷1.25" }, "(병)"] },
      ["3.42÷0.57 > □ 에서 □ 안에 들어갈 수 있는 자연수는 모두", { n: "5", s: 1, why: { "6": "3.42÷0.57=6이에요. 6보다 작은 자연수만 세어요." } }, "개예요."]],
      { ok: "0.98÷0.14=7, 13·8·6, 잘못 계산한 것은 ㉢(옳은 몫 9), 우유 9병, 자연수 1~5의 5개예요!" }) }
},
{
  id: "t4", no: 4, title: "(소수 두 자리 수)÷(소수 한 자리 수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(소수 두 자리 수)÷(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "5.89÷3.1은 두 수를 각각 100배 한 589÷310으로 계산하거나, 나누는 수가 자연수가 되도록 각각 10배 한 58.9÷31로 계산해요. 몫은 1.9예요. 몫의 소수점은 옮긴 나누어지는 수의 소수점 위치에 맞추어 찍어요. 분수의 나눗셈 [589/100]÷[310/100]=589÷310=1.9로도 계산할 수 있어요.",
  steps: [
    { inst: "“1초 동안 빨간색 로봇은 5.89 m, 파란색 로봇은 3.1 m 이동했습니다. 빨간색 로봇이 이동한 거리는 파란색 로봇이 이동한 거리의 몇 배인지 알아보세요.” 두 수의 소수점을 옮겨 두 수가 모두 자연수가 되게 해 보세요.", hints: ["몇 배인지 구할 때는 나눗셈을 해요.", "5.89는 소수 두 자리 수예요. 두 수 모두 자연수가 되려면 소수점을 두 자리씩 옮겨요.", "3.1을 100배 하면 310이에요(흐린 0)."],
      render: (b, a) => dv2Shift(b, a, { items: [{ a: "5.89", b: "3.1", both: true }],
        asks: [
          ["몇 배인지 구하는 식은", { o: ["5.89÷3.1", "3.1÷5.89", "5.89−3.1"], a: 0 }],
          ["어림셈: 5.89를 6으로, 3.1을 3으로 어림하면 6÷3 =", { n: "2", s: 1 }, "이므로", { n: "2", s: 1 }, "배쯤 될 것 같아요."],
          ["두 수를 각각", { n: "100", s: 1 }, "배 하면 589÷310과 몫이 같아요."]],
        fig: dv2RobotFig, ok: "5.89와 3.1을 각각 100배 하면 589÷310이에요. 자연수의 나눗셈을 이용해 계산할 수 있어요." }) },
    { inst: "589÷310을 세로셈으로 계산해 보세요. 지도서 설명: “589를 310으로 나눈 몫 1을 쓰고, 589=589.0이므로 그에 맞추어 점을 찍은 후 0을 내립니다. 0.1의 개수인 2790을 310으로 나눈 몫을 씁니다.”", hints: ["310×1=310, 589−310=279예요.", "589=589.0이에요. 흐린 0을 내려 2790을 310으로 나누어요.", "310×9=2790이에요. 몫은 1.9예요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "5.89", b: "3.1", shift: 2 }],
        rows: [
          ["빨간색 로봇이 이동한 거리는 파란색 로봇이 이동한 거리의", { n: "1.9", e: "5.89÷3.1" }, "배예요."],
          ["어림셈한 결과인 2배와", { o: ["비슷해요", "많이 달라요"], a: 0 }]],
        ok: "589÷310=1.9이므로 5.89÷3.1=1.9예요. 1.9배는 어림셈한 2배와 비슷해요." }) },
    { inst: "5.89÷3.1을 계산하는 다른 방법을 알아봐요. 이번에는 나누는 수가 자연수가 되도록 두 수에 각각 10씩 곱했어요(58.9÷31). 말풍선: “58을 31로 나눈 몫 1을 쓰고, 58.9의 소수점에 맞추어 점을 찍어요.” “0.1의 개수인 279를 31로 나눈 몫을 써요.”", hints: ["31)58.9처럼 계산해요. 58을 31로 나눈 몫은 1이에요.", "몫의 소수점은 58.9의 소수점 위치에 맞추어 찍어요.", "5.89=[589/100], 3.1=[310/100]이에요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "5.89", b: "3.1", shift: 1 }],
        rows: [
          { g: "분수의 나눗셈으로 계산하기", rows: [["5.89÷3.1 =", { f: ["589", "100"] }, "÷", { f: ["310", "100"], why: { "31/10": "두 분수의 분모를 같게 해요. 3.1=3.10=[310/100]이에요." } }, "= 589÷310 =", { n: "1.9", e: "589÷310" }]] },
          ["58.9÷31의 몫의 소수점은", { o: ["옮긴 58.9의 소수점 위치에 맞추어 찍어요", "5.89의 처음 소수점 위치에 맞추어 찍어요"], a: 0 }]],
        ok: "각각 10배 하면 58.9÷31=1.9, 각각 100배 하면 589÷310=1.9, 분수의 나눗셈으로도 1.9예요. 편리한 방법을 골라 계산해요." }) },
    { inst: "(소수 두 자리 수)÷(소수 한 자리 수)를 계산하는 방법을 정리해 보세요.", hints: ["5.89÷3.1은 각각 10배 하면 58.9÷31, 각각 100배 하면 589÷310이에요.", "몫의 소수점은 옮긴 소수점 위치에 맞추어 찍어요."],
      render: (b, a) => blanks(b, a, ["(소수 두 자리 수)÷(소수 한 자리 수)는 나누는 수가 자연수가 되도록 두 수를 각각 ", { o: ["10배", "100배"], a: 0 }, " 하여 (소수)÷(자연수)로 계산하거나, 두 수를 각각 ", { o: ["100배", "10배"], a: 0 }, " 하여 자연수의 나눗셈으로 계산해요. 몫의 소수점은 ", { o: ["옮긴", "처음"], a: 0 }, " 소수점 위치에 맞추어 찍어요."]) },
    { inst: "계산해 보세요.", hints: ["0.9)8.46은 9)84.6처럼, 2.5)4.25는 25)42.5처럼 계산해요.", "몫의 소수점은 84.6, 42.5의 소수점 위치에 맞추어 찍어요.", "5.92÷0.8=59.2÷8, 7.54÷1.3=75.4÷13이에요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "8.46", b: "0.9" }, { a: "4.25", b: "2.5" }],
        rows: [["5.92÷0.8 =", { n: "7.4", e: "5.92÷0.8" }], ["7.54÷1.3 =", { n: "5.8", e: "7.54÷1.3" }]],
        ok: "8.46÷0.9=9.4, 4.25÷2.5=1.7, 5.92÷0.8=7.4, 7.54÷1.3=5.8이에요. 몫의 소수점을 바르게 찍었어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 물음에 답해 보세요.", hints: ["가장 큰 수는 18.33, 가장 작은 수는 3.9예요.", "9.24÷4.4와 7.92÷3.6을 각각 계산해 비교해요.", "어떤 수로 나누었더니 0.6이 되었다면, 어떤 수는 2.88÷0.6이에요."],
    render: (b, a) => dv2Sent(b, a, [
      ["4.32÷2.7 =", { n: "1.6", e: "4.32÷2.7" }, ", 6.08÷1.9 =", { n: "3.2", e: "6.08÷1.9" }],
      ["18.33, 5.6, 3.9 중 가장 큰 수를 가장 작은 수로 나눈 몫은", { n: "4.7", e: "18.33÷3.9" }, "이에요."],
      ["몫이 3.2인 것은", { o: ["㉠ 5.58÷1.8", "㉡ 1.92÷0.6", "㉢ 7.59÷2.3"], a: 1, why: { "0": "5.58÷1.8=3.1이에요.", "2": "7.59÷2.3=3.3이에요." } }],
      ["9.24÷4.4", { o: [">", "=", "<"], a: 2, why: { "0": "9.24÷4.4=2.1, 7.92÷3.6=2.2예요." } }, "7.92÷3.6"],
      { q: "은행에서 병원까지는 3.78 km, 은행에서 도서관까지는 2.1 km예요. 병원까지의 거리는 도서관까지의 거리의 몇 배일까요?", p: ["3.78÷2.1 =", { n: "1.8", e: "3.78÷2.1" }, "(배)"] },
      ["2.88을 어떤 수로 나누었더니 0.6이 되었어요. 어떤 수는", { n: "4.8", e: "2.88÷0.6" }, "이에요."]],
      { ok: "1.6, 3.2, 4.7, ㉡, 2.1<2.2, 1.8배, 어떤 수 4.8이에요. 잘했어요!" }) }
},
{
  id: "t5", no: 5, title: "(자연수)÷(소수)를 알아볼까요", soop: "개념 구축하기(O)",
  question: "(자연수)÷(소수)는 어떻게 계산할까요?",
  summary: "10 cm=100 mm, 2.5 cm=25 mm이므로 10÷2.5=100÷25=4예요. (자연수)÷(소수)는 나누는 수가 자연수가 되도록 두 수를 각각 10배 또는 각각 100배 하여 계산해요. 3÷0.75는 3을 3.00으로 생각하고 소수점을 두 자리씩 옮겨 300÷75=4로 계산하거나, [300/100]÷[75/100]=300÷75=4로 계산해요.",
  steps: [
    { inst: "“길이가 10 cm인 종이를 한 칸의 길이가 2.5 cm가 되도록 똑같이 나누어 접으려고 합니다. 종이를 몇 칸으로 나누어 접을 수 있는지 알아보세요.” 인공위성 같은 첨단 과학 기술에도 종이접기 기술이 쓰인대요. 종이를 눌러 접는 선을 놓아 보세요.", hints: ["자의 눈금을 보고 2.5 cm마다 접는 선을 놓아요.", "접는 선은 2.5 cm, 5 cm, 7.5 cm에 놓여요.", "10 cm=100 mm, 2.5 cm=25 mm예요."],
      render: (b, a) => dv2Fold(b, a, { len: "10", part: "2.5", snap: "0.5", unit: "cm",
        asks: [
          ["몇 칸으로 나누어 접을 수 있는지 구하는 식은", { o: ["10÷2.5", "10×2.5", "2.5÷10"], a: 0 }],
          ["어림셈: 2.5를 2로 어림하면 10÷2 =", { n: "5", s: 1 }, "이므로 5칸쯤이에요."],
          ["10 cm =", { n: "100" }, "mm, 2.5 cm =", { n: "25" }, "mm이므로 100÷25 =", { n: "4", e: "100÷25" }, "→ 10÷2.5 =", { n: "4", e: "10÷2.5" }],
          ["종이를", { n: "4", s: 1 }, "칸으로 나누어 접을 수 있고, 어림셈한 5칸과", { o: ["비슷해요", "같아요"], a: 0 }]],
        ok: "10÷2.5와 100÷25는 각각 10배 한 것이라 몫이 같아요. 종이를 4칸으로 나누어 접을 수 있어요." }) },
    { inst: "3÷0.75를 어떻게 계산하는지 알아봐요. 나누어지는 수 3은 3.00처럼 소수점 아래에 0이 있다고 생각할 수 있어요(흐린 0). 두 수의 소수점을 옮겨 두 수가 자연수가 되게 해 보세요.", hints: ["0.75가 자연수가 되려면 소수점을 두 자리 옮겨요.", "3도 소수점을 두 자리 옮기면 300이에요.", "300÷75=4예요."],
      render: (b, a) => dv2Shift(b, a, { items: [{ a: "3", b: "0.75", both: true }],
        asks: [
          ["300÷75 =", { n: "4", e: "300÷75" }, "이므로 3÷0.75 =", { n: "4", e: "3÷0.75", why: { "0.04": "3÷0.75는 300÷75와 몫이 같아요. 검산: 0.75×0.04=0.03이에요." } }],
          ["나누는 수 0.75가 자연수가 되도록 두 수를 각각", { o: ["100배", "10배"], a: 0 }, "했어요."]],
        ok: "3을 3.00으로 생각하고 두 수를 각각 100배 하면 300÷75=4예요." }) },
    { inst: "3÷0.75를 세로셈과 분수의 나눗셈으로 계산해 보세요. 말풍선: “나누는 수가 자연수가 되도록 나누어지는 수와 나누는 수에 각각 100씩 곱해요.” “300을 75로 나눈 몫을 써요.”", hints: ["3 뒤에 소수점이 있다고 생각하고 0을 두 개 붙여 300으로 만들었어요.", "75×4=300이에요.", "6은 0.1이 60개, 1.2는 0.1이 12개예요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "3", b: "0.75" }],
        rows: [
          { g: "분수의 나눗셈으로 계산하기", rows: [["3÷0.75 =", { f: ["300", "100"], why: { "3/1": "0.75=[75/100]과 분모를 같게 해요. 3=[300/100]이에요." } }, "÷", { f: ["75", "100"] }, "= 300÷75 =", { n: "4", e: "300÷75" }]] },
          { g: "0.1의 개수로 생각하기: 6÷1.2", rows: [["6은 0.1이", { n: "60", s: 1 }, "개, 1.2는 0.1이", { n: "12", s: 1 }, "개이므로 6÷1.2 = 60÷12 =", { n: "5", e: "6÷1.2" }]] }],
        ok: "3÷0.75=300÷75=4예요. 6÷1.2는 0.1이 60개인 수를 0.1이 12개인 수로 나누는 것과 같아서 60÷12=5예요." }) },
    { inst: "(자연수)÷(소수)를 계산하는 방법을 정리해 보세요.", hints: ["10÷2.5는 각각 10배, 3÷0.75는 각각 100배 했어요.", "3은 3.00으로 생각했어요."],
      render: (b, a) => blanks(b, a, ["(자연수)÷(소수)는 나누는 수가 ", { o: ["자연수", "소수"], a: 0 }, "가 되도록 나누어지는 수와 나누는 수를 각각 10배 또는 각각 100배 하여 자연수의 나눗셈과 같은 방법으로 계산해요. 나누어지는 수가 자연수이면 소수점 아래에 ", { o: ["0", "1"], a: 0 }, "이 있다고 생각하고 소수점을 옮겨요. 분모가 10 또는 100인 ", { o: ["분수의 나눗셈", "분수의 덧셈"], a: 0 }, "으로 나타내어 계산할 수도 있어요."]) },
    { inst: "계산해 보세요.", hints: ["0.7)35는 7)350처럼 계산해요.", "1.48)37은 148)3700처럼 계산해요.", "63÷1.8=630÷18, 54÷0.36=5400÷36이에요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "35", b: "0.7" }, { a: "37", b: "1.48" }],
        rows: [["63÷1.8 =", { n: "35", e: "63÷1.8" }], ["54÷0.36 =", { n: "150", e: "54÷0.36" }]],
        ok: "35÷0.7=50, 37÷1.48=25, 63÷1.8=35, 54÷0.36=150이에요. 자연수 뒤에 0을 붙여 소수점을 옮겼어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 물음에 답해 보세요.", hints: ["63÷1.4는 630÷14와 몫이 같아요.", "가로등 사이의 간격 수를 먼저 구해요.", "처음과 끝에도 가로등을 세우면 가로등은 간격 수보다 1개 많아요."],
    render: (b, a) => dv2Sent(b, a, [
      ["36÷2.4: 각각", { n: "10", s: 1 }, "배 하면 360÷24 =", { n: "15", e: "360÷24" }, "→ 36÷2.4 =", { n: "15", e: "36÷2.4" }],
      ["9÷1.5 =", { n: "6", e: "9÷1.5" }, ", 14÷1.75 =", { n: "8", e: "14÷1.75" }, ", 18÷3.6 =", { n: "5", e: "18÷3.6" }, ", 62÷1.24 =", { n: "50", e: "62÷1.24" }],
      ["52÷6.5와 15÷0.75의 몫의 합은", { n: "28", e: "52÷6.5+15÷0.75" }, "이에요."],
      ["63÷1.4의 몫을 4.5라고 쓴 친구가 있어요. 잘못된 까닭은", { o: ["몫의 소수점을 잘못 찍었어요", "나누는 수를 잘못 썼어요"], a: 0 }, "이고, 옳은 몫은", { n: "45", e: "63÷1.4" }, "이에요."],
      { q: "길이가 124 m인 도로 한쪽에 1.55 m 간격으로 가로등을 세우려고 해요. 도로의 처음과 끝에도 세운다면 가로등은 몇 개 필요할까요?", p: ["간격 수: 124÷1.55 =", { n: "80", e: "124÷1.55" }, "→ 가로등:", { n: "81", e: "80+1", why: { "80": "처음과 끝에도 세우면 가로등은 간격 수보다 1개 많아요." } }, "개"] }],
      { ok: "15, 6·8·5·50, 합 28, 옳은 몫 45, 가로등 81개예요. 잘했어요!" }) }
},
{
  id: "t6", no: 6, title: "몫을 반올림하여 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "나눗셈의 몫이 나누어떨어지지 않을 때 몫을 어떻게 나타낼까요?",
  summary: "7÷3=2.333…처럼 몫이 간단한 소수로 구해지지 않을 때는 몫을 반올림하여 나타내요. 일의 자리까지 나타내려면 소수 첫째 자리 숫자를, 소수 첫째 자리까지 나타내려면 소수 둘째 자리 숫자를 보아요. 7÷3의 몫은 약 2, 약 2.3이에요. 1.2÷0.7=1.714…는 약 2, 약 1.7, 약 1.71로 나타내요.",
  steps: [
    { inst: "“가상 현실 체험관에서 우주 탐험을 하는 데 7분, 바다 탐험을 하는 데 3분이 걸립니다. 우주 탐험 시간은 바다 탐험 시간의 약 몇 배인지 알아보세요.” 7÷3을 세로셈으로 소수 셋째 자리까지 계산해 보세요. (계산기를 써서 확인해도 돼요.)", hints: ["3)7에서 몫 2를 쓰고 7=7.000으로 생각해 0을 내려요.", "10÷3을 계속하게 돼요. 몫에 3이 계속 나와요.", "몫은 2.333…이에요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "7", b: "3", mode: "tr", places: 3 }], tip: "7 뒤의 흐린 0을 하나씩 내리며 계속 나누어요. 몫을 맨 위 칸에 쓰고 소수점을 찍어요.",
        rows: [
          ["7÷3의 몫은 같은 숫자 3이", { o: ["끝없이 되풀이돼요", "곧 나누어떨어져요"], a: 0 }],
          ["몫이 간단한 소수로 구해지지 않을 때는 몫을", { o: ["반올림하여", "끝까지 모두 써서"], a: 0 }, "나타낼 수 있어요."]],
        ok: "7÷3=2.333…처럼 나누어떨어지지 않아요. 이럴 때는 몫을 올림, 버림, 반올림하여 나타낼 수 있어요." }) },
    { inst: "7÷3의 몫 2.333…을 반올림하여 나타내 보세요. 몫에서 확인할 숫자를 누르고 답을 써요.", hints: ["일의 자리까지 나타내려면 소수 첫째 자리 숫자를 봐요.", "소수 첫째 자리까지 나타내려면 소수 둘째 자리 숫자를 봐요.", "3은 5보다 작으니 버려요."],
      render: (b, a) => dv2Round(b, a, { items: [{ e: "7÷3", to: 0 }, { e: "7÷3", to: 1 }],
        asks: [["우주 탐험 시간은 바다 탐험 시간의 약", { n: "2", r: ["7÷3", 0] }, "배, 소수 첫째 자리까지 나타내면 약", { n: "2.3", r: ["7÷3", 1] }, "배예요."]],
        ok: "일의 자리까지 약 2배, 소수 첫째 자리까지 약 2.3배예요. 나타낼 자리의 바로 아래 자리 숫자를 보고 반올림했어요." }) },
    { inst: "1.2÷0.7을 세로셈으로 계산하고 몫을 반올림하여 나타내 보세요. 어느 자리까지 나타내느냐에 따라 확인할 숫자의 자리가 달라져요.", hints: ["7)12처럼 계산하고 0을 내려 계속 나누어요. 몫은 1.714…예요.", "일의 자리까지: 소수 첫째 자리 숫자 7을 보고 올려요.", "소수 둘째 자리까지: 소수 셋째 자리 숫자 4를 보고 버려요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "1.2", b: "0.7", mode: "tr", places: 3 }],
        rows: [
          ["일의 자리까지:", { n: "2", r: ["1.2÷0.7", 0], why: { "1": "소수 첫째 자리 숫자가 7이에요. 5이거나 5보다 크면 올려요." } }, ", 소수 첫째 자리까지:", { n: "1.7", r: ["1.2÷0.7", 1] }, ", 소수 둘째 자리까지:", { n: "1.71", r: ["1.2÷0.7", 2] }],
          ["소수 둘째 자리까지 나타낼 때 확인하는 숫자는", { o: ["소수 셋째 자리 숫자 4", "소수 둘째 자리 숫자 1"], a: 0 }]],
        ok: "1.2÷0.7=1.714…이므로 약 2, 약 1.7, 약 1.71로 나타낼 수 있어요." }) },
    { inst: "몫을 반올림하여 나타내는 방법을 정리해 보세요.", hints: ["7÷3을 소수 첫째 자리까지 나타낼 때 소수 둘째 자리 숫자 3을 보았어요.", "반올림은 5이거나 5보다 크면 올리고, 5보다 작으면 버려요."],
      render: (b, a) => blanks(b, a, ["몫이 간단한 소수로 구해지지 않을 때는 몫을 반올림하여 나타낼 수 있어요. 몫을 반올림하여 소수 첫째 자리까지 나타내려면 ", { o: ["소수 둘째 자리", "소수 첫째 자리"], a: 0 }, " 숫자를 보고, 그 숫자가 5이거나 5보다 크면 ", { o: ["올리고", "버리고"], a: 0 }, ", 5보다 작으면 ", { o: ["버려요", "올려요"], a: 0 }, ". 먼저 몇째 자리까지 나타낼지 정하고, 그 ", { o: ["바로 아래 자리", "맨 끝 자리"], a: 0 }, "까지만 계산하면 돼요."]) },
    { inst: "몫을 반올림하여 소수 둘째 자리까지 나타내어 보세요. 확인할 숫자(소수 셋째 자리)를 누르고 답을 써요. 계산기를 써서 몫을 구해도 돼요.", hints: ["3÷9=0.333…, 8.2÷6=1.366…이에요.", "6.1÷0.9=6.777…, 1.58÷10.2=0.154…예요.", "소수 셋째 자리 숫자가 5이거나 5보다 크면 소수 둘째 자리 숫자를 하나 올려요."],
      render: (b, a) => dv2Round(b, a, { items: [{ e: "3÷9", to: 2 }, { e: "8.2÷6", to: 2 }, { e: "6.1÷0.9", to: 2 }, { e: "1.58÷10.2", to: 2 }],
        ok: "3÷9≈0.33, 8.2÷6≈1.37, 6.1÷0.9≈6.78, 1.58÷10.2≈0.15예요!" }) }
  ],
  challenge: { inst: "“노란색 점토가 7 kg, 파란색 점토가 1.3 kg 있습니다. 노란색 점토의 무게는 파란색 점토의 무게의 약 몇 배인지 구해 봅시다.” 또, 수 카드 2, 3, 4, 6을 한 번씩 모두 써서 몫이 가장 큰 (소수 한 자리 수)÷(소수 한 자리 수)를 만들어 보세요.", hints: ["7÷1.3=5.384…예요.", "몫이 가장 크려면 나누어지는 수는 가장 크게, 나누는 수는 가장 작게 만들어요.", "6.4÷2.3=2.782…예요."],
    render: (b, a) => dv2Cards(b, a, { cards: ["2", "3", "4", "6"],
      asks: [
        { q: "점토: 7÷1.3 = 5.384…를 반올림하여 나타내기", p: ["일의 자리까지 약", { n: "5", r: ["7÷1.3", 0] }, "배, 소수 첫째 자리까지 약", { n: "5.4", r: ["7÷1.3", 1] }, "배, 소수 둘째 자리까지 약", { n: "5.38", r: ["7÷1.3", 2] }, "배"] },
        ["만든 나눗셈의 몫을 반올림하여 소수 둘째 자리까지 나타내면", { n: "2.78", r: ["6.4÷2.3", 2] }, "이에요."]],
      ok: "점토는 약 5배, 약 5.4배, 약 5.38배처럼 정한 자리에 따라 나타낼 수 있어요. 몫이 가장 큰 나눗셈은 6.4÷2.3이고 몫은 약 2.78이에요." }) }
},
{
  id: "t7", no: 7, title: "나누어 주고 남는 양을 알아볼까요", soop: "개념 구축하기(O)",
  question: "소수의 나눗셈에서 나누어 주고 남는 양은 어떻게 구할까요?",
  summary: "흙 6.3 kg을 2 kg씩 담으면 6.3−2−2−2=0.3이므로 3통에 담고 0.3 kg이 남아요. 사람 수나 도막 수처럼 몫이 자연수여야 할 때는 몫을 자연수 부분까지만 구하고, 남는 양의 소수점은 나누어지는 수의 처음 소수점 위치에 맞추어 찍어요. 12.4÷1.5는 8명, 0.4 L이고 1.5×8+0.4=12.4로 확인해요.",
  steps: [
    { inst: "마지막으로 도착한 곳은 식물 공장이에요. “식물 공장의 로봇이 흙 6.3 kg을 한 통에 2 kg씩 나누어 담고 있습니다. 흙을 2 kg씩 몇 통까지 나누어 담을 수 있고, 남는 흙은 몇 kg인지 알아보세요.” 수직선에서 2 kg씩 묶어 보세요.", hints: ["2 kg씩 묶으면 2, 4, 6이에요.", "6에서 6.3까지는 2 kg보다 적어서 더 묶을 수 없어요.", "6.3에서 2를 3번 빼면 0.3이 남아요."],
      render: (b, a) => dv2Line(b, a, { to: "6.3", step: "2", max: "7", tick: "1", unit: "kg", rem: "남는 흙",
        asks: [
          ["구하는 식은", { o: ["6.3÷2", "6.3×2", "2÷6.3"], a: 0 }],
          ["뺄셈식: 6.3 − 2 − 2 − 2 =", { n: "0.3", e: "6.3−2−2−2" }],
          ["나누어 담을 수 있는 통의 수:", { n: "3", s: 1 }, "통, 남는 흙의 양:", { n: "0.3", why: { "3": "흙의 양은 6.3에서 6을 뺀 만큼이에요." } }, "kg"]],
        ok: "6.3에서 2를 3번 뺄 수 있으므로 3통, 3번 빼면 0.3이 남으므로 남는 흙은 0.3 kg이에요." }) },
    { inst: "“주스 12.4 L를 한 사람에게 1.5 L씩 나누어 주려고 합니다. 주스를 1.5 L씩 몇 명까지 나누어 줄 수 있고, 남는 주스는 몇 L인지 구해 봅시다.” 세로셈으로 계산해 보세요. 몫은 자연수 부분까지만 쓰고, 남는 양을 주황 칸에 쓴 뒤 소수점을 찍어요. 말풍선: “남는 양의 소수점은 12.4의 소수점에 맞추어 찍어요.”", hints: ["15)124처럼 계산해요. 15×8=120이에요.", "124−120=4예요. 남는 양은 4 L일까요?", "남는 양의 소수점은 12.4의 처음 소수점(흐린 동그라미)에 맞추어 찍어요. 0.4 L예요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "12.4", b: "1.5", mode: "rem", what: "사람 수" }],
        rows: [
          ["나누어 줄 수 있는 사람 수:", { n: "8", s: 1 }, "명, 남는 주스의 양:", { n: "0.4", why: { "4": "남는 양의 소수점은 12.4의 처음 소수점에 맞추어 찍어요. 4 L가 아니라 0.4 L예요." } }, "L"],
          ["몫을 자연수 부분까지만 구한 까닭은 몫이", { o: ["나누어 줄 수 있는 사람 수를 나타내기 때문이에요", "1보다 작기 때문이에요"], a: 0 }],
          ["계산 확인: 1.5 ×", { n: "8", s: 1 }, "+", { n: "0.4" }, "=", { n: "12.4", e: "1.5×8+0.4" }]],
        ok: "주스는 8명에게 나누어 줄 수 있고 0.4 L가 남아요. 1.5×8+0.4=12.4로 계산이 맞아요." }) },
    { inst: "“길이가 24.65 m인 띠종이를 한 도막에 3.8 m씩 자르고 있습니다. 3.8 m씩 몇 도막까지 자를 수 있고, 남는 띠종이는 몇 m인지 구해 봅시다.” 말풍선: “계산이 맞는지 확인해 봐.” 구한 과정을 친구에게 설명해 보세요.", hints: ["38)246.5처럼 계산해요. 38×6=228이에요.", "246.5−228=18.5예요. 남는 양의 소수점은 24.65의 처음 소수점 위치에 맞추어요.", "확인: 3.8×6+1.85=24.65"],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "24.65", b: "3.8", mode: "rem", what: "도막 수" }],
        rows: [
          ["자를 수 있는 도막 수:", { n: "6", s: 1 }, "도막, 남는 띠종이의 길이:", { n: "1.85", why: { "18.5": "남는 양의 소수점은 24.65의 처음 소수점 위치에 맞추어 찍어요." } }, "m"],
          ["확인: 3.8 × 6 + 1.85 =", { n: "24.65", e: "3.8×6+1.85" }],
          ["도막 수는", { o: ["자연수이므로 몫을 자연수 부분까지만 구했어요", "소수이므로 끝까지 나누었어요"], a: 0 }]],
        ok: "도막 수는 자연수이므로 몫을 6까지만 구하고, 남는 길이는 나누어지는 수의 처음 소수점에 맞추어 1.85 m로 구했어요." }) },
    { inst: "나누어 주고 남는 양을 구하는 방법을 정리해 보세요.", hints: ["사람 수, 통의 수, 도막 수는 자연수예요.", "12.4÷1.5에서 남는 양은 12.4의 소수점에 맞추어 0.4였어요.", "1.5×8+0.4=12.4로 확인했어요."],
      render: (b, a) => blanks(b, a, ["사람 수나 도막 수처럼 몫이 자연수여야 할 때는 몫을 ", { o: ["자연수 부분까지만", "나누어떨어질 때까지"], a: 0 }, " 구해요. 남는 양의 소수점은 나누어지는 수의 ", { o: ["처음", "옮긴"], a: 0 }, " 소수점 위치에 맞추어 찍어요. 계산이 맞는지는 나누는 수 × 몫 + 남는 양 = ", { o: ["나누어지는 수", "나누는 수"], a: 0 }, "로 확인해요."]) },
    { inst: "소금 34.1 kg을 한 봉지에 6 kg씩 나누어 담으려고 해요. 세로셈으로 몇 봉지에 담을 수 있고 남는 소금은 몇 kg인지 구하고, 물음에 답해 보세요.", hints: ["6)34.1에서 몫은 자연수 부분 5까지만 써요.", "34.1−30=4.1이에요.", "색 테이프: 3.5×8=28, 29.6−28=1.6이에요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "34.1", b: "6", mode: "rem", what: "봉지 수" }],
        rows: [
          ["뺄셈으로 확인: 34.1 − 6 − 6 − 6 − 6 − 6 =", { n: "4.1", e: "34.1−6−6−6−6−6" }],
          ["소금은", { n: "5", s: 1 }, "봉지에 담을 수 있고, 남는 소금은", { n: "4.1" }, "kg이에요."],
          { q: "색 테이프 29.6 m를 한 모둠에 3.5 m씩 나누어 주려고 해요.", p: ["3.5 × 8 =", { n: "28", e: "3.5×8" }, "이므로", { n: "8", s: 1 }, "모둠까지 나누어 줄 수 있고, 남는 색 테이프는", { n: "1.6", e: "29.6−3.5×8" }, "m예요."] }],
        ok: "소금은 5봉지, 남는 소금 4.1 kg이에요. 색 테이프는 8모둠에 나누어 주고 1.6 m가 남아요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 물음에 답해 보세요.", hints: ["검산해 봐요: 1.7×9+0.9는 얼마일까요?", "바둑돌의 수, 사람 수는 자연수예요."],
    render: (b, a) => quiz(b, a, [
      { q: "찰흙 16.2 kg을 한 사람에게 1.7 kg씩 나누어 주려고 해요. 은호는 “9명, 9 kg”, 민하는 “9명, 0.9 kg”이라고 했어요. 바르게 구한 사람은 누구일까요?", o: ["은호", "민하"], a: 1, why: { "0": "검산: 1.7×9+9=24.3이라 16.2가 아니에요. 남는 양의 소수점은 16.2의 처음 소수점에 맞추어 찍어요." } },
      { q: "1.2, 2.7, 4, 5, 11, 0.8 중에서 바둑돌의 수가 될 수 있는 것을 모두 골라 보세요.", o: ["1.2", "2.7", "4", "5", "11", "0.8"], a: [2, 3, 4] },
      { q: "1.2, 2.7, 0.8이 바둑돌의 수가 될 수 없는 까닭은 무엇일까요?", o: ["바둑돌의 수는 자연수로만 셀 수 있기 때문이에요", "수가 너무 작기 때문이에요"], a: 0 }],
      { ok: "민하가 바르게 구했어요(1.7×9+0.9=16.2). 바둑돌의 수, 사람 수는 자연수만 될 수 있어요." }) }
},
{
  id: "t89", no: "8~9", title: "생각을 더하다 ― 자동차 연료를 얼마나 절약할 수 있을까요", soop: "탐구 정리하기(O)",
  question: "하이브리드 자동차를 타고 가면 휘발유 자동차를 타고 갈 때보다 연료를 몇 L 절약할 수 있을까요?",
  summary: "할머니 댁까지 337.92 km를 갈 때 필요한 연료는 하이브리드 자동차 337.92÷17.6=19.2 (L), 휘발유 자동차 337.92÷9.6=35.2 (L)이므로 35.2−19.2=16 (L)를 절약할 수 있어요. 수찬이네가 동물원(144.84 km)에 갈 때는 144.84÷24.14=6 (L), 144.84÷8.52=17 (L)이므로 11 L를 절약해요.",
  steps: [
    { name: "이해해요", inst: "✽ 하이브리드 자동차: 휘발유, 경유 등의 연료 또는 전기 에너지를 함께 사용하는 환경친화적 자동차. “다음 민영이네 가족의 이야기를 읽고 할머니 댁에 가는 데 하이브리드 자동차를 타고 가면 휘발유 자동차를 타고 갈 때보다 연료를 몇 L 절약할 수 있는지 구해 봅시다.”", hints: ["구하려는 것은 절약할 수 있는 연료의 양이에요.", "연료 1 L로 하이브리드 자동차는 17.6 km, 휘발유 자동차는 9.6 km를 갈 수 있어요."],
      render: (b, a) => quiz(b, a, [
        { fig: () => dv2Talk([["가족:", "집에서 할머니 댁까지의 거리는 337.92 km구나. 자동차를 타고 가면 연료가 많이 필요하겠어요."], ["가족:", "이번에 바꾼 하이브리드 자동차가 바꾸기 전의 휘발유 자동차보다 연료가 더 적게 든단다."], ["민영:", "얼마나 더 적게 들어요?"], ["가족:", "연료 1 L로 하이브리드 자동차는 17.6 km를 갈 수 있고, 휘발유 자동차는 9.6 km를 갈 수 있지."], ["민영:", "할머니 댁까지 하이브리드 자동차를 타고 가면 휘발유 자동차로 갈 때보다 연료를 몇 L 절약할 수 있는지 제가 계산해 볼게요!"]]),
          q: "구하려는 것은 무엇인가요?", o: ["하이브리드 자동차를 타면 절약할 수 있는 연료의 양", "할머니 댁까지 걸리는 시간", "자동차의 가격"], a: 0 },
        { q: "집에서 할머니 댁까지의 거리는 얼마인가요?", o: ["337.92 km", "17.6 km", "9.6 km"], a: 0 },
        { q: "연료 1 L로 하이브리드 자동차가 갈 수 있는 거리는 얼마인가요?", o: ["17.6 km", "9.6 km", "337.92 km"], a: 0 }],
        { ok: "두 자동차가 할머니 댁까지 가는 데 필요한 연료의 양을 각각 구해 비교해요." }) },
    { name: "계획해요", inst: "할머니 댁에 가는 데 필요한 연료의 양은 어떻게 구할 수 있을지 계획해 보세요.", hints: ["1 L로 17.6 km를 가니까, 337.92 km 안에 17.6 km가 몇 번 들어가는지 알아봐요.", "절약하는 연료는 두 연료의 양의 차예요."],
      render: (b, a) => quiz(b, a, [
        { q: "할머니 댁에 가는 데 필요한 연료의 양은 어떻게 구할 수 있나요?", o: ["할머니 댁까지의 거리를 자동차가 1 L로 갈 수 있는 거리로 나눠요", "할머니 댁까지의 거리에 1 L로 갈 수 있는 거리를 곱해요", "두 거리를 더해요"], a: 0 },
        { q: "하이브리드 자동차에 필요한 연료의 양을 구하는 식은?", o: ["337.92÷17.6", "337.92×17.6", "17.6÷337.92"], a: 0 },
        { q: "절약할 수 있는 연료의 양은 어떻게 구하나요?", o: ["휘발유 자동차에 필요한 연료의 양에서 하이브리드 자동차에 필요한 연료의 양을 빼요", "두 연료의 양을 더해요"], a: 0 }],
        { ok: "거리를 1 L로 갈 수 있는 거리로 나누어 연료의 양을 구하고, 두 연료의 양의 차를 구해요." }) },
    { name: "해결해요 ① 하이브리드", inst: "하이브리드 자동차에 연료를 넣어 할머니 댁까지 가 보세요. 연료 막대를 끌어 대강 맞추고 ±0.1 L 단추로 할머니 댁에 딱 도착하게 맞추어요. 계산기를 써도 돼요.", hints: ["337.92÷17.6을 계산해 봐요. 176)3379.2처럼 계산해요.", "17.6×19=334.4, 17.6×19.2=337.92예요.", "연료는 19.2 L예요."],
      render: (b, a) => dv2Fuel(b, a, { dist: "337.92", per: "17.6", car: "하이브리드 자동차", color: "#2E8B57", place: "할머니 댁",
        asks: [["하이브리드 자동차: 337.92÷17.6 =", { n: "19.2", e: "337.92÷17.6" }, "(L)"]],
        ok: "하이브리드 자동차는 연료 19.2 L로 할머니 댁까지 갈 수 있어요(17.6×19.2=337.92)." }) },
    { name: "해결해요 ② 휘발유", inst: "이번에는 휘발유 자동차에 연료를 넣어 할머니 댁까지 가 보고, 연료를 몇 L 절약할 수 있는지 구해 보세요.", hints: ["337.92÷9.6은 3379.2÷96과 몫이 같아요.", "9.6×35.2=337.92예요.", "35.2−19.2를 계산해요."],
      render: (b, a) => dv2Fuel(b, a, { dist: "337.92", per: "9.6", car: "휘발유 자동차", color: "#C8472E", place: "할머니 댁",
        asks: [["휘발유 자동차: 337.92÷9.6 =", { n: "35.2", e: "337.92÷9.6" }, "(L)"],
          ["절약할 수 있는 연료: 35.2 − 19.2 =", { n: "16", e: "35.2−19.2" }, "(L)"]],
        ok: "휘발유 자동차는 35.2 L가 필요해요. 하이브리드 자동차를 타고 가면 연료를 16 L 절약할 수 있어요." }) },
    { name: "수찬이네 동물원 가는 길", inst: "“수찬이네 어머니는 연료 1 L로 8.52 km를 갈 수 있는 휘발유 자동차를 연료 1 L로 24.14 km를 갈 수 있는 하이브리드 자동차로 바꾸었습니다. 집에서 거리가 144.84 km 떨어진 동물원에 가는 데 하이브리드 자동차를 타고 가면 휘발유 자동차를 타고 갈 때보다 연료를 몇 L 절약할 수 있는지 구해 봅시다.” 계산기를 써도 돼요.", hints: ["필요한 연료의 양 = 거리 ÷ 1 L로 갈 수 있는 거리", "144.84÷24.14는 14484÷2414와 몫이 같아요.", "144.84÷8.52는 14484÷852와 몫이 같아요."],
      render: (b, a) => dv2Sent(b, a, [
        ["하이브리드 자동차: 144.84 ÷ 24.14 =", { n: "6", e: "144.84÷24.14" }, "(L)"],
        ["휘발유 자동차: 144.84 ÷ 8.52 =", { n: "17", e: "144.84÷8.52" }, "(L)"],
        ["절약할 수 있는 연료:", { n: "11", e: "17−6" }, "L"]],
        { fig: () => dv2Talk([["수찬:", "하이브리드 자동차를 타고 동물원으로 출발!"]]), ok: "하이브리드 자동차는 6 L, 휘발유 자동차는 17 L가 필요해서 11 L를 절약할 수 있어요." }) },
    { name: "되돌아봐요", inst: "문제를 해결한 과정을 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "필요한 연료의 양을 어떻게 구했는지 설명해 보세요.", tag: "해결 방법", ph: "예) 거리를 1 L로 갈 수 있는 거리로 나누었어요. 337.92÷17.6=19.2예요." },
        { q: "같은 거리를 갈 때 연료를 적게 쓰면 어떤 점이 좋은지, 내가 할 수 있는 환경 보호 활동을 써 보세요.", tag: "환경", ph: "예) 연료를 아끼면 공기가 덜 오염돼요. 가까운 곳은 걸어서 가요." }]) }
  ],
  challenge: { inst: "연료 1 L로 갈 수 있는 거리를 비교해요. 하이브리드 자동차는 휘발유 자동차보다 약 몇 배 더 멀리 갈 수 있을까요? 몫을 반올림하여 소수 첫째 자리까지 나타내 보세요.", hints: ["(하이브리드 자동차가 1 L로 가는 거리)÷(휘발유 자동차가 1 L로 가는 거리)를 계산해요.", "17.6÷9.6=1.833…이에요.", "소수 둘째 자리 숫자를 보고 반올림해요."],
    render: (b, a) => dv2Sent(b, a, [
      ["민영이네: 17.6 ÷ 9.6 → 약", { n: "1.8", r: ["17.6÷9.6", 1], why: { "1.9": "소수 둘째 자리 숫자가 3이에요. 5보다 작으면 버려요." } }, "배"],
      ["수찬이네: 24.14 ÷ 8.52 → 약", { n: "2.8", r: ["24.14÷8.52", 1] }, "배"]],
      { ok: "민영이네 하이브리드 자동차는 약 1.8배, 수찬이네는 약 2.8배 더 멀리 갈 수 있어요." }) }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 소수의 나눗셈으로 떠나는 섬나라 여행", soop: "발표하기(P)",
  question: "소수의 나눗셈을 옳게 계산하며 섬나라를 여행해 볼까요?",
  summary: "두 사람이 번갈아 주사위를 던져 나온 눈의 수만큼 말을 옮기고, 도착한 칸의 소수의 나눗셈을 해요. 상대방은 계산기로 답을 확인하고, 틀리면 말을 전에 있던 칸으로 돌려놓아요. 상대방의 말이 있는 칸에 도착하면 주사위를 한 번 더 던져요. 도착 칸에 먼저 도착하는 사람이 이겨요.",
  steps: [
    { name: "놀이 방법 알기", inst: "놀이 방법을 읽고 답해 보세요(2명, 준비물: 주사위·말·계산기). ① 가위바위보로 놀이 순서를 정하고 말을 출발 칸에 놓아요. ② 순서대로 주사위를 던져 나온 눈의 수만큼 말을 이동해요. ③ 이동한 칸에 있는 나눗셈을 해요. 상대방은 답이 맞는지 계산기로 확인해요. 잘못 계산한 경우 말을 전에 있던 칸으로 돌려놓아요. ④ 이동한 칸에 상대방의 말이 있으면 주사위를 한 번 더 던져 나온 눈의 수만큼 이동한 후 ③을 해요. ⑤ ②~④를 반복해요. 말이 도착 칸에 먼저 도착하는 사람이 이겨요.", hints: ["틀리면 전에 있던 칸으로 돌아가요.", "상대방의 말이 있는 칸이면 주사위를 한 번 더 던져요.", "옳게 계산해야 앞으로 나아갈 수 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "도착한 칸의 나눗셈을 잘못 계산하면 어떻게 하나요?", o: ["말을 전에 있던 칸으로 돌려놓아요", "말을 출발 칸으로 보내요", "그 칸에 그대로 있어요"], a: 0 },
        { q: "이동한 칸에 상대방의 말이 있으면 어떻게 하나요?", o: ["주사위를 한 번 더 던져 이동한 뒤 그 칸의 나눗셈을 해요", "상대방 말을 출발 칸으로 보내요", "차례를 넘겨요"], a: 0 },
        { q: "놀이판에는 어떤 문제가 있나요? 모두 골라 보세요.", o: ["(소수)÷(소수)", "(자연수)÷(소수)", "몫을 반올림하여 나타내는 문제", "분수의 곱셈"], a: [0, 1, 2] },
        { q: "놀이에서 이기려면, 그리고 주의할 점은 무엇일까요?", o: ["옳게 계산하고, 상대방의 계산이 맞는지 계산기로 확인해요", "계산은 대충 하고 주사위만 크게 나오길 바라요"], a: 0 }],
        { ok: "옳게 계산해야 앞으로 나아갈 수 있어요. 승부보다 문제를 바르게 해결하는 데 집중하고, 친구를 배려하며 놀이해요." }) },
    { name: "놀이판 문제 미리 계산하기", inst: "놀이판에 있는 문제 몇 개를 미리 계산해 보세요.", hints: ["3.4)7.82는 34)78.2처럼 계산해요.", "0.45)18은 45)1800처럼 계산해요.", "8.24÷3.7=2.227…, 19÷0.6=31.666…이에요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "7.82", b: "3.4" }, { a: "18", b: "0.45" }],
        rows: [
          ["13.08÷3.27 =", { n: "4", e: "13.08÷3.27" }],
          ["8.24÷3.7의 몫을 반올림하여 일의 자리까지 나타내면", { n: "2", r: ["8.24÷3.7", 0] }],
          ["19÷0.6의 몫을 반올림하여 소수 첫째 자리까지 나타내면", { n: "31.7", r: ["19÷0.6", 1], why: { "31.6": "소수 둘째 자리 숫자가 6이에요. 5이거나 5보다 크면 올려요." } }]],
        ok: "7.82÷3.4=2.3, 18÷0.45=40, 13.08÷3.27=4, 8.24÷3.7≈2, 19÷0.6≈31.7이에요!" }) },
    { name: "섬나라 여행 놀이", inst: "짝과 함께 놀이해 보세요. ‘주사위 던지기’를 누르면 말이 저절로 움직여요. 도착한 칸의 몫을 쓰면 계산기로 확인해 줘요. 반올림 칸은 적힌 자리까지 나타내요.", hints: ["두 수의 소수점을 같은 자리만큼 옮겨 자연수의 나눗셈처럼 계산해요.", "반올림 칸은 나타낼 자리의 바로 아래 자리 숫자를 봐요.", "검산으로 몫이 맞는지 확인해 봐요."],
      render: (b, a) => dv2Island(b, a, { ok: "섬나라 여행을 끝까지 했어요! 옳게 계산해야 앞으로 나아갈 수 있었지요?" }) },
    { name: "되돌아보기", inst: "놀이를 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 계산하기 어려웠던 나눗셈과 그 나눗셈을 계산한 방법을 써 보세요.", tag: "계산", ph: "예) 0.45)18은 45)1800처럼 계산해서 몫이 40이에요." },
        { q: "놀이를 하며 친구를 배려한 점을 써 보세요.", tag: "배려", ph: "예) 친구가 틀렸을 때 어디서 틀렸는지 친절하게 알려 주었어요." }]) }
  ],
  challenge: { inst: "또 다른 놀이: 빙고예요(3~4명이 하는 놀이를 로봇 친구와 해 봐요). ① 놀이판에 있는 (소수)÷(소수), (자연수)÷(소수)를 계산해요. ② 9개를 골라 3×3 빙고판에 나눗셈과 몫을 써요. ③ 순서대로 빙고판에 쓴 것 중 하나를 골라 나눗셈과 몫을 말해요. 같은 식이 있으면 ○표를 해요. ④ 가로·세로·대각선으로 3줄을 먼저 만들면 이겨요.", hints: ["식 카드를 누르면 빙고판 빈칸에 들어가요. ✕를 누르면 빠져요.", "몫을 모두 바르게 써야 빙고판이 완성돼요.", "가운데 칸은 줄을 많이 만들 수 있어요."],
    render: (b, a) => dv2Bingo(b, a, { ok: "빙고 놀이를 끝까지 했어요! 소수의 나눗셈을 정확하게 계산했어요." }) }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "소수의 나눗셈을 계산하고 생활 속 문제를 해결할 수 있나요?",
  summary: "나누어지는 수와 나누는 수를 각각 10배 또는 각각 100배 하면 몫은 같아요. 그래서 (소수)÷(소수), (자연수)÷(소수)는 자연수의 나눗셈이나 분수의 나눗셈으로 계산해요. 몫이 나누어떨어지지 않으면 바로 아래 자리에서 반올림하고, 몫이 자연수여야 하면 몫을 자연수 부분까지만 구한 뒤 남는 양의 소수점을 나누어지는 수의 처음 소수점에 맞추어 찍어요.",
  steps: [
    { name: "내 힘으로 풀어요 1·2", inst: "자연수의 나눗셈과 분수의 나눗셈을 이용하여 계산해 보세요. 보기: 36÷1.2 = [360/10] ÷ [12/10] = 360÷12 = 30", hints: ["9.6÷0.8은 두 수를 각각 10배, 2.01÷0.67은 각각 100배 해요.", "2.5는 분모가 10인 분수로, 0.84는 분모가 100인 분수로 나타내요.", "15=[150/10], 21=[2100/100]이에요."],
      render: (b, a) => dv2Sent(b, a, [
        ["9.6÷0.8: 각각 10배 → 96÷8 =", { n: "12", e: "96÷8" }, "→ 9.6÷0.8 =", { n: "12", e: "9.6÷0.8" }],
        ["2.01÷0.67: 각각 100배 → 201÷67 =", { n: "3", e: "201÷67" }, "→ 2.01÷0.67 =", { n: "3", e: "2.01÷0.67" }],
        ["⑴ 15÷2.5 =", { f: ["150", "10"] }, "÷", { f: ["25", "10"] }, "= 150÷25 =", { n: "6", e: "15÷2.5" }],
        ["⑵ 21÷0.84 =", { f: ["2100", "100"] }, "÷", { f: ["84", "100"] }, "= 2100÷84 =", { n: "25", e: "21÷0.84" }]],
      { ok: "9.6÷0.8=12, 2.01÷0.67=3, 15÷2.5=6, 21÷0.84=25예요!" }) },
    { name: "내 힘으로 풀어요 3", inst: "계산해 보세요.", hints: ["0.19)2.85는 19)285처럼 계산해요.", "2.6)4.42는 26)44.2처럼 계산하고, 몫의 소수점을 44.2의 소수점에 맞추어 찍어요.", "30÷1.25는 3000÷125와 몫이 같아요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "2.85", b: "0.19" }, { a: "4.42", b: "2.6" }],
        rows: [["28.8÷3.2 =", { n: "9", e: "28.8÷3.2" }, ", 30÷1.25 =", { n: "24", e: "30÷1.25" }]],
        ok: "2.85÷0.19=15, 4.42÷2.6=1.7, 28.8÷3.2=9, 30÷1.25=24예요!" }) },
    { name: "내 힘으로 풀어요 4", inst: "몫을 반올림하여 소수 둘째 자리까지 나타내어 보세요. 세로셈으로 소수 셋째 자리까지 계산해요.", hints: ["4.7)10은 47)100처럼 계산하고 0을 내려 계속 나누어요.", "소수 셋째 자리 숫자를 보고 반올림해요.", "10÷4.7=2.127…, 1.54÷1.3=1.184…예요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "10", b: "4.7", mode: "tr", places: 3 }, { a: "1.54", b: "1.3", mode: "tr", places: 3 }],
        rows: [["10÷4.7 → 약", { n: "2.13", r: ["10÷4.7", 2], why: { "2.12": "소수 셋째 자리 숫자가 7이에요. 5이거나 5보다 크면 올려요." } }, ", 1.54÷1.3 → 약", { n: "1.18", r: ["1.54÷1.3", 2] }]],
        ok: "10÷4.7=2.127…→약 2.13, 1.54÷1.3=1.184…→약 1.18이에요!" }) },
    { name: "내 힘으로 풀어요 5", inst: "은채가 쓴 강낭콩 관찰 일지예요. □ 안에 알맞은 수를 구해 보세요. 이해해요 → 계획해요 → 해결해요 → 되돌아봐요 차례로 생각해요.", hints: ["구하려는 것은 10월 17일 줄기의 길이가 10월 2일 줄기 길이의 몇 배인지예요.", "잎의 수는 이 문제를 푸는 데 필요하지 않아요.", "22.95÷13.5는 229.5÷135와 몫이 같아요."],
      render: (b, a) => dv2Sent(b, a, [
        ["10월 2일 줄기의 길이는", { n: "13.5" }, "cm, 10월 17일 줄기의 길이는", { n: "22.95" }, "cm예요."],
        ["문제를 푸는 데 필요 없는 정보는", { o: ["잎의 수", "줄기의 길이"], a: 0 }],
        ["식: 22.95 ÷ 13.5 =", { n: "1.7", e: "22.95÷13.5" }, "→ □ =", { n: "1.7" }]],
      { fig: dv2Journal, ok: "10월 17일 줄기의 길이는 10월 2일의 22.95÷13.5=1.7(배)가 되었어요. 잎의 수는 필요 없는 정보였어요." }) },
    { name: "내 힘으로 풀어요 6", inst: "“털실 23.8 m를 한 사람에게 4.5 m씩 나누어 주려고 합니다. 몇 명까지 나누어 줄 수 있고 남는 털실은 몇 m인지 다음과 같이 계산했습니다.” 친구의 계산: 45)238 → 몫 5, 225, 13 → “나누어 줄 수 있는 사람 수: 5명, 남는 털실의 길이: 13 m”. 잘못 계산한 곳을 찾아 이유를 쓰고, 세로셈으로 옳게 계산해 보세요.", hints: ["사람 수는 자연수이므로 몫을 자연수 부분까지만 구해요.", "238−225=13이에요. 남는 양의 소수점은 23.8의 소수점 위치에 맞추어 찍어요.", "확인: 4.5×5+1.3=23.8"],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "23.8", b: "4.5", mode: "rem", what: "사람 수" }],
        rows: [
          ["잘못된 까닭:", { o: ["남는 털실의 길이를 구할 때 23.8의 소수점 위치에 맞추어 소수점을 찍지 않았어요", "몫을 자연수 부분까지만 구했어요"], a: 0, why: { "1": "사람 수는 자연수이므로 몫을 자연수 부분까지만 구하는 것이 맞아요." } }],
          ["옳게 계산하면: 나누어 줄 수 있는 사람 수", { n: "5", s: 1 }, "명, 남는 털실의 길이", { n: "1.3", why: { "13": "남는 양의 소수점은 23.8의 처음 소수점 위치에 맞추어요." } }, "m"],
          ["확인: 4.5 × 5 + 1.3 =", { n: "23.8", e: "4.5×5+1.3" }]],
        ok: "남는 털실의 길이는 13 m가 아니라 1.3 m예요. 4.5×5+1.3=23.8로 확인했어요." }) },
    { name: "확인하고 정리해요", inst: "빈칸을 채우며 이 단원에서 배운 내용을 정리해 보세요.", hints: ["96÷8=12이고 9.6÷0.8=12예요.", "0.36)2.52는 36)252, 1.8)6.12는 18)61.2, 2.5)12는 25)120처럼 계산해요.", "2.2÷7=0.314…예요."],
      render: (b, a) => dv2Long(b, a, { probs: [{ a: "2.52", b: "0.36" }, { a: "6.12", b: "1.8" }, { a: "12", b: "2.5" }],
        rows: [
          ["나누어지는 수와 나누는 수를 각각 10배 또는 각각 100배 하면 몫은", { o: ["같아요", "커져요", "작아져요"], a: 0 }],
          ["2.2÷7의 몫을 반올림하여 소수 첫째 자리까지 나타내면", { n: "0.3", r: ["2.2÷7", 1] }, "이에요."]],
        ok: "2.52÷0.36=7, 6.12÷1.8=3.4, 12÷2.5=4.8, 2.2÷7≈0.3이에요. 소수의 나눗셈을 모두 정리했어요!" }) },
    { name: "나만의 정리", inst: "이 단원에서 배운 내용을 생각하며 스스로 평가하고, 기억에 남는 내용을 나만의 표현(글·그림·기호)으로 정리해 보세요(수학익힘 36쪽).",
      render: (b, a) => writeStep(b, a, [
        { q: "(소수)÷(소수), (자연수)÷(소수)를 계산할 수 있나요? 몫을 반올림하여 나타내고, 나누어 주고 남는 양을 구할 수 있나요? 스스로 평가해 써 보세요.", tag: "자기 평가", ph: "예) 계산은 잘하지만 남는 양의 소수점을 찍을 때 조심해야 해요." },
        { q: "이 단원에서 기억에 남는 내용을 나만의 표현으로 정리해 보세요.", tag: "정리", ph: "예) 3.6÷0.9 → 36÷9: 두 수를 똑같이 10배 하면 몫은 그대로!" }]) }
  ],
  challenge: { inst: "이 앱이 만든 도전 문제예요. 배운 내용을 모두 써서 풀어 보세요.", hints: ["□×2.4=9.6이면 □=9.6÷2.4예요.", "병의 수는 자연수예요. 0.8×9=7.2예요.", "8.5÷0.7=12.142…예요."],
    render: (b, a) => dv2Sent(b, a, [
      ["□ × 2.4 = 9.6일 때 □ =", { n: "4", e: "9.6÷2.4" }],
      { q: "물 7.5 L를 한 병에 0.8 L씩 나누어 담으려고 해요.", p: ["", { n: "9", s: 1 }, "병까지 담을 수 있고, 남는 물은", { n: "0.3", e: "7.5−0.8×9", why: { "3": "남는 양의 소수점은 7.5의 처음 소수점에 맞추어 찍어요." } }, "L예요."] },
      ["8.5÷0.7의 몫을 반올림하여 소수 첫째 자리까지 나타내면", { n: "12.1", r: ["8.5÷0.7", 1] }, "이에요."]],
      { ok: "□=4, 물은 9병에 담고 0.3 L가 남아요(0.8×9+0.3=7.5). 8.5÷0.7≈12.1이에요. 훌륭해요!" }) }
}
];
