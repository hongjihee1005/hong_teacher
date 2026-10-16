//@@APP
const APP={title:"한민족 전통문화 축제 소수의 나눗셈", unit:"6-1 수학 3. 소수의 나눗셈(교과서)", key:"t61-decnat-v1", welcome:"한민족 전통문화 축제 소수의 나눗셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 준호와 친구들과 함께 통일을 기원하는 한민족 전통문화 축제를 준비하며 좁쌀·찹쌀밥·점토·나무 막대·식혜·한지·시루떡을 똑같이 나누어 (소수)÷(자연수)를 계산하고, (자연수)÷(자연수)의 몫을 소수로 나타내고, 어림셈으로 몫의 소수점 위치를 확인해 봐요."};
//@@UNIT
/* ===== 6-1 3. 소수의 나눗셈 단원 조작 부품 (앞글자 dn3) =====
   6-2 「소수의 나눗셈」(dv2) 부품의 수 계산·빈칸 채점·세로셈을 바탕으로, 나누는 수가 자연수인 나눗셈에 맞게 고쳤어요.
   수는 모두 BigInt 분수(분자/분모)로 계산해서 소수 계산 오차가 없어요.
   글 속 분수 표기: [62/10], [(62÷2)/10] → 화면에서 위아래로 쌓은 분수로 보여 줘요. */

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
quiz = (b, a, items, o) => dn3Quiz0(b, dn3A(a), items, o);
blanks = (b, a, parts, o) => dn3Blanks0(b, dn3A(a), parts, o);

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
/* 확인 단추(그림 조작 검사 → 줄 묶음 채점) */
function dn3Check(body, api, reg, opt, pre, label) {
  body.__dn3 = () => reg;
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const p = pre ? pre() : null;
    if (p && p.bad) return api.fail(p.bad, p.given || "-");
    const r = dn3Judge(reg, opt);
    const g = [p && p.given, r.given].filter(Boolean).join(" / ");
    if (r.bad) return api.fail(r.bad, g);
    api.tryOnce(); api.done(g, opt.ok);
  } }, label || "확인하기")));
}
/* ① 빈칸 줄 문제 */
function dn3Sent(body, api, rows, opt = {}) {
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
  dn3Style();
  const A = dn3Norm(opt.a), K = opt.k, RA = dn3P(A), Q = dn3Div(RA, dn3R(BigInt(K)));
  const qS = dn3Exact(Q); if (qS == null || dn3Dn(qS) > 2) throw new Error("수 모형으로 나눌 수 없어요: " + A);
  const [ai, af = ""] = A.split(".");
  const T = 1 + Math.max(af.length, dn3Dn(qS));
  const init = [Number(ai), Number(af[0] || 0), Number(af[1] || 0)].slice(0, T);
  const q100 = Number(Q.n * 100n / Q.d), goal = [Math.floor(q100 / 100), Math.floor(q100 / 10) % 10, q100 % 10].slice(0, T);
  const grpName = opt.grp || "묶음";
  let pool, grp, hist, drag = null, boxes = [], zones = [];
  const reset = () => { pool = init.slice(); grp = Array.from({ length: K }, () => Array(T).fill(0)); hist = []; };
  reset();
  const W = 760, x0 = 10, PH = 170, GY = PH + 16, SZ = [{ w: 44, h: 44, gx: 6, gy: 6 }, { w: 6, h: 44, gx: 4, gy: 6 }, { w: 7, h: 7, gx: 3, gy: 3 }];
  const zw = T === 2 ? [420, 316] : [300, 236, 196];
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
    if (pool[t] < K) { say.textContent = pool[t] ? `${DN3T[t]}이 ${pool[t]}개뿐이라 ${grpName} ${K}개에 하나씩 나누어 줄 수 없어요.` + (t < T - 1 ? ` ${DN3T[t + 1]} 10개로 바꾸어 봐요.` : "") : `남은 ${DN3T[t]}이 없어요.`; return; }
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
  body.append(h("div", { class: "dn3say" }, opt.tip || `위의 수 모형을 끌어 ${grpName}에 놓거나 눌러서 ${grpName} ${K}개에 똑같이 나누어 주어요. 똑같이 나누어 줄 수 없으면 더 작은 모형 10개로 바꾸어요.`),
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
      return { bad: `남은 ${DN3T[t2]}이 ${pool[t2]}개 있어요. ${grpName} ${K}개에 하나씩 줄 수 없으니 ${DN3T[t2 + 1] || "더 작은 모형"} 10개로 바꾸어 나누어 주어요.`, given: giv };
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
  if (!af.length) notes.push(`자연수 ${A} 뒤에 소수점이 있다고 생각해요(${A} = ${A}.${"0".repeat(totalDec)}).`);
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
    if (r.v[r.first] === "0" && r.first < r.last && p !== r.first) { paint(qRow, r.first, r.first, false); return { bad: `${cap}: 몫의 맨 앞에는 0을 쓰지 않아요(몫이 1보다 작을 때 일의 자리의 0만 써요).`, given: r.v.join("") }; }
    const s = p >= 0 ? r.v.slice(r.first, p + 1).join("") + "." + r.v.slice(p + 1, r.last + 1).join("") : r.v.slice(r.first, r.last + 1).join("");
    const got = dn3P(s);
    if (dn3Eq(got, Q)) {
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
  return { el, judge, ans };
}
function dn3Long(body, api, opt) {
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
  });
}

/* ===== ④ 나무 막대를 똑같이 자르기 (m와 cm 두 눈금) =====
   opt: {m:"2.6", n:4, snap:5, item:"투호살", asks, ok} */
function dn3Tape(body, api, opt) {
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
    g.append(txt(x0 + Lp, my - 6, opt.m, 15, { fill: DN3C.red }), txt(x0 + Lp + 18, my + 12, "m", 14, { fill: DN3C.dark }));
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
    g.append(txt(x0 + Lp, ry + 16, String(Lcm), 14, { fill: DN3C.red }), txt(x0 + Lp + 20, ry - 2, "cm", 14, { fill: DN3C.dark }));
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
    if (it.est) parts.push(it.est.lab ? `→ ${dn3Sp(it.est.lab)}(으)로 어림셈하면 약` : "→ 어림셈하면 약", { o: it.est.o, a: it.est.a }, "→");
    parts.push("몫:", { el: () => strip });
    const row = dn3Parts(parts, reg);
    const judge = () => {
      const v = valOf(), giv = dn3Str(v);
      if (p < 0) return { bad: `${dn3Sp(it.e)}: 몫의 숫자 사이 동그라미를 눌러 소수점을 찍어요.`, given: giv };
      if (!dn3Eq(v, Q)) return { bad: `${dn3Sp(it.e)}: 지금 찍은 몫은 ${giv}예요. 어림셈한 몫${it.est ? `(약 ${it.est.o[it.est.a]})` : ""}과 비슷한 크기가 되도록 소수점을 다시 찍어요.`, given: giv };
      return { given: giv };
    };
    if (/^0\./.test(qS)) throw new Error("몫이 1보다 작은 나눗셈은 소수점 찍기에 쓰지 않아요 " + it.e);
    row.__solve = () => { p = qS.indexOf(".") - 1; pts.forEach((x, j) => x.classList.toggle("dn3pon", j === p)); };
    return { row, judge, ans: `${dn3Sp(it.e)} = ${qS}` };
  });
  if (opt.fig) body.append(opt.fig());
  body.append(h("div", { class: "dn3say" }, opt.tip || "먼저 어림셈하여 몫이 약 얼마인지 고르고, 몫의 숫자 사이 동그라미를 눌러 소수점을 찍어요."), ...items.map(i => i.row));
  if (opt.asks) body.append(h("div", { class: "dn3ask" }, dn3Rows(opt.asks, reg)));
  body.__dn3solve = () => items.forEach(i => i.row.__solve());
  api.provide({ words: opt.words || ["어림셈", "몫의 소수점"], answers: items.map(i => i.ans).concat(reg.plain.slice(items.length)) });
  dn3Check(body, api, reg, opt, () => { const rs = items.map(i => i.judge()), bad = rs.find(r => r.bad); return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") }; });
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
  });
}

/* ===== ⑧ 발사! 나눗셈을 옳게 하면 내 땅! (10차시 놀이판) =====
   ❓ 교과서 부록 놀이판은 지도서에 축소 그림으로만 있어 칸 배치를 정확히 되살릴 수 없어요.
   그림에서 읽은 나눗셈 26가지(17.2÷2는 그림처럼 두 칸)와 특수 칸으로 '이 앱이 정한 놀이판'을 만들었어요.
   계산기 표시(🧮)는 그림에서 보인 칸 + 38.4÷12(그림에서 가려 확인하지 못함, 나누는 수가 두 자리라 이 앱에서 붙임). */
const DN3BOARD = [
  ["6.25÷5", "38.4÷12*", "10.15÷5", "9÷5", "24.36÷7*", "PICK", "6.12÷6"],
  ["11.2÷5", "5.6÷8", "REST", "10÷8", "33÷5", "3.5÷5", "36.72÷12*"],
  ["9.9÷6", "26÷5", "GO", "GO", "19.2÷6", "REST", "0.6÷4"],
  ["5÷4", "17.2÷2", "GO", "GO", "85.05÷7*", "82.8÷9", "17.2÷2"],
  ["PICK", "43.2÷9*", "13.5÷9", "8.12÷4", "10.8÷24*", "5.6÷14", "14.28÷6"]];
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
  dn3Style();
  const COLS = 7, ROWS = 5, cw = 104, ch = 72, gp = 4, x0 = 14, y0 = 14;
  const W = x0 * 2 + COLS * cw + (COLS - 1) * gp, H = y0 * 2 + ROWS * ch + (ROWS - 1) * gp;
  const svg = makeSvg(W, H), g = svgEl("g"), fx = svgEl("g"); svg.append(g, fx);
  const P = [{ n: "파랑", c: DN3C.blue, soft: "#BFD9F5" }, { n: "빨강", c: DN3C.red, soft: "#F6C3B8" }];
  const SHOTS = opt.shots || 8;
  const cx = c => x0 + c * (cw + gp), cy = r => y0 + r * (ch + gp);
  const GO = { x: cx(2), y: cy(2), w: 2 * cw + gp, h: 2 * ch + gp }, home = { x: GO.x + GO.w / 2, y: GO.y + GO.h / 2 + 24 };
  let owner, shots, rest, turn, phase, clip, aim, cur, finished, busy, noise = true;
  const status = h("div", { class: "dn3score" }), say = h("div", { class: "dn3say" }, "​"), ask = h("div", { class: "dn3row" });
  const restart = () => { owner = DN3CELLS.map(() => -1); shots = [0, 0]; rest = [false, false]; turn = 0; phase = "aim"; clip = { ...home }; aim = null; cur = -1; finished = false; busy = false; ask.innerHTML = ""; draw(); paint(); say.textContent = `${P[0].n} 차례예요. 클립에서 원하는 땅 쪽으로 끌었다가 놓아 튕겨요.`; };
  const cellAt = pt => DN3CELLS.findIndex(it => pt.x >= cx(it.c) && pt.x <= cx(it.c) + cw && pt.y >= cy(it.r) && pt.y <= cy(it.r) + ch);
  const draw = () => {
    g.innerHTML = ""; fx.innerHTML = "";
    g.append(svgEl("rect", { x: 2, y: 2, width: W - 4, height: H - 4, rx: 14, fill: "#E9C98F", stroke: "#B78A45", "stroke-width": 3 }));
    DN3CELLS.forEach((it, i) => {
      if (it.kind === "GO") return;
      const x = cx(it.c), y = cy(it.r), o = owner[i];
      const fill = o >= 0 ? P[o].soft : it.kind === "REST" ? "#BFE3A8" : it.kind === "PICK" ? "#F8C9D6" : "#FFFDF6";
      g.append(svgEl("rect", { x, y, width: cw, height: ch, rx: 10, fill, stroke: o >= 0 ? P[o].c : "#D9C7A3", "stroke-width": o >= 0 ? 3 : 1.5 }));
      if (it.kind === "REST") g.append(txt(x + cw / 2, y + ch / 2, "한 번 쉬기", 18, { fill: "#3D6B2A" }));
      else if (it.kind === "PICK") { g.append(txt(x + cw / 2, y + ch / 2 - 11, "원하는 땅", 15, { fill: "#A0365A" }), txt(x + cw / 2, y + ch / 2 + 11, "한 칸 색칠하기", 15, { fill: "#A0365A" })); }
      else {
        g.append(txt(x + cw / 2, y + ch / 2 + (it.calc ? 8 : 0), it.e, it.e.length > 7 ? 17 : 19, { fill: "#5A3A12" }));
        if (it.calc) { g.append(svgEl("rect", { x: x + 8, y: y + 7, width: 14, height: 18, rx: 2, fill: "#7A8C86" }), svgEl("rect", { x: x + 10, y: y + 9, width: 10, height: 4, fill: "#E3F1E6" }), txt(x + 50, y + 16, "계산기", 12, { fill: DN3C.dark })); }
      }
    });
    g.append(svgEl("rect", { x: GO.x, y: GO.y, width: GO.w, height: GO.h, rx: 14, fill: "#8FD07A", stroke: "#4E9A3A", "stroke-width": 2.5 }), txt(GO.x + GO.w / 2, GO.y + 36, "발사", 30, { fill: "#1F5FA8" }));
    if (aim) {
      const dx = aim.x - clip.x, dy = aim.y - clip.y;
      fx.append(svgEl("line", { x1: clip.x, y1: clip.y, x2: aim.x, y2: aim.y, stroke: P[turn].c, "stroke-width": 3, "stroke-dasharray": "8 6" }), svgEl("circle", { cx: aim.x, cy: aim.y, r: 10 + Math.hypot(dx, dy) * 0.08, fill: "none", stroke: P[turn].c, "stroke-width": 2 }));
    }
    const cl = svgEl("g", { transform: `translate(${clip.x},${clip.y})` });
    cl.append(svgEl("rect", { x: -16, y: -7, width: 32, height: 14, rx: 7, fill: "none", stroke: "#4A6FA5", "stroke-width": 3 }), svgEl("rect", { x: -10, y: -3.5, width: 22, height: 7, rx: 3.5, fill: "none", stroke: "#4A6FA5", "stroke-width": 2.5 }));
    fx.append(cl);
  };
  const count = k => owner.filter(o => o === k).length;
  const paint = () => {
    status.innerHTML = "";
    P.forEach((p, k) => status.append(h("span", { class: !finished && turn === k ? "dn3turn" : "", style: `border-color:${p.c}` }, `${p.n}: 땅 ${count(k)}칸 · 발사 ${shots[k]}/${SHOTS}${rest[k] ? " · 다음에 한 번 쉬기" : ""}`)));
  };
  const left = () => DN3CELLS.some((it, i) => it.kind === "div" && owner[i] < 0);
  const endCheck = () => {
    if (!left() || (shots[0] >= SHOTS && shots[1] >= SHOTS)) {
      finished = true; phase = "end"; paint();
      const a = count(0), b = count(1);
      say.textContent = `놀이 끝! 파랑 ${a}칸, 빨강 ${b}칸 → ${a === b ? "비겼어요" : (a > b ? "파랑" : "빨강") + "이 이겼어요"}!`;
      return true;
    }
    return false;
  };
  const nextTurn = () => {
    busy = true;
    setTimeout(() => {
      busy = false; ask.innerHTML = ""; clip = { ...home }; aim = null;
      if (endCheck()) { draw(); return; }
      let t = 1 - turn;
      if (shots[t] >= SHOTS) t = turn;
      if (rest[t] && shots[1 - t] < SHOTS) { rest[t] = false; turn = t; draw(); paint(); say.textContent = `${P[t].n}은 이번에 한 번 쉬어요.`; nextTurn(); return; }
      rest[t] = false; turn = t; phase = "aim"; draw(); paint();
      say.textContent = `${P[t].n} 차례예요. 클립을 끌었다가 놓아 원하는 땅으로 튕겨요.`;
    }, opt.fast ? 10 : 1200);
  };
  const land = () => {
    const i = cellAt(clip);
    const it = i >= 0 ? DN3CELLS[i] : null;
    if (!it || it.kind === "GO" || owner[i] >= 0) {
      phase = "aim"; const where = !it ? "놀이판 밖으로 나갔어요" : it.kind === "GO" ? "발사 칸에 떨어졌어요" : "이미 색칠된 땅에 도착했어요";
      say.textContent = `${where}. 클립을 발사 칸에 놓고 다시 한번 튕겨요.`; setTimeout(() => { clip = { ...home }; draw(); }, opt.fast ? 0 : 700); return;
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
    ask.innerHTML = ""; ask.append(h("span", {}, `${P[turn].n}: ${dn3Sp(it.e)} =`), inp, h("button", { class: "opt", onclick: go }, "몫 확인"), it.calc ? h("span", { class: "dn3note" }, "(계산기 칸 — 아래 계산기를 써도 돼요)") : null);
    say.textContent = `${dn3Sp(it.e)} 땅에 도착했어요. 몫을 써요. 친구가 계산기로 확인해요.`;
    setTimeout(() => inp.focus && inp.focus(), 30);
  };
  const fly = (to, cb) => {
    const from = { ...clip }; let k = 0, N = opt.fast ? 1 : 14; busy = true;
    const stepF = () => { k++; const t = k / N, e = 1 - (1 - t) * (1 - t); clip = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e }; draw(); if (k < N) setTimeout(stepF, 22); else { busy = false; cb(); } };
    stepF();
  };
  const launch = (tx, ty, exact) => {
    if (phase !== "aim" || busy || finished) return;
    const d = Math.hypot(tx - clip.x, ty - clip.y);
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
    if (Math.hypot(pt.x - clip.x, pt.y - clip.y) > 46) { say.textContent = "클립을 눌러 끌어요(발사 칸의 클립에서 시작해요)."; return false; }
    aim = { x: pt.x, y: pt.y }; draw(); return true;
  }, pt => { aim = { x: pt.x, y: pt.y }; draw(); }, pt => { launch(pt.x, pt.y); });
  restart();
  const calc = dn3CalcEl("🧮 친구가 확인할 때 쓰는 계산기");
  body.__dn3clip = { phase: () => phase, launch, pick, cells: DN3CELLS, owner: () => owner.slice(), home, setNoise: v => { noise = v; }, cx, cy, cw, ch, input: () => ask.querySelector("input"), go: () => ask.querySelector("button") };
  body.append(h("div", { class: "dn3note" }, "※ 이 앱이 정한 놀이판이에요. 교과서 놀이판에 있는 나눗셈을 이 앱에서 새로 늘어놓았어요. 한 사람이 " + SHOTS + "번씩 발사하거나 나눗셈 땅이 모두 색칠되면 끝나요."),
    status, h("div", { class: "dn3stage" }, svg), say, ask, h("div", { class: "dn3tools" }, h("button", { onclick: restart }, "처음부터 다시")), calc);
  api.provide({ words: ["몫의 소수점", "0을 내려 계산"], answers: [] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (!finished) return api.fail("놀이를 끝까지 해요. 한 사람이 " + SHOTS + "번씩 발사하면 끝나요.", `파랑 ${count(0)}칸, 빨강 ${count(1)}칸`);
    api.tryOnce(); api.done(`파랑 ${count(0)}칸, 빨강 ${count(1)}칸`, opt.ok);
  } }, "놀이 끝 확인하기")));
}

/* ===== ⑨ 나눗셈 카드 놀이 (또 다른 놀이 방법) =====
   카드 12장. 로봇 친구와 번갈아 카드를 뒤집어요. 로봇이 뒤집으면 내가 계산하고, 내가 뒤집으면 로봇이 계산한 답을 내가 계산기로 확인해요. 5장을 먼저 모으면 이겨요. */
const DN3DECK = ["10.15÷5", "33÷5", "6.95÷5", "17.2÷4", "5.7÷2", "58.4÷8", "0.9÷5", "14÷5", "15.6÷3", "4.36÷4", "7.5÷6", "5.64÷6"].map(e => { const q = dn3E(e), a = dn3Exact(q); if (a == null) throw new Error("카드 오류 " + e); return { e, q, a }; });
function dn3CardGame(body, api, opt = {}) {
  dn3Style();
  let deck, mine, bot, phase, card, botSaid, botOk, finished, busy, flipper;
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
      area.innerHTML = ""; return true;
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
      say.textContent = "로봇 친구가 계산했어요. 아래 계산기로 확인하고 맞았는지 골라요.";
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
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (!finished) return api.fail("카드 놀이를 끝까지 해요. 5장을 먼저 모으면 끝나요.", `나 ${mine.length}장`);
    api.tryOnce(); api.done(`나 ${mine.length}장, 로봇 친구 ${bot.length}장`, opt.ok);
  } }, "놀이 끝 확인하기")));
}

/* ===== ⑩ 그림의 수로 (소수)÷(자연수) 문제 만들기 (11차시) ===== */
const DN3MK = { a: [{ v: "1.62", u: "kg", n: "찰흙" }, { v: "2.88", u: "m", n: "철사" }], b: [{ v: "3", n: "학생 3명" }, { v: "6", n: "바구니 6개" }] };
function dn3MakeText(a, b) {
  if (a.n === "찰흙") return b.v === "3" ? "찰흙 1.62 kg을 학생 3명에게 똑같이 나누어 주려고 해요. 한 명에게 줄 수 있는 찰흙은 몇 kg일까요?" : "찰흙 1.62 kg을 바구니 6개에 똑같이 나누어 담으려고 해요. 바구니 한 개에 담을 수 있는 찰흙은 몇 kg일까요?";
  return b.v === "3" ? "길이가 2.88 m인 철사를 학생 3명이 똑같이 나누어 가지려고 해요. 한 명이 가질 수 있는 철사는 몇 m일까요?" : "길이가 2.88 m인 철사를 똑같이 6도막으로 잘라 바구니 6개에 하나씩 넣으려고 해요. 철사 한 도막의 길이는 몇 m일까요?";
}
function dn3Make(body, api, opt = {}) {
  dn3Style();
  const all = [...DN3MK.a.map(x => ({ ...x, dec: true, lab: `${x.n} ${x.v} ${x.u}` })), ...DN3MK.b.map(x => ({ ...x, dec: false, lab: x.n }))];
  let A = -1, B = -1;
  const chA = h("div", { class: "dn3chips" }), chB = h("div", { class: "dn3chips" }), prob = h("div", { class: "dn3talk" }), row = h("div", { class: "dn3row" });
  const inp = h("input", { type: "text", inputmode: "decimal", class: "dn3in", "aria-label": "답" });
  const unitEl = h("span", {}, "");
  const draw = () => {
    chA.innerHTML = ""; chB.innerHTML = "";
    all.forEach((x, i) => {
      chA.append(h("button", { class: "opt" + (A === i ? " dn3on" : ""), onclick: () => { A = i; draw(); } }, x.lab));
      chB.append(h("button", { class: "opt" + (B === i ? " dn3on" : ""), onclick: () => { B = i; draw(); } }, x.lab));
    });
    prob.innerHTML = ""; row.innerHTML = "";
    if (A >= 0 && B >= 0 && all[A].dec && !all[B].dec) {
      prob.append(h("p", {}, h("b", {}, "만든 문제 "), dn3MakeText(all[A], all[B])));
      unitEl.textContent = all[A].u;
      row.append(h("span", {}, `${all[A].v} ÷ ${all[B].v} =`), inp, unitEl);
    } else prob.append(h("p", {}, A >= 0 && B >= 0 ? "(소수)÷(자연수)가 되도록 나누어지는 수는 소수, 나누는 수는 자연수를 골라요." : "나누어지는 수와 나누는 수를 하나씩 골라요."));
  };
  draw();
  body.append(h("div", { class: "dn3vcap" }, "나누어지는 수"), chA, h("div", { class: "dn3vcap" }, "나누는 수"), chB, prob, row);
  body.__dn3solve = () => { A = 0; B = 2; draw(); inp.value = dn3V("1.62÷3"); };
  api.provide({ words: ["(소수)÷(자연수)"], answers: ["1.62 ÷ 3 = 0.54 (kg)", "1.62 ÷ 6 = 0.27 (kg)", "2.88 ÷ 3 = 0.96 (m)", "2.88 ÷ 6 = 0.48 (m)"] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (A < 0 || B < 0) return api.fail("나누어지는 수와 나누는 수를 하나씩 골라요.", "-");
    const a = all[A], b = all[B];
    if (!a.dec || b.dec) return api.fail("(소수)÷(자연수) 문제를 만들어요. 나누어지는 수는 찰흙의 무게나 철사의 길이(소수), 나누는 수는 학생 수나 바구니 수(자연수)예요.", `${a.lab} ÷ ${b.lab}`);
    const q = dn3E(`${a.v}÷${b.v}`), v = dn3P(inp.value), giv = `${a.v}÷${b.v}=${inp.value.trim() || "-"}`;
    if (v == null) return api.fail("만든 문제의 답을 수로 써요.", giv);
    if (!dn3Eq(v, q)) return api.fail(dn3Diag(`${a.v}÷${b.v}`, v) || `${a.v} ÷ ${dn3J(b.v, "을를")} 다시 계산해 봐요.`, giv);
    api.tryOnce(); api.done(giv, opt.ok || `${dn3MakeText(a, b)} → ${a.v} ÷ ${b.v} = ${dn3Str(q)}, 답 ${dn3Str(q)} ${a.u}. 문제를 잘 만들고 해결했어요!`);
  } }, "확인하기")));
}

/* ===== 그림들 ===== */
/* 꿀벌 3마리와 꿀 0.42 g (1차시) */
function dn3BeeFig() {
  const W = 640, H = 190, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const bee = (x, y) => {
    const b = svgEl("g", { transform: `translate(${x},${y})` });
    b.append(svgEl("ellipse", { cx: -6, cy: -20, rx: 14, ry: 10, fill: "#E8F4FF", stroke: "#8DB7DE", "stroke-width": 1.5 }), svgEl("ellipse", { cx: 8, cy: -22, rx: 14, ry: 10, fill: "#E8F4FF", stroke: "#8DB7DE", "stroke-width": 1.5 }));
    b.append(svgEl("ellipse", { cx: 0, cy: 0, rx: 26, ry: 17, fill: "#F7C948", stroke: INK, "stroke-width": 2 }));
    [-8, 4].forEach(sx => b.append(svgEl("rect", { x: sx, y: -16, width: 6, height: 32, fill: INK, opacity: .8 })));
    b.append(svgEl("circle", { cx: 24, cy: -2, r: 9, fill: INK }), svgEl("circle", { cx: 27, cy: -5, r: 2, fill: "#fff" }));
    return b;
  };
  [[90, 70], [210, 60], [330, 74]].forEach(([x, y]) => g.append(bee(x, y)));
  g.append(svgEl("path", { d: "M470 60 h90 l-10 90 h-70 z", fill: "#FFE7A8", stroke: "#C99A57", "stroke-width": 2.5 }), svgEl("path", { d: "M480 96 h80 l-6 54 h-68 z", fill: "#F2B63D" }));
  g.append(txt(515, 40, "꿀 0.42 g", 20, { fill: "#8A5A1E" }), txt(210, 140, "꿀벌 3마리가 똑같은 양을 모았어요", 18, { fill: DN3C.dark }), txt(210, 168, "한 마리가 모은 꿀은 몇 g일까?", 18, { fill: DN3C.red }));
  return dn3Fig(svg);
}
/* 축제 마당 (1차시) */
function dn3FestFig() {
  const W = 720, H = 200, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const booth = (x, label, draw) => { g.append(svgEl("rect", { x, y: 30, width: 160, height: 150, rx: 14, fill: "#FFFDF6", stroke: "#D9C7A3", "stroke-width": 2 }), svgEl("path", { d: `M${x} 30 h160 l-14 -18 h-132 z`, fill: "#E86A5A" }), txt(x + 80, 160, label, 17, { fill: "#5A3A12" })); draw(x + 80); };
  booth(10, "떡메 치기", cx => { g.append(svgEl("rect", { x: cx - 40, y: 100, width: 80, height: 30, rx: 6, fill: "#B07A3E" }), svgEl("ellipse", { cx, cy: 98, rx: 30, ry: 9, fill: "#fff", stroke: "#ccc" }), svgEl("rect", { x: cx + 6, y: 50, width: 34, height: 18, rx: 5, fill: "#8A5A1E", transform: `rotate(-25 ${cx + 20} 60)` }), svgEl("line", { x1: cx + 24, y1: 66, x2: cx + 50, y2: 110, stroke: "#8A5A1E", "stroke-width": 5 })); });
  booth(190, "투호 놀이", cx => { g.append(svgEl("path", { d: `M${cx - 18} 132 h36 l-6 -60 h-24 z`, fill: "#3E7CB1" })); [-14, 0, 12].forEach((o, i) => g.append(svgEl("line", { x1: cx + o, y1: 80, x2: cx + o * 2.2, y2: 44 + i * 4, stroke: "#C99A57", "stroke-width": 4 }))); });
  booth(370, "시루떡", cx => { g.append(svgEl("rect", { x: cx - 44, y: 84, width: 88, height: 44, rx: 6, fill: "#F3E2C0", stroke: "#B07A3E", "stroke-width": 2 })); [0, 1, 2].forEach(i => g.append(svgEl("rect", { x: cx - 44, y: 92 + i * 13, width: 88, height: 5, fill: "#9B4A3A" }))); });
  booth(550, "식혜", cx => { g.append(svgEl("path", { d: `M${cx - 30} 70 h60 v60 a10 10 0 0 1 -10 10 h-40 a10 10 0 0 1 -10 -10 z`, fill: "#F7EBD3", stroke: "#9AABA4", "stroke-width": 2 }), svgEl("rect", { x: cx - 26, y: 90, width: 52, height: 44, fill: "#EAD49A", opacity: .8 })); });
  return dn3Fig(svg);
}
/* 찰흙·철사·바구니 (11차시) */
function dn3ClayFig() {
  const W = 720, H = 190, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  g.append(svgEl("rect", { x: 30, y: 120, width: 300, height: 16, rx: 6, fill: "#C99A57" }));
  [80, 180, 280].forEach((x, i) => g.append(svgEl("circle", { cx: x, cy: 70, r: 22, fill: ["#F6C08A", "#9CC6EC", "#F4A7B9"][i], stroke: INK, "stroke-width": 2 }), svgEl("rect", { x: x - 22, y: 92, width: 44, height: 28, rx: 10, fill: ["#E8913A", "#2B7BD6", "#C8472E"][i], opacity: .7 })));
  g.append(txt(180, 160, "학생 3명", 17, { fill: DN3C.dark }));
  g.append(svgEl("rect", { x: 370, y: 100, width: 90, height: 14, rx: 4, fill: "#9AABA4" }), svgEl("rect", { x: 392, y: 70, width: 46, height: 30, rx: 6, fill: "#B07A55" }), txt(415, 135, "찰흙 1.62 kg", 16, { fill: "#8A5A1E" }));
  g.append(svgEl("path", { d: "M490 70 q20 -30 40 0 t40 0 t40 0", fill: "none", stroke: "#7A8C86", "stroke-width": 4 }), txt(550, 105, "철사 2.88 m", 16, { fill: DN3C.dark }));
  for (let i = 0; i < 6; i++) g.append(svgEl("path", { d: `M${484 + i * 36} 140 h28 l-4 22 h-20 z`, fill: "#F7C948", stroke: "#B78A45", "stroke-width": 1.5 }));
  g.append(txt(590, 178, "바구니 6개", 16, { fill: DN3C.dark }));
  return dn3Fig(svg);
}
/* 운동 기록 표 (9차시) */
function dn3Record(name, rows) {
  return h("div", {}, h("div", { class: "dn3vcap" }, `${name}의 운동 기록`), h("div", { style: "overflow-x:auto;max-width:100%" }, h("table", { class: "dn3tbl" },
    h("tr", {}, ["날짜", "운동", "소모한 열량(킬로칼로리)", "운동 시간(분)"].map(t => h("th", {}, t))),
    rows.map(r => h("tr", {}, r.map(c => h("td", {}, c)))))));
}
function dn3WithCalc(fig) { return () => h("div", { class: "dn3cwrap" }, h("div", { class: "dn3cmain" }, fig ? fig() : null), dn3CalcEl()); }
