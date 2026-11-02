//@@APP
const APP = {title:"가정의 달 축제 곱셈과 나눗셈", unit:"4-1 수학 3. 곱셈과 나눗셈(교과서)", key:"t41-muldiv-v1", welcome:"가정의 달 축제 곱셈과 나눗셈 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 선우네 가족과 가정의 달 축제에서 자원봉사를 하며 곱셈과 나눗셈을 배워요."};
//@@UNIT
/* ===== 3. 곱셈과 나눗셈 단원 조작 부품 (앞글자 d3) ===== */
const D3_SOFT = "#FDEBD9", D3_PSOFT = "#E3F1EA", D3_GRAY = "#B9C4C0", D3_BSOFT = "#DCEBFA", D3_RED = "#D9534F";
const D3_COLS = ["#F6C9A6", "#BFDDF5", "#CDE8C4", "#F3D3E7", "#F7E3A1", "#D6CCF2"];
function d3Style() {
  if (document.getElementById("d3-style")) return;
  const s = document.createElement("style"); s.id = "d3-style";
  s.textContent = `
.d3wrap{display:flex;gap:1.2em;flex-wrap:wrap;align-items:flex-start}
.d3v{display:inline-block;border:3px solid var(--night);border-radius:var(--r);padding:.5em .9em;background:#fff;font-family:Jua,sans-serif;max-width:100%;overflow-x:auto}
.d3ttl{font-size:var(--fs);color:var(--pine);margin-bottom:.2em}
.d3row{display:flex;align-items:center}
.d3row.d3line{border-top:3px solid var(--ink);margin:.12em 0}
.d3c{flex:none;width:1.45em;height:1.45em;display:inline-flex;align-items:center;justify-content:center;font-size:calc(var(--fs)*1.4)}
.d3c.d3top{border-top:3px solid var(--ink)}
.d3c.d3fade{color:#9AA7A3}
.d3c.d3hl{color:var(--tent)}
.d3c.d3brk{line-height:1;transform:scaleY(1.35)}
.d3lab{font-size:var(--fs-s);color:var(--muted);margin-left:.5em;white-space:nowrap;font-family:"Gowun Dodum",sans-serif}
.d3row.d3thin .d3c{height:.3em}
.d3row.d3act{background:var(--ring-soft);border-radius:.4em}
input.d3cell{flex:none;box-sizing:border-box;width:1.45em;height:1.45em;margin:0;padding:0;text-align:center;font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);border:2px solid var(--line);border-radius:.3em}
input.d3cell:disabled{background:#F3F5F4;border-style:dashed;opacity:.6}
.d3calc{display:flex;flex-wrap:wrap;align-items:center;gap:.35em .5em}
.d3qr{display:inline-flex;flex-direction:column;align-items:center;font-size:var(--fs-s);color:var(--muted)}
input.d3num{width:5.2em;font-size:1.15em;text-align:center}
input.d3num.w6{width:6.4em}
.d3chk{background:var(--pine-soft);border-radius:.6em;padding:.3em .6em;margin-top:.3em}
.d3est{background:var(--ring-soft);border-radius:.6em;padding:.4em .6em}
.d3cards{display:flex;gap:.5em;flex-wrap:wrap}
.d3cards .opt{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.4);min-width:2.2em;text-align:center}
.d3slots{font-family:Jua,sans-serif;font-size:calc(var(--fs)*1.5);letter-spacing:.05em}
.d3tbl{border-collapse:collapse}
.d3tbl td{border:1px solid var(--line);padding:.2em .5em;text-align:center}
.d3tbl tr.pick td{background:var(--pine-soft)}
.d3log{font-size:var(--fs-s);max-height:8em;overflow:auto}
`;
  document.head.append(s);
}
/* 받침에 맞는 조사: d3J(374, "을를") → "374를" */
function d3J(w, pair) {
  const s = String(w), c = s[s.length - 1];
  let has = false, rieul = false;
  if (/[0-9]/.test(c)) { has = "013678".includes(c); rieul = "178".includes(c); }
  else { const code = c.charCodeAt(0) - 0xAC00; if (code >= 0 && code <= 11171) { const j = code % 28; has = j > 0; rieul = j === 8; } }
  const M = { "이가": ["이", "가"], "을를": ["을", "를"], "은는": ["은", "는"], "과와": ["과", "와"], "으로": ["으로", "로"], "이에요": ["이에요", "예요"] };
  const [a, b] = M[pair];
  if (pair === "으로") return s + (has && !rieul ? a : b);
  return s + (has ? a : b);
}
const d3Add = (el, ...k) => el.append(...k.filter(x => x != null));
const d3Pad = (v, L) => { const s = String(v); return Array.from({ length: L }, (_, k) => k < L - s.length ? "" : s[k - (L - s.length)]); };
const d3In = (p, r) => p.x >= r[0] && p.x <= r[0] + r[2] && p.y >= r[1] && p.y <= r[1] + r[3];
function d3Gate(api, ready, msg) {
  return Object.assign({}, api, { done: (ans, m, lv) => ready() ? api.done(ans, m, lv) : api.fail(typeof msg === "function" ? msg() : msg, ans) });
}
function d3Cell(label) {
  const i = h("input", { type: "text", inputmode: "numeric", maxlength: 1, autocomplete: "off", class: "d3cell", "aria-label": label || "숫자 칸" });
  i.addEventListener("input", () => { i.value = i.value.replace(/[^0-9]/g, "").slice(-1); });
  return i;
}
function d3C(t, cls) { return h("span", { class: "d3c" + (cls ? " " + cls : "") }, t == null || t === "" ? "\u200B" : String(t)); }   /* 빈 칸에도 글자(폭 0)를 넣어 덮개가 숨기지 않게 */
function d3Num(label, wide) {
  const i = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", class: "d3num" + (wide ? " w6" : ""), "aria-label": label });
  return i;
}
const d3Val = inp => { const s = String(inp.value).replace(/[\s,]/g, ""); return s === "" ? null : (/^\d+$/.test(s) ? Number(s) : NaN); };
const d3Paint = (inp, good) => { inp.style.borderColor = good ? "var(--ok)" : "var(--no)"; };
/* 칸 줄 채점: want(글자 배열)과 같은지, 수는 같은데 자리만 다른지 */
function d3RowCheck(ins, want) {
  const got = ins.map(x => x.value.trim());
  const same = got.every((g, k) => g === want[k]);
  const num = got.join(""), wnum = want.join("");
  ins.forEach((x, k) => d3Paint(x, x.value.trim() === want[k]));
  return { same, shifted: !same && num !== "" && Number(num) === Number(wnum) && got.join("") === wnum, text: num || "-" };
}
/* 먼저 어림하기 상자: e = {q, o:[], a, ok, why:{i:"까닭"}} */
function d3EstBox(api, e, onOk) {
  const row = h("div", { class: "opts" });
  e.o.forEach((c, i) => row.append(h("button", { class: "opt", onclick: ev => {
    [...row.children].forEach(x => x.classList.remove("good", "bad", "on"));
    if (i === e.a) { ev.currentTarget.classList.add("good"); onOk(); api.hint(e.ok || "좋아요. 이제 정확하게 구해 봐요."); }
    else { ev.currentTarget.classList.add("bad"); api.fail((e.why && e.why[i]) || "가까운 몇백, 몇십으로 바꾸어 어림해 봐요.", "[어림] " + c); }
  } }, c)));
  return h("div", { class: "d3est" }, h("div", { class: "jua" }, "먼저 어림해요 · " + e.q), row);
}

/* ① 곱셈·나눗셈 계산 칸 (나눗셈은 몫과 나머지를 따로 써요)
   items: {mul:[a,b], unit, why:{값:"까닭"}} | {div:[n,d], q, names:["몫 이름","나머지 이름"], units:["",""], chk:true, why:{"몫,나머지":"까닭"}} | {q, a, unit, why}
   opt: ok, words */
function d3Calc(body, api, items, opt = {}) {
  d3Style();
  const rows = [];
  const wrap = h("div");
  items.forEach(it => {
    const box = h("div", { class: "qitem d3calc" });
    const R = { it, box };
    if (it.div) {
      const [n, d] = it.div;
      R.n = n; R.d = d; R.qa = Math.floor(n / d); R.ra = n % d;
      R.qi = d3Num((it.names && it.names[0]) || "몫"); R.ri = d3Num((it.names && it.names[1]) || "나머지");
      d3Add(box, it.q ? h("span", { class: "jua" }, it.q) : null, h("span", { class: "jua" }, `${n} ÷ ${d} =`),
        h("span", { class: "d3qr" }, h("span", {}, (it.names && it.names[0]) || "몫"), R.qi), (it.units && it.units[0]) ? h("span", {}, it.units[0]) : null,
        h("span", { class: "jua" }, "…"),
        h("span", { class: "d3qr" }, h("span", {}, (it.names && it.names[1]) || "나머지"), R.ri), (it.units && it.units[1]) ? h("span", {}, it.units[1]) : null);
      if (it.chk) {
        R.c1 = d3Num("검산 곱", true); R.c2 = d3Num("검산 합", true);
        R.chkBox = h("div", { class: "d3chk", style: "display:none" }, h("span", { class: "jua" }, "계산이 맞는지 확인해요 · "),
          h("span", {}, `${d} × ${R.qa} = `), R.c1, h("span", {}, " , "), h("span", { class: "c1echo" }, "□"), h("span", {}, ` + ${R.ra} = `), R.c2);
        box.append(R.chkBox);
      }
    } else if (it.mul) {
      const [a, b] = it.mul; R.a = a * b;
      R.inp = d3Num(`${a} × ${b}`, true);
      d3Add(box, it.q ? h("span", { class: "jua" }, it.q) : null, h("span", { class: "jua" }, `${a} × ${b} =`), R.inp, it.unit ? h("span", {}, it.unit) : null);
    } else {
      R.a = it.a; R.inp = d3Num(it.q, true);
      d3Add(box, h("span", { class: "jua" }, it.q), R.inp, it.unit ? h("span", {}, it.unit) : null);
    }
    rows.push(R); wrap.append(box);
  });
  const ansText = R => R.it.div ? `${R.n} ÷ ${R.d} = ${R.qa}${R.ra ? ` … ${R.ra}` : ""}` : R.it.mul ? `${R.it.mul[0]} × ${R.it.mul[1]} = ${R.a}` : `${R.it.q} ${R.a}`;
  api.provide({ words: opt.words || ["몫", "나머지", "나누는 수"], answers: rows.map(ansText) });
  let chkPhase = false;
  const divMsg = (R, qv, rv) => {
    const { n, d, qa, ra, it } = R;
    const key = `${qv},${rv}`;
    if (it.why && it.why[key]) return it.why[key];
    if (qv == null || isNaN(qv)) return `${n} ÷ ${d}의 몫을 써요.`;
    if (rv != null && !isNaN(rv) && rv >= d) {
      if (d * qv + rv === n) return `${d} × ${qv} + ${rv} = ${n}이라 맞아 보이지만, 나머지 ${rv}${d3J(rv, "이가").slice(String(rv).length)} 나누는 수 ${d}보다 크거나 같아요. ${d3J(d, "을를")} 한 번 더 뺄 수 있으니 몫을 1 크게 해요.`;
      return `나머지는 언제나 나누는 수 ${d}보다 작아야 해요.`;
    }
    if (d * qv > n) return `${d} × ${qv} = ${d * qv}${d3J(d * qv, "은는").slice(String(d * qv).length)} ${n}보다 커서 뺄 수 없어요. 몫을 작게 해요.`;
    if (qv === qa) return `몫은 맞았어요. 나머지는 ${n} − ${d} × ${d3J(qa, "으로")} 구해요.`;
    return `${d}에 몇을 곱해야 ${n}보다 크지 않으면서 ${n}에 가장 가까운지 생각해 봐요.`;
  };
  const mulMsg = (R, v) => {
    const it = R.it;
    if (it.why && it.why[String(v)]) return it.why[String(v)];
    if (it.mul && v != null && !isNaN(v)) {
      const [a, b] = it.mul, T = Math.floor(b / 10), O = b % 10;
      if (T > 0 && O > 0 && v === a * O + a * T) return `${a} × ${T * 10}의 곱을 한 자리 왼쪽으로 밀어 써야 해요. ${a} × ${T}${d3J(T, "이가").slice(String(T).length)} 아니라 ${a} × ${d3J(T * 10, "이에요")}.`;
      if (T > 0 && O === 0 && v === a * T) return `${a} × ${T}의 값을 10배 해야 ${a} × ${b}의 곱이 돼요.`;
    }
    return opt.bad || "빨간 칸을 다시 계산해 봐요.";
  };
  const btn = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (chkPhase) {
      let bad = null;
      rows.filter(R => R.it.chk).forEach(R => {
        const v1 = d3Val(R.c1), v2 = d3Val(R.c2), g1 = v1 === R.d * R.qa, g2 = v2 === R.n;
        d3Paint(R.c1, g1); d3Paint(R.c2, g2);
        if (!bad && !g1) bad = `${R.d} × ${R.qa}${d3J(R.qa, "을를").slice(String(R.qa).length)} 계산해 봐요.`;
        if (!bad && !g2) bad = `${R.d * R.qa} + ${R.ra}${d3J(R.ra, "을를").slice(String(R.ra).length)} 계산해 봐요. 나누어지는 수 ${R.n}${d3J(R.n, "이가").slice(String(R.n).length)} 나오면 맞게 계산한 거예요.`;
      });
      const given = rows.filter(R => R.it.chk).map(R => `검산 ${R.c1.value}+${R.ra}=${R.c2.value}`).join(" / ");
      if (bad) return api.fail(bad, given);
      return api.done(rows.map(ansText).join(" / ") + " | " + given, opt.ok || "계산하고 맞는지 확인까지 했어요!");
    }
    let firstBad = null; const given = [];
    rows.forEach(R => {
      if (R.it.div) {
        const qv = d3Val(R.qi); let rv = d3Val(R.ri); if (rv == null && R.ra === 0) rv = 0;
        const gq = qv === R.qa, gr = rv === R.ra;
        d3Paint(R.qi, gq); d3Paint(R.ri, gr);
        given.push(`${R.n}÷${R.d}=${R.qi.value || "-"}…${R.ri.value || "-"}`);
        if ((!gq || !gr) && !firstBad) firstBad = divMsg(R, qv, rv);
      } else {
        const v = d3Val(R.inp), g = v === R.a; d3Paint(R.inp, g);
        given.push(R.inp.value || "-");
        if (!g && !firstBad) firstBad = mulMsg(R, v);
      }
    });
    if (firstBad) return api.fail(firstBad, given.join(" / "));
    const ch = rows.filter(R => R.it.chk);
    if (ch.length) {
      chkPhase = true;
      ch.forEach(R => { R.chkBox.style.display = ""; R.c1.addEventListener("input", () => { R.box.querySelector(".c1echo").textContent = R.c1.value || "□"; }); });
      [...rows].forEach(R => { if (R.qi) { R.qi.disabled = true; R.ri.disabled = true; } if (R.inp) R.inp.disabled = true; });
      return api.hint("○ 맞았어요. 이제 ‘나누는 수 × 몫 + 나머지 = 나누어지는 수’가 되는지 확인해요.");
    }
    api.done(given.join(" / "), opt.ok || "정확하게 계산했어요!");
  } }, "확인하기");
  body.append(wrap, h("p", { class: "inst", style: "font-size:var(--fs-s)" }, items.some(x => x.div) ? "나머지가 없으면 나머지 칸에 0을 쓰거나 비워 두어요." : ""), h("div", { class: "actions" }, btn));
}

/* ② 메뚜기 멀리뛰기 (단원 도입)  opt: len(mm), max, ask, ok */
function d3Hopper(body, api, opt) {
  const len = opt.len || 115, max = opt.max || 20;
  let k = 1, seen = 1;
  const top = Math.ceil(len * max / 500) * 500;
  const svg = makeSvg(900, 300);
  const X = v => 40 + v / top * 820;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 20, y: 230, width: 860, height: 50, fill: "#EAF4E4" }));
    svg.append(svgEl("line", { x1: X(0), y1: 210, x2: X(top), y2: 210, stroke: INK, "stroke-width": 3 }));
    for (let v = 0; v <= top; v += 100) {
      const big = v % 500 === 0;
      svg.append(svgEl("line", { x1: X(v), y1: big ? 196 : 202, x2: X(v), y2: big ? 224 : 218, stroke: INK, "stroke-width": big ? 3 : 1.5 }));
      if (big) svg.append(txt(X(v), 248, String(v), 18));
    }
    svg.append(txt(X(top) - 10, 272, "(mm)", 16));
    for (let i = 0; i < k; i++) svg.append(svgEl("rect", { x: X(i * len), y: 160, width: X(len) - X(0), height: 22, rx: 4, fill: i % 2 ? "#BFDDF5" : "#CDE8C4", stroke: PINE, "stroke-width": 1.5 }));
    const ex = X(k * len);
    svg.append(svgEl("path", { d: `M${X(0)},150 Q${(X(0) + ex) / 2},${Math.max(20, 150 - k * 6)} ${ex},150`, fill: "none", stroke: TENT, "stroke-width": 3, "stroke-dasharray": "8 6" }));
    // 메뚜기
    const g = svgEl("g", { transform: `translate(${ex},140)` });
    g.append(svgEl("ellipse", { cx: 0, cy: 0, rx: 26, ry: 9, fill: "#7CC36E", stroke: PINE, "stroke-width": 2 }),
      svgEl("circle", { cx: 24, cy: -4, r: 7, fill: "#7CC36E", stroke: PINE, "stroke-width": 2 }),
      svgEl("path", { d: "M-6,4 L-20,18 L-30,10 M6,4 L-4,18", fill: "none", stroke: PINE, "stroke-width": 2.5 }),
      svgEl("path", { d: "M28,-10 L40,-24", stroke: PINE, "stroke-width": 2 }));
    svg.append(g);
    svg.append(txt(450, 40, `몸길이 ${len} mm를 ${k}번 이어 놓았어요 (${k}배)`, 24));
    rng.value = k;
  };
  const rng = h("input", { type: "range", min: 1, max, step: 1, value: 1, "aria-label": "몇 배" });
  const set = v => { k = Math.max(1, Math.min(max, v)); seen = Math.max(seen, k); draw(); };
  rng.oninput = () => set(+rng.value);
  const ans = h("div");
  const g = d3Gate(api, () => seen >= max, `막대를 끝까지 움직여 몸길이의 ${max}배까지 이어 본 다음 답해요.`);
  numbers(ans, g, opt.ask, { ok: opt.ok });
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "막대를 움직여 몸길이를 몇 번 이어 놓을지 바꾸어 보세요."), rng,
    h("div", { class: "row" }, h("button", { class: "ghost", onclick: () => set(k - 1) }, "1배 줄이기"), h("button", { class: "ghost", onclick: () => set(k + 1) }, "1배 늘리기")), ans)));
}

/* ③ 묶음 세기: per개씩 k묶음이 cols줄  opt: per, k, cols, item, ask, ok */
function d3Bundles(body, api, opt) {
  const per = opt.per, k = opt.k || 2, cols = opt.cols || 10, item = opt.item || "묶음";
  const on = [];
  const svg = makeSvg(900, 400);
  const cw = 84, X0 = 30;
  const colR = c => [X0 + c * cw, 56, cw - 10, 270];
  const bundle = (x, y, hl) => {
    const g = svgEl("g");
    g.append(svgEl("rect", { x, y, width: 60, height: 100, rx: 10, fill: hl ? "#fff" : "#FBFCFB", stroke: hl ? PINE : D3_GRAY, "stroke-width": 2.5 }));
    for (let i = 0; i < 3; i++) g.append(svgEl("ellipse", { cx: x + 30, cy: y + 22 + i * 18, rx: 20, ry: 7, fill: "none", stroke: D3_COLS[i], "stroke-width": 5 }));
    g.append(txt(x + 30, y + 84, `${per}개`, 16));
    return g;
  };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(450, 26, `${item} ${per}개씩 ${k * cols}묶음 · 세로 한 줄은 ${k}묶음`, 22));
    for (let c = 0; c < cols; c++) {
      const r = colR(c), idx = on.indexOf(c);
      svg.append(svgEl("rect", { x: r[0], y: r[1], width: r[2], height: r[3], rx: 12, fill: idx >= 0 ? D3_PSOFT : "#fff", stroke: idx >= 0 ? PINE : D3_GRAY, "stroke-width": 2.5, "stroke-dasharray": idx >= 0 ? "" : "7 6", style: "cursor:pointer" }));
      for (let j = 0; j < k; j++) svg.append(bundle(r[0] + 7, r[1] + 16 + j * 125, idx >= 0));
      if (idx >= 0) svg.append(txt(r[0] + r[2] / 2, 350, String(per * k * (idx + 1)), 18, { fill: PINE }));
    }
    svg.append(txt(450, 385, on.length ? `${per * k}씩 ${on.length}번 → ${per * k * on.length}개` : "세로 줄을 차례로 눌러 세어 보세요", 20, { fill: on.length ? TENT : INK }));
  };
  dragOn(svg, p => {
    const c = Array.from({ length: cols }, (_, i) => i).find(i => d3In(p, colR(i)));
    if (c != null) { const i = on.indexOf(c); if (i >= 0) on.splice(i); else on.push(c); draw(); }
    return false;
  }, () => {}, null);
  const ans = h("div");
  const g = d3Gate(api, () => on.length === cols, `세로 줄 ${cols}개를 모두 눌러 ${per * k}씩 세어 본 다음 답해요.`);
  numbers(ans, g, opt.ask, { ok: opt.ok });
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || `세로 한 줄은 ${per}개씩 ${k}묶음이에요. 줄을 차례로 눌러 세어 보세요. 다시 누르면 그 줄부터 지워져요.`),
    h("button", { class: "ghost", onclick: () => { on.length = 0; draw(); } }, "처음부터 세기"), ans)));
}

/* ④ 자리 옮기기: a × m 의 곱을 자릿값 표에 쓰고, 곱하는 수가 10배 되면 한 자리씩 왼쪽으로  opt: a, m, extra, ok */
function d3TenShift(body, api, opt) {
  d3Style();
  const a = opt.a, m = opt.m, p = a * m;
  let phase = 0, dx = 0;
  const names = ["만", "천", "백", "십", "일"], CW = 110, X0 = 230;
  const svg = makeSvg(900, 330);
  const cx = c => X0 + c * CW + CW / 2;
  const draw = () => {
    svg.innerHTML = "";
    names.forEach((nm, c) => {
      svg.append(svgEl("rect", { x: X0 + c * CW, y: 20, width: CW, height: 50, fill: "#F2F6F4", stroke: D3_GRAY, "stroke-width": 2 }), txt(cx(c), 46, nm + "의 자리", 18));
      svg.append(svgEl("rect", { x: X0 + c * CW, y: 70, width: CW, height: 110, fill: "#fff", stroke: D3_GRAY, "stroke-width": 2 }));
      svg.append(svgEl("rect", { x: X0 + c * CW, y: 180, width: CW, height: 110, fill: "#fff", stroke: D3_GRAY, "stroke-width": 2 }));
    });
    svg.append(txt(110, 125, `${a} × ${m}`, 26), txt(110, 235, `${a} × ${m * 10}`, 26, { fill: TENT }));
    const dg = d3Pad(p, 5);
    if (phase >= 1) {
      const row = svgEl("g", { style: "cursor:grab" });
      dg.forEach((ch, c) => { if (ch) row.append(svgEl("rect", { x: X0 + c * CW + 18, y: 88, width: CW - 36, height: 74, rx: 10, fill: D3_BSOFT, stroke: BLUE, "stroke-width": 2 }), txt(cx(c), 126, ch, 40)); });
      if (phase === 1 && dx) row.setAttribute("transform", `translate(${dx},${Math.min(110, -dx * 1.1)})`);
      svg.append(row);
    } else svg.append(txt(X0 + 2.5 * CW, 126, "곱을 먼저 구해요", 24, { fill: "#9aa" }));
    if (phase >= 2) {
      const dg2 = d3Pad(p * 10, 5);
      dg2.forEach((ch, c) => { if (ch) svg.append(svgEl("rect", { x: X0 + c * CW + 18, y: 198, width: CW - 36, height: 74, rx: 10, fill: c === 4 ? D3_SOFT : D3_BSOFT, stroke: c === 4 ? TENT : BLUE, "stroke-width": 2 }), txt(cx(c), 236, ch, 40, { fill: c === 4 ? TENT : INK })); });
      svg.append(txt(X0 + 5 * CW + 30, 236, "", 20));
    } else if (phase === 1) svg.append(txt(X0 + 2.5 * CW, 236, "위의 숫자 줄을 끌어 한 칸 왼쪽 아래로", 20, { fill: "#9aa" }));
  };
  const shift = () => { if (phase !== 1) return; phase = 2; dx = 0; draw(); api.hint(`곱하는 수가 ${m}에서 ${m * 10}으로 10배가 되었어요. 숫자가 모두 한 자리씩 왼쪽으로 옮겨 가고 일의 자리에는 0이 생겨요.`); };
  dragOn(svg, pt => phase === 1 && pt.y > 70 && pt.y < 180 ? (dx = 0, svg._sx = pt.x, true) : false,
    pt => { dx = Math.min(0, pt.x - svg._sx); draw(); },
    () => { if (dx < -CW * .5) shift(); else { dx = 0; draw(); } });
  const pin = d3Num(`${a} × ${m}`, true);
  const step1 = h("div", { class: "qitem d3calc" }, h("span", { class: "jua" }, `① ${a} × ${m} =`), pin,
    h("button", { class: "ghost", onclick: () => {
      api.tryOnce();
      const v = d3Val(pin); d3Paint(pin, v === p);
      if (v !== p) return api.fail(`${a} × ${d3J(m, "을를")} 다시 계산해 봐요. 일의 자리부터 곱하고 올림한 수를 더해요.`, `${a}×${m}=${pin.value}`);
      phase = 1; pin.disabled = true; draw(); api.hint("○ 맞았어요. 곱이 자릿값 표에 들어갔어요. 이제 곱하는 수를 10배 해 봐요.");
    } }, "표에 넣기"));
  const ans = h("div");
  const g = d3Gate(api, () => phase >= 2, () => phase === 0 ? `먼저 ${a} × ${m}의 곱을 구해 표에 넣어요.` : "숫자 줄을 끌거나 ‘10배 하기’를 눌러 자리를 옮겨 본 다음 답해요.");
  numbers(ans, g, [{ q: `② ${a} × ${m * 10} =`, a: p * 10, why: { [p]: `${a} × ${m}의 곱과 같아요. 곱하는 수가 10배이니 곱도 10배가 되어야 해요.` } }].concat(opt.extra || []),
    { ok: opt.ok || `${a} × ${m * 10} = ${p * 10}. (세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 10배 해요.` });
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "곱을 표에 넣고, 숫자 줄을 끌어 곱하는 수가 10배가 될 때 어떻게 되는지 보세요."), step1,
    h("button", { class: "ghost", onclick: () => phase === 1 ? shift() : api.hint(phase === 0 ? "먼저 ①의 곱을 구해요." : "이미 10배 했어요.") }, "10배 하기"), ans)));
}

/* ⑤ 직사각형 나누기: a × b 를 a × (몇십) + a × (몇) 으로  opt: a, b, item, est:{q,o,a,why,ok}, ok */
function d3Area(body, api, opt) {
  d3Style();
  const a = opt.a, b = opt.b, T = Math.floor(b / 10) * 10, O = b % 10;
  let split = 0, splitOk = false, estOk = !opt.est;
  const rh = Math.min(18, 330 / b), X0 = 170, W = 600, Y0 = 56, H = b * rh;
  const svg = makeSvg(900, Y0 + H + 50);
  const draw = () => {
    svg.innerHTML = "";
    const RN = opt.rowName || "줄";
    svg.append(txt(X0 + W / 2, 28, `${opt.item || ""} ${a}개씩 ${b}${RN}`.trim(), 26));
    svg.append(svgEl("rect", { x: X0, y: Y0, width: W, height: H, fill: "#fff", stroke: INK, "stroke-width": 2.5 }));
    if (split > 0) {
      svg.append(svgEl("rect", { x: X0, y: Y0, width: W, height: split * rh, fill: D3_BSOFT }), svgEl("rect", { x: X0, y: Y0 + split * rh, width: W, height: (b - split) * rh, fill: D3_SOFT }));
    }
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
    svg.append(txt(X0 + W / 2, Y0 + H + 30, split > 0 ? `${d3J(split + RN, "과와")} ${d3J((b - split) + RN, "으로")} 나누었어요` : `주황 선을 아래로 끌어 ${d3J(b + RN, "을를")} 나누어요`, 22));
  };
  dragOn(svg, p => { if (splitOk) return false; if (p.x < X0 - 10 || p.x > X0 + W + 70) return false; split = Math.max(1, Math.min(b - 1, Math.round((p.y - Y0) / rh))); draw(); return true; },
    p => { split = Math.max(1, Math.min(b - 1, Math.round((p.y - Y0) / rh))); draw(); }, null);
  const ans = h("div");
  const side = h("div", { class: "side" });
  if (opt.est) side.append(d3EstBox(api, opt.est, () => { estOk = true; }));
  const okSplit = h("button", { class: "ghost", onclick: () => {
    if (!estOk) return api.hint("먼저 위에서 어림한 값을 골라요.");
    api.tryOnce();
    if (split === 0) return api.fail("주황 선을 끌어 줄을 두 묶음으로 나누어요.", "(나누지 않음)");
    if (split !== T && split !== O) return api.fail(`${b}${d3J(b, "을를").slice(String(b).length)} 계산하기 쉬운 몇십과 몇으로 나누어 봐요. ${b} = ${T} + ${d3J(O, "이에요")}.`, `[나눔] ${split}+${b - split}`);
    if (split === O) { split = T; }
    splitOk = true; okSplit.remove(); draw();
    { const RN = opt.rowName || "줄"; api.hint(`${d3J(b + RN, "을를")} ${d3J(T + RN, "과와")} ${d3J(O + RN, "으로")} 나누었어요. 두 부분을 각각 계산해서 더해요.`); }
    numbers(ans, api, opt.ask || [{ q: `${a} × ${T} =`, a: a * T }, { q: `${a} × ${O} =`, a: a * O }, { q: `${a} × ${b} =`, a: a * b }], { ok: opt.ok });
  } }, "이렇게 나누기");
  side.append(h("p", {}, opt.tip || `주황 선을 끌어 ${b}줄을 계산하기 쉬운 두 묶음으로 나누어 보세요.`), okSplit, ans);
  draw();
  body.append(stageWrap(svg, side));
}

/* ⑥ 세로셈 곱셈 (세 자리 수) × (몇십몇) 또는 × (몇십), 한 줄씩 차례로  opt: a, b, title, ok */
function d3LongMul(body, api, opt) {
  d3Style();
  const a = opt.a, b = opt.b, T = Math.floor(b / 10), O = b % 10, p1 = a * O, p2 = a * T * 10, r = a * b, W = 5;
  const tensOnly = O === 0;
  const box = h("div", { class: "d3v" }, h("div", { class: "d3ttl" }, opt.title || `${a} × ${b}`));
  const row = (cells, label, cls) => { const rr = h("div", { class: "d3row" + (cls ? " " + cls : "") }); cells.forEach(c => rr.append(c)); const lb = h("span", { class: "d3lab" }, label || ""); rr.append(lb); rr._lab = lb; box.append(rr); return rr; };
  const aCells = d3Pad(a, W).map(ch => d3C(ch)), bCells = d3Pad(b, W).map(ch => d3C(ch));
  row([d3C("")].concat(aCells));
  row([d3C("×")].concat(bCells));
  box.append(h("div", { class: "d3row d3line" }));
  const stages = [];
  if (!tensOnly) {
    const i1 = Array.from({ length: W }, () => d3Cell("첫째 줄"));
    stages.push({ rowEl: row([d3C("")].concat(i1), `← ${a} × ${O}`), ins: i1, want: d3Pad(p1, W), hl: [W - 1], name: "첫째 줄" });
    const i2 = Array.from({ length: W - 1 }, () => d3Cell("둘째 줄"));
    stages.push({ rowEl: row([d3C("")].concat(i2, [d3C("0", "d3fade")]), `← ${a} × ${T * 10} (0은 생략할 수 있어요)`), ins: i2, want: d3Pad(p2 / 10, W - 1), hl: [W - 2], name: "둘째 줄" });
    box.append(h("div", { class: "d3row d3line" }));
    const i3 = Array.from({ length: W }, () => d3Cell("합"));
    stages.push({ rowEl: row([d3C("")].concat(i3), "← 두 줄의 합"), ins: i3, want: d3Pad(r, W), hl: [], name: "합" });
  } else {
    const i1 = Array.from({ length: W }, () => d3Cell("곱"));
    stages.push({ rowEl: row([d3C("")].concat(i1), `← ${a} × ${T}의 10배`), ins: i1, want: d3Pad(r, W), hl: [W - 2], name: "곱" });
  }
  let si = 0;
  const setStage = () => {
    stages.forEach((s, k) => { s.ins.forEach(x => x.disabled = k !== si); s.rowEl.classList.toggle("d3act", k === si); });
    bCells.forEach((c, k) => c.classList.toggle("d3hl", si < stages.length && stages[si].hl.includes(k)));
    const f = stages[si] && stages[si].ins[stages[si].ins.length - 1]; if (f && f.focus && si > 0) f.focus();
  };
  api.provide({ words: ["일의 자리", "십의 자리", "한 자리 왼쪽"], answers: [tensOnly ? `${a} × ${b} = ${r}` : `${a} × ${O} = ${p1}, ${a} × ${T * 10} = ${p2}, ${p1} + ${p2} = ${r}`] });
  const msgs = s => {
    if (s.name === "첫째 줄") return `${a} × ${O}의 값을 써요. 일의 자리부터 곱하고 올림한 수를 더해요.`;
    if (s.name === "둘째 줄") return `둘째 줄은 ${a} × ${T * 10}이에요. ${a} × ${T}의 값을 일의 자리 0 앞에 써요.`;
    if (s.name === "합") return "두 줄의 수를 자리를 맞추어 더해 봐요. 받아올림에 주의해요.";
    return `${a} × ${T}의 값을 구하고 일의 자리에 0을 써요.`;
  };
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const s = stages[si], res = d3RowCheck(s.ins, s.want);
    if (!res.same) {
      const got = s.ins.map(x => x.value.trim()).join("");
      if (got && Number(got) === Number(s.want.join(""))) return api.fail("수는 맞았는데 자리가 어긋났어요. 일의 자리 숫자부터 오른쪽 칸에 맞추어 써요.", `${s.name} ${got}`);
      if (tensOnly && got && Number(got) === a * T) return api.fail(`${a} × ${T}의 값을 10배 해야 해요. 일의 자리에 0을 써요.`, `${s.name} ${got}`);
      return api.fail(msgs(s), `${s.name} ${got || "-"}`);
    }
    si++;
    if (si < stages.length) { setStage(); return api.hint(`○ 맞았어요. 이제 ${stages[si].name}을 써요.`); }
    setStage(); check.disabled = true;
    api.done(stages.map(x => `${x.name} ${x.ins.map(i => i.value).join("")}`).join(" | "), opt.ok || `${a} × ${b} = ${r}. 정확해요!`);
  } }, "확인하기");
  setStage();
  body.append(h("p", { class: "inst" }, opt.tip || "색칠된 줄의 빈칸에 숫자를 한 개씩 써요. 맞으면 다음 줄이 열려요."), h("div", { class: "d3wrap" }, box), h("div", { class: "actions" }, check));
}

/* ⑦ 수 모형으로 나누기: (몇백몇십) ÷ (몇십)  opt: n, d, item, ask, ok */
function d3Blocks(body, api, opt) {
  const n = opt.n, d = opt.d, H = Math.floor(n / 100), Tn = Math.floor(n / 10) % 10, g = d / 10, total = n / 10;
  let broken = H === 0;
  const grp = [];      // grp[i] = 묶음 번호(1부터) 또는 0
  let sel = [], gcount = 0;
  const svg = makeSvg(900, 400);
  const PR = 17, BW = 24, BH = 170, bx = i => 46 + (i % PR) * 48, by = i => 80 + Math.floor(i / PR) * 210;
  const HS = BH, hundR = [40, 70, HS, HS], HX = i => hundR[0] + i * (HS + 30);
  const ten = (x, y, fill, stroke) => {
    const gg = svgEl("g");
    gg.append(svgEl("rect", { x, y, width: BW, height: BH, fill, stroke: stroke || INK, "stroke-width": 2 }));
    for (let k = 1; k < 10; k++) gg.append(svgEl("line", { x1: x, y1: y + k * BH / 10, x2: x + BW, y2: y + k * BH / 10, stroke: "#8BA79A" }));
    return gg;
  };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(450, 32, `${opt.item || ""} ${d3J(n + (opt.unit || ""), "을를")} ${d}${opt.unit || ""}씩 묶어요`.trim(), 26));
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
      svg.append(svgEl("rect", { x: bx(i) - 8, y: by(i) - 8, width: BW + 16, height: BH + 16, rx: 6, fill: gi ? D3_COLS[(gi - 1) % 6] : s ? D3_SOFT : "none", stroke: gi ? PINE : s ? TENT : "none", "stroke-width": 2 }));
      svg.append(ten(bx(i), by(i), "#F7E3A1"));
      if (gi) svg.append(txt(bx(i) + BW / 2, by(i) + BH + 24, String(gi), 20, { fill: PINE }));
    }
    svg.append(txt(450, 385, `만든 묶음: ${gcount}묶음 · 남은 십 모형: ${total - grp.filter(Boolean).length}개`, 24));
  };
  dragOn(svg, p => {
    if (!broken) { if (p.y > hundR[1] && p.y < hundR[1] + HS && p.x > hundR[0] && p.x < HX(H) - 30) { broken = true; draw(); api.hint(`백 모형 ${H}개를 십 모형 ${H * 10}개로 바꾸었어요. 이제 십 모형이 모두 ${total}개예요. ${d}씩, 곧 십 모형 ${g}개씩 묶어요.`); } return false; }
    const i = Array.from({ length: total }, (_, k) => k).find(k => p.x > bx(k) - 10 && p.x < bx(k) + BW + 10 && p.y > by(k) - 10 && p.y < by(k) + BH + 10);
    if (i == null) return false;
    if (grp[i]) { const gi = grp[i]; for (let k = 0; k < total; k++) if (grp[k] === gi) grp[k] = 0; for (let k = 0; k < total; k++) if (grp[k] > gi) grp[k]--; gcount--; }
    else if (sel.includes(i)) sel = sel.filter(x => x !== i);
    else { sel.push(i); if (sel.length === g) { gcount++; sel.forEach(x => grp[x] = gcount); sel = []; } }
    draw(); return false;
  }, () => {}, null);
  const ans = h("div");
  const gt = d3Gate(api, () => broken && gcount === Math.floor(total / g) && sel.length === 0, () => !broken ? "먼저 백 모형을 눌러 십 모형으로 바꾸어요." : `십 모형을 ${g}개씩 모두 묶은 다음 답해요.`);
  numbers(ans, gt, opt.ask, { ok: opt.ok });
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || `십 모형을 ${g}개씩 눌러 묶어요. 묶은 모형을 다시 누르면 그 묶음이 풀려요.`),
    h("button", { class: "ghost", onclick: () => { for (let k = 0; k < total; k++) grp[k] = 0; sel = []; gcount = 0; draw(); } }, "묶음 모두 풀기"), ans)));
}

/* ⑧ 몫 어림하고 고치기 (막대 그림)  opt: n, d, need(true면 작은 몫·큰 몫을 모두 해 봐야 함), item, names, units, ok */
function d3QuotTry(body, api, opt) {
  d3Style();
  const n = opt.n, d = opt.d, q = Math.floor(n / d);
  let t = 0, small = false, big = false;
  const svg = makeSvg(900, 300);
  const sc = 760 / Math.max(n, d * Math.min(9, q + 1)), X0 = 60, BY = 110, BH = 56;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(450, 30, `${n}에서 ${d}씩 몇 번 뺄 수 있을까요?`, 24));
    svg.append(svgEl("rect", { x: X0, y: BY, width: n * sc, height: BH, fill: "#F7F9F8", stroke: INK, "stroke-width": 3 }));
    svg.append(txt(X0 + n * sc, BY - 16, String(n), 20), svgEl("line", { x1: X0 + n * sc, y1: BY - 6, x2: X0 + n * sc, y2: BY + BH + 6, stroke: INK, "stroke-width": 3 }));
    for (let i = 0; i < t; i++) {
      const x = X0 + i * d * sc, w = d * sc, over = x + w > X0 + n * sc + .01;
      svg.append(svgEl("rect", { x, y: BY + 6, width: w, height: BH - 12, rx: 6, fill: over ? "#F6C3C1" : D3_COLS[i % 2 ? 1 : 0], stroke: over ? D3_RED : PINE, "stroke-width": 2, "stroke-dasharray": over ? "6 4" : "" }));
      if (w > 34) svg.append(txt(x + w / 2, BY + BH / 2, String(d), 17, { fill: over ? D3_RED : INK }));
    }
    if (t > 0) {
      const used = d * t;
      if (used > n) svg.append(txt(450, 220, `${d} × ${t} = ${used} → ${n}보다 커서 뺄 수 없어요. 몫을 1 작게!`, 22, { fill: D3_RED }));
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
  const pick = h("div", { class: "d3cards" });
  for (let k = 1; k <= 9; k++) pick.append(h("button", { class: "opt", onclick: e => {
    t = k; [...pick.children].forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on");
    if (d * k > n) big = true; else if (n - d * k >= d) small = true;
    draw();
  } }, String(k)));
  const ans = h("div");
  const gt = d3Gate(api, () => t === q && (!opt.need || (small && big)), () => opt.need && !(small && big) ? "몫을 너무 작게도, 너무 크게도 어림해 보고 어떻게 되는지 살펴본 다음 답해요." : "막대 그림에서 알맞은 몫을 찾은 다음 답해요.");
  d3Calc(ans, gt, [{ div: [n, d], chk: opt.chk !== false, names: opt.names, units: opt.units }], { ok: opt.ok });
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "몫을 어림해 수를 골라 보세요. 막대 그림에서 뺄 수 있는지, 더 뺄 수 있는지 살펴봐요."), pick, ans)));
}

/* ⑨ 뛰어 세기로 나누기: d×10 큰 뛰기와 d 작은 뛰기  opt: n, d, est, names, units, ok */
function d3JumpDiv(body, api, opt) {
  d3Style();
  const n = opt.n, d = opt.d;
  let big = 0, small = 0, estOk = !opt.est;
  const svg = makeSvg(900, 300);
  const X = v => 50 + v / n * 800, Y = 220;
  const pos = () => d * (10 * big + small);
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
  };
  const out = h("div", { class: "readout" });
  const jumpB = () => { if (!estOk) return api.hint("먼저 위에서 어림한 값을 골라요."); if (pos() + 10 * d > n) return api.hint(`${10 * d}만큼 더 뛰면 ${d3J(n, "을를")} 넘어요. 이제 ${d}씩 뛰어 봐요.`); big++; draw(); };
  const jumpS = () => { if (!estOk) return api.hint("먼저 위에서 어림한 값을 골라요."); if (pos() + d > n) return api.hint(`${d}만큼 더 뛰면 ${d3J(n, "을를")} 넘어요. 남은 ${n - pos()}${d3J(n - pos(), "이가").slice(String(n - pos()).length)} 나머지예요.`); small++; draw(); };
  const undo = () => { if (small) small--; else if (big) big--; draw(); };
  const side = h("div", { class: "side" });
  if (opt.est) side.append(d3EstBox(api, opt.est, () => { estOk = true; }));
  const ans = h("div");
  const gt = d3Gate(api, () => n - pos() < d, `${n}에 가장 가까이 갈 때까지 뛰어 센 다음 답해요.`);
  d3Calc(ans, gt, [{ div: [n, d], names: opt.names, units: opt.units, chk: opt.chk }], { ok: opt.ok });
  side.append(h("p", {}, opt.tip || `${d} × 10 = ${10 * d}씩 크게 뛰고, 남은 만큼은 ${d}씩 뛰어요.`), out,
    h("div", { class: "row" }, h("button", { class: "ghost", onclick: jumpB }, `+${10 * d} 크게 뛰기`), h("button", { class: "ghost", onclick: jumpS }, `+${d} 뛰기`)),
    h("button", { class: "ghost", onclick: undo }, "한 번 되돌리기"), ans);
  draw();
  body.append(stageWrap(svg, side));
}

/* ⑩ 곱셈표로 몫 어림하기  opt: n, d, ks:[...], names, units, ok */
function d3Table(body, api, opt) {
  d3Style();
  const n = opt.n, d = opt.d, ks = opt.ks, best = Math.max(...ks.filter(k => d * k <= n));
  let picked = null, phase = 0;
  const tbody = h("tbody");
  const ins = ks.map(k => {
    const i = d3Num(`${d} × ${k}`, true);
    const tr = h("tr", { style: "cursor:pointer", onclick: () => { if (phase !== 1) return; picked = k; [...tbody.children].forEach(x => x.classList.remove("pick")); tr.classList.add("pick"); } },
      h("td", { class: "jua" }, `${d} × ${k} =`), h("td", {}, i));
    tbody.append(tr); return i;
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
  const btn = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (phase === 0) {
      let bad = null;
      ins.forEach((i, k) => { const g = d3Val(i) === d * ks[k]; d3Paint(i, g); if (!g && bad == null) bad = ks[k]; });
      if (bad != null) return api.fail(`${d} × ${bad}${d3J(bad, "을를").slice(String(bad).length)} 다시 계산해 봐요.`, ins.map(i => i.value).join(","));
      phase = 1; drawLine(); ins.forEach(i => { i.readOnly = true; i.tabIndex = -1; i.style.cursor = "pointer"; i.style.background = "transparent"; });   /* disabled 칸은 눌러도 줄이 골라지지 않아 readOnly로 */
      return api.hint(`○ 곱을 잘 구했어요. 이제 ${n}보다 크지 않으면서 ${n}에 가장 가까운 곱을 표에서 눌러 골라요.`);
    }
    if (phase === 1) {
      if (picked == null) return api.fail("표에서 곱셈식 한 줄을 눌러 골라요.", "(고르지 않음)");
      if (d * picked > n) return api.fail(`${d} × ${picked} = ${d * picked}${d3J(d * picked, "은는").slice(String(d * picked).length)} ${n}보다 커요. ${n}보다 크지 않은 곱을 골라요.`, `[고름] ${d}×${picked}`);
      if (picked !== best) return api.fail(`${d} × ${picked}보다 ${n}에 더 가까운 곱이 있어요.`, `[고름] ${d}×${picked}`);
      phase = 2; btn.remove();
      api.hint(tens ? `몫은 ${best}보다 크고 ${best + 10}보다 작아요. 몫의 십의 자리 숫자는 ${d3J(best / 10, "이에요")}.` : `${d} × ${best} = ${d * best}이므로 몫은 ${d3J(best, "이에요")}.`);
      const items = tens ? [{ q: `남은 수 ${n} − ${d * best} =`, a: n - d * best }, { div: [n, d], chk: opt.chk !== false, names: opt.names, units: opt.units }]
        : [{ div: [n, d], chk: opt.chk !== false, names: opt.names, units: opt.units }];
      d3Calc(ans, api, items, { ok: opt.ok });
    }
  } }, "확인하기");
  body.append(h("div", { class: "d3wrap" }, h("table", { class: "d3tbl" }, tbody), h("div", { style: "flex:1;min-width:14em" }, h("p", {}, opt.tip || "① 표의 곱을 먼저 구해요. ② 곱이 수직선에 나타나면, 나누어지는 수보다 크지 않으면서 가장 가까운 곱의 줄을 눌러 골라요."))),
    fig, h("div", { class: "actions" }, btn), ans);
}

/* ⑪ 세로셈 나눗셈 (나누는 수가 두 자리), 몫을 어림하고 고치며 한 자리씩  opt: n, d, chk, title, ok */
function d3LongDiv(body, api, opt) {
  d3Style();
  const n = opt.n, d = opt.d, q = Math.floor(n / d), r = n % d, N = String(n), L = N.length, D = String(d), dl = D.length;
  const two = q >= 10;
  const box = h("div", { class: "d3v" }, h("div", { class: "d3ttl" }, opt.title || `${n} ÷ ${d}`));
  const left = () => Array.from({ length: dl + 1 }, () => d3C(""));
  const mk = (cells, label) => { const rr = h("div", { class: "d3row" }); cells.forEach(c => rr.append(c)); const lb = h("span", { class: "d3lab" }, label || ""); rr.append(lb); rr._lab = lb; box.append(rr); return rr; };
  const stages = (two ? [{ place: 10, col: L - 2 }, { place: 1, col: L - 1 }] : [{ place: 1, col: L - 1 }]);
  stages.forEach(s => s.qIn = d3Cell("몫"));
  const qCells = Array.from({ length: L }, (_, k) => { const s = stages.find(x => x.col === k); return s ? s.qIn : d3C(""); });
  mk(left().concat(qCells), "← 몫");
  const divCells = D.split("").map(ch => d3C(ch)).concat([d3C(")", "d3brk")]).concat(N.split("").map(ch => d3C(ch, "d3top")));
  mk(divCells);
  const hidden = [];
  stages.forEach((s, si) => {
    s.pIns = Array.from({ length: s.place === 10 ? L - 1 : L }, () => d3Cell("뺄 수"));
    const pc = s.place === 10 ? s.pIns.concat([d3C("0", "d3fade")]) : s.pIns;
    s.pRow = mk(left().concat(pc), "");
    s.lRow = mk(left().concat(Array.from({ length: L }, () => d3C("", "d3top"))));
    s.lRow.classList.add("d3thin");
    s.dIns = Array.from({ length: L }, () => d3Cell("남은 수"));
    s.dRow = mk(left().concat(s.dIns), si === stages.length - 1 ? "← 나머지" : "← 남은 수");
    if (si > 0) hidden.push(s.pRow, s.lRow, s.dRow);
  });
  hidden.forEach(x => x.style.display = "none");
  let si = 0, sub = "q", cur = n;
  const setActive = () => {
    stages.forEach((s, k) => {
      s.qIn.disabled = !(k === si && sub === "q");
      [...s.pIns, ...s.dIns].forEach(x => x.disabled = !(k === si && sub === "pd"));
      [s.pRow, s.dRow].forEach(rw => rw.classList.toggle("d3act", k === si && sub === "pd"));
    });
    const s = stages[si];
    if (s) st.textContent = sub === "q" ? (s.place === 10 ? `몫의 십의 자리 숫자를 어림해 써요. (${cur}에서 ${d3J(d, "을를")} 몇십 번 뺄 수 있을까요?)` : `${two ? "몫의 일의 자리 숫자를" : "몫을"} 어림해 써요. (${cur}에서 ${d3J(d, "을를")} 몇 번 뺄 수 있을까요?)`)
      : `${d} × ${Number(s.qIn.value) * s.place}의 곱을 쓰고, ${cur}에서 빼요.`;
  };
  const st = h("p", { class: "inst" });
  const chkBox = h("div", { class: "d3chk", style: "display:none" });
  const c1 = d3Num("검산 곱", true), c2 = d3Num("검산 합", true);
  chkBox.append(h("span", { class: "jua" }, "계산이 맞는지 확인해요 · "), h("span", {}, `${d} × ${q} = `), c1, h("span", {}, ` , □ + ${r} = `), c2);
  c1.addEventListener("input", () => { chkBox.children[3].textContent = ` , ${c1.value || "□"} + ${r} = `; });
  api.provide({ words: ["몫 어림", "1 크게", "1 작게", "나머지 < 나누는 수"], answers: [`${n} ÷ ${d} = ${q}${r ? ` … ${r}` : ""}`] });
  let phaseChk = false;
  const resetStage = s => { s.qIn.value = ""; [...s.pIns, ...s.dIns].forEach(x => { x.value = ""; x.style.borderColor = ""; }); s.qIn.style.borderColor = ""; s.pRow._lab.textContent = ""; };
  const btn = h("button", { class: "big", onclick: () => {
    if (phaseChk) {
      api.tryOnce();
      const g1 = d3Val(c1) === d * q, g2 = d3Val(c2) === n; d3Paint(c1, g1); d3Paint(c2, g2);
      if (!g1) return api.fail(`${d} × ${q}${d3J(q, "을를").slice(String(q).length)} 다시 계산해 봐요.`, `검산 ${c1.value}`);
      if (!g2) return api.fail(`${d * q} + ${r}${d3J(r, "을를").slice(String(r).length)} 계산해 봐요. ${n}${d3J(n, "이가").slice(String(n).length)} 나오면 맞아요.`, `검산 ${c1.value}+${r}=${c2.value}`);
      btn.disabled = true;
      return api.done(`${n}÷${d}=${q}…${r} | 검산 ${d}×${q}=${d * q}, ${d * q}+${r}=${n}`, opt.ok || `${n} ÷ ${d} = ${q}${r ? ` … ${r}` : ""}. 검산까지 정확해요!`);
    }
    const s = stages[si];
    if (sub === "q") {
      const v = parseInt(s.qIn.value, 10);
      if (isNaN(v) || (v < 1 && s.place === 10)) return api.hint(s.place === 10 ? "몫 칸에 1부터 9까지의 숫자를 써요." : "몫 칸에 0부터 9까지의 숫자를 써요.");
      api.tryOnce();
      const prod = d * v * s.place;
      if (prod > cur) {
        s.qIn.value = ""; s.qIn.style.borderColor = "var(--tent)";
        return api.hint(`${d} × ${v * s.place} = ${d3J(prod, "은는")} ${cur}보다 커서 뺄 수 없어요. 몫을 1 작게 해 봐요. (어림한 몫을 고치는 것은 자연스러운 일이에요.)`);
      }
      s.qIn.style.borderColor = "var(--ok)";
      s.pRow._lab.textContent = `← ${d} × ${v * s.place}`;
      sub = "pd"; setActive(); s.pIns[s.pIns.length - 1].focus && s.pIns[s.pIns.length - 1].focus();
      return api.hint(s.place === 10 ? `○ 이제 ${d} × ${v * 10}의 곱을 써요. 일의 자리 0은 미리 써 두었어요.` : `○ 이제 ${d} × ${v}의 곱을 쓰고 빼요.`);
    }
    api.tryOnce();
    const v = Number(s.qIn.value), prod = d * v * s.place, diff = cur - prod;
    const pw = s.place === 10 ? d3Pad(prod / 10, L - 1) : d3Pad(prod, L);
    const pr = d3RowCheck(s.pIns, pw);
    if (!pr.same) {
      const got = s.pIns.map(x => x.value.trim()).join("");
      if (got && Number(got) === Number(pw.join(""))) return api.fail("곱은 맞았는데 자리가 어긋났어요. 나누어지는 수의 자리에 맞추어 써요.", `곱 ${got}`);
      return api.fail(s.place === 10 ? `${d} × ${v * 10}은 ${d} × ${v}의 10배예요. ${d} × ${v}의 값을 0 앞에 써요.` : `${d} × ${v}${d3J(v, "을를").slice(String(v).length)} 다시 계산해 봐요.`, `곱 ${got || "-"}`);
    }
    const dw = d3Pad(diff, L), dr = d3RowCheck(s.dIns, dw);
    if (!dr.same) {
      const got = s.dIns.map(x => x.value.trim()).join("");
      if (got && Number(got) === diff) return api.fail("뺀 수는 맞았는데 자리가 어긋났어요. 일의 자리를 맨 오른쪽 칸에 맞추어 써요.", `뺀 결과 ${got}`);
      return api.fail(`${cur} − ${d3J(prod, "을를")} 다시 계산해 봐요. 받아내림에 주의해요.`, `뺀 결과 ${got || "-"}`);
    }
    if (diff >= d * s.place) {
      const msg = `남은 ${diff}에서 ${d * s.place}${d3J(d * s.place, "을를").slice(String(d * s.place).length)} 한 번 더 뺄 수 있어요. 몫을 1 크게 해서 다시 해 봐요.`;
      resetStage(s); sub = "q"; setActive();
      return api.hint(msg);
    }
    [...s.pIns, ...s.dIns].forEach(x => x.disabled = true);
    si++; cur = diff;
    if (si < stages.length) {
      const ns = stages[si]; [ns.pRow, ns.lRow, ns.dRow].forEach(x => x.style.display = "");
      sub = "q"; setActive();
      return api.hint(`○ ${n} − ${prod} = ${diff}. 남은 ${diff}${d3J(diff, "은는").slice(String(diff).length)} ${d * 10}보다 작으니 이제 몫의 일의 자리를 구해요.`);
    }
    sub = "end"; setActive(); st.textContent = `몫 ${q}, 나머지 ${r}`;
    if (opt.chk) { phaseChk = true; chkBox.style.display = ""; return api.hint(`○ 몫은 ${q}, 나머지는 ${d3J(r, "이에요")}. 나머지가 ${d}보다 작아요. 이제 계산이 맞는지 확인해요.`); }
    btn.disabled = true;
    api.done(`${n}÷${d}=${q}…${r}`, opt.ok || `${n} ÷ ${d} = ${q}${r ? ` … ${r}` : ""}. 정확해요!`);
  } }, "확인하기");
  setActive();
  body.append(h("p", { class: "inst" }, opt.tip || "몫을 어림해 쓰고 ‘확인하기’, 그다음 곱과 뺀 결과를 쓰고 ‘확인하기’를 눌러요."), h("div", { class: "d3wrap" }, box, h("div", { style: "flex:1;min-width:12em" }, st)), chkBox, h("div", { class: "actions" }, btn));
}

/* 나눗셈 세로셈 그림(글자만, 몫 한 자리): 잘못 계산한 친구의 계산 */
function d3DivFig(n, d, qd) {
  d3Style();
  const N = String(n), L = N.length, D = String(d), dl = D.length, prod = d * qd, diff = n - prod;
  const box = h("div", { class: "d3v" });
  const mk = cells => { const rr = h("div", { class: "d3row" }); cells.forEach(c => rr.append(c)); box.append(rr); return rr; };
  const left = () => Array.from({ length: dl + 1 }, () => d3C(""));
  mk(left().concat(d3Pad(qd, L).map(ch => d3C(ch))));
  mk(D.split("").map(ch => d3C(ch)).concat([d3C(")", "d3brk")]).concat(N.split("").map(ch => d3C(ch, "d3top"))));
  mk(left().concat(d3Pad(prod, L).map(ch => d3C(ch))));
  mk(left().concat(Array.from({ length: L }, () => d3C("", "d3top")))).classList.add("d3thin");
  mk(left().concat(d3Pad(diff, L).map(ch => d3C(ch))));
  return box;
}
/* ⑫ 잘못 계산한 곳 찾기  opt: n, d, wq(틀린 몫), reasons:[], ra, ok */
function d3FixDiv(body, api, opt) {
  d3Style();
  const n = opt.n, d = opt.d, q = Math.floor(n / d), r = n % d;
  let pick = null;
  const row = h("div", { class: "opts" });
  opt.reasons.forEach((t, i) => row.append(h("button", { class: "opt", onclick: e => { pick = i; [...row.children].forEach(x => x.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); } }, t)));
  const qi = d3Num("몫"), ri = d3Num("나머지");
  api.provide({ words: ["나머지", "나누는 수", "몫을 1 크게"], answers: [opt.reasons[opt.ra], `${n} ÷ ${d} = ${q} … ${r}`] });
  body.append(h("div", { class: "d3wrap" }, h("div", {}, h("div", { class: "jua" }, "친구의 계산"), d3DivFig(n, d, opt.wq)),
    h("div", { style: "flex:1;min-width:14em" }, h("div", { class: "jua" }, "잘못 계산한 까닭은?"), row,
      h("div", { class: "qitem d3calc" }, h("span", { class: "jua" }, `옳게 계산하면 ${n} ÷ ${d} =`), h("span", { class: "d3qr" }, h("span", {}, "몫"), qi), h("span", { class: "jua" }, "…"), h("span", { class: "d3qr" }, h("span", {}, "나머지"), ri)))),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const qv = d3Val(qi); let rv = d3Val(ri); if (rv == null && r === 0) rv = 0;
      const given = `${pick == null ? "-" : opt.reasons[pick]} / ${qi.value}…${ri.value}`;
      const btn = pick == null ? null : row.children[pick];
      if (btn) btn.classList.add(pick === opt.ra ? "good" : "bad");
      d3Paint(qi, qv === q); d3Paint(ri, rv === r);
      if (pick !== opt.ra) return api.fail((opt.why && opt.why[pick]) || "까닭을 다시 골라 보세요. 친구가 쓴 나머지와 나누는 수를 견주어 봐요.", given);
      if (qv !== q || rv !== r) return api.fail(rv != null && rv >= d ? `나머지는 ${d}보다 작아야 해요.` : `${d}에 몇을 곱해야 ${n}보다 크지 않으면서 가장 가까운지 다시 생각해 봐요.`, given);
      api.done(given, opt.ok || `${n} ÷ ${d} = ${q} … ${r}. 나머지는 나누는 수보다 작아야 해요.`);
    } }, "확인하기")));
}

/* ⑬ 수 카드로 식 만들기: 세 자리 수와 두 자리 수  opt: cards, mode "mul"(가장 큰 세 자리 수 × 가장 작은 두 자리 수) | "div"(몫이 가장 큰 나눗셈), ok */
function d3Cards(body, api, opt) {
  d3Style();
  const cards = opt.cards, mode = opt.mode || "mul", op = mode === "mul" ? "×" : "÷";
  let placed = [];
  const perms = [];
  const rec = (pre, rest) => { if (pre.length === 5) { perms.push(pre); return; } rest.forEach((c, i) => rec(pre.concat(c), rest.filter((_, k) => k !== i))); };
  rec([], cards);
  const num = arr => arr.reduce((s, x) => s * 10 + x, 0);
  const ok3 = p => p[0] !== 0 && p[3] !== 0;
  let bestA, bestB, bestQ;
  if (mode === "mul") {
    bestA = Math.max(...perms.filter(ok3).map(p => num(p.slice(0, 3))));
    bestB = Math.min(...perms.filter(p => ok3(p) && num(p.slice(0, 3)) === bestA).map(p => num(p.slice(3))));
  } else bestQ = Math.max(...perms.filter(ok3).map(p => Math.floor(num(p.slice(0, 3)) / num(p.slice(3)))));
  const row = h("div", { class: "d3cards" });
  const show = h("div", { class: "d3slots" });
  const out1 = d3Num(mode === "mul" ? "곱" : "몫", true), out2 = d3Num("나머지");
  const draw = () => {
    const s = placed.map(i => String(cards[i])).concat(Array(5 - placed.length).fill("□"));
    show.textContent = `${s.slice(0, 3).join("")} ${op} ${s.slice(3).join("")} =`;
    [...row.children].forEach((b, i) => b.classList.toggle("on", placed.includes(i)));
  };
  cards.forEach((c, i) => row.append(h("button", { class: "opt", onclick: () => { if (placed.includes(i) || placed.length >= 5) return; placed.push(i); draw(); } }, String(c))));
  api.provide({ words: ["가장 큰 수", "가장 작은 수", "높은 자리"], answers: [mode === "mul" ? `${bestA} × ${bestB} = ${bestA * bestB}` : opt.answer || ""] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (placed.length < 5) return api.fail("수 카드 5장을 모두 놓아요.", "(카드를 다 놓지 않음)");
    const p = placed.map(i => cards[i]), A = num(p.slice(0, 3)), B = num(p.slice(3)), tag = `${A}${op}${B}`;
    if (!ok3(p)) return api.fail("가장 높은 자리에는 0을 놓을 수 없어요.", tag);
    if (mode === "mul") {
      if (A !== bestA) return api.fail("가장 큰 세 자리 수를 만들려면 큰 수부터 높은 자리에 놓아요.", tag);
      if (B !== bestB) return api.fail("남은 카드로 가장 작은 두 자리 수를 만들려면 작은 수를 십의 자리에 놓아요.", tag);
      const v = d3Val(out1); d3Paint(out1, v === A * B);
      if (v !== A * B) return api.fail(`${A} × ${B}의 곱을 다시 계산해 봐요. ${A} × ${d3J(B % 10, "과와")} ${A} × ${Math.floor(B / 10) * 10}을 더해요.`, `${tag}=${out1.value}`);
      return api.done(`${tag}=${A * B}`, opt.ok || `${A} × ${B} = ${A * B}. 수 카드로 만든 두 수의 곱을 구했어요!`);
    }
    const qq = Math.floor(A / B), rr = A % B;
    if (qq !== bestQ) return api.fail(`몫이 더 커지게 만들 수 있어요. 나누어지는 수는 크게, 나누는 수는 작게 만들어 봐요.`, tag);
    const qv = d3Val(out1); let rv = d3Val(out2); if (rv == null && rr === 0) rv = 0;
    d3Paint(out1, qv === qq); d3Paint(out2, rv === rr);
    if (qv !== qq || rv !== rr) return api.fail(rv != null && rv >= B ? `나머지는 나누는 수 ${B}보다 작아야 해요.` : `${A} ÷ ${B}의 몫과 나머지를 다시 계산해 봐요.`, `${tag}=${out1.value}…${out2.value}`);
    api.done(`${tag}=${qq}…${rr}`, opt.ok || `${A} ÷ ${B} = ${qq} … ${rr}. 몫이 가장 큰 나눗셈을 만들었어요!`);
  } }, "확인하기");
  draw();
  d3Add(body, h("p", {}, opt.tip || "카드를 차례로 눌러 앞의 세 칸, 뒤의 두 칸에 놓아요."), row,
    h("div", { class: "row", style: "align-items:center;gap:.5em;flex-wrap:wrap" }, show, out1, mode === "div" ? h("span", { class: "jua" }, "…") : null, mode === "div" ? out2 : null,
      h("button", { class: "ghost", onclick: () => { placed = []; draw(); } }, "다시 놓기")),
    mode === "div" ? h("p", { class: "inst", style: "font-size:var(--fs-s)" }, "앞 칸: 몫, 뒤 칸: 나머지") : null, h("div", { class: "actions" }, check));
}

/* ⑭ 가까운 몇백·몇십 찾기(어림)  opt: items:[{v, lo, hi, step, name}], ask, ok */
function d3RoundLine(body, api, opt) {
  const items = opt.items, picks = items.map(() => null);
  const svg = makeSvg(900, items.length * 150 + 10);
  const X0 = 130, X1 = 770;
  const near = it => (it.v - it.lo <= it.hi - it.v) ? it.lo : it.hi;
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
        svg.append(svgEl("circle", { cx: X(v), cy: y, r: 34, fill: on ? D3_PSOFT : "#fff", stroke: on ? PINE : BLUE, "stroke-width": 3, style: "cursor:pointer" }), txt(X(v), y + 1, String(v), 22));
      });
      svg.append(svgEl("polygon", { points: `${X(it.v) - 10},${y - 34} ${X(it.v) + 10},${y - 34} ${X(it.v)},${y - 14}`, fill: TENT }), txt(X(it.v), y - 48, String(it.v), 24, { fill: TENT }));
      if (picks[k] != null) svg.append(svgEl("line", { x1: X(it.v), y1: y + 40, x2: X(picks[k]), y2: y + 40, stroke: PINE, "stroke-width": 4, "marker-end": "" }), txt((X(it.v) + X(picks[k])) / 2, y + 56, `${Math.abs(picks[k] - it.v)}만큼 차이`, 19, { fill: PINE }));
    });
  };
  dragOn(svg, p => {
    items.forEach((it, k) => {
      const y = 95 + k * 150, X = v => X0 + (v - it.lo) / (it.hi - it.lo) * (X1 - X0);
      [it.lo, it.hi].forEach(v => { if (Math.hypot(p.x - X(v), p.y - y) < 36) picks[k] = v; });
    });
    draw(); return false;
  }, () => {}, null);
  const ans = h("div");
  const g = d3Gate(api, () => items.every((it, k) => picks[k] === near(it)), () => {
    const k = items.findIndex((it, i) => picks[i] !== near(it));
    const it = items[k];
    return picks[k] == null ? `${d3J(it.v, "은는")} 양 끝의 두 수 중 어느 쪽에 더 가까운지 동그라미를 눌러 골라요.`
      : `${it.v}에서 ${it.lo}까지와 ${it.hi}까지의 거리를 견주어 봐요.`;
  });
  numbers(ans, g, opt.ask, { ok: opt.ok });
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || "주황 화살표의 수는 양 끝의 두 수 중 어느 쪽에 더 가까운가요? 더 가까운 쪽의 동그라미를 눌러요."), ans)));
}

/* ⑮ 나누기 쉬운 수 찾기(조화수)  opt: n, d, lo, hi, need, unit, ask(t)→[numbers], ok */
function d3Compat(body, api, opt) {
  const n = opt.n, d = opt.d, lo = opt.lo, hi = opt.hi, need = opt.need || 1;
  const found = [];
  const svg = makeSvg(900, 230);
  const X = v => 60 + (v - lo) / (hi - lo) * 780, Y = 120;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(450, 28, `${n}에 가까우면서 ${d3J(d, "으로")} 나누기 쉬운 수를 눌러 찾아요`, 21));
    svg.append(svgEl("line", { x1: X(lo) - 10, y1: Y, x2: X(hi) + 10, y2: Y, stroke: INK, "stroke-width": 3 }));
    for (let v = lo; v <= hi; v += 10) {
      const f = found.includes(v);
      svg.append(svgEl("line", { x1: X(v), y1: Y - 12, x2: X(v), y2: Y + 12, stroke: INK, "stroke-width": 2 }));
      svg.append(svgEl("rect", { x: X(v) - 26, y: Y + 22, width: 52, height: 34, rx: 8, fill: f ? D3_PSOFT : "#fff", stroke: f ? PINE : D3_GRAY, "stroke-width": 2, style: "cursor:pointer" }), txt(X(v), Y + 40, String(v), 17));
      if (f) svg.append(txt(X(v), Y + 76, `${v}÷${d}`, 16, { fill: PINE }));
    }
    svg.append(svgEl("polygon", { points: `${X(n) - 10},${Y - 40} ${X(n) + 10},${Y - 40} ${X(n)},${Y - 18}`, fill: TENT }), txt(X(n), Y - 54, String(n), 20, { fill: TENT }));
  };
  const ans = h("div");
  dragOn(svg, p => {
    if (found.length >= need) return false;
    const v = Math.round((lo + (p.x - 60) / 780 * (hi - lo)) / 10) * 10;
    if (v < lo || v > hi || Math.abs(p.y - (Y + 39)) > 30) return false;
    if (v % d !== 0) { api.hint(`${v}${d3J(v, "은는").slice(String(v).length)} ${d3J(d, "으로")} 나누면 나누어떨어지지 않아요. ${d}씩 뛰어 센 수를 떠올려 봐요.`); return false; }
    if (Math.abs(v - n) >= d) { api.hint(`${v}${d3J(v, "은는").slice(String(v).length)} ${d3J(d, "으로")} 나누기 쉽지만 ${n}에서 조금 멀어요. 더 가까운 수를 찾아요.`); return false; }
    if (!found.includes(v)) found.push(v);
    draw();
    if (found.length >= need) { api.hint(`○ 나누기 쉬운 수를 찾았어요. 이제 나누어 보세요.`); numbers(ans, api, opt.ask(found), { ok: opt.ok }); }
    else api.hint(`○ ${v}${d3J(v, "을를").slice(String(v).length)} 찾았어요. ${n}에 가까운 다른 수도 있어요.`);
    return false;
  }, () => {}, null);
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", {}, opt.tip || `수직선 아래 수 칸을 눌러 ${d3J(d, "으로")} 나누기 쉬운 수를 찾아요.`), ans)));
}

/* ⑯ 샐러드 물 발자국: 재료 카드를 그릇에 담고 합을 구해 견주기
   opt: cards:[{name, L, col}], bowls:[{name, need:[이름…]}], people, after:[numbers], ok */
function d3Salad(body, api, opt) {
  d3Style();
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
    svg.append(txt(450, 24, "재료 카드를 끌어 알맞은 샐러드 그릇에 담아요", 24));
    bowls.forEach((b, k) => {
      const r = bowlR(k);
      svg.append(svgEl("path", { d: `M${r[0]},${r[1] + 40} L${r[0] + r[2]},${r[1] + 40} Q${r[0] + r[2] - 20},${r[1] + r[3]} ${r[0] + r[2] / 2},${r[1] + r[3]} Q${r[0] + 20},${r[1] + r[3]} ${r[0]},${r[1] + 40}Z`, fill: sel != null ? "#F4FAF6" : "#FBFCFB", stroke: PINE, "stroke-width": 3 }));
      svg.append(txt(r[0] + r[2] / 2, r[1] + 22, b.name, 22, { fill: PINE }));
    });
    cards.forEach(c => {
      const [x, y] = cardXY(c);
      svg.append(svgEl("rect", { x, y, width: CW, height: CH, rx: 10, fill: "#fff", stroke: sel === c.id ? TENT : INK, "stroke-width": sel === c.id ? 4 : 2, style: "cursor:grab" }),
        svgEl("circle", { cx: x + 22, cy: y + CH / 2, r: 14, fill: c.col, stroke: INK, "stroke-width": 1.5 }),
        txt(x + 80, y + 27, c.name, 22), txt(x + 80, y + 57, `${c.L} L`, 21, { fill: BLUE }));
    });
  };
  const hitCard = p => [...cards].reverse().find(c => { const [x, y] = cardXY(c); return d3In(p, [x, y, CW, CH]); });
  const hitBowl = p => bowls.findIndex((_, k) => d3In(p, bowlR(k)));
  let drag = null, ghost = null, downP = null;
  dragOn(svg, p => {
    if (phase) return false;
    const c = hitCard(p);
    if (c) { drag = c; sel = c.id; downP = p; draw(); ghost = svgEl("rect", { x: p.x - CW / 2, y: p.y - CH / 2, width: CW, height: CH, rx: 10, fill: "none", stroke: TENT, "stroke-width": 3, "stroke-dasharray": "6 5", "pointer-events": "none" }); svg.append(ghost); return true; }
    const b = hitBowl(p);
    if (b >= 0 && sel != null) { cards[sel].at = b; sel = null; draw(); }
    else if (sel != null && p.y < 140) { cards[sel].at = -1; sel = null; draw(); }
    return false;
  }, p => { if (ghost) { ghost.setAttribute("x", p.x - CW / 2); ghost.setAttribute("y", p.y - CH / 2); } },
  p => {
    if (drag && downP && Math.hypot(p.x - downP.x, p.y - downP.y) < 8) { drag = null; ghost = null; draw(); return; }   /* 살짝 누르기: 카드를 고른 채로 두고, 그릇을 누르면 담김 */
    const b = hitBowl(p);
    if (drag && b >= 0) { drag.at = b; sel = null; }
    else if (drag && p.y < 140) { drag.at = -1; sel = null; }
    drag = null; ghost = null; draw();
  });
  const sideTop = h("div");
  const totals = bowls.map(b => d3Num(`${b.name} 물 발자국 합`, true));
  const pickRow = h("div", { class: "opts" });
  let pick = null;
  bowls.forEach((b, k) => pickRow.append(h("button", { class: "opt", onclick: e => { pick = k; [...pickRow.children].forEach(x => x.classList.remove("on")); e.currentTarget.classList.add("on"); } }, b.name)));
  const phase2 = h("div", { style: "display:none" },
    ...bowls.map((b, k) => h("div", { class: "qitem d3calc" }, h("span", { class: "jua" }, `${b.name} 1인분:`), totals[k], h("span", {}, "L"))),
    h("div", { class: "jua" }, "물 발자국을 줄이려면 어떤 샐러드를 만들어야 할까요?"), pickRow);
  const sums = bowls.map(b => b.need.reduce((s, nm) => s + cards.find(c => c.name === nm).L, 0));
  const bestB = sums.indexOf(Math.min(...sums));
  const ans = h("div");
  api.provide({ words: ["물 발자국", "1인분", "더 적은"], answers: bowls.map((b, k) => `${b.name} ${sums[k]} L`).concat([bowls[bestB].name]) });
  const btn = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (phase === 0) {
      const left = cards.filter(c => c.at < 0);
      if (left.length) return api.fail("아직 그릇에 담지 않은 재료 카드가 있어요.", `남은 카드 ${left.length}`);
      const bad = bowls.findIndex((b, k) => { const got = inBowl(k).map(c => c.name).sort().join(","), want = b.need.slice().sort().join(","); return got !== want; });
      if (bad >= 0) return api.fail(`${bowls[bad].name}의 재료를 다시 살펴봐요. 샐러드 이름에 재료가 들어 있어요.`, inBowl(bad).map(c => c.name).join(","));
      phase = 1; phase2.style.display = ""; draw();
      return api.hint("○ 잘 담았어요. 이제 샐러드 1인분의 물 발자국을 각각 구하고, 어떤 샐러드를 만들지 골라요.");
    }
    if (phase === 1) {
      let bad = null;
      totals.forEach((t, k) => { const g = d3Val(t) === sums[k]; d3Paint(t, g); if (!g && bad == null) bad = k; });
      if (bad != null) return api.fail(`${bowls[bad].name}에 담은 재료의 물 발자국을 모두 더해 봐요.`, totals.map(t => t.value).join(","));
      if (pick == null) return api.fail("어떤 샐러드를 만들지 골라요.", "(고르지 않음)");
      if (pick !== bestB) return api.fail(`물 발자국이 더 적은 샐러드를 골라야 해요. ${sums[0]} L와 ${sums[1]} L를 견주어 봐요.`, bowls[pick].name);
      phase = 2; btn.remove();
      if (opt.after) { api.hint(`○ ${bowls[bestB].name}의 물 발자국이 더 적어요. 이제 ${opt.people}인분의 물 발자국을 구해요.`); return numbers(ans, api, opt.after, { ok: opt.ok }); }
      return api.done(bowls.map((b, k) => `${b.name} ${sums[k]}`).join(", ") + ` → ${bowls[bestB].name}`, opt.ok);
    }
  } }, "확인하기");
  draw();
  body.append(stageWrap(svg, h("div", { class: "side" }, sideTop, h("p", {}, opt.tip || "재료 카드를 끌어 그릇에 놓아요. 카드를 누른 다음 그릇을 눌러도 돼요. 잘못 담으면 카드를 위쪽으로 다시 옮겨요."), phase2, h("div", { class: "actions" }, btn), ans)));
}

/* ⑰ 우주여행 놀이판 (놀이를 더하다) — 나와 친구(컴퓨터)가 번갈아 주사위를 굴려요 */
const D3_BOARD = ["210÷30", "124×32", "84÷21", "560÷70", "95÷18", "315×24", "432÷36", "450÷60", "206×45", "78÷13", "589÷31",
  "612×15", "91÷24", "728÷52", "253×40", "670÷80", "806÷26", "845×19", "963÷42", "60÷15", "507×36", "740÷37"];
function d3Parse(e) { const m = e.match(/^(\d+)([×÷])(\d+)$/); const a = +m[1], b = +m[3]; return m[2] === "×" ? { op: "×", a, b, p: a * b } : { op: "÷", a, b, q: Math.floor(a / b), r: a % b }; }
function d3Space(body, api, opt) {
  d3Style();
  const cells = ["출발"].concat(D3_BOARD, ["도착"]), last = cells.length - 1, COLS = 6;
  const CW = 140, CH = 82;
  const cxy = i => { const r = Math.floor(i / COLS), c = r % 2 ? COLS - 1 - i % COLS : i % COLS; return [16 + c * (CW + 4), 12 + (3 - r) * (CH + 14)]; };
  const svg = makeSvg(880, 400);
  let me = 0, fr = 0, prev = 0, state = "roll", correct = 0, busy = false, done = false;
  const goal = opt.goal || 4;
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: 880, height: 400, fill: "#1F2A44" }));
    [[60, 40], [300, 380], [520, 60], [780, 300], [420, 210], [840, 30], [150, 260]].forEach(([x, y], k) => svg.append(svgEl("circle", { cx: x, cy: y, r: k % 3 ? 2 : 3, fill: "#FFF6C8" })));
    for (let i = 0; i < last; i++) {
      const [x1, y1] = cxy(i), [x2, y2] = cxy(i + 1);
      svg.append(svgEl("line", { x1: x1 + CW / 2, y1: y1 + CH / 2, x2: x2 + CW / 2, y2: y2 + CH / 2, stroke: "#8EA3D6", "stroke-width": 6 }));
    }
    cells.forEach((t, i) => {
      const [x, y] = cxy(i), sp = i === 0 || i === last;
      svg.append(svgEl("rect", { x, y, width: CW, height: CH, rx: 16, fill: sp ? "#F7E3A1" : "#fff", stroke: sp ? TENT : "#8EA3D6", "stroke-width": 3 }));
      svg.append(txt(x + CW / 2, y + CH / 2 + 2, t.replace(/([×÷])/, " $1 "), sp ? 26 : 24));
      if (!sp) svg.append(txt(x + 14, y + 13, String(i), 11, { fill: "#8a9" }));
    });
    const tok = (i, col, label, off) => { const [x, y] = cxy(i); svg.append(svgEl("circle", { cx: x + CW - 20 - off, cy: y + CH - 18, r: 18, fill: col, stroke: "#fff", "stroke-width": 3 }), txt(x + CW - 20 - off, y + CH - 17, label, 13, { fill: "#fff" })); };
    tok(fr, TENT, "친구", me === fr ? 40 : 0); tok(me, BLUE, "나", 0);
  };
  const dieBox = h("div", { class: "readout", style: "font-size:var(--fs-l);text-align:center" }, "주사위: -");
  const status = h("p", { class: "inst" }, "‘주사위 굴리기’를 눌러 시작해요.");
  const score = h("div", { class: "readout" });
  const log = h("div", { class: "d3log" });
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
    const e = d3Parse(cells[me]); state = "answer"; work.innerHTML = "";
    const lab = h("div", { class: "jua" }, `${e.a} ${e.op} ${e.b} =`);
    const i1 = d3Num(e.op === "×" ? "곱" : "몫", true), i2 = e.op === "÷" ? d3Num("나머지") : null;
    const okB = h("button", { class: "big", onclick: () => {
      if (state !== "answer") return;
      api.tryOnce();
      const v1 = d3Val(i1); let v2 = i2 ? d3Val(i2) : 0; if (i2 && v2 == null && e.r === 0) v2 = 0;
      const good = e.op === "×" ? v1 === e.p : (v1 === e.q && v2 === e.r);
      const shown = `${e.a}${e.op}${e.b}=${i1.value}${i2 ? "…" + (i2.value || "0") : ""}`;
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
    } }, "답 말하기");
    work.append(h("div", { class: "qitem d3calc" }, lab, i2 ? h("span", { class: "d3qr" }, h("span", {}, "몫"), i1) : i1, i2 ? h("span", { class: "jua" }, "…") : null, i2 ? h("span", { class: "d3qr" }, h("span", {}, "나머지"), i2) : null), h("div", { class: "actions" }, okB));
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
    const e = d3Parse(cells[fr]);
    const wrong = Math.random() < .3;
    let said;
    if (e.op === "×") { const T = Math.floor(e.b / 10), O = e.b % 10; said = wrong ? (O ? `${e.a * O + e.a * T}` : `${e.a * T}`) : `${e.p}`; }
    else said = wrong && e.q >= 2 ? `${e.q - 1} … ${e.r + e.b}` : wrong ? `${e.q + 1} … 0` : `${e.q}${e.r ? ` … ${e.r}` : ""}`;
    const real = e.op === "×" ? `${e.p}` : `${e.q}${e.r ? ` … ${e.r}` : ""}`;
    const isWrong = said !== real;
    state = "judge";
    status.textContent = `친구가 ${e.a} ${e.op} ${e.b} = ${said}${d3J(said, "이가").endsWith("이") ? "이라고" : "라고"} 했어요. 맞는지 확인해 주세요.`;
    work.innerHTML = "";
    const judge = ok => {
      if (state !== "judge") return;
      const right = ok === !isWrong;
      log.prepend(h("div", {}, `${isWrong ? "×" : "○"} 친구: ${e.a}${e.op}${e.b}=${said}`));
      if (isWrong) { fr = fprev; draw(); }
      work.innerHTML = ""; state = "roll";
      status.textContent = right ? `${isWrong ? "잘 찾았어요! 친구 말은 전에 있던 칸으로 돌아가요." : "맞아요. 친구가 옳게 계산했어요."} 이제 내 차례예요.` : `다시 계산해 보면 ${e.a} ${e.op} ${e.b} = ${d3J(real, "이에요")}. ${isWrong ? "친구 말은 전에 있던 칸으로 돌아가요." : ""} 이제 내 차례예요.`;
    };
    work.append(h("div", { class: "row" }, h("button", { class: "ghost", onclick: () => judge(true) }, "맞아요"), h("button", { class: "ghost", onclick: () => judge(false) }, "틀렸어요")));
  };
  rollB.onclick = myRoll;
  const reset = () => { me = 0; fr = 0; prev = 0; state = "roll"; work.innerHTML = ""; dieBox.textContent = "주사위: -"; status.textContent = "‘주사위 굴리기’를 눌러 시작해요."; draw(); };
  draw(); setScore();
  body.append(stageWrap(svg, h("div", { class: "side" }, h("p", { style: "font-size:var(--fs-s)" }, opt.tip || `파란 말이 나, 주황 말이 친구예요. 계산을 ${goal}번 맞히거나 도착하면 이 계단을 통과해요.`),
    rollB, dieBox, status, work, score, h("button", { class: "ghost", onclick: () => { if (!busy) reset(); } }, "처음부터"), log)));
}
//@@LESSONS
const UNIT_STORY = { title: "가정의 달 축제 자원봉사", lines: [
  "선우네 가족은 가정의 달 축제에서 자원봉사를 하고 있어요. 입장 팔찌, 블록, 엽서, 카네이션, 빵, 기념품까지 준비할 것이 많아요.",
  "선우는 블록의 수를 셀 때에는 곱셈을, 준비물을 나눌 때에는 나눗셈을 이용하는 것을 알게 되었어요.",
  "교과서 「수학 4-1」 3. 곱셈과 나눗셈의 차시 순서 그대로 만들었어요."],
  one: "가정의 달 축제 · 선우와 함께 곱셈으로 세고 나눗셈으로 나누어요." };
const UNIT_KEYWORDS = ["곱해지는 수", "곱하는 수", "곱", "10배", "몇십", "몇십몇", "나누어지는 수", "나누는 수", "몫", "나머지", "몫 어림", "몫을 1 크게", "몫을 1 작게", "검산", "어림셈", "물 발자국"];

/* ===== 3. 곱셈과 나눗셈 — 교과서 차시 버전 (11차시) ===== */
const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 가정의 달 축제에서 자원봉사를 해요", soop: "개념 찾기(S)",
  question: "우리 주변에서 곱셈과 나눗셈은 언제 쓰일까요?",
  summary: "같은 수가 여러 번 되풀이되면 곱셈을, 똑같이 나누거나 몇씩 묶으면 나눗셈을 써요. 이 단원에서는 (세 자리 수) × (두 자리 수), (두 자리 수)·(세 자리 수) ÷ (두 자리 수)를 배워요.",
  steps: [
    { name: "메뚜기 멀리뛰기", inst: "메뚜기는 몸길이의 약 20배만큼 멀리 뛸 수 있대요. 몸길이가 115 mm인 메뚜기는 얼마만큼 멀리 뛸 수 있을까요? 몸길이를 이어 놓아 보세요.", hints: ["막대를 끝까지 움직여 20배까지 이어 봐요.", "115 × 2 = 230이에요. 20은 2의 10배예요."],
      render: (b, a) => d3Hopper(b, a, { len: 115, max: 20, ask: [
        { q: "115 × 2 =", a: 230, unit: "mm" }, { q: "115 × 20 =", a: 2300, unit: "mm", why: { "230": "115 × 2의 곱이에요. 20은 2의 10배이니 곱도 10배예요." } }],
        ok: "몸길이 115 mm인 메뚜기는 약 2300 mm까지 뛸 수 있어요. 이런 곱셈을 이 단원에서 배워요." }) },
    { name: "곱셈·나눗셈 상황 찾기", inst: "가정의 달 축제 그림을 떠올리며 곱셈과 나눗셈이 필요한 상황을 찾아보세요.", hints: ["같은 수가 여러 번 되풀이되면 곱셈이에요.", "몇씩 나누어 담거나 똑같이 나누면 나눗셈이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "한 상자에 213개씩 들어 있는 블록 상자 18개의 블록 수를 구할 때 쓰는 셈은?", o: ["곱셈", "나눗셈"], a: 0, why: { "1": "213개씩 18번이 되풀이되므로 곱셈이에요." } },
        { q: "엽서 160장을 한 바구니에 20장씩 담을 때 필요한 바구니 수를 구할 때 쓰는 셈은?", o: ["곱셈", "나눗셈"], a: 1, why: { "0": "160장을 20장씩 묶어 몇 묶음인지 구하므로 나눗셈이에요." } },
        { q: "축제에서 할 수 있는 체험이 아닌 것은?", o: ["블록 만들기", "엽서 쓰기", "빵 만들기", "수영 대회"], a: 3 }]) },
    { name: "말해 보기", inst: "축제 그림을 보며 떠오른 생각을 써 보세요.", hints: ["축제에 가 본 경험을 떠올려 봐요.", "3학년 때 배운 곱셈·나눗셈과 무엇이 다를지 생각해 봐요."],
      render: (b, a) => writeStep(b, a, [
        { q: "보기: 축제 그림에서 어떤 상황이 보이나요?", tag: "보기", ph: "예: 블록 만들기 체험장에 블록을 옮겨요." },
        { q: "생각하기: 3학년 때 배운 곱셈·나눗셈과 어떤 점이 다를 것 같나요?", tag: "생각", ph: "예: 곱하는 수, 나누는 수가 두 자리 수가 돼요." },
        { q: "궁금해하기: 무엇이 궁금한가요?", tag: "궁금", ph: "예: 나누는 수가 두 자리이면 몫을 어떻게 구할까?" }]) },
    { name: "배운 내용 떠올리기", inst: "3학년 2학기에 배운 곱셈과 나눗셈을 떠올려 계산해 보세요.", hints: ["(세 자리 수) × (한 자리 수)는 일의 자리부터 곱해요.", "나눗셈은 나누는 수 × 몫 + 나머지 = 나누어지는 수로 확인해요."],
      render: (b, a) => d3Calc(b, a, [{ mul: [213, 4] }, { mul: [36, 24] }, { div: [75, 4], chk: true }, { div: [427, 6] }],
        { ok: "3학년 때 배운 곱셈과 나눗셈을 잘 기억하고 있어요. 이제 수가 더 커진 곱셈과 나눗셈을 배워요." }) },
    { name: "확인하기", inst: "알맞은 식을 골라 보세요.", hints: ["‘몇씩 몇 번’은 곱셈, ‘몇씩 나누면 몇 묶음’은 나눗셈이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "입장 팔찌가 한 묶음에 123개씩 20묶음 있어요. 팔찌 수를 구하는 식은?", o: ["123 × 20", "123 ÷ 20", "123 + 20"], a: 0 },
        { q: "참가한 사람 76명을 19모둠으로 똑같이 나눌 때 한 모둠의 사람 수를 구하는 식은?", o: ["76 × 19", "76 ÷ 19", "76 − 19"], a: 1 }]) }
  ],
  challenge: { inst: "몸길이가 115 mm인 메뚜기가 몸길이의 20배만큼 뛰었어요.", hints: ["115 × 20을 먼저 구해요.", "10 mm = 1 cm예요."], render: (b, a) => numbers(b, a, [
    { q: "뛴 거리 115 × 20 =", a: 2300, unit: "mm" },
    { q: "뛴 거리는 몇 cm인가요?", a: 230, unit: "cm" }],
    { ok: "2300 mm는 230 cm예요. 메뚜기는 정말 멀리 뛰어요!" }) }
},
{
  id: "t2", no: 2, title: "세 자리 수에 몇십을 곱해 볼까요", soop: "개념 구축하기(O)",
  question: "123 × 20은 어떻게 계산할까요?",
  summary: "(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 10배 해요. 123 × 2 = 246이니까 123 × 20 = 2460이에요.",
  steps: [
    { inst: "선우는 입장 팔찌를 한 묶음에 123개씩 20묶음 정리했어요. 세로 한 줄(123개씩 2묶음)씩 눌러 세어 보세요.", hints: ["세로 한 줄은 123 × 2 = 246개예요.", "246이 10번 있으니 246의 10배예요."],
      render: (b, a) => d3Bundles(b, a, { per: 123, k: 2, cols: 10, item: "입장 팔찌", ask: [
        { q: "123 × 2 =", a: 246 }, { q: "123 × 20은 123 × 2의 몇 배인가요?", a: 10, unit: "배" },
        { q: "123 × 20 =", a: 2460, why: { "246": "123 × 2의 곱이에요. 123 × 20은 그 10배예요." } }, { q: "입장 팔찌는 모두 몇 개인가요?", a: 2460, unit: "개" }],
        ok: "20은 2의 10배이니까 123 × 20은 123 × 2 = 246의 10배인 2460이에요. 입장 팔찌는 2460개예요." }) },
    { inst: "546 × 7의 곱을 자릿값 표에 넣고, 곱하는 수가 70이 되면 곱이 어떻게 되는지 숫자 줄을 옮겨 보세요.", hints: ["546 × 7 = 3822예요.", "곱하는 수가 10배가 되면 곱의 숫자가 한 자리씩 왼쪽으로 옮겨 가요."],
      render: (b, a) => d3TenShift(b, a, { a: 546, m: 7, extra: [{ q: "600 × 3 = 1800이니까 600 × 30 =", a: 18000, why: { "1800": "600 × 3의 곱이에요. 10배 해야 해요." } }] }) },
    { inst: "(세 자리 수) × (몇십)을 어떻게 계산했는지 말로 정리해요.", hints: ["30은 3의 10배예요."],
      render: (b, a) => blanks(b, a, ["(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 ", { o: ["10배", "2배", "100배"], a: 0 }, " 한 값과 같아요. 그래서 546 × 7 = 3822이면 546 × 70 = ", { o: ["38220", "3822", "382200"], a: 0 }, "이에요."]) },
    { name: "세로로 계산하기", inst: "203 × 40을 세로로 계산해 보세요. 203 × 4를 계산하고 일의 자리에 0을 써요.", hints: ["203 × 4 = 812예요.", "812를 10배 하면 일의 자리에 0이 생겨요."],
      render: (b, a) => d3LongMul(b, a, { a: 203, b: 40, ok: "203 × 40 = 8120. 203 × 4 = 812를 10배 했어요." }) },
    { name: "확인하기", inst: "계산해 보세요.", hints: ["먼저 (세 자리 수) × (몇)을 구하고 10배 해요.", "748 × 6 = 4488이에요."],
      render: (b, a) => d3Calc(b, a, [{ mul: [748, 60] }, { mul: [400, 20] }, { mul: [310, 50] }, { q: "매일 290 km씩 달리는 고속버스가 30일 동안 달린 거리 290 × 30 =", a: 8700, unit: "km", why: { "870": "290 × 3의 곱이에요. 10배 해야 해요." } }],
        { ok: "(세 자리 수) × (몇십)을 잘 계산했어요!" }) }
  ],
  challenge: { inst: "‘한 개에 950원인 지우개가 있습니다.’ 뒤에 950 × 80에 알맞은 문제를 이어 쓰고 풀어요. 그리고 □ 안의 수를 찾아요.", hints: ["80은 지우개의 수가 될 수 있어요.", "847 × 6 = 5082예요."], render: (b, a) => quiz(b, a, [
    { q: "950 × 80에 알맞은 문제는?", o: ["이 지우개를 80개 산다면 얼마를 내야 할까요?", "이 지우개 80원어치는 몇 개일까요?", "이 지우개를 사고 80원을 거슬러 받으면 얼마를 냈을까요?"], a: 0 },
    { q: "지우개 80개의 값 950 × 80은?", o: ["7600원", "76000원", "760000원"], a: 1, why: { "0": "950 × 8 = 7600이에요. 80개이니 10배 해야 해요." } },
    { q: "847 × □0 = 50820일 때 □ 안의 수는?", o: ["5", "6", "8"], a: 1 }]) }
},
{
  id: "t3", no: 3, title: "세 자리 수에 몇십몇을 곱해 볼까요", soop: "개념 구축하기(O)",
  question: "213 × 18은 어떻게 계산할까요?",
  summary: "(세 자리 수) × (몇십몇)은 몇십몇을 몇십과 몇으로 나누어, 세 자리 수에 일의 자리 수를 곱한 값과 십의 자리 수를 곱한 값을 더해요. 계산하기 전에 어림하면 답이 알맞은지 알 수 있어요.",
  steps: [
    { inst: "서현이가 블록 만들기 체험장에 블록을 한 상자에 213개씩 18상자 옮겼어요. 먼저 어림하고, 18상자를 10상자와 8상자로 나누어 계산해 보세요.", hints: ["213을 200으로, 18을 20으로 어림해요.", "213 × 10과 213 × 8을 더해요."],
      render: (b, a) => d3Area(b, a, { a: 213, b: 18, item: "블록", rowName: "상자", tip: "한 줄이 한 상자(213개)예요. 주황 선을 끌어 18상자를 계산하기 쉬운 두 묶음으로 나누어 보세요.",
        est: { q: "블록은 모두 몇 개쯤일까요?", o: ["400개쯤", "4000개쯤", "40000개쯤"], a: 1, why: { 0: "213을 200으로, 18을 20으로 어림하면 200의 20배예요.", 2: "200의 20배는 4000이에요. 너무 커요." }, ok: "213을 200, 18을 20으로 어림하면 200 × 20 = 4000, 4000개쯤이에요." },
        ok: "213 × 18 = 2130 + 1704 = 3834. 블록은 3834개로, 어림한 4000개보다 조금 적어요." }) },
    { inst: "374 × 23을 세로로 계산해 보세요. 374 × 3, 374 × 20을 차례로 쓰고 더해요.", hints: ["374 × 3 = 1122예요.", "374 × 20 = 7480이에요. 0은 생략할 수 있어요."],
      render: (b, a) => d3LongMul(b, a, { a: 374, b: 23, ok: "374 × 23 = 1122 + 7480 = 8602예요." }) },
    { inst: "374 × 23을 어떻게 계산했는지 말로 정리해요.", hints: ["23 = 20 + 3이에요."],
      render: (b, a) => blanks(b, a, ["(세 자리 수) × (몇십몇)은 세 자리 수에 몇십몇의 ", { o: ["일의 자리 수", "백의 자리 수"], a: 0 }, "를 곱한 값과 ", { o: ["십의 자리 수", "일의 자리 수"], a: 0 }, "를 곱한 값을 ", { o: ["더해요", "빼요"], a: 0 }, ". 십의 자리 수를 곱한 값은 ", { o: ["한 자리 왼쪽으로 밀어", "일의 자리에 맞추어"], a: 0 }, " 써요."]) },
    { name: "세로로 계산하기", inst: "279 × 35를 세로로 계산해 보세요.", hints: ["279 × 5 = 1395예요.", "279 × 30 = 8370이에요."],
      render: (b, a) => d3LongMul(b, a, { a: 279, b: 35 }) },
    { name: "확인하기", inst: "계산해 보세요. 먼저 어림해 보면 잘못 계산한 것을 찾기 쉬워요.", hints: ["304 × 27은 300 × 30 = 9000쯤이에요.", "304의 십의 자리 0을 빠뜨리지 않아요."],
      render: (b, a) => d3Calc(b, a, [{ mul: [654, 48] }, { mul: [754, 12] }, { mul: [579, 67] },
        { mul: [304, 27], why: { "918": "304를 34처럼 계산했어요. 304 × 27은 300 × 30 = 9000쯤이어야 해요. 십의 자리 0을 살려서 다시 계산해 봐요." } }],
        { ok: "(세 자리 수) × (몇십몇)을 잘 계산했어요!" }) }
  ],
  challenge: { inst: "수 카드 1, 3, 5, 6, 8을 한 번씩 모두 사용하여 가장 큰 세 자리 수와 가장 작은 두 자리 수를 만들고, 두 수의 곱을 구해 보세요.", hints: ["가장 큰 세 자리 수는 큰 수부터 높은 자리에 놓아요.", "남은 두 장으로 가장 작은 두 자리 수를 만들어요."],
    render: (b, a) => d3Cards(b, a, { cards: [1, 3, 5, 6, 8], mode: "mul", ok: "865 × 13 = 11245예요. 수 카드로 만든 두 수의 곱을 구했어요!" }) }
},
{
  id: "t4", no: 4, title: "몇십으로 나누어 볼까요", soop: "개념 구축하기(O)",
  question: "160 ÷ 20과 271 ÷ 50은 어떻게 계산할까요?",
  summary: "(몇십)으로 나눌 때는 곱셈으로 몫을 어림해요. 나머지가 나누는 수보다 크거나 같으면 몫을 1 크게, 나누는 수 × 몫이 나누어지는 수보다 크면 몫을 1 작게 해요. 나머지는 나누는 수보다 작아야 해요.",
  steps: [
    { inst: "엽서 160장을 한 바구니에 20장씩 담으려고 해요. 수 모형을 20씩 묶어 필요한 바구니 수를 알아보세요.", hints: ["백 모형 1개는 십 모형 10개와 같아요.", "20은 십 모형 2개예요."],
      render: (b, a) => d3Blocks(b, a, { n: 160, d: 20, item: "엽서", unit: "장", ask: [
        { q: "십 모형 2개씩 몇 묶음인가요?", a: 8, unit: "묶음" }, { q: "160 ÷ 20 =", a: 8 }, { q: "확인: 20 × 8 =", a: 160 }, { q: "필요한 바구니는 몇 개인가요?", a: 8, unit: "개" }],
        ok: "16 ÷ 2 = 8이니까 160 ÷ 20 = 8. 20 × 8 = 160이므로 계산이 맞아요. 바구니는 8개 필요해요." }) },
    { inst: "271 ÷ 50의 몫을 4, 6, 5로 차례로 어림해 보세요. 막대에서 무엇이 달라지는지 살펴보고 몫과 나머지를 구해요.", hints: ["몫이 4이면 나머지 71이 50보다 커요.", "몫이 6이면 50 × 6 = 300이라 뺄 수 없어요."],
      render: (b, a) => d3QuotTry(b, a, { n: 271, d: 50, need: true, ok: "50 × 5 = 250이므로 몫은 5, 나머지는 271 − 250 = 21이에요. 250 + 21 = 271이니 맞아요." }) },
    { inst: "몫을 고치는 방법을 말로 정리해요.", hints: ["나머지가 나누는 수보다 크면 더 나눌 수 있어요."],
      render: (b, a) => blanks(b, a, ["어림한 몫으로 계산했을 때 나머지가 나누는 수보다 크거나 같으면 몫을 1 ", { o: ["크게", "작게"], a: 0 }, " 해요. 나누는 수 × 몫이 나누어지는 수보다 커서 뺄 수 없으면 몫을 1 ", { o: ["작게", "크게"], a: 0 }, " 해요. 나머지는 언제나 나누는 수보다 ", { o: ["작아야", "커야"], a: 0 }, " 해요."]) },
    { name: "세로로 계산하기", inst: "372 ÷ 60을 세로로 계산해 보세요. 몫을 어림해 쓰고, 곱과 뺀 결과를 써요.", hints: ["60 × 6 = 360이에요.", "몫은 일의 자리 위에 써요."],
      render: (b, a) => d3LongDiv(b, a, { n: 372, d: 60, chk: true }) },
    { name: "확인하기", inst: "계산해 보세요.", hints: ["20 × 3 = 60, 40 × 7 = 280이에요.", "구슬은 50 × 7 = 350개를 쓰고 남아요."],
      render: (b, a) => d3Calc(b, a, [{ div: [68, 20] }, { div: [280, 40] },
        { div: [360, 50], q: "구슬 360개를 50개씩 나누어 목걸이를 만들면", names: ["목걸이", "남는 구슬"], units: ["개", "개"] }],
        { ok: "몇십으로 나누는 나눗셈을 잘 했어요! 목걸이는 7개까지 만들 수 있고 구슬 10개가 남아요." }) }
  ],
  challenge: { inst: "친구가 161 ÷ 30을 계산했어요. 30 × 4 = 120, 120 + 41 = 161이니 맞다고 해요. 정말 맞을까요?", hints: ["친구가 쓴 나머지와 나누는 수 30을 견주어 봐요.", "41에서 30을 한 번 더 뺄 수 있어요."],
    render: (b, a) => d3FixDiv(b, a, { n: 161, d: 30, wq: 4, ra: 1,
      reasons: ["30 × 4를 잘못 계산했어요.", "나머지 41이 나누는 수 30보다 커서 더 나눌 수 있어요.", "161에서 120을 잘못 뺐어요."],
      why: { 0: "30 × 4 = 120은 맞게 계산했어요.", 2: "161 − 120 = 41은 맞게 뺐어요." },
      ok: "161 ÷ 30 = 5 … 11. 검산이 맞아 보여도 나머지가 나누는 수보다 크면 몫을 1 크게 해야 해요." }) }
},
{
  id: "t5", no: 5, title: "몇십몇으로 나누어 볼까요 ⑴ 몫이 한 자리 수인 경우", soop: "개념 구축하기(O)",
  question: "76 ÷ 19와 164 ÷ 52는 어떻게 계산할까요?",
  summary: "몫이 한 자리 수인 나눗셈은 나누는 수에 몇을 곱해야 나누어지는 수보다 크지 않으면서 가장 가까운지 어림해 몫을 구해요. 나누는 수 × 몫 + 나머지 = 나누어지는 수로 확인해요.",
  steps: [
    { inst: "카네이션 만들기 체험에 76명이 참가했어요. 19모둠으로 똑같이 나누면 한 모둠은 몇 명일까요? 몫을 3, 5, 4로 어림해 보세요.", hints: ["76을 80으로, 19를 20으로 어림하면 80 ÷ 20 = 4예요.", "몫이 3이면 나머지가 19라서 더 나눌 수 있어요."],
      render: (b, a) => d3QuotTry(b, a, { n: 76, d: 19, need: true, names: ["한 모둠", "나머지"], units: ["명", "명"], ok: "19 × 4 = 76이므로 76 ÷ 19 = 4. 한 모둠은 4명이에요." }) },
    { inst: "164 ÷ 52를 계산해요. 52에 몇을 곱해야 164보다 크지 않으면서 164에 가장 가까울까요?", hints: ["164를 160으로, 52를 50으로 어림하면 몫은 3쯤이에요.", "52 × 3 = 156, 52 × 4 = 208이에요."],
      render: (b, a) => d3Table(b, a, { n: 164, d: 52, ks: [2, 3, 4], ok: "52 × 3 = 156이므로 몫은 3, 나머지는 164 − 156 = 8이에요." }) },
    { inst: "몫이 한 자리 수인 나눗셈을 어떻게 계산했는지 정리해요.", hints: ["곱셈식을 이용해 몫을 어림했어요."],
      render: (b, a) => blanks(b, a, ["164 ÷ 52는 52 × 3 = 156이므로 몫은 ", { o: ["3", "4", "8"], a: 0 }, "이고, 나머지는 164 − 156 = ", { o: ["8", "56", "108"], a: 0 }, "이에요. 계산이 맞는지 52 × 3 = 156, 156 + 8 = ", { o: ["164", "156", "172"], a: 0 }, "인지 확인해요."]) },
    { name: "세로로 계산하기", inst: "524 ÷ 78을 세로로 계산해 보세요. 524를 520으로, 78을 80으로 어림해 몫을 정해 보세요.", hints: ["80 × 6 = 480이니 몫은 6쯤이에요.", "78 × 6 = 468이에요."],
      render: (b, a) => d3LongDiv(b, a, { n: 524, d: 78, chk: true }) },
    { name: "확인하기", inst: "계산해 보세요.", hints: ["24 × 2 = 48, 36 × 8 = 288이에요.", "페트병은 15개씩 묶어요."],
      render: (b, a) => d3Calc(b, a, [{ div: [69, 24] }, { div: [288, 36] },
        { div: [138, 15], q: "페트병 15개로 티셔츠 한 장을 만들 때, 페트병 138개로", names: ["티셔츠", "남는 페트병"], units: ["장", "개"] }],
        { ok: "몫이 한 자리 수인 나눗셈을 잘 했어요! 티셔츠는 9장까지 만들고 페트병 3개가 남아요." }) }
  ],
  challenge: { inst: "거꾸로 생각해 보세요.", hints: ["나누어지는 수 = 나누는 수 × 몫 + 나머지예요.", "가로등 28개 사이의 간격은 27군데예요."], render: (b, a) => numbers(b, a, [
    { q: "□ ÷ 44 = 7 … 13 일 때 □ =", a: 321, why: { "308": "44 × 7 = 308에 나머지 13을 더해야 해요." } },
    { q: "길이가 135 m인 산책로의 처음부터 끝까지 가로등 28개를 같은 간격으로 세우면 간격은 몇 m인가요?", a: 5, unit: "m" }],
    { ok: "44 × 7 + 13 = 321, 135 ÷ 27 = 5예요. 거꾸로도 잘 생각했어요!" }) }
},
{
  id: "t6", no: 6, title: "몇십몇으로 나누어 볼까요 ⑵ 몫이 두 자리 수이고 나누어떨어지는 경우", soop: "개념 구축하기(O)",
  question: "736 ÷ 32는 어떻게 계산할까요?",
  summary: "몫이 두 자리 수인 나눗셈은 몫을 십의 자리와 일의 자리로 나누어 구해요. 736 ÷ 32는 32 × 20 = 640을 빼고 남은 96에서 32 × 3 = 96을 빼서 몫이 23이에요.",
  steps: [
    { inst: "빵 만들기 체험을 위해 밀가루 반죽 736 g을 32 g씩 나누어요. 먼저 몇십 개쯤인지 어림하고, 320 g(반죽 10개)씩 크게 뛰고 32 g씩 뛰어 보세요.", hints: ["32 × 10 = 320, 32 × 20 = 640, 32 × 30 = 960이에요.", "640까지 크게 두 번 뛰고, 남은 96에서 32씩 세 번 뛰어요."],
      render: (b, a) => d3JumpDiv(b, a, { n: 736, d: 32, names: ["반죽", "남는 반죽"], units: ["개", "g"],
        est: { q: "밀가루 반죽은 몇십 개쯤 될까요?", o: ["2개쯤", "20개쯤", "200개쯤"], a: 1, why: { 0: "32 × 10 = 320도 736보다 작아요. 몇십 개예요.", 2: "32 × 200은 6400이에요. 너무 커요." }, ok: "736을 700으로, 32를 30으로 어림하면 20개쯤이에요." },
        ok: "32 × 20 = 640, 32 × 3 = 96이니 736 ÷ 32 = 23. 반죽은 23개가 돼요." }) },
    { name: "세로로 계산하기", inst: "736 ÷ 32를 세로로 계산해 보세요. 몫의 십의 자리부터 구해요.", hints: ["32 × 20 = 640이므로 몫의 십의 자리는 2예요.", "736 − 640 = 96, 32 × 3 = 96이에요."],
      render: (b, a) => d3LongDiv(b, a, { n: 736, d: 32, chk: true, ok: "736 ÷ 32 = 23. 32 × 23 = 736이므로 맞아요." }) },
    { inst: "몫이 두 자리 수인 나눗셈을 어떻게 계산했는지 정리해요.", hints: ["몫 23은 20과 3을 더한 수예요."],
      render: (b, a) => blanks(b, a, ["몫이 두 자리 수인 나눗셈은 몫을 ", { o: ["십의 자리와 일의 자리", "백의 자리와 십의 자리"], a: 0 }, "로 나누어 구해요. 736 ÷ 32에서 먼저 32 × ", { o: ["20", "2", "30"], a: 0 }, " = 640을 빼고, 남은 96에서 32 × 3 = 96을 빼요. 그래서 몫은 ", { o: ["23", "5", "203"], a: 0 }, "이에요."]) },
    { name: "곱셈표로 몫 어림하기", inst: "918 ÷ 27을 계산해요. 27 × 20, 27 × 30, 27 × 40을 구해 918이 어디에 있는지 보세요.", hints: ["918을 900으로, 27을 30으로 어림하면 몫은 30쯤이에요.", "918 − 810 = 108, 27 × 4 = 108이에요."],
      render: (b, a) => d3Table(b, a, { n: 918, d: 27, ks: [20, 30, 40], ok: "27 × 30 = 810, 27 × 4 = 108이니 918 ÷ 27 = 34예요. 27 × 34 = 918로 확인했어요." }) },
    { name: "확인하기", inst: "계산하고 계산이 맞는지 확인해 보세요.", hints: ["43 × 10 = 430, 17 × 40 = 680, 23 × 30 = 690이에요."],
      render: (b, a) => d3Calc(b, a, [{ div: [516, 43] }, { div: [799, 17] }, { div: [828, 23], chk: true }],
        { ok: "몫이 두 자리 수이고 나누어떨어지는 나눗셈을 잘 했어요!" }) }
  ],
  challenge: { inst: "13 ) □□6 을 계산했더니 몫의 십의 자리에서 26을 빼고, 일의 자리에서도 26을 빼서 나머지가 0이 되었어요. 빈칸의 수를 구해 보세요.", hints: ["13 × 2 = 26이에요.", "몫의 일의 자리 수를 □라 하면 13 × □의 일의 자리 숫자가 6이에요."],
    render: (b, a) => numbers(b, a, [{ q: "몫은?", a: 22 }, { q: "나누어지는 수는?", a: 286, why: { "266": "13 × 20 = 260에 26을 더해요." } }],
      { ok: "13 × 22 = 286이에요. 286 ÷ 13 = 22로 나누어떨어져요." }) }
},
{
  id: "t7", no: 7, title: "몇십몇으로 나누어 볼까요 ⑶ 몫이 두 자리 수이고 나머지가 있는 경우", soop: "개념 구축하기(O)",
  question: "950 ÷ 45는 어떻게 계산할까요?",
  summary: "몫이 두 자리 수이고 나머지가 있는 나눗셈도 몫을 십의 자리와 일의 자리로 나누어 구해요. 마지막에 남은 수가 나머지이고, 나머지는 나누는 수보다 작아야 해요.",
  steps: [
    { inst: "기념품 한 개를 포장하는 데 리본 45 cm가 필요해요. 리본 950 cm로 기념품을 몇 개까지 포장할 수 있는지 뛰어 세어 보세요.", hints: ["45 × 20 = 900이에요.", "950 − 900 = 50에서 45를 한 번 더 뺄 수 있어요."],
      render: (b, a) => d3JumpDiv(b, a, { n: 950, d: 45, names: ["기념품", "남는 리본"], units: ["개", "cm"],
        est: { q: "기념품은 몇 개쯤 포장할 수 있을까요?", o: ["2개쯤", "20개쯤", "200개쯤"], a: 1, why: { 0: "950을 900, 45를 40으로 어림해 보세요. 몇십 개예요.", 2: "45 × 200은 9000이에요. 너무 커요." }, ok: "950을 900으로, 45를 40으로 어림하면 20개쯤이에요." },
        ok: "950 ÷ 45 = 21 … 5. 기념품을 21개까지 포장하고 리본 5 cm가 남아요." }) },
    { name: "세로로 계산하기", inst: "950 ÷ 45를 세로로 계산하고 확인해 보세요.", hints: ["45 × 20 = 900이에요.", "50에서 45 × 1 = 45를 빼면 5가 남아요."],
      render: (b, a) => d3LongDiv(b, a, { n: 950, d: 45, chk: true, ok: "950 ÷ 45 = 21 … 5. 45 × 21 = 945, 945 + 5 = 950이에요." }) },
    { inst: "나머지가 있는 나눗셈에서 확인할 것을 정리해요.", hints: ["나머지 5와 나누는 수 45를 견주어 봐요."],
      render: (b, a) => blanks(b, a, ["950 ÷ 45의 몫은 ", { o: ["21", "20", "22"], a: 0 }, ", 나머지는 5예요. 나머지는 나누는 수보다 ", { o: ["작아야", "커야"], a: 0 }, " 해요. 계산이 맞는지 45 × 21 = 945, 945 + 5 = ", { o: ["950", "945", "900"], a: 0 }, "으로 확인해요."]) },
    { name: "곱셈표로 몫 어림하기", inst: "828 ÷ 34를 계산해요. 34 × 10, 34 × 20, 34 × 30을 구해 몫을 어림해 보세요.", hints: ["828을 800으로, 34를 30으로 어림하면 몫은 20쯤이에요.", "828 − 680 = 148, 34 × 4 = 136이에요."],
      render: (b, a) => d3Table(b, a, { n: 828, d: 34, ks: [10, 20, 30], ok: "828 ÷ 34 = 24 … 12. 34 × 24 = 816, 816 + 12 = 828이에요." }) },
    { name: "확인하기", inst: "계산해 보세요.", hints: ["16 × 20 = 320, 52 × 10 = 520, 25 × 30 = 750이에요.", "빈 병은 36개씩 담아요."],
      render: (b, a) => d3Calc(b, a, [{ div: [370, 16] }, { div: [755, 52] }, { div: [907, 25] },
        { div: [547, 36], q: "빈 병 547개를 한 상자에 36개씩 담으면", names: ["상자", "남는 빈 병"], units: ["상자", "개"] }],
        { ok: "몫이 두 자리 수이고 나머지가 있는 나눗셈을 잘 했어요! 빈 병은 15상자에 담고 7개가 남아요." }) }
  ],
  challenge: { inst: "수 카드 2, 3, 6, 8, 1을 한 번씩 모두 사용하여 몫이 가장 큰 (세 자리 수) ÷ (두 자리 수)를 만들고 계산해 보세요.", hints: ["나누어지는 수는 가장 크게, 나누는 수는 가장 작게 만들어요.", "가장 큰 세 자리 수는 863, 남은 카드로 만든 가장 작은 두 자리 수는 12예요."],
    render: (b, a) => d3Cards(b, a, { cards: [2, 3, 6, 8, 1], mode: "div", answer: "863 ÷ 12 = 71 … 11", ok: "863 ÷ 12 = 71 … 11. 몫이 가장 큰 나눗셈을 만들었어요!" }) }
},
{
  id: "t8", no: 8, title: "어림셈을 활용해 볼까요", soop: "개념 구축하기(O)",
  question: "실제 수를 계산하기 쉬운 수로 바꾸면 얼마쯤인지 어떻게 알 수 있을까요?",
  summary: "곱셈은 곱해지는 수와 곱하는 수를 가까운 몇백, 몇십으로 어림해서 계산해요. 나눗셈은 나누어지는 수를 나누기 쉬운 수로 바꾸어 계산해요. 어림셈의 답은 여러 가지일 수 있어요.",
  steps: [
    { name: "곱셈 어림하기", inst: "선우는 한 개에 890원인 야광봉을 19개 사려고 해요. 890과 19를 각각 계산하기 쉬운 수로 어림해 보세요.", hints: ["890은 800과 900 중 900에 더 가까워요.", "19는 10과 20 중 20에 더 가까워요."],
      render: (b, a) => d3RoundLine(b, a, { items: [{ v: 890, lo: 800, hi: 900, step: 10, name: "야광봉 한 개의 값 890원" }, { v: 19, lo: 10, hi: 20, step: 1, name: "야광봉의 수 19개" }],
        ask: [{ q: "어림한 식 900 × 20 =", a: 18000, unit: "원 정도" }], ok: "890 × 19를 900 × 20으로 어림하면 18000원 정도의 돈이 필요해요." }) },
    { name: "곱셈 어림하기 ⑵", inst: "유주는 한 자루에 480원인 연필을 28자루 사려고 해요. 얼마 정도의 돈이 필요할지 어림해 보세요.", hints: ["480은 500에 더 가까워요.", "28은 30에 더 가까워요."],
      render: (b, a) => d3RoundLine(b, a, { items: [{ v: 480, lo: 400, hi: 500, step: 10, name: "연필 한 자루의 값 480원" }, { v: 28, lo: 20, hi: 30, step: 1, name: "연필의 수 28자루" }],
        ask: [{ q: "어림한 식 500 × 30 =", a: 15000, unit: "원 정도" }], ok: "480 × 28을 500 × 30으로 어림하면 15000원 정도가 필요해요." }) },
    { name: "나눗셈 어림하기", inst: "의자 370개를 한 줄에 30개씩 놓으면 몇 줄쯤 될까요? 370 가까이에서 30으로 나누기 쉬운 수를 두 개 찾아보세요.", hints: ["30씩 뛰어 세어 봐요: 30 × 12 = 360, 30 × 13 = 390이에요.", "370보다 작은 쪽과 큰 쪽에서 하나씩 찾아요."],
      render: (b, a) => d3Compat(b, a, { n: 370, d: 30, lo: 330, hi: 420, need: 2,
        ask: f => f.slice().sort((x, y) => x - y).map(t => ({ q: `${t} ÷ 30 =`, a: t / 30, unit: "줄쯤" })),
        ok: "누나처럼 360으로 어림하면 12줄쯤, 선우처럼 390으로 어림하면 13줄쯤이에요." }) },
    { name: "어림한 방법 견주기", inst: "누나와 선우가 어림한 방법을 비교해 보세요.", hints: ["370과 360, 370과 390을 견주어 봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "누나는 370을 360으로 어림했어요. 나누어지는 수를 어떻게 어림했나요?", o: ["실제 수보다 작게 어림했어요", "실제 수보다 크게 어림했어요"], a: 0 },
        { q: "선우는 370을 390으로 어림했어요. 나누어지는 수를 어떻게 어림했나요?", o: ["실제 수보다 작게 어림했어요", "실제 수보다 크게 어림했어요"], a: 1 },
        { q: "어림셈에 대해 바른 말은?", o: ["어림한 답은 하나뿐이에요", "어림하는 방법에 따라 어림한 답이 다를 수 있어요", "정확히 계산한 다음 어림해야 해요"], a: 1, why: { "0": "누나는 12줄쯤, 선우는 13줄쯤으로 둘 다 알맞게 어림했어요.", "2": "어림셈은 계산하기 쉬운 수로 바꾸어 먼저 얼마쯤인지 아는 거예요." } }]) },
    { name: "확인하기", inst: "민우는 사탕 250개를 친구 20명에게 나누어 주려고 해요. 한 사람에게 몇 개쯤 줄 수 있을지 어림해 보세요.", hints: ["20으로 나누기 쉬운 수: 240, 260", "240 ÷ 20 = 12예요."],
      render: (b, a) => d3Compat(b, a, { n: 250, d: 20, lo: 210, hi: 290, need: 1,
        ask: f => [{ q: `${f[0]} ÷ 20 =`, a: f[0] / 20 }, { q: "한 사람에게 몇 개쯤 줄 수 있나요?", a: f[0] / 20, unit: "개쯤" }],
        ok: "250을 나누기 쉬운 수로 어림해 한 사람에게 줄 수 있는 사탕 수를 어림했어요." }) }
  ],
  challenge: { inst: "‘우리 반 어림셈왕’이 되어 보세요. 곱해지는 수와 곱하는 수를 가까운 몇백, 몇십으로 어림해 계산해요.", hints: ["612는 600, 38은 40으로 어림해요.", "297은 300, 51은 50으로 어림해요."], render: (b, a) => numbers(b, a, [
    { q: "612 × 38을 600 × 40으로 어림하면", a: 24000 },
    { q: "297 × 51을 300 × 50으로 어림하면", a: 15000 },
    { q: "실제 612 × 38 =", a: 23256 }],
    { ok: "612 × 38 = 23256은 어림한 24000과 가까워요. 어림셈으로 계산 결과가 알맞은지 확인할 수 있어요." }) }
},
{
  id: "t9", no: 9, title: "생각을 더하다 ― 지구를 위해 물 발자국을 줄여요", soop: "탐구 정리하기(O)",
  question: "물 발자국을 줄이려면 어떤 샐러드를 만들어야 할까요?",
  summary: "물 발자국은 음식이나 물건을 만들거나 버릴 때 사용되는 물의 양이에요. 1인분의 물 발자국을 더해 비교하고, 사람 수를 곱해 전체 물 발자국을 구해요.",
  steps: [
    { name: "이해해요", inst: "다온이는 요리 수업 시간에 친구 23명을 위한 샐러드를 만들려고 해요. 물 발자국을 줄이려면 둘 중 어떤 샐러드를 만들어야 할까요? 문제를 이해해요.", hints: ["물 발자국은 음식이나 물건을 만들거나 버릴 때 사용되는 물의 양이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "물 발자국이 더 적은 샐러드를 만들기 위해 무엇을 비교해야 할까요?", o: ["두 샐러드의 물 발자국", "두 샐러드의 무게", "두 샐러드의 색깔"], a: 0 },
        { q: "사과 복숭아 양상추 샐러드의 재료는?", o: ["사과, 복숭아, 양상추", "토마토, 바나나, 양상추", "사과, 바나나, 토마토"], a: 0 },
        { q: "다온이가 만들어야 할 샐러드는 모두 몇 인분인가요?", o: ["20인분", "23인분", "32인분"], a: 1 }]) },
    { name: "계획하고 해결해요", inst: "재료 카드를 샐러드 그릇에 담고, 1인분의 물 발자국을 더해 비교해 보세요. (출처: 물 발자국 네트워크, 2023)", hints: ["사과 125 + 복숭아 140 + 양상추 119", "토마토 100 + 바나나 160 + 양상추 119"],
      render: (b, a) => d3Salad(b, a, {
        cards: [{ name: "사과", L: 125, col: "#E8796B" }, { name: "토마토", L: 100, col: "#E2483D" }, { name: "복숭아", L: 140, col: "#F6B38E" }, { name: "바나나", L: 160, col: "#F5D85B" }, { name: "양상추", L: 119, col: "#9BD17E" }, { name: "양상추", L: 119, col: "#9BD17E" }],
        bowls: [{ name: "사과 복숭아 양상추 샐러드", need: ["사과", "복숭아", "양상추"] }, { name: "토마토 바나나 양상추 샐러드", need: ["토마토", "바나나", "양상추"] }],
        ok: "384 L > 379 L이므로 물 발자국이 더 적은 토마토 바나나 양상추 샐러드를 만들어야 해요." }) },
    { name: "23인분 구하기", inst: "토마토 바나나 양상추 샐러드 1인분의 물 발자국은 379 L예요. 23인분의 물 발자국을 세로로 계산해 보세요.", hints: ["379 × 3 = 1137이에요.", "379 × 20 = 7580이에요."],
      render: (b, a) => d3LongMul(b, a, { a: 379, b: 23, title: "379 × 23 (L)", ok: "379 × 23 = 8717. 다온이가 만들 샐러드의 물 발자국은 8717 L예요." }) },
    { name: "되돌아봐요", inst: "문제를 해결한 과정을 되돌아봐요.", hints: ["어떤 차례로 해결했는지 떠올려 봐요.", "물 발자국을 줄이는 다른 방법도 생각해 봐요."],
      render: (b, a) => writeStep(b, a, [
        { q: "어떤 방법으로 해결했는지 설명해 보세요.", tag: "방법", ph: "예: 1인분의 물 발자국을 더해 비교하고, 23을 곱했어요." },
        { q: "물 발자국을 줄이기 위해 내가 할 수 있는 일을 써 보세요.", tag: "실천", ph: "예: 음식을 남기지 않아요." }]) },
    { name: "내 힘으로 풀어요", inst: "시아와 로운이는 반 친구 20명이 먹을 샐러드를 2가지 재료로만 만들려고 해요. 바나나 복숭아 샐러드와 사과 양상추 샐러드 중 어떤 걸 만들어야 할까요?", hints: ["바나나 160 + 복숭아 140, 사과 125 + 양상추 119", "244 × 20은 244 × 2의 10배예요."],
      render: (b, a) => d3Salad(b, a, {
        cards: [{ name: "바나나", L: 160, col: "#F5D85B" }, { name: "사과", L: 125, col: "#E8796B" }, { name: "복숭아", L: 140, col: "#F6B38E" }, { name: "양상추", L: 119, col: "#9BD17E" }],
        bowls: [{ name: "바나나 복숭아 샐러드", need: ["바나나", "복숭아"] }, { name: "사과 양상추 샐러드", need: ["사과", "양상추"] }], people: 20,
        after: [{ q: "사과 양상추 샐러드 20인분의 물 발자국 244 × 20 =", a: 4880, unit: "L", why: { "488": "244 × 2의 곱이에요. 10배 해야 해요." } }],
        ok: "300 L > 244 L이므로 사과 양상추 샐러드를 만들고, 물 발자국은 244 × 20 = 4880 L예요." }) }
  ],
  challenge: { inst: "다온이가 사과 복숭아 양상추 샐러드(1인분 384 L)를 23인분 만들었다면 물 발자국은 얼마나 더 많았을까요?", hints: ["384 × 23을 구해요.", "384 × 23 − 379 × 23은 (384 − 379) × 23과 같아요."], render: (b, a) => numbers(b, a, [
    { q: "384 × 23 =", a: 8832, unit: "L" },
    { q: "8832 − 8717 =", a: 115, unit: "L" }],
    { ok: "115 L만큼 더 많았어요. 1인분에 5 L 차이가 23인분이면 5 × 23 = 115 L가 돼요." }) }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 신나는 곱셈, 나눗셈 우주여행!", soop: "발표하기(P)",
  question: "곱셈과 나눗셈을 옳게 계산하며 우주여행 놀이를 해 볼까요?",
  summary: "놀이판의 (세 자리 수) × (두 자리 수), (두 자리 수) ÷ (두 자리 수), (세 자리 수) ÷ (두 자리 수)를 옳게 계산해야 앞으로 나아갈 수 있어요. 상대방의 계산이 맞는지 계산기로 확인해요.",
  steps: [
    { name: "놀이 방법 알기", inst: "놀이 방법을 차례대로 눌러 보세요.", hints: ["순서를 먼저 정하고 주사위를 굴려요.", "계산이 틀리면 말을 전에 있던 칸으로 돌려놓아요."],
      render: (b, a) => sequence(b, a, ["① 가위바위보로 순서를 정하고 말을 출발 칸에 놓아요.", "② 주사위를 굴려 나온 눈의 수만큼 말을 옮겨요.", "③ 칸의 식을 계산하고, 상대방이 계산기로 확인해요.", "④ 잘못 계산하면 말을 전에 있던 칸으로 돌려놓아요.", "⑤ 도착 칸에 먼저 도착하는 사람이 이겨요."], [0, 1, 2, 3, 4]) },
    { name: "놀이판 살펴보기", inst: "놀이판에 있는 식을 살펴봐요. 210 ÷ 30 칸에 멈추었어요.", hints: ["30 × 7 = 210이에요."],
      render: (b, a) => d3Calc(b, a, [{ div: [210, 30], chk: true }], { ok: "210 ÷ 30 = 7. 30 × 7 = 210이므로 맞아요!" }) },
    { name: "놀이하기", inst: "친구와 번갈아 주사위를 굴리며 우주여행을 떠나요. 친구의 계산이 맞는지도 확인해 주세요.", hints: ["나눗셈은 몫과 나머지를 모두 써요. 나머지는 나누는 수보다 작아야 해요.", "곱셈은 곱하는 수를 몇십과 몇으로 나누어 계산해요."],
      render: (b, a) => d3Space(b, a, { goal: 4 }) },
    { name: "규칙 지키기", inst: "놀이 규칙을 확인해요.", hints: ["놀이 방법 4번을 떠올려 봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "말이 이동한 칸에 상대방의 말이 있으면?", o: ["주사위를 한 번 더 굴려 이동해요", "상대방 말을 출발 칸으로 보내요", "한 번 쉬어요"], a: 0 },
        { q: "칸의 식을 잘못 계산하면?", o: ["말을 전에 있던 칸으로 돌려놓아요", "그대로 있어요", "도착 칸으로 가요"], a: 0 },
        { q: "놀이할 때 주의할 점으로 알맞은 것은?", o: ["상대방의 계산이 맞는지 계산기로 확인해요", "이기는 것만 생각해요", "친구가 틀리면 놀려요"], a: 0 }]) },
    { name: "계산 다시 확인하기", inst: "놀이판의 식을 다시 계산해 보세요.", hints: ["963 ÷ 42는 42 × 20 = 840을 먼저 빼요.", "670 ÷ 80은 80 × 8 = 640이에요."],
      render: (b, a) => d3Calc(b, a, [{ div: [963, 42] }, { mul: [845, 19] }, { div: [670, 80] }], { ok: "놀이판의 식을 정확하게 계산했어요!" }) }
  ],
  challenge: { inst: "놀이판에서 계산이 어려웠던 식에 도전해요.", hints: ["507 × 36 = 507 × 6 + 507 × 30", "728 ÷ 52는 52 × 10 = 520을 먼저 빼요."], render: (b, a) => d3Calc(b, a, [{ mul: [507, 36] }, { div: [728, 52] }, { div: [91, 24], chk: true }],
    { ok: "어려운 식도 차근차근 해냈어요!" }) }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "곱셈과 나눗셈을 정확하게 계산하고 설명할 수 있나요?",
  summary: "(세 자리 수) × (두 자리 수)는 곱하는 수를 몇십과 몇으로 나누어 계산해요. (두 자리 수)·(세 자리 수) ÷ (두 자리 수)는 몫을 어림하고 고치며 구하고, 나머지가 나누는 수보다 작은지 확인해요.",
  steps: [
    { name: "곱셈 확인하기", inst: "□ 안에 알맞은 수를 쓰고 계산해 보세요.", hints: ["곱하는 수가 10배가 되면 곱도 10배가 돼요.", "420 × 54 = 420 × 4 + 420 × 50"],
      render: (b, a) => d3Calc(b, a, [{ mul: [340, 2] }, { mul: [340, 20] }, { mul: [420, 54] }, { mul: [550, 48] }, { mul: [720, 30] }], { ok: "곱셈을 정확하게 했어요!" }) },
    { name: "나눗셈 계산하고 확인하기", inst: "785 ÷ 19를 세로로 계산하고 맞는지 확인해 보세요.", hints: ["19 × 40 = 760이에요.", "785 − 760 = 25에서 19를 한 번 더 빼요."],
      render: (b, a) => d3LongDiv(b, a, { n: 785, d: 19, chk: true, ok: "785 ÷ 19 = 41 … 6. 19 × 41 = 779, 779 + 6 = 785예요." }) },
    { name: "몫의 크기 비교하기", inst: "몫의 크기를 비교해 보세요.", hints: ["630 ÷ 90 = 7이에요.", "34 × 6 = 204, 34 × 7 = 238이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "630 ÷ 90 ○ 228 ÷ 34", o: [">", "=", "<"], a: 0, why: { "1": "228 ÷ 34의 몫은 6이에요(34 × 7 = 238은 228보다 커요).", "2": "630 ÷ 90 = 7, 228 ÷ 34 = 6 … 24예요." } },
        { q: "60 ) 482 의 몫과 나머지는?", o: ["8 … 2", "7 … 62", "8 … 20"], a: 0, why: { "1": "나머지 62가 나누는 수 60보다 커요. 몫을 1 크게 해요." } }]) },
    { name: "잘못 계산한 곳 찾기", inst: "친구가 298 ÷ 36을 계산했어요. 잘못 계산한 곳을 찾아 까닭을 고르고 옳게 계산해 보세요.", hints: ["나머지 46과 나누는 수 36을 견주어 봐요.", "36 × 8 = 288이에요."],
      render: (b, a) => d3FixDiv(b, a, { n: 298, d: 36, wq: 7, ra: 0,
        reasons: ["나머지가 나누는 수보다 더 크므로 잘못 계산했어요.", "36 × 7을 잘못 계산했어요.", "몫을 1 작게 해야 해요."],
        why: { 1: "36 × 7 = 252는 맞게 계산했어요.", 2: "나머지 46에서 36을 한 번 더 뺄 수 있어요. 몫을 크게 해야 해요." },
        ok: "298 ÷ 36 = 8 … 10. 나머지는 나누는 수보다 작아야 해요." }) },
    { name: "문제 해결하기", inst: "로봇 875개를 25상자에, 인형 777개를 21상자에 똑같이 나누어 담았어요. 또 어떤 수에 21을 곱했더니 462가 되었어요.", hints: ["875 ÷ 25, 777 ÷ 21을 계산해요.", "어떤 수 = 462 ÷ 21이에요."],
      render: (b, a) => d3Calc(b, a, [
        { div: [875, 25], q: "한 상자에 담은 로봇", names: ["로봇", "나머지"], units: ["개", ""] },
        { div: [777, 21], q: "한 상자에 담은 인형", names: ["인형", "나머지"], units: ["개", ""] },
        { q: "어떤 수는?", a: 22, why: { "9702": "어떤 수에 21을 곱했으니 거꾸로 462를 21로 나누어요." } },
        { q: "150에 어떤 수를 곱한 값은?", a: 3300 }],
        { ok: "로봇 35개, 인형 37개, 어떤 수 22, 150 × 22 = 3300이에요!" }) }
  ],
  challenge: { inst: "꼭꼭! 사다리 타기를 하며 곱 또는 몫을 구해 보세요.", hints: ["243 × 48 = 243 × 8 + 243 × 40", "776 ÷ 59는 59 × 10 = 590을 먼저 빼요."], render: (b, a) => d3Calc(b, a, [{ mul: [243, 48] }, { div: [68, 17] }, { div: [776, 59] }, { div: [560, 80] }],
    { ok: "곱셈과 나눗셈을 모두 정확하게 했어요. 다음 단원은 평면도형의 이동이에요!" }) }
}
];
