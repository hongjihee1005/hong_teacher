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
  const lockBtn = h("button", { class: "big", onclick: () => {
    if (locked) return;
    const items = [...tray.entries()].filter(([, v]) => v > 0n).sort((a, b) => a[0] - b[0]);
    if (opt.want) {
      const keys = Object.keys(opt.want).map(Number);
      const wrong = keys.find(k => tray.get(k) !== dm4P(opt.want[k])) ;
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
  body.append(h("div", { class: "dm4say" }, "카드 두 장을 뒤집어 곱이 같으면 가져가요. 다르면 다시 뒤집어 놓아요."), h("div", { class: "dm4mem" }, btns), say, list);
  api.provide({ words: ["곱의 소수점 위치", "오른쪽으로", "왼쪽으로"], answers: DM4MEM.map(([a, b]) => `${a} = ${b} = ${dm4V(a)}`) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (got < DM4MEM.length) return api.fail(`아직 짝을 다 찾지 않았어요. (${got}/${DM4MEM.length}쌍)`, `${got}쌍`);
    api.tryOnce(); api.done(`카드 ${flips}번 뒤집어 8쌍`, opt && opt.ok);
  } }, "확인하기")));
}
