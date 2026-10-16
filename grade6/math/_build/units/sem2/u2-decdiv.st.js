//@@APP
const APP={title:"우리 반 나눔 축제 부스", unit:"6-2 수학 2. 소수의 나눗셈", key:"s62-decdiv-v1", welcome:"우리 반 나눔 축제 부스에 온 것을 환영해요", intro:"푸른솔초등학교 6학년 1반 친구들과 가을 나눔 축제에서 레몬에이드·꽃다발·종이비행기 부스를 열며, 레몬청을 병에 나누어 담고 리본을 자르고 재료값을 비교하면서 (소수)÷(소수), (자연수)÷(소수)를 계산하고 몫을 반올림하거나 나누어 주고 남는 양을 구해 봐요."};
//@@UNIT
/* ===== 2. 소수의 나눗셈 단원 조작 부품 (앞글자 dv2) — 이야기 버전 =====
   교과서 버전(u2-decdiv.tb.js)의 dv2 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요
   (입력칸 0.9초 · 고르기 0.26초 · 끌기·단추·세로셈 판 1.2초). 소수를 쓰는 중(‘1.’, 답보다 숫자가 적은 동안)에는 확인하지 않아요.
   수는 모두 BigInt 분수(분자/분모)로 계산해서 소수 계산 오차가 없어요.
   글 속 분수 표기: [36/10] → 화면에서 위아래로 쌓은 분수로 보여 줘요.
   화면 글에는 '나누어 주고 남는 양'만 써요(지도서 유의 사항: 그 말 대신 다른 용어를 쓰지 않아요).
   한 계단에 활동이 둘이면(엔진 hj-multi) 부품마다 api.done( 을 불러야 하나로 세어요 — 부품마다 그 표시를 적어 두었어요. */

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
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done( 을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return dv2Quiz0(body, dv2A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return dv2Blanks0(body, dv2A(api), parts, o); };

const DV2C = { a: "#F6C08A", b: "#9CC6EC", t: "#F4A7B9", g: "#A9D8A2", line: "#C9D4CF", dark: "#7A8C86", red: "#C8472E", blue: "#2B7BD6", orange: "#E8913A", sand: "#FFF3D6", sea: "#E6F3EA" };
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
/* ===== 저절로 확인하기 (이야기 버전) =====
   ready(): 다 했는지(아직 쓰거나 고르는 중이면 false) · sig(): 지금 상태 글 · judge(): 채점해서 맞으면 true.
   같은 상태로는 다시 세지 않아요(고쳐 쓰는 동안 '틀림'이 쌓이지 않아요). */
function dv2sAuto(root, ready, sig, judge) {
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
const dv2sDg = s => dv2Norm(s).replace(/[^0-9]/g, "").length;
/* 묻는 칸이 다 찼나요? 수 칸은 '1.'처럼 소수점까지만 쓴 중이거나, 칸에 있는 동안 답보다 숫자가 적으면 기다려요. */
function dv2sFilled(reg) {
  const act = document.activeElement;
  return reg.items.every(it => {
    if (it.k === "n") { const v = it.inp.value.trim(); if (!v || /[.．。·]$/.test(v)) return false; return act !== it.inp || dv2sDg(v) >= dv2sDg(String(it.pt.n)); }
    if (it.k === "f") { const n = it.ni.value.trim(), d = it.di.value.trim(); if (!n || !d) return false;
      if (act === it.ni && n.length < String(it.pt.f[0]).length) return false;
      if (act === it.di && d.length < String(it.pt.f[1]).length) return false; return true; }
    if (it.k === "m") return it.sel.size >= it.pt.a.length;
    return it.sel.size > 0;
  });
}
function dv2sSig(reg) { return reg.items.map(it => it.k === "f" ? it.ni.value.trim() + "/" + it.di.value.trim() : it.inp ? it.inp.value.trim() : [...it.sel].sort().join(",")).join("§"); }
/* 저절로 확인(그림 조작 검사 → 줄 묶음 채점). pre(): 조작 검사 {bad, given}, more(): 조작 판이 다 찼는지(세로셈·반올림 숫자 누르기 등)
   묻는 칸이 있으면 다 채웠을 때 확인하고(조작이 덜 되었으면 그때 알려 줘요), 묻는 칸이 없으면 조작이 맞을 때 확인해요. 맞으면 api.done( 을 불러요. */
function dv2Check(body, api, reg, opt, pre, more) {
  body.__dv2 = () => reg;   // 점검용
  const ready = () => {
    if (more && !more()) return false;
    if (!dv2sFilled(reg)) return false;
    if (!reg.items.length && pre && !more) { const p = pre(); if (p && p.bad) return false; }
    return true;
  };
  const sig = () => dv2sSig(reg) + "#" + (pre ? (pre() || {}).given || "" : "");
  dv2sAuto(body, ready, sig, () => {
    const p = pre ? pre() : null;
    if (p && p.bad) { api.fail(p.bad, p.given || "-"); return false; }
    const r = dv2Judge(reg, opt);
    const g = [p && p.given, r.given].filter(Boolean).join(" / ");
    if (r.bad) { api.fail(r.bad, g); return false; }
    api.tryOnce(); api.done(g, opt.ok); return true;
  });
}
/* ① 빈칸 줄 문제 */
function dv2Sent(body, api, rows, opt = {}) {
  /* 다 하면 dv2Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
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
  /* 다 하면 dv2Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
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
  /* 다 하면 dv2Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
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
  /* 다 하면 dv2Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
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
  /* 다 하면 dv2Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
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
    let ok = dv2Eq(val, remR);
    if (ok && remR.d !== 1n && rRow.p !== pOrig) { paint(rRow, r.first, r.last, false); return { bad: `${cap}: 남는 양의 숫자를 나누어지는 수의 자리에 맞추어 쓰고, 소수점은 ${A}의 처음 소수점 자리에 찍어요.`, given: dv2Str(val) }; }
    paint(rRow, r.first, r.last, ok);
    if (ok) return { ok: true, given: dv2Str(val) };
    const sameDigits = [dv2Pow(1), dv2Pow(2), dv2Pow(3)].some(m => dv2Eq(val, dv2Mul(remR, dv2R(m))) || dv2Eq(val, dv2Div(remR, dv2R(m))));
    if (sameDigits) return { bad: `${cap}: 남는 양의 숫자는 맞는데 소수점 위치가 달라요. 남는 양의 소수점은 나누어지는 수 ${A}의 처음 소수점${sh ? "(흐린 동그라미)" : ""}에 맞추어 찍어요.`, given: dv2Str(val) };
    return { bad: `${cap}: 몫 ${qStr}에 대한 빼기를 다시 해 봐요. ${dv2J(`${shownA} − ${shownB} × ${qStr}`, "을를")} 계산해요.`, given: dv2Str(val) };
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
  /* 다 썼나요? 판 안(칸·소수점 단추)에 있는 동안은 몫(과 남는 양)의 숫자를 답만큼 쓰고 소수점이 필요하면 찍었을 때, 판을 떠나면 바로 */
  const cntOf = R => R.ins.filter(x => x.value !== "").length;
  const needQ = qStr.replace(".", "").length, remS = remR ? dv2Str(remR) : "", needR = remS.replace(".", "").replace(/^0+/, "").length;
  const full = () => {
    if (!cntOf(qRow)) return false;
    if (rRow && (!cntOf(rRow) || !rRow.ins.some(x => /[1-9]/.test(x.value)))) return false;
    const ae = document.activeElement, inHere = el.contains(ae) && (ae.tagName === "INPUT" || ae.tagName === "BUTTON");
    if (!inHere) return true;
    if (cntOf(qRow) < needQ || (qDec > 0 && qRow.p < 0)) return false;
    if (rRow && (cntOf(rRow) < needR || (remR.d !== 1n && rRow.p < 0))) return false;
    return true;
  };
  return { el, judge, ans, full };
}
function dv2Long(body, api, opt) {
  /* 다 하면 dv2Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
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
  }, () => boards.every(b => b.full()));
}

/* ===== ⑦ 몫을 반올림하기: 확인할 숫자를 누르고 어림한 몫 쓰기 =====
   opt: {items:[{e:"7÷3", to:0}], asks, ok} */
function dv2Round(body, api, opt) {
  /* 다 하면 dv2Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
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
    return { row, judge, has: () => pick >= 0, ans: `${dv2Sp(it.e)} = ${show}… → ${DV2PLACE[it.to + 1]} 숫자 ${dv2J(cells[intLen + it.to], "을를")} 보고 ${want}` };
  });
  body.append(h("div", { class: "dv2say" }, opt.tip || "몫에서 확인할 숫자(나타낼 자리의 바로 아래 자리)를 누르고, 반올림한 몫을 칸에 써요."), ...items.map(i => i.row));
  if (opt.asks) body.append(h("div", { class: "dv2ask" }, dv2Rows(opt.asks, reg)));
  body.__dv2solve = () => items.forEach(i => i.row.__solve());
  api.provide({ words: opt.words || ["바로 아래 자리", "반올림"], answers: items.map(i => i.ans).concat(reg.plain.slice(items.length)) });
  dv2Check(body, api, reg, opt, () => { const rs = items.map(i => i.judge()), bad = rs.find(r => r.bad); return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") }; }, () => items.every(i => i.has()));
}

/* ===== ⑧ 수 카드로 몫이 가장 큰 나눗셈 만들기 (□.□ ÷ □.□) ===== opt: {cards:["2","3","4","6"], asks, ok} */
function dv2Cards(body, api, opt) {
  /* 다 하면 dv2Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
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
  }, () => !slots.includes(null));
}

/* ===== ⑨ 1 kg(1 L)의 값 맞추기 (8차시 알뜰 장보기) =====
   opt: {total:"8400", qty:"3.5", unit:"kg", item:"가 가게 설탕", step:100, max:6000, asks, ok}
   1 kg의 값을 단추로 바꾸면 봉지 전체(qty)의 값이 따라 바뀌어요. 봉지 값과 딱 맞으면 그 값이 1 kg의 값이에요. */
function dv2sUnit(body, api, opt) {
  /* 다 하면 dv2Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dv2Style();
  const T = dv2P(opt.total), Q = dv2P(opt.qty), want = dv2Div(T, Q), stp = BigInt(opt.step || 100), MAX = BigInt(opt.max || 6000);
  if (want.d !== 1n || want.n % stp !== 0n || want.n > MAX) throw new Error("1 단위의 값이 단추로 맞출 수 없는 수예요: " + opt.total + "÷" + opt.qty);
  const u = opt.unit || "kg", qn = Number(Q.n) / Number(Q.d), K = Math.ceil(qn);
  const W = 760, x0 = 40, L = 680, y = 54, bh = 60, H = 168;
  const svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  let v = 0n;
  const say = h("div", { class: "dv2say" }, "​");
  const won = r => dv2Str(r) + "원";
  const totalR = () => dv2Mul(dv2R(v), Q);
  const draw = () => {
    g.innerHTML = "";
    for (let k = 0; k < K; k++) {
      const len = Math.min(1, qn - k), x = x0 + L * k / K, w = L * len / K;
      g.append(svgEl("rect", { x, y, width: w, height: bh, fill: k % 2 ? DV2C.b : DV2C.a, stroke: DV2C.dark, "stroke-width": 1.6 }));
      const part = dv2Mul(dv2R(v), len === 1 ? dv2R(1n) : dv2Sub(Q, dv2R(BigInt(k))));
      g.append(txt(x + w / 2, y + bh / 2 - 9, len === 1 ? `1 ${u}` : `${dv2Str(dv2Sub(Q, dv2R(BigInt(k))))} ${u}`, 15, { fill: DV2C.dark }));
      g.append(txt(x + w / 2, y + bh / 2 + 13, won(part), w < 90 ? 13 : 16));
      if (len < 1) g.append(svgEl("rect", { x: x + w, y, width: L / K - w, height: bh, fill: "none", stroke: DV2C.line, "stroke-width": 1.5, "stroke-dasharray": "6 5" }));
    }
    for (let k = 0; k <= K; k++) { const x = x0 + L * k / K; g.append(svgEl("line", { x1: x, y1: y + bh, x2: x, y2: y + bh + 10, stroke: INK, "stroke-width": 2 }), txt(x, y + bh + 26, `${k}`, 15)); }
    g.append(txt(x0 + L, y + bh + 46, u, 14, { fill: DV2C.dark, "text-anchor": "end" }));
    g.append(txt(x0, 22, `${opt.item || "봉지"} ${opt.qty} ${u} = ${opt.total}원`, 17, { fill: DV2C.red, "text-anchor": "start" }));
    const tr = totalR(), c = tr.n * T.d - T.n * tr.d;
    say.innerHTML = ""; say.append(`1 ${u}에 `, h("b", {}, won(dv2R(v))), ` → ${opt.qty} ${u}는 ${won(tr)} `, c < 0n ? "(봉지 값보다 적어요)" : c > 0n ? "(봉지 값보다 많아요)" : "(봉지 값과 딱 맞아요!)");
  };
  const add = d => () => { v += BigInt(d); if (v < 0n) v = 0n; if (v > MAX) v = MAX; draw(); };
  const tools = h("div", { class: "dv2tools" }, h("button", { onclick: add(-1000) }, "−1000원"), h("button", { onclick: add(-Number(stp)) }, `−${stp}원`), h("button", { onclick: add(Number(stp)) }, `+${stp}원`), h("button", { onclick: add(1000) }, "+1000원"));
  draw();
  const reg = dv2Reg();
  const asks = opt.asks ? h("div", { class: "dv2ask" }, dv2Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dv2say" }, opt.tip || `단추를 눌러 1 ${u}의 값을 바꾸어 보세요. ${opt.qty} ${u} 전체의 값이 ${opt.total}원과 딱 맞으면 그 값이 1 ${u}의 값이에요.`), h("div", { class: "dv2stage" }, svg), say, tools, asks);
  body.__dv2solve = () => { v = want.n; draw(); };
  api.provide({ words: [`${opt.total} ÷ ${opt.qty}`], answers: [`1 ${u}에 ${dv2Str(want)}원`].concat(reg.plain) });
  dv2Check(body, api, reg, opt, () => {
    const tr = totalR(), c = tr.n * T.d - T.n * tr.d, giv = `1 ${u}에 ${won(dv2R(v))}`;
    if (c < 0n) return { bad: `${opt.qty} ${u}의 값이 ${opt.total}원보다 적어요. 1 ${u}의 값을 올려 보세요.`, given: giv };
    if (c > 0n) return { bad: `${opt.qty} ${u}의 값이 ${opt.total}원보다 많아요. 1 ${u}의 값을 내려 보세요.`, given: giv };
    return { given: giv };
  });
}

/* ===== ⑩ 축제 부스 한 바퀴 놀이판 (10차시) =====
   칸 문제는 opt.cells = dv2sCells([{e:"3.6÷0.4"}, {e:"7.15÷3.3", r:0}, …]) — 나누어떨어지는지·반올림 답을 코드로 계산해요. */
function dv2sCells(list) {
  return list.map(c0 => {
    const c = Object.assign({}, c0), q = dv2E(c.e); if (!q) throw new Error("놀이판 식 오류 " + c.e);
    if (c.r == null) { c.ans = dv2Exact(q); if (c.ans == null) throw new Error("나누어떨어지지 않는 칸 " + c.e); }
    else c.ans = dv2Fix(dv2RndR(q, c.r), c.r);
    c.want = dv2P(c.ans); return c;
  });
}
function dv2Island(body, api, opt) {
  /* 말 하나가 도착 칸에 닿으면 api.done( 을 불러요 */
  const DV2ISLAND = opt.cells;
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
    if (pos[k] >= N - 1) { pos[k] = N - 1; drawTok(); finished = true; phase = "end"; paintStatus(); say.textContent = `${P[k].n}이 먼저 도착했어요! ${P[k].n} 승리!`; api.tryOnce(); api.done(`${P[k].n} 도착`, opt && opt.ok); return; }
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
  body.append(h("div", { class: "dv2note" }, opt.note || "※ 이 앱이 만든 놀이판이에요."), status, h("div", { class: "dv2stage" }, svg),
    h("div", { class: "dv2tools" }, h("button", { onclick: () => roll() }, "주사위 던지기"), dieEl, h("button", { onclick: restart }, "처음부터 다시")), say, ask);
  api.provide({ words: ["소수의 나눗셈", "몫을 반올림"], answers: [] });
}

/* ===== ⑪ 빙고 (또 다른 놀이) ===== 놀이판의 (소수)÷(소수)·(자연수)÷(소수) 문제 중 9개로 빙고판을 만들고 컴퓨터 친구와 번갈아 말해요. 3줄을 먼저 만들면 이겨요. */
function dv2Lines(mark) { const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; return L.filter(l => l.every(i => mark[i])).length; }
function dv2Bingo(body, api, opt) {
  /* 누군가 3줄을 먼저 만들면 api.done( 을 불러요 */
  dv2Style();
  const POOL = opt.cells.filter(c => c.r == null);
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
  const drawBot = () => { botB.innerHTML = ""; if (!bot.length) botB.append(h("div", { class: "dv2note", style: "grid-column:1/-1" }, "빙고판을 완성하면 컴퓨터 친구도 빙고판을 만들어요.")); bot.forEach((ci, k) => botB.append(h("div", { class: "dv2bc" + (bmk[k] ? " dv2mk" : "") }, finished ? POOL[ci].e : "?"))); };
  const winCheck = who => {
    const a = dv2Lines(mk), b = dv2Lines(bmk);
    const first = who === "me" ? [a, "내가"] : [b, "컴퓨터 친구가"], second = who === "me" ? [b, "컴퓨터 친구가"] : [a, "내가"];
    if (first[0] >= 3 || second[0] >= 3) { finished = true; phase = "end"; drawBot(); say.textContent = `${first[0] >= 3 ? first[1] : second[1]} 먼저 3줄을 만들었어요! 빙고! (나 ${a}줄, 컴퓨터 친구 ${b}줄)`; api.tryOnce(); api.done(`빙고 끝 (나 ${a}줄)`, opt && opt.ok); return true; }
    return false;
  };
  const myCall = k => {
    if (phase !== "play" || busy || mk[k] || mine[k] == null) return;
    const c = POOL[mine[k]]; mk[k] = true;
    const bi = bot.indexOf(mine[k]); if (bi >= 0) bmk[bi] = true;
    drawMine(); drawBot();
    say.textContent = `내가 말했어요: ${dv2Sp(c.e)} = ${c.ans}` + (bi >= 0 ? " — 컴퓨터 친구도 같은 식이 있어 ○표를 했어요." : "");
    if (winCheck("me")) return;
    busy = true;
    setTimeout(() => {
      const cand = bot.map((ci, j) => j).filter(j => !bmk[j]);
      const j = cand[Math.floor(Math.random() * cand.length)], ci = bot[j], c2 = POOL[ci]; bmk[j] = true;
      const mi = mine.indexOf(ci); if (mi >= 0) mk[mi] = true;
      drawMine(); drawBot(); busy = false;
      say.textContent = `컴퓨터 친구가 말했어요: ${dv2Sp(c2.e)} = ${c2.ans}` + (mi >= 0 ? " — 나에게도 있어서 ○표를 했어요." : "") + " 내 차례예요. 내 빙고판에서 말할 칸을 눌러요.";
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
  body.append(h("div", { class: "dv2say" }, `놀이판의 (소수)÷(소수), (자연수)÷(소수) ${POOL.length}문제예요. 9개를 골라 빙고판에 놓고 몫을 써요.`), chips,
    h("div", { class: "dv2bgw" }, h("div", {}, h("div", { class: "dv2vcap" }, "내 빙고판"), board), h("div", {}, h("div", { class: "dv2vcap" }, "컴퓨터 친구 빙고판"), botB)),
    h("div", { class: "dv2tools" }, ready, again), say);
  api.provide({ words: ["빙고", "3줄"], answers: [] });
}
/* 종이비행기 날리기 부스 그림(4차시): rows = [[거리, 이름, 색], …] */
function dv2sPlaneFig(rows) {
  const W = 720, x0 = 40, s = 80, H = 54 + rows.length * 66, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  g.append(svgEl("line", { x1: x0, y1: 10, x2: x0, y2: H - 26, stroke: INK, "stroke-width": 3 }), txt(x0, H - 10, "출발선", 14));
  for (let m = 1; m <= 8; m++) { const x = x0 + m * s; g.append(svgEl("line", { x1: x, y1: H - 32, x2: x, y2: H - 24, stroke: DV2C.dark, "stroke-width": 1.5 }), txt(x, H - 10, `${m} m`, 12, { fill: DV2C.dark })); }
  rows.forEach(([d, n, c], k) => {
    const y = 40 + k * 66, x = x0 + Number(d) * s;
    g.append(svgEl("line", { x1: x0, y1: y, x2: x - 6, y2: y, stroke: c, "stroke-width": 3, "stroke-dasharray": "7 6", opacity: .7 }));
    g.append(svgEl("path", { d: `M${x} ${y} L${x - 34} ${y - 14} L${x - 24} ${y} L${x - 34} ${y + 14} z`, fill: "#fff", stroke: c, "stroke-width": 2.5, "stroke-linejoin": "round" }));
    g.append(txt((x0 + x) / 2, y - 14, `${n}의 종이비행기 ${d} m`, 16, { fill: c }));
  });
  return dv2Fig(svg);
}
/* 이야기 쪽지(축제 준비 쪽지·결산 기록) */
function dv2sNote(title, lines) { dv2Style(); return h("div", { class: "dv2snote" }, h("div", { class: "dv2gt" }, title), h("ul", {}, lines.map(t => h("li", {}, t)))); }
(function () { const st = document.createElement("style"); st.textContent = ".dv2snote{border:2px solid #E7C98A;background:#FFFBEF;border-radius:.8em;padding:.4em .9em;margin:.4em 0}.dv2snote ul{margin:.3em 0 .1em 1.1em;padding:0}.dv2snote li{margin:.18em 0;word-break:keep-all}"; document.head.append(st); })();


/* 세로셈 계단을 render에 바로 쓰는 짧은 꼴 */
const dv2LongStep = opt => (b, a) => dv2Long(b, a, opt);
//@@LESSONS
const UNIT_STORY = { title: "우리 반 나눔 축제 부스", lines: [
  "푸른솔초등학교 6학년 1반은 가을 나눔 축제에서 부스를 열고, 수익금을 동네 아동 센터에 보내기로 했어요. 반장 하준이와 서윤, 도현, 지아, 예린, 건우, 소율이가 레몬에이드 가게·꽃다발 가게·종이비행기 멀리 날리기·초대장 만들기를 나누어 맡았어요.",
  "레몬청을 병에 나누어 담고, 꽃다발 리본을 자르고, 종이비행기가 날아간 거리를 견주고, 초대장 종이를 접고, 남는 레모네이드를 나누며 (소수)÷(소수), (자연수)÷(소수)를 계산하고 몫을 반올림하거나 나누어 주고 남는 양을 구해요.",
  "마지막에는 알뜰하게 재료를 사는 방법을 따지고 부스 운영 계획서를 써서 발표한 뒤, 축제 부스 한 바퀴 놀이와 결산 발표회로 배운 것을 정리해요."],
  one: "우리 반 나눔 축제 부스 · 레몬청·리본·종이비행기·초대장·레모네이드·재료값에서 나누어지는 수와 나누는 수를 각각 10배, 100배 해도 몫이 같다는 원리로 소수의 나눗셈을 계산해요." };
const UNIT_KEYWORDS = ["소수의 나눗셈", "(소수)÷(소수)", "(자연수)÷(소수)", "각각 10배", "각각 100배", "몫은 같아요", "0.1이 몇 개", "자연수의 나눗셈", "분수의 나눗셈", "세로셈", "몫의 소수점", "어림셈", "몫을 반올림", "바로 아래 자리", "나누어 주고 남는 양", "검산", "1 kg의 값"];
const DV2S_PLAN = ["🍋 레몬에이드 가게: 레몬청 4.2 L를 0.6 L들이 병에 나누어 담기", "💐 꽃다발 가게: 리본 끈 4.56 m로 꽃다발 묶기(한 다발에 1.52 m)", "✈️ 종이비행기 멀리 날리기: 건우 7.56 m, 소율 4.2 m", "📜 초대장 만들기: 길이 9 cm인 종이를 1.5 cm씩 병풍처럼 접기", "🥤 레모네이드 14.3 L를 1.6 L들이 주전자에 나누어 담기"];
const DV2S_TYPES = ["(소수)÷(소수)", "(자연수)÷(소수)"];
const DV2S_BOARD = dv2sCells([
  { e: "3.6÷0.4" }, { e: "6.3÷0.9" }, { e: "4÷0.8" }, { e: "21.6÷2.4" }, { e: "0.84÷0.28" }, { e: "13.8÷4.6" }, { e: "5.22÷1.74" },
  { e: "45÷1.8" }, { e: "3.15÷0.35" }, { e: "7.15÷3.3", r: 0 }, { e: "8.37÷2.7" }, { e: "21÷1.75" }, { e: "4.86÷0.9" }, { e: "14.72÷3.68" },
  { e: "9.12÷3.8" }, { e: "24÷0.75" }, { e: "5.88÷0.6" }, { e: "26.25÷5.25" }, { e: "23÷0.7", r: 1 }]);

const LESSONS = [
{
  id: "s1", no: 1, title: "나눔 축제 부스를 준비해요", soop: "개념 찾기(S)",
  question: "나눔 축제 부스를 준비할 때 소수의 나눗셈이 필요한 때는 언제일까요?",
  summary: "축제 준비 쪽지에는 레몬청 4.2 L를 0.6 L씩, 리본 4.56 m를 1.52 m씩, 종이 9 cm를 1.5 cm씩 나누는 일과 7.56 m가 4.2 m의 몇 배인지 알아보는 일처럼 소수로 나누는 상황이 많아요. 같은 양씩 몇 번 덜어 낼 수 있는지, 몇 배인지 알아볼 때 소수의 나눗셈이 필요해요. 이 단원에서는 (소수)÷(소수), (자연수)÷(소수)를 계산하고 몫을 반올림하거나 나누어 주고 남는 양을 구해요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "우리 반이 가을 나눔 축제에서 부스를 열어요! 반장 하준이가 정리한 축제 준비 쪽지를 보고, 세 칸에 써서 붙여요.", hints: ["쪽지에서 소수가 쓰인 곳을 찾아봐요.", "같은 양씩 나누어 담거나, 몇 배인지 견주는 곳을 떠올려요."],
      render: (b, a) => { b.append(dv2sNote("🎪 6학년 1반 나눔 축제 준비 쪽지", DV2S_PLAN));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "쪽지에 ~이 보여요", hint: "쪽지에서 보이는 것", ex: ["4.2 L, 0.6 L, 1.52 m처럼 소수가 많이 보여요.", "레몬청이나 리본을 똑같은 양씩 나누는 일이 보여요."] },
          { t: "생각해요", e: "💭", ph: "~할 때 소수로 나누어야 할 것 같아요", hint: "소수의 나눗셈이 필요한 일", ex: ["레몬청 병의 수는 4.2 L 안에 0.6 L가 몇 번 들어가는지 알아야 하니까 4.2÷0.6으로 구할 것 같아요.", "건우의 비행기가 소율이 비행기의 몇 배 날았는지는 7.56÷4.2로 알 수 있을 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 계산할까?", hint: "소수의 나눗셈에 대해 궁금한 것", ex: ["4.2÷0.6처럼 소수로 나누면 몫은 소수일까, 자연수일까?", "레모네이드를 주전자에 담고 남는 양은 어떻게 구할까?"] }],
          { ok: "축제 준비 쪽지에는 소수의 나눗셈이 가득해요! 이 단원에서 하나씩 계산하는 방법을 알아봐요." }); } },
    { name: "그려 보기 — 쪽지를 나눗셈식으로", inst: "축제 준비 쪽지의 일을 나눗셈식으로 나타내고, 어떤 꼴의 나눗셈인지 골라 보세요.", hints: ["4.2 L 안에 0.6 L가 몇 번 들어가는지 알아보는 것은 나눗셈이에요.", "몇 배인지 구할 때는 견주는 양으로 나누어요.", "9는 자연수, 1.5는 소수예요."],
      render: thenWhy((b, a) => dv2Sent(b, a, [
        ["레몬청을 담을 병의 수:", { o: ["4.2÷0.6", "4.2×0.6", "0.6÷4.2"], a: 0, why: { "1": "4.2 L를 0.6 L씩 몇 번 덜어 낼 수 있는지 알아봐요. 곱셈이 아니라 나눗셈이에요.", "2": "전체 레몬청 4.2 L를 한 병에 담는 0.6 L로 나누어요." } }, "→", { o: DV2S_TYPES, a: 0 }],
        ["건우의 비행기는 소율이 비행기의 몇 배 날았나요?", { o: ["7.56÷4.2", "4.2÷7.56", "7.56−4.2"], a: 0, why: { "1": "건우의 거리가 소율이 거리의 몇 배인지 구하니까 7.56을 4.2로 나누어요.", "2": "그것은 몇 m 더 날았는지 구하는 식이에요." } }, "→", { o: DV2S_TYPES, a: 0 }],
        ["초대장 종이를 접은 칸의 수:", { o: ["9÷1.5", "9×1.5", "1.5÷9"], a: 0 }, "→", { o: DV2S_TYPES, a: 1 }]],
        { ok: "4.2÷0.6, 7.56÷4.2는 (소수)÷(소수), 9÷1.5는 (자연수)÷(소수)예요. 이 단원에서 두 가지를 모두 배워요." }),
        { q: "레몬청을 담을 병의 수를 왜 4.2÷0.6으로 나타낼 수 있을까요?", ph: "4.2 L를 0.6 L씩 ~", help: ["① 전체 레몬청의 양과 한 병에 담는 양을 찾아요. → ② 같은 양씩 몇 번 덜어 낼 수 있는지 구하는 셈을 떠올려요.", "‘4.2 L를 0.6 L씩 ~ 수 있는지 알아보는 것이라서 ~으로 나타내요.’ 꼴로 써요."],
          ans: "4.2 L를 한 병에 0.6 L씩 몇 번 덜어 담을 수 있는지 알아보는 것이라서 나눗셈 4.2÷0.6으로 나타낼 수 있어요." }) },
    { name: "말해 보기 — 배운 내용 떠올리기", inst: "반올림, (소수)÷(자연수), (분수)÷(분수)를 떠올려 보세요.", hints: ["반올림은 구하려는 자리의 바로 아래 자리 숫자가 5이거나 5보다 크면 올리고, 5보다 작으면 버려요.", "84÷4=21이고, 8.4는 84의 [1/10]배예요.", "분모가 같은 분수의 나눗셈은 분자끼리 나누어요."],
      render: (b, a) => dv2Sent(b, a, [
        ["4.27을 반올림하여 소수 첫째 자리까지 나타내면", { n: "4.3", why: { "4.2": "소수 둘째 자리 숫자가 7이에요. 5이거나 5보다 크면 올려요." } }, "이에요."],
        ["5.5를 반올림하여 일의 자리까지 나타내면", { n: "6", why: { "5": "소수 첫째 자리 숫자가 5예요. 5이거나 5보다 크면 올려요." } }, "이에요."],
        ["8.4÷4 =", { n: "2.1", e: "8.4÷4", why: { "21": "84÷4=21이고, 8.4는 84의 [1/10]배이니 몫도 [1/10]배예요." } }],
        ["[5/8]÷[1/8] = 5÷1 =", { n: "5", e: "5÷1" }],
        ["[8/10]÷[2/10] = 8÷2 =", { n: "4", e: "8÷2" }]],
        { ok: "반올림, (소수)÷(자연수), 분모가 같은 (분수)÷(분수)를 잘 기억하고 있어요!" }) },
    { name: "약속하기 — 배울 차례 정하기", inst: "“(소수)÷(소수)의 계산은 (소수)÷(자연수)의 계산과 무엇이 같고 무엇이 다를까?” 이 단원에서 배울 내용을 배우는 차례대로 눌러 학습 계획을 세워 보세요.", hints: ["먼저 소수로 나누는 나눗셈을 배우고, 다음에 자연수를 소수로 나누는 나눗셈을 배워요.", "몫을 반올림하는 방법을 배운 뒤 나누어 주고 남는 양을 알아봐요."],
      render: (b, a) => sequence(b, a, ["㉠ 나누어 주고 남는 양 알아보기", "㉡ (자연수)÷(소수) 알아보기", "㉢ (소수)÷(소수) 알아보기", "㉣ 몫을 반올림하여 나타내기"], [2, 1, 3, 0],
        { ok: "(소수)÷(소수) → (자연수)÷(소수) → 몫을 반올림하여 나타내기 → 나누어 주고 남는 양 차례로 배워요." }) },
    { name: "확인하기 — 먼저 어림해요", inst: "정확하게 계산하기 전에 어림해 보세요. 축제 준비 쪽지의 답은 대략 얼마쯤일까요?", hints: ["0.6 L씩 5병이면 3 L, 10병이면 6 L예요.", "1.52 m는 1.5 m쯤이에요. 1.5 m씩 3번이면 4.5 m예요.", "7.56은 8쯤, 4.2는 4쯤이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "레몬청 4.2 L를 0.6 L씩 담으면 병은 약 몇 개가 필요할까요?", o: ["1병도 안 돼요", "약 7병", "약 70병"], a: 1, why: { "0": "0.6 L는 4.2 L보다 훨씬 적어요. 여러 병이 필요해요.", "2": "0.6 L씩 10병만 담아도 6 L예요. 70병은 너무 많아요." } },
        { q: "리본 끈 4.56 m로 1.52 m씩 묶으면 꽃다발은 약 몇 다발일까요?", o: ["약 0.3다발", "약 3다발", "약 30다발"], a: 1, why: { "0": "4.56 m 안에 1.52 m가 한 번도 안 들어갈까요? 여러 번 들어가요.", "2": "1.52 m씩 30다발이면 45 m가 넘어요." } },
        { q: "건우의 비행기가 난 거리는 소율이 비행기가 난 거리의 약 몇 배일까요?", o: ["약 0.2배", "약 2배", "약 20배"], a: 1, why: { "0": "건우의 비행기가 더 멀리 날았어요. 1배보다 커요.", "2": "4.2 m의 20배는 84 m예요. 너무 커요." } }],
        { ok: "어림해 보니 레몬청은 7병쯤, 꽃다발은 3다발쯤, 건우의 비행기는 2배쯤이에요. 정확한 값은 이 단원에서 계산해요." }) }
  ],
  challenge: { inst: "★ 도전 — 컵 쿠키 반죽 2.4 kg을 한 컵에 0.3 kg씩 나누어 담으려고 해요. 한 칸이 0.1 kg인 막대를 0.3 kg씩 묶어 컵 쿠키를 몇 개 만들 수 있는지 알아보세요.", hints: ["0.3 kg은 0.1 kg이 3칸이에요.", "묶지 않은 첫 칸부터 3칸씩 끌어서 묶어요.", "24칸을 3칸씩 묶으면 몇 묶음일까요?"],
    render: (b, a) => dv2Bars(b, a, { n: 24, per: 3, cell: "0.1", step: "0.3",
      asks: [
        ["0.3 kg씩 묶으면", { n: "8", s: 1 }, "묶음이므로 컵 쿠키를", { n: "8", s: 1 }, "개 만들 수 있어요."],
        ["식으로 나타내면 2.4÷0.3 =", { n: "8", e: "2.4÷0.3" }]],
      ok: "0.1이 24칸을 3칸씩 묶으면 8묶음이에요. 2.4÷0.3=8, 컵 쿠키 8개를 만들 수 있어요." }) }
},
{
  id: "s2", no: 2, title: "레몬청을 병에 담아요 ― (소수 한 자리 수)÷(소수 한 자리 수)", soop: "개념 구축하기(O)",
  question: "(소수 한 자리 수)÷(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "4.2는 0.1이 42개, 0.6은 0.1이 6개인 수이므로 4.2÷0.6=42÷6=7이에요. 나누어지는 수와 나누는 수를 각각 10배 하면 몫은 같아요. 세로셈에서는 두 수의 소수점을 오른쪽으로 한 자리씩 옮겨 자연수의 나눗셈처럼 계산하고, 분수의 나눗셈 [42/10]÷[6/10]=42÷6=7로도 계산할 수 있어요.",
  steps: [
    { name: "만져 보기 — 레몬청 4.2 L", inst: "서윤이와 도현이는 레몬에이드 가게에서 쓸 레몬청 4.2 L를 0.6 L들이 병에 나누어 담으려고 해요. 병은 몇 개 필요할까요? 먼저 규칙을 예상하고, 한 칸이 0.1 L인 막대를 0.6 L씩 묶어 보세요.", hints: ["0.6 L는 0.1 L가 6칸이에요. 6칸씩 묶어요.", "4.2 L는 0.1 L가 42칸이에요.", "42칸을 6칸씩 묶으면 몇 묶음일까요?"],
      render: ruleFirst((b, a) => dv2Bars(b, a, { n: 42, per: 6, cell: "0.1", step: "0.6",
        asks: [
          ["병의 수를 구하는 식은", { o: ["4.2÷0.6", "4.2×0.6", "0.6÷4.2"], a: 0 }],
          ["어림하기: 0.6 L씩 5병이면", { n: "3", e: "0.6×5" }, "L, 10병이면", { n: "6", e: "0.6×10" }, "L이므로 병의 수는", { o: ["5병과 10병 사이예요", "5병보다 적어요"], a: 0 }],
          ["4.2는 0.1이", { n: "42", s: 1 }, "개, 0.6은 0.1이", { n: "6", s: 1 }, "개인 수예요."],
          ["0.6씩", { n: "7", s: 1 }, "묶음이므로 병이", { n: "7", s: 1 }, "개 필요해요."]],
        ok: "4.2는 0.1이 42개, 0.6은 0.1이 6개라서 42÷6을 이용해 계산할 수 있어요. 병이 7개 필요해요." }),
        { q: "4.2÷0.6을 자연수의 나눗셈으로 바꾸어 계산할 수 있을까요?", ph: "내 규칙: 4.2는 0.1이 ~", help: ["① 4.2와 0.6이 각각 0.1이 몇 개인지 생각해요. → ② 0.1이 몇 개인지로 나누면 어떤 자연수의 나눗셈이 되는지 써요.", "‘내 규칙: 4.2는 0.1이 ~개, 0.6은 0.1이 ~개이니까 4.2÷0.6은 ~÷~과 같아요.’ 꼴로 써요."],
          ans: "4.2는 0.1이 42개, 0.6은 0.1이 6개예요. 0.1이 42개인 양을 0.1이 6개씩 덜어 내는 것이니까 4.2÷0.6은 42÷6과 몫이 같아서 7이에요." }) },
    { name: "그려 보기 — 소수점을 옮겨 42÷6으로", inst: "4.2÷0.6을 42÷6으로 바꾸어 계산해 봐요. 빨간 동그라미를 눌러 두 수의 소수점을 오른쪽으로 옮겨 두 수가 자연수가 되게 해 보세요.", hints: ["소수점을 오른쪽으로 한 자리 옮기면 10배가 돼요.", "두 수의 소수점을 같은 자리만큼 옮겨야 몫이 같아요.", "42÷6=7이에요."],
      render: thenWhy((b, a) => dv2Shift(b, a, { items: [{ a: "4.2", b: "0.6", both: true }],
        asks: [
          ["42÷6 =", { n: "7", e: "42÷6" }, "이므로 4.2÷0.6 =", { n: "7", e: "4.2÷0.6", why: { "0.7": "4.2÷0.6은 42÷6과 몫이 같아요. 검산: 0.6×0.7=0.42라서 4.2가 아니에요." } }],
          ["나누어지는 수와 나누는 수를 각각 10배 하면 몫은", { o: ["같아요", "10배가 돼요", "[1/10]배가 돼요"], a: 0 }],
          { fig: () => dv2RelFig([["8", "2", "4"], ["80", "20", "4"], ["800", "200", "4"]], "10배") },
          ["8÷2 = 80÷20 = 800÷200 =", { n: "4", e: "800÷200" }]],
        ok: "4.2와 0.6을 각각 10배 하면 42÷6이 돼요. 각각 10배 해도 몫은 같으니 4.2÷0.6=42÷6=7이에요." }),
        { q: "4.2와 0.6을 각각 10배 해도 몫이 같은 까닭은 무엇일까요?", ph: "두 수를 똑같이 ~", help: ["① 8÷2, 80÷20, 800÷200의 몫을 견주어 봐요. → ② 나누는 양과 덜어 내는 양이 함께 커지면 몇 번 덜어 내는지는 어떻게 되는지 생각해요.", "‘두 수를 똑같이 ~배 하면 ~이 몇 번 들어가는지는 ~.’ 꼴로 써요."],
          ans: "나누어지는 수와 나누는 수를 똑같이 10배 하면, 전체도 10배가 되고 한 번에 덜어 내는 양도 10배가 돼요. 그래서 몇 번 덜어 낼 수 있는지는 그대로라서 몫이 같아요." }) },
    { name: "말해 보기 — 세로셈과 분수의 나눗셈", inst: "4.2÷0.6을 세로셈으로 계산해 보세요. 두 수의 소수점이 한 자리씩 옮겨져 있어요. 그리고 분수의 나눗셈으로도 계산해 보세요.", hints: ["두 수의 소수점이 오른쪽으로 한 자리씩 옮겨졌어요. 6)42처럼 계산해요.", "4.2=[42/10], 0.6=[6/10]이에요.", "분모가 같은 분수의 나눗셈은 분자끼리 나누어요."],
      render: dv2LongStep({ probs: [{ a: "4.2", b: "0.6" }],
        rows: [
          { g: "분수의 나눗셈으로 계산하기", rows: [["4.2÷0.6 =", { f: ["42", "10"] }, "÷", { f: ["6", "10"] }, "= 42÷6 =", { n: "7", e: "42÷6" }]] },
          ["두 방법 모두 나누어지는 수와 나누는 수를", { o: ["자연수로 바꾸어", "그대로 두고"], a: 0 }, "계산했어요."]],
        ok: "세로셈은 두 수의 소수점을 한 자리씩 옮겨 6)42로, 분수의 나눗셈은 [42/10]÷[6/10]=42÷6으로 계산해요. 몫은 7이에요." }) },
    { name: "약속하기 — (소수 한 자리 수)÷(소수 한 자리 수)", inst: "(소수 한 자리 수)÷(소수 한 자리 수)를 계산하는 방법을 정리해 보세요.", hints: ["4.2÷0.6은 두 수를 각각 10배 한 42÷6으로 계산했어요.", "소수 한 자리 수는 분모가 10인 분수로 나타낼 수 있어요."],
      render: (b, a) => blanks(b, a, ["(소수 한 자리 수)÷(소수 한 자리 수)는 나누어지는 수와 나누는 수를 각각 ", { o: ["10배", "100배"], a: 0 }, " 하여 ", { o: ["자연수의 나눗셈", "소수의 덧셈"], a: 0 }, "과 같은 방법으로 계산하거나, 분모가 ", { o: ["10", "100"], a: 0 }, "인 분수의 나눗셈으로 나타내어 계산해요. 나누어지는 수와 나누는 수를 각각 10배 해도 몫은 ", { o: ["같아요", "달라져요"], a: 0 }, "."]) },
    { name: "확인하기 — 레몬에이드 가게 준비", inst: "레몬에이드 가게 준비물을 계산해 보세요. 레몬 5.6 kg을 0.7 kg씩 봉지에, 탄산수 8.4 L를 1.4 L씩 병에 나누어 담아요.", hints: ["0.7)5.6은 7)56처럼 계산해요.", "1.4)8.4는 14)84처럼 계산해요.", "25.2÷0.6은 252÷6, 13.6÷1.7은 136÷17과 몫이 같아요."],
      render: dv2LongStep({ probs: [{ a: "5.6", b: "0.7", cap: "레몬 5.6 ÷ 0.7" }, { a: "8.4", b: "1.4", cap: "탄산수 8.4 ÷ 1.4" }],
        rows: [["얼음 25.2 kg을 0.6 kg씩: 25.2÷0.6 =", { n: "42", e: "25.2÷0.6" }], ["설탕 13.6 kg을 1.7 kg씩: 13.6÷1.7 =", { n: "8", e: "13.6÷1.7" }]],
        ok: "5.6÷0.7=8, 8.4÷1.4=6, 25.2÷0.6=42, 13.6÷1.7=8이에요. 두 수를 각각 10배 해서 자연수의 나눗셈으로 계산했어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 물음에 답해 보세요.", hints: ["4.5와 0.9를 각각 10배 하면 45÷9예요.", "몫이 같으려면 나누어지는 수와 나누는 수를 똑같이 10배 해야 해요.", "봉지 수는 전체 무게를 한 봉지에 담는 무게로 나누어요."],
    render: (b, a) => dv2Sent(b, a, [
      ["4.5÷0.9: 두 수를 각각", { n: "10", s: 1 }, "배 하면 45÷9 =", { n: "5", e: "45÷9" }, "이므로 4.5÷0.9 =", { n: "5", e: "4.5÷0.9" }],
      ["19.2÷0.8과 몫이 같은 나눗셈은", { o: ["19.2÷8", "192÷8"], a: 1, why: { "0": "나누는 수만 10배 하면 몫이 달라져요. 두 수를 똑같이 10배 해야 해요." } }],
      ["7.2÷0.9 =", { n: "8", e: "7.2÷0.9" }, ", 11.7÷1.3 =", { n: "9", e: "11.7÷1.3" }, ", 9.1÷0.7 =", { n: "13", e: "9.1÷0.7" }],
      { q: "꽃 철사 52.5 cm를 한 송이에 3.5 cm씩 잘라 쓰면 몇 송이를 만들 수 있을까요?", p: ["52.5÷3.5 =", { n: "15", e: "52.5÷3.5" }, "(송이)"] },
      { q: "서윤이는 레몬 3.6 kg을 0.4 kg씩, 지아는 레몬 4.8 kg을 0.6 kg씩 봉지에 나누어 담았어요.", p: ["서윤", { n: "9", e: "3.6÷0.4", s: 1 }, "봉지, 지아", { n: "8", e: "4.8÷0.6", s: 1 }, "봉지 → 봉지가 더 많은 사람은", { o: ["서윤", "지아"], a: 0 }] }],
      { ok: "4.5÷0.9=5, 192÷8, 8·9·13, 15송이, 서윤이가 9봉지로 더 많아요. 잘했어요!" }) }
},
{
  id: "s3", no: 3, title: "꽃다발 리본을 잘라요 ― (소수 두 자리 수)÷(소수 두 자리 수)", soop: "개념 구축하기(O)",
  question: "(소수 두 자리 수)÷(소수 두 자리 수)는 어떻게 계산할까요?",
  summary: "4.56 m=456 cm, 1.52 m=152 cm이므로 4.56÷1.52=456÷152=3이에요. 나누어지는 수와 나누는 수를 각각 100배 하면 몫은 같아요. 세로셈에서는 두 수의 소수점을 오른쪽으로 두 자리씩 옮겨 계산하고, 분수의 나눗셈 [456/100]÷[152/100]=456÷152=3으로도 계산해요.",
  steps: [
    { name: "만져 보기 — 리본 끈 4.56 m", inst: "꽃다발 가게를 맡은 예린이와 하준이는 꽃다발 하나를 묶는 데 리본 끈 1.52 m를 써요. 리본 끈 4.56 m로 꽃다발을 몇 다발 묶을 수 있을까요? 먼저 규칙을 예상하고, 수직선에서 1.52 m씩 뛰어 세어 보세요. 아래 수직선은 같은 길이를 cm로 나타낸 것이에요.", hints: ["1.52 m씩 뛰면 1.52, 3.04, 4.56이에요.", "1 m=100 cm예요. 4.56 m=456 cm예요.", "1.5 m씩 3번이면 4.5 m예요."],
      render: ruleFirst((b, a) => dv2Line(b, a, { to: "4.56", step: "1.52", max: "5", tick: "1", unit: "m", sub: { k: 100, unit: "cm" },
        asks: [
          ["묶을 수 있는 꽃다발의 수를 구하는 식은", { o: ["4.56÷1.52", "4.56×1.52", "1.52÷4.56"], a: 0 }],
          ["어림하기: 1.52 m를 1.5 m로 보면 1.5×3 =", { n: "4.5", e: "1.5×3" }, "이므로 약", { n: "3", s: 1 }, "다발쯤이에요."],
          ["4.56 m =", { n: "456" }, "cm, 1.52 m =", { n: "152" }, "cm이므로 4.56÷1.52 = 456÷152 =", { n: "3", e: "456÷152" }],
          ["꽃다발을", { n: "3", s: 1 }, "다발 묶을 수 있어요."]],
        ok: "m를 cm로 바꾸어도 몫은 같아요. 4.56÷1.52=456÷152=3, 꽃다발을 3다발 묶을 수 있어요." }),
        { q: "m를 cm로 바꾸어 나누면 몫은 어떻게 될까요?", ph: "내 규칙: 4.56 m는 ~ cm라서 ~", help: ["① 4.56 m와 1.52 m를 각각 cm로 바꾸어 봐요. → ② 단위를 바꾸어도 꽃다발 수가 달라지는지 생각해요.", "‘내 규칙: m를 cm로 바꾸면 두 수가 모두 ~배가 되니까 몫은 ~.’ 꼴로 써요."],
          ans: "4.56 m=456 cm, 1.52 m=152 cm라서 4.56÷1.52=456÷152=3이에요. 두 수를 똑같이 100배 한 것이라 몫은 같아요." }) },
    { name: "그려 보기 — 소수점을 두 자리씩", inst: "4.56÷1.52를 456÷152로 바꾸어 계산해 봐요. 두 수의 소수점을 옮겨 두 수가 모두 자연수가 되게 해 보세요.", hints: ["소수 두 자리 수는 소수점을 오른쪽으로 두 자리 옮기면 자연수가 돼요.", "소수점을 두 자리 옮기면 100배예요.", "456÷152=3이에요."],
      render: thenWhy((b, a) => dv2Shift(b, a, { items: [{ a: "4.56", b: "1.52", both: true }],
        asks: [
          ["456÷152 =", { n: "3", e: "456÷152" }, "이므로 4.56÷1.52 =", { n: "3", e: "4.56÷1.52" }],
          ["나누어지는 수와 나누는 수를 각각 100배 하면 몫은", { o: ["같아요", "100배가 돼요"], a: 0 }],
          { fig: () => dv2RelFig([["6", "2", "3"], ["600", "200", "3"], ["60000", "20000", "3"]], "100배") },
          ["6÷2 = 600÷200 = 60000÷20000 =", { n: "3", e: "60000÷20000" }]],
        ok: "4.56과 1.52를 각각 100배 하면 456÷152가 돼요. 몫은 같으니 4.56÷1.52=3이에요." }),
        { q: "4.56÷1.52에서 왜 소수점을 한 자리가 아니라 두 자리씩 옮겼을까요?", ph: "두 수가 모두 소수 두 자리 수라서 ~", help: ["① 소수점을 한 자리씩 옮기면 45.6÷15.2가 돼요. 아직 자연수인가요? → ② 두 수가 자연수가 되려면 몇 자리씩 옮겨야 하는지 써요.", "‘두 수가 ~ 수라서 ~자리씩 옮겨야 자연수가 되고, 그래도 몫은 ~.’ 꼴로 써요."],
          ans: "4.56과 1.52는 모두 소수 두 자리 수라서 한 자리씩 옮기면 45.6÷15.2처럼 아직 소수예요. 두 자리씩 옮겨(각각 100배) 456÷152로 만들어야 자연수의 나눗셈이 되고, 몫은 그대로 3이에요." }) },
    { name: "말해 보기 — 세로셈과 분수의 나눗셈", inst: "4.56÷1.52를 세로셈과 분수의 나눗셈으로 계산해 보세요. 두 수의 소수점이 두 자리씩 옮겨져 있어요.", hints: ["152)456처럼 계산해요.", "152×3=456이에요.", "4.56=[456/100], 1.52=[152/100]이에요."],
      render: dv2LongStep({ probs: [{ a: "4.56", b: "1.52" }],
        rows: [{ g: "분수의 나눗셈으로 계산하기", rows: [["4.56÷1.52 =", { f: ["456", "100"] }, "÷", { f: ["152", "100"] }, "= 456÷152 =", { n: "3", e: "456÷152" }]] },
          ["몫 3은", { o: ["자연수예요", "소수 두 자리 수예요"], a: 0, why: { "1": "두 수를 똑같이 100배 해도 몫은 그대로예요. 456÷152=3이니 몫도 3이에요." } }]],
        ok: "두 수를 각각 100배 하여 자연수의 나눗셈으로, 또는 분모가 100인 분수의 나눗셈으로 계산해요. 몫은 3이에요." }) },
    { name: "약속하기 — (소수 두 자리 수)÷(소수 두 자리 수)", inst: "(소수 두 자리 수)÷(소수 두 자리 수)를 계산하는 방법을 정리해 보세요.", hints: ["4.56÷1.52는 두 수를 각각 100배 한 456÷152로 계산했어요.", "소수 두 자리 수는 분모가 100인 분수로 나타낼 수 있어요."],
      render: (b, a) => blanks(b, a, ["(소수 두 자리 수)÷(소수 두 자리 수)는 나누어지는 수와 나누는 수를 각각 ", { o: ["100배", "10배"], a: 0 }, " 하여 자연수의 나눗셈과 같은 방법으로 계산하거나, 분모가 ", { o: ["100", "10"], a: 0 }, "인 분수의 나눗셈으로 나타내어 계산해요. 두 수를 똑같이 자연수로 만들어도 몫은 ", { o: ["변하지 않아요", "커져요"], a: 0 }, "."]) },
    { name: "확인하기 — 꽃다발 가게 준비", inst: "꽃다발 가게 준비물을 계산해 보세요. 포장지 2.38 m를 0.34 m씩, 철사 17.28 m를 1.44 m씩 잘라요.", hints: ["0.34)2.38은 34)238처럼 계산해요.", "1.44)17.28은 144)1728처럼 계산해요.", "6.75÷0.45=675÷45, 32.76÷1.26=3276÷126이에요."],
      render: dv2LongStep({ probs: [{ a: "2.38", b: "0.34", cap: "포장지 2.38 ÷ 0.34" }, { a: "17.28", b: "1.44", cap: "철사 17.28 ÷ 1.44" }],
        rows: [["6.75÷0.45 =", { n: "15", e: "6.75÷0.45" }], ["32.76÷1.26 =", { n: "26", e: "32.76÷1.26" }]],
        ok: "2.38÷0.34=7, 17.28÷1.44=12, 6.75÷0.45=15, 32.76÷1.26=26이에요. 몫의 소수점을 나누어지는 수 그대로 찍지 않았어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 물음에 답해 보세요.", hints: ["0.96과 0.12를 각각 100배 하면 96÷12예요.", "곱셈으로 검산해 봐요. 1.54×8은 13.86이 될까요?", "4.56÷0.57의 몫보다 작은 자연수를 세어요."],
    render: (b, a) => dv2Sent(b, a, [
      ["0.96÷0.12: 각각", { n: "100", s: 1 }, "배 하면 96÷12 =", { n: "8", e: "96÷12" }, "→ 0.96÷0.12 =", { n: "8", e: "0.96÷0.12" }],
      ["4.32÷0.36 =", { n: "12", e: "4.32÷0.36" }, ", 13.44÷1.92 =", { n: "7", e: "13.44÷1.92" }, ", 5.25÷0.75 =", { n: "7", e: "5.25÷0.75" }],
      ["잘못 계산한 것은", { o: ["㉠ 2.88÷0.48=6", "㉡ 19.68÷1.64=12", "㉢ 13.86÷1.54=8"], a: 2, why: { "0": "검산: 0.48×6=2.88이므로 옳아요.", "1": "검산: 1.64×12=19.68이므로 옳아요." } }, "이고, 옳은 몫은", { n: "9", e: "13.86÷1.54" }, "이에요."],
      { q: "레몬청 8.75 L를 한 통에 1.25 L씩 나누어 담으면 몇 통이 될까요?", p: ["8.75÷1.25 =", { n: "7", e: "8.75÷1.25" }, "(통)"] },
      ["4.56÷0.57 > □ 에서 □ 안에 들어갈 수 있는 자연수는 모두", { n: "7", s: 1, why: { "8": "4.56÷0.57=8이에요. 8보다 작은 자연수만 세어요." } }, "개예요."]],
      { ok: "0.96÷0.12=8, 12·7·7, 잘못 계산한 것은 ㉢(옳은 몫 9), 레몬청 7통, 자연수 1~7의 7개예요!" }) }
},
{
  id: "s4", no: 4, title: "종이비행기 날리기 부스 ― (소수 두 자리 수)÷(소수 한 자리 수)", soop: "개념 구축하기(O)",
  question: "(소수 두 자리 수)÷(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "7.56÷4.2는 두 수를 각각 100배 한 756÷420으로 계산하거나, 나누는 수가 자연수가 되도록 각각 10배 한 75.6÷42로 계산해요. 몫은 1.8이에요. 몫의 소수점은 옮긴 나누어지는 수의 소수점 위치에 맞추어 찍어요. 분수의 나눗셈 [756/100]÷[420/100]=756÷420=1.8로도 계산할 수 있어요.",
  steps: [
    { name: "만져 보기 — 몇 배 날았을까", inst: "종이비행기 멀리 날리기 부스에서 건우의 비행기는 7.56 m, 소율이의 비행기는 4.2 m를 날았어요. 건우의 비행기가 난 거리는 소율이 비행기가 난 거리의 몇 배일까요? 먼저 예상하고, 두 수의 소수점을 옮겨 두 수가 모두 자연수가 되게 해 보세요.", hints: ["몇 배인지 구할 때는 나눗셈을 해요.", "7.56은 소수 두 자리 수예요. 두 수 모두 자연수가 되려면 소수점을 두 자리씩 옮겨요.", "4.2를 100배 하면 420이에요(흐린 0)."],
      render: ruleFirst((b, a) => dv2Shift(b, a, { items: [{ a: "7.56", b: "4.2", both: true }],
        fig: () => dv2sPlaneFig([["7.56", "건우", DV2C.red], ["4.2", "소율", DV2C.blue]]),
        asks: [
          ["몇 배인지 구하는 식은", { o: ["7.56÷4.2", "4.2÷7.56", "7.56−4.2"], a: 0 }],
          ["어림하기: 7.56을 8로, 4.2를 4로 어림하면 8÷4 =", { n: "2", s: 1 }, "이므로", { n: "2", s: 1 }, "배쯤이에요."],
          ["두 수를 각각", { n: "100", s: 1 }, "배 하면 756÷420과 몫이 같아요."]],
        ok: "7.56과 4.2를 각각 100배 하면 756÷420이에요. 자연수의 나눗셈을 이용해 계산할 수 있어요." }),
        { q: "7.56÷4.2를 자연수의 나눗셈으로 바꾸려면 두 수를 각각 몇 배 해야 할까요?", ph: "내 규칙: 7.56은 소수 ~ 자리 수라서 ~", help: ["① 두 수 가운데 소수점 아래 자리가 더 많은 수를 찾아요. → ② 그 수가 자연수가 되려면 몇 배 해야 하는지 생각해요.", "‘내 규칙: ~이 소수 ~ 자리 수라서 두 수를 각각 ~배 해야 해요.’ 꼴로 써요."],
          ans: "7.56이 소수 두 자리 수라서 두 수를 각각 100배 해야 해요. 그러면 756÷420이 되고 몫은 7.56÷4.2와 같아요." }) },
    { name: "그려 보기 — 756÷420을 세로셈으로", inst: "756÷420을 세로셈으로 계산해 보세요. 756÷420의 몫 1을 쓰고, 756=756.0이므로 그에 맞추어 소수점을 찍은 뒤 0을 내려요. 0.1의 개수인 3360을 420으로 나눈 몫을 써요.", hints: ["420×1=420, 756−420=336이에요.", "756=756.0이에요. 흐린 0을 내려 3360을 420으로 나누어요.", "420×8=3360이에요. 몫은 1.8이에요."],
      render: dv2LongStep({ probs: [{ a: "7.56", b: "4.2", shift: 2 }],
        rows: [
          ["건우의 비행기가 난 거리는 소율이 비행기가 난 거리의", { n: "1.8", e: "7.56÷4.2" }, "배예요."],
          ["어림한 2배와", { o: ["비슷해요", "많이 달라요"], a: 0 }]],
        ok: "756÷420=1.8이므로 7.56÷4.2=1.8이에요. 1.8배는 어림한 2배와 비슷해요." }) },
    { name: "말해 보기 — 나누는 수만 자연수로", inst: "7.56÷4.2를 계산하는 다른 방법을 알아봐요. 이번에는 나누는 수가 자연수가 되도록 두 수에 각각 10씩 곱했어요(75.6÷42). 75를 42로 나눈 몫 1을 쓰고, 75.6의 소수점에 맞추어 몫의 소수점을 찍어요.", hints: ["42)75.6처럼 계산해요. 75를 42로 나눈 몫은 1이에요.", "몫의 소수점은 75.6의 소수점 위치에 맞추어 찍어요.", "7.56=[756/100], 4.2=[420/100]이에요."],
      render: thenWhy((b, a) => dv2Long(b, a, { probs: [{ a: "7.56", b: "4.2", shift: 1 }],
        rows: [
          { g: "분수의 나눗셈으로 계산하기", rows: [["7.56÷4.2 =", { f: ["756", "100"] }, "÷", { f: ["420", "100"], why: { "42/10": "두 분수의 분모를 같게 해요. 4.2=4.20=[420/100]이에요." } }, "= 756÷420 =", { n: "1.8", e: "756÷420" }]] },
          ["75.6÷42의 몫의 소수점은", { o: ["옮긴 75.6의 소수점 위치에 맞추어 찍어요", "7.56의 처음 소수점 위치에 맞추어 찍어요"], a: 0 }]],
        ok: "각각 10배 하면 75.6÷42=1.8, 각각 100배 하면 756÷420=1.8, 분수의 나눗셈으로도 1.8이에요. 편리한 방법을 골라 계산해요." }),
        { q: "75.6÷42에서 몫의 소수점을 75.6의 소수점에 맞추어 찍는 까닭은 무엇일까요?", ph: "75.6÷42는 (소수)÷(자연수)라서 ~", help: ["① 75.6÷42는 6학년 1학기에 배운 (소수)÷(자연수)예요. → ② (소수)÷(자연수)에서 몫의 소수점을 어디에 찍었는지 떠올려요.", "‘75.6÷42는 ~이라서 몫의 소수점을 ~에 맞추어 찍어요. 그래서 몫은 ~이에요.’ 꼴로 써요."],
          ans: "두 수를 각각 10배 하면 75.6÷42라는 (소수)÷(자연수)가 되고, 몫은 7.56÷4.2와 같아요. (소수)÷(자연수)는 몫의 소수점을 나누어지는 수 75.6의 소수점에 맞추어 찍으므로 몫은 1.8이에요." }) },
    { name: "약속하기 — (소수 두 자리 수)÷(소수 한 자리 수)", inst: "(소수 두 자리 수)÷(소수 한 자리 수)를 계산하는 방법을 정리해 보세요.", hints: ["7.56÷4.2는 각각 10배 하면 75.6÷42, 각각 100배 하면 756÷420이에요.", "몫의 소수점은 옮긴 소수점 위치에 맞추어 찍어요."],
      render: (b, a) => blanks(b, a, ["(소수 두 자리 수)÷(소수 한 자리 수)는 나누는 수가 자연수가 되도록 두 수를 각각 ", { o: ["10배", "100배"], a: 0 }, " 하여 (소수)÷(자연수)로 계산하거나, 두 수를 각각 ", { o: ["100배", "10배"], a: 0 }, " 하여 자연수의 나눗셈으로 계산해요. 몫의 소수점은 ", { o: ["옮긴", "처음"], a: 0 }, " 소수점 위치에 맞추어 찍어요."]) },
    { name: "확인하기 — 부스 기록 견주기", inst: "종이비행기 부스에서 나온 나눗셈을 계산해 보세요. 몫의 소수점 위치에 조심해요.", hints: ["1.6)9.12는 16)91.2처럼, 0.6)3.84는 6)38.4처럼 계산해요.", "몫의 소수점은 91.2, 38.4의 소수점 위치에 맞추어 찍어요.", "6.46÷1.9=64.6÷19, 8.64÷2.7=86.4÷27이에요."],
      render: dv2LongStep({ probs: [{ a: "9.12", b: "1.6" }, { a: "3.84", b: "0.6" }],
        rows: [["6.46÷1.9 =", { n: "3.4", e: "6.46÷1.9" }], ["8.64÷2.7 =", { n: "3.2", e: "8.64÷2.7" }]],
        ok: "9.12÷1.6=5.7, 3.84÷0.6=6.4, 6.46÷1.9=3.4, 8.64÷2.7=3.2예요. 몫의 소수점을 바르게 찍었어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 물음에 답해 보세요.", hints: ["가장 큰 수는 16.32, 가장 작은 수는 4.8이에요.", "6.12÷3.6과 5.76÷3.2를 각각 계산해 견주어요.", "어떤 수로 나누었더니 0.8이 되었다면, 어떤 수는 3.36÷0.8이에요."],
    render: (b, a) => dv2Sent(b, a, [
      ["5.22÷1.8 =", { n: "2.9", e: "5.22÷1.8" }, ", 7.98÷2.1 =", { n: "3.8", e: "7.98÷2.1" }],
      ["16.32, 6.4, 4.8 중 가장 큰 수를 가장 작은 수로 나눈 몫은", { n: "3.4", e: "16.32÷4.8" }, "이에요."],
      ["몫이 2.6인 것은", { o: ["㉠ 4.68÷1.8", "㉡ 3.75÷1.5", "㉢ 7.84÷2.8"], a: 0, why: { "1": "3.75÷1.5=2.5예요.", "2": "7.84÷2.8=2.8이에요." } }],
      ["6.12÷3.6", { o: [">", "=", "<"], a: 2, why: { "0": "6.12÷3.6=1.7, 5.76÷3.2=1.8이에요.", "1": "6.12÷3.6=1.7, 5.76÷3.2=1.8이에요." } }, "5.76÷3.2"],
      { q: "도현이의 비행기는 5.13 m, 지아의 비행기는 2.7 m를 날았어요. 도현이의 비행기가 난 거리는 지아 비행기가 난 거리의 몇 배일까요?", p: ["5.13÷2.7 =", { n: "1.9", e: "5.13÷2.7" }, "(배)"] },
      ["3.36을 어떤 수로 나누었더니 0.8이 되었어요. 어떤 수는", { n: "4.2", e: "3.36÷0.8" }, "예요."]],
      { ok: "2.9, 3.8, 3.4, ㉠, 1.7<1.8, 1.9배, 어떤 수 4.2예요. 잘했어요!" }) }
},
{
  id: "s5", no: 5, title: "초대장을 접어요 ― (자연수)÷(소수)", soop: "개념 구축하기(O)",
  question: "(자연수)÷(소수)는 어떻게 계산할까요?",
  summary: "9 cm=90 mm, 1.5 cm=15 mm이므로 9÷1.5=90÷15=6이에요. (자연수)÷(소수)는 나누는 수가 자연수가 되도록 두 수를 각각 10배 또는 각각 100배 하여 계산해요. 6÷0.75는 6을 6.00으로 생각하고 소수점을 두 자리씩 옮겨 600÷75=8로 계산하거나, [600/100]÷[75/100]=600÷75=8로 계산해요.",
  steps: [
    { name: "만져 보기 — 병풍 초대장", inst: "지아는 길이가 9 cm인 종이를 한 칸이 1.5 cm가 되도록 병풍처럼 접어 축제 초대장을 만들려고 해요. 종이를 몇 칸으로 접을 수 있을까요? 먼저 예상하고, 종이를 눌러 접는 선을 놓아 보세요.", hints: ["자의 눈금을 보고 1.5 cm마다 접는 선을 놓아요.", "접는 선은 1.5 cm, 3 cm, 4.5 cm, 6 cm, 7.5 cm에 놓여요.", "9 cm=90 mm, 1.5 cm=15 mm예요."],
      render: ruleFirst((b, a) => dv2Fold(b, a, { len: "9", part: "1.5", snap: "0.5", unit: "cm",
        asks: [
          ["몇 칸으로 접을 수 있는지 구하는 식은", { o: ["9÷1.5", "9×1.5", "1.5÷9"], a: 0 }],
          ["어림하기: 한 칸이 1 cm이면 9칸, 2 cm이면", { n: "4.5", e: "9÷2" }, "칸이므로, 1.5 cm이면 칸의 수는", { o: ["4.5칸과 9칸 사이예요", "9칸보다 많아요"], a: 0 }],
          ["9 cm =", { n: "90" }, "mm, 1.5 cm =", { n: "15" }, "mm이므로 90÷15 =", { n: "6", e: "90÷15" }, "→ 9÷1.5 =", { n: "6", e: "9÷1.5" }],
          ["종이를", { n: "6", s: 1 }, "칸으로 접을 수 있어요."]],
        ok: "9÷1.5와 90÷15는 두 수를 각각 10배 한 것이라 몫이 같아요. 종이를 6칸으로 접을 수 있어요." }),
        { q: "(자연수)÷(소수)도 두 수를 각각 10배 해서 계산할 수 있을까요?", ph: "내 규칙: 9÷1.5를 ~", help: ["① 9 cm와 1.5 cm를 mm로 바꾸면 각각 몇 배가 되는지 생각해요. → ② 나누어지는 수가 자연수여도 같은 원리가 되는지 써요.", "‘내 규칙: 두 수를 각각 ~배 하면 ~÷~이 되고 몫은 ~.’ 꼴로 써요."],
          ans: "9÷1.5에서 두 수를 각각 10배 하면 90÷15가 되고 몫 6은 같아요. 나누어지는 수가 자연수여도 나누는 수가 자연수가 되도록 두 수를 똑같이 10배 하면 계산할 수 있어요." }) },
    { name: "그려 보기 — 6을 6.00으로", inst: "초대장을 묶을 끈 6 m를 0.75 m씩 잘라요. 6÷0.75를 계산해 봐요. 나누어지는 수 6은 6.00처럼 소수점 아래에 0이 있다고 생각할 수 있어요(흐린 0). 두 수의 소수점을 옮겨 두 수가 자연수가 되게 해 보세요.", hints: ["0.75가 자연수가 되려면 소수점을 두 자리 옮겨요.", "6도 소수점을 두 자리 옮기면 600이에요.", "600÷75=8이에요."],
      render: thenWhy((b, a) => dv2Shift(b, a, { items: [{ a: "6", b: "0.75", both: true }],
        asks: [
          ["600÷75 =", { n: "8", e: "600÷75" }, "이므로 6÷0.75 =", { n: "8", e: "6÷0.75", why: { "0.08": "6÷0.75는 600÷75와 몫이 같아요. 검산: 0.75×0.08=0.06이에요." } }],
          ["나누는 수 0.75가 자연수가 되도록 두 수를 각각", { o: ["100배", "10배"], a: 0 }, "했어요."]],
        ok: "6을 6.00으로 생각하고 두 수를 각각 100배 하면 600÷75=8이에요. 끈을 8도막으로 자를 수 있어요." }),
        { q: "6÷0.75에서 6을 왜 600으로 바꾸었을까요?", ph: "0.75를 100배 했으니까 ~", help: ["① 나누는 수 0.75를 자연수로 만들려면 몇 배 해야 하는지 생각해요. → ② 몫이 같으려면 나누어지는 수 6도 어떻게 해야 하는지 써요.", "‘0.75를 ~배 하여 ~로 만들었으니 6도 똑같이 ~배 한 ~으로 바꾸어야 몫이 같아요.’ 꼴로 써요."],
          ans: "나누는 수 0.75를 자연수 75로 만들려고 100배 했으니, 몫이 같으려면 나누어지는 수 6도 똑같이 100배 해서 600으로 바꾸어야 해요. 그래서 6÷0.75=600÷75=8이에요." }) },
    { name: "말해 보기 — 세로셈과 0.1의 개수", inst: "6÷0.75를 세로셈과 분수의 나눗셈으로 계산해 보세요. 그리고 9÷1.5를 0.1의 개수로도 생각해 보세요.", hints: ["6 뒤에 소수점이 있다고 생각하고 0을 두 개 붙여 600으로 만들었어요.", "75×8=600이에요.", "9는 0.1이 90개, 1.5는 0.1이 15개예요."],
      render: dv2LongStep({ probs: [{ a: "6", b: "0.75" }],
        rows: [
          { g: "분수의 나눗셈으로 계산하기", rows: [["6÷0.75 =", { f: ["600", "100"], why: { "6/1": "0.75=[75/100]과 분모를 같게 해요. 6=[600/100]이에요." } }, "÷", { f: ["75", "100"] }, "= 600÷75 =", { n: "8", e: "600÷75" }]] },
          { g: "0.1의 개수로 생각하기: 9÷1.5", rows: [["9는 0.1이", { n: "90", s: 1 }, "개, 1.5는 0.1이", { n: "15", s: 1 }, "개이므로 9÷1.5 = 90÷15 =", { n: "6", e: "9÷1.5" }]] }],
        ok: "6÷0.75=600÷75=8이에요. 9÷1.5는 0.1이 90개인 수를 0.1이 15개인 수로 나누는 것과 같아서 90÷15=6이에요." }) },
    { name: "약속하기 — (자연수)÷(소수)", inst: "(자연수)÷(소수)를 계산하는 방법을 정리해 보세요.", hints: ["9÷1.5는 각각 10배, 6÷0.75는 각각 100배 했어요.", "6은 6.00으로 생각했어요."],
      render: (b, a) => blanks(b, a, ["(자연수)÷(소수)는 나누는 수가 ", { o: ["자연수", "소수"], a: 0 }, "가 되도록 나누어지는 수와 나누는 수를 각각 10배 또는 각각 100배 하여 자연수의 나눗셈과 같은 방법으로 계산해요. 나누어지는 수가 자연수이면 소수점 아래에 ", { o: ["0", "1"], a: 0 }, "이 있다고 생각하고 소수점을 옮겨요. 분모가 10 또는 100인 ", { o: ["분수의 나눗셈", "분수의 덧셈"], a: 0 }, "으로 나타내어 계산할 수도 있어요."]) },
    { name: "확인하기 — 초대장 만들기 재료", inst: "초대장 만들기 재료를 계산해 보세요. 색 띠 42 m를 0.6 m씩, 은박 테이프 33 m를 1.32 m씩 잘라요.", hints: ["0.6)42는 6)420처럼 계산해요.", "1.32)33은 132)3300처럼 계산해요.", "84÷2.4=840÷24, 72÷0.48=7200÷48이에요."],
      render: dv2LongStep({ probs: [{ a: "42", b: "0.6", cap: "색 띠 42 ÷ 0.6" }, { a: "33", b: "1.32", cap: "은박 테이프 33 ÷ 1.32" }],
        rows: [["84÷2.4 =", { n: "35", e: "84÷2.4" }], ["72÷0.48 =", { n: "150", e: "72÷0.48" }]],
        ok: "42÷0.6=70, 33÷1.32=25, 84÷2.4=35, 72÷0.48=150이에요. 자연수 뒤에 0을 붙여 소수점을 옮겼어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 물음에 답해 보세요.", hints: ["56÷1.4는 560÷14와 몫이 같아요.", "화분 사이의 간격 수를 먼저 구해요.", "처음과 끝에도 화분을 놓으면 화분은 간격 수보다 1개 많아요."],
    render: (b, a) => dv2Sent(b, a, [
      ["48÷3.2: 각각", { n: "10", s: 1 }, "배 하면 480÷32 =", { n: "15", e: "480÷32" }, "→ 48÷3.2 =", { n: "15", e: "48÷3.2" }],
      ["12÷1.5 =", { n: "8", e: "12÷1.5" }, ", 21÷1.75 =", { n: "12", e: "21÷1.75" }, ", 27÷5.4 =", { n: "5", e: "27÷5.4" }, ", 93÷1.86 =", { n: "50", e: "93÷1.86" }],
      ["39÷6.5와 18÷0.72의 몫의 합은", { n: "31", e: "39÷6.5+18÷0.72" }, "이에요."],
      ["56÷1.4의 몫을 4라고 쓴 친구가 있어요. 잘못된 까닭은", { o: ["몫의 끝자리 0을 빠뜨렸어요", "나누는 수를 잘못 썼어요"], a: 0, why: { "1": "나누는 수는 맞게 썼어요. 검산: 1.4×4=5.6이라 56이 아니에요." } }, "이고, 옳은 몫은", { n: "40", e: "56÷1.4" }, "이에요."],
      { q: "길이가 93 m인 복도 한쪽에 1.55 m 간격으로 축제 화분을 놓으려고 해요. 복도의 처음과 끝에도 놓는다면 화분은 몇 개 필요할까요?", p: ["간격 수: 93÷1.55 =", { n: "60", e: "93÷1.55" }, "→ 화분:", { n: "61", e: "60+1", why: { "60": "처음과 끝에도 놓으면 화분은 간격 수보다 1개 많아요." } }, "개"] }],
      { ok: "15, 8·12·5·50, 합 31, 옳은 몫 40, 화분 61개예요. 잘했어요!" }) }
},
{
  id: "s6", no: 6, title: "몇 배쯤 빠를까 ― 몫을 반올림하여 나타내기", soop: "개념 구축하기(O)",
  question: "나눗셈의 몫이 나누어떨어지지 않을 때 몫을 어떻게 나타낼까요?",
  summary: "11÷6=1.833…처럼 몫이 간단한 소수로 구해지지 않을 때는 몫을 반올림하여 나타내요. 일의 자리까지 나타내려면 소수 첫째 자리 숫자를, 소수 첫째 자리까지 나타내려면 소수 둘째 자리 숫자를 보아요. 11÷6의 몫은 약 2, 약 1.8이에요. 2.5÷0.7=3.571…은 약 4, 약 3.6, 약 3.57로 나타내요.",
  steps: [
    { name: "만져 보기 — 레모네이드 만드는 시간", inst: "축제 전날 연습에서 레모네이드 한 통을 만드는 데 서윤이네 모둠은 11분, 도현이네 모둠은 6분이 걸렸어요. 서윤이네가 걸린 시간은 도현이네가 걸린 시간의 약 몇 배일까요? 11÷6을 세로셈으로 소수 셋째 자리까지 계산해 보세요. (계산기로 확인해도 돼요.)", hints: ["6)11에서 몫 1을 쓰고 11=11.000으로 생각해 0을 내려요.", "50÷6, 20÷6, 20÷6 … 몫에 3이 계속 나와요.", "몫은 1.833…이에요."],
      render: dv2LongStep({ probs: [{ a: "11", b: "6", mode: "tr", places: 3 }], tip: "11 뒤의 흐린 0을 하나씩 내리며 계속 나누어요. 몫을 맨 위 칸에 쓰고 소수점을 찍어요.",
        rows: [
          ["11÷6의 몫은 같은 숫자 3이", { o: ["끝없이 되풀이돼요", "곧 나누어떨어져요"], a: 0 }],
          ["몫이 간단한 소수로 구해지지 않을 때는 몫을", { o: ["반올림하여", "끝까지 모두 써서"], a: 0 }, "나타낼 수 있어요."]],
        ok: "11÷6=1.833…처럼 나누어떨어지지 않아요. 이럴 때는 몫을 올림, 버림, 반올림하여 나타낼 수 있어요." }) },
    { name: "그려 보기 — 확인할 숫자 찾기", inst: "11÷6의 몫 1.833…을 반올림하여 나타내 보세요. 몫에서 확인할 숫자를 누르고 답을 써요.", hints: ["일의 자리까지 나타내려면 소수 첫째 자리 숫자를 봐요.", "소수 첫째 자리까지 나타내려면 소수 둘째 자리 숫자를 봐요.", "8은 5보다 크니 올리고, 3은 5보다 작으니 버려요."],
      render: thenWhy((b, a) => dv2Round(b, a, { items: [{ e: "11÷6", to: 0 }, { e: "11÷6", to: 1 }],
        asks: [["서윤이네가 걸린 시간은 도현이네가 걸린 시간의 약", { n: "2", r: ["11÷6", 0] }, "배, 소수 첫째 자리까지 나타내면 약", { n: "1.8", r: ["11÷6", 1] }, "배예요."]],
        ok: "일의 자리까지 약 2배, 소수 첫째 자리까지 약 1.8배예요. 나타낼 자리의 바로 아래 자리 숫자를 보고 반올림했어요." }),
        { q: "소수 첫째 자리까지 나타낼 때 왜 소수 둘째 자리 숫자를 볼까요?", ph: "소수 둘째 자리 숫자가 ~", help: ["① 1.833…을 소수 첫째 자리까지 나타내면 1.8과 1.9 중 어느 쪽에 더 가까운지 생각해요. → ② 그것을 알려 주는 숫자가 어느 자리 숫자인지 써요.", "‘소수 첫째 자리까지 나타내려면 바로 아래 자리인 ~ 숫자를 보고, 그 숫자가 ~이면 ~.’ 꼴로 써요."],
          ans: "1.833…이 1.8과 1.9 중 어느 쪽에 더 가까운지는 바로 아래 자리인 소수 둘째 자리 숫자가 알려 줘요. 그 숫자 3이 5보다 작으니 버려서 약 1.8이에요." }) },
    { name: "말해 보기 — 2.5÷0.7을 여러 자리로", inst: "레몬청 2.5 L는 한 번에 쓰는 0.7 L의 약 몇 배일까요? 2.5÷0.7을 세로셈으로 계산하고 몫을 반올림하여 나타내 보세요. 어느 자리까지 나타내느냐에 따라 확인할 숫자의 자리가 달라져요.", hints: ["7)25처럼 계산하고 0을 내려 계속 나누어요. 몫은 3.571…이에요.", "일의 자리까지: 소수 첫째 자리 숫자 5를 보고 올려요.", "소수 둘째 자리까지: 소수 셋째 자리 숫자 1을 보고 버려요."],
      render: dv2LongStep({ probs: [{ a: "2.5", b: "0.7", mode: "tr", places: 3 }],
        rows: [
          ["일의 자리까지:", { n: "4", r: ["2.5÷0.7", 0], why: { "3": "소수 첫째 자리 숫자가 5예요. 5이거나 5보다 크면 올려요." } }, ", 소수 첫째 자리까지:", { n: "3.6", r: ["2.5÷0.7", 1], why: { "3.5": "소수 둘째 자리 숫자가 7이에요. 올려요." } }, ", 소수 둘째 자리까지:", { n: "3.57", r: ["2.5÷0.7", 2] }],
          ["소수 둘째 자리까지 나타낼 때 확인하는 숫자는", { o: ["소수 셋째 자리 숫자 1", "소수 둘째 자리 숫자 7"], a: 0 }]],
        ok: "2.5÷0.7=3.571…이므로 약 4, 약 3.6, 약 3.57로 나타낼 수 있어요." }) },
    { name: "약속하기 — 몫을 반올림하기", inst: "몫을 반올림하여 나타내는 방법을 정리해 보세요.", hints: ["11÷6을 소수 첫째 자리까지 나타낼 때 소수 둘째 자리 숫자 3을 보았어요.", "반올림은 5이거나 5보다 크면 올리고, 5보다 작으면 버려요."],
      render: (b, a) => blanks(b, a, ["몫이 간단한 소수로 구해지지 않을 때는 몫을 반올림하여 나타낼 수 있어요. 몫을 반올림하여 소수 첫째 자리까지 나타내려면 ", { o: ["소수 둘째 자리", "소수 첫째 자리"], a: 0 }, " 숫자를 보고, 그 숫자가 5이거나 5보다 크면 ", { o: ["올리고", "버리고"], a: 0 }, ", 5보다 작으면 ", { o: ["버려요", "올려요"], a: 0 }, ". 먼저 몇째 자리까지 나타낼지 정하고, 그 ", { o: ["바로 아래 자리", "맨 끝 자리"], a: 0 }, "까지만 계산하면 돼요."]) },
    { name: "확인하기 — 소수 둘째 자리까지", inst: "몫을 반올림하여 소수 둘째 자리까지 나타내어 보세요. 확인할 숫자(소수 셋째 자리)를 누르고 답을 써요. 계산기로 몫을 구해도 돼요.", hints: ["5÷6=0.833…, 7.4÷3=2.466…이에요.", "5.3÷0.7=7.571…, 2.47÷10.3=0.239…예요.", "소수 셋째 자리 숫자가 5이거나 5보다 크면 소수 둘째 자리 숫자를 하나 올려요."],
      render: (b, a) => dv2Round(b, a, { items: [{ e: "5÷6", to: 2 }, { e: "7.4÷3", to: 2 }, { e: "5.3÷0.7", to: 2 }, { e: "2.47÷10.3", to: 2 }],
        ok: "5÷6≈0.83, 7.4÷3≈2.47, 5.3÷0.7≈7.57, 2.47÷10.3≈0.24예요!" }) }
  ],
  challenge: { inst: "★ 도전 — 레몬 10 kg과 설탕 1.7 kg을 샀어요. 레몬의 무게는 설탕 무게의 약 몇 배인지 구해 보세요. 또, 수 카드 3, 5, 7, 8을 한 번씩 모두 써서 몫이 가장 큰 (소수 한 자리 수)÷(소수 한 자리 수)를 만들어 보세요.", hints: ["10÷1.7=5.882…예요.", "몫이 가장 크려면 나누어지는 수는 가장 크게, 나누는 수는 가장 작게 만들어요.", "만든 나눗셈을 계산하고 소수 셋째 자리 숫자를 봐요."],
    render: (b, a) => dv2Cards(b, a, { cards: ["3", "5", "7", "8"],
      asks: [
        { q: "레몬과 설탕: 10÷1.7 = 5.882…를 반올림하여 나타내기", p: ["일의 자리까지 약", { n: "6", r: ["10÷1.7", 0] }, "배, 소수 첫째 자리까지 약", { n: "5.9", r: ["10÷1.7", 1] }, "배, 소수 둘째 자리까지 약", { n: "5.88", r: ["10÷1.7", 2] }, "배"] },
        ["만든 나눗셈의 몫을 반올림하여 소수 둘째 자리까지 나타내면", { n: "2.49", r: ["8.7÷3.5", 2] }, "이에요."]],
      ok: "레몬은 설탕의 약 6배, 약 5.9배, 약 5.88배처럼 정한 자리에 따라 나타낼 수 있어요. 몫이 가장 큰 나눗셈은 8.7÷3.5이고 몫은 약 2.49예요." }) }
},
{
  id: "s7", no: 7, title: "레모네이드를 나누어 담아요 ― 나누어 주고 남는 양", soop: "개념 구축하기(O)",
  question: "소수의 나눗셈에서 나누어 주고 남는 양은 어떻게 구할까요?",
  summary: "설탕 7.4 kg을 2 kg씩 통에 담으면 7.4−2−2−2=1.4이므로 3통에 담고 1.4 kg이 남아요. 통의 수·주전자 수·도막 수처럼 몫이 자연수여야 할 때는 몫을 자연수 부분까지만 구하고, 남는 양의 소수점은 나누어지는 수의 처음 소수점 위치에 맞추어 찍어요. 14.3÷1.6은 8주전자, 1.5 L이고 1.6×8+1.5=14.3으로 확인해요.",
  steps: [
    { name: "만져 보기 — 설탕을 통에 담아요", inst: "축제 날 아침, 서윤이와 도현이는 설탕 7.4 kg을 한 통에 2 kg씩 나누어 담아요. 2 kg씩 몇 통까지 담을 수 있고, 남는 설탕은 몇 kg일까요? 먼저 예상하고, 수직선에서 2 kg씩 뛰어 세어 보세요.", hints: ["2 kg씩 뛰면 2, 4, 6이에요.", "6에서 7.4까지는 2 kg보다 적어서 더 뛸 수 없어요.", "7.4에서 2를 3번 빼면 1.4가 남아요."],
      render: ruleFirst((b, a) => dv2Line(b, a, { to: "7.4", step: "2", max: "8", tick: "1", unit: "kg", rem: "남는 설탕",
        asks: [
          ["구하는 식은", { o: ["7.4÷2", "7.4×2", "2÷7.4"], a: 0 }],
          ["뺄셈식: 7.4 − 2 − 2 − 2 =", { n: "1.4", e: "7.4−2−2−2" }],
          ["담을 수 있는 통의 수:", { n: "3", s: 1, why: { "3.7": "통은 1통, 2통처럼 자연수로 세요. 3.7통에 담을 수는 없어요." } }, "통, 남는 설탕의 양:", { n: "1.4", why: { "14": "남는 설탕은 7.4에서 2를 3번 뺀 만큼이에요. 14 kg이 아니라 1.4 kg이에요." } }, "kg"]],
        ok: "7.4에서 2를 3번 뺄 수 있으므로 3통, 3번 빼면 1.4가 남으므로 남는 설탕은 1.4 kg이에요." }),
        { q: "통의 수를 셀 때 몫을 끝까지(소수로) 구해야 할까요?", ph: "내 생각: 통의 수는 ~", help: ["① 7.4÷2=3.7이에요. 3.7통에 담을 수 있는지 생각해요. → ② 통의 수는 어떤 수로 세는지, 다 못 담은 설탕은 어떻게 나타내는지 써요.", "‘내 생각: 통의 수는 ~로 세니까 몫은 ~까지만 구하고, 남는 설탕은 ~.’ 꼴로 써요."],
          ans: "통의 수는 1통, 2통처럼 자연수로만 셀 수 있어요. 그래서 몫은 자연수 부분인 3까지만 구하고, 통에 담지 못하고 남는 설탕 1.4 kg을 따로 구해요." }) },
    { name: "그려 보기 — 레모네이드 주전자", inst: "레모네이드 14.3 L를 1.6 L들이 주전자에 가득 나누어 담으려고 해요. 몇 주전자까지 담을 수 있고, 남는 레모네이드는 몇 L일까요? 세로셈으로 계산해 보세요. 몫은 자연수 부분까지만 쓰고, 남는 양을 주황 칸에 쓴 뒤 소수점을 찍어요. 남는 양의 소수점은 14.3의 처음 소수점(흐린 동그라미)에 맞추어 찍어요.", hints: ["16)143처럼 계산해요. 16×8=128이에요.", "143−128=15예요. 남는 양은 15 L일까요?", "남는 양의 소수점은 14.3의 처음 소수점에 맞추어 찍어요. 1.5 L예요."],
      render: thenWhy((b, a) => dv2Long(b, a, { probs: [{ a: "14.3", b: "1.6", mode: "rem", what: "주전자 수" }],
        rows: [
          ["담을 수 있는 주전자 수:", { n: "8", s: 1 }, "주전자, 남는 레모네이드의 양:", { n: "1.5", why: { "15": "남는 양의 소수점은 14.3의 처음 소수점에 맞추어 찍어요. 15 L가 아니라 1.5 L예요." } }, "L"],
          ["계산 확인: 1.6 ×", { n: "8", s: 1 }, "+", { n: "1.5" }, "=", { n: "14.3", e: "1.6×8+1.5" }]],
        ok: "레모네이드는 8주전자에 담고 1.5 L가 남아요. 1.6×8+1.5=14.3으로 계산이 맞아요." }),
        { q: "세로셈에서 남는 수가 15로 보이는데, 남는 레모네이드가 15 L가 아니라 1.5 L인 까닭은 무엇일까요?", ph: "143은 14.3을 10배 한 수라서 ~", help: ["① 16)143에서 143은 14.3을 몇 배 한 수인지 생각해요. → ② 그 안에서 남은 15는 실제로 몇 L를 나타내는지 써요.", "‘143은 14.3을 ~배 한 수라서 남은 15는 0.1 L가 ~개라는 뜻이에요. 그래서 ~ L예요.’ 꼴로 써요."],
          ans: "143은 14.3 L를 10배 한 수, 곧 0.1 L가 143개라는 뜻이에요. 그래서 남은 15는 0.1 L가 15개라는 뜻이라 1.5 L예요. 확인해도 1.6×8+1.5=14.3이에요." }) },
    { name: "말해 보기 — 현수막 장식 띠", inst: "하준이는 길이가 27.35 m인 장식 띠를 한 도막에 4.2 m씩 잘라 부스 현수막을 꾸며요. 4.2 m씩 몇 도막까지 자를 수 있고, 남는 장식 띠는 몇 m일까요? 계산이 맞는지 확인하고, 구한 과정을 친구에게 설명해 보세요.", hints: ["42)273.5처럼 계산해요. 42×6=252예요.", "273.5−252=21.5예요. 남는 양의 소수점은 27.35의 처음 소수점 위치에 맞추어요.", "확인: 4.2×6+2.15=27.35"],
      render: dv2LongStep({ probs: [{ a: "27.35", b: "4.2", mode: "rem", what: "도막 수" }],
        rows: [
          ["자를 수 있는 도막 수:", { n: "6", s: 1 }, "도막, 남는 장식 띠의 길이:", { n: "2.15", why: { "21.5": "남는 양의 소수점은 27.35의 처음 소수점 위치에 맞추어 찍어요.", "215": "남는 양의 소수점은 27.35의 처음 소수점 위치에 맞추어 찍어요." } }, "m"],
          ["확인: 4.2 × 6 + 2.15 =", { n: "27.35", e: "4.2×6+2.15" }],
          ["도막 수는", { o: ["자연수이므로 몫을 자연수 부분까지만 구했어요", "소수이므로 끝까지 나누었어요"], a: 0 }]],
        ok: "도막 수는 자연수이므로 몫을 6까지만 구하고, 남는 길이는 나누어지는 수의 처음 소수점에 맞추어 2.15 m로 구했어요." }) },
    { name: "약속하기 — 나누어 주고 남는 양", inst: "나누어 주고 남는 양을 구하는 방법을 정리해 보세요.", hints: ["통의 수, 주전자 수, 도막 수는 자연수예요.", "14.3÷1.6에서 남는 양은 14.3의 소수점에 맞추어 1.5였어요.", "1.6×8+1.5=14.3으로 확인했어요."],
      render: (b, a) => blanks(b, a, ["통의 수나 도막 수처럼 몫이 자연수여야 할 때는 몫을 ", { o: ["자연수 부분까지만", "나누어떨어질 때까지"], a: 0 }, " 구해요. 남는 양의 소수점은 나누어지는 수의 ", { o: ["처음", "옮긴"], a: 0 }, " 소수점 위치에 맞추어 찍어요. 계산이 맞는지는 나누는 수 × 몫 + 남는 양 = ", { o: ["나누어지는 수", "나누는 수"], a: 0 }, "로 확인해요."]) },
    { name: "확인하기 — 팝콘과 색 테이프", inst: "팝콘용 옥수수 13.6 kg을 한 봉지에 3 kg씩 나누어 담으려고 해요. 세로셈으로 몇 봉지에 담을 수 있고 남는 옥수수는 몇 kg인지 구하고, 물음에 답해 보세요.", hints: ["3)13.6에서 몫은 자연수 부분 4까지만 써요.", "13.6−12=1.6이에요.", "색 테이프: 3.6×8=28.8, 31.4−28.8=2.6이에요."],
      render: dv2LongStep({ probs: [{ a: "13.6", b: "3", mode: "rem", what: "봉지 수" }],
        rows: [
          ["뺄셈으로 확인: 13.6 − 3 − 3 − 3 − 3 =", { n: "1.6", e: "13.6−3−3−3−3" }],
          ["옥수수는", { n: "4", s: 1 }, "봉지에 담을 수 있고, 남는 옥수수는", { n: "1.6" }, "kg이에요."],
          { q: "색 테이프 31.4 m를 한 모둠에 3.6 m씩 나누어 주려고 해요.", p: ["3.6 × 8 =", { n: "28.8", e: "3.6×8" }, "이므로", { n: "8", s: 1 }, "모둠까지 나누어 줄 수 있고, 남는 색 테이프는", { n: "2.6", e: "31.4−3.6×8" }, "m예요."] }],
        ok: "옥수수는 4봉지, 남는 옥수수 1.6 kg이에요. 색 테이프는 8모둠에 나누어 주고 2.6 m가 남아요." }) }
  ],
  challenge: { inst: "★ 도전 — 물음에 답해 보세요.", hints: ["검산해 봐요: 2.1×8+1.6은 얼마일까요?", "컵의 수, 사람 수는 자연수예요."],
    render: (b, a) => quiz(b, a, [
      { q: "꽃 철사 18.4 m를 한 사람에게 2.1 m씩 나누어 주려고 해요. 하준이는 “8명, 16 m”, 서윤이는 “8명, 1.6 m”라고 했어요. 바르게 구한 사람은 누구일까요?", o: ["하준", "서윤"], a: 1, why: { "0": "검산: 2.1×8+16=32.8이라 18.4가 아니에요. 남는 양의 소수점은 18.4의 처음 소수점에 맞추어 찍어요." } },
      { q: "2.5, 7, 0.6, 12, 3.8, 9 중에서 팔린 컵의 수가 될 수 있는 것을 모두 골라 보세요.", o: ["2.5", "7", "0.6", "12", "3.8", "9"], a: [1, 3, 5] },
      { q: "2.5, 0.6, 3.8이 컵의 수가 될 수 없는 까닭은 무엇일까요?", o: ["컵의 수는 자연수로만 셀 수 있기 때문이에요", "수가 너무 작기 때문이에요"], a: 0 }],
      { ok: "서윤이가 바르게 구했어요(2.1×8+1.6=18.4). 컵의 수, 사람 수는 자연수만 될 수 있어요." }) }
},
{
  id: "s8", no: 8, title: "알뜰하게 재료를 사요 ― 1 kg의 값 견주기", soop: "탐구 정리하기(O)",
  question: "어느 가게의 재료가 더 알뜰한지 소수의 나눗셈으로 어떻게 알 수 있을까요?",
  summary: "봉지의 무게가 다르면 값만으로는 어느 것이 알뜰한지 알 수 없어요. 1 kg의 값을 구해 견주면 돼요. 설탕은 가 가게 8400÷3.5=2400(원), 나 가게 3000÷1.2=2500(원)이라 1 kg에 100원 싼 가 가게가 더 알뜰해요. 레몬은 9000÷2.25=4000(원), 3300÷0.75=4400(원)이라 가 가게가 더 알뜰해요. (자연수)÷(소수)로 1 kg의 값을 구했어요.",
  steps: [
    { name: "만져 보기 — 장보기 쪽지 읽기", inst: "축제에 쓸 설탕과 레몬을 사러 하준이와 서윤이가 가게 두 곳의 전단지를 모아 왔어요. 쪽지를 읽고 물음에 답해 보세요.", hints: ["구하려는 것은 어느 가게의 설탕이 더 알뜰한지예요.", "가 가게 설탕은 3.5 kg에 8400원, 나 가게 설탕은 1.2 kg에 3000원이에요.", "봉지 값만 보면 나 가게가 싸 보이지만, 무게가 달라요."],
      render: (b, a) => { b.append(dv2sNote("🛒 축제 장보기 쪽지", ["가 가게: 설탕 3.5 kg 한 봉지 8400원 · 레몬 2.25 kg 한 상자 9000원", "나 가게: 설탕 1.2 kg 한 봉지 3000원 · 레몬 0.75 kg 한 봉지 3300원", "서윤: “나 가게 설탕이 3000원이니까 더 싸네!” 하준: “봉지 무게가 다르잖아. 견주는 방법을 정해야 해.”"]));
        quiz(b, a, [
          { q: "구하려는 것은 무엇인가요?", o: ["같은 무게일 때 어느 가게 재료가 더 싼지", "두 가게까지의 거리", "봉지가 더 큰 가게"], a: 0 },
          { q: "서윤이처럼 봉지 값만 보고 정하면 안 되는 까닭은 무엇일까요?", o: ["두 봉지의 무게가 달라서요", "두 가게의 이름이 달라서요"], a: 0 },
          { q: "어떻게 견주면 공평할까요?", o: ["1 kg의 값을 구해 견주어요", "봉지 수를 세어 견주어요"], a: 0 }],
          { ok: "무게가 다르면 1 kg의 값을 구해 견주어요. 그러면 공평하게 비교할 수 있어요." }); } },
    { name: "그려 보기 — 1 kg의 값 구하는 식", inst: "1 kg의 값은 어떻게 구할 수 있을지 계획해 보세요.", hints: ["3.5 kg이 8400원이에요. 1 kg의 값은 8400원을 3.5로 나누어요.", "□원 × 3.5 = 8400원이 되는 □를 찾는 것과 같아요."],
      render: thenWhy((b, a) => dv2Sent(b, a, [
        ["가 가게 설탕 1 kg의 값을 구하는 식은", { o: ["8400÷3.5", "8400×3.5", "3.5÷8400"], a: 0, why: { "1": "1 kg은 3.5 kg보다 가벼우니 값이 8400원보다 적어야 해요.", "2": "값을 무게로 나누어요." } }],
        ["나 가게 설탕 1 kg의 값을 구하는 식은", { o: ["3000÷1.2", "1.2÷3000", "3000−1.2"], a: 0 }],
        ["두 식은 모두", { o: ["(자연수)÷(소수)", "(소수)÷(소수)"], a: 0 }, "예요."]],
        { ok: "1 kg의 값은 (봉지 값)÷(봉지 무게)로 구해요. 8400÷3.5, 3000÷1.2처럼 (자연수)÷(소수)예요." }),
        { q: "1 kg의 값을 왜 (봉지 값)÷(봉지 무게)로 구할 수 있을까요?", ph: "1 kg의 값에 무게를 곱하면 ~", help: ["① 1 kg에 □원이면 3.5 kg은 얼마인지 곱셈으로 생각해요. → ② 곱셈과 나눗셈의 관계로 □를 구하는 식을 써요.", "‘1 kg에 □원이면 3.5 kg은 □×3.5원이고 그것이 ~원이니까 □=~이에요.’ 꼴로 써요."],
          ans: "1 kg에 □원이면 3.5 kg은 □×3.5원이고, 그 값이 8400원이에요. 곱셈과 나눗셈의 관계에 따라 □=8400÷3.5로 구할 수 있어요." }) },
    { name: "말해 보기 — 가 가게 설탕", inst: "단추로 가 가게 설탕 1 kg의 값을 바꾸어 3.5 kg의 값이 8400원과 딱 맞게 해 보세요. 그리고 식으로도 계산해 보세요.", hints: ["1 kg에 2000원이면 3.5 kg은 7000원이에요. 조금 더 올려요.", "8400÷3.5는 84000÷35와 몫이 같아요.", "1 kg의 값은 2400원이에요."],
      render: (b, a) => dv2sUnit(b, a, { total: "8400", qty: "3.5", unit: "kg", item: "가 가게 설탕", step: 100, max: 6000,
        asks: [["가 가게 설탕 1 kg의 값: 8400÷3.5 =", { n: "2400", e: "8400÷3.5" }, "(원)"]],
        ok: "가 가게 설탕은 1 kg에 2400원이에요(2400×3.5=8400)." }) },
    { name: "약속하기 — 나 가게 설탕과 견주기", inst: "이번에는 나 가게 설탕 1 kg의 값을 맞추어 보고, 어느 가게 설탕이 더 알뜰한지 정해 보세요.", hints: ["3000÷1.2는 30000÷12와 몫이 같아요.", "1.2 kg이 3000원이면 1 kg은 2500원이에요.", "1 kg의 값이 더 싼 쪽이 알뜰해요."],
      render: (b, a) => dv2sUnit(b, a, { total: "3000", qty: "1.2", unit: "kg", item: "나 가게 설탕", step: 100, max: 6000,
        asks: [["나 가게 설탕 1 kg의 값: 3000÷1.2 =", { n: "2500", e: "3000÷1.2" }, "(원)"],
          ["1 kg의 값이 더 싼 곳은", { o: ["가 가게", "나 가게"], a: 0, why: { "1": "가 가게는 1 kg에 2400원, 나 가게는 2500원이에요. 봉지 값이 싸다고 1 kg의 값도 싼 것은 아니에요." } }, "이고, 1 kg에", { n: "100", e: "2500−2400" }, "원 더 싸요."]],
        ok: "나 가게 설탕은 1 kg에 2500원이라, 1 kg에 2400원인 가 가게 설탕이 더 알뜰해요." }) },
    { name: "확인하기 — 레몬 견주기", inst: "레몬도 견주어 보세요. 가 가게는 2.25 kg에 9000원, 나 가게는 0.75 kg에 3300원이에요. 계산기를 써도 돼요.", hints: ["9000÷2.25는 900000÷225와 몫이 같아요.", "3300÷0.75는 330000÷75와 몫이 같아요.", "1 kg의 값을 견주어요."],
      render: (b, a) => dv2Sent(b, a, [
        ["가 가게 레몬 1 kg: 9000 ÷ 2.25 =", { n: "4000", e: "9000÷2.25" }, "(원)"],
        ["나 가게 레몬 1 kg: 3300 ÷ 0.75 =", { n: "4400", e: "3300÷0.75" }, "(원)"],
        ["레몬은", { o: ["가 가게", "나 가게"], a: 0 }, "에서 사는 것이 더 알뜰해요."]],
        { fig: () => dv2Talk([["서윤:", "봉지 값이 싸다고 꼭 알뜰한 건 아니구나!"], ["하준:", "1 kg의 값으로 견주니까 한눈에 보여."]]), ok: "레몬은 가 가게 1 kg에 4000원, 나 가게 1 kg에 4400원이라 가 가게가 더 알뜰해요." }) },
    { name: "되돌아봐요 — 장보기 방법 정리", inst: "알뜰하게 재료를 산 과정을 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "어느 가게가 더 알뜰한지 어떻게 정했는지 설명해 보세요.", tag: "해결 방법", ph: "예) 봉지 값을 무게로 나누어 1 kg의 값을 ~", help: ["① 무게가 다를 때 무엇을 구해 견주었는지 떠올려요. → ② 그 값을 구한 나눗셈식과 결과를 써요.", "‘봉지 값을 ~로 나누어 1 kg의 값을 구했더니 가 가게는 ~원, 나 가게는 ~원이라 ~ 가게가 더 알뜰해요.’ 꼴로 써요."],
          ans: "봉지 값을 봉지 무게로 나누어 1 kg의 값을 구했어요. 설탕은 가 가게 8400÷3.5=2400(원), 나 가게 3000÷1.2=2500(원)이라 가 가게가 1 kg에 100원 더 싸서 더 알뜰해요." },
        { q: "생활에서 1 kg(또는 1 L)의 값을 견주어 보면 좋은 때를 하나 써 보세요.", tag: "생활", ph: "예) 마트에서 우유를 살 때 ~", help: ["① 크기나 양이 다른 물건 두 가지를 견주어 산 경험을 떠올려요. → ② 무엇을 무엇으로 나누어 견주면 되는지 써요.", "‘~을 살 때 양이 다르면 값을 ~로 나누어 1 ~의 값을 견주면 좋아요.’ 꼴로 써요."],
          ans: "마트에서 1.8 L 우유와 0.9 L 우유를 살 때 값을 들이로 나누어 1 L의 값을 견주면 어느 것이 더 알뜰한지 알 수 있어요." }]) }
  ],
  challenge: { inst: "★ 도전 — 레모네이드에 넣을 탄산수를 사요. 1.5 L 한 병에 1800원, 2.4 L 한 병에 2640원이에요. 1 L의 값을 견주어 보세요.", hints: ["1800÷1.5는 18000÷15와 몫이 같아요.", "2640÷2.4는 26400÷24와 몫이 같아요.", "1 L의 값이 더 싼 쪽이 알뜰해요."],
    render: (b, a) => dv2Sent(b, a, [
      ["1.5 L 병의 1 L 값: 1800 ÷ 1.5 =", { n: "1200", e: "1800÷1.5" }, "(원)"],
      ["2.4 L 병의 1 L 값: 2640 ÷ 2.4 =", { n: "1100", e: "2640÷2.4" }, "(원)"],
      ["더 알뜰한 것은", { o: ["1.5 L 병", "2.4 L 병"], a: 1 }]],
      { ok: "1.5 L 병은 1 L에 1200원, 2.4 L 병은 1 L에 1100원이라 2.4 L 병이 더 알뜰해요." }) }
},
{
  id: "s9", no: 9, title: "부스 운영 계획서를 써요", soop: "탐구 정리하기(O)",
  question: "부스 운영 계획을 세울 때 소수의 나눗셈을 어떻게 알맞게 쓸 수 있을까요?",
  summary: "상황에 따라 몫을 다르게 나타내요. 레모네이드 원액 5.6 L로 0.35 L씩 몇 잔인지는 5.6÷0.35=16(잔)처럼 나누어떨어질 때까지 구해요. 얼음 9.5 kg을 2.2 kg씩 통에 담을 때는 몫을 자연수 부분까지만 구해 4통, 남는 얼음 0.7 kg이에요. 올해 목표 30 L가 지난해 판매량 23.5 L의 약 몇 배인지는 30÷23.5=1.276…을 반올림하여 약 1.3배로 나타내요.",
  steps: [
    { name: "만져 보기 — 레모네이드 몇 잔?", inst: "6학년 1반은 축제 부스 운영 계획서를 써요. 먼저 레모네이드 원액 5.6 L로 한 잔에 0.35 L씩 넣으면 몇 잔을 만들 수 있는지 세로셈으로 계산해 보세요.", hints: ["두 수의 소수점이 두 자리씩 옮겨졌어요. 35)560처럼 계산해요.", "35×16=560이에요.", "잔의 수는 16잔이에요."],
      render: dv2LongStep({ probs: [{ a: "5.6", b: "0.35", cap: "원액 5.6 ÷ 0.35" }],
        rows: [["레모네이드를", { n: "16", e: "5.6÷0.35", s: 1 }, "잔 만들 수 있어요."]],
        ok: "5.6÷0.35=560÷35=16, 레모네이드를 16잔 만들 수 있어요. 5.6은 5.60으로 생각해 소수점을 두 자리 옮겼어요." }) },
    { name: "그려 보기 — 얼음 통", inst: "얼음 9.5 kg을 아이스박스 한 통에 2.2 kg씩 나누어 담으려고 해요. 몇 통까지 담을 수 있고, 남는 얼음은 몇 kg일까요?", hints: ["22)95처럼 계산해요. 22×4=88이에요.", "95−88=7이에요. 남는 양의 소수점은 9.5의 처음 소수점에 맞추어요.", "확인: 2.2×4+0.7=9.5"],
      render: dv2LongStep({ probs: [{ a: "9.5", b: "2.2", mode: "rem", what: "통의 수" }],
        rows: [["아이스박스", { n: "4", s: 1 }, "통에 담고, 남는 얼음은", { n: "0.7", why: { "7": "남는 양의 소수점은 9.5의 처음 소수점에 맞추어 찍어요. 7 kg이 아니라 0.7 kg이에요." } }, "kg이에요."],
          ["확인: 2.2 × 4 + 0.7 =", { n: "9.5", e: "2.2×4+0.7" }]],
        ok: "통의 수는 자연수라서 몫을 4까지만 구하고, 남는 얼음 0.7 kg을 구했어요." }) },
    { name: "말해 보기 — 올해 목표는 몇 배?", inst: "지난해 축제에서 우리 학교 레모네이드 부스는 23.5 L를 팔았어요. 올해 목표는 30 L예요. 올해 목표는 지난해 판매량의 약 몇 배일까요? 몫을 반올림하여 소수 첫째 자리까지 나타내 보세요. 계산기를 써도 돼요.", hints: ["30÷23.5를 계산해요. 300÷235와 몫이 같아요.", "30÷23.5=1.276…이에요.", "소수 둘째 자리 숫자 7을 보고 올려요."],
      render: thenWhy((b, a) => dv2Round(b, a, { items: [{ e: "30÷23.5", to: 1 }],
        asks: [["올해 목표는 지난해 판매량의 약", { n: "1.3", r: ["30÷23.5", 1], why: { "1.2": "소수 둘째 자리 숫자가 7이에요. 5이거나 5보다 크면 올려요." } }, "배예요."]],
        ok: "30÷23.5=1.276…이라 소수 첫째 자리까지 약 1.3배예요." }),
        { q: "이 문제에서는 왜 몫을 반올림하여 나타냈을까요?", ph: "30÷23.5는 나누어떨어지지 않아서 ~", help: ["① 30÷23.5를 계속 계산하면 어떻게 되는지 떠올려요. → ② ‘몇 배쯤’인지 알리는 계획서에는 어떻게 쓰는 것이 좋은지 써요.", "‘몫이 ~ 않고 계속 이어져서, 계획서에는 ~ 자리까지 반올림하여 약 ~배라고 쓰면 알아보기 쉬워요.’ 꼴로 써요."],
          ans: "30÷23.5=1.276…처럼 몫이 나누어떨어지지 않고 계속 이어져요. 계획서에는 소수 첫째 자리까지 반올림하여 약 1.3배라고 쓰면 알아보기 쉬워요." }) },
    { name: "약속하기 — 상황에 맞게 몫 나타내기", inst: "계획서의 세 가지 계산에서 몫을 어떻게 나타냈는지 정리해 보세요.", hints: ["레모네이드 잔 수는 나누어떨어졌어요.", "통의 수는 자연수라서 남는 양을 따로 구했어요.", "몇 배쯤인지는 반올림했어요."],
      render: (b, a) => blanks(b, a, ["5.6÷0.35처럼 나누어떨어지면 몫을 끝까지 구해요. 얼음 통의 수처럼 몫이 자연수여야 하면 몫을 ", { o: ["자연수 부분까지만", "소수 둘째 자리까지"], a: 0 }, " 구하고 ", { o: ["나누어 주고 남는 양", "몫의 반올림"], a: 0 }, "을 함께 써요. 30÷23.5처럼 나누어떨어지지 않으면 몇째 자리까지 나타낼지 정해 ", { o: ["반올림하여", "버리지 않고 끝까지"], a: 0 }, " 나타내요."]) },
    { name: "확인하기 — 계획서 발표하기", inst: "모둠 계획서를 반 친구들에게 발표할 글을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "우리 부스 계획 가운데 소수의 나눗셈으로 정한 것을 하나 골라 식과 답을 넣어 발표 글로 써 보세요.", tag: "발표", ph: "예) 레모네이드 원액 5.6 L로 ~", help: ["① 잔 수, 얼음 통, 목표 배수 가운데 하나를 골라요. → ② 나눗셈식, 몫을 나타낸 방법, 답을 차례로 써요.", "‘~을 ~씩 나누면 ~÷~=~이라서 ~이에요.’ 꼴로 써요."],
          ans: "얼음 9.5 kg을 아이스박스 한 통에 2.2 kg씩 담으면 9.5÷2.2에서 통의 수는 자연수라서 4통까지 담을 수 있고, 남는 얼음은 0.7 kg이에요. 남는 얼음은 컵에 바로 넣어 쓸게요." },
        { q: "몫을 상황에 맞게 나타내지 않으면 어떤 문제가 생길지 써 보세요.", tag: "까닭", ph: "예) 통의 수를 4.3통이라고 쓰면 ~", help: ["① 통의 수를 소수로 쓰거나, 남는 양의 소수점을 잘못 찍은 경우를 떠올려요. → ② 그러면 준비할 때 어떤 일이 생기는지 써요.", "‘~을 ~라고 쓰면 ~ 수 없어서 ~이 생겨요.’ 꼴로 써요."],
          ans: "아이스박스 수를 9.5÷2.2=4.31…통이라고 쓰면 0.31통은 준비할 수 없어서 헷갈려요. 남는 얼음을 7 kg이라고 쓰면 얼음이 많이 남는 줄 알고 잘못 준비할 수 있어요." }]) }
  ],
  challenge: { inst: "★ 도전 — 상황에 맞게 몫을 나타내 보세요.", hints: ["사람 수는 자연수예요.", "몇 배쯤인지는 반올림해요.", "나누어떨어지면 끝까지 구해요."],
    render: (b, a) => dv2Sent(b, a, [
      { q: "꽃 리본 10 m를 한 사람에게 1.5 m씩 나누어 주면?", p: ["", { n: "6", s: 1 }, "명에게 주고, 남는 리본은", { n: "1", e: "10−1.5×6" }, "m예요."] },
      { q: "포장 상자 7.2 kg을 0.45 kg씩 나누어 담으면 몇 묶음?", p: ["7.2 ÷ 0.45 =", { n: "16", e: "7.2÷0.45" }, "(묶음)"] },
      { q: "올해 꽃다발 목표 25다발은 지난해 판매 9다발의 약 몇 배?(소수 첫째 자리까지)", p: ["약", { n: "2.8", r: ["25÷9", 1] }, "배"] }],
      { ok: "리본은 6명에게 주고 1 m가 남고, 상자는 16묶음, 꽃다발 목표는 약 2.8배예요. 상황에 맞게 몫을 나타냈어요!" }) }
},
{
  id: "s10", no: 10, title: "축제 부스 한 바퀴 놀이", soop: "발표하기(P)",
  question: "소수의 나눗셈을 옳게 계산하며 축제 부스를 한 바퀴 돌아볼까요?",
  summary: "두 사람이 번갈아 주사위를 던져 나온 눈의 수만큼 말을 옮기고, 도착한 부스 칸의 소수의 나눗셈을 해요. 상대방은 계산기로 답을 확인하고, 틀리면 말을 전에 있던 칸으로 돌려놓아요. 상대방의 말이 있는 칸에 도착하면 주사위를 한 번 더 던져요. 도착 칸에 먼저 도착하는 사람이 이겨요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알기", inst: "축제가 끝난 뒤 반 친구들이 축제 부스를 한 바퀴 도는 놀이판을 만들었어요(2명, 준비물: 주사위·말·계산기). ① 가위바위보로 순서를 정하고 말을 출발 칸에 놓아요. ② 주사위를 던져 나온 눈의 수만큼 말을 옮겨요. ③ 도착한 칸의 나눗셈을 해요. 상대방은 계산기로 확인하고, 틀리면 말을 전에 있던 칸으로 돌려놓아요. ④ 상대방의 말이 있는 칸이면 주사위를 한 번 더 던져 옮긴 뒤 ③을 해요. ⑤ 도착 칸에 먼저 닿는 사람이 이겨요.", hints: ["틀리면 전에 있던 칸으로 돌아가요.", "상대방의 말이 있는 칸이면 주사위를 한 번 더 던져요.", "옳게 계산해야 앞으로 나아갈 수 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "도착한 칸의 나눗셈을 잘못 계산하면 어떻게 하나요?", o: ["말을 전에 있던 칸으로 돌려놓아요", "말을 출발 칸으로 보내요", "그 칸에 그대로 있어요"], a: 0 },
        { q: "도착한 칸에 상대방의 말이 있으면 어떻게 하나요?", o: ["주사위를 한 번 더 던져 옮긴 뒤 그 칸의 나눗셈을 해요", "상대방 말을 출발 칸으로 보내요", "차례를 넘겨요"], a: 0 },
        { q: "놀이판에는 어떤 문제가 있나요? 모두 골라 보세요.", o: ["(소수)÷(소수)", "(자연수)÷(소수)", "몫을 반올림하여 나타내는 문제", "분수의 곱셈"], a: [0, 1, 2] },
        { q: "놀이할 때 지킬 점은 무엇일까요?", o: ["옳게 계산하고, 친구의 계산을 계산기로 확인하며 친절하게 알려 줘요", "계산은 대충 하고 주사위만 크게 나오길 바라요"], a: 0 }],
        { ok: "옳게 계산해야 앞으로 나아갈 수 있어요. 승부보다 바르게 계산하는 데 집중하고, 친구를 배려하며 놀이해요." }) },
    { name: "그려 보기 — 놀이판 문제 미리 계산하기", inst: "놀이판에 있는 문제 몇 개를 미리 계산해 보세요.", hints: ["2.7)8.37은 27)83.7처럼 계산해요.", "0.75)24는 75)2400처럼 계산해요.", "7.15÷3.3=2.166…, 23÷0.7=32.857…이에요."],
      render: dv2LongStep({ probs: [{ a: "8.37", b: "2.7" }, { a: "24", b: "0.75" }],
        rows: [
          ["5.22÷1.74 =", { n: "3", e: "5.22÷1.74" }],
          ["7.15÷3.3의 몫을 반올림하여 일의 자리까지 나타내면", { n: "2", r: ["7.15÷3.3", 0] }],
          ["23÷0.7의 몫을 반올림하여 소수 첫째 자리까지 나타내면", { n: "32.9", r: ["23÷0.7", 1], why: { "32.8": "소수 둘째 자리 숫자가 5예요. 5이거나 5보다 크면 올려요." } }]],
        ok: "8.37÷2.7=3.1, 24÷0.75=32, 5.22÷1.74=3, 7.15÷3.3≈2, 23÷0.7≈32.9예요!" }) },
    { name: "말해 보기 — 축제 부스 한 바퀴", inst: "짝과 함께 놀이해 보세요. ‘주사위 던지기’를 누르면 말이 저절로 움직여요. 도착한 칸의 몫을 쓰면 계산기로 확인해 줘요. 반올림 칸은 적힌 자리까지 나타내요.", hints: ["두 수의 소수점을 같은 자리만큼 옮겨 자연수의 나눗셈처럼 계산해요.", "반올림 칸은 나타낼 자리의 바로 아래 자리 숫자를 봐요.", "검산으로 몫이 맞는지 확인해 봐요."],
      render: (b, a) => dv2Island(b, a, { cells: DV2S_BOARD, note: "※ 축제 부스 길을 따라 19칸이 이어진 놀이판이에요. 칸마다 소수의 나눗셈이 있어요.", ok: "축제 부스를 한 바퀴 다 돌았어요! 옳게 계산해야 앞으로 나아갈 수 있었지요?" }) },
    { name: "확인하기 — 놀이 되돌아보기", inst: "놀이를 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 계산하기 어려웠던 나눗셈과 그 나눗셈을 계산한 방법을 써 보세요.", tag: "계산", ph: "예) 24÷0.75는 ~", help: ["① 놀이판에서 어려웠던 칸 하나를 골라요. → ② 소수점을 몇 자리 옮겨 어떤 나눗셈으로 바꾸었는지 써요.", "‘~÷~은 두 수를 각각 ~배 해서 ~÷~으로 계산해 몫이 ~이에요.’ 꼴로 써요."],
          ans: "24÷0.75는 두 수를 각각 100배 해서 2400÷75로 계산했어요. 몫은 32예요. 검산하면 0.75×32=24라서 맞아요." },
        { q: "놀이를 하며 친구를 배려한 점을 써 보세요.", tag: "배려", ph: "예) 친구가 틀렸을 때 ~", help: ["① 친구가 틀렸을 때나 내가 이겼을 때 한 말과 행동을 떠올려요. → ② 친구가 기분 좋게 놀이할 수 있도록 한 일을 써요.", "‘친구가 ~했을 때 ~라고 말해 주었어요.’ 꼴로 써요."],
          ans: "친구가 몫의 소수점을 잘못 찍었을 때 놀리지 않고 검산하는 방법을 함께 알려 주었어요." }]) }
  ],
  challenge: { inst: "★ 도전 — 또 다른 놀이: 빙고예요(3~4명이 하는 놀이를 컴퓨터 친구와 해 봐요). ① 놀이판의 (소수)÷(소수), (자연수)÷(소수)를 계산해요. ② 9개를 골라 3×3 빙고판에 나눗셈과 몫을 써요. ③ 순서대로 빙고판에 쓴 것 중 하나를 골라 나눗셈과 몫을 말해요. 같은 식이 있으면 ○표를 해요. ④ 가로·세로·대각선으로 3줄을 먼저 만들면 이겨요.", hints: ["식 카드를 누르면 빙고판 빈칸에 들어가요. ✕를 누르면 빠져요.", "몫을 모두 바르게 써야 빙고판이 완성돼요.", "가운데 칸은 줄을 많이 만들 수 있어요."],
    render: (b, a) => dv2Bingo(b, a, { cells: DV2S_BOARD, ok: "빙고 놀이를 끝까지 했어요! 소수의 나눗셈을 정확하게 계산했어요." }) }
},
{
  id: "s11", no: 11, title: "나눔 축제 결산 발표회", soop: "발표하기(P)",
  question: "축제를 돌아보며 소수의 나눗셈을 계산하고 생활 속 문제를 해결할 수 있나요?",
  summary: "나누어지는 수와 나누는 수를 각각 10배 또는 각각 100배 하면 몫은 같아요. 그래서 (소수)÷(소수), (자연수)÷(소수)는 자연수의 나눗셈이나 분수의 나눗셈으로 계산해요. 몫이 나누어떨어지지 않으면 바로 아래 자리에서 반올림하고, 몫이 자연수여야 하면 몫을 자연수 부분까지만 구한 뒤 남는 양의 소수점을 나누어지는 수의 처음 소수점에 맞추어 찍어요.",
  steps: [
    { name: "만져 보기 — 두 가지 방법으로", inst: "축제가 끝나고 6학년 1반이 결산 발표회를 열어요. 먼저 자연수의 나눗셈과 분수의 나눗셈으로 계산해 보세요. 보기: 24÷1.6 = [240/10] ÷ [16/10] = 240÷16 = 15", hints: ["8.1÷0.9는 두 수를 각각 10배, 3.06÷0.51은 각각 100배 해요.", "1.5는 분모가 10인 분수로, 0.36은 분모가 100인 분수로 나타내요.", "18=[180/10], 27=[2700/100]이에요."],
      render: (b, a) => dv2Sent(b, a, [
        ["8.1÷0.9: 각각 10배 → 81÷9 =", { n: "9", e: "81÷9" }, "→ 8.1÷0.9 =", { n: "9", e: "8.1÷0.9" }],
        ["3.06÷0.51: 각각 100배 → 306÷51 =", { n: "6", e: "306÷51" }, "→ 3.06÷0.51 =", { n: "6", e: "3.06÷0.51" }],
        ["⑴ 18÷1.5 =", { f: ["180", "10"] }, "÷", { f: ["15", "10"] }, "= 180÷15 =", { n: "12", e: "18÷1.5" }],
        ["⑵ 27÷0.36 =", { f: ["2700", "100"] }, "÷", { f: ["36", "100"] }, "= 2700÷36 =", { n: "75", e: "27÷0.36" }]],
      { ok: "8.1÷0.9=9, 3.06÷0.51=6, 18÷1.5=12, 27÷0.36=75예요!" }) },
    { name: "그려 보기 — 세로셈으로 계산하기", inst: "결산표의 나눗셈을 계산해 보세요.", hints: ["0.16)3.04는 16)304처럼 계산해요.", "3.2)6.08은 32)60.8처럼 계산하고, 몫의 소수점을 60.8의 소수점에 맞추어 찍어요.", "45÷1.25는 4500÷125와 몫이 같아요."],
      render: dv2LongStep({ probs: [{ a: "3.04", b: "0.16" }, { a: "6.08", b: "3.2" }],
        rows: [["33.6÷4.2 =", { n: "8", e: "33.6÷4.2" }, ", 45÷1.25 =", { n: "36", e: "45÷1.25" }]],
        ok: "3.04÷0.16=19, 6.08÷3.2=1.9, 33.6÷4.2=8, 45÷1.25=36이에요!" }) },
    { name: "말해 보기 — 몫을 반올림하기", inst: "몫을 반올림하여 소수 둘째 자리까지 나타내어 보세요. 세로셈으로 소수 셋째 자리까지 계산해요.", hints: ["5.4)13은 54)130처럼 계산하고 0을 내려 계속 나누어요.", "소수 셋째 자리 숫자를 보고 반올림해요.", "13÷5.4=2.407…, 2.83÷1.7=1.664…예요."],
      render: dv2LongStep({ probs: [{ a: "13", b: "5.4", mode: "tr", places: 3 }, { a: "2.83", b: "1.7", mode: "tr", places: 3 }],
        rows: [["13÷5.4 → 약", { n: "2.41", r: ["13÷5.4", 2], why: { "2.40": "소수 셋째 자리 숫자가 7이에요. 5이거나 5보다 크면 올려요.", "2.4": "소수 셋째 자리 숫자가 7이에요. 5이거나 5보다 크면 올려요." } }, ", 2.83÷1.7 → 약", { n: "1.66", r: ["2.83÷1.7", 2] }]],
        ok: "13÷5.4=2.407…→약 2.41, 2.83÷1.7=1.664…→약 1.66이에요!" }) },
    { name: "약속하기 — 결산 기록 읽기", inst: "예린이가 쓴 꽃다발 가게 결산 기록이에요. □ 안에 알맞은 수를 구해 보세요. 이해해요 → 계획해요 → 해결해요 → 되돌아봐요 차례로 생각해요.", hints: ["구하려는 것은 둘째 날 쓴 리본이 첫날 쓴 리본의 몇 배인지예요.", "팔린 꽃다발 수는 이 문제를 푸는 데 필요하지 않아요.", "21.25÷12.5는 212.5÷125와 몫이 같아요."],
      render: (b, a) => dv2Sent(b, a, [
        ["첫날 쓴 리본은", { n: "12.5" }, "m, 둘째 날 쓴 리본은", { n: "21.25" }, "m예요."],
        ["문제를 푸는 데 필요 없는 정보는", { o: ["팔린 꽃다발 수", "쓴 리본의 길이"], a: 0 }],
        ["식: 21.25 ÷ 12.5 =", { n: "1.7", e: "21.25÷12.5" }, "→ □ =", { n: "1.7" }]],
      { fig: () => dv2sNote("💐 꽃다발 가게 결산 기록", ["첫날: 꽃다발 8다발 팔림, 쓴 리본 12.5 m", "둘째 날: 꽃다발 14다발 팔림, 쓴 리본은 첫날의 □배인 21.25 m"]), ok: "둘째 날 쓴 리본은 첫날의 21.25÷12.5=1.7(배)예요. 팔린 꽃다발 수는 필요 없는 정보였어요." }) },
    { name: "확인하기 — 잘못된 계산 고치기", inst: "남은 레몬청 17.3 L를 아동 센터에 보낼 4.5 L들이 통에 가득 나누어 담았어요. 도현이는 45)173 → 몫 3, 135, 38로 계산해 “3통, 남는 레몬청 38 L”라고 썼어요. 잘못된 곳을 찾고, 세로셈으로 옳게 계산해 보세요.", hints: ["통의 수는 자연수이므로 몫을 자연수 부분까지만 구해요.", "173−135=38이에요. 남는 양의 소수점은 17.3의 소수점 위치에 맞추어 찍어요.", "확인: 4.5×3+3.8=17.3"],
      render: dv2LongStep({ probs: [{ a: "17.3", b: "4.5", mode: "rem", what: "통의 수" }],
        rows: [
          ["잘못된 까닭:", { o: ["남는 레몬청의 양을 구할 때 17.3의 소수점 위치에 맞추어 소수점을 찍지 않았어요", "몫을 자연수 부분까지만 구했어요"], a: 0, why: { "1": "통의 수는 자연수이므로 몫을 자연수 부분까지만 구하는 것이 맞아요." } }],
          ["옳게 계산하면:", { n: "3", s: 1 }, "통, 남는 레몬청", { n: "3.8", why: { "38": "남는 양의 소수점은 17.3의 처음 소수점 위치에 맞추어요." } }, "L"],
          ["확인: 4.5 × 3 + 3.8 =", { n: "17.3", e: "4.5×3+3.8" }]],
        ok: "남는 레몬청은 38 L가 아니라 3.8 L예요. 4.5×3+3.8=17.3으로 확인했어요." }) },
    { name: "확인하기 — 궁금증 되돌아보기", inst: "1차시에 붙였던 ‘궁금해요’ 쪽지를 다시 보고, 축제 준비를 되돌아보세요.",
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "1차시에 궁금했던 것 중 하나를 골라, 이제는 어떻게 답할 수 있는지 써 봐요.", tag: "궁금증", ph: "예) 4.2÷0.6의 몫은 ~", help: ["① 위 쪽지에서 궁금했던 것을 하나 골라요(없으면 이 단원에서 궁금했던 것을 떠올려요). → ② 배운 방법으로 답을 써요.", "‘궁금했던 것: ~ → 이제는 ~라고 답할 수 있어요.’ 꼴로 써요."],
          ans: "궁금했던 것: 4.2÷0.6처럼 소수로 나누면 몫은 소수일까, 자연수일까? → 이제는 두 수를 각각 10배 한 42÷6과 몫이 같아서 자연수 7이라고 답할 수 있어요. 소수로 나누어도 몫이 자연수일 수 있어요." },
        { q: "축제 준비에서 가장 기억에 남는 소수의 나눗셈과 계산 방법을 써 봐요.", tag: "기억", ph: "예) 레모네이드 14.3 L를 1.6 L씩 ~", help: ["① 레몬청·리본·종이비행기·초대장·레모네이드·장보기 가운데 하나를 골라요. → ② 그때의 식과 계산 방법, 몫을 나타낸 방법을 써요.", "‘~에서 ~÷~을 ~ 방법으로 계산해 ~이 나왔어요.’ 꼴로 써요."],
          ans: "레모네이드 14.3 L를 1.6 L 주전자에 담을 때 14.3÷1.6을 16)143처럼 계산했어요. 주전자 수는 자연수라 8까지만 구하고, 남는 레모네이드는 14.3의 처음 소수점에 맞추어 1.5 L로 구했어요." }])) }
  ],
  challenge: { inst: "★ 도전 — 배운 내용을 모두 써서 풀어 보세요.", hints: ["□×3.5=12.6이면 □=12.6÷3.5예요.", "병의 수는 자연수예요. 1.2×8=9.6이에요.", "9.5÷0.7=13.571…이에요."],
    render: (b, a) => dv2Sent(b, a, [
      ["□ × 3.5 = 12.6일 때 □ =", { n: "3.6", e: "12.6÷3.5" }],
      { q: "남은 생수 9.7 L를 한 병에 1.2 L씩 나누어 담으려고 해요.", p: ["", { n: "8", s: 1 }, "병까지 담을 수 있고, 남는 생수는", { n: "0.1", e: "9.7−1.2×8", why: { "1": "남는 양의 소수점은 9.7의 처음 소수점에 맞추어 찍어요." } }, "L예요."] },
      ["9.5÷0.7의 몫을 반올림하여 소수 첫째 자리까지 나타내면", { n: "13.6", r: ["9.5÷0.7", 1] }, "이에요."]],
      { ok: "□=3.6, 생수는 8병에 담고 0.1 L가 남아요(1.2×8+0.1=9.7). 9.5÷0.7≈13.6이에요. 훌륭해요!" }) }
}
];
