//@@APP
const APP={title:"우리 반 생활 신문 편집부", unit:"6-1 수학 5. 여러 가지 그래프", key:"s61-graph-v1", welcome:"우리 반 생활 신문 편집부에 온 것을 환영해요", intro:"해솔초등학교 6학년 3반 생활 신문 편집부 기자가 되어 아침 식사·등교 방법·용돈의 쓰임·쉬는 시간·급식 잔반·분리배출을 조사하고, 백분율만큼 띠와 원을 직접 나누어 띠그래프와 원그래프로 신문에 실은 뒤, 기사를 해석하고 바로잡으며 목적에 알맞은 그래프를 골라 봐요."};
//@@UNIT
/* =========================================================
   6-1 수학 5. 여러 가지 그래프 — 이야기 버전 단원 조작 부품 (앞글자 gr5, 이야기 전용 gr5s)
   교과서 버전(u5-graph.tb.js)의 gr5 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   기다리는 시간: 입력칸 900ms(Enter는 blur) · 보기 고르기 260ms(입력칸이 함께 있으면 600ms) · 그래프 누르기 260ms(여러 개는 600ms) · 공학 도구 1200ms.
   '여기에 선 긋기'는 확인 단추가 아니라 선을 긋는 조작이에요(띠·원 나누기).
   한 계단에 활동이 둘이면(hj-multi) 부품 함수가 function 이름(body, api … 꼴이고 몸통에 done( 이 있어야 활동으로 세어져요 — 부품마다 api.done 경로를 적어 둠.
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
.gr5figs{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-end}.gr5figs>div{flex:1 1 420px;min-width:0}
.gr5figs.gr5three>div{flex:1 1 300px}
.gr5figs>div.gr5wide{flex-basis:100%}
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
  t = t.replace(/(%|명|개|건|번|배|그루|천명|만t|kg|권)$/i, "");
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
  const mini = !!(o && o.mini), W = mini ? 360 : 720, x0 = mini ? 12 : 30, tH = o && o.noTitle ? 14 : 30;
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
  const f2 = G.mini ? 15 : 13, lv = []; let maxLv = -1;
  /* 바깥 글: 가운데보다 오른쪽이면 글의 끝을, 왼쪽이면 글의 시작을 이끔선에 맞춰요 */
  outs.forEach(ob => {
    const w = gr5TW(ob.t, f2), right = ob.cx > G.x0 + G.L / 2;
    let l = right ? ob.cx + 4 - w : ob.cx - 4; l = Math.max(G.x0, Math.min(l, G.x0 + G.L - w));
    const r = l + w; let k = 0;
    while ((lv[k] || []).some(([a, b]) => l < b + 8 && r > a - 8)) k++;
    (lv[k] = lv[k] || []).push([l, r]); ob.l = l; ob.r = r; ob.lv = k; ob.x = (l + r) / 2; maxLv = Math.max(maxLv, k);
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
    const hx = o.cx < o.l ? o.l + 2 : o.cx > o.r ? o.r - 2 : o.cx;
    g.append(svgEl("path", { d: `M${o.cx} ${G.bandY + G.BH - 4}L${o.cx} ${y - 9}${Math.abs(hx - o.cx) > 1 ? `L${hx} ${y - 9}` : ""}`, fill: "none", stroke: GR5.gray, "stroke-width": 1.3 }));
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
  const r = 140, cy = tH + 50 + r, W = 560; return { mini: false, W, cx: W / 2, cy, r, H: cy + r + 50, tH };
}
/* 부채꼴 안에 글 상자가 들어가는지 점으로 확인해요 */
function gr5InSec(G, x, y, a, b) {
  const d = Math.hypot(x - G.cx, y - G.cy); if (d > G.r * .96) return false; if (d < 4) return b - a >= 50;
  const t = ((Math.atan2(x - G.cx, -(y - G.cy)) / (2 * Math.PI) * 100) + 100) % 100, m = .4;
  return t >= a + m && t <= b - m;
}
function gr5PieFit(it, a, G) {
  const b = a + it.p, mid = a + it.p / 2, pct = gr5P(it.p), sp = gr5Split(it.n);
  const cands = [[it.n, pct]]; if (sp) cands.push([sp[0], sp[1], pct]);
  const maxF = G.mini ? 21 : 16, minF = G.mini ? 10 : 11;
  for (let f = maxF; f >= minF; f -= .5) for (const lines of cands) {
    const bw = Math.max(...lines.map(l => gr5TW(l, f))) + 4, bh = lines.length * f * 1.16;
    for (const fr of it.p >= 50 ? [.35, .25, .45, .55] : [.6, .5, .68, .42, .74]) {
      const [x, y] = gr5Pt(G.cx, G.cy, G.r * fr, mid);
      const pts = [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy]) => [x + dx * bw / 2, y + dy * bh / 2]);
      if (pts.every(([px, py]) => gr5InSec(G, px, py, a, b))) return { x, y, r: { lines, f } };
    }
  }
  return null;
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
    const a = cum[i] - it.p, mid = a + it.p / 2, pct = gr5P(it.p);
    let fit = G.mini || it.p >= 9 ? gr5PieFit(it, a, G) : null;
    if (!fit && G.mini) { const [x, y] = gr5Pt(G.cx, G.cy, G.r * .62, mid); fit = { x, y, r: { lines: gr5Split(it.n) ? [...gr5Split(it.n), pct] : [it.n, pct], f: 10 } }; }
    if (fit) ins.push(Object.assign({ i }, fit)); else outs.push({ i, mid, t: `${it.n}(${pct})`, n: it.n, pct });
  });
  /* 바깥 글: 왼쪽·오른쪽으로 나누어 겹치지 않게 밀어요(자리가 모자라면 두 줄) */
  const R = G.r + 40, f2 = 13;
  outs.forEach(o => {
    const [x, y] = gr5Pt(G.cx, G.cy, R, o.mid); o.x = x; o.y = y; o.side = Math.sin(o.mid / 100 * 2 * Math.PI) >= 0 ? 1 : -1;
    const room = o.side > 0 ? G.W - 4 - x : x - 4;
    o.lines = gr5TW(o.t, f2) <= room ? [o.t] : [o.n, `(${o.pct})`]; o.hh = o.lines.length * (f2 + 3);
  });
  [1, -1].forEach(sd => {
    const l = outs.filter(o => o.side === sd).sort((p, q) => p.y - q.y);
    for (let k = 1; k < l.length; k++) { const need = (l[k - 1].hh + l[k].hh) / 2 + 3; if (l[k].y - l[k - 1].y < need) l[k].y = l[k - 1].y + need; }
    const maxY = G.H - 6; for (let k = l.length - 1; k >= 0; k--) { if (l[k].y + l[k].hh / 2 > maxY) l[k].y = maxY - l[k].hh / 2; if (k) { const need = (l[k - 1].hh + l[k].hh) / 2 + 3; if (l[k].y - l[k - 1].y < need) l[k - 1].y = l[k].y - need; } }
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
    const w = Math.max(...o.lines.map(l => gr5TW(l, lay.f2))); let x = o.x;
    if (o.side > 0) x = Math.min(x, G.W - 4 - w); else x = Math.max(x, 4 + w);
    o.lines.forEach((l, k) => g.append(txt(x, o.y + (k - (o.lines.length - 1) / 2) * (lay.f2 + 3), l, lay.f2, { fill: GR5.ink, "text-anchor": o.side > 0 ? "start" : "end" })));
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
    const ic = g.icon || gr5Hosp;
    for (let k = 0; k < big; k++) { svg.append(ic(x, yc, 40)); x += 48; }
    for (let k = 0; k < small; k++) { svg.append(ic(x, yc + 6, 22)); x += 28; }
    const hit = svgEl("rect", { x: 20, y: y0, width: W - 40, height: rowH, fill: "transparent" }); svg.append(hit);
    return { el: hit, shape: () => svgEl("rect", { x: 23, y: y0 + 3, width: W - 46, height: rowH - 6 }) };
  });
  const ic2 = g.icon || gr5Hosp, ly = top + n * rowH + 24; svg.append(ic2(W - 300, ly, 28), txt(W - 280, ly, `${g.big}${g.unitWord}`, 14, { "text-anchor": "start" }), ic2(W - 170, ly + 3, 18), txt(W - 156, ly, `${g.small}${g.unitWord}`, 14, { "text-anchor": "start" }));
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
  const els = arr.map(x => { const g = x.g || x; const el = gr5Graph(g, o).el, c = g.kind === "pie" ? "" : "gr5wide"; return x.lead ? h("div", { class: c }, h("div", { class: "gr5lead" }, x.lead), el) : h("div", { class: c }, el); });
  return els.length > 1 ? h("div", { class: "gr5figs" + (els.length > 2 ? " gr5three" : "") }, els) : els[0];
}
/* 가로 표 */
function gr5HTbl(cap, head, rows, hiCells) {
  return h("div", { class: "gr5tbl" }, cap ? h("div", { class: "gr5cap" }, cap) : "", h("table", {},
    h("tr", {}, head.map(t => h("th", {}, t))),
    rows.map((r, ri) => h("tr", {}, r.map((t, ci) => ci === 0 ? h("th", {}, t) : h("td", { class: hiCells && hiCells.includes(`${ri}-${ci}`) ? "gr5hi" : "" }, t === "" ? "​" : String(t)))))));
}

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기) ---------- */
function gr5Ask(body, api, items, opts = {}) {   /* 다 맞으면 api.done( 을 불러요 */
  const host = body;
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
  const filled = s => s.pt.o ? (s.pt.multi ? s.v.size >= s.pt.a.length : s.v != null) : s.inp.value.trim() !== "";
  const check = () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); });
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) { all.forEach(s => { if (s.inp) s.inp.readOnly = true; }); api.done(ans, opts.ok); return true; }
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(gr5Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
    return false;
  };
  const hasIn = all.some(s => !s.pt.o);
  const kick = autoRun(() => all.every(filled), () => all.map(val).join("\u0001"), check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) later(hasIn ? 600 : 260); });
  all.forEach(s => { if (!s.inp) return;
    s.inp.addEventListener("input", e => { s.inp.style.borderColor = ""; if (!e.isComposing) later(900); });
    s.inp.addEventListener("change", () => later(200));
    s.inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); s.inp.blur(); } }); });
  if (!all.length) setTimeout(() => api.done(items.map(it => (it.parts || []).filter(x => typeof x === "string").join("")).join(" / "), opts.ok), 0);
  host.append(wrap);
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
function gr5Pick(body, api, opt) {   /* 다 찾으면 gr5Finish → api.done( */
  const W = []; let qi = 0, sel = new Set(), fin = false;
  const keysOf = q => q.at ? q.at.map(([g, i]) => opt.whole ? String(g) : `${g}-${i}`) : (Array.isArray(q.a) ? q.a.map(i => opt.whole ? String(i) : `0-${i}`) : [opt.whole ? String(q.a) : `0-${q.a}`]);
  const qbox = h("div", { class: "gr5q" }), read = h("div", { class: "gr5small" });
  const paint = () => { W.forEach((w, gi) => { w.clear(); w.parts.forEach((_, i) => { const k = opt.whole ? String(gi) : `${gi}-${i}`; if (sel.has(k)) w.hl(i, "sel"); }); }); };
  const tap = (gi, i) => {
    if (fin || paused) return; const q = opt.qs[qi], k = opt.whole ? String(gi) : `${gi}-${i}`, multi = q.multi || keysOf(q).length > 1;
    if (multi) { sel.has(k) ? sel.delete(k) : sel.add(k); } else { sel = new Set([k]); }
    paint();
    read.textContent = sel.size ? `고른 것: ${[...sel].map(nameOf).join(", ")}` : "";
    later(multi ? 600 : 260);
  };
  const nameOf = k => { const [gi, i] = k.split("-").map(Number); const g = opt.figs[gi]; if (opt.whole) return opt.leads ? opt.leads[gi] : g.title; return g.items ? g.items[i].n : (g.names || g.xs)[i]; };
  opt.figs.forEach((g, gi) => W.push(gr5Graph(g, { onPart: i => tap(gi, i), mini: opt.mini })));
  const els = W.map((w, gi) => h("div", { class: opt.figs[gi].kind === "pie" ? "" : "gr5wide" }, opt.leads ? h("div", { class: "gr5lead" }, opt.leads[gi]) : "", w.el));
  const figEl = els.length > 1 ? h("div", { class: "gr5figs" + (els.length > 2 ? " gr5three" : "") }, els) : els[0];
  const show = () => { const q = opt.qs[qi], multi = q.multi || keysOf(q).length > 1; qbox.textContent = `${opt.qs.length > 1 ? `(${qi + 1}/${opt.qs.length}) ` : ""}${q.q}${multi ? " (여러 개를 눌러요)" : ""}`; read.textContent = ""; };
  api.provide({ words: opt.words || [], answers: opt.qs.map(q => keysOf(q).map(nameOf).join(", ")) });
  const check = () => {
    if (fin) return true; const q = opt.qs[qi], want = keysOf(q);
    api.tryOnce();
    const got = [...sel], ok = got.length === want.length && want.every(k => sel.has(k)), ans = got.map(nameOf).join("·") || "-";
    if (!ok) {
      W.forEach((w, gi) => w.parts.forEach((_, i) => { const k = opt.whole ? String(gi) : `${gi}-${i}`; if (sel.has(k) && !want.includes(k)) w.hl(i, "bad"); }));
      const wk = got.find(k => !want.includes(k)), why = q.why && wk ? (q.why[wk] || (wk.startsWith("0-") ? q.why[wk.slice(2)] : null)) : null;
      api.fail(why || (!got.length ? "그래프에서 알맞은 부분을 눌러요." : got.length < want.length ? "알맞은 것을 모두 골랐는지 다시 살펴봐요." : got.length > want.length ? "알맞지 않은 것도 골랐어요. 고른 것을 다시 살펴봐요." : q.bad || "그래프를 다시 살펴보고 골라 봐요."), ans);
      return false;
    }
    W.forEach((w, gi) => w.parts.forEach((_, i) => { const k = opt.whole ? String(gi) : `${gi}-${i}`; if (sel.has(k)) w.hl(i, "good"); }));
    qi++; sel = new Set();
    if (qi < opt.qs.length) { api.hint("○ " + (q.ok || "맞아요!") + " 이어서 남은 물음도 해 봐요."); paused = true; setTimeout(() => { paused = false; if (!fin) { W.forEach(w => w.clear()); show(); } }, 900); return false; }
    fin = true; qbox.textContent = "그래프에서 모두 찾았어요.";
    gr5Finish(body, api, opt, opt.qs.map(q => keysOf(q).map(nameOf).join("·")).join(" / "), q.ok || opt.msg || "그래프를 잘 읽었어요.");
    return true;
  };
  let paused = false;
  const kick = autoRun(() => !fin && !paused && sel.size >= keysOf(opt.qs[qi]).length, () => qi + ":" + [...sel].sort().join(","), check, 0);
  let tm = null; function later(w) { clearTimeout(tm); tm = setTimeout(kick, w); }
  body.append(figEl, qbox, read);
  show();
}

/* =========================================================
   띠·원 나누기: 백분율만큼 선을 그어 나누고, 나눈 부분에 내용과 백분율을 붙여요
   opt: {g, given:미리 들어 있는 항목 수, label:true|false, ask|then, ok}
   ========================================================= */
function gr5Draw(body, api, opt) {   /* 다 나누고 붙이면 gr5Finish → api.done( */
  const g = opt.g; gr5Chk(g);
  const band = g.kind === "band", n = g.items.length, cum = gr5Cum(g), st = g.step || 1, given = opt.given || 0, P = g.items.map(it => it.p);
  const wantLab = opt.label !== false, lab = g.items.map((_, i) => i < given || !wantLab);
  let k = given, phase = "line", cur = given ? cum[given - 1] : 0, selCard = null;
  let G;
  if (band) { G = gr5BandGeo({ noTitle: true }); G.H = Math.max(gr5BandH(G, gr5BandLay(g, G)) + 6, G.bandY + G.BH + 30); }
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
    if (Math.abs(c - it.p) < 1e-9 && pv > 0) why = `0부터 다시 쟀어요. 이전 항목에 이어서 앞의 선(${gr5F(pv)} %)부터 ${gr5P(it.p)}만큼 가야 해요.`;
    else if (c <= pv + 1e-9) why = `앞 항목과 겹치거나 크기가 0이에요. 앞의 선(${gr5F(pv)} %)에서 이어서 ${gr5P(it.p)}만큼 더 가요.`;
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
function gr5Maker(body, api, opt) {   /* 표·계산 도구·두 그래프·제목을 다 하면 api.done( */
  const unit = opt.unit || "명";
  const mk = (n, c) => ({ n: h("input", { type: "text", class: "gr5nm", value: n || "", "aria-label": "항목" }), c: h("input", { type: "text", inputmode: "numeric", value: c == null ? "" : String(c), "aria-label": "수" }) });
  const rows = (opt.target || [0, 0, 0]).map(() => mk());
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
  let fin = false, tm = null;
  const judge = () => {
    if (fin) return true; const d = data(), T = opt.target;
    const given = rows.map(r => `${r.n.value.trim()} ${r.c.value.trim()}`).filter(s => s.trim()).join(", ") || "-";
    if (T) {
      const bi = T.findIndex(([nm, c], i) => norm(d[i].n) !== norm(nm) || d[i].c !== c);
      if (bi >= 0) { api.fail(`표의 ${bi + 1}번째 줄(${T[bi][0]} ${T[bi][1]}${unit})을 다시 살펴봐요.`, given); return false; }
    }
    if (!ttl.value.trim()) { api.hint("○ 표를 바르게 썼어요. 표의 제목을 써요."); return false; }
    if (!sumOn || !pctOn) { api.hint("○ 계산 도구에서 ‘합계’와 ‘백분율’을 모두 켜요."); return false; }
    if (seen.size < 2) { api.hint("○ 그래프에서 띠그래프와 원그래프를 모두 골라 그려 봐요."); return false; }
    if (!/비율/.test(gttl.value)) { api.hint("○ 그래프의 제목을 ‘…의 비율’처럼 알맞게 바꾸어 써요."); return false; }
    api.tryOnce(); fin = true; api.done(`${ttl.value.trim()}: ${given} / ${gttl.value.trim()}`, opt.ok); return true;
  };
  const ready = () => { const d = data(); return !!d && (opt.target ? d.length === opt.target.length : d.filter(x => x.c > 0).length >= 3); };
  const kick = autoRun(ready, () => [rows.map(r => r.n.value.trim() + "=" + r.c.value.trim()).join(","), ttl.value.trim(), sumOn, pctOn, [...seen].sort().join(""), /비율/.test(gttl.value)].join("|"), judge, 0);
  const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  body.addEventListener("input", () => later(900));
  body.addEventListener("click", e => { if (e.target.closest("button")) later(600); });
  api.provide({ words: ["합계", "백분율", "띠그래프", "원그래프", "항목 정렬"], answers: opt.target ? [opt.target.map(([a, b]) => `${a} ${b}`).join(", ")] : [] });
  body.append(h("div", { class: "panel" }, h("div", { class: "stage" }, tblHost), h("div", { class: "side" }, tools)), stage, note);
  redraw();
}

/* =========================================================
   조사하기: 설문 쪽지를 한 장씩 읽고 알맞은 칸을 눌러 표시해요
   opt: {names, counts, seed, ask(counts)}
   ========================================================= */
function gr5Survey(body, api, opt) {   /* 다 정리하면 gr5Finish → api.done( */
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
function gr5Scaled(body, api, opt) {   /* 두 가지 보기와 필요한 부분을 다 보면 gr5Finish → api.done( */
  opt.rows.forEach((r, ri) => gr5Chk({ title: opt.years[ri], items: r.map((p, i) => ({ n: opt.names[i], p })) }));
  const W = 720, x0 = 86, L = 610, rowH = 70, top = 30, BH = 40, n = opt.rows.length, H = top + n * rowH + 10, maxT = Math.max(...opt.totals);
  let mode = "pct"; const seen = new Set(["pct"]), got = new Set(); let fin = false;
  const svg = makeSvg(W, H); svg.setAttribute("class", "gr5fig"); svg.style.maxWidth = "42em";
  const g = svgEl("g"); svg.append(g);
  const read = h("div", { class: "gr5read" });
  const col = i => /^기타/.test(opt.names[i]) ? GR5_ETC : GR5_COLS[i % GR5_COLS.length];
  const draw = () => {
    g.innerHTML = ""; const tiny = [];
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
        if (w < 22) tiny.push([x + w / 2, y, ri, i]);
        a += p;
      });
      if (mode === "abs") g.append(txt(x0 + len + 6, y + BH + 13, `${opt.totals[ri].toLocaleString()}${opt.unit}`, 12, { fill: GR5.gray, "text-anchor": "end" }));
    });
    /* 아주 좁은 부분도 누르기 쉽게 */
    tiny.forEach(([cx, y, ri, i]) => { const hit = svgEl("rect", { x: cx - 11, y: y - 4, width: 22, height: BH + 8, fill: "transparent", style: "cursor:pointer" }); hit.addEventListener("click", () => tap(ri, i)); g.append(hit); });
  };
  const tap = (ri, i) => {
    got.add(`${ri}-${i}`);
    read.textContent = `${opt.years[ri]} ${opt.names[i]}: 비율 ${gr5P(opt.rows[ri][i])} (${opt.years[ri]} 전체 ${opt.totals[ri].toLocaleString()}${opt.unit}의 ${gr5P(opt.rows[ri][i])})`;
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
function gr5Dice(body, api, opt) {   /* 마지막 물음까지 맞히면 gr5Ask가 api.done( */
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


/* =========================================================
   이야기 버전 전용(gr5s): 해솔초등학교 6학년 3반 생활 신문 편집부
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.gr5snote{background:#FFFDF6;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .9em;margin:.3em 0;word-break:keep-all}
.gr5snote b{font-family:Jua,sans-serif;font-weight:400;color:var(--night)}
.gr5snote ul{margin:.3em 0 .1em 1.2em;padding:0}
.gr5ssay{display:flex;gap:.5em;align-items:flex-start;margin:.35em 0;word-break:keep-all}
.gr5ssay b{flex:0 0 auto;font-family:Jua,sans-serif;font-weight:400;background:#EEF5FD;border:2px solid #9DC3EA;border-radius:999px;padding:.05em .6em;color:var(--night)}
.gr5ssay span{background:#FFF8EC;border-left:6px solid #E8B36A;border-radius:.6em;padding:.35em .7em;flex:1 1 auto;min-width:0}
`;
  document.head.append(s);
})();
/* 메모 상자 */
function gr5sNote(title, lines) { return h("div", { class: "gr5snote" }, h("b", {}, title), h("ul", {}, lines.map(l => h("li", {}, l)))); }
/* 편집부 친구의 말 */
function gr5sSay(who, t) { return h("div", { class: "gr5ssay" }, h("b", {}, who), h("span", {}, t)); }
/* 그림그래프 그림: 헌 종이 묶음 */
function gr5sBundle(x, y, s) {
  const g = svgEl("g"), w = s, hh = s * .72;
  [0, 1, 2].forEach(k => g.append(svgEl("rect", { x: x - w / 2 + k * s * .04, y: y - hh / 2 + k * s * .12 - s * .12, width: w * .92, height: hh * .62, rx: s * .06, fill: k === 2 ? "#FFFFFF" : "#F3EBDD", stroke: "#8A7356", "stroke-width": Math.max(1, s * .05) })));
  g.append(svgEl("path", { d: `M${x - s * .05} ${y - hh / 2 - s * .1}V${y + hh * .3}`, stroke: "#C0392B", "stroke-width": Math.max(1.2, s * .08) }));
  return g;
}
/* 1차시 그림: 생활 신문 첫 호 기획안 */
function gr5sPaper() {
  const W = 640, H = 300, s = makeSvg(W, H);
  s.append(svgEl("rect", { x: 10, y: 10, width: W - 20, height: H - 20, rx: 8, fill: "#FFFEF9", stroke: GR5.line, "stroke-width": 2 }));
  s.append(svgEl("rect", { x: 10, y: 10, width: W - 20, height: 52, rx: 8, fill: "#F2E6D0" }), txt(W / 2, 37, "해솔 6-3 생활 신문 · 첫 호 기획안", 22, { fill: GR5.ink }));
  const col = (x, t1, t2, draw) => {
    s.append(svgEl("rect", { x, y: 78, width: 190, height: 200, rx: 8, fill: "#fff", stroke: GR5.grid, "stroke-width": 2 }));
    s.append(txt(x + 95, 102, t1, 16, { fill: GR5.ink }), txt(x + 95, 124, t2, 14, { fill: GR5.gray }));
    draw(x);
  };
  col(28, "아침밥, 우리 반은?", "밥·빵·시리얼…", x => { [[10, "#8FC3EA"], [6, "#F6A89E"], [4, "#A9D99B"], [5, "#F5D27B"]].forEach(([v, c], i) => s.append(svgEl("rect", { x: x + 28 + i * 36, y: 260 - v * 11, width: 24, height: v * 11, fill: c, stroke: GR5.line }))); s.append(svgEl("line", { x1: x + 18, y1: 260, x2: x + 172, y2: 260, stroke: GR5.ink, "stroke-width": 2 })); });
  col(225, "어떻게 학교에 올까?", "전체의 몇 %?", x => { s.append(svgEl("circle", { cx: x + 95, cy: 200, r: 58, fill: "#fff", stroke: GR5.line, "stroke-width": 2, "stroke-dasharray": "6 4" })); s.append(txt(x + 95, 200, "? %", 24, { fill: GR5.red })); });
  col(422, "용돈은 어디에?", "간식·저축·학용품…", x => { s.append(svgEl("rect", { x: x + 15, y: 180, width: 160, height: 40, fill: "#fff", stroke: GR5.line, "stroke-width": 2, "stroke-dasharray": "6 4" })); s.append(txt(x + 95, 200, "□ % │ □ % │ □ %", 15, { fill: GR5.red })); });
  s.setAttribute("class", "gr5fig"); s.style.maxWidth = "38em"; return s;
}

/* ---------- 이 단원의 그래프 자료 (모두 이 앱이 정한 수) ---------- */
const GR5S = {
  breakfast: { kind: "bar", title: "오늘 아침에 먹은 음식별 학생 수", names: ["밥", "빵", "시리얼", "먹지 않음"], vals: [10, 6, 4, 5], max: 12, step: 1, major: 5, unit: "명", xName: "음식", color: "#8FC3EA" },
  go: gr5G("band", "6학년 학생들의 등교 방법별 학생 수의 비율", [["걸어서", 42], ["자전거", 23], ["학교 버스", 17], ["자동차", 12], ["기타", 6]]),
  lib: gr5G("band", "학급 문고의 책 종류별 권수의 비율", [["동화책", 30], ["만화책", 25], ["과학책", 20], ["역사책", 15], ["기타", 10]], 5),
  shirt: gr5G("pie", "6학년 학생들이 고른 반티 색깔별 학생 수의 비율", [["하늘색", 45], ["노란색", 25], ["초록색", 20], ["기타", 10]], 5),
  libUse: gr5G("pie", "도서관 이용 목적별 학생 수의 비율", [["책 빌리기", 38], ["숙제하기", 27], ["쉬기", 20], ["친구 만나기", 15]]),
  food: gr5G("band", "6학년 학생들이 아침에 먹은 음식별 학생 수의 비율", [["밥", 40], ["빵", 25], ["시리얼", 15], ["먹지 않음", 10], ["기타", 10]]),
  pe5: gr5G("band", "5학년 학생들이 좋아하는 체육 활동별 학생 수의 비율", [["피구", 35], ["줄넘기", 30], ["축구", 20], ["배드민턴", 15]]),
  book25: gr5G("pie", "학급 문고에 더 들이고 싶은 책별 학생 수의 비율", [["만화책", 36], ["과학책", 28], ["동화책", 24], ["역사책", 12]]),
  money: gr5G("band", "용돈의 쓰임별 학생 수의 비율", [["간식", 32], ["저축", 28], ["학용품", 20], ["선물", 12], ["기타", 8]]),
  sport25: gr5G("band", "좋아하는 운동별 학생 수의 비율", [["피구", 40], ["축구", 28], ["줄넘기", 20], ["배드민턴", 12]]),
  go25: gr5G("pie", "우리 반 학생들의 등교 방법별 학생 수의 비율", [["걸어서", 52], ["자전거", 24], ["자동차", 16], ["버스", 8]]),
  rest5: gr5G("band", "5학년 학생들이 쉬는 시간에 하는 일별 학생 수의 비율", [["운동장 놀이", 34], ["친구와 이야기", 24], ["보드게임", 16], ["책 읽기", 16], ["기타", 10]]),
  rest6: gr5G("band", "6학년 학생들이 쉬는 시간에 하는 일별 학생 수의 비율", [["운동장 놀이", 24], ["친구와 이야기", 33], ["보드게임", 11], ["책 읽기", 20], ["기타", 12]]),
  leftKind: gr5G("pie", "남긴 음식 종류별 무게의 비율", [["채소 반찬", 36.5], ["국", 24.2], ["밥", 15.8], ["생선·고기", 14.6], ["과일", 5.4], ["기타", 3.5]]),
  leftWhy: gr5G("pie", "음식을 남긴 까닭별 학생 수의 비율", [["입맛에 맞지 않아서", 34], ["양이 많아서", 27.5], ["먹기 싫은 재료가 있어서", 19.5], ["시간이 부족해서", 15], ["기타", 4]]),
  bookApr: gr5G("band", "4월 학급 문고 대출 책 종류별 권수의 비율", [["동화책", 38], ["만화책", 27], ["과학책", 18], ["역사책", 17]]),
  bookSep: gr5G("band", "9월 학급 문고 대출 책 종류별 권수의 비율", [["동화책", 31], ["만화책", 30], ["과학책", 21], ["역사책", 18]]),
  jump: { kind: "line", title: "월별 1분 줄넘기 평균 횟수", xs: ["4월", "5월", "6월", "7월"], vals: [62, 71, 75, 88], lo: 50, hi: 90, step: 2, major: 10, unit: "번", xName: "월" },
  play: gr5G("band", "점심시간에 운동장에서 하는 놀이별 학생 수의 비율", [["피구", 30], ["술래잡기", 26], ["축구", 20], ["줄넘기", 14], ["기타", 10]]),
  libDay: { kind: "bar", title: "요일별 학교 도서관을 찾은 학생 수", names: ["월", "화", "수", "목", "금"], vals: [42, 38, 51, 38, 46], max: 60, step: 2, major: 10, unit: "명", xName: "요일", color: "#F2A97E" },
  libGrade: gr5G("pie", "학년별 도서관을 찾은 학생 수의 비율", [["1학년", 12], ["2학년", 14], ["3학년", 19], ["4학년", 21], ["5학년", 18], ["6학년", 16]]),
  paper: { kind: "pic", title: "반별 모은 헌 종이의 무게", names: ["1반", "2반", "3반", "4반"], vals: [34, 52, 41, 27], big: 10, small: 1, unitWord: " kg", icon: gr5sBundle },
  paperWhere: gr5G("band", "3반이 헌 종이를 모은 곳별 무게의 비율", [["집", 45], ["학교", 30], ["학원", 15], ["기타", 10]]),
  read: gr5G("band", "가장 재미있게 읽은 꼭지별 학생 수의 비율", [["퀴즈", 28], ["인터뷰", 24], ["만화", 20], ["반 소식", 17], ["기타", 11]]),
  why1: gr5G("band", "1학기 6학년 학생들이 신문을 읽는 까닭별 학생 수의 비율", [["재미있어서", 46], ["친구 소식이 궁금해서", 22], ["숙제라서", 12], ["정보를 얻으려고", 6], ["기타", 14]]),
  why2: gr5G("band", "2학기 6학년 학생들이 신문을 읽는 까닭별 학생 수의 비율", [["재미있어서", 52], ["친구 소식이 궁금해서", 26], ["숙제라서", 6], ["정보를 얻으려고", 6], ["기타", 10]]),
  wish: gr5G("band", "다음 학기 신문에 실렸으면 하는 꼭지별 학생 수의 비율", [["학교 행사 소식", 35, "#F28B82"], ["친구 인터뷰", 30, "#F5D27B"], ["퀴즈", 20, "#A9D99B"], ["사진", 15, "#8FC3EA"]])
};
GR5S.goPie = Object.assign({}, GR5S.go, { kind: "pie" });
GR5S.foodPie = Object.assign({}, GR5S.food, { kind: "pie" });
GR5S.moneyPie = Object.assign({}, GR5S.money, { kind: "pie" });
GR5S.readPie = Object.assign({}, GR5S.read, { kind: "pie" });
GR5S.wishPie = Object.assign({}, GR5S.wish, { kind: "pie" });
/* 8~9차시: 전교 분리배출(띠그래프 + 표) · 알뜰 장터(원그래프 + 표) */
const GR5S_RECY = { title: "재활용품 종류별 무게의 비율", years: ["4월", "6월", "9월"], totals: [400, 500, 450], unit: " kg",
  names: ["종이", "플라스틱", "유리병", "캔", "비닐"], rows: [[45, 18, 20, 10, 7], [40, 24, 16, 10, 10], [36, 28, 15, 12, 9]] };
const GR5S_RECY_BANDS = GR5S_RECY.rows.map((r, i) => gr5G("band", `${GR5S_RECY.years[i]} 재활용품 종류별 무게의 비율`, r.map((p, k) => [GR5S_RECY.names[k], p])));
const GR5S_MKT = { years: ["2023년", "2024년", "2025년"], totals: [600, 700, 500], names: ["책", "학용품", "장난감", "옷"], rows: [[40, 30, 20, 10], [38, 30, 22, 10], [35, 32, 23, 10]] };
GR5S_MKT.figs = GR5S_MKT.rows.map((r, i) => gr5G("pie", GR5S_MKT.years[i], r.map((p, k) => [GR5S_MKT.names[k], p])));
/* 10차시 빙고 그래프 카드 12장 (6학년 학생들에게 물은 신문 설문, 이 앱이 정한 수) */
const GR5S_BINGO = [
  gr5G("band", "좋아하는 급식 메뉴별 학생 수의 비율", [["떡볶이", 32], ["카레", 24], ["불고기", 20], ["짜장면", 16], ["기타", 8]]),
  gr5G("pie", "가 보고 싶은 체험 학습 장소별 학생 수의 비율", [["놀이공원", 40], ["수족관", 25], ["박물관", 20], ["과학관", 15]]),
  gr5G("band", "아침에 일어나는 시각별 학생 수의 비율", [["6시 전", 10], ["6시~7시", 35], ["7시~8시", 45], ["8시 뒤", 10]]),
  gr5G("pie", "좋아하는 계절별 학생 수의 비율", [["봄", 22], ["여름", 30], ["가을", 33], ["겨울", 15]]),
  gr5G("band", "배우고 싶은 악기별 학생 수의 비율", [["피아노", 36], ["드럼", 27], ["우쿨렐레", 22], ["바이올린", 15]]),
  gr5G("pie", "기르는 반려동물별 학생 수의 비율", [["강아지", 48], ["고양이", 24], ["물고기", 16], ["기타", 12]]),
  gr5G("band", "주말에 가장 많이 한 일별 학생 수의 비율", [["운동", 30], ["게임", 25], ["독서", 20], ["가족 나들이", 15], ["기타", 10]]),
  gr5G("pie", "좋아하는 과목별 학생 수의 비율", [["체육", 35], ["미술", 20], ["과학", 18], ["수학", 15], ["기타", 12]]),
  gr5G("band", "하루 독서 시간별 학생 수의 비율", [["30분 미만", 40], ["30분~1시간", 32], ["1시간~2시간", 20], ["2시간 이상", 8]]),
  gr5G("pie", "좋아하는 간식별 학생 수의 비율", [["과일", 28], ["아이스크림", 26], ["과자", 24], ["떡", 14], ["기타", 8]]),
  gr5G("band", "학교에서 가장 좋아하는 장소별 학생 수의 비율", [["운동장", 38], ["도서관", 22], ["교실", 20], ["강당", 12], ["기타", 8]]),
  gr5G("pie", "모둠 활동에서 맡고 싶은 역할별 학생 수의 비율", [["발표", 30], ["기록", 25], ["자료 찾기", 25], ["그리기", 20]])
];
const GR5S_PLAN = ["🍚 아침밥 기사: 우리 반 25명이 오늘 아침에 먹은 음식", "🚲 등교 기사: 6학년 학생들은 어떻게 학교에 올까?", "💰 용돈 특집: 지난주 용돈을 어디에 썼을까?", "⏰ 쉬는 시간·급식 잔반 기사", "♻️ 분리배출 기사: 재활용품을 얼마나 모았을까?"];
