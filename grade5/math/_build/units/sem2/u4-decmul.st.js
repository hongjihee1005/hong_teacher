//@@APP
const APP={title:"우리 반 과학 탐구 캠프", unit:"5-2 수학 4. 소수의 곱셈", key:"s52-decmul-v1", welcome:"우리 반 과학 탐구 캠프에 온 것을 환영해요", intro:"한빛초등학교 5학년 2반 친구들과 1박 2일 과학 탐구 캠프를 하며, 비커 속 용액·강낭콩 줄기·구리선·모종판·돋보기·캠프 식단에서 소수의 곱셈을 알아봐요."};
//@@UNIT
/* ===== 4. 소수의 곱셈 단원 조작 부품 (앞글자 dm4) — 이야기 버전 =====
   교과서 버전(u4-decmul.tb.js)의 dm4 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요
   (입력칸 0.9초 · 고르기 0.26초 · 칠하기·끌기·단추 1.2초). 소수를 쓰는 중(‘1.’, 답보다 숫자가 적은 동안)에는 확인하지 않아요.
   수는 모두 10^12배 한 BigInt 정수로 계산해서 소수 계산 오차가 없어요(22.617과 22.6170은 같은 수).
   글 속 분수 표기: [14/10], [14×6/10] → 화면에서 위아래로 쌓은 분수로 보여 줘요.
   한 계단에 활동이 둘이면(엔진 hj-multi) 부품마다 api.done( 을 불러야 하나로 세어요 — 부품마다 그 표시를 적어 두었어요. */

/*dm4-core*/
const DM4K = 12, DM4U = 10n ** 12n;
function dm4Norm(s) { return String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/[．。·]/g, ".").replace(/^\+/, ""); }
/* "0.5"·".5"·"5."·"22.6170" → BigInt(수×10^12), 수가 아니면 null */
function dm4P(s) {
  s = dm4Norm(s);
  if (!/^\d*\.?\d*$/.test(s) || !/\d/.test(s)) return null;
  const [i, d = ""] = s.split(".");
  if (d.length > DM4K) return null;
  return BigInt(i || "0") * DM4U + BigInt((d + "0".repeat(DM4K)).slice(0, DM4K));
}
/* BigInt → 가장 짧은 소수 글 */
function dm4F(n) {
  if (n == null) return "?";
  const neg = n < 0n; if (neg) n = -n;
  const i = n / DM4U, f = (n % DM4U).toString().padStart(DM4K, "0").replace(/0+$/, "");
  return (neg ? "−" : "") + i + (f ? "." + f : "");
}
function dm4Dn(s) { const m = dm4Norm(s).match(/\.(\d+)/); return m ? m[1].length : 0; }
/* 소수점을 뗀 자연수 글: "0.32"→"32", "3.04"→"304", "20"→"20" */
function dm4Nat(s) { return String(BigInt(dm4Norm(s).replace(".", "") || "0")); }
/* 식 계산: + − × (곱셈 먼저) */
function dm4E(e) {
  const t = String(e).replace(/−/g, "-").replace(/[x*]/g, "×").replace(/\s/g, "");
  const tk = t.match(/[+\-×]|[\d.]+/g); if (!tk || tk.join("") !== t) return null;
  let sum = 0n, sign = 1n, cur = dm4P(tk[0]); if (cur == null) return null;
  for (let k = 1; k < tk.length; k += 2) {
    const op = tk[k], v = dm4P(tk[k + 1]); if (v == null) return null;
    if (op === "×") cur = cur * v / DM4U;
    else { sum += sign * cur; sign = op === "+" ? 1n : -1n; cur = v; }
  }
  return sum + sign * cur;
}
const dm4M = (a, b) => dm4E(`${a}×${b}`);
const dm4V = e => dm4F(dm4E(e));
/* 받침에 맞는 조사(수는 마지막 숫자 읽기로) */
function dm4J(s, pair) {
  const str = String(s), c = str[str.length - 1];
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"], "이라": ["이라", "라"] };
  const [a, b] = M[pair];
  if (pair === "으로") return str + (has && !rieul ? a : b);
  return str + (has ? a : b);
}
/* 흔한 실수 찾기 (두 수의 곱) */
function dm4Diag(e, v) {
  if (!e || v == null) return null;
  const m = String(e).replace(/\s/g, "").match(/^([\d.]+)[×x*]([\d.]+)$/); if (!m) return null;
  const A = m[1], B = m[2], ok = dm4E(e); if (v === ok) return null;
  const da = dm4Dn(A), db = dm4Dn(B), D = da + db, N = BigInt(dm4Nat(A)) * BigInt(dm4Nat(B));
  for (let d = 0; d <= 9; d++) {
    if (d === D) continue;
    if (v === N * DM4U / 10n ** BigInt(d)) {
      if (d === 0) return `자연수의 곱 ${N}에 소수점을 찍지 않았어요. 곱의 소수점 아래 자리 수는 두 수의 소수점 아래 자리 수를 더한 ${D}자리예요.`;
      if (da && db && d === Math.max(da, db)) return "덧셈처럼 소수점을 맞추어 찍었어요. 곱셈에서는 두 수의 소수점 아래 자리 수를 더한 만큼 곱의 소수점 아래 자리 수가 정해져요.";
      return `숫자는 맞는데 소수점 위치가 달라요. 곱의 소수점 아래 자리 수는 ${da}+${db}=${D}(자리)예요. 어림해서 확인해 봐요.`;
    }
  }
  return null;
}
/* 분수 표기 [n/d], [w n/d] */
const DM4FR = "\\[(?:(\\d+) )?([\\d×().]+)\\/([\\d×().]+)\\]";
const dm4Re = () => new RegExp(DM4FR, "g");
function dm4Plain(s) { return String(s == null ? "" : s).replace(dm4Re(), (m, w, n, d) => `${w ? dm4J(w, "과와") + " " : ""}${d}분의 ${n}`); }
/*dm4-core-end*/

function dm4Style() {
  if (document.getElementById("dm4-style")) return;
  const s = document.createElement("style"); s.id = "dm4-style";
  s.textContent = `
.dm4fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.dm4fw{margin-right:.1em}
.dm4q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.dm4q>.dm4n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.dm4q>.dm4d{padding:.05em .14em 0}
.dm4row{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .4em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);margin:.4em 0;line-height:1.8}
input.dm4in{box-sizing:border-box;width:4.8em;height:1.7em;padding:0 .2em;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.dm4in.dm4w{width:8.5em}
input.dm4in.dm4s{width:3.4em}
.dm4fi{display:inline-flex;flex-direction:column;align-items:center;gap:.12em;vertical-align:middle}
.dm4fi input.dm4in{width:3.6em;height:1.45em}
.dm4fi .dm4bar{width:100%;height:0;font-size:0;line-height:0;border-top:.13em solid currentColor}
.dm4chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.dm4chs .opt{padding:.05em .55em}
.opt.dm4on{border-color:var(--ring);background:var(--ring-soft)}
.dm4q2{font-family:Jua,sans-serif;margin-top:.55em}
.dm4grp{border:2px solid var(--line);border-radius:.8em;padding:.35em .7em;margin:.45em 0}
.dm4gt{font-family:Jua,sans-serif;color:var(--night)}
.dm4ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.dm4stage svg{width:100%;height:auto;max-height:60vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r);touch-action:none;user-select:none}
.dm4stage.dm4sm svg{max-height:42vh}
.dm4rel{max-width:26em}
.dm4fig svg{width:100%;height:auto;display:block;max-height:44vh;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.dm4tools{display:flex;flex-wrap:wrap;gap:.4em;align-items:center;margin:.4em 0}
.dm4tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .75em;font-family:Jua,sans-serif;color:var(--ink)}
.dm4tools button:disabled{opacity:.45}
.dm4tools button.dm4hot{border-color:var(--ring);background:var(--ring-soft)}
.dm4say{font-family:Jua,sans-serif;color:var(--night);font-size:calc(var(--fs)*1.05);margin:.3em 0}
.dm4say b{color:var(--ring);font-weight:400}
.dm4talk{border-left:5px solid var(--pine);background:#F4FAF6;border-radius:.5em;padding:.35em .8em;margin:.35em 0}
.dm4talk p{margin:.2em 0}
.dm4talk b{color:var(--pine);font-family:Jua,sans-serif;font-weight:400}
.dm4vts{display:flex;flex-wrap:wrap;gap:.8em 1.6em;align-items:flex-start;margin:.3em 0}
.dm4vbox{min-width:0}
.dm4vcap{font-family:Jua,sans-serif;color:var(--night);font-size:var(--fs)}
.dm4vt{border-collapse:collapse;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.75);margin:.2em 0}
.dm4vt td{width:1.4em;height:1.5em;text-align:center;padding:0;line-height:1;position:relative}
.dm4vt tr.dm4sum td{border-top:3px solid var(--ink)}
.dm4vt tr.dm4sum2 td{border-top:2px solid #9AABA4}
.dm4vt input{box-sizing:border-box;width:1.25em;height:1.35em;font-size:.85em;text-align:center;font-family:Jua,sans-serif;border:2px solid var(--line);border-radius:.3em;padding:0;background:#fff;color:var(--ink)}
.dm4vt tr.dm4memo input{border-style:dashed;font-size:.7em;width:1.15em;height:1.2em;color:#5D6E68}
.dm4vt .dm4dot{position:absolute;right:-.12em;bottom:.12em;width:.22em;height:.22em;border-radius:50%;background:#C8472E}
.dm4vt button.dm4pt{position:absolute;right:-.22em;bottom:.02em;width:.42em;height:.42em;border-radius:50%;border:2px dashed #C8472E;background:#fff;padding:0;z-index:2}
.dm4vt button.dm4pt.dm4pon{background:#C8472E;border-style:solid}
.dm4memo-cap{font-size:var(--fs-s);color:var(--muted);font-family:"Gowun Dodum",sans-serif}
.dm4strip{display:inline-flex;align-items:flex-end;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.6)}
.dm4strip span.dm4c{position:relative;display:inline-block;width:1em;text-align:center}
.dm4strip span.dm4c.dm4g{color:#B9C5C0}
.dm4strip button.dm4pt{position:absolute;right:-.2em;bottom:.05em;width:.42em;height:.42em;border-radius:50%;border:2px dashed #C8472E;background:#fff;padding:0;z-index:2}
.dm4strip button.dm4pt.dm4pon{background:#C8472E;border-style:solid}
.dm4res{font-family:Jua,sans-serif;color:var(--pine);margin-left:.4em}
.dm4tbl{border-collapse:collapse;font-family:Jua,sans-serif;margin:.3em 0;max-width:100%}
.dm4tbl th,.dm4tbl td{border:2px solid var(--line);padding:.2em .5em;text-align:center}
.dm4tbl th{background:var(--pine-soft);font-weight:400}
.dm4cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.dm4cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2em;text-align:center}
.dm4cards .opt:disabled{opacity:.3}
.dm4slots{display:flex;gap:.3em;margin:.4em 0;flex-wrap:wrap;align-items:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4)}
.dm4slot{min-width:1.7em;height:2em;border:2px dashed var(--ring);border-radius:.4em;background:#fff;font-family:Jua,sans-serif;font-size:1em;padding:0 .2em;color:var(--ink)}
.dm4menu{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,10em),1fr));gap:.45em;margin:.3em 0}
.dm4menu .opt{text-align:center;font-family:Jua,sans-serif}
.dm4menu .opt small{display:block;color:var(--muted);font-family:"Gowun Dodum",sans-serif;font-size:.8em}
.dm4tray{border:3px dashed var(--line);border-radius:1.2em;min-height:3em;padding:.4em .6em;display:flex;flex-direction:column;gap:.35em;font-family:Jua,sans-serif}
.dm4tray .dm4ti{display:flex;flex-wrap:wrap;align-items:center;gap:.3em;background:#FFF5E3;border-radius:.6em;padding:.2em .5em}
.dm4tray .dm4ti b{font-weight:400;min-width:5.5em}
.dm4tray .dm4ti button{border:2px solid var(--line);background:#fff;border-radius:.5em;padding:0 .45em;font-family:Jua,sans-serif;color:var(--ink)}
.dm4tray .dm4amt{min-width:2.6em;text-align:center;color:var(--ring)}
.dm4mem{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.45em;margin:.4em 0;max-width:40em}
.dm4mem button{min-height:3.6em;border:2px solid var(--line);border-radius:.7em;background:#3E6F86;color:#fff;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.02);padding:.2em;word-break:keep-all}
.dm4mem button.dm4up{background:#fff;color:var(--ink);border-color:var(--ring)}
.dm4mem button.dm4got{background:#E6F3EC;color:var(--pine);border-color:var(--pine)}
.dm4score{display:flex;flex-wrap:wrap;gap:.6em;font-family:Jua,sans-serif;margin:.3em 0}
.dm4score span{border-radius:.6em;padding:.15em .7em;border:2px solid var(--line)}
.dm4score span.dm4turn{border-color:var(--ring);background:var(--ring-soft)}
.dm4big{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.6);color:var(--night)}
.dm4note{font-size:var(--fs-s);color:var(--muted)}
.dm4snote{border:2px dashed var(--line);border-radius:.8em;background:#FFFBEF;padding:.45em .9em;margin:.4em 0}
.dm4snote ul{margin:.25em 0 0 1.1em;padding:0}
.dm4snote li{margin:.15em 0}
`;
  document.head.append(s);
}
/* 분수 모양 요소와 글 속 분수 바꾸기 */
function dm4FracEl(w, n, d) {
  return h("span", { class: "dm4fr" }, w ? h("span", { class: "dm4fw" }, String(w)) : null,
    h("span", { class: "dm4q" }, h("span", { class: "dm4n" }, String(n)), h("span", { class: "dm4d" }, String(d))));
}
function dm4RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow,input")) return;
  const re = dm4Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(dm4FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function dm4RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return dm4RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(dm4RenderText);
}
(function dm4Boot() {
  dm4Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") dm4RenderText(m.target); else m.addedNodes.forEach(dm4RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(dm4Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
function dm4A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(dm4Plain) }) }); }
const dm4Quiz0 = quiz, dm4Blanks0 = blanks;
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done( 을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return dm4Quiz0(body, dm4A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return dm4Blanks0(body, dm4A(api), parts, o); };

const DM4C = { a: "#F6C08A", b: "#9CC6EC", t: "#F4A7B9", h: "#A9D8A2", one: "#8FB8E8", line: "#C9D4CF", dark: "#7A8C86", red: "#C8472E", blue: "#2B7BD6", g1: "#7DC36B", g2: "#F29A4A" };
function dm4Fig(svg, cls) { return h("div", { class: cls || "dm4fig" }, svg); }
/* SVG 쌓은 분수 */
function dm4SvgFr(x, y, n, d, size = 18, fill = INK) {
  const g = svgEl("g", { "pointer-events": "none" }), w = Math.max(String(n).length, String(d).length) * size * .6 + 6;
  g.append(txt(x, y - size * .62, String(n), size, { fill }), svgEl("line", { x1: x - w / 2, y1: y, x2: x + w / 2, y2: y, stroke: fill, "stroke-width": 2 }), txt(x, y + size * .66, String(d), size, { fill }));
  return g;
}
/* 두 곱셈식 사이의 관계 그림: rows=[["14","6","84"],["1.4","6","8.4"]], arr={a:"1/10", b:null, p:"1/10"} */
function dm4RelFig(rows, arr) {
  const W = 620, H = 230, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const xs = { a: 150, x: 235, b: 320, e: 405, p: 500 }, y1 = 50, y2 = 185;
  rows.forEach(([a, b, p], k) => { const y = k ? y2 : y1; g.append(txt(xs.a, y, a, 30), txt(xs.x, y, "×", 30), txt(xs.b, y, b, 30), txt(xs.e, y, "=", 30), txt(xs.p, y, p, 30)); });
  [["a", arr.a], ["b", arr.b], ["p", arr.p]].forEach(([k, f]) => {
    if (!f) return;
    const x = xs[k] - 52, [n, d] = f.split("/");
    g.append(svgEl("path", { d: `M${x + 30} ${y1 + 22} Q${x - 4} ${(y1 + y2) / 2} ${x + 30} ${y2 - 24}`, fill: "none", stroke: DM4C.red, "stroke-width": 2.5 }), svgEl("path", { d: `M${x + 30} ${y2 - 24} l-12 -4 l6 -10 z`, fill: DM4C.red }));
    g.append(dm4SvgFr(x - 34, (y1 + y2) / 2, n, d, 17, DM4C.red), txt(x - 5, (y1 + y2) / 2, "배", 17, { fill: DM4C.red }));
  });
  return dm4Fig(svg, "dm4fig dm4rel");
}
function dm4Talk(lines) { return h("div", { class: "dm4talk" }, lines.map(([who, t]) => h("p", {}, h("b", {}, who + " "), t))); }

/* ===== 묻는 칸 만들기 (모든 부품이 함께 씀) =====
   줄(parts): "글" | {n:"0.48", e:"0.12×4", why:{"틀린 값":"까닭"}} 수 칸 | {f:["84","10"], why:{"84/100":"까닭"}} 분수 칸 | {t:["글"]} 글 칸 | {o:[…], a, why} 고르기 | {m:[…], a:[…]} 여러 개 고르기 | {el: () => 요소} */
function dm4Reg() { return { items: [], plain: [] }; }
function dm4Parts(parts, reg) {
  const row = h("div", { class: "dm4row" }); const plain = [];
  parts.forEach(pt => {
    if (pt == null) return;
    if (typeof pt === "string" || typeof pt === "number") { row.append(h("span", {}, String(pt))); plain.push(dm4Plain(String(pt))); return; }
    if (pt.el) { row.append(pt.el()); return; }
    if (pt.n != null) {
      const want = dm4P(pt.n); if (want == null) throw new Error("답 형식 오류: " + pt.n);
      if (pt.e) { const v = dm4E(pt.e); if (v !== want) throw new Error(`답 확인 필요: ${pt.e} = ${pt.n} (계산 ${dm4F(v)})`); }
      const inp = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "dm4in" + (pt.w ? " dm4w" : "") + (pt.s ? " dm4s" : ""), "aria-label": "빈칸" });
      row.append(inp); reg.items.push({ k: "n", pt, inp, want }); plain.push(pt.show || String(pt.n)); return;
    }
    if (pt.f) {
      const ni = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "dm4in", "aria-label": "분자" });
      const di = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "dm4in", "aria-label": "분모" });
      row.append(h("span", { class: "dm4fi" }, ni, h("span", { class: "dm4bar" }, "​"), di));
      reg.items.push({ k: "f", pt, ni, di }); plain.push(`[${pt.f[0]}/${pt.f[1]}]`); return;
    }
    if (pt.t) {
      const inp = h("input", { type: "text", autocomplete: "off", class: "dm4in dm4w", "aria-label": "빈칸" });
      row.append(inp); reg.items.push({ k: "t", pt, inp }); plain.push(pt.t[0]); return;
    }
    if (pt.o || pt.m) {
      const multi = !!pt.m, list = pt.o || pt.m, sel = new Set(), box = h("span", { class: "dm4chs" });
      list.forEach((o, i) => box.append(h("button", { class: "opt", onclick: ev => {
        if (multi) { sel.has(i) ? sel.delete(i) : sel.add(i); ev.currentTarget.classList.toggle("dm4on"); }
        else { sel.clear(); sel.add(i); [...box.children].forEach(b => b.classList.remove("dm4on")); ev.currentTarget.classList.add("dm4on"); }
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
function dm4Rows(rows, reg) {
  const wrap = h("div");
  rows.forEach(r => {
    if (Array.isArray(r)) return wrap.append(dm4Parts(r, reg));
    if (r.g) { const g = h("div", { class: "dm4grp" }, h("div", { class: "dm4gt" }, r.g)); g.append(dm4Rows(r.rows, reg)); wrap.append(g); return; }
    if (r.fig) wrap.append(r.fig());
    if (r.q) wrap.append(h("div", { class: "dm4q2" }, r.q));
    if (r.p) wrap.append(dm4Parts(r.p, reg));
  });
  return wrap;
}
const dm4Int = s => { const t = dm4Norm(s); return /^\d+$/.test(t) ? String(BigInt(t)) : null; };
/* 채점: 처음 틀린 곳의 까닭을 돌려줘요 */
function dm4Judge(reg, opt = {}) {
  let bad = null; const given = [];
  reg.items.forEach(it => {
    const pt = it.pt;
    if (it.k === "n") {
      const raw = it.inp.value.trim(), v = dm4P(raw), ok = v != null && v === it.want;
      it.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; given.push(raw || "-");
      if (!ok && !bad) bad = raw === "" ? "빈칸에 답을 써요." : v == null ? "칸에는 수만 써요. 소수는 0.5처럼 써요." :
        (pt.why && pt.why[dm4F(v)]) || dm4Diag(pt.e, v) || pt.bad || opt.bad || "빨간 칸을 다시 생각해 봐요.";
      return;
    }
    if (it.k === "f") {
      const nr = it.ni.value.trim(), dr = it.di.value.trim(), n = dm4Int(nr), d = dm4Int(dr);
      const okN = n === String(BigInt(pt.f[0])), okD = d === String(BigInt(pt.f[1]));
      it.ni.style.borderColor = okN ? "var(--ok)" : "var(--no)"; it.di.style.borderColor = okD ? "var(--ok)" : "var(--no)";
      given.push(`${nr || "-"}/${dr || "-"}`);
      if ((!okN || !okD) && !bad) bad = (!nr || !dr) ? "분수의 분자와 분모 칸을 모두 채워요." : n == null || d == null ? "분수 칸에는 자연수만 써요." :
        (pt.why && pt.why[`${n}/${d}`]) || (!okD && /^10+$/.test(d) && /^10+$/.test(pt.f[1]) ? `소수점 아래 자리 수를 세어 봐요. 소수 한 자리 수는 분모가 10, 두 자리 수는 100, 세 자리 수는 1000인 분수예요.` : null) || pt.bad || "분수 칸을 다시 살펴봐요.";
      return;
    }
    if (it.k === "t") {
      const raw = it.inp.value.trim(), n = raw.replace(/\s/g, ""), ok = pt.t.some(x => x.replace(/\s/g, "") === n);
      it.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; given.push(raw || "-");
      if (!ok && !bad) bad = raw === "" ? "빈칸에 답을 써요." : (pt.why && pt.why[n]) || pt.bad || "빨간 칸을 다시 생각해 봐요.";
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
   같은 상태로는 다시 세지 않아요. */
function dm4sAuto(root, ready, sig, judge) {
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
/* 쓴 숫자의 개수(소수점 빼고, 쓴 그대로): "0.48" → 3 */
const dm4sDg = s => dm4Norm(s).replace(/[^0-9]/g, "").length;
/* 묻는 칸이 다 찼나요? 수 칸은 '1.'처럼 소수점까지만 쓴 중이거나, 칸에 있는 동안 답보다 숫자가 적으면 기다려요.
   글 칸은 칸을 떠나야(Enter·다른 곳 누르기) 다 쓴 것으로 봐요. */
function dm4sFilled(reg) {
  const act = document.activeElement;
  return reg.items.every(it => {
    if (it.k === "n") { const v = it.inp.value.trim(); if (!v || /[.．。·]$/.test(v)) return false; return act !== it.inp || dm4sDg(v) >= dm4sDg(dm4F(it.want)); }
    if (it.k === "f") { const n = it.ni.value.trim(), d = it.di.value.trim(); if (!n || !d) return false;
      if (act === it.ni && n.length < String(it.pt.f[0]).length) return false;
      if (act === it.di && d.length < String(it.pt.f[1]).length) return false; return true; }
    if (it.k === "t") return it.inp.value.trim() !== "" && act !== it.inp;
    if (it.k === "m") return it.sel.size >= it.pt.a.length;
    return it.sel.size > 0;
  });
}
function dm4sSig(reg) { return reg.items.map(it => it.k === "f" ? it.ni.value.trim() + "/" + it.di.value.trim() : it.inp ? it.inp.value.trim() : [...it.sel].sort().join(",")).join("§"); }
/* 저절로 확인(그림 조작 검사 → 줄 묶음 채점). pre(): 조작 검사 {bad, given}, more(): 조작 판이 다 찼는지(세로셈 등)
   묻는 칸이 있으면 다 채웠을 때 확인하고(조작이 덜 되었으면 그때 알려 줘요), 묻는 칸이 없으면 조작이 맞을 때 확인해요. 맞으면 api.done( 을 불러요. */
function dm4Check(body, api, reg, opt, pre, more) {
  body.__dm4 = () => reg;   // 점검용
  const ready = () => {
    if (more && !more()) return false;
    if (!dm4sFilled(reg)) return false;
    if (!reg.items.length && pre) { const p = pre(); if (p && p.bad) return false; }
    return true;
  };
  const sig = () => dm4sSig(reg) + "#" + (pre ? (pre() || {}).given || "" : "");
  dm4sAuto(body, ready, sig, () => {
    const p = pre ? pre() : null;
    if (p && p.bad) { api.fail(p.bad, p.given || "-"); return false; }
    const r = dm4Judge(reg, opt);
    const g = [p && p.given, r.given].filter(Boolean).join(" / ");
    if (r.bad) { api.fail(r.bad, g); return false; }
    api.tryOnce(); api.done(g, opt.ok); return true;
  });
}
/* ① 빈칸 줄 문제 */
function dm4Sent(body, api, rows, opt = {}) {
  /* 다 하면 dm4Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dm4Style();
  const reg = dm4Reg();
  if (opt.fig) body.append(opt.fig());
  body.append(dm4Rows(rows, reg));
  api.provide({ words: opt.words || [], answers: reg.plain.filter(Boolean) });
  dm4Check(body, api, reg, opt);
}

/* ===== ② 0.1(또는 0.01) 칸 막대 색칠하기 =====
   opt: {per:3, times:4, bars:2, cell:"0.1", asks, ok}  — 막대 하나는 10칸(=1 또는 0.1) */
function dm4Bars(body, api, opt) {
  /* 다 하면 dm4Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dm4Style();
  const bars = opt.bars || 1, per = opt.per, times = opt.times, total = bars * 10, need = per * times;
  const cw = 58, x0 = 40, bh = 52, gap = 104, W = x0 * 2 + cw * 10, H = 30 + bars * gap;
  const svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  let n = 0;
  const say = h("div", { class: "dm4say" }, "​");
  const unitV = dm4P(opt.cell || "0.1");
  const draw = () => {
    g.innerHTML = "";
    for (let b = 0; b < bars; b++) {
      const y = 40 + b * gap;
      for (let k = 0; k < 10; k++) {
        const i = b * 10 + k, grp = Math.floor(i / per), on = i < n;
        g.append(svgEl("rect", { x: x0 + k * cw, y, width: cw, height: bh, fill: on ? (grp % 2 ? DM4C.b : DM4C.a) : "#fff", stroke: DM4C.dark, "stroke-width": 1.4 }));
      }
      g.append(svgEl("rect", { x: x0, y, width: cw * 10, height: bh, fill: "none", stroke: INK, "stroke-width": 2.5 }));
      const lo = dm4F(unitV * 10n * BigInt(b)), hi = dm4F(unitV * 10n * BigInt(b + 1));
      g.append(txt(x0, y + bh + 20, lo, 19), txt(x0 + cw * 10, y + bh + 20, hi, 19));
    }
    // 묶음 표시(두 막대에 걸치면 나누어 그려요)
    const arc = (bar, c0, c1, lab) => {
      const y = 40 + bar * gap, xa = x0 + c0 * cw + 4, xb = x0 + (c1 + 1) * cw - 4;
      g.append(svgEl("path", { d: `M${xa} ${y - 4} Q${(xa + xb) / 2} ${y - 22} ${xb} ${y - 4}`, fill: "none", stroke: DM4C.red, "stroke-width": 2 }));
      if (lab) g.append(txt((xa + xb) / 2, y - 26, lab, 15, { fill: DM4C.red }));
    };
    for (let k = 0; k < Math.floor(n / per); k++) {
      const s0 = k * per, e0 = s0 + per - 1, sb = Math.floor(s0 / 10), eb = Math.floor(e0 / 10);
      if (sb === eb) arc(sb, s0 % 10, e0 % 10, String(k + 1));
      else { const big = 10 - s0 % 10 >= e0 % 10 + 1; arc(sb, s0 % 10, 9, big ? String(k + 1) : ""); arc(eb, 0, e0 % 10, big ? "" : String(k + 1)); }
    }
    say.innerHTML = ""; say.append(`${opt.cell || "0.1"}만큼인 칸을 `, h("b", {}, String(n)), "칸 칠했어요" + (n >= per ? ` (${opt.step || dm4F(unitV * BigInt(per))}씩 ${Math.floor(n / per)}번${n % per ? `과 ${n % per}칸` : ""})` : "") + ".");
  };
  const at = pt => { for (let b = 0; b < bars; b++) { const y = 40 + b * gap; if (pt.y >= y - 6 && pt.y <= y + bh + 6) { const k = Math.floor((pt.x - x0) / cw); if (k >= 0 && k < 10) return b * 10 + k; } } return -1; };
  let mode = 1;
  dragOn(svg, pt => { const i = at(pt); if (i < 0) return false; mode = i < n && i === n - 1 ? 0 : 1; n = mode ? i + 1 : i; draw(); }, pt => { const i = at(pt); if (i < 0) return; n = Math.max(0, Math.min(total, i + 1)); draw(); });
  const tools = h("div", { class: "dm4tools" },
    h("button", { onclick: () => { n = Math.min(total, n + per); draw(); } }, `${opt.step || dm4F(unitV * BigInt(per))}만큼 더 칠하기`),
    h("button", { onclick: () => { n = Math.max(0, n - 1); draw(); } }, "한 칸 지우기"),
    h("button", { onclick: () => { n = 0; draw(); } }, "처음으로"));
  draw();
  const reg = dm4Reg();
  const asks = opt.asks ? h("div", { class: "dm4ask" }, dm4Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dm4say" }, opt.tip || "칸을 누르거나 끌어서 칠해요. 단추로 한 묶음씩 칠할 수도 있어요."), h("div", { class: "dm4stage" }, svg), say, tools, asks);
  api.provide({ words: opt.words || [], answers: [`${need}칸 칠하기`].concat(reg.plain) });
  dm4Check(body, api, reg, opt, () => n !== need ? { bad: n < need ? `아직 덜 칠했어요. ${opt.step || dm4F(unitV * BigInt(per))}씩 ${times}번 칠해요.` : `너무 많이 칠했어요. ${opt.step || dm4F(unitV * BigInt(per))}씩 ${times}번만 칠해요.`, given: `${n}칸` } : { given: `${n}칸` });
}

/* ===== ③ 수 모형(1판·0.1 막대·0.01 조각)으로 묶음 놓기 =====
   opt: {unit:"0.12", times:4, frame:true, asks, ok} */
function dm4Blocks(body, api, opt) {
  /* 다 하면 dm4Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dm4Style();
  const u = dm4P(opt.unit), ones = Number(u / DM4U), tens = Number(u % DM4U / (DM4U / 10n)), hund = Number(u % (DM4U / 10n) / (DM4U / 100n));
  let k = 0, sorted = false, traded = 0;
  const W = 900, H = 250, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const s = 16;  // 0.01 조각 한 변
  const say = h("div", { class: "dm4say" }, "​");
  const drawRod = (x, y, c) => { g.append(svgEl("rect", { x, y, width: s, height: s * 10, fill: c, stroke: INK, "stroke-width": 1 })); for (let i = 1; i < 10; i++) g.append(svgEl("line", { x1: x, y1: y + i * s, x2: x + s, y2: y + i * s, stroke: "#5D6E68", "stroke-width": .5 })); };
  const drawSq = (x, y, c) => g.append(svgEl("rect", { x, y, width: s, height: s, fill: c, stroke: INK, "stroke-width": 1 }));
  const drawFlat = (x, y, c) => { g.append(svgEl("rect", { x, y, width: s * 10, height: s * 10, fill: c, stroke: INK, "stroke-width": 1.2 })); for (let i = 1; i < 10; i++) g.append(svgEl("line", { x1: x + i * s, y1: y, x2: x + i * s, y2: y + s * 10, stroke: "#5D6E68", "stroke-width": .5 }), svgEl("line", { x1: x, y1: y + i * s, x2: x + s * 10, y2: y + i * s, stroke: "#5D6E68", "stroke-width": .5 })); };
  const draw = () => {
    g.innerHTML = "";
    const top = 30;
    if (opt.frame) {
      // 정사각형 액자: 놓은 묶음 수만큼 변이 빨갛게
      const fx = 745, fy = 70, fs = 110;
      g.append(svgEl("rect", { x: fx, y: fy, width: fs, height: fs, fill: "#FFF7EA", stroke: "#B9C5C0", "stroke-width": 7 }));
      const sides = [[fx, fy, fx + fs, fy], [fx + fs, fy, fx + fs, fy + fs], [fx + fs, fy + fs, fx, fy + fs], [fx, fy + fs, fx, fy]];
      sides.slice(0, Math.min(k, 4)).forEach(([a, b, c, d]) => g.append(svgEl("line", { x1: a, y1: b, x2: c, y2: d, stroke: DM4C.red, "stroke-width": 7, "stroke-linecap": "round" })));
      g.append(txt(fx + fs / 2, fy - 30, `액자 한 변 ${opt.unit} m`, 18, { fill: DM4C.dark }));
    }
    if (!sorted) {
      let x = 30;
      for (let i = 0; i < k; i++) {
        const c = i % 2 ? DM4C.b : DM4C.a, x1 = x;
        for (let j = 0; j < ones; j++) { drawFlat(x, top, c); x += s * 10 + 6; }
        for (let j = 0; j < tens; j++) { drawRod(x, top, c); x += s + 5; }
        for (let j = 0; j < hund; j++) { drawSq(x, top + s * 10 - s, c); x += s + 3; }
        g.append(txt((x1 + x - 4) / 2, top + s * 10 + 22, opt.unit, 17, { fill: DM4C.dark }));
        x += 22;
      }
    } else {
      const oc = ones * k, tc = tens * k + traded, hc = hund * k - traded * 10;
      let x = 30;
      for (let j = 0; j < oc; j++) { drawFlat(x, top, DM4C.one); x += s * 10 + 8; }
      if (oc) x += 18;
      const xt = x;
      for (let j = 0; j < tc; j++) { drawRod(x, top, DM4C.t); x += s + 6; }
      if (tc) x += 18;
      for (let j = 0; j < hc; j++) { drawSq(x + (j % 10) * (s + 3), top + s * 10 - s - Math.floor(j / 10) * (s + 3), DM4C.h); }
      if (oc) g.append(txt(30 + (oc * (s * 10 + 8)) / 2, top + s * 10 + 22, `1이 ${oc}개`, 17, { fill: DM4C.dark }));
      if (tc) g.append(txt(xt + (tc * (s + 6)) / 2, top + s * 10 + 22, `0.1이 ${tc}개`, 17, { fill: DM4C.dark }));
      if (hc) g.append(txt(x + Math.min(hc, 10) * (s + 3) / 2, top + s * 10 + 22, `0.01이 ${hc}개`, 17, { fill: DM4C.dark }));
    }
    say.innerHTML = ""; say.append(`${opt.unit} 묶음 `, h("b", {}, String(k)), "개를 놓았어요." + (sorted ? " 같은 모형끼리 모았어요." : ""));
    tradeBtn.disabled = !(sorted && hund * k - traded * 10 >= 10);
  };
  const tradeBtn = h("button", { onclick: () => { if (hund * k - traded * 10 >= 10) { traded++; draw(); } } }, "0.01 조각 10개 → 0.1 막대 1개로 바꾸기");
  const tools = h("div", { class: "dm4tools" },
    h("button", { onclick: () => { if (k < opt.times + 2) { k++; sorted = false; traded = 0; draw(); } } }, `${opt.unit} 한 묶음 놓기`),
    h("button", { onclick: () => { if (k > 0) { k--; sorted = false; traded = 0; draw(); } } }, "한 묶음 빼기"),
    h("button", { onclick: () => { sorted = !sorted; traded = 0; draw(); } }, "같은 모형끼리 모으기 / 풀기"), tradeBtn);
  draw();
  const reg = dm4Reg();
  const asks = opt.asks ? h("div", { class: "dm4ask" }, dm4Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dm4say" }, opt.tip || `단추를 눌러 ${opt.unit}만큼인 수 모형 묶음을 놓고, 같은 모형끼리 모아 세어 보세요. 막대 하나는 0.1, 작은 조각 하나는 0.01이에요.`), tools, h("div", { class: "dm4stage dm4sm" }, svg), say, asks);
  api.provide({ words: opt.words || [], answers: [`${opt.unit} 묶음 ${opt.times}개`].concat(reg.plain) });
  dm4Check(body, api, reg, opt, () => k !== opt.times ? { bad: `${opt.unit} 묶음을 ${opt.times}개 놓아요.`, given: `${k}묶음` } : !sorted ? { bad: "‘같은 모형끼리 모으기’를 눌러 0.1 막대와 0.01 조각을 따로 세어 봐요.", given: `${k}묶음` } : { given: `${k}묶음` });
}

/* ===== ④ 수직선에서 뛰어 세기 =====
   opt: {to:"2", minor:"0.1", step:"0.3", hops:6, asks} */
function dm4Jump(body, api, opt) {
  /* 다 하면 dm4Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dm4Style();
  const mi = dm4P(opt.minor), N = Number(dm4P(opt.to) / mi), st = Number(dm4P(opt.step) / mi);
  const W = 1000, H = 220, x0 = 50, len = 900, y = 160, X = i => x0 + i * len / N;
  const svg = makeSvg(W, H), g = svgEl("g"), top = svgEl("g"); svg.append(g, top);
  g.append(svgEl("line", { x1: x0 - 10, y1: y, x2: x0 + len + 16, y2: y, stroke: INK, "stroke-width": 2.5 }), svgEl("path", { d: `M${x0 + len + 26} ${y} l-10 -6 v12 z`, fill: INK }));
  const per1 = Number(DM4U / mi);
  for (let i = 0; i <= N; i++) {
    const maj = i % per1 === 0, mid = i % (per1 / 2) === 0 && per1 % 2 === 0;
    g.append(svgEl("line", { x1: X(i), y1: y - (maj ? 16 : mid ? 11 : 7), x2: X(i), y2: y + (maj ? 16 : mid ? 11 : 7), stroke: INK, "stroke-width": maj ? 2.2 : 1.2 }));
    if (maj) g.append(txt(X(i), y + 36, dm4F(mi * BigInt(i)), 22));
  }
  let hops = [];   // 도착 눈금
  const say = h("div", { class: "dm4say" }, "​");
  const draw = () => {
    top.innerHTML = "";
    let prev = 0;
    hops.forEach((p, k) => {
      const a = X(prev), b = X(p), mx = (a + b) / 2;
      top.append(svgEl("path", { d: `M${a} ${y - 6} Q${mx} ${y - 92} ${b} ${y - 6}`, fill: "none", stroke: k % 2 ? DM4C.blue : DM4C.red, "stroke-width": 3 }), svgEl("path", { d: `M${b} ${y - 6} l-9 -11 l12 0 z`, fill: k % 2 ? DM4C.blue : DM4C.red }));
      top.append(txt(mx, y - 62, String(k + 1), 17, { fill: k % 2 ? DM4C.blue : DM4C.red }));
      prev = p;
    });
    say.innerHTML = ""; say.append(`${opt.step}씩 `, h("b", {}, String(hops.length)), "번 뛰었어요.");
  };
  dragOn(svg, pt => {
    if (pt.y < y - 110 || pt.y > y + 50) return false;
    const i = Math.round((pt.x - x0) / (len / N));
    const cur = hops.length ? hops[hops.length - 1] : 0;
    if (i === cur + st && i <= N) { hops.push(i); draw(); api.hint(""); }
    else if (i > cur) api.hint(`${opt.step}은 작은 눈금 ${st}칸이에요. ${dm4F(mi * BigInt(cur))}에서 작은 눈금 ${st}칸만큼 간 곳을 눌러요.`);
    return false;
  }, () => {});
  const tools = h("div", { class: "dm4tools" },
    h("button", { onclick: () => { const cur = hops.length ? hops[hops.length - 1] : 0; if (cur + st <= N) { hops.push(cur + st); draw(); } } }, `${opt.step}만큼 뛰기`),
    h("button", { onclick: () => { hops.pop(); draw(); } }, "한 번 되돌리기"), h("button", { onclick: () => { hops = []; draw(); } }, "처음으로"));
  draw();
  const reg = dm4Reg();
  const asks = opt.asks ? h("div", { class: "dm4ask" }, dm4Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dm4say" }, opt.tip || `0에서 시작해 ${opt.step}씩 뛰어 세어요. 도착할 눈금을 누르거나 단추를 눌러요.`), h("div", { class: "dm4stage dm4sm" }, svg), say, tools, asks);
  api.provide({ words: opt.words || [], answers: [`${opt.step}씩 ${opt.hops}번 뛰기`].concat(reg.plain) });
  dm4Check(body, api, reg, opt, () => hops.length !== opt.hops ? { bad: `${opt.step}씩 ${opt.hops}번 뛰어 세어요. 지금 ${hops.length}번 뛰었어요.`, given: `${hops.length}번` } : { given: `${hops.length}번` });
}

/* ===== ⑤ 이중 수직선: 아래(배)를 옮기면 위(양)가 따라와요 =====
   opt: {top:"2", unit:"m", what:"철사", bot:"1", step:"0.1", labels:["0.1","0.5","0.9"], target:"0.9", asks} */
function dm4Double(body, api, opt) {
  /* 다 하면 dm4Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dm4Style();
  const sv = dm4P(opt.step), N = Number(dm4P(opt.bot) / sv), T = Number(dm4P(opt.target) / sv);
  const W = 960, H = 300, x0 = 70, len = 800, yt = 105, yb = 215, X = i => x0 + i * len / N;
  const svg = makeSvg(W, H), g = svgEl("g"), mv = svgEl("g"); svg.append(g, mv);
  g.append(txt(x0 - 40, yt - 46, opt.what || "", 19, { fill: DM4C.dark, "text-anchor": "start" }));
  g.append(svgEl("rect", { x: x0, y: yt - 30, width: len, height: 18, rx: 6, fill: "#E8EEEB", stroke: "#B9C5C0" }));
  [yt, yb].forEach(yy => g.append(svgEl("line", { x1: x0 - 8, y1: yy, x2: x0 + len + 10, y2: yy, stroke: INK, "stroke-width": 2.5 })));
  for (let i = 0; i <= N; i++) {
    g.append(svgEl("line", { x1: X(i), y1: yt - 9, x2: X(i), y2: yt + 9, stroke: INK, "stroke-width": i === 0 || i === N ? 2.2 : 1.3 }));
    g.append(svgEl("line", { x1: X(i), y1: yb - 9, x2: X(i), y2: yb + 9, stroke: INK, "stroke-width": i === 0 || i === N ? 2.2 : 1.3 }));
    const bv = dm4F(sv * BigInt(i));
    if (i === 0 || i === N || (opt.labels || []).includes(bv)) g.append(txt(X(i), yb + 44, bv, 20));
  }
  g.append(txt(X(0), yt + 30, "0", 20), txt(X(N), yt + 30, `${opt.top}${opt.unit ? " " + opt.unit : ""}`, 20));
  (opt.topLabels || []).forEach(([i, t]) => g.append(txt(X(i), yt + 30, t, 20)));
  if (opt.q1 !== false) g.append(txt(X(1), yt + 30, "?", 20, { fill: DM4C.red }));
  g.append(txt(x0 + len + 46, yb, "(배)", 18, { fill: DM4C.dark }));
  if (opt.unit) g.append(txt(x0 + len + 46, yt, `(${opt.unit})`, 18, { fill: DM4C.dark }));
  let pos = 0;
  const say = h("div", { class: "dm4say" }, "​");
  const draw = () => {
    mv.innerHTML = "";
    if (pos > 0) mv.append(svgEl("rect", { x: x0, y: yt - 30, width: X(pos) - x0, height: 18, rx: 6, fill: opt.color || DM4C.a }), svgEl("rect", { x: x0, y: yb - 6, width: X(pos) - x0, height: 12, fill: DM4C.b, opacity: .8 }));
    mv.append(svgEl("line", { x1: X(pos), y1: yt - 34, x2: X(pos), y2: yb, stroke: DM4C.red, "stroke-width": 2, "stroke-dasharray": "6 5" }));
    mv.append(svgEl("path", { d: `M${X(pos)} ${yb + 2} l-13 22 h26 z`, fill: DM4C.blue, stroke: "#fff", "stroke-width": 2 }));
    say.innerHTML = ""; say.append("아래 파란 표시: ", h("b", {}, dm4F(sv * BigInt(pos)) + "배"), ` → 위 빨간 점선이 가리키는 곳이 ${opt.top} ${opt.unit}의 ${dm4F(sv * BigInt(pos))}배예요.`);
  };
  const snap = x => Math.max(0, Math.min(N, Math.round((x - x0) / (len / N))));
  dragOn(svg, pt => { if (pt.y < yb - 50) return false; pos = snap(pt.x); draw(); }, pt => { pos = snap(pt.x); draw(); });
  const tools = h("div", { class: "dm4tools" },
    h("button", { onclick: () => { pos = Math.max(0, pos - 1); draw(); } }, `◀ ${opt.step}배`), h("button", { onclick: () => { pos = Math.min(N, pos + 1); draw(); } }, `${opt.step}배 ▶`));
  draw();
  const reg = dm4Reg();
  const asks = opt.asks ? h("div", { class: "dm4ask" }, dm4Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dm4say" }, opt.tip || "아래 수직선의 파란 표시를 끌거나 단추를 눌러 옮겨 보세요."), h("div", { class: "dm4stage dm4sm" }, svg), say, tools, asks);
  api.provide({ words: opt.words || [], answers: [`파란 표시를 ${opt.target}배에`].concat(reg.plain) });
  dm4Check(body, api, reg, opt, () => pos !== T ? { bad: `아래 파란 표시를 ${opt.target}배인 곳으로 옮겨요. 작은 눈금 한 칸이 ${opt.step}배예요.`, given: dm4F(sv * BigInt(pos)) + "배" } : { given: opt.target + "배" });
}

/* ===== ⑥ 넓이 모델: 1 m×1 m 모눈에 가로·세로만큼 색칠하기 =====
   opt: {w:8, h:6, unit:"m", asks} */
function dm4Area(body, api, opt) {
  /* 다 하면 dm4Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dm4Style();
  const S = 330, c = S / 10, x0 = 110, y0 = 70, W = 560, H = 440;
  const svg = makeSvg(W, H), g = svgEl("g"), fg = svgEl("g"); svg.append(g, fg);
  const u = opt.unit || "m";
  g.append(svgEl("rect", { x: x0, y: y0, width: S, height: S, fill: "#fff" }));
  for (let k = 1; k < 10; k++) g.append(svgEl("line", { x1: x0 + k * c, y1: y0, x2: x0 + k * c, y2: y0 + S, stroke: "#9AABA4", "stroke-width": 1 }), svgEl("line", { x1: x0, y1: y0 + k * c, x2: x0 + S, y2: y0 + k * c, stroke: "#9AABA4", "stroke-width": 1 }));
  g.append(txt(x0 + S / 2, y0 + S + 26, `← 가로 1${u ? " " + u : ""} →`, 18, { fill: DM4C.dark }), txt(x0 + S + 40, y0 + S / 2, `세로 1${u ? " " + u : ""}`, 18, { fill: DM4C.dark, transform: `rotate(90 ${x0 + S + 40} ${y0 + S / 2})` }));
  let w = 0, hh = 0;
  const say = h("div", { class: "dm4say" }, "​");
  const draw = () => {
    fg.innerHTML = "";
    if (w && hh) fg.append(svgEl("rect", { x: x0, y: y0, width: w * c, height: hh * c, fill: opt.color || "#F6C08A", opacity: .85 }));
    for (let k = 1; k < 10; k++) fg.append(svgEl("line", { x1: x0 + k * c, y1: y0, x2: x0 + k * c, y2: y0 + S, stroke: "#9AABA4", "stroke-width": 1 }), svgEl("line", { x1: x0, y1: y0 + k * c, x2: x0 + S, y2: y0 + k * c, stroke: "#9AABA4", "stroke-width": 1 }));
    fg.append(svgEl("rect", { x: x0, y: y0, width: S, height: S, fill: "none", stroke: INK, "stroke-width": 2.5 }));
    if (w) fg.append(svgEl("path", { d: `M${x0} ${y0 - 14} H${x0 + w * c} M${x0} ${y0 - 20} v12 M${x0 + w * c} ${y0 - 20} v12`, stroke: DM4C.red, "stroke-width": 2.5, fill: "none" }), txt(x0 + w * c / 2, y0 - 28, `${dm4F(BigInt(w) * DM4U / 10n)} ${u}`, 18, { fill: DM4C.red }));
    if (hh) fg.append(svgEl("path", { d: `M${x0 - 14} ${y0} V${y0 + hh * c} M${x0 - 20} ${y0} h12 M${x0 - 20} ${y0 + hh * c} h12`, stroke: DM4C.blue, "stroke-width": 2.5, fill: "none" }), txt(x0 - 30, y0 + hh * c / 2, `${dm4F(BigInt(hh) * DM4U / 10n)} ${u}`, 18, { fill: DM4C.blue, "text-anchor": "end" }));
    fg.append(svgEl("circle", { cx: x0 + w * c, cy: y0 + hh * c, r: 11, fill: DM4C.blue, stroke: "#fff", "stroke-width": 3 }));
    say.innerHTML = ""; say.append(`가로 ${dm4F(BigInt(w) * DM4U / 10n)} ${u}, 세로 ${dm4F(BigInt(hh) * DM4U / 10n)} ${u} → 색칠한 칸 `, h("b", {}, String(w * hh)), "칸");
  };
  const set = pt => { w = Math.max(0, Math.min(10, Math.round((pt.x - x0) / c))); hh = Math.max(0, Math.min(10, Math.round((pt.y - y0) / c))); draw(); };
  dragOn(svg, pt => { if (pt.x < x0 - 30 || pt.y < y0 - 30) return false; set(pt); }, set);
  const tools = h("div", { class: "dm4tools" },
    h("button", { onclick: () => { w = Math.max(0, w - 1); draw(); } }, "가로 −0.1"), h("button", { onclick: () => { w = Math.min(10, w + 1); draw(); } }, "가로 +0.1"),
    h("button", { onclick: () => { hh = Math.max(0, hh - 1); draw(); } }, "세로 −0.1"), h("button", { onclick: () => { hh = Math.min(10, hh + 1); draw(); } }, "세로 +0.1"));
  draw();
  const reg = dm4Reg();
  const asks = opt.asks ? h("div", { class: "dm4ask" }, dm4Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "dm4say" }, opt.tip || "파란 점을 끌거나 모눈을 눌러 색칠할 직사각형을 만들어요. 왼쪽 위 꼭짓점에서 시작해요."), h("div", { class: "dm4stage dm4sm" }, svg), say, tools, asks);
  api.provide({ words: opt.words || [], answers: [`가로 ${opt.w}칸, 세로 ${opt.h}칸 색칠`].concat(reg.plain) });
  dm4Check(body, api, reg, opt, () => (w !== opt.w || hh !== opt.h) ? { bad: `가로는 ${dm4F(BigInt(opt.w) * DM4U / 10n)} ${u}(${opt.w}칸), 세로는 ${dm4F(BigInt(opt.h) * DM4U / 10n)} ${u}(${opt.h}칸)만큼 색칠해요. 모눈 한 칸의 한 변은 0.1 ${u}예요.`, given: `${w}×${hh}` } : { given: `${w}×${hh}칸` });
}

/* ===== ⑦ 세로셈: 자연수처럼 곱하고, 곱의 소수점 찍기 =====
   opt: {probs:[{a:"1.7", b:"4", cap}], rows, ok} — a를 위, b를 아래에 써요. */
function dm4VertBoard(pr) {
  const A = dm4Norm(pr.a), B = dm4Norm(pr.b), val = dm4M(A, B), na = dm4Nat(A), nb = dm4Nat(B);
  const N = (BigInt(na) * BigInt(nb)).toString(), D = dm4Dn(A) + dm4Dn(B);
  const cellsOf = s => { const out = []; [...s].forEach(ch => { if (ch === ".") out[out.length - 1].dot = true; else out.push({ d: ch }); }); return out; };
  const ca = cellsOf(A), cb = cellsOf(B), need = N.padStart(D + 1, "0").length;
  const C = Math.max(ca.length, cb.length + 1, need) + (pr.extra == null ? 1 : pr.extra);
  const td = (c) => { const e = h("td", {}, c ? c.d : "​"); if (c && c.dot) e.append(h("span", { class: "dm4dot" }, "​")); return e; };
  const rowOf = (cells, sign) => h("tr", {}, Array.from({ length: C - cells.length }, (_, i) => h("td", {}, i === C - cells.length - 1 && sign ? sign : "​")), cells.map(td));
  const memoRows = nb.length >= 2 ? Array.from(nb, (_, r) => h("tr", { class: "dm4memo" + (r === 0 ? " dm4sum" : "") }, Array.from({ length: C }, () => h("td", {}, h("input", { type: "text", inputmode: "numeric", maxlength: 1, "aria-label": "부분 곱 메모" }))))) : [];
  const ins = [], pts = []; let pIdx = -1;
  const resRow = h("tr", { class: memoRows.length ? "dm4sum2" : "dm4sum" }, Array.from({ length: C }, (_, k) => {
    const i = h("input", { type: "text", inputmode: "numeric", maxlength: 1, "aria-label": "곱의 숫자" });
    i.addEventListener("input", () => { i.value = i.value.replace(/[^0-9]/g, "").slice(-1); });
    ins.push(i);
    const b = k < C - 1 ? h("button", { class: "dm4pt", "aria-label": `${k + 1}번째 칸 뒤에 소수점 찍기`, onclick: () => { pIdx = pIdx === k ? -1 : k; pts.forEach((x, j) => x.classList.toggle("dm4pon", j === pIdx)); } }, "​") : null;
    if (b) pts.push(b);
    return h("td", {}, i, b);
  }));
  const tbl = h("table", { class: "dm4vt" }, rowOf(ca), rowOf(cb, "×"), ...memoRows, resRow);
  const el = h("div", { class: "dm4vbox" }, h("div", { class: "dm4vcap" }, pr.cap || `${A} × ${B}`), h("div", { style: "overflow-x:auto" }, tbl), memoRows.length ? h("div", { class: "dm4memo-cap" }, "점선 칸은 계산 메모(채점하지 않아요)") : null);
  const judge = () => {
    const v = ins.map(x => x.value);
    const first = v.findIndex(x => x !== "");
    if (first < 0) return { bad: `${A} × ${B}의 곱을 아래 칸에 써요.`, given: "-" };
    const last = v.length - 1 - [...v].reverse().findIndex(x => x !== "");
    if (v.slice(first, last + 1).some(x => x === "")) { ins.forEach((x, k) => { x.style.borderColor = k >= first && k <= last && x.value === "" ? "var(--no)" : ""; }); return { bad: "곱의 숫자 사이에 빈칸이 있어요. 빈칸 없이 이어서 써요.", given: v.join("") }; }
    if (pIdx >= 0 && (pIdx < first || pIdx >= last)) return { bad: pIdx < first ? "소수점 앞(일의 자리)에 숫자가 있어야 해요. 1보다 작은 곱이면 일의 자리에 0을 써요." : "소수점은 숫자 사이에 찍어요.", given: v.join("") };
    const digits = v.slice(first, last + 1).join(""), s = pIdx >= 0 ? v.slice(first, pIdx + 1).join("") + "." + v.slice(pIdx + 1, last + 1).join("") : digits;
    const got = dm4P(s), ok = got === val;
    ins.forEach((x, k) => { x.style.borderColor = k >= first && k <= last ? (ok ? "var(--ok)" : "var(--no)") : ""; });
    if (ok) return { ok: true, given: s };
    const nd = String(BigInt(digits));
    if (nd !== N && nd !== N.replace(/0+$/, "")) return { bad: `${A} × ${B}: 먼저 자연수의 곱셈 ${na} × ${nb}를 다시 계산해 봐요.`, given: s };
    if (pIdx < 0) return { bad: `${A} × ${B}: 곱의 소수점을 찍어요. 곱의 소수점 아래 자리 수는 ${dm4Dn(A)}+${dm4Dn(B)}=${D}(자리)예요.`, given: s };
    return { bad: `${A} × ${B}: ` + (dm4Diag(`${A}×${B}`, got) || `곱의 소수점 아래 자리 수는 ${dm4Dn(A)}+${dm4Dn(B)}=${D}(자리)예요.`), given: s };
  };
  /* 다 썼나요? 곱의 숫자를 답만큼 썼고(칸에 있는 동안), 소수점이 필요하면 찍었거나 칸을 떠났을 때 */
  const needDg = dm4F(val).replace(".", "").length;
  const full = () => {
    const cnt = ins.filter(x => x.value !== "").length; if (!cnt) return false;
    const inHere = el.contains(document.activeElement) && document.activeElement.tagName === "INPUT";
    if (!inHere) return true;
    return cnt >= needDg && (D === 0 || pIdx >= 0);
  };
  return { el, judge, full, ans: `${A} × ${B} = ${dm4F(val)}` };
}
function dm4Vert(body, api, opt) {
  /* 다 하면 dm4Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dm4Style();
  if (opt.fig) body.append(opt.fig());
  const reg = dm4Reg();
  const boards = opt.probs.map(dm4VertBoard);
  body.append(h("div", { class: "dm4say" }, opt.tip || "① 소수점이 없다고 생각하고 자연수의 곱셈처럼 계산해 맨 아래 칸에 써요. ② 곱의 소수점을 찍을 숫자 오른쪽 아래의 빨간 동그라미를 눌러요."), h("div", { class: "dm4vts" }, boards.map(b => b.el)));
  if (opt.rows) body.append(h("div", { class: "dm4ask" }, dm4Rows(opt.rows, reg)));
  api.provide({ words: opt.words || ["자연수의 곱셈", "소수점 아래 자리 수", "곱의 소수점"], answers: boards.map(b => b.ans).concat(reg.plain) });
  dm4Check(body, api, reg, opt, () => {
    const rs = boards.map(b => b.judge()), bad = rs.find(r => r.bad);
    return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") };
  }, () => boards.every(b => b.full()));
}

/* ===== ⑧ 자연수의 곱에 소수점 찍기 =====
   opt: {items:[{e:"5.7×3.9", digits?}], intro, asks} */
function dm4Point(body, api, opt) {
  /* 다 하면 dm4Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dm4Style();
  const reg = dm4Reg();
  const rows = opt.items.map(it => {
    const m = it.e.match(/^([\d.]+)×([\d.]+)$/), val = dm4E(it.e);
    const N = it.digits || (BigInt(dm4Nat(m[1])) * BigInt(dm4Nat(m[2]))).toString(), D = dm4Dn(m[1]) + dm4Dn(m[2]);
    const Z = Math.max(2, D + 1 - N.length);
    const cells = "0".repeat(Z).split("").map(d => ({ d, g: true })).concat([...N].map(d => ({ d })));
    let p = -1;
    const res = h("span", { class: "dm4res" }, "​"), pts = [];
    const show = () => {
      pts.forEach((b, j) => b.classList.toggle("dm4pon", j === p));
      if (p < 0) { res.textContent = "​"; return; }
      const s = cells.slice(0, p + 1).map(c => c.d).join("") + "." + cells.slice(p + 1).map(c => c.d).join("");
      res.textContent = "→ " + dm4F(dm4P(s));
    };
    const strip = h("span", { class: "dm4strip" }, cells.map((c, j) => {
      const b = j < cells.length - 1 ? h("button", { class: "dm4pt", "aria-label": "여기에 소수점", onclick: () => { p = p === j ? -1 : j; show(); } }, "​") : null;
      if (b) pts.push(b);
      return h("span", { class: "dm4c" + (c.g ? " dm4g" : "") }, c.d, b);
    }));
    const row = h("div", { class: "dm4row" }, h("span", { style: "min-width:7.6em" }, it.e.replace("×", " × ") + " ="), strip, res);
    const judge = () => {
      if (p < 0) return { bad: `${it.e.replace("×", " × ")}: 소수점을 찍을 곳의 빨간 동그라미를 눌러요.`, given: "-" };
      const s = cells.slice(0, p + 1).map(c => c.d).join("") + "." + cells.slice(p + 1).map(c => c.d).join(""), got = dm4P(s);
      if (got === val) return { given: dm4F(got) };
      return { bad: `${it.e.replace("×", " × ")}: ` + (dm4Diag(it.e, got) || `곱의 소수점 아래 자리 수는 ${D}자리예요.`), given: dm4F(got) };
    };
    return { row, judge, has: () => p >= 0, ans: `${it.e.replace("×", " × ")} = ${dm4F(val)}` };
  });
  if (opt.intro) body.append(opt.intro());
  body.append(h("div", { class: "dm4say" }, opt.tip || "숫자 오른쪽 아래의 빨간 동그라미를 눌러 곱의 소수점을 찍어요. 흐린 0은 소수점 앞에 0이 필요할 때 쓰는 자리예요."), ...rows.map(r => r.row));
  if (opt.asks) body.append(h("div", { class: "dm4ask" }, dm4Rows(opt.asks, reg)));
  api.provide({ words: opt.words || ["소수점 아래 자리 수", "더한 만큼"], answers: rows.map(r => r.ans).concat(reg.plain) });
  dm4Check(body, api, reg, opt, () => { const rs = rows.map(r => r.judge()), bad = rs.find(r => r.bad); return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") }; }, () => rows.every(r => r.has()));
}

/* ===== ⑨ 곱하는 수에 따라 곱의 소수점 옮기기 =====
   opt: {sets:[{name:"가", start:"0.15", fs:["1","10","100","1000"]}], asks} — 숫자는 그대로, 빨간 소수점이 움직여요. */
function dm4Shift(body, api, opt) {
  /* 다 하면 dm4Check가 api.done( 을 불러요 — 한 계단 여러 활동(hj-multi)에서 이 부품을 하나로 세요 */
  dm4Style();
  const reg = dm4Reg(), sets = [];
  opt.sets.forEach(S => {
    const s = dm4Norm(S.start), [ip, fp = ""] = s.split(".");
    const digs = []; [...ip].forEach((d, k) => digs.push({ d, e: ip.length - 1 - k })); [...fp].forEach((d, k) => digs.push({ d, e: -1 - k }));
    const EH = 3, EL = -4, cols = EH - EL + 1, cw = 70, x0 = 30, W = x0 * 2 + cols * cw, H = 140;
    const cx = e => x0 + (EH - e) * cw + cw / 2;
    const svg = makeSvg(W, H), bg = svgEl("g"), fg = svgEl("g"), pg = svgEl("g"); svg.append(bg, fg, pg);
    for (let e = EH; e >= EL; e--) {
      bg.append(svgEl("rect", { x: cx(e) - cw / 2, y: 20, width: cw, height: 100, fill: "#F7F9F8", stroke: DM4C.line, "stroke-width": 2 }));
    }
    const dot = svgEl("circle", { cx: 0, cy: 104, r: 8, fill: DM4C.red });
    dot.style.transition = "transform .55s ease";
    pg.append(dot);
    const show = q => {   // 소수점이 지수 q 칸의 오른쪽(q 이상은 자연수 부분)
      fg.innerHTML = "";
      const es = digs.map(o => o.e), hi = Math.max(...es), lo = Math.min(...es), val = {};
      digs.forEach(o => { val[o.e] = o.d; });
      const nzAbove = e => digs.some(o => o.e > e && o.d !== "0"), nzBelow = e => digs.some(o => o.e < e && o.d !== "0");
      for (let e = EH; e >= EL; e--) {
        let ch = val[e], grey = false;
        if (ch == null) {
          if ((e < lo && e >= q) || (e === q && e > hi) || (e < q && e > hi)) ch = "0"; else continue;
        } else if (ch === "0") {
          if (e > q && !nzAbove(e)) grey = true;          // 맨 앞의 쓸데없는 0
          if (e < q && !nzBelow(e)) grey = true;          // 소수 끝자리의 0
        }
        fg.append(txt(cx(e), 76, ch, 46, { fill: grey ? "#B9C5C0" : INK }));
      }
      dot.style.transform = `translate(${cx(q) + cw / 2}px,0px)`;
    };
    const cur = h("div", { class: "dm4say" }, "​");
    const tbl = h("table", { class: "dm4tbl" }, h("tr", {}, h("th", {}, "곱셈식"), h("th", {}, "곱")));
    const done = new Set();
    const btns = S.fs.map(f => h("button", { onclick: ev => {
      const k = dm4Dn(f) ? -dm4Dn(f) : Math.round(Math.log10(+f)), q = -k, r = dm4M(s, f);
      show(q);
      cur.innerHTML = ""; cur.append(`${s} × ${f} = `, h("b", {}, dm4F(r)), k === 0 ? " (소수점이 그대로예요)" : ` (소수점이 ${k > 0 ? "오른쪽" : "왼쪽"}으로 ${Math.abs(k)}자리 옮겨졌어요)`);
      if (!done.has(f)) { done.add(f); tbl.append(h("tr", {}, h("td", {}, `${s} × ${f}`), h("td", {}, dm4F(r)))); }
      ev.currentTarget.classList.add("dm4hot");
    } }, `× ${f}`));
    show(0);
    sets.push({ S, done });
    body.append(h("div", { class: "dm4grp" }, h("div", { class: "dm4gt" }, `${S.name ? S.name + " · " : ""}${s}에 곱해 보기`), h("div", { class: "dm4tools" }, btns), h("div", { class: "dm4stage dm4sm" }, svg), cur, h("div", { style: "overflow-x:auto" }, tbl)));
  });
  if (opt.asks) body.append(h("div", { class: "dm4ask" }, dm4Rows(opt.asks, reg)));
  api.provide({ words: ["오른쪽으로 한 자리씩", "왼쪽으로 한 자리씩", "0의 개수만큼", "소수점 아래 자리 수만큼"], answers: reg.plain });
  dm4Check(body, api, reg, opt, () => {
    const miss = sets.find(x => x.S.fs.some(f => !x.done.has(f)));
    return miss ? { bad: `${miss.S.start}에 곱하는 단추를 모두 눌러 소수점이 어떻게 움직이는지 직접 살펴봐요.`, given: "-" } : { given: "판 조작 완료" };
  });
}

/* ===== ⑩ 수 카드로 곱셈식 만들기 =====
   opt: {cards:["7","3","6"], pat:["□","×","□",".","□"], goal:"min"|"max", after: rows(made) } */
function dm4Cards(body, api, opt) {
  dm4Style();
  const nSlot = opt.pat.filter(x => x === "□").length, slots = Array(nSlot).fill(null);
  const exprOf = arr => { let k = 0; return opt.pat.map(x => x === "□" ? opt.cards[arr[k++]] : x).join(""); };
  // 가장 큰/작은 곱 찾기(모든 순서)
  const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map(p => [x].concat(p)));
  const all = perms(opt.cards.map((_, i) => i)).map(p => ({ p, e: exprOf(p.slice(0, nSlot)), v: dm4E(exprOf(p.slice(0, nSlot))) }));
  const best = all.reduce((b, x) => (opt.goal === "max" ? x.v > b.v : x.v < b.v) ? x : b, all[0]);
  const pool = h("div", { class: "dm4cards" }), row = h("div", { class: "dm4slots" }), say = h("div", { class: "dm4say" }, "​"), more = h("div", { class: "dm4ask hidden" });
  let reg = dm4Reg(), made = null;
  const cardBtns = opt.cards.map((c, i) => h("button", { class: "opt", onclick: () => { const k = slots.indexOf(null); if (k < 0) return; slots[k] = i; paint(); } }, c));
  pool.append(...cardBtns);
  let si = 0;
  const slotBtns = [];
  opt.pat.forEach(x => {
    if (x === "□") { const k = si++; const b = h("button", { class: "dm4slot", "aria-label": `${k + 1}번째 칸`, onclick: () => { slots[k] = null; paint(); } }, "​"); slotBtns.push(b); row.append(b); }
    else row.append(h("span", {}, x === "×" ? " × " : x));
  });
  function paint() {
    cardBtns.forEach((b, i) => { b.disabled = slots.includes(i); });
    slotBtns.forEach((b, k) => { b.textContent = slots[k] == null ? "​" : opt.cards[slots[k]]; });
    const full = slots.every(x => x != null), e = full ? exprOf(slots) : null;
    if (e === made) return;
    made = null; more.innerHTML = ""; more.classList.add("hidden"); reg = dm4Reg();
    if (!full) { say.textContent = "카드를 누르면 빈칸에 차례대로 놓여요. 놓인 카드를 누르면 돌아가요."; return; }
    const v = dm4E(e);
    if (v !== best.v) { say.textContent = `${e.replace("×", " × ")} — 곱이 ${opt.goal === "max" ? "더 큰" : "더 작은"} 식을 만들 수 있어요. 카드를 바꾸어 봐요.`; return; }
    made = e; say.textContent = `만든 식: ${e.replace("×", " × ")}`;
    more.append(dm4Rows(opt.after(e, dm4F(v)), reg)); more.classList.remove("hidden");
  }
  paint();
  body.__dm4 = () => reg;
  body.append(h("div", { class: "dm4say" }, opt.tip || "수 카드를 골라 빈칸에 놓아 곱셈식을 만들어요. 여러 가지로 바꾸어 놓아 보는 것이 이 활동이에요."), pool, row, say, more);
  api.provide({ words: opt.words || [], answers: [`${best.e.replace("×", " × ")} = ${dm4F(best.v)}`] });
  /* 곱이 가장 큰(작은) 식을 만들면 물음이 열리고, 물음을 다 채우면 저절로 확인해서 api.done( 을 불러요 */
  dm4sAuto(body, () => made != null && dm4sFilled(reg), () => made + "#" + dm4sSig(reg), () => {
    const r = dm4Judge(reg, opt);
    if (r.bad) { api.fail(r.bad, made + " / " + r.given); return false; }
    api.tryOnce(); api.done(made + " / " + r.given, opt.ok); return true;
  });
}

/* ===== ⑫ 캠프 식판 담기와 열량 구하기 (10차시) =====
   캠프 식단표의 열량은 이 이야기를 위해 정한 값이에요(실제 음식마다 달라요). opt: {who:"저녁", want:{0:"0.8",…} | null(마음대로), lo, hi, asks(tot)} */
const DM4FOOD = [
  { n: "카레라이스", u: "그릇", k: "486" }, { n: "삶은 옥수수", u: "개", k: "112.5" }, { n: "소시지", u: "개", k: "58.4" },
  { n: "참치 주먹밥", u: "개", k: "168.5" }, { n: "미역국", u: "그릇", k: "64" }, { n: "사과", u: "개", k: "95.5" }, { n: "우유", u: "컵", k: "125" }];
(function dm4FoodCheck() { DM4FOOD.forEach(f => { if (dm4P(f.k) == null) throw new Error("열량 오류 " + f.n); }); })();
function dm4FoodTable() {
  return h("div", { style: "overflow-x:auto" }, h("table", { class: "dm4tbl" }, h("tr", {}, h("th", {}, "캠프 음식"), h("th", {}, "열량(킬로칼로리)")),
    DM4FOOD.map(f => h("tr", {}, h("td", {}, `${f.n} 1${f.u}`), h("td", {}, f.k)))));
}
function dm4KcalBar(total, goal = "600") {
  const W = 900, H = 150, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const max = 800, X = v => 40 + Math.min(v, max) / max * 800, tv = Number(dm4F(total)), gv = Number(goal);
  g.append(svgEl("rect", { x: 40, y: 40, width: X(tv) - 40, height: 40, rx: 8, fill: DM4C.a }), txt(Math.max(140, X(tv) / 2 + 20), 60, `${dm4F(total)} 킬로칼로리`, 20));
  g.append(svgEl("line", { x1: X(gv), y1: 22, x2: X(gv), y2: 100, stroke: DM4C.red, "stroke-width": 3, "stroke-dasharray": "7 5" }), txt(X(gv), 118, `캠프 한 끼 목표 ${goal} 킬로칼로리`, 18, { fill: DM4C.red }));
  for (let v = 0; v <= 800; v += 100) g.append(txt(X(v), 140, String(v), 13, { fill: DM4C.dark }));
  return dm4Fig(svg);
}
function dm4Meal(body, api, opt) {
  dm4Style();
  /* 식판을 다 담고 계산 칸을 다 채우면 저절로 확인해서 api.done( 을 불러요 */
  const tray = new Map(); // 음식 번호 → 양(BigInt)
  const trayBox = h("div", { class: "dm4tray" });
  const menu = h("div", { class: "dm4menu" }, DM4FOOD.map((f, i) => h("button", { class: "opt", onclick: () => { if (locked) return; if (!tray.has(i)) tray.set(i, 0n); paint(); } }, f.n, h("small", {}, `1${f.u} ${f.k} 킬로칼로리`))));
  let locked = false, reg = dm4Reg(), tot = 0n;
  const work = h("div", { class: "dm4ask hidden" }), barBox = h("div");
  const paint = () => {
    trayBox.innerHTML = "";
    if (!tray.size) trayBox.append(h("span", { class: "dm4note" }, "위 음식 카드를 눌러 식판에 담아요."));
    [...tray.keys()].sort((a, b) => a - b).forEach(i => {
      const f = DM4FOOD[i], amt = tray.get(i);
      const step = d => () => { if (locked) return; let v = amt + d; if (v < 0n) v = 0n; if (v > 5n * DM4U) v = 5n * DM4U; tray.set(i, v); paint(); };
      trayBox.append(h("div", { class: "dm4ti" }, h("b", {}, f.n), h("button", { onclick: step(-DM4U) }, "−1"), h("button", { onclick: step(-DM4U / 10n) }, "−0.1"),
        h("span", { class: "dm4amt" }, `${dm4F(amt)}${f.u}`), h("button", { onclick: step(DM4U / 10n) }, "+0.1"), h("button", { onclick: step(DM4U) }, "+1"),
        h("button", { onclick: () => { if (locked) return; tray.delete(i); paint(); } }, "빼기")));
    });
  };
  paint();
  body.__dm4 = () => reg;
  const lockBtn = h("button", { class: "big", onclick: () => {
    if (locked) return;
    const items = [...tray.entries()].filter(([, v]) => v > 0n).sort((a, b) => a[0] - b[0]);
    if (opt.want) {
      const keys = Object.keys(opt.want).map(Number);
      const miss = keys.find(k => !tray.has(k) || tray.get(k) === 0n);
      if (miss != null) return api.fail(`${DM4FOOD[miss].n}도 식판에 담고 양을 정해요.`, "식판");
      const extra = items.find(([k]) => !keys.includes(k));
      if (extra) return api.fail(`${dm4J(DM4FOOD[extra[0]].n, "은는")} ${opt.who}에 먹지 않았어요. 빼요.`, "식판");
      const wrong = keys.find(k => tray.get(k) !== dm4P(opt.want[k]));
      if (wrong != null) return api.fail(`${DM4FOOD[wrong].n}의 양을 다시 살펴봐요. 쪽지에 적힌 양만큼 담아요.`, "식판");
    } else if (items.length < 2) return api.fail("음식을 두 가지 이상 담고 양을 정해요.", "식판");
    locked = true; lockBtn.classList.add("hidden"); api.hint("식판을 다 담았어요. 이제 열량을 계산해 봐요.");
    const rows = items.map(([i, v]) => { const f = DM4FOOD[i], e = `${f.k}×${dm4F(v)}`; return [`${f.n} ${dm4F(v)}${f.u}: ${f.k} × ${dm4F(v)} =`, { n: dm4V(e), e }, "킬로칼로리"]; });
    tot = items.reduce((s, [i, v]) => s + dm4M(DM4FOOD[i].k, dm4F(v)), 0n);
    rows.push(["모두 더하면", { n: dm4F(tot), e: items.map(([i, v]) => `${DM4FOOD[i].k}×${dm4F(v)}`).join("+") }, "킬로칼로리"]);
    work.append(h("div", { class: "dm4say" }, "음식별 열량과 먹은 양을 곱해 보세요. 복잡한 계산은 세로셈이나 계산기로 해도 돼요."), dm4Rows(rows.concat(opt.asks ? opt.asks(tot) : []), reg));
    work.classList.remove("hidden");
    api.provide({ words: ["열량", "먹은 양", "곱해요"], answers: reg.plain });
  } }, "식판에 다 담았어요");
  const again = h("button", { class: "ghost", onclick: () => { locked = false; reg = dm4Reg(); work.innerHTML = ""; work.classList.add("hidden"); barBox.innerHTML = ""; lockBtn.classList.remove("hidden"); api.hint("식판을 다시 짜 봐요."); } }, "식판 다시 짜기");
  body.append(h("div", { class: "dm4say" }, opt.tip || `${opt.who}에 먹은 음식을 식판에 담고, +·− 단추로 먹은 양을 맞추어 보세요.`), menu, h("div", { class: "dm4gt" }, `${opt.who} 식판`), trayBox, h("div", { class: "dm4tools" }, lockBtn, opt.want ? null : again), work, barBox);
  api.provide({ words: ["열량", "먹은 양"], answers: opt.want ? Object.keys(opt.want).map(k => `${DM4FOOD[k].n} ${opt.want[k]}${DM4FOOD[k].u}`) : [] });
  dm4sAuto(body, () => locked && dm4sFilled(reg), () => dm4sSig(reg), () => {
    const r = dm4Judge(reg, opt);
    if (r.bad) { api.fail(r.bad, r.given); return false; }
    if (opt.lo && (tot < dm4P(opt.lo) || tot > dm4P(opt.hi))) { api.fail(`열량의 합이 ${dm4F(tot)} 킬로칼로리예요. ${opt.lo}~${opt.hi} 킬로칼로리가 되게 ‘식판 다시 짜기’를 눌러 다시 짜 봐요.`, r.given); return false; }
    barBox.innerHTML = ""; barBox.append(dm4KcalBar(tot));
    api.tryOnce(); api.done(r.given, opt.ok); return true;
  });
}

/* ===== ⑬ 땅따먹기 놀이판 (11차시) =====
   캠프 운동장 6×6 판: 웅덩이 2칸, 보너스 2칸, 식 32칸((소수)×(자연수)·(자연수)×(소수)·(소수)×(소수)). 모든 곱은 코드가 계산해요. */
const DM4BOARD = [
  "3.5×2.4", "0.7×6", "2.4×5", "P", "0.16×5", "4.25×2",
  "5×0.8", "12×1.5", "8×0.75", "4×0.35", "B", "0.6×0.7",
  "1.4×2.5", "3.2×0.5", "0.25×0.8", "2.5×1.8", "0.12×0.5", "6.4×3",
  "3.05×4", "B", "7×0.9", "20×0.15", "1.5×3.6", "0.9×0.08",
  "5×4.12", "0.65×4", "P", "1.2×1.2", "0.8×0.8", "2.6×0.5",
  "4.8×1.25", "25×0.4", "1.6×2.3", "0.45×6", "2.05×0.2", "3.6×0.5"];
(function dm4BoardCheck() { DM4BOARD.forEach(c => { if (c !== "P" && c !== "B" && dm4E(c) == null) throw new Error("놀이판 식 오류 " + c); }); })();
function dm4RunScore(owner, R, C, who) {
  let cells = 0, bonus = 0; const B = L => L >= 4 ? 7 : L === 3 ? 5 : L === 2 ? 2 : 0;
  for (let i = 0; i < R * C; i++) if (owner[i] === who) cells++;
  for (let r = 0; r < R; r++) { let L = 0; for (let c = 0; c <= C; c++) { if (c < C && owner[r * C + c] === who) L++; else { bonus += B(L); L = 0; } } }
  for (let c = 0; c < C; c++) { let L = 0; for (let r = 0; r <= R; r++) { if (r < R && owner[r * C + c] === who) L++; else { bonus += B(L); L = 0; } } }
  return { cells, bonus, total: cells + bonus };
}
/* 점수 연습용 판 그림: rows = ["GG.O", …] (G 연두, O 주황, P 연못, B 보너스(색칠 전), . 빈 땅) */
function dm4MiniBoard(rows) {
  const R = rows.length, C = rows[0].length, s = 70, svg = makeSvg(C * s + 20, R * s + 20), g = svgEl("g"); svg.append(g);
  rows.forEach((row, r) => [...row].forEach((ch, c) => {
    const fill = ch === "G" ? DM4C.g1 : ch === "O" ? DM4C.g2 : ch === "P" ? "#9CC9E8" : "#FFFDF6";
    g.append(svgEl("rect", { x: 10 + c * s, y: 10 + r * s, width: s, height: s, fill, stroke: "#8E9C96", "stroke-width": 2 }));
    if (ch === "P") g.append(txt(10 + c * s + s / 2, 10 + r * s + s / 2, "웅덩이", 17, { fill: "#2D5F80" }));
  }));
  return svg;
}
function dm4Land(body, api, opt) {
  dm4Style();
  const R = 6, C = 6, cs = 80, bx = 60, by = 20, BW = C * cs, BH = R * cs, W = BW + bx * 2, H = by + BH + 140;
  const sy = by + BH + 80;   // 출발선
  const svg = makeSvg(W, H), g = svgEl("g"), mk = svgEl("g"), top = svgEl("g"); svg.append(g, mk, top);
  const owner = Array(R * C).fill(null), TURNS = opt.turns || 10;
  const P = [{ n: "연두", c: DM4C.g1 }, { n: "주황", c: DM4C.g2 }];
  let turn = 0, count = [0, 0], stone = { x: W / 2, y: sy }, phase = "aim", aim = null, cellAt = -1;
  const drawBoard = () => {
    g.innerHTML = "";
    DM4BOARD.forEach((t, i) => {
      const r = Math.floor(i / C), c = i % C, x = bx + c * cs, y = by + r * cs, o = owner[i];
      const fill = o != null ? P[o].c : t === "P" ? "#9CC9E8" : t === "B" ? "#FFF0B8" : "#FFFDF6";
      g.append(svgEl("rect", { x, y, width: cs, height: cs, fill, stroke: "#8E9C96", "stroke-width": 2 }));
      g.append(txt(x + cs / 2, y + cs / 2, t === "P" ? "웅덩이" : t === "B" ? "보너스" : t.replace("×", "×"), t.length > 7 ? 15 : 17, { fill: t === "P" ? "#2D5F80" : INK }));
    });
    g.append(svgEl("rect", { x: bx, y: by, width: BW, height: BH, fill: "none", stroke: INK, "stroke-width": 3 }));
    g.append(svgEl("line", { x1: bx, y1: sy, x2: bx + BW, y2: sy, stroke: DM4C.red, "stroke-width": 3, "stroke-dasharray": "10 6" }), txt(bx - 30, sy, "출발", 18, { fill: DM4C.red }));
  };
  const drawStone = () => {
    mk.innerHTML = "";
    if (aim) {
      const dx = stone.x - aim.x, dy = stone.y - aim.y;
      mk.append(svgEl("line", { x1: stone.x, y1: stone.y, x2: stone.x + dx * 0.6, y2: stone.y + dy * 0.6, stroke: P[turn % 2].c, "stroke-width": 4, "stroke-dasharray": "8 6" }));
    }
    mk.append(svgEl("circle", { cx: stone.x, cy: stone.y, r: 15, fill: "#2B2B2B", stroke: P[turn % 2].c, "stroke-width": 5 }));
  };
  const status = h("div", { class: "dm4score" });
  const say = h("div", { class: "dm4say" }, "​");
  const ask = h("div", { class: "dm4row" });
  const paintStatus = () => {
    status.innerHTML = "";
    P.forEach((p, k) => { const sc = dm4RunScore(owner, R, C, k); status.append(h("span", { class: turn % 2 === k && turn < TURNS * 2 ? "dm4turn" : "", style: `border-color:${p.c}` }, `${p.n}: ${count[k]}/${TURNS}번 · 땅 ${sc.cells}칸 · 점수 ${sc.total}점`)); });
  };
  const nextTurn = () => {
    turn++; ask.innerHTML = ""; phase = "aim"; stone = { x: W / 2, y: sy }; aim = null; drawBoard(); drawStone(); paintStatus();
    if (turn >= TURNS * 2) return finish();
    say.textContent = `${P[turn % 2].n} 차례예요. 출발선 위에서 바둑돌을 옮기고, 돌을 뒤로 당겼다 놓아 튕겨요.`;
  };
  let finished = false;
  const finish = () => {
    phase = "end";
    const s0 = dm4RunScore(owner, R, C, 0), s1 = dm4RunScore(owner, R, C, 1);
    const win = s0.total === s1.total ? "비겼어요" : `${(s0.total > s1.total ? P[0] : P[1]).n} 승리!`;
    say.textContent = `놀이 끝! 연두 ${s0.cells}칸+추가 ${s0.bonus}점=${s0.total}점, 주황 ${s1.cells}칸+추가 ${s1.bonus}점=${s1.total}점 → ${win}`;
    finished = true;
    api.tryOnce(); api.done(`연두 ${s0.total}점, 주황 ${s1.total}점`, opt.ok);   /* 놀이가 끝나면 api.done( */
  };
  const land = (x, y) => {
    const c = Math.floor((x - bx) / cs), r = Math.floor((y - by) / cs);
    count[turn % 2]++;
    if (c < 0 || c >= C || r < 0 || r >= R) { say.textContent = "놀이판 밖으로 나갔어요. 색칠하지 못해요."; return later(); }
    const i = r * C + c, t = DM4BOARD[i];
    if (owner[i] != null) { say.textContent = "이미 색칠된 땅이에요. 색칠하지 못해요."; return later(); }
    if (t === "P") { say.textContent = "웅덩이에 빠졌어요. 색칠하지 못해요."; return later(); }
    if (t === "B") { owner[i] = turn % 2; drawBoard(); say.textContent = "보너스 칸! 계산하지 않고 색칠해요."; return later(); }
    cellAt = i; phase = "calc";
    const inp = h("input", { type: "text", inputmode: "decimal", class: "dm4in", "aria-label": "곱" });
    const go = () => {
      const v = dm4P(inp.value); if (v == null) { say.textContent = "곱을 수로 써요."; return; }
      const right = dm4E(t);
      if (v === right) { owner[i] = turn % 2; drawBoard(); say.textContent = `계산기로 확인했더니 ${t.replace("×", " × ")} = ${dm4F(right)} 맞아요! 땅을 색칠해요.`; }
      else say.textContent = `계산기로 확인했더니 ${t.replace("×", " × ")} = ${dm4F(right)}이에요. 틀려서 색칠하지 못해요.`;
      ask.innerHTML = ""; later();
    };
    inp.addEventListener("keydown", ev => { if (ev.key === "Enter") go(); });
    ask.innerHTML = ""; ask.append(h("span", {}, `${P[turn % 2].n}: ${t.replace("×", " × ")} =`), inp, h("button", { class: "opt", onclick: go }, "곱 확인"));
    say.textContent = "도착한 칸의 식을 계산해 써요. 친구가 계산기로 확인해요.";
    setTimeout(() => inp.focus(), 50);
  };
  const later = () => { phase = "wait"; paintStatus(); setTimeout(nextTurn, 1400); };
  const fly = (vx, vy) => {
    phase = "fly";
    const L = Math.hypot(vx, vy), jit = 6 + L * 0.06, ang = Math.random() * Math.PI * 2, rr = Math.random() * jit;
    const tx = stone.x + vx + Math.cos(ang) * rr, ty = stone.y + vy + Math.sin(ang) * rr;
    const x1 = stone.x, y1 = stone.y; let t0 = null;
    const stepF = ts => { if (t0 == null) t0 = ts; const k = Math.min(1, (ts - t0) / 600), e = 1 - (1 - k) * (1 - k); stone = { x: x1 + (tx - x1) * e, y: y1 + (ty - y1) * e }; drawStone(); if (k < 1) requestAnimationFrame(stepF); else land(tx, ty); };
    requestAnimationFrame(stepF);
  };
  dragOn(svg, pt => {
    if (phase !== "aim") return false;
    if (Math.hypot(pt.x - stone.x, pt.y - stone.y) < 34) { aim = { x: pt.x, y: pt.y }; drawStone(); return true; }
    if (Math.abs(pt.y - sy) < 30 && pt.x >= bx && pt.x <= bx + BW) { stone = { x: pt.x, y: sy }; drawStone(); return false; }
    return false;
  }, pt => { if (!aim) return; const dx = pt.x - stone.x, dy = pt.y - stone.y, L = Math.hypot(dx, dy), m = 170; aim = L > m ? { x: stone.x + dx / L * m, y: stone.y + dy / L * m } : { x: pt.x, y: pt.y }; drawStone(); },
  () => { if (!aim) return; const dx = stone.x - aim.x, dy = stone.y - aim.y; aim = null; if (Math.hypot(dx, dy) < 12) { drawStone(); return; } fly(dx * 3.6, dy * 3.6); });
  const quick = h("button", { onclick: () => { if (phase !== "aim") return; const pw = 120 + Math.random() * 420; fly((Math.random() - 0.5) * 120, -pw); } }, "그냥 위로 튕기기");
  const restart = h("button", { onclick: () => { owner.fill(null); turn = -1; count = [0, 0]; finished = false; nextTurn(); } }, "처음부터 다시");
  drawBoard(); drawStone(); paintStatus();
  body.__dm4land = { hit: i => { if (phase === "aim") land(bx + (i % C) * cs + cs / 2, by + Math.floor(i / C) * cs + cs / 2); }, phase: () => phase, owner };
  say.textContent = `${P[0].n} 차례예요. 출발선 위에서 바둑돌을 옮기고, 돌을 뒤로 당겼다 놓아 튕겨요.`;
  body.append(h("div", { class: "dm4say" }, opt.tip || `두 사람이 번갈아 바둑돌을 튕겨요(한 사람에 ${TURNS}번). 돌을 아래로 당겼다 놓으면 반대쪽으로 날아가요. 많이 당길수록 멀리 가요.`), status, h("div", { class: "dm4stage" }, svg), say, ask, h("div", { class: "dm4tools" }, quick, restart));
  api.provide({ words: ["소수의 곱셈", "연속으로 색칠", "추가 점수"], answers: [] });
}

/* ===== ⑭ 카드 짝 맞추기 (또 다른 놀이) ===== 계산 결과가 같은 카드 두 장을 찾아요. */
const DM4MEM = [["0.48×100", "4.8×10"], ["480×0.01", "0.48×10"], ["48×0.001", "0.48×0.1"], ["4.8×1000", "48×100"],
  ["0.048×10", "4.8×0.1"], ["2.5×100", "25×10"], ["250×0.001", "2.5×0.1"], ["25×0.1", "0.25×10"]];
(function dm4MemCheck() {
  const vals = DM4MEM.map(([a, b]) => { const x = dm4E(a), y = dm4E(b); if (x !== y) throw new Error("짝 카드 값이 달라요 " + a + " " + b); return x; });
  if (new Set(vals.map(String)).size !== vals.length) throw new Error("짝 카드 값이 겹쳐요");
})();
function dm4Memory(body, api, opt) {
  dm4Style();
  const cards = DM4MEM.flatMap(([a, b], k) => [{ e: a, k }, { e: b, k }]);
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  let up = [], got = 0, flips = 0, busy = false;
  const say = h("div", { class: "dm4say" }, "​"), list = h("div", { class: "dm4row" });
  const btns = cards.map((c, i) => h("button", { "aria-label": `${i + 1}번 카드`, onclick: () => {
    if (busy || c.got || up.includes(i)) return;
    up.push(i); flips++; btns[i].classList.add("dm4up"); btns[i].textContent = c.e.replace("×", " × ");
    if (up.length === 2) {
      const [x, y] = up.map(j => cards[j]);
      if (x.k === y.k) {
        x.got = y.got = true; up.forEach(j => { btns[j].classList.add("dm4got"); }); got++;
        say.textContent = `짝을 찾았어요! ${x.e.replace("×", " × ")} = ${y.e.replace("×", " × ")} = ${dm4V(x.e)}`;
        list.append(h("span", { class: "dm4note" }, `${dm4V(x.e)} ✔ `)); up = [];
        if (got === DM4MEM.length) { say.textContent = `카드를 모두 가져왔어요! 카드를 ${flips}번 뒤집었어요.`; api.tryOnce(); api.done(`카드 ${flips}번 뒤집어 8쌍`, opt && opt.ok); /* 짝을 다 찾으면 api.done( */ }
      } else {
        busy = true; say.textContent = `${x.e.replace("×", " × ")} = ${dm4V(x.e)}, ${y.e.replace("×", " × ")} = ${dm4V(y.e)} — 곱이 달라요.`;
        setTimeout(() => { up.forEach(j => { btns[j].classList.remove("dm4up"); btns[j].textContent = "?"; }); up = []; busy = false; }, 1500);
      }
    }
  } }, "?"));
  body.__dm4mem = cards;
  body.append(h("div", { class: "dm4say" }, "카드 두 장을 뒤집어 곱이 같으면 가져가요. 다르면 다시 뒤집어 놓아요."), h("div", { class: "dm4mem" }, btns), say, list);
  api.provide({ words: ["곱의 소수점 위치", "오른쪽으로", "왼쪽으로"], answers: DM4MEM.map(([a, b]) => `${a} = ${b} = ${dm4V(a)}`) });
}
/* 이야기 쪽지(캠프 계획표·실험 기록) */
function dm4sNote(title, lines) { dm4Style(); return h("div", { class: "dm4snote" }, h("div", { class: "dm4gt" }, title), h("ul", {}, lines.map(t => h("li", {}, t)))); }
//@@LESSONS
const UNIT_STORY = { title: "우리 반 과학 탐구 캠프", lines: [
  "한빛초등학교 5학년 2반은 학교에서 1박 2일 과학 탐구 캠프를 열어요. 캠프 반장 도윤이와 서아, 지호, 하윤, 민준, 수빈, 태오가 모둠을 나누어 실험을 맡았어요.",
  "비커에 소금물을 담고, 강낭콩 줄기가 자란 길이를 재고, 구리선을 잘라 회로를 만들고, 모종판에 씨앗을 심고, 돋보기로 물방울을 확대해 보며 소수의 곱셈을 알아봐요.",
  "마지막에는 캠프 식단의 열량을 계산해 발표하고, 캠프 마지막 밤 놀이 한마당에서 배운 것을 정리해요."],
  one: "우리 반 과학 탐구 캠프 · 비커·강낭콩·구리선·모종판·돋보기·캠프 식단에서 (소수)×(자연수), (자연수)×(소수), (소수)×(소수)와 곱의 소수점 위치를 알아봐요." };
const UNIT_KEYWORDS = ["소수의 곱셈", "(소수)×(자연수)", "(자연수)×(소수)", "(소수)×(소수)", "같은 수를 여러 번 더하기", "0.1이 몇 개", "분수의 곱셈으로 나타내기", "자연수의 곱셈 이용하기", "[1/10]배", "[1/100]배", "[1/1000]배", "소수점 아래 자리 수", "곱의 소수점 위치", "어림셈", "이중 수직선", "모눈(넓이 모델)", "1보다 작은 수를 곱하면 작아져요"];
const DM4S_PLAN = ["🧪 실험 ① 비커 6개에 소금물을 0.4 L씩 담기", "🌱 실험 ② 강낭콩 줄기는 하루에 1.25 cm씩 자라요 — 4일 동안 자란 길이는?", "🔌 실험 ③ 구리선 5 m의 0.6배만큼 잘라 전기 회로 만들기", "🪴 실험 ④ 가로 0.8 m, 세로 0.6 m인 모종판에 씨앗 심기", "🔍 실험 ⑤ 지름 0.36 mm인 물방울을 돋보기·현미경으로 10배, 100배 확대해 보기", "🍛 캠프 식단: 카레라이스 0.8그릇의 열량은?"];
const DM4S_TYPES = ["(소수)×(자연수)", "(자연수)×(소수)", "(소수)×(소수)"];

const LESSONS = [
{
  id: "s1", no: 1, title: "과학 탐구 캠프를 계획해요", soop: "개념 찾기(S)",
  question: "과학 탐구 캠프를 준비할 때 소수의 곱셈이 필요한 때는 언제일까요?",
  summary: "캠프 계획표에는 비커 6개에 0.4 L씩, 구리선 5 m의 0.6배, 가로 0.8 m·세로 0.6 m인 모종판처럼 소수를 곱하는 상황이 많아요. 같은 양을 여러 번 더할 때, 어떤 양의 소수 배를 구할 때, 넓이를 구할 때 소수의 곱셈이 필요해요. 이 단원에서는 (소수)×(자연수), (자연수)×(소수), (소수)×(소수)를 계산하고 곱의 소수점 위치 규칙을 알아봐요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "우리 반이 1박 2일 과학 탐구 캠프를 열어요! 캠프 반장 도윤이가 만든 캠프 계획표를 보고, 세 칸에 써서 붙여요.", hints: ["계획표에서 소수가 쓰인 곳을 찾아봐요.", "같은 양을 여러 번 담거나, 어떤 양의 몇 배만큼 쓰는 곳을 떠올려요."],
      render: (b, a) => { b.append(dm4sNote("🔬 5학년 2반 과학 탐구 캠프 계획표", DM4S_PLAN));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "계획표에 ~이 보여요", hint: "계획표에서 보이는 것", ex: ["0.4 L, 1.25 cm, 0.36 mm처럼 소수가 많이 보여요.", "구리선 5 m의 0.6배처럼 자연수에 소수를 곱하는 말이 보여요."] },
          { t: "생각해요", e: "💭", ph: "~할 때 소수를 곱해야 할 것 같아요", hint: "소수의 곱셈이 필요한 일", ex: ["비커 6개에 담는 소금물은 0.4를 6번 더해야 하니까 0.4×6으로 구할 것 같아요.", "모종판의 넓이는 가로와 세로를 곱해야 하니까 0.8×0.6을 계산해야 할 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 계산할까?", hint: "소수의 곱셈에 대해 궁금한 것", ex: ["0.8×0.6처럼 소수끼리 곱하면 곱의 소수점은 어디에 찍을까?", "5 m의 0.6배는 5 m보다 길까, 짧을까?"] }],
          { ok: "캠프 계획표에는 소수의 곱셈이 가득해요! 이 단원에서 하나씩 계산하는 방법을 알아봐요." }); } },
    { name: "그려 보기 — 계획표를 곱셈식으로", inst: "캠프 계획표의 실험을 곱셈식으로 나타내고, 어떤 꼴의 곱셈인지 골라 보세요.", hints: ["0.4 L씩 6개는 0.4를 6번 더한 것과 같아요.", "5 m의 0.6배는 5×0.6으로 나타내요.", "직사각형의 넓이는 (가로)×(세로)예요."],
      render: thenWhy((b, a) => dm4Sent(b, a, [
        ["실험 ① 비커 6개에 담는 소금물의 양:", { o: ["0.4×6", "0.4+6", "6−0.4"], a: 0, why: { "1": "0.4 L씩 6번 담으니 0.4를 6번 더해요. 곱셈으로 나타내요." } }, "→", { o: DM4S_TYPES, a: 0 }],
        ["실험 ③ 구리선 5 m의 0.6배:", { o: ["5+0.6", "5×0.6", "5−0.6"], a: 1 }, "→", { o: DM4S_TYPES, a: 1 }],
        ["실험 ④ 모종판의 넓이:", { o: ["0.8+0.6", "0.8×0.6", "0.8×2+0.6×2"], a: 1, why: { "2": "그것은 모종판의 둘레를 구하는 식이에요. 넓이는 (가로)×(세로)예요." } }, "→", { o: DM4S_TYPES, a: 2 }]],
        { ok: "0.4×6은 (소수)×(자연수), 5×0.6은 (자연수)×(소수), 0.8×0.6은 (소수)×(소수)예요. 이 단원에서 세 가지를 모두 배워요." }),
        { q: "비커 6개에 담는 소금물의 양을 왜 0.4×6으로 나타낼 수 있을까요?", ph: "0.4 L씩 ~번 담으니까 ~", help: ["① 한 비커에 담는 양과 비커의 수를 찾아요. → ② 같은 양을 여러 번 더하는 것을 곱셈으로 나타내는 것을 떠올려요.", "‘0.4 L씩 6개는 0.4를 ~번 더한 것과 같아서 ~으로 나타내요.’ 꼴로 써요."],
          ans: "비커 6개에 0.4 L씩 담으면 0.4를 6번 더한 것과 같아요. 같은 수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어서 0.4×6이에요." }) },
    { name: "말해 보기 — 배운 내용 떠올리기", inst: "3·4학년 때 배운 분수와 소수, 소수의 덧셈, 그리고 이번 학기에 배운 분수의 곱셈을 떠올려 보세요.", hints: ["0.1이 10개이면 1이에요.", "소수를 10배 하면 소수점을 기준으로 수가 왼쪽으로 한 자리씩 이동해요.", "(분수)×(자연수)는 분모는 그대로 두고 분자와 자연수를 곱해요."],
      render: (b, a) => dm4Sent(b, a, [
        ["[4/10]를 소수로 나타내면", { n: "0.4", why: { "4": "[4/10]는 0.1이 4개인 수예요." } }, "예요."],
        ["0.1이 24개인 수는", { n: "2.4", why: { "0.24": "0.1이 10개이면 1이에요. 0.1이 24개이면 2와 0.4예요.", "24": "0.1이 24개인 수예요." } }, "예요."],
        ["0.4+0.4+0.4 =", { n: "1.2", e: "0.4+0.4+0.4" }],
        ["2.5의 10배는", { n: "25" }, "이고, 25의 [1/10]은", { n: "2.5" }, "예요."],
        ["[3/7]×2 = [3×2/7] =", { f: ["6", "7"], why: { "6/14": "분모는 그대로 두고 분자와 자연수를 곱해요." } }]],
        { ok: "분수와 소수, 소수의 덧셈, 소수 사이의 관계, 분수의 곱셈을 잘 기억하고 있어요!" }) },
    { name: "약속하기 — 배울 차례 정하기", inst: "“소수의 곱셈은 어떻게 계산하면 될까?” 이 단원에서 배울 내용을 배우는 차례대로 눌러 학습 계획을 세워 보세요.", hints: ["먼저 소수에 자연수를 곱하고, 다음에 자연수에 소수를 곱해요.", "소수끼리의 곱셈을 배운 뒤 곱의 소수점 위치 규칙을 알아봐요."],
      render: (b, a) => sequence(b, a, ["㉠ 곱의 소수점 위치 알아보기", "㉡ (소수)×(소수) 알아보기", "㉢ (소수)×(자연수) 알아보기", "㉣ (자연수)×(소수) 알아보기"], [2, 3, 1, 0],
        { ok: "(소수)×(자연수) → (자연수)×(소수) → (소수)×(소수) → 곱의 소수점 위치 차례로 배워요." }) },
    { name: "확인하기 — 먼저 어림해요", inst: "정확하게 계산하기 전에 어림해 보세요. 캠프 계획표의 실험 결과는 대략 얼마쯤일까요?", hints: ["0.4 L는 0.5 L보다 조금 적어요. 0.5 L씩 6개면 3 L예요.", "0.6배는 1배보다 작아요.", "가로와 세로가 모두 1 m보다 짧아요."],
      render: (b, a) => quiz(b, a, [
        { q: "실험 ① 비커 6개에 0.4 L씩 담은 소금물은 모두 약 몇 L일까요?", o: ["약 0.24 L", "약 2.4 L", "약 24 L"], a: 1, why: { "0": "0.4 L씩 3개만 담아도 1 L가 넘어요. 0.24 L는 너무 적어요.", "2": "비커 한 개에 1 L도 안 담는데 6개에 24 L는 너무 많아요." } },
        { q: "실험 ③에서 잘라 쓰는 구리선은 5 m보다 길까요, 짧을까요?", o: ["5 m보다 길어요", "5 m보다 짧아요", "5 m와 같아요"], a: 1, why: { "0": "0.6배는 1배보다 작아요. 5 m 전체(1배)보다 짧아요.", "2": "5 m와 같으려면 1배여야 해요." } },
        { q: "실험 ④ 모종판의 넓이는 1 m²보다 넓을까요, 좁을까요?", o: ["1 m²보다 넓어요", "1 m²보다 좁아요"], a: 1, why: { "0": "가로 0.8 m, 세로 0.6 m는 모두 1 m보다 짧아요. 한 변이 1 m인 정사각형 안에 쏙 들어가요." } }],
        { ok: "어림해 보니 소금물은 2.4 L쯤, 구리선은 5 m보다 짧고, 모종판은 1 m²보다 좁아요. 정확한 값은 이 단원에서 계산해요." }) }
  ],
  challenge: { inst: "★ 도전 — 캠프 간식 장보기예요. 같은 수를 여러 번 더해서 모두 얼마인지 구해 보세요.", hints: ["0.35+0.35=0.7, 0.7+0.35=1.05, 1.05+0.35=1.4처럼 차례로 더해요.", "1.8을 5번 더해요. 1.8+1.8=3.6이에요.", "2.5를 3번 더해요."],
    render: (b, a) => dm4Sent(b, a, [
      ["한 봉지에 0.35 kg인 견과류 4봉지: 0.35+0.35+0.35+0.35 =", { n: "1.4", e: "0.35+0.35+0.35+0.35" }, "kg"],
      ["한 병에 1.8 L인 생수 5병:", { n: "9", e: "1.8×5" }, "L"],
      ["한 통에 2.5 kg인 수박 3통:", { n: "7.5", e: "2.5×3" }, "kg"],
      ["같은 수를 여러 번 더하는 것은", { o: ["곱셈", "뺄셈"], a: 0 }, "으로 나타낼 수 있어요."]],
      { ok: "0.35×4=1.4, 1.8×5=9, 2.5×3=7.5예요. 같은 수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요." }) }
},
{
  id: "s2", no: 2, title: "비커에 소금물을 담아요 ― (소수 한 자리 수)×(자연수)", soop: "개념 구축하기(O)",
  question: "(소수 한 자리 수)×(자연수)는 어떻게 계산할까요?",
  summary: "0.6×3은 0.6을 3번 더한 것과 같고, 0.1이 6×3=18(개)이므로 1.8이에요. 1.4×8=[14/10]×8=[14×8/10]=[112/10]=11.2처럼 분수의 곱셈으로 나타내어 계산하거나, 14×8=112를 이용해 112의 [1/10]배인 11.2로 계산해요. 곱해지는 수가 [1/10]배가 되면 곱도 [1/10]배가 돼요.",
  steps: [
    { name: "만져 보기 — 비커 세 개의 소금물", inst: "지호네 모둠은 실험을 하려고 비커 3개에 소금물을 0.6 L씩 담았어요. 담은 소금물은 모두 몇 L일까요? 먼저 규칙을 예상하고, 한 칸이 0.1인 막대에 0.6씩 3번 색칠해 보세요.", hints: ["0.6은 0.1이 6개예요. 비커 하나에 6칸씩 칠해요.", "비커가 3개이니 6칸씩 3번, 모두 18칸을 칠해요.", "0.1이 10개이면 1이에요."],
      render: ruleFirst((b, a) => dm4Bars(b, a, { per: 6, times: 3, bars: 2, cell: "0.1", step: "0.6",
        asks: [
          ["소금물의 양을 구하는 식은", { o: ["0.6+0.6+0.6", "0.6×3", "두 식 모두 돼요"], a: 2 }],
          ["0.6+0.6+0.6 =", { n: "1.8", e: "0.6×3" }],
          ["0.6은 0.1이 6개이므로 0.6×3은 0.1이 6×3 =", { n: "18", s: 1 }, "(개)예요."],
          ["0.6×3 = 0.1×", { n: "18", s: 1 }, "=", { n: "1.8", why: { "0.18": "0.1이 18개인 수예요. 0.1이 10개이면 1이에요.", "18": "0.1이 18개인 수를 소수로 써요." } }],
          ["담은 소금물은 모두", { n: "1.8" }, "L예요."]],
        ok: "0.6을 3번 더하면 1.8이에요. 0.1이 18개이니 0.6×3=1.8, 소금물은 모두 1.8 L예요." }),
        { q: "0.6×3처럼 소수에 자연수를 곱하면 어떻게 계산할 수 있을까요?", ph: "내 규칙: 0.6은 0.1이 ~", help: ["① 0.6이 0.1이 몇 개인지 생각해요. → ② 3번 담으면 0.1이 모두 몇 개가 되는지 세어요.", "‘내 규칙: 0.6은 0.1이 ~개이니까 0.6×3은 0.1이 ~개예요.’ 꼴로 써요."],
          ans: "0.6은 0.1이 6개이니까 0.6×3은 0.1이 6×3=18(개)예요. 0.1이 18개이면 1.8이에요. 자연수처럼 6×3=18을 계산하고 [1/10]배를 하면 돼요." }) },
    { name: "그려 보기 — 1.4×8을 두 가지 방법으로", inst: "하윤이네 모둠은 소금물 1.4 L씩을 8개 모둠에 나누어 주려고 해요. 필요한 소금물은 1.4×8 (L)이에요. 먼저 어림해 보고, 분수의 곱셈과 자연수의 곱셈으로 계산해 보세요.", hints: ["1.4는 [14/10]이에요. 분모는 그대로 두고 분자와 자연수를 곱해요.", "14×8=112예요. 1.4는 14의 [1/10]배이니 곱도 [1/10]배가 돼요.", "[112/10]은 0.1이 112개인 수예요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["1.4를 1.5로 보면 1.5×8은 1.5+1.5=3이 4번이므로 약", { n: "12", e: "1.5×8" }, "이에요."]] },
        { g: "방법 ① 분수의 곱셈으로 나타내어 계산하기", rows: [["1.4×8 =", { f: ["14", "10"], why: { "14/100": "1.4는 소수 한 자리 수예요. 분모가 10인 분수로 나타내요." } }, "×8 = [14×8/10] =", { f: ["112", "10"] }, "=", { n: "11.2", e: "1.4×8" }]] },
        { g: "방법 ② 자연수의 곱셈을 이용하여 계산하기", rows: [
          { fig: () => dm4RelFig([["14", "8", "112"], ["1.4", "8", "11.2"]], { a: "1/10", p: "1/10" }) },
          ["14×8 =", { n: "112", e: "14×8" }],
          ["1.4는 14의", { o: ["10배", "[1/10]배", "[1/100]배"], a: 1 }, "이므로 1.4×8은 112의 [1/10]배인", { n: "11.2", e: "1.4×8", why: { "112": "1.4는 14의 [1/10]배이니 곱도 [1/10]배를 해요." } }, "예요."]] },
        ["어림한 12와 계산한 11.2는", { o: ["비슷해요", "많이 달라요"], a: 0 }]],
        { ok: "1.4×8=11.2예요. 어림한 12와 비슷해요. 분수의 곱셈으로도, 자연수의 곱셈으로도 계산할 수 있어요." }) },
    { name: "말해 보기 — 곱해지는 수가 [1/10]배가 되면", inst: "서아는 3.7×4를 두 가지 방법으로 계산했어요. 빈칸을 채우고, 왜 그렇게 되는지 말해 보세요.", hints: ["방법 ①: 3.7=[37/10]이에요.", "방법 ②: 37×4=148이고, 3.7은 37의 [1/10]배예요.", "소수의 끝자리 0은 생략할 수 있어요."],
      render: thenWhy((b, a) => dm4Sent(b, a, [
        { g: "방법 ①", rows: [["3.7×4 =", { f: ["37", "10"] }, "×4 = [37×4/10] =", { f: ["148", "10"] }, "=", { n: "14.8", e: "3.7×4" }]] },
        { g: "방법 ②", rows: [["37×4 =", { n: "148", e: "37×4" }, "→ 3.7×4 =", { n: "14.8", e: "3.7×4" }]] },
        ["곱해지는 수가 [1/10]배가 되면 곱도", { o: ["10배", "[1/10]배", "그대로"], a: 1 }, "가 돼요."],
        ["0.5×4 = 2.0이에요. 2.0과 2는", { o: ["같은 수예요", "다른 수예요"], a: 0, why: { "1": "소수의 끝자리 0은 생략할 수 있어요. 2.0=2예요." } }]],
        { ok: "3.7×4=14.8이에요. 곱해지는 수가 [1/10]배가 되면 곱도 [1/10]배가 돼요." }),
        { q: "37×4=148을 계산한 뒤 3.7×4를 왜 14.8로 써야 할까요?", ph: "3.7은 37의 ~배이므로 ~", help: ["① 3.7과 37의 관계를 찾아요. → ② 곱해지는 수가 [1/10]배가 되면 곱은 어떻게 되는지 생각해요.", "‘3.7은 37의 ~배이므로 곱도 148의 ~배인 ~이에요.’ 꼴로 써요."],
          ans: "3.7은 37의 [1/10]배예요. 곱해지는 수가 [1/10]배가 되면 곱도 [1/10]배가 되므로 3.7×4는 148의 [1/10]배인 14.8이에요. 3.7을 4로 어림하면 4×4=16이니 14.8이 알맞아요." }) },
    { name: "약속하기 — (소수)×(자연수) 계산 방법", inst: "약속을 완성해 보세요.", hints: ["1.4×8=[14/10]×8처럼 분수로 바꾸었어요.", "14×8=112를 이용했어요."],
      render: (b, a) => blanks(b, a, ["(소수)×(자연수)는 ", { o: ["분수의 곱셈", "분수의 덧셈"], a: 0 }, "으로 나타내어 계산하거나 ", { o: ["자연수의 곱셈", "소수의 뺄셈"], a: 0 }, "을 이용하여 계산해요. 곱해지는 수가 [1/10]배가 되면 곱도 ", { o: ["10배", "[1/10]배"], a: 1 }, "가 돼요."], { ok: "(소수)×(자연수)는 분수의 곱셈으로 나타내거나 자연수의 곱셈을 이용해 계산해요." }) },
    { name: "확인하기 — 세로셈으로 계산하기", inst: "실험이 끝난 뒤 정리한 양을 계산해 보세요. 세로셈은 자연수의 곱셈처럼 계산한 뒤 곱의 소수점을 찍어요.", hints: ["2.7×3은 27×3=81의 [1/10]배예요.", "6.3×5는 63×5=315의 [1/10]배예요.", "곱해지는 수의 소수점 아래 자리 수가 1자리이니 곱도 소수 한 자리 수예요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "2.7", b: "3" }, { a: "6.3", b: "5" }],
        rows: [["0.7×6 =", { f: ["7", "10"] }, "×6 =", { f: ["42", "10"] }, "=", { n: "4.2", e: "0.7×6" }],
          { q: "수빈이네 모둠은 실험이 끝나고 비커 5개를 씻는 데 비커 한 개에 물을 1.3 L씩 썼어요.", p: ["쓴 물은 모두", { n: "6.5", e: "1.3×5" }, "L예요."] }],
        ok: "2.7×3=8.1, 6.3×5=31.5, 0.7×6=4.2, 쓴 물은 1.3×5=6.5 (L)예요. 자연수처럼 곱하고 소수점을 찍었어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 수직선에서 0.4씩 7번 뛰어 세어 0.4×7을 구하고, 물음에 답해 보세요.", hints: ["0.4는 작은 눈금 4칸이에요.", "24×3=72이고, 2.4는 24의 [1/10]배예요.", "정오각형은 다섯 변의 길이가 모두 같아요."],
    render: (b, a) => dm4Jump(b, a, { to: "3", minor: "0.1", step: "0.4", hops: 7,
      asks: [
        ["0.4씩", { n: "7", s: 1 }, "번 뛰어 세면", { n: "2.8" }, "이므로 0.4×7 =", { n: "2.8", e: "0.4×7" }],
        ["24×3 = 72이므로 2.4×3 =", { n: "7.2", e: "2.4×3", why: { "72": "2.4는 24의 [1/10]배예요. 곱도 [1/10]배예요." } }],
        ["한 변이 3.5 cm인 정오각형 모양 표지판의 둘레는", { n: "17.5", e: "3.5×5" }, "cm예요."]],
      ok: "0.4×7=2.8, 2.4×3=7.2, 3.5×5=17.5예요. 잘했어요!" }) }
},
{
  id: "s3", no: 3, title: "강낭콩 줄기가 자라요 ― (소수 두 자리 수)×(자연수)", soop: "개념 구축하기(O)",
  question: "(소수 두 자리 수)×(자연수)는 어떻게 계산할까요?",
  summary: "0.32×4는 0.1이 12개(1.2), 0.01이 8개(0.08)이므로 1.28이에요. 2.45×4=[245/100]×4=[980/100]=9.8처럼 분모가 100인 분수의 곱셈으로 계산하거나, 245×4=980의 [1/100]배로 계산해요. 9.80처럼 소수의 끝자리 0은 생략할 수 있어요. 분모가 10, 100, 1000인 분수는 약분하지 않고 그대로 두면 소수로 나타내기 편리해요.",
  steps: [
    { name: "만져 보기 — 하루에 0.32 cm씩", inst: "서아의 강낭콩은 싹이 튼 뒤 하루에 0.32 cm씩 자랐어요. 4일 동안 자란 길이는 몇 cm일까요? 하루에 0.32만큼인 수 모형 묶음을 4개 놓고, 같은 모형끼리 모아 세어 보세요.", hints: ["0.32는 0.1 막대 3개와 0.01 조각 2개예요.", "4일이니 0.32 묶음을 4개 놓아요.", "0.1이 12개이면 1.2, 0.01이 8개이면 0.08이에요."],
      render: (b, a) => dm4Blocks(b, a, { unit: "0.32", times: 4,
        asks: [
          ["4일 동안 자란 길이를 구하는 식은 0.32+0.32+0.32+0.32 또는", { o: ["0.32×4", "0.32+4", "0.32×2"], a: 0 }],
          ["0.32×4에서 0.1이 3×4 =", { n: "12", s: 1 }, "(개)이므로", { n: "1.2", why: { "0.12": "0.1이 12개이면 1.2예요.", "12": "0.1이 12개인 수를 소수로 써요." } }, ", 0.01이 2×4 =", { n: "8", s: 1 }, "(개)이므로", { n: "0.08", why: { "0.8": "0.01이 8개이면 0.08이에요.", "8": "0.01이 8개인 수를 소수로 써요." } }, "이에요."],
          ["0.32×4 = 1.2+0.08 =", { n: "1.28", e: "0.32×4" }],
          ["서아의 강낭콩은 4일 동안", { n: "1.28" }, "cm 자랐어요."]],
        ok: "0.32×4는 0.1이 12개, 0.01이 8개이므로 1.28이에요. 4일 동안 1.28 cm 자랐어요." }) },
    { name: "그려 보기 — 2.45×4를 두 가지 방법으로", inst: "지호의 강낭콩은 덩굴손이 뻗기 시작하면서 하루에 2.45 cm씩 자랐어요. 4일 동안 자란 길이는 2.45×4 (cm)예요. 먼저 어림해 보고, 두 가지 방법으로 계산해 보세요.", hints: ["2.45는 소수 두 자리 수이니 분모가 100인 분수 [245/100]예요.", "245×4=980이에요. 2.45는 245의 [1/100]배예요.", "9.80에서 끝자리 0은 생략할 수 있어요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["2.45를 2.5로 어림하면 2.5×4 =", { n: "10", e: "2.5×4" }, "이므로 2.45×4는", { o: ["10보다 조금 커요", "10보다 조금 작아요", "100쯤이에요"], a: 1, why: { "0": "2.45는 2.5보다 작아요. 그러면 곱도 10보다 작아요." } }]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["2.45×4 =", { f: ["245", "100"], why: { "245/10": "2.45는 소수 두 자리 수예요. 분모가 100인 분수로 나타내요." } }, "×4 = [245×4/100] =", { f: ["980", "100"] }, "=", { n: "9.8", e: "2.45×4" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [
          { fig: () => dm4RelFig([["245", "4", "980"], ["2.45", "4", "9.80"]], { a: "1/100", p: "1/100" }) },
          ["245×4 =", { n: "980", e: "245×4" }, ". 2.45는 245의", { o: ["[1/10]배", "[1/100]배"], a: 1 }, "이므로 2.45×4는 980의 [1/100]배인", { n: "9.8", e: "2.45×4", why: { "98": "2.45는 245의 [1/100]배예요. [1/10]배가 아니에요." } }, "이에요."]] },
        ["9.80과 9.8은", { o: ["같은 수예요", "다른 수예요"], a: 0, why: { "1": "소수의 끝자리 0은 생략할 수 있어요." } }]],
        { ok: "2.45×4=9.8이에요. 10보다 조금 작을 거라고 어림했는데 9.8이 나왔어요." }) },
    { name: "말해 보기 — 잘못된 계산 찾기", inst: "민준이가 강낭콩 3일 동안 자란 길이 3.07×3을 다음과 같이 계산했어요. 잘못 계산한 곳을 찾아 옳게 계산하고, 어림으로 어떻게 찾을 수 있는지 말해 보세요.", hints: ["3.07은 소수 두 자리 수예요. 분모가 몇인 분수일까요?", "3×3=9이니 3.07×3은 9쯤이어야 해요.", "분모가 100인 분수의 곱셈으로 다시 계산해요."],
      render: thenWhy((b, a) => dm4Sent(b, a, [
        { fig: () => dm4Talk([["민준이의 계산:", "3.07×3 = [307/10]×3 = [921/10] = 92.1"]]) },
        ["잘못된 곳은", { o: ["3.07을 [307/10]로 나타낸 것", "307×3을 921로 계산한 것"], a: 0, why: { "1": "307×3=921은 맞아요. 3.07을 분수로 나타낸 곳을 살펴봐요." } }],
        ["3×3=9로 어림하면 92.1은", { o: ["너무 커요", "알맞아요"], a: 0 }],
        ["옳게 계산하면 3.07×3 =", { f: ["307", "100"] }, "×3 =", { f: ["921", "100"] }, "=", { n: "9.21", e: "3.07×3", why: { "92.1": "분모를 10으로 계산하면 안 돼요. 3.07은 [307/100]이에요." } }],
        ["[921/100]처럼 분모가 10, 100, 1000인 분수는", { o: ["약분하지 않고 그대로 두면 소수로 나타내기 편리해요", "꼭 기약분수로 고쳐야 해요"], a: 0 }]],
        { ok: "3.07=[307/100]이므로 3.07×3=[921/100]=9.21이에요." }),
        { q: "어림을 하면 잘못된 계산을 어떻게 찾을 수 있을까요?", ph: "3.07을 ~로 어림하면 ~", help: ["① 3.07을 가까운 자연수로 어림해 곱을 구해요. → ② 어림한 값과 92.1을 견주어 봐요.", "‘3.07을 ~로 어림하면 ~이므로 곱은 ~쯤이어야 하는데, 92.1은 ~.’ 꼴로 써요."],
          ans: "3.07을 3으로 어림하면 3×3=9이므로 곱은 9쯤이어야 해요. 그런데 92.1은 9보다 훨씬 커서 소수점 위치가 잘못된 것을 알 수 있어요." }) },
    { name: "약속하기 — (소수 두 자리 수)×(자연수)", inst: "약속을 완성해 보세요.", hints: ["2.45=[245/100]이었어요.", "245×4=980의 [1/100]배가 2.45×4였어요."],
      render: (b, a) => blanks(b, a, ["(소수 두 자리 수)×(자연수)는 분모가 ", { o: ["10", "100", "1000"], a: 1 }, "인 분수의 곱셈으로 나타내어 계산하거나, 자연수의 곱셈을 한 뒤 곱을 ", { o: ["[1/10]배", "[1/100]배"], a: 1 }, " 하여 계산해요. 곱해지는 수가 [1/100]배가 되면 곱도 ", { o: ["100배", "[1/100]배"], a: 1 }, "가 돼요."], { ok: "(소수 두 자리 수)×(자연수)는 분모가 100인 분수의 곱셈이나 자연수의 곱셈의 [1/100]배로 계산해요." }) },
    { name: "확인하기 — 세로셈과 흙의 무게", inst: "계산해 보고, 모종에 넣을 흙 문제도 해결해 보세요.", hints: ["1.38×4는 138×4=552의 [1/100]배예요.", "7.06×3은 706×3=2118의 [1/100]배예요.", "올해는 작년의 4배만큼 준비했으니 1.35×4예요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "1.38", b: "4" }, { a: "7.06", b: "3" }],
        rows: [
          ["0.84×5 =", { f: ["84", "100"] }, "×5 =", { f: ["420", "100"] }, "=", { n: "4.2", e: "0.84×5" }],
          { q: "작년 캠프에서는 강낭콩 모종에 흙을 1.35 kg 넣었고, 올해는 작년의 4배만큼 준비했어요.", p: ["올해 준비한 흙은", { n: "5.4", e: "1.35×4" }, "kg이에요."] }],
        ok: "1.38×4=5.52, 7.06×3=21.18, 0.84×5=4.2, 올해 준비한 흙은 1.35×4=5.4 (kg)이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 수 카드 놀이예요. 수 카드 3, 7, 5를 한 번씩 놓아 곱이 가장 큰 (소수 두 자리 수)×(자연수)를 만들어 보세요.", hints: ["가장 큰 수를 곱하는 수(자연수)에 놓을지, 소수 첫째 자리에 놓을지 견주어 봐요.", "0.53×7, 0.73×5, 0.57×3을 어림해서 견주어 봐요."],
    render: (b, a) => dm4Cards(b, a, { cards: ["3", "7", "5"], pat: ["0", ".", "□", "□", "×", "□"], goal: "max",
      after: (e, v) => [
        ["만든 식의 곱은", { n: v, e }],
        ["0.46×7", { o: [">", "=", "<"], a: 2, why: { "0": "0.46×7=3.22, 0.58×6=3.48이에요." } }, "0.58×6"],
        ["민준이가 강낭콩에 하루에 0.65 L씩 5일 동안 물을 주면 모두", { n: "3.25", e: "0.65×5" }, "L예요."]],
      ok: "곱이 가장 큰 식은 0.53×7=3.71이에요. 가장 큰 수 7을 곱하는 수로 놓고, 남은 수 중 큰 수 5를 소수 첫째 자리에 놓았어요." }) }
},
{
  id: "s4", no: 4, title: "구리선을 잘라 회로를 만들어요 ― (자연수)×(소수 한 자리 수)", soop: "개념 구축하기(O)",
  question: "(자연수)×(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "3의 0.1배는 0.3이므로 3의 0.7배는 0.3×7=2.1이에요(3×0.7=2.1). 8×1.3=8×[13/10]=[104/10]=10.4처럼 분수의 곱셈으로 계산하거나, 8×13=104의 [1/10]배로 계산해요. 1보다 작은 수를 곱하면 곱은 곱해지는 수보다 작아지고, 1보다 큰 수를 곱하면 커져요.",
  steps: [
    { name: "만져 보기 — 구리선 3 m의 0.7배", inst: "민준이네 모둠은 꼬마전구에 불을 켜는 회로를 만들려고 구리선 3 m의 0.7배만큼 잘라 썼어요. 먼저 예상을 쓰고, 이중 수직선의 아래 표시를 0.7배로 옮겨 사용한 구리선의 길이를 알아보세요.", hints: ["아래 수직선의 작은 눈금 한 칸은 0.1배예요.", "3의 1배는 3이에요. 3을 똑같이 10으로 나눈 하나가 3의 0.1배예요.", "3의 0.7배는 3의 0.1배가 7개예요."],
      render: ruleFirst((b, a) => dm4Double(b, a, { top: "3", unit: "m", what: "구리선 3 m", bot: "1", step: "0.1", labels: ["0.1", "0.5", "0.7"], target: "0.7",
        asks: [
          ["사용한 구리선의 길이를 구하는 식은", { o: ["3×0.7", "3+0.7", "3−0.7"], a: 0 }],
          ["3의 1배는 3이므로 3의 0.1배는", { n: "0.3", e: "3×0.1" }, "이에요."],
          ["3의 0.7배는 0.3×7 =", { n: "2.1", e: "3×0.7", why: { "21": "3의 0.7배는 3보다 작아야 해요." } }, "이에요."],
          ["민준이네 모둠이 사용한 구리선은", { n: "2.1" }, "m예요. 3 m보다", { o: ["길어요", "짧아요"], a: 1 }, "."]],
        ok: "3의 0.1배는 0.3, 3의 0.7배는 2.1이에요. 1보다 작은 0.7을 곱했더니 곱이 3보다 작아졌어요." }),
        { q: "3 m의 0.7배는 3 m보다 길까요, 짧을까요? 어떻게 구할 수 있을까요?", ph: "내 규칙: 0.7배는 1배보다 ~", help: ["① 0.7배가 1배보다 큰지 작은지 생각해요. → ② 3의 0.1배를 먼저 구하면 0.7배를 어떻게 구할지 생각해요.", "‘내 규칙: 0.7배는 1배보다 ~니까 3 m보다 ~. 3의 0.1배를 ~번 더해요.’ 꼴로 써요."],
          ans: "0.7배는 1배보다 작으니까 3 m보다 짧아요. 3의 0.1배는 0.3이고, 3의 0.7배는 0.3이 7개이므로 0.3×7=2.1(m)예요." }) },
    { name: "그려 보기 — 8×1.3을 두 가지 방법으로", inst: "태오네 모둠은 더 큰 회로를 만들려고 구리선 8 m의 1.3배만큼 준비했어요. 준비한 구리선은 8×1.3 (m)예요. 먼저 어림해 보고, 분수의 곱셈과 자연수의 곱셈으로 계산해 보세요.", hints: ["1.3=[13/10]이에요.", "8×13=104이고, 1.3은 13의 [1/10]배예요.", "곱하는 수가 [1/10]배가 되면 곱도 [1/10]배가 돼요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["1.3을 1로 어림하면 8×1 =", { n: "8" }, "이므로 8×1.3은", { o: ["8보다 조금 커요", "8보다 조금 작아요"], a: 0, why: { "1": "1.3은 1보다 커요. 8에 1보다 큰 수를 곱했어요." } }]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["8×1.3 = 8×", { f: ["13", "10"] }, "= [8×13/10] =", { f: ["104", "10"] }, "=", { n: "10.4", e: "8×1.3" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [
          { fig: () => dm4RelFig([["8", "13", "104"], ["8", "1.3", "10.4"]], { b: "1/10", p: "1/10" }) },
          ["8×13 =", { n: "104", e: "8×13" }, ". 1.3은 13의 [1/10]배이므로 8×1.3은 104의", { o: ["10배", "[1/10]배"], a: 1 }, "인", { n: "10.4", e: "8×1.3", why: { "104": "1.3은 13의 [1/10]배예요. 곱도 [1/10]배를 해요." } }, "예요."]] }],
      { ok: "8×1.3=10.4예요. 8보다 조금 클 거라고 어림했는데 10.4가 나왔어요." }) },
    { name: "말해 보기 — 곱셈을 하면 항상 커질까?", inst: "6×2.4를 두 가지 방법으로 계산해 보고, 곱셈을 하면 곱이 항상 커지는지 생각해 보세요.", hints: ["2.4=[24/10]이에요.", "6×24=144예요.", "3 m의 0.7배는 3 m보다 짧았어요."],
      render: thenWhy((b, a) => dm4Sent(b, a, [
        { g: "방법 ①", rows: [["6×2.4 = 6×", { f: ["24", "10"] }, "= [6×24/10] =", { f: ["144", "10"] }, "=", { n: "14.4", e: "6×2.4" }]] },
        { g: "방법 ②", rows: [["6×24 =", { n: "144", e: "6×24" }, "→ 6×2.4 =", { n: "14.4", e: "6×2.4" }]] },
        ["6에 1보다 큰 수 2.4를 곱하면 곱은 6보다", { o: ["커져요", "작아져요"], a: 0 }],
        ["3에 1보다 작은 수 0.7을 곱하면 곱은 3보다", { o: ["커져요", "작아져요"], a: 1, why: { "0": "3×0.7=2.1이었어요. 3보다 작아요." } }],
        ["곱셈을 하면 곱은", { o: ["항상 커져요", "곱하는 수가 1보다 작으면 작아져요"], a: 1 }]],
        { ok: "6×2.4=14.4예요. 곱셈을 한다고 늘 커지는 것은 아니에요." }),
        { q: "왜 1보다 작은 수를 곱하면 곱이 곱해지는 수보다 작아질까요?", ph: "0.7배는 전체(1배)보다 ~", help: ["① 3 m의 1배와 0.7배를 이중 수직선에서 떠올려요. → ② 0.7배는 전체의 얼마만큼인지 생각해요.", "‘1보다 작은 수만큼 곱하는 것은 전체보다 ~ 부분만 구하는 것이라서 ~.’ 꼴로 써요."],
          ans: "1보다 작은 수를 곱하는 것은 전체(1배)보다 적은 부분만 구하는 것이에요. 3 m의 0.7배는 3 m를 10으로 똑같이 나눈 것 중 7개만이라서 3 m보다 짧아요." }) },
    { name: "약속하기 — (자연수)×(소수) 계산 방법", inst: "약속을 완성해 보세요.", hints: ["8×1.3=8×[13/10]이었어요.", "곱하는 수 1.3을 10배 한 13과 곱했으면 곱을 [1/10]배 해야 해요."],
      render: (b, a) => blanks(b, a, ["(자연수)×(소수)는 ", { o: ["분수의 곱셈", "분수의 덧셈"], a: 0 }, "으로 나타내어 계산하거나, 곱하는 수를 10배 한 자연수의 곱셈을 한 뒤 곱을 ", { o: ["10배", "[1/10]배"], a: 1 }, " 해요. 1보다 작은 수를 곱하면 곱은 곱해지는 수보다 ", { o: ["커져요", "작아져요"], a: 1 }, "."], { ok: "곱하는 수를 10배 해서 자연수끼리 곱했으면 곱을 꼭 [1/10]배 해요." }) },
    { name: "확인하기 — 세로셈과 회로 실험 물", inst: "계산해 보고, 실험에 쓴 물의 양도 구해 보세요.", hints: ["3×4.7은 3×47=141의 [1/10]배예요.", "16×2.5는 16×25=400의 [1/10]배예요. 40.0은 40과 같아요.", "오늘은 어제의 1.2배만큼 썼으니 150×1.2예요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "3", b: "4.7" }, { a: "16", b: "2.5" }],
        rows: [
          ["9×0.8 = 9×", { f: ["8", "10"] }, "=", { f: ["72", "10"] }, "=", { n: "7.2", e: "9×0.8" }],
          { q: "수빈이는 어제 소금 녹이기 실험에 물을 150 mL 썼고, 오늘은 어제의 1.2배만큼 썼어요.", p: ["오늘 쓴 물은", { n: "180", e: "150×1.2" }, "mL예요."] }],
        ok: "3×4.7=14.1, 16×2.5=40, 9×0.8=7.2, 오늘 쓴 물은 150×1.2=180 (mL)예요." }) }
  ],
  challenge: { inst: "★ 도전 — 수 카드 2, 5, 8을 한 번씩 놓아 곱이 가장 작은 (자연수)×(소수 한 자리 수)를 만들어 보세요.", hints: ["곱이 작으려면 작은 수끼리 곱해야 해요.", "2×5.8, 2×8.5, 5×2.8을 어림해서 견주어 봐요."],
    render: (b, a) => dm4Cards(b, a, { cards: ["2", "5", "8"], pat: ["□", "×", "□", ".", "□"], goal: "min",
      after: (e, v) => [
        ["만든 식의 곱은", { n: v, e }],
        ["7×0.6, 4×1.2, 9×0.4 중 곱이 가장 작은 것은", { o: ["7×0.6", "4×1.2", "9×0.4"], a: 2, why: { "0": "7×0.6=4.2, 9×0.4=3.6이에요.", "1": "4×1.2=4.8, 9×0.4=3.6이에요." } }]],
      ok: "곱이 가장 작은 식은 2×5.8=11.6이에요. 가장 작은 수 2를 자연수로 놓고, 남은 수 중 작은 수 5를 일의 자리에 놓았어요." }) }
},
{
  id: "s5", no: 5, title: "강낭콩 키를 견주어요 ― (자연수)×(소수 두 자리 수)", soop: "개념 구축하기(O)",
  question: "(자연수)×(소수 두 자리 수)는 어떻게 계산할까요?",
  summary: "4의 0.25배는 1이므로 4의 1.75배는 1×7=7이에요(4×1.75=7). 6×1.35=6×[135/100]=[810/100]=8.1처럼 분모가 100인 분수의 곱셈으로 계산하거나, 6×135=810의 [1/100]배로 계산해요. 곱하는 소수 두 자리 수를 1이나 1.5처럼 가까운 수로 어림하면 결과를 빨리 견줄 수 있어요.",
  steps: [
    { name: "만져 보기 — 4 cm의 1.75배", inst: "지호의 강낭콩 키는 4 cm이고, 하윤이의 강낭콩 키는 지호 강낭콩 키의 1.75배예요. 이중 수직선의 아래 표시를 1.75배로 옮겨 하윤이의 강낭콩 키를 알아보세요.", hints: ["아래 수직선의 작은 눈금 한 칸은 0.25배예요.", "4의 1배는 4예요. 1배를 똑같이 4로 나눈 하나가 0.25배예요.", "1.75배는 0.25배가 7개예요."],
      render: (b, a) => dm4Double(b, a, { top: "8", unit: "cm", what: "지호 강낭콩 키(4 cm)의 2배까지", bot: "2", step: "0.25", labels: ["0.25", "0.5", "1", "1.75"], target: "1.75", topLabels: [[4, "4 cm"]], color: "#A9D8A2",
        asks: [
          ["하윤이의 강낭콩 키를 구하는 식은", { o: ["4×1.75", "4+1.75", "4×0.75"], a: 0 }],
          ["4의 1배는 4이므로 4의 0.25배는", { n: "1", e: "4×0.25" }, "이에요."],
          ["4의 1.75배는 4의 0.25배가", { n: "7", s: 1 }, "개이므로", { n: "7", e: "4×1.75", why: { "70": "1.75배는 2배보다 작아요. 8보다 작아야 해요." } }, "이에요."],
          ["하윤이의 강낭콩 키는", { n: "7" }, "cm이고, 지호 강낭콩보다", { o: ["커요", "작아요"], a: 0 }, "."]],
        ok: "4의 0.25배는 1, 4의 1.75배는 7이에요. 1보다 큰 1.75를 곱했더니 4보다 커졌어요." }) },
    { name: "그려 보기 — 6×1.35를 두 가지 방법으로", inst: "수빈이네 모둠은 강낭콩 덩굴이 타고 올라갈 끈을 6 m의 1.35배만큼 준비했어요. 준비한 끈은 6×1.35 (m)예요. 먼저 어림해 보고, 두 가지 방법으로 계산해 보세요.", hints: ["1.35는 소수 두 자리 수이니 [135/100]이에요.", "6×135=810이고, 1.35는 135의 [1/100]배예요.", "8.10에서 끝자리 0은 생략할 수 있어요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["1.35를 1.5로 어림하면 6×1.5 =", { n: "9", e: "6×1.5" }, "이므로 6×1.35는", { o: ["9보다 조금 커요", "9보다 조금 작아요"], a: 1, why: { "0": "1.35는 1.5보다 작아요. 그러면 곱도 9보다 작아요." } }]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["6×1.35 = 6×", { f: ["135", "100"], why: { "135/10": "1.35는 소수 두 자리 수예요. 분모가 100인 분수로 나타내요." } }, "= [6×135/100] =", { f: ["810", "100"] }, "=", { n: "8.1", e: "6×1.35" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [
          { fig: () => dm4RelFig([["6", "135", "810"], ["6", "1.35", "8.10"]], { b: "1/100", p: "1/100" }) },
          ["6×135 =", { n: "810", e: "6×135" }, ". 1.35는 135의 [1/100]배이므로 6×1.35는 810의", { o: ["[1/10]배", "[1/100]배"], a: 1 }, "인", { n: "8.1", e: "6×1.35", why: { "81": "1.35는 135의 [1/100]배예요. [1/10]배가 아니에요." } }, "이에요."]] }],
      { ok: "6×1.35=8.1이에요. 9보다 조금 작을 거라고 어림했는데 8.1이 나왔어요." }) },
    { name: "말해 보기 — 어림해서 견주기", inst: "서아와 민준이가 강낭콩에 영양액을 주었어요. 정확하게 계산하지 않고 어림해서 누가 더 많이 주었는지 알아보고, 어떻게 어림했는지 말해 보세요.", hints: ["0.92는 1보다 조금 작아요.", "1.38은 1.5에 가까워요. 40×1.5=60이에요.", "1보다 작은 수를 곱하면 곱해지는 수보다 작아져요."],
      render: thenWhy((b, a) => dm4Sent(b, a, [
        { fig: () => dm4Talk([["서아:", "나는 영양액 50 mL의 0.92배만큼 주었어."], ["민준:", "나는 영양액 40 mL의 1.38배만큼 주었어."]]) },
        ["서아: 0.92를 1로 어림하면 50×1 =", { n: "50" }, "이에요. 0.92는 1보다 작으니 서아가 준 영양액은 50 mL보다", { o: ["많아요", "적어요"], a: 1 }],
        ["민준: 1.38을 1.5로 어림하면 40×1.5 =", { n: "60", e: "40×1.5" }, "이므로 민준이가 준 영양액은 약 60 mL예요."],
        ["영양액을 더 많이 준 사람은", { o: ["서아", "민준"], a: 1, why: { "0": "서아는 50 mL보다 적게, 민준이는 60 mL쯤 주었어요." } }]],
        { ok: "어림해 보니 서아는 50 mL보다 적게, 민준이는 약 60 mL를 주었어요. 민준이가 더 많이 주었어요." }),
        { q: "어떻게 어림했는지 친구에게 설명해 봐요.", ph: "서아는 ~, 민준이는 ~", help: ["① 곱하는 소수 0.92와 1.38을 가까운 수로 바꾸어요. → ② 어림한 두 값을 견주어요.", "‘서아는 0.92를 ~로 어림해서 ~보다 적고, 민준이는 1.38을 ~로 어림해서 약 ~이에요.’ 꼴로 써요."],
          ans: "서아는 50 mL에 1보다 작은 0.92를 곱했으니 50 mL보다 적게 주었어요. 민준이는 1.38을 1.5로 어림하면 40×1.5=60이니 약 60 mL예요. 그래서 민준이가 더 많이 주었어요." }) },
    { name: "약속하기 — (자연수)×(소수 두 자리 수)", inst: "약속을 완성해 보세요.", hints: ["6×1.35=6×[135/100]이었어요.", "1.35×6을 계산해도 같은 8.1이 나와요."],
      render: (b, a) => blanks(b, a, ["(자연수)×(소수 두 자리 수)는 분모가 ", { o: ["10", "100", "1000"], a: 1 }, "인 분수의 곱셈으로 나타내어 계산하거나, 곱하는 수를 100배 한 자연수의 곱셈을 한 뒤 곱을 ", { o: ["[1/10]배", "[1/100]배"], a: 1 }, " 해요. 곱해지는 수와 곱하는 수의 순서를 바꾸어도 곱은 ", { o: ["같아요", "달라요"], a: 0 }, "."], { ok: "6×1.35와 1.35×6은 모두 8.1이에요. 곱하는 순서를 바꾸어도 곱은 같아요." }) },
    { name: "확인하기 — 세로셈과 영양액의 양", inst: "계산해 보고, 서아와 민준이가 준 영양액을 정확하게 구해 어림한 결과와 견주어 보세요.", hints: ["14×2.05는 14×205=2870의 [1/100]배예요.", "30×1.08은 30×108=3240의 [1/100]배예요.", "50×0.92는 50×92=4600의 [1/100]배예요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "14", b: "2.05" }, { a: "30", b: "1.08" }],
        rows: [
          ["9×0.36 = 9×", { f: ["36", "100"] }, "=", { f: ["324", "100"] }, "=", { n: "3.24", e: "9×0.36" }],
          ["서아가 준 영양액은 50×0.92 =", { n: "46", e: "50×0.92" }, "mL, 민준이가 준 영양액은 40×1.38 =", { n: "55.2", e: "40×1.38" }, "mL예요."],
          ["정확하게 계산해도 더 많이 준 사람은", { o: ["서아", "민준"], a: 1 }]],
        ok: "14×2.05=28.7, 30×1.08=32.4, 9×0.36=3.24예요. 영양액은 서아 46 mL, 민준 55.2 mL로 어림한 결과와 같아요." }) }
  ],
  challenge: { inst: "★ 도전 — 어림해서 고르고, 강낭콩 키를 구해 보세요.", hints: ["0.85는 1보다 작으니 9×0.85는 9보다 작아요. 얼마나 작은지 따져 봐요.", "2.75는 3보다 조금 작으니 3×2.75는 9보다 조금 작아요.", "16의 1.75배는 16의 0.25배(4)가 7개예요."],
    render: (b, a) => dm4Sent(b, a, [
      { q: "곱이 8보다 작은 것을 모두 골라 보세요.", p: [{ m: ["9×0.85", "3×2.75", "7×1.16", "4×1.98"], a: [0, 3] }] },
      ["서아의 강낭콩은 처음에 16 cm였는데, 3주 뒤에는 처음 키의 1.75배가 되었어요. 3주 뒤 키는", { n: "28", e: "16×1.75" }, "cm예요."]],
      { ok: "9×0.85=7.65, 4×1.98=7.92는 8보다 작고, 3×2.75=8.25, 7×1.16=8.12는 8보다 커요. 서아의 강낭콩은 28 cm가 되었어요." }) }
},
{
  id: "s6", no: 6, title: "모종판에 씨앗을 심어요 ― (소수 한 자리 수)×(소수 한 자리 수)", soop: "개념 구축하기(O)",
  question: "(소수 한 자리 수)×(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "가로 0.7 m, 세로 0.4 m인 모종판은 1 m×1 m 모눈에서 0.01 m²인 칸 28개이므로 0.7×0.4=0.28 (m²)예요. 2.6×1.8=[26/10]×[18/10]=[468/100]=4.68처럼 분수의 곱셈으로 계산하거나, 26×18=468의 [1/100]배로 계산해요. 곱해지는 수와 곱하는 수가 각각 [1/10]배이면 곱은 [1/100]배가 돼요. 1보다 작은 두 수의 곱은 두 수보다 작아요.",
  steps: [
    { name: "만져 보기 — 모종판의 넓이", inst: "하윤이네 모둠의 작은 모종판은 가로 0.7 m, 세로 0.4 m인 직사각형이에요. 먼저 예상을 쓰고, 한 변이 1 m인 정사각형 모눈에 모종판만큼 색칠해 넓이를 알아보세요.", hints: ["모눈 한 칸의 가로와 세로는 0.1 m예요. 한 칸의 넓이는 0.01 m²예요.", "가로 7칸, 세로 4칸을 색칠해요.", "0.01이 28개이면 0.28이에요."],
      render: ruleFirst((b, a) => dm4Area(b, a, { w: 7, h: 4, unit: "m", color: "#A9D8A2",
        asks: [
          ["모종판의 넓이를 구하는 식은", { o: ["0.7×0.4", "0.7+0.4", "7×4"], a: 0 }],
          ["색칠한 칸은 7×4 =", { n: "28", s: 1 }, "칸이에요."],
          ["모눈 한 칸은 0.01 m²이므로 0.7×0.4 = 0.01×", { n: "28", s: 1 }, "=", { n: "0.28", e: "0.7×0.4", why: { "2.8": "0.01이 28개인 수예요. 0.1이 28개가 아니에요.", "28": "0.01이 28개인 수를 소수로 써요." } }],
          ["모종판의 넓이는", { n: "0.28" }, "m²이고, 곱 0.28은 0.7과 0.4보다", { o: ["커요", "작아요"], a: 1 }, "."]],
        ok: "0.7×0.4는 0.01이 28개인 0.28이에요. 모종판의 넓이는 0.28 m²예요." }),
        { q: "0.7×0.4의 곱은 0.7보다 클까요, 작을까요? 어떻게 구할 수 있을까요?", ph: "내 규칙: 0.4는 1보다 ~", help: ["① 곱하는 수 0.4가 1보다 큰지 작은지 생각해요. → ② 0.1 m×0.1 m인 칸이 몇 개인지 세는 방법을 떠올려요.", "‘내 규칙: 0.4는 1보다 ~니까 곱은 0.7보다 ~. 0.01인 칸이 ~개예요.’ 꼴로 써요."],
          ans: "0.4는 1보다 작으니까 곱은 0.7보다 작아요. 0.1 m×0.1 m인 칸(0.01 m²)이 7×4=28칸이므로 0.7×0.4=0.28이에요." }) },
    { name: "그려 보기 — 2.6×1.8을 두 가지 방법으로", inst: "도윤이네 모둠은 운동장 옆에 큰 모종판을 놓을 화단 자리를 만들었어요. 가로 2.6 m, 세로 1.8 m인 직사각형이에요. 넓이는 2.6×1.8 (m²)예요. 먼저 어림해 보고, 두 가지 방법으로 계산해 보세요.", hints: ["2.6=[26/10], 1.8=[18/10]이에요. 분자는 분자끼리, 분모는 분모끼리 곱해요.", "26×18=468이에요.", "2.6과 1.8이 각각 [1/10]배이니 곱은 [1/10]×[1/10]=[1/100]배예요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["2.6을 2.5로, 1.8을 2로 어림하면 2.5×2 =", { n: "5", e: "2.5×2" }, "이므로 화단의 넓이는 약 5 m²예요."]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["2.6×1.8 =", { f: ["26", "10"] }, "×", { f: ["18", "10"] }, "= [26×18/100] =", { f: ["468", "100"], why: { "468/10": "분모 10과 10을 곱하면 100이에요." } }, "=", { n: "4.68", e: "2.6×1.8" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [
          { fig: () => dm4RelFig([["26", "18", "468"], ["2.6", "1.8", "4.68"]], { a: "1/10", b: "1/10", p: "1/100" }) },
          ["26×18 =", { n: "468", e: "26×18" }, ". 2.6과 1.8은 각각 26과 18의 [1/10]배이므로 2.6×1.8은 468의", { o: ["[1/10]배", "[1/100]배", "100배"], a: 1, why: { "0": "곱해지는 수도 [1/10]배, 곱하는 수도 [1/10]배예요. 곱은 [1/10]배의 [1/10]배예요.", "2": "소수끼리 곱했는데 곱이 100배로 커지지는 않아요. [1/100]배로 작아져요." } }, "인", { n: "4.68", e: "2.6×1.8", why: { "46.8": "곱해지는 수와 곱하는 수가 모두 [1/10]배이니 곱은 [1/100]배예요." } }, "이에요."]] },
        ["어림한 5와 계산한 4.68은", { o: ["비슷해요", "많이 달라요"], a: 0 }]],
      { ok: "2.6×1.8=4.68이에요. 어림한 5 m²와 비슷해요." }) },
    { name: "말해 보기 — 왜 [1/100]배일까?", inst: "4.3×2.7을 두 가지 방법으로 계산하고, 곱이 왜 [1/100]배가 되는지 말해 보세요.", hints: ["4.3=[43/10], 2.7=[27/10]이에요.", "43×27=1161이에요.", "[1/10]배의 [1/10]배는 [1/100]배예요."],
      render: thenWhy((b, a) => dm4Sent(b, a, [
        { g: "방법 ①", rows: [["4.3×2.7 =", { f: ["43", "10"] }, "×", { f: ["27", "10"] }, "=", { f: ["1161", "100"] }, "=", { n: "11.61", e: "4.3×2.7" }]] },
        { g: "방법 ②", rows: [["43×27 =", { n: "1161", e: "43×27" }, "→ 4.3×2.7 =", { n: "11.61", e: "4.3×2.7", why: { "116.1": "4.3과 2.7이 모두 [1/10]배이니 곱은 [1/100]배예요." } }]] },
        ["4.3을 4로, 2.7을 3으로 어림하면 4×3 = 12이므로 11.61은", { o: ["알맞아요", "너무 작아요"], a: 0 }]],
        { ok: "4.3×2.7=11.61이에요. 어림한 12와 비슷해요." }),
        { q: "43×27=1161을 계산한 뒤 4.3×2.7은 왜 [1/100]배를 할까요?", ph: "4.3은 43의 ~배이고, 2.7은 ~", help: ["① 4.3과 43, 2.7과 27의 관계를 각각 찾아요. → ② 두 수가 모두 [1/10]배가 되면 곱은 어떻게 되는지 생각해요.", "‘4.3은 43의 ~배, 2.7은 27의 ~배이므로 곱은 1161의 ~배예요.’ 꼴로 써요."],
          ans: "4.3은 43의 [1/10]배이고 2.7은 27의 [1/10]배예요. 곱해지는 수와 곱하는 수가 모두 [1/10]배가 되었으니 곱은 [1/10]배의 [1/10]배인 [1/100]배가 돼서 11.61이에요." }) },
    { name: "약속하기 — (소수)×(소수) 계산 방법", inst: "약속을 완성해 보세요.", hints: ["2.6×1.8=[26/10]×[18/10]이었어요.", "26×18=468의 [1/100]배가 2.6×1.8이었어요."],
      render: (b, a) => blanks(b, a, ["(소수 한 자리 수)×(소수 한 자리 수)는 분모가 10인 두 분수의 ", { o: ["곱셈", "덧셈"], a: 0 }, "으로 나타내어 계산하거나, 자연수의 곱셈을 한 뒤 곱을 ", { o: ["[1/10]배", "[1/100]배"], a: 1 }, " 해요. 1보다 작은 두 소수의 곱은 두 수보다 ", { o: ["커요", "작아요"], a: 1 }, "."], { ok: "소수 한 자리 수끼리 곱하면 곱은 자연수의 곱의 [1/100]배예요." }) },
    { name: "확인하기 — 세로셈과 어림", inst: "계산해 보고, 곱을 어림해서 알맞은 것을 골라 보세요.", hints: ["3.5×0.7은 35×7=245의 [1/100]배예요.", "2.4×5.6은 24×56=1344의 [1/100]배예요.", "7.2×3.2를 7×3으로 어림하면 21쯤이에요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "3.5", b: "0.7" }, { a: "2.4", b: "5.6" }],
        rows: [
          ["0.6×0.9 =", { f: ["6", "10"] }, "×", { f: ["9", "10"] }, "=", { f: ["54", "100"] }, "=", { n: "0.54", e: "0.6×0.9" }],
          ["7.2×3.2를 어림하면 7×3=21쯤이므로 곱은", { o: ["2.304", "23.04", "230.4"], a: 1, why: { "0": "21쯤이어야 하는데 2.304는 너무 작아요.", "2": "21쯤이어야 하는데 230.4는 너무 커요." } }]],
        ok: "3.5×0.7=2.45, 2.4×5.6=13.44, 0.6×0.9=0.54, 7.2×3.2=23.04예요. 어림하면 소수점 위치를 확인할 수 있어요." }) }
  ],
  challenge: { inst: "★ 도전 — 한 변이 3.5 m인 정사각형 화단의 가로를 0.6배로 줄이고, 세로를 1.4배로 늘여 새 화단을 만들었어요.", hints: ["새 가로는 3.5×0.6, 새 세로는 3.5×1.4예요.", "넓이는 (가로)×(세로)예요.", "0.8×6.5를 먼저 계산해요."],
    render: (b, a) => dm4Sent(b, a, [
      ["새 화단의 가로는", { n: "2.1", e: "3.5×0.6" }, "m, 세로는", { n: "4.9", e: "3.5×1.4" }, "m예요."],
      ["새 화단의 넓이는", { n: "10.29", e: "2.1×4.9" }, "m²예요."],
      ["0.8×6.5 < □에서 □ 안에 들어갈 수 있는 가장 작은 자연수는", { n: "6", s: 1, why: { "5": "0.8×6.5=5.2예요. 5는 5.2보다 작아요." } }, "이에요."]],
    { ok: "새 화단은 가로 2.1 m, 세로 4.9 m, 넓이 10.29 m²예요. 0.8×6.5=5.2이므로 가장 작은 자연수는 6이에요." }) }
},
{
  id: "s7", no: 7, title: "소금물을 나누어 써요 ― (소수 두 자리 수)×(소수 한 자리 수)", soop: "개념 구축하기(O)",
  question: "(소수 두 자리 수)×(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "0.35의 0.1배는 0.035이므로 0.35의 0.6배는 0.035×6=0.21이에요(0.35×0.6=0.21). 3.24×2.5=[324/100]×[25/10]=[8100/1000]=8.1처럼 분수의 곱셈으로 계산하거나, 324×25=8100의 [1/1000]배로 계산해요. 곱해지는 수가 [1/100]배, 곱하는 수가 [1/10]배이면 곱은 [1/1000]배가 되고, 곱의 소수점 아래 자리 수는 2+1=3(자리)예요.",
  steps: [
    { name: "만져 보기 — 0.35 L의 0.6배", inst: "1모둠은 실험에 소금물을 0.35 L 썼고, 2모둠은 1모둠이 쓴 소금물의 0.6배만큼 썼어요. 이중 수직선의 아래 표시를 0.6배로 옮겨 2모둠이 쓴 소금물의 양을 알아보세요.", hints: ["아래 수직선의 작은 눈금 한 칸은 0.1배예요.", "0.35를 똑같이 10으로 나눈 하나가 0.35의 0.1배예요.", "0.35의 0.6배는 0.35의 0.1배가 6개예요."],
      render: thenWhy((b, a) => dm4Double(b, a, { top: "0.35", unit: "L", what: "1모둠이 쓴 소금물 0.35 L", bot: "1", step: "0.1", labels: ["0.1", "0.6"], target: "0.6", color: "#9CC6EC",
        asks: [
          ["2모둠이 쓴 소금물의 양을 구하는 식은", { o: ["0.35×0.6", "0.35+0.6", "0.35×6"], a: 0 }],
          ["0.35의 1배는 0.35이므로 0.35의 0.1배는", { n: "0.035", e: "0.35×0.1", why: { "0.35": "0.1배는 10으로 똑같이 나눈 것 중 하나예요. 0.35보다 작아요.", "3.5": "0.1배를 하면 작아져요. 소수점이 왼쪽으로 한 자리 옮겨져요." } }, "예요."],
          ["0.35의 0.6배는 0.035가", { n: "6", s: 1 }, "개이므로", { n: "0.21", e: "0.35×0.6", why: { "2.1": "0.35의 0.6배는 0.35보다 작아야 해요." } }, "이에요."],
          ["2모둠이 쓴 소금물은", { n: "0.21" }, "L예요."]],
        ok: "0.35의 0.1배는 0.035, 0.6배는 0.21이에요. 2모둠은 소금물을 0.21 L 썼어요." }),
        { q: "0.35의 0.1배가 왜 0.035일까요?", ph: "0.1배는 10으로 똑같이 나눈 것 중 ~", help: ["① 0.1배가 무엇을 뜻하는지 떠올려요. → ② 0.35를 10으로 똑같이 나누면 소수점이 어떻게 되는지 생각해요.", "‘0.1배는 ~으로 똑같이 나눈 것 중 하나라서 0.35의 소수점이 ~으로 한 자리 옮겨져요.’ 꼴로 써요."],
          ans: "0.1배는 10으로 똑같이 나눈 것 중 하나예요. 0.35를 10으로 똑같이 나누면 소수점이 왼쪽으로 한 자리 옮겨져 0.035가 돼요." }) },
    { name: "그려 보기 — 3.24×2.5를 두 가지 방법으로", inst: "태오네 모둠은 큰 수조에 물을 받으려고 해요. 물통 하나에 물이 3.24 L 들어가는데, 물통 2.5개만큼 받았어요. 받은 물은 3.24×2.5 (L)예요. 먼저 어림해 보고, 두 가지 방법으로 계산해 보세요.", hints: ["3.24=[324/100], 2.5=[25/10]이에요. 분모끼리 곱하면 1000이에요.", "324×25=8100이에요.", "곱해지는 수가 [1/100]배, 곱하는 수가 [1/10]배이니 곱은 [1/1000]배예요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["3.24를 3으로 어림하면 3×2.5 =", { n: "7.5", e: "3×2.5" }, "이므로 3.24×2.5는", { o: ["7.5보다 조금 커요", "7.5보다 조금 작아요"], a: 0, why: { "1": "3.24는 3보다 커요. 그러면 곱도 7.5보다 커요." } }]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["3.24×2.5 =", { f: ["324", "100"] }, "×", { f: ["25", "10"] }, "= [324×25/1000] =", { f: ["8100", "1000"], why: { "8100/100": "분모 100과 10을 곱하면 1000이에요." } }, "=", { n: "8.1", e: "3.24×2.5" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [
          { fig: () => dm4RelFig([["324", "25", "8100"], ["3.24", "2.5", "8.100"]], { a: "1/100", b: "1/10", p: "1/1000" }) },
          ["324×25 =", { n: "8100", e: "324×25" }, ". 3.24는 324의 [1/100]배, 2.5는 25의 [1/10]배이므로 3.24×2.5는 8100의", { o: ["[1/100]배", "[1/1000]배"], a: 1 }, "인", { n: "8.1", e: "3.24×2.5", why: { "81": "곱은 8100의 [1/1000]배예요. [1/100]배가 아니에요." } }, "이에요."]] },
        ["8.100과 8.1은", { o: ["같은 수예요", "다른 수예요"], a: 0, why: { "1": "소수의 끝자리 0은 생략할 수 있어요." } }]],
      { ok: "3.24×2.5=8.1이에요. 7.5보다 조금 클 거라고 어림했는데 8.1이 나왔어요." }) },
    { name: "말해 보기 — 같은 점과 다른 점", inst: "6차시의 (소수 한 자리 수)×(소수 한 자리 수)와 오늘 배운 (소수 두 자리 수)×(소수 한 자리 수)를 견주어 보세요.", hints: ["2.6×1.8은 소수 한 자리 수끼리의 곱이에요.", "1.27×3.4는 127×34=4318의 [1/1000]배예요.", "곱의 소수점 아래 자리 수는 두 수의 소수점 아래 자리 수를 더한 것과 같아요."],
      render: thenWhy((b, a) => dm4Sent(b, a, [
        ["2.6×1.8 = 4.68에서 곱의 소수점 아래 자리 수는 1+1 =", { n: "2", s: 1 }, "(자리)예요."],
        ["127×34 =", { n: "4318", e: "127×34" }, "이므로 1.27×3.4 =", { n: "4.318", e: "1.27×3.4" }],
        ["1.27×3.4에서 곱의 소수점 아래 자리 수는 2+1 =", { n: "3", s: 1 }, "(자리)예요."]],
        { ok: "두 경우 모두 자연수처럼 곱한 뒤 소수점을 찍어요. 소수점 아래 자리 수가 2자리, 3자리로 달라요." }),
        { q: "(소수 한 자리 수)×(소수 한 자리 수)와 (소수 두 자리 수)×(소수 한 자리 수)의 같은 점과 다른 점을 써 봐요.", ph: "같은 점은 ~, 다른 점은 ~", help: ["① 두 계산을 할 때 자연수의 곱셈을 이용한 점을 떠올려요. → ② 곱을 몇 배 했는지, 소수점 아래 자리 수가 몇인지 견주어요.", "‘같은 점은 ~하는 것이고, 다른 점은 곱을 ~배와 ~배 하는 것이에요.’ 꼴로 써요."],
          ans: "같은 점은 두 경우 모두 자연수의 곱셈을 한 뒤 곱의 소수점을 찍는 것이에요. 다른 점은 소수 한 자리 수끼리는 곱을 [1/100]배 해서 소수 두 자리 수가 되고, 소수 두 자리 수와 소수 한 자리 수의 곱은 [1/1000]배 해서 소수 세 자리 수가 되는 것이에요." }) },
    { name: "약속하기 — (소수 두 자리 수)×(소수 한 자리 수)", inst: "약속을 완성해 보세요.", hints: ["3.24×2.5=[324/100]×[25/10]이었어요.", "324×25=8100의 [1/1000]배가 3.24×2.5였어요."],
      render: (b, a) => blanks(b, a, ["(소수 두 자리 수)×(소수 한 자리 수)는 분모가 100과 10인 분수의 곱셈으로 나타내어 계산하거나, 자연수의 곱셈을 한 뒤 곱을 ", { o: ["[1/100]배", "[1/1000]배"], a: 1 }, " 해요. 곱의 소수점 아래 자리 수는 2+1 = ", { o: ["2", "3"], a: 1 }, "(자리)예요."], { ok: "소수 두 자리 수와 소수 한 자리 수를 곱하면 곱은 소수 세 자리 수가 돼요(끝자리 0은 생략할 수 있어요)." }) },
    { name: "확인하기 — 세로셈으로 계산하기", inst: "계산해 보세요. 곱의 소수점 아래 자리 수를 세어 소수점을 찍어요.", hints: ["2.18×0.6은 218×6=1308의 [1/1000]배예요.", "1.36×2.4는 136×24=3264의 [1/1000]배예요.", "0.45×0.3은 45×3=135의 [1/1000]배예요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "2.18", b: "0.6" }, { a: "1.36", b: "2.4" }],
        rows: [["0.45×0.3 =", { f: ["45", "100"] }, "×", { f: ["3", "10"] }, "=", { f: ["135", "1000"] }, "=", { n: "0.135", e: "0.45×0.3" }]],
        ok: "2.18×0.6=1.308, 1.36×2.4=3.264, 0.45×0.3=0.135예요. 곱의 소수점 아래 자리 수가 3자리예요." }) }
  ],
  challenge: { inst: "★ 도전 — 6.25×1.6을 계산하고, 이 식에 알맞은 캠프 문제를 만들어 보세요. 두 가지를 모두 해야 계단을 올라요.", hints: ["625×16=10000이에요.", "곱의 소수점 아래 자리 수는 2+1=3(자리)예요. 10.000=10이에요.", "‘한 ~에 6.25 ~씩’, ‘~의 1.6배’처럼 문제를 만들어요."],
    render: (b, a) => { dm4Sent(b, a, [["6.25×1.6 =", { n: "10", e: "6.25×1.6", why: { "100": "곱의 소수점 아래 자리 수는 3자리예요. 10.000=10이에요.", "1": "6.25를 6으로, 1.6을 2로 어림하면 12쯤이에요." } }]], { ok: "6.25×1.6=10이에요. 끝자리 0을 생략하면 10이에요." });
      writeStep(b, a, [{ q: "6.25×1.6에 알맞은 캠프 문제를 만들어 써 봐요.", tag: "문제", ph: "예) 화단의 가로가 6.25 m, 세로가 1.6 m일 때 ~", help: ["① 6.25와 1.6이 무엇의 양인지 정해요(길이, 들이, 무게 등). → ② ‘~의 1.6배’나 ‘가로·세로’처럼 곱셈이 필요한 물음을 만들어요.", "‘~는 6.25 ~이고, ~는 그 1.6배예요. ~는 몇 ~일까요?’ 꼴로 써요."],
        ans: "캠프 화단의 가로는 6.25 m이고 세로는 1.6 m예요. 화단의 넓이는 몇 m²일까요? (답: 6.25×1.6=10, 10 m²)" }]); } }
},
{
  id: "s8", no: 8, title: "돋보기와 지도 ― 곱의 소수점 위치", soop: "개념 구축하기(O)",
  question: "곱의 소수점 위치는 어떻게 달라질까요?",
  summary: "소수에 10, 100, 1000을 곱하면 곱하는 수의 0의 개수만큼 곱의 소수점이 오른쪽으로 옮겨지고(0.36×100=36), 자연수에 0.1, 0.01, 0.001을 곱하면 곱하는 수의 소수점 아래 자리 수만큼 곱의 소수점이 왼쪽으로 옮겨져요(425×0.01=4.25). 소수끼리 곱할 때 곱의 소수점 아래 자리 수는 두 수의 소수점 아래 자리 수를 더한 것과 같아요(43×27=1161 → 4.3×0.27=1.161).",
  steps: [
    { name: "만져 보기 — 확대하고 줄이기", inst: "지호는 지름이 0.36 mm인 물방울을 돋보기와 현미경으로 10배, 100배, 1000배로 확대해 보았어요. 도윤이는 길이가 425 m인 캠프장 산책로를 지도에 0.1배, 0.01배, 0.001배로 줄여 그려 보았어요. 먼저 규칙을 예상하고, 단추를 모두 눌러 곱의 소수점이 어떻게 움직이는지 살펴보세요.", hints: ["숫자는 그대로 있고 빨간 소수점만 움직여요.", "10을 곱하면 한 자리, 100을 곱하면 두 자리 옮겨져요.", "0.1을 곱하면 왼쪽으로 한 자리, 0.01을 곱하면 왼쪽으로 두 자리 옮겨져요."],
      render: ruleFirst((b, a) => dm4Shift(b, a, { sets: [{ name: "가 · 물방울 확대", start: "0.36", fs: ["1", "10", "100", "1000"] }, { name: "나 · 산책로 지도", start: "425", fs: ["1", "0.1", "0.01", "0.001"] }],
        asks: [
          ["가: 곱하는 수가 10배, 100배, 1000배가 될수록 곱의 소수점이", { o: ["오른쪽으로", "왼쪽으로"], a: 0 }, "한 자리씩 옮겨져요."],
          ["나: 곱하는 수가 [1/10]배, [1/100]배, [1/1000]배가 될수록 곱의 소수점이", { o: ["오른쪽으로", "왼쪽으로"], a: 1 }, "한 자리씩 옮겨져요."],
          ["물방울을 1000배로 확대하면 지름이", { n: "360", e: "0.36×1000" }, "mm인 것처럼 보여요."],
          ["산책로를 0.001배로 줄이면 지도에서", { n: "0.425", e: "425×0.001", why: { "0.0425": "0.001은 소수 세 자리 수예요. 소수점을 왼쪽으로 세 자리 옮겨요.", "4.25": "그것은 0.01배예요. 0.001배는 왼쪽으로 세 자리예요." } }, "m예요."]],
        ok: "소수에 10, 100, 1000을 곱하면 소수점이 오른쪽으로, 자연수에 0.1, 0.01, 0.001을 곱하면 소수점이 왼쪽으로 옮겨져요." }),
        { q: "소수에 10, 100, 1000을 곱하거나 자연수에 0.1, 0.01, 0.001을 곱하면 곱의 소수점은 어떻게 옮겨질까요?", ph: "내 규칙: 10을 곱하면 ~", help: ["① 10배는 숫자들이 한 자리씩 커지는 것을 떠올려요. → ② 0.1배는 10으로 똑같이 나눈 것과 같다는 것을 떠올려요.", "‘내 규칙: 10, 100, 1000을 곱하면 소수점이 ~으로, 0.1, 0.01, 0.001을 곱하면 ~으로 옮겨져요.’ 꼴로 써요."],
          ans: "소수에 10, 100, 1000을 곱하면 곱하는 수의 0의 개수만큼 소수점이 오른쪽으로 옮겨지고, 자연수에 0.1, 0.01, 0.001을 곱하면 곱하는 수의 소수점 아래 자리 수만큼 소수점이 왼쪽으로 옮겨져요." }) },
    { name: "그려 보기 — 분수의 곱셈으로 살펴보기", inst: "분수의 곱셈으로 나타내어 계산하고, 곱의 소수점 위치가 어떻게 달라지는지 살펴보세요. 자연수는 분모가 1인 분수로 나타낼 수 있어요.", hints: ["0.7=[7/10], 0.07=[7/100]이에요.", "분모 10과 10을 곱하면 100, 100과 10을 곱하면 1000이에요.", "분모가 1000이면 소수 세 자리 수예요."],
      render: (b, a) => dm4Sent(b, a, [
        ["7×6 = [7/1]×[6/1] =", { n: "42", e: "7×6" }],
        ["0.7×6 =", { f: ["7", "10"] }, "×[6/1] =", { f: ["42", "10"] }, "=", { n: "4.2", e: "0.7×6" }],
        ["0.7×0.6 = [7/10]×[6/10] =", { f: ["42", "100"] }, "=", { n: "0.42", e: "0.7×0.6", why: { "4.2": "분모가 100이에요. 소수 두 자리 수로 나타내요." } }],
        ["0.07×0.6 =", { f: ["7", "100"] }, "×[6/10] =", { f: ["42", "1000"] }, "=", { n: "0.042", e: "0.07×0.6", why: { "0.42": "분모가 1000이에요. 소수 세 자리 수로 나타내요." } }],
        ["두 수의 소수점 아래 자리 수를", { o: ["더한", "곱한"], a: 0 }, "만큼 곱의 소수점 아래 자리 수가 정해져요."]],
      { ok: "42 → 4.2 → 0.42 → 0.042처럼 두 수의 소수점 아래 자리 수가 늘어날 때마다 곱의 소수점이 왼쪽으로 옮겨져요." }) },
    { name: "말해 보기 — 보기를 이용해 소수점 찍기", inst: "보기의 곱셈 43×27=1161을 이용해서 곱의 소수점을 찍어 보세요. 계산기가 있다면 계산기로도 확인해 봐요.", hints: ["4.3×27은 소수점 아래 자리 수가 1+0=1(자리)예요.", "4.3×0.27은 1+2=3(자리)예요.", "0.43×0.27은 2+2=4(자리)예요. 소수점 앞에 0을 써야 해요."],
      render: thenWhy((b, a) => dm4Point(b, a, { intro: () => dm4Talk([["보기:", "43×27 = 1161"]]), items: [{ e: "4.3×27" }, { e: "4.3×2.7" }, { e: "4.3×0.27" }, { e: "0.43×0.27" }],
        ok: "4.3×27=116.1, 4.3×2.7=11.61, 4.3×0.27=1.161, 0.43×0.27=0.1161이에요." }),
        { q: "4.3×0.27의 곱의 소수점은 어디에 찍어야 할까요? 까닭을 써 봐요.", ph: "4.3은 소수 ~자리, 0.27은 ~", help: ["① 4.3과 0.27의 소수점 아래 자리 수를 각각 세어요. → ② 두 자리 수를 더해 곱의 소수점 아래 자리 수를 정해요.", "‘4.3은 소수 ~자리, 0.27은 소수 ~자리라서 곱은 ~자리 소수예요.’ 꼴로 써요."],
          ans: "4.3은 소수 한 자리 수, 0.27은 소수 두 자리 수라서 곱은 1+2=3(자리) 소수예요. 1161에서 소수점을 왼쪽으로 세 자리 옮겨 1.161이에요. 4×0.3=1.2쯤으로 어림해도 알맞아요." }) },
    { name: "약속하기 — 곱의 소수점 위치", inst: "약속을 완성해 보세요.", hints: ["0.36×100=36이었어요.", "425×0.01=4.25였어요.", "4.3×0.27은 1+2=3(자리)였어요."],
      render: (b, a) => blanks(b, a, ["소수에 10, 100, 1000을 곱하면 곱하는 수의 0의 개수만큼 곱의 소수점이 ", { o: ["오른쪽", "왼쪽"], a: 0 }, "으로 옮겨지고, 자연수에 0.1, 0.01, 0.001을 곱하면 곱하는 수의 소수점 아래 자리 수만큼 곱의 소수점이 ", { o: ["오른쪽", "왼쪽"], a: 1 }, "으로 옮겨져요. 소수끼리 곱할 때 곱의 소수점 아래 자리 수는 두 수의 소수점 아래 자리 수를 ", { o: ["더한", "곱한"], a: 0 }, " 것과 같아요."], { ok: "곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을 옮겨요." }) },
    { name: "확인하기 — 규칙으로 계산하기", inst: "곱의 소수점 위치 규칙을 이용해 계산해 보세요.", hints: ["2.47×100은 소수점을 오른쪽으로 두 자리 옮겨요.", "386×0.01은 소수점을 왼쪽으로 두 자리 옮겨요.", "36×25=900이에요. 각 식의 소수점 아래 자리 수를 세어 봐요."],
      render: (b, a) => dm4Sent(b, a, [
        ["2.47×10 =", { n: "24.7", e: "2.47×10" }, ", 2.47×100 =", { n: "247", e: "2.47×100" }, ", 2.47×1000 =", { n: "2470", e: "2.47×1000", why: { "247": "1000을 곱하면 소수점이 오른쪽으로 세 자리 옮겨져요. 빈자리에는 0을 써요." } }],
        ["386×0.1 =", { n: "38.6", e: "386×0.1" }, ", 386×0.01 =", { n: "3.86", e: "386×0.01" }, ", 386×0.001 =", { n: "0.386", e: "386×0.001" }],
        { q: "곱이 다른 하나를 골라 보세요.", p: [{ o: ["36×0.25", "3.6×2.5", "0.36×2.5"], a: 2, why: { "0": "36×0.25는 소수점 아래 자리 수가 2자리라서 9.00=9예요.", "1": "3.6×2.5는 1+1=2(자리)라서 9.00=9예요." } }] }],
      { ok: "2.47×10=24.7, ×100=247, ×1000=2470, 386×0.1=38.6, ×0.01=3.86, ×0.001=0.386이에요. 0.36×2.5만 0.9로 곱이 달라요." }) }
  ],
  challenge: { inst: "★ 도전 — 곱의 소수점 위치 규칙으로 문제를 해결해 보세요.", hints: ["0.6×0.4=0.24예요. 0.024가 되려면 소수점 아래 자리 수가 3자리여야 해요.", "52×18=936이에요. 0.936은 936에서 소수점을 왼쪽으로 세 자리 옮긴 수예요.", "93.6은 936에서 왼쪽으로 한 자리예요. 1800은 18의 100배예요."],
    render: (b, a) => dm4Sent(b, a, [
      { q: "도윤이가 계산기로 0.6×0.4를 계산하려다 한 수의 소수점을 잘못 눌러 0.024가 나왔어요. 도윤이가 누른 식은 무엇일까요?", p: [{ o: ["0.06×0.4", "6×0.4", "0.6×4"], a: 0, why: { "1": "6×0.4=2.4예요.", "2": "0.6×4=2.4예요." } }] },
      ["한 개에 2.35 g인 각설탕 10개는", { n: "23.5", e: "2.35×10" }, "g, 100개는", { n: "235", e: "2.35×100" }, "g, 1000개는", { n: "2350", e: "2.35×1000" }, "g이에요."],
      ["52×18 = 936을 이용하면 5.2×", { n: "0.18", why: { "1.8": "5.2×1.8=9.36이에요. 곱의 소수점 아래 자리 수가 3자리가 되려면 소수 두 자리 수를 곱해야 해요." } }, "= 0.936이고,", { n: "0.052", why: { "0.52": "0.52×1800=936이에요. 93.6이 되려면 소수점을 한 자리 더 왼쪽으로 옮겨요." } }, "×1800 = 93.6이에요."]],
    { ok: "0.06×0.4=0.024, 각설탕은 23.5 g, 235 g, 2350 g, 5.2×0.18=0.936, 0.052×1800=93.6이에요." }) }
},
{
  id: "s9", no: 9, title: "캠프 탐구 보고서를 정리해요", soop: "탐구 정리하기(O)",
  question: "지금까지 배운 소수의 곱셈을 어떻게 정리할 수 있을까요?",
  summary: "(소수)×(자연수), (자연수)×(소수), (소수)×(소수)는 모두 분수의 곱셈으로 나타내거나 자연수의 곱셈을 이용하여 계산해요. 곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을 옮기고, 곱의 소수점 아래 자리 수는 두 수의 소수점 아래 자리 수를 더한 것과 같아요. 계산하기 전에 어림하면 소수점 위치가 맞는지 확인할 수 있어요.",
  steps: [
    { name: "만져 보기 — 그림 모델 다시 보기", inst: "캠프에서 한 실험을 떠올리며, 그림 모델로 곱을 구했던 방법을 정리해 보세요.", hints: ["0.6×3은 0.1이 6×3=18(개)예요.", "3의 0.1배는 0.3이에요.", "모눈 한 칸은 0.01이에요."],
      render: (b, a) => dm4Sent(b, a, [
        ["🧪 비커: 0.6×3은", { o: ["0.1이 18개", "0.01이 18개"], a: 0 }, "이므로", { n: "1.8", e: "0.6×3" }],
        ["🔌 구리선: 3×0.7은 3의 0.1배인 0.3이", { n: "7", s: 1 }, "개이므로", { n: "2.1", e: "3×0.7" }],
        ["🪴 모종판: 0.7×0.4는 모눈 한 칸 0.01이", { n: "28", s: 1 }, "개이므로", { n: "0.28", e: "0.7×0.4" }],
        ["🧂 소금물: 0.35×0.6은 0.35의 0.1배인 0.035가 6개이므로", { n: "0.21", e: "0.35×0.6" }]],
      { ok: "막대 색칠, 이중 수직선, 모눈 그림으로 소수의 곱셈의 원리를 알아보았어요." }) },
    { name: "그려 보기 — 확인하고 정리해요", inst: "네 가지 소수의 곱셈을 분수의 곱셈과 자연수의 곱셈으로 정리해 보세요.", hints: ["1.46=[146/100]이에요.", "5×1.7=5×[17/10]이에요.", "1.45=[145/100], 1.6=[16/10]이에요. 분모끼리 곱하면 1000이에요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "(소수)×(자연수)", rows: [["1.46×3 =", { f: ["146", "100"] }, "×3 =", { f: ["438", "100"] }, "=", { n: "4.38", e: "1.46×3" }]] },
        { g: "(자연수)×(소수)", rows: [["5×1.7 = 5×", { f: ["17", "10"] }, "=", { f: ["85", "10"] }, "=", { n: "8.5", e: "5×1.7" }]] },
        { g: "(소수)×(소수)", rows: [["1.45×1.6 =", { f: ["145", "100"] }, "×", { f: ["16", "10"] }, "=", { f: ["2320", "1000"] }, "=", { n: "2.32", e: "1.45×1.6" }]] },
        { g: "곱의 소수점 위치", rows: [["24×13 = 312이므로 2.4×1.3 =", { n: "3.12", e: "2.4×1.3" }, ", 2.4×0.13 =", { n: "0.312", e: "2.4×0.13", why: { "3.12": "0.13은 소수 두 자리 수예요. 곱은 1+2=3(자리) 소수예요." } }]] }],
      { ok: "1.46×3=4.38, 5×1.7=8.5, 1.45×1.6=2.32, 2.4×1.3=3.12, 2.4×0.13=0.312예요." }) },
    { name: "말해 보기 — 친구의 생각 고치기", inst: "하윤이와 민준이의 말을 듣고 잘못된 곳을 찾아보세요. 그리고 민준이에게 설명해 주세요.", hints: ["2.3을 2로, 4.6을 5로 어림하면 2×5=10이에요.", "23×46=1058이고, 곱의 소수점 아래 자리 수는 1+1=2(자리)예요.", "3×0.7=2.1처럼 1보다 작은 수를 곱하면 작아져요."],
      render: thenWhy((b, a) => dm4Sent(b, a, [
        { fig: () => dm4Talk([["하윤:", "2.3×4.6을 세로셈으로 계산했더니 105.8이 나왔어."], ["민준:", "곱셈을 하면 곱은 항상 곱해지는 수보다 커져."]]) },
        ["2.3×4.6을 2×5로 어림하면 약", { n: "10", e: "2×5" }, "이므로 105.8은", { o: ["알맞아요", "소수점 위치가 틀렸어요"], a: 1 }],
        ["바르게 계산하면 2.3×4.6 =", { n: "10.58", e: "2.3×4.6" }],
        ["민준이의 말은", { o: ["맞아요", "틀렸어요"], a: 1, why: { "0": "3×0.7=2.1처럼 1보다 작은 수를 곱하면 곱해지는 수보다 작아져요." } }]],
        { ok: "2.3×4.6=10.58이에요. 덧셈처럼 소수점을 맞추어 찍으면 안 돼요. 그리고 곱셈을 해도 곱이 작아질 수 있어요." }),
        { q: "민준이에게 곱셈을 해도 곱이 작아질 수 있다는 것을 예를 들어 설명해 봐요.", ph: "예를 들어 ~×0.~은 ~", help: ["① 캠프에서 1보다 작은 수를 곱했던 예를 하나 골라요. → ② 곱과 곱해지는 수를 견주어요.", "‘예를 들어 ~×~=~인데, ~은 ~보다 작아요. 1보다 작은 수를 곱하면 ~.’ 꼴로 써요."],
          ans: "예를 들어 구리선 3 m의 0.7배는 3×0.7=2.1(m)로 3 m보다 짧아요. 1보다 작은 수를 곱하면 곱이 곱해지는 수보다 작아져요." }) },
    { name: "약속하기 — 소수의 곱셈 정리", inst: "소수의 곱셈에서 배운 것을 한 문장으로 정리해 보세요.", hints: ["분수로 바꾸거나 자연수의 곱셈을 이용했어요.", "곱의 소수점 아래 자리 수는 두 수의 소수점 아래 자리 수의 합이에요."],
      render: (b, a) => blanks(b, a, ["소수의 곱셈은 ", { o: ["분수의 곱셈", "분수의 덧셈"], a: 0 }, "으로 나타내거나 ", { o: ["자연수의 곱셈", "소수의 덧셈"], a: 0 }, "을 이용하여 계산해요. 곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을 ", { o: ["옮겨요", "그대로 둬요"], a: 0 }, ". 계산하기 전에 ", { o: ["어림", "반올림한 정답"], a: 0 }, "을 해 보면 소수점 위치가 맞는지 알 수 있어요."], { ok: "소수의 곱셈을 잘 정리했어요!" }) },
    { name: "확인하기 — 캠프 문제 해결하기", inst: "캠프에서 생긴 문제를 해결해 보세요. 어림이 필요한 문제는 정확하게 계산하지 않아도 돼요.", hints: ["1보다 작은 수를 곱하면 곱해지는 수보다 작아져요.", "직사각형의 넓이는 (가로)×(세로)예요.", "5×2.45=12.25, 7.2×1.6=11.52예요."],
      render: (b, a) => dm4Sent(b, a, [
        { fig: () => dm4Talk([["서아:", "나는 정제수 2 L를 가지고 있어."], ["지호:", "나는 서아가 가진 정제수의 0.85배만큼 가지고 있어."], ["하윤:", "나는 서아가 가진 정제수의 1.05배만큼 가지고 있어."]]) },
        ["정제수를 가장 적게 가진 사람은", { o: ["서아", "지호", "하윤"], a: 1, why: { "0": "지호는 서아의 0.85배예요. 1보다 작은 수를 곱하면 작아져요.", "2": "하윤이는 서아의 1.05배예요. 1보다 큰 수를 곱하면 커져요." } }],
        ["가로 4.06 m, 세로 2 m인 직사각형 모종판 자리의 넓이는", { n: "8.12", e: "4.06×2" }, "m²예요."],
        ["실험용 정제수를 1 L에 2500원씩 3.6 L 사면", { n: "9000", e: "2500×3.6" }, "원이에요."],
        ["5×2.45", { o: [">", "=", "<"], a: 0, why: { "2": "5×2.45=12.25, 7.2×1.6=11.52예요." } }, "7.2×1.6"]],
      { ok: "지호가 정제수를 가장 적게 가졌어요(2×0.85=1.7, 2×1.05=2.1). 모종판 자리는 8.12 m², 정제수 값은 9000원이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 세로셈으로 계산해 보세요. 곱의 소수점 아래 자리 수를 세고, 필요하면 소수점 앞에 0을 써요.", hints: ["3.48×2.6은 348×26=9048의 [1/1000]배예요.", "0.75×0.08은 75×8=600이고, 곱의 소수점 아래 자리 수는 2+2=4(자리)예요.", "0.0600=0.06이에요."],
    render: (b, a) => dm4Vert(b, a, { probs: [{ a: "3.48", b: "2.6" }, { a: "0.75", b: "0.08" }],
      ok: "3.48×2.6=9.048, 0.75×0.08=0.06이에요. 0이 많은 곱도 소수점 아래 자리 수를 세어 찍었어요!" }) }
},
{
  id: "s10", no: 10, title: "캠프 식단의 열량을 발표해요", soop: "발표하기(P)",
  question: "소수의 곱셈으로 캠프 식단의 열량을 구하고 알맞은 한 끼를 짤 수 있을까요?",
  summary: "음식 1그릇(1개)의 열량에 먹은 양을 곱하면 먹은 음식의 열량을 구할 수 있어요. 486×0.8=388.8처럼 (자연수)×(소수), 112.5×0.5=56.25처럼 (소수)×(소수), 58.4×3=175.2처럼 (소수)×(자연수)를 계산해 모두 더한 뒤, 한 끼 목표 열량과 견주어 식단이 알맞은지 판단해요. 어림하면 빨리 견줄 수 있어요.",
  steps: [
    { name: "만져 보기 — 도윤이의 저녁 식판", inst: "캠프 첫날 저녁이에요. 캠프 선생님은 한 끼 열량 목표를 600 킬로칼로리쯤으로 정했어요(음식의 열량은 이 이야기에서 정한 값이에요). 도윤이가 먹은 음식을 식판에 담고, 먹은 음식의 열량을 구해 보세요.", hints: ["카레라이스는 +0.1을 8번 눌러 0.8그릇을 담아요.", "카레라이스 0.8그릇의 열량은 486×0.8이에요.", "세 음식의 열량을 모두 더해요."],
      render: (b, a) => { b.append(dm4sNote("🍛 도윤이의 저녁", ["카레라이스 0.8그릇", "삶은 옥수수 0.5개", "소시지 3개"]));
        dm4Meal(b, a, { who: "저녁", want: { 0: "0.8", 1: "0.5", 2: "3" },
          asks: () => [["캠프 한 끼 목표 600 킬로칼로리와 견주면 도윤이의 저녁은", { o: ["목표에 가까워 알맞아요", "목표보다 많이 모자라요"], a: 0 }]],
          ok: "도윤이의 저녁은 388.8+56.25+175.2=620.25 (킬로칼로리)로 목표 600 킬로칼로리에 가까워요." }); } },
    { name: "그려 보기 — 서아의 아침 열량", inst: "캠프 둘째 날 아침, 서아는 참치 주먹밥 2개, 미역국 0.5그릇, 사과 0.4개를 먹었어요. 캠프 식단표를 보고 열량을 구해 보세요.", hints: ["참치 주먹밥 2개는 168.5×2예요.", "사과 0.4개는 95.5×0.4예요. 955×4=3820이에요.", "우유 1.5컵은 125×1.5예요."],
      render: (b, a) => dm4Sent(b, a, [
        { fig: () => dm4FoodTable() },
        ["참치 주먹밥 2개: 168.5×2 =", { n: "337", e: "168.5×2" }, "킬로칼로리"],
        ["미역국 0.5그릇: 64×0.5 =", { n: "32", e: "64×0.5" }, "킬로칼로리"],
        ["사과 0.4개: 95.5×0.4 =", { n: "38.2", e: "95.5×0.4", why: { "382": "곱의 소수점 아래 자리 수는 1+1=2(자리)예요. 38.20=38.2예요." } }, "킬로칼로리"],
        ["모두 더하면", { n: "407.2", e: "168.5×2+64×0.5+95.5×0.4" }, "킬로칼로리이고, 목표 600 킬로칼로리보다", { o: ["많이 모자라요", "많아요"], a: 0 }],
        ["우유 1.5컵을 더 마시면 125×1.5 =", { n: "187.5", e: "125×1.5" }, "킬로칼로리가 늘어 모두", { n: "594.7", e: "407.2+187.5" }, "킬로칼로리가 돼요."]],
      { ok: "서아의 아침은 407.2 킬로칼로리로 목표보다 많이 모자랐지만, 우유 1.5컵을 더하면 594.7 킬로칼로리로 목표에 가까워져요." }) },
    { name: "말해 보기 — 어림으로 빨리 견주기", inst: "도윤이의 저녁 열량을 정확하게 계산하지 않고 어림해 보세요. 그리고 어림이 쓸모 있는 때를 말해 보세요.", hints: ["486을 500으로 어림해요.", "58.4를 60으로 어림해요.", "112.5를 100으로 어림해요."],
      render: thenWhy((b, a) => dm4Sent(b, a, [
        ["카레라이스 486×0.8을 500×0.8로 어림하면", { n: "400", e: "500×0.8" }],
        ["소시지 58.4×3을 60×3으로 어림하면", { n: "180", e: "60×3" }],
        ["삶은 옥수수 112.5×0.5를 100×0.5로 어림하면", { n: "50", e: "100×0.5" }],
        ["도윤이의 저녁 열량은 약", { o: ["630", "400", "900"], a: 0 }, "킬로칼로리예요."]],
        { ok: "어림하면 400+180+50=630이에요. 정확한 값 620.25와 비슷해서 목표에 가까운지 빨리 알 수 있어요." }),
        { q: "식단을 짤 때 정확하게 계산하지 않고 어림해도 좋은 때는 언제일까요?", ph: "~인지만 알면 될 때 ~", help: ["① 목표보다 많은지 적은지만 알고 싶을 때를 떠올려요. → ② 어림한 값으로도 판단할 수 있는지 생각해요.", "‘~보다 많은지 적은지만 알아보면 될 때는 어림해도 돼요. 왜냐하면 ~.’ 꼴로 써요."],
          ans: "한 끼 열량이 목표 600 킬로칼로리에 가까운지, 많이 모자라거나 넘치는지만 알아보면 될 때는 어림해도 돼요. 어림한 값으로도 빨리 견줄 수 있기 때문이에요." }) },
    { name: "약속하기 — 우리 모둠 점심 식단 짜기", inst: "캠프 둘째 날 점심 식단을 짜 보세요. 음식을 두 가지 이상 담고 양을 정한 뒤, 열량의 합이 550~650 킬로칼로리가 되게 해요.", hints: ["카레라이스 1그릇(486)에 우유 1컵(125)을 더하면 611이에요.", "열량이 넘치면 양을 0.1씩 줄여 봐요.", "음식별 열량과 먹은 양을 곱한 뒤 모두 더해요."],
      render: (b, a) => dm4Meal(b, a, { who: "점심", want: null, lo: "550", hi: "650",
        ok: "열량의 합이 550~650 킬로칼로리인 점심 식단을 짰어요. 친구들 앞에서 발표해 봐요!" }) },
    { name: "확인하기 — 식단 발표하기", inst: "내가 짠 점심 식단을 친구들에게 발표하는 글을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "내가 짠 점심 식단과 열량의 합을 발표 문장으로 써요.", tag: "식단", ph: "예) 저는 카레라이스 1그릇과 우유 1컵을 골랐어요. 열량은 ~", help: ["① 고른 음식과 먹을 양을 차례로 말해요. → ② 음식마다 열량을 어떻게 구했는지, 모두 몇 킬로칼로리인지 말해요.", "‘저는 ~와 ~를 골랐어요. ~×~=~이므로 모두 ~ 킬로칼로리예요.’ 꼴로 써요."],
          ans: "저는 카레라이스 1그릇과 우유 1컵을 골랐어요. 486×1=486, 125×1=125이므로 모두 611 킬로칼로리예요. 목표 600 킬로칼로리에 가까워요." },
        { q: "식단을 짤 때 소수의 곱셈이 어떻게 쓰였나요?", ph: "음식 1그릇의 열량에 ~", help: ["① 열량을 구할 때 무엇과 무엇을 곱했는지 떠올려요. → ② 먹은 양이 소수일 때를 예로 들어요.", "‘음식 1~의 열량에 먹은 양 ~을 곱해서 ~을 구했어요.’ 꼴로 써요."],
          ans: "음식 1그릇(1개)의 열량에 먹은 양을 곱해서 먹은 음식의 열량을 구했어요. 카레라이스 0.8그릇은 486×0.8=388.8 (킬로칼로리)처럼 소수의 곱셈으로 구했어요." }]) }
  ],
  challenge: { inst: "★ 도전 — 열량을 견주어 보세요.", hints: ["112.5×0.5=56.25예요.", "95.5×0.6=57.3이에요.", "486×1.5는 486×15=7290의 [1/10]배예요."],
    render: (b, a) => dm4Sent(b, a, [
      ["삶은 옥수수 0.5개와 사과 0.6개의 열량을 견주면 112.5×0.5", { o: [">", "=", "<"], a: 2, why: { "0": "112.5×0.5=56.25, 95.5×0.6=57.3이에요." } }, "95.5×0.6"],
      ["카레라이스 1.5그릇의 열량은", { n: "729", e: "486×1.5" }, "킬로칼로리예요."]],
    { ok: "56.25 < 57.3이에요. 카레라이스 1.5그릇은 729 킬로칼로리예요." }) }
},
{
  id: "s11", no: 11, title: "캠프 마지막 밤 놀이 한마당", soop: "발표하기(P)",
  question: "소수의 곱셈을 정확하게 계산하며 놀이를 즐기고, 배운 것을 되돌아볼까요?",
  summary: "땅따먹기 놀이에서 도착한 칸의 소수의 곱셈을 정확하게 계산해야 땅을 차지할 수 있었어요. 카드 짝 맞추기에서는 곱의 소수점 위치 규칙으로 곱이 같은 식을 찾았어요. 캠프에서 비커·강낭콩·구리선·모종판·돋보기·식단으로 소수의 곱셈을 탐구했어요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알기", inst: "캠프 마지막 밤, 운동장 놀이판에서 땅따먹기 놀이를 해요. ① 두 사람이 서로 다른 색을 고르고 순서를 정해요. ② 자기 차례에 바둑돌을 출발선에 놓고 튕겨요. ③ 바둑돌이 도착한 칸의 식을 계산해요. ④ 다른 사람이 계산기로 확인해서 곱이 맞으면 땅을 색칠해요. ⑤ 한 사람에 10번씩 해요. ⑥ 칸 수와 연속 칸으로 점수를 세요.", hints: ["보너스 칸에 들어가면 계산하지 않고 색칠해요.", "웅덩이, 놀이판 밖, 이미 색칠된 땅에 들어가면 색칠하지 못해요.", "가로나 세로로 2칸 연속 2점, 3칸 연속 5점, 4칸 이상 연속 7점을 더 얻어요."],
      render: (b, a) => quiz(b, a, [
        { q: "땅을 색칠할 수 있는 경우를 모두 골라 보세요.", o: ["도착한 칸의 곱을 맞게 계산했을 때", "보너스 칸에 들어갔을 때", "웅덩이에 들어갔을 때", "놀이판 밖으로 넘어갔을 때", "이미 색칠된 땅에 들어갔을 때"], a: [0, 1] },
        { q: "가로로 3칸을 연속으로 색칠하면 추가 점수는 몇 점인가요?", o: ["2점", "5점", "7점"], a: 1 },
        { q: "놀이에서 이기려면 어떻게 해야 할까요?", o: ["소수의 곱셈을 정확하게 계산하고, 연속으로 칸을 차지하도록 바둑돌을 잘 튕겨요", "계산은 대충 하고 바둑돌을 세게만 튕겨요"], a: 0 }],
        { ok: "곱을 정확하게 계산하고, 연속으로 땅을 차지하도록 잘 튕기면 점수를 많이 얻어요." }) },
    { name: "그려 보기 — 놀이판 식 미리 계산하기", inst: "놀이판에 있는 식을 미리 계산해 보세요. 어림해서 곱의 소수점 위치가 알맞은지도 확인해요.", hints: ["3.5×2.4는 35×24=840의 [1/100]배예요.", "0.9×0.08은 9×8=72에서 소수점 아래 자리 수가 1+2=3(자리)예요.", "4.8×1.25는 48×125=6000의 [1/1000]배예요."],
      render: (b, a) => dm4Sent(b, a, [
        ["3.5×2.4 =", { n: "8.4", e: "3.5×2.4" }],
        ["0.16×5 =", { n: "0.8", e: "0.16×5" }],
        ["25×0.4 =", { n: "10", e: "25×0.4" }],
        ["0.9×0.08 =", { n: "0.072", e: "0.9×0.08", why: { "0.72": "소수점 아래 자리 수가 1+2=3(자리)예요." } }],
        ["4.8×1.25 =", { n: "6", e: "4.8×1.25" }]],
      { ok: "3.5×2.4=8.4, 0.16×5=0.8, 25×0.4=10, 0.9×0.08=0.072, 4.8×1.25=6이에요. 6.000처럼 써도 같은 수예요." }) },
    { name: "말해 보기 — 점수 세기", inst: "옆 반 친구들이 놀이를 끝낸 판이에요. 연두와 주황이 얻은 점수를 세어 보세요. 색칠한 칸마다 1점, 가로나 세로로 연속인 칸이 2칸이면 2점, 3칸이면 5점, 4칸 이상이면 7점을 더 얻어요(한 칸이 가로·세로 묶음에 함께 들어가도 돼요).", hints: ["가로줄을 하나씩 따라가며 같은 색이 이어진 칸을 세어요.", "세로줄도 하나씩 따라가며 세어요.", "추가 점수를 모두 더한 뒤 칸 수에 더해요."],
      render: (b, a) => {
        const rows = ["OOG.G", "G.GO.", "GPGO.", ".O.OO"], own = rows.join("").split("").map(c => c === "G" ? 0 : c === "O" ? 1 : null);
        const g = dm4RunScore(own, 4, 5, 0), o = dm4RunScore(own, 4, 5, 1);
        return dm4Sent(b, a, [
          { fig: () => h("div", { class: "dm4fig", style: "max-width:26em" }, dm4MiniBoard(rows)) },
          ["연두(초록): 색칠한 칸", { n: String(g.cells), s: 1 }, "칸, 추가 점수", { n: String(g.bonus), s: 1 }, "점, 모두", { n: String(g.total), s: 1 }, "점"],
          ["주황: 색칠한 칸", { n: String(o.cells), s: 1 }, "칸, 추가 점수", { n: String(o.bonus), s: 1 }, "점, 모두", { n: String(o.total), s: 1 }, "점"],
          ["이긴 사람은", { o: ["연두", "주황", "비겼어요"], a: g.total > o.total ? 0 : g.total < o.total ? 1 : 2 }]],
          { ok: `연두는 ${g.cells}+${g.bonus}=${g.total}(점), 주황은 ${o.cells}+${o.bonus}=${o.total}(점)이에요. 연속으로 차지하면 점수가 많이 올라가요.` });
      } },
    { name: "약속하기 — 땅따먹기 놀이", inst: "짝과 함께 놀이해 보세요. 출발선 위에서 바둑돌을 원하는 곳으로 옮기고, 바둑돌을 아래로 당겼다 놓으면 반대쪽으로 날아가요. 도착한 칸의 곱을 쓰면 계산기로 확인해 줘요. 두 사람이 10번씩 튕기면 놀이가 끝나요.", hints: ["바둑돌을 조금 당기면 가까이, 많이 당기면 멀리 날아가요.", "연속으로 칸을 차지할 수 있는 곳을 노려 봐요.", "곱의 소수점 위치는 어림해서 확인해요."],
      render: (b, a) => dm4Land(b, a, { turns: 10, ok: "놀이를 끝까지 했어요! 정확하게 계산해야 땅을 차지할 수 있었지요?" }) },
    { name: "확인하기 — 캠프 탐구 되돌아보기", inst: "1차시에 붙였던 ‘궁금해요’ 쪽지를 다시 보고, 캠프 탐구를 되돌아보세요.",
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "1차시에 궁금했던 것 중 하나를 골라, 이제는 어떻게 답할 수 있는지 써 봐요.", tag: "궁금증", ph: "예) 0.8×0.6의 소수점은 ~", help: ["① 위 쪽지에서 궁금했던 것을 하나 골라요(없으면 이 단원에서 궁금했던 것을 떠올려요). → ② 배운 방법으로 답을 써요.", "‘궁금했던 것: ~ → 이제는 ~라고 답할 수 있어요.’ 꼴로 써요."],
          ans: "궁금했던 것: 0.8×0.6처럼 소수끼리 곱하면 곱의 소수점은 어디에 찍을까? → 이제는 8×6=48을 계산하고 소수점 아래 자리 수가 1+1=2(자리)라서 0.48이라고 답할 수 있어요." },
        { q: "캠프에서 한 탐구 중 가장 기억에 남는 소수의 곱셈과 계산 방법을 써 봐요.", tag: "기억", ph: "예) 모종판의 넓이 0.7×0.4를 모눈으로 ~", help: ["① 비커·강낭콩·구리선·모종판·돋보기·식단 중 하나를 골라요. → ② 그때의 식과 계산 방법을 써요.", "‘~ 탐구에서 ~×~을 ~ 방법으로 계산해 ~이 나왔어요.’ 꼴로 써요."],
          ans: "모종판 탐구에서 0.7×0.4를 모눈 한 칸 0.01이 28개인 것으로 계산해 0.28 m²가 나왔어요. 1보다 작은 두 수를 곱하면 더 작아진다는 것을 알았어요." }])) }
  ],
  challenge: { inst: "★ 도전 — 또 다른 놀이: 카드 짝 맞추기예요. 곱의 소수점 위치 규칙을 알 수 있는 곱셈 카드 16장이 뒤집혀 있어요. 두 장을 뒤집어 곱이 같으면 가져가요.", hints: ["0.48×100은 소수점을 오른쪽으로 두 자리 옮긴 48이에요.", "250×0.001은 소수점을 왼쪽으로 세 자리 옮긴 0.25예요.", "뒤집었던 카드의 자리와 식을 기억해 두면 짝을 빨리 찾을 수 있어요."],
    render: (b, a) => dm4Memory(b, a, { ok: "곱의 소수점 위치 규칙으로 카드의 짝을 모두 찾았어요!" }) }
}
];
