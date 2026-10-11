//@@APP
const APP = {title:"할머니를 맞이하는 약수와 배수", unit:"5-1 수학 2. 약수와 배수(교과서)", key:"t51-factor-v1", welcome:"할머니를 맞이하는 약수와 배수 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 할머니와 함께 살게 된 윤우와 꽃을 나누어 꽂고, 선물 상자를 나누고, 박수를 치며 걸으면서 약수와 배수를 배워요."};
//@@UNIT
/* ===== 2. 약수와 배수 단원 조작 부품 (앞글자 fm2) ===== */
const FM2 = { blue: "#2B7BD6", org: "#E47A38", pine: "#2F6B57", red: "#D9534F", soft: "#FDEBD9", bsoft: "#DCEBFA", gsoft: "#DDF0E4", gray: "#B9C4C0", ink: "#1D2A2A", yel: "#FFF1BF", pink: "#F3B6C8", purple: "#8A6FD1" };
/* ---- 수 계산 (모든 답은 여기서 계산) ---- */
function fm2Divs(n) { const r = []; for (let d = 1; d <= n; d++) if (n % d === 0) r.push(d); return r; }
const fm2Mults = (n, k) => Array.from({ length: k }, (_, i) => n * (i + 1));
const fm2MultsTo = (n, max) => fm2Mults(n, Math.floor(max / n));
const fm2Gcd = (a, b) => b ? fm2Gcd(b, a % b) : a;
const fm2Lcm = (a, b) => a / fm2Gcd(a, b) * b;
const fm2Both = (A, B) => A.filter(x => B.includes(x));
const fm2Range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
/* 1과 자기 자신이 아닌 두 수의 곱: 12 → [[2,6],[3,4]] */
function fm2Split(v) { const r = []; for (let d = 2; d * d <= v; d++) if (v % d === 0) r.push([d, v / d]); return r; }
/* 더 이상 나눌 수 없는 수들의 곱: 12 → [2,2,3] */
function fm2Leaves(v) { const r = []; let x = v; for (let d = 2; d * d <= x; d++) while (x % d === 0) { r.push(d); x /= d; } if (x > 1) r.push(x); return r; }
/* 두 목록에 공통으로 들어 있는 수(같은 수가 여러 번이면 그만큼) */
function fm2Meet(A, B) { const b = B.slice(), c = []; A.forEach(x => { const i = b.indexOf(x); if (i >= 0) { c.push(x); b.splice(i, 1); } }); return c; }
function fm2Minus(A, C) { const a = A.slice(); C.forEach(x => { const i = a.indexOf(x); if (i >= 0) a.splice(i, 1); }); return a; }
const fm2Prod = A => A.reduce((p, x) => p * x, 1);
const fm2X = A => A.join(" × ");
const fm2L = A => A.join(", ");
/* 받침에 맞는 조사: fm2J(6, "과와") → "6과" */
function fm2J(w, pair) {
  const s = String(w), c = s[s.length - 1];
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"], "이라": ["이라", "라"] };
  const [a, b] = M[pair];
  if (pair === "으로") return s + (has && !rieul ? a : b);
  return s + (has ? a : b);
}
function fm2Style() {
  if (document.getElementById("fm2-style")) return;
  const s = document.createElement("style"); s.id = "fm2-style";
  s.textContent = `
.fm2q{display:flex;flex-wrap:wrap;align-items:center;gap:.3em .5em}
.fm2q .opts{flex-basis:100%}
.fm2q .fm2fig{flex-basis:100%}
input.fm2in{width:5.2em;font-size:1.12em;text-align:center}
input.fm2in.wide{width:min(100%,15em);text-align:left}
.fm2tip{flex-basis:100%;font-size:var(--fs-s);color:var(--muted)}
.fm2after{margin-top:1em;border-top:2px dashed var(--line);padding-top:.7em}
.fm2chips{display:flex;flex-wrap:wrap;gap:.35em}
.fm2chip{display:inline-block;padding:.15em .6em;border-radius:999px;background:var(--pine-soft);font-family:Jua,sans-serif}
.fm2chip.fm2no{background:#F8DADA}
.fm2btns{display:flex;flex-wrap:wrap;gap:.4em}
.fm2btns button{min-width:2.8em}
button.fm2sel{outline:3px solid var(--tent);outline-offset:1px;background:var(--ring-soft)}
.fm2say{background:var(--ring-soft);border-radius:.6em;padding:.45em .7em;line-height:1.55}
.fm2note{background:#FFF8E8;border:2px solid #EAD9B5;border-radius:var(--r);padding:.6em .9em;line-height:1.7;margin:.3em 0}
.fm2note b{font-family:Jua,sans-serif}
.fm2row{display:flex;flex-wrap:wrap;align-items:center;gap:.35em .5em}
.fm2dt{display:flex;flex-direction:column;gap:.45em}
.fm2dt .fm2row{font-family:Jua,sans-serif;font-size:1.12em}
.fm2bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(14em,1fr));gap:.7em;margin-top:.6em}
.fm2bin{min-height:7em;border:3px dashed var(--line);border-radius:var(--r);padding:.5em;display:flex;flex-direction:column;gap:.4em;cursor:pointer;background:#fff}
.fm2bin > b{font-family:Jua,sans-serif;color:var(--pine)}
.fm2cards{display:flex;flex-wrap:wrap;gap:.5em}
.fm2card{font-size:var(--fs-s);text-align:left;max-width:100%;white-space:normal}
.fm2card.fm2good{border-color:var(--ok)!important}
.fm2card.fm2bad{border-color:var(--no)!important;background:#FCE9E9}
.fm2log{font-size:var(--fs-s);max-height:9.5em;overflow:auto;line-height:1.55}
.fm2fig svg{width:100%;height:auto;max-width:640px;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:var(--r)}
`;
  document.head.append(s);
}
const fm2Num = s => { const t = String(s).replace(/[\s,]/g, ""); return t === "" ? null : (/^\d+$/.test(t) ? Number(t) : NaN); };
const fm2Paint = (el, good) => { el.style.borderColor = good ? "var(--ok)" : "var(--no)"; };
function fm2Input(label, wide) { return h("input", { type: "text", inputmode: wide ? "text" : "numeric", autocomplete: "off", class: "fm2in" + (wide ? " wide" : ""), "aria-label": label }); }
function fm2Note(...lines) { return () => h("div", { class: "fm2note" }, ...lines.map(l => h("div", {}, l))); }
function fm2Gate(api, ready, msg) {
  return Object.assign({}, api, { done: (ans, m, lv) => ready() ? api.done(ans, m, lv) : api.fail(typeof msg === "function" ? msg() : msg, ans) });
}

/* ① 묻고 답하기: 수 하나 / 수 여러 개(쉼표) / 고르기를 한 번에
   items: {q, a:수, unit, post, why:{값:"까닭"}} | {q, set:[수…], ordered, unit, why:{넣은 틀린 수:"까닭"}} | {q, o:[…], a:번호|[번호…], why:{번호:"까닭"}}  (fig: () => 요소) */
function fm2Ask(body, api, items, opt = {}) {
  fm2Style();
  const rows = items.map((it, i) => {
    const box = h("div", { class: "qitem fm2q" });
    const lead = items.length > 1 ? `${i + 1}. ` : "";
    const R = { it, box };
    if (it.fig) box.append(h("div", { class: "fm2fig" }, it.fig()));
    if (it.o) {
      R.sel = new Set(); const multi = Array.isArray(it.a);
      const row = h("div", { class: "opts" });
      it.o.forEach((o, oi) => row.append(h("button", { class: "opt", onclick: e => {
        [...row.children].forEach(b => b.classList.remove("good", "bad"));
        if (multi) { R.sel.has(oi) ? R.sel.delete(oi) : R.sel.add(oi); e.currentTarget.classList.toggle("on"); }
        else { R.sel.clear(); R.sel.add(oi); [...row.children].forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); }
      } }, o)));
      R.row = row;
      box.append(h("div", { class: "jua" }, lead + it.q + (multi ? " (모두 고르세요)" : "")), row);
    } else {
      R.inp = fm2Input(it.q, !!it.set);
      box.append(h("span", { class: "jua" }, lead + it.q), R.inp, it.post ? h("span", { class: "jua" }, it.post) : null, it.unit ? h("span", {}, it.unit) : null);
      if (it.set) box.append(h("div", { class: "fm2tip" }, it.ordered ? "작은 수부터 차례대로, 쉼표(,)로 나누어 써요." : "쉼표(,)로 나누어 써요."));
    }
    return R;
  });
  const ansText = R => R.it.o ? (Array.isArray(R.it.a) ? R.it.a : [R.it.a]).map(i => R.it.o[i]).join(", ") : R.it.set ? fm2L(R.it.set) + (R.it.unit ? " " + R.it.unit : "") : `${R.it.a}${R.it.unit ? " " + R.it.unit : ""}`;
  api.provide({ words: opt.words || [], answers: rows.map(R => `${R.it.q}${R.it.post ? " □ " + R.it.post : ""} → ${ansText(R)}`) });
  const judge = R => {
    const it = R.it;
    if (it.o) {
      const v = [...R.sel], want = Array.isArray(it.a) ? it.a : [it.a];
      const good = v.length === want.length && want.every(x => v.includes(x));
      [...R.row.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (R.sel.has(i)) b.classList.add(good ? "good" : "bad"); });
      const wrongOne = v.find(x => !want.includes(x));
      const msg = !v.length ? "보기를 골라요." : (wrongOne != null && it.why && it.why[String(wrongOne)]) || (v.length < want.length ? "알맞은 것을 더 골라 봐요." : null);
      return { good, msg, given: v.map(i => it.o[i]).join("·") || "-" };
    }
    const raw = R.inp.value;
    if (it.set) {
      const got = (raw.match(/\d+/g) || []).map(Number), uniq = [...new Set(got)];
      const extra = uniq.filter(x => !it.set.includes(x)), miss = it.set.filter(x => !uniq.includes(x));
      let good = !extra.length && !miss.length && got.length === it.set.length;
      if (good && it.ordered) good = got.every((x, k) => x === it.set[k]);
      fm2Paint(R.inp, good);
      let msg = null;
      if (!got.length) msg = "수를 써요.";
      else if (extra.length) msg = (it.why && it.why[String(extra[0])]) || `${fm2J(extra[0], "은는")} 답이 아니에요.`;
      else if (miss.length) msg = (it.why && it.why.miss) || `빠진 수가 ${miss.length}개 있어요.`;
      else if (got.length !== it.set.length) msg = "같은 수를 두 번 썼어요.";
      else if (!good) msg = "작은 수부터 차례대로 써요.";
      return { good, msg, given: raw || "-" };
    }
    const v = fm2Num(raw), good = v === it.a;
    fm2Paint(R.inp, good);
    return { good, msg: v == null ? "빈칸에 수를 써요." : (it.why && it.why[String(v)]) || null, given: raw || "-" };
  };
  body.append(...rows.map(R => R.box), h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const res = rows.map(judge), given = res.map(r => r.given).join(" / ");
    const bad = res.find(r => !r.good);
    if (!bad) return api.done(given, opt.ok);
    api.fail(bad.msg || opt.bad || "빨간 칸을 다시 생각해 봐요.", given);
  } }, "확인하기")));
}
/* 조작을 마친 뒤 물음으로 이어 가기 */
function fm2Then(host, api, ask, ok, given) {
  if (!ask || !ask.length) return api.done(given, ok);
  api.hint("○ 좋아요! 이어서 아래 물음에 답해요.");
  const box = h("div", { class: "fm2after" }); host.append(box);
  fm2Ask(box, api, ask, { ok });
  setTimeout(() => { try { box.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) {} }, 60);
}

/* 그림: 꽃 한 송이 */
function fm2Flower(x, y, s, col) {
  const g = svgEl("g");
  g.append(svgEl("line", { x1: x, y1: y + s * .4, x2: x, y2: y + s * 1.7, stroke: "#5A9E5A", "stroke-width": Math.max(2, s * .18) }));
  for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 - Math.PI / 2; g.append(svgEl("circle", { cx: x + Math.cos(a) * s * .55, cy: y + Math.sin(a) * s * .55, r: s * .45, fill: col || FM2.pink })); }
  g.append(svgEl("circle", { cx: x, cy: y, r: s * .35, fill: "#F6C945" }));
  return g;
}

/* ② 꽃병에 똑같이 나누어 꽂기  opt: n, kmax, item("꽃"), unit("송이"), holder("꽃병"), ask, ok */
function fm2Share(body, api, opt) {
  fm2Style();
  const n = opt.n, K = opt.kmax || n, item = opt.item || "꽃", unit = opt.unit || "송이", holder = opt.holder || "꽃병";
  let k = null, cnt = [];
  const res = {};
  const svg = makeSvg(900, 420);
  const left = () => n - cnt.reduce((s, x) => s + x, 0);
  const slot = i => { const sw = 860 / k; return { x: 20 + i * sw, w: sw }; };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 10, y: 10, width: 880, height: 110, rx: 16, fill: "#FFF8E8", stroke: "#EAD9B5", "stroke-width": 2 }));
    svg.append(txt(110, 36, `남은 ${item}: ${left()}${unit}`, 20, { fill: FM2.pine }));
    for (let i = 0; i < left(); i++) svg.append(fm2Flower(260 + i * 70, 52, 17));
    if (!k) { svg.append(txt(450, 270, `오른쪽에서 ${holder} 수를 골라요`, 26, { fill: "#8A9A95" })); return; }
    for (let i = 0; i < k; i++) {
      const s = slot(i), cx = s.x + s.w / 2, vw = Math.min(96, s.w - 16);
      svg.append(svgEl("rect", { x: s.x + 4, y: 140, width: s.w - 8, height: 268, rx: 14, fill: "#fff", stroke: "#DCE4E0", "stroke-width": 2, style: "cursor:pointer" }));
      const fl = Math.min(16, vw / 6);
      for (let j = 0; j < cnt[i]; j++) {
        const col = j % 3, row = Math.floor(j / 3);
        svg.append(fm2Flower(cx + (col - 1) * fl * 2.1, 176 + row * fl * 2.6, fl));
      }
      svg.append(svgEl("path", { d: `M${cx - vw * .32} 300 Q${cx - vw * .62} 340 ${cx - vw * .4} 380 L${cx + vw * .4} 380 Q${cx + vw * .62} 340 ${cx + vw * .32} 300 Z`, fill: "#BFDDF5", stroke: FM2.blue, "stroke-width": 3 }));
      svg.append(txt(cx, 397, `${cnt[i]}${unit}`, 18, { fill: FM2.ink }));
    }
  };
  const say = h("div", { class: "fm2say" }, `${holder} 수를 고른 다음, ${holder}을 눌러 ${item}을 한 ${unit}씩 꽂아요.`);
  const pick = h("div", { class: "fm2btns" });
  const table = h("div", { class: "fm2chips" });
  const showTable = () => { table.innerHTML = ""; fm2Range(1, K).forEach(j => { if (res[j] != null) table.append(h("span", { class: "fm2chip" + (res[j] ? "" : " fm2no") }, `${holder} ${j}개 ${res[j] ? "○" : "×"}`)); }); };
  const choose = j => { k = j; cnt = Array(j).fill(0); [...pick.children].forEach((b, i) => b.classList.toggle("fm2sel", i + 1 === j)); draw(); say.textContent = `${holder} ${j}개에 ${item} ${n}${fm2J(unit, "을를")} 남김없이 똑같이 꽂아 보세요.`; };
  fm2Range(1, K).forEach(j => pick.append(h("button", { class: "ghost", onclick: () => choose(j) }, `${j}개`)));
  const finishK = ok => {
    res[k] = ok; showTable();
    if (fm2Range(1, K).every(j => res[j] != null)) {
      const can = fm2Range(1, K).filter(j => res[j]);
      say.textContent = `${item} ${n}${fm2J(unit, "은는")} ${holder} ${fm2L(can)}개에 남김없이 똑같이 나누어 꽂을 수 있어요.`;
      fm2Then(body, api, opt.ask, opt.ok, `가능: ${fm2L(can)}`);
    }
  };
  const afterPut = () => {
    if (left() > 0) return;
    if (cnt.every(c => c === cnt[0])) { say.textContent = `○ ${holder} ${k}개에 ${cnt[0]}${unit}씩 똑같이 꽂았어요. ${n} ÷ ${k} = ${n / k}`; finishK(true); }
    else say.textContent = `${holder}마다 꽂힌 ${item}의 수가 달라요. ‘다시 꽂기’로 다시 해 보거나, 똑같이 나눌 수 없다고 생각하면 ‘똑같이 나눌 수 없어요’를 눌러요.`;
  };
  dragOn(svg, p => {
    if (!k || p.y < 140) return false;
    const i = Math.floor((p.x - 20) / (860 / k));
    if (i < 0 || i >= k) return false;
    if (left() === 0) { api.hint(`${item}을 모두 꽂았어요. 다시 하려면 ‘다시 꽂기’를 눌러요.`); return false; }
    cnt[i]++; draw(); afterPut(); return false;
  }, () => {}, null);
  const deal = h("button", { class: "ghost", onclick: () => { if (!k) return api.hint(`먼저 ${holder} 수를 골라요.`); let i = cnt.indexOf(Math.min(...cnt)); while (left() > 0) { cnt[i]++; i = (i + 1) % k; } draw(); afterPut(); } }, "한 송이씩 차례로 꽂기");
  const reset = h("button", { class: "ghost", onclick: () => { if (k) choose(k); } }, "다시 꽂기");
  const cant = h("button", { class: "ghost", onclick: () => {
    if (!k) return api.hint(`먼저 ${holder} 수를 골라요.`);
    api.tryOnce();
    if (n % k === 0) return api.fail(`${holder} ${k}개에는 ${n / k}${unit}씩 똑같이 꽂을 수 있어요. 한 ${unit}씩 차례로 꽂아 봐요.`, `${k}개 ×`);
    if (left() > 0) return api.hint(`먼저 ${item}을 모두 꽂아 보고 판단해요.`);
    const q = Math.floor(n / k), r = n % k;
    say.textContent = `맞아요. ${q + 1}${unit}씩 꽂으려면 ${holder} ${k - r}개에 1${unit}씩 부족하고, ${q}${unit}씩 꽂으면 ${r}${fm2J(unit, "이가")} 남아요. ${holder} ${k}개에는 똑같이 나눌 수 없어요.`;
    finishK(false);
  } }, "똑같이 나눌 수 없어요");
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("b", {}, `${holder} 수 고르기`), pick, say, h("div", { class: "fm2btns" }, deal, reset, cant), h("b", {}, "알아낸 것"), table)));
}

/* ③ 나눗셈식 표: n ÷ 1, n ÷ 2, … 의 몫과 나머지  opt: n, ds, given:[d…], ask, ok */
function fm2DivTable(body, api, opt) {
  fm2Style();
  const n = opt.n, given = opt.given || [];
  const rows = opt.ds.map(d => {
    const R = { d, q: Math.floor(n / d), r: n % d };
    const row = h("div", { class: "fm2row" }, `${n} ÷ ${d} = `);
    if (given.includes(d)) row.append(`${R.q}${R.r ? ` … ${R.r}` : ""}`);
    else { R.qi = fm2Input(`${n} ÷ ${d}의 몫`); R.ri = fm2Input(`${n} ÷ ${d}의 나머지`); row.append(R.qi, " … ", R.ri); }
    R.row = row; return R;
  });
  api.provide({ words: ["몫", "나머지", "나누어떨어져요"], answers: rows.map(R => `${n} ÷ ${R.d} = ${R.q}${R.r ? ` … ${R.r}` : ""}`) });
  const btn = h("button", { class: "big", onclick: () => {
    api.tryOnce(); let bad = null;
    rows.forEach(R => {
      if (!R.qi) return;
      const q = fm2Num(R.qi.value); let r = fm2Num(R.ri.value); if (r == null) r = 0;
      const gq = q === R.q, gr = r === R.r; fm2Paint(R.qi, gq); fm2Paint(R.ri, gr);
      if (!bad && !gq) bad = `${n} ÷ ${R.d}의 몫을 다시 구해 봐요. ${R.d} × □가 ${n}보다 크지 않으면서 가장 가깝게 되는 □를 찾아요.`;
      if (!bad && !gr) bad = `나머지는 ${n} − ${R.d} × ${fm2J(R.q, "으로")} 구해요.`;
    });
    const gv = rows.map(R => R.qi ? `${R.qi.value || "-"}…${R.ri.value || "0"}` : "주어짐").join(" / ");
    if (bad) return api.fail(bad, gv);
    btn.disabled = true;
    rows.forEach(R => { if (!R.r) R.row.append(h("span", { class: "fm2chip" }, "나누어떨어져요")); });
    fm2Then(body, api, opt.ask, opt.ok, gv);
  } }, "나눗셈 확인하기");
  body.append(h("div", { class: "fm2dt" }, ...rows.map(R => R.row)), h("p", { class: "inst", style: "font-size:var(--fs-s)" }, "나머지가 없으면 나머지 칸을 비워 두거나 0을 써요."), h("div", { class: "fm2btns" }, btn));
}

/* ④ 바둑돌·학생 늘어놓기: 한 줄에 똑같은 수씩 줄 세우기  opt: n, item, unit("개"), ask, ok */
function fm2Rect(body, api, opt) {
  fm2Style();
  const n = opt.n, item = opt.item || "바둑돌", unit = opt.unit || "개", line = opt.line || "줄";
  const want = fm2Divs(n);
  let w = opt.start || Math.min(n, 4);
  const found = new Set();
  const svg = makeSvg(900, 400);
  const draw = () => {
    svg.innerHTML = "";
    const rows = Math.ceil(n / w), r = n % w;
    const cell = Math.min(64, 840 / w, 320 / rows);
    const x0 = 450 - cell * w / 2, y0 = 20 + (320 - cell * rows) / 2;
    for (let i = 0; i < n; i++) {
      const rr = Math.floor(i / w), cc = i % w, last = r && rr === rows - 1;
      svg.append(svgEl("circle", { cx: x0 + cc * cell + cell / 2, cy: y0 + rr * cell + cell / 2, r: cell * .4, fill: last ? FM2.org : (opt.color || FM2.ink), stroke: "#fff", "stroke-width": Math.min(2, cell * .08) }));
    }
    if (r) for (let cc = r; cc < w; cc++) svg.append(svgEl("circle", { cx: x0 + cc * cell + cell / 2, cy: y0 + (rows - 1) * cell + cell / 2, r: cell * .38, fill: "none", stroke: FM2.red, "stroke-width": 2, "stroke-dasharray": "4 3" }));
    svg.append(txt(450, 375, r ? `한 ${line}에 ${w}${unit}씩 ${rows - 1}${line}, 마지막 ${line}은 ${r}${unit}뿐이에요.` : `한 ${line}에 ${w}${unit}씩 ${rows}${line} → ${w} × ${rows} = ${n}`, 24, { fill: r ? FM2.red : FM2.pine }));
  };
  const inp = h("input", { type: "number", min: 1, max: n, value: w, class: "fm2in", "aria-label": `한 ${line}에 놓을 수` });
  const setW = v => { w = Math.max(1, Math.min(n, v | 0)); inp.value = w; draw(); };
  inp.addEventListener("input", () => { const v = fm2Num(inp.value); if (v) setW(v); });
  const chips = h("div", { class: "fm2chips" });
  const cntTxt = h("div", { class: "jua" });
  const showFound = () => { chips.innerHTML = ""; [...found].sort((a, b) => a - b).forEach(v => chips.append(h("span", { class: "fm2chip" }, `${v}${unit}씩 ${n / v}${line}`))); cntTxt.textContent = `찾은 방법 ${found.size}가지`; };
  const rec = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (n % w) return api.fail(`마지막 ${line}이 ${n % w}${unit}뿐이라 모든 ${line}이 똑같지 않아요. ${n} ÷ ${fm2J(w, "은는")} 나누어떨어지지 않아요.`, `${w}씩`);
    if (found.has(w)) return api.hint("이미 찾은 방법이에요. 다른 수로 늘어놓아 봐요.");
    found.add(w); showFound();
    if (found.size === want.length) {
      rec.disabled = true;
      api.hint(`○ ${n}${fm2J(unit, "을를").slice(unit.length)} 늘어놓는 방법을 모두 찾았어요.`);
      fm2Then(body, api, opt.ask, opt.ok, [...found].sort((a, b) => a - b).join(", "));
    } else api.hint(`○ 한 ${line}에 ${w}${unit}씩 ${n / w}${line}! 다른 방법도 찾아봐요.`);
  } }, "이 방법 기록하기");
  draw(); showFound();
  body.append(stageWrap(svg, h("div", { class: "side" },
    h("p", {}, opt.tip || `${item} ${n}${fm2J(unit, "을를")} 한 ${line}에 똑같은 수씩 늘어놓아요. 모든 ${line}이 똑같이 꽉 차면 기록해요.`),
    h("div", { class: "fm2row" }, `한 ${line}에`, h("button", { class: "ghost", onclick: () => setW(w - 1) }, "−"), inp, h("button", { class: "ghost", onclick: () => setW(w + 1) }, "+"), `${unit}씩`),
    rec, cntTxt, chips)));
}

/* ⑤ 수 줄 여러 개: 줄마다 알맞은 수에 ○표(찾기) → 두 줄에 모두 있는 수를 이어요
   opt: rows:[{label, nums, want, what, why(v), peek(v), color}], mode:"link"(○표 없이 바로 잇기), common:true, ask, ok */
function fm2Rows(body, api, opt) {
  fm2Style();
  const rows = opt.rows.map((r, i) => Object.assign({ marks: new Set(), color: i ? FM2.blue : FM2.org }, r));
  const link = opt.mode === "link";
  let phase = link ? 1 : 0;
  const com = new Set();
  const maxLen = Math.max(...rows.map(r => r.nums.length));
  const W = 900, LW = 160, cw = Math.min(70, (W - LW - 16) / maxLen), CH = 54, GAP = 110;
  const Y = i => 24 + i * (CH + GAP);
  const H = Y(rows.length - 1) + CH + 24;
  const svg = makeSvg(W, H);
  const cx = k => LW + k * cw + cw / 2;
  const fs = Math.min(24, cw * .46);
  const target = () => { const s = rows.map(r => r.want || r.nums); return s[0].filter(v => s.slice(1).every(x => x.includes(v))); };
  const draw = () => {
    svg.innerHTML = "";
    if (phase >= 1) [...com].forEach(v => { for (let i = 0; i < rows.length - 1; i++) { const a = rows[i].nums.indexOf(v), b = rows[i + 1].nums.indexOf(v); if (a >= 0 && b >= 0) svg.append(svgEl("line", { x1: cx(a), y1: Y(i) + CH, x2: cx(b), y2: Y(i + 1), stroke: FM2.pine, "stroke-width": 4 })); } });
    rows.forEach((r, i) => {
      svg.append(txt(LW / 2 - 4, Y(i) + CH / 2, r.label, r.label.length > 7 ? 17 : 20, { fill: r.color }));
      r.nums.forEach((v, k) => {
        const hit = phase >= 1 && com.has(v);
        svg.append(svgEl("rect", { x: LW + k * cw + 2, y: Y(i), width: cw - 4, height: CH, rx: 8, fill: hit ? FM2.gsoft : "#fff", stroke: hit ? FM2.pine : "#C9D3CF", "stroke-width": hit ? 3 : 1.5, style: "cursor:pointer" }));
        svg.append(txt(cx(k), Y(i) + CH / 2 + 1, String(v), fs));
        if (!link && r.marks.has(v)) svg.append(svgEl("circle", { cx: cx(k), cy: Y(i) + CH / 2, r: Math.min(cw, CH) / 2 - 3, fill: "none", stroke: r.color, "stroke-width": 3 }));
      });
    });
  };
  const say = h("div", { class: "fm2say" });
  const peek = h("div", { class: "jua", style: "color:var(--pine)" });
  const setSay = () => { say.textContent = phase === 0 ? (opt.say0 || "줄마다 알맞은 수를 눌러 ○표 해요. 다시 누르면 지워져요.") : (opt.say1 || "두 줄에 모두 들어 있는 수를 눌러 같은 수끼리 이어요."); };
  dragOn(svg, p => {
    rows.forEach((r, i) => {
      if (p.y < Y(i) || p.y > Y(i) + CH) return;
      const k = Math.floor((p.x - LW) / cw); if (k < 0 || k >= r.nums.length) return;
      const v = r.nums[k];
      if (phase === 0) { r.marks.has(v) ? r.marks.delete(v) : r.marks.add(v); if (r.peek) peek.textContent = r.peek(v); }
      else if (phase === 1) {
        if (com.has(v)) com.delete(v);
        else if (rows.some(o => !o.nums.includes(v))) api.hint(`${fm2J(v, "은는")} 다른 줄에 없어요.`);
        else com.add(v);
      }
      draw();
    });
    return false;
  }, () => {}, null);
  const chk = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (phase === 0) {
      for (const r of rows) {
        const got = [...r.marks];
        const extra = got.filter(v => !r.want.includes(v)).sort((a, b) => a - b), miss = r.want.filter(v => !r.marks.has(v));
        if (!got.length) return api.fail(`${r.label} 줄에 아직 ○표를 하지 않았어요.`, "-");
        if (extra.length) return api.fail(r.why ? r.why(extra[0]) : `${fm2J(extra[0], "은는")} ${fm2J(r.what, "이가")} 아니에요.`, got.join(","));
        if (miss.length) return api.fail(`${r.label} 줄에서 ${fm2J(r.what, "을를")} 더 찾아봐요. ${r.miss || ""}`, got.join(","));
      }
      if (!opt.common) { chk.disabled = true; return fm2Then(body, api, opt.ask, opt.ok, rows.map(r => r.want.join(",")).join(" / ")); }
      phase = 1; setSay(); draw(); api.hint("○ ○표를 모두 알맞게 했어요. 이제 두 줄에 모두 ○표 한 수를 눌러 이어요."); return;
    }
    const t = target(), got = [...com];
    const extra = got.filter(v => !t.includes(v)), miss = t.filter(v => !com.has(v));
    if (!got.length) return api.fail("두 줄에 모두 있는 수를 눌러 이어요.", "-");
    if (extra.length) return api.fail(`${fm2J(extra[0], "은는")} ${opt.notBoth || "두 줄에 모두 ○표 한 수가 아니에요."}`, got.join(","));
    if (miss.length) return api.fail(`두 줄에 모두 있는 수가 ${miss.length}개 더 있어요.`, got.join(","));
    chk.disabled = true; phase = 2;
    say.textContent = (opt.found || "두 줄에 모두 있는 수: ") + fm2L(t.slice().sort((a, b) => a - b));
    fm2Then(body, api, opt.ask, opt.ok, "공통: " + fm2L(t));
  } }, "확인하기");
  const reset = h("button", { class: "ghost", onclick: () => { if (phase === 0) rows.forEach(r => r.marks.clear()); else if (phase === 1) com.clear(); draw(); } }, "지우기");
  api.provide({ words: opt.words || [], answers: rows.filter(r => r.want).map(r => `${r.label}: ${fm2L(r.want)}`).concat(opt.common ? [`공통: ${fm2L(target())}`] : []) });
  setSay(); draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, say, peek, h("div", { class: "fm2btns" }, chk, reset))));
}

/* ⑥ 수 배열판: ○표·색칠·△표  opt: nums, cols, layers:[{name, want, shape:"circle"|"fill"|"tri", color}], ask, ok */
function fm2Board(body, api, opt) {
  fm2Style();
  const nums = opt.nums, cols = opt.cols || 10, CW = opt.cell || 72, R = Math.ceil(nums.length / cols);
  const layers = opt.layers.map((L, i) => Object.assign({ marks: new Set(), color: [FM2.org, FM2.blue, FM2.purple][i], shape: "circle" }, L));
  let cur = 0;
  const svg = makeSvg(cols * CW + 20, R * CW + 20);
  const pos = k => ({ x: 10 + (k % cols) * CW, y: 10 + Math.floor(k / cols) * CW });
  const draw = () => {
    svg.innerHTML = "";
    nums.forEach((v, k) => {
      const p = pos(k);
      const fill = layers.find(L => L.shape === "fill" && L.marks.has(v));
      svg.append(svgEl("rect", { x: p.x + 2, y: p.y + 2, width: CW - 4, height: CW - 4, rx: 8, fill: fill ? "#FFD9B8" : "#fff", stroke: "#C9D3CF", "stroke-width": 1.5, style: "cursor:pointer" }));
      layers.forEach(L => {
        if (!L.marks.has(v)) return;
        if (L.shape === "circle") svg.append(svgEl("circle", { cx: p.x + CW / 2, cy: p.y + CW / 2, r: CW * .36, fill: "none", stroke: L.color, "stroke-width": 3.5 }));
        if (L.shape === "tri") svg.append(svgEl("polygon", { points: `${p.x + CW / 2},${p.y + 6} ${p.x + 7},${p.y + CW - 8} ${p.x + CW - 7},${p.y + CW - 8}`, fill: "none", stroke: L.color, "stroke-width": 3 }));
      });
      svg.append(txt(p.x + CW / 2, p.y + CW / 2 + (layers.some(L => L.shape === "tri" && L.marks.has(v)) ? 7 : 1), String(v), CW * .36));
    });
  };
  const tools = h("div", { class: "fm2btns" });
  const syncTools = () => [...tools.children].forEach((b, i) => b.classList.toggle("fm2sel", i === cur));
  if (layers.length > 1) layers.forEach((L, i) => tools.append(h("button", { class: "ghost", onclick: () => { cur = i; syncTools(); } }, `${L.shape === "tri" ? "△" : L.shape === "fill" ? "색칠" : "○"} ${L.name}`)));
  dragOn(svg, p => {
    const c = Math.floor((p.x - 10) / CW), r = Math.floor((p.y - 10) / CW), k = r * cols + c;
    if (c < 0 || c >= cols || r < 0 || k >= nums.length) return false;
    const L = layers[cur], v = nums[k]; L.marks.has(v) ? L.marks.delete(v) : L.marks.add(v); draw(); return false;
  }, () => {}, null);
  const chk = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    for (const L of layers) {
      const got = [...L.marks].sort((a, b) => a - b), extra = got.filter(v => !L.want.includes(v)), miss = L.want.filter(v => !L.marks.has(v));
      if (!got.length) return api.fail(`${fm2J(L.name, "을를")} 찾아 표시해요.`, "-");
      if (extra.length) return api.fail(`${fm2J(extra[0], "은는")} ${fm2J(L.name, "이가")} 아니에요.${L.why ? " " + L.why(extra[0]) : ""}`, got.join(","));
      if (miss.length) return api.fail(`${fm2J(L.name, "을를")} 더 찾아봐요. ${L.miss || ""}`, got.join(","));
    }
    chk.disabled = true;
    fm2Then(body, api, opt.ask, opt.ok, layers.map(L => `${L.name}: ${fm2L(L.want)}`).join(" / "));
  } }, "확인하기");
  api.provide({ words: opt.words || [], answers: layers.map(L => `${L.name}: ${fm2L(L.want)}`) });
  syncTools(); draw();
  const side = h("div", { class: "side" }, h("p", {}, opt.tip || (layers.length > 1 ? "표시할 것을 고른 다음 수를 눌러요. 다시 누르면 지워져요." : "알맞은 수를 눌러 표시해요. 다시 누르면 지워져요.")), tools, h("div", { class: "fm2btns" }, chk, h("button", { class: "ghost", onclick: () => { layers.forEach(L => L.marks.clear()); draw(); } }, "지우기")));
  body.append(nums.length > 12 ? stageWrap(svg, side) : h("div", {}, h("div", { class: "stage", style: "max-width:720px" }, svg), side));
}

/* ⑦ 수직선 뛰어 세기: 뛰어 도착하는 곳을 눌러요  opt: max, hops:[{n, count, name, color, tag(k)}], lab, snap, zero, ask, ok */
function fm2Hop(body, api, opt) {
  fm2Style();
  const max = opt.max, two = opt.hops.length > 1, snap = opt.snap || 1, lab = opt.lab || 1;
  const hops = opt.hops.map((t, i) => Object.assign({ done: 0, color: i ? FM2.blue : FM2.org }, t));
  let ti = 0;
  const LY = two ? 170 : 200, H = two ? 330 : 290;
  const svg = makeSvg(900, H);
  const X = v => 40 + v / max * 820;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("line", { x1: 30, y1: LY, x2: 875, y2: LY, stroke: FM2.ink, "stroke-width": 3 }));
    for (let v = 0; v <= max; v += snap) {
      const big = v % lab === 0;
      svg.append(svgEl("line", { x1: X(v), y1: LY - (big ? 10 : 6), x2: X(v), y2: LY + (big ? 10 : 6), stroke: FM2.ink, "stroke-width": big ? 2 : 1 }));
      if (big) svg.append(txt(X(v), LY + (two ? 30 : 28), String(v), max > 30 ? 15 : 18, { fill: "#55615D" }));
    }
    if (opt.zero) svg.append(txt(X(0) + 4, LY + (two ? 52 : 52), opt.zero, 15, { fill: FM2.pine }));
    hops.forEach((t, i) => {
      const up = i === 0, hgt = Math.min(85, 20 + t.n / max * 820 * .45);
      for (let k = 0; k < t.done; k++) {
        const a = X(k * t.n), b = X((k + 1) * t.n), m = (a + b) / 2;
        svg.append(svgEl("path", { d: `M${a} ${LY} Q${m} ${up ? LY - hgt * 2 : LY + hgt * 2} ${b} ${LY}`, fill: "none", stroke: t.color, "stroke-width": 3 }));
        svg.append(svgEl("circle", { cx: b, cy: LY, r: 7, fill: t.color }));
        if (t.tag) svg.append(txt(m, up ? LY - hgt - 8 : LY + hgt + 10, t.tag(k + 1), 15, { fill: t.color }));
        svg.append(txt(b, up ? LY - 22 : LY + (two ? 58 : 48), String((k + 1) * t.n), 17, { fill: t.color }));
      }
      svg.append(txt(two ? 100 : 120, up ? 24 : H - 18, `${t.name}: ${t.n}씩`, 18, { fill: t.color }));
    });
    if (hops.every(t => t.done >= t.count) && two) {
      const A = fm2Mults(hops[0].n, hops[0].count), B = fm2Mults(hops[1].n, hops[1].count);
      fm2Both(A, B).forEach(v => svg.append(svgEl("circle", { cx: X(v), cy: LY, r: 13, fill: "none", stroke: FM2.pine, "stroke-width": 4 })));
    }
  };
  const say = h("div", { class: "fm2say" });
  const setSay = () => {
    const t = hops[ti];
    say.textContent = t ? `${t.name}: ${t.done * t.n}에서 ${t.n}만큼 뛰면 어디에 도착할까요? 수직선에서 그곳을 눌러요. (${t.done}/${t.count})` : "다 뛰었어요.";
  };
  dragOn(svg, p => {
    const t = hops[ti]; if (!t) return false;
    const v = Math.round((p.x - 40) / 820 * max / snap) * snap;
    if (v < 0 || v > max) return false;
    const want = (t.done + 1) * t.n;
    if (v === want) {
      t.done++;
      if (t.done >= t.count) ti++;
      draw(); setSay();
      if (ti >= hops.length) {
        if (two) { const c = fm2Both(fm2Mults(hops[0].n, hops[0].count), fm2Mults(hops[1].n, hops[1].count)); say.textContent = `두 줄이 함께 도착한 곳: ${fm2L(c)}`; }
        fm2Then(body, api, opt.ask, opt.ok, hops.map(t => fm2L(fm2Mults(t.n, t.count))).join(" / "));
      }
    } else if (v <= t.done * t.n) api.hint(`${t.done * t.n}보다 오른쪽을 눌러요.`);
    else { api.tryOnce(); api.fail(`${t.name}${fm2J(t.name, "은는").slice(t.name.length)} ${t.n}씩 뛰어요. ${t.done * t.n}에서 ${t.n}만큼 더 가면 어디일까요?`, String(v)); }
    return false;
  }, () => {}, null);
  api.provide({ words: opt.words || [], answers: hops.map(t => `${t.name}: ${fm2L(fm2Mults(t.n, t.count))}`) });
  draw(); setSay();
  body.append(h("div", { class: "stage" }, svg), h("div", { class: "side", style: "margin-top:.6em" }, say));
}

/* ⑧ 곱으로 나타내기 나무: 수를 두 수의 곱으로 계속 나누고, 공통인 수를 짝 지어 최대공약수·최소공배수 구하기
   opt: pairs:[[a,b],…], goal:"gcd"|"lcm", ask, ok */
function fm2Tree(body, api, opt) {
  fm2Style();
  const goal = opt.goal, G = goal === "gcd" ? "최대공약수" : "최소공배수";
  let pi = 0, T, phase, sel, pr, H = 400;
  const svg = makeSvg(900, H);
  const say = h("div", { class: "fm2say" }), choices = h("div", { class: "fm2btns" }), ansBox = h("div");
  const mk = v => ({ v, kids: null, pair: null });
  const leaves = n => n.kids ? [...leaves(n.kids[0]), ...leaves(n.kids[1])] : [n];
  const depth = n => n.kids ? 1 + Math.max(depth(n.kids[0]), depth(n.kids[1])) : 0;
  const place = (n, x0, x1, d) => {
    n.y = 48 + d * 76;
    if (!n.kids) { n.x = (x0 + x1) / 2; return; }
    const L = leaves(n.kids[0]).length, R = leaves(n.kids[1]).length, xm = x0 + (x1 - x0) * L / (L + R);
    place(n.kids[0], x0, xm, d + 1); place(n.kids[1], xm, x1, d + 1); n.x = (n.kids[0].x + n.kids[1].x) / 2;
  };
  const all = n => n.kids ? [n, ...all(n.kids[0]), ...all(n.kids[1])] : [n];
  const vals = s => leaves(T[s]).map(n => n.v).sort((a, b) => a - b);
  const done1 = () => T.every(t => leaves(t).every(n => !fm2Split(n.v).length));
  const start = () => {
    const [a, b] = opt.pairs[pi]; T = [mk(a), mk(b)]; phase = 0; sel = null; pr = 0;
    ansBox.innerHTML = ""; choices.innerHTML = "";
    say.textContent = `${fm2J(a, "과와")} ${b}의 ${fm2J(G, "을를")} 구해요. 수를 누르고 두 수의 곱으로 나타내어 보세요. 1과 자기 자신의 곱은 빼고, 더 이상 나눌 수 없을 때까지 나누어요.`;
    draw();
  };
  const draw = () => {
    const D = Math.max(depth(T[0]), depth(T[1]));
    H = Math.max(330, 48 + D * 76 + 110); svg.setAttribute("viewBox", `0 0 900 ${H}`);
    svg.innerHTML = "";
    place(T[0], 20, 440, 0); place(T[1], 460, 880, 0);
    svg.append(svgEl("line", { x1: 450, y1: 20, x2: 450, y2: H - 20, stroke: "#E2E8E5", "stroke-width": 2, "stroke-dasharray": "6 6" }));
    T.forEach(t => all(t).forEach(n => { if (n.kids) n.kids.forEach(k => svg.append(svgEl("line", { x1: n.x, y1: n.y + 26, x2: k.x, y2: k.y - 26, stroke: "#8FA19A", "stroke-width": 2.5 }))); }));
    if (phase >= 1) {
      const L = leaves(T[0]), R = leaves(T[1]);
      L.filter(n => n.pair != null).forEach(n => { const m = R.find(x => x.pair === n.pair); if (m) svg.append(svgEl("path", { d: `M${n.x} ${n.y + 28} Q450 ${Math.max(n.y, m.y) + 70} ${m.x} ${m.y + 28}`, fill: "none", stroke: FM2.pine, "stroke-width": 3, "stroke-dasharray": "7 5" })); });
    }
    T.forEach((t, s) => all(t).forEach(n => {
      const leaf = !n.kids, end = leaf && !fm2Split(n.v).length;
      const isSel = sel && sel.node === n;
      svg.append(svgEl("circle", { cx: n.x, cy: n.y, r: 27, fill: n.pair != null ? FM2.gsoft : end ? FM2.yel : "#fff", stroke: isSel ? FM2.org : n.pair != null ? FM2.pine : s ? FM2.blue : FM2.org, "stroke-width": isSel ? 5 : 3, style: "cursor:pointer" }));
      svg.append(txt(n.x, n.y + 1, String(n.v), 22));
    }));
    if (phase >= 1) T.forEach((t, s) => svg.append(txt(s ? 670 : 230, H - 26, `${t.v} = ${fm2X(vals(s))}`, 22, { fill: s ? FM2.blue : FM2.org })));
  };
  const toPair = () => {
    phase = 1; sel = null; choices.innerHTML = "";
    say.textContent = `두 식에 공통으로 들어 있는 수를 찾아요. 왼쪽 수와 오른쪽 수 중 같은 수를 하나씩 눌러 짝 지어요. 짝을 지은 수를 다시 누르면 풀려요.`;
    choices.append(h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const need = fm2Meet(vals(0), vals(1)).length, have = leaves(T[0]).filter(n => n.pair != null).length;
      if (have < need) return api.fail(`두 식에 공통으로 들어 있는 수가 ${need - have}개 더 있어요. 남은 수 중에서 같은 수를 찾아봐요.`, `${have}쌍`);
      toAnswer();
    } }, "공통인 수를 다 찾았어요"));
    draw();
  };
  const toAnswer = () => {
    phase = 2; choices.innerHTML = "";
    const [a, b] = opt.pairs[pi], A = vals(0), B = vals(1), C = fm2Meet(A, B), rest = [...fm2Minus(A, C), ...fm2Minus(B, C)];
    const g = fm2Gcd(a, b), l = fm2Lcm(a, b), want = goal === "gcd" ? g : l;
    const inp = fm2Input(G);
    say.textContent = `공통으로 들어 있는 수: ${fm2L(C)}` + (goal === "lcm" ? ` · 공통이 아닌 남은 수: ${fm2L(rest)}` : "");
    const tip = goal === "gcd" ? "공통으로 들어 있는 수를 모두 곱해요." : "공통으로 들어 있는 수는 한 번만 곱하고, 공통이 아닌 남은 수를 곱해요.";
    const go = h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const v = fm2Num(inp.value);
      if (v !== want) {
        fm2Paint(inp, false);
        let m = tip;
        if (goal === "gcd" && v === l) m = `${v}${fm2J(v, "은는").slice(String(v).length)} 최소공배수예요. ${G}는 공통으로 들어 있는 수만 곱해요.`;
        if (goal === "lcm" && v === a * b && a * b !== l) m = `${a} × ${fm2J(b, "을를")} 그대로 곱했어요. 공통으로 들어 있는 수(${fm2L(C)})를 두 번 곱한 셈이에요. 공통인 수는 한 번만 곱해요.`;
        if (goal === "lcm" && v === g) m = `${v}${fm2J(v, "은는").slice(String(v).length)} 최대공약수예요. 공통이 아닌 남은 수도 곱해요.`;
        return api.fail(m, String(inp.value));
      }
      fm2Paint(inp, true); go.disabled = true;
      const f = goal === "gcd" ? (C.length > 1 ? `${fm2X(C)} = ${g}` : `${g}`) : `${fm2X([...C, ...rest])} = ${l}`;
      ansBox.append(h("p", { class: "jua", style: "color:var(--pine)" }, `${fm2J(a, "과와")} ${b}의 ${G}: ${f}`));
      if (pi < opt.pairs.length - 1) {
        api.hint(`○ 맞았어요! 다음 두 수도 구해 봐요.`);
        ansBox.append(h("button", { class: "big", onclick: () => { pi++; start(); } }, "다음 두 수로"));
      } else fm2Then(body, api, opt.ask, opt.ok, opt.pairs.map(([x, y]) => `${x},${y}→${goal === "gcd" ? fm2Gcd(x, y) : fm2Lcm(x, y)}`).join(" / "));
    } }, "확인");
    ansBox.innerHTML = "";
    ansBox.append(h("p", {}, tip), h("div", { class: "fm2row" }, h("span", { class: "jua" }, `${fm2J(a, "과와")} ${b}의 ${G} =`), inp), go);
    draw();
  };
  dragOn(svg, p => {
    let hit = null;
    T.forEach((t, s) => all(t).forEach(n => { if (Math.hypot(p.x - n.x, p.y - n.y) < 30) hit = { node: n, s }; }));
    if (!hit) return false;
    const n = hit.node;
    if (phase === 0) {
      if (n.kids) { api.hint("이미 두 수의 곱으로 나타낸 수예요. 아래쪽 수를 눌러 봐요."); return false; }
      const sp = fm2Split(n.v);
      if (!sp.length) { api.hint(`${fm2J(n.v, "은는")} 1 × ${n.v} 말고는 두 수의 곱으로 나타낼 수 없어요.`); return false; }
      sel = hit; choices.innerHTML = "";
      choices.append(h("span", { class: "jua" }, `${n.v} = `));
      sp.forEach(([x, y]) => choices.append(h("button", { class: "ghost", onclick: () => {
        n.kids = [mk(x), mk(y)]; sel = null; choices.innerHTML = ""; draw();
        if (done1()) toPair();
      } }, `${x} × ${y}`)));
      draw();
    } else if (phase === 1) {
      if (n.kids) return false;
      if (n.pair != null) { const id = n.pair; T.forEach(t => leaves(t).forEach(x => { if (x.pair === id) x.pair = null; })); sel = null; draw(); return false; }
      if (!sel || sel.s === hit.s) { sel = hit; draw(); return false; }
      if (sel.node.v !== n.v) { api.hint("같은 수끼리 짝 지어요."); sel = hit; draw(); return false; }
      n.pair = sel.node.pair = ++pr; sel = null; draw();
    }
    return false;
  }, () => {}, null);
  api.provide({ words: ["공통으로 들어 있는 수", G], answers: opt.pairs.map(([a, b]) => `${fm2J(a, "과와")} ${b}의 ${G}: ${goal === "gcd" ? fm2Gcd(a, b) : fm2Lcm(a, b)}`) });
  start();
  body.append(h("div", { class: "stage" }, svg), h("div", { class: "side", style: "margin-top:.6em" }, say, choices, ansBox));
}

/* 공약수로 나누기 그림 (rows:[{d,a,b}], last:[a,b], hl:"gcd"|"lcm"|"both") */
function fm2LadderSvg(rows, last, hl) {
  const RH = 64, H = 30 + (rows.length + 1) * RH;
  const s = makeSvg(420, H);
  const y = i => 40 + i * RH;
  rows.forEach((r, i) => {
    s.append(txt(60, y(i), String(r.d), 30, { fill: hl ? FM2.org : FM2.ink }));
    if (hl) s.append(svgEl("circle", { cx: 60, cy: y(i), r: 24, fill: "none", stroke: FM2.org, "stroke-width": 3 }));
    s.append(svgEl("path", { d: `M92 ${y(i) - 24} Q104 ${y(i)} 92 ${y(i) + 24}`, fill: "none", stroke: FM2.ink, "stroke-width": 3 }));
    s.append(txt(180, y(i), String(r.a), 30), txt(300, y(i), String(r.b), 30));
    s.append(svgEl("line", { x1: 100, y1: y(i) + RH / 2, x2: 360, y2: y(i) + RH / 2, stroke: FM2.ink, "stroke-width": 2.5 }));
  });
  if (last) {
    const i = rows.length;
    s.append(txt(180, y(i), String(last[0]), 30), txt(300, y(i), String(last[1]), 30));
    if (hl === "lcm" || hl === "both") [180, 300].forEach(x => s.append(svgEl("circle", { cx: x, cy: y(i), r: 25, fill: "none", stroke: FM2.blue, "stroke-width": 3 })));
  }
  return s;
}
/* ⑨ 공약수로 나누기  opt: pairs:[[a,b],…], goal:"gcd"|"lcm"|"both", ask, ok */
function fm2Ladder(body, api, opt) {
  fm2Style();
  const goal = opt.goal;
  let pi = 0, rows, cur, phase;
  const fig = h("div", { class: "stage", style: "max-width:520px" });
  const say = h("div", { class: "fm2say" }), work = h("div"), ansBox = h("div");
  const draw = hl => { fig.innerHTML = ""; fig.append(fm2LadderSvg(rows, cur, hl)); };
  const names = { gcd: ["최대공약수"], lcm: ["최소공배수"], both: ["최대공약수", "최소공배수"] }[goal];
  const start = () => {
    const [a, b] = opt.pairs[pi]; rows = []; cur = [a, b]; phase = 0; ansBox.innerHTML = "";
    say.textContent = `${fm2J(a, "과와")} ${b}의 ${names.join("와 ")}를 구해요. 두 수를 모두 나누어떨어지게 하는 1보다 큰 수(공약수)로 나누고, 몫을 써요.`;
    draw(); row();
  };
  const row = () => {
    work.innerHTML = "";
    const dI = fm2Input("나누는 공약수"), q1 = fm2Input(`${cur[0]}의 몫`), q2 = fm2Input(`${cur[1]}의 몫`);
    const go = h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const d = fm2Num(dI.value), [a, b] = cur;
      if (!d) return api.fail("나눌 공약수를 써요.", "-");
      if (d === 1) return api.fail("1로 나누면 몫이 처음 수와 똑같아서 아무것도 달라지지 않아요. 1보다 큰 공약수로 나누어요.", "1");
      if (a % d || b % d) return api.fail(`${fm2J(d, "은는")} ${fm2J(a, "과와")} ${b}의 공약수가 아니에요. ${a % d ? a : b} ÷ ${fm2J(d, "은는")} 나누어떨어지지 않아요.`, String(d));
      const g1 = fm2Num(q1.value) === a / d, g2 = fm2Num(q2.value) === b / d;
      fm2Paint(q1, g1); fm2Paint(q2, g2);
      if (!g1 || !g2) return api.fail(`몫을 다시 계산해 봐요. ${!g1 ? a : b} ÷ ${d} = □`, `${q1.value},${q2.value}`);
      rows.push({ d, a, b }); cur = [a / d, b / d]; draw(); row();
      api.hint(`○ ${fm2J(d, "으로")} 나누었어요. ${fm2J(cur[0], "과와")} ${fm2J(cur[1], "을를")} 또 나눌 수 있는지 살펴봐요.`);
    } }, "나누기");
    const stop = h("button", { class: "ghost", onclick: () => {
      api.tryOnce();
      const g = fm2Gcd(cur[0], cur[1]);
      if (!rows.length) return api.fail(`${fm2J(cur[0], "과와")} ${fm2J(cur[1], "은는")} ${fm2J(g, "으로")} 함께 나눌 수 있어요. 먼저 공약수로 나누어요.`, "멈춤");
      if (g > 1) return api.fail(`${fm2J(cur[0], "과와")} ${fm2J(cur[1], "은는")} 아직 ${fm2J(g, "으로")} 함께 나눌 수 있어요. 더 이상 나눌 수 없을 때까지 나누어요.`, "멈춤");
      toAnswer();
    } }, "더 이상 나눌 수 없어요");
    work.append(h("div", { class: "fm2row" }, h("span", { class: "jua" }, "공약수"), dI, h("span", { class: "jua" }, `) ${cur[0]}  ${cur[1]}  →  몫`), q1, q2), h("div", { class: "fm2btns", style: "margin-top:.4em" }, go, stop));
  };
  const toAnswer = () => {
    phase = 1; work.innerHTML = "";
    const [a, b] = opt.pairs[pi], D = rows.map(r => r.d), g = fm2Gcd(a, b), l = fm2Lcm(a, b);
    say.textContent = `더 이상 나눌 수 없어요. 왼쪽에 나눈 공약수: ${fm2L(D)} · 마지막 몫: ${fm2L(cur)}`;
    const ins = names.map(nm => ({ nm, inp: fm2Input(nm), want: nm === "최대공약수" ? g : l }));
    const go = h("button", { class: "big", onclick: () => {
      api.tryOnce();
      for (const x of ins) {
        const v = fm2Num(x.inp.value), ok = v === x.want; fm2Paint(x.inp, ok);
        if (ok) continue;
        let m = x.nm === "최대공약수" ? "왼쪽에 나눈 공약수를 모두 곱해요." : "왼쪽에 나눈 공약수와 마지막 몫을 모두 곱해요(ㄴ자 모양).";
        if (x.nm === "최대공약수" && v === l) m = "그 수는 최소공배수예요. 최대공약수는 왼쪽에 나눈 공약수만 곱해요.";
        if (x.nm === "최소공배수" && v === g) m = "그 수는 최대공약수예요. 최소공배수는 마지막 몫까지 모두 곱해요.";
        if (x.nm === "최소공배수" && v === a * b && a * b !== l) m = `${a} × ${fm2J(b, "은는")} 공배수이지만 가장 작은 공배수가 아니에요. 나눈 공약수와 마지막 몫을 곱해요.`;
        return api.fail(m, ins.map(y => y.inp.value).join(","));
      }
      go.disabled = true; draw(goal);
      const lines = ins.map(x => x.nm === "최대공약수" ? `최대공약수: ${D.length > 1 ? fm2X(D) + " = " : ""}${g}` : `최소공배수: ${fm2X([...D, ...cur])} = ${l}`);
      ansBox.append(h("p", { class: "jua", style: "color:var(--pine)" }, `${fm2J(a, "과와")} ${b} → ${lines.join(" · ")}`));
      if (pi < opt.pairs.length - 1) { api.hint("○ 맞았어요! 다음 두 수도 구해 봐요."); ansBox.append(h("button", { class: "big", onclick: () => { pi++; start(); } }, "다음 두 수로")); }
      else fm2Then(body, api, opt.ask, opt.ok, opt.pairs.map(([x, y]) => `${x},${y}`).join(" / "));
    } }, "확인");
    work.append(...ins.map(x => h("div", { class: "fm2row" }, h("span", { class: "jua" }, `${x.nm} =`), x.inp)), go);
  };
  api.provide({ words: ["공약수", "몫", ...names], answers: opt.pairs.map(([a, b]) => `${fm2J(a, "과와")} ${b}: ${names.map(nm => `${nm} ${nm === "최대공약수" ? fm2Gcd(a, b) : fm2Lcm(a, b)}`).join(", ")}`) });
  start();
  body.append(h("div", { class: "panel" }, fig, h("div", { class: "side" }, say, work, ansBox)));
}

/* ⑩ 직사각형을 크기가 같은 가장 큰 정사각형으로 나누기  opt: w, h(cm), ask, ok */
function fm2Square(body, api, opt) {
  fm2Style();
  const W = opt.w, Hh = opt.h, U = 48, x0 = 50, y0 = 30;
  let s = null; const tried = new Set();
  const svg = makeSvg(W * U + 100, Hh * U + 110);
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: x0, y: y0, width: W * U, height: Hh * U, fill: "#CFE8FA" }));
    svg.append(svgEl("path", { d: `M${x0} ${y0 + Hh * U * .7} Q${x0 + W * U * .3} ${y0 + Hh * U * .35} ${x0 + W * U * .55} ${y0 + Hh * U * .62} T${x0 + W * U} ${y0 + Hh * U * .5} L${x0 + W * U} ${y0 + Hh * U} L${x0} ${y0 + Hh * U} Z`, fill: "#9BD17E" }));
    svg.append(svgEl("circle", { cx: x0 + W * U * .82, cy: y0 + Hh * U * .22, r: U * .9, fill: "#F6C945" }));
    if (s) {
      const nx = Math.floor(W / s), ny = Math.floor(Hh / s);
      for (let i = 0; i <= nx; i++) svg.append(svgEl("line", { x1: x0 + i * s * U, y1: y0, x2: x0 + i * s * U, y2: y0 + ny * s * U, stroke: "#fff", "stroke-width": 3 }));
      for (let j = 0; j <= ny; j++) svg.append(svgEl("line", { x1: x0, y1: y0 + j * s * U, x2: x0 + nx * s * U, y2: y0 + j * s * U, stroke: "#fff", "stroke-width": 3 }));
      if (W % s) svg.append(svgEl("rect", { x: x0 + nx * s * U, y: y0, width: (W % s) * U, height: Hh * U, fill: "rgba(217,83,79,.45)" }));
      if (Hh % s) svg.append(svgEl("rect", { x: x0, y: y0 + ny * s * U, width: nx * s * U, height: (Hh % s) * U, fill: "rgba(217,83,79,.45)" }));
    }
    svg.append(svgEl("rect", { x: x0, y: y0, width: W * U, height: Hh * U, fill: "none", stroke: FM2.ink, "stroke-width": 3 }));
    svg.append(txt(x0 + W * U / 2, y0 + Hh * U + 26, `${W} cm`, 22), txt(x0 - 26, y0 + Hh * U / 2, `${Hh} cm`, 20, { transform: `rotate(-90 ${x0 - 26} ${y0 + Hh * U / 2})` }));
    svg.append(txt(x0 + W * U / 2, y0 + Hh * U + 64, !s ? "오른쪽에서 정사각형의 한 변의 길이를 골라요" : (W % s || Hh % s) ? `한 변 ${s} cm: 빨간 부분이 남아요` : `한 변 ${s} cm: 가로 ${W / s}개, 세로 ${Hh / s}개 → ${W / s * Hh / s}조각, 남는 부분이 없어요`, 22, { fill: s && !(W % s || Hh % s) ? FM2.pine : s ? FM2.red : "#8A9A95" }));
  };
  const btns = h("div", { class: "fm2btns" });
  fm2Range(1, Math.min(W, Hh)).forEach(v => btns.append(h("button", { class: "ghost", onclick: e => { s = v; tried.add(v); [...btns.children].forEach(b => b.classList.remove("fm2sel")); e.currentTarget.classList.add("fm2sel"); draw(); } }, `${v} cm`)));
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, "정사각형 한 변의 길이를 골라 사진을 나누어 보세요. 남는 부분이 없어야 해요."), btns)));
  const box = h("div", { class: "fm2after" }); body.append(box);
  fm2Ask(box, fm2Gate(api, () => tried.size >= 3, "여러 길이로 나누어 본 다음 답해요. 한 변의 길이 단추를 3개 이상 눌러 봐요."), opt.ask, { ok: opt.ok });
}

/* ⑪ 종이띠를 한 가지 조각으로 채우기  opt: strips:[9,12], pieces:[{k:"㉠", n}], ask, ok */
function fm2Strip(body, api, opt) {
  fm2Style();
  const C = 52, LX = 110, cols = ["#F6C9A6", "#BFDDF5", "#CDE8C4", "#F3D3E7", "#F7E3A1", "#D6CCF2"];
  let cur = null; const tried = new Set();
  const svg = makeSvg(LX + Math.max(...opt.strips) * C + 30, 70 + opt.strips.length * 110);
  const draw = () => {
    svg.innerHTML = "";
    opt.strips.forEach((L, i) => {
      const y = 40 + i * 110;
      svg.append(txt(55, y + 30, `${L}칸`, 22));
      for (let c = 0; c < L; c++) svg.append(svgEl("rect", { x: LX + c * C, y, width: C, height: 60, fill: "#fff", stroke: "#AEBBB6", "stroke-width": 1.5 }));
      if (cur) {
        const p = opt.pieces[cur.i], m = Math.floor(L / p.n), r = L % p.n;
        for (let j = 0; j < m; j++) { svg.append(svgEl("rect", { x: LX + j * p.n * C + 3, y: y + 3, width: p.n * C - 6, height: 54, rx: 8, fill: cols[cur.i % 6], stroke: FM2.ink, "stroke-width": 2 })); svg.append(txt(LX + (j + .5) * p.n * C, y + 30, p.k, 22)); }
        if (r) svg.append(svgEl("rect", { x: LX + m * p.n * C + 2, y: y + 2, width: r * C - 4, height: 56, fill: "rgba(217,83,79,.25)", stroke: FM2.red, "stroke-width": 2, "stroke-dasharray": "6 4" }));
        svg.append(txt(LX + L * C + 0, y + 82, r ? `${p.k} ${m}개를 놓으면 ${r}칸이 남아 채울 수 없어요` : `${p.k} ${m}개로 꼭 맞게 채워요`, 18, { "text-anchor": "end", fill: r ? FM2.red : FM2.pine }));
      }
    });
  };
  const btns = h("div", { class: "fm2btns" });
  opt.pieces.forEach((p, i) => btns.append(h("button", { class: "ghost", onclick: e => { cur = { i }; tried.add(i); [...btns.children].forEach(b => b.classList.remove("fm2sel")); e.currentTarget.classList.add("fm2sel"); draw(); } }, `${p.k} ${p.n}칸`)));
  draw();
  body.append(h("div", { class: "stage" }, svg), h("div", { class: "side", style: "margin-top:.6em" }, h("p", {}, "조각을 하나 골라 두 종이띠를 그 조각으로만 채워 보세요."), btns));
  const box = h("div", { class: "fm2after" }); body.append(box);
  fm2Ask(box, fm2Gate(api, () => tried.size >= opt.pieces.length, () => `조각 ${opt.pieces.length}가지를 모두 놓아 본 다음 답해요. (지금 ${tried.size}가지)`), opt.ask, { ok: opt.ok });
}

/* ⑫ 상황 카드 나누기  opt: bins:[이름…], cards:[{t, b, why}], ok */
function fm2Sort(body, api, opt) {
  fm2Style();
  const place = opt.cards.map(() => null);
  let pick = null;
  const pool = h("div", { class: "fm2cards" });
  const bins = opt.bins.map((nm, bi) => { const el = h("div", { class: "fm2bin", onclick: () => { if (pick == null) return api.hint("먼저 카드를 눌러 골라요."); place[pick] = bi; pick = null; draw(); } }, h("b", {}, nm)); return el; });
  const card = i => h("button", { class: "opt fm2card" + (pick === i ? " fm2sel" : ""), onclick: e => { e.stopPropagation(); if (place[i] != null && pick !== i) { place[i] = null; pick = null; } else pick = pick === i ? null : i; draw(); } }, opt.cards[i].t);
  const draw = () => {
    pool.innerHTML = ""; bins.forEach(b => { while (b.children.length > 1) b.lastChild.remove(); });
    opt.cards.forEach((c, i) => (place[i] == null ? pool : bins[place[i]]).append(card(i)));
    if (!pool.children.length) pool.append(h("span", { class: "inst" }, "카드를 모두 옮겼어요. 확인해 봐요."));
  };
  api.provide({ words: opt.bins, answers: opt.bins.map((nm, bi) => `${nm}: ${opt.cards.filter(c => c.b === bi).map(c => c.t).join(" / ")}`) });
  draw();
  body.append(h("p", { class: "inst", style: "font-size:var(--fs-s)" }, "카드를 누른 다음 알맞은 상자를 눌러요. 상자 안의 카드를 누르면 다시 위로 돌아와요."), pool, h("div", { class: "fm2bins" }, ...bins),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      if (place.some(p => p == null)) return api.fail("아직 옮기지 않은 카드가 있어요.", "-");
      const wrong = opt.cards.findIndex((c, i) => place[i] !== c.b);
      if (wrong >= 0) return api.fail(opt.cards[wrong].why || `‘${opt.cards[wrong].t}’를 다시 생각해 봐요.`, place.join(","));
      api.done(place.join(","), opt.ok);
    } }, "확인하기")));
}

/* ⑬ 약수와 배수 이어달리기 놀이 (컴퓨터와)  opt: max(50), first(25), level:"easy"|"normal", needWin */
function fm2Game(body, api, opt) {
  fm2Style();
  const N = opt.max || 50, FIRST = opt.first || 25, cols = 10, CW = 72;
  let marks, last, kind, log, over, busy;
  const svg = makeSvg(cols * CW + 20, Math.ceil(N / cols) * CW + 20);
  const status = h("div", { class: "fm2say" }), logBox = h("div", { class: "fm2log" });
  const kb = h("div", { class: "fm2btns" });
  const rel = (p, v) => p % v === 0 ? "약수" : v % p === 0 ? "배수" : null;
  const options = (p, mk) => fm2Range(1, N).filter(v => !mk[v] && rel(p, v));
  const draw = () => {
    svg.innerHTML = "";
    for (let v = 1; v <= N; v++) {
      const k = v - 1, x = 10 + (k % cols) * CW, y = 10 + Math.floor(k / cols) * CW, m = marks[v];
      svg.append(svgEl("rect", { x: x + 2, y: y + 2, width: CW - 4, height: CW - 4, rx: 8, fill: m ? (m === "me" ? FM2.bsoft : FM2.soft) : "#fff", stroke: v === last ? FM2.pine : "#C9D3CF", "stroke-width": v === last ? 4 : 1.5, style: "cursor:pointer" }));
      svg.append(txt(x + CW / 2, y + CW / 2 + 1, String(v), 25, { fill: m ? "#8A9A95" : FM2.ink }));
      if (m) { const c = m === "me" ? FM2.blue : FM2.org; svg.append(svgEl("path", { d: `M${x + 16} ${y + 16} L${x + CW - 16} ${y + CW - 16} M${x + CW - 16} ${y + 16} L${x + 16} ${y + CW - 16}`, stroke: c, "stroke-width": 4, "stroke-linecap": "round" })); }
    }
  };
  const write = t => { log.push(t); logBox.innerHTML = ""; log.slice(-8).forEach(l => logBox.append(h("div", {}, l))); };
  const setKind = k => { kind = k; [...kb.children].forEach(b => b.classList.toggle("fm2sel", b.textContent.startsWith(k))); };
  const end = win => {
    over = true; kb.innerHTML = "";
    const msg = win ? `컴퓨터가 ${last}의 약수나 배수 중 ×표 할 수 있는 수가 없어요. 내가 이겼어요!` : `${last}의 약수나 배수 중 ×표 할 수 있는 수가 남아 있지 않아요. 컴퓨터가 이겼어요.`;
    status.textContent = msg;
    if (opt.needWin && !win) { api.hint("아쉬워요! ‘새 놀이’를 눌러 다시 도전해 봐요. 상대가 고를 수 있는 수가 적게 남도록 생각해 봐요."); return; }
    api.done(log.join(" → "), win ? "놀이에서 이겼어요! 약수와 배수를 잘 찾았어요." : "놀이를 끝까지 했어요! 약수와 배수를 찾으며 이어 갔어요.");
  };
  const cpu = () => {
    if (!svg.isConnected || over) return;
    const ops = options(last, marks);
    if (!ops.length) return end(true);
    let pickV = null;
    const left = v => { const mk = Object.assign({}, marks, { [v]: "c" }); return options(v, mk).length; };
    const win = ops.filter(v => left(v) === 0);
    if (opt.level !== "easy" && win.length) pickV = win[0];
    else { const pool = ops.length > 1 ? ops.filter(v => v !== 1) : ops; pickV = pool[Math.floor(Math.random() * pool.length)]; }
    write(`컴퓨터: ${last}의 ${rel(last, pickV)}! ${pickV}`);
    marks[pickV] = "cpu"; last = pickV; busy = false; draw();
    if (!options(last, marks).length) return end(false);
    status.textContent = `내 차례: 컴퓨터가 고른 ${last}의 약수나 배수를 찾아요. 먼저 ‘약수!’나 ‘배수!’를 골라요.`;
    setKind(null);
  };
  const newGame = () => {
    marks = {}; last = null; kind = null; log = []; over = false; busy = false;
    kb.innerHTML = ""; ["약수!", "배수!"].forEach(k => kb.append(h("button", { class: "ghost", onclick: () => { if (last == null) return api.hint("첫 번째 차례에는 25보다 작은 수 중 하나를 고르기만 해요."); setKind(k.slice(0, 2)); } }, k)));
    logBox.innerHTML = "";
    status.textContent = `내가 먼저 해요. 놀이판에서 ${FIRST}보다 작은 수 중 하나를 골라 ×표 해요.`;
    draw();
  };
  dragOn(svg, p => {
    if (over || busy) return false;
    const c = Math.floor((p.x - 10) / CW), r = Math.floor((p.y - 10) / CW), v = r * cols + c + 1;
    if (c < 0 || c >= cols || v < 1 || v > N) return false;
    if (marks[v]) { api.hint("이미 ×표 된 수에는 표시할 수 없어요."); return false; }
    if (last == null) {
      if (v >= FIRST) { api.hint(`첫 번째 사람은 ${FIRST}보다 작은 수를 골라요.`); return false; }
      write(`나: ${v}`);
    } else {
      if (!kind) { api.hint("먼저 ‘약수!’나 ‘배수!’ 중 하나를 골라 외쳐요."); return false; }
      const ok = kind === "약수" ? last % v === 0 : v % last === 0;
      if (!ok) { api.tryOnce(); api.fail(`${fm2J(v, "은는")} ${last}의 ${kind}가 아니에요.`, `${last}의 ${kind} ${v}`); return false; }
      write(`나: ${last}의 ${kind}! ${v}`);
    }
    marks[v] = "me"; last = v; busy = true; draw();
    status.textContent = "컴퓨터가 생각하고 있어요…";
    setTimeout(cpu, 700);
    return false;
  }, () => {}, null);
  api.provide({ words: ["약수", "배수", "나누어떨어지는 수"], answers: [] });
  newGame();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, `나는 파란 ×, 컴퓨터는 주황 ×예요. 앞 사람이 고른 수의 약수나 배수 중 아직 ×표 하지 않은 수를 골라요. ×표 할 수 있는 수가 없는 사람이 져요(이 앱의 규칙).`), status, kb, h("b", {}, "놀이 기록"), logBox, h("button", { class: "ghost", onclick: newGame }, "새 놀이"))));
}

/* 그림: 13년 매미와 17년 매미 */
function fm2CicadaFig() {
  const s = makeSvg(900, 250);
  s.append(svgEl("rect", { x: 0, y: 0, width: 900, height: 250, fill: "#EAF4E4" }));
  s.append(svgEl("rect", { x: 380, y: 30, width: 18, height: 220, fill: "#8B6A4B" }), svgEl("rect", { x: 500, y: 30, width: 18, height: 220, fill: "#8B6A4B" }));
  const bug = (x, y, col) => { const g = svgEl("g"); g.append(svgEl("ellipse", { cx: x - 16, cy: y, rx: 30, ry: 13, fill: "rgba(200,225,240,.85)", stroke: "#7FA7C0", "stroke-width": 2, transform: `rotate(-20 ${x} ${y})` }), svgEl("ellipse", { cx: x + 16, cy: y, rx: 30, ry: 13, fill: "rgba(200,225,240,.85)", stroke: "#7FA7C0", "stroke-width": 2, transform: `rotate(20 ${x} ${y})` }), svgEl("ellipse", { cx: x, cy: y + 6, rx: 12, ry: 26, fill: col }), svgEl("circle", { cx: x - 6, cy: y - 16, r: 4, fill: "#C0392B" }), svgEl("circle", { cx: x + 6, cy: y - 16, r: 4, fill: "#C0392B" })); return g; };
  s.append(bug(389, 150, "#3E3A2E"), bug(509, 150, "#4D3A28"));
  const bubble = (x, y, w, t1, t2) => { s.append(svgEl("rect", { x, y, width: w, height: 74, rx: 18, fill: "#fff", stroke: "#AEBBB6", "stroke-width": 2 })); s.append(txt(x + w / 2, y + 25, t1, 20), txt(x + w / 2, y + 52, t2, 18, { fill: FM2.pine })); };
  bubble(40, 40, 300, "나는 13년마다 나타나!", "미국의 13년 매미");
  bubble(560, 40, 300, "나는 17년마다 나타나!", "미국의 17년 매미");
  s.append(svgEl("rect", { x: 250, y: 190, width: 400, height: 44, rx: 22, fill: FM2.yel, stroke: "#E2C66A", "stroke-width": 2 }), txt(450, 212, "2024년에 두 매미가 동시에 나타났대!", 20));
  return h("div", { class: "fm2fig" }, s);
}
/* 그림: 사다리 문제(빈칸 기호) */
function fm2LadderFig(rows, last) { return () => h("div", { class: "fm2fig", style: "max-width:360px" }, fm2LadderSvg(rows, last)); }
//@@LESSONS
const UNIT_STORY = { title: "할머니를 맞이하는 윤우", lines: [
  "다음 주부터 할머니께서 윤우네 집에서 같이 사세요. 윤우는 꽃병에 꽃을 나누어 꽂고, 생신 선물 상자를 준비하고, 매일 영양제를 챙겨 드리고, 함께 박수를 치며 걷기로 했어요.",
  "윤우는 똑같이 나누는 상황에서는 약수를, 몇 배씩 늘어나는 상황에서는 배수를 이용하는 것을 알게 되었어요.",
  "교과서 「수학 5-1」 2. 약수와 배수의 차시 순서 그대로 만들었어요."],
  one: "할머니를 맞이하는 윤우 · 똑같이 나누는 약수, 몇 배씩 늘어나는 배수를 찾아요." };
const UNIT_KEYWORDS = ["약수", "배수", "나누어떨어지다", "1과 자기 자신", "곱셈식", "나눗셈식", "공약수", "최대공약수", "공배수", "최소공배수", "여러 수의 곱", "공통으로 들어 있는 수", "공약수로 나누기", "몫"];

/* ===== 2. 약수와 배수 — 교과서 차시 버전 (10차시) ===== */
const FM2_D = n => fm2Divs(n);
const FM2_STRIP = [{ k: "㉠", n: 1 }, { k: "㉡", n: 2 }, { k: "㉢", n: 3 }, { k: "㉣", n: 4 }, { k: "㉤", n: 5 }, { k: "㉥", n: 6 }];
const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 할머니와 함께 살게 되었어요", soop: "개념 찾기(S)",
  question: "우리 주변에서 약수와 배수는 언제 쓰일까요?",
  summary: "어떤 수만큼의 물건을 남김없이 똑같이 나누는 상황에서는 약수를, 어떤 수의 몇 배만큼 담거나 세는 상황에서는 배수를 써요. 이 단원에서는 곱셈식과 나눗셈식으로 약수와 배수를 찾고, 공약수·최대공약수, 공배수·최소공배수를 배워요.",
  steps: [
    { name: "그림 살펴보기", inst: "그림 속 두 매미가 이야기를 나누고 있어요. 그림은 어떤 상황을 나타내고 있나요?", hints: ["매미의 말풍선을 읽어 봐요.", "아래 노란 띠에 두 매미가 동시에 나타난 해가 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "두 매미는 각각 몇 년마다 나타나나요?", o: ["13년마다, 17년마다", "13일마다, 17일마다", "2년마다, 4년마다"], a: 0, fig: fm2CicadaFig },
        { q: "두 매미가 동시에 나타난 해는?", o: ["2013년", "2017년", "2024년"], a: 2 },
        { q: "매미들이 궁금해하는 것은 무엇일까요?", o: ["다시 두 매미가 동시에 나타나는 때", "매미의 몸길이", "매미가 우는 소리의 크기"], a: 0 }],
        { ok: "이 단원을 다 배우고 나면 두 매미가 다시 동시에 나타나는 때를 직접 구할 수 있어요." }) },
    { name: "상황 나누기", inst: "윤우는 할머니를 환영해 드리려고 여러 가지를 준비해요. 우리 주변의 상황을 ‘똑같이 나누는 상황’과 ‘몇 배만큼 담거나 세는 상황’으로 나누어 보세요.", hints: ["어떤 수만큼의 물건을 남김없이 똑같이 나누면 ‘똑같이 나누는 상황’이에요.", "어떤 수가 1배, 2배, 3배, …로 늘어나면 ‘몇 배만큼 담거나 세는 상황’이에요."],
      render: (b, a) => fm2Sort(b, a, { bins: ["똑같이 나누는 상황", "몇 배만큼 담거나 세는 상황"], cards: [
        { t: "귤 10개를 접시 2개에 남김없이 똑같이 나누어 담기", b: 0 },
        { t: "꽃 6송이를 꽃병 몇 개에 남김없이 똑같이 나누어 꽂기", b: 0 },
        { t: "한 묶음에 6개인 음료수를 2묶음 사기", b: 1, why: "6개씩 2묶음은 6의 2배만큼 세는 상황이에요." },
        { t: "매일 영양제를 3알씩, 날수에 따라 챙겨 드리기", b: 1, why: "하루에 3알씩이면 1일, 2일, 3일, …에 따라 3의 1배, 2배, 3배, …만큼 필요해요." },
        { t: "엽서 8장을 4명에게 똑같이 나누어 주기", b: 0 },
        { t: "양갱 12개와 약과 16개를 상자에 똑같이 나누어 담기", b: 0 },
        { t: "2초마다 박수를 치며 걷기", b: 1, why: "2초, 4초, 6초, …는 2를 1배, 2배, 3배, … 한 수예요." }],
        ok: "똑같이 나누는 상황에서는 약수를, 몇 배만큼 담거나 세는 상황에서는 배수를 배워요." }) },
    { name: "말해 보기", inst: "물건을 똑같이 나누어 본 경험과 묶음으로 산 경험을 떠올려 써 보세요.", hints: ["귤, 사탕, 색종이를 친구와 나누어 본 적이 있나요?", "한 묶음에 몇 개씩 들어 있는 물건을 사 본 적이 있나요?"],
      render: (b, a) => writeStep(b, a, [
        { q: "물건을 똑같이 나누어 본 경험을 써 보세요.", tag: "나누기", ph: "예: 귤 10개를 접시 2개에 5개씩 똑같이 나누어 담았어요." },
        { q: "물건을 묶음으로 산 경험을 써 보세요.", tag: "묶음", ph: "예: 한 묶음에 6개인 음료수를 2묶음 사서 12개가 되었어요." },
        { q: "이 단원에서 무엇이 궁금한가요?", tag: "궁금", ph: "예: 꽃 6송이를 꽃병 몇 개에 똑같이 나눌 수 있을까?" }]) },
    { name: "배운 내용 떠올리기", inst: "3학년 때 배운 곱셈과 나눗셈을 떠올려 계산해 보세요.", hints: ["6 × 7 = 42이니까 42 ÷ 6 = 7이에요.", "(몇십몇) × (몇)은 일의 자리부터 곱해요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "6 × □ = 42이므로 42 ÷ 6 =", a: 7 },
        { q: "8 × □ = 56이므로 56 ÷ 8 =", a: 7 },
        { q: "13 × 4 =", a: 52 },
        { q: "80 ÷ 4 =", a: 20 },
        { q: "72 ÷ 3 =", a: 24 }], { ok: "곱셈과 나눗셈을 잘 기억하고 있어요. 이 단원에서 약수와 배수를 찾을 때 곱셈식과 나눗셈식을 써요." }) },
    { name: "확인하기", inst: "이 단원에서 배울 내용을 확인해요.", hints: ["책장을 넘겨 단원에서 배울 내용을 살펴봐요.", "분수의 덧셈과 뺄셈은 5단원에서 배워요."],
      render: (b, a) => quiz(b, a, [
        { q: "이 단원에서 배울 내용을 모두 고르세요.", o: ["곱셈식과 나눗셈식으로 약수와 배수 찾기", "공약수와 최대공약수", "공배수와 최소공배수", "분수의 덧셈과 뺄셈"], a: [0, 1, 2] },
        { q: "꽃 6송이를 꽃병 몇 개에 남김없이 똑같이 나누어 꽂을 수 있는지 알아볼 때 필요한 것은?", o: ["약수", "배수"], a: 0 },
        { q: "매일 3알씩 먹는 영양제가 날수에 따라 몇 알 필요한지 알아볼 때 필요한 것은?", o: ["약수", "배수"], a: 1 }],
        { ok: "약수와 배수를 공부할 준비가 되었어요. 다음 시간에는 약수를 배워요." }) }
  ],
  challenge: { inst: "물건을 똑같이 나누거나 묶음으로 세어 보세요.", hints: ["똑같이 나누면 나눗셈, 묶음으로 세면 곱셈이에요."], render: (b, a) => fm2Ask(b, a, [
    { q: "귤 10개를 접시 2개에 남김없이 똑같이 나누어 담으면 한 접시에", a: 5, unit: "개" },
    { q: "엽서 8장을 4명에게 똑같이 나누어 주면 한 명에게", a: 2, unit: "장" },
    { q: "한 묶음에 6개인 음료수 2묶음은 모두", a: 12, unit: "개" },
    { q: "한 묶음에 6개인 음료수 5묶음은 모두", a: 30, unit: "개" }], { ok: "나누기와 묶음 세기를 잘 해냈어요!" }) }
},
{
  id: "t2", no: 2, title: "약수를 알아볼까요", soop: "개념 구축하기(O)",
  question: "꽃 6송이를 꽃병 몇 개에 남김없이 똑같이 나누어 꽂을 수 있을까요?",
  summary: "어떤 수를 나누어떨어지게 하는 수를 그 수의 약수라고 해요. 6의 약수는 1, 2, 3, 6이에요. 1 × 8 = 8, 2 × 4 = 8처럼 곱이 8이 되는 곱셈식에서 곱하는 두 수는 8의 약수예요. 어떤 수의 약수에는 1과 자기 자신이 항상 들어 있어요.",
  steps: [
    { inst: "윤우는 할머니께서 좋아하시는 꽃 6송이를 꽃병 몇 개에 남김없이 똑같이 나누어 꽂으려고 해요. 꽃병 수를 고르고, 꽃병을 눌러 꽃을 한 송이씩 꽂아 보세요. 꽃병 1개부터 6개까지 모두 알아봐요.", hints: ["꽃병마다 꽃의 수가 똑같아야 해요.", "꽃병 4개에 2송이씩 꽂으려면 8송이가 필요해요."],
      render: (b, a) => fm2Share(b, a, { n: 6, ask: [
        { q: "꽃 6송이를 남김없이 똑같이 나누어 꽂을 수 있는 꽃병의 수를 모두 써 보세요.", set: FM2_D(6), unit: "개", why: { "4": "꽃병 4개에 2송이씩 꽂으면 꽃병 2개에 1송이씩 부족해요.", "5": "꽃병 5개에 2송이씩 꽂으면 꽃병 4개에 1송이씩 부족해요." } },
        { q: "구하는 방법으로 알맞은 것은?", o: ["6을 나누어떨어지게 하는 수를 구해요.", "6에 1, 2, 3, …을 곱해요.", "6보다 작은 수를 모두 구해요."], a: 0 }],
        ok: "꽃병 1개에 6송이, 2개에 3송이씩, 3개에 2송이씩, 6개에 1송이씩 꽂을 수 있어요." }) },
    { inst: "나눗셈식을 이용하여 6을 나누어떨어지게 하는 수를 알아봐요. 몫과 나머지를 써 보세요.", hints: ["6 ÷ 2 = 3, 6 ÷ 6 = 1이에요.", "6 ÷ 5 = 1 … 1이에요. 나머지가 있으면 나누어떨어지지 않아요."],
      render: (b, a) => fm2DivTable(b, a, { n: 6, ds: fm2Range(1, 6), given: [1, 3, 4], ask: [
        { q: "6을 나누어떨어지게 하는 수를 모두 써 보세요.", set: FM2_D(6), why: { "4": "6 ÷ 4 = 1 … 2로 나머지가 있어요.", "5": "6 ÷ 5 = 1 … 1로 나머지가 있어요." } }],
        ok: "6 ÷ 1, 6 ÷ 2, 6 ÷ 3, 6 ÷ 6은 나누어떨어져요. 6을 나누어떨어지게 하는 수는 1, 2, 3, 6이에요." }) },
    { name: "약수 구하기", inst: "8의 약수를 모두 구해 봐요. 바둑돌 8개를 한 줄에 똑같은 개수씩 늘어놓아 보세요. 남는 줄 없이 꽉 차는 방법을 모두 찾아 기록해요.", hints: ["한 줄에 1개, 2개, 3개, …씩 차례로 늘어놓아 봐요.", "한 줄에 2개씩 4줄이면 2 × 4 = 8이에요."],
      render: (b, a) => fm2Rect(b, a, { n: 8, item: "바둑돌", unit: "개", start: 3, ask: [
        { q: "8 ÷", post: "= 4", a: 2 },
        { q: "8 ÷", post: "= 2", a: 4 },
        { q: "1 × 8 = 8, 2 × 4 = 8을 보고 8의 약수를 모두 써 보세요.", set: FM2_D(8), why: { miss: "곱셈식의 두 수가 모두 8의 약수예요. 1과 8, 2와 4를 모두 써요." } },
        { q: "알게 된 점으로 알맞은 것은?", o: ["곱이 8이 되는 곱셈식에서 곱하는 두 수는 8의 약수예요.", "곱이 8이 되는 곱셈식에서 곱하는 두 수는 8의 배수예요."], a: 0 }],
        ok: "1 × 8 = 8에서 1과 8, 2 × 4 = 8에서 2와 4가 8의 약수예요. 8의 약수는 1, 2, 4, 8이에요." }) },
    { inst: "약속을 완성해 보세요.", hints: ["6 ÷ 1, 6 ÷ 2, 6 ÷ 3, 6 ÷ 6은 나누어떨어져요.", "어떤 수든 1로 나누거나 자기 자신으로 나누면 나누어떨어져요."],
      render: (b, a) => blanks(b, a, ["6을 나누어떨어지게 하는 수인 1, 2, 3, 6을 6의 ", { o: ["약수", "배수", "몫"], a: 0 }, "라고 해요. 이와 같이 어떤 수를 ", { o: ["나누어떨어지게 하는", "1배, 2배, 3배, … 한"], a: 0 }, " 수를 그 수의 약수라고 해요. 어떤 수의 약수에는 ", { o: ["1과 자기 자신", "0과 1", "2와 자기 자신"], a: 0 }, "이 항상 들어 있어요."]) },
    { inst: "9의 약수를 모두 찾아 ○표 하세요.", hints: ["9를 1, 2, 3, …으로 나누어 나누어떨어지는지 살펴봐요.", "1 × 9 = 9, 3 × 3 = 9예요."],
      render: (b, a) => fm2Board(b, a, { nums: fm2Range(1, 9), cols: 9, cell: 80, layers: [{ name: "9의 약수", want: FM2_D(9), shape: "circle", why: v => `9 ÷ ${v} = ${Math.floor(9 / v)} … ${fm2J(9 % v, "으로")} 나머지가 있어요.` }], ask: [
        { q: "9의 약수를 찾은 방법으로 알맞은 것을 모두 고르세요.", o: ["9를 나누어떨어지게 하는 수를 찾았어요.", "곱이 9가 되는 곱셈식 1 × 9 = 9, 3 × 3 = 9를 찾았어요.", "9보다 작은 홀수를 모두 찾았어요."], a: [0, 1], why: { "2": "5와 7은 홀수이지만 9를 나누어떨어지게 하지 않아요." } }],
        ok: "9의 약수는 1, 3, 9예요. 9를 나누어떨어지게 하는 수를 찾거나 곱이 9가 되는 곱셈식을 찾으면 돼요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 약수를 구해 보세요.", hints: ["35 ÷ 7 = 5, 35 ÷ 5 = 7이에요.", "28 = 1 × 28 = 2 × 14 = 4 × 7"], render: (b, a) => fm2Ask(b, a, [
    { q: "35 ÷", post: "= 5", a: 7, why: { "5": "35 ÷ 5 = 7이에요. 몫이 5가 되려면 35를 무엇으로 나누어야 할까요?" } },
    { q: "35의 약수를 모두 써 보세요.", set: FM2_D(35) },
    { q: "28의 약수를 모두 써 보세요.", set: FM2_D(28), why: { "3": "28 ÷ 3 = 9 … 1이에요.", "8": "28 ÷ 8 = 3 … 4예요.", miss: "28 = 1 × 28 = 2 × 14 = 4 × 7처럼 짝 지어 찾아봐요." } },
    { q: "48과 100 중 약수가 더 많은 수는?", o: ["48", "100"], a: 0, why: { "1": `48의 약수는 ${FM2_D(48).length}개, 100의 약수는 ${FM2_D(100).length}개예요. 수가 크다고 약수가 더 많은 것은 아니에요.` } },
    { q: "약수가 1, 2, 3, 4, 6, 8, 12, 24인 어떤 수는?", a: 24 },
    { q: "70의 약수 중 10보다 크고 홀수인 수는?", a: 35, why: { "14": "14는 짝수예요.", "70": "70은 짝수예요.", "7": "7은 10보다 작아요." } }],
    { ok: "약수를 빠짐없이 찾았어요! 약수는 두 수씩 짝 지어 찾으면 빠뜨리지 않아요." }) }
},
{
  id: "t3", no: 3, title: "배수를 알아볼까요", soop: "개념 구축하기(O)",
  question: "날수에 따라 필요한 영양제는 몇 알일까요?",
  summary: "어떤 수를 1배, 2배, 3배, … 한 수를 그 수의 배수라고 해요. 3의 배수는 3, 6, 9, …이고 셀 수 없이 많아요. 어떤 수를 여러 수의 곱으로 나타냈을 때, 곱하는 수들은 어떤 수의 약수이고 어떤 수는 곱하는 수들의 배수예요.",
  steps: [
    { inst: "윤우는 매일 할머니께 영양제를 3알씩 챙겨 드리려고 해요. 날수에 따라 필요한 영양제 수를 수직선에서 3씩 뛰어 세어 보세요. 도착하는 곳을 눌러요.", hints: ["1일에 3알, 하루가 늘어날 때마다 3알씩 늘어나요.", "3에서 3만큼 더 가면 6이에요."],
      render: (b, a) => fm2Hop(b, a, { max: 18, hops: [{ n: 3, count: 5, name: "영양제", tag: k => `${k}일` }], ask: [
        { q: "1일 동안 필요한 영양제", a: 3, unit: "알" },
        { q: "2일 동안 필요한 영양제", a: 6, unit: "알" },
        { q: "3일 동안 필요한 영양제", a: 9, unit: "알" },
        { q: "규칙으로 알맞은 것은?", o: ["1일씩 늘어날 때마다 3알씩 늘어나요.", "1일씩 늘어날 때마다 1알씩 늘어나요."], a: 0 },
        { q: "구하는 방법으로 알맞은 것은?", o: ["3에 1배, 2배, 3배, … 한 수를 구해요.", "3을 나누어떨어지게 하는 수를 구해요."], a: 0 }],
        ok: "1일에 3알, 2일에 6알, 3일에 9알이에요. 3에 1배, 2배, 3배, … 한 수를 구하면 돼요." }) },
    { inst: "곱셈식을 이용하여 3을 몇 배 한 수를 알아봐요.", hints: ["3을 2배 한 수는 3 × 2예요.", "3을 4배 한 수는 3 × 4 = 12예요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "3을 1배 한 수: 3 × 1 =", a: 3 },
        { q: "3을 2배 한 수: 3 × 2 =", a: 6 },
        { q: "3을 3배 한 수: 3 ×", post: "= 9", a: 3 },
        { q: "3을 4배 한 수: 3 × 4 =", a: 12 },
        { q: "3을 1배, 2배, 3배 한 수를 차례로 써 보세요.", set: fm2Mults(3, 3), ordered: true }],
        { ok: "3을 1배, 2배, 3배 한 수는 3, 6, 9예요." }) },
    { name: "약속하기", inst: "약속을 완성해 보세요.", hints: ["3, 6, 9, …는 3을 1배, 2배, 3배, … 한 수예요.", "3을 1배 한 수는 3 자신이에요."],
      render: (b, a) => blanks(b, a, ["3을 1배, 2배, 3배, … 한 수인 3, 6, 9, …를 3의 ", { o: ["배수", "약수", "곱"], a: 0 }, "라고 해요. 이와 같이 어떤 수를 ", { o: ["1배, 2배, 3배, …", "나누어떨어지게"], a: 0 }, " 한 수를 그 수의 배수라고 해요. 어떤 수의 배수는 ", { o: ["셀 수 없이 많아요", "3개뿐이에요"], a: 0 }, ". 어떤 수의 배수 중 가장 작은 수는 ", { o: ["자기 자신", "0", "1"], a: 0 }, "이에요."]) },
    { name: "4의 배수 찾기", inst: "4의 배수를 모두 찾아 색칠해 보세요.", hints: ["4에 1, 2, 3, 4, …를 곱해 빠짐없이 찾아요.", "4 × 5 = 20이에요."],
      render: (b, a) => fm2Board(b, a, { nums: fm2Range(1, 20), cols: 10, layers: [{ name: "4의 배수", want: fm2MultsTo(4, 20), shape: "fill", why: v => v < 4 ? `${fm2J(v, "은는")} 4보다 작아서 4의 배수가 아니에요. 4의 배수 중 가장 작은 수는 4예요.` : `4 × ${Math.floor(v / 4)} = ${4 * Math.floor(v / 4)}, 4 × ${Math.floor(v / 4) + 1} = ${fm2J(4 * Math.floor(v / 4) + 4, "이라")} ${fm2J(v, "은는")} 그 사이에 있는 수예요. 4의 배수가 아니에요.`, miss: "4 × 1, 4 × 2, 4 × 3, …을 차례로 계산해 봐요." }],
        ok: "4의 배수는 4, 8, 12, 16, 20, …이에요. 4씩 커져요." }) },
    { name: "약수와 배수의 관계", inst: "18을 여러 수의 곱으로 나타낸 식을 보고 친구들이 이야기해요. 옳게 말한 것을 모두 골라 보세요.", hints: ["18 = 2 × 9에서 2와 9는 18을 나누어떨어지게 해요.", "18은 2를 9배 한 수이기도 해요."],
      render: (b, a) => quiz(b, a, [
        { q: "옳게 말한 것을 모두 고르세요.", fig: fm2Note("18 = 1 × 18 · 18 = 2 × 9 · 18 = 3 × 6 · 18 = 2 × 3 × 3"), o: ["서윤: 2와 9는 18의 약수야.", "시우: 18은 2와 9의 배수야.", "유나: 2 × 3도 18의 약수야.", "18은 6의 약수야."], a: [0, 1, 2], why: { "3": "18은 6을 3배 한 수이므로 6의 배수예요. 6이 18의 약수예요." } },
        { q: "어떤 수를 여러 수의 곱으로 나타냈을 때, 곱하는 수들은 어떤 수의 □이고, 어떤 수는 곱하는 수들의 □예요.", o: ["약수, 배수", "배수, 약수"], a: 0 }],
        { ok: "18 = 2 × 3 × 3이므로 2, 3, 2 × 3, 3 × 3도 18의 약수이고, 18은 그 수들의 배수예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 수 배열표에서 5의 배수에는 ○표, 8의 배수에는 △표 하세요.", hints: ["5의 배수는 일의 자리 숫자가 0이나 5예요.", "40은 5의 배수이면서 8의 배수예요."],
    render: (b, a) => fm2Board(b, a, { nums: fm2Range(1, 50), cols: 10, cell: 68, layers: [{ name: "5의 배수", want: fm2MultsTo(5, 50), shape: "circle" }, { name: "8의 배수", want: fm2MultsTo(8, 50), shape: "tri" }], ask: [
      { q: "16의 배수를 가장 작은 수부터 5개 써 보세요.", set: fm2Mults(16, 5), ordered: true, why: { "0": "배수 중 가장 작은 수는 자기 자신(16)이에요." } },
      { q: "26의 배수 중 두 자리 수는 몇 개인가요?", a: fm2MultsTo(26, 99).length, unit: "개" },
      { q: "도훈: 12의 배수야. 민영: 그중 100에 가장 가까운 수야. 두 사람이 설명하는 수는?", a: 96, why: { "108": "108은 100과 8 차이, 96은 100과 4 차이예요.", "100": "100은 12의 배수가 아니에요." } },
      { q: "30 = 2 × 3 × 5를 보고 옳게 말한 것은?", o: ["㉠ 30은 2 × 3의 약수예요.", "㉡ 30의 약수는 2, 3, 5뿐이에요.", "㉢ 2 × 5는 30의 배수예요.", "㉣ 5는 30의 약수예요."], a: 3, why: { "0": "30은 2 × 3 = 6의 배수예요.", "1": "1, 30, 2 × 3, 2 × 5, 3 × 5 등도 30의 약수예요.", "2": "2 × 5 = 10은 30의 약수예요." } }],
      ok: "배수를 빠짐없이 찾고, 약수와 배수의 관계도 바르게 말했어요!" }) }
},
{
  id: "t45", no: "4~5", title: "공약수와 최대공약수를 알아볼까요", soop: "개념 구축하기(O)",
  question: "양갱 12개와 약과 16개를 상자 몇 개에 남김없이 똑같이 나누어 담을 수 있을까요?",
  summary: "8과 12의 공통된 약수 1, 2, 4를 8과 12의 공약수, 공약수 중 가장 큰 수 4를 최대공약수라고 해요. 최대공약수의 약수는 공약수와 같아요. 최대공약수는 여러 수의 곱으로 나타낸 식에서 공통으로 들어 있는 수를 모두 곱하거나, 공약수로 더 이상 나눌 수 없을 때까지 나누고 나눈 공약수를 모두 곱해서 구해요.",
  steps: [
    { inst: "할머니 생신 기념 선물로 윤우는 양갱 12개와 약과 16개를 상자에 남김없이 똑같이 나누어 담으려고 해요. 양갱과 약과를 각각 똑같이 나누어 담을 수 있는 상자 수에 ○표 하세요. 수를 누르면 아래에 나눗셈이 보여요.", hints: ["양갱은 12의 약수, 약과는 16의 약수만큼의 상자에 나누어 담을 수 있어요.", "두 줄에 모두 ○표 한 수는 양갱과 약과를 모두 똑같이 나눌 수 있는 상자 수예요."],
      render: (b, a) => fm2Rows(b, a, { common: true, rows: [
        { label: "양갱 12개", nums: fm2Range(1, 12), want: FM2_D(12), what: "양갱 12개를 똑같이 나눌 수 있는 상자 수", why: v => `양갱 12개를 상자 ${v}개에 나누면 12 ÷ ${v} = ${Math.floor(12 / v)} … ${fm2J(12 % v, "으로")} 남아요.`, peek: v => `12 ÷ ${v} = ${Math.floor(12 / v)}${12 % v ? ` … ${12 % v} (남아요)` : " (똑같이 나누어져요)"}` },
        { label: "약과 16개", nums: fm2Range(1, 16), want: FM2_D(16), what: "약과 16개를 똑같이 나눌 수 있는 상자 수", why: v => `약과 16개를 상자 ${v}개에 나누면 16 ÷ ${v} = ${Math.floor(16 / v)} … ${fm2J(16 % v, "으로")} 남아요.`, peek: v => `16 ÷ ${v} = ${Math.floor(16 / v)}${16 % v ? ` … ${16 % v} (남아요)` : " (똑같이 나누어져요)"}` }],
        found: "양갱과 약과를 모두 똑같이 나눌 수 있는 상자 수: ",
        ask: [
          { q: "양갱 12개와 약과 16개를 모두 남김없이 똑같이 나누어 담을 수 있는 상자 수를 모두 써 보세요.", set: fm2Both(FM2_D(12), FM2_D(16)), unit: "개", why: { "3": "약과 16개는 상자 3개에 똑같이 나눌 수 없어요.", "8": "양갱 12개는 상자 8개에 똑같이 나눌 수 없어요." } },
          { q: "최대한 많은 상자에 똑같이 나누어 담는다면 상자는 몇 개인가요?", a: 4, unit: "개", why: { "16": "약과는 16상자에 나눌 수 있지만 양갱 12개는 16상자에 똑같이 나눌 수 없어요.", "12": "양갱은 12상자에 나눌 수 있지만 약과 16개는 12상자에 똑같이 나눌 수 없어요." } }],
        ok: "상자 1개, 2개, 4개에 나누어 담을 수 있고, 최대한 많이 담으면 4상자예요. 한 상자에 양갱 3개, 약과 4개씩이에요." }) },
    { name: "약속하기", inst: "8과 12의 공통된 약수를 찾고 약속을 완성해 보세요.", hints: ["8의 약수는 1, 2, 4, 8이에요.", "12의 약수는 1, 2, 3, 4, 6, 12예요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "8의 약수를 모두 써 보세요.", set: FM2_D(8) },
        { q: "12의 약수를 모두 써 보세요.", set: FM2_D(12) },
        { q: "8과 12의 공통된 약수를 모두 써 보세요.", set: fm2Both(FM2_D(8), FM2_D(12)), why: { "8": "8은 12의 약수가 아니에요.", "3": "3은 8의 약수가 아니에요." } },
        { q: "공통된 약수 중 가장 큰 수는?", a: 4, why: { "12": "12는 8의 약수가 아니에요. 공통된 약수 중에서 골라요.", "24": "24는 8과 12의 공배수예요. 약수는 그 수보다 클 수 없어요." } },
        { q: "1, 2, 4는 8의 약수도 되고 12의 약수도 돼요. 8과 12의 공통된 약수인 1, 2, 4를 8과 12의 □라고 해요.", o: ["공약수", "공배수", "최대공약수"], a: 0 },
        { q: "공약수 중에서 가장 큰 수인 4를 8과 12의 □라고 해요.", o: ["최대공약수", "최소공배수", "공약수"], a: 0 }],
        { ok: "8과 12의 공약수는 1, 2, 4이고, 최대공약수는 4예요." }) },
    { name: "공약수와 최대공약수의 관계", inst: "24의 약수와 32의 약수예요. 두 줄에 모두 있는 수를 눌러 같은 수끼리 이어 보세요.", hints: ["두 줄에 모두 있는 수가 24와 32의 공약수예요.", "8의 약수는 1, 2, 4, 8이에요."],
      render: (b, a) => fm2Rows(b, a, { mode: "link", common: true, say1: "24의 약수와 32의 약수 중 두 줄에 모두 있는 수(공약수)를 눌러 이어요.", notBoth: "두 줄에 모두 있는 수가 아니에요.",
        rows: [{ label: "24의 약수", nums: FM2_D(24) }, { label: "32의 약수", nums: FM2_D(32) }], found: "24와 32의 공약수: ",
        ask: [
          { q: "24와 32의 최대공약수는?", a: fm2Gcd(24, 32), why: { "32": "32는 24의 약수가 아니에요.", "96": "96은 24와 32의 최소공배수예요. 최대공약수는 두 수보다 클 수 없어요." } },
          { q: "최대공약수 8의 약수를 모두 써 보세요.", set: FM2_D(8) },
          { q: "알게 된 점으로 알맞은 것은?", o: ["최대공약수의 약수는 공약수와 같아요.", "최대공약수의 배수는 공약수와 같아요.", "공약수는 최대공약수보다 커요."], a: 0 },
          { q: "24와 32의 공약수 중 가장 작은 수는?", a: 1, why: { "2": "1은 모든 수의 약수예요. 공약수 중 가장 작은 수는 언제나 1이에요." } }],
        ok: "24와 32의 공약수 1, 2, 4, 8은 최대공약수 8의 약수와 같아요." }) },
    { name: "여러 수의 곱으로 구하기", inst: "12와 18을 두 수의 곱으로, 또 더 작은 수의 곱으로 나타내어 최대공약수를 구해 봐요. 다 하면 30과 45도 같은 방법으로 구해요.", hints: ["12 = 2 × 6, 6 = 2 × 3이므로 12 = 2 × 2 × 3이에요.", "12 = 2 × 2 × 3, 18 = 2 × 3 × 3에 공통으로 들어 있는 수는 2와 3이에요."],
      render: (b, a) => fm2Tree(b, a, { goal: "gcd", pairs: [[12, 18], [30, 45]], ask: [
        { q: "여러 수의 곱으로 나타낸 식으로 최대공약수를 구하는 방법은?", o: ["식에 공통으로 들어 있는 수를 모두 곱해요.", "식에 있는 수를 모두 곱해요.", "식에서 가장 큰 수를 골라요."], a: 0 }],
        ok: "12와 18의 최대공약수는 2 × 3 = 6, 30과 45의 최대공약수는 3 × 5 = 15예요." }) },
    { name: "공약수로 나누어 구하기", inst: "공약수로 나누어 12와 18의 최대공약수를 구해 봐요. 다 하면 30과 45도 구해요. 어떤 공약수로 먼저 나누어도 괜찮아요.", hints: ["12와 18은 둘 다 2로 나누어떨어져요.", "더 이상 1이 아닌 공약수가 없을 때까지 나누고, 왼쪽의 수를 모두 곱해요."],
      render: (b, a) => fm2Ladder(b, a, { goal: "gcd", pairs: [[12, 18], [30, 45]], ask: [
        { q: "12와 18을 6으로 한 번에 나누면 몫은 2와 3이에요. 이때 최대공약수는?", a: 6 },
        { q: "공약수로 나누어 최대공약수를 구하는 방법은?", o: ["두 수의 공약수로 더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수를 모두 곱해요.", "두 수를 1로 나누고 몫을 곱해요.", "마지막 몫을 모두 곱해요."], a: 0 }],
        ok: "공약수로 나누어도 12와 18의 최대공약수는 6, 30과 45의 최대공약수는 15예요. 두 가지 방법의 답이 같아요." }) }
  ],
  challenge: { inst: "가로 15 cm, 세로 9 cm인 직사각형 모양의 사진을 크기가 같은 정사각형 모양으로 남는 부분 없이 나누어 그림 맞추기 퍼즐을 만들려고 해요. 가장 큰 정사각형으로 나누려면 한 변의 길이를 몇 cm로 해야 할까요?", hints: ["정사각형의 한 변의 길이는 15와 9의 공약수여야 해요.", "15의 약수 1, 3, 5, 15 / 9의 약수 1, 3, 9"],
    render: (b, a) => fm2Square(b, a, { w: 15, h: 9, ask: [
      { q: "가장 큰 정사각형의 한 변의 길이는?", a: fm2Gcd(15, 9), unit: "cm", why: { "1": "1 cm로도 나눌 수 있지만 더 큰 정사각형이 있어요.", "5": "5 cm로는 세로 9 cm를 남김없이 나눌 수 없어요.", "9": "9 cm로는 가로 15 cm를 남김없이 나눌 수 없어요." } },
      { q: "그때 정사각형 조각은 모두 몇 개인가요?", a: (15 / 3) * (9 / 3), unit: "개" },
      { q: "(수학익힘) 연필 78자루와 볼펜 84자루를 최대한 많은 사람에게 남김없이 똑같이 나누어 주려면 몇 명에게 줄 수 있나요?", a: fm2Gcd(78, 84), unit: "명" },
      { q: "(수학익힘) 정원: ‘54와 72의 공약수 중에서 가장 작은 수는 6이야.’ 바르게 고친 것은?", o: ["54와 72의 공약수 중에서 가장 작은 수는 1이야.", "54와 72의 공약수 중에서 가장 작은 수는 2야.", "54와 72의 공약수 중에서 가장 작은 수는 18이야."], a: 0, why: { "2": "1은 모든 수의 약수예요.", "1": "1은 모든 수의 약수예요. 18은 54와 72의 최대공약수예요." } }],
      ok: "15와 9의 최대공약수 3 cm로 나누면 가장 큰 정사각형 15조각이 돼요!" }) }
},
{
  id: "t67", no: "6~7", title: "공배수와 최소공배수를 알아볼까요", soop: "개념 구축하기(O)",
  question: "윤우와 할머니가 다시 박수를 동시에 치는 때는 몇 초 후일까요?",
  summary: "4와 6의 공통된 배수 12, 24, …를 4와 6의 공배수, 공배수 중 가장 작은 수 12를 최소공배수라고 해요. 최소공배수의 배수는 공배수와 같아요. 최소공배수는 여러 수의 곱으로 나타낸 식에서 공통으로 들어 있는 수는 한 번만 곱하고 공통이 아닌 남은 수를 곱하거나, 공약수로 나누고 나눈 공약수와 마지막 몫을 모두 곱해서 구해요.",
  steps: [
    { inst: "할머니의 건강을 위해 윤우와 할머니는 박수를 치며 걷기로 했어요. 윤우는 2초마다, 할머니는 3초마다 박수를 쳐요. 동시에 박수를 치기 시작했을 때, 두 사람이 박수를 치는 때에 각각 ○표 하세요.", hints: ["윤우는 2초, 4초, 6초, …에 박수를 쳐요.", "할머니는 3초, 6초, 9초, …에 박수를 쳐요."],
      render: (b, a) => fm2Rows(b, a, { common: true, rows: [
        { label: "윤우(초)", nums: fm2Range(1, 13), want: fm2MultsTo(2, 13), what: "윤우가 박수를 치는 때", why: v => `윤우는 2초마다 박수를 쳐요. ${v}초에는 치지 않아요.`, miss: "2초, 4초, …처럼 2초씩 늘려 가요." },
        { label: "할머니(초)", nums: fm2Range(1, 13), want: fm2MultsTo(3, 13), what: "할머니가 박수를 치는 때", why: v => `할머니는 3초마다 박수를 쳐요. ${v}초에는 치지 않아요.`, miss: "3초, 6초, …처럼 3초씩 늘려 가요." }],
        say1: "두 사람이 함께 박수를 치는 때를 눌러 이어요.", notBoth: "두 사람이 함께 박수를 치는 때가 아니에요.", found: "두 사람이 동시에 박수를 치는 때(초): ",
        ask: [
          { q: "13초까지 두 사람이 다시 박수를 동시에 치는 때를 모두 써 보세요.", set: fm2Both(fm2MultsTo(2, 13), fm2MultsTo(3, 13)), unit: "초 후" },
          { q: "처음으로 다시 박수를 동시에 치는 때는 몇 초 후인가요?", a: 6, unit: "초 후", why: { "12": "12초 후에도 동시에 치지만 그보다 먼저 동시에 치는 때가 있어요." } }],
        ok: "6초 후, 12초 후에 동시에 박수를 치고, 처음으로 다시 동시에 치는 때는 6초 후예요." }) },
    { name: "약속하기", inst: "4와 6의 공통된 배수를 찾고 약속을 완성해 보세요.", hints: ["4의 배수: 4, 8, 12, 16, 20, 24", "6의 배수: 6, 12, 18, 24, 30, 36"],
      render: (b, a) => fm2Ask(b, a, [
        { q: "4의 배수를 가장 작은 수부터 6개 써 보세요.", set: fm2Mults(4, 6), ordered: true },
        { q: "6의 배수를 가장 작은 수부터 6개 써 보세요.", set: fm2Mults(6, 6), ordered: true },
        { q: "위에서 쓴 수 중 4와 6의 공통된 배수를 모두 써 보세요.", set: fm2Both(fm2Mults(4, 6), fm2Mults(6, 6)) },
        { q: "공통된 배수 중 가장 작은 수는?", a: 12, why: { "2": "2는 4와 6의 공약수예요. 배수는 4와 6보다 작을 수 없어요.", "24": "24도 공통된 배수이지만 더 작은 수가 있어요." } },
        { q: "12, 24, …는 4의 배수도 되고 6의 배수도 돼요. 4와 6의 공통된 배수인 12, 24, …를 4와 6의 □라고 해요.", o: ["공배수", "공약수", "최소공배수"], a: 0 },
        { q: "공배수 중에서 가장 작은 수인 12를 4와 6의 □라고 해요.", o: ["최소공배수", "최대공약수", "공배수"], a: 0 },
        { q: "4와 6의 최소공배수는 4와 6보다 작은 수일까요?", o: ["아니에요. 공배수는 4의 배수이면서 6의 배수라서 4와 6보다 크거나 같아요.", "네. ‘최소’라서 4와 6보다 작아요."], a: 0 }],
        { ok: "4와 6의 공배수는 12, 24, …이고, 최소공배수는 12예요." }) },
    { name: "공배수와 최소공배수의 관계", inst: "6의 배수와 9의 배수예요. 두 줄에 모두 있는 수를 눌러 같은 수끼리 이어 보세요.", hints: ["두 줄에 모두 있는 수가 6과 9의 공배수예요.", "18, 36, 54는 18의 배수예요."],
      render: (b, a) => fm2Rows(b, a, { mode: "link", common: true, say1: "6의 배수와 9의 배수 중 두 줄에 모두 있는 수(공배수)를 눌러 이어요.", notBoth: "두 줄에 모두 있는 수가 아니에요.",
        rows: [{ label: "6의 배수", nums: fm2Mults(6, 10) }, { label: "9의 배수", nums: fm2Mults(9, 10) }], found: "6과 9의 공배수(여기까지): ",
        ask: [
          { q: "6과 9의 최소공배수는?", a: fm2Lcm(6, 9), why: { "54": "54도 공배수이지만 가장 작은 공배수는 아니에요.", "3": "3은 6과 9의 최대공약수예요." } },
          { q: "최소공배수 18의 배수를 가장 작은 수부터 3개 써 보세요.", set: fm2Mults(18, 3), ordered: true },
          { q: "알게 된 점으로 알맞은 것은?", o: ["최소공배수의 배수는 공배수와 같아요.", "최소공배수의 약수는 공배수와 같아요.", "공배수는 3개뿐이에요."], a: 0 }],
        ok: "6과 9의 공배수 18, 36, 54, …는 최소공배수 18의 배수와 같아요." }) },
    { name: "여러 수의 곱으로 구하기", inst: "18과 30을 여러 수의 곱으로 나타내어 최소공배수를 구해 봐요. 다 하면 9와 21도 같은 방법으로 구해요.", hints: ["18 = 2 × 3 × 3, 30 = 2 × 3 × 5예요.", "공통으로 들어 있는 2 × 3은 한 번만 곱하고, 남은 3과 5를 곱해요."],
      render: (b, a) => fm2Tree(b, a, { goal: "lcm", pairs: [[18, 30], [9, 21]], ask: [
        { q: "18의 배수 18, 36, 54, 72, 90과 30의 배수 30, 60, 90, 120, 150에서 찾은 최소공배수는?", a: fm2Lcm(18, 30) },
        { q: "여러 수의 곱으로 나타낸 식으로 최소공배수를 구하는 방법은?", o: ["공통으로 들어 있는 수는 한 번만 곱하고, 공통이 아닌 남은 수를 곱해요.", "식에 있는 수를 모두 곱해요.", "공통으로 들어 있는 수만 곱해요."], a: 0, why: { "1": "그러면 공통인 수를 두 번 곱하게 돼요.", "2": "그것은 최대공약수를 구하는 방법이에요." } }],
        ok: "18과 30의 최소공배수는 2 × 3 × 3 × 5 = 90, 9와 21의 최소공배수는 3 × 3 × 7 = 63이에요." }) },
    { name: "공약수로 나누어 구하기", inst: "공약수로 나누어 18과 30의 최소공배수를 구해 봐요. 다 하면 9와 21도 구해요.", hints: ["18과 30은 둘 다 2로, 그다음 몫 9와 15는 둘 다 3으로 나누어떨어져요.", "나눈 공약수와 마지막 몫을 모두 곱해요(ㄴ자 모양)."],
      render: (b, a) => fm2Ladder(b, a, { goal: "lcm", pairs: [[18, 30], [9, 21]], ask: [
        { q: "18과 30을 최대공약수 6으로 한 번에 나누면 몫은 3과 5예요. 최소공배수 6 × 3 × 5 =", a: 90 },
        { q: "공약수로 나누어 최소공배수를 구하는 방법은?", o: ["더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수와 마지막 몫을 모두 곱해요.", "나눈 공약수만 모두 곱해요.", "마지막 몫만 곱해요."], a: 0, why: { "1": "그것은 최대공약수를 구하는 방법이에요." } }],
        ok: "18과 30의 최소공배수는 90, 9와 21의 최소공배수는 63이에요. 두 가지 방법의 답이 같아요." }) }
  ],
  challenge: { inst: "놀이공원에서 코끼리 열차는 6분마다, 호랑이 열차는 10분마다 출발해요. 두 열차가 오후 2시 20분에 동시에 출발했어요. 수직선에 두 열차가 출발하는 때를 차례로 눌러 보세요(0은 오후 2시 20분, 수는 몇 분 후).", hints: ["코끼리 열차는 6분 후, 12분 후, …에 출발해요.", "6과 10의 최소공배수를 구해요."],
    render: (b, a) => fm2Hop(b, a, { max: 60, snap: 2, lab: 10, zero: "오후 2시 20분", hops: [{ n: 6, count: 10, name: "코끼리 열차" }, { n: 10, count: 6, name: "호랑이 열차" }], ask: [
      { q: "두 열차는 몇 분마다 동시에 출발하나요?", a: fm2Lcm(6, 10), unit: "분", why: { "60": "60분 후에도 동시에 출발하지만 그보다 먼저 동시에 출발하는 때가 있어요.", "2": "2는 6과 10의 최대공약수예요." } },
      { q: "다음번에 두 열차가 동시에 출발하는 시각은?", o: ["오후 2시 50분", "오후 3시 20분", "오후 2시 26분"], a: 0, why: { "1": "60분 후는 두 번째로 동시에 출발하는 때예요.", "2": "2시 26분에는 코끼리 열차만 출발해요." } },
      { q: "(수학익힘) 54와 18의 최소공배수는?", a: fm2Lcm(54, 18), why: { "18": "18은 54와 18의 최대공약수예요.", "972": "54 × 18은 공배수이지만 가장 작은 공배수가 아니에요. 54는 18의 배수예요." } },
      { q: "(수학익힘) 8과 20의 공배수 중에서 100보다 작은 수는 몇 개인가요?", a: fm2MultsTo(fm2Lcm(8, 20), 99).length, unit: "개" }],
    ok: "6과 10의 최소공배수는 30이므로 30분마다 동시에 출발해요. 다음번은 오후 2시 50분이에요!" }) }
},
{
  id: "t8", no: 8, title: "생각을 더하다 ― 체육 대회에 어떻게 입장해야 할까요", soop: "탐구 정리하기(O)",
  question: "남학생과 여학생이 몇 명씩 몇 줄로 줄을 서는 방법은 각각 몇 가지일까요?",
  summary: "몇 명씩 몇 줄로 남김없이 똑같이 줄을 서는 방법의 가짓수는 학생 수의 약수의 개수와 같아요. 남학생 72명(12 × 6)은 72의 약수가 12개라서 12가지, 여학생 84명은 84의 약수가 12개라서 12가지예요.",
  steps: [
    { name: "이해해요", inst: "지한이네 학교에서 어린이날 기념 체육 대회가 열려요. 지한이의 일기와 조건을 읽고 문제를 이해해요.", hints: ["조건 1, 2, 3을 차례로 읽어 봐요.", "구하려는 것은 일기의 마지막 문장에 있어요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "구하려는 것은 무엇인가요?", fig: fm2Note(h("b", {}, "지한이의 일기"), "기다리고 기다리던 어린이날 기념 체육 대회가 며칠 후에 열린다. 우리 학교 5학년 학생들은 동물 가면을 쓰고 입장을 하기로 했다. 남학생과 여학생이 따로 입장할 때 남학생과 여학생이 각각 줄을 서는 방법에 대해 알아보기로 했다. 남학생과 여학생이 몇 명씩 몇 줄로 줄을 서는 방법은 각각 몇 가지일까?", h("b", {}, "조건"), "1. 5학년은 6개의 반이 있습니다.  2. 5학년 각 반의 남학생은 12명입니다.  3. 5학년 여학생은 모두 84명입니다."),
          o: ["남학생과 여학생이 각각 줄을 서는 방법의 가짓수", "5학년 반의 수", "동물 가면의 수"], a: 0 },
        { q: "5학년 반의 수", a: 6, unit: "개" },
        { q: "5학년 각 반의 남학생 수", a: 12, unit: "명" },
        { q: "5학년 여학생 수", a: 84, unit: "명" }], { ok: "문제를 이해했어요. 이제 어떻게 해결할지 계획해요." }) },
    { name: "계획해요", inst: "문제를 어떻게 해결할지 계획해요.", hints: ["각 반의 남학생이 12명씩 6개 반이에요.", "‘몇 명씩 몇 줄’로 남김없이 똑같이 서려면 학생 수를 나누어떨어지게 하는 수를 찾아요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "5학년 남학생 수는 어떻게 구할까요?", o: ["각 반의 남학생 수와 반의 수를 곱해요.", "각 반의 남학생 수와 반의 수를 더해요."], a: 0 },
        { q: "5학년 남학생 수 12 × 6 =", a: 72, unit: "명", why: { "18": "12와 6을 더했어요. 12명씩 6개 반이니 곱해요." } },
        { q: "줄을 서는 방법의 가짓수는 무엇을 이용해 구할까요?", o: ["학생 수의 약수", "학생 수의 배수"], a: 0, why: { "1": "학생 수를 몇 명씩 똑같이 나누는 것이니 약수를 이용해요." } },
        { q: "‘6명씩 12줄’과 ‘12명씩 6줄’은?", o: ["서로 다른 방법으로 세어요.", "같은 방법이라 한 번만 세어요."], a: 0 }],
        { ok: "남학생 72명과 여학생 84명의 약수를 이용해 줄을 서는 방법을 구해요." }) },
    { name: "해결해요 ① 남학생", inst: "남학생 72명이 한 줄에 똑같은 수씩 줄을 서는 방법을 모두 찾아 기록해 보세요. 한 줄에 서는 학생 수를 바꾸어 가며 모든 줄이 꽉 차는지 살펴봐요.", hints: ["72 ÷ 1, 72 ÷ 2, 72 ÷ 3, …이 나누어떨어지는지 살펴봐요.", "72 = 1 × 72 = 2 × 36 = 3 × 24 = 4 × 18 = 6 × 12 = 8 × 9"],
      render: (b, a) => fm2Rect(b, a, { n: 72, item: "남학생", unit: "명", start: 5, color: FM2.blue, tip: "남학생 72명이 한 줄에 똑같은 수씩 서요. 모든 줄이 똑같이 꽉 차면 ‘이 방법 기록하기’를 눌러요.", ask: [
        { q: "72의 약수를 모두 써 보세요.", set: FM2_D(72) },
        { q: "남학생이 줄을 서는 방법은 몇 가지인가요?", a: FM2_D(72).length, unit: "가지", why: { "6": "‘8명씩 9줄’과 ‘9명씩 8줄’처럼 바꾼 것도 따로 세어요." } }],
        ok: "72의 약수는 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72로 12개예요. 남학생은 12가지 방법으로 줄을 설 수 있어요." }) },
    { name: "해결해요 ② 여학생", inst: "여학생 84명이 한 줄에 똑같은 수씩 줄을 서는 방법을 모두 찾아 기록해 보세요.", hints: ["84 ÷ 7 = 12예요.", "84 = 1 × 84 = 2 × 42 = 3 × 28 = 4 × 21 = 6 × 14 = 7 × 12"],
      render: (b, a) => fm2Rect(b, a, { n: 84, item: "여학생", unit: "명", start: 5, color: "#C2416B", tip: "여학생 84명이 한 줄에 똑같은 수씩 서요. 모든 줄이 똑같이 꽉 차면 ‘이 방법 기록하기’를 눌러요.", ask: [
        { q: "84의 약수를 모두 써 보세요.", set: FM2_D(84) },
        { q: "여학생이 줄을 서는 방법은 몇 가지인가요?", a: FM2_D(84).length, unit: "가지" }],
        ok: "84의 약수는 1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84로 12개예요. 여학생도 12가지 방법으로 줄을 설 수 있어요." }) },
    { name: "되돌아봐요", inst: "문제를 해결한 과정을 되돌아봐요.", hints: ["어떤 차례로 해결했는지 떠올려 봐요.", "약수를 짝 지어 찾으면 빠뜨리지 않아요."],
      render: (b, a) => writeStep(b, a, [
        { q: "어떤 방법으로 해결했는지 설명해 보세요.", tag: "방법", ph: "예: 남학생 수를 12 × 6 = 72로 구하고, 72의 약수의 개수를 세었어요." },
        { q: "약수와 배수 중 무엇을 이용했고, 왜 그랬는지 써 보세요.", tag: "까닭", ph: "예: 학생들을 몇 명씩 똑같이 나누어 서야 하니까 약수를 이용했어요." }]) }
  ],
  challenge: { inst: "민서네 학교 5학년 학생들은 봄맞이 마을 축제 입장 준비를 하고 있어요. 5학년은 5개의 반이 있고 각 반의 여학생은 14명, 5학년 남학생은 모두 80명이에요. 여학생과 남학생이 따로 입장할 때 줄을 서는 방법은 각각 몇 가지일까요?", hints: ["여학생 수는 14 × 5예요.", "70의 약수와 80의 약수의 개수를 세어요."],
    render: (b, a) => fm2Ask(b, a, [
      { q: "5학년 여학생 수 14 × 5 =", a: 70, unit: "명" },
      { q: "70의 약수를 모두 써 보세요.", set: FM2_D(70) },
      { q: "여학생이 줄을 서는 방법은 몇 가지?", a: FM2_D(70).length, unit: "가지" },
      { q: "80의 약수를 모두 써 보세요.", set: FM2_D(80) },
      { q: "남학생이 줄을 서는 방법은 몇 가지?", a: FM2_D(80).length, unit: "가지" }],
      { ok: "여학생은 8가지, 남학생은 10가지 방법으로 줄을 설 수 있어요!" }) }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 약수와 배수 이어달리기", soop: "발표하기(P)",
  question: "앞 사람이 고른 수의 약수나 배수를 찾아 이어 갈 수 있을까요?",
  summary: "앞 사람이 고른 수의 약수나 배수 중 아직 ×표 하지 않은 수를 골라 ×표 해요. 약수는 그 수를 나누어떨어지게 하는 수, 배수는 그 수를 1배, 2배, 3배, … 한 수예요.",
  steps: [
    { name: "놀이 방법 알기", inst: "놀이 방법을 차례대로 눌러 보세요.", hints: ["먼저 색연필을 고르고 순서를 정해요.", "×표 할 수 있는 수가 없을 때까지 계속해요."],
      render: (b, a) => sequence(b, a, ["① 서로 다른 색의 색연필을 고르고 가위바위보로 순서를 정해요.", "② 첫 번째 사람은 놀이판에서 25보다 작은 수 하나에 ×표 해요.", "③ 다음 사람은 ‘약수’나 ‘배수’를 외치고, 앞 사람이 고른 수의 약수나 배수 하나에 ×표 해요.", "④ ×표 할 수 있는 수가 없을 때까지 순서대로 계속해요."], [0, 1, 2, 3]) },
    { name: "규칙 알기", inst: "놀이 규칙을 확인해요. 놀이판에는 1부터 50까지의 수가 있어요.", hints: ["20의 약수는 20을 나누어떨어지게 하는 수예요.", "이미 ×표 된 수에는 표시할 수 없어요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "첫 번째 사람이 고를 수 있는 수는?", o: ["25보다 작은 수", "25보다 큰 수", "아무 수나"], a: 0 },
        { q: "첫 번째 사람이 20에 ×표 했어요. 다음 사람이 ‘약수!’를 외쳤다면 ×표 할 수 있는 수를 모두 써 보세요.", set: FM2_D(20).filter(v => v !== 20), why: { "20": "20은 이미 ×표 되어 있어요.", "40": "40은 20의 배수예요." } },
        { q: "‘배수!’를 외쳤다면 놀이판(1~50)에서 ×표 할 수 있는 수를 모두 써 보세요.", set: fm2MultsTo(20, 50).filter(v => v !== 20), why: { "20": "20은 이미 ×표 되어 있어요.", "60": "60은 놀이판에 없어요." } }],
        { ok: "20의 약수 1, 2, 4, 5, 10이나 20의 배수 40에 ×표 할 수 있어요." }) },
    { name: "놀이하기", inst: "컴퓨터와 약수와 배수 이어달리기를 해 보세요. 놀이를 끝까지 하면 다음 계단으로 갈 수 있어요.", hints: ["앞 사람이 고른 수를 나누어떨어지게 하는 수는 약수예요.", "앞 사람이 고른 수에 2, 3, …을 곱한 수는 배수예요."],
      render: (b, a) => fm2Game(b, a, { max: 50, first: 25, level: "easy" }) },
    { name: "전략 생각하기", inst: "놀이를 잘하려면 어떤 수에 ×표 할지 잘 생각해야 해요. 놀이판(1~50)을 떠올리며 답해 보세요.", hints: ["17의 약수는 1과 17, 17의 배수는 17, 34, 51, …예요.", "49의 약수는 1, 7, 49예요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "앞 사람이 17에 ×표 했어요. 다음 사람이 ×표 할 수 있는 수를 모두 써 보세요(다른 수는 아직 ×표 하지 않았어요).", set: [...FM2_D(17), ...fm2MultsTo(17, 50)].filter(v => v !== 17) },
        { q: "앞 사람이 49에 ×표 했고, 1과 7에는 이미 ×표 되어 있어요. 다음 사람은 어떻게 될까요?", o: ["×표 할 수 있는 수가 없어요.", "98에 ×표 해요.", "14에 ×표 해요."], a: 0, why: { "1": "98은 놀이판에 없어요.", "2": "14는 49의 약수도 배수도 아니에요." } },
        { q: "1에 ×표 하면 다음 사람은 어떤 수를 고를 수 있을까요?", o: ["×표 하지 않은 아무 수나(모든 수는 1의 배수예요)", "1의 약수만"], a: 0 }],
        { ok: "상대가 고를 수 있는 수가 적게 남도록 생각하면 놀이를 잘할 수 있어요." }) },
    { name: "또 다른 놀이", inst: "지도서의 또 다른 놀이예요. 각자 1~20 중 10개의 수를 카드에 써서 놀이해요. 앞 사람이 내려놓은 수의 약수가 쓰인 카드를 한 번에 여러 장 내려놓을 수 있어요.", hints: ["12의 약수는 1, 2, 3, 4, 6, 12예요.", "약수가 아닌 카드를 내거나 한 장도 못 내면 가운데 더미에서 1장 가져가요."],
      render: (b, a) => quiz(b, a, [
        { q: "앞 사람이 12를 내려놓았어요. 내 카드 3, 5, 6, 8, 18, 4 중 내려놓을 수 있는 카드를 모두 고르세요.", o: ["3", "5", "6", "8", "18", "4"], a: [0, 2, 5], why: { "3": "12 ÷ 8 = 1 … 4라 8은 12의 약수가 아니에요.", "4": "18은 12보다 커서 12의 약수가 될 수 없어요." } },
        { q: "이 놀이에서 이기는 사람은?", o: ["가장 먼저 카드를 모두 내려놓은 사람", "카드를 가장 많이 가진 사람"], a: 0 }],
        { ok: "12의 약수인 3, 6, 4를 한꺼번에 내려놓을 수 있어요!" }) }
  ],
  challenge: { inst: "조금 더 잘하는 컴퓨터와 겨루어 이겨 보세요. 상대가 ×표 할 수 있는 수가 없게 만들면 이겨요.", hints: ["1을 고르면 상대는 아무 수나 고를 수 있어요.", "약수와 배수가 거의 없는 수(예: 47, 49처럼 큰 수)를 노려 봐요."],
    render: (b, a) => fm2Game(b, a, { max: 50, first: 25, level: "normal", needWin: true }) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "약수와 배수, 최대공약수와 최소공배수를 구하고 활용할 수 있나요?",
  summary: "약수는 어떤 수를 나누어떨어지게 하는 수, 배수는 어떤 수를 1배, 2배, 3배, … 한 수예요. 두 수의 공통된 약수 중 가장 큰 수가 최대공약수, 공통된 배수 중 가장 작은 수가 최소공배수예요. ‘최대한 많이 똑같이 나누기’는 최대공약수, ‘다시 동시에’는 최소공배수를 이용해요.",
  steps: [
    { name: "약수와 배수 쓰기", inst: "약수와 배수를 써 보세요.", hints: ["52 ÷ 4 = 13이에요.", "배수 중 가장 작은 수는 자기 자신이에요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "52의 약수를 모두 써 보세요.", set: FM2_D(52), why: { miss: "52 ÷ 2 = 26, 52 ÷ 4 = 13처럼 짝 지어 찾아봐요." } },
        { q: "8의 배수를 가장 작은 수부터 5개 써 보세요.", set: fm2Mults(8, 5), ordered: true, why: { "0": "배수 중 가장 작은 수는 자기 자신(8)이에요." } },
        { q: "11의 배수를 가장 작은 수부터 5개 써 보세요.", set: fm2Mults(11, 5), ordered: true },
        { q: "35 = 1 × 35, 35 = 5 × 7이에요. ‘1, 5, 7, 35는 35의 □예요.’", o: ["약수", "배수"], a: 0 },
        { q: "‘35는 1, 5, 7, 35의 □예요.’", o: ["약수", "배수"], a: 1 }],
        { ok: "약수와 배수를 정확하게 구하고 둘의 관계도 알아요!" }) },
    { name: "종이띠 채우기", inst: "보기의 조각 중 한 가지 조각만 골라 9칸, 12칸으로 이루어진 종이띠를 모두 채우려고 해요. 조각을 하나씩 놓아 보세요.", hints: ["한 가지 조각만 써야 해요. 여러 조각을 섞으면 안 돼요.", "9와 12의 공약수 길이의 조각이면 두 띠를 모두 채울 수 있어요."],
      render: (b, a) => fm2Strip(b, a, { strips: [9, 12], pieces: FM2_STRIP, ask: [
        { q: "두 종이띠를 모두 채울 수 있는 조각을 모두 고르세요.", o: FM2_STRIP.map(p => `${p.k} ${p.n}칸`), a: FM2_STRIP.map((p, i) => (9 % p.n === 0 && 12 % p.n === 0) ? i : -1).filter(i => i >= 0), why: { "1": "㉡(2칸)으로는 9칸을 채울 수 없어요.", "3": "㉣(4칸)으로는 9칸을 채울 수 없어요.", "5": "㉥(6칸)으로는 9칸을 채울 수 없어요.", "4": "㉤(5칸)으로는 두 띠 모두 채울 수 없어요." } }],
        ok: "㉠과 ㉢으로 두 띠를 모두 채울 수 있어요. 1과 3은 9와 12의 공약수예요." }) },
    { name: "최대공약수와 최소공배수", inst: "공약수로 나누어 두 수의 최대공약수와 최소공배수를 구해 보세요. 30과 50을 구한 다음 72와 54도 구해요.", hints: ["30과 50은 2로, 그다음 15와 25는 5로 나누어떨어져요.", "72와 54는 2, 3, 3으로 차례로 나눌 수 있어요."],
      render: (b, a) => fm2Ladder(b, a, { goal: "both", pairs: [[30, 50], [72, 54]], ok: "30과 50: 최대공약수 10, 최소공배수 150 / 72와 54: 최대공약수 18, 최소공배수 216이에요." }) },
    { name: "생활 속 문제", inst: "생활 속 문제를 해결해 보세요.", hints: ["‘최대한 많은 상자에 남김없이 똑같이’는 최대공약수를 이용해요.", "‘동시에 깜박이는 때’는 최소공배수를 이용해요. 2분은 120초예요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "예준이네 반은 수해 지역 사람들을 돕기 위해 물 84병, 담요 56개를 준비했어요. 최대한 많은 상자에 남김없이 똑같이 나누어 담으려면 필요한 상자는 몇 개인가요?", a: fm2Gcd(84, 56), unit: "개", why: { [fm2Lcm(84, 56)]: "168은 84와 56의 최소공배수예요. 똑같이 나누는 상황이니 최대공약수를 구해요.", "4": "4로도 나눌 수 있지만 최대한 많은 상자에 담아야 해요." } },
        { q: "도넛 모양 조명의 분홍색 빛은 6초마다, 파란색 빛은 8초마다 깜박여요. 지금 두 빛이 동시에 깜박였다면 몇 초 후에 다시 동시에 깜박일까요?", a: fm2Lcm(6, 8), unit: "초", why: { "48": "6 × 8 = 48초 후에도 동시에 깜박이지만 그보다 먼저 동시에 깜박여요.", "2": "2는 6과 8의 최대공약수예요." } },
        { q: "두 빛이 동시에 깜박인 후 2분 동안 동시에 몇 번 깜박일까요?", a: Math.floor(120 / fm2Lcm(6, 8)), unit: "번", why: { "4": "2분 = 120초예요. 24, 48, 72, 96, 120초를 모두 세어요." } }],
        { ok: "물과 담요는 28상자에 나누어 담고, 두 빛은 24초마다 동시에 깜박여 2분 동안 5번 동시에 깜박여요." }) },
    { name: "확인하고 정리해요", inst: "배운 내용을 정리해요. 빈칸에 알맞은 수를 써 보세요.", hints: ["8의 약수: 1, 2, 4, 8", "3과 4의 공배수: 12, 24, 36, …"],
      render: (b, a) => fm2Ask(b, a, [
        { q: "8의 약수: 1,", post: ", 4, 8", a: 2 },
        { q: "20의 약수 1, 2, 4, 5, 10, 20과 견주면 8과 20의 최대공약수:", a: fm2Gcd(8, 20) },
        { q: "3과 4의 공배수: 12,", post: ", 36, …", a: 24 },
        { q: "3과 4의 최소공배수:", a: fm2Lcm(3, 4) },
        { q: "‘어떤 수를 나누어떨어지게 하는 수’는?", o: ["약수", "배수"], a: 0 },
        { q: "‘어떤 수를 1배, 2배, 3배, … 한 수’는?", o: ["약수", "배수"], a: 1 }],
        { ok: "약수와 배수를 잘 정리했어요. 다음 단원에서는 대응 관계를 배워요!" }) }
  ],
  challenge: { inst: "단원 첫 쪽의 매미 문제를 풀어 봐요. 13년마다 나타나는 매미와 17년마다 나타나는 매미가 2024년에 동시에 나타났대요.", hints: ["13과 17의 최소공배수를 구해요.", "13과 17은 1 말고는 공약수가 없어요. 그래서 최소공배수는 13 × 17이에요."],
    render: (b, a) => fm2Ask(b, a, [
      { q: "두 매미는 몇 년마다 동시에 나타날까요?", a: fm2Lcm(13, 17), unit: "년", why: { "30": "13과 17을 더했어요. 13의 배수이면서 17의 배수인 수를 찾아요.", "1": "1은 13과 17의 최대공약수예요." } },
      { q: "다음에 두 매미가 다시 동시에 나타나는 해는?", a: 2024 + fm2Lcm(13, 17), unit: "년" },
      { q: "(수학익힘) 3 ) 36 ㉠ → 3 ) ㉡ 15 → ㉢ 5 에서 ㉠은?", a: 45, fig: fm2LadderFig([{ d: 3, a: 36, b: "㉠" }, { d: 3, a: "㉡", b: 15 }], ["㉢", 5]) },
      { q: "㉡은?", a: 12 },
      { q: "㉢은?", a: 4 },
      { q: "36과 ㉠의 최소공배수는?", a: fm2Lcm(36, 45), why: { "9": "9는 36과 45의 최대공약수예요. 마지막 몫까지 곱해요." } }],
      { ok: "두 매미는 221년마다 동시에 나타나서 다음에는 2245년에 만나요. 단원을 끝까지 해냈어요!" }) }
}
];
