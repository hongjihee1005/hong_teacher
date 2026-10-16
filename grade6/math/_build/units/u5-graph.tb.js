//@@APP
const APP={title:"또래 상담실 여러 가지 그래프", unit:"6-1 수학 5. 여러 가지 그래프(교과서)", key:"t61-graph-v1", welcome:"또래 상담실 여러 가지 그래프 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 또래 상담사 승아와 함께 학생들의 고민거리·상담 대상·듣고 싶은 말을 조사하고, 백분율만큼 띠와 원을 직접 나누어 띠그래프와 원그래프로 나타낸 뒤, 여러 가지 그래프를 해석하고 목적에 알맞은 그래프를 골라 봐요."};
//@@UNIT
/* =========================================================
   6-1 수학 5. 여러 가지 그래프 — 단원 조작 부품 (앞글자 gr5)
   그래프 g = { kind:"band"|"pie"|"bar"|"line"|"pic", title, items:[{n, p}], step:눈금 한 칸(%) }
   띠·원그래프는 그리기 전에 gr5Chk가 백분율의 합계가 100인지 꼭 확인해요(아니면 오류).
   gr5Graph   그래프 그리기(띠·원·막대·꺾은선·그림그래프, 부분을 누를 수 있음)
   gr5Pick    그래프의 부분을 눌러 답하기(여러 그래프·여러 개 고르기)
   gr5Draw    백분율만큼 선을 그어 띠·원 나누기 → 나눈 부분에 내용과 백분율 붙이기
   gr5Maker   공학 도구(표 → 합계·백분율 계산 → 띠·원그래프, 항목 정렬)
   gr5Survey  쪽지를 하나씩 읽고 칸에 표시하며 조사하기
   gr5Sort    특징 카드를 알맞은 그래프 칸에 넣기
   gr5Scaled  비율로 보기 / 실제 양으로 보기(전체의 양이 다른 띠그래프 견주기)
   gr5Bingo   그래프 빙고(친구와 번갈아 설명하기)     gr5Dice  주사위 두 눈의 수의 차 놀이
   gr5Ask     빈칸 고르기·수 쓰기   gr5Calc 화면 계산기   글 속 [1/2]은 세로 분수
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.gr5fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none}
.gr5figs{display:flex;flex-wrap:wrap;gap:.6em}.gr5figs>div{flex:1 1 300px;min-width:0}
.gr5figs.gr5three>div{flex:1 1 220px}
.gr5lead{font-family:Jua,sans-serif;color:var(--night);margin:.2em 0 0}
.gr5small{font-size:var(--fs-s);color:var(--muted)}
.gr5part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.gr5tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.gr5tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.gr5tbl th,.gr5tbl td{border:1.5px solid var(--line);padding:.25em .55em;text-align:center}
.gr5tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.gr5tbl input{width:5.5em;font-size:1em;text-align:center;max-width:100%}
.gr5tbl input.gr5nm{width:8.5em}
.gr5tbl td.gr5hi{background:#FFF1C7}
.gr5cap{font-family:Jua,sans-serif;margin-bottom:.15em}
.gr5read{font-family:"Jua",sans-serif;font-size:var(--fs);color:var(--night);line-height:1.5;word-break:keep-all;margin:.25em 0}
.gr5tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.4em 0}
.gr5tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em;font-size:var(--fs-s)}
.gr5tools button.gr5on{background:var(--night);color:#fff;border-color:var(--night)}
.gr5tools button.gr5go{background:#FFF1C7;border-color:#E2B64A;font-family:Jua,sans-serif;font-size:var(--fs)}
.gr5tools button:disabled{opacity:.45}
.gr5tools input{font-size:1em;max-width:100%;min-width:0}
.gr5box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all;margin:.3em 0}
.gr5q{font-family:Jua,sans-serif;color:var(--night);background:var(--ring-soft);border-radius:.6em;padding:.35em .7em;margin:.3em 0;word-break:keep-all}
.gr5fr{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;vertical-align:middle;font-size:.82em;line-height:1.05;margin:0 .12em;font-family:Jua,sans-serif}
.gr5fr>.gr5n{border-bottom:.11em solid currentColor;padding:0 .14em .06em}
.gr5fr>.gr5d{padding:.06em .14em 0}
.gr5pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:2.6em;margin:.3em 0 .5em;padding:.4em;border:2px dashed var(--line);border-radius:12px;background:#FBFCFB}
.gr5crd{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.3em .6em;text-align:left;word-break:keep-all;max-width:100%;font-size:var(--fs-s);line-height:1.4}
.gr5crd.gr5on{border-color:var(--ring);background:var(--ring-soft);box-shadow:0 0 0 2px var(--ring)}
.gr5crd.gr5good{border-color:var(--ok);background:#E3F4EA}
.gr5bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,11em),1fr));gap:.4em}
.gr5bin{border:2px dashed var(--line);border-radius:.8em;padding:.35em;min-height:6em;display:flex;flex-direction:column;gap:.3em;cursor:pointer;background:#fff;min-width:0}
.gr5binh{font-family:Jua,sans-serif;text-align:center;color:var(--night);word-break:keep-all}
.gr5bin .gr5crd{width:100%;font-size:.8em}
.gr5calc{display:inline-grid;grid-template-columns:repeat(4,3em);gap:.3em;background:#EEF2F1;border:2px solid var(--line);border-radius:12px;padding:.5em;margin:.3em 0}
.gr5calc .gr5disp{grid-column:1/-1;background:#fff;border:2px solid var(--line);border-radius:.4em;text-align:right;padding:.2em .4em;font-family:Jua,sans-serif;font-size:1.15em;min-height:1.6em;overflow:hidden;word-break:break-all}
.gr5calc button{border:2px solid var(--line);background:#fff;border-radius:.5em;padding:.3em 0;font-family:Jua,sans-serif;font-size:1.05em}
.gr5calc button.gr5op{background:#FFF1C7}
.gr5note{font-family:Jua,sans-serif;font-size:1.3em;background:#FFF8D6;border:2px solid #E8D28A;border-radius:.4em .4em 1.2em .4em;padding:.5em .9em;display:inline-block;box-shadow:3px 3px 0 #E8D28A;margin:.3em 0;word-break:keep-all}
.gr5vote{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,9.5em),1fr));gap:.4em;margin:.4em 0}
.gr5vb{border:2px solid var(--line);background:#fff;border-radius:.7em;padding:.4em;display:flex;flex-direction:column;align-items:center;gap:.2em;min-width:0;word-break:keep-all}
.gr5vb b{font-family:Jua,sans-serif;font-weight:400}
.gr5tally{font-family:Jua,sans-serif;color:#C0392B;letter-spacing:.06em;min-height:1.3em;word-break:break-all}
.gr5say{background:#FFF8EC;border-left:6px solid #E8B36A;border-radius:.6em;padding:.5em .8em;margin:.4em 0;word-break:keep-all;font-family:Jua,sans-serif}
.gr5say.gr5me{background:#EEF5FD;border-left-color:var(--ring)}
.gr5bingo{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.35em;max-width:46em}
.gr5cell{border:3px solid var(--line);border-radius:10px;background:#fff;padding:.1em;position:relative;cursor:pointer;min-width:0}
.gr5cell svg{width:100%;height:auto;display:block}
.gr5cell.gr5mk::after{content:"";position:absolute;left:12%;top:8%;width:76%;height:84%;box-sizing:border-box;border:.45em solid #E0533D;border-radius:50%;opacity:.8;pointer-events:none}
.gr5cell.gr5lt{border-color:var(--ring);box-shadow:0 0 0 3px var(--ring-soft)}
.gr5cell.gr5no{border-color:var(--no)}
.gr5fb{display:inline-grid;grid-template-columns:repeat(3,1.6em);gap:.2em;vertical-align:middle;margin-left:.4em}
.gr5fb span{width:1.6em;height:1.6em;border:2px solid var(--line);border-radius:.3em;background:#fff;display:grid;place-items:center;font-size:.8em;color:#E0533D;font-family:Jua,sans-serif}
.gr5opts{display:flex;flex-direction:column;gap:.35em;margin:.3em 0}
.gr5opts button{border:2px solid var(--line);background:#fff;border-radius:.7em;padding:.35em .7em;text-align:left;word-break:keep-all}
.gr5opts button:disabled{opacity:.5;text-decoration:line-through}
.gr5dice{display:flex;gap:.6em;align-items:center;flex-wrap:wrap}
.gr5dice svg{width:4.2em;height:4.2em}
.gr5leg{display:flex;flex-wrap:wrap;gap:.3em .9em;font-size:var(--fs-s);margin:.2em 0}
.gr5leg span{display:inline-flex;align-items:center;gap:.3em}
.gr5leg i{display:inline-block;width:1em;height:1em;border-radius:.2em;border:1px solid #0003}
`;
  document.head.append(s);
})();

const GR5 = { ink: "#1D2A2A", grid: "#DCE4E0", gray: "#7B8A8A", red: "#D64545", blue: "#2B7BD6", green: "#2E8B57", orange: "#E0662B", line: "#3B4A47" };
const GR5_COLS = ["#F6A89E", "#8FC3EA", "#A9D99B", "#F5D27B", "#C6B2E8", "#F7BC8C", "#9BD8CF", "#E9C7A8"];
const GR5_ETC = "#DADFDD";

/* ---------- 세로 분수: 글 속 [1/2] → 분수 모양 ---------- */
function gr5FracEl(n, d) { return h("span", { class: "gr5fr" }, h("span", { class: "gr5n" }, String(n)), h("span", { class: "gr5d" }, String(d))); }
function gr5RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("[") < 0 || s.indexOf("/") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = /\[(\d+)\/(\d+)\]/g; let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(gr5FracEl(m[1], m[2])); last = m.index + m[0].length; }
  if (!any) return; if (last < s.length) frag.append(s.slice(last)); p.replaceChild(frag, node);
}
function gr5RenderNode(n) {
  if (!n) return; if (n.nodeType === 3) return gr5RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT), list = []; while (tw.nextNode()) list.push(tw.currentNode); list.forEach(gr5RenderText);
}
const gr5Plain = s => String(s == null ? "" : s).replace(/\[(\d+)\/(\d+)\]/g, "$1/$2");
(function gr5Boot() {
  try { new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") gr5RenderText(m.target); else m.addedNodes.forEach(gr5RenderNode); } })
    .observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (e) { }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(String(t).replace(/\[(\d+)\/(\d+)\]/g, "$2분의 $1").replace(/ %/g, " 퍼센트")); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();

/* ---------- 조사·수 ---------- */
function gr5Jo(w, pair) {
  const s = String(w).replace(/[\s’‘'"”“)\]」』]+$/g, ""), [a, b] = pair.split("/"), c = s.slice(-1);
  let bat = false, rieul = false;
  if (c === "%") bat = false;
  else if (/[0-9]/.test(c)) { bat = "013678".includes(c); rieul = "178".includes(c); }
  else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  if (pair === "으로/로") return bat && !rieul ? "으로" : "로";
  return bat ? a : b;
}
const gr5J = (w, pair) => String(w) + gr5Jo(w, pair);
const gr5F = v => String(Math.round(v * 1000) / 1000);
const gr5P = p => `${gr5F(p)} %`;
function gr5Num(s) {
  let t = String(s == null ? "" : s).replace(/[\s,]/g, "");
  t = t.replace(/(%|명|개|건|번|배|그루|천명|만t)$/i, "");
  return t === "" || !/^-?\d+(\.\d+)?$/.test(t) ? NaN : Number(t);
}
/* 정해진 차례로 섞기(같은 자료면 언제나 같은 차례) */
function gr5Mix(arr, seed) { const a = arr.slice(); let x = seed || 7; for (let i = a.length - 1; i > 0; i--) { x = (x * 1103515245 + 12345) % 2147483648; const j = x % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const gr5Rand = n => Math.floor(Math.random() * n);

/* ---------- 그래프 자료 ---------- */
const gr5G = (kind, title, list, step) => ({ kind, title, step: step || 1, items: list.map(([n, p, c]) => ({ n, p, c })) });
function gr5Chk(g) {
  const s = Math.round(g.items.reduce((a, it) => a + it.p * 10, 0));
  if (s !== 1000) throw new Error(`백분율의 합계가 100이 아니에요: ${g.title} (${s / 10})`);
  if (g.items.some(it => !(it.p > 0))) throw new Error(`0 이하인 백분율이 있어요: ${g.title}`);
  return true;
}
function gr5Cum(g) { let s = 0; return g.items.map(it => { s = Math.round((s + it.p) * 1000) / 1000; return s; }); }
function gr5Col(g, i) { const it = g.items[i]; if (it.c) return it.c; if (/^기타/.test(it.n)) return GR5_ETC; return GR5_COLS[i % GR5_COLS.length]; }
/* 반올림하여 소수 dec째 자리까지 → 합계가 100이 되지 않으면 반올림 값을 맞춰요 */
function gr5Pct(counts, dec) {
  const u = Math.pow(10, dec || 0), tot = counts.reduce((a, b) => a + b, 0);
  const ex = counts.map(c => c / tot * 100 * u), r = ex.map(v => Math.round(v + 1e-9)), raw = r.slice();
  let diff = 100 * u - r.reduce((a, b) => a + b, 0); const changed = [];
  while (diff !== 0) {
    let best = -1, bv = 0;
    ex.forEach((v, i) => { const e = v - r[i]; if (diff > 0 ? (best < 0 || e > bv) : (best < 0 || e < bv)) { best = i; bv = e; } });
    r[best] += diff > 0 ? 1 : -1; diff += diff > 0 ? -1 : 1; changed.push(best);
  }
  return { p: r.map(v => v / u), raw: raw.map(v => v / u), rawSum: raw.reduce((a, b) => a + b, 0) / u, changed: [...new Set(changed)] };
}

/* ---------- 글자 너비와 칸 안에 글 넣기 ---------- */
function gr5TW(s, f) { let w = 0; for (const c of String(s)) w += /[가-힣]/.test(c) ? f * .95 : /[0-9]/.test(c) ? f * .58 : c === " " ? f * .3 : /[·~().%]/.test(c) ? f * .42 : f * .62; return w; }
function gr5Split(s) {
  const t = String(s), sp = []; for (let i = 0; i < t.length; i++) if (t[i] === " ") sp.push(i);
  if (!sp.length) return null; let best = sp[0]; sp.forEach(i => { if (Math.abs(i - t.length / 2) < Math.abs(best - t.length / 2)) best = i; });
  return [t.slice(0, best), t.slice(best + 1)];
}
function gr5Fit(lines, w, hh, maxF, minF) { for (let f = maxF; f >= minF; f -= .5) if (Math.max(...lines.map(l => gr5TW(l, f))) <= w && lines.length * f * 1.18 <= hh) return f; return 0; }
function gr5Inside(name, pct, w, hh, maxF, minF) {
  const c = [[name, pct]], sp = gr5Split(name); if (sp) c.push([sp[0], sp[1], pct]);
  for (const lines of c) { const f = gr5Fit(lines, w, hh, maxF, minF); if (f) return { lines, f }; }
  return null;
}
function gr5Lines(g, cx, cy, lines, f, attrs) { lines.forEach((l, k) => g.append(txt(cx, cy + (k - (lines.length - 1) / 2) * f * 1.16, l, f, Object.assign({ "paint-order": "stroke", stroke: "#ffffffd0", "stroke-width": 3 }, attrs || {})))); }
function gr5Title(svg, W, y, t, f) { const ff = Math.min(f, (W - 16) / Math.max(1, gr5TW(t, 1))); svg.append(txt(W / 2, y, t, ff, { fill: GR5.ink })); }

/* 누를 수 있는 그래프 부분과 강조 표시 */
function gr5Wrap(svg, parts, maxW, o) {
  svg.setAttribute("class", "gr5fig"); if (maxW) svg.style.maxWidth = maxW;
  const ov = svgEl("g", { "pointer-events": "none" }); svg.append(ov);
  const marks = {}, COL = { sel: GR5.orange, good: GR5.green, bad: GR5.red };
  if (o && o.onPart) parts.forEach((p, i) => { p.el.style.cursor = "pointer"; p.el.addEventListener("click", () => o.onPart(i)); });
  return { el: svg, parts,
    hl(i, kind) { if (marks[i]) { marks[i].remove(); delete marks[i]; } if (!kind || !parts[i]) return; const e = parts[i].shape(); e.setAttribute("fill", "none"); e.setAttribute("stroke", COL[kind]); e.setAttribute("stroke-width", 5); e.setAttribute("stroke-linejoin", "round"); ov.append(e); marks[i] = e; },
    clear() { Object.keys(marks).forEach(k => { marks[k].remove(); delete marks[k]; }); } };
}

/* ========== 띠그래프 ========== */
function gr5BandGeo(o) {
  const mini = !!(o && o.mini), W = mini ? 360 : 720, x0 = mini ? 12 : 30, tH = o && o.noTitle ? 0 : 30;
  return { mini, W, x0, L: W - 2 * x0, tH, bandY: mini ? tH + 8 : tH + 36, BH: mini ? 112 : 58 };
}
function gr5BandLay(g, G, show) {
  const cum = gr5Cum(g), X = t => G.x0 + G.L * t / 100, ins = [], outs = [];
  g.items.forEach((it, i) => {
    if (show && !show[i]) return;
    const a = cum[i] - it.p, w = G.L * it.p / 100, cx = X(a + it.p / 2), pct = gr5P(it.p);
    const r = gr5Inside(it.n, pct, w - 5, G.BH - 6, G.mini ? 20 : 15, G.mini ? 10.5 : 11);
    if (r) ins.push({ i, cx, r }); else outs.push({ i, cx, t: `${it.n}(${pct})` });
  });
  const f2 = G.mini ? 15 : 13, lvR = []; let maxLv = -1;
  outs.forEach(ob => {
    const w = gr5TW(ob.t, f2), x = Math.min(Math.max(ob.cx, G.x0 + w / 2), G.x0 + G.L - w / 2); let lv = 0;
    while (lvR[lv] != null && x - w / 2 < lvR[lv] + 8) lv++;
    lvR[lv] = x + w / 2; ob.x = x; ob.lv = lv; maxLv = Math.max(maxLv, lv);
  });
  return { ins, outs, maxLv, f2 };
}
const gr5BandH = (G, lay) => G.bandY + G.BH + (lay.maxLv >= 0 ? (lay.maxLv + 1) * (lay.f2 + 7) + 12 : 10);
function gr5BandTicks(svg, G, step) {
  const X = t => G.x0 + G.L * t / 100;
  const g = svgEl("g"); svg.append(g);
  for (let t = 0; t <= 100; t += step) {
    const len = t % 10 === 0 ? 11 : t % 5 === 0 ? 8 : 5;
    g.append(svgEl("line", { x1: X(t), y1: G.bandY - len, x2: X(t), y2: G.bandY, stroke: GR5.line, "stroke-width": t % 10 === 0 ? 1.5 : 1 }));
    if (!G.mini && t % 10 === 0) g.append(txt(X(t), G.bandY - 21, String(t), 13, { fill: GR5.gray }));
  }
  if (!G.mini) g.append(txt(G.W - 6, G.bandY - 36, "(%)", 12, { fill: GR5.gray, "text-anchor": "end" }));
}
function gr5BandLabDraw(svg, G, lay) {
  const g = svgEl("g", { "pointer-events": "none" }); svg.append(g);
  lay.ins.forEach(o => gr5Lines(g, o.cx, G.bandY + G.BH / 2, o.r.lines, o.r.f));
  lay.outs.forEach(o => {
    const y = G.bandY + G.BH + 16 + o.lv * (lay.f2 + 7);
    g.append(svgEl("path", { d: `M${o.cx} ${G.bandY + G.BH - 4}L${o.cx} ${y - 9}${Math.abs(o.x - o.cx) > 2 ? `L${o.x} ${y - 9}` : ""}`, fill: "none", stroke: GR5.gray, "stroke-width": 1.3 }));
    g.append(txt(o.x, y, o.t, lay.f2, { fill: GR5.ink }));
  });
}
function gr5Band(g, o = {}) {
  gr5Chk(g); const G = gr5BandGeo(o), lay = gr5BandLay(g, G), H = gr5BandH(G, lay), svg = makeSvg(G.W, H), cum = gr5Cum(g), X = t => G.x0 + G.L * t / 100;
  if (G.tH) gr5Title(svg, G.W, 16, g.title, G.mini ? 19 : 17);
  const parts = [];
  g.items.forEach((it, i) => {
    const a = cum[i] - it.p, x = X(a), w = G.L * it.p / 100;
    const r = svgEl("rect", { x, y: G.bandY, width: w, height: G.BH, fill: gr5Col(g, i), stroke: GR5.line, "stroke-width": 1.5 });
    svg.append(r); parts.push({ el: r, shape: () => svgEl("rect", { x: x + 2, y: G.bandY + 2, width: Math.max(1, w - 4), height: G.BH - 4 }) });
  });
  gr5BandTicks(svg, G, g.step || 1);
  gr5BandLabDraw(svg, G, lay);
  return gr5Wrap(svg, parts, o.maxW || (G.mini ? "" : "42em"), o);
}

/* ========== 원그래프 ========== */
function gr5Pt(cx, cy, r, t) { const a = t / 100 * 2 * Math.PI; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }
function gr5Arc(cx, cy, r, a, b) {
  if (b - a >= 99.999) return `M${cx} ${cy - r}A${r} ${r} 0 1 1 ${cx} ${cy + r}A${r} ${r} 0 1 1 ${cx} ${cy - r}Z`;
  const [x1, y1] = gr5Pt(cx, cy, r, a), [x2, y2] = gr5Pt(cx, cy, r, b);
  return `M${cx} ${cy}L${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${b - a > 50 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z`;
}
function gr5PieGeo(o) {
  const tH = o && o.noTitle ? 0 : 30;
  if (o && o.mini) { const r = 136, cy = tH + 8 + r; return { mini: true, W: 360, cx: 180, cy, r, H: cy + r + 10, tH }; }
  const r = 140, cy = tH + 50 + r; return { mini: false, W: 640, cx: 320, cy, r, H: cy + r + 50, tH };
}
function gr5PieTicks(svg, G, step) {
  const g = svgEl("g", { "pointer-events": "none" }); svg.append(g);
  for (let t = 0; t < 100; t += step) {
    const len = t % 25 === 0 ? 12 : t % 5 === 0 ? 8 : 4;
    const [x1, y1] = gr5Pt(G.cx, G.cy, G.r, t), [x2, y2] = gr5Pt(G.cx, G.cy, G.r + len, t);
    g.append(svgEl("line", { x1, y1, x2, y2, stroke: GR5.line, "stroke-width": t % 5 === 0 ? 1.4 : .9 }));
  }
  if (!G.mini) [0, 25, 50, 75].forEach(t => { const [x, y] = gr5Pt(G.cx, G.cy, G.r + 24, t); g.append(txt(x, y, String(t), 13, { fill: GR5.gray })); });
}
function gr5PieLay(g, G, show) {
  const cum = gr5Cum(g), ins = [], outs = [];
  g.items.forEach((it, i) => {
    if (show && !show[i]) return;
    const a = cum[i] - it.p, mid = a + it.p / 2, span = it.p / 100 * 2 * Math.PI, pct = gr5P(it.p);
    const rr = it.p >= 45 ? G.r * .45 : G.r * .62, w = it.p >= 45 ? G.r * .95 : 2 * rr * Math.sin(Math.min(span, Math.PI) / 2) * .92;
    let r = gr5Inside(it.n, pct, w, G.r * .5, G.mini ? 21 : 15, G.mini ? 10 : 11);
    if (!r && G.mini) r = { lines: gr5Split(it.n) ? [...gr5Split(it.n), pct] : [it.n, pct], f: 10 };
    const [x, y] = gr5Pt(G.cx, G.cy, rr, mid);
    if (r) ins.push({ i, x, y, r }); else outs.push({ i, mid, t: `${it.n}(${pct})` });
  });
  /* 바깥 글: 왼쪽·오른쪽으로 나누어 겹치지 않게 아래로 밀어요 */
  const R = G.r + 40, f2 = 13;
  outs.forEach(o => { const [x, y] = gr5Pt(G.cx, G.cy, R, o.mid); o.x = x; o.y = y; o.side = Math.sin(o.mid / 100 * 2 * Math.PI) >= 0 ? 1 : -1; });
  [1, -1].forEach(sd => {
    const l = outs.filter(o => o.side === sd).sort((a, b) => a.y - b.y);
    for (let k = 1; k < l.length; k++) if (l[k].y - l[k - 1].y < f2 + 5) l[k].y = l[k - 1].y + f2 + 5;
    const maxY = G.H - 10; for (let k = l.length - 1; k >= 0; k--) { if (l[k].y > maxY) l[k].y = maxY; if (k && l[k].y - l[k - 1].y < f2 + 5) l[k - 1].y = l[k].y - f2 - 5; }
  });
  return { ins, outs, f2 };
}
function gr5PieLabDraw(svg, G, lay) {
  const g = svgEl("g", { "pointer-events": "none" }); svg.append(g);
  lay.ins.forEach(o => gr5Lines(g, o.x, o.y, o.r.lines, o.r.f));
  lay.outs.forEach(o => {
    const [x1, y1] = gr5Pt(G.cx, G.cy, G.r * .92, o.mid), [x2, y2] = gr5Pt(G.cx, G.cy, G.r + 14, o.mid);
    const ex = o.x - o.side * 4;
    g.append(svgEl("path", { d: `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${ex.toFixed(1)} ${o.y.toFixed(1)}`, fill: "none", stroke: GR5.gray, "stroke-width": 1.3 }));
    let x = o.x; const w = gr5TW(o.t, lay.f2);
    if (o.side > 0) x = Math.min(x, G.W - 4 - w); else x = Math.max(x, 4 + w);
    g.append(txt(x, o.y, o.t, lay.f2, { fill: GR5.ink, "text-anchor": o.side > 0 ? "start" : "end" }));
  });
}
function gr5Pie(g, o = {}) {
  gr5Chk(g); const G = gr5PieGeo(o), svg = makeSvg(G.W, G.H), cum = gr5Cum(g);
  if (G.tH) gr5Title(svg, G.W, 16, g.title, G.mini ? 19 : 17);
  const parts = [];
  g.items.forEach((it, i) => {
    const a = cum[i] - it.p, d = gr5Arc(G.cx, G.cy, G.r, a, cum[i]);
    const p = svgEl("path", { d, fill: gr5Col(g, i), stroke: GR5.line, "stroke-width": 1.5, "stroke-linejoin": "round" });
    svg.append(p); parts.push({ el: p, shape: () => svgEl("path", { d: gr5Arc(G.cx, G.cy, G.r - 3, a + .15, cum[i] - .15) }) });
  });
  gr5PieTicks(svg, G, g.step || 1);
  svg.append(svgEl("circle", { cx: G.cx, cy: G.cy, r: G.r, fill: "none", stroke: GR5.line, "stroke-width": 2, "pointer-events": "none" }));
  gr5PieLabDraw(svg, G, gr5PieLay(g, G));
  return gr5Wrap(svg, parts, o.maxW || (G.mini ? "" : "32em"), o);
}

/* ========== 막대그래프·꺾은선그래프·그림그래프 ========== */
function gr5BarFig(g, o = {}) {
  const W = 640, padL = 58, padR = 16, top = 52, plotH = 230, baseY = top + plotH, H = baseY + 44, n = g.names.length, cw = (W - padL - padR) / n, bw = Math.min(54, cw * .55);
  const y = v => baseY - v / g.max * plotH, svg = makeSvg(W, H);
  gr5Title(svg, W, 16, g.title, 17);
  for (let v = 0; v <= g.max + 1e-9; v += g.step) {
    const major = Math.abs(v / g.major - Math.round(v / g.major)) < 1e-9;
    svg.append(svgEl("line", { x1: padL, y1: y(v), x2: W - padR, y2: y(v), stroke: v === 0 ? GR5.ink : major ? "#B9C6C1" : GR5.grid, "stroke-width": v === 0 ? 2 : 1 }));
    if (major) svg.append(txt(padL - 8, y(v), gr5F(v), 13, { fill: GR5.gray, "text-anchor": "end" }));
  }
  svg.append(txt(padL - 8, top - 16, `(${g.unit})`, 12, { fill: GR5.gray, "text-anchor": "end" }));
  svg.append(svgEl("line", { x1: padL, y1: top - 6, x2: padL, y2: baseY, stroke: GR5.ink, "stroke-width": 2 }));
  const parts = g.names.map((nm, i) => {
    const cx = padL + cw * (i + .5), v = g.vals[i];
    const r = svgEl("rect", { x: cx - bw / 2, y: y(v), width: bw, height: baseY - y(v), fill: g.color || "#8FC3EA", stroke: GR5.line, "stroke-width": 1.2 });
    svg.append(r, txt(cx, baseY + 18, nm, n > 5 ? 14 : 15));
    return { el: r, shape: () => svgEl("rect", { x: cx - bw / 2 - 4, y: y(v) - 4, width: bw + 8, height: baseY - y(v) + 4 }) };
  });
  if (g.xName) svg.append(txt(W - padR, baseY + 36, `(${g.xName})`, 12, { fill: GR5.gray, "text-anchor": "end" }));
  return gr5Wrap(svg, parts, o.maxW || "36em", o);
}
function gr5LineFig(g, o = {}) {
  const W = 640, padL = 58, padR = 24, top = 54, plotH = 210, gap = g.lo > 0 ? 26 : 0, baseY = top + plotH + gap, H = baseY + 44, n = g.xs.length, cw = (W - padL - padR) / n;
  const y = v => baseY - gap - (v - g.lo) / (g.hi - g.lo) * plotH, svg = makeSvg(W, H);
  gr5Title(svg, W, 16, g.title, 17);
  svg.append(svgEl("line", { x1: padL, y1: baseY, x2: W - padR, y2: baseY, stroke: GR5.ink, "stroke-width": 2 }));
  svg.append(txt(padL - 8, baseY, "0", 13, { fill: GR5.gray, "text-anchor": "end" }));
  for (let v = g.lo; v <= g.hi + 1e-9; v = Math.round((v + g.step) * 1000) / 1000) {
    const major = Math.abs(v / g.major - Math.round(v / g.major)) < 1e-9;
    svg.append(svgEl("line", { x1: padL, y1: y(v), x2: W - padR, y2: y(v), stroke: major ? "#B9C6C1" : GR5.grid, "stroke-width": 1 }));
    if (major) svg.append(txt(padL - 8, y(v), gr5F(v), 13, { fill: GR5.gray, "text-anchor": "end" }));
  }
  if (gap) svg.append(svgEl("path", { d: `M${padL - 8} ${baseY - gap / 2 + 4}l5 -6 l5 6 l5 -6 l5 6`, fill: "none", stroke: GR5.ink, "stroke-width": 1.6 }));
  svg.append(svgEl("line", { x1: padL, y1: top - 6, x2: padL, y2: baseY, stroke: GR5.ink, "stroke-width": 2 }));
  svg.append(txt(padL - 8, top - 18, `(${g.unit})`, 12, { fill: GR5.gray, "text-anchor": "end" }));
  const pts = g.vals.map((v, i) => [padL + cw * (i + .5), y(v)]);
  svg.append(svgEl("polyline", { points: pts.map(p => p.join(",")).join(" "), fill: "none", stroke: "#D9622B", "stroke-width": 3 }));
  const parts = pts.map(([x, yy], i) => {
    svg.append(txt(x, baseY + 18, g.xs[i], 15), txt(x, yy - 16, gr5F(g.vals[i]), 14, { fill: GR5.ink }));
    const c = svgEl("circle", { cx: x, cy: yy, r: 7, fill: "#D9622B", stroke: "#fff", "stroke-width": 2 }), hit = svgEl("circle", { cx: x, cy: yy, r: 20, fill: "transparent" });
    svg.append(c, hit); return { el: hit, shape: () => svgEl("circle", { cx: x, cy: yy, r: 13 }) };
  });
  if (g.xName) svg.append(txt(W - 6, baseY + 36, `(${g.xName})`, 12, { fill: GR5.gray, "text-anchor": "end" }));
  return gr5Wrap(svg, parts, o.maxW || "36em", o);
}
function gr5Hosp(x, y, s) {
  const g = svgEl("g");
  g.append(svgEl("rect", { x: x - s / 2, y: y - s / 2, width: s, height: s, rx: s * .15, fill: "#FFFFFF", stroke: "#4A7DB8", "stroke-width": Math.max(1.2, s * .07) }));
  const a = s * .16, b = s * .36;
  g.append(svgEl("path", { d: `M${x - a} ${y - b}h${2 * a}v${b - a}h${b - a}v${2 * a}h${a - b}v${b - a}h${-2 * a}v${a - b}h${a - b}v${-2 * a}h${b - a}z`, fill: "#D64545" }));
  return g;
}
function gr5PicFig(g, o = {}) {
  const n = g.names.length, rowH = 58, top = 40, W = 640, H = top + n * rowH + 48, svg = makeSvg(W, H);
  gr5Title(svg, W, 16, g.title, 17);
  svg.append(svgEl("rect", { x: 20, y: top, width: W - 40, height: n * rowH, fill: "#fff", stroke: GR5.line, "stroke-width": 1.5 }));
  svg.append(svgEl("line", { x1: 110, y1: top, x2: 110, y2: top + n * rowH, stroke: GR5.line, "stroke-width": 1.5 }));
  const parts = g.names.map((nm, i) => {
    const y0 = top + i * rowH, yc = y0 + rowH / 2;
    if (i) svg.append(svgEl("line", { x1: 20, y1: y0, x2: W - 20, y2: y0, stroke: GR5.line, "stroke-width": 1 }));
    svg.append(txt(65, yc, nm, 16));
    const big = Math.floor(g.vals[i] / g.big), small = Math.round((g.vals[i] % g.big) / g.small); let x = 140;
    for (let k = 0; k < big; k++) { svg.append(gr5Hosp(x, yc, 40)); x += 48; }
    for (let k = 0; k < small; k++) { svg.append(gr5Hosp(x, yc + 6, 22)); x += 28; }
    const hit = svgEl("rect", { x: 20, y: y0, width: W - 40, height: rowH, fill: "transparent" }); svg.append(hit);
    return { el: hit, shape: () => svgEl("rect", { x: 23, y: y0 + 3, width: W - 46, height: rowH - 6 }) };
  });
  const ly = top + n * rowH + 24; svg.append(gr5Hosp(W - 300, ly, 28), txt(W - 280, ly, `${g.big}${g.unitWord}`, 14, { "text-anchor": "start" }), gr5Hosp(W - 170, ly + 3, 18), txt(W - 156, ly, `${g.small}${g.unitWord}`, 14, { "text-anchor": "start" }));
  return gr5Wrap(svg, parts, o.maxW || "36em", o);
}
function gr5Graph(g, o = {}) {
  if (g.kind === "band") return gr5Band(g, o);
  if (g.kind === "pie") return gr5Pie(g, o);
  if (g.kind === "bar") return gr5BarFig(g, o);
  if (g.kind === "line") return gr5LineFig(g, o);
  if (g.kind === "pic") return gr5PicFig(g, o);
  throw new Error("모르는 그래프 " + g.kind);
}
/* 그림만 보여 주기(묻는 그림) */
function gr5Show(list, o = {}) {
  const arr = Array.isArray(list) ? list : [list];
  const els = arr.map(x => { const g = x.g || x; const el = gr5Graph(g, o).el; return x.lead ? h("div", {}, h("div", { class: "gr5lead" }, x.lead), el) : h("div", {}, el); });
  return els.length > 1 ? h("div", { class: "gr5figs" + (els.length > 2 ? " gr5three" : "") }, els) : els[0];
}
/* 가로 표 */
function gr5HTbl(cap, head, rows, hiCells) {
  return h("div", { class: "gr5tbl" }, cap ? h("div", { class: "gr5cap" }, cap) : "", h("table", {},
    h("tr", {}, head.map(t => h("th", {}, t))),
    rows.map((r, ri) => h("tr", {}, r.map((t, ci) => ci === 0 ? h("th", {}, t) : h("td", { class: hiCells && hiCells.includes(`${ri}-${ci}`) ? "gr5hi" : "" }, t === "" ? "​" : String(t)))))));
}

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기) ---------- */
function gr5Ask(host, api, items, opts = {}) {
  const wrap = h("div", { style: "margin-top:.4em" }), all = [];
  if (opts.title) wrap.append(h("p", { class: "inst" }, opts.title));
  items.forEach(it => {
    const box = h("div", { class: "qitem" });
    if (it.q) box.append(h("div", { class: "jua" }, it.q));
    if (it.fig) box.append(typeof it.fig === "function" ? it.fig() : it.fig);
    const sent = h("p", { class: "sent" });
    (it.parts || []).forEach(pt => {
      if (typeof pt === "string" || (pt && pt.nodeType)) { sent.append(pt); return; }
      if (pt.o) {
        const slot = h("span", { class: "slot" }), s = { pt, v: pt.multi ? new Set() : null, slot };
        pt.o.forEach((o, oi) => slot.append(h("button", { class: "opt", onclick: e => {
          if (pt.multi) { s.v.has(oi) ? s.v.delete(oi) : s.v.add(oi); e.currentTarget.classList.toggle("on"); [...slot.children].forEach(b => b.classList.remove("good", "bad")); }
          else { [...slot.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); s.v = oi; }
        } }, o)));
        sent.append(slot); all.push(s);
      } else {
        const len = String(pt.n).length, w = pt.w || (len > 5 ? "6.5em" : len > 3 ? "5em" : "4em");
        const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "답", style: `width:${w};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => gr5Plain(pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : String(pt.n));
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? gr5Plain(pt) : pt.nodeType ? " " : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : Math.abs(gr5Num(s.inp.value) - s.pt.n) < 1e-9;
  const val = s => gr5Plain(s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-"));
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); });
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) { check.disabled = true; return api.done(ans, opts.ok); }
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(gr5Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}
/* 조작을 마친 뒤: then(이어서 할 활동) → ask(물음) → 없으면 바로 해결 */
const gr5Go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
function gr5Finish(body, api, opt, ans, msg, data) {
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "gr5part" }); body.append(box); opt.then(box, api, data); gr5Go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask(data) : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = gr5Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle }); gr5Go(w); }
  else api.done(ans, opt.ok || msg);
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열림 */
function gr5Chain(body, api, parts) {
  let k = 0; const host = h("div"); body.append(host);
  const run = () => {
    const box = h("div", { class: k ? "gr5part" : "" }); host.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); gr5Go(host.lastChild);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}

/* ---------- 화면 계산기 ---------- */
function gr5Eval(e) {
  const t = String(e).replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  if (!/^[0-9.+\-*/]+$/.test(t)) return NaN;
  const tok = t.match(/\d+(\.\d+)?|[+\-*/]/g); if (!tok) return NaN;
  const nums = [], ops = [];
  for (let i = 0; i < tok.length; i++) { const x = tok[i]; if (i % 2 === 0) { if (!/^\d/.test(x)) return NaN; nums.push(Number(x)); } else { if (!/^[+\-*/]$/.test(x)) return NaN; ops.push(x); } }
  if (nums.length !== ops.length + 1) return NaN;
  const n2 = [nums[0]], o2 = [];
  ops.forEach((o, i) => { if (o === "*" || o === "/") { const a = n2.pop(); n2.push(o === "*" ? a * nums[i + 1] : a / nums[i + 1]); } else { o2.push(o); n2.push(nums[i + 1]); } });
  let r = n2[0]; o2.forEach((o, i) => { r = o === "+" ? r + n2[i + 1] : r - n2[i + 1]; });
  return Math.round(r * 1e9) / 1e9;
}
function gr5Calc() {
  let ex = ""; const disp = h("div", { class: "gr5disp" }, "0"), show = () => { disp.textContent = ex || "0"; };
  const key = (t, cls) => h("button", { class: cls || "", onclick: () => {
    if (t === "C") ex = ""; else if (t === "←") ex = ex.slice(0, -1);
    else if (t === "=") { const r = gr5Eval(ex); if (!isFinite(r)) { ex = ""; disp.textContent = "식을 다시 써요"; return; } ex = String(r); }
    else ex += t;
    show();
  } }, t);
  const pad = h("div", { class: "gr5calc", "aria-label": "계산기" }, disp,
    key("7"), key("8"), key("9"), key("÷", "gr5op"), key("4"), key("5"), key("6"), key("×", "gr5op"),
    key("1"), key("2"), key("3"), key("−", "gr5op"), key("0"), key("."), key("=", "gr5op"), key("+", "gr5op"), key("C", "gr5op"), key("←", "gr5op"));
  pad.style.display = "none";
  const tog = h("button", { onclick: () => { const on = pad.style.display === "none"; pad.style.display = on ? "inline-grid" : "none"; tog.textContent = on ? "계산기 닫기" : "계산기 열기"; tog.classList.toggle("gr5on", on); } }, "계산기 열기");
  return h("div", {}, h("div", { class: "gr5tools" }, tog, h("span", { class: "gr5small" }, "수가 크거나 복잡하면 계산기를 써도 좋아요.")), pad);
}

/* =========================================================
   그래프의 부분을 눌러 답하기
   opt: {figs:[g…], leads:[…], whole:그래프 전체를 고름, qs:[{q, a:번호 | [번호…] | at:[[그래프, 번호]…], why:{"그래프-번호" 또는 "번호": 까닭}, ok}], ask|then, ok}
   ========================================================= */
function gr5Pick(body, api, opt) {
  const W = []; let qi = 0, sel = new Set(), fin = false;
  const keysOf = q => q.at ? q.at.map(([g, i]) => opt.whole ? String(g) : `${g}-${i}`) : (Array.isArray(q.a) ? q.a.map(i => opt.whole ? String(i) : `0-${i}`) : [opt.whole ? String(q.a) : `0-${q.a}`]);
  const qbox = h("div", { class: "gr5q" }), read = h("div", { class: "gr5small" });
  const paint = () => { W.forEach((w, gi) => { w.clear(); w.parts.forEach((_, i) => { const k = opt.whole ? String(gi) : `${gi}-${i}`; if (sel.has(k)) w.hl(i, "sel"); }); }); };
  const tap = (gi, i) => {
    if (fin) return; const q = opt.qs[qi], k = opt.whole ? String(gi) : `${gi}-${i}`, multi = q.multi || keysOf(q).length > 1;
    if (multi) { sel.has(k) ? sel.delete(k) : sel.add(k); } else { sel = new Set([k]); }
    paint();
    read.textContent = sel.size ? `고른 것: ${[...sel].map(nameOf).join(", ")}` : "";
  };
  const nameOf = k => { const [gi, i] = k.split("-").map(Number); const g = opt.figs[gi]; if (opt.whole) return opt.leads ? opt.leads[gi] : g.title; return g.items ? g.items[i].n : (g.names || g.xs)[i]; };
  opt.figs.forEach((g, gi) => W.push(gr5Graph(g, { onPart: i => tap(gi, i), mini: opt.mini })));
  const els = W.map((w, gi) => h("div", {}, opt.leads ? h("div", { class: "gr5lead" }, opt.leads[gi]) : "", w.el));
  const figEl = els.length > 1 ? h("div", { class: "gr5figs" + (els.length > 2 ? " gr5three" : "") }, els) : els[0];
  const show = () => { const q = opt.qs[qi], multi = q.multi || keysOf(q).length > 1; qbox.textContent = `${opt.qs.length > 1 ? `(${qi + 1}/${opt.qs.length}) ` : ""}${q.q}${multi ? " (여러 개를 눌러요)" : ""}`; read.textContent = ""; };
  api.provide({ words: opt.words || [], answers: opt.qs.map(q => keysOf(q).map(nameOf).join(", ")) });
  const check = h("button", { class: "big", onclick: () => {
    if (fin) return; const q = opt.qs[qi], want = keysOf(q);
    api.tryOnce();
    const got = [...sel], ok = got.length === want.length && want.every(k => sel.has(k)), ans = got.map(nameOf).join("·") || "-";
    if (!ok) {
      W.forEach((w, gi) => w.parts.forEach((_, i) => { const k = opt.whole ? String(gi) : `${gi}-${i}`; if (sel.has(k) && !want.includes(k)) w.hl(i, "bad"); }));
      const wk = got.find(k => !want.includes(k)), why = q.why && wk ? (q.why[wk] || (wk.startsWith("0-") ? q.why[wk.slice(2)] : null)) : null;
      return api.fail(why || (!got.length ? "그래프에서 알맞은 부분을 눌러요." : got.length < want.length ? "알맞은 것을 모두 골랐는지 다시 살펴봐요." : q.bad || "그래프를 다시 살펴보고 골라 봐요."), ans);
    }
    W.forEach((w, gi) => w.parts.forEach((_, i) => { const k = opt.whole ? String(gi) : `${gi}-${i}`; if (sel.has(k)) w.hl(i, "good"); }));
    qi++; sel = new Set();
    if (qi < opt.qs.length) { api.hint("○ " + (q.ok || "맞아요!") + " 이어서 다음 물음도 해 봐요."); setTimeout(() => { if (!fin) { W.forEach(w => w.clear()); show(); } }, 900); return; }
    fin = true; check.disabled = true; qbox.textContent = "그래프에서 모두 찾았어요.";
    gr5Finish(body, api, opt, opt.qs.map(q => keysOf(q).map(nameOf).join("·")).join(" / "), q.ok || opt.msg || "그래프를 잘 읽었어요.");
  } }, "확인하기");
  body.append(figEl, qbox, read, h("div", { class: "actions" }, check));
  show();
}

/* =========================================================
   띠·원 나누기: 백분율만큼 선을 그어 나누고, 나눈 부분에 내용과 백분율을 붙여요
   opt: {g, given:미리 들어 있는 항목 수, label:true|false, ask|then, ok}
   ========================================================= */
function gr5Draw(body, api, opt) {
  const g = opt.g; gr5Chk(g);
  const band = g.kind === "band", n = g.items.length, cum = gr5Cum(g), st = g.step || 1, given = opt.given || 0, P = g.items.map(it => it.p);
  const wantLab = opt.label !== false, lab = g.items.map((_, i) => i < given || !wantLab);
  let k = given, phase = "line", cur = given ? cum[given - 1] : 0, selCard = null;
  let G;
  if (band) { G = gr5BandGeo({ noTitle: true }); G.H = gr5BandH(G, gr5BandLay(g, G)) + 6; }
  else G = gr5PieGeo({ noTitle: true });
  const svg = makeSvg(G.W, G.H); svg.setAttribute("class", "gr5fig"); svg.style.maxWidth = band ? "42em" : "30em";
  const base = svgEl("g"), dyn = svgEl("g"), top = svgEl("g", { "pointer-events": "none" }); svg.append(base, dyn, top);
  const X = t => G.x0 + G.L * t / 100;
  if (band) { base.append(svgEl("rect", { x: G.x0, y: G.bandY, width: G.L, height: G.BH, fill: "#fff", stroke: GR5.line, "stroke-width": 1.5 })); gr5BandTicks(base, G, st); }
  else { base.append(svgEl("circle", { cx: G.cx, cy: G.cy, r: G.r, fill: "#fff" })); }
  const prev = () => k ? cum[k - 1] : 0;
  const read = h("div", { class: "gr5read" }), tip = h("p", { class: "gr5small" });
  const draw = () => {
    dyn.innerHTML = ""; top.innerHTML = "";
    for (let i = 0; i < k; i++) {
      const a = cum[i] - P[i], fill = gr5Col(g, i), hi = phase === "label" && selCard != null;
      if (band) dyn.append(svgEl("rect", { x: X(a), y: G.bandY, width: G.L * P[i] / 100, height: G.BH, fill, stroke: GR5.line, "stroke-width": 1.5, opacity: lab[i] || !hi ? 1 : .85 }));
      else dyn.append(svgEl("path", { d: gr5Arc(G.cx, G.cy, G.r, a, cum[i]), fill, stroke: GR5.line, "stroke-width": 1.5 }));
    }
    if (!band) { gr5PieTicks(dyn, Object.assign({}, G, { mini: false }), st); dyn.append(svgEl("circle", { cx: G.cx, cy: G.cy, r: G.r, fill: "none", stroke: GR5.line, "stroke-width": 2 }), svgEl("circle", { cx: G.cx, cy: G.cy, r: 3.5, fill: GR5.ink })); }
    if (phase === "line") {
      const c = GR5.red;
      if (band) { top.append(svgEl("line", { x1: X(cur), y1: G.bandY - 16, x2: X(cur), y2: G.bandY + G.BH + 10, stroke: c, "stroke-width": 3, "stroke-dasharray": "7 4" }), svgEl("circle", { cx: X(cur), cy: G.bandY + G.BH + 16, r: 8, fill: c })); }
      else { const [x2, y2] = gr5Pt(G.cx, G.cy, G.r + 6, cur), [x3, y3] = gr5Pt(G.cx, G.cy, G.r + 34, cur); top.append(svgEl("line", { x1: G.cx, y1: G.cy, x2, y2, stroke: c, "stroke-width": 3, "stroke-dasharray": "7 4" }), svgEl("circle", { cx: x3, cy: y3, r: 9, fill: c })); }
      const it = g.items[k];
      read.textContent = `지금 나눌 항목: ${it.n}(${gr5P(it.p)}) · 선의 자리 ${gr5F(cur)} % · 앞의 선(${gr5F(prev())} %)부터 ${gr5F(Math.round((cur - prev()) * 1000) / 1000)} %만큼`;
    } else if (phase === "label") {
      read.textContent = selCard == null ? "아래에서 붙일 내용 카드를 고른 다음, 알맞은 부분을 눌러요." : `‘${g.items[selCard].n}(${gr5P(P[selCard])})’를 붙일 부분을 눌러요.`;
    } else read.textContent = "띠그래프를 다 나누고 내용과 백분율을 모두 썼어요.";
    if (band) gr5BandLabDraw(top, G, gr5BandLay(g, G, lab.map((v, i) => v && i < k)));
    else gr5PieLabDraw(top, G, gr5PieLay(g, G, lab.map((v, i) => v && i < k)));
    if (phase === "done" && !band) read.textContent = "원그래프를 다 나누고 내용과 백분율을 모두 썼어요.";
  };
  const toT = p => {
    let t;
    if (band) t = (p.x - G.x0) / G.L * 100;
    else { const a = Math.atan2(p.x - G.cx, -(p.y - G.cy)) / (2 * Math.PI) * 100; t = (a + 100) % 100; if (t < st / 2 && prev() > 50) t = 100; }
    t = Math.round(t / st) * st; return Math.max(0, Math.min(100, t));
  };
  const partAt = p => {
    if (band) { if (p.y < G.bandY - 6 || p.y > G.bandY + G.BH + 6) return -1; const t = (p.x - G.x0) / G.L * 100; return cum.findIndex(c => t <= c + 1e-9); }
    if (Math.hypot(p.x - G.cx, p.y - G.cy) > G.r + 4) return -1;
    const t = ((Math.atan2(p.x - G.cx, -(p.y - G.cy)) / (2 * Math.PI) * 100) + 100) % 100; return cum.findIndex(c => t <= c + 1e-9);
  };
  const lineBtns = h("div", { class: "gr5tools" });
  const pool = h("div", { class: "gr5pool" });
  const toLabel = () => {
    k = n; lineBtns.style.display = "none";
    if (lab.every(Boolean)) return finish();
    phase = "label"; tip.textContent = "나눈 부분에 각 항목의 내용과 백분율을 써요. 카드를 고르고 알맞은 부분을 눌러요.";
    pool.innerHTML = ""; pool.style.display = "";
    gr5Mix(g.items.map((_, i) => i).filter(i => !lab[i]), n * 7 + 3).forEach(i => pool.append(h("button", { class: "gr5crd", "data-i": i, onclick: e => {
      selCard = selCard === i ? null : i; [...pool.children].forEach(b => b.classList.toggle("gr5on", +b.dataset.i === selCard)); draw();
    } }, `${g.items[i].n}(${gr5P(P[i])})`)));
    draw();
  };
  const finish = () => {
    phase = "done"; pool.style.display = "none"; lineBtns.style.display = "none"; tip.textContent = ""; draw();
    gr5Finish(body, api, opt, `나눈 자리 ${cum.slice(0, -1).map(gr5F).join(", ")} %`, opt.msg || `각 항목의 백분율만큼 ${band ? "띠" : "원"}를 나누었어요.`);
  };
  const commit = () => {
    if (phase !== "line") return; api.tryOnce();
    const B = cum[k], pv = prev(), it = g.items[k], c = cur;
    if (Math.abs(c - B) < 1e-9) {
      k++;
      if (k >= n - 1) { const last = g.items[n - 1]; api.hint(`○ ${it.n}(${gr5P(it.p)})까지 나누었어요. 남은 부분이 ${last.n}(${gr5P(last.p)})예요.`); toLabel(); return; }
      cur = cum[k - 1]; api.hint(`○ ${it.n}(${gr5P(it.p)}) 부분을 나누었어요. 이어서 ${g.items[k].n}(${gr5P(P[k])})를 나누어 봐요.`); draw(); return;
    }
    let why;
    if (c <= pv + 1e-9) why = `앞 항목과 겹치거나 크기가 0이에요. 앞의 선(${gr5F(pv)} %)에서 이어서 ${gr5P(it.p)}만큼 더 가요.`;
    else if (Math.abs(c - it.p) < 1e-9 && pv > 0) why = `0부터 다시 쟀어요. 이전 항목에 이어서 앞의 선(${gr5F(pv)} %)부터 ${gr5P(it.p)}만큼 가야 해요.`;
    else why = `새로 나눈 부분이 ${gr5P(Math.round((c - pv) * 1000) / 1000)}예요. ${it.n}${gr5Jo(it.n, "은/는")} ${gr5P(it.p)}예요.`;
    api.fail(why, `${it.n} 선 ${gr5F(c)} %`);
  };
  const undo = () => { if (phase !== "line" || k <= given) return; k--; cur = cum[k]; draw(); };
  lineBtns.append(h("button", { onclick: () => { if (phase === "line") { cur = Math.max(0, Math.round((cur - st) * 1000) / 1000); draw(); } } }, "◀ 한 칸"),
    h("button", { onclick: () => { if (phase === "line") { cur = Math.min(100, Math.round((cur + st) * 1000) / 1000); draw(); } } }, "한 칸 ▶"),
    h("button", { class: "gr5go", onclick: commit }, "여기에 선 긋기"), h("button", { onclick: undo }, "선 하나 지우기"));
  dragOn(svg, p => {
    if (phase === "label") {
      const i = partAt(p); if (i < 0) return false;
      if (selCard == null) { api.hint("먼저 아래에서 붙일 내용 카드를 골라요."); return false; }
      if (lab[i]) { api.hint("이 부분에는 벌써 내용을 썼어요. 다른 부분을 눌러요."); return false; }
      api.tryOnce();
      if (i === selCard) { lab[i] = true; selCard = null; pool.querySelector(`[data-i="${i}"]`).remove(); if (lab.every(Boolean)) finish(); else draw(); }
      else api.fail(`이 부분은 ${gr5P(P[i])}예요. ‘${g.items[selCard].n}(${gr5P(P[selCard])})’는 크기가 맞는 부분에 붙여요.`, `${g.items[selCard].n} → ${g.items[i].n} 자리`);
      return false;
    }
    if (phase !== "line") return false; cur = toT(p); draw(); return true;
  }, p => { if (phase === "line") { cur = toT(p); draw(); } }, () => { });
  pool.style.display = "none";
  tip.textContent = band ? "빨간 선을 끌거나 띠를 눌러 자리를 정하고(◀ ▶로 한 칸씩), ‘여기에 선 긋기’를 눌러요. 띠의 가장 작은 눈금 한 칸은 " + st + " %예요."
    : "빨간 선을 원의 중심에서 돌리듯 끌어 자리를 정하고(◀ ▶로 한 칸씩), ‘여기에 선 긋기’를 눌러요. 원의 중심에서 눈금까지 선을 그어요. 작은 눈금 한 칸은 " + st + " %예요.";
  api.provide({ words: ["이전 항목에 이어서", "백분율만큼", band ? "가장 작은 눈금 한 칸" : "원의 중심에서 눈금까지"], answers: [`선의 자리: ${cum.slice(given, -1).map(c => gr5F(c) + " %").join(", ")}`] });
  body.append(svg, read, tip, lineBtns, pool);
  if (given >= n - 1) toLabel(); else draw();
}

/* =========================================================
   공학 도구: 표를 쓰고 → 계산 도구(합계·백분율) → 띠그래프·원그래프 → 항목 정렬·제목 바꾸기
   opt: {target:[[항목, 수]…], unit:"명", head:"항목", ok}
   ========================================================= */
function gr5Maker(body, api, opt) {
  const unit = opt.unit || "명";
  const mk = (n, c) => ({ n: h("input", { type: "text", class: "gr5nm", value: n || "", "aria-label": "항목" }), c: h("input", { type: "text", inputmode: "numeric", value: c == null ? "" : String(c), "aria-label": "수" }) });
  const rows = [mk(), mk(), mk()];
  let sumOn = false, pctOn = false, kind = "band", sort = false; const seen = new Set();
  const ttl = h("input", { type: "text", placeholder: "표의 제목을 써요", style: "width:20em" }), gttl = h("input", { type: "text", placeholder: "그래프의 제목", style: "width:20em" });
  const tblHost = h("div"), stage = h("div"), note = h("p", { class: "gr5small" });
  const data = () => {
    const out = []; let bad = false;
    rows.forEach(r => { const nm = r.n.value.trim(), cs = r.c.value.trim(); if (!nm && !cs) return; const c = gr5Num(cs); if (!nm || !Number.isInteger(c) || c < 0) bad = true; out.push({ n: nm, c }); });
    return bad || !out.length || out.reduce((a, b) => a + b.c, 0) <= 0 ? null : out;
  };
  const calc = d => gr5Pct(d.map(x => x.c), 1);
  let pctTds = [], sumTd = null, sumPTd = null;
  const tbl = () => {
    tblHost.innerHTML = ""; pctTds = []; sumTd = sumPTd = null;
    const t = h("table", {}, h("tr", {}, h("th", {}, opt.head || "항목"), h("th", {}, `${opt.countHead || "학생 수"}(${unit})`), pctOn ? h("th", {}, "백분율(%)") : ""));
    rows.forEach(r => { const td = pctOn ? h("td", {}) : null; pctTds.push(td); t.append(h("tr", {}, h("td", {}, r.n), h("td", {}, r.c), td || "")); });
    if (sumOn) { sumTd = h("td", {}); sumPTd = pctOn ? h("td", {}) : null; t.append(h("tr", {}, h("th", {}, "합계"), sumTd, sumPTd || "")); }
    tblHost.append(h("div", { class: "gr5tbl" }, h("div", { class: "gr5tools" }, h("span", { class: "jua" }, "표의 제목: "), ttl), t));
    fill();
  };
  const fill = () => {
    const d = data(), pc = d && pctOn ? calc(d) : null; let di = 0;
    rows.forEach((r, ri) => {
      const has = r.n.value.trim() || r.c.value.trim(), td = pctTds[ri];
      if (td) { td.textContent = pc && has ? gr5F(pc.p[di]) : ""; td.className = pc && has && pc.changed.includes(di) ? "gr5hi" : ""; }
      if (has) di++;
    });
    if (sumTd) sumTd.textContent = d ? String(d.reduce((a, b) => a + b.c, 0)) : "";
    if (sumPTd) sumPTd.textContent = d ? "100" : "";
  };
  const graph = () => {
    stage.innerHTML = ""; note.textContent = "";
    const d = data();
    if (!d) { stage.append(h("p", { class: "gr5small" }, "표에 항목과 수를 바르게 쓰면 계산할 수 있어요.")); return; }
    if (!pctOn) { stage.append(h("p", { class: "gr5small" }, "계산 도구에서 ‘백분율’을 켜면 그래프를 그릴 수 있어요.")); return; }
    const pc = calc(d);
    let items = d.map((x, i) => ({ n: x.n, p: pc.p[i], c: GR5_COLS[i % GR5_COLS.length] })).filter((x, i) => d[i].c > 0);
    if (sort) items = items.filter(x => !/^기타/.test(x.n)).sort((a, b) => b.p - a.p).concat(items.filter(x => /^기타/.test(x.n)));
    items.forEach(x => { if (/^기타/.test(x.n)) x.c = GR5_ETC; });
    const g = { kind, title: gttl.value.trim() || "(그래프의 제목)", step: 1, items };
    stage.append(gr5Graph(g).el); seen.add(kind);
    if (pc.changed.length) note.textContent = `반올림한 백분율의 합계가 ${gr5F(pc.rawSum)} %여서, ${pc.changed.map(i => `${d[i].n}(${gr5F(pc.raw[i])} → ${gr5F(pc.p[i])})`).join(", ")}의 백분율을 맞추어 합계가 100 %가 되게 했어요.`;
    else note.textContent = "백분율은 반올림하여 소수 첫째 자리까지 나타냈어요. 합계는 100 %예요.";
  };
  const redraw = () => { tbl(); graph(); };
  const tog = (label, get, set) => { const b = h("button", { onclick: () => { set(!get()); b.classList.toggle("gr5on", get()); b.textContent = `${label} ${get() ? "ON" : "OFF"}`; if (label === "백분율" && get() && !gttl.value.trim() && ttl.value.trim()) gttl.value = ttl.value.trim(); redraw(); } }, `${label} OFF`); return b; };
  const kindRow = h("div", { class: "gr5tools" }, h("span", { class: "jua" }, "그래프:"));
  [["band", "띠그래프"], ["pie", "원그래프"]].forEach(([kd, t]) => { const b = h("button", { class: kd === kind ? "gr5on" : "", onclick: () => { kind = kd; [...kindRow.querySelectorAll("button")].forEach(x => x.classList.toggle("gr5on", x === b)); graph(); } }, t); kindRow.append(b); });
  const sortB = h("button", { onclick: () => { sort = !sort; sortB.classList.toggle("gr5on", sort); sortB.textContent = sort ? "항목 정렬: 크기순" : "항목 정렬: 표 순서"; graph(); } }, "항목 정렬: 표 순서");
  body.addEventListener("input", e => { if (e.target === gttl) { graph(); return; } if (e.target.tagName === "INPUT" && e.target !== ttl) { fill(); graph(); } });
  const tools = h("div", {},
    h("div", { class: "gr5tools" }, h("button", { onclick: () => { if (rows.length < 8) { rows.push(mk()); redraw(); } } }, "줄 더하기"), h("button", { onclick: () => { if (rows.length > 2) { rows.pop(); redraw(); } } }, "줄 빼기")),
    h("div", { class: "gr5tools" }, h("span", { class: "jua" }, "계산 도구:"), tog("합계", () => sumOn, v => { sumOn = v; }), tog("백분율", () => pctOn, v => { pctOn = v; })),
    kindRow, h("div", { class: "gr5tools" }, sortB), h("div", { class: "gr5tools" }, h("span", { class: "jua" }, "그래프의 제목: "), gttl));
  const norm = s => String(s).replace(/\s+/g, "");
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const d = data(), T = opt.target;
    const given = rows.map(r => `${r.n.value.trim()} ${r.c.value.trim()}`).filter(s => s.trim()).join(", ") || "-";
    if (!d) return api.fail("표의 항목과 수를 다시 살펴봐요. 수는 0 또는 자연수로 써요.", given);
    if (T) {
      if (d.length !== T.length) return api.fail(`항목이 ${T.length}개가 되도록 표를 써요. (지금 ${d.length}개)`, given);
      const bi = T.findIndex(([nm, c], i) => norm(d[i].n) !== norm(nm) || d[i].c !== c);
      if (bi >= 0) return api.fail(`표의 ${bi + 1}번째 줄(${T[bi][0]} ${T[bi][1]}${unit})을 다시 살펴봐요.`, given);
    } else if (d.filter(x => x.c > 0).length < 3) return api.fail("항목을 3개 이상 써 봐요.", given);
    if (!ttl.value.trim()) return api.hint("표의 제목을 써요.");
    if (!sumOn || !pctOn) return api.hint("계산 도구에서 ‘합계’와 ‘백분율’을 모두 켜요.");
    if (seen.size < 2) return api.hint("그래프에서 띠그래프와 원그래프를 모두 골라 그려 봐요.");
    if (!/비율/.test(gttl.value)) return api.hint("그래프의 제목을 ‘…의 비율’처럼 알맞게 바꾸어 써요.");
    api.done(`${ttl.value.trim()}: ${given} / ${gttl.value.trim()}`, opt.ok);
  } }, "확인하기");
  api.provide({ words: ["합계", "백분율", "띠그래프", "원그래프", "항목 정렬"], answers: opt.target ? [opt.target.map(([a, b]) => `${a} ${b}`).join(", ")] : [] });
  body.append(h("div", { class: "panel" }, h("div", { class: "stage" }, tblHost), h("div", { class: "side" }, tools)), stage, note, h("div", { class: "actions" }, check));
  redraw();
}

/* =========================================================
   조사하기: 설문 쪽지를 한 장씩 읽고 알맞은 칸을 눌러 표시해요
   opt: {names, counts, seed, ask(counts)}
   ========================================================= */
function gr5Survey(body, api, opt) {
  const names = opt.names, seq = gr5Mix(opt.counts.flatMap((c, i) => Array(c).fill(i)), opt.seed || 11), N = seq.length, cnt = names.map(() => 0);
  let k = 0, fin = false;
  const note = h("div", { class: "gr5note" }), prog = h("p", { class: "gr5small" });
  const marks = c => { let s = ""; for (let i = 0; i < c; i++) s += (i % 5 === 4 ? "╱ " : "|"); return s; };
  const btns = names.map((nm, i) => { const t = h("span", { class: "gr5tally" }); const b = h("button", { class: "gr5vb", onclick: () => vote(i) }, h("b", {}, nm), t); b._t = t; return b; });
  const fast = h("button", { style: "display:none", onclick: () => { while (k < N) { cnt[seq[k]]++; k++; } upd(); end(); } }, "남은 쪽지 한꺼번에 정리하기");
  const upd = () => {
    btns.forEach((b, i) => { b._t.textContent = marks(cnt[i]); });
    note.textContent = k < N ? `쪽지 ${k + 1}: “${names[seq[k]]}”` : "쪽지를 모두 정리했어요.";
    prog.textContent = `정리한 쪽지 ${k}장 / 모두 ${N}장`;
    fast.style.display = k >= 8 && k < N ? "" : "none";
  };
  const end = () => { if (fin) return; fin = true; gr5Finish(body, api, opt, names.map((nm, i) => `${nm} ${cnt[i]}`).join(", "), "쪽지를 모두 칸에 정리했어요.", cnt); };
  function vote(i) {
    if (k >= N) return;
    if (i !== seq[k]) { api.hint(`이 쪽지에는 ‘${names[seq[k]]}’라고 쓰여 있어요. 알맞은 칸을 눌러요.`); return; }
    cnt[i]++; k++; upd(); if (k >= N) end();
  }
  api.provide({ words: ["조사", "표로 정리하기"], answers: [names.map((nm, i) => `${nm} ${opt.counts[i]}`).join(", ")] });
  body.append(h("p", { class: "gr5small" }, "친구들이 낸 설문 쪽지예요. 쪽지에 쓰인 말을 읽고 알맞은 칸을 눌러 표시해요(5개마다 ╱로 묶어요)."), note, prog, h("div", { class: "gr5vote" }, btns), h("div", { class: "gr5tools" }, fast));
  upd();
}

/* =========================================================
   특징 카드를 알맞은 칸에 넣기  opt: {bins:[이름], cards:[{t, b:칸 번호, why}], ok}
   ========================================================= */
function gr5Sort(body, api, opt) {
  let sel = null, left = opt.cards.length;
  const pool = h("div", { class: "gr5pool" });
  const bins = opt.bins.map((nm, bi) => { const box = h("div", { class: "gr5bin", onclick: () => put(bi) }, h("div", { class: "gr5binh" }, nm)); return box; });
  const cards = opt.cards.map((c, ci) => { const b = h("button", { class: "gr5crd", onclick: e => { e.stopPropagation(); if (b._in) return; sel = sel === ci ? null : ci; cards.forEach((x, j) => x.classList.toggle("gr5on", j === sel)); } }, c.t); return b; });
  gr5Mix(cards.map((_, i) => i), opt.cards.length * 5 + 1).forEach(i => pool.append(cards[i]));
  function put(bi) {
    if (sel == null) { api.hint("먼저 위에서 카드를 하나 골라요."); return; }
    const c = opt.cards[sel]; api.tryOnce();
    if (c.b !== bi) { api.fail(c.why || `‘${opt.bins[bi]}’의 특징이 아니에요. 그래프의 모양과 쓰임을 다시 생각해 봐요.`, `${c.t} → ${opt.bins[bi]}`); return; }
    const b = cards[sel]; b._in = true; b.classList.remove("gr5on"); b.classList.add("gr5good"); bins[bi].append(b); sel = null; left--;
    if (!left) api.done(opt.cards.map(x => `${opt.bins[x.b]}: ${x.t}`).join(" / "), opt.ok); else api.hint("○ 맞아요. 남은 카드도 넣어 봐요.");
  }
  api.provide({ words: opt.bins, answers: opt.cards.map(x => `${opt.bins[x.b]} - ${x.t}`) });
  body.append(pool, h("div", { class: "gr5bins" }, bins));
}

/* =========================================================
   비율로 보기 / 실제 양으로 보기 — 전체의 양이 다른 띠그래프 견주기
   opt: {years, totals, unit, names, rows:[[백분율…]…], need:[[줄, 항목]…], ask|then, ok}
   ========================================================= */
function gr5Scaled(body, api, opt) {
  opt.rows.forEach((r, ri) => gr5Chk({ title: opt.years[ri], items: r.map((p, i) => ({ n: opt.names[i], p })) }));
  const W = 720, x0 = 86, L = 610, rowH = 70, top = 30, BH = 40, n = opt.rows.length, H = top + n * rowH + 10, maxT = Math.max(...opt.totals);
  let mode = "pct"; const seen = new Set(["pct"]), got = new Set(); let fin = false;
  const svg = makeSvg(W, H); svg.setAttribute("class", "gr5fig"); svg.style.maxWidth = "42em";
  const g = svgEl("g"); svg.append(g);
  const read = h("div", { class: "gr5read" });
  const col = i => /^기타/.test(opt.names[i]) ? GR5_ETC : GR5_COLS[i % GR5_COLS.length];
  const draw = () => {
    g.innerHTML = "";
    g.append(txt(W / 2, 14, mode === "pct" ? `${opt.title} (비율로 보기: 띠의 길이가 모두 같아요)` : `${opt.title} (실제 양으로 보기: 띠의 길이가 전체의 양에 비례해요)`, 15, { fill: GR5.gray }));
    opt.rows.forEach((r, ri) => {
      const y = top + ri * rowH + 10, len = mode === "pct" ? L : L * opt.totals[ri] / maxT;
      g.append(txt(x0 - 10, y + BH / 2, opt.years[ri], 15, { "text-anchor": "end" }));
      let a = 0;
      r.forEach((p, i) => {
        const w = len * p / 100, x = x0 + len * a / 100;
        const rc = svgEl("rect", { x, y, width: w, height: BH, fill: col(i), stroke: got.has(`${ri}-${i}`) ? GR5.orange : GR5.line, "stroke-width": got.has(`${ri}-${i}`) ? 3 : 1.2, style: "cursor:pointer" });
        rc.addEventListener("click", () => tap(ri, i)); g.append(rc);
        const t = `${p}`; if (gr5TW(t, 13) < w - 4) g.append(txt(x + w / 2, y + BH / 2, t, 13, { "pointer-events": "none" }));
        a += p;
      });
      if (mode === "abs") g.append(txt(x0 + len + 6, y + BH + 13, `${opt.totals[ri].toLocaleString()}${opt.unit}`, 12, { fill: GR5.gray, "text-anchor": "end" }));
    });
  };
  const tap = (ri, i) => {
    got.add(`${ri}-${i}`);
    read.textContent = `${opt.years[ri]} ${opt.names[i]}: 비율 ${gr5P(opt.rows[ri][i])} (그해 전체 ${opt.totals[ri].toLocaleString()}${opt.unit}의 ${gr5P(opt.rows[ri][i])})`;
    draw(); test();
  };
  const test = () => {
    if (fin) return;
    if (seen.size < 2) return api.hint("‘실제 양으로 보기’도 눌러 띠의 길이를 견주어 봐요.");
    const miss = (opt.need || []).find(([r, i]) => !got.has(`${r}-${i}`));
    if (miss) return api.hint(`${opt.years[miss[0]]}의 ‘${opt.names[miss[1]]}’ 부분도 눌러 살펴봐요.`);
    fin = true; gr5Finish(body, api, opt, "비율·실제 양 견주기", opt.msg || "비율로 볼 때와 실제 양으로 볼 때를 견주어 보았어요.");
  };
  const mb = h("div", { class: "gr5tools" });
  [["pct", "비율로 보기"], ["abs", "실제 양으로 보기"]].forEach(([m, t]) => { const b = h("button", { class: m === mode ? "gr5on" : "", onclick: () => { mode = m; seen.add(m); [...mb.querySelectorAll("button")].forEach(x => x.classList.toggle("gr5on", x === b)); draw(); test(); } }, t); mb.append(b); });
  const leg = h("div", { class: "gr5leg" }, opt.names.map((nm, i) => h("span", {}, h("i", { style: `background:${col(i)}` }), nm)));
  api.provide({ words: ["비율", "전체의 양", "실제 양"], answers: [] });
  body.append(mb, svg, leg, read, h("p", { class: "gr5small" }, "띠 안의 수는 백분율(%)이에요. 부분을 눌러 보고, 두 가지 보기를 번갈아 눌러 견주어 봐요."));
  draw(); read.textContent = "띠의 부분을 눌러 봐요.";
}

/* =========================================================
   그래프 빙고: 친구와 번갈아 그래프를 보고 알 수 있는 내용을 말해요(제목은 말하지 않아요)
   ========================================================= */
function gr5Facts(g) {
  const its = g.items.filter(it => !/^기타/.test(it.n)), srt = g.items.slice().sort((a, b) => b.p - a.p), out = [];
  if (srt[1].p < srt[0].p) out.push(`비율이 가장 높은 것은 ‘${srt[0].n}’${gr5Jo(srt[0].n, "이에요/예요")}.`);
  its.forEach(it => out.push(`‘${it.n}’의 비율은 전체의 ${gr5P(it.p)}예요.`));
  its.forEach(a => its.forEach(b => { if (a !== b && a.p % b.p === 0 && a.p / b.p >= 2) out.push(`‘${a.n}’의 비율은 ‘${b.n}’의 비율의 ${a.p / b.p}배예요.`); }));
  if (its.length >= 2) { const [a, b] = [its[0], its[its.length - 1]]; out.push(`‘${a.n}’${gr5Jo(a.n, "과/와")} ‘${b.n}’의 비율을 합하면 ${gr5P(a.p + b.p)}예요.`); }
  return out;
}
function gr5Lie(g) {
  const its = g.items.filter(it => !/^기타/.test(it.n)), it = its[gr5Rand(its.length)], used = g.items.map(x => x.p);
  const cand = [5, -5, 3, -3, 10, -10].map(d => it.p + d).filter(q => q > 0 && q < 100 && !used.includes(q));
  if (Math.random() < .35) { const srt = g.items.filter(x => !/^기타/.test(x.n)).sort((a, b) => a.p - b.p); return `비율이 가장 높은 것은 ‘${srt[0].n}’${gr5Jo(srt[0].n, "이에요/예요")}.`; }
  return `‘${it.n}’의 비율은 전체의 ${gr5P(cand[gr5Rand(cand.length)])}예요.`;
}
const GR5_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
function gr5Bingo(body, api, opt) {
  const C = opt.cards; C.forEach(gr5Chk);
  const say = h("div", { class: "gr5say" }), meBox = h("div"), status = h("p", { class: "gr5small" }), fbBox = h("span", { class: "gr5fb" });
  const grid = h("div", { class: "gr5bingo" }), again = h("button", { style: "display:none", onclick: () => start() }, "한 판 더");
  let my, fr, myMk, frMk, turn, said, pickCell, over, wins = 0;
  const lines = mk => GR5_LINES.filter(l => l.every(c => mk.has(c))).length;
  const cells = [];
  const start = () => {
    const ids = gr5Mix(C.map((_, i) => i), 1 + gr5Rand(9999)); my = ids.slice(0, 9); fr = gr5Mix(C.map((_, i) => i), 7 + gr5Rand(9999)).slice(0, 9);
    myMk = new Set(); frMk = new Set(); over = false; pickCell = null; again.style.display = "none";
    grid.innerHTML = ""; cells.length = 0;
    my.forEach((cid, pos) => { const c = h("div", { class: "gr5cell", onclick: () => tapCell(pos) }, gr5Graph(C[cid], { mini: true }).el); cells.push(c); grid.append(c); });
    turn = "fr"; paint(); friendTurn();
  };
  const paint = () => {
    cells.forEach((c, pos) => { c.classList.toggle("gr5mk", myMk.has(pos)); c.classList.toggle("gr5lt", pickCell === pos); c.classList.remove("gr5no"); });
    fbBox.innerHTML = ""; for (let p = 0; p < 9; p++) fbBox.append(h("span", {}, frMk.has(p) ? "◯" : ""));
    status.innerHTML = ""; status.append(`나의 빙고 ${lines(myMk)}줄 · 친구의 빙고 ${lines(frMk)}줄 `, h("span", { class: "gr5small" }, "(친구의 빙고판)"), fbBox);
  };
  const markBoth = cid => { const a = my.indexOf(cid), b = fr.indexOf(cid); if (a >= 0) myMk.add(a); if (b >= 0) frMk.add(b); };
  const checkEnd = () => {
    const m = lines(myMk), f = lines(frMk); if (m < 3 && f < 3) return false;
    over = true; paint(); again.style.display = "";
    const msg = m >= 3 ? (f >= 3 ? "둘이 함께 3줄을 완성했어요!" : "내가 먼저 3줄을 완성해서 이겼어요!") : "친구가 먼저 3줄을 완성했어요. 그래도 그래프를 잘 읽었어요.";
    meBox.innerHTML = ""; say.className = "gr5say"; say.textContent = "놀이가 끝났어요. " + msg;
    if (m >= 3) wins++;
    api.done(`빙고 놀이: 나 ${m}줄, 친구 ${f}줄`, msg + " ‘한 판 더’로 다시 놀 수 있어요.");
    return true;
  };
  function friendTurn() {
    if (over) return; turn = "fr"; pickCell = null;
    const left = fr.map((cid, p) => [cid, p]).filter(([, p]) => !frMk.has(p)); const [cid] = left[gr5Rand(left.length)];
    const facts = gr5Facts(C[cid]); said = cid;
    say.className = "gr5say"; say.textContent = `친구: “${facts[gr5Rand(facts.length)]}”`;
    meBox.innerHTML = ""; meBox.append(h("p", { class: "inst" }, "친구가 말한 내용에 알맞은 그래프가 내 빙고판에 있으면 그 그래프를 눌러 ◯표 해요."),
      h("div", { class: "gr5tools" }, h("button", { onclick: () => {
        const a = my.indexOf(said);
        if (a >= 0 && !myMk.has(a)) { api.hint("내 빙고판을 잘 찾아봐요. 친구가 말한 내용에 알맞은 그래프가 있어요."); return; }
        markBoth(said); paint(); if (!checkEnd()) myTurn();
      } }, a0())));
    paint();
  }
  const a0 = () => "내 판에는 없어요(또는 이미 ◯표 했어요)";
  function myTurn() {
    if (over) return; turn = "me"; pickCell = null;
    say.className = "gr5say gr5me"; say.textContent = "내 차례: 내 빙고판에서 ◯표 하지 않은 그래프 하나를 눌러, 제목을 말하지 않고 그래프를 설명해요.";
    meBox.innerHTML = ""; paint();
  }
  function tapCell(pos) {
    if (over) return;
    if (turn === "fr") {
      if (myMk.has(pos)) { api.hint("이미 ◯표 한 그래프예요."); return; }
      if (my[pos] !== said) { cells[pos].classList.add("gr5no"); api.hint("그 그래프에는 맞지 않는 말이에요. 그래프의 수를 다시 살펴봐요."); return; }
      markBoth(said); paint(); if (!checkEnd()) myTurn(); return;
    }
    if (myMk.has(pos)) { api.hint("◯표 하지 않은 그래프를 골라요."); return; }
    pickCell = pos; paint();
    const cid = my[pos], f = gr5Facts(C[cid]), truth = f[gr5Rand(f.length)], lies = new Set(); let guard = 0;
    while (lies.size < 2 && guard++ < 40) { const l = gr5Lie(C[cid]); if (!f.includes(l)) lies.add(l); }
    const opts = gr5Mix([truth, ...lies], 3 + gr5Rand(999));
    meBox.innerHTML = ""; meBox.append(h("p", { class: "inst" }, "고른 그래프를 보고 알맞게 설명한 말을 골라 친구에게 말해요."),
      h("div", { class: "gr5opts" }, opts.map(t => { const b = h("button", { onclick: () => {
        if (t !== truth) { b.disabled = true; api.hint("그래프와 맞지 않는 말이에요. 그래프의 수를 다시 살펴봐요."); return; }
        say.className = "gr5say gr5me"; say.textContent = `나: “${t}”`; markBoth(cid); paint(); meBox.innerHTML = "";
        if (!checkEnd()) setTimeout(friendTurn, 900);
      } }, t); return b; })));
  }
  api.provide({ words: ["비율이 가장 높은 것", "전체의 몇 %", "몇 배"], answers: [] });
  body.append(status, say, meBox, grid, h("div", { class: "gr5tools" }, again));
  start();
}

/* =========================================================
   또 다른 놀이: 주사위 2개를 던져 두 눈의 수의 차를 기록하고 띠그래프로 나타내요
   ========================================================= */
function gr5Die(v) {
  const s = makeSvg(60, 60); s.append(svgEl("rect", { x: 3, y: 3, width: 54, height: 54, rx: 10, fill: "#fff", stroke: GR5.line, "stroke-width": 2.5 }));
  const P = { 1: [[30, 30]], 2: [[18, 18], [42, 42]], 3: [[16, 16], [30, 30], [44, 44]], 4: [[18, 18], [42, 18], [18, 42], [42, 42]], 5: [[16, 16], [44, 16], [30, 30], [16, 44], [44, 44]], 6: [[18, 15], [42, 15], [18, 30], [42, 30], [18, 45], [42, 45]] };
  P[v].forEach(([x, y]) => s.append(svgEl("circle", { cx: x, cy: y, r: 5.5, fill: v === 1 ? GR5.red : GR5.ink }))); return s;
}
function gr5Dice(body, api, opt) {
  const N = opt.n || 10, cnt = [0, 0, 0, 0, 0, 0]; let rolls = 0, fin = false;
  const dz = h("div", { class: "gr5dice" }), read = h("div", { class: "gr5read" }), tblHost = h("div");
  const tbl = () => { tblHost.innerHTML = ""; tblHost.append(gr5HTbl("두 눈의 수의 차별 나온 횟수", ["두 눈의 수의 차", "0", "1", "2", "3", "4", "5", "합계"], [["횟수(번)", ...cnt.map(String), String(rolls)]])); };
  const roll = () => {
    if (rolls >= N) return; const a = 1 + gr5Rand(6), b = 1 + gr5Rand(6), d = Math.abs(a - b); cnt[d]++; rolls++;
    dz.innerHTML = ""; dz.append(gr5Die(a), gr5Die(b)); read.textContent = `${a}${gr5Jo(String(a), "과/와")} ${b} → 두 눈의 수의 차 ${d} (${rolls}/${N}번)`;
    tbl(); if (rolls >= N) end();
  };
  const end = () => {
    if (fin) return; fin = true; bt.disabled = bt10.disabled = true;
    const box = h("div", { class: "gr5part" }); body.append(box);
    gr5Ask(box, Object.assign({}, api, { done: () => {
      const items = cnt.map((c, d) => [`차 ${d}`, c * 100 / N]).filter(x => x[1] > 0);
      const g = gr5G("band", "두 눈의 수의 차별 나온 횟수의 비율", items);
      const box2 = h("div", { class: "gr5part" }); body.append(box2); box2.append(gr5Graph(g).el);
      const best = Math.max(...cnt);
      gr5Ask(box2, api, [{ q: "띠그래프를 보고 답해요.", parts: ["두 눈의 수의 차가 3인 횟수의 비율은 ", { n: cnt[3] * 100 / N }, " %예요. 비율이 가장 높은 차의 비율은 ", { n: best * 100 / N }, " %예요."] }],
        { ok: `차가 3인 비율은 ${cnt[3] * 100 / N} %예요. 여러 번 던질수록 차가 1인 경우가 가장 많이 나오는 편이에요(차가 1이 되는 눈의 짝이 가장 많아요).` });
      gr5Go(box2);
    } }), [{ q: `${N}번 던졌으니 한 번은 전체의 ${100 / N} %예요. 각 차의 백분율을 구해요.`, parts: cnt.flatMap((c, d) => [`차 ${d}: `, { n: c * 100 / N }, ` %${d < 5 ? ", " : ""}`]).concat([" · 합계 ", { n: 100 }, " %"]) }], { ok: "백분율의 합계가 100 %예요. 띠그래프로 나타내 볼게요." });
    gr5Go(box);
  };
  const bt = h("button", { class: "gr5go", onclick: roll }, "주사위 던지기"), bt10 = h("button", { onclick: () => { while (rolls < N) roll(); } }, "남은 만큼 한꺼번에 던지기");
  api.provide({ words: ["두 눈의 수의 차", "백분율", "띠그래프"], answers: [] });
  body.append(h("div", { class: "gr5tools" }, bt, bt10), dz, read, tblHost);
  dz.append(gr5Die(1), gr5Die(1)); tbl();
}

/* ---------- 단원 도입 그림: 페트병 재활용 ---------- */
function gr5PetFig() {
  const W = 620, H = 220, s = makeSvg(W, H);
  s.append(svgEl("path", { d: "M70 40h28v18c16 8 22 22 22 40v90a10 10 0 0 1-10 10H58a10 10 0 0 1-10-10V98c0-18 6-32 22-40z", fill: "#D7EEFA", stroke: "#4A90C2", "stroke-width": 3 }));
  s.append(svgEl("rect", { x: 66, y: 28, width: 36, height: 14, rx: 3, fill: "#4A90C2" }), txt(84, 130, "페트병", 16));
  [["옷", 40], ["솜", 110], ["부직포", 180]].forEach(([t, y]) => {
    s.append(svgEl("path", { d: `M140 ${110 + (y - 110) * .4}C220 ${110 + (y - 110) * .6} 260 ${y} 330 ${y}`, fill: "none", stroke: GR5.gray, "stroke-width": 2.5 }), svgEl("path", { d: `M330 ${y - 7}l12 7l-12 7z`, fill: GR5.gray }));
    s.append(svgEl("rect", { x: 350, y: y - 24, width: 130, height: 48, rx: 10, fill: "#FFF8EC", stroke: "#E8B36A", "stroke-width": 2 }), txt(415, y, t, 18));
    s.append(txt(540, y, "□ %", 20, { fill: GR5.red }));
  });
  s.setAttribute("class", "gr5fig"); s.style.maxWidth = "32em"; return s;
}

/* ---------- 이 단원의 그래프 자료 ---------- */
const GR5D = {
  worry: gr5G("band", "고민거리별 학생 수의 비율", [["친구 관계", 29], ["성적", 26], ["외모", 18], ["진로", 16], ["건강", 11]]),
  counsel: gr5G("band", "고민 상담 대상별 학생 수의 비율", [["친구", 40], ["부모님", 25], ["선후배", 20], ["형제", 10], ["기타", 5]]),
  ball: gr5G("band", "종류별 공의 수의 비율", [["축구공", 35], ["배구공", 25], ["농구공", 15], ["탁구공", 15], ["기타", 10]], 5),
  market: gr5G("pie", "물품별 판매량의 비율", [["학용품", 40], ["의류", 25], ["장난감", 20], ["책", 10], ["기타", 5]], 5),
  reading: gr5G("pie", "독서 빈도별 학생 수의 비율", [["매일", 18], ["일주일에 한두 번", 31], ["한 달에 한두 번", 25], ["몇 달에 한 번", 22], ["독서하지 않음", 4]]),
  leisure: gr5G("band", "평일 여가 시간별 초등학생 수의 비율", [["1시간 미만", 12], ["1~2시간", 21], ["2~3시간", 21], ["3~4시간", 18], ["4~5시간", 12], ["5시간 이상", 16]]),
  multi: gr5G("pie", "부모의 출신 국적별 학생 수의 비율", [["베트남", 32.1], ["중국", 24.6], ["필리핀", 9.1], ["중국(한국계)", 6.4], ["일본", 4.2], ["기타", 23.6]]),
  sport: gr5G("band", "좋아하는 운동별 학생 수의 비율", [["줄넘기", 36], ["축구", 30], ["피구", 24], ["야구", 10]]),
  instr: gr5G("band", "배우고 싶어 하는 전통 악기별 학생 수의 비율", [["꽹과리", 35], ["장구", 30], ["단소", 25], ["북", 10]]),
  drink: gr5G("pie", "좋아하는 음료수별 학생 수의 비율", [["탄산음료", 44], ["이온 음료", 28], ["주스", 20], ["우유", 8]]),
  words: gr5G("band", "친구에게 듣고 싶어 하는 말별 학생 수의 비율", [["같이 놀자", 32], ["정말 잘한다", 24], ["고마워", 20], ["넌 좋은 친구야", 16], ["기타", 8]]),
  pet: gr5G("band", "기르고 싶어 하는 반려동물별 학생 수의 비율", [["강아지", 45], ["고양이", 25], ["햄스터", 20], ["앵무새", 10]]),
  money: gr5G("pie", "용돈의 용도별 학생 수의 비율", [["저축", 30], ["취미", 25], ["간식", 25], ["학용품", 20]]),
  g5: gr5G("band", "5학년 학생들이 좋아하는 상담 활동별 학생 수의 비율", [["응원 쪽지 주고받기", 23], ["나만의 칭찬 나무 만들기", 35], ["감사 편지 쓰기", 15], ["편지 상담", 15], ["대면 상담", 12]]),
  g6: gr5G("band", "6학년 학생들이 좋아하는 상담 활동별 학생 수의 비율", [["응원 쪽지 주고받기", 30], ["나만의 칭찬 나무 만들기", 27], ["감사 편지 쓰기", 12], ["편지 상담", 22], ["대면 상담", 9]]),
  sTime: gr5G("pie", "발생 시간별 안전사고 건수의 비율", [["체육 수업 시간", 32.4], ["점심시간", 22.3], ["휴식·청소 시간", 15.7], ["체육 외 수업 시간", 14.4], ["등하교 시간", 7.7], ["기타", 7.5]]),
  sPlace: gr5G("pie", "발생 장소별 안전사고 건수의 비율", [["체육관 등 부속 시설", 33], ["운동장", 26.3], ["교실", 19.3], ["통로", 17.9], ["기타", 3.5]]),
  act: gr5G("pie", "체험 활동별 학생 수의 비율", [["도자기 만들기", 32], ["연날리기", 26], ["굴렁쇠 굴리기", 21], ["투호", 13], ["윷놀이", 8]]),
  sat: gr5G("pie", "체험 활동 만족도별 학생 수의 비율", [["매우 만족", 36], ["만족", 26], ["보통", 22], ["불만족", 9], ["매우 불만족", 7]]),
  grain21: gr5G("band", "2021년 곡식별 생산량의 비율", [["쌀", 42], ["보리", 31], ["조", 14], ["밀", 13]]),
  grain23: gr5G("band", "2023년 곡식별 생산량의 비율", [["쌀", 34], ["보리", 39], ["조", 13], ["밀", 14]]),
  phone: { kind: "line", title: "연도별 스마트폰 과의존 초등학생 수의 비율", xs: ["2019", "2020", "2021", "2022"], vals: [24.4, 30.5, 31.6, 33.6], lo: 20, hi: 35, step: 1, major: 5, unit: "%", xName: "년" },
  free: gr5G("band", "스마트폰 대신 하고 싶어 하는 여가 활동별 학생 수의 비율", [["운동", 32], ["독서", 29], ["퍼즐·보드게임", 22], ["산책", 9], ["요리", 5], ["기타", 3]]),
  fireDay: { kind: "bar", title: "요일별 산불 평균 발생 건수", names: ["월", "화", "수", "목", "금", "토", "일"], vals: [69, 72, 66, 68, 66, 86, 87], max: 100, step: 10, major: 50, unit: "건", xName: "요일", color: "#F2A97E" },
  fireSeason: gr5G("pie", "계절별 산불 평균 발생 건수의 비율", [["봄(3월~5월)", 56.5], ["여름(6월~8월)", 9.2], ["가을(9월~11월)", 8.6], ["겨울(12월~2월)", 25.7]]),
  farm: { kind: "bar", title: "농장별 과일나무 수", names: ["가", "나", "다"], vals: [240, 120, 300], max: 300, step: 20, major: 100, unit: "그루", xName: "농장", color: "#A9D99B" },
  farmA: gr5G("pie", "가 농장의 종류별 과일나무 수의 비율", [["사과나무", 36], ["배나무", 29], ["포도나무", 21], ["기타", 14]]),
  hosp: { kind: "pic", title: "도시별 병원 수", names: ["가", "나", "다", "라"], vals: [130, 250, 320, 210], big: 100, small: 10, unitWord: "개" },
  clinic: gr5G("band", "나 도시의 진료과별 병원 수의 비율", [["내과", 28], ["이비인후과", 26], ["피부과", 19], ["소아과", 15], ["기타", 12]]),
  book: gr5G("band", "좋아하는 책의 종류별 학생 수의 비율", [["동화책", 30], ["역사책", 25], ["위인전", 21], ["과학책", 18], ["기타", 6]]),
  job21: gr5G("band", "2021년 희망 직업 선택 이유별 학생 수의 비율", [["좋아하는 일이라서", 54], ["잘 해낼 수 있을 것 같아서", 18], ["기타", 15], ["돈을 많이 벌 수 있을 것 같아서", 8], ["나의 발전 가능성이 클 것 같아서", 5]]),
  job23: gr5G("band", "2023년 희망 직업 선택 이유별 학생 수의 비율", [["좋아하는 일이라서", 60], ["잘 해낼 수 있을 것 같아서", 15], ["기타", 14], ["돈을 많이 벌 수 있을 것 같아서", 8], ["나의 발전 가능성이 클 것 같아서", 3]]),
  color: gr5G("band", "좋아하는 색깔별 학생 수의 비율", [["빨간색", 35, "#F28B82"], ["노란색", 30, "#F5D27B"], ["초록색", 20, "#A9D99B"], ["파란색", 15, "#8FC3EA"]]),
  ask25: { kind: "bar", title: "고민 상담을 해 본 대상별 학생 수", names: ["친구", "부모님", "선생님", "형제"], vals: [10, 7, 5, 3], max: 12, step: 1, major: 5, unit: "명", xName: "대상", color: "#C6B2E8" }
};
GR5D.colorPie = Object.assign({}, GR5D.color, { kind: "pie" });
GR5D.bookPie = Object.assign({}, GR5D.book, { kind: "pie" });
GR5D.worryPie = Object.assign({}, GR5D.worry, { kind: "pie" });
const GR5_REGION = { title: "권역별 인구의 비율", years: ["2000년", "2010년", "2020년"], totals: [47008, 49554, 51836], unit: "천 명",
  names: ["수도권", "강원권", "충청권", "호남권", "영남권", "제주권"],
  rows: [[46.3, 3.2, 10.1, 11.4, 27.9, 1.1], [49.3, 3, 10.4, 10.2, 26, 1.1], [50.2, 2.9, 10.9, 9.8, 24.9, 1.3]] };
const GR5_WASTE = { years: ["2020년", "2021년", "2022년"], totals: [19546, 19738, 18645], names: ["건설", "사업장", "생활계", "기타"], rows: [[44.2, 41.4, 11.5, 2.9], [42.5, 43, 11.5, 3], [40.9, 43.5, 12.4, 3.2]] };
GR5_WASTE.figs = GR5_WASTE.rows.map((r, i) => gr5G("pie", GR5_WASTE.years[i], r.map((p, k) => [GR5_WASTE.names[k], p])));
const GR5_REGION_BANDS = GR5_REGION.rows.map((r, i) => gr5G("band", `${GR5_REGION.years[i]} 권역별 인구의 비율`, r.map((p, k) => [GR5_REGION.names[k], p])));
/* 빙고 그래프 카드 12장 — 앞의 둘은 교과서 예, 나머지는 이 앱이 정한 그래프 */
const GR5_BINGO = [
  gr5G("band", "기부한 물품별 학생 수의 비율", [["학용품", 35], ["책", 30], ["장난감", 20], ["옷", 15]]),
  gr5G("band", "좋아하는 꽃별 학생 수의 비율", [["무궁화", 28], ["장미", 25], ["해바라기", 20], ["튤립", 15], ["기타", 12]]),
  gr5G("pie", "가고 싶은 나라별 학생 수의 비율", [["미국", 30], ["일본", 25], ["프랑스", 20], ["호주", 15], ["기타", 10]]),
  gr5G("pie", "좋아하는 계절별 학생 수의 비율", [["여름", 34], ["겨울", 26], ["봄", 22], ["가을", 18]]),
  gr5G("band", "좋아하는 과일별 학생 수의 비율", [["딸기", 32], ["수박", 24], ["사과", 20], ["포도", 16], ["기타", 8]]),
  gr5G("pie", "등교 방법별 학생 수의 비율", [["걸어서", 55], ["자전거", 20], ["자동차", 15], ["버스", 10]]),
  gr5G("band", "기르고 싶은 동물별 학생 수의 비율", [["강아지", 40], ["고양이", 30], ["햄스터", 18], ["금붕어", 12]]),
  gr5G("pie", "배우고 싶은 운동별 학생 수의 비율", [["태권도", 36], ["수영", 28], ["배드민턴", 21], ["탁구", 15]]),
  gr5G("band", "즐겨 읽는 책별 학생 수의 비율", [["만화책", 38], ["동화책", 27], ["과학책", 20], ["위인전", 15]]),
  gr5G("pie", "아침 식사별 학생 수의 비율", [["밥", 45], ["빵", 25], ["시리얼", 18], ["먹지 않음", 12]]),
  gr5G("band", "좋아하는 간식별 학생 수의 비율", [["떡볶이", 33], ["아이스크림", 27], ["과자", 22], ["김밥", 18]]),
  gr5G("pie", "방과 후 활동별 학생 수의 비율", [["컴퓨터", 30], ["로봇", 25], ["바이올린", 20], ["바둑", 15], ["기타", 10]])
];
//@@LESSONS
const UNIT_STORY = { title: "또래 상담사 승아의 조사", lines: [
  "승아는 또래 상담사예요. 학생들의 고민거리와 고민 상담을 하는 대상, 좋아하는 상담 활동 등을 조사하여 학생들에게 도움을 주려고 해요.",
  "고민거리·상담 대상·친구에게 듣고 싶어 하는 말을 조사하여 띠와 원을 백분율만큼 나누어 나타내고, 안전사고·산불·인구·폐기물 그래프를 해석하며 목적에 알맞은 그래프를 골라요.",
  "교과서 「수학 6-1」 5. 여러 가지 그래프의 차시 순서 그대로 만들었어요."],
  one: "여러 가지 그래프 · 전체에 대한 각 부분의 비율을 띠 모양에 나타낸 그래프가 띠그래프, 원 모양에 나타낸 그래프가 원그래프예요. 백분율의 합계는 100 %예요." };
const UNIT_KEYWORDS = ["띠그래프", "원그래프", "비율", "백분율", "합계 100 %", "가장 작은 눈금 한 칸", "원의 중심에서 눈금까지", "이전 항목에 이어서", "기타", "막대그래프", "꺾은선그래프", "그림그래프", "실제 양", "알맞은 그래프"];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 또래 상담사 승아의 조사", soop: "개념 찾기(S)",
  question: "전체에 대한 각 부분의 비율을 그래프로 어떻게 나타낼 수 있을까요?",
  summary: "3학년에 그림그래프, 4학년에 막대그래프와 꺾은선그래프를 배웠어요. 이 단원에서는 전체에 대한 각 부분의 비율을 나타내는 띠그래프와 원그래프를 배우고, 여러 가지 그래프를 비교하여 목적에 알맞은 그래프를 골라요.",
  steps: [
    { name: "살펴보기", inst: "투명 페트병을 옷이나 솜, 부직포 등으로 재활용한다고 해요. 그림을 보고 물음에 답해 보세요.", hints: ["옷·솜·부직포가 전체 재활용 양에서 각각 얼마만큼(몇 %)인지 견주고 싶어 해요.", "뉴스의 지역별 강수량, 과학 실험 결과처럼 그래프를 본 경험을 떠올려요."],
      render: (b, a) => quiz(b, a, [
        { q: "그림은 어떤 상황을 나타내고 있나요?", fig: gr5PetFig, o: ["페트병의 재활용 용도별 비율을 비교하려면 어떤 그래프를 이용해야 하는지 궁금해하는 상황", "페트병의 무게를 재는 상황", "페트병을 만든 날짜를 알아보는 상황"], a: 0 },
        { q: "우리 주변에서 자료를 그래프로 나타낸 경우를 모두 골라요.", o: ["뉴스에서 지역별 강수량을 막대그래프로 나타냈어요", "과학 실험 결과를 꺾은선그래프로 나타냈어요", "연령별 인구의 비율을 그래프로 나타냈어요", "친구에게 생일 축하 노래를 불러 주었어요"], a: [0, 1, 2], why: { "3": "노래를 부른 것은 자료를 그래프로 나타낸 것이 아니에요." } }],
        { ok: "재활용 용도별 비율처럼 전체에 대한 각 부분의 비율을 비교할 때 쓰는 그래프를 이 단원에서 배워요." }) },
    { name: "배울 내용 살펴보기", inst: "책장을 넘겨 이 단원에서 어떤 내용을 공부할지 알아봐요. 배울 차례대로 스티커를 붙이듯 눌러 보세요.", hints: ["먼저 띠그래프와 원그래프가 무엇인지 알고, 그다음 나타내는 방법을 배워요.", "직접 조사해서 나타낸 다음 해석하고, 여러 가지 그래프를 활용해요."],
      render: (b, a) => sequence(b, a, ["㉠ 띠그래프와 원그래프를 해석해 볼까요", "㉡ 띠그래프와 원그래프를 알아볼까요", "㉢ 여러 가지 그래프를 활용해 볼까요", "㉣ 띠그래프와 원그래프로 나타내는 방법을 알아볼까요", "㉤ 자료를 조사하여 띠그래프와 원그래프로 나타내어 볼까요"], [1, 3, 4, 0, 2],
        { ok: "띠그래프와 원그래프 알아보기 → 나타내는 방법 → 조사하여 나타내기 → 해석하기 → 여러 가지 그래프 활용하기 차례로 배워요." }) },
    { name: "배운 내용 떠올리기", inst: "4학년에 배운 막대그래프와 6학년 1학기에 배운 백분율을 떠올려요. 승아네 반 학생 25명이 고민 상담을 해 본 대상을 조사한 막대그래프예요(이 앱이 정한 수). 그래프를 보고 답해 보세요.", hints: ["막대의 길이가 가장 긴 것을 찾아요.", "백분율은 (비교하는 양) ÷ (기준량) × 100이에요. 10 ÷ 25 × 100을 계산해요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.ask25], qs: [{ q: "가장 많은 학생이 고민 상담을 해 본 대상의 막대를 눌러요.", a: 0, ok: "막대가 가장 긴 ‘친구’예요." }],
        ask: [{ parts: ["세로 눈금 한 칸은 ", { n: 1 }, "명을 나타내고, 부모님께 상담해 본 학생은 ", { n: 7, why: { "5": "‘선생님’의 막대를 읽었어요. 부모님 막대를 다시 봐요." } }, "명이에요."] },
          { parts: ["친구에게 상담해 본 학생 수의 전체 학생 수(25명)에 대한 비율을 백분율로 나타내면 [10/25] × 100 = ", { n: 40, why: { "10": "학생 수를 그대로 썼어요. 전체 25명에 대한 비율을 백분율로 바꿔요.", "0.4": "비율 0.4에 100을 곱해 %를 붙여요." } }, " %예요."] }],
        ok: "막대그래프는 막대의 길이로 많고 적음을 비교해요. 친구에게 상담해 본 학생은 전체의 40 %예요." }) },
    { name: "승아의 계획 알기", inst: "“승아는 친구들과 함께 또래 상담사 활동을 하고 있어요. ‘우리 학교 학생들의 고민거리는 무엇일까?’ ‘고민 상담을 하는 대상이나 좋아하는 상담 활동 등을 함께 조사하면 학생들에게 도움을 줄 수 있을 것 같아.’” 승아의 계획을 알아봐요.", hints: ["승아는 학생들에게 도움을 주려고 조사해요.", "조사한 자료는 표나 그래프로 정리하면 한눈에 알아보기 쉬워요."],
      render: (b, a) => quiz(b, a, [
        { q: "승아가 하려는 일은 무엇인가요?", o: ["학생들의 고민거리와 학교생활에 대한 주제를 정해 조사하는 일", "학교 운동장의 넓이를 재는 일", "급식 메뉴를 정하는 일"], a: 0 },
        { q: "조사한 자료를 정리하는 방법으로 알맞은 것을 모두 골라요.", o: ["표로 정리해요", "그래프로 나타내요", "조사한 쪽지를 버려요"], a: [0, 1], why: { "2": "조사한 자료는 정리해야 알 수 있는 것이 많아요." } }],
        { ok: "승아는 조사한 자료를 표와 그래프로 나타내어 학생들에게 도움을 주려고 해요." }) },
    { name: "확인하기", inst: "이 단원에서 배울 그래프를 생각하며 답해 보세요.", hints: ["전체를 100으로 볼 때 각 부분이 얼마인지 나타내는 것이 백분율이에요.", "비율 0.25에 100을 곱하면 백분율이에요."],
      render: (b, a) => gr5Ask(b, a, [
        { parts: ["페트병의 재활용 용도별 비율을 비교하려면 ", { o: ["전체에 대한 각 부분의 비율을 나타내는 그래프", "시간에 따른 변화를 나타내는 그래프"], a: 0, why: { "1": "용도별 비율은 시간에 따라 변하는 양이 아니라 전체에 대한 각 부분의 비율이에요." } }, "를 이용하면 좋아요."] },
        { parts: ["비율 0.25를 백분율로 나타내면 ", { n: 25, why: { "0.25": "비율에 100을 곱해야 백분율이에요." } }, " %예요. 전체를 백분율로 나타내면 ", { n: 100 }, " %예요."] }],
        { ok: "전체는 100 %예요. 이 단원에서 전체에 대한 각 부분의 비율을 나타내는 그래프를 배워요." }) }
  ],
  challenge: { inst: "백분율을 구해 보세요. 『수학 6-1』 4단원에서 배운 비율을 백분율로 나타내기예요.", hints: ["(부분) ÷ (전체) × 100이에요.", "세 부분의 백분율의 합계는 100 %예요."],
    render: (b, a) => gr5Ask(b, a, [
      { parts: ["40명 중 14명은 전체의 [14/40] × 100 = ", { n: 35 }, " %예요."] },
      { parts: ["200명 중 30명은 전체의 ", { n: 15 }, " %예요."] },
      { parts: ["전체를 세 부분으로 나누었더니 45 %, 30 %, □ %였어요. □ = ", { n: 25, why: { "75": "45 + 30을 구했어요. 전체 100 %에서 빼요." } }] }],
      { ok: "부분의 백분율을 모두 더하면 100 %예요." }) }
},
{
  id: "t2", no: 2, title: "띠그래프와 원그래프를 알아볼까요", soop: "개념 구축하기(O)",
  question: "전체에 대한 각 부분의 비율을 띠 모양이나 원 모양에 나타내면 무엇이 편리할까요?",
  summary: "전체에 대한 각 부분의 비율을 띠 모양에 나타낸 그래프를 띠그래프, 원 모양에 나타낸 그래프를 원그래프라고 해요. 두 그래프 모두 백분율의 합계는 100 %이고, 전체에 대한 각 부분의 비율을 한눈에 알아보고 비교하기 편리해요.",
  steps: [
    { name: "만져 보기", inst: "승아네 학교 학생들의 고민거리를 조사하여 나타낸 표와, 표를 보고 나타낸 두 그래프예요. 두 그래프에서 같은 고민거리를 찾아 눌러 보세요.", hints: ["가 그래프는 띠 모양, 나 그래프는 원 모양이에요.", "‘외모’는 18 %예요. 두 그래프에서 18 %인 부분을 찾아요."],
      render: (b, a) => { b.append(gr5HTbl("고민거리별 학생 수의 비율", ["고민거리", "친구 관계", "성적", "외모", "진로", "건강", "합계"], [["백분율(%)", 29, 26, 18, 16, 11, 100]]));
        gr5Pick(b, a, { figs: [GR5D.worry, GR5D.worryPie], leads: ["가", "나"],
          qs: [{ q: "가 그래프와 나 그래프에서 ‘외모’ 부분을 각각 눌러요.", at: [[0, 2], [1, 2]], ok: "두 그래프 모두 외모는 18 %예요." }],
          ask: [{ parts: ["두 그래프는 ", { o: ["고민거리별 학생 수의 비율", "고민 상담 대상별 학생 수"], a: 0 }, "을 조사하여 나타낸 그래프예요. 가 그래프는 ", { o: ["띠", "원", "막대"], a: 0 }, " 모양, 나 그래프는 ", { o: ["띠", "원", "막대"], a: 1 }, " 모양이에요."] },
            { parts: ["두 그래프에서 백분율의 합계는 모두 ", { n: 100, why: { "0": "29 + 26 + 18 + 16 + 11을 계산해 봐요." } }, " %예요."] }],
          ok: "가 그래프는 띠 모양, 나 그래프는 원 모양이고 백분율의 합계는 모두 100 %예요." }); } },
    { name: "그려 보기", inst: "두 그래프의 눈금을 살펴봐요. 나 그래프에서 ‘진로’ 부분을 누르고, 그 부분이 작은 눈금 몇 칸인지 세어 보세요.", hints: ["가 그래프는 0부터 100까지를 100칸으로 나누었어요. 10칸마다 수가 쓰여 있어요.", "나 그래프의 원 둘레도 100칸이에요. 0, 25, 50, 75가 쓰여 있어요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.worry, GR5D.worryPie], leads: ["가", "나"], qs: [{ q: "나 그래프에서 ‘진로’ 부분을 눌러요.", at: [[1, 3]], ok: "진로 부분은 작은 눈금 16칸이에요." }],
        ask: [{ parts: ["가 그래프에서 가장 작은 눈금 한 칸은 ", { n: 1, why: { "10": "10은 수가 쓰여 있는 큰 눈금 사이예요. 그 사이를 다시 10칸으로 나누었어요." } }, " %를 나타내요."] },
          { parts: ["나 그래프에서 작은 눈금 한 칸은 ", { n: 1, why: { "25": "25는 수가 쓰여 있는 눈금 사이예요. 원 둘레를 100칸으로 나누었어요." } }, " %를 나타내요. ‘진로’는 작은 눈금 ", { n: 16 }, "칸이니 ", { n: 16 }, " %예요."] }],
        ok: "가 그래프의 가장 작은 눈금 한 칸과 나 그래프의 작은 눈금 한 칸은 모두 1 %예요." }) },
    { name: "말해 보기", inst: "1의 띠그래프와 원그래프를 보고 고민거리의 비율을 비교해 보세요.", hints: ["띠그래프에서는 길이가, 원그래프에서는 넓이(크기)가 가장 큰 부분을 찾아요.", "두 그래프는 모두 전체에 대한 각 부분의 비율을 나타내요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.worry, GR5D.worryPie], leads: ["가", "나"],
        qs: [{ q: "가 그래프에서 고민거리 중 비율이 가장 높은 것을 눌러요.", at: [[0, 0]], ok: "친구 관계가 29 %로 가장 높아요." },
          { q: "나 그래프에서 고민거리 중 비율이 가장 낮은 것을 눌러요.", at: [[1, 4]], ok: "건강이 11 %로 가장 낮아요." }],
        then: (box, api) => quiz(box, api, [
          { q: "조사한 자료를 띠그래프나 원그래프로 나타내었을 때의 편리한 점을 모두 골라요.", o: ["전체에 대한 각 부분의 비율을 한눈에 알아볼 수 있어요", "각 부분의 비율을 비교하기 편리해요", "시간에 따른 변화를 한눈에 알 수 있어요"], a: [0, 1], why: { "2": "시간에 따른 변화는 꺾은선그래프로 나타내요." } },
          { q: "띠그래프와 원그래프의 차이점으로 알맞은 것을 골라요.", o: ["띠그래프는 띠 모양, 원그래프는 원 모양으로 나타내요", "띠그래프는 백분율의 합계가 100 %, 원그래프는 360 %예요"], a: 0, why: { "1": "두 그래프 모두 백분율의 합계는 100 %예요." } }],
          { ok: "두 그래프 모두 전체에 대한 각 부분의 비율을 나타내요. 띠그래프는 띠 모양(가로를 100등분), 원그래프는 원 모양(원의 중심을 100등분)이에요." }) }) },
    { name: "약속하기", inst: "알게 된 것을 약속으로 정리해요.", hints: ["가 그래프는 띠 모양, 나 그래프는 원 모양이었어요.", "두 그래프는 전체에 대한 각 부분의 비율을 나타내요."],
      render: (b, a) => blanks(b, a, ["가 그래프와 같이 전체에 대한 각 부분의 ", { o: ["비율", "개수", "변화"], a: 0 }, "을 띠 모양에 나타낸 그래프를 ", { o: ["띠그래프", "원그래프", "막대그래프"], a: 0 }, "라 하고, 나 그래프와 같이 전체에 대한 각 부분의 비율을 원 모양에 나타낸 그래프를 ", { o: ["띠그래프", "원그래프", "꺾은선그래프"], a: 1 }, "라고 합니다."],
        { ok: "전체에 대한 각 부분의 비율을 띠 모양에 나타낸 그래프는 띠그래프, 원 모양에 나타낸 그래프는 원그래프예요." }) },
    { name: "확인하기", inst: "서우네 학교 체육관에 있는 공과 주성이네 마을 알뜰 장터의 판매량을 나타낸 그래프예요. 이 두 그래프는 작은 눈금이 몇 칸인지 세어 보고 답해 보세요.", hints: ["두 그래프는 전체를 20칸으로 나누었어요. 100 ÷ 20을 생각해요.", "배구공 부분은 작은 눈금 5칸이에요."],
      render: (b, a) => gr5Ask(b, a, [
        { fig: () => gr5Show(GR5D.ball), parts: ["전체에 대한 각 부분의 비율을 띠 모양에 나타낸 이 그래프는 ", { o: ["띠그래프", "원그래프"], a: 0 }, "예요. 작은 눈금 한 칸은 ", { n: 5, why: { "1": "이 그래프는 전체를 20칸으로 나누었어요. 100 ÷ 20을 계산해요.", "10": "수가 쓰여 있는 눈금 사이를 다시 둘로 나누었어요." } }, " %이고, 배구공의 수는 전체의 ", { n: 25 }, " %예요."] },
        { fig: () => gr5Show(GR5D.market), parts: ["원 모양에 나타낸 이 그래프는 ", { o: ["띠그래프", "원그래프"], a: 1 }, "예요. 눈금 한 칸은 ", { n: 5, why: { "1": "이 원은 둘레를 20칸으로 나누었어요." } }, " %이고, 판매량의 비율이 가장 높은 물품은 ", { o: ["학용품", "의류", "장난감"], a: 0 }, "이에요."] }],
      { ok: "눈금 한 칸의 크기는 그래프마다 다를 수 있어요. 먼저 한 칸이 몇 %인지 확인해요." }) }
  ],
  challenge: { inst: "우리 주변에서 찾은 원그래프예요. 「독서 빈도별 학생 수의 비율」(출처: 공공뉴스, 2024)과 「부모의 출신 국적별 학생 수의 비율」(출처: 어린이조선일보, 2024)을 보고 답해 보세요. (빈도: 같은 현상이나 일이 반복되는 횟수)", hints: ["가장 큰 부분 다음으로 큰 부분을 찾아요.", "32.1 + 24.6을 계산해요."],
    render: (b, a) => gr5Pick(b, a, { figs: [GR5D.reading, GR5D.multi],
      qs: [{ q: "독서 빈도 중 비율이 두 번째로 높은 것을 눌러요.", at: [[0, 2]], why: { "0-1": "‘일주일에 한두 번’(31 %)은 가장 높아요. 두 번째로 높은 것을 찾아요." }, ok: "한 달에 한두 번(25 %)이 두 번째로 높아요." }],
      ask: [{ parts: ["매일 독서하는 학생은 전체의 ", { n: 18 }, " %예요. 부모의 출신 국적이 베트남과 중국인 학생은 모두 합하여 전체의 ", { n: 56.7, w: "5em", why: { "56": "소수 첫째 자리까지 더해요. 32.1 + 24.6 = 56.7이에요." } }, " %예요."] }],
      ok: "원그래프에서 각 부분의 비율을 읽고 더하거나 비교할 수 있어요." }) }
},
{
  id: "t3", no: 3, title: "띠그래프와 원그래프로 나타내는 방법을 알아볼까요", soop: "개념 구축하기(O)",
  question: "표를 보고 띠그래프와 원그래프로 나타내려면 어떻게 해야 할까요?",
  summary: "① 각 항목의 백분율을 구해요. ② 각 항목의 백분율의 합계가 100 %인지 확인해요. ③ 각 항목의 백분율만큼 선을 그어 띠(원)를 나누어요(이전 항목에 이어서, 원은 중심에서 눈금까지). ④ 나눈 부분에 각 항목의 내용과 백분율을 써요. ⑤ 그래프에 알맞은 제목을 써요.",
  steps: [
    { name: "백분율 구하기", inst: "승아네 학교 학생들이 고민 상담을 하는 대상을 조사하여 나타낸 표예요. 띠그래프와 원그래프로 나타내려면 먼저 무엇을 구해야 할까요? 전체 학생 수에 대한 고민 상담 대상별 학생 수의 백분율을 구해 표를 완성해 보세요.", hints: ["(고민 상담 대상별 학생 수) ÷ (전체 학생 수) × 100으로 백분율을 구해요.", "부모님: 50 ÷ 200 × 100 = 25예요."],
      render: (b, a) => { b.append(gr5HTbl("고민 상담 대상별 학생 수", ["대상", "친구", "부모님", "선후배", "형제", "기타", "합계"], [["학생 수(명)", 80, 50, 40, 20, 10, 200]]), h("p", { class: "gr5small" }, "자료의 수량이 적은 항목들을 모아서 ‘기타’로 나타내요."));
        gr5Ask(b, a, [{ parts: ["띠그래프와 원그래프로 나타내려면 먼저 전체에 대한 각 항목의 ", { o: ["백분율", "합계", "평균"], a: 0 }, "을 구해야 해요."] },
          { parts: ["친구 [80/200] × 100 = 40 (%)"] },
          { parts: ["부모님 [50/200] × 100 = ", { n: 25, why: { "50": "학생 수를 그대로 쓰면 안 돼요. 전체 200명에 대한 비율을 백분율로 바꿔요.", "0.25": "비율 0.25에 100을 곱해요." } }, " (%)"] },
          { parts: ["선후배 [40/200] × 100 = ", { n: 20 }, " (%), 형제 [20/200] × 100 = ", { n: 10 }, " (%), 기타 [10/200] × 100 = ", { n: 5 }, " (%)"] },
          { parts: ["각 항목의 백분율의 합계는 ", { n: 100, why: { "200": "학생 수의 합계가 아니라 백분율의 합계를 구해요." } }, " %예요."] }],
          { ok: "친구 40 %, 부모님 25 %, 선후배 20 %, 형제 10 %, 기타 5 %이고 합계는 100 %예요." }); } },
    { name: "띠그래프 완성하기", inst: "1의 표를 보고 띠그래프를 완성해 보세요. ‘친구(40 %)’는 미리 나타내 두었어요. 각 항목의 백분율만큼 이어서 선을 그어 띠를 나눈 다음, 나눈 부분에 내용과 백분율을 써요.", hints: ["부모님은 25 %이니 친구가 끝난 40 %에서 25칸 더 간 65 %에 선을 그어요.", "선후배는 65 %에서 20칸 더 간 85 %, 형제는 85 %에서 10칸 더 간 95 %예요."],
      render: (b, a) => gr5Draw(b, a, { g: GR5D.counsel, given: 1,
        ask: [{ parts: ["이 그래프에 알맞은 제목은 ", { o: ["고민 상담 대상별 학생 수의 비율", "고민거리별 학생 수의 비율", "연도별 고민 상담 학생 수의 변화"], a: 0 }, "이에요."] }],
        ok: "띠를 40 %, 65 %, 85 %, 95 % 자리에서 나누었어요. 띠 안에 쓰기 어려우면 화살표를 써서 그래프 밖에 써도 돼요." }) },
    { name: "원그래프 완성하기", inst: "1의 표를 보고 원그래프를 완성해 보세요. ‘친구(40 %)’는 미리 나타내 두었어요. 원을 나눌 때에는 원의 중심에서 눈금까지 선으로 잇고, 이전 항목에 이어서 백분율만큼 선을 그어요.", hints: ["0에서 시계 방향으로 친구 40칸이 끝났어요. 부모님은 그 자리에서 25칸 더 가요.", "선은 원의 중심에서 시작해요. 65, 85, 95 자리에 선을 그어요."],
      render: (b, a) => gr5Draw(b, a, { g: Object.assign({}, GR5D.counsel, { kind: "pie" }), given: 1,
        ask: [{ parts: ["원을 나누는 선은 ", { o: ["원의 중심에서 눈금까지", "원 위의 아무 두 점 사이"], a: 0, why: { "1": "원의 중심을 지나지 않게 아무렇게나 나누면 부분의 크기가 백분율과 맞지 않아요." } }, " 그어요. 이 그래프의 제목은 ", { o: ["고민 상담 대상별 학생 수의 비율", "고민 상담 대상별 학생 수"], a: 0 }, "이에요."] }],
        ok: "원의 중심에서 눈금까지 선을 그어 40, 65, 85, 95 자리에서 원을 나누었어요." }) },
    { name: "약속하기", inst: "띠그래프와 원그래프로 나타내는 방법을 차례대로 정리해 보세요.", hints: ["백분율을 구하고, 합계가 100 %인지 확인한 다음 나누어요.", "제목은 먼저 써도 돼요. 여기서는 마지막에 써요."],
      render: (b, a) => gr5Chain(b, a, [
        (bx, ax) => sequence(bx, ax, ["㉠ 나눈 부분에 각 항목의 내용과 백분율 쓰기", "㉡ 각 항목의 백분율 구하기", "㉢ 그래프에 알맞은 제목 쓰기", "㉣ 각 항목의 백분율만큼 선을 그어 띠(원) 나누기", "㉤ 각 항목의 백분율의 합계가 100 %인지 확인하기"], [1, 4, 3, 0, 2],
          { ok: "백분율 구하기 → 합계 100 % 확인 → 백분율만큼 나누기 → 내용과 백분율 쓰기 → 제목 쓰기예요." }),
        (bx, ax) => gr5Ask(bx, ax, [{ q: "보기 자료 「좋아하는 운동별 학생 수의 비율」이에요. 전체 학생은 50명이에요.", fig: () => gr5Show([GR5D.sport, Object.assign({}, GR5D.sport, { kind: "pie" })]),
          parts: ["줄넘기 18명은 [18/50] × 100 = ", { n: 36 }, " %, 야구 5명은 ", { n: 10 }, " %예요. 네 항목의 백분율의 합계는 ", { n: 100 }, " %예요."] }],
          { ok: "줄넘기 36 %, 축구 30 %, 피구 24 %, 야구 10 %로 합계는 100 %예요." })]) },
    { name: "확인하기", inst: "재호네 학교 6학년 학생들이 배우고 싶어 하는 전통 악기를 조사한 표예요. 표를 완성하고 띠그래프로 나타내 보세요.", hints: ["장구: 36 ÷ 120 × 100 = 30이에요.", "꽹과리가 끝난 35 %에서 이어서 30칸 더 가요."],
      render: (b, a) => gr5Chain(b, a, [
        (bx, ax) => { bx.append(gr5HTbl("배우고 싶어 하는 전통 악기별 학생 수", ["전통 악기", "꽹과리", "장구", "단소", "북", "합계"], [["학생 수(명)", 42, 36, 30, 12, 120], ["백분율(%)", 35, "", "", "", ""]]));
          gr5Ask(bx, ax, [{ parts: ["장구 ", { n: 30 }, " %, 단소 ", { n: 25 }, " %, 북 ", { n: 10, why: { "12": "학생 수를 그대로 썼어요. 12 ÷ 120 × 100을 계산해요." } }, " %, 합계 ", { n: 100 }, " %"] }], { ok: "장구 30 %, 단소 25 %, 북 10 %이고 합계는 100 %예요." }); },
        (bx, ax) => gr5Draw(bx, ax, { g: GR5D.instr, given: 1, ok: "꽹과리(35 %) | 장구(30 %) | 단소(25 %) | 북(10 %)으로 나타냈어요." })]) }
  ],
  challenge: { inst: "수진이네 반 학생들이 좋아하는 음료수를 조사한 표예요. 표를 완성하고 원그래프로 나타내 보세요.", hints: ["주스: 5 ÷ 25 × 100 = 20이에요.", "탄산음료 44 %, 이온 음료 28 %가 끝난 72 %에서 이어서 20칸 더 가요."],
    render: (b, a) => gr5Chain(b, a, [
      (bx, ax) => { bx.append(gr5HTbl("좋아하는 음료수별 학생 수", ["음료수", "탄산음료", "이온 음료", "주스", "우유", "합계"], [["학생 수(명)", 11, 7, 5, 2, 25], ["백분율(%)", 44, 28, "", "", ""]]));
        gr5Ask(bx, ax, [{ parts: ["주스 ", { n: 20 }, " %, 우유 ", { n: 8, why: { "2": "학생 수를 그대로 썼어요. 2 ÷ 25 × 100을 계산해요." } }, " %, 합계 ", { n: 100 }, " %"] }], { ok: "주스 20 %, 우유 8 %예요." }); },
      (bx, ax) => gr5Draw(bx, ax, { g: GR5D.drink, given: 2, ok: "탄산음료 44 %, 이온 음료 28 %, 주스 20 %, 우유 8 %로 원을 나누었어요." })]) }
},
{
  id: "t45", no: "4~5", title: "자료를 조사하여 띠그래프와 원그래프로 나타내어 볼까요", soop: "탐구 정리하기(O)",
  question: "우리가 정한 주제로 자료를 조사하여 띠그래프와 원그래프로 나타내고, 알 수 있는 내용을 이야기해 볼까요?",
  summary: "주제와 조사할 항목, 조사 방법을 정해 자료를 조사하고 표로 정리해요. 수량이 적은 항목은 ‘기타’로 묶을 수 있어요. 각 항목의 백분율을 구하고(반올림하여 합계가 100 %가 되지 않으면 맞추어요), 띠그래프나 원그래프로 나타낸 다음 알 수 있는 내용을 이야기해요.",
  steps: [
    { name: "주제와 조사 방법 정하기", inst: "승아는 또래 상담사 친구들과 학교생활에 대한 주제를 정하여 조사하려고 해요. “무엇을 먼저 해야 할까?” “주제와 조사할 항목을 정해야 해.” “어떻게 조사해야 할지도 함께 정하자.”", hints: ["친구 관계가 고민인 학생이 가장 많았어요(2차시).", "공학 도구, 종이 설문지, 손 들기, 스티커 붙이기 등으로 조사할 수 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "“친구 관계가 고민인 학생이 많으니 □을(를) 조사해 보면 어때?” □에 알맞은 주제를 골라요.", o: ["친구에게 듣고 싶어 하는 말", "학교 건물의 높이", "어제의 날씨"], a: 0 },
        { q: "‘친구에게 듣고 싶어 하는 말’을 조사할 항목으로 알맞은 것을 모두 골라요.", o: ["같이 놀자", "고마워", "넌 좋은 친구야", "오늘 급식 메뉴"], a: [0, 1, 2], why: { "3": "급식 메뉴는 친구에게 듣고 싶어 하는 말이 아니에요." } },
        { q: "자료를 조사하는 방법으로 알맞은 것을 모두 골라요.", o: ["공학 도구로 자료 수집하기", "종이 설문지로 조사하기", "직접 손 들기", "스티커 붙이기", "조사하지 않고 짐작하여 쓰기"], a: [0, 1, 2, 3], why: { "4": "짐작한 것은 조사한 자료가 아니에요." } },
        { q: "조사할 항목이 너무 많으면 어떻게 할까요?", o: ["비슷한 항목끼리 묶어 항목 수를 줄여요", "항목을 모두 지워요"], a: 0 }],
      { ok: "주제(친구에게 듣고 싶어 하는 말), 조사할 항목, 조사 방법을 정했어요. 역할을 나누어 소외되는 친구 없이 조사해요." }) },
    { name: "조사하여 표로 정리하기", inst: "승아네 모둠이 우리 반 학생 25명에게 받은 설문 쪽지를 정리해요(쪽지의 수는 지도서 예시 표와 같게 이 앱이 정했어요). 쪽지를 한 장씩 읽고 알맞은 칸을 눌러 표시한 다음 표를 완성해요.", hints: ["쪽지에 쓰인 말과 같은 칸을 눌러요.", "‘힘내’와 ‘응원할게’처럼 수량이 적은 항목은 모아서 ‘기타’로 나타낼 수 있어요."],
      render: (b, a) => gr5Survey(b, a, { names: ["같이 놀자", "정말 잘한다", "고마워", "넌 좋은 친구야", "힘내", "응원할게"], counts: [8, 6, 5, 4, 1, 1], seed: 23,
        ask: () => [{ q: "표시한 것을 세어 표에 써요.", parts: ["같이 놀자 ", { n: 8 }, "명, 정말 잘한다 ", { n: 6 }, "명, 고마워 ", { n: 5 }, "명, 넌 좋은 친구야 ", { n: 4 }, "명, 힘내 ", { n: 1 }, "명, 응원할게 ", { n: 1 }, "명"] },
          { parts: ["수량이 적은 ‘힘내’와 ‘응원할게’를 모아 ", { o: ["기타", "합계", "평균"], a: 0 }, "로 나타내면 ", { n: 2 }, "명이에요. 모두 ", { n: 25 }, "명이에요."] }],
        ok: "같이 놀자 8명, 정말 잘한다 6명, 고마워 5명, 넌 좋은 친구야 4명, 기타 2명, 합계 25명이에요." }) },
    { name: "백분율 구해 나타내기", inst: "조사한 자료를 정리한 표의 백분율을 구하고 띠그래프로 나타내 보세요. (단, 백분율은 반올림하여 소수 첫째 자리까지 나타내요.) 계산기를 써도 좋아요.", hints: ["같이 놀자: 8 ÷ 25 × 100 = 32예요.", "띠그래프의 가장 작은 눈금 한 칸은 1 %예요. 앞 항목에 이어서 나누어요."],
      render: (b, a) => { b.append(gr5Calc(), gr5HTbl("친구에게 듣고 싶어 하는 말별 학생 수", ["듣고 싶어 하는 말", "같이 놀자", "정말 잘한다", "고마워", "넌 좋은 친구야", "기타", "합계"], [["학생 수(명)", 8, 6, 5, 4, 2, 25]]));
        gr5Chain(b, a, [
          (bx, ax) => gr5Ask(bx, ax, [{ parts: ["같이 놀자 ", { n: 32 }, " %, 정말 잘한다 ", { n: 24 }, " %, 고마워 ", { n: 20 }, " %, 넌 좋은 친구야 ", { n: 16, why: { "4": "학생 수를 그대로 썼어요. 4 ÷ 25 × 100을 계산해요." } }, " %, 기타 ", { n: 8 }, " %, 합계 ", { n: 100 }, " %"] }],
            { ok: "백분율의 합계가 100 %예요. 이제 띠를 나누어 봐요." }),
          (bx, ax) => gr5Draw(bx, ax, { g: GR5D.words, given: 0,
            ask: [{ parts: ["이 그래프의 제목은 ", { o: ["친구에게 듣고 싶어 하는 말별 학생 수의 비율", "친구에게 듣고 싶어 하는 말별 학생 수의 변화"], a: 0 }, "이에요."] }],
            ok: "같이 놀자(32 %) | 정말 잘한다(24 %) | 고마워(20 %) | 넌 좋은 친구야(16 %) | 기타(8 %)로 나타냈어요." })]); } },
    { name: "공학 도구로 나타내기", inst: "공학 도구를 사용하여 띠그래프와 원그래프로 나타내 보세요. (교과서의 EBSMath 이지통계처럼 움직이는 이 앱의 도구예요.) ① 표의 제목과 내용을 써요. ② 계산 도구에서 합계와 백분율을 켜요. ③ 띠그래프와 원그래프를 골라 그려 봐요. ④ 그래프의 제목을 알맞게 바꾸어요.", hints: ["표의 제목은 「친구에게 듣고 싶어 하는 말별 학생 수」예요. 항목은 같이 놀자 8, 정말 잘한다 6, 고마워 5, 넌 좋은 친구야 4, 기타 2예요.", "그래프의 제목은 ‘…별 학생 수의 비율’로 써요. ‘항목 정렬’을 누르면 크기순으로 정렬돼요."],
      render: (b, a) => gr5Maker(b, a, { head: "듣고 싶어 하는 말", target: [["같이 놀자", 8], ["정말 잘한다", 6], ["고마워", 5], ["넌 좋은 친구야", 4], ["기타", 2]],
        ok: "공학 도구로 띠그래프와 원그래프를 그렸어요. 각 항목의 내용은 색깔로 구분되고, 항목 순서는 표 순서와 같아요." }) },
    { name: "알 수 있는 내용 말하기", inst: "모둠별로 나타낸 띠그래프와 원그래프를 보고 알 수 있는 내용을 이야기해 보세요. 그리고 반올림한 백분율의 합계가 100 %가 되지 않을 때 어떻게 하는지 알아봐요.", hints: ["띠그래프에서 가장 긴 부분을 찾아요.", "33.3 + 33.3 + 33.3 = 99.9예요. 한 항목을 0.1만큼 맞추어 합계를 100으로 만들어요."],
      render: (b, a) => gr5Ask(b, a, [
        { fig: () => gr5Show(GR5D.words), parts: ["우리 모둠이 나타낸 띠그래프를 살펴보면 친구에게 듣고 싶어 하는 말 중 비율이 가장 높은 것은 ", { o: ["같이 놀자", "고마워", "기타"], a: 0 }, "이고, 그 비율은 ", { n: 32 }, " %예요."] },
        { q: "다른 모둠은 학생 21명에게 학교생활 만족도를 손 들기로 조사했어요(이 앱이 정한 예). 만족 7명, 보통 7명, 불만족 7명이었어요.", parts: ["7 ÷ 21 × 100을 반올림하여 소수 첫째 자리까지 나타내면 ", { n: 33.3 }, " %이고, 세 항목을 더하면 ", { n: 99.9 }, " %예요. 합계가 100 %가 되도록 한 항목을 ", { n: 33.4 }, " %로 맞추어요."] }],
      { ok: "반올림하여 백분율의 합계가 100 %가 되지 않으면 반올림 값을 맞추어 합계가 100 %가 되게 해요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 기르고 싶어 하는 반려동물과 용돈의 용도를 조사한 예시 자료를 띠그래프와 원그래프로 나타내 보세요.", hints: ["강아지 9명 ÷ 20명 × 100 = 45예요.", "용돈: 저축 6 ÷ 20 × 100 = 30이에요."],
    render: (b, a) => gr5Chain(b, a, [
      (bx, ax) => { bx.append(gr5HTbl("기르고 싶어 하는 반려동물별 학생 수", ["반려동물", "강아지", "고양이", "햄스터", "앵무새", "합계"], [["학생 수(명)", 9, 5, 4, 2, 20]]));
        gr5Ask(bx, ax, [{ parts: ["강아지 ", { n: 45 }, " %, 고양이 ", { n: 25 }, " %, 햄스터 ", { n: 20 }, " %, 앵무새 ", { n: 10 }, " %"] }], { ok: "합계는 100 %예요." }); },
      (bx, ax) => gr5Draw(bx, ax, { g: GR5D.pet, given: 1, label: false, ok: "반려동물 띠그래프를 나타냈어요." }),
      (bx, ax) => { bx.append(gr5HTbl("용돈의 용도별 학생 수", ["용도", "저축", "취미", "간식", "학용품", "합계"], [["학생 수(명)", 6, 5, 5, 4, 20]]));
        gr5Ask(bx, ax, [{ parts: ["저축 ", { n: 30 }, " %, 취미 ", { n: 25 }, " %, 간식 ", { n: 25 }, " %, 학용품 ", { n: 20 }, " %"] }], { ok: "합계는 100 %예요." }); },
      (bx, ax) => gr5Draw(bx, ax, { g: GR5D.money, given: 1, label: false, ok: "용돈의 용도 원그래프를 나타냈어요." })]) }
},
{
  id: "t6", no: 6, title: "띠그래프와 원그래프를 해석해 볼까요", soop: "개념 구축하기(O)",
  question: "띠그래프와 원그래프를 보고 어떤 사실을 알 수 있을까요?",
  summary: "띠그래프와 원그래프에서 비율이 가장 높은(낮은) 항목, 비율이 같은 항목, 몇 % 이상 몇 % 이하인 항목, 몇 배인지 등을 알 수 있어요. 두 그래프를 함께 보면 학년끼리, 연도끼리 비율을 견줄 수 있어요.",
  steps: [
    { name: "두 띠그래프 읽기", inst: "승아네 학교 5학년과 6학년 학생들이 좋아하는 상담 활동을 조사하여 각각 나타낸 띠그래프예요. “5학년과 6학년 학생들이 좋아하는 상담 활동별 학생 수의 비율이 조금씩 다르네?” 띠그래프를 보고 물음에 답해 보세요.", hints: ["두 그래프는 같은 차례로 항목이 놓여 있어요.", "5학년의 대면 상담은 12 %예요. 6학년 그래프에서 12 %인 것을 찾아요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.g5, GR5D.g6],
        qs: [{ q: "5학년에서 비율이 가장 높은 상담 활동을 눌러요.", at: [[0, 1]], ok: "5학년은 나만의 칭찬 나무 만들기(35 %)예요." },
          { q: "6학년에서 비율이 가장 높은 상담 활동을 눌러요.", at: [[1, 0]], ok: "6학년은 응원 쪽지 주고받기(30 %)예요." },
          { q: "5학년의 ‘대면 상담’과 비율이 같은 6학년의 상담 활동을 눌러요.", at: [[1, 2]], why: { "1-4": "6학년의 대면 상담은 9 %예요. 5학년 대면 상담은 12 %예요." }, ok: "6학년의 감사 편지 쓰기가 12 %예요." }],
        ask: [{ parts: ["‘편지 상담’의 비율은 5학년이 ", { n: 15 }, " %, 6학년이 ", { n: 22 }, " %예요. ‘응원 쪽지 주고받기’의 비율은 ", { o: ["5학년", "6학년"], a: 1, why: { "0": "5학년은 23 %, 6학년은 30 %예요." } }, "이 더 높아요."] }],
        ok: "두 띠그래프를 견주어 학년마다 좋아하는 상담 활동의 비율을 알 수 있어요." }) },
    { name: "더 알아보기", inst: "두 띠그래프를 보고 더 알 수 있는 내용을 찾아보세요.", hints: ["5학년에서 15 %인 활동이 둘 있어요.", "27 ÷ 9를 계산해요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.g5, GR5D.g6],
        qs: [{ q: "5학년에서 비율이 같은 상담 활동 두 가지를 눌러요.", at: [[0, 2], [0, 3]], ok: "감사 편지 쓰기와 편지 상담이 모두 15 %예요." },
          { q: "두 학년 모두 비율이 가장 낮은 상담 활동을 각각 눌러요.", at: [[0, 4], [1, 4]], ok: "두 학년 모두 대면 상담의 비율이 가장 낮아요." }],
        ask: [{ parts: ["6학년에서 ‘나만의 칭찬 나무 만들기’(27 %)는 ‘대면 상담’(9 %)의 ", { n: 3, why: { "18": "27 − 9는 차이예요. 몇 배인지는 27 ÷ 9로 구해요." } }, "배예요."] }],
        ok: "비율이 같은 항목, 가장 낮은 항목, 몇 배인지도 알 수 있어요." }) },
    { name: "원그래프 해석하기", inst: "2022년에 초등학교에서 안전사고가 발생한 시간과 장소를 조사하여 각각 나타낸 원그래프예요(출처: 학교안전공제중앙회, 2024). 원그래프를 보고 답해 보세요.", hints: ["15 % 이상 30 % 이하이면 15 %와 30 %도 들어가요. 14.4 %와 32.4 %는 들어가지 않아요.", "장소에서는 통로 17.9 %, 교실 19.3 %, 운동장 26.3 %가 그 범위에 있어요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.sTime, GR5D.sPlace],
        qs: [{ q: "안전사고가 발생한 시간 중 비율이 가장 높은 것을 눌러요.", at: [[0, 0]], ok: "체육 수업 시간(32.4 %)이에요." },
          { q: "안전사고가 발생한 장소 중 비율이 가장 높은 것을 눌러요.", at: [[1, 0]], ok: "체육관 등 부속 시설(33 %)이에요." },
          { q: "발생 시간 중 비율이 15 % 이상 30 % 이하인 것을 모두 눌러요.", at: [[0, 1], [0, 2]], why: { "0-3": "체육 외 수업 시간은 14.4 %로 15 %보다 낮아요.", "0-0": "체육 수업 시간은 32.4 %로 30 %보다 높아요." }, ok: "점심시간과 휴식·청소 시간이에요." },
          { q: "발생 장소 중 비율이 15 % 이상 30 % 이하인 것을 모두 눌러요.", at: [[1, 1], [1, 2], [1, 3]], why: { "1-0": "체육관 등 부속 시설은 33 %로 30 %보다 높아요.", "1-4": "기타는 3.5 %예요." }, ok: "운동장, 교실, 통로예요." }],
        ok: "두 원그래프에서 비율이 가장 높은 것과 범위에 드는 것을 찾았어요." }) },
    { name: "글 완성하기", inst: "2의 원그래프를 보고 초등학교에서 안전사고를 줄이기 위한 글을 완성해 보세요.", hints: ["발생 시간과 발생 장소에서 비율이 가장 높은 것을 넣어요.", "가장 많이 일어나는 때와 곳에서 조심하자고 알리는 방법을 생각해요."],
      render: (b, a) => gr5Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["초등학교에서 안전사고가 발생한 시간 중 비율이 가장 높은 때는 ", { o: ["체육 수업 시간", "점심시간", "등하교 시간"], a: 0 }, "이고, 안전사고가 발생한 장소 중 비율이 가장 높은 곳은 ", { o: ["체육관 등 부속 시설", "교실", "통로"], a: 0 }, "이므로 안전사고를 줄이기 위해 ", { o: ["체육 수업 시간에 체육관을 사용하는 경우 주의해야 할 점에 대한 캠페인을", "교실 청소를 하지 않도록", "점심시간을 없애도록"], a: 0 }, " 해야 합니다."],
          { ok: "비율이 가장 높은 때와 곳을 근거로 안전사고를 줄이는 방법을 정했어요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "그래프를 근거로, 안전사고를 줄이기 위한 나의 생각을 한 가지 더 써 보세요.", tag: "나의 생각", ph: "예) 점심시간의 비율이 22.3 %로 두 번째로 높으니 점심시간에 운동장에서 뛰지 않기 캠페인을 해요." }],
          { ok: "그래프의 수를 근거로 생각을 썼어요." })]) },
    { name: "확인하기", inst: "미주네 학교 학생들의 체험 활동과 체험 활동 만족도를 조사하여 나타낸 원그래프예요. 그래프를 보고 답해 보세요.", hints: ["가장 큰 부분 다음으로 큰 부분을 찾아요.", "20 % 이하는 20 %이거나 20 %보다 낮은 것이에요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.act, GR5D.sat],
        qs: [{ q: "체험 활동 중 비율이 두 번째로 높은 것을 눌러요.", at: [[0, 1]], why: { "0-0": "도자기 만들기(32 %)는 가장 높아요." }, ok: "연날리기(26 %)예요." },
          { q: "체험 활동 만족도 중 비율이 20 % 이하인 것을 모두 눌러요.", at: [[1, 3], [1, 4]], why: { "1-2": "보통은 22 %로 20 %보다 높아요." }, ok: "불만족(9 %)과 매우 불만족(7 %)이에요." }],
        ask: [{ parts: ["‘매우 만족’인 학생 수는 전체의 ", { n: 36 }, " %예요."] }],
        ok: "원그래프에서 차례, 범위, 비율을 읽을 수 있어요." }) }
  ],
  challenge: { inst: "어느 지역의 곡식별 생산량을 조사하여 나타낸 두 띠그래프예요. 그래프를 보고 답해 보세요.", hints: ["2021년의 밀은 13 %예요. 2023년에서 13 %인 곡식을 찾아요.", "2021년보다 2023년에 백분율이 커진 곡식을 찾아요."],
    render: (b, a) => gr5Pick(b, a, { figs: [GR5D.grain21, GR5D.grain23],
      qs: [{ q: "2023년 곡식 중 2021년의 밀 생산량의 비율과 같은 것을 눌러요.", at: [[1, 2]], why: { "1-3": "2023년의 밀은 14 %예요. 2021년 밀은 13 %예요." }, ok: "2023년의 조가 13 %예요." },
        { q: "2021년에 비해 2023년에 비율이 늘어난 곡식을 2023년 그래프에서 모두 눌러요.", at: [[1, 1], [1, 3]], why: { "1-0": "쌀은 42 %에서 34 %로 줄었어요.", "1-2": "조는 14 %에서 13 %로 줄었어요." }, ok: "보리(31 → 39 %)와 밀(13 → 14 %)이에요." }],
      then: (box, api) => quiz(box, api, [{ q: "두 띠그래프를 옳게 해석한 것을 골라요.", o: ["비율이 가장 높은 곡식은 2021년에는 쌀, 2023년에는 보리예요", "2023년에는 쌀의 비율이 늘어났어요", "두 해 모두 비율이 가장 낮은 곡식은 조예요"], a: 0, why: { "1": "쌀은 42 %에서 34 %로 줄었어요.", "2": "2021년에 가장 낮은 곡식은 밀(13 %)이에요." } }],
        { ok: "2021년에는 쌀(42 %), 2023년에는 보리(39 %)의 비율이 가장 높아요." }) }) }
},
{
  id: "t7", no: 7, title: "여러 가지 그래프를 활용해 볼까요", soop: "탐구 정리하기(O)",
  question: "자료를 나타내기에 알맞은 그래프는 무엇일까요?",
  summary: "그림그래프는 그림의 크기와 수로, 막대그래프는 막대의 길이로 수량의 많고 적음을 비교해요. 꺾은선그래프는 시간에 따른 수량의 변화를, 띠그래프와 원그래프는 전체에 대한 각 부분의 비율을 한눈에 알아보기 편리해요. 목적에 따라 알맞은 그래프를 골라요.",
  steps: [
    { name: "두 그래프 비교하기", inst: "승아가 우리나라의 연도별 스마트폰 과의존 초등학생 수의 비율(출처: 국가통계포털, 2024)과 반 친구들이 스마트폰 대신 하고 싶어 하는 여가 활동을 조사하여 나타낸 그래프예요. (스마트폰 과의존: 스마트폰을 과도하게 사용하고, 스마트폰 이용 조절 능력이 떨어져 일상생활에 문제가 생기는 상태)", hints: ["1년 전과 비교하여 늘어난 만큼: 2020년 30.5 − 24.4, 2021년 31.6 − 30.5, 2022년 33.6 − 31.6이에요.", "20 % 이상 30 % 이하이면 20과 30도 들어가요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.phone, GR5D.free],
        qs: [{ q: "꺾은선그래프에서 1년 전과 비교하여 비율이 가장 많이 늘어난 해의 점을 눌러요.", at: [[0, 1]], why: { "0-3": "2022년은 31.6에서 33.6으로 2.0만큼 늘었어요. 2020년은 6.1만큼 늘었어요.", "0-2": "2021년은 1.1만큼 늘었어요." }, ok: "2020년이에요. 24.4에서 30.5로 6.1만큼 늘었어요." },
          { q: "띠그래프에서 비율이 20 % 이상 30 % 이하인 여가 활동을 모두 눌러요.", at: [[1, 1], [1, 2]], why: { "1-0": "운동은 32 %로 30 %보다 높아요." }, ok: "독서(29 %)와 퍼즐·보드게임(22 %)이에요." }],
        ask: [{ parts: ["조사한 자료를 각각 ", { o: ["꺾은선그래프와 띠그래프", "막대그래프와 원그래프"], a: 0 }, "로 나타냈어요. 2019년부터 2022년까지 스마트폰 과의존 초등학생 수의 비율은 ", { o: ["늘어났어요", "줄어들었어요"], a: 0 }, "."] },
          { parts: ["꺾은선그래프는 ", { o: ["시간에 따른 수량의 변화", "전체에 대한 각 부분의 비율"], a: 0 }, "를 쉽게 알 수 있고, 띠그래프는 ", { o: ["시간에 따른 수량의 변화", "전체에 대한 각 부분의 비율"], a: 1 }, "을 한눈에 알아보기 쉬워요."] }],
        ok: "꺾은선그래프는 시간에 따른 변화, 띠그래프는 전체에 대한 각 부분의 비율을 알아보기 편리해요." }) },
    { name: "산불 그래프 읽기", inst: "10년간 요일별 산불 평균 발생 건수와 계절별 산불 평균 발생 건수를 조사하여 각각 나타낸 그래프예요(출처: 국가통계포털, 2024). 그래프를 보고 답해 보세요.", hints: ["막대가 가장 긴 요일을 찾아요. 막대의 길이가 같은 두 요일도 있어요.", "원그래프에서 가장 큰 부분과 가장 작은 부분을 찾아요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.fireDay, GR5D.fireSeason],
        qs: [{ q: "막대그래프에서 산불 평균 발생 건수가 가장 많은 요일을 눌러요.", at: [[0, 6]], why: { "0-5": "토요일은 86건, 일요일은 87건이에요." }, ok: "일요일(87건)이에요." },
          { q: "막대그래프에서 산불 평균 발생 건수가 같은 두 요일을 눌러요.", at: [[0, 2], [0, 4]], ok: "수요일과 금요일이 66건으로 같아요." },
          { q: "원그래프에서 비율이 가장 높은 계절과 가장 낮은 계절을 눌러요.", at: [[1, 0], [1, 2]], why: { "1-1": "여름은 9.2 %, 가을은 8.6 %예요. 가을이 더 낮아요." }, ok: "봄(56.5 %)이 가장 높고 가을(8.6 %)이 가장 낮아요." }],
        ask: [{ parts: ["막대그래프는 막대의 ", { o: ["길이", "기울기"], a: 0 }, "로 수량의 많고 적음을 한눈에 비교하기 편리하고, 원그래프는 전체에 대한 각 부분의 ", { o: ["비율", "변화"], a: 0 }, "을 한눈에 알아보기 편리해요."] }],
        ok: "같은 산불 자료도 목적에 따라 막대그래프와 원그래프로 나타낼 수 있어요." }) },
    { name: "그래프의 특징 정리하기", inst: "여러 가지 그래프의 특징을 정리해요. 카드를 하나 골라 알맞은 그래프 칸을 눌러 넣어 보세요.", hints: ["꺾은선그래프는 시간에 따라 변하는 양을 나타내요.", "띠그래프와 원그래프는 전체에 대한 각 부분의 비율을 나타내요."],
      render: (b, a) => gr5Sort(b, a, { bins: ["그림그래프", "막대그래프", "꺾은선그래프", "띠그래프·원그래프"],
        cards: [{ t: "그림의 크기와 수로 수량의 많고 적음을 알 수 있어요", b: 0 }, { t: "지역이나 위치에 따른 자료를 나타내기 좋아요", b: 0 },
          { t: "막대의 길이로 수량의 많고 적음을 한눈에 비교해요", b: 1, why: "막대그래프는 수량의 ‘변화’가 아니라 많고 적음을 비교하기 편리해요." }, { t: "시간에 따른 수량의 변화를 쉽게 알 수 있어요", b: 2, why: "시간에 따라 변하는 양은 꺾은선그래프가 잘 보여 줘요." },
          { t: "연속적으로 변화하는 양을 나타낼 수 있어요", b: 2 }, { t: "전체에 대한 각 부분의 비율을 한눈에 알아보기 쉬워요", b: 3 },
          { t: "각 항목의 비율을 비교하기 편리해요", b: 3, why: "비율을 비교하는 것은 띠그래프·원그래프의 특징이에요." }],
        ok: "그림그래프·막대그래프는 많고 적음, 꺾은선그래프는 변화, 띠그래프·원그래프는 전체에 대한 각 부분의 비율을 보여 줘요." }) },
    { name: "알맞은 그래프 고르기", inst: "자료를 나타내기에 알맞은 그래프를 모두 골라 보세요. 목적에 따라 하나의 주제를 여러 그래프로 나타낼 수 있어요.", hints: ["지역별 쌀 생산량은 많고 적음을 비교하는 자료예요. 지역에 그림을 놓을 수도 있어요.", "득표 비율은 전체에 대한 각 부분의 비율이고, 기온은 시간에 따라 연속적으로 변해요."],
      render: (b, a) => gr5Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [
          { q: "우리나라 지역별 쌀 생산량", o: ["그림그래프", "막대그래프", "꺾은선그래프", "띠그래프", "원그래프"], a: [0, 1], why: { "2": "지역별 생산량은 시간에 따라 변하는 양이 아니에요." } },
          { q: "전교 학생 회장 선거의 후보자별 득표 비율", o: ["그림그래프", "막대그래프", "꺾은선그래프", "띠그래프", "원그래프"], a: [3, 4], why: { "0": "비율을 나타내는 자료에는 띠그래프나 원그래프가 알맞아요." } },
          { q: "시각별 기온의 변화", o: ["그림그래프", "막대그래프", "꺾은선그래프", "띠그래프", "원그래프"], a: [2], why: { "3": "띠그래프는 비율을 나타내요. 시간에 따른 변화는 꺾은선그래프가 알맞아요." } }],
          { ok: "쌀 생산량은 그림그래프·막대그래프, 득표 비율은 띠그래프·원그래프, 기온의 변화는 꺾은선그래프가 알맞아요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "‘시각별 기온의 변화’를 꺾은선그래프로 나타내면 좋은 까닭을 써 보세요.", tag: "까닭", ph: "예) 기온은 시간이 지남에 따라 연속적으로 변화하기 때문이에요." }],
          { ok: "그래프의 특징을 들어 까닭을 썼어요." })]) },
    { name: "확인하기", inst: "수학익힘 문제예요. 막대그래프와 원그래프, 그림그래프와 띠그래프를 보고 답해 보세요. (도시별 병원 수는 이 앱이 정한 수예요.)", hints: ["240 ÷ 120을 계산해요.", "막대그래프는 ‘변화’가 아니라 많고 적음을, 띠그래프는 ‘비율의 변화’가 아니라 비율을 보여 줘요."],
      render: (b, a) => gr5Ask(b, a, [
        { fig: () => gr5Show([GR5D.farm, GR5D.farmA]), parts: ["가 농장의 과일나무 수는 나 농장의 ", { n: 2 }, "배이고, 가 농장의 배나무는 가 농장 과일나무 수의 ", { n: 29 }, " %예요."] },
        { parts: ["잘못 설명한 것은 ", { o: ["㉠ 막대그래프는 막대의 길이로 과일나무 수의 변화를 한눈에 비교하기 편리합니다.", "㉡ 원그래프는 종류별 과일나무 수의 비율을 한눈에 알아보기 편리합니다."], a: 0, why: { "1": "㉡은 옳은 설명이에요. 막대그래프가 ‘변화’를 보여 준다는 ㉠을 다시 봐요." } }, "이에요."] },
        { fig: () => gr5Show([GR5D.hosp, GR5D.clinic]), parts: ["병원 수가 가장 적은 도시는 ", { o: ["가", "나", "다", "라"], a: 0 }, " 도시이고, 나 도시의 진료과 중 비율이 가장 높은 것은 ", { o: ["내과", "이비인후과", "소아과"], a: 0 }, "예요."] },
        { parts: ["옳게 설명한 것은 ", { o: ["㉠ 그림그래프는 그림의 크기와 수로 많고 적음을 비교하기 편리합니다.", "㉡ 띠그래프는 각 항목의 비율의 변화를 한눈에 알아보기 편리합니다."], a: 0, why: { "1": "띠그래프는 한 시점의 전체에 대한 각 부분의 비율을 보여 줘요. 변화는 꺾은선그래프가 알맞아요." } }, "이에요."] }],
      { ok: "그래프마다 편리한 점이 달라요. 자료와 목적에 알맞은 그래프를 골라요." }) }
  ],
  challenge: { inst: "자료에 알맞은 그래프를 모두 골라 보세요(자료는 이 앱이 정했어요).", hints: ["시간에 따라 변하는 양인지, 비율인지, 많고 적음인지 먼저 생각해요.", "비율을 비교할 때는 띠그래프와 원그래프가 알맞아요."],
    render: (b, a) => quiz(b, a, [
      { q: "6년 동안 매년 잰 나의 키의 변화", o: ["그림그래프", "막대그래프", "꺾은선그래프", "띠그래프", "원그래프"], a: [2] },
      { q: "우리 반 학생들이 좋아하는 과일별 학생 수의 비율", o: ["그림그래프", "막대그래프", "꺾은선그래프", "띠그래프", "원그래프"], a: [3, 4] },
      { q: "마을별 나무 수", o: ["그림그래프", "막대그래프", "꺾은선그래프", "띠그래프", "원그래프"], a: [0, 1], why: { "2": "마을별 나무 수는 시간에 따라 변하는 양이 아니에요." } }],
      { ok: "키의 변화는 꺾은선그래프, 과일별 비율은 띠그래프·원그래프, 마을별 나무 수는 그림그래프·막대그래프가 알맞아요." }) }
},
{
  id: "t89", no: "8~9", title: "생각을 더하다 ― 자료를 보고 판단해 볼까요", soop: "발표하기(P)",
  question: "비율이 같으면 실제 양도 같을까요?",
  summary: "띠그래프와 원그래프는 비율을 나타내요. 전체의 양이 다르면 비율이 같아도 실제 양은 다를 수 있고, 비율이 늘어나도 전체의 양이 줄면 실제 양은 줄 수 있어요. 그래프와 표를 함께 보고 판단해요.",
  steps: [
    { name: "띠그래프와 표 살펴보기", inst: "2000년부터 2020년까지 우리나라 권역별 인구의 비율과 연도별 전체 인구를 조사하여 각각 나타낸 것이에요(출처: 국가통계포털, 2024). 띠그래프와 표를 살펴보세요.", hints: ["띠그래프는 비율, 표는 전체 인구를 나타내요.", "2000년 호남권 11.4 %와 충청권 10.1 %, 2010년 충청권 10.4 %와 호남권 10.2 %를 견주어요."],
      render: (b, a) => { b.append(h("div", {}, GR5_REGION_BANDS.map(g => gr5Graph(g).el)), gr5HTbl("연도별 전체 인구", ["연도", "2000년", "2010년", "2020년"], [["인구(천 명)", "47,008", "49,554", "51,836"]]));
        quiz(b, a, [
          { q: "띠그래프와 표는 각각 무엇을 나타내나요?", o: ["띠그래프는 권역별 인구의 비율, 표는 연도별 전체 인구", "띠그래프는 연도별 전체 인구, 표는 권역별 인구의 비율"], a: 0 },
          { q: "시연: “2000년에 비해 2020년의 수도권 인구의 비율은 늘어났어.” 이 말은 옳을까요?", o: ["옳아요", "틀려요"], a: 0, why: { "1": "수도권은 46.3 %에서 50.2 %로 늘어났어요." } },
          { q: "정욱: “비율이 세 번째로 높은 권역은 2000년에는 호남권이고, 2010년에는 충청권이야.” 이 말은 옳을까요?", o: ["옳아요", "틀려요"], a: 0, why: { "1": "2000년은 호남권 11.4 % > 충청권 10.1 %, 2010년은 충청권 10.4 % > 호남권 10.2 %예요." } }],
          { ok: "시연이와 정욱이의 말은 옳아요. 이제 지성이의 말을 살펴봐요." }); } },
    { name: "실제 양으로 보기", inst: "지성: “2000년과 2010년의 제주권의 인구는 같아.” ‘비율로 보기’와 ‘실제 양으로 보기’를 번갈아 누르고, 2000년과 2010년의 ‘제주권’ 부분을 눌러 보세요. 그다음 실제 인구를 구해 봐요(계산기를 써도 좋아요).", hints: ["두 해 모두 제주권의 비율은 1.1 %예요. 그런데 전체 인구는 같을까요?", "2000년 제주권 인구: 47008 × 0.011, 2010년: 49554 × 0.011이에요."],
      render: (b, a) => { b.append(gr5Calc());
        gr5Scaled(b, a, Object.assign({}, GR5_REGION, { need: [[0, 5], [1, 5]],
          ask: [{ parts: ["두 해의 제주권 인구의 비율은 모두 ", { n: 1.1 }, " %예요. 2000년 제주권 인구는 47008 × 0.011 = 517.088이므로 약 ", { n: 517, why: { "517.088": "반올림하여 일의 자리까지 써요." } }, "천 명, 2010년 제주권 인구는 49554 × 0.011 = 545.094이므로 약 ", { n: 545 }, "천 명이에요(반올림하여 일의 자리까지)."] }],
          ok: "비율은 1.1 %로 같지만 전체 인구가 달라서 제주권 인구는 2000년 약 517천 명, 2010년 약 545천 명으로 달라요." })); } },
    { name: "잘못 설명한 사람 찾기", inst: "띠그래프와 표를 보고 잘못 설명한 사람을 찾아 내용을 옳게 고쳐 보세요.", hints: ["비율이 같아도 전체 인구가 다르면 인구는 달라요.", "띠그래프로는 비율이 같다고만 말할 수 있어요."],
      render: (b, a) => gr5Ask(b, a, [
        { parts: ["잘못 설명한 사람은 ", { o: ["시연", "정욱", "지성"], a: 2, why: { "0": "수도권의 비율은 46.3 %에서 50.2 %로 늘어났으니 시연이는 옳아요.", "1": "정욱이가 말한 세 번째로 높은 권역은 옳아요." } }, "이에요."] },
        { parts: ["그 까닭은 2000년과 2010년의 제주권 인구의 비율은 같지만 ", { o: ["전체 인구가 다르기", "띠의 길이가 같기"], a: 0 }, " 때문이에요."] },
        { parts: ["옳게 고치면 “2000년과 2010년의 제주권 인구의 ", { o: ["비율은", "수는"], a: 0 }, " 같습니다.”예요."] }],
      { ok: "비율이 같아도 전체 인구가 다르면 인구는 다를 수 있어요. 지성이의 말은 “2000년과 2010년의 제주권 인구의 비율은 같습니다.”로 고쳐요." }) },
    { name: "원그래프와 표로 판단하기", inst: "2020년부터 2022년까지 우리나라 종류별 폐기물 발생량의 비율과 연도별 폐기물 발생량을 조사하여 나타낸 것이에요(출처: 한국폐기물협회, 2024). 원그래프와 표를 보고 사업장 폐기물의 실제 발생량을 구한 다음, 잘못 설명한 사람을 찾아 보세요.", hints: ["사업장 폐기물 발생량 = (연도별 폐기물 발생량) × (사업장의 비율)이에요.", "2022년: 18645 × 0.435 = 8110.575예요."],
      render: (b, a) => { b.append(gr5Show(GR5_WASTE.figs.map((g, i) => ({ g, lead: GR5_WASTE.years[i] })), {}), gr5HTbl("연도별 폐기물 발생량", ["연도", "2020년", "2021년", "2022년"], [["발생량(만 t)", "19,546", "19,738", "18,645"]]), gr5Calc(),
          h("div", { class: "gr5say" }, "도윤: “생활계 폐기물 발생량의 비율은 2020년과 2021년이 같지만, 실제 발생량은 달라.”"), h("div", { class: "gr5say" }, "하린: “폐기물 발생량이 2021년에는 2020년보다 늘어났고, 2022년에는 2021년보다 줄어들었어.”"), h("div", { class: "gr5say" }, "효인: “사업장 폐기물 발생량은 점점 증가하고 있어.”"));
        gr5Ask(b, a, [
          { q: "사업장 폐기물 발생량을 반올림하여 일의 자리까지 구해요(만 t).", parts: ["2020년 19546 × 0.414 ≈ ", { n: 8092, w: "5em" }, ", 2021년 19738 × 0.43 ≈ ", { n: 8487, w: "5em" }, ", 2022년 18645 × 0.435 ≈ ", { n: 8111, w: "5em", why: { "8110": "8110.575를 반올림하면 8111이에요." } }] },
          { parts: ["잘못 설명한 사람은 ", { o: ["도윤", "하린", "효인"], a: 2, why: { "0": "생활계의 비율은 두 해 모두 11.5 %이지만 전체 발생량이 달라 실제 발생량은 달라요. 도윤이는 옳아요.", "1": "19546 → 19738 → 18645이니 하린이는 옳아요." } }, "이에요. 2022년에 사업장 폐기물 발생량의 비율은 늘어났지만 실제 발생량은 ", { o: ["줄었어요", "늘었어요"], a: 0 }, "."] },
          { parts: ["옳게 고치면 “사업장 폐기물 발생량의 ", { o: ["비율이", "양이"], a: 0 }, " 점점 증가했습니다.”예요."] }],
          { ok: "2021년보다 2022년에 사업장의 비율은 늘었지만 전체 폐기물 발생량이 줄어 실제 발생량은 약 8487만 t에서 약 8111만 t으로 줄었어요." }); } },
    { name: "정리하기", inst: "자료를 보고 판단할 때 생각할 점을 정리해요.", hints: ["띠그래프와 원그래프는 비율을 나타내요.", "실제 양은 (전체의 양) × (비율)이에요."],
      render: (b, a) => blanks(b, a, ["띠그래프와 원그래프는 전체에 대한 각 부분의 ", { o: ["비율", "실제 양"], a: 0 }, "을 나타내요. 전체의 양이 다르면 비율이 같아도 실제 양은 ", { o: ["다를 수 있어요", "언제나 같아요"], a: 0 }, ". 비율이 늘어나도 전체의 양이 줄면 실제 양은 ", { o: ["줄어들 수 있어요", "반드시 늘어나요"], a: 0 }, ". 그래서 그래프와 ", { o: ["전체의 양을 나타낸 표", "그래프의 색깔"], a: 0 }, "를 함께 보고 판단해요."],
        { ok: "비율만 보고 실제 양을 말하면 안 돼요. 전체의 양도 함께 살펴봐요." }) }
  ],
  challenge: { inst: "도윤이의 말이 옳은지 실제 양을 구해 확인해 보세요. 생활계 폐기물의 비율은 2020년과 2021년 모두 11.5 %예요. (반올림하여 일의 자리까지, 계산기를 써도 좋아요.)", hints: ["2020년: 19546 × 0.115", "2021년: 19738 × 0.115"],
    render: (b, a) => { b.append(gr5Calc());
      gr5Ask(b, a, [
        { parts: ["2020년 생활계 폐기물 발생량은 약 ", { n: 2248, w: "5em", why: { "2247": "2247.79를 반올림하면 2248이에요." } }, "만 t, 2021년은 약 ", { n: 2270, w: "5em", why: { "2269": "2269.87을 반올림하면 2270이에요." } }, "만 t이에요."] },
        { parts: ["그러므로 도윤이의 말은 ", { o: ["옳아요", "틀려요"], a: 0 }, ". 2000년 수도권 인구는 47008 × 0.463 ≈ ", { n: 21765, w: "5.5em" }, "천 명이에요."] }],
        { ok: "비율이 11.5 %로 같아도 전체가 19546만 t, 19738만 t으로 달라서 실제 발생량은 약 2248만 t, 약 2270만 t으로 달라요." }); } }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 그래프를 설명하고 빙고를 완성해요", soop: "발표하기(P)",
  question: "그래프의 제목을 말하지 않고 그래프를 설명하여 빙고를 완성할 수 있을까요?",
  summary: "그래프를 보고 알 수 있는 내용(비율이 가장 높은 것, 어떤 항목의 비율, 몇 배인지, 합한 비율 등)을 말하면 친구가 알맞은 그래프를 찾아 ◯표 해요. 제목은 말하지 않아요. 그래프를 다양하고 옳게 해석하는 것이 중요해요.",
  steps: [
    { name: "놀이 방법 알기", inst: "인원은 2~4명이고, 여러 가지 그래프와 3×3 빙고판이 필요해요. 준비하기와 놀이 방법을 차례대로 눌러 보세요.", hints: ["먼저 그래프 9개를 빙고판에 붙이고 순서를 정해요.", "그래프의 제목은 말하면 안 돼요. 먼저 3줄을 완성하면 이겨요."],
      render: (b, a) => sequence(b, a, ["㉠ 순서대로 그래프 하나를 골라 그래프를 보고 알 수 있는 내용을 말해요(제목은 말하지 않아요)", "㉡ 그래프 9개를 골라 빙고판에 붙여요", "㉢ 먼저 가로, 세로, 대각선으로 3줄을 완성하는 사람이 이겨요", "㉣ 가위바위보로 놀이 순서를 정해요", "㉤ 내용에 알맞은 그래프가 내 빙고판에 있으면 ◯표 하고 서로 확인해요"], [1, 3, 0, 4, 2],
        { ok: "그래프 붙이기 → 순서 정하기 → 내용 말하기 → ◯표 하고 확인하기 → 3줄 완성하기예요." }) },
    { name: "말에 맞는 그래프 찾기", inst: "놀이를 하기 전에 연습해요. 친구가 말한 내용에 알맞은 그래프를 눌러 보세요. (가고 싶은 나라 그래프의 수는 이 앱이 정했어요.)", hints: ["말에 나온 항목의 이름을 그래프에서 찾아요.", "‘2배’라면 한 항목의 백분율이 다른 항목의 백분율의 2배인지 계산해요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5_BINGO[0], GR5_BINGO[1], GR5_BINGO[2]], whole: true, leads: ["가", "나", "다"],
        qs: [{ q: "“미국에 가고 싶어 하는 학생 수의 비율은 호주에 가고 싶어 하는 학생 수의 비율의 2배야.”", at: [[2, 0]], ok: "다 그래프예요. 미국 30 %는 호주 15 %의 2배예요." },
          { q: "“비율이 가장 높은 것은 학용품이야.”", at: [[0, 0]], ok: "가 그래프예요." },
          { q: "“장미의 비율은 전체의 25 %야.”", at: [[1, 0]], ok: "나 그래프예요." }],
        ok: "그래프에 나온 항목과 수를 보고 알맞은 그래프를 찾았어요." }) },
    { name: "빙고 놀이", inst: "친구(컴퓨터)와 번갈아 그래프를 설명하며 빙고 놀이를 해요. 그래프 12장 중 9장이 빙고판에 놓였어요(앞의 두 장은 교과서의 예, 나머지는 이 앱이 정한 그래프예요). 먼저 3줄을 완성해 보세요.", hints: ["친구가 말한 항목 이름이 있는 그래프를 내 빙고판에서 찾아요.", "내 차례에는 그래프의 수와 맞는 말을 골라요."],
      render: (b, a) => gr5Bingo(b, a, { cards: GR5_BINGO }) },
    { name: "내가 설명하기", inst: "「좋아하는 꽃별 학생 수의 비율」을 보고 알 수 있는 내용으로 옳은 것을 모두 골라 보세요.", hints: ["무궁화 28 %, 장미 25 %, 해바라기 20 %, 튤립 15 %, 기타 12 %예요.", "20 + 15 = 35예요."],
      render: (b, a) => quiz(b, a, [
        { q: "옳게 설명한 것을 모두 골라요.", fig: () => gr5Show(GR5_BINGO[1]), o: ["비율이 가장 높은 꽃은 무궁화예요", "해바라기와 튤립의 비율을 합하면 35 %예요", "장미의 비율은 튤립의 비율의 2배예요", "튤립의 비율은 전체의 25 %예요"], a: [0, 1], why: { "2": "장미 25 %는 튤립 15 %의 2배가 아니에요(15 × 2 = 30).", "3": "튤립은 15 %예요. 25 %는 장미예요." } },
        { q: "그래프를 설명할 때 그래프의 제목을 말하면 안 되는 까닭은 무엇일까요?", o: ["제목을 말하면 그래프를 해석하지 않고도 찾을 수 있기 때문이에요", "제목이 너무 길기 때문이에요"], a: 0 }],
      { ok: "그래프의 수를 근거로 옳게 해석해서 말해야 친구가 알맞은 그래프를 찾을 수 있어요." }) },
    { name: "정리하기", inst: "놀이를 되돌아봐요.", hints: ["여러 가지 내용을 말할 수 있으면 유리해요.", "옳게 해석하는 것이 가장 중요해요."],
      render: (b, a) => quiz(b, a, [
        { q: "빙고 놀이에서 이기려면 어떻게 하면 좋을까요? 모두 골라요.", o: ["그래프를 다양하게 해석해요", "상대가 말한 내용이 어떤 그래프인지 빠르게 찾아요", "그래프의 제목을 크게 말해요"], a: [0, 1], why: { "2": "제목은 말하면 안 돼요." } },
        { q: "놀이를 하며 가장 중요하게 생각해야 할 것은 무엇일까요?", o: ["수학적 사실을 바탕으로 그래프를 옳게 해석하기", "빨리 끝내기"], a: 0 }],
      { ok: "놀이 자체보다 그래프를 옳게 해석하는 것이 중요해요." }) }
  ],
  challenge: { inst: "또 다른 놀이예요. 주사위 2개를 동시에 던져 두 눈의 수의 차를 기록해요. 10번 던진 다음 기록표를 정리하고 띠그래프로 나타내 보세요. 친구와 할 때는 ‘두 눈의 수의 차가 3’인 횟수의 비율이 가장 높은 사람이 이겨요.", hints: ["10번 던졌으니 한 번은 10 %예요.", "횟수 × 10이 백분율이에요."],
    render: (b, a) => gr5Dice(b, a, { n: 10 }) }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "탐구 정리하기(O)",
  question: "띠그래프와 원그래프로 나타내고 해석하며, 알맞은 그래프를 고를 수 있나요?",
  summary: "각 항목의 백분율을 구하고 합계가 100 %인지 확인한 다음 백분율만큼 띠(원)를 나누어 내용과 백분율, 제목을 써요. 띠그래프와 원그래프에서 비율을 비교하고 몇 배인지 알 수 있어요. 비율을 나타내는 자료에는 띠그래프나 원그래프가 알맞아요.",
  steps: [
    { name: "표 완성하기", inst: "채린이네 학교 5학년과 6학년 학생들이 좋아하는 책의 종류를 조사하여 나타낸 표예요. 표를 완성해 보세요.", hints: ["과학책 학생 수는 200에서 나머지를 모두 빼요.", "역사책: 50 ÷ 200 × 100 = 25예요."],
      render: (b, a) => { b.append(gr5HTbl("좋아하는 책의 종류별 학생 수", ["종류", "동화책", "역사책", "위인전", "과학책", "기타", "합계"], [["학생 수(명)", 60, 50, 42, "( )", 12, 200], ["백분율(%)", 30, "( )", "( )", "( )", "( )", "( )"]]));
        gr5Ask(b, a, [{ parts: ["과학책을 좋아하는 학생은 200 − 60 − 50 − 42 − 12 = ", { n: 36 }, "명이에요."] },
          { parts: ["역사책 ", { n: 25 }, " %, 위인전 ", { n: 21 }, " %, 과학책 ", { n: 18 }, " %, 기타 ", { n: 6, why: { "12": "학생 수를 그대로 썼어요. 12 ÷ 200 × 100을 계산해요." } }, " %, 합계 ", { n: 100 }, " %"] }],
          { ok: "과학책 36명, 역사책 25 %, 위인전 21 %, 과학책 18 %, 기타 6 %, 합계 100 %예요." }); } },
    { name: "띠그래프로 나타내기", inst: "표를 보고 띠그래프로 나타내 보세요. ‘동화책(30 %)’은 미리 나타내 두었어요.", hints: ["가장 작은 눈금 한 칸은 1 %예요.", "동화책이 끝난 30 %에서 이어서 25칸 더 가면 55 %예요."],
      render: (b, a) => gr5Draw(b, a, { g: GR5D.book, given: 1, ok: "띠를 30, 55, 76, 94 자리에서 나누었어요." }) },
    { name: "원그래프로 나타내기", inst: "같은 표를 원그래프로 나타내고, 알 수 있는 내용을 써 보세요.", hints: ["원의 중심에서 눈금까지 선을 그어요.", "경계는 30, 55, 76, 94예요."],
      render: (b, a) => gr5Draw(b, a, { g: GR5D.bookPie, given: 1,
        ask: [{ parts: ["좋아하는 책의 종류 중 비율이 가장 높은 것은 ", { o: ["동화책", "역사책", "위인전"], a: 0 }, "이고, 역사책을 좋아하는 학생 수의 비율은 전체의 ", { n: 25 }, " %예요."] }],
        ok: "원그래프에서도 동화책의 비율(30 %)이 가장 높아요." }) },
    { name: "띠그래프 해석하기", inst: "2021년과 2023년의 초등학생들의 희망 직업 선택 이유를 조사하여 나타낸 띠그래프예요(출처: 교육부, 2024). 그래프를 보고 답해 보세요.", hints: ["2021년과 2023년의 백분율을 항목마다 견주어요. ‘돈을 많이 벌 수 있을 것 같아서’는 두 해 모두 8 %예요.", "60 ÷ 15를 계산해요."],
      render: (b, a) => gr5Pick(b, a, { figs: [GR5D.job21, GR5D.job23],
        qs: [{ q: "2021년에 비해 2023년에 비율이 늘어난 희망 직업 선택 이유를 2023년 그래프에서 모두 눌러요.", at: [[1, 0]], why: { "1-3": "돈을 많이 벌 수 있을 것 같아서는 두 해 모두 8 %로 같아요.", "1-1": "잘 해낼 수 있을 것 같아서는 18 %에서 15 %로 줄었어요.", "1-2": "기타는 15 %에서 14 %로 줄었어요.", "1-4": "5 %에서 3 %로 줄었어요." }, ok: "좋아하는 일이라서(54 % → 60 %)만 늘었어요." }],
        ask: [{ parts: ["2023년에 ‘좋아하는 일이라서’의 비율은 ‘잘 해낼 수 있을 것 같아서’의 비율의 ", { n: 4, why: { "45": "60 − 15는 차이예요. 몇 배인지는 60 ÷ 15로 구해요." } }, "배예요."] }],
        ok: "2023년에 좋아하는 일이라서(60 %)는 잘 해낼 수 있을 것 같아서(15 %)의 4배예요." }) },
    { name: "확인하고 정리해요", inst: "「좋아하는 색깔별 학생 수의 비율」을 나타낸 띠그래프와 원그래프를 보고 빈칸을 채워 정리해요.", hints: ["가장 긴(큰) 부분과 가장 짧은(작은) 부분을 찾아요.", "각 항목의 백분율의 합계는 100 %예요."],
      render: (b, a) => { b.append(gr5Show([GR5D.color, GR5D.colorPie]));
        blanks(b, a, ["비율이 가장 높은 색깔은 ", { o: ["빨간색", "노란색", "파란색"], a: 0 }, "이고, 비율이 가장 낮은 색깔은 ", { o: ["빨간색", "초록색", "파란색"], a: 2 }, "이에요. 노란색을 좋아하는 학생 수는 전체의 ", { o: ["30", "35", "20"], a: 0 }, " %예요. 띠그래프와 원그래프로 나타낼 때에는 ① 각 항목의 백분율을 구하고 ② 각 항목의 백분율의 합계가 ", { o: ["100", "360", "50"], a: 0 }, " %인지 확인한 다음 ③ 백분율만큼 선을 그어 나누고 ④ 내용과 백분율을 쓰고 ⑤ 알맞은 제목을 써요."],
          { ok: "띠그래프와 원그래프의 특징과 나타내는 방법을 정리했어요." }); } }
  ],
  challenge: { inst: "자료와 알맞은 그래프에 대해 잘못 설명한 사람을 찾고, 내용을 옳게 고쳐 보세요.", hints: ["그림그래프는 그림의 크기와 수로 많고 적음을 나타내요.", "국토의 용도별 면적 ‘비율’을 나타내야 해요."],
    render: (b, a) => gr5Ask(b, a, [
      { q: "서희: “우리나라 국토의 용도별 면적 비율을 나타내기에 가장 알맞은 그래프는 그림그래프야.” / 하진: “연도별 65세 이상 인구의 변화를 나타내기에 가장 알맞은 그래프는 꺾은선그래프야.” / 연우: “막대그래프로 나라별 수출 금액을 비교할 수 있어.”",
        parts: ["잘못 설명한 사람은 ", { o: ["서희", "하진", "연우"], a: 0, why: { "1": "시간에 따른 인구의 변화는 꺾은선그래프가 알맞아요.", "2": "막대그래프는 수량의 많고 적음을 비교하기 좋아요." } }, "예요. 옳게 고치면 “우리나라 국토의 용도별 면적 비율을 나타내기에 가장 알맞은 그래프는 ", { o: ["띠그래프 또는 원그래프", "막대그래프", "꺾은선그래프"], a: 0 }, "입니다.”예요."] }],
      { ok: "그림그래프는 그림의 크기와 수로 수량의 많고 적음을 파악하기에 알맞아서, 비율을 나타내기에는 띠그래프나 원그래프가 알맞아요." }) }
}
];
