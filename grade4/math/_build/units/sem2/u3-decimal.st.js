//@@APP
const APP={title:"우리 반 운동회 기록원", unit:"4-2 수학 3. 소수의 덧셈과 뺄셈", key:"s42-decimal-v1", welcome:"우리 반 운동회 기록원 교실에 온 것을 환영해요", intro:"4학년 2반 기록원 모둠과 함께 멀리뛰기·이어달리기·공 던지기 기록과 마신 물의 양을 소수로 쓰고, 비교하고, 더하고 빼 봐요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(sem2/u3-decimal.tb.js)의 c3 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   (입력칸 0.9초 · 고르기 0.26초 · 칠하기·끌기·카드 놓기 1.2초) 이 파일에서 새로 만든 부품·그림은 앞글자 c3s. */
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
/* 엔진의 hj-multi(한 계단 두 활동)가 셀 수 있게 'function 이름(body, api' 꼴로 감싸요. 안에서 엔진 부품이 api.done(을 불러요. */
quiz = function quiz(body, api, items, o) { /* 엔진 quiz가 api.done( 을 불러요 */ return c3Quiz0(body, c3A(api), items, o); };
blanks = function blanks(body, api, parts, o) { /* 엔진 blanks가 api.done( 을 불러요 */ return c3Blanks0(body, c3A(api), parts, o); };

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
/* ===== 저절로 확인하기 (이야기 버전) =====
   ready(): 다 했는지(아직 쓰거나 고르는 중이면 false) · sig(): 지금 상태 글 · judge(): 채점해서 맞으면 true.
   입력칸 0.9초, 고르기 0.26초, 칠하기·끌기·카드·단추 1.2초 기다렸다가 확인해요. 같은 상태로는 다시 세지 않아요. */
function c3sAuto(root, ready, sig, judge) {
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
/* 묻는 칸이 다 찼나요? 읽는 말(글 칸)은 칸을 떠나야(Enter·다른 곳 누르기) 다 쓴 것으로 봐요 — 한글을 쓰는 중에 확인하지 않게 */
function c3sFilled(reg) {
  return reg.items.every(it => it.k === "n" ? it.inp.value.trim() !== "" : it.k === "t" ? it.inp.value.trim() !== "" && document.activeElement !== it.inp :
    it.k === "m" ? it.sel.size >= it.pt.a.length : it.sel.size > 0);
}
function c3sSig(reg) { return reg.items.map(it => it.inp ? it.inp.value.trim() : [...it.sel].sort().join(",")).join("§"); }

/* ① 빈칸 줄 문제 */
function c3Sent(body, api, rows, opt = {}) {
  c3Style();
  const reg = c3Reg(), box = h("div");
  if (opt.fig) box.append(opt.fig());
  box.append(c3Rows(rows, reg));
  body.append(box);
  api.provide({ words: opt.words || [], answers: reg.plain.filter(Boolean) });
  c3sAuto(box, () => c3sFilled(reg), () => c3sSig(reg), () => {
    const r = c3Judge(reg, opt);
    if (r.bad) { api.fail(r.bad, r.given); return false; }
    api.tryOnce(); api.done(r.given, opt.ok); return true;
  });
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
  c3sAuto(body, () => P.every(p => p.n !== p.pre) && c3sFilled(reg), () => P.map(p => p.n).join(",") + "#" + c3sSig(reg), () => {
    const wrong = P.find(p => p.n !== p.target);
    const got = P.map(p => p.n).join(",");
    if (wrong) { api.fail(wrong.why || `${wrong.label ? wrong.label + ": " : ""}${wrong.n > wrong.target ? "너무 많이 칠했어요." : "덜 칠했어요."} 한 칸이 얼마를 나타내는지 생각해 봐요.`, "칠한 칸 " + got); return false; }
    const r = c3Judge(reg, opt);
    if (r.bad) { api.fail(r.bad, "칠한 칸 " + got + " / " + r.given); return false; }
    api.tryOnce(); api.done("칠한 칸 " + got + (r.given ? " / " + r.given : ""), opt.ok); return true;
  });
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
      txt(x1 + 52, 60, opt.deco.name || "", 18, { fill: C3C.dark }));
  }
  if (opt.deco && opt.deco.kind === "drop") { // 마신 물의 양 표시(물방울)
    const x1 = X(opt.deco.at);
    g.append(svgEl("path", { d: `M${x1} 44 q-13 20 -13 30 a13 13 0 0 0 26 0 q0 -10 -13 -30z`, fill: "#7FB8E8", stroke: "#2B7BD6", "stroke-width": 2 }),
      svgEl("line", { x1, y1: 88, x2: x1, y2: 126, stroke: "#2B7BD6", "stroke-width": 1.5, "stroke-dasharray": "3 3" }), txt(x1 + 48, 60, opt.deco.name || "", 18, { fill: C3C.dark }));
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
  c3sAuto(body, () => pos !== base && c3sFilled(reg), () => pos + "#" + c3sSig(reg), () => {
    if (pos !== opt.target) { api.fail(opt.why || `작은 눈금 한 칸이 ${c3F(opt.minor)}예요. 몇 칸 옮겨야 하는지 다시 세어 봐요.`, "화살표 " + c3F(pos)); return false; }
    const r = c3Judge(reg, opt);
    if (r.bad) { api.fail(r.bad, "화살표 " + c3F(pos) + " / " + r.given); return false; }
    api.tryOnce(); api.done("화살표 " + c3F(pos) + (r.given ? " / " + r.given : ""), opt.ok); return true;
  });
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
  c3sAuto(body, () => v !== 0 && c3sFilled(reg), () => v + "#" + c3sSig(reg), () => {
    if (v !== target) { api.fail(opt.why || (v > target ? "모눈에 칠한 수가 더 커요. 덜어 내 봐요." : "모눈에 칠한 수가 더 작아요. 더 칠해 봐요."), "모눈 " + c3F(v)); return false; }
    const r = c3Judge(reg, opt);
    if (r.bad) { api.fail(r.bad, "모눈 " + c3F(v) + " / " + r.given); return false; }
    api.tryOnce(); api.done("모눈 " + c3F(v) + (r.given ? " / " + r.given : ""), opt.ok); return true;
  });
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
    if (k !== next) { api.hint(`높은 자리부터 차례대로 비교해요. 지금은 ‘${NAMES[next]}’를 누를 차례예요.`); return; }
    const x = part(A, k), y = part(B, k), xs = x == null ? "0" : x, ys = y == null ? "0" : y;
    if (x == null) { rowA[k].textContent = "0"; rowA[k].classList.add("c3ghost"); }
    if (y == null) { rowB[k].textContent = "0"; rowB[k].classList.add("c3ghost"); }
    const cx = +xs, cy = +ys;
    [rowA[k], rowB[k]].forEach(td => td.classList.add(cx === cy ? "c3same" : "c3diff"));
    rowR[k].textContent = cx === cy ? "같아요" : `${xs} ${cx > cy ? ">" : "<"} ${ys}`;
    if (cx !== cy || k === NAMES.length - 1) { found = k; signBox.classList.remove("hidden"); say.textContent = cx !== cy ? `${NAMES[k]}에서 크기가 정해졌어요. 알맞은 기호를 골라요.` : "모든 자리가 같아요. 알맞은 기호를 골라요."; }
    else { next = k + 1; say.textContent = `${NAMES[k]}가 같아요. 다음 자리를 눌러요.`; }
    mark();
  }
  mark();
  body.append(h("div", { class: "c3say" }, "자릿값 표의 이름 단추를 높은 자리부터 차례대로 눌러 두 수를 비교해요."), h("div", { style: "overflow-x:auto" }, tbl), say, signBox);
  api.provide({ words: ["자연수 부분", "소수 첫째 자리", "소수 둘째 자리", "소수 셋째 자리"], answers: [`${A} ${sign} ${B}`] });
  c3sAuto(body, () => found != null && pick != null, () => String(pick), () => {
    const btn = [...signBox.querySelectorAll(".opt")].find(b => b.textContent === pick);
    if (pick !== sign) { btn.classList.add("bad"); api.fail(opt.why || "크기가 정해진 자리의 숫자를 다시 견주어 봐요. 그 자리 숫자가 큰 수가 더 커요.", `${A} ${pick} ${B}`); return false; }
    btn.classList.add("good"); api.tryOnce(); api.done(`${A} ${pick} ${B}`, opt.ok || `${c3J(`${A} ${sign} ${B}`, "이에요")}. 높은 자리부터 차례대로 비교했어요!`); return true;
  });
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
  let warned = "";
  c3sAuto(body, () => {
    if (!c3sFilled(reg)) return false;
    const miss = (opt.need || []).find(s => !done.has(c3F(c3P(s))));
    if (miss) { const sg = c3sSig(reg); if (warned !== sg) { warned = sg; api.hint("판에서 ‘10배’, ‘[1/10]’ 단추를 눌러 직접 만들어 보고 써요. 아직 판에서 만들어 보지 않은 수가 있어요."); } return false; }
    return true;
  }, () => c3sSig(reg), () => {
    const r = c3Judge(reg, opt);
    if (r.bad) { api.fail(r.bad, r.given); return false; }
    api.tryOnce(); api.done(r.given, opt.ok); return true;
  });
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
  let aligned = !opt.align, phase = "";
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
    const off0 = off; let moved = false; phase = "align";
    const say = h("div", { class: "c3say" }, "​");
    const draw = (dx = 0) => {
      gb.innerHTML = "";
      gb.append(svgEl("rect", { x: 40 + off * cw + dx - 4, y: 108, width: B.length * cw + 8, height: 76, rx: 12, fill: "#DCEAFB", stroke: "#2B7BD6", "stroke-width": 2 }));
      [...B].forEach((ch, k) => gb.append(txt(colX(off + k) + dx, 150, ch, 50, { fill: INK })));
      if (off !== off0) moved = true;
      say.textContent = off === okOff ? "소수점끼리 세로로 나란해졌어요." : "파란 수 카드를 끌어 옮겨 보세요.";
    };
    g.append(svgEl("line", { x1: colX(aDot), y1: 20, x2: colX(aDot), y2: 240, stroke: "#C8472E", "stroke-width": 1.5, "stroke-dasharray": "6 5" }));
    let sx = null, base = 0;
    dragOn(svg, pt => { if (pt.y < 100 || pt.y > 195) return false; sx = pt.x; base = off; }, pt => { const k = Math.round((pt.x - sx) / cw), no = Math.max(lo, Math.min(hi, base + k)); if (no !== off) { off = no; draw(); } });
    draw();
    const tools = h("div", { class: "c3tools" }, h("button", { onclick: () => { off = Math.max(lo, off - 1); draw(); } }, "◀ 왼쪽으로"), h("button", { onclick: () => { off = Math.min(hi, off + 1); draw(); } }, "오른쪽으로 ▶"));
    const pane = h("div");
    pane.append(h("div", { class: "c3say" }, "① 소수점의 위치를 맞추어 써요. 아래 수(파란 카드)를 끌거나 단추로 옮겨 소수점끼리 맞추어 보세요. 맞추면 저절로 다음 단계로 넘어가요."), reasonRow || "", h("div", { class: "c3stage c3sm" }, svg), say, tools);
    stage.append(pane);
    c3sAuto(pane, () => phase === "align" && (moved || off !== off0) && (!reasonRow || c3sFilled(reg)), () => off + "#" + c3sSig(reg), () => {
      if (reasonRow) { const r = c3Judge(reg); if (r.bad) { api.fail(r.bad, r.given); return false; } }
      if (off !== okOff) { api.fail(off === ca + A.length - B.length ? "오른쪽 끝을 맞추면 안 돼요. 소수점끼리 세로로 나란히 맞추어요." : "빨간 점선이 지나는 소수점 자리에 아래 수의 소수점도 오게 옮겨요.", "자리 맞추기"); return false; }
      aligned = true; api.hint("○ 소수점끼리 맞추었어요! 이제 같은 자리 수끼리 계산해요."); calcPhase(); return true;
    });
  }
  /* 2단계: 같은 자리 수끼리 계산 → 소수점 내려 찍기 */
  function calcPhase() {
    stage.innerHTML = ""; phase = "calc";
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
    stage.append(out);
    const exI = rI.padStart(I, " ");
    /* 꼭 써야 하는 칸: 일의 자리 위쪽의 빈 자리와 끝자리 0은 비워도 돼요 */
    const need = ins.map((x, k) => k < I ? exI[k].trim() !== "" : !rD.slice(k - I).split("").every(c => c === "0"));
    let dotWarn = "";
    c3sAuto(stage, () => phase === "calc" && ins.every((x, k) => !need[k] || x.value !== ""), () => ins.map(x => x.value).join(",") + (dotOn ? "." : ""), () => {
      const iv = ins.slice(0, I).map(x => x.value), dv = ins.slice(I).map(x => x.value);
      const given = iv.join("") + (dotOn ? "." : "") + dv.join("");
      let wrong = false;
      iv.forEach((v, k) => { const e = exI[k].trim(), ok = v === e || (e === "" && v === "0"); ins[k].style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok) wrong = true; });
      dv.forEach((v, k) => { const e = rD[k], trail = rD.slice(k).split("").every(c => c === "0") && dv.slice(k).every(x => x === "" || x === "0"); const ok = v === e || (v === "" && trail); ins[I + k].style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok) wrong = true; });
      if (wrong) {
        const gv = c3P(given.replace(/\.$/, ""));
        api.fail((gv != null && c3Diag(`${A}${op}${B}`, dotOn ? gv : null)) || `같은 자리 수끼리 계산했는지, ${word}을 했는지 살펴봐요. 빨간 칸을 다시 계산해요.`, given || "-"); return false;
      }
      if (!dotOn) { if (dotWarn !== given) { dotWarn = given; api.hint("숫자는 모두 맞아요! ③ 가운데 점선 칸을 눌러 소수점을 그대로 내려 찍어요."); } return false; }
      out.textContent = `${A} ${OPS} ${B} = ${c3F(R)}`; out.classList.remove("hidden");
      api.tryOnce(); api.done(`${A}${OPS}${B}=${given}`, opt.ok || `${A} ${OPS} ${B} = ${c3J(c3F(R), "이에요")}. 소수점을 맞추어 쓰고, 같은 자리끼리 계산하고, 소수점을 내려 찍었어요!`); return true;
    });
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
  c3sAuto(body, () => !!made && c3sFilled(reg), () => made + "#" + c3sSig(reg), () => {
    const r = c3Judge(reg, opt);
    if (r.bad) { api.fail(r.bad, made + " / " + r.given); return false; }
    api.tryOnce(); api.done(made + " / " + r.given, typeof opt.ok === "function" ? opt.ok(made) : opt.ok); return true;
  });
}

/* ===== 그림: 사람 ===== */
function c3Person(g, x, y, c, s = 1, hair = "#4A3A2E") {
  g.append(svgEl("rect", { x: x - 14 * s, y: y + 14 * s, width: 28 * s, height: 38 * s, rx: 10 * s, fill: c }),
    svgEl("circle", { cx: x, cy: y, r: 14 * s, fill: "#F5D0A9", stroke: INK, "stroke-width": 1.2 }),
    svgEl("path", { d: `M${x - 14 * s} ${y - 2 * s} a${14 * s} ${14 * s} 0 0 1 ${28 * s} 0 q-${14 * s} -${6 * s} -${28 * s} 0z`, fill: hair }),
    svgEl("rect", { x: x - 11 * s, y: y + 50 * s, width: 8 * s, height: 18 * s, fill: "#5C6B7A" }), svgEl("rect", { x: x + 3 * s, y: y + 50 * s, width: 8 * s, height: 18 * s, fill: "#5C6B7A" }));
}
function c3Talk(lines) { return h("div", { class: "c3talk" }, lines.map(([who, t]) => h("p", {}, h("b", {}, who + " "), t))); }
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
  const isAns = r => IT.some(it => it.v === c3P(labels[r.id]));
  c3sAuto(body, () => R.every(r => !isAns(r) || fills[r.id] != null), () => R.map(r => fills[r.id]).join(","), () => {
    const given = Object.entries(fills).filter(([, v]) => v != null).map(([k, v]) => `${labels[k]}:${IT[v].e}`).join(" ");
    for (const r of R) {
      const lv = c3P(labels[r.id]), want = IT.findIndex(it => it.v === lv), f = fills[r.id];
      if (want < 0 && f != null) { api.fail(`${labels[r.id]}${c3J(labels[r.id], "은는").slice(labels[r.id].length)} 어느 식의 답도 아니에요. 계산을 다시 살펴봐요.`, given); return false; }
      if (want >= 0 && f !== want) { api.fail(`${labels[r.id]} 칸의 색이 맞지 않아요. 그 칸에 알맞은 식을 다시 찾아요.`, given); return false; }
    }
    api.tryOnce(); api.done(given, opt.ok); return true;
  });
}

/* ===== 이야기 버전에서 새로 만든 것 (앞글자 c3s) ===== */
const c3Rand = n => Math.floor(Math.random() * n);
/* 운동회 기록판 그림: rows = [[종목, 이름, 기록], …] */
function c3sBoard(title, rows) {
  c3sStyle();
  return h("div", { class: "c3sbd" }, h("div", { class: "c3sbt" }, "📋 " + title),
    h("table", {}, h("tr", {}, ["종목", "이름", "기록"].map(t => h("th", {}, t))), rows.map(r => h("tr", {}, r.map(c => h("td", {}, c))))));
}
function c3sStyle() {
  if (document.getElementById("c3s-style")) return;
  const st = document.createElement("style"); st.id = "c3s-style";
  st.textContent = `
.c3sbd{border:3px solid #C9A36B;border-radius:1em;background:#FFFBF2;padding:.4em .8em .6em;margin:.3em 0 .6em;max-width:36em}
.c3sbt{font-family:Jua,sans-serif;color:#8A5A2B;font-size:calc(var(--fs)*1.08);margin-bottom:.2em}
.c3sbd table{border-collapse:collapse;width:100%;font-family:Jua,sans-serif}
.c3sbd th,.c3sbd td{border-bottom:2px dashed #E6D3B3;padding:.2em .4em;text-align:center}
.c3sbd th{color:var(--muted);font-weight:400;font-size:.85em}
.c3sdl{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,11em),1fr));gap:.7em;margin:.4em 0}
.c3sdl .opt{font-family:Jua,sans-serif;text-align:center;font-size:calc(var(--fs)*1.25)}
.c3sdl .opt small{display:block;font-size:.65em;color:var(--muted)}
.c3sev{display:inline-block;background:#FFF1D6;border-radius:.6em;padding:.05em .7em;font-family:Jua,sans-serif;color:#8A5A2B}
`;
  document.head.append(st);
}
/* 기록 대결 놀이: 두 친구의 기록을 보고 이긴 친구를 고르기 (opt.n 판).
   멀리뛰기·공 던지기·물 마시기는 큰 수가, 달리기는 작은 수(걸린 시간이 짧은 기록)가 이겨요. 잘못 고르면 그 판을 다시 골라요. */
const C3S_EV = [
  { ev: "멀리뛰기", unit: "m", big: true, I: [1, 1], d: [1, 2] },
  { ev: "50 m 달리기", unit: "초", big: false, I: [8, 10], d: [1, 2] },
  { ev: "공 던지기", unit: "m", big: true, I: [14, 19], d: [1, 2] },
  { ev: "물 마시기", unit: "L", big: true, I: [0, 0], d: [2, 3] }];
const C3S_NM = ["윤서", "민재", "하린", "도현", "수아", "준호", "서연", "지우"];
function c3sDuel(body, api, opt = {}) {
  c3Style(); c3sStyle();
  const N = opt.n || 8; let k = 0, wrong = 0, cur = null, locked = false; const t0 = Date.now();
  const head = h("div", { class: "c3cap" }, "​"), box = h("div", { class: "c3sdl" }), say = h("div", { class: "c3say" }, "​");
  const frac = d => d === 1 ? (1 + c3Rand(9)) * 100 : d === 2 ? (1 + c3Rand(99)) * 10 : 1 + c3Rand(999);
  const make = () => {
    const E = C3S_EV[k % C3S_EV.length], I = E.I[0] + c3Rand(E.I[1] - E.I[0] + 1);
    let a, b;
    do {
      const Ib = c3Rand(4) ? I : Math.max(E.I[0], Math.min(E.I[1], I + (c3Rand(2) ? 1 : -1)));
      a = I * 1000 + frac(E.d[c3Rand(2)]); b = Ib * 1000 + frac(E.d[c3Rand(2)]);
    } while (a === b || Math.abs(a - b) > 900);
    const ns = [...C3S_NM].sort(() => Math.random() - .5).slice(0, 2);
    cur = { E, v: [a, b], ns, win: (E.big ? a > b : a < b) ? 0 : 1 };
    locked = false; box.innerHTML = "";
    head.innerHTML = ""; head.append(`${k + 1} / ${N}판 · `, h("span", { class: "c3sev" }, E.ev), E.big ? " 기록이 큰 친구가 이겨요." : " 걸린 시간이 짧은(기록이 작은) 친구가 이겨요.");
    cur.v.forEach((v, i) => box.append(h("button", { class: "opt", onclick: ev => pick(i, ev.currentTarget) }, h("small", {}, ns[i]), `${c3F(v)} ${E.unit}`)));
  };
  function pick(i, btn) {
    if (locked) return;
    const { E, v, ns, win } = cur, said = `${E.ev} ${c3F(v[0])}, ${c3F(v[1])} → ${ns[i]}`;
    if (i !== win) { wrong++; btn.classList.add("bad"); return api.fail(E.big ? "자연수 부분부터, 그다음 소수 첫째 자리, 소수 둘째 자리 차례로 견주어 큰 기록을 찾아요. 소수점 아래 숫자가 많다고 큰 수가 아니에요." : "달리기는 걸린 시간이 짧을수록 빨라요. 두 기록 중 더 작은 수를 찾아요.", said); }
    locked = true; btn.classList.add("good"); k++;
    if (k >= N) { const sec = Math.round((Date.now() - t0) / 1000); say.textContent = `${N}판을 ${sec}초 만에 끝냈어요! 잘못 고른 횟수 ${wrong}번.`; api.tryOnce(); return api.done(`${N}판 · ${sec}초 · 잘못 고름 ${wrong}`, opt.ok); }
    say.textContent = `맞아요! ${ns[win]}의 승리예요. 다음 판이에요.`; setTimeout(make, 700);
  }
  make();
  body.append(h("div", { class: "c3say" }, opt.tip || "두 친구의 기록을 보고 이긴 친구의 기록 카드를 눌러요."), head, box, say);
  api.provide({ words: ["자연수 부분", "소수 첫째 자리", "소수 둘째 자리"], answers: ["이긴 친구의 기록을 골라요"] });
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
const UNIT_STORY = { title: "우리 반 운동회 기록원", lines: [
  "햇살초등학교 가을 운동회 날, 4학년 2반은 ‘기록원 모둠’을 맡았어요. 기록 반장 윤서와 민재, 하린, 도현, 수아가 줄자·초시계·계량컵을 들고 운동장을 누벼요.",
  "멀리뛰기 거리, 50 m 달리기 기록, 공 던지기 거리, 마신 물의 양을 소수 두 자리 수·세 자리 수로 적고, 기록을 비교하고, 물을 10배·[1/10]로 나누고, 기록을 더하고 빼요.",
  "마지막에는 기록 카드 대결 놀이를 하고, 운동회 기록 발표회에서 배운 것을 정리해요."],
  one: "우리 반 운동회 기록원 · 운동회 기록을 소수로 쓰고 비교하며, 소수점을 맞추어 소수를 더하고 빼요." };
const UNIT_KEYWORDS = ["소수", "소수점", "소수 두 자리 수", "소수 세 자리 수", "0.01", "0.001", "일의 자리", "소수 첫째 자리", "소수 둘째 자리", "소수 셋째 자리", "자릿값", "크기 비교", "10배", "[1/10]", "소수점 맞추기", "받아올림", "받아내림"];

const C3PL = ["일의 자리", "소수 첫째 자리", "소수 둘째 자리", "소수 셋째 자리"];
const CMP = [">", "=", "<"];
const LESSONS = [
{
  id: "s1", no: 1, title: "운동회 기록원이 되었어요", soop: "개념 찾기(S)",
  question: "운동회 기록에는 어떤 소수가 쓰이고, 소수를 더하고 빼야 할 때는 언제일까요?",
  summary: "운동회 기록판에는 1.37 m, 9.48초, 0.246 L처럼 소수점 아래 숫자가 두 개, 세 개인 소수가 나와요. 모두 얼마인지 구할 때는 더하고, 남은 양이나 차를 구할 때는 빼요. 3학년 때 배운 0.1과 소수 한 자리 수의 크기 비교를 떠올려 두면 이 단원을 잘 배울 수 있어요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "운동회 날 아침, 기록 반장 윤서가 지난 연습 때 적은 기록판을 들고 왔어요. 기록판을 보고 세 칸에 써서 붙여요.", hints: ["기록판에서 소수점(.)이 있는 기록을 찾아봐요.", "두 기록을 합하거나 차이를 구할 일을 떠올려요."],
      render: (b, a) => { b.append(c3sBoard("4학년 2반 운동회 연습 기록판", [["멀리뛰기", "민재", "1.37 m"], ["50 m 달리기", "하린", "9.48초"], ["공 던지기", "도현", "18.6 m"], ["물 마시기", "수아", "0.246 L"]]));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "기록판에 ~이 보여요", hint: "기록판에서 보이는 것", ex: ["민재의 멀리뛰기 기록 1.37 m처럼 소수점 아래 숫자가 두 개인 소수가 보여요.", "수아가 마신 물 0.246 L는 소수점 아래 숫자가 세 개예요."] },
          { t: "생각해요", e: "💭", ph: "~할 때 소수를 더하거나 빼야 할 것 같아요", hint: "소수를 쓰거나 계산할 일", ex: ["1.37 m는 1.3 m와 1.4 m 사이의 거리일 것 같아요.", "두 친구의 기록 차이를 구하려면 소수끼리 빼야 할 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 할까?", hint: "소수에 대해 궁금한 것", ex: ["1.37은 어떻게 읽을까?", "소수점 아래 숫자가 많으면 더 큰 수일까?"] }],
          { ok: "운동회 기록판에는 소수가 가득해요! 이 단원에서 소수를 읽고, 비교하고, 더하고 빼 봐요." }); } },
    { name: "그려 보기 — 0.1 떠올리기", inst: "준비 운동으로 줄넘기 줄을 재요. 1 m를 똑같이 10칸으로 나눈 막대에 하린이가 쓴 줄 0.7 m만큼 칠하고, 빈칸을 채워 보세요.", hints: ["한 칸은 1 m를 똑같이 10으로 나눈 것 중의 하나예요.", "0.1이 10개이면 1이에요."],
      render: (b, a) => c3Fill(b, a, { panels: [{ kind: "bar", target: 7, label: "하린이의 줄", end: "1 m" }], asks: [
        ["1 m를 똑같이 10칸으로 나눈 한 칸은", { n: "0.1" }, "m예요."],
        ["0.7은 0.1이", { n: "7" }, "개인 수예요."],
        ["0.1이 13개인 수는", { n: "1.3", why: { "0.13": "0.1이 10개이면 1이에요. 0.1이 13개이면 1과 0.3이에요.", "13": "0.1이 10개이면 1이에요." } }, "이에요."]],
        ok: "0.7 m는 0.1 m가 7개예요. 3학년 때 배운 소수 한 자리 수를 잘 기억하고 있어요." }) },
    { name: "말해 보기 — 소수로 적는 기록", inst: "운동회에서 기록원이 적을 것들이에요. 소수로 나타내기에 알맞은 것을 모두 골라 보세요.", hints: ["길이·시간·들이처럼 재어서 나타내는 양은 1보다 작은 부분이 생길 때가 많아요.", "사람 수처럼 하나, 둘 세는 것은 자연수로 나타내요."],
      render: thenWhy((b, a) => quiz(b, a, [{ q: "소수로 나타내기에 알맞은 기록을 모두 골라 보세요.", o: ["멀리뛰기 거리", "50 m 달리기에 걸린 시간", "마신 물의 양", "이어달리기에 나간 학생 수"], a: [0, 1, 2] }],
        { ok: "거리, 걸린 시간, 물의 양은 재어서 나타내는 양이라 소수로 적을 때가 많아요. 학생 수는 자연수로 세요." }),
        { q: "운동회 기록을 자연수가 아니라 소수로 적으면 좋은 점은 무엇일까요?", ph: "소수로 적으면 ~", help: ["① 1.3 m와 1.37 m처럼 소수점 아래 숫자가 하나 더 있으면 무엇이 달라지는지 생각해요. → ② 비슷한 기록을 가릴 때를 떠올려요.", "‘소수로 적으면 ~보다 작은 부분까지 나타낼 수 있어서 ~’ 꼴로 써요."],
          ans: "1 m나 1초보다 작은 부분까지 적을 수 있어서 기록을 더 정확하게 나타내고, 비슷한 기록도 누가 더 잘했는지 가릴 수 있어요." }) },
    { name: "약속하기 — 소수 한 자리 수 떠올리기", inst: "3학년 때 배운 소수 한 자리 수의 크기 비교와 읽기를 떠올려 보세요.", hints: ["자연수 부분이 같으면 소수 첫째 자리 수를 비교해요.", "소수점은 ‘점’으로 읽어요."],
      render: (b, a) => c3Sent(b, a, [
        ["0.6", { o: CMP, a: 2 }, "0.8"],
        ["1.4", { o: CMP, a: 0 }, "1.2"],
        ["2.5를 읽으면", { t: ["이 점 오"] }, "예요."],
        ["공 던지기 18.6 m와 18.4 m 중 더 멀리 던진 기록은", { o: ["18.6 m", "18.4 m"], a: 0 }, "예요."]], { ok: "소수 한 자리 수는 자연수 부분부터, 그다음 소수 첫째 자리 수를 비교해요." }) },
    { name: "확인하기 — 더할까, 뺄까?", inst: "기록원 모둠이 운동회 날 구해야 할 것들이에요. 덧셈으로 구할지, 뺄셈으로 구할지 골라 보세요.", hints: ["‘모두’, ‘합하면’은 덧셈이에요.", "‘남은’, ‘몇 m 더’는 뺄셈이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "민재가 멀리뛰기 연습에서 두 번 뛴 거리를 모두 합하면 몇 m일까?", o: ["덧셈", "뺄셈"], a: 0, why: { "1": "두 거리를 ‘모두 합하는’ 것이에요." } },
        { q: "물 1 L 중에서 수아가 마시고 남은 물은 몇 L일까?", o: ["덧셈", "뺄셈"], a: 1, why: { "0": "마시고 ‘남은’ 양은 처음 양에서 마신 양을 빼서 구해요." } },
        { q: "도현이는 민재보다 공을 몇 m 더 멀리 던졌을까?", o: ["덧셈", "뺄셈"], a: 1, why: { "0": "얼마나 ‘더’ 멀리 던졌는지는 두 기록의 차예요." } },
        { q: "이어달리기 1구간과 2구간의 거리를 합하면 몇 km일까?", o: ["덧셈", "뺄셈"], a: 0, why: { "1": "두 구간을 ‘합하는’ 것이에요." } }],
        { ok: "모두 얼마인지는 덧셈으로, 남은 양이나 차는 뺄셈으로 구해요. 이제 소수를 더하고 빼는 방법을 하나씩 알아봐요." }) }
  ],
  challenge: { inst: "★ 도전 — 도현이의 공 던지기 기록 18.6 m를 살펴보세요.", hints: ["18은 0.1이 180개예요.", "소수점 아래 숫자는 하나씩 읽어요."],
    render: (b, a) => c3Sent(b, a, [
      ["18.6은 0.1이", { n: "186", why: { "86": "18은 0.1이 180개예요.", "18.6": "0.1이 몇 개인지 자연수로 써요." } }, "개인 수예요."],
      ["18.6을 읽으면", { t: ["십팔 점 육"] }, "이에요."],
      ["0.4보다 0.1이 3개 더 많은 수는", { n: "0.7", e: "0.4+0.3" }, "이에요."]], { ok: "18.6은 0.1이 186개이고, 십팔 점 육이라고 읽어요." }) }
},
{
  id: "s2", no: 2, title: "멀리뛰기 기록을 재요 ― 소수 두 자리 수", soop: "개념 구축하기(O)",
  question: "0.1보다 작은 부분까지 기록하려면 어떻게 할까요?",
  summary: "1을 똑같이 100칸으로 나눈 한 칸 [1/100]은 소수로 0.01이라 쓰고 영 점 영일이라고 읽어요. [23/100]=0.23(영 점 이삼)은 0.01이 23개예요. 1.37에서 1은 일의 자리 숫자로 1을, 3은 소수 첫째 자리 숫자로 0.3을, 7은 소수 둘째 자리 숫자로 0.07을 나타내요.",
  steps: [
    { name: "만져 보기 — 민재의 멀리뛰기", inst: "민재가 제자리 멀리뛰기를 했어요. 발뒤꿈치가 닿은 곳은 1.3 m와 1.4 m 사이예요. 0.1 m씩 나뉜 줄자의 칸이 다시 똑같이 10칸으로 나뉘어 있어요. 파란 표시를 민재가 닿은 곳으로 옮겨 보세요.", hints: ["민재는 1.3 m보다 조금 더, 1.4 m보다 조금 덜 뛰었어요.", "1.3 m에서 작은 눈금 7칸 더 간 곳이에요.", "0.1을 다시 10칸으로 나누면 1을 100칸으로 나눈 것과 같아요."],
      render: (b, a) => c3Line(b, a, { from: 1000, to: 1500, minor: 10, major: 100, mid: 50, target: 1370, unit: "m", deco: { kind: "walk", at: 1370, name: "민재" },
        asks: [
          ["민재의 기록은", { o: ["1.2 m와 1.3 m", "1.3 m와 1.4 m", "1.4 m와 1.5 m"], a: 1 }, "사이예요."],
          ["1.3 m에서 작은 눈금", { n: "7" }, "칸만큼 더 갔어요."],
          { fig: () => c3Fig(c3ZoomSvg({ from: 0, to: 1000, step: 100 })), q: "1을 똑같이 10칸으로 나누면 0.1이에요. 0.1을 다시 똑같이 10칸으로 나누면?", p: ["작은 눈금 한 칸은 1을 똑같이", { n: "100", why: { "10": "0.1을 10칸으로 나누었으니 1 전체는 10칸씩 10묶음, 100칸이에요." } }, "칸으로 나눈 것 중의 하나예요."] },
          ["작은 눈금 한 칸의 크기를 분수로 나타내면", { o: ["[1/10]", "[1/100]", "[1/1000]"], a: 1 }, "이에요."]],
        ok: "민재는 1 m에서 작은 눈금 37칸만큼 더 뛰었어요. 작은 눈금 한 칸은 [1/100] m예요. 이 기록을 소수로 써 볼까요?" }) },
    { name: "그려 보기 — 구름판 표시 붙이기", inst: "윤서는 출발선에서 [23/100] m 앞에 구름판 표시 테이프를 붙이려고 해요. 0부터 1까지 작은 눈금이 [1/100]씩 있는 수직선에 화살표를 [23/100]만큼 그려 보세요.", hints: ["[23/100]은 [1/100]이 23개예요. 0에서 작은 눈금 23칸만큼 가요.", "[1/100]=0.01이에요. 0.01이 23개이면 0.23이에요.", "소수점 아래 숫자는 하나씩 읽어요."],
      render: (b, a) => c3Line(b, a, { from: 0, to: 1000, minor: 10, major: 100, mid: 50, target: 230, unit: "m",
        asks: [
          ["[23/100]은 [1/100]이", { n: "23" }, "개예요."],
          ["[1/100]=0.01이므로 [23/100]은 0.01이", { n: "23" }, "개 → 소수로", { n: "0.23", why: { "23": "0.01이 23개인 수를 소수로 써요.", "2.3": "0.1이 23개인 수가 2.3이에요. 여기는 0.01이 23개예요." } }],
          ["0.23은", { o: ["영 점 이삼", "영 점 이십삼"], a: 0, why: { "1": "소수점 아래 숫자는 자릿값을 붙이지 않고 숫자만 하나씩 읽어요." } }, "이라고 읽어요."]],
        ok: "[23/100]=0.23이에요. 0.23은 0.01이 23개이고, 영 점 이삼이라고 읽어요." }) },
    { name: "말해 보기 — 민재의 기록을 모눈에", inst: "민재의 기록 [1 37/100] m를 소수로 나타내어 봐요. 단추를 눌러 모눈종이에 [1 37/100]만큼 칠해 보세요. 모눈종이 한 장 전체가 1이에요.", hints: ["[1 37/100]은 1과 [37/100]이에요.", "[37/100]은 0.1이 3개, 0.01이 7개예요.", "+1 한 번, +0.1 세 번, +0.01 일곱 번 눌러요."],
      render: thenWhy((b, a) => c3Build(b, a, { target: "1.37", units: [1000, 100, 10], legend: ["one", "t", "h"],
        asks: [
          ["[37/100]을 소수로 나타내면", { n: "0.37" }, "이에요."],
          ["[1 37/100]은 1과 0.37만큼이므로 소수로", { n: "1.37", why: { "0.37": "1만큼도 더해야 해요.", "137": "소수점을 빠뜨렸어요." } }, "이에요."],
          ["1.37은 1이", { n: "1" }, "개, 0.1이", { n: "3" }, "개, 0.01이", { n: "7" }, "개예요."]],
        ok: "[1 37/100]=1.37이에요. 1.37은 1이 1개, 0.1이 3개, 0.01이 7개인 수예요." }),
        { q: "민재의 기록 1.37을 ‘일 점 삼십칠’이라고 읽으면 안 되는 까닭은 무엇일까요?", ph: "3은 ~, 7은 ~이라서", help: ["① 1.37에서 3과 7이 각각 어느 자리 숫자인지 떠올려요. → ② 소수점 아래 숫자를 읽는 방법을 생각해요.", "‘3은 ~ 자리, 7은 ~ 자리 숫자라서 ~처럼 읽어요.’ 꼴로 써요."],
          ans: "3은 소수 첫째 자리 숫자로 0.3을, 7은 소수 둘째 자리 숫자로 0.07을 나타내요. 37이 아니므로 소수점 아래 숫자는 하나씩 ‘일 점 삼칠’이라고 읽어요." }) },
    { name: "약속하기 — 소수 두 자리 수", inst: "멀리뛰기 기록을 재며 찾은 것을 약속해요. 알맞은 말을 골라 보세요.", hints: ["0.01은 영 점 영일이라고 읽어요.", "1.37에서 3은 소수 첫째 자리, 7은 소수 둘째 자리 숫자예요."],
      render: (b, a) => blanks(b, a, ["분수 [1/100]은 소수로 ", { o: ["0.1", "0.01", "0.001"], a: 1 }, "이라 쓰고, ", { o: ["영 점 일", "영 점 영일"], a: 1 }, "이라고 읽어요. 1.37에서 3은 ", { o: ["일의 자리", "소수 첫째 자리", "소수 둘째 자리"], a: 1 }, " 숫자이고 ", { o: ["3", "0.3", "0.03"], a: 1 }, "을 나타내요. 7은 ", { o: ["소수 첫째 자리", "소수 둘째 자리"], a: 1 }, " 숫자이고 ", { o: ["0.7", "0.07"], a: 1 }, "을 나타내요."],
        { ok: "1.37은 1이 1개, 0.1이 3개, 0.01이 7개인 수예요. 일 점 삼칠이라고 읽어요." }) },
    { name: "확인하기 — 기록 쓰고 읽기", inst: "모눈종이에 색칠된 부분이 나타내는 소수를 쓰고 읽어 보세요. 그리고 친구들의 기록에서 □ 안에 알맞은 수나 말을 넣어 보세요. (읽는 말은 다 쓰고 Enter를 눌러요.)", hints: ["분홍 세로 한 줄은 0.1, 연두 한 칸은 0.01이에요.", "소수 둘째 자리 숫자 5는 0.01이 5개, 곧 0.05를 나타내요."],
      render: (b, a) => c3Sent(b, a, [
        { fig: () => h("div", {}, c3Legend(["t", "h"]), c3GridFigs([{ v: 520, t: "왼쪽" }, { v: 90, t: "오른쪽" }])), p: ["왼쪽: 0.1이", { n: "5" }, "개, 0.01이", { n: "2" }, "개 →", { n: "0.52" }, "읽기:", { t: ["영 점 오이"] }] },
        ["오른쪽: 0.1이", { n: "0" }, "개, 0.01이", { n: "9" }, "개 →", { n: "0.09", why: { "0.9": "0.01이 9개예요. 0.1이 9개인 수가 0.9예요." } }, "읽기:", { t: ["영 점 영구"] }],
        { g: "친구들의 기록", rows: [
          ["하린이의 멀리뛰기 1.48 m에서 4는", { o: C3PL.slice(0, 3), a: 1 }, "숫자이고,", { n: "0.4", why: { "0.04": "4는 소수 첫째 자리 숫자예요." } }, "를 나타내요."],
          ["도현이의 멀리뛰기 1.65 m에서 5는", { o: C3PL.slice(0, 3), a: 2 }, "숫자이고,", { n: "0.05", why: { "0.5": "5는 소수 둘째 자리 숫자예요. 0.01이 5개예요.", "5": "5는 소수점 아래에 있어요." } }, "를 나타내요."],
          ["출발선과 구름판 사이 3.07 m에서 3은", { o: C3PL.slice(0, 3), a: 0 }, "숫자이고,", { n: "3" }, "을 나타내요."]] }],
        { ok: "소수 두 자리 수를 쓰고 읽고, 각 자리 숫자가 나타내는 수를 알았어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 기록원 수첩의 문제를 풀어 보세요.", hints: ["1 m=100 cm이므로 1 cm=0.01 m예요.", "1.2와 1.3 사이를 똑같이 10칸으로 나누었으니 작은 눈금 한 칸은 0.01이에요."],
    render: (b, a) => c3Sent(b, a, [
      ["수아의 멀리뛰기 기록 145 cm를 m로 나타내면", { n: "1.45", why: { "14.5": "1 m=100 cm이므로 1 cm=0.01 m예요." } }, "m예요."],
      { fig: () => c3LineFig({ from: 1200, to: 1300, minor: 10, major: 100, mid: 50 }, 1260), p: ["수직선의 □에 알맞은 소수는", { n: "1.26", why: { "1.6": "작은 눈금 한 칸은 0.01이에요." } }] },
      ["0.1이 8개, 0.01이 5개인 수는", { n: "0.85" }, "예요."]], { ok: "145 cm=1.45 m예요. 소수 두 자리 수를 여러 가지로 나타낼 수 있어요!" }) }
},
{
  id: "s3", no: 3, title: "마신 물의 양을 재요 ― 소수 세 자리 수", soop: "개념 구축하기(O)",
  question: "0.01보다 작은 양은 어떻게 쓰고 읽을까요?",
  summary: "1을 똑같이 1000칸으로 나눈 한 칸 [1/1000]은 소수로 0.001이라 쓰고 영 점 영영일이라고 읽어요. [246/1000]=0.246(영 점 이사육)은 0.001이 246개예요. 1.358은 1이 1개, 0.1이 3개, 0.01이 5개, 0.001이 8개인 수이고, 0.001이 1358개인 수이기도 해요.",
  steps: [
    { name: "만져 보기 — 수아가 마신 물", inst: "달리기를 마친 수아가 물을 마셨어요. 계량컵으로 재어 보니 0.24 L와 0.25 L 사이였어요. 0.24와 0.25 사이를 똑같이 10칸으로 나눈 수직선에서 파란 표시를 물방울이 있는 곳으로 옮겨 보세요.", hints: ["물방울은 0.24 L보다 조금 오른쪽에 있어요.", "0.24에서 작은 눈금이 몇 칸인지 세어 봐요.", "0.01을 다시 10칸으로 나누면 1을 1000칸으로 나눈 것과 같아요."],
      render: ruleFirst((b, a) => c3Line(b, a, { from: 240, to: 250, minor: 1, major: 10, mid: 5, target: 246, unit: "L", deco: { kind: "drop", at: 246, name: "수아" },
        asks: [
          ["수아가 마신 물은 0.24 L에서 작은 눈금", { n: "6" }, "칸만큼 더 있어요."],
          { fig: () => c3Fig(c3ZoomSvg({ from: 0, to: 100, step: 10 })), q: "1을 똑같이 100칸으로 나누면 0.01이에요. 0.01을 다시 똑같이 10칸으로 나누면?", p: ["작은 눈금 한 칸은 1을 똑같이", { n: "1000", why: { "100": "0.01은 1을 100칸으로 나눈 것이고, 그것을 다시 10칸으로 나누었어요." } }, "칸으로 나눈 것 중의 하나예요."] },
          ["작은 눈금 한 칸의 크기를 분수로 나타내면", { o: ["[1/10]", "[1/100]", "[1/1000]"], a: 2 }, "이에요."]],
        ok: "작은 눈금 한 칸은 [1/1000] L예요. 수아는 0.24 L보다 작은 눈금 6칸만큼 더 마셨어요." }),
        { q: "0.01을 다시 똑같이 10칸으로 나누면 작은 눈금 한 칸은 얼마일까요?", ph: "내 예상: 한 칸은 ~", help: ["① 1을 10칸으로 나누면 0.1, 0.1을 10칸으로 나누면 0.01이었던 것을 떠올려요. → ② 한 번 더 10칸으로 나누면 1을 몇 칸으로 나눈 것인지 생각해요.", "‘내 예상: 1을 ~칸으로 나눈 것이라서 한 칸은 ~예요.’ 꼴로 써요."],
          ans: "0.01을 10칸으로 나누면 1을 1000칸으로 나눈 것과 같아요. 그래서 한 칸은 [1/1000]이고, 소수로 0.001이에요." }) },
    { name: "그려 보기 — [246/1000]을 소수로", inst: "수아가 마신 물의 양을 분수로 나타내면 [246/1000] L예요. 소수로 나타내고 읽어 보세요.", hints: ["[246/1000]은 [1/1000]이 246개예요.", "[1/1000]=0.001이에요. 0.001이 246개이면 0.246이에요.", "소수점 아래 숫자는 하나씩 읽어요."],
      render: (b, a) => c3Sent(b, a, [
        { fig: () => c3LineFig({ from: 240, to: 250, minor: 1, major: 10, mid: 5, unit: "L" }, 246, "수아"), p: ["[246/1000]은 [1/1000]이", { n: "246" }, "개예요."] },
        ["[1/1000]은 소수로", { n: "0.001", why: { "0.01": "0.01은 [1/100]이에요. [1/1000]은 0.01을 다시 10칸으로 나눈 한 칸이에요." } }, "이라 쓰고,", { t: ["영 점 영영일"] }, "이라고 읽어요."],
        ["[246/1000]은 0.001이 246개 → 소수로", { n: "0.246", why: { "246": "0.001이 246개인 수를 소수로 써요.", "2.46": "0.01이 246개인 수가 2.46이에요. 여기는 0.001이 246개예요.", "24.6": "0.001이 246개예요. 소수점 아래 숫자가 세 개예요." } }],
        ["0.246은", { o: ["영 점 이사육", "영 점 이백사십육"], a: 0, why: { "1": "소수점 아래 숫자는 하나씩 읽어요." } }, "이라고 읽어요."]],
      { ok: "[246/1000]=0.246이에요. 0.246은 0.001이 246개이고, 영 점 이사육이라고 읽어요." }) },
    { name: "말해 보기 — 모둠이 마신 물", inst: "기록원 모둠 다섯 명이 마신 물을 모두 모아 재었더니 [1 358/1000] L였어요. 단추를 눌러 모눈종이에 [1 358/1000]만큼 칠해 보세요. 모눈종이 한 장 전체가 1이고, 0.01 한 칸을 다시 10줄로 나누었어요.", hints: ["[1 358/1000]은 1과 [358/1000]이에요.", "[358/1000]은 0.1이 3개, 0.01이 5개, 0.001이 8개예요.", "+1 한 번, +0.1 세 번, +0.01 다섯 번, +0.001 여덟 번 눌러요."],
      render: thenWhy((b, a) => c3Build(b, a, { target: "1.358", units: [1000, 100, 10, 1], div: 1000, legend: ["one", "t", "h", "k"],
        asks: [
          ["[358/1000]을 소수로 나타내면", { n: "0.358" }, "이에요."],
          ["[1 358/1000]은 소수로", { n: "1.358", why: { "0.358": "1만큼도 더해야 해요.", "1358": "소수점을 빠뜨렸어요." } }, "이에요."],
          ["1.358은 1이", { n: "1" }, "개, 0.1이", { n: "3" }, "개, 0.01이", { n: "5" }, "개, 0.001이", { n: "8" }, "개예요."]],
        ok: "[1 358/1000]=1.358이에요. 일 점 삼오팔이라고 읽어요." }),
        { q: "1.358은 0.001이 몇 개인 수일까요? 어떻게 세었는지 말해 봐요.", ph: "1은 0.001이 ~개, 0.358은 ~", help: ["① 1은 0.001이 몇 개인지 생각해요. → ② 0.358은 0.001이 몇 개인지 더해요.", "‘1은 0.001이 ~개, 0.358은 0.001이 ~개라서 모두 ~개예요.’ 꼴로 써요."],
          ans: "1은 0.001이 1000개, 0.358은 0.001이 358개라서 1.358은 0.001이 1358개인 수예요." }) },
    { name: "약속하기 — 소수 세 자리 수", inst: "물의 양을 재며 찾은 것을 약속해요. 알맞은 말을 골라 보세요.", hints: ["0.001은 영 점 영영일이라고 읽어요.", "1.358에서 8은 소수점 아래 셋째 자리에 있어요."],
      render: (b, a) => blanks(b, a, ["분수 [1/1000]은 소수로 ", { o: ["0.01", "0.001"], a: 1 }, "이라 쓰고, ", { o: ["영 점 영일", "영 점 영영일"], a: 1 }, "이라고 읽어요. 1.358에서 8은 ", { o: ["소수 둘째 자리", "소수 셋째 자리"], a: 1 }, " 숫자이고 ", { o: ["0.08", "0.008"], a: 1 }, "을 나타내요. 1.358은 0.001이 ", { o: ["358개", "1358개"], a: 1 }, "인 수예요."],
        { ok: "1.358은 1이 1개, 0.1이 3개, 0.01이 5개, 0.001이 8개인 수이고, 0.001이 1358개인 수예요." }) },
    { name: "확인하기 — 물의 양 쓰고 읽기", inst: "전체 크기가 1인 모눈종이에 친구들이 마신 물의 양을 색칠했어요. 색칠된 부분이 나타내는 소수를 쓰고 읽고, □ 안에 알맞은 말이나 수를 넣어 보세요. (읽는 말은 다 쓰고 Enter를 눌러요.)", hints: ["분홍 한 줄은 0.1, 연두 한 칸은 0.01, 주황 가는 줄은 0.001이에요.", "0.01이 없으면 소수 둘째 자리에 0을 써요."],
      render: (b, a) => c3Sent(b, a, [
        { fig: () => h("div", {}, c3Legend(["t", "h", "k"]), c3GridFigs([{ v: 427, div: 1000, t: "윤서" }, { v: 603, div: 1000, t: "도현" }])), p: ["윤서:", { n: "0.427" }, "L · 읽기:", { t: ["영 점 사이칠"] }] },
        ["도현:", { n: "0.603", why: { "0.63": "0.01은 없고 0.001이 3개예요. 소수 둘째 자리에 0을 써요." } }, "L · 읽기:", { t: ["영 점 육영삼"] }],
        { g: "자릿값", rows: [
          ["2.519에서 1은", { o: C3PL, a: 2 }, "숫자이고,", { n: "0.01", why: { "0.1": "1은 소수 둘째 자리 숫자예요." } }, "을 나타내요."],
          ["4.086에서 6은", { o: C3PL, a: 3 }, "숫자이고,", { n: "0.006", why: { "0.06": "6은 소수 셋째 자리 숫자예요. 0.001이 6개예요." } }, "을 나타내요."]] }],
      { ok: "소수 세 자리 수를 쓰고 읽고, 각 자리 숫자가 나타내는 수를 알았어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 조건에 맞는 소수를 찾아보세요.", hints: ["5와 6 사이이면 일의 자리 숫자는 5예요.", "0.001이 1000개이면 1이에요."],
    render: (b, a) => c3Sent(b, a, [
      ["5와 6 사이, 소수 둘째 자리 숫자는 3, 0.1이 7개, 0.001이 2개인 소수 세 자리 수는", { n: "5.732" }],
      ["0.001이 2075개인 수는", { n: "2.075", why: { "20.75": "0.001이 1000개이면 1이에요. 2000개이면 2예요.", "0.2075": "0.001이 1000개이면 1이에요." } }],
      ["도현이가 잰 거리 16.408 m를 읽으면", { t: ["십육 점 사영팔"] }]], { ok: "5.732, 2.075, 십육 점 사영팔이에요. 소수 세 자리 수를 자유롭게 쓰고 읽을 수 있어요!" }) }
},
{
  id: "s4", no: 4, title: "누구 기록이 더 클까요 ― 소수의 크기 비교", soop: "개념 구축하기(O)",
  question: "자리 수가 다른 소수는 어떻게 비교할까요?",
  summary: "0.64와 0.46은 0.01이 각각 64개, 46개이므로 0.64가 더 커요. 0.5와 0.50은 같은 수이고, 필요하면 소수의 오른쪽 끝자리에 0을 붙여 나타낼 수 있어요. 소수의 크기는 자연수 부분, 소수 첫째 자리, 소수 둘째 자리, 소수 셋째 자리 수를 차례대로 비교해요. 18.25 < 18.3처럼 소수점 아래 숫자가 많다고 큰 수가 아니에요.",
  steps: [
    { name: "만져 보기 — 물을 더 많이 마신 모둠", inst: "윤서 모둠은 물을 0.64 L, 민재 모둠은 0.46 L 마셨어요. 모눈 한 칸이 0.01이에요. 두 모둠이 마신 양만큼 모눈을 칠해 보세요.", hints: ["0.64는 0.01이 64개예요. 세로 한 줄이 10칸이에요.", "칠한 칸이 많은 쪽이 더 큰 수예요."],
      render: (b, a) => c3Fill(b, a, { panels: [{ kind: "grid", target: 64, label: "윤서 모둠", title: "윤서 모둠 0.64 L" }, { kind: "grid", target: 46, label: "민재 모둠", title: "민재 모둠 0.46 L", color: C3C.k }],
        asks: [
          ["0.64는 0.01이", { n: "64" }, "개, 0.46은 0.01이", { n: "46" }, "개예요."],
          ["물을 더 많이 마신 모둠은", { o: ["윤서 모둠", "민재 모둠"], a: 0 }, "이에요."]],
        ok: "0.64는 0.01이 64개, 0.46은 46개예요. 윤서 모둠이 물을 더 많이 마셨어요." }) },
    { name: "그려 보기 — 0.5와 0.50", inst: "도현이의 물병에는 ‘0.5 L’, 하린이의 물병에는 ‘0.50 L’라고 쓰여 있어요. 0.5는 세로 줄(0.1)로, 0.50은 한 칸(0.01)씩 칠해 보세요.", hints: ["0.5는 0.1이 5개예요. 세로 줄 5개를 칠해요.", "0.50은 0.01이 50개예요."],
      render: ruleFirst((b, a) => c3Fill(b, a, { panels: [{ kind: "col", target: 50, label: "0.5", title: "0.5 L (세로 줄로 칠하기)", color: C3C.t }, { kind: "grid", target: 50, label: "0.50", title: "0.50 L (한 칸씩 칠하기)", color: C3C.h }],
        asks: [
          ["0.5는 0.1이", { n: "5" }, "개, 0.50은 0.01이", { n: "50" }, "개예요."],
          ["0.5와 0.50은", { o: ["크기가 같아요", "0.50이 더 커요", "0.5가 더 커요"], a: 0, why: { "1": "칠한 넓이를 견주어 봐요.", "2": "칠한 넓이를 견주어 봐요." } }]],
        ok: "칠한 넓이가 똑같아요. 0.5=0.50이에요." }),
        { q: "0.5와 0.50 중 어느 것이 더 클까요? 내 예상을 써요.", ph: "내 예상: ~", help: ["① 0.5는 0.1이 몇 개, 0.50은 0.01이 몇 개인지 떠올려요. → ② 모눈에 칠하면 넓이가 어떨지 생각해요.", "‘내 예상: ~이 더 커요 / 같아요. 왜냐하면 ~’ 꼴로 써요."],
          ans: "0.5와 0.50은 같은 수예요. 0.5는 0.1이 5개, 0.50은 0.01이 50개인데 모눈에 칠한 넓이가 똑같아요." }) },
    { name: "말해 보기 — 공 던지기 기록 비교", inst: "공 던지기에서 도현이는 18.25 m, 민재는 18.3 m를 던졌어요. 자릿값 표의 이름 단추를 높은 자리부터 눌러 누가 더 멀리 던졌는지 비교해 보세요.", hints: ["자연수 부분부터 눌러요.", "소수 첫째 자리에서 2와 3을 비교해요."],
      render: thenWhy((b, a) => c3Cmp(b, a, { a: "18.25", b: "18.3", la: "도현", lb: "민재", ok: "18.25 < 18.3이에요. 소수 첫째 자리에서 2 < 3이라서 민재가 더 멀리 던졌어요." }),
        { q: "18.25는 숫자가 더 많은데 왜 18.3보다 작을까요?", ph: "높은 자리부터 비교하면 ~", help: ["① 자연수 부분이 같은지 봐요. → ② 그다음 높은 자리인 소수 첫째 자리 숫자를 견주어요.", "‘자연수 부분은 ~고, 소수 첫째 자리에서 ~라서 ~’ 꼴로 써요."],
          ans: "자연수 부분 18은 같고, 소수 첫째 자리에서 2가 3보다 작기 때문이에요. 소수점 아래 숫자가 많다고 큰 수가 아니에요." }) },
    { name: "약속하기 — 소수의 크기 비교", inst: "기록을 비교하며 찾은 것을 약속해요. 알맞은 말을 골라 보세요.", hints: ["0.5=0.50이에요.", "높은 자리부터 차례대로 비교해요."],
      render: (b, a) => blanks(b, a, ["0.5와 0.50은 ", { o: ["같은 수", "다른 수"], a: 0 }, "예요. 필요한 경우 소수의 ", { o: ["오른쪽 끝자리", "왼쪽 끝자리"], a: 0 }, "에 0을 붙여서 나타낼 수 있어요. 소수의 크기는 ", { o: ["자연수 부분", "소수 맨 끝자리"], a: 0 }, "부터 높은 자리 수를 차례대로 비교해요."],
        { ok: "자연수 부분, 소수 첫째 자리, 소수 둘째 자리, 소수 셋째 자리 차례로 비교해요." }) },
    { name: "확인하기 — 기록 비교하기", inst: "두 소수의 크기를 비교하여 >, =, < 중 알맞은 것을 골라 보세요. 달리기 기록도 비교해 봐요.", hints: ["자리 수가 다르면 오른쪽 끝에 0을 붙여 생각해요. 0.3=0.30", "달리기는 걸린 시간이 짧을수록 빨라요."],
      render: (b, a) => c3Sent(b, a, [
        ["0.29", { o: CMP, a: 2, why: { "0": "소수 첫째 자리 2와 3을 먼저 비교해요. 0.29를 29, 0.3을 3처럼 보면 안 돼요." } }, "0.3"],
        ["6.784", { o: CMP, a: 0 }, "6.781"],
        ["2.7", { o: CMP, a: 1 }, "2.700"],
        ["50 m 달리기: 하린 9.48초, 수아 9.5초 → 더 빨리 달린 사람은", { o: ["하린", "수아"], a: 0, why: { "1": "달리기는 걸린 시간이 짧을수록 빨라요. 9.48과 9.5 중 더 작은 수를 찾아요." } }]],
        { ok: "0.29 < 0.3, 6.784 > 6.781, 2.7 = 2.700이에요. 9.48 < 9.5라서 하린이가 더 빨랐어요." }) }
  ],
  challenge: { inst: "★ 도전 — 공 던지기 순위를 매겨 보세요.", hints: ["18.06과 18.1은 18.06과 18.10으로 생각해요.", "17.9=17.90이에요."],
    render: (b, a) => c3Sent(b, a, [
      ["기록 ㉠ 17.9 m ㉡ 18.06 m ㉢ 18.1 m ㉣ 17.95 m를 먼 것부터 차례대로:", { o: ["㉢, ㉡, ㉣, ㉠", "㉡, ㉢, ㉣, ㉠", "㉢, ㉡, ㉠, ㉣", "㉣, ㉠, ㉡, ㉢"], a: 0, why: { "1": "18.06과 18.1은 소수 첫째 자리 0과 1을 비교해요.", "2": "17.9와 17.95는 소수 둘째 자리까지 비교해요. 17.9=17.90이에요.", "3": "자연수 부분이 18인 기록이 17인 기록보다 멀어요." } }],
      ["㉠ 0.001이 520개인 수 ㉡ 0.01이 51개, 0.001이 9개인 수 중 더 큰 수는", { o: ["㉠", "㉡"], a: 0, why: { "1": "㉠은 0.52, ㉡은 0.519예요. 소수 둘째 자리 2와 1을 비교해요." } }]],
      { ok: "먼 기록부터 18.1, 18.06, 17.95, 17.9예요. ㉠ 0.52가 ㉡ 0.519보다 커요." }) }
},
{
  id: "s5", no: 5, title: "물을 나누어 담아요 ― 소수 사이의 관계", soop: "개념 구축하기(O)",
  question: "10배 하거나 [1/10]을 하면 소수는 어떻게 변할까요?",
  summary: "1의 [1/10]은 0.1, [1/100]은 0.01, [1/1000]은 0.001이에요. 0.001을 10배 하면 0.01, 100배 하면 0.1, 1000배 하면 1이에요. 어떤 수를 10배 하면 소수점을 기준으로 수가 왼쪽으로 한 자리, [1/10]을 하면 오른쪽으로 한 자리 이동해요.",
  steps: [
    { name: "만져 보기 — 물 당번 하린이", inst: "물 당번 하린이가 물을 준비해요. 컵 하나에 0.245 L씩 담으면 10컵은 몇 L, 100컵은 몇 L일까요? 또 큰 물통의 물 36 L를 10모둠에 똑같이 나누고, 한 모둠의 물을 다시 10명에게 똑같이 나누면 한 명은 몇 L일까요? ‘10배’, ‘[1/10]’ 단추로 직접 만들어 보고 써 보세요.", hints: ["0.245에서 시작해 ‘10배’를 두 번 눌러요.", "‘36에서 시작’을 누르고 ‘[1/10]’을 두 번 눌러요.", "빨간 소수점은 그대로 있고 숫자들이 움직여요."],
      render: ruleFirst((b, a) => c3Shift(b, a, { starts: ["0.245", "36"], need: ["2.45", "24.5", "3.6", "0.36"],
        asks: [
          ["한 컵 0.245 L →(10배) 10컵", { n: "2.45" }, "L →(10배) 100컵", { n: "24.5", why: { "245": "10배를 두 번 했어요. 숫자가 왼쪽으로 두 자리 움직여요." } }, "L"],
          ["물통 36 L →([1/10]) 한 모둠", { n: "3.6" }, "L →([1/10]) 한 명", { n: "0.36", why: { "0.036": "[1/10]을 두 번 했어요. 36 → 3.6 → 0.36이에요.", "3.6": "[1/10]을 한 번 더 해요." } }, "L"]],
        ok: "10배 할 때마다 숫자가 왼쪽으로 한 자리, [1/10]을 할 때마다 오른쪽으로 한 자리 움직였어요." }),
        { q: "어떤 소수를 10배 하면 숫자들은 어느 쪽으로 움직일까요?", ph: "내 규칙: 10배 하면 ~", help: ["① 자연수 3을 10배 하면 30이 되는 것을 떠올려요. → ② 소수에서도 숫자가 어느 쪽 자리로 옮겨 갈지 생각해요.", "‘내 규칙: 10배 하면 숫자가 ~쪽으로, [1/10]을 하면 ~쪽으로 움직여요.’ 꼴로 써요."],
          ans: "10배 하면 소수점은 그대로 있고 숫자들이 왼쪽으로 한 자리씩, [1/10]을 하면 오른쪽으로 한 자리씩 움직여요." }) },
    { name: "그려 보기 — 1, 0.1, 0.01, 0.001", inst: "응원 깃발을 만들 천 1장을 윤서는 10조각, 민재는 100조각, 하린이는 1000조각으로 똑같이 나누었어요. 색칠한 것이 한 조각이에요. 그림을 보고 □ 안에 알맞은 수를 써 보세요.", hints: ["1을 똑같이 10으로 나눈 한 조각은 0.1이에요.", "0.001을 10배 하면 0.01, 또 10배 하면 0.1이에요."],
      render: (b, a) => c3Sent(b, a, [
        { fig: () => h("div", {}, c3GridFigs([{ v: 100, div: 10, t: "윤서의 한 조각" }, { v: 10, div: 100, t: "민재의 한 조각" }, { v: 1, div: 1000, t: "하린이의 한 조각" }]), c3RelSvg()),
          p: ["한 조각은 윤서", { n: "0.1" }, ", 민재", { n: "0.01" }, ", 하린", { n: "0.001", why: { "0.0001": "1을 1000조각으로 나눈 한 조각은 [1/1000]=0.001이에요." } }] },
        ["0.1의 [1/10]은", { n: "0.01", why: { "1": "[1/10]을 하면 작아져요. 오른쪽으로 한 자리 이동해요." } }, "이고, 1은 0.1의", { n: "10" }, "배예요."],
        ["0.001을 100배 하면", { n: "0.1", why: { "0.01": "100배는 10배를 두 번 한 것이에요." } }, "이고, 1000배 하면", { n: "1" }, "이에요."]],
      { ok: "1, 0.1, 0.01, 0.001은 오른쪽으로 갈 때마다 [1/10], 왼쪽으로 갈 때마다 10배예요." }) },
    { name: "말해 보기 — 100배와 [1/100]", inst: "기록원 모둠이 수 퀴즈를 내요. □ 안에 알맞은 소수를 써 보세요.", hints: ["100배는 10배를 두 번 한 것이에요.", "[1/100]은 [1/10]을 두 번 한 것이에요."],
      render: thenWhy((b, a) => c3Sent(b, a, [
        ["2.468의 100배는", { n: "246.8", why: { "24.68": "100배는 10배를 두 번 한 것이에요. 숫자가 왼쪽으로 두 자리 움직여요." } }, "이고, 1000배는", { n: "2468" }, "이에요."],
        ["573의 [1/100]은", { n: "5.73", why: { "57.3": "[1/100]은 [1/10]을 두 번 한 것이에요. 오른쪽으로 두 자리 움직여요." } }, "이고, [1/1000]은", { n: "0.573" }, "이에요."]],
        { ok: "2.468의 100배는 246.8, 1000배는 2468이에요. 573의 [1/100]은 5.73, [1/1000]은 0.573이에요." }),
        { q: "2.468의 1000배가 2468이 되는 까닭을 숫자가 움직이는 방법으로 말해 봐요.", ph: "1000배는 ~라서 숫자가 ~", help: ["① 1000배는 10배를 몇 번 한 것인지 생각해요. → ② 그만큼 숫자가 어느 쪽으로 몇 자리 움직이는지 말해요.", "‘1000배는 10배를 ~번 한 것이라서 숫자가 ~쪽으로 ~자리 움직여요.’ 꼴로 써요."],
          ans: "1000배는 10배를 세 번 한 것이라서 숫자가 소수점을 기준으로 왼쪽으로 세 자리 움직여요. 그래서 2.468은 2468이 돼요." }) },
    { name: "약속하기 — 소수 사이의 관계", inst: "알맞은 말을 골라 약속을 완성해 보세요.", hints: ["10배 하면 수가 커져요.", "0.001을 10배씩 세 번 하면 1이에요."],
      render: (b, a) => blanks(b, a, ["어떤 수를 10배 하면 소수점을 기준으로 수가 ", { o: ["왼쪽", "오른쪽"], a: 0 }, "으로 한 자리 이동하고, [1/10]을 하면 ", { o: ["왼쪽", "오른쪽"], a: 1 }, "으로 한 자리 이동해요. 0.001을 ", { o: ["10배", "100배", "1000배"], a: 2 }, " 하면 1이에요."],
        { ok: "10배 하면 왼쪽으로, [1/10]을 하면 오른쪽으로 한 자리 이동해요." }) },
    { name: "확인하기 — 다른 수를 말한 친구", inst: "친구들이 말한 수를 계산해 보고 물음에 답해 보세요.", hints: ["0.48의 10배, 48의 [1/10], 0.048의 1000배를 각각 구해 봐요.", "0.06이 되는지 하나씩 계산해 봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "다른 수를 말한 친구는 누구일까요? 윤서: “0.48의 10배인 수야.” 민재: “48의 [1/10]이야.” 하린: “0.048의 1000배야.”", o: ["윤서", "민재", "하린"], a: 2, why: { "0": "0.48의 10배는 4.8이에요. 다른 두 친구의 수도 구해 봐요.", "1": "48의 [1/10]은 4.8이에요. 다른 두 친구의 수도 구해 봐요." } },
        { q: "0.06인 것을 모두 골라 보세요.", o: ["0.006의 10배", "0.6의 100배", "60의 [1/1000]", "0.6의 [1/10]"], a: [0, 2, 3] }],
        { ok: "윤서와 민재는 4.8, 하린이는 48을 말했어요. 0.006의 10배, 60의 [1/1000], 0.6의 [1/10]은 모두 0.06이에요." }) }
  ],
  challenge: { inst: "★ 도전 — 물 당번 문제를 풀어 보세요.", hints: ["0.71에서 71이 되려면 숫자가 왼쪽으로 두 자리 움직여야 해요.", "8.4 L를 10명이 나누면 8.4의 [1/10]이에요."],
    render: (b, a) => c3Sent(b, a, [
      ["0.71의 □배는 71이에요. □ 안에 알맞은 수는", { n: "100" }],
      ["물 8.4 L를 10명이 똑같이 나누어 마시면 한 명은", { n: "0.84", why: { "0.084": "10명에게 나누면 [1/10]을 한 번 해요." } }, "L예요."],
      ["가장 큰 수를 말한 친구는", { o: ["윤서: 259의 [1/1000]", "민재: 25.9의 [1/10]", "하린: 0.259의 100배"], a: 2, why: { "0": "259의 [1/1000]은 0.259예요.", "1": "25.9의 [1/10]은 2.59예요." } }]],
      { ok: "0.71의 100배는 71, 8.4의 [1/10]은 0.84예요. 하린이가 말한 수 25.9가 가장 커요." }) }
},
{
  id: "s6", no: 6, title: "물을 또 마셨어요 ― 소수 한 자리 수의 덧셈", soop: "개념 구축하기(O)",
  question: "소수 한 자리 수끼리는 어떻게 더할까요?",
  summary: "0.4+0.5는 0.1이 4+5=9개이므로 0.9예요. 1.7+2.6은 0.1이 17+26=43개이므로 4.3이에요. 세로로 계산할 때는 소수점의 위치를 맞추어 쓰고, 자연수의 덧셈과 같이 같은 자리 수끼리 더한 다음(합이 10이거나 10보다 크면 받아올림), 소수점을 그대로 내려 찍어요.",
  steps: [
    { name: "만져 보기 — 수아가 마신 물", inst: "수아는 오전에 물을 0.4 L, 오후에 0.5 L 마셨어요. 1 L를 똑같이 10칸으로 나눈 막대에 오전·오후에 마신 양과 모두 마신 양을 칠해 보세요.", hints: ["한 칸은 0.1 L예요. 0.4 L는 4칸이에요.", "모두 마신 양은 4칸과 5칸을 합한 만큼이에요."],
      render: (b, a) => c3Fill(b, a, { panels: [{ kind: "bar", target: 4, label: "오전", end: "1 L" }, { kind: "bar", target: 5, label: "오후", end: "1 L", color: "#F6C08A" }, { kind: "bar", target: 9, label: "모두", end: "1 L", color: "#A9D8A2" }],
        asks: [["식:", { o: ["0.4+0.5", "0.5−0.4"], a: 0 }, "=", { n: "0.9", e: "0.4+0.5", why: { "0.09": "0.1이 9개인 수예요." } }, "L"]],
        ok: "0.1 L가 4칸과 5칸, 모두 9칸이에요. 0.4+0.5=0.9예요." }) },
    { name: "그려 보기 — 0.1의 개수로 더하기", inst: "민재는 운동회 전에 운동장 둘레를 오전에 1.7 km, 오후에 2.6 km 걸었어요. 모두 몇 km를 걸었는지 0.1의 개수로 구해 보세요.", hints: ["1.7은 0.1이 17개예요.", "17+26=43이에요. 0.1이 43개인 수를 소수로 써요."],
      render: ruleFirst((b, a) => c3Sent(b, a, [
        ["1.7은 0.1이", { n: "17" }, "개, 2.6은 0.1이", { n: "26" }, "개예요."],
        ["1.7+2.6은 0.1이", { n: "43" }, "개 →", { n: "4.3", e: "1.7+2.6", why: { "3.13": "0.7+0.6=1.3이에요. 1은 일의 자리로 받아올림해요.", "43": "0.1이 43개인 수를 소수로 써요." } }, "km"]],
        { ok: "0.1이 17개와 26개, 모두 43개라서 1.7+2.6=4.3이에요." }),
        { q: "소수 한 자리 수끼리 더할 때 0.1이 몇 개인지 세면 어떻게 계산할 수 있을까요?", ph: "내 규칙: 0.1의 개수끼리 ~", help: ["① 1.7과 2.6이 각각 0.1이 몇 개인지 떠올려요. → ② 개수끼리 계산한 다음 다시 소수로 바꾸는 방법을 생각해요.", "‘내 규칙: 0.1의 개수끼리 ~하고, 그 개수만큼의 ~로 나타내요.’ 꼴로 써요."],
          ans: "0.1의 개수끼리 자연수처럼 더하고, 그 개수만큼의 소수로 나타내면 돼요. 17개+26개=43개이므로 1.7+2.6=4.3이에요." }) },
    { name: "말해 보기 — 세로로 더하기", inst: "1.7+2.6을 세로로 계산해 보세요. 같은 자리 수끼리 더해 아래 칸에 쓰고, 가운데 점선 칸을 눌러 소수점을 찍어요.", hints: ["소수 첫째 자리: 7+6=13이에요. 3을 쓰고 1을 일의 자리로 받아올림해요.", "일의 자리: 1+2+1=4예요."],
      render: thenWhy((b, a) => c3Vert(b, a, { a: "1.7", b: "2.6", op: "+" }),
        { q: "세로셈에서 소수점을 그대로 내려 찍는 까닭은 무엇일까요?", ph: "소수점을 맞추어 ~", help: ["① 세로로 쓸 때 소수점끼리 맞추어 쓴 것을 떠올려요. → ② 답의 각 숫자가 어느 자리 숫자인지 생각해요.", "‘같은 자리끼리 더했으니 답에서도 소수점이 ~에 와야 해요.’ 꼴로 써요."],
          ans: "소수점을 맞추어 같은 자리끼리 더했으니, 답에서도 일의 자리와 소수 첫째 자리 사이에 소수점이 그대로 와야 하기 때문이에요." }) },
    { name: "약속하기 — 소수 한 자리 수의 덧셈", inst: "덧셈 방법을 약속해요. 알맞은 말을 골라 보세요.", hints: ["소수점끼리 세로로 나란히 써요.", "합이 10이거나 10보다 크면 바로 윗자리로 받아올림해요."],
      render: (b, a) => blanks(b, a, ["소수 한 자리 수의 덧셈은 ", { o: ["소수점", "오른쪽 끝"], a: 0 }, "의 위치를 맞추어 쓰고, 자연수의 덧셈과 같이 ", { o: ["같은 자리 수끼리", "앞에서부터 아무 자리끼리"], a: 0 }, " 더해요. 합이 10이거나 10보다 크면 바로 윗자리로 ", { o: ["받아올림", "받아내림"], a: 0 }, "하고, 소수점을 그대로 내려 찍어요."],
        { ok: "소수점의 위치를 맞추어 쓰고, 같은 자리끼리 더하고, 소수점을 내려 찍어요." }) },
    { name: "확인하기 — 기록 더하기", inst: "계산해 보세요.", hints: ["소수점의 위치를 맞추어 같은 자리끼리 더해요.", "5.4+0.6=6.0=6이에요. 끝자리 0은 쓰지 않아도 돼요."],
      render: (b, a) => c3Sent(b, a, [c3Q("0.6+3.2", "3.8"), c3Q("4.7+2.5", "7.2"), c3Q("5.4+0.6", "6"), c3Q("8.9+1.3", "10.2"),
        ["하린이는 공 던지기 1차 시기에 12.4 m를 던졌고, 2차 시기에는 1.8 m 더 멀리 던졌어요. 2차 기록은", { n: "14.2", e: "12.4+1.8" }, "m예요."]],
        { ok: "소수 한 자리 수의 덧셈을 정확하게 했어요. 하린이의 2차 기록은 14.2 m예요." }) }
  ],
  challenge: { inst: "★ 도전 — 수 카드 3, 6, 8과 소수점 카드 중 세 장을 골라 가장 큰 소수 한 자리 수를 만들고, 가장 작은 소수 한 자리 수 3.6과의 합을 구해 보세요.", hints: ["소수 한 자리 수는 □.□ 꼴이에요.", "가장 큰 수를 만들려면 일의 자리에 가장 큰 수를 놓아요."],
    render: (b, a) => c3Cards(b, a, { cards: ["3", "6", "8", "."], n: 3,
      check: s => !/^\d\.\d$/.test(s) ? "소수 한 자리 수는 □.□ 꼴이에요." : s !== "8.6" ? "더 큰 소수 한 자리 수를 만들 수 있어요. 일의 자리에 가장 큰 수를 놓아요." : null,
      after: s => [
        [s, "+ 3.6 =", { n: "12.2", e: "8.6+3.6", why: { "11.2": "소수 첫째 자리 6+6=12에서 받아올림한 1을 일의 자리에 더해요." } }],
        ["2.7보다 3.9만큼 더 큰 수는", { n: "6.6", e: "2.7+3.9" }]],
      ok: "가장 큰 수 8.6과 가장 작은 수 3.6의 합은 12.2예요." }) }
},
{
  id: "s7", no: 7, title: "이어달리기 거리를 더해요 ― 소수 두 자리 수의 덧셈", soop: "개념 구축하기(O)",
  question: "소수 두 자리 수의 덧셈은 어떻게 할까요?",
  summary: "0.26+0.38은 0.01이 26+38=64개이므로 0.64예요. 2.75+0.6처럼 자리 수가 다르면 0.6=0.60으로 생각해 0.01이 275+60=335개, 곧 3.35예요. 세로로 계산할 때는 소수점의 위치를 맞추어 쓰고, 자연수의 덧셈과 같이 받아올림하여 계산한 다음 소수점을 그대로 내려 찍어요.",
  steps: [
    { name: "만져 보기 — 이어달리기 코스", inst: "4학년 이어달리기는 1구간 0.26 km, 2구간 0.38 km를 달려요. 모눈 한 칸이 0.01 km예요. 1구간(연두)에 이어 2구간 거리만큼 더 칠해 보세요.", hints: ["0.38은 0.01이 38개예요. 38칸을 더 칠해요.", "모두 칠한 칸은 26+38=64칸이에요."],
      render: (b, a) => c3Fill(b, a, { panels: [{ kind: "grid", pre: 26, target: 64, label: "이어달리기", title: "연두: 1구간 0.26 km", preColor: C3C.h, color: "#F6C08A" }],
        asks: [["식:", { o: ["0.26+0.38", "0.38−0.26"], a: 0 }, "=", { n: "0.64", e: "0.26+0.38" }, "km"]],
        ok: "0.01이 26칸과 38칸, 모두 64칸이에요. 이어달리기 두 구간은 모두 0.64 km예요." }) },
    { name: "그려 보기 — 0.01의 개수로 더하기", inst: "윤서가 출발선 테이프 2.75 m에 0.6 m를 이어 붙였어요. 테이프는 모두 몇 m인지 0.01의 개수로 구해 보세요.", hints: ["0.6=0.60이에요. 0.6은 0.01이 60개예요.", "275+60=335예요."],
      render: thenWhy((b, a) => c3Sent(b, a, [
        ["2.75는 0.01이", { n: "275" }, "개, 0.6은 0.01이", { n: "60", why: { "6": "0.6=0.60이에요. 0.1이 6개이니 0.01은 60개예요." } }, "개예요."],
        ["2.75+0.6은 0.01이", { n: "335" }, "개 →", { n: "3.35", e: "2.75+0.6" }, "m"]],
        { ok: "0.01이 275개와 60개, 모두 335개라서 2.75+0.6=3.35예요." }),
        { q: "0.6을 0.01이 6개라고 하면 안 되는 까닭은 무엇일까요?", ph: "0.6은 0.1이 ~", help: ["① 0.6은 0.1이 몇 개인지 떠올려요. → ② 0.1은 0.01이 몇 개인지 생각해요.", "‘0.6은 0.1이 ~개이고, 0.1은 0.01이 ~개라서 ~’ 꼴로 써요."],
          ans: "0.6은 0.1이 6개이고, 0.1은 0.01이 10개라서 0.6은 0.01이 60개예요. 0.6=0.60이에요." }) },
    { name: "말해 보기 — 소수점 맞추어 더하기", inst: "2.75+0.6을 세로로 계산해 보세요. 먼저 아래 수를 옮겨 소수점끼리 맞추고, 같은 자리 수끼리 더해요. 그리고 친구에게 하는 말을 써 보세요.", hints: ["0.6의 소수점이 2.75의 소수점 바로 아래에 오게 옮겨요.", "0.6=0.60으로 생각해요. 소수 첫째 자리 7+6=13이에요."],
      render: (b, a) => { c3Vert(b, a, { a: "2.75", b: "0.6", op: "+", align: true, pad: true });
        writeStep(b, a, [{ q: "하린이는 2.75+0.6을 2.81이라고 계산했어요. 하린이에게 무엇을 고치면 좋을지 말해 주세요.", tag: "하린이에게", ph: "하린아, ~", help: ["① 2.81이 나오려면 0.6을 어떤 수처럼 더했는지 생각해요. → ② 소수점을 어떻게 맞추어야 하는지 알려 줘요.", "‘하린아, ~를 맞추어 썼구나. ~끼리 맞추어 계산하면 ~야.’ 꼴로 써요."],
          ans: "하린아, 오른쪽 끝을 맞추어서 0.6을 0.06처럼 더했어. 소수점끼리 맞추어 2.75+0.60으로 계산하면 3.35야." }]); } },
    { name: "약속하기 — 소수 두 자리 수의 덧셈", inst: "덧셈 방법을 약속해요. 알맞은 말을 골라 보세요.", hints: ["자리 수가 다르면 끝자리에 0을 붙여 생각해요."],
      render: (b, a) => blanks(b, a, ["소수 두 자리 수의 덧셈도 ", { o: ["소수점", "오른쪽 끝"], a: 0 }, "의 위치를 맞추어 써요. 자리 수가 다르면 소수의 오른쪽 끝자리에 ", { o: ["0", "1"], a: 0 }, "을 붙여 생각하고, 자연수의 덧셈과 같이 ", { o: ["받아올림", "받아내림"], a: 0 }, "하여 계산한 다음 소수점을 그대로 내려 찍어요."],
        { ok: "자리 수가 달라도 소수점끼리 맞추면 같은 자리끼리 더할 수 있어요." }) },
    { name: "확인하기 — 기록 더하기", inst: "계산해 보세요.", hints: ["1.46+2.3은 2.3=2.30으로 생각해요.", "0.85+0.15=1.00=1이에요."],
      render: (b, a) => c3Sent(b, a, [c3Q("1.46+2.3", "3.76"), c3Q("3.58+4.67", "8.25"), c3Q("0.85+0.15", "1"), c3Q("4.9+0.36", "5.26"),
        ["윤서는 물을 0.65 L 마시고, 잠시 뒤에 0.48 L를 더 마셨어요. 윤서가 마신 물은 모두", { n: "1.13", e: "0.65+0.48" }, "L예요."]],
        { ok: "소수점의 위치를 맞추어 정확하게 더했어요. 윤서는 물을 모두 1.13 L 마셨어요." }) }
  ],
  challenge: { inst: "★ 도전 — 이어달리기 기록원의 문제를 풀어 보세요.", hints: ["두 식을 모두 계산해 비교해요.", "5.32+0.7은 0.7=0.70으로 생각해요."],
    render: (b, a) => c3Sent(b, a, [
      ["합이 더 큰 것은", { o: ["㉠ 0.7+1.48", "㉡ 0.95+1.26"], a: 1, why: { "0": "㉠은 2.18, ㉡은 2.21이에요." } }],
      ["3.47 →(+1.85)", { n: "5.32", e: "3.47+1.85" }, "→(+0.7)", { n: "6.02", e: "5.32+0.7", why: { "5.39": "0.7을 0.07처럼 더했어요. 소수점을 맞추어요." } }]],
      { ok: "㉡ 2.21이 ㉠ 2.18보다 커요. 3.47+1.85=5.32, 5.32+0.7=6.02예요." }) }
},
{
  id: "s8", no: 8, title: "누가 더 멀리 던졌을까 ― 소수 한 자리 수의 뺄셈", soop: "개념 구축하기(O)",
  question: "소수 한 자리 수의 뺄셈은 어떻게 할까요?",
  summary: "0.8−0.5는 0.1이 8−5=3개이므로 0.3이에요. 15.2−12.7은 0.1이 152−127=25개이므로 2.5예요. 세로로 계산할 때는 소수점의 위치를 맞추어 쓰고, 같은 자리 수끼리 빼되 뺄 수 없으면 바로 윗자리에서 받아내림한 다음, 소수점을 그대로 내려 찍어요.",
  steps: [
    { name: "만져 보기 — 응원 리본", inst: "응원 리본을 재었더니 하린이의 리본은 0.8 m, 수아의 리본은 0.5 m였어요. 1 m를 10칸으로 나눈 막대에 두 리본의 길이를 칠하고, 하린이의 리본이 몇 m 더 긴지 알아보세요.", hints: ["한 칸은 0.1 m예요.", "두 막대에서 칠한 칸이 몇 칸 차이 나는지 세어 봐요."],
      render: (b, a) => c3Fill(b, a, { panels: [{ kind: "bar", target: 8, label: "하린", end: "1 m", color: "#F4A7B9" }, { kind: "bar", target: 5, label: "수아", end: "1 m", color: "#9CC6EC" }],
        asks: [["두 막대는", { n: "3" }, "칸 차이가 나요."], ["식:", { o: ["0.8+0.5", "0.8−0.5"], a: 1 }, "=", { n: "0.3", e: "0.8-0.5" }, "m"]],
        ok: "0.1 m가 3칸 차이 나요. 0.8−0.5=0.3이에요." }) },
    { name: "그려 보기 — 0.1의 개수로 빼기", inst: "공 던지기에서 도현이는 15.2 m, 민재는 12.7 m를 던졌어요. 도현이가 몇 m 더 멀리 던졌는지 0.1의 개수로 구해 보세요.", hints: ["15.2는 0.1이 152개예요.", "152−127=25예요."],
      render: thenWhy((b, a) => c3Sent(b, a, [
        ["15.2는 0.1이", { n: "152" }, "개, 12.7은 0.1이", { n: "127" }, "개예요."],
        ["15.2−12.7은 0.1이", { n: "25" }, "개 →", { n: "2.5", e: "15.2-12.7" }, "m"]],
        { ok: "0.1이 152개에서 127개를 빼면 25개, 곧 2.5예요." }),
        { q: "15.2−12.7을 0.1의 개수로 계산하면 좋은 점은 무엇일까요?", ph: "0.1의 개수로 바꾸면 ~", help: ["① 15.2와 12.7을 0.1의 개수로 바꾸면 어떤 수가 되는지 봐요. → ② 이미 할 줄 아는 계산과 견주어요.", "‘0.1의 개수로 바꾸면 ~처럼 ~의 뺄셈으로 계산할 수 있어요.’ 꼴로 써요."],
          ans: "소수를 0.1이 몇 개인 수로 바꾸면 152−127처럼 자연수의 뺄셈으로 계산할 수 있어서 편리해요." }) },
    { name: "말해 보기 — 세로로 빼기", inst: "15.2−12.7을 세로로 계산해 보세요. 같은 자리 수끼리 빼서 아래 칸에 쓰고, 가운데 점선 칸을 눌러 소수점을 찍어요. 맨 앞 십의 자리가 0이면 비워 두어도 돼요.", hints: ["소수 첫째 자리: 2에서 7을 뺄 수 없어요. 일의 자리에서 받아내림해 12−7=5예요.", "일의 자리: 받아내림하고 남은 4에서 2를 빼요."],
      render: thenWhy((b, a) => c3Vert(b, a, { a: "15.2", b: "12.7", op: "-" }),
        { q: "소수 첫째 자리에서 2에서 7을 뺄 수 없을 때 어떻게 했나요?", ph: "일의 자리에서 ~", help: ["① 바로 윗자리인 일의 자리에서 무엇을 가져왔는지 떠올려요. → ② 일의 자리 숫자가 어떻게 바뀌었는지 써요.", "‘일의 자리에서 1을 받아내림해 ~−7을 하고, 일의 자리는 ~가 되었어요.’ 꼴로 써요."],
          ans: "일의 자리 5에서 1을 받아내림해 소수 첫째 자리를 12로 만들고 12−7=5를 계산했어요. 일의 자리는 4가 되어 4−2=2예요." }) },
    { name: "약속하기 — 소수 한 자리 수의 뺄셈", inst: "뺄셈 방법을 약속해요. 알맞은 말을 골라 보세요.", hints: ["뺄 수 없으면 바로 윗자리에서 받아내림해요."],
      render: (b, a) => blanks(b, a, ["소수 한 자리 수의 뺄셈은 소수점의 위치를 ", { o: ["맞추어", "오른쪽 끝에 맞추어"], a: 0 }, " 쓰고, 같은 자리 수끼리 빼요. 같은 자리 수끼리 뺄 수 없으면 바로 윗자리에서 ", { o: ["받아올림", "받아내림"], a: 1 }, "하고, 소수점을 그대로 내려 찍어요."],
        { ok: "작은 수에서 큰 수를 뺄 수 없으면 바로 윗자리에서 받아내림해요." }) },
    { name: "확인하기 — 기록의 차", inst: "계산해 보세요.", hints: ["9−3.4는 9=9.0으로 생각해요.", "뺄 수 없으면 받아내림해요."],
      render: (b, a) => c3Sent(b, a, [c3Q("5.8-2.3", "3.5"), c3Q("7.1-4.6", "2.5"), c3Q("9-3.4", "5.6"), c3Q("6.2-0.8", "5.4"),
        ["이어달리기 코스 1.5 km 중에서 0.8 km를 달렸어요. 남은 거리는", { n: "0.7", e: "1.5-0.8" }, "km예요."]],
        { ok: "소수 한 자리 수의 뺄셈을 정확하게 했어요. 남은 거리는 0.7 km예요." }) }
  ],
  challenge: { inst: "★ 도전 — 카드 [.] [4] [7] [5] [9] 중 세 장을 골라 가장 작은 소수 한 자리 수를 만들고, 그 수에서 2.8을 빼 보세요.", hints: ["소수 한 자리 수는 □.□ 꼴이에요.", "가장 작은 수를 만들려면 일의 자리에 가장 작은 수를 놓아요."],
    render: (b, a) => c3Cards(b, a, { cards: [".", "4", "7", "5", "9"], n: 3,
      check: s => !/^\d\.\d$/.test(s) ? "소수 한 자리 수는 □.□ 꼴이에요." : s !== "4.5" ? "더 작은 소수 한 자리 수를 만들 수 있어요. 일의 자리와 소수 첫째 자리에 작은 수부터 놓아요." : null,
      after: s => [
        [s, "− 2.8 =", { n: "1.7", e: "4.5-2.8", why: { "2.3": "5에서 8을 뺄 수 없으면 받아내림해요." } }],
        ["6.3보다 1.9만큼 더 작은 수는", { n: "4.4", e: "6.3-1.9" }]],
      ok: "가장 작은 소수 한 자리 수는 4.5이고, 4.5−2.8=1.7이에요." }) }
},
{
  id: "s9", no: 9, title: "남은 물은 얼마일까 ― 소수 두 자리 수의 뺄셈", soop: "개념 구축하기(O)",
  question: "소수 두 자리 수의 뺄셈은 어떻게 할까요?",
  summary: "0.83−0.25는 0.01이 83−25=58개이므로 0.58이에요. 1.5−0.68은 1.5=1.50으로 생각해 0.01이 150−68=82개, 곧 0.82예요. 세로로 계산할 때는 소수점의 위치를 맞추어 쓰고, 자연수의 뺄셈과 같이 받아내림하여 계산한 다음 소수점을 그대로 내려 찍어요.",
  steps: [
    { name: "만져 보기 — 수아의 물병", inst: "수아의 물병에 물이 0.83 L 있었어요. 달리기를 마치고 0.25 L를 마셨어요. 파란 표시를 0.83에서 왼쪽으로 옮겨 남은 물의 양을 알아보세요. 작은 눈금 한 칸은 0.01 L예요.", hints: ["0.25는 작은 눈금 25칸이에요.", "0.83에서 왼쪽으로 25칸 가면 0.58이에요."],
      render: (b, a) => c3Line(b, a, { from: 0, to: 1000, minor: 10, major: 100, mid: 50, start: 830, target: 580, unit: "L",
        asks: [["식:", { o: ["0.83+0.25", "0.83−0.25"], a: 1 }, "=", { n: "0.58", e: "0.83-0.25" }, "L"]],
        ok: "0.83에서 왼쪽으로 작은 눈금 25칸 가면 0.58이에요. 남은 물은 0.58 L예요." }) },
    { name: "그려 보기 — 0.01의 개수로 빼기", inst: "윤서의 물통에는 물이 1.5 L 있었어요. 그중 0.68 L를 마셨어요. 남은 물의 양을 0.01의 개수로 구해 보세요.", hints: ["1.5=1.50이에요. 0.01이 150개예요.", "150−68=82예요."],
      render: thenWhy((b, a) => c3Sent(b, a, [
        ["1.5는 0.01이", { n: "150", why: { "15": "1.5=1.50이에요. 0.01이 150개예요." } }, "개, 0.68은 0.01이", { n: "68" }, "개예요."],
        ["1.5−0.68은 0.01이", { n: "82" }, "개 →", { n: "0.82", e: "1.5-0.68" }, "L"]],
        { ok: "0.01이 150개에서 68개를 빼면 82개, 곧 0.82예요." }),
        { q: "1.5를 1.50으로 생각하면 왜 계산하기 편리할까요?", ph: "1.50으로 생각하면 ~", help: ["① 1.5와 0.68의 소수점 아래 자리 수를 견주어요. → ② 자리 수가 같아지면 무엇이 쉬워지는지 생각해요.", "‘1.50으로 생각하면 ~와 자리 수가 같아져서 ~’ 꼴로 써요."],
          ans: "0.68과 소수 둘째 자리까지 자리 수가 같아져서 0.01의 개수(150개−68개)로 바로 뺄 수 있기 때문이에요." }) },
    { name: "말해 보기 — 소수점 맞추어 빼기", inst: "1.5−0.68을 세로로 계산해 보세요. 먼저 아래 수를 옮겨 소수점끼리 맞추고, ‘끝자리에 0 붙여 보기’를 눌러 1.50으로 생각해 같은 자리 수끼리 빼요.", hints: ["소수 둘째 자리: 0에서 8을 뺄 수 없어요. 소수 첫째 자리에서 받아내림해 10−8=2예요.", "소수 첫째 자리: 4에서 6을 뺄 수 없어요. 일의 자리에서 받아내림해 14−6=8이에요."],
      render: thenWhy((b, a) => c3Vert(b, a, { a: "1.5", b: "0.68", op: "-", align: true, pad: true }),
        { q: "1.50−0.68에서 소수 둘째 자리 0에서 8을 어떻게 뺐나요?", ph: "소수 첫째 자리에서 ~", help: ["① 0에서 8을 뺄 수 없을 때 어느 자리에서 받아내림했는지 떠올려요. → ② 그 자리 숫자가 어떻게 바뀌었는지 써요.", "‘소수 첫째 자리에서 받아내림해 ~−8을 하고, 소수 첫째 자리는 ~가 되었어요.’ 꼴로 써요."],
          ans: "소수 첫째 자리 5에서 받아내림해 10−8=2를 계산했어요. 소수 첫째 자리는 4가 되어, 다시 일의 자리에서 받아내림해 14−6=8을 계산했어요." }) },
    { name: "약속하기 — 소수 두 자리 수의 뺄셈", inst: "뺄셈 방법을 약속해요. 알맞은 말을 골라 보세요.", hints: ["자리 수가 다르면 끝자리에 0을 붙여 생각해요."],
      render: (b, a) => blanks(b, a, ["소수 두 자리 수의 뺄셈도 ", { o: ["소수점", "오른쪽 끝"], a: 0 }, "의 위치를 맞추어 써요. 1.5−0.68처럼 자리 수가 다르면 1.5를 ", { o: ["1.50", "1.05"], a: 0 }, "으로 생각하고, 자연수의 뺄셈과 같이 ", { o: ["받아내림", "받아올림"], a: 0 }, "하여 계산한 다음 소수점을 그대로 내려 찍어요."],
        { ok: "1.5=1.50으로 생각하면 소수 둘째 자리끼리 뺄 수 있어요." }) },
    { name: "확인하기 — 남은 양과 차", inst: "계산해 보세요.", hints: ["0.9−0.35는 0.9=0.90으로 생각해요.", "6.03−2.47은 받아내림이 두 번 있어요."],
      render: (b, a) => c3Sent(b, a, [c3Q("4.36-1.12", "3.24"), c3Q("6.03-2.47", "3.56"), c3Q("0.9-0.35", "0.55"), c3Q("5.42-2.8", "2.62"),
        ["멀리뛰기에서 하린이는 1.62 m, 도현이는 1.48 m를 뛰었어요. 하린이가", { n: "0.14", e: "1.62-1.48" }, "m 더 멀리 뛰었어요."]],
        { ok: "소수 두 자리 수의 뺄셈을 정확하게 했어요. 하린이가 0.14 m 더 멀리 뛰었어요." }) }
  ],
  challenge: { inst: "★ 도전 — 0부터 9까지의 수 중에서 □ 안에 들어갈 수 있는 수를 찾아보세요. 7.25−3.6 < 3.□5", hints: ["먼저 7.25−3.6을 계산해요.", "3.65 < 3.□5가 되려면 □는 6보다 커야 해요."],
    render: (b, a) => c3Sent(b, a, [
      ["7.25−3.6 =", { n: "3.65", e: "7.25-3.6" }],
      ["3.65 < 3.□5에서 □ 안에 들어갈 수 있는 수를 모두 골라 보세요.", { m: ["5", "6", "7", "8", "9"], a: [2, 3, 4], bad: "□가 6이면 3.65 = 3.65로 같아요. 3.65보다 커야 해요." }]],
      { ok: "7.25−3.6=3.65이므로 □ 안에는 7, 8, 9가 들어갈 수 있어요." }) }
},
{
  id: "s10", no: 10, title: "생각을 더하다 ― 운동회 물병 계획", soop: "탐구 정리하기(O)",
  question: "여러 단계의 소수 계산 문제는 어떻게 해결할까요?",
  summary: "문제를 읽고 구하려는 것과 주어진 것을 찾은 다음, 덧셈으로 모두 마신 양을 구하고 뺄셈으로 남은 양을 구했어요. 먼저 어림해 두면 답이 알맞은지 살펴볼 수 있어요. 소수의 덧셈과 뺄셈에서는 소수점의 위치를 맞추어 쓰는 것이 가장 중요해요.",
  steps: [
    { name: "만져 보기 — 이해해요", inst: "운동회 날 한 사람에게 1.5 L 물병을 하나씩 나누어 주었어요. 민재는 오전에 0.45 L, 점심에 0.3 L, 오후에 0.58 L를 마셨어요. 민재의 물병에 남은 물은 몇 L일까요? 먼저 문제를 이해하고 계획을 세워 보세요.", hints: ["‘남은 물’을 묻고 있어요.", "마신 양을 모두 더한 다음, 처음 양에서 빼요."],
      render: (b, a) => quiz(b, a, [
        { q: "구하려는 것은 무엇인가요?", o: ["민재가 모두 마신 물의 양", "민재의 물병에 남은 물의 양", "오전과 오후에 마신 물의 차"], a: 1, why: { "0": "모두 마신 양은 남은 양을 구하려고 먼저 구하는 거예요. 마지막에 묻는 것을 다시 읽어 봐요.", "2": "문제의 마지막 물음을 다시 읽어 봐요." } },
        { q: "알맞은 계획을 골라 보세요.", o: ["마신 양을 모두 더한 다음, 1.5에서 빼요", "1.5에 마신 양을 모두 더해요", "오전에 마신 양만 1.5에서 빼요"], a: 0, why: { "1": "마신 물은 물병에서 줄어들어요. 더하면 늘어나요.", "2": "점심과 오후에 마신 물도 줄어들어요." } }],
        { ok: "구하려는 것은 남은 물의 양이에요. 마신 양을 모두 더한 다음 1.5에서 빼요." }) },
    { name: "그려 보기 — 어림하고 해결해요", inst: "먼저 어림하고, 계획대로 계산해 보세요.", hints: ["0.45는 0.5쯤, 0.58은 0.6쯤이에요. 0.5+0.3+0.6을 생각해 봐요.", "0.75+0.58은 받아올림이 두 번 있어요.", "1.5=1.50으로 생각해 1.33을 빼요."],
      render: (b, a) => c3Sent(b, a, [
        ["먼저 어림해요: 민재가 마신 물은 모두 1 L보다", { o: ["많아요", "적어요"], a: 0, why: { "1": "0.5쯤+0.3+0.6쯤은 1.4쯤이에요." } }],
        ["① 오전과 점심: 0.45+0.3 =", { n: "0.75", e: "0.45+0.3", why: { "0.48": "0.3을 0.03처럼 더했어요. 소수점을 맞추어요." } }],
        ["② 모두 마신 양: 0.75+0.58 =", { n: "1.33", e: "0.75+0.58" }, "L"],
        ["③ 남은 물: 1.5 −", { n: "1.33" }, "=", { n: "0.17", e: "1.5-1.33" }, "L"]],
        { ok: "민재는 물을 모두 1.33 L 마셨고, 물병에 0.17 L가 남았어요. 어림한 대로 1 L보다 많이 마셨어요." }) },
    { name: "말해 보기 — 잘못 고치기", inst: "도현이는 기록 4.6과 2.35의 합을 왼쪽처럼 계산했어요. 잘못 계산한 까닭을 고르고, 아래 수를 옮겨 옳게 계산해 보세요.", hints: ["두 수의 오른쪽 끝을 맞추어 썼어요.", "소수점끼리 세로로 맞추어 써요.", "4.6=4.60으로 생각하면 4.60+2.35예요."],
      render: (b, a) => c3Vert(b, a, { a: "4.6", b: "2.35", op: "+", align: true, pad: true,
        fig: () => h("div", {}, h("div", { class: "c3cap" }, "도현이가 계산한 세로셈"), c3CharTable([["", "", "4", ".", "6"], ["+", "2", ".", "3", "5"], ["", "2", ".", "8", "1"]])),
        reason: { q: "잘못 계산한 까닭은", o: ["소수점의 위치를 맞추어 쓰지 않았어요", "받아올림을 하지 않았어요", "자연수 부분만 더했어요"], a: 0, why: { "1": "받아올림보다 먼저, 두 수를 어떻게 맞추어 썼는지 살펴봐요.", "2": "두 수를 어떻게 맞추어 썼는지 살펴봐요." } },
        ok: "소수의 덧셈을 할 때는 소수점의 위치를 맞추어 써야 해요. 4.6+2.35=6.95예요." }) },
    { name: "약속하기 — 운동회 문제 만들기", inst: "4.2−1.75를 계산하고, 이 식에 알맞은 운동회 문제를 직접 만들어 써 보세요.", hints: ["4.2=4.20으로 생각해요.", "물, 거리, 리본처럼 운동회에서 재는 것을 떠올려요."],
      render: (b, a) => { c3Sent(b, a, [c3Q("4.2-1.75", "2.45", { why: { "3.55": "4.2를 4.20으로 생각하지 않고 0−5를 5−0처럼 계산했어요. 받아내림해요." } })]);
        writeStep(b, a, [{ q: "4.2−1.75에 알맞은 운동회 문제를 만들어 써 보세요.", tag: "내가 만든 문제", ph: "예) 응원 물통에 물이 4.2 L 있었는데 …", help: ["① 4.2와 1.75가 운동회에서 무엇의 양인지 정해요(물, 거리, 리본 …). → ② 남은 양이나 차를 묻는 문장으로 끝내요.", "‘~이 4.2 ~ 있었는데 1.75 ~를 ~했어요. 남은 ~은 몇 ~일까요?’ 꼴로 써요."],
          ans: "응원 물통에 물이 4.2 L 있었는데 기록원 모둠이 1.75 L를 마셨어요. 남은 물은 몇 L일까요? (답: 2.45 L)" }]); } },
    { name: "확인하기 — 청팀과 백팀", inst: "청팀과 백팀의 이어달리기 코스 길이를 비교해 보세요.", hints: ["세 수를 차례대로 더해요.", "1.2=1.20으로 생각해요."],
      render: (b, a) => c3Sent(b, a, [
        ["청팀 코스 세 구간 0.35 km, 0.42 km, 0.28 km를 모두 더하면", { n: "1.05", e: "0.35+0.42+0.28", why: { "0.95": "소수 둘째 자리 5+2+8=15에서 받아올림한 1을 소수 첫째 자리에 더해요." } }, "km예요."],
        ["백팀 코스 1.2 km는 청팀 코스보다", { n: "0.15", e: "1.2-1.05" }, "km 더 길어요."]],
        { ok: "청팀 코스는 1.05 km이고, 백팀 코스가 0.15 km 더 길어요." }) }
  ],
  challenge: { inst: "★★ 도전 — 물 2 L 중에서 하린이는 0.46 L, 수아는 0.37 L를 마셨어요. 두 사람이 마시고 남은 물의 양을 알아보세요.", hints: ["먼저 두 사람이 마신 양을 더해요.", "2=2.00으로 생각하고 2−0.83을 계산해요."],
    render: (b, a) => c3Sent(b, a, [
      ["두 사람이 마신 양: 식", { o: ["0.46+0.37", "0.46−0.37"], a: 0 }, "=", { n: "0.83", e: "0.46+0.37", why: { "0.73": "소수 둘째 자리 6+7=13이에요. 받아올림해요." } }, "L"],
      ["남은 양: 2 −", { n: "0.83" }, "=", { n: "1.17", e: "2-0.83" }, "L"]], { ok: "두 사람이 마신 양은 0.83 L, 남은 물은 1.17 L예요." }) }
},
{
  id: "s11", no: 11, title: "기록 카드 대결 놀이", soop: "발표하기(P)",
  question: "소수의 크기 비교와 계산을 놀이로 해 볼까요?",
  summary: "수 카드로 소수를 만들 때 가장 큰 수는 높은 자리에 큰 숫자를, 가장 작은 수는 높은 자리에 작은 숫자를 놓아요. 기록을 비교할 때는 자연수 부분부터 높은 자리 수를 차례대로 비교하고, 달리기처럼 걸린 시간은 작을수록 좋은 기록이에요.",
  steps: [
    { name: "만져 보기 — 가장 큰 기록 카드", inst: "수 카드 1, 5, 8과 소수점 카드를 한 번씩 모두 사용하여 가장 큰 소수 두 자리 수를 만들어 보세요.", hints: ["소수 두 자리 수는 □.□□ 꼴이에요.", "가장 큰 수를 만들려면 일의 자리에 가장 큰 수를 놓아요."],
      render: (b, a) => c3Cards(b, a, { cards: ["1", "5", "8", "."], n: 4,
        check: s => !/^\d\.\d\d$/.test(s) ? "소수 두 자리 수는 □.□□ 꼴이에요. 소수점 아래에 숫자가 두 개 오게 놓아요." : s !== "8.51" ? "더 큰 소수 두 자리 수를 만들 수 있어요. 높은 자리에 큰 숫자부터 놓아요." : null,
        after: s => [
          ["같은 카드로 만든 가장 작은 소수 두 자리 수는", { n: "1.58" }],
          ["8.51과 1.58의 차는", { n: "6.93", e: "8.51-1.58" }]],
        ok: "가장 큰 수는 8.51, 가장 작은 수는 1.58이고, 두 수의 차는 6.93이에요." }) },
    { name: "놀이하기 — 기록 대결", inst: "기록 대결 놀이예요. 두 친구의 기록을 보고 이긴 친구의 기록 카드를 빨리 눌러요. 8판을 하면 끝나요.", hints: ["자연수 부분부터, 그다음 소수 첫째 자리, 소수 둘째 자리 차례로 비교해요.", "달리기는 걸린 시간이 작을수록 빨라요."],
      render: (b, a) => c3sDuel(b, a, { n: 8, ok: "기록 대결 8판을 모두 끝냈어요! 높은 자리부터 차례대로 비교했어요." }) },
    { name: "말해 보기 — 이기는 방법 발표하기", inst: "기록 대결에서 이기는 방법을 친구들에게 발표해요. 발표할 내용을 써 보세요.", hints: ["어느 자리부터 비교하는지 써요.", "달리기 기록은 무엇이 다른지 덧붙여요."],
      render: (b, a) => writeStep(b, a, [
        { q: "기록 대결에서 이기는 방법을 친구에게 설명해 보세요.", tag: "이기는 방법", ph: "먼저 ~을 보고, ~", help: ["① 어느 자리부터 비교하는지 써요. → ② 달리기 기록은 어떻게 다른지 덧붙여요.", "‘먼저 자연수 부분을 비교하고, 같으면 ~. 달리기는 ~’ 꼴로 써요."],
          ans: "먼저 자연수 부분을 비교하고, 같으면 소수 첫째 자리, 소수 둘째 자리 차례로 비교해요. 멀리뛰기·공 던지기는 기록이 큰 친구가 이기고, 달리기는 기록이 작은 친구가 이겨요." },
        { q: "놀이를 하며 헷갈렸던 기록은 무엇이었나요? 어떻게 비교하면 되는지도 써 보세요.", tag: "헷갈린 기록", ph: "예) 9.5초와 9.48초가 헷갈렸어요. ~", help: ["① 헷갈렸던 두 기록을 써요. → ② 끝자리에 0을 붙이거나 높은 자리부터 비교해 바르게 견주어요.", "‘~와 ~가 헷갈렸어요. ~=~이라서 ~가 더 ~’ 꼴로 써요."],
          ans: "9.5초와 9.48초가 헷갈렸어요. 9.5=9.50이라서 9.48초가 더 짧은 기록이고, 달리기는 9.48초인 친구가 이겨요." }]) },
    { name: "확인하기 — 가장 좋은 기록", inst: "기록을 비교해 가장 좋은 기록을 골라 보세요.", hints: ["달리기는 가장 작은 수가 가장 빠른 기록이에요.", "1.4=1.400으로 생각해요."],
      render: (b, a) => c3Sent(b, a, [
        ["50 m 달리기 기록 ㉠ 9.7초 ㉡ 9.65초 ㉢ 10.2초 중 가장 빠른 기록은", { o: ["㉠", "㉡", "㉢"], a: 1, why: { "0": "9.7=9.70이에요. 9.65와 소수 첫째 자리 7과 6을 비교해요.", "2": "10.2초는 가장 오래 걸린 기록이에요. 달리기는 작은 수가 빨라요." } }],
        ["멀리뛰기 기록 1.4 m, 1.39 m, 1.425 m 중 가장 먼 기록은", { o: ["1.4 m", "1.39 m", "1.425 m"], a: 2, why: { "0": "1.4=1.400이에요. 1.425와 소수 둘째 자리 0과 2를 비교해요.", "1": "1.39는 소수 첫째 자리가 3이라서 가장 짧아요." } }]],
      { ok: "가장 빠른 달리기 기록은 9.65초, 가장 먼 멀리뛰기 기록은 1.425 m예요." }) }
  ],
  challenge: { inst: "★ 도전 — 수 카드 0, 2, 7, 9와 소수점 카드를 한 번씩 모두 사용하여 가장 작은 소수 세 자리 수를 만들어 보세요.", hints: ["소수 세 자리 수는 □.□□□ 꼴이에요.", "일의 자리에 0을 놓을 수 있어요."],
    render: (b, a) => c3Cards(b, a, { cards: ["0", "2", "7", "9", "."], n: 5,
      check: s => !/^\d\.\d\d\d$/.test(s) ? "소수 세 자리 수는 □.□□□ 꼴이에요." : s !== "0.279" ? "더 작은 소수 세 자리 수를 만들 수 있어요. 높은 자리에 작은 숫자부터 놓아요." : null,
      after: s => [
        [s + "를 읽으면", { t: ["영 점 이칠구"] }],
        [s + "의 100배는", { n: "27.9", why: { "2.79": "100배는 10배를 두 번 한 것이에요." } }]],
      ok: "가장 작은 소수 세 자리 수는 0.279이고, 100배 하면 27.9예요." }) }
},
{
  id: "s12", no: 12, title: "운동회 기록 발표회 ― 공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "소수를 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
  summary: "소수 두 자리 수·세 자리 수를 쓰고 읽고, 각 자리 숫자가 나타내는 수를 알아요. 소수의 크기는 자연수 부분부터 높은 자리 수를 차례대로 비교하고, 10배 하면 왼쪽으로, [1/10]을 하면 오른쪽으로 한 자리 이동해요. 소수의 덧셈과 뺄셈은 소수점의 위치를 맞추어 쓰고, 자연수처럼 같은 자리끼리 계산한 다음 소수점을 그대로 내려 찍어요.",
  steps: [
    { name: "만져 보기 — 기록 쓰고 읽기", inst: "운동회 기록 발표회 첫 순서예요. □ 안에 알맞은 수나 말을 써 보세요. (읽는 말은 다 쓰고 Enter를 눌러요.)", hints: ["‘영’은 0이에요.", "0.001이 1000개이면 1이에요."],
      render: (b, a) => c3Sent(b, a, [
        ["이 점 영칠오를 소수로 쓰면", { n: "2.075", why: { "2.75": "소수 첫째 자리 숫자는 0이에요." } }],
        ["6.08을 읽으면", { t: ["육 점 영팔"] }],
        ["0.01이 52개인 수는", { n: "0.52" }],
        ["3.104는 0.001이", { n: "3104" }, "개예요."]], { ok: "소수를 바르게 쓰고 읽을 수 있어요." }) },
    { name: "그려 보기 — 계산하기", inst: "계산해 보세요.", hints: ["소수점의 위치를 맞추어 같은 자리끼리 계산해요.", "5.2−3.48은 5.2=5.20으로 생각해요."],
      render: (b, a) => c3Sent(b, a, [c3Q("0.7+2.6", "3.3"), c3Q("6.4-2.7", "3.7"), c3Q("2.58+3.67", "6.25"), c3Q("5.2-3.48", "1.72")], { ok: "소수의 덧셈과 뺄셈을 정확하게 했어요." }) },
    { name: "말해 보기 — 같은 수, 큰 수", inst: "나타내는 수가 같은 것을 고르고, 세 소수를 큰 수부터 늘어놓아 보세요.", hints: ["0.004의 100배는 0.4예요.", "자연수 부분부터 비교해요."],
      render: (b, a) => c3Sent(b, a, [
        ["0.004의 100배와 같은 수는", { o: ["0.04의 10배", "4의 [1/100]"], a: 0, why: { "1": "0.004의 100배는 0.4, 4의 [1/100]은 0.04예요." } }],
        ["0.4의 [1/10]과 같은 수는", { o: ["0.04의 10배", "4의 [1/100]"], a: 1, why: { "0": "0.4의 [1/10]은 0.04, 0.04의 10배는 0.4예요." } }],
        ["㉠ 6.317 ㉡ 6.309 ㉢ 7.3을 큰 수부터 차례대로:", { o: ["㉢, ㉠, ㉡", "㉠, ㉡, ㉢", "㉢, ㉡, ㉠"], a: 0, why: { "1": "소수점 아래 숫자가 많다고 큰 수가 아니에요. 자연수 부분부터 비교해요.", "2": "6.317과 6.309는 소수 둘째 자리 1과 0을 비교해요." } }]],
      { ok: "0.004의 100배와 0.04의 10배는 0.4, 0.4의 [1/10]과 4의 [1/100]은 0.04예요. 큰 수부터 7.3, 6.317, 6.309예요." }) },
    { name: "확인하기 — 색칠하기", inst: "기록 발표회 포스터를 꾸며요. 식을 하나 골라 계산하고, 그 합이나 차가 적힌 칸을 그 식의 색으로 칠해 보세요.", hints: ["1.4+0.3=1.7이에요.", "3.56+1.78은 받아올림이 두 번 있어요.", "답이 아닌 수가 적힌 칸은 칠하지 않아요."],
      render: (b, a) => c3Color(b, a, { items: [{ e: "1.4+0.3", c: "#F4A7B9" }, { e: "3.56+1.78", c: "#9CC6EC" }, { e: "6.1-2.4", c: "#F6C08A" }, { e: "5.27-2.35", c: "#A9D8A2" }],
        labels: { earL: "1.7", earR: "1.7", head: "5.34", body: "3.7", carrot: "2.92", grass: "4.24", sun: "4.3" },
        ok: "1.4+0.3=1.7, 3.56+1.78=5.34, 6.1−2.4=3.7, 5.27−2.35=2.92예요. 4.24와 4.3은 받아올림·받아내림을 빠뜨렸을 때 나오는 수예요." }) },
    { name: "되돌아보기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["소수를 배우기 전의 생각을 떠올려요.", "0.01·0.001, 크기 비교, 소수점 맞추기를 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "배우기 전의 생각", ex: ["예전에는 소수점 아래 숫자가 많을수록 큰 수라고 생각했어요.", "예전에는 1.37을 ‘일 점 삼십칠’이라고 읽어도 된다고 생각했어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 자연수 부분부터 높은 자리 수를 차례대로 비교해야 한다는 것을 알아요.", "지금은 소수를 더하고 뺄 때 소수점의 위치를 맞추어 써야 한다고 생각해요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["공 던지기 기록 18.25 m와 18.3 m를 자릿값 표로 비교해 보고 바뀌었어요.", "2.75+0.6을 세로셈에서 카드를 옮겨 소수점을 맞추어 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "★★ 도전 — 수아는 운동회 날 물을 1.25 L 마셨고, 하린이는 수아보다 0.4 L 더 적게 마셨어요. 두 사람이 마신 물은 모두 몇 L일까요?", hints: ["먼저 하린이가 마신 양을 구해요: 1.25−0.4", "두 사람이 마신 양을 더해요."],
    render: (b, a) => c3Sent(b, a, [
      ["하린이가 마신 물: 1.25 − 0.4 =", { n: "0.85", e: "1.25-0.4", why: { "1.21": "0.4를 0.04처럼 뺐어요. 소수점을 맞추어요." } }, "L"],
      ["두 사람이 마신 물: 1.25 +", { n: "0.85" }, "=", { n: "2.1", e: "1.25+0.85" }, "L"]], { ok: "하린이는 0.85 L, 두 사람은 모두 2.1 L를 마셨어요." }) }
}
];
