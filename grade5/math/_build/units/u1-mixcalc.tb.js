//@@APP
const APP = {title:"자치회 활동 혼합 계산", unit:"5-1 수학 1. 자연수의 혼합 계산(교과서)", key:"t51-mixcalc-v1", welcome:"자치회 활동 혼합 계산 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 학급 임원이 된 서아와 함께 자치회 활동을 하며 덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식을 계산하는 순서를 알아봐요."};
//@@UNIT
/* ===== 1. 자연수의 혼합 계산 단원 조작 부품 (앞글자 mx1) =====
   식은 글로 적어요: "42−(17+8)" (−·×·÷ 또는 -·*·/ 모두 됨). 모든 값은 코드가 분수로 정확히 계산해요.
   mx1Order  계산 순서 나타내기(먼저 계산할 기호 누르기 → 값 쓰기, 식 아래에 ①②③ 선)
   mx1Build  수 카드·기호로 하나의 식 만들기(+ 앞 질문·답)      mx1Paren  ( )로 묶어 목표 수 만들기
   mx1Ops    ○ 안에 기호 넣기      mx1Slots  □ 안에 수 카드 넣기      mx1Match  관계있는 것끼리 선 잇기
   mx1Barbell 역기 원판 끼우기     mx1Bag    생존 가방 무게           mx1Story  문장 순서로 문제 만들기
   mx1Shop   조건 골라 문제 만들기  mx1BoardMake·mx1Bingo 빙고         mx1Dice   주사위 식 만들기
   mx1Chain  두 활동을 차례로 */
function mx1Style() {
  if (document.getElementById("mx1-style")) return;
  const s = document.createElement("style"); s.id = "mx1-style";
  s.textContent = `
.mx1box{border:3px solid var(--night);border-radius:var(--r);background:#fff;padding:.6em .8em;margin:.5em 0;max-width:100%;box-sizing:border-box}
.mx1lab{font-family:Jua,sans-serif;color:var(--pine);font-size:var(--fs)}
.mx1svg{display:block;width:100%;height:auto}
.mx1line{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.25);display:flex;flex-wrap:wrap;align-items:center;gap:.25em;margin:.25em 0}
.mx1line .mx1eq{color:var(--muted);margin-right:.2em}
.mx1tk{display:inline-block;padding:.05em .1em}
.mx1tk.mx1new{background:var(--ring-soft);border-radius:.3em;padding:.05em .3em}
button.mx1op{font-family:Jua,sans-serif;font-size:1em;min-width:1.9em;padding:.05em .35em;border:2px dashed var(--pine);border-radius:.4em;background:var(--pine-soft);color:var(--ink);cursor:pointer}
button.mx1op.mx1pick{border-style:solid;background:#FFE3C2;border-color:var(--tent)}
button.mx1op.mx1no{border-color:var(--no);background:#FBE0DE}
.mx1ask{display:flex;flex-wrap:wrap;align-items:center;gap:.4em;margin:.35em 0;font-family:Jua,sans-serif}
input.mx1in{width:5.4em;font-size:1.15em;text-align:center;font-family:Jua,sans-serif}
input.mx1in.w8{width:8em}
input.mx1ex{width:100%;max-width:22em;font-size:1.15em;font-family:Jua,sans-serif;box-sizing:border-box}
.mx1expr{min-height:2.1em;border:2px solid var(--line);border-radius:.5em;padding:.25em .5em;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.3);background:#FFFDF8;display:flex;flex-wrap:wrap;gap:.2em;align-items:center}
.mx1expr .mx1ph{color:var(--muted);font-size:var(--fs-s)}
.mx1keys{display:flex;flex-wrap:wrap;gap:.35em;margin:.4em 0}
.mx1keys button{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.2);min-width:2.3em;padding:.15em .45em;border-radius:.5em;border:2px solid var(--line);background:#fff;cursor:pointer}
.mx1keys button.mx1card{background:#FFF4D6;border-color:#E9C46A}
.mx1keys button.mx1sym{background:var(--pine-soft)}
.mx1keys button:disabled{opacity:.35}
.mx1note{font-size:var(--fs-s);color:var(--muted)}
.mx1live{font-family:Jua,sans-serif;color:var(--pine);margin:.3em 0}
.mx1sent{display:flex;flex-direction:column;gap:.35em}
.mx1sent button{text-align:left}
.mx1tbl{border-collapse:collapse;font-size:var(--fs-s);max-width:100%}
.mx1tbl td,.mx1tbl th{border:1px solid var(--line);padding:.2em .45em;text-align:center}
.mx1tbl th{background:var(--pine-soft)}
.mx1bag{display:grid;grid-template-columns:repeat(auto-fill,minmax(10.5em,1fr));gap:.4em}
.mx1item{border:2px solid var(--line);border-radius:.6em;padding:.3em .4em;background:#fff;font-size:var(--fs-s)}
.mx1item b{font-family:Jua,sans-serif;font-size:var(--fs)}
.mx1item .mx1cnt{display:flex;align-items:center;gap:.3em;margin-top:.2em}
.mx1item .mx1cnt button{min-width:2em;font-size:1em}
.mx1item.on{border-color:var(--tent);background:#FFF4E8}
.mx1grid{display:grid;grid-template-columns:repeat(4,minmax(0,3.6em));gap:.3em}
.mx1grid button{aspect-ratio:1;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.25);border:2px solid var(--line);border-radius:.5em;background:#fff;cursor:pointer;padding:0}
.mx1grid button.mx1hit{background:#FFD38A;border-color:var(--tent)}
.mx1grid button.mx1line{background:#FFB36B}
.mx1pal{display:grid;grid-template-columns:repeat(auto-fill,minmax(2.4em,1fr));gap:.25em;max-width:24em}
.mx1pal button{font-family:Jua,sans-serif;font-size:1em;padding:.15em 0;border-radius:.4em;border:2px solid var(--line);background:#fff}
.mx1pal button:disabled{opacity:.3}
.mx1flex{display:flex;flex-wrap:wrap;gap:1em;align-items:flex-start}
.mx1flex > *{min-width:0}
.mx1big{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.6);letter-spacing:.1em}
.mx1done{color:var(--pine);font-family:Jua,sans-serif}
`;
  document.head.append(s);
}
/* 받침에 맞는 조사: mx1J(33, "을를") → "33을" */
function mx1J(w, pair) {
  const s = String(w), c = s[s.length - 1];
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"] };
  const [a, b] = M[pair];
  if (pair === "으로") return s + (has && !rieul ? a : b);
  return s + (has ? a : b);
}
const mx1Prec = o => (o === "×" || o === "÷") ? 2 : 1;
const mx1Gcd = (a, b) => b ? mx1Gcd(b, a % b) : a;
/* 글 → 낱말(수·기호·괄호) */
function mx1Tok(s) {
  s = String(s).replace(/\s+/g, "").replace(/[*xX＊✕·]/g, "×").replace(/[/:÷]/g, "÷").replace(/[-‐–—－]/g, "−")
    .replace(/＋/g, "+").replace(/（/g, "(").replace(/）/g, ")").replace(/,/g, "");
  const out = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\d/.test(c)) { let j = i; while (j < s.length && /\d/.test(s[j])) j++; out.push({ t: "n", v: +s.slice(i, j) }); i = j; }
    else if ("+−×÷".includes(c)) { out.push({ t: "o", v: c }); i++; }
    else if (c === "(" || c === ")") { out.push({ t: c }); i++; }
    else return null;
  }
  return out;
}
/* 낱말 → 보기 좋은 글 */
function mx1Str(tk) {
  let s = "";
  tk.forEach((t, k) => {
    if (t.t === "n") s += t.v;
    else if (t.t === "o") s += " " + t.v + " ";
    else s += t.t;
  });
  return s.replace(/\s+/g, " ").trim();
}
const mx1S = e => mx1Str(mx1Tok(e));
/* 계산(분수로 정확히). lr=true면 ( ) 말고는 앞에서부터 차례대로(흔한 잘못 찾기용) */
function mx1Eval(tk, lr) {
  let i = 0, neg = false, frac = false;
  const F = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = mx1Gcd(Math.abs(n), d) || 1; return { n: n / g, d: d / g }; };
  const ap = (v, o, w) => {
    let r;
    if (o === "+") r = F(v.n * w.d + w.n * v.d, v.d * w.d);
    else if (o === "−") { r = F(v.n * w.d - w.n * v.d, v.d * w.d); if (r.n < 0) neg = true; }
    else if (o === "×") r = F(v.n * w.n, v.d * w.d);
    else { if (w.n === 0) throw new Error("0으로 나눌 수 없어요."); r = F(v.n * w.d, v.d * w.n); if (r.d !== 1) frac = true; }
    return r;
  };
  const E = m => { throw new Error(m); };
  function prim() {
    const t = tk[i];
    if (!t) E("식이 끝나지 않았어요. 기호 뒤에 수를 넣어요.");
    if (t.t === "n") { i++; return F(t.v); }
    if (t.t === "(") { i++; const v = expr(); if (!tk[i] || tk[i].t !== ")") E("( 와 )의 짝이 맞지 않아요."); i++; return v; }
    if (t.t === ")") E("( 와 )의 짝이 맞지 않아요. ( ) 안에 식을 넣어요.");
    E("기호가 두 번 이어졌어요. 기호와 기호 사이에 수를 넣어요.");
  }
  function term() {
    let v = prim();
    while (tk[i] && tk[i].t === "o" && (lr || mx1Prec(tk[i].v) === 2)) { const o = tk[i++].v; v = ap(v, o, lr ? prim() : prim()); }
    return v;
  }
  function expr() {
    let v = term();
    while (tk[i] && tk[i].t === "o") { const o = tk[i++].v; v = ap(v, o, term()); }
    return v;
  }
  try {
    if (!tk || !tk.length) E("식을 만들어 봐요.");
    const v = expr();
    if (i < tk.length) { const t = tk[i]; if (t.t === ")") E("( 와 )의 짝이 맞지 않아요."); E("수와 수 사이(또는 수와 ( 사이)에 기호를 넣어요."); }
    return { ok: true, v, int: v.d === 1 ? v.n : null, neg, frac };
  } catch (e) { return { ok: false, err: e.message }; }
}
const mx1Val = e => { const r = mx1Eval(typeof e === "string" ? mx1Tok(e) : e); return r.ok ? r.int : null; };
/* 지금 계산할 기호(교과서 약속): 가장 안쪽 ( ) → 곱셈·나눗셈 앞에서부터 → 덧셈·뺄셈 앞에서부터 */
function mx1Next(tk) {
  let lo = 0, hi = tk.length;
  const fr = tk.findIndex(t => t.t === ")");
  if (fr >= 0) { let k = fr; while (tk[k].t !== "(") k--; lo = k + 1; hi = fr; }
  for (let k = lo; k < hi; k++) if (tk[k].t === "o" && mx1Prec(tk[k].v) === 2) return k;
  for (let k = lo; k < hi; k++) if (tk[k].t === "o") return k;
  return -1;
}
/* k번 기호를 둘러싼 같은 높이 묶음의 범위 */
function mx1Level(tk, k) {
  let d = 0, lo = 0, hi = tk.length;
  for (let j = k - 1; j >= 0; j--) { if (tk[j].t === ")") d++; else if (tk[j].t === "(") { if (d === 0) { lo = j + 1; break; } d--; } }
  d = 0;
  for (let j = k + 1; j < tk.length; j++) { if (tk[j].t === "(") d++; else if (tk[j].t === ")") { if (d === 0) { hi = j; break; } d--; } }
  return [lo, hi];
}
function mx1Ops2(tk, lo, hi, d0) {   /* 같은 높이(괄호 깊이 0)의 기호들 */
  const r = []; let d = 0;
  for (let j = lo; j < hi; j++) { const t = tk[j]; if (t.t === "(") d++; else if (t.t === ")") d--; else if (t.t === "o" && d === 0) r.push(j); }
  return r;
}
function mx1MDName(tk, idxs) {
  const m = idxs.some(j => tk[j].v === "×"), q = idxs.some(j => tk[j].v === "÷");
  return m && q ? "곱셈과 나눗셈" : m ? "곱셈" : "나눗셈";
}
/* 기호를 잘못 골랐을 때 까닭(null이면 계산할 수는 있는 기호) */
function mx1WhyNot(tk, k) {
  const a = tk[k - 1], b = tk[k + 1];
  if (!a || !b || a.t !== "n" || b.t !== "n") return "이 기호 앞이나 뒤에 ( )가 있어요. ( ) 안을 먼저 계산해야 이 기호로 계산할 두 수가 정해져요.";
  const [lo, hi] = mx1Level(tk, k), same = mx1Ops2(tk, lo, hi);
  const md = same.filter(j => mx1Prec(tk[j].v) === 2);
  const p = mx1Prec(tk[k].v);
  if (p === 1 && md.length) return `덧셈, 뺄셈보다 ${mx1MDName(tk, md)}${mx1J(mx1MDName(tk, md), "을를").slice(mx1MDName(tk, md).length)} 먼저 계산해요.`;
  const before = same.filter(j => j < k && mx1Prec(tk[j].v) === p);
  if (before.length) return p === 2 ? "곱셈과 나눗셈이 섞여 있으면 앞에서부터 차례대로 계산해요. 앞에 있는 계산을 먼저 해요." : "덧셈과 뺄셈이 섞여 있으면 앞에서부터 차례대로 계산해요. 앞에 있는 계산을 먼저 해요.";
  return null;
}
/* k번 기호로 계산한 뒤의 낱말(값에 원래 자리 범위 s·e를 붙임) */
function mx1Reduce(tk, k) {
  const a = tk[k - 1], o = tk[k], b = tk[k + 1];
  const v = o.v === "+" ? a.v + b.v : o.v === "−" ? a.v - b.v : o.v === "×" ? a.v * b.v : a.v / b.v;
  const nt = { t: "n", v, s: Math.min(a.s, o.s), e: Math.max(b.e, o.e), fresh: true };
  const step = { o: o.v, a: a.v, b: b.v, v, s: nt.s, e: nt.e, op: o.s };
  let out = tk.slice(0, k - 1).concat([nt], tk.slice(k + 2)).map(t => t === nt ? t : Object.assign({}, t, { fresh: false }));
  const j = out.indexOf(nt);
  if (out[j - 1] && out[j - 1].t === "(" && out[j + 1] && out[j + 1].t === ")") { nt.s = out[j - 1].s; nt.e = out[j + 1].e; out = out.slice(0, j - 1).concat([nt], out.slice(j + 2)); }
  return { tk: out, step };
}
const mx1Origin = e => mx1Tok(e).map((t, k) => Object.assign(t, { s: k, e: k }));
/* 교과서 순서대로 다 계산한 과정: ["42 − 25", "17"] 와 단계들 */
function mx1Steps(e) {
  let tk = mx1Origin(e); const lines = [], steps = [];
  while (tk.length > 1) { const k = mx1Next(tk); if (k < 0) break; const r = mx1Reduce(tk, k); tk = r.tk; steps.push(r.step); lines.push(mx1Str(tk)); }
  return { lines, steps, v: tk[0].v };
}
const mx1Chain1 = e => mx1S(e) + " = " + mx1Steps(e).lines.join(" = ");

/* 식 아래 계산 순서 선 그리기(원래 식 + ①②③ 꺾인 선) */
function mx1OrderSvg(orig, steps) {
  const FS = 30, W = t => t.t === "n" ? 18 * String(t.v).length + 14 : t.t === "o" ? 38 : 16;
  const xs = []; let x = 10; orig.forEach(t => { xs.push([x, x + W(t)]); x += W(t); });
  const lv = steps.map(() => 1);
  steps.forEach((s, i) => { for (let j = 0; j < i; j++) if (steps[j].s >= s.s && steps[j].e <= s.e) lv[i] = Math.max(lv[i], lv[j] + 1); });
  const maxL = Math.max(1, ...lv), H = 52 + maxL * 30 + 6, VW = Math.max(x + 10, 200);
  const svg = makeSvg(VW, H); svg.classList.add("mx1svg"); svg.style.maxWidth = (VW * 1.25) + "px";
  orig.forEach((t, k) => svg.append(txt((xs[k][0] + xs[k][1]) / 2, 26, t.t === "n" ? String(t.v) : t.t === "o" ? t.v : t.t, FS, { fill: t.t === "o" ? "#2F6B57" : "#1D2A2A" })));
  const C = ["①", "②", "③", "④", "⑤", "⑥"];
  steps.forEach((s, i) => {
    const x1 = xs[s.s][0] + 4, x2 = xs[s.e][1] - 4, y = 46 + lv[i] * 30 - 10;
    svg.append(svgEl("path", { d: `M${x1} 46 V${y} H${x2} V46`, fill: "none", stroke: "#E47A38", "stroke-width": 3, "stroke-linejoin": "round" }));
    const mx = (xs[s.op][0] + xs[s.op][1]) / 2;
    svg.append(svgEl("circle", { cx: mx, cy: y, r: 13, fill: "#fff", stroke: "#E47A38", "stroke-width": 2 }));
    svg.append(txt(mx, y + 1, C[i] || String(i + 1), 20, { fill: "#C0571C" }));
  });
  return svg;
}
function mx1Input(label, wide) {
  return h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "mx1in" + (wide ? " w8" : ""), "aria-label": label });
}
const mx1Num = inp => { const s = String(inp.value).replace(/[\s,]/g, ""); return s === "" ? null : (/^\d+$/.test(s) ? Number(s) : NaN); };
const mx1Paint = (inp, good) => { inp.style.borderColor = good ? "var(--ok)" : "var(--no)"; };
function mx1Act(label, fn) { return h("div", { class: "actions" }, h("button", { class: "big", onclick: fn }, label || "확인하기")); }

/* ① 계산 순서 나타내기
   items: [{e:"42−17+8", label:"가", first:true(가장 먼저 계산할 부분만)}]  opt: {type:false(값을 저절로), cmp:true(두 식 크기 비교), ok} */
function mx1Order(body, api, items, opt = {}) {
  mx1Style();
  const wrap = h("div"); body.append(wrap);
  const results = [];
  let cur = null;           // 지금 하는 식의 상태
  const typeVals = opt.type !== false;
  const firstOf = e => { const tk = mx1Origin(e), k = mx1Next(tk); return `${tk[k - 1].v} ${tk[k].v} ${tk[k + 1].v}`; };
  api.provide({ words: ["( ) 안", "곱셈과 나눗셈", "덧셈과 뺄셈", "앞에서부터 차례대로"],
    answers: items.map(it => it.first ? `${mx1S(it.e)} → ${firstOf(it.e)}` : mx1Chain1(it.e)) });
  const tokSpan = t => h("span", { class: "mx1tk" + (t.fresh ? " mx1new" : "") }, t.t === "n" ? String(t.v) : t.t === "o" ? t.v : t.t);
  function start(n) {
    if (n >= items.length) return finish();
    const it = items[n];
    const box = h("div", { class: "mx1box" });
    const orig = mx1Origin(it.e);
    const st = { n, it, box, orig, tk: orig.map(t => Object.assign({}, t)), steps: [], pick: -1, inp: null, svgHolder: h("div"), lines: h("div") };
    box.append(h("div", { class: "mx1lab" }, (it.label ? it.label + " · " : (items.length > 1 ? (n + 1) + ". " : "")) + (it.first ? "가장 먼저 계산할 기호를 눌러요" : "먼저 계산할 기호를 차례로 눌러요")), st.svgHolder, st.lines);
    wrap.append(box);
    cur = st; draw();
  }
  function draw() {
    const st = cur;
    st.svgHolder.innerHTML = ""; st.svgHolder.append(mx1OrderSvg(st.orig, st.steps));
    st.lines.querySelectorAll(".mx1cur").forEach(x => x.remove());
    if (st.done) return;
    const line = h("div", { class: "mx1line mx1cur" }, st.steps.length ? h("span", { class: "mx1eq" }, "=") : null);
    st.tk.forEach((t, k) => {
      if (t.t === "o") { const b = h("button", { class: "mx1op" + (k === st.pick ? " mx1pick" : ""), "aria-label": `${t.v} 기호`, onclick: () => pickOp(k, b) }, t.v); line.append(b); }
      else line.append(tokSpan(t));
    });
    st.lines.append(line);
    if (st.pick >= 0 && typeVals) {
      const t = st.tk, k = st.pick;
      st.inp = mx1Input(`${t[k - 1].v} ${t[k].v} ${t[k + 1].v}`);
      st.inp.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
      st.lines.append(h("div", { class: "mx1ask mx1cur" }, h("span", {}, `${t[k - 1].v} ${t[k].v} ${t[k + 1].v} =`), st.inp));
      setTimeout(() => { try { st.inp.focus({ preventScroll: true }); } catch (e) { } }, 30);
    }
  }
  function pickOp(k, btn) {
    const st = cur; if (!st || st.done) return;
    const want = mx1Next(st.tk);
    if (k !== want) {
      api.tryOnce();
      const why = mx1WhyNot(st.tk, k);
      btn.classList.add("mx1no"); setTimeout(() => btn.classList.remove("mx1no"), 900);
      if (why) return api.fail(why, `${mx1Str(st.tk)}에서 ${st.tk[k].v} 먼저`);
      const hasP = st.tk.some(t => t.t === "(");
      return api.hint(hasP ? "그 계산도 할 수는 있지만, ( )가 있으면 ( ) 안을 가장 먼저 계산하기로 약속했어요." : "그 계산도 할 수는 있지만, 곱셈과 나눗셈끼리는 앞에서부터 차례대로 계산하기로 해요.");
    }
    if (st.it.first) {
      const r = mx1Reduce(st.tk, k); st.steps.push(r.step); st.done = true; draw();
      st.lines.append(h("div", { class: "mx1done" }, `○ 가장 먼저 ${r.step.a} ${r.step.o} ${r.step.b}${mx1J(String(r.step.b), "을를").slice(String(r.step.b).length)} 계산해요.`));
      results.push(null);
      return start(st.n + 1);
    }
    if (!typeVals) return apply(k);
    st.pick = k; draw();
    api.hint("고른 계산의 값을 쓰고 ‘확인하기’를 눌러요.");
  }
  function apply(k) {
    const st = cur;
    const cl = st.lines.querySelector(".mx1line.mx1cur");
    st.lines.querySelectorAll(".mx1ask.mx1cur").forEach(x => x.remove());
    if (cl) {
      if (st.steps.length) { cl.classList.remove("mx1cur"); cl.querySelectorAll("button.mx1op").forEach(b => b.replaceWith(h("span", { class: "mx1tk" }, b.textContent))); }
      else cl.remove();
    }
    const r = mx1Reduce(st.tk, k); st.steps.push(r.step); st.tk = r.tk; st.pick = -1;
    if (st.tk.length === 1) {
      st.done = true; draw(); results.push(st.tk[0].v);
      st.lines.append(h("div", { class: "mx1line" }, h("span", { class: "mx1eq" }, "="), h("span", { class: "mx1tk mx1new" }, String(st.tk[0].v))));
      api.hint(`○ ${mx1S(st.it.e)} = ${st.tk[0].v}`);
      return start(st.n + 1);
    }
    draw();
  }
  function check() {
    if (cmpBox) return checkCmp();
    const st = cur;
    if (!st || st.done) return;
    if (st.pick < 0) return api.hint("먼저 계산할 기호를 눌러요.");
    api.tryOnce();
    const t = st.tk, k = st.pick, a = t[k - 1].v, o = t[k].v, b = t[k + 1].v;
    const want = o === "+" ? a + b : o === "−" ? a - b : o === "×" ? a * b : a / b;
    const v = mx1Num(st.inp);
    mx1Paint(st.inp, v === want);
    if (v !== want) return api.fail(`${a} ${o} ${b}${mx1J(String(b), "을를").slice(String(b).length)} 다시 계산해 봐요.`, `${a}${o}${b}=${st.inp.value}`);
    api.hint("○ 맞아요. 다음에 계산할 기호를 눌러요.");
    apply(k);
  }
  let cmpBox = null, cmpSel = null;
  function finish() {
    cur = null;
    if (opt.cmp && results.length >= 2) {
      const A = items[0].label || "첫째 식", B = items[1].label || "둘째 식";
      const row = h("div", { class: "opts" });
      [">", "=", "<"].forEach(c => row.append(h("button", { class: "opt", onclick: e => { [...row.children].forEach(x => x.classList.remove("on")); e.currentTarget.classList.add("on"); cmpSel = c; } }, c)));
      cmpBox = h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, `두 식의 계산 결과를 비교해요: ${A} ○ ${B}`), row);
      wrap.append(cmpBox);
      return api.hint("두 식의 계산 결과를 비교해 ○ 안에 알맞은 것을 골라요.");
    }
    api.done(items.map((it, i) => it.first ? mx1S(it.e) + " → " + firstOf(it.e) : `${mx1S(it.e)}=${results[i]}`).join(" / "), opt.ok || "계산 순서를 잘 나타내고 계산했어요!");
  }
  function checkCmp() {
    api.tryOnce();
    const a = results[0], b = results[1], want = a > b ? ">" : a < b ? "<" : "=";
    if (cmpSel !== want) return api.fail(`${a}${mx1J(String(a), "과와").slice(String(a).length)} ${b}의 크기를 비교해 봐요.`, `${a} ${cmpSel || "-"} ${b}`);
    api.done(items.slice(0, 2).map((it, i) => `${mx1S(it.e)}=${results[i]}`).join(" / ") + ` / ${a} ${want} ${b}`, opt.ok || "( )가 있고 없음에 따라 계산 순서와 결과가 달라져요!");
  }
  body.append(mx1Act("확인하기", check));
  start(0);
}

/* 수 카드와 기호로 식 만들기(부품 속 부품)
   o: {cards:[..], reuse:false, syms:"+−×÷()", ph} → {el, toks(), usedAll(), reset()} */
function mx1Builder(o) {
  mx1Style();
  const toks = [];  // {t, v, ci}
  const expr = h("div", { class: "mx1expr", "aria-live": "polite" });
  const keys = h("div", { class: "mx1keys" });
  const cardBtns = [];
  const syms = (o.syms || "+−×÷()").split("");
  const render = () => {
    expr.innerHTML = "";
    if (!toks.length) expr.append(h("span", { class: "mx1ph" }, o.ph || "수 카드와 기호를 눌러 식을 만들어요"));
    else expr.append(h("span", {}, mx1Str(toks)));
    if (!o.reuse) cardBtns.forEach((b, i) => { b.disabled = toks.some(t => t.ci === i); });
    o.onChange && o.onChange();
  };
  (o.cards || []).forEach((c, i) => {
    const b = h("button", { class: "mx1card", onclick: () => { toks.push({ t: "n", v: c, ci: i }); render(); } }, String(c));
    cardBtns.push(b); keys.append(b);
  });
  syms.forEach(s => keys.append(h("button", { class: "mx1sym", "aria-label": s, onclick: () => { toks.push(s === "(" || s === ")" ? { t: s } : { t: "o", v: s }); render(); } }, s)));
  keys.append(h("button", { onclick: () => { toks.pop(); render(); } }, "⌫"), h("button", { onclick: () => { toks.length = 0; render(); } }, "지우기"));
  render();
  return {
    el: h("div", {}, expr, keys),
    toks: () => toks.slice(),
    nums: () => toks.filter(t => t.t === "n").map(t => t.v),
    reset() { toks.length = 0; render(); },
    setCards(cs) { o.cards = cs; }
  };
}
/* 수 카드를 모두 한 번씩 썼는지 */
function mx1SameBag(a, b) { const x = a.slice().sort((p, q) => p - q), y = b.slice().sort((p, q) => p - q); return x.length === y.length && x.every((v, i) => v === y[i]); }
/* 만든 식 채점(공통) → 잘못이면 까닭 글, 맞으면 null */
function mx1Judge(tk, o) {
  const r = mx1Eval(tk);
  if (!r.ok) return r.err;
  const nums = tk.filter(t => t.t === "n").map(t => t.v);
  if (!o.reuse && !o.atMost && o.cards && !mx1SameBag(nums, o.cards)) return "수 카드를 모두 한 번씩 사용해 식을 만들어요.";
  const cnt = {}, u = {}; (o.cards || []).forEach(c => cnt[c] = (cnt[c] || 0) + 1); nums.forEach(n => u[n] = (u[n] || 0) + 1);
  if (o.atMost && (Object.keys(u).some(n => !cnt[n] || u[n] > cnt[n]) || Object.keys(cnt).some(c => !u[c]))) return "수 카드에 있는 수를 모두 사용해 식을 만들어요. 같은 카드를 두 번 쓸 수는 없어요.";
  if (o.reuse && o.cards && (nums.some(n => !cnt[n]) || Object.keys(cnt).some(c => (u[c] || 0) < cnt[c]))) return "수 카드에 있는 수만, 그리고 모든 카드를 사용해요.";
  if (o.kinds && new Set(tk.filter(t => t.t === "o").map(t => t.v)).size < o.kinds) return `+, −, ×, ÷ 중에서 서로 다른 ${o.kinds}가지를 사용해야 해요.`;
  if (o.paren && !tk.some(t => t.t === "(")) return "( )를 사용하여 하나의 식으로 나타내 봐요.";
  if (!tk.some(t => t.t === "o")) return "기호를 넣어 하나의 식으로 나타내요.";
  if (r.neg) return "계산하는 중에 작은 수에서 큰 수를 빼게 돼요. 식을 다시 살펴봐요.";
  if (r.frac) return "나누어떨어지지 않는 나눗셈이 있어요. 식을 다시 살펴봐요.";
  if (o.target != null && r.int !== o.target) {
    const lr = mx1Eval(tk, true);
    if (o.why && o.why[String(r.int)]) return o.why[String(r.int)];
    if (lr.ok && lr.int === o.target) return `앞에서부터 차례대로 계산하면 ${o.target}${mx1J(String(o.target), "이가").slice(String(o.target).length)} 되지만, 이 식은 곱셈·나눗셈을 먼저 계산하므로 ${r.int}${mx1J(String(r.int), "이에요").slice(String(r.int).length)}. 먼저 계산할 부분을 ( )로 묶어 봐요.`;
    return `만든 식을 계산하면 ${r.int}${mx1J(String(r.int), "이에요").slice(String(r.int).length)}. 문제에서 무엇을 먼저 구해야 하는지 다시 생각해 봐요.`;
  }
  return null;
}
/* 앞 질문(수 입력) 줄 */
function mx1AskRows(ask) {
  return (ask || []).map(it => {
    const inp = mx1Input(it.q, true);
    const row = h("div", { class: "mx1ask" }, h("span", {}, it.q), inp, it.unit ? h("span", {}, it.unit) : null);
    return { it, inp, row };
  });
}
function mx1AskCheck(rows) {
  for (const R of rows) {
    const v = mx1Num(R.inp), good = v === R.it.a; mx1Paint(R.inp, good);
    if (!good) return (R.it.why && R.it.why[String(v)]) || `‘${R.it.q}’를 다시 생각해 봐요.`;
  }
  return null;
}

/* ② 하나의 식으로 나타내기
   opt: {pic:()=>요소, ask:[{q,a,unit,why}], cards, target, paren, prompt, ansQ, unit, noAns, why:{값:"까닭"}, ex:"모범 식", ok} */
function mx1Build(body, api, opt) {
  mx1Style();
  if (opt.pic) body.append(h("div", { class: "mx1box" }, opt.pic()));
  const rows = mx1AskRows(opt.ask);
  rows.forEach(R => body.append(R.row));
  const B = mx1Builder({ cards: opt.cards, reuse: opt.reuse });
  body.append(h("div", { class: "jua", style: "margin-top:.5em" }, opt.prompt || "수 카드와 기호를 눌러 하나의 식으로 나타내요."), B.el);
  let ansIn = null;
  if (!opt.noAns) { ansIn = mx1Input(opt.ansQ || "답", true); body.append(h("div", { class: "mx1ask" }, h("span", {}, (opt.ansQ || "답") + " "), ansIn, opt.unit ? h("span", {}, opt.unit) : null)); }
  const ex = opt.ex ? mx1S(opt.ex) : null;
  api.provide({ words: ["하나의 식", "( )", "앞에서부터 차례대로"], answers: rows.map(R => `${R.it.q} ${R.it.a}`).concat(ex ? [`${ex} = ${opt.target}`] : []).concat(ansIn ? [`${opt.target}${opt.unit ? " " + opt.unit : ""}`] : []) });
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    const given = rows.map(R => R.inp.value || "-").concat([mx1Str(B.toks()) || "-"]).concat(ansIn ? [ansIn.value || "-"] : []).join(" / ");
    const m1 = mx1AskCheck(rows); if (m1) return api.fail(m1, given);
    const m2 = mx1Judge(B.toks(), opt); if (m2) return api.fail(m2, given);
    if (ansIn) { const v = mx1Num(ansIn), g = v === opt.target; mx1Paint(ansIn, g); if (!g) return api.fail("식은 맞아요. 식을 계산한 값을 답에 써요.", given); }
    api.done(given, opt.ok || "하나의 식으로 나타내어 구했어요!");
  }));
}

/* ③ ( )로 묶어 목표 수 만들기  items:[{e:"24−18÷2+7", target:10}] */
function mx1Paren(body, api, items, opt = {}) {
  mx1Style();
  const S = items.map(it => ({ it, tk: mx1Tok(it.e), a: -1, b: -1 }));
  const sols = S.map(s => {
    const nIdx = s.tk.map((t, k) => t.t === "n" ? k : -1).filter(k => k >= 0), out = [];
    for (let i = 0; i < nIdx.length; i++) for (let j = i + 1; j < nIdx.length; j++) {
      if (i === 0 && j === nIdx.length - 1) continue;
      const t2 = s.tk.slice(0, nIdx[i]).concat([{ t: "(" }], s.tk.slice(nIdx[i], nIdx[j] + 1), [{ t: ")" }], s.tk.slice(nIdx[j] + 1));
      const r = mx1Eval(t2); if (r.ok && !r.neg && !r.frac && r.int === s.it.target) out.push(mx1Str(t2));
    }
    return out;
  });
  api.provide({ words: ["( ) 안을 가장 먼저"], answers: sols.map((x, i) => `${x[0]} = ${S[i].it.target}`) });
  const withP = s => { if (s.a < 0 || s.b < 0) return s.tk; return s.tk.slice(0, s.a).concat([{ t: "(" }], s.tk.slice(s.a, s.b + 1), [{ t: ")" }], s.tk.slice(s.b + 1)); };
  S.forEach((s, n) => {
    const box = h("div", { class: "mx1box" }), line = h("div", { class: "mx1line" }), live = h("div", { class: "mx1live" });
    const draw = () => {
      line.innerHTML = "";
      s.tk.forEach((t, k) => {
        if (k === s.a) line.append(h("span", { class: "mx1tk mx1new" }, "("));
        if (t.t === "n") line.append(h("button", { class: "mx1op", style: "border-style:solid;background:#fff", onclick: () => tap(k) }, String(t.v)));
        else line.append(h("span", { class: "mx1tk" }, t.v));
        if (k === s.b) line.append(h("span", { class: "mx1tk mx1new" }, ")"));
      });
      line.append(h("span", { class: "mx1tk" }, "= " + s.it.target));
      if (s.a >= 0 && s.b >= 0) { const r = mx1Eval(withP(s)); live.textContent = r.ok && r.int != null ? `( )를 넣은 식을 계산하면 ${r.int}` : "이렇게 묶으면 자연수로 계산되지 않아요."; }
      else live.textContent = s.a >= 0 ? "이제 ) 를 넣을 수를 눌러요." : "( 를 넣을 수를 먼저 눌러요.";
    };
    const tap = k => {
      if (s.a < 0 || s.b >= 0) { s.a = k; s.b = -1; }
      else if (k <= s.a) { s.a = k; }
      else s.b = k;
      draw();
    };
    s.check = () => { if (s.a < 0 || s.b < 0) return "( 와 )를 모두 넣어요."; const r = mx1Eval(withP(s)); if (!r.ok || r.int !== s.it.target) return `지금 식을 계산하면 ${r.ok && r.int != null ? r.int : "자연수가 아니에요"}. ( )를 다른 곳에 넣어 봐요.`; return null; };
    s.str = () => mx1Str(withP(s));
    box.append(h("div", { class: "mx1lab" }, (items.length > 1 ? (n + 1) + ". " : "") + "수를 눌러 ( )를 넣어요"), line, live,
      h("button", { class: "ghost", onclick: () => { s.a = -1; s.b = -1; draw(); } }, "( ) 지우기"));
    body.append(box); draw();
  });
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    for (const s of S) { const m = s.check(); if (m) return api.fail(m, S.map(x => x.str()).join(" / ")); }
    api.done(S.map(x => x.str() + "=" + x.it.target).join(" / "), opt.ok || "( )를 알맞게 넣었어요!");
  }));
}

/* ④ ○ 안에 기호 넣기  items:[{tpl:"72 ○ (6 ○ 2)", ops:["×","÷"], once:true, goal:"min"|"max"|수, calc:true}] */
function mx1Ops(body, api, items, opt = {}) {
  mx1Style();
  const perms = (arr, k, once) => {   // 길이 k 기호 배열 모두
    const out = [];
    const rec = (cur) => { if (cur.length === k) { if (!once || (k === arr.length && new Set(cur).size === k)) out.push(cur.slice()); return; } arr.forEach(o => { cur.push(o); rec(cur); cur.pop(); }); };
    rec([]); return out;
  };
  const fill = (tpl, os) => { let i = 0; return tpl.replace(/○/g, () => os[i++]); };
  const S = items.map(it => {
    const k = (it.tpl.match(/○/g) || []).length;
    const all = perms(it.ops, k, it.once).map(os => ({ os, v: mx1Val(fill(it.tpl, os)) })).filter(x => x.v != null && x.v >= 0);
    let best;
    if (it.goal === "min") { const m = Math.min(...all.map(x => x.v)); best = all.filter(x => x.v === m); }
    else if (it.goal === "max") { const m = Math.max(...all.map(x => x.v)); best = all.filter(x => x.v === m); }
    else best = all.filter(x => x.v === it.goal);
    return { it, k, sel: Array(k).fill(null), best, inp: null };
  });
  api.provide({ words: S.flatMap(s => s.it.ops), answers: S.map(s => `${mx1S(fill(s.it.tpl, s.best[0].os))} = ${s.best[0].v}`) });
  S.forEach((s, n) => {
    const box = h("div", { class: "mx1box" }), line = h("div", { class: "mx1line" });
    const draw = () => {
      line.innerHTML = ""; let i = 0;
      s.it.tpl.split(/(○)/).forEach(part => {
        if (part === "○") { const j = i++; line.append(h("button", { class: "mx1op" + (s.sel[j] ? " mx1pick" : ""), "aria-label": "기호 칸", onclick: () => { const o = s.it.ops, c = s.sel[j]; s.sel[j] = c == null ? o[0] : (o.indexOf(c) + 1 < o.length ? o[o.indexOf(c) + 1] : null); draw(); } }, s.sel[j] || "○")); }
        else if (part.trim()) line.append(h("span", { class: "mx1tk" }, part.trim()));
      });
      if (typeof s.it.goal === "number") line.append(h("span", { class: "mx1tk" }, "= " + s.it.goal));
    };
    draw();
    box.append(h("div", { class: "mx1lab" }, (items.length > 1 ? (n + 1) + ". " : "") + (s.it.goal === "min" ? "계산 결과가 가장 작게" : s.it.goal === "max" ? "계산 결과가 가장 크게" : `계산 결과가 ${s.it.goal}${mx1J(String(s.it.goal), "이가").slice(String(s.it.goal).length)} 되게`) + ` ○를 눌러 ${s.it.ops.join(", ")}를 넣어요${s.it.once ? "(한 번씩)" : ""}`), line);
    if (s.it.calc) { s.inp = mx1Input("계산 결과"); box.append(h("div", { class: "mx1ask" }, h("span", {}, "만든 식을 계산하면"), s.inp)); }
    body.append(box);
  });
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    const given = S.map(s => s.sel.map(x => x || "○").join(",") + (s.inp ? "=" + s.inp.value : "")).join(" / ");
    for (const s of S) {
      if (s.sel.some(x => !x)) return api.fail("○ 안을 모두 채워요.", given);
      if (s.it.once && new Set(s.sel).size !== s.sel.length) return api.fail(`${s.it.ops.join(", ")}를 한 번씩 써요.`, given);
      const v = mx1Val(fill(s.it.tpl, s.sel));
      if (!s.best.some(b => b.os.join() === s.sel.join())) {
        if (s.it.goal === "min") return api.fail(`지금 식의 계산 결과는 ${v}${mx1J(String(v), "이에요").slice(String(v).length)}. 더 작게 만들 수 있어요. 나누는 수는 크게, 곱하는 수는 작게 해 봐요.`, given);
        if (s.it.goal === "max") return api.fail(`지금 식의 계산 결과는 ${v}${mx1J(String(v), "이에요").slice(String(v).length)}. 더 크게 만들 수 있어요.`, given);
        return api.fail(v == null ? "이렇게 넣으면 나누어떨어지지 않아요." : `지금 식을 계산하면 ${v}${mx1J(String(v), "이에요").slice(String(v).length)}. 앞에서부터 차례대로 계산하는 것을 잊지 말아요.`, given);
      }
      if (s.inp) { const x = mx1Num(s.inp), g = x === v; mx1Paint(s.inp, g); if (!g) return api.fail("기호는 알맞게 넣었어요. 만든 식을 계산 순서에 맞게 계산해 써요.", given); }
    }
    api.done(given, opt.ok || "기호를 알맞게 넣었어요!");
  }));
}

/* ⑤ □ 안에 수 카드 넣기  opt:{tpl:"□×(□+□)−28÷7", cards:[5,9,3], goal:"min"|"max", calc:true, ok} */
function mx1Slots(body, api, opt) {
  mx1Style();
  const k = (opt.tpl.match(/□/g) || []).length;
  const fill = arr => { let i = 0; return opt.tpl.replace(/□/g, () => arr[i++]); };
  const perm = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perm(a.slice(0, i).concat(a.slice(i + 1))).map(p => [x].concat(p)));
  const all = perm(opt.cards).map(p => ({ p, v: mx1Val(fill(p)) })).filter(x => x.v != null && x.v >= 0);
  const m = opt.goal === "max" ? Math.max(...all.map(x => x.v)) : Math.min(...all.map(x => x.v));
  const best = all.filter(x => x.v === m);
  const sel = Array(k).fill(null);   // 카드 번호
  const box = h("div", { class: "mx1box" }), line = h("div", { class: "mx1line" }), tray = h("div", { class: "mx1keys" });
  api.provide({ words: ["곱하는 수", "가장 작은 수"], answers: [`${mx1S(fill(best[0].p))} = ${m}`] });
  const draw = () => {
    line.innerHTML = ""; let i = 0;
    opt.tpl.split(/(□)/).forEach(part => {
      if (part === "□") { const j = i++; line.append(h("button", { class: "mx1op" + (sel[j] != null ? " mx1pick" : ""), "aria-label": "수 칸", onclick: () => { sel[j] = null; draw(); } }, sel[j] != null ? String(opt.cards[sel[j]]) : "□")); }
      else if (part) line.append(h("span", { class: "mx1tk" }, mx1S(part) || part));
    });
    tray.innerHTML = "";
    opt.cards.forEach((c, ci) => tray.append(h("button", { class: "mx1card", disabled: sel.includes(ci), onclick: () => { const j = sel.indexOf(null); if (j >= 0) { sel[j] = ci; draw(); } } }, String(c))));
  };
  draw();
  const inp = mx1Input("계산 결과");
  box.append(h("div", { class: "mx1lab" }, `수 카드를 눌러 □ 안에 한 번씩 넣어 계산 결과가 가장 ${opt.goal === "max" ? "크게" : "작게"} 만들어요(넣은 수를 누르면 빠져요)`), line, tray,
    h("div", { class: "mx1ask" }, h("span", {}, "만든 식을 계산하면"), inp));
  body.append(box);
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    const given = sel.map(x => x == null ? "□" : opt.cards[x]).join(",") + "=" + inp.value;
    if (sel.includes(null)) return api.fail("□ 안을 모두 채워요.", given);
    const p = sel.map(x => opt.cards[x]), v = mx1Val(fill(p));
    if (v !== m) return api.fail(`이 식의 계산 결과는 ${v}${mx1J(String(v), "이에요").slice(String(v).length)}. 더 ${opt.goal === "max" ? "크게" : "작게"} 만들 수 있어요. 곱하는 두 수를 생각해 봐요.`, given);
    const x = mx1Num(inp), g = x === v; mx1Paint(inp, g);
    if (!g) return api.fail("수 카드는 알맞게 넣었어요. 계산 순서에 맞게 계산해 써요.", given);
    api.done(given, opt.ok || "가장 작은 계산 결과를 찾았어요!");
  }));
}

/* ⑥ 관계있는 것끼리 선 잇기  opt:{left:["15+18−7",…], right:[19,26,18]} (값은 코드가 계산) */
function mx1Match(body, api, opt) {
  mx1Style();
  const L = opt.left.map(e => ({ e, s: mx1S(e), v: mx1Val(e) })), R = opt.right;
  const n = Math.max(L.length, R.length), H = n * 70 + 20;
  const svg = makeSvg(800, H); svg.classList.add("mx1svg"); svg.style.maxWidth = "820px";
  const link = L.map(() => null); let pick = null;
  const ly = i => 20 + i * 70 + 25 + (n - L.length) * 35, ry = j => 20 + j * 70 + 25 + (n - R.length) * 35;
  const draw = () => {
    svg.innerHTML = "";
    link.forEach((j, i) => { if (j != null) svg.append(svgEl("line", { x1: 452, y1: ly(i), x2: 598, y2: ry(j), stroke: "#E47A38", "stroke-width": 4, "stroke-linecap": "round" })); });
    L.forEach((l, i) => {
      const g = svgEl("g", { style: "cursor:pointer" });
      g.append(svgEl("rect", { x: 10, y: ly(i) - 25, width: 430, height: 50, rx: 10, fill: pick === i ? "#FFE3C2" : "#fff", stroke: "#2F6B57", "stroke-width": 2.5 }));
      g.append(txt(225, ly(i), l.s, 24));
      g.append(svgEl("circle", { cx: 448, cy: ly(i), r: 7, fill: "#2F6B57" }));
      g.addEventListener("click", () => { pick = i; draw(); });
      svg.append(g);
    });
    R.forEach((r, j) => {
      const g = svgEl("g", { style: "cursor:pointer" });
      g.append(svgEl("circle", { cx: 602, cy: ry(j), r: 7, fill: "#2F6B57" }));
      g.append(svgEl("rect", { x: 615, y: ry(j) - 25, width: 170, height: 50, rx: 10, fill: "#FFF4D6", stroke: "#E9C46A", "stroke-width": 2.5 }));
      g.append(txt(700, ry(j), String(r), 26));
      g.addEventListener("click", () => { if (pick == null) return api.hint("왼쪽 식을 먼저 눌러요."); link.forEach((x, i) => { if (x === j) link[i] = null; }); link[pick] = j; pick = null; draw(); });
      svg.append(g);
    });
  };
  draw();
  api.provide({ words: ["계산 순서"], answers: L.map(l => `${l.s} → ${l.v}`) });
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "왼쪽 식을 누르고, 계산 결과를 오른쪽에서 눌러 이어요"), svg));
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    const given = L.map((l, i) => `${l.s}→${link[i] == null ? "-" : R[link[i]]}`).join(" / ");
    const bad = L.findIndex((l, i) => link[i] == null || R[link[i]] !== l.v);
    if (bad >= 0) return api.fail(link[bad] == null ? "모든 식을 이어요." : `식 ${L[bad].s}의 계산 순서를 다시 살펴보고 계산해 봐요.`, given);
    api.done(given, opt.ok || "모두 알맞게 이었어요!");
  }));
}

/* ⑦ 두 활동을 차례로: mx1Chain(b, a, [(b,a)=>…, (b,a)=>…]) */
function mx1Chain(body, api, fns) {
  let n = 0; const msgs = [], ans = [];
  const next = () => {
    const part = h("div"); body.append(part);
    const last = n === fns.length - 1;
    const sub = Object.assign({}, api, {
      done: (a, m, lv) => {
        ans.push(a);
        if (last) return api.done(ans.join(" | "), m, lv);
        part.querySelectorAll(".actions").forEach(x => x.remove());
        api.hint("○ " + (m || "좋아요!") + " 이어서 아래 문제를 풀어요.");
        n++; next();
        setTimeout(() => { try { body.lastChild.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 50);
      }
    });
    fns[n](part, sub);
  };
  next();
}

/* ===== 그림 ===== */
/* 사람·물건 줄 그림: rows:[{label, n, color, cross:k(앞 k개 X), group:g(g개씩 묶음 테두리), shape:"p"|"c"|"r", note}] */
function mx1Pic(rows, opt = {}) {
  const per = opt.per || 16, S = 34, top = 8;
  let y = top; const parts = [];
  rows.forEach(r => {
    const lines = Math.ceil(r.n / per);
    parts.push({ r, y, lines }); y += 30 + lines * S + 8;
  });
  const W = 150 + per * S + 10, svg = makeSvg(W, y + 4); svg.classList.add("mx1svg"); svg.style.maxWidth = (W * 0.95) + "px";
  parts.forEach(({ r, y, lines }) => {
    svg.append(txt(8, y + 12, r.label, 20, { "text-anchor": "start", fill: "#2F6B57" }));
    if (r.note) svg.append(txt(W - 8, y + 12, r.note, 18, { "text-anchor": "end", fill: "#7A6B5F" }));
    for (let i = 0; i < r.n; i++) {
      const cx = 150 + (i % per) * S + S / 2, cy = y + 30 + Math.floor(i / per) * S + S / 2;
      const gray = r.cross && i < r.cross, col = gray ? "#D5D9D7" : r.color;
      if (r.shape === "r") svg.append(svgEl("rect", { x: cx - 12, y: cy - 12, width: 24, height: 24, rx: 4, fill: col, stroke: "#8A7F74", "stroke-width": 1.2 }));
      else if (r.shape === "c") svg.append(svgEl("circle", { cx, cy, r: 12, fill: col, stroke: "#8A7F74", "stroke-width": 1.2 }));
      else { svg.append(svgEl("circle", { cx, cy: cy - 7, r: 6.5, fill: col })); svg.append(svgEl("path", { d: `M${cx - 10} ${cy + 13} Q${cx} ${cy - 6} ${cx + 10} ${cy + 13} Z`, fill: col })); }
      if (gray) svg.append(svgEl("path", { d: `M${cx - 11} ${cy - 11} L${cx + 11} ${cy + 11} M${cx + 11} ${cy - 11} L${cx - 11} ${cy + 11}`, stroke: "#D9534F", "stroke-width": 2.5 }));
    }
    if (r.group) for (let gi = 0; gi < r.n / r.group; gi++) {
      const i0 = gi * r.group, i1 = i0 + r.group - 1;
      if (Math.floor(i0 / per) !== Math.floor(i1 / per)) continue;
      const x0 = 150 + (i0 % per) * S + 2, x1 = 150 + (i1 % per) * S + S - 2, yy = y + 30 + Math.floor(i0 / per) * S + 1;
      svg.append(svgEl("rect", { x: x0, y: yy, width: x1 - x0, height: S - 2, rx: 8, fill: "none", stroke: "#E47A38", "stroke-width": 2, "stroke-dasharray": "5 3" }));
    }
  });
  return svg;
}
/* 상자 칸 그림: c칸 × r줄 */
function mx1GridPic(c, r, label, col) {
  const S = 34, W = c * S + 20, H = r * S + 50, svg = makeSvg(W, H); svg.classList.add("mx1svg"); svg.style.maxWidth = (W * 1.1) + "px";
  svg.append(svgEl("rect", { x: 6, y: 6, width: c * S + 8, height: r * S + 8, rx: 8, fill: "#FFF4E8", stroke: "#B07A4B", "stroke-width": 3 }));
  for (let i = 0; i < c; i++) for (let j = 0; j < r; j++) svg.append(svgEl("circle", { cx: 10 + i * S + S / 2, cy: 10 + j * S + S / 2, r: 11, fill: col || "#E8505B" }));
  svg.append(txt(W / 2, r * S + 34, label, 18, { fill: "#7A6B5F" }));
  return svg;
}
/* 가격표·무게표 */
function mx1Tags(list) {
  return h("div", { class: "mx1flex" }, ...list.map(t => h("div", { class: "mx1item", style: "text-align:center;min-width:8em" }, h("b", {}, t[0]), h("div", {}, t[1]))));
}
/* 길 그림(학교–도서관–서점–공원) */
function mx1Road() {
  const X = d => 40 + d, svg = makeSvg(860, 230); svg.classList.add("mx1svg"); svg.style.maxWidth = "860px";
  svg.append(svgEl("line", { x1: X(0), y1: 120, x2: X(770), y2: 120, stroke: "#8A7F74", "stroke-width": 6, "stroke-linecap": "round" }));
  [[0, "학교"], [190, "도서관"], [390, "서점"], [770, "공원"]].forEach(([d, n]) => { svg.append(svgEl("circle", { cx: X(d), cy: 120, r: 9, fill: "#2F6B57" })); svg.append(txt(X(d), 145, n, 20)); });
  const br = (a, b, y, up, t) => { const d = up ? 1 : -1; svg.append(svgEl("path", { d: `M${X(a)} ${y + 12 * d} V${y} H${X(b)} V${y + 12 * d}`, fill: "none", stroke: "#E47A38", "stroke-width": 2.5 })); svg.append(txt((X(a) + X(b)) / 2, y - 12 * d, t, 20, { fill: "#C0571C" })); };
  br(0, 390, 85, true, "390 m"); br(190, 770, 185, false, "580 m"); br(0, 770, 35, true, "770 m");
  return svg;
}

/* ⑧ 역기 원판 끼우기  opt:{bar:20, plates:[{name,col,w,need}], ask:[…]} */
function mx1Barbell(body, api, opt) {
  mx1Style();
  const L = [], R = [];   // 원판 번호
  let sel = 0;
  const svg = makeSvg(900, 260); svg.classList.add("mx1svg"); svg.style.maxWidth = "900px";
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 40, y: 122, width: 820, height: 16, rx: 6, fill: "#9AA3A0" }));
    svg.append(txt(450, 168, `쇠막대 ${opt.bar} kg`, 20, { fill: "#5A6461" }));
    const pl = (side, arr) => arr.forEach((pi, k) => {
      const p = opt.plates[pi], hh = 70 + p.w * 3.2, x = side < 0 ? 230 - k * 30 : 646 + k * 30;
      svg.append(svgEl("rect", { x, y: 130 - hh / 2, width: 24, height: hh, rx: 5, fill: p.col, stroke: "#5A4A3F", "stroke-width": 1.5 }));
    });
    pl(-1, L); pl(1, R);
    [["왼쪽에 끼우기", 120, L], ["오른쪽에 끼우기", 780, R]].forEach(([t, x, arr]) => {
      const g = svgEl("g", { style: "cursor:pointer" });
      g.append(svgEl("rect", { x: x - 85, y: 214, width: 170, height: 38, rx: 10, fill: "#E3F1EA", stroke: "#2F6B57", "stroke-width": 2 }));
      g.append(txt(x, 233, t, 19));
      g.addEventListener("click", () => { if (arr.length >= 5) return api.hint("한쪽에 원판을 너무 많이 끼웠어요."); arr.push(sel); draw(); });
      svg.append(g);
    });
  };
  const tray = h("div", { class: "opts" });
  opt.plates.forEach((p, i) => tray.append(h("button", { class: "opt" + (i === 0 ? " on" : ""), onclick: e => { sel = i; [...tray.children].forEach(x => x.classList.remove("on")); e.currentTarget.classList.add("on"); } },
    h("span", { style: `display:inline-block;width:.9em;height:.9em;border-radius:.2em;background:${p.col};margin-right:.3em;vertical-align:-.1em` }), `${p.name} ${p.w} kg`)));
  draw();
  const rows = mx1AskRows(opt.ask);
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "원판을 고르고 ‘왼쪽에 끼우기’·‘오른쪽에 끼우기’를 눌러요"), tray, svg,
    h("button", { class: "ghost", onclick: () => { L.length = 0; R.length = 0; draw(); } }, "원판 모두 빼기")));
  rows.forEach(R0 => body.append(R0.row));
  api.provide({ words: ["곱셈", "덧셈"], answers: rows.map(R0 => `${R0.it.q} ${R0.it.a}`) });
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    const all = L.concat(R), cnt = opt.plates.map((_, i) => all.filter(x => x === i).length);
    const given = opt.plates.map((p, i) => `${p.name}${cnt[i]}`).join(",") + " / " + rows.map(R0 => R0.inp.value || "-").join(",");
    const bad = opt.plates.findIndex((p, i) => cnt[i] !== p.need);
    if (bad >= 0) return api.fail(`${opt.plates[bad].name}${mx1J(opt.plates[bad].name, "을를").slice(opt.plates[bad].name.length)} ${opt.plates[bad].need}개 끼워요. 지금은 ${cnt[bad]}개예요.`, given);
    const m = mx1AskCheck(rows); if (m) return api.fail(m, given);
    api.done(given, opt.ok);
  }));
}

/* ⑨ 생존 가방  opt:{fixed:{물건:개수}, limit:5000, ok} — 물건마다 하나의 식과 무게, 모두 몇 g */
const MX1_ITEMS = [
  { n: "휴지", c: 10, u: "개", w: 1000 }, { n: "물티슈", c: 20, u: "개", w: 1300 }, { n: "손전등", c: 2, u: "개", w: 1000 },
  { n: "라디오", c: 1, u: "개", w: 500 }, { n: "담요", c: 2, u: "개", w: 3000 }, { n: "호루라기", c: 1, u: "개", w: 20 },
  { n: "통조림", c: 10, u: "개", w: 5000 }, { n: "쿠키", c: 40, u: "개", w: 800 }, { n: "초콜릿", c: 5, u: "개", w: 1000 },
  { n: "우비", c: 1, u: "벌", w: 600 }, { n: "성냥개비", c: 10, u: "세트", w: 150 }, { n: "물", c: 6, u: "병", w: 9000 }];
const mx1ItemW = (it, k) => it.w / it.c * k;
function mx1ItemTable() {
  const t = h("table", { class: "mx1tbl" }, h("tr", {}, h("th", {}, "물건"), h("th", {}, "묶음"), h("th", {}, "무게")));
  MX1_ITEMS.forEach(it => t.append(h("tr", {}, h("td", {}, it.n), h("td", {}, it.c + it.u), h("td", {}, it.w + " g"))));
  return h("div", { style: "overflow-x:auto;max-width:100%" }, t);
}
function mx1Bag(body, api, opt = {}) {
  mx1Style();
  const cnt = {}; MX1_ITEMS.forEach(it => cnt[it.n] = (opt.fixed && opt.fixed[it.n]) || 0);
  const rowsBox = h("div"), totIn = mx1Input("모두 몇 g", true), ins = {};
  const grid = h("div", { class: "mx1bag" });
  let lastIn = null;
  const drawRows = () => {
    rowsBox.innerHTML = "";
    MX1_ITEMS.filter(it => cnt[it.n] > 0).forEach(it => {
      const k = cnt[it.n];
      if (!ins[it.n]) { ins[it.n] = { ex: h("input", { type: "text", class: "mx1ex", autocomplete: "off", "aria-label": it.n + " 무게 식", placeholder: "예: 150÷10×2" }), w: mx1Input(it.n + " 무게", true) }; ins[it.n].ex.addEventListener("focus", () => lastIn = ins[it.n].ex); }
      rowsBox.append(h("div", { class: "mx1ask" }, h("span", { style: "min-width:7.5em" }, `${it.n} ${k}${it.u}:`), ins[it.n].ex, h("span", {}, "="), ins[it.n].w, h("span", {}, "g")));
    });
    if (!rowsBox.children.length) rowsBox.append(h("p", { class: "mx1note" }, "위에서 넣을 물건의 개수를 정해요."));
  };
  if (!opt.fixed) MX1_ITEMS.forEach(it => {
    const num = h("span", { class: "jua" }, "0"), card = h("div", { class: "mx1item" });
    const set = d => { cnt[it.n] = Math.max(0, Math.min(it.c, cnt[it.n] + d)); num.textContent = cnt[it.n]; card.classList.toggle("on", cnt[it.n] > 0); drawRows(); };
    card.append(h("b", {}, it.n), h("div", {}, `${it.c}${it.u} ${it.w} g`), h("div", { class: "mx1cnt" }, h("button", { class: "ghost", "aria-label": it.n + " 빼기", onclick: () => set(-1) }, "−"), num, h("button", { class: "ghost", "aria-label": it.n + " 더하기", onclick: () => set(1) }, "+"), h("span", {}, it.u)));
    grid.append(card);
  });
  drawRows();
  const keys = h("div", { class: "mx1keys" }, ...["×", "÷", "+", "−", "(", ")"].map(s => h("button", { class: "mx1sym", onmousedown: e => e.preventDefault(), onclick: () => { if (!lastIn) return api.hint("먼저 식 칸을 눌러요."); lastIn.value += s; lastIn.focus(); } }, s)));
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "생존 물건 목록"), mx1ItemTable()));
  if (!opt.fixed) body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "넣을 물건의 개수를 + − 로 정해요"), grid));
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "물건마다 무게를 하나의 식으로 나타내고 구해요"), rowsBox, h("div", { class: "mx1note" }, "기호 단추는 식 칸에 써져요(키보드의 * / 도 돼요)."), keys,
    h("div", { class: "mx1ask" }, h("span", {}, "가방에 넣은 물건의 무게는 모두"), totIn, h("span", {}, "g"))));
  const ans = () => MX1_ITEMS.filter(it => cnt[it.n] > 0).map(it => `${it.n} ${cnt[it.n]}${it.u}: ${it.w}${it.c > 1 ? " ÷ " + it.c : ""}${cnt[it.n] > 1 ? " × " + cnt[it.n] : ""} = ${mx1ItemW(it, cnt[it.n])}`);
  api.provide({ words: ["물건 1개의 무게", "묶음의 무게 ÷ 묶음의 개수"], answers: opt.fixed ? ans().concat([`모두 ${MX1_ITEMS.reduce((s, it) => s + mx1ItemW(it, cnt[it.n]), 0)} g`]) : [] });
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    const chosen = MX1_ITEMS.filter(it => cnt[it.n] > 0);
    const given = chosen.map(it => `${it.n}${cnt[it.n]}:${ins[it.n].ex.value}=${ins[it.n].w.value}`).join(" / ") + ` / 모두 ${totIn.value}`;
    if (!chosen.length) return api.fail("생존 가방에 넣을 물건을 골라요.", given);
    let sum = 0;
    for (const it of chosen) {
      const k = cnt[it.n], want = mx1ItemW(it, k), I = ins[it.n]; sum += want;
      const tk = mx1Tok(I.ex.value), r = tk ? mx1Eval(tk) : { ok: false, err: "식에 쓸 수 없는 글자가 있어요." };
      const simple = it.c === 1 && k === 1;
      if (!r.ok) { mx1Paint(I.ex, false); return api.fail(`${it.n}: ${r.err}`, given); }
      if (r.int !== want) { mx1Paint(I.ex, false); return api.fail(`${it.n} ${k}${it.u}의 무게 식을 다시 살펴봐요. 먼저 ${it.n} 1${it.u}의 무게를 ${it.w} ÷ ${it.c}${mx1J(String(it.c), "으로").slice(String(it.c).length)} 구할 수 있어요.`, given); }
      if (!simple && !tk.some(t => t.t === "n" && t.v === it.w)) { mx1Paint(I.ex, false); return api.fail(`${it.n} 묶음의 무게 ${it.w} g을 사용한 하나의 식으로 나타내요.`, given); }
      mx1Paint(I.ex, true);
      const v = mx1Num(I.w), g = v === want; mx1Paint(I.w, g);
      if (!g) return api.fail(`${it.n}의 식은 맞아요. 식을 계산한 무게를 써요.`, given);
    }
    const t = mx1Num(totIn), g = t === sum; mx1Paint(totIn, g);
    if (!g) return api.fail("물건들의 무게를 모두 더해 봐요.", given);
    if (opt.limit && sum > opt.limit) return api.fail(`모두 ${sum} g이라 ${opt.limit} g보다 무거워요. 물건을 빼거나 가벼운 물건으로 바꿔 봐요.`, given);
    api.done(given, opt.ok ? opt.ok.replace("{sum}", sum) : `모두 ${sum} g이에요. ${opt.limit || 5000} g보다 가벼워서 알맞아요!`);
  }));
}

/* ⑩ 문장 순서를 정하여 문제 만들기(5차시)  opt:{first:{t,f}, cards:[{k,t,f(값)→값|null}], nums:[24,8,4,12], unit} */
function mx1Story(body, api, opt) {
  mx1Style();
  const order = [];
  const list = h("div", { class: "mx1sent" }), show = h("div", { class: "mx1box" }), work = h("div");
  const calc = () => { let v = opt.start; for (const i of order) { v = opt.cards[i].f(v); if (v == null) return null; } return v; };
  const draw = () => {
    list.innerHTML = "";
    opt.cards.forEach((c, i) => list.append(h("button", { class: "opt" + (order.includes(i) ? " on" : ""), disabled: order.includes(i), onclick: () => { order.push(i); draw(); } }, `${c.k} ${c.t}`)));
    show.innerHTML = "";
    show.append(h("div", { class: "mx1lab" }, "내가 만든 문제"), h("p", {}, [opt.first.t].concat(order.map(i => opt.cards[i].t)).join(" ") + (order.length === opt.cards.length ? " " + opt.ask : "")),
      h("div", { class: "mx1note" }, "순서: " + [opt.first.k].concat(order.map(i => opt.cards[i].k)).join(" → ")));
    work.innerHTML = "";
    if (order.length === opt.cards.length) {
      const v = calc();
      if (v == null) { work.append(h("p", { class: "fb bad" }, "이 순서로는 문제가 되지 않아요. 가진 색종이보다 많이 줄 수 없거나 똑같이 나누어지지 않아요. ‘다시 정하기’를 눌러 다른 순서로 해 봐요.")); return; }
      B = mx1Builder({ cards: opt.nums });
      ansIn = mx1Input("답", true);
      work.append(h("div", { class: "jua" }, "이 문제를 하나의 식으로 나타내요."), B.el, h("div", { class: "mx1ask" }, h("span", {}, "답 "), ansIn, h("span", {}, opt.unit)));
      target = v;
    }
  };
  let B = null, ansIn = null, target = null;
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, `${opt.first.k} ${opt.first.t} 다음에 올 문장을 차례로 눌러요`), list, h("button", { class: "ghost", onclick: () => { order.length = 0; B = null; draw(); } }, "다시 정하기")), show, work);
  draw();
  api.provide({ words: ["문장의 순서", "( )"], answers: ["㉠ → ㉣ → ㉢ → ㉡: (24 − 12) ÷ 4 + 8 = 11, 11장"] });
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    if (order.length < opt.cards.length) return api.fail("문장을 모두 골라 문제를 만들어요.", order.join(","));
    if (target == null) return api.fail("문제가 되는 다른 순서로 바꿔 봐요.", order.join(","));
    const given = order.map(i => opt.cards[i].k).join("") + " / " + mx1Str(B.toks()) + " / " + ansIn.value;
    const m = mx1Judge(B.toks(), { cards: opt.nums, target }); if (m) return api.fail(m, given);
    const v = mx1Num(ansIn), g = v === target; mx1Paint(ansIn, g);
    if (!g) return api.fail("식은 맞아요. 식을 계산한 값을 답에 써요.", given);
    api.done(given, `문제를 만들고 하나의 식으로 나타내어 ${target}${opt.unit}을 구했어요. 순서가 달라지면 문제와 답도 달라져요!`);
  }));
}

/* ⑪ 조건을 골라 문제 만들기(6차시 지훈이의 거스름돈) */
function mx1Shop(body, api, opt) {
  mx1Style();
  const pick = [null, null];
  const tags = mx1Tags(opt.tags);
  const rows = opt.groups.map((g, gi) => {
    const r = h("div", { class: "opts" });
    g.forEach((o, oi) => r.append(h("button", { class: "opt", onclick: e => { pick[gi] = oi; [...r.children].forEach(x => x.classList.remove("on")); e.currentTarget.classList.add("on"); draw(); } }, o.n)));
    return r;
  });
  const sent = h("p", { class: "sent" }), work = h("div");
  let B = null, ansIn = null, target = null;
  const draw = () => {
    const a = pick[0] != null ? opt.groups[0][pick[0]].n : "( 방울토마토 , 체리 )", b = pick[1] != null ? opt.groups[1][pick[1]].n : "( 과자 , 초콜릿 )";
    sent.textContent = `지훈이는 ${a} 100 g과 ${b} 2개를 사고 10000원을 냈습니다. 지훈이가 받아야 하는 거스름돈은 얼마인지 하나의 식으로 나타내어 구해 보세요.`;
    work.innerHTML = "";
    if (pick.includes(null)) return;
    const A = opt.groups[0][pick[0]], C = opt.groups[1][pick[1]];
    target = 10000 - (A.p + C.p / 3 * 2);
    B = mx1Builder({ cards: [10000, A.p, C.p, 3, 2] });
    ansIn = mx1Input("거스름돈", true);
    work.append(h("div", { class: "jua" }, "수 카드와 기호로 하나의 식을 만들어요."), B.el, h("div", { class: "mx1ask" }, h("span", {}, "거스름돈 "), ansIn, h("span", {}, "원")));
  };
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "가격표"), tags), h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "조건을 골라요"), ...rows, sent), work);
  draw();
  api.provide({ words: ["거스름돈", "( )"], answers: ["방울토마토와 과자: 10000 − (1500 + 4200 ÷ 3 × 2) = 5700, 5700원"] });
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    if (pick.includes(null)) return api.fail("두 가지 조건을 모두 골라요.", "-");
    const given = `${opt.groups[0][pick[0]].n}+${opt.groups[1][pick[1]].n} / ${mx1Str(B.toks())} / ${ansIn.value}`;
    const m = mx1Judge(B.toks(), { cards: [10000, opt.groups[0][pick[0]].p, opt.groups[1][pick[1]].p, 3, 2], target }); if (m) return api.fail(m, given);
    const v = mx1Num(ansIn), g = v === target; mx1Paint(ansIn, g);
    if (!g) return api.fail("식은 맞아요. 식을 계산한 값을 답에 써요.", given);
    api.done(given, `거스름돈은 ${target}원이에요. 조건을 바꾸어 다른 문제도 만들어 봐요!`);
  }));
}

/* ⑫ 빙고 놀이판 만들기·놀이 */
const MX1_EX_BOARD = [9, 15, 5, 1, 12, 23, 4, 20, 21, 8, 22, 11, 3, 17, 16, 25];
let MX1_BOARD = null;
function mx1LoadBoard() {
  if (MX1_BOARD) return MX1_BOARD;
  try { const b = JSON.parse(localStorage.getItem("t51-mixcalc-board") || "null"); if (Array.isArray(b) && b.length === 16) MX1_BOARD = b; } catch (e) { }
  return MX1_BOARD;
}
function mx1BoardMake(body, api) {
  mx1Style();
  const cells = Array(16).fill(null);
  const grid = h("div", { class: "mx1grid" }), pal = h("div", { class: "mx1pal" });
  const draw = () => {
    grid.innerHTML = ""; pal.innerHTML = "";
    cells.forEach((v, i) => grid.append(h("button", { "aria-label": "놀이판 칸", onclick: () => { cells[i] = null; draw(); } }, v == null ? "" : String(v))));
    for (let n = 1; n <= 25; n++) pal.append(h("button", { disabled: cells.includes(n), onclick: () => { const j = cells.indexOf(null); if (j < 0) return api.hint("놀이판이 다 찼어요. 바꾸려면 칸을 눌러 비워요."); cells[j] = n; draw(); } }, String(n)));
  };
  draw();
  body.append(h("div", { class: "mx1flex" },
    h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "1부터 25까지의 수"), pal),
    h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "내 놀이판(칸을 누르면 비워져요)"), grid,
      h("button", { class: "ghost", onclick: () => { const r = []; for (let n = 1; n <= 25; n++) r.push(n); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } r.slice(0, 16).forEach((v, i) => cells[i] = v); draw(); } }, "아무렇게나 채우기"))));
  api.provide({ words: ["1부터 25까지", "16개", "한 번씩"], answers: [] });
  body.append(mx1Act("확인하기", () => {
    api.tryOnce();
    if (cells.includes(null)) return api.fail("놀이판 16칸을 모두 채워요.", cells.join(","));
    MX1_BOARD = cells.slice();
    try { localStorage.setItem("t51-mixcalc-board", JSON.stringify(MX1_BOARD)); } catch (e) { }
    api.done(cells.join(","), "놀이판을 완성했어요! 다음 계단에서 이 놀이판으로 빙고 놀이를 해요.");
  }));
}
function mx1Lines(hit) {
  const L = [];
  for (let r = 0; r < 4; r++) L.push([0, 1, 2, 3].map(c => r * 4 + c));
  for (let c = 0; c < 4; c++) L.push([0, 1, 2, 3].map(r => r * 4 + c));
  L.push([0, 5, 10, 15], [3, 6, 9, 12]);
  return L.filter(l => l.every(i => hit[i]));
}
/* opt:{goal:줄 수, cards:[처음 카드](없으면 무작위), ok} */
function mx1Bingo(body, api, opt) {
  mx1Style();
  const board = (mx1LoadBoard() || MX1_EX_BOARD).slice(), hit = Array(16).fill(false);
  let cards = opt.cards ? opt.cards.slice() : null;
  const draw3 = () => [0, 0, 0].map(() => 1 + Math.floor(Math.random() * 9));
  if (!cards) cards = draw3();
  const grid = h("div", { class: "mx1grid" }), cardRow = h("div", { class: "mx1big" }), info = h("div", { class: "mx1live" }), bwrap = h("div");
  const log = h("div", { class: "mx1note" });
  let B;
  const drawBoard = () => {
    const lines = mx1Lines(hit), onLine = new Set(lines.flat());
    grid.innerHTML = "";
    board.forEach((v, i) => grid.append(h("button", { class: hit[i] ? (onLine.has(i) ? "mx1line" : "mx1hit") : "", disabled: true, style: "opacity:1;cursor:default" }, String(v))));
    info.textContent = `색칠한 줄: ${lines.length}줄 / ${opt.goal}줄`;
  };
  const newCards = c => { cards = c || draw3(); cardRow.textContent = "뒤집은 수 카드: " + cards.join("  "); bwrap.innerHTML = ""; B = mx1Builder({ cards, reuse: true }); bwrap.append(B.el); };
  newCards(cards);
  drawBoard();
  body.append(h("div", { class: "mx1flex" },
    h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, mx1LoadBoard() ? "내 놀이판" : "놀이판(교과서 예시)"), grid, info),
    h("div", { class: "mx1box", style: "flex:1 1 18em" }, cardRow, h("div", { class: "mx1note" }, "카드를 모두 사용해요(같은 수를 여러 번 써도 돼요). +, −, ×, ÷ 중 서로 다른 2가지 이상을 쓰고, 필요하면 ( )도 써요."), bwrap,
      h("button", { class: "ghost", onclick: () => { newCards(); api.hint("수 카드를 다시 섞어 3장을 뒤집었어요."); } }, "카드 다시 뽑기"), log)));
  api.provide({ words: ["계산 순서", "서로 다른 2가지 기호"], answers: [] });
  body.append(mx1Act("식 확인하기", () => {
    api.tryOnce();
    const tk = B.toks(), s = mx1Str(tk) || "-";
    const r = mx1Eval(tk);
    if (!r.ok) return api.fail(r.err, s);
    const used = tk.filter(t => t.t === "n").map(t => t.v);
    const need = {}; cards.forEach(c => need[c] = (need[c] || 0) + 1);
    if (Object.keys(need).some(c => used.filter(u => u === +c).length < need[c])) return api.fail("뒤집은 수 카드를 모두 사용해요.", s);
    if (used.some(u => !cards.includes(u))) return api.fail("뒤집은 수 카드에 있는 수만 써요.", s);
    const kinds = new Set(tk.filter(t => t.t === "o").map(t => t.v));
    if (kinds.size < 2) return api.fail("+, −, ×, ÷ 중에서 서로 다른 2가지를 사용해야 해요.", s);
    if (r.neg || r.frac || r.int == null) return api.fail("계산 중에 작은 수에서 큰 수를 빼거나 나누어떨어지지 않는 곳이 있어요.", s);
    const i = board.findIndex((v, k) => v === r.int && !hit[k]);
    if (i < 0) { api.hint(board.includes(r.int) ? `${s} = ${r.int}. 이미 색칠한 수예요. 다른 식을 만들어 봐요.` : `${s} = ${r.int}. 놀이판에 ${r.int}${mx1J(String(r.int), "이가").slice(String(r.int).length)} 없어요. 다른 식을 만들거나 카드를 다시 뽑아요.`); return; }
    hit[i] = true; drawBoard();
    log.prepend(h("div", {}, `${s} = ${r.int} 색칠!`));
    const n = mx1Lines(hit).length;
    if (n >= opt.goal) return api.done(`${n}줄 빙고`, opt.ok || "빙고! 계산 순서에 맞게 정확히 계산했어요!");
    api.hint(`○ ${s} = ${r.int}. ${r.int}${mx1J(String(r.int), "을를").slice(String(r.int).length)} 색칠했어요. 다음 카드로 계속해요.`);
    newCards();
  }));
}

/* ⑬ 주사위로 혼합 계산식 여러 개 만들기  opt:{need:3} */
function mx1Dice(body, api, opt = {}) {
  mx1Style();
  const need = opt.need || 3;
  let dice = [0, 0, 0].map(() => 1 + Math.floor(Math.random() * 6));
  const made = [];
  const svg = makeSvg(330, 110); svg.classList.add("mx1svg"); svg.style.maxWidth = "330px";
  const pip = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  const drawDice = () => { svg.innerHTML = ""; dice.forEach((d, i) => { const cx = 55 + i * 110; svg.append(svgEl("rect", { x: cx - 42, y: 13, width: 84, height: 84, rx: 14, fill: "#fff", stroke: "#1D2A2A", "stroke-width": 3 })); pip[d].forEach(([a, b]) => svg.append(svgEl("circle", { cx: cx + a * 22, cy: 55 + b * 22, r: 8, fill: "#1D2A2A" }))); }); };
  drawDice();
  const bw = h("div"); let B = null;
  const list = h("div");
  const valIn = mx1Input("계산 결과");
  const newB = () => { bw.innerHTML = ""; B = mx1Builder({ cards: dice }); bw.append(B.el); };
  newB();
  const drawList = () => { list.innerHTML = ""; made.forEach((m, i) => list.append(h("div", { class: "mx1done" }, `${i + 1}) ${m}`))); };
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "주사위를 3번 던져 나온 수"), svg,
    h("button", { class: "ghost", onclick: () => { if (made.length) return api.hint("이미 식을 만들기 시작했어요. 이 수로 끝까지 만들어 봐요."); dice = [0, 0, 0].map(() => 1 + Math.floor(Math.random() * 6)); drawDice(); newB(); } }, "다시 던지기")),
    h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, `나온 수를 한 번씩 모두 쓰고 +, −, ×, ÷, ( ) 중에서 3가지를 사용하여 식을 만들어요 (${need}개)`), bw,
      h("div", { class: "mx1ask" }, h("span", {}, "계산 결과"), valIn), list));
  api.provide({ words: ["3가지", "( )"], answers: [] });
  body.append(mx1Act("식 확인하기", () => {
    api.tryOnce();
    const tk = B.toks(), s = mx1Str(tk) || "-";
    const m = mx1Judge(tk, { cards: dice }); if (m) return api.fail(m, s);
    const kinds = new Set(tk.filter(t => t.t !== "n").map(t => t.t === "o" ? t.v : "()"));
    if (kinds.size < 3) return api.fail("+, −, ×, ÷, ( ) 중에서 3가지를 사용해요. ( )도 한 가지로 세어요.", s);
    if (made.some(x => x.startsWith(s + " ="))) return api.fail("이미 만든 식이에요. 다른 식을 만들어 봐요.", s);
    const v = mx1Val(tk), x = mx1Num(valIn), g = x === v; mx1Paint(valIn, g);
    if (!g) return api.fail("식은 알맞게 만들었어요. 계산 순서에 맞게 다시 계산해 봐요.", s + "=" + valIn.value);
    made.push(`${s} = ${v}`); drawList(); B.reset(); valIn.value = ""; valIn.style.borderColor = "";
    if (made.length >= need) return api.done(made.join(" / "), `혼합 계산식을 ${need}개 만들고 옳게 계산했어요!`);
    api.hint(`○ 맞아요. 다른 식을 ${need - made.length}개 더 만들어요.`);
  }));
}
//@@LESSONS
const UNIT_STORY = { title: "학급 임원 서아의 자치회 활동", lines: [
  "서아는 이번 학기에 처음으로 학급 임원 선거에 나가 학급 임원이 되었어요. 학급 임원이 되면 자치회에 참여하여 한 학기 동안 다양한 활동을 해요.",
  "선거, 자치회 회의, 안전 안내 자료 사진 촬영, 대여함 줄넘기, 텃밭 상자 모종 심기까지 자치회 활동을 살펴보며 덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식을 계산하는 순서를 알아봐요.",
  "교과서 「수학 5-1」 1. 자연수의 혼합 계산의 차시 순서 그대로 만들었어요."],
  one: "학급 임원 서아와 자치회 활동 · 계산하는 순서를 알고 혼합 계산을 해요." };
const UNIT_KEYWORDS = ["혼합 계산", "계산 순서", "앞에서부터 차례대로", "( ) 안을 먼저", "( ) 안을 가장 먼저", "곱셈을 먼저", "나눗셈을 먼저", "곱셈과 나눗셈을 먼저", "하나의 식", "괄호", "계산 결과 비교", "자치회", "생존 가방", "빙고"];

/* ===== 1. 자연수의 혼합 계산 — 교과서 차시 버전 (9차시) ===== */
const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 학급 임원 서아의 자치회 활동", soop: "개념 찾기(S)",
  question: "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "우리 주변에는 덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 상황이 많아요. 같은 수와 기호라도 계산하는 순서에 따라 결과가 달라질 수 있어서, 이 단원에서 계산 순서를 배워요.",
  steps: [
    { name: "역기 무게 구하기", inst: "역기는 쇠막대 양쪽에 원판을 끼워서 드는 운동 기구예요. 20 kg짜리 쇠막대에 25 kg짜리 빨간색 원판 4개와 10 kg짜리 초록색 원판 2개를 끼워서 들었다면 모두 몇 kg을 든 걸까요? 원판을 직접 끼워 보세요.", hints: ["빨간색 원판 4개, 초록색 원판 2개를 양쪽에 나누어 끼워요.", "빨간색 원판 4개는 25 × 4, 초록색 원판 2개는 10 × 2예요.", "쇠막대 20 kg도 잊지 말고 더해요."],
      render: (b, a) => mx1Barbell(b, a, { bar: 20, plates: [{ name: "빨간색 원판", col: "#E8505B", w: 25, need: 4 }, { name: "초록색 원판", col: "#5DB36A", w: 10, need: 2 }],
        ask: [{ q: "빨간색 원판 4개의 무게 25 × 4 =", a: 100, unit: "kg" }, { q: "초록색 원판 2개의 무게 10 × 2 =", a: 20, unit: "kg" },
          { q: "쇠막대와 원판을 모두 더하면 몇 kg인가요?", a: 140, unit: "kg", why: { "120": "쇠막대 20 kg을 더하는 것을 잊었어요.", "380": "20 + 25를 먼저 더한 다음 4를 곱하면 쇠막대 무게까지 4번 세게 돼요. 원판의 무게를 먼저 구해요." } }],
        ok: "20 + 25 × 4 + 10 × 2 = 20 + 100 + 20 = 140, 모두 140 kg을 들었어요. 이렇게 여러 가지 계산이 섞인 식을 이 단원에서 배워요." }) },
    { name: "자치회 활동 살펴보기", inst: "서아는 학급 임원이 되어 자치회 회의에 참석했어요. 자치회에서 어떤 활동을 하는지 살펴보세요.", hints: ["자치회는 학교생활을 자치적으로 운영하기 위하여 학생들이 만든 학교 안의 조직이에요.", "그림에는 줄넘기 빌리기, 임원 회의, 급식실 사진 촬영, 텃밭 상자 모종 심기가 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "자치회는 무엇인가요?", o: ["학교생활을 자치적으로 운영하기 위하여 학생들이 만든 학교 안의 조직", "선생님들만 모여서 회의하는 곳", "학교 밖에서 운동하는 모임"], a: 0 },
        { q: "서아네 자치회 그림에서 볼 수 없는 활동은?", o: ["운동장 대여함에서 줄넘기 빌리기", "급식실과 특별실에서 사진 촬영하기", "텃밭 상자에 모종 심기", "수영장에서 수영 대회 열기"], a: 3 },
        { q: "‘텃밭 상자 6개에 고추 모종을 3개씩 2줄로 심었어요.’ 한 상자의 고추 모종 수를 구하는 데 쓰는 셈은?", o: ["덧셈", "뺄셈", "곱셈", "나눗셈"], a: 2 }]) },
    { inst: "자치회 활동에 참여했던 경험과 생활 속에서 여러 가지 계산이 섞여 있는 상황을 떠올려 써 보세요.", hints: ["1학년 입학 축하 행사, 어린이날 행사, 학교 화단에 꽃 심기 같은 활동을 떠올려 봐요.", "게임에서 점수를 더하고 빼고 곱하는 상황도 좋아요."],
      render: (b, a) => writeStep(b, a, [
        { q: "자치회 활동에 참여했던 경험을 써요.", tag: "경험", ph: "예: 어린이날 행사를 준비하며 반마다 풍선을 나누었어요." },
        { q: "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 생활 속 상황을 써요.", tag: "상황", ph: "예: 게임에서 점수를 2배로 받고 벌점을 뺐어요." },
        { q: "이 단원에서 무엇이 궁금한가요?", tag: "궁금", ph: "예: 곱셈과 덧셈이 섞여 있으면 무엇을 먼저 계산할까?" }]) },
    { name: "배울 내용 살펴보기", inst: "역기 무게를 구하는 식 20 + 25 × 4 + 10 × 2를 서로 다른 순서로 계산해 보세요. 결과가 같을까요?", hints: ["앞에서부터 차례대로: 20 + 25 = 45, 45 × 4 = 180, 180 + 10 = 190, 190 × 2 = 380", "역기 무게는 원판 무게(곱셈)를 먼저 구해서 더해요."],
      render: (b, a) => mx1Chain(b, a, [
        (b2, a2) => numbers(b2, a2, [
          { q: "앞에서부터 차례대로 계산하면 20 + 25 × 4 + 10 × 2 =", a: 380 },
          { q: "곱셈을 먼저 계산하면 20 + 25 × 4 + 10 × 2 =", a: 140, why: { "380": "곱셈 25 × 4와 10 × 2를 먼저 계산해 봐요." } }], { ok: "계산하는 순서에 따라 380과 140으로 결과가 달라요." }),
        (b2, a2) => blanks(b2, a2, ["역기의 실제 무게는 ", { o: ["140 kg", "380 kg"], a: 0 }, "이에요. 같은 식이라도 계산하는 ", { o: ["순서", "글씨"], a: 0 }, "에 따라 결과가 달라질 수 있으므로, 혼합 계산의 계산 순서를 알아야 해요."])]) },
    { name: "배운 내용 떠올리기", inst: "3학년과 4학년 때 배운 덧셈, 뺄셈, 곱셈, 나눗셈을 떠올려 계산해 보세요.", hints: ["세 자리 수의 덧셈과 뺄셈은 같은 자리끼리 계산해요.", "756 ÷ 28은 28 × 27 = 756인지 생각해 봐요."],
      render: (b, a) => numbers(b, a, [{ q: "458 + 376 =", a: 834 }, { q: "703 − 258 =", a: 445, why: { "555": "받아내림을 다시 살펴봐요." } }, { q: "245 × 36 =", a: 8820 }, { q: "756 ÷ 28 =", a: 27 }],
        { ok: "배운 계산을 잘 기억하고 있어요. 이제 이 계산들이 섞여 있는 식을 배워요." }) }
  ],
  challenge: { inst: "20 kg짜리 쇠막대에 25 kg짜리 빨간색 원판 2개와 10 kg짜리 초록색 원판 4개를 끼웠어요. 모두 몇 kg인지 하나의 식으로 나타내어 구해 보세요.", hints: ["빨간색 원판 2개는 25 × 2, 초록색 원판 4개는 10 × 4예요.", "쇠막대 무게에 두 곱을 더해요."],
    render: (b, a) => mx1Build(b, a, { cards: [20, 25, 2, 10, 4], target: 110, ansQ: "모두", unit: "kg", ex: "20+25×2+10×4",
      ok: "20 + 25 × 2 + 10 × 4 = 20 + 50 + 40 = 110, 모두 110 kg이에요. 곱셈을 먼저 계산했어요!" }) }
},
{
  id: "t2", no: 2, title: "덧셈과 뺄셈이 섞여 있는 식을 계산해 볼까요", soop: "개념 구축하기(O)",
  question: "덧셈과 뺄셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "덧셈과 뺄셈이 섞여 있는 식은 앞에서부터 차례대로 계산해요. ( )가 있는 식은 ( ) 안을 먼저 계산해요. 42 − 17 + 8 = 33이지만 42 − (17 + 8) = 17이에요.",
  steps: [
    { name: "선거에 참여한 학생 수", inst: "학급 임원 선거를 하는 날에 서아네 반 여학생은 14명 중에서 2명이 결석했고 남학생은 10명 모두 출석했어요. 출석한 학생이 모두 선거에 참여했다면 선거에 참여한 학생은 모두 몇 명일까요?", hints: ["여학생 수에서 결석한 여학생 수를 빼고, 남학생 수를 더해요.", "14 − 2 + 10처럼 하나의 식으로 나타내요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "여학생 14명", n: 14, color: "#F3A6B5", cross: 2, note: "2명 결석" }, { label: "남학생 10명", n: 10, color: "#8DB8E8", note: "모두 출석" }]),
        ask: [{ q: "선거에 참여한 여학생은 몇 명인가요? 14 − 2 =", a: 12, unit: "명" }], cards: [14, 2, 10], target: 22, ex: "14−2+10", ansQ: "선거에 참여한 학생은 모두", unit: "명",
        why: { "2": "14 − (2 + 10)은 결석한 2명과 남학생 10명을 함께 뺀 셈이에요. 남학생 수는 더해야 해요." },
        ok: "14 − 2 + 10 = 12 + 10 = 22, 22명이에요. 여학생 수를 먼저 구하고 남학생 수를 더하므로 앞에서부터 차례대로 계산했어요." }) },
    { name: "( )가 있는 식으로 나타내기", inst: "미술관 1층에 35개의 작품이 전시되어 있었어요. 1층에 전시되어 있던 작품을 2층으로 12개, 3층으로 14개 옮겼다면 1층에 남아 있는 작품은 몇 개일까요? 옮긴 작품 수를 ( )로 묶어 하나의 식으로 나타내 보세요.", hints: ["2층과 3층으로 옮긴 작품 수를 먼저 구해요.", "35 − (12 + 14)처럼 옮긴 작품 수를 ( )로 묶어 빼요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "1층 작품 35개", n: 35, color: "#F6C9A6", shape: "r" }, { label: "2층으로", n: 12, color: "#BFDDF5", shape: "r", note: "12개" }, { label: "3층으로", n: 14, color: "#CDE8C4", shape: "r", note: "14개" }], { per: 18 }),
        ask: [{ q: "2층과 3층으로 옮긴 작품은 모두 몇 개인가요? 12 + 14 =", a: 26, unit: "개" }], cards: [35, 12, 14], paren: true, target: 9, ex: "35−(12+14)", ansQ: "1층에 남아 있는 작품은", unit: "개",
        why: { "37": "35 − 12 + 14는 12개를 빼고 14개를 더하는 셈이에요. 옮긴 작품 수 12 + 14를 ( )로 묶어 한꺼번에 빼요." },
        ok: "35 − (12 + 14) = 35 − 26 = 9, 9개예요. 옮긴 작품 수를 먼저 구해야 하므로 ( ) 안을 먼저 계산했어요." }) },
    { name: "두 식 비교하기", inst: "두 식의 계산 순서를 각각 나타내어 계산하고, 계산 결과를 비교해 보세요. 먼저 계산할 기호를 누르고 그 값을 써요.", hints: ["가는 앞에서부터 차례대로 42 − 17을 먼저 계산해요.", "나는 ( ) 안의 17 + 8을 먼저 계산해요."],
      render: (b, a) => mx1Order(b, a, [{ e: "42−17+8", label: "가" }, { e: "42−(17+8)", label: "나" }], { cmp: true, ok: "( )가 없을 때에는 33, 있을 때에는 17로 계산 결과가 달라요. ( )가 있으면 계산 순서가 달라져요." }) },
    { inst: "덧셈과 뺄셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["선거에 참여한 학생 수는 앞에서부터 차례대로 계산했어요.", "미술관 작품 수는 ( ) 안을 먼저 계산했어요."],
      render: (b, a) => blanks(b, a, ["덧셈과 뺄셈이 섞여 있는 식은 ", { o: ["앞에서부터 차례대로", "덧셈을 먼저", "뒤에서부터 차례대로"], a: 0 }, " 계산합니다. 덧셈과 뺄셈이 섞여 있고 ( )가 있는 식은 ", { o: ["( ) 안", "( ) 밖"], a: 0 }, "을 먼저 계산합니다."]) },
    { inst: "먼저 계산해야 하는 부분을 찾고, 문제를 풀어 보세요.", hints: ["( )가 없으면 앞에서부터, ( )가 있으면 ( ) 안부터 계산해요.", "사용한 색종이 수 2 + 4를 ( )로 묶어 빼요."],
      render: (b, a) => mx1Chain(b, a, [
        (b2, a2) => mx1Order(b2, a2, [{ e: "43−14+5", first: true }, { e: "43−(14+5)", first: true }], { ok: "먼저 계산할 부분을 잘 찾았어요." }),
        (b2, a2) => mx1Build(b2, a2, { ask: [{ q: "19 + 15 − 23 =", a: 11 }, { q: "72 − (16 + 29) =", a: 27, why: { "85": "( ) 안 16 + 29를 먼저 계산해요." } }],
          prompt: "예준이는 색종이 15장을 가지고 있었어요. 그중에서 나무를 접는 데 2장, 꽃을 접는 데 4장을 사용하였다면 남은 색종이는 몇 장인지 ( )가 있는 하나의 식으로 나타내요.",
          cards: [15, 2, 4], paren: true, target: 9, ex: "15−(2+4)", ansQ: "남은 색종이는", unit: "장", why: { "17": "15 − 2 + 4는 사용한 4장을 더한 셈이에요. 사용한 색종이 수를 ( )로 묶어 빼요." },
          ok: "15 − (2 + 4) = 15 − 6 = 9, 남은 색종이는 9장이에요." })]) }
  ],
  challenge: { inst: "식과 계산 결과를 이어 보고, 그림을 보고 도서관에서 서점까지의 거리를 하나의 식으로 나타내어 구해 보세요.", hints: ["학교~서점 390 m와 도서관~공원 580 m를 더하면 도서관~서점 부분이 두 번 들어가요.", "두 거리의 합에서 학교~공원 770 m를 빼요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => mx1Match(b2, a2, { left: ["15+18−7", "40−(19+2)", "23+11−16"], right: [19, 26, 18] }),
      (b2, a2) => mx1Build(b2, a2, { pic: mx1Road, cards: [770, 390, 580], target: 200, ex: "390+580−770", ansQ: "도서관에서 서점까지의 거리는", unit: "m",
        ok: "390 + 580 − 770 = 970 − 770 = 200, 200 m예요. 겹친 부분을 찾아 덧셈과 뺄셈이 섞인 식으로 구했어요!" })]) }
},
{
  id: "t3", no: 3, title: "곱셈과 나눗셈이 섞여 있는 식을 계산해 볼까요", soop: "개념 구축하기(O)",
  question: "곱셈과 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "곱셈과 나눗셈이 섞여 있는 식은 앞에서부터 차례대로 계산해요. ( )가 있는 식은 ( ) 안을 먼저 계산해요. 32 ÷ 4 × 2 = 16이지만 32 ÷ (4 × 2) = 4예요.",
  steps: [
    { name: "자치회 활동 수", inst: "학급 임원 48명이 6명씩 모둠을 만들어 자치회에서 운영할 활동을 정하려고 해요. 한 모둠이 활동을 2가지씩 정한다면 자치회에서 운영할 활동은 몇 가지일까요?", hints: ["먼저 48 ÷ 6으로 모둠 수를 구해요.", "모둠 수에 2를 곱해요. 48 ÷ 6 × 2처럼 하나의 식으로 나타내요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "학급 임원 48명", n: 48, color: "#B9D7A8", group: 6, note: "6명씩 모둠" }], { per: 12 }),
        ask: [{ q: "모둠은 몇 개인가요? 48 ÷ 6 =", a: 8, unit: "모둠" }], cards: [48, 6, 2], target: 16, ex: "48÷6×2", ansQ: "자치회에서 운영할 활동은", unit: "가지",
        why: { "4": "48 ÷ (6 × 2)는 48명을 12명씩 묶은 셈이에요. 모둠 수를 먼저 구하고 2를 곱해요." },
        ok: "48 ÷ 6 × 2 = 8 × 2 = 16, 16가지예요. 모둠 수를 먼저 구하므로 앞에서부터 차례대로 계산했어요." }) },
    { name: "( )가 있는 식으로 나타내기", inst: "딸기 56개가 있어요. 딸기를 한 상자에 7개씩 4줄로 담으려면 필요한 상자는 몇 개일까요? 한 상자에 담을 딸기 수를 ( )로 묶어 하나의 식으로 나타내 보세요.", hints: ["한 상자에 담을 딸기는 7 × 4개예요.", "56 ÷ (7 × 4)처럼 ( )로 묶어요."],
      render: (b, a) => mx1Build(b, a, { pic: () => h("div", { class: "mx1flex" }, mx1Pic([{ label: "딸기 56개", n: 56, color: "#E8505B", shape: "c" }], { per: 14 }), mx1GridPic(7, 4, "한 상자: 7개씩 4줄")),
        ask: [{ q: "한 상자에 담을 딸기는 몇 개인가요? 7 × 4 =", a: 28, unit: "개" }], cards: [56, 7, 4], paren: true, target: 2, ex: "56÷(7×4)", ansQ: "필요한 상자는", unit: "개",
        why: { "32": "56 ÷ 7 × 4는 앞에서부터 56 ÷ 7 = 8에 4를 곱한 셈이에요. 한 상자에 담는 딸기 수 7 × 4를 ( )로 묶어 나누어요." },
        ok: "56 ÷ (7 × 4) = 56 ÷ 28 = 2, 상자는 2개 필요해요. 한 상자의 딸기 수를 먼저 구하므로 ( ) 안을 먼저 계산했어요." }) },
    { name: "옳게 계산한 사람 찾기", inst: "서윤이와 시우가 식을 계산했어요. 옳게 계산한 사람을 찾고, 그 이유를 이야기해 보세요.", hints: ["서윤: 32 ÷ 4 × 2 = 8 × 2 = 16", "시우: 32 ÷ (4 × 2) = 8 × 2 = 16 — ( ) 안을 먼저 계산했나요?"],
      render: (b, a) => mx1Chain(b, a, [
        (b2, a2) => quiz(b2, a2, [
          { q: "서윤: 32 ÷ 4 × 2 = 8 × 2 = 16 / 시우: 32 ÷ (4 × 2) = 8 × 2 = 16 — 옳게 계산한 사람은?", o: ["서윤", "시우", "둘 다"], a: 0, why: { "1": "시우의 식에는 ( )가 있어요. ( ) 안의 4 × 2를 먼저 계산했는지 살펴봐요.", "2": "시우는 ( ) 안을 먼저 계산하지 않았어요." } },
          { q: "시우가 잘못 계산한 까닭은?", o: ["( )가 있는 식은 ( ) 안을 먼저 계산해야 하는데 32 ÷ 4를 먼저 계산했어요.", "곱셈을 나눗셈보다 먼저 계산해야 하는데 나눗셈을 먼저 했어요.", "32 ÷ 4를 잘못 계산했어요."], a: 0, why: { "1": "곱셈과 나눗셈은 앞에서부터 차례대로 계산해요. 곱셈을 늘 먼저 하는 것은 아니에요.", "2": "32 ÷ 4 = 8은 맞게 계산했어요." } }]),
        (b2, a2) => mx1Order(b2, a2, [{ e: "32÷(4×2)" }], { ok: "32 ÷ (4 × 2) = 32 ÷ 8 = 4예요. 시우의 식은 ( ) 안을 먼저 계산하면 4가 돼요." })]) },
    { inst: "곱셈과 나눗셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["자치회 활동 수는 앞에서부터 차례대로 계산했어요.", "딸기 상자 수는 ( ) 안을 먼저 계산했어요."],
      render: (b, a) => blanks(b, a, ["곱셈과 나눗셈이 섞여 있는 식은 ", { o: ["앞에서부터 차례대로", "곱셈을 먼저", "나눗셈을 먼저"], a: 0 }, " 계산합니다. 곱셈과 나눗셈이 섞여 있고 ( )가 있는 식은 ", { o: ["( ) 안", "( ) 밖"], a: 0 }, "을 먼저 계산합니다."]) },
    { inst: "계산 순서를 나타내어 계산하고, ○ 안에 ×, ÷를 한 번씩 써넣어 계산 결과가 더 작은 식을 만들어 보세요.", hints: ["( )가 없으면 앞에서부터 차례대로 계산해요.", "결과가 작으려면 곱하는 수는 작게, 나누는 수는 크게 해요."],
      render: (b, a) => mx1Chain(b, a, [
        (b2, a2) => mx1Order(b2, a2, [{ e: "42÷7×13" }, { e: "26×4÷8" }, { e: "105÷(5×7)" }]),
        (b2, a2) => mx1Ops(b2, a2, [{ tpl: "72 ○ (6 ○ 2)", ops: ["×", "÷"], once: true, goal: "min", calc: true }], { ok: "72 ÷ (6 × 2) = 72 ÷ 12 = 6이에요. 다른 경우 72 × (6 ÷ 2) = 216보다 작아요." })]) }
  ],
  challenge: { inst: "계산 결과를 비교하고, 문제를 해결해 보세요.", hints: ["84 ÷ (7 × 2) = 6, 5 × 16 ÷ 8 = 10이에요.", "상추 모종 25 × 3개를 15곳에 똑같이 나누어요.", "16 ÷ 4 × 5를 생각해 봐요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => quiz(b2, a2, [{ q: "계산 결과가 더 큰 식은?", o: ["84 ÷ (7 × 2)", "5 × 16 ÷ 8"], a: 1, why: { "0": "84 ÷ (7 × 2) = 84 ÷ 14 = 6, 5 × 16 ÷ 8 = 80 ÷ 8 = 10이에요." } }]),
      (b2, a2) => mx1Build(b2, a2, { prompt: "은재는 한 판에 25개씩 담겨 있는 상추 모종 3판을 15곳에 똑같이 나누어 심으려고 해요. 한 곳에 심어야 하는 상추 모종은 몇 개인지 하나의 식으로 나타내요.",
        cards: [25, 3, 15], target: 5, ex: "25×3÷15", ansQ: "한 곳에 심어야 하는 상추 모종은", unit: "개", ok: "25 × 3 ÷ 15 = 75 ÷ 15 = 5, 5개예요." }),
      (b2, a2) => mx1Ops(b2, a2, [{ tpl: "16 ○ 4 ○ 5", ops: ["×", "÷"], once: true, goal: 20 }], { ok: "16 ÷ 4 × 5 = 4 × 5 = 20이에요!" })]) }
},
{
  id: "t4", no: 4, title: "덧셈, 뺄셈, 곱셈이 섞여 있는 식을 계산해 볼까요", soop: "개념 구축하기(O)",
  question: "덧셈, 뺄셈, 곱셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "덧셈, 뺄셈, 곱셈이 섞여 있는 식은 곱셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요. ( )가 있으면 ( ) 안을 가장 먼저 계산해요.",
  steps: [
    { name: "앞으로 찍을 사진 수", inst: "안전한 학교생활 안내 자료를 만들기 위해 급식실에서 찍은 사진은 9장, 특별실 3곳에서 찍은 사진은 4장씩 필요해요. 지금까지 7장을 찍었다면 앞으로 찍어야 하는 사진은 몇 장일까요?", hints: ["특별실 3곳의 사진은 3 × 4장이에요.", "9 + 3 × 4에서 지금까지 찍은 7장을 빼요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "급식실", n: 9, color: "#F7E3A1", shape: "r", note: "9장" }, { label: "특별실 3곳", n: 12, group: 4, color: "#BFDDF5", shape: "r", note: "4장씩" }, { label: "찍은 사진", n: 7, color: "#CDE8C4", shape: "r", note: "7장" }]),
        ask: [{ q: "특별실 3곳에서 찍을 사진은? 3 × 4 =", a: 12, unit: "장" }, { q: "급식실과 특별실 3곳에서 찍을 사진은 모두? 9 + 3 × 4 =", a: 21, unit: "장", why: { "48": "9 + 3을 먼저 계산하면 안 돼요. 특별실 사진 3 × 4를 먼저 구해요." } }],
        cards: [9, 3, 4, 7], target: 14, ex: "9+3×4−7", ansQ: "앞으로 찍어야 하는 사진은", unit: "장",
        ok: "9 + 3 × 4 − 7 = 9 + 12 − 7 = 21 − 7 = 14, 14장이에요. 곱셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산했어요." }) },
    { name: "두 식 비교하기", inst: "두 식 가와 나를 각각 계산하고, 계산 결과를 비교해 보세요. 가는 ( )가 없고, 나는 ( )가 있어요.", hints: ["가: 곱셈 2 × 4를 먼저 계산해요.", "나: ( ) 안의 4 + 6을 가장 먼저 계산해요."],
      render: (b, a) => mx1Order(b, a, [{ e: "34−2×4+6", label: "가" }, { e: "34−2×(4+6)", label: "나" }], { cmp: true, ok: "( )가 없을 때 32, 있을 때 14로 결과가 달라요. ( )가 있으면 ( ) 안을 가장 먼저 계산해요." }) },
    { name: "계산 순서 나타내기", inst: "계산 순서를 나타내고, 계산해 보세요.", hints: ["곱셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요.", "45 − (4 + 2) × 3은 ( ) 안 → 곱셈 → 뺄셈 순서예요."],
      render: (b, a) => mx1Order(b, a, [{ e: "39+6×5−2" }, { e: "45−(4+2)×3" }], { ok: "39 + 6 × 5 − 2 = 67, 45 − (4 + 2) × 3 = 27이에요." }) },
    { inst: "덧셈, 뺄셈, 곱셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["사진 수를 구할 때 3 × 4를 먼저 계산했어요."],
      render: (b, a) => blanks(b, a, ["덧셈, 뺄셈, 곱셈이 섞여 있는 식은 ", { o: ["곱셈", "덧셈", "뺄셈"], a: 0 }, "을 먼저 계산합니다. 덧셈과 뺄셈은 ", { o: ["앞에서부터 차례대로", "뒤에서부터 차례대로"], a: 0 }, " 계산하고, ( )가 있으면 ", { o: ["( ) 안", "곱셈"], a: 0 }, "을 가장 먼저 계산합니다."]) },
    { inst: "계산해 보고, 학급 문고 문제를 하나의 식으로 나타내어 구해 보세요.", hints: ["48 − 2 × (9 + 7)은 ( ) 안 → 곱셈 → 뺄셈 순서예요.", "빌려 간 책은 (8 + 7) × 2권이에요."],
      render: (b, a) => mx1Build(b, a, { ask: [{ q: "48 − 2 × (9 + 7) =", a: 16, why: { "736": "48 − 2를 먼저 계산하면 안 돼요. ( ) 안 → 곱셈 → 뺄셈 순서로 계산해요." } }, { q: "20 − 2 × 6 + 7 =", a: 15, why: { "1": "6 + 7을 먼저 계산하면 안 돼요. 곱셈 2 × 6을 먼저 하고 앞에서부터 차례대로 계산해요.", "115": "20 − 2를 먼저 계산하면 안 돼요. 곱셈 2 × 6을 먼저 계산해요." } }],
        prompt: "유나네 반 학급 문고에 책이 65권 있었어요. 여학생 8명과 남학생 7명이 책을 한 명당 2권씩 빌려 갔다면 학급 문고에 남아 있는 책은 몇 권인지 하나의 식으로 나타내요.",
        cards: [65, 8, 7, 2, 2], atMost: true, target: 35, ex: "65−(8+7)×2", ansQ: "남아 있는 책은", unit: "권",
        ok: "65 − (8 + 7) × 2 = 65 − 15 × 2 = 65 − 30 = 35, 35권이에요." }) }
  ],
  challenge: { inst: "계산 결과가 30보다 작은 식을 찾고, 문제를 해결해 보세요.", hints: ["2 + 3 × 16 − 18 = 32, 3 × (25 − 17) + 5 = 29예요.", "유성이가 산 꿀떡은 25 + 15개예요. 그 2배보다 13개 더 적어요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => quiz(b2, a2, [{ q: "계산 결과가 30보다 작은 식은?", o: ["2 + 3 × 16 − 18", "3 × (25 − 17) + 5"], a: 1, why: { "0": "2 + 3 × 16 − 18 = 2 + 48 − 18 = 32라서 30보다 커요." } }]),
      (b2, a2) => mx1Build(b2, a2, { ask: [{ q: "18 + 4 × (24 − 15) =", a: 54, why: { "198": "18 + 4를 먼저 계산하면 안 돼요. ( ) 안 → 곱셈 → 덧셈 순서예요." } },
          { q: "18 + 4 × (24 − 15) < □ 에서 □ 안에 들어갈 수 있는 가장 작은 자연수는?", a: 55, why: { "54": "□는 54보다 커야 해요." } }],
        prompt: "유성이는 분홍색 꿀떡 25개와 초록색 꿀떡 15개를 샀고, 민주는 유성이가 산 꿀떡의 2배보다 13개 더 적게 샀어요. 민주가 산 꿀떡은 몇 개인지 하나의 식으로 나타내요.",
        cards: [25, 15, 2, 2, 13], atMost: true, target: 67, ex: "(25+15)×2−13", ansQ: "민주가 산 꿀떡은", unit: "개", ok: "(25 + 15) × 2 − 13 = 40 × 2 − 13 = 80 − 13 = 67, 67개예요." })]) }
},
{
  id: "t5", no: 5, title: "덧셈, 뺄셈, 나눗셈이 섞여 있는 식을 계산해 볼까요", soop: "개념 구축하기(O)",
  question: "덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 나눗셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요. ( )가 있으면 ( ) 안을 가장 먼저 계산해요.",
  steps: [
    { name: "남아 있는 줄넘기 수", inst: "운동장 대여함에 줄넘기가 8개 있었어요. 줄넘기 30개를 준비하여 운동장 대여함과 체육관 대여함에 똑같이 나누어 더 넣었어요. 그 후 학생들이 운동장 대여함에서 줄넘기 6개를 빌려 갔다면 운동장 대여함에 남아 있는 줄넘기는 몇 개일까요?", hints: ["운동장 대여함에 더 넣은 줄넘기는 30 ÷ 2개예요.", "8 + 30 ÷ 2에서 빌려 간 6개를 빼요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "운동장 대여함", n: 8, color: "#F6C9A6", shape: "c", note: "처음 8개" }, { label: "준비한 줄넘기", n: 30, group: 15, color: "#BFDDF5", shape: "c", note: "두 대여함에 똑같이" }], { per: 15 }),
        ask: [{ q: "운동장 대여함에 더 넣은 줄넘기는? 30 ÷ 2 =", a: 15, unit: "개" }, { q: "더 넣은 후 운동장 대여함의 줄넘기는? 8 + 30 ÷ 2 =", a: 23, unit: "개", why: { "19": "8 + 30을 먼저 계산하면 안 돼요. 나눗셈 30 ÷ 2를 먼저 계산해요." } }],
        cards: [8, 30, 2, 6], target: 17, ex: "8+30÷2−6", ansQ: "운동장 대여함에 남아 있는 줄넘기는", unit: "개",
        ok: "8 + 30 ÷ 2 − 6 = 8 + 15 − 6 = 23 − 6 = 17, 17개예요. 나눗셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산했어요." }) },
    { name: "두 식 비교하기", inst: "두 식 가와 나를 각각 계산하고, 계산 결과를 비교해 보세요.", hints: ["가: 나눗셈 32 ÷ 4를 먼저 계산해요.", "나: ( ) 안의 44 − 32를 가장 먼저 계산해요."],
      render: (b, a) => mx1Order(b, a, [{ e: "44−32÷4+7", label: "가" }, { e: "(44−32)÷4+7", label: "나" }], { cmp: true, ok: "( )가 없을 때 43, 있을 때 10으로 결과가 달라요. ( )가 있으면 ( ) 안을 가장 먼저 계산해요." }) },
    { name: "계산 순서 나타내기", inst: "계산 순서를 나타내고, 계산해 보세요.", hints: ["나눗셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요.", "3 + 72 ÷ (15 − 6)은 ( ) 안 → 나눗셈 → 덧셈 순서예요."],
      render: (b, a) => mx1Order(b, a, [{ e: "5−12÷6+28" }, { e: "3+72÷(15−6)" }, { e: "63÷(2+5)−4" }], { ok: "5 − 12 ÷ 6 + 28 = 31, 3 + 72 ÷ (15 − 6) = 11, 63 ÷ (2 + 5) − 4 = 5예요." }) },
    { inst: "덧셈, 뺄셈, 나눗셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["줄넘기 수를 구할 때 30 ÷ 2를 먼저 계산했어요."],
      render: (b, a) => blanks(b, a, ["덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 ", { o: ["나눗셈", "덧셈", "뺄셈"], a: 0 }, "을 먼저 계산합니다. 덧셈과 뺄셈은 ", { o: ["앞에서부터 차례대로", "뒤에서부터 차례대로"], a: 0 }, " 계산하고, ( )가 있으면 ", { o: ["( ) 안", "나눗셈"], a: 0 }, "을 가장 먼저 계산합니다."]) },
    { name: "문제 만들고 해결하기", inst: "㉠ 다음에 올 문장의 순서를 정하여 문제를 만들고, 하나의 식으로 나타내어 구해 보세요. 순서에 따라 문제와 답이 달라져요.", hints: ["예: ㉠ → ㉣ → ㉢ → ㉡ 순서이면 (24 − 12) ÷ 4 + 8이에요.", "나누어 가지기 전에 계산하는 부분은 ( )로 묶어요."],
      render: (b, a) => mx1Story(b, a, { start: 24, first: { k: "㉠", t: "색종이 24장이 있습니다." }, ask: "지금 가지고 있는 색종이는 몇 장일까요?", unit: "장", nums: [24, 8, 4, 12],
        cards: [{ k: "㉡", t: "색종이 8장을 더 받았습니다.", f: v => v + 8 }, { k: "㉢", t: "4명이 똑같이 나누어 가졌습니다.", f: v => v % 4 === 0 ? v / 4 : null }, { k: "㉣", t: "색종이 12장을 동생에게 주었습니다.", f: v => v >= 12 ? v - 12 : null }] }) }
  ],
  challenge: { inst: "( )로 묶어 계산 결과가 10이 되게 하고, 표를 보고 문제를 해결해 보세요.", hints: ["24 − 18을 ( )로 묶어 보세요.", "비누 1개의 무게는 260 ÷ 2 g이에요.", "잘못 계산한 식은 ( ) 안 4 + 9를 먼저 계산해야 해요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => mx1Paren(b2, a2, [{ e: "24−18÷2+7", target: 10 }], { ok: "(24 − 18) ÷ 2 + 7 = 6 ÷ 2 + 7 = 3 + 7 = 10이에요." }),
      (b2, a2) => mx1Build(b2, a2, { pic: () => mx1Tags([["칫솔 1개", "25 g"], ["비누 2개", "260 g"], ["치약 1개", "150 g"]]),
        ask: [{ q: "잘못 계산한 식 52 ÷ (4 + 9) − 2를 옳게 계산하면?", a: 2, why: { "20": "52 ÷ 4를 먼저 계산하면 안 돼요. ( ) 안 4 + 9를 가장 먼저 계산해요." } }],
        prompt: "칫솔 1개와 비누 1개의 무게의 합은 치약 1개의 무게보다 몇 g 더 무거운지 하나의 식으로 나타내요.",
        cards: [25, 260, 2, 150], target: 5, ex: "25+260÷2−150", ansQ: "더 무거운 무게는", unit: "g", ok: "25 + 260 ÷ 2 − 150 = 25 + 130 − 150 = 5, 5 g 더 무거워요." })]) }
},
{
  id: "t6", no: 6, title: "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식을 계산해 볼까요", soop: "개념 구축하기(O)",
  question: "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 곱셈과 나눗셈을 먼저 계산해요. 곱셈과 나눗셈, 덧셈과 뺄셈은 각각 앞에서부터 차례대로 계산하고, ( )가 있으면 ( ) 안을 가장 먼저 계산해요.",
  steps: [
    { name: "텃밭 상자의 모종 수", inst: "텃밭 상자 6개에 고추 모종을 각각 3개씩 2줄로 심었어요. 상추 모종 32개 중에서 시든 모종 2개를 빼고 남은 모종을 텃밭 상자 6개에 똑같이 나누어 심으려고 해요. 텃밭 상자 한 개에 심는 모종은 모두 몇 개가 될까요?", hints: ["한 상자의 고추 모종은 3 × 2개예요.", "한 상자의 상추 모종은 (32 − 2) ÷ 6개예요.", "두 수를 더하는 하나의 식으로 나타내요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "한 상자의 고추", n: 6, group: 3, color: "#E8505B", shape: "c", note: "3개씩 2줄" }, { label: "상추 모종 32개", n: 32, cross: 2, color: "#7BC47F", shape: "c", note: "시든 모종 2개" }]),
        ask: [{ q: "상자 한 개의 고추 모종은? 3 × 2 =", a: 6, unit: "개" }, { q: "상자 한 개의 상추 모종은? (32 − 2) ÷ 6 =", a: 5, unit: "개", why: { "30": "( ) 안을 계산한 다음 6으로 나누어야 해요." } }],
        cards: [3, 2, 32, 2, 6], paren: true, target: 11, ex: "3×2+(32−2)÷6", ansQ: "텃밭 상자 한 개에 심는 모종은 모두", unit: "개",
        ok: "3 × 2 + (32 − 2) ÷ 6 = 3 × 2 + 30 ÷ 6 = 6 + 5 = 11, 11개예요. ( ) 안을 가장 먼저 계산하고 곱셈과 나눗셈을 먼저 계산했어요." }) },
    { name: "계산 순서 나타내기", inst: "계산 순서를 나타내고, 계산해 보세요. 식 아래에 ①, ②, ③, ④ 순서가 그려져요.", hints: ["( ) 안 → 곱셈과 나눗셈(앞에서부터) → 덧셈과 뺄셈(앞에서부터) 순서예요.", "9 + 3 × 5 − 4 ÷ 2는 3 × 5, 4 ÷ 2를 먼저 계산해요."],
      render: (b, a) => mx1Order(b, a, [{ e: "3×2+(32−2)÷6" }, { e: "9+3×5−4÷2" }, { e: "36−(2+6)÷4×10" }], { ok: "11, 22, 16이에요. 계산 순서를 잘 나타냈어요!" }) },
    { name: "가장 먼저 계산할 부분 찾기", inst: "두 식에서 가장 먼저 계산해야 하는 부분을 찾아 기호를 눌러 보세요. ( )가 있고 없음에 따라 무엇이 달라지는지 말해 봐요.", hints: ["( )가 없으면 곱셈과 나눗셈 중 앞에 있는 것을 먼저 계산해요.", "( )가 있으면 ( ) 안이 가장 먼저예요."],
      render: (b, a) => mx1Order(b, a, [{ e: "12+5×46−34÷2", first: true }, { e: "12+5×(46−34)÷2", first: true }], { ok: "첫째 식은 5 × 46을, 둘째 식은 ( ) 안 46 − 34를 가장 먼저 계산해요." }) },
    { inst: "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["텃밭 상자 모종 수를 구할 때 ( ) 안 → 3 × 2 → 30 ÷ 6 → 6 + 5 순서로 계산했어요."],
      render: (b, a) => blanks(b, a, ["덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 ", { o: ["곱셈과 나눗셈", "덧셈과 뺄셈"], a: 0 }, "을 먼저 계산합니다. ( )가 있으면 ", { o: ["( ) 안", "곱셈과 나눗셈"], a: 0 }, "을 가장 먼저 계산합니다. 곱셈과 나눗셈, 덧셈과 뺄셈은 각각 ", { o: ["앞에서부터 차례대로", "뒤에서부터 차례대로"], a: 0 }, " 계산합니다."]) },
    { name: "조건 골라 문제 만들기", inst: "조건을 골라 문제를 만들고, 해결해 보세요. 과자와 초콜릿은 3개의 가격이에요.", hints: ["과자 2개의 가격은 4200 ÷ 3 × 2원이에요.", "낸 돈 10000원에서 산 물건 가격의 합을 빼요. 합을 ( )로 묶을 수 있어요."],
      render: (b, a) => mx1Shop(b, a, { tags: [["방울토마토", "100 g 1500원"], ["체리", "100 g 3500원"], ["과자", "3개 4200원"], ["초콜릿", "3개 6000원"]],
        groups: [[{ n: "방울토마토", p: 1500 }, { n: "체리", p: 3500 }], [{ n: "과자", p: 4200 }, { n: "초콜릿", p: 6000 }]] }) }
  ],
  challenge: { inst: "계산 결과가 다른 식을 찾고, 문제를 해결해 보세요.", hints: ["㉠ 30, ㉡ 31, ㉢ 30이에요.", "수첩 3권은 650 × 3원, 지우개 1개는 4000 ÷ 10원이에요.", "결과가 가장 작으려면 □ × (□ + □)가 가장 작아야 해요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => quiz(b2, a2, [{ q: "계산 결과가 다른 하나는?", o: ["20 + 5 × (25 − 9) ÷ 8", "4 + 27 ÷ 9 × (32 − 23)", "33 + 2 × 3 ÷ 6 − 4"], a: 1, why: { "0": "20 + 5 × (25 − 9) ÷ 8 = 20 + 80 ÷ 8 = 30이에요.", "2": "33 + 2 × 3 ÷ 6 − 4 = 33 + 1 − 4 = 30이에요." } }]),
      (b2, a2) => mx1Build(b2, a2, { pic: () => mx1Tags([["수첩", "1권 650원"], ["지우개", "10개 4000원"]]),
        prompt: "은빈이는 수첩 3권과 지우개 1개를 사고 5000원을 냈어요. 받아야 하는 거스름돈은 얼마인지 하나의 식으로 나타내요.",
        cards: [5000, 650, 3, 4000, 10], target: 2650, ex: "5000−(650×3+4000÷10)", ansQ: "거스름돈은", unit: "원", ok: "5000 − (650 × 3 + 4000 ÷ 10) = 5000 − 2350 = 2650, 2650원이에요." }),
      (b2, a2) => mx1Slots(b2, a2, { tpl: "□ × (□ + □) − 28 ÷ 7", cards: [5, 9, 3], goal: "min", ok: "3 × (5 + 9) − 28 ÷ 7 = 42 − 4 = 38이 가장 작아요. 곱하는 수를 가장 작은 3으로 했어요!" })]) }
},
{
  id: "t7", no: 7, title: "생각을 더하다 ― 나를 지켜 주는 생존 가방", soop: "탐구 정리하기(O)",
  question: "혼합 계산을 이용하여 생존 가방에 넣은 물건의 무게를 구할 수 있을까요?",
  summary: "물건 1개의 무게는 (묶음의 무게) ÷ (묶음의 개수)로 구하고, 여러 개의 무게는 여기에 개수를 곱해요. 예: 성냥개비 2세트 150 ÷ 10 × 2 = 30(g). 초등학교 5학년 학생은 생존 가방을 5000 g 정도로 준비하는 게 좋아요.",
  steps: [
    { name: "생존 가방 알아보기", inst: "생존 가방에 넣을 수 있는 물건의 무게는 몸무게에 따라 달라져요. 생존 가방에 대해 알아보세요.", hints: ["초등학교 5학년 학생은 5000 g 정도로 준비하는 게 좋아요.", "물건 1개의 무게는 묶음의 무게를 묶음의 개수로 나누어 구해요."],
      render: (b, a) => quiz(b, a, [
        { q: "생존 가방은 어떤 가방일까요?", o: ["재난이 일어났을 때 바로 들고 나갈 수 있도록 꼭 필요한 물건을 넣어 둔 가방", "여행 갈 때 옷을 넣는 가방", "학교에 들고 다니는 책가방"], a: 0 },
        { q: "초등학교 5학년 학생은 생존 가방을 몇 g 정도로 준비하는 게 좋을까요?", o: ["500 g", "5000 g", "50000 g"], a: 1 },
        { q: "물티슈 20개가 1300 g일 때, 물티슈 1개의 무게를 구하는 식은?", o: ["1300 ÷ 20", "1300 × 20", "1300 − 20"], a: 0, why: { "1": "1개의 무게는 전체를 20으로 나누어 구해요." } }]) },
    { name: "재원이의 생존 가방", inst: "재원이는 담요 1개, 물 1병, 통조림 2개, 초콜릿 3개, 성냥개비 2세트를 생존 가방에 넣었어요. 물건마다 무게를 하나의 식으로 나타내어 구하고, 모두 몇 g인지 구해 보세요. (예: 성냥개비 2세트 150 ÷ 10 × 2 = 30)", hints: ["담요 1개: 3000 ÷ 2, 물 1병: 9000 ÷ 6", "초콜릿 3개: 1000 ÷ 5 × 3, 통조림 2개: 5000 ÷ 10 × 2"],
      render: (b, a) => mx1Bag(b, a, { fixed: { "담요": 1, "물": 1, "통조림": 2, "초콜릿": 3, "성냥개비": 2 }, limit: 5000, ok: "재원이의 생존 가방은 30 + 1500 + 1500 + 600 + 1000 = 4630, 모두 {sum} g이에요." }) },
    { name: "무게가 알맞은지 따져 보기", inst: "재원이의 생존 가방 무게가 알맞은지 생각해 보세요.", hints: ["4630 g과 5000 g을 비교해요.", "물 1병은 9000 ÷ 6 = 1500 g이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "재원이의 생존 가방(4630 g)은 무게가 알맞은가요?", o: ["5000 g보다 가벼우므로 알맞아요.", "5000 g보다 무거우므로 알맞지 않아요."], a: 0 },
        { q: "재원이가 물 1병을 더 넣으면 생존 가방은 몇 g이 될까요?", o: ["4630 + 1500 = 6130 g", "4630 + 9000 = 13630 g", "4630 + 6 = 4636 g"], a: 0, why: { "1": "9000 g은 물 6병의 무게예요. 1병은 9000 ÷ 6 = 1500 g이에요." } },
        { q: "물 1병을 더 넣은 생존 가방은 어떻게 하면 좋을까요?", o: ["5000 g보다 무거우니 다른 물건을 빼거나 가벼운 물건으로 바꿔요.", "무거울수록 좋으니 그대로 둬요."], a: 0 }]) },
    { name: "나만의 생존 가방", inst: "나에게 필요한 물건을 골라 나만의 생존 가방을 준비해 보세요. 넣은 물건의 무게를 각각 하나의 식으로 구하고, 모두 몇 g인지 구해요. 5000 g보다 무거우면 다른 물건으로 바꿔요.", hints: ["물건 1개의 무게 = 묶음의 무게 ÷ 묶음의 개수", "여러 개의 무게는 1개의 무게에 개수를 곱해요."],
      render: (b, a) => mx1Bag(b, a, { limit: 5000 }) },
    { name: "친구에게 설명하기", inst: "내가 준비한 생존 가방을 친구에게 설명해 보세요.", hints: ["어떤 물건을 왜 넣었는지 말해요.", "무게가 5000 g보다 가벼운지 무거운지 말해요."],
      render: (b, a) => writeStep(b, a, [
        { q: "생존 가방에 넣은 물건과 그 까닭을 써요.", tag: "물건", ph: "예: 휴지, 손전등, 물, 쿠키, 통조림이 필요할 것 같아서 넣었어요." },
        { q: "생존 가방의 무게가 알맞은지와 그 까닭을 써요.", tag: "무게", ph: "예: 모두 4700 g이라 5000 g보다 가벼워서 알맞아요." }]) }
  ],
  challenge: { inst: "휴지 5개, 손전등 1개, 물 2병, 쿠키 10개, 통조림 1개를 넣은 생존 가방의 무게를 구해 보세요.", hints: ["휴지 5개: 1000 ÷ 10 × 5, 물 2병: 9000 ÷ 6 × 2", "쿠키 10개: 800 ÷ 40 × 10"],
    render: (b, a) => mx1Bag(b, a, { fixed: { "휴지": 5, "손전등": 1, "물": 2, "쿠키": 10, "통조림": 1 }, limit: 5000, ok: "500 + 500 + 3000 + 200 + 500 = 4700, 모두 {sum} g이에요. 5000 g보다 가벼워서 알맞아요!" }) }
},
{
  id: "t8", no: 8, title: "놀이를 더하다 ― 하나, 둘, 셋 빙고!", soop: "발표하기(P)",
  question: "수 카드로 혼합 계산식을 만들어 빙고 놀이를 해 볼까요?",
  summary: "뒤집은 수 카드를 모두 사용하고 +, −, ×, ÷ 중에서 서로 다른 2가지를 사용하여 놀이판에 있는 수가 계산 결과가 되는 식을 만들어요. 필요하면 ( )를 써요. 계산 순서에 맞게 정확히 계산해야 해요.",
  steps: [
    { name: "놀이 방법 알아보기", inst: "4명이 함께 하는 ‘하나, 둘, 셋 빙고!’ 놀이 방법을 알아보세요.", hints: ["놀이판에는 1부터 25까지의 수 중 16개를 골라 써요.", "가장 먼저 3줄을 색칠한 사람이 ‘빙고’를 외쳐요."],
      render: (b, a) => quiz(b, a, [
        { q: "놀이판에는 어떤 수를 써넣나요?", o: ["1부터 25까지의 수 중에서 16개를 골라 한 번씩", "1부터 16까지의 수를 차례로", "아무 수나 같은 수를 여러 번"], a: 0 },
        { q: "뒤집은 수 카드로 식을 만들 때 지켜야 할 것을 모두 고르세요.", o: ["뒤집은 수 카드를 모두 사용해요.", "+, −, ×, ÷ 중에서 서로 다른 2가지를 사용해요.", "필요한 경우 ( )를 사용할 수 있어요.", "같은 수는 한 번만 써야 해요."], a: [0, 1, 2], why: { "0,1,2,3": "같은 수를 여러 번 사용할 수 있어요." } },
        { q: "가장 먼저 몇 줄을 색칠한 사람이 ‘빙고’를 외치나요?", o: ["1줄", "3줄", "4줄"], a: 1 }]) },
    { name: "식 만들기 연습", inst: "뒤집은 수 카드가 7, 5, 8이에요. 친구가 만든 식을 계산해 보고, 놀이판의 수 12가 계산 결과가 되는 식을 만들어 보세요.", hints: ["7 + 5 − 8 + 5는 앞에서부터 차례대로 계산해요.", "8 − 7 = 1을 이용해 보세요. 7, 5, 8을 모두 써야 해요."],
      render: (b, a) => mx1Build(b, a, { ask: [{ q: "친구가 만든 식 7 + 5 − 8 + 5 =", a: 9 }], cards: [7, 5, 8], reuse: true, allCards: true, kinds: 2, target: 12, ex: "(8−7)×5+7", noAns: true,
        prompt: "7, 5, 8을 모두 사용하고 서로 다른 기호 2가지 이상으로 계산 결과가 12인 식을 만들어요(같은 수를 여러 번 써도 돼요).",
        ok: "계산 결과가 12인 식을 만들었어요. 다른 식도 여러 가지 만들 수 있어요!" }) },
    { name: "놀이판 만들기", inst: "1부터 25까지의 수 중에서 16개를 골라 내 놀이판에 써넣어요. 놀이판은 친구에게 보여 주지 않아요.", hints: ["수를 누르면 빈칸에 차례로 들어가요.", "식으로 만들기 쉬운 수와 어려운 수를 생각해 골라 봐요."],
      render: (b, a) => mx1BoardMake(b, a) },
    { name: "빙고 놀이", inst: "수 카드 3장을 뒤집었어요. 카드를 모두 사용해 놀이판의 수가 계산 결과가 되는 식을 만들어 색칠해요. 한 줄을 먼저 완성해 봐요. 식을 만들 수 없으면 카드를 다시 뽑아요.", hints: ["두 수를 곱하거나 나눈 다음 더하거나 빼 보세요.", "계산 순서에 맞게 계산했는지 꼭 확인해요."],
      render: (b, a) => mx1Bingo(b, a, { goal: 1, ok: "한 줄 빙고! 계산 순서에 맞게 식을 만들었어요." }) },
    { name: "또 다른 놀이 방법", inst: "주사위를 3번 던져 나온 수와 +, −, ×, ÷, ( ) 중에서 3가지를 사용하여 혼합 계산식을 여러 개 만들고 계산해 보세요.", hints: ["( )도 한 가지로 세어요. 예: +, ×, ( )", "나온 수 3개를 한 번씩 모두 써요."],
      render: (b, a) => mx1Dice(b, a, { need: 3 }) }
  ],
  challenge: { inst: "교과서 놀이 규칙대로 3줄을 먼저 색칠해 ‘빙고’를 외쳐 보세요.", hints: ["줄을 완성하는 데 필요한 수가 계산 결과가 되도록 식을 만들어 봐요.", "이미 색칠한 수가 다시 결과가 되지 않게 해요."],
    render: (b, a) => mx1Bingo(b, a, { goal: 3, ok: "3줄 빙고! 혼합 계산 왕이에요!" }) }
},
{
  id: "t9", no: 9, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "자연수의 혼합 계산을 계산 순서에 맞게 할 수 있나요?",
  summary: "덧셈과 뺄셈, 곱셈과 나눗셈이 섞여 있는 식은 앞에서부터 차례대로 계산해요. 덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 곱셈과 나눗셈을 먼저 계산해요. ( )가 있는 식은 ( ) 안을 가장 먼저 계산해요.",
  steps: [
    { name: "먼저 계산할 부분", inst: "가장 먼저 계산해야 하는 부분의 기호를 눌러 보세요.", hints: ["( )가 없으면 곱셈을 먼저 계산해요.", "( )가 있으면 ( ) 안을 가장 먼저 계산해요."],
      render: (b, a) => mx1Order(b, a, [{ e: "29+8×4−14", first: true }, { e: "46÷(28−5)+16", first: true }]) },
    { name: "계산 순서 나타내기", inst: "계산 순서를 나타내고, 계산해 보세요.", hints: ["32 − (25 + 6)은 ( ) 안을 먼저 계산해요.", "63 ÷ 7 × 3은 앞에서부터 차례대로 계산해요."],
      render: (b, a) => mx1Order(b, a, [{ e: "32−(25+6)" }, { e: "63÷7×3" }]) },
    { name: "잇고 비교하기", inst: "관계있는 것끼리 이어 보고, 두 식의 계산 결과를 비교해 보세요.", hints: ["8 × 5 − 35 ÷ 5 + 13 = 40 − 7 + 13", "15 × 3 − 27 + 36 ÷ 6 = 24, 28 ÷ (22 − 8) × 11 + 2 = 24"],
      render: (b, a) => mx1Chain(b, a, [
        (b2, a2) => mx1Match(b2, a2, { left: ["8×5−35÷5+13", "17+2×(41−27)÷7"], right: [21, 14, 46] }),
        (b2, a2) => quiz(b2, a2, [{ q: "15 × 3 − 27 + 36 ÷ 6 ○ 28 ÷ (22 − 8) × 11 + 2", o: [">", "=", "<"], a: 1, why: { "0": "두 식을 계산하면 모두 24예요.", "2": "두 식을 계산하면 모두 24예요." } }])]) },
    { name: "문제 해결하기", inst: "문제를 하나의 식으로 나타내어 구하고, ( )로 묶어 계산 결과가 16이 되게 해 보세요.", hints: ["이번 달에 받은 칭찬 도장은 5 × 4개예요.", "9 − 6을 ( )로 묶어 보세요."],
      render: (b, a) => mx1Chain(b, a, [
        (b2, a2) => mx1Build(b2, a2, { prompt: "시우는 지난달에 칭찬 도장을 43개 받았고 이번 달은 칭찬 도장을 매주 5개씩 4주 동안 받았어요. 공책으로 바꾸는 데 칭찬 도장 35개를 사용하였다면 시우에게 남은 칭찬 도장은 몇 개인지 하나의 식으로 나타내요.",
          cards: [43, 5, 4, 35], target: 28, ex: "43+5×4−35", ansQ: "남은 칭찬 도장은", unit: "개", ok: "43 + 5 × 4 − 35 = 43 + 20 − 35 = 28, 28개예요." }),
        (b2, a2) => mx1Paren(b2, a2, [{ e: "15+9−6÷3", target: 16 }], { ok: "15 + (9 − 6) ÷ 3 = 15 + 1 = 16이에요." })]) },
    { name: "확인하고 정리해요", inst: "단원에서 배운 계산 순서를 정리해요. 계산 순서를 나타내어 계산해 보세요.", hints: ["29 − 13 + 5, 40 ÷ 2 × 4는 앞에서부터 차례대로 계산해요.", "2 + 4 × 7 − 15 ÷ 3은 곱셈과 나눗셈을 먼저 계산해요."],
      render: (b, a) => mx1Chain(b, a, [
        (b2, a2) => mx1Order(b2, a2, [{ e: "29−13+5" }, { e: "40÷2×4" }, { e: "2+4×7−15÷3" }]),
        (b2, a2) => blanks(b2, a2, ["덧셈과 뺄셈, 곱셈과 나눗셈이 섞여 있는 식은 ", { o: ["앞에서부터 차례대로", "뒤에서부터 차례대로"], a: 0 }, " 계산해요. 덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 ", { o: ["곱셈과 나눗셈", "덧셈과 뺄셈"], a: 0 }, "을 먼저 계산해요. ( )가 있는 식은 ", { o: ["( ) 안", "( ) 밖"], a: 0 }, "을 가장 먼저 계산해요."])]) }
  ],
  challenge: { inst: "지훈이는 5000원으로 학용품을 사려고 해요. “3500원짜리 필통 1개와 색연필 2자루를 살 거야.” 지훈이가 학용품을 사고 남은 돈은 얼마인지 ㉠ 하나의 식으로 나타내고 ㉡ 남은 돈을 구해 보세요.", hints: ["색연필 3자루가 1200원이니 1자루는 1200 ÷ 3원이에요.", "5000 − (3500 + 1200 ÷ 3 × 2)처럼 산 물건 값을 ( )로 묶어 빼요."],
    render: (b, a) => mx1Build(b, a, { pic: () => mx1Tags([["필통", "1개 3500원"], ["색연필", "3자루 1200원"]]), prompt: "㉠ 남은 돈을 구하는 하나의 식을 만들어요.",
      cards: [5000, 3500, 1200, 3, 2], target: 700, ex: "5000−(3500+1200÷3×2)", ansQ: "㉡ 남은 돈은", unit: "원",
      ok: "5000 − (3500 + 1200 ÷ 3 × 2) = 5000 − (3500 + 800) = 700, 남은 돈은 700원이에요. 다음 시간에는 약수와 배수를 배워요!" }) }
}
];
