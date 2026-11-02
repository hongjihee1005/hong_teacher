//@@APP
const APP={title:"자원봉사 센터 부피와 겉넓이", unit:"6-1 수학 6. 직육면체의 부피와 겉넓이(교과서)", key:"t61-volume-v1", welcome:"자원봉사 센터 부피와 겉넓이 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 자원봉사 센터에 간 유찬이와 함께 생필품 상자의 부피를 비교하고, 쌓기나무를 쌓아 직육면체의 부피를 구하고, 1 cm³와 1 m³의 관계를 알아보고, 식료품 상자를 포장하며 직육면체의 겉넓이를 구해 봐요."};
//@@UNIT
/* =========================================================
   6-1 수학 6. 직육면체의 부피와 겉넓이 — 단원 조작 부품 (앞글자 vo6)
   직육면체는 [가로, 세로, 높이]로 적어요(가로 = 왼쪽→오른쪽, 세로 = 앞→뒤, 높이 = 아래→위).
   그림은 모두 이 수로 코드가 그려요(비스듬히 본 겨냥도: 앞면·윗면·오른쪽 옆면이 보임).
   vo6Solid   직육면체·쌓기나무 그림            vo6Net     전개도에서 면을 눌러 겉넓이 구하기
   vo6Dims    가로·세로·높이를 바꾸며 쌓기       vo6Fill    상자 안을 같은 물건으로 채워 세기
   vo6Touch   두 상자의 면끼리 맞대어 보기       vo6M3      1 m³ 안에 1 cm³ 쌓기나무 채우기
   vo6Pack    상자 여러 개를 쌓아 포장하기       vo6Make    주변 물건으로 문제 만들고 바꾸어 풀기
   vo6Pour    되로 말 채우기                     vo6Hunt    붙임쪽지 찾기 놀이 · vo6Notes 내 쪽지 만들기 · vo6Cards 종이 뒤집기 놀이
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
function vo6Ask(host, api, items, opts = {}) {
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
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(st => {
      if (st.pt.o) [...st.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = st.pt.multi ? st.v.has(i) : st.v === i; if (picked) b.classList.add(good(st) ? "good" : "bad"); });
      else st.inp.style.borderColor = good(st) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(st => !good(st));
    if (!bad) return opts.then ? vo6Then(host, api, opts, ans, opts.ok) : api.done(ans, opts.ok);
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(vo6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || (!bad.pt.o && isNaN(vo6Num(bad.inp.value)) ? "빈칸이나 수가 아닌 칸이 있어요. 수로 써 보세요." : opts.bad || "빨간 칸을 다시 살펴봐요."), ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
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
function vo6Dims(body, api, opt) {
  const names = opt.names || ["가로", "세로", "높이"], mx = opt.max || [10, 8, 8], mn = opt.min || [1, 1, 1];
  let d = (opt.start || [1, 1, 1]).slice();
  if (opt.show) { const sh = opt.show(); if (sh) body.append(sh); }
  const pic = h("div"), cnt = h("div", { class: "vo6cnt" }), vals = [];
  const ctl = h("div", { class: "vo6ctl" });
  names.forEach((nm, i) => {
    const v = h("b", {}, String(d[i])); vals.push(v);
    const lock = opt.lock && opt.lock[i];
    ctl.append(h("span", {}, nm + (opt.dirWord ? opt.dirWord[i] : "")),
      h("button", { type: "button", "aria-label": nm + " 줄이기", disabled: lock, onclick: () => { d[i] = Math.max(mn[i], d[i] - 1); paint(); } }, "－"), v,
      h("button", { type: "button", "aria-label": nm + " 늘리기", disabled: lock, onclick: () => { d[i] = Math.min(mx[i], d[i] + 1); paint(); } }, "＋"));
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
  const checkB = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = names.map((n, i) => n + " " + d[i]).join(", ");
    const why = opt.check(d); if (why) return api.fail(why, ans);
    vo6Then(body, api, opt, ans, typeof opt.msg === "function" ? opt.msg(d) : opt.msg || "잘 쌓았어요!", d.slice());
  } }, "확인하기");
  body.append(h("div", { class: "vo6build" }, h("div", { class: "vo6l" }, ctl, cnt), h("div", { class: "vo6r" }, pic)),
    h("p", { class: "vo6small" }, opt.tip || "＋, － 단추를 누르면 그 방향으로 쌓은 쌓기나무가 한 줄씩 늘거나 줄어요."), h("div", { class: "actions" }, checkB));
  paint();
}

/* ---------- 상자 안을 같은 물건으로 채워 세기 ----------
   opt: box[가로,세로,높이](칸) · unit[칸](물건 하나 크기) · name("쌓기나무") · col · show · ask/then · msg · ok · W · labels */
function vo6Fill(body, api, opt) {
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
function vo6Touch(body, api, opt) {
  const kinds = d => { const f = [[d[0], d[2], d[1], "앞면"], [d[1], d[2], d[0], "옆면"], [d[0], d[1], d[2], "윗면"]], seen = new Set(); return f.filter(x => { const k = [x[0], x[1]].sort().join(); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const FA = kinds(opt.A), FB = kinds(opt.B); let ia = 0, ib = 0, turn = false; const tried = new Set();
  const pic = h("div"), msg = h("div", { class: "vo6box" });
  const rowA = h("div", { class: "vo6btns" }, h("span", { class: "jua" }, "가의 면: "));
  const rowB = h("div", { class: "vo6btns" }, h("span", { class: "jua" }, "나의 면: "));
  FA.forEach((f, i) => rowA.append(h("button", { type: "button", onclick: () => { ia = i; paint(); } }, `${f[3]} 모양`)));
  FB.forEach((f, i) => rowB.append(h("button", { type: "button", onclick: () => { ib = i; paint(); } }, `${f[3]} 모양`)));
  const turnB = h("button", { type: "button", onclick: () => { turn = !turn; paint(); } }, "나를 돌려서 대기");
  body.append(h("div", { class: "vo6figs" }, vo6Fr(vo6Solid({ d: opt.A, mode: "solid", s: 16, maxW: "10em", plain: true, tint: { top: "#FFE2B0", front: "#F4B46C", right: "#DC8C4A" } }), "상자 가"),
    vo6Fr(vo6Solid({ d: opt.B, mode: "solid", s: 16, maxW: "4.6em", plain: true, tint: { top: "#CFE5FA", front: "#8DBDEB", right: "#5C97D0" } }), "상자 나")), rowA, rowB, h("div", { class: "vo6btns" }, turnB), pic, msg);
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
function vo6Net(body, api, opt) {
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
function vo6M3(body, api, opt) {
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
function vo6Pack(body, api, opt) {
  const B = opt.box, N = opt.N; let n = (opt.start || [1, 1, 1]).slice();
  const names = ["가로로", "세로로(앞뒤로)", "위로(층)"], vals = [];
  const pic = h("div"), cnt = h("div", { class: "vo6cnt" });
  const ctl = h("div", { class: "vo6ctl" });
  names.forEach((nm, i) => { const v = h("b", {}, ""); vals.push(v);
    ctl.append(h("span", {}, nm), h("button", { type: "button", "aria-label": nm + " 줄이기", onclick: () => { n[i] = Math.max(1, n[i] - 1); paint(); } }, "－"), v,
      h("button", { type: "button", "aria-label": nm + " 늘리기", onclick: () => { n[i] = Math.min(N, n[i] + 1); paint(); } }, "＋")); });
  function paint() {
    n.forEach((x, i) => { vals[i].textContent = x + "개"; });
    const bl = []; for (let i = 0; i < n[0]; i++) for (let j = 0; j < n[1]; j++) for (let k = 0; k < n[2]; k++) bl.push({ x: i * B[0], y: j * B[1], z: k * B[2], w: B[0], d: B[1], h: B[2], c: VO6.box });
    const D = [n[0] * B[0], n[1] * B[1], n[2] * B[2]];
    const FR = [B[0] * Math.max(4, n[0]), B[1] * Math.max(4, n[1]), B[2] * Math.max(4, n[2])];
    pic.innerHTML = ""; pic.append(vo6Solid({ d: D, mode: "none", blocks: bl, frame: FR, s: Math.min(230 / (FR[0] + FR[1] * .39), 170 / (FR[2] + FR[1] * .31)), maxW: "16em", plain: true, label: "쌓은 상자" }));
    cnt.textContent = `쌓은 상자 ${n[0] * n[1] * n[2]}개` + (n[0] * n[1] * n[2] === N ? " ✓" : ` (상자는 ${N}개예요)`);
  }
  api.provide({ words: ["가로, 세로, 높이", "겉넓이"], answers: [] });
  const checkB = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = n.join("×");
    if (n[0] * n[1] * n[2] !== N) return api.fail(`상자 ${N}개를 모두 써서 쌓아요. 지금은 ${n[0] * n[1] * n[2]}개예요.`, ans);
    const why = opt.check ? opt.check(n) : null; if (why) return api.fail(why, ans);
    vo6Then(body, api, opt, ans, typeof opt.msg === "function" ? opt.msg(n) : opt.msg || "잘 쌓았어요!", n.slice());
  } }, "확인하기");
  body.append(h("div", { class: "vo6build" }, h("div", { class: "vo6l" }, ctl, cnt), h("div", { class: "vo6r" }, pic)),
    h("p", { class: "vo6small" }, `상자 한 개는 가로 ${B[0]} cm, 세로 ${B[1]} cm, 높이 ${B[2]} cm예요. ＋, － 단추로 상자를 몇 개씩 놓을지 정해 보세요.`), h("div", { class: "actions" }, checkB));
  paint();
}
/* 쌓은 모양 n(가로·세로·층 개수)의 크기·부피·겉넓이 */
const vo6PackD = (B, n) => [B[0] * n[0], B[1] * n[1], B[2] * n[2]];

/* ---------- 되로 말 채우기 ---------- */
function vo6Pour(body, api, opt) {
  let k = 0;
  const pic = h("div"), cnt = h("div", { class: "vo6cnt" });
  const btn = h("button", { type: "button", class: "big", onclick: () => { if (k >= 10) return; k++; paint(); if (k === 10) { btn.disabled = true; vo6Then(body, api, opt, "10되", "말이 가득 찼어요!"); } } }, "되로 쌀 한 번 붓기");
  function paint() {
    pic.innerHTML = "";
    pic.append(vo6Fig(300, 200, s => {
      const rice = "#F7F0DC", wood = "#C9A16B", dk = "#7A5530";
      // 되
      s.append(svgEl("polygon", { points: "30,90 90,90 100,82 40,82", fill: "#E9D3AE", stroke: dk, "stroke-width": 2 }));
      s.append(svgEl("rect", { x: 30, y: 90, width: 60, height: 45, fill: wood, stroke: dk, "stroke-width": 2 }));
      s.append(svgEl("polygon", { points: "90,90 100,82 100,127 90,135", fill: "#A9824E", stroke: dk, "stroke-width": 2 }));
      s.append(svgEl("ellipse", { cx: 65, cy: 86, rx: 27, ry: 4, fill: rice }));
      s.append(txt(65, 155, "되", 18, { fill: dk }));
      // 말
      const x = 170, y = 40, w = 90, hh = 130, lvl = hh * k / 10;
      s.append(svgEl("rect", { x, y, width: w, height: hh, fill: "#FFF8EC", stroke: dk, "stroke-width": 2.5 }));
      if (k) s.append(svgEl("rect", { x: x + 2, y: y + hh - lvl, width: w - 4, height: lvl - 2, fill: rice, stroke: "#D8C9A0" }));
      for (let i = 1; i < 10; i++) s.append(svgEl("line", { x1: x + w, x2: x + w + 6, y1: y + hh * i / 10, y2: y + hh * i / 10, stroke: dk, "stroke-width": 1 }));
      s.append(txt(x + w / 2, y + hh + 18, "말", 18, { fill: dk }));
      s.append(svgEl("path", { d: "M105,95 Q135,60 165,80", fill: "none", stroke: "#B9A27A", "stroke-width": 2, "stroke-dasharray": "5 4" }));
    }, "18em", true));
    cnt.textContent = `부은 횟수: ${k}번`;
  }
  api.provide({ words: ["되", "말", "열 되"], answers: [] });
  body.append(pic, cnt, h("div", { class: "vo6btns" }, btn));
  paint();
}

/* ---------- 주변 물건으로 문제 만들고 바꾸어 풀기 ----------
   opt.kind "vol" | "surf" · friend {obj, d, a, why} */
const VO6_OBJ = ["지우개", "필통", "과자 상자", "택배 상자", "사물함", "주사위", "초콜릿 상자", "휴지 상자"];
function vo6Make(body, api, opt) {
  const vol = opt.kind !== "surf", U = vol ? "cm³" : "cm²", word = vol ? "부피" : "겉넓이";
  let obj = null;
  const ob = h("div", { class: "vo6btns" }, h("span", { class: "jua" }, "물건: "));
  VO6_OBJ.forEach(o => ob.append(h("button", { type: "button", onclick: e => { obj = o; [...ob.querySelectorAll("button")].forEach(b => b.classList.remove("vo6-pick")); e.currentTarget.classList.add("vo6-pick"); } }, o)));
  const ins = ["가로", "세로", "높이"].map(n => h("input", { type: "text", inputmode: "decimal", "aria-label": n }));
  const mk = h("div", { class: "vo6mk" }, ...["가로", "세로", "높이"].flatMap((n, i) => [h("span", {}, n), ins[i], h("span", {}, "cm")]));
  const out = h("div");
  body.append(h("p", { class: "inst" }, h("b", {}, "① 내 문제 만들기 — "), "주변에서 직육면체 모양의 물건을 하나 고르고, 자로 잰 가로·세로·높이를 써 보세요(자연수나 소수 한 자리)."), ob, mk);
  const make = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const d = ins.map(i => vo6Num(i.value));
    if (!obj) return api.fail("먼저 물건을 하나 골라 보세요.", "-");
    if (d.some(v => isNaN(v) || v <= 0 || v > 300 || Math.abs(Math.round(v * 10) - v * 10) > 1e-9)) return api.fail("가로·세로·높이를 0보다 크고 300보다 작거나 같은 수로, 소수는 한 자리까지 써 보세요.", ins.map(i => i.value).join(","));
    make.disabled = true; ins.forEach(i => { i.disabled = true; });
    const qs = `가로가 ${d[0]} cm, 세로가 ${d[1]} cm, 높이가 ${d[2]} cm인 직육면체 모양의 ${vo6Jo(obj, "이/가")} 있습니다. 이 ${obj}의 ${vo6Jo(word, "은/는")} 몇 ${U}인가요?`;
    const right = vo6Fix(vol ? vo6Vol(d) : vo6Surf(d)), inp = h("input", { type: "text", inputmode: "decimal", style: "width:7em;font-size:1.1em;text-align:center", "aria-label": "내 문제의 답" });
    out.append(h("div", { class: "vo6note", style: "display:block;margin:.4em 0" }, "내가 만든 문제: " + qs), vo6Cub(d.map(v => Math.max(v, Math.max(...d) / 8)), "cm", { labels: { a: d[0] + " cm", b: d[1] + " cm", c: d[2] + " cm" }, maxW: "13em" }),
      h("p", { class: "sent" }, "내 문제의 답: ", inp, " " + U));
    const chk = h("button", { class: "big", onclick: () => {
      api.tryOnce(); const v = vo6Num(inp.value);
      if (Math.abs(v - right) > 1e-6) {
        const why = !vol && Math.abs(v - right / 2) < 1e-6 ? "세 면의 넓이를 더한 것만 구했어요. 서로 평행한 면이 두 개씩 있으니 2배 해야 해요." : vol ? "(가로) × (세로) × (높이)를 다시 계산해 봐요. 소수가 있으면 계산기를 써도 돼요." : "(한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2를 다시 계산해 봐요. 계산기를 써도 돼요.";
        return api.fail(why, inp.value);
      }
      chk.disabled = true; inp.style.borderColor = "var(--ok)";
      const f = opt.friend, box = h("div", { class: "vo6part" });
      box.append(h("p", { class: "inst" }, h("b", {}, "② 바꾸어 풀기 — "), "짝이 만든 문제를 풀어 보세요."), h("div", { class: "vo6note", style: "display:block;margin:.4em 0" }, f.q), vo6Cub(f.d, "cm", { maxW: "12em" }));
      body.append(box); vo6Go(box);
      vo6Ask(box, api, [{ parts: [`${f.obj}의 ${vo6Jo(word, "은/는")} `, { n: f.a, why: f.why }, " " + U + "예요."] }], { ok: opt.ok });
    } }, "내 답 확인하기");
    out.append(h("div", { class: "actions" }, chk));
  } }, "문제 만들기");
  body.append(h("div", { class: "actions" }, make), out);
}

/* ---------- 붙임쪽지 찾기 놀이 ---------- */
const VO6_NAMES = ["송하나", "김도윤", "이서아", "박지호", "최하린", "정우진", "한예린", "오시우", "윤채원", "강민재"];
const VO6_SPOTS = [[95, 70], [205, 150], [330, 60], [470, 120], [585, 70], [700, 150], [60, 245], [250, 300], [430, 235], [560, 300], [700, 260], [345, 370]];
function vo6Rnd(n) { return 1 + Math.floor(Math.random() * n); }
function vo6Hunt(body, api, opt) {
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
  const checkWrap = h("div", { style: "display:none" }, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); let score = 0; const ans = picked.map(nt => nt.inp.value || "-").join(",");
    picked.forEach(nt => { const ok = vo6Num(nt.inp.value) === vo6Vol(nt.d); nt.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (ok) score++; });
    if (score < picked.length) return api.fail(`쪽지 ${picked.length}장 중 ${score}장을 바르게 구했어요. 빨간 칸을 (가로) × (세로) × (높이)로 다시 계산해 봐요. 계산기를 써도 돼요.`, ans);
    api.done(ans, `${picked.map(nt => nt.name).join(", ")}에게 찾아가 확인하니 모두 정답! 부피를 바르게 구한 쪽지 ${score}장 → ${score}점을 얻었어요.`);
  } }, "쪽지 주인에게 확인하기")));
  area.style.display = "none";
  area.append(svg, h("div", { class: "vo6btns" }, doneB), h("p", { class: "vo6small" }, "교실 곳곳에 친구들이 붙인 노란 붙임쪽지가 있어요. 눌러서 3장까지 찾아요."));
  api.provide({ words: ["(가로) × (세로) × (높이)", "부피 cm³"], answers: [] });
  body.append(h("div", { class: "vo6btns" }, start), clock, area, list, checkWrap);
}

/* ---------- 내 쪽지 만들기 → 친구가 구한 답 확인하기 ---------- */
function vo6Notes(body, api, opt) {
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
    out.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const ans = pick.map(p => p == null ? "-" : ["정답", "틀림"][p]).join(",");
      if (pick.some(p => p == null)) return api.fail("세 쪽지 모두 확인해 주세요.", ans);
      const bad = pick.findIndex((p, i) => (p === 0) !== (res[i] === vo6Vol(D[i])));
      if (bad >= 0) return api.fail(`${bad + 1}장의 부피를 (가로) × (세로) × (높이)로 직접 계산해서 친구의 답과 견주어 봐요.`, ans);
      api.done(ans, `잘 확인했어요. ${wrongAt + 1}장은 ${D[wrongAt].join(" × ")} = ${vo6Vol(D[wrongAt])}(cm³)인데 친구가 잘못 구했어요. ${vo6Jo(friend, "이/가")} 얻은 점수는 2점이에요.`);
    } }, "확인 끝")));
    vo6Go(out);
  } }, "쪽지 붙이기");
  api.provide({ words: ["1부터 20까지의 자연수", "서로 다른 크기"], answers: [] });
  body.append(h("div", { class: "actions" }, put), out);
}

/* ---------- 또 다른 놀이: 종이 3장 뒤집기 (컴퓨터 친구와 둘이) ---------- */
function vo6Cards(body, api, opt) {
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
    tables.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const ans = ins.map(i => i.value || "-").join(",") + " / " + (sumIn.value || "-");
      let bad = false; mine.forEach((d, i) => { const ok = vo6Num(ins[i].value) === vo6Vol(d); ins[i].style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok) bad = true; });
      if (bad) return api.fail("빨간 칸의 부피를 (가로) × (세로) × (높이)로 다시 구해 봐요.", ans);
      const ms = mine.reduce((t, d) => t + vo6Vol(d), 0);
      if (vo6Num(sumIn.value) !== ms) { sumIn.style.borderColor = "var(--no)"; return api.fail("부피를 모두 더해 합계를 다시 구해 봐요.", ans); }
      sumIn.style.borderColor = "var(--ok)";
      api.done(ans, `내 부피의 합은 ${ms} cm³, 컴퓨터 친구의 부피의 합은 ${hs} cm³예요. ` + (ms > hs ? "내가 이겼어요!" : ms < hs ? "컴퓨터 친구가 이겼어요. 그래도 부피를 모두 바르게 구했어요!" : "비겼어요!"));
    } }, "기록표 확인하기")));
    vo6Go(tables);
  }
  api.provide({ words: ["가로, 세로, 높이가 모두 있으면 가져와요", "부피의 합"], answers: [] });
  info.textContent = "내 차례예요. 종이 3장을 골라 뒤집어요.";
  body.append(info, grid, log, tables, h("p", { class: "vo6small" }, `※ 앱에서는 종이를 ${per * 3}장(가로·세로·높이 ${per}장씩)으로 줄였어요. 수는 1부터 20까지의 자연수예요.`));
  show();
}
//@@LESSONS
const UNIT_STORY = { title: "유찬이의 자원봉사 센터", lines: [
  "유찬이는 자원봉사 센터에 봉사 활동을 갔어요. 자원봉사 센터는 도움이 필요한 이웃에게 생필품과 식료품을 전달하는 곳이에요. 유찬이는 생필품을 담을 상자의 부피를 비교하기도 하고, 식료품을 담은 상자를 포장하기도 했어요.",
  "유찬이와 함께 상자의 부피를 비교하고, 쌓기나무를 쌓아 직육면체의 부피를 구하고, 1 cm³와 1 m³의 관계를 알아보고, 상자를 포장하며 직육면체의 겉넓이를 구해 봐요.",
  "교과서 「수학 6-1」 6. 직육면체의 부피와 겉넓이의 차시 순서 그대로 만들었어요."],
  one: "직육면체의 부피와 겉넓이 · 자원봉사 센터에서 상자의 부피를 비교하고, 부피와 겉넓이를 구해 봐요." };
const UNIT_KEYWORDS = ["부피", "1 cm³(1 세제곱센티미터)", "1 m³(1 세제곱미터)", "1 m³ = 1000000 cm³", "쌓기나무", "가로", "세로", "높이", "한 밑면의 넓이", "(가로) × (세로) × (높이)", "정육면체", "겉넓이", "여섯 면의 넓이의 합", "평행한 두 면", "옆면", "전개도"];

/* ---- 그림의 수(지도서에 없는 것은 지도서의 개수·답이 그대로 나오도록 이 앱이 정함) ---- */
const VO6_D = {
  boxA: [8, 2, 2], boxB: [2, 3, 4], eraser: [2, 2, 1],     // 2차시: 가 = 쌓기나무 32개 = 지우개 8개, 나 = 쌓기나무 24개, 맞대면 한 길이(2)만 같음
  l3a: [4, 3, 3], l3b: [5, 4, 2],                            // 3~4차시 활동 1: 한 층 12개씩 3층 = 36, 한 층 20개씩 2층 = 40
  ex11a: [5, 2, 2], ex11b: [3, 3, 2],                        // 11차시 1번: 가 20개, 나 18개
  pkg: [8, 5, 3]                                             // 9차시 장식용 고리 상자
};
(function () {   // 지도서 수와 맞는지 확인(맞지 않으면 콘솔에 알림)
  const t = (c, m) => { if (!c) console.error("[u6-volume 수 확인] " + m); };
  t(vo6Vol(VO6_D.boxA) === 32 && vo6Vol(VO6_D.boxB) === 24 && vo6Slots(VO6_D.boxA, VO6_D.eraser).out.length === 8, "2차시 상자");
  t(vo6Vol(VO6_D.l3a) === 36 && VO6_D.l3a[0] * VO6_D.l3a[1] === 12 && vo6Vol(VO6_D.l3b) === 40 && VO6_D.l3b[0] * VO6_D.l3b[1] === 20, "3~4차시 상자");
  t(vo6Vol(VO6_D.ex11a) === 20 && vo6Vol(VO6_D.ex11b) === 18, "11차시 1번");
  t(vo6Surf([5, 2, 3]) === 62 && vo6Surf([3, 5, 8]) === 158 && vo6Surf([12, 25, 15]) === 1710 && vo6Surf([6, 30, 30]) === 2520, "겉넓이");
  t(vo6Surf(vo6PackD(VO6_D.pkg, [1, 1, 4])) === 392 && vo6Surf(vo6PackD(VO6_D.pkg, [1, 2, 2])) === 376 && vo6Surf(vo6PackD(VO6_D.pkg, [2, 2, 2])) === 632 && vo6Surf(vo6PackD(VO6_D.pkg, [2, 1, 4])) === 664, "9차시");
  t(vo6Surf([10, 3, 2]) === 112 && vo6Surf([4, 4, 6]) === 128 && vo6Surf([9, 5, 2]) === 146, "11차시");
})();
/* 9차시 도전: 상자 8개로 632 cm²보다 적게 — 모든 쌓기 방법을 따져 보면 1×2×4(592 cm²) 하나뿐 */
const VO6_P8 = (() => { const out = []; for (let a = 1; a <= 8; a++) for (let b = 1; b <= 8; b++) for (let c = 1; c <= 8; c++) if (a * b * c === 8) out.push({ n: [a, b, c], s: vo6Surf(vo6PackD(VO6_D.pkg, [a, b, c])) }); return out; })();
const vo6DimTxt = D => `가로 ${D[0]} cm, 세로 ${D[1]} cm, 높이 ${D[2]} cm`;

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 자원봉사 센터에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 직육면체의 부피와 겉넓이가 필요한 때는 언제일까요?",
  summary: "부피는 어떤 물건이 공간에서 차지하는 크기예요. 상자에 물건을 더 많이 담으려면 부피를, 상자를 포장하려면 겉면의 넓이를 알아야 해요. 이 단원에서는 직육면체의 부피와 겉넓이를 구하는 방법을 알아봐요.",
  steps: [
    { name: "살펴보기", inst: "“‘되로 주고 말로 받는다’는 속담 들어 봤니?” “‘되’는 곡식을 담아 분량을 재는 직육면체 모양의 그릇이고, ‘말’은 열 되가 들어가게 만든 그릇이야.” 되로 쌀을 퍼서 말에 부어 보세요.", hints: ["단추를 누를 때마다 되로 한 번씩 부어요.", "말에는 열 되가 들어가요."],
      words: ["되", "말", "열 되"],
      render: (b, a) => vo6Pour(b, a, { ask: [
        { q: "말을 가득 채우려면 되로 몇 번 부어야 하나요?", parts: [{ n: 10, why: { "1": "되로 한 번 부으면 말이 조금만 차요. 가득 찰 때까지 센 횟수를 써요." } }, "번"] },
        { q: "‘되’는 어떤 모양의 그릇인가요?", parts: [{ o: ["직육면체", "원기둥", "구"], a: 0 }, " 모양의 그릇이에요."] },
        { q: "‘되로 주고 말로 받는다’는 어떤 뜻일까요?", parts: [{ o: ["조금 주고 그보다 훨씬 많이 받는다", "준 만큼만 똑같이 받는다", "많이 주고 조금 받는다"], a: 0 }] }],
        ok: "말은 되보다 열 배 크게 만든 그릇이에요. 그럼 한 되의 부피는 얼마만큼일까요? 이 단원에서 부피를 나타내는 방법을 배워요." }) },
    { name: "이야기 보기", inst: "유찬이는 자원봉사 센터에 봉사 활동을 갔어요. 자원봉사 센터는 도움이 필요한 이웃에게 생필품과 식료품을 전달하는 곳이에요. 유찬이는 생필품을 담을 상자의 부피를 비교하기도 하고, 식료품을 담은 상자를 포장하기도 했어요.", hints: ["그림에서 유찬이가 상자로 한 일을 떠올려요.", "생필품을 상자에 넣고, 드론으로 상자를 전달했어요."],
      render: (b, a) => quiz(b, a, [
        { q: "자원봉사 센터에서 유찬이가 한 일을 모두 골라 보세요.", fig: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Solid({ d: [5, 4, 3], W: 120, maxW: "8em", plain: true, tint: { top: "#E9D3AE", front: "#C9A16B", right: "#A9824E" } }), "생필품 상자"), vo6Fr(vo6Solid({ d: [4, 3, 3], W: 110, maxW: "7em", plain: true, tint: { top: "#CFE5FA", front: "#8DBDEB", right: "#5C97D0" } }), "식료품 상자")),
          o: ["생필품을 담을 상자의 부피 비교하기", "생필품 상자를 드론으로 전달하기", "식료품을 담은 상자를 포장하기", "화분에 물 주기"], a: [0, 1, 2], why: { "0,1,2,3": "화분에 물 주기는 이야기에 나오지 않았어요." } },
        { q: "상자를 포장할 때 포장지가 얼마나 필요한지 알려면 무엇을 알아야 할까요?", o: ["상자 겉면의 넓이", "상자의 무게", "상자의 색깔"], a: 0 }],
        { ok: "상자에 물건을 담을 때는 부피를, 상자를 포장할 때는 겉면의 넓이를 생각해요." }) },
    { name: "배울 내용", inst: "“직육면체의 부피와 겉넓이는 어떻게 구할 수 있을까요?” 책장을 넘겨 이 단원에서 배울 내용을 모두 골라 붙임딱지를 붙여 보세요.", hints: ["단원 이름은 ‘직육면체의 부피와 겉넓이’예요.", "직육면체의 전개도는 5학년 2학기에 배웠어요."],
      render: (b, a) => quiz(b, a, [{ q: "배울 내용 붙임딱지를 골라 보세요.", o: ["직육면체의 부피 비교하기", "1 cm³ 알아보기", "직육면체의 부피를 구하는 방법", "1 m³ 알아보기", "직육면체의 겉넓이를 구하는 방법", "직육면체의 전개도 처음 알아보기", "원의 넓이 구하기"], a: [0, 1, 2, 3, 4],
        why: { "0,1,2,3,4,5": "직육면체의 전개도는 5학년 때 배운 내용이에요. 이 단원에서는 전개도를 이용해서 겉넓이를 구해요.", "0,1,2,3,4,6": "원의 넓이는 이 단원에서 배우는 내용이 아니에요." } }],
        { ok: "부피 비교 → 1 cm³ → 직육면체의 부피 → 1 m³ → 직육면체의 겉넓이 차례로 배워요." }) },
    { name: "떠올리기 ①", inst: "배운 내용을 떠올려 보세요. (5학년 1학기 ― 직사각형의 넓이, 1 cm²와 1 m²의 관계)", hints: ["(직사각형의 넓이) = (가로) × (세로)", "1 m = 100 cm이니까 1 m² 안에는 1 cm²가 100 × 100개 들어가요."],
      render: (b, a) => vo6Ask(b, a, [
        { q: "직사각형의 넓이는 몇 cm²인가요?", fig: () => vo6Fig(260, 150, s => { s.append(svgEl("rect", { x: 40, y: 20, width: 176, height: 100, fill: "#FFE9C4", stroke: VO6.ink, "stroke-width": 2.5 })); s.append(txt(128, 136, "8 cm", 15, { fill: VO6.blue }), txt(232, 70, "5 cm", 15, { fill: VO6.blue })); }, "14em"),
          parts: [{ n: 40, why: { "13": "가로와 세로를 더했어요. 넓이는 (가로) × (세로)로 구해요.", "26": "26은 둘레예요. 넓이는 (가로) × (세로)로 구해요." } }, " cm²"] },
        { q: "1 m²는 몇 cm²인가요?", parts: ["1 m² = ", { n: 10000, why: { "100": "1 m = 100 cm예요. 1 m²는 한 변이 100 cm인 정사각형의 넓이니까 100 × 100을 해요." } }, " cm²"] }],
        { ok: "(직사각형의 넓이) = (가로) × (세로), 1 m² = 10000 cm²예요. 이 단원에서 넓이 단위와 부피 단위를 견주어 봐요." }) },
    { name: "떠올리기 ②", inst: "배운 내용을 떠올려 보세요. (5학년 2학기 ― 직육면체의 전개도)", hints: ["직육면체에는 직사각형 모양의 면이 6개 있어요.", "서로 마주 보는 면은 평행하고 모양과 크기가 같아요."],
      render: (b, a) => vo6Ask(b, a, [
        { q: "직육면체와 그 전개도예요.", fig: () => h("div", { class: "vo6row" }, h("div", {}, vo6NetSvg([5, 2, 3], "cm", { maxW: "18em" })), h("div", { style: "flex:0 1 11em" }, vo6Cub([5, 2, 3], "cm", { maxW: "11em", W: 160 }))),
          parts: ["직육면체의 면은 모두 ", { n: 6 }, "개이고, 서로 평행한 면은 ", { n: 3, why: { "6": "평행한 면은 두 면이 한 쌍이에요. 6개의 면이 몇 쌍인지 세어요." } }, "쌍이에요. 평행한 두 면은 모양과 크기가 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
        { ok: "직육면체는 직사각형 6개로 둘러싸여 있고, 평행한 면 3쌍은 모양과 크기가 같아요." }) }
  ],
  challenge: { inst: "유찬이가 생필품을 담을 상자 두 개를 골랐어요. 상자 가는 가로 4 cm, 세로 3 cm, 높이 5 cm, 상자 나는 가로 4 cm, 세로 3 cm, 높이 2 cm예요. 부피가 더 큰 상자는 어느 것일까요?", hints: ["두 상자의 가로와 세로가 같아요.", "가로와 세로가 같으면 높이가 높은 상자가 더 많이 담을 수 있어요."],
    render: (b, a) => vo6Ask(b, a, [{ fig: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([4, 3, 5], "cm", { s: 22 }), "가"), vo6Fr(vo6Cub([4, 3, 2], "cm", { s: 22 }), "나")),
      parts: ["두 상자는 ", { o: ["가로와 세로", "세로와 높이", "가로와 높이"], a: 0 }, "가 같으니까 높이가 더 높은 상자 ", { o: ["가", "나"], a: 0 }, "의 부피가 더 커요."] }],
      { ok: "가로·세로·높이 중 두 길이가 같으면 나머지 길이를 견주어 부피를 비교할 수 있어요. 그렇지 않으면 어떻게 비교할까요? 다음 차시에 알아봐요." }) }
},
{
  id: "t2", no: 2, title: "1 cm³를 알아볼까요", soop: "개념 구축하기(O)",
  question: "직육면체의 부피를 어떻게 비교할 수 있을까요? 부피의 단위는 무엇일까요?",
  summary: "부피는 어떤 물건이 공간에서 차지하는 크기예요. 면끼리 맞대어 비교하기 어려운 상자는 모양과 크기가 같은 물건으로 똑같이 쌓아 그 수를 세어 비교해요. 사용하는 물건에 따라 개수가 달라지므로 한 가지 단위를 써요. 한 모서리의 길이가 1 cm인 정육면체의 부피를 1 cm³라 쓰고, 1 세제곱센티미터라고 읽어요.",
  steps: [
    { name: "맞대어 보기", inst: "직육면체 모양 상자에 생필품을 담아 이웃에게 전달하려고 해요. 유찬이는 크기가 다른 두 상자를 보며 “생필품을 더 많이 담으려면 어떤 상자를 골라야 할까?” 하고 생각했어요. “부피가 더 큰 상자를 고르면 돼. 부피는 어떤 물건이 공간에서 차지하는 크기를 말해.” 두 상자 가와 나의 면끼리 여러 가지로 맞대어 보세요.", hints: ["가의 면과 나의 면을 하나씩 골라 맞대 보세요. ‘나를 돌려서 대기’도 눌러 보세요.", "두 면을 맞대었을 때 가로, 세로, 높이 중 몇 개의 길이가 같은지 살펴봐요."],
      render: (b, a) => { b.append(vo6Redrawn("상자 가·나의 크기는 지도서의 개수(가 쌓기나무 32개, 나 쌓기나무 24개)가 그대로 나오도록 이 앱이 정했어요."));
        vo6Touch(b, a, { A: VO6_D.boxA, B: VO6_D.boxB, need: 4, ask: [
          { q: "두 상자를 맞대었을 때 어떤가요?", parts: ["가로, 세로, 높이 중에서 ", { o: ["하나의 길이만 같으므로", "세 길이가 모두 같으므로", "두 길이가 같으므로"], a: 0 }, " 부피를 비교하기 ", { o: ["어려워요", "쉬워요"], a: 0 }, "."] },
          { q: "맞대어 비교하기 어려운 상자의 부피는 어떻게 비교하면 좋을까요?", parts: [{ o: ["모양과 크기가 같은 물건으로 상자와 똑같이 쌓아 그 수를 세어 비교해요.", "상자의 색깔을 비교해요.", "상자 한 면의 넓이만 비교해요."], a: 0 }] }],
          ok: "면끼리 맞대어도 하나의 길이만 같으면 부피를 비교하기 어려워요. 모양과 크기가 같은 물건을 쌓아 그 수를 세어 비교해 봐요." }); } },
    { name: "쌓아 보기", inst: "채린이와 하진이가 두 상자 가와 나의 부피와 똑같이 물건을 쌓아 부피를 비교했어요. 상자 안을 빈틈없이 채우며 따라 해 보세요.", hints: ["‘한 줄 채우기’, ‘한 층 채우기’로 빨리 채울 수 있어요.", "채린이는 가를 지우개로, 나를 쌓기나무로 채웠어요."],
      render: (b, a) => vo6Chain(b, a, [
        { title: "① 채린: “가는 지우개로 똑같이 쌓아 비교했어.”", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6_D.boxA, unit: VO6_D.eraser, name: "지우개", col: VO6.er, noLayer: false,
          ask: [{ parts: ["가는 지우개 ", { n: 8 }, "개예요."] }] }) },
        { title: "② 채린: “나는 쌓기나무로 똑같이 쌓아 비교했어.”", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6_D.boxB, name: "쌓기나무", W: 150, maxW: "11em",
          ask: [{ parts: ["나는 쌓기나무 ", { n: 24 }, "개예요."] }] }) },
        { title: "③ 하진: “가와 나 모두 쌓기나무로 똑같이 쌓아 비교했어.” 가를 쌓기나무로 채워 보세요.", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6_D.boxA, name: "쌓기나무",
          ask: [{ parts: ["가는 쌓기나무 ", { n: 32 }, "개, 나는 쌓기나무 ", { n: 24 }, "개예요."] }],
          ok: "채린: 가 = 지우개 8개, 나 = 쌓기나무 24개 / 하진: 가 = 쌓기나무 32개, 나 = 쌓기나무 24개예요." }) }]) },
    { name: "말해 보기", inst: "채린이와 하진이의 방법을 견주어 이야기해 보세요.", hints: ["채린이는 서로 다른 물건(지우개, 쌓기나무)으로 쌓았어요.", "모양과 크기가 같은 물건으로 쌓아야 그 수로 비교할 수 있어요."],
      render: (b, a) => vo6Ask(b, a, [
        { q: "부피를 비교할 수 있는 방법을 사용한 사람은 누구인가요?", parts: [{ o: ["채린", "하진"], a: 1, why: { "0": "채린이는 지우개와 쌓기나무처럼 서로 다른 물건으로 쌓아서, 8개와 24개를 그대로 비교할 수 없어요." } }, " ― 모양과 크기가 ", { o: ["같은", "다른"], a: 0 }, " 물건으로 쌓았기 때문이에요."] },
        { q: "하진이의 방법으로 부피를 비교해 보세요.", parts: ["32 ", { o: [">", "=", "<"], a: 0 }, " 24이므로 ", { o: ["가", "나"], a: 0, why: { "1": "가는 쌓기나무 32개, 나는 24개예요. 개수가 많은 쪽이 부피가 더 커요." } }, "의 부피가 더 커요."] },
        { q: "여러 가지 물건으로 부피를 비교할 때 불편한 점과 해결 방법은 무엇일까요?", parts: ["부피가 같은 상자여도 사용하는 물건에 따라 부피를 나타내는 개수가 ", { o: ["달라져요", "같아요"], a: 0 }, ". 그래서 ", { o: ["한 가지 단위", "여러 가지 물건"], a: 0 }, "를 사용하여 부피를 비교해야 해요."] }],
        { ok: "모양과 크기가 같은 물건으로 세어야 비교할 수 있어요. 누구나 같은 단위를 쓰면 편리해요." }) },
    { name: "약속하기", inst: "부피의 단위를 약속해 보세요.", hints: ["넓이의 단위 1 cm²는 한 변의 길이가 1 cm인 정사각형의 넓이였어요.", "부피의 단위는 한 모서리의 길이가 1 cm인 정육면체의 부피예요."],
      render: (b, a) => { b.append(h("div", { class: "vo6figs" }, vo6Fr(vo6Solid({ d: [1, 1, 1], s: 80, labels: { a: "1 cm", b: "1 cm", c: "1 cm" }, maxW: "11em", tint: { top: VO6.cube[0], front: VO6.cube[1], right: VO6.cube[2] } }), "1 cm³")));
        blanks(b, a, ["부피의 단위로 한 모서리의 길이가 ", { o: ["1 cm", "1 m", "10 cm"], a: 0 }, "인 ", { o: ["정육면체", "정사각형", "직사각형"], a: 0 }, "의 부피를 사용할 수 있어요. 한 모서리의 길이가 1 cm인 정육면체의 부피를 ", { o: ["1 cm³", "1 cm²", "1 cm"], a: 0 }, "라 쓰고, ", { o: ["1 세제곱센티미터", "1 제곱센티미터", "1 센티미터"], a: 0 }, "라고 읽어요."],
          { ok: "한 모서리의 길이가 1 cm인 정육면체의 부피를 1 cm³라 쓰고, 1 세제곱센티미터라고 읽어요." }); } },
    { name: "확인하기", inst: "우리 주변에서 부피가 1 cm³와 비슷한 물건을 찾아 이야기해 보세요. “주사위의 부피는 약 1 cm³야.”", hints: ["1 cm³는 한 모서리가 1 cm인 아주 작은 정육면체예요.", "손가락 끝마디 정도의 크기를 떠올려요."],
      render: (b, a) => quiz(b, a, [
        { q: "부피가 1 cm³와 비슷한 물건을 모두 골라 보세요.", o: ["보드게임의 작은 주사위", "공깃돌", "캐러멜", "냉장고", "택배 상자", "수학 교과서"], a: [0, 1, 2], why: { "0,1,2,3": "냉장고는 1 cm³보다 훨씬 커요.", "0,1,2,4": "택배 상자는 1 cm³보다 훨씬 커요.", "0,1,2,5": "교과서는 1 cm³보다 훨씬 커요." } },
        { q: "두 상자에 같은 정육면체 주사위를 빈틈없이 넣었더니 가에는 20개, 나에는 24개가 들어갔어요. 부피가 더 큰 상자는 어느 것인가요?", o: ["가", "나"], a: 1, why: { "0": "같은 주사위로 세었으니 개수가 많은 쪽이 부피가 더 커요. 24 > 20이에요." } }],
        { ok: "작은 주사위, 공깃돌, 캐러멜의 부피는 약 1 cm³예요. 같은 물건으로 세면 개수가 많은 쪽이 부피가 더 커요." }) }
  ],
  challenge: { inst: "같은 직육면체 지우개를 쌓아 가, 나, 다를 만들었어요. 부피가 같은 두 개를 찾고, 규민이와 나현이의 말도 살펴보세요. (수학익힘 유사 문제)", hints: ["같은 지우개로 쌓았으니 지우개의 개수를 세어 비교해요.", "과자 상자와 퍼즐은 모양과 크기가 같은 물건일까요?"],
    render: (b, a) => { const er = (n) => vo6Slots(n, VO6_D.eraser).out.map(k => Object.assign({ c: VO6.er }, k));
      const F = { 가: [6, 2, 2], 나: [4, 2, 4], 다: [2, 6, 2] };
      vo6Chain(b, a, [
        (bx, ax) => vo6Ask(bx, ax, [{ fig: () => h("div", { class: "vo6figs" }, ...Object.keys(F).map(k => vo6Fr(vo6Solid({ d: F[k], mode: "none", blocks: er(F[k]), s: 15, frame: [6, 6, 4], maxW: "9em", plain: true }), k))),
          parts: ["지우개는 가 ", { n: vo6Slots(F.가, VO6_D.eraser).out.length }, "개, 나 ", { n: vo6Slots(F.나, VO6_D.eraser).out.length }, "개, 다 ", { n: vo6Slots(F.다, VO6_D.eraser).out.length }, "개예요. 부피가 같은 두 개는 ", { o: ["가, 나", "가, 다", "나, 다"], a: 1 }, "예요."] }],
          { ok: "가와 다는 모양은 달라도 같은 지우개가 6개씩이라 부피가 같아요." }),
        (bx, ax) => { bx.append(h("div", { class: "vo6box" }, "규민: “크기가 같은 직육면체 모양의 과자 상자 10개를 쌓아 만들었어.” 나현: “크기가 같은 정육면체 모양의 퍼즐 8개를 쌓아 만들었어.”"));
          vo6Ask(bx, ax, [{ q: "규민이가 만든 것의 부피가 더 크다고 말할 수 있나요?", parts: [{ o: ["말할 수 있어요. 10 > 8이니까요.", "말할 수 없어요. 과자 상자와 퍼즐의 모양과 크기가 다를 수 있어서 두 물건의 수로 부피를 비교할 수 없어요."], a: 1, why: { "0": "과자 상자 한 개와 퍼즐 한 개의 크기가 같은지 알 수 없어요. 서로 다른 물건의 개수는 그대로 비교할 수 없어요." } }] }],
            { ok: "모양과 크기가 다를 수 있는 물건의 개수로는 부피를 비교할 수 없어요. 그래서 1 cm³ 같은 한 가지 단위를 써요." }); }]); } }
},
{
  id: "t34", no: "3~4", title: "직육면체의 부피를 구하는 방법을 알아볼까요", soop: "개념 구축하기(O)",
  question: "직육면체의 부피를 어떻게 구할 수 있을까요?",
  summary: "직육면체의 부피는 부피가 1 cm³인 쌓기나무가 몇 개 들어가는지로 구해요. 가로(세로, 높이)가 2배, 3배가 되면 부피도 2배, 3배가 돼요. (직육면체의 부피) = (가로) × (세로) × (높이) = (한 밑면의 넓이) × (높이)이고, (정육면체의 부피) = (한 모서리의 길이) × (한 모서리의 길이) × (한 모서리의 길이)예요.",
  steps: [
    { name: "만져 보기", inst: "생필품을 담은 직육면체 모양 상자를 드론으로 운반하려고 해요. 상자의 부피를 구하려면 부피가 1 cm³인 쌓기나무를 상자와 같은 크기로 쌓아 그 수를 세면 돼요. 두 상자에 쌓기나무를 채워 보세요.", hints: ["‘한 층 채우기’를 누르면 한 층에 몇 개씩인지 알 수 있어요.", "한 층의 수를 센 다음 몇 층인지 세면 빨리 셀 수 있어요."],
      render: (b, a) => vo6Chain(b, a, [
        { title: "① 첫째 상자", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6_D.l3a, ask: [{ parts: ["한 층에 ", { n: 12 }, "개씩 ", { n: 3 }, "층이니까 쌓기나무는 ", { n: 36 }, "개, 부피는 ", { n: 36 }, " cm³예요."] }] }) },
        { title: "② 둘째 상자", run: (bx, ax) => vo6Fill(bx, ax, { box: VO6_D.l3b, ask: [{ parts: ["한 층에 ", { n: 20 }, "개씩 ", { n: 2 }, "층이니까 쌓기나무는 ", { n: 40 }, "개, 부피는 ", { n: 40 }, " cm³예요."] },
          { q: "쌓기나무를 어떻게 세었나요?", parts: [{ o: ["한 층의 수를 세고, 몇 층인지 세었어요.", "색깔별로 세었어요."], a: 0 }] }],
          ok: "한 층의 쌓기나무 수와 층수로 셀 수 있어요. 한 층의 수는 가로와 세로에, 층수는 높이에 따라 달라져요." }) }]) },
    { name: "늘려 보기", inst: "쌓기나무로 가로, 세로, 높이의 변화에 따른 부피의 변화를 살펴보세요.", hints: ["＋ 단추를 누르면 그 방향으로 한 줄씩 늘어나요.", "쌓기나무 수가 몇 배가 되는지 살펴봐요."],
      render: (b, a) => vo6Chain(b, a, [
        { title: "① 1 cm³ 직육면체(쌓기나무 1개)의 가로를 2배, 3배로 늘려 보세요.", run: (bx, ax) => vo6Dims(bx, ax, { start: [1, 1, 1], max: [3, 3, 3], lock: [false, true, true], check: d => d[0] === 3 ? null : "가로를 3배(쌓기나무 3개)까지 늘려 보세요.", msg: "가로를 3배까지 늘렸어요.",
          ask: [{ parts: ["가로가 2배이면 ", { n: 2 }, " cm³, 3배이면 ", { n: 3 }, " cm³ ― 부피도 2배, 3배가 돼요."] }] }) },
        { title: "② 2 cm³ 직육면체의 세로를 2배, 3배로 늘려 보세요.", run: (bx, ax) => vo6Dims(bx, ax, { start: [2, 1, 1], max: [3, 3, 3], lock: [true, false, true], check: d => d[1] === 3 ? null : "세로를 3배(3줄)까지 늘려 보세요.", msg: "세로를 3배까지 늘렸어요.",
          ask: [{ parts: ["세로가 2배이면 ", { n: 4 }, " cm³, 3배이면 ", { n: 6 }, " cm³ ― 부피도 2배, 3배가 돼요."] }] }) },
        { title: "③ 4 cm³ 직육면체의 높이를 2배, 3배로 늘려 보세요.", run: (bx, ax) => vo6Dims(bx, ax, { start: [2, 2, 1], max: [3, 3, 3], lock: [true, true, false], check: d => d[2] === 3 ? null : "높이를 3배(3층)까지 늘려 보세요.", msg: "높이를 3배까지 늘렸어요.",
          ask: [{ parts: ["높이가 2배이면 ", { n: 8 }, " cm³, 3배이면 ", { n: 12 }, " cm³ ― 부피도 2배, 3배가 돼요."] }] }) },
        { title: "④ 1 cm³ 직육면체의 가로, 세로, 높이를 각각 2배로 늘려 보세요.", run: (bx, ax) => vo6Dims(bx, ax, { start: [1, 1, 1], max: [3, 3, 3], check: d => d.join() === "2,2,2" ? null : "가로, 세로, 높이를 모두 2(쌓기나무 2개 길이)로 만들어 보세요.", msg: "가로, 세로, 높이를 모두 2배로 늘렸어요.",
          ask: [{ parts: ["쌓기나무는 ", { n: 8 }, "개, 부피는 ", { n: 8 }, " cm³로, 처음 부피의 ", { n: 8, why: { "2": "가로, 세로, 높이가 모두 2배가 되었어요. 2 × 2 × 2를 생각해 봐요.", "6": "2배를 세 번 했으니 2 + 2 + 2가 아니라 2 × 2 × 2예요." } }, "배가 되었어요."] }],
          ok: "가로, 세로, 높이가 각각 2배가 되면 부피는 2 × 2 × 2 = 8(배)가 돼요." }) }]) },
    { name: "말해 보기", inst: "가로, 세로, 높이와 부피 사이의 관계를 말해 보세요.", hints: ["가로를 2배로 하면 쌓기나무도 2배가 되었어요.", "세로와 높이도 마찬가지였어요."],
      render: (b, a) => blanks(b, a, ["직육면체의 가로(세로, 높이)가 2배, 3배가 되면 부피도 ", { o: ["2배, 3배", "4배, 9배", "변하지 않아"], a: 0 }, "가 돼요. 그래서 직육면체의 부피는 ", { o: ["가로, 세로, 높이", "색깔과 무게", "모서리의 수"], a: 0 }, "와 관계가 있어요."],
        { ok: "부피는 가로, 세로, 높이와 관계가 있어요. 가로(세로, 높이)가 2배, 3배가 되면 부피도 2배, 3배가 돼요." }) },
    { name: "약속하기", inst: "가로 6 cm, 세로 4 cm, 높이 5 cm인 직육면체의 부피를 구하는 방법을 알아보세요. 쌓기나무로 똑같이 쌓아 보세요.", hints: ["가로 방향에 6개, 세로 방향에 4개, 높이 방향에 5개를 쌓아요.", "한 층에 6 × 4 = 24(개)씩 5층이에요."],
      words: ["가로", "세로", "높이", "한 밑면의 넓이"],
      render: (b, a) => vo6Dims(b, a, { start: [1, 1, 1], max: [8, 6, 7], show: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([6, 4, 5], "cm", { s: 20 }), "만들 직육면체")),
        check: d => d.join() === "6,4,5" ? null : `가로 6개, 세로 4개, 높이 5개가 되게 쌓아요. 지금은 가로 ${d[0]}개, 세로 ${d[1]}개, 높이 ${d[2]}개예요.`, hideCount: true, msg: "가로 6 cm, 세로 4 cm, 높이 5 cm인 직육면체를 쌓았어요.",
        then: (bx, ax) => vo6Chain(bx, ax, [
          (cx, cy) => vo6Ask(cx, cy, [{ parts: ["가로, 세로, 높이 방향의 쌓기나무는 ", { n: 6 }, "개, ", { n: 4 }, "개, ", { n: 5 }, "개예요. 필요한 쌓기나무는 6 × 4 × 5 = ", { n: 120, why: { "15": "6 + 4 + 5는 더한 것이에요. 곱해야 쌓기나무 수가 나와요.", "24": "24개는 한 층의 수예요. 5층이니까 5를 곱해요." } }, "(개)이므로 부피는 ", { n: 120 }, " cm³예요."] }]),
          (cx, cy) => blanks(cx, cy, ["(직육면체의 부피) = (", { o: ["가로", "둘레"], a: 0 }, ") × (", { o: ["세로", "높이"], a: 0 }, ") × (", { o: ["높이", "가로"], a: 0 }, ") = (한 밑면의 넓이) × (", { o: ["높이", "가로"], a: 0 }, ")"],
            { ok: "(직육면체의 부피) = (가로) × (세로) × (높이) = (한 밑면의 넓이) × (높이)예요. 1층 쌓기나무 수가 한 밑면의 넓이, 층수가 높이와 같아요. 가로·세로·높이는 보는 방향에 따라 다르게 정할 수 있어요." })]) }) },
    { name: "정육면체의 부피", inst: "한 모서리의 길이가 5 cm인 정육면체의 부피를 구하는 방법을 알아보세요. 쌓기나무로 똑같이 쌓아 보세요.", hints: ["정육면체는 정사각형 6개로 둘러싸인 입체도형이에요.", "정육면체는 모든 모서리의 길이가 같아요."],
      render: (b, a) => vo6Dims(b, a, { start: [1, 1, 1], max: [6, 6, 6], show: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([5, 5, 5], "cm", { s: 18 }), "한 모서리 5 cm")),
        check: d => d.join() === "5,5,5" ? null : "정육면체는 가로, 세로, 높이가 모두 같아요. 모두 5개가 되게 쌓아요.", hideCount: true, msg: "한 모서리 5 cm인 정육면체를 쌓았어요.",
        then: (bx, ax) => vo6Chain(bx, ax, [
          (cx, cy) => vo6Ask(cx, cy, [{ parts: ["정육면체의 가로, 세로, 높이는 모두 ", { n: 5 }, " cm예요. 부피는 5 × 5 × 5 = ", { n: 125, why: { "15": "5 + 5 + 5는 더한 것이에요. 5를 세 번 곱해요.", "25": "25는 한 면의 넓이예요. 높이 5를 한 번 더 곱해요." } }, "(cm³)예요."] }]),
          (cx, cy) => blanks(cx, cy, ["(정육면체의 부피) = (", { o: ["한 모서리의 길이", "한 면의 넓이"], a: 0 }, ") × (한 모서리의 길이) × (", { o: ["한 모서리의 길이", "6"], a: 0 }, ")"],
            { ok: "(정육면체의 부피) = (한 모서리의 길이) × (한 모서리의 길이) × (한 모서리의 길이)예요." })]) }) },
    { name: "확인하기", inst: "직육면체의 부피는 몇 cm³인지 구해 보세요.", hints: ["(가로) × (세로) × (높이)로 구해요.", "가로, 세로, 높이가 모두 같으면 정육면체로 보고 구해도 돼요."],
      render: (b, a) => vo6Ask(b, a, [
        { fig: () => vo6Cub([10, 9, 7], "cm", { s: 12 }), parts: ["10 × 9 × 7 = ", { n: 630, why: { "26": "더하지 말고 곱해요.", "90": "90은 한 밑면의 넓이예요. 높이 7을 곱해요." } }, " (cm³)"] },
        { fig: () => vo6Cub([8, 8, 8], "cm", { s: 12 }), parts: ["8 × 8 × 8 = ", { n: 512, why: { "24": "더하지 말고 곱해요.", "64": "64는 한 면의 넓이예요. 8을 한 번 더 곱해요." } }, " (cm³)"] },
        { fig: () => vo6Cub([7, 4, 9], "cm", { s: 12 }), parts: ["7 × 4 × 9 = ", { n: 252 }, " (cm³)"] }],
        { ok: "630 cm³, 512 cm³, 252 cm³예요. 한 밑면의 넓이에 높이를 곱해도 돼요(90 × 7 = 630)." }) },
    { name: "문제 만들기", inst: "우리 주변에서 직육면체 모양의 물건을 찾아 부피를 구하는 문제를 만들고, 짝과 바꾸어 해결해 보세요. 보기: “가로가 2 cm, 세로가 7 cm, 높이가 2 cm인 직육면체 모양의 지우개가 있습니다. 이 지우개의 부피는 몇 cm³인가요?”", hints: ["부피를 구하려면 가로, 세로, 높이를 알아야 해요.", "같은 물건인데 친구와 결과가 다르면 잰 길이가 달랐는지 살펴봐요."],
      render: (b, a) => vo6Make(b, a, { kind: "vol", friend: { obj: "필통", d: [20, 6, 5], a: 600, q: "가로가 20 cm, 세로가 6 cm, 높이가 5 cm인 직육면체 모양의 필통이 있습니다. 이 필통의 부피는 몇 cm³인가요?", why: { "31": "더하지 말고 곱해요.", "120": "120은 한 밑면의 넓이예요. 높이 5를 곱해요." } },
        ok: "필통의 부피는 20 × 6 × 5 = 600(cm³)이에요. 주변 물건으로도 부피를 구할 수 있어요." }) }
  ],
  challenge: { inst: "수학익힘 유사 문제를 풀어 보세요.", hints: ["한 밑면의 넓이가 주어지면 (한 밑면의 넓이) × (높이)로 구해요.", "(높이) = (부피) ÷ (한 밑면의 넓이)예요."],
    render: (b, a) => vo6Chain(b, a, [
      (bx, ax) => vo6Ask(bx, ax, [{ q: "부피가 큰 것부터 차례로 기호를 써 보세요. ㉠ 가로 10 cm, 세로 4 cm, 높이 6 cm인 직육면체 ㉡ 한 모서리의 길이가 6 cm인 정육면체 ㉢ 한 밑면의 넓이가 45 cm²이고 높이가 7 cm인 직육면체",
        parts: ["㉠ ", { n: 240 }, " cm³, ㉡ ", { n: 216 }, " cm³, ㉢ ", { n: 315 }, " cm³ → ", { o: ["㉢, ㉠, ㉡", "㉠, ㉡, ㉢", "㉢, ㉡, ㉠"], a: 0 }] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "가로가 12 cm, 세로가 6 cm이고 부피가 360 cm³인 직육면체의 높이는 몇 cm인가요?", parts: ["높이 = 360 ÷ (12 × 6) = ", { n: 5, why: { "30": "360 ÷ 12만 했어요. 한 밑면의 넓이 12 × 6 = 72로 나누어요.", "60": "360 ÷ 6만 했어요. 한 밑면의 넓이 12 × 6 = 72로 나누어요." } }, " (cm)"] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "가로 5 cm, 세로 7 cm, 높이 5 cm인 직육면체의 가로, 세로, 높이를 각각 2배로 늘인 직육면체의 부피는 몇 cm³인가요?", fig: () => vo6Cub([5, 7, 5], "cm", { s: 14 }),
        parts: ["10 × 14 × 10 = ", { n: 1400, why: { "350": "가로, 세로, 높이가 모두 2배이니 처음 부피 175 cm³의 2배가 아니라 8배예요." } }, " (cm³)"] }], { ok: "처음 부피 175 cm³의 8배인 1400 cm³예요." })]) }
},
{
  id: "t56", no: "5~6", title: "1 m³를 알아볼까요", soop: "개념 구축하기(O)",
  question: "큰 직육면체의 부피는 어떤 단위로 나타내면 좋을까요? 1 cm³와 1 m³는 어떤 관계일까요?",
  summary: "큰 부피를 cm³로 나타내면 수가 너무 커서 불편해요. 한 모서리의 길이가 1 m인 정육면체의 부피를 1 m³라 쓰고, 1 세제곱미터라고 읽어요. 1 m = 100 cm이므로 1 m³ 안에는 1 cm³ 쌓기나무가 100 × 100 × 100 = 1000000(개) 들어가요. 1 m³ = 1000000 cm³예요.",
  steps: [
    { name: "생각 깨우기", inst: "기부된 식료품은 직육면체 모양 냉동 보관소에 보관해요. 냉동 보관소는 가로 400 cm, 세로 200 cm, 높이 250 cm예요. “이렇게 큰 냉동 보관소의 부피는 얼마나 될까?” 부피를 cm³로 구해 보세요.", hints: ["(가로) × (세로) × (높이)로 구해요. 계산기를 써도 돼요.", "400 × 200 = 80000, 80000 × 250을 계산해요."],
      render: (b, a) => vo6Ask(b, a, [
        { fig: () => vo6Cub([400, 200, 250], "cm", { W: 220, maxW: "15em" }), parts: ["400 × 200 × 250 = ", { n: 20000000, w: "8em", why: { "850": "더하지 말고 곱해요.", "80000": "80000은 한 밑면의 넓이예요. 높이 250을 곱해요." } }, " (cm³)"] },
        { q: "cm³로 나타내면 어떤 점이 불편한가요?", parts: [{ o: ["큰 수로 나와서 읽기 어렵고 나타내기 불편해요.", "수가 너무 작아서 보이지 않아요.", "불편한 점이 없어요."], a: 0 }] },
        { q: "더 큰 부피의 단위는 어떻게 정하면 좋을까요?", parts: ["길이 cm → m, 넓이 cm² → m²처럼 부피도 ", { o: ["m³", "km", "cm²"], a: 0 }, " 단위를 쓰면 좋아요."] }],
        { ok: "냉동 보관소의 부피는 20000000 cm³예요. 수가 너무 커서 더 큰 단위가 필요해요." }) },
    { name: "약속하기", inst: "1 cm³보다 큰 부피의 단위를 약속해 보세요.", hints: ["1 cm³는 한 모서리의 길이가 1 cm인 정육면체의 부피였어요.", "더 큰 단위는 한 모서리의 길이가 1 m인 정육면체로 정해요."],
      render: (b, a) => { b.append(h("div", { class: "vo6figs" }, vo6Fr(vo6Solid({ d: [1, 1, 1], s: 80, labels: { a: "1 m", b: "1 m", c: "1 m" }, maxW: "11em", tint: { top: "#CFE5FA", front: "#8DBDEB", right: "#5C97D0" } }), "1 m³")));
        blanks(b, a, ["부피의 단위로 한 모서리의 길이가 ", { o: ["1 m", "1 cm", "100 m"], a: 0 }, "인 정육면체의 부피를 사용할 수 있어요. 한 모서리의 길이가 1 m인 정육면체의 부피를 ", { o: ["1 m³", "1 m²", "1 cm³"], a: 0 }, "라 쓰고, ", { o: ["1 세제곱미터", "1 제곱미터", "1 세제곱센티미터"], a: 0 }, "라고 읽어요."],
          { ok: "한 모서리의 길이가 1 m인 정육면체의 부피를 1 m³라 쓰고, 1 세제곱미터라고 읽어요." }); } },
    { name: "어림하기", inst: "모둠별로 신문지를 말아 만든 막대나 수수깡으로 부피가 1 m³인 정육면체를 만들고, 교실의 부피는 약 몇 m³인지 어림해 보세요. 이 앱에서는 교실(가로 9 m, 세로 7 m, 높이 3 m)에 1 m³ 정육면체를 쌓아 봐요.", hints: ["정육면체의 모서리는 12개예요.", "교실 바닥에 한 층을 깔고 몇 층까지 쌓을 수 있는지 생각해요."],
      render: (b, a) => vo6Chain(b, a, [
        (bx, ax) => vo6Ask(bx, ax, [{ q: "1 m³ 정육면체를 만들려면 길이가 1 m인 막대가 몇 개 필요할까요?", fig: () => vo6Solid({ d: [1, 1, 1], s: 70, mode: "box", labels: { a: "1 m" }, maxW: "8em" }), parts: [{ n: 12, why: { "6": "6은 면의 수예요. 막대는 모서리마다 하나씩 필요해요.", "8": "8은 꼭짓점의 수예요. 막대는 모서리마다 하나씩 필요해요." } }, "개"] }]),
        (bx, ax) => vo6Dims(bx, ax, { start: [1, 1, 1], max: [9, 7, 3], room: [9, 7, 3], roomLabels: { a: "9 m", b: "7 m", c: "3 m" }, word: "1 m³ 정육면체", names: ["가로", "세로", "높이"],
          countText: d => `1 m³ 정육면체 ${vo6Vol(d)}개`, tip: "＋, － 단추로 교실 안에 1 m³ 정육면체를 가득 쌓아 보세요.",
          check: d => d.join() === "9,7,3" ? null : "교실을 1 m³ 정육면체로 가득 채워 보세요(가로 9개, 세로 7개, 높이 3개).", msg: "교실을 1 m³ 정육면체로 가득 채웠어요.",
          ask: [{ parts: ["이 교실의 부피는 약 ", { n: 189 }, " m³예요."] }],
          ok: "이 교실의 부피는 9 × 7 × 3 = 189(m³)예요. 교과서의 예시 교실은 약 182 m³였어요. 교실마다 크기가 달라 어림한 값도 달라요." })]) },
    { name: "관계 알아보기", inst: "1 cm³ 쌓기나무로 1 m³ 정육면체를 만들어 1 cm³와 1 m³의 관계를 알아보세요. “1 m는 100 cm야.”", hints: ["1 m = 100 cm이니까 한 모서리에 쌓기나무를 100개 놓을 수 있어요.", "한 층에 100 × 100개, 그런 층이 100층이에요."],
      words: ["1 m = 100 cm", "100 × 100 × 100", "1000000"],
      render: (b, a) => vo6M3(b, a, { ask: [
        { parts: ["한 모서리에 쌓을 수 있는 쌓기나무는 ", { n: 100, why: { "10": "1 m = 100 cm예요. 1 cm 쌓기나무가 100개 놓여요." } }, "개예요."] },
        { parts: ["한 층에는 100 × 100 = ", { n: 10000 }, "(개)예요."] },
        { parts: ["필요한 쌓기나무는 100 × 100 × 100 = ", { n: 1000000, w: "8em", why: { "10000": "10000개는 한 층의 수예요. 100층이니까 100을 한 번 더 곱해요.", "300": "100 + 100 + 100이 아니라 100 × 100 × 100이에요.", "100": "한 모서리에 100개이고, 가로·세로·높이 방향으로 모두 100개씩이에요." } }, "(개)이므로 1 m³ = ", { n: 1000000, w: "8em" }, " cm³예요."] }],
        ok: "1 m³ = 1000000 cm³예요. 길이는 100배(1 m = 100 cm), 넓이는 10000배(1 m² = 10000 cm²), 부피는 1000000배예요." }) },
    { name: "단위 바꾸기", inst: "□ 안에 알맞은 수를 써넣고, 부피가 같은 것끼리 이어 보세요.", hints: ["1 m³ = 1000000 cm³예요.", "m³를 cm³로 바꿀 때는 1000000을 곱하고, cm³를 m³로 바꿀 때는 1000000으로 나누어요."],
      render: (b, a) => vo6Ask(b, a, [
        { parts: ["5 m³ = ", { n: 5000000, w: "8em", why: { "500": "1 m³는 100 cm³가 아니에요. 100 × 100 × 100 = 1000000이에요.", "50000": "1 m³는 10000 cm³가 아니에요(1 m² = 10000 cm²와 헷갈렸어요). 1 m³ = 1000000 cm³예요." } }, " cm³"] },
        { parts: ["12000000 cm³ = ", { n: 12, why: { "120000": "1 m³ = 1000000 cm³이니까 1000000으로 나누어요.", "1200": "1 m³ = 1000000 cm³이니까 1000000으로 나누어요." } }, " m³"] },
        { parts: ["7 m³ = ", { n: 7000000, w: "8em" }, " cm³ · 46000000 cm³ = ", { n: 46 }, " m³"] },
        { q: "부피가 같은 것끼리 이어 보세요.", parts: ["6 m³ — ", { o: ["600000 cm³", "6000000 cm³", "60000000 cm³"], a: 1 }, " · 60 m³ — ", { o: ["600000 cm³", "6000000 cm³", "60000000 cm³"], a: 2 }, " · 0.6 m³ — ", { o: ["600000 cm³", "6000000 cm³", "60000000 cm³"], a: 0 }] }],
        { ok: "m³에 1000000을 곱하면 cm³, cm³를 1000000으로 나누면 m³예요. 1 m = 100 cm이고 100 × 100 × 100 = 1000000이기 때문이에요." }) },
    { name: "확인하기", inst: "직육면체의 부피는 몇 m³인지 구해 보세요.", hints: ["cm로 주어지면 cm³로 구한 뒤 m³로 바꾸거나, 먼저 cm를 m로 바꾸어 구해요.", "300 cm = 3 m, 400 cm = 4 m, 250 cm = 2.5 m예요."],
      render: (b, a) => vo6Ask(b, a, [
        { fig: () => vo6Cub([6, 3, 3], "m", { s: 18 }), parts: ["6 × 3 × 3 = ", { n: 54 }, " (m³)"] },
        { fig: () => vo6Cub([300, 400, 250], "cm", { W: 200, maxW: "14em" }), parts: ["방법 1: 300 × 400 × 250 = ", { n: 30000000, w: "8em" }, " (cm³) = ", { n: 30, why: { "30000000": "cm³로 구한 수예요. 1000000으로 나누어 m³로 바꾸어요." } }, " m³"] },
        { parts: ["방법 2: 3 × 4 × ", { n: 2.5, why: { "250": "250 cm를 m로 바꾸면 2.5 m예요." } }, " = ", { n: 30 }, " (m³)"] }],
        { ok: "두 방법 모두 30 m³예요. cm³로 구한 뒤 m³로 바꾸어도, cm를 m로 바꾸어 구해도 돼요." }) }
  ],
  challenge: { inst: "수학익힘 유사 문제를 풀어 보세요.", hints: ["단위를 하나로 맞추어 비교해요.", "900000 cm³ = 0.9 m³, 200 cm × 400 cm × 60 cm = 2 m × 4 m × 0.6 m예요."],
    render: (b, a) => vo6Chain(b, a, [
      (bx, ax) => vo6Ask(bx, ax, [{ q: "가로 7 m, 세로 8 m, 높이 5 m인 직육면체의 부피는 몇 m³인가요?", parts: [{ n: 280 }, " m³"] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "부피가 가장 작은 것을 찾아보세요. ㉠ 한 모서리의 길이가 3 m인 정육면체 ㉡ 32 m³ ㉢ 900000 cm³ ㉣ 가로 200 cm, 세로 400 cm, 높이 60 cm인 직육면체",
        parts: ["㉠ ", { n: 27 }, " m³, ㉢ ", { n: 0.9, why: { "9": "900000 ÷ 1000000 = 0.9예요." } }, " m³, ㉣ ", { n: 4.8 }, " m³ → 가장 작은 것은 ", { o: ["㉠", "㉡", "㉢", "㉣"], a: 2, why: { "3": "㉣은 4.8 m³이고 ㉢은 0.9 m³예요. 단위를 맞추어 비교해요." } }] }],
        { ok: "㉠ 27 m³, ㉡ 32 m³, ㉢ 0.9 m³, ㉣ 4.8 m³이므로 가장 작은 것은 ㉢이에요." })]) }
},
{
  id: "t78", no: "7~8", title: "직육면체의 겉넓이를 구하는 방법을 알아볼까요", soop: "개념 구축하기(O)",
  question: "직육면체의 겉넓이를 어떻게 구할 수 있을까요?",
  summary: "입체도형의 겉면의 넓이를 겉넓이라고 해요. (직육면체의 겉넓이) = (여섯 면의 넓이의 합) = (한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2 = (한 밑면의 넓이) × 2 + (옆면의 넓이)예요. 옆면을 하나의 직사각형으로 보면 가로는 밑면의 둘레, 세로는 높이예요. (정육면체의 겉넓이) = (한 면의 넓이) × 6이에요.",
  steps: [
    { name: "살펴보기", inst: "식료품을 담은 직육면체 모양 상자를 포장하려고 해요. “상자를 포장하는 데 포장지는 얼마나 필요할까?” “상자의 겉면의 넓이를 구하면 포장지가 얼마나 필요한지 알 수 있어.” “입체도형의 겉면의 넓이를 겉넓이라고 해.” 상자와 전개도를 살펴보세요.", hints: ["전개도에서 면의 모양과 수를 세어 봐요.", "마주 보는 두 면은 평행해요."],
      render: (b, a) => vo6Ask(b, a, [
        { fig: () => h("div", { class: "vo6row" }, h("div", {}, vo6NetSvg([5, 2, 3], "cm", { maxW: "18em" })), h("div", { style: "flex:0 1 11em" }, vo6Cub([5, 2, 3], "cm", { maxW: "11em", W: 160 }))),
          parts: ["직육면체의 각 면은 ", { o: ["직사각형", "삼각형", "원"], a: 0 }, "이고, 면은 ", { n: 6 }, "개예요. 평행한 두 면은 모양과 크기가 ", { o: ["같아서", "달라서"], a: 0 }, " 넓이가 같아요."] },
        { q: "겉넓이는 어떻게 구할 수 있을까요?", parts: [{ o: ["여섯 면의 넓이를 모두 더해요.", "한 면의 넓이만 구해요.", "가로, 세로, 높이를 더해요."], a: 0 }] }],
        { ok: "겉넓이는 여섯 면의 넓이를 더해 구할 수 있어요. 평행한 두 면의 넓이가 같다는 것을 이용할 수도 있어요." }) },
    { name: "여섯 면 더하기", inst: "직육면체의 겉넓이를 여섯 면의 넓이를 더해 구해 보세요. 전개도의 면을 하나씩 눌러 보세요.", hints: ["밑면은 5 × 2 = 10(cm²), 옆면은 2 × 3 = 6(cm²), 5 × 3 = 15(cm²)예요.", "여섯 면을 모두 눌렀는지 확인해요."],
      render: (b, a) => vo6Net(b, a, { d: [5, 2, 3], mode: "six",
        ask: [{ parts: ["10 + 6 + 15 + 6 + 15 + 10 = ", { n: 62, why: { "31": "세 면만 더했어요. 여섯 면을 모두 더해요." } }, " (cm²)"] }],
        ok: "여섯 면의 넓이를 모두 더하면 62 cm²예요." }) },
    { name: "평행한 두 면", inst: "평행한 두 면의 넓이가 같다는 것을 이용하여 겉넓이를 구해 보세요. 면을 눌러 평행한 두 면을 찾아보세요.", hints: ["평행한 면은 세 쌍이에요.", "한 꼭짓점에서 만나는 세 면의 넓이를 더한 뒤 2배 해도 돼요."],
      render: (b, a) => vo6Net(b, a, { d: [5, 2, 3], mode: "pair",
        ask: [{ parts: ["10 × 2 + 6 × 2 + 15 × 2 = ", { n: 62 }, " (cm²)"] }, { parts: ["(10 + 6 + 15) × ", { n: 2, why: { "6": "세 면의 넓이를 더한 것은 서로 다른 세 면이에요. 평행한 면이 하나씩 더 있으니 2배 해요." } }, " = ", { n: 62 }, " (cm²)로 구할 수도 있어요."] }],
        ok: "평행한 두 면의 넓이는 같으니 세 면의 넓이만 구해 2배 하면 돼요. 한 꼭짓점에서 만나는 세 면의 넓이를 더한 뒤 2배 해도 같아요." }) },
    { name: "옆면을 하나로", inst: "“옆면을 하나의 직사각형으로 보고 구해 볼까요?” 두 밑면과 옆면의 넓이를 이용하여 겉넓이를 구해 보세요.", hints: ["옆면 4개를 이어 붙이면 가로가 2 + 5 + 2 + 5인 직사각형이 돼요.", "옆면의 가로는 밑면의 둘레, 세로는 높이와 같아요."],
      render: (b, a) => vo6Net(b, a, { d: [5, 2, 3], mode: "strip",
        ask: [{ parts: ["옆면의 가로는 2 + 5 + 2 + 5 = ", { n: 14, why: { "7": "옆면은 네 개예요. 밑면의 둘레(2 + 5 + 2 + 5)가 옆면의 가로예요." } }, " (cm), 세로는 ", { n: 3 }, " cm이니까 옆면의 넓이는 ", { n: 42 }, " cm²예요."] },
          { parts: ["두 밑면과 옆면: 10 × ", { n: 2 }, " + 42 = ", { n: 62, why: { "52": "밑면은 위아래 두 개예요. 10 × 2를 더해요." } }, " (cm²)"] }],
        ok: "옆면을 하나의 직사각형으로 보면 가로는 밑면의 둘레, 세로는 높이예요. 10 × 2 + 42 = 62(cm²)예요." }) },
    { name: "약속하기", inst: "직육면체의 겉넓이를 구하는 방법을 정리하고, 방법을 비교해 보세요.", hints: ["세 가지 방법 모두 62 cm²가 나왔어요.", "평행한 두 면을 이용하면 세 면의 넓이만 구해도 돼요."],
      render: (b, a) => vo6Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["(직육면체의 겉넓이) = (", { o: ["여섯 면", "세 면"], a: 0 }, "의 넓이의 합) = (한 꼭짓점에서 만나는 세 면의 넓이의 합) × ", { o: ["2", "3", "6"], a: 0 }, " = (한 밑면의 넓이) × 2 + (", { o: ["옆면", "윗면"], a: 0 }, "의 넓이)"]),
        (bx, ax) => quiz(bx, ax, [{ q: "평행한 두 면을 이용하는 방법이 편리한 까닭은 무엇일까요?", o: ["세 면의 넓이만 구해도 되기 때문이에요.", "여섯 면을 모두 그려야 하기 때문이에요.", "높이를 몰라도 되기 때문이에요."], a: 0 },
          { q: "옆면을 하나의 직사각형으로 보는 방법이 편리한 까닭은 무엇일까요?", o: ["밑면과 옆면의 넓이만 구하면 되기 때문이에요.", "옆면이 정사각형이 되기 때문이에요."], a: 0 }],
          { ok: "어느 방법으로 구해도 겉넓이는 같아요. 편리한 방법을 골라 써요." })]) },
    { name: "구해 보기", inst: "직육면체의 겉넓이를 구하고, 방법을 친구와 비교해 보세요.", hints: ["가로 3 m, 세로 5 m, 높이 8 m이에요. 세 면은 15 m², 24 m², 40 m²예요.", "두 상자의 겉넓이를 각각 구한 뒤 빼요."],
      render: (b, a) => vo6Chain(b, a, [
        (bx, ax) => vo6Ask(bx, ax, [{ fig: () => vo6Cub([3, 5, 8], "m", { s: 13 }), parts: ["15 × 2 + 24 × 2 + 40 × 2 = ", { n: 158, why: { "79": "세 면의 넓이만 더했어요. 2배 해요." } }, " (m²) · 두 밑면과 옆면: 15 × 2 + (3 + 5 + 3 + 5) × 8 = ", { n: 158 }, " (m²)"] }]),
        (bx, ax) => vo6Ask(bx, ax, [{ q: "두 직육면체 모양 상자 중 어느 상자의 겉넓이가 몇 cm² 더 넓을까요?", fig: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([12, 25, 15], "cm", { s: 5 }), "가"), vo6Fr(vo6Cub([6, 30, 30], "cm", { s: 5 }), "나")),
          parts: ["가: ", { n: 1710 }, " cm², 나: ", { n: 2520 }, " cm² → ", { o: ["가", "나"], a: 1 }, " 상자의 겉넓이가 ", { n: 810 }, " cm² 더 넓어요."] }],
          { ok: "가는 375 × 2 + 180 × 2 + 300 × 2 = 1710(cm²), 나는 900 × 2 + 180 × 2 + 180 × 2 = 2520(cm²)이니까 나가 810 cm² 더 넓어요." })]) },
    { name: "정육면체의 겉넓이", inst: "한 모서리의 길이가 8 cm인 정육면체의 겉넓이를 구하는 방법을 알아보세요. 전개도의 면을 모두 눌러 보세요.", hints: ["정육면체의 여섯 면은 모두 합동인 정사각형이에요.", "한 면의 넓이는 8 × 8 = 64(cm²)예요."],
      render: (b, a) => vo6Net(b, a, { d: [8, 8, 8], mode: "six",
        then: (bx, ax) => vo6Chain(bx, ax, [
          (cx, cy) => vo6Ask(cx, cy, [{ parts: ["여섯 면의 넓이는 모두 ", { o: ["같아요", "달라요"], a: 0 }, ". 64 + 64 + 64 + 64 + 64 + 64 = 64 × ", { n: 6 }, " = ", { n: 384, why: { "128": "64 × 2가 아니라 여섯 면이니까 64 × 6이에요.", "512": "512는 부피(8 × 8 × 8)예요. 겉넓이는 한 면의 넓이 × 6이에요." } }, " (cm²)"] }]),
          (cx, cy) => blanks(cx, cy, ["(정육면체의 겉넓이) = (", { o: ["한 면의 넓이", "한 모서리의 길이"], a: 0 }, ") × ", { o: ["6", "2", "3"], a: 0 }]),
          (cx, cy) => vo6Ask(cx, cy, [{ q: "정육면체의 겉넓이는 몇 m²인지 구해 보세요.", parts: ["한 모서리 5 m: ", { n: 150, why: { "125": "125는 부피예요. 한 면의 넓이 25에 6을 곱해요." } }, " m² · 한 모서리 12 m: ", { n: 864 }, " m²"] }],
            { ok: "(정육면체의 겉넓이) = (한 면의 넓이) × 6이에요. 25 × 6 = 150, 144 × 6 = 864예요." })]) }) },
    { name: "문제 만들기", inst: "우리 주변에서 직육면체 모양의 물건을 찾아 가로, 세로, 높이를 재어 겉넓이를 구하는 문제를 만들고, 짝과 바꾸어 해결해 보세요. 틀: “가로가 □ cm, 세로가 □ cm, 높이가 □ cm인 직육면체 모양의 □이/가 있습니다. 이 □의 겉넓이는 몇 cm²인가요?”", hints: ["겉넓이는 (한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2로 구할 수 있어요.", "어떤 방법으로 구했는지 짝에게 설명해 봐요."],
      render: (b, a) => vo6Make(b, a, { kind: "surf", friend: { obj: "초콜릿 상자", d: [7, 3, 2], a: 82, q: "가로가 7 cm, 세로가 3 cm, 높이가 2 cm인 직육면체 모양의 초콜릿 상자가 있습니다. 이 초콜릿 상자의 겉넓이는 몇 cm²인가요?", why: { "41": "세 면의 넓이만 더했어요. 2배 해요.", "42": "42는 부피(7 × 3 × 2)예요." } },
        ok: "초콜릿 상자의 겉넓이는 21 × 2 + 6 × 2 + 14 × 2 = 82(cm²)예요." }) }
  ],
  challenge: { inst: "수학익힘 유사 문제를 풀어 보세요.", hints: ["정육면체의 모서리는 12개이고 길이가 모두 같아요.", "두 도형의 겉넓이를 각각 구해 비교해요."],
    render: (b, a) => vo6Chain(b, a, [
      (bx, ax) => vo6Ask(bx, ax, [{ q: "전개도를 접어서 만든 직육면체의 겉넓이를 구해 보세요.", fig: () => vo6NetSvg([4, 5, 6], "cm", { maxW: "16em" }), parts: ["(20 + 30 + 24) × 2 = ", { n: 148, why: { "74": "세 면의 넓이만 더했어요. 2배 해요.", "120": "120은 부피예요." } }, " (cm²)"] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "겉넓이가 더 넓은 것을 찾아보세요. ㉠ 가로 10 cm, 세로 7 cm, 높이 2 cm인 직육면체 ㉡ 한 모서리의 길이가 6 cm인 정육면체", parts: ["㉠ ", { n: 208 }, " cm², ㉡ ", { n: 216 }, " cm² → ", { o: ["㉠", "㉡"], a: 1 }] }]),
      (bx, ax) => vo6Ask(bx, ax, [{ q: "모든 모서리의 길이의 합이 96 cm인 정육면체가 있어요.", parts: ["한 모서리의 길이는 96 ÷ 12 = ", { n: 8, why: { "16": "정육면체의 모서리는 6개가 아니라 12개예요.", "24": "정육면체의 모서리는 4개가 아니라 12개예요." } }, " (cm), 겉넓이는 ", { n: 384 }, " cm²예요."] }], { ok: "한 모서리는 8 cm, 겉넓이는 64 × 6 = 384(cm²)예요." })]) }
},
{
  id: "t9", no: 9, title: "생각을 더하다 ― 어떤 모양으로 쌓아서 포장할까요", soop: "탐구 정리하기(O)",
  question: "포장지를 더 적게 사용하려면 상자를 어떤 모양으로 쌓아야 할까요?",
  summary: "같은 상자를 여러 개 쌓으면 쌓은 모양이 달라도 부피는 같지만, 겉넓이는 다를 수 있어요. 겹치는 부분 없이 포장할 때 필요한 포장지의 넓이는 쌓은 모양의 겉넓이와 같으므로, 겉넓이가 더 좁은 모양으로 쌓으면 포장지를 절약할 수 있어요.",
  steps: [
    { name: "기사 읽기", inst: "‘포장 폐기물을 줄여 환경 보호 강화해야’ ― 한 해에 발생하는 생활 폐기물 중 포장 폐기물이 차지하는 비율은 전체의 35%에 달합니다. 포장 폐기물을 줄이기 위한 노력이 필요한 시점입니다. (출처: 환경부, 2024)", hints: ["기사에 나온 비율을 찾아봐요.", "포장지를 적게 쓰면 쓰레기가 줄어요."],
      render: (b, a) => quiz(b, a, [
        { q: "생활 폐기물 중 포장 폐기물이 차지하는 비율은 얼마인가요?", o: ["약 3.5%", "35%", "약 53%"], a: 1 },
        { q: "포장 폐기물을 줄이기 위해 할 수 있는 일을 모두 골라 보세요.", o: ["지나친 포장을 하지 않아요.", "포장지를 적게 쓰도록 물건을 쌓아 포장해요.", "작은 물건도 큰 상자에 하나씩 따로 포장해요."], a: [0, 1], why: { "0,1,2": "하나씩 따로 큰 상자에 포장하면 포장 폐기물이 더 많아져요." } }],
        { ok: "포장을 줄이면 환경을 보호하고 자원을 절약할 수 있어요. 수학으로 포장지를 덜 쓰는 방법을 찾아봐요." }) },
    { name: "상자 4개 ― 가", inst: "진우는 장식용 고리가 들어 있는 직육면체 모양 상자(가로 8 cm, 세로 5 cm, 높이 3 cm)를 쌓아 포장지로 포장하려고 해요(겹치는 부분 없이 포장해요). 상자 4개를 가 모양처럼 한 층에 1개씩 4층으로 쌓아 보세요.", hints: ["위로(층) 단추로 4층을 쌓아요.", "높이는 3 cm씩 4층이니까 12 cm예요."],
      render: (b, a) => vo6Pack(b, a, { box: VO6_D.pkg, N: 4, check: n => n.join() === "1,1,4" ? null : "가는 한 층에 1개씩 4층으로 쌓은 모양이에요.", msg: "가 모양으로 쌓았어요.",
        ask: [{ parts: ["쌓은 모양은 가로 ", { n: 8 }, " cm, 세로 ", { n: 5 }, " cm, 높이 ", { n: 12 }, " cm예요."] },
          { parts: ["부피: 8 × 5 × 12 = ", { n: 480 }, " (cm³)"] },
          { parts: ["겉넓이: 40 × 2 + 96 × 2 + 60 × 2 = ", { n: 392, why: { "196": "세 면의 넓이만 더했어요. 2배 해요.", "632": "상자 4개의 겉넓이를 따로 구해 더하면 맞닿아 가려진 면까지 세게 돼요. 쌓은 모양 전체의 겉넓이를 구해요." } }, " (cm²)"] }],
        ok: "가의 부피는 480 cm³, 겉넓이는 392 cm²예요." }) },
    { name: "상자 4개 ― 나", inst: "상자 4개를 나 모양처럼 한 층에 2개씩(앞뒤로 2개) 2층으로 쌓아 보세요.", hints: ["세로로(앞뒤로) 2개, 위로 2층을 쌓아요.", "세로는 5 cm씩 2개라 10 cm, 높이는 3 cm씩 2층이라 6 cm예요."],
      render: (b, a) => vo6Pack(b, a, { box: VO6_D.pkg, N: 4, check: n => n.join() === "1,2,2" ? null : n.join() === "2,1,2" ? "나는 앞뒤로(세로로) 2개를 놓아 가로 8 cm, 세로 10 cm가 되게 쌓은 모양이에요." : "나는 한 층에 2개씩(앞뒤로) 2층으로 쌓은 모양이에요.", msg: "나 모양으로 쌓았어요.",
        ask: [{ parts: ["쌓은 모양은 가로 ", { n: 8 }, " cm, 세로 ", { n: 10 }, " cm, 높이 ", { n: 6 }, " cm예요."] },
          { parts: ["부피: 8 × 10 × 6 = ", { n: 480 }, " (cm³)"] },
          { parts: ["겉넓이: 80 × 2 + 48 × 2 + 60 × 2 = ", { n: 376, why: { "188": "세 면의 넓이만 더했어요. 2배 해요." } }, " (cm²)"] }],
        ok: "나의 부피는 480 cm³, 겉넓이는 376 cm²예요." }) },
    { name: "비교하기", inst: "가와 나 중 포장지를 절약할 수 있는 것은 어느 것인지 알아보세요.", hints: ["가: 부피 480 cm³, 겉넓이 392 cm² / 나: 부피 480 cm³, 겉넓이 376 cm²", "포장지의 넓이는 쌓은 모양의 겉넓이와 같아요."],
      render: (b, a) => vo6Ask(b, a, [
        { fig: () => h("div", { class: "vo6figs" }, ...[["가", [1, 1, 4]], ["나", [1, 2, 2]]].map(([t, n]) => { const bl = []; for (let i = 0; i < n[0]; i++) for (let j = 0; j < n[1]; j++) for (let k = 0; k < n[2]; k++) bl.push({ x: i * 8, y: j * 5, z: k * 3, w: 8, d: 5, h: 3, c: VO6.box }); return vo6Fr(vo6Solid({ d: vo6PackD(VO6_D.pkg, n), mode: "none", blocks: bl, s: 7, frame: [8, 10, 12], maxW: "9em", plain: true }), t); })),
          parts: ["두 모양의 부피는 ", { o: ["같아요", "달라요"], a: 0 }, ". 겉넓이는 376 ", { o: [">", "=", "<"], a: 2 }, " 392이므로 ", { o: ["가", "나"], a: 1 }, "의 겉넓이가 더 좁아 포장지를 더 적게 사용해요."] },
        { q: "알게 된 점을 골라 보세요.", parts: [{ o: ["부피가 같아도 쌓은 모양에 따라 겉넓이가 다를 수 있어요.", "부피가 같으면 겉넓이도 언제나 같아요."], a: 0, why: { "1": "가와 나는 부피가 480 cm³로 같지만 겉넓이는 392 cm², 376 cm²로 달랐어요." } }] }],
        { ok: "부피가 같아도 쌓은 모양에 따라 겉넓이가 달라요. 나 모양으로 쌓으면 포장지를 절약할 수 있어요." }) },
    { name: "상자 8개", inst: "상자 8개를 가 모양(가로 16 cm, 세로 10 cm, 높이 6 cm)과 나 모양(가로 16 cm, 세로 5 cm, 높이 12 cm)으로 쌓아 비교해 보세요.", hints: ["가는 가로로 2개, 앞뒤로 2개, 2층이에요.", "나는 가로로 2개, 앞뒤로 1개, 4층이에요."],
      render: (b, a) => vo6Chain(b, a, [
        { title: "① 가 모양(가로 16 cm, 세로 10 cm, 높이 6 cm)으로 쌓기", run: (bx, ax) => vo6Pack(bx, ax, { box: VO6_D.pkg, N: 8, check: n => vo6PackD(VO6_D.pkg, n).join() === "16,10,6" ? null : `쌓은 모양이 가로 16 cm, 세로 10 cm, 높이 6 cm가 되게 쌓아요. 지금은 ${vo6DimTxt(vo6PackD(VO6_D.pkg, n))}예요.`,
          ask: [{ parts: ["부피: ", { n: 960 }, " cm³, 겉넓이: 160 × 2 + 96 × 2 + 60 × 2 = ", { n: 632 }, " (cm²)"] }] }) },
        { title: "② 나 모양(가로 16 cm, 세로 5 cm, 높이 12 cm)으로 쌓기", run: (bx, ax) => vo6Pack(bx, ax, { box: VO6_D.pkg, N: 8, check: n => vo6PackD(VO6_D.pkg, n).join() === "16,5,12" ? null : "쌓은 모양이 가로 16 cm, 세로 5 cm, 높이 12 cm가 되게 쌓아요(가로로 2개, 4층).",
          ask: [{ parts: ["부피: ", { n: 960 }, " cm³, 겉넓이: 80 × 2 + 192 × 2 + 60 × 2 = ", { n: 664 }, " (cm²)"] }, { parts: ["포장지를 절약할 수 있는 것은 ", { o: ["가", "나"], a: 0, why: { "1": "632 < 664이므로 겉넓이가 더 좁은 쪽은 가예요." } }, "예요."] }],
          ok: "가와 나의 부피는 960 cm³로 같고, 겉넓이는 632 cm² < 664 cm²이므로 가가 포장지를 더 적게 사용해요." }) }]) },
    { name: "돌아보기", inst: "포장지를 더 적게 사용하는 모양을 찾으며 알게 된 점을 써 보세요.", hints: ["부피와 겉넓이를 비교했던 것을 떠올려요.", "환경을 위해 생활에서 할 수 있는 일도 생각해요."],
      render: (b, a) => writeStep(b, a, [{ q: "포장지를 더 적게 사용하려면 상자를 어떻게 쌓아야 하는지 까닭과 함께 써 보세요.", tag: "알게 된 점", ph: "예) 부피가 같아도 쌓은 모양에 따라 겉넓이가 달라요. 겉넓이가 더 좁은 모양으로 쌓으면 포장지를 덜 써서 쓰레기를 줄일 수 있어요." }]) }
  ],
  challenge: { inst: "상자 8개를 가 모양(겉넓이 632 cm²)보다 포장지를 더 적게 사용하도록 쌓아 보세요.", hints: ["가로로, 세로로, 위로 놓는 개수를 여러 가지로 바꾸어 겉넓이를 견주어 봐요.", "쌓은 모양이 정육면체에 가까울수록 겉넓이가 좁아지는 경향이 있어요."],
    render: (b, a) => vo6Pack(b, a, { box: VO6_D.pkg, N: 8, start: [2, 2, 2], check: n => { const s = vo6Surf(vo6PackD(VO6_D.pkg, n)); return s < 632 ? null : `이렇게 쌓으면 ${vo6DimTxt(vo6PackD(VO6_D.pkg, n))}로 겉넓이가 ${s} cm²예요. 632 cm²보다 좁게 쌓아 보세요.`; },
      msg: "632 cm²보다 겉넓이가 좁은 모양을 찾았어요!",
      ask: n => [{ parts: [`쌓은 모양은 가로 ${vo6PackD(VO6_D.pkg, n)[0]} cm, 세로 ${vo6PackD(VO6_D.pkg, n)[1]} cm, 높이 ${vo6PackD(VO6_D.pkg, n)[2]} cm예요. 겉넓이는 `, { n: vo6Surf(vo6PackD(VO6_D.pkg, n)) }, " cm²예요."] }],
      ok: `가로 8 cm, 세로 10 cm, 높이 12 cm로 쌓으면 겉넓이가 ${VO6_P8.find(p => p.n.join() === "1,2,4").s} cm²로, 상자 8개를 쌓는 방법 중 포장지가 가장 적게 들어요.` }) }
},
{
  id: "t10", no: 10, title: "놀이를 더하다 ― 찾아라 쪽지, 구해라 부피!", soop: "발표하기(P)",
  question: "붙임쪽지에 적힌 직육면체의 부피를 정확하게 구할 수 있을까요?",
  summary: "놀이를 하며 (직육면체의 부피) = (가로) × (세로) × (높이)로 부피를 구해요. 붙임쪽지에 적힌 부피를 정확하게 구한 만큼 점수를 얻어요. 친구와 서로 답을 확인하며 부피 계산에 익숙해져요.",
  steps: [
    { name: "놀이 방법", inst: "준비하기: ① 학급 전체를 두 모둠으로 나누고, 붙임쪽지를 한 사람당 3장씩 가져요. ② 붙임쪽지 3장에 각각 자신의 이름과 서로 다른 크기의 직육면체의 가로, 세로, 높이를 적어요(1부터 20까지의 자연수, 단위는 cm). ③ 가위바위보로 놀이 순서를 정해요. 놀이 방법: ① 한 모둠은 엎드려 눈을 가리고, 다른 모둠은 붙임쪽지 3장을 교실 곳곳에 붙여요. ② 엎드려 있던 모둠은 일어나 3분 동안 붙임쪽지를 찾아요(한 사람당 최대 3장). ③ 자리에 돌아와 붙임쪽지에 적힌 직육면체의 부피를 구하여 빈 곳에 적어요. ④ 이름을 보고 그 사람을 찾아가 답을 확인해요. 부피를 정확하게 구한 붙임쪽지의 수만큼 점수를 얻어요. ⑤ 두 모둠이 역할을 바꾸어 1~4를 반복해요. 점수를 더 많이 얻은 모둠이 이겨요.", hints: ["가로, 세로, 높이는 1부터 20까지의 자연수예요.", "한 사람이 찾을 수 있는 붙임쪽지는 최대 3장이에요."],
      render: (b, a) => vo6Ask(b, a, [
        { parts: ["붙임쪽지에는 가로, 세로, 높이를 1부터 ", { n: 20 }, "까지의 자연수로 적고, 단위는 ", { o: ["cm", "m", "mm"], a: 0 }, "로 적어요."] },
        { parts: ["붙임쪽지는 ", { n: 3 }, "분 동안 찾고, 한 사람당 최대 ", { n: 3 }, "장까지 찾을 수 있어요."] },
        { parts: ["점수는 ", { o: ["부피를 정확하게 구한 붙임쪽지의 수만큼", "찾은 붙임쪽지의 수만큼"], a: 0, why: { "1": "찾기만 해서는 점수가 없어요. 부피를 정확하게 구해야 점수를 얻어요." } }, " 얻어요."] },
        { q: "놀이에서 이기려면 어떻게 해야 할까요?", parts: [{ o: ["눈에 잘 띄지 않는 곳에 붙이고, 부피를 옳게 구하고, 붙임쪽지를 최대한 많이 찾아요.", "친구가 붙인 쪽지를 떼어서 숨겨요."], a: 0 }] }],
        { ok: "같은 모둠끼리 도와 찾고, 부피를 옳게 구했는지 서로 확인해요. 위험한 곳에는 붙이지 않아요." }) },
    { name: "쪽지 만들기", inst: "내 붙임쪽지 3장을 만들어 붙이고, 다른 모둠 친구가 구한 부피를 확인해 보세요. 예) “송하나 / 가로 20 cm / 세로 3 cm / 높이 5 cm / 부피 300 cm³” → “정답이야!”", hints: ["서로 다른 크기의 직육면체를 적어요.", "친구의 답이 맞는지 (가로) × (세로) × (높이)로 직접 계산해 봐요."],
      render: (b, a) => vo6Notes(b, a, {}) },
    { name: "쪽지 찾기", inst: "이번에는 내가 찾는 모둠이에요. 다른 모둠 친구들이 교실 곳곳에 붙인 쪽지를 3분 동안 찾고, 부피를 구해 보세요.", hints: ["칠판, 시계, 책장, 창문 근처를 잘 살펴봐요.", "부피는 (가로) × (세로) × (높이)예요. 계산기를 써도 돼요."],
      render: (b, a) => vo6Hunt(b, a, { time: 180 }) },
    { name: "또 다른 놀이", inst: "2명이 하는 또 다른 놀이예요. 종이에 가로, 세로, 높이 중 하나를 적어(예: “가로 3 cm”) 섞어 뒤집어 놓아요. 순서대로 종이 3장을 골라 뒤집어서, 3장이 각각 가로, 세로, 높이가 적힌 종이이면 가져오고 아니면 다시 뒤집어 원래 자리에 놓아요. 남은 종이가 없을 때까지 하고, 가져온 종이로 부피를 구해 부피의 합이 더 큰 사람이 이겨요.", hints: ["예) 가로 3 cm, 세로 5 cm, 높이 4 cm → 모두 있으니 가져와요(60 cm³).", "가로 3 cm, 가로 4 cm, 높이 6 cm → 세로가 없어서 가져올 수 없어요."],
      render: (b, a) => vo6Cards(b, a, { per: 4 }) },
    { name: "돌아보기", inst: "놀이를 돌아보며 생각을 써 보세요.", hints: ["부피를 빨리, 정확하게 구하는 나만의 방법이 있었나요?", "곱하는 차례를 바꾸면 계산이 쉬워질 때가 있어요(예: 4 × 7 × 5 = 4 × 5 × 7)."],
      render: (b, a) => writeStep(b, a, [{ q: "놀이를 하며 부피를 구할 때 쓴 방법이나 알게 된 점을 써 보세요.", tag: "돌아보기", ph: "예) 5와 2처럼 곱해서 10이 되는 수를 먼저 곱하면 계산이 쉬웠어요." }]) }
  ],
  challenge: { inst: "송하나가 쓴 붙임쪽지예요. 부피를 구해 보세요.", hints: ["(가로) × (세로) × (높이)로 구해요.", "1부터 20까지의 자연수로 만들 수 있는 가장 큰 직육면체는 가로, 세로, 높이가 모두 20 cm예요."],
    render: (b, a) => vo6Ask(b, a, [
      { fig: () => h("div", {}, h("span", { class: "vo6note" }, "송하나 · 가로 20 cm · 세로 3 cm · 높이 5 cm · 부피 300 cm³")), parts: ["이 쪽지의 부피는 ", { o: ["정답이에요", "틀렸어요"], a: 0 }, "(20 × 3 × 5 = 300)."] },
      { fig: () => h("div", {}, h("span", { class: "vo6note" }, "송하나 · 가로 10 cm · 세로 8 cm · 높이 4 cm · 부피 □ cm³")), parts: ["부피는 ", { n: 320 }, " cm³예요."] },
      { q: "붙임쪽지에 적을 수 있는 직육면체 중 부피가 가장 큰 것은 몇 cm³일까요?", parts: [{ n: 8000, why: { "60": "20 + 20 + 20이 아니라 20 × 20 × 20이에요.", "400": "400은 한 밑면의 넓이(20 × 20)예요. 높이 20을 곱해요." } }, " cm³"] }],
      { ok: "10 × 8 × 4 = 320(cm³), 가장 큰 것은 20 × 20 × 20 = 8000(cm³)이에요." }) }
},
{
  id: "t11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "직육면체의 부피와 겉넓이에 대해 배운 내용을 확인해 볼까요?",
  summary: "부피의 단위는 1 cm³, 1 m³이고 1 m³ = 1000000 cm³예요. (직육면체의 부피) = (가로) × (세로) × (높이), (정육면체의 부피) = (한 모서리의 길이) × (한 모서리의 길이) × (한 모서리의 길이)예요. (직육면체의 겉넓이) = (면 ㉮의 넓이) × 2 + (면 ㉯의 넓이) × 2 + (면 ㉰의 넓이) × 2, (정육면체의 겉넓이) = (한 면의 넓이) × 6이에요.",
  steps: [
    { name: "1번", inst: "부피가 1 cm³인 쌓기나무로 만든 직육면체 가와 나의 부피를 비교해 보세요.", hints: ["한 층의 수와 층수를 세어 곱해요.", "가는 한 층에 10개씩 2층, 나는 한 층에 9개씩 2층이에요."],
      render: (b, a) => vo6Ask(b, a, [{ fig: () => h("div", {}, h("div", { class: "vo6figs" }, vo6Fr(vo6Stack(VO6_D.ex11a, { s: 22, frame: [5, 3, 2], maxW: "10em" }), "가"), vo6Fr(vo6Stack(VO6_D.ex11b, { s: 22, frame: [5, 3, 2], maxW: "10em" }), "나")), vo6Redrawn("쌓기나무 모양은 지도서의 답(가 20개, 나 18개)이 그대로 나오도록 이 앱이 정했어요.")),
        parts: ["가의 부피는 ", { n: 20 }, " cm³이고, 나의 부피는 ", { n: 18 }, " cm³예요. ", { o: ["가", "나"], a: 0 }, "의 부피가 더 커요."] }],
        { ok: "가는 5 × 2 × 2 = 20(cm³), 나는 3 × 3 × 2 = 18(cm³)이니까 가의 부피가 더 커요." }) },
    { name: "2번", inst: "□ 안에 알맞은 수를 써넣으세요.", hints: ["1 m³ = 1000000 cm³예요.", "1 m = 100 cm이고 100 × 100 × 100 = 1000000이에요."],
      render: (b, a) => vo6Ask(b, a, [
        { parts: ["2 m³ = ", { n: 2000000, w: "8em", why: { "200": "1 m³ = 100 cm³가 아니에요. 1 m³ = 1000000 cm³예요.", "20000": "1 m³ = 10000 cm³가 아니에요. 1 m³ = 1000000 cm³예요." } }, " cm³"] },
        { parts: ["130000000 cm³ = ", { n: 130, why: { "1300": "1000000으로 나누어요. 130000000 ÷ 1000000 = 130이에요.", "13": "0의 개수를 다시 세어 봐요. 130000000 ÷ 1000000 = 130이에요." } }, " m³"] }],
        { ok: "2 m³ = 2000000 cm³, 130000000 cm³ = 130 m³예요." }) },
    { name: "3번", inst: "직육면체와 정육면체의 부피와 겉넓이를 구해 보세요.", hints: ["부피는 세 길이를 곱하고, 겉넓이는 세 면의 넓이의 합을 2배 해요.", "정육면체의 겉넓이는 한 면의 넓이 × 6이에요."],
      render: (b, a) => vo6Ask(b, a, [
        { fig: () => vo6Cub([9, 5, 2], "cm", { s: 16 }), parts: ["부피 ", { n: 90 }, " cm³, 겉넓이 ", { n: 146, why: { "73": "세 면의 넓이만 더했어요. 2배 해요.", "90": "90은 부피예요." } }, " cm²"] },
        { fig: () => vo6Cub([7, 7, 7], "cm", { s: 14 }), parts: ["부피 ", { n: 343, why: { "49": "49는 한 면의 넓이예요. 7을 한 번 더 곱해요." } }, " cm³, 겉넓이 ", { n: 294, why: { "343": "343은 부피예요. 겉넓이는 49 × 6이에요." } }, " cm²"] }],
        { ok: "직육면체: 9 × 5 × 2 = 90(cm³), 45 × 2 + 18 × 2 + 10 × 2 = 146(cm²) / 정육면체: 343 cm³, 49 × 6 = 294(cm²)예요." }) },
    { name: "4번", inst: "선물 상자를 겹치는 부분 없이 포장했어요. 잘못 구한 것을 찾아 옳게 고쳐 보세요. “선물 상자의 한 밑면의 넓이는 30 cm²이고 옆면의 넓이의 합은 52 cm²이므로 사용한 포장지의 넓이는 30 + 52 = 82 (cm²)입니다.”", hints: ["직육면체의 밑면은 몇 개일까요?", "(겉넓이) = (한 밑면의 넓이) × 2 + (옆면의 넓이)"],
      render: (b, a) => vo6Ask(b, a, [{ fig: () => vo6Cub([10, 3, 2], "cm", { s: 18 }),
        parts: ["밑면은 ", { n: 2, why: { "1": "직육면체의 밑면은 위와 아래에 두 개 있어요." } }, "개이므로 사용한 포장지의 넓이는 30 × ", { n: 2 }, " + 52 = ", { n: 112, why: { "82": "82는 밑면을 한 개만 더한 넓이예요." } }, " (cm²)입니다."] }],
      { ok: "한 밑면의 넓이는 30 cm²이고 옆면의 넓이의 합은 52 cm²이므로 사용한 포장지의 넓이는 30 × 2 + 52 = 112(cm²)예요." }) },
    { name: "5번", inst: "한 변의 길이가 4 m인 정사각형을 밑면으로 하고, 높이가 6 m인 직육면체의 부피와 겉넓이를 구해 보세요.", hints: ["밑면이 정사각형이니까 가로와 세로가 모두 4 m예요.", "옆면은 4 m × 6 m인 직사각형 4개예요."],
      render: (b, a) => vo6Chain(b, a, [
        (bx, ax) => vo6Ask(bx, ax, [{ q: "이해해요 ― 알고 있는 것은 무엇인가요?", parts: ["직육면체의 가로는 ", { n: 4 }, " m, 세로는 ", { n: 4 }, " m, 높이는 ", { n: 6 }, " m예요."] }]),
        (bx, ax) => quiz(bx, ax, [{ q: "계획해요 ― 어떻게 구하면 좋을까요?", o: ["부피는 (가로) × (세로) × (높이), 겉넓이는 (한 밑면의 넓이) × 2 + (옆면의 넓이)로 구해요.", "부피와 겉넓이 모두 가로, 세로, 높이를 더해요."], a: 0 }]),
        (bx, ax) => vo6Ask(bx, ax, [{ q: "해결해요", fig: () => vo6Cub([4, 4, 6], "m", { s: 16 }), parts: ["부피: 4 × 4 × 6 = ", { n: 96 }, " (m³) · 겉넓이: 16 × 2 + 24 × 4 = ", { n: 128, why: { "80": "옆면은 4개예요. 16 × 2 + 24 × 2가 아니라 16 × 2 + 24 × 4예요.", "56": "밑면 2개와 옆면 4개를 모두 더해요." } }, " (m²)"] }]),
        (bx, ax) => writeStep(bx, ax, [{ q: "되돌아봐요 ― 다른 방법으로도 겉넓이를 구해 확인해 보세요.", tag: "되돌아봐요", ph: "예) 옆면을 하나의 직사각형으로 보면 (4 + 4 + 4 + 4) × 6 = 96, 16 × 2 + 96 = 128(m²)로 같아요." }])]) },
    { name: "6번", inst: "“케이크 상자보다 부피가 더 큰 상자를 찾고 있어.” “세 상자의 부피를 각각 구해서 비교해 보자.” 케이크 상자는 한 모서리가 40 cm인 정육면체, 초콜릿 상자는 가로 30 cm, 세로 60 cm, 높이 20 cm, 도넛 상자는 가로 40 cm, 세로 30 cm, 높이 0.6 m예요.", hints: ["도넛 상자의 높이는 m로 되어 있어요. 단위를 cm로 맞추어요.", "0.6 m = 60 cm예요."],
      render: (b, a) => vo6Ask(b, a, [{ fig: () => h("div", { class: "vo6figs" }, vo6Fr(vo6Cub([40, 40, 40], "cm", { s: 2.4 }), "케이크 상자"), vo6Fr(vo6Cub([30, 60, 20], "cm", { s: 2.4 }), "초콜릿 상자"), vo6Fr(vo6Cub([40, 30, 60], "cm", { s: 2.4, labels: { a: "40 cm", b: "30 cm", c: "0.6 m" } }), "도넛 상자")),
        parts: ["케이크 상자 ", { n: 64000 }, " cm³, 초콜릿 상자 ", { n: 36000 }, " cm³, 도넛 상자 ", { n: 72000, why: { "720": "높이 0.6 m를 cm로 바꾸지 않고 곱했어요. 0.6 m = 60 cm예요." } }, " cm³ → 케이크 상자보다 부피가 더 큰 상자는 ", { o: ["초콜릿", "도넛"], a: 1 }, " 상자예요."] }],
      { ok: "72000 > 64000 > 36000이므로 도넛 상자예요. 단위가 다르면 먼저 단위를 맞추어요." }) },
    { name: "정리하기", inst: "확인하고 정리해요. 빈칸에 알맞은 말이나 수를 골라 보세요.", hints: ["부피는 세 길이를 곱해요.", "평행한 두 면은 넓이가 같아요. 정육면체는 여섯 면이 모두 같아요."],
      render: (b, a) => blanks(b, a, ["1 m³ = ", { o: ["1000000", "10000", "100"], a: 0 }, " cm³ · 직육면체: (부피) = (가로) × (", { o: ["세로", "둘레"], a: 0 }, ") × (높이), (겉넓이) = (면 ㉮의 넓이) × ", { o: ["2", "6", "3"], a: 0 }, " + (면 ㉯의 넓이) × 2 + (면 ㉰의 넓이) × 2 · 정육면체: (겉넓이) = (한 면의 넓이) × ", { o: ["6", "2", "4"], a: 0 }],
        { ok: "잘 정리했어요. 부피와 겉넓이를 구하는 여러 방법 중 편리한 방법을 골라 써요." }) }
  ],
  challenge: { inst: "겉넓이가 150 cm²인 정육면체가 있어요. 이 정육면체의 한 모서리의 길이와 부피를 구해 보세요.", hints: ["정육면체의 겉넓이는 (한 면의 넓이) × 6이에요.", "한 면의 넓이가 25 cm²인 정사각형의 한 변은 5 cm예요."],
    render: (b, a) => vo6Ask(b, a, [{ parts: ["한 면의 넓이는 150 ÷ 6 = ", { n: 25 }, " (cm²), 한 모서리의 길이는 ", { n: 5, why: { "25": "25 cm²는 한 면의 넓이예요. 같은 수를 두 번 곱해 25가 되는 수를 찾아요." } }, " cm, 부피는 ", { n: 125 }, " cm³예요."] }],
      { ok: "150 ÷ 6 = 25, 5 × 5 = 25이니까 한 모서리는 5 cm, 부피는 5 × 5 × 5 = 125(cm³)예요." }) }
}
];
