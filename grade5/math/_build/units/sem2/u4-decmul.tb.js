//@@APP
const APP={title:"문화 예술 체험 센터 소수의 곱셈", unit:"5-2 수학 4. 소수의 곱셈(교과서)", key:"t52-decmul-v1", welcome:"문화 예술 체험 센터 소수의 곱셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 은성이네 모둠과 함께 문화 예술 체험 센터에서 주스·액자·철사·페인트·천·흙·계단으로 소수의 곱셈 원리를 알아보고 계산해 봐요."};
//@@UNIT
/* ===== 4. 소수의 곱셈 단원 조작 부품 (앞글자 dm4) =====
   수는 모두 10^12배 한 BigInt 정수로 계산해서 소수 계산 오차가 없어요(22.617과 22.6170은 같은 수).
   글 속 분수 표기: [14/10], [14×6/10] → 화면에서 위아래로 쌓은 분수로 보여 줘요. */

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
.dm4fi .dm4bar{width:100%;border-top:.13em solid currentColor}
.dm4chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.dm4chs .opt{padding:.05em .55em}
.opt.dm4on{border-color:var(--ring);background:var(--ring-soft)}
.dm4q2{font-family:Jua,sans-serif;margin-top:.55em}
.dm4grp{border:2px solid var(--line);border-radius:.8em;padding:.35em .7em;margin:.45em 0}
.dm4gt{font-family:Jua,sans-serif;color:var(--night)}
.dm4ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.dm4stage svg{width:100%;height:auto;max-height:60vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r);touch-action:none;user-select:none}
.dm4stage.dm4sm svg{max-height:42vh}
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
quiz = (b, a, items, o) => dm4Quiz0(b, dm4A(a), items, o);
blanks = (b, a, parts, o) => dm4Blanks0(b, dm4A(a), parts, o);

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
  return dm4Fig(svg);
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
/* 확인 단추(그림 조작 검사 → 줄 묶음 채점) */
function dm4Check(body, api, reg, opt, pre) {
  body.__dm4 = () => reg;   // 점검용
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const p = pre ? pre() : null;
    if (p && p.bad) return api.fail(p.bad, p.given || "-");
    const r = dm4Judge(reg, opt);
    const g = [p && p.given, r.given].filter(Boolean).join(" / ");
    if (r.bad) return api.fail(r.bad, g);
    api.tryOnce(); api.done(g, opt.ok);
  } }, "확인하기")));
}
/* ① 빈칸 줄 문제 */
function dm4Sent(body, api, rows, opt = {}) {
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
  dm4Style();
  const bars = opt.bars || 1, per = opt.per, times = opt.times, total = bars * 10, need = per * times;
  const cw = 58, x0 = 40, bh = 52, gap = 92, W = x0 * 2 + cw * 10, H = 40 + bars * gap;
  const svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  let n = 0;
  const say = h("div", { class: "dm4say" }, "​");
  const unitV = dm4P(opt.cell || "0.1");
  const draw = () => {
    g.innerHTML = "";
    for (let b = 0; b < bars; b++) {
      const y = 28 + b * gap;
      for (let k = 0; k < 10; k++) {
        const i = b * 10 + k, grp = Math.floor(i / per), on = i < n;
        g.append(svgEl("rect", { x: x0 + k * cw, y, width: cw, height: bh, fill: on ? (grp % 2 ? DM4C.b : DM4C.a) : "#fff", stroke: DM4C.dark, "stroke-width": 1.4 }));
      }
      g.append(svgEl("rect", { x: x0, y, width: cw * 10, height: bh, fill: "none", stroke: INK, "stroke-width": 2.5 }));
      const lo = dm4F(unitV * 10n * BigInt(b)), hi = dm4F(unitV * 10n * BigInt(b + 1));
      g.append(txt(x0, y + bh + 20, lo, 19), txt(x0 + cw * 10, y + bh + 20, hi, 19));
    }
    // 묶음 표시
    for (let k = 0; k < Math.floor(n / per); k++) {
      const s = k * per, e = s + per - 1;
      const sb = Math.floor(s / 10), eb = Math.floor(e / 10);
      if (sb === eb) {
        const y = 28 + sb * gap, xa = x0 + (s % 10) * cw + 4, xb = x0 + (e % 10 + 1) * cw - 4;
        g.append(svgEl("path", { d: `M${xa} ${y - 4} Q${(xa + xb) / 2} ${y - 22} ${xb} ${y - 4}`, fill: "none", stroke: DM4C.red, "stroke-width": 2 }), txt((xa + xb) / 2, y - 18, `${k + 1}`, 15, { fill: DM4C.red }));
      }
    }
    say.innerHTML = ""; say.append(`${opt.cell || "0.1"}만큼인 칸을 `, h("b", {}, String(n)), "칸 칠했어요" + (n >= per ? ` (${opt.step || dm4F(unitV * BigInt(per))}씩 ${Math.floor(n / per)}번${n % per ? `과 ${n % per}칸` : ""})` : "") + ".");
  };
  const at = pt => { for (let b = 0; b < bars; b++) { const y = 28 + b * gap; if (pt.y >= y - 6 && pt.y <= y + bh + 6) { const k = Math.floor((pt.x - x0) / cw); if (k >= 0 && k < 10) return b * 10 + k; } } return -1; };
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
  dm4Style();
  const u = dm4P(opt.unit), ones = Number(u / DM4U), tens = Number(u % DM4U / (DM4U / 10n)), hund = Number(u % (DM4U / 10n) / (DM4U / 100n));
  let k = 0, sorted = false, traded = 0;
  const W = 900, H = opt.frame ? 300 : 250, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const s = 9;  // 0.01 조각 한 변
  const say = h("div", { class: "dm4say" }, "​");
  const drawRod = (x, y, c) => { g.append(svgEl("rect", { x, y, width: s, height: s * 10, fill: c, stroke: INK, "stroke-width": 1 })); for (let i = 1; i < 10; i++) g.append(svgEl("line", { x1: x, y1: y + i * s, x2: x + s, y2: y + i * s, stroke: "#5D6E68", "stroke-width": .5 })); };
  const drawSq = (x, y, c) => g.append(svgEl("rect", { x, y, width: s, height: s, fill: c, stroke: INK, "stroke-width": 1 }));
  const drawFlat = (x, y, c) => { g.append(svgEl("rect", { x, y, width: s * 10, height: s * 10, fill: c, stroke: INK, "stroke-width": 1.2 })); for (let i = 1; i < 10; i++) g.append(svgEl("line", { x1: x + i * s, y1: y, x2: x + i * s, y2: y + s * 10, stroke: "#5D6E68", "stroke-width": .5 }), svgEl("line", { x1: x, y1: y + i * s, x2: x + s * 10, y2: y + i * s, stroke: "#5D6E68", "stroke-width": .5 })); };
  const draw = () => {
    g.innerHTML = "";
    const top = opt.frame ? 70 : 20;
    if (opt.frame) {
      // 정사각형 액자: 놓은 묶음 수만큼 변이 빨갛게
      const fx = 30, fy = 14, fs = 46;
      g.append(svgEl("rect", { x: fx, y: fy, width: fs, height: fs, fill: "#FFF7EA", stroke: "#B9C5C0", "stroke-width": 7 }));
      const sides = [[fx, fy, fx + fs, fy], [fx + fs, fy, fx + fs, fy + fs], [fx + fs, fy + fs, fx, fy + fs], [fx, fy + fs, fx, fy]];
      sides.slice(0, Math.min(k, 4)).forEach(([a, b, c, d]) => g.append(svgEl("line", { x1: a, y1: b, x2: c, y2: d, stroke: DM4C.red, "stroke-width": 7, "stroke-linecap": "round" })));
      g.append(txt(fx + fs + 110, fy + fs / 2, `한 변 ${opt.unit} m`, 18, { fill: DM4C.dark }));
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
  dm4Style();
  const sv = dm4P(opt.step), N = Number(dm4P(opt.bot) / sv), T = Number(dm4P(opt.target) / sv);
  const W = 960, H = 290, x0 = 70, len = 800, yt = 105, yb = 215, X = i => x0 + i * len / N;
  const svg = makeSvg(W, H), g = svgEl("g"), mv = svgEl("g"); svg.append(g, mv);
  g.append(txt(x0 - 40, yt - 46, opt.what || "", 19, { fill: DM4C.dark, "text-anchor": "start" }));
  g.append(svgEl("rect", { x: x0, y: yt - 30, width: len, height: 18, rx: 6, fill: "#E8EEEB", stroke: "#B9C5C0" }));
  [yt, yb].forEach(yy => g.append(svgEl("line", { x1: x0 - 8, y1: yy, x2: x0 + len + 10, y2: yy, stroke: INK, "stroke-width": 2.5 })));
  for (let i = 0; i <= N; i++) {
    g.append(svgEl("line", { x1: X(i), y1: yt - 9, x2: X(i), y2: yt + 9, stroke: INK, "stroke-width": i === 0 || i === N ? 2.2 : 1.3 }));
    g.append(svgEl("line", { x1: X(i), y1: yb - 9, x2: X(i), y2: yb + 9, stroke: INK, "stroke-width": i === 0 || i === N ? 2.2 : 1.3 }));
    const bv = dm4F(sv * BigInt(i));
    if (i === 0 || i === N || (opt.labels || []).includes(bv)) g.append(txt(X(i), yb + 32, bv, 20));
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
  dm4Style();
  const S = 330, c = S / 10, x0 = 110, y0 = 70, W = 560, H = 440;
  const svg = makeSvg(W, H), g = svgEl("g"), fg = svgEl("g"); svg.append(g, fg);
  const u = opt.unit || "m";
  g.append(svgEl("rect", { x: x0, y: y0, width: S, height: S, fill: "#fff" }));
  for (let k = 1; k < 10; k++) g.append(svgEl("line", { x1: x0 + k * c, y1: y0, x2: x0 + k * c, y2: y0 + S, stroke: "#9AABA4", "stroke-width": 1 }), svgEl("line", { x1: x0, y1: y0 + k * c, x2: x0 + S, y2: y0 + k * c, stroke: "#9AABA4", "stroke-width": 1 }));
  g.append(txt(x0 + S / 2, y0 - 46, `1 ${u}`, 20, { fill: DM4C.dark }), txt(x0 - 74, y0 + S / 2, `1 ${u}`, 20, { fill: DM4C.dark }));
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
  const C = Math.max(ca.length, cb.length + 1, need) + (pr.extra || 0);
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
  return { el, judge, ans: `${A} × ${B} = ${dm4F(val)}` };
}
function dm4Vert(body, api, opt) {
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
  });
}

/* ===== ⑧ 자연수의 곱에 소수점 찍기 =====
   opt: {items:[{e:"5.7×3.9", digits?}], intro, asks} */
function dm4Point(body, api, opt) {
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
    const row = h("div", { class: "dm4row" }, h("span", {}, it.e.replace("×", " × ") + " ="), strip, res);
    const judge = () => {
      if (p < 0) return { bad: `${it.e.replace("×", " × ")}: 소수점을 찍을 곳의 빨간 동그라미를 눌러요.`, given: "-" };
      const s = cells.slice(0, p + 1).map(c => c.d).join("") + "." + cells.slice(p + 1).map(c => c.d).join(""), got = dm4P(s);
      if (got === val) return { given: dm4F(got) };
      return { bad: `${it.e.replace("×", " × ")}: ` + (dm4Diag(it.e, got) || `곱의 소수점 아래 자리 수는 ${D}자리예요.`), given: dm4F(got) };
    };
    return { row, judge, ans: `${it.e.replace("×", " × ")} = ${dm4F(val)}` };
  });
  if (opt.intro) body.append(opt.intro());
  body.append(h("div", { class: "dm4say" }, opt.tip || "숫자 오른쪽 아래의 빨간 동그라미를 눌러 곱의 소수점을 찍어요. 흐린 0은 소수점 앞에 0이 필요할 때 쓰는 자리예요."), ...rows.map(r => r.row));
  if (opt.asks) body.append(h("div", { class: "dm4ask" }, dm4Rows(opt.asks, reg)));
  api.provide({ words: opt.words || ["소수점 아래 자리 수", "더한 만큼"], answers: rows.map(r => r.ans).concat(reg.plain) });
  dm4Check(body, api, reg, opt, () => { const rs = rows.map(r => r.judge()), bad = rs.find(r => r.bad); return { bad: bad && bad.bad, given: rs.map(r => r.given).join(", ") }; });
}

/* ===== ⑨ 곱하는 수에 따라 곱의 소수점 옮기기 =====
   opt: {sets:[{name:"가", start:"0.15", fs:["1","10","100","1000"]}], asks} — 숫자는 그대로, 빨간 소수점이 움직여요. */
function dm4Shift(body, api, opt) {
  dm4Style();
  const reg = dm4Reg(), sets = [];
  opt.sets.forEach(S => {
    const s = dm4Norm(S.start), [ip, fp = ""] = s.split(".");
    const digs = []; [...ip].forEach((d, k) => digs.push({ d, e: ip.length - 1 - k })); [...fp].forEach((d, k) => digs.push({ d, e: -1 - k }));
    const EH = 3, EL = -4, cols = EH - EL + 1, cw = 70, x0 = 30, W = x0 * 2 + cols * cw, H = 200;
    const cx = e => x0 + (EH - e) * cw + cw / 2;
    const svg = makeSvg(W, H), bg = svgEl("g"), fg = svgEl("g"), pg = svgEl("g"); svg.append(bg, fg, pg);
    const NM = ["천", "백", "십", "일", "소수\n첫째", "소수\n둘째", "소수\n셋째", "소수\n넷째"];
    for (let e = EH; e >= EL; e--) {
      bg.append(svgEl("rect", { x: cx(e) - cw / 2, y: 62, width: cw, height: 100, fill: e >= 0 ? "#F4F7F5" : "#FFF7EA", stroke: DM4C.line, "stroke-width": 2 }));
      NM[EH - e].split("\n").forEach((t, j, arr) => bg.append(txt(cx(e), 26 + j * 20 - (arr.length - 1) * 6, t, 16, { fill: DM4C.dark })));
    }
    const dot = svgEl("circle", { cx: 0, cy: 146, r: 8, fill: DM4C.red });
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
        fg.append(txt(cx(e), 118, ch, 46, { fill: grey ? "#B9C5C0" : INK }));
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
  body.append(h("div", { class: "dm4say" }, opt.tip || "수 카드를 골라 빈칸에 놓아 곱셈식을 만들어요."), pool, row, say, more);
  api.provide({ words: opt.words || [], answers: [`${best.e.replace("×", " × ")} = ${dm4F(best.v)}`] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (!made) return api.fail(slots.every(x => x != null) ? `곱이 ${opt.goal === "max" ? "가장 큰" : "가장 작은"} 식이 아니에요. 큰 수(작은 수)를 어느 자리에 놓아야 할지 생각해 봐요.` : "빈칸을 모두 채워 식을 만들어요.", slots.map(i => i == null ? "□" : opt.cards[i]).join(""));
    const r = dm4Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, made + " / " + r.given);
    api.tryOnce(); api.done(made + " / " + r.given, opt.ok);
  } }, "확인하기")));
}

/* ===== ⑪ 단원 도입: 기린 쌓기 ===== opt: {asks} */
function dm4Stack(body, api, opt) {
  dm4Style();
  const W = 900, H = 520, svg = makeSvg(W, H), g = svgEl("g"), fg = svgEl("g"); svg.append(g, fg);
  const base = 490, unit = 20;   // 기린 1마리 = 20 (5.2 m), 나무 = 22마리
  // 나무
  const tx = 640;
  g.append(svgEl("rect", { x: tx - 16, y: base - 22 * unit, width: 32, height: 22 * unit, fill: "#A8774E" }));
  for (let k = 0; k < 9; k++) g.append(svgEl("ellipse", { cx: tx + (k % 2 ? 34 : -34), cy: base - 22 * unit + 30 + k * 44, rx: 48, ry: 22, fill: k % 3 ? "#5E9B54" : "#4E8746" }));
  g.append(svgEl("ellipse", { cx: tx, cy: base - 22 * unit + 6, rx: 34, ry: 18, fill: "#4E8746" }));
  g.append(svgEl("line", { x1: 40, y1: base, x2: 860, y2: base, stroke: "#8BA97A", "stroke-width": 4 }));
  g.append(svgEl("line", { x1: 300, y1: base - 22 * unit, x2: tx - 60, y2: base - 22 * unit, stroke: DM4C.red, "stroke-width": 2, "stroke-dasharray": "7 5" }), txt(740, base - 22 * unit - 4, "나무 꼭대기", 18, { fill: DM4C.red, "text-anchor": "start" }));
  let n = 1;
  const say = h("div", { class: "dm4say" }, "​");
  const draw = () => {
    fg.innerHTML = "";
    const gx = 330;
    for (let k = 0; k < n; k++) {
      const y = base - (k + 1) * unit;
      fg.append(svgEl("rect", { x: gx - 22, y: y + 1, width: 44, height: unit - 2, rx: 5, fill: "#F2C35A", stroke: "#B5832C", "stroke-width": 1.2 }));
      [[-12, 6], [2, 11], [13, 5]].forEach(([dx, dy]) => fg.append(svgEl("circle", { cx: gx + dx, cy: y + dy, r: 3.2, fill: "#B5832C" })));
      if ((k + 1) % 5 === 0 || k === n - 1) fg.append(txt(gx - 60, y + unit / 2, `${k + 1}`, 16, { fill: DM4C.dark }));
    }
    // 맨 위 기린 머리
    const yt = base - n * unit;
    fg.append(svgEl("rect", { x: gx + 12, y: yt - 16, width: 9, height: 18, fill: "#F2C35A", stroke: "#B5832C" }), svgEl("ellipse", { cx: gx + 22, cy: yt - 18, rx: 11, ry: 6, fill: "#F2C35A", stroke: "#B5832C" }));
    fg.append(svgEl("rect", { x: 140, y: base - 1 * unit, width: 26, height: unit, fill: "#F2C35A", stroke: "#B5832C" }), txt(153, base - unit - 14, "5.2 m", 16, { fill: DM4C.dark }));
    say.innerHTML = ""; say.append("쌓은 기린: ", h("b", {}, `${n}마리`), n === 22 ? " — 나무 꼭대기에 닿았어요!" : n > 22 ? " — 나무보다 높아졌어요." : "");
  };
  const tools = h("div", { class: "dm4tools" },
    h("button", { onclick: () => { n = Math.max(1, n - 1); draw(); } }, "한 마리 내리기"), h("button", { onclick: () => { n = Math.min(24, n + 1); draw(); } }, "한 마리 더 쌓기"), h("button", { onclick: () => { n = Math.min(24, n + 5); draw(); } }, "다섯 마리 더 쌓기"));
  dragOn(svg, pt => { if (pt.x < 250 || pt.x > 420) return false; n = Math.max(1, Math.min(24, Math.round((base - pt.y) / unit))); draw(); }, pt => { n = Math.max(1, Math.min(24, Math.round((base - pt.y) / unit))); draw(); });
  draw();
  const reg = dm4Reg();
  const asks = h("div", { class: "dm4ask" }, dm4Rows(opt.asks, reg));
  body.append(h("div", { class: "dm4say" }, "기린 그림을 위아래로 끌거나 단추를 눌러 기린을 나무 꼭대기까지 쌓아 보세요."), h("div", { class: "dm4stage" }, svg), say, tools, asks);
  api.provide({ words: ["5.2 m", "22마리", "어림"], answers: ["기린 22마리"].concat(reg.plain) });
  dm4Check(body, api, reg, opt, () => n !== 22 ? { bad: "기린을 나무 꼭대기(빨간 점선)까지 딱 맞게 쌓아요.", given: `${n}마리` } : { given: "22마리" });
}

/* ===== ⑫ 식판 담기와 열량 구하기 (9차시) =====
   opt: {who:"점심", want:{0:"0.5",…} | null(마음대로), lo, hi, asks(after) } */
const DM4FOOD = [
  { n: "소고기볶음밥", u: "그릇", k: "352" }, { n: "단팥도넛", u: "개", k: "142.5" }, { n: "우유", u: "컵", k: "67" },
  { n: "참치김밥", u: "줄", k: "435" }, { n: "꿀떡", u: "개", k: "45.6" }, { n: "해물된장국", u: "그릇", k: "56" }];
function dm4FoodTable() {
  return h("div", { style: "overflow-x:auto" }, h("table", { class: "dm4tbl" }, h("tr", {}, h("th", {}, "음식"), h("th", {}, "열량(킬로칼로리)")),
    DM4FOOD.map(f => h("tr", {}, h("td", {}, `${f.n} 1${f.u}`), h("td", {}, f.k)))));
}
function dm4KcalBar(total, goal = "600") {
  const W = 900, H = 150, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  const max = 800, X = v => 40 + v / max * 800, tv = Number(dm4F(total)), gv = Number(goal);
  g.append(svgEl("rect", { x: 40, y: 40, width: X(tv) - 40, height: 40, rx: 8, fill: DM4C.a }), txt(X(tv) / 2 + 20, 60, `${dm4F(total)} 킬로칼로리`, 20));
  g.append(svgEl("line", { x1: X(gv), y1: 22, x2: X(gv), y2: 100, stroke: DM4C.red, "stroke-width": 3, "stroke-dasharray": "7 5" }), txt(X(gv), 118, `적절한 한 끼 ${goal} 킬로칼로리`, 18, { fill: DM4C.red }));
  for (let v = 0; v <= 800; v += 100) g.append(txt(X(v), 140, String(v), 13, { fill: DM4C.dark }));
  return dm4Fig(svg);
}
function dm4Meal(body, api, opt) {
  dm4Style();
  const tray = new Map(); // 음식 번호 → 양(BigInt)
  const trayBox = h("div", { class: "dm4tray" });
  const menu = h("div", { class: "dm4menu" }, DM4FOOD.map((f, i) => h("button", { class: "opt", onclick: () => { if (locked) return; if (!tray.has(i)) tray.set(i, 0n); paint(); } }, f.n, h("small", {}, `1${f.u} ${f.k} 킬로칼로리`))));
  let locked = false, reg = dm4Reg();
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
      const wrong = keys.find(k => tray.get(k) !== dm4P(opt.want[k]));
      const extra = items.find(([k]) => !keys.includes(k));
      if (extra) return api.fail(`${DM4FOOD[extra[0]].n}${dm4J(DM4FOOD[extra[0]].n, "은는").slice(-1)} ${opt.who}에 먹지 않았어요. 빼요.`, "식판");
      if (wrong != null) return api.fail(`${DM4FOOD[wrong].n}의 양을 다시 살펴봐요. 대화에 나온 양만큼 담아요.`, "식판");
    } else if (items.length < 2) return api.fail("음식을 두 가지 이상 담고 양을 정해요.", "식판");
    locked = true; lockBtn.classList.add("hidden");
    const rows = items.map(([i, v]) => { const f = DM4FOOD[i], e = `${f.k}×${dm4F(v)}`; return [`${f.n} ${dm4F(v)}${f.u}: ${f.k} × ${dm4F(v)} =`, { n: dm4V(e), e }, "킬로칼로리"]; });
    const tot = items.reduce((s, [i, v]) => s + dm4M(DM4FOOD[i].k, dm4F(v)), 0n);
    rows.push(["모두 더하면", { n: dm4F(tot), e: items.map(([i, v]) => `${DM4FOOD[i].k}×${dm4F(v)}`).join("+") }, "킬로칼로리"]);
    work.append(h("div", { class: "dm4say" }, "음식별 열량과 먹은 양을 곱해 보세요. 복잡한 계산은 세로셈이나 계산기로 해도 돼요."), dm4Rows(rows.concat(opt.asks ? opt.asks(tot) : []), reg));
    work.classList.remove("hidden");
    api.provide({ words: ["열량", "먹은 양", "곱해요"], answers: reg.plain });
    work._tot = tot;
  } }, "식판에 다 담았어요");
  body.append(h("div", { class: "dm4say" }, opt.tip || `${opt.who}에 먹은 음식을 식판에 담고, +·− 단추로 먹은 양을 맞추어 보세요.`), menu, h("div", { class: "dm4gt" }, `${opt.who} 식판`), trayBox, h("div", { class: "actions" }, lockBtn), work, barBox);
  api.provide({ words: ["열량", "먹은 양"], answers: opt.want ? Object.keys(opt.want).map(k => `${DM4FOOD[k].n} ${opt.want[k]}${DM4FOOD[k].u}`) : [] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (!locked) return api.fail("먼저 식판에 음식을 담고 ‘식판에 다 담았어요’를 눌러요.", "-");
    const r = dm4Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, r.given);
    if (opt.lo && (work._tot < dm4P(opt.lo) || work._tot > dm4P(opt.hi))) return api.fail(`열량의 합이 ${dm4F(work._tot)} 킬로칼로리예요. ${opt.lo}~${opt.hi} 킬로칼로리가 되게 식판을 다시 짜 봐요. (‘처음부터’는 계단을 다시 열어요)`, r.given);
    barBox.innerHTML = ""; barBox.append(dm4KcalBar(work._tot));
    api.tryOnce(); api.done(r.given, opt.ok);
  } }, "확인하기")));
}

/* ===== ⑬ 땅따먹기 놀이판 (10차시) =====
   ❓ 교과서 놀이판(준비물 9)의 식 목록이 지도서에 없어 새로 만든 6×6 판: 연못 2칸, 보너스 2칸, 식 32칸(4.5×2.7 포함). 모든 곱은 코드가 계산해요. */
const DM4BOARD = [
  "4.5×2.7", "0.3×4", "1.6×5", "P", "0.12×6", "3.14×2",
  "6×0.7", "8×1.5", "12×0.25", "5×0.36", "B", "0.8×0.9",
  "1.2×1.5", "2.4×0.5", "0.25×0.4", "3.5×2.2", "0.15×0.6", "7.2×3",
  "2.05×4", "B", "9×0.8", "25×0.12", "1.8×2.5", "0.6×0.07",
  "4×3.25", "0.48×5", "P", "11×1.1", "0.9×0.9", "6.4×0.5",
  "3.6×1.25", "15×0.6", "2.3×4.1", "0.75×8", "1.05×0.3", "2.5×0.4"];
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
    if (ch === "P") g.append(txt(10 + c * s + s / 2, 10 + r * s + s / 2, "연못", 17, { fill: "#2D5F80" }));
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
      g.append(txt(x + cs / 2, y + cs / 2, t === "P" ? "연못" : t === "B" ? "보너스" : t.replace("×", "×"), t.length > 7 ? 15 : 17, { fill: t === "P" ? "#2D5F80" : INK }));
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
  };
  const land = (x, y) => {
    const c = Math.floor((x - bx) / cs), r = Math.floor((y - by) / cs);
    count[turn % 2]++;
    if (c < 0 || c >= C || r < 0 || r >= R) { say.textContent = "놀이판 밖으로 나갔어요. 색칠하지 못해요."; return later(); }
    const i = r * C + c, t = DM4BOARD[i];
    if (owner[i] != null) { say.textContent = "이미 색칠된 땅이에요. 색칠하지 못해요."; return later(); }
    if (t === "P") { say.textContent = "연못에 빠졌어요. 색칠하지 못해요."; return later(); }
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
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (!finished) return api.fail(`놀이를 끝까지 해요. 두 사람이 ${TURNS}번씩 튕기면 끝나요.`, `${count[0] + count[1]}번`);
    const s0 = dm4RunScore(owner, R, C, 0), s1 = dm4RunScore(owner, R, C, 1);
    api.tryOnce(); api.done(`연두 ${s0.total}점, 주황 ${s1.total}점`, opt.ok);
  } }, "놀이 끝 확인하기")));
}

/* ===== ⑭ 카드 짝 맞추기 (또 다른 놀이) ===== 계산 결과가 같은 카드 두 장을 찾아요. */
const DM4MEM = [["357×0.1", "3570×0.01"], ["357×0.001", "3.57×0.1"], ["3.57×100", "35.7×10"], ["0.24×100", "2.4×10"],
  ["2.4×0.1", "0.024×10"], ["0.45×10", "450×0.01"], ["1.6×1000", "16×100"], ["0.16×0.1", "1.6×0.01"]];
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
        if (got === DM4MEM.length) say.textContent = `카드를 모두 가져왔어요! 카드를 ${flips}번 뒤집었어요.`;
      } else {
        busy = true; say.textContent = `${x.e.replace("×", " × ")} = ${dm4V(x.e)}, ${y.e.replace("×", " × ")} = ${dm4V(y.e)} — 곱이 달라요.`;
        setTimeout(() => { up.forEach(j => { btns[j].classList.remove("dm4up"); btns[j].textContent = "?"; }); up = []; busy = false; }, 1500);
      }
    }
  } }, "?"));
  body.__dm4mem = cards;
  body.append(h("div", { class: "dm4say" }, "카드 두 장을 뒤집어 곱이 같으면 가져가요. 다르면 다시 뒤집어 놓아요."), h("div", { class: "dm4mem" }, btns), say, list);
  api.provide({ words: ["곱의 소수점 위치", "오른쪽으로", "왼쪽으로"], answers: DM4MEM.map(([a, b]) => `${a} = ${b} = ${dm4V(a)}`) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (got < DM4MEM.length) return api.fail(`아직 짝을 다 찾지 않았어요. (${got}/${DM4MEM.length}쌍)`, `${got}쌍`);
    api.tryOnce(); api.done(`카드 ${flips}번 뒤집어 8쌍`, opt && opt.ok);
  } }, "확인하기")));
}
//@@LESSONS
const UNIT_STORY = { title: "문화 예술 체험 센터에서 만난 소수의 곱셈", lines: [
  "마을 폐교 활용 아이디어 공모전에 은성이네 모둠이 제안한 ‘문화 예술 체험 센터’가 뽑혔어요. 개관하는 날 은성이네 모둠이 특별 초대를 받았어요.",
  "입구에서 받은 당근 주스, 기념품 액자, 철사 안경, 벽화 페인트, 염색할 천, 도자기 흙, 센터 계단의 열량으로 소수의 곱셈 원리를 알아봐요.",
  "교과서 「수학 5-2」 4. 소수의 곱셈의 차시 순서 그대로 만들었어요."],
  one: "소수의 곱셈 · 은성이와 함께 문화 예술 체험 센터에서 (소수)×(자연수), (자연수)×(소수), (소수)×(소수)를 계산하고 곱의 소수점 위치 규칙을 찾아요." };
const UNIT_KEYWORDS = ["소수의 곱셈", "(소수)×(자연수)", "(자연수)×(소수)", "(소수)×(소수)", "분수의 곱셈", "자연수의 곱셈", "[1/10]배", "[1/100]배", "[1/1000]배", "소수점 아래 자리 수", "곱의 소수점 위치", "어림셈", "이중 수직선", "모눈"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 문화 예술 체험 센터에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 소수의 곱셈이 필요한 상황은 어떤 것이 있을까요?",
  summary: "세계에서 키가 가장 큰 나무는 키가 약 5.2 m인 기린 22마리를 쌓아 올린 만큼이라고 해요. 나무의 키를 구하려면 5.2×22처럼 소수의 곱셈이 필요해요. 이 단원에서는 (소수)×(자연수), (자연수)×(소수), (소수)×(소수)를 계산하고, 곱의 소수점 위치가 달라지는 규칙을 알아봐요.",
  steps: [
    { name: "가장 큰 나무", inst: "“살아 있는 나무 중 세계에서 키가 가장 큰 나무는 키가 기린 22마리를 쌓아 올린 만큼이나 된대. 기린의 키가 약 5.2 m이니까 이 나무의 키는 약 몇 m일까?” 기린을 나무 꼭대기까지 쌓아 보고 물음에 답해 보세요.", hints: ["빨간 점선이 나무 꼭대기예요. 기린을 22마리 쌓아요.", "같은 수를 여러 번 더할 때는 곱셈으로 나타낼 수 있어요.", "5.2를 5로 어림하면 5×22를 계산하면 돼요."],
      render: (b, a) => dm4Stack(b, a, { asks: [
        ["나무의 키는 기린의 키 5.2 m를", { n: "22", s: 1 }, "번 더한 것과 같아요."],
        ["나무의 키를 구하는 곱셈식은", { o: ["5.2×22", "5.2+22", "22−5.2"], a: 0 }, "이에요."],
        ["5.2를 5로 어림하면 5×22 =", { n: "110", e: "5×22" }, "이므로 나무의 키는", { o: ["110 m보다 조금 커요", "110 m보다 조금 작아요"], a: 0, why: { "1": "기린의 키 5.2 m는 5 m보다 커요. 그러면 곱도 110보다 커요." } }, "."]],
        ok: "나무의 키는 5.2×22로 구할 수 있어요. 5×22=110이니 110 m보다 조금 커요. 5.2×22를 정확하게 계산하는 방법은 이 단원에서 배워요." }) },
    { name: "배울 내용 살펴보기", inst: "“소수의 곱셈은 어떻게 계산하면 될까요?” 이 단원에서 배울 내용 스티커를 배우는 차례대로 눌러 학습 계획을 세워 보세요.", hints: ["먼저 소수에 자연수를 곱하고, 다음에는 자연수에 소수를 곱해요.", "소수끼리의 곱셈을 배운 뒤 곱의 소수점 위치가 달라지는 규칙을 알아봐요."],
      render: (b, a) => sequence(b, a, ["㉠ 곱의 소수점 위치 알아보기", "㉡ (소수)×(소수) 알아보기", "㉢ (소수)×(자연수) 알아보기", "㉣ (자연수)×(소수) 알아보기"], [2, 3, 1, 0],
        { ok: "(소수)×(자연수) → (자연수)×(소수) → (소수)×(소수) → 곱의 소수점 위치 차례로 배워요." }) },
    { name: "배운 내용 떠올리기", inst: "곰곰! 3학년과 4학년 때 배운 분수와 소수, 소수의 덧셈, 그리고 이번 학기에 배운 분수의 곱셈을 떠올려 보세요.", hints: ["0.1이 10개이면 1이에요.", "소수를 10배 하면 소수점을 기준으로 수가 왼쪽으로 한 자리씩 이동해요.", "(분수)×(자연수)는 분모는 그대로 두고 분자와 자연수를 곱해요."],
      render: (b, a) => dm4Sent(b, a, [
        ["[7/10]을 소수로 나타내면", { n: "0.7", why: { "7": "[7/10]은 0.1이 7개인 수예요." } }, "이에요."],
        ["0.1이 12개인 수는", { n: "1.2", why: { "0.12": "0.1이 10개이면 1이에요. 0.1이 12개이면 1과 0.2예요.", "12": "0.1이 12개인 수예요." } }, "이에요."],
        ["0.3+0.3+0.3 =", { n: "0.9", e: "0.3+0.3+0.3" }],
        ["1.4의 10배는", { n: "14" }, "이고, 14의 [1/10]은", { n: "1.4" }, "이에요."],
        ["[2/5]×3 = [2×3/5] =", { f: ["6", "5"], why: { "6/15": "분모는 그대로 두고 분자와 자연수를 곱해요." } }]],
        { ok: "분수와 소수, 소수의 덧셈, 소수 사이의 관계, 분수의 곱셈을 잘 기억하고 있어요!" }) },
    { name: "체험 센터 이야기", inst: "“폐교 활용 아이디어 공모전에 아이디어를 제안하면 어떨까? 문화와 예술이 숨 쉬는 문화 예술 체험 센터는 어때?” 은성이네 모둠이 제안한 문화 예술 체험 센터가 뽑혔고, 개관하는 날 특별 초대를 받았어요. 그림 속 상황을 살펴보세요.", hints: ["주스를 한 명당 0.3 L씩 4명에게 나누어 주면 0.3을 4번 더한 것과 같아요.", "길이·넓이·들이처럼 재어서 나타내는 양을 여러 번 더하거나 몇 배 할 때 소수의 곱셈이 쓰여요."],
      render: (b, a) => quiz(b, a, [
        { fig: () => dm4Talk([["은성:", "우리의 아이디어로 폐교가 새로운 공간이 되었어!"], ["안내 선생님:", "입구에서 주스를 한 명당 0.3 L씩 나누어 줄게요. 기념품으로 액자도 받아 가세요."]]), q: "은성이네 모둠 4명이 받은 주스의 양을 구하는 식은 무엇일까요?", o: ["0.3×4", "0.3+4", "4−0.3"], a: 0, why: { "1": "0.3 L씩 4명이 받았으니 0.3을 4번 더해요." } },
        { q: "우리 주변에서 소수의 곱셈을 이용하는 상황을 모두 골라 보세요.", o: ["한 병에 1.5 L인 주스 3병의 양 알아보기", "가로 23.77 m, 세로 10.97 m인 테니스장의 넓이 알아보기", "우리 반 학생 수 세기", "가로 2.5 m, 세로 1.2 m인 돗자리의 넓이 알아보기"], a: [0, 1, 3] }],
        { ok: "주스 여러 병의 양, 직사각형의 넓이처럼 소수의 곱셈이 필요한 상황이 많아요." }) },
    { name: "말해 보기", inst: "문화 예술 체험 센터 이야기를 듣고, 내 경험과 관련지어 소수의 곱셈이 필요한 상황을 이야기해 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "체험 센터에서 해 보고 싶은 체험은 무엇인가요?", tag: "체험", ph: "예) 도자기 공방에서 그릇을 만들어 보고 싶어요." },
        { q: "주변에서 소수의 곱셈을 이용하는 상황을 하나 써 보세요.", tag: "상황", ph: "예) 한 개에 1.5 kg인 수박 3통의 무게를 알아볼 때" }]) }
  ],
  challenge: { inst: "마트에서 물건을 사요. 같은 수를 여러 번 더해서 모두 얼마인지 구해 보세요.", hints: ["1.2+1.2=2.4, 2.4+1.2=3.6, 3.6+1.2=4.8처럼 차례로 더해요.", "1.5를 3번 더해요.", "2.5를 5번 더해요. 2.5+2.5=5예요."],
    render: (b, a) => dm4Sent(b, a, [
      ["한 바구니에 1.2 kg인 딸기 4바구니: 1.2+1.2+1.2+1.2 =", { n: "4.8", e: "1.2+1.2+1.2+1.2" }, "kg"],
      ["한 병에 1.5 L인 주스 3병: 1.5+1.5+1.5 =", { n: "4.5", e: "1.5×3" }, "L"],
      ["한 봉지에 2.5 kg인 설탕 5봉지:", { n: "12.5", e: "2.5×5" }, "kg"],
      ["같은 수를 여러 번 더하는 것은", { o: ["곱셈", "뺄셈"], a: 0 }, "으로 나타낼 수 있어요."]],
      { ok: "1.2×4=4.8, 1.5×3=4.5, 2.5×5=12.5예요. 같은 수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요." }) }
},
{
  id: "t2", no: 2, title: "(소수)×(자연수)를 알아볼까요(1) ― 소수 한 자리 수인 경우", soop: "개념 구축하기(O)",
  question: "(소수 한 자리 수)×(자연수)는 어떻게 계산할까요?",
  summary: "0.3×4는 0.3을 4번 더한 것과 같고, 0.1이 3×4=12(개)이므로 1.2예요. 1.4×6=[14/10]×6=[14×6/10]=[84/10]=8.4처럼 분수의 곱셈으로 나타내어 계산하거나, 14×6=84를 이용해 84의 [1/10]배인 8.4로 계산해요. 곱해지는 수가 [1/10]배가 되면 곱도 [1/10]배가 돼요.",
  steps: [
    { inst: "“체험 센터 입구에서 주스를 한 명당 0.3 L씩 나누어 주었습니다.” 은성이네 마을의 자랑인 당근으로 만든 주스예요. 은성이네 모둠 4명이 받은 주스는 모두 몇 L인지 알아보려고 해요. 한 칸이 0.1인 막대에 0.3씩 4번 색칠해 보세요.", hints: ["0.3은 0.1이 3개예요. 한 사람 몫으로 3칸씩 칠해요.", "4명이니까 3칸씩 4번, 모두 12칸을 칠해요.", "0.1이 10개이면 1이에요."],
      render: (b, a) => dm4Bars(b, a, { per: 3, times: 4, bars: 2, cell: "0.1", step: "0.3",
        asks: [
          ["4명이 받은 주스의 양을 구하는 식은", { o: ["0.3+0.3+0.3+0.3", "0.3×4", "두 식 모두 돼요"], a: 2 }],
          ["0.3×4는 0.3을 4번 더한 것과 같아요. 0.3+0.3+0.3+0.3 =", { n: "1.2", e: "0.3×4" }],
          ["0.3은 0.1이 3개이므로 0.3×4는 0.1이 3×4 =", { n: "12", s: 1 }, "(개)예요."],
          ["0.3×4 = 0.1×", { n: "12", s: 1 }, "=", { n: "1.2", why: { "0.12": "0.1이 12개인 수예요. 0.1이 10개이면 1이에요.", "12": "0.1이 12개인 수를 소수로 써요." } }],
          ["4명이 받은 주스는 모두", { n: "1.2" }, "L예요."]],
        ok: "0.3을 4번 더하면 1.2예요. 0.1이 12개이니 0.3×4=1.2, 4명이 받은 주스는 1.2 L예요." }) },
    { inst: "1.4×6을 계산하는 방법을 알아봐요. 먼저 어림해 보고, 분수의 곱셈과 자연수의 곱셈으로 계산해 보세요.", hints: ["1.4는 [14/10]이에요. 분모는 그대로 두고 분자와 자연수를 곱해요.", "14×6=84예요. 1.4는 14의 [1/10]배이니 곱도 [1/10]배가 돼요.", "[84/10]은 0.1이 84개인 수예요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["1.4를 1.5로 보면 1.5×6은 1.5+1.5=3이 3번이므로 약", { n: "9", e: "1.5×6" }, "이에요."]] },
        { g: "방법 ① 분수의 곱셈으로 나타내어 계산하기", rows: [["1.4×6 =", { f: ["14", "10"], why: { "14/100": "1.4는 소수 한 자리 수예요. 분모가 10인 분수로 나타내요." } }, "×6 = [14×6/10] =", { f: ["84", "10"] }, "=", { n: "8.4", e: "1.4×6" }]] },
        { g: "방법 ② 자연수의 곱셈을 이용하여 계산하기", rows: [
          { fig: () => dm4RelFig([["14", "6", "84"], ["1.4", "6", "8.4"]], { a: "1/10", p: "1/10" }) },
          ["14×6 =", { n: "84", e: "14×6" }],
          ["1.4는 14의", { o: ["10배", "[1/10]배", "[1/100]배"], a: 1 }, "이므로 1.4×6은 84의 [1/10]배인", { n: "8.4", e: "1.4×6", why: { "84": "1.4는 14의 [1/10]배이니 곱도 [1/10]배를 해요." } }, "이에요."]] },
        ["어림한 9와 계산한 8.4는", { o: ["비슷해요", "많이 달라요"], a: 0 }]],
        { ok: "1.4×6=8.4예요. 어림한 9와 비슷해요. 분수의 곱셈으로도, 자연수의 곱셈으로도 계산할 수 있어요." }) },
    { inst: "2.6×3을 두 가지 방법으로 계산해 보고, 계산 방법을 친구에게 말해 보세요.", hints: ["방법 ①: 2.6=[26/10]이에요.", "방법 ②: 26×3=78이고, 2.6은 26의 [1/10]배예요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "방법 ①", rows: [["2.6×3 =", { f: ["26", "10"] }, "×3 = [26×3/10] =", { f: ["78", "10"] }, "=", { n: "7.8", e: "2.6×3" }]] },
        { g: "방법 ②", rows: [["26×3 =", { n: "78", e: "26×3" }, "→ 2.6×3 =", { n: "7.8", e: "2.6×3" }]] },
        ["곱해지는 수가 [1/10]배가 되면 곱도", { o: ["10배", "[1/10]배", "그대로"], a: 1 }, "가 돼요."],
        ["0.4×5 = 2.0이에요. 2.0과 2는", { o: ["같은 수예요", "다른 수예요"], a: 0, why: { "1": "소수의 끝자리 0은 생략할 수 있어요. 2.0=2예요." } }]],
        { ok: "2.6×3=7.8이에요. 곱해지는 수가 [1/10]배가 되면 곱도 [1/10]배가 돼요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["1.4×6=[14/10]×6처럼 분수로 바꾸었어요.", "14×6=84를 이용했어요."],
      render: (b, a) => blanks(b, a, ["(소수)×(자연수)는 ", { o: ["분수의 곱셈", "분수의 덧셈"], a: 0 }, "으로 나타내어 계산하거나 ", { o: ["자연수의 곱셈", "소수의 뺄셈"], a: 0 }, "을 이용하여 계산해요. 곱해지는 수가 [1/10]배가 되면 곱도 ", { o: ["10배", "[1/10]배"], a: 1 }, "가 돼요."]) },
    { inst: "계산해 보세요. 세로셈은 자연수의 곱셈처럼 계산한 뒤 곱의 소수점을 찍어요.", hints: ["1.7×4는 17×4=68의 [1/10]배예요.", "5.2×6은 52×6=312의 [1/10]배예요.", "곱해지는 수의 소수점 아래 자리 수가 1자리이니 곱도 소수 한 자리 수예요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "1.7", b: "4" }, { a: "5.2", b: "6" }],
        rows: [["0.9×3 =", { f: ["9", "10"] }, "×3 =", { f: ["27", "10"] }, "=", { n: "2.7", e: "0.9×3" }]],
        ok: "1.7×4=6.8, 5.2×6=31.2, 0.9×3=2.7이에요. 자연수처럼 곱하고 소수점을 찍었어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 수직선에서 0.3씩 6번 뛰어 세어 0.3×6을 구하고, 물음에 답해 보세요.", hints: ["0.3은 작은 눈금 3칸이에요.", "23×4=92이고, 2.3은 23의 [1/10]배예요.", "정육각형은 여섯 변의 길이가 모두 같아요."],
    render: (b, a) => dm4Jump(b, a, { to: "2", minor: "0.1", step: "0.3", hops: 6,
      asks: [
        ["0.3씩", { n: "6", s: 1 }, "번 뛰어 세면", { n: "1.8" }, "이므로 0.3×6 =", { n: "1.8", e: "0.3×6" }],
        ["23×4 = 92이므로 2.3×4 =", { n: "9.2", e: "2.3×4", why: { "92": "2.3은 23의 [1/10]배예요. 곱도 [1/10]배예요." } }],
        ["레몬청 한 통에 설탕이 0.5 kg 들어가요. 9통을 만들려면 설탕이", { n: "4.5", e: "0.5×9" }, "kg 필요해요."],
        ["한 변이 8.4 cm인 정육각형의 둘레는", { n: "50.4", e: "8.4×6" }, "cm예요."]],
      ok: "0.3×6=1.8, 2.3×4=9.2, 0.5×9=4.5, 8.4×6=50.4예요. 잘했어요!" }) }
},
{
  id: "t3", no: 3, title: "(소수)×(자연수)를 알아볼까요(2) ― 소수 두 자리 수인 경우", soop: "개념 구축하기(O)",
  question: "(소수 두 자리 수)×(자연수)는 어떻게 계산할까요?",
  summary: "0.12×4는 0.1이 4개(0.4), 0.01이 8개(0.08)이므로 0.48이에요. 3.14×3=[314/100]×3=[942/100]=9.42처럼 분모가 100인 분수의 곱셈으로 계산하거나, 314×3=942의 [1/100]배로 계산해요. 분모가 10, 100, 1000인 분수는 약분하지 않고 그대로 두면 소수로 나타내기 편리해요.",
  steps: [
    { inst: "“은성이는 기념품으로 한 변의 길이가 0.12 m인 정사각형 모양의 액자를 받았습니다.” 액자의 둘레는 몇 m인지 알아봐요. 액자의 한 변마다 0.12만큼인 수 모형 묶음을 놓고, 같은 모형끼리 모아 세어 보세요.", hints: ["정사각형은 네 변의 길이가 같아요. 0.12 묶음을 4개 놓아요.", "0.12는 0.1 막대 1개와 0.01 조각 2개예요.", "0.1이 4개이면 0.4, 0.01이 8개이면 0.08이에요."],
      render: (b, a) => dm4Blocks(b, a, { unit: "0.12", times: 4, frame: true,
        asks: [
          ["액자의 둘레를 구하는 식은 0.12+0.12+0.12+0.12 또는", { o: ["0.12×4", "0.12+4", "0.12×2"], a: 0 }],
          ["0.12×4에서 0.1이", { n: "4", s: 1 }, "개이므로", { n: "0.4" }, ", 0.01이 2×4 =", { n: "8", s: 1 }, "(개)이므로", { n: "0.08", why: { "0.8": "0.01이 8개이면 0.08이에요.", "8": "0.01이 8개인 수를 소수로 써요." } }, "이에요."],
          ["0.12×4 = 0.4+0.08 =", { n: "0.48", e: "0.12×4" }],
          ["액자의 둘레는", { n: "0.48" }, "m예요."]],
        ok: "0.12×4는 0.1이 4개, 0.01이 8개이므로 0.48이에요. 액자의 둘레는 0.48 m예요." }) },
    { inst: "3.14×3을 계산하는 방법을 알아봐요. 먼저 어림해 보고, 분수의 곱셈과 자연수의 곱셈으로 계산해 보세요.", hints: ["3.14는 소수 두 자리 수이니 분모가 100인 분수 [314/100]예요.", "314×3=942예요. 3.14는 314의 [1/100]배예요.", "어림한 결과와 계산 결과의 차를 구하지 않아도 돼요. 비슷한지만 살펴봐요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["3.14를 3으로 어림하면 3×3 =", { n: "9" }, "이므로 3.14×3은", { o: ["9보다 조금 커요", "9보다 조금 작아요", "90쯤이에요"], a: 0 }]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["3.14×3 =", { f: ["314", "100"], why: { "314/10": "3.14는 소수 두 자리 수예요. 분모가 100인 분수로 나타내요." } }, "×3 = [314×3/100] =", { f: ["942", "100"] }, "=", { n: "9.42", e: "3.14×3" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [
          { fig: () => dm4RelFig([["314", "3", "942"], ["3.14", "3", "9.42"]], { a: "1/100", p: "1/100" }) },
          ["314×3 =", { n: "942", e: "314×3" }, ". 3.14는 314의", { o: ["[1/10]배", "[1/100]배"], a: 1 }, "이므로 3.14×3은 942의 [1/100]배인", { n: "9.42", e: "3.14×3", why: { "94.2": "3.14는 314의 [1/100]배예요. [1/10]배가 아니에요." } }, "이에요."]] }],
        { ok: "3.14×3=9.42예요. 9보다 조금 클 거라고 어림했는데 9.42가 나왔어요." }) },
    { inst: "어떤 친구가 5.18×2를 다음과 같이 계산했어요. 잘못 계산한 곳을 찾아 까닭을 말하고, 옳게 계산해 보세요.", hints: ["5.18은 소수 두 자리 수예요. 분모가 몇인 분수일까요?", "5×2=10이니 5.18×2는 10쯤이어야 해요.", "분모가 100인 분수의 곱셈으로 다시 계산해요."],
      render: (b, a) => dm4Sent(b, a, [
        { fig: () => dm4Talk([["친구의 계산:", "5.18×2 = [518/10]×2 = [1036/10] = 103.6"]]) },
        ["잘못된 곳은", { o: ["5.18을 [518/10]로 나타낸 것", "518×2를 1036으로 계산한 것"], a: 0, why: { "1": "518×2=1036은 맞아요. 5.18을 분수로 나타낸 곳을 살펴봐요." } }],
        ["5×2=10으로 어림하면 103.6은", { o: ["너무 커요", "알맞아요"], a: 0 }],
        ["옳게 계산하면 5.18×2 =", { f: ["518", "100"] }, "×2 =", { f: ["1036", "100"] }, "=", { n: "10.36", e: "5.18×2", why: { "103.6": "분모를 10으로 계산하면 안 돼요. 5.18은 [518/100]이에요." } }],
        ["[1036/100]처럼 분모가 10, 100, 1000인 분수는", { o: ["약분하지 않고 그대로 두면 소수로 나타내기 편리해요", "꼭 기약분수로 고쳐야 해요"], a: 0 }]],
      { ok: "5.18=[518/100]이므로 5.18×2=[1036/100]=10.36이에요. 어림해 보면 잘못된 계산을 찾을 수 있어요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["3.14=[314/100]이었어요.", "314×3=942의 [1/100]배가 3.14×3이었어요."],
      render: (b, a) => blanks(b, a, ["(소수 두 자리 수)×(자연수)는 분모가 ", { o: ["10", "100", "1000"], a: 1 }, "인 분수의 곱셈으로 나타내어 계산하거나, 자연수의 곱셈을 한 뒤 곱을 ", { o: ["[1/10]배", "[1/100]배"], a: 1 }, " 하여 계산해요. 곱해지는 수가 [1/100]배가 되면 곱도 ", { o: ["100배", "[1/100]배"], a: 1 }, "가 돼요."]) },
    { inst: "계산해 보고, 김치 문제도 해결해 보세요.", hints: ["4.87×2는 487×2=974의 [1/100]배예요.", "6.09×4는 609×4=2436의 [1/100]배예요.", "올해는 작년의 3배만큼 담갔으니 1.25×3이에요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "4.87", b: "2" }, { a: "6.09", b: "4" }],
        rows: [
          ["0.71×6 =", { f: ["71", "100"] }, "×6 =", { f: ["426", "100"] }, "=", { n: "4.26", e: "0.71×6" }],
          { q: "수현이가 사는 지역에서는 매년 다문화 가정과 함께 김치를 담가요. 김치를 작년에는 1.25 t 담갔고, 올해는 작년의 3배만큼 담갔어요.", p: ["올해 담근 김치는", { n: "3.75", e: "1.25×3" }, "t예요."] }],
        ok: "4.87×2=9.74, 6.09×4=24.36, 0.71×6=4.26, 올해 담근 김치는 1.25×3=3.75 (t)예요." }) }
  ],
  challenge: { inst: "수 카드 놀이예요. 수 카드 4, 8, 6을 한 번씩 놓아 곱이 가장 큰 (소수 두 자리 수)×(자연수)를 만들어 보세요.", hints: ["큰 수를 곱하는 수(자연수)에 놓을지, 소수 첫째 자리에 놓을지 비교해 봐요.", "0.86×4, 0.84×6, 0.64×8을 어림해서 견주어 봐요."],
    render: (b, a) => dm4Cards(b, a, { cards: ["4", "8", "6"], pat: ["0", ".", "□", "□", "×", "□"], goal: "max",
      after: (e, v) => [
        ["만든 식의 곱은", { n: v, e }],
        ["0.54×6", { o: [">", "=", "<"], a: 2, why: { "0": "0.54×6=3.24, 0.83×4=3.32예요." } }, "0.83×4"],
        ["서준이가 하루에 1.95 km씩 일주일 동안 자전거를 타면 모두", { n: "13.65", e: "1.95×7" }, "km예요."]],
      ok: "곱이 가장 큰 식은 0.64×8=5.12예요. 가장 큰 수 8을 곱하는 수로 놓는 것이 가장 커요." }) }
},
{
  id: "t4", no: 4, title: "(자연수)×(소수)를 알아볼까요(1) ― 소수 한 자리 수인 경우", soop: "개념 구축하기(O)",
  question: "(자연수)×(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "2의 0.1배는 0.2이므로 2의 0.9배는 0.2×9=1.8이에요(2×0.9=1.8). 6×1.2=6×[12/10]=[72/10]=7.2처럼 분수의 곱셈으로 계산하거나, 6×12=72의 [1/10]배로 계산해요. 1보다 작은 수를 곱하면 곱은 곱해지는 수보다 작아져요.",
  steps: [
    { inst: "“은성이는 작품을 만들기 위해 철사를 2 m의 0.9배만큼 사용하였습니다.” 작품 만들기 체험장에서 철사를 구부려 안경을 만들었어요. 이중 수직선의 아래 표시를 0.9배로 옮기고, 사용한 철사는 몇 m인지 알아보세요.", hints: ["아래 수직선의 작은 눈금 한 칸은 0.1배예요.", "2의 1배는 2예요. 2를 똑같이 10으로 나눈 하나가 2의 0.1배예요.", "2의 0.9배는 2의 0.1배가 9개예요."],
      render: (b, a) => dm4Double(b, a, { top: "2", unit: "m", what: "철사 2 m", bot: "1", step: "0.1", labels: ["0.1", "0.2", "0.5", "0.9"], target: "0.9",
        asks: [
          ["사용한 철사의 길이를 구하는 식은", { o: ["2×0.9", "2+0.9", "2−0.9"], a: 0 }],
          ["2의 1배는 2이므로 2의 0.1배는", { n: "0.2", e: "2×0.1" }, "이에요."],
          ["2의 0.9배는 0.2×9 =", { n: "1.8", e: "2×0.9", why: { "18": "2의 0.9배는 2보다 작아야 해요." } }, "이에요."],
          ["은성이가 사용한 철사는", { n: "1.8" }, "m예요. 2 m보다", { o: ["길어요", "짧아요"], a: 1 }, "."]],
        ok: "2의 0.1배는 0.2, 2의 0.9배는 1.8이에요. 1보다 작은 0.9를 곱했더니 곱이 2보다 작아졌어요." }) },
    { inst: "6×1.2를 계산하는 방법을 알아봐요. 먼저 어림해 보고, 분수의 곱셈과 자연수의 곱셈으로 계산해 보세요.", hints: ["1.2=[12/10]이에요.", "6×12=72이고, 1.2는 12의 [1/10]배예요.", "곱하는 수가 [1/10]배가 되면 곱도 [1/10]배가 돼요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["1.2를 1로 어림하면 6×1 =", { n: "6" }, "이므로 6×1.2는", { o: ["6보다 조금 커요", "6보다 조금 작아요"], a: 0, why: { "1": "1.2는 1보다 커요. 6에 1보다 큰 수를 곱했어요." } }]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["6×1.2 = 6×", { f: ["12", "10"] }, "= [6×12/10] =", { f: ["72", "10"] }, "=", { n: "7.2", e: "6×1.2" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [
          { fig: () => dm4RelFig([["6", "12", "72"], ["6", "1.2", "7.2"]], { b: "1/10", p: "1/10" }) },
          ["6×12 =", { n: "72", e: "6×12" }, ". 1.2는 12의 [1/10]배이므로 6×1.2는 72의", { o: ["10배", "[1/10]배"], a: 1 }, "인", { n: "7.2", e: "6×1.2" }, "이에요."]] }],
      { ok: "6×1.2=7.2예요. 6쯤이라고 어림했는데 6보다 조금 큰 7.2가 나왔어요." }) },
    { inst: "5×2.3을 두 가지 방법으로 계산해 보고, 곱셈을 하면 항상 곱이 커지는지 생각해 보세요.", hints: ["2.3=[23/10]이에요.", "5×23=115예요.", "2의 0.9배는 2보다 작았어요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "방법 ①", rows: [["5×2.3 = 5×", { f: ["23", "10"] }, "= [5×23/10] =", { f: ["115", "10"] }, "=", { n: "11.5", e: "5×2.3" }]] },
        { g: "방법 ②", rows: [["5×23 =", { n: "115", e: "5×23" }, "→ 5×2.3 =", { n: "11.5", e: "5×2.3" }]] },
        ["5에 1보다 큰 수 2.3을 곱하면 곱은 5보다", { o: ["커져요", "작아져요"], a: 0 }],
        ["2에 1보다 작은 수 0.9를 곱하면 곱은 2보다", { o: ["커져요", "작아져요"], a: 1, why: { "0": "2×0.9=1.8이었어요. 2보다 작아요." } }],
        ["곱셈을 하면 곱은", { o: ["항상 커져요", "곱하는 수가 1보다 작으면 작아져요"], a: 1 }]],
      { ok: "5×2.3=11.5예요. 곱셈을 한다고 늘 커지는 것은 아니에요. 1보다 작은 수를 곱하면 곱해지는 수보다 작아져요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["6×1.2=6×[12/10]이었어요.", "곱하는 수 1.2를 10배 한 12와 곱했으면 곱을 [1/10]배 해야 해요."],
      render: (b, a) => blanks(b, a, ["(자연수)×(소수 한 자리 수)는 6×1.2=6×[12/10]처럼 ", { o: ["분수의 곱셈", "분수의 덧셈"], a: 0 }, "으로 나타내어 계산하거나, 곱하는 수를 10배 한 자연수와 곱한 뒤 곱을 ", { o: ["10배", "[1/10]배"], a: 1 }, " 해요. 1보다 작은 수를 곱하면 곱은 곱해지는 수보다 ", { o: ["커져요", "작아져요"], a: 1 }, "."]) },
    { inst: "계산해 보세요. 세로셈은 자연수의 곱셈처럼 계산한 뒤 곱의 소수점을 찍어요.", hints: ["4×2.6은 4×26=104의 [1/10]배예요.", "13×3.4는 13×34=442의 [1/10]배예요.", "7×0.8은 7보다 작아야 해요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "4", b: "2.6" }, { a: "13", b: "3.4" }],
        rows: [["7×0.8 = 7×", { f: ["8", "10"] }, "=", { f: ["56", "10"] }, "=", { n: "5.6", e: "7×0.8" }]],
        ok: "4×2.6=10.4, 13×3.4=44.2, 7×0.8=5.6이에요!" }) }
  ],
  challenge: { inst: "수 카드 7, 3, 6을 한 번씩 놓아 곱이 가장 작은 (자연수)×(소수 한 자리 수)를 만들어 보세요. 그리고 물음에 답해 보세요.", hints: ["곱이 작으려면 곱해지는 자연수를 작게 해야 해요.", "3×6.7, 3×7.6, 6×3.7, 7×3.6을 견주어 봐요.", "어제의 1.3배는 180×1.3이에요."],
    render: (b, a) => dm4Cards(b, a, { cards: ["7", "3", "6"], pat: ["□", "×", "□", ".", "□"], goal: "min",
      after: (e, v) => [
        ["만든 식의 곱은", { n: v, e }],
        ["3×2.9 = 3×[29/10] =", { f: ["87", "10"] }, "=", { n: "8.7", e: "3×2.9" }],
        ["주원이는 어제 우유를 180 mL 마셨고, 오늘은 어제의 1.3배만큼 마셨어요. 오늘 마신 우유는", { n: "234", e: "180×1.3" }, "mL예요."]],
      ok: "곱이 가장 작은 식은 3×6.7=20.1이에요. 오늘 마신 우유는 234 mL예요." }) }
},
{
  id: "t5", no: 5, title: "(자연수)×(소수)를 알아볼까요(2) ― 소수 두 자리 수인 경우", soop: "개념 구축하기(O)",
  question: "(자연수)×(소수 두 자리 수)는 어떻게 계산할까요?",
  summary: "2의 0.25배는 0.5이므로 2의 0.75배는 1.5예요(2×0.75=1.5). 4×1.24=4×[124/100]=[496/100]=4.96처럼 분모가 100인 분수의 곱셈으로 계산하거나, 4×124=496의 [1/100]배로 계산해요. 곱하는 소수 두 자리 수를 자연수나 소수 한 자리 수로 어림하면 결과를 쉽게 견줄 수 있어요.",
  steps: [
    { inst: "“은성이는 벽화 그리기 체험을 하는 데 페인트를 2 L의 0.75배만큼 사용하였습니다.” “난 노란색 페인트로 꽃을 칠할래.” 이중 수직선의 아래 표시를 0.75배로 옮기고, 사용한 페인트는 몇 L인지 알아보세요.", hints: ["아래 수직선의 작은 눈금 한 칸은 0.25배예요.", "2의 0.25배는 2를 똑같이 4로 나눈 하나예요.", "0.75배는 0.25배가 3개예요."],
      render: (b, a) => dm4Double(b, a, { top: "2", unit: "L", what: "페인트 2 L", bot: "1", step: "0.25", labels: ["0.25", "0.5", "0.75"], target: "0.75", color: "#F7D774",
        asks: [
          ["사용한 페인트의 양을 구하는 식은", { o: ["2×0.75", "2+0.75", "2×75"], a: 0 }],
          ["2의 1배는 2이므로 2의 0.25배는", { n: "0.5", e: "2×0.25" }, "이에요."],
          ["2의 0.75배는 0.5의 3배이므로", { n: "1.5", e: "2×0.75" }, "이에요."],
          ["은성이가 사용한 페인트는", { n: "1.5" }, "L예요."]],
        ok: "2의 0.25배는 0.5, 2의 0.75배는 1.5예요. 은성이는 페인트를 1.5 L 사용했어요." }) },
    { inst: "4×1.24를 계산하는 방법을 알아봐요. 먼저 어림해 보고, 분수의 곱셈과 자연수의 곱셈으로 계산해 보세요.", hints: ["1.24는 1과 1.5의 중간쯤이에요.", "1.24=[124/100]이에요.", "4×124=496이고 1.24는 124의 [1/100]배예요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["1.24는 1과 1.5의 중간쯤이에요. 4×1 =", { n: "4" }, ", 4×1.5 =", { n: "6", e: "4×1.5" }, "이므로 4×1.24는 약", { o: ["5", "50", "0.5"], a: 0 }, "예요."]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["4×1.24 = 4×", { f: ["124", "100"] }, "= [4×124/100] =", { f: ["496", "100"] }, "=", { n: "4.96", e: "4×1.24" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [["4×124 =", { n: "496", e: "4×124" }, ". 1.24는 124의", { o: ["[1/10]배", "[1/100]배"], a: 1 }, "이므로 4×1.24 =", { n: "4.96", e: "4×1.24", why: { "49.6": "1.24는 124의 [1/100]배예요." } }]] },
        ["1.24×4를 계산해도 곱은", { o: ["같아요", "달라요"], a: 0 }, ". 곱하는 수와 곱해지는 수의 위치가 바뀌어도 곱은 같아요."]],
      { ok: "4×1.24=4.96이에요. 5쯤이라고 어림했는데 4.96이 나왔어요." }) },
    { inst: "“작품을 만드는 데 색점토를 더 많이 사용한 사람은 누구인지 어림셈하여 구하고, 어떻게 어림셈했는지 이야기해 봅시다.”", hints: ["0.75는 1보다 작아요. 50×0.75는 50보다 작아요.", "1.25는 1보다 커요. 40×1.25는 40보다 커요.", "정확한 값: 50×0.75=37.5, 40×1.25=50이에요."],
      render: (b, a) => dm4Sent(b, a, [
        { fig: () => dm4Talk([["은찬:", "나는 색점토 50 g의 0.75배만큼 사용하여 고양이를 만들었어."], ["예린:", "나는 색점토 40 g의 1.25배만큼 사용하여 강아지를 만들었어."]]) },
        { g: "어림하기", rows: [
          ["은찬: 0.75를 1로 어림하면 50×1 =", { n: "50" }, "이므로 은찬이가 사용한 색점토는 약 50 g이고, 실제로는 50 g보다", { o: ["적어요", "많아요"], a: 0 }],
          ["예린: 1.25를 1.5로 어림하면 40×1.5 =", { n: "60", e: "40×1.5" }, "이므로 약 60 g이에요."],
          ["색점토를 더 많이 사용한 사람은", { o: ["은찬", "예린"], a: 1 }, "이에요."]] },
        { g: "정확하게 계산해 확인하기", rows: [["50×0.75 =", { n: "37.5", e: "50×0.75" }, ", 40×1.25 =", { n: "50", e: "40×1.25" }],
          ["어림한 결과와 계산한 결과는", { o: ["같아요", "달라요"], a: 0 }]] }],
      { ok: "어림셈으로도 예린이가 색점토를 더 많이 사용했다는 것을 알 수 있어요. 실제로 37.5 g과 50 g이에요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["1.24=[124/100]이었어요.", "곱하는 수가 1보다 큰 1.24일 때 곱은 4보다 커졌어요."],
      render: (b, a) => blanks(b, a, ["(자연수)×(소수 두 자리 수)는 분모가 ", { o: ["10", "100"], a: 1 }, "인 분수의 곱셈으로 나타내어 계산하거나, 자연수끼리 곱한 뒤 곱을 ", { o: ["[1/10]배", "[1/100]배"], a: 1 }, " 해요. 곱하는 수가 1보다 크면 곱은 곱해지는 수보다 ", { o: ["커지고", "작아지고"], a: 0 }, ", 1보다 작으면 곱은 곱해지는 수보다 ", { o: ["커져요", "작아져요"], a: 1 }, "."]) },
    { inst: "계산해 보세요. 20×3.04는 두 수의 자리를 바꾸어 3.04×20으로 세로셈을 해도 곱이 같아요.", hints: ["17×0.32는 17×32=544의 [1/100]배예요.", "3.04×20은 304×20=6080의 [1/100]배예요. 60.80의 끝자리 0은 생략할 수 있어요.", "5×2.63=[1315/100]이에요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "17", b: "0.32" }, { a: "3.04", b: "20", cap: "20 × 3.04 → 3.04 × 20" }],
        rows: [["5×2.63 = 5×", { f: ["263", "100"] }, "=", { f: ["1315", "100"] }, "=", { n: "13.15", e: "5×2.63" }]],
        ok: "17×0.32=5.44, 20×3.04=60.8, 5×2.63=13.15예요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 이중 수직선의 아래 표시를 1.75배로 옮기고 2×1.75를 구해 보세요. 그리고 물음에 답해 보세요.", hints: ["아래 작은 눈금 한 칸은 0.25배예요. 2의 0.25배를 먼저 구해요.", "1.75배는 0.25배가 7개예요.", "9×0.79는 9보다 작고, 6×1.48은 6과 1.5를 곱한 9에 가까워요."],
    render: (b, a) => dm4Double(b, a, { top: "4", unit: "", what: "2의 몇 배", bot: "2", step: "0.25", labels: ["0.25", "0.5", "1", "1.75"], topLabels: [[4, "2"]], target: "1.75",
      asks: [
        ["2의 0.25배는", { n: "0.5" }, "이므로 2의 1.75배는 2×1.75 =", { n: "3.5", e: "2×1.75" }],
        ["곱이 8보다 큰 것은", { o: ["9×0.79", "2×3.85", "6×1.48"], a: 2, why: { "0": "9×0.79=7.11이에요. 9에 1보다 작은 수를 곱했어요.", "1": "2×3.85=7.7이에요." } }],
        ["13×0.06 =", { n: "0.78", e: "13×0.06" }],
        ["승호의 식물은 12 cm이고, 민아의 식물은 승호 식물의 2.25배예요. 민아의 식물은", { n: "27", e: "12×2.25" }, "cm예요."]],
      ok: "2×1.75=3.5, 6×1.48=8.88, 12×2.25=27이에요. 잘했어요!" }) }
},
{
  id: "t6", no: 6, title: "(소수)×(소수)를 알아볼까요(1) ― 소수 한 자리 수인 경우", soop: "개념 구축하기(O)",
  question: "(소수 한 자리 수)×(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "가로 0.8 m, 세로 0.6 m인 천은 넓이가 0.01 m²인 모눈 48칸이므로 0.8×0.6=0.48 (m²)예요. 3.4×1.7=[34/10]×[17/10]=[578/100]=5.78처럼 분수의 곱셈으로 계산하거나, 34×17=578의 [1/100]배로 계산해요. 1보다 작은 두 수의 곱은 곱한 두 수보다 작아요.",
  steps: [
    { inst: "“은성이와 지아는 가로가 0.8 m, 세로가 0.6 m인 직사각형 모양의 천을 염색하려고 합니다.” 가로·세로가 1 m인 정사각형을 100칸으로 나눈 모눈종이에 천의 크기만큼 색칠하고, 천의 넓이는 몇 m²인지 알아보세요.", hints: ["모눈 한 칸의 한 변은 0.1 m예요. 가로 8칸, 세로 6칸을 색칠해요.", "모눈 한 칸의 넓이는 0.1×0.1=0.01 (m²)예요.", "0.01이 48개이면 0.48이에요."],
      render: (b, a) => dm4Area(b, a, { w: 8, h: 6, unit: "m",
        asks: [
          ["천의 넓이를 구하는 식은", { o: ["0.8×0.6", "0.8+0.6", "8×6"], a: 0 }],
          ["색칠한 칸은 모두", { n: "48", s: 1 }, "칸이에요. 모눈 한 칸의 넓이는 0.01 m²예요."],
          ["0.8×0.6 = 0.01×", { n: "48", s: 1 }, "=", { n: "0.48", e: "0.8×0.6", why: { "4.8": "0.01이 48개인 수예요. 0.1이 48개가 아니에요.", "48": "0.01이 48개인 수를 소수로 써요." } }],
          ["천의 넓이는", { n: "0.48" }, "m²예요. 0.48은 0.8과 0.6보다", { o: ["커요", "작아요"], a: 1 }, "."]],
        ok: "0.8×0.6=0.48이에요. 1보다 작은 두 수를 곱했더니 곱이 두 수보다 작아졌어요." }) },
    { inst: "3.4×1.7을 계산하는 방법을 알아봐요. 먼저 어림해 보고, 분수의 곱셈과 자연수의 곱셈으로 계산해 보세요.", hints: ["3.4=[34/10], 1.7=[17/10]이에요. 분모끼리, 분자끼리 곱해요.", "34×17=578이에요.", "곱해지는 수와 곱하는 수가 모두 [1/10]배가 되었으니 곱은 [1/10]의 [1/10]인 [1/100]배가 돼요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["3.4를 3으로, 1.7을 2로 어림하면 3×2 =", { n: "6" }, "이므로 3.4×1.7은 약 6이에요."]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["3.4×1.7 =", { f: ["34", "10"] }, "×", { f: ["17", "10"] }, "= [34×17/100] =", { f: ["578", "100"], why: { "578/10": "분모끼리 곱하면 10×10=100이에요." } }, "=", { n: "5.78", e: "3.4×1.7" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [
          { fig: () => dm4RelFig([["34", "17", "578"], ["3.4", "1.7", "5.78"]], { a: "1/10", b: "1/10", p: "1/100" }) },
          ["34×17 =", { n: "578", e: "34×17" }],
          ["3.4는 34의 [1/10]배, 1.7은 17의 [1/10]배이므로 3.4×1.7은 578의", { o: ["[1/10]배", "[1/100]배", "100배"], a: 1, why: { "0": "곱해지는 수와 곱하는 수가 모두 [1/10]배가 되었어요. [1/10]배를 두 번 하면 [1/100]배예요.", "2": "두 수가 작아졌으니 곱도 작아져요." } }, "인", { n: "5.78", e: "3.4×1.7" }, "이에요."]] }],
      { ok: "3.4×1.7=5.78이에요. 어림한 6과 비슷해요. 곱이 578의 100배가 아니라 [1/100]배로 줄어들어요." }) },
    { inst: "5.9×2.4를 두 가지 방법으로 계산해 봐요. 그리고 어떤 친구가 1.7×3.4를 세로로 계산한 뒤 덧셈처럼 소수점을 맞추어 57.8이라고 썼어요. 자연수의 곱에 소수점을 바르게 찍어 보세요.", hints: ["59×24=1416이에요. 5.9×2.4는 1416의 [1/100]배예요.", "17×34=578이에요. 1.7×3.4는 578의 [1/100]배예요.", "1.7×3.4를 2×3=6으로 어림하면 57.8은 너무 커요."],
      render: (b, a) => dm4Point(b, a, { items: [{ e: "5.9×2.4" }, { e: "1.7×3.4" }],
        asks: [
          ["방법 ①: 5.9×2.4 = [59/10]×[24/10] =", { f: ["1416", "100"] }, "=", { n: "14.16", e: "5.9×2.4" }],
          ["1.7×3.4를 2×3=6으로 어림하면 57.8은", { o: ["너무 커요", "알맞아요"], a: 0 }, "."],
          ["곱의 소수점 아래 자리 수는 두 수의 소수점 아래 자리 수를", { o: ["더한 것", "맞춘 것"], a: 0 }, "과 같아요."]],
        ok: "5.9×2.4=14.16, 1.7×3.4=5.78이에요. 곱셈은 덧셈처럼 소수점을 맞추지 않아요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["[34/10]×[17/10]=[578/100]이었어요.", "0.8×0.6=0.48은 0.8과 0.6보다 작았어요."],
      render: (b, a) => blanks(b, a, ["(소수 한 자리 수)×(소수 한 자리 수)는 [34/10]×[17/10]처럼 분모가 10인 분수의 곱셈으로 나타내어 계산하거나, 자연수끼리 곱한 뒤 곱을 ", { o: ["[1/10]배", "[1/100]배"], a: 1 }, " 해요. 1보다 작은 두 수의 곱은 곱한 두 수보다 ", { o: ["커요", "작아요"], a: 1 }, "."]) },
    { inst: "계산해 보세요. 세로셈은 자연수의 곱셈처럼 계산한 뒤 곱의 소수점을 찍어요.", hints: ["4.6×0.9는 46×9=414의 [1/100]배예요.", "2.8×6.7은 28×67=1876의 [1/100]배예요.", "1보다 작은 곱이면 소수점 앞 일의 자리에 0을 써요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "4.6", b: "0.9" }, { a: "2.8", b: "6.7" }],
        rows: [["0.5×0.7 =", { f: ["5", "10"] }, "×", { f: ["7", "10"] }, "=", { f: ["35", "100"] }, "=", { n: "0.35", e: "0.5×0.7" }]],
        ok: "4.6×0.9=4.14, 2.8×6.7=18.76, 0.5×0.7=0.35예요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 한 칸이 0.01인 모눈에 가로 0.7만큼, 세로 0.8만큼 색칠해 0.7×0.8을 구하고, 물음에 답해 보세요.", hints: ["가로 7칸, 세로 8칸을 색칠해요.", "7.2×3.2를 7×3=21로 어림해 봐요.", "새 직사각형의 가로는 4.5×0.8, 세로는 4.5×1.4예요."],
    render: (b, a) => dm4Area(b, a, { w: 7, h: 8, unit: "", color: "#9CC6EC",
      asks: [
        ["0.7×0.8 = 0.01×", { n: "56", s: 1 }, "=", { n: "0.56", e: "0.7×0.8" }],
        ["16×13 = 208이므로 1.6×1.3 =", { n: "2.08", e: "1.6×1.3", why: { "20.8": "두 수가 모두 [1/10]배이니 곱은 [1/100]배예요." } }],
        ["7.2×3.2를 옳게 계산한 것은", { o: ["203.4", "2.034", "23.04", "0.2304"], a: 2 }],
        ["0.6×9.5 =", { n: "5.7", e: "0.6×9.5" }, "이므로 0.6×9.5 < □에서 □ 안에 들어갈 수 있는 가장 작은 자연수는", { n: "6", s: 1 }],
        ["한 변이 4.5 cm인 정사각형의 가로를 0.8배로 줄이고 세로를 1.4배로 늘인 직사각형은 가로", { n: "3.6", e: "4.5×0.8" }, "cm, 세로", { n: "6.3", e: "4.5×1.4" }, "cm, 넓이", { n: "22.68", e: "3.6×6.3" }, "cm²예요."]],
      ok: "0.7×0.8=0.56, 1.6×1.3=2.08, 7.2×3.2=23.04, 새 직사각형의 넓이는 22.68 cm²예요." }) }
},
{
  id: "t7", no: 7, title: "(소수)×(소수)를 알아볼까요(2) ― 소수 두 자리 수인 경우", soop: "개념 구축하기(O)",
  question: "(소수 두 자리 수)×(소수 한 자리 수)는 어떻게 계산할까요?",
  summary: "0.21의 0.1배는 0.021이므로 0.21의 0.6배는 0.126이에요(0.21×0.6=0.126). 4.32×1.8=[432/100]×[18/10]=[7776/1000]=7.776처럼 분수의 곱셈으로 계산하거나, 432×18=7776의 [1/1000]배로 계산해요.",
  steps: [
    { inst: "도자기 공방에서 “은성이는 흙을 0.21 kg 사용하여 그릇을 만들었고, 지아는 은성이가 사용한 흙의 0.6배만큼 사용하여 접시를 만들었습니다.” 이중 수직선의 아래 표시를 0.6배로 옮기고, 지아가 사용한 흙은 몇 kg인지 알아보세요.", hints: ["아래 작은 눈금 한 칸은 0.1배예요.", "0.21의 0.1배는 0.21을 똑같이 10으로 나눈 하나예요. 0.01의 [1/10]은 0.001이에요.", "0.21의 0.6배는 0.21의 0.1배가 6개예요."],
      render: (b, a) => dm4Double(b, a, { top: "0.21", unit: "kg", what: "은성이가 사용한 흙 0.21 kg", bot: "1", step: "0.1", labels: ["0.1", "0.6"], target: "0.6", color: "#C9A27E",
        asks: [
          ["지아가 사용한 흙의 양을 구하는 식은", { o: ["0.21×0.6", "0.21+0.6", "0.21×6"], a: 0 }],
          ["0.21의 1배는 0.21이므로 0.21의 0.1배는", { n: "0.021", e: "0.21×0.1", why: { "0.21": "0.1배를 하면 작아져요.", "2.1": "0.1배를 하면 작아져요.", "0.0021": "0.21의 [1/10]이에요. 소수점을 왼쪽으로 한 자리만 옮겨요." } }, "이에요."],
          ["0.21의 0.6배는 0.021의 6배이므로", { n: "0.126", e: "0.21×0.6" }, "이에요."],
          ["지아가 사용한 흙은", { n: "0.126" }, "kg이에요."]],
        ok: "0.21의 0.1배는 0.021, 0.6배는 0.126이에요. 지아가 사용한 흙은 0.126 kg이에요." }) },
    { inst: "4.32×1.8을 계산하는 방법을 알아봐요. 먼저 어림해 보고, 분수의 곱셈과 자연수의 곱셈으로 계산해 보세요.", hints: ["4.32=[432/100], 1.8=[18/10]이에요. 분모끼리 곱하면 1000이에요.", "432×18=7776이에요.", "[1/100]배와 [1/10]배를 함께 하면 [1/1000]배예요."],
      render: (b, a) => dm4Sent(b, a, [
        { g: "어림하기", rows: [["4.32를 4로, 1.8을 2로 어림하면 4×2 =", { n: "8" }, "이므로 4.32×1.8은 약 8이에요."]] },
        { g: "방법 ① 분수의 곱셈으로", rows: [["4.32×1.8 =", { f: ["432", "100"] }, "×", { f: ["18", "10"] }, "=", { f: ["7776", "1000"], why: { "7776/100": "분모끼리 곱하면 100×10=1000이에요." } }, "=", { n: "7.776", e: "4.32×1.8" }]] },
        { g: "방법 ② 자연수의 곱셈으로", rows: [
          { fig: () => dm4RelFig([["432", "18", "7776"], ["4.32", "1.8", "7.776"]], { a: "1/100", b: "1/10", p: "1/1000" }) },
          ["432×18 =", { n: "7776", e: "432×18" }],
          ["4.32는 432의 [1/100]배, 1.8은 18의 [1/10]배이므로 4.32×1.8은 7776의", { o: ["[1/100]배", "[1/1000]배"], a: 1 }, "인", { n: "7.776", e: "4.32×1.8", why: { "77.76": "곱이 [1/1000]배가 돼요. 소수점 아래 자리 수는 2+1=3(자리)예요." } }, "이에요."]] }],
      { ok: "4.32×1.8=7.776이에요. 8쯤이라고 어림했는데 7.776이 나왔어요." }) },
    { inst: "앞 차시의 (소수 한 자리 수)×(소수 한 자리 수)와 견주어 봐요. 자연수의 곱에 소수점을 찍고, 공통점과 차이점을 말해 보세요.", hints: ["3.4×1.7은 소수점 아래 자리 수가 1+1=2(자리)였어요.", "4.32×1.8은 2+1=3(자리)예요.", "0.38×0.2의 곱은 1보다 작으니 일의 자리에 0을 써요."],
      render: (b, a) => dm4Point(b, a, { items: [{ e: "3.4×1.7" }, { e: "4.32×1.8" }, { e: "0.38×0.2" }],
        asks: [
          ["3.4×1.7의 곱은 소수", { n: "2", s: 1 }, "자리 수, 4.32×1.8의 곱은 소수", { n: "3", s: 1 }, "자리 수예요."],
          ["두 경우 모두 자연수의 곱셈을 한 뒤 두 수의 소수점 아래 자리 수를", { o: ["더한 만큼", "곱한 만큼"], a: 0 }, "곱의 소수점 아래 자리 수가 정해져요."]],
        ok: "3.4×1.7=5.78, 4.32×1.8=7.776, 0.38×0.2=0.076이에요. 소수점 아래 자리 수를 더한 만큼 곱의 소수점 아래 자리 수가 정해져요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["[432/100]×[18/10]=[7776/1000]이었어요.", "432×18=7776의 [1/1000]배가 4.32×1.8이었어요."],
      render: (b, a) => blanks(b, a, ["(소수 두 자리 수)×(소수 한 자리 수)를 분수의 곱셈으로 나타내면 분모가 ", { o: ["100", "1000"], a: 1 }, "인 분수가 돼요. 자연수끼리 곱한 뒤 곱을 ", { o: ["[1/100]배", "[1/1000]배"], a: 1 }, " 하여 계산할 수도 있어요."]) },
    { inst: "계산해 보세요. 세로셈은 자연수의 곱셈처럼 계산한 뒤 곱의 소수점을 찍어요.", hints: ["5.73×0.9는 573×9=5157의 [1/1000]배예요.", "1.27×3.4는 127×34=4318의 [1/1000]배예요.", "0.38×0.2=[76/1000]이에요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "5.73", b: "0.9" }, { a: "1.27", b: "3.4" }],
        rows: [["0.38×0.2 =", { f: ["38", "100"] }, "×", { f: ["2", "10"] }, "=", { f: ["76", "1000"] }, "=", { n: "0.076", e: "0.38×0.2", why: { "0.76": "[76/1000]은 0.001이 76개예요." } }]],
        ok: "5.73×0.9=5.157, 1.27×3.4=4.318, 0.38×0.2=0.076이에요!" }) }
  ],
  challenge: { inst: "5.63×2.5에 알맞은 문제를 만들고 해결해 보세요. 문제 앞부분은 “방울토마토를 심은 밭의 가로는 5.63 m입니다.”예요. 수학익힘 문제도 풀어 보세요.", hints: ["5.63×2.5는 563×25=14075의 [1/1000]배예요.", "가장 큰 수는 20.04, 가장 작은 수는 1.5예요.", "잘못 뺀 계산을 거꾸로 하면 어떤 수는 11.65+0.4예요."],
    render: (b, a) => dm4Sent(b, a, [
      ["5.63×2.5에 알맞은 뒷부분은", { o: ["“밭의 세로가 2.5 m라면 밭의 넓이는 몇 m²인지 구해 보세요.”", "“밭의 세로가 2.5 m라면 밭의 둘레는 몇 m인지 구해 보세요.”", "“밭의 가로를 2.5 m 늘이면 가로는 몇 m인지 구해 보세요.”"], a: 0, why: { "1": "둘레는 (가로+세로)×2로 구해요.", "2": "늘인 길이는 덧셈으로 구해요." } }],
      ["방울토마토를 심은 밭의 넓이는", { n: "14.075", e: "5.63×2.5" }, "m²예요."],
      ["0.37×5.1 = [37/100]×[51/10] =", { f: ["1887", "1000"] }, "=", { n: "1.887", e: "0.37×5.1" }],
      ["6.83, 20.04, 1.5, 17.9 중 가장 큰 수와 가장 작은 수의 곱은", { n: "30.06", e: "20.04×1.5" }],
      ["가인이는 한 봉지에 1.2 kg인 밀가루의 0.37배를 사용했어요. 사용한 밀가루는", { n: "0.444", e: "1.2×0.37" }, "kg이에요."],
      ["어떤 수에 0.4를 곱해야 하는데 잘못하여 뺐더니 11.65가 되었어요. 어떤 수는", { n: "12.05", e: "11.65+0.4" }, "이고, 옳게 계산하면", { n: "4.82", e: "12.05×0.4" }, "이에요."]],
      { ok: "밭의 넓이는 14.075 m²예요. 0.37×5.1=1.887, 20.04×1.5=30.06, 1.2×0.37=0.444, 12.05×0.4=4.82예요." }) }
},
{
  id: "t8", no: 8, title: "곱의 소수점 위치는 어떻게 달라질까요", soop: "개념 구축하기(O)",
  question: "곱하는 수에 따라 곱의 소수점 위치는 어떻게 달라질까요?",
  summary: "소수에 10, 100, 1000을 곱하면 곱하는 수의 0의 개수만큼 곱의 소수점이 오른쪽으로 옮겨져요(0.15×1000=150). 자연수에 0.1, 0.01, 0.001을 곱하면 곱하는 수의 소수점 아래 자리 수만큼 곱의 소수점이 왼쪽으로 옮겨져요(150×0.001=0.15). 소수끼리의 곱은 두 수의 소수점 아래 자리 수를 더한 만큼 곱의 소수점 아래 자리 수가 정해져요(57×39=2223 → 0.57×0.39=0.2223).",
  steps: [
    { inst: "“계단을 한 칸 오를 때마다 열량 0.15 킬로칼로리를 소모한다고 합니다.” 지아가 센터 계단을 오르며 “1칸은 0.15, 10칸은 1.5, 100칸은 15 킬로칼로리를 소모하네.” 하고 말했어요. 판의 단추를 모두 눌러 곱의 소수점이 어떻게 움직이는지 살펴보세요.", hints: ["× 10을 누르면 소수점이 오른쪽으로 한 자리 옮겨져요.", "× 0.1을 누르면 소수점이 왼쪽으로 한 자리 옮겨져요.", "옮길 자리에 숫자가 없으면 0을 채워요."],
      render: (b, a) => dm4Shift(b, a, { sets: [{ name: "가", start: "0.15", fs: ["1", "10", "100", "1000"] }, { name: "나", start: "150", fs: ["1", "0.1", "0.01", "0.001"] }],
        asks: [
          ["가: 0.15×10 =", { n: "1.5", e: "0.15×10" }, ", 0.15×100 =", { n: "15", e: "0.15×100" }, ", 0.15×1000 =", { n: "150", e: "0.15×1000" }],
          ["나: 150×0.1 =", { n: "15", e: "150×0.1" }, ", 150×0.01 =", { n: "1.5", e: "150×0.01" }, ", 150×0.001 =", { n: "0.15", e: "150×0.001" }],
          ["가: 곱하는 수가 10배, 100배, 1000배가 될 때마다 곱의 소수점이", { o: ["오른쪽", "왼쪽"], a: 0 }, "으로 한 자리씩 옮겨져요."],
          ["나: 곱하는 수가 [1/10]배, [1/100]배, [1/1000]배가 될 때마다 곱의 소수점이", { o: ["오른쪽", "왼쪽"], a: 1 }, "으로 한 자리씩 옮겨져요."]],
        ok: "곱하는 수가 10배가 될 때마다 곱의 소수점은 오른쪽으로, [1/10]배가 될 때마다 왼쪽으로 한 자리씩 옮겨져요." }) },
    { inst: "분수의 곱셈으로 나타내어 계산하고, 곱의 소수점 위치를 이야기해 보세요.", hints: ["자연수는 분모가 1인 분수로 나타낼 수 있어요. 4=[4/1]이에요.", "0.04=[4/100], 0.7=[7/10]이에요.", "분모 10은 소수 한 자리, 100은 두 자리, 1000은 세 자리 수예요."],
      render: (b, a) => dm4Sent(b, a, [
        ["4×7 = [4/1]×[7/1] =", { f: ["28", "1"] }, "=", { n: "28", e: "4×7" }],
        ["0.4×7 = [4/10]×[7/1] =", { f: ["28", "10"] }, "=", { n: "2.8", e: "0.4×7" }],
        ["0.4×0.7 = [4/10]×[7/10] =", { f: ["28", "100"] }, "=", { n: "0.28", e: "0.4×0.7", why: { "2.8": "분모가 100이에요. 0.01이 28개인 수예요." } }],
        ["0.04×0.7 = [4/100]×[7/10] =", { f: ["28", "1000"] }, "=", { n: "0.028", e: "0.04×0.7", why: { "0.28": "분모가 1000이에요. 0.001이 28개인 수예요." } }],
        ["0.04×0.7에서 소수점 아래 자리 수는 2+1 =", { n: "3", s: 1 }, "(자리)이므로 곱도 소수", { n: "3", s: 1 }, "자리 수예요."],
        ["두 수의 소수점 아래 자리 수가 늘어날 때마다 곱의 소수점이", { o: ["왼쪽", "오른쪽"], a: 0 }, "으로 옮겨져요."]],
      { ok: "두 수의 소수점 아래 자리 수를 더한 값만큼 곱의 소수점 아래 자리 수가 정해져요." }) },
    { inst: "보기 57×39=2223을 이용하여 계산해 봐요. 자연수의 곱 2223에 곱의 소수점을 찍고, 계산기로도 확인해 보세요.", hints: ["5.7×39는 소수점 아래 자리 수가 1+0=1(자리)예요.", "5.7×0.39는 1+2=3(자리)예요.", "0.57×0.39는 2+2=4(자리)예요. 숫자가 모자라면 앞에 0을 채워요."],
      render: (b, a) => dm4Point(b, a, { intro: () => h("div", { class: "dm4big" }, "보기  57 × 39 = 2223"), items: [{ e: "5.7×39" }, { e: "5.7×3.9" }, { e: "5.7×0.39" }, { e: "0.57×0.39" }],
        ok: "5.7×39=222.3, 5.7×3.9=22.23, 5.7×0.39=2.223, 0.57×0.39=0.2223이에요. 곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을 옮겨요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["0.15×1000=150에서 소수점이 오른쪽으로 세 자리 옮겨졌어요.", "150×0.001=0.15에서 소수점이 왼쪽으로 세 자리 옮겨졌어요."],
      render: (b, a) => blanks(b, a, ["소수에 10, 100, 1000을 곱하면 곱하는 수의 ", { o: ["0의 개수", "소수점 아래 자리 수"], a: 0 }, "만큼 곱의 소수점이 ", { o: ["오른쪽", "왼쪽"], a: 0 }, "으로 옮겨져요. 자연수에 0.1, 0.01, 0.001을 곱하면 곱하는 수의 소수점 아래 자리 수만큼 곱의 소수점이 ", { o: ["오른쪽", "왼쪽"], a: 1 }, "으로 옮겨져요. 곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을 ", { o: ["옮겨요", "그대로 둬요"], a: 0 }, "."]) },
    { inst: "곱의 소수점 위치를 생각하여 계산해 보세요.", hints: ["1.36×100은 소수점을 오른쪽으로 두 자리 옮겨요.", "528×0.01은 소수점을 왼쪽으로 두 자리 옮겨요.", "1.36×1000은 소수점을 오른쪽으로 세 자리 옮기고, 빈자리에 0을 채워요."],
      render: (b, a) => dm4Sent(b, a, [
        ["1.36×10 =", { n: "13.6", e: "1.36×10" }, "1.36×100 =", { n: "136", e: "1.36×100" }, "1.36×1000 =", { n: "1360", e: "1.36×1000", why: { "136": "소수점을 오른쪽으로 세 자리 옮겨요. 빈자리에는 0을 채워요." } }],
        ["528×0.1 =", { n: "52.8", e: "528×0.1" }, "528×0.01 =", { n: "5.28", e: "528×0.01" }, "528×0.001 =", { n: "0.528", e: "528×0.001" }],
        ["한 개에 8.46 g인 사탕 10개는", { n: "84.6", e: "8.46×10" }, "g, 100개는", { n: "846", e: "8.46×100" }, "g, 1000개는", { n: "8460", e: "8.46×1000" }, "g이에요."]],
      { ok: "10, 100, 1000을 곱하면 소수점이 오른쪽으로, 0.1, 0.01, 0.001을 곱하면 왼쪽으로 옮겨져요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 곱의 소수점 위치를 생각하여 □ 안에 알맞은 수를 쓰거나 골라 보세요.", hints: ["1.701은 1701의 [1/1000]배예요. 6.3이 63의 [1/10]배이니 나머지 수는 27의 [1/100]배예요.", "54×0.12=6.48, 54×0.012=0.648, 0.054×12=0.648이에요.", "0.8×0.5=0.4예요. 0.04가 나오려면 소수점 아래 자리 수가 하나 더 많아야 해요."],
    render: (b, a) => dm4Sent(b, a, [
      { fig: () => h("div", { class: "dm4big" }, "보기  63 × 27 = 1701") },
      ["6.3 ×", { n: "0.27" }, "= 1.701"],
      [{ n: "0.063" }, "× 2700 = 170.1"],
      ["4.06×1000 =", { n: "4060", e: "4.06×1000" }, ", 920×0.01 =", { n: "9.2", e: "920×0.01" }],
      ["곱이 다른 하나는", { o: ["㉠ 54×0.12", "㉡ 54×0.012", "㉢ 0.054×12"], a: 0 }],
      ["재호가 0.8×0.5를 계산하려다 한 수의 소수점을 잘못 눌러 0.04가 나왔어요. 재호가 계산기에 누른 식은", { o: ["0.8×0.05", "8×0.5", "0.8×5"], a: 0, why: { "1": "8×0.5=4예요.", "2": "0.8×5=4예요." } }]],
    { ok: "6.3×0.27=1.701, 0.063×2700=170.1이에요. 소수점을 옮긴 만큼 곱의 소수점도 옮겨져요." }) }
},
{
  id: "t9", no: 9, title: "생각을 더하다 ― 건강하게 식단을 관리해요", soop: "탐구 정리하기(O)",
  question: "예은이가 먹은 점심과 저녁은 적절한 한 끼 식사 열량과 비교하여 어떨까요?",
  summary: "예은이의 점심은 352×0.5+142.5×2+67×1.5=176+285+100.5=561.5 (킬로칼로리)로 적절한 한 끼 600 킬로칼로리에 가까워요. 저녁은 435×0.7+45.6×3+56×0.5=304.5+136.8+28=469.3 (킬로칼로리)로 600 킬로칼로리보다 많이 적어요.",
  steps: [
    { name: "이해해요", inst: "✽ 열량: 음식을 먹었을 때 낼 수 있는 에너지의 양을 킬로칼로리 단위로 나타낸 것. “5학년 여학생의 한 끼 식사로 적절한 열량은 600 킬로칼로리라고 합니다. 5학년인 예은이가 점심에 먹은 음식의 열량을 구해 보고, 적절한 한 끼 식사 열량과 비교해 봅시다.”", hints: ["열량은 에너지의 양이에요.", "음식별 열량 표에는 음식 1그릇·1개·1컵·1줄의 열량이 있어요."],
      render: (b, a) => quiz(b, a, [
        { fig: dm4FoodTable, q: "구하려는 것은 무엇인가요?", o: ["예은이가 점심에 먹은 음식의 열량", "예은이가 먹은 음식의 무게", "예은이가 먹은 음식의 가격"], a: 0 },
        { q: "5학년 여학생의 한 끼 식사로 적절한 열량은 얼마인가요?", o: ["600 킬로칼로리", "352 킬로칼로리", "1000 킬로칼로리"], a: 0 },
        { q: "예은이는 점심에 소고기볶음밥 0.5그릇, 단팥도넛 2개, 우유 1.5컵을 먹었어요. 단팥도넛 1개의 열량은 얼마인가요?", o: ["142.5 킬로칼로리", "67 킬로칼로리", "45.6 킬로칼로리"], a: 0 }],
        { ok: "예은이가 점심에 먹은 음식의 열량을 구해서 600 킬로칼로리와 비교해요." }) },
    { name: "계획해요", inst: "예은이가 점심에 먹은 음식의 열량은 어떻게 구할지 계획해 보세요.", hints: ["소고기볶음밥 1그릇이 352 킬로칼로리이니 0.5그릇은 352의 0.5배예요.", "음식별로 구한 열량을 모두 더해요."],
      render: (b, a) => quiz(b, a, [
        { q: "먹은 음식의 열량은 어떻게 구하나요?", o: ["음식별 열량과 먹은 음식의 양을 곱해요", "음식별 열량에 먹은 양을 더해요", "음식별 열량을 먹은 양만큼 빼요"], a: 0 },
        { q: "소고기볶음밥 0.5그릇의 열량을 구하는 식은?", o: ["352×0.5", "352+0.5", "352−0.5"], a: 0 },
        { q: "점심에 먹은 음식 전체의 열량은 어떻게 구하나요?", o: ["세 음식의 열량을 모두 더해요", "가장 큰 열량만 골라요"], a: 0 }],
        { ok: "음식별 열량과 먹은 양을 곱하고, 그 결과를 모두 더해요." }) },
    { name: "해결해요 ① 점심", inst: "예은이의 점심: 소고기볶음밥 0.5그릇, 단팥도넛 2개, 우유 1.5컵. 식판에 담고 열량을 구한 뒤 적절한 한 끼 식사 열량과 비교해 보세요.", hints: ["0.5그릇은 +0.1을 다섯 번 눌러요.", "352×0.5=176, 142.5×2=285예요.", "67×1.5는 67×15=1005의 [1/10]배예요."],
      render: (b, a) => dm4Meal(b, a, { who: "점심", want: { 0: "0.5", 1: "2", 2: "1.5" },
        asks: () => [["600 킬로칼로리와 비교하면 점심 열량은", { o: ["600 킬로칼로리에 가까우므로 적절해요", "600 킬로칼로리보다 많이 적으므로 적절하지 않아요"], a: 0 }]],
        ok: "점심 열량은 176+285+100.5=561.5 (킬로칼로리)예요. 600 킬로칼로리에 가까우므로 적절해요." }) },
    { name: "해결해요 ② 저녁", inst: "“예은이가 저녁에 먹은 음식의 열량을 구해 보고, 적절한 한 끼 식사 열량과 비교해 봅시다.” 예은이의 저녁: 참치김밥 0.7줄, 꿀떡 3개, 해물된장국 0.5그릇.", hints: ["435×0.7은 435×7=3045의 [1/10]배예요.", "45.6×3=136.8, 56×0.5=28이에요.", "꿀떡 2개의 열량은 45.6×2예요."],
      render: (b, a) => dm4Meal(b, a, { who: "저녁", want: { 3: "0.7", 4: "3", 5: "0.5" },
        asks: () => [["600 킬로칼로리와 비교하면 저녁 열량은", { o: ["600 킬로칼로리에 가까우므로 적절해요", "600 킬로칼로리보다 많이 적으므로 적절하지 않아요"], a: 1 }],
          ["꿀떡 2개의 열량은 45.6×2 =", { n: "91.2", e: "45.6×2" }, "킬로칼로리예요."]],
        ok: "저녁 열량은 304.5+136.8+28=469.3 (킬로칼로리)예요. 600 킬로칼로리보다 많이 적어요. 꿀떡을 2개 정도 더 먹어도 되겠어요." }) },
    { name: "되돌아봐요", inst: "문제를 해결한 과정을 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "음식의 열량을 어떻게 구했는지 설명해 보세요.", tag: "해결 방법", ph: "예) 음식별 열량과 먹은 양을 곱한 뒤 모두 더했어요." },
        { q: "저녁 식사를 적절하게 하려면 어떻게 바꾸면 좋을지 써 보세요.", tag: "바꾸기", ph: "예) 꿀떡을 2개 더 먹으면 469.3+91.2=560.5 (킬로칼로리)가 돼요." }]) }
  ],
  challenge: { inst: "음식별 열량 표를 보고 나만의 한 끼 식단을 짜 보세요. 열량의 합이 550 킬로칼로리 이상 650 킬로칼로리 이하가 되게 음식과 양을 정하고, 열량을 계산해 보세요.", hints: ["음식을 두 가지 이상 고르고 양을 정해요.", "참치김밥 1줄(435)에 해물된장국 1그릇(56)과 우유 1컵(67)을 더하면 558이에요.", "계산이 복잡하면 계산기를 써도 돼요."],
    render: (b, a) => dm4Meal(b, a, { who: "나만의 한 끼", want: null, lo: "550", hi: "650",
      ok: "나만의 한 끼 식단을 600 킬로칼로리에 가깝게 짰어요!" }) }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 땅을 차지해 볼까요", soop: "발표하기(P)",
  question: "소수의 곱셈을 정확하게 계산하여 땅을 많이 차지해 볼까요?",
  summary: "두 사람이 번갈아 바둑돌을 튕겨 도착한 칸의 소수의 곱셈을 계산하고, 곱이 맞으면 땅을 색칠해요. 보너스 칸도 색칠하고, 연못·놀이판 밖·색칠된 땅은 색칠하지 못해요. 색칠한 칸마다 1점, 가로나 세로로 2칸 연속이면 2점, 3칸이면 5점, 4칸 이상이면 7점을 더 얻어요.",
  steps: [
    { name: "놀이 방법 알기", inst: "놀이 방법을 읽고 답해 보세요. ① 서로 다른 색의 색연필을 고르고 가위바위보로 순서를 정해요. ② 자기 차례에 출발 위치를 골라 바둑돌을 ‘출발’에 놓고 손가락으로 튕겨요. ③ 바둑돌이 도착한 칸의 식을 계산해요(선에 걸치면 바둑돌이 가장 많이 차지한 칸). ④ 다른 사람은 계산기로 확인해요. 곱이 맞으면 땅을 색칠하고, 틀리면 순서가 넘어가요. ⑤ 2~4를 10회 반복해요. ⑥ 칸 수와 연속 칸으로 점수를 세요.", hints: ["보너스에 들어가면 계산하지 않고 색칠해요.", "연못, 놀이판 밖, 색칠된 땅에 들어가면 색칠하지 못해요.", "2칸 연속 2점, 3칸 연속 5점, 4칸 이상 연속 7점을 더 얻어요."],
      render: (b, a) => quiz(b, a, [
        { q: "땅을 색칠할 수 있는 경우를 모두 골라 보세요.", o: ["도착한 칸의 곱을 맞게 계산했을 때", "보너스에 들어갔을 때", "연못에 들어갔을 때", "놀이판 밖으로 넘어갔을 때", "색칠된 땅에 들어갔을 때"], a: [0, 1] },
        { q: "가로로 3칸을 연속으로 색칠하면 추가 점수는 몇 점인가요?", o: ["2점", "5점", "7점"], a: 1 },
        { q: "놀이에서 이기려면 어떻게 해야 할까요?", o: ["소수의 곱셈을 정확하게 계산하고, 연속으로 칸을 차지하도록 바둑돌을 잘 튕겨요", "계산은 대충 하고 바둑돌을 세게만 튕겨요"], a: 0 }],
        { ok: "곱을 정확하게 계산하고, 연속으로 땅을 차지하도록 잘 튕기면 점수를 많이 얻어요." }) },
    { name: "놀이판 식 계산하기", inst: "놀이판에 있는 식을 미리 계산해 보세요. 어림해서 곱의 소수점 위치가 알맞은지도 확인해요.", hints: ["4.5×2.7은 45×27=1215의 [1/100]배예요.", "0.6×0.07은 6×7=42에서 소수점 아래 자리 수가 1+2=3(자리)예요.", "3.6×1.25는 36×125=4500의 [1/1000]배예요."],
      render: (b, a) => dm4Sent(b, a, [
        ["4.5×2.7 =", { n: "12.15", e: "4.5×2.7" }],
        ["0.12×6 =", { n: "0.72", e: "0.12×6" }],
        ["12×0.25 =", { n: "3", e: "12×0.25" }],
        ["0.6×0.07 =", { n: "0.042", e: "0.6×0.07", why: { "0.42": "소수점 아래 자리 수가 1+2=3(자리)예요." } }],
        ["3.6×1.25 =", { n: "4.5", e: "3.6×1.25" }]],
      { ok: "4.5×2.7=12.15, 0.12×6=0.72, 12×0.25=3, 0.6×0.07=0.042, 3.6×1.25=4.5예요. 4.500처럼 써도 같은 수예요." }) },
    { name: "점수 세기", inst: "놀이가 끝난 판이에요. 연두와 주황이 얻은 점수를 세어 보세요. 색칠한 칸마다 1점, 가로나 세로로 연속인 칸이 2칸이면 2점, 3칸이면 5점, 4칸 이상이면 7점을 더 얻어요(한 칸이 가로·세로 묶음에 함께 들어가도 돼요).", hints: ["연두: 맨 윗줄 가로 3칸(5점), 맨 아랫줄 가로 2칸(2점), 세 번째 세로줄 3칸(5점)이 있어요.", "주황: 네 번째 세로줄 3칸(5점), 다섯 번째 세로줄 2칸(2점), 세 번째 줄 가로 2칸(2점)이 있어요."],
      render: (b, a) => {
        const rows = ["GGGO.", "O.GO.", ".PGOO", "GG..O"], own = rows.join("").split("").map(c => c === "G" ? 0 : c === "O" ? 1 : null);
        const g = dm4RunScore(own, 4, 5, 0), o = dm4RunScore(own, 4, 5, 1);
        return dm4Sent(b, a, [
          { fig: () => h("div", { class: "dm4fig", style: "max-width:26em" }, dm4MiniBoard(rows)) },
          ["연두(초록): 색칠한 칸", { n: String(g.cells), s: 1 }, "칸, 추가 점수", { n: String(g.bonus), s: 1 }, "점, 모두", { n: String(g.total), s: 1 }, "점"],
          ["주황: 색칠한 칸", { n: String(o.cells), s: 1 }, "칸, 추가 점수", { n: String(o.bonus), s: 1 }, "점, 모두", { n: String(o.total), s: 1 }, "점"],
          ["이긴 사람은", { o: ["연두", "주황"], a: g.total > o.total ? 0 : 1 }]],
          { ok: `연두는 ${g.cells}+${g.bonus}=${g.total}(점), 주황은 ${o.cells}+${o.bonus}=${o.total}(점)이에요. 연속으로 차지하면 점수가 많이 올라가요.` });
      } },
    { name: "땅따먹기 놀이", inst: "짝과 함께 놀이해 보세요. 출발선 위에서 바둑돌을 원하는 곳으로 옮기고, 바둑돌을 아래로 당겼다 놓으면 반대쪽으로 날아가요. 도착한 칸의 곱을 쓰면 계산기로 확인해 줘요.", hints: ["바둑돌을 조금 당기면 가까이, 많이 당기면 멀리 날아가요.", "연속으로 칸을 차지할 수 있는 곳을 노려 봐요.", "곱의 소수점 위치는 어림해서 확인해요."],
      render: (b, a) => dm4Land(b, a, { turns: 10, ok: "놀이를 끝까지 했어요! 정확하게 계산해야 땅을 차지할 수 있었지요?" }) },
    { name: "되돌아보기", inst: "놀이를 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 계산하기 어려웠던 식과 그 식을 계산한 방법을 써 보세요.", tag: "계산", ph: "예) 0.6×0.07은 6×7=42에서 소수점 아래 자리 수가 3자리라서 0.042예요." },
        { q: "점수를 더 얻으려면 어떻게 하면 좋을지 써 보세요.", tag: "전략", ph: "예) 내가 색칠한 칸 옆을 노려서 연속으로 차지해요." }]) }
  ],
  challenge: { inst: "또 다른 놀이: 카드 짝 맞추기예요. 곱의 소수점 위치 규칙을 알 수 있는 곱셈 카드 16장이 뒤집혀 있어요. 두 장을 뒤집어 계산 결과가 같으면 가져가요.", hints: ["357×0.1은 소수점을 왼쪽으로 한 자리 옮긴 35.7이에요.", "3.57×100은 소수점을 오른쪽으로 두 자리 옮긴 357이에요.", "뒤집었던 카드의 자리와 식을 기억해 두면 짝을 빨리 찾을 수 있어요."],
    render: (b, a) => dm4Memory(b, a, { ok: "곱의 소수점 위치 규칙으로 카드의 짝을 모두 찾았어요!" }) }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "소수의 곱셈을 어림하고 계산할 수 있나요?",
  summary: "(소수)×(자연수), (자연수)×(소수), (소수)×(소수)는 분수의 곱셈으로 나타내거나 자연수의 곱셈을 이용하여 계산해요. 곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을 옮겨요. 어림셈으로 계산 결과가 알맞은지 확인해요.",
  steps: [
    { name: "그림 보고 계산하기", inst: "수직선에서 0.4씩 4번 뛰어 세어 0.4×4를 구해 보세요.", hints: ["0.4는 작은 눈금 4칸이에요.", "0.4+0.4+0.4+0.4를 계산해요."],
      render: (b, a) => dm4Jump(b, a, { to: "2", minor: "0.1", step: "0.4", hops: 4,
        asks: [["0.4×4 =", { n: "1.6", e: "0.4×4", why: { "0.16": "0.1이 16개인 수예요." } }]],
        ok: "0.4씩 4번 뛰어 세면 1.6이에요. 0.4×4=1.6이에요." }) },
    { name: "계산하기", inst: "계산해 보세요.", hints: ["3.59×6.3은 359×63=22617의 [1/1000]배예요.", "1.2×7은 12×7=84의 [1/10]배예요.", "12×0.3은 12×3=36의 [1/10]배예요."],
      render: (b, a) => dm4Vert(b, a, { probs: [{ a: "3.59", b: "6.3" }],
        rows: [["1.2×7 =", { n: "8.4", e: "1.2×7" }, ", 12×0.3 =", { n: "3.6", e: "12×0.3" }]],
        ok: "3.59×6.3=22.617, 1.2×7=8.4, 12×0.3=3.6이에요!" }) },
    { name: "소수점 위치와 크기 비교", inst: "곱의 소수점 위치를 생각하여 답해 보세요.", hints: ["98×47=4606이에요. 각 식의 소수점 아래 자리 수를 더해 봐요.", "5×2.75=13.75, 8.6×1.4=12.04예요.", "돗자리의 넓이는 가로×세로예요. 3×2=6으로 어림해 봐요."],
      render: (b, a) => dm4Sent(b, a, [
        ["98×47=4606이에요. 곱이 다른 하나는", { o: ["㉠ 9.8×4.7", "㉡ 9.8×0.47", "㉢ 98×0.47", "㉣ 0.98×47"], a: 1, why: { "0": "9.8×4.7=46.06이에요.", "2": "98×0.47=46.06이에요.", "3": "0.98×47=46.06이에요." } }],
        ["5×2.75 =", { n: "13.75", e: "5×2.75" }, ", 8.6×1.4 =", { n: "12.04", e: "8.6×1.4" }, "→ 5×2.75", { o: [">", "=", "<"], a: 0 }, "8.6×1.4"],
        ["가로 3.04 m, 세로 2 m인 직사각형 모양 돗자리의 넓이는", { n: "6.08", e: "3.04×2" }, "m²예요."]],
      { ok: "곱이 다른 하나는 ㉡ 9.8×0.47=4.606이에요. 13.75>12.04, 돗자리의 넓이는 6.08 m²예요." }) },
    { name: "어림하여 해결하기", inst: "물음에 답해 보세요.", hints: ["4에 1보다 작은 수를 곱하면 4보다 작아요.", "주아가 산 세제는 2 L의 1.4배예요.", "3500×2.8은 3500×28=98000의 [1/10]배예요."],
      render: (b, a) => dm4Sent(b, a, [
        { fig: () => dm4Talk([["예린:", "나는 물 4 L를 가지고 있어."], ["윤호:", "나는 예린이가 가지고 있는 물의 0.89배만큼 가지고 있어."], ["가은:", "나는 예린이가 가지고 있는 물의 1.01배만큼 가지고 있어."]]) },
        ["가장 적은 양의 물을 가지고 있는 사람은", { o: ["예린", "윤호", "가은"], a: 1, why: { "2": "1.01은 1보다 커요. 4×1.01은 4보다 커요.", "0": "윤호는 4에 1보다 작은 0.89를 곱한 만큼 가지고 있어요." } }],
        ["까닭: 1보다 작은 수를 곱하면 계산 결과는 곱해지는 수보다", { o: ["작아져요", "커져요"], a: 0 }],
        { q: "어느 가게에서는 빈 세제 통을 가져오면 세제를 1 L당 3500원에 팔아요. 은찬이는 세제를 2 L 샀고, 주아는 은찬이가 산 양의 1.4배만큼 샀어요.", p: ["주아가 산 세제는", { n: "2.8", e: "2×1.4" }, "L이고, 가격은", { n: "9800", e: "3500×2.8" }, "원이에요."] }],
      { ok: "윤호는 4×0.89=3.56 (L)로 가장 적어요. 주아가 산 세제는 2.8 L, 9800원이에요." }) },
    { name: "확인하고 정리해요", inst: "배운 내용을 정리해 보세요.", hints: ["1.37=[137/100], 1.49=[149/100], 1.4=[14/10]이에요.", "3.2는 32에서 소수점이 왼쪽으로 한 자리, 0.16은 16에서 두 자리 옮겨졌어요."],
      render: (b, a) => dm4Sent(b, a, [
        ["(소수)×(자연수): 1.37×2 = [137/100]×2 =", { f: ["274", "100"] }, "=", { n: "2.74", e: "1.37×2" }],
        ["(자연수)×(소수): 4×1.3 = 4×[13/10] =", { f: ["52", "10"] }, "=", { n: "5.2", e: "4×1.3" }],
        ["(소수)×(소수): 1.49×1.4 = [149/100]×[14/10] =", { f: ["2086", "1000"] }, "=", { n: "2.086", e: "1.49×1.4" }],
        ["곱의 소수점 위치: 32×16=512, 32×1.6=51.2, 3.2×1.6=5.12 → 3.2×0.16 =", { n: "0.512", e: "3.2×0.16" }],
        ["소수의 곱셈은 분수의 곱셈으로 나타내거나", { o: ["자연수의 곱셈", "소수의 덧셈"], a: 0 }, "을 이용하여 계산해요."],
        ["곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을", { o: ["옮겨요", "그대로 둬요"], a: 0 }]],
      { ok: "소수의 곱셈을 모두 정리했어요! 다음 시간에는 직육면체를 공부해요." }) }
  ],
  challenge: { inst: "어림셈으로 곱의 크기를 먼저 생각해 보고, 자연수의 곱에 곱의 소수점을 찍어 보세요.", hints: ["4.9×3.2는 앞자리 수로 어림하면 4×3=12이고, 실제로는 12보다 커요.", "2.49×3은 2.5×3=7.5쯤이에요.", "3.7×3.2는 4×3=12쯤이에요."],
    render: (b, a) => dm4Point(b, a, { items: [{ e: "4.9×3.2" }, { e: "2.49×3" }, { e: "3.7×3.2" }],
      asks: [
        ["4.9×3.2를 앞자리 수로 어림하면 4×3 =", { n: "12" }, "이므로 곱은 12보다", { o: ["커요", "작아요"], a: 0 }],
        ["햄버거 한 개가 2.49달러일 때 3개의 값을 2×3=6달러로 어림하면 실제 값보다", { o: ["부족해요", "많아요"], a: 0 }]],
      ok: "4.9×3.2=15.68, 2.49×3=7.47, 3.7×3.2=11.84예요. 어림셈으로 곱의 소수점 위치가 알맞은지 확인할 수 있어요." }) }
}
];
