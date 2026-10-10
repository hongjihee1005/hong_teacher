//@@APP
const APP={title:"힘찬시 편지 꺾은선그래프", unit:"4-2 수학 5. 꺾은선그래프(교과서)", key:"t42-linegraph-v1", welcome:"힘찬시 편지 꺾은선그래프 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 힘찬시 한결이와 소망시 수아가 편지를 주고받으며 꺾은선그래프를 읽고 그리는 방법을 배워요."};
//@@UNIT
/* ===== 4-2 수학 5. 꺾은선그래프 — 단원 조작 부품 (앞글자 l5) =====
   그래프 g = { title, xs:[가로 눈금 글], xAxis:"연도", xUnit:"년", names?:[이름], yAxis:"날수", unit:"일",
               vals:[…] 또는 series:[{name, vals, color, lab:"up"|"down"}], step:눈금 한 칸, lo:물결선 위 첫 눈금(0이면 물결선 없음),
               cells:눈금 칸 수, major:수를 쓰는 눈금(기본 한 칸×5), kind:"line"|"bar", showVals }
   점의 높이 = (값 − lo) ÷ 눈금 한 칸. 그림은 모두 g의 수로 계산해서 그려요. */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.l5fig svg{width:100%;height:auto;max-height:56vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:12px}
.l5fig{margin:.3em 0}
.l5figs{display:flex;flex-wrap:wrap;gap:.8em}.l5figs>div{flex:1 1 300px;min-width:0}
.l5cap{font-size:var(--fs-s);color:var(--muted);margin:.25em 0 0}
.l5tbl{overflow-x:auto;margin:.3em 0 .6em;max-width:100%}
.l5tbl table{border-collapse:collapse;word-break:keep-all;background:#fff}
.l5tbl th,.l5tbl td{border:1.5px solid var(--line);padding:.3em .55em;text-align:center}
.l5tbl th{background:#F2F5F4;font-weight:normal}
.l5tbl td.l5hi{background:#FFF1E8}
.l5tbl input{width:3.4em;text-align:center;font-size:1em;padding:.1em}
.l5tt{font-family:"Jua";margin-bottom:.2em}
.l5btns{display:flex;flex-wrap:wrap;gap:.35em;align-items:center}
.l5btns button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em}
.l5btns button.l5on{background:var(--night);color:#fff;border-color:var(--night)}
.l5side select{max-width:100%;font-size:1em;padding:.2em}
.l5lbl{font-family:"Jua";color:var(--night)}
.l5pool{display:flex;flex-wrap:wrap;gap:.4em;min-height:2.6em;margin:.4em 0}
.l5bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(13em,1fr));gap:.6em}
.l5bin{border:2px dashed var(--line);border-radius:12px;padding:.5em;min-height:7em;cursor:pointer;background:#FBFCFB;min-width:0}
.l5bint{font-family:"Jua";color:var(--night);margin-bottom:.3em}
.l5bin svg{width:100%;height:auto;display:block;background:#fff;border:1.5px solid var(--line);border-radius:8px;margin-bottom:.3em}
.l5card{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.35em .7em;text-align:left;word-break:keep-all;max-width:100%}
.l5bin .l5card{display:block;width:100%;margin:.25em 0}
.l5card.l5sel{border-color:var(--ring);background:var(--ring-soft)}
.l5card.l5good{border-color:var(--ok);background:#E3F4EA}
.l5card.l5bad{border-color:var(--no);background:#FBE7E2}
.l5letter{background:#FFF8EC;border-left:6px solid #E8B36A;border-radius:.6em;padding:.6em .9em;margin:.3em 0 .6em;word-break:keep-all}
.l5letter b{font-family:"Jua";color:#9A5B1C}
.l5row{display:flex;align-items:center;gap:.4em;flex-wrap:wrap;margin-top:.3em}
.l5row input{width:4.4em;text-align:center;font-size:1.1em}
.l5pond{display:flex;flex-wrap:wrap;gap:.5em;align-items:stretch;background:#E6F2FA;border-radius:14px;padding:.6em}
.l5bear{font-family:"Jua";background:#fff;border-radius:.6em;padding:.4em .7em;align-self:center;color:#7A4A2A;border:2px solid #E2C9A8}
.l5ice{flex:1 1 13em;min-width:0;border:2px solid #B9DBF0;background:#F8FCFF;border-radius:1.2em .5em 1.4em .6em;padding:.45em .7em;text-align:left;word-break:keep-all}
.l5ice.l5on{border-color:#2B7BD6;background:#D7ECFB;box-shadow:0 3px 0 #2B7BD6}
.l5ice.l5good{border-color:var(--ok);background:#E3F4EA}
.l5ice.l5bad{border-color:var(--no);background:#FBE7E2}
.l5path{font-family:"Jua";color:var(--night);margin:.4em 0}
.l5mood{display:grid;grid-template-columns:repeat(auto-fit,minmax(7.5em,1fr));gap:.3em .6em;margin:.3em 0}
.l5mood label{display:flex;flex-direction:column;font-size:var(--fs-s)}
.l5mood input{font-size:var(--fs-s);padding:.15em .3em;min-width:0}
`;
  document.head.append(s);
})();
const L5_LINE = "#D9622B", L5_LINE2 = "#2B7BD6", L5_BAR = "#F0A35E", L5_GRID = "#DCE4E0", L5_GRID2 = "#9AA9A3", L5_INK = "#1D2A2A", L5_SEL = "#D9482B", L5_SOFT = "#3B4A47", L5_DIM = "#AEB9B5";

/* 받침 있는 말 뒤 조사: l5J("2021년", "이/가") → "2021년이" */
function l5Jong(w) {
  const s = String(w).replace(/[^가-힣A-Za-z0-9]+$/, "");
  if (/(kg|t)$/.test(s)) return true;               // 킬로그램, 톤
  if (/(cm|mm|g)$/.test(s)) return false;           // 미터, 그램
  const c = s.charCodeAt(s.length - 1);
  if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 !== 0;
  if (/[0-9]$/.test(s)) return /[013678]$/.test(s);   // 영·일·삼·육·칠·팔 / 십·백·천
  return false;
}
function l5J(w, pair) { const [a, b] = pair.split("/"); return w + (l5Jong(w) ? a : b); }
function l5U(v, unit) { if (!unit) return String(v); if (/^[A-Za-z℃]/.test(unit)) return `${v} ${unit}`; return `${v}${unit}`; }
function l5Num(inp) { const s = String(inp.value).replace(/[\s,]/g, ""); return s === "" ? NaN : Number(s); }
function l5F(v) { return String(Math.round(v * 1000) / 1000); }
function l5Mult(v, m) { const q = v / m; return Math.abs(q - Math.round(q)) < 1e-6; }
function l5W(s, fs) { let w = 0; for (const c of String(s)) w += /[가-힣]/.test(c) ? fs : c === " " ? fs * .35 : fs * .62; return w; }
function l5Ser(g) { return g.series ? g.series.map((s, i) => Object.assign({ color: i ? L5_LINE2 : L5_LINE }, s)) : [{ name: g.yAxis, vals: g.vals, color: L5_LINE }]; }
function l5Nm(g, i) { return g.names ? g.names[i] : g.xs[i] + (g.xUnit || ""); }
function l5Major(g, step) { return g.major || step * 5; }
const L5V = (g, o) => Object.assign({}, g, o);
/* 흐린 점선 상자(아직 정하지 않은 칸) */
function l5Q(x, y, t, size = 18) {
  const g = svgEl("g"), w = l5W(t, size) + 18;
  g.append(svgEl("rect", { x: x - w / 2, y: y - size * .75, width: w, height: size * 1.5, rx: 6, fill: "#fff", stroke: "#9AA9A3", "stroke-dasharray": "5 4" }));
  g.append(txt(x, y, t, size, { fill: "#7A8A86" }));
  return g;
}
/* ---------- 그래프 크기 계산 ---------- v = {lo, step, cells} */
function l5Geom(g, v) {
  const fs = g.fs || 18, n = g.xs.length, step = v.step || g.step || 1, lo = v.lo || 0;
  const G = { fs, n, lo, step, cells: v.cells };
  G.SW = g.sw || Math.max(64, Math.max(...g.xs.map(s => l5W(s, fs - 1))) + 26);
  G.L = Math.max(64, l5W(l5F(lo + step * v.cells), fs - 2) + 26, l5W(g.xAxis || "", fs - 1) + 22);
  G.T = (g.title === "" ? 58 : 92) + (l5Ser(g).length > 1 || g.legend ? 30 : 0);
  G.CH = g.ch || Math.max(10, Math.min(32, Math.floor(330 / v.cells)));
  G.PH = v.cells * G.CH; G.PB = G.T + G.PH; G.WG = lo > 0 ? 34 : 0; G.base = G.PB + G.WG; G.PW = n * G.SW;
  G.W = Math.max(G.L + G.PW + 18 + (g.xUnit ? l5W(`(${g.xUnit})`, fs - 2) + 8 : 0), l5W(g.title || "", 22) + 40, l5W(`${g.yAxis} (${g.unit})`, fs) + 30);
  G.H = G.base + 26 + fs + 10;
  G.x = i => G.L + G.SW * (i + .5);
  G.y = val => G.PB - (val - G.lo) / G.step * G.CH;
  return G;
}
function l5St(g) { const ser = l5Ser(g); return { known: true, title: g.title, xAxis: g.xAxis, yAxis: g.yAxis, ser, kind: g.kind || "line", showVals: !!g.showVals, legend: ser.length > 1 }; }
/* ---------- 그래프 그리기 ----------
   st = { known, title|null, xAxis|null, yAxis|null, ser:[{name, vals, color, dim, lab}], kind, showVals, legend, sel } */
function l5Paint(svg, g, G, st) {
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${G.W} ${G.H}`);
  const fs = G.fs, U = g.unit || "", known = st.known !== false, major = l5Major(g, G.step);
  const { L, T, PW, PB, base, CH, SW } = G;
  if (st.sel != null) svg.append(svgEl("rect", { x: L + st.sel * SW + 3, y: T, width: SW - 6, height: PB - T, fill: "#FFF1E8" }));
  if (g.title !== "") svg.append(st.title ? txt(G.W / 2, 30, st.title, 22) : l5Q(G.W / 2, 30, "제목: ?", 20));
  if (st.legend) {
    let lx = L;
    st.ser.forEach(s => {
      const col = s.dim ? L5_DIM : s.color;
      svg.append(svgEl("line", { x1: lx, y1: T - 60, x2: lx + 30, y2: T - 60, stroke: col, "stroke-width": 4 }), svgEl("circle", { cx: lx + 15, cy: T - 60, r: 5, fill: col }),
        txt(lx + 38, T - 60, s.name, fs - 2, { "text-anchor": "start" }));
      lx += 38 + l5W(s.name, fs - 2) + 26;
    });
  }
  svg.append(st.yAxis == null ? l5Q(44, T - 26, "?", fs) : txt(8, T - 26, `${st.yAxis} (${U})`, fs, { "text-anchor": "start", fill: L5_SOFT }));
  for (let k = 0; k <= G.cells; k++) {
    const val = G.lo + k * G.step, y = PB - k * CH, mj = known ? l5Mult(val, major) : k % 5 === 0;
    svg.append(svgEl("line", { x1: L, y1: y, x2: L + PW, y2: y, stroke: mj && (k || G.lo) ? L5_GRID2 : L5_GRID, "stroke-width": mj ? 1.6 : 1 }));
    if (mj) svg.append(txt(L - 9, y, known ? l5F(val) : "?", fs - 2, { "text-anchor": "end" }));
  }
  for (let i = 0; i < G.n; i++) svg.append(svgEl("line", { x1: G.x(i), y1: T, x2: G.x(i), y2: PB, stroke: L5_GRID, "stroke-width": 1 }));
  svg.append(svgEl("line", { x1: L, y1: T, x2: L, y2: base, stroke: L5_INK, "stroke-width": 2 }));
  svg.append(svgEl("line", { x1: L, y1: base, x2: L + PW, y2: base, stroke: L5_INK, "stroke-width": 2 }));
  if (G.lo > 0) {   // 물결선: 0과 lo 사이를 생략
    const y0 = PB + G.WG / 2, a = 4, wl = 14;
    const wave = dy => { let d = `M${L - 12} ${y0 + dy}`; for (let x = L - 12; x < L + PW; x += wl) d += ` q${wl / 4} ${-a} ${wl / 2} 0 t${wl / 2} 0`; return d; };
    svg.append(svgEl("rect", { x: L - 12, y: y0 - 5, width: PW + 14, height: 10, fill: "#FBFCFB" }));
    svg.append(svgEl("path", { d: wave(-5), stroke: L5_INK, "stroke-width": 1.8, fill: "none" }), svgEl("path", { d: wave(5), stroke: L5_INK, "stroke-width": 1.8, fill: "none" }));
    svg.append(txt(L - 9, base, "0", fs - 2, { "text-anchor": "end" }));
  }
  g.xs.forEach((x, i) => svg.append(txt(G.x(i), base + 20, x, fs - 1)));
  svg.append(st.xAxis == null ? l5Q(L - 28, base + 20, "?", fs - 2) : txt(L - 10, base + 20, st.xAxis, fs - 2, { "text-anchor": "end", fill: L5_SOFT }));
  if (g.xUnit) svg.append(txt(L + PW + 6, base + 20, `(${g.xUnit})`, fs - 2, { "text-anchor": "start", fill: L5_SOFT }));
  const Y = v => Math.max(T - 8, Math.min(base, G.y(v)));
  st.ser.forEach(s => {
    const col = s.dim ? L5_DIM : (s.color || L5_LINE), V = s.vals;
    if (st.kind === "bar") {
      V.forEach((v, i) => { if (v == null) return; const y = Y(v); if (PB - y > 0) svg.append(svgEl("rect", { x: G.x(i) - SW * .25, y, width: SW * .5, height: PB - y, fill: L5_BAR, stroke: st.sel === i ? L5_SEL : "#B8743A", "stroke-width": st.sel === i ? 3 : 1 })); });
      return;
    }
    for (let i = 0; i + 1 < V.length; i++) if (V[i] != null && V[i + 1] != null)
      svg.append(svgEl("line", { x1: G.x(i), y1: Y(V[i]), x2: G.x(i + 1), y2: Y(V[i + 1]), stroke: col, "stroke-width": 3.5, "stroke-linecap": "round" }));
    V.forEach((v, i) => {
      if (v == null) return;
      svg.append(svgEl("circle", { cx: G.x(i), cy: Y(v), r: st.sel === i && !s.dim ? 8 : 6, fill: col, stroke: "#fff", "stroke-width": 2 }));
      if (st.showVals && !s.dim) svg.append(txt(G.x(i), Y(v) + (s.lab === "down" ? 21 : -17), l5F(v), 15, { fill: col }));
    });
  });
}
/* 눈금 자: 빨간 점선과 '눈금 n칸'(맨 아래 눈금부터 센 칸 수) */
function l5Ruler(svg, G, k) {
  const y = G.PB - k * G.CH, lab = `눈금 ${k}칸`, w = lab.length * 15 + 16;
  svg.append(svgEl("line", { x1: G.L, y1: y, x2: G.L + G.PW, y2: y, stroke: L5_SEL, "stroke-width": 2.5, "stroke-dasharray": "8 5" }));
  const ly = y - 16 < G.T - 6 ? y + 16 : y - 16;
  svg.append(svgEl("rect", { x: G.L + 4, y: ly - 13, width: w, height: 26, rx: 6, fill: "#fff", stroke: L5_SEL }));
  svg.append(txt(G.L + 4 + w / 2, ly, lab, 16, { fill: L5_SEL }));
}
const l5K = (G, p) => Math.max(0, Math.min(G.cells, Math.round((G.PB - p.y) / G.CH)));
/* 읽기용 그래프 그림: 누르면 눈금 자가 나와요 */
function l5Fig(g, o = {}) {
  const G = l5Geom(g, g), svg = makeSvg(G.W, G.H);
  let k = null;
  const draw = () => { l5Paint(svg, g, G, l5St(g)); if (k != null) l5Ruler(svg, G, k); };
  draw();
  const wrap = h("div", { class: "l5fig" }, svg);
  if (o.ruler !== false) {
    svg.style.cursor = "crosshair";
    svg.addEventListener("pointerdown", e => { const kk = l5K(G, svgPt(svg, e)); k = kk === k ? null : kk; draw(); });
    if (o.tip !== false) wrap.append(h("p", { class: "l5cap" }, "그래프를 누르면 그 높이에 눈금 자(빨간 점선)가 생기고, 맨 아래 눈금에서 몇 칸인지 알려 줘요."));
  }
  if (o.cap) wrap.append(h("p", { class: "l5cap" }, o.cap));
  return wrap;
}
function l5Figs(list) { return h("div", { class: "l5figs" }, list.map(x => h("div", {}, x.lead ? h("div", { class: "l5lbl" }, x.lead) : null, l5Fig(x.g, Object.assign({ tip: false }, x.o || {}))))); }
/* 작은 그래프(상자 안 그림) */
function l5Mini(g) { const G = l5Geom(g, g), svg = makeSvg(G.W, G.H); l5Paint(svg, g, G, l5St(g)); return svg; }
/* ---------- 표 ---------- t = {title, head, row, cols, vals}  blanks: 칸 번호 */
function l5TableEl(t, blanks = []) {
  const ins = {};
  const cell = (i, v) => {
    if (blanks.includes(i)) { const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": t.cols[i] }); ins[i] = inp; return h("td", {}, inp); }
    return h("td", {}, String(v));
  };
  const el = h("div", { class: "l5tbl" }, t.title ? h("div", { class: "l5tt" }, t.title) : null, h("table", {}, h("tbody", {},
    h("tr", {}, h("th", {}, t.head), t.cols.map(c => h("th", {}, c))),
    h("tr", {}, h("th", {}, t.row), t.vals.map((v, i) => cell(i, v))))));
  return { el, ins };
}
function l5Table(g) { return l5TableEl({ title: g.title, head: g.xUnit ? `${g.xAxis}(${g.xUnit})` : g.xAxis, row: `${g.yAxis}(${g.unit})`, cols: g.names ? g.names : g.xs, vals: g.vals }).el; }

/* ---------- 문제 모음: t:"pick"(a 번호|[번호…]) · "num"(a 수, unit) · "ox"(a true/false) · "custom"(make) ---------- */
function l5Ask(body, api, items, opts = {}) {
  const wrap = h("div"), rows = [];
  const ansText = it => it.t === "num" ? l5U(it.a, it.unit || "") : it.t === "ox" ? (it.a ? "○" : "×") : (Array.isArray(it.a) ? it.a : [it.a]).map(i => it.o[i]).join(", ");
  items.forEach((it, qi) => {
    const box = h("div", { class: "qitem" });
    const qEl = h("div", { class: "jua" }, `${items.length > 1 ? qi + 1 + ". " : ""}${it.q}`);
    const row = { it };
    if (it.t === "custom") {
      const c = it.make();
      box.append(qEl, c.el);
      const sv = c.el.querySelector("svg");
      Object.assign(row, { ok: c.ok, val: c.val, key: c.key, msg: c.msg, ans: c.ans, show: gd => { if (sv) sv.style.borderColor = gd ? "var(--ok)" : "var(--no)"; } });
    } else {
      if (it.fig) box.append(it.fig());
      box.append(qEl);
      row.ans = ansText(it);
      if (it.t === "num") {
        const inp = h("input", { type: "text", inputmode: "decimal", style: "width:5.5em;font-size:1.15em", "aria-label": it.q });
        box.append(h("div", {}, h("span", {}, it.pre || "답: "), inp, it.unit ? h("span", {}, " " + it.unit) : null));
        row.ok = () => l5Num(inp) === it.a;
        row.show = g => inp.style.borderColor = g ? "var(--ok)" : "var(--no)";
        row.val = () => inp.value.trim() || "-";
        row.key = () => String(l5Num(inp));
      } else {
        const ox = it.t === "ox", o = ox ? ["○ 옳아요", "× 옳지 않아요"] : it.o;
        const want = ox ? [it.a ? 0 : 1] : (Array.isArray(it.a) ? it.a.slice().sort((a, b) => a - b) : [it.a]);
        const multi = !ox && Array.isArray(it.a);
        const sel = new Set(), opts2 = h("div", { class: "opts" });
        o.forEach((t, oi) => {
          const b = h("button", { class: "opt" }, t);
          b.onclick = () => {
            if (multi) { sel.has(oi) ? sel.delete(oi) : sel.add(oi); b.classList.toggle("on"); }
            else { sel.clear(); sel.add(oi); [...opts2.children].forEach(x => x.classList.remove("on")); b.classList.add("on"); }
          };
          opts2.append(b);
        });
        box.append(opts2);
        const get = () => [...sel].sort((a, b) => a - b);
        row.ok = () => { const v = get(); return v.length === want.length && want.every((x, i) => x === v[i]); };
        row.show = g => [...opts2.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (sel.has(i)) b.classList.add(g ? "good" : "bad"); });
        row.val = () => get().map(i => o[i]).join("·") || "-";
        row.key = () => ox ? (sel.has(0) ? "o" : sel.has(1) ? "x" : "") : get().join(",");
      }
    }
    rows.push(row); wrap.append(box);
  });
  api.provide({
    words: opts.words || items.filter(it => it.t === "pick").map(ansText).slice(0, 6),
    answers: rows.map((r, qi) => `${items.length > 1 ? (qi + 1) + ") " : ""}${r.ans}`)
  });
  body.append(wrap, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (opts.pre) { const m = opts.pre(); if (m) return api.hint(m); }
    api.tryOnce();
    let all = true; rows.forEach(r => { const g = r.ok(); r.show(g); if (!g) all = false; });
    const given = rows.map(r => r.val()).join(" / ");
    if (all) return api.done(given, opts.ok);
    const bad = rows.find(r => !r.ok());
    const why = bad.it.why && bad.it.why[bad.key()];
    api.fail(why || (bad.msg && bad.msg()) || opts.bad || "빨간 칸을 다시 살펴봐요. 세로 눈금 한 칸의 크기와 점의 높이를 확인해 봐요.", given);
  } }, "확인하기")));
}

/* ---------- 선분 고르기: 가장 많이 늘어난(inc)·줄어든(dec)·변한(abs) 때 ---------- */
function l5SegQ(o) {
  const g = o.g, si = o.si || 0, S = l5Ser(g), V = S[si].vals, n = V.length;
  const d = V.slice(1).map((v, i) => v - V[i]);
  const sc = d.map(x => o.mode === "dec" ? -x : o.mode === "abs" ? Math.abs(x) : x);
  const best = Math.max(...sc), ans = sc.map((s, i) => s === best ? i : -1).filter(i => i >= 0);
  const nm = i => l5Nm(g, i);
  return { t: "custom", q: o.q, why: o.why, make: () => {
    const G = l5Geom(g, g), svg = makeSvg(G.W, G.H); let sel = null;
    const draw = () => {
      l5Paint(svg, g, G, l5St(g));
      for (let i = 0; i + 1 < n; i++) {
        const x1 = G.x(i), y1 = G.y(V[i]), x2 = G.x(i + 1), y2 = G.y(V[i + 1]);
        if (sel === i) svg.append(svgEl("line", { x1, y1, x2, y2, stroke: L5_SEL, "stroke-width": 8, "stroke-linecap": "round" }));
        const hit = svgEl("line", { x1, y1, x2, y2, stroke: "transparent", "stroke-width": 28, style: "cursor:pointer" });
        hit.addEventListener("click", () => { sel = sel === i ? null : i; draw(); });
        svg.append(hit);
      }
    };
    draw();
    const el = h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, `${S.length > 1 ? `‘${S[si].name}’ 선에서 ` : ""}선분을 눌러 골라요. 고른 선분은 빨간색으로 보여요.`));
    return {
      el, ans: `${nm(ans[0] + 1)} (${nm(ans[0])}→${nm(ans[0] + 1)} 선분)`,
      ok: () => ans.includes(sel), key: () => String(sel), val: () => sel == null ? "-" : `${nm(sel)}→${nm(sel + 1)}`,
      msg: () => sel == null ? "그래프에서 선분을 눌러 골라요."
        : o.mode === "inc" && d[sel] <= 0 ? `고른 선분(${nm(sel)}→${nm(sel + 1)})은 오른쪽 위로 올라가지 않았어요. 늘어난 때는 선분이 오른쪽 위로 올라가요.`
        : o.mode === "dec" && d[sel] >= 0 ? `고른 선분(${nm(sel)}→${nm(sel + 1)})은 오른쪽 아래로 내려가지 않았어요. 줄어든 때는 선분이 오른쪽 아래로 내려가요.`
        : "더 많이 기울어진 선분이 있어요. 선분이 기울어진 정도를 서로 견주어 봐요."
    };
  } };
}
/* ---------- 선분마다 늘어남·줄어듦·그대로 표시하기 ---------- */
function l5TrendQ(o) {
  const g = o.g, si = o.si || 0, S = l5Ser(g), V = S[si].vals, n = V.length, nm = i => l5Nm(g, i);
  const want = V.slice(1).map((v, i) => v > V[i] ? 1 : v < V[i] ? 2 : 3);
  const LAB = ["?", "늘어남", "줄어듦", "그대로"], COL = ["#7A8A86", "#2F8F5B", "#C9463B", "#5B6B67"];
  return { t: "custom", q: o.q, make: () => {
    const G = l5Geom(g, g), svg = makeSvg(G.W, G.H), stt = want.map(() => 0);
    const draw = () => {
      l5Paint(svg, g, G, l5St(g));
      for (let i = 0; i + 1 < n; i++) {
        const x1 = G.x(i), y1 = G.y(V[i]), x2 = G.x(i + 1), y2 = G.y(V[i + 1]), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const hit = svgEl("line", { x1, y1, x2, y2, stroke: "transparent", "stroke-width": 28, style: "cursor:pointer" });
        const t = LAB[stt[i]], w = l5W(t, 15) + 14, by = Math.max(G.T + 2, my - 26);
        const tag = svgEl("g", { style: "cursor:pointer" });
        tag.append(svgEl("rect", { x: mx - w / 2, y: by - 12, width: w, height: 24, rx: 8, fill: "#fff", stroke: COL[stt[i]], "stroke-width": 2 }), txt(mx, by, t, 15, { fill: COL[stt[i]] }));
        const turn = () => { stt[i] = stt[i] % 3 + 1; draw(); };
        hit.addEventListener("click", turn); tag.addEventListener("click", turn);
        svg.append(hit, tag);
      }
    };
    draw();
    const el = h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, "선분(또는 그 위 이름표)을 누를 때마다 ‘늘어남 → 줄어듦 → 그대로’ 차례로 바뀌어요."));
    return {
      el, ans: want.map((w, i) => `${nm(i)}→${nm(i + 1)} ${LAB[w]}`).join(", "),
      ok: () => stt.every((s, i) => s === want[i]), key: () => stt.join(""), val: () => stt.map(s => LAB[s]).join("·"),
      msg: () => {
        if (stt.some(s => s === 0)) return "아직 표시하지 않은 선분이 있어요. 모든 선분에 표시해요.";
        const i = stt.findIndex((s, k) => s !== want[k]);
        return `${nm(i)}→${nm(i + 1)} 선분을 다시 봐요. 오른쪽 위로 올라가면 늘어남, 오른쪽 아래로 내려가면 줄어듦, 평평하면 그대로예요.`;
      }
    };
  } };
}
/* ---------- 점 고르기: 가장 많은(max)·적은(min) 때 ---------- */
function l5PointQ(o) {
  const g = o.g, si = o.si || 0, V = l5Ser(g)[si].vals, nm = i => l5Nm(g, i);
  const t = o.mode === "min" ? Math.min(...V) : Math.max(...V), ans = V.map((v, i) => v === t ? i : -1).filter(i => i >= 0);
  return { t: "custom", q: o.q, make: () => {
    const G = l5Geom(g, g), svg = makeSvg(G.W, G.H); let sel = null;
    const draw = () => {
      l5Paint(svg, g, G, l5St(g));
      V.forEach((v, i) => {
        if (sel === i) svg.append(svgEl("circle", { cx: G.x(i), cy: G.y(v), r: 14, fill: "none", stroke: L5_SEL, "stroke-width": 3.5 }));
        const hit = svgEl("circle", { cx: G.x(i), cy: G.y(v), r: 20, fill: "transparent", style: "cursor:pointer" });
        hit.addEventListener("click", () => { sel = sel === i ? null : i; draw(); });
        svg.append(hit);
      });
    };
    draw();
    const el = h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, "점을 눌러 골라요. 고른 점에 빨간 동그라미가 생겨요."));
    return {
      el, ans: ans.map(nm).join(", "), ok: () => ans.includes(sel), key: () => String(sel), val: () => sel == null ? "-" : nm(sel),
      msg: () => sel == null ? "그래프에서 점을 눌러 골라요." : o.mode === "min" ? "더 낮은 곳에 찍힌 점이 있어요. 점의 높이를 견주어 봐요." : "더 높은 곳에 찍힌 점이 있어요. 점의 높이를 견주어 봐요."
    };
  } };
}
/* ---------- 두 점 사이의 값 어림하기 ---------- o = {g, at:(소수 번째), label, ans, q} */
function l5BetweenQ(o) {
  const g = o.g, U = g.unit;
  return { t: "custom", q: o.q, why: o.why, make: () => {
    const G = l5Geom(g, g), svg = makeSvg(G.W, G.H), X = G.x(o.at); let v = null;
    svg.style.touchAction = "none";
    const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": o.label });
    const draw = () => {
      l5Paint(svg, g, G, l5St(g));
      svg.append(svgEl("line", { x1: X, y1: G.T, x2: X, y2: G.PB, stroke: L5_SEL, "stroke-width": 2, "stroke-dasharray": "6 5" }), txt(X, G.T - 12, o.label, 16, { fill: L5_SEL }));
      if (v != null) { svg.append(svgEl("circle", { cx: X, cy: G.y(v), r: 8, fill: "#fff", stroke: L5_SEL, "stroke-width": 3.5 })); l5Ruler(svg, G, Math.round((v - G.lo) / G.step)); }
    };
    const set = p => { v = G.lo + l5K(G, p) * G.step; draw(); };
    dragOn(svg, p => { if (Math.abs(p.x - X) > G.SW * .6 || p.y > G.PB + 12) return false; set(p); }, set);
    draw();
    const el = h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, `빨간 점선 위를 눌러(끌어) ${l5J(o.label, "이/가")} 있을 만한 자리에 점을 찍어요.`),
      h("div", { class: "l5row" }, h("span", {}, `${o.label}: 약 `), inp, h("span", {}, U)));
    return {
      el, ans: `약 ${l5U(o.ans, U)}`, key: () => String(l5Num(inp)), val: () => `점 ${v == null ? "-" : l5F(v)} / 약 ${inp.value.trim() || "-"}`,
      ok: () => v === o.ans && l5Num(inp) === o.ans,
      msg: () => v == null ? "빨간 점선 위에 점을 찍어요." : v !== o.ans ? "두 점을 이은 선분 위에 점이 오도록 해요. 선분은 두 점 사이에서 일정하게 변한다고 생각해요."
        : "찍은 점의 높이를 세로 눈금에서 읽어 수로 써요."
    };
  } };
}

/* ---------- 카드 나누기 ---------- opt = {bins:[글|{t, fig}], cards:[{t, b}]} */
function l5Sort(body, api, opt) {
  const where = opt.cards.map(() => null); let sel = null;
  const pool = h("div", { class: "l5pool" });
  const bt = b => typeof b === "string" ? b : b.t;
  const cards = opt.cards.map((c, i) => h("button", { class: "l5card", onclick: e => {
    e.stopPropagation();
    if (where[i] != null) { where[i] = null; sel = i; } else sel = sel === i ? null : i;
    draw();
  } }, c.t));
  const bins = opt.bins.map((b, bi) => {
    const list = h("div");
    const box = h("div", { class: "l5bin", onclick: () => {
      if (sel == null) return api.hint("먼저 카드를 누른 다음, 넣을 곳을 눌러요.");
      where[sel] = bi; sel = null; draw();
    } }, h("div", { class: "l5bint" }, bt(b)), typeof b === "string" ? null : b.fig(), list);
    return { box, list };
  });
  function draw() {
    cards.forEach((c, i) => {
      c.classList.toggle("l5sel", sel === i); c.classList.remove("l5good", "l5bad");
      (where[i] == null ? pool : bins[where[i]].list).append(c);
    });
  }
  draw();
  api.provide({ words: opt.bins.map(bt), answers: opt.bins.map((b, bi) => `${bt(b)}: ${opt.cards.filter(c => c.b === bi).map(c => c.t).join(" / ")}`) });
  body.append(h("p", { class: "inst" }, "카드를 누르고, 넣을 상자를 눌러요. 상자 안의 카드를 누르면 다시 빠져요."), pool,
    h("div", { class: "l5bins" }, bins.map(b => b.box)),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      if (where.some(w => w == null)) return api.hint("아직 넣지 않은 카드가 있어요. 카드를 모두 상자에 넣어요.");
      let ok = true;
      cards.forEach((c, i) => { const g = where[i] === opt.cards[i].b; c.classList.add(g ? "l5good" : "l5bad"); if (!g) ok = false; });
      const given = opt.bins.map((b, bi) => `${bt(b)}: ${opt.cards.filter((_, i) => where[i] === bi).map(c => c.t).join("/")}`).join(" | ");
      if (ok) return api.done(given, opt.ok);
      const bad = opt.cards.findIndex((c, i) => where[i] !== c.b);
      api.fail((opt.cards[bad].why) || opt.bad || "빨간 카드를 다시 생각해 봐요.", given);
    } }, "확인하기")));
}

/* ---------- 꺾은선그래프(막대그래프) 그리기 ----------
   opt = { g, kind, axisPick, waveChoices:[0(넣지 않기), 220, …], stepChoices, titleChoices, lock:[번호], bg:{name, vals}, table:true, ok } */
function l5Build(body, api, opt) {
  const g0 = opt.g, g = opt.bg ? L5V(g0, { legend: true }) : g0, n = g.xs.length, U = g.unit || "", vals = g.vals;
  const kind = opt.kind || g.kind || "line", word = kind === "bar" ? "막대" : "점";
  const lock = new Set(opt.lock || []), mn = Math.min(...vals), mx = Math.max(...vals);
  const st = {
    lo: opt.waveChoices ? null : (g.lo || 0), step: opt.stepChoices ? null : g.step, cells: g.cells,
    pts: vals.map((v, i) => lock.has(i) ? v : null),
    title: opt.titleChoices ? null : g.title, xAxis: opt.axisPick ? null : g.xAxis, yAxis: opt.axisPick ? null : g.yAxis, sel: null
  };
  const known = () => st.lo != null && st.step != null;
  const fits = (lo, s) => lo <= mn && lo + s * st.cells >= mx && vals.every(v => l5Mult(v - lo, s));
  let aLo = g.lo || 0, aStep = g.step;
  (opt.waveChoices || [g.lo || 0]).forEach(lo => (opt.stepChoices || [g.step]).forEach(s => { if (fits(lo, s)) { aLo = lo; aStep = s; } }));
  const svg = makeSvg(400, 300); svg.style.touchAction = "none";
  let G;
  const info = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const kOf = v => Math.round((v - st.lo) / st.step * 100) / 100;
  function draw() {
    G = l5Geom(g, { lo: st.lo || 0, step: st.step || g.step, cells: st.cells });
    const ser = [];
    if (opt.bg) ser.push({ name: opt.bg.name, vals: opt.bg.vals, color: opt.bg.color || L5_DIM });
    ser.push({ name: opt.name || g.yAxis, vals: st.pts, color: opt.color || L5_LINE });
    l5Paint(svg, g, G, { known: known(), title: st.title, xAxis: st.xAxis, yAxis: st.yAxis, ser, kind, sel: st.sel, legend: !!opt.bg });
    info.textContent = `${word}: ` + g.xs.map((x, i) => `${l5Nm(g, i)} ${st.pts[i] == null || !known() ? "?" : kOf(st.pts[i]) + "칸"}`).join(" · ");
  }
  const colOf = p => { if (p.y < G.T - 30 || p.y > G.base + 44) return -1; const i = Math.floor((p.x - G.L) / G.SW); return i >= 0 && i < n ? i : -1; };
  const valAt = p => Math.round((st.lo + l5K(G, p) * st.step) * 1000) / 1000;
  dragOn(svg, p => {
    const i = colOf(p); if (i < 0) return false;
    if (!known()) { api.hint(opt.waveChoices ? "먼저 물결선을 어디에 넣을지와 세로 눈금 한 칸의 크기를 정해요." : "먼저 세로 눈금 한 칸의 크기를 정해요."); return false; }
    st.sel = i;
    if (lock.has(i)) { api.hint(`이 ${word}${word === "점" ? "은" : "는"} 이미 그려져 있어요.`); draw(); return false; }
    st.pts[i] = valAt(p); draw();
  }, p => { if (st.sel != null && !lock.has(st.sel) && known()) { st.pts[st.sel] = valAt(p); draw(); } });
  const reset = () => { if (st.pts.some((v, i) => v != null && !lock.has(i))) api.hint(`눈금이 바뀌었어요. ${word}${word === "점" ? "을" : "를"} 다시 그려요.`); st.pts = st.pts.map((v, i) => lock.has(i) ? v : null); };
  const side = h("div", { class: "side l5side" });
  const pickRow = (label, list, fmt, get, set) => {
    const row = h("div", { class: "l5btns" }, h("span", { class: "l5lbl" }, label));
    list.forEach(v => {
      const b = h("button", { onclick: () => { set(v); [...row.querySelectorAll("button")].forEach(x => x.classList.toggle("l5on", x === b)); draw(); } }, fmt(v));
      if (get() === v) b.classList.add("l5on");
      row.append(b);
    });
    return row;
  };
  const selectRow = (label, list, set) => {
    const s = h("select", { "aria-label": label }, h("option", { value: "" }, "고르기"), list.map(v => h("option", { value: v }, v)));
    s.onchange = () => { set(s.value || null); draw(); };
    return h("div", { class: "l5btns" }, h("span", { class: "l5lbl" }, label), s);
  };
  if (opt.axisPick) side.append(selectRow("가로:", [g.xAxis, g.yAxis], v => st.xAxis = v), selectRow("세로:", [g.xAxis, g.yAxis], v => st.yAxis = v));
  if (opt.waveChoices) side.append(pickRow("물결선:", opt.waveChoices, v => v ? `0과 ${l5U(v, U)} 사이` : "넣지 않기", () => st.lo, v => { st.lo = v; reset(); }));
  if (opt.stepChoices) side.append(pickRow("세로 눈금 한 칸:", opt.stepChoices, v => l5U(v, U), () => st.step, v => { st.step = v; reset(); }));
  if (opt.titleChoices) side.append(selectRow("제목:", opt.titleChoices, v => st.title = v));
  const move = d => () => {
    if (st.sel == null || lock.has(st.sel)) return api.hint(`먼저 고칠 ${word}${word === "점" ? "을" : "를"} 눌러요.`);
    if (!known()) return api.hint("먼저 눈금을 정해요.");
    const cur = st.pts[st.sel] == null ? st.lo : st.pts[st.sel] + d * st.step;
    st.pts[st.sel] = Math.round(Math.max(st.lo, Math.min(st.lo + st.cells * st.step, cur)) * 1000) / 1000; draw();
  };
  side.append(info, h("div", { class: "tools" }, h("button", { onclick: move(1) }, "▲ 한 칸"), h("button", { onclick: move(-1) }, "▼ 한 칸")),
    h("p", { class: "l5cap" }, kind === "bar" ? "막대를 세울 칸을 누르고 위아래로 끌어요." : "점을 찍을 자리를 누르고 위아래로 끌어요. 이웃한 점은 저절로 선분으로 이어져요."),
    h("button", { class: "big", onclick: check }, "확인하기"));
  function check() {
    api.tryOnce();
    const given = (opt.waveChoices ? `물결선 ${st.lo == null ? "?" : st.lo ? "0~" + st.lo : "없음"}, ` : "") + (st.step == null ? "?" : l5U(st.step, U)) + ": " + g.xs.map((x, i) => `${l5Nm(g, i)} ${st.pts[i] == null ? "?" : l5F(st.pts[i])}`).join(", ");
    if (opt.axisPick) {
      if (st.xAxis == null || st.yAxis == null) return api.fail("가로와 세로에 무엇을 나타낼지 먼저 골라요.", given);
      if (st.xAxis !== g.xAxis || st.yAxis !== g.yAxis) return api.fail(`시간의 흐름을 나타내는 ${l5J("‘" + g.xAxis + "’", "을/를")} 가로에, 변하는 양인 ${l5J("‘" + g.yAxis + "’", "을/를")} 세로에 나타내요.`, given);
    }
    if (st.lo == null) return api.fail("물결선을 넣을지, 넣는다면 어디에 넣을지 먼저 골라요.", given);
    if (st.step == null) return api.fail("세로 눈금 한 칸의 크기를 먼저 골라요.", given);
    if (st.lo > mn) return api.fail(`물결선으로 0과 ${l5U(st.lo, U)} 사이를 생략하면 가장 작은 수 ${l5J(l5U(mn, U), "을/를")} 나타낼 수 없어요. 물결선은 자료의 값이 없는 부분에만 넣어요.`, given);
    const top = st.lo + st.step * st.cells;
    if (top < mx) return api.fail(`${st.lo ? `물결선 위 ${l5U(st.lo, U)}부터 ` : ""}눈금 한 칸이 ${l5U(st.step, U)}이고 ${st.cells}칸이면 ${l5U(top, U)}까지만 나타낼 수 있어요. 가장 큰 수 ${l5U(mx, U)}까지 나타낼 수 있게 골라요.`, given);
    const nd = vals.findIndex(v => !l5Mult(v - st.lo, st.step));
    if (nd >= 0) return api.fail(`눈금 한 칸이 ${l5U(st.step, U)}이면 ${l5Nm(g, nd)}의 ${l5U(vals[nd], U)}${l5Jong(l5U(vals[nd], U)) ? "은" : "는"} 눈금과 눈금 사이에 찍혀서 정확하게 나타내기 어려워요. 모든 수가 눈금에 꼭 맞는 크기를 골라요.`, given);
    for (let i = 0; i < n; i++) {
      if (lock.has(i)) continue;
      if (st.pts[i] == null) return api.fail(`아직 ${l5Nm(g, i)}의 ${word}${word === "점" ? "을" : "를"} 그리지 않았어요.`, given);
      if (st.pts[i] !== vals[i]) return api.fail(`${l5Nm(g, i)}의 ${word}${word === "점" ? "이" : "가"} ${l5U(l5F(st.pts[i]), U)}에 그려져 있어요. ${l5U(vals[i], U)}${st.lo ? `는 ${l5U(st.lo, U)}에서` : "는 0에서"} 눈금 몇 칸 위일까요? (눈금 한 칸 ${l5U(st.step, U)})`.replace(`${l5U(vals[i], U)}는`, l5J(l5U(vals[i], U), "은/는")), given);
    }
    if (opt.titleChoices && st.title !== g.title) return api.fail(st.title == null ? "그래프에 알맞은 제목을 골라요." : "제목은 무엇을 조사한 그래프인지 알 수 있게 붙여요. 표의 내용을 다시 살펴봐요.", given);
    api.done(given, opt.ok || "표의 수에 맞게 꺾은선그래프를 완성했어요!");
  }
  api.provide({
    words: opt.words || ["물결선", "세로 눈금 한 칸의 크기", "가장 큰 수", "가장 작은 수", "제목"],
    answers: [(opt.waveChoices ? `물결선 ${aLo ? `0과 ${l5U(aLo, U)} 사이` : "넣지 않기"}, ` : "") + (opt.stepChoices ? `한 칸 ${l5U(aStep, U)}: ` : "") + g.xs.map((x, i) => `${l5Nm(g, i)} ${l5U(vals[i], U)}`).join(", ")]
  });
  draw();
  if (opt.table) body.append(l5Table(g0));
  body.append(h("div", { class: "panel" }, h("div", { class: "stage" }, svg), side));
}

/* ---------- 나의 감정 그래프(내 점수로 자유롭게) ---------- */
function l5Mood(body, api, opt) {
  const g = opt.g, n = g.xs.length, pts = g.xs.map(() => null), memo = g.xs.map(() => "");
  let sel = null;
  const G = l5Geom(g, g), svg = makeSvg(G.W, G.H); svg.style.touchAction = "none";
  const info = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const draw = () => {
    l5Paint(svg, g, G, { known: true, title: g.title, xAxis: g.xAxis, yAxis: g.yAxis, ser: [{ name: "나", vals: pts, color: L5_LINE }], kind: "line", sel });
    info.textContent = g.xs.map((x, i) => `${l5Nm(g, i)} ${pts[i] == null ? "?" : pts[i] + "점"}`).join(" · ");
  };
  const colOf = p => { const i = Math.floor((p.x - G.L) / G.SW); return p.y > G.T - 30 && p.y < G.base + 44 && i >= 0 && i < n ? i : -1; };
  dragOn(svg, p => { const i = colOf(p); if (i < 0) return false; sel = i; pts[i] = l5K(G, p) * G.step; draw(); }, p => { if (sel != null) { pts[sel] = l5K(G, p) * G.step; draw(); } });
  const memoBox = h("div", { class: "l5mood" }, g.xs.map((x, i) => { const inp = h("input", { type: "text", placeholder: "기억에 남는 일", "aria-label": l5Nm(g, i) }); inp.oninput = () => memo[i] = inp.value.trim(); return h("label", {}, l5Nm(g, i), inp); }));
  const months = g.xs.slice(1).map((x, i) => l5Nm(g, i + 1));
  let big = null, small = null;
  const pick = (set) => { const row = h("div", { class: "opts" }); months.forEach((m, k) => row.append(h("button", { class: "opt", onclick: e => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); set(k); } }, m))); return row; };
  const rowB = pick(k => big = k), rowS = pick(k => small = k);
  body.append(h("p", { class: "inst" }, "① 달마다 가장 기억에 남는 일을 짧게 써요(쓰지 않아도 돼요). ② 그 달의 감정 점수(0점~100점, 10점 단위)만큼 점을 찍어요."), memoBox,
    h("div", { class: "panel" }, h("div", { class: "stage" }, svg), h("div", { class: "side" }, info, h("p", { class: "l5cap" }, "점을 찍을 자리를 누르고 위아래로 끌어요. 세로 눈금 한 칸은 10점이에요."))),
    h("div", { class: "qitem" }, h("div", { class: "jua" }, "내 그래프에서 전월과 비교하여 감정 점수의 변화가 가장 큰 때는 언제인가요?"), rowB),
    h("div", { class: "qitem" }, h("div", { class: "jua" }, "내 그래프에서 전월과 비교하여 감정 점수의 변화가 가장 작은 때는 언제인가요?"), rowS),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const given = pts.map((v, i) => `${l5Nm(g, i)} ${v == null ? "?" : v}${memo[i] ? "(" + memo[i] + ")" : ""}`).join(", ");
      if (pts.some(v => v == null)) return api.fail("아직 점을 찍지 않은 달이 있어요. 모든 달에 점을 찍어요.", given);
      const d = pts.slice(1).map((v, i) => Math.abs(v - pts[i])), mxd = Math.max(...d), mnd = Math.min(...d);
      if (mxd === mnd) return api.hint("모든 달의 변화가 똑같아요. 감정이 크게 달라진 달이 있다면 점수를 바꾸어 봐요.");
      if (big == null || small == null) return api.fail("두 물음에 알맞은 달을 골라요.", given);
      const okB = d[big] === mxd, okS = d[small] === mnd;
      [[rowB, big, okB], [rowS, small, okS]].forEach(([r, k, ok]) => r.children[k].classList.add(ok ? "good" : "bad"));
      if (!okB) return api.fail(`${months[big]}에는 전월보다 ${d[big]}점 변했어요. 선분이 더 많이 기울어진 곳을 찾아요.`, given);
      if (!okS) return api.fail(`${months[small]}에는 전월보다 ${d[small]}점 변했어요. 선분이 가장 덜 기울어진 곳을 찾아요.`, given);
      api.done(given + ` / 가장 큰 변화 ${months[big]}, 가장 작은 변화 ${months[small]}`, "나의 감정 그래프를 완성하고 변화를 정확하게 찾았어요! 친구의 그래프와도 견주어 봐요.");
    } }, "확인하기")));
  api.provide({ words: ["감정 점수", "전월", "변화가 가장 큰 때", "선분이 많이 기울어진 곳"], answers: [] });
  draw();
}

/* ---------- 공학 도구처럼: 수를 넣으면 꺾은선그래프가 바로 그려져요 ---------- */
function l5Tool(body, api, opt) {
  const g = opt.g, U = g.unit;
  let step = 1, wave = false; const seenS = new Set(), seenW = new Set();
  const ins = g.xs.map((x, i) => h("input", { type: "text", inputmode: "numeric", "aria-label": l5Nm(g, i) }));
  const tbl = h("div", { class: "l5tbl" }, h("div", { class: "l5tt" }, g.title), h("table", {}, h("tbody", {},
    h("tr", {}, h("th", {}, `${g.xAxis}(${g.xUnit})`), g.xs.map(x => h("th", {}, x))),
    h("tr", {}, h("th", {}, `${g.yAxis}(${U})`), ins.map(i => h("td", {}, i))))));
  const stage = h("div", { class: "stage" });
  const note = h("p", { class: "l5cap" });
  const draw = () => {
    const v = ins.map(l5Num), okv = v.every(x => Number.isFinite(x) && x >= 0);
    const vals = okv ? v : g.xs.map(() => 0), mx = Math.max(1, ...vals), mn = Math.min(...vals), M = step * 5;
    const lo = wave && okv ? Math.max(0, Math.floor((mn - step) / M) * M) : 0;
    const cells = Math.max(5, Math.ceil((mx - lo) / step / 5) * 5);
    const gg = Object.assign({}, g, { vals, step, lo, cells, major: M, ch: null });
    const G = l5Geom(gg, gg), svg = makeSvg(G.W, G.H);
    l5Paint(svg, gg, G, l5St(gg));
    stage.innerHTML = ""; stage.append(svg);
    if (okv) { seenS.add(step); seenW.add(lo > 0 ? "on" : "off"); }
    note.textContent = !okv ? "표에 수를 모두 넣으면 꺾은선그래프가 그려져요."
      : `간격(눈금 한 칸) ${l5U(step, U)} · 물결선 ${lo > 0 ? `0과 ${l5U(lo, U)} 사이` : wave ? "넣을 곳이 없어요(간격이 커요)" : "없음"} — 바꾸어 본 간격 ${seenS.size}가지`;
  };
  ins.forEach(i => i.addEventListener("input", draw));
  const stepRow = h("div", { class: "l5btns" }, h("span", { class: "l5lbl" }, "간격:"));
  [1, 2, 5, 10].forEach(s => { const b = h("button", { onclick: () => { step = s; [...stepRow.querySelectorAll("button")].forEach(x => x.classList.toggle("l5on", x === b)); draw(); } }, String(s)); if (s === 1) b.classList.add("l5on"); stepRow.append(b); });
  const waveRow = h("div", { class: "l5btns" }, h("span", { class: "l5lbl" }, "물결선:"));
  [["넣지 않기", false], ["넣기", true]].forEach(([t, w]) => { const b = h("button", { onclick: () => { wave = w; [...waveRow.querySelectorAll("button")].forEach(x => x.classList.toggle("l5on", x === b)); draw(); } }, t); if (!w) b.classList.add("l5on"); waveRow.append(b); });
  const side = h("div", { class: "side" }, h("p", {}, "① 표에 수를 넣어요. ② 간격(세로 눈금 한 칸의 크기)을 바꾸어 봐요. ③ 물결선을 넣었을 때와 넣지 않았을 때를 견주어 봐요."), stepRow, waveRow, note,
    h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const v = ins.map(l5Num), given = ins.map(i => i.value.trim() || "-").join(", ");
      const bad = v.findIndex((x, i) => x !== g.vals[i]);
      if (bad >= 0) { ins.forEach((i, k) => i.style.borderColor = v[k] === g.vals[k] ? "var(--ok)" : "var(--no)"); return api.fail(`${l5Nm(g, bad)} 칸의 수를 조사한 표와 다시 견주어 봐요.`, given); }
      if (seenS.size < 2) return api.hint("간격을 다른 수로 바꾸어 그래프가 어떻게 달라지는지 살펴봐요.");
      if (seenW.size < 2) return api.hint("간격을 1로 두고 물결선을 ‘넣기’로도 바꾸어 견주어 봐요.");
      api.done(given + ` / 간격 ${[...seenS].join("·")}, 물결선 있음·없음`, opt.ok);
    } }, "확인하기"));
  api.provide({ words: ["간격", "눈금 한 칸의 크기", "물결선"], answers: [g.xs.map((x, i) => `${x} ${g.vals[i]}`).join(", ")] });
  draw();
  body.append(tbl, h("div", { class: "panel" }, stage, side));
}

/* ---------- 폭염일 찾기: 온도계를 눌러 33 ℃보다 높거나 같은 날 고르기 ---------- */
function l5Hot(body, api, opt) {
  const days = opt.days, n = days.length, on = days.map(() => false), CW = 64, W = 30 + n * CW, H = 360;
  const lo = 28, hi = 38, top = 70, bot = 280, Y = t => bot - (t - lo) / (hi - lo) * (bot - top);
  const svg = makeSvg(W, H);
  const draw = () => {
    svg.innerHTML = "";
    svg.append(txt(W / 2, 24, opt.title, 20));
    svg.append(svgEl("line", { x1: 10, y1: Y(33), x2: W - 10, y2: Y(33), stroke: L5_SEL, "stroke-width": 2, "stroke-dasharray": "7 5" }), txt(W - 12, Y(33) - 12, "33 ℃", 15, { "text-anchor": "end", fill: L5_SEL }));
    days.forEach((d, i) => {
      const cx = 15 + CW * (i + .5), g = svgEl("g", { style: "cursor:pointer" });
      if (on[i]) g.append(svgEl("rect", { x: cx - CW / 2 + 3, y: 40, width: CW - 6, height: 312, rx: 10, fill: "#FFE6DC", stroke: L5_SEL, "stroke-width": 2.5 }));
      g.append(svgEl("rect", { x: cx - 7, y: top - 6, width: 14, height: bot - top + 10, rx: 7, fill: "#fff", stroke: "#9AA9A3", "stroke-width": 1.5 }));
      g.append(svgEl("rect", { x: cx - 4, y: Y(d.t), width: 8, height: bot + 6 - Y(d.t), fill: "#E04A3A" }));
      g.append(svgEl("circle", { cx, cy: bot + 14, r: 12, fill: "#E04A3A", stroke: "#B5402F", "stroke-width": 1.5 }));
      g.append(txt(cx, 54, d.t.toFixed(1), 15), txt(cx, bot + 44, d.d, 16));
      g.append(svgEl("rect", { x: cx - CW / 2, y: 36, width: CW, height: 320, fill: "transparent" }));
      g.addEventListener("click", () => { on[i] = !on[i]; draw(); });
      svg.append(g);
    });
  };
  const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": "폭염일수" });
  const want = days.map(d => d.t >= 33), cnt = want.filter(Boolean).length;
  draw();
  body.append(h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, "폭염일인 날의 온도계를 눌러 표시해요. 다시 누르면 표시가 없어져요.")),
    h("div", { class: "l5row" }, h("span", { class: "jua" }, "이 열흘 동안의 폭염일수: "), inp, h("span", {}, "일")),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const given = days.filter((d, i) => on[i]).map(d => d.d).join(",") + ` / ${inp.value.trim() || "-"}일`;
      const miss = days.findIndex((d, i) => want[i] && !on[i]), extra = days.findIndex((d, i) => !want[i] && on[i]);
      if (extra >= 0) return api.fail(`${days[extra].d}의 최고 기온은 ${days[extra].t.toFixed(1)} ℃예요. 33 ℃보다 낮아요.`, given);
      if (miss >= 0) return api.fail(`${days[miss].d}의 최고 기온 ${days[miss].t.toFixed(1)} ℃도 폭염일이에요. 33 ℃보다 높거나 같은 날을 모두 골라요.`, given);
      if (l5Num(inp) !== cnt) { inp.style.borderColor = "var(--no)"; return api.fail("표시한 날의 수를 세어 폭염일수를 써요.", given); }
      inp.style.borderColor = "var(--ok)";
      api.done(given, opt.ok);
    } }, "확인하기")));
  api.provide({ words: ["폭염일수", "33 ℃", "높거나 같은"], answers: [days.filter(d => d.t >= 33).map(d => d.d).join(", ") + ` / ${cnt}일`] });
}

/* ---------- 누리집 조사 화면(예시)을 보고 표로 정리하기 ---------- */
function l5Portal(body, api, opt) {
  const rows = opt.rows, months = opt.months;
  const portal = h("div", { class: "l5tbl" }, h("div", { class: "l5tt" }, opt.head), h("table", {}, h("tbody", {},
    h("tr", {}, h("th", {}, "연도"), months.map(m => h("th", {}, m)), h("th", {}, "연합계")),
    rows.map(r => h("tr", {}, h("th", {}, r.y), r.m.map(v => h("td", {}, String(v))), h("td", { class: "l5hi" }, String(r.m.reduce((a, b) => a + b, 0))))))));
  const g = opt.g, T = l5TableEl({ title: g.title, head: "연도(년)", row: "폭염일수(일)", cols: g.xs, vals: g.vals }, g.xs.map((_, i) => i));
  body.append(portal, h("p", { class: "l5cap" }, "(기상자료개방포털의 기상현상일수 검색 결과를 본뜬 예시 화면이에요.)"), h("p", { class: "inst" }, "조사 결과에서 한 해 동안의 폭염일수를 찾아 표를 완성해 보세요."), T.el,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const given = g.xs.map((x, i) => T.ins[i].value.trim() || "-").join(", ");
      let bad = -1;
      g.xs.forEach((x, i) => { const ok = l5Num(T.ins[i]) === g.vals[i]; T.ins[i].style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok && bad < 0) bad = i; });
      if (bad >= 0) {
        const r = rows[bad], v = l5Num(T.ins[bad]);
        return api.fail(r.m.includes(v) && v !== g.vals[bad] ? `${g.xs[bad]}년 칸에 한 달의 폭염일수를 썼어요. 한 해 동안의 폭염일수는 ‘연합계’ 칸에 있어요.` : `${g.xs[bad]}년의 ‘연합계’ 칸을 다시 확인해 봐요.`, given);
      }
      api.done(given, opt.ok);
    } }, "확인하기")));
  api.provide({ words: ["연합계", "폭염일수", "표"], answers: [g.xs.map((x, i) => `${x}년 ${g.vals[i]}일`).join(", ")] });
}

/* ---------- 아기 곰 얼음 조각 건너기: 옳은 문장만 골라 길 만들기 ---------- */
function l5Ice(body, api, opt) {
  const on = opt.items.map(() => false);
  const path = h("div", { class: "l5path" });
  const ices = opt.items.map((it, i) => h("button", { class: "l5ice", onclick: e => { on[i] = !on[i]; e.currentTarget.classList.toggle("l5on", on[i]); ices.forEach(b => b.classList.remove("l5good", "l5bad")); showPath(); } }, it.t));
  const showPath = () => { const p = opt.items.filter((_, i) => on[i]).map((_, k) => `얼음 ${k + 1}`); path.textContent = "아기 곰의 길: 출발 → " + (p.length ? p.join(" → ") + " → " : "") + "엄마 곰"; };
  showPath();
  body.append(opt.fig(), h("div", { class: "l5pond" }, h("span", { class: "l5bear" }, "🐻 아기 곰 출발"), ices, h("span", { class: "l5bear" }, "엄마 곰 도착 🐻")), path,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const given = opt.items.map((it, i) => on[i] ? i + 1 : null).filter(Boolean).join(",") || "-";
      const wrong = opt.items.findIndex((it, i) => on[i] && !it.ok), miss = opt.items.findIndex((it, i) => !on[i] && it.ok);
      ices.forEach((b, i) => { if (on[i]) b.classList.add(opt.items[i].ok ? "l5good" : "l5bad"); });
      if (wrong >= 0) return api.fail(`풍덩! 이 얼음 조각은 옳지 않은 문장이에요. ${opt.items[wrong].why}`, given);
      if (miss >= 0) return api.fail("엄마 곰까지 가려면 옳은 문장이 하나 더 필요해요. 남은 조각을 다시 읽어 봐요.", given);
      api.done(given, opt.ok);
    } }, "확인하기")));
  api.provide({ words: ["옳은 문장", "세로 눈금 한 칸", "가장 많이 줄어든 때"], answers: [opt.items.filter(it => it.ok).map(it => it.t).join(" / ")] });
}

/* ---------- 하루의 길이 그림(단원 도입) ---------- */
function l5DayFig() {
  const svg = makeSvg(640, 230);
  const earth = (x, r) => { const g = svgEl("g"); g.append(svgEl("circle", { cx: x, cy: 110, r, fill: "#7FB8E6", stroke: "#2B6FB8", "stroke-width": 2 }), svgEl("path", { d: `M${x - r * .5} ${110 - r * .3} q${r * .3} ${-r * .3} ${r * .6} 0 t${r * .3} ${r * .4} q${-r * .4} ${r * .3} ${-r * .8} ${r * .1} Z`, fill: "#6FBF73" })); return g; };
  svg.append(svgEl("rect", { x: 0, y: 0, width: 640, height: 230, fill: "#F3F7FB" }));
  svg.append(earth(140, 52), earth(500, 52));
  svg.append(txt(140, 190, "지구가 태어났을 때", 19), txt(140, 214, "하루의 길이: 4시간", 19, { fill: L5_SEL }));
  svg.append(txt(500, 190, "지금", 19), txt(500, 214, "하루의 길이: 24시간", 19, { fill: L5_SEL }));
  svg.append(svgEl("path", { d: "M230 110 H400", stroke: L5_SOFT, "stroke-width": 4 }), svgEl("path", { d: "M400 98 L424 110 L400 122 Z", fill: L5_SOFT }), txt(320, 90, "오랜 시간이 흘러", 17));
  return h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, "출처: 한국과학기술정보연구원(2006)"));
}
function l5Letter(from, lines) { return h("div", { class: "l5letter" }, h("b", {}, `✉ ${from}`), lines.map(l => h("p", { style: "margin:.25em 0" }, l))); }

/* ---------- 단원 자료 (그래프의 수) ---------- */
const L5Y = (a, b, d = 1) => { const r = []; for (let y = a; y <= b; y += d) r.push(String(y)); return r; };
const L5G = {
  temp: { title: "연도별 12월 최고 기온", xs: L5Y(2019, 2023), xAxis: "연도", xUnit: "년", yAxis: "기온", unit: "℃", vals: [7, 9, 10, 8, 11], step: 1, cells: 12 },
  dish: { title: "한결이네 반 학생들이 좋아하는 갈치 요리", xs: ["구이", "조림", "국", "튀김"], xAxis: "요리", xUnit: "", yAxis: "학생 수", unit: "명", vals: [8, 6, 3, 5], step: 1, cells: 10, kind: "bar" },
  fish: { title: "월별 갈치 어획량", xs: L5Y(8, 12), xAxis: "월", xUnit: "월", yAxis: "어획량", unit: "t", vals: [700, 200, 400, 500, 100], step: 100, cells: 8 },
  plant: { title: "월별 식물의 키", xs: L5Y(2, 10, 2), xAxis: "월", xUnit: "월", yAxis: "키", unit: "cm", vals: [3, 6, 10, 13, 17], step: 1, cells: 20 },
  rain: { title: "월별 강수량", xs: ["3", "5", "7"], xAxis: "월", xUnit: "월", yAxis: "강수량", unit: "mm", vals: [6, 12, 24], step: 2, cells: 13, major: 10 },
  room: { title: "시각별 교실의 기온", xs: ["오전 9", "10", "11", "낮 12", "오후 1", "2"], names: ["오전 9시", "오전 10시", "오전 11시", "낮 12시", "오후 1시", "오후 2시"], xAxis: "시각", xUnit: "시", yAxis: "기온", unit: "℃", vals: [11, 12, 14, 15, 17, 16], step: 1, cells: 18 },
  snow: { title: "연도별 눈 온 날수", xs: L5Y(2019, 2023), xAxis: "연도", xUnit: "년", yAxis: "날수", unit: "일", vals: [1, 5, 11, 10, 6], step: 1, cells: 15 },
  multiA: { title: "연도별 다문화 가구 수", xs: L5Y(2019, 2023), xAxis: "연도", xUnit: "년", yAxis: "가구 수", unit: "가구", vals: [132, 140, 136, 140, 144], step: 10, cells: 15, major: 50 },
  plant2: { title: "월별 식물의 키", xs: L5Y(3, 7), xAxis: "월", xUnit: "월", yAxis: "키", unit: "cm", vals: [5, 6, 9, 12, 14], step: 1, cells: 15 },
  yoon: { title: "나이별 윤재의 몸무게", xs: L5Y(7, 11), xAxis: "나이", xUnit: "살", yAxis: "몸무게", unit: "kg", vals: [22, 26, 28, 36, 38], step: 1, lo: 20, cells: 20, major: 10 },
  cls: { title: "연도별 한결이네 학교의 학급 수", xs: L5Y(2000, 2020, 5), xAxis: "연도", xUnit: "년", yAxis: "학급 수", unit: "학급", vals: [21, 19, 19, 17, 15], step: 1, cells: 22 },
  jump: { title: "높이뛰기 선수의 월별 최고 기록", xs: L5Y(8, 12), xAxis: "월", xUnit: "월", yAxis: "기록", unit: "cm", vals: [224, 236, 228, 238, 240], step: 2, lo: 220, cells: 10 },
  pencil: { title: "날짜별 색연필의 길이", xs: ["1", "8", "15", "22"], xAxis: "날짜", xUnit: "일", yAxis: "길이", unit: "cm", vals: [18, 14, 12, 8], step: 2, cells: 10 },
  culture: { title: "연도별 경상남도 문화 시설 수", xs: L5Y(2019, 2022), xAxis: "연도", xUnit: "년", yAxis: "시설 수", unit: "개", vals: [76, 84, 87, 88], step: 1, lo: 75, cells: 15 },
  birth: { title: "연도별 출생아 수", xs: L5Y(2020, 2023), xAxis: "연도", xUnit: "년", yAxis: "출생아 수", unit: "명", vals: [330, 310, 300, 260], step: 10, lo: 250, cells: 10 },
  heat: { title: "연도별 폭염일수", xs: L5Y(2018, 2022), xAxis: "연도", xUnit: "년", yAxis: "폭염일수", unit: "일", vals: [40, 29, 31, 23, 45], step: 1, lo: 20, cells: 30 },
  hang: { title: "회차별 오래 매달리기 기록", xs: L5Y(1, 4), xAxis: "회차", xUnit: "회", yAxis: "시간", unit: "초", vals: [5, 8, 10, 12], step: 1, cells: 15 },
  rope: { title: "회차별 줄넘기 기록", xs: L5Y(1, 4), xAxis: "회차", xUnit: "회", yAxis: "기록", unit: "개", vals: [37, 33, 35, 38], step: 1, lo: 30, cells: 10 },
  regions: { title: "두 지역의 연도별 폭염일수", xs: L5Y(2018, 2022), xAxis: "연도", xUnit: "년", yAxis: "폭염일수", unit: "일", step: 2, cells: 25, major: 10,
    series: [{ name: "우리 모둠 지역", vals: [40, 29, 31, 23, 45] }, { name: "다른 모둠 지역", vals: [16, 7, 10, 18, 9] }] },
  park: { title: "연도별 공원 수", xs: L5Y(2019, 2023), xAxis: "연도", xUnit: "년", yAxis: "공원 수", unit: "개", vals: [276, 272, 275, 283, 287], step: 1, lo: 270, cells: 20, major: 10 },
  bikeUse: { title: "연도별 공영 자전거 대여 횟수", xs: L5Y(2017, 2021), xAxis: "연도", xUnit: "년", yAxis: "대여 횟수", unit: "만 건", vals: [600, 1400, 2200, 2600, 3400], step: 200, cells: 20, major: 1000 },
  bikeN: { title: "연도별 공영 자전거 수", xs: L5Y(2017, 2021), xAxis: "연도", xUnit: "년", yAxis: "자전거 수", unit: "대", vals: [42000, 48000, 56000, 60000, 66000], step: 2000, lo: 40000, cells: 15, major: 10000 },
  peach: { title: "연도별 복숭아 수확량", xs: L5Y(2019, 2023), xAxis: "연도", xUnit: "년", yAxis: "수확량", unit: "kg", vals: [800, 1100, 1300, 1600, 1900], step: 100, cells: 20, major: 1000 },
  dust: { title: "월별 미세먼지가 ‘나쁨’인 날수", xs: L5Y(10, 12), xAxis: "월", xUnit: "월", yAxis: "날수", unit: "일", vals: [4, 7, 11], step: 1, cells: 15 },
  mask: { title: "월별 마스크 판매량", xs: L5Y(10, 12), xAxis: "월", xUnit: "월", yAxis: "판매량", unit: "개", vals: [5200, 5700, 6300], step: 100, lo: 5000, cells: 15, major: 1000 },
  sugar: { title: "연도별 설탕과 케첩의 가격", xs: L5Y(2019, 2022), xAxis: "연도", xUnit: "년", yAxis: "가격", unit: "원", step: 100, lo: 1500, cells: 11, showVals: true, sw: 92,
    series: [{ name: "설탕(1 kg)", vals: [1664, 1856, 1907, 2188], lab: "down" }, { name: "케첩(500 g)", vals: [2255, 2256, 2387, 2554], lab: "up" }] },
  flour: { title: "연도별 밀가루와 어묵의 가격", xs: L5Y(2019, 2022), xAxis: "연도", xUnit: "년", yAxis: "가격", unit: "원", step: 100, lo: 1000, cells: 15, showVals: true, sw: 92,
    series: [{ name: "밀가루(1 kg)", vals: [1423, 1454, 1482, 1957], lab: "down" }, { name: "어묵(300 g)", vals: [1822, 1958, 2029, 2261], lab: "up" }] },
  moodEx: { title: "월별 나의 감정 그래프", xs: L5Y(3, 11), xAxis: "월", xUnit: "월", yAxis: "점수", unit: "점", vals: [80, 70, 90, 50, 20, 70, 60, 80, 70], step: 10, cells: 10, major: 50 },
  pair: { title: "나이별 감정 그래프", xs: L5Y(7, 11), xAxis: "나이", xUnit: "살", yAxis: "점수", unit: "점", step: 10, cells: 10, major: 50,
    series: [{ name: "나", vals: [50, 70, 60, 80, 90] }, { name: "친구", vals: [60, 60, 80, 70, 100] }] },
  good: { title: "월별 미세먼지가 ‘좋음’인 날수", xs: L5Y(7, 11), xAxis: "월", xUnit: "월", yAxis: "날수", unit: "일", vals: [14, 18, 16, 14, 6], step: 2, cells: 10 },
  pop: { title: "어느 지역의 연도별 인구", xs: L5Y(2006, 2022, 4), xAxis: "연도", xUnit: "년", yAxis: "인구", unit: "만 명", vals: [30, 43, 45, 38, 34], step: 1, lo: 28, cells: 18 },
  drink: { title: "월별 음료수 판매량", xs: L5Y(6, 10), xAxis: "월", xUnit: "월", yAxis: "판매량", unit: "병", vals: [400, 550, 700, 450, 350], step: 50, cells: 15, major: 250 }
};
const L5_MOODTBL = ["4학년이 되어 새로운 친구들을 만났다.", "1학기 체험 학습을 다녀왔다.", "부모님께 어린이날 선물을 받았다.", "학교 체육 대회에서 우리 반이 아쉽게 졌다.", "축구를 하다가 넘어져 다리를 다쳤다.", "가족여행을 다녀왔다.", "2학기 체험 학습을 다녀왔다.", "줄넘기 2단 넘기를 성공했다.", "반별 장기 자랑을 준비했다."];
function l5MoodTable() {
  const g = L5G.moodEx;
  return h("div", { class: "l5tbl" }, h("div", { class: "l5tt" }, "월별 나의 감정 점수표(예시)"), h("table", {}, h("tbody", {},
    h("tr", {}, h("th", {}, "월"), h("th", {}, "가장 기억에 남는 일"), h("th", {}, "감정 점수(점)")),
    g.xs.map((x, i) => h("tr", {}, h("td", {}, x), h("td", { style: "text-align:left" }, L5_MOODTBL[i]), h("td", {}, String(g.vals[i])))))));
}
//@@LESSONS
const UNIT_STORY = { title: "힘찬시와 소망시의 편지로 꺾은선그래프 배우기", lines: [
  "바다 근처 힘찬시에 사는 한결이와 소망시에 사는 수아는 학급 편지를 주고받아요. 두 친구는 자기 지역의 변화를 한눈에 보여 주고 싶어 해요.",
  "갈치 어획량, 눈 온 날수, 학급 수, 폭염일수, 공원 수의 변화를 꺾은선그래프로 읽고 그리며 앞으로의 변화도 예상해 봐요.",
  "교과서 「수학 4-2」 5. 꺾은선그래프의 차시 순서 그대로 만들었어요."],
  one: "꺾은선그래프 · 한결이와 수아가 편지 속 자료의 변화를 꺾은선그래프로 나타내고 읽어요." };
const UNIT_KEYWORDS = ["꺾은선그래프", "꺾은선", "점", "선분", "가로", "세로", "세로 눈금 한 칸의 크기", "물결선", "변화", "늘어남", "줄어듦", "기울어진 정도", "막대그래프", "제목", "예상", "폭염일수"];

const LESSONS = [
{
  id: "l1", no: 1, title: "단원 도입 ― 힘찬시와 소망시의 학급 편지", soop: "개념 찾기(S)",
  question: "조사한 자료의 변화가 한눈에 보이도록 나타낼 방법은 없을까요?",
  summary: "힘찬시에 사는 한결이는 다른 지역 친구 수아와 편지를 주고받아요. 3학년 때 배운 그림그래프, 4학년 1학기에 배운 막대그래프를 떠올리고, 이 단원에서는 시간에 따라 변하는 자료를 점과 선분으로 나타낸 그래프를 배워요.",
  steps: [
    { name: "그림 살펴보기", inst: "단원 도입 그림의 이야기예요. “지금은 하루의 길이가 24시간이지만 옛날에는 아니었대. 지구가 태어났을 때에는 4시간이었다고 하니 신기하지?” 그림을 보고 답해 보세요.", hints: ["지구가 태어났을 때와 지금의 하루의 길이를 견주어 봐요.", "하루의 길이는 시간이 흐르면서 계속 변해 왔어요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: l5DayFig, q: "지구가 태어났을 때 하루의 길이는 몇 시간이었나요?", t: "num", a: 4, unit: "시간", why: { "24": "24시간은 지금의 하루의 길이예요." } },
        { q: "오랜 시간 동안 하루의 길이는 어떻게 변해 왔나요?", t: "pick", o: ["점점 길어졌어요", "점점 짧아졌어요", "변하지 않았어요"], a: 0 },
        { q: "하루의 길이처럼 시간에 따라 변하는 양은 어떻게 나타내면 변화가 한눈에 보일까요?", t: "pick", o: ["때마다 값을 점으로 찍고 점들을 선으로 이어 나타내요", "그림의 크기로 수량을 나타내요", "글로만 길게 써요"], a: 0 }],
        { ok: "하루의 길이는 4시간에서 24시간으로 길어졌어요. 이런 변화를 나타내기 좋은 그래프를 이 단원에서 배워요." }) },
    { name: "한결이의 편지", inst: "한결이가 수아에게 보낸 편지와 편지 옆 그래프를 살펴보세요.", hints: ["편지에서 특산품을 찾아요.", "그래프는 점을 찍고 선으로 이어서 나타냈어요."],
      render: (b, a) => { b.append(l5Letter("힘찬시 한결이가", ["안녕? 나는 힘찬시에 사는 이한결이라고 해. 우리 도시는 바다 근처에 있어. 그래서 배도 많이 볼 수 있고, 멋진 항구도 있단다.", "특산품은 갈치인데 여러 가지 요리로 만들어 먹으면 정말 맛있어. 또 겨울에는 다른 지역에 비해서 기온이 높은 편이지. 너희 지역은 어떤 곳이야? 정말 궁금해."]));
        l5Ask(b, a, [
          { fig: () => l5Fig(L5G.temp), q: "힘찬시의 특산품은 무엇인가요?", t: "pick", o: ["갈치", "사과", "감귤"], a: 0 },
          { q: "편지 옆 그래프는 무엇을 나타내나요?", t: "pick", o: ["연도별 12월 최고 기온", "월별 갈치 어획량", "연도별 눈 온 날수"], a: 0 },
          { q: "한결이는 12월 최고 기온을 어떤 그래프로 나타냈나요?", t: "pick", o: ["꺾은선으로 나타낸 그래프", "막대그래프", "그림그래프"], a: 0, why: { "1": "막대가 아니라 점과 선으로 나타냈어요.", "2": "그림의 크기로 나타내지 않았어요." } }],
          { ok: "한결이는 점을 찍고 꺾은선으로 이어 12월 최고 기온의 변화를 보여 주었어요." }); } },
    { name: "곰곰! 배운 내용 떠올리기", inst: "4학년 1학기에 배운 막대그래프를 떠올려요. 한결이네 반 학생들이 좋아하는 갈치 요리를 조사한 표를 보고 막대그래프를 완성해 보세요.", hints: ["세로 눈금 한 칸은 1명이에요.", "구이는 8명이니 막대를 8칸만큼 세워요."],
      render: (b, a) => l5Build(b, a, { g: L5G.dish, kind: "bar", table: true, ok: "막대의 길이로 학생 수를 나타냈어요. 막대그래프는 항목끼리 많고 적음을 견주기 편리해요." }) },
    { name: "똑똑! 무엇을 배울까요", inst: "이 단원에서 배울 내용이에요. 공부할 차례대로 눌러 보세요.", hints: ["먼저 꺾은선그래프가 무엇인지 알아요.", "그다음 읽는 법 → 나타내는 법 → 직접 조사하기 → 생활에 활용하기 순서예요."],
      render: (b, a) => sequence(b, a, ["꺾은선그래프로 나타내기", "꺾은선그래프 알아보기", "꺾은선그래프를 생활에 활용하기", "꺾은선그래프의 내용 알아보기", "자료를 조사하여 꺾은선그래프로 나타내기"], [1, 3, 0, 4, 2],
        { ok: "알아보기 → 내용 알아보기 → 나타내기 → 조사하여 나타내기 → 생활에 활용하기 순서로 공부해요." }) },
    { name: "답장 쓰기", inst: "한결이의 편지에 답장을 써 보세요. 꺾은선그래프를 본 적이 있는지도 떠올려 봐요.",
      render: (b, a) => writeStep(b, a, [
        { q: "반가워! 나는 ___에 사는 ___(이)라고 해. 우리 지역에 대해 소개하고 싶은 점은 ___", tag: "답장", ph: "예) 반가워! 나는 ○○시에 사는 ○○라고 해. 우리 지역은 … " },
        { q: "꺾은선으로 나타낸 그래프를 어디에서 본 적이 있나요?", tag: "경험", ph: "예) 신문 기사에서 월별 최고 기온을 나타낸 그래프를 봤어요." },
        { q: "꺾은선으로 나타낸 그래프는 어떤 자료를 나타내기에 좋을 것 같나요?", tag: "궁금", ph: "예) 시간이 지나면서 변하는 …" }]) }
  ],
  challenge: { inst: "한결이가 보낸 ‘연도별 12월 최고 기온’ 그래프를 보고 물음에 답해 보세요. 그래프를 누르면 눈금 자가 나와요.", hints: ["세로 눈금 한 칸은 1 ℃예요.", "점이 가장 높이 찍힌 해를 찾아요."],
    render: (b, a) => l5Ask(b, a, [
      l5PointQ({ g: L5G.temp, mode: "max", q: "12월 최고 기온이 가장 높았던 해의 점을 눌러 보세요." }),
      { q: "2021년의 12월 최고 기온은 몇 ℃인가요?", t: "num", a: 10, unit: "℃" },
      { q: "2022년에는 2021년보다 몇 ℃ 낮아졌나요?", t: "num", a: 2, unit: "℃", why: { "8": "8 ℃는 2022년의 기온이에요. 2021년의 10 ℃와의 차이를 구해요." } }],
      { ok: "점의 높이로 해마다의 기온을, 두 점의 높이 차이로 기온의 변화를 알 수 있어요." }) }
},
{
  id: "l2", no: 2, title: "꺾은선그래프를 알아볼까요", soop: "개념 구축하기(O)",
  question: "시간에 따라 변하는 자료를 점과 선분으로 나타내면 무엇이 편리할까요?",
  summary: "연속적으로 변화하는 양을 점으로 표시하고, 그 점들을 선분으로 이어 그린 그래프를 꺾은선그래프라고 해요. 선분이 기울어진 정도를 보면 변화를 한눈에 알 수 있고, 두 점 사이의 값도 어림할 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "한결이는 힘찬시의 월별 갈치 어획량을 표로 나타냈어요. 이번에는 막대 대신 점으로 나타내 볼까요? 월마다 어획량만큼의 높이에 점을 찍어 보세요. 이웃한 점은 저절로 선분으로 이어져요.", hints: ["세로 눈금 한 칸은 100 t이에요. 700 t은 7칸이에요.", "점을 누른 뒤 ▲ ▼ 단추로 한 칸씩 고칠 수 있어요."],
      render: (b, a) => l5Build(b, a, { g: L5G.fish, table: true, ok: "점을 찍고 선분으로 이으니 갈치 어획량이 오르내리는 모습이 한눈에 보여요!" }) },
    { name: "두 그래프 견주기", inst: "힘찬시의 월별 갈치 어획량을 두 그래프로 나타냈어요. 두 그래프를 비교해 보세요.", hints: ["㈎는 막대의 길이로, ㈏는 점과 선분으로 나타냈어요.", "선분이 기울어진 정도를 보면 늘었는지 줄었는지 바로 보여요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Figs([{ lead: "㈎", g: L5V(L5G.fish, { kind: "bar" }) }, { lead: "㈏", g: L5G.fish }]), q: "두 그래프의 가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 월, 세로: 어획량", "가로: 어획량, 세로: 월"], a: 0 },
        { q: "두 그래프는 월별 갈치 어획량을 각각 어떻게 나타냈나요?", t: "pick", o: ["㈎는 막대로, ㈏는 점을 찍고 선분으로 이어서 나타냈어요", "㈎는 선분으로, ㈏는 막대로 나타냈어요", "두 그래프 모두 그림으로 나타냈어요"], a: 0 },
        { q: "두 그래프에서 어획량의 변화를 각각 어떻게 알 수 있나요?", t: "pick", o: ["㈎는 막대의 길이를 견주어, ㈏는 선이 어느 쪽으로 얼마나 기울어졌는지 보고 알아요", "두 그래프 모두 제목을 보고 알아요"], a: 0 },
        { q: "월별 갈치 어획량의 변화를 한눈에 알아보기 쉬운 그래프는 어느 것인가요?", t: "pick", o: ["㈎", "㈏"], a: 1, why: { "0": "㈎는 막대 하나하나의 크기를 견주기 좋아요. 변화의 모습이 선으로 보이는 그래프는 어느 것일까요?" } },
        { q: "그렇게 생각한 까닭은 무엇인가요?", t: "pick", o: ["선이 기울어진 정도를 보면 어획량의 변화가 더 잘 보이기 때문이에요", "막대가 더 굵어서 잘 보이기 때문이에요"], a: 0 }],
        { ok: "㈏처럼 점을 선분으로 이으면 선이 기울어진 정도로 변화를 한눈에 알 수 있어요." }) },
    { name: "약속하기", inst: "약속을 완성해요.", hints: ["㈏ 그래프는 점을 찍고 선분으로 이었어요."],
      render: (b, a) => blanks(b, a, ["1의 ㈏ 그래프와 같이 연속적으로 변화하는 양을 ", { o: ["점", "그림"], a: 0 }, "으로 표시하고, 그 점들을 ", { o: ["선분", "그림"], a: 0 }, "으로 이어 그린 그래프를 ", { o: ["꺾은선그래프", "막대그래프", "그림그래프"], a: 0 }, "라고 해요."]) },
    { name: "말해 보기", inst: "어느 식물의 키를 조사하여 나타낸 꺾은선그래프예요. 꺾은선그래프를 살펴보고 답해 보세요.", hints: ["0과 5 사이에 눈금이 5칸 있어요.", "9월은 8월과 10월 사이예요. 8월 13 cm와 10월 17 cm를 이은 선분 위에서 가운데쯤이에요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5G.plant), q: "가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 월, 세로: 식물의 키", "가로: 식물의 키, 세로: 월"], a: 0 },
        { q: "세로 눈금 한 칸은 몇 cm를 나타내나요?", t: "num", a: 1, unit: "cm", why: { "5": "0과 5 사이에 눈금이 5칸 있어요. 5칸이 5 cm이면 한 칸은 몇 cm일까요?" } },
        { q: "꺾은선은 무엇을 나타내나요?", t: "pick", o: ["식물의 키의 변화", "식물의 잎의 수", "달마다 내린 비의 양"], a: 0 },
        l5BetweenQ({ g: L5G.plant, at: 3.5, label: "9월", ans: 15, q: "조사하지 않은 9월의 식물의 키를 어림해 보세요. 9월 자리에 점을 찍고 키를 써요.", why: { "13": "13 cm는 8월의 키예요. 9월에는 조금 더 자랐을 거예요.", "17": "17 cm는 10월의 키예요." } }),
        { q: "꺾은선그래프로 나타내면 어떤 점이 편리한가요?", t: "pick", o: ["조사하지 않은 때의 값도 두 점 사이의 선분을 보고 어림할 수 있어요", "항목별 수량이 정확한 수로 쓰여 있어요"], a: 0 }],
        { ok: "9월의 키는 8월(13 cm)과 10월(17 cm)의 가운데쯤인 약 15 cm로 어림할 수 있어요. 꺾은선그래프는 두 점 사이에서 일정하게 변한다고 생각하고 어림해요." }) },
    { name: "확인하기", inst: "꺾은선그래프와 막대그래프 중 나타내기에 더 알맞은 그래프는 무엇일까요? 카드를 알맞은 상자에 넣어 보세요.", hints: ["하나의 대상이 시간에 따라 변하는 모습은 꺾은선그래프가 알맞아요.", "한 때에 여러 대상을 서로 견줄 때는 막대그래프가 알맞아요."],
      render: (b, a) => l5Sort(b, a, { bins: ["꺾은선그래프가 알맞아요", "막대그래프가 알맞아요"], cards: [
        { t: "월별 해수면 높이의 변화", b: 0, why: "해수면 높이는 시간에 따라 이어서 변해요. 변화를 보기 좋은 그래프를 골라요." },
        { t: "지역별 농업 가구 수", b: 1, why: "같은 때 여러 지역의 농업 가구 수를 견주는 자료예요." },
        { t: "하루 동안 시각별 운동장의 기온", b: 0, why: "기온은 시각에 따라 이어서 변해요." },
        { t: "우리 반 학생들이 좋아하는 과일", b: 1, why: "과일끼리 학생 수를 견주는 자료예요. 시간에 따라 변하는 자료가 아니에요." },
        { t: "연도별 우리 학교 학생 수의 변화", b: 0, why: "학생 수가 해마다 어떻게 변하는지 보는 자료예요." },
        { t: "반별로 모은 헌 종이의 무게", b: 1, why: "같은 때 반끼리 무게를 견주는 자료예요." }],
        ok: "꺾은선그래프는 하나의 대상이 시간에 따라 변하는 모습을, 막대그래프는 여러 대상의 크기를 견주기에 알맞아요. 어느 하나가 늘 더 좋은 것은 아니에요." }) }
  ],
  challenge: { inst: "익힘책 문제예요. 어느 지역의 강수량 그래프와 교실의 기온 그래프를 보고 답해 보세요.", hints: ["꺾은선그래프는 두 점 사이의 값도 어림할 수 있어요.", "교실의 기온 그래프에서 0과 5 사이는 5칸이에요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Figs([{ lead: "막대그래프", g: L5V(L5G.rain, { kind: "bar" }) }, { lead: "꺾은선그래프", g: L5G.rain }]), q: "강수량의 변화를 한눈에 알아보기 쉬운 그래프는 무엇인가요?", t: "pick", o: ["막대그래프", "꺾은선그래프"], a: 1 },
      { q: "6월의 강수량을 예상할 때 더 편리한 그래프는 □ 그래프예요. □ 안에 알맞은 말은?", t: "pick", o: ["막대", "꺾은선"], a: 1, why: { "0": "6월은 조사하지 않았어요. 5월과 7월의 점을 이은 선분을 보고 어림할 수 있는 그래프는?" } },
      { fig: () => l5Fig(L5G.room, { tip: false }), q: "교실의 기온 그래프에서 가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 시각, 세로: 기온", "가로: 기온, 세로: 시각"], a: 0 },
      { q: "세로 눈금 한 칸은 몇 ℃를 나타내나요?", t: "num", a: 1, unit: "℃", why: { "5": "0과 5 사이가 5칸이에요. 한 칸은 5 ℃가 아니에요." } },
      { q: "꺾은선은 무엇을 나타내나요?", t: "pick", o: ["교실의 기온 변화", "교실의 학생 수", "하루의 길이"], a: 0 }],
      { ok: "꺾은선그래프에서 가로·세로, 눈금 한 칸, 꺾은선이 나타내는 것을 정확히 알았어요!" }) }
},
{
  id: "l3", no: 3, title: "꺾은선그래프의 내용을 알아볼까요", soop: "개념 구축하기(O)",
  question: "꺾은선그래프를 보고 어떤 내용을 알 수 있을까요?",
  summary: "선분이 오른쪽 위로 올라가면 늘어난 것이고, 오른쪽 아래로 내려가면 줄어든 것이에요. 많이 기울어질수록 변화가 커요. 물결선(≈)은 필요 없는 부분을 생략할 때 쓰고, 물결선을 쓰면 세로 눈금 한 칸을 작게 할 수 있어 변화가 뚜렷하게 보여요.",
  steps: [
    { name: "만져 보기", inst: "수아는 겨울이 무척 춥다고 했어요. 한결이는 힘찬시의 연도별 눈 온 날수를 꺾은선그래프로 나타냈어요. 선분마다 눈 온 날수가 늘었는지 줄었는지 표시해 보세요.", hints: ["선분이 오른쪽 위로 올라가면 늘어남이에요.", "2021년부터는 선분이 오른쪽 아래로 내려가요."],
      render: (b, a) => l5Ask(b, a, [l5TrendQ({ g: L5G.snow, q: "선분을 눌러 늘어남·줄어듦·그대로를 표시해요." })],
        { ok: "2019년부터 2021년까지는 선이 오른쪽 위로 올라가서 날수가 많아졌고, 2021년부터 2023년까지는 오른쪽 아래로 내려가서 적어졌어요." }) },
    { name: "그려 보기", inst: "‘연도별 눈 온 날수’ 그래프를 보고 내용을 알아봐요.", hints: ["세로 눈금 5칸이 5일이에요.", "전년과 비교하여 가장 많이 늘어난 때는 오른쪽 위로 가장 많이 올라간 선분의 끝이에요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5G.snow), q: "세로 눈금 한 칸은 며칠을 나타내나요?", t: "num", a: 1, unit: "일", why: { "5": "0과 5 사이가 5칸이에요. 5칸이 5일이에요." } },
        l5PointQ({ g: L5G.snow, mode: "max", q: "눈 온 날수가 가장 많은 해의 점을 눌러 보세요." }),
        { q: "2022년에는 2021년보다 눈 온 날수가 며칠 더 적어졌나요?", t: "num", a: 1, unit: "일", why: { "10": "10일은 2022년의 날수예요. 2021년과의 차이를 구해요.", "11": "11일은 2021년의 날수예요." } },
        l5SegQ({ g: L5G.snow, mode: "inc", q: "전년과 비교하여 눈 온 날수가 가장 많이 늘어난 때를 찾아 그 선분을 눌러 보세요." })],
        { ok: "2021년에 눈 온 날수가 가장 많았고(11일), 2020년과 2021년 사이 선분이 오른쪽 위로 가장 많이 올라가서 2021년에 가장 많이 늘어났어요." }) },
    { name: "말해 보기", inst: "어느 지역의 연도별 다문화 가구 수를 조사하여 두 꺾은선그래프로 나타냈어요. 두 그래프를 견주어 보세요.", hints: ["㈏에는 0과 130 사이에 물결 모양의 선이 있어요.", "㈎는 0과 50 사이가 5칸, ㈏는 130과 140 사이가 5칸이에요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Figs([{ lead: "㈎", g: L5G.multiA }, { lead: "㈏", g: L5V(L5G.multiA, { step: 2, lo: 130, cells: 10, major: 10 }) }]), q: "두 그래프의 다른 점을 모두 고르세요.", t: "pick", o: ["㈏에는 물결 모양의 선이 그려져 있어요", "세로 눈금 한 칸의 크기가 달라요", "조사한 자료가 달라요", "가로에 나타낸 것이 달라요"], a: [0, 1], why: { "0,1,2": "두 그래프는 같은 자료를 나타냈어요.", "0,1,3": "두 그래프 모두 가로에 연도를 나타냈어요." } },
        { q: "물결선(≈)은 일부분을 생략할 때 사용해요. ㈏에서 물결선은 몇 가구와 몇 가구 사이를 생략했나요?", t: "pick", o: ["0가구와 130가구 사이", "130가구와 150가구 사이", "0가구와 50가구 사이"], a: 0 },
        { q: "㈎의 세로 눈금 한 칸은 몇 가구인가요?", t: "num", a: 10, unit: "가구", why: { "50": "0과 50 사이가 5칸이에요. 한 칸은 몇 가구일까요?", "2": "2가구는 ㈏의 눈금 한 칸이에요." } },
        { q: "㈏의 세로 눈금 한 칸은 몇 가구인가요?", t: "num", a: 2, unit: "가구", why: { "10": "130과 140 사이가 5칸이에요. 10가구를 5칸으로 나누면?", "1": "130과 140 사이의 칸 수를 다시 세어 봐요." } },
        { q: "다문화 가구 수의 변화를 뚜렷하게 알 수 있는 그래프는 무엇인가요?", t: "pick", o: ["㈎", "㈏"], a: 1 }],
        { ok: "㈏는 물결선으로 0과 130 사이를 생략하고 눈금 한 칸을 2가구로 작게 해서 변화가 뚜렷하게 보여요. 자료의 값은 두 그래프가 똑같아요." }) },
    { name: "약속하기", inst: "물결선의 약속을 완성해요.", hints: ["물결선은 필요 없는 부분을 줄일 때 써요.", "물결선을 써도 자료의 값은 바뀌지 않아요."],
      render: (b, a) => blanks(b, a, ["물결선(≈)은 ", { o: ["일부분을 생략할", "값을 크게 할"], a: 0 }, " 때 사용해요. 물결선을 사용하면 세로 눈금 한 칸의 크기를 ", { o: ["작게", "크게"], a: 0 }, " 할 수 있어서 변화가 ", { o: ["뚜렷하게", "흐리게"], a: 0 }, " 보여요. 하지만 자료의 값은 ", { o: ["변하지 않아요", "커져요"], a: 0 }, "."]) },
    { name: "확인하기", inst: "㈏ 꺾은선그래프를 보고 더 알 수 있는 내용으로 친구들과 묻고 답해요. “전년과 비교하여 다문화 가구 수가 가장 많이 늘어난 때는 몇 년일까?”", hints: ["오른쪽 위로 가장 많이 올라간 선분을 찾아요.", "줄어든 때는 선분이 오른쪽 아래로 내려가요."],
      render: (b, a) => l5Ask(b, a, [
        l5SegQ({ g: L5V(L5G.multiA, { step: 2, lo: 130, cells: 10, major: 10 }), mode: "inc", q: "전년과 비교하여 다문화 가구 수가 가장 많이 늘어난 때의 선분을 눌러 보세요." }),
        { q: "전년과 비교하여 다문화 가구 수가 줄어든 때는 몇 년인가요?", t: "pick", o: ["2020년", "2021년", "2022년", "2023년"], a: 1 },
        { q: "다문화 가구 수가 가장 많은 때는 몇 년인가요?", t: "pick", o: ["2019년", "2020년", "2022년", "2023년"], a: 3 },
        { q: "2023년의 다문화 가구 수는 몇 가구인가요?", t: "num", a: 144, unit: "가구", why: { "142": "130에서 눈금 몇 칸 위인지 다시 세어 봐요. 한 칸은 2가구예요." } }],
        { ok: "2019년과 2020년 사이 선분이 가장 많이 올라가서 2020년에 가장 많이 늘었어요. 2021년에는 줄었고, 2023년에 144가구로 가장 많아요." }) }
  ],
  challenge: { inst: "익힘책 문제예요. 두 꺾은선그래프를 보고 답해 보세요.", hints: ["식물의 키는 매월 1일에 조사했어요.", "7살 7월은 7살 1월과 8살 1월의 가운데쯤이에요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Fig(L5G.plant2, { cap: "매월 1일에 식물의 키를 조사했어요." }), q: "5월의 식물의 키는 몇 cm인가요?", t: "num", a: 9, unit: "cm" },
      { q: "7월에는 6월보다 몇 cm 더 자랐나요?", t: "num", a: 2, unit: "cm", why: { "14": "14 cm는 7월의 키예요. 6월의 키와의 차이를 구해요." } },
      { q: "잘못 설명한 것을 고르세요.", t: "pick", o: ["㉠ 시간이 지남에 따라 식물의 키가 자랐어요.", "㉡ 전월과 비교하여 식물의 키가 가장 적게 자란 때는 7월이에요."], a: 1, why: { "0": "선이 계속 오른쪽 위로 올라가니 키가 자란 것이 맞아요. 가장 덜 기울어진 선분을 찾아봐요." } },
      { fig: () => l5Fig(L5G.yoon, { tip: false, cap: "매년 1월에 윤재의 몸무게를 쟀어요." }), q: "9살과 10살 사이에 윤재의 몸무게는 몇 kg 늘었나요?", t: "num", a: 8, unit: "kg" },
      l5BetweenQ({ g: L5G.yoon, at: .5, label: "7살 7월", ans: 24, q: "7살 7월에 윤재의 몸무게는 약 몇 kg이었을까요? 점을 찍고 써 보세요.", why: { "22": "22 kg은 7살 1월의 몸무게예요.", "26": "26 kg은 8살 1월의 몸무게예요." } })],
      { ok: "4월(1 cm)에 가장 적게 자랐으니 ㉡이 잘못이에요. 7살 7월은 22 kg과 26 kg의 가운데쯤인 약 24 kg이에요." }) }
},
{
  id: "l4", no: 4, title: "꺾은선그래프로 나타내는 방법을 알아볼까요", soop: "개념 구축하기(O)",
  question: "표를 보고 꺾은선그래프로 나타내려면 어떻게 해야 할까요?",
  summary: "꺾은선그래프로 나타낼 때는 ① 가로와 세로에 무엇을 나타낼지 정하고 ② 물결선을 넣는다면 몇과 몇 사이에 넣을지 정해 그리고 ③ 가장 큰 수를 나타낼 수 있도록 눈금 한 칸의 크기를 정한 뒤 ④ 가로 눈금과 세로 눈금이 만나는 자리에 점을 찍고 선분으로 이은 다음 ⑤ 알맞은 제목을 써요.",
  steps: [
    { name: "만져 보기", inst: "한결이는 수아의 편지를 읽고 우리 학교의 연도별 학급 수를 조사했어요. 가로와 세로에 무엇을 나타낼지, 세로 눈금 한 칸의 크기, 제목을 정하고 점을 찍어 꺾은선그래프로 나타내 보세요.", hints: ["시간의 흐름(연도)은 가로에, 변하는 양(학급 수)은 세로에 나타내요.", "가장 작은 수 15와 가장 큰 수 21을 모두 나타낼 수 있게 한 칸의 크기를 정해요. 세로 눈금은 22칸이에요."],
      render: (b, a) => l5Build(b, a, { g: L5G.cls, table: true, axisPick: true, stepChoices: [1, 2, 5], titleChoices: ["좋아하는 학교 행사", "연도별 한결이네 학교의 학급 수", "한결이네 반 학생 수"], ok: "가로에 연도, 세로에 학급 수를 나타내고 한 칸을 1학급으로 정했어요. 2005년과 2010년은 학급 수가 같아서 선분이 평평해요." }) },
    { name: "그려 보기", inst: "어느 높이뛰기 선수의 월별 최고 기록이에요. 물결선이 있는 꺾은선그래프로 나타내 보세요. “높이뛰기 기록 중 가장 낮은 기록은 몇 cm지?” 세로 눈금은 10칸이에요.", hints: ["가장 낮은 기록은 224 cm예요. 0 cm와 220 cm 사이에는 자료의 값이 없어요.", "220 cm부터 240 cm까지 10칸으로 나타내려면 한 칸은 몇 cm일까요?"],
      render: (b, a) => l5Build(b, a, { g: L5G.jump, table: true, waveChoices: [0, 200, 220, 230], stepChoices: [1, 2, 5], ok: "물결선을 0 cm와 220 cm 사이에 넣고 세로 눈금 한 칸을 2 cm로 정했어요. 기록의 변화가 뚜렷하게 보여요!" }),
      easy: (b, a) => l5Build(b, a, { g: L5G.pencil, table: true, stepChoices: [1, 2, 5], ok: "가장 큰 수 18 cm까지 10칸에 나타내려고 한 칸을 2 cm로 정했어요." }) },
    { name: "말해 보기", inst: "꺾은선그래프로 나타낼 때 생각해야 할 점이에요. 카드를 알맞은 보기 상자에 넣어 보세요.", hints: ["물결선은 자료의 값이 없는 부분을 생략할 때 넣어요.", "세로 눈금 한 칸의 크기는 가장 큰 수까지 나타낼 수 있게 정해요."],
      render: (b, a) => l5Sort(b, a, { bins: ["가로와 세로", "물결선", "세로 눈금 한 칸의 크기", "제목"], cards: [
        { t: "가로에는 연도를, 세로에는 학급 수를 나타내요.", b: 0 },
        { t: "자료의 값이 없는 0 cm와 220 cm 사이를 생략할 수 있어요.", b: 1 },
        { t: "가장 큰 수 240 cm까지 나타낼 수 있게 정해요.", b: 2 },
        { t: "무엇을 조사한 그래프인지 알 수 있게 붙여요.", b: 3 },
        { t: "변하는 양이 무엇인지 생각해서 세로에 나타내요.", b: 0 },
        { t: "가장 작은 수보다 위까지 생략하면 안 돼요.", b: 1 }],
        ok: "가로와 세로, 물결선, 세로 눈금 한 칸의 크기, 제목을 생각하며 그리면 알맞은 꺾은선그래프가 돼요." }) },
    { name: "약속하기", inst: "꺾은선그래프로 나타내는 방법을 정리해요. 하는 차례대로 눌러 보세요.", hints: ["가장 먼저 가로와 세로에 무엇을 나타낼지 정해요.", "점을 찍기 전에 물결선과 눈금 한 칸의 크기를 정해요. (제목은 먼저 써도 돼요.)"],
      render: (b, a) => sequence(b, a, ["가장 큰 수를 나타낼 수 있도록 눈금 한 칸의 크기 정하기", "알맞은 제목 쓰기", "가로와 세로에 무엇을 나타낼지 정하기", "점을 찍고 점들을 선분으로 잇기", "물결선을 넣을 곳을 정하고 물결선 그리기"], [2, 4, 0, 3, 1],
        { ok: "① 가로와 세로 정하기 ② 물결선 그리기 ③ 눈금 한 칸의 크기 정하기 ④ 점 찍고 선분으로 잇기 ⑤ 제목 쓰기예요. 제목은 먼저 써도 돼요." }) },
    { name: "확인하기", inst: "연도별 경상남도 문화 시설 수(출처: 국가통계포털, 2023)를 물결선이 있는 꺾은선그래프로 나타내 보세요. 세로 눈금은 15칸이에요.", hints: ["가장 작은 수는 76개, 가장 큰 수는 88개예요.", "물결선 위 첫 눈금을 75개로 하면 한 칸이 몇 개일 때 88개까지 나타낼 수 있을까요?"],
      render: (b, a) => l5Build(b, a, { g: L5G.culture, table: true, waveChoices: [0, 70, 75, 80], stepChoices: [1, 2, 5], ok: "0과 75개 사이에 물결선을 넣고 한 칸을 1개로 정했어요. 문화 시설 수가 해마다 늘어났어요." }) }
  ],
  challenge: { inst: "익힘책 문제예요. 연도별 출생아 수를 물결선이 있는 꺾은선그래프로 나타내 보세요. 세로 눈금은 10칸이에요.", hints: ["가장 작은 수는 260명, 가장 큰 수는 330명이에요.", "물결선을 0명과 250명 사이에 넣으면 250명부터 10칸으로 330명까지 나타내야 해요."],
    render: (b, a) => l5Build(b, a, { g: L5G.birth, table: true, waveChoices: [0, 200, 250, 300], stepChoices: [5, 10, 50], ok: "물결선을 0명과 250명 사이에 넣고 한 칸을 10명으로 정했어요. 출생아 수가 해마다 줄어들었어요." }) }
},
{
  id: "l5", no: "5~6", title: "자료를 조사하여 꺾은선그래프로 나타내어 볼까요", soop: "탐구 정리하기(O)",
  question: "우리 모둠이 정한 지역의 연도별 폭염일수를 조사하여 어떻게 나타낼까요?",
  summary: "폭염일수는 하루 최고 기온이 33 ℃보다 높거나 같은 날의 수예요. 누리집에서 자료를 조사해 표로 정리하고, 가로·세로, 물결선, 세로 눈금 한 칸의 크기, 제목을 정해 꺾은선그래프로 나타내면 해마다의 변화를 한눈에 알 수 있어요.",
  steps: [
    { name: "폭염일 알기", inst: "수아는 소망시가 여름에 매우 더워서 폭염일수가 많다고 했어요. 폭염일수는 하루 최고 기온이 33 ℃보다 높거나 같은 날의 수예요. 어느 지역의 열흘 동안의 하루 최고 기온을 보고 폭염일을 모두 골라 보세요.", hints: ["빨간 점선(33 ℃)에 닿거나 그보다 높은 온도계를 골라요.", "33.0 ℃인 날도 폭염일이에요. ‘높거나 같은’ 날이니까요."],
      render: (b, a) => l5Hot(b, a, { title: "어느 지역의 7월 1일~10일 하루 최고 기온(℃)", days: [31.2, 33.0, 34.5, 32.9, 35.1, 33.4, 30.8, 32.0, 36.2, 33.0].map((t, i) => ({ d: `${i + 1}일`, t })), ok: "33 ℃보다 높거나 같은 날은 6일이에요. 32.9 ℃인 날은 33 ℃보다 낮아서 폭염일이 아니에요." }) },
    { name: "자료 조사하기", inst: "기상자료개방포털(https://data.kma.go.kr/)의 기후통계분석 → 기상현상일수에서 ‘폭염일수’를 누르고, 연도 5개(2018년~2022년)와 지역을 골라 검색했어요. 검색 결과를 보고 표를 완성해 보세요.", hints: ["한 해 동안의 폭염일수는 맨 오른쪽 ‘연합계’ 칸에 있어요.", "2018년의 연합계는 40일이에요."],
      render: (b, a) => l5Portal(b, a, { g: L5G.heat, head: "폭염일수 검색 결과(우리 모둠이 조사한 지역)", months: ["5월", "6월", "7월", "8월", "9월"],
        rows: [{ y: "2018", m: [0, 3, 20, 17, 0] }, { y: "2019", m: [0, 2, 10, 15, 2] }, { y: "2020", m: [0, 7, 5, 19, 0] }, { y: "2021", m: [0, 1, 15, 7, 0] }, { y: "2022", m: [1, 9, 21, 14, 0] }],
        ok: "연합계 칸을 보고 연도별 폭염일수 표를 완성했어요." }) },
    { name: "그래프로 나타내기", inst: "조사한 표를 꺾은선그래프로 나타내 보세요. 물결선이 필요한지, 세로 눈금 한 칸을 며칠로 할지 정해요. 세로 눈금은 30칸이에요.", hints: ["모든 연도에서 폭염일수가 20일보다 많아요. 0일부터 20일까지는 물결선으로 생략할 수 있어요.", "29일, 31일, 23일처럼 홀수도 있어요. 모든 수가 눈금에 꼭 맞는 한 칸의 크기를 골라요."],
      render: (b, a) => l5Build(b, a, { g: L5G.heat, table: true, waveChoices: [0, 20, 30], stepChoices: [1, 2, 5], ok: "0일과 20일 사이에 물결선을 넣고 한 칸을 1일로 정했어요. 폭염일수가 해마다 어떻게 변했는지 잘 보여요!" }),
      easy: (b, a) => l5Build(b, a, { g: L5G.hang, table: true, ok: "회차마다 매달린 시간만큼 점을 찍었어요. 기록이 계속 늘어났어요!" }) },
    { name: "공학 도구로 나타내기", inst: "EBSMath 이지통계처럼 표에 수를 넣으면 그래프가 바로 그려지는 도구예요. 표의 제목과 내용을 넣고, 간격(눈금 한 칸)과 물결선을 바꾸어 가며 그래프가 어떻게 달라지는지 살펴보세요.", hints: ["연도별 폭염일수는 40, 29, 31, 23, 45일이에요.", "간격을 1로 두고 물결선을 넣었다 뺐다 해 봐요. 무엇이 달라지나요?"],
      render: (b, a) => l5Tool(b, a, { g: L5G.heat, ok: "간격이 작을수록, 물결선을 넣을수록 변화가 뚜렷하게 보여요. 하지만 자료의 값은 그대로예요." }) },
    { name: "알 수 있는 내용 말하기", inst: "완성한 꺾은선그래프를 보고 알 수 있는 내용을 이야기해요. (체크리스트: 주제를 정했나요? 표로 정리했나요? 가로·세로, 눈금 한 칸, 물결선, 제목을 정했나요? 점을 찍고 선분으로 이었나요?)", hints: ["선분이 오른쪽 위로 가장 많이 올라간 곳이 가장 많이 늘어난 때예요.", "점이 가장 높이 찍힌 해가 폭염일수가 가장 많은 해예요."],
      render: (b, a) => l5Ask(b, a, [
        l5SegQ({ g: L5G.heat, mode: "inc", q: "“우리 모둠이 조사한 지역의 폭염일수를 전년과 비교했을 때 가장 많이 늘어난 때는 ○○년이야.” 그 선분을 눌러 보세요." }),
        l5SegQ({ g: L5G.heat, mode: "dec", q: "전년과 비교했을 때 폭염일수가 가장 많이 줄어든 때의 선분을 눌러 보세요." }),
        { q: "폭염일수가 가장 많았던 때는 몇 년인가요?", t: "pick", o: ["2018년", "2019년", "2021년", "2022년"], a: 3, why: { "0": "2018년은 40일이에요. 이보다 더 높이 찍힌 점이 있어요." } },
        { fig: () => l5Fig(L5G.regions, { tip: false, cap: "두 모둠이 조사한 지역을 한 그래프에 나타냈어요. 꺾은선그래프 하나에 두 가지 변화를 함께 나타낼 수도 있어요." }), q: "2021년에 폭염일수가 더 많은 지역은 어느 곳인가요?", t: "pick", o: ["우리 모둠 지역", "다른 모둠 지역"], a: 0 }],
        { ok: "2022년에 22일 늘어 가장 많이 늘었고(45일로 가장 많음), 2019년에 11일 줄어 가장 많이 줄었어요." }) }
  ],
  challenge: { inst: "익힘책 문제예요. 30초 줄넘기 기록을 물결선이 있는 꺾은선그래프로 나타내 보세요. 세로 눈금은 10칸이에요.", hints: ["가장 작은 기록은 33개예요. 0개와 30개 사이에는 자료의 값이 없어요.", "30개부터 10칸으로 38개까지 나타내려면 한 칸은 몇 개일까요?"],
    render: (b, a) => l5Build(b, a, { g: L5G.rope, table: true, waveChoices: [0, 30, 35], stepChoices: [1, 2, 5], ok: "0개와 30개 사이를 물결선으로 생략하고 한 칸을 1개로 정했어요. 2회에 줄었다가 다시 늘었어요." }) }
},
{
  id: "l7", no: 7, title: "꺾은선그래프를 생활에 활용해 볼까요", soop: "탐구 정리하기(O)",
  question: "꺾은선그래프를 해석하여 앞으로의 변화를 어떻게 예상할 수 있을까요?",
  summary: "꺾은선그래프에서 변화의 흐름을 보면 앞으로의 자료를 예상할 수 있어요. 하지만 예상이 언제나 맞는 것은 아니에요. 두 그래프를 함께 보면 두 자료가 어떤 관계가 있는지도 알 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "수아가 사는 곳에는 예쁜 공원이 많아요. 한결이는 힘찬시의 연도별 공원 수를 알아보았어요. 선분마다 공원 수가 늘었는지 줄었는지 표시해 보세요.", hints: ["물결선 위 270개부터 눈금이 시작해요.", "2019년과 2020년 사이 선분은 오른쪽 아래로 내려가요."],
      render: (b, a) => l5Ask(b, a, [l5TrendQ({ g: L5G.park, q: "선분을 눌러 늘어남·줄어듦·그대로를 표시해요." })],
        { ok: "2019년부터 2020년까지는 줄어들었고, 2020년부터 2023년까지는 계속 늘어났어요." }) },
    { name: "예상하기", inst: "‘연도별 공원 수’ 그래프를 보고 2024년의 공원 수를 예상해 보세요.", hints: ["오른쪽 위로 가장 많이 올라간 선분을 찾아요.", "2020년부터 2023년까지 계속 늘어났어요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5G.park), q: "무엇을 조사하여 나타낸 꺾은선그래프인가요?", t: "pick", o: ["힘찬시에 있는 연도별 공원 수", "힘찬시의 연도별 눈 온 날수", "소망시의 연도별 공원 수"], a: 0 },
        l5SegQ({ g: L5G.park, mode: "inc", q: "전년과 비교하여 공원 수가 가장 많이 늘어난 때의 선분을 눌러 보세요." }),
        { q: "2024년의 공원 수는 어떻게 될까요?", t: "pick", o: ["늘어날 것 같아요", "줄어들 것 같아요"], a: 0 },
        { q: "그렇게 예상한 까닭은 무엇인가요?", t: "pick", o: ["2020년부터 2023년까지 공원 수가 계속 늘어났기 때문이에요", "2019년부터 2020년까지 줄어들었기 때문이에요"], a: 0 }],
        { ok: "2022년에 가장 많이 늘었어요. 계속 늘어난 흐름을 보면 2024년에도 늘어날 것 같다고 예상할 수 있어요. 하지만 예상이 꼭 맞는 것은 아니에요." }) },
    { name: "두 그래프 견주기", inst: "우리나라의 공영 자전거 대여 횟수와 공영 자전거 수를 조사하여 나타낸 꺾은선그래프예요(출처: 국가통계포털, 2022). 두 그래프를 함께 살펴보세요.", hints: ["두 그래프 모두 선이 오른쪽 위로 올라가요.", "대여 횟수가 늘어날 때 자전거 수는 어떻게 되었나요?"],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Figs([{ g: L5G.bikeUse }, { g: L5G.bikeN }]), q: "공영 자전거 대여 횟수는 어떻게 변했나요?", t: "pick", o: ["계속 늘어났어요", "계속 줄어들었어요", "늘었다가 줄었어요"], a: 0 },
        { q: "공영 자전거 수는 어떻게 변했나요?", t: "pick", o: ["계속 늘어났어요", "계속 줄어들었어요", "변하지 않았어요"], a: 0 },
        { q: "두 자료는 어떤 관계가 있다고 말할 수 있나요?", t: "pick", o: ["공영 자전거 대여 횟수가 늘어남에 따라 공영 자전거 수도 늘어나요", "공영 자전거 대여 횟수가 늘어남에 따라 공영 자전거 수는 줄어들어요", "두 자료는 아무 관계가 없어요"], a: 0 },
        { q: "‘연도별 공영 자전거 수’ 그래프의 세로 눈금 한 칸은 몇 대인가요?", t: "num", a: 2000, unit: "대", why: { "10000": "40000과 50000 사이가 5칸이에요. 한 칸은 몇 대일까요?" } }],
        { ok: "두 그래프 모두 계속 늘어났어요. 대여 횟수가 늘어남에 따라 자전거 수도 늘어났다고 말할 수 있어요." }) },
    { name: "약속하기", inst: "꺾은선그래프를 생활에 활용하는 방법을 정리해요.", hints: ["변화의 흐름으로 앞으로를 예상할 수 있어요.", "예상은 항상 맞는 것은 아니에요."],
      render: (b, a) => blanks(b, a, ["꺾은선그래프에서 선이 오른쪽 위로 올라가면 자료가 ", { o: ["늘어난", "줄어든"], a: 0 }, " 것이고, 오른쪽 아래로 내려가면 ", { o: ["줄어든", "늘어난"], a: 0 }, " 것이에요. 변화의 흐름을 보면 앞으로의 자료를 ", { o: ["예상할", "정확히 알"], a: 0 }, " 수 있지만, 그 예상이 ", { o: ["항상 맞는 것은 아니에요", "항상 맞아요"], a: 0 }, "."]) },
    { name: "확인하기", inst: "통계놀이터 누리집에서 찾은 꺾은선그래프들이에요. 알 수 있는 내용 카드를 알맞은 그래프 상자에 넣어 보세요.", hints: ["선이 계속 오른쪽 아래로 내려가는 그래프와 계속 오른쪽 위로 올라가는 그래프를 찾아요.", "오후 1시의 점이 가장 높은 그래프는 교실의 기온 그래프예요."],
      render: (b, a) => l5Sort(b, a, { bins: [{ t: "연도별 출생아 수", fig: () => l5Mini(L5G.birth) }, { t: "연도별 복숭아 수확량", fig: () => l5Mini(L5G.peach) }, { t: "시각별 교실의 기온", fig: () => l5Mini(L5G.room) }], cards: [
        { t: "시간이 지남에 따라 계속 줄어들었어요.", b: 0 }, { t: "시간이 지남에 따라 계속 늘어났어요.", b: 1 },
        { t: "늘어나다가 마지막에 조금 줄어들었어요.", b: 2 }, { t: "2023년은 2020년보다 70명 적어요.", b: 0 },
        { t: "가장 높은 때는 오후 1시예요.", b: 2 }, { t: "2023년에는 1900 kg이에요.", b: 1 }],
        ok: "꺾은선그래프를 보면 늘어나는지, 줄어드는지, 언제 가장 큰지 한눈에 알 수 있어요." }) }
  ],
  challenge: { inst: "익힘책 문제예요. 꺾은선그래프를 보고 답해 보세요.", hints: ["두 그래프 모두 선이 어느 쪽으로 기울었는지 봐요.", "미세먼지 ‘나쁨’인 날수도 늘어났어요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Fig(L5G.peach, { tip: false }), q: "시간이 지남에 따라 복숭아 수확량은 계속 (줄어들었어요, 늘어났어요). 알맞은 것은?", t: "pick", o: ["줄어들었어요", "늘어났어요"], a: 1 },
      { q: "2024년의 복숭아 수확량은 어떻게 될까요?", t: "pick", o: ["2019년부터 2023년까지 계속 늘어났으니 늘어날 것 같아요", "2019년부터 2023년까지 계속 늘어났으니 줄어들 것 같아요"], a: 0 },
      { fig: () => l5Figs([{ g: L5G.dust }, { g: L5G.mask }]), q: "옳게 설명한 것을 고르세요.", t: "pick", o: ["㉠ 시간이 지남에 따라 미세먼지가 ‘나쁨’인 날수는 줄어들었어요.", "㉡ 시간이 지남에 따라 마스크 판매량은 늘어났어요."], a: 1, why: { "0": "‘나쁨’인 날수 그래프도 선이 오른쪽 위로 올라가요." } },
      { q: "두 그래프는 어떤 관계가 있나요?", t: "pick", o: ["미세먼지가 ‘나쁨’인 날수가 늘어남에 따라 마스크 판매량도 늘어나요", "미세먼지가 ‘나쁨’인 날수가 늘어남에 따라 마스크 판매량은 줄어들어요"], a: 0 }],
      { ok: "두 그래프의 변화를 함께 보고 관계를 찾고, 앞으로를 예상했어요!" }) }
},
{
  id: "l8", no: 8, title: "생각을 더하다 ― 그래프에서 물건의 가격 변화를 알아볼까요?", soop: "탐구 정리하기(O)",
  question: "꺾은선그래프를 보고 물건의 가격이 어떻게 변할지 예상할 수 있을까요?",
  summary: "물건의 가격은 재료의 가격과 이동 비용 등에 따라 오르거나 내려가요. 가로·세로, 세로 눈금 한 칸, 물결선이 나타내는 것을 알고 두 꺾은선을 함께 보면 가격의 변화와 관계를 알고 앞으로의 가격을 예상할 수 있어요.",
  steps: [
    { name: "그래프 살펴보기", inst: "물건의 가격은 재료의 가격과 이동 비용 등에 따라 오르거나 내려갈 수 있어요. 최근 4년간 설탕과 케첩의 가격을 조사하여 나타낸 꺾은선그래프예요(출처: 소비자물가정보서비스, 2023).", hints: ["1500과 2000 사이가 5칸이에요.", "그래프 아래쪽 물결선은 0원과 1500원 사이를 생략한 것이에요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5G.sugar), q: "가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 연도, 세로: 가격", "가로: 가격, 세로: 연도"], a: 0 },
        { q: "세로 눈금 한 칸은 몇 원을 나타내나요?", t: "num", a: 100, unit: "원", why: { "500": "1500과 2000 사이가 5칸이에요. 500원을 5칸으로 나누면?", "5": "5는 칸 수예요." } },
        { q: "물결선은 무엇을 나타내나요?", t: "pick", o: ["0원과 1500원 사이를 생략했어요", "가격이 1500원만큼 떨어졌어요", "1500원과 2000원 사이를 생략했어요"], a: 0, why: { "1": "물결선은 그래프의 일부분을 생략한 표시예요. 값이 바뀐 것이 아니에요." } },
        { q: "2022년 설탕(1 kg)의 가격은 몇 원인가요?", t: "num", a: 2188, unit: "원" }],
        { ok: "가로는 연도, 세로는 가격, 세로 눈금 한 칸은 100원이에요. 물결선으로 0원과 1500원 사이를 생략했어요." }) },
    { name: "변화 표시하기", inst: "케첩(500 g)의 가격은 해마다 어떻게 변했을까요? 케첩 선의 선분마다 표시해 보세요.", hints: ["점 옆의 가격을 견주어 봐요.", "2019년 2255원, 2020년 2256원이에요. 아주 조금이라도 올랐을까요?"],
      render: (b, a) => l5Ask(b, a, [l5TrendQ({ g: L5G.sugar, si: 1, q: "‘케첩(500 g)’ 선의 선분마다 늘어남(오름)·줄어듦·그대로를 표시해요." })],
        { ok: "케첩의 가격은 2019년부터 계속 올랐어요. 2020년에는 1원만 올라서 선분이 거의 평평해요." }) },
    { name: "관계와 예상", inst: "두 꺾은선을 함께 보고 답해 보세요.", hints: ["두 선 모두 오른쪽 위로 올라가요.", "재료의 가격 말고도 이동 비용 같은 여러 가지가 물건의 가격에 영향을 줘요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5G.sugar, { tip: false }), q: "설탕과 케첩의 가격은 각각 어떻게 변했나요?", t: "pick", o: ["두 가지 모두 2019년부터 계속 올랐어요", "설탕은 오르고 케첩은 내렸어요", "두 가지 모두 계속 내렸어요"], a: 0 },
        { q: "두 가격은 어떤 관계가 있다고 말할 수 있나요?", t: "pick", o: ["설탕의 가격이 올라감에 따라 케첩의 가격도 올라가요", "설탕의 가격이 올라감에 따라 케첩의 가격은 내려가요"], a: 0 },
        { q: "2023년의 설탕과 케첩의 가격은 어떻게 될까요?", t: "pick", o: ["2019년부터 2022년까지 계속 올랐으니 2023년에도 오를 것 같아요", "2022년에 많이 올랐으니 2023년에는 반드시 내려가요"], a: 0 },
        { q: "“설탕의 가격이 오르면 케첩의 가격도 반드시 똑같이 오른다.”", t: "ox", a: false, why: { "o": "물건의 가격은 재료의 가격뿐 아니라 이동 비용 등 여러 가지에 따라 정해져요. 반드시 똑같이 오르지는 않아요." } }],
        { ok: "두 가격은 함께 올랐어요. 하지만 재료 가격과 물건 가격이 반드시 똑같이 변하는 것은 아니에요." }) },
    { name: "가장 많이 오른 때", inst: "설탕의 가격이 전년과 비교하여 가장 많이 오른 때를 찾아봐요.", hints: ["점 옆의 가격을 보고 해마다 오른 값을 구해 봐요.", "2021년에서 2022년으로 갈 때 선분이 가장 많이 기울었어요."],
      render: (b, a) => l5Ask(b, a, [
        l5SegQ({ g: L5G.sugar, si: 0, mode: "inc", q: "‘설탕(1 kg)’ 선에서 전년과 비교하여 가장 많이 오른 때의 선분을 눌러 보세요." }),
        { q: "그때 설탕의 가격은 전년보다 몇 원 올랐나요?", t: "num", a: 281, unit: "원", why: { "2188": "2188원은 2022년의 가격이에요. 2021년의 1907원과의 차이를 구해요." } }],
        { ok: "2022년에 1907원에서 2188원으로 281원 올라 가장 많이 올랐어요." }) },
    { name: "밀가루와 어묵", inst: "연도별 밀가루와 어묵의 가격 그래프예요(출처: 소비자물가정보서비스, 2023). 이야기를 나누어 보세요.", hints: ["두 선 모두 2021년에서 2022년으로 갈 때 가장 많이 올라가요.", "계속 오른 흐름을 보고 예상해요."],
      render: (b, a) => l5Ask(b, a, [
        l5SegQ({ g: L5G.flour, si: 0, mode: "inc", q: "‘밀가루(1 kg)’ 선에서 전년과 비교하여 가장 많이 오른 때의 선분을 눌러 보세요." }),
        l5SegQ({ g: L5G.flour, si: 1, mode: "inc", q: "‘어묵(300 g)’ 선에서 전년과 비교하여 가장 많이 오른 때의 선분을 눌러 보세요." }),
        { q: "밀가루와 어묵의 가격 변화로 알맞은 것은?", t: "pick", o: ["두 가지 모두 2019년부터 계속 올랐어요", "밀가루는 2020년에 내렸어요", "어묵은 2021년에 내렸어요"], a: 0 },
        { q: "2023년의 밀가루와 어묵의 가격은 어떻게 될까요?", t: "pick", o: ["둘 다 오를 것 같아요", "둘 다 내릴 것 같아요"], a: 0 }],
        { ok: "밀가루와 어묵의 가격은 2019년부터 계속 올랐고, 둘 다 2022년에 가장 많이 올랐어요. 2023년에도 오를 것 같다고 예상할 수 있어요." }) }
  ],
  challenge: { inst: "‘연도별 밀가루와 어묵의 가격’ 그래프를 보고 계산해 보세요.", hints: ["점 옆에 쓰인 가격을 읽어요.", "늘어난 값은 (나중 가격) − (처음 가격)이에요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Fig(L5G.flour, { tip: false }), q: "2022년 어묵의 가격은 2021년보다 몇 원 올랐나요?", t: "num", a: 232, unit: "원", why: { "2261": "2261원은 2022년 어묵의 가격이에요." } },
      { q: "밀가루의 가격은 2019년부터 2022년까지 모두 몇 원 올랐나요?", t: "num", a: 534, unit: "원", why: { "475": "475원은 2021년에서 2022년으로 오른 값이에요. 2019년부터 따져 봐요." } },
      { q: "2022년에 어묵(300 g)은 밀가루(1 kg)보다 몇 원 더 비싼가요?", t: "num", a: 304, unit: "원" }],
      { ok: "그래프의 값을 읽고 가격의 변화를 정확하게 계산했어요!" }) }
},
{
  id: "l9", no: 9, title: "놀이를 더하다 ― 너의 감정을 그래프로 나타내 봐!", soop: "발표하기(P)",
  question: "나의 감정은 한 해 동안 어떻게 변했을까요?",
  summary: "매월 가장 기억에 남는 일과 그때의 감정을 0점부터 100점까지의 점수로 나타내고, 월별 감정 점수를 꺾은선그래프로 나타내요. 친구의 그래프와 견주어 보며 감정이 어떻게 변했는지 이야기해요.",
  steps: [
    { name: "놀이 방법 알기", inst: "‘너의 감정을 그래프로 나타내 봐!’ 놀이는 학급 전체가 함께해요. 놀이 방법을 차례대로 눌러 보세요.", hints: ["먼저 점수표를 만들어요.", "그래프를 그린 다음에 친구와 비교해요."],
      render: (b, a) => sequence(b, a, ["월별 감정 점수를 꺾은선그래프로 나타내기", "친구들과 감정 그래프를 비교하고 알 수 있는 내용 이야기하기", "감정 점수표에 매월 가장 기억에 남는 일을 쓰고 감정을 0점~100점으로 나타내기"], [2, 0, 1],
        { ok: "① 감정 점수표 쓰기 ② 꺾은선그래프로 나타내기 ③ 친구와 비교하며 이야기하기 순서예요." }) },
    { name: "예시 그래프 그리기", inst: "어느 친구의 ‘월별 나의 감정 점수표’예요. 감정 점수를 꺾은선그래프로 나타내 보세요.", hints: ["세로 눈금 한 칸은 10점이에요. 80점은 8칸이에요.", "점을 누른 뒤 ▲ ▼ 단추로 한 칸씩 고칠 수 있어요."],
      render: (b, a) => { b.append(l5MoodTable()); l5Build(b, a, { g: L5G.moodEx, ok: "감정 점수표를 꺾은선그래프로 나타냈어요. 감정이 오르내린 모습이 한눈에 보여요!" }); } },
    { name: "변화 찾기", inst: "완성한 감정 그래프를 보고 알 수 있는 내용을 찾아봐요.", hints: ["선분이 가장 많이 기울어진 곳이 변화가 가장 큰 때예요. 올라간 것도 내려간 것도 변화예요.", "변화가 가장 작은 때는 10점만 변한 달이에요. 여러 달일 수 있어요."],
      render: (b, a) => l5Ask(b, a, [
        l5SegQ({ g: L5G.moodEx, mode: "abs", q: "전월과 비교하여 감정 점수의 변화가 가장 큰 때의 선분을 눌러 보세요." }),
        { q: "전월과 비교하여 감정 점수의 변화가 가장 작은 때를 모두 고르세요.", t: "pick", o: L5G.moodEx.xs.slice(1).map(x => x + "월"), a: [0, 5, 7], why: { "0,5": "11월도 10점만 변했어요.", "5,7": "4월도 10점만 변했어요.", "0,7": "9월도 10점만 변했어요." } },
        l5PointQ({ g: L5G.moodEx, mode: "max", q: "감정 점수가 가장 높은 달의 점을 눌러 보세요." })],
        { ok: "7월(20점)에서 8월(70점)로 50점 올라 8월의 변화가 가장 커요. 4월·9월·11월은 10점씩만 변했어요." }) },
    { name: "나의 감정 그래프", inst: "이제 나의 3월부터 11월까지의 감정을 점수로 나타내고 꺾은선그래프로 그려 보세요.",
      render: (b, a) => l5Mood(b, a, { g: L5V(L5G.moodEx, { vals: L5G.moodEx.xs.map(() => 0) }) }) },
    { name: "친구와 비교하기", inst: "또 다른 놀이 방법이에요. 두 사람이 7살부터 11살까지 매년 가장 기억에 남는 일의 감정 점수(10점 단위)를 한 활동지에 서로 다른 색으로 나타냈어요.", hints: ["주황 선이 ‘나’, 파란 선이 ‘친구’예요.", "같은 나이에서 두 점의 높이를 견주어 봐요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5G.pair), q: "‘나’의 감정 점수가 가장 높은 나이는 몇 살인가요?", t: "pick", o: ["8살", "9살", "10살", "11살"], a: 3 },
        { q: "‘친구’의 점수가 ‘나’보다 높은 나이를 모두 고르세요.", t: "pick", o: L5G.pair.xs.map(x => x + "살"), a: [0, 2, 4] },
        { q: "‘나’의 감정 점수가 전년보다 줄어든 나이는 몇 살인가요?", t: "pick", o: ["8살", "9살", "10살", "11살"], a: 1 },
        { q: "‘친구’의 감정 점수가 전년과 같은 나이는 몇 살인가요?", t: "pick", o: ["8살", "9살", "10살", "11살"], a: 0 }],
        { ok: "한 그래프에 두 사람의 감정 변화를 함께 나타내면 같은 나이끼리 쉽게 견줄 수 있어요." }) }
  ],
  challenge: { inst: "친구의 감정 점수표를 보고, ‘나’의 선(회색)이 그려진 그래프에 친구의 꺾은선을 그려 보세요.", hints: ["친구의 점수는 7살 60점, 8살 60점, 9살 80점, 10살 70점, 11살 100점이에요.", "세로 눈금 한 칸은 10점이에요."],
    render: (b, a) => l5Build(b, a, { g: L5V(L5G.pair, { series: null, vals: L5G.pair.series[1].vals, title: "나이별 감정 그래프" }), bg: { name: "나", vals: L5G.pair.series[0].vals }, name: "친구", color: L5_LINE2, table: true, ok: "한 활동지에 두 사람의 감정 그래프를 그렸어요. 9살에 친구는 점수가 올랐지만 나는 내려갔어요." }) }
},
{
  id: "l10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "꺾은선그래프를 읽고, 그리고, 활용할 수 있나요?",
  summary: "꺾은선그래프에서 가로·세로와 세로 눈금 한 칸의 크기를 확인하고, 선분이 기울어진 쪽과 정도를 보면 변화를 알 수 있어요. 두 점 사이의 값을 어림하고, 변화의 흐름으로 앞으로를 예상할 수 있어요.",
  steps: [
    { name: "척척! 그래프 읽기", inst: "어느 지역의 월별 미세먼지가 ‘좋음’인 날수를 조사하여 나타낸 꺾은선그래프예요.", hints: ["0과 10 사이가 5칸이에요.", "10일을 5칸으로 나누어요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5G.good), q: "꺾은선그래프의 가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 월, 세로: 날수", "가로: 날수, 세로: 월"], a: 0 },
        { q: "세로 눈금 한 칸은 며칠을 나타내나요?", t: "num", a: 2, unit: "일", why: { "1": "0과 10 사이가 5칸이에요. 한 칸이 1일이면 5칸은 5일이에요.", "10": "10일은 5칸이 나타내는 날수예요.", "5": "5는 칸 수예요." } }],
        { ok: "가로는 월, 세로는 날수, 세로 눈금 한 칸은 10 ÷ 5 = 2일이에요." }) },
    { name: "척척! ○× 문제", inst: "같은 그래프를 보고 옳으면 ○, 틀리면 ×를 골라요.", hints: ["7월에서 8월로 갈 때 선분이 오른쪽 위로 올라가요.", "10월에서 11월로 갈 때 선분이 가장 많이 내려가요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5G.good), q: "‘좋음’인 날수가 가장 많은 때는 8월이에요.", t: "ox", a: true },
        { q: "전월과 비교하여 ‘좋음’인 날수가 가장 많이 줄어든 때는 11월이에요.", t: "ox", a: true },
        { q: "‘좋음’인 날수는 7월부터 줄어들었어요.", t: "ox", a: false, why: { "o": "7월에서 8월로 갈 때는 늘어났어요. 줄어들기 시작한 때를 다시 봐요." } }],
        { ok: "8월이 가장 많고, 8월부터 줄어들었어요. 10월에서 11월로 가장 많이 줄었어요." }) },
    { name: "척척! 그래프 완성하기", inst: "어느 지역의 연도별 인구를 조사한 표와 꺾은선그래프예요. 빠진 2014년의 점을 찍어 꺾은선그래프를 완성해 보세요.", hints: ["2014년의 인구는 45만 명이에요.", "세로 눈금 한 칸은 1만 명이에요. 물결선 위 눈금은 28부터 시작해요."],
      render: (b, a) => l5Build(b, a, { g: L5G.pop, table: true, lock: [0, 1, 3, 4], ok: "2014년 45만 명에 점을 찍고 선분으로 이었어요. 2014년에 인구가 가장 많아요." }) },
    { name: "척척! 어림하고 예상하기", inst: "완성한 인구 그래프로 조사하지 않은 해의 인구를 어림하고, 앞으로의 변화를 예상해 보세요.", hints: ["2020년은 2018년과 2022년의 가운데예요.", "2014년부터 2022년까지 인구가 어떻게 변했는지 봐요."],
      render: (b, a) => l5Ask(b, a, [
        l5BetweenQ({ g: L5G.pop, at: 3.5, label: "2020년", ans: 36, q: "2020년의 인구는 약 몇만 명이었을까요? 2020년 자리에 점을 찍고 써 보세요.", why: { "38": "38만 명은 2018년의 인구예요.", "34": "34만 명은 2022년의 인구예요." } }),
        { q: "앞으로 이 지역의 인구는 어떻게 변할까요?", t: "pick", o: ["줄어들 것 같아요", "늘어날 것 같아요"], a: 0 },
        { q: "그렇게 예상한 까닭은 무엇인가요?", t: "pick", o: ["2014년부터 2022년까지 인구가 계속 줄어들었기 때문이에요", "2006년부터 2014년까지 인구가 늘어났기 때문이에요"], a: 0 }],
        { ok: "2020년은 38만 명과 34만 명의 가운데인 약 36만 명이에요. 2014년부터 계속 줄었으니 앞으로도 줄어들 것 같아요(예상이 꼭 맞는 것은 아니에요)." }) },
    { name: "꼭꼭! 확인하고 정리해요", inst: "오른쪽 꺾은선그래프를 보고 옳게 설명한 얼음 조각만 골라 아기 곰이 엄마 곰과 만나도록 길을 이어 보세요.", hints: ["세로 눈금 5칸이 250병이에요.", "옳은 문장은 두 개예요."],
      render: (b, a) => l5Ice(b, a, { fig: () => l5Fig(L5G.drink), items: [
        { t: "월별 음료수 판매량을 조사하여 나타낸 꺾은선그래프예요.", ok: true },
        { t: "세로 눈금 한 칸은 10병을 나타내요.", ok: false, why: "0과 250 사이가 5칸이에요. 한 칸은 몇 병일까요?" },
        { t: "10월의 판매량은 150병이에요.", ok: false, why: "10월의 점은 0에서 7칸 위예요. 한 칸이 50병이에요." },
        { t: "시간이 지남에 따라 판매량은 줄어들었어요.", ok: false, why: "6월부터 8월까지는 늘어났다가 그 뒤에 줄어들었어요." },
        { t: "전월과 비교하여 판매량이 가장 많이 줄어든 때는 9월이에요.", ok: true }],
        ok: "제목 문장과 9월 문장을 밟고 엄마 곰을 만났어요! 한 칸은 50병, 10월은 350병이에요." }) }
  ],
  challenge: { inst: "‘월별 음료수 판매량’ 그래프를 보고 답해 보세요.", hints: ["세로 눈금 한 칸은 50병이에요.", "8월은 0에서 14칸 위예요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Fig(L5G.drink), q: "8월의 음료수 판매량은 몇 병인가요?", t: "num", a: 700, unit: "병", why: { "14": "14는 칸 수예요. 한 칸이 50병이에요." } },
      { q: "9월의 판매량은 8월보다 몇 병 줄어들었나요?", t: "num", a: 250, unit: "병", why: { "450": "450병은 9월의 판매량이에요." } },
      { q: "전월과 비교하여 판매량이 가장 많이 늘어난 때를 모두 고르세요.", t: "pick", o: ["7월", "8월", "9월", "10월"], a: [0, 1], why: { "0": "8월도 7월보다 150병 늘었어요.", "1": "7월도 6월보다 150병 늘었어요." } },
      { q: "월별 음료수 판매량의 변화를 알아보기에 더 알맞은 그래프는 무엇인가요?", t: "pick", o: ["막대그래프", "꺾은선그래프"], a: 1 }],
      { ok: "꺾은선그래프를 읽고 변화와 차이를 정확하게 구했어요. 꺾은선그래프 단원을 모두 마쳤어요!" }) }
}
];
