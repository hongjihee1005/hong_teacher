//@@APP
const APP={title:"6학년 1반 교실 새 단장", unit:"6-1 수학 6. 직육면체의 부피와 겉넓이", key:"s61-volume-v1", welcome:"6학년 1반 교실 새 단장에 온 것을 환영해요", intro:"햇살초등학교 6학년 1반이 교실 뒤편을 새로 꾸며요. 작은 수족관을 들이고 정리 수납장을 마련하면서, 수납 상자의 부피를 비교하고, 쌓기나무로 직육면체의 부피를 구하고, 1 cm³와 1 m³의 관계를 알아보고, 수납장을 시트지로 감싸며 직육면체의 겉넓이를 구해요. 상자를 쌓아 비닐을 아끼는 방법을 찾고, 부피 쪽지 놀이와 새 단장 발표회로 마무리해요."};
//@@UNIT
/* =========================================================
   6-1 수학 6. 직육면체의 부피와 겉넓이 — 이야기 버전 단원 조작 부품 (앞글자 vo6, 이야기 전용 vo6s)
   교과서 버전(u6-volume.tb.js)의 vo6 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   기다리는 시간: 입력칸 900ms(Enter는 blur) · 보기 고르기 260ms(입력칸이 함께 있으면 600ms) · 쌓기·옮기기 1200ms.
   한 계단에 활동이 둘이면(hj-multi) 부품 함수 몸통에 done( 이 있어야 활동으로 세어져요 — 부품마다 api.done 경로를 적어 둠.
   직육면체는 [가로, 세로, 높이]로 적어요(가로 = 왼쪽→오른쪽, 세로 = 앞→뒤, 높이 = 아래→위).
   그림은 모두 이 수로 코드가 그려요(비스듬히 본 겨냥도: 앞면·윗면·오른쪽 옆면이 보임).
   vo6Solid   직육면체·쌓기나무 그림            vo6Net     전개도에서 면을 눌러 겉넓이 구하기
   vo6Dims    가로·세로·높이를 바꾸며 쌓기       vo6Fill    상자 안을 같은 물건으로 채워 세기
   vo6Touch   두 상자의 면끼리 맞대어 보기       vo6M3      1 m³ 안에 1 cm³ 쌓기나무 채우기
   vo6Pack    상자 여러 개를 쌓아 포장하기       vo6Make    주변 물건으로 문제 만들고 바꾸어 풀기
   vo6Hunt    붙임쪽지 찾기 놀이 · vo6Notes 내 쪽지 만들기 · vo6Cards 종이 뒤집기 놀이
   vo6Ask     빈칸 고르기·수 쓰기(쉼표·소수·단위 글자 허용)
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.vo6fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:manipulation}
.vo6fig.vo6plain{background:transparent;border:none}
.vo6small{font-size:var(--fs-s);color:var(--muted)}
.vo6part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.vo6row{display:flex;flex-wrap:wrap;gap:.7em;align-items:flex-start}
.vo6row>div{flex:1 1 13em;min-width:0}
.vo6box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all}
.vo6figs{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-end;justify-content:flex-start;margin:.3em 0}
.vo6figs>figure{margin:0;flex:0 1 13em;min-width:0;text-align:center}
.vo6figs>figure>figcaption{font-family:"Jua",sans-serif;font-size:var(--fs-s);color:var(--night)}
.vo6btns{display:flex;flex-wrap:wrap;gap:.35em;align-items:center;margin:.3em 0}
.vo6btns button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em;min-height:2.2em}
.vo6btns button.vo6-pick{background:var(--night);color:#fff;border-color:var(--night)}
.vo6btns button:disabled{opacity:.45}
.vo6ctl{display:grid;grid-template-columns:auto auto 3em auto;gap:.3em .4em;align-items:center;margin:.3em 0}
.vo6ctl button{width:2.4em;height:2.4em;border:2px solid var(--line);background:#fff;border-radius:.6em;font-size:1.1em;padding:0}
.vo6ctl b{font-family:"Jua",sans-serif;text-align:center;font-size:1.2em;color:var(--night)}
.vo6ctl span{font-family:"Jua",sans-serif}
.vo6cnt{font-family:"Jua",sans-serif;color:var(--night);margin:.2em 0}
.vo6expr{font-family:"Jua",sans-serif;background:#F3F7FB;border:2px solid #CFDDEA;border-radius:10px;padding:.3em .6em;margin:.3em 0;word-break:keep-all;min-height:1.6em}
.vo6build{display:flex;flex-wrap:wrap;gap:.8em;align-items:flex-start}
.vo6build>.vo6l{flex:0 0 auto}
.vo6build>.vo6r{flex:1 1 13em;min-width:0;max-width:24em}
.vo6note{display:inline-block;background:#FFF3A6;border:2px solid #E3C94B;border-radius:6px;padding:.3em .6em;margin:.2em;font-family:"Jua",sans-serif;box-shadow:2px 3px 0 rgba(120,90,20,.15);word-break:keep-all}
.vo6notes{display:grid;grid-template-columns:repeat(auto-fill,minmax(12em,1fr));gap:.5em;margin:.4em 0}
.vo6notes .vo6note{margin:0}
.vo6notes input{width:5em;max-width:100%;font-size:1.05em;text-align:center}
.vo6cards{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.35em;margin:.4em 0;max-width:30em}
.vo6cards button{min-height:3.6em;border:2px solid #B9A27A;border-radius:10px;background:#8C6B3E;color:#fff;font-family:"Jua",sans-serif;padding:.1em;font-size:.95em;word-break:keep-all}
.vo6cards button.vo6up{background:#FFF8E5;color:var(--night)}
.vo6cards button.vo6gone{visibility:hidden}
.vo6tbl{border-collapse:collapse;margin:.3em 0;font-size:var(--fs-s)}
.vo6tbl th,.vo6tbl td{border:1.5px solid var(--line);padding:.2em .5em;text-align:center}
.vo6tbl input{width:4.6em;font-size:1em;text-align:center}
.vo6mk{display:flex;flex-wrap:wrap;gap:.4em;align-items:center;margin:.3em 0}
.vo6mk input{width:4.2em;font-size:1.05em;text-align:center}
`;
  document.head.append(s);
})();

/* ---------- 계산 ---------- */
const vo6Vol = d => d[0] * d[1] * d[2];
const vo6Faces3 = d => [d[0] * d[1], d[1] * d[2], d[0] * d[2]];          // 밑면(가로×세로) · 옆면(세로×높이) · 앞면(가로×높이)
const vo6Surf = d => 2 * (d[0] * d[1] + d[1] * d[2] + d[0] * d[2]);
const vo6R = v => Math.round(v * 100) / 100;
const vo6Fix = v => Math.round(v * 1e6) / 1e6;
const vo6Go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
/* 받침에 따라 조사 고르기: vo6Jo("필통", "이/가") → "필통이" */
function vo6Jo(w, pair) {
  const s = String(w), [a, b] = pair.split("/"), c = s.trim().slice(-1);
  let bat = false, rieul = false;
  if (/[0-9]/.test(c)) { bat = "0136780".includes(c); rieul = "178".includes(c); }
  else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  else if (/[a-z³²]/i.test(c)) bat = true;
  if (pair === "으로/로") return s + (bat && !rieul ? "으로" : "로");
  return s + (bat ? a : b);
}
/* 수 읽기: 띄어쓰기·쉼표·끝의 단위 글자를 빼고 읽어요(소수도 돼요) */
function vo6Num(s) {
  let t = String(s == null ? "" : s).replace(/[\s,]/g, "");
  t = t.replace(/(cm³|m³|cm²|m²|cm3|m3|cm2|m2|cm|m|개|배|층|장|점)$/i, "");
  return t === "" || !/^-?\d+(\.\d+)?$/.test(t) ? NaN : Number(t);
}
const VO6 = { ink: "#4A3524", top: "#FFE7AE", front: "#F4B46C", right: "#DC8C4A", gridC: "rgba(74,53,36,.45)", blue: "#2B7BD6", red: "#D64545", green: "#2E8B57",
  er: ["#FFD1DC", "#F49AB3", "#D9738F"], cube: ["#FFE7AE", "#F4B46C", "#DC8C4A"], box: ["#E9D3AE", "#C9A16B", "#A9824E"], pair: ["#FFD98A", "#9CC8F0", "#B9E3C6"], pairS: ["#C99A2E", "#3A6EA5", "#3C8C5A"] };
const VO6_KO = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥"];
const vo6TW = (t, f) => [...String(t)].reduce((w, ch) => w + (/[가-힣]/.test(ch) ? f : f * .6), 0);
function vo6Fig(W, H, draw, maxW, plain) { const s = makeSvg(W, H); draw(s); s.setAttribute("class", "vo6fig" + (plain ? " vo6plain" : "")); s.style.maxWidth = maxW || "30em"; return s; }
const vo6Fr = (el, cap) => h("figure", {}, el, h("figcaption", {}, cap));
const vo6Redrawn = t => h("p", { class: "vo6small" }, "※ " + (t || "교과서 그림 대신, 지도서의 수가 그대로 나오도록 이 앱에서 새로 그린 그림이에요."));

/* ---------- 직육면체 그림 ----------
   o.d [가로, 세로, 높이] · mode "solid"(색칠) | "sketch"(옅은 색 + 보이지 않는 모서리 점선) | "box"(모서리만, 안에 blocks) | "none"(blocks만)
   o.grid(눈금 간격, 쌓기나무처럼 보이게) · o.blocks [{x,y,z,w,d,h,c:[윗,앞,옆]}] · o.inner [가로,세로,높이](상자 안에 꽉 찬 쌓기나무) · o.innerGrid
   o.labels {a, b, c}(가로·세로·높이 글) · o.tint {front, top, right} · o.W, o.H(그림 크기) · o.s(1당 화면 길이) · maxW · plain · label */
function vo6Solid(o) {
  const [a, b, c] = o.d, K = .5, A = 38 * Math.PI / 180, ca = Math.cos(A) * K, sa = Math.sin(A) * K;
  const s = o.s || Math.min((o.W || 230) / (a + b * ca), (o.H || 170) / (c + b * sa));
  const P = (x, y, z) => [vo6R((x + y * ca) * s), vo6R((-z - y * sa) * s)];
  const pts = arr => arr.map(p => P(...p).join(",")).join(" ");
  const svg = svgEl("svg", { role: "img", "aria-label": o.label || "직육면체" });
  const g = svgEl("g", { "stroke-linejoin": "round", "stroke-linecap": "round" }); svg.append(g);
  const mode = o.mode || "solid";
  const line = (p, q, at) => g.append(svgEl("line", Object.assign({ x1: P(...p)[0], y1: P(...p)[1], x2: P(...q)[0], y2: P(...q)[1], stroke: VO6.ink, "stroke-width": 1.8 }, at || {})));
  const block = (x, y, z, w, dd, hh, col, op, step, stroke) => {
    const F = { front: [[x, y, z], [x + w, y, z], [x + w, y, z + hh], [x, y, z + hh]], top: [[x, y, z + hh], [x + w, y, z + hh], [x + w, y + dd, z + hh], [x, y + dd, z + hh]], right: [[x + w, y, z], [x + w, y + dd, z], [x + w, y + dd, z + hh], [x + w, y, z + hh]] };
    ["top", "front", "right"].forEach((k, i) => g.append(svgEl("polygon", { points: pts(F[k]), fill: col[i], "fill-opacity": op, stroke: stroke || "none", "stroke-width": 1.2 })));
    if (step) {
      const gs = { stroke: VO6.gridC, "stroke-width": 1 };
      for (let i = step; i < w - 1e-9; i += step) { line([x + i, y, z], [x + i, y, z + hh], gs); line([x + i, y, z + hh], [x + i, y + dd, z + hh], gs); }
      for (let k = step; k < hh - 1e-9; k += step) { line([x, y, z + k], [x + w, y, z + k], gs); line([x + w, y, z + k], [x + w, y + dd, z + k], gs); }
      for (let j = step; j < dd - 1e-9; j += step) { line([x, y + j, z + hh], [x + w, y + j, z + hh], gs); line([x + w, y + j, z], [x + w, y + j, z + hh], gs); }
    }
  };
  if (o.floor) { const [fa, fb] = o.floor, fs = { stroke: "#CBD5CE", "stroke-width": 1 };
    g.append(svgEl("polygon", { points: pts([[0, 0, 0], [fa, 0, 0], [fa, fb, 0], [0, fb, 0]]), fill: "#EEF2EE", stroke: "#B9C6BE", "stroke-width": 1.2 }));
    for (let i = 1; i < fa; i++) line([i, 0, 0], [i, fb, 0], fs); for (let j = 1; j < fb; j++) line([0, j, 0], [fa, j, 0], fs); }
  const tint = o.tint || {}, col = [tint.top || VO6.top, tint.front || VO6.front, tint.right || VO6.right];
  if (mode === "sketch" || mode === "box") [[[0, b, 0], [a, b, 0]], [[0, b, 0], [0, 0, 0]], [[0, b, 0], [0, b, c]]].forEach(([p, q]) => line(p, q, { "stroke-dasharray": "5 4", stroke: "#8A7A6A", "stroke-width": 1.5 }));
  if (mode === "solid" || mode === "sketch") block(0, 0, 0, a, b, c, col, mode === "sketch" ? .5 : 1, o.grid);
  if (o.inner) block(0, 0, 0, o.inner[0], o.inner[1], o.inner[2], o.innerCol || VO6.cube, 1, o.innerGrid || 1, VO6.ink);
  if (o.blocks) o.blocks.slice().sort((p, q) => q.y - p.y || p.z - q.z || p.x - q.x).forEach(k => block(k.x, k.y, k.z, k.w, k.d, k.h, k.c || VO6.cube, 1, k.step, VO6.ink));
  if (mode !== "none") [[[0, 0, 0], [a, 0, 0]], [[a, 0, 0], [a, 0, c]], [[a, 0, c], [0, 0, c]], [[0, 0, c], [0, 0, 0]], [[a, 0, 0], [a, b, 0]], [[a, b, 0], [a, b, c]], [[a, b, c], [a, 0, c]], [[0, 0, c], [0, b, c]], [[0, b, c], [a, b, c]]].forEach(([p, q]) => line(p, q, mode === "box" ? { "stroke-width": 2.2 } : null));
  const L = o.labels || {}, f = 15;
  const Fr = o.frame || [a, b, c], C8 = []; for (const x of [0, Math.max(a, Fr[0])]) for (const y of [0, Math.max(b, Fr[1])]) for (const z of [0, Math.max(c, Fr[2])]) C8.push(P(x, y, z));
  let x0 = Math.min(...C8.map(p => p[0])) - 8, x1 = Math.max(...C8.map(p => p[0])) + 8, y0 = Math.min(...C8.map(p => p[1])) - 8, y1 = Math.max(...C8.map(p => p[1])) + 8;
  if (L.a) { const p = P(a / 2, 0, 0); g.append(txt(p[0], p[1] + 15, L.a, f, { fill: VO6.blue })); y1 = Math.max(y1, p[1] + 26); x0 = Math.min(x0, p[0] - vo6TW(L.a, f) / 2 - 4); }
  if (L.c) { const p = P(0, 0, c / 2); g.append(txt(p[0] - 7, p[1], L.c, f, { fill: VO6.blue, "text-anchor": "end" })); x0 = Math.min(x0, p[0] - 12 - vo6TW(L.c, f)); }
  if (L.b) { const p = P(a, b / 2, 0); g.append(txt(p[0] + 8, p[1] + 9, L.b, f, { fill: VO6.blue, "text-anchor": "start" })); x1 = Math.max(x1, p[0] + 14 + vo6TW(L.b, f)); y1 = Math.max(y1, p[1] + 20); }
  svg.setAttribute("viewBox", `${vo6R(x0)} ${vo6R(y0)} ${vo6R(x1 - x0)} ${vo6R(y1 - y0)}`);
  svg.setAttribute("class", "vo6fig" + (o.plain ? " vo6plain" : ""));
  svg.style.maxWidth = o.maxW || "15em";
  return svg;
}
/* 길이 글이 붙은 겨냥도 */
function vo6Cub(d, unit, opt = {}) {
  const u = unit || "cm", lb = opt.labels || { a: d[0] + " " + u, b: d[1] + " " + u, c: d[2] + " " + u };
  const dd = opt.draw || d;
  return vo6Solid(Object.assign({ d: dd, mode: "sketch", labels: lb }, opt));
}
/* 쌓기나무(1 cm³)로 쌓은 직육면체 */
const vo6Stack = (d, opt = {}) => vo6Solid(Object.assign({ d, mode: "solid", grid: 1, tint: { top: VO6.cube[0], front: VO6.cube[1], right: VO6.cube[2] } }, opt));
/* 같은 크기 물건(w×d×h 칸)을 상자 안에 차례로 놓을 자리 */
function vo6Slots(box, u) {
  const out = [], nx = box[0] / u[0], ny = box[1] / u[1], nz = box[2] / u[2];
  for (let k = 0; k < nz; k++) for (let j = ny - 1; j >= 0; j--) for (let i = 0; i < nx; i++) out.push({ x: i * u[0], y: j * u[1], z: k * u[2], w: u[0], d: u[1], h: u[2] });
  return { out, nx, ny, nz };
}

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기, 여러 개 고르기 multi) ---------- */
function vo6Ask(body, api, items, opts = {}) {
  const wrap = h("div", { style: "margin-top:.6em" }), all = [];
  if (opts.title) wrap.append(h("p", { class: "inst" }, opts.title));
  items.forEach(it => {
    const box = h("div", { class: "qitem" });
    if (it.q) box.append(h("div", { class: "jua" }, it.q));
    if (it.fig) box.append(typeof it.fig === "function" ? it.fig() : it.fig);
    const sent = h("p", { class: "sent" });
    (it.parts || []).forEach(pt => {
      if (typeof pt === "string" || (pt && pt.nodeType)) { sent.append(pt); return; }
      if (pt.o) {
        const slot = h("span", { class: "slot" }), st = { pt, v: pt.multi ? new Set() : null, slot };
        pt.o.forEach((o, oi) => slot.append(h("button", { class: "opt", onclick: e => {
          if (pt.multi) { st.v.has(oi) ? st.v.delete(oi) : st.v.add(oi); e.currentTarget.classList.toggle("on"); [...slot.children].forEach(b => b.classList.remove("good", "bad")); }
          else { [...slot.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); st.v = oi; }
        } }, o)));
        sent.append(slot); all.push(st);
      } else {
        const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "답", style: `width:${pt.w || (String(pt.n).length > 5 ? "7em" : String(pt.n).length > 3 ? "5.4em" : "3.8em")};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : String(pt.n);
  api.provide({ words: all.map(st => right(st.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : pt.nodeType ? " " : right(pt)).join("")) });
  const good = st => st.pt.o ? (st.pt.multi ? (st.v.size === st.pt.a.length && st.pt.a.every(i => st.v.has(i))) : st.v === st.pt.a) : Math.abs(vo6Num(st.inp.value) - st.pt.n) < 1e-9;
  const val = st => st.pt.o ? (st.pt.multi ? ([...st.v].sort().map(i => st.pt.o[i]).join("·") || "-") : (st.v == null ? "-" : st.pt.o[st.v])) : (st.inp.value.trim() || "-");
  const filled = st => st.pt.o ? (st.pt.multi ? st.v.size >= st.pt.a.length : st.v != null) : st.inp.value.trim() !== "";
  let fin = false;
  const check = () => {
    if (fin) return true;
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(st => {
      if (st.pt.o) [...st.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = st.pt.multi ? st.v.has(i) : st.v === i; if (picked) b.classList.add(good(st) ? "good" : "bad"); });
      else st.inp.style.borderColor = good(st) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(st => !good(st));
    if (!bad) {
      fin = true; all.forEach(st => { if (st.inp) st.inp.readOnly = true; });
      if (opts.then) vo6Then(body, api, opts, ans, opts.ok); else api.done(ans, opts.ok);
      return true;
    }
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(vo6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || (!bad.pt.o && isNaN(vo6Num(bad.inp.value)) ? "수가 아닌 칸이 있어요. 수로 써 보세요." : opts.bad || "빨간 칸을 다시 살펴봐요."), ans);
    return false;
  };
  const hasIn = all.some(st => !st.pt.o);
  const kick = autoRun(() => all.every(filled), () => all.map(val).join("\u0001") + "|" + all.map(st => st.v instanceof Set ? [...st.v].sort().join(",") : "").join(";"), check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) later(hasIn ? 600 : 260); });
  all.forEach(st => { if (!st.inp) return;
    st.inp.addEventListener("input", e => { st.inp.style.borderColor = ""; if (!e.isComposing) later(900); });
    st.inp.addEventListener("change", () => later(200));
    st.inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); st.inp.blur(); } }); });
  body.append(wrap);
  return wrap;
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열려요 */
function vo6Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "vo6part" : "" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); vo6Go(body.lastChild);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}
/* 조작을 마친 뒤 물음(ask)으로 이어 가기 */
function vo6Then(body, api, opt, ans, msg, extra) {
  if (body.vo6Fin) return; body.vo6Fin = true;
  body.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "vo6part" }); body.append(box); opt.then(box, api, extra); vo6Go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask(extra) : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const box = h("div"); body.append(box); vo6Ask(box, api, ask, { ok: opt.ok, title: opt.askTitle, bad: opt.bad }); vo6Go(box); }
  else api.done(ans, opt.ok || msg);
}

/* ---------- 가로·세로·높이를 바꾸며 쌓기 ----------
   opt: start · min · max · lock[가로,세로,높이] · names · word("쌓기나무") · unit("cm³") · room(바깥 상자, 모서리만) · show() · hideCount
        check(d) → 맞으면 null, 틀리면 까닭 · msg · ask/then · ok · W · maxW · labels(d)→{a,b,c} */
function vo6Dims(body, api, opt) {   /* 끝나면 vo6Then → api.done( */
  let touched = false;
  const names = opt.names || ["가로", "세로", "높이"], mx = opt.max || [10, 8, 8], mn = opt.min || [1, 1, 1];
  let d = (opt.start || [1, 1, 1]).slice();
  if (opt.show) { const sh = opt.show(); if (sh) body.append(sh); }
  const pic = h("div"), cnt = h("div", { class: "vo6cnt" }), vals = [];
  const ctl = h("div", { class: "vo6ctl" });
  names.forEach((nm, i) => {
    const v = h("b", {}, String(d[i])); vals.push(v);
    const lock = opt.lock && opt.lock[i];
    ctl.append(h("span", {}, nm + (opt.dirWord ? opt.dirWord[i] : "")),
      h("button", { type: "button", "aria-label": nm + " 줄이기", disabled: lock, onclick: () => { if (body.vo6Fin) return; d[i] = Math.max(mn[i], d[i] - 1); touched = true; paint(); kick(); } }, "－"), v,
      h("button", { type: "button", "aria-label": nm + " 늘리기", disabled: lock, onclick: () => { if (body.vo6Fin) return; d[i] = Math.min(mx[i], d[i] + 1); touched = true; paint(); kick(); } }, "＋"));
  });
  function paint() {
    d.forEach((x, i) => { vals[i].textContent = String(x); });
    pic.innerHTML = "";
    if (opt.room) pic.append(vo6Solid({ d: opt.room, mode: "box", inner: d, labels: opt.roomLabels, W: opt.W || 260, maxW: opt.maxW || "19em", plain: true, label: "교실 안에 쌓은 상자" }));
    else { const big = mx.map((x, i) => Math.max(x, d[i])); pic.append(vo6Stack(d, { frame: big, floor: [big[0], big[1]], s: Math.min((opt.W || 230) / (big[0] + big[1] * .39), 150 / (big[2] + big[1] * .31)), labels: opt.labels ? opt.labels(d) : null, maxW: opt.maxW || "17em", plain: true, label: "쌓은 직육면체" })); }
    cnt.textContent = opt.hideCount ? "" : opt.countText ? opt.countText(d) : `${opt.word || "쌓기나무"} ${vo6Vol(d)}개`;
    body.querySelectorAll(".vo6fb").forEach(e => e.remove());
  }
  api.provide({ words: opt.words || ["가로", "세로", "높이"], answers: opt.answers || [] });
  const check = () => {
    if (body.vo6Fin) return true;
    api.tryOnce(); const ans = names.map((n, i) => n + " " + d[i]).join(", ");
    const why = opt.check(d); if (why) { api.fail(why, ans); return false; }
    vo6Then(body, api, opt, ans, typeof opt.msg === "function" ? opt.msg(d) : opt.msg || "잘 쌓았어요!", d.slice());
    return true;
  };
  const kick = autoRun(() => touched && (opt.ready ? opt.ready(d) : true), () => d.join(","), check, opt.wait || 1200);
  body.append(h("div", { class: "vo6build" }, h("div", { class: "vo6l" }, ctl, cnt), h("div", { class: "vo6r" }, pic)),
    h("p", { class: "vo6small" }, opt.tip || "＋, － 단추를 누르면 그 방향으로 쌓은 쌓기나무가 한 줄씩 늘거나 줄어요. 다 쌓고 잠시 기다리면 저절로 확인해요."));
  paint();
}

/* ---------- 상자 안을 같은 물건으로 채워 세기 ----------
   opt: box[가로,세로,높이](칸) · unit[칸](물건 하나 크기) · name("쌓기나무") · col · show · ask/then · msg · ok · W · labels */
function vo6Fill(body, api, opt) {   /* 끝나면 vo6Then → api.done( */
  const { out, nx, ny } = vo6Slots(opt.box, opt.unit || [1, 1, 1]), N = out.length, nm = opt.name || "쌓기나무";
  let k = 0;
  if (opt.show) { const sh = opt.show(); if (sh) body.append(sh); }
  const pic = h("div"), cnt = h("div", { class: "vo6cnt" });
  const go = n => { if (body.vo6Fin) return; k = Math.max(0, Math.min(N, n)); paint(); if (k === N) vo6Then(body, api, opt, `${nm} ${N}개`, opt.msg || "상자를 빈틈없이 채웠어요."); };
  const row = nx, layer = nx * ny;
  const btns = h("div", { class: "vo6btns" },
    h("button", { type: "button", onclick: () => go(k + 1) }, "한 개 넣기"),
    h("button", { type: "button", onclick: () => go(Math.floor(k / row) * row + row) }, "한 줄 채우기"),
    opt.noLayer ? null : h("button", { type: "button", onclick: () => go(Math.floor(k / layer) * layer + layer) }, "한 층 채우기"),
    h("button", { type: "button", onclick: () => go(0) }, "모두 꺼내기"));
  function paint() {
    pic.innerHTML = "";
    pic.append(vo6Solid({ d: opt.box, mode: "box", blocks: out.slice(0, k).map(b => Object.assign({ c: opt.col || VO6.cube }, b)), labels: opt.labels, W: opt.W || 230, maxW: opt.maxW || "16em", plain: true, label: "상자" }));
    cnt.textContent = `넣은 ${nm} ${k}개` + (k && k % layer === 0 && !opt.noLayer ? ` (${k / layer}층)` : "");
  }
  api.provide({ words: ["빈틈없이", "같은 물건"], answers: [] });
  body.append(h("div", { class: "vo6build" }, h("div", { class: "vo6l" }, btns, cnt), h("div", { class: "vo6r" }, pic)),
    h("p", { class: "vo6small" }, `단추를 눌러 상자 안에 ${vo6Jo(nm, "을/를")} 빈틈없이 넣어 보세요. 상자가 꽉 차면 저절로 물음이 나와요.`));
  paint();
}

/* ---------- 두 상자의 면끼리 맞대어 보기 ----------
   opt: A, B ([가로,세로,높이], 칸) · need(살펴볼 짝 수) · ask · ok */
function vo6Touch(body, api, opt) {   /* 끝나면 vo6Then → api.done( */
  const kinds = d => { const f = [[d[0], d[2], d[1], "앞면"], [d[1], d[2], d[0], "옆면"], [d[0], d[1], d[2], "윗면"]], seen = new Set(); return f.filter(x => { const k = [x[0], x[1]].sort().join(); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const FA = kinds(opt.A), FB = kinds(opt.B); let ia = 0, ib = 0, turn = false; const tried = new Set();
  const pic = h("div"), msg = h("div", { class: "vo6box" });
  const rowA = h("div", { class: "vo6btns" }, h("span", { class: "jua" }, "가의 면: "));
  const rowB = h("div", { class: "vo6btns" }, h("span", { class: "jua" }, "나의 면: "));
  FA.forEach((f, i) => rowA.append(h("button", { type: "button", onclick: () => { ia = i; paint(); } }, `${f[3]} 모양`)));
  FB.forEach((f, i) => rowB.append(h("button", { type: "button", onclick: () => { ib = i; paint(); } }, `${f[3]} 모양`)));
  const turnB = h("button", { type: "button", onclick: () => { turn = !turn; paint(); } }, "나를 돌려서 대기");
  body.append(h("div", { class: "vo6figs" }, vo6Fr(vo6Solid({ d: opt.A, mode: "solid", s: 16, maxW: opt.wA || "10em", plain: true, tint: { top: "#FFE2B0", front: "#F4B46C", right: "#DC8C4A" } }), (opt.nA || "상자 가")),
    vo6Fr(vo6Solid({ d: opt.B, mode: "solid", s: 16, maxW: opt.wB || "4.6em", plain: true, tint: { top: "#CFE5FA", front: "#8DBDEB", right: "#5C97D0" } }), (opt.nB || "상자 나"))), rowA, rowB, h("div", { class: "vo6btns" }, turnB), pic, msg);
  function paint() {
    [...rowA.querySelectorAll("button")].forEach((b, i) => b.classList.toggle("vo6-pick", i === ia));
    [...rowB.querySelectorAll("button")].forEach((b, i) => b.classList.toggle("vo6-pick", i === ib));
    const a = FA[ia], b0 = FB[ib], b = turn ? [b0[1], b0[0], b0[2]] : b0, u = 26;
    const W = Math.max(a[0], b[0]) * u + 40, Hh = Math.max(a[1], b[1]) * u + 40;
    pic.innerHTML = "";
    pic.append(vo6Fig(W, Hh, s => {
      const y0 = Hh - 20;
      s.append(svgEl("rect", { x: 20, y: y0 - a[1] * u, width: a[0] * u, height: a[1] * u, fill: "rgba(244,180,108,.55)", stroke: "#B5732E", "stroke-width": 2.5 }));
      s.append(svgEl("rect", { x: 20, y: y0 - b[1] * u, width: b[0] * u, height: b[1] * u, fill: "rgba(92,151,208,.35)", stroke: "#2B6FB8", "stroke-width": 2.5, "stroke-dasharray": "6 4" }));
    }, Math.max(7, W / 16) + "em"));
    const same = (a[0] === b[0] ? 1 : 0) + (a[1] === b[1] ? 1 : 0);
    tried.add(ia + "," + ib + "," + turn);
    msg.innerHTML = "";
    msg.append(h("div", {}, `주황색은 가의 ${a[3]}, 파란 점선은 나의 ${b0[3]}이에요.`),
      h("div", {}, same === 2 ? "맞댄 면의 두 길이가 모두 같아요." : same === 1 ? "맞댄 면에서 한 길이만 같고 다른 길이는 서로 달라요. 한 상자가 다른 상자를 다 덮지 못해요." : "맞댄 면에서 같은 길이가 없어요. 어느 쪽은 가가 길고, 어느 쪽은 나가 길어요."),
      h("div", { class: "vo6small" }, `맞대지 않은 나머지 길이: 가는 쌓기나무 ${a[2]}개 길이, 나는 쌓기나무 ${b0[2]}개 길이`));
    if (tried.size >= (opt.need || 4) && !body.vo6Fin) vo6Then(body, api, opt, "여러 가지로 맞대어 봄", "여러 가지로 맞대어 보았어요.");
    else if (!body.vo6Fin) api.hint(`맞대어 본 가짓수 ${tried.size}가지 / ${opt.need || 4}가지`);
  }
  api.provide({ words: ["가로, 세로, 높이", "하나의 길이만 같아요"], answers: [] });
  paint();
}

/* ---------- 전개도에서 면을 눌러 겉넓이 구하기 ----------
   d [가로, 세로, 높이] · mode "six"(여섯 면 더하기) | "pair"(평행한 두 면) | "strip"(옆면을 하나로) | "see"(보기만)
   unit · ask/then · ok · msg · show3d */
function vo6NetFaces(a, b, c) {
  const F = []; let x = 0;
  [["L", b, 1, "왼쪽 옆면"], ["F", a, 2, "앞면"], ["R", b, 1, "오른쪽 옆면"], ["B", a, 2, "뒷면"]].forEach(([id, w, pr, nm]) => { F.push({ id, x, y: b, w, h: c, pair: pr, name: nm, side: true }); x += w; });
  F.push({ id: "T", x: b, y: 0, w: a, h: b, pair: 0, name: "윗면" }); F.push({ id: "D", x: b, y: b + c, w: a, h: b, pair: 0, name: "아랫면" });
  return F;
}
function vo6NetSvg(d, unit, opt = {}) {
  const [a, b, c] = d, F = vo6NetFaces(a, b, c), u = unit || "cm";
  const s = opt.s || Math.min(300 / (2 * a + 2 * b), 230 / (2 * b + c)), L = 54, T = 26;
  const W = (2 * a + 2 * b) * s + L + 20, Hh = (2 * b + c) * s + T + 10;
  const svg = vo6Fig(W, Hh, () => { }, opt.maxW || "22em");
  const rects = {};
  F.forEach(f => {
    const r = svgEl("rect", { x: vo6R(L + f.x * s), y: vo6R(T + f.y * s), width: vo6R(f.w * s), height: vo6R(f.h * s), fill: opt.fill ? opt.fill(f) : "#fff", stroke: VO6.ink, "stroke-width": 2, style: opt.click ? "cursor:pointer" : "" });
    const t = txt(vo6R(L + (f.x + f.w / 2) * s), vo6R(T + (f.y + f.h / 2) * s), opt.text ? opt.text(f) : "", Math.min(15, f.w * s / 3.2, f.h * s / 1.6), { fill: VO6.ink });
    if (opt.click) { r.addEventListener("click", () => opt.click(f)); t.addEventListener("click", () => opt.click(f)); t.style.cursor = "pointer"; }
    svg.append(r, t); rects[f.id] = { r, t, f };
  });
  const lab = (x, y, t, anc) => svg.append(txt(vo6R(x), vo6R(y), t, 14, { fill: VO6.blue, "text-anchor": anc || "middle" }));
  lab(L + (b + a / 2) * s, T - 10, a + " " + u);
  lab(L + b * s - 6, T + b / 2 * s, b + " " + u, "end");
  lab(L - 6, T + (b + c / 2) * s, c + " " + u, "end");
  lab(L + b / 2 * s, T + (b + c) * s + 12, b + " " + u);
  svg.vo6Rects = rects; svg.vo6Box = [L, T, s];
  return svg;
}
function vo6Net(body, api, opt) {   /* 끝나면 vo6Then → api.done( */
  const d = opt.d, [a, b, c] = d, u = opt.unit || "cm", mode = opt.mode || "six", ar = f => f.w * f.h;
  const picked = [], pairs = [];
  const expr = h("div", { class: "vo6expr" }, mode === "six" ? "누른 면의 넓이: " : mode === "pair" ? "누른 면과 평행한 면: " : "");
  let svg;
  const paint = () => {
    Object.values(svg.vo6Rects).forEach(({ r, t, f }) => {
      const on = mode === "six" ? picked.includes(f.id) : pairs.includes(f.pair);
      r.setAttribute("fill", on ? VO6.pair[f.pair] : "#fff");
      t.textContent = on ? `${ar(f)} ${u}²` : "";
    });
    if (mode === "six") expr.textContent = "누른 면의 넓이: " + (picked.length ? picked.map(id => ar(svg.vo6Rects[id].f)).join(" + ") : "");
    if (mode === "pair") expr.textContent = "평행한 두 면: " + pairs.map(p => `${ar(vo6NetFaces(a, b, c).find(q => q.pair === p))} × 2`).join(" + ");
  };
  const click = f => {
    if (body.vo6Fin) return;
    if (mode === "six") { if (!picked.includes(f.id)) picked.push(f.id); paint(); if (picked.length === 6) vo6Then(body, api, opt, picked.join(","), opt.msg || "여섯 면을 모두 눌렀어요."); else api.hint(`누른 면 ${picked.length}개 / 6개`); }
    if (mode === "pair") { if (!pairs.includes(f.pair)) pairs.push(f.pair); paint(); if (pairs.length === 3) vo6Then(body, api, opt, "세 쌍", opt.msg || "평행한 두 면을 세 쌍 모두 찾았어요."); else api.hint(`찾은 쌍 ${pairs.length}쌍 / 3쌍 — 눌러 보면 평행한 면이 함께 색칠돼요.`); }
  };
  svg = vo6NetSvg(d, u, { click: mode === "six" || mode === "pair" ? click : null });
  const left = h("div", {}, svg);
  if (mode === "strip") {
    const [L, T, s] = svg.vo6Box;
    const join = h("button", { type: "button", class: "big", onclick: () => {
      if (body.vo6Fin) return;
      Object.values(svg.vo6Rects).forEach(({ r, f }) => r.setAttribute("fill", f.side ? "#FFE9C4" : VO6.pair[0]));
      Object.values(svg.vo6Rects).forEach(({ r, f }) => { if (f.side) r.setAttribute("stroke-dasharray", "4 3"); });
      svg.append(svgEl("rect", { x: L, y: vo6R(T + b * s), width: vo6R((2 * a + 2 * b) * s), height: vo6R(c * s), fill: "none", stroke: VO6.red, "stroke-width": 4 }));
      svg.append(txt(vo6R(L + (b + a / 2) * s), vo6R(T + (b + c / 2) * s), "옆면", 16, { fill: VO6.red }));
      join.disabled = true;
      vo6Then(body, api, opt, "옆면을 하나로", opt.msg || "옆면 네 개를 하나의 직사각형으로 이어 보았어요.");
    } }, "옆면을 하나로 이어 보기");
    left.append(h("div", { class: "vo6btns" }, join));
  }
  body.append(h("div", { class: "vo6row" }, left, opt.show3d === false ? null : h("div", { style: "flex:0 1 12em" }, vo6Cub(d, u, { maxW: "12em", W: 170 }))));
  if (mode === "six" || mode === "pair") body.append(expr, h("p", { class: "vo6small" }, mode === "six" ? "전개도의 면을 하나씩 눌러 보세요. 누른 면에 넓이가 나타나요." : "면을 하나 누르면 그 면과 평행한 면이 같은 색으로 함께 칠해져요."));
  api.provide({ words: ["여섯 면", "평행한 두 면", "옆면", "밑면"], answers: [] });
  paint();
}

/* ---------- 1 m³ 안에 1 cm³ 쌓기나무 채우기 ---------- */
function vo6M3(body, api, opt) {   /* 끝나면 vo6Then → api.done( */
  let ph = 0; const T = 7;
  const pic = h("div"), note = h("div", { class: "vo6box" }, "단추를 차례로 눌러 1 m³ 정육면체 안에 1 cm³ 쌓기나무를 채워 보세요.");
  const steps = [["한 줄 놓기", "가로 한 줄에 쌓기나무를 놓았어요. 1 m = 100 cm이니까 한 모서리에 쌓기나무를 몇 개 놓을 수 있을까요?"],
    ["한 층 채우기", "한 줄이 세로로 여러 줄 모여 한 층이 되었어요. 한 층에는 쌓기나무가 몇 개일까요?"],
    ["모두 채우기", "한 층이 높이로 여러 층 쌓여 정육면체가 가득 찼어요. 모두 몇 개일까요?"]];
  const btns = steps.map(([t], i) => h("button", { type: "button", disabled: i > 0, onclick: () => { ph = i + 1; btns.forEach((b, k) => { b.disabled = k !== ph; b.classList.toggle("vo6-pick", k === i); }); paint(); } }, t));
  function paint() {
    const blocks = [];
    if (ph === 1) blocks.push({ x: 0, y: 0, z: 0, w: 100, d: T, h: T, step: 10, c: VO6.cube });
    if (ph === 2) blocks.push({ x: 0, y: 0, z: 0, w: 100, d: 100, h: T, step: 10, c: VO6.cube });
    pic.innerHTML = "";
    pic.append(vo6Solid({ d: [100, 100, 100], mode: ph === 3 ? "solid" : "box", grid: ph === 3 ? 10 : 0, tint: { top: VO6.cube[0], front: VO6.cube[1], right: VO6.cube[2] }, blocks, labels: { a: "100 cm", b: "100 cm", c: "100 cm" }, W: 230, maxW: "17em", plain: true, label: "1 m³ 정육면체" }));
    note.textContent = ph ? steps[ph - 1][1] : "단추를 차례로 눌러 1 m³ 정육면체 안에 1 cm³ 쌓기나무를 채워 보세요.";
    if (ph === 3 && !body.vo6Fin) vo6Then(body, api, opt, "모두 채움", "1 m³ 정육면체를 1 cm³ 쌓기나무로 가득 채웠어요.");
  }
  api.provide({ words: ["1 m = 100 cm", "100 × 100 × 100"], answers: [] });
  body.append(h("div", { class: "vo6build" }, h("div", { class: "vo6l" }, h("div", { class: "vo6btns", style: "flex-direction:column;align-items:stretch" }, ...btns)), h("div", { class: "vo6r" }, pic)), note,
    h("p", { class: "vo6small" }, "※ 쌓기나무 한 개는 너무 작아서 그림에서는 10 cm마다 선을 긋고, 줄·층의 두께를 크게 그렸어요."));
  paint();
}

/* ---------- 상자 여러 개를 쌓아 포장하기 ----------
   opt: box[가로,세로,높이] · N · start · check(n) → null | 까닭 · msg · ask(n)/then · ok */
function vo6Pack(body, api, opt) {   /* 끝나면 vo6Then → api.done( */
  const B = opt.box, N = opt.N; let n = (opt.start || [1, 1, 1]).slice(), touched = false;
  const names = ["가로로", "세로로(앞뒤로)", "위로(층)"], vals = [];
  const pic = h("div"), cnt = h("div", { class: "vo6cnt" });
  const ctl = h("div", { class: "vo6ctl" });
  names.forEach((nm, i) => { const v = h("b", {}, ""); vals.push(v);
    ctl.append(h("span", {}, nm), h("button", { type: "button", "aria-label": nm + " 줄이기", onclick: () => { if (body.vo6Fin) return; n[i] = Math.max(1, n[i] - 1); touched = true; paint(); kick(); } }, "－"), v,
      h("button", { type: "button", "aria-label": nm + " 늘리기", onclick: () => { if (body.vo6Fin) return; n[i] = Math.min(N, n[i] + 1); touched = true; paint(); kick(); } }, "＋")); });
  function paint() {
    n.forEach((x, i) => { vals[i].textContent = x + "개"; });
    const bl = []; for (let i = 0; i < n[0]; i++) for (let j = 0; j < n[1]; j++) for (let k = 0; k < n[2]; k++) bl.push({ x: i * B[0], y: j * B[1], z: k * B[2], w: B[0], d: B[1], h: B[2], c: VO6.box });
    const D = [n[0] * B[0], n[1] * B[1], n[2] * B[2]];
    const FR = [B[0] * Math.max(4, n[0]), B[1] * Math.max(4, n[1]), B[2] * Math.max(4, n[2])];
    pic.innerHTML = ""; pic.append(vo6Solid({ d: D, mode: "none", blocks: bl, frame: FR, s: Math.min(230 / (FR[0] + FR[1] * .39), 170 / (FR[2] + FR[1] * .31)), maxW: "16em", plain: true, label: "쌓은 상자" }));
    cnt.textContent = `쌓은 상자 ${n[0] * n[1] * n[2]}개` + (n[0] * n[1] * n[2] === N ? " ✓" : ` (상자는 ${N}개예요)`);
  }
  api.provide({ words: ["가로, 세로, 높이", "겉넓이"], answers: [] });
  const check = () => {
    if (body.vo6Fin) return true;
    api.tryOnce(); const ans = n.join("×");
    const why = opt.check ? opt.check(n) : null; if (why) { api.fail(why, ans); return false; }
    vo6Then(body, api, opt, ans, typeof opt.msg === "function" ? opt.msg(n) : opt.msg || "잘 쌓았어요!", n.slice());
    return true;
  };
  const kick = autoRun(() => touched && n[0] * n[1] * n[2] === N, () => n.join(","), check, 1200);
  body.append(h("div", { class: "vo6build" }, h("div", { class: "vo6l" }, ctl, cnt), h("div", { class: "vo6r" }, pic)),
    h("p", { class: "vo6small" }, `상자 한 개는 가로 ${B[0]} cm, 세로 ${B[1]} cm, 높이 ${B[2]} cm예요. ＋, － 단추로 상자를 몇 개씩 놓을지 정해 보세요. 상자 ${N}개를 모두 쌓으면 저절로 확인해요.`));
  paint();
}
/* 쌓은 모양 n(가로·세로·층 개수)의 크기·부피·겉넓이 */
const vo6PackD = (B, n) => [B[0] * n[0], B[1] * n[1], B[2] * n[2]];

/* ---------- 주변 물건으로 문제 만들고 바꾸어 풀기 ----------
   opt.kind "vol" | "surf" · friend {obj, d, a, why} */
const VO6_OBJ = ["지우개", "필통", "과자 상자", "택배 상자", "사물함", "주사위", "초콜릿 상자", "휴지 상자"];
function vo6Make(body, api, opt) {   /* 짝의 문제(vo6Ask)를 맞히면 api.done( */
  const vol = opt.kind !== "surf", U = vol ? "cm³" : "cm²", word = vol ? "부피" : "겉넓이";
  let obj = null;
  const ob = h("div", { class: "vo6btns" }, h("span", { class: "jua" }, "물건: "));
  (opt.objs || VO6_OBJ).forEach(o => ob.append(h("button", { type: "button", onclick: e => { if (made) return; obj = o; [...ob.querySelectorAll("button")].forEach(b => b.classList.remove("vo6-pick")); e.currentTarget.classList.add("vo6-pick"); } }, o)));
  const ins = ["가로", "세로", "높이"].map(n => h("input", { type: "text", inputmode: "decimal", "aria-label": n }));
  const mk = h("div", { class: "vo6mk" }, ...["가로", "세로", "높이"].flatMap((n, i) => [h("span", {}, n), ins[i], h("span", {}, "cm")]));
  const out = h("div");
  let made = false;
  body.append(h("p", { class: "inst" }, h("b", {}, "① 내 문제 만들기 — "), "교실에서 직육면체 모양의 물건을 하나 고르고, 자로 잰 가로·세로·높이를 써 보세요(자연수나 소수 한 자리)."), ob, mk);
  const make = h("button", { class: "big", onclick: () => {
    const d = ins.map(i => vo6Num(i.value));
    if (!obj) return api.hint("먼저 물건을 하나 골라 보세요.");
    if (d.some(v => isNaN(v) || v <= 0 || v > 300 || Math.abs(Math.round(v * 10) - v * 10) > 1e-9)) return api.hint("가로·세로·높이를 0보다 크고 300보다 작거나 같은 수로, 소수는 한 자리까지 써 보세요.");
    made = true; make.disabled = true; ins.forEach(i => { i.disabled = true; });
    const qs = `가로가 ${d[0]} cm, 세로가 ${d[1]} cm, 높이가 ${d[2]} cm인 직육면체 모양의 ${vo6Jo(obj, "이/가")} 있습니다. 이 ${obj}의 ${vo6Jo(word, "은/는")} 몇 ${U}인가요?`;
    const right = vo6Fix(vol ? vo6Vol(d) : vo6Surf(d)), inp = h("input", { type: "text", inputmode: "decimal", style: "width:7em;font-size:1.1em;text-align:center", "aria-label": "내 문제의 답" });
    out.append(h("div", { class: "vo6note", style: "display:block;margin:.4em 0" }, "내가 만든 문제: " + qs), vo6Cub(d.map(v => Math.max(v, Math.max(...d) / 8)), "cm", { labels: { a: d[0] + " cm", b: d[1] + " cm", c: d[2] + " cm" }, maxW: "13em" }),
      h("p", { class: "sent" }, "내 문제의 답: ", inp, " " + U), h("p", { class: "vo6small" }, "답을 쓰고 잠시 기다리면 저절로 확인해요. 계산기를 써도 돼요."));
    let ok = false, last = null;
    const chk = () => {
      if (ok) return true; const v = vo6Num(inp.value); if (isNaN(v)) return false;
      if (String(v) === last) return false; last = String(v);
      api.tryOnce();
      if (Math.abs(v - right) > 1e-6) {
        const why = !vol && Math.abs(v - right / 2) < 1e-6 ? "세 면의 넓이를 더한 것만 구했어요. 서로 평행한 면이 두 개씩 있으니 2배 해야 해요." : vol ? "(가로) × (세로) × (높이)를 다시 계산해 봐요. 소수가 있으면 계산기를 써도 돼요." : "(한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2를 다시 계산해 봐요. 계산기를 써도 돼요.";
        inp.style.borderColor = "var(--no)"; api.fail(why, inp.value); return false;
      }
      ok = true; inp.readOnly = true; inp.style.borderColor = "var(--ok)";
      const f = opt.friend, box = h("div", { class: "vo6part" });
      box.append(h("p", { class: "inst" }, h("b", {}, "② 바꾸어 풀기 — "), `${vo6Jo(f.who || "짝", "이/가")} 만든 문제를 풀어 보세요.`), h("div", { class: "vo6note", style: "display:block;margin:.4em 0" }, f.q), vo6Cub(f.d, "cm", { maxW: "12em" }));
      body.append(box); vo6Go(box);
      vo6Ask(box, api, [{ parts: [`${f.obj}의 ${vo6Jo(word, "은/는")} `, { n: f.a, why: f.why }, " " + U + "예요."] }], { ok: opt.ok });
      return true;
    };
    let tm = null;
    inp.addEventListener("input", e => { inp.style.borderColor = ""; clearTimeout(tm); if (!e.isComposing) tm = setTimeout(chk, 900); });
    inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); inp.blur(); clearTimeout(tm); tm = setTimeout(chk, 50); } });
    api.hint("문제를 만들었어요. 내 문제의 답을 구해 써 보세요.");
  } }, "문제 만들기");
  api.provide({ words: ["가로", "세로", "높이"], answers: [] });
  body.append(h("div", { class: "actions" }, make), out);
}

/* ---------- 붙임쪽지 찾기 놀이 ---------- */
const VO6_NAMES = ["서아", "준혁", "하린", "지안", "태민", "윤슬", "도경", "나래", "시온", "가람"];
const VO6_SPOTS = [[95, 70], [205, 150], [330, 60], [470, 120], [585, 70], [700, 150], [60, 245], [250, 300], [430, 235], [560, 300], [700, 260], [345, 370]];
function vo6Rnd(n) { return 1 + Math.floor(Math.random() * n); }
function vo6Hunt(body, api, opt) {   /* 쪽지 부피를 모두 바르게 구하면 api.done( */
  const notes = [], used = new Set();
  const spots = VO6_SPOTS.slice().sort(() => Math.random() - .5).slice(0, 9);
  spots.forEach((p, i) => { let d; do { d = [vo6Rnd(20), vo6Rnd(20), vo6Rnd(20)]; } while (used.has(d.join())); used.add(d.join()); notes.push({ p, d, name: VO6_NAMES[(i + 1) % VO6_NAMES.length], got: false }); });
  let left = opt.time || 180, timer = null, picked = [], over = false;
  const clock = h("div", { class: "vo6cnt" }), list = h("div", { class: "vo6notes" }), area = h("div");
  const svg = vo6Fig(800, 440, s => {
    s.append(svgEl("rect", { x: 0, y: 0, width: 800, height: 330, fill: "#F6EEDF" }), svgEl("rect", { x: 0, y: 330, width: 800, height: 110, fill: "#E2CDA8" }));
    s.append(svgEl("rect", { x: 230, y: 30, width: 300, height: 140, rx: 6, fill: "#2F5D4B", stroke: "#7A5530", "stroke-width": 6 }));
    s.append(txt(380, 100, "칠판", 26, { fill: "#E9F2EC" }));
    s.append(svgEl("rect", { x: 40, y: 40, width: 120, height: 120, fill: "#CFE7F7", stroke: "#8A9AA5", "stroke-width": 5 }), svgEl("line", { x1: 100, x2: 100, y1: 40, y2: 160, stroke: "#8A9AA5", "stroke-width": 4 }));
    s.append(svgEl("circle", { cx: 610, cy: 60, r: 30, fill: "#fff", stroke: "#7A5530", "stroke-width": 4 }), svgEl("line", { x1: 610, y1: 60, x2: 610, y2: 40, stroke: VO6.ink, "stroke-width": 3 }), svgEl("line", { x1: 610, y1: 60, x2: 625, y2: 66, stroke: VO6.ink, "stroke-width": 3 }));
    s.append(svgEl("rect", { x: 660, y: 120, width: 110, height: 210, fill: "#B98C5A", stroke: "#7A5530", "stroke-width": 3 }));
    [0, 1, 2].forEach(i => s.append(svgEl("line", { x1: 660, x2: 770, y1: 190 + i * 45, y2: 190 + i * 45, stroke: "#7A5530", "stroke-width": 3 })));
    s.append(svgEl("rect", { x: 20, y: 200, width: 90, height: 130, fill: "#9FB7C6", stroke: "#6B8291", "stroke-width": 3 }));
    [[200, 260], [400, 270], [540, 260]].forEach(([x, y]) => { s.append(svgEl("rect", { x, y, width: 120, height: 18, fill: "#C9A16B", stroke: "#7A5530", "stroke-width": 2 }), svgEl("rect", { x: x + 8, y: y + 18, width: 8, height: 60, fill: "#7A5530" }), svgEl("rect", { x: x + 104, y: y + 18, width: 8, height: 60, fill: "#7A5530" })); });
    s.append(svgEl("rect", { x: 300, y: 350, width: 40, height: 40, fill: "#C46A3C" }), svgEl("circle", { cx: 320, cy: 335, r: 26, fill: "#5E9E5A" }));
  }, "100%");
  svg.style.maxWidth = "40em";
  const marks = notes.map(nt => {
    const [x, y] = nt.p, g = svgEl("g", { style: "cursor:pointer", transform: `rotate(${(Math.random() * 16 - 8).toFixed(1)} ${x} ${y})` });
    g.append(svgEl("rect", { x: x - 10, y: y - 10, width: 20, height: 20, fill: "#FFF3A6", stroke: "#D9B93A", "stroke-width": 2 }), svgEl("polygon", { points: `${x + 10},${y + 4} ${x + 10},${y + 10} ${x + 4},${y + 10}`, fill: "#E8D46A" }));
    g.addEventListener("click", () => take(nt, g)); svg.append(g); return g;
  });
  function take(nt, g) {
    if (body.vo6Fin || over || nt.got || left <= 0) return;
    if (picked.length >= 3) return api.hint("붙임쪽지는 한 사람이 3장까지만 찾을 수 있어요. ‘다 찾았어요’를 눌러요.");
    nt.got = true; picked.push(nt); g.style.display = "none";
    const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": nt.name + " 쪽지의 부피" }); nt.inp = inp;
    inp.addEventListener("input", e => { inp.style.borderColor = ""; if (!e.isComposing) later(900); });
    inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); inp.blur(); later(60); } });
    list.append(h("div", { class: "vo6note" }, h("div", {}, nt.name), h("div", {}, `가로 ${nt.d[0]} cm`), h("div", {}, `세로 ${nt.d[1]} cm`), h("div", {}, `높이 ${nt.d[2]} cm`), h("div", {}, "부피 ", inp, " cm³")));
    api.hint(`찾은 쪽지 ${picked.length}장 / 3장`);
    if (picked.length === 3) stop();
  }
  function stop() { over = true; if (timer) { clearInterval(timer); timer = null; } doneB.disabled = true; clock.textContent = "찾기 끝! 자리에 돌아와 쪽지에 적힌 직육면체의 부피를 구해 빈 곳에 써요."; checkWrap.style.display = ""; }
  const start = h("button", { type: "button", class: "big", onclick: () => {
    start.disabled = true; area.style.display = ""; clock.textContent = `남은 시간 ${left}초`;
    timer = setInterval(() => { if (!document.body.contains(clock)) { clearInterval(timer); timer = null; return; } left--; clock.textContent = `남은 시간 ${left}초`; if (left <= 0) { if (picked.length) stop(); else { clearInterval(timer); timer = null; left = opt.time || 180; start.disabled = false; clock.textContent = "시간이 다 되었어요. 한 장도 찾지 못했으니 다시 시작해 봐요."; } } }, 1000);
  } }, "눈 뜨고 찾기 시작!");
  const doneB = h("button", { type: "button", onclick: () => { if (!picked.length) return api.hint("붙임쪽지를 한 장 이상 찾아요."); stop(); } }, "다 찾았어요");
  const judge = () => {
    if (body.vo6Fin) return true;
    api.tryOnce(); let score = 0; const ans = picked.map(nt => nt.inp.value || "-").join(",");
    picked.forEach(nt => { const ok = vo6Num(nt.inp.value) === vo6Vol(nt.d); nt.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (ok) score++; });
    if (score < picked.length) { api.fail(`쪽지 ${picked.length}장 중 ${score}장을 바르게 구했어요. 빨간 칸을 (가로) × (세로) × (높이)로 다시 계산해 봐요. 계산기를 써도 돼요.`, ans); return false; }
    body.vo6Fin = true; picked.forEach(nt => { nt.inp.readOnly = true; });
    api.done(ans, `${picked.map(nt => nt.name).join(", ")}에게 찾아가 물어보니 모두 정답! 부피를 바르게 구한 쪽지 ${score}장 → ${score}점을 얻었어요.`);
    return true;
  };
  const kick = autoRun(() => over && picked.length > 0 && picked.every(nt => nt.inp.value.trim() !== ""), () => picked.map(nt => nt.inp.value.trim()).join(","), judge, 0);
  let tmH = null; function later(w) { clearTimeout(tmH); tmH = setTimeout(kick, w); }
  const checkWrap = h("div", { style: "display:none" }, h("p", { class: "vo6small" }, "쪽지마다 부피를 다 쓰고 잠시 기다리면, 쪽지 주인에게 찾아가 답을 맞추어 봐요(저절로 확인해요)."));
  area.style.display = "none";
  area.append(svg, h("div", { class: "vo6btns" }, doneB), h("p", { class: "vo6small" }, "교실 곳곳에 친구들이 붙인 노란 붙임쪽지가 있어요. 눌러서 3장까지 찾아요."));
  api.provide({ words: ["(가로) × (세로) × (높이)", "부피 cm³"], answers: [] });
  body.append(h("div", { class: "vo6btns" }, start), clock, area, list, checkWrap);
}

/* ---------- 내 쪽지 만들기 → 친구가 구한 답 확인하기 ---------- */
function vo6Notes(body, api, opt) {   /* 친구 답을 모두 바르게 가려내면 api.done( */
  const rows = [0, 1, 2].map(() => [0, 1, 2].map(k => h("input", { type: "text", inputmode: "numeric", "aria-label": ["가로", "세로", "높이"][k] })));
  const tb = h("table", { class: "vo6tbl" }, h("tr", {}, h("th", {}, "쪽지"), h("th", {}, "가로(cm)"), h("th", {}, "세로(cm)"), h("th", {}, "높이(cm)")),
    ...rows.map((r, i) => h("tr", {}, h("td", {}, `${i + 1}장`), ...r.map(inp => h("td", {}, inp)))));
  const out = h("div");
  body.append(h("p", { class: "inst" }, "붙임쪽지 3장에 서로 다른 크기의 직육면체의 가로, 세로, 높이를 적어요. 1부터 20까지의 자연수로 써요."), tb);
  const put = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const D = rows.map(r => r.map(i => vo6Num(i.value)));
    if (D.some(d => d.some(v => !Number.isInteger(v) || v < 1 || v > 20))) return api.fail("가로, 세로, 높이는 1부터 20까지의 자연수로 써요.", "-");
    const keys = D.map(d => d.slice().sort((a, b) => a - b).join()); if (new Set(keys).size < 3) return api.fail("세 쪽지는 서로 다른 크기의 직육면체여야 해요. 같은 크기가 있어요.", "-");
    put.disabled = true; rows.flat().forEach(i => { i.disabled = true; });
    const wrongAt = Math.floor(Math.random() * 3), friend = VO6_NAMES[3];
    const res = D.map((d, i) => { const v = vo6Vol(d); if (i !== wrongAt) return v; const w = d[0] * d[1] + d[2]; return w !== v ? w : v + 10; });
    const pick = res.map(() => null);
    out.append(h("p", { class: "inst" }, `다른 모둠의 ${vo6Jo(friend, "이/가")} 내 쪽지 3장을 찾아 부피를 구해 왔어요. 맞으면 ‘정답이야!’, 틀리면 ‘다시 구해 봐!’를 눌러요.`));
    D.forEach((d, i) => { const r = h("div", { class: "vo6btns" }, h("span", { class: "vo6note" }, `가로 ${d[0]} cm · 세로 ${d[1]} cm · 높이 ${d[2]} cm · 부피 ${res[i]} cm³`));
      ["정답이야!", "다시 구해 봐!"].forEach((t, k) => r.append(h("button", { type: "button", onclick: e => { pick[i] = k; [...r.querySelectorAll("button")].forEach(b => b.classList.remove("vo6-pick")); e.currentTarget.classList.add("vo6-pick"); } }, t)));
      out.append(r); });
    const judge = () => {
      if (body.vo6Fin) return true;
      api.tryOnce(); const ans = pick.map(p => p == null ? "-" : ["정답", "틀림"][p]).join(",");
      const bad = pick.findIndex((p, i) => (p === 0) !== (res[i] === vo6Vol(D[i])));
      if (bad >= 0) { api.fail(`${bad + 1}장의 부피를 (가로) × (세로) × (높이)로 직접 계산해서 친구의 답과 견주어 봐요.`, ans); return false; }
      body.vo6Fin = true;
      api.done(ans, `잘 확인했어요. ${wrongAt + 1}장은 ${D[wrongAt].join(" × ")} = ${vo6Vol(D[wrongAt])}(cm³)인데 친구가 잘못 구했어요. ${vo6Jo(friend, "이/가")} 얻은 점수는 2점이에요.`);
      return true;
    };
    const kickN = autoRun(() => pick.every(p => p != null), () => pick.join(","), judge, 260);
    out.addEventListener("click", e => { if (e.target.closest("button")) kickN(); });
    out.append(h("p", { class: "vo6small" }, "세 쪽지를 모두 고르면 저절로 확인해요."));
    vo6Go(out);
  } }, "쪽지 붙이기");
  api.provide({ words: ["1부터 20까지의 자연수", "서로 다른 크기"], answers: [] });
  body.append(h("div", { class: "actions" }, put), out);
}

/* ---------- 또 다른 놀이: 종이 3장 뒤집기 (컴퓨터 친구와 둘이) ---------- */
function vo6Cards(body, api, opt) {   /* 기록표를 바르게 채우면 api.done( */
  const K = ["가로", "세로", "높이"], per = opt.per || 4, cards = [];
  K.forEach(k => { for (let i = 0; i < per; i++) cards.push({ k, v: vo6Rnd(20) }); });
  cards.sort(() => Math.random() - .5); cards.forEach(c => { c.up = false; c.gone = false; c.seen = false; });
  const mine = [], his = []; let turn = 0, sel = [], busy = false;
  const grid = h("div", { class: "vo6cards" }), info = h("div", { class: "vo6cnt" }), log = h("div", { class: "vo6small" }), tables = h("div");
  const btns = cards.map((c, i) => { const b = h("button", { type: "button", onclick: () => flip(i) }, "?"); grid.append(b); return b; });
  const show = () => cards.forEach((c, i) => { const b = btns[i]; b.className = c.gone ? "vo6gone" : c.up ? "vo6up" : ""; b.textContent = c.up ? `${c.k} ${c.v} cm` : "?"; });
  const okSet = S => new Set(S.map(i => cards[i].k)).size === 3;
  function settle(who) {
    busy = true; show();
    setTimeout(() => {
      const good = okSet(sel), S = sel.slice(); sel = [];
      if (good) { const rec = {}; S.forEach(i => { rec[cards[i].k] = cards[i].v; cards[i].gone = true; }); (who ? his : mine).push([rec["가로"], rec["세로"], rec["높이"]]); log.textContent = `${who ? "컴퓨터 친구" : "나"}: 가로·세로·높이가 모두 있어서 가져왔어요.`; }
      else { S.forEach(i => { cards[i].up = false; cards[i].seen = true; }); const miss = K.filter(k => !S.some(i => cards[i].k === k)); log.textContent = `${who ? "컴퓨터 친구" : "나"}: ${vo6Jo(miss.join("·"), "이/가")} 없어서 다시 뒤집어 놓았어요.`; }
      show(); busy = false;
      if (cards.every(c => c.gone)) return finish();
      turn = 1 - turn; info.textContent = turn ? "컴퓨터 친구 차례예요." : "내 차례예요. 종이 3장을 골라 뒤집어요.";
      if (turn) setTimeout(cpu, 700);
    }, 1300);
  }
  function flip(i) {
    if (busy || turn || body.vo6Fin) return; const c = cards[i]; if (c.gone || c.up) return;
    c.up = true; sel.push(i); show(); if (sel.length === 3) settle(0);
  }
  function cpu() {
    const live = cards.map((c, i) => i).filter(i => !cards[i].gone), memo = {};
    live.forEach(i => { if (cards[i].seen && !memo[cards[i].k]) memo[cards[i].k] = i; });
    const pick = []; if (K.every(k => memo[k] != null) && Math.random() < .6) K.forEach(k => pick.push(memo[k]));
    while (pick.length < 3) { const r = live[Math.floor(Math.random() * live.length)]; if (!pick.includes(r)) pick.push(r); }
    let n = 0; const step = () => { const i = pick[n++]; cards[i].up = true; sel.push(i); show(); if (n < 3) setTimeout(step, 450); else settle(1); }; step();
  }
  function finish() {
    info.textContent = "종이가 모두 없어졌어요! 기록표에 부피를 구해 써요." + (mine.length ? "" : " 내가 가져온 종이가 없으니 합계에 0을 써요.");
    const ins = mine.map(() => h("input", { type: "text", inputmode: "numeric", "aria-label": "부피" })), sumIn = h("input", { type: "text", inputmode: "numeric", "aria-label": "부피의 합" });
    tables.append(h("table", { class: "vo6tbl" }, h("tr", {}, h("th", {}, "가로(cm)"), h("th", {}, "세로(cm)"), h("th", {}, "높이(cm)"), h("th", {}, "부피(cm³)")),
      ...mine.map((d, i) => h("tr", {}, h("td", {}, String(d[0])), h("td", {}, String(d[1])), h("td", {}, String(d[2])), h("td", {}, ins[i]))),
      h("tr", {}, h("th", { colspan: 3 }, "합계"), h("td", {}, sumIn))));
    const hs = his.reduce((t, d) => t + vo6Vol(d), 0);
    const judge = () => {
      if (body.vo6Fin) return true;
      api.tryOnce(); const ans = ins.map(i => i.value || "-").join(",") + " / " + (sumIn.value || "-");
      let bad = false; mine.forEach((d, i) => { const ok = vo6Num(ins[i].value) === vo6Vol(d); ins[i].style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok) bad = true; });
      if (bad) { api.fail("빨간 칸의 부피를 (가로) × (세로) × (높이)로 다시 구해 봐요.", ans); return false; }
      const ms = mine.reduce((t, d) => t + vo6Vol(d), 0);
      if (vo6Num(sumIn.value) !== ms) { sumIn.style.borderColor = "var(--no)"; api.fail("부피를 모두 더해 합계를 다시 구해 봐요.", ans); return false; }
      sumIn.style.borderColor = "var(--ok)"; body.vo6Fin = true;
      api.done(ans, `내 부피의 합은 ${ms} cm³, 컴퓨터 친구의 부피의 합은 ${hs} cm³예요. ` + (ms > hs ? "내가 이겼어요!" : ms < hs ? "컴퓨터 친구가 이겼어요. 그래도 부피를 모두 바르게 구했어요!" : "비겼어요!"));
      return true;
    };
    const all = ins.concat([sumIn]);
    const kickC = autoRun(() => all.every(i => i.value.trim() !== ""), () => all.map(i => i.value.trim()).join(","), judge, 0);
    let tmC = null; const laterC = w => { clearTimeout(tmC); tmC = setTimeout(kickC, w); };
    all.forEach(i => { i.addEventListener("input", e => { i.style.borderColor = ""; if (!e.isComposing) laterC(900); });
      i.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); i.blur(); laterC(60); } }); });
    tables.append(h("p", { class: "vo6small" }, "부피와 합계를 모두 쓰고 잠시 기다리면 저절로 확인해요."));
    vo6Go(tables);
  }
  api.provide({ words: ["가로, 세로, 높이가 모두 있으면 가져와요", "부피의 합"], answers: [] });
  info.textContent = "내 차례예요. 종이 3장을 골라 뒤집어요.";
  body.append(info, grid, log, tables, h("p", { class: "vo6small" }, `※ 앱에서는 종이를 ${per * 3}장(가로·세로·높이 ${per}장씩)으로 줄였어요. 수는 1부터 20까지의 자연수예요.`));
  show();
}
//@@LESSONS
const UNIT_STORY = { title: "6학년 1반 교실 새 단장", lines: [
  "햇살초등학교 6학년 1반은 교실 뒤편을 새로 꾸미기로 했어요. 작은 수족관을 들이고, 흩어진 물건을 정리할 수납 상자와 수납장도 마련해요. 반장 서아, 수족관 담당 준혁, 정리 담당 하린, 꾸미기 담당 지안, 질문 대장 태민이 친구들과 함께 준비해요.",
  "어느 수납 상자에 물건이 더 많이 들어가는지 견주며 부피의 단위 1 cm³를 알고, 수조 받침 상자에 쌓기나무를 채워 직육면체의 부피를 구해요. 큰 수납장과 교실의 부피를 나타내며 1 m³와 1 cm³의 관계를 알아보고, 수납장을 시트지로 감싸며 직육면체의 겉넓이를 구해요.",
  "수족관 용품 상자를 쌓아 비닐을 아끼는 방법을 찾고, 부피 쪽지 찾기 놀이와 교실 새 단장 발표회로 마무리해요."],
  one: "6학년 1반 교실 새 단장 · 수족관과 수납장을 마련하며 직육면체의 부피와 겉넓이를 구해요." };
const UNIT_KEYWORDS = ["부피", "겉넓이", "1 cm³(1 세제곱센티미터)", "1 m³(1 세제곱미터)", "1 m³ = 1000000 cm³", "쌓기나무", "가로", "세로", "높이", "한 밑면의 넓이", "(가로) × (세로) × (높이)", "정육면체", "여섯 면의 넓이의 합", "평행한 두 면", "옆면", "전개도"];

/* ---- 이야기의 수(모두 이 앱에서 정함 — 교과서와 다른 수) ---- */
const VO6S = {
  boxA: [6, 2, 3], boxB: [2, 4, 4], eraser: [2, 1, 3],      // 2차시: 가 = 쌓기나무 36개 = 지우개 6개, 나 = 쌓기나무 32개
  f1: [5, 3, 2], f2: [4, 4, 3],                              // 3~4차시: 한 층 15개씩 2층 = 30, 한 층 16개씩 3층 = 48
  build: [7, 3, 4], cube: [4, 4, 4],                         // 84 cm³, 64 cm³
  room: [8, 6, 3],                                           // 5~6차시 교실(m): 1 m³ 정육면체 144개
  net: [6, 3, 4],                                            // 7~8차시 수납장 모형: 면 18·12·24, 겉넓이 108
  pkg: [9, 5, 2],                                            // 9차시 수족관 용품 상자
  e11a: [4, 3, 2], e11b: [5, 2, 2]                           // 11차시: 24개, 20개
};
/* 9차시: 상자 8개를 쌓는 모든 방법(가로·세로·층 개수)의 겉넓이 — 가장 적은 것은 1×2×4(484 cm²) 하나뿐 */
const VO6S_P8 = (() => { const out = []; for (let a = 1; a <= 8; a++) for (let b = 1; b <= 8; b++) for (let c = 1; c <= 8; c++) if (a * b * c === 8) out.push({ n: [a, b, c], s: vo6Surf(vo6PackD(VO6S.pkg, [a, b, c])) }); return out; })();
(function () {   // 이야기의 수가 맞는지 확인(맞지 않으면 콘솔에 알림)
  const t = (c, m) => { if (!c) console.error("[u6-volume 이야기 수 확인] " + m); };
  t(vo6Vol(VO6S.boxA) === 36 && vo6Vol(VO6S.boxB) === 32 && vo6Slots(VO6S.boxA, VO6S.eraser).out.length === 6, "2차시 상자");
  t(vo6Vol(VO6S.f1) === 30 && vo6Vol(VO6S.f2) === 48 && vo6Vol(VO6S.build) === 84 && vo6Vol(VO6S.cube) === 64, "3~4차시");
  t(vo6Vol(VO6S.room) === 144 && 300 * 100 * 200 === 6000000 && 400 * 50 * 150 === 3000000, "5~6차시");
  t(vo6Surf(VO6S.net) === 108 && vo6Surf([5, 5, 5]) === 150 && vo6Surf([4, 2, 5]) === 76 && vo6Surf([20, 10, 15]) === 1300 && vo6Surf([25, 10, 10]) === 1200 && vo6Surf([8, 4, 10]) === 304, "7~8차시");
  t(vo6Surf(vo6PackD(VO6S.pkg, [1, 1, 4])) === 314 && vo6Surf(vo6PackD(VO6S.pkg, [2, 2, 1])) === 472 && vo6Surf(vo6PackD(VO6S.pkg, [1, 2, 4])) === 484 && vo6Surf(vo6PackD(VO6S.pkg, [2, 2, 2])) === 584, "9차시");
  t(VO6S_P8.filter(o => o.s === 484).length === 1 && Math.min(...VO6S_P8.map(o => o.s)) === 484, "9차시 상자 8개(가장 적은 겉넓이는 한 가지)");
  t(vo6Surf([10, 4, 3]) === 164 && vo6Surf([8, 3, 5]) === 158 && vo6Surf([5, 5, 3]) === 110, "11차시");
})();
const vo6sDim = D => `가로 ${D[0]} cm, 세로 ${D[1]} cm, 높이 ${D[2]} cm`;
const VO6S_WATER = ["#D8EEFB", "#A9D4F2", "#86BEE6"], VO6S_BOX = { top: "#E9D3AE", front: "#C9A16B", right: "#A9824E" }, VO6S_LOCK = { top: "#D7E8D0", front: "#9CC48F", right: "#77A869" };
/* 교실 뒤편 그림: 작은 수족관(물이 담긴 수조) · 수납 상자 · 사물함 */
function vo6sScene() {
  return h("div", { class: "vo6figs" },
    vo6Fr(vo6Solid({ d: [6, 3, 4], mode: "box", blocks: [{ x: 0, y: 0, z: 0, w: 6, d: 3, h: 3.2, c: VO6S_WATER }], s: 18, maxW: "9em", plain: true, label: "작은 수족관" }), "작은 수족관(수조)"),
    vo6Fr(vo6Solid({ d: [5, 4, 3], s: 16, maxW: "8em", plain: true, tint: VO6S_BOX, label: "수납 상자" }), "수납 상자"),
    vo6Fr(vo6Solid({ d: [3, 2, 7], s: 15, grid: 0, maxW: "5.5em", plain: true, tint: VO6S_LOCK, label: "사물함" }), "사물함"));
}
const vo6sStackFig = (d, cap, fr) => vo6Fr(vo6Stack(d, { s: 15, frame: fr || d, maxW: "8.5em", plain: true }), cap);

const LESSONS = [
{
  id: "s1", no: 1, title: "교실 새 단장을 계획해요", soop: "개념 찾기(S)",
  question: "교실 뒤편을 새로 꾸밀 때 부피와 겉넓이는 언제 필요할까요?",
  summary: "부피는 어떤 물건이 공간에서 차지하는 크기이고, 겉넓이는 입체도형의 겉면의 넓이예요. 수조에 물이 얼마나 들어가는지, 수납 상자에 물건이 얼마나 들어가는지 알려면 부피를, 수납장을 시트지로 감싸려면 겉넓이를 알아야 해요. 이 단원에서는 부피 비교와 1 cm³ → 직육면체의 부피 → 1 m³ → 직육면체의 겉넓이 차례로 알아봐요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "햇살초등학교 6학년 1반은 교실 뒤편을 새로 꾸미기로 했어요. 반장 서아가 교실 뒤편에 들일 작은 수족관과 수납 상자, 사물함을 그림으로 보여 주었어요. 그림을 보고 떠오르는 것을 세 칸에 써서 붙여요.", hints: ["수조, 수납 상자, 사물함의 모양과 크기를 살펴봐요.", "교실을 꾸미려면 무엇을 알아야 할지 떠올려요."],
      render: (b, a) => { b.append(vo6sScene()); panes(b, a, [
        { t: "보여요", e: "👀", ph: "~이 보여요", hint: "그림 속 물건의 모양", ex: ["물이 담긴 수조와 수납 상자, 사물함이 모두 직육면체 모양이에요.", "사물함은 길쭉하고, 수납 상자는 수조보다 조금 작아 보여요."] },
        { t: "생각해요", e: "💭", ph: "~일 것 같아요", hint: "물건의 크기에 대한 내 생각", ex: ["수조가 클수록 물이 더 많이 들어갈 것 같아요.", "수납장을 시트지로 감싸려면 겉면의 넓이를 알아야 할 것 같아요."] },
        { t: "궁금해요", e: "❓", ph: "~은 어떻게 알까?", hint: "크기를 견주거나 재는 방법", ex: ["두 수납 상자 중 어느 상자에 물건이 더 많이 들어갈까?", "수조에 물을 가득 채우면 물이 얼마만큼 들어갈까?"] }],
        { ok: "교실 뒤편의 물건이 모두 직육면체 모양이에요! 이 단원에서 직육면체의 크기를 재는 방법을 알아봐요." }); } },
    { name: "그려 보기 — 부피일까, 겉넓이일까", inst: "담임 선생님: “어떤 물건이 공간에서 차지하는 크기를 부피라 하고, 입체도형의 겉면의 넓이를 겉넓이라고 한단다.” 친구들의 궁금증을 풀려면 부피와 겉넓이 중 무엇을 알아야 할까요?", hints: ["얼마나 담을 수 있는지, 얼마나 들어가는지는 공간의 크기예요.", "겉면을 감싸거나 덮는 데 드는 양은 겉면의 넓이예요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "준혁: “수조에 물을 가득 채우면 물이 얼마만큼 들어갈까?”", o: ["부피", "겉넓이"], a: 0, why: { "1": "수조에 들어가는 물의 양은 수조 안의 공간의 크기예요." } },
        { q: "지안: “수납장 겉면을 시트지로 겹치지 않게 감싸려면 시트지가 얼마나 필요할까?”", o: ["부피", "겉넓이"], a: 1, why: { "0": "시트지는 수납장의 겉면을 덮어요. 겉면의 넓이를 알아야 해요." } },
        { q: "하린: “사물함 칸 안에 수납 상자가 몇 개 들어갈까?”", o: ["부피", "겉넓이"], a: 0, why: { "1": "상자가 몇 개 들어가는지는 사물함 칸 안의 공간의 크기와 관계있어요." } },
        { q: "서아: “정리 상자 겉면에 색종이를 빈틈없이 붙이려면 색종이가 얼마나 필요할까?”", o: ["부피", "겉넓이"], a: 1, why: { "0": "색종이는 상자의 겉면에 붙여요. 겉면의 넓이를 알아야 해요." } }],
        { ok: "담을 수 있는 양은 부피, 겉면을 감싸는 양은 겉넓이로 알 수 있어요." }),
        { q: "부피와 겉넓이는 무엇이 다른지 써 볼까요?", ph: "부피는 ~, 겉넓이는 ~",
          help: ["① 수조에 물을 담을 때를 떠올려요. → ② 수납장에 시트지를 붙일 때를 떠올려요.", "‘부피는 ~의 크기이고, 겉넓이는 ~의 넓이예요.’ 꼴로 써요."],
          ans: "부피는 물건이 공간에서 차지하는 크기이고, 겉넓이는 입체도형의 겉면의 넓이예요. 수조에 담기는 물의 양은 부피로, 수납장에 붙일 시트지의 양은 겉넓이로 알아봐요." }) },
    { name: "말해 보기 — 넓이를 떠올려요", inst: "태민: “겉넓이를 구하려면 넓이를 알아야겠네!” 5학년 1학기에 배운 직사각형의 넓이와 넓이의 단위를 떠올려 보세요.", hints: ["(직사각형의 넓이) = (가로) × (세로)", "1 m = 100 cm이니까 1 m²는 한 변이 100 cm인 정사각형의 넓이예요."],
      render: (b, a) => vo6Ask(b, a, [
        { q: "직사각형 모양 이름표의 넓이는 몇 cm²인가요?", fig: () => vo6Fig(260, 150, s => { s.append(svgEl("rect", { x: 40, y: 20, width: 180, height: 100, fill: "#FFE9C4", stroke: VO6.ink, "stroke-width": 2.5 })); s.append(txt(130, 136, "9 cm", 15, { fill: VO6.blue }), txt(238, 70, "6 cm", 15, { fill: VO6.blue })); }, "14em"),
          parts: [{ n: 54, why: { "15": "가로와 세로를 더했어요. 넓이는 (가로) × (세로)로 구해요.", "30": "30은 둘레예요. 넓이는 (가로) × (세로)로 구해요." } }, " cm²"] },
        { q: "1 m²는 몇 cm²인가요?", parts: ["1 m² = ", { n: 10000, why: { "100": "1 m = 100 cm예요. 1 m²는 한 변이 100 cm인 정사각형의 넓이니까 100 × 100을 해요.", "1000": "100 × 100을 다시 계산해 봐요." } }, " cm²"] },
        { q: "교실 게시판의 넓이는 3 m²예요. 몇 cm²인가요?", parts: ["3 m² = ", { n: 30000, why: { "300": "1 m²가 10000 cm²이니까 3 m²는 10000의 3배예요.", "3000": "1 m²가 10000 cm²이니까 3 m²는 10000의 3배예요." } }, " cm²"] }],
        { ok: "(직사각형의 넓이) = (가로) × (세로), 1 m² = 10000 cm²예요. 이 단원에서 넓이 단위와 부피 단위를 견주어 봐요." }) },
    { name: "약속하기 — 직육면체를 다시 살펴봐요", inst: "하린: “수납 상자를 펼치면 직육면체의 전개도가 되겠다!” 5학년 2학기에 배운 직육면체와 전개도를 떠올려 보세요.", hints: ["직육면체는 직사각형 모양의 면 6개로 둘러싸여 있어요.", "서로 마주 보는 두 면은 평행하고 모양과 크기가 같아요."],
      render: (b, a) => vo6Ask(b, a, [
        { q: "수납 상자와 그 전개도예요.", fig: () => h("div", { class: "vo6row" }, h("div", {}, vo6NetSvg([4, 3, 2], "cm", { maxW: "18em" })), h("div", { style: "flex:0 1 11em" }, vo6Cub([4, 3, 2], "cm", { maxW: "11em", W: 160 }))),
          parts: ["직육면체의 면은 모두 ", { n: 6 }, "개이고, 면의 모양은 모두 ", { o: ["직사각형", "삼각형", "원"], a: 0 }, "이에요. 서로 평행한 면은 ", { n: 3, why: { "6": "평행한 면은 두 면이 한 쌍이에요. 6개의 면이 몇 쌍인지 세어요." } }, "쌍이고, 평행한 두 면은 모양과 크기가 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
        { ok: "직육면체는 직사각형 6개로 둘러싸여 있고, 평행한 면 3쌍은 모양과 크기가 같아요. 이 성질이 겉넓이를 구할 때 도움이 돼요." }) },
    { name: "확인하기 — 새 단장 계획 세우기", inst: "새 단장 순서에 맞추어 이 단원에서 배울 내용을 살펴보고, 계획을 세워 보세요.", hints: ["부피를 비교하는 방법과 1 cm³를 먼저 배워요.", "겉넓이는 부피를 배운 뒤에 배워요."],
      render: (b, a) => vo6Chain(b, a, [
        { title: "배울 내용을 차례대로 눌러 보세요.", run: (bx, ax) => sequence(bx, ax, ["부피 비교하기와 1 cm³ 알아보기", "직육면체의 부피 구하기", "1 m³ 알아보기", "직육면체의 겉넓이 구하기"], [0, 1, 2, 3], { ok: "부피 비교와 1 cm³ → 직육면체의 부피 → 1 m³ → 직육면체의 겉넓이 차례로 배워요." }) },
        (bx, ax) => writeStep(bx, ax, [{ q: "교실에서 직육면체 모양의 물건을 찾아 써 보세요.", tag: "찾은 물건", ph: "예) 사물함, 필통, 휴지 상자",
            help: ["① 교실 앞·뒤·책상 위를 차례로 둘러봐요. → ② 면이 모두 직사각형인 물건을 골라요.", "‘교실에서 ~, ~, ~이 직육면체 모양이에요.’ 꼴로 써요."],
            ans: "교실에서 사물함, 필통, 휴지 상자, 분필 상자가 직육면체 모양이에요." },
          { q: "교실 새 단장을 하며 이 단원에서 알고 싶은 것을 써 보세요.", tag: "알고 싶은 것", ph: "예) 수조에 물이 얼마나 들어가는지 구하는 방법",
            help: ["① 새 단장을 할 때 궁금할 것 같은 일을 떠올려요. → ② 그것을 알려면 무엇을 배워야 할지 써요.", "‘~을 하려면 ~을 알아야 해서 ~을 배우고 싶어요.’ 꼴로 써요."],
            ans: "수납장에 시트지를 붙이려면 시트지가 얼마나 필요한지 알아야 해서 직육면체의 겉넓이를 구하는 방법을 배우고 싶어요." }])]) }
  ],
  challenge: { inst: "하린이가 수납 상자 두 개를 골랐어요. 상자 가는 가로 5 cm, 세로 4 cm, 높이 6 cm, 상자 나는 가로 5 cm, 세로 4 cm, 높이 3 cm예요(모형이라 작게 만들었어요). 어느 상자의 부피가 더 클까요?", hints: ["두 상자의 가로와 세로가 같아요.", "가로와 세로가 같으면 높이가 높은 상자가 더 많이 담을 수 있어요."],
    render: (b, a) => vo6Ask(b, a, [{ fig: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([5, 4, 6], "cm", { s: 20 }), "가"), vo6Fr(vo6Cub([5, 4, 3], "cm", { s: 20 }), "나")),
      parts: ["두 상자는 ", { o: ["가로와 세로", "세로와 높이", "가로와 높이"], a: 0 }, "가 같으니까 높이가 더 높은 상자 ", { o: ["가", "나"], a: 0 }, "의 부피가 더 커요. 상자 나를 ", { n: 2, why: { "3": "가의 높이 6 cm는 나의 높이 3 cm의 몇 배인지 생각해요." } }, "개 쌓으면 상자 가와 크기가 같아요."] }],
      { ok: "가로·세로가 같으면 높이로 부피를 견줄 수 있어요. 세 길이가 모두 다르면 어떻게 비교할까요? 다음 차시에 알아봐요." }) }
},
{
  id: "s2", no: 2, title: "어느 수납 상자에 더 많이 담길까요 ― 1 cm³", soop: "개념 구축하기(O)",
  question: "직육면체 모양 상자의 부피는 어떻게 비교할 수 있을까요? 부피의 단위는 무엇일까요?",
  summary: "면끼리 맞대어 비교하기 어려운 상자는 모양과 크기가 같은 물건으로 똑같이 쌓아 그 수를 세어 비교해요. 서로 다른 물건으로 세면 개수를 그대로 비교할 수 없고, 같은 상자도 물건에 따라 개수가 달라져요. 그래서 한 가지 단위를 써요. 한 모서리의 길이가 1 cm인 정육면체의 부피를 1 cm³라 쓰고, 1 세제곱센티미터라고 읽어요.",
  steps: [
    { name: "만져 보기 — 두 상자를 맞대어 보기", inst: "하린: “책꽂이 위에 둘 수납 상자를 골라야 해. 물건이 더 많이 들어가는 상자를 고르자!” 두 수납 상자 가와 나의 면끼리 여러 가지로 맞대어 보세요. (모형이라 길이는 쌓기나무 개수로 나타냈어요.)", hints: ["가의 면과 나의 면을 하나씩 골라 맞대 보세요. ‘나를 돌려서 대기’도 눌러 보세요.", "어떤 길이는 가가 더 길고, 어떤 길이는 나가 더 긴지 살펴봐요."],
      render: (b, a) => vo6Touch(b, a, { A: VO6S.boxA, B: VO6S.boxB, need: 4, wA: "7.8em", wB: "4.6em", nA: "수납 상자 가", nB: "수납 상자 나", ask: [
        { q: "두 상자를 맞대어 보니 어떤가요?", parts: ["어떤 길이는 가가 더 길고 어떤 길이는 나가 더 길어서, 면끼리 맞대어도 부피를 비교하기 ", { o: ["어려워요", "쉬워요"], a: 0, why: { "1": "가의 가장 긴 길이는 나보다 길지만, 나에도 가보다 긴 길이가 있어요. 맞대기만 해서는 어느 쪽이 큰지 알기 어려워요." } }, "."] },
        { q: "맞대어 비교하기 어려운 상자의 부피는 어떻게 비교하면 좋을까요?", parts: [{ o: ["모양과 크기가 같은 물건으로 상자와 똑같이 쌓아 그 수를 세어 비교해요.", "상자의 색깔을 비교해요.", "상자 한 면의 넓이만 비교해요."], a: 0, why: { "2": "한 면의 넓이가 넓어도 높이가 낮으면 부피가 작을 수 있어요." } }] }],
        ok: "맞대기만 해서는 비교하기 어려워요. 모양과 크기가 같은 물건을 쌓아 그 수를 세어 봐요." }) },
    { name: "그려 보기 — 물건을 쌓아 세어 보기", inst: "하린이와 태민이가 두 상자 가와 나의 부피와 똑같이 물건을 쌓아 보기로 했어요. 상자 안을 빈틈없이 채우며 따라 해 보세요.", hints: ["‘한 줄 채우기’, ‘한 층 채우기’로 빨리 채울 수 있어요.", "하린이는 가를 지우개로, 나를 쌓기나무로 채웠어요."],
      render: (b, a) => vo6Chain(b, a, [
        { title: "① 하린: “가는 지우개로 채워 볼게.”", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6S.boxA, unit: VO6S.eraser, name: "지우개", col: VO6.er, ask: [{ parts: ["가는 지우개 ", { n: 6 }, "개예요."] }] }) },
        { title: "② 하린: “나는 쌓기나무로 채워 볼게.”", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6S.boxB, name: "쌓기나무", W: 150, maxW: "11em", ask: [{ parts: ["나는 쌓기나무 ", { n: 32 }, "개예요."] }] }) },
        { title: "③ 태민: “나는 가와 나 모두 쌓기나무로 채울래.” 가를 쌓기나무로 채워 보세요.", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6S.boxA, name: "쌓기나무",
          ask: [{ parts: ["가는 쌓기나무 ", { n: 36 }, "개, 나는 쌓기나무 ", { n: 32, why: { "6": "6은 하린이가 가를 지우개로 센 수예요. 나는 ②에서 쌓기나무로 세었어요." } }, "개예요."] }],
          ok: "하린: 가 = 지우개 6개, 나 = 쌓기나무 32개 / 태민: 가 = 쌓기나무 36개, 나 = 쌓기나무 32개예요." }) }]) },
    { name: "말해 보기 — 누구의 방법으로 비교할 수 있을까요", inst: "하린: “가는 6개, 나는 32개니까 나가 훨씬 크네!” 태민: “잠깐, 내가 센 것과 다른데?” 두 친구의 방법을 견주어 보세요.", hints: ["하린이는 서로 다른 물건(지우개, 쌓기나무)으로 셌어요.", "모양과 크기가 같은 물건으로 세어야 그 수로 비교할 수 있어요."],
      render: thenWhy((b, a) => vo6Ask(b, a, [
        { q: "부피를 비교할 수 있는 방법으로 센 사람은 누구인가요?", parts: [{ o: ["하린", "태민"], a: 1, why: { "0": "하린이는 지우개와 쌓기나무처럼 서로 다른 물건으로 세어서, 6개와 32개를 그대로 비교할 수 없어요." } }, " ― 모양과 크기가 ", { o: ["같은", "다른"], a: 0 }, " 물건으로 세었기 때문이에요."] },
        { q: "태민이의 방법으로 부피를 비교해 보세요.", parts: ["36 ", { o: [">", "=", "<"], a: 0 }, " 32이므로 ", { o: ["가", "나"], a: 0, why: { "1": "가는 쌓기나무 36개, 나는 32개예요. 같은 물건으로 센 개수가 많은 쪽이 부피가 더 커요." } }, "의 부피가 더 커요."] },
        { q: "여러 가지 물건으로 부피를 나타낼 때 불편한 점과 해결 방법은 무엇일까요?", parts: ["같은 상자여도 사용하는 물건에 따라 부피를 나타내는 개수가 ", { o: ["달라져요", "같아요"], a: 0 }, ". 그래서 ", { o: ["한 가지 단위", "여러 가지 물건"], a: 0 }, "를 사용하여 부피를 나타내요."] }],
        { ok: "모양과 크기가 같은 물건으로 세어야 비교할 수 있어요. 가가 나보다 쌓기나무 4개만큼 더 커요." }),
        { q: "하린이처럼 6개와 32개를 견주면 왜 안 되는지 써 볼까요?", ph: "지우개와 쌓기나무는 ~",
          help: ["① 지우개 한 개와 쌓기나무 한 개의 크기를 견주어요. → ② 그래서 개수만 보고 비교하면 어떻게 되는지 써요.", "‘~와 ~은 크기가 달라서 ~’ 꼴로 써요."],
          ans: "지우개 한 개와 쌓기나무 한 개는 크기가 달라서 개수만 보고 부피를 비교할 수 없어요. 같은 쌓기나무로 세면 가가 36개, 나가 32개라 가의 부피가 더 커요." }) },
    { name: "약속하기 — 1 cm³", inst: "담임 선생님: “누구나 같은 단위로 부피를 나타내면 편리하겠지?” 부피의 단위를 약속해 보세요.", hints: ["넓이의 단위 1 cm²는 한 변의 길이가 1 cm인 정사각형의 넓이였어요.", "부피의 단위는 한 모서리의 길이가 1 cm인 정육면체의 부피예요."],
      render: (b, a) => { b.append(h("div", { class: "vo6figs" }, vo6Fr(vo6Solid({ d: [1, 1, 1], s: 80, labels: { a: "1 cm", b: "1 cm", c: "1 cm" }, maxW: "11em", tint: { top: VO6.cube[0], front: VO6.cube[1], right: VO6.cube[2] } }), "1 cm³")));
        blanks(b, a, ["부피의 단위로 한 모서리의 길이가 ", { o: ["1 cm", "1 m", "10 cm"], a: 0 }, "인 ", { o: ["정육면체", "정사각형", "직사각형"], a: 0 }, "의 부피를 사용할 수 있어요. 한 모서리의 길이가 1 cm인 정육면체의 부피를 ", { o: ["1 cm³", "1 cm²", "1 cm"], a: 0 }, "라 쓰고, ", { o: ["1 세제곱센티미터", "1 제곱센티미터", "1 센티미터"], a: 0 }, "라고 읽어요."],
          { ok: "한 모서리의 길이가 1 cm인 정육면체의 부피를 1 cm³라 쓰고, 1 세제곱센티미터라고 읽어요. 태민이가 쓴 쌓기나무 한 개의 부피가 1 cm³라면 상자 가는 36 cm³예요." }); } },
    { name: "확인하기 — 1 cm³만 한 물건 찾기", inst: "준혁: “수족관 바닥에 까는 작은 돌 하나도 1 cm³쯤 되려나?” 우리 주변에서 부피가 1 cm³와 비슷한 물건을 찾아보세요.", hints: ["1 cm³는 한 모서리가 1 cm인 아주 작은 정육면체예요.", "손가락 끝마디 정도의 크기를 떠올려요."],
      render: (b, a) => quiz(b, a, [
        { q: "부피가 1 cm³와 비슷한 물건을 모두 골라 보세요.", o: ["보드게임의 작은 주사위", "공깃돌", "캐러멜 한 개", "수조", "사물함", "필통"], a: [0, 1, 2], why: { "0,1,3": "수조는 1 cm³보다 훨씬 커요.", "0,2,3": "수조는 1 cm³보다 훨씬 커요.", "1,2,3": "수조는 1 cm³보다 훨씬 커요.", "0,1,4": "사물함은 1 cm³보다 훨씬 커요.", "0,2,4": "사물함은 1 cm³보다 훨씬 커요.", "1,2,4": "사물함은 1 cm³보다 훨씬 커요.", "0,1,5": "필통은 1 cm³보다 훨씬 커요.", "0,2,5": "필통은 1 cm³보다 훨씬 커요.", "1,2,5": "필통은 1 cm³보다 훨씬 커요." } },
        { q: "두 정리 상자에 같은 정육면체 주사위를 빈틈없이 넣었더니 가에는 45개, 나에는 40개가 들어갔어요. 부피가 더 큰 상자는 어느 것인가요?", o: ["가", "나"], a: 0, why: { "1": "같은 주사위로 세었으니 개수가 많은 쪽이 부피가 더 커요. 45 > 40이에요." } }],
        { ok: "작은 주사위, 공깃돌, 캐러멜 한 개의 부피는 약 1 cm³예요. 같은 물건으로 세면 개수가 많은 쪽이 부피가 더 커요." }) }
  ],
  challenge: { inst: "크기가 같은 쌓기나무로 직육면체 가, 나, 다를 만들었어요. 부피가 같은 두 개를 찾고, 서아와 준혁이의 말도 살펴보세요.", hints: ["같은 쌓기나무로 쌓았으니 쌓기나무의 개수를 세어 비교해요.", "블록과 주사위는 모양과 크기가 같은 물건일까요?"],
    render: (b, a) => { const F = { 가: [3, 2, 3], 나: [4, 2, 2], 다: [2, 3, 3] };
      vo6Chain(b, a, [
        (bx, ax) => vo6Ask(bx, ax, [{ fig: () => h("div", { class: "vo6figs" }, ...Object.keys(F).map(k => vo6sStackFig(F[k], k, [4, 3, 3]))),
          parts: ["쌓기나무는 가 ", { n: vo6Vol(F.가) }, "개, 나 ", { n: vo6Vol(F.나) }, "개, 다 ", { n: vo6Vol(F.다) }, "개예요. 부피가 같은 두 개는 ", { o: ["가, 나", "가, 다", "나, 다"], a: 1 }, "예요."] }],
          { ok: "가와 다는 모양은 달라도 쌓기나무가 18개씩이라 부피가 같아요." }),
        (bx, ax) => { bx.append(h("div", { class: "vo6box" }, "서아: “크기가 같은 직육면체 모양의 블록 12개를 쌓아 만들었어.” 준혁: “크기가 같은 정육면체 모양의 주사위 15개를 쌓아 만들었어.”"));
          vo6Ask(bx, ax, [{ q: "준혁이가 만든 것의 부피가 더 크다고 말할 수 있나요?", parts: [{ o: ["말할 수 있어요. 15 > 12이니까요.", "말할 수 없어요. 블록과 주사위의 모양과 크기가 다를 수 있어서 개수로 부피를 비교할 수 없어요."], a: 1, why: { "0": "블록 한 개와 주사위 한 개의 크기가 같은지 알 수 없어요. 서로 다른 물건의 개수는 그대로 비교할 수 없어요." } }] }],
            { ok: "모양과 크기가 다를 수 있는 물건의 개수로는 부피를 비교할 수 없어요. 그래서 1 cm³ 같은 한 가지 단위를 써요." }); }]); } }
},
{
  id: "s34", no: "3~4", title: "수조 받침 상자의 부피를 구해요 ― 직육면체의 부피", soop: "개념 구축하기(O)",
  question: "직육면체의 부피를 쌓기나무를 하나하나 세지 않고 구할 수 있을까요?",
  summary: "직육면체의 부피는 부피가 1 cm³인 쌓기나무가 몇 개 들어가는지로 구해요. 한 층의 쌓기나무 수는 (가로) × (세로)이고, 층수는 높이와 같아요. 가로(세로, 높이)가 2배, 3배가 되면 부피도 2배, 3배가 돼요. (직육면체의 부피) = (가로) × (세로) × (높이) = (한 밑면의 넓이) × (높이)이고, (정육면체의 부피) = (한 모서리의 길이) × (한 모서리의 길이) × (한 모서리의 길이)예요.",
  steps: [
    { name: "만져 보기 — 받침 상자에 쌓기나무 채우기", inst: "준혁: “수조를 올려놓을 받침 상자를 만들 거야. 두 받침 상자 모형의 부피를 알아보자!” 부피가 1 cm³인 쌓기나무로 두 상자를 빈틈없이 채워 보세요.", hints: ["‘한 층 채우기’를 누르면 한 층에 몇 개씩인지 알 수 있어요.", "한 층의 수를 센 다음 몇 층인지 세면 빨리 셀 수 있어요."],
      render: (b, a) => vo6Chain(b, a, [
        { title: "① 받침 상자 가", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6S.f1, ask: [{ parts: ["한 층에 ", { n: 15 }, "개씩 ", { n: 2 }, "층이니까 쌓기나무는 ", { n: 30 }, "개, 부피는 ", { n: 30 }, " cm³예요."] }] }) },
        { title: "② 받침 상자 나", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6S.f2, ask: [{ parts: ["한 층에 ", { n: 16 }, "개씩 ", { n: 3 }, "층이니까 쌓기나무는 ", { n: 48, why: { "19": "한 층의 수와 층수를 더했어요. 16개씩 3층이니까 곱해요." } }, "개, 부피는 ", { n: 48 }, " cm³예요."] },
          { q: "쌓기나무를 어떻게 세었나요?", parts: [{ o: ["한 층의 수를 세고, 몇 층인지 세었어요.", "색깔별로 세었어요."], a: 0 }] }],
          ok: "한 층의 쌓기나무 수와 층수로 셀 수 있어요. 한 층의 수는 가로와 세로에, 층수는 높이에 따라 달라져요." }) }]) },
    { name: "그려 보기 — 늘리면 부피는 어떻게 될까요", inst: "태민: “받침 상자를 더 길게 만들면 부피는 얼마나 커질까?” 쌓기나무로 가로, 세로, 높이를 늘려 보며 부피의 변화를 살펴보세요.", hints: ["＋ 단추를 누르면 그 방향으로 한 줄씩 늘어나요.", "쌓기나무 수가 처음의 몇 배가 되는지 살펴봐요."],
      render: ruleFirst((b, a) => vo6Chain(b, a, [
        { title: "① 2 cm³ 직육면체의 가로를 2배, 3배로 늘려 보세요.", run: (bx, ax) => vo6Dims(bx, ax, { start: [1, 2, 1], max: [3, 3, 3], lock: [false, true, true], ready: d => d[0] === 3, check: () => null, msg: "가로를 3배까지 늘렸어요.",
          ask: [{ parts: ["가로가 2배이면 ", { n: 4 }, " cm³, 3배이면 ", { n: 6 }, " cm³ ― 부피도 2배, 3배가 돼요."] }] }) },
        { title: "② 3 cm³ 직육면체의 세로를 2배, 3배로 늘려 보세요.", run: (bx, ax) => vo6Dims(bx, ax, { start: [3, 1, 1], max: [3, 3, 3], lock: [true, false, true], ready: d => d[1] === 3, check: () => null, msg: "세로를 3배까지 늘렸어요.",
          ask: [{ parts: ["세로가 2배이면 ", { n: 6 }, " cm³, 3배이면 ", { n: 9 }, " cm³ ― 부피도 2배, 3배가 돼요."] }] }) },
        { title: "③ 4 cm³ 직육면체의 높이를 2배, 3배로 늘려 보세요.", run: (bx, ax) => vo6Dims(bx, ax, { start: [2, 2, 1], max: [3, 3, 3], lock: [true, true, false], ready: d => d[2] === 3, check: () => null, msg: "높이를 3배까지 늘렸어요.",
          ask: [{ parts: ["높이가 2배이면 ", { n: 8 }, " cm³, 3배이면 ", { n: 12 }, " cm³ ― 부피도 2배, 3배가 돼요."] }] }) },
        { title: "④ 2 cm³ 직육면체(가로 2, 세로 1, 높이 1)의 가로, 세로, 높이를 각각 2배로 늘려 보세요.", run: (bx, ax) => vo6Dims(bx, ax, { start: [2, 1, 1], max: [4, 3, 3], ready: d => vo6Vol(d) >= 16,
          check: d => d.join() === "4,2,2" ? null : `가로 4, 세로 2, 높이 2가 되게 만들어 보세요. 지금은 가로 ${d[0]}, 세로 ${d[1]}, 높이 ${d[2]}예요.`, msg: "가로, 세로, 높이를 모두 2배로 늘렸어요.",
          ask: [{ parts: ["쌓기나무는 ", { n: 16 }, "개, 부피는 ", { n: 16 }, " cm³로, 처음 부피 2 cm³의 ", { n: 8, why: { "2": "가로, 세로, 높이가 모두 2배가 되었어요. 2 × 2 × 2를 생각해 봐요.", "6": "2배를 세 번 했으니 2 + 2 + 2가 아니라 2 × 2 × 2예요.", "4": "가로, 세로, 높이 세 방향이 모두 2배예요. 2 × 2 × 2를 생각해 봐요." } }, "배가 되었어요."] }],
          ok: "가로, 세로, 높이가 각각 2배가 되면 부피는 2 × 2 × 2 = 8(배)가 돼요." }) }]),
        { q: "직육면체의 가로를 2배, 3배로 늘리면 부피는 어떻게 될지, 세 길이를 모두 2배로 늘리면 어떻게 될지 예상해 써요.", ph: "내 예상: 가로를 2배로 하면 부피는 ~",
          help: ["① 가로를 2배로 늘리면 같은 모양이 옆에 하나 더 붙는다고 생각해요. → ② 세로와 높이도 늘리면 어떻게 될지 떠올려요.", "‘가로가 2배이면 부피는 ~, 세 길이가 모두 2배이면 부피는 ~일 것 같아요.’ 꼴로 써요."],
          ans: "가로(세로, 높이)가 2배, 3배가 되면 부피도 2배, 3배가 돼요. 세 길이를 모두 2배로 늘리면 부피는 2 × 2 × 2 = 8(배)가 돼요." }) },
    { name: "말해 보기 — 곱셈으로 부피 구하기", inst: "준혁이가 정한 받침 상자는 가로 7 cm, 세로 3 cm, 높이 4 cm인 직육면체예요. 쌓기나무로 똑같이 쌓고, 하나하나 세지 않고 부피를 구하는 방법을 찾아보세요.", hints: ["가로 방향에 7개, 세로 방향에 3개, 높이 방향에 4개를 쌓아요.", "한 층에 7 × 3 = 21(개)씩 4층이에요."],
      words: ["가로", "세로", "높이", "한 밑면의 넓이"],
      render: thenWhy((b, a) => vo6Dims(b, a, { start: [1, 1, 1], max: [9, 6, 6], show: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub(VO6S.build, "cm", { s: 20 }), "준혁이의 받침 상자")), ready: d => vo6Vol(d) >= 84 || (d[0] >= 7 && d[1] >= 3 && d[2] >= 4),
        check: d => d.join() === "7,3,4" ? null : `가로 7개, 세로 3개, 높이 4개가 되게 쌓아요. 지금은 가로 ${d[0]}개, 세로 ${d[1]}개, 높이 ${d[2]}개예요.`, hideCount: true, msg: "가로 7 cm, 세로 3 cm, 높이 4 cm인 직육면체를 쌓았어요.",
        then: (bx, ax) => vo6Chain(bx, ax, [
          (cx, cy) => vo6Ask(cx, cy, [{ parts: ["가로, 세로, 높이 방향의 쌓기나무는 ", { n: 7 }, "개, ", { n: 3 }, "개, ", { n: 4 }, "개예요. 필요한 쌓기나무는 7 × 3 × 4 = ", { n: 84, why: { "14": "7 + 3 + 4는 더한 것이에요. 곱해야 쌓기나무 수가 나와요.", "21": "21개는 한 층의 수예요. 4층이니까 4를 곱해요." } }, "(개)이므로 부피는 ", { n: 84 }, " cm³예요."] }]),
          (cx, cy) => blanks(cx, cy, ["(직육면체의 부피) = (", { o: ["가로", "둘레"], a: 0 }, ") × (", { o: ["세로", "넓이"], a: 0 }, ") × (", { o: ["높이", "둘레"], a: 0 }, ") = (한 밑면의 넓이) × (", { o: ["높이", "가로"], a: 0 }, ")"],
            { ok: "(직육면체의 부피) = (가로) × (세로) × (높이) = (한 밑면의 넓이) × (높이)예요. 가로·세로·높이는 보는 방향에 따라 다르게 정해도 돼요." })]) }),
        { q: "쌓기나무를 하나하나 세지 않고 (가로) × (세로) × (높이)로 부피를 구할 수 있는 까닭을 써 볼까요?", ph: "(가로) × (세로)는 ~이고, 높이는 ~",
          help: ["① (가로) × (세로)가 무엇의 수인지 떠올려요. → ② 높이가 무엇의 수와 같은지 떠올려요.", "‘(가로) × (세로)는 ~이고, 높이는 ~이라서 ~’ 꼴로 써요."],
          ans: "(가로) × (세로)는 한 층에 놓인 쌓기나무 수이고, 높이는 층수와 같아요. 그래서 (가로) × (세로) × (높이)는 쌓기나무 전체의 수, 곧 부피가 돼요." }) },
    { name: "약속하기 — 정육면체의 부피", inst: "하린: “물풀 영양제는 한 모서리의 길이가 4 cm인 정육면체 모양 통에 담을 거야.” 정육면체의 부피를 구하는 방법을 알아보세요. 쌓기나무로 똑같이 쌓아 보세요.", hints: ["정육면체는 정사각형 6개로 둘러싸인 입체도형이에요.", "정육면체는 모든 모서리의 길이가 같아요."],
      render: (b, a) => vo6Dims(b, a, { start: [1, 1, 1], max: [6, 6, 6], show: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub(VO6S.cube, "cm", { s: 20 }), "한 모서리 4 cm")), ready: d => vo6Vol(d) >= 64 || (d[0] >= 4 && d[1] >= 4 && d[2] >= 4),
        check: d => d.join() === "4,4,4" ? null : "정육면체는 가로, 세로, 높이가 모두 같아요. 모두 4개가 되게 쌓아요.", hideCount: true, msg: "한 모서리가 4 cm인 정육면체를 쌓았어요.",
        then: (bx, ax) => vo6Chain(bx, ax, [
          (cx, cy) => vo6Ask(cx, cy, [{ parts: ["정육면체의 가로, 세로, 높이는 모두 ", { n: 4 }, " cm예요. 부피는 4 × 4 × 4 = ", { n: 64, why: { "12": "4 + 4 + 4는 더한 것이에요. 4를 세 번 곱해요.", "16": "16은 한 면의 넓이예요. 4를 한 번 더 곱해요." } }, "(cm³)예요."] }]),
          (cx, cy) => blanks(cx, cy, ["(정육면체의 부피) = (", { o: ["한 모서리의 길이", "한 면의 넓이"], a: 0 }, ") × (한 모서리의 길이) × (", { o: ["한 모서리의 길이", "6"], a: 0 }, ")"],
            { ok: "(정육면체의 부피) = (한 모서리의 길이) × (한 모서리의 길이) × (한 모서리의 길이)예요. 정육면체는 모든 모서리의 길이가 같기 때문이에요." })]) }) },
    { name: "확인하기 — 우리 반 물건의 부피", inst: "새 단장에 쓸 물건의 부피를 구해 보세요.", hints: ["(가로) × (세로) × (높이)로 구해요.", "한 밑면의 넓이가 주어지면 (한 밑면의 넓이) × (높이)로 구해요."],
      render: (b, a) => vo6Ask(b, a, [
        { q: "수조 받침 상자", fig: () => vo6Cub([12, 5, 6], "cm", { s: 12 }), parts: ["12 × 5 × 6 = ", { n: 360, why: { "23": "더하지 말고 곱해요.", "60": "60은 한 밑면의 넓이예요. 높이 6을 곱해요." } }, " (cm³)"] },
        { q: "정육면체 모양 블록 보관함", fig: () => vo6Cub([9, 9, 9], "cm", { s: 10 }), parts: ["9 × 9 × 9 = ", { n: 729, why: { "27": "더하지 말고 곱해요.", "81": "81은 한 면의 넓이예요. 9를 한 번 더 곱해요." } }, " (cm³)"] },
        { q: "한 밑면의 넓이가 48 cm²이고 높이가 8 cm인 색연필 상자", parts: ["48 × 8 = ", { n: 384, why: { "56": "더하지 말고 곱해요." } }, " (cm³)"] }],
        { ok: "360 cm³, 729 cm³, 384 cm³예요. 한 밑면의 넓이에 높이를 곱해도 부피를 구할 수 있어요." }) },
    { name: "확인하기 — 문제 만들고 바꾸어 풀기", inst: "교실에서 직육면체 모양의 물건을 찾아 부피를 구하는 문제를 만들고, 짝과 바꾸어 풀어 보세요. 하린이는 휴지 상자로 문제를 만들었어요.", hints: ["부피를 구하려면 가로, 세로, 높이를 알아야 해요.", "같은 물건인데 친구와 결과가 다르면 잰 길이가 달랐는지, 어디를 가로로 정했는지 살펴봐요."],
      render: (b, a) => vo6Make(b, a, { kind: "vol", objs: ["필통", "휴지 상자", "지우개", "수납 상자", "색연필 상자", "분필 상자"], friend: { who: "하린", obj: "휴지 상자", d: [24, 12, 9], a: 2592, q: "가로가 24 cm, 세로가 12 cm, 높이가 9 cm인 직육면체 모양의 휴지 상자가 있습니다. 이 휴지 상자의 부피는 몇 cm³인가요?", why: { "45": "더하지 말고 곱해요.", "288": "288은 한 밑면의 넓이예요. 높이 9를 곱해요." } },
        ok: "휴지 상자의 부피는 24 × 12 × 9 = 2592(cm³)예요. 교실 물건으로도 부피를 구할 수 있어요." }) }
  ],
  challenge: { inst: "수조와 상자의 부피 문제를 풀어 보세요.", hints: ["(높이) = (부피) ÷ (한 밑면의 넓이)예요.", "가로, 세로, 높이가 모두 2배가 되면 부피는 8배가 돼요."],
    render: (b, a) => vo6Chain(b, a, [
      (bx, ax) => vo6Ask(bx, ax, [{ q: "가로가 30 cm, 세로가 20 cm인 직육면체 모양 수조의 부피가 12000 cm³예요. 수조의 높이는 몇 cm인가요?", parts: ["높이 = 12000 ÷ (30 × 20) = ", { n: 20, why: { "400": "12000 ÷ 30만 했어요. 한 밑면의 넓이 30 × 20 = 600으로 나누어요.", "600": "600은 한 밑면의 넓이예요. 12000을 600으로 나누어요." } }, " (cm)"] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "부피가 큰 것부터 차례로 기호를 골라 보세요. ㉠ 가로 8 cm, 세로 5 cm, 높이 7 cm인 직육면체 ㉡ 한 모서리의 길이가 7 cm인 정육면체 ㉢ 한 밑면의 넓이가 60 cm²이고 높이가 5 cm인 직육면체",
        parts: ["㉠ ", { n: 280 }, " cm³, ㉡ ", { n: 343 }, " cm³, ㉢ ", { n: 300 }, " cm³ → ", { o: ["㉡, ㉢, ㉠", "㉠, ㉡, ㉢", "㉢, ㉡, ㉠"], a: 0 }] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "가로 4 cm, 세로 3 cm, 높이 5 cm인 직육면체의 가로, 세로, 높이를 각각 2배로 늘인 직육면체의 부피는 몇 cm³인가요?", fig: () => vo6Cub([4, 3, 5], "cm", { s: 16 }),
        parts: ["8 × 6 × 10 = ", { n: 480, why: { "120": "120은 처음 부피를 2배 한 것이에요. 세 길이가 모두 2배이면 8배가 돼요.", "60": "60은 처음 부피예요. 늘인 길이 8, 6, 10을 곱해요." } }, " (cm³)"] }], { ok: "처음 부피 60 cm³의 8배인 480 cm³예요." })]) }
},
{
  id: "s56", no: "5~6", title: "큰 수납장과 교실의 부피 ― 1 m³", soop: "개념 구축하기(O)",
  question: "큰 수납장이나 교실의 부피는 어떤 단위로 나타내면 좋을까요? 1 cm³와 1 m³는 어떤 관계일까요?",
  summary: "큰 부피를 cm³로 나타내면 수가 너무 커서 불편해요. 한 모서리의 길이가 1 m인 정육면체의 부피를 1 m³라 쓰고, 1 세제곱미터라고 읽어요. 1 m = 100 cm이므로 1 m³ 안에는 1 cm³ 쌓기나무가 100 × 100 × 100 = 1000000(개) 들어가요. 1 m³ = 1000000 cm³예요. 부피를 m³로 구할 때는 cm³로 구한 뒤 1000000으로 나누거나, 길이를 m로 바꾸어 곱해요.",
  steps: [
    { name: "만져 보기 — 큰 수납장의 부피", inst: "서아: “교실 뒤에 들일 붙박이 수납장은 가로 300 cm, 세로 100 cm, 높이 200 cm래. 이렇게 큰 수납장의 부피는 얼마나 될까?” 수납장의 부피를 cm³로 구해 보세요.", hints: ["(가로) × (세로) × (높이)로 구해요. 계산기를 써도 돼요.", "300 × 100 = 30000, 30000 × 200을 계산해요."],
      render: (b, a) => vo6Ask(b, a, [
        { fig: () => vo6Cub([300, 100, 200], "cm", { W: 220, maxW: "15em" }), parts: ["300 × 100 × 200 = ", { n: 6000000, w: "8em", why: { "600": "더하지 말고 곱해요.", "30000": "30000은 한 밑면의 넓이예요. 높이 200을 곱해요.", "600000": "0의 개수를 다시 세어 봐요. 30000 × 200 = 6000000이에요." } }, " (cm³)"] },
        { q: "cm³로 나타내면 어떤 점이 불편한가요?", parts: [{ o: ["수가 너무 커서 읽기 어렵고 나타내기 불편해요.", "수가 너무 작아서 알아보기 어려워요.", "불편한 점이 없어요."], a: 0 }] },
        { q: "더 큰 부피의 단위는 어떻게 정하면 좋을까요?", parts: ["길이 cm → m, 넓이 cm² → m²처럼, 부피도 한 모서리의 길이가 ", { o: ["1 m", "1 mm"], a: 0, why: { "1": "1 mm는 1 cm보다 작아요. 큰 부피를 나타낼 더 큰 단위가 필요해요." } }, "인 정육면체의 부피를 단위로 쓰면 좋아요."] }],
        { ok: "수납장의 부피는 6000000 cm³예요. 수가 너무 커서 더 큰 단위가 필요해요." }) },
    { name: "그려 보기 — 1 m 정육면체로 교실 채우기", inst: "모둠마다 신문지를 말아 만든 1 m 막대로 한 모서리가 1 m인 정육면체 틀을 만들었어요. 태민: “이 틀로 우리 교실을 채우면 몇 개나 들어갈까?” 우리 교실(가로 8 m, 세로 6 m, 높이 3 m)에 정육면체 틀을 쌓아 보세요.", hints: ["정육면체의 모서리 수를 떠올려요.", "교실 바닥에 한 층을 깔고 몇 층까지 쌓을 수 있는지 생각해요."],
      render: (b, a) => vo6Chain(b, a, [
        (bx, ax) => vo6Ask(bx, ax, [{ q: "한 모서리가 1 m인 정육면체 틀을 만들려면 1 m 막대가 몇 개 필요할까요?", fig: () => vo6Solid({ d: [1, 1, 1], mode: "box", s: 80, labels: { a: "1 m", b: "1 m", c: "1 m" }, maxW: "10em", plain: true }),
          parts: [{ n: 12, why: { "6": "6은 정육면체의 면의 수예요. 틀은 모서리로 만들어요.", "8": "8은 정육면체의 꼭짓점의 수예요. 틀은 모서리로 만들어요." } }, "개"] }], { ok: "정육면체의 모서리는 12개라서 1 m 막대 12개가 필요해요." }),
        (bx, ax) => vo6Dims(bx, ax, { start: [1, 1, 1], max: VO6S.room, room: VO6S.room, roomLabels: { a: "8 m", b: "6 m", c: "3 m" }, ready: d => vo6Vol(d) >= 144,
          countText: d => `한 모서리 1 m인 정육면체 ${vo6Vol(d)}개`, tip: "＋, － 단추로 교실 안에 정육면체 틀을 가득 쌓아 보세요. 다 쌓고 잠시 기다리면 저절로 확인해요.",
          check: d => d.join() === "8,6,3" ? null : `교실을 가득 채워 보세요(가로 8개, 세로 6개, 높이 3개). 지금은 가로 ${d[0]}개, 세로 ${d[1]}개, 높이 ${d[2]}개예요.`, msg: "교실을 정육면체 틀로 가득 채웠어요.",
          ask: [{ parts: ["한 층에 ", { n: 48 }, "개씩 ", { n: 3 }, "층이니까, 우리 교실에는 한 모서리가 1 m인 정육면체가 ", { n: 144, why: { "17": "8 + 6 + 3은 더한 것이에요. 8 × 6 × 3을 계산해요.", "48": "48개는 한 층의 수예요. 3층이니까 3을 곱해요." } }, "개쯤 들어가요."] }],
          ok: "우리 교실에는 한 모서리가 1 m인 정육면체가 8 × 6 × 3 = 144(개)쯤 들어가요. 교실마다 크기가 달라 어림한 값도 달라요." })]) },
    { name: "말해 보기 — 1 m 정육면체 안의 1 cm³", inst: "준혁: “1 m 정육면체 하나를 1 cm³ 쌓기나무로 채우면 몇 개나 들어갈까?” 먼저 예상해 보고, 쌓기나무를 채워 보세요. “1 m는 100 cm야.”", hints: ["1 m = 100 cm이니까 한 모서리에 쌓기나무를 100개 놓을 수 있어요.", "한 층에 100 × 100개, 그런 층이 100층이에요."],
      words: ["1 m = 100 cm", "100 × 100 × 100", "1000000"],
      render: ruleFirst((b, a) => vo6M3(b, a, { ask: [
        { parts: ["한 모서리에 쌓을 수 있는 쌓기나무는 ", { n: 100, why: { "10": "1 m = 100 cm예요. 1 cm 쌓기나무가 100개 놓여요." } }, "개예요."] },
        { parts: ["한 층에는 100 × 100 = ", { n: 10000 }, "(개)예요."] },
        { parts: ["모두 100 × 100 × 100 = ", { n: 1000000, w: "8em", why: { "10000": "10000개는 한 층의 수예요. 100층이니까 100을 한 번 더 곱해요.", "300": "100 + 100 + 100이 아니라 100 × 100 × 100이에요.", "100": "가로·세로·높이 방향으로 모두 100개씩이에요.", "100000": "0의 개수를 다시 세어 봐요. 10000 × 100 = 1000000이에요." } }, "(개)가 들어가요."] }],
        ok: "1 m 정육면체 안에는 1 cm³ 쌓기나무가 1000000개 들어가요." }),
        { q: "한 모서리가 1 m인 정육면체 안에 1 cm³ 쌓기나무가 몇 개 들어갈지 예상해 써요.", ph: "내 예상: ~개쯤 들어갈 것 같아요. 왜냐하면 ~",
          help: ["① 1 m가 몇 cm인지 떠올려요. → ② 가로·세로·높이 방향에 쌓기나무가 몇 개씩 놓일지 생각해요.", "‘한 모서리에 ~개씩 놓이니까 ~ × ~ × ~ = ~개쯤 들어갈 것 같아요.’ 꼴로 써요."],
          ans: "1 m = 100 cm라서 가로, 세로, 높이 방향에 쌓기나무가 100개씩 놓여요. 그래서 100 × 100 × 100 = 1000000(개)가 들어가요. 100개나 10000개가 아니에요." }) },
    { name: "약속하기 — 1 m³와 1 cm³의 관계", inst: "담임 선생님: “한 모서리가 1 m인 정육면체의 부피를 새 단위로 약속하자.” 1 m³를 약속하고, 1 cm³와의 관계를 정리해 보세요.", hints: ["1 cm³는 한 모서리의 길이가 1 cm인 정육면체의 부피였어요.", "1 m³ 안에 1 cm³ 쌓기나무가 1000000개 들어가요."],
      render: (b, a) => { b.append(h("div", { class: "vo6figs" }, vo6Fr(vo6Solid({ d: [1, 1, 1], s: 80, labels: { a: "1 m", b: "1 m", c: "1 m" }, maxW: "11em", tint: { top: "#CFE5FA", front: "#8DBDEB", right: "#5C97D0" } }), "1 m³")));
        blanks(b, a, ["한 모서리의 길이가 1 m인 정육면체의 부피를 ", { o: ["1 m³", "1 m²", "1 cm³"], a: 0 }, "라 쓰고, ", { o: ["1 세제곱미터", "1 제곱미터", "1 세제곱센티미터"], a: 0 }, "라고 읽어요. 1 m³ = ", { o: ["1000000", "10000", "100"], a: 0 }, " cm³예요. 그래서 우리 교실의 부피는 약 ", { o: ["144 m³", "144 cm³", "144 m²"], a: 0 }, "예요."],
          { ok: "한 모서리의 길이가 1 m인 정육면체의 부피를 1 m³(1 세제곱미터)라고 해요. 1 m³ = 1000000 cm³이고, 우리 교실의 부피는 약 144 m³예요." }); } },
    { name: "확인하기 — 단위 바꾸기", inst: "하린이가 새 단장 물건들의 부피를 정리했어요. 빈칸에 알맞은 수를 써 보세요.", hints: ["1 m³ = 1000000 cm³예요.", "m³를 cm³로 바꿀 때는 1000000을 곱하고, cm³를 m³로 바꿀 때는 1000000으로 나누어요."],
      render: (b, a) => vo6Ask(b, a, [
        { parts: ["4 m³ = ", { n: 4000000, w: "8em", why: { "400": "1 m³는 100 cm³가 아니에요. 100 × 100 × 100 = 1000000이에요.", "40000": "1 m³는 10000 cm³가 아니에요(1 m² = 10000 cm²와 헷갈렸어요). 1 m³ = 1000000 cm³예요." } }, " cm³"] },
        { parts: ["15000000 cm³ = ", { n: 15, why: { "150000": "1 m³ = 1000000 cm³이니까 1000000으로 나누어요.", "1500": "1 m³ = 1000000 cm³이니까 1000000으로 나누어요.", "150": "0을 몇 개 지워야 하는지 다시 세어 봐요. 15000000 ÷ 1000000이에요." } }, " m³"] },
        { parts: ["0.8 m³ = ", { n: 800000, w: "8em", why: { "8000": "0.8 × 1000000을 다시 계산해 봐요.", "80000": "0.8 × 1000000을 다시 계산해 봐요.", "8000000": "8 m³가 아니라 0.8 m³예요." } }, " cm³"] }],
        { ok: "4 m³ = 4000000 cm³, 15000000 cm³ = 15 m³, 0.8 m³ = 800000 cm³예요. 0을 붙이거나 지우는 까닭은 1 m³ 안에 1 cm³가 100 × 100 × 100개 들어가기 때문이에요." }) },
    { name: "확인하기 — 부피를 m³로 구하기", inst: "교실 뒤 사물함 전체는 가로 400 cm, 세로 50 cm, 높이 150 cm인 직육면체 모양이에요. 사물함의 부피를 두 가지 방법으로 m³로 구해 보세요.", hints: ["방법 1: cm³로 구한 뒤 1000000으로 나누어요.", "방법 2: 길이를 m로 바꾸면 4 m, 0.5 m, 1.5 m예요."],
      render: thenWhy((b, a) => vo6Ask(b, a, [
        { fig: () => vo6Cub([400, 50, 150], "cm", { W: 220, maxW: "15em" }), q: "방법 1 — cm³로 구한 뒤 m³로 바꾸기", parts: ["400 × 50 × 150 = ", { n: 3000000, w: "8em" }, " (cm³) = ", { n: 3, why: { "300": "1 m³ = 1000000 cm³이니까 3000000을 1000000으로 나누어요.", "30": "1 m³ = 1000000 cm³이니까 3000000을 1000000으로 나누어요." } }, " m³"] },
        { q: "방법 2 — 길이를 m로 바꾸어 구하기", parts: ["4 × ", { n: 0.5, why: { "50": "50 cm를 m로 바꾸면 0.5 m예요." } }, " × ", { n: 1.5, why: { "150": "150 cm를 m로 바꾸면 1.5 m예요.", "15": "150 cm = 1.5 m예요." } }, " = ", { n: 3 }, " (m³)"] },
        { q: "가로 6 m, 세로 4 m, 높이 3 m인 학교 창고의 부피", parts: ["6 × 4 × 3 = ", { n: 72, why: { "13": "더하지 말고 곱해요.", "24": "24는 한 밑면의 넓이예요. 높이 3을 곱해요." } }, " (m³)"] }],
        { ok: "사물함의 부피는 두 방법 모두 3 m³, 창고의 부피는 72 m³예요." }),
        { q: "길이를 m로 먼저 바꾸어 구해도 답이 같은 까닭을 써 볼까요?", ph: "1 m = 100 cm라서 ~",
          help: ["① 400 cm, 50 cm, 150 cm를 m로 바꾸어 봐요. → ② 같은 길이를 다른 단위로 나타낸 것인지 생각해요.", "‘같은 길이를 m로 나타낸 것이라서 ~’ 꼴로 써요."],
          ans: "1 m = 100 cm라서 400 cm는 4 m, 50 cm는 0.5 m, 150 cm는 1.5 m예요. 같은 길이를 m로 나타낸 것이라 4 × 0.5 × 1.5 = 3(m³)로 구해도 3000000 cm³와 같은 부피예요." }) }
  ],
  challenge: { inst: "부피를 비교해 보세요.", hints: ["단위를 하나로 맞춘 뒤 비교해요.", "1 m³ = 1000000 cm³예요."],
    render: (b, a) => vo6Chain(b, a, [
      (bx, ax) => vo6Ask(bx, ax, [{ q: "부피가 가장 작은 것을 골라 보세요. ㉠ 한 모서리의 길이가 2 m인 정육면체 ㉡ 9 m³ ㉢ 7500000 cm³ ㉣ 가로 300 cm, 세로 200 cm, 높이 140 cm인 직육면체",
        parts: ["㉠ ", { n: 8 }, " m³, ㉢ ", { n: 7.5 }, " m³, ㉣ ", { n: 8.4, why: { "8400000": "m³로 써요. 8400000 cm³ = 8.4 m³예요." } }, " m³이므로 가장 작은 것은 ", { o: ["㉠", "㉡", "㉢", "㉣"], a: 2 }, "이에요."] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "부피가 같은 것끼리 이어 보세요.", parts: ["9 m³ = ", { o: ["9000000 cm³", "90000 cm³", "900 cm³"], a: 0 }, ", 0.4 m³ = ", { o: ["400000 cm³", "40000 cm³", "4000000 cm³"], a: 0 }, ", 20 m³ = ", { o: ["20000000 cm³", "2000000 cm³", "200000 cm³"], a: 0 }] }],
        { ok: "9 m³ = 9000000 cm³, 0.4 m³ = 400000 cm³, 20 m³ = 20000000 cm³예요." })]) }
},
{
  id: "s78", no: "7~8", title: "수납장을 시트지로 감싸요 ― 직육면체의 겉넓이", soop: "개념 구축하기(O)",
  question: "수납장을 시트지로 겹치지 않게 감싸려면 시트지가 얼마나 필요할까요?",
  summary: "입체도형의 겉면의 넓이를 겉넓이라고 해요. (직육면체의 겉넓이) = (여섯 면의 넓이의 합) = (한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2 = (한 밑면의 넓이) × 2 + (옆면의 넓이)예요. 옆면을 하나의 직사각형으로 보면 가로는 밑면의 둘레, 세로는 높이예요. (정육면체의 겉넓이) = (한 면의 넓이) × 6이에요.",
  steps: [
    { name: "만져 보기 — 여섯 면의 넓이 더하기", inst: "지안: “수납장 모형(가로 6 cm, 세로 3 cm, 높이 4 cm)를 시트지로 겹치지 않게 감싸 보자. 시트지가 얼마나 필요할까?” 담임 선생님: “입체도형의 겉면의 넓이를 겉넓이라고 해.” 전개도의 면을 하나씩 눌러 넓이를 알아보세요.", hints: ["전개도의 면 6개를 모두 눌러요.", "면의 넓이를 모두 더하면 겉넓이예요."],
      render: (b, a) => vo6Net(b, a, { d: VO6S.net, mode: "six",
        ask: [{ parts: ["직육면체의 면은 ", { n: 6 }, "개이고, 모두 ", { o: ["직사각형", "삼각형"], a: 0 }, " 모양이에요."] },
          { parts: ["여섯 면의 넓이의 합: 18 + 24 + 12 + 24 + 12 + 18 = ", { n: 108, why: { "54": "54는 세 면의 넓이만 더한 것이에요. 면은 6개예요.", "72": "72는 부피(6 × 3 × 4)예요. 겉넓이는 여섯 면의 넓이의 합이에요." } }, " (cm²)"] }],
        ok: "수납장 모형의 겉넓이는 108 cm²예요. 시트지가 108 cm² 필요해요." }) },
    { name: "그려 보기 — 평행한 두 면을 이용하기", inst: "하린: “마주 보는 면은 똑같으니까 더 간단히 구할 수 있지 않을까?” 면을 눌러 평행한 두 면을 찾아보세요.", hints: ["면 하나를 누르면 그 면과 평행한 면이 같은 색으로 칠해져요.", "평행한 두 면은 넓이가 같아요."],
      render: thenWhy((b, a) => vo6Net(b, a, { d: VO6S.net, mode: "pair",
        ask: [{ parts: ["18 × 2 + 12 × 2 + 24 × 2 = ", { n: 108, why: { "54": "평행한 두 면이 있으니 각각 2배 해야 해요." } }, " (cm²)"] },
          { parts: ["(18 + 12 + 24) × ", { o: ["2", "3", "6"], a: 0 }, " = 108 (cm²)"] }],
        ok: "평행한 두 면은 넓이가 같으니, 한 꼭짓점에서 만나는 세 면의 넓이를 더해 2배 하면 돼요." }),
        { q: "세 면의 넓이만 구해도 겉넓이를 알 수 있는 까닭을 써 볼까요?", ph: "직육면체에서 평행한 두 면은 ~",
          help: ["① 직육면체에서 마주 보는 두 면의 모양과 크기를 떠올려요. → ② 세 면이 각각 몇 번씩 나오는지 생각해요.", "‘평행한 두 면은 ~이라서 세 면의 넓이를 더해 ~ 하면 돼요.’ 꼴로 써요."],
          ans: "직육면체에서 평행한 두 면은 모양과 크기가 같아서, 같은 넓이의 면이 두 개씩 있어요. 그래서 한 꼭짓점에서 만나는 세 면의 넓이를 더해 2배 하면 여섯 면의 넓이의 합이 돼요." }) },
    { name: "말해 보기 — 옆면을 하나로 보기", inst: "태민: “시트지를 옆으로 길게 한 번에 두르면 어떨까?” 옆면 네 개를 하나의 직사각형으로 이어 보세요.", hints: ["옆면의 가로는 밑면의 둘레(6 + 3 + 6 + 3)과 같아요.", "옆면의 세로는 높이와 같아요."],
      render: (b, a) => vo6Net(b, a, { d: VO6S.net, mode: "strip",
        ask: [{ parts: ["옆면의 가로는 3 + 6 + 3 + 6 = ", { n: 18, why: { "9": "옆면은 네 개예요. 밑면의 둘레가 옆면의 가로예요." } }, " (cm), 세로는 ", { n: 4 }, " cm이니까 옆면의 넓이는 ", { n: 72 }, " cm²예요."] },
          { parts: ["두 밑면과 옆면: 18 × ", { n: 2 }, " + 72 = ", { n: 108, why: { "90": "밑면은 위아래 두 개예요. 18 × 2를 더해요." } }, " (cm²)"] },
          { q: "옆면을 하나의 직사각형으로 보는 방법이 편리한 까닭은 무엇일까요?", parts: [{ o: ["밑면의 넓이와 옆면의 넓이만 구하면 되기 때문이에요.", "옆면이 정사각형이 되기 때문이에요.", "높이를 몰라도 되기 때문이에요."], a: 0 }] }],
        ok: "옆면을 하나의 직사각형으로 보면 가로는 밑면의 둘레, 세로는 높이예요. 18 × 2 + 72 = 108(cm²)로 세 방법 모두 같아요." }) },
    { name: "약속하기 — 겉넓이를 구하는 방법", inst: "세 가지 방법을 정리하고, 정육면체 모양 화분 받침(한 모서리 5 cm)의 겉넓이도 구해 보세요.", hints: ["세 가지 방법 모두 108 cm²가 나왔어요.", "정육면체는 여섯 면의 모양과 크기가 모두 같아요."],
      render: (b, a) => vo6Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["(직육면체의 겉넓이) = (", { o: ["여섯 면", "세 면"], a: 0 }, "의 넓이의 합) = (한 꼭짓점에서 만나는 세 면의 넓이의 합) × ", { o: ["2", "3", "6"], a: 0 }, " = (한 밑면의 넓이) × 2 + (", { o: ["옆면", "윗면"], a: 0 }, "의 넓이)"],
          { ok: "세 가지 방법 중 편리한 방법을 골라 쓰면 돼요." }),
        { title: "정육면체 모양 화분 받침의 전개도에서 면을 모두 눌러 보세요.", run: (bx, ax) => vo6Net(bx, ax, { d: [5, 5, 5], mode: "six",
          ask: [{ parts: ["여섯 면의 넓이는 모두 ", { o: ["같아요", "달라요"], a: 0 }, ". 겉넓이는 25 × ", { n: 6 }, " = ", { n: 150, why: { "125": "125는 부피(5 × 5 × 5)예요.", "25": "25는 한 면의 넓이예요. 면은 6개예요.", "75": "세 면만 더했어요. 정육면체는 면이 6개예요." } }, " (cm²)"] }] }) },
        (bx, ax) => blanks(bx, ax, ["(정육면체의 겉넓이) = (", { o: ["한 면의 넓이", "한 모서리의 길이"], a: 0 }, ") × ", { o: ["6", "4", "2"], a: 0 }],
          { ok: "(정육면체의 겉넓이) = (한 면의 넓이) × 6이에요." })]) },
    { name: "확인하기 — 겉넓이 구하기", inst: "새 단장에 쓸 물건의 겉넓이를 구해 보세요. 계산기를 써도 돼요.", hints: ["(한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2로 구해요.", "정육면체는 (한 면의 넓이) × 6이에요."],
      render: (b, a) => vo6Chain(b, a, [
        (bx, ax) => vo6Ask(bx, ax, [
          { q: "가로 4 m, 세로 2 m, 높이 5 m인 직육면체 모양 학교 창고의 겉넓이", fig: () => vo6Cub([4, 2, 5], "m", { s: 16 }), parts: ["(8 + 10 + 20) × 2 = ", { n: 76, why: { "38": "세 면의 넓이만 더했어요. 2배 해요.", "40": "40은 부피예요." } }, " (m²)"] },
          { q: "한 모서리의 길이가 10 m인 정육면체의 겉넓이", parts: ["100 × 6 = ", { n: 600, why: { "1000": "1000은 부피예요.", "100": "100은 한 면의 넓이예요. 6을 곱해요." } }, " (m²)"] }]),
        (bx, ax) => vo6Ask(bx, ax, [{ q: "두 수납 상자를 시트지로 감싸려고 해요. 어느 상자에 시트지가 몇 cm² 더 필요할까요?", fig: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([20, 10, 15], "cm", { s: 6 }), "가"), vo6Fr(vo6Cub([25, 10, 10], "cm", { s: 6 }), "나")),
          parts: ["가: ", { n: 1300, why: { "650": "세 면의 넓이의 합에 2를 곱해요." } }, " cm², 나: ", { n: 1200, why: { "600": "세 면의 넓이의 합에 2를 곱해요." } }, " cm² → ", { o: ["가", "나"], a: 0 }, " 상자에 시트지가 ", { n: 100 }, " cm² 더 필요해요."] }],
          { ok: "가는 (200 + 150 + 300) × 2 = 1300(cm²), 나는 (250 + 100 + 250) × 2 = 1200(cm²)라서 가에 100 cm² 더 필요해요." })]) },
    { name: "확인하기 — 겉넓이 문제 만들기", inst: "교실에서 직육면체 모양의 물건을 찾아 겉넓이를 구하는 문제를 만들고, 짝과 바꾸어 풀어 보세요. 태민이는 연필꽂이 상자로 문제를 만들었어요.", hints: ["겉넓이를 구하려면 가로, 세로, 높이를 알아야 해요.", "편리한 방법을 골라 구하고, 짝과 어떤 방법을 썼는지 견주어 봐요."],
      render: (b, a) => vo6Make(b, a, { kind: "surf", objs: ["필통", "휴지 상자", "지우개", "수납 상자", "색연필 상자", "분필 상자"], friend: { who: "태민", obj: "연필꽂이 상자", d: [8, 4, 10], a: 304, q: "가로가 8 cm, 세로가 4 cm, 높이가 10 cm인 직육면체 모양의 연필꽂이 상자가 있습니다. 이 연필꽂이 상자의 겉넓이는 몇 cm²인가요?", why: { "152": "세 면의 넓이의 합만 구했어요. 2배 해요.", "320": "320은 부피예요. 겉넓이는 겉면의 넓이예요." } },
        ok: "연필꽂이 상자의 겉넓이는 (32 + 40 + 80) × 2 = 304(cm²)예요." }) }
  ],
  challenge: { inst: "정육면체와 직육면체의 겉넓이 문제를 풀어 보세요.", hints: ["정육면체의 모서리는 12개이고 길이가 모두 같아요.", "겉넓이는 (세 면의 넓이의 합) × 2예요."],
    render: (b, a) => vo6Chain(b, a, [
      (bx, ax) => vo6Ask(bx, ax, [{ q: "모든 모서리의 길이의 합이 84 cm인 정육면체 모양 상자가 있어요.", parts: ["한 모서리의 길이: 84 ÷ 12 = ", { n: 7, why: { "14": "정육면체의 모서리는 6개가 아니라 12개예요.", "21": "정육면체의 모서리는 4개가 아니라 12개예요." } }, " (cm), 겉넓이: 49 × 6 = ", { n: 294, why: { "343": "343은 부피예요." } }, " (cm²)"] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "가로 9 cm, 세로 4 cm, 높이 5 cm인 직육면체의 겉넓이는 몇 cm²인가요?", fig: () => vo6Cub([9, 4, 5], "cm", { s: 14 }), parts: [{ n: 202, why: { "101": "세 면의 넓이의 합만 구했어요. 2배 해요.", "180": "180은 부피예요." } }, " cm²"] }],
        { ok: "(36 + 20 + 45) × 2 = 202(cm²)예요." })]) }
},
{
  id: "s9", no: 9, title: "수족관 용품 상자를 쌓아 감싸요", soop: "탐구 정리하기(O)",
  question: "상자를 어떤 모양으로 쌓아야 비닐을 더 적게 쓸 수 있을까요?",
  summary: "같은 상자를 같은 개수만큼 쌓으면 쌓은 모양이 달라도 부피는 같아요. 하지만 맞닿아 가려지는 면이 달라서 겉넓이는 다를 수 있어요. 겉넓이가 더 작은 모양으로 쌓으면 감싸는 비닐을 더 적게 써서 쓰레기를 줄일 수 있어요. 이번 상자에서는 넓은 면끼리 많이 맞닿게 쌓을수록 겉넓이가 작았어요.",
  steps: [
    { name: "만져 보기 — 상자 4개를 두 가지로 쌓기", inst: "학기 말, 준혁이네 모둠은 수족관 용품(먹이, 물풀 영양제)을 담은 상자 4개를 쌓아 한 덩어리로 묶고, 먼지 막이 비닐로 겹치지 않게 감싸 보관하려고 해요. 하린: “비닐을 적게 쓰면 쓰레기도 줄어들 거야.” 상자 한 개는 가로 9 cm, 세로 5 cm, 높이 2 cm예요. 두 가지 모양으로 쌓아 보세요.", hints: ["가: 한 층에 1개씩 4층으로 쌓아요.", "나: 한 층에 4개(가로로 2개, 앞뒤로 2개)를 1층으로 놓아요."],
      render: (b, a) => vo6Chain(b, a, [
        { title: "① 가 — 한 층에 1개씩 4층으로 쌓아 보세요.", run: (bx, ax) => vo6Pack(bx, ax, { box: VO6S.pkg, N: 4, check: n => n.join() === "1,1,4" ? null : "가는 가로로 1개, 앞뒤로 1개씩 놓고 위로 4층 쌓은 모양이에요.", msg: "가 모양으로 쌓았어요.",
          ask: [{ parts: ["가는 가로 ", { n: 9 }, " cm, 세로 ", { n: 5 }, " cm, 높이 ", { n: 8, why: { "2": "상자 4개를 위로 쌓았으니 높이는 2 × 4예요." } }, " cm인 직육면체가 돼요."] }] }) },
        { title: "② 나 — 한 층에 4개씩 1층으로 놓아 보세요.", run: (bx, ax) => vo6Pack(bx, ax, { box: VO6S.pkg, N: 4, check: n => n.join() === "2,2,1" ? null : "나는 가로로 2개, 앞뒤로 2개씩 놓고 1층으로 둔 모양이에요.", msg: "나 모양으로 놓았어요.",
          ask: [{ parts: ["나는 가로 ", { n: 18 }, " cm, 세로 ", { n: 10 }, " cm, 높이 ", { n: 2 }, " cm인 직육면체가 돼요."] }],
          ok: "가는 9 cm × 5 cm × 8 cm, 나는 18 cm × 10 cm × 2 cm 모양이에요." }) }]) },
    { name: "그려 보기 — 부피와 겉넓이 견주기", inst: "가와 나의 부피와 겉넓이를 구해 견주어 보세요. 계산기를 써도 돼요.", hints: ["(부피) = (가로) × (세로) × (높이)", "(겉넓이) = (한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2"],
      render: thenWhy((b, a) => vo6Ask(b, a, [
        { fig: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([9, 5, 8], "cm", { s: 10 }), "가"), vo6Fr(vo6Cub([18, 10, 2], "cm", { s: 8 }), "나")),
          parts: ["부피: 가 ", { n: 360 }, " cm³, 나 ", { n: 360 }, " cm³ → 부피는 ", { o: ["같아요", "달라요"], a: 0 }, "."] },
        { parts: ["겉넓이: 가 (45 + 40 + 72) × 2 = ", { n: 314, why: { "157": "세 면의 넓이의 합에 2를 곱해요." } }, " cm², 나 (180 + 20 + 36) × 2 = ", { n: 472, why: { "236": "세 면의 넓이의 합에 2를 곱해요." } }, " cm²"] },
        { parts: ["비닐을 더 적게 쓰려면 ", { o: ["가", "나"], a: 0, why: { "1": "나의 겉넓이 472 cm²가 가의 314 cm²보다 넓어서 비닐이 더 많이 들어요." } }, " 모양으로 쌓아야 해요."] }],
        { ok: "부피는 360 cm³로 같지만 겉넓이는 가가 314 cm², 나가 472 cm²라서 가 모양이 비닐을 더 적게 써요." }),
        { q: "부피가 같은데 겉넓이가 다른 까닭을 써 볼까요?", ph: "쌓은 모양에 따라 ~",
          help: ["① 상자를 쌓으면 맞닿아 가려지는 면이 생겨요. → ② 가와 나에서 어떤 면끼리 맞닿았는지 견주어요.", "‘쌓은 모양에 따라 ~이 달라서 ~’ 꼴로 써요."],
          ans: "쌓은 모양에 따라 맞닿아 가려지는 면이 달라서 겉넓이가 달라져요. 가는 넓은 면(9 cm × 5 cm)끼리 맞닿아 가려지는 넓이가 커서 겉넓이가 작아요." }) },
    { name: "말해 보기 — 상자 8개 쌓기", inst: "준혁: “다음 달에는 상자가 8개로 늘어나. 비닐을 가장 적게 쓰려면 어떻게 쌓을까?” 먼저 예상해 보고, 상자 8개로 겉넓이가 가장 작은 모양을 찾아보세요. (가로로 2개, 앞뒤로 2개씩 한 층에 4개를 놓고 2층으로 쌓은 모양에서 시작해요.)", hints: ["넓은 면(9 cm × 5 cm)끼리 맞닿게 쌓으면 가려지는 넓이가 커요.", "앞뒤로 2개씩 놓고 위로 4층 쌓아 보세요."],
      render: ruleFirst((b, a) => vo6Pack(b, a, { box: VO6S.pkg, N: 8, start: [2, 2, 2],
        check: n => { const D = vo6PackD(VO6S.pkg, n), s = vo6Surf(D); return s === 484 ? null : `이렇게 쌓으면 ${vo6sDim(D)}라서 겉넓이가 ${s} cm²예요. 겉넓이를 더 줄일 수 있어요.`; }, msg: "겉넓이가 가장 작은 모양을 찾았어요!",
        ask: [{ parts: ["찾은 모양은 가로 ", { n: 9 }, " cm, 세로 ", { n: 10 }, " cm, 높이 ", { n: 8 }, " cm이고, 겉넓이는 (90 + 80 + 72) × 2 = ", { n: 484, why: { "242": "세 면의 넓이의 합에 2를 곱해요." } }, " cm², 부피는 ", { n: 720 }, " cm³예요."] }],
        ok: "가로로 1개, 앞뒤로 2개, 4층으로 쌓으면 겉넓이가 484 cm²로 가장 작아요. 처음 모양(한 층에 4개씩 2층, 584 cm²)보다 비닐을 100 cm² 덜 써요." }),
        { q: "상자 8개를 어떻게 쌓으면 비닐이 가장 적게 들지 예상해 써요.", ph: "내 예상: ~ 모양으로 쌓으면 ~",
          help: ["① 상자 4개를 쌓을 때 어떤 면끼리 맞닿은 모양이 겉넓이가 작았는지 떠올려요. → ② 8개도 그렇게 쌓을 방법을 생각해요.", "‘넓은 면끼리 ~하게, 가로로 ~개, 앞뒤로 ~개, ~층으로 쌓으면 ~’ 꼴로 써요."],
          ans: "넓은 면(9 cm × 5 cm)끼리 많이 맞닿게 가로로 1개, 앞뒤로 2개씩 놓고 4층으로 쌓으면 가로 9 cm, 세로 10 cm, 높이 8 cm가 되어 겉넓이가 484 cm²로 가장 작아요." }) },
    { name: "약속하기 — 알게 된 점 정리하기", inst: "상자를 쌓아 감싸며 알게 된 점을 정리해 보세요.", hints: ["상자 4개를 어떻게 쌓아도 부피는 360 cm³였어요.", "겉넓이는 쌓은 모양에 따라 달랐어요."],
      render: (b, a) => blanks(b, a, ["같은 상자를 같은 개수만큼 쌓으면 쌓은 모양이 달라도 부피는 ", { o: ["같아요", "달라요"], a: 0 }, ". 하지만 겉넓이는 ", { o: ["다를 수 있어요", "언제나 같아요"], a: 0 }, ". 비닐을 적게 쓰려면 겉넓이가 ", { o: ["더 작은", "더 큰"], a: 0 }, " 모양으로 쌓아요."],
        { ok: "부피가 같아도 쌓은 모양에 따라 겉넓이가 다를 수 있어요. 겉넓이가 작은 모양으로 쌓으면 비닐을 아낄 수 있어요." }) },
    { name: "확인하기 — 쓰레기를 줄이는 보관 방법", inst: "하린: “포장 쓰레기를 줄이는 데 수학이 쓰이네!” 우리 반이 물건을 보관할 때 비닐이나 종이를 아끼는 방법을 써 보세요.", hints: ["겉넓이가 작은 모양으로 쌓는 방법을 떠올려요.", "포장 자체를 줄이는 방법도 생각해 봐요."],
      render: (b, a) => writeStep(b, a, [{ q: "상자를 보관할 때 비닐을 아끼는 방법을 써 보세요.", tag: "비닐을 아끼는 방법", ph: "상자를 ~ 모양으로 쌓으면 ~",
          help: ["① 오늘 겉넓이가 작았던 쌓기 모양을 떠올려요. → ② 그렇게 하면 무엇이 좋은지 써요.", "‘상자를 ~ 모양으로 쌓으면 겉넓이가 ~해서 ~’ 꼴로 써요."],
          ans: "상자를 넓은 면끼리 많이 맞닿게 쌓으면 겉넓이가 작아져서 비닐을 덜 쓰고 쓰레기도 줄일 수 있어요." },
        { q: "포장 쓰레기를 줄이려고 우리 반이 함께 할 수 있는 일을 써 보세요.", tag: "우리 반의 다짐", ph: "우리 반은 ~",
          help: ["① 교실에서 버려지는 포장재를 떠올려요. → ② 줄이거나 다시 쓸 방법을 생각해요.", "‘우리 반은 ~을 해서 포장 쓰레기를 줄이겠어요.’ 꼴로 써요."],
          ans: "우리 반은 상자와 비닐을 버리지 않고 다시 쓰고, 꼭 필요할 때만 겉넓이가 작은 모양으로 포장해서 포장 쓰레기를 줄이겠어요." }]) }
  ],
  challenge: { inst: "같은 상자(가로 9 cm, 세로 5 cm, 높이 2 cm) 6개를 두 가지로 쌓았어요. 어느 쪽이 비닐을 몇 cm² 덜 쓸까요?", hints: ["가: 가로로 1개, 앞뒤로 2개, 3층 → 9 cm × 10 cm × 6 cm", "나: 가로로 3개, 앞뒤로 2개, 1층 → 27 cm × 10 cm × 2 cm"],
    render: (b, a) => vo6Ask(b, a, [{ fig: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([9, 10, 6], "cm", { s: 8 }), "가"), vo6Fr(vo6Cub([27, 10, 2], "cm", { s: 6 }), "나")),
      parts: ["가의 겉넓이 ", { n: 408 }, " cm², 나의 겉넓이 ", { n: 688 }, " cm² → ", { o: ["가", "나"], a: 0 }, "가 ", { n: 280 }, " cm² 덜 써요."] }],
      { ok: "가는 (90 + 60 + 54) × 2 = 408(cm²), 나는 (270 + 20 + 54) × 2 = 688(cm²)라 가가 280 cm² 덜 써요. 부피는 둘 다 540 cm³예요." }) }
},
{
  id: "s10", no: 10, title: "새 단장 기념 부피 쪽지 찾기 놀이", soop: "발표하기(P)",
  question: "붙임쪽지에 적힌 직육면체의 부피를 빠르고 바르게 구할 수 있을까요?",
  summary: "붙임쪽지에 적힌 가로, 세로, 높이로 (가로) × (세로) × (높이)를 계산해 부피를 구했어요. 부피를 바르게 구한 쪽지 수만큼 점수를 얻어요. 가로, 세로, 높이 가운데 하나라도 없으면 부피를 구할 수 없어요. 친구가 어려워하면 서로 돕고, 답을 함께 확인해요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알아보기", inst: "서아: “교실 새 단장을 기념해서 ‘부피 쪽지 찾기’ 놀이를 하자!” 반 전체가 두 모둠으로 나누어 놀이를 해요. 놀이 차례에 맞게 카드를 차례대로 눌러 보세요.", hints: ["쪽지를 만들고 → 붙이고 → 찾고 → 부피를 구하고 → 확인해요.", "쪽지를 붙이는 동안 다른 모둠은 눈을 가려요."],
      render: (b, a) => sequence(b, a, ["쪽지 주인에게 답을 확인하고, 바르게 구한 쪽지 수만큼 점수를 얻어요.", "붙임쪽지 3장에 이름과 가로·세로·높이(1~20 cm)를 적어요.", "3분 동안 한 사람이 3장까지 쪽지를 찾아요.", "한 모둠이 눈을 가린 동안 다른 모둠이 교실 곳곳에 쪽지를 붙여요.", "자리에 돌아와 쪽지에 적힌 직육면체의 부피를 구해 적어요."], [1, 3, 2, 4, 0],
        { ok: "쪽지 적기 → 붙이기 → 찾기 → 부피 구하기 → 확인하고 점수 얻기 차례예요. 두 모둠이 역할을 바꾸어 한 번 더 하고, 점수가 많은 모둠이 이겨요." }) },
    { name: "그려 보기 — 내 쪽지 만들기", inst: "내 붙임쪽지 3장을 만들어 교실에 붙여요. 다른 모둠 친구가 내 쪽지를 찾아 부피를 구해 오면 맞는지 확인해 주세요.", hints: ["가로, 세로, 높이는 1부터 20까지의 자연수로 써요.", "친구의 답이 맞는지 (가로) × (세로) × (높이)로 직접 계산해 봐요."],
      render: (b, a) => vo6Notes(b, a, {}) },
    { name: "말해 보기 — 쪽지 찾기", inst: "이번에는 우리 모둠이 찾는 차례예요. 교실 곳곳에 붙은 노란 쪽지를 3분 동안 3장까지 찾고, 자리에 돌아와 부피를 구해 보세요.", hints: ["‘눈 뜨고 찾기 시작!’을 누르고, 교실 그림 속 노란 쪽지를 눌러요.", "부피는 (가로) × (세로) × (높이)예요. 계산기를 써도 돼요."],
      render: (b, a) => vo6Hunt(b, a, { time: 180 }) },
    { name: "약속하기 — 놀이 약속 정하기", inst: "태민: “다음 판에는 우리 모둠이 꼭 이기고 싶어!” 놀이를 하며 지킬 약속과 이기는 방법을 정해 보세요.", hints: ["모두가 안전하고 즐겁게 놀이할 수 있는 약속을 골라요.", "점수는 부피를 바르게 구한 쪽지 수만큼 얻어요."],
      render: (b, a) => vo6Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "놀이를 하며 지킬 약속을 모두 골라 보세요.", o: ["쪽지는 위험하지 않은 곳에 붙여요.", "같은 모둠 친구가 어려워하면 도와요.", "부피를 옳게 구했는지 서로 확인해요.", "다른 모둠의 쪽지를 몰래 떼어 숨겨요."], a: [0, 1, 2],
          why: { "0,1,3": "쪽지를 몰래 떼어 숨기면 놀이를 공정하게 할 수 없어요.", "0,2,3": "쪽지를 몰래 떼어 숨기면 놀이를 공정하게 할 수 없어요.", "1,2,3": "쪽지를 몰래 떼어 숨기면 놀이를 공정하게 할 수 없어요." } }],
          { ok: "안전한 곳에 붙이고, 서로 돕고, 답을 함께 확인해요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "우리 모둠이 놀이에서 이기려면 어떻게 하면 좋을지 써 보세요.", tag: "이기는 방법", ph: "쪽지를 ~, 부피를 ~",
          help: ["① 쪽지를 붙일 때와 찾을 때를 나누어 생각해요. → ② 점수를 얻는 방법(부피를 바르게 구하기)을 떠올려요.", "‘쪽지는 ~에 붙이고, 찾을 때는 ~, 부피는 ~해서 구해요.’ 꼴로 써요."],
          ans: "쪽지는 눈에 잘 띄지 않지만 안전한 곳에 붙이고, 찾을 때는 3장을 꼭 찾아요. 부피는 (가로) × (세로) × (높이)로 바르게 구하고 한 번 더 검산해요." }])]) },
    { name: "확인하기 — 또 다른 놀이: 종이 뒤집기", inst: "준혁이가 둘이서 하는 놀이를 알려 주었어요. 가로, 세로, 높이 중 하나가 적힌 종이를 3장씩 뒤집어, 가로·세로·높이가 모두 나오면 가져와요. 종이가 다 없어지면 가져온 종이로 부피를 구해 부피의 합이 더 큰 사람이 이겨요.", hints: ["3장이 각각 가로, 세로, 높이여야 가져올 수 있어요.", "뒤집었다 다시 놓은 종이의 자리를 기억해 두면 좋아요."],
      render: (b, a) => vo6Cards(b, a, { per: 4 }) }
  ],
  challenge: { inst: "다른 모둠 친구들이 구해 온 답이에요. 맞으면 ‘정답이야!’, 틀리면 ‘다시 구해 봐!’를 골라 보세요.", hints: ["(가로) × (세로) × (높이)를 직접 계산해서 견주어요.", "12 × 5 = 60, 60 × 7을 계산해요."],
    render: (b, a) => vo6Ask(b, a, [
      { q: "시온의 쪽지: 가로 12 cm, 세로 5 cm, 높이 7 cm / 친구의 답: 410 cm³", parts: [{ o: ["정답이야!", "다시 구해 봐!"], a: 1, why: { "0": "12 × 5 × 7 = 420이에요. 410은 틀린 답이에요." } }, " 바른 부피는 ", { n: 420 }, " cm³예요."] },
      { q: "나래의 쪽지: 가로 15 cm, 세로 4 cm, 높이 6 cm / 친구의 답: 360 cm³", parts: [{ o: ["정답이야!", "다시 구해 봐!"], a: 0, why: { "1": "15 × 4 × 6 = 360이에요. 친구의 답이 맞아요." } }] },
      { q: "가람의 쪽지: 가로 9 cm, 높이 8 cm (세로가 지워졌어요)", parts: ["이 쪽지로는 부피를 ", { o: ["구할 수 없어요", "구할 수 있어요"], a: 0, why: { "1": "세로를 모르면 (가로) × (세로) × (높이)를 계산할 수 없어요." } }, "."] }],
      { ok: "시온의 쪽지는 420 cm³, 나래의 쪽지는 360 cm³예요. 가로, 세로, 높이 중 하나라도 없으면 부피를 구할 수 없어요." }) }
},
{
  id: "s11", no: 11, title: "교실 새 단장 발표회", soop: "발표하기(P)",
  question: "교실 새 단장을 하며 배운 부피와 겉넓이를 친구들에게 설명할 수 있을까요?",
  summary: "부피의 단위는 1 cm³, 1 m³이고 1 m³ = 1000000 cm³예요. (직육면체의 부피) = (가로) × (세로) × (높이), (정육면체의 부피) = (한 모서리의 길이) × (한 모서리의 길이) × (한 모서리의 길이)예요. (직육면체의 겉넓이) = (한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2 = (한 밑면의 넓이) × 2 + (옆면의 넓이), (정육면체의 겉넓이) = (한 면의 넓이) × 6이에요. 단위가 다르면 먼저 단위를 맞추어 계산해요.",
  steps: [
    { name: "만져 보기 — 쌓기나무로 부피 비교하기", inst: "발표회 첫 순서로 서아가 1 cm³ 쌓기나무로 만든 두 직육면체를 보여 주었어요. 부피를 비교해 보세요.", hints: ["한 층의 쌓기나무 수와 층수를 세어요.", "(가로) × (세로) × (높이)로 구해도 돼요."],
      render: (b, a) => vo6Ask(b, a, [{ fig: () => h("div", { class: "vo6figs" }, vo6sStackFig(VO6S.e11a, "가", [5, 3, 2]), vo6sStackFig(VO6S.e11b, "나", [5, 3, 2])),
        parts: ["가의 부피는 ", { n: 24, why: { "12": "한 층에 12개씩 2층이에요." } }, " cm³이고, 나의 부피는 ", { n: 20, why: { "10": "한 층에 10개씩 2층이에요." } }, " cm³예요. ", { o: ["가", "나"], a: 0 }, "의 부피가 더 커요."] }],
      { ok: "가는 4 × 3 × 2 = 24(cm³), 나는 5 × 2 × 2 = 20(cm³)라서 가의 부피가 더 커요." }) },
    { name: "그려 보기 — 단위 바꾸기 발표", inst: "하린이가 발표 판에 부피의 단위를 바꾸는 문제를 냈어요. 빈칸에 알맞은 수를 써 보세요.", hints: ["1 m³ = 1000000 cm³예요.", "1 m = 100 cm라서 100 × 100 × 100 = 1000000이에요."],
      render: (b, a) => vo6Ask(b, a, [
        { parts: ["3 m³ = ", { n: 3000000, w: "8em", why: { "300": "1 m³ = 1000000 cm³예요.", "30000": "1 m³는 10000 cm³가 아니라 1000000 cm³예요." } }, " cm³"] },
        { parts: ["250000000 cm³ = ", { n: 250, why: { "25000": "1000000으로 나누어요.", "2500": "1000000으로 나누어요." } }, " m³"] },
        { parts: ["0.5 m³ = ", { n: 500000, w: "8em", why: { "5000": "0.5 × 1000000을 다시 계산해요.", "50000": "0.5 × 1000000을 다시 계산해요." } }, " cm³"] }],
      { ok: "3 m³ = 3000000 cm³, 250000000 cm³ = 250 m³, 0.5 m³ = 500000 cm³예요." }) },
    { name: "말해 보기 — 잘못된 계산 고치기", inst: "지안이가 정리 상자(가로 10 cm, 세로 4 cm, 높이 3 cm)를 시트지로 겹치지 않게 감쌀 때 필요한 시트지의 넓이를 이렇게 구했어요. “한 밑면의 넓이는 40 cm²이고 옆면의 넓이는 84 cm²이므로, 필요한 시트지의 넓이는 40 + 84 = 124(cm²)예요.” 잘못된 곳을 찾아 옳게 고쳐 보세요.", hints: ["직육면체에서 밑면은 몇 개인가요?", "옆면의 가로는 밑면의 둘레(10 + 4 + 10 + 4), 세로는 높이(3 cm)예요."],
      render: thenWhy((b, a) => vo6Ask(b, a, [{ fig: () => vo6Cub([10, 4, 3], "cm", { s: 16 }),
        parts: ["한 밑면의 넓이는 ", { n: 40 }, " cm²이고, 옆면의 넓이는 (10 + 4 + 10 + 4) × 3 = ", { n: 84 }, " (cm²)예요. 밑면은 ", { n: 2, why: { "1": "밑면은 위와 아래에 하나씩, 모두 2개예요." } }, "개이므로 필요한 시트지의 넓이는 40 × 2 + 84 = ", { n: 164, why: { "124": "지안이처럼 밑면을 1개만 더했어요. 밑면은 2개예요." } }, " (cm²)예요."] }],
        { ok: "밑면은 2개라서 40 × 2 + 84 = 164(cm²)예요. (40 + 30 + 12) × 2 = 164로 구해도 같아요." }),
        { q: "지안이의 계산에서 무엇이 잘못되었는지 써 볼까요?", ph: "지안이는 ~",
          help: ["① 직육면체의 밑면이 몇 개인지 떠올려요. → ② 지안이가 밑면을 몇 개 더했는지 찾아요.", "‘지안이는 밑면을 ~개만 더했어요. 밑면은 ~개라서 ~’ 꼴로 써요."],
          ans: "지안이는 밑면을 1개만 더했어요. 직육면체의 밑면은 위와 아래에 2개라서 40 × 2 + 84 = 164(cm²)로 구해야 해요." }) },
    { name: "약속하기 — 단원 정리하기", inst: "발표회 정리 판을 완성해 보세요.", hints: ["1 m = 100 cm예요.", "직육면체는 평행한 면이 3쌍, 정육면체는 모양과 크기가 같은 면이 6개예요."],
      render: (b, a) => blanks(b, a, ["1 m³ = ", { o: ["1000000", "10000", "100"], a: 0 }, " cm³ · (직육면체의 부피) = (가로) × (", { o: ["세로", "둘레"], a: 0 }, ") × (높이) · (직육면체의 겉넓이) = (한 꼭짓점에서 만나는 세 면의 넓이의 합) × ", { o: ["2", "3", "6"], a: 0 }, " · (정육면체의 부피) = (한 모서리의 길이) × (한 모서리의 길이) × (한 모서리의 길이) · (정육면체의 겉넓이) = (한 면의 넓이) × ", { o: ["6", "4", "2"], a: 0 }],
        { ok: "1 m³ = 1000000 cm³, 부피는 (가로) × (세로) × (높이), 겉넓이는 (세 면의 넓이의 합) × 2, 정육면체의 겉넓이는 (한 면의 넓이) × 6이에요." }) },
    { name: "확인하기 — 발표 문제 풀기", inst: "준혁이와 태민이가 낸 발표 문제를 풀어 보세요. 계산기를 써도 돼요.", hints: ["단위가 다르면 먼저 같은 단위로 바꾸어요.", "0.3 m = 30 cm예요."],
      render: (b, a) => vo6Chain(b, a, [
        (bx, ax) => vo6Ask(bx, ax, [
          { q: "가로 8 cm, 세로 3 cm, 높이 5 cm인 직육면체", fig: () => vo6Cub([8, 3, 5], "cm", { s: 14 }), parts: ["부피: ", { n: 120 }, " cm³, 겉넓이: ", { n: 158, why: { "79": "세 면의 넓이의 합에 2를 곱해요.", "120": "120은 부피예요." } }, " cm²"] },
          { q: "한 변의 길이가 5 m인 정사각형을 밑면으로 하고, 높이가 3 m인 직육면체", fig: () => vo6Cub([5, 5, 3], "m", { s: 14 }), parts: ["부피: ", { n: 75, why: { "15": "한 밑면의 넓이 25 m²에 높이 3 m를 곱해요." } }, " m³, 겉넓이: 25 × 2 + 15 × 4 = ", { n: 110, why: { "85": "옆면은 4개예요. 15 × 4를 더해요.", "55": "세 면의 넓이의 합에 2를 곱해요." } }, " m²"] }]),
        (bx, ax) => vo6Ask(bx, ax, [{ q: "준혁: “수족관을 하나 더 들이려고 해. 세 수조 중 부피가 가장 큰 것은?” ㉠ 한 모서리의 길이가 30 cm인 정육면체 ㉡ 가로 40 cm, 세로 25 cm, 높이 0.3 m인 직육면체 ㉢ 가로 50 cm, 세로 20 cm, 높이 25 cm인 직육면체",
          parts: ["㉠ ", { n: 27000 }, " cm³, ㉡ ", { n: 30000, why: { "300": "높이 0.3 m를 30 cm로 바꾸어 곱해요." } }, " cm³, ㉢ ", { n: 25000 }, " cm³ → 부피가 가장 큰 수조는 ", { o: ["㉠", "㉡", "㉢"], a: 1 }, "이에요."] }],
          { ok: "단위를 cm로 맞추면 ㉠ 27000 cm³, ㉡ 30000 cm³, ㉢ 25000 cm³라서 ㉡이 가장 커요." })]) },
    { name: "발표하기 — 궁금했던 것을 풀어요", inst: "1차시에 붙였던 ‘궁금해요’ 쪽지를 다시 보고, 이 단원에서 알게 된 것으로 답해 보세요. 그리고 교실 새 단장을 하며 배운 것을 발표해 보세요.", hints: ["부피, 겉넓이, 1 cm³, 1 m³ 같은 낱말을 넣어 답해요.", "새 단장에서 직접 구했던 수(수조 받침 상자, 수납장, 교실의 부피 등)를 예로 들어요."],
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "1차시에 궁금했던 것 하나를 골라, 이제 어떻게 답할 수 있는지 써 보세요.", tag: "궁금했던 것 해결", ph: "궁금했던 것: ~ / 지금 내 답: ~",
          help: ["① 위의 ‘궁금했던 것’ 중 하나를 골라요(없으면 이 단원에서 새로 안 것을 골라요). → ② 이 단원에서 배운 방법과 낱말을 넣어 답해요.", "‘궁금했던 것: ~ / 지금 내 답: ~이에요. 왜냐하면 ~이기 때문이에요.’ 꼴로 써요."],
          ans: "궁금했던 것: 두 수납 상자 중 어느 상자에 물건이 더 많이 들어갈까? / 지금 내 답: 두 상자의 부피를 (가로) × (세로) × (높이)로 구해 cm³로 견주면 돼요. 같은 단위로 나타내야 비교할 수 있기 때문이에요." },
        { q: "교실 새 단장에서 부피나 겉넓이를 쓴 일 하나를 골라 친구들에게 발표할 문장을 써 보세요.", tag: "발표 문장", ph: "우리는 ~할 때 ~을 구했어요.",
          help: ["① 수조 받침 상자, 수납장, 시트지, 상자 쌓기 중 하나를 골라요. → ② 무엇을 어떻게 구했는지 차례대로 써요.", "‘우리는 ~할 때 ~을 ~ 방법으로 구했어요. 그래서 ~을 알 수 있었어요.’ 꼴로 써요."],
          ans: "우리는 수납장 모형을 시트지로 감쌀 때 겉넓이를 (18 + 12 + 24) × 2 = 108(cm²)로 구했어요. 그래서 시트지가 108 cm² 필요하다는 것을 알 수 있었어요." }])) }
  ],
  challenge: { inst: "단원 종합 문제예요.", hints: ["정육면체의 겉넓이 ÷ 6 = 한 면의 넓이예요.", "부피가 같아도 겉넓이는 다를 수 있어요."],
    render: (b, a) => vo6Chain(b, a, [
      (bx, ax) => vo6Ask(bx, ax, [{ q: "겉넓이가 216 cm²인 정육면체 모양 상자가 있어요.", parts: ["한 면의 넓이: 216 ÷ 6 = ", { n: 36 }, " (cm²), 한 모서리의 길이: ", { n: 6, why: { "36": "36은 한 면의 넓이예요. 같은 수를 두 번 곱해 36이 되는 수를 찾아요.", "18": "36 ÷ 2가 아니에요. 같은 수를 두 번 곱해 36이 되는 수를 찾아요." } }, " cm, 부피: ", { n: 216 }, " cm³"] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "상자 가는 한 모서리의 길이가 10 cm인 정육면체, 상자 나는 가로 20 cm, 세로 5 cm, 높이 10 cm인 직육면체예요.", fig: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([10, 10, 10], "cm", { s: 8 }), "가"), vo6Fr(vo6Cub([20, 5, 10], "cm", { s: 8 }), "나")),
        parts: ["부피: 가 ", { n: 1000 }, " cm³, 나 ", { n: 1000 }, " cm³ / 겉넓이: 가 ", { n: 600 }, " cm², 나 ", { n: 700, why: { "350": "세 면의 넓이의 합에 2를 곱해요." } }, " cm² → 부피가 같아도 겉넓이는 ", { o: ["다를 수 있어요", "언제나 같아요"], a: 0 }, "."] }],
        { ok: "두 상자의 부피는 1000 cm³로 같지만, 겉넓이는 가 600 cm², 나 700 cm²로 달라요." })]) }
}
];
