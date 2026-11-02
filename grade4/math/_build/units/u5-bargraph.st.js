//@@APP
const APP={title:"우리 반 조사 기자단", unit:"4-1 수학 5. 막대그래프", key:"s41-bargraph-v1", welcome:"우리 반 조사 기자단에 온 것을 환영해요", intro:"4학년 2반 기자단이 되어 궁금한 것을 조사하고, 표와 막대그래프로 정리해 학급 신문 기사를 써요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u5-bargraph.tb.js)의 b5 부품을 복사해 쓰고, 확인은 autoRun으로 저절로 해요. 이 파일에서 새로 만든 부품은 앞글자 b5s. */
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
function b5Ord(i) { return ["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째", "일곱째", "여덟째"][i] || `${i + 1}번째`; }
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
/* ---------- 이야기 버전: '확인하기' 단추 없이 저절로 확인(autoRun) ---------- */
function b5Enter(inp) { inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } }); }
/* 표 채우기 (그림을 보고 세어서) — 칸을 다 채우면 저절로 확인 */
function b5Table(body, api, opt) {
  if (opt.fig) body.append(opt.fig());
  const T = b5TableEl(opt, opt.blanks);
  body.append(T.el);
  api.provide({ words: opt.words || ["합계"], answers: [opt.blanks.map(k => k === "sum" ? `합계 ${T.total}` : `${opt.cats[k]} ${opt.vals[k]}`).join(", ")] });
  const ins = opt.blanks.map(k => T.ins[k]);
  const judge = () => {
    api.tryOnce();
    const given = opt.blanks.map(k => T.ins[k].value.trim() || "-").join(", ");
    const bad = b5CheckTable(T, opt, opt.blanks);
    if (bad) { api.fail(bad, given); return false; }
    api.done(given, opt.ok); return true;
  };
  const auto = autoRun(() => ins.every(i => i.value.trim() !== ""), () => ins.map(i => i.value.trim()).join("|"), judge, 900);
  ins.forEach(i => { i.addEventListener("input", auto); i.addEventListener("change", auto); b5Enter(i); });
}
/* ---------- 문제 모음: t:"pick"(a 번호|[번호…]) · "num"(a 수, unit) · "ox"(a true/false) ----------
   모든 문제에 답하면 저절로 확인(수 입력이 있으면 0.9초, 고르기만 있으면 0.26초 기다림). */
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
      b5Enter(inp);
      row.ok = () => b5Num(inp) === it.a;
      row.show = g => inp.style.borderColor = g ? "var(--ok)" : "var(--no)";
      row.val = () => inp.value.trim() || "-";
      row.key = () => String(b5Num(inp));
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
    rows.push(row); wrap.append(box);
  });
  api.provide({
    words: opts.words || items.filter(it => it.t === "pick").map(ansText).slice(0, 6),
    answers: items.map((it, qi) => `${items.length > 1 ? (qi + 1) + ") " : ""}${ansText(it)}`)
  });
  const judge = () => {
    api.tryOnce();
    let all = true; rows.forEach(r => { const g = r.ok(); r.show(g); if (!g) all = false; });
    const given = rows.map(r => r.val()).join(" / ");
    if (all) { api.done(given, opts.ok); return true; }
    const bad = rows.find(r => !r.ok());
    const why = bad.it.why && bad.it.why[bad.key()];
    api.fail(why || opts.bad || "빨간 칸을 다시 살펴봐요. 눈금 한 칸의 크기와 막대의 길이를 확인해 봐요.", given);
    return false;
  };
  const auto = autoRun(() => rows.every(r => r.filled()), () => rows.map(r => r.key()).join("|"), judge, items.some(it => it.t === "num") ? 900 : 260);
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
  wrap.addEventListener("input", auto); wrap.addEventListener("change", auto);
  body.append(wrap);
}
/* ---------- 카드 나누기 ---------- opt = {bins:[…], cards:[{t, b}]}  카드를 모두 넣으면 1.2초 뒤 저절로 확인 */
function b5Sort(body, api, opt) {
  const where = opt.cards.map(() => null); let sel = null, auto = null;
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
    if (auto) auto();
  }
  const judge = () => {
    api.tryOnce();
    let ok = true;
    cards.forEach((c, i) => { const g = where[i] === opt.cards[i].b; c.classList.add(g ? "b5good" : "b5bad"); if (!g) ok = false; });
    const given = opt.bins.map((b, bi) => `${b}: ${opt.cards.filter((_, i) => where[i] === bi).map(c => c.t).join("/")}`).join(" | ");
    if (ok) { api.done(given, opt.ok); return true; }
    api.fail(opt.bad || "빨간 카드를 다시 생각해 봐요.", given); return false;
  };
  auto = autoRun(() => where.every(w => w != null), () => where.join(","), judge, 1200);
  draw();
  api.provide({ words: opt.bins, answers: opt.bins.map((b, bi) => `${b}: ${opt.cards.filter(c => c.b === bi).map(c => c.t).join(" / ")}`) });
  body.append(h("p", { class: "inst" }, "카드를 누르고, 넣을 상자를 눌러요. 상자 안의 카드를 누르면 다시 빠져요. 모두 넣으면 저절로 확인해요."), pool,
    h("div", { class: "b5bins" }, bins.map(b => b.box)));
}
/* ---------- 막대그래프 그리기 ----------
   opt = { g, stepChoices, cellChoices, titleChoices, axisPick, nameBlank:[번호], nameOptions, lock:[번호], table:{…}|false, ok }
   고를 것을 모두 고르고 막대를 모두 세우면, 손을 멈춘 뒤 1.2초 뒤에 저절로 확인해요. */
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
  let ansStep = null, ansCells = null, auto = null;
  steps.forEach(s => cellsL.forEach(c => { if (ansStep == null && fits(s, c)) { ansStep = s; ansCells = c; } }));
  const tSpec = opt.table === false ? null : Object.assign({ title: g.title, head: g.catAxis, row: `${g.valAxis}(${U})`, cats: g.cats, vals }, opt.table || {});
  const tBlanks = (opt.table && opt.table.blanks) || [];
  const T = tSpec ? b5TableEl(tSpec, tBlanks) : null;
  const svg = makeSvg(400, 300); svg.style.touchAction = "none";
  let G;
  const info = h("div", { class: "readout", style: "font-size:var(--fs)" });
  function draw() {
    G = b5Geom(g, st.cells);
    b5Paint(svg, g, G, st);
    info.textContent = "막대: " + g.cats.map((c, i) => `${st.names[i] == null ? "?" : st.names[i]} ${Math.round(st.h[i] * 100) / 100}칸`).join(" · ");
    if (auto) auto();
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
  blankN.forEach(i => side.append(selectRow(`${g.horiz ? "위" : "왼쪽"}에서 ${b5Ord(i)} 막대 이름:`, opt.nameOptions || g.cats, v => st.names[i] = v)));
  if (opt.titleChoices) side.append(selectRow("제목:", opt.titleChoices, v => st.title = v));
  side.append(info, h("div", { class: "tools" },
    h("button", { onclick: () => { if (st.sel == null || lock.has(st.sel)) return api.hint("먼저 고칠 막대를 눌러요."); st.h[st.sel] = Math.min(st.cells, Math.floor(st.h[st.sel]) + 1); draw(); } }, "▲ 한 칸"),
    h("button", { onclick: () => { if (st.sel == null || lock.has(st.sel)) return api.hint("먼저 고칠 막대를 눌러요."); st.h[st.sel] = Math.max(0, Math.ceil(st.h[st.sel]) - 1); draw(); } }, "▼ 한 칸")),
    h("p", { class: "b5cap" }, "고를 것을 모두 고르고 막대를 모두 세우면 저절로 확인해요."));
  const ready = () => (!T || tBlanks.every(k => T.ins[k].value.trim() !== "")) && (!opt.axisPick || (st.catAxis != null && st.valAxis != null)) &&
    st.step != null && blankN.every(i => st.names[i] != null) && (!opt.titleChoices || st.title != null) && g.cats.every((_, i) => lock.has(i) || st.h[i] > 0);
  const sign = () => JSON.stringify([st.step, st.cells, st.h, st.names, st.title, st.catAxis, st.valAxis, T ? tBlanks.map(k => T.ins[k].value.trim()) : 0]);
  function check() {
    api.tryOnce();
    const given = (st.step == null ? "?" : b5U(st.step, U)) + ` ${st.cells}칸: ` + g.cats.map((c, i) => `${st.names[i] || "?"} ${st.h[i]}칸`).join(", ");
    const no = (m) => { api.fail(m, given); return false; };
    if (T) { const bad = b5CheckTable(T, tSpec, tBlanks); if (bad) return no(bad); }
    if (opt.axisPick && st.catAxis !== g.catAxis) return no(`막대의 길이로 나타내는 것은 ${b5J("‘" + g.valAxis + "’", "이에요/예요")}. 막대가 놓이는 쪽 축에는 ${b5J("‘" + g.catAxis + "’", "을/를")} 나타내요.`);
    if (st.step * st.cells < max) return no(`눈금 한 칸이 ${b5U(st.step, U)}이고 ${st.cells}칸이면 ${b5U(st.step * st.cells, U)}까지만 나타낼 수 있어요. 가장 큰 수 ${b5U(max, U)}까지 나타낼 수 있게 골라요.`);
    const nd = vals.findIndex(v => v % st.step);
    if (nd >= 0) return no(`눈금 한 칸이 ${b5U(st.step, U)}이면 ${g.cats[nd]} ${b5J(b5U(vals[nd], U), "은/는")} 막대 끝이 눈금 칸 가운데에 걸려서 정확하게 나타내기 어려워요. 모든 수가 칸에 꼭 맞는 크기를 골라요.`);
    for (const i of blankN) if (st.names[i] !== g.cats[i]) return no(`${g.horiz ? "위" : "왼쪽"}에서 ${b5Ord(i)} 막대의 이름을 다시 생각해 봐요. ${opt.nameWhy || "막대의 길이가 몇 칸인지 세어 표와 견주어 봐요."}`);
    for (let i = 0; i < n; i++) {
      if (lock.has(i)) continue;
      const want = vals[i] / st.step;
      if (st.h[i] !== want) {
        const nm = g.cats[i], cur = Math.round(st.h[i] * st.step * 100) / 100;
        return no(`${nm} 막대가 ${st.h[i]}칸이라 ${b5J(b5U(cur, U), "을/를")} 나타내요. ${b5J(b5U(vals[i], U), "이/가")} 되려면 눈금 한 칸이 ${b5U(st.step, U)}이니 몇 칸이어야 할까요?`);
      }
    }
    if (opt.titleChoices && st.title !== g.title) return no("제목은 무엇을 조사했는지 알 수 있게 붙여요. 표의 내용을 다시 살펴봐요.");
    api.done(given, opt.ok || "표의 수에 맞게 막대그래프를 완성했어요!");
    return true;
  }
  api.provide({
    words: opt.words || ["눈금 한 칸의 크기", "막대의 길이", "가장 큰 수", "제목"],
    answers: [(opt.stepChoices ? `눈금 한 칸 ${b5U(ansStep, U)}${opt.cellChoices ? `, ${ansCells}칸` : ""}: ` : "") + g.cats.map((c, i) => `${c} ${vals[i] / (ansStep || g.step)}칸`).join(", ")]
  });
  auto = autoRun(ready, sign, check, 1200);
  draw();
  if (T) { body.append(T.el); tBlanks.forEach(k => { const i = T.ins[k]; i.addEventListener("input", () => auto()); b5Enter(i); }); }
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
  let auto = null;
  const stage = h("div", { class: "stage" });
  const draw = () => { stage.innerHTML = ""; stage.append(b5PictSvg(opt, cnt)); if (auto) auto(); };
  const side = h("div", { class: "side" }, h("p", {}, `큰 그림은 ${opt.big}${opt.unit}, 작은 그림은 ${b5J(`1${opt.unit}`, "을/를")} 나타내요. 단추로 그림을 넣거나 빼요. 다 넣고 잠깐 기다리면 저절로 확인해요.`));
  opt.cats.forEach((c, i) => {
    const chg = (k, d, cap) => () => { cnt[i][k] = Math.max(0, Math.min(cap, cnt[i][k] + d)); draw(); };
    side.append(h("div", { class: "tools" }, h("b", { style: "min-width:2.6em" }, c),
      h("button", { onclick: chg(0, 1, 6) }, "큰 +"), h("button", { onclick: chg(0, -1, 6) }, "큰 −"),
      h("button", { onclick: chg(1, 1, 12) }, "작은 +"), h("button", { onclick: chg(1, -1, 12) }, "작은 −")));
  });
  const judge = () => {
    api.tryOnce();
    const given = opt.cats.map((c, i) => `${c} 큰${cnt[i][0]} 작은${cnt[i][1]}`).join(", ");
    for (let i = 0; i < opt.cats.length; i++) {
      const v = cnt[i][0] * opt.big + cnt[i][1], c = opt.cats[i];
      if (v === opt.vals[i] && cnt[i][1] >= opt.big) { api.fail(`${c}: 작은 그림 ${opt.big}개는 큰 그림 1개로 바꾸어 나타내요.`, given); return false; }
      if (v !== opt.vals[i]) { api.fail(`${c}의 그림은 지금 ${b5J(b5U(v, opt.unit), "을/를")} 나타내요. 표에서는 ${b5J(b5U(opt.vals[i], opt.unit), "이에요/예요")}.`, given); return false; }
    }
    api.done(given, opt.ok); return true;
  };
  auto = autoRun(() => cnt.every(x => x[0] + x[1] > 0), () => JSON.stringify(cnt), judge, 1200);
  api.provide({ words: ["큰 그림", "작은 그림"], answers: [opt.cats.map((c, i) => `${c} 큰 ${Math.floor(opt.vals[i] / opt.big)}, 작은 ${opt.vals[i] % opt.big}`).join(" / ")] });
  draw();
  body.append(T.el, h("div", { class: "panel" }, stage, side));
}
/* ---------- 스티커 붙이기 조사 ---------- opt.what: 고르는 것의 이름(예: "책") */
function b5Tally(body, api, opt) {
  const cats = opt.cats, seq = opt.seq, names = opt.names, n = cats.length, what = opt.what || "것";
  const counts = cats.map((_, c) => seq.filter(x => x === c).length);
  const got = cats.map(() => 0); let pos = 0;
  const COLS = ["#F08A6C", "#F5C04E", "#7DC59A", "#7FB2E5", "#C49BE0"], CWD = 135, W = 40 + n * CWD, H = 400, base = 350;
  const stage = h("div", { class: "stage" });
  const draw = () => {
    const svg = makeSvg(W, H);
    svg.append(txt(W / 2, 26, opt.board || "우리 반 스티커 판", 22));
    cats.forEach((c, i) => {
      const x = 20 + i * CWD;
      svg.append(svgEl("rect", { x: x + 6, y: 50, width: CWD - 12, height: base - 50, rx: 10, fill: "#fff", stroke: B5_GRID2 }));
      for (let k = 0; k < got[i]; k++) svg.append(svgEl("circle", { cx: x + CWD / 2 + (k % 2 ? 18 : -18), cy: base - 22 - Math.floor(k / 2) * 40, r: 16, fill: COLS[i % COLS.length], stroke: "#fff", "stroke-width": 3 }));
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
    if (seq[pos] !== i) return api.hint(`${names[pos]}${b5Jong(names[pos]) ? "이가" : "가"} 고른 ${b5J(what, "은/는")} ${b5J("‘" + cats[seq[pos]] + "’", "이에요/예요")}. 그 칸에 붙여요.`);
    got[i]++; pos++; draw(); showNow();
    if (pos === seq.length) finish();
  } }, c)));
  const keys = [...cats.map((_, i) => i), "sum"];
  const T = b5TableEl({ title: opt.title, head: opt.head, row: opt.row, cats, vals: counts }, keys);
  function finish() {
    binRow.remove();
    after.append(h("p", { class: "inst" }, `스티커 판을 보고 ${what}마다 학생 수를 세어 표를 완성해요. 칸을 다 채우면 저절로 확인해요.`), T.el);
    const judge = () => {
      api.tryOnce();
      const given = keys.map(k => T.ins[k].value.trim() || "-").join(", ");
      const bad = b5CheckTable(T, { cats, vals: counts }, keys);
      if (bad) { api.fail(bad, given); return false; }
      api.done(given, opt.ok); return true;
    };
    const auto = autoRun(() => keys.every(k => T.ins[k].value.trim() !== ""), () => keys.map(k => T.ins[k].value.trim()).join("|"), judge, 900);
    keys.forEach(k => { const i = T.ins[k]; i.addEventListener("input", auto); i.addEventListener("change", auto); b5Enter(i); });
  }
  api.provide({ words: ["스티커 붙이기", "표", "합계"], answers: [cats.map((c, i) => `${c} ${counts[i]}`).join(", ") + `, 합계 ${seq.length}`] });
  draw(); showNow();
  body.append(h("div", { class: "panel" }, stage, h("div", { class: "side" }, h("p", {}, `친구가 고른 ${what} 칸을 눌러 스티커를 붙여 주세요.`), now, binRow)), after);
}
/* ---------- 공학 도구처럼: 수를 넣으면 그래프가 바로 그려져요 ----------
   간격과 그래프 형태를 바꾸어 보는 것이 활동이에요. 수가 맞고, 간격 두 가지·형태 두 가지를 보면 저절로 통과해요. */
function b5Tool(body, api, opt) {
  const g = opt.g, U = g.unit, cats = g.cats;
  let step = 1, horiz = false, auto = null; const seenH = new Set(), seenS = new Set();
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
    if (auto) auto();
  };
  ins.forEach(i => { i.addEventListener("input", draw); b5Enter(i); });
  const stepRow = h("div", { class: "b5btns" }, h("span", { class: "b5lbl" }, "간격:"));
  [1, 2, 3, 5, 10, 15].forEach(s => { const b = h("button", { onclick: () => { step = s; [...stepRow.querySelectorAll("button")].forEach(x => x.classList.toggle("b5on", x === b)); draw(); } }, String(s)); if (s === 1) b.classList.add("b5on"); stepRow.append(b); });
  const shapeRow = h("div", { class: "b5btns" }, h("span", { class: "b5lbl" }, "그래프 형태:"));
  [["세로형", false], ["가로형", true]].forEach(([t, v]) => { const b = h("button", { onclick: () => { horiz = v; [...shapeRow.querySelectorAll("button")].forEach(x => x.classList.toggle("b5on", x === b)); draw(); } }, t); if (!v) b.classList.add("b5on"); shapeRow.append(b); });
  const judge = () => {
    const v = ins.map(b5Num), given = ins.map(i => i.value.trim() || "-").join(", ");
    const bad = v.findIndex((x, i) => x !== g.vals[i]);
    if (bad >= 0) { api.tryOnce(); ins.forEach((i, k) => i.style.borderColor = v[k] === g.vals[k] ? "var(--ok)" : "var(--no)"); api.fail(`‘${cats[bad]}’ 칸의 수를 조사한 표와 다시 견주어 봐요.`, given); return false; }
    ins.forEach(i => i.style.borderColor = "var(--ok)");
    if (seenS.size < 2) { api.hint("수를 바르게 넣었어요! 이제 간격을 다른 수로 바꾸어 막대의 길이가 어떻게 달라지는지 살펴봐요."); return false; }
    if (seenH.size < 2) { api.hint("그래프 형태를 ‘가로형’으로도 바꾸어 봐요."); return false; }
    api.tryOnce();
    api.done(given + ` / 간격 ${[...seenS].join("·")}, 세로형·가로형`, opt.ok); return true;
  };
  auto = autoRun(() => ins.every(i => i.value.trim() !== ""), () => ins.map(i => i.value.trim()).join("|") + `#${seenS.size}${seenH.size}`, judge, 900);
  const side = h("div", { class: "side" }, h("p", {}, opt.lead || "① 표에 수를 넣어요. ② 간격(눈금 한 칸의 크기)을 바꾸어 봐요. ③ 가로형으로도 바꾸어 봐요."), stepRow, shapeRow, note);
  api.provide({ words: ["간격", "눈금 한 칸의 크기", "가로형", "세로형"], answers: [cats.map((c, i) => `${c} ${g.vals[i]}`).join(", ")] });
  draw();
  body.append(tbl, h("div", { class: "panel" }, stage, side));
}
/* 이야기 버전에서 더한 지도 기호: 자전거 보관대·공원 (나머지는 b5Icon) */
function b5sIcon(kind, x, y, s = 36) {
  if (kind !== "bike" && kind !== "park") return b5Icon(kind, x, y, s);
  const g = svgEl("g", { transform: `translate(${x} ${y}) scale(${s / 36})` });
  const P = (d, a) => g.append(svgEl("path", Object.assign({ d }, a)));
  if (kind === "bike") {
    P("M-16 -16 h32 v32 h-32 Z", { fill: "#E8F1FB", stroke: "#2B6FB8", "stroke-width": 1.5 });
    g.append(svgEl("circle", { cx: -7, cy: 6, r: 6, fill: "none", stroke: "#1D2A2A", "stroke-width": 2 }), svgEl("circle", { cx: 8, cy: 6, r: 6, fill: "none", stroke: "#1D2A2A", "stroke-width": 2 }));
    P("M-7 6 L-2 -4 L6 -4 L8 6 M-2 -4 L1 6 L6 -4 M-4 -8 h5", { stroke: "#D9482B", "stroke-width": 2, fill: "none", "stroke-linejoin": "round" });
  } else {
    P("M-2 4 h4 v12 h-4 Z", { fill: "#8A6A4A" });
    g.append(svgEl("circle", { cx: 0, cy: -5, r: 12, fill: "#7DC59A", stroke: "#2F6B30", "stroke-width": 1.5 }));
    P("M-16 16 h32", { stroke: "#5FA05A", "stroke-width": 3 });
  }
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
    const [x, y] = spots[si++], ic = b5sIcon(k.kind, x, y), mark = svgEl("g", { visibility: "hidden" });
    mark.append(svgEl("circle", { cx: x, cy: y, r: 22, fill: "none", stroke: "#2F8F5B", "stroke-width": 3 }), svgEl("path", { d: `M${x + 10} ${y - 24} l5 6 l9 -12`, stroke: "#2F8F5B", "stroke-width": 3.5, fill: "none" }));
    const hit = svgEl("circle", { cx: x, cy: y, r: 24, fill: "transparent", style: "cursor:pointer" });
    hit.addEventListener("click", () => mark.setAttribute("visibility", mark.getAttribute("visibility") === "hidden" ? "visible" : "hidden"));
    svg.append(ic, mark, hit);
  } });
  const ins = kinds.map(k => h("input", { type: "text", inputmode: "numeric", "aria-label": k.name }));
  const sumIn = h("input", { type: "text", inputmode: "numeric", "aria-label": "합계" });
  const all = ins.concat(sumIn);
  const total = kinds.reduce((a, k) => a + k.n, 0);
  const judge = () => {
    api.tryOnce();
    const given = kinds.map((k, i) => `${k.name} ${ins[i].value.trim() || "-"}`).join(", ") + `, 합계 ${sumIn.value.trim() || "-"}`;
    let bad = -1;
    ins.forEach((inp, i) => { const g = b5Num(inp) === kinds[i].n; inp.style.borderColor = g ? "var(--ok)" : "var(--no)"; if (!g && bad < 0) bad = i; });
    if (bad >= 0) { api.fail(`${kinds[bad].name} 기호를 다시 세어 봐요. 센 기호를 눌러 표시하면 빠뜨리지 않아요.`, given); return false; }
    const sg = b5Num(sumIn) === total; sumIn.style.borderColor = sg ? "var(--ok)" : "var(--no)";
    if (!sg) { api.fail("합계는 장소별 수를 모두 더한 수예요.", given); return false; }
    api.done(given, opt.ok); return true;
  };
  const auto = autoRun(() => all.every(i => i.value.trim() !== ""), () => all.map(i => i.value.trim()).join("|"), judge, 900);
  all.forEach(i => { i.addEventListener("input", auto); i.addEventListener("change", auto); b5Enter(i); });
  const side = h("div", { class: "side" }, h("p", {}, "센 기호를 누르면 ✔ 표시가 생겨요. 기호마다 수를 세어 쓰고 합계까지 쓰면 저절로 확인해요."),
    kinds.map((k, i) => { const s = makeSvg(40, 40); s.append(b5sIcon(k.kind, 20, 20, 34)); return h("div", { class: "b5row" }, s, h("span", { style: "min-width:6.5em" }, k.name), ins[i], h("span", {}, "개")); }),
    h("div", { class: "b5row" }, h("span", { style: "min-width:calc(6.5em + 34px + .4em)" }, "합계"), sumIn, h("span", {}, "개")));
  api.provide({ words: kinds.map(k => k.name).concat("합계"), answers: [kinds.map(k => `${k.name} ${k.n}`).join(", ") + `, 합계 ${total}`] });
  body.append(h("div", { class: "panel" }, h("div", { class: "stage" }, svg), side));
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
const B5V = (g, o) => Object.assign({}, g, o);

/* ===== 이야기 '우리 반 조사 기자단'의 자료 (모두 이 이야기에서 새로 정한 수) ===== */
const B5S = {
  milkBar: { title: "반별 오늘 마신 우유 수", cats: ["1반", "2반", "3반", "4반"], vals: [22, 24, 17, 20], unit: "개", catAxis: "반", valAxis: "우유 수", step: 1, cells: 25 },
  sport: { title: "좋아하는 운동별 학생 수", cats: ["축구", "피구", "줄넘기", "배드민턴"], vals: [7, 9, 3, 5], unit: "명", catAxis: "운동", valAxis: "학생 수", step: 1, cells: 10 },
  sport4: { title: "4학년이 좋아하는 운동별 학생 수", cats: ["축구", "피구", "줄넘기", "배드민턴"], vals: [26, 34, 12, 22], unit: "명", catAxis: "운동", valAxis: "학생 수", step: 2, cells: 18, horiz: true },
  meal: { title: "아침에 먹은 음식별 학생 수", cats: ["밥", "빵", "시리얼", "과일", "먹지 않음"], vals: [34, 26, 18, 10, 12], unit: "명", catAxis: "음식", valAxis: "학생 수", step: 2, cells: 18 },
  lib: { title: "학년별 도서관에서 빌린 책의 수", cats: ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"], vals: [80, 120, 160, 140, 200, 180], unit: "권", catAxis: "학년", valAxis: "책의 수", step: 20, cells: 10, horiz: true },
  bike: { title: "장소별 보관대에 세워진 자전거 수", cats: ["학교 앞", "공원", "도서관", "시장"], vals: [14, 10, 6, 8], unit: "대", catAxis: "장소", valAxis: "자전거 수", step: 1, cells: 15 },
  bikeDay: { title: "요일별 학교 앞 보관대의 자전거 수", cats: ["월요일", "화요일", "수요일", "목요일", "금요일"], vals: [15, 20, 10, 25, 30], unit: "대", catAxis: "요일", valAxis: "자전거 수", step: 5, cells: 6 },
  rack: { title: "장소별 자전거 보관대의 자리 수", cats: ["학교 앞", "공원", "도서관", "시장", "아파트"], vals: [40, 60, 20, 30, 50], unit: "자리", catAxis: "장소", valAxis: "자리 수", step: 10, cells: 6, horiz: true },
  book: { title: "빌리고 싶은 책 종류별 학생 수", cats: ["동화책", "만화책", "과학책", "역사책"], vals: [6, 9, 5, 4], unit: "명", catAxis: "책 종류", valAxis: "학생 수", step: 1, cells: 10 },
  book1: { title: "빌리고 싶은 책 종류별 학생 수", cats: ["동화책", "만화책", "과학책", "역사책"], vals: [7, 7, 6, 5], unit: "명", catAxis: "책 종류", valAxis: "학생 수", step: 1, cells: 10 },
  lunch: { title: "먹고 싶은 급식 메뉴별 학생 수", cats: ["짜장면", "카레", "비빔밥", "잔치국수"], vals: [11, 7, 4, 2], unit: "명", catAxis: "메뉴", valAxis: "학생 수", step: 1, cells: 12, horiz: true },
  rain: { title: "월별 비 온 날수", cats: ["4월", "5월", "6월", "7월"], vals: [5, 7, 10, 14], unit: "일", catAxis: "월", valAxis: "날수", step: 1, cells: 15 },
  bikeMon: { title: "월별 학교 앞 보관대에 세워진 자전거 수", cats: ["4월", "5월", "6월", "7월"], vals: [420, 380, 300, 220], unit: "대", catAxis: "월", valAxis: "자전거 수", step: 20, cells: 25 },
  town: { title: "우리 동네에서 고치고 싶은 것별 학생 수", cats: ["보관대 부족", "낡은 놀이터", "위험한 길", "쓰레기", "어두운 길"], vals: [36, 24, 30, 12, 18], unit: "명", catAxis: "고치고 싶은 것", valAxis: "학생 수", step: 2, cells: 20 },
  place: { title: "장소별 수", cats: ["자전거 보관대", "공원", "병원", "도서관", "학교"], vals: [9, 5, 4, 3, 2], unit: "개", catAxis: "장소", valAxis: "수", step: 1, cells: 10 },
  bal: { title: "신체 부위별 풍선을 띄운 횟수", cats: ["손바닥", "머리", "어깨", "무릎"], vals: [24, 16, 8, 14], unit: "회", catAxis: "신체 부위", valAxis: "횟수", step: 2, cells: 12 },
  bal2: { title: "신체 부위별 풍선을 띄운 횟수", cats: ["손바닥", "머리", "어깨", "무릎"], vals: [18, 20, 6, 12], unit: "회", catAxis: "신체 부위", valAxis: "횟수", step: 2, cells: 12 },
  ball: { title: "종류별 공을 띄운 횟수", cats: ["탁구공", "배구공", "테니스공", "고무공"], vals: [8, 30, 18, 22], unit: "회", catAxis: "공의 종류", valAxis: "횟수", step: 2, cells: 15 },
  after: { title: "방과 후 수업별 신청한 학생 수", cats: ["로봇", "요리", "바둑", "댄스"], vals: [18, 24, 10, 14], unit: "명", catAxis: "수업", valAxis: "학생 수", step: 2, cells: 15 },
  corner: { title: "읽고 싶은 신문 코너별 학생 수", cats: ["운동 소식", "급식 소식", "만화", "퀴즈", "인터뷰"], vals: [5, 4, 7, 6, 2], unit: "명", catAxis: "코너", valAxis: "학생 수", step: 1, cells: 8, horiz: true, every: 1 }
};
const B5S_MILK = { title: "반별 오늘 마신 우유 수", head: "반", row: "우유 수(개)", cats: ["1반", "2반", "3반", "4반"], vals: [22, 24, 17, 20], big: 10, unit: "개" };
/* 우리 반 24명이 빌리고 싶은 책: 0 동화책 6명, 1 만화책 9명, 2 과학책 5명, 3 역사책 4명 */
const B5S_SEQ = [1, 0, 2, 1, 3, 0, 1, 2, 1, 0, 3, 1, 2, 0, 1, 3, 2, 1, 0, 1, 3, 2, 0, 1];
const B5S_NAMES = ["윤서", "도현", "하린", "민재", "지안", "태오", "서아", "준호", "예린", "시후", "다온", "주원", "채아", "건우", "나연", "이준", "소윤", "현서", "라온", "우빈", "가은", "지호", "수빈", "은우"];
//@@LESSONS
const UNIT_STORY = { title: "우리 반 조사 기자단", lines: [
  "햇살초등학교 4학년 2반 24명은 학급 신문 「햇살 4-2 소식」을 만드는 조사 기자단이 되었어요. 기자단장 윤서, 사진 기자 도현, 하린, 민재, 태오가 함께해요.",
  "좋아하는 운동, 아침 식사, 도서관에서 빌린 책, 우리 동네 자전거 보관대처럼 궁금한 것을 조사하고 표와 막대그래프로 정리해요.",
  "막대그래프를 읽고 그리는 방법을 배우고, 그래프에서 찾은 사실을 근거로 기사를 써서 학급 신문을 펴내요."],
  one: "우리 반 조사 기자단 · 궁금한 것을 조사해 표와 막대그래프로 정리하고 기사로 발표해요." };
const UNIT_KEYWORDS = ["막대그래프", "가로", "세로", "눈금 한 칸의 크기", "막대의 길이", "제목", "표", "합계", "가장 큰 수", "가로 막대", "세로 막대", "조사 방법", "통계적 사실", "의견", "기사"];

const LESSONS = [
{
  id: "r1", no: 1, title: "우리 반 조사 기자단이 생겼어요", soop: "개념 찾기(S)",
  question: "조사한 자료를 어떻게 나타내면 한눈에 비교할 수 있을까요?",
  summary: "기자단은 조사한 자료를 신문에 실으려고 해요. 3학년 때 배운 표와 그림그래프를 떠올리고, 이 단원에서는 수량을 막대 모양으로 나타낸 그래프를 배워요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "학급 신문 「햇살 4-2 소식」의 첫 회의예요. 기자단이 조사해 볼 것을 떠올리며 세 칸에 써서 붙여요.", hints: ["우리 반 친구들이 좋아하는 것, 학교에서 자주 보는 것을 떠올려요.", "조사한 수를 신문에 어떻게 보여 줄지 생각해 봐요."],
      render: (b, a) => panes(b, a, [
        { t: "보여요", e: "👀", ph: "우리 반에서 ~을 조사할 수 있어요", hint: "기자단이 조사할 수 있는 것", ex: ["우리 반에서 좋아하는 운동을 조사할 수 있어요.", "학교 앞 자전거 보관대에 자전거가 몇 대 있는지 조사할 수 있어요."] },
        { t: "생각해요", e: "💭", ph: "조사한 수는 ~로 나타내면 좋겠어요", hint: "조사한 것을 정리했던 경험", ex: ["조사한 수는 표로 나타내면 정확하게 알 수 있어요.", "3학년 때 배운 그림그래프로 나타내면 한눈에 보일 것 같아요."] },
        { t: "궁금해요", e: "❓", ph: "~은 어떻게 나타낼까?", hint: "자료를 나타내는 방법에 대해 궁금한 것", ex: ["수가 아주 큰 자료는 그래프로 어떻게 나타낼까?", "막대 모양 그래프는 표와 무엇이 다를까?"] }],
        { ok: "기자단이 조사할 것이 아주 많아요! 조사한 자료를 신문 독자가 한눈에 보게 하는 방법을 배워 봐요." }) },
    { name: "그려 보기 — 그림그래프 떠올리기", inst: "기자단의 첫 취재예요. 급식실에서 받은 ‘반별 오늘 마신 우유 수’ 표를 보고 3학년 때 배운 그림그래프로 나타내 보세요.", hints: ["큰 그림 1개는 10개, 작은 그림 1개는 1개예요.", "22개는 큰 그림 2개와 작은 그림 2개예요."],
      render: (b, a) => b5Pict(b, a, Object.assign({ ok: "표의 수를 큰 그림과 작은 그림으로 알맞게 나타냈어요!" }, B5S_MILK)) },
    { name: "말해 보기 — 막대 모양 그래프 만나기", inst: "도현이가 같은 자료를 막대 모양으로 나타내 왔어요. 두 그래프를 살펴보고 답해 보세요.", hints: ["막대의 폭은 모두 같아요. 반마다 무엇이 다른지 살펴봐요.", "막대가 길수록 우유를 많이 마셨어요."],
      render: thenWhy((b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5S.milkBar, { ruler: false }), q: "막대 모양 그래프에서 우유 수를 나타내는 것은 무엇인가요?", t: "pick", o: ["막대의 길이", "막대의 폭", "막대의 색깔"], a: 0, why: { "1": "막대의 폭은 모두 같아요. 우유 수가 많을수록 무엇이 달라지나요?", "2": "막대의 색깔은 모두 같아요." } },
        { q: "우유를 가장 많이 마신 반은 어느 반인가요?", t: "pick", o: B5S.milkBar.cats, a: 1 },
        { q: "2반은 3반보다 우유를 몇 개 더 마셨나요?", t: "num", a: 7, unit: "개", why: { "41": "두 반의 수를 더하지 말고 차이를 구해요. 24−17을 계산해요." } }],
        { ok: "막대의 길이로 수량을 나타내면 많고 적음을 한눈에 비교할 수 있어요." }),
        { q: "막대 모양 그래프에서 가장 많이 마신 반을 어떻게 한눈에 찾을 수 있을까요?", ph: "막대가 ~ 반을 찾으면 돼요. 왜냐하면 ~", help: ["① 막대의 길이가 무엇을 나타내는지 떠올려요. → ② 가장 많은 것은 막대가 어떠한지 생각해요.", "‘막대가 가장 ~ 반을 찾으면 돼요. 막대가 길수록 ~이기 때문이에요.’ 꼴로 써요."], ans: "막대가 가장 긴 반을 찾으면 돼요. 막대가 길수록 우유를 많이 마셨기 때문이에요." }) },
    { name: "약속하기 — 무엇을 배울까요", inst: "기자단이 이 단원에서 배울 것을 골라 보세요.", hints: ["그림그래프는 그림의 크기와 수로 나타내요.", "막대 모양 그래프는 막대의 길이로 나타내요."],
      render: (b, a) => quiz(b, a, [
        { q: "조사한 자료를 막대 모양으로 나타내면 무엇이 편리할까요?", o: ["많고 적음을 한눈에 비교할 수 있어요", "그림을 그리지 않아도 돼요", "합계를 꼭 알 수 있어요"], a: 0 },
        { q: "막대 모양 그래프를 읽을 때 먼저 확인할 것은?", o: ["가로와 세로가 무엇을 나타내는지", "막대의 색깔이 무엇인지"], a: 0 },
        { q: "조사한 자료로 막대 모양 그래프를 그리려면 무엇을 정해야 할까요?", o: ["눈금 한 칸이 얼마를 나타낼지", "막대를 몇 가지 색으로 칠할지"], a: 0 }],
        { ok: "이 단원에서는 막대그래프를 읽고, 그리고, 조사한 자료로 막대그래프를 만들어 기사를 써요." }) },
    { name: "확인하기 — 첫 기사 계획", inst: "기자단의 첫 기사 계획을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "우리 반에서 조사해 보고 싶은 것은 무엇인가요?", tag: "조사 주제", ph: "예) 우리 반 친구들이 좋아하는 운동", help: ["① 우리 반 친구들에게 물어볼 수 있는 것을 떠올려요. → ② 친구마다 답이 다를 만한 것을 골라요.", "‘우리 반 친구들이 좋아하는 ~을 조사해 보고 싶어요.’ 꼴로 써요."], ans: "우리 반 친구들이 좋아하는 운동을 조사해 보고 싶어요." },
        { q: "조사한 결과를 신문에 어떻게 보여 주면 좋을까요?", tag: "보여 주는 방법", ph: "예) 막대 모양 그래프로 …", help: ["① 표와 그래프 가운데 무엇이 한눈에 잘 보일지 생각해요. → ② 그 까닭을 함께 써요.", "‘~로 보여 주면 좋겠어요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요."], ans: "막대 모양 그래프로 보여 주면 좋겠어요. 왜냐하면 어느 것이 가장 많은지 한눈에 보이기 때문이에요." }]) }
  ],
  challenge: { inst: "그림그래프를 보고 물음에 답해 보세요.", hints: ["큰 그림 1개는 10개, 작은 그림 1개는 1개예요.", "네 반의 우유 수를 모두 더해요."],
    render: (b, a) => b5Ask(b, a, [
      { fig: () => b5PictFig(B5S_MILK), q: "큰 그림 1개와 작은 그림 7개는 우유 몇 개를 나타내나요?", t: "num", a: 17, unit: "개", why: { "8": "큰 그림 1개는 1개가 아니라 10개를 나타내요." } },
      { q: "네 반이 오늘 마신 우유는 모두 몇 개인가요?", t: "num", a: 83, unit: "개" },
      { q: "3반이 우유를 3개 더 마셨다면 큰 그림은 몇 개가 되나요?", t: "num", a: 2, unit: "개", why: { "1": "17개에 3개를 더하면 20개예요. 20개는 큰 그림 몇 개일까요?" } }],
      { bad: "빨간 칸을 다시 살펴봐요. 큰 그림은 10개, 작은 그림은 1개를 나타내요.", ok: "그림그래프를 정확하게 읽었어요!" }) }
},
{
  id: "r2", no: 2, title: "좋아하는 운동 기사 ― 막대그래프를 알아봐요", soop: "개념 구축하기(O)",
  question: "조사한 자료의 수량을 막대 모양으로 나타내면 무엇이 편리할까요?",
  summary: "조사한 자료의 수량을 막대 모양으로 나타낸 그래프를 막대그래프라고 해요. 막대의 길이가 수량을 나타내고, 눈금 한 칸의 크기를 보고 수량을 읽어요. 막대는 세로로도 가로로도 나타낼 수 있어요.",
  steps: [
    { name: "만져 보기 — 막대 세우기", inst: "윤서가 우리 반 24명에게 좋아하는 운동을 물어 표로 정리했어요. 운동마다 막대를 위로 끌어 올려(또는 눌러) 학생 수만큼 세워 보세요.", hints: ["세로 눈금 한 칸은 1명이에요. 9명이면 9칸만큼 세워요.", "막대를 누른 뒤 ▲ ▼ 단추로 한 칸씩 고칠 수 있어요."],
      render: ruleFirst((b, a) => b5Build(b, a, { g: B5S.sport, ok: "막대의 길이가 학생 수를 나타내요. 피구 막대가 가장 길어요!" }),
        { q: "막대의 길이를 어떻게 정하면 좋을까요?", ph: "내 규칙: 막대는 ~만큼 세워요", help: ["① 세로 눈금 한 칸이 몇 명인지 봐요. → ② 학생 수와 칸 수를 이어 생각해요.", "‘내 규칙: 학생 수가 ~명이면 눈금 ~칸만큼 세워요.’ 꼴로 써요."], ans: "세로 눈금 한 칸이 1명이므로 학생 수만큼 눈금 칸을 세어 막대를 세워요. 피구 9명이면 9칸이에요." }) },
    { name: "그려 보기 — 막대를 가로로", inst: "신문 칸이 옆으로 길어서 막대를 가로로 나타내기로 했어요. 운동마다 막대를 오른쪽으로 끌어 학생 수만큼 늘여 보세요.", hints: ["가로 눈금 한 칸도 1명이에요.", "막대의 길이가 학생 수만큼 되게 해요."],
      render: (b, a) => b5Build(b, a, { g: B5V(B5S.sport, { horiz: true }), ok: "막대를 가로로 나타내도 막대의 길이가 학생 수를 나타내요!" }) },
    { name: "말해 보기 — 가로와 세로", inst: "막대그래프를 보고 물음에 답해 보세요. 그래프를 누르면 눈금 자가 나와요.", hints: ["막대가 서 있는 아래쪽(가로)에 운동이 쓰여 있어요.", "0과 5 사이에 눈금이 5칸 있어요. 5칸이 5명이에요."],
      render: thenWhy((b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5S.sport), q: "그래프의 가로는 무엇을 나타내나요?", t: "pick", o: ["운동", "학생 수"], a: 0 },
        { q: "그래프의 세로는 무엇을 나타내나요?", t: "pick", o: ["운동", "학생 수"], a: 1 },
        { q: "세로 눈금 한 칸은 몇 명을 나타내나요?", t: "num", a: 1, unit: "명", why: { "5": "0과 5 사이에 눈금이 5칸 있어요. 5칸이 5명이면 한 칸은 몇 명일까요?" } },
        { q: "축구를 좋아하는 학생은 배드민턴보다 몇 명 더 많나요?", t: "num", a: 2, unit: "명", why: { "12": "더하지 말고 두 막대의 길이 차이를 구해요." } }],
        { ok: "가로는 운동, 세로는 학생 수, 세로 눈금 한 칸은 1명이에요." }),
        { q: "세로 막대그래프와 가로 막대그래프는 무엇이 같고 무엇이 다를까요?", ph: "같은 점은 ~, 다른 점은 ~", help: ["① 두 그래프에서 학생 수를 나타내는 것을 찾아요. → ② 운동과 학생 수가 놓인 자리를 견주어요.", "‘같은 점은 막대의 ~이 학생 수를 나타낸다는 것이고, 다른 점은 ~이 놓인 자리예요.’ 꼴로 써요."], ans: "같은 점은 두 그래프 모두 막대의 길이가 학생 수를 나타낸다는 것이고, 다른 점은 운동과 학생 수가 놓인 자리가 바뀐 것이에요." }) },
    { name: "약속하기 — 막대그래프", inst: "약속을 완성해요.", hints: ["조사한 수량을 막대 모양으로 나타냈어요."],
      render: (b, a) => blanks(b, a, ["조사한 자료의 수량을 ", { o: ["막대", "그림", "점"], a: 0 }, " 모양으로 나타낸 그래프를 ", { o: ["막대그래프", "그림그래프", "표"], a: 0 }, "라고 해요. 막대그래프에서는 막대의 ", { o: ["길이", "폭"], a: 0 }, "에 따라 수량을 알 수 있어요. 막대는 세로로도 ", { o: ["가로로도", "비스듬하게도"], a: 0 }, " 나타낼 수 있어요."]) },
    { name: "확인하기 — 표와 막대그래프", inst: "기사에 표와 막대그래프를 함께 싣기로 했어요. 각각 어떤 점이 편리할까요? 카드를 알맞은 상자에 넣어 보세요.", hints: ["표에는 수가 그대로 쓰여 있고 합계도 있어요.", "막대그래프는 막대의 길이를 한눈에 견줄 수 있어요."],
      render: (b, a) => b5Sort(b, a, { bins: ["표가 편리한 점", "막대그래프가 편리한 점"], cards: [
        { t: "운동별 학생 수를 정확하게 알 수 있어요.", b: 0 }, { t: "어느 운동이 더 인기 있는지 한눈에 비교할 수 있어요.", b: 1 },
        { t: "조사한 학생이 모두 몇 명인지 합계로 알 수 있어요.", b: 0 }, { t: "가장 많은 운동과 가장 적은 운동을 한눈에 알 수 있어요.", b: 1 }],
        ok: "표와 막대그래프는 서로 다른 좋은 점이 있어요. 그래서 기사에 둘을 함께 실으면 좋아요." }) }
  ],
  challenge: { inst: "태오가 4학년 전체가 좋아하는 운동을 조사해 가로 막대그래프로 나타냈어요. 물음에 답해 보세요.", hints: ["가로 눈금 5칸이 10명이에요.", "10명을 5칸으로 나누면 한 칸은 몇 명일까요?"],
    render: (b, a) => b5Ask(b, a, [
      { fig: () => b5Fig(B5S.sport4), q: "그래프의 가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 학생 수, 세로: 운동", "가로: 운동, 세로: 학생 수"], a: 0, why: { "1": "막대가 가로로 누워 있어요. 운동 이름은 왼쪽 세로에 쓰여 있어요." } },
      { q: "가로 눈금 한 칸은 몇 명을 나타내나요?", t: "num", a: 2, unit: "명", why: { "1": "0과 10 사이가 5칸이에요. 5칸이 10명이면 한 칸은 몇 명일까요?", "10": "10명은 눈금 5칸이 나타내는 수예요.", "5": "5는 0과 10 사이의 칸 수예요." } },
      { q: "피구를 좋아하는 학생은 몇 명인가요?", t: "num", a: 34, unit: "명", why: { "17": "피구 막대는 17칸이에요. 한 칸이 2명이면 17칸은 몇 명일까요?" } },
      { q: "축구를 좋아하는 학생은 줄넘기보다 몇 명 더 많나요?", t: "num", a: 14, unit: "명", why: { "7": "막대 길이가 7칸 차이 나요. 한 칸이 2명이면 몇 명일까요?" } }],
      { ok: "눈금 한 칸이 2명인 것을 알고 정확하게 읽었어요!" }) }
},
{
  id: "r3", no: 3, title: "아침 식사 기사 ― 막대그래프를 읽어요", soop: "개념 구축하기(O)",
  question: "막대그래프를 보고 어떤 내용을 알 수 있을까요?",
  summary: "막대그래프에서는 막대가 길수록 수량이 많아요. 먼저 가로와 세로가 무엇을 나타내는지, 눈금 한 칸의 크기가 얼마인지 확인하면 항목별 수량과 많고 적음, 차이를 알 수 있어요.",
  steps: [
    { name: "만져 보기 — 눈금 한 칸이 1이 아니에요", inst: "하린이가 보건 선생님께 4학년 학생 100명이 오늘 아침에 먹은 음식을 조사한 막대그래프를 받아 왔어요. 이번에는 눈금 한 칸이 1명이 아니에요.", hints: ["0과 10 사이에 눈금이 몇 칸 있는지 세어요.", "밥 막대는 17칸이에요."],
      render: ruleFirst((b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5S.meal), q: "세로 눈금 한 칸은 몇 명을 나타내나요?", t: "num", a: 2, unit: "명", why: { "1": "0과 10 사이가 5칸이에요. 한 칸이 1명이면 5칸은 5명이 되어야 해요.", "10": "10명은 눈금 5칸이 나타내는 수예요.", "5": "5는 0과 10 사이의 칸 수예요." } },
        { q: "아침에 밥을 먹은 학생은 몇 명인가요?", t: "num", a: 34, unit: "명", why: { "17": "밥 막대는 17칸이에요. 한 칸이 2명이면 17칸은 몇 명일까요?" } },
        { q: "아침을 먹지 않은 학생은 몇 명인가요?", t: "num", a: 12, unit: "명", why: { "6": "막대는 6칸이고 한 칸은 2명이에요." } }],
        { ok: "세로 눈금 5칸이 10명이니 한 칸은 2명이에요. 밥은 17칸이라 34명이에요." }),
        { q: "눈금 한 칸이 몇 명인지 어떻게 알 수 있을까요?", ph: "내 규칙: ~", help: ["① 수가 쓰여 있는 두 눈금(0과 10)을 찾아요. → ② 그 사이가 몇 칸인지 세어요.", "‘내 규칙: 0부터 ~까지 칸 수를 세어 ~을 칸 수로 나누어요.’ 꼴로 써요."], ans: "0부터 10까지 눈금이 5칸이므로 10을 5로 나누면 한 칸은 2명이에요. 수가 쓰인 눈금 사이의 칸 수를 세어 나누면 돼요." }) },
    { name: "그려 보기 — 많고 적음", inst: "같은 막대그래프에서 많고 적음을 알아봐요. 그래프를 누르면 눈금 자가 나와요.", hints: ["막대가 가장 긴 것과 가장 짧은 것을 찾아요.", "‘시리얼’ 막대보다 긴 막대를 모두 찾아요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5S.meal), q: "가장 많은 학생이 아침에 먹은 음식은 무엇인가요?", t: "pick", o: B5S.meal.cats, a: 0 },
        { q: "아침에 먹은 학생이 가장 적은 음식은 무엇인가요?", t: "pick", o: B5S.meal.cats.slice(0, 4), a: 3, why: { "2": "시리얼 막대보다 더 짧은 막대가 있어요." } },
        { q: "‘시리얼’보다 더 많은 학생이 먹은 음식을 모두 고르세요.", t: "pick", o: B5S.meal.cats.slice(0, 4), a: [0, 1], why: { "0,3": "‘과일’ 막대는 ‘시리얼’보다 짧아요. ‘빵’ 막대를 다시 봐요.", "1,3": "‘과일’ 막대는 ‘시리얼’보다 짧아요. ‘밥’ 막대를 다시 봐요.", "0,2": "‘시리얼’보다 더 많은 것을 골라요. ‘빵’ 막대를 다시 봐요.", "1,2": "‘시리얼’보다 더 많은 것을 골라요. ‘밥’ 막대를 다시 봐요.", "2,3": "‘시리얼’보다 막대가 긴 것을 골라요." } },
        { q: "빵을 먹은 학생은 과일을 먹은 학생보다 몇 명 더 많나요?", t: "num", a: 16, unit: "명", why: { "8": "막대 길이가 8칸 차이 나요. 한 칸이 2명이면 몇 명일까요?", "36": "더하지 말고 차이를 구해요." } }],
        { ok: "밥이 가장 많고 과일이 가장 적어요. 빵은 과일보다 16명 더 많아요." }) },
    { name: "말해 보기 — 가로 막대그래프 읽기", inst: "민재가 도서관에서 받은 ‘학년별 도서관에서 빌린 책의 수’ 막대그래프예요. 가로 눈금 한 칸은 몇 권을 나타내는지 살펴볼까요?", hints: ["0과 100 사이에 눈금이 5칸 있어요.", "100권을 5칸으로 나누어요."],
      render: thenWhy((b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5S.lib), q: "가로 눈금 한 칸은 몇 권을 나타내나요?", t: "num", a: 20, unit: "권", why: { "1": "0과 100 사이가 5칸이에요. 한 칸은 1권이 아니에요.", "5": "5는 0과 100 사이의 칸 수예요. 100권을 5칸으로 나누면?", "10": "0과 100 사이는 10칸이 아니라 5칸이에요. 100권을 5칸으로 나누어 봐요.", "100": "100권은 눈금 5칸이 나타내는 수예요." } },
        { q: "3학년이 빌린 책은 몇 권인가요?", t: "num", a: 160, unit: "권", why: { "8": "3학년 막대는 8칸이에요. 한 칸이 20권이면 8칸은 몇 권일까요?", "80": "한 칸은 10권이 아니라 20권이에요." } },
        { q: "5학년은 1학년보다 책을 몇 권 더 빌렸나요?", t: "num", a: 120, unit: "권", why: { "6": "막대 길이가 6칸 차이 나요. 한 칸이 20권이면 몇 권일까요?", "280": "더하지 말고 차이를 구해요." } }],
        { ok: "가로 눈금 한 칸은 20권이에요. 3학년은 160권, 5학년은 1학년보다 120권 더 빌렸어요." }),
        { q: "가로 눈금 한 칸이 20권인 까닭을 써 보세요.", ph: "왜냐하면 ~", help: ["① 0과 100 사이의 눈금 칸 수를 세어요. → ② 100을 그 칸 수로 나누어요.", "‘왜냐하면 0부터 100까지 눈금이 ~칸이고, 100을 ~로 나누면 ~이기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 0부터 100까지 눈금이 5칸이고, 100을 5로 나누면 20이기 때문이에요." }) },
    { name: "약속하기 — 막대그래프 읽기", inst: "막대그래프를 읽는 약속을 완성해요.", hints: ["막대의 길이가 수량을 나타내요."],
      render: (b, a) => blanks(b, a, ["막대그래프를 읽을 때는 먼저 가로와 세로가 무엇을 나타내는지 보고, 눈금 한 칸의 ", { o: ["크기", "색깔"], a: 0 }, "도 확인해요. 눈금 한 칸의 크기는 수가 쓰인 눈금의 수를 그 사이의 ", { o: ["칸 수", "막대 수"], a: 0 }, "로 나누어 구해요. 막대가 길수록 수량이 ", { o: ["많아요", "적어요"], a: 0 }, "."]) },
    { name: "확인하기 — 차례대로", inst: "책을 많이 빌린 학년부터 차례대로 눌러 보세요.", hints: ["가장 긴 막대부터 차례로 눌러요.", "5학년 막대가 가장 길어요."],
      render: (b, a) => { b.append(b5Fig(B5S.lib, { tip: false })); sequence(b, a, B5S.lib.cats, [4, 5, 2, 3, 1, 0], { ok: "5학년, 6학년, 3학년, 4학년, 2학년, 1학년 순서예요. 막대의 길이로 한눈에 알 수 있어요." }); } }
  ],
  challenge: { inst: "아침 식사 막대그래프로 기사에 넣을 질문을 만들었어요. 답을 구해 보세요.", hints: ["세로 눈금 한 칸은 2명이에요.", "아침을 먹은 학생은 ‘먹지 않음’을 뺀 네 막대의 학생 수를 더해요."],
    render: (b, a) => b5Ask(b, a, [
      { fig: () => b5Fig(B5S.meal), q: "아침을 먹은 학생은 모두 몇 명인가요?", t: "num", a: 88, unit: "명", why: { "100": "‘먹지 않음’ 12명은 아침을 먹지 않은 학생이에요. 빼고 더해요." } },
      { q: "아침을 먹지 않은 학생은 과일을 먹은 학생보다 몇 명 더 많나요?", t: "num", a: 2, unit: "명" },
      { q: "밥을 먹은 학생은 시리얼을 먹은 학생보다 몇 명 더 많나요?", t: "num", a: 16, unit: "명", why: { "8": "8칸 차이예요. 한 칸이 2명이에요." } }],
      { ok: "막대그래프를 보고 여러 가지 내용을 알아냈어요!" }) }
},
{
  id: "r4", no: 4, title: "자전거 보관대 기사 ― 막대그래프로 나타내요", soop: "개념 구축하기(O)",
  question: "표를 보고 막대그래프로 나타내려면 어떻게 해야 할까요?",
  summary: "막대그래프로 나타낼 때는 ① 가로와 세로에 무엇을 나타낼지 정하고 ② 가장 큰 수까지 나타낼 수 있도록 눈금 한 칸의 크기를 정한 뒤 ③ 조사한 수에 맞게 막대를 그리고 ④ 알맞은 제목을 써요.",
  steps: [
    { name: "만져 보기 — 표를 막대그래프로", inst: "도현이가 토요일 아침에 우리 동네 보관대마다 세워진 자전거를 세어 표로 정리했어요. 가로와 세로에 무엇을 나타낼지 고르고, 막대를 세운 뒤 알맞은 제목을 골라 보세요. 세로 눈금 한 칸은 1대예요.", hints: ["막대가 서는 가로에는 장소를, 세로에는 자전거 수를 나타내요.", "학교 앞은 14대이니 14칸만큼 세워요."],
      render: (b, a) => b5Build(b, a, { g: B5S.bike, axisPick: true, titleChoices: ["좋아하는 장소", "장소별 보관대에 세워진 자전거 수", "우리 반 학생 수"], ok: "가로에 장소, 세로에 자전거 수를 나타내고 알맞은 제목도 붙였어요!" }) },
    { name: "그려 보기 — 눈금 한 칸의 크기 정하기", inst: "신문 칸이 좁아서 세로 눈금을 8칸만 그릴 수 있어요. 눈금 한 칸의 크기를 고르고 막대를 다시 세워 보세요.", hints: ["눈금 한 칸이 1대이면 8칸으로 8대까지만 나타낼 수 있어요. 가장 큰 수는 14예요.", "한 칸이 2대이면 학교 앞 14대는 7칸이에요."],
      render: ruleFirst((b, a) => b5Build(b, a, { g: B5V(B5S.bike, { cells: 8 }), stepChoices: [1, 2, 5], ok: "가장 큰 수가 14이고 눈금이 8칸이니 한 칸을 2대로 정했어요. 학교 앞 7칸, 공원 5칸, 도서관 3칸, 시장 4칸이에요." }),
        { q: "세로 눈금이 8칸뿐이에요. 눈금 한 칸을 몇 대로 하면 좋을까요?", ph: "내 규칙: 한 칸을 ~대로 해요. 왜냐하면 ~", help: ["① 가장 큰 수가 몇인지 찾아요. → ② 8칸으로 그 수까지 나타낼 수 있는 크기를 생각해요.", "‘내 규칙: 가장 큰 수 ~대까지 나타내야 하니 한 칸을 ~대로 해요.’ 꼴로 써요."], ans: "가장 큰 수 14대까지 나타내야 하므로 눈금 한 칸을 2대로 하면 8칸으로 16대까지 나타낼 수 있어요. 모든 수가 짝수라서 칸에 꼭 맞아요." }) },
    { name: "말해 보기 — 막대를 가로로", inst: "처음 그린 막대그래프의 가로와 세로를 바꾸어 막대를 가로로 나타내 보세요.", hints: ["이번에는 세로에 장소, 가로에 자전거 수가 있어요.", "가로 눈금 한 칸은 1대예요."],
      render: (b, a) => b5Build(b, a, { g: B5V(B5S.bike, { horiz: true }), ok: "막대를 가로로 나타냈어요. 표와 다시 견주어 잘 나타냈는지 확인해 봐요." }) },
    { name: "약속하기 — 막대그래프로 나타내는 방법", inst: "막대그래프로 나타내는 방법을 정리해요.", hints: ["가장 큰 수가 그래프 안에 들어가야 해요.", "제목은 먼저 써도 돼요."],
      render: (b, a) => blanks(b, a, ["① 표를 보고 가로와 세로에 무엇을 나타낼지 정해요. ② ", { o: ["가장 큰 수", "가장 작은 수"], a: 0 }, "까지 나타낼 수 있도록 ", { o: ["눈금 한 칸의 크기", "막대의 굵기"], a: 0 }, "를 정해요. ③ 조사한 자료의 수에 맞게 ", { o: ["막대", "그림"], a: 0 }, " 모양으로 나타내요. ④ 막대그래프에 알맞은 ", { o: ["제목", "눈금"], a: 0 }, "을 써요. (제목은 먼저 써도 돼요.)"]) },
    { name: "확인하기 — 스스로 정하기", inst: "도현이가 한 주 동안 날마다 아침에 학교 앞 보관대의 자전거를 세었어요. 눈금 칸 수와 눈금 한 칸의 크기를 스스로 정해 막대그래프로 나타내 보세요.", hints: ["가장 큰 수는 30이에요. (칸 수) × (한 칸의 크기)가 30보다 작으면 안 돼요.", "모든 수가 눈금 칸에 꼭 맞으려면 한 칸의 크기로 15, 20, 10, 25, 30을 모두 나눌 수 있어야 해요."],
      render: (b, a) => b5Build(b, a, { g: B5S.bikeDay, stepChoices: [2, 5, 1], cellChoices: [5, 6, 10, 30], ok: "같은 자료라도 눈금 한 칸의 크기에 따라 막대의 칸 수가 달라져요. 하지만 나타내는 수는 같아요." }) }
  ],
  challenge: { inst: "우리 동네 보관대마다 자전거를 세울 수 있는 자리 수를 가로 막대그래프로 나타내 보세요. 가로 눈금은 6칸이에요.", hints: ["가장 큰 수는 60자리예요. 6칸으로 60까지 나타내려면?", "학교 앞 40자리는 한 칸이 10자리이면 4칸이에요."],
    render: (b, a) => b5Build(b, a, { g: B5S.rack, stepChoices: [5, 10, 20], ok: "가장 큰 수 60자리까지 나타낼 수 있게 눈금 한 칸을 10자리로 정하고 막대를 그렸어요!" }) }
},
{
  id: "r5", no: 5, title: "무엇을 어떻게 조사할까? ― 조사하여 표로 정리해요", soop: "개념 구축하기(O)",
  question: "우리 반 친구들이 빌리고 싶은 책을 어떻게 조사하고 정리할까요?",
  summary: "알고 싶은 것을 정하고, 겹치지 않는 항목과 조사 방법(손 들기, 스티커 붙이기, 설문지)을 정해 자료를 모아요. 모은 자료는 표로 정리하고, 합계가 조사한 사람 수와 같은지 확인해요.",
  steps: [
    { name: "만져 보기 — 조사 방법 정하기", inst: "학교 도서관에서 새 책을 사려고 해요. 기자단은 ‘우리 반 친구들은 어떤 종류의 책을 빌리고 싶어 할까?’를 조사하기로 했어요.", hints: ["친구들에게 직접 물어서 자료를 모아야 해요.", "‘나’ 한 사람이 아니라 ‘우리 반 친구들’에게 묻는 질문을 골라요."],
      render: thenWhy((b, a) => b5Ask(b, a, [
        { q: "조사하는 방법으로 알맞은 것을 모두 고르세요.", t: "pick", o: ["직접 손 들기", "스티커 붙이기", "설문지(종이·태블릿)에 표시하기", "친구들에게 묻지 않고 짐작하기"], a: [0, 1, 2], why: { "0,1,3": "짐작한 것은 조사한 자료가 아니에요.", "0,2,3": "짐작한 것은 조사한 자료가 아니에요.", "1,2,3": "짐작한 것은 조사한 자료가 아니에요." } },
        { q: "조사하기에 알맞은 질문은 어느 것인가요?", t: "pick", o: ["우리 반 친구들은 어떤 종류의 책을 빌리고 싶어 할까?", "나는 어떤 책을 빌리고 싶을까?"], a: 0, why: { "1": "나 한 사람의 생각은 조사하지 않아도 알 수 있어요. 여러 친구의 자료를 모아야 해요." } }],
        { bad: "빨간 칸을 다시 살펴봐요. 우리 반 친구들에게 직접 물어서 자료를 모으는 방법인지 생각해 봐요.", ok: "우리 반 친구들에게 직접 묻는 방법으로 자료를 모아요." }),
        { q: "짐작한 것으로 기사를 쓰면 안 되는 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 짐작과 실제로 물어본 결과가 같을지 생각해요. → ② 신문을 읽는 친구들에게 어떤 문제가 생길지 떠올려요.", "‘왜냐하면 짐작한 것은 ~ 자료가 아니어서 ~ 수 있기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 짐작한 것은 친구들에게 직접 물어본 자료가 아니어서 실제와 다를 수 있기 때문이에요." }) },
    { name: "그려 보기 — 조사 항목 정하기", inst: "스티커 판에 붙일 항목을 정해요. 알맞은 항목 묶음을 골라 보세요.", hints: ["한 친구가 두 칸에 해당하면 안 돼요.", "‘재미있는 책’은 동화책에도 만화책에도 해당할 수 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "항목 묶음으로 알맞은 것은?", o: ["동화책, 만화책, 과학책, 역사책", "동화책, 재미있는 책, 만화책, 두꺼운 책"], a: 0, why: { "1": "‘재미있는 책’, ‘두꺼운 책’은 다른 항목과 겹쳐서 한 친구가 어디에 붙일지 헷갈려요." } },
        { q: "한 친구는 스티커를 몇 장 붙이기로 정해야 할까요?", o: ["한 장", "붙이고 싶은 만큼"], a: 0, why: { "1": "한 친구가 여러 장을 붙이면 합계가 조사한 친구 수와 달라져요." } }],
        { ok: "항목은 서로 겹치지 않게, 한 사람은 한 번만 고르게 정해요." }) },
    { name: "말해 보기 — 스티커로 조사하기", inst: "우리 반 24명이 빌리고 싶은 책에 스티커를 붙여요. 차례대로 친구가 고른 책 칸을 눌러 스티커를 붙인 다음, 표로 정리해 보세요.", hints: ["스티커 판에서 책마다 스티커를 세어요.", "합계는 조사한 친구 수와 같아요."],
      render: (b, a) => b5Tally(b, a, { cats: B5S.book.cats, seq: B5S_SEQ, names: B5S_NAMES, what: "책", title: B5S.book.title, head: "책 종류", row: "학생 수(명)", ok: "스티커로 모은 자료를 표로 정리했어요. 합계 24명은 우리 반 학생 수와 같아요." }) },
    { name: "약속하기 — 조사하는 차례", inst: "자료를 조사하여 정리하는 차례를 완성해요.", hints: ["무엇을 알고 싶은지부터 정해요.", "합계로 빠뜨린 친구가 없는지 확인해요."],
      render: (b, a) => blanks(b, a, ["① 알고 싶은 것을 정해요. ② 서로 ", { o: ["겹치지 않는", "비슷한"], a: 0 }, " 항목과 조사 방법을 정해요. ③ 친구들에게 ", { o: ["직접 물어", "짐작하여"], a: 0 }, " 자료를 모아요. ④ 모은 자료를 ", { o: ["표", "그림"], a: 0 }, "에 정리하고, 합계가 조사한 사람 수와 ", { o: ["같은지", "다른지"], a: 0 }, " 확인해요."]) },
    { name: "확인하기 — 다른 반 기록 정리하기", inst: "하린이가 옆 반(4학년 3반)에서 손 들기로 조사하며 다섯 개씩 묶어 센 기록이에요. 빨간 사선이 있는 묶음 하나가 5명이에요. 세어서 표를 완성해 보세요.", hints: ["묶음 하나는 5명이에요. 묶음 수를 먼저 세요.", "합계는 네 칸의 수를 모두 더해요."],
      render: (b, a) => b5Table(b, a, { fig: () => b5TallyFig(B5S.book.cats, [8, 10, 5, 3], "4학년 3반 손 들기 기록"), title: "빌리고 싶은 책 종류별 학생 수 (4학년 3반)", head: "책 종류", row: "학생 수(명)", cats: B5S.book.cats, vals: [8, 10, 5, 3], blanks: [0, 1, 2, 3, "sum"], ok: "동화책 8명, 만화책 10명, 과학책 5명, 역사책 3명, 합계 26명이에요." }) }
  ],
  challenge: { inst: "4학년 1반의 조사 표에 빈칸이 있어요. 1반 학생은 모두 25명이에요.", hints: ["합계에서 나머지 수를 모두 빼요.", "25 − 7 − 6 − 5를 계산해요."],
    render: (b, a) => b5Ask(b, a, [
      { fig: () => b5TableEl({ title: "빌리고 싶은 책 종류별 학생 수 (4학년 1반)", head: "책 종류", row: "학생 수(명)", cats: ["동화책", "만화책", "과학책", "역사책"], vals: [7, "□", 6, 5], sum: false }).el, q: "만화책을 빌리고 싶은 학생은 몇 명인가요? (합계 25명)", t: "num", a: 7, unit: "명", why: { "18": "18은 동화책, 과학책, 역사책 학생 수의 합이에요. 25에서 빼야 해요." } },
      { q: "1반에서 가장 적은 학생이 빌리고 싶은 책은?", t: "pick", o: ["동화책", "만화책", "과학책", "역사책"], a: 3 },
      { q: "우리 반(2반)과 1반에서 모두 가장 적은 학생이 고른 책은?", t: "pick", o: ["동화책", "만화책", "과학책", "역사책"], a: 3, why: { "2": "우리 반에서는 역사책이 4명으로 가장 적어요." } }],
      { ok: "합계를 이용해 빈칸을 구하고 두 반의 자료를 견주었어요!" }) }
},
{
  id: "r6", no: 6, title: "조사 결과를 막대그래프로 ― 공학 도구도 써 봐요", soop: "탐구 정리하기(O)",
  question: "조사한 자료를 막대그래프로 나타내면 무엇을 알 수 있을까요?",
  summary: "조사한 표를 보고 가로·세로, 눈금 한 칸의 크기, 제목을 스스로 정해 막대그래프로 나타내요. 공학 도구로도 그릴 수 있어요. 막대그래프에서 가장 많은 것, 가장 적은 것을 찾아 결정에 쓸 수 있어요.",
  steps: [
    { name: "만져 보기 — 우리 반 막대그래프", inst: "지난 시간에 조사한 우리 반 표를 보고 막대그래프로 나타내요. 가로와 세로, 눈금 칸 수, 눈금 한 칸의 크기, 제목을 스스로 정해 보세요.", hints: ["가장 큰 수는 9예요. 9까지 나타낼 수 있어야 해요.", "한 칸이 2명이면 9명, 5명은 칸에 꼭 맞지 않아요."],
      render: (b, a) => b5Build(b, a, { g: B5S.book, axisPick: true, stepChoices: [2, 1, 5], cellChoices: [5, 10, 20], titleChoices: ["우리 반 학생 수", "빌리고 싶은 책 종류별 학생 수", "도서관에 있는 책"], ok: "가로에 책 종류, 세로에 학생 수를 나타내고 눈금 한 칸을 1명으로 정해 막대그래프를 완성했어요!" }) },
    { name: "그려 보기 — 공학 도구로", inst: "태오가 태블릿의 그래프 도구를 가져왔어요. 표에 수를 넣으면 막대그래프가 바로 그려져요. 간격(눈금 한 칸의 크기)과 그래프 형태를 바꾸어 보세요.", hints: ["조사한 표의 수 6, 9, 5, 4를 넣어요.", "간격을 바꾸고, 가로형도 눌러 봐요."],
      render: (b, a) => b5Tool(b, a, { g: B5S.book, ok: "간격을 바꾸면 막대의 칸 수가 달라지고, 가로형으로 바꾸면 막대가 가로로 그려져요. 그래도 나타내는 자료는 같아요." }) },
    { name: "말해 보기 — 두 반 견주기", inst: "우리 반(2반)과 1반의 막대그래프를 견주어 보세요.", hints: ["같은 책끼리 막대의 길이를 견주어요.", "1반은 동화책과 만화책 막대의 길이가 같아요."],
      render: thenWhy((b, a) => b5Ask(b, a, [
        { fig: () => b5Figs([{ lead: "4학년 2반(우리 반)", g: B5S.book }, { lead: "4학년 1반", g: B5S.book1 }]), q: "우리 반에서 가장 많은 학생이 빌리고 싶은 책은?", t: "pick", o: B5S.book.cats, a: 1 },
        { q: "1반에서 빌리고 싶은 학생 수가 같은 책을 모두 고르세요.", t: "pick", o: B5S.book.cats, a: [0, 1] },
        { q: "우리 반에서 만화책을 빌리고 싶은 학생은 역사책보다 몇 명 더 많나요?", t: "num", a: 5, unit: "명", why: { "13": "더하지 말고 차이를 구해요." } },
        { q: "두 반 모두 가장 적은 학생이 빌리고 싶은 책은?", t: "pick", o: B5S.book.cats, a: 3 }],
        { ok: "두 막대그래프를 견주어 같은 점과 다른 점을 찾았어요." }),
        { q: "같은 질문으로 조사했는데 두 반의 결과가 다른 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 두 반에서 조사한 사람이 누구였는지 생각해요. → ② 친구들이 좋아하는 것이 반마다 같을지 생각해요.", "‘왜냐하면 조사한 ~이 달라서 ~이 다르기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 조사한 친구들이 달라서 빌리고 싶은 책도 반마다 다르기 때문이에요." }) },
    { name: "약속하기 — 그래프로 결정하기", inst: "도서관에 새 책을 한 종류만 더 사 달라고 부탁하려고 해요. 막대그래프에 근거한 말을 완성해 보세요.", hints: ["우리 반에서 막대가 가장 긴 책을 찾아요.", "근거는 그래프에서 알 수 있는 사실이에요."],
      render: (b, a) => { b.append(b5Fig(B5S.book, { tip: false })); blanks(b, a, ["우리 반에서는 ", { o: ["만화책", "역사책", "과학책"], a: 0 }, "을 빌리고 싶은 학생이 9명으로 가장 많아요. 그래서 새 책으로 ", { o: ["만화책", "역사책"], a: 0 }, "을 부탁하면 좋겠어요. 이렇게 결정할 때는 막대그래프에서 알 수 있는 ", { o: ["사실", "짐작"], a: 0 }, "을 근거로 들어요."], { ok: "그래프에서 찾은 사실을 근거로 결정했어요. 가장 적은 역사책을 늘려 친구들이 더 읽게 하자는 의견도 사실에 근거하면 좋은 의견이에요." }); } },
    { name: "확인하기 — 기사 쓰기", inst: "우리 반 막대그래프로 학급 신문 기사를 써 보세요.",
      render: (b, a) => { b.append(b5Fig(B5S.book, { tip: false })); writeStep(b, a, [
        { q: "기사 제목을 써 보세요.", tag: "제목", ph: "예) 우리 반은 ○○○을 가장 빌리고 싶어요", help: ["① 막대가 가장 긴 책을 찾아요. → ② 그 사실이 드러나게 짧게 써요.", "‘우리 반 ~ 친구들이 가장 빌리고 싶은 책은 ~!’ 꼴로 써요."], ans: "우리 반 친구들이 가장 빌리고 싶은 책은 만화책!" },
        { q: "막대그래프에서 알 수 있는 사실을 두 가지 써 보세요.", tag: "기사 내용", ph: "예) 만화책을 빌리고 싶은 학생이 …", help: ["① 가장 많은 것과 가장 적은 것을 찾아요. → ② 학생 수도 함께 써요.", "‘~을 빌리고 싶은 학생이 ~명으로 가장 많고, ~은 ~명으로 가장 적어요.’ 꼴로 써요."], ans: "만화책을 빌리고 싶은 학생이 9명으로 가장 많고, 역사책은 4명으로 가장 적어요." }]); } }
  ],
  challenge: { inst: "급식 기사예요. ‘먹고 싶은 급식 메뉴’를 조사한 표를 보고, 많이 먹고 싶어 하는 메뉴부터 위에서 차례대로 막대가 가로인 막대그래프로 나타내 보세요.", hints: ["가장 많은 짜장면(11명)을 맨 위에 써요.", "막대 이름을 고른 다음 막대의 길이를 맞춰요."],
    render: (b, a) => b5Build(b, a, { g: B5S.lunch, nameBlank: [0, 1, 2, 3], nameOptions: ["카레", "잔치국수", "짜장면", "비빔밥"], nameWhy: "많이 먹고 싶어 하는 메뉴부터 위에서 차례대로 써요.", stepChoices: [5, 1, 2],
      table: { cats: ["카레", "잔치국수", "짜장면", "비빔밥"], vals: [7, 2, 11, 4], head: "메뉴", row: "학생 수(명)" }, ok: "짜장면, 카레, 비빔밥, 잔치국수 순서로 막대그래프를 완성했어요!" }) }
},
{
  id: "r7", no: 7, title: "그래프로 기사를 써요 ― 사실과 의견", soop: "탐구 정리하기(O)",
  question: "막대그래프에서 찾은 사실로 어떻게 기사를 쓸 수 있을까요?",
  summary: "막대그래프에서 가장 많은 것, 가장 적은 것, 차이, 두 그래프의 관계 같은 통계적 사실을 찾을 수 있어요. 기사에는 사실을 먼저 쓰고, 사실을 근거로 내 생각(의견)을 써요.",
  steps: [
    { name: "만져 보기 — 두 막대그래프 견주기", inst: "도현이는 4월부터 7월까지 날마다 아침에 학교 앞 보관대의 자전거를 세어 달마다 모두 더했어요. 같은 달의 비 온 날수와 함께 막대그래프로 나타냈어요.", hints: ["두 그래프에서 막대가 가장 긴 달을 각각 찾아요.", "자전거 그래프의 세로 눈금 한 칸은 20대예요."],
      render: thenWhy((b, a) => b5Ask(b, a, [
        { fig: () => b5Figs([{ g: B5S.rain }, { g: B5S.bikeMon }]), q: "비 온 날이 가장 많은 달은?", t: "pick", o: B5S.rain.cats, a: 3 },
        { q: "보관대에 세워진 자전거가 가장 많은 달은?", t: "pick", o: B5S.rain.cats, a: 0 },
        { q: "6월에 보관대에 세워진 자전거는 몇 대인가요?", t: "num", a: 300, unit: "대", why: { "15": "6월 막대는 15칸이고 세로 눈금 한 칸은 20대예요.", "150": "세로 눈금 한 칸은 10대가 아니라 20대예요." } },
        { q: "두 그래프를 보고 알 수 있는 관계로 알맞은 것은?", t: "pick", o: ["비 온 날이 많은 달일수록 보관대의 자전거 수가 적어요.", "비 온 날이 많은 달일수록 보관대의 자전거 수가 많아요."], a: 0 }],
        { ok: "비 온 날이 늘수록 자전거 수가 줄었어요. 두 막대그래프를 견주어 관계를 찾았어요!" }),
        { q: "비 온 날이 많은 달에 자전거가 적은 까닭을 생각해 써 보세요.", ph: "왜냐하면 ~", help: ["① 비가 오는 날 학교에 어떻게 오는지 떠올려요. → ② 그 생각을 그래프의 사실과 이어요.", "‘비가 오는 날에는 ~ 때문에 자전거를 ~ 것 같아요.’ 꼴로 써요."], ans: "비가 오는 날에는 미끄럽고 위험해서 자전거 대신 걸어오거나 차를 타고 오는 친구가 많기 때문인 것 같아요." }) },
    { name: "그려 보기 — 기사 글 완성하기", inst: "윤서가 4학년 학생 120명에게 ‘우리 동네에서 고치고 싶은 것’을 물어 막대그래프로 나타냈어요. 알 수 있는 내용으로 기사 글을 완성해 보세요.", hints: ["막대가 가장 긴 것과 가장 짧은 것을 찾아요.", "세로 눈금 한 칸은 2명이에요."],
      render: (b, a) => { b.append(b5Fig(B5S.town)); blanks(b, a, ["4학년 학생들이 우리 동네에서 가장 고치고 싶은 것은 ", { o: ["보관대 부족", "쓰레기", "위험한 길"], a: 0 }, "이고, 가장 적은 학생이 고른 것은 ", { o: ["낡은 놀이터", "쓰레기", "어두운 길"], a: 1 }, "입니다. 두 번째로 많은 학생이 고른 것은 ", { o: ["위험한 길", "낡은 놀이터", "어두운 길"], a: 0 }, "이고 ", { o: ["30", "15", "24"], a: 0 }, "명입니다."], { ok: "막대그래프에서 찾은 사실로 기사 글을 완성했어요." }); } },
    { name: "말해 보기 — 사실과 의견 나누기", inst: "기자단이 기사에 쓰려고 모은 문장이에요. 그래프에서 알 수 있는 사실과, 사실을 보고 든 생각(의견)으로 나누어 보세요.", hints: ["그래프의 수나 막대 길이로 확인할 수 있으면 사실이에요.", "‘~하면 좋겠어요’, ‘~해야 해요’는 내 생각이에요."],
      render: (b, a) => b5Sort(b, a, { bins: ["그래프에서 알 수 있는 사실", "사실을 보고 든 생각(의견)"], cards: [
        { t: "보관대 부족을 고른 학생이 36명으로 가장 많아요.", b: 0 }, { t: "동네에 자전거 보관대를 더 만들면 좋겠어요.", b: 1 },
        { t: "낡은 놀이터를 고른 학생 수는 쓰레기의 2배예요.", b: 0 }, { t: "어두운 길을 고른 학생은 18명이에요.", b: 0 },
        { t: "위험한 길에는 어른들이 함께 다녀야 해요.", b: 1 }],
        ok: "막대그래프에서 알 수 있는 통계적 사실과 그 사실을 보고 든 의견을 구분했어요. 의견을 말할 때는 사실을 근거로 들어요." }) },
    { name: "약속하기 — 사실과 의견", inst: "기사를 쓰는 약속을 완성해요.", hints: ["수나 막대의 길이로 확인할 수 있는지 생각해요."],
      render: (b, a) => blanks(b, a, ["막대그래프의 수나 막대의 길이로 확인할 수 있는 것은 ", { o: ["사실", "의견"], a: 0 }, "이에요. 사실을 보고 ‘~하면 좋겠어요’처럼 든 생각은 ", { o: ["의견", "사실"], a: 0 }, "이에요. 기사에 의견을 쓸 때는 그래프에서 찾은 ", { o: ["사실", "짐작"], a: 0 }, "을 근거로 들어요."]) },
    { name: "확인하기 — 내 기사 쓰기", inst: "‘우리 동네에서 고치고 싶은 것’ 막대그래프로 기사를 한 편 써 보세요.",
      render: (b, a) => { b.append(b5Fig(B5S.town, { tip: false })); writeStep(b, a, [
        { q: "그래프에서 알 수 있는 사실을 써 보세요.", tag: "사실", ph: "예) 가장 많은 학생이 고치고 싶은 것은 …", help: ["① 가장 많은 것이나 두 막대의 차이를 찾아요. → ② 학생 수를 넣어 써요.", "‘~을 고른 학생이 ~명으로 가장 많아요.’ 꼴로 써요."], ans: "보관대 부족을 고른 학생이 36명으로 가장 많고, 쓰레기를 고른 학생이 12명으로 가장 적어요." },
        { q: "사실을 근거로 내 의견을 써 보세요.", tag: "의견", ph: "예) 그래서 …하면 좋겠어요.", help: ["① 위에 쓴 사실을 떠올려요. → ② 그 사실 때문에 무엇을 하면 좋을지 생각해요.", "‘~ 학생이 가장 많으므로 ~하면 좋겠어요.’ 꼴로 써요."], ans: "보관대가 부족하다고 생각하는 학생이 가장 많으므로 동네에 자전거 보관대를 더 만들면 좋겠어요." }]); } }
  ],
  challenge: { inst: "‘우리 동네에서 고치고 싶은 것’ 막대그래프를 보고 물음에 답해 보세요.", hints: ["세로 눈금 한 칸은 2명이에요.", "몇 배는 큰 수가 작은 수의 몇 번만큼인지 생각해요."],
    render: (b, a) => b5Ask(b, a, [
      { fig: () => b5Fig(B5S.town), q: "보관대 부족을 고른 학생 수는 쓰레기를 고른 학생 수의 몇 배인가요?", t: "num", a: 3, unit: "배", why: { "24": "36−12=24는 차이예요. 36은 12의 몇 배인지 생각해요." } },
      { q: "위험한 길을 고른 학생은 어두운 길보다 몇 명 더 많나요?", t: "num", a: 12, unit: "명", why: { "6": "막대 길이가 6칸 차이 나요. 한 칸이 2명이에요." } },
      { q: "낡은 놀이터와 어두운 길을 고른 학생은 모두 몇 명인가요?", t: "num", a: 42, unit: "명", why: { "21": "막대의 칸 수를 더한 21칸이에요. 한 칸이 2명이에요." } }],
      { ok: "막대그래프에서 몇 배, 차이, 합을 정확하게 알아냈어요!" }) }
},
{
  id: "r8", no: 8, title: "생각을 더하다 ― 우리 동네 지도 기사", soop: "탐구 정리하기(O)",
  question: "지도 속 자료를 막대그래프로 나타내면 우리 동네를 어떻게 소개할 수 있을까요?",
  summary: "지도에 있는 기호의 수를 세어 표로 정리하고 막대그래프로 나타내면, 어떤 장소가 많고 적은지 한눈에 보여요. 막대그래프에서 찾은 사실로 동네를 소개하는 기사를 쓸 수 있어요.",
  steps: [
    { name: "만져 보기 — 지도 기호 세기", inst: "기자단이 우리 동네 지도를 만들었어요. 지도에 표시된 장소를 나타내는 기호의 수를 세어 표로 나타내 보세요.", hints: ["한 가지 기호씩 차례로 세어요. 센 기호를 누르면 표시가 생겨요.", "합계는 다섯 가지 장소의 수를 모두 더한 수예요."],
      render: (b, a) => b5Map(b, a, { seed: 17, kinds: [{ kind: "bike", name: "자전거 보관대", n: 9 }, { kind: "park", name: "공원", n: 5 }, { kind: "hospital", name: "병원", n: 4 }, { kind: "library", name: "도서관", n: 3 }, { kind: "school", name: "학교", n: 2 }], ok: "자전거 보관대 9개, 공원 5개, 병원 4개, 도서관 3개, 학교 2개, 모두 23개예요." }) },
    { name: "그려 보기 — 막대그래프로", inst: "우리 동네 장소별 수를 막대그래프로 나타내고 알맞은 제목을 골라 보세요.", hints: ["세로 눈금 한 칸은 1개예요.", "자전거 보관대는 9칸만큼 세워요."],
      render: (b, a) => b5Build(b, a, { g: B5S.place, titleChoices: ["우리 반 학생 수", "장소별 수", "좋아하는 장소"], ok: "우리 동네의 장소별 수를 막대그래프로 나타냈어요. 자전거 보관대가 가장 많아요!" }) },
    { name: "말해 보기 — 표와 그래프 중에서", inst: "동네 소개 기사에 표와 막대그래프 가운데 하나만 실을 수 있어요. 무엇을 실으면 좋을지 골라 보세요.", hints: ["독자가 무엇을 한눈에 알고 싶어 할지 생각해요.", "어느 장소가 가장 많은지는 막대의 길이로 바로 보여요."],
      render: thenWhy((b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5S.place, { tip: false }), q: "우리 동네에 어떤 장소가 많은지 한눈에 보여 주려면 무엇을 실으면 좋을까요?", t: "pick", o: ["막대그래프", "표"], a: 0, why: { "1": "표는 수를 정확하게 알려 주지만, 많고 적음을 한눈에 견주기에는 막대그래프가 편리해요." } },
        { q: "모든 장소의 수를 합한 수를 알려 주려면 무엇이 편리할까요?", t: "pick", o: ["막대그래프", "표"], a: 1, why: { "0": "막대그래프에는 합계가 나와 있지 않아요. 표에는 합계 칸이 있어요." } }],
        { ok: "많고 적음을 한눈에 보이려면 막대그래프, 합계를 알리려면 표가 편리해요." }),
        { q: "동네 소개 기사에 막대그래프를 고른 까닭을 써 보세요.", ph: "왜냐하면 ~", help: ["① 막대그래프에서 바로 보이는 것을 떠올려요. → ② 독자에게 무엇이 좋은지 이어서 써요.", "‘왜냐하면 막대그래프는 ~을 한눈에 볼 수 있기 때문이에요.’ 꼴로 써요."], ans: "왜냐하면 막대그래프는 어떤 장소가 많고 적은지 막대의 길이로 한눈에 볼 수 있기 때문이에요." }) },
    { name: "약속하기 — 소개 기사 완성하기", inst: "막대그래프를 보고 우리 동네를 소개하는 기사를 완성해 보세요.", hints: ["막대가 가장 긴 장소와 두 번째로 긴 장소를 찾아요.", "도서관은 3개, 학교는 2개예요."],
      render: (b, a) => { b.append(b5Fig(B5S.place)); blanks(b, a, ["우리 동네에는 자전거를 타는 사람이 많아서 가장 많은 곳은 ", { o: ["자전거 보관대", "공원", "학교"], a: 0 }, "입니다. 두 번째로 많은 곳은 ", { o: ["병원", "공원", "도서관"], a: 1 }, "입니다. 책을 읽을 수 있는 도서관은 ", { o: ["2", "3", "4"], a: 1 }, "개 있습니다. 가장 적은 곳은 ", { o: ["학교", "병원"], a: 0 }, "입니다. 우리 동네에 한번 놀러 오세요!"], { ok: "막대그래프에서 찾은 사실로 동네 소개 기사를 완성했어요." }); } },
    { name: "확인하기 — 제안 기사 쓰기", inst: "막대그래프를 보고 우리 동네에 무엇이 더 있으면 좋을지 제안하는 기사를 써 보세요.",
      render: (b, a) => { b.append(b5Fig(B5S.place, { tip: false })); writeStep(b, a, [
        { q: "그래프에서 알 수 있는 사실을 써 보세요.", tag: "사실", ph: "예) 우리 동네에는 학교가 …", help: ["① 가장 적은 장소나 가장 많은 장소를 찾아요. → ② 개수를 함께 써요.", "‘우리 동네에는 ~이 ~개로 가장 적어요.’ 꼴로 써요."], ans: "우리 동네에는 학교가 2개로 가장 적고, 자전거 보관대가 9개로 가장 많아요." },
        { q: "사실을 근거로 제안하는 글을 써 보세요.", tag: "제안", ph: "예) 그래서 …이 더 있으면 좋겠어요.", help: ["① 위에 쓴 사실에서 부족해 보이는 것을 골라요. → ② 왜 필요한지 함께 써요.", "‘~이 ~개뿐이므로 ~을 더 만들면 좋겠어요.’ 꼴로 써요."], ans: "도서관이 3개뿐이므로 책을 읽을 수 있는 작은 도서관을 더 만들면 좋겠어요." }]); } }
  ],
  challenge: { inst: "옆 동네 지도예요. 장소를 나타내는 기호의 수를 세어 표로 나타내 보세요.", hints: ["센 기호를 누르면 표시가 생겨 빠뜨리지 않아요.", "모두 18개예요."],
    render: (b, a) => b5Map(b, a, { seed: 41, kinds: [{ kind: "bike", name: "자전거 보관대", n: 3 }, { kind: "park", name: "공원", n: 6 }, { kind: "hospital", name: "병원", n: 2 }, { kind: "library", name: "도서관", n: 4 }, { kind: "school", name: "학교", n: 3 }], ok: "자전거 보관대 3개, 공원 6개, 병원 2개, 도서관 4개, 학교 3개, 모두 18개예요. 옆 동네는 공원이 가장 많아요." }) }
},
{
  id: "r9", no: 9, title: "놀이를 더하다 ― 체육 시간 풍선 기록 기사", soop: "발표하기(P)",
  question: "놀이 기록을 막대그래프로 나타내면 무엇을 알 수 있을까요?",
  summary: "신체 부위별로 풍선을 띄운 횟수를 표로 정리하고 막대그래프로 나타내면, 어느 부위로 가장 많이 띄웠는지, 다른 모둠과 어떻게 다른지 한눈에 알 수 있어요.",
  steps: [
    { name: "만져 보기 — 풍선 띄우기 놀이", inst: "체육 시간에 모둠별로 풍선 띄우기 놀이를 했어요. 손바닥, 머리, 어깨, 무릎의 순서대로 풍선을 띄우고 횟수를 세요. 화면에서는 떨어지는 풍선을 눌러 띄워요.", hints: ["▶ 시작을 누르고 풍선을 눌러요.", "놀이가 어려우면 ‘예시 기록으로 하기’를 눌러요."],
      render: (b, a) => b5Balloon(b, a, { parts: ["손바닥", "머리", "어깨", "무릎"], sec: 15, demo: [21, 14, 9, 12] }) },
    { name: "그려 보기 — 표로 정리하기", inst: "태오네 모둠이 1분 동안 풍선을 띄운 횟수를 다섯 개씩 묶어 셌어요. 빨간 사선이 있는 묶음 하나가 5회예요. 세어서 표를 완성해 보세요.", hints: ["묶음 하나는 5회예요. 묶음 수를 먼저 세요.", "합계는 네 부위의 횟수를 모두 더해요."],
      render: (b, a) => b5Table(b, a, { fig: () => b5TallyFig(B5S.bal.cats, B5S.bal.vals, "태오네 모둠의 기록"), title: B5S.bal.title, head: "신체 부위", row: "횟수(회)", cats: B5S.bal.cats, vals: B5S.bal.vals, blanks: [0, 1, 2, 3, "sum"], ok: "손바닥 24회, 머리 16회, 어깨 8회, 무릎 14회, 합계 62회예요." }) },
    { name: "말해 보기 — 막대그래프로 나타내기", inst: "표를 보고 막대그래프로 나타내요. 세로 눈금은 12칸이에요. 눈금 한 칸의 크기를 정하고 알맞은 제목을 골라 보세요.", hints: ["가장 큰 수는 24회예요. 12칸으로 24회까지 나타내려면?", "한 칸이 2회이면 손바닥 24회는 12칸이에요."],
      render: (b, a) => b5Build(b, a, { g: B5S.bal, stepChoices: [1, 2, 5], titleChoices: ["신체 부위별 풍선을 띄운 횟수", "우리 모둠 친구 이름", "좋아하는 풍선 색깔"], ok: "놀이 기록을 막대그래프로 나타냈어요!" }) },
    { name: "약속하기 — 다른 모둠과 견주기", inst: "서아네 모둠의 막대그래프와 견주어 보세요. 두 그래프의 눈금 한 칸은 모두 2회예요.", hints: ["같은 신체 부위끼리 막대의 길이를 견주어요.", "서아네 모둠에서 가장 긴 막대를 찾아요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Figs([{ lead: "태오네 모둠", g: B5S.bal }, { lead: "서아네 모둠", g: B5S.bal2 }]), q: "머리로 풍선을 더 많이 띄운 모둠은 어느 모둠인가요?", t: "pick", o: ["태오네 모둠", "서아네 모둠"], a: 1 },
        { q: "손바닥으로 띄운 횟수는 두 모둠이 몇 회 차이 나나요?", t: "num", a: 6, unit: "회", why: { "3": "막대 길이가 3칸 차이 나요. 한 칸이 2회예요." } },
        { q: "서아네 모둠이 가장 많이 띄운 신체 부위는?", t: "pick", o: B5S.bal.cats, a: 1 },
        { q: "두 막대그래프를 보고 알 수 있는 사실은?", t: "pick", o: ["두 모둠 모두 어깨로 가장 적게 띄웠어요.", "두 모둠 모두 손바닥으로 가장 많이 띄웠어요."], a: 0, why: { "1": "서아네 모둠은 머리 막대가 가장 길어요." } }],
        { ok: "두 모둠의 막대그래프를 견주어 같은 점과 다른 점을 찾았어요!" }) },
    { name: "확인하기 — 체육 기사 발표하기", inst: "풍선 띄우기 기록으로 학급 신문 체육 기사를 써서 발표해 보세요.",
      render: (b, a) => { b.append(b5Figs([{ lead: "태오네 모둠", g: B5S.bal }, { lead: "서아네 모둠", g: B5S.bal2 }])); writeStep(b, a, [
        { q: "두 그래프에서 알 수 있는 사실을 써 보세요.", tag: "사실", ph: "예) 태오네 모둠은 …으로 가장 많이 띄웠어요.", help: ["① 모둠마다 막대가 가장 긴 부위를 찾아요. → ② 횟수를 함께 써요.", "‘~네 모둠은 ~으로 ~회, ~네 모둠은 ~로 ~회 띄워 가장 많았어요.’ 꼴로 써요."], ans: "태오네 모둠은 손바닥으로 24회, 서아네 모둠은 머리로 20회 띄워 가장 많았어요." },
        { q: "다음 놀이에서 기록을 늘리려면 어떻게 하면 좋을까요?", tag: "의견", ph: "예) 어깨로 띄우는 연습을 …", help: ["① 두 모둠 모두 적었던 부위를 찾아요. → ② 그 부위를 어떻게 연습할지 써요.", "‘두 모둠 모두 ~로 가장 적게 띄웠으므로 ~하면 좋겠어요.’ 꼴로 써요."], ans: "두 모둠 모두 어깨로 가장 적게 띄웠으므로 다음에는 어깨로 띄우는 연습을 더 하면 좋겠어요." }]); } }
  ],
  challenge: { inst: "또 다른 놀이예요. 책으로 여러 종류의 공을 1분 동안 띄운 횟수를 막대그래프로 나타내요. 세로 눈금은 15칸이에요. 눈금 한 칸의 크기를 정해 보세요.", hints: ["가장 큰 수는 30회예요. 15칸으로 30회까지 나타내려면?", "한 칸이 2회이면 탁구공 8회는 4칸이에요."],
    render: (b, a) => b5Build(b, a, { g: B5S.ball, stepChoices: [1, 2, 5, 10], ok: "가장 큰 수 30회를 15칸에 나타내도록 눈금 한 칸을 2회로 정했어요!" }) }
},
{
  id: "r10", no: 10, title: "학급 신문을 펴내요 ― 공부한 내용 확인", soop: "발표하기(P)",
  question: "막대그래프를 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
  summary: "막대그래프는 조사한 자료의 수량을 막대 모양으로 나타낸 그래프예요. 가로와 세로, 눈금 한 칸의 크기를 확인하고 읽으며, 막대그래프에서 찾은 사실을 근거로 기사를 쓰고 결정할 수 있어요.",
  steps: [
    { name: "만져 보기 — 방과 후 수업 기사", inst: "학급 신문 마지막 호에 실을 ‘방과 후 수업별 신청한 학생 수’ 막대그래프예요.", hints: ["세로 눈금 5칸이 10명이에요.", "10명을 5칸으로 나누면 한 칸은?"],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5S.after), q: "막대그래프의 가로와 세로는 각각 무엇을 나타내나요?", t: "pick", o: ["가로: 수업, 세로: 학생 수", "가로: 학생 수, 세로: 수업"], a: 0 },
        { q: "세로 눈금 한 칸은 몇 명을 나타내나요?", t: "num", a: 2, unit: "명", why: { "1": "세로 눈금 5칸이 10명이에요. 한 칸이 1명이 아니에요.", "10": "10명은 눈금 5칸이 나타내는 수예요.", "5": "5는 0과 10 사이의 칸 수예요." } },
        { q: "요리 수업을 신청한 학생은 몇 명인가요?", t: "num", a: 24, unit: "명", why: { "12": "요리 막대는 12칸이고 한 칸은 2명이에요." } }],
        { ok: "가로는 수업, 세로는 학생 수예요. 세로 눈금 한 칸은 10÷5=2(명)이에요." }) },
    { name: "그려 보기 — 옳은 설명 찾기", inst: "기사에 쓸 문장이 맞는지 확인해요. 옳으면 ○, 옳지 않으면 ×를 골라 보세요.", hints: ["세로 눈금 한 칸은 2명이에요.", "로봇 막대는 9칸, 댄스는 7칸이에요."],
      render: (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5S.after), q: "신청한 학생 수가 가장 적은 수업은 바둑입니다.", t: "ox", a: true },
        { q: "댄스 수업을 신청한 학생은 7명입니다.", t: "ox", a: false, why: { "o": "세로 눈금 한 칸이 몇 명을 나타내는지 다시 확인해 봐요. 댄스 막대는 7칸이에요." } },
        { q: "요리 수업을 신청한 학생은 로봇 수업보다 6명 더 많습니다.", t: "ox", a: true, why: { "x": "요리는 24명, 로봇은 18명이에요. 24−18을 계산해 봐요." } }],
        { ok: "댄스는 14명이라 두 번째 설명이 틀렸어요. 요리 24명은 로봇 18명보다 6명 더 많아요." }) },
    { name: "말해 보기 — 표와 막대그래프 완성하기", inst: "독자 설문으로 ‘읽고 싶은 신문 코너’를 조사했어요(24명). 표의 빈칸을 채우고, 축 이름과 막대 이름을 고른 뒤 운동 소식·인터뷰의 막대를 그려 보세요.", hints: ["퀴즈 = 24−7−5−4−2예요. 그래프의 퀴즈 막대도 세어 봐요.", "4칸 막대는 급식 소식, 7칸 막대는 만화예요."],
      render: (b, a) => b5Build(b, a, { g: B5S.corner, lock: [1, 2, 3], nameBlank: [1, 2], nameOptions: ["운동 소식", "급식 소식", "만화", "퀴즈", "인터뷰"], axisPick: true, nameWhy: "이미 그려진 막대가 몇 칸인지 세어 표의 수와 견주어 봐요.",
        table: { cats: ["만화", "운동 소식", "급식 소식", "퀴즈", "인터뷰"], vals: [7, 5, 4, 6, 2], head: "코너", row: "학생 수(명)", blanks: [3] }, ok: "퀴즈 코너는 6명이에요. 표와 막대그래프를 모두 완성했어요!" }) },
    { name: "약속하기 — 신문 배달 미로", inst: "완성한 막대그래프에 대한 설명이 옳으면 ‘옳음’ 길로, 옳지 않으면 ‘틀림’ 길로 가서 신문을 배달할 곳을 찾아보세요.", hints: ["막대가 가로인 그래프예요. 세로에는 코너가 있어요.", "인터뷰 막대는 2칸이고 가로 눈금 한 칸은 1명이에요."],
      render: (b, a) => b5Maze(b, a, { fig: () => b5Fig(B5S.corner, { tip: false }), goal: "교장실", ok: "신문을 교장실에 배달했어요! 막대그래프를 정확하게 읽었어요.", stmts: [
        { t: "막대그래프의 세로에 나타낸 것은 학생 수입니다.", a: false, dead: "보건실", why: "막대가 가로인 그래프라 세로에는 코너가, 가로에는 학생 수가 있어요." },
        { t: "가로 눈금 한 칸은 1명을 나타냅니다.", a: true, dead: "급식실", why: "눈금마다 0, 1, 2, …로 1씩 커져요. 한 칸은 1명이에요." },
        { t: "가장 많은 학생이 읽고 싶어 하는 코너는 만화입니다.", a: true, dead: "과학실", why: "만화 막대가 7칸으로 가장 길어요." },
        { t: "인터뷰를 읽고 싶어 하는 학생은 4명입니다.", a: false, dead: "도서관", why: "인터뷰 막대는 2칸이에요. 4명은 급식 소식이에요." }] }) },
    { name: "확인하기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.", hints: ["막대그래프를 배우기 전의 생각을 떠올려요.", "눈금 한 칸의 크기, 가로와 세로, 사실과 의견을 떠올려요."],
      render: wonderRecall((b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "막대그래프를 배우기 전의 생각", ex: ["예전에는 조사한 자료를 표로만 나타내면 된다고 생각했어요.", "예전에는 눈금 한 칸은 언제나 1이라고 생각했어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "배운 뒤에 바뀐 생각", ex: ["지금은 막대그래프로 나타내면 많고 적음을 한눈에 볼 수 있다고 생각해요.", "지금은 눈금 한 칸의 크기를 먼저 확인해야 한다고 생각해요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "어떤 활동 때문에 바뀌었나요?", ex: ["아침 식사 그래프에서 한 칸이 2명인 것을 읽어 보고 바뀌었어요.", "우리 반 책 조사를 막대그래프로 그려 기사를 써 보고 바뀌었어요."] }],
        { ok: "생각이 자란 것을 잘 보여 주었어요! 친구들 쪽지와 견주어 봐요." })) }
  ],
  challenge: { inst: "마인드맵 — ‘막대그래프’를 정리해요. 떠오르는 말을 모으고, 묶고, 이어 보세요.", hints: ["가로, 세로, 눈금 한 칸의 크기, 막대의 길이, 제목, 표, 합계", "가장 큰 수까지 나타낼 수 있게 눈금 한 칸의 크기를 정해요.", "사실을 근거로 의견을 말해요."],
    render: withOptional(
      (b, a) => panes(b, a, [
        { t: "떠오르는 말", e: "🧠", ph: "막대그래프 → ~", hint: "가로, 세로, 눈금, 제목…", ex: ["막대그래프 → 가로, 세로, 눈금 한 칸의 크기", "막대그래프 → 막대의 길이, 제목, 기사"] },
        { t: "묶어 보기", e: "🗂", ph: "읽을 때: ~", hint: "비슷한 것끼리 묶어요", ex: ["읽을 때: 가로와 세로, 눈금 한 칸의 크기, 막대의 길이", "그릴 때: 가로와 세로 정하기, 눈금 정하기, 막대 그리기, 제목 쓰기"] },
        { t: "이어지는 말", e: "🔗", ph: "~와 ~는 이어져요", hint: "예: 가장 큰 수와 눈금 한 칸의 크기", ex: ["가장 큰 수와 눈금 한 칸의 크기는 이어져요.", "그래프에서 찾은 사실과 기사 속 의견은 이어져요."] },
        { t: "덧붙이는 말", e: "✏️", ph: "예를 들면 ~", hint: "예를 들거나 더 설명해요", ex: ["예를 들면 눈금 5칸이 10명이면 한 칸은 2명이에요.", "예를 들면 보관대 부족이 36명으로 가장 많아서 보관대를 더 만들자고 썼어요."] }],
        { min: 1, ok: "막대그래프를 한눈에 정리했어요. 「햇살 4-2 소식」 발행 완료!" }),
      (b, a) => b5Ask(b, a, [
        { fig: () => b5Fig(B5S.after), q: "새 방과 후 수업을 한 반 더 연다면 어느 수업이 좋을까요? 그래프에 근거한 것을 골라요.", t: "pick", o: ["요리 ― 신청한 학생이 24명으로 가장 많기 때문이에요.", "바둑 ― 이름이 가장 짧기 때문이에요."], a: 0 },
        { q: "요리 수업을 신청한 학생은 바둑 수업보다 몇 명 더 많나요?", t: "num", a: 14, unit: "명", why: { "34": "더하지 말고 차이를 구해요.", "7": "막대 길이가 7칸 차이 나요. 한 칸이 2명이에요." } },
        { q: "네 수업을 신청한 학생은 모두 몇 명인가요?", t: "num", a: 66, unit: "명" }],
        { ok: "막대그래프로 결정하고 계산까지 했어요!" }),
      { title: "더 해 보고 싶다면 — 선택 문제", inst: "방과 후 수업 막대그래프로 마지막 기사 질문에 답해 보세요." }) }
}
];
