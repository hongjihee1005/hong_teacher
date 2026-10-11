//@@APP
const APP = {title:"우리 반 현장 체험 학습 계획단", unit:"5-1 수학 1. 자연수의 혼합 계산", key:"s51-mixcalc-v1", welcome:"우리 반 현장 체험 학습 계획단에 온 것을 환영해요", intro:"솔빛초등학교 5학년 3반 친구들과 별빛 과학관 체험 학습을 계획하며, 버스 빈자리·표값·간식 나누기·거스름돈을 하나의 식으로 나타내고 계산하는 순서를 알아봐요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u1-mixcalc.tb.js)의 mx1 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   (입력칸 0.9초 · 고르기 0.26초 · 카드로 식 만들기·( ) 넣기·잇기 1.2초) 빙고는 여러 식을 내 보는 것이 놀이라서 '이 식 내기' 단추를 둬요. */
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
.mx1item.mx1on{border-color:var(--tent);background:#FFF4E8}
.mx1grid{display:grid;grid-template-columns:repeat(4,minmax(0,3.6em));gap:.3em}
.mx1grid button{aspect-ratio:1;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.25);border:2px solid var(--line);border-radius:.5em;background:#fff;cursor:pointer;padding:0}
.mx1grid button.mx1hit{background:#FFD38A;border-color:var(--tent)}
.mx1grid button.mx1lin{background:#FFB36B}
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
function mx1Lines(hit) {
  const L = [];
  for (let r = 0; r < 4; r++) L.push([0, 1, 2, 3].map(c => r * 4 + c));
  for (let c = 0; c < 4; c++) L.push([0, 1, 2, 3].map(r => r * 4 + c));
  L.push([0, 5, 10, 15], [3, 6, 9, 12]);
  return L.filter(l => l.every(i => hit[i]));
}

/* ===== 이야기 버전 부품: '확인하기' 단추 없이 autoRun으로 저절로 확인 ===== */
/* 입력칸에 autoRun 걸기: 쓸 때·칸을 떠날 때 확인 시계를 다시 맞추고, Enter는 칸을 떠나요 */
function mx1Hook(el, auto) {
  el.addEventListener("input", () => auto()); el.addEventListener("change", () => auto());
  el.addEventListener("focusout", () => setTimeout(() => auto(), 0));
  el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); el.blur(); } });
}
/* 만든 식이 다 되었나요? (계산이 되고, 수 카드를 모두 썼을 때) */
function mx1Complete(tk, o) {
  const r = mx1Eval(tk); if (!r.ok) return false;
  if (!tk.some(t => t.t === "o")) return false;
  if (!o.cards) return true;
  const nums = tk.filter(t => t.t === "n").map(t => t.v);
  if (o.reuse || o.atMost) return o.cards.every(c => nums.includes(c));
  return nums.length >= o.cards.length;
}

/* ① 묻고 답하기: 수 하나 / 고르기 — 다 쓰거나 다 고르면 저절로 확인
   items: {q, a:수, unit, post, why:{값:"까닭"}, fig} | {q, o:[…], a:번호|[번호…], why:{번호:"까닭"}, fig}   opt: ok, words */
function mx1Ask(body, api, items, opt = {}) {
  mx1Style();
  let auto = () => {};
  const rows = items.map((it, i) => {
    const box = h("div", { class: "qitem" });
    const lead = items.length > 1 ? `${i + 1}. ` : "";
    const R = { it, box };
    if (it.fig) box.append(h("div", { class: "mx1box" }, it.fig()));
    if (it.o) {
      R.sel = new Set(); const multi = Array.isArray(it.a);
      const row = h("div", { class: "opts" });
      it.o.forEach((o, oi) => row.append(h("button", { class: "opt", onclick: e => {
        [...row.children].forEach(b => b.classList.remove("good", "bad"));
        if (multi) { R.sel.has(oi) ? R.sel.delete(oi) : R.sel.add(oi); e.currentTarget.classList.toggle("on"); }
        else { R.sel.clear(); R.sel.add(oi); [...row.children].forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); }
        auto();
      } }, o)));
      R.row = row;
      box.append(h("div", { class: "jua" }, lead + it.q + (multi ? " (모두 고르세요)" : "")), row);
    } else {
      R.inp = mx1Input(it.q, true);
      box.append(h("span", { class: "jua" }, lead + it.q + " "), R.inp, it.post ? h("span", { class: "jua" }, " " + it.post) : null, it.unit ? h("span", {}, " " + it.unit) : null);
      mx1Hook(R.inp, () => auto());
    }
    return R;
  });
  const ansText = R => R.it.o ? (Array.isArray(R.it.a) ? R.it.a : [R.it.a]).map(i => R.it.o[i]).join(", ") : `${R.it.a}${R.it.unit ? " " + R.it.unit : ""}`;
  api.provide({ words: opt.words || [], answers: rows.map(R => `${R.it.q}${R.it.post ? " □ " + R.it.post : ""} → ${ansText(R)}`) });
  const judge = R => {
    const it = R.it;
    if (it.o) {
      const v = [...R.sel], want = Array.isArray(it.a) ? it.a : [it.a];
      const good = v.length === want.length && want.every(x => v.includes(x));
      [...R.row.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (R.sel.has(i)) b.classList.add(good ? "good" : "bad"); });
      const wrongOne = v.slice().sort((a, b) => a - b).find(x => !want.includes(x));
      const msg = (wrongOne != null && it.why && it.why[String(wrongOne)]) || (v.length < want.length ? "알맞은 것을 더 골라 봐요." : null);
      return { good, msg, given: v.map(i => it.o[i]).join("·") || "-" };
    }
    const v = mx1Num(R.inp), good = v === it.a;
    mx1Paint(R.inp, good);
    return { good, msg: (it.why && it.why[String(v)]) || null, given: R.inp.value || "-" };
  };
  const full = R => R.it.o ? R.sel.size >= (Array.isArray(R.it.a) ? R.it.a.length : 1) : R.inp.value.trim() !== "";
  const run = () => {
    api.tryOnce();
    const res = rows.map(judge), given = res.map(r => r.given).join(" / ");
    const bad = res.find(r => !r.good);
    if (!bad) { api.done(given, opt.ok); return true; }
    api.fail(bad.msg || opt.bad || "빨간 칸을 다시 생각해 봐요.", given);
    return false;
  };
  auto = autoRun(() => rows.every(full), () => rows.map(R => R.it.o ? [...R.sel].sort((a, b) => a - b).join(".") : R.inp.value.trim()).join("§"), run, rows.some(R => !R.it.o) ? 900 : 260);
  body.append(...rows.map(R => R.box));
}
/* 조작을 마친 뒤 물음으로 이어 가기 (물음이 없으면 바로 api.done) */
function mx1Then(host, api, ask, ok, given) {
  if (!ask || !ask.length) return api.done(given, ok);
  api.hint("○ 좋아요! 이어서 아래 물음에 답해요.");
  const box = h("div", { style: "margin-top:.6em" }); host.append(box);
  mx1Ask(box, api, ask, { ok });
  setTimeout(() => { try { box.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
}

/* ② 계산 순서 나타내기 — 먼저 계산할 기호를 누르고 값을 쓰면 저절로 확인
   items: [{e:"42−17+8", label:"가", first:true(가장 먼저 계산할 부분만)}]  opt: {type:false(값을 저절로), cmp:true(두 식 크기 비교), ok} */
function mx1Order(body, api, items, opt = {}) {
  mx1Style();
  const wrap = h("div"); body.append(wrap);
  const results = [];
  let cur = null;
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
    box.append(h("div", { class: "mx1lab" }, (it.label ? it.label + " · " : (items.length > 1 ? (n + 1) + ". " : "")) + (it.first ? "가장 먼저 계산할 기호를 눌러요" : "먼저 계산할 기호를 차례로 누르고, 그 값을 써요")), st.svgHolder, st.lines);
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
      const auto = autoRun(() => st.inp.value.trim() !== "", () => st.inp.value.trim(), () => check(), 900);
      mx1Hook(st.inp, auto);
      st.lines.append(h("div", { class: "mx1ask mx1cur" }, h("span", {}, `${t[k - 1].v} ${t[k].v} ${t[k + 1].v} =`), st.inp));
      setTimeout(() => { try { if (st.inp.isConnected) st.inp.focus({ preventScroll: true }); } catch (e) { } }, 30);
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
      return api.hint(hasP ? "그 계산도 할 수는 있지만, ( )가 있으면 ( ) 안을 가장 먼저 계산하기로 약속했어요." : "그 계산도 할 수는 있지만, 같은 단계의 계산끼리는 앞에서부터 차례대로 계산하기로 해요.");
    }
    if (st.it.first) {
      const r = mx1Reduce(st.tk, k); st.steps.push(r.step); st.done = true; draw();
      st.lines.append(h("div", { class: "mx1done" }, `○ 가장 먼저 ${r.step.a} ${r.step.o} ${r.step.b}${mx1J(String(r.step.b), "을를").slice(String(r.step.b).length)} 계산해요.`));
      results.push(null);
      return start(st.n + 1);
    }
    if (!typeVals) return apply(k);
    st.pick = k; draw();
    api.hint("고른 계산의 값을 써요. 다 쓰면 저절로 확인해요.");
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
    const st = cur;
    if (!st || st.done || st.pick < 0) return true;
    api.tryOnce();
    const t = st.tk, k = st.pick, a = t[k - 1].v, o = t[k].v, b = t[k + 1].v;
    const want = o === "+" ? a + b : o === "−" ? a - b : o === "×" ? a * b : a / b;
    const v = mx1Num(st.inp);
    mx1Paint(st.inp, v === want);
    if (v !== want) { api.fail(`${a} ${o} ${b}${mx1J(String(b), "을를").slice(String(b).length)} 다시 계산해 봐요.`, `${a}${o}${b}=${st.inp.value}`); return false; }
    api.hint("○ 맞아요. 이어서 계산할 기호를 눌러요.");
    apply(k);
    return true;
  }
  let cmpSel = null;
  function finish() {
    cur = null;
    if (opt.cmp && results.length >= 2) {
      const A = items[0].label || "첫째 식", B = items[1].label || "둘째 식";
      const row = h("div", { class: "opts" });
      const autoC = autoRun(() => cmpSel != null, () => cmpSel, checkCmp, 260);
      [">", "=", "<"].forEach(c => row.append(h("button", { class: "opt", onclick: e => { [...row.children].forEach(x => x.classList.remove("on")); e.currentTarget.classList.add("on"); cmpSel = c; autoC(); } }, c)));
      wrap.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, `두 식의 계산 결과를 비교해요: ${A} ○ ${B}`), row));
      return api.hint("두 식의 계산 결과를 비교해 ○ 안에 알맞은 것을 골라요.");
    }
    api.done(items.map((it, i) => it.first ? mx1S(it.e) + " → " + firstOf(it.e) : `${mx1S(it.e)}=${results[i]}`).join(" / "), opt.ok || "계산 순서를 잘 나타내고 계산했어요!");
  }
  function checkCmp() {
    api.tryOnce();
    const a = results[0], b = results[1], want = a > b ? ">" : a < b ? "<" : "=";
    if (cmpSel !== want) { api.fail(`${a}${mx1J(String(a), "과와").slice(String(a).length)} ${b}의 크기를 비교해 봐요.`, `${a} ${cmpSel || "-"} ${b}`); return false; }
    api.done(items.slice(0, 2).map((it, i) => `${mx1S(it.e)}=${results[i]}`).join(" / ") + ` / ${a} ${want} ${b}`, opt.ok || "( )가 있고 없음에 따라 계산 순서와 결과가 달라져요!");
    return true;
  }
  start(0);
}

/* ③ 하나의 식으로 나타내기 — 물음·식·답을 다 채우면 저절로 확인
   opt: {pic:()=>요소, ask:[{q,a,unit,why}], cards, reuse, atMost, target, paren, prompt, ansQ, unit, noAns, why:{값:"까닭"}, ex:"모범 식", ok} */
function mx1Build(body, api, opt) {
  mx1Style();
  let auto = () => {};
  if (opt.pic) body.append(h("div", { class: "mx1box" }, opt.pic()));
  const rows = mx1AskRows(opt.ask);
  rows.forEach(R => { body.append(R.row); mx1Hook(R.inp, () => auto()); });
  const B = mx1Builder({ cards: opt.cards, reuse: opt.reuse, onChange: () => auto() });
  body.append(h("div", { class: "jua", style: "margin-top:.5em" }, opt.prompt || "수 카드와 기호를 눌러 하나의 식으로 나타내요."), B.el);
  let ansIn = null;
  if (!opt.noAns) { ansIn = mx1Input(opt.ansQ || "답", true); mx1Hook(ansIn, () => auto()); body.append(h("div", { class: "mx1ask" }, h("span", {}, (opt.ansQ || "답") + " "), ansIn, opt.unit ? h("span", {}, opt.unit) : null)); }
  body.append(h("p", { class: "mx1note" }, "물음·식·답을 모두 채우면 저절로 확인해요."));
  const ex = opt.ex ? mx1S(opt.ex) : null;
  api.provide({ words: ["하나의 식", "( )", "앞에서부터 차례대로"], answers: rows.map(R => `${R.it.q} ${R.it.a}`).concat(ex ? [`${ex} = ${opt.target}`] : []).concat(ansIn ? [`${opt.target}${opt.unit ? " " + opt.unit : ""}`] : []) });
  const ready = () => {
    if (!rows.every(R => R.inp.value.trim() !== "")) return false;
    if (ansIn && ansIn.value.trim() === "") return false;
    if (!mx1Complete(B.toks(), opt)) { if (B.toks().length) api.hint("수 카드를 모두 사용해 하나의 식을 끝까지 만들어요."); return false; }
    return true;
  };
  const run = () => {
    api.tryOnce();
    const given = rows.map(R => R.inp.value || "-").concat([mx1Str(B.toks()) || "-"]).concat(ansIn ? [ansIn.value || "-"] : []).join(" / ");
    const m1 = mx1AskCheck(rows); if (m1) { api.fail(m1, given); return false; }
    const m2 = mx1Judge(B.toks(), opt); if (m2) { api.fail(m2, given); return false; }
    if (ansIn) { const v = mx1Num(ansIn), g = v === opt.target; mx1Paint(ansIn, g); if (!g) { api.fail("식은 맞아요. 식을 계산한 값을 답에 써요.", given); return false; } }
    api.done(given, opt.ok || "하나의 식으로 나타내어 구했어요!");
    return true;
  };
  auto = autoRun(ready, () => rows.map(R => R.inp.value.trim()).concat([mx1Str(B.toks()), ansIn ? ansIn.value.trim() : ""]).join("§"), run, 1200);
}

/* ④ ( )로 묶어 목표 수 만들기  items:[{e:"24−18÷2+7", target:10}] — ( )를 다 넣으면 저절로 확인 */
function mx1Paren(body, api, items, opt = {}) {
  mx1Style();
  let auto = () => {};
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
      if (s.a >= 0 && s.b >= 0) { const r = mx1Eval(withP(s)); live.textContent = r.ok && r.int != null && !r.neg ? `( )를 넣은 식을 계산하면 ${r.int}` : "이렇게 묶으면 자연수로 계산되지 않아요."; }
      else live.textContent = s.a >= 0 ? "이제 ) 를 넣을 수를 눌러요." : "( 를 넣을 수를 먼저 눌러요.";
    };
    const tap = k => {
      if (s.a < 0 || s.b >= 0) { s.a = k; s.b = -1; }
      else if (k <= s.a) { s.a = k; }
      else s.b = k;
      draw(); auto();
    };
    s.check = () => { const r = mx1Eval(withP(s)); if (!r.ok || r.neg || r.int !== s.it.target) return `지금 식을 계산하면 ${r.ok && r.int != null && !r.neg ? r.int : "자연수가 아니에요"}. ( )를 다른 곳에 넣어 봐요.`; return null; };
    s.str = () => mx1Str(withP(s));
    box.append(h("div", { class: "mx1lab" }, (items.length > 1 ? (n + 1) + ". " : "") + "수를 눌러 ( )를 넣어요"), line, live,
      h("button", { class: "ghost", onclick: () => { s.a = -1; s.b = -1; draw(); } }, "( ) 지우기"));
    body.append(box); draw();
  });
  auto = autoRun(() => S.every(s => s.a >= 0 && s.b >= 0), () => S.map(s => s.a + "," + s.b).join("/"), () => {
    api.tryOnce();
    for (const s of S) { const m = s.check(); if (m) { api.fail(m, S.map(x => x.str()).join(" / ")); return false; } }
    api.done(S.map(x => x.str() + "=" + x.it.target).join(" / "), opt.ok || "( )를 알맞게 넣었어요!");
    return true;
  }, 1200);
}

/* ⑤ ○ 안에 기호 넣기  items:[{tpl:"72 ○ (6 ○ 2)", ops:["×","÷"], once:true, goal:"min"|"max"|수, calc:true}] — 다 채우면 저절로 확인 */
function mx1Ops(body, api, items, opt = {}) {
  mx1Style();
  let auto = () => {};
  const perms = (arr, k, once) => {
    const out = [];
    const rec = (cur) => { if (cur.length === k) { if (!once || (k === arr.length && new Set(cur).size === k)) out.push(cur.slice()); return; } arr.forEach(o => { cur.push(o); rec(cur); cur.pop(); }); };
    rec([]); return out;
  };
  const fill = (tpl, os) => { let i = 0; return tpl.replace(/○/g, () => os[i++]); };
  const S = items.map(it => {
    const k = (it.tpl.match(/○/g) || []).length;
    const all = perms(it.ops, k, it.once).map(os => { const r = mx1Eval(mx1Tok(fill(it.tpl, os))); return { os, v: r.ok && !r.neg ? r.int : null }; }).filter(x => x.v != null);
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
        if (part === "○") { const j = i++; line.append(h("button", { class: "mx1op" + (s.sel[j] ? " mx1pick" : ""), "aria-label": "기호 칸", onclick: () => { const o = s.it.ops, c = s.sel[j]; s.sel[j] = c == null ? o[0] : (o.indexOf(c) + 1 < o.length ? o[o.indexOf(c) + 1] : null); draw(); auto(); } }, s.sel[j] || "○")); }
        else if (part.trim()) line.append(h("span", { class: "mx1tk" }, part.trim()));
      });
      if (typeof s.it.goal === "number") line.append(h("span", { class: "mx1tk" }, "= " + s.it.goal));
    };
    draw();
    box.append(h("div", { class: "mx1lab" }, (items.length > 1 ? (n + 1) + ". " : "") + (s.it.goal === "min" ? "계산 결과가 가장 작게" : s.it.goal === "max" ? "계산 결과가 가장 크게" : `계산 결과가 ${s.it.goal}${mx1J(String(s.it.goal), "이가").slice(String(s.it.goal).length)} 되게`) + ` ○를 눌러 ${s.it.ops.join(", ")}를 넣어요${s.it.once ? "(한 번씩)" : ""}. 누를 때마다 기호가 바뀌어요.`), line);
    if (s.it.calc) { s.inp = mx1Input("계산 결과"); mx1Hook(s.inp, () => auto()); box.append(h("div", { class: "mx1ask" }, h("span", {}, "만든 식을 계산하면"), s.inp)); }
    body.append(box);
  });
  auto = autoRun(() => S.every(s => !s.sel.some(x => !x) && (!s.inp || s.inp.value.trim() !== "")), () => S.map(s => s.sel.join(",") + (s.inp ? "=" + s.inp.value.trim() : "")).join("/"), () => {
    api.tryOnce();
    const given = S.map(s => s.sel.map(x => x || "○").join(",") + (s.inp ? "=" + s.inp.value : "")).join(" / ");
    for (const s of S) {
      if (s.it.once && new Set(s.sel).size !== s.sel.length) { api.fail(`${s.it.ops.join(", ")}를 한 번씩 써요.`, given); return false; }
      const r = mx1Eval(mx1Tok(fill(s.it.tpl, s.sel))), v = r.ok && !r.neg ? r.int : null;
      if (!s.best.some(b => b.os.join() === s.sel.join())) {
        if (v == null) { api.fail("이렇게 넣으면 자연수로 계산되지 않아요. 다른 기호를 넣어 봐요.", given); return false; }
        if (s.it.goal === "min") { api.fail(`지금 식의 계산 결과는 ${v}${mx1J(String(v), "이에요").slice(String(v).length)}. 더 작게 만들 수 있어요. 나누는 수는 크게, 곱하는 수는 작게 해 봐요.`, given); return false; }
        if (s.it.goal === "max") { api.fail(`지금 식의 계산 결과는 ${v}${mx1J(String(v), "이에요").slice(String(v).length)}. 더 크게 만들 수 있어요.`, given); return false; }
        api.fail(`지금 식을 계산하면 ${v}${mx1J(String(v), "이에요").slice(String(v).length)}. 계산 순서를 생각하며 다른 기호를 넣어 봐요.`, given); return false;
      }
      if (s.inp) { const x = mx1Num(s.inp), g = x === v; mx1Paint(s.inp, g); if (!g) { api.fail("기호는 알맞게 넣었어요. 만든 식을 계산 순서에 맞게 계산해 써요.", given); return false; } }
    }
    api.done(given, opt.ok || "기호를 알맞게 넣었어요!");
    return true;
  }, 1200);
}

/* ⑥ □ 안에 수 카드 넣기  opt:{tpl:"□×(□+□)−28÷7", cards:[5,9,3], goal:"min"|"max", ok} — 다 채우면 저절로 확인 */
function mx1Slots(body, api, opt) {
  mx1Style();
  let auto = () => {};
  const k = (opt.tpl.match(/□/g) || []).length;
  const fill = arr => { let i = 0; return opt.tpl.replace(/□/g, () => arr[i++]); };
  const perm = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perm(a.slice(0, i).concat(a.slice(i + 1))).map(p => [x].concat(p)));
  const all = perm(opt.cards).map(p => ({ p, v: mx1Val(fill(p)) })).filter(x => x.v != null && x.v >= 0);
  const m = opt.goal === "max" ? Math.max(...all.map(x => x.v)) : Math.min(...all.map(x => x.v));
  const best = all.filter(x => x.v === m);
  const sel = Array(k).fill(null);
  const box = h("div", { class: "mx1box" }), line = h("div", { class: "mx1line" }), tray = h("div", { class: "mx1keys" });
  api.provide({ words: ["곱하는 수", opt.goal === "max" ? "가장 큰 수" : "가장 작은 수"], answers: [`${mx1S(fill(best[0].p))} = ${m}`] });
  const draw = () => {
    line.innerHTML = ""; let i = 0;
    opt.tpl.split(/(□)/).forEach(part => {
      if (part === "□") { const j = i++; line.append(h("button", { class: "mx1op" + (sel[j] != null ? " mx1pick" : ""), "aria-label": "수 칸", onclick: () => { sel[j] = null; draw(); } }, sel[j] != null ? String(opt.cards[sel[j]]) : "□")); }
      else if (part) line.append(h("span", { class: "mx1tk" }, part.trim()));
    });
    tray.innerHTML = "";
    opt.cards.forEach((c, ci) => tray.append(h("button", { class: "mx1card", disabled: sel.includes(ci), onclick: () => { const j = sel.indexOf(null); if (j >= 0) { sel[j] = ci; draw(); auto(); } } }, String(c))));
  };
  draw();
  const inp = mx1Input("계산 결과"); mx1Hook(inp, () => auto());
  box.append(h("div", { class: "mx1lab" }, `수 카드를 눌러 □ 안에 한 번씩 넣어 계산 결과가 가장 ${opt.goal === "max" ? "크게" : "작게"} 만들어요(넣은 수를 누르면 빠져요)`), line, tray,
    h("div", { class: "mx1ask" }, h("span", {}, "만든 식을 계산하면"), inp));
  body.append(box);
  auto = autoRun(() => !sel.includes(null) && inp.value.trim() !== "", () => sel.join(",") + "=" + inp.value.trim(), () => {
    api.tryOnce();
    const given = sel.map(x => opt.cards[x]).join(",") + "=" + inp.value;
    const p = sel.map(x => opt.cards[x]), v = mx1Val(fill(p));
    if (v !== m) { api.fail(`이 식의 계산 결과는 ${v}${mx1J(String(v), "이에요").slice(String(v).length)}. 더 ${opt.goal === "max" ? "크게" : "작게"} 만들 수 있어요. 곱하는 수를 생각해 봐요.`, given); return false; }
    const x = mx1Num(inp), g = x === v; mx1Paint(inp, g);
    if (!g) { api.fail("수 카드는 알맞게 넣었어요. 계산 순서에 맞게 계산해 써요.", given); return false; }
    api.done(given, opt.ok || `가장 ${opt.goal === "max" ? "큰" : "작은"} 계산 결과를 찾았어요!`);
    return true;
  }, 1200);
}

/* ⑦ 관계있는 것끼리 선 잇기  opt:{left:["15+18−7",…], right:[19,26,18]} (값은 코드가 계산) — 다 이으면 저절로 확인 */
function mx1Match(body, api, opt) {
  mx1Style();
  let auto = () => {};
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
      g.addEventListener("click", () => { if (pick == null) return api.hint("왼쪽 식을 먼저 눌러요."); link.forEach((x, i) => { if (x === j) link[i] = null; }); link[pick] = j; pick = null; draw(); auto(); });
      svg.append(g);
    });
  };
  draw();
  api.provide({ words: ["계산 순서"], answers: L.map(l => `${l.s} → ${l.v}`) });
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "왼쪽 식을 누르고, 계산 결과를 오른쪽에서 눌러 이어요. 모두 이으면 저절로 확인해요."), svg));
  auto = autoRun(() => link.every(x => x != null), () => link.join(","), () => {
    api.tryOnce();
    const given = L.map((l, i) => `${l.s}→${R[link[i]]}`).join(" / ");
    const bad = L.findIndex((l, i) => R[link[i]] !== l.v);
    if (bad >= 0) { api.fail(`식 ${L[bad].s}의 계산 순서를 다시 살펴보고 계산해 봐요.`, given); return false; }
    api.done(given, opt.ok || "모두 알맞게 이었어요!");
    return true;
  }, 1200);
}

/* ⑧ 두 활동을 차례로: mx1Chain(b, a, [(b,a)=>…, (b,a)=>…])  (마지막 활동이 끝나면 api.done( 을 불러요) */
function mx1Chain(body, api, fns) {
  let n = 0; const ans = [];
  const next = () => {
    const part = h("div"); body.append(part);
    const last = n === fns.length - 1;
    const sub = Object.assign({}, api, {
      done: (a, m, lv) => {
        ans.push(a);
        if (last) return api.done(ans.join(" | "), m, lv);
        api.hint("○ " + (m || "좋아요!") + " 이어서 아래 문제를 풀어요.");
        n++; next();
        setTimeout(() => { try { body.lastChild.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 50);
      }
    });
    fns[n](part, sub);
  };
  next();
}

/* ⑨ 문장 순서를 정하여 문제 만들기  opt:{start, first:{k,t}, cards:[{k,t,f(값)→값|null}], nums, ask, unit, bad, ex} */
function mx1Story(body, api, opt) {
  mx1Style();
  let auto = () => {};
  const order = [];
  const list = h("div", { class: "mx1sent" }), show = h("div", { class: "mx1box" }), work = h("div");
  const calc = () => { let v = opt.start; for (const i of order) { v = opt.cards[i].f(v); if (v == null) return null; } return v; };
  let B = null, ansIn = null, target = null;
  const draw = () => {
    list.innerHTML = "";
    opt.cards.forEach((c, i) => list.append(h("button", { class: "opt" + (order.includes(i) ? " on" : ""), disabled: order.includes(i), onclick: () => { order.push(i); draw(); } }, `${c.k} ${c.t}`)));
    show.innerHTML = "";
    show.append(h("div", { class: "mx1lab" }, "내가 만든 문제"), h("p", {}, [opt.first.t].concat(order.map(i => opt.cards[i].t)).join(" ") + (order.length === opt.cards.length ? " " + opt.ask : "")),
      h("div", { class: "mx1note" }, "순서: " + [opt.first.k].concat(order.map(i => opt.cards[i].k)).join(" → ")));
    work.innerHTML = ""; B = null; ansIn = null; target = null;
    if (order.length === opt.cards.length) {
      const v = calc();
      if (v == null) { work.append(h("p", { class: "mx1note", style: "color:var(--no)" }, opt.bad || "이 순서로는 문제가 되지 않아요. ‘다시 정하기’를 눌러 다른 순서로 해 봐요.")); return; }
      target = v;
      B = mx1Builder({ cards: opt.nums, onChange: () => auto() });
      ansIn = mx1Input("답", true); mx1Hook(ansIn, () => auto());
      work.append(h("div", { class: "jua" }, "이 문제를 하나의 식으로 나타내고 답을 써요. 다 채우면 저절로 확인해요."), B.el, h("div", { class: "mx1ask" }, h("span", {}, "답 "), ansIn, h("span", {}, opt.unit)));
    }
  };
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, `${opt.first.k} ${opt.first.t} 뒤에 올 문장을 차례로 눌러요`), list, h("button", { class: "ghost", onclick: () => { order.length = 0; draw(); } }, "다시 정하기")), show, work);
  draw();
  api.provide({ words: ["문장의 순서", "( )"], answers: [opt.ex] });
  auto = autoRun(() => B != null && ansIn != null && ansIn.value.trim() !== "" && mx1Complete(B.toks(), { cards: opt.nums }), () => order.join("") + "|" + mx1Str(B.toks()) + "|" + ansIn.value.trim(), () => {
    api.tryOnce();
    const given = order.map(i => opt.cards[i].k).join("") + " / " + mx1Str(B.toks()) + " / " + ansIn.value;
    const m = mx1Judge(B.toks(), { cards: opt.nums, target }); if (m) { api.fail(m, given); return false; }
    const v = mx1Num(ansIn), g = v === target; mx1Paint(ansIn, g);
    if (!g) { api.fail("식은 맞아요. 식을 계산한 값을 답에 써요.", given); return false; }
    api.done(given, `문제를 만들고 하나의 식으로 나타내어 ${target}${opt.unit}을 구했어요. 문장의 순서가 달라지면 문제와 답도 달라져요!`);
    return true;
  }, 1200);
}

/* ⑩ 조건을 골라 문제 만들기  opt:{tags:[[이름,값]…], groups:[[{n,p,k}]…], sentence(A,C)→글, target(A,C)→수, cards(A,C)→[…], unit, ex, ok(값)} */
function mx1Shop(body, api, opt) {
  mx1Style();
  let auto = () => {};
  const pick = opt.groups.map(() => null);
  const rows = opt.groups.map((g, gi) => {
    const r = h("div", { class: "opts" });
    g.forEach((o, oi) => r.append(h("button", { class: "opt", onclick: e => { pick[gi] = oi; [...r.children].forEach(x => x.classList.remove("on")); e.currentTarget.classList.add("on"); draw(); } }, o.n)));
    return r;
  });
  const sent = h("p", { class: "sent" }), work = h("div");
  let B = null, ansIn = null, target = null, cards = null;
  const draw = () => {
    const sel = pick.map((p, gi) => p == null ? null : opt.groups[gi][p]);
    sent.textContent = opt.sentence(...sel);
    work.innerHTML = ""; B = null; ansIn = null;
    if (sel.includes(null)) return;
    target = opt.target(...sel); cards = opt.cards(...sel);
    B = mx1Builder({ cards, onChange: () => auto() });
    ansIn = mx1Input(opt.ansQ || "답", true); mx1Hook(ansIn, () => auto());
    work.append(h("div", { class: "jua" }, "수 카드와 기호로 하나의 식을 만들고 답을 써요. 다 채우면 저절로 확인해요."), B.el, h("div", { class: "mx1ask" }, h("span", {}, (opt.ansQ || "답") + " "), ansIn, h("span", {}, opt.unit)));
  };
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "가격표"), mx1Tags(opt.tags)), h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "조건을 하나씩 골라요"), ...rows, sent), work);
  draw();
  api.provide({ words: ["거스름돈", "( )"], answers: [opt.ex] });
  auto = autoRun(() => B != null && ansIn.value.trim() !== "" && mx1Complete(B.toks(), { cards }), () => pick.join(",") + "|" + mx1Str(B.toks()) + "|" + ansIn.value.trim(), () => {
    api.tryOnce();
    const given = pick.map((p, gi) => opt.groups[gi][p].n).join("+") + ` / ${mx1Str(B.toks())} / ${ansIn.value}`;
    const m = mx1Judge(B.toks(), { cards, target, paren: opt.paren }); if (m) { api.fail(m, given); return false; }
    const v = mx1Num(ansIn), g = v === target; mx1Paint(ansIn, g);
    if (!g) { api.fail("식은 맞아요. 식을 계산한 값을 답에 써요.", given); return false; }
    api.done(given, opt.ok(target));
    return true;
  }, 1200);
}

/* ⑪ 간식 바구니 꾸리기(예산)  opt:{items:[{n,c,u,w}], fixed:{이름:개수}, limit, ok} — 물건마다 하나의 식과 값, 모두 얼마
   (모두 채우면 저절로 확인하고 api.done( 을 불러요) */
function mx1Basket(body, api, opt) {
  mx1Style();
  let auto = () => {};
  const IT = opt.items, unitW = opt.money ? "원" : "g";
  const cnt = {}; IT.forEach(it => cnt[it.n] = (opt.fixed && opt.fixed[it.n]) || 0);
  const rowsBox = h("div"), totIn = mx1Input("모두", true), ins = {};
  mx1Hook(totIn, () => auto());
  const grid = h("div", { class: "mx1bag" });
  let lastIn = null;
  const each = it => it.w / it.c;
  const drawRows = () => {
    rowsBox.innerHTML = "";
    IT.filter(it => cnt[it.n] > 0).forEach(it => {
      const k = cnt[it.n];
      if (!ins[it.n]) {
        ins[it.n] = { ex: h("input", { type: "text", class: "mx1ex", autocomplete: "off", "aria-label": it.n + " 값 식", placeholder: `예: ${it.w}÷${it.c}×${k}` }), w: mx1Input(it.n + " 값", true) };
        ins[it.n].ex.addEventListener("focus", () => lastIn = ins[it.n].ex);
        mx1Hook(ins[it.n].ex, () => auto()); mx1Hook(ins[it.n].w, () => auto());
      }
      rowsBox.append(h("div", { class: "mx1ask" }, h("span", { style: "min-width:7.5em" }, `${it.n} ${k}${it.u}:`), ins[it.n].ex, h("span", {}, "="), ins[it.n].w, h("span", {}, unitW)));
    });
    if (!rowsBox.children.length) rowsBox.append(h("p", { class: "mx1note" }, "위에서 넣을 물건의 개수를 정해요."));
  };
  if (!opt.fixed) IT.forEach(it => {
    const num = h("span", { class: "jua" }, "0"), card = h("div", { class: "mx1item" });
    const set = d => { cnt[it.n] = Math.max(0, Math.min(it.max || it.c * 2, cnt[it.n] + d)); num.textContent = cnt[it.n]; card.classList.toggle("mx1on", cnt[it.n] > 0); drawRows(); };
    card.append(h("b", {}, it.n), h("div", {}, `${it.c}${it.u}에 ${it.w}${unitW}`), h("div", { class: "mx1cnt" }, h("button", { class: "ghost", "aria-label": it.n + " 빼기", onclick: () => set(-1) }, "−"), num, h("button", { class: "ghost", "aria-label": it.n + " 더하기", onclick: () => set(1) }, "+"), h("span", {}, it.u)));
    grid.append(card);
  });
  drawRows();
  const keys = h("div", { class: "mx1keys" }, ...["×", "÷", "+", "−", "(", ")"].map(s => h("button", { class: "mx1sym", onmousedown: e => e.preventDefault(), onclick: () => { if (!lastIn) return api.hint("먼저 식 칸을 눌러요."); lastIn.value += s; lastIn.focus(); } }, s)));
  const table = () => { const t = h("table", { class: "mx1tbl" }, h("tr", {}, h("th", {}, "물건"), h("th", {}, "묶음"), h("th", {}, "값"))); IT.forEach(it => t.append(h("tr", {}, h("td", {}, it.n), h("td", {}, it.c + it.u), h("td", {}, it.w + unitW)))); return h("div", { style: "overflow-x:auto;max-width:100%" }, t); };
  if (opt.fixed) body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, opt.title || "가격표"), table()));
  else body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "넣을 물건의 개수를 + − 로 정해요"), grid));
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "물건마다 값을 하나의 식으로 나타내고 구해요"), rowsBox, h("div", { class: "mx1note" }, "기호 단추는 식 칸에 써져요(키보드의 * / 도 돼요). 모두 채우면 저절로 확인해요."), keys,
    h("div", { class: "mx1ask" }, h("span", {}, opt.totQ || "모두"), totIn, h("span", {}, unitW))));
  const ans = () => IT.filter(it => cnt[it.n] > 0).map(it => `${it.n} ${cnt[it.n]}${it.u}: ${it.w}${it.c > 1 ? " ÷ " + it.c : ""}${cnt[it.n] > 1 ? " × " + cnt[it.n] : ""} = ${each(it) * cnt[it.n]}`);
  api.provide({ words: ["1개의 값", "묶음의 값 ÷ 묶음의 개수"], answers: opt.fixed ? ans().concat([`모두 ${IT.reduce((s, it) => s + each(it) * cnt[it.n], 0)}${unitW}`]) : [] });
  const chosen = () => IT.filter(it => cnt[it.n] > 0);
  auto = autoRun(() => chosen().length > 0 && chosen().every(it => ins[it.n].ex.value.trim() !== "" && ins[it.n].w.value.trim() !== "") && totIn.value.trim() !== "",
    () => chosen().map(it => `${it.n}${cnt[it.n]}:${ins[it.n].ex.value.trim()}=${ins[it.n].w.value.trim()}`).join("/") + "|" + totIn.value.trim(), () => {
    api.tryOnce();
    const ch = chosen();
    const given = ch.map(it => `${it.n}${cnt[it.n]}:${ins[it.n].ex.value}=${ins[it.n].w.value}`).join(" / ") + ` / 모두 ${totIn.value}`;
    let sum = 0;
    for (const it of ch) {
      const k = cnt[it.n], want = each(it) * k, I = ins[it.n]; sum += want;
      const tk = mx1Tok(I.ex.value), r = tk ? mx1Eval(tk) : { ok: false, err: "식에 쓸 수 없는 글자가 있어요." };
      const simple = it.c === 1 && k === 1;
      if (!r.ok) { mx1Paint(I.ex, false); api.fail(`${it.n}: ${r.err}`, given); return false; }
      if (r.int !== want) { mx1Paint(I.ex, false); api.fail(`${it.n} ${k}${it.u}의 식을 다시 살펴봐요. 먼저 ${it.n} 1${it.u}의 값을 ${it.w} ÷ ${it.c}${mx1J(String(it.c), "으로").slice(String(it.c).length)} 구할 수 있어요.`, given); return false; }
      if (!simple && !tk.some(t => t.t === "n" && t.v === it.w)) { mx1Paint(I.ex, false); api.fail(`${it.n} 묶음의 값 ${it.w}${unitW}을 사용한 하나의 식으로 나타내요.`, given); return false; }
      mx1Paint(I.ex, true);
      const v = mx1Num(I.w), g = v === want; mx1Paint(I.w, g);
      if (!g) { api.fail(`${it.n}의 식은 맞아요. 식을 계산한 값을 써요.`, given); return false; }
    }
    const t = mx1Num(totIn), g = t === sum; mx1Paint(totIn, g);
    if (!g) { api.fail("물건들의 값을 모두 더해 봐요.", given); return false; }
    if (opt.limit && sum > opt.limit) { api.fail(`모두 ${sum}${unitW}이라 ${opt.limit}${unitW}보다 많아요. 물건을 빼거나 값이 싼 물건으로 바꿔 봐요.`, given); return false; }
    api.done(given, opt.ok ? opt.ok.replace("{sum}", sum).replace("{left}", (opt.limit || 0) - sum) : `모두 ${sum}${unitW}이에요.`);
    return true;
  }, 900);
}

/* ⑫ 버스 자리 그림: 무리를 눌러 태우기 → 물음  opt:{seats:45, groups:[{n:"학생",k:26,col}], ask, ok}  (끝나면 mx1Then이 api.done( 을 불러요) */
function mx1Bus(body, api, opt) {
  mx1Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 모두 태우면 mx1Then·mx1Ask가 api.done( 을 불러요 */
  const N = opt.seats, on = opt.groups.map(() => false);
  const cols = 4, rowsN = Math.ceil((N - 5) / cols), W = 150 + (rowsN + 1) * 52 + 40, H = 300;
  const svg = makeSvg(W, H); svg.classList.add("mx1svg"); svg.style.maxWidth = W + "px";
  const seatXY = []; for (let r = 0; r < rowsN; r++) for (let c = 0; c < cols; c++) seatXY.push([150 + r * 52, 40 + c * 52 + (c >= 2 ? 30 : 0)]);
  for (let c = 0; seatXY.length < N; c++) seatXY.push([150 + rowsN * 52, 40 + c * 47]);
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 20, y: 14, width: W - 40, height: H - 28, rx: 30, fill: "#FFF7E6", stroke: "#E9A23B", "stroke-width": 4 }));
    svg.append(svgEl("rect", { x: 34, y: 36, width: 80, height: 70, rx: 10, fill: "#DCEAFB", stroke: "#7AA7D9", "stroke-width": 2 }));
    svg.append(txt(74, 130, "운전석", 18, { fill: "#7A6B5F" }));
    let k = 0; const fillCol = [];
    opt.groups.forEach((g, gi) => { if (on[gi]) for (let i = 0; i < g.k; i++) fillCol[k++] = g.col; });
    seatXY.slice(0, N).forEach(([x, y], i) => svg.append(svgEl("rect", { x, y, width: 40, height: 40, rx: 8, fill: fillCol[i] || "#fff", stroke: "#8A7F74", "stroke-width": 1.5 })));
  };
  draw();
  const btns = h("div", { class: "opts" });
  opt.groups.forEach((g, gi) => btns.append(h("button", { class: "opt", onclick: e => {
    if (on[gi]) return; on[gi] = true; e.currentTarget.classList.add("on"); e.currentTarget.disabled = true; draw();
    if (on.every(Boolean)) mx1Then(body, api, opt.ask, opt.ok, "모두 태움");
  } }, h("span", { style: `display:inline-block;width:.9em;height:.9em;border-radius:.2em;background:${g.col};margin-right:.3em;vertical-align:-.1em` }), `${g.n} ${g.k}명 태우기`)));
  api.provide({ words: ["빈자리", "( )"], answers: (opt.ask || []).map(R => `${R.q} ${R.a}`) });
  body.append(h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, `${N}인승 버스예요. 단추를 눌러 사람들을 자리에 태워 봐요`), btns, svg));
}

/* ⑬ 빙고 놀이판 만들기 — 16칸을 다 채우면 저절로 확인(api.done() */
const MX1_EX_BOARD = [9, 15, 5, 1, 12, 23, 4, 20, 21, 8, 22, 11, 3, 17, 16, 25];
let MX1_BOARD = null;
function mx1LoadBoard() {
  if (MX1_BOARD) return MX1_BOARD;
  try { const b = JSON.parse(localStorage.getItem("s51-mixcalc-board") || "null"); if (Array.isArray(b) && b.length === 16) MX1_BOARD = b; } catch (e) { }
  return MX1_BOARD;
}
function mx1BoardMake(body, api) {
  mx1Style();
  const cells = Array(16).fill(null);
  const grid = h("div", { class: "mx1grid" }), pal = h("div", { class: "mx1pal" });
  const auto = autoRun(() => !cells.includes(null), () => cells.join(","), () => {
    api.tryOnce();
    MX1_BOARD = cells.slice();
    try { localStorage.setItem("s51-mixcalc-board", JSON.stringify(MX1_BOARD)); } catch (e) { }
    api.done(cells.join(","), "놀이판을 완성했어요! 이어지는 계단에서 이 놀이판으로 빙고 놀이를 해요.");
    return true;
  }, 1200);
  const draw = () => {
    grid.innerHTML = ""; pal.innerHTML = "";
    cells.forEach((v, i) => grid.append(h("button", { "aria-label": "놀이판 칸", onclick: () => { cells[i] = null; draw(); } }, v == null ? "​" : String(v))));
    for (let n = 1; n <= 25; n++) pal.append(h("button", { disabled: cells.includes(n), onclick: () => { const j = cells.indexOf(null); if (j < 0) return api.hint("놀이판이 다 찼어요. 바꾸려면 칸을 눌러 비워요."); cells[j] = n; draw(); auto(); } }, String(n)));
  };
  draw();
  body.append(h("div", { class: "mx1flex" },
    h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "1부터 25까지의 수"), pal),
    h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, "내 놀이판(칸을 누르면 비워져요)"), grid,
      h("button", { class: "ghost", onclick: () => { const r = []; for (let n = 1; n <= 25; n++) r.push(n); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } r.slice(0, 16).forEach((v, i) => cells[i] = v); draw(); auto(); } }, "아무렇게나 채우기"))));
  body.append(h("p", { class: "mx1note" }, "16칸을 모두 채우면 저절로 저장돼요."));
  api.provide({ words: ["1부터 25까지", "16개", "한 번씩"], answers: [] });
}
/* ⑭ 빙고 놀이 — 여러 식을 내 보는 것이 놀이 자체라서 '이 식 내기' 단추를 둬요  opt:{goal:줄 수, ok} */
function mx1Bingo(body, api, opt) {
  mx1Style();
  const board = (mx1LoadBoard() || MX1_EX_BOARD).slice(), hit = Array(16).fill(false);
  const draw3 = () => [0, 0, 0].map(() => 1 + Math.floor(Math.random() * 9));
  let cards = draw3();
  const grid = h("div", { class: "mx1grid" }), cardRow = h("div", { class: "mx1big" }), info = h("div", { class: "mx1live" }), bwrap = h("div");
  const log = h("div", { class: "mx1note" });
  let B;
  const drawBoard = () => {
    const lines = mx1Lines(hit), onLine = new Set(lines.flat());
    grid.innerHTML = "";
    board.forEach((v, i) => grid.append(h("button", { class: hit[i] ? (onLine.has(i) ? "mx1lin" : "mx1hit") : "", disabled: true, style: "opacity:1;cursor:default" }, String(v))));
    info.textContent = `색칠한 줄: ${lines.length}줄 / ${opt.goal}줄`;
  };
  const newCards = () => { cards = draw3(); cardRow.textContent = "뒤집은 수 카드: " + cards.join("  "); bwrap.innerHTML = ""; B = mx1Builder({ cards, reuse: true }); bwrap.append(B.el); };
  newCards(); drawBoard();
  body.append(h("div", { class: "mx1flex" },
    h("div", { class: "mx1box" }, h("div", { class: "mx1lab" }, mx1LoadBoard() ? "내 놀이판" : "놀이판(예시)"), grid, info),
    h("div", { class: "mx1box", style: "flex:1 1 18em" }, cardRow, h("div", { class: "mx1note" }, "카드를 모두 사용해요(같은 수를 여러 번 써도 돼요). +, −, ×, ÷ 중 서로 다른 2가지 이상을 쓰고, 필요하면 ( )도 써요."), bwrap,
      h("div", { class: "mx1keys" }, h("button", { class: "mx1sym", onclick: () => submit() }, "이 식 내기"), h("button", { onclick: () => { newCards(); api.hint("수 카드를 다시 섞어 3장을 뒤집었어요."); } }, "카드 다시 뽑기")), log)));
  api.provide({ words: ["계산 순서", "서로 다른 2가지 기호"], answers: [] });
  const submit = () => {
    api.tryOnce();
    const tk = B.toks(), s = mx1Str(tk) || "-";
    const r = mx1Eval(tk);
    if (!r.ok) return api.fail(r.err, s);
    const used = tk.filter(t => t.t === "n").map(t => t.v);
    if (cards.some(c => !used.includes(c))) return api.fail("뒤집은 수 카드를 모두 사용해요.", s);
    if (new Set(tk.filter(t => t.t === "o").map(t => t.v)).size < 2) return api.fail("+, −, ×, ÷ 중에서 서로 다른 2가지를 사용해야 해요.", s);
    if (r.neg || r.frac || r.int == null) return api.fail("계산 중에 작은 수에서 큰 수를 빼거나 나누어떨어지지 않는 곳이 있어요.", s);
    const i = board.findIndex((v, k) => v === r.int && !hit[k]);
    if (i < 0) { api.hint(board.includes(r.int) ? `${s} = ${r.int}. 이미 색칠한 수예요. 다른 식을 만들어 봐요.` : `${s} = ${r.int}. 놀이판에 ${r.int}${mx1J(String(r.int), "이가").slice(String(r.int).length)} 없어요. 다른 식을 만들거나 카드를 다시 뽑아요.`); return; }
    hit[i] = true; drawBoard();
    log.prepend(h("div", {}, `${s} = ${r.int} 색칠!`));
    const n = mx1Lines(hit).length;
    if (n >= opt.goal) return api.done(`${n}줄 빙고`, opt.ok || "빙고! 계산 순서에 맞게 정확히 계산했어요!");
    api.hint(`○ ${s} = ${r.int}. ${r.int}${mx1J(String(r.int), "을를").slice(String(r.int).length)} 색칠했어요. 새 카드로 이어서 해요.`);
    newCards();
  };
}

/* ===== 이야기 버전 그림 ===== */
/* 계획단 쪽지 */
function mx1sNote(title, lines) {
  return h("div", { class: "mx1box", style: "background:#FFFBEF" }, h("div", { class: "mx1lab" }, title), ...lines.map(l => h("div", { style: "margin:.15em 0" }, "· " + l)));
}
/* 한 줄 길 그림: pts:[[거리, 이름]…], br:[[a,b,"글", 위?]…] */
function mx1sRoad(pts, br) {
  const max = Math.max(...pts.map(p => p[0])), sc = 760 / max, X = d => 50 + d * sc;
  const svg = makeSvg(860, 240); svg.classList.add("mx1svg"); svg.style.maxWidth = "860px";
  svg.append(svgEl("line", { x1: X(0), y1: 125, x2: X(max), y2: 125, stroke: "#8A7F74", "stroke-width": 6, "stroke-linecap": "round" }));
  pts.forEach(([d, n]) => { svg.append(svgEl("circle", { cx: X(d), cy: 125, r: 9, fill: "#2F6B57" })); svg.append(txt(X(d), 150, n, 20)); });
  br.forEach(([a, b, t, up], i) => {
    const y = up ? (i % 2 ? 40 : 85) : 195, d = up ? 1 : -1;
    svg.append(svgEl("path", { d: `M${X(a)} ${y + 12 * d} V${y} H${X(b)} V${y + 12 * d}`, fill: "none", stroke: "#E47A38", "stroke-width": 2.5 }));
    svg.append(txt((X(a) + X(b)) / 2, y - 12 * d, t, 20, { fill: "#C0571C" }));
  });
  return svg;
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 현장 체험 학습 계획단", lines: [
  "솔빛초등학교 5학년 3반은 다음 달에 ‘별빛 과학관’으로 현장 체험 학습을 가요. 반장 지우와 도윤, 서하, 민준, 하린이가 ‘체험 학습 계획단’이 되었어요.",
  "버스 빈자리, 모둠 나누기, 영상관 표값, 간식 나누기, 모둠 간식비와 거스름돈까지 — 계획단은 덧셈, 뺄셈, 곱셈, 나눗셈이 섞인 상황을 하나의 식으로 나타내고 계산 순서를 정해요.",
  "모둠 간식 바구니를 예산 안에서 꾸리고, 버스 안에서 혼합 계산 빙고를 한 뒤, 체험 학습을 다녀온 날 배운 것을 발표해요."],
  one: "우리 반 현장 체험 학습 계획단 · 하나의 식으로 나타내고, 계산하는 순서를 지켜 혼합 계산을 해요." };
const UNIT_KEYWORDS = ["혼합 계산", "계산 순서", "앞에서부터 차례대로", "( ) 안을 먼저", "( ) 안을 가장 먼저", "곱셈을 먼저", "나눗셈을 먼저", "곱셈과 나눗셈을 먼저", "하나의 식", "괄호", "계산 결과 비교", "거스름돈", "예산", "빙고"];

/* ===== 1. 자연수의 혼합 계산 — 이야기 버전 (10차시) ===== */
const MXV = e => mx1Val(e);
const MX1_SNACK = [
  { n: "생수", c: 6, u: "병", w: 3000, max: 8 }, { n: "주스", c: 4, u: "병", w: 3600, max: 8 }, { n: "귤", c: 10, u: "개", w: 3000, max: 8 },
  { n: "바나나", c: 5, u: "개", w: 2500, max: 8 }, { n: "과자", c: 3, u: "봉지", w: 4500, max: 8 }, { n: "주먹밥", c: 2, u: "개", w: 3000, max: 8 },
  { n: "김밥", c: 1, u: "줄", w: 3500, max: 4 }, { n: "젤리", c: 8, u: "개", w: 4000, max: 8 }, { n: "물티슈", c: 1, u: "개", w: 1200, max: 2 }, { n: "쿠키", c: 12, u: "개", w: 3600, max: 8 }];
const MX1_FIX = { "생수": 4, "주먹밥": 4, "귤": 4, "과자": 2 };
const MX1_FIXSUM = MX1_SNACK.reduce((s, it) => s + (MX1_FIX[it.n] ? it.w / it.c * MX1_FIX[it.n] : 0), 0);
const LESSONS = [
{
  id: "s1", no: 1, title: "현장 체험 학습 계획단이 모였어요", soop: "개념 찾기(S)",
  question: "체험 학습을 계획할 때 여러 가지 계산이 섞인 식은 어떤 순서로 계산해야 할까요?",
  summary: "체험 학습을 계획하다 보면 덧셈, 뺄셈, 곱셈, 나눗셈이 섞인 상황이 많아요. 45 − 26 + 2와 45 − (26 + 2)처럼 같은 수와 기호라도 계산하는 순서가 달라지면 결과가 달라질 수 있어서, 이 단원에서 계산 순서를 배워요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "반장 지우가 계획단 회의에 ‘체험 학습 준비 쪽지’를 가져왔어요. 쪽지를 보고 세 칸에 써서 붙여요.", hints: ["쪽지에서 수가 나오는 곳을 찾아봐요.", "더하고, 빼고, 곱하고, 나누는 일이 어디에 있는지 찾아봐요."],
      render: (b, a) => { b.append(mx1sNote("📋 별빛 과학관 체험 학습 준비 쪽지", ["우리 반 26명과 선생님 2명이 45인승 버스 1대를 타요.", "모둠은 4명씩, 모둠마다 체험 활동지를 3장씩 받아요.", "4D 영상관 표: 학생 1000원, 어른 2000원, 할인 쿠폰 3000원", "간식 초콜릿 36개를 버스 앞쪽·뒤쪽 바구니에 똑같이 나누어 넣어요.", "모둠 간식비는 15000원, 남는 돈은 거스름돈으로 돌려받아요."]));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "쪽지에 ~이 보여요", hint: "쪽지에서 보이는 것", ex: ["45인승 버스에 26명과 선생님 2명이 탄다고 쓰여 있어요.", "영상관 표는 학생 1000원, 어른 2000원이라고 쓰여 있어요."] },
          { t: "생각해요", e: "💭", ph: "~을 구하려면 ~해야 할 것 같아요", hint: "준비하려면 어떤 계산이 필요할까요?", ex: ["버스 빈자리를 알려면 45에서 탈 사람 수를 빼야 할 것 같아요.", "표값을 구하려면 1000원에 학생 수를 곱하고 선생님 표값을 더해야 할 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 계산할까?", hint: "준비하면서 궁금한 것", ex: ["더하기와 곱하기가 한 식에 있으면 무엇을 먼저 계산할까?", "여러 가지 계산을 하나의 식으로 쓸 수 있을까?"] }],
          { ok: "준비할 일 속에 여러 가지 계산이 섞여 있어요! 이 단원에서 하나씩 해결해 봐요." }); } },
    { name: "그려 보기 — 버스 빈자리", inst: "도윤이가 45인승 버스 자리표를 가져왔어요. 우리 반 학생 26명과 선생님 2명을 버스에 태워 보고, 빈자리를 구해 보세요.", hints: ["단추를 눌러 학생과 선생님을 모두 태워요.", "버스에 탄 사람 수를 먼저 구하고, 45에서 빼요."],
      render: (b, a) => mx1Bus(b, a, { seats: 45, groups: [{ n: "학생", k: 26, col: "#8DB8E8" }, { n: "선생님", k: 2, col: "#F3A6B5" }], ask: [
        { q: "버스에 탄 사람은 모두 몇 명인가요? 26 + 2 =", a: 26 + 2, unit: "명" },
        { q: "빈자리는 몇 개인가요? 45 − 28 =", a: 45 - 28, unit: "개", why: { "21": "45 − 26 = 19에 2를 더하면 안 돼요. 선생님 2명도 자리에 앉았어요." } }],
        ok: "탄 사람 28명을 먼저 구해 45에서 빼면 빈자리는 17개예요." }) },
    { name: "말해 보기 — 도윤이의 식", inst: "도윤이는 빈자리를 구하려고 45 − 26 + 2 = 19 + 2 = 21이라고 썼어요. 빈자리를 바르게 구하는 식을 모두 골라 보세요.", hints: ["학생 26명도 선생님 2명도 자리에 앉아요. 둘 다 빼야 해요.", "탄 사람 수 26 + 2를 ( )로 묶어 한꺼번에 뺄 수 있어요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "빈자리를 바르게 구하는 식을 모두 고르세요.", o: ["45 − 26 + 2", "45 − (26 + 2)", "45 − 26 − 2", "(45 − 26) + 2"], a: [1, 2], why: { "0": "45 − 26 + 2는 선생님 2명을 빈자리에 더한 셈이에요.", "3": "(45 − 26) + 2도 선생님 2명을 빈자리에 더한 셈이에요." } }],
        { ok: `45 − (26 + 2) = 45 − 28 = ${MXV("45-(26+2)")}, 45 − 26 − 2 = 19 − 2 = ${MXV("45-26-2")}로 빈자리는 17개예요.` }),
        { q: "45 − 26 + 2와 45 − (26 + 2)의 계산 결과가 다른 까닭은 무엇일까요?", ph: "45 − 26 + 2는 ~을 먼저 하고, 45 − (26 + 2)는 ~을 먼저 해서", help: ["① 두 식에서 가장 먼저 계산하는 부분을 찾아요. → ② 먼저 하는 계산이 달라서 결과가 어떻게 되는지 써요.", "‘앞의 식은 ~을 먼저, 뒤의 식은 ( ) 안의 ~을 먼저 계산해서 결과가 달라요.’ 꼴로 써요."],
          ans: "45 − 26 + 2는 45 − 26을 먼저 계산하고, 45 − (26 + 2)는 ( ) 안의 26 + 2를 먼저 계산해요. 계산하는 순서가 달라서 결과가 21과 17로 달라져요." }) },
    { name: "말해 보기 — 생활 속 혼합 계산", inst: "생활 속에서 여러 가지 계산이 섞였던 경험을 떠올려 써 보세요.", hints: ["물건을 여러 개 사고 거스름돈을 받은 일을 떠올려 봐요.", "모둠을 나누고 모둠마다 물건을 나누어 준 일도 좋아요."],
      render: (b, a) => writeStep(b, a, [
        { q: "덧셈, 뺄셈, 곱셈, 나눗셈 중 두 가지 이상이 섞여 있던 생활 속 상황을 써 보세요.", tag: "상황", ph: "예: 1000원짜리 공책 3권을 사고 5000원을 내서 거스름돈을 받았어요.", help: ["① 무엇을 몇 개 사거나 나누었는지 써요. → ② 그다음에 더하거나 빼거나 곱하거나 나눈 일을 써요.", "‘○○를 □개씩 △… 그리고 ~원을 내고 ~을 받았어요.’ 꼴로 써요."], ans: "800원짜리 우유 3개를 사고 5000원을 냈더니 5000 − 800 × 3 = 2600, 거스름돈 2600원을 받았어요." },
        { q: "그 상황을 계산할 때 무엇을 먼저 계산했나요?", tag: "먼저", ph: "예: 공책 3권의 값을 먼저 구했어요.", help: ["① 계산한 순서를 떠올려요. → ② 왜 그것을 먼저 했는지 써요.", "‘~을 먼저 구해야 ~을 알 수 있어서 ~을 먼저 계산했어요.’ 꼴로 써요."], ans: "우유 3개의 값 800 × 3을 먼저 구해야 낸 돈에서 뺄 수 있어서 곱셈을 먼저 계산했어요." }]) },
    { name: "확인하기 — 배운 계산 떠올리기", inst: "4학년까지 배운 덧셈, 뺄셈, 곱셈, 나눗셈을 떠올려 계산해 보세요. 다 쓰면 저절로 확인해요.", hints: ["같은 자리끼리 계산하고, 받아올림과 받아내림을 살펴봐요.", "672 ÷ 24는 24 × 28을 떠올려 봐요."],
      render: (b, a) => mx1Ask(b, a, [{ q: "375 + 468 =", a: 375 + 468 }, { q: "704 − 359 =", a: 704 - 359, why: { "455": "받아내림을 다시 살펴봐요." } }, { q: "236 × 24 =", a: 236 * 24 }, { q: "672 ÷ 24 =", a: 672 / 24 }],
        { ok: "배운 계산을 잘 기억하고 있어요. 이제 이 계산들이 섞여 있는 식을 배워요." }) }
  ],
  challenge: { inst: "★ 도전 — 옆 반도 함께 가기로 해서 45인승 버스 2대를 빌렸어요. 우리 반 학생 26명, 옆 반 학생 27명, 선생님 4명이 탄다면 빈자리는 몇 개인지 하나의 식으로 나타내어 구해 보세요.", hints: ["버스 2대의 자리는 45 × 2개예요.", "탄 사람 26 + 27 + 4를 ( )로 묶어 빼요."],
    render: (b, a) => mx1Build(b, a, { cards: [45, 2, 26, 27, 4], target: MXV("45*2-(26+27+4)"), ex: "45×2−(26+27+4)", ansQ: "빈자리는", unit: "개",
      ok: `45 × 2 − (26 + 27 + 4) = 90 − 57 = ${MXV("45*2-(26+27+4)")}, 빈자리는 ${MXV("45*2-(26+27+4)")}개예요. 곱셈과 ( )가 섞인 식도 이 단원에서 배워요!` }) }
},
{
  id: "s2", no: 2, title: "체험 학습에 가는 사람 수 ― 덧셈과 뺄셈", soop: "개념 구축하기(O)",
  question: "덧셈과 뺄셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "덧셈과 뺄셈이 섞여 있는 식은 앞에서부터 차례대로 계산해요. ( )가 있는 식은 ( ) 안을 먼저 계산해요. 50 − 18 + 6 = 38이지만 50 − (18 + 6) = 26이에요.",
  steps: [
    { name: "만져 보기 — 참가하는 학생 수", inst: "우리 반 남학생은 14명인데 그중 2명이 가족 행사로 체험 학습에 가지 못해요. 여학생 12명은 모두 가요. 체험 학습에 가는 학생은 모두 몇 명인지 하나의 식으로 나타내어 구해 보세요.", hints: ["가는 남학생 수를 먼저 구하고, 여학생 수를 더해요.", "14 − 2 + 12처럼 하나의 식으로 나타내요."],
      render: ruleFirst((b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "남학생 14명", n: 14, color: "#8DB8E8", cross: 2, note: "2명 못 가요" }, { label: "여학생 12명", n: 12, color: "#F3A6B5", note: "모두 가요" }]),
        ask: [{ q: "체험 학습에 가는 남학생은? 14 − 2 =", a: 14 - 2, unit: "명" }], cards: [14, 2, 12], target: MXV("14-2+12"), ex: "14−2+12", ansQ: "체험 학습에 가는 학생은 모두", unit: "명",
        why: { "0": "14 − (2 + 12)는 못 가는 2명과 여학생 12명을 함께 뺀 셈이에요. 여학생 수는 더해야 해요." },
        ok: "14 − 2 + 12 = 12 + 12 = 24, 24명이에요. 가는 남학생 수를 먼저 구하고 여학생 수를 더하므로 앞에서부터 차례대로 계산했어요." }),
        { q: "덧셈과 뺄셈이 섞여 있는 식은 어떤 순서로 계산할까요?", ph: "내 규칙: 덧셈과 뺄셈이 섞여 있으면 ~", help: ["① 14 − 2 + 12에서 무엇을 먼저 구해야 하는지 생각해요. → ② 그것이 식의 앞쪽인지 뒤쪽인지 살펴봐요.", "‘내 규칙: 덧셈과 뺄셈이 섞여 있으면 ~부터 차례대로 계산해요.’ 꼴로 써요."],
          ans: "덧셈과 뺄셈이 섞여 있는 식은 앞에서부터 차례대로 계산해요. 14 − 2 + 12 = 12 + 12 = 24예요." }) },
    { name: "그려 보기 — ( )가 있는 식", inst: "버스 짐칸에 생수 40병을 실었어요. 가는 길에 1모둠이 9병, 2모둠이 7병을 꺼내 갔어요. 짐칸에 남은 생수는 몇 병일까요? 꺼내 간 생수 수를 ( )로 묶어 하나의 식으로 나타내 보세요.", hints: ["1모둠과 2모둠이 꺼내 간 생수 수를 먼저 구해요.", "40 − (9 + 7)처럼 꺼내 간 수를 ( )로 묶어 빼요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "짐칸 생수 40병", n: 40, color: "#BFDDF5", shape: "r" }, { label: "1모둠이 꺼냄", n: 9, color: "#F6C9A6", shape: "r", note: "9병" }, { label: "2모둠이 꺼냄", n: 7, color: "#CDE8C4", shape: "r", note: "7병" }], { per: 20 }),
        ask: [{ q: "두 모둠이 꺼내 간 생수는 모두? 9 + 7 =", a: 9 + 7, unit: "병" }], cards: [40, 9, 7], paren: true, target: MXV("40-(9+7)"), ex: "40−(9+7)", ansQ: "짐칸에 남은 생수는", unit: "병",
        why: { "38": "40 − 9 + 7은 9병을 빼고 7병을 더한 셈이에요. 꺼내 간 생수 9 + 7을 ( )로 묶어 한꺼번에 빼요." },
        ok: "40 − (9 + 7) = 40 − 16 = 24, 24병이에요. 꺼내 간 수를 먼저 구해야 하므로 ( ) 안을 먼저 계산했어요." }) },
    { name: "말해 보기 — 두 식 비교하기", inst: "서하가 두 식을 칠판에 썼어요. 먼저 계산할 기호를 누르고 그 값을 써서 두 식을 계산한 다음, 결과를 비교해 보세요.", hints: ["가는 앞에서부터 차례대로 50 − 18을 먼저 계산해요.", "나는 ( ) 안의 18 + 6을 먼저 계산해요."],
      render: thenWhy((b, a) => mx1Order(b, a, [{ e: "50−18+6", label: "가" }, { e: "50−(18+6)", label: "나" }], { cmp: true, ok: `( )가 없을 때에는 ${MXV("50-18+6")}, 있을 때에는 ${mx1J(MXV("50-(18+6)"), "으로")} 계산 결과가 달라요.` }),
        { q: "두 식의 계산 결과가 다른 까닭을 써 보세요.", ph: "가는 ~을 먼저, 나는 ~을 먼저 계산해서", help: ["① 가와 나에서 가장 먼저 계산한 부분을 떠올려요. → ② ( )가 계산 순서를 어떻게 바꾸었는지 써요.", "‘가는 ~부터, 나는 ( ) 안의 ~부터 계산해서 결과가 달라요.’ 꼴로 써요."],
          ans: "가는 앞에서부터 차례대로 50 − 18을 먼저 계산했고, 나는 ( ) 안의 18 + 6을 먼저 계산했어요. ( ) 때문에 계산 순서가 달라져서 38과 26으로 결과가 달라요." }) },
    { name: "약속하기 — 덧셈과 뺄셈의 계산 순서", inst: "덧셈과 뺄셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["가는 학생 수는 앞에서부터 차례대로 계산했어요.", "남은 생수 수는 ( ) 안을 먼저 계산했어요."],
      render: (b, a) => blanks(b, a, ["덧셈과 뺄셈이 섞여 있는 식은 ", { o: ["앞에서부터 차례대로", "덧셈을 먼저", "뒤에서부터 차례대로"], a: 0 }, " 계산해요. 덧셈과 뺄셈이 섞여 있고 ( )가 있는 식은 ", { o: ["( ) 안", "( ) 밖"], a: 0 }, "을 먼저 계산해요."], { ok: "덧셈과 뺄셈은 앞에서부터 차례대로, ( )가 있으면 ( ) 안을 먼저 계산해요." }) },
    { name: "확인하기 — 먼저 계산할 곳, 계산 결과 잇기", inst: "위에서는 가장 먼저 계산할 기호를 찾고, 아래에서는 식과 계산 결과를 이어 보세요. 두 가지를 모두 해야 계단을 올라요.", hints: ["( )가 없으면 앞에서부터, ( )가 있으면 ( ) 안부터 계산해요.", "61 − (25 + 18)은 25 + 18 = 43을 먼저 구해요."],
      render: (b, a) => { mx1Order(b, a, [{ e: "52−19+7", first: true }, { e: "52−(19+7)", first: true }], { ok: "먼저 계산할 곳을 잘 찾았어요." });
        mx1Match(b, a, { left: ["27+16−9", "61−(25+18)", "45−17+12"], right: [MXV("61-(25+18)"), MXV("45-17+12"), MXV("27+16-9")], ok: "계산 순서에 맞게 계산해서 모두 바르게 이었어요." }); } }
  ],
  challenge: { inst: "★ 도전 — 버스 정류장, 과학관, 공원, 식당이 한 길 위에 차례로 있어요. 그림을 보고 과학관에서 공원까지의 거리를 하나의 식으로 나타내어 구해 보세요.", hints: ["정류장~공원 620 m와 과학관~식당 540 m를 더하면 과학관~공원 부분이 두 번 들어가요.", "두 거리의 합에서 정류장~식당 900 m를 빼요."],
    render: (b, a) => mx1Build(b, a, { pic: () => mx1sRoad([[0, "정류장"], [360, "과학관"], [620, "공원"], [900, "식당"]], [[0, 620, "620 m", true], [360, 900, "540 m", false], [0, 900, "900 m", true]]),
      cards: [620, 540, 900], target: MXV("620+540-900"), ex: "620+540−900", ansQ: "과학관에서 공원까지의 거리는", unit: "m",
      ok: `620 + 540 − 900 = 1160 − 900 = ${MXV("620+540-900")}, ${MXV("620+540-900")} m예요. 겹친 부분을 찾아 덧셈과 뺄셈이 섞인 식으로 구했어요!` }) }
},
{
  id: "s3", no: 3, title: "모둠을 나누고 활동지를 나누어요 ― 곱셈과 나눗셈", soop: "개념 구축하기(O)",
  question: "곱셈과 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "곱셈과 나눗셈이 섞여 있는 식은 앞에서부터 차례대로 계산해요. ( )가 있는 식은 ( ) 안을 먼저 계산해요. 36 ÷ 3 × 2 = 24이지만 36 ÷ (3 × 2) = 6이에요.",
  steps: [
    { name: "만져 보기 — 필요한 활동지 수", inst: "체험 학습에 가는 학생 24명이 4명씩 모둠을 만들어요. 과학관에서 모둠마다 체험 활동지를 3장씩 받는다면 활동지는 모두 몇 장 필요할까요?", hints: ["먼저 24 ÷ 4로 모둠 수를 구해요.", "모둠 수에 3을 곱해요. 24 ÷ 4 × 3처럼 하나의 식으로 나타내요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "가는 학생 24명", n: 24, color: "#B9D7A8", group: 4, note: "4명씩 모둠" }], { per: 12 }),
        ask: [{ q: "모둠은 몇 개인가요? 24 ÷ 4 =", a: 24 / 4, unit: "모둠" }], cards: [24, 4, 3], target: MXV("24÷4×3"), ex: "24÷4×3", ansQ: "필요한 활동지는", unit: "장",
        why: { "2": "24 ÷ (4 × 3)은 24명을 12명씩 묶은 셈이에요. 모둠 수를 먼저 구하고 3을 곱해요." },
        ok: "24 ÷ 4 × 3 = 6 × 3 = 18, 18장이에요. 모둠 수를 먼저 구하므로 앞에서부터 차례대로 계산했어요." }) },
    { name: "그려 보기 — ( )가 있는 식", inst: "민준이는 과학관 만들기 체험에 쓸 자석 96개를 꾸러미로 나누려고 해요. 꾸러미 하나에 자석을 4개씩 3줄로 담으면 꾸러미는 몇 개가 될까요? 꾸러미 하나에 담을 자석 수를 ( )로 묶어 하나의 식으로 나타내 보세요.", hints: ["꾸러미 하나에 담을 자석은 4 × 3개예요.", "96 ÷ (4 × 3)처럼 ( )로 묶어 나누어요."],
      render: thenWhy((b, a) => mx1Build(b, a, { pic: () => mx1GridPic(4, 3, "꾸러미 하나: 4개씩 3줄", "#7AA7D9"),
        ask: [{ q: "꾸러미 하나에 담을 자석은? 4 × 3 =", a: 4 * 3, unit: "개" }], cards: [96, 4, 3], paren: true, target: MXV("96÷(4×3)"), ex: "96÷(4×3)", ansQ: "꾸러미는", unit: "개",
        why: { "72": "96 ÷ 4 × 3은 앞에서부터 96 ÷ 4 = 24에 3을 곱한 셈이에요. 꾸러미 하나의 자석 수 4 × 3을 ( )로 묶어 나누어요." },
        ok: "96 ÷ (4 × 3) = 96 ÷ 12 = 8, 꾸러미는 8개예요." }),
        { q: "96 ÷ 4 × 3과 96 ÷ (4 × 3)의 계산 결과가 다른 까닭은?", ph: "96 ÷ 4 × 3은 ~, 96 ÷ (4 × 3)은 ~", help: ["① 두 식에서 가장 먼저 계산하는 부분을 찾아요. → ② 결과가 각각 얼마인지 견주어요.", "‘앞의 식은 ~을 먼저, 뒤의 식은 ( ) 안의 ~을 먼저 계산해서 ~과 ~로 달라요.’ 꼴로 써요."],
          ans: "96 ÷ 4 × 3은 앞에서부터 96 ÷ 4 = 24를 먼저 계산해서 72가 되고, 96 ÷ (4 × 3)은 ( ) 안의 4 × 3 = 12를 먼저 계산해서 8이 돼요." }) },
    { name: "말해 보기 — 옳게 계산한 사람 찾기", inst: "서하와 민준이가 식을 계산했어요. 옳게 계산한 사람을 찾고, 잘못 계산한 식은 계산 순서를 나타내어 다시 계산해 보세요. 두 가지를 모두 해야 계단을 올라요.", hints: ["서하: 36 ÷ 3 × 2 = 12 × 2 = 24", "민준: 36 ÷ (3 × 2) = 12 × 2 = 24 — ( ) 안을 먼저 계산했나요?"],
      render: (b, a) => { quiz(b, a, [
          { q: "서하: 36 ÷ 3 × 2 = 12 × 2 = 24 / 민준: 36 ÷ (3 × 2) = 12 × 2 = 24 — 옳게 계산한 사람은?", o: ["서하", "민준", "둘 다"], a: 0, why: { "1": "민준이의 식에는 ( )가 있어요. ( ) 안의 3 × 2를 먼저 계산했는지 살펴봐요.", "2": "민준이는 ( ) 안을 먼저 계산하지 않았어요." } },
          { q: "민준이가 잘못 계산한 까닭은?", o: ["( )가 있는 식은 ( ) 안을 먼저 계산해야 하는데 36 ÷ 3을 먼저 계산했어요.", "곱셈을 나눗셈보다 먼저 계산해야 하는데 나눗셈을 먼저 했어요.", "36 ÷ 3을 잘못 계산했어요."], a: 0, why: { "1": "곱셈과 나눗셈은 앞에서부터 차례대로 계산해요. 곱셈을 늘 먼저 하는 것은 아니에요.", "2": "36 ÷ 3 = 12는 맞게 계산했어요." } }], { ok: "서하가 옳게 계산했어요." });
        mx1Order(b, a, [{ e: "36÷(3×2)" }], { ok: `36 ÷ (3 × 2) = 36 ÷ 6 = ${mx1J(MXV("36÷(3×2)"), "이에요")}.` }); } },
    { name: "약속하기 — 곱셈과 나눗셈의 계산 순서", inst: "곱셈과 나눗셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["활동지 수는 앞에서부터 차례대로 계산했어요.", "꾸러미 수는 ( ) 안을 먼저 계산했어요."],
      render: (b, a) => blanks(b, a, ["곱셈과 나눗셈이 섞여 있는 식은 ", { o: ["앞에서부터 차례대로", "곱셈을 먼저", "나눗셈을 먼저"], a: 0 }, " 계산해요. 곱셈과 나눗셈이 섞여 있고 ( )가 있는 식은 ", { o: ["( ) 안", "( ) 밖"], a: 0 }, "을 먼저 계산해요."], { ok: "곱셈과 나눗셈도 앞에서부터 차례대로, ( )가 있으면 ( ) 안을 먼저 계산해요." }) },
    { name: "확인하기 — 계산하고 가장 작은 식 만들기", inst: "위의 두 식은 계산 순서를 나타내어 계산하고, 아래에서는 ○ 안에 ×, ÷를 한 번씩 넣어 계산 결과가 더 작은 식을 만들어 보세요. 두 가지를 모두 해야 계단을 올라요.", hints: ["( )가 없으면 앞에서부터 차례대로 계산해요.", "결과가 작으려면 곱하는 수는 작게, 나누는 수는 크게 해요."],
      render: (b, a) => { mx1Order(b, a, [{ e: "54÷6×4" }, { e: "120÷(4×5)" }], { ok: `54 ÷ 6 × 4 = ${MXV("54÷6×4")}, 120 ÷ (4 × 5) = ${mx1J(MXV("120÷(4×5)"), "이에요")}.` });
        mx1Ops(b, a, [{ tpl: "96 ○ (8 ○ 2)", ops: ["×", "÷"], once: true, goal: "min", calc: true }], { ok: `96 ÷ (8 × 2) = 96 ÷ 16 = ${mx1J(MXV("96÷(8×2)"), "이에요")}. 다른 경우 96 × (8 ÷ 2) = ${MXV("96×(8÷2)")}보다 작아요.` }); } }
  ],
  challenge: { inst: "★ 도전 — 기념품 문제를 하나의 식으로 풀고, ○ 안에 기호를 넣어 보세요.", hints: ["열쇠고리는 6 × 5개를 3모둠에 똑같이 나누어요.", "18 ÷ 6 × 4를 생각해 봐요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => mx1Build(b2, a2, { prompt: "선생님이 과학관 기념품 가게에서 한 상자에 6개씩 든 열쇠고리 5상자를 사서 3모둠에 똑같이 나누어 주려고 해요. 한 모둠에 몇 개씩 줄 수 있는지 하나의 식으로 나타내요.",
        cards: [6, 5, 3], target: MXV("6×5÷3"), ex: "6×5÷3", ansQ: "한 모둠에", unit: "개", ok: `6 × 5 ÷ 3 = 30 ÷ 3 = ${MXV("6×5÷3")}, 10개씩이에요.` }),
      (b2, a2) => mx1Ops(b2, a2, [{ tpl: "18 ○ 6 ○ 4", ops: ["×", "÷"], once: true, goal: 12 }], { ok: "18 ÷ 6 × 4 = 3 × 4 = 12예요!" })]) }
},
{
  id: "s4", no: 4, title: "4D 영상관 표값을 계산해요 ― 덧셈, 뺄셈, 곱셈", soop: "개념 구축하기(O)",
  question: "덧셈, 뺄셈, 곱셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "덧셈, 뺄셈, 곱셈이 섞여 있는 식은 곱셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요. ( )가 있으면 ( ) 안을 가장 먼저 계산해요.",
  steps: [
    { name: "만져 보기 — 영상관 표값", inst: "과학관 4D 영상관 표는 어른 1장에 2000원, 학생 1장에 1000원이에요. 선생님 표 1장과 학생 표 24장을 사고 할인 쿠폰 3000원을 쓰면 내야 할 돈은 얼마일까요? (2000부터 쓰기 시작해 하나의 식으로 나타내요.)", hints: ["학생 표값은 1000 × 24원이에요.", "2000 + 1000 × 24에서 쿠폰 3000원을 빼요."],
      render: ruleFirst((b, a) => mx1Build(b, a, { pic: () => mx1Tags([["어른 표 1장", "2000원"], ["학생 표 1장", "1000원"], ["할인 쿠폰", "3000원"]]),
        ask: [{ q: "학생 표 24장의 값은? 1000 × 24 =", a: 1000 * 24, unit: "원" }, { q: "쿠폰을 쓰기 전 표값은 모두? 2000 + 1000 × 24 =", a: MXV("2000+1000×24"), unit: "원", why: { "72000": "2000 + 1000을 먼저 계산하면 선생님 표값까지 24번 세게 돼요. 학생 표값 1000 × 24를 먼저 구해요." } }],
        cards: [2000, 1000, 24, 3000], target: MXV("2000+1000×24−3000"), ex: "2000+1000×24−3000", ansQ: "내야 할 돈은", unit: "원",
        why: { "69000": "(2000 + 1000) × 24 − 3000은 선생님 표값까지 24번 센 셈이에요. 학생 표값 1000 × 24를 먼저 구해요." },
        ok: "2000 + 1000 × 24 − 3000 = 2000 + 24000 − 3000 = 26000 − 3000 = 23000, 23000원이에요. 곱셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산했어요." }),
        { q: "덧셈, 뺄셈, 곱셈이 섞여 있는 식에서는 무엇을 먼저 계산할까요?", ph: "내 규칙: ~을 먼저 계산하고 ~", help: ["① 표값을 구할 때 무엇을 먼저 알아야 하는지 생각해요. → ② 그것이 어떤 계산인지 떠올려요.", "‘내 규칙: ~을 먼저 계산하고, 덧셈과 뺄셈은 ~.’ 꼴로 써요."],
          ans: "곱셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요. 2000 + 1000 × 24 − 3000 = 2000 + 24000 − 3000 = 23000이에요." }) },
    { name: "그려 보기 — 두 식 비교하기", inst: "하린이가 두 식 가와 나를 만들었어요. 가는 ( )가 없고, 나는 ( )가 있어요. 각각 계산 순서를 나타내어 계산하고 결과를 비교해 보세요.", hints: ["가: 곱셈 3 × 5를 먼저 계산해요.", "나: ( ) 안의 5 + 7을 가장 먼저 계산해요."],
      render: thenWhy((b, a) => mx1Order(b, a, [{ e: "40−3×5+7", label: "가" }, { e: "40−3×(5+7)", label: "나" }], { cmp: true, ok: `( )가 없을 때 ${MXV("40-3×5+7")}, 있을 때 ${MXV("40-3×(5+7)")}로 결과가 달라요.` }),
        { q: "나에서 ( ) 때문에 계산 순서가 어떻게 달라졌나요?", ph: "가에서는 ~을 먼저, 나에서는 ~을 먼저", help: ["① 가와 나에서 가장 먼저 계산한 부분을 견주어요. → ② ( )가 곱셈보다 먼저인지 생각해요.", "‘가는 곱셈 ~을 먼저 했지만, 나는 ( ) 안의 ~을 가장 먼저 했어요.’ 꼴로 써요."],
          ans: "가에서는 곱셈 3 × 5를 먼저 계산했지만, 나에서는 ( ) 안의 5 + 7을 곱셈보다도 먼저, 가장 먼저 계산했어요. 그래서 가는 32, 나는 4가 돼요." }) },
    { name: "말해 보기 — 계산 순서 나타내기", inst: "계산 순서를 나타내고 계산해 보세요.", hints: ["곱셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요.", "50 − (6 + 3) × 4는 ( ) 안 → 곱셈 → 뺄셈 순서예요."],
      render: (b, a) => mx1Order(b, a, [{ e: "26+4×7−9" }, { e: "50−(6+3)×4" }], { ok: `26 + 4 × 7 − 9 = ${MXV("26+4×7−9")}, 50 − (6 + 3) × 4 = ${mx1J(MXV("50−(6+3)×4"), "이에요")}.` }) },
    { name: "약속하기 — 덧셈, 뺄셈, 곱셈의 계산 순서", inst: "덧셈, 뺄셈, 곱셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["표값을 구할 때 1000 × 24를 먼저 계산했어요."],
      render: (b, a) => blanks(b, a, ["덧셈, 뺄셈, 곱셈이 섞여 있는 식은 ", { o: ["곱셈", "덧셈", "뺄셈"], a: 0 }, "을 먼저 계산해요. 덧셈과 뺄셈은 ", { o: ["앞에서부터 차례대로", "뒤에서부터 차례대로"], a: 0 }, " 계산하고, ( )가 있으면 ", { o: ["( ) 안", "곱셈"], a: 0 }, "을 가장 먼저 계산해요."], { ok: "곱셈을 먼저, ( )가 있으면 ( ) 안을 가장 먼저 계산해요." }) },
    { name: "확인하기 — 버스 간식 젤리", inst: "계산해 보고, 젤리 문제를 하나의 식으로 나타내어 구해 보세요.", hints: ["48 − 3 × (6 + 8)은 ( ) 안 → 곱셈 → 뺄셈 순서예요.", "먹은 젤리는 (4 + 5) × 3개예요."],
      render: (b, a) => mx1Build(b, a, { ask: [{ q: "48 − 3 × (6 + 8) =", a: MXV("48−3×(6+8)"), why: { "630": "48 − 3을 먼저 계산하면 안 돼요. ( ) 안 → 곱셈 → 뺄셈 순서로 계산해요." } }],
        prompt: "버스 간식 젤리가 80개 있었어요. 1모둠 학생 4명과 2모둠 학생 5명이 한 명당 3개씩 먹었다면 남은 젤리는 몇 개인지 하나의 식으로 나타내요.",
        cards: [80, 4, 5, 3, 3], atMost: true, target: MXV("80−(4+5)×3"), ex: "80−(4+5)×3", ansQ: "남은 젤리는", unit: "개",
        why: { "91": "80 − 4 + 5 × 3처럼 ( )가 없으면 4명만 빼게 돼요. 두 모둠 학생 수 4 + 5를 ( )로 묶어요." },
        ok: "80 − (4 + 5) × 3 = 80 − 9 × 3 = 80 − 27 = 53, 53개예요." }) }
  ],
  challenge: { inst: "★ 도전 — 계산 결과가 40보다 작은 식을 찾고, 기념품 문제를 해결해 보세요.", hints: ["5 + 4 × 9 − 3 = 38, 4 × (12 − 3) + 6 = 42예요.", "도윤이가 산 기념품은 12 + 8개예요. 그 2배보다 5개 적어요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => quiz(b2, a2, [{ q: "계산 결과가 40보다 작은 식은?", o: ["5 + 4 × 9 − 3", "4 × (12 − 3) + 6"], a: 0, why: { "1": `4 × (12 − 3) + 6 = 4 × 9 + 6 = ${MXV("4×(12−3)+6")}라서 40보다 커요.` } }]),
      (b2, a2) => mx1Build(b2, a2, { prompt: "도윤이는 기념품 가게에서 열쇠고리 12개와 자석 8개를 샀고, 지우는 도윤이가 산 기념품 수의 2배보다 5개 더 적게 샀어요. 지우가 산 기념품은 몇 개인지 하나의 식으로 나타내요.",
        cards: [12, 8, 2, 2, 5], atMost: true, target: MXV("(12+8)×2−5"), ex: "(12+8)×2−5", ansQ: "지우가 산 기념품은", unit: "개",
        why: { "23": "12 + 8 × 2 − 5는 자석만 2배 한 셈이에요. 도윤이가 산 수 12 + 8을 ( )로 묶어요." },
        ok: "(12 + 8) × 2 − 5 = 20 × 2 − 5 = 40 − 5 = 35, 35개예요." })]) }
},
{
  id: "s5", no: 5, title: "버스 간식을 나누어요 ― 덧셈, 뺄셈, 나눗셈", soop: "개념 구축하기(O)",
  question: "덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 나눗셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요. ( )가 있으면 ( ) 안을 가장 먼저 계산해요.",
  steps: [
    { name: "만져 보기 — 앞쪽 바구니의 초콜릿", inst: "버스 앞쪽 간식 바구니에 초콜릿이 5개 있었어요. 초콜릿 36개를 더 사서 앞쪽 바구니와 뒤쪽 바구니에 똑같이 나누어 넣었어요. 그 뒤 앞쪽에 앉은 친구들이 9개를 먹었다면 앞쪽 바구니에 남은 초콜릿은 몇 개일까요?", hints: ["앞쪽 바구니에 더 넣은 초콜릿은 36 ÷ 2개예요.", "5 + 36 ÷ 2에서 먹은 9개를 빼요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "앞쪽 바구니", n: 5, color: "#C98B5B", shape: "r", note: "처음 5개" }, { label: "더 산 초콜릿", n: 36, group: 18, color: "#E3B98F", shape: "r", note: "두 바구니에 똑같이" }], { per: 18 }),
        ask: [{ q: "앞쪽 바구니에 더 넣은 초콜릿은? 36 ÷ 2 =", a: 36 / 2, unit: "개" }, { q: "더 넣은 뒤 앞쪽 바구니의 초콜릿은? 5 + 36 ÷ 2 =", a: MXV("5+36÷2"), unit: "개" }],
        cards: [5, 36, 2, 9], target: MXV("5+36÷2−9"), ex: "5+36÷2−9", ansQ: "앞쪽 바구니에 남은 초콜릿은", unit: "개",
        ok: "5 + 36 ÷ 2 − 9 = 5 + 18 − 9 = 23 − 9 = 14, 14개예요. 나눗셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산했어요." }) },
    { name: "그려 보기 — 두 식 비교하기", inst: "두 식 가와 나를 각각 계산 순서를 나타내어 계산하고, 결과를 비교해 보세요.", hints: ["가: 나눗셈 36 ÷ 4를 먼저 계산해요.", "나: ( ) 안의 52 − 36을 가장 먼저 계산해요."],
      render: thenWhy((b, a) => mx1Order(b, a, [{ e: "52−36÷4+5", label: "가" }, { e: "(52−36)÷4+5", label: "나" }], { cmp: true, ok: `( )가 없을 때 ${MXV("52−36÷4+5")}, 있을 때 ${MXV("(52−36)÷4+5")}로 결과가 달라요.` }),
        { q: "가에서 52 − 36을 먼저 계산하면 안 되는 까닭은?", ph: "가에는 ( )가 없어서 ~", help: ["① 가에 ( )가 있는지 살펴봐요. → ② 덧셈, 뺄셈, 나눗셈 중 무엇을 먼저 하기로 했는지 떠올려요.", "‘가에는 ( )가 없으므로 ~을 먼저 계산해야 해요.’ 꼴로 써요."],
          ans: "가에는 ( )가 없으므로 나눗셈 36 ÷ 4를 먼저 계산해야 해요. 52 − 36을 먼저 계산하면 나의 식처럼 계산하게 되어 결과가 달라져요." }) },
    { name: "말해 보기 — 계산 순서 나타내기", inst: "계산 순서를 나타내고 계산해 보세요.", hints: ["나눗셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요.", "4 + 96 ÷ (20 − 8)은 ( ) 안 → 나눗셈 → 덧셈 순서예요."],
      render: (b, a) => mx1Order(b, a, [{ e: "7−18÷6+25" }, { e: "4+96÷(20−8)" }], { ok: `7 − 18 ÷ 6 + 25 = ${MXV("7−18÷6+25")}, 4 + 96 ÷ (20 − 8) = ${mx1J(MXV("4+96÷(20−8)"), "이에요")}.` }) },
    { name: "약속하기 — 덧셈, 뺄셈, 나눗셈의 계산 순서", inst: "덧셈, 뺄셈, 나눗셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["초콜릿 수를 구할 때 36 ÷ 2를 먼저 계산했어요."],
      render: (b, a) => blanks(b, a, ["덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 ", { o: ["나눗셈", "덧셈", "뺄셈"], a: 0 }, "을 먼저 계산해요. 덧셈과 뺄셈은 ", { o: ["앞에서부터 차례대로", "뒤에서부터 차례대로"], a: 0 }, " 계산하고, ( )가 있으면 ", { o: ["( ) 안", "나눗셈"], a: 0 }, "을 가장 먼저 계산해요."], { ok: "나눗셈을 먼저, ( )가 있으면 ( ) 안을 가장 먼저 계산해요." }) },
    { name: "확인하기 — 문장 순서로 문제 만들기", inst: "하린이가 스티커 문장 카드로 문제를 만들어요. ㉠ 뒤에 올 문장의 순서를 정하여 문제를 만들고, 하나의 식으로 나타내어 구해 보세요. 순서에 따라 문제와 답이 달라져요.", hints: ["예: ㉠ → ㉣ → ㉢ → ㉡ 순서이면 (30 − 12) ÷ 3 + 6이에요.", "나누어 가지기 전에 계산하는 부분은 ( )로 묶어요."],
      render: (b, a) => mx1Story(b, a, { start: 30, first: { k: "㉠", t: "스티커 30장이 있습니다." }, ask: "한 모둠이 지금 가지고 있는 스티커는 몇 장일까요?", unit: "장", nums: [30, 6, 3, 12],
        bad: "이 순서로는 문제가 되지 않아요. 가진 스티커보다 많이 쓸 수는 없어요. ‘다시 정하기’를 눌러 다른 순서로 해 봐요.",
        ex: `㉠ → ㉣ → ㉢ → ㉡: (30 − 12) ÷ 3 + 6 = ${MXV("(30−12)÷3+6")}, ${MXV("(30−12)÷3+6")}장`,
        cards: [{ k: "㉡", t: "스티커 6장을 더 받았습니다.", f: v => v + 6 }, { k: "㉢", t: "3모둠이 똑같이 나누어 가졌습니다.", f: v => v % 3 === 0 ? v / 3 : null }, { k: "㉣", t: "스티커 12장을 버스 창문 꾸미기에 썼습니다.", f: v => v >= 12 ? v - 12 : null }] }) }
  ],
  challenge: { inst: "★ 도전 — ( )로 묶어 계산 결과가 8이 되게 하고, 표를 보고 문제를 해결해 보세요.", hints: ["28 − 16을 ( )로 묶어 보세요.", "도시락 1개의 무게는 800 ÷ 2 g이에요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => mx1Paren(b2, a2, [{ e: "28−16÷4+5", target: 8 }], { ok: "(28 − 16) ÷ 4 + 5 = 12 ÷ 4 + 5 = 3 + 5 = 8이에요." }),
      (b2, a2) => mx1Build(b2, a2, { pic: () => mx1Tags([["물통 1개", "350 g"], ["도시락 2개", "800 g"], ["과일 컵 1개", "150 g"]]),
        prompt: "물통 1개와 도시락 1개의 무게의 합은 과일 컵 1개의 무게보다 몇 g 더 무거운지 하나의 식으로 나타내요.",
        cards: [350, 800, 2, 150], target: MXV("350+800÷2−150"), ex: "350+800÷2−150", ansQ: "더 무거운 무게는", unit: "g", ok: `350 + 800 ÷ 2 − 150 = 350 + 400 − 150 = ${MXV("350+800÷2−150")}, ${MXV("350+800÷2−150")} g 더 무거워요.` })]) }
},
{
  id: "s6", no: 6, title: "모둠 가방과 거스름돈 ― 덧셈, 뺄셈, 곱셈, 나눗셈", soop: "개념 구축하기(O)",
  question: "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
  summary: "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 곱셈과 나눗셈을 먼저 계산해요. 곱셈과 나눗셈, 덧셈과 뺄셈은 각각 앞에서부터 차례대로 계산하고, ( )가 있으면 ( ) 안을 가장 먼저 계산해요.",
  steps: [
    { name: "만져 보기 — 모둠 가방 간식 수", inst: "모둠 가방 6개에 주스를 각각 3개씩 2줄로 넣었어요. 쿠키 50개 중에서 부서진 2개를 빼고 남은 쿠키를 모둠 가방 6개에 똑같이 나누어 넣으려고 해요. 모둠 가방 한 개에 든 간식은 모두 몇 개가 될까요?", hints: ["가방 한 개의 주스는 3 × 2개예요.", "가방 한 개의 쿠키는 (50 − 2) ÷ 6개예요.", "두 수를 더하는 하나의 식으로 나타내요."],
      render: ruleFirst((b, a) => mx1Build(b, a, { pic: () => mx1Pic([{ label: "가방 하나의 주스", n: 6, group: 3, color: "#F4B860", shape: "r", note: "3개씩 2줄" }, { label: "쿠키 50개", n: 50, cross: 2, color: "#C98B5B", shape: "c", note: "부서진 쿠키 2개" }], { per: 25 }),
        ask: [{ q: "가방 한 개의 주스는? 3 × 2 =", a: 3 * 2, unit: "개" }, { q: "가방 한 개의 쿠키는? (50 − 2) ÷ 6 =", a: MXV("(50−2)÷6"), unit: "개" }],
        cards: [3, 2, 50, 2, 6], paren: true, target: MXV("3×2+(50−2)÷6"), ex: "3×2+(50−2)÷6", ansQ: "모둠 가방 한 개에 든 간식은 모두", unit: "개",
        ok: "3 × 2 + (50 − 2) ÷ 6 = 3 × 2 + 48 ÷ 6 = 6 + 8 = 14, 14개예요. ( ) 안을 가장 먼저 계산하고 곱셈과 나눗셈을 먼저 계산했어요." }),
        { q: "네 가지 계산과 ( )가 모두 섞여 있으면 어떤 순서로 계산할까요?", ph: "내 규칙: ( ) 안 → ~ → ~", help: ["① 앞에서 배운 ( ), 곱셈, 나눗셈의 순서를 떠올려요. → ② 덧셈과 뺄셈은 언제 하는지 생각해요.", "‘내 규칙: ( ) 안을 가장 먼저, 그다음 ~, 마지막에 ~.’ 꼴로 써요."],
          ans: "( ) 안을 가장 먼저 계산하고, 곱셈과 나눗셈을 앞에서부터 차례대로 계산한 다음, 덧셈과 뺄셈을 앞에서부터 차례대로 계산해요." }) },
    { name: "그려 보기 — 계산 순서 나타내기", inst: "계산 순서를 나타내고 계산해 보세요.", hints: ["곱셈과 나눗셈을 먼저, 덧셈과 뺄셈은 그다음에 앞에서부터 계산해요.", "40 − (3 + 5) ÷ 2 × 6은 ( ) 안 → 나눗셈 → 곱셈 → 뺄셈 순서예요."],
      render: (b, a) => mx1Order(b, a, [{ e: "8+4×6−9÷3" }, { e: "40−(3+5)÷2×6" }], { ok: `8 + 4 × 6 − 9 ÷ 3 = ${MXV("8+4×6−9÷3")}, 40 − (3 + 5) ÷ 2 × 6 = ${mx1J(MXV("40−(3+5)÷2×6"), "이에요")}.` }) },
    { name: "말해 보기 — 틀린 곳 찾기", inst: "계획단 친구들이 계산한 것을 보고 틀린 곳을 찾아보세요.", hints: ["70 + 20 ÷ 2 − 10에서 나눗셈을 먼저 해요.", "30 − (2 + 3) × 4 + 5에서 ( ) 안 → 곱셈 → 앞에서부터 차례대로 계산해요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "도윤: 70 + 20 ÷ 2 − 10 = 90 ÷ 2 − 10 = 45 − 10 = 35. 바르게 계산한 값은?", o: ["35", String(MXV("70+20÷2−10")), "90"], a: 1, why: { "0": "도윤이처럼 앞에서부터만 계산하면 안 돼요. 나눗셈 20 ÷ 2를 먼저 계산해요.", "2": "20 ÷ 2 = 10을 먼저 구한 뒤 70 + 10 − 10을 계산해요." } },
        { q: "서하: 30 − (2 + 3) × 4 + 5 = 30 − 5 × 9 → 계산할 수 없어요. 바르게 계산한 값은?", o: [String(MXV("30−(2+3)×4+5")), "5", "125"], a: 0, why: { "1": "뺄셈 기호를 중심으로 앞뒤를 나누면 안 돼요. ( ) 안 → 곱셈 → 앞에서부터 차례대로 계산해요.", "2": "30 − 5를 먼저 계산하면 안 돼요. 곱셈 5 × 4를 먼저 계산해요." } }],
        { ok: `70 + 20 ÷ 2 − 10 = ${MXV("70+20÷2−10")}, 30 − (2 + 3) × 4 + 5 = 30 − 20 + 5 = ${mx1J(MXV("30−(2+3)×4+5"), "이에요")}.` }),
        { q: "도윤이에게 무엇을 고치면 좋을지 알려 줘요.", ph: "도윤아, ~을 먼저 계산해야 해", help: ["① 도윤이가 가장 먼저 계산한 것을 찾아요. → ② 약속대로라면 무엇을 먼저 했어야 하는지 써요.", "‘도윤아, 70 + 20보다 ~을 먼저 계산해야 해. 그러면 ~이 돼.’ 꼴로 써요."],
          ans: "도윤아, 덧셈보다 나눗셈을 먼저 계산해야 해. 20 ÷ 2 = 10을 먼저 구하면 70 + 10 − 10 = 70이 돼." }) },
    { name: "약속하기 — 네 가지 계산의 순서", inst: "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식의 계산 순서를 약속해요.", hints: ["가방 간식 수를 구할 때 ( ) 안 → 곱셈과 나눗셈 → 덧셈 순서로 계산했어요."],
      render: (b, a) => blanks(b, a, ["덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 ", { o: ["곱셈과 나눗셈", "덧셈과 뺄셈"], a: 0 }, "을 먼저 계산해요. 곱셈과 나눗셈, 덧셈과 뺄셈은 각각 ", { o: ["앞에서부터 차례대로", "뒤에서부터 차례대로"], a: 0 }, " 계산하고, ( )가 있으면 ", { o: ["( ) 안", "곱셈"], a: 0 }, "을 가장 먼저 계산해요."], { ok: "( ) 안 → 곱셈과 나눗셈 → 덧셈과 뺄셈, 같은 단계끼리는 앞에서부터 차례대로예요." }) },
    { name: "확인하기 — 조건을 골라 거스름돈 구하기", inst: "1모둠이 과학관 매점에서 점심 간식을 사요. 조건을 하나씩 골라 문제를 만들고, 거스름돈을 하나의 식으로 나타내어 구해 보세요.", hints: ["음료 1병의 값은 2700 ÷ 3원, 요구르트 1개의 값은 2000 ÷ 4원이에요.", "낸 돈에서 (첫째 것 + 둘째 것 2개의 값)을 빼요."],
      render: (b, a) => mx1Shop(b, a, { tags: [["김밥 1줄", "3000원"], ["주먹밥 1개", "1500원"], ["음료 3병", "2700원"], ["요구르트 4개", "2000원"]],
        groups: [[{ n: "김밥 1줄", p: 3000 }, { n: "주먹밥 1개", p: 1500 }], [{ n: "음료", p: 2700, k: 3, u: "병" }, { n: "요구르트", p: 2000, k: 4, u: "개" }]],
        sentence: (A, C) => `1모둠은 ${A ? mx1J(A.n, "과와") : "( 김밥 1줄 , 주먹밥 1개 )와"} ${C ? C.n + " " + mx1J("2" + C.u, "을를") : "( 음료 , 요구르트 ) 2개를"} 사고 10000원을 냈어요. 받아야 하는 거스름돈은 얼마인지 하나의 식으로 나타내어 구해 보세요.`,
        target: (A, C) => 10000 - (A.p + C.p / C.k * 2), cards: (A, C) => [10000, A.p, C.p, C.k, 2], ansQ: "거스름돈", unit: "원",
        ex: `김밥과 음료: 10000 − (3000 + 2700 ÷ 3 × 2) = ${MXV("10000−(3000+2700÷3×2)")}, ${MXV("10000−(3000+2700÷3×2)")}원`,
        ok: v => `거스름돈은 ${v}원이에요. 조건을 바꾸어 다른 문제도 만들어 봐요!` }) }
  ],
  challenge: { inst: "★ 도전 — 수 카드를 넣어 계산 결과가 가장 작은 식을 만들고, 계산 결과가 다른 식을 찾아보세요.", hints: ["곱하는 수 □를 가장 작게 하면 결과가 작아져요.", "세 식을 차례로 계산해 봐요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => mx1Slots(b2, a2, { tpl: "□ × (□ + □) − 36 ÷ 9", cards: [4, 7, 2], goal: "min" }),
      (b2, a2) => quiz(b2, a2, [{ q: "계산 결과가 다른 하나는?", o: ["20 + 5 × (25 − 9) ÷ 8", "4 + 27 ÷ 9 × (32 − 23)", "33 + 2 × 3 ÷ 6 − 4"], a: 1, why: { "0": `20 + 5 × (25 − 9) ÷ 8 = ${mx1J(MXV("20+5×(25−9)÷8"), "이에요")}.`, "2": `33 + 2 × 3 ÷ 6 − 4 = ${mx1J(MXV("33+2×3÷6−4"), "이에요")}.` } }], { ok: `4 + 27 ÷ 9 × (32 − 23)만 ${MXV("4+27÷9×(32−23)")}이고 나머지는 ${mx1J(MXV("20+5×(25−9)÷8"), "이에요")}.` })]) }
},
{
  id: "s7", no: 7, title: "계획단 회의 ― 계산 순서를 정리해요", soop: "탐구 정리하기(O)",
  question: "혼합 계산의 계산 순서를 한눈에 정리하고, 실수를 바로잡을 수 있나요?",
  summary: "( ) 안을 가장 먼저 계산하고, 곱셈과 나눗셈을 앞에서부터 차례대로 계산한 뒤, 덧셈과 뺄셈을 앞에서부터 차례대로 계산해요. 계산하기 쉬운 수끼리 먼저 계산하거나 앞에서부터만 계산하면 틀리기 쉬워요.",
  steps: [
    { name: "만져 보기 — 가장 먼저 계산할 곳", inst: "지우가 회의 칠판에 식 네 개를 썼어요. 식마다 가장 먼저 계산할 기호를 눌러 보세요.", hints: ["( )가 있으면 ( ) 안부터 계산해요.", "( )가 없으면 곱셈과 나눗셈부터, 그다음 덧셈과 뺄셈이에요."],
      render: (b, a) => mx1Order(b, a, [{ e: "29+8×4−14", first: true }, { e: "46÷(28−5)+16", first: true }, { e: "60−24÷6×2", first: true }, { e: "35−12+8", first: true }], { ok: "네 식 모두 가장 먼저 계산할 곳을 찾았어요." }) },
    { name: "그려 보기 — 계산 순서 정리하기", inst: "혼합 계산의 계산 순서를 차례대로 눌러 보세요.", hints: ["( )는 언제나 가장 먼저예요.", "곱셈과 나눗셈이 덧셈과 뺄셈보다 먼저예요."],
      render: thenWhy((b, a) => sequence(b, a, ["㉮ 덧셈과 뺄셈을 앞에서부터 차례대로 계산해요.", "㉯ ( ) 안을 계산해요.", "㉰ 곱셈과 나눗셈을 앞에서부터 차례대로 계산해요."], [1, 2, 0], { ok: "( ) 안 → 곱셈과 나눗셈 → 덧셈과 뺄셈 순서예요." }),
        { q: "곱셈을 덧셈보다 먼저 계산하는 까닭을 표값 문제로 설명해 봐요.", ph: "2000 + 1000 × 24에서 ~", help: ["① 1000 × 24가 무엇을 뜻하는지 떠올려요. → ② 2000 + 1000을 먼저 하면 무엇이 잘못되는지 써요.", "‘1000 × 24는 ~의 값이라서 먼저 구해야 하고, 2000 + 1000을 먼저 하면 ~.’ 꼴로 써요."],
          ans: "1000 × 24는 학생 표 24장의 값이라서 하나의 값으로 먼저 구해야 해요. 2000 + 1000을 먼저 하면 선생님 표값까지 24번 세게 되어 틀려요." }) },
    { name: "말해 보기 — 친구의 실수 바로잡기", inst: "계획단 친구들의 계산 실수를 찾아 바른 값을 고르고, 아래에 조심할 점을 써 보세요. 두 가지를 모두 해야 계단을 올라요.", hints: ["47 − 7은 계산하기 쉬워 보여도 곱셈 7 × 5가 먼저예요.", "23 − 2 + 8은 앞에서부터 차례대로 계산해요."],
      render: (b, a) => { quiz(b, a, [
          { q: "민준: 47 − 7 × 5 = 40 × 5 = 200. 바르게 계산한 값은?", o: ["200", String(MXV("47−7×5")), "40"], a: 1, why: { "0": "47 − 7이 계산하기 쉬워 보여도 곱셈 7 × 5를 먼저 계산해요.", "2": "곱셈 7 × 5 = 35를 먼저 구해 47에서 빼요." } },
          { q: "하린: 23 − 2 + 8 = 23 − 10 = 13. 바르게 계산한 값은?", o: ["13", String(MXV("23−2+8")), "33"], a: 1, why: { "0": "2 + 8을 먼저 하면 안 돼요. 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요.", "2": "23 − 2 = 21에 8을 더해요." } },
          { q: "서하: 18 ÷ (3 × 2) = 18 ÷ 3 = 6. 서하가 쓴 식에서 잘못된 곳은?", o: ["3 × 2 = 6인데 18 ÷ 3이라고 썼어요. 18 ÷ 6 = 3이에요.", "곱셈을 먼저 계산했어요.", "잘못된 곳이 없어요."], a: 0, why: { "1": "( ) 안의 곱셈을 먼저 계산한 것은 맞아요.", "2": "18 ÷ (3 × 2) = 18 ÷ 6 = 3이에요." } }], { ok: "실수를 모두 바로잡았어요." });
        writeStep(b, a, [{ q: "혼합 계산을 할 때 조심할 점을 친구들에게 알려 줘요.", tag: "조심할 점", ph: "계산하기 쉬운 수부터 계산하지 말고 ~", help: ["① 친구들이 한 실수를 떠올려요. → ② 실수하지 않으려면 계산 전에 무엇을 하면 좋을지 써요.", "‘~하지 말고, 계산하기 전에 ~을 먼저 표시하면 좋아요.’ 꼴로 써요."],
          ans: "계산하기 쉬운 수끼리 먼저 계산하거나 앞에서부터만 계산하지 말고, 계산하기 전에 ( ) 안 → 곱셈과 나눗셈 → 덧셈과 뺄셈 순서로 번호를 먼저 표시하면 실수가 줄어요." }]); } },
    { name: "약속하기 — 혼합 계산의 순서", inst: "혼합 계산의 순서를 한 문장으로 정리해요.", hints: ["( ) → 곱셈·나눗셈 → 덧셈·뺄셈 순서예요."],
      render: (b, a) => blanks(b, a, ["혼합 계산은 ", { o: ["( ) 안", "곱셈과 나눗셈", "덧셈과 뺄셈"], a: 0 }, "을 가장 먼저 계산하고, 그다음 ", { o: ["곱셈과 나눗셈", "덧셈과 뺄셈"], a: 0 }, ", 마지막으로 ", { o: ["덧셈과 뺄셈", "곱셈과 나눗셈"], a: 0 }, "을 계산해요. 같은 단계의 계산끼리는 ", { o: ["앞에서부터 차례대로", "계산하기 쉬운 것부터"], a: 0 }, " 계산해요."], { ok: "혼합 계산의 순서를 정리했어요!" }) },
    { name: "확인하기 — ( )를 넣어 목표 수 만들기", inst: "식에 ( )를 한 번 넣어 계산 결과가 오른쪽 수가 되게 해 보세요.", hints: ["어느 부분을 먼저 계산하면 목표 수가 될지 생각해요.", "6 × 8 − 2 + 4에서 8 − 2를 묶어 보세요."],
      render: (b, a) => mx1Paren(b, a, [{ e: "6×8−2+4", target: 40 }, { e: "15+9−6÷3", target: 16 }], { ok: "6 × (8 − 2) + 4 = 40, 15 + (9 − 6) ÷ 3 = 16이에요. ( )를 넣는 곳에 따라 결과가 달라져요." }) }
  ],
  challenge: { inst: "★ 도전 — ○ 안에 +, −, ×, ÷ 중 알맞은 기호를 넣어 식을 완성해 보세요(같은 기호를 여러 번 써도 돼요).", hints: ["곱셈과 나눗셈을 먼저 계산한다는 것을 생각하며 넣어 봐요.", "12 ÷ 4 = 3, 2 × 3 = 6처럼 부분을 먼저 계산해 봐요."],
    render: (b, a) => mx1Ops(b, a, [{ tpl: "12 ○ 4 ○ 2 ○ 3", ops: ["+", "−", "×", "÷"], goal: 9 }], { ok: "계산 순서를 생각하며 기호를 넣어 9를 만들었어요!" }) }
},
{
  id: "s8", no: 8, title: "모둠 간식 바구니를 꾸려요 ― 예산 안에서", soop: "발표하기(P)",
  question: "모둠 간식비 15000원 안에서 간식 바구니를 꾸리고, 값을 하나의 식으로 구할 수 있나요?",
  summary: "묶음으로 파는 물건은 (묶음의 값) ÷ (묶음의 개수) × (살 개수)처럼 하나의 식으로 값을 구할 수 있어요. 물건값을 모두 더해 예산과 견주고, 거스름돈은 (낸 돈) − (물건값의 합)으로 구해요.",
  steps: [
    { name: "만져 보기 — 1모둠 바구니", inst: "1모둠(4명)이 꾸린 간식 바구니예요. 생수 4병, 주먹밥 4개, 귤 4개, 과자 2봉지를 샀어요. 물건마다 값을 하나의 식으로 나타내어 구하고, 모두 얼마인지 구해 보세요.", hints: ["생수 1병은 3000 ÷ 6원이에요. 4병은 3000 ÷ 6 × 4원이에요.", "네 가지 값을 모두 더해요."],
      render: (b, a) => mx1Basket(b, a, { items: MX1_SNACK, fixed: MX1_FIX, money: true, limit: 15000, title: "과학관 매점 가격표", totQ: "바구니 값은 모두",
        ok: "바구니 값은 모두 {sum}원이에요. 15000원보다 적어서 예산 안에 들어요. 남는 돈은 {left}원이에요." }) },
    { name: "그려 보기 — 거스름돈을 하나의 식으로", inst: "2모둠은 생수 4병과 과자 2봉지만 사고 10000원을 냈어요. 받아야 하는 거스름돈을 하나의 식으로 나타내어 구해 보세요.", hints: ["생수 4병의 값은 3000 ÷ 6 × 4, 과자 2봉지의 값은 4500 ÷ 3 × 2예요.", "두 값의 합을 ( )로 묶어 10000에서 빼요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Tags([["생수 6병", "3000원"], ["과자 3봉지", "4500원"]]), cards: [10000, 3000, 6, 4, 4500, 3, 2], target: MXV("10000−(3000÷6×4+4500÷3×2)"), ex: "10000−(3000÷6×4+4500÷3×2)", ansQ: "거스름돈은", unit: "원",
        ok: `10000 − (3000 ÷ 6 × 4 + 4500 ÷ 3 × 2) = 10000 − (2000 + 3000) = ${MXV("10000−(3000÷6×4+4500÷3×2)")}, ${MXV("10000−(3000÷6×4+4500÷3×2)")}원이에요.` }) },
    { name: "만들기 — 우리 모둠 바구니", inst: "이제 우리 모둠의 간식 바구니를 직접 꾸려요. 4명이 먹을 간식을 고르고, 물건마다 값을 하나의 식으로 구한 다음 모두 얼마인지 구해요. 15000원을 넘으면 물건을 바꿔요.", hints: ["물건 1개(1병, 1봉지)의 값은 (묶음의 값) ÷ (묶음의 개수)예요.", "모두 더한 값이 15000원보다 많으면 빼거나 싼 물건으로 바꿔요."],
      render: (b, a) => mx1Basket(b, a, { items: MX1_SNACK, money: true, limit: 15000, totQ: "바구니 값은 모두", ok: "우리 모둠 바구니는 모두 {sum}원이에요. 15000원 안에 들어요! 남는 돈은 {left}원이에요." }) },
    { name: "말해 보기 — 바구니 발표", inst: "우리 모둠 바구니를 반 친구들에게 소개하는 발표 글을 써 보세요.", hints: ["무엇을 몇 개 골랐고 왜 골랐는지 써요.", "값을 구한 식 하나를 예로 들어요."],
      render: (b, a) => writeStep(b, a, [
        { q: "무엇을 골랐고, 왜 골랐는지 써 보세요.", tag: "고른 것", ph: "우리 모둠은 ~을 골랐어요. 왜냐하면 ~", help: ["① 고른 물건과 개수를 써요. → ② 4명에게 알맞은 까닭을 써요.", "‘우리 모둠은 ○○ □개, … 를 골랐어요. 4명이 ~하려고요.’ 꼴로 써요."], ans: "우리 모둠은 생수 4병, 주먹밥 4개, 귤 4개를 골랐어요. 4명이 한 개씩 똑같이 먹고 마실 수 있게 하려고요." },
        { q: "값을 구한 식 하나와 계산 순서를 설명해 보세요.", tag: "식", ph: "주먹밥 4개의 값은 3000 ÷ 2 × 4로 ~", help: ["① 식 하나를 골라 써요. → ② 무엇을 먼저 계산했는지와 그 까닭을 써요.", "‘○○ □개의 값은 ~ = ~원이에요. 1개의 값을 먼저 구하려고 ~을 먼저 계산했어요.’ 꼴로 써요."], ans: "주먹밥 4개의 값은 3000 ÷ 2 × 4 = 1500 × 4 = 6000원이에요. 주먹밥 1개의 값을 먼저 구하려고 앞에서부터 3000 ÷ 2를 먼저 계산했어요." }]) }
  ],
  challenge: { inst: `★ 도전 — 1모둠 바구니 값은 모두 ${MX1_FIXSUM}원이었어요. 문제를 해결해 보세요.`, hints: ["바구니 값을 4명이 똑같이 나누어 내요.", "남는 돈 15000 − 12200으로 300원짜리 귤을 몇 개 살 수 있는지 나누어 봐요."],
    render: (b, a) => mx1Ask(b, a, [
      { q: `1모둠 4명이 바구니 값을 똑같이 나누어 내면 한 명이 낼 돈은? (2000 + 6000 + 1200 + 3000) ÷ 4 =`, a: MX1_FIXSUM / 4, unit: "원", why: { "9950": "2000 + 6000 + 1200 + 3000 ÷ 4처럼 ( ) 없이 계산하면 3000만 나누게 돼요. 합을 먼저 구해 4로 나누어요." } },
      { q: "15000원에서 남는 돈으로 귤(1개 300원)을 더 산다면 최대 몇 개 살 수 있나요?", a: Math.floor((15000 - MX1_FIXSUM) / 300), unit: "개" }],
      { ok: `(2000 + 6000 + 1200 + 3000) ÷ 4 = ${MX1_FIXSUM / 4}원씩 내고, 남는 돈 ${15000 - MX1_FIXSUM}원으로 귤을 ${Math.floor((15000 - MX1_FIXSUM) / 300)}개 더 살 수 있어요.` }) }
},
{
  id: "s9", no: 9, title: "버스 안 혼합 계산 빙고", soop: "발표하기(P)",
  question: "수 카드로 혼합 계산식을 만들어 빙고 놀이를 할 수 있나요?",
  summary: "뒤집은 수 카드 3장을 모두 쓰고 +, −, ×, ÷ 중 서로 다른 2가지 이상을 써서 식을 만들어요. 계산 순서에 맞게 정확히 계산해야 놀이판의 수를 색칠할 수 있어요.",
  steps: [
    { name: "규칙 알기", inst: "과학관에 가는 버스 안에서 혼합 계산 빙고를 해요. 놀이 규칙을 확인해 보세요. 놀이판에는 1부터 25까지의 수 중 16개를 써요.", hints: ["뒤집은 카드는 모두 써야 해요. 같은 수를 여러 번 써도 돼요.", "+, −, ×, ÷ 중 서로 다른 2가지 이상을 써요."],
      render: (b, a) => mx1Ask(b, a, [
        { q: "뒤집은 카드가 4, 6, 2예요. 규칙에 맞는 식은?", o: ["4 + 6 + 2", "4 × 6 ÷ 2", "4 × 6"], a: 1, why: { "0": "+ 한 가지 기호만 썼어요. 서로 다른 2가지를 써야 해요.", "2": "카드 2를 쓰지 않았어요." } },
        { q: "4 × 6 ÷ 2 =", a: MXV("4×6÷2") },
        { q: "카드가 7, 5, 8일 때 하린이가 만든 식 7 + 5 − 8 + 5 =", a: MXV("7+5−8+5") },
        { q: "친구가 만든 식의 계산 결과가 맞으면?", o: ["모든 사람이 놀이판에서 그 수를 찾아 색칠해요.", "식을 만든 사람만 색칠해요."], a: 0 }],
        { ok: "규칙을 모두 알았어요. 놀이판을 만들어 봐요!" }) },
    { name: "놀이판 만들기", inst: "1부터 25까지의 수 중에서 16개를 골라 내 놀이판에 써넣어요. 놀이판은 친구에게 보여 주지 않아요.", hints: ["같은 수는 한 번만 써요.", "작은 수와 큰 수를 골고루 넣으면 좋아요."],
      render: (b, a) => mx1BoardMake(b, a) },
    { name: "놀이하기", inst: "수 카드 3장으로 식을 만들어 내 놀이판의 수가 나오게 하고 ‘이 식 내기’를 눌러요. 한 줄을 먼저 색칠하면 빙고!", hints: ["카드 세 장으로 만들 수 있는 여러 식을 떠올려 봐요.", "놀이판에 없는 수가 나오면 다른 식을 만들거나 카드를 다시 뽑아요."],
      render: (b, a) => mx1Bingo(b, a, { goal: 1, ok: "빙고! 계산 순서에 맞게 정확히 계산했어요!" }) },
    { name: "말해 보기 — 빙고 비법", inst: "놀이를 하며 알게 된 비법을 친구들에게 알려 줘요.", hints: ["곱셈을 쓰면 큰 수, 빼거나 나누면 작은 수가 나와요.", "( )를 쓰면 결과를 바꿀 수 있어요."],
      render: (b, a) => writeStep(b, a, [
        { q: "원하는 수를 만들 때 쓴 비법을 써 보세요.", tag: "비법", ph: "큰 수가 필요할 때는 ~", help: ["① 큰 수나 작은 수가 필요할 때 어떤 기호를 썼는지 떠올려요. → ② ( )를 언제 썼는지 써요.", "‘큰 수가 필요하면 ~을, 작은 수가 필요하면 ~을 쓰고, ( )를 넣어 ~했어요.’ 꼴로 써요."], ans: "큰 수가 필요하면 곱셈을, 작은 수가 필요하면 뺄셈이나 나눗셈을 썼어요. ( )를 넣으면 먼저 계산하는 곳이 바뀌어서 결과를 다르게 만들 수 있어요." }]) }
  ],
  challenge: { inst: "★ 도전 — 이번에는 두 줄을 색칠해 빙고를 완성해 보세요.", hints: ["이미 색칠한 줄과 이어지는 칸의 수를 노려 봐요."],
    render: (b, a) => mx1Bingo(b, a, { goal: 2, ok: "두 줄 빙고! 여러 가지 혼합 계산식을 정확히 계산했어요!" }) }
},
{
  id: "s10", no: 10, title: "체험 학습을 다녀왔어요! 배운 것을 발표해요", soop: "발표하기(P)",
  question: "체험 학습을 계획하며 배운 혼합 계산을 친구들에게 설명할 수 있나요?",
  summary: "( ) 안을 가장 먼저 계산하고, 곱셈과 나눗셈을 먼저, 덧셈과 뺄셈은 그다음에 계산해요. 같은 단계끼리는 앞에서부터 차례대로 계산해요. 생활 속 상황을 하나의 식으로 나타낼 때는 먼저 구해야 하는 부분을 ( )로 묶어요.",
  steps: [
    { name: "만져 보기 — 체험 학습 결산 식", inst: "계획단이 체험 학습에서 쓴 식들을 모았어요. 식과 계산 결과를 이어 보세요.", hints: ["곱셈과 나눗셈을 먼저 계산해요.", "( )가 있으면 ( ) 안을 가장 먼저 계산해요."],
      render: (b, a) => mx1Match(b, a, { left: ["8×5−35÷5+13", "17+2×(41−27)÷7", "(30−6)÷4×3"], right: [MXV("17+2×(41−27)÷7"), 14, MXV("(30−6)÷4×3"), MXV("8×5−35÷5+13")], ok: "세 식 모두 계산 순서에 맞게 계산했어요." }) },
    { name: "그려 보기 — 계산 순서 나타내기", inst: "계산 순서를 나타내고 계산해 보세요.", hints: ["2 + 4 × 7 − 15 ÷ 3은 곱셈과 나눗셈을 먼저 해요.", "32 ÷ (13 − 5) × 6은 ( ) 안 → 나눗셈 → 곱셈 순서예요."],
      render: (b, a) => mx1Order(b, a, [{ e: "2+4×7−15÷3" }, { e: "32÷(13−5)×6" }], { ok: `2 + 4 × 7 − 15 ÷ 3 = ${MXV("2+4×7−15÷3")}, 32 ÷ (13 − 5) × 6 = ${mx1J(MXV("32÷(13−5)×6"), "이에요")}.` }) },
    { name: "확인하기 — 기념품 거스름돈", inst: "지우가 기념품 가게에서 5000원으로 배지 1개(2500원)와 엽서 2장을 샀어요. 엽서는 3장에 1200원이에요. 남은 돈은 얼마인지 하나의 식으로 나타내어 구해 보세요.", hints: ["엽서 2장의 값은 1200 ÷ 3 × 2원이에요.", "배지와 엽서의 값을 ( )로 묶어 5000에서 빼요."],
      render: (b, a) => mx1Build(b, a, { pic: () => mx1Tags([["배지 1개", "2500원"], ["엽서 3장", "1200원"]]), cards: [5000, 2500, 1200, 3, 2], target: MXV("5000−(2500+1200÷3×2)"), ex: "5000−(2500+1200÷3×2)", ansQ: "남은 돈은", unit: "원",
        why: { "3300": "5000 − 2500 + 1200 ÷ 3 × 2처럼 ( ) 없이 쓰면 엽서값을 더하게 돼요. 산 물건값의 합을 ( )로 묶어 빼요." },
        ok: `5000 − (2500 + 1200 ÷ 3 × 2) = 5000 − (2500 + 800) = ${MXV("5000−(2500+1200÷3×2)")}, 남은 돈은 ${MXV("5000−(2500+1200÷3×2)")}원이에요.` }) },
    { name: "말해 보기 — 체험 학습 발표", inst: "체험 학습을 계획하며 배운 혼합 계산을 반 친구들 앞에서 발표하려고 해요. 발표할 내용을 써 보세요.", hints: ["어떤 상황에서 하나의 식을 만들었는지 떠올려요.", "계산 순서를 지켜야 하는 까닭도 말해요."],
      render: (b, a) => writeStep(b, a, [
        { q: "체험 학습 계획에서 하나의 식으로 나타냈던 상황 하나를 발표해 보세요.", tag: "상황", ph: "영상관 표값을 구할 때 ~", help: ["① 어떤 상황이었는지 써요. → ② 만든 식과 답을 써요.", "‘~을 구할 때 ~ = ~이라는 식을 만들어 ~을 구했어요.’ 꼴로 써요."], ans: "4D 영상관 표값을 구할 때 2000 + 1000 × 24 − 3000 = 23000이라는 식을 만들어 내야 할 돈 23000원을 구했어요." },
        { q: "계산 순서를 지켜야 하는 까닭을 발표해 보세요.", tag: "까닭", ph: "계산 순서가 다르면 ~", help: ["① 계산 순서를 다르게 하면 어떤 일이 생겼는지 떠올려요. → ② 약속이 왜 필요한지 써요.", "‘계산 순서가 다르면 ~이 달라지기 때문에, 모두 같은 ~을 지켜야 해요.’ 꼴로 써요."], ans: "같은 식이라도 계산 순서가 다르면 결과가 달라지기 때문에, 모두가 같은 답을 얻으려면 ( ) 안 → 곱셈과 나눗셈 → 덧셈과 뺄셈 순서를 지켜야 해요." }]) },
    { name: "되돌아보기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["혼합 계산을 배우기 전의 생각을 떠올려요.", "버스 빈자리, 표값, 간식 바구니, 빙고를 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "배우기 전의 생각", ex: ["예전에는 식을 언제나 앞에서부터 차례대로 계산하면 된다고 생각했어요.", "예전에는 여러 가지 계산을 따로따로 써야 한다고 생각했어요."] },
          { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 곱셈과 나눗셈을 덧셈과 뺄셈보다 먼저 계산해야 한다는 것을 알아요.", "지금은 ( )를 쓰면 여러 계산을 하나의 식으로 나타낼 수 있다고 생각해요."] },
          { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["영상관 표값을 2000 + 1000을 먼저 계산했더니 선생님 표값까지 24번 세게 되는 것을 보고 바뀌었어요.", "버스 빈자리를 45 − 26 + 2로 구했더니 틀린 것을 보고 ( )가 필요하다는 것을 알았어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "★★ 도전 — ( )를 넣어 계산 결과가 8이 되게 하고, ○ 안에 ×, ÷를 넣어 결과가 가장 크게 만들어 보세요.", hints: ["18 + 12를 먼저 계산하면 어떻게 될까요?", "나누는 수는 작게, 곱하는 수는 크게 해 봐요."],
    render: (b, a) => mx1Chain(b, a, [
      (b2, a2) => mx1Paren(b2, a2, [{ e: "18+12÷3−2", target: 8 }], { ok: "(18 + 12) ÷ 3 − 2 = 30 ÷ 3 − 2 = 10 − 2 = 8이에요." }),
      (b2, a2) => mx1Ops(b2, a2, [{ tpl: "48 ○ (6 ○ 2)", ops: ["×", "÷"], once: true, goal: "max", calc: true }], { ok: `48 × (6 ÷ 2) = 48 × 3 = ${mx1J(MXV("48×(6÷2)"), "이에요")}. 단원을 끝까지 해냈어요!` })]) }
}
];
