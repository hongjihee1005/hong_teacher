//@@APP
const APP={title:"환경 보호 실천 학교 막대그래프", unit:"4-1 수학 5. 막대그래프(교과서)", key:"t41-bargraph-v1", welcome:"환경 보호 실천 학교 막대그래프 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 이서와 친구들이 환경 보호 활동을 조사하며 막대그래프를 읽고 그리는 방법을 배워요."};
//@@UNIT
/* ===== 4-1 수학 5. 막대그래프 — 단원 조작 부품 (앞글자 b5) =====
   그래프 g = { title, cats:[…], vals:[…], unit:"명", catAxis:"학급", valAxis:"책의 수", step:눈금 한 칸의 크기, cells:눈금 칸 수, horiz:가로 막대, every:몇 칸마다 수를 쓸지 }
   막대 길이(칸) = 값 ÷ 눈금 한 칸의 크기. 그림은 모두 g의 수로 계산해서 그려요. */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.b5fig svg{width:100%;height:auto;max-height:50vh;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:12px}
.b5fig{margin:.3em 0}
.b5figs{display:flex;flex-wrap:wrap;gap:.8em}.b5figs>div{flex:1 1 300px;min-width:0}
.b5cap{font-size:var(--fs-s);color:var(--muted);margin:.25em 0 0}
.b5tbl{overflow-x:auto;margin:.3em 0 .6em;max-width:100%}
.b5tbl table{border-collapse:collapse;word-break:keep-all;background:#fff}
.b5tbl th,.b5tbl td{border:1.5px solid var(--line);padding:.3em .55em;text-align:center}
.b5tbl th{background:#F2F5F4;font-weight:normal}
.b5tbl input{width:3.4em;text-align:center;font-size:1em;padding:.1em}
.b5tt{font-family:"Jua";margin-bottom:.2em}
.b5btns{display:flex;flex-wrap:wrap;gap:.35em;align-items:center}
.b5btns button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em}
.b5btns button.b5on{background:var(--night);color:#fff;border-color:var(--night)}
.b5side select{max-width:100%;font-size:1em;padding:.2em}
.b5lbl{font-family:"Jua";color:var(--night)}
.b5pool{display:flex;flex-wrap:wrap;gap:.4em;min-height:2.6em;margin:.4em 0}
.b5bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(13em,1fr));gap:.6em}
.b5bin{border:2px dashed var(--line);border-radius:12px;padding:.5em;min-height:7em;cursor:pointer;background:#FBFCFB}
.b5bint{font-family:"Jua";color:var(--night);margin-bottom:.3em}
.b5card{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.35em .7em;text-align:left;word-break:keep-all;max-width:100%}
.b5bin .b5card{display:block;width:100%;margin:.25em 0}
.b5card.b5sel{border-color:var(--ring);background:var(--ring-soft)}
.b5card.b5good{border-color:var(--ok);background:#E3F4EA}
.b5card.b5bad{border-color:var(--no);background:#FBE7E2}
.b5now{font-family:"Jua";font-size:var(--fs-l);color:var(--night)}
.b5row{display:flex;align-items:center;gap:.4em;flex-wrap:wrap}
.b5row svg{width:34px;height:34px;flex:none}
.b5row input{width:3.4em;text-align:center;font-size:1em}
.b5stmt{padding:.4em .6em;border-radius:.6em;margin:.25em 0;border:2px solid transparent}
.b5stmt.b5cur{border-color:var(--ring);background:var(--ring-soft)}
.b5stmt.b5ok{color:var(--muted)}
`;
  document.head.append(s);
})();
const B5_BAR = "#F0A35E", B5_BAR2 = "#7FB8E6", B5_GRID = "#DCE4E0", B5_GRID2 = "#9AA9A3", B5_INK = "#1D2A2A", B5_SEL = "#D9482B", B5_SOFT = "#3B4A47";

/* 받침 있는 말 뒤 조사: b5J("학교", "이/가") → "학교가" */
function b5Jong(w) {
  const s = String(w).replace(/[^가-힣A-Za-z0-9]+$/, "");
  if (/(kg|t)$/.test(s)) return true;               // 킬로그램, 톤
  const c = s.charCodeAt(s.length - 1);
  if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 !== 0;
  if (/[0-9]$/.test(s)) return /[013678]$/.test(s);   // 영·일·삼·육·칠·팔 / 십·백
  return false;
}
function b5J(w, pair) { const [a, b] = pair.split("/"); return w + (b5Jong(w) ? a : b); }
function b5Ro(w) { const c = String(w).charCodeAt(String(w).length - 1), j = c >= 0xAC00 && c <= 0xD7A3 ? (c - 0xAC00) % 28 : 0; return w + (j === 0 || j === 8 ? "로" : "으로"); }
function b5U(v, unit) { if (!unit) return String(v); if (/^[A-Za-z]/.test(unit)) return `${v} ${unit}`; return `${v}${unit}`; }
function b5Num(inp) { const s = String(inp.value).replace(/[\s,]/g, ""); return s === "" ? NaN : Number(s); }
function b5Lines(s, max = 5) {
  s = String(s); if (s.length <= max || !s.includes(" ")) return [s];
  let best = null;
  [...s].forEach((c, i) => { if (c !== " ") return; const a = s.slice(0, i), b = s.slice(i + 1), m = Math.max(a.length, b.length); if (!best || m < best.m) best = { m, l: [a, b] }; });
  return best.l;
}
/* 흐린 점선 상자(아직 정하지 않은 칸) */
function b5Q(x, y, t, size = 18) {
  const g = svgEl("g"), w = String(t).length * size * .9 + 18;
  g.append(svgEl("rect", { x: x - w / 2, y: y - size * .75, width: w, height: size * 1.5, rx: 6, fill: "#fff", stroke: "#9AA9A3", "stroke-dasharray": "5 4" }));
  g.append(txt(x, y, t, size, { fill: "#7A8A86" }));
  return g;
}
/* ---------- 그래프 크기 계산 ---------- */
function b5Geom(g, cells) {
  const fs = g.fs || 18, n = g.cats.length;
  const lines = g.cats.map(c => b5Lines(c));
  const longest = Math.max(2, ...lines.flat().map(s => s.length));
  const nl = Math.max(1, ...lines.map(l => l.length));
  const G = { fs, n, cells, nl, horiz: !!g.horiz };
  G.T = g.title === "" ? 60 : 92;
  const catW = String(g.catAxis || "?").length * fs + 26;
  if (!G.horiz) {
    G.CH = g.ch || Math.max(12, Math.min(32, Math.floor(340 / cells)));
    G.SW = g.sw || Math.max(92, longest * fs + 22);
    G.L = Math.max(78, catW);
    G.PW = n * G.SW; G.PH = cells * G.CH; G.base = G.T + G.PH;
    G.W = G.L + G.PW + 24; G.H = G.base + 20 + nl * (fs + 4) + 12;
  } else {
    G.CW = g.cw || Math.max(14, Math.min(42, Math.floor(500 / cells)));
    G.SH = g.sh || Math.max(54, nl * (fs + 4) + 22);
    G.L = Math.max(longest * fs + 32, catW, 80);
    G.PW = cells * G.CW; G.PH = n * G.SH; G.base = G.L;
    G.W = G.L + G.PW + 36; G.H = G.T + G.PH + 72;
  }
  const valName = `${g.valAxis || ""} (${g.unit || ""})`;
  G.W = Math.max(G.W, String(g.title || "").length * 22 + 40, valName.length * fs + 40);
  return G;
}
/* ---------- 그래프 그리기 ----------
   st = { h:[막대 칸 수], step, names:[막대 이름|null], title|null, catAxis|null, valAxis|null, sel, lock:Set } */
function b5Paint(svg, g, G, st) {
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${G.W} ${G.H}`);
  const fs = G.fs, U = g.unit || "", every = g.every || (G.cells <= 6 ? 1 : 5);
  if (g.title !== "") svg.append(st.title ? txt(G.W / 2, 34, st.title, 23) : b5Q(G.W / 2, 34, "제목: ?", 21));
  const valName = st.valAxis == null ? null : `${st.valAxis} (${U})`;
  const tick = k => st.step == null ? (k ? "?" : "0") : String(Math.round(k * st.step * 1000) / 1000);
  const barFill = i => st.lock && st.lock.has(i) ? B5_BAR2 : (g.color || B5_BAR);
  const nameAt = (i, x, y, anchor) => {
    const nm = st.names[i];
    if (nm == null) { svg.append(b5Q(anchor === "end" ? x - 22 : x, y, "?", fs)); return; }
    const ls = b5Lines(nm);
    ls.forEach((l, j) => svg.append(txt(x, y + (j - (anchor === "end" ? (ls.length - 1) / 2 : 0)) * (fs + 4), l, fs, anchor === "end" ? { "text-anchor": "end" } : {})));
  };
  if (!G.horiz) {
    const { L, T, PW, CH, SW, base } = G;
    svg.append(valName ? txt(10, T - 28, valName, fs, { "text-anchor": "start", fill: B5_SOFT }) : b5Q(40, T - 28, "?", fs));
    for (let k = 0; k <= G.cells; k++) {
      const y = base - k * CH, major = k % every === 0;
      svg.append(svgEl("line", { x1: L, y1: y, x2: L + PW, y2: y, stroke: major && k ? B5_GRID2 : B5_GRID, "stroke-width": major ? 1.6 : 1 }));
      if (major) svg.append(txt(L - 10, y, tick(k), fs - 1, { "text-anchor": "end" }));
    }
    for (let i = 0; i <= G.n; i++) svg.append(svgEl("line", { x1: L + i * SW, y1: T, x2: L + i * SW, y2: base, stroke: B5_GRID, "stroke-width": 1 }));
    svg.append(svgEl("line", { x1: L, y1: T, x2: L, y2: base, stroke: B5_INK, "stroke-width": 2 }));
    svg.append(svgEl("line", { x1: L, y1: base, x2: L + PW, y2: base, stroke: B5_INK, "stroke-width": 2 }));
    g.cats.forEach((c, i) => {
      const x = L + i * SW, hh = (st.h[i] || 0) * CH;
      if (st.sel === i) svg.append(svgEl("rect", { x: x + 3, y: T, width: SW - 6, height: base - T, fill: "#FFF1E8" }));
      if (hh > 0) svg.append(svgEl("rect", { x: x + SW * .25, y: base - hh, width: SW * .5, height: hh, fill: barFill(i), stroke: st.sel === i ? B5_SEL : "#B8743A", "stroke-width": st.sel === i ? 3 : 1 }));
      nameAt(i, x + SW / 2, base + 18 + fs / 2, "middle");
    });
    svg.append(st.catAxis == null ? b5Q(L - 30, base + 18 + fs / 2, "?", fs) : txt(L - 10, base + 18 + fs / 2, st.catAxis, fs, { "text-anchor": "end", fill: B5_SOFT }));
  } else {
    const { L, T, PW, PH, CW, SH } = G;
    svg.append(st.catAxis == null ? b5Q(L - 30, T - 18, "?", fs) : txt(L - 12, T - 18, st.catAxis, fs, { "text-anchor": "end", fill: B5_SOFT }));
    for (let k = 0; k <= G.cells; k++) {
      const x = L + k * CW, major = k % every === 0;
      svg.append(svgEl("line", { x1: x, y1: T, x2: x, y2: T + PH, stroke: major && k ? B5_GRID2 : B5_GRID, "stroke-width": major ? 1.6 : 1 }));
      if (major) svg.append(txt(x, T + PH + 18, tick(k), fs - 1));
    }
    for (let i = 0; i <= G.n; i++) svg.append(svgEl("line", { x1: L, y1: T + i * SH, x2: L + PW, y2: T + i * SH, stroke: B5_GRID, "stroke-width": 1 }));
    svg.append(svgEl("line", { x1: L, y1: T, x2: L, y2: T + PH, stroke: B5_INK, "stroke-width": 2 }));
    svg.append(svgEl("line", { x1: L, y1: T + PH, x2: L + PW, y2: T + PH, stroke: B5_INK, "stroke-width": 2 }));
    svg.append(valName ? txt(L + PW, T + PH + 50, valName, fs, { "text-anchor": "end", fill: B5_SOFT }) : b5Q(L + PW - 30, T + PH + 50, "?", fs));
    g.cats.forEach((c, i) => {
      const y = T + i * SH, ww = (st.h[i] || 0) * CW;
      if (st.sel === i) svg.append(svgEl("rect", { x: L, y: y + 3, width: PW, height: SH - 6, fill: "#FFF1E8" }));
      if (ww > 0) svg.append(svgEl("rect", { x: L, y: y + SH * .24, width: ww, height: SH * .52, fill: barFill(i), stroke: st.sel === i ? B5_SEL : "#B8743A", "stroke-width": st.sel === i ? 3 : 1 }));
      nameAt(i, L - 12, y + SH / 2, "end");
    });
  }
}
function b5K(G, p) {
  const k = G.horiz ? Math.round((p.x - G.L) / G.CW) : Math.round((G.base - p.y) / G.CH);
  return Math.max(0, Math.min(G.cells, k));
}
/* 눈금 자: 빨간 점선과 '눈금 n칸' */
function b5Ruler(svg, G, k) {
  const lab = `눈금 ${k}칸`, w = lab.length * 15 + 16;
  if (!G.horiz) {
    const y = G.base - k * G.CH;
    svg.append(svgEl("line", { x1: G.L, y1: y, x2: G.L + G.PW, y2: y, stroke: B5_SEL, "stroke-width": 2.5, "stroke-dasharray": "8 5" }));
    const ly = y - 16 < G.T - 6 ? y + 16 : y - 16;
    svg.append(svgEl("rect", { x: G.L + 4, y: ly - 13, width: w, height: 26, rx: 6, fill: "#fff", stroke: B5_SEL }));
    svg.append(txt(G.L + 4 + w / 2, ly, lab, 16, { fill: B5_SEL }));
  } else {
    const x = G.L + k * G.CW;
    svg.append(svgEl("line", { x1: x, y1: G.T, x2: x, y2: G.T + G.PH, stroke: B5_SEL, "stroke-width": 2.5, "stroke-dasharray": "8 5" }));
    const lx = Math.min(Math.max(x, G.L + w / 2), G.W - w / 2 - 4);
    svg.append(svgEl("rect", { x: lx - w / 2, y: G.T - 30, width: w, height: 24, rx: 6, fill: "#fff", stroke: B5_SEL }));
    svg.append(txt(lx, G.T - 18, lab, 15, { fill: B5_SEL }));
  }
}
/* 읽기용 그래프 그림: 누르면 눈금 자가 나와요 */
function b5Fig(g, o = {}) {
  const G = b5Geom(g, g.cells);
  const svg = makeSvg(G.W, G.H);
  const st = { h: g.vals.map(v => v / g.step), step: g.step, names: g.cats.slice(), title: g.title, catAxis: g.catAxis, valAxis: g.valAxis, sel: null };
  let k = null;
  const draw = () => { b5Paint(svg, g, G, st); if (k != null) b5Ruler(svg, G, k); };
  draw();
  const wrap = h("div", { class: "b5fig" }, svg);
  if (o.ruler !== false) {
    svg.style.cursor = "crosshair";
    svg.addEventListener("pointerdown", e => { const kk = b5K(G, svgPt(svg, e)); k = kk === k ? null : kk; draw(); });
    if (o.tip !== false) wrap.append(h("p", { class: "b5cap" }, "그래프를 누르면 그 자리에 눈금 자(빨간 점선)가 생기고 몇 칸인지 알려 줘요."));
  }
  if (o.cap) wrap.append(h("p", { class: "b5cap" }, o.cap));
  return wrap;
}
function b5Figs(list) { return h("div", { class: "b5figs" }, list.map(x => h("div", {}, x.lead ? h("div", { class: "b5lbl" }, x.lead) : null, b5Fig(x.g, Object.assign({ tip: false }, x.o || {}))))); }
/* ---------- 표 ---------- t = {title, head, row, cats, vals, sum:true}  blanks: 칸 번호 또는 "sum" */
function b5TableEl(t, blanks = []) {
  const ins = {};
  const total = t.vals.reduce((a, b) => a + b, 0);
  const cell = (key, v, label) => {
    if (blanks.includes(key)) { const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": label }); ins[key] = inp; return h("td", {}, inp); }
    return h("td", {}, String(v));
  };
  const r1 = h("tr", {}, h("th", {}, t.head), t.cats.map(c => h("th", {}, c)), t.sum === false ? null : h("th", {}, "합계"));
  const r2 = h("tr", {}, h("th", {}, t.row), t.vals.map((v, i) => cell(i, v, t.cats[i])), t.sum === false ? null : cell("sum", total, "합계"));
  const el = h("div", { class: "b5tbl" }, t.title ? h("div", { class: "b5tt" }, t.title) : null, h("table", {}, h("tbody", {}, r1, r2)));
  return { el, ins, total };
}
function b5CheckTable(T, t, blanks) {
  for (const key of blanks) {
    const inp = T.ins[key], want = key === "sum" ? T.total : t.vals[key], good = b5Num(inp) === want;
    inp.style.borderColor = good ? "var(--ok)" : "var(--no)";
    if (!good) return key === "sum" ? "합계는 모든 수를 더한 수예요. 다시 더해 봐요." : `표의 ‘${t.cats[key]}’ 칸을 다시 확인해 봐요.`;
  }
  return null;
}
/* 표 채우기 (그림을 보고 세어서) */
function b5Table(body, api, opt) {
  if (opt.fig) body.append(opt.fig());
  const T = b5TableEl(opt, opt.blanks);
  body.append(T.el);
  api.provide({ words: opt.words || ["합계"], answers: [opt.blanks.map(k => k === "sum" ? `합계 ${T.total}` : `${opt.cats[k]} ${opt.vals[k]}`).join(", ")] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = opt.blanks.map(k => T.ins[k].value.trim() || "-").join(", ");
    const bad = b5CheckTable(T, opt, opt.blanks);
    bad ? api.fail(bad, given) : api.done(given, opt.ok);
  } }, "확인하기")));
}
/* ---------- 문제 모음: t:"pick"(a 번호|[번호…]) · "num"(a 수, unit) · "ox"(a true/false) ---------- */
function b5Ask(body, api, items, opts = {}) {
  const wrap = h("div"), rows = [];
  const ansText = it => it.t === "num" ? b5U(it.a, it.unit || "") : it.t === "ox" ? (it.a ? "○" : "×") : (Array.isArray(it.a) ? it.a : [it.a]).map(i => it.o[i]).join(", ");
  items.forEach((it, qi) => {
    const box = h("div", { class: "qitem" });
    if (it.fig) box.append(it.fig());
    box.append(h("div", { class: "jua" }, `${items.length > 1 ? qi + 1 + ". " : ""}${it.q}`));
    const row = { it };
    if (it.t === "num") {
      const inp = h("input", { type: "text", inputmode: "numeric", style: "width:5.5em;font-size:1.15em", "aria-label": it.q });
      box.append(h("div", {}, h("span", {}, "답: "), inp, it.unit ? h("span", {}, " " + it.unit) : null));
      row.ok = () => b5Num(inp) === it.a;
      row.show = g => inp.style.borderColor = g ? "var(--ok)" : "var(--no)";
      row.val = () => inp.value.trim() || "-";
      row.key = () => String(b5Num(inp));
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
    rows.push(row); wrap.append(box);
  });
  api.provide({
    words: opts.words || items.filter(it => it.t === "pick").map(ansText).slice(0, 6),
    answers: items.map((it, qi) => `${items.length > 1 ? (qi + 1) + ") " : ""}${ansText(it)}`)
  });
  body.append(wrap, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    let all = true; rows.forEach(r => { const g = r.ok(); r.show(g); if (!g) all = false; });
    const given = rows.map(r => r.val()).join(" / ");
    if (all) return api.done(given, opts.ok);
    const bad = rows.find(r => !r.ok());
    const why = bad.it.why && bad.it.why[bad.key()];
    api.fail(why || opts.bad || "빨간 칸을 다시 살펴봐요. 눈금 한 칸의 크기와 막대의 길이를 확인해 봐요.", given);
  } }, "확인하기")));
}
/* ---------- 카드 나누기 ---------- opt = {bins:[…], cards:[{t, b}]} */
function b5Sort(body, api, opt) {
  const where = opt.cards.map(() => null); let sel = null;
  const pool = h("div", { class: "b5pool" });
  const cards = opt.cards.map((c, i) => h("button", { class: "b5card", onclick: e => {
    e.stopPropagation();
    if (where[i] != null) { where[i] = null; sel = i; } else sel = sel === i ? null : i;
    draw();
  } }, c.t));
  const bins = opt.bins.map((t, bi) => {
    const list = h("div");
    const box = h("div", { class: "b5bin", onclick: () => {
      if (sel == null) return api.hint("먼저 카드를 누른 다음, 넣을 곳을 눌러요.");
      where[sel] = bi; sel = null; draw();
    } }, h("div", { class: "b5bint" }, t), list);
    return { box, list };
  });
  function draw() {
    cards.forEach((c, i) => {
      c.classList.toggle("b5sel", sel === i); c.classList.remove("b5good", "b5bad");
      (where[i] == null ? pool : bins[where[i]].list).append(c);
    });
  }
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.b === bi).map(c => c.t).join(" / ")}`) });
  body.append(h("p", { class: "inst" }, "카드를 누르고, 넣을 상자를 눌러요. 상자 안의 카드를 누르면 다시 빠져요."), pool,
    h("div", { class: "b5bins" }, bins.map(b => b.box)),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      if (where.some(w => w == null)) return api.hint("아직 넣지 않은 카드가 있어요. 카드를 모두 상자에 넣어요.");
      let ok = true;
      cards.forEach((c, i) => { const g = where[i] === opt.cards[i].b; c.classList.add(g ? "b5good" : "b5bad"); if (!g) ok = false; });
      const given = opt.bins.map((b, bi) => `${b}: ${opt.cards.filter((_, i) => where[i] === bi).map(c => c.t).join("/")}`).join(" | ");
      ok ? api.done(given, opt.ok) : api.fail(opt.bad || "빨간 카드를 다시 생각해 봐요.", given);
    } }, "확인하기")));
}
/* ---------- 막대그래프 그리기 ----------
   opt = { g, stepChoices, cellChoices, titleChoices, axisPick, nameBlank:[번호], nameOptions, lock:[번호], table:{…}|false, ok } */
function b5Build(body, api, opt) {
  const g = opt.g, n = g.cats.length, U = g.unit || "", vals = g.vals, max = Math.max(...vals);
  const lock = new Set(opt.lock || []), blankN = opt.nameBlank || [];
  const st = {
    step: opt.stepChoices ? null : g.step,
    cells: opt.cellChoices ? opt.cellChoices[0] : g.cells,
    h: g.cats.map((_, i) => lock.has(i) ? vals[i] / g.step : 0),
    title: opt.titleChoices ? null : g.title,
    names: g.cats.map((c, i) => blankN.includes(i) ? null : c),
    catAxis: opt.axisPick ? null : g.catAxis, valAxis: opt.axisPick ? null : g.valAxis,
    sel: null, lock
  };
  const fits = (s, c) => s * c >= max && vals.every(v => v % s === 0);
  const steps = opt.stepChoices || [g.step], cellsL = opt.cellChoices || [g.cells];
  let ansStep = null, ansCells = null;
  steps.forEach(s => cellsL.forEach(c => { if (ansStep == null && fits(s, c)) { ansStep = s; ansCells = c; } }));
  // 표
  const tSpec = opt.table === false ? null : Object.assign({ title: g.title, head: g.catAxis, row: `${g.valAxis}(${U})`, cats: g.cats, vals }, opt.table || {});
  const tBlanks = (opt.table && opt.table.blanks) || [];
  const T = tSpec ? b5TableEl(tSpec, tBlanks) : null;
  // 그림
  const svg = makeSvg(400, 300); svg.style.touchAction = "none";
  let G;
  const info = h("div", { class: "readout", style: "font-size:var(--fs)" });
  function draw() {
    G = b5Geom(g, st.cells);
    b5Paint(svg, g, G, st);
    info.textContent = "막대: " + g.cats.map((c, i) => `${st.names[i] == null ? "?" : st.names[i]} ${Math.round(st.h[i] * 100) / 100}칸`).join(" · ");
  }
  const slotOf = p => {
    if (!G.horiz) { if (p.y < G.T - 30 || p.y > G.base + 50) return -1; const i = Math.floor((p.x - G.L) / G.SW); return i >= 0 && i < n ? i : -1; }
    if (p.x < G.L - 40 || p.x > G.L + G.PW + 30) return -1; const i = Math.floor((p.y - G.T) / G.SH); return i >= 0 && i < n ? i : -1;
  };
  dragOn(svg, p => {
    const i = slotOf(p); if (i < 0) return false;
    st.sel = i;
    if (lock.has(i)) { api.hint("이 막대는 이미 그려져 있어요."); draw(); return false; }
    st.h[i] = b5K(G, p); draw();
  }, p => { if (st.sel != null && !lock.has(st.sel)) { st.h[st.sel] = b5K(G, p); draw(); } });
  // 옆 조작판
  const side = h("div", { class: "side b5side" });
  const pickRow = (label, list, fmt, get, set) => {
    const row = h("div", { class: "b5btns" }, h("span", { class: "b5lbl" }, label));
    list.forEach(v => {
      const b = h("button", { onclick: () => { set(v); [...row.querySelectorAll("button")].forEach(x => x.classList.toggle("b5on", x === b)); draw(); } }, fmt(v));
      if (get() === v) b.classList.add("b5on");
      row.append(b);
    });
    return row;
  };
  const selectRow = (label, list, set) => {
    const s = h("select", { "aria-label": label }, h("option", { value: "" }, "고르기"), list.map(v => h("option", { value: v }, v)));
    s.onchange = () => { set(s.value || null); draw(); };
    return h("div", { class: "b5btns" }, h("span", { class: "b5lbl" }, label), s);
  };
  if (opt.axisPick) {
    const opts = [g.catAxis, g.valAxis];
    if (!g.horiz) { side.append(selectRow("가로:", opts, v => st.catAxis = v), selectRow("세로:", opts, v => st.valAxis = v)); }
    else { side.append(selectRow("가로:", opts, v => st.valAxis = v), selectRow("세로:", opts, v => st.catAxis = v)); }
  }
  if (opt.stepChoices) side.append(pickRow(`${g.horiz ? "가로" : "세로"} 눈금 한 칸:`, opt.stepChoices, v => b5U(v, U), () => st.step, v => st.step = v));
  if (opt.cellChoices) side.append(pickRow("눈금 칸 수:", opt.cellChoices, v => `${v}칸`, () => st.cells, v => { st.cells = v; st.h = st.h.map(x => Math.min(x, v)); }));
  blankN.forEach(i => side.append(selectRow(`${g.horiz ? "위" : "왼쪽"}에서 ${i + 1}째 막대 이름:`, opt.nameOptions || g.cats, v => st.names[i] = v)));
  if (opt.titleChoices) side.append(selectRow("제목:", opt.titleChoices, v => st.title = v));
  side.append(info, h("div", { class: "tools" },
    h("button", { onclick: () => { if (st.sel == null || lock.has(st.sel)) return api.hint("먼저 고칠 막대를 눌러요."); st.h[st.sel] = Math.min(st.cells, Math.floor(st.h[st.sel]) + 1); draw(); } }, "▲ 한 칸"),
    h("button", { onclick: () => { if (st.sel == null || lock.has(st.sel)) return api.hint("먼저 고칠 막대를 눌러요."); st.h[st.sel] = Math.max(0, Math.ceil(st.h[st.sel]) - 1); draw(); } }, "▼ 한 칸")));
  side.append(h("button", { class: "big", onclick: check }, "확인하기"));
  function check() {
    api.tryOnce();
    const given = (st.step == null ? "?" : b5U(st.step, U)) + ` ${st.cells}칸: ` + g.cats.map((c, i) => `${st.names[i] || "?"} ${st.h[i]}칸`).join(", ");
    if (T) { const bad = b5CheckTable(T, tSpec, tBlanks); if (bad) return api.fail(bad, given); }
    if (opt.axisPick) {
      if (st.catAxis == null || st.valAxis == null) return api.fail("가로와 세로에 무엇을 나타낼지 먼저 골라요.", given);
      if (st.catAxis !== g.catAxis) return api.fail(`막대의 길이로 나타내는 것은 ${b5J("‘" + g.valAxis + "’", "이에요/예요")}. 막대가 놓이는 쪽 축에는 ${b5J("‘" + g.catAxis + "’", "을/를")} 나타내요.`, given);
    }
    if (st.step == null) return api.fail("눈금 한 칸의 크기를 먼저 골라요.", given);
    if (st.step * st.cells < max) return api.fail(`눈금 한 칸이 ${b5U(st.step, U)}이고 ${st.cells}칸이면 ${b5U(st.step * st.cells, U)}까지만 나타낼 수 있어요. 가장 큰 수 ${b5U(max, U)}까지 나타낼 수 있게 골라요.`, given);
    const nd = vals.findIndex(v => v % st.step);
    if (nd >= 0) return api.fail(`눈금 한 칸이 ${b5U(st.step, U)}이면 ${g.cats[nd]} ${b5J(b5U(vals[nd], U), "은/는")} 막대 끝이 눈금 칸 가운데에 걸려서 정확하게 나타내기 어려워요. 모든 수가 칸에 꼭 맞는 크기를 골라요.`, given);
    for (const i of blankN) if (st.names[i] !== g.cats[i]) return api.fail(st.names[i] == null ? "비어 있는 막대 이름을 골라요." : `${g.horiz ? "위" : "왼쪽"}에서 ${i + 1}째 막대의 이름을 다시 생각해 봐요. ${opt.nameWhy || "막대의 길이가 몇 칸인지 세어 표와 견주어 봐요."}`, given);
    for (let i = 0; i < n; i++) {
      if (lock.has(i)) continue;
      const want = vals[i] / st.step;
      if (st.h[i] !== want) {
        const nm = g.cats[i], cur = Math.round(st.h[i] * st.step * 100) / 100;
        return api.fail(`${nm} 막대가 ${st.h[i]}칸이라 ${b5J(b5U(cur, U), "을/를")} 나타내요. ${b5J(b5U(vals[i], U), "이/가")} 되려면 눈금 한 칸이 ${b5U(st.step, U)}이니 몇 칸이어야 할까요?`, given);
      }
    }
    if (opt.titleChoices && st.title !== g.title) return api.fail(st.title == null ? "막대그래프에 알맞은 제목을 골라요." : "제목은 무엇을 조사했는지 알 수 있게 붙여요. 표의 내용을 다시 살펴봐요.", given);
    api.done(given, opt.ok || "표의 수에 맞게 막대그래프를 완성했어요!");
  }
  api.provide({
    words: opt.words || ["눈금 한 칸의 크기", "막대의 길이", "가장 큰 수", "제목"],
    answers: [(opt.stepChoices ? `눈금 한 칸 ${b5U(ansStep, U)}${opt.cellChoices ? `, ${ansCells}칸` : ""}: ` : "") + g.cats.map((c, i) => `${c} ${vals[i] / (ansStep || g.step)}칸`).join(", ")]
  });
  draw();
  if (T) body.append(T.el);
  body.append(h("div", { class: "panel" }, h("div", { class: "stage" }, svg), side));
}
/* ---------- 그림그래프(3학년 복습) ---------- */
function b5Carton(x, cy, s) {
  const w = s * .6, y = cy - s / 2, g = svgEl("g");
  g.append(svgEl("path", { d: `M${x} ${y + s * .28} L${x + w * .5} ${y} L${x + w} ${y + s * .28} Z`, fill: "#4E94CF" }));
  g.append(svgEl("rect", { x, y: y + s * .28, width: w, height: s * .72, fill: "#8EC3EC", stroke: "#3C7DB4", "stroke-width": 1.5 }));
  return g;
}
function b5PictSvg(opt, counts) {
  const n = opt.cats.length, RH = 70, LW = 100, W = 760, top = 54, H = top + n * RH + 60;
  const svg = makeSvg(W, H);
  svg.append(txt(W / 2, 26, opt.title, 22));
  svg.append(svgEl("rect", { x: 10, y: top, width: W - 20, height: n * RH, fill: "#fff", stroke: B5_GRID2, "stroke-width": 1.5 }));
  svg.append(svgEl("line", { x1: 10 + LW, y1: top, x2: 10 + LW, y2: top + n * RH, stroke: B5_GRID2, "stroke-width": 1.5 }));
  opt.cats.forEach((c, i) => {
    const y = top + i * RH;
    if (i) svg.append(svgEl("line", { x1: 10, y1: y, x2: W - 10, y2: y, stroke: B5_GRID2 }));
    svg.append(txt(10 + LW / 2, y + RH / 2, c, 20));
    let x = 10 + LW + 14;
    for (let k = 0; k < counts[i][0]; k++) { svg.append(b5Carton(x, y + RH / 2, 50)); x += 42; }
    for (let k = 0; k < counts[i][1]; k++) { svg.append(b5Carton(x, y + RH / 2 + 10, 28)); x += 26; }
  });
  const ly = top + n * RH + 32;
  svg.append(b5Carton(W - 250, ly, 44), txt(W - 196, ly, `${opt.big}${opt.unit}`, 18), b5Carton(W - 130, ly + 6, 26), txt(W - 86, ly, `1${opt.unit}`, 18));
  return svg;
}
function b5PictFig(opt) { const svg = b5PictSvg(opt, opt.vals.map(v => [Math.floor(v / opt.big), v % opt.big])); return h("div", { class: "b5fig" }, svg); }
function b5Pict(body, api, opt) {
  const T = b5TableEl({ title: opt.title, head: opt.head, row: opt.row, cats: opt.cats, vals: opt.vals });
  const cnt = opt.cats.map(() => [0, 0]);
  const stage = h("div", { class: "stage" });
  const draw = () => { stage.innerHTML = ""; stage.append(b5PictSvg(opt, cnt)); };
  const side = h("div", { class: "side" }, h("p", {}, `큰 그림은 ${opt.big}${opt.unit}, 작은 그림은 1${opt.unit}를 나타내요. 단추로 그림을 넣거나 빼요.`.replace(`1${opt.unit}를`, b5J(`1${opt.unit}`, "을/를"))));
  opt.cats.forEach((c, i) => {
    const chg = (k, d, cap) => () => { cnt[i][k] = Math.max(0, Math.min(cap, cnt[i][k] + d)); draw(); };
    side.append(h("div", { class: "tools" }, h("b", { style: "min-width:2.6em" }, c),
      h("button", { onclick: chg(0, 1, 6) }, "큰 +"), h("button", { onclick: chg(0, -1, 6) }, "큰 −"),
      h("button", { onclick: chg(1, 1, 12) }, "작은 +"), h("button", { onclick: chg(1, -1, 12) }, "작은 −")));
  });
  side.append(h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = opt.cats.map((c, i) => `${c} 큰${cnt[i][0]} 작은${cnt[i][1]}`).join(", ");
    for (let i = 0; i < opt.cats.length; i++) {
      const v = cnt[i][0] * opt.big + cnt[i][1], c = opt.cats[i];
      if (v === opt.vals[i] && cnt[i][1] >= opt.big) return api.fail(`${c}: 작은 그림 ${opt.big}개는 큰 그림 1개로 바꾸어 나타내요.`, given);
      if (v !== opt.vals[i]) return api.fail(`${c}의 그림은 지금 ${b5U(v, opt.unit)}를 나타내요. 표에서는 ${b5U(opt.vals[i], opt.unit)}예요.`.replace(`${b5U(v, opt.unit)}를`, b5J(b5U(v, opt.unit), "을/를")).replace(`${b5U(opt.vals[i], opt.unit)}예요`, b5J(b5U(opt.vals[i], opt.unit), "이에요/예요")), given);
    }
    api.done(given, opt.ok);
  } }, "확인하기"));
  api.provide({ words: ["큰 그림", "작은 그림"], answers: [opt.cats.map((c, i) => `${c} 큰 ${Math.floor(opt.vals[i] / opt.big)}, 작은 ${opt.vals[i] % opt.big}`).join(" / ")] });
  draw();
  body.append(T.el, h("div", { class: "panel" }, stage, side));
}
/* ---------- 스티커 붙이기 조사 ---------- */
function b5Tally(body, api, opt) {
  const cats = opt.cats, seq = opt.seq, names = opt.names, n = cats.length;
  const counts = cats.map((_, c) => seq.filter(x => x === c).length);
  const got = cats.map(() => 0); let pos = 0;
  const COLS = ["#F08A6C", "#F5C04E", "#7DC59A", "#7FB2E5"], CWD = 135, W = 40 + n * CWD, H = 400, base = 350;
  const stage = h("div", { class: "stage" });
  const draw = () => {
    const svg = makeSvg(W, H);
    svg.append(txt(W / 2, 26, "우리 반 스티커 판", 22));
    cats.forEach((c, i) => {
      const x = 20 + i * CWD;
      svg.append(svgEl("rect", { x: x + 6, y: 50, width: CWD - 12, height: base - 50, rx: 10, fill: "#fff", stroke: B5_GRID2 }));
      for (let k = 0; k < got[i]; k++) svg.append(svgEl("circle", { cx: x + CWD / 2 + (k % 2 ? 18 : -18), cy: base - 22 - Math.floor(k / 2) * 40, r: 16, fill: COLS[i], stroke: "#fff", "stroke-width": 3 }));
      b5Lines(c).forEach((l, j) => svg.append(txt(x + CWD / 2, base + 20 + j * 20, l, 17)));
    });
    stage.innerHTML = ""; stage.append(svg);
  };
  const now = h("div", { class: "b5now" });
  const binRow = h("div", { class: "b5btns" });
  const after = h("div");
  const showNow = () => { now.textContent = pos < seq.length ? `${pos + 1}번째 친구 ${names[pos]} → ‘${cats[seq[pos]]}’` : "모든 친구가 스티커를 붙였어요!"; };
  cats.forEach((c, i) => binRow.append(h("button", { onclick: () => {
    if (pos >= seq.length) return;
    if (seq[pos] !== i) return api.hint(`${names[pos]}${b5Jong(names[pos]) ? "이가" : "가"} 고른 활동은 ${b5J("‘" + cats[seq[pos]] + "’", "이에요/예요")}. 그 칸에 붙여요.`);
    got[i]++; pos++; draw(); showNow();
    if (pos === seq.length) finish();
  } }, c)));
  const T = b5TableEl({ title: opt.title, head: opt.head, row: opt.row, cats, vals: counts }, [...cats.map((_, i) => i), "sum"]);
  function finish() {
    binRow.remove();
    after.append(h("p", { class: "inst" }, "스티커 판을 보고 활동마다 학생 수를 세어 표를 완성해요."), T.el,
      h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
        api.tryOnce();
        const keys = [...cats.map((_, i) => i), "sum"], given = keys.map(k => T.ins[k].value.trim() || "-").join(", ");
        const bad = b5CheckTable(T, { cats, vals: counts }, keys);
        bad ? api.fail(bad, given) : api.done(given, opt.ok);
      } }, "확인하기")));
  }
  api.provide({ words: ["스티커 붙이기", "표", "합계"], answers: [cats.map((c, i) => `${c} ${counts[i]}`).join(", ") + `, 합계 ${seq.length}`] });
  draw(); showNow();
  body.append(h("div", { class: "panel" }, stage, h("div", { class: "side" }, h("p", {}, "친구가 고른 활동 칸을 눌러 스티커를 붙여 주세요."), now, binRow)), after);
}
/* ---------- 공학 도구처럼: 수를 넣으면 그래프가 바로 그려져요 ---------- */
function b5Tool(body, api, opt) {
  const g = opt.g, U = g.unit, cats = g.cats;
  let step = 1, horiz = false; const seenH = new Set(), seenS = new Set();
  const ins = cats.map(c => h("input", { type: "text", inputmode: "numeric", "aria-label": c }));
  const tbl = h("div", { class: "b5tbl" }, h("div", { class: "b5tt" }, g.title), h("table", {}, h("tbody", {},
    h("tr", {}, h("th", {}, g.catAxis), cats.map(c => h("th", {}, c))),
    h("tr", {}, h("th", {}, `${g.valAxis}(${U})`), ins.map(i => h("td", {}, i))))));
  const stage = h("div", { class: "stage" });
  const note = h("p", { class: "b5cap" });
  const draw = () => {
    const v = ins.map(b5Num), okv = v.every(x => Number.isFinite(x) && x >= 0);
    const vals = okv ? v : cats.map(() => 0), max = Math.max(1, ...vals);
    const cells = Math.max(2, Math.ceil(max / step));
    const gg = Object.assign({}, g, { vals, step, cells, horiz, every: cells <= 12 ? 1 : 5, ch: null, cw: null });
    const G = b5Geom(gg, cells), svg = makeSvg(G.W, G.H);
    b5Paint(svg, gg, G, { h: vals.map(x => x / step), step, names: cats, title: g.title, catAxis: g.catAxis, valAxis: g.valAxis });
    stage.innerHTML = ""; stage.append(svg);
    if (okv) { seenH.add(horiz); seenS.add(step); }
    note.textContent = okv ? `간격(눈금 한 칸) ${b5U(step, U)} · ${horiz ? "가로형" : "세로형"} — 바꾸어 본 간격 ${seenS.size}가지, 모양 ${seenH.size}가지` : "표에 수를 모두 넣으면 막대그래프가 그려져요.";
  };
  ins.forEach(i => i.addEventListener("input", draw));
  const stepRow = h("div", { class: "b5btns" }, h("span", { class: "b5lbl" }, "간격:"));
  [1, 2, 3, 5, 10, 15].forEach(s => { const b = h("button", { onclick: () => { step = s; [...stepRow.querySelectorAll("button")].forEach(x => x.classList.toggle("b5on", x === b)); draw(); } }, String(s)); if (s === 1) b.classList.add("b5on"); stepRow.append(b); });
  const shapeRow = h("div", { class: "b5btns" }, h("span", { class: "b5lbl" }, "그래프 형태:"));
  [["세로형", false], ["가로형", true]].forEach(([t, v]) => { const b = h("button", { onclick: () => { horiz = v; [...shapeRow.querySelectorAll("button")].forEach(x => x.classList.toggle("b5on", x === b)); draw(); } }, t); if (!v) b.classList.add("b5on"); shapeRow.append(b); });
  const side = h("div", { class: "side" }, h("p", {}, "① 표에 수를 넣어요. ② 간격(눈금 한 칸의 크기)을 바꾸어 봐요. ③ 가로형으로도 바꾸어 봐요."), stepRow, shapeRow, note,
    h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const v = ins.map(b5Num), given = ins.map(i => i.value.trim() || "-").join(", ");
      const bad = v.findIndex((x, i) => x !== g.vals[i]);
      if (bad >= 0) { ins.forEach((i, k) => i.style.borderColor = v[k] === g.vals[k] ? "var(--ok)" : "var(--no)"); return api.fail(`‘${cats[bad]}’ 칸의 수를 조사한 표와 다시 견주어 봐요.`, given); }
      if (seenS.size < 2) return api.hint("간격을 다른 수로 바꾸어 막대의 길이가 어떻게 달라지는지 살펴봐요.");
      if (seenH.size < 2) return api.hint("그래프 형태를 ‘가로형’으로도 바꾸어 봐요.");
      api.done(given + ` / 간격 ${[...seenS].join("·")}, 세로형·가로형`, opt.ok);
    } }, "확인하기"));
  api.provide({ words: ["간격", "눈금 한 칸의 크기", "가로형", "세로형"], answers: [cats.map((c, i) => `${c} ${g.vals[i]}`).join(", ")] });
  draw();
  body.append(tbl, h("div", { class: "panel" }, stage, side));
}
/* ---------- 지도 속 기호 세기 ---------- */
function b5Rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function b5Icon(kind, x, y, s = 36) {
  const g = svgEl("g", { transform: `translate(${x} ${y}) scale(${s / 36})` });
  const P = (d, a) => g.append(svgEl("path", Object.assign({ d }, a)));
  if (kind === "school") { P("M-14 -2 L0 -14 L14 -2 Z", { fill: "#E2734A" }); P("M-12 -2 h24 v16 h-24 Z", { fill: "#FFD9A8", stroke: "#B5552E", "stroke-width": 1.5 }); P("M-3 14 v-8 h6 v8", { fill: "#B5552E" }); P("M0 -14 v-6 l7 2.5 l-7 2.5", { fill: "#D9482B", stroke: "#7A4A2A", "stroke-width": 1 }); }
  else if (kind === "police") { P("M0 -16 L13 -11 L11 6 Q8 13 0 17 Q-8 13 -11 6 L-13 -11 Z", { fill: "#2F5DA8", stroke: "#1C3B70", "stroke-width": 1.5 }); P("M0 -7 L2.4 -1.5 L8 -1 L3.8 2.6 L5 8 L0 5 L-5 8 L-3.8 2.6 L-8 -1 L-2.4 -1.5 Z", { fill: "#F5D04A" }); }
  else if (kind === "library") { P("M0 -8 Q-8 -14 -16 -11 v20 Q-8 6 0 12 Z", { fill: "#fff", stroke: "#2F7D5B", "stroke-width": 2 }); P("M0 -8 Q8 -14 16 -11 v20 Q8 6 0 12 Z", { fill: "#E3F4EA", stroke: "#2F7D5B", "stroke-width": 2 }); }
  else if (kind === "mountain") { P("M-17 13 L-4 -12 L5 3 L9 -4 L18 13 Z", { fill: "#5FA05A", stroke: "#2F6B30", "stroke-width": 1.5 }); P("M-4 -12 L-8 -4 L-1 -6 Z", { fill: "#fff" }); }
  else if (kind === "fall") { P("M-14 -15 h28 v6 h-28 Z", { fill: "#8A7660" }); P("M-10 -9 h20 v24 h-20 Z", { fill: "#7CC2F0" }); P("M-6 -8 v20 M0 -8 v22 M6 -8 v20", { stroke: "#fff", "stroke-width": 2, fill: "none" }); }
  else if (kind === "hospital") { P("M-14 -14 h28 v28 h-28 Z", { fill: "#fff", stroke: "#C9463B", "stroke-width": 2 }); P("M-4 -10 h8 v6 h6 v8 h-6 v6 h-8 v-6 h-6 v-8 h6 Z", { fill: "#D9482B" }); }
  else if (kind === "beach") { P("M-16 -2 Q0 -22 16 -2 Z", { fill: "#F08A6C", stroke: "#B5552E", "stroke-width": 1.5 }); P("M0 -2 v16", { stroke: "#7A4A2A", "stroke-width": 2.5 }); P("M-17 14 Q-8 9 0 14 T17 14", { stroke: "#4E94CF", "stroke-width": 2.5, fill: "none" }); }
  else if (kind === "spa") { P("M-14 6 Q0 18 14 6 Z", { fill: "#7FB2E5", stroke: "#2B6FB8", "stroke-width": 1.5 }); P("M-7 2 q-4 -5 0 -9 t0 -9 M0 2 q-4 -5 0 -9 t0 -9 M7 2 q-4 -5 0 -9 t0 -9", { stroke: "#D9482B", "stroke-width": 2, fill: "none" }); }
  return g;
}
function b5Map(body, api, opt) {
  const W = 680, H = 450, kinds = opt.kinds, rnd = b5Rng(opt.seed || 7);
  const svg = makeSvg(W, H);
  svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "#EEF6E6" }));
  svg.append(svgEl("path", { d: "M0 300 Q170 260 330 300 T680 280", stroke: "#9CCBEA", "stroke-width": 16, fill: "none" }));
  [["M0 150 H680", 14], ["M220 0 V450", 14], ["M470 0 Q450 220 500 450", 12]].forEach(([d, w]) => svg.append(svgEl("path", { d, stroke: "#E2DBCF", "stroke-width": w, fill: "none" })));
  const cx = W - 46, cy = 52;
  svg.append(svgEl("circle", { cx, cy, r: 30, fill: "#fff", stroke: B5_GRID2 }), svgEl("path", { d: `M${cx} ${cy - 24} L${cx + 7} ${cy} L${cx - 7} ${cy} Z`, fill: B5_SEL }),
    txt(cx, cy - 40, "북", 15), txt(cx, cy + 41, "남", 15), txt(cx - 41, cy, "서", 15), txt(cx + 41, cy, "동", 15));
  const spots = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) { const x = 44 + c * 64, y = 46 + r * 70; if (x > 560 && y < 130) continue; spots.push([x + (rnd() - .5) * 16, y + (rnd() - .5) * 14]); }
  for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]]; }
  let si = 0;
  kinds.forEach(k => { for (let m = 0; m < k.n; m++) {
    const [x, y] = spots[si++], ic = b5Icon(k.kind, x, y), mark = svgEl("g", { visibility: "hidden" });
    mark.append(svgEl("circle", { cx: x, cy: y, r: 22, fill: "none", stroke: "#2F8F5B", "stroke-width": 3 }), svgEl("path", { d: `M${x + 10} ${y - 24} l5 6 l9 -12`, stroke: "#2F8F5B", "stroke-width": 3.5, fill: "none" }));
    const hit = svgEl("circle", { cx: x, cy: y, r: 24, fill: "transparent", style: "cursor:pointer" });
    hit.addEventListener("click", () => mark.setAttribute("visibility", mark.getAttribute("visibility") === "hidden" ? "visible" : "hidden"));
    svg.append(ic, mark, hit);
  } });
  const ins = kinds.map(k => h("input", { type: "text", inputmode: "numeric", "aria-label": k.name }));
  const sumIn = h("input", { type: "text", inputmode: "numeric", "aria-label": "합계" });
  const total = kinds.reduce((a, k) => a + k.n, 0);
  const side = h("div", { class: "side" }, h("p", {}, "센 기호를 누르면 ✔ 표시가 생겨요. 기호마다 수를 세어 표에 써요."),
    kinds.map((k, i) => { const s = makeSvg(40, 40); s.append(b5Icon(k.kind, 20, 20, 34)); return h("div", { class: "b5row" }, s, h("span", { style: "min-width:4.5em" }, k.name), ins[i], h("span", {}, "개")); }),
    h("div", { class: "b5row" }, h("span", { style: "min-width:calc(4.5em + 34px + .4em)" }, "합계"), sumIn, h("span", {}, "개")),
    h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const given = kinds.map((k, i) => `${k.name} ${ins[i].value.trim() || "-"}`).join(", ") + `, 합계 ${sumIn.value.trim() || "-"}`;
      let bad = -1;
      ins.forEach((inp, i) => { const g = b5Num(inp) === kinds[i].n; inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g && bad < 0) bad = i; });
      if (bad >= 0) return api.fail(`${kinds[bad].name} 기호를 다시 세어 봐요. 센 기호를 눌러 표시하면 빠뜨리지 않아요.`, given);
      const sg = b5Num(sumIn) === total; sumIn.style.borderColor = sg ? "var(--ok)" : "var(--no)";
      if (!sg) return api.fail("합계는 장소별 수를 모두 더한 수예요.", given);
      api.done(given, opt.ok);
    } }, "확인하기"));
  api.provide({ words: kinds.map(k => k.name).concat("합계"), answers: [kinds.map(k => `${k.name} ${k.n}`).join(", ") + `, 합계 ${total}`] });
  body.append(h("div", { class: "panel" }, h("div", { class: "stage" }, svg), side));
}
/* ---------- 다섯 개씩 묶어 센 기록 ---------- */
function b5TallyFig(cats, vals, title) {
  const RH = 54, LW = 90, W = 600, top = 46, H = top + cats.length * RH + 14;
  const svg = makeSvg(W, H);
  svg.append(txt(W / 2, 22, title, 20));
  cats.forEach((c, i) => {
    const y = top + i * RH;
    svg.append(svgEl("rect", { x: 10, y, width: W - 20, height: RH, fill: "#fff", stroke: B5_GRID2 }), txt(10 + LW / 2, y + RH / 2, c, 19));
    let x = 10 + LW + 18;
    for (let k = 0; k < vals[i]; k++) {
      const gi = Math.floor(k / 5), r = k % 5, gx = x + gi * 70;
      if (r < 4) svg.append(svgEl("line", { x1: gx + r * 11, y1: y + 12, x2: gx + r * 11, y2: y + RH - 12, stroke: B5_INK, "stroke-width": 3, "stroke-linecap": "round" }));
      else svg.append(svgEl("line", { x1: gx - 6, y1: y + RH - 16, x2: gx + 39, y2: y + 16, stroke: B5_SEL, "stroke-width": 3, "stroke-linecap": "round" }));
    }
  });
  return h("div", { class: "b5fig" }, svg);
}
/* ---------- 풍선 띄우기 놀이 ---------- */
function b5Balloon(body, api, opt) {
  const parts = opt.parts, SEC = opt.sec || 15, res = parts.map(() => null), demo = opt.demo;
  let cur = 0, running = false, count = 0, tLeft = SEC, by = 160, bx = 210, vy = 0, drops = 0, last = 0, msgT = 0;
  const W = 420, H = 440, ground = 405, R = 42;
  const svg = makeSvg(W, H); svg.style.touchAction = "manipulation";
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "#EAF4FB" }), svgEl("rect", { x: 0, y: ground, width: W, height: H - ground, fill: "#CFE3C1" }));
    svg.append(svgEl("path", { d: `M${bx} ${by + R} q-8 18 4 34 t-4 30`, stroke: "#7A8A86", "stroke-width": 2, fill: "none" }));
    svg.append(svgEl("ellipse", { cx: bx, cy: by, rx: R * .9, ry: R, fill: "#F06C5B", stroke: "#B5402F", "stroke-width": 2 }), svgEl("ellipse", { cx: bx - 13, cy: by - 15, rx: 8, ry: 12, fill: "#fff", opacity: .5 }));
    svg.append(txt(20, 28, `${cur < parts.length ? parts[cur] : "끝"} · ${count}회`, 24, { "text-anchor": "start" }), txt(W - 20, 28, running ? `${Math.ceil(tLeft)}초` : "", 24, { "text-anchor": "end", fill: B5_SEL }));
    if (msgT > 0) svg.append(txt(W / 2, 70, "떨어졌어요! 다시 띄우고 이어서 세요.", 18, { fill: B5_SEL }));
    if (!running && cur < parts.length) svg.append(txt(W / 2, ground - 80, `▶ 시작을 누르고 ${b5Ro(parts[cur])} 띄운다고 생각하며`, 17), txt(W / 2, ground - 56, "떨어지는 풍선을 눌러 위로 띄워요.", 17));
  };
  const loop = ts => {
    if (!svg.isConnected || !running) return;
    const dt = Math.min(.05, (ts - (last || ts)) / 1000); last = ts;
    vy = Math.min(170, vy + 240 * dt); by += vy * dt; tLeft -= dt; msgT -= dt;
    if (by > ground - R) { by = 150; vy = 0; drops++; msgT = 1.2; }
    if (by < R) { by = R; vy = 0; }
    if (tLeft <= 0) { running = false; res[cur] = count; cur++; showTable(); if (cur >= parts.length) finish(); else { startBtn.textContent = `▶ 시작 (${parts[cur]})`; startBtn.disabled = false; } }
    draw();
    if (running) requestAnimationFrame(loop);
  };
  svg.addEventListener("pointerdown", e => {
    if (!running) return;
    const p = svgPt(svg, e);
    if (Math.hypot(p.x - bx, p.y - by) < R + 30) { count++; vy = -310; bx = Math.max(R + 10, Math.min(W - R - 10, bx + (Math.random() - .5) * 90)); draw(); }
  });
  const tbl = h("div");
  const showTable = () => {
    const done = res.map(v => v == null ? "" : String(v));
    tbl.innerHTML = "";
    tbl.append(h("div", { class: "b5tbl" }, h("div", { class: "b5tt" }, "신체 부위별 풍선을 띄운 횟수 (내 기록)"), h("table", {}, h("tbody", {},
      h("tr", {}, h("th", {}, "신체 부위"), parts.map(p => h("th", {}, p))), h("tr", {}, h("th", {}, "횟수(회)"), done.map(d => h("td", {}, d)))))));
  };
  const startBtn = h("button", { class: "big", onclick: () => {
    if (running || cur >= parts.length) return;
    running = true; count = 0; tLeft = SEC; by = 150; vy = 0; last = 0; startBtn.disabled = true; requestAnimationFrame(loop);
  } }, `▶ 시작 (${parts[0]})`);
  const result = h("div");
  function finish() {
    startBtn.disabled = true;
    const mx = Math.max(5, ...res), cells = Math.ceil(mx / 5) * 5;
    result.innerHTML = "";
    result.append(h("p", { class: "inst" }, "내 기록을 막대그래프로 나타내면 이렇게 돼요."),
      b5Fig({ title: "신체 부위별 풍선을 띄운 횟수 (내 기록)", cats: parts, vals: res, unit: "회", catAxis: "신체 부위", valAxis: "횟수", step: 1, cells, every: cells > 30 ? 10 : 5, ch: Math.max(6, Math.min(30, Math.floor(340 / cells))) }, { tip: false }));
    api.done(parts.map((p, i) => `${p} ${res[i]}회`).join(", "), "기록을 표와 막대그래프로 나타냈어요. 어느 부위로 가장 많이 띄웠나요?");
  }
  const side = h("div", { class: "side" }, h("p", {}, `신체 부위마다 ${SEC}초 동안 풍선을 띄워요(교실에서는 1분 동안 해요). 풍선이 떨어지면 다시 띄우고 횟수는 이어서 세요.`), startBtn,
    h("button", { class: "ghost", onclick: () => { if (running) return; demo.forEach((v, i) => res[i] = v); cur = parts.length; showTable(); finish(); draw(); } }, "놀이가 어려우면: 예시 기록으로 하기"), tbl);
  api.provide({ words: ["표", "막대그래프", "횟수"], answers: [] });
  showTable(); draw();
  body.append(h("div", { class: "panel" }, h("div", { class: "stage" }, svg), side), result);
}
/* ---------- 도윤이의 미로: 옳으면 ‘옳음’ 길, 옳지 않으면 ‘틀림’ 길 ---------- */
function b5Maze(body, api, opt) {
  const S = opt.stmts, W = 760, H = 440, dx = 150, dy = 45, x0 = 70, y0 = 220;
  let path = [], dead = null;   // path: 지금까지 고른 판단(true=옳음)
  const svg = makeSvg(W, H);
  const list = h("div");
  const nodePos = i => { let y = y0; for (let k = 0; k < i; k++) y += path[k] ? -dy : dy; return [x0 + i * dx, y]; };
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "#F7F3EA" }));
    const k = path.length;
    for (let i = 0; i <= Math.min(k, S.length - 1); i++) {
      const [x, y] = nodePos(i);
      if (i === k && !dead) {
        [[-dy, "옳음"], [dy, "틀림"]].forEach(([d, t]) => {
          svg.append(svgEl("line", { x1: x + 22, y1: y, x2: x + dx - 26, y2: y + d, stroke: "#B9A88C", "stroke-width": 6, "stroke-linecap": "round", "stroke-dasharray": "2 10" }));
          svg.append(txt(x + dx / 2, y + d / 2 + (d < 0 ? -16 : 16), t, 16, { fill: B5_SOFT }), b5Q(x + dx, y + d, "?", 16));
        });
      }
      if (i < k) { const [nx, ny] = nodePos(i + 1); svg.append(svgEl("line", { x1: x + 22, y1: y, x2: nx - 22, y2: ny, stroke: "#E0A23C", "stroke-width": 8, "stroke-linecap": "round" }), txt((x + nx) / 2, (y + ny) / 2 + (ny < y ? -16 : 16), path[i] ? "옳음" : "틀림", 16, { fill: B5_SOFT })); }
      svg.append(svgEl("circle", { cx: x, cy: y, r: 22, fill: i === k ? "#2B7BD6" : "#fff", stroke: "#2B7BD6", "stroke-width": 3 }), txt(x, y, String(i + 1), 20, { fill: i === k ? "#fff" : "#2B7BD6" }));
    }
    svg.append(txt(x0 - 40, y0 - 40, "출발", 16, { fill: B5_SOFT }));
    if (dead) {
      const [x, y] = nodePos(dead.i), ny = y + (dead.v ? -dy : dy);
      svg.append(svgEl("line", { x1: x + 22, y1: y, x2: x + dx - 40, y2: ny, stroke: "#E0A23C", "stroke-width": 8, "stroke-linecap": "round" }));
      svg.append(svgEl("rect", { x: x + dx - 40, y: ny - 22, width: 80, height: 44, rx: 10, fill: "#FBE7E2", stroke: B5_SEL, "stroke-width": 2 }), txt(x + dx, ny, S[dead.i].dead, 19));
    }
    if (k === S.length) {
      const [x, y] = nodePos(k);
      svg.append(svgEl("rect", { x: x - 50, y: y - 30, width: 100, height: 60, rx: 12, fill: "#E3F4EA", stroke: "#2F8F5B", "stroke-width": 3 }), txt(x, y, opt.goal, 24, { fill: "#1F6B45" }));
    }
    list.innerHTML = "";
    S.forEach((s, i) => {
      const row = h("div", { class: "b5stmt" + (i === path.length && !dead ? " b5cur" : "") + (i < path.length ? " b5ok" : "") }, h("b", {}, `${i + 1}. `), s.t,
        i < path.length ? h("b", {}, path[i] ? "  → 옳음" : "  → 틀림") : null);
      if (i === path.length && !dead && k < S.length) row.append(h("div", { class: "b5btns", style: "margin-top:.3em" },
        h("button", { onclick: () => choose(true) }, "○ 옳아요"), h("button", { onclick: () => choose(false) }, "× 옳지 않아요")));
      list.append(row);
    });
    if (dead) list.append(h("div", { class: "b5btns" }, h("button", { onclick: () => { dead = null; draw(); } }, "↩ 그 갈림길로 돌아가기")));
  };
  function choose(v) {
    const i = path.length; api.tryOnce();
    if (v !== S[i].a) { dead = { i, v }; draw(); return api.fail(`${S[i].dead}에 도착했어요. 막다른 길이에요! ${S[i].why}`, `${i + 1}번 ${v ? "옳음" : "틀림"}`); }
    path.push(v); draw();
    if (path.length === S.length) api.done(S.map(s => s.a ? "○" : "×").join(" ") + ` → ${opt.goal}`, opt.ok);
  }
  api.provide({ words: ["가로", "세로", "눈금 한 칸"], answers: [S.map((s, i) => `${i + 1} ${s.a ? "○" : "×"}`).join(", ") + `, 도착: ${opt.goal}`] });
  draw();
  if (opt.fig) body.append(opt.fig());
  body.append(h("div", { class: "panel" }, h("div", { class: "stage" }, svg), h("div", { class: "side" }, list)));
}

/* ===== 이 단원의 그래프 자료 (값이 텍스트에 없던 그래프는 지도서의 답·관계에 모두 맞게 정한 값) ===== */
const B5G = {
  books: { title: "학급별 대출한 환경 관련 책의 수", cats: ["1반", "2반", "3반", "4반"], vals: [9, 4, 10, 7], unit: "권", catAxis: "학급", valAxis: "책의 수", step: 1, cells: 10 },
  flower: { title: "좋아하는 꽃별 학생 수", cats: ["국화", "장미", "튤립", "수국"], vals: [12, 26, 20, 24], unit: "명", catAxis: "꽃", valAxis: "학생 수", step: 2, cells: 15, horiz: true },
  act: { title: "실천하고 있는 환경 보호 활동별 학생 수", cats: ["양치 컵 사용하기", "일회용품 사용하지 않기", "분리배출하기", "급식 남기지 않기"], vals: [14, 13, 16, 11], unit: "명", catAxis: "활동", valAxis: "학생 수", step: 1, cells: 18 },
  veg: { title: "기르고 싶어 하는 채소별 학생 수", cats: ["오이", "상추", "가지", "방울토마토", "호박"], vals: [80, 90, 70, 110, 50], unit: "명", catAxis: "채소", valAxis: "학생 수", step: 10, cells: 12, horiz: true },
  cake: { title: "좋아하는 케이크별 학생 수", cats: ["생크림", "고구마", "초코", "치즈"], vals: [5, 7, 8, 4], unit: "명", catAxis: "케이크", valAxis: "학생 수", step: 1, cells: 10 },
  gift: { title: "받고 싶어 하는 선물별 학생 수", cats: ["옷", "간식", "운동용품", "게임기", "장난감"], vals: [60, 40, 90, 100, 70], unit: "명", catAxis: "선물", valAxis: "학생 수", step: 10, cells: 10, horiz: true },
  cup: { title: "일주일 동안 사용한 종류별 일회용품 수", cats: ["종이컵", "빨대", "비닐봉지", "일회용 포크"], vals: [10, 8, 12, 6], unit: "개", catAxis: "종류", valAxis: "일회용품 수", step: 1, cells: 13 },
  color: { title: "좋아하는 색깔별 학생 수", cats: ["빨강", "노랑", "초록", "파랑"], vals: [6, 4, 12, 8], unit: "명", catAxis: "색깔", valAxis: "학생 수", step: 1, cells: 12 },
  trash: { title: "종류별 쓰레기 양", cats: ["캔", "유리", "종이", "플라스틱"], vals: [60, 40, 80, 100], unit: "kg", catAxis: "종류", valAxis: "쓰레기 양", step: 10, cells: 10, horiz: true },
  exp: { title: "하고 싶어 하는 체험 활동별 학생 수", cats: ["소품 만들기", "악기 만들기", "비누 만들기", "장바구니 만들기"], vals: [5, 9, 3, 4], unit: "명", catAxis: "체험 활동", valAxis: "학생 수", step: 1, cells: 20 },
  food: { title: "먹고 싶어 하는 음식별 학생 수", cats: ["떡볶이", "돈가스", "수제비", "비빔밥"], vals: [12, 8, 6, 4], unit: "명", catAxis: "음식", valAxis: "학생 수", step: 1, cells: 13, horiz: true },
  car: { title: "연도별 친환경 자동차 등록 대수", cats: ["2017년", "2018년", "2019년", "2020년"], vals: [35, 45, 60, 80], unit: "만 대", catAxis: "연도", valAxis: "등록 대수", step: 5, cells: 18, every: 6 },
  co: { title: "연도별 자동차의 일산화탄소 배출량", cats: ["2017년", "2018년", "2019년", "2020년"], vals: [28, 24, 22, 18], unit: "만 t", catAxis: "연도", valAxis: "배출량", step: 2, cells: 15 },
  town: { title: "지역 문제별 학생 수", cats: ["주차 문제", "안전 문제", "소음 문제", "환경 오염", "쓰레기 문제"], vals: [90, 60, 30, 40, 20], unit: "명", catAxis: "지역 문제", valAxis: "학생 수", step: 10, cells: 10 },
  lib: { title: "요일별 도서관 방문자 수", cats: ["월요일", "화요일", "수요일", "목요일", "금요일"], vals: [60, 40, 90, 60, 80], unit: "명", catAxis: "요일", valAxis: "방문자 수", step: 10, cells: 10 },
  cold: { title: "월별 최저 기온이 0 ℃보다 낮은 날수", cats: ["11월", "12월", "1월", "2월"], vals: [8, 20, 24, 16], unit: "일", catAxis: "월", valAxis: "날수", step: 2, cells: 13 },
  warmer: { title: "월별 손난로 판매량", cats: ["11월", "12월", "1월", "2월"], vals: [30, 70, 90, 60], unit: "개", catAxis: "월", valAxis: "판매량", step: 10, cells: 10 },
  place1: { title: "장소별 수", cats: ["학교", "경찰서", "도서관", "산", "폭포"], vals: [12, 6, 7, 3, 2], unit: "개", catAxis: "장소", valAxis: "수", step: 1, cells: 13 },
  place2: { title: "장소별 수", cats: ["학교", "병원", "해수욕장", "온천", "산"], vals: [11, 8, 5, 2, 4], unit: "개", catAxis: "장소", valAxis: "수", step: 1, cells: 12 },
  balloon: { title: "신체 부위별 풍선을 띄운 횟수", cats: ["머리", "어깨", "무릎", "발"], vals: [15, 10, 18, 23], unit: "회", catAxis: "신체 부위", valAxis: "횟수", step: 1, cells: 25 },
  balloon2: { title: "신체 부위별 풍선을 띄운 횟수", cats: ["머리", "어깨", "무릎", "발"], vals: [12, 14, 20, 17], unit: "회", catAxis: "신체 부위", valAxis: "횟수", step: 1, cells: 25 },
  ball: { title: "종류별 공을 띄운 횟수", cats: ["탁구공", "플로어볼공", "티볼공", "피구공"], vals: [10, 16, 30, 26], unit: "회", catAxis: "공의 종류", valAxis: "횟수", step: 2, cells: 15 },
  culture: { title: "수업별 신청한 학생 수", cats: ["마술", "수영", "공예", "코딩"], vals: [14, 16, 20, 10], unit: "명", catAxis: "수업", valAxis: "학생 수", step: 2, cells: 12 },
  museum: { title: "가고 싶어 하는 박물관별 학생 수", cats: ["역사", "생태", "과학", "곤충", "민속"], vals: [14, 14, 22, 13, 10], unit: "명", catAxis: "박물관", valAxis: "학생 수", step: 1, cells: 24, horiz: true },
  folk: { title: "좋아하는 민속놀이별 학생 수", cats: ["바둑", "씨름", "투호", "고누"], vals: [4, 7, 9, 6], unit: "명", catAxis: "민속놀이", valAxis: "학생 수", step: 1, cells: 10 }
};
const B5_MILK = { title: "반별 분리배출한 우유갑 수", head: "반", row: "우유갑 수(개)", cats: ["1반", "2반", "3반", "4반"], vals: [30, 25, 40, 15], big: 10, unit: "개" };
const B5_SURVEY_SEQ = [1, 0, 1, 3, 2, 1, 0, 1, 3, 1, 2, 0, 1, 3, 1, 0, 2, 1, 3, 0, 1];
const B5_NAMES = ["민준", "서연", "도윤", "하은", "시우", "지아", "주원", "수아", "하준", "서윤", "지호", "채원", "예준", "지유", "건우", "윤서", "현우", "다은", "우진", "소율", "이서"];
const B5V = (g, o) => Object.assign({}, g, o);
//@@LESSONS
const UNIT_STORY = { title: "환경 보호 실천 학교에서 막대그래프 배우기", lines: [
  "이서네 학교는 환경 보호 실천 학교예요. 이서와 친구들은 환경을 보호하기 위해 어떤 활동을 했는지, 어떤 활동을 하고 싶어 하는지 조사했어요.",
  "대출한 환경 책, 실천하는 환경 보호 활동, 일주일 동안 쓴 일회용품, 하고 싶은 친환경 체험 활동, 친환경 자동차를 조사하며 막대그래프를 읽고 그리는 방법을 배워요.",
  "교과서 「수학 4-1」 5. 막대그래프의 차시 순서 그대로 만들었어요."],
  one: "막대그래프 · 이서와 친구들이 조사한 자료를 막대그래프로 나타내고 읽어요." };
const UNIT_KEYWORDS = ["막대그래프", "가로", "세로", "눈금 한 칸의 크기", "막대의 길이", "제목", "표", "합계", "가장 큰 수", "가로 막대", "세로 막대", "자료 조사", "통계적 사실", "의견"];

const LESSONS = [
{
  id: "b1", no: 1, title: "단원 도입 ― 환경 보호 실천 학교", soop: "개념 찾기(S)",
  question: "조사한 자료를 어떻게 나타내면 한눈에 비교할 수 있을까요?",
  summary: "이서와 친구들은 환경 보호 활동을 조사하여 나타내려고 해요. 3학년 때 배운 표와 그림그래프를 떠올리고, 이 단원에서는 수량을 막대 모양으로 나타낸 그래프를 배워요.",
  steps: [
    { name: "그림 살펴보기", inst: "이서네 학교는 환경 보호 실천 학교예요. 그림 속 학생들이 실천하고 있는 환경 보호 활동을 모두 골라 보세요.", hints: ["지구를 아프게 하지 않는 행동을 찾아요.", "일회용 컵을 많이 쓰거나 전등을 켜 두는 것은 환경 보호 활동이 아니에요."],
      render: (b, a) => b5Ask(b, a, [{ q: "환경 보호 활동을 모두 고르세요.", t: "pick", o: ["양치 컵 사용하기", "일회용품 사용하지 않기", "분리배출하기", "급식 남기지 않기", "쓰지 않는 전등 켜 두기", "일회용 컵 많이 쓰기"], a: [0, 1, 2, 3] }],
        { bad: "빨간 칸을 다시 살펴봐요. 지구를 아프게 하지 않는 행동인지 생각해 봐요.", ok: "양치 컵 사용하기, 일회용품 사용하지 않기, 분리배출하기, 급식 남기지 않기는 모두 환경을 지키는 활동이에요." }) },
    { name: "곰곰! 그림그래프 그리기", inst: "3학년 때 배운 그림그래프를 떠올려요. 4학년 학생들이 반별로 분리배출한 우유갑 수를 보고 그림그래프를 완성해 보세요.", hints: ["30개는 큰 그림(10개) 3개로 나타내요.", "25개는 큰 그림 2개와 작은 그림(1개) 5개로 나타내요."],
      render: (b, a) => b5Pict(b, a, Object.assign({ ok: "표의 수를 큰 그림과 작은 그림으로 알맞게 나타냈어요!" }, B5_MILK)) },
    { name: "곰곰! 그림그래프 읽기", inst: "완성한 그림그래프를 보고 물음에 답해 보세요.", hints: ["큰 그림이 많을수록 우유갑이 많아요.", "합계는 네 반의 우유갑 수를 모두 더한 수예요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5PictFig(B5_MILK), q: "우유갑을 가장 많이 모은 반은 어느 반인가요?", t: "pick", o: ["1반", "2반", "3반", "4반"], a: 2 },
        { q: "우유갑을 가장 적게 모은 반은 어느 반인가요?", t: "pick", o: ["1반", "2반", "3반", "4반"], a: 3 },
        { q: "네 반이 모은 우유갑은 모두 몇 개인가요?", t: "num", a: 110, unit: "개" },
        { q: "3반은 2반보다 우유갑을 몇 개 더 모았나요?", t: "num", a: 15, unit: "개", why: { "65": "두 반의 차이를 구해요. 40−25를 계산해요." } }],
        { bad: "빨간 칸을 다시 살펴봐요. 큰 그림은 10개, 작은 그림은 1개를 나타내요.", ok: "그림그래프는 그림의 크기와 수로 많고 적음을 한눈에 알 수 있어요." }) },
    { name: "똑똑! 무엇을 배울까요", inst: "같은 자료를 이번에는 막대 모양으로 나타냈어요. 그래프를 살펴보고 답해 보세요.", hints: ["막대의 폭은 모두 같아요. 반마다 무엇이 다른지 살펴봐요.", "막대가 길수록 우유갑이 많아요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5V(B5G.books, { title: "반별 분리배출한 우유갑 수", vals: [30, 25, 40, 15], unit: "개", catAxis: "반", valAxis: "우유갑 수", step: 5, cells: 9, every: 2 }), { ruler: false }),
          q: "막대 모양으로 나타낸 그래프에서 우유갑 수를 나타내는 것은 무엇인가요?", t: "pick", o: ["막대의 길이", "막대의 폭", "막대의 색깔"], a: 0, why: { "1": "막대의 폭은 모두 같아요. 우유갑이 많을수록 무엇이 달라지나요?", "2": "막대의 색깔은 모두 같아요." } },
        { q: "우유갑을 가장 많이 모은 반을 한눈에 찾으려면 무엇을 찾으면 될까요?", t: "pick", o: ["가장 긴 막대", "가장 짧은 막대", "가장 왼쪽 막대"], a: 0 }],
        { ok: "막대의 길이로 수량을 나타내면 많고 적음을 한눈에 비교할 수 있어요. 이 단원에서 이런 그래프를 배워요." }) },
    { name: "생각 나누기", inst: "단원 도입 그림의 이야기를 떠올리며 내 생각을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "우리나라에는 독도를 포함해서 섬이 3383개나 있대요. 나라별로 섬이 몇 개 있는지 비교하려면 어떻게 나타내면 좋을까요?", tag: "섬", ph: "예) 막대 모양 그래프로 나타내면 …" },
        { q: "환경 보호 활동을 해 본 경험을 써 보세요.", tag: "경험", ph: "예) 일회용 컵 대신 물병을 썼어요." },
        { q: "막대 모양으로 나타낸 그래프는 표로 나타낸 것과 어떤 점이 다를 것 같나요?", tag: "궁금", ph: "예) 표보다 … 을 한눈에 볼 수 있을 것 같아요." }]) }
  ],
  challenge: { inst: "그림그래프를 보고 물음에 답해 보세요.", hints: ["큰 그림 1개는 10개, 작은 그림 1개는 1개예요.", "2반과 4반의 우유갑 수를 더해 보세요."],
    render: (b, a) => b5Ask(b, a, [
      { fig: () => b5PictFig(B5_MILK), q: "큰 그림 2개와 작은 그림 5개는 우유갑 몇 개를 나타내나요?", t: "num", a: 25, unit: "개", why: { "7": "큰 그림 1개는 10개를 나타내요." } },
      { q: "2반과 4반이 모은 우유갑을 합하면 어느 반이 모은 우유갑 수와 같나요?", t: "pick", o: ["1반", "3반", "같은 반이 없어요"], a: 1 },
      { q: "3반이 우유갑을 5개 더 모으면 큰 그림은 몇 개가 되나요?", t: "num", a: 4, unit: "개", why: { "5": "45개는 큰 그림 4개와 작은 그림 5개예요." } }],
      { bad: "빨간 칸을 다시 살펴봐요. 큰 그림은 10개, 작은 그림은 1개를 나타내요.", ok: "그림그래프를 정확하게 읽었어요!" }) }
},
{
  id: "b2", no: 2, title: "막대그래프를 알아볼까요", soop: "개념 구축하기(O)",
  question: "조사한 자료의 수량을 막대 모양으로 나타내면 무엇이 편리할까요?",
  summary: "조사한 자료의 수량을 막대 모양으로 나타낸 그래프를 막대그래프라고 해요. 막대의 길이가 수량을 나타내고, 눈금 한 칸의 크기를 보고 수량을 읽어요. 막대는 세로로도 가로로도 나타낼 수 있어요.",
  steps: [
    { inst: "이서는 4학년 학생들이 학급별로 대출한 환경 관련 책의 수를 표로 나타냈어요. 그래프에서 학급마다 막대를 위로 끌어 올려(또는 눌러) 책의 수만큼 세워 보세요.", hints: ["세로 눈금 한 칸은 1권이에요. 9권이면 9칸만큼 세워요.", "막대를 누른 뒤 ▲ ▼ 단추로 한 칸씩 고칠 수 있어요."],
      render: (b, a) => b5Build(b, a, { g: B5G.books, ok: "막대의 길이가 책의 수를 나타내요. 3반 막대가 가장 길어요!" }) },
    { inst: "이번에는 가로와 세로를 바꾸어 막대를 가로로 나타내요. 학급마다 막대를 오른쪽으로 끌어 책의 수만큼 늘여 보세요.", hints: ["가로 눈금 한 칸도 1권이에요.", "막대의 길이가 책의 수만큼이 되게 해요."],
      render: (b, a) => b5Build(b, a, { g: B5V(B5G.books, { horiz: true }), ok: "막대를 가로로 나타내도 막대의 길이가 책의 수를 나타내요!" }) },
    { inst: "막대그래프를 보고 물음에 답해 보세요.", hints: ["막대가 서 있는 아래쪽(가로)에 학급이 쓰여 있어요.", "0과 5 사이에 눈금이 5칸 있어요. 5칸이 5권이에요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5G.books), q: "그래프의 가로는 무엇을 나타내나요?", t: "pick", o: ["학급", "책의 수"], a: 0 },
        { q: "그래프의 세로는 무엇을 나타내나요?", t: "pick", o: ["학급", "책의 수"], a: 1 },
        { q: "막대의 길이는 무엇을 나타내나요?", t: "pick", o: ["대출한 환경 관련 책의 수", "학급의 수", "막대의 폭"], a: 0 },
        { q: "세로 눈금 한 칸은 몇 권을 나타내나요?", t: "num", a: 1, unit: "권", why: { "5": "0과 5 사이에 눈금이 5칸 있어요. 5칸이 5권이면 한 칸은 몇 권일까요?" } },
        { q: "세로 막대그래프와 가로 막대그래프의 같은 점은 무엇인가요?", t: "pick", o: ["두 그래프 모두 막대의 길이가 대출한 책의 수를 나타내요", "두 그래프 모두 학급이 가로에 있어요"], a: 0, why: { "1": "가로 막대그래프는 학급이 세로에 있어요. 학급과 책의 수를 나타내는 위치가 달라요." } }],
        { ok: "가로는 학급, 세로는 책의 수, 세로 눈금 한 칸은 1권이에요. 막대를 가로로 나타내면 학급과 책의 수의 위치만 바뀌어요." }) },
    { inst: "약속을 완성해요.", hints: ["조사한 수량을 막대 모양으로 나타냈어요."],
      render: (b, a) => blanks(b, a, ["조사한 자료의 수량을 ", { o: ["막대", "그림", "점"], a: 0 }, " 모양으로 나타낸 그래프를 ", { o: ["막대그래프", "그림그래프", "표"], a: 0 }, "라고 해요. 막대그래프에서는 막대의 ", { o: ["길이", "폭"], a: 0 }, "에 따라 수량을 알 수 있어요."]) },
    { inst: "표와 막대그래프는 각각 어떤 점이 편리할까요? 카드를 알맞은 상자에 넣어 보세요.", hints: ["표에는 수가 그대로 쓰여 있고 합계도 있어요.", "막대그래프는 막대의 길이를 한눈에 견줄 수 있어요."],
      render: (b, a) => b5Sort(b, a, { bins: ["표가 편리한 점", "막대그래프가 편리한 점"], cards: [
        { t: "항목별 수를 정확하게 알 수 있어요.", b: 0 }, { t: "자료의 수량을 한눈에 비교할 수 있어요.", b: 1 },
        { t: "전체 합계를 한눈에 알 수 있어요.", b: 0 }, { t: "가장 많은 것과 가장 적은 것을 한눈에 알 수 있어요.", b: 1 }],
        ok: "표와 막대그래프는 서로 다른 좋은 점이 있어요. 어느 하나가 언제나 더 좋은 것은 아니에요." }) }
  ],
  challenge: { inst: "민수네 학교 4학년 학생들이 좋아하는 꽃을 조사하여 나타낸 막대그래프예요. 물음에 답해 보세요.", hints: ["가로 눈금 5칸이 10명이에요.", "10명을 5칸으로 나누면 한 칸은 몇 명일까요?"],
    render: (b, a) => b5Ask(b, a, [
      { fig: () => b5Fig(B5G.flower), q: "그래프의 가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 학생 수, 세로: 꽃", "가로: 꽃, 세로: 학생 수"], a: 0 },
      { q: "가로 눈금 한 칸은 몇 명을 나타내나요?", t: "num", a: 2, unit: "명", why: { "1": "0과 10 사이가 5칸이에요. 5칸이 10명이면 한 칸은 몇 명일까요?", "10": "10명은 눈금 5칸이 나타내는 수예요.", "5": "5는 0과 10 사이의 칸 수예요." } },
      { q: "장미를 좋아하는 학생은 몇 명인가요?", t: "num", a: 26, unit: "명", why: { "13": "장미 막대는 13칸이에요. 한 칸이 2명이면 13칸은 몇 명일까요?" } }],
      { ok: "눈금 한 칸이 2명인 것을 알고 정확하게 읽었어요!" }) }
},
{
  id: "b3", no: 3, title: "막대그래프의 내용을 알아볼까요", soop: "개념 구축하기(O)",
  question: "막대그래프를 보고 어떤 내용을 알 수 있을까요?",
  summary: "막대그래프에서는 막대가 길수록 수량이 많아요. 먼저 가로와 세로가 무엇을 나타내는지, 눈금 한 칸의 크기가 얼마인지 확인하면 항목별 수량과 많고 적음, 차이를 알 수 있어요.",
  steps: [
    { inst: "이서네 학교 4학년 학생들이 실천하고 있는 환경 보호 활동을 조사하여 나타낸 막대그래프예요. 그래프를 누르면 눈금 자가 나와요.", hints: ["막대가 가장 긴 활동을 찾아요.", "막대가 가장 짧은 활동을 찾아요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5G.act), q: "무엇을 조사하여 나타낸 막대그래프인가요?", t: "pick", o: ["4학년 학생들이 실천하고 있는 환경 보호 활동", "4학년 학생들이 좋아하는 운동", "반별 학생 수"], a: 0 },
        { q: "가장 많은 학생이 실천하고 있는 활동은 무엇인가요?", t: "pick", o: B5G.act.cats, a: 2 },
        { q: "가장 적은 학생이 실천하고 있는 활동은 무엇인가요?", t: "pick", o: B5G.act.cats, a: 3 }],
        { ok: "막대가 가장 긴 ‘분리배출하기’를 가장 많은 학생이, 가장 짧은 ‘급식 남기지 않기’를 가장 적은 학생이 실천해요." }) },
    { inst: "같은 막대그래프에서 수량을 알아봐요. 눈금 자를 막대 끝에 맞추어 몇 칸인지 세어 보세요.", hints: ["세로 눈금 5칸이 5명이에요.", "‘일회용품 사용하지 않기’ 막대보다 긴 막대를 모두 찾아요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5G.act), q: "세로 눈금 한 칸은 몇 명을 나타내나요?", t: "num", a: 1, unit: "명", why: { "5": "0과 5 사이에 눈금이 5칸 있어요. 5칸이 5명이에요." } },
        { q: "‘양치 컵 사용하기’를 실천하는 학생은 몇 명인가요?", t: "num", a: 14, unit: "명" },
        { q: "‘일회용품 사용하지 않기’보다 더 많은 학생이 실천하는 활동을 모두 고르세요.", t: "pick", o: B5G.act.cats, a: [0, 2], why: { "2": "‘양치 컵 사용하기’ 막대도 ‘일회용품 사용하지 않기’ 막대보다 길어요.", "0": "‘분리배출하기’ 막대도 ‘일회용품 사용하지 않기’ 막대보다 길어요.", "0,2,3": "‘급식 남기지 않기’ 막대는 더 짧아요." } }],
        { ok: "‘양치 컵 사용하기’는 14명이에요. ‘양치 컵 사용하기’와 ‘분리배출하기’의 막대가 ‘일회용품 사용하지 않기’보다 길어요." }) },
    { inst: "도하네 학교 학생들이 학교 텃밭에서 기르고 싶어 하는 채소를 조사하여 나타낸 막대그래프예요. 가로 눈금 한 칸은 몇 명을 나타내는지 살펴볼까요?", hints: ["가로 눈금 5칸이 50명이에요.", "가지 막대는 7칸이에요. 한 칸이 10명이면 7칸은?"],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5G.veg), q: "가로 눈금 한 칸은 몇 명을 나타내나요?", t: "num", a: 10, unit: "명", why: { "1": "가로 눈금 5칸이 50명이에요. 한 칸은 1명이 아니에요.", "5": "5는 0과 50 사이의 칸 수예요. 50명을 5칸으로 나누면?", "50": "50명은 눈금 5칸이 나타내는 수예요." } },
        { q: "가지를 기르고 싶어 하는 학생은 몇 명인가요?", t: "num", a: 70, unit: "명", why: { "7": "가지 막대는 7칸이에요. 한 칸이 10명이니 7칸은 몇 명일까요?" } },
        { q: "오이를 기르고 싶어 하는 학생은 호박보다 몇 명 더 많나요?", t: "num", a: 30, unit: "명", why: { "3": "막대 길이가 3칸 차이 나요. 한 칸이 10명이면 몇 명일까요?", "130": "두 수를 더하지 말고 차이를 구해요." } }],
        { ok: "가로 눈금 한 칸은 10명이에요. 가지는 70명, 오이는 호박보다 30명 더 많아요." }) },
    { inst: "막대그래프를 읽는 약속을 완성해요.", hints: ["막대의 길이가 수량을 나타내요."],
      render: (b, a) => blanks(b, a, ["막대그래프에서 막대의 길이가 길수록 수량이 ", { o: ["많아요", "적어요"], a: 0 }, ". 가장 많은 것은 막대가 가장 ", { o: ["긴", "짧은"], a: 0 }, " 것이에요. 수량을 알려면 먼저 눈금 한 칸의 ", { o: ["크기", "색깔"], a: 0 }, "부터 확인해요."]) },
    { inst: "많은 학생이 기르고 싶어 하는 채소부터 차례대로 눌러 보세요.", hints: ["가장 긴 막대부터 차례로 눌러요.", "방울토마토 막대가 가장 길어요."],
      render: (b, a) => { b.append(b5Fig(B5G.veg)); sequence(b, a, ["오이", "상추", "가지", "방울토마토", "호박"], [3, 1, 0, 2, 4], { ok: "방울토마토, 상추, 오이, 가지, 호박 순서예요. 막대의 길이로 한눈에 알 수 있어요." }); } }
  ],
  challenge: { inst: "익힘책 문제예요. 두 막대그래프를 보고 물음에 답해 보세요.", hints: ["몇 배는 큰 수가 작은 수의 몇 번만큼인지 생각해요.", "선물 그래프는 가로 눈금 한 칸이 10명이에요."],
    render: (b, a) => b5Ask(b, a, [
      { fig: () => b5Fig(B5G.cake), q: "가장 많은 학생이 좋아하는 케이크는 무엇인가요?", t: "pick", o: B5G.cake.cats, a: 2 },
      { q: "초코케이크를 좋아하는 학생 수는 치즈케이크를 좋아하는 학생 수의 몇 배인가요?", t: "num", a: 2, unit: "배", why: { "4": "8−4=4는 차이예요. 8은 4의 몇 배인지 생각해요." } },
      { fig: () => b5Fig(B5G.gift), q: "옷을 받고 싶어 하는 학생은 몇 명인가요?", t: "num", a: 60, unit: "명", why: { "6": "옷 막대는 6칸이고, 가로 눈금 한 칸은 10명이에요." } },
      { q: "두 번째로 많은 학생이 받고 싶어 하는 선물은 무엇인가요?", t: "pick", o: B5G.gift.cats, a: 2 },
      { q: "장난감보다 적은 학생이 받고 싶어 하는 선물을 모두 고르세요.", t: "pick", o: B5G.gift.cats, a: [0, 1] },
      { q: "환경 보호 활동 막대그래프로 만든 질문 중 답이 ‘3명’인 것은 무엇인가요?", t: "pick", o: ["‘양치 컵 사용하기’를 실천하는 학생은 ‘급식 남기지 않기’보다 몇 명 더 많나요?", "‘분리배출하기’를 실천하는 학생은 몇 명인가요?"], a: 0 }],
      { ok: "여러 가지 막대그래프에서 수량, 차이, 몇 배를 정확하게 알아냈어요!" }) }
},
{
  id: "b4", no: 4, title: "막대그래프로 나타내는 방법을 알아볼까요", soop: "개념 구축하기(O)",
  question: "표를 보고 막대그래프로 나타내려면 어떻게 해야 할까요?",
  summary: "막대그래프로 나타낼 때는 ① 가로와 세로에 무엇을 나타낼지 정하고 ② 가장 큰 수까지 나타낼 수 있도록 눈금 한 칸의 크기를 정한 뒤 ③ 조사한 수에 맞게 막대를 그리고 ④ 알맞은 제목을 써요.",
  steps: [
    { inst: "이서네 모둠 학생들이 일주일 동안 사용한 일회용품 수를 조사하여 표로 나타냈어요. 가로와 세로에 무엇을 나타낼지 고르고, 막대를 세운 뒤 알맞은 제목을 골라 보세요. 세로 눈금 한 칸은 1개예요.", hints: ["막대가 서는 가로에는 일회용품의 종류를, 세로에는 일회용품 수를 나타내요.", "비닐봉지는 12개이니 12칸만큼 세워요."],
      render: (b, a) => b5Build(b, a, { g: B5G.cup, axisPick: true, titleChoices: ["좋아하는 일회용품", "일주일 동안 사용한 종류별 일회용품 수", "이서네 모둠 학생 수"], ok: "가로에 종류, 세로에 일회용품 수를 나타내고 알맞은 제목도 붙였어요!" }) },
    { inst: "이번에는 세로 눈금이 8칸뿐이에요. 가장 큰 수까지 막대그래프에 나타내려면 세로 눈금 한 칸은 몇 개로 해야 할까요? 눈금 한 칸의 크기를 고르고 막대를 다시 세워 보세요.", hints: ["눈금 한 칸이 1개이면 8칸으로 8개까지만 나타낼 수 있어요. 가장 큰 수는 12예요.", "한 칸이 2개이면 종이컵 10개는 5칸이에요."],
      render: (b, a) => b5Build(b, a, { g: B5V(B5G.cup, { cells: 8 }), stepChoices: [1, 2, 5], ok: "가장 큰 수가 12이고 눈금이 8칸이니 한 칸을 2개로 정했어요. 종이컵 5칸, 빨대 4칸, 비닐봉지 6칸, 일회용 포크 3칸이에요." }) },
    { inst: "처음 그린 막대그래프의 가로와 세로를 바꾸어 막대를 가로로 나타내 보세요.", hints: ["이번에는 세로에 종류, 가로에 일회용품 수가 있어요.", "가로 눈금 한 칸은 1개예요."],
      render: (b, a) => b5Build(b, a, { g: B5V(B5G.cup, { horiz: true }), ok: "막대를 가로로 나타냈어요. 막대그래프로 잘 나타냈는지 표와 다시 견주어 봐요." }) },
    { inst: "막대그래프로 나타내는 방법을 정리해요.", hints: ["가장 큰 수가 그래프 안에 들어가야 해요.", "제목은 먼저 써도 돼요."],
      render: (b, a) => blanks(b, a, ["① 표를 보고 가로와 세로에 무엇을 나타낼지 정해요. ② ", { o: ["가장 큰 수", "가장 작은 수"], a: 0 }, "까지 나타낼 수 있도록 ", { o: ["눈금 한 칸의 크기", "막대의 굵기"], a: 0 }, "를 정해요. ③ 조사한 자료의 수에 맞게 ", { o: ["막대", "그림"], a: 0 }, " 모양으로 나타내요. ④ 막대그래프에 알맞은 ", { o: ["제목", "눈금"], a: 0 }, "을 써요. (제목은 먼저 써도 돼요.)"]) },
    { inst: "좋아하는 색깔별 학생 수를 막대그래프로 나타내요. 눈금 칸 수와 눈금 한 칸의 크기를 스스로 정해 보세요.", hints: ["가장 큰 수는 12예요. (칸 수) × (한 칸의 크기)가 12보다 작으면 안 돼요.", "모든 수가 눈금 칸에 꼭 맞으려면 한 칸의 크기로 6, 4, 12, 8을 모두 나눌 수 있어야 해요."],
      render: (b, a) => b5Build(b, a, { g: B5G.color, stepChoices: [5, 1, 2], cellChoices: [5, 6, 10, 12], ok: "같은 자료라도 눈금 한 칸의 크기에 따라 막대의 칸 수가 달라져요. 하지만 나타내는 수는 같아요." }) }
  ],
  challenge: { inst: "어느 마을에서 일주일 동안 나온 종류별 쓰레기 양을 가로 막대그래프로 나타내 보세요. 가로 눈금은 10칸이에요.", hints: ["가장 큰 수는 100 kg이에요. 10칸으로 100 kg까지 나타내려면?", "캔 60 kg은 한 칸이 10 kg이면 6칸이에요."],
    render: (b, a) => b5Build(b, a, { g: B5G.trash, stepChoices: [1, 10, 20, 50], ok: "가장 큰 수 100 kg까지 나타낼 수 있게 눈금 한 칸의 크기를 정하고 막대를 그렸어요!" }) }
},
{
  id: "b5", no: "5~6", title: "자료를 조사하여 막대그래프로 나타내어 볼까요", soop: "탐구 정리하기(O)",
  question: "우리 반 학생들이 하고 싶어 하는 친환경 체험 활동을 조사하여 어떻게 나타낼까요?",
  summary: "알고 싶은 것을 정하고, 조사 방법(손 들기, 스티커 붙이기, 공학 도구)을 정해 자료를 모아요. 모은 자료를 표로 정리하고 막대그래프로 나타내면 가장 많은 것과 가장 적은 것을 한눈에 알 수 있어요.",
  steps: [
    { name: "조사 계획 세우기", inst: "선생님께서 환경의 날에 하고 싶은 친환경 체험 활동을 이야기해 보자고 하셨어요. 우리 반 학생들이 하고 싶어 하는 체험 활동은 어떻게 조사해야 할까요?", hints: ["친구들에게 직접 물어서 자료를 모아야 해요.", "‘나’ 한 사람이 아니라 ‘우리 반 학생들’에 대해 묻는 질문을 골라요."],
      render: (b, a) => b5Ask(b, a, [
        { q: "조사하는 방법으로 알맞은 것을 모두 고르세요.", t: "pick", o: ["직접 손 들기", "스티커 붙이기", "공학 도구로 자료 수집하기", "친구들에게 묻지 않고 짐작하기"], a: [0, 1, 2], why: { "0,1,2,3": "짐작한 것은 조사한 자료가 아니에요." } },
        { q: "조사하기에 알맞은 질문은 어느 것인가요?", t: "pick", o: ["우리 반 학생들은 어떤 친환경 체험 활동을 하고 싶어 할까?", "나는 어떤 친환경 체험 활동을 하고 싶을까?"], a: 0, why: { "1": "나 한 사람의 생각은 조사하지 않아도 알 수 있어요. 여러 친구의 자료를 모아야 해요." } }],
        { bad: "빨간 칸을 다시 살펴봐요. 우리 반 친구들에게 직접 물어서 자료를 모으는 방법인지 생각해 봐요.", ok: "우리 반 학생들에게 직접 묻는 방법으로 자료를 모아요. 이서네 모둠은 소품 만들기, 악기 만들기, 비누 만들기, 장바구니 만들기 네 가지로 조사하기로 했어요." }) },
    { name: "스티커로 조사하기", inst: "이서네 반 친구 21명이 하고 싶은 체험 활동에 스티커를 붙여요. 차례대로 친구가 고른 활동 칸을 눌러 스티커를 붙인 다음, 표로 정리해 보세요.", hints: ["스티커 판에서 활동마다 스티커를 세어요.", "합계는 조사한 친구 수와 같아요."],
      render: (b, a) => b5Tally(b, a, { cats: B5G.exp.cats, seq: B5_SURVEY_SEQ, names: B5_NAMES, title: B5G.exp.title, head: "체험 활동", row: "학생 수(명)", ok: "스티커로 모은 자료를 표로 정리했어요. 합계 21명은 조사한 친구 수와 같아요." }) },
    { name: "막대그래프로 나타내기", inst: "조사한 표를 보고 막대그래프로 나타내요. 가로와 세로, 눈금 칸 수, 눈금 한 칸의 크기, 제목을 스스로 정해 보세요.", hints: ["가장 큰 수는 9예요. 9까지 나타낼 수 있어야 해요.", "한 칸이 2명이면 9명, 3명, 5명은 칸에 꼭 맞지 않아요."],
      render: (b, a) => b5Build(b, a, { g: B5G.exp, axisPick: true, stepChoices: [5, 2, 1], cellChoices: [5, 10, 20], titleChoices: ["우리 반 학생 수", "하고 싶어 하는 체험 활동별 학생 수", "환경의 날"], ok: "가로에 체험 활동, 세로에 학생 수를 나타내고 눈금 한 칸을 1명으로 정해 막대그래프를 완성했어요!" }) },
    { name: "공학 도구로 그리기", inst: "공학 도구(이지통계)처럼 표에 수를 넣으면 막대그래프가 바로 그려져요. 간격(눈금 한 칸의 크기)과 그래프 형태를 바꾸어 보세요.", hints: ["조사한 표의 수 5, 9, 3, 4를 넣어요.", "간격을 바꾸고, 가로형도 눌러 봐요."],
      render: (b, a) => b5Tool(b, a, { g: B5G.exp, ok: "간격을 바꾸면 막대의 칸 수가 달라지고, 가로형으로 바꾸면 막대가 가로로 그려져요. 그래도 나타내는 자료는 같아요." }) },
    { name: "비교하고 이야기하기", inst: "우리 반 막대그래프를 보고 알 수 있는 내용을 이야기해 보세요.", hints: ["막대가 가장 긴 활동과 가장 짧은 활동을 찾아요.", "9는 3의 몇 배일까요?"],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5V(B5G.exp, { cells: 10 })), q: "가장 많은 학생이 하고 싶어 하는 활동은 무엇인가요?", t: "pick", o: B5G.exp.cats, a: 1 },
        { q: "가장 적은 학생이 하고 싶어 하는 활동은 무엇인가요?", t: "pick", o: B5G.exp.cats, a: 2 },
        { q: "‘악기 만들기’를 하고 싶어 하는 학생 수는 ‘비누 만들기’의 몇 배인가요?", t: "num", a: 3, unit: "배", why: { "6": "9−3=6은 차이예요. 9는 3의 몇 배인지 생각해요." } },
        { q: "체험 활동을 하나만 정한다면 무엇이 좋을까요? 그래프에 근거한 까닭을 골라요.", t: "pick", o: ["악기 만들기 ― 가장 많은 학생이 하고 싶어 하기 때문이에요.", "소품 만들기 ― 표에서 가장 왼쪽에 있기 때문이에요."], a: 0 }],
        { ok: "우리 반 학생들이 가장 많이 하고 싶어 하는 활동은 ‘악기 만들기’(9명), 가장 적게 하고 싶어 하는 활동은 ‘비누 만들기’(3명)예요." }) }
  ],
  challenge: { inst: "‘먹고 싶어 하는 음식’을 조사한 표예요. 많이 먹고 싶어 하는 음식부터 위에서 차례대로 막대가 가로인 막대그래프로 나타내 보세요.", hints: ["가장 많은 떡볶이(12명)를 맨 위에 써요.", "막대 이름을 고른 다음 막대의 길이를 맞춰요."],
    render: (b, a) => b5Build(b, a, { g: B5G.food, nameBlank: [0, 1, 2, 3], nameOptions: ["수제비", "떡볶이", "돈가스", "비빔밥"], nameWhy: "많이 먹고 싶어 하는 음식부터 위에서 차례대로 써요.", stepChoices: [5, 1, 2],
      table: { cats: ["수제비", "떡볶이", "돈가스", "비빔밥"], vals: [6, 12, 8, 4], head: "음식", row: "학생 수(명)" }, ok: "떡볶이, 돈가스, 수제비, 비빔밥 순서로 막대그래프를 완성했어요!" }) }
},
{
  id: "b7", no: 7, title: "막대그래프를 생활에 활용해 볼까요", soop: "탐구 정리하기(O)",
  question: "생활 속 막대그래프를 보고 무엇을 알고 판단할 수 있을까요?",
  summary: "막대그래프에서 가장 많은 것, 가장 적은 것, 늘어나거나 줄어드는 모습 같은 통계적 사실을 찾을 수 있어요. 사실을 바탕으로 내 생각(의견)을 말하고 알맞은 결정을 할 수 있어요.",
  steps: [
    { name: "두 막대그래프 살펴보기", inst: "이서네 반 학생들이 우리나라의 연도별 친환경 자동차 등록 대수와 자동차의 일산화탄소 배출량을 조사하여 나타낸 막대그래프예요.", hints: ["왼쪽 그래프의 제목을 읽어요.", "막대가 가장 긴 해와 가장 짧은 해를 찾아요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Figs([{ g: B5G.car }, { g: B5G.co }]), q: "왼쪽 막대그래프는 무엇을 조사하여 나타냈나요?", t: "pick", o: ["연도별 친환경 자동차 등록 대수", "연도별 자동차의 일산화탄소 배출량", "연도별 학생 수"], a: 0 },
        { q: "친환경 자동차 등록 대수가 가장 많은 때는 언제인가요?", t: "pick", o: B5G.car.cats, a: 3 },
        { q: "자동차의 일산화탄소 배출량이 가장 적은 때는 언제인가요?", t: "pick", o: B5G.car.cats, a: 3 }],
        { ok: "친환경 자동차 등록 대수가 가장 많은 때도, 일산화탄소 배출량이 가장 적은 때도 2020년이에요." }) },
    { name: "두 그래프 견주기", inst: "두 막대그래프를 함께 보고 생각해 보세요. (막대의 길이는 교과서 그래프를 바탕으로 어림하여 그렸어요.)", hints: ["2017년부터 2020년까지 막대가 길어지는지 짧아지는지 살펴봐요.", "친환경 자동차는 공해가 적어요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Figs([{ g: B5G.car }, { g: B5G.co }]), q: "2017년부터 2020년까지 친환경 자동차 등록 대수는 어떻게 변했나요?", t: "pick", o: ["늘어났어요", "줄어들었어요", "그대로예요"], a: 0 },
        { q: "같은 때 자동차의 일산화탄소 배출량은 어떻게 변했나요?", t: "pick", o: ["늘어났어요", "줄어들었어요", "그대로예요"], a: 1 },
        { q: "일산화탄소 배출량이 줄어든 까닭으로 생각할 수 있는 것은?", t: "pick", o: ["친환경 자동차의 등록 대수가 늘어났기 때문이에요.", "자동차가 모두 없어졌기 때문이에요."], a: 0 },
        { q: "2022년 친환경 자동차 등록 대수가 159만 대로 늘었어요. 2022년 일산화탄소 배출량은 어떻게 되었을 것 같나요?", t: "pick", o: ["줄었을 것 같아요.", "크게 늘었을 것 같아요."], a: 0 }],
        { ok: "친환경 자동차 등록 대수는 늘고 일산화탄소 배출량은 줄었어요. 두 막대그래프를 함께 보면 더 많은 것을 생각할 수 있어요." }) },
    { name: "글로 완성하기", inst: "민우네 학교 4학년 학생들이 생각하는 지역 문제를 조사하여 나타낸 막대그래프예요. 알 수 있는 내용을 글로 완성해 보세요.", hints: ["막대가 가장 긴 것과 가장 짧은 것을 찾아요.", "세로 눈금 한 칸은 10명이에요."],
      render: (b, a) => { b.append(b5Fig(B5G.town)); blanks(b, a, ["가장 많은 학생이 생각하는 지역 문제는 ", { o: ["주차 문제", "쓰레기 문제", "환경 오염"], a: 0 }, "이고, 가장 적은 학생이 생각하는 지역 문제는 ", { o: ["안전 문제", "쓰레기 문제", "소음 문제"], a: 1 }, "입니다. 또 알 수 있는 내용은 ", { o: ["두 번째로 많은 학생이 생각하는 지역 문제는 안전 문제라는 것", "소음 문제를 생각하는 학생이 가장 많다는 것", "환경 오염을 생각하는 학생은 50명이라는 것"], a: 0 }, "입니다."], { ok: "막대그래프에서 찾은 사실로 글을 완성했어요." }); } },
    { name: "사실과 의견 나누기", inst: "지역 문제 막대그래프를 보고 한 말이에요. 그래프에서 알 수 있는 사실과, 사실을 보고 든 생각(의견)으로 나누어 보세요.", hints: ["그래프의 수나 막대 길이로 확인할 수 있으면 사실이에요.", "‘~하면 좋겠어요’, ‘~해야 해요’는 내 생각이에요."],
      render: (b, a) => b5Sort(b, a, { bins: ["그래프에서 알 수 있는 사실", "사실을 보고 든 생각(의견)"], cards: [
        { t: "가장 많은 학생이 생각하는 지역 문제는 주차 문제예요.", b: 0 }, { t: "주차 문제를 해결하는 활동을 하면 좋겠어요.", b: 1 },
        { t: "환경 오염을 생각하는 학생은 40명이에요.", b: 0 }, { t: "소음 문제와 안전 문제를 생각하는 학생 수를 더하면 주차 문제와 같아요.", b: 0 },
        { t: "우리 지역에 주차장을 더 만들어야 해요.", b: 1 }],
        ok: "막대그래프에서 알 수 있는 통계적 사실과, 그 사실을 보고 든 의견을 구분했어요. 의견을 말할 때는 사실을 근거로 들어요." }) },
    { name: "생활 속 막대그래프", inst: "어느 도서관의 요일별 방문자 수를 나타낸 막대그래프예요. 물음에 답해 보세요.", hints: ["막대의 길이가 같은 요일을 찾아요.", "화요일은 40명이에요. 40명의 2배는?"],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5G.lib), q: "방문자 수가 같은 요일을 모두 고르세요.", t: "pick", o: B5G.lib.cats, a: [0, 3] },
        { q: "수요일의 방문자는 몇 명인가요?", t: "num", a: 90, unit: "명", why: { "9": "수요일 막대는 9칸이고 세로 눈금 한 칸은 10명이에요." } },
        { q: "방문자 수가 화요일의 2배인 요일은 언제인가요?", t: "pick", o: B5G.lib.cats, a: 4 },
        { q: "주중 하루 운영 시간을 늘린다면 어느 요일이 좋을까요?", t: "pick", o: ["수요일 ― 방문자 수가 가장 많기 때문이에요.", "화요일 ― 요일 이름이 짧기 때문이에요."], a: 0 }],
        { ok: "막대그래프를 보고 사실을 찾고, 그 사실을 근거로 알맞게 결정했어요." }) }
  ],
  challenge: { inst: "11월부터 2월까지 최저 기온이 0 ℃보다 낮은 날수와 손난로 판매량을 나타낸 막대그래프예요. 두 그래프의 관계를 알아보세요.", hints: ["두 그래프에서 막대가 가장 긴 달을 각각 찾아요.", "날수가 많은 달과 판매량이 많은 달을 견주어 봐요."],
    render: (b, a) => b5Ask(b, a, [
      { fig: () => b5Figs([{ g: B5G.cold }, { g: B5G.warmer }]), q: "최저 기온이 0 ℃보다 낮은 날이 가장 많은 달은?", t: "pick", o: B5G.cold.cats, a: 2 },
      { q: "손난로가 가장 많이 팔린 달은?", t: "pick", o: B5G.cold.cats, a: 2 },
      { q: "12월의 손난로 판매량은 몇 개인가요?", t: "num", a: 70, unit: "개", why: { "7": "세로 눈금 한 칸은 10개예요." } },
      { q: "두 그래프를 보고 알 수 있는 관계로 알맞은 것은?", t: "pick", o: ["최저 기온이 0 ℃보다 낮은 날이 많은 달일수록 손난로 판매량이 많아요.", "최저 기온이 0 ℃보다 낮은 날이 많은 달일수록 손난로 판매량이 적어요."], a: 0 }],
      { ok: "추운 날이 많은 달일수록 손난로가 많이 팔렸어요. 두 막대그래프를 견주어 관계를 찾았어요!" }) }
},
{
  id: "b8", no: 8, title: "생각을 더하다 ― 우리 지역을 소개해 볼까요", soop: "탐구 정리하기(O)",
  question: "지도 속 자료를 막대그래프로 나타내면 우리 지역을 어떻게 소개할 수 있을까요?",
  summary: "지도에 있는 기호의 수를 세어 표로 정리하고 막대그래프로 나타내면, 어떤 장소가 많고 적은지 한눈에 보여요. 막대그래프에서 찾은 사실로 지역을 소개하는 글을 쓸 수 있어요.",
  steps: [
    { name: "기호 세어 표로", inst: "선호가 살고 있는 지역의 지도예요. 지도에 표시된 장소를 나타내는 기호의 수를 세어 표로 나타내 보세요.", hints: ["한 가지 기호씩 차례로 세어요. 센 기호를 누르면 표시가 생겨요.", "합계는 다섯 가지 장소의 수를 모두 더한 수예요."],
      render: (b, a) => b5Map(b, a, { seed: 11, kinds: [{ kind: "school", name: "학교", n: 12 }, { kind: "police", name: "경찰서", n: 6 }, { kind: "library", name: "도서관", n: 7 }, { kind: "mountain", name: "산", n: 3 }, { kind: "fall", name: "폭포", n: 2 }], ok: "학교 12개, 경찰서 6개, 도서관 7개, 산 3개, 폭포 2개, 모두 30개예요." }) },
    { name: "막대그래프로 나타내기", inst: "선호네 지역의 장소별 수를 막대그래프로 나타내고 알맞은 제목을 골라 보세요.", hints: ["세로 눈금 한 칸은 1개예요.", "학교는 12칸만큼 세워요."],
      render: (b, a) => b5Build(b, a, { g: B5G.place1, titleChoices: ["선호네 반 학생 수", "장소별 수", "좋아하는 장소"], ok: "선호네 지역의 장소별 수를 막대그래프로 나타냈어요. 학교가 가장 많아요!" }) },
    { name: "소개 글 완성하기", inst: "막대그래프를 보고 선호네 지역을 소개하는 글을 완성해 보세요.", hints: ["막대가 가장 긴 장소와 두 번째로 긴 장소를 찾아요.", "산은 3개, 폭포는 2개예요."],
      render: (b, a) => { b.append(b5Fig(B5G.place1)); blanks(b, a, ["친구들아, 안녕? 내가 살고 있는 지역을 소개할게. 우리 지역에는 학생들이 많아서 ", { o: ["학교", "경찰서", "산"], a: 0 }, "이/가 가장 많고, 두 번째로는 ", { o: ["경찰서", "도서관", "폭포"], a: 1 }, "이/가 많아. 그리고 산 ", { o: ["2", "3", "6"], a: 1 }, "개가 지역을 둘러싸고 있어서 경관이 아름다워. ", { o: ["폭포", "학교", "도서관"], a: 0 }, "도 2개가 있어서 시원한 모습을 보기 위해 사람들이 많이 찾아와. 우리 지역에 한번 놀러 와."], { ok: "막대그래프에서 찾은 사실로 지역 소개 글을 완성했어요." }); } },
    { name: "은진이네 지역 세기", inst: "은진이가 살고 있는 지역의 지도예요. 장소를 나타내는 기호의 수를 세어 표로 나타내 보세요.", hints: ["센 기호를 누르면 표시가 생겨 빠뜨리지 않아요.", "모두 30개예요."],
      render: (b, a) => b5Map(b, a, { seed: 29, kinds: [{ kind: "school", name: "학교", n: 11 }, { kind: "hospital", name: "병원", n: 8 }, { kind: "beach", name: "해수욕장", n: 5 }, { kind: "spa", name: "온천", n: 2 }, { kind: "mountain", name: "산", n: 4 }], ok: "학교 11개, 병원 8개, 해수욕장 5개, 온천 2개, 산 4개, 모두 30개예요." }) },
    { name: "은진이네 막대그래프", inst: "은진이네 지역의 장소별 수를 막대그래프로 나타내요. 눈금 한 칸의 크기를 정하고 막대를 그려 보세요.", hints: ["가장 큰 수는 11이고 눈금은 12칸이에요.", "한 칸이 2개이면 11개, 5개는 칸에 꼭 맞지 않아요."],
      render: (b, a) => b5Build(b, a, { g: B5G.place2, stepChoices: [2, 5, 1], ok: "은진이네 지역의 장소별 수를 막대그래프로 나타냈어요!" }) }
  ],
  challenge: { inst: "은진이네 지역 막대그래프를 보고 은진이가 살고 있는 지역을 소개하는 글을 써 보세요. 막대그래프에서 알 수 있는 사실을 넣어요.",
    render: (b, a) => { b.append(b5Fig(B5G.place2)); writeStep(b, a, [
      { q: "가장 많은 장소와 두 번째로 많은 장소는 무엇인가요?", tag: "사실", ph: "예) 학교가 11개로 가장 많고 …" },
      { q: "은진이네 지역을 소개하는 글을 써 보세요.", tag: "소개 글", ph: "예) 우리 지역에는 해수욕장이 5개나 있어서 …" }]); } }
},
{
  id: "b9", no: 9, title: "놀이를 더하다 ― 몸으로 풍선을 띄워 볼까요", soop: "발표하기(P)",
  question: "놀이 기록을 막대그래프로 나타내면 무엇을 알 수 있을까요?",
  summary: "신체 부위별로 풍선을 띄운 횟수를 표로 정리하고 막대그래프로 나타내면, 어느 부위로 가장 많이 띄웠는지, 다른 모둠과 어떻게 다른지 한눈에 알 수 있어요.",
  steps: [
    { name: "풍선 띄우기 놀이", inst: "머리, 어깨, 무릎, 발의 순서대로 풍선을 띄우고 횟수를 세요. 화면에서는 떨어지는 풍선을 눌러 띄워요.", hints: ["▶ 시작을 누르고 풍선을 눌러요.", "놀이가 어려우면 ‘예시 기록으로 하기’를 눌러요."],
      render: (b, a) => b5Balloon(b, a, { parts: ["머리", "어깨", "무릎", "발"], sec: 15, demo: [15, 10, 18, 23] }) },
    { name: "표로 정리하기", inst: "이서네 모둠이 1분 동안 풍선을 띄운 횟수를 다섯 개씩 묶어 셌어요. 빨간 사선이 있는 묶음 하나가 5회예요. 세어서 표를 완성해 보세요.", hints: ["묶음 하나는 5회예요. 묶음 수를 먼저 세요.", "합계는 네 부위의 횟수를 모두 더해요."],
      render: (b, a) => b5Table(b, a, { fig: () => b5TallyFig(B5G.balloon.cats, B5G.balloon.vals, "이서네 모둠의 기록"), title: B5G.balloon.title, head: "신체 부위", row: "횟수(회)", cats: B5G.balloon.cats, vals: B5G.balloon.vals, blanks: [0, 1, 2, 3, "sum"], ok: "머리 15회, 어깨 10회, 무릎 18회, 발 23회, 합계 66회예요." }) },
    { name: "막대그래프로 나타내기", inst: "표를 보고 막대그래프로 나타내고 알맞은 제목을 골라 보세요. 세로 눈금 한 칸은 1회예요.", hints: ["발은 23칸만큼 세워요.", "막대를 누르고 ▲ ▼로 한 칸씩 고칠 수 있어요."],
      render: (b, a) => b5Build(b, a, { g: B5G.balloon, titleChoices: ["신체 부위별 풍선을 띄운 횟수", "우리 모둠 친구 이름", "좋아하는 풍선 색깔"], ok: "놀이 기록을 막대그래프로 나타냈어요!" }) },
    { name: "막대그래프 해석하기", inst: "이서네 모둠의 막대그래프를 보고 물음에 답해 보세요.", hints: ["가장 긴 막대와 가장 짧은 막대를 찾아요.", "23−10을 계산해요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5G.balloon), q: "가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 신체 부위, 세로: 풍선을 띄운 횟수", "가로: 풍선을 띄운 횟수, 세로: 신체 부위"], a: 0 },
        { q: "세로 눈금 한 칸은 몇 회를 나타내나요?", t: "num", a: 1, unit: "회", why: { "5": "0과 5 사이가 5칸이에요. 5칸이 5회예요." } },
        { q: "풍선을 가장 많이 띄운 신체 부위는?", t: "pick", o: B5G.balloon.cats, a: 3 },
        { q: "풍선을 가장 적게 띄운 신체 부위는?", t: "pick", o: B5G.balloon.cats, a: 1 },
        { q: "발로 띄운 횟수는 어깨로 띄운 횟수보다 몇 회 더 많나요?", t: "num", a: 13, unit: "회", why: { "33": "더하지 말고 차이를 구해요." } }],
        { ok: "발로 가장 많이(23회), 어깨로 가장 적게(10회) 띄웠어요." }) },
    { name: "다른 모둠과 비교하기", inst: "하준이네 모둠의 막대그래프와 견주어 보세요.", hints: ["같은 신체 부위끼리 막대의 길이를 견주어요.", "하준이네 모둠에서 가장 긴 막대를 찾아요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Figs([{ lead: "이서네 모둠", g: B5G.balloon }, { lead: "하준이네 모둠", g: B5G.balloon2 }]), q: "어깨로 풍선을 더 많이 띄운 모둠은 어느 모둠인가요?", t: "pick", o: ["이서네 모둠", "하준이네 모둠"], a: 1 },
        { q: "무릎으로 띄운 횟수는 두 모둠이 몇 회 차이 나나요?", t: "num", a: 2, unit: "회" },
        { q: "하준이네 모둠이 가장 많이 띄운 신체 부위는?", t: "pick", o: B5G.balloon.cats, a: 2 },
        { q: "두 막대그래프를 보고 알 수 있는 사실은?", t: "pick", o: ["두 모둠 모두 머리보다 무릎으로 더 많이 띄웠어요.", "두 모둠 모두 발로 가장 많이 띄웠어요."], a: 0, why: { "1": "하준이네 모둠은 무릎 막대가 가장 길어요." } }],
        { ok: "두 모둠의 막대그래프를 견주어 같은 점과 다른 점을 찾았어요!" }) }
  ],
  challenge: { inst: "또 다른 놀이예요. 책으로 여러 종류의 공을 1분 동안 띄운 횟수를 막대그래프로 나타내요. 세로 눈금은 15칸이에요. 눈금 한 칸의 크기를 정해 보세요.", hints: ["가장 큰 수는 30회예요. 15칸으로 30회까지 나타내려면?", "한 칸이 2회이면 탁구공 10회는 5칸이에요."],
    render: (b, a) => b5Build(b, a, { g: B5G.ball, stepChoices: [1, 2, 5, 10], ok: "가장 큰 수 30회를 15칸에 나타내도록 눈금 한 칸을 2회로 정했어요!" }) }
},
{
  id: "b10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "막대그래프에 대해 배운 것을 모두 확인해 볼까요?",
  summary: "막대그래프는 조사한 자료의 수량을 막대 모양으로 나타낸 그래프예요. 가로와 세로, 눈금 한 칸의 크기를 확인하고 읽으며, 막대그래프에서 찾은 사실을 근거로 알맞은 결정을 할 수 있어요.",
  steps: [
    { name: "그래프 살펴보기", inst: "어느 문화 센터의 수업을 신청한 학생 수를 조사하여 나타낸 막대그래프예요.", hints: ["세로 눈금 5칸이 10명이에요.", "10명을 5칸으로 나누면 한 칸은?"],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5G.culture), q: "막대그래프의 가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 수업의 종류, 세로: 학생 수", "가로: 학생 수, 세로: 수업의 종류"], a: 0 },
        { q: "세로 눈금 한 칸은 몇 명을 나타내나요?", t: "num", a: 2, unit: "명", why: { "1": "세로 눈금 5칸이 10명이에요. 한 칸이 1명이 아니에요.", "10": "10명은 눈금 5칸이 나타내는 수예요.", "5": "5는 0과 10 사이의 칸 수예요." } }],
        { ok: "가로는 수업의 종류, 세로는 학생 수예요. 세로 눈금 한 칸은 10÷5=2(명)이에요." }) },
    { name: "옳은 설명 찾기", inst: "막대그래프에 대한 설명이 옳으면 ○, 옳지 않으면 ×를 골라 보세요.", hints: ["세로 눈금 한 칸은 2명이에요.", "수영 막대는 8칸, 공예는 10칸, 코딩은 5칸이에요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5G.culture), q: "신청한 학생 수가 가장 적은 수업은 코딩 수업입니다.", t: "ox", a: true },
        { q: "수영 수업을 신청한 학생은 13명입니다.", t: "ox", a: false, why: { "o": "세로 눈금 한 칸이 몇 명을 나타내는지 다시 확인해 봐요. 수영 막대는 8칸이에요." } },
        { q: "공예 수업을 신청한 학생 수는 코딩 수업의 2배입니다.", t: "ox", a: true, why: { "x": "공예는 20명, 코딩은 10명이에요. 20은 10의 몇 배일까요?" } }],
        { ok: "수영은 16명이라 두 번째 설명이 틀렸어요. 공예 20명은 코딩 10명의 2배예요." }) },
    { name: "표와 막대그래프 완성하기", inst: "나은이네 학교 4학년 학생들이 가고 싶어 하는 박물관을 조사한 표와 막대그래프예요. 표의 빈칸을 채우고, 막대그래프의 축 이름과 막대 이름을 고른 뒤 역사·민속 박물관의 막대를 그려 보세요.", hints: ["곤충 = 73−14−14−22−10이에요. 그래프의 곤충 막대도 세어 봐요.", "14칸 막대는 생태, 22칸 막대는 과학이에요."],
      render: (b, a) => b5Build(b, a, { g: B5G.museum, lock: [1, 2, 3], nameBlank: [1, 2], nameOptions: ["생태", "과학", "곤충", "역사", "민속"], axisPick: true, nameWhy: "이미 그려진 막대가 몇 칸인지 세어 표의 수와 견주어 봐요.",
        table: { cats: ["생태", "역사", "과학", "곤충", "민속"], vals: [14, 14, 22, 13, 10], head: "박물관", row: "학생 수(명)", blanks: [3] }, ok: "곤충 박물관은 13명이에요. 표와 막대그래프를 모두 완성했어요!" }) },
    { name: "알 수 있는 내용", inst: "완성한 막대그래프를 보고 알 수 있는 내용을 찾아보세요.", hints: ["가로 눈금 한 칸은 1명이에요.", "곤충 막대는 13칸이에요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5G.museum), q: "막대그래프를 보고 알 수 있는 내용으로 옳은 것을 모두 고르세요.", t: "pick", o: ["가장 많은 학생이 가고 싶어 하는 박물관은 과학 박물관이에요.", "생태 박물관과 역사 박물관에 가고 싶어 하는 학생 수는 같아요.", "곤충 박물관에 가고 싶어 하는 학생은 15명이에요.", "가장 적은 학생이 가고 싶어 하는 박물관은 민속 박물관이에요."], a: [0, 1, 3], why: { "0,1,2,3": "곤충 막대는 13칸이고 가로 눈금 한 칸은 1명이에요." } },
        { q: "과학 박물관에 가고 싶어 하는 학생은 민속 박물관보다 몇 명 더 많나요?", t: "num", a: 12, unit: "명", why: { "32": "더하지 말고 차이를 구해요." } }],
        { ok: "과학 박물관이 가장 많고(22명), 생태와 역사는 14명으로 같고, 민속 박물관이 가장 적어요(10명)." }) },
    { name: "체험 학습 장소 정하기", inst: "4학년 체험 학습 장소를 정하려고 해요. 막대그래프를 보고 어느 박물관이 좋을지 정하고, 까닭을 그래프에서 알 수 있는 사실로 써 보세요.",
      render: (b, a) => { b.append(b5Fig(B5G.museum, { tip: false })); writeStep(b, a, [
        { q: "체험 학습 장소로 어느 박물관이 좋을까요?", tag: "장소", ph: "예) 과학 박물관" },
        { q: "그렇게 정한 까닭을 막대그래프에서 알 수 있는 사실로 써 보세요.", tag: "까닭", ph: "예) 가장 많은 학생이 가고 싶어 하기 때문이에요." }], { ok: "그래프에서 찾은 사실을 근거로 결정했어요. 민속 박물관처럼 가장 적은 곳을 골라도 까닭이 자료에 근거하면 좋은 결정이에요." }); } }
  ],
  challenge: { inst: "꼭꼭! 확인하고 정리해요. 막대그래프에 대한 설명이 옳으면 ‘옳음’ 길로, 옳지 않으면 ‘틀림’ 길로 가서 도윤이가 좋아하는 민속놀이를 찾아보세요.", hints: ["가로에는 민속놀이의 종류가 있어요.", "바둑 막대는 4칸이고 세로 눈금 한 칸은 1명이에요."],
    render: (b, a) => b5Maze(b, a, { fig: () => b5Fig(B5G.folk), goal: "고누", ok: "도윤이가 좋아하는 민속놀이는 고누예요!", stmts: [
      { t: "막대그래프의 가로에 나타낸 것은 학생 수입니다.", a: false, dead: "바둑", why: "가로에 나타낸 것은 민속놀이의 종류예요." },
      { t: "세로 눈금 한 칸은 1명을 나타냅니다.", a: true, dead: "씨름", why: "세로 눈금 5칸이 5명이니 한 칸은 1명이에요." },
      { t: "가장 많은 학생이 좋아하는 민속놀이는 투호입니다.", a: true, dead: "바둑", why: "투호 막대가 가장 길어요." },
      { t: "바둑을 좋아하는 학생은 9명입니다.", a: false, dead: "투호", why: "바둑 막대는 4칸이에요. 9명은 투호예요." }] }) }
}
];
