//@@APP
const APP = {title:"우리 반 학급 장터 준비단", unit:"5-1 수학 2. 약수와 배수", key:"s51-factor-v1", welcome:"우리 반 학급 장터 준비단에 온 것을 환영해요", intro:"해든초등학교 5학년 2반 친구들과 학급 장터를 준비하며, 쿠키를 봉지에 똑같이 나누고 이벤트 시간표를 짜면서 약수와 배수를 찾아봐요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u2-factor.tb.js)의 fm2 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   (입력칸 0.9초 · 고르기 0.26초 · 표시·끌기·카드 넣기 1.2초) 이 파일에서 새로 만든 그림은 앞글자 fm2s. */
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
.fm2snote{border:3px dashed #E2A65C;border-radius:var(--r);background:#FFF8EE;padding:.5em .9em;margin:.3em 0 .6em;font-family:Jua,sans-serif;line-height:1.85}
.fm2snote > b{color:#B4610F;font-weight:400}
.fm2snote ul{margin:.1em 0 0 1.1em;padding:0}
`;
  document.head.append(s);
}
const fm2Num = s => { const t = String(s).replace(/[\s,]/g, ""); return t === "" ? null : (/^\d+$/.test(t) ? Number(t) : NaN); };
const fm2Paint = (el, good) => { el.style.borderColor = good ? "var(--ok)" : "var(--no)"; };
function fm2Input(label, wide) { return h("input", { type: "text", inputmode: wide ? "text" : "numeric", autocomplete: "off", class: "fm2in" + (wide ? " wide" : ""), "aria-label": label }); }
function fm2Note(...lines) { return () => h("div", { class: "fm2note" }, ...lines.map(l => h("div", {}, l))); }
/* 입력칸에 autoRun 걸기: 쓸 때·칸을 떠날 때 확인 시계를 다시 맞추고, Enter는 칸을 떠나요 */
function fm2Hook(el, auto) {
  el.addEventListener("input", () => auto()); el.addEventListener("change", () => auto());
  el.addEventListener("focusout", () => setTimeout(() => auto(), 0));
  el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); el.blur(); } });
}

/* ① 묻고 답하기: 수 하나 / 수 여러 개(쉼표) / 고르기를 한 번에 — 다 쓰거나 다 고르면 저절로 확인
   items: {q, a:수, unit, post, why:{값:"까닭"}} | {q, set:[수…], ordered, unit, why:{넣은 틀린 수:"까닭"}} | {q, o:[…], a:번호|[번호…], why:{번호:"까닭"}}  (fig: () => 요소)
   opt: ok, words, pre(): 아직 안 되면 안내 글(조작을 먼저 끝내야 할 때) */
function fm2Ask(body, api, items, opt = {}) {
  fm2Style();
  let auto = () => {};
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
        auto();
      } }, o)));
      R.row = row;
      box.append(h("div", { class: "jua" }, lead + it.q + (multi ? " (모두 고르세요)" : "")), row);
    } else {
      R.inp = fm2Input(it.q, !!it.set);
      box.append(h("span", { class: "jua" }, lead + it.q), R.inp, it.post ? h("span", { class: "jua" }, it.post) : null, it.unit ? h("span", {}, it.unit) : null);
      if (it.set) box.append(h("div", { class: "fm2tip" }, (it.ordered ? "작은 수부터 차례대로, 쉼표(,)로 나누어 써요." : "쉼표(,)로 나누어 써요.") + " 다 쓰면 Enter를 눌러요."));
      fm2Hook(R.inp, () => auto());
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
      const wrongOne = v.slice().sort((a, b) => a - b).find(x => !want.includes(x));
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
  /* 다 썼나요? 고르기는 정답 수만큼 골랐을 때, 수 여러 개는 칸을 떠났을 때(Enter), 수 하나는 썼을 때 */
  const full = R => R.it.o ? R.sel.size >= (Array.isArray(R.it.a) ? R.it.a.length : 1)
    : R.it.set ? (R.inp.value.trim() !== "" && document.activeElement !== R.inp) : R.inp.value.trim() !== "";
  const ready = () => {
    if (!rows.every(full)) return false;
    const m = opt.pre && opt.pre(); if (m) { api.hint(m); return false; }
    return true;
  };
  const run = () => {
    api.tryOnce();
    const res = rows.map(judge), given = res.map(r => r.given).join(" / ");
    const bad = res.find(r => !r.good);
    if (!bad) { api.done(given, opt.ok); return true; }
    api.fail(bad.msg || opt.bad || "빨간 칸을 다시 생각해 봐요.", given);
    return false;
  };
  auto = autoRun(ready, () => rows.map(R => R.it.o ? [...R.sel].sort((a, b) => a - b).join(".") : R.inp.value.trim()).join("§"), run, rows.some(R => !R.it.o) ? 900 : 260);
  body.append(...rows.map(R => R.box));
  return auto;
}
/* 조작을 마친 뒤 물음으로 이어 가기 (물음이 없으면 바로 api.done) */
function fm2Then(host, api, ask, ok, given) {
  if (!ask || !ask.length) return api.done(given, ok);
  api.hint("○ 좋아요! 이어서 아래 물음에 답해요.");
  const box = h("div", { class: "fm2after" }); host.append(box);
  fm2Ask(box, api, ask, { ok });
  setTimeout(() => { try { box.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) {} }, 60);
}

/* 그림: 쿠키 한 개 */
function fm2sCookie(x, y, s) {
  const g = svgEl("g");
  g.append(svgEl("circle", { cx: x, cy: y, r: s, fill: "#E2B26E", stroke: "#B07A3A", "stroke-width": Math.max(1.5, s * .12) }));
  [[-.38, -.3], [.3, -.38], [-.1, .32], [.42, .25]].forEach(([dx, dy]) => g.append(svgEl("circle", { cx: x + dx * s, cy: y + dy * s, r: s * .15, fill: "#5A3A22" })));
  return g;
}

/* ② 쿠키를 봉지에 똑같이 나누어 담기  opt: n, kmax, ask, ok  (끝나면 fm2Then이 api.done( 을 불러요) */
function fm2Share(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
  const n = opt.n, K = opt.kmax || n;
  let k = null, cnt = [];
  const res = {};
  const svg = makeSvg(900, 420);
  const left = () => n - cnt.reduce((s, x) => s + x, 0);
  const slot = i => { const sw = 860 / k; return { x: 20 + i * sw, w: sw }; };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 10, y: 10, width: 880, height: 110, rx: 16, fill: "#FFF8E8", stroke: "#EAD9B5", "stroke-width": 2 }));
    svg.append(txt(120, 36, `남은 쿠키: ${left()}개`, 20, { fill: FM2.pine }));
    for (let i = 0; i < left(); i++) svg.append(fm2sCookie(270 + i * 68, 72, 24));
    if (!k) { svg.append(txt(450, 270, "오른쪽에서 봉지 수를 골라요", 26, { fill: "#8A9A95" })); return; }
    for (let i = 0; i < k; i++) {
      const s = slot(i), cx = s.x + s.w / 2, vw = Math.min(96, s.w - 16);
      svg.append(svgEl("rect", { x: s.x + 4, y: 140, width: s.w - 8, height: 268, rx: 14, fill: "#fff", stroke: "#DCE4E0", "stroke-width": 2, style: "cursor:pointer" }));
      svg.append(svgEl("path", { d: `M${cx - vw * .42} 215 L${cx + vw * .42} 215 L${cx + vw * .48} 390 L${cx - vw * .48} 390 Z`, fill: "#F6E2C4", stroke: FM2.org, "stroke-width": 3 }));
      svg.append(svgEl("path", { d: `M${cx - vw * .42} 215 l${vw * .14} -14 l${vw * .14} 14 l${vw * .14} -14 l${vw * .14} 14 l${vw * .14} -14 l${vw * .14} 14`, fill: "none", stroke: FM2.org, "stroke-width": 2 }));
      const fl = Math.min(16, vw / 6);
      for (let j = 0; j < cnt[i]; j++) {
        const col = j % 3, row = Math.floor(j / 3);
        svg.append(fm2sCookie(cx + (col - 1) * fl * 2.15, 246 + row * fl * 2.5, fl));
      }
      svg.append(txt(cx, 172, `${cnt[i]}개`, 20, { fill: FM2.ink }));
    }
  };
  const say = h("div", { class: "fm2say" }, "봉지 수를 고른 다음, 봉지를 눌러 쿠키를 한 개씩 넣어요.");
  const pick = h("div", { class: "fm2btns" });
  const table = h("div", { class: "fm2chips" });
  const showTable = () => { table.innerHTML = ""; fm2Range(1, K).forEach(j => { if (res[j] != null) table.append(h("span", { class: "fm2chip" + (res[j] ? "" : " fm2no") }, `봉지 ${j}개 ${res[j] ? "○" : "×"}`)); }); };
  const choose = j => { k = j; cnt = Array(j).fill(0); [...pick.children].forEach((b, i) => b.classList.toggle("fm2sel", i + 1 === j)); draw(); say.textContent = `봉지 ${j}개에 쿠키 ${n}개를 남김없이 똑같이 넣어 보세요.`; };
  fm2Range(1, K).forEach(j => pick.append(h("button", { class: "ghost", onclick: () => choose(j) }, `${j}개`)));
  let finished = false;
  const finishK = ok => {
    res[k] = ok; showTable();
    if (!finished && fm2Range(1, K).every(j => res[j] != null)) {
      finished = true;
      const can = fm2Range(1, K).filter(j => res[j]);
      say.textContent = `쿠키 ${n}개는 봉지 ${fm2L(can)}개에 남김없이 똑같이 나누어 담을 수 있어요.`;
      fm2Then(body, api, opt.ask, opt.ok, `가능: ${fm2L(can)}`);
    }
  };
  const afterPut = () => {
    if (left() > 0) return;
    if (cnt.every(c => c === cnt[0])) { say.textContent = `○ 봉지 ${k}개에 ${cnt[0]}개씩 똑같이 담았어요. ${n} ÷ ${k} = ${n / k}`; finishK(true); }
    else say.textContent = "봉지마다 담긴 쿠키 수가 달라요. ‘다시 담기’로 다시 해 보거나, 똑같이 나눌 수 없다고 생각하면 ‘똑같이 나눌 수 없어요’를 눌러요.";
  };
  dragOn(svg, p => {
    if (!k || p.y < 140) return false;
    const i = Math.floor((p.x - 20) / (860 / k));
    if (i < 0 || i >= k) return false;
    if (left() === 0) { api.hint("쿠키를 모두 담았어요. 다시 하려면 ‘다시 담기’를 눌러요."); return false; }
    cnt[i]++; draw(); afterPut(); return false;
  }, () => {}, null);
  const deal = h("button", { class: "ghost", onclick: () => { if (!k) return api.hint("먼저 봉지 수를 골라요."); let i = cnt.indexOf(Math.min(...cnt)); while (left() > 0) { cnt[i]++; i = (i + 1) % k; } draw(); afterPut(); } }, "한 개씩 차례로 담기");
  const reset = h("button", { class: "ghost", onclick: () => { if (k) choose(k); } }, "다시 담기");
  const cant = h("button", { class: "ghost", onclick: () => {
    if (!k) return api.hint("먼저 봉지 수를 골라요.");
    api.tryOnce();
    if (n % k === 0) return api.fail(`봉지 ${k}개에는 ${n / k}개씩 똑같이 담을 수 있어요. 한 개씩 차례로 담아 봐요.`, `${k}개 ×`);
    if (left() > 0) return api.hint("먼저 쿠키를 모두 담아 보고 판단해요.");
    const q = Math.floor(n / k), r = n % k;
    say.textContent = `맞아요. ${q + 1}개씩 담으려면 봉지 ${k - r}개에 1개씩 부족하고, ${q}개씩 담으면 ${r}개가 남아요. 봉지 ${k}개에는 똑같이 나눌 수 없어요.`;
    finishK(false);
  } }, "똑같이 나눌 수 없어요");
  api.provide({ words: ["남김없이 똑같이", "나누어떨어져요"], answers: [`봉지 ${fm2L(fm2Divs(n).filter(d => d <= K))}개`] });
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("b", {}, "봉지 수 고르기"), pick, say, h("div", { class: "fm2btns" }, deal, reset, cant), h("b", {}, "알아낸 것"), table)));
}

/* ③ 나눗셈식 표: n ÷ 1, n ÷ 2, … 의 몫과 나머지  opt: n, ds, given:[d…], ask, ok  (끝나면 fm2Then이 api.done( 을 불러요) */
function fm2DivTable(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
  const n = opt.n, given = opt.given || [];
  let auto = () => {};
  const rows = opt.ds.map(d => {
    const R = { d, q: Math.floor(n / d), r: n % d };
    const row = h("div", { class: "fm2row" }, `${n} ÷ ${d} = `);
    if (given.includes(d)) row.append(`${R.q}${R.r ? ` … ${R.r}` : ""}`);
    else { R.qi = fm2Input(`${n} ÷ ${d}의 몫`); R.ri = fm2Input(`${n} ÷ ${d}의 나머지`); row.append(R.qi, " … ", R.ri); fm2Hook(R.qi, () => auto()); fm2Hook(R.ri, () => auto()); }
    R.row = row; return R;
  });
  const ins = rows.filter(R => R.qi);
  api.provide({ words: ["몫", "나머지", "나누어떨어져요"], answers: rows.map(R => `${n} ÷ ${R.d} = ${R.q}${R.r ? ` … ${R.r}` : " … 0"}`) });
  const run = () => {
    api.tryOnce(); let bad = null;
    ins.forEach(R => {
      const q = fm2Num(R.qi.value), r = fm2Num(R.ri.value);
      const gq = q === R.q, gr = r === R.r; fm2Paint(R.qi, gq); fm2Paint(R.ri, gr);
      if (!bad && !gq) bad = `${n} ÷ ${R.d}의 몫을 다시 구해 봐요. ${R.d} × □가 ${n}보다 크지 않으면서 가장 가깝게 되는 □를 찾아요.`;
      if (!bad && !gr) bad = `나머지는 ${n} − ${R.d} × ${fm2J(R.q, "으로")} 구해요. 나머지가 없으면 0을 써요.`;
    });
    const gv = ins.map(R => `${R.qi.value || "-"}…${R.ri.value || "-"}`).join(" / ");
    if (bad) { api.fail(bad, gv); return false; }
    ins.forEach(R => { R.qi.readOnly = R.ri.readOnly = true; });
    rows.forEach(R => { if (!R.r) R.row.append(h("span", { class: "fm2chip" }, "나누어떨어져요")); });
    fm2Then(body, api, opt.ask, opt.ok, gv);
    return true;
  };
  auto = autoRun(() => ins.every(R => R.qi.value.trim() !== "" && R.ri.value.trim() !== ""), () => ins.map(R => R.qi.value + "," + R.ri.value).join("§"), run, 900);
  body.append(h("div", { class: "fm2dt" }, ...rows.map(R => R.row)), h("p", { class: "inst", style: "font-size:var(--fs-s)" }, "나머지가 없으면 나머지 칸에 0을 써요. 모두 쓰면 저절로 확인해요."));
}

/* ④ 늘어놓기: 한 줄에 똑같은 수씩 줄 세우기 — 모든 줄이 꽉 차면 저절로 기록  opt: n, item, unit("개"), line, start, color, tip, ask, ok
   (모두 찾으면 fm2Then이 api.done( 을 불러요) */
function fm2Rect(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
  const n = opt.n, item = opt.item || "바둑돌", unit = opt.unit || "개", line = opt.line || "줄";
  const want = fm2Divs(n);
  let w = opt.start || Math.min(n, 4), finished = false;
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
  const chips = h("div", { class: "fm2chips" });
  const cntTxt = h("div", { class: "jua" });
  const showFound = () => { chips.innerHTML = ""; [...found].sort((a, b) => a - b).forEach(v => chips.append(h("span", { class: "fm2chip" }, `${v}${unit}씩 ${n / v}${line}`))); cntTxt.textContent = `찾은 방법 ${found.size}가지`; };
  const rec = () => {
    if (finished) return true;
    api.tryOnce();
    found.add(w); showFound();
    if (found.size === want.length) {
      finished = true;
      api.hint(`○ ${item} ${n}${fm2J(unit, "을를")} 늘어놓는 방법을 모두 찾았어요.`);
      fm2Then(body, api, opt.ask, opt.ok, [...found].sort((a, b) => a - b).join(", "));
    } else api.hint(`○ 한 ${line}에 ${w}${unit}씩 ${n / w}${line}! 기록했어요. 다른 방법도 찾아봐요.`);
    return false;
  };
  const auto = autoRun(() => !finished && n % w === 0 && !found.has(w), () => String(w), rec, 1200);
  const inp = h("input", { type: "number", min: 1, max: n, value: w, class: "fm2in", "aria-label": `한 ${line}에 놓을 수` });
  const setW = v => { w = Math.max(1, Math.min(n, v | 0)); inp.value = w; draw(); auto(); };
  inp.addEventListener("input", () => { const v = fm2Num(inp.value); if (v) setW(v); });
  api.provide({ words: ["나누어떨어져요", "곱셈식"], answers: [want.map(v => `${v}${unit}씩 ${n / v}${line}`).join(", ")] });
  draw(); showFound();
  body.append(stageWrap(svg, h("div", { class: "side" },
    h("p", {}, opt.tip || `${item} ${n}${fm2J(unit, "을를")} 한 ${line}에 똑같은 수씩 늘어놓아요. 모든 ${line}이 똑같이 꽉 차면 저절로 기록돼요.`),
    h("div", { class: "fm2row" }, `한 ${line}에`, h("button", { class: "ghost", onclick: () => setW(w - 1) }, "−"), inp, h("button", { class: "ghost", onclick: () => setW(w + 1) }, "+"), `${unit}씩`),
    cntTxt, chips)));
}

/* ⑤ 수 줄 여러 개: 줄마다 알맞은 수에 ○표(찾기) → 두 줄에 모두 있는 수를 이어요 — 다 하면 저절로 확인
   opt: rows:[{label, nums, want, what, why(v), peek(v), miss, color}], mode:"link"(○표 없이 바로 잇기), common:true, ask, ok
   (끝나면 fm2Then이 api.done( 을 불러요) */
function fm2Rows(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
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
  const fs = Math.min(24, cw * .5);
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
  const setSay = () => { say.textContent = phase === 0 ? (opt.say0 || "줄마다 알맞은 수를 눌러 ○표 해요. 다시 누르면 지워져요. 다 표시하면 저절로 확인해요.") : (opt.say1 || "두 줄에 모두 들어 있는 수를 눌러 같은 수끼리 이어요."); };
  let auto = () => {};
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
      draw(); auto();
    });
    return false;
  }, () => {}, null);
  const ready = () => phase === 0 ? rows.every(r => r.marks.size >= r.want.length) : phase === 1 ? com.size >= target().length : false;
  const sign = () => phase + "|" + rows.map(r => [...r.marks].sort((a, b) => a - b).join(",")).join("/") + "|" + [...com].sort((a, b) => a - b).join(",");
  const run = () => {
    api.tryOnce();
    if (phase === 0) {
      for (const r of rows) {
        const got = [...r.marks];
        const extra = got.filter(v => !r.want.includes(v)).sort((a, b) => a - b), miss = r.want.filter(v => !r.marks.has(v));
        if (extra.length) { api.fail(r.why ? r.why(extra[0]) : `${fm2J(extra[0], "은는")} ${fm2J(r.what, "이가")} 아니에요.`, got.join(",")); return false; }
        if (miss.length) { api.fail(`${r.label} 줄에서 ${fm2J(r.what, "을를")} 더 찾아봐요. ${r.miss || ""}`, got.join(",")); return false; }
      }
      if (!opt.common) { phase = 2; fm2Then(body, api, opt.ask, opt.ok, rows.map(r => r.want.join(",")).join(" / ")); return true; }
      phase = 1; setSay(); draw(); api.hint("○ ○표를 모두 알맞게 했어요. 이제 두 줄에 모두 ○표 한 수를 눌러 이어요."); return false;
    }
    const t = target(), got = [...com];
    const extra = got.filter(v => !t.includes(v));
    if (extra.length) { api.fail(`${fm2J(extra[0], "은는")} ${opt.notBoth || "두 줄에 모두 ○표 한 수가 아니에요."}`, got.join(",")); return false; }
    phase = 2;
    say.textContent = (opt.found || "두 줄에 모두 있는 수: ") + fm2L(t.slice().sort((a, b) => a - b));
    fm2Then(body, api, opt.ask, opt.ok, "공통: " + fm2L(t));
    return true;
  };
  auto = autoRun(ready, sign, run, 1200);
  const reset = h("button", { class: "ghost", onclick: () => { if (phase === 0) rows.forEach(r => r.marks.clear()); else if (phase === 1) com.clear(); draw(); } }, "지우기");
  api.provide({ words: opt.words || [], answers: rows.filter(r => r.want).map(r => `${r.label}: ${fm2L(r.want)}`).concat(opt.common ? [`공통: ${fm2L(target())}`] : []) });
  setSay(); draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, say, peek, h("div", { class: "fm2btns" }, reset))));
}

/* ⑥ 수 배열판: ○표·색칠·△표 — 다 표시하면 저절로 확인  opt: nums, cols, layers:[{name, want, shape:"circle"|"fill"|"tri", color, why(v), miss}], ask, ok
   (끝나면 fm2Then이 api.done( 을 불러요) */
function fm2Board(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
  const nums = opt.nums, cols = opt.cols || 10, CW = opt.cell || 72, R = Math.ceil(nums.length / cols);
  const layers = opt.layers.map((L, i) => Object.assign({ marks: new Set(), color: [FM2.org, FM2.blue, FM2.purple][i], shape: "circle" }, L));
  let cur = 0, auto = () => {}, over = false;
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
    if (over) return false;
    const c = Math.floor((p.x - 10) / CW), r = Math.floor((p.y - 10) / CW), k = r * cols + c;
    if (c < 0 || c >= cols || r < 0 || k >= nums.length) return false;
    const L = layers[cur], v = nums[k]; L.marks.has(v) ? L.marks.delete(v) : L.marks.add(v); draw(); auto(); return false;
  }, () => {}, null);
  const run = () => {
    api.tryOnce();
    for (const L of layers) {
      const got = [...L.marks].sort((a, b) => a - b), extra = got.filter(v => !L.want.includes(v)), miss = L.want.filter(v => !L.marks.has(v));
      if (extra.length) { api.fail(`${fm2J(extra[0], "은는")} ${fm2J(L.name, "이가")} 아니에요.${L.why ? " " + L.why(extra[0]) : ""}`, got.join(",")); return false; }
      if (miss.length) { api.fail(`${fm2J(L.name, "을를")} 더 찾아봐요. ${L.miss || ""}`, got.join(",")); return false; }
    }
    over = true;
    fm2Then(body, api, opt.ask, opt.ok, layers.map(L => `${L.name}: ${fm2L(L.want)}`).join(" / "));
    return true;
  };
  auto = autoRun(() => layers.every(L => L.marks.size >= L.want.length), () => layers.map(L => [...L.marks].sort((a, b) => a - b).join(",")).join("/"), run, 1200);
  api.provide({ words: opt.words || [], answers: layers.map(L => `${L.name}: ${fm2L(L.want)}`) });
  syncTools(); draw();
  const side = h("div", { class: "side" }, h("p", {}, opt.tip || (layers.length > 1 ? "표시할 것을 고른 다음 수를 눌러요. 다시 누르면 지워져요. 다 표시하면 저절로 확인해요." : "알맞은 수를 눌러 표시해요. 다시 누르면 지워져요. 다 표시하면 저절로 확인해요.")), tools, h("div", { class: "fm2btns" }, h("button", { class: "ghost", onclick: () => { if (over) return; layers.forEach(L => L.marks.clear()); draw(); } }, "지우기")));
  body.append(nums.length > 12 ? stageWrap(svg, side) : h("div", {}, h("div", { class: "stage", style: "max-width:720px" }, svg), side));
}

/* ⑦ 수직선 뛰어 세기: 뛰어 도착하는 곳을 눌러요  opt: max, hops:[{n, count, name, color, tag(k)}], lab, snap, zero, ask, ok
   (다 뛰면 fm2Then이 api.done( 을 불러요) */
function fm2Hop(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
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
    if (opt.zero) svg.append(txt(X(0) + 4, LY + 52, opt.zero, 15, { fill: FM2.pine }));
    hops.forEach((t, i) => {
      const up = i === 0, hgt = Math.min(85, 20 + t.n / max * 820 * .45);
      for (let k = 0; k < t.done; k++) {
        const a = X(k * t.n), b = X((k + 1) * t.n), m = (a + b) / 2;
        svg.append(svgEl("path", { d: `M${a} ${LY} Q${m} ${up ? LY - hgt * 2 : LY + hgt * 2} ${b} ${LY}`, fill: "none", stroke: t.color, "stroke-width": 3 }));
        svg.append(svgEl("circle", { cx: b, cy: LY, r: 7, fill: t.color }));
        if (t.tag) svg.append(txt(m, up ? LY - hgt - 8 : LY + hgt + 10, t.tag(k + 1), 15, { fill: t.color }));
        svg.append(txt(b, up ? LY - 22 : LY + (two ? 58 : 48), String((k + 1) * t.n), 17, { fill: t.color }));
      }
      svg.append(txt(two ? 110 : 120, up ? 24 : H - 18, `${t.name}: ${t.n}씩`, 18, { fill: t.color }));
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
   opt: pairs:[[a,b],…], goal:"gcd"|"lcm", ask, ok  (끝나면 fm2Then이 api.done( 을 불러요) */
function fm2Tree(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
  const goal = opt.goal, G = goal === "gcd" ? "최대공약수" : "최소공배수";
  let pi = 0, T, phase, sel, pr, H = 400, pairAuto = () => {};
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
    const need = fm2Meet(vals(0), vals(1)).length;
    say.textContent = "두 식에 공통으로 들어 있는 수를 찾아요. 왼쪽 수와 오른쪽 수 중 같은 수를 하나씩 눌러 짝 지어요. 짝을 지은 수를 다시 누르면 풀려요. 짝을 모두 지으면 저절로 넘어가요.";
    pairAuto = autoRun(() => phase === 1 && leaves(T[0]).filter(n => n.pair != null).length >= need, () => String(pr), () => { api.tryOnce(); toAnswer(); return true; }, 1200);
    draw();
  };
  const toAnswer = () => {
    phase = 2; choices.innerHTML = "";
    const [a, b] = opt.pairs[pi], A = vals(0), B = vals(1), C = fm2Meet(A, B), rest = [...fm2Minus(A, C), ...fm2Minus(B, C)];
    const g = fm2Gcd(a, b), l = fm2Lcm(a, b), want = goal === "gcd" ? g : l;
    const inp = fm2Input(G);
    say.textContent = `공통으로 들어 있는 수: ${fm2L(C)}` + (goal === "lcm" ? ` · 공통이 아닌 남은 수: ${fm2L(rest)}` : "");
    const tip = goal === "gcd" ? "공통으로 들어 있는 수를 모두 곱해요." : "공통으로 들어 있는 수는 한 번만 곱하고, 공통이 아닌 남은 수를 곱해요.";
    const run = () => {
      api.tryOnce();
      const v = fm2Num(inp.value);
      if (v !== want) {
        fm2Paint(inp, false);
        let m = tip;
        if (goal === "gcd" && v === l) m = `${v}${fm2J(v, "은는").slice(String(v).length)} 최소공배수예요. ${G}는 공통으로 들어 있는 수만 곱해요.`;
        if (goal === "lcm" && v === a * b && a * b !== l) m = `${a} × ${fm2J(b, "을를")} 그대로 곱했어요. 공통으로 들어 있는 수(${fm2L(C)})를 두 번 곱한 셈이에요. 공통인 수는 한 번만 곱해요.`;
        if (goal === "lcm" && v === g) m = `${v}${fm2J(v, "은는").slice(String(v).length)} 최대공약수예요. 공통이 아닌 남은 수도 곱해요.`;
        api.fail(m, String(inp.value)); return false;
      }
      fm2Paint(inp, true); inp.readOnly = true;
      const f = goal === "gcd" ? (C.length > 1 ? `${fm2X(C)} = ${g}` : `${g}`) : `${fm2X([...C, ...rest])} = ${l}`;
      ansBox.append(h("p", { class: "jua", style: "color:var(--pine)" }, `${fm2J(a, "과와")} ${b}의 ${G}: ${f}`));
      if (pi < opt.pairs.length - 1) {
        api.hint("○ 맞았어요! 다음 두 수도 구해 봐요.");
        ansBox.append(h("button", { class: "big", onclick: () => { pi++; start(); } }, "이어서 두 수로"));
      } else fm2Then(body, api, opt.ask, opt.ok, opt.pairs.map(([x, y]) => `${x},${y}→${goal === "gcd" ? fm2Gcd(x, y) : fm2Lcm(x, y)}`).join(" / "));
      return true;
    };
    const auto = autoRun(() => inp.value.trim() !== "", () => inp.value.trim(), run, 900);
    fm2Hook(inp, auto);
    ansBox.innerHTML = "";
    ansBox.append(h("p", {}, tip), h("div", { class: "fm2row" }, h("span", { class: "jua" }, `${fm2J(a, "과와")} ${b}의 ${G} =`), inp));
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
      if (n.pair != null) { const id = n.pair; T.forEach(t => leaves(t).forEach(x => { if (x.pair === id) x.pair = null; })); sel = null; draw(); pr++; pairAuto(); return false; }
      if (!sel || sel.s === hit.s) { sel = hit; draw(); return false; }
      if (sel.node.v !== n.v) { api.hint("같은 수끼리 짝 지어요."); sel = hit; draw(); return false; }
      n.pair = sel.node.pair = ++pr; sel = null; draw(); pairAuto();
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
/* ⑨ 공약수로 나누기 — 공약수와 두 몫을 다 쓰면 저절로 나누어요  opt: pairs:[[a,b],…], goal:"gcd"|"lcm"|"both", ask, ok
   (끝나면 fm2Then이 api.done( 을 불러요) */
function fm2Ladder(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
  const goal = opt.goal;
  let pi = 0, rows, cur;
  const fig = h("div", { class: "stage", style: "max-width:520px" });
  const say = h("div", { class: "fm2say" }), work = h("div"), ansBox = h("div");
  const draw = hl => { fig.innerHTML = ""; fig.append(fm2LadderSvg(rows, cur, hl)); };
  const names = { gcd: ["최대공약수"], lcm: ["최소공배수"], both: ["최대공약수", "최소공배수"] }[goal];
  const start = () => {
    const [a, b] = opt.pairs[pi]; rows = []; cur = [a, b]; ansBox.innerHTML = "";
    say.textContent = `${fm2J(a, "과와")} ${b}의 ${names.join("와 ")}를 구해요. 두 수를 모두 나누어떨어지게 하는 1보다 큰 수(공약수)를 쓰고, 두 몫을 써요. 다 쓰면 저절로 나누어요.`;
    draw(); row();
  };
  const row = () => {
    work.innerHTML = "";
    const dI = fm2Input("나누는 공약수"), q1 = fm2Input(`${cur[0]}의 몫`), q2 = fm2Input(`${cur[1]}의 몫`);
    const run = () => {
      api.tryOnce();
      const d = fm2Num(dI.value), [a, b] = cur;
      if (!d) { api.fail("나눌 공약수를 써요.", "-"); return false; }
      if (d === 1) { api.fail("1로 나누면 몫이 처음 수와 똑같아서 아무것도 달라지지 않아요. 1보다 큰 공약수로 나누어요.", "1"); return false; }
      if (a % d || b % d) { api.fail(`${fm2J(d, "은는")} ${fm2J(a, "과와")} ${b}의 공약수가 아니에요. ${a % d ? a : b} ÷ ${fm2J(d, "은는")} 나누어떨어지지 않아요.`, String(d)); return false; }
      const g1 = fm2Num(q1.value) === a / d, g2 = fm2Num(q2.value) === b / d;
      fm2Paint(q1, g1); fm2Paint(q2, g2);
      if (!g1 || !g2) { api.fail(`몫을 다시 계산해 봐요. ${!g1 ? a : b} ÷ ${d} = □`, `${q1.value},${q2.value}`); return false; }
      rows.push({ d, a, b }); cur = [a / d, b / d]; draw(); row();
      api.hint(`○ ${fm2J(d, "으로")} 나누었어요. ${fm2J(cur[0], "과와")} ${fm2J(cur[1], "을를")} 또 나눌 수 있는지 살펴봐요. 더 나눌 수 없으면 ‘더 이상 나눌 수 없어요’를 눌러요.`);
      return true;
    };
    const auto = autoRun(() => [dI, q1, q2].every(x => x.value.trim() !== ""), () => [dI, q1, q2].map(x => x.value.trim()).join(","), run, 900);
    [dI, q1, q2].forEach(x => fm2Hook(x, auto));
    const stop = h("button", { class: "ghost", onclick: () => {
      api.tryOnce();
      const g = fm2Gcd(cur[0], cur[1]);
      if (!rows.length) return api.fail(`${fm2J(cur[0], "과와")} ${fm2J(cur[1], "은는")} ${fm2J(g, "으로")} 함께 나눌 수 있어요. 먼저 공약수로 나누어요.`, "멈춤");
      if (g > 1) return api.fail(`${fm2J(cur[0], "과와")} ${fm2J(cur[1], "은는")} 아직 ${fm2J(g, "으로")} 함께 나눌 수 있어요. 더 이상 나눌 수 없을 때까지 나누어요.`, "멈춤");
      toAnswer();
    } }, "더 이상 나눌 수 없어요");
    work.append(h("div", { class: "fm2row" }, h("span", { class: "jua" }, "공약수"), dI, h("span", { class: "jua" }, `) ${cur[0]}  ${cur[1]}  →  몫`), q1, q2), h("div", { class: "fm2btns", style: "margin-top:.4em" }, stop));
  };
  const toAnswer = () => {
    work.innerHTML = "";
    const [a, b] = opt.pairs[pi], D = rows.map(r => r.d), g = fm2Gcd(a, b), l = fm2Lcm(a, b);
    say.textContent = `더 이상 나눌 수 없어요. 왼쪽에 나눈 공약수: ${fm2L(D)} · 마지막 몫: ${fm2L(cur)}`;
    const ins = names.map(nm => ({ nm, inp: fm2Input(nm), want: nm === "최대공약수" ? g : l }));
    const run = () => {
      api.tryOnce();
      for (const x of ins) {
        const v = fm2Num(x.inp.value), ok = v === x.want; fm2Paint(x.inp, ok);
        if (ok) continue;
        let m = x.nm === "최대공약수" ? "왼쪽에 나눈 공약수를 모두 곱해요." : "왼쪽에 나눈 공약수와 마지막 몫을 모두 곱해요(ㄴ자 모양).";
        if (x.nm === "최대공약수" && v === l) m = "그 수는 최소공배수예요. 최대공약수는 왼쪽에 나눈 공약수만 곱해요.";
        if (x.nm === "최소공배수" && v === g) m = "그 수는 최대공약수예요. 최소공배수는 마지막 몫까지 모두 곱해요.";
        if (x.nm === "최소공배수" && v === a * b && a * b !== l) m = `${a} × ${fm2J(b, "은는")} 공배수이지만 가장 작은 공배수가 아니에요. 나눈 공약수와 마지막 몫을 곱해요.`;
        api.fail(m, ins.map(y => y.inp.value).join(",")); return false;
      }
      ins.forEach(x => { x.inp.readOnly = true; }); draw(goal);
      const lines = ins.map(x => x.nm === "최대공약수" ? `최대공약수: ${D.length > 1 ? fm2X(D) + " = " : ""}${g}` : `최소공배수: ${fm2X([...D, ...cur])} = ${l}`);
      ansBox.append(h("p", { class: "jua", style: "color:var(--pine)" }, `${fm2J(a, "과와")} ${b} → ${lines.join(" · ")}`));
      if (pi < opt.pairs.length - 1) { api.hint("○ 맞았어요! 다음 두 수도 구해 봐요."); ansBox.append(h("button", { class: "big", onclick: () => { pi++; start(); } }, "이어서 두 수로")); }
      else fm2Then(body, api, opt.ask, opt.ok, opt.pairs.map(([x, y]) => `${x},${y}`).join(" / "));
      return true;
    };
    const auto = autoRun(() => ins.every(x => x.inp.value.trim() !== ""), () => ins.map(x => x.inp.value.trim()).join(","), run, 900);
    ins.forEach(x => fm2Hook(x.inp, auto));
    work.append(...ins.map(x => h("div", { class: "fm2row" }, h("span", { class: "jua" }, `${x.nm} =`), x.inp)));
  };
  api.provide({ words: ["공약수", "몫", ...names], answers: opt.pairs.map(([a, b]) => `${fm2J(a, "과와")} ${b}: ${names.map(nm => `${nm} ${nm === "최대공약수" ? fm2Gcd(a, b) : fm2Lcm(a, b)}`).join(", ")}`) });
  start();
  body.append(h("div", { class: "panel" }, fig, h("div", { class: "side" }, say, work, ansBox)));
}

/* ⑩ 직사각형을 크기가 같은 가장 큰 정사각형으로 나누기  opt: w, h(cm), what, ask, ok  (아래 물음은 fm2Ask가 api.done( 을 불러요) */
function fm2Square(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
  const W = opt.w, Hh = opt.h, U = 44, x0 = 50, y0 = 30;
  let s = null; const tried = new Set();
  const svg = makeSvg(W * U + 100, Hh * U + 110);
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: x0, y: y0, width: W * U, height: Hh * U, fill: "#FFE3B8" }));
    for (let i = 0; i < 6; i++) svg.append(svgEl("circle", { cx: x0 + W * U * (.12 + i * .155), cy: y0 + Hh * U * (i % 2 ? .3 : .7), r: U * .55, fill: ["#F3B6C8", "#BFDDF5", "#CDE8C4"][i % 3] }));
    if (s) {
      const nx = Math.floor(W / s), ny = Math.floor(Hh / s);
      for (let i = 0; i <= nx; i++) svg.append(svgEl("line", { x1: x0 + i * s * U, y1: y0, x2: x0 + i * s * U, y2: y0 + ny * s * U, stroke: "#fff", "stroke-width": 3 }));
      for (let j = 0; j <= ny; j++) svg.append(svgEl("line", { x1: x0, y1: y0 + j * s * U, x2: x0 + nx * s * U, y2: y0 + j * s * U, stroke: "#fff", "stroke-width": 3 }));
      if (W % s) svg.append(svgEl("rect", { x: x0 + nx * s * U, y: y0, width: (W % s) * U, height: Hh * U, fill: "rgba(217,83,79,.45)" }));
      if (Hh % s) svg.append(svgEl("rect", { x: x0, y: y0 + ny * s * U, width: nx * s * U, height: (Hh % s) * U, fill: "rgba(217,83,79,.45)" }));
    }
    svg.append(svgEl("rect", { x: x0, y: y0, width: W * U, height: Hh * U, fill: "none", stroke: FM2.ink, "stroke-width": 3 }));
    svg.append(txt(x0 + W * U / 2, y0 + Hh * U + 26, `${W} cm`, 22), txt(x0 - 26, y0 + Hh * U / 2, `${Hh} cm`, 20, { transform: `rotate(-90 ${x0 - 26} ${y0 + Hh * U / 2})` }));
    svg.append(txt(x0 + W * U / 2, y0 + Hh * U + 64, !s ? "오른쪽에서 정사각형의 한 변의 길이를 골라요" : (W % s || Hh % s) ? `한 변 ${s} cm: 빨간 부분이 남아요` : `한 변 ${s} cm: 가로 ${W / s}개, 세로 ${Hh / s}개 → ${W / s * Hh / s}장, 남는 부분이 없어요`, 22, { fill: s && !(W % s || Hh % s) ? FM2.pine : s ? FM2.red : "#8A9A95" }));
  };
  const btns = h("div", { class: "fm2btns" });
  fm2Range(1, Math.min(W, Hh)).forEach(v => btns.append(h("button", { class: "ghost", onclick: e => { s = v; tried.add(v); [...btns.children].forEach(b => b.classList.remove("fm2sel")); e.currentTarget.classList.add("fm2sel"); draw(); if (askAuto) askAuto(); } }, `${v} cm`)));
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "정사각형 한 변의 길이를 골라 나누어 보세요. 남는 부분이 없어야 해요."), btns)));
  const box = h("div", { class: "fm2after" }); body.append(box);
  const askAuto = fm2Ask(box, api, opt.ask, { ok: opt.ok, pre: () => tried.size >= 3 ? null : "여러 길이로 나누어 본 다음 답해요. 한 변의 길이 단추를 3개 이상 눌러 봐요." });
}

/* ⑪ 장식 띠를 한 가지 조각으로 채우기  opt: strips:[8,12], pieces:[{k:"㉠", n}], ask, ok  (아래 물음은 fm2Ask가 api.done( 을 불러요) */
function fm2Strip(body, api, opt) {
  fm2Style();
  /* 한 계단 여러 활동(hj-multi)이 이 부품을 셀 수 있게: 끝나면 fm2Then·fm2Ask가 api.done( 을 불러요 */
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
        svg.append(txt(LX + L * C, y + 82, r ? `${p.k} ${m}개를 놓으면 ${r}칸이 남아 채울 수 없어요` : `${p.k} ${m}개로 꼭 맞게 채워요`, 18, { "text-anchor": "end", fill: r ? FM2.red : FM2.pine }));
      }
    });
  };
  const btns = h("div", { class: "fm2btns" });
  opt.pieces.forEach((p, i) => btns.append(h("button", { class: "ghost", onclick: e => { cur = { i }; tried.add(i); [...btns.children].forEach(b => b.classList.remove("fm2sel")); e.currentTarget.classList.add("fm2sel"); draw(); if (askAuto) askAuto(); } }, `${p.k} ${p.n}칸`)));
  draw();
  body.append(h("div", { class: "stage" }, svg), h("div", { class: "side", style: "margin-top:.6em" }, h("p", {}, "조각을 하나 골라 두 장식 띠를 그 조각으로만 채워 보세요."), btns));
  const box = h("div", { class: "fm2after" }); body.append(box);
  const askAuto = fm2Ask(box, api, opt.ask, { ok: opt.ok, pre: () => tried.size >= opt.pieces.length ? null : `조각 ${opt.pieces.length}가지를 모두 놓아 본 다음 답해요. (지금 ${tried.size}가지)` });
}

/* ⑫ 상황 카드 나누기 — 카드를 모두 옮기면 저절로 확인  opt: bins:[이름…], cards:[{t, b, why}], ok */
function fm2Sort(body, api, opt) {
  fm2Style();
  const place = opt.cards.map(() => null);
  let pick = null, over = false, auto = () => {};
  const pool = h("div", { class: "fm2cards" });
  const bins = opt.bins.map((nm, bi) => h("div", { class: "fm2bin", onclick: () => { if (over) return; if (pick == null) return api.hint("먼저 카드를 눌러 골라요."); place[pick] = bi; pick = null; draw(); auto(); } }, h("b", {}, nm)));
  const card = i => h("button", { class: "opt fm2card" + (pick === i ? " fm2sel" : ""), onclick: e => { e.stopPropagation(); if (over) return; if (place[i] != null && pick !== i) { place[i] = null; pick = null; } else pick = pick === i ? null : i; draw(); } }, opt.cards[i].t);
  const draw = () => {
    pool.innerHTML = ""; bins.forEach(b => { while (b.children.length > 1) b.lastChild.remove(); });
    opt.cards.forEach((c, i) => (place[i] == null ? pool : bins[place[i]]).append(card(i)));
    if (!pool.children.length) pool.append(h("span", { class: "inst" }, "카드를 모두 옮겼어요."));
  };
  api.provide({ words: opt.bins, answers: opt.bins.map((nm, bi) => `${nm}: ${opt.cards.filter(c => c.b === bi).map(c => c.t).join(" / ")}`) });
  auto = autoRun(() => place.every(p => p != null), () => place.join(","), () => {
    api.tryOnce();
    const wrong = opt.cards.findIndex((c, i) => place[i] !== c.b);
    if (wrong >= 0) { api.fail(opt.cards[wrong].why || `‘${opt.cards[wrong].t}’를 다시 생각해 봐요.`, place.join(",")); return false; }
    over = true; api.done(place.join(","), opt.ok); return true;
  }, 1200);
  draw();
  body.append(h("p", { class: "inst", style: "font-size:var(--fs-s)" }, "카드를 누른 다음 알맞은 상자를 눌러요. 상자 안의 카드를 누르면 다시 위로 돌아와요. 모두 옮기면 저절로 확인해요."), pool, h("div", { class: "fm2bins" }, ...bins));
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
    kb.innerHTML = ""; ["약수!", "배수!"].forEach(k => kb.append(h("button", { class: "ghost", onclick: () => { if (last == null) return api.hint(`첫 번째 차례에는 ${FIRST}보다 작은 수 중 하나를 고르기만 해요.`); setKind(k.slice(0, 2)); } }, k)));
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
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, "나는 파란 ×, 컴퓨터는 주황 ×예요. 앞 사람이 고른 수의 약수나 배수 중 아직 ×표 하지 않은 수를 골라요. ×표 할 수 있는 수가 없는 사람이 져요(이 앱의 규칙)."), status, kb, h("b", {}, "놀이 기록"), logBox, h("button", { class: "ghost", onclick: newGame }, "새 놀이"))));
}

/* ===== 이야기 버전 그림 (앞글자 fm2s) ===== */
/* 준비단 쪽지 */
function fm2sNote(title, lines) {
  fm2Style();
  return h("div", { class: "fm2snote" }, h("b", {}, title), h("ul", {}, ...lines.map(t => h("li", {}, t))));
}
/* 그림: 13년 매미와 17년 매미 (과학 책에서 본 이야기) */
function fm2sCicadaFig() {
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
function fm2sLadderFig(rows, last) { return () => h("div", { class: "fm2fig", style: "max-width:360px" }, fm2LadderSvg(rows, last)); }
//@@LESSONS
const UNIT_STORY = { title: "우리 반 학급 장터 준비단", lines: [
  "해든초등학교 5학년 2반은 학기 말에 ‘학급 장터’를 열기로 했어요. 반장 서진이와 민호, 예린, 태오, 하윤이가 장터 준비단이 되어 일을 나누어 맡았어요.",
  "쿠키와 사탕을 봉지에 남김없이 똑같이 나누어 담을 때는 약수와 최대공약수를, 날마다 붙이는 포스터나 몇 분마다 되풀이되는 이벤트 시간을 정할 때는 배수와 최소공배수를 써요.",
  "의자와 진열대를 배치하고, 장터 놀이 부스에서 ‘약수와 배수 이어달리기’를 운영한 뒤, 장터 날 배운 것을 발표해요."],
  one: "우리 반 학급 장터 준비단 · 똑같이 나누는 약수와 최대공약수, 되풀이되는 배수와 최소공배수로 장터를 준비해요." };
const UNIT_KEYWORDS = ["약수", "배수", "나누어떨어지다", "1과 자기 자신", "곱셈식", "나눗셈식", "공약수", "최대공약수", "공배수", "최소공배수", "여러 수의 곱", "공통으로 들어 있는 수", "공약수로 나누기", "몫", "남김없이 똑같이"];

/* ===== 2. 약수와 배수 — 이야기 버전 (11차시) ===== */
const FM2_D = n => fm2Divs(n);
const FM2_STRIP = [{ k: "㉠", n: 1 }, { k: "㉡", n: 2 }, { k: "㉢", n: 3 }, { k: "㉣", n: 4 }, { k: "㉤", n: 5 }, { k: "㉥", n: 6 }];
const LESSONS = [
{
  id: "s1", no: 1, title: "학급 장터 준비단이 모였어요", soop: "개념 찾기(S)",
  question: "학급 장터를 준비할 때 약수와 배수는 언제 쓰일까요?",
  summary: "어떤 수만큼의 물건을 남김없이 똑같이 나누는 상황에서는 약수를, 어떤 수의 몇 배만큼 늘어나거나 몇 분마다 되풀이되는 상황에서는 배수를 써요. 이 단원에서는 곱셈식과 나눗셈식으로 약수와 배수를 찾고, 공약수·최대공약수, 공배수·최소공배수를 배워요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "학기 말에 우리 반 ‘학급 장터’가 열려요. 반장 서진이가 준비단 회의에 가져온 계획표를 보고, 세 칸에 써서 붙여요.", hints: ["계획표에서 수가 나오는 곳을 찾아봐요.", "똑같이 나누는 일과, 몇 장씩 또는 몇 분마다 되풀이되는 일을 찾아봐요."],
      render: (b, a) => { b.append(fm2sNote("📋 학급 장터 준비 계획표", ["쿠키 24개를 봉지 몇 개에 남김없이 똑같이 나누어 담기", "사탕 18개와 젤리 12개로 똑같은 선물 꾸러미 만들기", "홍보 포스터를 날마다 4장씩 붙이기", "장터 날 풍선 이벤트는 4분마다, 뽑기 이벤트는 6분마다 시작하기", "놀이 부스: 약수와 배수 이어달리기"]));
        panes(b, a, [
          { t: "보여요", e: "👀", ph: "계획표에 ~이 보여요", hint: "계획표에서 보이는 것", ex: ["쿠키 24개를 봉지에 똑같이 나누어 담는다고 쓰여 있어요.", "풍선 이벤트는 4분마다, 뽑기 이벤트는 6분마다 시작한다고 쓰여 있어요."] },
          { t: "생각해요", e: "💭", ph: "~하려면 ~을 알아야 할 것 같아요", hint: "준비하려면 무엇을 알아야 할까요?", ex: ["쿠키를 똑같이 나누려면 24를 나누어떨어지게 하는 수를 알아야 할 것 같아요.", "포스터는 날마다 4장씩 늘어나니까 4, 8, 12, …처럼 셀 것 같아요."] },
          { t: "궁금해요", e: "❓", ph: "~은 어떻게 구할까?", hint: "준비하면서 궁금한 것", ex: ["사탕과 젤리를 둘 다 똑같이 나누려면 꾸러미를 몇 개 만들어야 할까?", "두 이벤트가 다시 동시에 시작하는 때는 몇 분 후일까?"] }],
          { ok: "준비할 일 속에 수가 가득해요! 이 단원에서 하나씩 해결 방법을 찾아봐요." }); } },
    { name: "그려 보기 — 나누는 일, 되풀이되는 일", inst: "준비단이 맡을 일을 ‘남김없이 똑같이 나누는 일’과 ‘몇 배씩 늘어나거나 되풀이되는 일’로 나누어 보세요.", hints: ["어떤 수만큼의 물건을 똑같이 나누면 ‘나누는 일’이에요.", "4장, 8장, 12장, …이나 4분, 8분, 12분, …처럼 같은 수씩 늘어나면 ‘되풀이되는 일’이에요."],
      render: thenWhy((b, a) => fm2Sort(b, a, { bins: ["남김없이 똑같이 나누는 일", "몇 배씩 늘어나거나 되풀이되는 일"], cards: [
        { t: "쿠키 24개를 봉지 몇 개에 똑같이 나누어 담기", b: 0 },
        { t: "색 도화지 한 장을 크기가 같은 가격표로 남김없이 자르기", b: 0 },
        { t: "사탕 18개를 친구들에게 똑같이 나누어 주기", b: 0 },
        { t: "홍보 포스터를 날마다 4장씩 붙이기", b: 1, why: "날마다 4장씩이면 1일, 2일, 3일, …에 따라 4의 1배, 2배, 3배, …만큼 붙여요." },
        { t: "풍선 이벤트를 4분마다 시작하기", b: 1, why: "4분, 8분, 12분, …은 4를 1배, 2배, 3배, … 한 수예요." },
        { t: "한 상자에 6개씩 든 주스를 3상자 사기", b: 1, why: "6개씩 3상자는 6의 3배만큼 세는 일이에요." }],
        ok: "똑같이 나누는 일에는 약수를, 몇 배씩 늘어나거나 되풀이되는 일에는 배수를 쓰게 돼요." }),
        { q: "‘쿠키를 봉지에 똑같이 나누는 일’과 ‘포스터를 날마다 4장씩 붙이는 일’은 무엇이 다를까요?", ph: "쿠키는 ~하고, 포스터는 ~해요", help: ["① 쿠키는 처음 수(24개)가 정해져 있는지 생각해요. → ② 포스터는 날이 지날수록 수가 어떻게 되는지 생각해요.", "‘쿠키는 정해진 수를 ~하고, 포스터는 4장씩 ~해요.’ 꼴로 써요."],
          ans: "쿠키는 정해진 24개를 남김없이 똑같이 나누는 일이고, 포스터는 4장, 8장, 12장, …처럼 4의 몇 배씩 늘어나는 일이에요." }) },
    { name: "말해 보기 — 나누어 본 경험, 묶음으로 센 경험", inst: "물건을 똑같이 나누어 본 경험과, 같은 수씩 묶음으로 세어 본 경험을 떠올려 써 보세요.", hints: ["간식이나 색종이를 친구와 똑같이 나누어 본 적이 있나요?", "한 묶음에 몇 개씩 든 물건을 여러 묶음 산 적이 있나요?"],
      render: (b, a) => writeStep(b, a, [
        { q: "물건을 남김없이 똑같이 나누어 본 경험을 써 보세요.", tag: "나누기", ph: "예: 귤 12개를 4명이 3개씩 똑같이 나누어 먹었어요.", help: ["① 무엇을 몇 개 나누었는지 써요. → ② 몇 명(몇 묶음)에게 몇 개씩 나누었는지 써요.", "‘○○ □개를 △명이 ☆개씩 똑같이 나누었어요.’ 꼴로 써요."], ans: "색종이 20장을 친구 5명에게 4장씩 남김없이 똑같이 나누어 주었어요." },
        { q: "같은 수씩 묶음으로 세어 본 경험을 써 보세요.", tag: "묶음", ph: "예: 한 묶음에 5개인 공책을 3묶음 사서 15권이 되었어요.", help: ["① 한 묶음에 몇 개씩 들어 있었는지 써요. → ② 몇 묶음이라서 모두 몇 개가 되었는지 써요.", "‘한 묶음에 □개씩 △묶음이라서 모두 ☆개예요.’ 꼴로 써요."], ans: "한 묶음에 10개씩 든 연필을 3묶음 사서 모두 30자루가 되었어요." }]) },
    { name: "약속하기 — 이 단원에서 배울 것", inst: "서진이가 단원의 차례를 넘겨 보며 배울 내용을 살펴봐요. 알맞은 것을 골라 보세요.", hints: ["이 단원은 약수와 배수 단원이에요.", "똑같이 나누는 일 → 약수, 몇 배씩 되풀이되는 일 → 배수예요."],
      render: (b, a) => quiz(b, a, [
        { q: "이 단원에서 배울 내용을 모두 고르세요.", o: ["곱셈식과 나눗셈식으로 약수와 배수 찾기", "공약수와 최대공약수", "공배수와 최소공배수", "분수의 덧셈과 뺄셈"], a: [0, 1, 2], why: { "3": "분수의 덧셈과 뺄셈은 5단원에서 배워요." } },
        { q: "쿠키 24개를 봉지 몇 개에 남김없이 똑같이 나누어 담을 수 있는지 알아볼 때 필요한 것은?", o: ["약수", "배수"], a: 0, why: { "1": "정해진 24개를 똑같이 나누는 일이에요. 약수를 이용해요." } },
        { q: "포스터를 날마다 4장씩 붙일 때 날수에 따라 몇 장인지 알아볼 때 필요한 것은?", o: ["약수", "배수"], a: 1, why: { "0": "4장, 8장, 12장, …처럼 4의 몇 배씩 늘어나요. 배수를 이용해요." } }],
        { ok: "약수와 배수를 공부할 준비가 되었어요." }) },
    { name: "확인하기 — 곱셈과 나눗셈 떠올리기", inst: "3학년 때 배운 곱셈과 나눗셈을 떠올려 계산해 보세요. 다 쓰면 저절로 확인해요.", hints: ["4 × 6 = 24이니까 24 ÷ 4 = 6이에요.", "(몇십몇) × (몇)은 일의 자리부터 곱해요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "4 × □ = 24이므로 24 ÷ 4 =", a: 24 / 4 },
        { q: "7 × □ = 63이므로 63 ÷ 7 =", a: 63 / 7 },
        { q: "15 × 4 =", a: 15 * 4 },
        { q: "90 ÷ 5 =", a: 90 / 5 },
        { q: "84 ÷ 7 =", a: 84 / 7 }], { ok: "곱셈과 나눗셈을 잘 기억하고 있어요. 약수와 배수를 찾을 때 곱셈식과 나눗셈식을 써요." }) }
  ],
  challenge: { inst: "★ 도전 — 장터 준비물을 똑같이 나누거나 묶음으로 세어 보세요.", hints: ["똑같이 나누면 나눗셈, 묶음으로 세면 곱셈이에요."], render: (b, a) => fm2Ask(b, a, [
    { q: "쿠키 24개를 한 봉지에 4개씩 담으면 봉지는", a: 24 / 4, unit: "개" },
    { q: "사탕 18개를 3명에게 똑같이 나누어 주면 한 명에게", a: 18 / 3, unit: "개" },
    { q: "포스터를 날마다 4장씩 5일 동안 붙이면 모두", a: 4 * 5, unit: "장" },
    { q: "한 상자에 6개씩 든 주스 3상자는 모두", a: 6 * 3, unit: "개" }], { ok: "나누기와 묶음 세기를 잘 해냈어요!" }) }
},
{
  id: "s2", no: 2, title: "쿠키를 봉지에 똑같이 나누어요 ― 약수", soop: "개념 구축하기(O)",
  question: "쿠키를 봉지 몇 개에 남김없이 똑같이 나누어 담을 수 있을까요?",
  summary: "어떤 수를 나누어떨어지게 하는 수를 그 수의 약수라고 해요. 8의 약수는 1, 2, 4, 8, 12의 약수는 1, 2, 3, 4, 6, 12예요. 2 × 9 = 18처럼 곱이 18이 되는 곱셈식에서 곱하는 두 수는 18의 약수예요. 어떤 수의 약수에는 1과 자기 자신이 항상 들어 있어요.",
  steps: [
    { name: "만져 보기 — 쿠키 나누어 담기", inst: "민호가 먼저 쿠키 8개로 연습해요. 봉지 수를 고르고, 봉지를 눌러 쿠키를 한 개씩 담아 보세요. 봉지 1개부터 8개까지 모두 알아봐요.", hints: ["봉지마다 쿠키 수가 똑같아야 해요.", "봉지 3개에 3개씩 담으려면 9개가 필요해요. 8개로는 1개가 부족해요."],
      render: ruleFirst((b, a) => fm2Share(b, a, { n: 8, ask: [
        { q: "쿠키 8개를 남김없이 똑같이 나누어 담을 수 있는 봉지의 수를 모두 써 보세요.", set: FM2_D(8), unit: "개", why: { "3": "봉지 3개에 2개씩 담으면 2개가 남고, 3개씩 담으면 1개가 부족해요.", "5": "봉지 5개에 1개씩 담으면 3개가 남아요.", "6": "봉지 6개에 1개씩 담으면 2개가 남아요.", "7": "봉지 7개에 1개씩 담으면 1개가 남아요." } },
        { q: "봉지 수를 구하는 방법으로 알맞은 것은?", o: ["8을 나누어떨어지게 하는 수를 구해요.", "8에 1, 2, 3, …을 곱해요.", "8보다 작은 수를 모두 구해요."], a: 0, why: { "1": "8에 곱한 수는 8보다 커져요. 똑같이 ‘나누는’ 일이에요.", "2": "8보다 작은 3, 5, 6, 7개 봉지에는 똑같이 나눌 수 없어요." } }],
        ok: "봉지 1개에 8개, 2개에 4개씩, 4개에 2개씩, 8개에 1개씩 담을 수 있어요." }),
        { q: "쿠키 8개를 봉지 몇 개에 똑같이 나누어 담을 수 있을까요? 어떤 봉지 수일 때 될지 내 규칙을 예상해요.", ph: "내 규칙: 봉지 수가 ~일 때 똑같이 나눌 수 있어요", help: ["① 8을 봉지 수로 나누었을 때 남는 것이 있는지 떠올려요. → ② 남는 것이 없는 봉지 수를 생각해요.", "‘내 규칙: 8 ÷ (봉지 수)가 ~일 때 똑같이 나눌 수 있어요.’ 꼴로 써요."],
          ans: "8 ÷ (봉지 수)가 나누어떨어질 때 똑같이 나눌 수 있어요. 그런 봉지 수는 1, 2, 4, 8이에요." }) },
    { name: "그려 보기 — 나눗셈식으로 알아보기", inst: "예린이는 마카롱 12개를 나누려고 해요. 나눗셈식을 이용하여 12를 나누어떨어지게 하는 수를 알아봐요. 몫과 나머지를 써 보세요.", hints: ["12 ÷ 3 = 4, 12 ÷ 6 = 2예요.", "12 ÷ 5 = 2 … 2예요. 나머지가 있으면 나누어떨어지지 않아요."],
      render: (b, a) => fm2DivTable(b, a, { n: 12, ds: fm2Range(1, 12), given: [1, 4, 8, 9, 10, 11], ask: [
        { q: "12를 나누어떨어지게 하는 수를 모두 써 보세요.", set: FM2_D(12), why: { "5": "12 ÷ 5 = 2 … 2로 나머지가 있어요.", "7": "12 ÷ 7 = 1 … 5로 나머지가 있어요.", "8": "12 ÷ 8 = 1 … 4로 나머지가 있어요.", miss: "나머지가 0인 나눗셈식을 모두 찾아봐요. 12 ÷ 12도 나누어떨어져요." } }],
        ok: "12 ÷ 1, 12 ÷ 2, 12 ÷ 3, 12 ÷ 4, 12 ÷ 6, 12 ÷ 12는 나누어떨어져요. 마카롱 12개는 봉지 1, 2, 3, 4, 6, 12개에 똑같이 나눌 수 있어요." }) },
    { name: "말해 보기 — 곱셈식으로 찾기", inst: "태오는 장터 스티커 18장을 판에 한 줄에 똑같은 수씩 붙이려고 해요. 한 줄에 붙이는 수를 바꾸어 보고, 모든 줄이 꽉 차는 방법을 모두 찾아요. 꽉 차면 저절로 기록돼요.", hints: ["한 줄에 1장, 2장, 3장, …씩 차례로 바꾸어 봐요.", "한 줄에 3장씩 6줄이면 3 × 6 = 18이에요."],
      render: thenWhy((b, a) => fm2Rect(b, a, { n: 18, item: "스티커", unit: "장", start: 4, color: FM2.purple, ask: [
        { q: "18 ÷", post: "= 6", a: 3 },
        { q: "1 × 18 = 18, 2 × 9 = 18, 3 × 6 = 18을 보고 18의 약수를 모두 써 보세요.", set: FM2_D(18), why: { "4": "18 ÷ 4 = 4 … 2예요. 4는 18의 약수가 아니에요.", miss: "곱셈식의 두 수가 모두 18의 약수예요. 1과 18, 2와 9, 3과 6을 모두 써요." } }],
        ok: "1 × 18, 2 × 9, 3 × 6에서 18의 약수 1, 2, 3, 6, 9, 18을 찾았어요." }),
        { q: "곱이 18이 되는 곱셈식으로 약수를 찾으면 왜 편리할까요?", ph: "곱셈식 하나에서 ~", help: ["① 2 × 9 = 18에서 18 ÷ 2와 18 ÷ 9를 떠올려요. → ② 곱셈식 하나에서 약수를 몇 개 찾는지 생각해요.", "‘곱셈식 하나에서 약수를 ~개씩 짝 지어 찾을 수 있어서 ~해요.’ 꼴로 써요."],
          ans: "2 × 9 = 18이면 18 ÷ 2 = 9, 18 ÷ 9 = 2라서 2와 9가 둘 다 약수예요. 곱셈식 하나에서 약수를 두 개씩 짝 지어 찾으니 빠뜨리지 않고 빨리 찾을 수 있어요." }) },
    { name: "약속하기 — 약수", inst: "약속을 완성해 보세요.", hints: ["12 ÷ 1, 12 ÷ 2, 12 ÷ 3, 12 ÷ 4, 12 ÷ 6, 12 ÷ 12는 나누어떨어져요.", "어떤 수든 1로 나누거나 자기 자신으로 나누면 나누어떨어져요."],
      render: (b, a) => blanks(b, a, ["12를 나누어떨어지게 하는 수인 1, 2, 3, 4, 6, 12를 12의 ", { o: ["약수", "배수", "몫"], a: 0 }, "라고 해요. 이와 같이 어떤 수를 ", { o: ["나누어떨어지게 하는", "1배, 2배, 3배, … 한"], a: 0 }, " 수를 그 수의 약수라고 해요. 어떤 수의 약수에는 ", { o: ["1과 자기 자신", "0과 1", "2와 자기 자신"], a: 0 }, "이 항상 들어 있어요."], { ok: "어떤 수를 나누어떨어지게 하는 수가 그 수의 약수예요." }) },
    { name: "확인하기 — 16의 약수 찾기", inst: "하윤이는 젤리 16개를 나누려고 해요. 16의 약수를 모두 찾아 ○표 하세요.", hints: ["16을 1, 2, 3, …으로 나누어 나누어떨어지는지 살펴봐요.", "1 × 16 = 16, 2 × 8 = 16, 4 × 4 = 16이에요."],
      render: (b, a) => fm2Board(b, a, { nums: fm2Range(1, 16), cols: 8, layers: [{ name: "16의 약수", want: FM2_D(16), shape: "circle", why: v => `16 ÷ ${v} = ${Math.floor(16 / v)} … ${fm2J(16 % v, "으로")} 나머지가 있어요.`, miss: "1과 16도 16의 약수예요. 곱이 16이 되는 곱셈식을 떠올려요." }], ask: [
        { q: "16의 약수를 찾은 방법으로 알맞은 것을 모두 고르세요.", o: ["16을 나누어떨어지게 하는 수를 찾았어요.", "곱이 16이 되는 곱셈식 1 × 16, 2 × 8, 4 × 4를 찾았어요.", "16보다 작은 짝수를 모두 찾았어요."], a: [0, 1], why: { "2": "6, 10, 12, 14는 짝수이지만 16을 나누어떨어지게 하지 않아요." } }],
        ok: "16의 약수는 1, 2, 4, 8, 16이에요. 젤리 16개는 봉지 1, 2, 4, 8, 16개에 똑같이 나눌 수 있어요." }) }
  ],
  challenge: { inst: "★ 도전 — 약수를 구해 보세요.", hints: ["20 ÷ 5 = 4, 20 ÷ 4 = 5예요.", "30 = 1 × 30 = 2 × 15 = 3 × 10 = 5 × 6"], render: (b, a) => fm2Ask(b, a, [
    { q: "20 ÷", post: "= 4", a: 5, why: { "4": "20 ÷ 4 = 5예요. 몫이 4가 되려면 20을 무엇으로 나누어야 할까요?" } },
    { q: "30의 약수를 모두 써 보세요.", set: FM2_D(30), why: { "4": "30 ÷ 4 = 7 … 2예요.", miss: "30 = 1 × 30 = 2 × 15 = 3 × 10 = 5 × 6처럼 짝 지어 찾아봐요." } },
    { q: "36과 40 중 약수가 더 많은 수는?", o: ["36", "40"], a: FM2_D(36).length > FM2_D(40).length ? 0 : 1, why: { "1": `36의 약수는 ${FM2_D(36).length}개, 40의 약수는 ${FM2_D(40).length}개예요. 수가 크다고 약수가 더 많은 것은 아니에요.` } },
    { q: "약수가 1, 3, 7, 21인 어떤 수는?", a: 21, why: { "7": "어떤 수의 약수 중 가장 큰 수는 자기 자신이에요." } },
    { q: "42의 약수 중 10보다 크고 홀수인 수는?", a: 21, why: { "14": "14는 짝수예요.", "42": "42는 짝수예요.", "7": "7은 10보다 작아요." } }],
    { ok: "약수를 빠짐없이 찾았어요! 약수는 두 수씩 짝 지어 찾으면 빠뜨리지 않아요." }) }
},
{
  id: "s3", no: 3, title: "날마다 홍보 포스터를 붙여요 ― 배수", soop: "개념 구축하기(O)",
  question: "날수에 따라 붙인 포스터는 모두 몇 장일까요?",
  summary: "어떤 수를 1배, 2배, 3배, … 한 수를 그 수의 배수라고 해요. 4의 배수는 4, 8, 12, …이고 셀 수 없이 많아요. 배수 중 가장 작은 수는 자기 자신이에요. 4 × 5 = 20에서 4와 5는 20의 약수이고, 20은 4와 5의 배수예요.",
  steps: [
    { name: "만져 보기 — 4장씩 뛰어 세기", inst: "홍보 담당 태오는 날마다 포스터를 4장씩 붙이기로 했어요. 날수에 따라 붙인 포스터 수를 수직선에서 4씩 뛰어 세어 보세요. 도착하는 곳을 눌러요.", hints: ["1일에 4장, 하루가 늘어날 때마다 4장씩 늘어나요.", "4에서 4만큼 더 가면 8이에요."],
      render: (b, a) => fm2Hop(b, a, { max: 24, hops: [{ n: 4, count: 5, name: "포스터", tag: k => `${k}일` }], ask: [
        { q: "1일 동안 붙인 포스터", a: 4, unit: "장" },
        { q: "2일 동안 붙인 포스터", a: 8, unit: "장" },
        { q: "5일 동안 붙인 포스터", a: 20, unit: "장", why: { "9": "4와 5를 더했어요. 4장씩 5일이니 4를 5배 해요." } },
        { q: "규칙으로 알맞은 것은?", o: ["1일씩 늘어날 때마다 4장씩 늘어나요.", "1일씩 늘어날 때마다 1장씩 늘어나요."], a: 0 }],
        ok: "1일에 4장, 2일에 8장, 5일에 20장이에요. 4에 1배, 2배, 3배, … 한 수를 구하면 돼요." }) },
    { name: "그려 보기 — 곱셈식으로 나타내기", inst: "곱셈식을 이용하여 4를 몇 배 한 수를 알아봐요. 다 쓰면 저절로 확인해요.", hints: ["4를 2배 한 수는 4 × 2예요.", "4를 6배 한 수는 4 × 6 = 24예요."],
      render: thenWhy((b, a) => fm2Ask(b, a, [
        { q: "4를 1배 한 수: 4 × 1 =", a: 4 },
        { q: "4를 2배 한 수: 4 × 2 =", a: 8 },
        { q: "4를 3배 한 수: 4 ×", post: "= 12", a: 3 },
        { q: "4를 6배 한 수: 4 × 6 =", a: 24 },
        { q: "4를 1배, 2배, 3배, 4배 한 수를 차례로 써 보세요.", set: fm2Mults(4, 4), ordered: true, why: { "0": "4를 1배 한 수부터 써요. 가장 작은 수는 4예요." } }],
        { ok: "4를 1배, 2배, 3배, 4배 한 수는 4, 8, 12, 16이에요." }),
        { q: "4를 몇 배 한 수는 끝이 있을까요? 왜 그렇게 생각하나요?", ph: "4를 몇 배 한 수는 ~", help: ["① 4 × 10, 4 × 100, 4 × 1000을 떠올려요. → ② 곱하는 수를 계속 늘릴 수 있는지 생각해요.", "‘4에 곱하는 수를 계속 ~할 수 있어서 4를 몇 배 한 수는 ~.’ 꼴로 써요."],
          ans: "4에 곱하는 수를 1, 2, 3, …으로 끝없이 늘릴 수 있어서 4를 몇 배 한 수는 셀 수 없이 많아요." }) },
    { name: "약속하기 — 배수", inst: "약속을 완성해 보세요.", hints: ["4, 8, 12, …는 4를 1배, 2배, 3배, … 한 수예요.", "4를 1배 한 수는 4 자신이에요."],
      render: (b, a) => blanks(b, a, ["4를 1배, 2배, 3배, … 한 수인 4, 8, 12, …를 4의 ", { o: ["배수", "약수", "몫"], a: 0 }, "라고 해요. 이와 같이 어떤 수를 ", { o: ["1배, 2배, 3배, …", "나누어떨어지게"], a: 0 }, " 한 수를 그 수의 배수라고 해요. 어떤 수의 배수는 ", { o: ["셀 수 없이 많아요", "4개뿐이에요"], a: 0 }, ". 어떤 수의 배수 중 가장 작은 수는 ", { o: ["자기 자신", "0", "1"], a: 0 }, "이에요."], { ok: "어떤 수를 1배, 2배, 3배, … 한 수가 그 수의 배수예요." }) },
    { name: "말해 보기 — 약수와 배수의 관계", inst: "하윤이가 20을 여러 수의 곱으로 나타냈어요. 준비단 친구들의 말 중 옳은 것을 모두 골라 보세요.", hints: ["20 = 4 × 5에서 4와 5는 20을 나누어떨어지게 해요.", "20은 4를 5배 한 수이기도 해요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "옳게 말한 것을 모두 고르세요.", fig: fm2Note("20 = 1 × 20 · 20 = 2 × 10 · 20 = 4 × 5 · 20 = 2 × 2 × 5"), o: ["민호: 4와 5는 20의 약수야.", "예린: 20은 4와 5의 배수야.", "태오: 2 × 2도 20의 약수야.", "서진: 20은 10의 약수야."], a: [0, 1, 2], why: { "3": "20은 10을 2배 한 수이므로 10의 배수예요. 10이 20의 약수예요." } },
        { q: "어떤 수를 여러 수의 곱으로 나타냈을 때, 곱하는 수들은 어떤 수의 □이고, 어떤 수는 곱하는 수들의 □예요.", o: ["약수, 배수", "배수, 약수"], a: 0, why: { "1": "20 = 4 × 5에서 4는 20을 나누어떨어지게 하니 20의 약수예요." } }],
        { ok: "20 = 2 × 2 × 5이므로 2, 5, 2 × 2, 2 × 5도 20의 약수이고, 20은 그 수들의 배수예요." }),
        { q: "4 × 5 = 20에서 4와 20은 어떤 관계인지 두 가지로 말해 봐요.", ph: "4는 20의 ~이고, 20은 4의 ~예요", help: ["① 20 ÷ 4가 나누어떨어지는지 생각해요. → ② 20이 4를 몇 배 한 수인지 생각해요.", "‘4는 20의 ~이고, 20은 4의 ~예요. 왜냐하면 ~.’ 꼴로 써요."],
          ans: "4는 20의 약수이고, 20은 4의 배수예요. 20 ÷ 4 = 5로 나누어떨어지고, 20은 4를 5배 한 수이기 때문이에요." }) },
    { name: "확인하기 — 6의 배수 찾기", inst: "장터 날 6분마다 종을 울리기로 했어요. 1부터 30까지의 수에서 6의 배수를 모두 찾아 색칠해 보세요.", hints: ["6에 1, 2, 3, 4, …를 곱해 빠짐없이 찾아요.", "6 × 5 = 30이에요."],
      render: (b, a) => fm2Board(b, a, { nums: fm2Range(1, 30), cols: 10, layers: [{ name: "6의 배수", want: fm2MultsTo(6, 30), shape: "fill", why: v => v < 6 ? `${fm2J(v, "은는")} 6보다 작아서 6의 배수가 아니에요. 6의 배수 중 가장 작은 수는 6이에요.` : `6 × ${Math.floor(v / 6)} = ${6 * Math.floor(v / 6)}, 6 × ${Math.floor(v / 6) + 1} = ${fm2J(6 * Math.floor(v / 6) + 6, "이라")} ${fm2J(v, "은는")} 그 사이에 있는 수예요.`, miss: "6 × 1, 6 × 2, 6 × 3, …을 차례로 계산해 봐요." }],
        ok: "6의 배수는 6, 12, 18, 24, 30, …이에요. 종은 6분, 12분, 18분, …에 울려요." }) }
  ],
  challenge: { inst: "★ 도전 — 수 배열표에서 3의 배수에는 ○표, 7의 배수에는 △표 하세요.", hints: ["3의 배수는 3씩, 7의 배수는 7씩 커져요.", "21과 42는 3의 배수이면서 7의 배수예요."],
    render: (b, a) => fm2Board(b, a, { nums: fm2Range(1, 50), cols: 10, cell: 68, layers: [{ name: "3의 배수", want: fm2MultsTo(3, 50), shape: "circle" }, { name: "7의 배수", want: fm2MultsTo(7, 50), shape: "tri" }], ask: [
      { q: "15의 배수를 가장 작은 수부터 5개 써 보세요.", set: fm2Mults(15, 5), ordered: true, why: { "0": "배수 중 가장 작은 수는 자기 자신(15)이에요." } },
      { q: "14의 배수 중 두 자리 수는 몇 개인가요?", a: fm2MultsTo(14, 99).length, unit: "개" },
      { q: "서진: 9의 배수야. 예린: 그중 50에 가장 가까운 수야. 두 사람이 설명하는 수는?", a: 54, why: { "45": "45는 50과 5 차이, 54는 50과 4 차이예요.", "50": "50은 9의 배수가 아니에요." } },
      { q: "42 = 2 × 3 × 7을 보고 옳게 말한 것은?", o: ["㉠ 42는 2 × 3의 약수예요.", "㉡ 42의 약수는 2, 3, 7뿐이에요.", "㉢ 3 × 7은 42의 배수예요.", "㉣ 7은 42의 약수예요."], a: 3, why: { "0": "42는 2 × 3 = 6의 배수예요.", "1": "1, 42, 2 × 3, 2 × 7, 3 × 7 등도 42의 약수예요.", "2": "3 × 7 = 21은 42의 약수예요." } }],
      ok: "배수를 빠짐없이 찾고, 약수와 배수의 관계도 바르게 말했어요!" }) }
},
{
  id: "s4", no: 4, title: "선물 꾸러미를 만들어요 ― 공약수와 최대공약수", soop: "개념 구축하기(O)",
  question: "사탕 18개와 젤리 12개를 꾸러미 몇 개에 남김없이 똑같이 나누어 담을 수 있을까요?",
  summary: "16과 20의 공통된 약수 1, 2, 4를 16과 20의 공약수, 공약수 중 가장 큰 수 4를 최대공약수라고 해요. 최대공약수의 약수는 공약수와 같아요. 공약수 중 가장 작은 수는 언제나 1이고, 최대공약수는 두 수보다 클 수 없어요.",
  steps: [
    { name: "만져 보기 — 꾸러미 수 찾기", inst: "예린이는 장터 선물로 사탕 18개와 젤리 12개를 꾸러미에 남김없이 똑같이 나누어 담으려고 해요. 사탕과 젤리를 각각 똑같이 나눌 수 있는 꾸러미 수에 ○표 하세요. 수를 누르면 아래에 나눗셈이 보여요.", hints: ["사탕은 18의 약수, 젤리는 12의 약수만큼의 꾸러미에 나누어 담을 수 있어요.", "두 줄에 모두 ○표 한 수는 사탕과 젤리를 모두 똑같이 나눌 수 있는 꾸러미 수예요."],
      render: (b, a) => fm2Rows(b, a, { common: true, rows: [
        { label: "사탕 18개", nums: fm2Range(1, 18), want: FM2_D(18), what: "사탕 18개를 똑같이 나눌 수 있는 꾸러미 수", why: v => `사탕 18개를 꾸러미 ${v}개에 나누면 18 ÷ ${v} = ${Math.floor(18 / v)} … ${fm2J(18 % v, "으로")} 남아요.`, peek: v => `18 ÷ ${v} = ${Math.floor(18 / v)}${18 % v ? ` … ${18 % v} (남아요)` : " (똑같이 나누어져요)"}` },
        { label: "젤리 12개", nums: fm2Range(1, 12), want: FM2_D(12), what: "젤리 12개를 똑같이 나눌 수 있는 꾸러미 수", why: v => `젤리 12개를 꾸러미 ${v}개에 나누면 12 ÷ ${v} = ${Math.floor(12 / v)} … ${fm2J(12 % v, "으로")} 남아요.`, peek: v => `12 ÷ ${v} = ${Math.floor(12 / v)}${12 % v ? ` … ${12 % v} (남아요)` : " (똑같이 나누어져요)"}` }],
        found: "사탕과 젤리를 모두 똑같이 나눌 수 있는 꾸러미 수: ",
        ask: [
          { q: "사탕 18개와 젤리 12개를 모두 남김없이 똑같이 나누어 담을 수 있는 꾸러미 수를 모두 써 보세요.", set: fm2Both(FM2_D(18), FM2_D(12)), unit: "개", why: { "9": "젤리 12개는 꾸러미 9개에 똑같이 나눌 수 없어요.", "4": "사탕 18개는 꾸러미 4개에 똑같이 나눌 수 없어요.", "12": "사탕 18개는 꾸러미 12개에 똑같이 나눌 수 없어요." } },
          { q: "최대한 많은 꾸러미를 만든다면 꾸러미는 몇 개인가요?", a: fm2Gcd(18, 12), unit: "개", why: { "18": "사탕은 18꾸러미에 나눌 수 있지만 젤리 12개는 18꾸러미에 똑같이 나눌 수 없어요.", "12": "젤리는 12꾸러미에 나눌 수 있지만 사탕 18개는 12꾸러미에 똑같이 나눌 수 없어요." } },
          { q: "그때 한 꾸러미에 사탕은 몇 개씩 담기나요?", a: 18 / fm2Gcd(18, 12), unit: "개" }],
        ok: "꾸러미 1, 2, 3, 6개에 나누어 담을 수 있고, 최대한 많이 만들면 6꾸러미예요. 한 꾸러미에 사탕 3개, 젤리 2개씩이에요." }) },
    { name: "약속하기 — 공약수와 최대공약수", inst: "16과 20의 공통된 약수를 찾고 약속을 완성해 보세요. 다 쓰고 고르면 저절로 확인해요.", hints: ["16의 약수는 1, 2, 4, 8, 16이에요.", "20의 약수는 1, 2, 4, 5, 10, 20이에요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "16의 약수를 모두 써 보세요.", set: FM2_D(16) },
        { q: "20의 약수를 모두 써 보세요.", set: FM2_D(20) },
        { q: "16과 20의 공통된 약수를 모두 써 보세요.", set: fm2Both(FM2_D(16), FM2_D(20)), why: { "8": "8은 20의 약수가 아니에요.", "5": "5는 16의 약수가 아니에요." } },
        { q: "공통된 약수 중 가장 큰 수는?", a: fm2Gcd(16, 20), why: { "20": "20은 16의 약수가 아니에요. 공통된 약수 중에서 골라요.", "80": "80은 16과 20의 공배수예요. 약수는 그 수보다 클 수 없어요." } },
        { q: "1, 2, 4는 16의 약수도 되고 20의 약수도 돼요. 16과 20의 공통된 약수인 1, 2, 4를 16과 20의 □라고 해요.", o: ["공약수", "공배수", "최대공약수"], a: 0 },
        { q: "공약수 중에서 가장 큰 수인 4를 16과 20의 □라고 해요.", o: ["최대공약수", "최소공배수", "공약수"], a: 0 }],
        { ok: "16과 20의 공약수는 1, 2, 4이고, 최대공약수는 4예요." }) },
    { name: "말해 보기 — 공약수와 최대공약수의 관계", inst: "30의 약수와 45의 약수예요. 두 줄에 모두 있는 수를 눌러 같은 수끼리 이어 보세요. 다 이으면 저절로 확인해요.", hints: ["두 줄에 모두 있는 수가 30과 45의 공약수예요.", "15의 약수는 1, 3, 5, 15예요."],
      render: thenWhy((b, a) => fm2Rows(b, a, { mode: "link", common: true, say1: "30의 약수와 45의 약수 중 두 줄에 모두 있는 수(공약수)를 눌러 이어요.", notBoth: "두 줄에 모두 있는 수가 아니에요.",
        rows: [{ label: "30의 약수", nums: FM2_D(30) }, { label: "45의 약수", nums: FM2_D(45) }], found: "30과 45의 공약수: ",
        ask: [
          { q: "30과 45의 최대공약수는?", a: fm2Gcd(30, 45), why: { "45": "45는 30의 약수가 아니에요.", "90": "90은 30과 45의 최소공배수예요. 최대공약수는 두 수보다 클 수 없어요." } },
          { q: "최대공약수 15의 약수를 모두 써 보세요.", set: FM2_D(15) },
          { q: "알게 된 점으로 알맞은 것은?", o: ["최대공약수의 약수는 공약수와 같아요.", "최대공약수의 배수는 공약수와 같아요.", "공약수는 최대공약수보다 커요."], a: 0 }],
        ok: "30과 45의 공약수 1, 3, 5, 15는 최대공약수 15의 약수와 같아요." }),
        { q: "최대공약수만 알면 공약수를 모두 찾을 수 있는 까닭은 무엇일까요?", ph: "공약수는 최대공약수의 ~", help: ["① 30과 45의 공약수 1, 3, 5, 15와 15의 약수를 견주어요. → ② 둘이 어떤 관계인지 써요.", "‘공약수는 최대공약수의 ~와 같아서, 최대공약수의 ~를 구하면 돼요.’ 꼴로 써요."],
          ans: "두 수의 공약수는 최대공약수의 약수와 같아요. 그래서 최대공약수 15의 약수 1, 3, 5, 15를 구하면 공약수를 모두 찾을 수 있어요." }) },
    { name: "확인하기 — 공약수 찾고 설명하기", inst: "20과 30의 공약수와 최대공약수를 구하고, 하윤이의 말이 맞는지 판단해요. 그리고 아래에 친구에게 설명하는 글을 써요. 두 가지를 모두 해야 계단을 올라요.", hints: ["20의 약수 1, 2, 4, 5, 10, 20 / 30의 약수 1, 2, 3, 5, 6, 10, 15, 30", "1은 모든 수의 약수예요."],
      render: (b, a) => { fm2Ask(b, a, [
        { q: "20과 30의 공약수를 모두 써 보세요.", set: fm2Both(FM2_D(20), FM2_D(30)), why: { "4": "4는 30의 약수가 아니에요.", "3": "3은 20의 약수가 아니에요.", "6": "6은 20의 약수가 아니에요." } },
        { q: "20과 30의 최대공약수는?", a: fm2Gcd(20, 30), why: { [fm2Lcm(20, 30)]: "60은 20과 30의 최소공배수예요. ‘최대’라도 최대공약수는 두 수보다 클 수 없어요.", "30": "30은 20의 약수가 아니에요." } },
        { q: "하윤: ‘20과 30의 공약수 중에서 가장 작은 수는 2야.’ 바르게 고친 것은?", o: ["20과 30의 공약수 중에서 가장 작은 수는 1이야.", "20과 30의 공약수 중에서 가장 작은 수는 5야.", "20과 30의 공약수 중에서 가장 작은 수는 10이야."], a: 0, why: { "1": "1은 모든 수의 약수예요.", "2": "10은 20과 30의 최대공약수예요." } }],
        { ok: "20과 30의 공약수는 1, 2, 5, 10, 최대공약수는 10이에요. 공약수 중 가장 작은 수는 언제나 1이에요." });
        writeStep(b, a, [
          { q: "공약수와 최대공약수를 처음 배우는 친구에게 설명해 보세요.", tag: "설명", ph: "공약수는 ~이고, 최대공약수는 ~예요", help: ["① 공약수의 뜻을 ‘두 수의 공통된 ~’으로 써요. → ② 그중 어떤 수가 최대공약수인지 써요.", "‘공약수는 두 수의 공통된 ~이고, 최대공약수는 공약수 중 가장 ~예요. 예를 들어 ~.’ 꼴로 써요."],
            ans: "공약수는 두 수의 공통된 약수이고, 최대공약수는 공약수 중에서 가장 큰 수예요. 예를 들어 20과 30의 공약수는 1, 2, 5, 10이고 최대공약수는 10이에요." }]); } }
  ],
  challenge: { inst: "★ 도전 — 장터 선물 문제를 풀어 보세요.", hints: ["‘최대한 많은 사람에게 남김없이 똑같이’는 최대공약수예요.", "공약수의 개수는 최대공약수의 약수의 개수와 같아요."], render: (b, a) => fm2Ask(b, a, [
    { q: "연필 36자루와 지우개 24개를 최대한 많은 친구에게 남김없이 똑같이 나누어 주려면 몇 명에게 줄 수 있나요?", a: fm2Gcd(36, 24), unit: "명", why: { [fm2Lcm(36, 24)]: "72는 36과 24의 최소공배수예요. 똑같이 나누는 상황이니 최대공약수를 구해요.", "6": "6명에게도 나눌 수 있지만 더 많은 친구에게 나눌 수 있어요." } },
    { q: "24와 32의 공약수는 모두 몇 개인가요?", a: FM2_D(fm2Gcd(24, 32)).length, unit: "개", why: { "8": "8은 최대공약수예요. 공약수는 최대공약수 8의 약수 1, 2, 4, 8이에요." } },
    { q: "40과 56을 어떤 수로 나누면 둘 다 나누어떨어져요. 어떤 수 중에서 가장 큰 수는?", a: fm2Gcd(40, 56) }],
    { ok: "최대공약수를 이용해 나누는 문제를 해결했어요!" }) }
},
{
  id: "s5", no: 5, title: "최대공약수를 빠르게 구해요", soop: "개념 구축하기(O)",
  question: "약수를 모두 쓰지 않고도 최대공약수를 구할 수 있을까요?",
  summary: "두 수를 여러 수의 곱으로 나타낸 식에서 공통으로 들어 있는 수를 모두 곱하면 최대공약수예요. 또는 두 수를 공약수로 더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수를 모두 곱해도 최대공약수예요. 24와 36의 최대공약수는 2 × 2 × 3 = 12예요.",
  steps: [
    { name: "만져 보기 — 곱으로 나타내기", inst: "선물 꾸러미가 더 커졌어요. 사탕 24개와 젤리 36개예요. 두 수를 두 수의 곱으로, 또 더 작은 수의 곱으로 나타내어 최대공약수를 구해 봐요. 다 하면 20과 30도 같은 방법으로 구해요.", hints: ["24 = 2 × 12, 12 = 2 × 6, 6 = 2 × 3이므로 24 = 2 × 2 × 2 × 3이에요.", "24 = 2 × 2 × 2 × 3, 36 = 2 × 2 × 3 × 3에 공통으로 들어 있는 수는 2, 2, 3이에요."],
      render: ruleFirst((b, a) => fm2Tree(b, a, { goal: "gcd", pairs: [[24, 36], [20, 30]], ask: [
        { q: "여러 수의 곱으로 나타낸 식으로 최대공약수를 구하는 방법은?", o: ["식에 공통으로 들어 있는 수를 모두 곱해요.", "식에 있는 수를 모두 곱해요.", "식에서 가장 큰 수를 골라요."], a: 0, why: { "1": "그러면 공통이 아닌 수까지 곱하게 돼요. 두 수를 모두 나누어떨어지게 하려면 공통인 수만 곱해요.", "2": "24 = 2 × 2 × 2 × 3에서 가장 큰 수는 3이지만 최대공약수는 12예요." } }],
        ok: "24와 36의 최대공약수는 2 × 2 × 3 = 12, 20과 30의 최대공약수는 2 × 5 = 10이에요." }),
        { q: "두 수를 여러 수의 곱으로 나타내면 최대공약수를 어떻게 찾을 수 있을지 예상해요.", ph: "내 규칙: 두 식에 ~", help: ["① 두 식에 똑같이 들어 있는 수를 찾아요. → ② 그 수들로 무엇을 할지 생각해요.", "‘내 규칙: 두 식에 공통으로 들어 있는 수를 ~하면 최대공약수예요.’ 꼴로 써요."],
          ans: "두 식에 공통으로 들어 있는 수를 모두 곱하면 최대공약수예요. 24 = 2 × 2 × 2 × 3, 36 = 2 × 2 × 3 × 3에서 공통인 2 × 2 × 3 = 12예요." }) },
    { name: "그려 보기 — 공약수로 나누기", inst: "공약수로 나누어 24와 36의 최대공약수를 구해 봐요. 다 하면 20과 30도 구해요. 어떤 공약수로 먼저 나누어도 괜찮아요.", hints: ["24와 36은 둘 다 2로 나누어떨어져요. 12로 한 번에 나누어도 돼요.", "1이 아닌 공약수가 없을 때까지 나누고, 왼쪽의 수를 모두 곱해요."],
      render: (b, a) => fm2Ladder(b, a, { goal: "gcd", pairs: [[24, 36], [20, 30]], ask: [
        { q: "24와 36을 12로 한 번에 나누면 몫은 2와 3이에요. 이때 최대공약수는?", a: 12 },
        { q: "공약수로 나누어 최대공약수를 구하는 방법은?", o: ["두 수의 공약수로 더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수를 모두 곱해요.", "두 수를 1로 나누고 몫을 곱해요.", "마지막 몫을 모두 곱해요."], a: 0, why: { "1": "1로 나누면 아무것도 달라지지 않아요.", "2": "마지막 몫 2와 3을 곱한 6은 최대공약수가 아니에요." } }],
        ok: "공약수로 나누어도 24와 36의 최대공약수는 12, 20과 30의 최대공약수는 10이에요. 두 가지 방법의 답이 같아요." }) },
    { name: "말해 보기 — 태오의 실수", inst: "태오는 24와 36을 2로 나누어 몫 12와 18을 쓰고 멈춘 뒤, 최대공약수가 2라고 했어요. 무엇이 잘못되었는지 골라 보세요.", hints: ["12와 18은 아직 둘 다 6으로 나누어떨어져요.", "더 이상 나눌 수 없을 때까지 나누어야 해요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "태오의 계산에서 잘못된 점은?", fig: fm2sLadderFig([{ d: 2, a: 24, b: 36 }], [12, 18]), o: ["12와 18을 더 나눌 수 있는데 멈추었어요.", "2로 나누면 안 돼요.", "몫을 잘못 계산했어요."], a: 0, why: { "1": "2는 24와 36의 공약수라서 2로 나누어도 돼요.", "2": "24 ÷ 2 = 12, 36 ÷ 2 = 18로 몫은 맞아요." } },
        { q: "끝까지 나누면 24와 36의 최대공약수는?", o: ["12", "2", "72"], a: 0, why: { "1": "12와 18을 6으로 더 나누면 왼쪽의 수는 2와 6이에요. 2 × 6 = 12예요.", "2": "72는 24와 36의 최소공배수예요." } }],
        { ok: "12와 18을 6으로 더 나누어야 해요. 왼쪽의 2와 6을 곱한 12가 최대공약수예요." }),
        { q: "공약수로 나눌 때 ‘더 이상 나눌 수 없을 때까지’ 나누어야 하는 까닭은 무엇일까요?", ph: "중간에 멈추면 ~", help: ["① 태오처럼 중간에 멈추면 왼쪽에 곱하는 수가 어떻게 되는지 생각해요. → ② 그 수가 최대공약수보다 큰지 작은지 생각해요.", "‘중간에 멈추면 아직 나눌 수 있는 공약수를 ~해서, 구한 수가 ~.’ 꼴로 써요."],
          ans: "중간에 멈추면 아직 나눌 수 있는 공약수를 곱하지 못해서, 구한 수가 공약수이기는 해도 가장 큰 공약수가 되지 않아요." }) },
    { name: "약속하기 — 최대공약수 구하는 방법", inst: "최대공약수를 구하는 두 가지 방법을 정리해요.", hints: ["여러 수의 곱으로 나타낸 식에서는 공통인 수를 곱해요.", "공약수로 나누기에서는 왼쪽에 나눈 공약수를 곱해요."],
      render: (b, a) => blanks(b, a, ["방법 1: 두 수를 여러 수의 곱으로 나타낸 식에서 ", { o: ["공통으로 들어 있는 수", "공통이 아닌 수"], a: 0 }, "를 모두 곱해요. 방법 2: 두 수를 공약수로 ", { o: ["더 이상 나눌 수 없을 때까지", "한 번만"], a: 0 }, " 나누고, 나눈 ", { o: ["공약수", "마지막 몫"], a: 0 }, "를 모두 곱해요. 두 방법으로 구한 최대공약수는 ", { o: ["같아요", "달라요"], a: 0 }, "."], { ok: "두 방법 모두 공통인 부분을 곱해서 최대공약수를 구해요." }) },
    { name: "확인하기 — 가격표 자르기", inst: "하윤이는 가로 18 cm, 세로 12 cm인 색 도화지를 크기가 같은 정사각형 가격표로 남는 부분 없이 자르려고 해요. 가장 큰 정사각형으로 자르려면 한 변의 길이를 몇 cm로 해야 할까요? 여러 길이로 나누어 본 다음 답해요.", hints: ["정사각형의 한 변의 길이는 18과 12의 공약수여야 해요.", "18과 12의 공약수 1, 2, 3, 6 중 가장 큰 수를 찾아요."],
      render: (b, a) => fm2Square(b, a, { w: 18, h: 12, tip: "정사각형 가격표의 한 변의 길이를 골라 나누어 보세요. 남는 부분이 없어야 해요.", ask: [
        { q: "가장 큰 정사각형 가격표의 한 변의 길이는?", a: fm2Gcd(18, 12), unit: "cm", why: { "3": "3 cm로도 자를 수 있지만 더 큰 정사각형이 있어요.", "2": "2 cm로도 자를 수 있지만 더 큰 정사각형이 있어요.", "4": "4 cm로는 가로 18 cm를 남김없이 나눌 수 없어요.", "12": "12 cm로는 가로 18 cm를 남김없이 나눌 수 없어요." } },
        { q: "그때 가격표는 모두 몇 장인가요?", a: (18 / 6) * (12 / 6), unit: "장" }],
        ok: "18과 12의 최대공약수 6 cm로 자르면 가장 큰 정사각형 가격표 6장이 돼요!" }) }
  ],
  challenge: { inst: "★ 도전 — 최대공약수를 구해 보세요.", hints: ["42 = 2 × 3 × 7, 56 = 2 × 2 × 2 × 7", "48과 60을 2, 2, 3으로 차례로 나누어 봐요."], render: (b, a) => fm2Ask(b, a, [
    { q: "42와 56의 최대공약수는?", a: fm2Gcd(42, 56), why: { "7": "7도 공약수이지만 2 × 7 = 14가 더 커요.", "2": "2도 공약수이지만 더 큰 공약수가 있어요." } },
    { q: "공책 48권과 색연필 60자루를 최대한 많은 모둠에 남김없이 똑같이 나누어 주려면 몇 모둠에 줄 수 있나요?", a: fm2Gcd(48, 60), unit: "모둠" },
    { q: "그때 한 모둠에 색연필은 몇 자루씩인가요?", a: 60 / fm2Gcd(48, 60), unit: "자루" },
    { q: "민호: ‘32와 48의 공약수 중 가장 작은 수는 2야.’ 바르게 고친 것은?", o: ["32와 48의 공약수 중 가장 작은 수는 1이야.", "32와 48의 공약수 중 가장 작은 수는 16이야."], a: 0, why: { "1": "16은 32와 48의 최대공약수예요. 1은 모든 수의 약수라서 가장 작은 공약수예요." } }],
    { ok: "최대공약수를 여러 방법으로 구할 수 있어요!" }) }
},
{
  id: "s6", no: 6, title: "장터 이벤트 시간표를 짜요 ― 공배수와 최소공배수", soop: "개념 구축하기(O)",
  question: "풍선 이벤트와 뽑기 이벤트가 다시 동시에 시작하는 때는 몇 분 후일까요?",
  summary: "6과 8의 공통된 배수 24, 48, …를 6과 8의 공배수, 공배수 중 가장 작은 수 24를 최소공배수라고 해요. 최소공배수의 배수는 공배수와 같아요. 공배수는 두 수의 배수라서 최소공배수는 두 수보다 작을 수 없어요.",
  steps: [
    { name: "만져 보기 — 이벤트가 시작하는 때", inst: "방송 담당 태오가 이벤트 시간표를 짜요. 장터를 연 순간 두 이벤트를 함께 시작하고, 그다음부터 풍선 이벤트는 4분마다, 뽑기 이벤트는 6분마다 다시 시작해요. 24분까지 두 이벤트가 시작하는 때에 각각 ○표 하세요.", hints: ["풍선 이벤트는 4분, 8분, 12분, … 후에 시작해요.", "뽑기 이벤트는 6분, 12분, 18분, … 후에 시작해요."],
      render: (b, a) => fm2Rows(b, a, { common: true, rows: [
        { label: "풍선(분 후)", nums: fm2Range(1, 24), want: fm2MultsTo(4, 24), what: "풍선 이벤트가 시작하는 때", why: v => `풍선 이벤트는 4분마다 시작해요. ${v}분 후에는 시작하지 않아요.`, miss: "4분, 8분, …처럼 4분씩 늘려 가요." },
        { label: "뽑기(분 후)", nums: fm2Range(1, 24), want: fm2MultsTo(6, 24), what: "뽑기 이벤트가 시작하는 때", why: v => `뽑기 이벤트는 6분마다 시작해요. ${v}분 후에는 시작하지 않아요.`, miss: "6분, 12분, …처럼 6분씩 늘려 가요." }],
        say1: "두 이벤트가 함께 시작하는 때를 눌러 이어요.", notBoth: "두 이벤트가 함께 시작하는 때가 아니에요.", found: "두 이벤트가 동시에 시작하는 때(분 후): ",
        ask: [
          { q: "24분까지 두 이벤트가 다시 동시에 시작하는 때를 모두 써 보세요.", set: fm2Both(fm2MultsTo(4, 24), fm2MultsTo(6, 24)), unit: "분 후" },
          { q: "처음으로 다시 동시에 시작하는 때는 몇 분 후인가요?", a: fm2Lcm(4, 6), unit: "분 후", why: { "24": "24분 후에도 동시에 시작하지만 그보다 먼저 동시에 시작하는 때가 있어요.", "2": "2분 후에는 어느 이벤트도 시작하지 않아요. 2는 4와 6의 최대공약수예요." } }],
        ok: "12분 후, 24분 후에 동시에 시작하고, 처음으로 다시 동시에 시작하는 때는 12분 후예요." }) },
    { name: "약속하기 — 공배수와 최소공배수", inst: "6과 8의 공통된 배수를 찾고 약속을 완성해 보세요.", hints: ["6의 배수: 6, 12, 18, 24, 30, 36, 42, 48", "8의 배수: 8, 16, 24, 32, 40, 48, 56, 64"],
      render: (b, a) => fm2Ask(b, a, [
        { q: "6의 배수를 가장 작은 수부터 8개 써 보세요.", set: fm2Mults(6, 8), ordered: true },
        { q: "8의 배수를 가장 작은 수부터 8개 써 보세요.", set: fm2Mults(8, 8), ordered: true },
        { q: "위에서 쓴 수 중 6과 8의 공통된 배수를 모두 써 보세요.", set: fm2Both(fm2Mults(6, 8), fm2Mults(8, 8)) },
        { q: "공통된 배수 중 가장 작은 수는?", a: fm2Lcm(6, 8), why: { "2": "2는 6과 8의 공약수예요. 배수는 6과 8보다 작을 수 없어요.", "48": "48도 공통된 배수이지만 더 작은 수가 있어요." } },
        { q: "24, 48, …는 6의 배수도 되고 8의 배수도 돼요. 6과 8의 공통된 배수인 24, 48, …를 6과 8의 □라고 해요.", o: ["공배수", "공약수", "최소공배수"], a: 0 },
        { q: "공배수 중에서 가장 작은 수인 24를 6과 8의 □라고 해요.", o: ["최소공배수", "최대공약수", "공배수"], a: 0 }],
        { ok: "6과 8의 공배수는 24, 48, …이고, 최소공배수는 24예요." }) },
    { name: "말해 보기 — 공배수와 최소공배수의 관계", inst: "8의 배수와 12의 배수예요. 두 줄에 모두 있는 수를 눌러 같은 수끼리 이어 보세요. 다 이으면 저절로 확인해요.", hints: ["두 줄에 모두 있는 수가 8과 12의 공배수예요.", "24, 48, 72는 24의 배수예요."],
      render: thenWhy((b, a) => fm2Rows(b, a, { mode: "link", common: true, say1: "8의 배수와 12의 배수 중 두 줄에 모두 있는 수(공배수)를 눌러 이어요.", notBoth: "두 줄에 모두 있는 수가 아니에요.",
        rows: [{ label: "8의 배수", nums: fm2Mults(8, 10) }, { label: "12의 배수", nums: fm2Mults(12, 10) }], found: "8과 12의 공배수(여기까지): ",
        ask: [
          { q: "8과 12의 최소공배수는?", a: fm2Lcm(8, 12), why: { "96": "8 × 12 = 96도 공배수이지만 가장 작은 공배수는 아니에요.", "4": "4는 8과 12의 최대공약수예요." } },
          { q: "최소공배수 24의 배수를 가장 작은 수부터 3개 써 보세요.", set: fm2Mults(24, 3), ordered: true },
          { q: "알게 된 점으로 알맞은 것은?", o: ["최소공배수의 배수는 공배수와 같아요.", "최소공배수의 약수는 공배수와 같아요.", "공배수는 3개뿐이에요."], a: 0, why: { "2": "공배수는 셀 수 없이 많아요. 여기에서는 80까지만 보았을 뿐이에요." } }],
        ok: "8과 12의 공배수 24, 48, 72, …는 최소공배수 24의 배수와 같아요." }),
        { q: "‘최소’공배수인데 왜 8과 12보다 작은 수가 될 수 없을까요?", ph: "공배수는 8의 배수이면서 ~", help: ["① 8의 배수 중 가장 작은 수와 12의 배수 중 가장 작은 수를 떠올려요. → ② 공배수가 그보다 작아질 수 있는지 생각해요.", "‘공배수는 8의 배수이면서 12의 배수라서 ~보다 작을 수 없어요.’ 꼴로 써요."],
          ans: "공배수는 8의 배수이면서 12의 배수예요. 12의 배수 중 가장 작은 수가 12이므로 공배수는 12보다 작을 수 없고, 그래서 최소공배수 24도 8과 12보다 커요." }) },
    { name: "확인하기 — 공배수 찾고 설명하기", inst: "공배수와 최소공배수를 구하고, 예린이의 말이 맞는지 판단해요. 그리고 아래에 내 생각을 써요. 두 가지를 모두 해야 계단을 올라요.", hints: ["9의 배수: 9, 18, 27, 36, … / 12의 배수: 12, 24, 36, …", "4와 6의 최소공배수는 12이고, 4 × 6 = 24예요."],
      render: (b, a) => { fm2Ask(b, a, [
        { q: "9와 12의 최소공배수는?", a: fm2Lcm(9, 12), why: { "108": "9 × 12 = 108도 공배수이지만 가장 작은 공배수는 아니에요.", "3": "3은 9와 12의 최대공약수예요." } },
        { q: "10과 15의 공배수를 가장 작은 수부터 3개 써 보세요.", set: fm2Mults(fm2Lcm(10, 15), 3), ordered: true, why: { "150": "10 × 15 = 150도 공배수이지만 그보다 작은 공배수가 있어요." } },
        { q: "예린: ‘최소공배수는 항상 두 수를 곱한 수야.’ 이 말은?", o: ["틀렸어요. 4와 6의 최소공배수는 24가 아니라 12예요.", "맞아요. 두 수를 곱하면 언제나 최소공배수예요."], a: 0, why: { "1": "4 × 6 = 24는 4와 6의 공배수이지만, 12가 더 작은 공배수예요." } }],
        { ok: "9와 12의 최소공배수는 36, 10과 15의 공배수는 30, 60, 90이에요. 두 수의 곱이 최소공배수가 아닐 때가 많아요." });
        writeStep(b, a, [
          { q: "공배수와 최소공배수를 장터 이벤트 시간표로 설명해 보세요.", tag: "설명", ph: "풍선 이벤트와 뽑기 이벤트가 ~", help: ["① 4분마다, 6분마다 시작하는 두 이벤트를 떠올려요. → ② 동시에 시작하는 때가 공배수, 그중 처음이 최소공배수예요.", "‘두 이벤트가 동시에 시작하는 때는 4와 6의 ~이고, 처음으로 동시에 시작하는 12분 후는 ~예요.’ 꼴로 써요."],
            ans: "두 이벤트가 동시에 시작하는 12분 후, 24분 후, …는 4와 6의 공배수이고, 처음으로 동시에 시작하는 12분 후의 12는 4와 6의 최소공배수예요." }]); } }
  ],
  challenge: { inst: "★ 도전 — 장터 날 학교 앞에서 마을버스는 8분마다, 학교 셔틀은 12분마다 출발해요. 두 차가 오전 10시에 동시에 출발했어요. 수직선에 두 차가 출발하는 때를 차례로 눌러 보세요(0은 오전 10시, 수는 몇 분 후).", hints: ["마을버스는 8분 후, 16분 후, …에 출발해요.", "8과 12의 최소공배수를 구하면 몇 분마다 동시에 출발하는지 알 수 있어요."],
    render: (b, a) => fm2Hop(b, a, { max: 48, snap: 4, lab: 8, zero: "오전 10시", hops: [{ n: 8, count: 6, name: "마을버스" }, { n: 12, count: 4, name: "셔틀" }], ask: [
      { q: "두 차는 몇 분마다 동시에 출발하나요?", a: fm2Lcm(8, 12), unit: "분", why: { "48": "48분 후에도 동시에 출발하지만 그보다 먼저 동시에 출발하는 때가 있어요.", "96": "8 × 12 = 96은 공배수이지만 가장 작은 공배수가 아니에요.", "4": "4는 8과 12의 최대공약수예요." } },
      { q: "다음번에 두 차가 동시에 출발하는 시각은?", o: ["오전 10시 24분", "오전 10시 48분", "오전 10시 8분"], a: 0, why: { "1": "48분 후는 두 번째로 동시에 출발하는 때예요.", "2": "10시 8분에는 마을버스만 출발해요." } }],
    ok: "8과 12의 최소공배수는 24이므로 24분마다 동시에 출발해요. 다음번은 오전 10시 24분이에요!" }) }
},
{
  id: "s7", no: 7, title: "최소공배수를 빠르게 구해요", soop: "개념 구축하기(O)",
  question: "배수를 모두 늘어놓지 않고도 최소공배수를 구할 수 있을까요?",
  summary: "두 수를 여러 수의 곱으로 나타낸 식에서 공통으로 들어 있는 수는 한 번만 곱하고, 공통이 아닌 남은 수를 곱하면 최소공배수예요. 또는 공약수로 더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수와 마지막 몫을 모두 곱해요. 12와 20의 최소공배수는 2 × 2 × 3 × 5 = 60이에요.",
  steps: [
    { name: "만져 보기 — 곱으로 나타내기", inst: "장터 날 무대 공연은 12분마다, 퀴즈 방송은 20분마다 시작해요. 12와 20을 여러 수의 곱으로 나타내어 최소공배수를 구해 봐요. 다 하면 10과 15도 같은 방법으로 구해요.", hints: ["12 = 2 × 2 × 3, 20 = 2 × 2 × 5예요.", "공통으로 들어 있는 2 × 2는 한 번만 곱하고, 남은 3과 5를 곱해요."],
      render: ruleFirst((b, a) => fm2Tree(b, a, { goal: "lcm", pairs: [[12, 20], [10, 15]], ask: [
        { q: "12의 배수 12, 24, 36, 48, 60과 20의 배수 20, 40, 60에서 찾은 최소공배수는?", a: fm2Lcm(12, 20) },
        { q: "여러 수의 곱으로 나타낸 식으로 최소공배수를 구하는 방법은?", o: ["공통으로 들어 있는 수는 한 번만 곱하고, 공통이 아닌 남은 수를 곱해요.", "식에 있는 수를 모두 곱해요.", "공통으로 들어 있는 수만 곱해요."], a: 0, why: { "1": "그러면 공통인 수를 두 번 곱하게 돼요.", "2": "그것은 최대공약수를 구하는 방법이에요." } }],
        ok: "12와 20의 최소공배수는 2 × 2 × 3 × 5 = 60, 10과 15의 최소공배수는 5 × 2 × 3 = 30이에요." }),
        { q: "12 = 2 × 2 × 3, 20 = 2 × 2 × 5를 이용하면 최소공배수를 어떻게 구할 수 있을지 예상해요.", ph: "내 규칙: 공통인 수는 ~, 남은 수는 ~", help: ["① 두 식에 공통으로 들어 있는 수를 찾아요. → ② 12의 배수이면서 20의 배수가 되려면 어떤 수들이 꼭 들어 있어야 할지 생각해요.", "‘내 규칙: 공통인 수는 ~ 곱하고, 공통이 아닌 남은 수를 ~.’ 꼴로 써요."],
          ans: "공통으로 들어 있는 2 × 2는 한 번만 곱하고, 공통이 아닌 남은 수 3과 5를 곱해요. 2 × 2 × 3 × 5 = 60이 최소공배수예요." }) },
    { name: "그려 보기 — 공약수로 나누기", inst: "공약수로 나누어 12와 20의 최소공배수를 구해 봐요. 다 하면 10과 15도 구해요.", hints: ["12와 20은 둘 다 2로, 그다음 몫 6과 10도 둘 다 2로 나누어떨어져요.", "나눈 공약수와 마지막 몫을 모두 곱해요(ㄴ자 모양)."],
      render: (b, a) => fm2Ladder(b, a, { goal: "lcm", pairs: [[12, 20], [10, 15]], ask: [
        { q: "12와 20을 최대공약수 4로 한 번에 나누면 몫은 3과 5예요. 최소공배수 4 × 3 × 5 =", a: 4 * 3 * 5 },
        { q: "공약수로 나누어 최소공배수를 구하는 방법은?", o: ["더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수와 마지막 몫을 모두 곱해요.", "나눈 공약수만 모두 곱해요.", "마지막 몫만 곱해요."], a: 0, why: { "1": "그것은 최대공약수를 구하는 방법이에요.", "2": "마지막 몫 3과 5만 곱하면 15라서 12의 배수가 아니에요." } }],
        ok: "12와 20의 최소공배수는 60, 10과 15의 최소공배수는 30이에요. 두 가지 방법의 답이 같아요." }) },
    { name: "말해 보기 — 예린이의 실수", inst: "예린이는 12 = 2 × 2 × 3, 20 = 2 × 2 × 5이니까 최소공배수는 2 × 2 × 3 × 2 × 2 × 5 = 240이라고 했어요. 무엇이 잘못되었는지 골라 보세요.", hints: ["240은 12 × 20과 같아요.", "공통으로 들어 있는 2 × 2를 몇 번 곱했는지 살펴봐요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "예린이의 계산에서 잘못된 점은?", o: ["공통으로 들어 있는 2 × 2를 두 번 곱했어요.", "공통이 아닌 3과 5를 곱했어요.", "12를 여러 수의 곱으로 잘못 나타냈어요."], a: 0, why: { "1": "공통이 아닌 남은 수 3과 5는 곱해야 해요.", "2": "12 = 2 × 2 × 3은 바르게 나타낸 식이에요." } },
        { q: "240은 12와 20의 무엇일까요?", o: ["공배수이지만 최소공배수는 아니에요.", "최소공배수예요.", "공배수가 아니에요."], a: 0, why: { "1": "60이 240보다 작은 공배수예요.", "2": "240 ÷ 12 = 20, 240 ÷ 20 = 12로 나누어떨어지니 공배수예요." } }],
        { ok: "공통인 2 × 2는 한 번만 곱해야 해요. 2 × 2 × 3 × 5 = 60이 최소공배수이고, 240은 60의 4배인 공배수예요." }),
        { q: "공통으로 들어 있는 수를 한 번만 곱해도 되는 까닭은 무엇일까요?", ph: "2 × 2 × 3 × 5에는 이미 ~", help: ["① 2 × 2 × 3 × 5 = 60 안에 12(= 2 × 2 × 3)가 들어 있는지 살펴봐요. → ② 20(= 2 × 2 × 5)도 들어 있는지 살펴봐요.", "‘2 × 2 × 3 × 5에는 이미 12와 20이 모두 ~ 있어서, 2 × 2를 또 곱하면 ~.’ 꼴로 써요."],
          ans: "2 × 2 × 3 × 5에는 이미 12(2 × 2 × 3)와 20(2 × 2 × 5)이 모두 들어 있어서 60은 12와 20의 배수예요. 2 × 2를 또 곱하면 더 큰 공배수가 될 뿐이에요." }) },
    { name: "약속하기 — 최소공배수 구하는 방법", inst: "최소공배수를 구하는 두 가지 방법을 정리해요.", hints: ["공통인 수는 한 번만 곱해요.", "공약수로 나누기에서는 ㄴ자 모양으로 곱해요."],
      render: (b, a) => blanks(b, a, ["방법 1: 두 수를 여러 수의 곱으로 나타낸 식에서 공통으로 들어 있는 수는 ", { o: ["한 번만", "두 번"], a: 0 }, " 곱하고, 공통이 아닌 남은 수를 ", { o: ["곱해요", "빼요"], a: 0 }, ". 방법 2: 두 수를 공약수로 더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수와 ", { o: ["마지막 몫", "처음 두 수"], a: 0 }, "을 모두 곱해요."], { ok: "공통인 수는 한 번만, 남은 수는 모두 곱하면 최소공배수예요." }) },
    { name: "확인하기 — 최소공배수 구하기", inst: "최소공배수를 구해 보세요. 다 쓰면 저절로 확인해요.", hints: ["9 = 3 × 3, 15 = 3 × 5", "14 = 2 × 7, 21 = 3 × 7"],
      render: (b, a) => fm2Ask(b, a, [
        { q: "9와 15의 최소공배수는?", a: fm2Lcm(9, 15), why: { "135": "9 × 15는 공통인 3을 두 번 곱한 수예요.", "3": "3은 최대공약수예요." } },
        { q: "14와 21의 최소공배수는?", a: fm2Lcm(14, 21), why: { "294": "14 × 21은 공통인 7을 두 번 곱한 수예요.", "7": "7은 최대공약수예요." } },
        { q: "어떤 두 수의 최소공배수가 16이에요. 두 수의 공배수를 가장 작은 수부터 3개 써 보세요.", set: fm2Mults(16, 3), ordered: true },
        { q: "6과 15의 공배수 중에서 100보다 작은 수는 몇 개인가요?", a: fm2MultsTo(fm2Lcm(6, 15), 99).length, unit: "개" }],
        { ok: "최소공배수를 구하고, 최소공배수의 배수로 공배수도 찾았어요!" }) }
  ],
  challenge: { inst: "★ 도전 — 공약수로 나눈 식의 빈칸을 채워 보세요.", hints: ["2 ) 40 ㉠ 아래 줄의 15는 ㉠ ÷ 2예요.", "㉡ = 40 ÷ 2, ㉢ = ㉡ ÷ 5예요."], render: (b, a) => fm2Ask(b, a, [
    { q: "㉠은?", a: 15 * 2, fig: fm2sLadderFig([{ d: 2, a: 40, b: "㉠" }, { d: 5, a: "㉡", b: 15 }], ["㉢", 3]) },
    { q: "㉡은?", a: 40 / 2 },
    { q: "㉢은?", a: 40 / 2 / 5 },
    { q: "40과 ㉠의 최대공약수는?", a: fm2Gcd(40, 30) },
    { q: "40과 ㉠의 최소공배수는?", a: fm2Lcm(40, 30), why: { "10": "10은 최대공약수예요. 마지막 몫 4와 3까지 곱해요.", "1200": "40 × 30은 공배수이지만 가장 작은 공배수가 아니에요." } }],
    { ok: "㉠ 30, ㉡ 20, ㉢ 4이고, 40과 30의 최대공약수는 10, 최소공배수는 2 × 5 × 4 × 3 = 120이에요!" }) }
},
{
  id: "s8", no: 8, title: "장터 자리를 배치해요 ― 생각을 더하다", soop: "개념 구축하기(O)",
  question: "의자를 몇 개씩 몇 줄로 놓는 방법은 모두 몇 가지일까요?",
  summary: "몇 개씩 몇 줄로 남김없이 똑같이 놓는 방법의 가짓수는 그 수의 약수의 개수와 같아요. 의자 48개는 48의 약수가 10개라서 10가지, 컵 60개는 60의 약수가 12개라서 12가지 방법으로 놓을 수 있어요.",
  steps: [
    { name: "이해해요", inst: "장터 손님이 앉을 의자와 진열대를 배치해요. 서진이의 메모를 읽고 문제를 이해해요.", hints: ["메모의 조건 1, 2, 3을 차례로 읽어 봐요.", "구하려는 것은 메모의 마지막 줄에 있어요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "구하려는 것은 무엇인가요?", fig: () => fm2sNote("📝 서진이의 자리 배치 메모", ["조건 1. 우리 반은 6개 모둠이에요.", "조건 2. 모둠마다 의자를 8개씩 가져와요.", "조건 3. 진열대에 놓을 종이컵은 60개예요.", "의자와 종이컵을 각각 몇 개씩 몇 줄로 남김없이 똑같이 놓는 방법은 몇 가지일까?"]),
          o: ["의자와 종이컵을 각각 몇 개씩 몇 줄로 놓는 방법의 가짓수", "우리 반 모둠의 수", "진열대의 길이"], a: 0 },
        { q: "모둠의 수", a: 6, unit: "개" },
        { q: "모둠마다 가져오는 의자의 수", a: 8, unit: "개" },
        { q: "종이컵의 수", a: 60, unit: "개" }], { ok: "문제를 이해했어요. 이제 어떻게 해결할지 계획해요." }) },
    { name: "계획해요", inst: "문제를 어떻게 해결할지 계획해요.", hints: ["모둠마다 의자를 8개씩, 6개 모둠이에요.", "‘몇 개씩 몇 줄’로 남김없이 똑같이 놓으려면 그 수를 나누어떨어지게 하는 수를 찾아요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "의자의 수는 어떻게 구할까요?", o: ["모둠마다 가져오는 의자 수와 모둠의 수를 곱해요.", "모둠마다 가져오는 의자 수와 모둠의 수를 더해요."], a: 0, why: { "1": "8개씩 6모둠이니 곱해요." } },
        { q: "의자의 수 8 × 6 =", a: 8 * 6, unit: "개", why: { "14": "8과 6을 더했어요. 8개씩 6모둠이니 곱해요." } },
        { q: "놓는 방법의 가짓수는 무엇을 이용해 구할까요?", o: ["그 수의 약수", "그 수의 배수"], a: 0, why: { "1": "정해진 수를 몇 개씩 똑같이 나누어 놓는 것이니 약수를 이용해요." } },
        { q: "‘6개씩 8줄’과 ‘8개씩 6줄’은?", o: ["서로 다른 방법으로 세어요.", "같은 방법이라 한 번만 세어요."], a: 0, why: { "1": "한 줄에 놓는 수가 다르니 다른 배치예요. 따로 세어요." } }],
        { ok: "의자 48개와 종이컵 60개의 약수를 이용해 놓는 방법을 구해요." }) },
    { name: "해결해요 ① 의자", inst: "의자 48개를 한 줄에 똑같은 수씩 놓는 방법을 모두 찾아요. 한 줄에 놓는 수를 바꾸어 가며 모든 줄이 꽉 차면 저절로 기록돼요. 수를 직접 써도 돼요.", hints: ["48 ÷ 1, 48 ÷ 2, 48 ÷ 3, …이 나누어떨어지는지 살펴봐요.", "48 = 1 × 48 = 2 × 24 = 3 × 16 = 4 × 12 = 6 × 8"],
      render: (b, a) => fm2Rect(b, a, { n: 48, item: "의자", unit: "개", start: 5, color: FM2.blue, tip: "의자 48개를 한 줄에 똑같은 수씩 놓아요. 모든 줄이 똑같이 꽉 차면 저절로 기록돼요.", ask: [
        { q: "48의 약수를 모두 써 보세요.", set: FM2_D(48), why: { miss: "48 = 1 × 48 = 2 × 24 = 3 × 16 = 4 × 12 = 6 × 8처럼 짝 지어 찾아봐요." } },
        { q: "의자를 놓는 방법은 몇 가지인가요?", a: FM2_D(48).length, unit: "가지", why: { "5": "‘6개씩 8줄’과 ‘8개씩 6줄’처럼 바꾼 것도 따로 세어요." } }],
        ok: "48의 약수는 1, 2, 3, 4, 6, 8, 12, 16, 24, 48로 10개예요. 의자는 10가지 방법으로 놓을 수 있어요." }) },
    { name: "해결해요 ② 종이컵", inst: "종이컵 60개를 한 줄에 똑같은 수씩 놓는 방법은 몇 가지인지 구해 보세요.", hints: ["60 = 1 × 60 = 2 × 30 = 3 × 20 = 4 × 15 = 5 × 12 = 6 × 10", "약수의 개수를 세어요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "60의 약수를 모두 써 보세요.", set: FM2_D(60), why: { "7": "60 ÷ 7 = 8 … 4예요.", "8": "60 ÷ 8 = 7 … 4예요.", "9": "60 ÷ 9 = 6 … 6이에요.", miss: "60 = 1 × 60 = 2 × 30 = 3 × 20 = 4 × 15 = 5 × 12 = 6 × 10처럼 짝 지어 찾아봐요." } },
        { q: "종이컵을 놓는 방법은 몇 가지인가요?", a: FM2_D(60).length, unit: "가지", why: { "6": "곱셈식은 6개이지만, 한 곱셈식에서 두 가지 방법이 나와요." } }],
        { ok: "60의 약수는 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60으로 12개예요. 종이컵은 12가지 방법으로 놓을 수 있어요." }) },
    { name: "되돌아봐요", inst: "문제를 해결한 과정을 되돌아봐요.", hints: ["어떤 차례로 해결했는지 떠올려 봐요.", "약수를 짝 지어 찾으면 빠뜨리지 않아요."],
      render: (b, a) => writeStep(b, a, [
        { q: "어떤 방법으로 해결했는지 설명해 보세요.", tag: "방법", ph: "예: 의자 수를 8 × 6 = 48로 구하고, 48의 약수의 개수를 세었어요.", help: ["① 의자 수를 어떻게 구했는지 써요. → ② 놓는 방법의 가짓수를 무엇으로 셌는지 써요.", "‘먼저 ~을 구하고, 그 수의 ~의 개수를 세었어요.’ 꼴로 써요."], ans: "먼저 의자 수를 8 × 6 = 48로 구하고, 48의 약수 1, 2, 3, 4, 6, 8, 12, 16, 24, 48을 짝 지어 찾아 10가지라고 세었어요." },
        { q: "약수와 배수 중 무엇을 이용했고, 왜 그랬는지 써 보세요.", tag: "까닭", ph: "예: 의자를 몇 개씩 똑같이 나누어 놓아야 하니까 약수를 이용했어요.", help: ["① 정해진 수를 나누는 일인지, 몇 배씩 늘어나는 일인지 생각해요. → ② 그래서 무엇을 이용했는지 써요.", "‘정해진 ~개를 몇 개씩 똑같이 나누어 놓는 일이라서 ~를 이용했어요.’ 꼴로 써요."], ans: "정해진 48개를 몇 개씩 남김없이 똑같이 나누어 놓는 일이라서 48을 나누어떨어지게 하는 수인 약수를 이용했어요." }]) }
  ],
  challenge: { inst: "★ 도전 — 6학년 형님 반에서 탁자 36개를 빌려주었어요. 탁자를 몇 개씩 몇 줄로 남김없이 똑같이 놓는 방법을 구해 보세요.", hints: ["36 = 1 × 36 = 2 × 18 = 3 × 12 = 4 × 9 = 6 × 6", "6 × 6은 한 가지 방법이에요."], render: (b, a) => fm2Ask(b, a, [
    { q: "36의 약수를 모두 써 보세요.", set: FM2_D(36) },
    { q: "탁자를 놓는 방법은 몇 가지인가요?", a: FM2_D(36).length, unit: "가지", why: { "10": "‘6개씩 6줄’은 바꾸어도 같은 방법이라 한 번만 세어요." } },
    { q: "탁자를 4줄로 놓으면 한 줄에 몇 개씩인가요?", a: 36 / 4, unit: "개" }],
    { ok: "36의 약수는 9개라서 탁자는 9가지 방법으로 놓을 수 있어요!" }) }
},
{
  id: "s9", no: 9, title: "준비단 회의 ― 무엇을 구해야 할까?", soop: "탐구 정리하기(O)",
  question: "언제 최대공약수를 구하고, 언제 최소공배수를 구할까요?",
  summary: "‘남김없이 똑같이 최대한 많이 나누기’, ‘가장 큰 정사각형으로 자르기’처럼 두 수를 함께 나누는 상황은 최대공약수를, ‘다시 동시에’, ‘처음으로 같아지는 때’처럼 두 수가 되풀이되며 만나는 상황은 최소공배수를 이용해요. 공약수로 나누기 하나로 최대공약수와 최소공배수를 함께 구할 수 있어요.",
  steps: [
    { name: "만져 보기 — 문제 나누기", inst: "장터 준비단이 해결할 문제를 모았어요. 최대공약수로 해결하는 문제와 최소공배수로 해결하는 문제로 나누어 보세요.", hints: ["두 가지를 함께 똑같이 나누면 최대공약수예요.", "되풀이되다가 다시 동시에 만나는 때는 최소공배수예요."],
      render: thenWhy((b, a) => fm2Sort(b, a, { bins: ["최대공약수로 해결해요", "최소공배수로 해결해요"], cards: [
        { t: "귤 45개와 사과 30개를 최대한 많은 봉지에 남김없이 똑같이 나누어 담기", b: 0 },
        { t: "가로 18 cm, 세로 12 cm 도화지를 가장 큰 정사각형으로 남김없이 자르기", b: 0 },
        { t: "공책 48권과 색연필 60자루를 최대한 많은 모둠에 똑같이 나누어 주기", b: 0 },
        { t: "4분마다, 6분마다 시작하는 이벤트가 다시 동시에 시작하는 때", b: 1, why: "되풀이되다가 다시 동시에 시작하는 때는 4와 6의 공배수, 처음은 최소공배수예요." },
        { t: "빨간 전구는 4초마다, 초록 전구는 10초마다 깜박일 때 처음으로 동시에 깜박이는 때", b: 1, why: "4초마다, 10초마다 되풀이되며 만나는 때이니 최소공배수예요." },
        { t: "8분마다, 12분마다 출발하는 두 차가 다시 동시에 출발하는 때", b: 1, why: "다시 동시에 출발하는 때는 8과 12의 최소공배수예요." }],
        ok: "함께 똑같이 나누는 문제는 최대공약수, 되풀이되다가 다시 만나는 문제는 최소공배수예요." }),
        { q: "문제에 어떤 말이 있으면 최대공약수를, 어떤 말이 있으면 최소공배수를 떠올리면 좋을까요?", ph: "‘~’이 있으면 최대공약수, ‘~’이 있으면 최소공배수", help: ["① 최대공약수 상자에 넣은 카드에 공통으로 나오는 말을 찾아요. → ② 최소공배수 상자의 카드에 공통으로 나오는 말을 찾아요.", "‘“~”라는 말이 있으면 최대공약수, “~”라는 말이 있으면 최소공배수를 떠올려요.’ 꼴로 써요."],
          ans: "‘최대한 많이 남김없이 똑같이 나누기’, ‘가장 큰’이 있으면 최대공약수, ‘다시 동시에’, ‘처음으로 함께’가 있으면 최소공배수를 떠올려요." }) },
    { name: "그려 보기 — 한 번에 두 가지 구하기", inst: "공약수로 나누기 하나로 최대공약수와 최소공배수를 함께 구해 봐요. 24와 40을 구한 다음 18과 27도 구해요.", hints: ["24와 40은 2, 2, 2로 차례로 나누거나 8로 한 번에 나눌 수 있어요.", "최대공약수는 왼쪽의 수만, 최소공배수는 왼쪽의 수와 마지막 몫까지 곱해요."],
      render: (b, a) => fm2Ladder(b, a, { goal: "both", pairs: [[24, 40], [18, 27]], ok: `24와 40: 최대공약수 ${fm2Gcd(24, 40)}, 최소공배수 ${fm2Lcm(24, 40)} / 18과 27: 최대공약수 ${fm2Gcd(18, 27)}, 최소공배수 ${fm2Lcm(18, 27)}이에요.` }) },
    { name: "말해 보기 — 헷갈리는 말 바로잡기", inst: "준비단 친구들이 회의에서 한 말이에요. 옳은 말을 모두 골라 보세요.", hints: ["최대공약수는 두 수의 약수라서 두 수보다 클 수 없어요.", "최소공배수는 두 수의 배수라서 두 수보다 작을 수 없어요."],
      render: (b, a) => quiz(b, a, [
        { q: "옳은 말을 모두 고르세요.", o: ["서진: 최대공약수는 두 수 중 작은 수보다 클 수 없어.", "민호: 최소공배수는 언제나 두 수를 곱한 수야.", "예린: 최소공배수의 배수는 모두 공배수야.", "태오: 공약수 중 가장 작은 수는 언제나 1이야.", "하윤: ‘최소’공배수니까 두 수보다 작은 수야."], a: [0, 2, 3], why: { "1": "4와 6의 최소공배수는 12이지만 4 × 6 = 24예요.", "4": "공배수는 두 수의 배수라서 두 수보다 작을 수 없어요. 4와 6의 최소공배수 12는 4와 6보다 커요." } }],
        { ok: "최대공약수는 두 수보다 클 수 없고, 최소공배수는 두 수보다 작을 수 없어요." }) },
    { name: "약속하기 — 약수와 배수 정리", inst: "배운 내용을 정리해요. 빈칸에 알맞은 수를 쓰고 알맞은 말을 골라 보세요.", hints: ["12의 약수: 1, 2, 3, 4, 6, 12", "4와 6의 공배수: 12, 24, 36, …"],
      render: (b, a) => fm2Ask(b, a, [
        { q: "12의 약수: 1, 2, 3, 4,", post: ", 12", a: 6 },
        { q: "18의 약수 1, 2, 3, 6, 9, 18과 견주면 12와 18의 최대공약수:", a: fm2Gcd(12, 18) },
        { q: "4와 6의 공배수: 12,", post: ", 36, …", a: 24 },
        { q: "4와 6의 최소공배수:", a: fm2Lcm(4, 6) },
        { q: "‘어떤 수를 나누어떨어지게 하는 수’는?", o: ["약수", "배수"], a: 0 },
        { q: "‘어떤 수를 1배, 2배, 3배, … 한 수’는?", o: ["약수", "배수"], a: 1 }],
        { ok: "약수·공약수·최대공약수, 배수·공배수·최소공배수를 잘 정리했어요." }) },
    { name: "확인하기 — 장터 문제 해결하기", inst: "장터 준비 문제를 해결해 보세요.", hints: ["귤 45개와 사과 30개 → 45와 30의 최대공약수", "4초마다와 10초마다 → 4와 10의 최소공배수. 1분은 60초예요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "귤 45개와 사과 30개를 최대한 많은 봉지에 남김없이 똑같이 나누어 담으려면 봉지는 몇 개 필요한가요?", a: fm2Gcd(45, 30), unit: "개", why: { [fm2Lcm(45, 30)]: "90은 최소공배수예요. 똑같이 나누는 상황이니 최대공약수를 구해요.", "5": "5봉지에도 나눌 수 있지만 더 많은 봉지에 나눌 수 있어요." } },
        { q: "그때 한 봉지에 귤은 몇 개씩인가요?", a: 45 / fm2Gcd(45, 30), unit: "개" },
        { q: "빨간 전구는 4초마다, 초록 전구는 10초마다 깜박여요. 지금 동시에 깜박였다면 몇 초 후에 다시 동시에 깜박일까요?", a: fm2Lcm(4, 10), unit: "초", why: { "40": "4 × 10 = 40초 후에도 동시에 깜박이지만 그보다 먼저 동시에 깜박여요.", "2": "2는 4와 10의 최대공약수예요." } },
        { q: "지금 동시에 깜박인 뒤 1분 동안 두 전구는 동시에 몇 번 더 깜박일까요?", a: Math.floor(60 / fm2Lcm(4, 10)), unit: "번", why: { "2": "1분 = 60초예요. 20초, 40초, 60초를 모두 세어요." } }],
        { ok: "귤과 사과는 15봉지에 나누어 담고, 두 전구는 20초마다 동시에 깜박여 1분 동안 3번 더 동시에 깜박여요." }) }
  ],
  challenge: { inst: "★ 도전 — 보기의 조각 중 한 가지 조각만 골라 8칸, 12칸으로 이루어진 장식 띠를 모두 채우려고 해요. 조각을 하나씩 놓아 본 다음 답해요.", hints: ["한 가지 조각만 써야 해요. 여러 조각을 섞으면 안 돼요.", "8과 12의 공약수 길이의 조각이면 두 띠를 모두 채울 수 있어요."],
    render: (b, a) => fm2Strip(b, a, { strips: [8, 12], pieces: FM2_STRIP, ask: [
      { q: "두 장식 띠를 모두 채울 수 있는 조각을 모두 고르세요.", o: FM2_STRIP.map(p => `${p.k} ${p.n}칸`), a: FM2_STRIP.map((p, i) => (8 % p.n === 0 && 12 % p.n === 0) ? i : -1).filter(i => i >= 0), why: { "2": "㉢(3칸)으로는 8칸을 채울 수 없어요.", "4": "㉤(5칸)으로는 두 띠 모두 채울 수 없어요.", "5": "㉥(6칸)으로는 8칸을 채울 수 없어요." } }],
      ok: "㉠, ㉡, ㉣로 두 띠를 모두 채울 수 있어요. 1, 2, 4는 8과 12의 공약수예요." }) }
},
{
  id: "s10", no: 10, title: "장터 놀이 부스 ― 약수와 배수 이어달리기", soop: "발표하기(P)",
  question: "앞 사람이 고른 수의 약수나 배수를 찾아 이어 갈 수 있을까요?",
  summary: "앞 사람이 고른 수의 약수나 배수 중 아직 ×표 하지 않은 수를 골라 ×표 해요. 약수는 그 수를 나누어떨어지게 하는 수, 배수는 그 수를 1배, 2배, 3배, … 한 수예요. 상대가 고를 수 있는 수가 적게 남도록 생각하면 잘할 수 있어요.",
  steps: [
    { name: "놀이 방법 알기", inst: "하윤이가 놀이 부스에서 손님에게 알려 줄 놀이 방법이에요. 차례대로 눌러 보세요.", hints: ["먼저 색연필을 고르고 순서를 정해요.", "×표 할 수 있는 수가 없을 때까지 계속해요."],
      render: (b, a) => sequence(b, a, ["① 서로 다른 색의 색연필을 고르고 가위바위보로 순서를 정해요.", "② 첫 번째 사람은 놀이판에서 25보다 작은 수 하나에 ×표 해요.", "③ 다음 사람은 ‘약수’나 ‘배수’를 외치고, 앞 사람이 고른 수의 약수나 배수 하나에 ×표 해요.", "④ ×표 할 수 있는 수가 없을 때까지 차례대로 계속해요."], [0, 1, 2, 3], { ok: "놀이 방법을 알았어요. 이미 ×표 된 수에는 표시할 수 없어요." }) },
    { name: "규칙 알기", inst: "놀이 규칙을 확인해요. 놀이판에는 1부터 50까지의 수가 있어요.", hints: ["18의 약수는 18을 나누어떨어지게 하는 수예요.", "이미 ×표 된 수에는 표시할 수 없어요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "첫 번째 사람이 고를 수 있는 수는?", o: ["25보다 작은 수", "25보다 큰 수", "아무 수나"], a: 0 },
        { q: "첫 번째 사람이 18에 ×표 했어요. 다음 사람이 ‘약수!’를 외쳤다면 ×표 할 수 있는 수를 모두 써 보세요.", set: FM2_D(18).filter(v => v !== 18), why: { "18": "18은 이미 ×표 되어 있어요.", "36": "36은 18의 배수예요." } },
        { q: "‘배수!’를 외쳤다면 놀이판(1~50)에서 ×표 할 수 있는 수를 모두 써 보세요.", set: fm2MultsTo(18, 50).filter(v => v !== 18), why: { "18": "18은 이미 ×표 되어 있어요.", "54": "54는 놀이판에 없어요." } }],
        { ok: "18의 약수 1, 2, 3, 6, 9나 18의 배수 36에 ×표 할 수 있어요." }) },
    { name: "놀이하기", inst: "놀이 부스를 열기 전에 컴퓨터와 약수와 배수 이어달리기를 해 보세요. 놀이를 끝까지 하면 계단을 올라요.", hints: ["앞 사람이 고른 수를 나누어떨어지게 하는 수는 약수예요.", "앞 사람이 고른 수에 2, 3, …을 곱한 수는 배수예요."],
      render: (b, a) => fm2Game(b, a, { max: 50, first: 25, level: "easy" }) },
    { name: "전략 생각하기", inst: "놀이를 잘하려면 어떤 수에 ×표 할지 잘 생각해야 해요. 놀이판(1~50)을 떠올리며 답하고, 아래에 손님에게 알려 줄 비법을 써요. 두 가지를 모두 해야 계단을 올라요.", hints: ["19의 약수는 1과 19, 19의 배수는 19, 38, 57, …이에요.", "47의 약수는 1과 47이고, 47의 배수 94는 놀이판에 없어요."],
      render: (b, a) => { fm2Ask(b, a, [
        { q: "앞 사람이 19에 ×표 했어요. 다음 사람이 ×표 할 수 있는 수를 모두 써 보세요(다른 수는 아직 ×표 하지 않았어요).", set: [...FM2_D(19), ...fm2MultsTo(19, 50)].filter(v => v !== 19) },
        { q: "앞 사람이 47에 ×표 했고, 1에는 이미 ×표 되어 있어요. 다음 사람은 어떻게 될까요?", o: ["×표 할 수 있는 수가 없어요.", "94에 ×표 해요.", "7에 ×표 해요."], a: 0, why: { "1": "94는 놀이판에 없어요.", "2": "7은 47의 약수도 배수도 아니에요." } },
        { q: "1에 ×표 하면 다음 사람은 어떤 수를 고를 수 있을까요?", o: ["×표 하지 않은 아무 수나(모든 수는 1의 배수예요)", "1의 약수만"], a: 0 }],
        { ok: "상대가 고를 수 있는 수가 적게 남도록 생각하면 놀이를 잘할 수 있어요." });
        writeStep(b, a, [
          { q: "놀이 부스 손님에게 알려 줄 ‘이기는 비법’을 써 보세요.", tag: "비법", ph: "약수와 배수가 적은 수를 ~", help: ["① 상대가 고를 수 있는 수가 적게 남는 수를 떠올려요(예: 47, 1). → ② 그런 수를 언제 고르면 좋은지 써요.", "‘약수와 배수가 ~ 수를 고르면 상대가 ~해서 이기기 쉬워요.’ 꼴로 써요."],
            ans: "놀이판 안에 약수와 배수가 거의 없는 수(예: 1이 이미 ×표 되었을 때의 47)를 고르면 상대가 ×표 할 수 있는 수가 없어서 이기기 쉬워요. 반대로 1을 고르면 상대가 아무 수나 고를 수 있으니 조심해요." }]); } }
  ],
  challenge: { inst: "★ 도전 — 조금 더 잘하는 컴퓨터와 겨루어 이겨 보세요. 상대가 ×표 할 수 있는 수가 없게 만들면 이겨요.", hints: ["1을 고르면 상대는 아무 수나 고를 수 있어요.", "약수와 배수가 거의 없는 수(예: 41, 43, 47처럼 큰 수)를 노려 봐요."],
    render: (b, a) => fm2Game(b, a, { max: 50, first: 25, level: "normal", needWin: true }) }
},
{
  id: "s11", no: 11, title: "학급 장터 날! 배운 것을 발표해요", soop: "발표하기(P)",
  question: "장터를 준비하며 배운 약수와 배수를 친구들에게 설명할 수 있나요?",
  summary: "약수는 어떤 수를 나누어떨어지게 하는 수, 배수는 어떤 수를 1배, 2배, 3배, … 한 수예요. 두 수의 공통된 약수 중 가장 큰 수가 최대공약수, 공통된 배수 중 가장 작은 수가 최소공배수예요. ‘최대한 많이 똑같이 나누기’는 최대공약수, ‘다시 동시에’는 최소공배수를 이용해요.",
  steps: [
    { name: "만져 보기 — 장터 결산", inst: "드디어 장터 날이에요! 장터를 마치고 남은 것을 정리해요.", hints: ["56 = 1 × 56 = 2 × 28 = 4 × 14 = 7 × 8", "배수 중 가장 작은 수는 자기 자신이에요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "남은 쿠키 56개를 봉지에 남김없이 똑같이 나누어 담을 수 있는 봉지의 수를 모두 써 보세요.", set: FM2_D(56), unit: "개", why: { "3": "56 ÷ 3 = 18 … 2예요.", "6": "56 ÷ 6 = 9 … 2예요.", miss: "56 = 1 × 56 = 2 × 28 = 4 × 14 = 7 × 8처럼 짝 지어 찾아봐요." } },
        { q: "장터에서 하루에 7장씩 쿠폰을 나누어 주었어요. 날수에 따라 나누어 준 쿠폰 수(7의 배수)를 가장 작은 수부터 5개 써 보세요.", set: fm2Mults(7, 5), ordered: true, why: { "0": "배수 중 가장 작은 수는 자기 자신(7)이에요." } },
        { q: "35 = 5 × 7이에요. ‘5와 7은 35의 □예요.’", o: ["약수", "배수"], a: 0 },
        { q: "‘35는 5와 7의 □예요.’", o: ["약수", "배수"], a: 1 }],
        { ok: "약수와 배수를 정확하게 구하고 둘의 관계도 알아요!" }) },
    { name: "그려 보기 — 최대공약수와 최소공배수", inst: "공약수로 나누어 두 수의 최대공약수와 최소공배수를 구해 보세요. 36과 48을 구한 다음 45와 60도 구해요.", hints: ["36과 48은 12로 한 번에 나눌 수 있어요.", "45와 60은 3과 5로 차례로 나눌 수 있어요."],
      render: (b, a) => fm2Ladder(b, a, { goal: "both", pairs: [[36, 48], [45, 60]], ok: `36과 48: 최대공약수 ${fm2Gcd(36, 48)}, 최소공배수 ${fm2Lcm(36, 48)} / 45와 60: 최대공약수 ${fm2Gcd(45, 60)}, 최소공배수 ${fm2Lcm(45, 60)}이에요.` }) },
    { name: "말해 보기 — 장터 발표", inst: "장터를 준비하며 배운 것을 반 친구들 앞에서 발표하려고 해요. 발표할 내용을 써 보세요.", hints: ["선물 꾸러미를 만들 때 무엇을 구했는지 떠올려요.", "이벤트 시간표를 짤 때 무엇을 구했는지 떠올려요."],
      render: (b, a) => writeStep(b, a, [
        { q: "최대공약수를 장터 준비의 어디에 썼는지 발표해 보세요.", tag: "최대공약수", ph: "사탕 18개와 젤리 12개로 ~", help: ["① 어떤 물건을 똑같이 나누었는지 떠올려요. → ② 최대공약수가 무엇을 알려 주었는지 써요.", "‘○○와 △△를 최대한 많은 ~에 똑같이 나누려고 두 수의 최대공약수 ~를 구했어요.’ 꼴로 써요."], ans: "사탕 18개와 젤리 12개를 최대한 많은 꾸러미에 남김없이 똑같이 나누려고 18과 12의 최대공약수 6을 구해서 6꾸러미를 만들었어요." },
        { q: "최소공배수를 장터 준비의 어디에 썼는지 발표해 보세요.", tag: "최소공배수", ph: "4분마다, 6분마다 시작하는 이벤트가 ~", help: ["① 되풀이되는 두 가지 일을 떠올려요. → ② 최소공배수가 무엇을 알려 주었는지 써요.", "‘□분마다, △분마다 하는 일이 다시 동시에 시작하는 때를 알려고 최소공배수 ~를 구했어요.’ 꼴로 써요."], ans: "4분마다, 6분마다 시작하는 두 이벤트가 다시 동시에 시작하는 때를 알려고 4와 6의 최소공배수 12를 구해서 12분 후라고 방송했어요." }]) },
    { name: "확인하기 — 장터 수익 나눔", inst: "장터 수익으로 산 물건을 이웃 학교에 보내요. 문제를 해결해 보세요.", hints: ["‘최대한 많은 상자에 남김없이 똑같이’는 최대공약수예요.", "72와 96은 24로 한 번에 나눌 수 있어요."],
      render: (b, a) => fm2Ask(b, a, [
        { q: "공책 72권과 연필 96자루를 최대한 많은 상자에 남김없이 똑같이 나누어 담으려면 상자는 몇 개 필요한가요?", a: fm2Gcd(72, 96), unit: "개", why: { [fm2Lcm(72, 96)]: "288은 72와 96의 최소공배수예요. 똑같이 나누는 상황이니 최대공약수를 구해요.", "12": "12상자에도 나눌 수 있지만 더 많은 상자에 나눌 수 있어요.", "8": "8상자에도 나눌 수 있지만 더 많은 상자에 나눌 수 있어요." } },
        { q: "그때 한 상자에 공책은 몇 권, 연필은 몇 자루인가요? 공책:", a: 72 / fm2Gcd(72, 96), unit: "권" },
        { q: "연필:", a: 96 / fm2Gcd(72, 96), unit: "자루" }],
        { ok: "공책 72권과 연필 96자루는 24상자에 공책 3권, 연필 4자루씩 담아요." }) },
    { name: "되돌아보기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["약수와 배수를 배우기 전의 생각을 떠올려요.", "쿠키 나누기, 이벤트 시간표, 공약수로 나누기를 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "배우기 전의 생각", ex: ["예전에는 쿠키를 몇 봉지에 똑같이 나눌 수 있는지 하나씩 다 나누어 봐야 한다고 생각했어요.", "예전에는 최소공배수는 ‘최소’라서 두 수보다 작은 수라고 생각했어요."] },
          { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 쿠키 수의 약수를 구하면 나눌 수 있는 봉지 수를 모두 알 수 있다고 생각해요.", "지금은 최소공배수가 두 수의 배수라서 두 수보다 작을 수 없다는 것을 알아요."] },
          { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["쿠키를 봉지에 직접 담아 보고 나누어떨어지는 수만 된다는 것을 알고 바뀌었어요.", "이벤트 시간표에 ○표 해 보고 두 이벤트가 12분 후에 처음 만나는 것을 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "★★ 도전 — 하윤이가 과학 책에서 매미 이야기를 읽었어요. 미국에는 13년마다 나타나는 매미와 17년마다 나타나는 매미가 있는데, 2024년에 두 매미가 동시에 나타났대요.", hints: ["13과 17의 최소공배수를 구해요.", "13과 17은 1 말고는 공약수가 없어요. 그래서 최소공배수는 13 × 17이에요."],
    render: (b, a) => fm2Ask(b, a, [
      { q: "두 매미는 몇 년마다 동시에 나타날까요?", fig: fm2sCicadaFig, a: fm2Lcm(13, 17), unit: "년", why: { "30": "13과 17을 더했어요. 13의 배수이면서 17의 배수인 수를 찾아요.", "1": "1은 13과 17의 최대공약수예요." } },
      { q: "다음에 두 매미가 다시 동시에 나타나는 해는?", a: 2024 + fm2Lcm(13, 17), unit: "년" },
      { q: "6과 9의 최소공배수는 18이고 6 × 9 = 54예요. 13과 17의 최소공배수가 13 × 17과 같은 까닭은?", o: ["13과 17의 공약수가 1뿐이라서 공통으로 들어 있는 수가 없어요.", "두 수가 모두 홀수라서 그래요."], a: 0, why: { "1": "9와 15는 둘 다 홀수이지만 최소공배수 45는 9 × 15 = 135가 아니에요." } }],
      { ok: "두 매미는 221년마다 동시에 나타나서 다음에는 2245년에 만나요. 단원을 끝까지 해냈어요!" }) }
}
];
