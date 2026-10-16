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
