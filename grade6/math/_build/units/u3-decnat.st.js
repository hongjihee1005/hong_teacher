//@@APP
const APP={title:"새봄 스포츠 클럽 기록실", unit:"6-1 수학 3. 소수의 나눗셈", key:"s61-decnat-v1", welcome:"새봄 스포츠 클럽 기록실에 온 것을 환영해요", intro:"새봄초등학교 6학년 스포츠 클럽 기록 담당 친구들과 함께 스포츠 음료·줄넘기 줄·라인 페인트·결승선 테이프·메디신볼·코트 선·달리기 기록을 자연수로 똑같이 나누어, (소수)÷(자연수)를 계산하고 (자연수)÷(자연수)의 몫을 소수로 나타내고, 어림셈으로 몫의 소수점 위치를 확인해 봐요."};
//@@UNIT
/* ===== 6-1 3. 소수의 나눗셈 단원 조작 부품 (앞글자 dn3) — 이야기 버전 =====
   교과서 버전(u3-decnat.tb.js)의 dn3 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요
   (입력칸 0.9초 · 고르기 0.26초 · 끌기·단추·세로셈 판 1.2초). 소수를 쓰는 중(‘1.’, 답보다 숫자가 적은 동안)에는 확인하지 않아요.
   수는 모두 BigInt 분수(분자/분모)로 계산해서 소수 계산 오차가 없어요.
   글 속 분수 표기: [62/10], [(62÷2)/10] → 화면에서 위아래로 쌓은 분수로 보여 줘요.
   한 계단에 활동이 둘이면(엔진 hj-multi) 부품마다 api.done( 을 불러야 하나로 세어요 — 부품마다 그 표시를 적어 두었어요. */

/*dn3-core*/
function dn3Norm(s) { return String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/[．。·]/g, ".").replace(/^\+/, ""); }
function dn3Gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; }
function dn3R(n, d = 1n) { if (d < 0n) { n = -n; d = -d; } const g = dn3Gcd(n, d) || 1n; return { n: n / g, d: d / g }; }
/* "0.5"·".5"·"5."·"3.60" → 분수, 수가 아니면 null */
function dn3P(s) {
  s = dn3Norm(s);
  if (!/^\d*\.?\d*$/.test(s) || !/\d/.test(s)) return null;
  const [i, f = ""] = s.split(".");
  if (f.length > 12) return null;
  return dn3R(BigInt((i || "0") + f), 10n ** BigInt(f.length));
}
const dn3Eq = (x, y) => !!x && !!y && x.n === y.n && x.d === y.d;
const dn3Add = (x, y) => dn3R(x.n * y.d + y.n * x.d, x.d * y.d);
const dn3Sub = (x, y) => dn3R(x.n * y.d - y.n * x.d, x.d * y.d);
const dn3Mul = (x, y) => dn3R(x.n * y.n, x.d * y.d);
const dn3Div = (x, y) => y.n === 0n ? null : dn3R(x.n * y.d, x.d * y.n);
const dn3Pow = k => 10n ** BigInt(k);
const dn3Lt = (x, y) => x.n * y.d < y.n * x.d;
/* 식 계산: + − × ÷ (곱셈·나눗셈 먼저) */
function dn3E(e) {
  const t = String(e).replace(/−/g, "-").replace(/[x*]/g, "×").replace(/[\/:]/g, "÷").replace(/\s/g, "");
  const tk = t.match(/[+\-×÷]|[\d.]+/g); if (!tk || tk.join("") !== t) return null;
  let sum = dn3R(0n), sign = 1, cur = dn3P(tk[0]); if (cur == null) return null;
  for (let k = 1; k < tk.length; k += 2) {
    const op = tk[k], v = dn3P(tk[k + 1]); if (v == null) return null;
    if (op === "×") cur = dn3Mul(cur, v);
    else if (op === "÷") { cur = dn3Div(cur, v); if (!cur) return null; }
    else { sum = sign > 0 ? dn3Add(sum, cur) : dn3Sub(sum, cur); sign = op === "+" ? 1 : -1; cur = v; }
  }
  return sign > 0 ? dn3Add(sum, cur) : dn3Sub(sum, cur);
}
/* 분수 → 소수 k자리 글(끝의 0도 그대로) */
function dn3Fix(r, k) {
  const m = dn3Pow(k), neg = r.n < 0n, n = neg ? -r.n : r.n, v = n * m / r.d;
  const s = v.toString().padStart(k + 1, "0"), i = s.slice(0, s.length - k), f = s.slice(s.length - k);
  return (neg ? "−" : "") + i + (k ? "." + f : "");
}
/* 나누어떨어지는 소수 글(아니면 null) */
function dn3Exact(r) {
  if (!r) return null;
  let k = 0; while (k < 30 && dn3Pow(k) % r.d !== 0n) k++;
  if (k >= 30) return null;
  return dn3Fix(r, k);
}
function dn3TruncR(r, k) { const m = dn3Pow(k), neg = r.n < 0n, n = neg ? -r.n : r.n; const v = n * m / r.d; return dn3R(neg ? -v : v, m); }
function dn3Str(r, k = 3) { if (!r) return "?"; const s = dn3Exact(r); return s != null ? s : dn3Fix(dn3TruncR(r, k), k) + "…"; }
const dn3V = e => dn3Str(dn3E(e));
function dn3Dn(s) { const m = dn3Norm(s).match(/\.(\d+)/); return m ? m[1].length : 0; }
/* 받침에 맞는 조사(수는 마지막 숫자 읽기로) */
function dn3J(s, pair) {
  const str = String(s), c = str[str.length - 1];
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"], "이라": ["이라", "라"] };
  const [a, b] = M[pair];
  if (pair === "으로") return str + (has && !rieul ? a : b);
  return str + (has ? a : b);
}
const dn3Sp = e => String(e).replace(/÷/g, " ÷ ").replace(/×/g, " × ").replace(/\+/g, " + ").replace(/−/g, " − ");
/* 흔한 실수 찾기 (소수÷자연수): 소수점 위치 · 소수 첫째 자리 0 빠뜨림 · 0을 내리지 않고 멈춤 */
function dn3Diag(e, v) {
  if (!e || v == null) return null;
  const m = String(e).replace(/\s/g, "").match(/^([\d.]+)÷(\d+)$/); if (!m) return null;
  const ok = dn3E(e); if (!ok || dn3Eq(ok, v)) return null;
  const okS = dn3Exact(ok);
  for (let k = 1; k <= 4; k++) for (const big of [true, false]) {
    const w = big ? dn3Mul(ok, dn3R(dn3Pow(k))) : dn3Div(ok, dn3R(dn3Pow(k)));
    if (dn3Eq(w, v)) {
      const back = dn3Str(dn3Mul(dn3P(m[2]), v));
      return `숫자는 맞는데 몫의 소수점 위치가 달라요. 검산해 봐요: ${m[2]} × ${dn3Str(v)} = ${dn3J(back, "이라")} ${dn3J(m[1], "이가")} 아니에요. 몫의 소수점은 나누어지는 수의 소수점 위치에 맞추어 찍어요.`;
    }
  }
  if (okS && /\.0/.test(okS) && dn3Eq(dn3P(okS.replace(/\.0+/, ".")), v)) return "몫의 소수 첫째 자리에 0을 써야 해요. 수를 하나 내려도 나누는 수보다 작아 나눌 수 없으면 몫에 0을 쓰고 수를 하나 더 내려 계산해요.";
  for (let k = 0; okS && k < dn3Dn(okS); k++) if (dn3Eq(dn3TruncR(ok, k), v)) return "나누어떨어질 때까지 계산해요. 나머지가 있으면 소수점 아래 끝자리에 0이 있다고 생각하고 0을 내려 계속 나누어요.";
  return null;
}
/* 분수 표기 [n/d], [w n/d], [(62÷2)/10] */
const DN3FR = "\\[(?:(\\d+) )?([\\d×÷().]+)\\/([\\d×().]+)\\]";
const dn3Re = () => new RegExp(DN3FR, "g");
function dn3Plain(s) { return String(s == null ? "" : s).replace(dn3Re(), (m, w, n, d) => `${w ? dn3J(w, "과와") + " " : ""}${d}분의 ${n}`); }
/*dn3-core-end*/

function dn3Style() {
  if (document.getElementById("dn3-style")) return;
  const s = document.createElement("style"); s.id = "dn3-style";
  s.textContent = `
.dn3fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.dn3fw{margin-right:.1em}
.dn3q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.dn3q>.dn3n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.dn3q>.dn3d{padding:.05em .14em 0}
.dn3row{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .4em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);margin:.4em 0;line-height:1.8}
input.dn3in{box-sizing:border-box;width:4.8em;height:1.7em;padding:0 .2em;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.dn3in.dn3s{width:3.4em}
.dn3fi{display:inline-flex;flex-direction:column;align-items:center;gap:.12em;vertical-align:middle}
.dn3fi input.dn3in{width:3.8em;height:1.45em}
.dn3fi .dn3bar{width:100%;height:0;font-size:0;line-height:0;border-top:.13em solid currentColor}
.dn3chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.dn3chs .opt{padding:.05em .55em}
.opt.dn3on{border-color:var(--ring);background:var(--ring-soft)}
.dn3q2{font-family:Jua,sans-serif;margin-top:.55em}
.dn3grp{border:2px solid var(--line);border-radius:.8em;padding:.35em .7em;margin:.45em 0}
.dn3gt{font-family:Jua,sans-serif;color:var(--night)}
.dn3ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.dn3stage svg{width:100%;height:auto;max-height:60vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r);touch-action:none;user-select:none}
.dn3fig svg{width:100%;height:auto;display:block;max-height:40vh;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.dn3rel{max-width:26em}
.dn3tools{display:flex;flex-wrap:wrap;gap:.4em;align-items:center;margin:.4em 0}
.dn3tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .75em;font-family:Jua,sans-serif;color:var(--ink)}
.dn3tools button:disabled{opacity:.45}
.dn3say{font-family:Jua,sans-serif;color:var(--night);font-size:calc(var(--fs)*1.05);margin:.3em 0}
.dn3say b{color:var(--ring);font-weight:400}
.dn3talk{border-left:5px solid var(--pine);background:#F4FAF6;border-radius:.5em;padding:.35em .8em;margin:.35em 0}
.dn3talk p{margin:.2em 0}
.dn3talk b{color:var(--pine);font-family:Jua,sans-serif;font-weight:400}
.dn3vts{display:flex;flex-wrap:wrap;gap:.8em 1.8em;align-items:flex-start;margin:.3em 0}
.dn3vbox{min-width:0;max-width:100%}
.dn3vcap{font-family:Jua,sans-serif;color:var(--night);font-size:var(--fs)}
.dn3lt{border-collapse:collapse;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.6);margin:.2em 0}
.dn3lt td{width:1.3em;height:1.45em;text-align:center;padding:0;line-height:1;position:relative}
.dn3lt td.dn3dvs{width:auto;padding:0 .1em 0 0;white-space:nowrap;text-align:right}
.dn3lt td.dn3lab{width:auto;white-space:nowrap;text-align:right;font-size:.5em;color:var(--pine);padding-right:.5em}
.dn3lt tr.dn3dd td.dn3dc{border-top:3px solid var(--ink)}
.dn3paren{display:inline-block;transform:scaleY(1.25);margin-left:.05em}
.dn3lt input{box-sizing:border-box;width:1.15em;height:1.3em;font-size:.82em;text-align:center;font-family:Jua,sans-serif;border:2px solid var(--line);border-radius:.3em;padding:0;background:#fff;color:var(--ink)}
.dn3lt tr.dn3memo input{border-style:dashed;font-size:.68em;width:1.1em;height:1.15em;color:#5D6E68}
.dn3g{color:#B3C1BB}
.dn3dot{position:absolute;right:-.12em;bottom:.14em;width:.22em;height:.22em;border-radius:50%;background:#C8472E}
.dn3lt button.dn3pt,.dn3strip button.dn3pt{position:absolute;right:-.22em;bottom:.02em;width:.42em;height:.42em;border-radius:50%;border:2px dashed #C8472E;background:#fff;padding:0;z-index:2}
.dn3lt button.dn3pt.dn3pon,.dn3strip button.dn3pt.dn3pon{background:#C8472E;border-style:solid}
.dn3memo-cap{font-size:var(--fs-s);color:var(--muted);font-family:"Gowun Dodum",sans-serif}
.dn3strip{display:inline-flex;align-items:flex-end;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.6);vertical-align:middle}
.dn3strip span.dn3c{position:relative;display:inline-block;width:.95em;text-align:center}
.dn3calc{display:inline-grid;grid-template-columns:repeat(4,2.6em);gap:.25em;background:#EEF2F0;border:2px solid var(--line);border-radius:.8em;padding:.45em;font-family:Jua,sans-serif}
.dn3calc .dn3disp{grid-column:1/-1;background:#E3F1E6;border:2px solid #9FB8A8;border-radius:.4em;text-align:right;padding:.1em .4em;font-size:calc(var(--fs)*1.25);min-height:1.5em;overflow:hidden;white-space:nowrap}
.dn3calc button{border:2px solid var(--line);background:#fff;border-radius:.45em;padding:.2em 0;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);color:var(--ink)}
.dn3calc button.dn3op{background:#FFF1D6}
.dn3cwrap{display:flex;flex-wrap:wrap;gap:.6em 1.2em;align-items:flex-start;margin:.3em 0}
.dn3cwrap>.dn3cmain{flex:1 1 22em;min-width:0}
.dn3tbl{border-collapse:collapse;font-size:var(--fs);margin:.3em 0;max-width:100%}
.dn3tbl th,.dn3tbl td{border:2px solid var(--line);padding:.2em .55em;text-align:center}
.dn3tbl th{background:#F2F5F4;font-family:Jua,sans-serif;font-weight:400}
.dn3cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.dn3cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2em;text-align:center}
.dn3cards .opt:disabled{opacity:.3}
.dn3slots{display:flex;gap:.3em;margin:.4em 0;flex-wrap:wrap;align-items:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4)}
.dn3slot{min-width:1.7em;height:2em;border:2px dashed var(--ring);border-radius:.4em;background:#fff;font-family:Jua,sans-serif;font-size:1em;padding:0 .2em;color:var(--ink)}
.dn3score{display:flex;flex-wrap:wrap;gap:.6em;font-family:Jua,sans-serif;margin:.3em 0}
.dn3score span{border-radius:.6em;padding:.15em .7em;border:2px solid var(--line)}
.dn3score span.dn3turn{border-color:var(--ring);background:var(--ring-soft)}
.dn3note{font-size:var(--fs-s);color:var(--muted)}
.dn3card{display:inline-flex;align-items:center;justify-content:center;min-width:7em;min-height:3.6em;border:3px solid #C99A57;border-radius:.7em;background:#FFF8E8;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);padding:0 .5em}
.dn3card.dn3back{background:repeating-linear-gradient(45deg,#F6C08A 0 8px,#FCE3C2 8px 16px);color:transparent}
.dn3pile{display:flex;flex-wrap:wrap;gap:.25em;min-height:1.6em;font-size:var(--fs-s)}
.dn3pile span{border:2px solid #C99A57;border-radius:.4em;padding:0 .35em;background:#FFF8E8;font-family:Jua,sans-serif}
.dn3chips{display:flex;flex-wrap:wrap;gap:.35em;margin:.3em 0}
.dn3chips .opt{font-family:Jua,sans-serif;padding:.1em .6em}
`;
  document.head.append(s);
}
/* 분수 모양 요소와 글 속 분수 바꾸기 */
function dn3FracEl(w, n, d) {
  return h("span", { class: "dn3fr" }, w ? h("span", { class: "dn3fw" }, String(w)) : null,
    h("span", { class: "dn3q" }, h("span", { class: "dn3n" }, String(n)), h("span", { class: "dn3d" }, String(d))));
}
function dn3RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow,input")) return;
  const re = dn3Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(dn3FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function dn3RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return dn3RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(dn3RenderText);
}
(function dn3Boot() {
  dn3Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") dn3RenderText(m.target); else m.addedNodes.forEach(dn3RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(dn3Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
function dn3A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(dn3Plain) }) }); }
const dn3Quiz0 = quiz, dn3Blanks0 = blanks;
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done( 을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return dn3Quiz0(body, dn3A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return dn3Blanks0(body, dn3A(api), parts, o); };

const DN3C = { one: "#F6C08A", ten: "#9CC6EC", hun: "#A9D8A2", line: "#C9D4CF", dark: "#7A8C86", red: "#C8472E", blue: "#2B7BD6", green: "#2E8B57", orange: "#E8913A", wood: "#C99A57", sand: "#FFF3D6" };
function dn3Fig(svg, cls) { return h("div", { class: cls || "dn3fig" }, svg); }
function dn3Talk(lines) { return h("div", { class: "dn3talk" }, lines.map(([who, t]) => h("p", {}, h("b", {}, who + " "), t))); }
/* SVG 안의 분수(위아래로 쌓기) */
function dn3SvgFrac(g, x, y, n, d, size, fill) {
  g.append(txt(x, y - size * 0.55, String(n), size, { fill }), svgEl("line", { x1: x - size * 0.75, y1: y, x2: x + size * 0.75, y2: y, stroke: fill, "stroke-width": 2 }), txt(x, y + size * 0.6, String(d), size, { fill }));
}
/* 몫의 관계 그림: rows=[["260","4","65"],["2.6","4","0.65"]], k = 100 (아래 줄이 [1/k]배) */
function dn3RelFig(rows, k) {
  const W = 600, gapY = 104, H = 50 + (rows.length - 1) * gapY + 30, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const xs = { a: 130, o: 228, b: 300, e: 372, q: 470 };
  rows.forEach(([a, b, q], r) => {
    const y = 40 + r * gapY;
    g.append(txt(xs.a, y, a, 30), txt(xs.o, y, "÷", 30), txt(xs.b, y, b, 30), txt(xs.e, y, "=", 30), txt(xs.q, y, q, 30, { fill: DN3C.green }));
    if (r) {
      const y0 = y - gapY + 24, y1 = y - 24, ym = (y0 + y1) / 2;
      ["a", "q"].forEach(c => {
        g.append(svgEl("line", { x1: xs[c], y1: y0, x2: xs[c], y2: y1 - 6, stroke: DN3C.red, "stroke-width": 2.5 }), svgEl("path", { d: `M${xs[c] - 6} ${y1 - 10} L${xs[c]} ${y1} L${xs[c] + 6} ${y1 - 10} z`, fill: DN3C.red }));
        dn3SvgFrac(g, xs[c] + 36, ym, 1, k, 15, DN3C.red); g.append(txt(xs[c] + 66, ym, "배", 16, { fill: DN3C.red }));
      });
      g.append(txt(xs.b, ym, "그대로", 15, { fill: DN3C.dark }));
    }
  });
  return dn3Fig(svg, "dn3fig dn3rel");
}

/* ===== 묻는 칸 만들기 (모든 부품이 함께 씀) =====
   줄(parts): "글" | {n:"3.1", e:"6.2÷2", why:{"틀린 값":"까닭"}} 수 칸 | {f:["62","10"]} 분수 칸 | {o:[…], a, why} 고르기 | {m:[…], a:[…]} 여러 개 | {el: () => 요소} */
function dn3Reg() { return { items: [], plain: [] }; }
function dn3Parts(parts, reg) {
  const row = h("div", { class: "dn3row" }); const plain = [];
  parts.forEach(pt => {
    if (pt == null) return;
    if (typeof pt === "string" || typeof pt === "number") { row.append(h("span", {}, String(pt))); plain.push(dn3Plain(String(pt))); return; }
    if (pt.el) { row.append(pt.el()); return; }
    if (pt.n != null) {
      const want = dn3P(pt.n); if (want == null) throw new Error("답 형식 오류: " + pt.n);
      if (pt.e) { const v = dn3E(pt.e); if (!dn3Eq(v, want)) throw new Error(`답 확인 필요: ${pt.e} = ${pt.n} (계산 ${dn3Str(v)})`); }
      const inp = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "dn3in" + (pt.s ? " dn3s" : ""), "aria-label": "빈칸" });
      row.append(inp); reg.items.push({ k: "n", pt, inp, want }); plain.push(String(pt.n)); return;
    }
    if (pt.f) {
      const ni = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "dn3in", "aria-label": "분자" });
      const di = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "dn3in", "aria-label": "분모" });
      row.append(h("span", { class: "dn3fi" }, ni, h("span", { class: "dn3bar" }, "​"), di));
      reg.items.push({ k: "f", pt, ni, di }); plain.push(`[${pt.f[0]}/${pt.f[1]}]`); return;
    }
    if (pt.o || pt.m) {
      const multi = !!pt.m, list = pt.o || pt.m, sel = new Set(), box = h("span", { class: "dn3chs" });
      list.forEach((o, i) => box.append(h("button", { class: "opt", onclick: ev => {
        if (multi) { sel.has(i) ? sel.delete(i) : sel.add(i); ev.currentTarget.classList.toggle("dn3on"); }
        else { sel.clear(); sel.add(i); [...box.children].forEach(b => b.classList.remove("dn3on")); ev.currentTarget.classList.add("dn3on"); }
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
function dn3Rows(rows, reg) {
  const wrap = h("div");
  rows.forEach(r => {
    if (Array.isArray(r)) return wrap.append(dn3Parts(r, reg));
    if (r.g) { const g = h("div", { class: "dn3grp" }, h("div", { class: "dn3gt" }, r.g)); g.append(dn3Rows(r.rows, reg)); wrap.append(g); return; }
    if (r.fig) wrap.append(r.fig());
    if (r.q) wrap.append(h("div", { class: "dn3q2" }, r.q));
    if (r.p) wrap.append(dn3Parts(r.p, reg));
  });
  return wrap;
}
const dn3Int = s => { const t = dn3Norm(s); return /^\d+$/.test(t) ? String(BigInt(t)) : null; };
/* 채점: 처음 틀린 곳의 까닭을 돌려줘요 */
function dn3Judge(reg, opt = {}) {
  let bad = null; const given = [];
  reg.items.forEach(it => {
    const pt = it.pt;
    if (it.k === "n") {
      const raw = it.inp.value.trim(), v = dn3P(raw), ok = v != null && dn3Eq(v, it.want);
      it.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; given.push(raw || "-");
      if (!ok && !bad) bad = raw === "" ? "빈칸에 답을 써요." : v == null ? "칸에는 수만 써요. 소수는 0.5처럼 써요." :
        (pt.why && pt.why[dn3Str(v)]) || dn3Diag(pt.e, v) || pt.bad || opt.bad || "빨간 칸을 다시 생각해 봐요.";
      return;
    }
    if (it.k === "f") {
      const nr = it.ni.value.trim(), dr = it.di.value.trim(), n = dn3Int(nr), d = dn3Int(dr);
      const okN = n === String(BigInt(pt.f[0])), okD = d === String(BigInt(pt.f[1]));
      it.ni.style.borderColor = okN ? "var(--ok)" : "var(--no)"; it.di.style.borderColor = okD ? "var(--ok)" : "var(--no)";
      given.push(`${nr || "-"}/${dr || "-"}`);
      if ((!okN || !okD) && !bad) bad = (!nr || !dr) ? "분수의 분자와 분모 칸을 모두 채워요." : n == null || d == null ? "분수 칸에는 자연수만 써요." :
        (pt.why && pt.why[`${n}/${d}`]) || (!okD && /^10+$/.test(pt.f[1]) ? "소수 한 자리 수는 분모가 10인 분수로, 소수 두 자리 수는 분모가 100인 분수로 나타내요." : null) || pt.bad || "분수 칸을 다시 살펴봐요.";
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
/* ===== 저절로 확인하기 (이야기 버전) =====
   ready(): 다 했는지(아직 쓰거나 고르는 중이면 false) · sig(): 지금 상태 글 · judge(): 채점해서 맞으면 true.
   같은 상태로는 다시 세지 않아요(고쳐 쓰는 동안 '틀림'이 쌓이지 않아요). */
function dn3sAuto(root, ready, sig, judge) {
  let last = null, fin = false;
  const run = () => { if (fin) return true; const s = sig(); if (s === last) return false; last = s; if (judge() === true) fin = true; return fin; };
  const A = {}; [260, 900, 1200].forEach(w => { A[w] = autoRun(ready, sig, run, w); });
  const kick = w => A[w || 900]();
  root.addEventListener("input", () => kick(900));
  root.addEventListener("change", () => kick(900));
  root.addEventListener("focusout", e => { if (e.target.matches && e.target.matches("input")) setTimeout(() => kick(900), 0); });
  root.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches && e.target.matches("input")) { e.preventDefault(); e.target.blur(); } });
  root.addEventListener("click", e => { const b = e.target.closest && e.target.closest("button"); if (b) kick(b.classList.contains("opt") ? 260 : 1200); });
  root.addEventListener("pointerup", e => { if (e.target.closest && e.target.closest("svg")) kick(1200); });
  return kick;
}
/* 쓴 숫자의 개수(소수점 빼고): "0.48" → 3 */
const dn3sDg = s => dn3Norm(s).replace(/[^0-9]/g, "").length;
/* 묻는 칸이 다 찼나요? 수 칸은 '1.'처럼 소수점까지만 쓴 중이거나, 칸에 있는 동안 답보다 숫자가 적으면 기다려요. */
function dn3sFilled(reg) {
  const act = document.activeElement;
  return reg.items.every(it => {
    if (it.k === "n") { const v = it.inp.value.trim(); if (!v || /[.．。·]$/.test(v)) return false; return act !== it.inp || dn3sDg(v) >= dn3sDg(String(it.pt.n)); }
    if (it.k === "f") { const n = it.ni.value.trim(), d = it.di.value.trim(); if (!n || !d) return false;
      if (act === it.ni && n.length < String(it.pt.f[0]).length) return false;
      if (act === it.di && d.length < String(it.pt.f[1]).length) return false; return true; }
    if (it.k === "m") return it.sel.size >= it.pt.a.length;
    return it.sel.size > 0;
  });
}
function dn3sSig(reg) { return reg.items.map(it => it.k === "f" ? it.ni.value.trim() + "/" + it.di.value.trim() : it.inp ? it.inp.value.trim() : [...it.sel].sort().join(",")).join("§"); }
/* 저절로 확인(그림 조작 검사 → 줄 묶음 채점). pre(): 조작 검사 {bad, given}, more(): 조작 판이 다 찼는지(세로셈·소수점 찍기 등)
   묻는 칸이 있으면 다 채웠을 때 확인하고(조작이 덜 되었으면 그때 알려 줘요), 묻는 칸이 없으면 조작이 맞을 때 확인해요. 맞으면 api.done( 을 불러요. */
function dn3Check(body, api, reg, opt, pre, more) {
  body.__dn3 = () => reg;   // 점검용
  const ready = () => {
    if (more && !more()) return false;
    if (!dn3sFilled(reg)) return false;
    if (!reg.items.length && pre && !more) { const p = pre(); if (p && p.bad) return false; }
    return true;
  };
  const sig = () => dn3sSig(reg) + "#" + (pre ? (pre() || {}).given || "" : "");
  dn3sAuto(body, ready, sig, () => {
    const p = pre ? pre() : null;
    if (p && p.bad) { api.fail(p.bad, p.given || "-"); return false; }
    const r = dn3Judge(reg, opt);
    const g = [p && p.given, r.given].filter(Boolean).join(" / ");
    if (r.bad) { api.fail(r.bad, g); return false; }
    api.tryOnce(); api.done(g, opt.ok); return true;
  });
}
/* ① 빈칸 줄 문제 */
function dn3Sent(body, api, rows, opt = {}) {
  /* 다 하면 dn3Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dn3Style();
  const reg = dn3Reg();
  if (opt.fig) body.append(opt.fig());
  body.append(dn3Rows(rows, reg));
  api.provide({ words: opt.words || [], answers: reg.plain.filter(Boolean) });
  dn3Check(body, api, reg, opt);
}

/* ===== ② 수 모형(1·0.1·0.01)을 똑같이 나누어 주기 =====
   opt: {a:"6.2", k:2, grp:"공깃돌", asks, ok, tip}
   위 '나누어 줄 수 모형'에서 모형을 끌어 아래 묶음에 놓아요(누르면 가장 적게 받은 묶음으로 가요).
   1을 똑같이 나누어 줄 수 없으면 '바꾸기'로 0.1 10개로 바꾸어 나누어요. */
const DN3T = ["1", "0.1", "0.01"], DN3TC = [DN3C.one, DN3C.ten, DN3C.hun];
function dn3Blocks(body, api, opt) {
  /* 다 하면 dn3Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dn3Style();
  const A = dn3Norm(opt.a), K = opt.k, RA = dn3P(A), Q = dn3Div(RA, dn3R(BigInt(K)));
  const qS = dn3Exact(Q); if (qS == null || dn3Dn(qS) > 2) throw new Error("수 모형으로 나눌 수 없어요: " + A);
  const [ai, af = ""] = A.split(".");
  const T = 1 + Math.max(af.length, dn3Dn(qS));
  const init = [Number(ai), Number(af[0] || 0), Number(af[1] || 0)].slice(0, T);
  const q100 = Number(Q.n * 100n / Q.d), goal = [Math.floor(q100 / 100), Math.floor(q100 / 10) % 10, q100 % 10].slice(0, T);
  const grpName = opt.grp || "묶음", cntW = opt.cnt || "개";
  let pool, grp, hist, drag = null, boxes = [], zones = [];
  const reset = () => { pool = init.slice(); grp = Array.from({ length: K }, () => Array(T).fill(0)); hist = []; };
  reset();
  const W = 760, x0 = 10, PH = 170, GY = PH + 16, SZ = [{ w: 44, h: 44, gx: 6, gy: 6 }, { w: 7, h: 44, gx: 4, gy: 6 }, { w: 9, h: 9, gx: 3, gy: 3 }];
  const zw = T === 2 ? [420, 310] : [290, 230, 200];
  const svg = makeSvg(W, 400), g = svgEl("g"), gh = svgEl("g"); svg.append(g, gh);
  const say = h("div", { class: "dn3say" }, "​");
  const piece = (t, x, y, sc = 1) => {
    const s = SZ[t], w = s.w * sc, hh = s.h * sc, e = svgEl("g");
    e.append(svgEl("rect", { x, y, width: w, height: hh, fill: DN3TC[t], stroke: "#7A6A55", "stroke-width": 1.2 }));
    if (t === 0) for (let i = 1; i < 10; i++) e.append(svgEl("line", { x1: x + w * i / 10, y1: y, x2: x + w * i / 10, y2: y + hh, stroke: "#C9935A", "stroke-width": .6 }), svgEl("line", { x1: x, y1: y + hh * i / 10, x2: x + w, y2: y + hh * i / 10, stroke: "#C9935A", "stroke-width": .6 }));
    if (t === 1) for (let i = 1; i < 10; i++) e.append(svgEl("line", { x1: x, y1: y + hh * i / 10, x2: x + w, y2: y + hh * i / 10, stroke: "#6E9BC4", "stroke-width": .6 }));
    return e;
  };
  /* 모형 늘어놓기: 너비 maxW 안에서 줄을 바꾸며, 놓은 높이를 돌려줘요 */
  const flow = (gg, t, n, x, y, maxW) => {
    if (!n) return 0;
    const s = SZ[t], per = Math.max(1, Math.floor((maxW + s.gx) / (s.w + s.gx)));
    for (let i = 0; i < n; i++) gg.append(piece(t, x + (i % per) * (s.w + s.gx), y + Math.floor(i / per) * (s.h + s.gy)));
    return Math.ceil(n / per) * (s.h + s.gy);
  };
  const desc = arr => arr.map((c, t) => `${DN3T[t]}이 ${c}개`).join(", ");
  const val = arr => dn3Str(arr.reduce((acc, c, t) => dn3Add(acc, dn3R(BigInt(c), dn3Pow(t))), dn3R(0n)));
  const draw = () => {
    g.innerHTML = ""; gh.innerHTML = ""; zones = []; boxes = [];
    // 나누어 줄 모형
    g.append(txt(x0 + 4, 14, `나누어 줄 수 모형 (${A})`, 17, { "text-anchor": "start", fill: DN3C.dark }));
    let zx = x0;
    for (let t = 0; t < T; t++) {
      const zwT = zw[t], y = 26;
      g.append(svgEl("rect", { x: zx, y, width: zwT, height: PH - 30, rx: 12, fill: pool[t] ? "#FFFDF6" : "#F4F6F5", stroke: DN3C.line, "stroke-width": 2 }));
      g.append(txt(zx + zwT / 2, y + 16, `${DN3T[t]} · ${pool[t]}개`, 17, { fill: pool[t] ? "#5A4A35" : DN3C.dark }));
      flow(g, t, pool[t], zx + 12, y + 32, zwT - 24);
      zones.push({ x: zx, y, w: zwT, h: PH - 30 });
      zx += zwT + 10;
    }
    // 묶음
    const bw = (W - 2 * x0 - (K - 1) * 12) / K;
    let maxH = 110;
    const tmp = [];
    for (let k = 0; k < K; k++) {
      const bx = x0 + k * (bw + 12), gg = svgEl("g");
      let yy = GY + 34;
      for (let t = 0; t < T; t++) { const hgt = flow(gg, t, grp[k][t], bx + 10, yy, bw - 20); yy += hgt; }
      maxH = Math.max(maxH, yy - GY + 30);
      tmp.push({ bx, gg });
    }
    tmp.forEach(({ bx, gg }, k) => {
      g.append(svgEl("rect", { x: bx, y: GY, width: bw, height: maxH, rx: 14, fill: "#F7FBFF", stroke: "#8DB7DE", "stroke-width": 2.5, "stroke-dasharray": "8 5" }));
      g.append(txt(bx + bw / 2, GY + 17, `${grpName} ${k + 1}`, 17, { fill: DN3C.blue }), gg);
      g.append(txt(bx + bw / 2, GY + maxH - 13, desc(grp[k]), K > 3 ? 12 : 14, { fill: DN3C.dark }));
      boxes.push({ x: bx, y: GY, w: bw, h: maxH });
    });
    const H = GY + maxH + 8;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    if (drag && drag.moved) gh.append(piece(drag.t, drag.x - SZ[drag.t].w / 2, drag.y - SZ[drag.t].h / 2));
    say.innerHTML = "";
    say.append("남은 것: " + desc(pool), " · ", h("b", {}, `${grpName}마다 똑같이`), " 나누어요.");
  };
  const snap = () => hist.push({ pool: pool.slice(), grp: grp.map(r => r.slice()) });
  const give = (t, k) => { if (!pool[t]) return; snap(); pool[t]--; grp[k][t]++; draw(); };
  const fewest = t => { let b = 0; grp.forEach((r, k) => { if (r[t] < grp[b][t]) b = k; }); return b; };
  const round = t => {
    if (pool[t] < K) { say.textContent = pool[t] ? `${DN3T[t]}이 ${pool[t]}개뿐이라 ${grpName} ${K}${cntW === "개" ? "개에" : cntW + "에게"} 하나씩 나누어 줄 수 없어요.` + (t < T - 1 ? ` ${DN3T[t + 1]} 10개로 바꾸어 봐요.` : "") : `남은 ${DN3T[t]}이 없어요.`; return; }
    snap(); for (let k = 0; k < K; k++) { pool[t]--; grp[k][t]++; } draw();
  };
  const exch = t => {
    if (!pool[t]) { say.textContent = `바꿀 ${DN3T[t]}이 없어요.`; return; }
    if (pool[t] >= K) { say.textContent = `아직 ${DN3T[t]}을 ${grpName}마다 하나씩 더 나누어 줄 수 있어요. 먼저 나누어 주고 남은 것을 바꿔요.`; return; }
    snap(); pool[t]--; pool[t + 1] += 10; draw();
    say.textContent = `${DN3T[t]} 하나를 ${DN3T[t + 1]} 10개로 바꾸었어요. 이제 ${DN3T[t + 1]}이 ${pool[t + 1]}개예요.`;
  };
  const inR = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
  dragOn(svg, pt => { const t = zones.findIndex(z => inR(pt, z)); if (t < 0 || !pool[t]) return false; drag = { t, sx: pt.x, sy: pt.y, x: pt.x, y: pt.y, moved: false }; return true; },
    pt => { if (!drag) return; drag.x = pt.x; drag.y = pt.y; if (Math.hypot(pt.x - drag.sx, pt.y - drag.sy) > 10) drag.moved = true; draw(); },
    pt => {
      const d = drag; drag = null; if (!d) return;
      const k = boxes.findIndex(b => inR(pt, b));
      if (k >= 0) give(d.t, k); else if (!d.moved) give(d.t, fewest(d.t)); else draw();
    });
  const tools = h("div", { class: "dn3tools" });
  for (let t = 0; t < T; t++) tools.append(h("button", { onclick: () => round(t) }, `${DN3T[t]}을 하나씩 나누어 주기`));
  for (let t = 0; t < T - 1; t++) tools.append(h("button", { onclick: () => exch(t) }, `${DN3T[t]} 하나 → ${DN3T[t + 1]} 10개로 바꾸기`));
  tools.append(h("button", { onclick: () => { const s = hist.pop(); if (s) { pool = s.pool; grp = s.grp; draw(); } } }, "한 번 되돌리기"), h("button", { onclick: () => { reset(); draw(); } }, "처음으로"));
  draw();
  const reg = dn3Reg();
  const asks = opt.asks ? h("div", { class: "dn3ask" }, dn3Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dn3say" }, opt.tip || `위의 수 모형을 끌어 ${grpName}에 놓거나 눌러서 ${grpName} ${K}${cntW === "개" ? "개에" : cntW + "에게"} 똑같이 나누어 주어요. 똑같이 나누어 줄 수 없으면 더 작은 모형 10개로 바꾸어요.`),
    h("div", { class: "dn3stage" }, svg), say, tools, asks);
  body.__dn3solve = () => {
    reset();
    for (let t = 0; t < T; t++) { while (pool[t] >= K) for (let k = 0; k < K; k++) { pool[t]--; grp[k][t]++; } if (t < T - 1) { pool[t + 1] += 10 * pool[t]; pool[t] = 0; } }
    draw();
  };
  api.provide({ words: opt.words || ["똑같이 나누어 주기", "10개로 바꾸기"], answers: [`${grpName}마다 ${desc(goal)} → ${qS}`].concat(reg.plain) });
  dn3Check(body, api, reg, opt, () => {
    const eq = grp.every(r => r.every((c, t) => c === grp[0][t])), giv = `${grpName}마다 ${grp.map(val).join("·")}`;
    if (pool.some(c => c)) {
      const t = pool.findIndex(c => c >= K);
      if (t >= 0) return { bad: `아직 ${DN3T[t]}을 ${grpName}마다 하나씩 더 나누어 줄 수 있어요. 남은 것이 없도록 끝까지 나누어 주어요.`, given: giv };
      const t2 = pool.findIndex(c => c > 0);
      return { bad: `남은 ${DN3T[t2]}이 ${pool[t2]}개 있어요. ${grpName} ${K}${cntW === "개" ? "개에" : cntW + "에게"} 하나씩 줄 수 없으니 ${DN3T[t2 + 1] || "더 작은 모형"} 10개로 바꾸어 나누어 주어요.`, given: giv };
    }
    if (!eq) return { bad: `${grpName}마다 받은 수 모형이 달라요. ${grpName}마다 ${T > 2 ? "1, 0.1, 0.01" : "1, 0.1"}의 수가 똑같아야 해요. ‘한 번 되돌리기’로 고쳐 봐요.`, given: giv };
    return { given: giv };
  });
}

/* ===== ③ 세로셈 나눗셈 (나누는 수는 자연수) =====
   pr: {a:"6.2", b:"2", cap?} — 나누어지는 수의 소수점(빨간 점), 끝에 붙인 0(흐린 0)을 보여 주고, 몫을 칸에 써요. */
function dn3LongBoard(pr) {
  const A = dn3Norm(pr.a), B = dn3Norm(pr.b);
  if (!/^\d+$/.test(B)) throw new Error("나누는 수는 자연수여야 해요: " + B);
  const [ai, af = ""] = A.split(".");
  const RA = dn3P(A), RB = dn3P(B), Q = dn3Div(RA, RB);
  const qStr = dn3Exact(Q); if (qStr == null) throw new Error("나누어떨어지지 않아요: " + A + "÷" + B);
  const qDec = dn3Dn(qStr);
  const totalDec = Math.max(af.length, qDec);
  const digits = (ai + af.padEnd(totalDec, "0")).split("");
  const nOrig = ai.length + af.length, pDot = ai.length - 1, C = digits.length;
  const dTd = (d, k) => {
    const e = h("td", { class: "dn3dc" }, h("span", { class: k >= nOrig ? "dn3g" : "" }, d));
    if (k === pDot && pDot < C - 1) e.append(h("span", { class: "dn3dot" }, "​"));
    return e;
  };
  const divTd = h("td", { class: "dn3dvs" }, h("span", {}, B), h("span", { class: "dn3paren" }, ")"));
  const mkRow = (cls, label) => {
    const ins = [], pts = [];
    const R = { ins, pts, p: -1 };
    R.tr = h("tr", { class: cls }, h("td", { class: "dn3lab" }, label || "​"), Array.from({ length: C }, (_, k) => {
      const i = h("input", { type: "text", inputmode: "numeric", maxlength: 1, "aria-label": label || "칸" });
      i.addEventListener("input", () => { i.value = i.value.replace(/[^0-9]/g, "").slice(-1); });
      ins.push(i);
      const b = k < C - 1 ? h("button", { class: "dn3pt", "aria-label": `${k + 1}번째 칸 뒤에 소수점 찍기`, onclick: () => { R.p = R.p === k ? -1 : k; pts.forEach((x, j) => x.classList.toggle("dn3pon", j === R.p)); } }, "​") : null;
      if (b) pts.push(b);
      return h("td", {}, i, b);
    }));
    return R;
  };
  const qRow = mkRow("dn3qr", "몫");
  const qn = qStr.replace(".", "").replace(/^0+(?=\d)/, "").length;
  const memoN = pr.memo != null ? pr.memo : Math.min(8, 2 * Math.max(1, qn));
  const memoRows = Array.from({ length: memoN }, () => h("tr", { class: "dn3memo" }, h("td", { class: "dn3lab" }, "​"), Array.from({ length: C }, () => h("td", {}, h("input", { type: "text", inputmode: "numeric", maxlength: 1, "aria-label": "계산 메모" })))));
  const tbl = h("table", { class: "dn3lt" }, qRow.tr, h("tr", { class: "dn3dd" }, divTd, digits.map(dTd)), ...memoRows);
  const notes = [];
  if (!af.length && totalDec) notes.push(`자연수 ${A} 뒤에 소수점이 있다고 생각해요(${A} = ${A}.${"0".repeat(totalDec)}).`);
  else if (totalDec > af.length) notes.push(`흐린 0은 소수점 아래 끝자리에 붙인 0이에요(${A} = ${A}${"0".repeat(totalDec - af.length)}).`);
  const cap = pr.cap || dn3Sp(A + "÷" + B);
  const el = h("div", { class: "dn3vbox" }, h("div", { class: "dn3vcap" }, cap), notes.length ? h("div", { class: "dn3memo-cap" }, notes.join(" ")) : null,
    h("div", { style: "overflow-x:auto;max-width:100%" }, tbl), h("div", { class: "dn3memo-cap" }, "빨간 점 = 나누어지는 수의 소수점 · 점선 칸은 계산 메모(채점하지 않아요)"));
  const read = R => {
    const v = R.ins.map(x => x.value);
    const first = v.findIndex(x => x !== "");
    if (first < 0) return { empty: true, v };
    const last = v.length - 1 - [...v].reverse().findIndex(x => x !== "");
    return { v, first, last, gap: v.slice(first, last + 1).some(x => x === "") };
  };
  const paint = (R, from, to, ok) => R.ins.forEach((x, k) => { x.style.borderColor = k >= from && k <= to ? (ok ? "var(--ok)" : "var(--no)") : ""; });
  const judge = () => {
    const r = read(qRow);
    if (r.empty) return { bad: `${cap}: 몫을 맨 위 칸에 써요.`, given: "-" };
    if (r.gap) { paint(qRow, r.first, r.last, false); return { bad: `${cap}: 몫의 숫자 사이에 빈칸이 있어요. 나눌 수 없는 자리에는 0을 써요.`, given: r.v.join("") }; }
    const p = qRow.p;
    if (p >= 0 && (p < r.first || p >= r.last)) { paint(qRow, r.first, r.last, false); return { bad: p < r.first ? `${cap}: 소수점 앞(일의 자리)에도 숫자가 있어야 해요. 나누어지는 수의 자연수 부분을 나눌 수 없으면 몫의 일의 자리에 0을 써요.` : `${cap}: 소수점은 숫자와 숫자 사이에 찍어요.`, given: r.v.join("") }; }
    if (r.v[r.first] === "0" && r.first < r.last && p !== r.first) {
      if (qDec && p >= 0 && p !== pDot) { paint(qRow, r.first, r.last, false); return { bad: `${cap}: 몫의 소수점은 나누어지는 수의 소수점(빨간 점) 바로 위에 찍어요. 몫의 숫자도 나누어지는 수의 자리에 맞추어 써요.`, given: r.v.join("") }; }
      paint(qRow, r.first, r.first, false); return { bad: `${cap}: 몫의 맨 앞에는 0을 쓰지 않아요(몫이 1보다 작을 때 일의 자리의 0만 써요).`, given: r.v.join("") }; }
    const s = p >= 0 ? r.v.slice(r.first, p + 1).join("") + "." + r.v.slice(p + 1, r.last + 1).join("") : r.v.slice(r.first, r.last + 1).join("");
    const got = dn3P(s);
    if (dn3Eq(got, Q)) {
      if (!qDec && r.last !== pDot) { paint(qRow, r.first, r.last, false); return { bad: `${cap}: 몫의 값은 맞지만 숫자를 쓴 자리가 어긋났어요. 몫의 각 자리 숫자를 나누어지는 수의 자리에 맞추어 써요(몫의 일의 자리는 나누어지는 수의 일의 자리 위에).`, given: s }; }
      if (qDec && p !== pDot) { paint(qRow, r.first, r.last, false); return { bad: `${cap}: 몫의 값은 맞지만 숫자를 쓴 자리가 어긋났어요. 몫의 소수점은 나누어지는 수의 소수점(빨간 점) 바로 위에 찍고, 몫의 숫자를 나누어지는 수의 자리에 맞추어 써요.`, given: s }; }
      paint(qRow, r.first, r.last, true); return { ok: true, given: s };
    }
    paint(qRow, r.first, r.last, false);
    const strip = x => x.replace(".", "").replace(/^0+/, "").replace(/0+$/, "");
    if (p < 0 && qDec && strip(s) === strip(qStr)) return { bad: `${cap}: 몫에도 소수점을 찍어야 해요. 몫의 소수점은 나누어지는 수의 소수점(빨간 점) 바로 위에 찍어요.`, given: s };
    const dg = dn3Diag(`${A}÷${B}`, got);
    if (dg) return { bad: `${cap}: ${dg}`, given: s };
    return { bad: `${cap}: 몫을 다시 구해 봐요. 높은 자리부터 차례로 나누고, 몫의 각 자리 숫자를 나누어지는 수의 자리에 맞추어 써요.`, given: s };
  };
  const ans = `${dn3Sp(A + "÷" + B)} = ${qStr}`;
  el.__solve = () => {
    const [ip, fp = ""] = qStr.split(".");
    qRow.ins.forEach(x => { x.value = ""; });
    [...ip].forEach((d, j) => { qRow.ins[pDot - ip.length + 1 + j].value = d; });
    [...fp].forEach((d, j) => { qRow.ins[pDot + 1 + j].value = d; });
    qRow.p = fp ? pDot : -1; qRow.pts.forEach((x, j) => x.classList.toggle("dn3pon", j === qRow.p));
  };
  /* 다 썼나요? 판 안(칸·소수점 단추)에 있는 동안은 몫의 숫자를 답만큼 쓰고 소수점이 필요하면 찍었을 때, 판을 떠나면 바로 */
  const cntOf = R => R.ins.filter(x => x.value !== "").length;
  const needQ = qStr.replace(".", "").length;
  const full = () => {
    if (!cntOf(qRow)) return false;
    const ae = document.activeElement, inHere = el.contains(ae) && (ae.tagName === "INPUT" || ae.tagName === "BUTTON");
    if (!inHere) return true;
    return !(cntOf(qRow) < needQ || (qDec > 0 && qRow.p < 0));
  };
  return { el, judge, ans, full };
}
function dn3Long(body, api, opt) {
  /* 다 하면 dn3Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dn3Style();
  if (opt.fig) body.append(opt.fig());
  if (opt.talk) body.append(dn3Talk(opt.talk));
  const reg = dn3Reg();
  const boards = opt.probs.map(dn3LongBoard);
  body.append(h("div", { class: "dn3say" }, opt.tip || "자연수의 나눗셈처럼 높은 자리부터 계산해요. 몫을 맨 위 칸에 쓰고, 숫자 오른쪽 아래 동그라미를 눌러 몫의 소수점을 찍어요."), h("div", { class: "dn3vts" }, boards.map(b => b.el)));
  if (opt.rows) body.append(h("div", { class: "dn3ask" }, dn3Rows(opt.rows, reg)));
  body.__dn3solve = () => boards.forEach(b => b.el.__solve());
  api.provide({ words: opt.words || ["몫의 소수점", "나누어지는 수의 소수점에 맞추어"], answers: boards.map(b => b.ans).concat(reg.plain) });
  dn3Check(body, api, reg, opt, () => {
    const rs = boards.map(b => b.judge()), bad = rs.find(r => r.bad);
    return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") };
  }, () => boards.every(b => b.full()));
}

/* ===== ④ 나무 막대를 똑같이 자르기 (m와 cm 두 눈금) =====
   opt: {m:"2.6", n:4, snap:5, item:"투호살", asks, ok} */
function dn3Tape(body, api, opt) {
  /* 다 하면 dn3Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dn3Style();
  const Lcm = Number(dn3Mul(dn3P(opt.m), dn3R(100n)).n), SN = opt.snap || 5, N = Lcm / SN, partCm = Lcm / opt.n, pu = partCm / SN;
  if (!Number.isInteger(N) || !Number.isInteger(pu)) throw new Error("막대 눈금 오류");
  const W = 760, x0 = 30, Lp = 700, my = 34, sy = 66, bh = 40, ry = 142, H = 200;
  const svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const cuts = new Set();
  const say = h("div", { class: "dn3say" }, "​");
  const xs = k => x0 + Lp * k / N;
  const draw = () => {
    g.innerHTML = "";
    // m 눈금
    g.append(svgEl("line", { x1: x0, y1: my + 12, x2: x0 + Lp, y2: my + 12, stroke: DN3C.dark, "stroke-width": 1.5 }));
    for (let c = 0; c <= Lcm; c += 50) { const x = x0 + Lp * c / Lcm; g.append(svgEl("line", { x1: x, y1: my + 6, x2: x, y2: my + 18, stroke: INK, "stroke-width": 2 }), txt(x, my - 6, dn3Str(dn3R(BigInt(c), 100n)), 15)); }
    g.append(txt(x0 + Lp, my - 24, opt.m, 15, { fill: DN3C.red }), txt(x0 + Lp + 18, my + 12, "m", 14, { fill: DN3C.dark }));
    // 막대
    g.append(svgEl("rect", { x: x0, y: sy, width: Lp, height: bh, rx: 6, fill: "#E8C48E", stroke: "#9A6B32", "stroke-width": 2.5 }));
    const list = [0, ...[...cuts].sort((a, b) => a - b), N];
    for (let i = 0; i + 1 < list.length; i++) {
      const a = xs(list[i]), b = xs(list[i + 1]), len = (list[i + 1] - list[i]) * SN;
      if (b - a > 46) g.append(txt((a + b) / 2, sy + bh / 2, `${len} cm`, 16, { fill: "#6B4518" }));
    }
    cuts.forEach(k => g.append(svgEl("line", { x1: xs(k), y1: sy - 10, x2: xs(k), y2: sy + bh + 10, stroke: DN3C.red, "stroke-width": 3, "stroke-dasharray": "6 4" })));
    // cm 자
    g.append(svgEl("rect", { x: x0, y: ry - 14, width: Lp, height: 40, fill: "#F3F7F5", stroke: DN3C.line }));
    for (let c = 0; c <= Lcm; c += 5) { const x = x0 + Lp * c / Lcm, big = c % 50 === 0, mid = c % 10 === 0; g.append(svgEl("line", { x1: x, y1: ry - 14, x2: x, y2: ry - 14 + (big ? 18 : mid ? 12 : 6), stroke: INK, "stroke-width": big ? 2 : 1 })); if (big) g.append(txt(x, ry + 16, String(c), 14)); }
    g.append(txt(x0 + Lp, ry + 34, String(Lcm), 14, { fill: DN3C.red }), txt(x0 + Lp + 20, ry - 2, "cm", 14, { fill: DN3C.dark }));
    say.innerHTML = ""; say.append("자르는 선 ", h("b", {}, String(cuts.size)), `개 → ${cuts.size + 1}도막`);
  };
  svg.addEventListener("pointerdown", e => {
    const pt = svgPt(svg, e); if (pt.y < sy - 20 || pt.y > sy + bh + 20) return;
    const k = Math.round((pt.x - x0) / Lp * N); if (k <= 0 || k >= N) return;
    cuts.has(k) ? cuts.delete(k) : cuts.add(k); draw();
  });
  const tools = h("div", { class: "dn3tools" }, h("button", { onclick: () => { cuts.clear(); draw(); } }, "자르는 선 모두 지우기"));
  draw();
  const reg = dn3Reg();
  const asks = opt.asks ? h("div", { class: "dn3ask" }, dn3Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dn3say" }, opt.tip || `나무 막대를 눌러 자르는 선을 놓아요(${SN} cm마다 붙어요). 선을 다시 누르면 지워져요. 막대를 똑같이 ${opt.n}도막으로 잘라 보세요.`), h("div", { class: "dn3stage" }, svg), say, tools, asks);
  body.__dn3solve = () => { cuts.clear(); for (let k = pu; k < N; k += pu) cuts.add(k); draw(); };
  api.provide({ words: opt.words || ["1 m = 100 cm", "0.01 m = 1 cm"], answers: [`${partCm} cm씩 ${opt.n}도막`].concat(reg.plain) });
  dn3Check(body, api, reg, opt, () => {
    const list = [0, ...[...cuts].sort((a, b) => a - b), N], eq = list.every((k, i) => i === 0 || k - list[i - 1] === pu);
    if (eq) return { given: `${partCm} cm씩 ${opt.n}도막` };
    if (cuts.size !== opt.n - 1) return { bad: `${opt.n}도막으로 자르려면 자르는 선이 ${opt.n - 1}개 있어야 해요.`, given: `${cuts.size + 1}도막` };
    return { bad: `도막의 길이가 모두 같아야 해요. 아래 cm 자를 보며 ${Lcm} cm를 똑같이 ${opt.n}도막으로 나누어요.`, given: `${cuts.size + 1}도막` };
  });
}

/* ===== ⑤ 몫의 소수점 찍기 (어림셈) =====
   opt: {items:[{e:"15.2÷5", est:{o:["0.3","3","30"], a:1}}], asks, ok} */
function dn3Point(body, api, opt) {
  /* 다 하면 dn3Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dn3Style();
  const reg = dn3Reg();
  const items = opt.items.map(it => {
    const Q = dn3E(it.e), qS = dn3Exact(Q); if (qS == null) throw new Error("나누어떨어지지 않아요 " + it.e);
    const cells = qS.replace(".", "").replace(/^0+(?=\d)/, "").split("");
    let p = -1; const pts = [];
    const strip = h("span", { class: "dn3strip" }, cells.map((d, k) => {
      const b = k < cells.length - 1 ? h("button", { class: "dn3pt", "aria-label": `${k + 1}번째 숫자 뒤에 소수점`, onclick: () => { p = p === k ? -1 : k; pts.forEach((x, j) => x.classList.toggle("dn3pon", j === p)); } }, "​") : null;
      if (b) pts.push(b);
      return h("span", { class: "dn3c" }, d, b);
    }));
    const valOf = () => dn3P(p < 0 ? cells.join("") : cells.slice(0, p + 1).join("") + "." + cells.slice(p + 1).join(""));
    const parts = [`${dn3Sp(it.e)}`];
    if (it.est) parts.push(it.est.lab ? `→ ${dn3J(dn3Sp(it.est.lab), "으로")} 어림셈하면 약` : "→ 어림셈하면 약", { o: it.est.o, a: it.est.a }, "→");
    parts.push("몫:", { el: () => strip });
    const row = dn3Parts(parts, reg);
    const judge = () => {
      const v = valOf(), giv = dn3Str(v);
      if (p < 0) return { bad: `${dn3Sp(it.e)}: 몫의 숫자 사이 동그라미를 눌러 소수점을 찍어요.`, given: giv };
      if (!dn3Eq(v, Q)) return { bad: `${dn3Sp(it.e)}: 지금 찍은 몫은 ${dn3J(giv, "이에요")}. ${it.est ? `어림셈한 결과인 약 ${dn3J(it.est.o[it.est.a], "과와")}` : "어림셈한 결과와"} 비슷한 크기가 되도록 소수점을 다시 찍어요.`, given: giv };
      return { given: giv };
    };
    if (/^0\./.test(qS)) throw new Error("몫이 1보다 작은 나눗셈은 소수점 찍기에 쓰지 않아요 " + it.e);
    row.__solve = () => { p = qS.indexOf(".") - 1; pts.forEach((x, j) => x.classList.toggle("dn3pon", j === p)); };
    return { row, judge, has: () => p >= 0, ans: `${dn3Sp(it.e)} = ${qS}` };
  });
  if (opt.fig) body.append(opt.fig());
  body.append(h("div", { class: "dn3say" }, opt.tip || "먼저 어림셈하여 몫이 약 얼마인지 고르고, 몫의 숫자 사이 동그라미를 눌러 소수점을 찍어요."), ...items.map(i => i.row));
  if (opt.asks) body.append(h("div", { class: "dn3ask" }, dn3Rows(opt.asks, reg)));
  body.__dn3solve = () => items.forEach(i => i.row.__solve());
  api.provide({ words: opt.words || ["어림셈", "몫의 소수점"], answers: items.map(i => i.ans).concat(reg.plain.slice(items.length)) });
  dn3Check(body, api, reg, opt, () => { const rs = items.map(i => i.judge()), bad = rs.find(r => r.bad); return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") }; }, () => items.every(i => i.has()));
}

/* ===== ⑥ 계산기 (채점하지 않는 도구) ===== */
function dn3CalcEl(cap) {
  dn3Style();
  let ex = "", shown = false;
  const disp = h("div", { class: "dn3disp", "aria-live": "polite" }, "0");
  const show = s => { disp.textContent = s || "0"; };
  const press = k => {
    if (k === "C") { ex = ""; shown = false; return show(""); }
    if (k === "⌫") { if (shown) { ex = ""; shown = false; } ex = ex.slice(0, -1); return show(ex); }
    if (k === "=") { const v = dn3E(ex); if (!v) return show("다시 눌러요"); ex = dn3Str(v, 6).replace("…", ""); shown = true; return show(dn3Str(v, 6)); }
    if (shown && /[0-9.]/.test(k)) ex = "";
    shown = false;
    if ("÷×+−".includes(k) && (!ex || "÷×+−".includes(ex.slice(-1)))) return;
    ex += k; show(ex);
  };
  const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+", "C", "⌫"];
  const box = h("div", { class: "dn3calc", "aria-label": "계산기" }, disp, keys.map(k => h("button", { class: "÷×−+=".includes(k) ? "dn3op" : "", onclick: () => press(k) }, k)));
  box.__press = press; box.__disp = disp;
  return h("div", {}, h("div", { class: "dn3vcap" }, cap || "🧮 계산기"), box);
}

/* ===== ⑦ 수 카드 두 장으로 몫이 가장 큰 (자연수)÷(자연수) ===== opt: {cards:["6","8","5","7"], asks, ok} */
function dn3Pick2(body, api, opt) {
  /* 다 하면 dn3Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dn3Style();
  const cards = opt.cards, slots = [null, null];
  const valOf = s => dn3Div(dn3P(cards[s[0]]), dn3P(cards[s[1]]));
  let best = null, bestP = null;
  cards.forEach((_, i) => cards.forEach((_, j) => { if (i === j) return; const v = valOf([i, j]); if (!best || dn3Lt(best, v)) { best = v; bestP = [i, j]; } }));
  const cardBox = h("div", { class: "dn3cards" }), slotBox = h("div", { class: "dn3slots" }), res = h("div", { class: "dn3say" }, "​");
  const draw = () => {
    cardBox.innerHTML = ""; slotBox.innerHTML = "";
    cards.forEach((c, i) => cardBox.append(h("button", { class: "opt", disabled: slots.includes(i), onclick: () => { const k = slots.indexOf(null); if (k >= 0) { slots[k] = i; draw(); } } }, c)));
    const sl = k => h("button", { class: "dn3slot", "aria-label": `${k + 1}번째 칸`, onclick: () => { slots[k] = null; draw(); } }, slots[k] == null ? "​" : cards[slots[k]]);
    slotBox.append(sl(0), "÷", sl(1));
    res.textContent = slots.includes(null) ? "수 카드를 누르면 빈칸에 차례로 들어가요. 칸을 누르면 카드가 돌아가요." : `${cards[slots[0]]} ÷ ${cards[slots[1]]} = ${dn3Str(valOf(slots))}`;
  };
  draw();
  const reg = dn3Reg();
  body.append(cardBox, slotBox, res);
  if (opt.asks) body.append(h("div", { class: "dn3ask" }, dn3Rows(opt.asks, reg)));
  body.__dn3solve = () => { slots[0] = bestP[0]; slots[1] = bestP[1]; draw(); };
  api.provide({ words: ["나누어지는 수는 크게", "나누는 수는 작게"], answers: [`${cards[bestP[0]]} ÷ ${cards[bestP[1]]} = ${dn3Str(best)}`].concat(reg.plain) });
  dn3Check(body, api, reg, opt, () => {
    if (slots.includes(null)) return { bad: "수 카드 두 장을 놓아 나눗셈을 만들어요.", given: "-" };
    const g = `${cards[slots[0]]}÷${cards[slots[1]]}`;
    if (!dn3Eq(valOf(slots), best)) return { bad: "몫이 더 큰 나눗셈을 만들 수 있어요. 나누어지는 수는 크게, 나누는 수는 작게 해요.", given: g };
    return { given: g };
  }, () => !slots.includes(null));
}

/* ===== ⑧ 콩주머니 던지기 땅따먹기 (10차시 놀이판) =====
   교과서 '발사! 나눗셈을 옳게 하면 내 땅!' 놀이를 이야기 버전 운동장 놀이로 바꾸었어요(이 앱이 만든 놀이판, 나눗셈은 새로 정함).
   콩주머니를 끌었다가 놓아 던지고, 도착한 땅의 나눗셈 몫을 쓰면 친구가 계산기로 확인해요. 놀이가 끝나면 api.done( 을 불러요. */
const DN3BOARD = [
  ["8.4÷4", "7.32÷6", "13.5÷5", "7÷4", "25.2÷12*", "PICK", "4.56÷8"],
  ["9.36÷3", "2.7÷6", "REST", "13÷4", "6.08÷2", "0.8÷5", "50.4÷14*"],
  ["5.25÷7", "18÷5", "GO", "GO", "14.7÷7", "REST", "1.5÷6"],
  ["6÷8", "21.6÷4", "GO", "GO", "91.26÷9*", "16.4÷5", "12.24÷6"],
  ["PICK", "64.8÷16*", "2.94÷3", "7.35÷5", "9.1÷13*", "4.4÷8", "23.1÷6"]];
const DN3CELLS = (() => {
  const L = [];
  DN3BOARD.forEach((row, r) => row.forEach((s, c) => {
    const calc = s.endsWith("*"), e = s.replace("*", "");
    const it = { r, c, kind: /^(GO|REST|PICK)$/.test(e) ? e : "div", e, calc };
    if (it.kind === "div") { const q = dn3E(e), a = dn3Exact(q); if (a == null) throw new Error("놀이판 칸 오류 " + e); it.ans = a; it.want = q; }
    L.push(it);
  }));
  return L;
})();
function dn3Clip(body, api, opt = {}) {
  /* 놀이가 끝나면 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dn3Style();
  const COLS = 7, ROWS = 5, cw = 104, ch = 72, gp = 4, x0 = 14, y0 = 14;
  const W = x0 * 2 + COLS * cw + (COLS - 1) * gp, H = y0 * 2 + ROWS * ch + (ROWS - 1) * gp;
  const svg = makeSvg(W, H), g = svgEl("g"), fx = svgEl("g"); svg.append(g, fx);
  const P = [{ n: "파랑", c: DN3C.blue, soft: "#BFD9F5" }, { n: "빨강", c: DN3C.red, soft: "#F6C3B8" }];
  const SHOTS = opt.shots || 8;
  const cx = c => x0 + c * (cw + gp), cy = r => y0 + r * (ch + gp);
  const GO = { x: cx(2), y: cy(2), w: 2 * cw + gp, h: 2 * ch + gp }, home = { x: GO.x + GO.w / 2, y: GO.y + GO.h / 2 + 24 };
  let owner, shots, rest, turn, phase, bag, aim, cur, finished, busy, noise = true, reported = false;
  const status = h("div", { class: "dn3score" }), say = h("div", { class: "dn3say" }, "​"), ask = h("div", { class: "dn3row" });
  const restart = () => { owner = DN3CELLS.map(() => -1); shots = [0, 0]; rest = [false, false]; turn = 0; phase = "aim"; bag = { ...home }; aim = null; cur = -1; finished = false; busy = false; ask.innerHTML = ""; draw(); paint(); say.textContent = `${P[0].n} 차례예요. 콩주머니에서 원하는 땅 쪽으로 끌었다가 놓아 던져요.`; };
  const cellAt = pt => DN3CELLS.findIndex(it => pt.x >= cx(it.c) && pt.x <= cx(it.c) + cw && pt.y >= cy(it.r) && pt.y <= cy(it.r) + ch);
  const draw = () => {
    g.innerHTML = ""; fx.innerHTML = "";
    g.append(svgEl("rect", { x: 2, y: 2, width: W - 4, height: H - 4, rx: 14, fill: "#CFE6B8", stroke: "#7FA65A", "stroke-width": 3 }));
    DN3CELLS.forEach((it, i) => {
      if (it.kind === "GO") return;
      const x = cx(it.c), y = cy(it.r), o = owner[i];
      const fill = o >= 0 ? P[o].soft : it.kind === "REST" ? "#BFE3A8" : it.kind === "PICK" ? "#F8C9D6" : "#FFFDF6";
      g.append(svgEl("rect", { x, y, width: cw, height: ch, rx: 10, fill, stroke: o >= 0 ? P[o].c : "#B9CFA3", "stroke-width": o >= 0 ? 3 : 1.5 }));
      if (it.kind === "REST") g.append(txt(x + cw / 2, y + ch / 2, "한 번 쉬기", 18, { fill: "#3D6B2A" }));
      else if (it.kind === "PICK") { g.append(txt(x + cw / 2, y + ch / 2 - 11, "원하는 땅", 15, { fill: "#A0365A" }), txt(x + cw / 2, y + ch / 2 + 11, "한 칸 색칠하기", 15, { fill: "#A0365A" })); }
      else {
        g.append(txt(x + cw / 2, y + ch / 2 + (it.calc ? 8 : 0), it.e, it.e.length > 7 ? 17 : 19, { fill: "#3A4A22" }));
        if (it.calc) { g.append(svgEl("rect", { x: x + 8, y: y + 7, width: 14, height: 18, rx: 2, fill: "#7A8C86" }), svgEl("rect", { x: x + 10, y: y + 9, width: 10, height: 4, fill: "#E3F1E6" }), txt(x + 50, y + 16, "계산기", 12, { fill: DN3C.dark })); }
      }
    });
    g.append(svgEl("rect", { x: GO.x, y: GO.y, width: GO.w, height: GO.h, rx: 14, fill: "#F7E3A1", stroke: "#C99A57", "stroke-width": 2.5 }), txt(GO.x + GO.w / 2, GO.y + 36, "던지는 곳", 26, { fill: "#8A5A1E" }));
    if (aim) {
      const dx = aim.x - bag.x, dy = aim.y - bag.y;
      fx.append(svgEl("line", { x1: bag.x, y1: bag.y, x2: aim.x, y2: aim.y, stroke: P[turn].c, "stroke-width": 3, "stroke-dasharray": "8 6" }), svgEl("circle", { cx: aim.x, cy: aim.y, r: 10 + Math.hypot(dx, dy) * 0.08, fill: "none", stroke: P[turn].c, "stroke-width": 2 }));
    }
    const bg = svgEl("g", { transform: `translate(${bag.x},${bag.y})` });
    bg.append(svgEl("rect", { x: -14, y: -11, width: 28, height: 22, rx: 8, fill: "#E8913A", stroke: "#8A4A12", "stroke-width": 2 }), svgEl("path", { d: "M-8 -11 q8 -8 16 0", fill: "none", stroke: "#8A4A12", "stroke-width": 2 }));
    fx.append(bg);
  };
  const count = k => owner.filter(o => o === k).length;
  const paint = () => {
    status.innerHTML = "";
    P.forEach((p, k) => status.append(h("span", { class: !finished && turn === k ? "dn3turn" : "", style: `border-color:${p.c}` }, `${p.n}: 땅 ${count(k)}칸 · 던지기 ${shots[k]}/${SHOTS}${rest[k] ? " · 이번에 한 번 쉬기" : ""}`)));
  };
  const left = () => DN3CELLS.some((it, i) => it.kind === "div" && owner[i] < 0);
  const endCheck = () => {
    if (!left() || (shots[0] >= SHOTS && shots[1] >= SHOTS)) {
      finished = true; phase = "end"; paint();
      const a = count(0), b = count(1);
      say.textContent = `놀이 끝! 파랑 ${a}칸, 빨강 ${b}칸 → ${a === b ? "비겼어요" : (a > b ? "파랑" : "빨강") + "이 이겼어요"}! 친구에게 수고했다고 말해 줘요.`;
      if (!reported) { reported = true; api.tryOnce(); api.done(`파랑 ${a}칸, 빨강 ${b}칸`, opt.ok); }
      return true;
    }
    return false;
  };
  const nextTurn = () => {
    busy = true;
    setTimeout(() => {
      busy = false; ask.innerHTML = ""; bag = { ...home }; aim = null;
      if (endCheck()) { draw(); return; }
      let t = 1 - turn;
      if (shots[t] >= SHOTS) t = turn;
      if (rest[t] && shots[1 - t] < SHOTS) { rest[t] = false; turn = t; draw(); paint(); say.textContent = `${P[t].n}은 이번에 한 번 쉬어요.`; nextTurn(); return; }
      rest[t] = false; turn = t; phase = "aim"; draw(); paint();
      say.textContent = `${P[t].n} 차례예요. 콩주머니를 끌었다가 놓아 원하는 땅으로 던져요.`;
    }, opt.fast ? 10 : 1200);
  };
  const land = () => {
    const i = cellAt(bag);
    const it = i >= 0 ? DN3CELLS[i] : null;
    if (!it || it.kind === "GO" || owner[i] >= 0) {
      phase = "aim"; const where = !it ? "놀이판 밖으로 나갔어요" : it.kind === "GO" ? "던지는 곳에 떨어졌어요" : "이미 색칠된 땅에 떨어졌어요";
      say.textContent = `${where}. 콩주머니를 던지는 곳에 놓고 다시 한번 던져요.`; setTimeout(() => { bag = { ...home }; draw(); }, opt.fast ? 0 : 700); return;
    }
    shots[turn]++; paint();
    if (it.kind === "REST") { rest[turn] = true; phase = "wait"; say.textContent = `‘한 번 쉬기’ 땅이에요. ${P[turn].n}은 다음 차례에 한 번 쉬어요.`; nextTurn(); return; }
    if (it.kind === "PICK") { phase = "pick"; say.textContent = `‘원하는 땅 한 칸 색칠하기’예요! 색칠하고 싶은 빈 나눗셈 땅을 눌러요.`; return; }
    phase = "calc"; cur = i;
    const inp = h("input", { type: "text", inputmode: "decimal", class: "dn3in", "aria-label": "몫" });
    const go = () => {
      if (phase !== "calc") return;
      const v = dn3P(inp.value); if (v == null) { say.textContent = "몫을 수로 써요."; return; }
      phase = "wait";
      if (dn3Eq(v, it.want)) { owner[i] = turn; say.textContent = `친구가 계산기로 확인했더니 ${dn3Sp(it.e)} = ${it.ans} 맞아요! 땅을 ${P[turn].n}으로 색칠해요.`; }
      else say.textContent = `친구가 계산기로 확인했더니 ${dn3Sp(it.e)} = ${dn3J(it.ans, "이에요")}. ${dn3J(inp.value.trim(), "은는")} 틀려서 색칠하지 않아요. 어디가 틀렸는지 친구와 이야기해 봐요.`;
      draw(); paint(); nextTurn();
    };
    inp.addEventListener("keydown", ev => { if (ev.key === "Enter") go(); });
    ask.innerHTML = ""; ask.append(h("span", {}, `${P[turn].n}: ${dn3Sp(it.e)} =`), inp, h("button", { class: "opt", onclick: go }, "몫 말하기"), it.calc ? h("span", { class: "dn3note" }, "(계산기 칸 — 아래 계산기를 써도 돼요)") : null);
    say.textContent = `${dn3Sp(it.e)} 땅에 도착했어요. 몫을 써요. 친구가 계산기로 확인해요.`;
    setTimeout(() => inp.focus && inp.focus(), 30);
  };
  const fly = (to, cb) => {
    const from = { ...bag }; let k = 0, N = opt.fast ? 1 : 14; busy = true;
    const stepF = () => { k++; const t = k / N, e = 1 - (1 - t) * (1 - t); bag = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e }; draw(); if (k < N) setTimeout(stepF, 22); else { busy = false; cb(); } };
    stepF();
  };
  const launch = (tx, ty, exact) => {
    if (phase !== "aim" || busy || finished) return;
    const d = Math.hypot(tx - bag.x, ty - bag.y);
    if (d < 20) { say.textContent = "조금 더 멀리 끌어서 놓아요."; return; }
    let x = tx, y = ty;
    if (noise && !exact) { const s = 8 + d * 0.13, a = Math.random() * Math.PI * 2, r = s * Math.sqrt(-2 * Math.log(1 - Math.random() * .97)) * .6; x += Math.cos(a) * r; y += Math.sin(a) * r; }
    aim = null; phase = "fly"; fly({ x, y }, land);
  };
  const pick = i => {
    if (phase !== "pick") return;
    const it = DN3CELLS[i];
    if (!it || it.kind !== "div" || owner[i] >= 0) { say.textContent = "색칠하지 않은 나눗셈 땅을 골라요."; return; }
    owner[i] = turn; phase = "wait"; draw(); paint(); say.textContent = `${dn3Sp(it.e)} 땅을 ${P[turn].n}으로 색칠했어요.`; nextTurn();
  };
  dragOn(svg, pt => {
    if (phase === "pick") { pick(cellAt(pt)); return false; }
    if (phase !== "aim" || busy || finished) return false;
    if (Math.hypot(pt.x - bag.x, pt.y - bag.y) > 46) { say.textContent = "콩주머니를 눌러 끌어요(던지는 곳의 콩주머니에서 시작해요)."; return false; }
    aim = { x: pt.x, y: pt.y }; draw(); return true;
  }, pt => { aim = { x: pt.x, y: pt.y }; draw(); }, pt => { launch(pt.x, pt.y); });
  restart();
  const calc = dn3CalcEl("🧮 친구가 확인할 때 쓰는 계산기");
  body.__dn3clip = { phase: () => phase, launch, pick, cells: DN3CELLS, owner: () => owner.slice(), home, setNoise: v => { noise = v; }, cx, cy, cw, ch, input: () => ask.querySelector("input"), go: () => ask.querySelector("button") };
  body.append(h("div", { class: "dn3note" }, "※ 이 앱이 만든 놀이판이에요. 한 사람이 " + SHOTS + "번씩 던지거나 나눗셈 땅이 모두 색칠되면 놀이가 끝나고 계단을 올라가요."),
    status, h("div", { class: "dn3stage" }, svg), say, ask, h("div", { class: "dn3tools" }, h("button", { onclick: restart }, "처음부터 다시")), calc);
  api.provide({ words: ["몫의 소수점", "0을 내려 계산"], answers: [] });
}

/* ===== ⑨ 나눗셈 카드 놀이 (또 다른 놀이 방법) =====
   카드 12장. 로봇 친구와 번갈아 카드를 뒤집어요. 로봇이 뒤집으면 내가 계산하고, 내가 뒤집으면 로봇이 계산한 답을 내가 계산기로 확인해요. 5장을 먼저 모으면 이겨요.
   놀이가 끝나면 api.done( 을 불러요. */
const DN3DECK = ["9.6÷4", "15÷6", "5.15÷5", "0.72÷9", "8.7÷5", "27.3÷7", "6÷15", "10.2÷4", "3.06÷3", "45÷4", "1.38÷6", "22.5÷9"].map(e => { const q = dn3E(e), a = dn3Exact(q); if (a == null) throw new Error("카드 오류 " + e); return { e, q, a }; });
function dn3CardGame(body, api, opt = {}) {
  /* 놀이가 끝나면 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dn3Style();
  let deck, mine, bot, phase, card, botSaid, botOk, finished, busy, flipper, reported = false;
  const status = h("div", { class: "dn3score" }), say = h("div", { class: "dn3say" }, "​"), area = h("div", { class: "dn3row" }), cardEl = h("span", { class: "dn3card dn3back" }, "?");
  const pileMe = h("div", { class: "dn3pile" }), pileBot = h("div", { class: "dn3pile" });
  const wrongOf = c => {   // 로봇이 가끔 하는 실수
    const s = c.a, alt = [dn3Str(dn3Mul(c.q, dn3R(10n))), dn3Str(dn3Div(c.q, dn3R(10n)))];
    if (/\.0/.test(s)) alt.push(s.replace(/\.0+/, "."));
    return alt[Math.floor(Math.random() * alt.length)];
  };
  const paint = () => {
    status.innerHTML = "";
    status.append(h("span", { class: !finished && flipper === 0 ? "dn3turn" : "" }, `나: ${mine.length}장`), h("span", { class: !finished && flipper === 1 ? "dn3turn" : "" }, `로봇 친구: ${bot.length}장`), h("span", {}, `남은 카드 ${deck.length}장`));
    pileMe.innerHTML = ""; mine.forEach(c => pileMe.append(h("span", {}, `${dn3Sp(c.e)} = ${c.a}`)));
    pileBot.innerHTML = ""; bot.forEach(c => pileBot.append(h("span", {}, `${dn3Sp(c.e)} = ${c.a}`)));
  };
  const endCheck = () => {
    if (mine.length >= 5 || bot.length >= 5 || !deck.length) {
      finished = true; phase = "end"; paint();
      say.textContent = mine.length === bot.length ? `카드가 다 떨어졌어요. ${mine.length}장씩 비겼어요!` : `${mine.length > bot.length ? "내가" : "로봇 친구가"} 이겼어요! (나 ${mine.length}장, 로봇 친구 ${bot.length}장)`;
      area.innerHTML = "";
      if (!reported) { reported = true; api.tryOnce(); api.done(`나 ${mine.length}장, 로봇 친구 ${bot.length}장`, opt.ok); }
      return true;
    }
    return false;
  };
  const after = () => { busy = true; setTimeout(() => { busy = false; if (endCheck()) return; flipper = 1 - flipper; ready(); }, opt.fast ? 10 : 1300); };
  const ready = () => {
    phase = "flip"; area.innerHTML = ""; cardEl.className = "dn3card dn3back"; cardEl.textContent = "?"; paint();
    if (flipper === 0) { say.textContent = "내 차례예요. 맨 위 카드를 뒤집어요. 로봇 친구가 계산하면 계산기로 확인해요."; area.append(h("button", { class: "opt", onclick: flip }, "카드 뒤집기")); }
    else { say.textContent = "로봇 친구가 카드를 뒤집을 거예요."; busy = true; setTimeout(() => { busy = false; flip(); }, opt.fast ? 10 : 900); }
  };
  const flip = () => {
    if (phase !== "flip" || finished) return;
    card = deck.shift(); cardEl.className = "dn3card"; cardEl.textContent = dn3Sp(card.e); paint();
    area.innerHTML = "";
    if (flipper === 1) {
      phase = "calc";
      const inp = h("input", { type: "text", inputmode: "decimal", class: "dn3in", "aria-label": "몫" });
      const go = () => {
        if (phase !== "calc") return;
        const v = dn3P(inp.value); if (v == null) { say.textContent = "몫을 수로 써요."; return; }
        phase = "wait";
        if (dn3Eq(v, card.q)) { mine.push(card); say.textContent = `로봇 친구가 계산기로 확인했더니 ${dn3Sp(card.e)} = ${card.a} 맞아요! 카드를 내가 가져가요.`; }
        else say.textContent = `로봇 친구가 계산기로 확인했더니 ${dn3Sp(card.e)} = ${dn3J(card.a, "이에요")}. 이 카드는 아무도 가져가지 못해요.`;
        area.innerHTML = ""; paint(); after();
      };
      inp.addEventListener("keydown", ev => { if (ev.key === "Enter") go(); });
      area.append(h("span", {}, `${dn3Sp(card.e)} =`), inp, h("button", { class: "opt", onclick: go }, "몫 말하기"));
      say.textContent = "로봇 친구가 뒤집은 카드예요. 내가 계산해요.";
    } else {
      phase = "judge"; botOk = opt.botOk != null ? opt.botOk : Math.random() < .7; botSaid = botOk ? card.a : wrongOf(card);
      const j = mineSaysOk => {
        if (phase !== "judge") return;
        phase = "wait"; area.innerHTML = "";
        if (mineSaysOk === botOk) {
          if (botOk) { bot.push(card); say.textContent = `맞게 확인했어요! ${dn3Sp(card.e)} = ${card.a}. 로봇 친구가 카드를 가져가요.`; }
          else say.textContent = `맞게 확인했어요! 로봇 친구의 답 ${dn3J(botSaid, "은는")} 틀렸어요. ${dn3Sp(card.e)} = ${dn3J(card.a, "이에요")}. 이 카드는 아무도 가져가지 못해요.`;
        } else {
          if (botOk) bot.push(card);
          say.textContent = `다시 확인해 봐요. 계산기로 계산하면 ${dn3Sp(card.e)} = ${dn3J(card.a, "이에요")}. 로봇 친구의 답 ${dn3J(botSaid, "은는")} ${botOk ? "맞았어요. 로봇 친구가 카드를 가져가요." : "틀렸어요. 이 카드는 아무도 가져가지 못해요."}`;
        }
        paint(); after();
      };
      area.append(h("span", {}, `로봇 친구: “${dn3Sp(card.e)} = ${botSaid}”`), h("button", { class: "opt", onclick: () => j(true) }, "맞아요"), h("button", { class: "opt", onclick: () => j(false) }, "틀렸어요"));
      say.textContent = "로봇 친구가 계산했어요. 오른쪽 계산기로 확인하고 맞았는지 골라요.";
    }
  };
  const restart = () => {
    deck = DN3DECK.slice(); for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    mine = []; bot = []; finished = false; busy = false; flipper = 1; ready();
  };
  restart();
  body.__dn3cards = { phase: () => phase, card: () => card, botOk: () => botOk, area, flip };
  body.append(status, h("div", { class: "dn3cwrap" }, h("div", { class: "dn3cmain" }, cardEl, say, area,
    h("div", { class: "dn3vcap" }, "내가 모은 카드"), pileMe, h("div", { class: "dn3vcap" }, "로봇 친구가 모은 카드"), pileBot,
    h("div", { class: "dn3tools" }, h("button", { onclick: restart }, "한 판 더"))), dn3CalcEl()));
  api.provide({ words: ["계산기로 확인"], answers: [] });
}

/* ===== ⑩ 기록실의 수로 (소수)÷(자연수) 문제 만들기 (11차시) =====
   나누어지는 수와 나누는 수를 하나씩 고르면 문제가 만들어지고, 답을 쓰면 저절로 확인해요(맞으면 api.done( ). */
const DN3MK = [
  { v: "4.56", u: "L", n: "스포츠 음료", lab: "스포츠 음료 4.56 L", dec: true },
  { v: "7.2", u: "m", n: "응원 끈", lab: "응원 끈 7.2 m", dec: true },
  { v: "6", n: "선수 6명", lab: "선수 6명", dec: false },
  { v: "8", n: "물통 8개", lab: "물통 8개", dec: false }];
function dn3MakeText(a, b) {
  if (a.n === "스포츠 음료") return b.v === "6" ? "스포츠 음료 4.56 L를 선수 6명이 똑같이 나누어 마시려고 해요. 한 명이 마실 수 있는 음료는 몇 L일까요?" : "스포츠 음료 4.56 L를 물통 8개에 똑같이 나누어 담으려고 해요. 물통 한 개에 담을 수 있는 음료는 몇 L일까요?";
  return b.v === "6" ? "길이가 7.2 m인 응원 끈을 선수 6명이 똑같이 나누어 가지려고 해요. 한 명이 가질 수 있는 끈은 몇 m일까요?" : "길이가 7.2 m인 응원 끈을 똑같이 8도막으로 잘라 물통 8개에 하나씩 묶으려고 해요. 끈 한 도막의 길이는 몇 m일까요?";
}
function dn3Make(body, api, opt = {}) {
  /* 맞게 풀면 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dn3Style();
  const all = DN3MK;
  let A = -1, B = -1;
  const chA = h("div", { class: "dn3chips" }), chB = h("div", { class: "dn3chips" }), prob = h("div", { class: "dn3talk" }), row = h("div", { class: "dn3row" });
  const inp = h("input", { type: "text", inputmode: "decimal", class: "dn3in", "aria-label": "답" });
  const unitEl = h("span", {}, "");
  const valid = () => A >= 0 && B >= 0 && all[A].dec && !all[B].dec;
  const draw = () => {
    chA.innerHTML = ""; chB.innerHTML = "";
    all.forEach((x, i) => {
      chA.append(h("button", { class: "opt" + (A === i ? " dn3on" : ""), onclick: () => { A = i; draw(); } }, x.lab));
      chB.append(h("button", { class: "opt" + (B === i ? " dn3on" : ""), onclick: () => { B = i; draw(); } }, x.lab));
    });
    prob.innerHTML = ""; row.innerHTML = "";
    if (valid()) {
      prob.append(h("p", {}, h("b", {}, "만든 문제 "), dn3MakeText(all[A], all[B])));
      unitEl.textContent = all[A].u;
      row.append(h("span", {}, `${all[A].v} ÷ ${all[B].v} =`), inp, unitEl);
    } else prob.append(h("p", {}, A >= 0 && B >= 0 ? "(소수)÷(자연수)가 되도록 나누어지는 수는 소수(음료의 양이나 끈의 길이), 나누는 수는 자연수(선수 수나 물통 수)를 골라요." : "나누어지는 수와 나누는 수를 하나씩 골라요."));
  };
  draw();
  body.append(h("div", { class: "dn3vcap" }, "나누어지는 수"), chA, h("div", { class: "dn3vcap" }, "나누는 수"), chB, prob, row);
  body.__dn3solve = () => { A = 0; B = 2; draw(); inp.value = dn3V("4.56÷6"); };
  api.provide({ words: ["(소수)÷(자연수)"], answers: ["4.56 ÷ 6 = 0.76 (L)", "4.56 ÷ 8 = 0.57 (L)", "7.2 ÷ 6 = 1.2 (m)", "7.2 ÷ 8 = 0.9 (m)"] });
  const qOf = () => dn3E(`${all[A].v}÷${all[B].v}`);
  const ready = () => {
    if (!valid()) return false;
    const v = inp.value.trim(); if (!v || /[.．。·]$/.test(v)) return false;
    return document.activeElement !== inp || dn3sDg(v) >= dn3sDg(dn3Str(qOf()));
  };
  dn3sAuto(body, ready, () => `${A}/${B}/${inp.value.trim()}`, () => {
    const a = all[A], b = all[B], q = qOf(), v = dn3P(inp.value), giv = `${a.v}÷${b.v}=${inp.value.trim() || "-"}`;
    if (v == null) { api.fail("만든 문제의 답을 수로 써요.", giv); return false; }
    if (!dn3Eq(v, q)) { api.fail(dn3Diag(`${a.v}÷${b.v}`, v) || `${a.v} ÷ ${dn3J(b.v, "을를")} 다시 계산해 봐요.`, giv); return false; }
    api.tryOnce(); api.done(giv, opt.ok || `${dn3MakeText(a, b)} → ${a.v} ÷ ${b.v} = ${dn3Str(q)}, 답 ${dn3Str(q)} ${a.u}. 문제를 잘 만들고 해결했어요!`); return true;
  });
}

/* ===== 그림·쪽지 ===== */
/* 이야기 쪽지(기록실 게시판·기록장) */
function dn3sNote(title, lines) { dn3Style(); return h("div", { class: "dn3snote" }, h("div", { class: "dn3gt" }, title), h("ul", {}, lines.map(t => h("li", {}, t)))); }
(function () { const st = document.createElement("style"); st.textContent = ".dn3snote{border:2px solid #E7C98A;background:#FFFBEF;border-radius:.8em;padding:.4em .9em;margin:.4em 0}.dn3snote ul{margin:.3em 0 .1em 1.1em;padding:0}.dn3snote li{margin:.18em 0;word-break:keep-all}"; document.head.append(st); })();
/* 기록 표 */
function dn3Record(title, head, rows) {
  return h("div", {}, h("div", { class: "dn3vcap" }, title), h("div", { style: "overflow-x:auto;max-width:100%" }, h("table", { class: "dn3tbl" },
    h("tr", {}, head.map(t => h("th", {}, t))),
    rows.map(r => h("tr", {}, r.map(c => h("td", {}, c)))))));
}
function dn3WithCalc(fig) { return () => h("div", { class: "dn3cwrap" }, h("div", { class: "dn3cmain" }, fig ? fig() : null), dn3CalcEl()); }
/* 세로셈 계단을 render에 바로 쓰는 짧은 꼴 */
const dn3LongStep = opt => (b, a) => dn3Long(b, a, opt);
//@@LESSONS
const UNIT_STORY = { title: "새봄 스포츠 클럽 기록실", lines: [
  "새봄초등학교 6학년은 올해 스포츠 클럽 기록실을 맡았어요. 기록 담당 윤서와 민재, 하람, 지후, 채원, 태오는 체육 선생님과 함께 클럽 준비물을 똑같이 나누고 훈련 기록을 정리해요.",
  "스포츠 음료를 물통에 나누어 담고, 줄넘기 줄과 결승선 테이프를 자르고, 트랙 선 페인트와 메디신볼 무게를 나누고, 코트 선을 나누어 칠하며 (소수)÷(자연수)를 계산하고 (자연수)÷(자연수)의 몫을 소수로 나타내요.",
  "기록장에 소수점을 잘못 찍지 않도록 어림셈으로 확인하고, 1분 기록 분석 보고서를 쓰고, 운동장 땅따먹기 놀이와 기록실 발표회로 배운 것을 정리해요."],
  one: "새봄 스포츠 클럽 기록실 · 음료·줄넘기 줄·페인트·테이프·공·코트 선을 자연수로 똑같이 나누며 (소수)÷(자연수)를 계산하고, 어림셈으로 몫의 소수점 위치를 확인해요." };
const UNIT_KEYWORDS = ["소수의 나눗셈", "(소수)÷(자연수)", "(자연수)÷(자연수)", "몫의 소수점", "나누어지는 수의 소수점에 맞추어", "세로셈", "분수의 나눗셈", "자연수의 나눗셈", "[1/10]배", "[1/100]배", "0을 내려 계산", "몫에 0을 써요", "어림셈", "단위소수의 개수"];
const DN3S_PLAN = ["🥤 축구 클럽: 스포츠 음료 6.9 L를 물통 3개에 똑같이 나누어 담기", "🪢 줄넘기 클럽: 긴 줄 7.32 m를 잘라 똑같은 길이의 줄 3개 만들기", "🎨 육상 클럽: 트랙 선 페인트 2.85 L를 레인 3개의 선에 똑같이 나누어 쓰기", "🏁 결승선 테이프 3.4 m를 똑같이 잘라 다섯 레인에 하나씩 걸기", "🏋️ 체력 클럽: 똑같은 메디신볼 4개의 무게가 모두 4.24 kg", "📏 피구장 선 9 m를 두 명이 똑같이 나누어 칠하기", "📒 마라톤 클럽: 일주일 동안 달린 거리 23.45 km"];
const DN3S_TYPES = ["(소수)÷(자연수)", "(자연수)÷(자연수)"];

const LESSONS = [
{
  id: "s1", no: 1, title: "스포츠 클럽 기록실을 열어요", soop: "개념 찾기(S)",
  question: "스포츠 클럽을 준비할 때 소수의 나눗셈이 필요한 때는 언제일까요?",
  summary: "기록실 게시판에는 음료 6.9 L를 물통 3개에, 줄 7.32 m를 3개로, 테이프 3.4 m를 5개로 똑같이 나누는 일처럼 소수를 자연수로 나누는 상황이 많아요. 피구장 선 9 m를 두 명이 나누어 칠하면 (자연수)÷(자연수)의 몫이 소수가 되기도 해요. 이 단원에서는 (소수)÷(자연수)를 계산하고, (자연수)÷(자연수)의 몫을 소수로 나타내고, 어림셈으로 몫의 소수점 위치를 확인해요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "우리 학년이 스포츠 클럽 기록실을 맡았어요! 기록 담당 윤서가 붙여 둔 게시판 쪽지를 보고, 세 칸에 써서 붙여요.", hints: ["쪽지에서 소수가 쓰인 곳을 찾아봐요.", "‘똑같이 나누어’라는 말이 있는 곳을 떠올려요."],
      render: (b, a) => { b.append(dn3sNote("📋 새봄 스포츠 클럽 기록실 게시판", DN3S_PLAN));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "게시판에 ~이 보여요", hint: "게시판에서 보이는 것", ex: ["6.9 L, 7.32 m, 2.85 L처럼 소수가 많이 보여요.", "음료나 줄을 몇 개로 똑같이 나누는 일이 보여요."] },
          { t: "생각해요", e: "💭", ph: "~할 때 소수를 자연수로 나누어야 할 것 같아요", hint: "소수의 나눗셈이 필요한 일", ex: ["물통 한 개에 담을 음료의 양은 6.9 L를 3으로 나누어 구할 것 같아요.", "피구장 선 9 m를 두 명이 나누면 한 명이 4 m보다 조금 더 칠할 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 계산할까?", hint: "소수의 나눗셈에 대해 궁금한 것", ex: ["6.9÷3처럼 소수를 자연수로 나누면 몫의 소수점은 어디에 찍을까?", "2.85 L를 3으로 나누면 1보다 작은데 어떻게 계산할까?"] }],
          { ok: "기록실 게시판에는 소수의 나눗셈이 가득해요! 이 단원에서 하나씩 계산하는 방법을 알아봐요." }); } },
    { name: "그려 보기 — 게시판의 일을 나눗셈식으로", inst: "게시판의 일을 나눗셈식으로 나타내고, 어떤 꼴의 나눗셈인지 골라 보세요.", hints: ["똑같이 나눌 때는 전체의 양을 나누는 수로 나누어요.", "6.9는 소수, 3은 자연수예요.", "9와 2는 둘 다 자연수예요."],
      render: thenWhy((b, a) => dn3Sent(b, a, [
        ["물통 한 개에 담을 음료의 양:", { o: ["6.9÷3", "6.9×3", "3÷6.9"], a: 0, why: { "1": "똑같이 나누는 상황이에요. 곱하면 물통 3개를 더한 것보다 더 많아져요.", "2": "나누어지는 수는 전체 음료의 양 6.9 L예요." } }, "→", { o: DN3S_TYPES, a: 0 }],
        ["메디신볼 한 개의 무게:", { o: ["4.24÷4", "4÷4.24", "4.24−4"], a: 0, why: { "1": "전체 무게 4.24 kg을 공의 수 4로 나누어요.", "2": "한 개의 무게는 빼서가 아니라 똑같이 나누어 구해요." } }, "→", { o: DN3S_TYPES, a: 0 }],
        ["피구장 선을 한 명이 칠하는 길이:", { o: ["9÷2", "9×2", "2÷9"], a: 0 }, "→", { o: DN3S_TYPES, a: 1 }]],
        { ok: "6.9÷3, 4.24÷4는 (소수)÷(자연수), 9÷2는 (자연수)÷(자연수)예요. 이 단원에서 두 가지를 모두 배워요." }),
        { q: "물통 한 개에 담을 음료의 양을 왜 6.9÷3으로 나타낼 수 있을까요?", ph: "6.9 L를 물통 3개에 ~", help: ["① 전체 음료의 양과 물통의 수를 찾아요. → ② 똑같이 나누어 한 개의 양을 구하는 셈을 떠올려요.", "‘전체 ~ L를 물통 ~개에 똑같이 나누는 것이라서 ~으로 나타내요.’ 꼴로 써요."],
          ans: "전체 음료 6.9 L를 물통 3개에 똑같이 나누어 한 개에 담을 양을 구하는 것이라서 나눗셈 6.9÷3으로 나타낼 수 있어요." }) },
    { name: "말해 보기 — 배운 내용 떠올리기", inst: "5학년과 6학년 1학기에 배운 분수와 소수의 관계, (소수)×(자연수), (분수)÷(자연수), 4학년 때 배운 (세 자리 수)÷(두 자리 수)를 떠올려 보세요.", hints: ["[9/10]은 0.1이 9개인 수예요.", "소수 두 자리 수는 분모가 100인 분수로 나타내요.", "(분수)÷(자연수)는 분자가 자연수의 배수이면 분자를 자연수로 나누어요."],
      render: (b, a) => dn3Sent(b, a, [
        ["[9/10]을 소수로 나타내면", { n: "0.9", why: { "9": "[9/10]은 0.1이 9개인 수예요." } }],
        ["[47/100]을 소수로 나타내면", { n: "0.47", why: { "4.7": "분모가 100이면 소수 두 자리 수예요." } }],
        ["0.83을 분수로 나타내면", { f: ["83", "100"] }],
        ["1.3 × 4 =", { n: "5.2", e: "1.3×4" }],
        ["[6/7] ÷ 3 = [(6÷3)/7] =", { f: ["2", "7"] }],
        ["368 ÷ 16 =", { n: "23", e: "368÷16" }]],
        { ok: "분수와 소수의 관계, (소수)×(자연수), (분수)÷(자연수), 자연수의 나눗셈을 잘 기억하고 있어요. 이 단원에서 모두 쓰여요!" }) },
    { name: "약속하기 — 배울 차례 정하기", inst: "“소수를 자연수로 나누는 계산은 자연수의 나눗셈과 무엇이 같고 무엇이 다를까?” 이 단원에서 배울 내용을 배우는 차례대로 눌러 학습 계획을 세워 보세요.", hints: ["먼저 몫이 1보다 큰 (소수)÷(자연수)를 배우고, 다음에 몫이 1보다 작은 경우를 배워요.", "0을 내려 계산하는 경우 → 몫의 소수 첫째 자리에 0이 있는 경우 → (자연수)÷(자연수) 차례예요.", "어림셈으로 몫의 소수점 위치를 확인하는 것은 마지막에 배워요."],
      render: (b, a) => sequence(b, a, ["㉠ 어림셈으로 몫의 소수점 위치 확인하기", "㉡ 몫이 1보다 큰 (소수)÷(자연수)", "㉢ (자연수)÷(자연수)의 몫을 소수로 나타내기", "㉣ 몫이 1보다 작은 (소수)÷(자연수)", "㉤ 소수점 아래 0을 내려 계산하는 (소수)÷(자연수)", "㉥ 몫의 소수 첫째 자리에 0이 있는 (소수)÷(자연수)"], [1, 3, 4, 5, 2, 0],
        { ok: "몫이 1보다 큰 경우 → 몫이 1보다 작은 경우 → 0을 내려 계산 → 몫의 소수 첫째 자리에 0 → (자연수)÷(자연수) → 어림셈으로 소수점 위치 확인 차례로 배워요." }) },
    { name: "확인하기 — 먼저 어림해요", inst: "정확하게 계산하기 전에 어림해 보세요. 게시판의 답은 대략 얼마쯤일까요?", hints: ["6.9는 6에 가까워요. 6÷3=2예요.", "2.85는 3에 가까워요. 3÷3=1이에요.", "3.4는 3.5에 가까워요. 3.5÷5=0.7이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "음료 6.9 L를 물통 3개에 똑같이 나누면 한 개에 약 몇 L일까요?", o: ["약 0.2 L", "약 2 L", "약 20 L"], a: 1, why: { "0": "물통 3개에 0.2 L씩이면 모두 0.6 L예요. 너무 적어요.", "2": "물통 3개에 20 L씩이면 모두 60 L예요. 너무 많아요." } },
        { q: "페인트 2.85 L를 레인 3개의 선에 똑같이 나누면 한 레인에 약 몇 L일까요?", o: ["약 0.1 L", "약 1 L", "약 10 L"], a: 1, why: { "0": "2.85는 3에 가까워요. 3÷3=1이에요.", "2": "레인 3개에 10 L씩이면 30 L예요. 너무 많아요." } },
        { q: "결승선 테이프 3.4 m를 5개로 똑같이 자르면 한 개는 약 몇 m일까요?", o: ["약 0.7 m", "약 7 m", "약 70 m"], a: 0, why: { "1": "7 m씩 5개면 35 m예요. 테이프는 3.4 m뿐이에요.", "2": "70 m씩 5개면 350 m예요. 너무 길어요." } }],
        { ok: "어림해 보니 음료는 2 L쯤, 페인트는 1 L쯤, 테이프는 0.7 m쯤이에요. 정확한 값은 이 단원에서 계산해요." }) }
  ],
  challenge: { inst: "★ 도전 — 4학년 때 배운 (세 자리 수)÷(두 자리 수)를 세로셈으로 계산해 보세요. 줄넘기 클럽 18명이 한 달 동안 모두 432번 연습했다면 한 명이 평균 몇 번 연습했을까요?", hints: ["43을 18로 나누면 몫이 2이고 7이 남아요.", "남은 7과 2를 합한 72를 18로 나누어요.", "18×24=432예요."],
    render: dn3LongStep({ probs: [{ a: "432", b: "18" }],
      tip: "높은 자리부터 차례로 나누어 몫을 맨 위 칸에 써요. 몫이 자연수이면 소수점은 찍지 않아요.",
      rows: [["396 ÷ 12 =", { n: "33", e: "396÷12" }], ["[8/9] ÷ 4 = [(8÷4)/9] =", { f: ["2", "9"] }]],
      words: ["높은 자리부터", "곱하고 빼기"],
      ok: "432÷18=24(번), 396÷12=33, [8/9]÷4=[2/9]예요. 자연수의 나눗셈은 소수의 나눗셈의 바탕이 돼요." }) }
},
{
  id: "s2", no: 2, title: "스포츠 음료를 나누어 담아요 ― 몫이 1보다 크고 각 자리에서 나누어떨어지는 경우", soop: "개념 구축하기(O)",
  question: "몫이 1보다 크고 각 자리에서 나누어떨어지는 (소수)÷(자연수)는 어떻게 계산할까요?",
  summary: "6.9는 1이 6개, 0.1이 9개인 수예요. 6을 3으로 나누면 2, 0.1의 개수 9를 3으로 나누면 3이므로 6.9÷3=2.3이에요. 세로셈에서는 자연수 부분을 나눈 몫을 쓰고 나누어지는 수의 소수점에 맞추어 몫의 소수점을 찍은 뒤 소수 첫째 자리 부분을 나누어요. 분수의 나눗셈 [69/10]÷3=[(69÷3)/10]=[23/10]=2.3으로도 계산해요.",
  steps: [
    { name: "만져 보기 — 스포츠 음료 6.9 L", inst: "축구 클럽 경기가 있는 날이에요. 민재는 스포츠 음료 6.9 L를 물통 3개에 똑같이 나누어 담으려고 해요. 먼저 규칙을 예상하고, 수 모형 6.9(1이 6개, 0.1이 9개)를 물통 3개에 똑같이 나누어 주어 보세요.", hints: ["수 모형을 끌어 물통 칸에 놓거나, ‘1을 하나씩 나누어 주기’를 눌러요.", "1이 6개이니 물통마다 1이 2개씩, 0.1이 9개이니 0.1이 3개씩이에요.", "6.9를 6으로 어림하면 6÷3=2예요."],
      render: ruleFirst((b, a) => dn3Blocks(b, a, { a: "6.9", k: 3, grp: "물통",
        asks: [
          ["물통 한 개에 담을 음료의 양을 구하는 식은", { o: ["6.9÷3", "6.9×3", "3÷6.9"], a: 0, why: { "1": "똑같이 나누는 상황이에요.", "2": "전체 음료의 양 6.9 L를 물통의 수 3으로 나누어요." } }],
          ["어림셈: 6.9를 6으로 어림하여 6÷3을 계산하면", { n: "2", e: "6÷3", s: 1 }, "이므로 약 2 L예요."],
          ["6을 3으로 나눈 몫은", { n: "2", s: 1 }, "이고, 0.1의 개수인 9를 3으로 나눈 몫은", { n: "3", s: 1 }, "이에요."],
          ["물통 한 개에 담을 음료는", { n: "2.3", e: "6.9÷3" }, "L이고, 어림셈한 약 2 L와", { o: ["비슷해요", "많이 달라요"], a: 0 }]],
        ok: "6.9는 1이 6개, 0.1이 9개예요. 물통마다 1이 2개, 0.1이 3개이므로 2.3 L예요. 어림셈한 약 2 L와 비슷해요." }),
        { q: "6.9÷3을 수 모형으로 나누면 1과 0.1을 각각 어떻게 나누게 될까요?", ph: "내 규칙: 1은 ~, 0.1은 ~", help: ["① 6.9가 1이 몇 개, 0.1이 몇 개인지 생각해요. → ② 1과 0.1을 각각 물통 3개에 나누면 몇 개씩인지 예상해요.", "‘내 규칙: 1이 ~개는 ~개씩, 0.1이 ~개는 ~개씩이라서 몫은 ~이에요.’ 꼴로 써요."],
          ans: "1이 6개는 물통마다 2개씩, 0.1이 9개는 물통마다 3개씩 나누어 주면 돼요. 그래서 6.9÷3은 1이 2개, 0.1이 3개인 2.3이에요." }) },
    { name: "그려 보기 — 세로셈으로 6.9÷3", inst: "6.9÷3을 세로셈으로 계산해 보세요. 몫의 각 자리 숫자를 나누어지는 수의 자리에 맞추어 쓰고, 동그라미를 눌러 몫의 소수점을 찍어요.", hints: ["6을 3으로 나눈 몫 2를 6 위에 써요.", "6.9의 소수점(빨간 점) 바로 위에 몫의 소수점을 찍어요.", "0.1의 개수인 9를 3으로 나눈 몫 3을 9 위에 써요."],
      render: thenWhy(dn3LongStep({ probs: [{ a: "6.9", b: "3" }],
        talk: [["①", "6을 3으로 나눈 몫을 쓰고, 6.9의 소수점에 맞추어 점을 찍어요."], ["②", "소수 첫째 자리 9를 내려 쓰고, 0.1의 개수인 9를 3으로 나눈 몫을 써요."]],
        rows: [["몫의 소수점은", { o: ["나누어지는 수의 소수점에 맞추어", "몫의 맨 끝에", "나누는 수 옆에"], a: 0 }, "찍어요."]],
        ok: "6÷3=2를 쓰고 6.9의 소수점에 맞추어 점을 찍은 뒤, 9÷3=3을 써요. 6.9÷3=2.3이에요." }),
        { q: "몫의 소수점을 왜 나누어지는 수의 소수점 바로 위에 찍을까요?", ph: "6.9의 6은 1이 6개, 9는 ~", help: ["① 6.9에서 6과 9가 각각 무엇이 몇 개인지 떠올려요. → ② 몫의 2와 3이 각각 1의 개수인지 0.1의 개수인지 생각해요.", "‘몫의 2는 ~의 개수, 3은 ~의 개수라서 소수점을 ~에 찍어요.’ 꼴로 써요."],
          ans: "6.9의 6은 1이 6개, 9는 0.1이 9개예요. 6을 나눈 몫 2는 1이 2개이고 9를 나눈 몫 3은 0.1이 3개라서, 몫의 소수점을 6.9의 소수점 바로 위에 찍어야 2.3이 돼요." }) },
    { name: "말해 보기 — 분수의 나눗셈으로", inst: "6.9÷3을 분수의 나눗셈으로 나타내어 계산해 보고, 두 방법 가운데 내가 편한 방법을 친구에게 소개하는 글을 써 보세요. 두 활동을 모두 해야 계단을 올라가요.", hints: ["6.9는 소수 한 자리 수이므로 [69/10]이에요.", "분자 69를 3으로 나누면 23이에요.", "[23/10]을 소수로 바꾸면 2.3이에요."],
      render: (b, a) => { dn3Sent(b, a, [
        { g: "분수의 나눗셈으로 계산하기", rows: [["6.9 ÷ 3 =", { f: ["69", "10"] }, "÷ 3 = [(69÷3)/10] =", { f: ["23", "10"] }, "=", { n: "2.3", e: "6.9÷3" }]] },
        ["6.9는 소수 한 자리 수이므로 분모가", { o: ["10", "100", "3"], a: 0 }, "인 분수로 바꾸어 계산한 후 몫을 소수로 바꾸어 써요."],
        { q: "6.9÷3을 계산하는 방법을 바르게 말한 것을 모두 골라 보세요.", p: [{ m: ["세로로 나타내어 계산해요.", "분수의 나눗셈으로 나타내어 계산해요.", "몫에는 소수점을 찍지 않아요."], a: [0, 1] }] }],
        { ok: "세로로 나타내어 계산하거나, 소수를 분모가 10인 분수로 바꾸어 분자를 자연수로 나누어 계산해요." });
        writeStep(b, a, [{ q: "세로셈과 분수의 나눗셈 가운데 내가 편한 방법을 골라 친구에게 소개해 보세요.", tag: "내가 편한 방법", ph: "나는 ~ 방법이 편해요. 왜냐하면 ~", help: ["① 두 방법 가운데 하나를 골라요. → ② 그 방법으로 6.9÷3을 어떻게 계산하는지 차례대로 써요.", "‘나는 ~ 방법이 편해요. 먼저 ~하고, 그다음 ~해요.’ 꼴로 써요."],
          ans: "나는 분수의 나눗셈이 편해요. 6.9를 [69/10]으로 바꾸고 분자 69를 3으로 나누면 [23/10]이 되니까, 소수로 바꾸면 2.3이에요." }]); } },
    { name: "약속하기 — 몫의 소수점 찍기", inst: "몫이 1보다 크고 각 자리에서 나누어떨어지는 (소수)÷(자연수)를 계산하는 방법을 정리해 보세요.", hints: ["세로셈에서 몫의 소수점은 나누어지는 수의 소수점에 맞추어 찍었어요.", "분수로 바꿀 때 소수 한 자리 수는 분모가 10이에요."],
      render: (b, a) => blanks(b, a, ["(소수)÷(자연수)는 세로로 나타낸 후 자연수 부분의 나눗셈을 계산하여 몫을 쓰고, ", { o: ["나누어지는 수", "나누는 수"], a: 0 }, "의 소수점에 맞추어 몫의 소수점을 찍어요. 그다음 소수 첫째 자리 부분의 나눗셈을 계산하여 몫을 써요. 또 나누어지는 수인 소수를 분모가 ", { o: ["10", "3"], a: 0 }, "인 분수로 바꾸어 ", { o: ["분자", "분모"], a: 0 }, "를 자연수로 나누어 몫을 구할 수도 있어요."]) },
    { name: "확인하기 — 축구 클럽 음료 준비", inst: "다른 음료도 똑같이 나누어 담아 보세요. 이온 음료 8.4 L를 물통 4개에, 보리차 6.3 L를 주전자 3개에 나누어 담아요.", hints: ["4)8.4: 8÷4=2, 4÷4=1이에요.", "4.8=[48/10]이고 48÷2=24예요.", "36.9=[369/10]이고 369÷3=123이에요."],
      render: dn3LongStep({ probs: [{ a: "8.4", b: "4", cap: "이온 음료 8.4 ÷ 4" }, { a: "6.3", b: "3", cap: "보리차 6.3 ÷ 3" }],
        rows: [
          ["레몬 물 4.8 L를 병 2개에: 4.8 ÷ 2 = [48/10] ÷ 2 = [(48÷2)/10] =", { f: ["24", "10"] }, "=", { n: "2.4", e: "4.8÷2" }],
          ["물 36.9 L를 큰 통 3개에: 36.9 ÷ 3 = [369/10] ÷ 3 = [(369÷3)/10] =", { f: ["123", "10"] }, "=", { n: "12.3", e: "36.9÷3" }]],
        ok: "8.4÷4=2.1, 6.3÷3=2.1, 4.8÷2=2.4, 36.9÷3=12.3이에요. 몫의 소수점을 나누어지는 수의 소수점에 맞추어 찍었어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 물음에 답해 보세요.", hints: ["8.46은 1이 8개, 0.1이 4개, 0.01이 6개예요. 각각 2로 나누어요.", "12.6÷3=4.2, 20.5÷5=4.1이에요.", "55.5=[555/10]이고 555÷5=111이에요."],
    render: (b, a) => dn3Sent(b, a, [
      ["8.46 ÷ 2: 1이 8개 → 4개, 0.1이 4개 → 2개, 0.01이 6개 → 3개이므로 8.46 ÷ 2 =", { n: "4.23", e: "8.46÷2" }],
      { q: "몫이 더 큰 것을 골라 보세요.", p: ["㉠ 12.6 ÷ 3 ㉡ 20.5 ÷ 5 →", { o: ["㉠", "㉡"], a: 0, why: { "1": "12.6÷3=4.2, 20.5÷5=4.1이에요. 4.2가 더 커요." } }] },
      { q: "응원 리본 9.6 m를 똑같이 3도막으로 자르면 한 도막은 몇 m일까요?", p: ["9.6 ÷ 3 =", { n: "3.2", e: "9.6÷3" }, "(m)"] },
      ["55.5 ÷ 5 =", { f: ["555", "10"] }, "÷ 5 = [(555÷5)/10] =", { f: ["111", "10"] }, "=", { n: "11.1", e: "55.5÷5" }]],
      { ok: "8.46÷2=4.23, ㉠이 더 커요(4.2), 3.2 m, 55.5÷5=11.1이에요. 잘했어요!" }) }
},
{
  id: "s3", no: 3, title: "줄넘기 줄을 잘라요 ― 몫이 1보다 크고 각 자리에서 나누어떨어지지 않는 경우", soop: "개념 구축하기(O)",
  question: "몫이 1보다 크고 각 자리에서 나누어떨어지지 않는 (소수)÷(자연수)는 어떻게 계산할까요?",
  summary: "7.32는 1이 7개, 0.1이 3개, 0.01이 2개인 수예요. 7을 3으로 나누면 몫이 2이고 1이 남아요. 남은 1을 0.1 10개로 바꾸면 0.1은 13개, 13÷3의 몫은 4이고 0.1이 1개 남아요. 남은 0.1을 0.01 10개로 바꾸면 0.01은 12개, 12÷3=4이므로 7.32÷3=2.44예요. 분수로는 [732/100]÷3=[(732÷3)/100]=[244/100]=2.44예요.",
  steps: [
    { name: "만져 보기 — 긴 줄 7.32 m", inst: "줄넘기 클럽 하람이는 긴 줄 7.32 m를 잘라 똑같은 길이의 개인 줄 3개를 만들려고 해요. 1 m를 1, 0.1 m를 0.1, 0.01 m를 0.01 모형으로 나타냈어요. 수 모형 7.32를 줄 3개에 똑같이 나누어 주어 보세요.", hints: ["1이 7개라 줄마다 1을 2개씩 주면 1이 1개 남아요.", "남은 1은 ‘1 하나 → 0.1 10개로 바꾸기’를 눌러 0.1 10개로 바꾸어요.", "0.1이 13개가 되면 줄마다 4개씩 주고 1개가 남아요. 남은 0.1도 0.01 10개로 바꾸어요."],
      render: (b, a) => dn3Blocks(b, a, { a: "7.32", k: 3, grp: "줄",
        asks: [
          ["줄 한 개의 길이를 구하는 식은", { o: ["7.32÷3", "7.32×3", "3÷7.32"], a: 0 }],
          ["어림셈: 6 ÷ 3 =", { n: "2", e: "6÷3", s: 1 }, ", 9 ÷ 3 =", { n: "3", e: "9÷3", s: 1 }, "이므로 줄 한 개는 2 m와 3 m 사이예요."],
          ["7을 3으로 나누면 몫이 2이고 1이 남아요. 남은 1을 0.1 10개로 바꾸면 0.1은 모두", { n: "13", s: 1 }, "개 → 13 ÷ 3의 몫은", { n: "4", s: 1 }, "이고 0.1이 1개 남아요."],
          ["남은 0.1을 0.01 10개로 바꾸면 0.01은 모두", { n: "12", s: 1 }, "개 → 12 ÷ 3 =", { n: "4", e: "12÷3", s: 1 }],
          ["줄 한 개의 길이는", { n: "2.44", e: "7.32÷3" }, "m로 어림셈한 2 m와 3 m 사이에", { o: ["들어가요", "들어가지 않아요"], a: 0 }]],
        ok: "줄마다 1이 2개, 0.1이 4개, 0.01이 4개이므로 2.44 m예요. 남은 모형은 더 작은 모형 10개로 바꾸어 계속 나누었어요." }) },
    { name: "그려 보기 — 세로셈으로 7.32÷3", inst: "7.32÷3을 세로셈으로 계산해 보세요. 남은 수는 바로 아래 자리의 수와 합하여 계속 나누어요.", hints: ["7을 3으로 나눈 몫 2를 쓰고 7.32의 소수점에 맞추어 점을 찍어요.", "7−6=1, 3을 내려 13을 3으로 나누면 4이고 1이 남아요.", "1과 2를 합한 12를 3으로 나누면 4예요."],
      render: thenWhy(dn3LongStep({ probs: [{ a: "7.32", b: "3" }],
        talk: [["①", "7을 3으로 나눈 몫 2를 쓰고, 7.32의 소수점에 맞추어 점을 찍어요."], ["②", "남은 1과 내려 쓴 3을 합한 13(0.1의 개수)을 3으로 나눈 몫을 써요."], ["③", "남은 1과 내려 쓴 2를 합한 12(0.01의 개수)를 3으로 나눈 몫을 써요."]],
        rows: [["7.32 ÷ 3 =", { n: "2.44", e: "7.32÷3" }]],
        ok: "2, 4, 4를 차례로 쓰고 7.32의 소수점에 맞추어 점을 찍었어요. 7.32÷3=2.44예요." }),
        { q: "7을 3으로 나누고 남은 1을 왜 내려 쓴 3과 합하여 13으로 나눌까요?", ph: "남은 1은 0.1이 ~", help: ["① 남은 1을 0.1로 바꾸면 몇 개인지 생각해요. → ② 원래 있던 0.1 3개와 합하면 몇 개인지 떠올려요.", "‘남은 1은 0.1이 ~개라서, 0.1 ~개와 합하면 ~개를 3으로 나누는 거예요.’ 꼴로 써요."],
          ans: "남은 1은 0.1이 10개와 같아요. 원래 있던 0.1 3개와 합하면 0.1이 13개이니까 13을 3으로 나누는 거예요." }) },
    { name: "말해 보기 — 분수와 0.01의 개수로", inst: "7.32÷3을 분수의 나눗셈과 0.01의 개수로 계산해 보세요.", hints: ["7.32는 소수 두 자리 수이므로 [732/100]이에요.", "732÷3=244예요.", "7.32는 0.01이 732개예요."],
      render: (b, a) => dn3Sent(b, a, [
        { g: "분수의 나눗셈으로 계산하기", rows: [["7.32 ÷ 3 =", { f: ["732", "100"] }, "÷ 3 = [(732÷3)/100] =", { f: ["244", "100"] }, "=", { n: "2.44", e: "7.32÷3" }]] },
        ["7.32는 소수 두 자리 수이므로 분모가", { o: ["100", "10"], a: 0 }, "인 분수로 바꾸어요."],
        { g: "0.01의 개수로 계산하기", rows: [["7.32는 0.01이", { n: "732" }, "개 → 732 ÷ 3 =", { n: "244", e: "732÷3" }, "→ 0.01이 244개이므로", { n: "2.44" }]] },
        { fig: () => dn3RelFig([["732", "3", "244"], ["7.32", "3", "2.44"]], 100) },
        ["나누는 수가 그대로이고 나누어지는 수가 [1/100]배가 되면 몫도", { o: ["[1/100]배", "100배", "그대로"], a: 0 }, "가 돼요."]],
        { ok: "분수로 바꾸거나 0.01의 개수로 생각하면 자연수의 나눗셈 732÷3=244를 이용할 수 있어요. 7.32÷3=2.44예요." }) },
    { name: "약속하기 — 남은 수는 아래 자리로", inst: "각 자리에서 나누어떨어지지 않는 (소수)÷(자연수)를 계산하는 방법을 정리해 보세요.", hints: ["남은 1을 0.1 10개로, 남은 0.1을 0.01 10개로 바꾸어 계속 나누었어요.", "소수 두 자리 수는 분모가 100인 분수로 나타내요."],
      render: (b, a) => blanks(b, a, ["각 자리에서 나누어떨어지지 않으면 남은 수를 바로 아래 자리로 내려(1은 0.1 ", { o: ["10개", "100개"], a: 0 }, ", 0.1은 0.01 10개로 바꾸어) 계속 나누어요. 몫의 소수점은 ", { o: ["나누어지는 수", "나누는 수"], a: 0 }, "의 소수점에 맞추어 찍어요. 소수 두 자리 수는 분모가 ", { o: ["100", "10"], a: 0 }, "인 분수로 바꾸어 분수의 나눗셈으로 계산할 수도 있어요."]) },
    { name: "확인하기 — 줄넘기 클럽 준비물", inst: "줄넘기 클럽 준비물을 계산해 보세요.", hints: ["7)9.1: 9÷7=1 남는 2, 21÷7=3이에요.", "6)13.44: 13÷6=2 남는 1, 14÷6=2 남는 2, 24÷6=4예요.", "5.6=[56/10], 17.36=[1736/100]이에요."],
      render: dn3LongStep({ probs: [{ a: "9.1", b: "7", cap: "손잡이 테이프 9.1 ÷ 7" }, { a: "13.44", b: "6", cap: "줄 13.44 ÷ 6" }],
        rows: [
          ["5.6 ÷ 4 = [56/10] ÷ 4 = [(56÷4)/10] =", { f: ["14", "10"] }, "=", { n: "1.4", e: "5.6÷4" }],
          ["17.36 ÷ 8 = [1736/100] ÷ 8 = [(1736÷8)/100] =", { f: ["217", "100"] }, "=", { n: "2.17", e: "17.36÷8" }]],
        ok: "9.1÷7=1.3, 13.44÷6=2.24, 5.6÷4=1.4, 17.36÷8=2.17이에요!" }) }
  ],
  challenge: { inst: "★ 도전 — 물음에 답해 보세요.", hints: ["7.38÷6=1.23, 9.45÷7=1.35예요.", "넓이를 세로로 나누면 가로예요.", "38.15÷7=5.45예요. 5.45보다 큰 자연수 중 가장 작은 수를 찾아요."],
    render: (b, a) => dn3Sent(b, a, [
      { q: "두 나눗셈의 몫의 합을 구해 보세요.", p: ["7.38 ÷ 6 + 9.45 ÷ 7 =", { n: "2.58", e: "7.38÷6+9.45÷7" }] },
      { q: "넓이가 31.68 m²이고 세로가 6 m인 직사각형 모양 줄넘기 연습장의 가로는 몇 m일까요?", p: ["31.68 ÷ 6 =", { n: "5.28", e: "31.68÷6" }, "(m)"] },
      { q: "38.15 ÷ 7 < □ 에서 □ 안에 들어갈 수 있는 자연수 중 가장 작은 수는?", p: ["38.15 ÷ 7 =", { n: "5.45", e: "38.15÷7" }, "이므로 □ =", { n: "6", why: { "5": "5는 5.45보다 작아요. 5.45보다 커야 해요.", "5.45": "□는 자연수예요. 5.45보다 큰 자연수 중 가장 작은 수를 써요." } }] }],
      { ok: "2.58, 5.28 m, 6이에요. 잘했어요!" }) }
},
