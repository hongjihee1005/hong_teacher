//@@APP
const APP={title:"우리 반 강낭콩 관찰 연구소", unit:"4-2 수학 5. 꺾은선그래프", key:"s42-linegraph-v1", welcome:"우리 반 강낭콩 관찰 연구소에 온 것을 환영해요", intro:"4학년 3반 강낭콩 관찰 연구소가 되어 강낭콩의 키와 교실의 기온을 재고, 꺾은선그래프로 나타내 변화를 읽고 앞날을 예상해요."};
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

/* ---------- 이야기 버전: '확인하기' 단추 없이 저절로 확인(autoRun) ----------
   아래 부품은 교과서 버전(u5-linegraph.tb.js)의 l5 부품을 복사해 autoRun으로 바꾼 것이고, 새로 만든 부품은 앞글자 l5s예요. */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.l5sth{font-family:"Jua";color:var(--night)}
.l5snote{background:#F1F8EC;border-left:6px solid #7FB86A;border-radius:.6em;padding:.55em .9em;margin:.3em 0 .6em;word-break:keep-all}
.l5snote b{font-family:"Jua";color:#3F7A2E}
`;
  document.head.append(s);
})();
function l5sJong(w) { return /℃$/.test(String(w).trim()) ? false : l5Jong(w); }
function l5sJ(w, pair) { const [a, b] = pair.split("/"); return w + (l5sJong(w) ? a : b); }
function l5Enter(inp) { inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } }); }
function l5sNote(who, lines) { return h("div", { class: "l5snote" }, h("b", {}, `🌱 ${who}`), lines.map(l => h("p", { style: "margin:.25em 0" }, l))); }

/* ---------- 문제 모음: t:"pick"(a 번호|[번호…]) · "num"(a 수, unit) · "ox"(a true/false) · "custom"(make(poke)) ----------
   모든 문제에 답하면 저절로 확인(그래프를 누르는 문제가 있으면 1.2초, 수 입력이 있으면 0.9초, 고르기만 있으면 0.26초 기다림). */
function l5Ask(body, api, items, opts = {}) {
  const wrap = h("div"), rows = [];
  let auto = null;
  const poke = () => { if (auto) auto(); };
  const ansText = it => it.t === "num" ? l5U(it.a, it.unit || "") : it.t === "ox" ? (it.a ? "○" : "×") : (Array.isArray(it.a) ? it.a : [it.a]).map(i => it.o[i]).join(", ");
  items.forEach((it, qi) => {
    const box = h("div", { class: "qitem" });
    const qEl = h("div", { class: "jua" }, `${items.length > 1 ? qi + 1 + ". " : ""}${it.q}`);
    const row = { it };
    if (it.t === "custom") {
      const c = it.make(poke);
      box.append(qEl, c.el);
      const sv = c.el.querySelector("svg");
      Object.assign(row, { ok: c.ok, val: c.val, key: c.key, msg: c.msg, ans: c.ans, filled: c.filled, show: gd => { if (sv) sv.style.borderColor = gd ? "var(--ok)" : "var(--no)"; } });
    } else {
      if (it.fig) box.append(it.fig());
      box.append(qEl);
      row.ans = ansText(it);
      if (it.t === "num") {
        const inp = h("input", { type: "text", inputmode: "decimal", style: "width:5.5em;font-size:1.15em", "aria-label": it.q });
        box.append(h("div", {}, h("span", {}, it.pre || "답: "), inp, it.unit ? h("span", {}, " " + it.unit) : null));
        l5Enter(inp);
        row.ok = () => l5Num(inp) === it.a;
        row.show = g => inp.style.borderColor = g ? "var(--ok)" : "var(--no)";
        row.val = () => inp.value.trim() || "-";
        row.key = () => String(l5Num(inp));
        row.filled = () => inp.value.trim() !== "";
      } else {
        const ox = it.t === "ox", o = ox ? ["○ 옳아요", "× 옳지 않아요"] : it.o;
        const want = ox ? [it.a ? 0 : 1] : (Array.isArray(it.a) ? it.a.slice().sort((a, b) => a - b) : [it.a]);
        const multi = !ox && Array.isArray(it.a);
        const sel = new Set(), opts2 = h("div", { class: "opts" });
        o.forEach((t, oi) => {
          const b = h("button", { class: "opt" }, t);
          b.onclick = () => {
            [...opts2.children].forEach(x => x.classList.remove("good", "bad"));
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
        row.filled = () => sel.size >= want.length;   /* 여러 개 고르기는 정답 수만큼 고른 뒤에 확인 */
      }
    }
    rows.push(row); wrap.append(box);
  });
  api.provide({
    words: opts.words || items.filter(it => it.t === "pick").map(ansText).slice(0, 6),
    answers: rows.map((r, qi) => `${items.length > 1 ? (qi + 1) + ") " : ""}${r.ans}`)
  });
  const judge = () => {
    api.tryOnce();
    let all = true; rows.forEach(r => { const g = r.ok(); r.show(g); if (!g) all = false; });
    const given = rows.map(r => r.val()).join(" / ");
    if (all) { api.done(given, opts.ok); return true; }
    const bad = rows.find(r => !r.ok());
    const why = bad.it.why && bad.it.why[bad.key()];
    api.fail(why || (bad.msg && bad.msg()) || opts.bad || "빨간 칸을 다시 살펴봐요. 세로 눈금 한 칸의 크기와 점의 높이를 확인해 봐요.", given);
    return false;
  };
  const wait = items.some(it => it.t === "custom") ? 1200 : items.some(it => it.t === "num") ? 900 : 260;
  auto = autoRun(() => rows.every(r => r.filled()), () => rows.map(r => r.key()).join("|"), judge, wait);
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
  wrap.addEventListener("input", auto); wrap.addEventListener("change", auto);
  body.append(wrap);
}

/* ---------- 선분 고르기: 가장 많이 늘어난(inc)·줄어든(dec)·변한(abs) 때 ---------- */
function l5SegQ(o) {
  const g = o.g, si = o.si || 0, S = l5Ser(g), V = S[si].vals, n = V.length;
  const d = V.slice(1).map((v, i) => v - V[i]);
  const sc = d.map(x => o.mode === "dec" ? -x : o.mode === "abs" ? Math.abs(x) : x);
  const best = Math.max(...sc), ans = sc.map((s, i) => s === best ? i : -1).filter(i => i >= 0);
  const nm = i => l5Nm(g, i);
  return { t: "custom", q: o.q, why: o.why, make: (poke) => {
    const G = l5Geom(g, g), svg = makeSvg(G.W, G.H); let sel = null;
    const draw = () => {
      l5Paint(svg, g, G, l5St(g));
      for (let i = 0; i + 1 < n; i++) {
        const x1 = G.x(i), y1 = G.y(V[i]), x2 = G.x(i + 1), y2 = G.y(V[i + 1]);
        if (sel === i) svg.append(svgEl("line", { x1, y1, x2, y2, stroke: L5_SEL, "stroke-width": 8, "stroke-linecap": "round" }));
        const hit = svgEl("line", { x1, y1, x2, y2, stroke: "transparent", "stroke-width": 28, style: "cursor:pointer" });
        hit.addEventListener("click", () => { sel = sel === i ? null : i; draw(); poke(); });
        svg.append(hit);
      }
    };
    draw();
    const el = h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, `${S.length > 1 ? `‘${S[si].name}’ 선에서 ` : ""}선분을 눌러 골라요. 고른 선분은 빨간색으로 보여요.`));
    return {
      el, ans: `${nm(ans[0] + 1)} (${nm(ans[0])}→${nm(ans[0] + 1)} 선분)`, filled: () => sel != null,
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
  return { t: "custom", q: o.q, make: (poke) => {
    const G = l5Geom(g, g), svg = makeSvg(G.W, G.H), stt = want.map(() => 0);
    const draw = () => {
      l5Paint(svg, g, G, l5St(g));
      for (let i = 0; i + 1 < n; i++) {
        const x1 = G.x(i), y1 = G.y(V[i]), x2 = G.x(i + 1), y2 = G.y(V[i + 1]), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const hit = svgEl("line", { x1, y1, x2, y2, stroke: "transparent", "stroke-width": 28, style: "cursor:pointer" });
        const t = LAB[stt[i]], w = l5W(t, 15) + 14, by = Math.max(G.T + 2, my - 26);
        const tag = svgEl("g", { style: "cursor:pointer" });
        tag.append(svgEl("rect", { x: mx - w / 2, y: by - 12, width: w, height: 24, rx: 8, fill: "#fff", stroke: COL[stt[i]], "stroke-width": 2 }), txt(mx, by, t, 15, { fill: COL[stt[i]] }));
        const turn = () => { stt[i] = stt[i] % 3 + 1; draw(); poke(); };
        hit.addEventListener("click", turn); tag.addEventListener("click", turn);
        svg.append(hit, tag);
      }
    };
    draw();
    const el = h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, "선분(또는 그 위 이름표)을 누를 때마다 ‘늘어남 → 줄어듦 → 그대로’ 차례로 바뀌어요. 모두 표시하면 저절로 확인해요."));
    return {
      el, ans: want.map((w, i) => `${nm(i)}→${nm(i + 1)} ${LAB[w]}`).join(", "), filled: () => stt.every(s => s > 0),
      ok: () => stt.every((s, i) => s === want[i]), key: () => stt.join(""), val: () => stt.map(s => LAB[s]).join("·"),
      msg: () => {
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
  return { t: "custom", q: o.q, make: (poke) => {
    const G = l5Geom(g, g), svg = makeSvg(G.W, G.H); let sel = null;
    const draw = () => {
      l5Paint(svg, g, G, l5St(g));
      V.forEach((v, i) => {
        if (sel === i) svg.append(svgEl("circle", { cx: G.x(i), cy: G.y(v), r: 14, fill: "none", stroke: L5_SEL, "stroke-width": 3.5 }));
        const hit = svgEl("circle", { cx: G.x(i), cy: G.y(v), r: 20, fill: "transparent", style: "cursor:pointer" });
        hit.addEventListener("click", () => { sel = sel === i ? null : i; draw(); poke(); });
        svg.append(hit);
      });
    };
    draw();
    const el = h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, "점을 눌러 골라요. 고른 점에 빨간 동그라미가 생겨요."));
    return {
      el, ans: ans.map(nm).join(", "), filled: () => sel != null, ok: () => ans.includes(sel), key: () => String(sel), val: () => sel == null ? "-" : nm(sel),
      msg: () => o.mode === "min" ? "더 낮은 곳에 찍힌 점이 있어요. 점의 높이를 견주어 봐요." : "더 높은 곳에 찍힌 점이 있어요. 점의 높이를 견주어 봐요."
    };
  } };
}
/* ---------- 두 점 사이의 값 어림하기 ---------- o = {g, at:(소수 번째), label, ans, q} */
function l5BetweenQ(o) {
  const g = o.g, U = g.unit;
  return { t: "custom", q: o.q, why: o.why, make: (poke) => {
    const G = l5Geom(g, g), svg = makeSvg(G.W, G.H), X = G.x(o.at); let v = null;
    svg.style.touchAction = "none";
    const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": o.label });
    l5Enter(inp);
    const draw = () => {
      l5Paint(svg, g, G, l5St(g));
      svg.append(svgEl("line", { x1: X, y1: G.T, x2: X, y2: G.PB, stroke: L5_SEL, "stroke-width": 2, "stroke-dasharray": "6 5" }), txt(X, G.T - 12, o.label, 16, { fill: L5_SEL }));
      if (v != null) { svg.append(svgEl("circle", { cx: X, cy: G.y(v), r: 8, fill: "#fff", stroke: L5_SEL, "stroke-width": 3.5 })); l5Ruler(svg, G, Math.round((v - G.lo) / G.step)); }
    };
    const set = p => { v = G.lo + l5K(G, p) * G.step; draw(); poke(); };
    dragOn(svg, p => { if (Math.abs(p.x - X) > G.SW * .6 || p.y > G.PB + 12) return false; set(p); }, set);
    draw();
    const el = h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, `빨간 점선 위를 눌러(끌어) ${l5J(o.label, "이/가")} 있을 만한 자리에 점을 찍어요.`),
      h("div", { class: "l5row" }, h("span", {}, `${o.label}: 약 `), inp, h("span", {}, U)));
    return {
      el, ans: `약 ${l5U(o.ans, U)}`, key: () => `${v}/${l5Num(inp)}`, val: () => `점 ${v == null ? "-" : l5F(v)} / 약 ${inp.value.trim() || "-"}`,
      filled: () => v != null && inp.value.trim() !== "",
      ok: () => v === o.ans && l5Num(inp) === o.ans,
      msg: () => (o.why && o.why[String(l5Num(inp))]) || (v !== o.ans ? "두 점을 이은 선분 위에 점이 오도록 해요. 선분은 두 점 사이에서 일정하게 변한다고 생각해요."
        : "찍은 점의 높이를 세로 눈금에서 읽어 수로 써요.")
    };
  } };
}

/* ---------- 카드 나누기 ---------- opt = {bins:[글], cards:[{t, b, why}]}  카드를 모두 넣으면 1.2초 뒤 저절로 확인 */
function l5Sort(body, api, opt) {
  const where = opt.cards.map(() => null); let sel = null, auto = null;
  const pool = h("div", { class: "l5pool" });
  const cards = opt.cards.map((c, i) => h("button", { class: "l5card", onclick: e => {
    e.stopPropagation();
    if (where[i] != null) { where[i] = null; sel = i; } else sel = sel === i ? null : i;
    draw();
  } }, c.t));
  const bins = opt.bins.map((t, bi) => {
    const list = h("div");
    const box = h("div", { class: "l5bin", onclick: () => {
      if (sel == null) return api.hint("먼저 카드를 누른 다음, 넣을 곳을 눌러요.");
      where[sel] = bi; sel = null; draw();
    } }, h("div", { class: "l5bint" }, t), list);
    return { box, list };
  });
  function draw() {
    cards.forEach((c, i) => {
      c.classList.toggle("l5sel", sel === i); c.classList.remove("l5good", "l5bad");
      (where[i] == null ? pool : bins[where[i]].list).append(c);
    });
    if (auto) auto();
  }
  const judge = () => {
    api.tryOnce();
    let ok = true;
    cards.forEach((c, i) => { const g = where[i] === opt.cards[i].b; c.classList.add(g ? "l5good" : "l5bad"); if (!g) ok = false; });
    const given = opt.bins.map((b, bi) => `${b}: ${opt.cards.filter((_, i) => where[i] === bi).map(c => c.t).join("/")}`).join(" | ");
    if (ok) { api.done(given, opt.ok); return true; }
    const bad = opt.cards.findIndex((c, i) => where[i] !== c.b);
    api.fail(opt.cards[bad].why || opt.bad || "빨간 카드를 다시 생각해 봐요.", given); return false;
  };
  auto = autoRun(() => where.every(w => w != null), () => where.join(","), judge, 1200);
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.b === bi).map(c => c.t).join(" / ")}`) });
  body.append(h("p", { class: "inst" }, "카드를 누르고, 넣을 상자를 눌러요. 상자 안의 카드를 누르면 다시 빠져요. 모두 넣으면 저절로 확인해요."), pool,
    h("div", { class: "l5bins" }, bins.map(b => b.box)));
}

/* ---------- 꺾은선그래프(막대그래프) 그리기 ----------
   opt = { g, kind, axisPick, waveChoices:[0(넣지 않기), …], stepChoices, titleChoices, lock:[번호], bg:{name, vals}, name, color, table:true, ok }
   고를 것을 모두 고르고 점을 모두 찍으면, 손을 멈춘 뒤 1.2초 뒤에 저절로 확인해요. */
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
  let aLo = g.lo || 0, aStep = g.step, auto = null;
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
    if (auto) auto();
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
    h("p", { class: "l5cap" }, (kind === "bar" ? "막대를 세울 칸을 누르고 위아래로 끌어요." : "점을 찍을 자리를 누르고 위아래로 끌어요. 이웃한 점은 저절로 선분으로 이어져요.") + " 고를 것을 모두 고르고 모두 그리면 저절로 확인해요."));
  const ready = () => (!opt.axisPick || (st.xAxis != null && st.yAxis != null)) && st.lo != null && st.step != null &&
    (!opt.titleChoices || st.title != null) && st.pts.every(v => v != null);
  const sign = () => JSON.stringify([st.lo, st.step, st.pts, st.title, st.xAxis, st.yAxis]);
  function check() {
    api.tryOnce();
    const given = (opt.waveChoices ? `물결선 ${st.lo == null ? "?" : st.lo ? "0~" + st.lo : "없음"}, ` : "") + (st.step == null ? "?" : l5U(st.step, U)) + ": " + g.xs.map((x, i) => `${l5Nm(g, i)} ${st.pts[i] == null ? "?" : l5F(st.pts[i])}`).join(", ");
    const no = m => { api.fail(m, given); return false; };
    if (opt.axisPick && (st.xAxis !== g.xAxis || st.yAxis !== g.yAxis)) return no(`시간의 흐름을 나타내는 ${l5J("‘" + g.xAxis + "’", "을/를")} 가로에, 변하는 양인 ${l5J("‘" + g.yAxis + "’", "을/를")} 세로에 나타내요.`);
    if (st.lo > mn) return no(`물결선으로 0과 ${l5U(st.lo, U)} 사이를 생략하면 가장 작은 수 ${l5sJ(l5U(mn, U), "을/를")} 나타낼 수 없어요. 물결선은 자료의 값이 없는 부분에만 넣어요.`);
    const top = st.lo + st.step * st.cells;
    if (top < mx) return no(`${st.lo ? `물결선 위 ${l5U(st.lo, U)}부터 ` : ""}눈금 한 칸이 ${l5U(st.step, U)}이고 ${st.cells}칸이면 ${l5U(top, U)}까지만 나타낼 수 있어요. 가장 큰 수 ${l5U(mx, U)}까지 나타낼 수 있게 골라요.`);
    const nd = vals.findIndex(v => !l5Mult(v - st.lo, st.step));
    if (nd >= 0) return no(`눈금 한 칸이 ${l5U(st.step, U)}이면 ${l5Nm(g, nd)}의 ${l5sJ(l5U(vals[nd], U), "은/는")} 눈금과 눈금 사이에 찍혀서 정확하게 나타내기 어려워요. 모든 수가 눈금에 꼭 맞는 크기를 골라요.`);
    for (let i = 0; i < n; i++) {
      if (lock.has(i)) continue;
      if (st.pts[i] !== vals[i]) return no(`${l5Nm(g, i)}의 ${word}${word === "점" ? "이" : "가"} ${l5U(l5F(st.pts[i]), U)}에 그려져 있어요. ${l5sJ(l5U(vals[i], U), "은/는")} ${st.lo ? l5U(st.lo, U) + "에서" : "0에서"} 눈금 몇 칸 위일까요? (눈금 한 칸 ${l5U(st.step, U)})`);
    }
    if (opt.titleChoices && st.title !== g.title) return no("제목은 무엇을 조사한 그래프인지 알 수 있게 붙여요. 표의 내용을 다시 살펴봐요.");
    api.done(given, opt.ok || "표의 수에 맞게 꺾은선그래프를 완성했어요!");
    return true;
  }
  api.provide({
    words: opt.words || ["물결선", "세로 눈금 한 칸의 크기", "가장 큰 수", "가장 작은 수", "제목"],
    answers: [(opt.waveChoices ? `물결선 ${aLo ? `0과 ${l5U(aLo, U)} 사이` : "넣지 않기"}, ` : "") + (opt.stepChoices ? `한 칸 ${l5U(aStep, U)}: ` : "") + g.xs.map((x, i) => `${l5Nm(g, i)} ${l5U(vals[i], U)}`).join(", ")]
  });
  auto = autoRun(ready, sign, check, 1200);
  draw();
  if (opt.table) body.append(l5Table(g0));
  body.append(h("div", { class: "panel" }, h("div", { class: "stage" }, svg), side));
}

/* ---------- 나의 기분 그래프(내 점수로 자유롭게) ---------- */
function l5Mood(body, api, opt) {
  const g = opt.g, n = g.xs.length, pts = g.xs.map(() => null), memo = g.xs.map(() => "");
  let sel = null, auto = null;
  const G = l5Geom(g, g), svg = makeSvg(G.W, G.H); svg.style.touchAction = "none";
  const info = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const draw = () => {
    l5Paint(svg, g, G, { known: true, title: g.title, xAxis: g.xAxis, yAxis: g.yAxis, ser: [{ name: "나", vals: pts, color: L5_LINE }], kind: "line", sel });
    info.textContent = g.xs.map((x, i) => `${l5Nm(g, i)} ${pts[i] == null ? "?" : pts[i] + "점"}`).join(" · ");
    if (auto) auto();
  };
  const colOf = p => { const i = Math.floor((p.x - G.L) / G.SW); return p.y > G.T - 30 && p.y < G.base + 44 && i >= 0 && i < n ? i : -1; };
  dragOn(svg, p => { const i = colOf(p); if (i < 0) return false; sel = i; pts[i] = l5K(G, p) * G.step; draw(); }, p => { if (sel != null) { pts[sel] = l5K(G, p) * G.step; draw(); } });
  const memoBox = h("div", { class: "l5mood" }, g.xs.map((x, i) => { const inp = h("input", { type: "text", placeholder: "기억에 남는 일", "aria-label": l5Nm(g, i) }); inp.oninput = () => memo[i] = inp.value.trim(); return h("label", {}, l5Nm(g, i), inp); }));
  const months = g.xs.slice(1).map((x, i) => l5Nm(g, i + 1));
  let big = null, small = null;
  const pick = (set) => { const row = h("div", { class: "opts" }); months.forEach((m, k) => row.append(h("button", { class: "opt", onclick: e => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); set(k); if (auto) auto(); } }, m))); return row; };
  const rowB = pick(k => big = k), rowS = pick(k => small = k);
  const judge = () => {
    const given = pts.map((v, i) => `${l5Nm(g, i)} ${v}${memo[i] ? "(" + memo[i] + ")" : ""}`).join(", ");
    const d = pts.slice(1).map((v, i) => Math.abs(v - pts[i])), mxd = Math.max(...d), mnd = Math.min(...d);
    if (mxd === mnd) { api.hint("모든 주의 변화가 똑같아요. 기분이 크게 달라진 주가 있다면 점수를 바꾸어 봐요."); return false; }
    api.tryOnce();
    const okB = d[big] === mxd, okS = d[small] === mnd;
    [[rowB, big, okB], [rowS, small, okS]].forEach(([r, k, ok]) => { r.children[k].classList.remove("good", "bad"); r.children[k].classList.add(ok ? "good" : "bad"); });
    if (!okB) { api.fail(`${months[big]}에는 전주보다 ${d[big]}점 변했어요. 선분이 더 많이 기울어진 곳을 찾아요.`, given); return false; }
    if (!okS) { api.fail(`${months[small]}에는 전주보다 ${d[small]}점 변했어요. 선분이 가장 덜 기울어진 곳을 찾아요.`, given); return false; }
    api.done(given + ` / 가장 큰 변화 ${months[big]}, 가장 작은 변화 ${months[small]}`, "나의 기분 그래프를 완성하고 변화를 정확하게 찾았어요! 친구의 그래프와도 견주어 봐요.");
    return true;
  };
  auto = autoRun(() => pts.every(v => v != null) && big != null && small != null, () => JSON.stringify([pts, big, small]), judge, 1200);
  body.append(h("p", { class: "inst" }, "① 주마다 가장 기억에 남는 일을 짧게 써요(쓰지 않아도 돼요). ② 그 주의 기분 점수(0점~100점, 10점 단위)만큼 점을 찍어요. ③ 아래 두 물음에 답하면 저절로 확인해요."), memoBox,
    h("div", { class: "panel" }, h("div", { class: "stage" }, svg), h("div", { class: "side" }, info, h("p", { class: "l5cap" }, "점을 찍을 자리를 누르고 위아래로 끌어요. 세로 눈금 한 칸은 10점이에요."))),
    h("div", { class: "qitem" }, h("div", { class: "jua" }, "내 그래프에서 전주와 비교하여 기분 점수의 변화가 가장 큰 때는 언제인가요?"), rowB),
    h("div", { class: "qitem" }, h("div", { class: "jua" }, "내 그래프에서 전주와 비교하여 기분 점수의 변화가 가장 작은 때는 언제인가요?"), rowS));
  api.provide({ words: ["기분 점수", "전주", "변화가 가장 큰 때", "선분이 많이 기울어진 곳"], answers: [] });
  draw();
}

/* ---------- 공학 도구처럼: 수를 넣으면 꺾은선그래프가 바로 그려져요 ---------- */
function l5Tool(body, api, opt) {
  const g = opt.g, U = g.unit;
  let step = 1, wave = false, auto = null; const seenS = new Set(), seenW = new Set();
  const ins = g.xs.map((x, i) => h("input", { type: "text", inputmode: "numeric", "aria-label": l5Nm(g, i) }));
  const tbl = h("div", { class: "l5tbl" }, h("div", { class: "l5tt" }, g.title), h("table", {}, h("tbody", {},
    h("tr", {}, h("th", {}, `${g.xAxis}(${g.xUnit})`), (g.names || g.xs).map(x => h("th", {}, x))),
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
    if (auto) auto();
  };
  ins.forEach(i => { i.addEventListener("input", draw); l5Enter(i); });
  const stepRow = h("div", { class: "l5btns" }, h("span", { class: "l5lbl" }, "간격:"));
  [1, 2, 5, 10].forEach(s => { const b = h("button", { onclick: () => { step = s; [...stepRow.querySelectorAll("button")].forEach(x => x.classList.toggle("l5on", x === b)); draw(); } }, String(s)); if (s === 1) b.classList.add("l5on"); stepRow.append(b); });
  const waveRow = h("div", { class: "l5btns" }, h("span", { class: "l5lbl" }, "물결선:"));
  [["넣지 않기", false], ["넣기", true]].forEach(([t, w]) => { const b = h("button", { onclick: () => { wave = w; [...waveRow.querySelectorAll("button")].forEach(x => x.classList.toggle("l5on", x === b)); draw(); } }, t); if (!w) b.classList.add("l5on"); waveRow.append(b); });
  const judge = () => {
    const v = ins.map(l5Num), given = ins.map(i => i.value.trim() || "-").join(", ");
    const bad = v.findIndex((x, i) => x !== g.vals[i]);
    if (bad >= 0) { api.tryOnce(); ins.forEach((i, k) => i.style.borderColor = v[k] === g.vals[k] ? "var(--ok)" : "var(--no)"); api.fail(`${l5Nm(g, bad)} 칸의 수를 조사한 기록과 다시 견주어 봐요.`, given); return false; }
    ins.forEach(i => i.style.borderColor = "var(--ok)");
    if (seenS.size < 2) { api.hint("표를 바르게 채웠어요. 이제 간격을 다른 수로 바꾸어 그래프가 어떻게 달라지는지 살펴봐요."); return false; }
    if (seenW.size < 2) { api.hint("간격을 1로 두고 물결선을 ‘넣기’로도 바꾸어 견주어 봐요."); return false; }
    api.tryOnce();
    api.done(given + ` / 간격 ${[...seenS].join("·")}, 물결선 있음·없음`, opt.ok); return true;
  };
  auto = autoRun(() => ins.every(i => i.value.trim() !== ""), () => ins.map(i => i.value.trim()).join("|") + `#${seenS.size}${seenW.size}`, judge, 900);
  const side = h("div", { class: "side" }, h("p", {}, "① 표에 수를 넣어요. ② 간격(세로 눈금 한 칸의 크기)을 바꾸어 봐요. ③ 물결선을 넣었을 때와 넣지 않았을 때를 견주어 봐요. 모두 해 보면 저절로 확인해요."), stepRow, waveRow, note);
  api.provide({ words: ["간격", "눈금 한 칸의 크기", "물결선"], answers: [g.xs.map((x, i) => `${l5Nm(g, i)} ${l5U(g.vals[i], U)}`).join(", ")] });
  draw();
  body.append(opt.pre || "", tbl, h("div", { class: "panel" }, stage, side));
}

/* ---------- 새 부품: 온도계 눈금 읽어 표 채우기 ---------- opt = {g, lo, hi, ok} */
function l5sThermo(body, api, opt) {
  const g = opt.g, n = g.xs.length, lo = opt.lo, hi = opt.hi, CW = 84, W = 20 + n * CW, H = 400, top = 60, bot = 320;
  const Y = t => bot - (t - lo) / (hi - lo) * (bot - top);
  const svg = makeSvg(W, H);
  svg.append(txt(W / 2, 24, opt.title || "온도계로 잰 교실의 기온(℃)", 19));
  g.vals.forEach((v, i) => {
    const cx = 10 + CW * (i + .5) + 10;
    svg.append(svgEl("rect", { x: cx - 8, y: top - 10, width: 16, height: bot - top + 14, rx: 8, fill: "#fff", stroke: "#9AA9A3", "stroke-width": 1.5 }));
    for (let t = lo; t <= hi; t++) {
      const big = t % 5 === 0, y = Y(t);
      svg.append(svgEl("line", { x1: cx - 8 - (big ? 14 : 8), y1: y, x2: cx - 8, y2: y, stroke: L5_INK, "stroke-width": big ? 1.6 : 1 }));
      if (big) svg.append(txt(cx - 34, y, String(t), 13, { "text-anchor": "end" }));
    }
    svg.append(svgEl("rect", { x: cx - 4, y: Y(v), width: 8, height: bot + 6 - Y(v), fill: "#E04A3A" }));
    svg.append(svgEl("circle", { cx, cy: bot + 16, r: 13, fill: "#E04A3A", stroke: "#B5402F", "stroke-width": 1.5 }));
    svg.append(txt(cx - 10, bot + 52, l5Nm(g, i), 15));
  });
  const T = l5TableEl({ title: g.title, head: `${g.xAxis}`, row: `${g.yAxis}(${g.unit})`, cols: g.names || g.xs, vals: g.vals }, g.xs.map((_, i) => i));
  const ins = g.xs.map((_, i) => T.ins[i]);
  const judge = () => {
    api.tryOnce();
    const given = ins.map(i => i.value.trim() || "-").join(", ");
    let bad = -1;
    ins.forEach((inp, i) => { const ok = l5Num(inp) === g.vals[i]; inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok && bad < 0) bad = i; });
    if (bad >= 0) {
      const v = l5Num(ins[bad]), d = Math.abs(v - g.vals[bad]);
      api.fail(d > 0 && d <= 2 ? `${l5Nm(g, bad)} 온도계를 다시 봐요. 작은 눈금 한 칸은 1 ℃예요. 빨간 기둥 끝에서 가까운 긴 눈금(5 ℃마다)부터 세어 봐요.` : `${l5Nm(g, bad)} 온도계의 빨간 기둥 끝이 가리키는 눈금을 다시 읽어 봐요.`, given);
      return false;
    }
    api.done(given, opt.ok); return true;
  };
  const auto = autoRun(() => ins.every(i => i.value.trim() !== ""), () => ins.map(i => i.value.trim()).join("|"), judge, 900);
  ins.forEach(i => { i.addEventListener("input", auto); i.addEventListener("change", auto); l5Enter(i); });
  api.provide({ words: ["눈금 한 칸", "1 ℃", "빨간 기둥"], answers: [g.xs.map((x, i) => `${l5Nm(g, i)} ${l5U(g.vals[i], g.unit)}`).join(", ")] });
  body.append(h("div", { class: "l5fig" }, svg, h("p", { class: "l5cap" }, "작은 눈금 한 칸은 1 ℃, 수가 쓰인 긴 눈금은 5 ℃마다 있어요. 빨간 기둥 끝을 읽어 표에 써요.")), T.el);
}

/* ---------- 새 부품: 징검돌 건너기 — 옳은 문장만 골라 강낭콩 밭까지 ---------- */
function l5sStones(body, api, opt) {
  const on = opt.items.map(() => false), need = opt.items.filter(it => it.ok).length;
  const path = h("div", { class: "l5path" });
  let auto = null;
  const ices = opt.items.map((it, i) => h("button", { class: "l5ice", onclick: e => { on[i] = !on[i]; e.currentTarget.classList.toggle("l5on", on[i]); ices.forEach(b => b.classList.remove("l5good", "l5bad")); showPath(); if (auto) auto(); } }, it.t));
  const showPath = () => { const p = opt.items.filter((_, i) => on[i]).map((_, k) => `돌 ${k + 1}`); path.textContent = "건너는 길: 출발 → " + (p.length ? p.join(" → ") + " → " : "") + "강낭콩 밭"; };
  showPath();
  const judge = () => {
    api.tryOnce();
    const given = opt.items.map((it, i) => on[i] ? i + 1 : null).filter(Boolean).join(",") || "-";
    const wrong = opt.items.findIndex((it, i) => on[i] && !it.ok);
    ices.forEach((b, i) => { if (on[i]) b.classList.add(opt.items[i].ok ? "l5good" : "l5bad"); });
    if (wrong >= 0) { api.fail(`첨벙! 이 징검돌은 옳지 않은 문장이에요. ${opt.items[wrong].why}`, given); return false; }
    api.done(given, opt.ok); return true;
  };
  auto = autoRun(() => on.filter(Boolean).length >= need, () => on.join(","), judge, 600);
  body.append(opt.fig(), h("p", { class: "inst" }, `옳은 문장 징검돌만 ${need}개 골라 밟아요. ${need}개를 고르면 저절로 확인해요.`),
    h("div", { class: "l5pond" }, h("span", { class: "l5bear" }, "🧒 출발"), ices, h("span", { class: "l5bear" }, "강낭콩 밭 🌱")), path);
  api.provide({ words: ["옳은 문장", "세로 눈금 한 칸", "가장 많이 줄어든 때"], answers: [opt.items.filter(it => it.ok).map(it => it.t).join(" / ")] });
}

/* ---------- 단원 자료 (이야기 속 자료 — 모두 이 앱에서 지어낸 수예요) ---------- */
const L5Y = (a, b, d = 1) => { const r = []; for (let y = a; y <= b; y += d) r.push(String(y)); return r; };
const L5T_XS = ["오전 9", "10", "11", "낮 12", "오후 1", "2"], L5T_NM = ["오전 9시", "오전 10시", "오전 11시", "낮 12시", "오후 1시", "오후 2시"];
const L5S = {
  sprout: { title: "모둠별 싹이 튼 강낭콩 수", xs: ["1모둠", "2모둠", "3모둠", "4모둠"], xAxis: "모둠", xUnit: "", yAxis: "강낭콩 수", unit: "개", vals: [8, 6, 9, 5], step: 1, cells: 10, kind: "bar" },
  town: { title: "월별 우리 고장의 낮 최고 기온", xs: L5Y(5, 9), xAxis: "월", xUnit: "월", yAxis: "기온", unit: "℃", vals: [24, 28, 30, 32, 26], step: 2, cells: 17, major: 10 },
  hae: { title: "날짜별 하은이 강낭콩의 키", xs: L5Y(2, 10, 2), xAxis: "날짜", xUnit: "일", yAxis: "키", unit: "cm", vals: [2, 4, 8, 14, 16], step: 1, cells: 20 },
  yard: { title: "시각별 운동장의 기온", xs: ["오전 9", "10", "11", "낮 12"], names: ["오전 9시", "오전 10시", "오전 11시", "낮 12시"], xAxis: "시각", xUnit: "시", yAxis: "기온", unit: "℃", vals: [14, 16, 20, 21], step: 1, cells: 25 },
  morning: { title: "요일별 아침 교실의 기온", xs: ["월", "화", "수", "목", "금"], xAxis: "요일", xUnit: "요일", yAxis: "기온", unit: "℃", vals: [14, 16, 13, 17, 15], step: 1, cells: 20 },
  vine: { title: "날짜별 교문 옆 덩굴 강낭콩의 키", xs: L5Y(20, 28, 2), xAxis: "날짜", xUnit: "일", yAxis: "키", unit: "cm", vals: [41, 44, 45, 48, 52], step: 5, cells: 12, major: 10 },
  jiwoo: { title: "주별 지우 강낭콩의 키", xs: L5Y(1, 5), xAxis: "주", xUnit: "주", yAxis: "키", unit: "cm", vals: [4, 7, 11, 14, 15], step: 1, cells: 15 },
  vine2: { title: "날짜별 교문 옆 덩굴 강낭콩의 키", xs: L5Y(20, 28, 2), xAxis: "날짜", xUnit: "일", yAxis: "키", unit: "cm", vals: [42, 44, 45, 48, 52], step: 1, lo: 40, cells: 15, major: 5 },
  leaf: { title: "주별 지우 강낭콩의 잎의 수", xs: L5Y(1, 5), xAxis: "주", xUnit: "주", yAxis: "잎의 수", unit: "장", vals: [2, 4, 7, 11, 12], step: 1, cells: 15 },
  pot: { title: "날짜별 하은이 강낭콩 화분의 무게", xs: L5Y(1, 5), xAxis: "날짜", xUnit: "일", yAxis: "무게", unit: "g", vals: [352, 346, 340, 348, 342], step: 2, lo: 330, cells: 12, major: 10 },
  pod: { title: "주별 우리 반 강낭콩 꼬투리 수", xs: L5Y(5, 9), xAxis: "주", xUnit: "주", yAxis: "꼬투리 수", unit: "개", vals: [12, 18, 26, 31, 35], step: 1, lo: 10, cells: 25, major: 5 },
  water: { title: "요일별 지우가 화분에 준 물의 양", xs: ["월", "화", "수", "목"], xAxis: "요일", xUnit: "요일", yAxis: "물의 양", unit: "mL", vals: [46, 50, 54, 52], step: 2, lo: 40, cells: 10, major: 10 },
  room: { title: "시각별 우리 교실의 기온", xs: L5T_XS, names: L5T_NM, xAxis: "시각", xUnit: "시", yAxis: "기온", unit: "℃", vals: [17, 19, 22, 24, 25, 23], step: 1, lo: 15, cells: 10, major: 5 },
  seo: { title: "주별 서진이 강낭콩의 키", xs: L5Y(1, 4), xAxis: "주", xUnit: "주", yAxis: "키", unit: "cm", vals: [6, 10, 14, 18], step: 2, cells: 10 },
  hall: { title: "시각별 복도의 기온", xs: L5T_XS, names: L5T_NM, xAxis: "시각", xUnit: "시", yAxis: "기온", unit: "℃", vals: [16, 17, 19, 21, 21, 20], step: 1, lo: 15, cells: 10, major: 5 },
  garden: { title: "주별 텃밭 강낭콩의 키", xs: L5Y(1, 6), xAxis: "주", xUnit: "주", yAxis: "키", unit: "cm", vals: [3, 7, 12, 18, 23, 27], step: 1, cells: 30, major: 5 },
  gleaf: { title: "주별 텃밭 강낭콩의 잎의 수", xs: L5Y(1, 6), xAxis: "주", xUnit: "주", yAxis: "잎의 수", unit: "장", vals: [2, 4, 6, 9, 12, 14], step: 1, cells: 15 },
  harvest: { title: "연도별 우리 학교 텃밭 강낭콩 수확량", xs: L5Y(2020, 2024), xAxis: "연도", xUnit: "년", yAxis: "수확량", unit: "kg", vals: [32, 35, 34, 38, 41], step: 1, lo: 30, cells: 15, major: 5 },
  price: { title: "연도별 콩나물과 두부의 가격", xs: L5Y(2020, 2023), xAxis: "연도", xUnit: "년", yAxis: "가격", unit: "원", step: 100, lo: 1000, cells: 11, major: 500, showVals: true, sw: 92,
    series: [{ name: "콩나물(300 g)", vals: [1240, 1320, 1410, 1530], lab: "down" }, { name: "두부(1모)", vals: [1680, 1720, 1890, 2050], lab: "up" }] },
  bean: { title: "연도별 콩(1 kg)의 가격", xs: L5Y(2020, 2023), xAxis: "연도", xUnit: "년", yAxis: "가격", unit: "원", vals: [7200, 6900, 7500, 7800], step: 100, lo: 6500, cells: 15, major: 500, showVals: true, sw: 92 },
  mood: { title: "주별 하은이의 기분 그래프", xs: L5Y(1, 8), xAxis: "주", xUnit: "주", yAxis: "점수", unit: "점", vals: [60, 90, 70, 30, 50, 80, 70, 100], step: 10, cells: 10, major: 50 },
  moodJ: [70, 70, 80, 60, 60, 90, 80, 90],
  seoLeaf: { title: "주별 서진이 강낭콩의 잎의 수", xs: L5Y(6, 10), xAxis: "주", xUnit: "주", yAxis: "잎의 수", unit: "장", vals: [6, 10, 12, 10, 4], step: 2, cells: 7, major: 10 },
  join: { title: "연도별 강낭콩 기르기에 참여한 학생 수", xs: L5Y(2020, 2024), xAxis: "연도", xUnit: "년", yAxis: "학생 수", unit: "명", vals: [32, 41, 44, 39, 35], step: 1, lo: 30, cells: 15, major: 5 },
  flower: { title: "월별 학교 화단에 쓴 물의 양", xs: L5Y(6, 10), xAxis: "월", xUnit: "월", yAxis: "물의 양", unit: "L", vals: [300, 450, 650, 400, 350], step: 50, cells: 14, major: 250 }
};
L5S.both = { title: "시각별 교실과 복도의 기온", xs: L5T_XS, names: L5T_NM, xAxis: "시각", xUnit: "시", yAxis: "기온", unit: "℃", step: 1, lo: 15, cells: 10, major: 5,
  series: [{ name: "교실", vals: L5S.room.vals }, { name: "복도", vals: L5S.hall.vals }] };
const L5S_MOOD = ["강낭콩 씨앗을 처음 심었다.", "흙을 뚫고 싹이 났다!", "잎이 두 장 더 나왔다.", "주말에 물을 못 줘서 잎이 시들었다.", "다시 물을 주니 잎이 살아났다.", "하얀 꽃이 피었다.", "덩굴이 쓰러져 막대를 세워 주었다.", "꼬투리를 처음 땄다!"];
function l5sMoodTable() {
  const g = L5S.mood;
  return h("div", { class: "l5tbl" }, h("div", { class: "l5tt" }, "주별 하은이의 기분 점수표"), h("table", {}, h("tbody", {},
    h("tr", {}, h("th", {}, "주"), h("th", {}, "가장 기억에 남는 일"), h("th", {}, "기분 점수(점)")),
    g.xs.map((x, i) => h("tr", {}, h("td", {}, x + "주"), h("td", { style: "text-align:left" }, L5S_MOOD[i]), h("td", {}, String(g.vals[i])))))));
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 강낭콩 관찰 연구소", lines: [
  "새싹초등학교 4학년 3반은 교실 창가와 학교 텃밭에서 강낭콩을 기르는 ‘강낭콩 관찰 연구소’를 열었어요. 연구소장 하은, 기록 담당 지우, 온도 담당 민준, 사진 담당 서진이 함께해요.",
  "몇 주 동안 강낭콩의 키, 잎의 수, 화분의 무게, 교실의 기온을 재어 기록하고, 시간에 따라 어떻게 변하는지 꺾은선그래프로 나타내고 읽어요.",
  "물결선으로 변화를 뚜렷하게 보고, 그래프를 보고 앞으로의 변화를 예상하며, 마지막에는 연구 발표회를 열어요."],
  one: "우리 반 강낭콩 관찰 연구소 · 강낭콩의 키와 교실의 기온을 재어 꺾은선그래프로 나타내고 변화를 읽어요." };
const UNIT_KEYWORDS = ["꺾은선그래프", "꺾은선", "점", "선분", "가로", "세로", "세로 눈금 한 칸의 크기", "물결선", "변화", "늘어남", "줄어듦", "기울어진 정도", "막대그래프", "제목", "예상", "관찰 기록"];

const LESSONS = [
{
  id: "g1", no: 1, title: "강낭콩 관찰 연구소를 열어요", soop: "개념 찾기(S)",
  question: "강낭콩이 자라는 모습처럼 시간에 따라 변하는 기록을 어떻게 나타내면 한눈에 보일까요?",
  summary: "4학년 3반은 강낭콩을 기르며 키와 교실의 기온을 기록하기로 했어요. 4학년 1학기에 배운 막대그래프를 떠올리고, 이 단원에서는 시간에 따라 변하는 자료를 점과 선분으로 나타낸 그래프를 배워요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "강낭콩 관찰 연구소의 첫 회의예요. 창가에 놓인 강낭콩 화분과 온도계를 떠올리며 세 칸에 써서 붙여요.", hints: ["강낭콩을 기르면서 날마다 잴 수 있는 것을 떠올려요.", "잰 기록이 날마다 어떻게 달라질지 생각해 봐요."],
      render: (b, a) => panes(b, a, [
        { t: "보여요", e: "👀", ph: "강낭콩을 기르면 ~을 잴 수 있어요", hint: "연구소에서 잴 수 있는 것", ex: ["강낭콩을 기르면 날마다 줄기의 키를 잴 수 있어요.", "창가 온도계로 교실의 기온을 시각마다 잴 수 있어요."] },
        { t: "생각해요", e: "💭", ph: "잰 기록은 ~로 나타내면 좋겠어요", hint: "기록을 정리했던 경험", ex: ["잰 기록은 표로 나타내면 정확하게 알 수 있어요.", "막대그래프로 나타내면 날마다의 키를 견줄 수 있을 것 같아요."] },
        { t: "궁금해요", e: "❓", ph: "~은 어떻게 나타낼까?", hint: "변하는 기록을 나타내는 방법에 대해 궁금한 것", ex: ["강낭콩이 자라는 모습이 한눈에 보이게 나타낼 수 있을까?", "재지 않은 날의 키도 그래프로 알 수 있을까?"] }],
        { ok: "연구소에서 잴 것이 아주 많아요! 시간에 따라 변하는 기록을 한눈에 보는 방법을 배워 봐요." }) },
    { name: "그려 보기 — 막대그래프 떠올리기", inst: "씨앗을 심고 일주일 뒤, 지우가 모둠별로 싹이 튼 강낭콩 수를 세어 표로 정리했어요. 4학년 1학기에 배운 막대그래프로 나타내 보세요. 세로 눈금 한 칸은 1개예요.", hints: ["모둠을 누르고 위아래로 끌어 막대를 세워요.", "3모둠은 9개이니 9칸만큼 세워요."],
      render: (b, a) => l5Build(b, a, { g: L5S.sprout, kind: "bar", table: true, ok: "막대의 길이로 강낭콩 수를 나타냈어요. 막대그래프는 모둠끼리 많고 적음을 견주기 편리해요." }) },
    { name: "말해 보기 — 점과 선으로 나타낸 그래프", inst: "온도 담당 민준이가 과학 선생님께 받은 그래프를 가져왔어요. 막대 대신 점을 찍고 선으로 이은 그래프예요. 그래프를 누르면 눈금 자가 나와요.", hints: ["0과 10 사이에 눈금이 5칸 있어요. 한 칸은 2 ℃예요.", "점이 가장 높이 찍힌 달을 찾아요."],
      render: thenWhy((b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.town, { cap: "(이야기 속 자료예요.)" }), q: "그래프의 가로는 무엇을 나타내나요?", t: "pick", o: ["월", "기온"], a: 0 },
        { q: "7월의 낮 최고 기온은 몇 ℃인가요?", t: "num", a: 30, unit: "℃", why: { "15": "7월의 점은 15칸 높이에 있어요. 세로 눈금 한 칸은 2 ℃예요.", "25": "0과 10 사이가 5칸이에요. 한 칸은 1 ℃가 아니라 2 ℃예요." } },
        { q: "낮 최고 기온이 가장 높은 달은 몇 월인가요?", t: "pick", o: ["5월", "7월", "8월", "9월"], a: 2 }],
        { ok: "점의 높이로 달마다의 기온을 알 수 있어요. 5월부터 8월까지는 선이 올라가고, 9월에는 내려가요." }),
        { q: "이 그래프를 보면 무엇을 한눈에 알 수 있을까요?", ph: "기온이 ~ 모습을 한눈에 알 수 있어요", help: ["① 선이 어느 쪽으로 기울어졌는지 봐요. → ② 그것이 기온의 어떤 모습을 보여 주는지 생각해요.", "‘달마다 기온이 ~하다가 ~하는 모습을 한눈에 알 수 있어요.’ 꼴로 써요."], ans: "달마다 기온이 점점 올라가다가 9월에 내려가는 모습을 한눈에 알 수 있어요." }) },
    { name: "약속하기 — 무엇을 배울까요", inst: "연구소가 이 단원에서 배울 것을 골라 보세요.", hints: ["강낭콩의 키는 시간이 흐르며 계속 변해요.", "그래프를 그리려면 눈금 한 칸의 크기를 정해야 해요."],
      render: (b, a) => quiz(b, a, [
        { q: "강낭콩의 키처럼 시간에 따라 변하는 기록은 어떻게 나타내면 변화가 잘 보일까요?", o: ["때마다 값을 점으로 찍고 점들을 선으로 이어요", "그림의 크기로 나타내요", "글로만 길게 써요"], a: 0 },
        { q: "점과 선으로 나타낸 그래프를 읽을 때 먼저 확인할 것은?", o: ["가로와 세로가 무엇을 나타내는지와 세로 눈금 한 칸의 크기", "선의 색깔과 굵기"], a: 0 },
        { q: "그래프를 보고 더 할 수 있는 일은 무엇일까요?", o: ["앞으로 어떻게 변할지 예상해 볼 수 있어요", "강낭콩의 색깔을 바꿀 수 있어요"], a: 0 }],
        { ok: "이 단원에서는 꺾은선그래프를 읽고, 그리고, 우리가 조사한 기록으로 만들어 앞으로의 변화도 예상해요." }) },
    { name: "확인하기 — 관찰 계획 세우기", inst: "강낭콩 관찰 연구소의 관찰 계획을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "강낭콩을 기르며 무엇을 재어 기록하고 싶나요?", tag: "잴 것", ph: "예) 강낭콩 줄기의 키", help: ["① 자로 재거나 셀 수 있는 것을 떠올려요. → ② 날마다 달라질 만한 것을 골라요.", "‘나는 강낭콩의 ~을 ~마다 재어 기록하고 싶어요.’ 꼴로 써요."], ans: "나는 강낭콩 줄기의 키를 이틀마다 재어 기록하고 싶어요." },
        { q: "기록이 어떻게 변할 것 같나요?", tag: "예상", ph: "예) 키가 점점 …", help: ["① 강낭콩이 자라는 모습을 떠올려요. → ② 처음과 나중을 견주어 써요.", "‘처음에는 ~하다가 시간이 지나면 ~할 것 같아요.’ 꼴로 써요."], ans: "처음에는 조금씩 자라다가 시간이 지나면 키가 빠르게 커질 것 같아요." }]) }
  ],
  challenge: { inst: "민준이가 가져온 ‘월별 우리 고장의 낮 최고 기온’ 그래프를 보고 물음에 답해 보세요.", hints: ["오른쪽 아래로 내려간 선분을 찾아요.", "8월은 32 ℃, 9월은 26 ℃예요."],
    render: (b, a) => l5Ask(b, a, [
      l5SegQ({ g: L5S.town, mode: "dec", q: "전월과 비교하여 기온이 가장 많이 내려간 때를 찾아 그 선분을 눌러 보세요." }),
      { q: "9월의 기온은 8월보다 몇 ℃ 낮아졌나요?", t: "num", a: 6, unit: "℃", why: { "26": "26 ℃는 9월의 기온이에요. 8월의 32 ℃와의 차이를 구해요.", "3": "8월의 점과 9월의 점은 3칸 차이 나요. 한 칸은 2 ℃예요." } }],
      { ok: "8월과 9월 사이 선분이 오른쪽 아래로 내려갔어요. 기온이 6 ℃ 낮아졌어요." }) }
},
{
  id: "g2", no: 2, title: "하은이 강낭콩의 키 ― 꺾은선그래프를 알아봐요", soop: "개념 구축하기(O)",
  question: "시간에 따라 변하는 기록을 점과 선분으로 나타내면 무엇이 편리할까요?",
  summary: "연속적으로 변화하는 양을 점으로 표시하고, 그 점들을 선분으로 이어 그린 그래프를 꺾은선그래프라고 해요. 선분이 기울어진 정도를 보면 변화를 한눈에 알 수 있고, 재지 않은 때의 값도 두 점 사이에서 어림할 수 있어요.",
  steps: [
    { name: "만져 보기 — 키를 점으로 찍기", inst: "연구소장 하은이가 10월 2일부터 이틀마다 강낭콩의 키를 재어 표로 정리했어요. 날짜마다 키만큼의 높이에 점을 찍어 보세요. 이웃한 점은 저절로 선분으로 이어져요.", hints: ["세로 눈금 한 칸은 1 cm예요. 8 cm는 8칸이에요.", "점을 누른 뒤 ▲ ▼ 단추로 한 칸씩 고칠 수 있어요."],
      render: ruleFirst((b, a) => l5Build(b, a, { g: L5S.hae, table: true, ok: "점을 찍고 선분으로 이으니 강낭콩이 자라는 모습이 한눈에 보여요!" }),
        { q: "점을 어느 높이에 찍으면 좋을까요?", ph: "내 규칙: 키가 ~ cm이면 ~", help: ["① 세로 눈금 한 칸이 몇 cm인지 봐요. → ② 키와 칸 수를 이어 생각해요.", "‘내 규칙: 키가 ~ cm이면 그 날짜 위 ~칸 높이에 점을 찍어요.’ 꼴로 써요."], ans: "세로 눈금 한 칸이 1 cm이므로 키가 몇 cm인지만큼 칸을 세어 그 날짜 위에 점을 찍어요. 8 cm이면 8칸 높이예요." }) },
    { name: "그려 보기 — 막대와 꺾은선 견주기", inst: "하은이의 기록을 막대그래프와 꺾은선그래프로 나타냈어요. 두 그래프를 견주어 보세요.", hints: ["㈎는 막대의 길이로, ㈏는 점과 선분으로 나타냈어요.", "선분이 기울어진 정도를 보면 많이 자랐는지 조금 자랐는지 바로 보여요."],
      render: thenWhy((b, a) => l5Ask(b, a, [
        { fig: () => l5Figs([{ lead: "㈎", g: L5V(L5S.hae, { kind: "bar" }) }, { lead: "㈏", g: L5S.hae }]), q: "두 그래프의 가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 날짜, 세로: 키", "가로: 키, 세로: 날짜"], a: 0 },
        { q: "두 그래프는 강낭콩의 키를 각각 어떻게 나타냈나요?", t: "pick", o: ["㈎는 막대로, ㈏는 점을 찍고 선분으로 이어서 나타냈어요", "㈎는 선분으로, ㈏는 막대로 나타냈어요"], a: 0 },
        { q: "키가 자라는 모습을 한눈에 알아보기 쉬운 그래프는 어느 것인가요?", t: "pick", o: ["㈎", "㈏"], a: 1, why: { "0": "㈎는 날짜마다의 키를 견주기 좋아요. 자라는 모습이 선으로 보이는 그래프는 어느 것일까요?" } }],
        { ok: "㈏처럼 점을 선분으로 이으면 선이 기울어진 정도로 변화를 한눈에 알 수 있어요." }),
        { q: "㈏ 그래프에서 키가 가장 많이 자란 때를 어떻게 한눈에 찾을 수 있을까요?", ph: "선분이 ~ 곳을 찾아요", help: ["① 선분이 오른쪽 위로 올라가는 모습을 봐요. → ② 많이 자란 때는 선분이 어떠한지 생각해요.", "‘선분이 오른쪽 위로 가장 ~ 곳을 찾으면 돼요.’ 꼴로 써요."], ans: "선분이 오른쪽 위로 가장 많이 기울어진 곳을 찾으면 돼요. 6일에서 8일 사이에 6 cm로 가장 많이 자랐어요." }) },
    { name: "말해 보기 — 재지 않은 날 어림하기", inst: "하은이는 7일에 결석해서 키를 재지 못했어요. 꺾은선그래프로 7일의 키를 어림해 볼까요?", hints: ["0과 5 사이에 눈금이 5칸 있어요.", "7일은 6일과 8일 사이예요. 6일 8 cm와 8일 14 cm를 이은 선분의 가운데쯤이에요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.hae, { tip: false }), q: "세로 눈금 한 칸은 몇 cm를 나타내나요?", t: "num", a: 1, unit: "cm", why: { "5": "0과 5 사이에 눈금이 5칸 있어요. 5칸이 5 cm이면 한 칸은 몇 cm일까요?" } },
        l5BetweenQ({ g: L5S.hae, at: 2.5, label: "7일", ans: 11, q: "7일 자리에 점을 찍고 키를 어림해 써 보세요.", why: { "8": "8 cm는 6일의 키예요. 7일에는 조금 더 자랐을 거예요.", "14": "14 cm는 8일의 키예요." } }),
        { q: "꺾은선그래프로 나타내면 어떤 점이 편리한가요?", t: "pick", o: ["재지 않은 날의 값도 두 점 사이의 선분을 보고 어림할 수 있어요", "날짜마다 키가 정확한 수로 쓰여 있어요"], a: 0 }],
        { ok: "7일의 키는 6일(8 cm)과 8일(14 cm)의 가운데쯤인 약 11 cm로 어림할 수 있어요. 꺾은선그래프는 두 점 사이에서 일정하게 변한다고 생각하고 어림해요." }) },
    { name: "약속하기 — 꺾은선그래프", inst: "약속을 완성해요.", hints: ["㈏ 그래프는 점을 찍고 선분으로 이었어요."],
      render: (b, a) => blanks(b, a, ["강낭콩의 키처럼 연속적으로 변화하는 양을 ", { o: ["점", "그림"], a: 0 }, "으로 표시하고, 그 점들을 ", { o: ["선분", "막대"], a: 0 }, "으로 이어 그린 그래프를 ", { o: ["꺾은선그래프", "막대그래프", "그림그래프"], a: 0 }, "라고 해요."]) },
    { name: "확인하기 — 어떤 그래프가 알맞을까", inst: "연구소에서 기록할 자료예요. 꺾은선그래프와 막대그래프 중 나타내기에 더 알맞은 그래프는 무엇일까요? 카드를 알맞은 상자에 넣어 보세요.", hints: ["하나의 대상이 시간에 따라 변하는 모습은 꺾은선그래프가 알맞아요.", "한 때에 여러 대상을 서로 견줄 때는 막대그래프가 알맞아요."],
      render: (b, a) => l5Sort(b, a, { bins: ["꺾은선그래프가 알맞아요", "막대그래프가 알맞아요"], cards: [
        { t: "날짜별 우리 반 강낭콩의 키", b: 0, why: "강낭콩의 키는 시간에 따라 이어서 변해요. 변화를 보기 좋은 그래프를 골라요." },
        { t: "모둠별로 수확한 강낭콩 꼬투리 수", b: 1, why: "같은 날 여러 모둠의 꼬투리 수를 견주는 자료예요." },
        { t: "하루 동안 시각별 교실의 기온", b: 0, why: "기온은 시각에 따라 이어서 변해요." },
        { t: "우리 반 학생들이 좋아하는 콩 요리", b: 1, why: "요리끼리 학생 수를 견주는 자료예요. 시간에 따라 변하는 자료가 아니에요." },
        { t: "주별 화분 흙의 온도", b: 0, why: "흙의 온도가 주마다 어떻게 변하는지 보는 자료예요." },
        { t: "콩의 종류별 씨앗 한 개의 무게", b: 1, why: "같은 때 여러 종류의 콩을 견주는 자료예요." }],
        ok: "꺾은선그래프는 하나의 대상이 시간에 따라 변하는 모습을, 막대그래프는 여러 대상의 크기를 견주기에 알맞아요. 어느 하나가 늘 더 좋은 것은 아니에요." }) }
  ],
  challenge: { inst: "민준이가 체육 시간마다 운동장 온도계를 읽어 꺾은선그래프로 나타냈어요. 물음에 답해 보세요.", hints: ["오전 10시 30분은 오전 10시와 오전 11시의 가운데예요.", "오른쪽 위로 가장 많이 올라간 선분을 찾아요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Fig(L5S.yard, { tip: false }), q: "오전 10시의 운동장 기온은 몇 ℃인가요?", t: "num", a: 16, unit: "℃" },
      l5BetweenQ({ g: L5S.yard, at: 1.5, label: "오전 10시 30분", ans: 18, q: "재지 않은 오전 10시 30분의 기온을 어림해 보세요.", why: { "16": "16 ℃는 오전 10시의 기온이에요.", "20": "20 ℃는 오전 11시의 기온이에요." } }),
      l5SegQ({ g: L5S.yard, mode: "inc", q: "한 시간 전과 비교하여 기온이 가장 많이 오른 때의 선분을 눌러 보세요." })],
      { ok: "오전 10시 30분은 16 ℃와 20 ℃의 가운데쯤인 약 18 ℃예요. 오전 10시와 오전 11시 사이에 4 ℃로 가장 많이 올랐어요." }) }
},
{
  id: "g3", no: 3, title: "교실 기온과 덩굴 강낭콩 ― 꺾은선그래프를 읽어요", soop: "개념 구축하기(O)",
  question: "꺾은선그래프를 보고 어떤 내용을 알 수 있을까요? 물결선은 왜 쓸까요?",
  summary: "선분이 오른쪽 위로 올라가면 늘어난 것이고, 오른쪽 아래로 내려가면 줄어든 것이에요. 많이 기울어질수록 변화가 커요. 물결선(≈)은 필요 없는 부분을 생략할 때 쓰고, 물결선을 쓰면 세로 눈금 한 칸을 작게 할 수 있어 변화가 뚜렷하게 보여요. 그래도 자료의 값은 그대로예요.",
  steps: [
    { name: "만져 보기 — 오르락내리락 표시하기", inst: "강낭콩은 따뜻해야 잘 자라요. 민준이가 한 주 동안 아침마다 교실의 기온을 재어 꺾은선그래프로 나타냈어요. 선분마다 기온이 올랐는지 내렸는지 표시해 보세요.", hints: ["선분이 오른쪽 위로 올라가면 늘어남이에요.", "화요일에서 수요일로 가는 선분은 오른쪽 아래로 내려가요."],
      render: ruleFirst((b, a) => l5Ask(b, a, [l5TrendQ({ g: L5S.morning, q: "선분을 눌러 늘어남·줄어듦·그대로를 표시해요." })],
        { ok: "월→화와 수→목은 선이 오른쪽 위로 올라가서 기온이 올랐고, 화→수와 목→금은 오른쪽 아래로 내려가서 기온이 내렸어요." }),
        { q: "선분의 모양을 보고 늘었는지 줄었는지 어떻게 알 수 있을까요?", ph: "내 규칙: 선분이 ~이면 ~", help: ["① 선분이 오른쪽으로 갈수록 올라가는지 내려가는지 봐요. → ② 그것이 늘어남인지 줄어듦인지 이어 봐요.", "‘내 규칙: 선분이 오른쪽 위로 가면 ~, 오른쪽 아래로 가면 ~이에요.’ 꼴로 써요."], ans: "선분이 오른쪽 위로 올라가면 늘어난 것이고, 오른쪽 아래로 내려가면 줄어든 것이에요. 평평하면 그대로예요." }) },
    { name: "그려 보기 — 그래프에서 내용 찾기", inst: "‘요일별 아침 교실의 기온’ 그래프를 보고 내용을 알아봐요.", hints: ["0과 5 사이에 눈금이 5칸 있어요.", "가장 많이 내려간 때는 오른쪽 아래로 가장 많이 기울어진 선분의 끝이에요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.morning), q: "세로 눈금 한 칸은 몇 ℃를 나타내나요?", t: "num", a: 1, unit: "℃", why: { "5": "0과 5 사이가 5칸이에요. 5칸이 5 ℃예요." } },
        l5PointQ({ g: L5S.morning, mode: "max", q: "아침 기온이 가장 높았던 요일의 점을 눌러 보세요." }),
        { q: "목요일의 아침 기온은 수요일보다 몇 ℃ 높나요?", t: "num", a: 4, unit: "℃", why: { "17": "17 ℃는 목요일의 기온이에요. 수요일과의 차이를 구해요.", "13": "13 ℃는 수요일의 기온이에요." } },
        l5SegQ({ g: L5S.morning, mode: "dec", q: "전날과 비교하여 기온이 가장 많이 내려간 때의 선분을 눌러 보세요." })],
        { ok: "목요일이 17 ℃로 가장 따뜻했어요. 화요일과 수요일 사이 선분이 오른쪽 아래로 가장 많이 기울어져서 수요일에 3 ℃로 가장 많이 내려갔어요." }) },
    { name: "말해 보기 — 물결선 만나기", inst: "서진이가 교문 옆 덩굴 강낭콩의 키를 이틀마다 재어 두 꺾은선그래프로 나타냈어요. 두 그래프를 견주어 보세요.", hints: ["㈏에는 0과 40 사이에 물결 모양의 선이 있어요.", "㈎는 0과 10 사이가 2칸, ㈏는 40과 45 사이가 5칸이에요."],
      render: thenWhy((b, a) => l5Ask(b, a, [
        { fig: () => l5Figs([{ lead: "㈎", g: L5S.vine }, { lead: "㈏", g: L5V(L5S.vine, { step: 1, lo: 40, cells: 15, major: 5 }) }]), q: "두 그래프의 다른 점을 모두 고르세요.", t: "pick", o: ["㈏에는 물결 모양의 선이 그려져 있어요", "세로 눈금 한 칸의 크기가 달라요", "조사한 강낭콩이 달라요", "가로에 나타낸 것이 달라요"], a: [0, 1], why: { "0,2": "두 그래프는 같은 강낭콩을 잰 같은 기록이에요.", "1,2": "두 그래프는 같은 강낭콩을 잰 같은 기록이에요.", "0,3": "두 그래프 모두 가로에 날짜를 나타냈어요.", "1,3": "두 그래프 모두 가로에 날짜를 나타냈어요." } },
        { q: "㈏에서 물결선은 몇 cm와 몇 cm 사이를 생략했나요?", t: "pick", o: ["0 cm와 40 cm 사이", "40 cm와 55 cm 사이", "0 cm와 10 cm 사이"], a: 0 },
        { q: "㈎의 세로 눈금 한 칸은 몇 cm인가요?", t: "num", a: 5, unit: "cm", why: { "10": "0과 10 사이가 2칸이에요. 한 칸은 몇 cm일까요?", "1": "1 cm는 ㈏의 눈금 한 칸이에요.", "2": "2는 0과 10 사이의 칸 수예요." } },
        { q: "㈏의 세로 눈금 한 칸은 몇 cm인가요?", t: "num", a: 1, unit: "cm", why: { "5": "40과 45 사이가 5칸이에요. 5 cm를 5칸으로 나누면?" } },
        { q: "덩굴 강낭콩의 키의 변화를 뚜렷하게 알 수 있는 그래프는 무엇인가요?", t: "pick", o: ["㈎", "㈏"], a: 1 }],
        { ok: "㈏는 물결선으로 0과 40 사이를 생략하고 눈금 한 칸을 1 cm로 작게 해서 변화가 뚜렷하게 보여요." }),
        { q: "지우가 “㈏에서는 선이 더 많이 기울었으니 덩굴 강낭콩이 더 많이 자랐네!”라고 했어요. 맞는 말일까요?", ph: "아니에요. 왜냐하면 ~", help: ["① 두 그래프가 같은 기록인지 떠올려요. → ② 물결선이 바꾸는 것과 바꾸지 않는 것을 생각해요.", "‘아니에요. 물결선은 ~을 생략해서 변화가 뚜렷하게 보일 뿐, ~은 그대로예요.’ 꼴로 써요."], ans: "아니에요. 물결선은 필요 없는 부분을 생략해서 변화가 뚜렷하게 보일 뿐, 강낭콩의 키는 두 그래프에서 똑같아요." }) },
    { name: "약속하기 — 물결선", inst: "물결선의 약속을 완성해요.", hints: ["물결선은 필요 없는 부분을 줄일 때 써요.", "물결선을 써도 자료의 값은 바뀌지 않아요."],
      render: (b, a) => blanks(b, a, ["물결선(≈)은 ", { o: ["일부분을 생략할", "값을 크게 할"], a: 0 }, " 때 사용해요. 물결선을 사용하면 세로 눈금 한 칸의 크기를 ", { o: ["작게", "크게"], a: 0 }, " 할 수 있어서 변화가 ", { o: ["뚜렷하게", "흐리게"], a: 0 }, " 보여요. 하지만 자료의 값은 ", { o: ["변하지 않아요", "커져요"], a: 0 }, "."]) },
    { name: "확인하기 — 묻고 답하기", inst: "㈏ 그래프를 보고 친구들과 묻고 답해요. “이틀 전과 비교하여 덩굴 강낭콩이 가장 많이 자란 때는 며칠일까?”", hints: ["오른쪽 위로 가장 많이 올라간 선분을 찾아요.", "가장 조금 자란 때는 가장 덜 기울어진 선분이에요."],
      render: (b, a) => l5Ask(b, a, [
        l5SegQ({ g: L5V(L5S.vine, { step: 1, lo: 40, cells: 15, major: 5 }), mode: "inc", q: "이틀 전과 비교하여 가장 많이 자란 때의 선분을 눌러 보세요." }),
        { q: "이틀 전과 비교하여 가장 조금 자란 때는 며칠인가요?", t: "pick", o: ["22일", "24일", "26일", "28일"], a: 1 },
        { q: "28일의 덩굴 강낭콩의 키는 몇 cm인가요?", t: "num", a: 52, unit: "cm", why: { "12": "12는 40에서부터 센 칸 수예요. 40 cm에 12칸(12 cm)을 더해요.", "50": "50에서 눈금 몇 칸 위인지 다시 세어 봐요." } }],
        { ok: "26일과 28일 사이 선분이 가장 많이 올라가서 28일에 4 cm로 가장 많이 자랐어요. 24일에는 1 cm만 자랐어요." }) }
  ],
  challenge: { inst: "지우의 강낭콩 키 그래프와 교문 옆 덩굴 강낭콩 그래프(다시 잰 기록)를 보고 답해 보세요.", hints: ["지우는 매주 월요일에 키를 쟀어요.", "21일은 20일과 22일의 가운데예요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Fig(L5S.jiwoo, { tip: false }), q: "3주의 지우 강낭콩의 키는 몇 cm인가요?", t: "num", a: 11, unit: "cm" },
      { q: "5주에는 4주보다 몇 cm 더 자랐나요?", t: "num", a: 1, unit: "cm", why: { "15": "15 cm는 5주의 키예요. 4주의 키와의 차이를 구해요." } },
      { q: "잘못 설명한 것을 고르세요.", t: "pick", o: ["㉠ 시간이 지남에 따라 지우 강낭콩의 키가 자랐어요.", "㉡ 전주와 비교하여 키가 가장 많이 자란 때는 2주예요."], a: 1, why: { "0": "선이 계속 오른쪽 위로 올라가니 키가 자란 것이 맞아요. 가장 많이 기울어진 선분을 찾아봐요." } },
      l5BetweenQ({ g: L5S.vine2, at: .5, label: "21일", ans: 43, q: "21일의 덩굴 강낭콩의 키는 약 몇 cm였을까요? 점을 찍고 써 보세요.", why: { "42": "42 cm는 20일의 키예요.", "44": "44 cm는 22일의 키예요." } })],
      { ok: "3주에 4 cm로 가장 많이 자랐으니 ㉡이 잘못이에요. 21일은 42 cm와 44 cm의 가운데쯤인 약 43 cm예요." }) }
},
{
  id: "g4", no: 4, title: "잎의 수와 화분의 무게 ― 꺾은선그래프로 나타내요", soop: "개념 구축하기(O)",
  question: "기록한 표를 꺾은선그래프로 나타내려면 어떻게 해야 할까요?",
  summary: "꺾은선그래프로 나타낼 때는 ① 가로와 세로에 무엇을 나타낼지 정하고 ② 물결선을 넣는다면 몇과 몇 사이에 넣을지 정해 그리고 ③ 가장 큰 수를 나타낼 수 있도록 눈금 한 칸의 크기를 정한 뒤 ④ 가로 눈금과 세로 눈금이 만나는 자리에 점을 찍고 선분으로 이은 다음 ⑤ 알맞은 제목을 써요.",
  steps: [
    { name: "만져 보기 — 표를 꺾은선그래프로", inst: "기록 담당 지우가 매주 월요일에 강낭콩 잎의 수를 세어 표로 정리했어요. 가로와 세로에 무엇을 나타낼지, 세로 눈금 한 칸의 크기, 제목을 정하고 점을 찍어 보세요. 세로 눈금은 15칸이에요.", hints: ["시간의 흐름(주)은 가로에, 변하는 양(잎의 수)은 세로에 나타내요.", "가장 큰 수 12장까지 나타내고, 모든 수가 눈금에 꼭 맞는 한 칸의 크기를 골라요."],
      render: ruleFirst((b, a) => l5Build(b, a, { g: L5S.leaf, table: true, axisPick: true, stepChoices: [1, 2, 5], titleChoices: ["좋아하는 콩 요리", "주별 지우 강낭콩의 잎의 수", "우리 반 학생 수"], ok: "가로에 주, 세로에 잎의 수를 나타내고 한 칸을 1장으로 정했어요. 4주에 잎이 가장 많이 늘었어요." }),
        { q: "세로 눈금 한 칸의 크기는 어떻게 정하면 좋을까요?", ph: "내 규칙: 한 칸을 ~으로 해요. 왜냐하면 ~", help: ["① 가장 큰 수와 칸 수(15칸)를 봐요. → ② 홀수인 7, 11도 눈금에 꼭 맞는지 생각해요.", "‘내 규칙: 가장 큰 수 ~장까지 나타내고 모든 수가 눈금에 맞도록 한 칸을 ~장으로 해요.’ 꼴로 써요."], ans: "한 칸을 1장으로 해요. 15칸이면 가장 큰 수 12장까지 나타낼 수 있고, 7장과 11장도 눈금에 꼭 맞기 때문이에요." }) },
    { name: "그려 보기 — 물결선이 있는 꺾은선그래프", inst: "하은이는 물을 언제 줄지 정하려고 날마다 화분의 무게를 쟀어요(3일 저녁에 물을 주었어요). 물결선이 있는 꺾은선그래프로 나타내 보세요. 세로 눈금은 12칸이에요.", hints: ["가장 가벼운 무게는 340 g이에요. 0 g과 330 g 사이에는 자료의 값이 없어요.", "330 g부터 12칸으로 352 g까지 나타내야 해요. 모든 수가 짝수예요."],
      render: (b, a) => l5Build(b, a, { g: L5S.pot, table: true, waveChoices: [0, 300, 330, 350], stepChoices: [1, 2, 5], ok: "물결선을 0 g과 330 g 사이에 넣고 세로 눈금 한 칸을 2 g으로 정했어요. 흙이 마르며 가벼워지다가 물을 준 다음 날 무거워진 모습이 뚜렷하게 보여요!" }),
      easy: (b, a) => l5Build(b, a, { g: L5S.jiwoo, table: true, stepChoices: [1, 2, 5], ok: "가장 큰 수 15 cm까지 15칸에 나타내려고 한 칸을 1 cm로 정했어요." }) },
    { name: "말해 보기 — 그릴 때 생각할 점", inst: "꺾은선그래프로 나타낼 때 생각해야 할 점이에요. 카드를 알맞은 상자에 넣어 보세요.", hints: ["물결선은 자료의 값이 없는 부분을 생략할 때 넣어요.", "세로 눈금 한 칸의 크기는 가장 큰 수까지 나타낼 수 있게 정해요."],
      render: (b, a) => l5Sort(b, a, { bins: ["가로와 세로", "물결선", "세로 눈금 한 칸의 크기", "제목"], cards: [
        { t: "가로에는 주를, 세로에는 잎의 수를 나타내요.", b: 0 },
        { t: "자료의 값이 없는 0 g과 330 g 사이를 생략할 수 있어요.", b: 1 },
        { t: "가장 큰 수 352 g까지 나타낼 수 있게 정해요.", b: 2 },
        { t: "무엇을 기록한 그래프인지 알 수 있게 붙여요.", b: 3 },
        { t: "변하는 양이 무엇인지 생각해서 세로에 나타내요.", b: 0 },
        { t: "가장 작은 수보다 위까지 생략하면 안 돼요.", b: 1 }],
        ok: "가로와 세로, 물결선, 세로 눈금 한 칸의 크기, 제목을 생각하며 그리면 알맞은 꺾은선그래프가 돼요." }) },
    { name: "약속하기 — 나타내는 차례", inst: "꺾은선그래프로 나타내는 방법을 정리해요. 하는 차례대로 눌러 보세요.", hints: ["가장 먼저 가로와 세로에 무엇을 나타낼지 정해요.", "점을 찍기 전에 물결선과 눈금 한 칸의 크기를 정해요. (제목은 먼저 써도 돼요.)"],
      render: (b, a) => sequence(b, a, ["가장 큰 수를 나타낼 수 있도록 눈금 한 칸의 크기 정하기", "알맞은 제목 쓰기", "가로와 세로에 무엇을 나타낼지 정하기", "점을 찍고 점들을 선분으로 잇기", "물결선을 넣을 곳을 정하고 물결선 그리기"], [2, 4, 0, 3, 1],
        { ok: "① 가로와 세로 정하기 ② 물결선 그리기 ③ 눈금 한 칸의 크기 정하기 ④ 점 찍고 선분으로 잇기 ⑤ 제목 쓰기예요. 제목은 먼저 써도 돼요." }) },
    { name: "확인하기 — 꼬투리 수 그래프", inst: "꽃이 지고 꼬투리가 열리기 시작했어요. 우리 반 강낭콩 꼬투리 수를 물결선이 있는 꺾은선그래프로 나타내 보세요. 세로 눈금은 25칸이에요.", hints: ["가장 작은 수는 12개, 가장 큰 수는 35개예요.", "물결선 위 첫 눈금을 10개로 하면 한 칸이 몇 개일 때 35개까지 나타낼 수 있을까요?"],
      render: (b, a) => l5Build(b, a, { g: L5S.pod, table: true, waveChoices: [0, 10, 15], stepChoices: [1, 2, 5], ok: "0개와 10개 사이에 물결선을 넣고 한 칸을 1개로 정했어요. 꼬투리 수가 주마다 늘어났어요." }) }
  ],
  challenge: { inst: "지우가 화분에 준 물의 양을 물결선이 있는 꺾은선그래프로 나타내 보세요. 세로 눈금은 10칸이에요.", hints: ["가장 작은 수는 46 mL, 가장 큰 수는 54 mL예요.", "물결선을 0 mL와 40 mL 사이에 넣으면 40 mL부터 10칸으로 54 mL까지 나타내야 해요."],
    render: (b, a) => l5Build(b, a, { g: L5S.water, table: true, waveChoices: [0, 30, 40, 50], stepChoices: [1, 2, 5], ok: "물결선을 0 mL와 40 mL 사이에 넣고 한 칸을 2 mL로 정했어요." }) }
},
{
  id: "g5", no: 5, title: "온도 모둠의 조사 ― 자료를 조사하여 나타내요", soop: "개념 구축하기(O)",
  question: "강낭콩이 자라는 교실의 기온을 직접 조사하여 꺾은선그래프로 나타내려면 어떻게 해야 할까요?",
  summary: "알고 싶은 것을 정하고, 언제 어떻게 잴지 정해 자료를 모은 뒤 표로 정리해요. 그다음 물결선과 세로 눈금 한 칸의 크기를 정해 꺾은선그래프로 나타내고, 그래프에서 알 수 있는 내용을 이야기해요.",
  steps: [
    { name: "만져 보기 — 무엇을 어떻게 조사할까", inst: "민준이네 온도 모둠은 ‘강낭콩이 있는 창가는 하루 동안 얼마나 따뜻할까?’가 궁금해졌어요. 조사 계획을 세워 보세요.", hints: ["하루 동안 기온이 어떻게 변하는지 알려면 여러 번 재야 해요.", "같은 곳에서 같은 간격으로 재야 견줄 수 있어요."],
      render: (b, a) => l5Ask(b, a, [
        { q: "무엇을 조사하면 좋을까요?", t: "pick", o: ["시각별 창가의 기온", "모둠별 좋아하는 계절", "반별 강낭콩 화분 수"], a: 0 },
        { q: "어떻게 재면 좋을까요?", t: "pick", o: ["같은 온도계로 오전 9시부터 1시간마다 재요", "생각날 때마다 아무 온도계로 재요", "하루에 한 번만 재요"], a: 0, why: { "1": "재는 때와 도구가 바뀌면 기록을 견주기 어려워요.", "2": "하루에 한 번만 재면 하루 동안의 변화를 알 수 없어요." } },
        { q: "조사한 기온은 어떤 그래프로 나타내면 변화가 잘 보일까요?", t: "pick", o: ["꺾은선그래프", "그림그래프"], a: 0 }],
        { ok: "오전 9시부터 1시간마다 같은 온도계로 창가의 기온을 재고, 표로 정리해 꺾은선그래프로 나타내기로 했어요." }) },
    { name: "그려 보기 — 온도계 읽어 표 만들기", inst: "민준이가 시각마다 찍어 둔 온도계 사진이에요. 온도계를 읽어 표를 완성해 보세요.", hints: ["작은 눈금 한 칸은 1 ℃예요.", "긴 눈금(15, 20, 25)에서부터 몇 칸 위인지 세어요."],
      render: (b, a) => l5sThermo(b, a, { g: L5S.room, lo: 10, hi: 30, title: "시각별 창가 온도계(℃)", ok: "오전 9시 17 ℃, 10시 19 ℃, 11시 22 ℃, 낮 12시 24 ℃, 오후 1시 25 ℃, 오후 2시 23 ℃예요." }) },
    { name: "말해 보기 — 꺾은선그래프로 나타내기", inst: "표를 보고 꺾은선그래프로 나타내요. 세로 눈금은 10칸이에요. 물결선을 넣을 곳과 세로 눈금 한 칸의 크기를 정해 보세요.", hints: ["가장 낮은 기온은 17 ℃예요. 0 ℃와 15 ℃ 사이에는 자료의 값이 없어요.", "15 ℃부터 10칸으로 25 ℃까지 나타내려면 한 칸은 몇 ℃일까요?"],
      render: thenWhy((b, a) => l5Build(b, a, { g: L5S.room, table: true, waveChoices: [0, 10, 15, 20], stepChoices: [1, 2, 5], ok: "0 ℃와 15 ℃ 사이에 물결선을 넣고 한 칸을 1 ℃로 정했어요. 하루 동안 기온이 오르다가 내려가는 모습이 잘 보여요!" }),
        { q: "물결선을 0 ℃와 20 ℃ 사이에 넣으면 왜 안 될까요?", ph: "왜냐하면 ~", help: ["① 가장 낮은 기온이 몇 ℃인지 찾아요. → ② 20 ℃까지 생략하면 그 기온을 나타낼 수 있는지 생각해요.", "‘왜냐하면 가장 낮은 기온이 ~ ℃라서 20 ℃까지 생략하면 ~을 나타낼 수 없기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 가장 낮은 기온이 17 ℃라서 20 ℃까지 생략하면 오전 9시와 10시의 기온을 나타낼 수 없기 때문이에요." }) },
    { name: "약속하기 — 조사하여 나타내는 차례", inst: "자료를 조사하여 꺾은선그래프로 나타내는 차례를 정리해요. 하는 차례대로 눌러 보세요.", hints: ["먼저 무엇이 궁금한지 정해요.", "그래프를 그린 다음에 알 수 있는 내용을 이야기해요."],
      render: (b, a) => sequence(b, a, ["표로 정리하기", "알 수 있는 내용 이야기하기", "알고 싶은 것과 조사 방법 정하기", "꺾은선그래프로 나타내기", "자료를 재어 모으기"], [2, 4, 0, 3, 1],
        { ok: "알고 싶은 것과 조사 방법 정하기 → 자료 모으기 → 표로 정리하기 → 꺾은선그래프로 나타내기 → 알 수 있는 내용 이야기하기 차례예요." }) },
    { name: "확인하기 — 우리 그래프 읽기", inst: "온도 모둠이 완성한 그래프를 보고 알 수 있는 내용을 찾아보세요.", hints: ["점이 가장 높은 시각을 찾아요.", "오른쪽 위로 가장 많이 올라간 선분을 찾아요."],
      render: (b, a) => l5Ask(b, a, [
        l5PointQ({ g: L5S.room, mode: "max", q: "창가의 기온이 가장 높았던 시각의 점을 눌러 보세요." }),
        l5SegQ({ g: L5S.room, mode: "inc", q: "한 시간 전과 비교하여 기온이 가장 많이 오른 때의 선분을 눌러 보세요." }),
        { q: "기온이 내려가기 시작한 때는 언제인가요?", t: "pick", o: ["오전 11시", "낮 12시", "오후 1시", "오후 2시"], a: 3, why: { "2": "오후 1시에는 낮 12시보다 기온이 올랐어요. 선분이 처음으로 오른쪽 아래로 내려간 곳을 찾아요." } }],
        { ok: "오후 1시에 25 ℃로 가장 따뜻했고, 오전 10시와 11시 사이에 3 ℃로 가장 많이 올랐어요. 오후 2시에는 기온이 내려가기 시작했어요." }) }
  ],
  challenge: { inst: "사진 담당 서진이가 매주 잰 강낭콩의 키를 꺾은선그래프로 나타내 보세요. 세로 눈금은 10칸이에요.", hints: ["가장 큰 수는 18 cm예요. 10칸으로 18 cm까지 나타내려면?", "한 칸이 2 cm이면 10 cm는 5칸이에요."],
    render: (b, a) => l5Build(b, a, { g: L5S.seo, table: true, stepChoices: [1, 2, 5], ok: "가장 큰 수 18 cm를 10칸에 나타내도록 한 칸을 2 cm로 정했어요. 서진이 강낭콩은 매주 4 cm씩 자랐어요." }) }
},
{
  id: "g6", no: 6, title: "교실과 복도 ― 공학 도구와 두 줄 꺾은선그래프", soop: "탐구 정리하기(O)",
  question: "공학 도구로 그래프를 그리고, 두 곳의 기록을 한 그래프에 나타내면 무엇을 알 수 있을까요?",
  summary: "공학 도구를 쓰면 표에 수를 넣는 것만으로 꺾은선그래프가 그려지고, 눈금 한 칸의 크기와 물결선을 바꾸어 보며 알맞은 모양을 고를 수 있어요. 한 꺾은선그래프에 두 가지 변화를 함께 나타내면 두 기록을 견주기 편리해요.",
  steps: [
    { name: "만져 보기 — 공학 도구로 그리기", inst: "다른 모둠은 같은 날 복도의 기온을 쟀어요. 공학 도구처럼 표에 수를 넣으면 꺾은선그래프가 바로 그려져요. 간격과 물결선을 바꾸어 보세요.", hints: ["오전 9시부터 16, 17, 19, 21, 21, 20(℃)이에요.", "간격을 1로 두고 물결선을 넣으면 변화가 가장 뚜렷해요."],
      render: (b, a) => l5Tool(b, a, { g: L5S.hall, pre: l5sNote("복도 모둠의 기록 쪽지", ["오전 9시 16 ℃ · 오전 10시 17 ℃ · 오전 11시 19 ℃", "낮 12시 21 ℃ · 오후 1시 21 ℃ · 오후 2시 20 ℃"]), ok: "간격이 작을수록, 물결선을 넣을수록 변화가 뚜렷하게 보여요. 하지만 기온의 값은 그대로예요." }) },
    { name: "그려 보기 — 한 그래프에 두 줄", inst: "교실의 기온 그래프(흐린 선) 위에 복도의 기온을 파란 점으로 찍어 한 그래프에 나타내 보세요.", hints: ["세로 눈금 한 칸은 1 ℃이고, 물결선 위 첫 눈금은 15 ℃예요.", "낮 12시와 오후 1시의 복도 기온은 21 ℃로 같아요."],
      render: (b, a) => { b.append(l5Table(L5S.hall)); l5Build(b, a, { g: L5V(L5S.both, { series: null, vals: L5S.hall.vals }), bg: { name: "교실", vals: L5S.room.vals }, name: "복도", color: L5_LINE2, ok: "한 그래프에 교실과 복도의 기온을 함께 나타냈어요. 두 곳의 차이가 한눈에 보여요!" }); } },
    { name: "말해 보기 — 두 줄 그래프 읽기", inst: "‘시각별 교실과 복도의 기온’ 그래프를 보고 답해 보세요.", hints: ["두 선 사이가 가장 많이 벌어진 시각을 찾아요.", "평평한 선분은 기온이 그대로인 때예요."],
      render: thenWhy((b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.both), q: "낮 12시에 교실은 복도보다 몇 ℃ 높나요?", t: "num", a: 3, unit: "℃", why: { "24": "24 ℃는 낮 12시 교실의 기온이에요. 복도와의 차이를 구해요.", "21": "21 ℃는 낮 12시 복도의 기온이에요." } },
        { q: "두 곳의 기온 차이가 가장 큰 시각은 언제인가요?", t: "pick", o: ["오전 9시", "오전 11시", "낮 12시", "오후 1시"], a: 3 },
        { q: "복도의 기온이 한 시간 전과 같았던 때는 언제인가요?", t: "pick", o: ["오전 10시", "낮 12시", "오후 1시", "오후 2시"], a: 2 }],
        { ok: "오후 1시에 교실 25 ℃, 복도 21 ℃로 4 ℃ 차이가 가장 커요. 복도는 낮 12시와 오후 1시의 기온이 같아서 선분이 평평해요." }),
        { q: "창가 교실이 복도보다 더 따뜻한 까닭은 무엇일까요? 그래프를 보고 생각해 써요.", ph: "그래프를 보면 ~. 왜냐하면 ~", help: ["① 두 선 중 어느 쪽이 계속 위에 있는지 봐요. → ② 창가에 무엇이 비치는지 떠올려요.", "‘그래프를 보면 교실 선이 늘 ~에 있어요. 창가에는 ~이 들어오기 때문인 것 같아요.’ 꼴로 써요."], ans: "그래프를 보면 교실 선이 늘 복도 선보다 위에 있어요. 창가에는 햇빛이 들어오기 때문인 것 같아요." }) },
    { name: "약속하기 — 여러 변화를 한 그래프에", inst: "알게 된 것을 정리해요.", hints: ["두 선의 색을 다르게 하고 무엇을 나타내는지 적어 두어요.", "공학 도구에서도 간격과 물결선을 우리가 정해요."],
      render: (b, a) => blanks(b, a, ["한 꺾은선그래프에 ", { o: ["두 가지 이상", "한 가지만"], a: 0 }, "의 변화를 함께 나타낼 수 있어요. 이때 선의 ", { o: ["색이나 모양", "두께만"], a: 0 }, "을 다르게 하고 무엇을 나타내는지 적어요. 공학 도구로 그릴 때도 ", { o: ["눈금 한 칸의 크기", "점의 색"], a: 0 }, "와 물결선을 알맞게 정해야 변화가 잘 보여요."]) },
    { name: "확인하기 — 모둠 발표 준비", inst: "두 모둠의 기록을 함께 본 결과를 연구 일지에 써 보세요.",
      render: (b, a) => { b.append(l5Fig(L5S.both, { tip: false })); writeStep(b, a, [
        { q: "그래프에서 알 수 있는 사실을 하나 써 보세요.", tag: "사실", ph: "예) 오후 1시에 …", help: ["① 두 선이 가장 높거나 많이 벌어진 곳을 찾아요. → ② 시각과 기온을 함께 써요.", "‘~시에 교실은 ~ ℃, 복도는 ~ ℃로 ~’ 꼴로 써요."], ans: "오후 1시에 교실은 25 ℃, 복도는 21 ℃로 기온 차이가 4 ℃로 가장 컸어요." },
        { q: "강낭콩 화분을 어디에 두면 좋을지 그래프를 근거로 써 보세요.", tag: "의견", ph: "예) 화분은 …에 두면 좋겠어요", help: ["① 강낭콩은 따뜻한 곳에서 잘 자란다는 것을 떠올려요. → ② 어느 곳이 더 따뜻했는지 그래프에서 찾아요.", "‘~가 하루 내내 더 따뜻했으므로 화분은 ~에 두면 좋겠어요.’ 꼴로 써요."], ans: "창가 교실이 하루 내내 복도보다 더 따뜻했으므로 화분은 교실 창가에 두면 좋겠어요." }]); } }
  ],
  challenge: { inst: "‘시각별 교실과 복도의 기온’ 그래프를 보고 답해 보세요.", hints: ["‘교실’ 선에서 오른쪽 위로 가장 많이 올라간 선분을 찾아요.", "복도의 선은 오후 2시에 내려갔어요."],
    render: (b, a) => l5Ask(b, a, [
      l5SegQ({ g: L5S.both, si: 0, mode: "inc", q: "교실의 기온이 한 시간 전보다 가장 많이 오른 때의 선분을 눌러 보세요." }),
      { q: "오후 2시에 교실은 복도보다 몇 ℃ 높나요?", t: "num", a: 3, unit: "℃" },
      { q: "복도의 기온은 오전 9시부터 오후 2시까지 계속 올라갔어요.", t: "ox", a: false, why: { "o": "복도의 선분을 하나씩 봐요. 평평한 곳과 내려간 곳이 있어요." } }],
      { ok: "교실은 오전 11시에 3 ℃로 가장 많이 올랐어요. 복도는 낮 12시~오후 1시에 그대로였다가 오후 2시에 내려갔어요." }) }
},
{
  id: "g7", no: 7, title: "텃밭 강낭콩 ― 그래프로 앞날을 예상해요", soop: "개념 구축하기(O)",
  question: "꺾은선그래프를 보고 앞으로의 변화를 어떻게 예상할 수 있을까요?",
  summary: "꺾은선그래프에서 선이 계속 오른쪽 위로 올라가면 앞으로도 늘어날 것이라고 예상할 수 있어요. 하지만 예상은 꼭 맞는 것은 아니에요. 두 그래프를 견주면 두 자료가 함께 어떻게 변하는지도 알 수 있어요.",
  steps: [
    { name: "만져 보기 — 텃밭 강낭콩의 키 읽기", inst: "학교 텃밭에 심은 강낭콩도 연구소가 매주 키를 재었어요. 그래프를 보고 답해 보세요. 그래프를 누르면 눈금 자가 나와요.", hints: ["0과 5 사이가 5칸이에요. 한 칸은 1 cm예요.", "오른쪽 위로 가장 많이 올라간 선분을 찾아요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.garden), q: "4주의 텃밭 강낭콩의 키는 몇 cm인가요?", t: "num", a: 18, unit: "cm" },
        { q: "시간이 지남에 따라 텃밭 강낭콩의 키는 어떻게 변했나요?", t: "pick", o: ["계속 늘어났어요", "계속 줄어들었어요", "늘었다가 줄어들었어요"], a: 0 },
        l5SegQ({ g: L5S.garden, mode: "inc", q: "전주와 비교하여 가장 많이 자란 때의 선분을 눌러 보세요." })],
        { ok: "텃밭 강낭콩은 매주 자랐고, 3주와 4주 사이에 6 cm로 가장 많이 자랐어요." }) },
    { name: "그려 보기 — 7주에는 어떻게 될까", inst: "하은이가 “다음 주(7주)에는 텃밭 강낭콩의 키가 어떻게 될까?” 하고 물었어요. 그래프를 보고 예상해 보세요.", hints: ["1주부터 6주까지 선이 어느 쪽으로 이어지는지 봐요.", "예상은 그래프의 흐름을 보고 하는 것이라 꼭 맞지는 않아요."],
      render: thenWhy((b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.garden, { tip: false }), q: "7주의 키는 어떻게 될 것 같나요?", t: "pick", o: ["27 cm보다 더 클 것 같아요", "27 cm보다 작아질 것 같아요", "0 cm가 될 것 같아요"], a: 0, why: { "1": "강낭콩의 키는 1주부터 6주까지 한 번도 줄어든 적이 없어요." } },
        { q: "지우가 “7주에는 반드시 32 cm가 될 거야.”라고 했어요. 알맞은 생각은?", t: "pick", o: ["그래프로 예상할 수는 있지만 꼭 그렇게 된다고 말할 수는 없어요", "그래프로 예상한 것은 언제나 꼭 맞아요"], a: 0 }],
        { ok: "1주부터 6주까지 계속 자랐으니 7주에도 더 자랄 것 같아요. 하지만 날씨나 물 주기에 따라 달라질 수 있어서 예상이 꼭 맞지는 않아요." }),
        { q: "7주의 키를 그렇게 예상한 까닭을 써 보세요.", ph: "왜냐하면 ~", help: ["① 1주부터 6주까지 선이 어느 쪽으로 갔는지 봐요. → ② 그 흐름이 이어진다고 생각해요.", "‘왜냐하면 1주부터 6주까지 키가 계속 ~ 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 1주부터 6주까지 선이 계속 오른쪽 위로 올라가서 키가 계속 자랐기 때문이에요." }) },
    { name: "말해 보기 — 두 그래프 견주기", inst: "서진이가 같은 텃밭 강낭콩의 잎의 수도 세어 그래프로 나타냈어요. 두 그래프를 견주어 보세요.", hints: ["두 그래프 모두 선이 어느 쪽으로 가는지 봐요.", "키가 클 때 잎의 수는 어떠했는지 견주어요."],
      render: thenWhy((b, a) => l5Ask(b, a, [
        { fig: () => l5Figs([{ lead: "키", g: L5S.garden }, { lead: "잎의 수", g: L5S.gleaf }]), q: "두 그래프는 각각 어떻게 변했나요?", t: "pick", o: ["키와 잎의 수 모두 계속 늘어났어요", "키는 늘어나고 잎의 수는 줄어들었어요", "둘 다 변하지 않았어요"], a: 0 },
        { q: "6주의 잎의 수는 몇 장인가요?", t: "num", a: 14, unit: "장" },
        { q: "두 그래프는 어떤 관계가 있을까요?", t: "pick", o: ["강낭콩의 키가 자람에 따라 잎의 수도 늘어나요", "강낭콩의 키가 자랄수록 잎의 수는 줄어들어요"], a: 0 }],
        { ok: "두 그래프 모두 오른쪽 위로 올라가요. 강낭콩의 키가 자람에 따라 잎의 수도 늘어났어요." }),
        { q: "두 그래프를 함께 보면 무엇이 좋을까요?", ph: "두 그래프를 함께 보면 ~", help: ["① 그래프 하나만 볼 때와 둘을 함께 볼 때를 견주어요. → ② 알 수 있는 관계를 떠올려요.", "‘두 그래프를 함께 보면 ~이 변할 때 ~도 어떻게 변하는지 알 수 있어요.’ 꼴로 써요."], ans: "두 그래프를 함께 보면 강낭콩의 키가 자랄 때 잎의 수도 어떻게 변하는지 알 수 있어요." }) },
    { name: "약속하기 — 그래프로 예상하기", inst: "알게 된 것을 정리해요.", hints: ["선이 오른쪽 위로 이어지면 늘어나는 흐름이에요.", "예상은 꼭 맞는 것이 아니에요."],
      render: (b, a) => blanks(b, a, ["꺾은선그래프에서 선이 계속 오른쪽 위로 올라가면 앞으로도 ", { o: ["늘어날", "줄어들"], a: 0 }, " 것이라고 예상할 수 있어요. 하지만 예상은 ", { o: ["꼭 맞는 것은 아니에요", "언제나 꼭 맞아요"], a: 0 }, ". 두 꺾은선그래프를 견주면 두 자료가 ", { o: ["함께 어떻게 변하는지", "어느 쪽이 더 예쁜지"], a: 0 }, " 알 수 있어요."]) },
    { name: "확인하기 — 생활 속 꺾은선그래프", inst: "신문, 뉴스, 책, 누리집에서 본 꺾은선그래프를 떠올려 연구 일지에 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "어디에서 어떤 꺾은선그래프를 보았나요?", tag: "찾기", ph: "예) 뉴스에서 …을 나타낸 그래프", help: ["① 시간에 따라 변하는 것을 보여 주던 그래프를 떠올려요. → ② 제목처럼 써요.", "‘~에서 연도별(월별) ~을 나타낸 꺾은선그래프를 보았어요.’ 꼴로 써요."], ans: "날씨 뉴스에서 월별 평균 기온을 나타낸 꺾은선그래프를 보았어요." },
        { q: "그 그래프로 알 수 있는 내용이나 예상을 써 보세요.", tag: "알 수 있는 것", ph: "예) 시간이 지남에 따라 …", help: ["① 선이 어느 쪽으로 기울어졌는지 떠올려요. → ② 앞으로 어떻게 될지도 써 봐요.", "‘시간이 지남에 따라 ~이 ~하고 있어서 앞으로 ~할 것 같아요.’ 꼴로 써요."], ans: "여름까지는 기온이 올라가다가 가을부터 내려가서 12월에는 더 추워질 것 같아요." }]) }
  ],
  challenge: { inst: "급식실 선생님께 받은 ‘연도별 우리 학교 텃밭 강낭콩 수확량’ 그래프예요. 답해 보세요.", hints: ["오른쪽 아래로 내려간 선분은 하나뿐이에요.", "2022년부터 2024년까지 선이 계속 올라가요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Fig(L5S.harvest, { cap: "(이야기 속 자료예요.)" }), q: "전년과 비교하여 수확량이 줄어든 때는 몇 년인가요?", t: "pick", o: ["2021년", "2022년", "2023년", "2024년"], a: 1 },
      l5SegQ({ g: L5S.harvest, mode: "inc", q: "전년과 비교하여 수확량이 가장 많이 늘어난 때의 선분을 눌러 보세요." }),
      { q: "2025년의 수확량은 어떻게 될 것 같나요?", t: "pick", o: ["늘어날 것 같아요(2022년부터 계속 늘어났으니까요)", "줄어들 것 같아요(2022년에 줄어들었으니까요)"], a: 0 }],
      { ok: "2022년에만 줄었고, 2023년에 4 kg으로 가장 많이 늘었어요. 2022년부터 계속 늘어나서 2025년에도 늘어날 것 같아요." }) }
},
{
  id: "g8", no: 8, title: "생각을 더하다 ― 콩나물과 두부의 가격", soop: "탐구 정리하기(O)",
  question: "가격 그래프를 보고 물건값의 변화를 어떻게 읽고 예상할 수 있을까요?",
  summary: "가로·세로, 세로 눈금 한 칸, 물결선이 나타내는 것을 먼저 확인하면 가격 그래프도 읽을 수 있어요. 한 그래프에 두 물건의 가격을 나타내면 두 가격의 변화를 견줄 수 있어요. 물건값은 재료 값뿐 아니라 여러 까닭으로 오르내리므로 재료 값과 늘 같이 변하지는 않아요.",
  steps: [
    { name: "만져 보기 — 두 물건의 가격 그래프", inst: "강낭콩처럼 콩으로 만드는 먹을거리가 궁금해진 연구소는 급식실 영양 선생님께 어느 가게의 콩나물과 두부 가격 기록을 받았어요. 그래프를 살펴보세요.", hints: ["1000과 1500 사이에 눈금이 5칸 있어요.", "두 선이 모두 어느 쪽으로 기울어졌는지 봐요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.price, { cap: "(이야기 속 자료예요. 점 옆의 수가 가격이에요.)" }), q: "그래프의 가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 연도, 세로: 가격", "가로: 가격, 세로: 연도"], a: 0 },
        { q: "세로 눈금 한 칸은 몇 원을 나타내나요?", t: "num", a: 100, unit: "원", why: { "500": "1000과 1500 사이가 5칸이에요. 500원을 5칸으로 나누면?", "5": "5는 1000과 1500 사이의 칸 수예요." } },
        { q: "그래프에서 물결선은 무엇을 나타내나요?", t: "pick", o: ["0원과 1000원 사이를 생략했어요", "가격이 0원이 되었어요"], a: 0 },
        { q: "콩나물과 두부의 가격은 각각 어떻게 변했나요?", t: "pick", o: ["둘 다 2020년부터 계속 올랐어요", "콩나물은 오르고 두부는 내렸어요", "둘 다 계속 내렸어요"], a: 0 }],
        { ok: "세로 눈금 한 칸은 100원이고, 콩나물과 두부의 가격은 모두 해마다 올랐어요." }) },
    { name: "그려 보기 — 가장 많이 오른 때", inst: "두 물건의 가격이 언제 가장 많이 올랐는지 찾아보세요.", hints: ["점 옆에 쓰인 가격을 빼서 견주어요.", "두부: 1680→1720→1890→2050원이에요."],
      render: (b, a) => l5Ask(b, a, [
        l5SegQ({ g: L5S.price, si: 1, mode: "inc", q: "두부의 가격이 전년보다 가장 많이 오른 때의 선분을 눌러 보세요." }),
        { q: "콩나물의 가격이 전년보다 가장 많이 오른 때는 몇 년인가요?", t: "pick", o: ["2021년", "2022년", "2023년"], a: 2 },
        { q: "2023년에 두부는 콩나물보다 몇 원 더 비싼가요?", t: "num", a: 520, unit: "원", why: { "3580": "두 가격을 더하지 말고 차이를 구해요. 2050−1530을 계산해요." } }],
        { ok: "두부는 2022년에 170원, 콩나물은 2023년에 120원으로 가장 많이 올랐어요. 2023년에 두부는 콩나물보다 520원 더 비싸요." }) },
    { name: "말해 보기 — 2024년의 가격 예상", inst: "그래프를 보고 2024년의 가격을 예상해 보세요.", hints: ["2020년부터 2023년까지 두 선이 어느 쪽으로 이어졌는지 봐요.", "예상은 꼭 맞는 것이 아니에요."],
      render: thenWhy((b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.price, { tip: false }), q: "2024년에 두 물건의 가격은 어떻게 될 것 같나요?", t: "pick", o: ["둘 다 오를 것 같아요", "둘 다 내릴 것 같아요"], a: 0 },
        { q: "그 예상에 대한 알맞은 생각은?", t: "pick", o: ["그래프의 흐름으로 예상한 것이라 실제로는 달라질 수도 있어요", "그래프로 예상했으니 반드시 그렇게 돼요"], a: 0 }],
        { ok: "2020년부터 계속 올랐으니 2024년에도 오를 것 같아요. 하지만 실제 가격은 달라질 수 있어요." }),
        { q: "2024년의 가격을 그렇게 예상한 까닭을 써 보세요.", ph: "왜냐하면 ~", help: ["① 두 선이 해마다 어느 쪽으로 갔는지 봐요. → ② 그 흐름을 근거로 써요.", "‘왜냐하면 2020년부터 2023년까지 두 물건의 가격이 계속 ~ 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 2020년부터 2023년까지 콩나물과 두부의 가격이 해마다 계속 올랐기 때문이에요." }) },
    { name: "약속하기 — 꼭 같이 변할까?", inst: "두부는 콩으로 만들어요. 같은 가게의 ‘연도별 콩(1 kg)의 가격’ 그래프를 두부 가격과 견주어 보세요.", hints: ["콩 가격 그래프에서 2020년과 2021년 사이 선분을 봐요.", "그때 두부 가격은 1680원에서 1720원이 되었어요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.bean, { cap: "(이야기 속 자료예요.)" }), q: "2021년에 콩의 가격은 전년보다 어떻게 되었나요?", t: "pick", o: ["올랐어요", "내렸어요", "그대로예요"], a: 1 },
        { q: "2021년에 두부의 가격은 전년보다 어떻게 되었나요?", t: "pick", o: ["올랐어요", "내렸어요", "그대로예요"], a: 0 },
        { q: "재료인 콩의 가격이 내려가면 두부의 가격도 반드시 내려가요.", t: "ox", a: false, why: { "o": "2021년을 봐요. 콩 가격은 내렸지만 두부 가격은 올랐어요." } }],
        { ok: "물건값은 재료 값뿐 아니라 옮기는 비용, 만드는 비용 등 여러 까닭으로 달라져요. 재료 값과 물건값이 늘 같이 변하지는 않아요." }) },
    { name: "확인하기 — 장보기 쪽지 쓰기", inst: "가격 그래프를 보고 집에 가져갈 장보기 쪽지를 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "그래프에서 알 수 있는 사실을 써 보세요.", tag: "사실", ph: "예) 두부 가격은 …", help: ["① 두부와 콩나물 가운데 하나를 골라요. → ② 처음과 마지막 가격, 가장 많이 오른 때를 써요.", "‘~의 가격은 2020년 ~원에서 2023년 ~원으로 올랐고, ~년에 가장 많이 올랐어요.’ 꼴로 써요."], ans: "두부의 가격은 2020년 1680원에서 2023년 2050원으로 올랐고, 2022년에 가장 많이 올랐어요." },
        { q: "가격 그래프를 보면 생활에서 어떤 점이 편리할까요?", tag: "편리한 점", ph: "예) 장을 볼 때 …", help: ["① 가격의 흐름을 알면 무엇을 미리 할 수 있을지 생각해요. → ② 한 문장으로 써요.", "‘가격 그래프를 보면 ~을 알 수 있어서 ~할 때 도움이 돼요.’ 꼴로 써요."], ans: "가격 그래프를 보면 물건값이 어떻게 변해 왔는지 알 수 있어서 용돈이나 장 볼 돈을 계획할 때 도움이 돼요." }]) }
  ],
  challenge: { inst: "‘연도별 콩(1 kg)의 가격’ 그래프를 보고 답해 보세요.", hints: ["세로 눈금 한 칸은 100원이에요.", "오른쪽 위로 가장 많이 올라간 선분을 찾아요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Fig(L5S.bean, { tip: false }), q: "2023년의 콩 가격은 몇 원인가요?", t: "num", a: 7800, unit: "원" },
      l5SegQ({ g: L5S.bean, mode: "inc", q: "전년과 비교하여 콩 가격이 가장 많이 오른 때의 선분을 눌러 보세요." }),
      { q: "2023년의 콩 가격은 2020년보다 몇 원 올랐나요?", t: "num", a: 600, unit: "원", why: { "300": "300원은 2022년에서 2023년 사이에 오른 값이에요. 2020년 7200원과 견주어요." } }],
      { ok: "2022년에 600원으로 가장 많이 올랐어요. 2023년 7800원은 2020년 7200원보다 600원 비싸요." }) }
},
{
  id: "g9", no: 9, title: "놀이를 더하다 ― 관찰 기간 나의 기분 그래프", soop: "발표하기(P)",
  question: "강낭콩을 기르는 동안 나의 기분은 어떻게 변했을까요?",
  summary: "주마다 가장 기억에 남는 일과 기분 점수를 표로 정리하고 꺾은선그래프로 나타내면, 기분이 크게 변한 때와 거의 변하지 않은 때를 한눈에 알 수 있어요. 친구의 그래프와 한 그래프에 견주어 같은 점과 다른 점도 찾아요.",
  steps: [
    { name: "만져 보기 — 하은이의 기분 그래프", inst: "연구소장 하은이가 강낭콩을 기른 8주 동안의 기분을 0점부터 100점까지 점수로 나타냈어요. 점수표와 그래프를 보고 답해 보세요.", hints: ["세로 눈금 한 칸은 10점이에요.", "선분이 가장 많이 기울어진 곳이 변화가 가장 큰 때예요."],
      render: (b, a) => { b.append(l5sMoodTable()); l5Ask(b, a, [
        l5SegQ({ g: L5S.mood, mode: "abs", q: "전주와 비교하여 기분 점수의 변화가 가장 큰 때의 선분을 눌러 보세요." }),
        { q: "전주와 비교하여 기분 점수의 변화가 가장 작은 때는 몇 주인가요?", t: "pick", o: ["3주", "5주", "7주", "8주"], a: 2 },
        { q: "8주의 기분 점수는 몇 점인가요?", t: "num", a: 100, unit: "점" }],
        { ok: "4주에 잎이 시들어 40점이 떨어져 변화가 가장 컸고, 7주에는 10점만 변했어요." }); } },
    { name: "그려 보기 — 나의 기분 그래프", inst: "이번에는 내 차례예요. 강낭콩을 기른 8주 동안 나의 기분을 점수로 정해 꺾은선그래프로 나타내 보세요.", hints: ["점수는 0점부터 100점까지, 10점 단위로 정해요.", "선분이 가장 많이 기울어진 곳과 가장 덜 기울어진 곳을 찾아요."],
      render: (b, a) => l5Mood(b, a, { g: L5V(L5S.mood, { title: "주별 나의 기분 그래프", vals: L5S.mood.xs.map(() => 0) }) }) },
    { name: "말해 보기 — 친구 그래프 함께 그리기", inst: "기록 담당 지우의 기분 점수를 하은이의 그래프(흐린 선) 위에 파란 점으로 찍어 한 그래프에 나타내 보세요.", hints: ["세로 눈금 한 칸은 10점이에요.", "지우의 2주와 5주 점수는 전주와 같아요."],
      render: (b, a) => { b.append(l5Table(L5V(L5S.mood, { title: "주별 지우의 기분 점수", vals: L5S.moodJ }))); l5Build(b, a, { g: L5V(L5S.mood, { title: "주별 하은이와 지우의 기분 그래프", vals: L5S.moodJ }), bg: { name: "하은", vals: L5S.mood.vals }, name: "지우", color: L5_LINE2, ok: "한 그래프에 두 사람의 기분 그래프를 그렸어요. 두 선을 견주어 봐요!" }); } },
    { name: "약속하기 — 두 그래프 견주기", inst: "하은이와 지우의 기분 그래프를 견주어 보세요.", hints: ["두 선이 모두 오른쪽 아래로 내려간 곳을 찾아요.", "평평한 선분은 점수가 그대로인 때예요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig({ title: "주별 하은이와 지우의 기분 그래프", xs: L5S.mood.xs, xAxis: "주", xUnit: "주", yAxis: "점수", unit: "점", step: 10, cells: 10, major: 50, series: [{ name: "하은", vals: L5S.mood.vals }, { name: "지우", vals: L5S.moodJ }] }, { tip: false }), q: "두 사람 모두 기분 점수가 전주보다 내려간 때를 모두 고르세요.", t: "pick", o: ["3주", "4주", "6주", "7주"], a: [1, 3], why: { "0,1": "3주에 지우의 점수는 70점에서 80점으로 올랐어요.", "0,3": "3주에 지우의 점수는 올랐어요. 4주를 다시 봐요.", "1,2": "6주에는 두 사람 모두 점수가 올랐어요.", "2,3": "6주에는 두 사람 모두 점수가 올랐어요." } },
        { q: "지우의 기분 점수가 전주와 같았던 때를 모두 고르세요.", t: "pick", o: ["2주", "3주", "5주", "8주"], a: [0, 2] }],
        { ok: "4주와 7주에는 두 사람 모두 점수가 내려갔고, 지우는 2주와 5주에 점수가 그대로였어요. 같은 일을 겪어도 기분의 변화는 사람마다 달라요." }) },
    { name: "확인하기 — 기분 그래프 발표", inst: "내 기분 그래프를 친구들에게 발표할 글을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "내 그래프에서 기분이 가장 크게 변한 때와 그 까닭을 써 보세요.", tag: "발표 1", ph: "예) ~주에 …해서 기분이 …", help: ["① 선분이 가장 많이 기울어진 주를 찾아요. → ② 그 주에 있었던 일을 함께 써요.", "‘~주에 ~해서 기분 점수가 ~점에서 ~점으로 변했어요.’ 꼴로 써요."], ans: "4주에 잎이 시들어서 기분 점수가 70점에서 30점으로 가장 크게 내려갔어요." },
        { q: "친구의 그래프와 견주어 같은 점이나 다른 점을 써 보세요.", tag: "발표 2", ph: "예) 나와 친구 모두 …", help: ["① 두 선이 함께 오르거나 내린 때를 찾아요. → ② 다른 모습을 보인 때도 찾아요.", "‘나와 친구 모두 ~주에 ~했지만, ~주에는 ~했어요.’ 꼴로 써요."], ans: "하은이와 지우 모두 4주에 기분이 내려갔지만, 3주에는 하은이는 내려가고 지우는 올라갔어요." }]) }
  ],
  challenge: { inst: "하은이의 기분 그래프를 보고 답해 보세요.", hints: ["5주는 50점, 6주는 80점이에요.", "선분 중에 오른쪽 아래로 내려간 것이 있는지 봐요."],
    render: (b, a) => l5Ask(b, a, [
      { fig: () => l5Fig(L5S.mood, { tip: false }), q: "6주에는 5주보다 기분 점수가 몇 점 올랐나요?", t: "num", a: 30, unit: "점", why: { "3": "3칸 올랐어요. 한 칸은 10점이에요.", "80": "80점은 6주의 점수예요. 5주와의 차이를 구해요." } },
      { q: "하은이의 기분 점수는 1주부터 8주까지 계속 올라갔어요.", t: "ox", a: false, why: { "o": "3주, 4주, 7주에는 선분이 오른쪽 아래로 내려가요." } },
      { q: "하은이의 기분 점수가 가장 낮았던 때는 몇 주인가요?", t: "pick", o: ["1주", "4주", "5주", "7주"], a: 1 }],
      { ok: "6주에 30점 올랐고, 4주에 30점으로 가장 낮았어요. 기분 점수는 오르기도 하고 내리기도 했어요." }) }
},
{
  id: "g10", no: 10, title: "강낭콩 연구 발표회 ― 공부한 내용 확인", soop: "발표하기(P)",
  question: "꺾은선그래프를 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
  summary: "꺾은선그래프는 연속적으로 변화하는 양을 점으로 표시하고 그 점들을 선분으로 이어 그린 그래프예요. 가로와 세로, 세로 눈금 한 칸의 크기, 물결선을 확인하며 읽고 그리고, 선의 흐름을 보고 앞으로의 변화를 예상할 수 있어요.",
  steps: [
    { name: "만져 보기 — 서진이의 잎 그래프", inst: "연구 발표회에서 서진이가 보여 줄 ‘주별 서진이 강낭콩의 잎의 수’ 그래프예요. 꼬투리를 딴 뒤 잎이 누렇게 지기 시작했대요.", hints: ["0과 10 사이가 5칸이에요.", "10주에는 9주보다 6장 줄었어요."],
      render: (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.seoLeaf), q: "세로 눈금 한 칸은 몇 장을 나타내나요?", t: "num", a: 2, unit: "장", why: { "1": "0과 10 사이가 5칸이에요. 한 칸이 1장이면 5칸은 5장이 되어야 해요.", "10": "10장은 눈금 5칸이 나타내는 수예요.", "5": "5는 0과 10 사이의 칸 수예요." } },
        { q: "잎의 수가 가장 많은 때는 8주예요.", t: "ox", a: true },
        { q: "전주와 비교하여 잎의 수가 가장 많이 줄어든 때는 10주예요.", t: "ox", a: true, why: { "x": "9주에는 2장, 10주에는 6장 줄었어요." } },
        { q: "잎의 수는 6주부터 계속 줄어들었어요.", t: "ox", a: false, why: { "o": "6주부터 8주까지는 선분이 오른쪽 위로 올라가요." } }],
        { ok: "세로 눈금 한 칸은 10÷5=2(장)이에요. 잎의 수는 8주까지 늘었다가 그 뒤로 줄어들었어요." }) },
    { name: "그려 보기 — 빠진 점 찍기", inst: "발표회 자료를 만들던 하은이가 2022년의 점을 빠뜨렸어요. 표를 보고 꺾은선그래프를 완성해 보세요.", hints: ["2022년은 44명이에요.", "물결선 위 첫 눈금은 30명, 한 칸은 1명이에요."],
      render: (b, a) => l5Build(b, a, { g: L5S.join, table: true, lock: [0, 1, 3, 4], ok: "2022년 44명에 점을 찍고 선분으로 이었어요. 2022년에 참여한 학생이 가장 많아요." }) },
    { name: "말해 보기 — 앞으로 어떻게 될까", inst: "완성한 그래프를 보고 답해 보세요.", hints: ["2022년부터 2024년까지 선이 어느 쪽으로 가는지 봐요.", "2022년은 44명, 2023년은 39명이에요."],
      render: thenWhy((b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.join, { tip: false }), q: "2023년에는 2022년보다 몇 명 줄었나요?", t: "num", a: 5, unit: "명", why: { "39": "39명은 2023년의 학생 수예요. 2022년과의 차이를 구해요." } },
        { q: "2025년에 강낭콩 기르기에 참여할 학생 수는 어떻게 될 것 같나요?", t: "pick", o: ["줄어들 것 같아요", "늘어날 것 같아요"], a: 0, why: { "1": "2022년부터 2024년까지 선이 계속 오른쪽 아래로 내려가요." } }],
        { ok: "2022년부터 계속 줄었으니 2025년에도 줄어들 것 같아요. 하지만 연구소 발표회를 보고 참여하고 싶은 학생이 늘어날 수도 있어요!" }),
        { q: "참여하는 학생 수를 다시 늘리려면 어떻게 하면 좋을까요?", ph: "그래프를 보면 ~. 그래서 ~", help: ["① 그래프에서 줄어든 흐름을 말해요. → ② 늘리기 위한 생각을 써요.", "‘그래프를 보면 ~년부터 계속 줄었어요. 그래서 ~하면 좋겠어요.’ 꼴로 써요."], ans: "그래프를 보면 2022년부터 계속 줄었어요. 그래서 우리 연구소의 꺾은선그래프를 전시해 강낭콩 기르기의 재미를 알리면 좋겠어요." }) },
    { name: "약속하기 — 징검돌 건너기", inst: "‘월별 학교 화단에 쓴 물의 양’ 그래프를 보고, 옳은 문장 징검돌만 밟아 강낭콩 밭까지 건너가 보세요.", hints: ["0과 250 사이가 5칸이에요. 한 칸은 50 L예요.", "10월의 점은 7칸 높이에 있어요."],
      render: (b, a) => l5sStones(b, a, { fig: () => l5Fig(L5S.flower, { tip: false }), ok: "옳은 문장만 밟고 강낭콩 밭에 도착했어요! 꺾은선그래프를 정확하게 읽었어요.", items: [
        { t: "월별 학교 화단에 쓴 물의 양을 조사하여 나타낸 꺾은선그래프예요.", ok: true },
        { t: "세로 눈금 한 칸은 10 L를 나타내요.", ok: false, why: "0과 250 사이가 5칸이니 한 칸은 50 L예요." },
        { t: "10월에 쓴 물의 양은 150 L예요.", ok: false, why: "10월의 점은 7칸 높이예요. 한 칸이 50 L이니 350 L예요." },
        { t: "시간이 지남에 따라 쓴 물의 양은 계속 줄어들었어요.", ok: false, why: "6월부터 8월까지는 늘어났다가 그 뒤로 줄어들었어요." },
        { t: "전월과 비교하여 쓴 물의 양이 가장 많이 줄어든 때는 9월이에요.", ok: true }] }) },
    { name: "확인하기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["꺾은선그래프를 배우기 전의 생각을 떠올려요.", "물결선, 눈금 한 칸의 크기, 예상하기를 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "꺾은선그래프를 배우기 전의 생각", ex: ["예전에는 자라는 기록도 막대그래프로만 나타내면 된다고 생각했어요.", "예전에는 재지 않은 날의 키는 알 수 없다고 생각했어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 시간에 따라 변하는 기록은 꺾은선그래프가 한눈에 잘 보인다고 생각해요.", "지금은 두 점 사이의 선분으로 재지 않은 날의 값도 어림할 수 있다고 생각해요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["하은이 강낭콩의 키를 점으로 찍고 7일의 키를 어림해 보고 바뀌었어요.", "물결선을 넣은 그래프와 넣지 않은 그래프를 견주어 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "마인드맵 — ‘꺾은선그래프’를 정리해요. 떠오르는 말을 모으고, 묶고, 이어 보세요.", hints: ["점, 선분, 가로, 세로, 눈금 한 칸의 크기, 물결선, 제목", "선분이 오른쪽 위로 가면 늘어남, 오른쪽 아래로 가면 줄어듦이에요.", "그래프의 흐름으로 앞으로를 예상하지만 꼭 맞지는 않아요."],
    render: withOptional(
      (b, a) => panes(b, a, [
        { t: "떠오르는 말", e: "🧠", ph: "꺾은선그래프 → ~", hint: "점, 선분, 물결선…", ex: ["꺾은선그래프 → 점, 선분, 세로 눈금 한 칸의 크기", "꺾은선그래프 → 물결선, 늘어남, 줄어듦, 예상"] },
        { t: "묶어 보기", e: "🗂", ph: "읽을 때: ~", hint: "비슷한 것끼리 묶어요", ex: ["읽을 때: 가로와 세로, 눈금 한 칸의 크기, 선분이 기울어진 정도", "그릴 때: 가로와 세로 정하기, 물결선, 눈금 정하기, 점 찍고 잇기, 제목"] },
        { t: "이어지는 말", e: "🔗", ph: "~와 ~는 이어져요", hint: "예: 물결선과 눈금 한 칸의 크기", ex: ["물결선과 세로 눈금 한 칸의 크기는 이어져요.", "선의 흐름과 앞으로의 예상은 이어져요."] },
        { t: "덧붙이는 말", e: "✏️", ph: "예를 들면 ~", hint: "예를 들거나 더 설명해요", ex: ["예를 들면 화분의 무게 그래프는 0 g과 330 g 사이를 물결선으로 생략했어요.", "예를 들면 텃밭 강낭콩은 계속 자라서 7주에도 더 자랄 것이라고 예상했어요."] }],
        { min: 1, ok: "꺾은선그래프를 한눈에 정리했어요. 강낭콩 관찰 연구소 발표회 끝!" }),
      (b, a) => l5Ask(b, a, [
        { fig: () => l5Fig(L5S.garden, { tip: false }), q: "텃밭 강낭콩의 키가 5주와 6주 사이에 일정하게 자랐다면, 5주 반쯤의 키는 약 몇 cm일까요?", t: "num", a: 25, unit: "cm", why: { "23": "23 cm는 5주의 키예요.", "27": "27 cm는 6주의 키예요." } },
        { q: "1주부터 6주까지 텃밭 강낭콩은 모두 몇 cm 자랐나요?", t: "num", a: 24, unit: "cm", why: { "27": "27 cm는 6주의 키예요. 1주의 키 3 cm를 빼요." } }],
        { ok: "두 점 사이의 가운데 값을 어림하고, 처음과 나중의 차이로 자란 길이도 구했어요!" }),
      { title: "더 해 보고 싶다면 — 선택 문제", inst: "텃밭 강낭콩 그래프로 마지막 문제를 풀어 보세요." }) }
}
];
