//@@APP
const APP = {title:"과학 축제 준비 위원회", unit:"4-1 수학 3. 곱셈과 나눗셈", key:"s41-muldiv-v1", welcome:"과학 축제 준비 위원회에 온 것을 환영해요", intro:"우리 반이 학교 과학 축제를 준비하며 체험 키트를 주문하고, 재료를 똑같이 나누고, 예산을 어림해요."};
//@@UNIT
/* ===== 3. 곱셈과 나눗셈 — 이야기 버전 조작 부품 (앞글자 d3s) =====
   교과서 버전(units/u3-muldiv.tb.js)의 d3 부품을 옮겨 와 '확인하기' 단추 없이 저절로 확인하게 고쳤어요(autoRun).
   기다리는 시간: 수 입력 900ms · 보기 고르기 260ms · 끌어 놓기 1200ms. 칸을 다 채워야 확인해요. */
const D3S_SOFT = "#FDEBD9", D3S_PSOFT = "#E3F1EA", D3S_GRAY = "#B9C4C0", D3S_BSOFT = "#DCEBFA", D3S_RED = "#D9534F";
const D3S_COLS = ["#F6C9A6", "#BFDDF5", "#CDE8C4", "#F3D3E7", "#F7E3A1", "#D6CCF2"];
function d3sStyle() {
  if (document.getElementById("d3s-style")) return;
  const s = document.createElement("style"); s.id = "d3s-style";
  s.textContent = `
.d3swrap{display:flex;gap:1.2em;flex-wrap:wrap;align-items:flex-start}
.d3sv{display:inline-block;border:3px solid var(--night);border-radius:var(--r);padding:.5em .9em;background:#fff;font-family:Jua,sans-serif;max-width:100%;overflow-x:auto}
.d3sttl{font-size:var(--fs);color:var(--pine);margin-bottom:.2em}
.d3srow{display:flex;align-items:center}
.d3srow.d3sline{border-top:3px solid var(--ink);margin:.12em 0}
.d3sc{flex:none;width:1.45em;height:1.45em;display:inline-flex;align-items:center;justify-content:center;font-size:calc(var(--fs)*1.4)}
.d3sc.d3stop{border-top:3px solid var(--ink)}
.d3sc.d3sfade{color:#9AA7A3}
.d3sc.d3shl{color:var(--tent)}
.d3sc.d3sbrk{line-height:1;transform:scaleY(1.35)}
.d3slab{font-size:var(--fs-s);color:var(--muted);margin-left:.5em;white-space:nowrap;font-family:"Gowun Dodum",sans-serif}
.d3srow.d3sthin .d3sc{height:.3em}
.d3srow.d3sact{background:var(--ring-soft);border-radius:.4em}
input.d3scell{flex:none;box-sizing:border-box;width:1.45em;height:1.45em;margin:0;padding:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);border:2px solid var(--line);border-radius:.3em}
input.d3scell:disabled{background:#F3F5F4;border-style:dashed;opacity:.6}
.d3scalc{display:flex;flex-wrap:wrap;align-items:center;gap:.35em .5em}
.d3sqr{display:inline-flex;flex-direction:column;align-items:center;font-size:var(--fs-s);color:var(--muted)}
input.d3snum{width:5.2em;font-size:1.15em;text-align:center}
input.d3snum.d3sw6{width:6.4em}
.d3schk{background:var(--pine-soft);border-radius:.6em;padding:.3em .6em;margin-top:.3em}
.d3sest{background:var(--ring-soft);border-radius:.6em;padding:.4em .6em}
.d3scards{display:flex;gap:.5em;flex-wrap:wrap}
.d3scards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2.2em;text-align:center}
.d3sslots{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.5);letter-spacing:.05em}
.d3stbl{border-collapse:collapse}
.d3stbl td{border:1px solid var(--line);padding:.2em .5em;text-align:center}
.d3stbl tr.d3spick td{background:var(--pine-soft)}
.d3slog{font-size:var(--fs-s);max-height:8em;overflow:auto}
.d3swait{font-size:var(--fs-s);color:var(--muted);border:2px dashed var(--line);border-radius:.6em;padding:.4em .6em}
.d3snote{font-size:var(--fs-s);color:var(--muted)}
`;
  document.head.append(s);
}
/* 받침에 맞는 조사: d3sJ(374, "을를") → "374를",  d3sP(374, "을를") → "를" */
function d3sJ(w, pair) {
  const s = String(w), c = s[s.length - 1];
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"] };
  const [a, b] = M[pair];
  if (pair === "으로") return s + (has && !rieul ? a : b);
  return s + (has ? a : b);
}
const d3sP = (w, pair) => d3sJ(w, pair).slice(String(w).length);
const d3sAdd = (el, ...k) => el.append(...k.filter(x => x != null));
const d3sPad = (v, L) => { const s = String(v); return Array.from({ length: L }, (_, k) => k < L - s.length ? "" : s[k - (L - s.length)]); };
const d3sIn = (p, r) => p.x >= r[0] && p.x <= r[0] + r[2] && p.y >= r[1] && p.y <= r[1] + r[3];
const d3sFilled = i => String(i.value).trim() !== "";
/* 입력칸을 바꿀 때마다 저절로 확인(fire)하고, Enter는 칸을 벗어나 바로 확인 */
function d3sWatch(els, fire) {
  els.forEach(i => { i.addEventListener("input", fire); i.addEventListener("change", fire);
    i.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); i.blur(); fire(); } }); });
}
/* 칸을 덜 채운 채 멈추면 저절로 확인이 열리지 않으므로, 몇 초 뒤 알려 준다. need()가 알려 줄 글을 돌려주면 그 글을 보여 줌(같은 입력에는 한 번만) */
function d3sSlow(api, els, need, wait) {
  let t = null, said = null;
  const go = () => { clearTimeout(t); t = setTimeout(() => {
    const m = need(); if (!m) return;
    const sg = els.map(i => i.value).join("|"); if (sg === said) return;
    said = sg; api.hint(m);
  }, wait || 3500); };
  els.forEach(i => i.addEventListener("input", go));
}
function d3sCell(label) {
  const i = h("input", { type: "text", inputmode: "numeric", maxlength: 1, autocomplete: "off", class: "d3scell", "aria-label": label || "숫자 칸" });
  i.addEventListener("input", () => { i.value = i.value.replace(/[^0-9]/g, "").slice(-1); });
  return i;
}
function d3sC(t, cls) { return h("span", { class: "d3sc" + (cls ? " " + cls : "") }, t == null || t === "" ? "​" : String(t)); }   /* 빈 칸에도 글자(폭 0)를 넣어 덮개가 숨기지 않게 */
function d3sNum(label, wide) {
  return h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "d3snum" + (wide ? " d3sw6" : ""), "aria-label": label });
}
const d3sVal = inp => { const s = String(inp.value).replace(/[\s,]/g, ""); return s === "" ? null : (/^\d+$/.test(s) ? Number(s) : NaN); };
const d3sPaint = (inp, good) => { inp.style.borderColor = good ? "var(--ok)" : "var(--no)"; };
/* 칸 줄 채점: want(글자 배열)과 같은지 */
function d3sRowCheck(ins, want) {
  const got = ins.map(x => x.value.trim());
  const same = got.every((g, k) => g === want[k]);
  ins.forEach((x, k) => d3sPaint(x, x.value.trim() === want[k]));
  return { same, text: got.join("") || "-" };
}
const d3sDigits = want => want.filter(x => x !== "").length;
/* 먼저 어림하기 상자: e = {q, o:[], a, ok, why:{i:"까닭"}} — 고르면 바로 확인 */
function d3sEstBox(api, e, onOk) {
  const row = h("div", { class: "opts" });
  let ok = false;
  e.o.forEach((c, i) => row.append(h("button", { class: "opt", onclick: ev => {
    if (ok) return;
    [...row.children].forEach(x => x.classList.remove("good", "bad", "on"));
    if (i === e.a) { ok = true; ev.currentTarget.classList.add("good"); api.hint(e.ok || "좋아요. 이제 정확하게 구해 봐요."); onOk(); }
    else { ev.currentTarget.classList.add("bad"); api.fail((e.why && e.why[i]) || "가까운 몇백, 몇십으로 바꾸어 어림해 봐요.", "[어림] " + c); }
  } }, c)));
  return h("div", { class: "d3sest" }, h("div", { class: "jua" }, "먼저 어림해요 · " + e.q), row);
}

/* ① 곱셈·나눗셈 계산 칸 — 칸을 다 채우면 저절로 확인 (나눗셈은 몫과 나머지를 따로 써요)
   items: {mul:[a,b], q, unit, why:{값:"까닭"}} | {div:[n,d], q, names:["몫 이름","나머지 이름"], units:["",""], chk:true, why:{"몫,나머지":"까닭"}} | {q, a, unit, why}
   opt: ok, words */
function d3sCalc(body, api, items, opt = {}) {
  d3sStyle();
  const rows = [], wrap = h("div");
  items.forEach(it => {
    const box = h("div", { class: "qitem d3scalc" });
    const R = { it, box };
    if (it.div) {
      const [n, d] = it.div;
      R.n = n; R.d = d; R.qa = Math.floor(n / d); R.ra = n % d;
      R.qi = d3sNum((it.names && it.names[0]) || "몫"); R.ri = d3sNum((it.names && it.names[1]) || "나머지");
      d3sAdd(box, it.q ? h("span", { class: "jua" }, it.q) : null, h("span", { class: "jua" }, `${n} ÷ ${d} =`),
        h("span", { class: "d3sqr" }, h("span", {}, (it.names && it.names[0]) || "몫"), R.qi), (it.units && it.units[0]) ? h("span", {}, it.units[0]) : null,
        h("span", { class: "jua" }, "…"),
        h("span", { class: "d3sqr" }, h("span", {}, (it.names && it.names[1]) || "나머지"), R.ri), (it.units && it.units[1]) ? h("span", {}, it.units[1]) : null);
      if (it.chk) {
        R.c1 = d3sNum("확인하는 곱", true); R.c2 = d3sNum("확인하는 합", true);
        R.echo = h("span", {}, "□");
        R.chkBox = h("div", { class: "d3schk", style: "display:none" }, h("span", { class: "jua" }, "계산이 맞는지 확인해요 · "),
          h("span", {}, `${d} × ${R.qa} = `), R.c1, h("span", {}, " , "), R.echo, h("span", {}, ` + ${R.ra} = `), R.c2);
        R.c1.addEventListener("input", () => { R.echo.textContent = R.c1.value || "□"; });
        box.append(R.chkBox);
      }
    } else if (it.mul) {
      const [a, b] = it.mul; R.a = a * b;
      R.inp = d3sNum(`${a} × ${b}`, true);
      d3sAdd(box, it.q ? h("span", { class: "jua" }, it.q) : null, h("span", { class: "jua" }, `${a} × ${b} =`), R.inp, it.unit ? h("span", {}, it.unit) : null);
    } else {
      R.a = it.a; R.inp = d3sNum(it.q, true);
      d3sAdd(box, h("span", { class: "jua" }, it.q), R.inp, it.unit ? h("span", {}, it.unit) : null);
    }
    rows.push(R); wrap.append(box);
  });
  const ansText = R => R.it.div ? `${R.n} ÷ ${R.d} = ${R.qa}${R.ra ? ` … ${R.ra}` : ""}` : R.it.mul ? `${R.it.mul[0]} × ${R.it.mul[1]} = ${R.a}` : `${R.it.q} ${R.a}`;
  api.provide({ words: opt.words || ["몫", "나머지", "나누는 수"], answers: rows.map(ansText) });
  let chkPhase = false;
  const divMsg = (R, qv, rv) => {
    const { n, d, qa, it } = R;
    const key = `${qv},${rv}`;
    if (it.why && it.why[key]) return it.why[key];
    if (qv == null || isNaN(qv)) return `${n} ÷ ${d}의 몫을 써요.`;
    if (rv != null && !isNaN(rv) && rv >= d) {
      if (d * qv + rv === n) return `${d} × ${qv} + ${rv} = ${n}이라 맞아 보이지만, 나머지 ${rv}${d3sP(rv, "이가")} 나누는 수 ${d}보다 크거나 같아요. ${d3sJ(d, "을를")} 한 번 더 뺄 수 있으니 몫을 1 크게 해요.`;
      return `나머지는 언제나 나누는 수 ${d}보다 작아야 해요.`;
    }
    if (d * qv > n) return `${d} × ${qv} = ${d * qv}${d3sP(d * qv, "은는")} ${n}보다 커서 뺄 수 없어요. 몫을 작게 해요.`;
    if (qv === qa) return `몫은 맞았어요. 나머지는 ${n} − ${d} × ${d3sJ(qa, "으로")} 구해요.`;
    return `${d}에 몇을 곱해야 ${n}보다 크지 않으면서 ${n}에 가장 가까운지 생각해 봐요.`;
  };
  const mulMsg = (R, v) => {
    const it = R.it;
    if (it.why && it.why[String(v)]) return it.why[String(v)];
    if (it.mul && v != null && !isNaN(v)) {
      const [a, b] = it.mul, T = Math.floor(b / 10), O = b % 10;
      if (T > 0 && O > 0 && v === a * O + a * T) return `${a} × ${T * 10}의 곱을 한 자리 왼쪽으로 밀어 써야 해요. ${a} × ${T}${d3sP(T, "이가")} 아니라 ${a} × ${d3sJ(T * 10, "이에요")}.`;
      if (T > 0 && O === 0 && v === a * T) return `${a} × ${T}의 값을 10배 해야 ${a} × ${b}의 곱이 돼요.`;
    }
    return opt.bad || "빨간 칸을 다시 계산해 봐요.";
  };
  const mainIns = rows.flatMap(R => R.it.div ? [R.qi, R.ri] : [R.inp]);
  const chkRows = rows.filter(R => R.it.chk), chkIns = chkRows.flatMap(R => [R.c1, R.c2]);
  const judgeChk = () => {
    api.tryOnce();
    let bad = null;
    chkRows.forEach(R => {
      const v1 = d3sVal(R.c1), v2 = d3sVal(R.c2), g1 = v1 === R.d * R.qa, g2 = v2 === R.n;
      d3sPaint(R.c1, g1); d3sPaint(R.c2, g2);
      if (!bad && !g1) bad = `${R.d} × ${R.qa}${d3sP(R.qa, "을를")} 계산해 봐요.`;
      if (!bad && !g2) bad = `${R.d * R.qa} + ${R.ra}${d3sP(R.ra, "을를")} 계산해 봐요. 나누어지는 수 ${R.n}${d3sP(R.n, "이가")} 나오면 맞게 계산한 거예요.`;
    });
    const given = chkRows.map(R => `확인 ${R.c1.value}+${R.ra}=${R.c2.value}`).join(" / ");
    if (bad) { api.fail(bad, given); return false; }
    chkIns.forEach(i => i.disabled = true);
    api.done(rows.map(ansText).join(" / ") + " | " + given, opt.ok || "계산하고 맞는지 확인까지 했어요!");
    return true;
  };
  const judgeMain = () => {
    api.tryOnce();
    let firstBad = null; const given = [];
    rows.forEach(R => {
      if (R.it.div) {
        const qv = d3sVal(R.qi), rv = d3sVal(R.ri);
        const gq = qv === R.qa, gr = rv === R.ra;
        d3sPaint(R.qi, gq); d3sPaint(R.ri, gr);
        given.push(`${R.n}÷${R.d}=${R.qi.value || "-"}…${R.ri.value || "-"}`);
        if ((!gq || !gr) && !firstBad) firstBad = divMsg(R, qv, rv);
      } else {
        const v = d3sVal(R.inp), g = v === R.a; d3sPaint(R.inp, g);
        given.push(R.inp.value || "-");
        if (!g && !firstBad) firstBad = mulMsg(R, v);
      }
    });
    if (firstBad) { api.fail(firstBad, given.join(" / ")); return false; }
    mainIns.forEach(i => i.disabled = true);
    if (chkRows.length) {
      chkPhase = true;
      chkRows.forEach(R => { R.chkBox.style.display = ""; });
      api.hint("○ 맞았어요. 이제 ‘나누는 수 × 몫 + 나머지 = 나누어지는 수’가 되는지 확인해요.");
      return true;
    }
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요!");
    return true;
  };
  const autoMain = autoRun(() => !chkPhase && mainIns.every(d3sFilled), () => mainIns.map(i => i.value).join("|"), judgeMain, 900);
  const autoChk = autoRun(() => chkPhase && chkIns.every(d3sFilled), () => chkIns.map(i => i.value).join("|"), judgeChk, 900);
  d3sWatch(mainIns, autoMain); d3sWatch(chkIns, autoChk);
  d3sSlow(api, mainIns, () => !chkPhase && mainIns.some(d3sFilled) && rows.some(R => R.it.div && d3sFilled(R.qi) && !d3sFilled(R.ri)) ? "나머지 칸도 써요. 나머지가 없으면 나머지 칸에 0을 써요." : null);
  body.append(wrap, h("p", { class: "d3snote" }, (items.some(x => x.div) ? "나머지가 없으면 나머지 칸에 0을 써요. " : "") + "칸을 다 채우면 저절로 확인해요."));
}

/* ② 조각 이어 붙이기 (단원 도입): 길이 len인 트랙 조각을 1~max개 이어요  opt: len, max, unit, ask, ok, tip */
function d3sTrack(body, api, opt) {
  d3sStyle();
  const len = opt.len, max = opt.max || 20, U = opt.unit || "cm";
  let k = 1, seen = 1, shown = false;
  const top = Math.ceil(len * max / 500) * 500;
  const svg = makeSvg(900, 300);
  const X = v => 40 + v / top * 820;
  const ans = h("div", {}, h("p", { class: "d3swait" }, `트랙 조각을 ${max}개까지 이어 보면 물음이 나와요.`));
  const rng = h("input", { type: "range", min: 1, max, step: 1, value: 1, "aria-label": "이은 조각 수" });
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 20, y: 230, width: 860, height: 50, fill: "#EAF4E4" }));
    svg.append(svgEl("line", { x1: X(0), y1: 210, x2: X(top), y2: 210, stroke: INK, "stroke-width": 3 }));
    for (let v = 0; v <= top; v += 100) {
      const big = v % 500 === 0;
      svg.append(svgEl("line", { x1: X(v), y1: big ? 196 : 202, x2: X(v), y2: big ? 224 : 218, stroke: INK, "stroke-width": big ? 3 : 1.5 }));
      if (big) svg.append(txt(X(v), 248, String(v), 18));
    }
    svg.append(txt(X(top) - 10, 272, `(${U})`, 16));
    for (let i = 0; i < k; i++) {
      const x = X(i * len), w = X(len) - X(0);
      svg.append(svgEl("rect", { x, y: 160, width: w, height: 26, rx: 4, fill: i % 2 ? "#BFDDF5" : "#F7E3A1", stroke: PINE, "stroke-width": 1.5 }),
        svgEl("line", { x1: x + 3, y1: 168, x2: x + w - 3, y2: 168, stroke: "#8A9A94", "stroke-width": 2 }),
        svgEl("line", { x1: x + 3, y1: 178, x2: x + w - 3, y2: 178, stroke: "#8A9A94", "stroke-width": 2 }));
    }
    const g = svgEl("g", { transform: `translate(${X(k * len)},140)` });
    g.append(svgEl("rect", { x: -38, y: -12, width: 36, height: 18, rx: 6, fill: TENT, stroke: INK, "stroke-width": 2 }),
      svgEl("rect", { x: -30, y: -20, width: 18, height: 10, rx: 3, fill: "#BFDDF5", stroke: INK, "stroke-width": 1.5 }),
      svgEl("circle", { cx: -30, cy: 10, r: 6, fill: INK }), svgEl("circle", { cx: -10, cy: 10, r: 6, fill: INK }));
    svg.append(g);
    svg.append(txt(450, 40, `트랙 조각 ${len} ${U}를 ${k}개 이어 놓았어요 (${k}배)`, 24));
    rng.value = k;
  };
  const set = v => {
    k = Math.max(1, Math.min(max, v)); seen = Math.max(seen, k); draw();
    if (!shown && seen >= max) { shown = true; ans.innerHTML = ""; numbers(ans, api, opt.ask, { ok: opt.ok }); api.hint(`○ 조각을 ${max}개까지 이어 보았어요. 이제 물음에 답해요.`); }
  };
  rng.oninput = () => set(+rng.value);
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "막대를 움직여 트랙 조각을 몇 개 이을지 바꾸어 보세요."), rng,
    h("div", { class: "row" }, h("button", { class: "ghost", onclick: () => set(k - 1) }, "1개 빼기"), h("button", { class: "ghost", onclick: () => set(k + 1) }, "1개 더 잇기")), ans)));
}

/* ③ 봉지 세기: per개씩 k봉지가 세로 한 줄, cols줄  opt: per, k, cols, item, bag, ask, ok — 줄을 모두 세면 물음이 나와요 */
function d3sBundles(body, api, opt) {
  const per = opt.per, k = opt.k || 2, cols = opt.cols || 10, item = opt.item || "", bag = opt.bag || "묶음";
  const on = [];
  let shown = false;
  const svg = makeSvg(900, 400);
  const cw = 84, X0 = 30;
  const colR = c => [X0 + c * cw, 56, cw - 10, 270];
  const bundle = (x, y, hl) => {
    const g = svgEl("g");
    g.append(svgEl("path", { d: `M${x + 6},${y} L${x + 54},${y} L${x + 60},${y + 100} L${x},${y + 100}Z`, fill: hl ? "#fff" : "#FBFCFB", stroke: hl ? PINE : D3S_GRAY, "stroke-width": 2.5, "stroke-linejoin": "round" }));
    for (let i = 0; i < 4; i++) g.append(svgEl("line", { x1: x + 14 + i * 10, y1: y + 10, x2: x + 14 + i * 10, y2: y + 58, stroke: D3S_COLS[i % 6], "stroke-width": 5, "stroke-linecap": "round" }));
    g.append(txt(x + 30, y + 82, `${per}개`, 16));
    return g;
  };
  const ans = h("div", {}, h("p", { class: "d3swait" }, `세로 줄 ${cols}개를 모두 세면 물음이 나와요.`));
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(450, 26, `${item} ${per}개씩 ${k * cols}${bag} · 세로 한 줄은 ${k}${bag}`.trim(), 22));
    for (let c = 0; c < cols; c++) {
      const r = colR(c), idx = on.indexOf(c);
      svg.append(svgEl("rect", { x: r[0], y: r[1], width: r[2], height: r[3], rx: 12, fill: idx >= 0 ? D3S_PSOFT : "#fff", stroke: idx >= 0 ? PINE : D3S_GRAY, "stroke-width": 2.5, "stroke-dasharray": idx >= 0 ? "" : "7 6", style: "cursor:pointer" }));
      for (let j = 0; j < k; j++) svg.append(bundle(r[0] + 7, r[1] + 16 + j * 125, idx >= 0));
      if (idx >= 0) svg.append(txt(r[0] + r[2] / 2, 350, String(per * k * (idx + 1)), 18, { fill: PINE }));
    }
    svg.append(txt(450, 385, on.length ? `${per * k}씩 ${on.length}번 → ${per * k * on.length}개` : "세로 줄을 왼쪽부터 차례로 눌러 세어 보세요", 20, { fill: on.length ? TENT : INK }));
  };
  dragOn(svg, p => {
    const c = Array.from({ length: cols }, (_, i) => i).find(i => d3sIn(p, colR(i)));
    if (c != null) {
      const i = on.indexOf(c); if (i >= 0) on.splice(i); else on.push(c); draw();
      if (!shown && on.length === cols) { shown = true; ans.innerHTML = ""; numbers(ans, api, opt.ask, { ok: opt.ok }); api.hint(`○ ${per * k}씩 ${cols}번 세었어요. 이제 물음에 답해요.`); }
    }
    return false;
  }, () => {}, null);
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || `세로 한 줄은 ${per}개씩 ${k}${bag}예요. 줄을 차례로 눌러 세어 보세요. 다시 누르면 그 줄부터 지워져요.`),
    h("button", { class: "ghost", onclick: () => { on.length = 0; draw(); } }, "처음부터 세기"), ans)));
}

/* ④ 자리 옮기기: a × m 의 곱을 자릿값 표에 쓰고, 곱하는 수가 10배 되면 한 자리씩 왼쪽으로  opt: a, m, extra, ok */
function d3sTenShift(body, api, opt) {
  d3sStyle();
  const a = opt.a, m = opt.m, p = a * m;
  let phase = 0, dx = 0;
  const names = ["만", "천", "백", "십", "일"], CW = 110, X0 = 230;
  const svg = makeSvg(900, 330);
  const cx = c => X0 + c * CW + CW / 2;
  const draw = () => {
    svg.innerHTML = "";
    names.forEach((nm, c) => {
      svg.append(svgEl("rect", { x: X0 + c * CW, y: 20, width: CW, height: 50, fill: "#F2F6F4", stroke: D3S_GRAY, "stroke-width": 2 }), txt(cx(c), 46, nm + "의 자리", 18));
      svg.append(svgEl("rect", { x: X0 + c * CW, y: 70, width: CW, height: 110, fill: "#fff", stroke: D3S_GRAY, "stroke-width": 2 }));
      svg.append(svgEl("rect", { x: X0 + c * CW, y: 180, width: CW, height: 110, fill: "#fff", stroke: D3S_GRAY, "stroke-width": 2 }));
    });
    svg.append(txt(110, 125, `${a} × ${m}`, 26), txt(110, 235, `${a} × ${m * 10}`, 26, { fill: TENT }));
    const dg = d3sPad(p, 5);
    if (phase >= 1) {
      const row = svgEl("g", { style: "cursor:grab" });
      dg.forEach((ch, c) => { if (ch) row.append(svgEl("rect", { x: X0 + c * CW + 18, y: 88, width: CW - 36, height: 74, rx: 10, fill: D3S_BSOFT, stroke: BLUE, "stroke-width": 2 }), txt(cx(c), 126, ch, 40)); });
      if (phase === 1 && dx) row.setAttribute("transform", `translate(${dx},${Math.min(110, -dx * 1.1)})`);
      svg.append(row);
    } else svg.append(txt(X0 + 2.5 * CW, 126, "곱을 먼저 구해요", 24, { fill: "#9aa" }));
    if (phase >= 2) {
      d3sPad(p * 10, 5).forEach((ch, c) => { if (ch) svg.append(svgEl("rect", { x: X0 + c * CW + 18, y: 198, width: CW - 36, height: 74, rx: 10, fill: c === 4 ? D3S_SOFT : D3S_BSOFT, stroke: c === 4 ? TENT : BLUE, "stroke-width": 2 }), txt(cx(c), 236, ch, 40, { fill: c === 4 ? TENT : INK })); });
    } else if (phase === 1) svg.append(txt(X0 + 2.5 * CW, 236, "위의 숫자 줄을 끌어 한 칸 왼쪽 아래로", 20, { fill: "#9aa" }));
  };
  const ans = h("div");
  const shift = () => {
    if (phase !== 1) return; phase = 2; dx = 0; draw();
    api.hint(`곱하는 수가 ${m}에서 ${d3sJ(m * 10, "으로")} 10배가 되었어요. 숫자가 모두 한 자리씩 왼쪽으로 옮겨 가고 일의 자리에는 0이 생겨요.`);
    numbers(ans, api, [{ q: `② ${a} × ${m * 10} =`, a: p * 10, why: { [p]: `${a} × ${m}의 곱과 같아요. 곱하는 수가 10배이니 곱도 10배가 되어야 해요.` } }].concat(opt.extra || []),
      { ok: opt.ok || `${a} × ${m * 10} = ${p * 10}. (세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 10배 해요.` });
  };
  dragOn(svg, pt => phase === 1 && pt.y > 70 && pt.y < 180 ? (dx = 0, svg._sx = pt.x, true) : false,
    pt => { dx = Math.min(0, pt.x - svg._sx); draw(); },
    () => { if (dx < -CW * .5) shift(); else { dx = 0; draw(); } });
  const pin = d3sNum(`${a} × ${m}`, true);
  const firePin = autoRun(() => phase === 0 && d3sFilled(pin), () => pin.value, () => {
    api.tryOnce();
    const v = d3sVal(pin); d3sPaint(pin, v === p);
    if (v !== p) { api.fail(`${a} × ${d3sJ(m, "을를")} 다시 계산해 봐요. 일의 자리부터 곱하고 올림한 수를 더해요.`, `${a}×${m}=${pin.value}`); return false; }
    phase = 1; pin.disabled = true; draw(); api.hint("○ 맞았어요. 곱이 자릿값 표에 들어갔어요. 이제 곱하는 수를 10배 해 봐요."); return true;
  }, 900);
  d3sWatch([pin], firePin);
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "곱을 쓰면 표에 들어가요. 숫자 줄을 끌어 곱하는 수가 10배가 될 때 어떻게 되는지 보세요."),
    h("div", { class: "qitem d3scalc" }, h("span", { class: "jua" }, `① ${a} × ${m} =`), pin),
    h("button", { class: "ghost", onclick: () => phase === 1 ? shift() : api.hint(phase === 0 ? "먼저 ①의 곱을 구해요." : "이미 10배 했어요.") }, "10배 하기"), ans)));
}

/* ⑤ 직사각형 나누기: a × b 를 a × (몇십) + a × (몇) 으로 — 선을 놓으면 저절로 살펴봐요  opt: a, b, item, rowName, est:{q,o,a,why,ok}, ask, ok */
function d3sArea(body, api, opt) {
  d3sStyle();
  const a = opt.a, b = opt.b, T = Math.floor(b / 10) * 10, O = b % 10, RN = opt.rowName || "줄";
  let split = 0, splitOk = false, estOk = !opt.est, timer = null;
  const rh = Math.min(18, 330 / b), X0 = 170, W = 600, Y0 = 56, H = b * rh;
  const svg = makeSvg(900, Y0 + H + 50);
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(X0 + W / 2, 28, `${opt.item || ""} ${a}개씩 ${b}${RN}`.trim(), 26));
    svg.append(svgEl("rect", { x: X0, y: Y0, width: W, height: H, fill: "#fff", stroke: INK, "stroke-width": 2.5 }));
    if (split > 0) svg.append(svgEl("rect", { x: X0, y: Y0, width: W, height: split * rh, fill: D3S_BSOFT }), svgEl("rect", { x: X0, y: Y0 + split * rh, width: W, height: (b - split) * rh, fill: D3S_SOFT }));
    for (let i = 1; i < b; i++) svg.append(svgEl("line", { x1: X0, y1: Y0 + i * rh, x2: X0 + W, y2: Y0 + i * rh, stroke: "#C9D3CF", "stroke-width": 1 }));
    svg.append(svgEl("rect", { x: X0, y: Y0, width: W, height: H, fill: "none", stroke: INK, "stroke-width": 2.5 }));
    svg.append(txt(X0 - 70, Y0 + H / 2, `${b}${RN}`, 24));
    if (split > 0) {
      svg.append(txt(X0 + W / 2, Y0 + split * rh / 2, `${a} × ${split}`, Math.min(26, split * rh * .8), { fill: BLUE }),
        txt(X0 + W / 2, Y0 + split * rh + (b - split) * rh / 2, `${a} × ${b - split}`, Math.min(26, (b - split) * rh * .8), { fill: TENT }),
        txt(X0 - 22, Y0 + split * rh / 2, String(split), 18, { fill: BLUE }), txt(X0 - 22, Y0 + split * rh + (b - split) * rh / 2, String(b - split), 18, { fill: TENT }));
    }
    const yy = Y0 + split * rh;
    svg.append(svgEl("line", { x1: X0 - 8, y1: yy, x2: X0 + W + 30, y2: yy, stroke: splitOk ? PINE : TENT, "stroke-width": 5 }),
      svgEl("circle", { cx: X0 + W + 44, cy: yy, r: 16, fill: "#fff", stroke: splitOk ? PINE : TENT, "stroke-width": 4, style: "cursor:ns-resize" }),
      txt(X0 + W + 44, yy + 1, "↕", 16));
    svg.append(txt(X0 + W / 2, Y0 + H + 30, split > 0 ? `${d3sJ(split + RN, "과와")} ${d3sJ((b - split) + RN, "으로")} 나누었어요` : `주황 선을 아래로 끌어 ${d3sJ(b + RN, "을를")} 나누어요`, 22));
  };
  const ans = h("div");
  const trySplit = () => {
    if (splitOk || split === 0) return;
    if (!estOk) return api.hint("먼저 위에서 어림한 값을 골라요.");
    if (split !== T && split !== O) return api.hint(`${d3sJ(b + RN, "을를")} 계산하기 쉬운 몇십과 몇으로 나누어 봐요. ${b} = ${T} + ${d3sJ(O, "이에요")}.`);
    split = T; splitOk = true; draw();
    api.hint(`○ ${d3sJ(b + RN, "을를")} ${d3sJ(T + RN, "과와")} ${d3sJ(O + RN, "으로")} 나누었어요. 두 부분을 각각 계산해서 더해요.`);
    numbers(ans, api, opt.ask || [{ q: `${a} × ${T} =`, a: a * T }, { q: `${a} × ${O} =`, a: a * O }, { q: `${a} × ${b} =`, a: a * b, why: { [a * T]: `${a} × ${T}만 구했어요. ${a} × ${O}의 값도 더해요.` } }], { ok: opt.ok });
  };
  const pos = p => Math.max(1, Math.min(b - 1, Math.round((p.y - Y0) / rh)));
  dragOn(svg, p => { if (splitOk) return false; if (p.x < X0 - 10 || p.x > X0 + W + 70) return false; clearTimeout(timer); split = pos(p); draw(); return true; },
    p => { split = pos(p); draw(); },
    () => { clearTimeout(timer); timer = setTimeout(trySplit, 1200); });
  const side = h("div", { class: "side" });
  if (opt.est) side.append(d3sEstBox(api, opt.est, () => { estOk = true; trySplit(); }));
  side.append(h("p", {}, opt.tip || `주황 선을 끌어 ${b}${RN}을 계산하기 쉬운 두 묶음으로 나누어 보세요. 선을 놓으면 저절로 살펴봐요.`), ans);
  draw();
  body.append(stageWrap(svg, side));
}

/* ⑥ 세로셈 곱셈 (세 자리 수) × (몇십몇) 또는 × (몇십) — 한 줄씩, 칸을 채우면 저절로 확인  opt: a, b, title, ok, tip */
function d3sLongMul(body, api, opt) {
  d3sStyle();
  const a = opt.a, b = opt.b, T = Math.floor(b / 10), O = b % 10, p1 = a * O, p2 = a * T * 10, r = a * b, W = 5;
  const tensOnly = O === 0;
  const box = h("div", { class: "d3sv" }, h("div", { class: "d3sttl" }, opt.title || `${a} × ${b}`));
  const row = (cells, label, cls) => { const rr = h("div", { class: "d3srow" + (cls ? " " + cls : "") }); cells.forEach(c => rr.append(c)); const lb = h("span", { class: "d3slab" }, label || ""); rr.append(lb); rr._lab = lb; box.append(rr); return rr; };
  const bCells = d3sPad(b, W).map(ch => d3sC(ch));
  row([d3sC("")].concat(d3sPad(a, W).map(ch => d3sC(ch))));
  row([d3sC("×")].concat(bCells));
  box.append(h("div", { class: "d3srow d3sline" }));
  const stages = [];
  if (!tensOnly) {
    const i1 = Array.from({ length: W }, () => d3sCell("첫째 줄"));
    stages.push({ rowEl: row([d3sC("")].concat(i1), `← ${a} × ${O}`), ins: i1, want: d3sPad(p1, W), hl: [W - 1], name: "첫째 줄" });
    const i2 = Array.from({ length: W - 1 }, () => d3sCell("둘째 줄"));
    stages.push({ rowEl: row([d3sC("")].concat(i2, [d3sC("0", "d3sfade")]), `← ${a} × ${T * 10} (0은 생략할 수 있어요)`), ins: i2, want: d3sPad(p2 / 10, W - 1), hl: [W - 2], name: "둘째 줄" });
    box.append(h("div", { class: "d3srow d3sline" }));
    const i3 = Array.from({ length: W }, () => d3sCell("합"));
    stages.push({ rowEl: row([d3sC("")].concat(i3), "← 두 줄의 합"), ins: i3, want: d3sPad(r, W), hl: [], name: "합" });
  } else {
    const i1 = Array.from({ length: W }, () => d3sCell("곱"));
    stages.push({ rowEl: row([d3sC("")].concat(i1), `← ${a} × ${T}의 10배`), ins: i1, want: d3sPad(r, W), hl: [W - 2], name: "곱" });
  }
  let si = 0;
  const setStage = () => {
    stages.forEach((s, k) => { s.ins.forEach(x => x.disabled = k !== si); s.rowEl.classList.toggle("d3sact", k === si); });
    bCells.forEach((c, k) => c.classList.toggle("d3shl", si < stages.length && stages[si].hl.includes(k)));
    const f = stages[si] && stages[si].ins[stages[si].ins.length - 1]; if (f && si > 0) f.focus();
  };
  api.provide({ words: ["일의 자리", "십의 자리", "한 자리 왼쪽"], answers: [tensOnly ? `${a} × ${b} = ${r}` : `${a} × ${O} = ${p1}, ${a} × ${T * 10} = ${p2}, ${p1} + ${p2} = ${r}`] });
  const msgs = s => {
    if (s.name === "첫째 줄") return `${a} × ${O}의 값을 써요. 일의 자리부터 곱하고 올림한 수를 더해요.`;
    if (s.name === "둘째 줄") return `둘째 줄은 ${a} × ${d3sJ(T * 10, "이에요")}. ${a} × ${T}의 값을 일의 자리 0 앞에 써요.`;
    if (s.name === "합") return "두 줄의 수를 자리를 맞추어 더해 봐요. 받아올림에 주의해요.";
    return `${a} × ${T}의 값을 구하고 일의 자리에 0을 써요.`;
  };
  const judge = () => {
    api.tryOnce();
    const s = stages[si], res = d3sRowCheck(s.ins, s.want);
    if (!res.same) {
      const got = s.ins.map(x => x.value.trim()).join("");
      if (got && Number(got) === Number(s.want.join(""))) { api.fail("수는 맞았는데 자리가 어긋났어요. 일의 자리 숫자부터 오른쪽 칸에 맞추어 써요.", `${s.name} ${got}`); return false; }
      if (tensOnly && got && Number(got) === a * T) { api.fail(`${a} × ${T}의 값을 10배 해야 해요. 일의 자리에 0을 써요.`, `${s.name} ${got}`); return false; }
      api.fail(msgs(s), `${s.name} ${got || "-"}`); return false;
    }
    si++;
    if (si < stages.length) { setStage(); api.hint(`○ 맞았어요. 이제 ${stages[si].name}을 써요.`); return false; }
    setStage();
    api.done(stages.map(x => `${x.name} ${x.ins.map(i => i.value).join("")}`).join(" | "), opt.ok || `${a} × ${b} = ${r}. 정확해요!`);
    return true;
  };
  const fire = autoRun(() => si < stages.length && stages[si].ins.filter(d3sFilled).length >= d3sDigits(stages[si].want),
    () => si + ":" + stages[si].ins.map(x => x.value).join(","), judge, 900);
  stages.forEach(s => d3sWatch(s.ins, fire));
  d3sSlow(api, stages.flatMap(s => s.ins), () => {
    const s = stages[si]; if (!s) return null;
    const f = s.ins.filter(d3sFilled).length, need = d3sDigits(s.want);
    return f > 0 && f < need ? `아직 빈칸이 있어요. ${s.name}에는 숫자가 ${need}개 들어가요. 일의 자리부터 오른쪽 칸에 맞추어 써요.` : null;
  });
  setStage();
  body.append(h("p", { class: "inst" }, opt.tip || "색칠된 줄의 빈칸에 숫자를 한 개씩 써요. 그 줄을 다 쓰면 저절로 확인하고, 맞으면 다음 줄이 열려요."), h("div", { class: "d3swrap" }, box));
}

/* ⑦ 수 모형으로 나누기: (몇백몇십) ÷ (몇십)  opt: n, d, item, ask, ok — 다 묶으면 물음이 나와요 */
function d3sBlocks(body, api, opt) {
  const n = opt.n, d = opt.d, H = Math.floor(n / 100), Tn = Math.floor(n / 10) % 10, g = d / 10, total = n / 10;
  let broken = H === 0, shown = false;
  const grp = [];
  let sel = [], gcount = 0;
  const svg = makeSvg(900, 400);
  const PR = 18, BW = 24, BH = 170, bx = i => 46 + (i % PR) * 46, by = i => 80 + Math.floor(i / PR) * 210;
  const HS = BH, hundR = [40, 70, HS, HS], HX = i => hundR[0] + i * (HS + 30);
  const ten = (x, y, fill) => {
    const gg = svgEl("g");
    gg.append(svgEl("rect", { x, y, width: BW, height: BH, fill, stroke: INK, "stroke-width": 2 }));
    for (let k = 1; k < 10; k++) gg.append(svgEl("line", { x1: x, y1: y + k * BH / 10, x2: x + BW, y2: y + k * BH / 10, stroke: "#8BA79A" }));
    return gg;
  };
  const ans = h("div", {}, h("p", { class: "d3swait" }, `십 모형을 ${g}개씩 모두 묶으면 물음이 나와요.`));
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(450, 32, `${opt.item || ""} ${d3sJ(n + (opt.unit || ""), "을를")} ${d}${opt.unit || ""}씩 묶어요`.trim(), 26));
    if (!broken) {
      for (let i = 0; i < H; i++) {
        const x = HX(i), u = HS / 10;
        svg.append(svgEl("rect", { x, y: hundR[1], width: HS, height: HS, fill: "#F7E3A1", stroke: INK, "stroke-width": 2, style: "cursor:pointer" }));
        for (let k = 1; k < 10; k++) svg.append(svgEl("line", { x1: x, y1: hundR[1] + k * u, x2: x + HS, y2: hundR[1] + k * u, stroke: "#C9B26A" }), svgEl("line", { x1: x + k * u, y1: hundR[1], x2: x + k * u, y2: hundR[1] + HS, stroke: "#C9B26A" }));
      }
      for (let i = 0; i < Tn; i++) svg.append(ten(HX(H) + i * 40, hundR[1], "#F7E3A1"));
      svg.append(txt(450, 320, "백 모형을 눌러 십 모형 10개로 바꾸어 보세요", 24, { fill: TENT }));
      return;
    }
    for (let i = 0; i < total; i++) {
      const gi = grp[i] || 0, s = sel.includes(i);
      svg.append(svgEl("rect", { x: bx(i) - 8, y: by(i) - 8, width: BW + 16, height: BH + 16, rx: 6, fill: gi ? D3S_COLS[(gi - 1) % 6] : s ? D3S_SOFT : "none", stroke: gi ? PINE : s ? TENT : "none", "stroke-width": 2 }));
      svg.append(ten(bx(i), by(i), "#F7E3A1"));
      if (gi) svg.append(txt(bx(i) + BW / 2, by(i) + BH + 24, String(gi), 20, { fill: PINE }));
    }
    svg.append(txt(450, 385, `만든 묶음: ${gcount}묶음 · 남은 십 모형: ${total - grp.filter(Boolean).length}개`, 24));
  };
  const check = () => {
    if (!shown && broken && gcount === Math.floor(total / g) && sel.length === 0) {
      shown = true; ans.innerHTML = ""; numbers(ans, api, opt.ask, { ok: opt.ok });
      api.hint(`○ 십 모형 ${g}개씩 ${gcount}묶음을 만들었어요. 이제 물음에 답해요.`);
    }
  };
  dragOn(svg, p => {
    if (!broken) { if (p.y > hundR[1] && p.y < hundR[1] + HS && p.x > hundR[0] && p.x < HX(H) - 30) { broken = true; draw(); api.hint(`백 모형 ${H}개를 십 모형 ${H * 10}개로 바꾸었어요. 이제 십 모형이 모두 ${total}개예요. ${d}씩, 곧 십 모형 ${g}개씩 묶어요.`); } return false; }
    const i = Array.from({ length: total }, (_, k) => k).find(k => p.x > bx(k) - 10 && p.x < bx(k) + BW + 10 && p.y > by(k) - 10 && p.y < by(k) + BH + 10);
    if (i == null) return false;
    if (grp[i]) { const gi = grp[i]; for (let k = 0; k < total; k++) if (grp[k] === gi) grp[k] = 0; for (let k = 0; k < total; k++) if (grp[k] > gi) grp[k]--; gcount--; }
    else if (sel.includes(i)) sel = sel.filter(x => x !== i);
    else { sel.push(i); if (sel.length === g) { gcount++; sel.forEach(x => grp[x] = gcount); sel = []; } }
    draw(); check(); return false;
  }, () => {}, null);
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || `십 모형을 ${g}개씩 눌러 묶어요. 묶은 모형을 다시 누르면 그 묶음이 풀려요.`),
    h("button", { class: "ghost", onclick: () => { for (let k = 0; k < total; k++) grp[k] = 0; sel = []; gcount = 0; draw(); } }, "묶음 모두 풀기"), ans)));
}

/* ⑧ 몫 어림하고 고치기 (막대 그림)  opt: n, d, need(작은 몫·큰 몫을 모두 해 봐야 함), names, units, chk, ok */
function d3sQuotTry(body, api, opt) {
  d3sStyle();
  const n = opt.n, d = opt.d, q = Math.floor(n / d);
  let t = 0, small = false, big = false, shown = false;
  const svg = makeSvg(900, 300);
  const sc = 760 / Math.max(n, d * Math.min(9, q + 1)), X0 = 60, BY = 110, BH = 56;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(450, 30, `${n}에서 ${d}씩 몇 번 뺄 수 있을까요?`, 24));
    svg.append(svgEl("rect", { x: X0, y: BY, width: n * sc, height: BH, fill: "#F7F9F8", stroke: INK, "stroke-width": 3 }));
    svg.append(txt(X0 + n * sc, BY - 16, String(n), 20), svgEl("line", { x1: X0 + n * sc, y1: BY - 6, x2: X0 + n * sc, y2: BY + BH + 6, stroke: INK, "stroke-width": 3 }));
    for (let i = 0; i < t; i++) {
      const x = X0 + i * d * sc, w = d * sc, over = x + w > X0 + n * sc + .01;
      svg.append(svgEl("rect", { x, y: BY + 6, width: w, height: BH - 12, rx: 6, fill: over ? "#F6C3C1" : D3S_COLS[i % 2 ? 1 : 0], stroke: over ? D3S_RED : PINE, "stroke-width": 2, "stroke-dasharray": over ? "6 4" : "" }));
      if (w > 34) svg.append(txt(x + w / 2, BY + BH / 2, String(d), 17, { fill: over ? D3S_RED : INK }));
    }
    if (t > 0) {
      const used = d * t;
      if (used > n) svg.append(txt(450, 220, `${d} × ${t} = ${used} → ${n}보다 커서 뺄 수 없어요. 몫을 1 작게!`, 22, { fill: D3S_RED }));
      else {
        const rem = n - used, rx = X0 + used * sc;
        if (rem > 0) svg.append(svgEl("rect", { x: rx, y: BY + BH + 12, width: rem * sc, height: 18, fill: "#E5ECE9", stroke: "#7C8C86" }), txt(rx + rem * sc / 2, BY + BH + 46, `나머지 ${rem}`, 18));
        if (rem >= d) {
          svg.append(svgEl("rect", { x: rx, y: BY + 6, width: d * sc, height: BH - 12, rx: 6, fill: "none", stroke: TENT, "stroke-width": 3, "stroke-dasharray": "8 6" }));
          svg.append(txt(450, 250, `${n} − ${used} = ${rem} → 나머지가 ${d}보다 크거나 같아요. 한 번 더 뺄 수 있어요. 몫을 1 크게!`, 20, { fill: TENT }));
        } else svg.append(txt(450, 250, `${n} − ${used} = ${rem} → 나머지가 ${d}보다 작아요. 알맞은 몫이에요!`, 22, { fill: PINE }));
      }
      svg.append(txt(450, 280, `몫 어림: ${t}`, 18, { fill: "#6B7A75" }));
    } else svg.append(txt(450, 240, "오른쪽에서 몫을 어림해 골라 보세요", 22, { fill: "#9aa" }));
  };
  const ans = h("div", {}, h("p", { class: "d3swait" }, opt.need ? "몫을 너무 작게도, 너무 크게도 어림해 본 다음 알맞은 몫을 찾으면 계산 칸이 나와요." : "막대 그림에서 알맞은 몫을 찾으면 계산 칸이 나와요."));
  const pick = h("div", { class: "d3scards" });
  for (let k = 1; k <= 9; k++) pick.append(h("button", { class: "opt", onclick: e => {
    t = k; [...pick.children].forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on");
    if (d * k > n) big = true; else if (n - d * k >= d) small = true;
    draw();
    if (shown) return;
    if (t === q && (!opt.need || (small && big))) {
      shown = true; ans.innerHTML = "";
      api.hint(`○ ${d} × ${q} = ${d * q}, 나머지 ${n - d * q}${d3sP(n - d * q, "은는")} ${d}보다 작아요. 이제 몫과 나머지를 써요.`);
      d3sCalc(ans, api, [{ div: [n, d], chk: opt.chk !== false, names: opt.names, units: opt.units }], { ok: opt.ok });
    } else if (t === q) api.hint("알맞은 몫을 찾았어요. 몫을 너무 작게, 너무 크게 어림하면 어떻게 되는지도 해 봐요.");
  } }, String(k)));
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "몫을 어림해 수를 골라 보세요. 막대 그림에서 뺄 수 있는지, 더 뺄 수 있는지 살펴봐요."), pick, ans)));
}

/* ⑨ 뛰어 세기로 나누기: d×10 큰 뛰기와 d 작은 뛰기  opt: n, d, est, names, units, chk, ok */
function d3sJumpDiv(body, api, opt) {
  d3sStyle();
  const n = opt.n, d = opt.d;
  let big = 0, small = 0, estOk = !opt.est, shown = false;
  const svg = makeSvg(900, 300);
  const X = v => 50 + v / n * 800, Y = 220;
  const pos = () => d * (10 * big + small);
  const out = h("div", { class: "readout" });
  const ans = h("div", {}, h("p", { class: "d3swait" }, `${n}에 가장 가까이 갈 때까지 뛰면 계산 칸이 나와요.`));
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("line", { x1: X(0), y1: Y, x2: X(n) + 20, y2: Y, stroke: INK, "stroke-width": 3 }));
    for (let k = 0; d * 10 * k <= n; k++) { svg.append(svgEl("line", { x1: X(d * 10 * k), y1: Y - 12, x2: X(d * 10 * k), y2: Y + 12, stroke: INK, "stroke-width": 2 })); svg.append(txt(X(d * 10 * k), Y + 30, String(d * 10 * k), 17)); }
    svg.append(svgEl("line", { x1: X(n), y1: Y - 20, x2: X(n), y2: Y + 20, stroke: TENT, "stroke-width": 4 }), txt(X(n), Y + 52, String(n), 20, { fill: TENT }));
    for (let i = 0; i < big; i++) {
      const x1 = X(i * 10 * d), x2 = X((i + 1) * 10 * d), m = (x1 + x2) / 2;
      svg.append(svgEl("path", { d: `M${x1},${Y - 6} Q${m},${Y - 150} ${x2},${Y - 6}`, fill: "none", stroke: BLUE, "stroke-width": 4 }), txt(m, Y - 92, `+${10 * d}`, 18, { fill: BLUE }));
    }
    for (let j = 0; j < small; j++) {
      const v1 = big * 10 * d + j * d, x1 = X(v1), x2 = X(v1 + d), m = (x1 + x2) / 2;
      svg.append(svgEl("path", { d: `M${x1},${Y - 6} Q${m},${Y - 60} ${x2},${Y - 6}`, fill: "none", stroke: TENT, "stroke-width": 3 }));
    }
    svg.append(svgEl("circle", { cx: X(pos()), cy: Y, r: 10, fill: PINE, stroke: "#fff", "stroke-width": 3 }));
    out.innerHTML = `${10 * d}씩 <b>${big}</b>번, ${d}씩 <b>${small}</b>번 뛰었어요.<br>간 곳 ${pos()} · 남은 수 ${n - pos()}`;
    if (!shown && estOk && n - pos() < d) {
      shown = true; ans.innerHTML = "";
      api.hint(`○ 남은 ${n - pos()}${d3sP(n - pos(), "은는")} ${d}보다 작아서 더 뛸 수 없어요. 이제 몫과 나머지를 써요.`);
      d3sCalc(ans, api, [{ div: [n, d], names: opt.names, units: opt.units, chk: opt.chk }], { ok: opt.ok });
    }
  };
  const jumpB = () => { if (!estOk) return api.hint("먼저 위에서 어림한 값을 골라요."); if (pos() + 10 * d > n) return api.hint(`${10 * d}만큼 더 뛰면 ${d3sJ(n, "을를")} 넘어요. 이제 ${d}씩 뛰어 봐요.`); big++; draw(); };
  const jumpS = () => { if (!estOk) return api.hint("먼저 위에서 어림한 값을 골라요."); if (pos() + d > n) return api.hint(`${d}만큼 더 뛰면 ${d3sJ(n, "을를")} 넘어요. 남은 ${n - pos()}${d3sP(n - pos(), "이가")} 나머지예요.`); small++; draw(); };
  const undo = () => { if (shown) return; if (small) small--; else if (big) big--; draw(); };
  const side = h("div", { class: "side" });
  if (opt.est) side.append(d3sEstBox(api, opt.est, () => { estOk = true; draw(); }));
  side.append(h("p", {}, opt.tip || `${d} × 10 = ${10 * d}씩 크게 뛰고, 남은 만큼은 ${d}씩 뛰어요.`), out,
    h("div", { class: "row" }, h("button", { class: "ghost", onclick: jumpB }, `+${10 * d} 크게 뛰기`), h("button", { class: "ghost", onclick: jumpS }, `+${d} 뛰기`)),
    h("button", { class: "ghost", onclick: undo }, "한 번 되돌리기"), ans);
  draw();
  body.append(stageWrap(svg, side));
}

/* ⑩ 곱셈표로 몫 어림하기 — 곱을 다 쓰면 저절로 확인, 줄을 누르면 저절로 확인  opt: n, d, ks:[...], names, units, chk, ok */
function d3sTable(body, api, opt) {
  d3sStyle();
  const n = opt.n, d = opt.d, ks = opt.ks, best = Math.max(...ks.filter(k => d * k <= n));
  let picked = null, phase = 0;
  const tbody = h("tbody");
  const trs = [];
  const ins = ks.map(k => {
    const i = d3sNum(`${d} × ${k}`, true);
    const tr = h("tr", { style: "cursor:pointer", onclick: () => { if (phase !== 1) return; picked = k; trs.forEach(x => x.classList.remove("d3spick")); tr.classList.add("d3spick"); fire1(); } },
      h("td", { class: "jua" }, `${d} × ${k} =`), h("td", {}, i));
    trs.push(tr); tbody.append(tr); return i;
  });
  const fig = h("div");
  const drawLine = () => {
    const mx = d * ks[ks.length - 1] * 1.05, svg = makeSvg(900, 150), X = v => 40 + v / mx * 820;
    svg.append(svgEl("line", { x1: X(0), y1: 90, x2: X(mx), y2: 90, stroke: INK, "stroke-width": 3 }), txt(X(0), 118, "0", 18));
    ks.forEach(k => svg.append(svgEl("line", { x1: X(d * k), y1: 76, x2: X(d * k), y2: 104, stroke: BLUE, "stroke-width": 3 }), txt(X(d * k), 122, String(d * k), 18, { fill: BLUE }), txt(X(d * k), 60, `${d}×${k}`, 16, { fill: BLUE })));
    svg.append(svgEl("polygon", { points: `${X(n) - 9},40 ${X(n) + 9},40 ${X(n)},62`, fill: TENT }), txt(X(n), 24, String(n), 20, { fill: TENT }));
    fig.innerHTML = ""; fig.append(svg);
  };
  const ans = h("div");
  const tens = best >= 10;
  const fire0 = autoRun(() => phase === 0 && ins.every(d3sFilled), () => ins.map(i => i.value).join(","), () => {
    api.tryOnce();
    let bad = null;
    ins.forEach((i, k) => { const g = d3sVal(i) === d * ks[k]; d3sPaint(i, g); if (!g && bad == null) bad = ks[k]; });
    if (bad != null) { api.fail(`${d} × ${bad}${d3sP(bad, "을를")} 다시 계산해 봐요.`, ins.map(i => i.value).join(",")); return false; }
    phase = 1; drawLine(); ins.forEach(i => { i.readOnly = true; i.style.cursor = "pointer"; i.style.background = "transparent"; });
    api.hint(`○ 곱을 잘 구했어요. 이제 ${n}보다 크지 않으면서 ${n}에 가장 가까운 곱을 표에서 눌러 골라요.`);
    return true;
  }, 900);
  d3sWatch(ins, fire0);
  const fire1 = autoRun(() => phase === 1 && picked != null, () => String(picked), () => {
    api.tryOnce();
    if (d * picked > n) { api.fail(`${d} × ${picked} = ${d * picked}${d3sP(d * picked, "은는")} ${n}보다 커요. ${n}보다 크지 않은 곱을 골라요.`, `[고름] ${d}×${picked}`); return false; }
    if (picked !== best) { api.fail(`${d} × ${picked}보다 ${n}에 더 가까운 곱이 있어요.`, `[고름] ${d}×${picked}`); return false; }
    phase = 2;
    api.hint(tens ? `몫은 ${best}보다 크고 ${best + 10}보다 작아요. 몫의 십의 자리 숫자는 ${d3sJ(best / 10, "이에요")}.` : `${d} × ${best} = ${d * best}이므로 몫은 ${d3sJ(best, "이에요")}.`);
    const items = tens ? [{ q: `남은 수 ${n} − ${d * best} =`, a: n - d * best }, { div: [n, d], chk: opt.chk !== false, names: opt.names, units: opt.units }]
      : [{ div: [n, d], chk: opt.chk !== false, names: opt.names, units: opt.units }];
    d3sCalc(ans, api, items, { ok: opt.ok });
    return true;
  }, 260);
  body.append(h("div", { class: "d3swrap" }, h("table", { class: "d3stbl" }, tbody), h("div", { style: "flex:1;min-width:14em" }, h("p", {}, opt.tip || "① 표의 곱을 먼저 구해요(다 쓰면 저절로 확인해요). ② 곱이 수직선에 나타나면, 나누어지는 수보다 크지 않으면서 가장 가까운 곱의 줄을 눌러 골라요."))),
    fig, ans);
}

/* ⑪ 세로셈 나눗셈 (나누는 수가 두 자리) — 몫을 어림해 쓰면 저절로 살펴보고, 곱과 뺀 결과를 다 쓰면 저절로 확인  opt: n, d, chk, title, ok, tip */
function d3sLongDiv(body, api, opt) {
  d3sStyle();
  const n = opt.n, d = opt.d, q = Math.floor(n / d), r = n % d, N = String(n), L = N.length, D = String(d), dl = D.length;
  const two = q >= 10;
  const box = h("div", { class: "d3sv" }, h("div", { class: "d3sttl" }, opt.title || `${n} ÷ ${d}`));
  const left = () => Array.from({ length: dl + 1 }, () => d3sC(""));
  const mk = (cells, label) => { const rr = h("div", { class: "d3srow" }); cells.forEach(c => rr.append(c)); const lb = h("span", { class: "d3slab" }, label || ""); rr.append(lb); rr._lab = lb; box.append(rr); return rr; };
  const stages = (two ? [{ place: 10, col: L - 2 }, { place: 1, col: L - 1 }] : [{ place: 1, col: L - 1 }]);
  stages.forEach(s => s.qIn = d3sCell("몫"));
  const qCells = Array.from({ length: L }, (_, k) => { const s = stages.find(x => x.col === k); return s ? s.qIn : d3sC(""); });
  mk(left().concat(qCells), "← 몫");
  mk(D.split("").map(ch => d3sC(ch)).concat([d3sC(")", "d3sbrk")]).concat(N.split("").map(ch => d3sC(ch, "d3stop"))));
  const hidden = [];
  stages.forEach((s, si) => {
    s.pIns = Array.from({ length: s.place === 10 ? L - 1 : L }, () => d3sCell("뺄 수"));
    const pc = s.place === 10 ? s.pIns.concat([d3sC("0", "d3sfade")]) : s.pIns;
    s.pRow = mk(left().concat(pc), "");
    s.lRow = mk(left().concat(Array.from({ length: L }, () => d3sC("", "d3stop"))));
    s.lRow.classList.add("d3sthin");
    s.dIns = Array.from({ length: L }, () => d3sCell("남은 수"));
    s.dRow = mk(left().concat(s.dIns), si === stages.length - 1 ? "← 나머지" : "← 남은 수");
    if (si > 0) hidden.push(s.pRow, s.lRow, s.dRow);
  });
  hidden.forEach(x => x.style.display = "none");
  let si = 0, sub = "q", cur = n, phaseChk = false, ver = 0;
  const st = h("p", { class: "inst" });
  const setActive = () => {
    stages.forEach((s, k) => {
      s.qIn.disabled = !(k === si && sub === "q");
      [...s.pIns, ...s.dIns].forEach(x => x.disabled = !(k === si && sub === "pd"));
      [s.pRow, s.dRow].forEach(rw => rw.classList.toggle("d3sact", k === si && sub === "pd"));
    });
    const s = stages[si];
    if (s && sub !== "end") st.textContent = sub === "q" ? (s.place === 10 ? `몫의 십의 자리 숫자를 어림해 써요. (${cur}에서 ${d3sJ(d, "을를")} 몇십 번 뺄 수 있을까요?)` : `${two ? "몫의 일의 자리 숫자를" : "몫을"} 어림해 써요. (${cur}에서 ${d3sJ(d, "을를")} 몇 번 뺄 수 있을까요?)`)
      : `${d} × ${Number(s.qIn.value) * s.place}의 곱을 쓰고, ${cur}에서 빼요.`;
  };
  const chkBox = h("div", { class: "d3schk", style: "display:none" });
  const c1 = d3sNum("확인하는 곱", true), c2 = d3sNum("확인하는 합", true), echo = h("span", {}, " , □");
  chkBox.append(h("span", { class: "jua" }, "계산이 맞는지 확인해요 · "), h("span", {}, `${d} × ${q} = `), c1, echo, h("span", {}, ` + ${r} = `), c2);
  c1.addEventListener("input", () => { echo.textContent = ` , ${c1.value || "□"}`; });
  api.provide({ words: ["몫 어림", "1 크게", "1 작게", "나머지 < 나누는 수"], answers: [`${n} ÷ ${d} = ${q}${r ? ` … ${r}` : ""}`] });
  const resetStage = s => { s.qIn.value = ""; [...s.pIns, ...s.dIns].forEach(x => { x.value = ""; x.style.borderColor = ""; }); s.qIn.style.borderColor = ""; s.pRow._lab.textContent = ""; };
  const want = s => { const v = Number(s.qIn.value), prod = d * v * s.place; return { prod, diff: cur - prod, pw: s.place === 10 ? d3sPad(prod / 10, L - 1) : d3sPad(prod, L), dw: d3sPad(cur - prod, L) }; };
  const ready = () => {
    if (phaseChk) return d3sFilled(c1) && d3sFilled(c2);
    if (sub === "end") return false;
    const s = stages[si];
    if (sub === "q") return d3sFilled(s.qIn);
    const w = want(s);
    return s.pIns.filter(d3sFilled).length >= d3sDigits(w.pw) && s.dIns.filter(d3sFilled).length >= d3sDigits(w.dw);
  };
  const sign = () => {
    const s = stages[si];
    return [ver, si, sub, phaseChk, s ? s.qIn.value : "", s ? s.pIns.map(x => x.value).join("") : "", s ? s.dIns.map(x => x.value).join("") : "", c1.value, c2.value].join("|");
  };
  const judge = () => {
    if (phaseChk) {
      api.tryOnce();
      const g1 = d3sVal(c1) === d * q, g2 = d3sVal(c2) === n; d3sPaint(c1, g1); d3sPaint(c2, g2);
      if (!g1) { api.fail(`${d} × ${q}${d3sP(q, "을를")} 다시 계산해 봐요.`, `확인 ${c1.value}`); return false; }
      if (!g2) { api.fail(`${d * q} + ${r}${d3sP(r, "을를")} 계산해 봐요. ${n}${d3sP(n, "이가")} 나오면 맞아요.`, `확인 ${c1.value}+${r}=${c2.value}`); return false; }
      c1.disabled = c2.disabled = true;
      api.done(`${n}÷${d}=${q}…${r} | 확인 ${d}×${q}=${d * q}, ${d * q}+${r}=${n}`, opt.ok || `${n} ÷ ${d} = ${q}${r ? ` … ${r}` : ""}. 확인까지 정확해요!`);
      return true;
    }
    const s = stages[si];
    if (sub === "q") {
      const v = parseInt(s.qIn.value, 10);
      if (isNaN(v) || (v < 1 && s.place === 10)) { api.hint(s.place === 10 ? "몫 칸에 1부터 9까지의 숫자를 써요." : "몫 칸에 0부터 9까지의 숫자를 써요."); return false; }
      api.tryOnce();
      const prod = d * v * s.place;
      if (prod > cur) {
        s.qIn.value = ""; s.qIn.style.borderColor = "var(--tent)"; ver++;
        api.hint(`${d} × ${v * s.place} = ${d3sJ(prod, "은는")} ${cur}보다 커서 뺄 수 없어요. 몫을 1 작게 해 봐요. (어림한 몫을 고치는 것은 자연스러운 일이에요.)`);
        return false;
      }
      s.qIn.style.borderColor = "var(--ok)";
      s.pRow._lab.textContent = `← ${d} × ${v * s.place}`;
      sub = "pd"; setActive(); s.pIns[s.pIns.length - 1].focus();
      api.hint(s.place === 10 ? `○ 이제 ${d} × ${v * 10}의 곱을 써요. 일의 자리 0은 미리 써 두었어요. 그다음 뺀 결과를 써요.` : `○ 이제 ${d} × ${v}의 곱을 쓰고 빼요.`);
      return false;
    }
    api.tryOnce();
    const v = Number(s.qIn.value), { prod, diff, pw, dw } = want(s);
    if (!d3sRowCheck(s.pIns, pw).same) {
      const got = s.pIns.map(x => x.value.trim()).join("");
      if (got && Number(got) === Number(pw.join(""))) { api.fail("곱은 맞았는데 자리가 어긋났어요. 나누어지는 수의 자리에 맞추어 써요.", `곱 ${got}`); return false; }
      api.fail(s.place === 10 ? `${d} × ${v * 10}은 ${d} × ${v}의 10배예요. ${d} × ${v}의 값을 0 앞에 써요.` : `${d} × ${v}${d3sP(v, "을를")} 다시 계산해 봐요.`, `곱 ${got || "-"}`); return false;
    }
    if (!d3sRowCheck(s.dIns, dw).same) {
      const got = s.dIns.map(x => x.value.trim()).join("");
      if (got && Number(got) === diff) { api.fail("뺀 수는 맞았는데 자리가 어긋났어요. 일의 자리를 맨 오른쪽 칸에 맞추어 써요.", `뺀 결과 ${got}`); return false; }
      api.fail(`${cur} − ${d3sJ(prod, "을를")} 다시 계산해 봐요. 받아내림에 주의해요.`, `뺀 결과 ${got || "-"}`); return false;
    }
    if (diff >= d * s.place) {
      const msg = `남은 ${diff}에서 ${d * s.place}${d3sP(d * s.place, "을를")} 한 번 더 뺄 수 있어요. 몫을 1 크게 해서 다시 해 봐요.`;
      resetStage(s); ver++; sub = "q"; setActive(); s.qIn.focus();
      api.hint(msg); return false;
    }
    [...s.pIns, ...s.dIns].forEach(x => x.disabled = true);
    si++; cur = diff;
    if (si < stages.length) {
      const ns = stages[si]; [ns.pRow, ns.lRow, ns.dRow].forEach(x => x.style.display = "");
      sub = "q"; setActive(); ns.qIn.focus();
      api.hint(`○ ${n} − ${prod} = ${diff}. 남은 ${diff}${d3sP(diff, "은는")} ${d * 10}보다 작으니 이제 몫의 일의 자리를 구해요.`);
      return false;
    }
    sub = "end"; si = stages.length - 1; setActive(); st.textContent = `몫 ${q}, 나머지 ${r}`;
    if (opt.chk) { phaseChk = true; chkBox.style.display = ""; c1.focus(); api.hint(`○ 몫은 ${q}, 나머지는 ${d3sJ(r, "이에요")}. 나머지가 ${d}보다 작아요. 이제 계산이 맞는지 확인해요.`); return false; }
    api.done(`${n}÷${d}=${q}…${r}`, opt.ok || `${n} ÷ ${d} = ${q}${r ? ` … ${r}` : ""}. 정확해요!`);
    return true;
  };
  const fire = autoRun(ready, sign, judge, 900);
  d3sWatch(stages.flatMap(s => [s.qIn, ...s.pIns, ...s.dIns]).concat([c1, c2]), fire);
  d3sSlow(api, stages.flatMap(s => [...s.pIns, ...s.dIns]), () => {
    if (phaseChk || sub !== "pd" || ready()) return null;
    const s = stages[si], w = want(s);
    if (![...s.pIns, ...s.dIns].some(d3sFilled)) return null;
    if (s.pIns.filter(d3sFilled).length < d3sDigits(w.pw)) return `아직 빈칸이 있어요. ${d} × ${Number(s.qIn.value) * s.place}의 곱을 자리에 맞추어 모두 써요.`;
    return `아직 빈칸이 있어요. ${cur} − ${d3sJ(w.prod, "을를")} 계산해 뺀 결과를 일의 자리에 맞추어 모두 써요.`;
  });
  setActive();
  body.append(h("p", { class: "inst" }, opt.tip || "몫을 어림해 쓰면 저절로 살펴봐요. 그다음 곱과 뺀 결과를 다 쓰면 저절로 확인해요."), h("div", { class: "d3swrap" }, box, h("div", { style: "flex:1;min-width:12em" }, st)), chkBox);
}

/* 나눗셈 세로셈 그림(글자만, 몫 한 자리): 잘못 계산한 친구의 계산 */
function d3sDivFig(n, d, qd) {
  d3sStyle();
  const N = String(n), L = N.length, D = String(d), dl = D.length, prod = d * qd, diff = n - prod;
  const box = h("div", { class: "d3sv" });
  const mk = cells => { const rr = h("div", { class: "d3srow" }); cells.forEach(c => rr.append(c)); box.append(rr); return rr; };
  const left = () => Array.from({ length: dl + 1 }, () => d3sC(""));
  mk(left().concat(d3sPad(qd, L).map(ch => d3sC(ch))));
  mk(D.split("").map(ch => d3sC(ch)).concat([d3sC(")", "d3sbrk")]).concat(N.split("").map(ch => d3sC(ch, "d3stop"))));
  mk(left().concat(d3sPad(prod, L).map(ch => d3sC(ch))));
  mk(left().concat(Array.from({ length: L }, () => d3sC("", "d3stop")))).classList.add("d3sthin");
  mk(left().concat(d3sPad(diff, L).map(ch => d3sC(ch))));
  return box;
}
/* ⑫ 잘못 계산한 곳 찾기 — 까닭을 고르고 몫·나머지를 다 쓰면 저절로 확인  opt: n, d, wq(틀린 몫), reasons:[], ra, why, ok */
function d3sFixDiv(body, api, opt) {
  d3sStyle();
  const n = opt.n, d = opt.d, q = Math.floor(n / d), r = n % d;
  let pick = null;
  const qi = d3sNum("몫"), ri = d3sNum("나머지");
  const row = h("div", { class: "opts" });
  const judge = () => {
    api.tryOnce();
    const qv = d3sVal(qi), rv = d3sVal(ri);
    const given = `${opt.reasons[pick]} / ${qi.value}…${ri.value}`;
    [...row.children].forEach(x => x.classList.remove("good", "bad"));
    row.children[pick].classList.add(pick === opt.ra ? "good" : "bad");
    d3sPaint(qi, qv === q); d3sPaint(ri, rv === r);
    if (pick !== opt.ra) { api.fail((opt.why && opt.why[pick]) || "까닭을 다시 골라 보세요. 친구가 쓴 나머지와 나누는 수를 견주어 봐요.", given); return false; }
    if (qv !== q || rv !== r) { api.fail(rv != null && rv >= d ? `나머지는 ${d}보다 작아야 해요.` : `${d}에 몇을 곱해야 ${n}보다 크지 않으면서 가장 가까운지 다시 생각해 봐요.`, given); return false; }
    api.done(given, opt.ok || `${n} ÷ ${d} = ${q} … ${r}. 나머지는 나누는 수보다 작아야 해요.`);
    return true;
  };
  const fire = autoRun(() => pick != null && d3sFilled(qi) && d3sFilled(ri), () => `${pick}|${qi.value}|${ri.value}`, judge, 900);
  opt.reasons.forEach((t, i) => row.append(h("button", { class: "opt", onclick: e => { pick = i; [...row.children].forEach(x => x.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); fire(); } }, t)));
  d3sWatch([qi, ri], fire);
  api.provide({ words: ["나머지", "나누는 수", "몫을 1 크게"], answers: [opt.reasons[opt.ra], `${n} ÷ ${d} = ${q} … ${r}`] });
  body.append(h("div", { class: "d3swrap" }, h("div", {}, h("div", { class: "jua" }, opt.who ? `${opt.who}의 계산` : "친구의 계산"), d3sDivFig(n, d, opt.wq)),
    h("div", { style: "flex:1;min-width:14em" }, h("div", { class: "jua" }, "잘못 계산한 까닭은?"), row,
      h("div", { class: "qitem d3scalc" }, h("span", { class: "jua" }, `옳게 계산하면 ${n} ÷ ${d} =`), h("span", { class: "d3sqr" }, h("span", {}, "몫"), qi), h("span", { class: "jua" }, "…"), h("span", { class: "d3sqr" }, h("span", {}, "나머지"), ri)),
      h("p", { class: "d3snote" }, "까닭을 고르고 몫과 나머지를 다 쓰면 저절로 확인해요."))));
}

/* ⑬ 수 카드로 식 만들기 — 카드를 다 놓으면 저절로 살펴보고, 답을 쓰면 저절로 확인
   opt: cards, mode "mul"(가장 큰 세 자리 수 × 가장 작은 두 자리 수) | "div"(몫이 가장 큰 나눗셈), ok */
function d3sCards(body, api, opt) {
  d3sStyle();
  const cards = opt.cards, mode = opt.mode || "mul", op = mode === "mul" ? "×" : "÷";
  let placed = [], arrOk = false;
  const perms = [];
  const rec = (pre, rest) => { if (pre.length === 5) { perms.push(pre); return; } rest.forEach((c, i) => rec(pre.concat(c), rest.filter((_, k) => k !== i))); };
  rec([], cards);
  const num = arr => arr.reduce((s, x) => s * 10 + x, 0);
  const ok3 = p => p[0] !== 0 && p[3] !== 0;
  let bestA, bestB, bestQ, bestDiv;
  if (mode === "mul") {
    bestA = Math.max(...perms.filter(ok3).map(p => num(p.slice(0, 3))));
    bestB = Math.min(...perms.filter(p => ok3(p) && num(p.slice(0, 3)) === bestA).map(p => num(p.slice(3))));
  } else {
    bestQ = Math.max(...perms.filter(ok3).map(p => Math.floor(num(p.slice(0, 3)) / num(p.slice(3)))));
    const bp = perms.find(p => ok3(p) && Math.floor(num(p.slice(0, 3)) / num(p.slice(3))) === bestQ);
    bestDiv = [num(bp.slice(0, 3)), num(bp.slice(3))];
  }
  const row = h("div", { class: "d3scards" });
  const show = h("div", { class: "d3sslots" });
  const out1 = d3sNum(mode === "mul" ? "곱" : "몫", true), out2 = d3sNum("나머지");
  out1.disabled = true; out2.disabled = true;
  const draw = () => {
    const s = placed.map(i => String(cards[i])).concat(Array(5 - placed.length).fill("□"));
    show.textContent = `${s.slice(0, 3).join("")} ${op} ${s.slice(3).join("")} =`;
    [...row.children].forEach((b, i) => b.classList.toggle("on", placed.includes(i)));
  };
  const cur = () => { const p = placed.map(i => cards[i]); return { p, A: num(p.slice(0, 3)), B: num(p.slice(3)) }; };
  const fireArr = autoRun(() => !arrOk && placed.length === 5, () => placed.join(","), () => {
    api.tryOnce();
    const { p, A, B } = cur(), tag = `${A}${op}${B}`;
    if (!ok3(p)) { api.fail("가장 높은 자리에는 0을 놓을 수 없어요. ‘다시 놓기’를 눌러요.", tag); return false; }
    if (mode === "mul") {
      if (A !== bestA) { api.fail("가장 큰 세 자리 수를 만들려면 큰 수부터 높은 자리에 놓아요. ‘다시 놓기’를 눌러요.", tag); return false; }
      if (B !== bestB) { api.fail("남은 카드로 가장 작은 두 자리 수를 만들려면 작은 수를 십의 자리에 놓아요. ‘다시 놓기’를 눌러요.", tag); return false; }
    } else if (Math.floor(A / B) !== bestQ) { api.fail("몫이 더 커지게 만들 수 있어요. 나누어지는 수는 크게, 나누는 수는 작게 만들어 봐요. ‘다시 놓기’를 눌러요.", tag); return false; }
    arrOk = true; reBtn.disabled = true; out1.disabled = false; out2.disabled = false; out1.focus();
    api.hint(mode === "mul" ? `○ 알맞게 만들었어요. 이제 ${A} × ${B}의 곱을 구해요.` : `○ 몫이 가장 큰 나눗셈을 만들었어요. 이제 ${A} ÷ ${B}의 몫과 나머지를 구해요.`);
    return true;
  }, 260);
  const fireAns = autoRun(() => arrOk && d3sFilled(out1) && (mode === "mul" || d3sFilled(out2)), () => out1.value + "|" + out2.value, () => {
    api.tryOnce();
    const { A, B } = cur(), tag = `${A}${op}${B}`;
    if (mode === "mul") {
      const v = d3sVal(out1); d3sPaint(out1, v === A * B);
      if (v !== A * B) { api.fail(`${A} × ${B}의 곱을 다시 계산해 봐요. ${A} × ${d3sJ(B % 10, "과와")} ${A} × ${Math.floor(B / 10) * 10}을 더해요.`, `${tag}=${out1.value}`); return false; }
      api.done(`${tag}=${A * B}`, opt.ok || `${A} × ${B} = ${A * B}. 수 카드로 만든 두 수의 곱을 구했어요!`); return true;
    }
    const qq = Math.floor(A / B), rr = A % B, qv = d3sVal(out1), rv = d3sVal(out2);
    d3sPaint(out1, qv === qq); d3sPaint(out2, rv === rr);
    if (qv !== qq || rv !== rr) { api.fail(rv != null && rv >= B ? `나머지는 나누는 수 ${B}보다 작아야 해요.` : `${A} ÷ ${B}의 몫과 나머지를 다시 계산해 봐요.`, `${tag}=${out1.value}…${out2.value}`); return false; }
    api.done(`${tag}=${qq}…${rr}`, opt.ok || `${A} ÷ ${B} = ${qq} … ${rr}. 몫이 가장 큰 나눗셈을 만들었어요!`); return true;
  }, 900);
  d3sWatch([out1, out2], fireAns);
  cards.forEach((c, i) => row.append(h("button", { class: "opt", onclick: () => { if (arrOk || placed.includes(i) || placed.length >= 5) return; placed.push(i); draw(); fireArr(); } }, String(c))));
  const reBtn = h("button", { class: "ghost", onclick: () => { if (arrOk) return; placed = []; draw(); } }, "다시 놓기");
  api.provide({ words: ["가장 큰 수", "가장 작은 수", "높은 자리"], answers: [mode === "mul" ? `${bestA} × ${bestB} = ${bestA * bestB}` : `${bestDiv[0]} ÷ ${bestDiv[1]} = ${bestQ} … ${bestDiv[0] % bestDiv[1]}`] });
  draw();
  d3sAdd(body, h("p", {}, opt.tip || "카드를 차례로 눌러 앞의 세 칸, 뒤의 두 칸에 놓아요. 다 놓으면 저절로 살펴봐요."), row,
    h("div", { class: "row", style: "align-items:center;gap:.5em;flex-wrap:wrap" }, show, out1, mode === "div" ? h("span", { class: "jua" }, "…") : null, mode === "div" ? out2 : null, reBtn),
    mode === "div" ? h("p", { class: "d3snote" }, "앞 칸: 몫, 뒤 칸: 나머지 (나머지가 없으면 0)") : null);
}

/* ⑭ 가까운 몇백·몇십 찾기(어림) — 모두 알맞게 고르면 물음이 나와요  opt: items:[{v, lo, hi, step, name}], ask, ok */
function d3sRoundLine(body, api, opt) {
  const items = opt.items, picks = items.map(() => null);
  let shown = false;
  const svg = makeSvg(900, items.length * 150 + 10);
  const X0 = 130, X1 = 770;
  const near = it => (it.v - it.lo <= it.hi - it.v) ? it.lo : it.hi;
  const ans = h("div", {}, h("p", { class: "d3swait" }, "두 수를 모두 알맞게 어림하면 물음이 나와요."));
  const draw = () => {
    svg.innerHTML = "";
    items.forEach((it, k) => {
      const y = 95 + k * 150, X = v => X0 + (v - it.lo) / (it.hi - it.lo) * (X1 - X0);
      svg.append(txt(450, y - 72, it.name, 24));
      svg.append(svgEl("line", { x1: X0, y1: y, x2: X1, y2: y, stroke: INK, "stroke-width": 3 }));
      for (let v = it.lo; v <= it.hi; v += it.step) svg.append(svgEl("line", { x1: X(v), y1: y - 8, x2: X(v), y2: y + 8, stroke: INK, "stroke-width": 1.5 }));
      const mid = (it.lo + it.hi) / 2;
      svg.append(svgEl("line", { x1: X(mid), y1: y - 16, x2: X(mid), y2: y + 16, stroke: "#9aa", "stroke-width": 2, "stroke-dasharray": "4 3" }), txt(X(mid), y + 32, String(mid), 18, { fill: "#8a9" }));
      [it.lo, it.hi].forEach(v => {
        const on = picks[k] === v;
        svg.append(svgEl("circle", { cx: X(v), cy: y, r: 34, fill: on ? D3S_PSOFT : "#fff", stroke: on ? PINE : BLUE, "stroke-width": 3, style: "cursor:pointer" }), txt(X(v), y + 1, String(v), 22));
      });
      svg.append(svgEl("polygon", { points: `${X(it.v) - 10},${y - 34} ${X(it.v) + 10},${y - 34} ${X(it.v)},${y - 14}`, fill: TENT }), txt(X(it.v), y - 48, String(it.v), 24, { fill: TENT }));
      if (picks[k] != null) svg.append(svgEl("line", { x1: X(it.v), y1: y + 40, x2: X(picks[k]), y2: y + 40, stroke: PINE, "stroke-width": 4 }), txt((X(it.v) + X(picks[k])) / 2, y + 56, `${Math.abs(picks[k] - it.v)}만큼 차이`, 19, { fill: PINE }));
    });
  };
  dragOn(svg, p => {
    let hit = -1;
    items.forEach((it, k) => {
      const y = 95 + k * 150, X = v => X0 + (v - it.lo) / (it.hi - it.lo) * (X1 - X0);
      [it.lo, it.hi].forEach(v => { if (Math.hypot(p.x - X(v), p.y - y) < 36) { picks[k] = v; hit = k; } });
    });
    draw();
    if (hit < 0 || shown) return false;
    const it = items[hit];
    if (picks[hit] !== near(it)) api.hint(`${it.v}에서 ${it.lo}까지와 ${it.hi}까지의 거리를 견주어 봐요. 더 가까운 쪽을 골라요.`);
    else if (items.every((x, k) => picks[k] === near(x))) {
      shown = true; ans.innerHTML = ""; numbers(ans, api, opt.ask, { ok: opt.ok });
      api.hint("○ 두 수를 계산하기 쉬운 수로 어림했어요. 이제 어림한 수로 계산해요.");
    } else api.hint(`○ ${d3sJ(it.v, "은는")} ${near(it)}에 더 가까워요. 다른 수도 어림해요.`);
    return false;
  }, () => {}, null);
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "주황 화살표의 수는 양 끝의 두 수 중 어느 쪽에 더 가까운가요? 더 가까운 쪽의 동그라미를 눌러요."), ans)));
}

/* ⑮ 나누기 쉬운 수 찾기(조화수) — 누르면 바로 알려 줘요  opt: n, d, lo, hi, need, ask(t)→[numbers], ok */
function d3sCompat(body, api, opt) {
  const n = opt.n, d = opt.d, lo = opt.lo, hi = opt.hi, need = opt.need || 1;
  const found = [];
  const svg = makeSvg(900, 230);
  const X = v => 60 + (v - lo) / (hi - lo) * 780, Y = 120;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(450, 28, `${n}에 가까우면서 ${d3sJ(d, "으로")} 나누기 쉬운 수를 눌러 찾아요`, 21));
    svg.append(svgEl("line", { x1: X(lo) - 10, y1: Y, x2: X(hi) + 10, y2: Y, stroke: INK, "stroke-width": 3 }));
    for (let v = lo; v <= hi; v += 10) {
      const f = found.includes(v);
      svg.append(svgEl("line", { x1: X(v), y1: Y - 12, x2: X(v), y2: Y + 12, stroke: INK, "stroke-width": 2 }));
      svg.append(svgEl("rect", { x: X(v) - 26, y: Y + 22, width: 52, height: 34, rx: 8, fill: f ? D3S_PSOFT : "#fff", stroke: f ? PINE : D3S_GRAY, "stroke-width": 2, style: "cursor:pointer" }), txt(X(v), Y + 40, String(v), 17));
      if (f) svg.append(txt(X(v), Y + 76, `${v}÷${d}`, 16, { fill: PINE }));
    }
    svg.append(svgEl("polygon", { points: `${X(n) - 10},${Y - 40} ${X(n) + 10},${Y - 40} ${X(n)},${Y - 18}`, fill: TENT }), txt(X(n), Y - 54, String(n), 20, { fill: TENT }));
  };
  const ans = h("div", {}, h("p", { class: "d3swait" }, `나누기 쉬운 수를 ${need}개 찾으면 물음이 나와요.`));
  dragOn(svg, p => {
    if (found.length >= need) return false;
    const v = Math.round((lo + (p.x - 60) / 780 * (hi - lo)) / 10) * 10;
    if (v < lo || v > hi || Math.abs(p.y - (Y + 39)) > 30) return false;
    if (v % d !== 0) { api.hint(`${d3sJ(v, "은는")} ${d3sJ(d, "으로")} 나누면 나누어떨어지지 않아요. ${d}씩 뛰어 센 수를 떠올려 봐요.`); return false; }
    if (Math.abs(v - n) >= d) { api.hint(`${d3sJ(v, "은는")} ${d3sJ(d, "으로")} 나누기 쉽지만 ${n}에서 조금 멀어요. 더 가까운 수를 찾아요.`); return false; }
    if (!found.includes(v)) found.push(v);
    draw();
    if (found.length >= need) { api.hint("○ 나누기 쉬운 수를 찾았어요. 이제 나누어 보세요."); ans.innerHTML = ""; numbers(ans, api, opt.ask(found), { ok: opt.ok }); }
    else api.hint(`○ ${d3sJ(v, "을를")} 찾았어요. ${n}에 가까운 다른 수도 있어요.`);
    return false;
  }, () => {}, null);
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || `수직선 아래 수 칸을 눌러 ${d3sJ(d, "으로")} 나누기 쉬운 수를 찾아요.`), ans)));
}

/* ⑯ 체험 부스 재료비: 재료 카드를 부스 바구니에 담고 1인분 재료비를 더해 견주기 — 다 담으면·다 쓰면 저절로 확인
   opt: cards:[{name, v, col}], bowls:[{name, need:[이름…]}], unit, people, after:[numbers], ok */
function d3sBooth(body, api, opt) {
  d3sStyle();
  const U = opt.unit || "원";
  const cards = opt.cards.map((c, i) => Object.assign({ id: i, at: -1 }, c)), bowls = opt.bowls;
  let sel = null, phase = 0;
  const svg = makeSvg(900, 470);
  const CW = 132, CH = 80;
  const trayXY = i => [24 + i * (CW + 10), 50];
  const bowlR = b => [30 + b * 440, 200, 400, 250];
  const inBowl = b => cards.filter(c => c.at === b);
  const cardXY = c => { if (c.at < 0) return trayXY(c.id); const r = bowlR(c.at), k = inBowl(c.at).indexOf(c); return [r[0] + 20 + (k % 2) * (CW + 20), r[1] + 60 + Math.floor(k / 2) * (CH + 12)]; };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(450, 24, "재료 카드를 끌어 알맞은 부스 바구니에 담아요", 24));
    bowls.forEach((b, k) => {
      const r = bowlR(k);
      svg.append(svgEl("path", { d: `M${r[0]},${r[1] + 40} L${r[0] + r[2]},${r[1] + 40} Q${r[0] + r[2] - 20},${r[1] + r[3]} ${r[0] + r[2] / 2},${r[1] + r[3]} Q${r[0] + 20},${r[1] + r[3]} ${r[0]},${r[1] + 40}Z`, fill: sel != null ? "#F4FAF6" : "#FBFCFB", stroke: PINE, "stroke-width": 3 }));
      svg.append(txt(r[0] + r[2] / 2, r[1] + 22, b.name, 22, { fill: PINE }));
    });
    cards.forEach(c => {
      const [x, y] = cardXY(c);
      svg.append(svgEl("rect", { x, y, width: CW, height: CH, rx: 10, fill: "#fff", stroke: sel === c.id ? TENT : INK, "stroke-width": sel === c.id ? 4 : 2, style: "cursor:grab" }),
        svgEl("circle", { cx: x + 22, cy: y + CH / 2, r: 14, fill: c.col, stroke: INK, "stroke-width": 1.5 }),
        txt(x + 80, y + 27, c.name, c.name.length > 3 ? 17 : 21), txt(x + 80, y + 57, `${c.v}${U}`, 21, { fill: BLUE }));
    });
  };
  const hitCard = p => [...cards].reverse().find(c => { const [x, y] = cardXY(c); return d3sIn(p, [x, y, CW, CH]); });
  const hitBowl = p => bowls.findIndex((_, k) => d3sIn(p, bowlR(k)));
  const sums = bowls.map(b => b.need.reduce((s, nm) => s + cards.find(c => c.name === nm).v, 0));
  const bestB = sums.indexOf(Math.min(...sums));
  const fire0 = autoRun(() => phase === 0 && cards.every(c => c.at >= 0), () => cards.map(c => c.at).join(","), () => {
    api.tryOnce();
    const bad = bowls.findIndex((b, k) => inBowl(k).map(c => c.name).sort().join(",") !== b.need.slice().sort().join(","));
    if (bad >= 0) { api.fail(`${bowls[bad].name}의 재료를 다시 살펴봐요. 문제에 부스마다 쓰는 재료가 적혀 있어요.`, inBowl(bad).map(c => c.name).join(",")); return false; }
    phase = 1; phase2.style.display = ""; draw();
    api.hint("○ 잘 담았어요. 이제 부스마다 1인분 재료비를 구하고, 어떤 부스를 열지 골라요.");
    return true;
  }, 1200);
  let drag = null, ghost = null, downP = null;
  dragOn(svg, p => {
    if (phase) return false;
    const c = hitCard(p);
    if (c) { drag = c; sel = c.id; downP = p; draw(); ghost = svgEl("rect", { x: p.x - CW / 2, y: p.y - CH / 2, width: CW, height: CH, rx: 10, fill: "none", stroke: TENT, "stroke-width": 3, "stroke-dasharray": "6 5", "pointer-events": "none" }); svg.append(ghost); return true; }
    const b = hitBowl(p);
    if (b >= 0 && sel != null) { cards[sel].at = b; sel = null; draw(); fire0(); }
    else if (sel != null && p.y < 140) { cards[sel].at = -1; sel = null; draw(); }
    return false;
  }, p => { if (ghost) { ghost.setAttribute("x", p.x - CW / 2); ghost.setAttribute("y", p.y - CH / 2); } },
  p => {
    if (drag && downP && Math.hypot(p.x - downP.x, p.y - downP.y) < 8) { drag = null; ghost = null; draw(); return; }   /* 살짝 누르기: 카드를 고른 채로 두고, 그릇을 누르면 담김 */
    const b = hitBowl(p);
    if (drag && b >= 0) { drag.at = b; sel = null; }
    else if (drag && p.y < 140) { drag.at = -1; sel = null; }
    drag = null; ghost = null; draw(); fire0();
  });
  const totals = bowls.map(b => d3sNum(`${b.name} 1인분 재료비`, true));
  const pickRow = h("div", { class: "opts" });
  let pick = null;
  const ans = h("div");
  const fire1 = autoRun(() => phase === 1 && totals.every(d3sFilled) && pick != null, () => totals.map(t => t.value).join(",") + "|" + pick, () => {
    api.tryOnce();
    let bad = null;
    totals.forEach((t, k) => { const g = d3sVal(t) === sums[k]; d3sPaint(t, g); if (!g && bad == null) bad = k; });
    if (bad != null) { api.fail(`${bowls[bad].name}에 담은 재료비를 모두 더해 봐요.`, totals.map(t => t.value).join(",")); return false; }
    if (pick !== bestB) { api.fail(`재료비가 더 적게 드는 부스를 골라야 해요. ${sums[0]}${U}과 ${sums[1]}${U}을 견주어 봐요.`, bowls[pick].name); return false; }
    phase = 2; totals.forEach(t => t.disabled = true);
    if (opt.after) { api.hint(`○ ${bowls[bestB].name}의 재료비가 더 적어요. 이제 ${opt.people}명의 재료비를 구해요.`); numbers(ans, api, opt.after, { ok: opt.ok }); return true; }
    api.done(bowls.map((b, k) => `${b.name} ${sums[k]}`).join(", ") + ` → ${bowls[bestB].name}`, opt.ok);
    return true;
  }, 900);
  bowls.forEach((b, k) => pickRow.append(h("button", { class: "opt", onclick: e => { if (phase !== 1) return; pick = k; [...pickRow.children].forEach(x => x.classList.remove("on")); e.currentTarget.classList.add("on"); fire1(); } }, b.name)));
  d3sWatch(totals, fire1);
  const phase2 = h("div", { style: "display:none" },
    ...bowls.map((b, k) => h("div", { class: "qitem d3scalc" }, h("span", { class: "jua" }, `${b.name} 1인분:`), totals[k], h("span", {}, U))),
    h("div", { class: "jua" }, "재료비를 아끼려면 어떤 부스를 열어야 할까요?"), pickRow);
  api.provide({ words: ["1인분", "재료비", "더 적은"], answers: bowls.map((b, k) => `${b.name} ${sums[k]}${U}`).concat([bowls[bestB].name]) });
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "재료 카드를 끌어 부스 바구니에 놓아요. 카드를 누른 다음 바구니를 눌러도 돼요. 다 담으면 저절로 살펴봐요."), phase2, ans)));
}

/* ⑰ 과학 축제 부스 탐험 놀이판 (놀이를 더하다) — 나와 친구(컴퓨터)가 번갈아 주사위를 굴려요. 답을 다 쓰면 저절로 확인 */
const D3S_BOARD = ["240÷30", "135×24", "96÷32", "420÷60", "87÷25", "208×35", "476÷28", "350÷40", "314×26", "91÷13", "645÷43",
  "523×18", "77÷19", "936÷52", "160×45", "590÷80", "741÷39", "472×23", "880÷24", "54÷18", "609×32", "826÷59"];
function d3sParse(e) { const m = e.match(/^(\d+)([×÷])(\d+)$/); const a = +m[1], b = +m[3]; return m[2] === "×" ? { op: "×", a, b, p: a * b } : { op: "÷", a, b, q: Math.floor(a / b), r: a % b }; }
function d3sSpace(body, api, opt) {
  d3sStyle();
  const cells = ["출발"].concat(D3S_BOARD, ["도착"]), last = cells.length - 1, COLS = 6;
  const CW = 140, CH = 82;
  const cxy = i => { const r = Math.floor(i / COLS), c = r % 2 ? COLS - 1 - i % COLS : i % COLS; return [16 + c * (CW + 4), 12 + (3 - r) * (CH + 14)]; };
  const svg = makeSvg(880, 400);
  let me = 0, fr = 0, prev = 0, state = "roll", correct = 0, busy = false, done = false;
  const goal = opt.goal || 4;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: 880, height: 400, rx: 18, fill: "#EAF4E4" }));
    for (let i = 0; i < last; i++) {
      const [x1, y1] = cxy(i), [x2, y2] = cxy(i + 1);
      svg.append(svgEl("line", { x1: x1 + CW / 2, y1: y1 + CH / 2, x2: x2 + CW / 2, y2: y2 + CH / 2, stroke: "#9BC48A", "stroke-width": 6 }));
    }
    cells.forEach((t, i) => {
      const [x, y] = cxy(i), sp = i === 0 || i === last;
      svg.append(svgEl("rect", { x, y, width: CW, height: CH, rx: 16, fill: sp ? "#F7E3A1" : "#fff", stroke: sp ? TENT : "#6FA35E", "stroke-width": 3 }));
      svg.append(txt(x + CW / 2, y + CH / 2 + 2, t.replace(/([×÷])/, " $1 "), sp ? 26 : 24));
      if (!sp) svg.append(txt(x + 14, y + 13, String(i), 11, { fill: "#8a9" }));
    });
    const tok = (i, col, label, off) => { const [x, y] = cxy(i); svg.append(svgEl("circle", { cx: x + CW - 20 - off, cy: y + CH - 18, r: 18, fill: col, stroke: "#fff", "stroke-width": 3 }), txt(x + CW - 20 - off, y + CH - 17, label, 13, { fill: "#fff" })); };
    tok(fr, TENT, "친구", me === fr ? 40 : 0); tok(me, BLUE, "나", 0);
  };
  const dieBox = h("div", { class: "readout", style: "font-size:var(--fs-l);text-align:center" }, "주사위: -");
  const status = h("p", { class: "inst" }, "‘주사위 굴리기’를 눌러 시작해요.");
  const score = h("div", { class: "readout" });
  const log = h("div", { class: "d3slog" });
  const work = h("div");
  const rollB = h("button", { class: "ghost", style: "font-size:var(--fs-l)" }, "주사위 굴리기");
  const setScore = () => { score.textContent = `맞힌 계산 ${correct} / ${goal}`; };
  const move = (who, d, cb) => {
    let k = 0; busy = true;
    const tick = () => {
      if (k < d && (who === "me" ? me : fr) < last) { if (who === "me") me++; else fr++; k++; draw(); setTimeout(tick, 160); return; }
      busy = false; cb();
    };
    tick();
  };
  const ask = () => {
    const e = d3sParse(cells[me]); state = "answer"; work.innerHTML = "";
    const i1 = d3sNum(e.op === "×" ? "곱" : "몫", true), i2 = e.op === "÷" ? d3sNum("나머지") : null;
    const ins = i2 ? [i1, i2] : [i1];
    const fire = autoRun(() => state === "answer" && ins.every(d3sFilled), () => ins.map(x => x.value).join("|"), () => {
      api.tryOnce();
      const v1 = d3sVal(i1), v2 = i2 ? d3sVal(i2) : 0;
      const good = e.op === "×" ? v1 === e.p : (v1 === e.q && v2 === e.r);
      const shown = `${e.a}${e.op}${e.b}=${i1.value}${i2 ? "…" + i2.value : ""}`;
      log.prepend(h("div", {}, `${good ? "○" : "×"} 나: ${shown}`));
      work.innerHTML = "";
      if (good) {
        correct++; setScore();
        if (correct >= goal && !done) { done = true; api.done(`맞힌 계산 ${correct}번`, `계산을 ${correct}번 맞혔어요! 도착할 때까지 이어서 놀이해도 좋아요.`); }
        else api.hint("○ 친구가 계산기로 확인했어요. 맞았어요!");
      } else {
        me = prev; draw();
        api.fail(`친구가 계산기로 확인해 보니 답이 달라요. ${e.op === "÷" && v2 != null && v2 >= e.b ? `나머지는 ${e.b}보다 작아야 해요. ` : ""}규칙대로 말을 전에 있던 칸으로 돌려놓아요.`, shown);
      }
      friendTurn();
      return true;
    }, 900);
    d3sWatch(ins, fire);
    work.append(h("div", { class: "qitem d3scalc" }, h("div", { class: "jua" }, `${e.a} ${e.op} ${e.b} =`), i2 ? h("span", { class: "d3sqr" }, h("span", {}, "몫"), i1) : i1, i2 ? h("span", { class: "jua" }, "…") : null, i2 ? h("span", { class: "d3sqr" }, h("span", {}, "나머지"), i2) : null),
      h("p", { class: "d3snote" }, i2 ? "몫과 나머지를 다 쓰면 저절로 확인해요. 나머지가 없으면 0을 써요." : "곱을 다 쓰면 저절로 확인해요."));
    i1.focus();
    status.textContent = `${cells[me].replace(/([×÷])/, " $1 ")}${e.op === "÷" ? "의 몫과 나머지를" : "의 곱을"} 구해요.`;
  };
  const myRoll = () => {
    if (busy || state !== "roll") return api.hint(state === "answer" ? "먼저 칸에 있는 식을 계산해요." : state === "judge" ? "먼저 친구의 계산이 맞는지 ‘맞아요’나 ‘틀렸어요’를 눌러요." : state === "end" ? "놀이가 끝났어요. ‘처음부터’를 눌러 다시 할 수 있어요." : "친구 차례예요. 잠깐 기다려요.");
    const d = 1 + Math.floor(Math.random() * 6);
    dieBox.textContent = `주사위: ${d}`; prev = me;
    move("me", d, () => {
      if (me === last) { state = "end"; status.textContent = "도착! 내가 먼저 도착했어요."; if (!done) { done = true; api.done(`도착 · 맞힌 계산 ${correct}번`, "도착 칸에 먼저 도착했어요! 계산을 옳게 해서 이겼어요."); } return; }
      if (me === fr && me !== 0) { status.textContent = "친구 말이 있는 칸에 도착했어요! 주사위를 한 번 더 굴려요."; api.hint("친구 말이 있는 칸이라 주사위를 한 번 더 굴려요."); return; }
      ask();
    });
  };
  const friendTurn = () => {
    state = "friend"; status.textContent = "친구 차례예요…";
    setTimeout(() => {
      const d = 1 + Math.floor(Math.random() * 6), fprev = fr;
      dieBox.textContent = `친구 주사위: ${d}`;
      move("fr", d, () => {
        if (fr === last) { state = "end"; status.textContent = "친구가 먼저 도착했어요. ‘처음부터’를 눌러 다시 해 봐요."; return; }
        if (fr === me && fr !== 0) { log.prepend(h("div", {}, "친구: 내 말이 있는 칸이라 한 번 더 굴렸어요.")); return friendTurnAgain(fprev); }
        friendAnswer(fprev);
      });
    }, 500);
  };
  const friendTurnAgain = fprev => { const d = 1 + Math.floor(Math.random() * 6); dieBox.textContent = `친구 주사위: ${d}`; move("fr", d, () => { if (fr === last) { state = "end"; status.textContent = "친구가 먼저 도착했어요. ‘처음부터’를 눌러 다시 해 봐요."; return; } friendAnswer(fprev); }); };
  const friendAnswer = fprev => {
    const e = d3sParse(cells[fr]);
    const wrong = Math.random() < .3;
    let said;
    if (e.op === "×") { const T = Math.floor(e.b / 10), O = e.b % 10; said = wrong ? (O ? `${e.a * O + e.a * T}` : `${e.a * T}`) : `${e.p}`; }
    else said = wrong && e.q >= 2 ? `${e.q - 1} … ${e.r + e.b}` : wrong ? `${e.q + 1} … 0` : `${e.q}${e.r ? ` … ${e.r}` : ""}`;
    const real = e.op === "×" ? `${e.p}` : `${e.q}${e.r ? ` … ${e.r}` : ""}`;
    const isWrong = said !== real;
    state = "judge";
    status.textContent = `친구가 ${e.a} ${e.op} ${e.b} = ${said}${d3sP(said, "이가") === "이" ? "이라고" : "라고"} 했어요. 맞는지 확인해 주세요.`;
    work.innerHTML = "";
    const judgeF = ok => {
      if (state !== "judge") return;
      const right = ok === !isWrong;
      log.prepend(h("div", {}, `${isWrong ? "×" : "○"} 친구: ${e.a}${e.op}${e.b}=${said}`));
      if (isWrong) { fr = fprev; draw(); }
      work.innerHTML = ""; state = "roll";
      status.textContent = right ? `${isWrong ? "잘 찾았어요! 친구 말은 전에 있던 칸으로 돌아가요." : "맞아요. 친구가 옳게 계산했어요."} 이제 내 차례예요.` : `다시 계산해 보면 ${e.a} ${e.op} ${e.b} = ${d3sJ(real, "이에요")}. ${isWrong ? "친구 말은 전에 있던 칸으로 돌아가요." : ""} 이제 내 차례예요.`;
    };
    work.append(h("div", { class: "row" }, h("button", { class: "ghost", onclick: () => judgeF(true) }, "맞아요"), h("button", { class: "ghost", onclick: () => judgeF(false) }, "틀렸어요")));
  };
  rollB.onclick = myRoll;
  const reset = () => { me = 0; fr = 0; prev = 0; state = "roll"; work.innerHTML = ""; dieBox.textContent = "주사위: -"; status.textContent = "‘주사위 굴리기’를 눌러 시작해요."; draw(); };
  draw(); setScore();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", { style: "font-size:var(--fs-s)" }, opt.tip || `파란 말이 나, 주황 말이 친구예요. 계산을 ${goal}번 맞히거나 도착하면 이 계단을 통과해요.`),
    rollB, dieBox, status, work, score, h("button", { class: "ghost", onclick: () => { if (!busy) reset(); } }, "처음부터"), log)));
}
//@@LESSONS
const UNIT_STORY = { title: "과학 축제 준비 위원회", lines: [
  "우리 학교에 과학 축제가 열려요. 4학년 2반 26명이 과학 축제 준비 위원회를 맡았어요. 위원장 하준이와 서윤, 도윤, 지아, 민재, 예린이가 부스마다 준비를 나누어 맡아요.",
  "빨대 로켓·자석·탱탱볼·비눗방울 체험 키트를 주문할 때는 곱셈으로 세고, 재료를 모둠과 상자에 똑같이 나눌 때는 나눗셈을 해요. 예산은 어림셈으로 미리 살펴봐요.",
  "마지막에는 우리가 맡은 축제 부스 운영 계획을 발표해요."],
  one: "과학 축제 준비 위원회 · 체험 키트를 곱셈으로 세고, 재료를 나눗셈으로 나누고, 예산을 어림해요." };
const UNIT_KEYWORDS = ["곱해지는 수", "곱하는 수", "곱", "10배", "몇십", "몇십몇", "나누어지는 수", "나누는 수", "몫", "나머지", "몫 어림", "몫을 1 크게", "몫을 1 작게", "나누는 수 × 몫 + 나머지", "어림셈", "나누기 쉬운 수"];

/* ===== 3. 곱셈과 나눗셈 — 이야기 버전 (과학 축제 준비 위원회, 11차시) ===== */
const LESSONS = [
{
  id: "s1", no: 1, title: "과학 축제 준비 위원회가 되었어요", soop: "개념 찾기(S)",
  question: "과학 축제를 준비할 때 곱셈과 나눗셈은 언제 쓰일까요?",
  summary: "같은 수씩 여러 번 모으면 곱셈, 똑같이 나누거나 몇씩 묶으면 나눗셈을 써요. 이 단원에서는 (세 자리 수) × (두 자리 수)와 (두 자리 수)·(세 자리 수) ÷ (두 자리 수)를 배워요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기",
      inst: "우리 반(4학년 2반)이 학교 과학 축제 준비 위원회가 되었어요. 칠판의 준비 목록에 ‘빨대 로켓 빨대: 한 봉지에 136개씩 20봉지’, ‘고무 찰흙 180개: 한 바구니에 30개씩’, ‘과학 마술 참가자 92명: 23모둠으로’가 적혀 있어요. 세 칸에 한 가지씩 써서 붙여요.",
      hints: ["보여요: 준비 목록에 있는 수와 물건을 그대로 써요.", "생각해요: 곱셈으로 셀 것과 나눗셈으로 나눌 것을 떠올려요.", "궁금해요: 곱하는 수나 나누는 수가 두 자리일 때 궁금한 것을 써요."],
      render: (b, a) => panes(b, a, [
        { t: "보여요", e: "👀", ph: "~이 보여요", hint: "준비 목록에서 곱하거나 나누어야 하는 수를 써요", ex: ["빨대가 한 봉지에 136개씩 20봉지 있는 것이 보여요.", "과학 마술 참가자 92명을 23모둠으로 나누는 것이 보여요."] },
        { t: "생각해요", e: "💭", ph: "~인 것 같아요", hint: "어떤 셈을 쓰면 될지 생각해요", ex: ["136개씩 20봉지는 136 × 20으로 구하면 될 것 같아요.", "고무 찰흙 180개를 30개씩 담으면 180 ÷ 30으로 바구니 수를 구할 것 같아요."] },
        { t: "궁금해요", e: "❓", ph: "왜 ~일까? / 어떻게 ~할까?", hint: "곱셈과 나눗셈에서 궁금한 것", ex: ["곱하는 수가 두 자리이면 어떻게 계산할까?", "나누는 수가 23처럼 두 자리이면 몫을 어떻게 어림할까?"] }],
        { ok: "생각을 잘 모았어요! 같은 수씩 모으면 곱셈, 똑같이 나누면 나눗셈이에요." }) },
    { name: "그려 보기 — 트랙 조각 이어 붙이기",
      inst: "자석 자동차 경주 부스를 맡은 도윤이가 트랙을 만들어요. 트랙 조각 한 개의 길이는 125 cm예요. 조각 20개를 이어 붙이면 트랙은 몇 cm일까요? 막대를 움직여 조각을 이어 보세요.",
      hints: ["막대를 끝까지 움직여 조각 20개를 이어 봐요.", "125 × 2 = 250이에요. 20은 2의 10배예요."],
      render: (b, a) => d3sTrack(b, a, { len: 125, max: 20, unit: "cm", ask: [
        { q: "125 × 2 =", a: 250, unit: "cm" },
        { q: "125 × 20 =", a: 2500, unit: "cm", why: { "250": "125 × 2의 곱이에요. 20은 2의 10배이니 곱도 10배예요." } }],
        ok: "트랙은 2500 cm, 곧 25 m예요. 이런 (세 자리 수) × (몇십)을 이 단원에서 배워요." }) },
    { name: "말해 보기 — 3학년 때 배운 셈 떠올리기",
      inst: "서윤이가 3학년 때 배운 곱셈과 나눗셈을 떠올려 보자고 했어요. 계산하고, 나눗셈 하나는 맞는지 확인까지 해 보세요.",
      hints: ["(세 자리 수) × (한 자리 수)는 일의 자리부터 곱해요.", "나눗셈은 나누는 수 × 몫 + 나머지 = 나누어지는 수로 확인해요."],
      render: thenWhy((b, a) => d3sCalc(b, a, [{ mul: [214, 3] }, { mul: [42, 23] }, { div: [86, 4], chk: true }, { div: [532, 7] }],
        { ok: "3학년 때 배운 곱셈과 나눗셈을 잘 기억하고 있어요. 이제 수가 더 커진 곱셈과 나눗셈을 배워요." }),
        { q: "86 ÷ 4를 계산한 뒤 왜 4 × 21 + 2를 계산해 볼까요?", ph: "왜냐하면 ~",
          help: ["① 4 × 21 + 2가 얼마인지 봐요. → ② 나누어지는 수 86과 견주어요.", "‘왜냐하면 나누는 수 × 몫 + 나머지가 ~와 같으면 ~이기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 나누는 수 × 몫 + 나머지가 나누어지는 수 86과 같으면 나눗셈을 맞게 계산했다는 것을 알 수 있기 때문이에요." }) },
    { name: "약속하기 — 곱셈과 나눗셈이 필요한 때",
      inst: "곱셈과 나눗셈이 필요한 때를 말로 정리해요.",
      hints: ["‘몇씩 몇 번’은 곱셈이에요.", "‘몇씩 나누면 몇 묶음’, ‘똑같이 나누면 하나에 몇’은 나눗셈이에요."],
      render: (b, a) => blanks(b, a, ["같은 수를 여러 번 모을 때는 ", { o: ["곱셈", "나눗셈"], a: 0 }, "을, 똑같이 나누거나 몇씩 묶을 때는 ", { o: ["나눗셈", "덧셈"], a: 0 }, "을 써요. 나눗셈은 나누는 수 × 몫 + 나머지 = ", { o: ["나누어지는 수", "나누는 수"], a: 0 }, "로 맞는지 확인해요."]) },
    { name: "확인하기", inst: "과학 축제 준비 목록을 보고 알맞은 것을 골라 보세요.",
      hints: ["‘몇씩 몇 번’은 곱셈, ‘몇씩 나누면 몇 묶음’은 나눗셈이에요.", "여러 개 고르는 문제는 알맞은 것을 모두 골라요."],
      render: (b, a) => quiz(b, a, [
        { q: "탱탱볼 부스에서 종이컵을 한 줄에 48개씩 15줄 쌓았어요. 종이컵 수를 구하는 식은?", o: ["48 × 15", "48 ÷ 15", "48 + 15"], a: 0 },
        { q: "건전지 200개를 한 상자에 24개씩 담을 때 상자 수를 구하는 식은?", o: ["200 × 24", "200 ÷ 24", "200 − 24"], a: 1, why: { "0": "200개를 24개씩 묶어 몇 상자인지 구하므로 나눗셈이에요." } },
        { q: "나눗셈이 필요한 일을 모두 고르세요.", o: ["비눗방울 용액 864 mL를 36 mL씩 컵에 나누어요", "돋보기 32개의 값을 구해요", "참가자 92명을 23모둠으로 똑같이 나누어요", "트랙 조각 20개의 길이를 구해요"], a: [0, 2] }],
        { ok: "모으면 곱셈, 똑같이 나누거나 몇씩 묶으면 나눗셈이에요." }) }
  ],
  challenge: { inst: "도윤이의 트랙을 더 길게 만들어요.", hints: ["100 cm = 1 m예요.", "125 × 30은 125 × 3의 10배예요."],
    render: (b, a) => numbers(b, a, [
      { q: "트랙 조각 20개의 길이 2500 cm는 몇 m인가요?", a: 25, unit: "m" },
      { q: "트랙 조각 30개를 이으면 125 × 30 =", a: 3750, unit: "cm", why: { "375": "125 × 3의 곱이에요. 30은 3의 10배이니 10배 해요." } }],
      { ok: "2500 cm = 25 m, 125 × 30 = 3750 cm예요. 다음 차시에 (세 자리 수) × (몇십)을 자세히 알아봐요!" }) }
},
{
  id: "s2", no: 2, title: "빨대 로켓 키트를 주문해요 ― (세 자리 수) × (몇십)", soop: "개념 구축하기(O)",
  question: "136 × 20은 어떻게 계산할까요?",
  summary: "(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 10배 해요. 136 × 2 = 272이니까 136 × 20 = 2720이에요. 10배 하면 숫자가 한 자리씩 왼쪽으로 옮겨 가고 일의 자리에 0이 생겨요.",
  steps: [
    { name: "만져 보기 — 예상하고 확인하기",
      inst: "빨대 로켓 부스를 맡은 지아가 빨대를 한 봉지에 136개씩 20봉지 주문했어요. 세로 한 줄(136개씩 2봉지)씩 눌러 세어 보세요.",
      hints: ["세로 한 줄은 136 × 2 = 272개예요.", "272가 10번 있으니 272의 10배예요."],
      render: ruleFirst((b, a) => d3sBundles(b, a, { per: 136, k: 2, cols: 10, item: "빨대", bag: "봉지", ask: [
        { q: "136 × 2 =", a: 272 }, { q: "136 × 20은 136 × 2의 몇 배인가요?", a: 10, unit: "배" },
        { q: "136 × 20 =", a: 2720, why: { "272": "136 × 2의 곱이에요. 136 × 20은 그 10배예요." } }],
        ok: "20은 2의 10배이니까 136 × 20은 136 × 2 = 272의 10배인 2720이에요. 빨대는 2720개예요." }),
        { q: "136 × 2를 알면 136 × 20은 어떻게 구할 수 있을까요?", ph: "내 규칙: ~",
          help: ["① 20은 2의 몇 배인지 생각해요. → ② 곱하는 수가 그만큼 커지면 곱은 어떻게 될지 예상해요.", "‘내 규칙: 136 × 2의 곱을 ~배 하면 될 것 같아요.’ 꼴로 써요."],
          ans: "20은 2의 10배이므로 136 × 20은 136 × 2 = 272를 10배 한 2720이에요." }) },
    { name: "그려 보기 — 자릿값 표에서 10배 하기",
      inst: "체험 안내 스티커를 한 묶음에 258장씩 40묶음 인쇄해요. 258 × 4의 곱을 써서 자릿값 표에 넣고, 곱하는 수가 40이 되면 곱이 어떻게 되는지 숫자 줄을 옮겨 보세요.",
      hints: ["258 × 4 = 1032예요.", "곱하는 수가 10배가 되면 곱의 숫자가 한 자리씩 왼쪽으로 옮겨 가요."],
      render: (b, a) => d3sTenShift(b, a, { a: 258, m: 4, extra: [{ q: "700 × 5 = 3500이니까 700 × 50 =", a: 35000, why: { "3500": "700 × 5의 곱이에요. 10배 해야 해요." } }],
        ok: "258 × 40 = 10320, 700 × 50 = 35000. (세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 10배 해요." }) },
    { name: "말해 보기 — 까닭 말하기",
      inst: "(세 자리 수) × (몇십)을 어떻게 계산했는지 말로 정리하고 까닭을 써요.",
      hints: ["40은 4의 10배예요.", "258 × 4 = 1032를 10배 하면 일의 자리에 0이 생겨요."],
      render: thenWhy((b, a) => blanks(b, a, ["(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 ", { o: ["10배", "2배", "100배"], a: 0 }, " 한 값과 같아요. 258 × 4 = 1032일 때 258 × 40 = ", { o: ["10320", "1032", "103200"], a: 0 }, "이에요."]),
        { q: "곱하는 수가 4에서 40으로 바뀌면 왜 곱도 10배가 될까요?", ph: "왜냐하면 ~",
          help: ["① 40은 4의 몇 배인지 봐요. → ② 258씩 4번 모은 것과 40번 모은 것을 견주어요.", "‘왜냐하면 40은 4의 ~배라서 258씩 4번 모은 것을 ~번 모은 것과 같기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 40은 4의 10배라서 258씩 40번 모은 것은 258씩 4번 모은 것을 10번 모은 것과 같기 때문이에요." }) },
    { name: "약속하기 — 세로로 계산하기",
      inst: "약속: (세 자리 수) × (몇십)은 (세 자리 수) × (몇)을 계산하고 일의 자리에 0을 써요. 자석 체험용 자석을 한 상자에 307개씩 60상자 주문했어요. 307 × 60을 세로로 계산해 보세요.",
      hints: ["307 × 6 = 1842예요.", "1842를 10배 하면 일의 자리에 0이 생겨요."],
      render: (b, a) => d3sLongMul(b, a, { a: 307, b: 60, ok: "307 × 60 = 18420. 307 × 6 = 1842를 10배 했어요. 자석은 18420개예요." }) },
    { name: "확인하기", inst: "계산해 보세요.",
      hints: ["먼저 (세 자리 수) × (몇)을 구하고 10배 해요.", "426 × 3 = 1278, 175 × 4 = 700이에요."],
      render: (b, a) => d3sCalc(b, a, [{ mul: [426, 30] }, { mul: [500, 70] }, { mul: [815, 20] },
        { q: "고무줄이 한 봉지에 175개씩 들어 있어요. 40봉지에 든 고무줄은 175 × 40 =", a: 7000, unit: "개", why: { "700": "175 × 4의 곱이에요. 10배 해야 해요." } }],
        { ok: "(세 자리 수) × (몇십)을 잘 계산했어요!" }) }
  ],
  challenge: { inst: "곱셈식의 □ 안의 수를 찾고, 두 곱의 크기를 견주어 보세요.", hints: ["638 × 4 = 2552예요.", "512 × 7 = 3584, 468 × 8 = 3744예요."],
    render: (b, a) => numbers(b, a, [
      { q: "638 × □0 = 25520일 때 □ =", a: 4, why: { "40": "□ 안에는 한 자리 수가 들어가요. 638 × 4 = 2552예요." } },
      { q: "512 × 70 =", a: 35840 },
      { q: "468 × 80 =", a: 37440 }],
      { ok: "638 × 40 = 25520이에요. 35840 < 37440이니 468 × 80의 곱이 더 커요." }) }
},
{
  id: "s3", no: 3, title: "자석 클립을 세어요 ― (세 자리 수) × (몇십몇)", soop: "개념 구축하기(O)",
  question: "248 × 16은 어떻게 계산할까요?",
  summary: "(세 자리 수) × (몇십몇)은 몇십몇을 몇십과 몇으로 나누어, 세 자리 수에 일의 자리 수를 곱한 값과 십의 자리 수를 곱한 값을 더해요. 계산하기 전에 어림하면 답이 알맞은지 알 수 있어요.",
  steps: [
    { name: "만져 보기 — 예상하고 확인하기",
      inst: "자석 체험 부스를 맡은 민재가 클립을 한 상자에 248개씩 16상자 준비했어요. 먼저 어림하고, 주황 선을 끌어 16상자를 계산하기 쉬운 두 묶음으로 나누어 보세요.",
      hints: ["248을 200으로, 16을 20으로 어림해요.", "16상자는 10상자와 6상자로 나눌 수 있어요."],
      render: ruleFirst((b, a) => d3sArea(b, a, { a: 248, b: 16, item: "클립", rowName: "상자", tip: "한 줄이 한 상자(248개)예요. 주황 선을 끌어 16상자를 계산하기 쉬운 두 묶음으로 나누어 보세요. 선을 놓으면 저절로 살펴봐요.",
        est: { q: "클립은 모두 몇 개쯤일까요?", o: ["400개쯤", "4000개쯤", "40000개쯤"], a: 1, why: { 0: "248을 200으로, 16을 20으로 어림하면 200의 20배예요.", 2: "200의 20배는 4000이에요. 너무 커요." }, ok: "248을 200으로, 16을 20으로 어림하면 200 × 20 = 4000, 4000개쯤이에요." },
        ok: "248 × 16 = 2480 + 1488 = 3968. 클립은 3968개로, 어림한 4000개와 가까워요." }),
        { q: "16상자를 어떻게 나누면 계산하기 쉬울까요?", ph: "내 규칙: ~",
          help: ["① 16을 몇십과 몇으로 나누어 봐요. → ② 두 부분을 따로 곱한 다음 어떻게 할지 생각해요.", "‘내 규칙: 16상자를 ~상자와 ~상자로 나누어 각각 곱한 다음 ~하면 될 것 같아요.’ 꼴로 써요."],
          ans: "16상자를 10상자와 6상자로 나누어 248 × 10 = 2480과 248 × 6 = 1488을 구하고 더하면 3968이에요." }) },
    { name: "그려 보기 — 세로로 계산하기",
      inst: "자석 팽이 부스에 쓸 둥근 자석을 한 상자에 286개씩 34상자 주문했어요. 286 × 34를 세로로 계산해 보세요. 286 × 4, 286 × 30을 차례로 쓰고 더해요.",
      hints: ["286 × 4 = 1144예요.", "286 × 30 = 8580이에요. 둘째 줄은 일의 자리 0을 생략할 수 있어요."],
      render: (b, a) => d3sLongMul(b, a, { a: 286, b: 34, ok: "286 × 34 = 1144 + 8580 = 9724. 둥근 자석은 9724개예요." }) },
    { name: "말해 보기 — 까닭 말하기",
      inst: "286 × 34를 어떻게 계산했는지 정리하고 까닭을 써요.",
      hints: ["34 = 30 + 4예요.", "34의 3은 30을 나타내요."],
      render: thenWhy((b, a) => blanks(b, a, ["(세 자리 수) × (몇십몇)은 세 자리 수에 몇십몇의 ", { o: ["일의 자리 수", "백의 자리 수"], a: 0 }, "를 곱한 값과 ", { o: ["십의 자리 수", "일의 자리 수"], a: 0 }, "를 곱한 값을 ", { o: ["더해요", "빼요"], a: 0 }, ". 286 × 34에서 둘째 줄은 실제로 286 × ", { o: ["30", "3"], a: 0 }, "의 곱이에요."]),
        { q: "둘째 줄의 곱 8580을 쓸 때 왜 한 자리 왼쪽으로 밀어 쓸까요?", ph: "왜냐하면 ~",
          help: ["① 34의 3이 실제로 나타내는 수를 생각해요. → ② 286 × 3과 286 × 30을 견주어요.", "‘왜냐하면 34의 3은 ~을 나타내서 286 × 30은 286 × 3의 ~배이기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 34의 3은 30을 나타내서 286 × 30은 286 × 3 = 858의 10배인 8580이기 때문이에요." }) },
    { name: "약속하기 — 어림해서 확인하기",
      inst: "약속: 곱하기 전에 곱해지는 수와 곱하는 수를 어림하면 계산이 알맞은지 알 수 있어요. 지아는 탐구 노트 405권에 스티커를 26장씩 붙인다며 405 × 26을 1170이라고 계산했어요. 먼저 어림해 보세요.",
      hints: ["405는 400쯤, 26은 30쯤이에요.", "405 × 26 = 405 × 6 + 405 × 20이에요."],
      render: (b, a) => predictCheck(b, a, {
        ask: "405 × 26은 약 얼마일까요?", o: ["약 1200", "약 12000", "약 120000"], a: 1,
        then: "이제 실제로 계산해 보세요. 405 × 26 =", real: 10530, unit: "장",
        why: "405를 400, 26을 30으로 어림하면 약 12000이에요. 지아는 405를 45처럼 계산해서 1170이 나왔어요. 어림해 보면 잘못을 바로 찾을 수 있어요." }) },
    { name: "확인하기", inst: "계산해 보세요. 먼저 어림해 보면 잘못 계산한 것을 찾기 쉬워요.",
      hints: ["527 × 36 = 527 × 6 + 527 × 30", "904의 십의 자리 0을 빠뜨리지 않아요. 904 × 17은 900 × 20 = 18000쯤이에요."],
      render: (b, a) => d3sCalc(b, a, [{ mul: [527, 36] }, { mul: [618, 45] },
        { mul: [904, 17], why: { "1598": "904를 94처럼 계산했어요. 904 × 17은 900 × 20 = 18000쯤이어야 해요. 십의 자리 0을 살려서 다시 계산해 봐요." } },
        { q: "체험 카드를 한 묶음에 165장씩 24묶음 만들었어요. 체험 카드는 165 × 24 =", a: 3960, unit: "장" }],
        { ok: "(세 자리 수) × (몇십몇)을 잘 계산했어요!" }) }
  ],
  challenge: { inst: "수 카드 2, 4, 5, 7, 9를 한 번씩 모두 사용하여 가장 큰 세 자리 수와 가장 작은 두 자리 수를 만들고, 두 수의 곱을 구해 보세요.", hints: ["가장 큰 세 자리 수는 큰 수부터 높은 자리에 놓아요.", "남은 두 장으로 가장 작은 두 자리 수를 만들어요."],
    render: (b, a) => d3sCards(b, a, { cards: [2, 4, 5, 7, 9], mode: "mul", ok: "975 × 24 = 23400이에요. 수 카드로 만든 두 수의 곱을 구했어요!" }) }
},
{
  id: "s4", no: 4, title: "고무 찰흙을 바구니에 나누어요 ― 몇십으로 나누기", soop: "개념 구축하기(O)",
  question: "180 ÷ 30과 293 ÷ 40은 어떻게 계산할까요?",
  summary: "(몇십)으로 나눌 때는 곱셈으로 몫을 어림해요. 나머지가 나누는 수보다 크거나 같으면 몫을 1 크게, 나누는 수 × 몫이 나누어지는 수보다 크면 몫을 1 작게 해요. 나머지는 나누는 수보다 작아야 해요.",
  steps: [
    { name: "만져 보기 — 예상하고 확인하기",
      inst: "탱탱볼 부스를 맡은 예린이가 고무 찰흙 180개를 한 바구니에 30개씩 담으려고 해요. 수 모형을 30씩 묶어 필요한 바구니 수를 알아보세요.",
      hints: ["백 모형 1개는 십 모형 10개와 같아요.", "30은 십 모형 3개예요."],
      render: ruleFirst((b, a) => d3sBlocks(b, a, { n: 180, d: 30, item: "고무 찰흙", unit: "개", ask: [
        { q: "십 모형 3개씩 몇 묶음인가요?", a: 6, unit: "묶음" }, { q: "180 ÷ 30 =", a: 6 }, { q: "확인: 30 × 6 =", a: 180 }],
        ok: "18 ÷ 3 = 6이니까 180 ÷ 30 = 6. 30 × 6 = 180이므로 바구니는 6개 필요해요." }),
        { q: "180 ÷ 30의 몫은 어떻게 구할 수 있을까요?", ph: "내 규칙: ~",
          help: ["① 180과 30은 각각 십이 몇 개인지 세어요. → ② 십 모형끼리 나누면 어떨지 생각해요.", "‘내 규칙: 180 ÷ 30은 ~ ÷ ~과 몫이 같을 것 같아요.’ 꼴로 써요."],
          ans: "180은 십이 18개, 30은 십이 3개이므로 180 ÷ 30은 18 ÷ 3 = 6과 몫이 같아요." }) },
    { name: "그려 보기 — 몫 어림하고 고치기",
      inst: "실험 안내 카드 293장을 한 모둠에 40장씩 묶으려고 해요. 몫을 6, 8, 7로 어림해 보며 막대에서 무엇이 달라지는지 살펴보고 몫과 나머지를 구해요.",
      hints: ["몫이 6이면 나머지 53이 40보다 커요.", "몫이 8이면 40 × 8 = 320이라 뺄 수 없어요."],
      render: (b, a) => d3sQuotTry(b, a, { n: 293, d: 40, need: true, names: ["묶음", "남는 카드"], units: ["묶음", "장"], ok: "40 × 7 = 280이므로 몫은 7, 나머지는 293 − 280 = 13이에요. 280 + 13 = 293이니 맞아요." }) },
    { name: "말해 보기 — 까닭 말하기",
      inst: "몫을 고치는 방법을 정리하고 까닭을 써요.",
      hints: ["나머지가 나누는 수보다 크면 더 나눌 수 있어요.", "나누는 수 × 몫이 나누어지는 수보다 크면 뺄 수 없어요."],
      render: thenWhy((b, a) => blanks(b, a, ["어림한 몫으로 계산했을 때 나머지가 나누는 수보다 크거나 같으면 몫을 1 ", { o: ["크게", "작게"], a: 0 }, " 해요. 나누는 수 × 몫이 나누어지는 수보다 커서 뺄 수 없으면 몫을 1 ", { o: ["작게", "크게"], a: 0 }, " 해요. 나머지는 언제나 나누는 수보다 ", { o: ["작아야", "커야"], a: 0 }, " 해요."]),
        { q: "나머지가 나누는 수보다 크면 왜 몫을 1 크게 해야 할까요?", ph: "왜냐하면 ~",
          help: ["① 몫을 6으로 했을 때 남은 53장을 떠올려요. → ② 53장으로 40장 묶음을 하나 더 만들 수 있는지 봐요.", "‘왜냐하면 나머지에서 나누는 수를 한 번 더 뺄 수 있어서 ~을 하나 더 만들 수 있기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 나머지에서 나누는 수를 한 번 더 뺄 수 있어서 묶음을 하나 더 만들 수 있기 때문이에요." }) },
    { name: "약속하기 — 세로로 계산하기",
      inst: "약속: (몇십)으로 나눌 때는 나누는 수에 몇을 곱해야 나누어지는 수보다 크지 않으면서 가장 가까운지 생각해 몫을 정해요. 물감 458 mL를 70 mL씩 통에 나누어 담아요. 458 ÷ 70을 세로로 계산해 보세요.",
      hints: ["70 × 6 = 420, 70 × 7 = 490이에요.", "몫은 일의 자리 위에 써요."],
      render: (b, a) => d3sLongDiv(b, a, { n: 458, d: 70, chk: true, ok: "458 ÷ 70 = 6 … 38. 70 × 6 = 420, 420 + 38 = 458이에요. 물감 통 6개를 채우고 38 mL가 남아요." }) },
    { name: "확인하기", inst: "계산해 보세요.",
      hints: ["20 × 4 = 80, 50 × 7 = 350, 60 × 8 = 480이에요.", "자석은 30 × 8 = 240개를 담고 남아요."],
      render: (b, a) => d3sCalc(b, a, [{ div: [87, 20] }, { div: [350, 50] }, { div: [513, 60] },
        { div: [245, 30], q: "자석 245개를 한 상자에 30개씩 담으면", names: ["상자", "남는 자석"], units: ["상자", "개"] }],
        { ok: "몇십으로 나누는 나눗셈을 잘 했어요! 자석은 8상자에 담고 5개가 남아요." }) }
  ],
  challenge: { inst: "민재가 227 ÷ 40을 계산했어요. 40 × 4 = 160, 160 + 67 = 227이니 맞다고 해요. 정말 맞을까요?", hints: ["민재가 쓴 나머지와 나누는 수 40을 견주어 봐요.", "67에서 40을 한 번 더 뺄 수 있어요."],
    render: (b, a) => d3sFixDiv(b, a, { n: 227, d: 40, wq: 4, ra: 1, who: "민재",
      reasons: ["40 × 4를 잘못 계산했어요.", "나머지 67이 나누는 수 40보다 커서 더 나눌 수 있어요.", "227에서 160을 잘못 뺐어요."],
      why: { 0: "40 × 4 = 160은 맞게 계산했어요.", 2: "227 − 160 = 67은 맞게 뺐어요." },
      ok: "227 ÷ 40 = 5 … 27. 확인한 식이 맞아 보여도 나머지가 나누는 수보다 크면 몫을 1 크게 해야 해요." }) }
},
{
  id: "s5", no: 5, title: "과학 마술 모둠을 나누어요 ― 몫이 한 자리 수인 나눗셈", soop: "개념 구축하기(O)",
  question: "92 ÷ 23과 213 ÷ 47은 어떻게 계산할까요?",
  summary: "몫이 한 자리 수인 나눗셈은 나누는 수에 몇을 곱해야 나누어지는 수보다 크지 않으면서 가장 가까운지 어림해 몫을 구해요. 나누는 수 × 몫 + 나머지 = 나누어지는 수로 확인해요.",
  steps: [
    { name: "만져 보기 — 예상하고 확인하기",
      inst: "과학 마술 체험에 92명이 참가해요. 23모둠으로 똑같이 나누면 한 모둠은 몇 명일까요? 몫을 3, 5, 4로 어림해 보세요.",
      hints: ["92를 90으로, 23을 20으로 어림하면 몫은 4쯤이에요.", "몫이 3이면 나머지가 23이라서 더 나눌 수 있어요."],
      render: ruleFirst((b, a) => d3sQuotTry(b, a, { n: 92, d: 23, need: true, names: ["한 모둠", "나머지"], units: ["명", "명"], ok: "23 × 4 = 92이므로 92 ÷ 23 = 4. 한 모둠은 4명이에요." }),
        { q: "92 ÷ 23의 몫을 어떻게 어림하면 좋을까요?", ph: "내 규칙: ~",
          help: ["① 92와 23을 계산하기 쉬운 몇십으로 바꾸어 봐요. → ② 바꾼 수로 몫을 생각해요.", "‘내 규칙: 92를 ~으로, 23을 ~으로 어림하면 몫은 ~쯤일 것 같아요.’ 꼴로 써요."],
          ans: "92를 90으로, 23을 20으로 어림하면 몫은 4쯤이에요. 23 × 4 = 92이므로 몫은 4예요." }) },
    { name: "그려 보기 — 곱셈표로 몫 어림하기",
      inst: "실험 관찰 기록지 213장을 47장씩 묶어 모둠에 나누어 주려고 해요. 47에 몇을 곱해야 213보다 크지 않으면서 213에 가장 가까울까요?",
      hints: ["213을 200으로, 47을 50으로 어림하면 몫은 4쯤이에요.", "47 × 4 = 188, 47 × 5 = 235예요."],
      render: (b, a) => d3sTable(b, a, { n: 213, d: 47, ks: [3, 4, 5], names: ["묶음", "남는 기록지"], units: ["묶음", "장"], ok: "47 × 4 = 188이므로 몫은 4, 나머지는 213 − 188 = 25예요." }) },
    { name: "말해 보기 — 까닭 말하기",
      inst: "몫이 한 자리 수인 나눗셈을 어떻게 계산했는지 정리하고 까닭을 써요.",
      hints: ["곱셈식을 이용해 몫을 어림했어요.", "47 × 5 = 235는 213보다 커요."],
      render: thenWhy((b, a) => blanks(b, a, ["213 ÷ 47에서 47 × 4 = 188이므로 몫은 ", { o: ["4", "5", "2"], a: 0 }, "예요. 나머지를 구하는 식은 ", { o: ["213 − 188", "213 − 47", "235 − 213"], a: 0 }, "이에요. 나머지는 나누는 수 47보다 ", { o: ["작아야", "커야"], a: 0 }, " 해요."]),
        { q: "47 × 5 = 235를 몫으로 쓰지 않은 까닭은 무엇일까요?", ph: "왜냐하면 ~",
          help: ["① 235와 213의 크기를 견주어요. → ② 213에서 235를 뺄 수 있는지 생각해요.", "‘왜냐하면 235는 213보다 ~서 ~ 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 235는 213보다 커서 213에서 뺄 수 없기 때문이에요." }) },
    { name: "약속하기 — 세로로 계산하기",
      inst: "약속: 나누는 수가 몇십몇이면 나누는 수와 나누어지는 수를 몇십, 몇백몇십으로 어림해 몫을 정하고, 알맞지 않으면 1 크게나 1 작게 고쳐요. 탐구 쪽지 347장을 58장씩 묶어요. 347 ÷ 58을 세로로 계산해 보세요.",
      hints: ["347을 350으로, 58을 60으로 어림하면 몫은 5쯤이에요.", "58 × 5 = 290, 58 × 6 = 348이에요."],
      render: (b, a) => d3sLongDiv(b, a, { n: 347, d: 58, chk: true, ok: "347 ÷ 58 = 5 … 57. 58 × 6 = 348은 347보다 1 커서 몫은 5예요." }) },
    { name: "확인하기", inst: "계산해 보세요.",
      hints: ["26 × 3 = 78, 32 × 2 = 64, 54 × 8 = 432예요.", "건전지는 24 × 8 = 192개를 담고 남아요."],
      render: (b, a) => d3sCalc(b, a, [{ div: [78, 26] }, { div: [95, 32] }, { div: [432, 54] },
        { div: [200, 24], q: "건전지 200개를 한 상자에 24개씩 담으면", names: ["상자", "남는 건전지"], units: ["상자", "개"] }],
        { ok: "몫이 한 자리 수인 나눗셈을 잘 했어요! 건전지는 8상자에 담고 8개가 남아요." }) }
  ],
  challenge: { inst: "거꾸로 생각해 보세요.", hints: ["나누어지는 수 = 나누는 수 × 몫 + 나머지예요.", "깃발 15개 사이의 간격은 14군데예요."],
    render: (b, a) => numbers(b, a, [
      { q: "□ ÷ 36 = 6 … 25일 때 □ =", a: 241, why: { "216": "36 × 6 = 216에 나머지 25를 더해야 해요." } },
      { q: "길이가 112 m인 축제 길의 처음부터 끝까지 깃발 15개를 같은 간격으로 세우면 간격은 몇 m인가요?", a: 8, unit: "m", why: { "7": "깃발 15개 사이의 간격은 15군데가 아니라 14군데예요." } }],
      { ok: "36 × 6 + 25 = 241, 112 ÷ 14 = 8이에요. 거꾸로도 잘 생각했어요!" }) }
},
{
  id: "s6", no: 6, title: "비눗방울 용액을 나누어요 ― 몫이 두 자리 수이고 나누어떨어지는 나눗셈", soop: "개념 구축하기(O)",
  question: "864 ÷ 36은 어떻게 계산할까요?",
  summary: "몫이 두 자리 수인 나눗셈은 몫을 십의 자리와 일의 자리로 나누어 구해요. 864 ÷ 36은 36 × 20 = 720을 빼고, 남은 144에서 36 × 4 = 144를 빼서 몫이 24예요.",
  steps: [
    { name: "만져 보기 — 예상하고 확인하기",
      inst: "비눗방울 부스를 맡은 서윤이가 비눗방울 용액 864 mL를 컵에 36 mL씩 나누어 담으려고 해요. 먼저 몇십 개쯤인지 어림하고, 360 mL(컵 10개)씩 크게 뛰고 36 mL씩 뛰어 보세요.",
      hints: ["36 × 10 = 360, 36 × 20 = 720, 36 × 30 = 1080이에요.", "720까지 크게 두 번 뛰고, 남은 144에서 36씩 네 번 뛰어요."],
      render: ruleFirst((b, a) => d3sJumpDiv(b, a, { n: 864, d: 36, names: ["컵", "남는 용액"], units: ["개", "mL"],
        est: { q: "용액을 담은 컵은 몇십 개쯤 될까요?", o: ["2개쯤", "20개쯤", "200개쯤"], a: 1, why: { 0: "36 × 10 = 360도 864보다 작아요. 몇십 개예요.", 2: "36 × 200은 7200이에요. 너무 커요." }, ok: "864를 800으로, 36을 40으로 어림하면 800 ÷ 40 = 20, 20개쯤이에요." },
        ok: "36 × 20 = 720, 36 × 4 = 144이니 864 ÷ 36 = 24. 컵 24개에 담을 수 있어요." }),
        { q: "864 ÷ 36의 몫은 한 자리 수일까요, 두 자리 수일까요? 어떻게 알 수 있을까요?", ph: "내 규칙: ~",
          help: ["① 36 × 10이 얼마인지 구해 864와 견주어요. → ② 몫이 10보다 큰지 작은지 생각해요.", "‘내 규칙: 36 × 10이 864보다 ~으므로 몫은 ~ 자리 수일 것 같아요.’ 꼴로 써요."],
          ans: "36 × 10 = 360이 864보다 작으므로 몫은 10보다 커서 두 자리 수예요. 실제로 36 × 24 = 864라서 몫은 24예요." }) },
    { name: "그려 보기 — 세로로 계산하기",
      inst: "864 ÷ 36을 세로로 계산해 보세요. 몫의 십의 자리부터 구해요.",
      hints: ["36 × 20 = 720이므로 몫의 십의 자리는 2예요.", "864 − 720 = 144, 36 × 4 = 144예요."],
      render: (b, a) => d3sLongDiv(b, a, { n: 864, d: 36, chk: true, ok: "864 ÷ 36 = 24. 36 × 24 = 864이므로 맞아요." }) },
    { name: "말해 보기 — 까닭 말하기",
      inst: "몫이 두 자리 수인 나눗셈을 어떻게 계산했는지 정리하고 까닭을 써요.",
      hints: ["몫 24는 20과 4를 더한 수예요.", "36 × 30 = 1080은 864보다 커요."],
      render: thenWhy((b, a) => blanks(b, a, ["몫이 두 자리 수인 나눗셈은 몫을 ", { o: ["십의 자리와 일의 자리", "백의 자리와 십의 자리"], a: 0 }, "로 나누어 구해요. 864 ÷ 36에서 먼저 36 × ", { o: ["20", "2", "30"], a: 0 }, " = 720을 빼고, 남은 144에서 36 × 4 = 144를 빼요. 그래서 몫은 ", { o: ["24", "42", "204"], a: 0 }, "예요."]),
        { q: "864에서 36 × 20을 먼저 빼는 까닭은 무엇일까요?", ph: "왜냐하면 ~",
          help: ["① 36 × 10, 36 × 20, 36 × 30을 구해 864와 견주어요. → ② 864에서 뺄 수 있는 가장 큰 것을 찾아요.", "‘왜냐하면 36 × 30 = 1080은 864보다 커서 뺄 수 있는 가장 큰 몇십 번은 ~번이기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 36 × 30 = 1080은 864보다 커서 864에서 36을 뺄 수 있는 가장 큰 몇십 번은 20번이기 때문이에요." }) },
    { name: "약속하기 — 곱셈표로 몫 어림하기",
      inst: "약속: 몫이 두 자리 수이면 몫의 십의 자리부터 구하고, 남은 수로 몫의 일의 자리를 구해요. 축제 홍보 전단 992장을 31장씩 묶어요. 31 × 20, 31 × 30, 31 × 40을 구해 992가 어디에 있는지 보세요.",
      hints: ["992를 900으로, 31을 30으로 어림하면 몫은 30쯤이에요.", "992 − 930 = 62, 31 × 2 = 62예요."],
      render: (b, a) => d3sTable(b, a, { n: 992, d: 31, ks: [20, 30, 40], names: ["묶음", "남는 전단"], units: ["묶음", "장"], ok: "31 × 30 = 930, 31 × 2 = 62이니 992 ÷ 31 = 32예요. 31 × 32 = 992로 확인했어요." }) },
    { name: "확인하기", inst: "계산하고 계산이 맞는지 확인해 보세요.",
      hints: ["26 × 20 = 520, 17 × 40 = 680, 39 × 20 = 780이에요.", "몫의 십의 자리부터 구해요."],
      render: (b, a) => d3sCalc(b, a, [{ div: [598, 26] }, { div: [714, 17] }, { div: [975, 39], chk: true }],
        { ok: "몫이 두 자리 수이고 나누어떨어지는 나눗셈을 잘 했어요!" }) }
  ],
  challenge: { inst: "거꾸로 생각하고, 물 로켓 부품을 나누어 보세요.", hints: ["나누어떨어지면 나누어지는 수 = 나누는 수 × 몫이에요.", "34 × 20 = 680, 816 − 680 = 136이에요."],
    render: (b, a) => numbers(b, a, [
      { q: "□ ÷ 24 = 31일 때 □ =", a: 744 },
      { q: "물 로켓 부품 816개를 한 세트에 34개씩 담으면 몇 세트인가요?", a: 24, unit: "세트" }],
      { ok: "24 × 31 = 744, 816 ÷ 34 = 24예요. 나누어떨어지는 나눗셈을 거꾸로도 생각했어요!" }) }
},
{
  id: "s7", no: 7, title: "안내 스티커를 나누어요 ― 몫이 두 자리 수이고 나머지가 있는 나눗셈", soop: "개념 구축하기(O)",
  question: "830 ÷ 38은 어떻게 계산할까요?",
  summary: "몫이 두 자리 수이고 나머지가 있는 나눗셈도 몫을 십의 자리와 일의 자리로 나누어 구해요. 마지막에 남은 수가 나머지이고, 나머지는 나누는 수보다 작아야 해요. 나누는 수 × 몫 + 나머지 = 나누어지는 수로 확인해요.",
  steps: [
    { name: "만져 보기 — 뛰어 세며 까닭 말하기",
      inst: "위원장 하준이가 부스 안내 스티커 830장을 한 모둠에 38장씩 나누어 주려고 해요. 380장(10모둠)씩 크게 뛰고 38장씩 뛰어 몇 모둠까지 줄 수 있는지 알아보세요.",
      hints: ["38 × 20 = 760이에요.", "830 − 760 = 70에서 38을 한 번 더 뺄 수 있어요."],
      render: thenWhy((b, a) => d3sJumpDiv(b, a, { n: 830, d: 38, names: ["모둠", "남는 스티커"], units: ["모둠", "장"],
        est: { q: "몇 모둠쯤에 줄 수 있을까요?", o: ["2모둠쯤", "20모둠쯤", "200모둠쯤"], a: 1, why: { 0: "38 × 10 = 380도 830보다 작아요. 몇십 모둠이에요.", 2: "38 × 200은 7600이에요. 너무 커요." }, ok: "830을 800으로, 38을 40으로 어림하면 800 ÷ 40 = 20, 20모둠쯤이에요." },
        ok: "830 ÷ 38 = 21 … 32. 21모둠에 주고 스티커 32장이 남아요." }),
        { q: "남은 32장으로는 왜 한 모둠에 더 줄 수 없을까요?", ph: "왜냐하면 ~",
          help: ["① 한 모둠에 주는 스티커 수를 떠올려요. → ② 남은 32장과 견주어요.", "‘왜냐하면 32장은 한 모둠에 줄 ~장보다 ~기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 32장은 한 모둠에 줄 38장보다 적기 때문이에요. 그래서 32가 나머지예요." }) },
    { name: "그려 보기 — 세로로 계산하기",
      inst: "830 ÷ 38을 세로로 계산하고 맞는지 확인해 보세요.",
      hints: ["38 × 20 = 760이에요.", "70에서 38 × 1 = 38을 빼면 32가 남아요."],
      render: (b, a) => d3sLongDiv(b, a, { n: 830, d: 38, chk: true, ok: "830 ÷ 38 = 21 … 32. 38 × 21 = 798, 798 + 32 = 830이에요." }) },
    { name: "말해 보기 — 까닭 말하기",
      inst: "나머지가 있는 나눗셈에서 확인할 것을 정리하고 까닭을 써요.",
      hints: ["나머지 32와 나누는 수 38을 견주어 봐요.", "38 × 22 = 836이에요."],
      render: thenWhy((b, a) => blanks(b, a, ["830 ÷ 38의 몫은 ", { o: ["21", "20", "22"], a: 0 }, ", 나머지는 32예요. 나머지는 나누는 수보다 ", { o: ["작아야", "커야"], a: 0 }, " 해요. 계산이 맞는지 38 × 21 = 798, 798 + 32 = ", { o: ["830", "820", "800"], a: 0 }, "으로 확인해요."]),
        { q: "몫을 22로 하지 않은 까닭은 무엇일까요?", ph: "왜냐하면 ~",
          help: ["① 38 × 22를 구해 봐요. → ② 830과 견주어요.", "‘왜냐하면 38 × 22 = ~은 830보다 커서 ~ 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 38 × 22 = 836은 830보다 커서 830에서 뺄 수 없기 때문이에요." }) },
    { name: "약속하기 — 곱셈표로 몫 어림하기",
      inst: "약속: 나머지가 있어도 몫의 십의 자리부터 구하고, 마지막에 남은 수가 나누는 수보다 작은지 확인해요. 탐구 보고서 표지 671장을 29장씩 묶어요. 29 × 10, 29 × 20, 29 × 30을 구해 몫을 어림해 보세요.",
      hints: ["671을 600으로, 29를 30으로 어림하면 몫은 20쯤이에요.", "671 − 580 = 91, 29 × 3 = 87이에요."],
      render: (b, a) => d3sTable(b, a, { n: 671, d: 29, ks: [10, 20, 30], names: ["묶음", "남는 표지"], units: ["묶음", "장"], ok: "671 ÷ 29 = 23 … 4. 29 × 23 = 667, 667 + 4 = 671이에요." }) },
    { name: "확인하기", inst: "계산해 보세요.",
      hints: ["21 × 20 = 420, 45 × 10 = 450, 27 × 20 = 540이에요.", "종이컵은 42개씩 쌓아요. 42 × 20 = 840이에요."],
      render: (b, a) => d3sCalc(b, a, [{ div: [485, 21] }, { div: [763, 45] }, { div: [600, 27] },
        { div: [925, 42], q: "종이컵 925개를 한 탑에 42개씩 쌓으면", names: ["탑", "남는 종이컵"], units: ["개", "개"] }],
        { ok: "몫이 두 자리 수이고 나머지가 있는 나눗셈을 잘 했어요! 종이컵 탑은 22개를 쌓고 1개가 남아요." }) }
  ],
  challenge: { inst: "수 카드 1, 4, 5, 7, 9를 한 번씩 모두 사용하여 몫이 가장 큰 (세 자리 수) ÷ (두 자리 수)를 만들고 계산해 보세요.", hints: ["나누어지는 수는 가장 크게, 나누는 수는 가장 작게 만들어요.", "가장 큰 세 자리 수는 975, 남은 카드로 만든 가장 작은 두 자리 수는 14예요."],
    render: (b, a) => d3sCards(b, a, { cards: [1, 4, 5, 7, 9], mode: "div", ok: "975 ÷ 14 = 69 … 9. 몫이 가장 큰 나눗셈을 만들었어요!" }) }
},
{
  id: "s8", no: 8, title: "축제 예산을 어림해요 ― 어림셈", soop: "개념 구축하기(O)",
  question: "준비물 값이나 줄 수를 어떻게 하면 빠르게 어림할 수 있을까요?",
  summary: "곱셈은 곱해지는 수와 곱하는 수를 가까운 몇백, 몇십으로 어림해 계산해요. 나눗셈은 나누어지는 수를 나누기 쉬운 수로 바꾸어 계산해요. 어림하는 방법에 따라 어림한 값이 다를 수 있어요.",
  steps: [
    { name: "만져 보기 — 곱셈 어림하기",
      inst: "예산을 맡은 지아가 한 개에 680원인 돋보기를 32개 사려고 해요. 680과 32를 각각 계산하기 쉬운 수로 어림해 보세요.",
      hints: ["680은 600과 700 중 700에 더 가까워요.", "32는 30과 40 중 30에 더 가까워요."],
      render: thenWhy((b, a) => d3sRoundLine(b, a, { items: [{ v: 680, lo: 600, hi: 700, step: 10, name: "돋보기 한 개의 값 680원" }, { v: 32, lo: 30, hi: 40, step: 1, name: "돋보기의 수 32개" }],
        ask: [{ q: "어림한 식 700 × 30 =", a: 21000, unit: "원 정도" }], ok: "680 × 32를 700 × 30으로 어림하면 21000원 정도의 돈이 필요해요." }),
        { q: "680을 600이 아니라 700으로 어림한 까닭은 무엇일까요?", ph: "왜냐하면 ~",
          help: ["① 680에서 600까지, 700까지의 차이를 견주어요. → ② 더 가까운 쪽을 말해요.", "‘왜냐하면 680은 ~보다 ~에 더 가깝기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 680은 600과 80만큼, 700과 20만큼 차이가 나서 700에 더 가깝기 때문이에요." }) },
    { name: "그려 보기 — 곱셈 어림하기 ⑵",
      inst: "풍선 부스에서 한 봉지에 310원인 풍선을 47봉지 사려고 해요. 얼마 정도의 돈이 필요할지 어림해 보세요.",
      hints: ["310은 300에 더 가까워요.", "47은 50에 더 가까워요."],
      render: (b, a) => d3sRoundLine(b, a, { items: [{ v: 310, lo: 300, hi: 400, step: 10, name: "풍선 한 봉지의 값 310원" }, { v: 47, lo: 40, hi: 50, step: 1, name: "풍선 47봉지" }],
        ask: [{ q: "어림한 식 300 × 50 =", a: 15000, unit: "원 정도" }], ok: "310 × 47을 300 × 50으로 어림하면 15000원 정도가 필요해요." }) },
    { name: "말해 보기 — 나눗셈 어림하기",
      inst: "관람석 방석 430개를 한 줄에 40개씩 놓으면 몇 줄쯤 될까요? 서윤이와 도윤이처럼 430 가까이에서 40으로 나누기 쉬운 수를 두 개 찾아보세요.",
      hints: ["40씩 뛰어 세어 봐요: 360, 400, 440, 480 …", "430보다 작은 쪽과 큰 쪽에서 하나씩 찾아요."],
      render: (b, a) => d3sCompat(b, a, { n: 430, d: 40, lo: 380, hi: 480, need: 2,
        ask: f => f.slice().sort((x, y) => x - y).map(t => ({ q: `${t} ÷ 40 =`, a: t / 40, unit: "줄쯤" })),
        ok: "서윤이처럼 400으로 어림하면 10줄쯤, 도윤이처럼 440으로 어림하면 11줄쯤이에요." }) },
    { name: "약속하기 — 어림한 방법 견주기",
      inst: "약속: 곱셈은 두 수를 가까운 몇백, 몇십으로, 나눗셈은 나누어지는 수를 나누기 쉬운 수로 바꾸어 어림해요. 서윤이와 도윤이가 어림한 방법을 견주어 보세요.",
      hints: ["430과 400, 430과 440을 견주어 봐요.", "어림셈은 계산하기 쉬운 수로 바꾸어 얼마쯤인지 아는 거예요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "서윤이는 430을 400으로 어림했어요. 나누어지는 수를 어떻게 어림했나요?", o: ["실제 수보다 작게 어림했어요", "실제 수보다 크게 어림했어요"], a: 0 },
        { q: "도윤이는 430을 440으로 어림했어요. 나누어지는 수를 어떻게 어림했나요?", o: ["실제 수보다 작게 어림했어요", "실제 수보다 크게 어림했어요"], a: 1 },
        { q: "어림셈에 대해 바른 말은?", o: ["어림한 답은 하나뿐이에요", "어림하는 방법에 따라 어림한 답이 다를 수 있어요", "정확히 계산한 다음 어림해야 해요"], a: 1, why: { "0": "서윤이는 10줄쯤, 도윤이는 11줄쯤으로 둘 다 알맞게 어림했어요.", "2": "어림셈은 계산하기 쉬운 수로 바꾸어 먼저 얼마쯤인지 아는 거예요." } }]),
        { q: "서윤이(10줄쯤)와 도윤이(11줄쯤)의 어림이 다른데 둘 다 알맞다고 할 수 있는 까닭은 무엇일까요?", ph: "왜냐하면 ~",
          help: ["① 400과 440이 430에 가까운지 봐요. → ② 두 수가 40으로 나누기 쉬운지 봐요.", "‘왜냐하면 둘 다 430에 ~ 40으로 ~ 수로 바꾸어 어림했기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 둘 다 430에 가까우면서 40으로 나누기 쉬운 수로 바꾸어 어림했기 때문이에요. 실제로는 430 ÷ 40 = 10 … 30이에요." }) },
    { name: "확인하기",
      inst: "간식을 맡은 예린이는 과자 170개를 20모둠에 나누어 주려고 해요. 한 모둠에 몇 개쯤 줄 수 있을지 어림해 보세요.",
      hints: ["20으로 나누기 쉬운 수: 160, 180", "160 ÷ 20 = 8, 180 ÷ 20 = 9예요."],
      render: (b, a) => d3sCompat(b, a, { n: 170, d: 20, lo: 130, hi: 210, need: 1,
        ask: f => [{ q: `${f[0]} ÷ 20 =`, a: f[0] / 20 }, { q: "한 모둠에 몇 개쯤 줄 수 있나요?", a: f[0] / 20, unit: "개쯤" }],
        ok: "170을 나누기 쉬운 수로 어림해 한 모둠에 줄 과자 수를 어림했어요." }) }
  ],
  challenge: { inst: "축제 예산은 25000원이에요. 한 개에 680원인 돋보기 32개를 사면 돈이 얼마나 남을까요?", hints: ["680 × 32 = 680 × 2 + 680 × 30", "25000에서 실제 값을 빼요."],
    render: (b, a) => numbers(b, a, [
      { q: "실제 값 680 × 32 =", a: 21760, unit: "원" },
      { q: "25000원에서 남는 돈은?", a: 3240, unit: "원" }],
      { ok: "680 × 32 = 21760원은 어림한 21000원과 가까워요. 남는 돈은 3240원이에요." }) }
},
{
  id: "s9", no: 9, title: "생각을 더하다 ― 체험 부스 재료비를 비교해요", soop: "탐구 정리하기(O)",
  question: "재료비를 아끼려면 어떤 체험 부스를 열어야 할까요?",
  summary: "부스마다 1인분 재료비를 모두 더해 비교하고, 참가자 수를 곱해 전체 재료비를 구해요. (세 자리 수) × (몇십몇)으로 필요한 돈을 계산할 수 있어요.",
  steps: [
    { name: "이해해요",
      inst: "위원회는 탱탱볼 부스와 비눗방울 부스 중 하나를 더 열려고 해요. 1인분 재료비는 탱탱볼 부스가 고무 가루 245원·색소 60원·종이컵 40원, 비눗방울 부스가 세제 150원·물엿 145원·종이컵 40원이에요. 체험할 사람은 32명이에요. 문제를 이해해요.",
      hints: ["두 부스의 1인분 재료비를 견주어야 해요.", "체험할 사람 수를 문제에서 찾아요."],
      render: (b, a) => quiz(b, a, [
        { q: "재료비가 더 적게 드는 부스를 고르려면 무엇을 견주어야 할까요?", o: ["두 부스의 1인분 재료비", "두 부스 이름의 길이", "두 부스 바구니의 색깔"], a: 0 },
        { q: "비눗방울 부스의 재료는?", o: ["세제, 물엿, 종이컵", "고무 가루, 색소, 종이컵", "세제, 색소, 물엿"], a: 0 },
        { q: "체험할 사람은 몇 명인가요?", o: ["23명", "32명", "40명"], a: 1 }]) },
    { name: "계획하고 해결해요",
      inst: "재료 카드를 부스 바구니에 담고, 부스마다 1인분 재료비를 더해 비교해 보세요.",
      hints: ["고무 가루 245 + 색소 60 + 종이컵 40", "세제 150 + 물엿 145 + 종이컵 40"],
      render: (b, a) => d3sBooth(b, a, {
        cards: [{ name: "고무 가루", v: 245, col: "#F6C9A6" }, { name: "세제", v: 150, col: "#BFDDF5" }, { name: "색소", v: 60, col: "#E8796B" }, { name: "물엿", v: 145, col: "#F7E3A1" }, { name: "종이컵", v: 40, col: "#FFFFFF" }, { name: "종이컵", v: 40, col: "#FFFFFF" }],
        bowls: [{ name: "탱탱볼 부스", need: ["고무 가루", "색소", "종이컵"] }, { name: "비눗방울 부스", need: ["세제", "물엿", "종이컵"] }],
        ok: "345원 > 335원이므로 재료비가 더 적게 드는 비눗방울 부스를 열어요." }) },
    { name: "32명 재료비 구하기",
      inst: "비눗방울 부스의 1인분 재료비는 335원이에요. 32명의 재료비를 세로로 계산해 보세요.",
      hints: ["335 × 2 = 670이에요.", "335 × 30 = 10050이에요."],
      render: (b, a) => d3sLongMul(b, a, { a: 335, b: 32, title: "335 × 32 (원)", ok: "335 × 32 = 10720. 비눗방울 부스 32명의 재료비는 10720원이에요." }) },
    { name: "되돌아봐요",
      inst: "문제를 해결한 과정을 되돌아봐요.",
      hints: ["어떤 차례로 해결했는지 떠올려 봐요.", "재료비를 아끼는 다른 방법도 생각해 봐요."],
      render: (b, a) => writeStep(b, a, [
        { q: "어떤 차례로 해결했는지 설명해 보세요.", tag: "방법", ph: "먼저 ~, 그다음 ~",
          help: ["① 1인분 재료비를 어떻게 구했는지 써요. → ② 32명의 재료비를 어떻게 구했는지 써요.", "‘먼저 ~을 더해 비교하고, 그다음 ~에 ~을 곱했어요.’ 꼴로 써요."],
          ans: "먼저 1인분 재료비를 더해 345원과 335원을 비교하고, 그다음 더 적은 335원에 32를 곱해 10720원을 구했어요." },
        { q: "재료비를 더 아낄 수 있는 방법을 써 보세요.", tag: "아이디어", ph: "~하면 ~원을 아낄 수 있어요",
          help: ["① 1인분 재료 가운데 줄일 수 있는 것을 골라요. → ② 32명이면 얼마를 아끼는지 곱해 봐요.", "‘~ 대신 ~을 쓰면 1인분에 ~원, 32명이면 ~원을 아낄 수 있어요.’ 꼴로 써요."],
          ans: "종이컵 대신 집에서 가져온 다회용 컵을 쓰면 1인분에 40원, 32명이면 40 × 32 = 1280원을 아낄 수 있어요." }]) },
    { name: "내 힘으로 풀어요",
      inst: "다음 축제에는 40명이 체험할 부스를 하나 더 열어요. 자석 팽이 부스는 자석 280원·병뚜껑 95원, 빨대 로켓 부스는 빨대 190원·고무 마개 135원이 1인분 재료비예요. 어떤 부스를 열어야 재료비를 아낄 수 있을까요?",
      hints: ["자석 280 + 병뚜껑 95, 빨대 190 + 고무 마개 135", "325 × 40은 325 × 4의 10배예요."],
      render: (b, a) => d3sBooth(b, a, {
        cards: [{ name: "빨대", v: 190, col: "#BFDDF5" }, { name: "자석", v: 280, col: "#E8796B" }, { name: "고무 마개", v: 135, col: "#F7E3A1" }, { name: "병뚜껑", v: 95, col: "#CDE8C4" }],
        bowls: [{ name: "자석 팽이 부스", need: ["자석", "병뚜껑"] }, { name: "빨대 로켓 부스", need: ["빨대", "고무 마개"] }], people: 40,
        after: [{ q: "빨대 로켓 부스 40명의 재료비 325 × 40 =", a: 13000, unit: "원", why: { "1300": "325 × 4의 곱이에요. 10배 해야 해요." } }],
        ok: "375원 > 325원이므로 빨대 로켓 부스를 열고, 40명의 재료비는 325 × 40 = 13000원이에요." }) }
  ],
  challenge: { inst: "만약 탱탱볼 부스(1인분 345원)를 32명이 체험했다면 재료비가 얼마나 더 들었을까요?", hints: ["345 × 32를 구해요.", "345 × 32 − 335 × 32는 (345 − 335) × 32와 같아요."],
    render: (b, a) => numbers(b, a, [
      { q: "345 × 32 =", a: 11040, unit: "원" },
      { q: "11040 − 10720 =", a: 320, unit: "원" }],
      { ok: "320원이 더 들었어요. 1인분에 10원 차이가 32명이면 10 × 32 = 320원이 돼요." }) }
},
{
  id: "s10", no: 10, title: "놀이를 더하다 ― 과학 축제 부스 탐험 놀이", soop: "발표하기(P)",
  question: "곱셈과 나눗셈을 옳게 계산하며 축제 부스를 탐험해 볼까요?",
  summary: "놀이판의 (세 자리 수) × (두 자리 수), (두 자리 수) ÷ (두 자리 수), (세 자리 수) ÷ (두 자리 수)를 옳게 계산해야 앞으로 나아갈 수 있어요. 상대방의 계산이 맞는지 계산기로 확인하고, 친구를 배려하며 놀이해요.",
  steps: [
    { name: "놀이 방법 알기",
      inst: "축제가 끝나고 위원회 친구들이 교실에서 ‘부스 탐험 놀이’를 해요. 놀이 방법을 차례대로 눌러 보세요.",
      hints: ["순서를 먼저 정하고 주사위를 굴려요.", "계산이 틀리면 말을 전에 있던 칸으로 돌려놓아요."],
      render: (b, a) => sequence(b, a, ["① 가위바위보로 순서를 정하고 말을 출발 칸에 놓아요.", "② 주사위를 굴려 나온 눈의 수만큼 말을 옮겨요.", "③ 칸의 식을 계산하고, 상대방이 계산기로 확인해요.", "④ 잘못 계산하면 말을 전에 있던 칸으로 돌려놓아요.", "⑤ 도착 칸에 먼저 도착하는 사람이 이겨요."], [0, 1, 2, 3, 4], { ok: "놀이 방법을 알았어요." }) },
    { name: "놀이판 살펴보기",
      inst: "놀이판에 있는 식을 살펴봐요. 첫 칸 240 ÷ 30에 멈추었어요. 계산하고 맞는지 확인해 보세요.",
      hints: ["30 × 8 = 240이에요.", "나머지가 없으면 나머지 칸에 0을 써요."],
      render: (b, a) => d3sCalc(b, a, [{ div: [240, 30], chk: true }], { ok: "240 ÷ 30 = 8. 30 × 8 = 240이므로 맞아요!" }) },
    { name: "놀이하기",
      inst: "친구와 번갈아 주사위를 굴리며 축제 부스를 탐험해요. 친구의 계산이 맞는지도 확인해 주세요.",
      hints: ["나눗셈은 몫과 나머지를 모두 써요. 나머지는 나누는 수보다 작아야 해요.", "곱셈은 곱하는 수를 몇십과 몇으로 나누어 계산해요."],
      render: (b, a) => d3sSpace(b, a, { goal: 4 }) },
    { name: "규칙 지키기",
      inst: "놀이 규칙과 함께 지킬 점을 확인해요.",
      hints: ["놀이 방법 ④를 떠올려 봐요.", "상대방 말이 있는 칸에 도착하면 한 번 더 굴려요."],
      render: (b, a) => quiz(b, a, [
        { q: "말이 이동한 칸에 상대방의 말이 있으면?", o: ["주사위를 한 번 더 굴려 이동해요", "상대방 말을 출발 칸으로 보내요", "한 번 쉬어요"], a: 0 },
        { q: "칸의 식을 잘못 계산하면?", o: ["말을 전에 있던 칸으로 돌려놓아요", "그대로 있어요", "도착 칸으로 가요"], a: 0 },
        { q: "놀이할 때 알맞은 태도는?", o: ["상대방의 계산이 맞는지 계산기로 확인해요", "이기는 것만 생각해요", "친구가 틀리면 놀려요"], a: 0 }]) },
    { name: "발표하기",
      inst: "놀이를 돌아보며 발표해 보세요.",
      hints: ["계산할 때 어떤 방법을 썼는지 떠올려요.", "친구에게 고마웠던 일을 떠올려요."],
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 계산을 옳게 하려고 어떤 방법을 썼나요?", tag: "방법", ph: "나눗셈은 ~, 곱셈은 ~",
          help: ["① 나눗셈을 할 때 몫을 어떻게 정했는지 떠올려요. → ② 곱셈을 할 때 곱하는 수를 어떻게 나누었는지 떠올려요.", "‘나눗셈은 먼저 ~하고 ~인지 확인했어요. 곱셈은 ~으로 나누어 계산했어요.’ 꼴로 써요."],
          ans: "나눗셈은 먼저 몫을 어림하고, 나머지가 나누는 수보다 작은지 확인했어요. 곱셈은 곱하는 수를 몇십과 몇으로 나누어 계산했어요." },
        { q: "친구와 놀이할 때 배려한 점은 무엇인가요?", tag: "배려", ph: "나는 ~했어요",
          help: ["① 친구가 계산할 때 내가 한 행동을 떠올려요. → ② 친구가 틀렸을 때 한 말을 떠올려요.", "‘친구가 ~할 때 ~하고, 틀렸을 때 ~라고 말했어요.’ 꼴로 써요."],
          ans: "친구가 계산하는 동안 기다려 주고, 틀렸을 때 놀리지 않고 같이 다시 계산해 보자고 말했어요." }]) }
  ],
  challenge: { inst: "놀이판에서 어려웠던 식에 도전해요.", hints: ["609 × 32 = 609 × 2 + 609 × 30", "880 ÷ 24는 24 × 30 = 720을 먼저 빼요."],
    render: (b, a) => d3sCalc(b, a, [{ mul: [609, 32] }, { div: [880, 24] }, { div: [87, 25], chk: true }],
      { ok: "어려운 식도 차근차근 해냈어요!" }) }
},
{
  id: "s11", no: 11, title: "축제 부스 운영 계획을 발표해요", soop: "발표하기(P)",
  question: "과학 축제 부스를 운영할 때 곱셈과 나눗셈을 어떻게 쓸까요?",
  summary: "(세 자리 수) × (두 자리 수)는 곱하는 수를 몇십과 몇으로 나누어 계산해요. (두 자리 수)·(세 자리 수) ÷ (두 자리 수)는 몫을 어림하고 고치며 구하고, 나머지가 나누는 수보다 작은지 확인해요. 어림셈으로 계산 결과가 알맞은지 살펴봐요.",
  steps: [
    { name: "만져 보기 — 운영 계획 계산하기",
      inst: "우리 반은 다음 축제에서 비눗방울 부스를 운영해요. 1차시에 궁금했던 것을 떠올리며, 운영 계획에 필요한 수를 계산해 보세요.",
      hints: ["24 × 13 = 312예요.", "335 × 24 = 335 × 4 + 335 × 20, 35 × 24 = 840이에요."],
      render: wonderRecall((b, a) => d3sCalc(b, a, [
        { div: [312, 24], q: "신청한 312명이 한 회에 24명씩 체험하면", names: ["체험 횟수", "남는 사람"], units: ["회", "명"] },
        { mul: [335, 24], q: "한 회(24명)의 재료비는", unit: "원" },
        { div: [850, 35], q: "남은 용액 850 mL를 35 mL씩 컵에 담으면", names: ["컵", "남는 용액"], units: ["개", "mL"] }],
        { ok: "체험은 13회, 한 회 재료비는 8040원, 남은 용액으로 컵 24개를 채우고 10 mL가 남아요." })) },
    { name: "그려 보기 — 잘못 계산한 곳 찾기",
      inst: "도윤이가 계획표의 412 ÷ 53을 계산했어요. 잘못 계산한 곳을 찾아 까닭을 고르고 옳게 계산해 보세요.",
      hints: ["나머지 94와 나누는 수 53을 견주어 봐요.", "53 × 7 = 371이에요."],
      render: (b, a) => d3sFixDiv(b, a, { n: 412, d: 53, wq: 6, ra: 0, who: "도윤이",
        reasons: ["나머지 94가 나누는 수 53보다 커서 더 나눌 수 있어요.", "53 × 6을 잘못 계산했어요.", "몫을 1 작게 해야 해요."],
        why: { 1: "53 × 6 = 318은 맞게 계산했어요.", 2: "나머지 94에서 53을 한 번 더 뺄 수 있어요. 몫을 크게 해야 해요." },
        ok: "412 ÷ 53 = 7 … 41. 나머지는 나누는 수보다 작아야 해요." }) },
    { name: "말해 보기 — 몫의 크기 비교하기",
      inst: "몫의 크기를 비교하고 몫과 나머지를 골라 보세요.",
      hints: ["720 ÷ 80 = 9예요.", "41 × 8 = 328, 41 × 9 = 369예요."],
      render: (b, a) => quiz(b, a, [
        { q: "720 ÷ 80 ○ 355 ÷ 41", o: [">", "=", "<"], a: 0, why: { "1": "355 ÷ 41의 몫은 8이에요(41 × 9 = 369는 355보다 커요).", "2": "720 ÷ 80 = 9, 355 ÷ 41 = 8 … 27이에요." } },
        { q: "545 ÷ 60의 몫과 나머지는?", o: ["9 … 5", "8 … 65", "9 … 50"], a: 0, why: { "1": "나머지 65가 나누는 수 60보다 커요. 몫을 1 크게 해요.", "2": "60 × 9 = 540이에요. 545 − 540을 다시 계산해 봐요." } }],
        { ok: "몫의 크기를 비교하고 알맞은 몫과 나머지를 골랐어요." }) },
    { name: "약속하기 — 부스 운영 계획 발표하기",
      inst: "우리 부스 운영 계획을 발표문으로 써 보세요. 배운 곱셈과 나눗셈을 넣어요.",
      hints: ["312 ÷ 24 = 13, 335 × 24 = 8040을 써도 좋아요.", "계산이 맞는지 어떻게 확인했는지도 써요."],
      render: (b, a) => writeStep(b, a, [
        { q: "우리 부스 이름과 하는 일", tag: "부스", ph: "우리 부스는 ~예요",
          help: ["① 부스 이름을 써요. → ② 몇 명이 어떻게 체험하는지 써요.", "‘우리 부스는 ~예요. ~명이 한 회에 ~명씩 ~회 동안 ~해요.’ 꼴로 써요."],
          ans: "우리 부스는 비눗방울 부스예요. 신청한 312명이 한 회에 24명씩 13회 동안 비눗방울을 만들어요." },
        { q: "계획에 쓴 곱셈이나 나눗셈과 그 까닭", tag: "계산", ph: "~ ÷ ~ = ~으로 ~을 구했어요",
          help: ["① 계획에 쓴 식을 하나 이상 써요. → ② 왜 곱셈이나 나눗셈을 썼는지 써요.", "‘~으로 ~을 구했어요. ~할 때는 나눗셈, ~할 때는 곱셈을 썼어요.’ 꼴로 써요."],
          ans: "312 ÷ 24 = 13으로 체험 횟수를 구하고, 335 × 24 = 8040으로 한 회의 재료비를 구했어요. 똑같이 나눌 때는 나눗셈, 같은 수씩 모을 때는 곱셈을 썼어요." },
        { q: "계산이 맞는지 확인한 방법", tag: "확인", ph: "~으로 확인했어요",
          help: ["① 나눗셈을 어떻게 확인했는지 써요. → ② 곱셈을 어떻게 확인했는지 써요.", "‘나눗셈은 ~ × ~ = ~으로, 곱셈은 ~으로 확인했어요.’ 꼴로 써요."],
          ans: "나눗셈은 24 × 13 = 312로 확인하고, 곱셈은 335 × 20 = 6700과 335 × 4 = 1340을 더해 8040이 나오는지 다시 확인했어요." }]) },
    { name: "확인하기 — 예전 생각, 지금 생각",
      inst: "이 단원을 배우며 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.",
      hints: ["곱하는 수, 나누는 수가 두 자리가 되기 전의 생각을 떠올려요.", "몫을 고치는 것, 어림셈이 쓸모 있는 때를 떠올려요."],
      render: (b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "이 단원을 배우기 전의 생각", ex: ["예전에는 나누는 수가 두 자리이면 너무 어려워서 계산할 수 없다고 생각했어요.", "예전에는 몫을 한 번에 딱 맞혀야 한다고 생각했어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 몫을 어림한 뒤 1 크게나 1 작게 고치면 된다고 생각해요.", "지금은 곱하는 수를 몇십과 몇으로 나누면 큰 곱셈도 할 수 있다고 생각해요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["안내 카드를 묶으며 몫을 6, 8, 7로 바꾸어 보고 바뀌었어요.", "부스 재료비를 계산하며 335 × 32를 세로로 해 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 과학 축제 준비 위원회 활동 끝!" }) }
  ],
  challenge: { inst: "마인드맵으로 ‘곱셈과 나눗셈’을 정리해요. 떠오르는 말을 모으고, 묶고, 이어 보세요.", hints: ["몫, 나머지, 몫 어림, 1 크게, 1 작게, 어림셈, 몇십몇", "나누는 수 × 몫 + 나머지 = 나누어지는 수", "326 × 57 = 326 × 7 + 326 × 50"],
    render: withOptional(
      (b, a) => panes(b, a, [
        { t: "떠오르는 말", e: "🧠", ph: "곱셈과 나눗셈 → ~", hint: "몫, 나머지, 어림셈…", ex: ["곱셈과 나눗셈 → 몫, 나머지, 어림셈", "곱셈과 나눗셈 → 몇십몇, 10배, 몫 어림"] },
        { t: "묶어 보기", e: "🗂", ph: "곱셈: ~ / 나눗셈: ~", hint: "비슷한 것끼리 묶어요", ex: ["곱셈: 몇십 곱하기, 몇십몇 곱하기", "나눗셈: 몫 어림, 몫 고치기, 나머지 확인"] },
        { t: "이어지는 말", e: "🔗", ph: "~와 ~는 이어져요", hint: "예: 곱셈과 나눗셈의 확인은 이어져요", ex: ["나눗셈과 곱셈은 이어져요. 나누는 수 × 몫 + 나머지로 확인해요.", "10배와 몇십 곱하기는 이어져요."] },
        { t: "덧붙이는 말", e: "✏️", ph: "예를 들면 ~", hint: "예를 들거나 더 설명해요", ex: ["예를 들면 136 × 20은 136 × 2의 10배인 2720이에요.", "예를 들면 830 ÷ 38 = 21 … 32이고 32는 38보다 작아요."] }],
        { min: 1, ok: "곱셈과 나눗셈을 한눈에 정리했어요. 과학 축제 준비 위원회 활동 끝!" }),
      (b, a) => d3sCalc(b, a, [{ mul: [326, 57] }, { div: [84, 21] }, { div: [803, 46] }, { div: [630, 70] }], { ok: "곱셈과 나눗셈을 모두 정확하게 했어요. 다음 단원은 평면도형의 이동이에요!" }),
      { title: "더 해 보고 싶다면 — 선택 문제", inst: "사다리를 타듯 차례로 곱과 몫을 구해 보세요. 칸을 다 채우면 저절로 확인해요." }) }
}
];
