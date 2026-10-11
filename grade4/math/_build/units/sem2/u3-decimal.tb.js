//@@APP
const APP={title:"할아버지 댁 소수의 덧셈과 뺄셈", unit:"4-2 수학 3. 소수의 덧셈과 뺄셈(교과서)", key:"t42-decimal-v1", welcome:"할아버지 댁 소수의 덧셈과 뺄셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 할아버지 댁에 간 재윤이와 함께 보리의 키·산책로 거리·토끼의 무게를 소수로 나타내고, 우유·대추·지팡이로 소수를 더하고 빼 봐요."};
//@@UNIT
/* ===== 3. 소수의 덧셈과 뺄셈 단원 조작 부품 (앞글자 c3) =====
   수는 모두 1000배 한 정수(0.001이 몇 개인지)로 계산해서 소수 계산 오차가 없어요.
   글 속 분수 표기: [17/100], [1 76/100] → 화면에서 위아래로 쌓은 분수로 보여 줘요. */

/*c3-core*/
const C3D = "영일이삼사오육칠팔구";
function c3Norm(s) { return String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/[．。·]/g, ".").replace(/^\+/, ""); }
/* "0.5"·".5"·"5."·"1.20" → 0.001이 몇 개인지(정수), 수가 아니면 null */
function c3P(s) {
  s = c3Norm(s);
  if (!/^\d*\.?\d*$/.test(s) || !/\d/.test(s)) return null;
  const [i, d = ""] = s.split(".");
  if (d.length > 3 && /[1-9]/.test(d.slice(3))) return null;
  return (+(i || "0")) * 1000 + +((d + "000").slice(0, 3));
}
/* 0.001의 개수 → 가장 짧은 소수 글 */
function c3F(n) { const i = Math.floor(n / 1000), f = n % 1000; return f ? i + "." + String(f).padStart(3, "0").replace(/0+$/, "") : String(i); }
/* 소수 d자리로 맞춘 글(끝자리 0 포함) */
function c3Fd(n, d) { const i = Math.floor(n / 1000), f = String(n % 1000).padStart(3, "0").slice(0, d); return d ? i + "." + f : String(i); }
function c3Dn(s) { const m = c3Norm(s).match(/\.(\d+)/); return m ? m[1].length : 0; }
/* 식 계산: "1.82+0.5", "0.5+0.5+0.8−1.5" (덧셈·뺄셈만) */
function c3E(e) {
  const t = String(e).replace(/−/g, "-").replace(/\s/g, ""), tk = t.match(/[+-]|[\d.]+/g);
  if (!tk || tk.join("") !== t) return null;
  let acc = c3P(tk[0]); if (acc == null) return null;
  for (let k = 1; k < tk.length; k += 2) { const v = c3P(tk[k + 1]); if (v == null) return null; acc = tk[k] === "+" ? acc + v : acc - v; }
  return acc;
}
/* 받침에 맞는 조사: 수는 마지막 숫자 읽기로(0은 영·십·백·천 모두 받침) */
function c3J(s, pair) {
  const str = String(s), c = str[str.length - 1];
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"], "이라": ["이라", "라"] };
  const [a, b] = M[pair];
  if (pair === "으로") return str + (has && !rieul ? a : b);
  return str + (has ? a : b);
}
/* 수 읽기: 8848 → 팔천팔백사십팔, "1.76" → 일 점 칠육, "0.17" → 영 점 일칠 */
function c3Int4(n) { const u = ["천", "백", "십", ""]; let s = ""; String(n).padStart(4, "0").split("").forEach((c, i) => { const d = +c; if (d) s += (d === 1 && i < 3 ? "" : C3D[d]) + u[i]; }); return s; }
function c3Int(n) { if (!n) return "영"; const man = Math.floor(n / 10000), r = n % 10000; return (man ? (man === 1 ? "" : c3Int4(man)) + "만" : "") + (r ? c3Int4(r) : ""); }
function c3Read(str) { const s = c3Norm(str), [i, d] = s.split("."); return c3Int(+(i || 0)) + (d ? " 점 " + d.split("").map(c => C3D[+c]).join("") : ""); }
/* 흔한 실수 찾기 (두 수의 덧셈·뺄셈) */
function c3Digits(s, D) { const [i, d = ""] = c3Norm(s).split("."); return (i || "0") + d.padEnd(D, "0"); }
function c3Diag(e, v) {
  if (!e || v == null) return null;
  const m = String(e).replace(/−/g, "-").replace(/\s/g, "").match(/^([\d.]+)([+-])([\d.]+)$/); if (!m) return null;
  const A = m[1], B = m[3], op = m[2], ok = c3E(e), da = c3Dn(A), db = c3Dn(B), D = Math.max(da, db);
  if (v === ok) return null;
  if (da !== db) { // 오른쪽 끝을 맞춘 계산
    const ia = +c3Norm(A).replace(".", ""), ib = +c3Norm(B).replace(".", ""), r = op === "+" ? ia + ib : ia - ib;
    if (r >= 0 && v === r * Math.pow(10, 3 - D)) return "소수점의 위치를 맞추지 않고 오른쪽 끝을 맞추어 계산했어요. 소수점끼리 세로로 나란히 맞추어 써야 해요.";
  }
  for (let k = 1; k <= 3; k++) { const p = Math.pow(10, k); if (v === ok * p || v * p === ok) return "숫자는 맞는데 소수점 자리가 달라요. 소수점을 그대로 내려 찍어요."; }
  const a = c3Digits(A, D), b = c3Digits(B, D), L = Math.max(a.length, b.length), pa = a.padStart(L, "0"), pb = b.padStart(L, "0");
  if (op === "+") {
    const nc = pa.split("").map((c, i) => (+c + +pb[i]) % 10).join("");
    if (v === +nc * Math.pow(10, 3 - D)) return "같은 자리 수끼리의 합이 10이거나 10보다 크면 바로 윗자리로 1을 받아올림해요.";
  } else {
    const nb = pa.split("").map((c, i) => Math.abs(+c - +pb[i])).join("");
    if (v === +nb * Math.pow(10, 3 - D)) return "작은 수에서 큰 수를 뺄 수 없을 때는 큰 수에서 작은 수를 빼면 안 돼요. 바로 윗자리에서 받아내림해요.";
  }
  return null;
}
/* 분수 표기 */
const C3FR = "\\[(?:(\\d+) )?(\\d+)\\/(\\d+)\\]";
const c3Re = () => new RegExp(C3FR, "g");
function c3Plain(s) { return String(s == null ? "" : s).replace(c3Re(), (m, w, n, d) => `${w ? c3J(w, "과와") + " " : ""}${d}분의 ${n}`); }
/*c3-core-end*/

function c3Style() {
  if (document.getElementById("c3-style")) return;
  const s = document.createElement("style"); s.id = "c3-style";
  s.textContent = `
.c3fr{display:inline-flex;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.05;font-family:Jua,sans-serif;white-space:nowrap}
.c3fw{margin-right:.1em}
.c3q{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;font-size:.8em}
.c3q>.c3n{border-bottom:.11em solid currentColor;padding:0 .14em .05em}
.c3q>.c3d{padding:.05em .14em 0}
.c3row{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .4em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.08);margin:.4em 0;line-height:1.8}
.c3row .c3lead{color:var(--pine)}
input.c3in{box-sizing:border-box;width:4.8em;height:1.7em;padding:0 .2em;margin:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.05);border:2px solid var(--line);border-radius:.35em;background:#fff;color:var(--ink)}
input.c3in.c3w{width:8.5em}
.c3chs{display:inline-flex;gap:.25em;flex-wrap:wrap;background:#F2F5F4;border-radius:.6em;padding:.1em .25em}
.c3chs .opt{padding:.05em .55em}
.opt.c3on{border-color:var(--ring);background:var(--ring-soft)}
.c3q2{font-family:Jua,sans-serif;margin-top:.55em}
.c3grp{border:2px solid var(--line);border-radius:.8em;padding:.35em .7em;margin:.45em 0}
.c3gt{font-family:Jua,sans-serif;color:var(--night)}
.c3ask{margin-top:.5em;border-top:2px dashed var(--line);padding-top:.3em}
.c3stage svg{width:100%;height:auto;max-height:60vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r);touch-action:none}
.c3stage.c3sm svg{max-height:40vh}
.c3figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,13em),1fr));gap:.6em;margin:.3em 0}
.c3figs>div{min-width:0;text-align:center;font-family:Jua,sans-serif}
.c3figs svg{width:100%;height:auto;display:block;max-height:46vh;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.c3fig svg{width:100%;height:auto;display:block;max-height:44vh;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
.c3tools{display:flex;flex-wrap:wrap;gap:.4em;align-items:center;margin:.4em 0}
.c3tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .75em;font-family:Jua,sans-serif}
.c3tools button:disabled{opacity:.45}
.c3say{font-family:Jua,sans-serif;color:var(--night);font-size:calc(var(--fs)*1.08);margin:.3em 0}
.c3say b{color:var(--ring);font-weight:400}
.c3pnl{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15em),1fr));gap:.6em}
.c3pnl>div{min-width:0}
.c3cap{font-family:Jua,sans-serif;color:var(--night);margin:.15em 0}
.c3vt{border-collapse:collapse;font-family:Jua,sans-serif;font-size:calc(var(--fs)*2);margin:.3em 0}
.c3vt td{width:1.45em;height:1.55em;text-align:center;padding:0;line-height:1}
.c3vt td.c3dc{width:.7em}
.c3vt tr.c3sum td{border-top:3px solid var(--ink);padding-top:.12em}
.c3vt input{box-sizing:border-box;width:1.3em;height:1.4em;font-size:.85em;text-align:center;font-family:Jua,sans-serif;border:2px solid var(--line);border-radius:.3em;padding:0;background:#fff;color:var(--ink)}
.c3vt tr.c3cy input{width:1.15em;height:1.1em;font-size:.5em;border-style:dashed;color:var(--no)}
.c3vt .c3pad{color:#AEBBB5}
.c3vt button.c3db{width:.75em;height:1.4em;border:2px dashed var(--ring);border-radius:.3em;background:#fff;font-size:.9em;padding:0;line-height:1;color:var(--ink)}
.c3vt button.c3db.c3dn{border-style:solid;border-color:var(--pine)}
.c3pv{border-collapse:collapse;font-family:Jua,sans-serif;margin:.3em 0;max-width:100%}
.c3pv th,.c3pv td{border:2px solid var(--line);padding:.2em .45em;text-align:center}
.c3pv th{background:var(--pine-soft);font-weight:400;font-size:.8em}
.c3pv th button{font-family:Jua,sans-serif;border:2px solid var(--line);background:#fff;border-radius:.5em;padding:.1em .4em;font-size:1em}
.c3pv th button.c3nx{border-color:var(--ring);background:var(--ring-soft)}
.c3pv td{font-size:calc(var(--fs)*1.3);min-width:2em}
.c3pv td.c3same{background:#E6F3EC}
.c3pv td.c3diff{background:#FFE9C7}
.c3pv td.c3ghost{color:#AEBBB5}
.c3pv tr.c3res td{font-size:var(--fs-s);color:var(--pine)}
.c3cards{display:flex;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.c3cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2em;text-align:center}
.c3cards .opt:disabled{opacity:.3}
.c3slots{display:flex;gap:.35em;margin:.4em 0;flex-wrap:wrap}
.c3slot{min-width:1.9em;height:2.1em;border:2px dashed var(--ring);border-radius:.4em;background:#fff;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);padding:0 .2em;color:var(--ink)}
.c3menu{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,9.5em),1fr));gap:.45em;margin:.3em 0}
.c3menu .opt{text-align:center;font-family:Jua,sans-serif}
.c3menu .opt small{display:block;color:var(--muted);font-family:"Gowun Dodum",sans-serif;font-size:.8em}
.c3talk{border-left:5px solid var(--pine);background:#F4FAF6;border-radius:.5em;padding:.35em .8em;margin:.35em 0}
.c3talk p{margin:.2em 0}
.c3talk b{color:var(--pine);font-family:Jua,sans-serif;font-weight:400}
.c3plate{border:3px dashed var(--line);border-radius:1.5em;min-height:3em;padding:.4em .7em;display:flex;flex-wrap:wrap;gap:.35em;align-items:center;font-family:Jua,sans-serif}
.c3plate span.c3fd{background:#FFF1D6;border-radius:.6em;padding:.1em .6em}
.c3teams{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,10.5em),1fr));gap:.5em;margin:.4em 0}
.c3teams .opt{text-align:center;font-family:Jua,sans-serif}
.c3teams .opt small{display:block;font-family:"Gowun Dodum",sans-serif;font-size:.78em;color:var(--muted)}
.c3cond{display:inline-block;border:3px solid var(--night);border-radius:.6em;background:#fff;padding:.2em .8em;font-family:Jua,sans-serif;color:var(--night)}
.c3big{font-family:Jua,sans-serif;font-size:calc(var(--fs)*2);letter-spacing:.06em;color:var(--night)}
.c3pair{display:flex;flex-wrap:wrap;gap:.8em;margin:.4em 0}
.c3pair .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.6);min-width:4.5em;text-align:center}
.c3fx{display:inline-block;background:var(--pine-soft);color:var(--pine);border-radius:.5em;padding:0 .5em;font-size:.85em}
`;
  document.head.append(s);
}
/* 분수 모양 요소와 글 속 분수 바꾸기 */
function c3FracEl(w, n, d) {
  return h("span", { class: "c3fr" }, w ? h("span", { class: "c3fw" }, String(w)) : null,
    h("span", { class: "c3q" }, h("span", { class: "c3n" }, String(n)), h("span", { class: "c3d" }, String(d))));
}
function c3RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("/") < 0 || s.indexOf("[") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow,input")) return;
  const re = c3Re(); let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(c3FracEl(m[1], m[2], m[3])); last = m.index + m[0].length; }
  if (!any) return;
  if (last < s.length) frag.append(s.slice(last));
  p.replaceChild(frag, node);
}
function c3RenderNode(n) {
  if (!n) return;
  if (n.nodeType === 3) return c3RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = [];
  while (tw.nextNode()) list.push(tw.currentNode);
  list.forEach(c3RenderText);
}
(function c3Boot() {
  c3Style();
  try {
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") c3RenderText(m.target); else m.addedNodes.forEach(c3RenderNode); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 관찰자를 못 쓰면 글로 보여요 */ }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(c3Plain(t)); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
function c3A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: (info && info.words) || [], answers: ((info && info.answers) || []).map(c3Plain) }) }); }
const c3Quiz0 = quiz, c3Blanks0 = blanks;
quiz = (b, a, items, o) => c3Quiz0(b, c3A(a), items, o);
blanks = (b, a, parts, o) => c3Blanks0(b, c3A(a), parts, o);

const C3C = { one: "#8FB8E8", t: "#F4A7B9", h: "#A9D8A2", k: "#F6C08A", add: "#9CC6EC", line: "#C9D4CF", dark: "#7A8C86" };
/* SVG 쌓은 분수 */
function c3SvgFr(x, y, n, d, size = 20, fill = INK) {
  const g = svgEl("g", { "pointer-events": "none" }), w = Math.max(String(n).length, String(d).length) * size * .6 + 6;
  g.append(txt(x, y - size * .62, String(n), size, { fill }), svgEl("line", { x1: x - w / 2, y1: y, x2: x + w / 2, y2: y, stroke: fill, "stroke-width": 2 }), txt(x, y + size * .66, String(d), size, { fill }));
  return g;
}

/* ===== 묻는 칸 만들기 (모든 부품이 함께 씀) =====
   줄(parts): "글" | {n:"0.17", e:"식", why:{"틀린 값":"까닭"}, show} 수 칸 | {t:["영 점 일칠"], why} 글 칸 | {o:[…], a, why:{번호:"까닭"}} 고르기 | {m:[…], a:[번호…]} 여러 개 고르기 | {el: () => 요소} */
function c3Reg() { return { items: [], plain: [] }; }
function c3Parts(parts, reg) {
  const row = h("div", { class: "c3row" }); const plain = [];
  parts.forEach(pt => {
    if (pt == null) return;
    if (typeof pt === "string" || typeof pt === "number") { row.append(h("span", {}, String(pt))); plain.push(c3Plain(String(pt))); return; }
    if (pt.el) { row.append(pt.el()); return; }
    if (pt.n != null) {
      const want = c3P(pt.n); if (want == null) throw new Error("답 형식 오류: " + pt.n);
      if (pt.e) { const v = c3E(pt.e); if (v !== want) throw new Error(`답 확인 필요: ${pt.e} = ${pt.n} (계산 ${v == null ? "?" : c3F(v)})`); }
      const inp = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "c3in" + (pt.w ? " c3w" : ""), "aria-label": "빈칸" });
      row.append(inp); reg.items.push({ k: "n", pt, inp, want }); plain.push(pt.show || String(pt.n)); return;
    }
    if (pt.t) {
      const inp = h("input", { type: "text", autocomplete: "off", class: "c3in c3w", "aria-label": "빈칸" });
      row.append(inp); reg.items.push({ k: "t", pt, inp }); plain.push(pt.t[0]); return;
    }
    if (pt.o || pt.m) {
      const multi = !!pt.m, list = pt.o || pt.m, sel = new Set(), box = h("span", { class: "c3chs" });
      list.forEach((o, i) => box.append(h("button", { class: "opt", onclick: ev => {
        if (multi) { sel.has(i) ? sel.delete(i) : sel.add(i); ev.currentTarget.classList.toggle("c3on"); }
        else { sel.clear(); sel.add(i); [...box.children].forEach(b => b.classList.remove("c3on")); ev.currentTarget.classList.add("c3on"); }
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
function c3Rows(rows, reg) {
  const wrap = h("div");
  rows.forEach(r => {
    if (Array.isArray(r)) return wrap.append(c3Parts(r, reg));
    if (r.g) { const g = h("div", { class: "c3grp" }, h("div", { class: "c3gt" }, r.g)); g.append(c3Rows(r.rows, reg)); wrap.append(g); return; }
    if (r.fig) wrap.append(r.fig());
    if (r.q) wrap.append(h("div", { class: "c3q2" }, r.q));
    if (r.p) wrap.append(c3Parts(r.p, reg));
  });
  return wrap;
}
/* 채점: 처음 틀린 곳의 까닭을 돌려줘요 */
function c3Judge(reg, opt = {}) {
  let bad = null; const given = [];
  reg.items.forEach(it => {
    const pt = it.pt;
    if (it.k === "n") {
      const raw = it.inp.value.trim(), v = c3P(raw), ok = v != null && v === it.want;
      it.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; given.push(raw || "-");
      if (!ok && !bad) bad = raw === "" ? "빈칸에 답을 써요." : v == null ? "칸에는 수만 써요. 소수는 0.5처럼 써요." :
        (pt.why && pt.why[c3F(v)]) || c3Diag(pt.e, v) || pt.bad || opt.bad || "빨간 칸을 다시 생각해 봐요.";
      return;
    }
    if (it.k === "t") {
      const raw = it.inp.value.trim(), n = raw.replace(/\s/g, ""), ok = pt.t.some(x => x.replace(/\s/g, "") === n);
      it.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; given.push(raw || "-");
      if (!ok && !bad) bad = raw === "" ? "빈칸에 답을 써요." : (pt.why && pt.why[n]) || pt.bad || "읽는 말을 다시 살펴봐요. 소수점 아래는 숫자를 하나씩 읽어요.";
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
/* ① 빈칸 줄 문제 */
function c3Sent(body, api, rows, opt = {}) {
  c3Style();
  const reg = c3Reg();
  if (opt.fig) body.append(opt.fig());
  body.append(c3Rows(rows, reg));
  api.provide({ words: opt.words || [], answers: reg.plain.filter(Boolean) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const r = c3Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, r.given);
    api.tryOnce(); api.done(r.given, opt.ok);
  } }, "확인하기")));
}

/* ===== 모눈종이·막대 그림 =====
   모눈 하나는 1, 세로 한 줄(0.1)씩 왼쪽부터, 한 줄 안에서는 위 칸(0.01)부터, 칸 안은 위 가는 줄(0.001)부터 칠해요. */
function c3GridDraw(g, x0, y0, S, v, opt = {}) {
  const c = S / 10, div = opt.div || 100, sl = c / 10;
  g.append(svgEl("rect", { x: x0, y: y0, width: S, height: S, fill: "#fff" }));
  const cols = Math.floor(v / 100), cells = Math.floor((v % 100) / 10), sls = v % 10;
  const ct = opt.mono || C3C.t, ch = opt.mono || C3C.h, ck = opt.mono || C3C.k;
  if (v >= 1000) g.append(svgEl("rect", { x: x0, y: y0, width: S, height: S, fill: opt.full || opt.mono || C3C.t }));
  else {
    if (cols) g.append(svgEl("rect", { x: x0, y: y0, width: cols * c, height: S, fill: ct }));
    if (cells) g.append(svgEl("rect", { x: x0 + cols * c, y: y0, width: c, height: cells * c, fill: ch }));
    if (sls) g.append(svgEl("rect", { x: x0 + cols * c, y: y0 + cells * c, width: c, height: sls * sl, fill: ck }));
  }
  if (div >= 1000) for (let k = 1; k < 100; k++) if (k % 10) g.append(svgEl("line", { x1: x0, y1: y0 + k * sl, x2: x0 + S, y2: y0 + k * sl, stroke: "#E6ECE9", "stroke-width": .6 }));
  for (let k = 1; k < 10; k++) {
    if (div >= 10) g.append(svgEl("line", { x1: x0 + k * c, y1: y0, x2: x0 + k * c, y2: y0 + S, stroke: C3C.dark, "stroke-width": 1.2 }));
    if (div >= 100) g.append(svgEl("line", { x1: x0, y1: y0 + k * c, x2: x0 + S, y2: y0 + k * c, stroke: "#9AABA4", "stroke-width": .9 }));
  }
  g.append(svgEl("rect", { x: x0, y: y0, width: S, height: S, fill: "none", stroke: INK, "stroke-width": 2.5 }));
}
/* 모눈 그림(여러 장 + 확대) : v는 0.001의 개수 */
function c3GridSvg(v, opt = {}) {
  const S = 300, gap = 26, n = Math.max(1, Math.ceil(v / 1000)), zoom = opt.div === 1000 && v % 10 && opt.zoom !== false;
  const W = 20 + n * (S + gap) - gap + (zoom ? 170 : 0) + 20, H = S + (opt.cap ? 64 : 40);
  const svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
  for (let k = 0; k < n; k++) {
    const part = Math.min(1000, v - k * 1000), x0 = 20 + k * (S + gap);
    c3GridDraw(g, x0, 20, S, Math.max(0, part), opt);
    if (opt.cap) g.append(txt(x0 + S / 2, S + 46, typeof opt.cap === "function" ? opt.cap(k) : opt.cap, 22, { fill: INK }));
  }
  if (zoom) {
    const last = v % 1000, cols = Math.floor(last / 100), cells = Math.floor((last % 100) / 10), sls = last % 10;
    const xk = 20 + (n - 1) * (S + gap) + cols * 30, yk = 20 + cells * 30, zx = W - 170, zy = 60, Z = 130;
    g.append(svgEl("rect", { x: xk - 1, y: yk - 1, width: 32, height: 32, fill: "none", stroke: C3C.dark, "stroke-width": 2.5, "stroke-dasharray": "4 3" }),
      svgEl("line", { x1: xk + 31, y1: yk, x2: zx, y2: zy, stroke: C3C.dark, "stroke-dasharray": "4 3" }), svgEl("line", { x1: xk + 31, y1: yk + 31, x2: zx, y2: zy + Z, stroke: C3C.dark, "stroke-dasharray": "4 3" }),
      svgEl("rect", { x: zx, y: zy, width: Z, height: Z, fill: "#fff" }), svgEl("rect", { x: zx, y: zy, width: Z, height: sls * Z / 10, fill: opt.mono || C3C.k }));
    for (let k = 1; k < 10; k++) g.append(svgEl("line", { x1: zx, y1: zy + k * Z / 10, x2: zx + Z, y2: zy + k * Z / 10, stroke: "#9AABA4" }));
    g.append(svgEl("rect", { x: zx, y: zy, width: Z, height: Z, fill: "none", stroke: INK, "stroke-width": 2 }), txt(zx + Z / 2, zy - 22, "0.01 한 칸 확대", 18, { fill: C3C.dark }));
  }
  if (opt.label) svg.setAttribute("aria-label", opt.label);
  return svg;
}
function c3Fig(svg, cls) { return h("div", { class: cls || "c3fig" }, svg); }
/* 모눈 여러 장 나란히: list = [{v, cap, div, mono}] */
function c3GridFigs(list) { return h("div", { class: "c3figs" }, list.map(it => h("div", {}, c3GridSvg(it.v, it), it.t ? h("div", {}, it.t) : null))); }
/* 색 안내 */
function c3Legend(keys) {
  const L = { one: ["1", C3C.one], t: ["0.1", C3C.t], h: ["0.01", C3C.h], k: ["0.001", C3C.k] };
  return h("div", { class: "c3row", style: "font-size:var(--fs-s)" }, keys.map(k => h("span", {}, h("span", { style: `display:inline-block;width:1em;height:1em;border-radius:.2em;vertical-align:middle;margin-right:.25em;background:${L[k][1]}` }, "​"), L[k][0])));
}

/* ===== ② 칠하기 (막대·모눈) =====
   opt.panels = [{kind:"bar"|"grid"|"col", pre, target, label, end:"1 L", color}], opt.asks = 줄 묶음 */
function c3Fill(body, api, opt) {
  c3Style();
  if (opt.fig) body.append(opt.fig());
  const P = opt.panels.map(p => Object.assign({ pre: 0 }, p, { n: p.pre || 0 }));
  const wrap = h("div", { class: "c3pnl" });
  P.forEach(p => {
    const bar = p.kind === "bar", M = bar ? 10 : 100, unit = p.kind === "col" ? 10 : 1;
    const W = bar ? 660 : 340, H = bar ? 130 : 340, svg = makeSvg(W, H), g = svgEl("g"); svg.append(g);
    const say = h("div", { class: "c3cap" }, "​");
    const paint = () => {
      g.innerHTML = "";
      if (bar) {
        const c = 60;
        for (let k = 0; k < 10; k++) g.append(svgEl("rect", { x: 30 + k * c, y: 30, width: c, height: 54, fill: k < p.pre ? (p.preColor || C3C.t) : k < p.n ? (p.color || C3C.add) : "#fff", stroke: C3C.dark, "stroke-width": 1.5 }));
        g.append(svgEl("rect", { x: 30, y: 30, width: 600, height: 54, fill: "none", stroke: INK, "stroke-width": 2.5 }), txt(30, 108, "0", 20), txt(630, 108, p.end || "1", 20));
      } else {
        const c = 30, x0 = 20, y0 = 20;
        g.append(svgEl("rect", { x: x0, y: y0, width: 300, height: 300, fill: "#fff" }));
        for (let k = 0; k < 100; k++) {
          if (k >= p.n) break;
          const col = Math.floor(k / 10), row = k % 10;
          g.append(svgEl("rect", { x: x0 + col * c, y: y0 + row * c, width: c, height: c, fill: k < p.pre ? (p.preColor || C3C.h) : (p.color || C3C.add) }));
        }
        for (let k = 1; k < 10; k++) g.append(svgEl("line", { x1: x0 + k * c, y1: y0, x2: x0 + k * c, y2: y0 + 300, stroke: C3C.dark, "stroke-width": 1.2 }), svgEl("line", { x1: x0, y1: y0 + k * c, x2: x0 + 300, y2: y0 + k * c, stroke: "#9AABA4" }));
        g.append(svgEl("rect", { x: x0, y: y0, width: 300, height: 300, fill: "none", stroke: INK, "stroke-width": 2.5 }));
      }
      say.textContent = `${p.label ? p.label + " · " : ""}${p.pre ? `더 칠한 칸 ${p.n - p.pre}칸 (모두 ${p.n}칸)` : `칠한 칸 ${p.n / unit}${p.kind === "col" ? "줄" : "칸"}`}`;
    };
    const idxAt = pt => {
      if (bar) { const k = Math.floor((pt.x - 30) / 60); return pt.y < 20 || pt.y > 95 || k < 0 || k > 9 ? null : k; }
      const col = Math.floor((pt.x - 20) / 30), row = Math.floor((pt.y - 20) / 30);
      if (col < 0 || col > 9 || row < 0 || row > 9) return null;
      return p.kind === "col" ? col * 10 + 9 : col * 10 + row;
    };
    let downK = null;
    dragOn(svg, pt => {
      const k = idxAt(pt); if (k == null) return false;
      downK = k; let nn = k + 1; if (nn === p.n) nn = p.kind === "col" ? k - 9 : k;
      p.n = Math.max(p.pre, Math.min(M, nn)); paint();
    }, pt => { const k = idxAt(pt); if (k == null || k === downK) return; downK = k; const nn = Math.max(p.pre, k + 1); if (nn !== p.n) { p.n = nn; paint(); } });
    paint();
    wrap.append(h("div", {}, p.title ? h("div", { class: "c3cap" }, p.title) : null, h("div", { class: "c3stage c3sm" }, svg), say));
  });
  const reg = c3Reg();
  const asks = opt.asks ? h("div", { class: "c3ask" }, c3Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "c3say" }, opt.tip || "칸을 누르거나 끌어서 칠해요. 칠한 마지막 칸을 다시 누르면 한 칸 지워져요."), wrap, asks);
  api.provide({ words: opt.words || [], answers: P.map(p => `${p.label || ""} ${p.target}칸`).concat(reg.plain) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const wrong = P.find(p => p.n !== p.target);
    const got = P.map(p => p.n).join(",");
    if (wrong) return api.fail(wrong.why || `${wrong.label ? wrong.label + ": " : ""}${wrong.n > wrong.target ? "너무 많이 칠했어요." : "덜 칠했어요."} 한 칸이 얼마를 나타내는지 생각해 봐요.`, "칠한 칸 " + got);
    const r = c3Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, "칠한 칸 " + got + " / " + r.given);
    api.tryOnce(); api.done("칠한 칸 " + got + (r.given ? " / " + r.given : ""), opt.ok);
  } }, "확인하기")));
}

/* ===== 수직선 그림 ===== */
function c3LineDraw(g, o) {
  const X = v => o.x0 + (v - o.from) / (o.to - o.from) * o.len, y = o.y;
  g.append(svgEl("line", { x1: X(o.from) - 8, y1: y, x2: X(o.to) + 18, y2: y, stroke: INK, "stroke-width": 2.5 }),
    svgEl("path", { d: `M${X(o.to) + 26} ${y} l-10 -6 v12 z`, fill: INK }));
  for (let v = o.from; v <= o.to; v += o.minor) {
    const maj = (v - (o.base || 0)) % o.major === 0, mid = o.mid && (v - (o.base || 0)) % o.mid === 0;
    const L = maj ? 18 : mid ? 12 : 8;
    g.append(svgEl("line", { x1: X(v), y1: y - L, x2: X(v), y2: y + L, stroke: INK, "stroke-width": maj ? 2.2 : 1.3 }));
    if (maj && (!o.labels || o.labels.includes(v))) g.append(txt(X(v), y + 38, c3F(v) + (v === o.to && o.unit ? " " + o.unit : ""), o.fs || 20, { fill: INK }));
    if (o.fracs && maj && v > o.from && v < o.to) g.append(c3SvgFr(X(v), y - 46, Math.round((v - o.from) / o.major), Math.round((o.to - o.from) / o.major), 16, C3C.dark));
  }
  return X;
}
/* 확대 수직선 그림: 위 줄(from~to)과 그 첫 칸을 다시 10칸으로 나눈 아래 줄 */
function c3ZoomSvg(o) {
  const svg = makeSvg(1000, 300), g = svgEl("g"); svg.append(g);
  const X1 = c3LineDraw(g, { x0: 60, len: 860, y: 90, from: o.from, to: o.to, minor: o.step, major: o.step, fracs: o.fracs, unit: o.unit });
  const z0 = o.from, z1 = o.from + o.step;
  g.append(svgEl("rect", { x: X1(z0), y: 70, width: X1(z1) - X1(z0), height: 40, fill: "#FFE9C7", opacity: .7 }));
  const X2 = c3LineDraw(g, { x0: 60, len: 860, y: 225, from: z0, to: z1, minor: o.step / 10, major: o.step, unit: o.unit });
  g.append(svgEl("line", { x1: X1(z0), y1: 110, x2: X2(z0), y2: 205, stroke: C3C.dark, "stroke-dasharray": "5 4" }), svgEl("line", { x1: X1(z1), y1: 110, x2: X2(z1), y2: 205, stroke: C3C.dark, "stroke-dasharray": "5 4" }));
  const a = X2(z0), b = X2(z0 + o.step / 10);
  g.append(svgEl("path", { d: `M${a} 196 Q${(a + b) / 2} 176 ${b} 196`, fill: "none", stroke: C3C.no || "#C8472E", "stroke-width": 2.5 }), txt((a + b) / 2 + 40, 172, "한 칸 = ?", 20, { fill: "#C8472E" }));
  return svg;
}

/* ===== ③ 수직선에서 화살표 옮기기 =====
   opt: {from, to, minor, major, mid, labels, start, target, unit, deco:{kind:"barley"|"walk", at}, asks, fracs} (수는 0.001의 개수) */
function c3Line(body, api, opt) {
  c3Style();
  if (opt.fig) body.append(opt.fig());
  const svg = makeSvg(1000, 210), g = svgEl("g"), top = svgEl("g"); svg.append(g, top);
  const o = Object.assign({ x0: 60, len: 860, y: 140 }, opt);
  const X = c3LineDraw(g, o);
  if (opt.deco && opt.deco.kind === "barley") {
    const x1 = X(opt.deco.at), x0 = X(0);
    g.append(svgEl("path", { d: `M${x0} 66 L${x1 - 26} 66`, stroke: "#6BA35A", "stroke-width": 5, fill: "none" }));
    [0.25, 0.5, 0.75].forEach((f, i) => { const xx = x0 + (x1 - 26 - x0) * f; g.append(svgEl("path", { d: `M${xx} 66 q 22 ${i % 2 ? 18 : -18} 46 ${i % 2 ? 6 : -6}`, stroke: "#6BA35A", "stroke-width": 4, fill: "none" })); });
    g.append(svgEl("ellipse", { cx: x1 - 13, cy: 66, rx: 14, ry: 7, fill: "#D9B85C" }), svgEl("line", { x1: x1 - 1, y1: 66, x2: x1, y2: 66, stroke: "#B08A2E", "stroke-width": 2 }),
      svgEl("line", { x1: x1, y1: 58, x2: x1, y2: 126, stroke: "#B08A2E", "stroke-width": 1.5, "stroke-dasharray": "3 3" }), txt((x0 + x1) / 2, 36, "보리", 20, { fill: "#4E7F40" }));
  }
  if (opt.deco && opt.deco.kind === "walk") {
    const x1 = X(opt.deco.at);
    g.append(svgEl("circle", { cx: x1, cy: 66, r: 11, fill: "#F2C9A0", stroke: INK, "stroke-width": 1.5 }), svgEl("path", { d: `M${x1} 77 v24 M${x1} 86 l-12 8 M${x1} 86 l12 6 M${x1} 101 l-10 16 M${x1} 101 l10 16`, stroke: INK, "stroke-width": 3, fill: "none" }),
      txt(x1 + 52, 60, "재윤", 18, { fill: C3C.dark }));
  }
  let pos = opt.start != null ? opt.start : opt.from;
  const base = opt.start != null ? opt.start : opt.from;
  const say = h("div", { class: "c3say" }, "​");
  const draw = () => {
    top.innerHTML = "";
    const xs = X(base), xp = X(pos), yy = o.y - 34;
    if (pos !== base) {
      const dir = pos > base ? 1 : -1;
      top.append(svgEl("line", { x1: xs, y1: yy, x2: xp - dir * 12, y2: yy, stroke: "#C8472E", "stroke-width": 4 }), svgEl("path", { d: `M${xp} ${yy} l${-dir * 14} -8 v16 z`, fill: "#C8472E" }));
    }
    if (opt.start != null) top.append(svgEl("circle", { cx: xs, cy: o.y, r: 7, fill: "#2B7BD6" }));
    top.append(svgEl("path", { d: `M${xp} ${o.y - 4} l-13 -22 h26 z`, fill: "#2B7BD6", stroke: "#fff", "stroke-width": 2 }));
    const n = Math.round(Math.abs(pos - base) / opt.minor);
    say.innerHTML = "";
    say.append(opt.start != null ? `${c3F(base)}에서 ${pos >= base ? "오른쪽" : "왼쪽"}으로 작은 눈금 ` : `${c3F(base)}에서 오른쪽으로 작은 눈금 `, h("b", {}, String(n)), "칸");
  };
  const snap = v => Math.max(opt.from, Math.min(opt.to, opt.from + Math.round((v - opt.from) / opt.minor) * opt.minor));
  const inv = x => opt.from + (x - o.x0) / o.len * (opt.to - opt.from);
  dragOn(svg, pt => { pos = snap(inv(pt.x)); draw(); }, pt => { pos = snap(inv(pt.x)); draw(); });
  const tools = h("div", { class: "c3tools" },
    h("button", { onclick: () => { pos = snap(pos - opt.minor); draw(); } }, "◀ 한 칸"), h("button", { onclick: () => { pos = snap(pos + opt.minor); draw(); } }, "한 칸 ▶"),
    h("button", { onclick: () => { pos = base; draw(); } }, "처음으로"));
  draw();
  const reg = c3Reg();
  const asks = opt.asks ? h("div", { class: "c3ask" }, c3Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "c3say" }, opt.tip || "파란 표시를 끌거나 수직선을 눌러 옮겨요. ◀ ▶ 단추로 한 칸씩 옮길 수도 있어요."), h("div", { class: "c3stage" }, svg), say, tools, asks);
  api.provide({ words: opt.words || [], answers: [`화살표를 ${c3F(opt.target)}에`].concat(reg.plain) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (pos !== opt.target) return api.fail(opt.why || (pos === base ? "먼저 파란 표시를 옮겨 봐요." : `작은 눈금 한 칸이 ${c3J(c3F(opt.minor), "이에요")}. 몇 칸 옮겨야 하는지 다시 세어 봐요.`), "화살표 " + c3F(pos));
    const r = c3Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, "화살표 " + c3F(pos) + " / " + r.given);
    api.tryOnce(); api.done("화살표 " + c3F(pos) + (r.given ? " / " + r.given : ""), opt.ok);
  } }, "확인하기")));
}

/* ===== ④ 모눈에 수 만들기 (1·0.1·0.01·0.001 단추) ===== opt: {target:"1.76", units:[1000,100,10,1], div, asks} */
function c3Build(body, api, opt) {
  c3Style();
  if (opt.fig) body.append(opt.fig());
  const target = c3P(opt.target), units = opt.units || [1000, 100, 10], max = opt.max || 2999;
  let v = 0;
  const figBox = h("div", { class: "c3stage c3sm" }), say = h("div", { class: "c3say" }, "​");
  const NM = { 1000: "1", 100: "0.1", 10: "0.01", 1: "0.001" };
  const draw = () => {
    figBox.innerHTML = ""; figBox.append(c3GridSvg(Math.max(v, 0), { div: opt.div || 100, full: C3C.one }));
    const a = Math.floor(v / 1000), b = Math.floor(v % 1000 / 100), c = Math.floor(v % 100 / 10), d = v % 10;
    say.innerHTML = ""; say.append(...[[1000, a], [100, b], [10, c], [1, d]].filter(([u]) => units.includes(u)).map(([u, n], i) => h("span", {}, (i ? ", " : "") + NM[u] + "이 ", h("b", {}, String(n)), "개")));
  };
  const tools = h("div", { class: "c3tools" }, units.map(u => [h("button", { onclick: () => { if (v + u <= max) { v += u; draw(); } } }, `+ ${NM[u]}`), h("button", { onclick: () => { if (v - u >= 0) { v -= u; draw(); } } }, `− ${NM[u]}`)]).flat(),
    h("button", { onclick: () => { v = 0; draw(); } }, "처음으로"));
  draw();
  const reg = c3Reg();
  const asks = opt.asks ? h("div", { class: "c3ask" }, c3Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "c3say" }, opt.tip || "단추를 눌러 모눈을 칠해요. 모눈 한 장 전체가 1이에요."), opt.legend ? c3Legend(opt.legend) : null, tools, figBox, say, asks);
  api.provide({ words: opt.words || [], answers: [`모눈에 ${opt.target}만큼`].concat(reg.plain) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (v !== target) return api.fail(opt.why || (v > target ? "모눈에 칠한 수가 더 커요. 덜어 내 봐요." : "모눈에 칠한 수가 더 작아요. 더 칠해 봐요."), "모눈 " + c3F(v));
    const r = c3Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, "모눈 " + c3F(v) + " / " + r.given);
    api.tryOnce(); api.done("모눈 " + c3F(v) + (r.given ? " / " + r.given : ""), opt.ok);
  } }, "확인하기")));
}

/* ===== ⑤ 자리마다 차례대로 비교하기 ===== opt: {a:"2.136", b:"2.135", la, lb} */
function c3Cmp(body, api, opt) {
  c3Style();
  const A = c3Norm(opt.a), B = c3Norm(opt.b), va = c3P(A), vb = c3P(B), D = Math.max(c3Dn(A), c3Dn(B), 1);
  const sign = va > vb ? ">" : va < vb ? "<" : "=";
  const NAMES = ["자연수 부분", "소수 첫째 자리", "소수 둘째 자리", "소수 셋째 자리"].slice(0, D + 1);
  const part = (s, k) => { const [i, d = ""] = s.split("."); return k === 0 ? i : d[k - 1]; };
  let next = 0, found = null, pick = null;
  const ths = NAMES.map((nm, k) => h("button", { onclick: () => click(k) }, nm));
  const rowA = NAMES.map((_, k) => h("td", {}, part(A, k) == null ? "​" : (k === 0 ? part(A, k) + "." : part(A, k))));
  const rowB = NAMES.map((_, k) => h("td", {}, part(B, k) == null ? "​" : (k === 0 ? part(B, k) + "." : part(B, k))));
  const rowR = NAMES.map(() => h("td", {}, "​"));
  const tbl = h("table", { class: "c3pv" }, h("tr", {}, h("th", {}, "​"), ths.map(b => h("th", {}, b))),
    h("tr", {}, h("th", {}, opt.la || "㉮"), rowA), h("tr", {}, h("th", {}, opt.lb || "㉯"), rowB), h("tr", { class: "c3res" }, h("th", {}, "비교"), rowR));
  const say = h("div", { class: "c3say" }, "​");
  const signBox = h("div", { class: "c3row hidden" }, h("span", {}, `${A} `), h("span", { class: "c3chs" }, [">", "=", "<"].map(s => h("button", { class: "opt", onclick: ev => { pick = s; [...ev.currentTarget.parentNode.children].forEach(b => b.classList.remove("c3on", "good", "bad")); ev.currentTarget.classList.add("c3on"); } }, s))), h("span", {}, ` ${B}`));
  const mark = () => ths.forEach((b, k) => b.classList.toggle("c3nx", k === next && found == null));
  function click(k) {
    if (found != null) return;
    if (k !== next) { api.hint(`높은 자리부터 차례대로 비교해요. 지금은 ‘${NAMES[next]}’${c3J(NAMES[next], "을를").slice(-1)} 누를 차례예요.`); return; }
    const x = part(A, k), y = part(B, k), xs = x == null ? "0" : x, ys = y == null ? "0" : y;
    if (x == null) { rowA[k].textContent = "0"; rowA[k].classList.add("c3ghost"); }
    if (y == null) { rowB[k].textContent = "0"; rowB[k].classList.add("c3ghost"); }
    const cx = +xs, cy = +ys;
    [rowA[k], rowB[k]].forEach(td => td.classList.add(cx === cy ? "c3same" : "c3diff"));
    rowR[k].textContent = cx === cy ? "같아요" : `${xs} ${cx > cy ? ">" : "<"} ${ys}`;
    if (cx !== cy || k === NAMES.length - 1) { found = k; signBox.classList.remove("hidden"); say.textContent = cx !== cy ? `${NAMES[k]}에서 크기가 정해졌어요. 알맞은 기호를 골라요.` : "모든 자리가 같아요. 알맞은 기호를 골라요."; }
    else { next = k + 1; say.textContent = `${c3J(NAMES[k], "이가")} 같아요. 다음 자리를 눌러요.`; }
    mark();
  }
  mark();
  body.append(h("div", { class: "c3say" }, "자릿값 표의 이름 단추를 높은 자리부터 차례대로 눌러 두 수를 비교해요."), h("div", { style: "overflow-x:auto" }, tbl), say, signBox);
  api.provide({ words: ["자연수 부분", "소수 첫째 자리", "소수 둘째 자리", "소수 셋째 자리"], answers: [`${A} ${sign} ${B}`] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (found == null) return api.fail("자릿값 표의 이름 단추를 높은 자리부터 눌러 비교해요.", "-");
    if (pick == null) return api.fail("두 수 사이에 들어갈 기호를 골라요.", "-");
    const btn = [...signBox.querySelectorAll(".opt")].find(b => b.textContent === pick);
    if (pick !== sign) { btn.classList.add("bad"); return api.fail(opt.why || "크기가 정해진 자리의 숫자를 다시 견주어 봐요. 그 자리 숫자가 큰 수가 더 커요.", `${A} ${pick} ${B}`); }
    btn.classList.add("good"); api.tryOnce(); api.done(`${A} ${pick} ${B}`, opt.ok || `${c3J(`${A} ${sign} ${B}`, "이에요")}. 높은 자리부터 차례대로 비교했어요!`);
  } }, "확인하기")));
}

/* ===== ⑥ 10배·1/10 판: 소수점은 그대로, 숫자가 움직여요 ===== opt: {starts:["0.716","3.5"], need:["7.16",…], asks} */
function c3Shift(body, api, opt) {
  c3Style();
  const PL = [3, 2, 1, 0, -1, -2, -3], NM = ["천", "백", "십", "일", "소수\n첫째", "소수\n둘째", "소수\n셋째"];
  const cw = 92, dotW = 34, X = p => { const i = 3 - p; return 30 + i * cw + (p < 0 ? dotW : 0) + cw / 2; };
  const W = 30 + 7 * cw + dotW + 30, svg = makeSvg(W, 220), bg = svgEl("g"), fg = svgEl("g"), grp = svgEl("g"); svg.append(bg, fg, grp);
  PL.forEach((p, i) => {
    const x = X(p) - cw / 2;
    bg.append(svgEl("rect", { x, y: 70, width: cw, height: 110, fill: p >= 0 ? "#F4F7F5" : "#FFF7EA", stroke: C3C.line, "stroke-width": 2 }));
    NM[i].split("\n").forEach((t, j, arr) => bg.append(txt(X(p), 30 + j * 22 - (arr.length - 1) * 8 + 8, t, 18, { fill: C3C.dark })));
  });
  bg.append(svgEl("circle", { cx: X(0) + cw / 2 + dotW / 2, cy: 160, r: 8, fill: "#C8472E" }));
  let v = 0, hist = [];
  const sig = val => { // 0.001의 개수 → 자리별 숫자(0이 아닌 가장 높은 자리 ~ 가장 낮은 자리)
    const s = String(val); const out = []; // val = 수×1000
    for (let k = 0; k < s.length; k++) out.push({ d: s[k], p: s.length - 1 - k - 3 });
    let lo = out.length - 1; while (lo > 0 && out[lo].d === "0") lo--;
    return out.slice(0, lo + 1);
  };
  const say = h("div", { class: "c3say" }, "​"), histBox = h("div", { class: "c3row" }, "​");
  const show = () => {
    const ds = sig(v); grp.innerHTML = ""; fg.innerHTML = "";
    ds.forEach(o => grp.append(txt(X(o.p), 130, o.d, 52, { fill: INK })));
    const hi = ds[0].p, lo = ds[ds.length - 1].p;
    for (let p = 0; p > hi; p--) fg.append(txt(X(p), 130, "0", 52, { fill: "#AEBBB5" }));
    for (let p = lo - 1; p >= 0; p--) fg.append(txt(X(p), 130, "0", 52, { fill: "#AEBBB5" }));
    say.innerHTML = ""; say.append("지금 수: ", h("b", {}, c3F(v)));
    histBox.textContent = hist.length > 1 ? hist.join(" ") : "​";
  };
  let timer = 0;
  const move = (old, dir) => { // 숫자마다 제자리에서 한 자리 옮겨 가는 모습
    clearTimeout(timer); grp.innerHTML = ""; fg.innerHTML = "";
    const els = sig(old).map(o => { const t = txt(X(o.p), 130, o.d, 52, { fill: INK }); t.style.transition = "transform .45s ease"; grp.append(t); return { t, dx: X(o.p + dir) - X(o.p) }; });
    void svg.getBoundingClientRect();
    requestAnimationFrame(() => els.forEach(e => { e.t.style.transform = `translate(${e.dx}px,0px)`; }));
    timer = setTimeout(show, 500);
    say.innerHTML = ""; say.append("지금 수: ", h("b", {}, c3F(v)));
    histBox.textContent = hist.join(" ");
  };
  const canUp = () => sig(v)[0].p < 3;
  const canDn = () => { const ds = sig(v); return ds[ds.length - 1].p > -3; };
  const done = new Set();
  const start = s => { v = c3P(s); hist = [c3F(v)]; show(); };
  const tools = h("div", { class: "c3tools" },
    ...(opt.starts.length > 1 ? opt.starts.map(s => h("button", { onclick: () => start(s) }, `${s}에서 시작`)) : []),
    h("button", { onclick: () => { if (!canUp()) return api.hint("천의 자리보다 높은 자리는 이 판에 없어요."); const old = v; v = old * 10; hist.push("→(10배)", c3F(v)); done.add(c3F(v)); move(old, 1); } }, "10배"),
    h("button", { onclick: () => { if (!canDn()) return api.hint("소수 셋째 자리보다 낮은 자리는 이 판에 없어요."); const old = v; v = old / 10; hist.push("→([1/10])", c3F(v)); done.add(c3F(v)); move(old, -1); } }, "[1/10]"),
    h("button", { onclick: () => start(hist[0]) }, "처음 수로"));
  start(opt.starts[0]);
  const reg = c3Reg();
  const asks = opt.asks ? h("div", { class: "c3ask" }, c3Rows(opt.asks, reg)) : null;
  body.append(h("div", { class: "c3say" }, opt.tip || "‘10배’, ‘[1/10]’ 단추를 눌러 보세요. 빨간 소수점은 그대로 있고 숫자들이 움직여요."), tools, h("div", { class: "c3stage c3sm" }, svg), say, histBox, asks);
  api.provide({ words: ["왼쪽으로 한 자리", "오른쪽으로 한 자리", "10배", "[1/10]"], answers: reg.plain });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const miss = (opt.need || []).find(s => !done.has(c3F(c3P(s))));
    if (miss) return api.fail(`판에서 단추를 눌러 직접 만들어 보고 써요. 아직 판에서 만들어 보지 않은 수가 있어요.`, "판: " + [...done].join(","));
    const r = c3Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, r.given);
    api.tryOnce(); api.done(r.given, opt.ok);
  } }, "확인하기")));
}

/* ===== ⑦ 세로셈: (자리 맞추기) → 같은 자리끼리 계산 → 소수점 내려 찍기 =====
   opt: {a:"1.82", b:"0.5", op:"+", align:true, pad:true, reason:{q, o, a, why}} */
function c3Vert(body, api, opt) {
  c3Style();
  if (opt.fig) body.append(opt.fig());
  const A = c3Norm(opt.a), B = c3Norm(opt.b), op = opt.op || "+", R = c3E(`${A}${op}${B}`);
  const D = Math.max(c3Dn(A), c3Dn(B)), res = c3Fd(R, D), rI = res.split(".")[0], rD = res.split(".")[1] || "";
  const iLen = s => s.split(".")[0].length, I = Math.max(iLen(A), iLen(B), rI.length);
  const OPS = op === "+" ? "+" : "−", word = op === "+" ? "받아올림" : "받아내림";
  const stage = h("div");
  const reg = c3Reg(); let reasonRow = null;
  if (opt.reason) reasonRow = c3Parts([opt.reason.q, { o: opt.reason.o, a: opt.reason.a, why: opt.reason.why }], reg);
  let aligned = !opt.align;
  /* 1단계: 소수점 맞추기(끌어서 옮기기) */
  function alignPhase() {
    stage.innerHTML = "";
    const cw = 60, cols = I + 1 + D + 4, W = 40 + cols * cw + 40, svg = makeSvg(W, 260), g = svgEl("g"), gb = svgEl("g"); svg.append(g, gb);
    const ca = 2 + (I - iLen(A)); // 0번 칸은 기호 자리
    const colX = c => 40 + c * cw + cw / 2;
    [...A].forEach((ch, k) => g.append(txt(colX(ca + k), 70, ch, 50, { fill: INK })));
    g.append(txt(colX(0), 150, OPS, 46, { fill: INK }), svgEl("line", { x1: 30, y1: 196, x2: W - 30, y2: 196, stroke: INK, "stroke-width": 3 }));
    const aDot = ca + (A.indexOf(".") < 0 ? A.length : A.indexOf(".")), bDotK = B.indexOf(".") < 0 ? B.length : B.indexOf(".");
    const okOff = aDot - bDotK;            // B의 첫 글자가 놓일 칸(맞을 때)
    let off = ca + A.length - B.length;    // 처음엔 오른쪽 끝을 맞춘 자리
    if (off === okOff) off = okOff + 1;
    const lo = 1, hi = cols - B.length;
    off = Math.max(lo, Math.min(hi, off));
    const say = h("div", { class: "c3say" }, "​");
    const draw = (dx = 0) => {
      gb.innerHTML = "";
      gb.append(svgEl("rect", { x: 40 + off * cw + dx - 4, y: 108, width: B.length * cw + 8, height: 76, rx: 12, fill: "#DCEAFB", stroke: "#2B7BD6", "stroke-width": 2 }));
      [...B].forEach((ch, k) => gb.append(txt(colX(off + k) + dx, 150, ch, 50, { fill: INK })));
      say.textContent = off === okOff ? "소수점끼리 세로로 나란해졌어요." : "파란 수 카드를 끌어 옮겨 보세요.";
    };
    g.append(svgEl("line", { x1: colX(aDot), y1: 20, x2: colX(aDot), y2: 240, stroke: "#C8472E", "stroke-width": 1.5, "stroke-dasharray": "6 5" }));
    let sx = null, base = 0;
    dragOn(svg, pt => { if (pt.y < 100 || pt.y > 195) return false; sx = pt.x; base = off; }, pt => { const k = Math.round((pt.x - sx) / cw), no = Math.max(lo, Math.min(hi, base + k)); if (no !== off) { off = no; draw(); } });
    draw();
    const tools = h("div", { class: "c3tools" }, h("button", { onclick: () => { off = Math.max(lo, off - 1); draw(); } }, "◀ 왼쪽으로"), h("button", { onclick: () => { off = Math.min(hi, off + 1); draw(); } }, "오른쪽으로 ▶"));
    const go = h("button", { class: "big", onclick: () => {
      if (reasonRow) { const r = c3Judge(reg); if (r.bad) return api.fail(r.bad, r.given); }
      if (off !== okOff) return api.fail(off === ca + A.length - B.length ? "오른쪽 끝을 맞추면 안 돼요. 소수점끼리 세로로 나란히 맞추어요." : "빨간 점선이 지나는 소수점 자리에 아래 수의 소수점도 오게 옮겨요.", "자리 맞추기");
      aligned = true; calcPhase();
    } }, "자리를 맞췄어요");
    stage.append(h("div", { class: "c3say" }, "① 소수점의 위치를 맞추어 써요. 아래 수(파란 카드)를 끌거나 단추로 옮겨 소수점끼리 맞추어 보세요."), reasonRow || "", h("div", { class: "c3stage c3sm" }, svg), say, tools, h("div", { class: "actions" }, go));
  }
  /* 2단계: 같은 자리 수끼리 계산 → 소수점 내려 찍기 */
  function calcPhase() {
    stage.innerHTML = "";
    const cell = (ch, cls) => h("td", cls ? { class: cls } : {}, ch == null || ch === "" ? "​" : ch);
    const digitsOf = s => { const [i, d = ""] = s.split("."); return { i: i.padStart(I, " "), d }; };
    const da = digitsOf(A), db = digitsOf(B);
    const padCells = [];
    const mkRow = (sign, x, hasDot) => h("tr", {}, cell(sign), [...x.i].map(c => cell(c.trim())), cell(hasDot ? "." : "", "c3dc"),
      Array.from({ length: D }, (_, k) => { if (x.d[k] != null) return cell(x.d[k]); const td = cell("", "c3pad"); padCells.push(td); return td; }));
    const cy = h("tr", { class: "c3cy" }, cell(""), Array.from({ length: I }, () => h("td", {}, h("input", { type: "text", inputmode: "numeric", maxlength: 2, "aria-label": word + " 메모" }))), cell("", "c3dc"),
      Array.from({ length: D }, () => h("td", {}, h("input", { type: "text", inputmode: "numeric", maxlength: 2, "aria-label": word + " 메모" }))));
    const ins = [];
    const mk = () => { const i = h("input", { type: "text", inputmode: "numeric", maxlength: 1, "aria-label": "답 숫자" }); i.addEventListener("input", () => { i.value = i.value.replace(/[^0-9]/g, "").slice(-1); }); ins.push(i); return h("td", {}, i); };
    let dotOn = false;
    const dotBtn = h("button", { class: "c3db", "aria-label": "소수점 찍기", onclick: () => { dotOn = !dotOn; dotBtn.textContent = dotOn ? "." : "​"; dotBtn.classList.toggle("c3dn", dotOn); } }, "​");
    const resRow = h("tr", { class: "c3sum" }, cell(""), Array.from({ length: I }, mk), h("td", { class: "c3dc" }, dotBtn), Array.from({ length: D }, mk));
    const tbl = h("table", { class: "c3vt" }, cy, mkRow("", da, A.includes(".")), mkRow(OPS, db, B.includes(".")), resRow);
    const tools = h("div", { class: "c3tools" });
    if (opt.pad && padCells.length) {
      let on = false;
      tools.append(h("button", { onclick: ev => { on = !on; padCells.forEach(td => { td.textContent = on ? "0" : "​"; }); ev.currentTarget.textContent = on ? "붙인 0 지우기" : "끝자리에 0 붙여 보기"; } }, "끝자리에 0 붙여 보기"));
    }
    stage.append(h("div", { class: "c3say" }, `② 자연수의 ${op === "+" ? "덧셈" : "뺄셈"}과 같이 같은 자리 수끼리 계산해 아래 칸에 써요(${word}한 수는 맨 위 작은 칸에 적어도 돼요). ③ 가운데 점선 칸을 눌러 소수점을 그대로 내려 찍어요.`), h("div", { style: "overflow-x:auto" }, tbl), tools);
    const out = h("div", { class: "c3say hidden" }, "​");
    stage.append(out, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      const iv = ins.slice(0, I).map(x => x.value), dv = ins.slice(I).map(x => x.value);
      const given = iv.join("") + (dotOn ? "." : "") + dv.join("");
      let wrong = false;
      const exI = rI.padStart(I, " ");
      iv.forEach((v, k) => { const e = exI[k].trim(), ok = v === e; ins[k].style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok) wrong = true; });
      dv.forEach((v, k) => { const e = rD[k], trail = rD.slice(k).split("").every(c => c === "0") && dv.slice(k).every(x => x === "" || x === "0"); const ok = v === e || (v === "" && trail); ins[I + k].style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok) wrong = true; });
      if ([...iv, ...dv].every(x => x === "")) return api.fail("아래 칸에 계산한 숫자를 써요.", "-");
      if (wrong) {
        const gv = c3P(given.replace(/\.$/, ""));
        return api.fail((gv != null && c3Diag(`${A}${op}${B}`, dotOn ? gv : null)) || `같은 자리 수끼리 계산했는지, ${word}을 했는지 살펴봐요. 빨간 칸을 다시 계산해요.`, given || "-");
      }
      if (!dotOn) return api.fail("③ 소수점을 그대로 내려 찍어요. 가운데 점선 칸을 눌러요.", given);
      out.textContent = `${A} ${OPS} ${B} = ${c3F(R)}`; out.classList.remove("hidden");
      api.tryOnce(); api.done(`${A}${OPS}${B}=${given}`, opt.ok || `${A} ${OPS} ${B} = ${c3J(c3F(R), "이에요")}. 소수점을 맞추어 쓰고, 같은 자리끼리 계산하고, 소수점을 내려 찍었어요!`);
    } }, "확인하기")));
  }
  api.provide({ words: ["소수점의 위치를 맞추어", "같은 자리 수끼리", word, "소수점을 그대로 내려 찍어요"], answers: reg.plain.concat([`${A} ${OPS} ${B} = ${res}`]) });
  body.append(stage);
  aligned ? calcPhase() : alignPhase();
}

/* ===== ⑧ 수 카드로 소수 만들기 ===== opt: {cards:["2","4","7","."], n:4, check:s => null|"까닭", after:s => 줄 묶음, need} */
function c3Cards(body, api, opt) {
  c3Style();
  const slots = Array(opt.n).fill(null);
  const pool = h("div", { class: "c3cards" }), row = h("div", { class: "c3slots" }), say = h("div", { class: "c3say" }, "​"), more = h("div", { class: "c3ask hidden" });
  let reg = c3Reg(), made = null;
  const cardBtns = opt.cards.map((c, i) => h("button", { class: "opt", onclick: () => { const k = slots.indexOf(null); if (k < 0) return; slots[k] = i; paint(); } }, c));
  pool.append(...cardBtns);
  const slotBtns = slots.map((_, k) => h("button", { class: "c3slot", "aria-label": `${k + 1}번째 칸`, onclick: () => { slots[k] = null; paint(); } }, "​"));
  row.append(...slotBtns);
  function paint() {
    cardBtns.forEach((b, i) => { b.disabled = slots.includes(i); });
    slotBtns.forEach((b, k) => { b.textContent = slots[k] == null ? "​" : opt.cards[slots[k]]; });
    const s = slots.every(x => x != null) ? slots.map(i => opt.cards[i]).join("") : null;
    if (s === made) return;
    made = null; more.innerHTML = ""; more.classList.add("hidden"); reg = c3Reg();
    if (!s) { say.textContent = "카드를 누르면 빈칸에 차례대로 놓여요. 놓인 카드를 누르면 돌아가요."; return; }
    const why = opt.check(s);
    if (why) { say.textContent = "× " + why; return; }
    made = s; say.textContent = `만든 수: ${s}`;
    more.append(c3Rows(opt.after(s), reg)); more.classList.remove("hidden");
  }
  paint();
  body.append(h("div", { class: "c3say" }, opt.tip || "수 카드를 골라 빈칸에 놓아 보세요."), pool, row, say, more);
  api.provide({ words: opt.words || [], answers: [opt.need ? `만든 수 ${opt.need}` : "알맞은 소수를 만들어요"] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (!slots.every(x => x != null)) return api.fail("빈칸을 모두 카드로 채워요.", "-");
    if (!made) return api.fail(opt.check(slots.map(i => opt.cards[i]).join("")), slots.map(i => opt.cards[i]).join(""));
    const r = c3Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, made + " / " + r.given);
    api.tryOnce(); api.done(made + " / " + r.given, typeof opt.ok === "function" ? opt.ok(made) : opt.ok);
  } }, "확인하기")));
}

/* ===== 그림: 사람·할아버지 댁·에베레스트산·지팡이 ===== */
function c3Person(g, x, y, c, s = 1, hair = "#4A3A2E") {
  g.append(svgEl("rect", { x: x - 14 * s, y: y + 14 * s, width: 28 * s, height: 38 * s, rx: 10 * s, fill: c }),
    svgEl("circle", { cx: x, cy: y, r: 14 * s, fill: "#F5D0A9", stroke: INK, "stroke-width": 1.2 }),
    svgEl("path", { d: `M${x - 14 * s} ${y - 2 * s} a${14 * s} ${14 * s} 0 0 1 ${28 * s} 0 q-${14 * s} -${6 * s} -${28 * s} 0z`, fill: hair }),
    svgEl("rect", { x: x - 11 * s, y: y + 50 * s, width: 8 * s, height: 18 * s, fill: "#5C6B7A" }), svgEl("rect", { x: x + 3 * s, y: y + 50 * s, width: 8 * s, height: 18 * s, fill: "#5C6B7A" }));
}
function c3Rabbit(g, x, y, s = 1, c = "#fff") {
  g.append(svgEl("ellipse", { cx: x - 6 * s, cy: y - 22 * s, rx: 4 * s, ry: 12 * s, fill: c, stroke: INK }), svgEl("ellipse", { cx: x + 5 * s, cy: y - 22 * s, rx: 4 * s, ry: 12 * s, fill: c, stroke: INK }),
    svgEl("ellipse", { cx: x + 10 * s, cy: y + 6 * s, rx: 18 * s, ry: 12 * s, fill: c, stroke: INK }), svgEl("circle", { cx: x, cy: y - 4 * s, r: 10 * s, fill: c, stroke: INK }), svgEl("circle", { cx: x - 3 * s, cy: y - 6 * s, r: 1.6 * s, fill: INK }));
}
const C3SCENE = [
  { id: "house", t: "할아버지 댁", say: "할아버지 댁이 보여요. “잘 찾아왔구나!”", box: [20, 40, 250, 200], draw: g => {
    g.append(svgEl("rect", { x: 45, y: 110, width: 190, height: 120, fill: "#F3E2C7", stroke: INK, "stroke-width": 2 }), svgEl("path", { d: "M25 115 L140 45 L255 115 Z", fill: "#B5543C", stroke: INK, "stroke-width": 2 }),
      svgEl("rect", { x: 120, y: 160, width: 40, height: 70, fill: "#8A5A3C" }), svgEl("rect", { x: 62, y: 135, width: 40, height: 32, fill: "#BFE0F5", stroke: INK }), svgEl("rect", { x: 180, y: 135, width: 40, height: 32, fill: "#BFE0F5", stroke: INK })); } },
  { id: "rabbit", t: "할머니가 토끼에게 먹이 주기", say: "할머니께서 토끼에게 먹이를 주려고 해요.", box: [270, 120, 230, 140], draw: g => {
    g.append(svgEl("rect", { x: 330, y: 190, width: 160, height: 60, fill: "none", stroke: "#8A6A52", "stroke-width": 3 }));
    for (let k = 0; k < 7; k++) g.append(svgEl("line", { x1: 330 + k * 26.6, y1: 190, x2: 330 + k * 26.6, y2: 250, stroke: "#8A6A52", "stroke-width": 2 }));
    c3Rabbit(g, 375, 225, .9); c3Rabbit(g, 440, 228, .8, "#EDE7E1"); c3Person(g, 300, 160, "#C77DBA", 1, "#C9C9C9");
    g.append(svgEl("path", { d: "M314 190 l20 -6", stroke: "#E47A38", "stroke-width": 5 })); } },
  { id: "cloth", t: "동생이 천을 자르기", say: "동생이 토끼장에 들어갈 천을 자르고 있어요.", box: [510, 120, 170, 140], draw: g => {
    c3Person(g, 545, 160, "#7EC8A4", .85); g.append(svgEl("rect", { x: 570, y: 200, width: 90, height: 50, fill: "#F7C6D0", stroke: INK }), svgEl("path", { d: "M600 200 v50", stroke: INK, "stroke-dasharray": "5 4" }),
      svgEl("circle", { cx: 596, cy: 190, r: 6, fill: "none", stroke: INK, "stroke-width": 2 }), svgEl("circle", { cx: 608, cy: 190, r: 6, fill: "none", stroke: INK, "stroke-width": 2 })); } },
  { id: "jujube", t: "할아버지의 대추 수확", say: "할아버지께서 대추를 수확하셨어요.", box: [690, 20, 200, 240], draw: g => {
    g.append(svgEl("rect", { x: 760, y: 140, width: 20, height: 110, fill: "#8A5A3C" }), svgEl("circle", { cx: 770, cy: 95, r: 65, fill: "#7FB069" }));
    [[740, 80], [790, 70], [765, 110], [805, 105], [735, 115], [780, 50]].forEach(([x, y]) => g.append(svgEl("ellipse", { cx: x, cy: y, rx: 7, ry: 9, fill: "#B33A2E" })));
    c3Person(g, 845, 170, "#6C8EBF", 1, "#C9C9C9"); g.append(svgEl("path", { d: "M818 228 h40 l-6 22 h-28z", fill: "#D9B85C", stroke: INK })); } },
  { id: "barley", t: "재윤이가 싹 튼 보리 보기", say: "재윤이가 싹을 틔운 보리를 보고 있어요.", box: [20, 270, 300, 150], draw: g => {
    g.append(svgEl("rect", { x: 40, y: 360, width: 210, height: 40, fill: "#A07A55" }));
    for (let k = 0; k < 9; k++) { const x = 55 + k * 23; g.append(svgEl("path", { d: `M${x} 362 q-6 -16 -2 -26 M${x} 362 q6 -14 4 -22`, stroke: "#5FA052", "stroke-width": 3, fill: "none" })); }
    c3Person(g, 285, 320, "#E9A23B", .95); } },
  { id: "cow", t: "젖소", say: "젖소가 보여요. 젖을 짜면 송아지에게 우유를 먹일 수 있어요.", box: [520, 280, 360, 140], draw: g => {
    g.append(svgEl("ellipse", { cx: 680, cy: 350, rx: 80, ry: 40, fill: "#fff", stroke: INK, "stroke-width": 2 }), svgEl("ellipse", { cx: 655, cy: 340, rx: 18, ry: 13, fill: INK }), svgEl("ellipse", { cx: 710, cy: 360, rx: 16, ry: 11, fill: INK }),
      svgEl("ellipse", { cx: 770, cy: 330, rx: 26, ry: 20, fill: "#fff", stroke: INK, "stroke-width": 2 }), svgEl("ellipse", { cx: 790, cy: 338, rx: 10, ry: 8, fill: "#F2B8C6" }));
    [620, 645, 715, 740].forEach(x => g.append(svgEl("rect", { x, y: 380, width: 10, height: 30, fill: "#fff", stroke: INK }))); } }
];
/* ⑨ 그림에서 찾기 */
function c3Find(body, api, opt = {}) {
  c3Style();
  const svg = makeSvg(900, 430), bg = svgEl("g"), marks = svgEl("g"); svg.append(bg);
  bg.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 430, fill: "#EAF5FB" }), svgEl("rect", { x: 0, y: 255, width: 900, height: 175, fill: "#D8EBC8" }));
  const found = new Set(); const say = h("div", { class: "c3say" }, "​"), list = h("div", { class: "c3row" });
  const upd = () => { list.innerHTML = ""; C3SCENE.forEach(it => list.append(h("span", { class: "c3fx", style: found.has(it.id) ? "" : "opacity:.35" }, (found.has(it.id) ? "✓ " : "") + it.t))); };
  C3SCENE.forEach(it => {
    const g = svgEl("g", { style: "cursor:pointer" }); it.draw(g);
    const [x, y, w, hh] = it.box; g.append(svgEl("rect", { x, y, width: w, height: hh, fill: "transparent" }));
    g.addEventListener("click", () => {
      say.textContent = it.say;
      if (found.has(it.id)) return; found.add(it.id);
      marks.append(svgEl("rect", { x: x + 2, y: y + 2, width: w - 4, height: hh - 4, rx: 14, fill: "none", stroke: "#2E8B57", "stroke-width": 4, "stroke-dasharray": "10 6", "pointer-events": "none" }));
      upd();
    });
    bg.append(g);
  });
  svg.append(marks); upd();
  body.append(h("div", { class: "c3say" }, opt.tip || "그림에서 사람들이 하는 일과 동물을 눌러 찾아보세요. 모두 6가지예요."), h("div", { class: "c3stage" }, svg), say, list);
  api.provide({ words: C3SCENE.map(i => i.t), answers: ["그림 속 6가지를 모두 찾아요"] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (found.size < C3SCENE.length) return api.fail(`아직 찾지 못한 것이 ${C3SCENE.length - found.size}가지 있어요. 흐린 이름표를 보고 찾아봐요.`, `찾은 것 ${found.size}개`);
    api.tryOnce(); api.done("6가지 모두 찾음", opt.ok);
  } }, "확인하기")));
}
function c3Everest() {
  const svg = makeSvg(700, 300), g = svgEl("g"); svg.append(g);
  g.append(svgEl("rect", { x: 0, y: 0, width: 700, height: 300, fill: "#E7F2FA" }), svgEl("path", { d: "M40 280 L250 60 L330 140 L420 40 L660 280 Z", fill: "#8AA0B2", stroke: INK, "stroke-width": 2 }),
    svgEl("path", { d: "M370 92 L420 40 L470 92 L445 82 L420 98 L398 84 Z", fill: "#fff" }), svgEl("path", { d: "M215 97 L250 60 L285 95 L262 88 L248 100 Z", fill: "#fff" }),
    svgEl("line", { x1: 560, y1: 40, x2: 560, y2: 280, stroke: "#C8472E", "stroke-width": 3 }), svgEl("path", { d: "M560 40 l-8 14 h16z M560 280 l-8 -14 h16z", fill: "#C8472E" }),
    txt(612, 160, "8848.86 m", 26, { fill: "#C8472E" }), svgEl("path", { d: "M420 40 v-24 l26 8 l-26 8", fill: "#E47A38", stroke: INK, "stroke-width": 1.5 }));
  c3Person(g, 330, 168, "#E47A38", .55);
  return c3Fig(svg);
}
/* 토끼 무게 · 우유 · 대추 · 지팡이 같은 작은 장면 그림 */
function c3Canes() {
  const svg = makeSvg(700, 200), g = svgEl("g"); svg.append(g);
  const X = v => 60 + v * 560;
  [[0.9, "할아버지 지팡이 0.9 m", 60], [0.8, "할머니 지팡이 0.8 m", 140]].forEach(([v, t, y]) => {
    g.append(svgEl("path", { d: `M${X(0)} ${y} H${X(v) - 12} q12 0 12 -14`, stroke: "#8A5A3C", "stroke-width": 9, fill: "none", "stroke-linecap": "round" }), txt(X(0), y - 26, t, 20, { "text-anchor": "start", fill: INK }));
  });
  for (let k = 0; k <= 10; k++) g.append(svgEl("line", { x1: X(k / 10), y1: 172, x2: X(k / 10), y2: k % 5 ? 182 : 188, stroke: INK, "stroke-width": 1.5 }), k % 5 ? svgEl("g") : txt(X(k / 10), 196, k === 10 ? "1 m" : k ? "0.5" : "0", 16));
  g.append(svgEl("line", { x1: X(0), y1: 172, x2: X(1), y2: 172, stroke: INK, "stroke-width": 2 }));
  return c3Fig(svg);
}
/* 음식과 나트륨 */
const C3FOOD = [["새우볶음밥", "0.5"], ["수제비", "0.9"], ["제육덮밥", "0.8"], ["멸치주먹밥", "0.5"], ["햄치즈샌드위치", "0.7"]];
function c3Menu() {
  return h("div", { class: "c3menu" }, C3FOOD.map(([n, g]) => h("div", { class: "opt", style: "cursor:default" }, n, h("small", {}, `나트륨 ${g} g`))));
}
function c3Talk(lines) { return h("div", { class: "c3talk" }, lines.map(([who, t]) => h("p", {}, h("b", {}, who + " "), t))); }
/* ⑩ 접시에 먹은 음식 담기 ===== opt: {who, a:[음식 번호…], asks} */
function c3Plate(body, api, opt) {
  c3Style();
  const sel = new Set(); const plate = h("div", { class: "c3plate" }, "​");
  const menu = h("div", { class: "c3menu" });
  const btns = C3FOOD.map(([n, g], i) => h("button", { class: "opt", onclick: ev => { sel.has(i) ? sel.delete(i) : sel.add(i); ev.currentTarget.classList.toggle("c3on"); paint(); } }, n, h("small", {}, `나트륨 ${g} g`)));
  menu.append(...btns);
  const paint = () => { plate.innerHTML = ""; if (!sel.size) plate.append(h("span", { style: "color:var(--muted)" }, `${opt.who}의 접시가 비어 있어요.`)); [...sel].forEach(i => plate.append(h("span", { class: "c3fd" }, `${C3FOOD[i][0]} ${C3FOOD[i][1]} g`))); };
  paint();
  const reg = c3Reg();
  const asks = opt.asks ? h("div", { class: "c3ask" }, c3Rows(opt.asks, reg)) : null;
  body.append(opt.talk ? c3Talk(opt.talk) : null, h("div", { class: "c3say" }, `오늘 ${opt.who}가 먹은 음식을 모두 눌러 접시에 담아요.`), menu, h("div", { class: "c3cap" }, `${opt.who}의 접시`), plate, asks);
  api.provide({ words: opt.a.map(i => C3FOOD[i][0]), answers: [opt.a.map(i => C3FOOD[i][0]).join(", ")].concat(reg.plain) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const got = [...sel].map(i => C3FOOD[i][0]).join(",");
    if (sel.size !== opt.a.length || !opt.a.every(i => sel.has(i))) return api.fail(`대화를 다시 읽어 봐요. ${opt.who}는 아침·점심·저녁에 무엇을 먹었나요?`, got || "-");
    const r = c3Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, got + " / " + r.given);
    api.tryOnce(); api.done(got + " / " + r.given, opt.ok);
  } }, "확인하기")));
}

/* ⑪ 천 자르기: 크기가 1인 천을 10·100·1000조각으로 */
function c3Cloth(body, api, opt) {
  c3Style();
  const P = [["동생", 10, 100], ["재윤", 100, 10], ["할아버지", 1000, 1]];
  const seen = new Set(), fig = h("div", { class: "c3stage c3sm" }), say = h("div", { class: "c3say" }, "​");
  const show = k => {
    const [who, n, v] = P[k]; seen.add(k);
    fig.innerHTML = ""; fig.append(c3GridSvg(v, { div: n, mono: "#F4A7B9", zoom: n === 1000 }));
    say.innerHTML = ""; say.append(`${who}: 천을 ${n}조각으로 똑같이 나누었어요. 한 조각(색칠한 부분)은 전체의 [1/${n}]이에요.`);
  };
  const tools = h("div", { class: "c3tools" }, P.map(([who, n], k) => h("button", { onclick: () => show(k) }, `${who} · ${n}조각으로 자르기`)));
  fig.append(c3GridSvg(0, { div: 1 }));
  const reg = c3Reg();
  const asks = h("div", { class: "c3ask" }, c3Rows(opt.asks, reg));
  body.append(h("div", { class: "c3say" }, "세 사람의 단추를 하나씩 눌러 크기가 1인 천을 잘라 보세요."), tools, fig, say, asks);
  api.provide({ words: ["0.1", "0.01", "0.001"], answers: reg.plain });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (seen.size < 3) return api.fail("세 사람의 단추를 모두 눌러 잘라 보고 답해요.", "-");
    const r = c3Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, r.given);
    api.tryOnce(); api.done(r.given, opt.ok);
  } }, "확인하기")));
}
/* 1, 0.1, 0.01, 0.001 관계 그림 */
function c3RelSvg() {
  const svg = makeSvg(900, 250), g = svgEl("g"); svg.append(g);
  const V = ["1", "0.1", "0.01", "0.001"], X = k => 110 + k * 225;
  V.forEach((v, k) => g.append(svgEl("rect", { x: X(k) - 70, y: 95, width: 140, height: 62, rx: 12, fill: ["#DCEAFB", "#FBD9E1", "#DFF1DA", "#FDE6CC"][k], stroke: INK, "stroke-width": 2 }), txt(X(k), 127, v, 32)));
  for (let k = 0; k < 3; k++) {
    const a = X(k) + 40, b = X(k + 1) - 40;
    g.append(svgEl("path", { d: `M${a} 90 Q${(a + b) / 2} 30 ${b} 90`, fill: "none", stroke: "#2B7BD6", "stroke-width": 3 }), svgEl("path", { d: `M${b} 90 l-3 -15 l-10 9z`, fill: "#2B7BD6" }));
    g.append(c3SvgFr((a + b) / 2, 34, 1, 10, 18, "#2B7BD6"));
    g.append(svgEl("path", { d: `M${b} 162 Q${(a + b) / 2} 222 ${a} 162`, fill: "none", stroke: "#C8472E", "stroke-width": 3 }), svgEl("path", { d: `M${a} 162 l3 15 l10 -9z`, fill: "#C8472E" }), txt((a + b) / 2, 222, "10배", 20, { fill: "#C8472E" }));
  }
  return c3Fig(svg);
}

/* ⑫ 색칠하기(꼭꼭! 확인하고 정리해요) ===== opt: {items:[{e:"1.2+0.5", c:"#…", name}]} */
function c3Color(body, api, opt) {
  c3Style();
  const IT = opt.items.map(it => Object.assign({}, it, { v: c3E(it.e) }));
  const R = [ // 그림 칸: 해·풀·토끼(귀 둘·얼굴·몸)·당근
    { id: "sun", d: "M40 80 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0z", lx: 90, ly: 80 },
    { id: "earL", d: "M330 150 C290 60 305 10 345 20 C372 30 366 100 360 150 Z", lx: 338, ly: 85 },
    { id: "earR", d: "M450 150 C490 60 475 10 435 20 C408 30 414 100 420 150 Z", lx: 442, ly: 85 },
    { id: "head", d: "M270 215 a120 85 0 1 0 240 0 a120 85 0 1 0 -240 0z", lx: 390, ly: 245 },
    { id: "body", d: "M280 445 q-10 -115 110 -145 q120 30 110 145 z", lx: 390, ly: 385 },
    { id: "carrot", d: "M540 270 h90 l-45 175 z", lx: 585, ly: 305 },
    { id: "grass", d: "M45 445 q30 -90 55 0 q25 -90 55 0 q25 -90 55 0 z", lx: 128, ly: 425 }];
  const labels = opt.labels; // 칸 id → 수 글
  const fills = {}; let cur = 0;
  const svg = makeSvg(700, 460), g = svgEl("g"); svg.append(g);
  const els = {};
  R.forEach(r => {
    const p = svgEl("path", { d: r.d, fill: "#fff", stroke: INK, "stroke-width": 2.5, style: "cursor:pointer" });
    p.addEventListener("click", () => { fills[r.id] = fills[r.id] === cur ? null : cur; paint(); });
    els[r.id] = p; g.append(p);
  });
  R.forEach(r => g.append(txt(r.lx, r.ly, labels[r.id], 26, { "pointer-events": "none" })));
  g.append(svgEl("circle", { cx: 350, cy: 200, r: 6, fill: INK, "pointer-events": "none" }), svgEl("circle", { cx: 430, cy: 200, r: 6, fill: INK, "pointer-events": "none" }));
  const pal = h("div", { class: "c3tools" });
  const pbtn = IT.map((it, k) => h("button", { style: `border-color:${it.c}`, onclick: () => { cur = k; paintPal(); } }, h("span", { style: `display:inline-block;width:1em;height:1em;border-radius:50%;vertical-align:middle;margin-right:.3em;background:${it.c}` }, "​"), it.e.replace("-", "−")));
  pal.append(...pbtn);
  const paintPal = () => pbtn.forEach((b, k) => { b.style.background = k === cur ? "var(--ring-soft)" : "#fff"; b.style.borderWidth = k === cur ? "3px" : "2px"; });
  const paint = () => R.forEach(r => els[r.id].setAttribute("fill", fills[r.id] == null ? "#fff" : IT[fills[r.id]].c));
  paintPal(); paint();
  body.append(h("div", { class: "c3say" }, "식을 하나 골라 계산하고, 그 합이나 차가 적힌 칸을 눌러 그 색으로 칠해요. 다시 누르면 지워져요."), pal, h("div", { class: "c3stage" }, svg));
  api.provide({ words: IT.map(it => `${it.e}=${c3F(it.v)}`), answers: IT.map(it => `${it.e.replace("-", "−")} = ${c3F(it.v)}`) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    const given = Object.entries(fills).filter(([, v]) => v != null).map(([k, v]) => `${labels[k]}:${IT[v].e}`).join(" ");
    for (const r of R) {
      const lv = c3P(labels[r.id]), want = IT.findIndex(it => it.v === lv), f = fills[r.id];
      if (want < 0 && f != null) return api.fail(`${labels[r.id]}${c3J(labels[r.id], "은는").slice(labels[r.id].length)} 어느 식의 답도 아니에요. 계산을 다시 살펴봐요.`, given);
      if (want >= 0 && f !== want) return api.fail(f == null ? "아직 칠하지 않은 답 칸이 있어요." : `${labels[r.id]} 칸의 색이 맞지 않아요. 그 칸에 알맞은 식을 다시 찾아요.`, given);
    }
    api.tryOnce(); api.done(given, opt.ok);
  } }, "확인하기")));
}

/* ===== 놀이: 소수를 수어로 ===== */
const c3Rand = n => Math.floor(Math.random() * n);
/* ⑬ 주머니에서 수 카드 두 장 뽑기 */
function c3Bag(body, api, opt = {}) {
  c3Style();
  const one = 1 + c3Rand(9); let deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], got = [];
  const sk = h("div", { class: "c3big" }, "​"), say = h("div", { class: "c3say" }, "​"), more = h("div", { class: "c3ask hidden" });
  let reg = c3Reg();
  const paint = () => {
    sk.textContent = `${one}.${got[0] != null ? got[0] : "□"}${got[1] != null ? got[1] : "□"}`;
    if (got.length === 2 && !more.childNodes.length) {
      const s = `${one}.${got[0]}${got[1]}`;
      more.append(c3Rows([
        ["스케치북에 쓴 소수:", { n: s }],
        ["이 소수를 읽으면", { t: [c3Read(s)] }],
        [`소수 첫째 자리 숫자 ${c3J(String(got[0]), "은는")}`, { n: c3F(got[0] * 100) }, `${c3J(c3F(got[0] * 100), "을를").slice(-1)} 나타내요.`],
        [`소수 둘째 자리 숫자 ${c3J(String(got[1]), "은는")}`, { n: c3F(got[1] * 10) }, `${c3J(c3F(got[1] * 10), "을를").slice(-1)} 나타내요.`]], reg));
      more.classList.remove("hidden");
    }
  };
  const bag = h("button", { class: "big", onclick: () => {
    if (got.length >= 2) return;
    const k = c3Rand(deck.length); got.push(deck[k]); deck.splice(k, 1);
    say.textContent = got.length === 1 ? `첫 번째 카드는 ${got[0]}! 소수 첫째 자리에 써요.` : `두 번째 카드는 ${got[1]}! 소수 둘째 자리에 써요.`;
    paint();
  } }, "주머니에서 수 카드 뽑기");
  paint();
  body.append(h("div", { class: "c3say" }, `선생님이 수어로 알려 준 일의 자리 수는 ${c3J(String(one), "이에요")}. 주머니(0~9 수 카드)에서 카드 두 장을 뽑아 소수 첫째 자리와 소수 둘째 자리에 차례대로 써요.`), h("div", { class: "c3tools" }, bag), h("div", { class: "c3cap" }, "첫 번째 사람의 스케치북"), sk, say, more);
  api.provide({ words: ["일의 자리", "소수 첫째 자리", "소수 둘째 자리"], answers: ["뽑은 카드를 차례대로 써요"] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (got.length < 2) return api.fail("주머니에서 카드 두 장을 뽑아요.", "-");
    const r = c3Judge(reg, opt);
    if (r.bad) return api.fail(r.bad, r.given);
    api.tryOnce(); api.done(r.given, opt.ok || "소수 두 자리 수를 만들고 자릿값을 알아보았어요. 이제 수어로 다음 친구에게 전해요.");
  } }, "확인하기")));
}
/* ⑭ 조건 카드로 점수 얻기 (3판) */
const C3COND = [
  { t: "가장 큰 소수를 쓴 모둠", f: L => L.indexOf(Math.max(...L)) },
  { t: "가장 작은 소수를 쓴 모둠", f: L => L.indexOf(Math.min(...L)) },
  { t: "두 번째로 큰 소수를 쓴 모둠", f: L => L.indexOf([...L].sort((a, b) => b - a)[1]) },
  { t: "두 번째로 작은 소수를 쓴 모둠", f: L => L.indexOf([...L].sort((a, b) => a - b)[1]) }];
function c3Teams(body, api, opt = {}) {
  c3Style();
  let round = 0, one, nums, last, cond, okList, locked = false;
  const box = h("div"), say = h("div", { class: "c3say" }, "​");
  const make = () => {
    one = 1 + c3Rand(9);
    do { nums = [0, 1, 2, 3].map(() => one * 1000 + c3Rand(100) * 10); } while (new Set(nums).size < 4);
    const miss = c3Rand(4); last = nums.slice();
    const dg = c3Fd(nums[miss], 2), sw = `${one}.${dg[3]}${dg[2]}`;
    last[miss] = dg[2] !== dg[3] ? c3P(sw) : nums[miss] + (nums[miss] % 100 === 90 ? -10 : 10);
    cond = C3COND[(round + c3Rand(C3COND.length)) % C3COND.length];
    const ok = nums.map((v, i) => v === last[i] ? v : null);
    const valid = ok.filter(v => v != null);
    const pickIdx = (() => { const k = cond.f(valid); return ok.indexOf(valid[k]); })();
    okList = pickIdx;
    locked = false; box.innerHTML = "";
    box.append(h("div", { class: "c3row" }, `${round + 1}판 · 조건 카드: `, h("span", { class: "c3cond" }, cond.t)),
      h("div", { class: "c3teams" }, nums.map((v, i) => h("button", { class: "opt", onclick: ev => choose(i, ev.currentTarget) }, `${i + 1}모둠`, h("small", {}, `첫 번째 사람: ${c3Fd(v, 2)}`), h("small", {}, `마지막 사람: ${c3Fd(last[i], 2)}`)))));
  };
  function choose(i, btn) {
    if (locked) return; // 맞힌 뒤 다음 판이 나오기 전에 또 누르면 세지 않아요
    if (nums[i] !== last[i]) { btn.classList.add("bad"); return api.fail(`${i + 1}모둠은 첫 번째 사람과 마지막 사람이 쓴 소수가 달라서 점수를 얻을 수 없어요.`, `${round + 1}판 ${i + 1}모둠`); }
    if (i !== okList) { btn.classList.add("bad"); return api.fail("점수를 얻을 수 있는 모둠의 소수끼리 자연수 부분, 소수 첫째 자리, 소수 둘째 자리 차례로 비교해 봐요.", `${round + 1}판 ${i + 1}모둠`); }
    locked = true; btn.classList.add("good"); round++;
    if (round >= 3) { say.textContent = "세 판 모두 알맞은 모둠을 찾았어요!"; api.tryOnce(); return api.done("3판 모두 맞힘", opt.ok); }
    say.textContent = `${i + 1}모둠이 1점을 얻었어요. 다음 판이에요.`; setTimeout(make, 900);
  }
  make();
  body.append(h("div", { class: "c3say" }, "모든 모둠의 전달이 끝났어요. 첫 번째 사람과 마지막 사람이 쓴 소수가 같은 모둠만 점수를 얻을 수 있어요. 조건 카드에 맞는 모둠을 눌러요(3판)."), box, say);
  api.provide({ words: ["자연수 부분", "소수 첫째 자리", "소수 둘째 자리"], answers: ["조건에 맞는 모둠을 골라요"] });
}
/* ⑮ 또 다른 놀이: 9.□□ 두 수 중 더 큰 소수 고르기 */
function c3Bigger(body, api, opt = {}) {
  c3Style();
  const N = opt.n || 6; let k = 0, wrong = 0, t0 = Date.now(), a, b, locked = false;
  const box = h("div", { class: "c3pair" }), say = h("div", { class: "c3say" }, "​"), cnt = h("div", { class: "c3cap" }, "​");
  const make = () => {
    do { a = 9000 + c3Rand(100) * 10; b = 9000 + c3Rand(100) * 10; } while (a === b || a % 100 === 0 || b % 100 === 0); // 9.00·9.30처럼 끝자리가 0인 수는 빼요
    locked = false; box.innerHTML = ""; cnt.textContent = `${k + 1} / ${N}번째 문제`;
    [a, b].forEach(v => box.append(h("button", { class: "opt", onclick: ev => pick(v, ev.currentTarget) }, c3Fd(v, 2))));
  };
  function pick(v, btn) {
    if (locked) return; // 맞힌 뒤 다음 문제가 나오기 전에 또 누르면 세지 않아요
    if (v !== Math.max(a, b)) { wrong++; btn.classList.add("bad"); return api.fail("자연수 부분이 9로 같으니 소수 첫째 자리부터 비교해요.", `${c3Fd(a, 2)} vs ${c3Fd(b, 2)} → ${c3Fd(v, 2)}`); }
    locked = true; btn.classList.add("good"); k++;
    if (k >= N) { const s = Math.round((Date.now() - t0) / 1000); say.textContent = `${N}문제를 ${s}초 만에 끝냈어요.`; api.tryOnce(); return api.done(`${N}문제 · ${s}초 · 틀림 ${wrong}`, opt.ok); }
    say.textContent = "맞아요! 다음 문제예요."; setTimeout(make, 500);
  }
  make();
  body.append(h("div", { class: "c3say" }, "문제를 든 친구가 두 소수 중 더 큰 소수를 수어로 알려 주는 놀이예요. 두 소수 중 더 큰 소수를 빨리 눌러 보세요."), cnt, box, say);
  api.provide({ words: ["소수 첫째 자리", "소수 둘째 자리"], answers: ["더 큰 소수를 골라요"] });
}
/* 작은 도우미: 수직선 그림(화살표), 식 칸, 잘못된 세로셈 그림 */
function c3LineFig(o, at, lab = "□") {
  const svg = makeSvg(1000, 170), g = svgEl("g"); svg.append(g);
  const X = c3LineDraw(g, Object.assign({ x0: 60, len: 860, y: 110 }, o));
  g.append(svgEl("path", { d: `M${X(at)} 102 l-12 -24 h24 z`, fill: "#2B7BD6" }), txt(X(at), 58, lab, 26, { fill: "#2B7BD6" }));
  return c3Fig(svg);
}
function c3Q(e, a, x) { return [String(e).replace(/-/g, "−") + " =", Object.assign({ n: a, e }, x || {})]; }
function c3CharTable(rows, cls) {
  return h("div", { style: "overflow-x:auto" }, h("table", { class: "c3vt", style: "margin:.2em 0" }, rows.map((r, i) => h("tr", i === rows.length - 1 ? { class: "c3sum" } : {}, r.map(c => h("td", c === "." ? { class: "c3dc" } : {}, c || "​"))))));
}
//@@LESSONS
const UNIT_STORY = { title: "할아버지 댁에서 찾은 소수", lines: [
  "재윤이는 가족과 함께 할아버지 댁에 갔어요. 지난번에 심은 보리가 싹을 틔웠고, 대추나무에 대추가 열렸고, 귀여운 새끼 토끼들이 태어났어요.",
  "보리의 키를 재고, 대추의 무게를 재고, 토끼장에 들어갈 천을 자르며 소수 두 자리 수·세 자리 수를 알아보고 소수를 더하고 빼 봐요.",
  "교과서 「수학 4-2」 3. 소수의 덧셈과 뺄셈의 차시 순서 그대로 만들었어요."],
  one: "소수의 덧셈과 뺄셈 · 재윤이와 함께 할아버지 댁에서 소수를 찾아 크기를 비교하고 더하고 빼요." };
const UNIT_KEYWORDS = ["소수", "소수점", "소수 두 자리 수", "소수 세 자리 수", "0.01", "0.001", "일의 자리", "소수 첫째 자리", "소수 둘째 자리", "소수 셋째 자리", "자릿값", "크기 비교", "10배", "[1/10]", "받아올림", "받아내림"];

const C3PL = ["일의 자리", "소수 첫째 자리", "소수 둘째 자리", "소수 셋째 자리"];
const LESSONS = [
{
  id: "l1", no: 1, title: "단원 도입 ― 할아버지 댁에서 찾은 소수", soop: "개념 찾기(S)",
  question: "우리 주변에서 소수는 어디에 쓰이고, 소수의 덧셈과 뺄셈은 언제 필요할까요?",
  summary: "에베레스트산의 높이 8848.86 m처럼 우리 주변에는 소수가 많이 쓰여요. 이 단원에서는 소수 두 자리 수와 소수 세 자리 수를 알아보고, 소수의 크기를 비교하고, 소수의 덧셈과 뺄셈을 해요.",
  steps: [
    { name: "에베레스트산", inst: "“에베레스트산은 세계에서 가장 높은 산이야. 그 높이가 무려 8848.86 m나 된다고 해.” 그림을 보고 답해 보세요.", hints: ["그림의 빨간 화살표 옆에 높이가 쓰여 있어요.", "소수점(.) 오른쪽에 있는 숫자를 세어 봐요."],
      render: (b, a) => quiz(b, a, [
        { fig: c3Everest, q: "에베레스트산의 높이는 몇 m인가요?", o: ["8848.86 m", "884886 m", "8.84886 m"], a: 0 },
        { q: "8848.86에서 소수점 오른쪽에 있는 숫자는 몇 개인가요?", o: ["1개", "2개", "3개"], a: 1, why: { "0": "8848.86의 소수점 오른쪽에는 8과 6이 있어요." } },
        { q: "산의 높이를 8848.86 m처럼 소수로 나타내면 좋은 점은 무엇일까요?", o: ["자연수로만 나타낼 때보다 더 정확하게 나타낼 수 있어요", "수를 읽지 않아도 돼요", "높이가 더 높아져요"], a: 0 }],
        { ok: "소수점 아래 숫자가 두 개인 소수도 있어요. 이런 소수를 이 단원에서 배워요." }) },
    { name: "할아버지 댁 그림", inst: "재윤이가 가족과 함께 할아버지 댁에 갔어요. “잘 찾아왔구나!” 할아버지께서 반갑게 맞아 주셨어요. 그림은 어떤 상황을 나타내고 있는지 찾아보세요.", hints: ["집, 토끼장, 대추나무, 밭, 젖소를 찾아 눌러 봐요.", "아래 이름표가 진해지면 찾은 거예요."],
      render: (b, a) => c3Find(b, a, { ok: "할아버지 댁에는 보리, 대추나무, 토끼, 젖소가 있어요. 여기서 소수를 찾아 문제를 해결해 봐요." }) },
    { name: "무엇을 배울까요", inst: "“싹이 난 보리의 길이를 재어 보고, 대추의 무게도 재어 보고, 토끼장에 들어갈 천을 자르기도 했어요.” 할아버지 댁에서 소수가 쓰일 만한 것과 이 단원에서 배울 내용을 알아보세요.", hints: ["길이, 무게, 들이처럼 재어서 나타내는 양은 소수로 나타낼 때가 많아요.", "토끼의 수처럼 하나, 둘 세는 것은 자연수로 나타내요."],
      render: (b, a) => quiz(b, a, [
        { q: "소수로 나타내기에 알맞은 것을 모두 골라 보세요.", o: ["싹이 난 보리의 키", "수확한 대추의 무게", "짠 우유의 양", "새로 태어난 토끼의 수"], a: [0, 1, 2] },
        { q: "이 단원에서 배울 내용이 아닌 것은 무엇인가요?", o: ["소수 두 자리 수와 소수 세 자리 수", "소수의 크기 비교와 소수 사이의 관계", "소수의 덧셈과 뺄셈", "소수의 곱셈"], a: 3, why: { "0": "소수 두 자리 수와 세 자리 수는 이 단원에서 배워요.", "1": "소수의 크기 비교는 이 단원에서 배워요.", "2": "소수의 덧셈과 뺄셈은 이 단원의 이름이에요." } }],
        { ok: "재어서 나타내는 양은 소수로 나타낼 때가 많아요. 소수의 곱셈은 5학년 때 배워요." }) },
    { name: "배운 내용 떠올리기", inst: "곰곰! 3학년 1학기에 배운 분수와 소수를 떠올려 보세요.", hints: ["1을 똑같이 10으로 나눈 것 중의 하나는 [1/10]=0.1이에요.", "0.1이 10개이면 1이에요.", "소수 한 자리 수는 자연수 부분부터 비교해요."],
      render: (b, a) => c3Sent(b, a, [
        ["[1/10]을 소수로 나타내면", { n: "0.1" }, "이에요."],
        ["[7/10]은 0.1이", { n: "7" }, "개이므로 소수로", { n: "0.7", why: { "7": "0.1이 7개인 수예요." } }, "이에요."],
        ["0.1이 13개인 수는", { n: "1.3", why: { "0.13": "0.1이 10개이면 1이에요. 0.1이 13개이면 1과 0.3이에요.", "13": "0.1이 10개이면 1이에요." } }, "이에요."],
        ["0.6", { o: [">", "=", "<"], a: 2 }, "0.8"],
        ["1.4", { o: [">", "=", "<"], a: 0 }, "1.2"]], { ok: "분수와 소수, 소수 한 자리 수의 크기 비교를 잘 기억하고 있어요!" }) },
    { name: "경험 나누기", inst: "할아버지 댁이나 시골에 갔던 경험, 우리 주변에서 소수를 본 경험을 이야기해 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "시골이나 할아버지·할머니 댁에 갔던 경험을 써 보세요.", tag: "경험", ph: "예) 방학 때 할아버지 댁에 가서 밭에서 농사를 도와드렸어요." },
        { q: "우리 주변에서 소수를 본 적이 있나요? 어디에서 보았나요?", tag: "소수", ph: "예) 우유갑에 0.2 L, 내 몸무게 32.5 kg" }]) }
  ],
  challenge: { inst: "재윤이는 할아버지 댁에서 몸무게를 재었더니 32.5 kg이었어요. 물음에 답해 보세요.", hints: ["0.1이 10개이면 1이에요. 32는 0.1이 320개예요.", "소수점은 ‘점’으로 읽어요."],
    render: (b, a) => c3Sent(b, a, [
      ["32.5는 0.1이", { n: "325", why: { "35": "32는 0.1이 320개예요." } }, "개인 수예요."],
      ["32.5를 읽으면", { t: ["삼십이 점 오"] }, "예요."],
      ["32.5 kg과 32.8 kg 중 더 무거운 것은", { o: ["32.5 kg", "32.8 kg"], a: 1 }, "이에요."]], { ok: "32.5는 삼십이 점 오라고 읽어요. 자연수 부분이 같으면 소수 첫째 자리 수를 비교해요." }) }
},
{
  id: "l2", no: "2~3", title: "소수 두 자리 수를 알아볼까요", soop: "개념 구축하기(O)",
  question: "0.1보다 작은 수는 어떻게 쓰고 읽을까요?",
  summary: "분수 [1/100]은 소수로 0.01이라 쓰고 영 점 영일이라고 읽어요. [17/100]=0.17은 영 점 일칠이라고 읽고 0.01이 17개예요. 1.76에서 1은 일의 자리 숫자로 1을, 7은 소수 첫째 자리 숫자로 0.7을, 6은 소수 둘째 자리 숫자로 0.06을 나타내요.",
  steps: [
    { inst: "“어? 보리에서 싹이 돋았네!” 재윤이가 보리의 키를 재었더니 0.1 m와 0.2 m 사이였어요. 0.1 m를 똑같이 10칸으로 나눈 작은 눈금이 있는 자예요. 파란 표시를 보리의 끝으로 옮겨 보세요.", hints: ["보리의 끝은 0.1 m 눈금보다 오른쪽에 있어요.", "0과 0.1 사이, 0.1과 0.2 사이가 각각 똑같이 10칸으로 나뉘어 있어요.", "0.1은 1을 똑같이 10칸으로 나눈 것이니, 그 한 칸을 다시 10칸으로 나누면 1을 100칸으로 나눈 것과 같아요."],
      render: (b, a) => c3Line(b, a, { from: 0, to: 200, minor: 10, major: 100, mid: 50, target: 170, unit: "m", deco: { kind: "barley", at: 170 },
        asks: [
          ["보리의 키는", { o: ["0 m와 0.1 m", "0.1 m와 0.2 m", "0.2 m와 0.3 m"], a: 1 }, "사이예요."],
          ["보리의 끝은 0.1 m에서 작은 눈금", { n: "7" }, "칸만큼 더 가 있어요."],
          { fig: () => c3Fig(c3ZoomSvg({ from: 0, to: 1000, step: 100 })), q: "1을 똑같이 10칸으로 나누면 0.1이에요. 0.1을 다시 똑같이 10칸으로 나누면?", p: ["작은 눈금 한 칸은 1을 똑같이", { n: "100", why: { "10": "0.1을 10칸으로 나누었으니 1 전체는 10×10칸이에요." } }, "칸으로 나눈 것 중의 하나예요."] },
          ["작은 눈금 한 칸의 크기를 분수로 나타내면", { o: ["[1/10]", "[1/100]", "[1/1000]"], a: 1 }, "이에요."]],
        ok: "보리의 키는 0에서 작은 눈금 17칸만큼이에요. 작은 눈금 한 칸은 [1/100]이에요. 분수가 아닌 소수로도 나타낼 수 있을까요?" }) },
    { inst: "[17/100]을 소수로 나타내어 봐요. 0부터 1까지 작은 눈금이 [1/100]씩 있는 수직선에서 화살표를 [17/100]만큼 그려 보세요.", hints: ["[17/100]은 [1/100]이 17개예요. 0에서 작은 눈금 17칸만큼 가요.", "[1/100]=0.01이에요. 0.01이 17개이면 0.17이에요.", "소수점 아래 숫자는 하나씩 읽어요."],
      render: (b, a) => c3Line(b, a, { from: 0, to: 1000, minor: 10, major: 100, mid: 50, target: 170,
        asks: [
          ["[17/100]은 [1/100]이", { n: "17" }, "개예요."],
          ["[1/100]=0.01이므로 [17/100]은 0.01이", { n: "17" }, "개 →", "소수로", { n: "0.17", why: { "17": "0.01이 17개인 수를 소수로 써요.", "1.7": "0.1이 17개인 수가 1.7이에요. 0.01이 17개예요." } }],
          ["0.17은", { o: ["영 점 일칠", "영 점 십칠"], a: 0, why: { "1": "소수점 아래 숫자는 자릿값을 붙이지 않고 숫자만 하나씩 읽어요." } }, "이라고 읽어요."]],
        ok: "[17/100]=0.17이에요. 0.17은 0.01이 17개이고, 영 점 일칠이라고 읽어요." }) },
    { inst: "[1 76/100]을 소수로 나타내어 봐요. 단추를 눌러 모눈종이에 [1 76/100]만큼 칠해 보세요. 모눈종이 한 장 전체가 1이에요.", hints: ["[1 76/100]은 1과 [76/100]이에요.", "[76/100]은 0.1이 7개, 0.01이 6개예요.", "+1 한 번, +0.1 일곱 번, +0.01 여섯 번 눌러요."],
      render: (b, a) => c3Build(b, a, { target: "1.76", units: [1000, 100, 10], legend: ["one", "t", "h"],
        asks: [
          ["[76/100]을 소수로 나타내면", { n: "0.76" }, "이에요."],
          ["[1 76/100]은 1과 0.76만큼이므로 소수로", { n: "1.76", why: { "0.76": "1만큼도 더해야 해요.", "176": "소수점을 빠뜨렸어요." } }, "이에요."],
          ["1.76은 1이", { n: "1" }, "개, 0.1이", { n: "7" }, "개, 0.01이", { n: "6" }, "개예요."]],
        ok: "[1 76/100]=1.76이에요. 1.76은 1이 1개, 0.1이 7개, 0.01이 6개인 수예요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["0.01은 영 점 영일이라고 읽어요.", "1.76에서 7은 소수 첫째 자리, 6은 소수 둘째 자리 숫자예요."],
      render: (b, a) => blanks(b, a, ["분수 [1/100]은 소수로 ", { o: ["0.01", "0.1", "0.001"], a: 0 }, "이라 쓰고, ", { o: ["영 점 일", "영 점 영일", "영 점 영영일"], a: 1 }, "이라고 읽어요. 분수 [17/100]은 소수로 0.17이라 쓰고, ", { o: ["영 점 십칠", "영 점 일칠"], a: 1 }, "이라고 읽어요. 1.76에서 7은 ", { o: ["일의 자리", "소수 첫째 자리", "소수 둘째 자리"], a: 1 }, " 숫자이고 ", { o: ["7", "0.7", "0.07"], a: 1 }, "을 나타내요. 6은 ", { o: ["소수 첫째 자리", "소수 둘째 자리"], a: 1 }, " 숫자이고 ", { o: ["0.6", "0.06"], a: 1 }, "을 나타내요."]) },
    { inst: "전체 크기가 1인 모눈종이에 색칠된 부분이 나타내는 소수를 쓰고 읽어 보세요. 그리고 □ 안에 알맞은 수나 말을 넣어 보세요.", hints: ["분홍 세로 한 줄은 0.1, 연두 한 칸은 0.01이에요.", "소수 둘째 자리 숫자 9는 0.01이 9개, 곧 0.09를 나타내요."],
      render: (b, a) => c3Sent(b, a, [
        { fig: () => h("div", {}, c3Legend(["t", "h"]), c3GridFigs([{ v: 640, t: "왼쪽" }, { v: 280, t: "오른쪽" }])), p: ["왼쪽: 0.1이", { n: "6" }, "개, 0.01이", { n: "4" }, "개 →", { n: "0.64" }, "읽기:", { t: ["영 점 육사"] }] },
        ["오른쪽: 0.1이", { n: "2" }, "개, 0.01이", { n: "8" }, "개 →", { n: "0.28" }, "읽기:", { t: ["영 점 이팔"], why: { "영점이십팔": "소수점 아래 숫자는 하나씩 읽어요." } }],
        { g: "자릿값", rows: [
          ["6.57에서 6은", { o: C3PL.slice(0, 3), a: 0 }, "숫자이고,", { n: "6" }, "을 나타내요."],
          ["3.19에서 9는", { o: C3PL.slice(0, 3), a: 2 }, "숫자이고,", { n: "0.09", why: { "0.9": "9는 소수 둘째 자리 숫자예요. 0.01이 9개예요.", "9": "9는 소수점 아래에 있어요." } }, "를 나타내요."],
          ["8.24에서 2는", { o: C3PL.slice(0, 3), a: 1 }, "숫자이고,", { n: "0.2", why: { "0.02": "2는 소수 첫째 자리 숫자예요." } }, "를 나타내요."]] },
        ["음료수병에 쓰인 1.77 L는", { t: ["일 점 칠칠"] }, "리터라고 읽어요."]], { ok: "소수 두 자리 수를 쓰고 읽고, 각 자리 숫자가 나타내는 수를 알았어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 소수 두 자리 수를 알아보세요.", hints: ["1 m=100 cm이므로 1 cm=0.01 m예요.", "8.1과 8.2 사이를 똑같이 10칸으로 나누었으니 작은 눈금 한 칸은 0.01이에요."],
    render: (b, a) => c3Sent(b, a, [
      { fig: () => c3GridFigs([{ v: 360, t: "모눈종이" }]), p: ["색칠한 부분을 소수로 나타내면", { n: "0.36" }] },
      ["[2 11/100]을 소수로", { n: "2.11" }, "쓰고,", { t: ["이 점 일일"] }, "이라고 읽어요."],
      { fig: () => c3LineFig({ from: 8100, to: 8200, minor: 10, major: 100, mid: 50 }, 8170), p: ["수직선의 □에 알맞은 소수는", { n: "8.17", why: { "8.7": "작은 눈금 한 칸은 0.01이에요." } }] },
      ["소수 둘째 자리 숫자가 5인 수는", { o: ["㉠ 6.51", "㉡ 15.24", "㉢ 0.85"], a: 2, why: { "0": "6.51에서 5는 소수 첫째 자리 숫자예요." } }],
      ["0.1이 4개, 0.01이 3개인 수는", { n: "0.43" }],
      ["리본 115 cm는", { n: "1.15" }, "m, 128 cm는", { n: "1.28" }, "m예요."]], { ok: "소수 두 자리 수를 여러 가지로 나타낼 수 있어요!" }) }
},
{
  id: "l3", no: "4~5", title: "소수 세 자리 수를 알아볼까요", soop: "개념 구축하기(O)",
  question: "0.01보다 작은 수는 어떻게 쓰고 읽을까요?",
  summary: "분수 [1/1000]은 소수로 0.001이라 쓰고 영 점 영영일이라고 읽어요. [125/1000]=0.125(영 점 일이오)는 0.001이 125개예요. 1.853은 1이 1개, 0.1이 8개, 0.01이 5개, 0.001이 3개인 수예요.",
  steps: [
    { inst: "재윤이가 저수지 주변 산책로를 따라 걸은 거리는 0.12 km와 0.13 km 사이예요. 0.12 km와 0.13 km 사이를 똑같이 10칸으로 나눈 수직선에서 파란 표시를 재윤이가 선 곳으로 옮겨 보세요.", hints: ["재윤이는 0.12와 0.13의 가운데쯤에 서 있어요.", "0.01을 똑같이 10칸으로 나누면 1을 똑같이 1000칸으로 나눈 것과 같아요."],
      render: (b, a) => c3Line(b, a, { from: 120, to: 130, minor: 1, major: 10, mid: 5, target: 125, unit: "km", deco: { kind: "walk", at: 125 },
        asks: [
          ["재윤이는 0.12 km에서 작은 눈금", { n: "5" }, "칸만큼 더 걸었어요."],
          { fig: () => c3Fig(c3ZoomSvg({ from: 0, to: 100, step: 10 })), q: "1을 똑같이 100칸으로 나누면 0.01이에요. 0.01을 다시 똑같이 10칸으로 나누면?", p: ["작은 눈금 한 칸은 1을 똑같이", { n: "1000", why: { "100": "0.01은 1을 100칸으로 나눈 것이고, 그것을 다시 10칸으로 나누었어요." } }, "칸으로 나눈 것 중의 하나예요."] },
          ["작은 눈금 한 칸의 크기를 분수로 나타내면", { o: ["[1/10]", "[1/100]", "[1/1000]"], a: 2 }, "이에요."]],
        ok: "작은 눈금 한 칸은 [1/1000]이에요. 재윤이가 걸은 거리도 소수로 나타내 봐요." }) },
    { inst: "[125/1000]를 소수로 나타내어 봐요. 0부터 0.13까지 작은 눈금이 [1/1000]씩 있는 수직선에서 화살표를 [125/1000]만큼 그려 보세요.", hints: ["0.01은 [1/1000]이 10개예요. 0.12는 작은 눈금 120칸이에요.", "0.12에서 작은 눈금 5칸 더 가요.", "0.001이 125개이면 0.125예요."],
      render: (b, a) => c3Line(b, a, { from: 0, to: 130, minor: 1, major: 10, target: 125, fs: 17,
        asks: [
          ["[125/1000]는 [1/1000]이", { n: "125" }, "개예요."],
          ["[1/1000]=0.001이므로 소수로", { n: "0.125", why: { "1.25": "0.01이 125개인 수가 1.25예요. 0.001이 125개예요.", "12.5": "0.001이 125개인 수예요." } }, "이에요."],
          ["0.125는", { o: ["영 점 백이십오", "영 점 일이오"], a: 1, why: { "0": "소수점 아래 숫자는 하나씩 읽어요." } }, "라고 읽어요."]],
        ok: "[125/1000]=0.125예요. 0.125는 0.001이 125개이고, 영 점 일이오라고 읽어요." }) },
    { inst: "[1 853/1000]을 소수로 나타내어 봐요. 단추를 눌러 모눈종이에 [1 853/1000]만큼 칠해 보세요. 0.01 한 칸을 다시 10칸으로 나눈 가는 줄 하나가 0.001이에요.", hints: ["[853/1000]은 0.1이 8개, 0.01이 5개, 0.001이 3개예요.", "+1 한 번, +0.1 여덟 번, +0.01 다섯 번, +0.001 세 번 눌러요."],
      render: (b, a) => c3Build(b, a, { target: "1.853", units: [1000, 100, 10, 1], div: 1000, legend: ["one", "t", "h", "k"],
        asks: [
          ["[853/1000]을 소수로 나타내면", { n: "0.853" }, "이에요."],
          ["[1 853/1000]을 소수로 나타내면", { n: "1.853", why: { "0.853": "1만큼도 더해야 해요." } }, "이에요."],
          ["1.853은 1이", { n: "1" }, "개, 0.1이", { n: "8" }, "개, 0.01이", { n: "5" }, "개, 0.001이", { n: "3" }, "개예요."]],
        ok: "[1 853/1000]=1.853이에요. 1.853은 1이 1개, 0.1이 8개, 0.01이 5개, 0.001이 3개인 수예요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["0.001은 영 점 영영일이라고 읽어요.", "1.853에서 3은 소수 셋째 자리 숫자예요."],
      render: (b, a) => blanks(b, a, ["분수 [1/1000]은 소수로 ", { o: ["0.01", "0.001", "0.0001"], a: 1 }, "이라 쓰고, ", { o: ["영 점 영일", "영 점 영영일"], a: 1 }, "이라고 읽어요. 분수 [125/1000]는 소수로 0.125라 쓰고, ", { o: ["영 점 백이십오", "영 점 일이오"], a: 1 }, "라고 읽어요. 1.853에서 5는 ", { o: ["소수 첫째 자리", "소수 둘째 자리", "소수 셋째 자리"], a: 1 }, " 숫자이고 0.05를, 3은 ", { o: ["소수 둘째 자리", "소수 셋째 자리"], a: 1 }, " 숫자이고 ", { o: ["0.3", "0.03", "0.003"], a: 2 }, "을 나타내요."]) },
    { inst: "전체 크기가 1인 모눈종이에 색칠된 부분이 나타내는 소수를 쓰고 읽어 보세요. 그리고 □ 안에 알맞은 수나 말을 넣어 보세요.", hints: ["분홍 세로 한 줄은 0.1, 연두 한 칸은 0.01, 주황 가는 줄은 0.001이에요.", "오른쪽 모눈에는 연두 칸이 없어요. 소수 둘째 자리에 0을 써요."],
      render: (b, a) => c3Sent(b, a, [
        { fig: () => h("div", {}, c3Legend(["t", "h", "k"]), c3GridFigs([{ v: 378, div: 1000, t: "왼쪽" }, { v: 805, div: 1000, t: "오른쪽" }])), p: ["왼쪽:", { n: "0.378" }, "읽기:", { t: ["영 점 삼칠팔"] }] },
        ["오른쪽:", { n: "0.805", why: { "0.85": "연두(0.01) 칸이 없으니 소수 둘째 자리 숫자는 0이에요." } }, "읽기:", { t: ["영 점 팔영오"] }],
        { g: "자릿값", rows: [
          ["2.167에서 1은", { o: C3PL, a: 1 }, "숫자이고,", { n: "0.1" }, "을 나타내요."],
          ["5.394에서 9는", { o: C3PL, a: 2 }, "숫자이고,", { n: "0.09", why: { "0.9": "9는 소수 둘째 자리 숫자예요." } }, "를 나타내요."],
          ["7.475에서 5는", { o: C3PL, a: 3 }, "숫자이고,", { n: "0.005", why: { "0.05": "5는 소수 셋째 자리 숫자예요. 0.001이 5개예요." } }, "를 나타내요."]] }],
        { ok: "소수 세 자리 수를 쓰고 읽고, 각 자리 숫자가 나타내는 수를 알았어요!" }) }
  ],
  challenge: { inst: "“1.324는 1이 1개, 0.1이 3개, 0.01이 2개, 0.001이 4개인 수야.” “0.001이 1324개인 수이기도 해.” 이렇게 소수를 여러 가지 방법으로 설명하고, 수학익힘 문제도 풀어 보세요.", hints: ["0.1은 0.001이 100개, 0.01은 0.001이 10개예요.", "1.4와 1.41 사이를 똑같이 10칸으로 나누었으니 작은 눈금 한 칸은 0.001이에요.", "1.053에서 3은 소수 셋째 자리 숫자예요."],
    render: (b, a) => c3Sent(b, a, [
      { g: "0.486을 여러 가지 방법으로", rows: [
        ["0.486은 0.1이", { n: "4" }, "개, 0.01이", { n: "8" }, "개, 0.001이", { n: "6" }, "개인 수예요."],
        ["0.486은 0.001이", { n: "486" }, "개인 수예요."]] },
      ["[3 294/1000]를 소수로", { n: "3.294" }, "쓰고,", { t: ["삼 점 이구사"] }, "라고 읽어요."],
      { fig: () => c3LineFig({ from: 1400, to: 1410, minor: 1, major: 10, mid: 5 }, 1406), p: ["수직선의 □에 알맞은 소수는", { n: "1.406", why: { "1.46": "작은 눈금 한 칸은 0.001이에요.", "1.6": "작은 눈금 한 칸은 0.001이에요." } }] },
      ["숫자 7이 0.007을 나타내는 수는", { o: ["2.472", "6.527", "7.035"], a: 1 }],
      ["1.053을 잘못 설명한 사람은", { o: ["윤서: 일 점 영오삼이라고 읽어.", "지원: 0.001이 1053개인 수야.", "영준: 3은 소수 둘째 자리 숫자이고 0.03을 나타내."], a: 2 }],
      ["3과 4 사이, 소수 둘째 자리 숫자 5, 0.1이 8개, 0.001이 9개인 소수 세 자리 수는", { n: "3.859" }]], { ok: "소수 세 자리 수를 자유롭게 다루었어요!" }) }
},
{
  id: "l4", no: 6, title: "소수의 크기를 비교해 볼까요", soop: "개념 구축하기(O)",
  question: "두 소수의 크기는 어떻게 비교할까요?",
  summary: "0.01이 몇 개인지 세어 비교할 수 있어요. 0.3과 0.30은 같은 수이고, 필요하면 소수의 오른쪽 끝자리에 0을 붙여 나타낼 수 있어요. 소수는 자연수 부분, 소수 첫째 자리, 소수 둘째 자리, 소수 셋째 자리 수를 차례대로 비교해요.",
  steps: [
    { inst: "며칠 전 태어난 흰토끼의 무게는 0.68 kg, 검은토끼의 무게는 0.42 kg이에요. 모눈 한 칸의 크기는 0.01이에요. 두 모눈종이에 토끼의 무게만큼 칠해 보세요.", hints: ["0.68은 0.01이 68개예요. 세로 한 줄(10칸)이 6줄과 8칸이에요.", "칠한 칸이 많을수록 큰 수예요."],
      render: (b, a) => c3Fill(b, a, { panels: [{ kind: "grid", target: 68, label: "흰토끼", title: "흰토끼 0.68 kg", color: "#BFC8D6" }, { kind: "grid", target: 42, label: "검은토끼", title: "검은토끼 0.42 kg", color: "#7A8C86" }],
        asks: [["0.68은 0.01이", { n: "68" }, "개, 0.42는 0.01이", { n: "42" }, "개예요."], ["더 무거운 토끼는", { o: ["흰토끼", "검은토끼"], a: 0 }, "예요."]],
        ok: "0.68은 0.01이 68개, 0.42는 0.01이 42개이니 0.68이 더 커요. 흰토끼가 더 무거워요." }) },
    { inst: "0.3과 0.30의 크기를 비교해 봐요. 왼쪽 모눈종이에는 0.3만큼(0.1이 3개) 세로 줄을 누르며, 오른쪽 모눈종이에는 0.30만큼(0.01이 30개) 칸을 누르며 칠해 보세요.", hints: ["왼쪽은 세로 한 줄을 누를 때마다 0.1씩 칠해져요.", "0.30은 0.01이 30개예요. 30칸을 칠해요."],
      render: (b, a) => c3Fill(b, a, { panels: [{ kind: "col", target: 30, label: "0.3", title: "0.3 (세로 줄로 칠하기)", color: C3C.t }, { kind: "grid", target: 30, label: "0.30", title: "0.30 (한 칸씩 칠하기)", color: C3C.h }],
        tip: "왼쪽은 세로 줄을, 오른쪽은 칸을 누르거나 끌어서 칠해요.",
        asks: [["두 모눈종이에 칠한 부분의 크기는", { o: ["같아요", "0.3이 더 커요", "0.30이 더 커요"], a: 0, why: { "2": "0.30이 숫자가 더 많지만 칠한 부분을 견주어 봐요.", "1": "칠한 부분을 견주어 봐요." } }, "."]],
        ok: "칠한 부분이 같아요. 0.3과 0.30은 같은 수예요." }) },
    { inst: "2.136과 2.135의 크기를 비교하는 방법을 알아봐요. 자릿값 표에서 높은 자리부터 차례대로 눌러 비교해 보세요.", hints: ["자연수 부분 → 소수 첫째 자리 → 소수 둘째 자리 → 소수 셋째 자리 차례로 눌러요.", "소수 셋째 자리에서 6과 5를 비교해요."],
      render: (b, a) => c3Cmp(b, a, { a: "2.136", b: "2.135", ok: "2.136 > 2.135예요. 자연수 부분부터 차례대로 비교했더니 소수 셋째 자리에서 6>5였어요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["0.3과 0.30은 칠한 부분이 같았어요.", "높은 자리부터 차례대로 비교해요."],
      render: (b, a) => blanks(b, a, ["0.3과 0.30은 ", { o: ["같은", "다른"], a: 0 }, " 수예요. 필요한 경우 소수의 ", { o: ["오른쪽", "왼쪽"], a: 0 }, " 끝자리에 0을 붙여서 나타낼 수 있어요. 소수의 크기는 ", { o: ["자연수 부분", "소수 셋째 자리"], a: 0 }, "부터 소수 첫째 자리, 소수 둘째 자리, 소수 셋째 자리 수를 차례대로 비교해요. ", { o: ["높은", "낮은"], a: 0 }, " 자리 수가 클수록 큰 수예요."]) },
    { inst: "두 소수의 크기를 비교하여 >, =, < 를 골라 보세요.", hints: ["소수점 아래 숫자가 많다고 큰 수가 아니에요.", "3.24의 끝에 0을 붙이면 3.240이에요."],
      render: (b, a) => c3Sent(b, a, [
        ["0.15", { o: [">", "=", "<"], a: 2, why: { "0": "소수 첫째 자리 수 1과 2를 비교해요." } }, "0.21"],
        ["7.898", { o: [">", "=", "<"], a: 0 }, "7.893"],
        ["3.24", { o: [">", "=", "<"], a: 1, why: { "2": "3.240은 3.24의 끝자리에 0을 붙인 수예요.", "0": "3.24의 끝자리에 0을 붙이면 3.240이에요." } }, "3.240"],
        ["1.23", { o: [">", "=", "<"], a: 2, why: { "0": "소수점 아래 숫자가 많다고 큰 수가 아니에요. 소수 첫째 자리 수 2와 4를 비교해요." } }, "1.4"],
        ["0.345", { o: [">", "=", "<"], a: 2, why: { "0": "자연수 부분부터 비교해요. 0과 1 중 1이 커요." } }, "1.12"]], { ok: "높은 자리부터 차례대로 비교했어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 소수의 크기를 비교해 보세요.", hints: ["7.4는 7.40과 같아요. 0.01이 740개예요.", "0.001이 380개인 수는 0.38이고, 0.01이 37개와 0.001이 6개인 수는 0.376이에요."],
    render: (b, a) => c3Sent(b, a, [
      ["23.5와 같은 수는", { o: ["㉠ 20.35", "㉡ 23.050", "㉢ 23.05", "㉣ 23.50"], a: 3 }],
      ["7.24는 0.01이", { n: "724" }, "개, 7.4는 0.01이", { n: "740", why: { "74": "7.4=7.40이에요." } }, "개이므로 더 작은 수는", { o: ["7.24", "7.4"], a: 0 }],
      ["4.8", { o: [">", "=", "<"], a: 2 }, "4.95", "  ·  1.324", { o: [">", "=", "<"], a: 2 }, "1.326"],
      ["㉠ 0.001이 380개인 수, ㉡ 0.01이 37개, 0.001이 6개인 수 중 더 큰 수는", { o: ["㉠", "㉡"], a: 0 }],
      ["㉠ 0.87 ㉡ 1.016 ㉢ 1.01 ㉣ 1.16을 작은 수부터:", { o: ["㉠, ㉢, ㉡, ㉣", "㉠, ㉡, ㉢, ㉣", "㉣, ㉡, ㉢, ㉠"], a: 0 }],
      ["오렌지주스 2.57 L, 포도주스 2.09 L가 남았어요. 더 적게 남은 것은", { o: ["오렌지주스", "포도주스"], a: 1 }]], { ok: "자리 수가 다른 소수도 정확하게 비교했어요!" }) }
},
{
  id: "l5", no: 7, title: "소수 사이의 관계를 알아볼까요", soop: "개념 구축하기(O)",
  question: "1, 0.1, 0.01, 0.001 사이에는 어떤 관계가 있을까요?",
  summary: "1의 [1/10]은 0.1, [1/100]은 0.01, [1/1000]은 0.001이에요. 0.001을 10배 하면 0.01, 100배 하면 0.1, 1000배 하면 1이에요. 소수를 10배 하면 소수점을 기준으로 수가 왼쪽으로 한 자리, [1/10]을 하면 오른쪽으로 한 자리 이동해요.",
  steps: [
    { inst: "새로 태어난 토끼의 잠자리를 부드러운 천으로 만들어요. 크기가 1인 천을 동생은 10조각, 재윤이는 100조각, 할아버지는 1000조각으로 똑같이 나누어 자르려고 해요. 단추를 눌러 잘라 보고, 한 조각의 크기를 비교해 보세요.", hints: ["1을 똑같이 10으로 나눈 하나는 [1/10]=0.1이에요.", "조각 수가 많을수록 한 조각은 작아져요."],
      render: (b, a) => c3Cloth(b, a, { asks: [
        ["동생이 자른 한 조각: [1/10] =", { n: "0.1" }],
        ["재윤이가 자른 한 조각: [1/100] =", { n: "0.01" }],
        ["할아버지가 자른 한 조각: [1/1000] =", { n: "0.001" }],
        ["한 조각의 크기가 가장 큰 사람은", { o: ["동생", "재윤", "할아버지"], a: 0, why: { "2": "1000조각으로 나누면 한 조각이 가장 작아요." } }, "이에요."]],
        ok: "동생 0.1, 재윤 0.01, 할아버지 0.001이에요. 같은 천을 더 많은 조각으로 나눌수록 한 조각은 작아져요." }) },
    { inst: "1, 0.1, 0.01, 0.001 사이의 관계를 알아봐요. 그림을 보고 □ 안에 알맞은 수를 넣어 보세요.", hints: ["오른쪽으로 한 칸 갈 때마다 [1/10]이 돼요.", "왼쪽으로 한 칸 갈 때마다 10배가 돼요."],
      render: (b, a) => c3Sent(b, a, [
        ["0.1의 [1/10]은", { n: "0.01" }, "이에요."],
        ["1은 0.1의", { n: "10" }, "배예요."],
        ["1의 [1/100]은", { n: "0.01" }, ", 1의 [1/1000]은", { n: "0.001" }, "이에요."],
        ["0.001을 10배 하면", { n: "0.01" }, ", 100배 하면", { n: "0.1" }, ", 1000배 하면", { n: "1" }, "이에요."]], { fig: c3RelSvg, ok: "1, 0.1, 0.01, 0.001은 서로 10배, [1/10]의 관계예요." }) },
    { inst: "소수를 10배, [1/10] 해 보며 수가 어떻게 바뀌는지 알아봐요. 판에서 0.716을 10배씩 두 번, 3.5를 [1/10]씩 두 번 해 보고 □ 안에 알맞은 수를 넣어 보세요.", hints: ["10배 하면 숫자들이 왼쪽으로 한 자리씩 옮겨 가요.", "‘3.5에서 시작’ 단추를 누르고 [1/10]을 두 번 눌러요."],
      render: (b, a) => c3Shift(b, a, { starts: ["0.716", "3.5"], need: ["7.16", "71.6", "0.35", "0.035"],
        asks: [
          ["0.716 →(10배)", { n: "7.16" }, "→(10배)", { n: "71.6" }],
          ["3.5 →([1/10])", { n: "0.35" }, "→([1/10])", { n: "0.035" }],
          ["10배 하면 소수점을 기준으로 수가", { o: ["왼쪽", "오른쪽"], a: 0 }, "으로 한 자리 이동해요."],
          ["[1/10]을 하면 소수점을 기준으로 수가", { o: ["왼쪽", "오른쪽"], a: 1 }, "으로 한 자리 이동해요."]],
        ok: "소수점은 그대로이고, 10배 하면 수가 왼쪽으로, [1/10]을 하면 오른쪽으로 한 자리씩 이동해요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["0.001을 10배 하면 0.01이에요.", "10배 하면 수가 왼쪽으로 이동해요."],
      render: (b, a) => blanks(b, a, ["1의 [1/10]은 0.1, [1/100]은 ", { o: ["0.01", "0.001"], a: 0 }, ", [1/1000]은 ", { o: ["0.01", "0.001"], a: 1 }, "이에요. 0.001을 10배 하면 ", { o: ["0.01", "0.1"], a: 0 }, ", 100배 하면 0.1, 1000배 하면 ", { o: ["1", "10"], a: 0 }, "이에요. 소수를 10배 하면 소수점을 기준으로 수가 ", { o: ["왼쪽", "오른쪽"], a: 0 }, "으로 한 자리 이동하고, [1/10]을 하면 ", { o: ["왼쪽", "오른쪽"], a: 1 }, "으로 한 자리 이동해요."]) },
    { inst: "□ 안에 알맞은 소수를 넣고, 다른 수를 설명한 사람을 찾아보세요.", hints: ["100배 하면 수가 왼쪽으로 두 자리 이동해요.", "[1/100]을 하면 수가 오른쪽으로 두 자리 이동해요.", "0.093의 1000배는 93이에요."],
      render: (b, a) => c3Sent(b, a, [
        ["1.159의 100배는", { n: "115.9", why: { "11.59": "그것은 10배예요. 100배는 왼쪽으로 두 자리 이동해요." } }, "이고, 1000배는", { n: "1159" }, "이에요."],
        ["831의 [1/100]은", { n: "8.31", why: { "83.1": "그것은 [1/10]이에요." } }, "이고, [1/1000]은", { n: "0.831" }, "이에요."],
        { q: "예지: “0.93의 10배인 수야.” 하준: “93의 [1/10]이야.” 다윤: “0.093의 1000배야.”", p: ["다른 수를 설명한 사람은", { o: ["예지", "하준", "다윤"], a: 2, why: { "0": "0.93의 10배는 9.3이에요.", "1": "93의 [1/10]은 9.3이에요." } }, "이에요."] }],
        { ok: "예지와 하준이는 9.3, 다윤이는 93을 설명했어요. 소수 사이의 관계를 잘 이용했어요!" }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 소수 사이의 관계를 이용해 보세요.", hints: ["0.47의 1000배는 470이에요.", "0.007의 10배는 0.07, 0.7의 [1/10]은 0.07이에요.", "149의 [1/1000]은 0.149예요."],
    render: (b, a) => c3Sent(b, a, [
      ["0.29의 [1/10] =", { n: "0.029" }, ", 0.029의 100배 =", { n: "2.9" }, ", 2.9의 [1/10] =", { n: "0.29" }],
      ["잘못 설명한 것은", { o: ["㉠ 3.4의 10배는 34", "㉡ 0.47의 1000배는 47", "㉢ 1.5의 [1/100]은 0.015"], a: 1 }],
      ["나타내는 수가 0.07인 것을 모두 골라요:", { m: ["0.007의 10배", "0.7의 100배", "70의 [1/100]", "0.7의 [1/10]"], a: [0, 3] }],
      ["□ 안에 알맞은 수가 다른 하나는", { o: ["㉠ 0.58의 □배는 58", "㉡ 0.031의 □배는 0.31", "㉢ 0.6의 [1/□]은 0.006"], a: 1 }],
      ["가장 작은 수를 설명한 사람은", { o: ["진호: 149의 [1/1000]", "민성: 14.9의 [1/10]", "수현: 0.149의 100배"], a: 0 }]], { ok: "10배, 100배, 1000배와 [1/10], [1/100], [1/1000]을 자유롭게 이용했어요!" }) }
},
{
  id: "l6", no: 8, title: "소수 한 자리 수의 덧셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "소수 한 자리 수의 덧셈은 어떻게 할까요?",
  summary: "소수 한 자리 수의 덧셈은 0.1이 몇 개인지 생각하여 계산할 수 있어요. 세로로 계산할 때는 ① 소수점의 위치를 맞추어 쓰고 ② 자연수의 덧셈과 같이 같은 자리 수끼리 계산하고 ③ 소수점을 그대로 내려 찍어요.",
  steps: [
    { inst: "“젖을 짜야 송아지에게 우유를 배불리 먹일 수 있단다.” 할아버지를 도와 재윤이가 짠 우유는 0.6 L이고, 동생이 짠 우유는 0.2 L예요. 막대 한 칸은 0.1 L예요. 세 막대에 우유의 양만큼 칠해 보세요.", hints: ["0.6 L는 0.1 L가 6칸이에요.", "모두의 양은 6칸에 2칸을 더 칠해요."],
      render: (b, a) => c3Fill(b, a, { panels: [{ kind: "bar", target: 6, label: "재윤이가 짠 우유", end: "1 L" }, { kind: "bar", target: 2, label: "동생이 짠 우유", end: "1 L", color: "#F6C08A" }, { kind: "bar", target: 8, label: "모두", end: "1 L", color: "#A9D8A2" }],
        asks: [["알맞은 식은", { o: ["0.6+0.2", "0.6−0.2", "6+2"], a: 0 }, "이에요."], ["재윤이와 동생이 짠 우유는 모두", { n: "0.8", e: "0.6+0.2", why: { "8": "8칸이에요. 한 칸이 0.1 L예요." } }, "L예요."]],
        ok: "0.1 L가 6칸과 2칸이면 8칸이니 0.6+0.2=0.8이에요. 모두 0.8 L예요." }) },
    { inst: "1.4+2.7을 어떻게 계산하는지 알아봐요. 0.1이 몇 개인지 생각해 보세요.", hints: ["1은 0.1이 10개예요. 1.4는 0.1이 14개예요.", "0.1이 41개이면 4.1이에요."],
      render: (b, a) => c3Sent(b, a, [
        ["1.4는 0.1이", { n: "14" }, "개, 2.7은 0.1이", { n: "27" }, "개예요."],
        ["1.4+2.7은 0.1이", { n: "41" }, "개예요."],
        c3Q("1.4+2.7", "4.1", { why: { "3.11": "0.1이 41개인 수를 다시 생각해 봐요." } })], { fig: () => c3GridFigs([{ v: 1400, div: 10, t: "1.4" }, { v: 2700, div: 10, t: "2.7" }]), ok: "0.1이 14개와 27개를 더하면 41개이니 4.1이에요." }) },
    { inst: "1.4+2.7을 세로로 계산해 보세요. 소수 첫째 자리끼리의 합이 10이거나 10보다 크면 일의 자리로 받아올림해요.", hints: ["소수 첫째 자리: 4+7=11이에요. 1을 쓰고 1을 받아올림해요.", "일의 자리: 1+2+1(받아올린 수)=4예요.", "가운데 점선 칸을 눌러 소수점을 찍어요."],
      render: (b, a) => c3Vert(b, a, { a: "1.4", b: "2.7", op: "+" }) },
    { inst: "소수 한 자리 수의 덧셈 방법을 완성해 보세요.", hints: ["소수점끼리 맞추어 써요.", "합이 10이거나 10보다 크면 바로 윗자리로 받아올림해요."],
      render: (b, a) => blanks(b, a, ["① ", { o: ["소수점", "오른쪽 끝"], a: 0 }, "의 위치를 맞추어 써요. ② 자연수의 덧셈과 같이 ", { o: ["같은 자리 수", "다른 자리 수"], a: 0 }, "끼리 계산해요. ③ 소수점을 그대로 ", { o: ["내려 찍어요", "지워요"], a: 0 }, ". 같은 자리 수끼리의 합이 10이거나 10보다 크면 바로 ", { o: ["윗자리", "아랫자리"], a: 0 }, "로 받아올림해요."]) },
    { inst: "계산해 보세요. 그리고 하준이의 발 길이를 구해 보세요. “작년에 하준이의 발 길이는 21.7 cm였고, 올해는 작년보다 1.3 cm 더 자랐어요.”", hints: ["소수점의 위치를 맞추어 생각해요.", "21.7+1.3은 소수 첫째 자리에서 0.7+0.3=1이 되어 받아올림해요."],
      render: (b, a) => c3Sent(b, a, [
        c3Q("0.4+4.1", "4.5"), c3Q("2.8+1.4", "4.2"), c3Q("1.5+0.3", "1.8"), c3Q("3.9+5.5", "9.4"),
        { q: "올해 하준이의 발 길이는 몇 cm인가요?", p: ["식:", { o: ["21.7+1.3", "21.7−1.3"], a: 0 }, " 답:", { n: "23", e: "21.7+1.3", why: { "22": "0.7+0.3=1을 일의 자리로 받아올림해요." } }, "cm"] }],
        { ok: "소수 한 자리 수의 덧셈을 정확하게 했어요. 21.7+1.3=23이에요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 소수 한 자리 수의 덧셈을 해 보세요.", hints: ["가장 큰 수는 4.3, 가장 작은 수는 2.7이에요.", "수호는 민정이보다 0.6 km 더 걸었어요."],
    render: (b, a) => c3Sent(b, a, [
      ["4.7은 0.1이", { n: "47" }, "개, 1.9는 0.1이", { n: "19" }, "개 → 모두", { n: "66" }, "개 →", "4.7+1.9 =", { n: "6.6", e: "4.7+1.9" }],
      [...c3Q("3.4+2.5", "5.9"), " ", ...c3Q("1.2+4.8", "6")],
      [...c3Q("7.1+0.3", "7.4"), " ", ...c3Q("2.4+5.7", "8.1")],
      ["2.7, 4.3, 3.5, 2.8 중 가장 큰 수와 가장 작은 수의 합은", { n: "7", e: "4.3+2.7" }],
      ["민정이는 1.5 km를 걸었고 수호는 민정이보다 0.6 km 더 걸었어요. 수호가 걸은 거리는", { n: "2.1", e: "1.5+0.6" }, "km"]], { ok: "소수 한 자리 수의 덧셈 문제를 모두 해결했어요!" }) }
},
{
  id: "l7", no: 9, title: "소수 두 자리 수의 덧셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "소수 두 자리 수의 덧셈은 어떻게 할까요?",
  summary: "소수 두 자리 수의 덧셈은 0.01이 몇 개인지 생각하여 계산할 수 있어요. 세로로 계산할 때는 소수점의 위치를 맞추어 쓰고, 자연수의 덧셈과 같이 받아올림하여 계산한 뒤 소수점을 그대로 내려 찍어요. 자리 수가 다르면 끝자리에 0을 붙여 생각할 수 있어요.",
  steps: [
    { inst: "“올해는 대추나무에 대추가 많이 열렸구나.” 동생은 대추를 0.35 kg 수확했고, 재윤이는 동생보다 0.23 kg 더 많이 수확했어요. 모눈 한 칸은 0.01이에요. 동생의 무게 0.35에 이어서 0.23만큼 더 칠해 보세요.", hints: ["0.23은 0.01이 23개예요. 23칸을 더 칠해요.", "모두 35+23=58칸이 돼요."],
      render: (b, a) => c3Fill(b, a, { panels: [{ kind: "grid", pre: 35, target: 58, label: "대추", title: "연두: 동생이 수확한 0.35 kg", preColor: C3C.h, color: "#F6C08A" }],
        asks: [["알맞은 식은", { o: ["0.35+0.23", "0.35−0.23"], a: 0 }, "이에요."], ["재윤이가 수확한 대추는", { n: "0.58", e: "0.35+0.23" }, "kg이에요."]],
        ok: "0.01이 35개와 23개를 더하면 58개이니 0.35+0.23=0.58이에요." }) },
    { inst: "1.82+0.5를 어떻게 계산하는지 알아봐요. 0.01이 몇 개인지 생각해 보세요.", hints: ["0.5=0.50이에요. 0.01이 50개예요.", "0.01이 232개이면 2.32예요."],
      render: (b, a) => c3Sent(b, a, [
        ["1.82는 0.01이", { n: "182" }, "개예요."],
        ["0.5는 0.01이", { n: "50", why: { "5": "0.5는 0.1이 5개예요. 0.1은 0.01이 10개예요." } }, "개예요."],
        ["1.82+0.5는 0.01이", { n: "232" }, "개예요."],
        c3Q("1.82+0.5", "2.32", { why: { "1.87": "0.5는 0.05가 아니에요. 0.01이 50개예요." } })], { ok: "0.01이 182개와 50개를 더하면 232개이니 2.32예요." }) },
    { inst: "1.82+0.5를 세로로 계산해 보세요. 먼저 두 수의 소수점 위치를 맞추어 써요.", hints: ["0.5의 소수점이 1.82의 소수점 바로 아래에 오게 옮겨요.", "0.5=0.50으로 생각하면 소수 둘째 자리는 2+0=2예요.", "소수 첫째 자리: 8+5=13이에요. 3을 쓰고 1을 받아올림해요."],
      render: (b, a) => c3Vert(b, a, { a: "1.82", b: "0.5", op: "+", align: true, pad: true }) },
    { inst: "소수 두 자리 수의 덧셈 방법을 완성해 보세요.", hints: ["오른쪽 끝을 맞추면 안 돼요.", "0.5는 0.50과 같아요."],
      render: (b, a) => blanks(b, a, ["소수 두 자리 수의 덧셈도 ", { o: ["소수점", "오른쪽 끝"], a: 0 }, "의 위치를 맞추어 쓰고, 자연수의 덧셈과 같이 ", { o: ["받아올림", "받아내림"], a: 0 }, "하여 계산해요. 자리 수가 다르면 소수의 오른쪽 끝자리에 ", { o: ["0", "1"], a: 0 }, "을 붙여 생각할 수 있어요. 그리고 소수점을 그대로 내려 찍어요."]) },
    { inst: "계산해 보세요.", hints: ["1.73+3.4는 3.4=3.40으로 생각해요.", "0.28+0.92=1.20=1.2예요."],
      render: (b, a) => c3Sent(b, a, [c3Q("1.73+3.4", "5.13"), c3Q("5.09+4.27", "9.36"), c3Q("0.28+0.92", "1.2"), c3Q("1.65+0.8", "2.45")], { ok: "소수점의 위치를 맞추어 정확하게 더했어요. 1.20처럼 끝자리 0은 쓰지 않아도 돼요." }) }
  ],
  challenge: { inst: "카드 [.] [2] [4] [7]을 한 번씩 모두 사용하여 소수 두 자리 수를 만들고, 친구가 만든 소수 4.27과의 합을 구해 보세요. 수학익힘 문제도 풀어 보세요.", hints: ["소수 두 자리 수는 □.□□ 꼴이에요.", "만든 소수와 4.27의 소수점을 맞추어 더해요."],
    render: (b, a) => c3Cards(b, a, { cards: ["2", "4", "7", "."], n: 4,
      check: s => /^\d\.\d\d$/.test(s) ? null : "소수 두 자리 수는 □.□□ 꼴이에요. 소수점 아래에 숫자가 두 개 오게 놓아요.",
      after: s => [
        ["내가 만든 소수", s, "+ 친구가 만든 소수 4.27 =", { n: c3F(c3E(s + "+4.27")), e: s + "+4.27" }],
        ["밤을 슬기는 1.39 kg, 지호는 1.84 kg 주웠어요. 두 사람이 주운 밤은 모두", { n: "3.23", e: "1.39+1.84" }, "kg"],
        ["합이 더 큰 것은", { o: ["㉠ 0.5+1.56", "㉡ 0.75+1.43"], a: 1 }]],
      ok: s => `${s}+4.27=${c3J(c3F(c3E(s + "+4.27")), "이에요")}. 만들 수 있는 소수는 2.47, 2.74, 4.27, 4.72, 7.24, 7.42예요.` }) }
},
{
  id: "l8", no: 10, title: "소수 한 자리 수의 뺄셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "소수 한 자리 수의 뺄셈은 어떻게 할까요?",
  summary: "소수 한 자리 수의 뺄셈은 0.1이 몇 개인지 생각하여 계산할 수 있어요. 세로로 계산할 때는 소수점의 위치를 맞추어 쓰고, 자연수의 뺄셈과 같이 같은 자리 수끼리 계산하고, 소수점을 그대로 내려 찍어요. 뺄 수 없으면 바로 윗자리에서 받아내림해요.",
  steps: [
    { inst: "“할아버지와 할머니 지팡이는 뭐로 만드는 거예요?” “명아주라는 풀의 줄기로 만든단다.” 할아버지의 지팡이는 0.9 m, 할머니의 지팡이는 0.8 m예요. 막대 한 칸은 0.1 m예요. 두 막대에 지팡이의 길이만큼 칠해 보세요.", hints: ["0.9 m는 9칸, 0.8 m는 8칸이에요.", "두 막대가 몇 칸 차이 나는지 견주어 봐요."],
      render: (b, a) => c3Fill(b, a, { fig: c3Canes, panels: [{ kind: "bar", target: 9, label: "할아버지 지팡이", end: "1 m", color: "#C9A27A" }, { kind: "bar", target: 8, label: "할머니 지팡이", end: "1 m", color: "#E3C59E" }],
        asks: [["알맞은 식은", { o: ["0.9−0.8", "0.9+0.8"], a: 0 }, "이에요."], ["두 막대는", { n: "1" }, "칸 차이가 나요."], ["두 지팡이의 길이의 차는", { n: "0.1", e: "0.9-0.8", why: { "1": "1칸 차이예요. 한 칸은 0.1 m예요." } }, "m예요."]],
        ok: "0.1 m가 9칸과 8칸이니 1칸 차이예요. 0.9−0.8=0.1이에요." }) },
    { inst: "6.5−2.8을 어떻게 계산하는지 알아봐요. 0.1이 몇 개인지 생각해 보세요.", hints: ["6.5는 0.1이 65개예요.", "0.1이 37개이면 3.7이에요."],
      render: (b, a) => c3Sent(b, a, [
        ["6.5는 0.1이", { n: "65" }, "개, 2.8은 0.1이", { n: "28" }, "개예요."],
        ["6.5−2.8은 0.1이", { n: "37" }, "개예요."],
        c3Q("6.5-2.8", "3.7")], { ok: "0.1이 65개에서 28개를 빼면 37개이니 3.7이에요." }) },
    { inst: "6.5−2.8을 세로로 계산해 보세요. 소수 첫째 자리에서 5에서 8을 뺄 수 없으면 일의 자리에서 받아내림해요.", hints: ["일의 자리 6에서 1을 받아내리면 소수 첫째 자리는 15가 돼요. 15−8=7이에요.", "일의 자리: 5−2=3이에요."],
      render: (b, a) => c3Vert(b, a, { a: "6.5", b: "2.8", op: "-" }) },
    { inst: "소수 한 자리 수의 뺄셈 방법을 완성해 보세요.", hints: ["덧셈과 같이 소수점의 위치를 맞추어 써요.", "작은 수에서 큰 수를 뺄 수 없으면 바로 윗자리에서 받아내림해요."],
      render: (b, a) => blanks(b, a, ["① 소수점의 위치를 ", { o: ["맞추어", "다르게"], a: 0 }, " 써요. ② 자연수의 뺄셈과 같이 같은 자리 수끼리 계산해요. 뺄 수 없으면 바로 ", { o: ["윗자리", "아랫자리"], a: 0 }, "에서 ", { o: ["받아올림", "받아내림"], a: 1 }, "해요. ③ 소수점을 그대로 ", { o: ["내려 찍어요", "지워요"], a: 0 }, "."]) },
    { inst: "계산해 보세요. 그리고 은우의 문제를 해결해 보세요. “은우는 쓰레기를 주우면서 1 km를 달리는 지역 행사에 참가했어요. 은우가 0.3 km를 달렸다면 도착점까지 몇 km를 더 달려야 할까요?”", hints: ["계산 결과가 얼마쯤일지 먼저 어림해 봐요.", "1=1.0이에요. 1.0−0.3을 계산해요."],
      render: (b, a) => c3Sent(b, a, [
        c3Q("4.7-1.2", "3.5"), c3Q("8.1-0.7", "7.4"), c3Q("3.6-0.4", "3.2"), c3Q("7.2-4.9", "2.3"),
        { q: "은우가 더 달려야 하는 거리는 몇 km인가요?", p: ["식:", { o: ["1−0.3", "1+0.3"], a: 0 }, " 답:", { n: "0.7", e: "1-0.3" }, "km"] }],
        { ok: "소수 한 자리 수의 뺄셈을 정확하게 했어요. 은우는 0.7 km를 더 달려야 해요." }) }
  ],
  challenge: { inst: "카드 [.] [2] [6] [3] [7] 중 세 장을 골라 만들 수 있는 가장 작은 소수 한 자리 수를 만들고, 그 수에서 1.6을 빼 보세요. 수학익힘 문제도 풀어 보세요.", hints: ["소수 한 자리 수는 □.□ 꼴이에요.", "가장 작은 수를 만들려면 일의 자리에 가장 작은 수를 놓아요."],
    render: (b, a) => c3Cards(b, a, { cards: [".", "2", "6", "3", "7"], n: 3,
      check: s => !/^\d\.\d$/.test(s) ? "소수 한 자리 수는 □.□ 꼴이에요." : s !== "2.3" ? "더 작은 소수 한 자리 수를 만들 수 있어요. 일의 자리와 소수 첫째 자리에 작은 수부터 놓아요." : null,
      after: s => [
        [s, "− 1.6 =", { n: "0.7", e: "2.3-1.6", why: { "1.3": "3에서 6을 뺄 수 없으면 받아내림해요." } }],
        ["5.4보다 0.7만큼 더 작은 수는", { n: "4.7", e: "5.4-0.7" }],
        ["차가 3.8인 뺄셈식을 말한 사람은", { o: ["유하: 4.9−1.2", "도진: 5.1−1.3", "선우: 7.3−3.7"], a: 1 }]],
      ok: "가장 작은 소수 한 자리 수는 2.3이고, 2.3−1.6=0.7이에요." }) }
},
{
  id: "l9", no: 11, title: "소수 두 자리 수의 뺄셈을 해 볼까요", soop: "개념 구축하기(O)",
  question: "소수 두 자리 수의 뺄셈은 어떻게 할까요?",
  summary: "소수 두 자리 수의 뺄셈은 0.01이 몇 개인지 생각하여 계산할 수 있어요. 세로로 계산할 때는 소수점의 위치를 맞추어 쓰고, 자연수의 뺄셈과 같이 받아내림하여 계산한 뒤 소수점을 그대로 내려 찍어요.",
  steps: [
    { inst: "재윤이와 동생은 할아버지 댁에서 0.74 km 떨어진 밭에 명아주를 보러 갔다가 0.23 km를 돌아왔어요. 할아버지 댁까지 남은 거리를 수직선으로 알아봐요. 파란 점 0.74에서 왼쪽으로 0.23만큼 화살표를 그려 보세요.", hints: ["작은 눈금 한 칸은 0.01 km예요.", "0.23은 작은 눈금 23칸이에요. 0.74에서 왼쪽으로 23칸 가요."],
      render: (b, a) => c3Line(b, a, { from: 0, to: 1000, minor: 10, major: 100, mid: 50, start: 740, target: 510, unit: "km",
        asks: [["알맞은 식은", { o: ["0.74−0.23", "0.74+0.23"], a: 0 }, "이에요."], ["할아버지 댁까지 남은 거리는", { n: "0.51", e: "0.74-0.23" }, "km예요."]],
        ok: "0.74에서 왼쪽으로 작은 눈금 23칸을 가면 0.51이에요. 0.74−0.23=0.51이에요." }) },
    { inst: "2.2−1.35를 어떻게 계산하는지 알아봐요. 0.01이 몇 개인지 생각해 보세요.", hints: ["2.2=2.20이에요. 0.01이 220개예요.", "0.01이 85개이면 0.85예요."],
      render: (b, a) => c3Sent(b, a, [
        ["2.2는 0.01이", { n: "220", why: { "22": "2.2=2.20이에요. 0.01이 몇 개일까요?" } }, "개, 1.35는 0.01이", { n: "135" }, "개예요."],
        ["2.2−1.35는 0.01이", { n: "85" }, "개예요."],
        c3Q("2.2-1.35", "0.85")], { ok: "0.01이 220개에서 135개를 빼면 85개이니 0.85예요." }) },
    { inst: "2.2−1.35를 세로로 계산해 보세요. 먼저 두 수의 소수점 위치를 맞추어 써요.", hints: ["2.2=2.20으로 생각하면 소수 둘째 자리는 0−5예요. 뺄 수 없으니 받아내림해요.", "소수 둘째 자리 10−5=5, 소수 첫째 자리 11−3=8, 일의 자리 1−1=0이에요."],
      render: (b, a) => c3Vert(b, a, { a: "2.2", b: "1.35", op: "-", align: true, pad: true }) },
    { inst: "소수 두 자리 수의 뺄셈 방법을 완성해 보세요.", hints: ["2.2는 2.20과 같아요.", "받아내림을 여러 번 할 수도 있어요."],
      render: (b, a) => blanks(b, a, ["소수 두 자리 수의 뺄셈도 ", { o: ["소수점", "오른쪽 끝"], a: 0 }, "의 위치를 맞추어 쓰고, 자연수의 뺄셈과 같이 ", { o: ["받아올림", "받아내림"], a: 1 }, "하여 계산해요. 자리 수가 다르면 끝자리에 ", { o: ["0", "1"], a: 0 }, "을 붙여 생각할 수 있어요. 그리고 소수점을 그대로 내려 찍어요."]) },
    { inst: "계산해 보세요.", hints: ["5.6=5.60으로 생각해요.", "0.69−0.2는 0.2=0.20으로 생각해요."],
      render: (b, a) => c3Sent(b, a, [c3Q("5.6-1.43", "4.17"), c3Q("4.01-3.28", "0.73"), c3Q("0.69-0.2", "0.49", { why: { "0.67": "0.2는 0.02가 아니에요. 소수점의 위치를 맞추어 계산해요." } }), c3Q("2.87-0.39", "2.48")], { ok: "소수점의 위치를 맞추어 정확하게 뺐어요!" }) }
  ],
  challenge: { inst: "0부터 9까지의 수 중에서 □ 안에 들어갈 수 있는 수를 모두 구해 보세요. 8.34−4.6 < 3.□4  수학익힘 문제도 풀어 보세요.", hints: ["먼저 8.34−4.6을 계산해 봐요.", "3.74 < 3.□4가 되려면 □는 7보다 커야 해요."],
    render: (b, a) => c3Sent(b, a, [
      c3Q("8.34-4.6", "3.74"),
      ["3.74 < 3.□4 에서 □ 안에 들어갈 수 있는 수를 모두 골라요:", { m: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], a: [8, 9], bad: "□가 7이면 3.74와 3.74로 같아요. 3.74보다 커야 하니 □는 7보다 커야 해요." }],
      ["4.1은 0.01이", { n: "410" }, "개, 1.57은", { n: "157" }, "개 →", "4.1−1.57 =", { n: "2.53", e: "4.1-1.57" }],
      ["8.2 − 2.58 =", { n: "5.62", e: "8.2-2.58" }, "→ 5.62 − 1.79 =", { n: "3.83", e: "5.62-1.79" }],
      ["유은이의 키는 1.43 m, 동생의 키는 1.28 m예요. 유은이는 동생보다", { n: "0.15", e: "1.43-1.28" }, "m 더 커요."]], { ok: "□ 안에는 8, 9가 들어갈 수 있어요. 소수 두 자리 수의 뺄셈을 잘 활용했어요!" }) }
},
{
  id: "l10", no: 12, title: "생각을 더하다 ― 음식에 포함된 나트륨의 양을 권장량과 비교해 볼까요", soop: "탐구 정리하기(O)",
  question: "오늘 먹은 음식의 나트륨의 양은 하루 권장량보다 얼마나 많을까요?",
  summary: "미소가 먹은 멸치주먹밥·새우볶음밥·제육덮밥의 나트륨은 0.5+0.5+0.8=1.8 (g)이고 어린이 권장량 1.5 g보다 0.3 g 더 많아요. 아버지가 먹은 음식의 나트륨은 0.7+0.9+0.8=2.4 (g)이고 성인 권장량 2 g보다 0.4 g 더 많아요.",
  steps: [
    { name: "이해해요", inst: "오늘 미소와 아버지는 음식을 남김없이 모두 먹었어요. 나트륨은 소금을 이루는 성분 중 하나로 너무 많이 먹으면 건강에 해로워요. 하루 나트륨 권장량은 성인이 2 g, 어린이가 1.5 g이에요. 대화를 읽고 미소가 먹은 음식을 접시에 담아 보세요.", hints: ["미소는 아침에 멸치주먹밥, 점심에 새우볶음밥을 먹었어요.", "“오늘 저녁 메뉴는 제육덮밥이네.” 저녁도 먹었어요."],
      render: (b, a) => c3Plate(b, a, { who: "미소", a: [3, 0, 2], talk: [["미소:", "아버지, 저는 오늘 아침에는 멸치주먹밥, 점심에는 새우볶음밥을 먹었어요. 아버지께서는 오늘 뭐 드셨어요?"], ["아버지:", "아침에는 햄치즈 샌드위치, 점심에는 수제비를 먹었지."], ["미소:", "오늘 저녁 메뉴는 제육덮밥이네."]],
        asks: [["구하려는 것: 미소가 먹은 나트륨의 양은 어린이의 하루 권장량보다", { o: ["몇 g 더 많은지", "몇 g 더 적은지"], a: 0 }], ["어린이의 하루 나트륨 권장량은", { n: "1.5" }, "g이에요."]],
        ok: "미소는 멸치주먹밥, 새우볶음밥, 제육덮밥을 먹었어요. 어린이 권장량은 1.5 g이에요." }) },
    { name: "계획해요", inst: "문제를 어떤 차례로 해결하면 좋을지 계획해 보세요.", hints: ["먼저 미소가 먹은 나트륨의 양을 모두 더해요.", "더한 양과 권장량의 차를 구해요."],
      render: (b, a) => quiz(b, a, [
        { q: "알맞은 계획을 골라 보세요.", o: ["소수의 덧셈으로 미소가 먹은 나트륨의 양을 구한 뒤, 소수의 뺄셈으로 권장량과의 차를 구해요", "권장량에 음식의 나트륨을 모두 더해요", "가장 짠 음식 하나만 권장량과 비교해요"], a: 0 },
        { q: "미소가 먹은 나트륨의 양을 구하는 식은 무엇인가요?", fig: c3Menu, o: ["0.5+0.5+0.8", "0.7+0.9+0.8", "0.5+0.9+0.8"], a: 0, why: { "1": "그것은 아버지가 먹은 음식이에요." } }],
        { ok: "덧셈으로 모두 더한 뒤, 뺄셈으로 권장량과 비교해요." }) },
    { name: "해결해요", inst: "계획대로 문제를 해결해 보세요. 오늘 미소가 먹은 음식에 포함된 나트륨의 양은 어린이의 하루 나트륨 권장량보다 몇 g 더 많을까요?", hints: ["0.5+0.5=1, 1+0.8=1.8이에요.", "1.8−1.5를 계산해요."],
      render: (b, a) => c3Sent(b, a, [
        ["미소가 먹은 나트륨: 0.5 + 0.5 + 0.8 =", { n: "1.8", e: "0.5+0.5+0.8" }, "(g)"],
        ["권장량과의 차: 1.8 − 1.5 =", { n: "0.3", e: "1.8-1.5" }, "(g)"],
        ["미소가 먹은 나트륨의 양은 어린이 권장량보다", { n: "0.3" }, "g 더 많아요."]], { fig: c3Menu, ok: "미소는 나트륨을 1.8 g 먹어서 어린이 권장량보다 0.3 g 더 많이 먹었어요." }) },
    { name: "되돌아봐요", inst: "문제를 해결한 방법을 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "내가 문제를 해결한 방법을 설명해 보세요.", tag: "방법", ph: "예) 먼저 세 음식의 나트륨을 더해 1.8 g을 구하고, 1.8에서 1.5를 빼서 0.3 g을 구했어요." },
        { q: "다른 방법으로도 해결할 수 있을까요?", tag: "다른 방법", ph: "예) 0.1이 몇 개인지 생각해서 5+5+8=18개, 18−15=3개이니 0.3 g이에요." },
        { q: "나트륨을 너무 많이 먹지 않으려면 어떻게 하면 좋을까요?", tag: "생활", ph: "예) 국물을 덜 먹어요." }]) },
    { name: "척척! 내 힘으로", inst: "오늘 미소네 아버지가 먹은 음식에 포함된 나트륨의 양은 성인의 하루 나트륨 권장량보다 몇 g 더 많을까요? 먼저 아버지가 먹은 음식을 접시에 담아 보세요.", hints: ["아버지는 아침에 햄치즈샌드위치, 점심에 수제비, 저녁에 제육덮밥을 먹었어요.", "성인 권장량은 2 g이에요. 2=2.0이에요."],
      render: (b, a) => c3Plate(b, a, { who: "아버지", a: [4, 1, 2],
        asks: [["아버지가 먹은 나트륨: 0.7 + 0.9 + 0.8 =", { n: "2.4", e: "0.7+0.9+0.8" }, "(g)"], ["권장량과의 차: 2.4 − 2 =", { n: "0.4", e: "2.4-2", why: { "2.2": "2는 0.2가 아니에요. 2=2.0으로 생각해요." } }, "(g)"]],
        ok: "아버지는 나트륨을 2.4 g 먹어서 성인 권장량보다 0.4 g 더 많이 먹었어요." }) }
  ],
  challenge: { inst: "더 생각해 봐요. 미소가 저녁에 제육덮밥 대신 새우볶음밥을 먹었다면 어떻게 될까요? 그리고 아버지는 미소보다 나트륨을 몇 g 더 먹었을까요? (이 자료에서 더한 문제예요.)", hints: ["0.5+0.5+0.5를 계산해요.", "아버지 2.4 g, 미소 1.8 g의 차를 구해요."],
    render: (b, a) => c3Sent(b, a, [
      ["0.5 + 0.5 + 0.5 =", { n: "1.5", e: "0.5+0.5+0.5" }, "(g) → 어린이 권장량과", { o: ["같아요", "더 많아요", "더 적어요"], a: 0 }],
      ["오늘 아버지는 미소보다 나트륨을 2.4 − 1.8 =", { n: "0.6", e: "2.4-1.8" }, "g 더 먹었어요."]], { fig: c3Menu, ok: "음식을 바꾸면 권장량에 맞출 수 있어요. 소수의 덧셈과 뺄셈은 건강을 챙길 때도 쓰여요." }) }
},
{
  id: "l11", no: 13, title: "놀이를 더하다 ― 소수를 수어로 표현할 수 있다고?", soop: "발표하기(P)",
  question: "소수를 수어로 전달하고, 전달받은 소수의 크기를 어떻게 비교할까요?",
  summary: "4명씩 모둠을 만들어 첫 번째 사람이 쓴 소수 두 자리 수를 수어로 차례로 전달하고, 마지막 사람이 쓴 소수와 같으면 조건 카드에 맞는 모둠이 1점을 얻어요. 소수의 크기는 자연수 부분부터 차례대로 비교해요.",
  steps: [
    { name: "놀이 방법 알기", inst: "교과서의 놀이 방법을 읽고 답해 보세요. 수어는 숫자 1~9와 소수점(.)의 손 모양을 교과서 그림을 보며 모둠별로 10분 동안 연습해요.", hints: ["첫 번째 사람은 선생님이 수어로 알려 주는 일의 자리 수를 쓰고, 수 카드 두 장을 뽑아 소수 첫째·둘째 자리에 써요.", "두 사람이 쓴 소수가 다르면 그 모둠은 점수를 얻을 수 없어요."],
      render: (b, a) => quiz(b, a, [
        { q: "첫 번째 사람은 스케치북에 어떤 수를 쓰나요?", o: ["선생님이 알려 준 일의 자리 수와 뽑은 수 카드 두 장으로 만든 소수 두 자리 수", "아무 자연수", "선생님이 알려 준 수 그대로"], a: 0 },
        { q: "수어는 어느 방향으로 표현하나요?", o: ["친구가 보는 방향으로", "내가 보는 방향으로"], a: 0 },
        { q: "마지막 사람과 첫 번째 사람이 쓴 소수가 다르면 어떻게 되나요?", o: ["그 모둠은 점수를 얻을 수 없어요", "그 모둠이 1점을 얻어요"], a: 0 },
        { q: "놀이에서 이기려면 무엇을 잘해야 할까요? 모두 골라 보세요.", o: ["수어를 정확하게 표현하기", "소수의 크기를 비교하는 방법 알기", "가장 빨리 소리쳐 말하기"], a: [0, 1] }],
        { ok: "수어로 정확하게 전하고, 소수의 크기를 정확하게 비교하면 이길 수 있어요." }) },
    { name: "수 카드 뽑기", inst: "내가 첫 번째 사람이에요. 주머니에서 수 카드를 뽑아 소수를 만들어 보세요.", hints: ["뽑은 첫 번째 카드는 소수 첫째 자리, 두 번째 카드는 소수 둘째 자리에 써요.", "소수 첫째 자리 숫자 3은 0.3, 소수 둘째 자리 숫자 3은 0.03을 나타내요."],
      render: (b, a) => c3Bag(b, a) },
    { name: "조건 카드", inst: "모든 모둠의 전달이 끝나면 선생님이 조건 카드 한 장을 뽑아요. 카드에 적힌 내용에 해당하는 모둠이 1점을 얻어요.", hints: ["먼저 첫 번째 사람과 마지막 사람이 쓴 소수가 같은 모둠만 골라 내요.", "일의 자리 수가 같으면 소수 첫째 자리, 소수 둘째 자리 차례로 비교해요."],
      render: (b, a) => c3Teams(b, a, { ok: "조건에 맞는 모둠을 모두 찾았어요. 소수의 크기를 차례대로 잘 비교했어요!" }) },
    { name: "또 다른 놀이", inst: "또 다른 놀이 방법이에요. 자연수 부분이 9인 소수 두 자리 수 두 개가 적힌 문제를 들고, 더 큰 소수를 수어로 설명하면 친구가 보고 말해요. 1분 동안 몇 문제를 맞힐 수 있을까요?", hints: ["자연수 부분이 9로 같아요.", "소수 첫째 자리 수부터 비교해요."],
      render: (b, a) => c3Bigger(b, a, { n: 6, ok: "더 큰 소수를 빠르고 정확하게 골랐어요!" }) },
    { name: "되돌아보기", inst: "놀이를 되돌아보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "두 소수 두 자리 수의 크기를 어떻게 비교했나요?", tag: "비교 방법", ph: "예) 일의 자리 수가 같으면 소수 첫째 자리 수를 비교하고, 그것도 같으면 소수 둘째 자리 수를 비교했어요." },
        { q: "수어로 전달할 때 친구를 위해 어떤 점을 배려했나요?", tag: "배려", ph: "예) 친구가 잘 볼 수 있게 천천히, 친구가 보는 방향으로 표현했어요." }]) }
  ],
  challenge: { inst: "모둠에서 전달한 소수예요. 크기를 비교해 보세요.", hints: ["자연수 부분이 같으면 소수 첫째 자리부터 비교해요.", "9.6=9.60이에요."],
    render: (b, a) => c3Sent(b, a, [
      ["4.37, 4.73, 4.07 중 가장 큰 소수는", { o: ["4.37", "4.73", "4.07"], a: 1 }],
      ["9.58", { o: [">", "=", "<"], a: 2, why: { "0": "9.6=9.60이에요. 소수 첫째 자리 5와 6을 비교해요." } }, "9.6"],
      ["6.05", { o: [">", "=", "<"], a: 2 }, "6.50"],
      ["2.81, 2.18, 2.8 중 가장 작은 소수는", { o: ["2.81", "2.18", "2.8"], a: 1 }]], { ok: "소수의 크기를 정확하게 비교했어요!" }) }
},
{
  id: "l12", no: 14, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "소수의 덧셈과 뺄셈 단원에서 배운 내용을 잘 알고 있나요?",
  summary: "소수 두 자리 수와 세 자리 수를 쓰고 읽고, 자리마다 차례대로 크기를 비교하고, 10배·[1/10]의 관계를 알고, 소수점의 위치를 맞추어 소수의 덧셈과 뺄셈을 해요.",
  steps: [
    { name: "쓰고 읽기", inst: "척척! 내 힘으로 풀어요. □ 안에 알맞은 수나 말을 넣어 보세요.", hints: ["소수점 아래 숫자는 하나씩 읽어요.", "1.603은 0.001이 1603개예요.", "0.351에서 5는 소수 둘째 자리 숫자예요."],
      render: (b, a) => c3Sent(b, a, [
        ["이 점 팔구오는", { n: "2.895" }, "라고 써요."],
        ["5.09는", { t: ["오 점 영구"] }, "라고 읽어요."],
        ["0.01이 48개인 수는", { n: "0.48", why: { "4.8": "0.1이 48개인 수가 4.8이에요." } }, "이에요."],
        ["1.603은 0.001이", { n: "1603" }, "개예요."],
        ["4.592의 5는 0.5를 나타내요. 0.351의 5는", { n: "0.05" }, ", 1.285의 5는", { n: "0.005" }, "를 나타내요."]], { ok: "소수를 쓰고 읽고, 자릿값을 정확하게 알아요!" }) },
    { name: "계산하기", inst: "계산해 보세요.", hints: ["소수점의 위치를 맞추어 계산해요.", "4.3−2.56은 4.3=4.30으로 생각해요."],
      render: (b, a) => c3Sent(b, a, [c3Q("0.6+2.1", "2.7"), c3Q("5.7-1.9", "3.8"), c3Q("3.64+3.88", "7.52"), c3Q("4.3-2.56", "1.74")], { ok: "소수의 덧셈과 뺄셈을 정확하게 했어요!" }) },
    { name: "관계와 크기", inst: "나타내는 수가 같은 것끼리 찾고, 세 소수를 큰 수부터 차례대로 써 보세요.", hints: ["0.007의 100배는 0.7이에요.", "0.7의 [1/10]은 0.07이에요.", "5.28은 자연수 부분이 가장 커요."],
      render: (b, a) => c3Sent(b, a, [
        ["0.007의 100배와 나타내는 수가 같은 것은", { o: ["0.07의 10배", "7의 [1/100]"], a: 0 }],
        ["0.7의 [1/10]과 나타내는 수가 같은 것은", { o: ["0.07의 10배", "7의 [1/100]"], a: 1 }],
        ["㉠ 4.295 ㉡ 4.286 ㉢ 5.28을 큰 수부터 차례대로:", { o: ["㉢, ㉠, ㉡", "㉠, ㉡, ㉢", "㉢, ㉡, ㉠", "㉠, ㉢, ㉡"], a: 0, why: { "1": "소수점 아래 숫자가 많다고 큰 수가 아니에요. 자연수 부분부터 비교해요.", "2": "4.295와 4.286은 소수 둘째 자리 9와 8을 비교해요." } }]], { ok: "0.007의 100배와 0.07의 10배는 0.7, 0.7의 [1/10]과 7의 [1/100]은 0.07이에요." }) },
    { name: "잘못 고치기", inst: "★ 누군가 3.8+5.76을 왼쪽처럼 계산했어요. 잘못 계산한 까닭을 고르고, 옳게 계산해 보세요.", hints: ["두 수의 오른쪽 끝을 맞추어 썼어요.", "소수점끼리 세로로 맞추어 써요.", "3.8=3.80으로 생각하면 3.80+5.76이에요."],
      render: (b, a) => c3Vert(b, a, { a: "3.8", b: "5.76", op: "+", align: true, pad: true,
        fig: () => h("div", {}, h("div", { class: "c3cap" }, "잘못 계산한 세로셈"), c3CharTable([["", "", "3", ".", "8"], ["+", "5", ".", "7", "6"], ["", "6", ".", "1", "4"]])),
        reason: { q: "잘못 계산한 까닭은", o: ["소수점의 위치를 맞추어 쓰지 않았어요", "받아올림을 하지 않았어요", "자연수 부분만 더했어요"], a: 0, why: { "1": "받아올림보다 먼저, 두 수를 어떻게 맞추어 썼는지 살펴봐요." } },
        ok: "소수의 덧셈을 할 때는 소수점의 위치를 맞추어 써야 해요. 3.8+5.76=9.56이에요." }) },
    { name: "꼭꼭! 색칠하기", inst: "꼭꼭! 확인하고 정리해요. 식의 합 또는 차를 찾아 그 식의 색으로 칠해 보세요.", hints: ["1.2+0.5=1.7이에요.", "2.67+2.49는 받아올림이 두 번 있어요.", "답이 아닌 수가 적힌 칸은 칠하지 않아요."],
      render: (b, a) => c3Color(b, a, { items: [{ e: "1.2+0.5", c: "#F4A7B9" }, { e: "2.67+2.49", c: "#9CC6EC" }, { e: "5.3-1.8", c: "#F6C08A" }, { e: "4.38-1.41", c: "#A9D8A2" }],
        labels: { earL: "1.7", earR: "1.7", head: "5.16", body: "3.5", carrot: "2.97", grass: "4.16", sun: "4.5" },
        ok: "1.2+0.5=1.7, 2.67+2.49=5.16, 5.3−1.8=3.5, 4.38−1.41=2.97이에요. 4.16과 4.5는 받아올림·받아내림을 빠뜨렸을 때 나오는 수예요." }) }
  ],
  challenge: { inst: "★★ 음료수 2 L 중에서 하준이는 0.35 L, 채아는 0.26 L를 마셨어요. 하준이와 채아가 마시고 남은 음료수의 양은 몇 L인지 알아보세요.", hints: ["먼저 두 사람이 마신 양을 더해요.", "2=2.00으로 생각하고 2−0.61을 계산해요."],
    render: (b, a) => c3Sent(b, a, [
      ["두 사람이 마신 양: 식", { o: ["0.35+0.26", "0.35−0.26"], a: 0 }, "=", { n: "0.61", e: "0.35+0.26", why: { "0.51": "소수 둘째 자리 5+6=11이에요. 받아올림해요." } }, "L"],
      ["남은 양: 2 −", { n: "0.61" }, "=", { n: "1.39", e: "2-0.61" }, "L"]], { ok: "두 사람이 마신 양은 0.61 L, 남은 음료수는 1.39 L예요." }) }
}
];
