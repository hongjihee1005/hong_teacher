//@@APP
const APP={title:"영상 촬영 학교 공간과 입체", unit:"6-2 수학 3. 공간과 입체(교과서)", key:"t62-space-v1", welcome:"영상 촬영 학교 공간과 입체 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 영상 촬영 학교에 간 규진이와 시연이와 함께 여러 방향에서 본 모습을 알아보고, 쌓기나무로 발전소·시청·식물원·호텔 모양을 쌓으며 위·앞·옆에서 본 모양, 위에서 본 모양에 수를 쓰는 방법, 층별로 나타내는 방법으로 쌓기나무의 개수를 구해 봐요."};
//@@UNIT
/* =========================================================
   6-2 수학 3. 공간과 입체 — 단원 조작 부품 (앞글자 sp6)
   쌓기나무 배치는 H[줄][칸] = 그 자리에 쌓은 개수로 적어요(줄 0이 뒤, 마지막 줄이 앞, 칸 0이 왼쪽).
   투영도·위/앞/옆에서 본 모양·층별 모양·보이는지 숨었는지는 모두 이 배치에서 코드로 계산해요.
   교과서 그림은 지도서에서 받을 수 없어서, 지도서의 답(개수·층별 개수·숨은 쌓기나무 수)이 그대로 나오도록 이 앱이 배치를 새로 그렸어요.
   sp6Iso      투영도(오른쪽 앞 위에서 본 그림)       sp6View     위·앞·옆에서 본 모양, 수를 쓴 모양, 층별 모양
   sp6Build    판을 눌러 쌓기나무 쌓기(조건 채점)       sp6Paint    모눈 칸을 칠해 위·앞·옆·층별 모양 그리기
   sp6Nums     위에서 본 모양에 수 쓰기                  sp6Pick     그림 카드 고르기
   sp6Turn     다섯 방향에서 본 모양 살펴보기            sp6Layers   층별로 떼어 보기
   sp6Scene    사진기를 돌려 여러 방향에서 본 모습 보기  sp6Guess    위→앞→옆 차례로 보고 맞히기 놀이
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.sp6fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:manipulation}
.sp6fig.sp6plain{background:transparent;border:none}
.sp6small{font-size:var(--fs-s);color:var(--muted)}
.sp6part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.sp6row{display:flex;flex-wrap:wrap;gap:.7em;align-items:flex-start}
.sp6row>div{flex:1 1 13em;min-width:0}
.sp6box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all}
.sp6figs{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-end;justify-content:flex-start;margin:.3em 0}
.sp6figs>figure{margin:0;flex:0 1 auto;min-width:0;text-align:center}
.sp6figs>figure>figcaption{font-family:"Jua",sans-serif;font-size:var(--fs-s);color:var(--night)}
.sp6btns{display:flex;flex-wrap:wrap;gap:.35em;align-items:center;margin:.3em 0}
.sp6btns button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em;min-height:2.2em}
.sp6btns button.sp6-pick{background:var(--night);color:#fff;border-color:var(--night)}
.sp6board{display:inline-grid;gap:4px;padding:6px;background:#E9EEF0;border-radius:12px;touch-action:manipulation}
.sp6board button{width:2.6em;height:2.6em;border:2px solid #B9C6CC;border-radius:8px;background:#fff;font-family:"Jua",sans-serif;font-size:1.15em;padding:0;color:var(--night)}
.sp6board button.sp6h1{background:#FFF1CC}.sp6board button.sp6h2{background:#FFD98A}.sp6board button.sp6h3{background:#F8B25C}.sp6board button.sp6h4{background:#E88A3A;color:#fff}
.sp6board button.sp6lock{border-style:dashed;border-color:#8E7B62}
.sp6side{font-family:"Jua",sans-serif;font-size:var(--fs-s);color:var(--muted);text-align:center}
.sp6build{display:flex;flex-wrap:wrap;gap:.8em;align-items:flex-start}
.sp6build>.sp6l{flex:0 0 auto}
.sp6build>.sp6r{flex:1 1 12em;min-width:0;max-width:22em}
.sp6cnt{font-family:"Jua",sans-serif;color:var(--night)}
.sp6paint{display:inline-grid;gap:2px;padding:4px;background:#DCE6EC;border-radius:8px;touch-action:manipulation}
.sp6paint button{width:2.1em;height:2.1em;border:1.5px solid #AEBFC8;border-radius:4px;background:#fff;padding:0}
.sp6paint button.sp6-on{background:#7FB3E6;border-color:#3A6EA5}
.sp6paint.sp6-good{outline:3px solid var(--ok)}.sp6paint.sp6-bad{outline:3px solid var(--no)}
.sp6pt{display:inline-block;vertical-align:top;margin:.2em .5em .4em 0;text-align:center}
.sp6pt .sp6ttl{font-family:"Jua",sans-serif;margin-bottom:.15em}
.sp6ground{height:3px;background:#5A6B73;border-radius:2px;margin-top:2px}
.sp6numgrid{display:inline-grid;gap:3px;padding:5px;background:#E3EDF5;border-radius:10px}
.sp6numgrid input,.sp6numgrid span{width:2.4em;height:2.4em;text-align:center;font-size:1.15em;font-family:"Jua",sans-serif;border-radius:6px;box-sizing:border-box;padding:0}
.sp6numgrid input{border:2px solid #7FA6C9;background:#fff}
.sp6numgrid span{display:flex;align-items:center;justify-content:center}
.sp6numgrid span.sp6given{background:#CFE3F7;border:2px solid #7FA6C9;color:var(--night)}
.sp6cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(9em,1fr));gap:.5em;margin:.4em 0}
.sp6card{border:2.5px solid var(--line);background:#fff;border-radius:12px;padding:.25em;text-align:center;cursor:pointer;min-width:0;font-family:"Jua",sans-serif}
.sp6card svg{width:100%;height:auto;display:block}
.sp6card.sp6-pick{border-color:var(--ring);background:#EAF3FD;box-shadow:0 0 0 2px var(--ring) inset}
.sp6card.sp6-good{border-color:var(--ok);background:#E3F4EA}
.sp6card.sp6-bad{border-color:var(--no);background:#FBE7E2}
.sp6tag{display:inline-block;border-radius:999px;background:#F2F5F4;border:1.5px solid var(--line);padding:0 .6em;margin:.1em;font-size:var(--fs-s)}
.sp6redraw{font-size:var(--fs-s);color:var(--muted);margin:.2em 0}
.sp6score{display:flex;flex-wrap:wrap;gap:.5em;align-items:center;font-family:"Jua",sans-serif}
.sp6score b{font-size:1.4em;color:var(--night)}
.sp6photo{border:2.5px solid #8C9AA3;border-radius:10px;background:#fff;overflow:hidden}
`;
  document.head.append(s);
})();
/* ---------- 계산 핵심 (화면 없이도 돌아감) ---------- */
/* 쌓기나무 배치 H: H[줄][칸] = 그 자리의 개수. 줄 0이 뒤, 마지막 줄이 앞. 칸 0이 왼쪽. */
const sp6Clone = H => H.map(r => r.slice());
const sp6Sum = H => H.reduce((s, r) => s + r.reduce((t, v) => t + v, 0), 0);
const sp6Max = H => Math.max(0, ...H.map(r => Math.max(0, ...r)));
function sp6Cubes(H) { const C = []; H.forEach((row, y) => row.forEach((n, x) => { for (let z = 0; z < n; z++) C.push([x, y, z]); })); return C; }
/* 위·앞·옆(오른쪽)에서 본 모양. 옆 모양은 왼쪽이 앞줄 */
function sp6Views(H) {
  const R = H.length, C = H[0].length;
  const top = H.map(r => r.map(v => v > 0 ? 1 : 0));
  const front = []; for (let x = 0; x < C; x++) { let m = 0; for (let y = 0; y < R; y++) m = Math.max(m, H[y][x]); front.push(m); }
  const side = []; for (let y = R - 1; y >= 0; y--) side.push(Math.max(...H[y]));
  return { top, front, side };
}
const sp6Layer = (H, k) => H.map(r => r.map(v => v >= k ? 1 : 0));
const sp6LayerCount = (H, k) => sp6Sum(sp6Layer(H, k));
/* 투영도(오른쪽 앞 위에서 본 그림)에서 보이는 면: 면을 세모 두 개로 나누어 화면의 같은 세모끼리 가장 앞에 있는 면만 남김 */
const SP6_FACES = [
  ["t", (x, y, z) => [[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]],
  ["f", (x, y, z) => [[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]],
  ["r", (x, y, z) => [[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]]]];
function sp6Seen(H) {
  const best = new Map();
  sp6Cubes(H).forEach((c, ci) => SP6_FACES.forEach(([t, F]) => {
    const q = F(...c);
    [[q[0], q[1], q[2]], [q[0], q[2], q[3]]].forEach(tri => {
      const g = [0, 1, 2].map(k => (tri[0][k] + tri[1][k] + tri[2][k]) / 3);
      const a = g[0] - g[1], b = g[0] + g[1] - 2 * g[2], d = g[0] + g[1] + g[2];
      const key = Math.round(a * 3) + "," + Math.round(b * 3), o = best.get(key);
      if (!o || d > o.d + 1e-9) best.set(key, { d, t, ci });
    });
  }));
  return best;
}
/* 투영도가 똑같이 보이는지 비교하는 열쇠 */
function sp6Sig(H) { return [...sp6Seen(H)].map(([k, o]) => k + ":" + o.t + ":" + o.d.toFixed(2)).sort().join("|"); }
/* 보이는 쌓기나무의 수 */
function sp6VisibleCount(H) { const s = new Set(); sp6Seen(H).forEach(o => s.add(o.ci)); return s.size; }
/* 윗면이 보이지 않는 자리(숨겨진 자리) — [[줄, 칸], …] */
function sp6HiddenCols(H) {
  const C = sp6Cubes(H), seen = new Set();
  sp6Seen(H).forEach(o => { if (o.t === "t") { const c = C[o.ci]; seen.add(c[1] + "," + c[0]); } });
  const out = []; H.forEach((r, y) => r.forEach((v, x) => { if (v && !seen.has(y + "," + x)) out.push([y, x]); })); return out;
}
/* 투영도에 전혀 보이지 않는 자리 / 윗면이 보이는 자리 */
function sp6Look(H) {
  const C = sp6Cubes(H), any = new Set(), top = new Set();
  sp6Seen(H).forEach(o => { const c = C[o.ci], k = c[1] + "," + c[0]; any.add(k); if (o.t === "t") top.add(k); });
  const gone = [], part = [];
  H.forEach((r, y) => r.forEach((v, x) => { if (!v) return; const k = y + "," + x; if (!any.has(k)) gone.push([y, x]); else if (!top.has(k)) part.push([y, x]); }));
  return { gone, part };   // gone: 통째로 숨은 자리, part: 옆면만 보이고 윗면이 안 보이는 자리
}
/* 바닥 자리가 서로 변으로 이어져 있는지(면과 면이 맞닿게 쌓았는지) */
function sp6Joined(H) {
  const cells = []; H.forEach((r, y) => r.forEach((v, x) => { if (v) cells.push(y + "," + x); }));
  if (!cells.length) return false;
  const set = new Set(cells), seen = new Set([cells[0]]), q = [cells[0]];
  while (q.length) { const [y, x] = q.shift().split(",").map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const k = (y + a) + "," + (x + b); if (set.has(k) && !seen.has(k)) { seen.add(k); q.push(k); } }); }
  return seen.size === cells.length;
}
/* 크기 R×C, 높이 0~M인 모든 배치 중 조건에 맞는 것 */
function sp6All(R, C, M, ok) {
  const out = [], n = R * C, cur = Array(n).fill(0);
  const rec = i => { if (i === n) { const H = []; for (let y = 0; y < R; y++) H.push(cur.slice(y * C, y * C + C)); if (ok(H)) out.push(H); return; } for (let v = 0; v <= M; v++) { cur[i] = v; rec(i + 1); } };
  rec(0); return out;
}
const sp6Same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/* 투영도(+위에서 본 모양, 또는 위·앞·옆에서 본 모양)로 만들 수 있는 배치 모두 */
function sp6Possible(H, opt = {}) {
  const R = H.length, C = H[0].length, M = opt.M || 4, sig = sp6Sig(H), V = sp6Views(H), out = [];
  const topSeen = new Set(); { const CC = sp6Cubes(H); sp6Seen(H).forEach(o => { if (o.t === "t") topSeen.add(CC[o.ci][1] + "," + CC[o.ci][0]); }); }
  const cells = []; for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
    let lo = 0, hi = M;
    if (opt.top || opt.views) { if (!V.top[y][x]) continue; lo = 1; }
    if (opt.views) hi = Math.min(V.front[x], V.side[R - 1 - y]);
    else if (H[y][x] && topSeen.has(y + "," + x)) { lo = hi = H[y][x]; }   // 윗면이 보이는 자리는 높이가 정해짐
    cells.push([y, x, lo, hi]);
  }
  const G = H.map(r => r.map(() => 0));
  const rec = i => {
    if (i === cells.length) { if ((opt.views ? sp6Same(sp6Views(G), V) : true) && (opt.views && !opt.iso ? true : sp6Sig(G) === sig)) out.push(sp6Clone(G)); return; }
    const [y, x, lo, hi] = cells[i]; for (let v = lo; v <= hi; v++) { G[y][x] = v; rec(i + 1); } G[y][x] = 0;
  };
  rec(0); return out;
}

/* ---------- 글자·수 도우미 ---------- */
/* 받침에 따라 조사 고르기: sp6Jo("12", "을/를") → "12를" */
function sp6Jo(w, pair) {
  const s = String(w), [a, b] = pair.split("/"), c = s.trim().slice(-1);
  let bat = false, rieul = false;
  if (/[0-9]/.test(c)) { bat = "0136780".includes(c); rieul = "178".includes(c); }
  else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  if (pair === "으로/로") return s + (bat && !rieul ? "으로" : "로");
  return s + (bat ? a : b);
}
function sp6Num(s) {
  const t = String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/(개|층|번째|째)$/, "");
  return t === "" || !/^-?\d+$/.test(t) ? NaN : Number(t);
}
const SP6 = { ink: "#4A3524", top: "#FFE7AE", front: "#F4B46C", right: "#DC8C4A", floor: "#EEF2EE", floorLine: "#CBD5CE",
  blue: "#2B7BD6", red: "#D64545", green: "#2E8B57", gray: "#7D8A90", view: "#9CC8F0", viewLine: "#3A6EA5", ghost: "#5B8DE0" };
const SP6_KO = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥", "㉦"];
const sp6R = v => Math.round(v * 100) / 100;
const sp6Go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
function sp6Fig(W, H, draw, maxW, plain) { const s = makeSvg(W, H); draw(s); s.setAttribute("class", "sp6fig" + (plain ? " sp6plain" : "")); s.style.maxWidth = maxW || "30em"; return s; }
function sp6Box(svg, x0, y0, x1, y1, maxW, plain) { svg.setAttribute("viewBox", `${sp6R(x0)} ${sp6R(y0)} ${sp6R(x1 - x0)} ${sp6R(y1 - y0)}`); svg.setAttribute("class", "sp6fig" + (plain ? " sp6plain" : "")); svg.style.maxWidth = maxW || "16em"; return svg; }

/* ---------- 투영도 ----------
   opt: k(크기) · frame [R,C,M](판 크기를 고정해서 그림) · floor(바닥 칸) · front/side(방향 글) · tint{"y,x":[윗,앞,옆]} · xray[[y,x]…](숨은 자리를 비쳐 보이게)
        marks[{y,x,t}](자리 기호) · only(층 번호: 그 층만 진하게) · maxW · plain */
function sp6Iso(H, opt = {}) {
  const R = opt.frame ? opt.frame[0] : H.length, C = opt.frame ? opt.frame[1] : H[0].length;
  const Mz = Math.max(opt.frame ? opt.frame[2] || 0 : 0, sp6Max(H), 1), u = 26 * (opt.k || 1), v = 15 * (opt.k || 1);
  const P = (x, y, z) => [sp6R((x - y) * u), sp6R((x + y - 2 * z) * v)];
  const pts = a => a.map(p => P(...p).join(",")).join(" ");
  const s = svgEl("svg", { role: "img", "aria-label": opt.label || "쌓기나무로 만든 모양" });
  const g = svgEl("g", { "stroke-linejoin": "round" }); s.append(g);
  if (opt.floor !== false) for (let y = 0; y < R; y++) for (let x = 0; x < C; x++)
    g.append(svgEl("polygon", { points: pts([[x, y, 0], [x + 1, y, 0], [x + 1, y + 1, 0], [x, y + 1, 0]]), fill: SP6.floor, stroke: SP6.floorLine, "stroke-width": 1 }));
  const cubes = [];
  H.forEach((row, y) => row.forEach((n, x) => { for (let z = 0; z < n; z++) cubes.push([x, y, z]); }));
  cubes.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[2] - b[2]);
  const xr = new Set((opt.xray || []).map(([y, x]) => y + "," + x));
  cubes.forEach(([x, y, z]) => {
    if (xr.has(y + "," + x)) return;
    let col = (opt.tint && opt.tint[y + "," + x]) || [SP6.top, SP6.front, SP6.right];
    const dim = opt.only && z + 1 !== opt.only;
    if (dim) col = ["#F4F1EA", "#E9E4DA", "#DDD7CB"];
    const st = { stroke: dim ? "#B9B1A3" : SP6.ink, "stroke-width": 1.5 };
    SP6_FACES.forEach(([t, F], i) => g.append(svgEl("polygon", Object.assign({ points: pts(F(x, y, z)), fill: col[i] }, st))));
  });
  if (xr.size) cubes.forEach(([x, y, z]) => {
    if (!xr.has(y + "," + x)) return;
    SP6_FACES.forEach(([t, F]) => g.append(svgEl("polygon", { points: pts(F(x, y, z)), fill: "rgba(91,141,224,.22)", stroke: SP6.ghost, "stroke-width": 1.8, "stroke-dasharray": "4 3" })));
  });
  (opt.marks || []).forEach(m => { const z = H[m.y] ? H[m.y][m.x] || 0 : 0, c = P(m.x + .5, m.y + .5, z); g.append(txt(c[0], c[1] + 1, m.t, 15 * (opt.k || 1), { fill: SP6.red, "font-weight": 700 })); });
  let x0 = -R * u - 6, x1 = C * u + 6, y0 = -2 * Mz * v - 6, y1 = (R + C) * v + 6;
  if (opt.front !== false) {
    const a = P(C / 2, R + .25, 0), b = P(C / 2, R + 1.15, 0);
    g.append(svgEl("line", { x1: b[0], y1: b[1], x2: a[0], y2: a[1], stroke: SP6.blue, "stroke-width": 2 }), svgEl("polygon", { points: `${a[0]},${a[1]} ${sp6R(a[0] + 9)},${sp6R(a[1] - 1)} ${sp6R(a[0] + 3)},${sp6R(a[1] + 8)}`, fill: SP6.blue }));
    g.append(txt(b[0] - 9, b[1] + 6, "앞", 15, { fill: SP6.blue }));
    x0 = Math.min(x0, b[0] - 22); y1 = Math.max(y1, b[1] + 16);
  }
  if (opt.side) {
    const a = P(C + .25, R / 2, 0), b = P(C + 1.15, R / 2, 0);
    g.append(svgEl("line", { x1: b[0], y1: b[1], x2: a[0], y2: a[1], stroke: SP6.green, "stroke-width": 2 }), svgEl("polygon", { points: `${a[0]},${a[1]} ${sp6R(a[0] - 9)},${sp6R(a[1] - 1)} ${sp6R(a[0] - 3)},${sp6R(a[1] + 8)}`, fill: SP6.green }));
    g.append(txt(b[0] + 12, b[1] + 6, "옆", 15, { fill: SP6.green }));
    x1 = Math.max(x1, b[0] + 24); y1 = Math.max(y1, b[1] + 16);
  }
  return sp6Box(s, x0, y0, x1, y1, opt.maxW || "15em", opt.plain);
}

/* ---------- 위·앞·옆에서 본 모양 ----------
   kind "top": V = 0/1(또는 수) 칸 그림, 아래쪽이 앞 · kind "front"/"side": V = 세로줄마다 높이, rows 칸 높이
   opt: nums(수를 써 보임) · frame(빈 자리를 흐린 점선으로) · title · cell · maxW · mark{"y,x":글} */
function sp6View(kind, V, opt = {}) {
  const c = opt.cell || 30, pad = 6, top = kind === "top" || kind === "layer";
  const cols = top ? V[0].length : V.length, rows = top ? V.length : (opt.rows || Math.max(1, ...V));
  const tH = opt.title ? 22 : 0, fH = top && opt.frontLabel !== false ? 18 : 0;
  const W = cols * c + pad * 2, Ht = rows * c + pad * 2 + tH + fH + (top ? 0 : 4);
  return sp6Fig(W, Ht, s => {
    if (opt.title) s.append(txt(W / 2, 12, opt.title, 15, { fill: SP6.ink }));
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const on = top ? V[r][q] > 0 : V[q] >= rows - r, x = pad + q * c, y = tH + pad + r * c;
      if (on) s.append(svgEl("rect", { x, y, width: c, height: c, fill: opt.fill || SP6.view, stroke: SP6.viewLine, "stroke-width": 2 }));
      else if (opt.frame) s.append(svgEl("rect", { x: x + 1, y: y + 1, width: c - 2, height: c - 2, fill: "none", stroke: "#D5DEE3", "stroke-width": 1, "stroke-dasharray": "3 3" }));
      const mk = opt.mark && opt.mark[r + "," + q];
      if (on && top && opt.nums && !mk) s.append(txt(x + c / 2, y + c / 2 + 1, String(V[r][q]), c * .55, { fill: SP6.ink }));
      if (mk) s.append(txt(x + c / 2, y + c / 2 + 1, mk, c * .5, { fill: SP6.red }));
    }
    if (!top) s.append(svgEl("line", { x1: 2, x2: W - 2, y1: tH + pad + rows * c + 2, y2: tH + pad + rows * c + 2, stroke: "#5A6B73", "stroke-width": 3 }));
    if (fH) s.append(txt(W / 2, Ht - 8, "앞", 13, { fill: SP6.blue }));
  }, opt.maxW || (Math.max(4.5, cols * 1.9) + "em"), opt.plain);
}
/* 위·앞·옆에서 본 모양을 한 줄로 */
function sp6Views3(V, opt = {}) {
  const rows = opt.rows || Math.max(...V.front, ...V.side), f = (el, cap) => h("figure", {}, el, h("figcaption", {}, cap));
  const show = opt.show || ["top", "front", "side"];
  return h("div", { class: "sp6figs" },
    show.includes("top") ? f(sp6View("top", opt.nums || V.top, { nums: !!opt.nums, cell: opt.cell }), "위에서 본 모양") : null,
    show.includes("front") ? f(sp6View("front", V.front, { rows, cell: opt.cell }), "앞에서 본 모양") : null,
    show.includes("side") ? f(sp6View("side", V.side, { rows, cell: opt.cell }), "옆에서 본 모양") : null);
}
/* 층별로 나타낸 모양 */
function sp6LayerFigs(H, opt = {}) {
  const n = opt.n || sp6Max(H), out = h("div", { class: "sp6figs" });
  for (let k = 1; k <= n; k++) out.append(h("figure", {}, sp6View("layer", sp6Layer(H, k), { frame: true, cell: opt.cell || 26 }), h("figcaption", {}, k + "층")));
  return out;
}
/* 투영도 + 위에서 본 모양 */
function sp6IsoTop(H, opt = {}) {
  return h("div", { class: "sp6figs" }, h("figure", {}, sp6Iso(H, opt), h("figcaption", {}, opt.cap || "쌓기나무로 만든 모양")),
    opt.top === false ? null : h("figure", {}, sp6View("top", sp6Views(H).top, { cell: 26 }), h("figcaption", {}, "위에서 본 모양")));
}
const sp6Redrawn = () => h("p", { class: "sp6redraw" }, "※ 교과서 그림 대신, 지도서의 답이 그대로 나오도록 이 앱에서 새로 그린 모양이에요.");

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기, 여러 개 고르기 multi) ---------- */
function sp6Ask(host, api, items, opts = {}) {
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
        const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": "답", style: `width:${pt.w || "3.6em"};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : String(pt.n);
  api.provide({ words: all.map(st => right(st.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : pt.nodeType ? " " : right(pt)).join("")) });
  const good = st => st.pt.o ? (st.pt.multi ? (st.v.size === st.pt.a.length && st.pt.a.every(i => st.v.has(i))) : st.v === st.pt.a) : sp6Num(st.inp.value) === st.pt.n;
  const val = st => st.pt.o ? (st.pt.multi ? ([...st.v].sort().map(i => st.pt.o[i]).join("·") || "-") : (st.v == null ? "-" : st.pt.o[st.v])) : (st.inp.value.trim() || "-");
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(st => {
      if (st.pt.o) [...st.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = st.pt.multi ? st.v.has(i) : st.v === i; if (picked) b.classList.add(good(st) ? "good" : "bad"); });
      else st.inp.style.borderColor = good(st) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(st => !good(st));
    if (!bad) return api.done(ans, opts.ok);
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(sp6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열려요 */
function sp6Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "sp6part" : "" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); sp6Go(body.lastChild);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}
/* 조작을 마친 뒤 물음(ask)으로 이어 가기 */
function sp6Then(body, api, opt, ans, msg, extra) {
  if (body.sp6Fin) return; body.sp6Fin = true;
  body.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "sp6part" }); body.append(box); opt.then(box, api, extra); sp6Go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask() : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = sp6Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle, bad: opt.bad }); sp6Go(w); }
  else api.done(ans, opt.ok || msg);
}

/* ---------- 쌓기나무 쌓기 ----------
   opt: R, C, M(한 자리 최대) · start(처음 배치) · lock(처음 배치는 뺄 수 없음) · show(문제 그림 함수) · live: "iso"|"views"|"layers" 배열
        check(G) → 맞으면 null, 틀리면 까닭 글 · distinct{n, key(G), more(남은 수)} 서로 다른 답 여러 개 · ok · then/ask */
function sp6Build(body, api, opt) {
  const R = opt.R, C = opt.C, M = opt.M || 3, start = opt.start || Array.from({ length: R }, () => Array(C).fill(0));
  let G = sp6Clone(start), mode = 1; const found = [], keys = new Set();
  if (opt.show) { const sh = opt.show(); if (sh) body.append(sh); }
  const board = h("div", { class: "sp6board", style: `grid-template-columns:repeat(${C},auto)` });
  const cells = [];
  for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
    const b = h("button", { type: "button", "aria-label": `${R - y}째 줄(앞에서부터) 왼쪽에서 ${x + 1}째 자리`, onclick: () => {
      const min = opt.lock ? start[y][x] : 0; G[y][x] = Math.max(min, Math.min(M, G[y][x] + mode)); paint();
    } });
    cells.push([y, x, b]); board.append(b);
  }
  const cnt = h("div", { class: "sp6cnt" }), prev = h("div"), live = h("div");
  const mB = [h("button", { type: "button", onclick: () => { mode = 1; paint(); } }, "＋ 쌓기"), h("button", { type: "button", onclick: () => { mode = -1; paint(); } }, "－ 빼기"),
    h("button", { type: "button", onclick: () => { G = sp6Clone(start); paint(); } }, "처음부터")];
  const foundBox = h("div", { class: "sp6small" });
  function paint() {
    cells.forEach(([y, x, b]) => { const v = G[y][x]; b.textContent = v ? String(v) : "​"; b.className = (v ? "sp6h" + v : "") + (opt.lock && start[y][x] ? " sp6lock" : ""); });
    mB[0].classList.toggle("sp6-pick", mode === 1); mB[1].classList.toggle("sp6-pick", mode === -1);
    cnt.textContent = `쌓은 쌓기나무 ${sp6Sum(G)}개`;
    prev.innerHTML = ""; prev.append(sp6Iso(G, { frame: [R, C, M], maxW: "100%", plain: true, label: "내가 쌓은 모양" }));
    live.innerHTML = "";
    const L = opt.live || [];
    if (L.includes("views")) live.append(sp6Views3(sp6Views(G), { cell: 20, rows: M }));
    if (L.includes("layers")) live.append(sp6LayerFigs(G, { n: M, cell: 18 }));
  }
  const checkB = h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const ans = JSON.stringify(G);
    if (!sp6Sum(G)) return api.fail("판의 칸을 눌러 쌓기나무를 쌓아 보세요.", ans);
    if (!sp6Joined(G)) return api.fail("떨어져 있는 쌓기나무가 있어요. 쌓기나무는 면과 면이 맞닿도록 붙여 쌓아요.", ans);
    const why = opt.check(G);
    if (why) return api.fail(why, ans);
    if (opt.distinct) {
      const key = opt.distinct.key ? opt.distinct.key(G) : JSON.stringify(G);
      if (keys.has(key)) return api.fail(opt.distinct.same || "앞에서 찾은 것과 같아요. 다르게 쌓아 보세요.", ans);
      keys.add(key); found.push(sp6Clone(G));
      foundBox.innerHTML = ""; foundBox.append(h("div", {}, "찾은 것: "), h("div", { class: "sp6figs" }, ...found.map((F, i) => h("figure", {}, sp6Iso(F, { frame: [R, C, M], maxW: "7em", front: false }), h("figcaption", {}, `${i + 1}. ${sp6Sum(F)}개`)))));
      if (found.length < opt.distinct.n) return api.hint("○ " + (opt.distinct.more ? opt.distinct.more(found) : "잘했어요! 다르게 쌓는 방법도 찾아보세요."));
    }
    sp6Then(body, api, opt, ans, opt.msg ? (typeof opt.msg === "function" ? opt.msg(G) : opt.msg) : "잘 쌓았어요!", sp6Clone(G));
  } }, "확인하기");
  api.provide({ words: opt.words || ["바닥부터", "면과 면이 맞닿게"], answers: opt.answers || [] });
  body.append(h("div", { class: "sp6build" },
    h("div", { class: "sp6l" }, h("div", { class: "sp6side" }, "뒤"), board, h("div", { class: "sp6side" }, "앞"), h("div", { class: "sp6btns" }, ...mB), cnt),
    h("div", { class: "sp6r" }, prev)), live, foundBox, h("p", { class: "sp6small" }, "판은 위에서 내려다본 바닥이에요. 칸을 누를 때마다 그 자리에 쌓기나무가 한 개씩 쌓여요(‘－ 빼기’를 고르면 한 개씩 빠져요)."),
    h("div", { class: "actions" }, checkB));
  paint();
}

/* ---------- 모눈 칸을 칠해 모양 그리기 ----------
   opt.items: [{title, kind:"top"|"up"|"layer", rows, cols, ans(0/1 칸, 0번 줄이 맨 위), exact}] · show() · ok · then/ask */
function sp6UpMat(heights, rows) { return Array.from({ length: rows }, (_, r) => heights.map(hh => hh >= rows - r ? 1 : 0)); }
function sp6Trim(m, keepBottom) {
  let r0 = 0, r1 = m.length - 1, c0 = 0, c1 = m[0].length - 1;
  const rowE = r => m[r].every(v => !v), colE = c => m.every(r => !r[c]);
  while (r0 <= r1 && rowE(r0)) r0++; if (!keepBottom) while (r1 >= r0 && rowE(r1)) r1--;
  while (c0 <= c1 && colE(c0)) c0++; while (c1 >= c0 && colE(c1)) c1--;
  if (r0 > r1 || c0 > c1) return [];
  return m.slice(r0, r1 + 1).map(r => r.slice(c0, c1 + 1).map(v => v ? 1 : 0));
}
function sp6Paint(body, api, opt) {
  if (opt.show) { const sh = opt.show(); if (sh) body.append(sh); }
  const st = opt.items.map(it => {
    const m = Array.from({ length: it.rows }, () => Array(it.cols).fill(0));
    const grid = h("div", { class: "sp6paint", style: `grid-template-columns:repeat(${it.cols},auto)` });
    for (let r = 0; r < it.rows; r++) for (let c = 0; c < it.cols; c++) grid.append(h("button", { type: "button", "aria-label": `${r + 1}째 줄 ${c + 1}째 칸`, onclick: e => {
      m[r][c] = m[r][c] ? 0 : 1; e.currentTarget.classList.toggle("sp6-on", !!m[r][c]); grid.classList.remove("sp6-good", "sp6-bad"); } }));
    if (opt.preset && it.preset) it.preset.forEach(([r, c]) => { m[r][c] = 1; grid.children[r * it.cols + c].classList.add("sp6-on"); });
    const box = h("div", { class: "sp6pt" }, h("div", { class: "sp6ttl" }, it.title), grid, it.kind === "up" ? h("div", { class: "sp6ground" }) : null,
      it.kind !== "up" ? h("div", { class: "sp6side" }, "앞") : null);
    return { it, m, grid, box };
  });
  body.append(h("div", {}, ...st.map(s => s.box)));
  body.append(h("p", { class: "sp6small" }, opt.tip || "칸을 누르면 색칠되고, 한 번 더 누르면 지워져요." + (opt.items.some(i => i.kind === "up") ? " 앞·옆에서 본 모양은 바닥 선 위에 그려요." : "")));
  api.provide({ words: ["바닥에 닿는 면", "가장 높은 층"], answers: [] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); let bad = null;
    const ansTxt = st.map(s => s.it.title + ":" + s.m.map(r => r.join("")).join("/")).join(" | ");
    st.forEach(s => {
      const a = s.it.exact ? s.it.ans.map(r => r.map(v => v ? 1 : 0)) : sp6Trim(s.it.ans, s.it.kind === "up");
      const p = s.it.exact ? s.m : sp6Trim(s.m, s.it.kind === "up");
      const ok = sp6Same(a, p); s.grid.classList.toggle("sp6-good", ok); s.grid.classList.toggle("sp6-bad", !ok);
      if (!ok && !bad) bad = s;
    });
    if (!bad) return sp6Then(body, api, opt, ansTxt, opt.msg || "모양을 바르게 그렸어요!");
    const it = bad.it, empty = bad.m.every(r => r.every(v => !v));
    let why = empty ? `‘${it.title}’에 칸을 칠해 보세요.` : `‘${it.title}’을 다시 살펴봐요.`;
    if (!empty && it.kind === "up") {
      const floating = bad.m.some((r, ri) => r.some((v, c) => v && ri < bad.m.length - 1 && !bad.m[ri + 1][c]));
      if (floating) why = `‘${it.title}’에 떠 있는 칸이 있어요. 앞·옆에서 본 모양은 바닥부터 빈칸 없이 칠해요.`;
      else {
        const hp = bad.m[0].map((_, c) => bad.m.filter(r => r[c]).length).filter(v => v), ha = it.ans[0].map((_, c) => it.ans.filter(r => r[c]).length).filter(v => v);
        if (hp.length !== ha.length) why = `‘${it.title}’은 세로줄이 ${ha.length}줄이에요. 줄 수를 다시 세어 봐요.`;
        else { const i = hp.findIndex((v, k) => v !== ha[k]); why = `‘${it.title}’의 왼쪽에서 ${i + 1}째 줄은 그 방향에서 본 가장 높은 층의 수만큼 칠해요.`; }
      }
    } else if (!empty && it.kind === "layer") why = `‘${it.title}’ 모양을 다시 살펴봐요. 층별 모양은 그 층을 위에서 본 모양이라 자리까지 맞아야 해요.`;
    else if (!empty && it.kind === "top") why = `‘${it.title}’을 다시 살펴봐요. 위에서 본 모양은 바닥에 닿아 있는 면의 모양과 같아요.`;
    api.fail(opt.why ? opt.why(it, bad.m) || why : why, ansTxt);
  } }, "확인하기");
  body.append(h("div", { class: "actions" }, check));
}
/* 배치 H에서 그리기 문제 만들기 */
function sp6PaintItems(H, kinds, opt = {}) {
  const V = sp6Views(H), R = H.length, C = H[0].length, M = opt.rows || sp6Max(H), out = [];
  const ex = opt.extra == null ? 1 : opt.extra;
  kinds.forEach(k => {
    if (k === "top") out.push({ title: "위에서 본 모양", kind: "top", rows: R + ex, cols: C + ex, ans: V.top });
    else if (k === "front") out.push({ title: "앞에서 본 모양", kind: "up", rows: M + (opt.exUp == null ? 1 : opt.exUp), cols: C + ex, ans: sp6UpMat(V.front, M) });
    else if (k === "side") out.push({ title: "옆에서 본 모양", kind: "up", rows: M + (opt.exUp == null ? 1 : opt.exUp), cols: R + ex, ans: sp6UpMat(V.side, M) });
    else { const n = +k.slice(1); out.push({ title: n + "층 모양", kind: "layer", rows: R, cols: C, ans: sp6Layer(H, n), exact: true }); }
  });
  return out;
}

/* ---------- 위에서 본 모양에 수 쓰기 ----------
   opt: H · show(문제 그림) · given(이미 쓴 수 보이기) · total(개수 묻기) · totalQ · ok · then/ask */
function sp6Nums(body, api, opt) {
  const H = opt.H, R = H.length, C = H[0].length;
  if (opt.show) { const sh = opt.show(); if (sh) body.append(sh); }
  const grid = h("div", { class: "sp6numgrid", style: `grid-template-columns:repeat(${C},2.4em)` }), ins = [];
  for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
    if (!H[y][x]) { grid.append(h("span", {}, "​")); continue; }
    if (opt.given) { grid.append(h("span", { class: "sp6given" }, String(H[y][x]))); continue; }
    const inp = h("input", { type: "text", inputmode: "numeric", maxlength: 1, "aria-label": `${R - y}째 줄(앞에서부터) 왼쪽에서 ${x + 1}째 자리` });
    ins.push({ inp, a: H[y][x], y, x }); grid.append(inp);
  }
  const tot = opt.total ? h("input", { type: "text", inputmode: "numeric", style: "width:3.6em;font-size:1.1em;text-align:center", "aria-label": "쌓기나무 개수" }) : null;
  body.append(h("div", { class: "sp6pt" }, h("div", { class: "sp6ttl" }, opt.title || "위에서 본 모양"), grid, h("div", { class: "sp6side" }, "앞")),
    tot ? h("p", { class: "sent" }, (opt.totalQ || "똑같은 모양으로 만드는 데 필요한 쌓기나무는") + " ", tot, " 개예요.") : null);
  const S = sp6Sum(H);
  api.provide({ words: ["각 자리의 개수", "모두 더하기"], answers: [(opt.given ? "" : "각 자리 수: " + ins.map(o => o.a).join(", ") + " · ") + (tot ? `${S}개` : "")] });
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = ins.map(o => o.inp.value.trim() || "-").join(",") + (tot ? " / " + (tot.value.trim() || "-") : "");
    let bad = null;
    ins.forEach(o => { const ok = sp6Num(o.inp.value) === o.a; o.inp.style.borderColor = ok ? "var(--ok)" : "var(--no)"; if (!ok && !bad) bad = o; });
    if (bad) {
      const v = sp6Num(bad.inp.value);
      if (isNaN(v)) return api.fail("빈칸이나 수가 아닌 칸이 있어요. 모든 자리에 쌓기나무의 개수를 써요.", ans);
      return api.fail(v < bad.a ? "보이지 않는 아래쪽 쌓기나무도 세었나요? 위에 있는 쌓기나무 아래에는 반드시 쌓기나무가 있어요." : "빨간 칸에 쌓인 쌓기나무의 개수를 다시 세어 봐요.", ans);
    }
    if (tot) { const v = sp6Num(tot.value), ok = v === S; tot.style.borderColor = ok ? "var(--ok)" : "var(--no)";
      if (!ok) return api.fail(opt.totalWhy && opt.totalWhy[String(v)] || "위에서 본 모양에 쓴 수를 모두 더해 봐요.", ans); }
    sp6Then(body, api, opt, ans, opt.msg || "각 자리의 개수를 바르게 썼어요!");
  } }, "확인하기");
  body.append(h("div", { class: "actions" }, check));
}

/* ---------- 그림 카드 고르기 ---------- */
function sp6Pick(body, api, opt) {
  const sel = new Set(), multi = Array.isArray(opt.a), A = multi ? opt.a : [opt.a];
  if (opt.show) { const sh = opt.show(); if (sh) body.append(sh); }
  const cards = opt.items.map((it, i) => { const c = h("div", { class: "sp6card", role: "button", tabindex: 0 }, it.fig ? it.fig() : null, h("div", {}, it.name));
    c.addEventListener("click", () => { if (!multi) { sel.clear(); cards.forEach(k => k.classList.remove("sp6-pick")); } sel.has(i) ? sel.delete(i) : sel.add(i); c.classList.toggle("sp6-pick", sel.has(i)); cards.forEach(k => k.classList.remove("sp6-good", "sp6-bad")); }); return c; });
  api.provide({ words: A.map(i => opt.items[i].name), answers: [A.map(i => opt.items[i].name).join(", ")] });
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), h("div", { class: "sp6cards", style: `grid-template-columns:repeat(auto-fill,minmax(${opt.cardW || "9em"},1fr))` }, ...cards),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const got = [...sel].sort().map(i => opt.items[i].name).join(", ") || "-";
      cards.forEach((c, i) => { c.classList.remove("sp6-good", "sp6-bad"); if (sel.has(i)) c.classList.add(A.includes(i) ? "sp6-good" : "sp6-bad"); });
      if (!sel.size) return api.fail("카드를 눌러 골라 보세요.", got);
      const ex = [...sel].find(i => !A.includes(i));
      if (ex != null) return api.fail(opt.whyExtra ? opt.whyExtra(ex) : `${opt.items[ex].name}은 답이 아니에요.`, got);
      if (sel.size < A.length) return api.fail(opt.whyMiss || `아직 ${A.length - sel.size}개 더 있어요.`, got);
      sp6Then(body, api, opt, got, opt.msg);
    } }, "확인하기")));
}

/* ---------- 다섯 방향에서 본 모양 살펴보기 ---------- */
function sp6DirView(H, d) {
  const V = sp6Views(H);
  if (d === "위") return { kind: "top", v: V.top };
  if (d === "앞") return { kind: "front", v: V.front };
  if (d === "뒤") return { kind: "front", v: V.front.slice().reverse() };
  if (d === "오른쪽") return { kind: "side", v: V.side };
  return { kind: "side", v: V.side.slice().reverse() };   // 왼쪽
}
function sp6Turn(body, api, opt) {
  const H = opt.H, dirs = ["위", "앞", "뒤", "왼쪽", "오른쪽"], seen = new Set(), M = sp6Max(H);
  const panel = h("div", { class: "sp6box", style: "min-height:6em" }, "방향 단추를 눌러 그 방향에서 본 모양을 살펴보세요.");
  const btns = dirs.map(d => h("button", { type: "button", onclick: () => show(d) }, d + "에서 보기"));
  function show(d) {
    seen.add(d); btns.forEach((b, i) => b.classList.toggle("sp6-pick", dirs[i] === d));
    const dv = sp6DirView(H, d);
    panel.innerHTML = ""; panel.append(h("div", { class: "jua" }, d + "에서 본 모양"), sp6View(dv.kind, dv.v, { rows: M, cell: 28, frontLabel: d === "위" }));
    if (d === "오른쪽") panel.append(h("p", { class: "sp6small" }, "오른쪽에서 볼 때는 내 왼쪽이 모양의 앞쪽이에요."));
    if (d === "왼쪽") panel.append(h("p", { class: "sp6small" }, "왼쪽에서 볼 때는 내 왼쪽이 모양의 뒤쪽이에요."));
    if (d === "뒤") panel.append(h("p", { class: "sp6small" }, "뒤에서 볼 때는 왼쪽과 오른쪽이 앞에서 볼 때와 바뀌어요."));
    if (seen.size === dirs.length && !body.sp6Fin) sp6Then(body, api, opt, "다섯 방향 모두 봄", "다섯 방향에서 본 모양을 모두 살펴봤어요.");
    else if (!body.sp6Fin) api.hint(`살펴본 방향 ${seen.size}개 / 5개`);
  }
  api.provide({ words: ["좌우로 뒤집으면 같다", "위, 앞, 옆"], answers: [] });
  body.append(h("div", { class: "sp6row" }, h("div", {}, sp6Iso(H, { side: true, maxW: "17em" })), h("div", {}, h("div", { class: "sp6btns" }, ...btns), panel)));
}

/* ---------- 층별로 떼어 보기 ---------- */
function sp6Layers(body, api, opt) {
  const H = opt.H, n = sp6Max(H), seen = new Set();
  const pic = h("div"), info = h("div", { class: "sp6box" }, "층 단추를 눌러 보세요. 그 층만 진하게 보여요.");
  const btns = [];
  for (let k = 1; k <= n; k++) btns.push(h("button", { type: "button", onclick: () => show(k) }, `${k}층${opt.names ? " · " + opt.names[k - 1] : ""}`));
  btns.push(h("button", { type: "button", onclick: () => show(0) }, "모두 보기"));
  function show(k) {
    btns.forEach((b, i) => b.classList.toggle("sp6-pick", (i + 1) % (n + 1) === k));
    pic.innerHTML = ""; pic.append(sp6Iso(H, { only: k || null, maxW: "17em" }));
    info.innerHTML = "";
    if (k) { seen.add(k); info.append(h("div", { class: "jua" }, `${k}층을 위에서 본 모양`), sp6View("layer", sp6Layer(H, k), { frame: true, cell: 26 })); }
    else info.append("모든 층을 함께 보고 있어요.");
    if (seen.size === n && !body.sp6Fin) sp6Then(body, api, opt, "층별로 살펴봄", "층마다 살펴봤어요.");
  }
  api.provide({ words: ["1층", "2층", "3층"], answers: [] });
  body.append(h("div", { class: "sp6btns" }, ...btns), h("div", { class: "sp6row" }, h("div", {}, pic), h("div", {}, info)));
  show(0);
}

/* ---------- 여러 방향에서 본 모습(사진기) ----------
   장면: objs [{kind, name, x, y, f:[fx,fy](앞쪽 방향)}] — 지도 좌표는 오른쪽이 동쪽, 아래쪽이 남쪽.
   사진기는 가운데를 바라보며 원 위를 돌아요(ang: 0 동쪽, 90 남쪽, 180 서쪽, 270 북쪽). 보이는 왼쪽·오른쪽 차례는 계산으로 정해요. */
const SP6_RC = 5;
function sp6Cam(ang) { const t = ang * Math.PI / 180, cam = [SP6_RC * Math.cos(t), SP6_RC * Math.sin(t)], d = [-Math.cos(t), -Math.sin(t)]; return { cam, d, r: [-d[1], d[0]] }; }
/* 사진기에서 본 차례: 왼쪽부터 [{o, u, depth, view, side}] */
function sp6Shot(objs, ang) {
  const { cam, d, r } = sp6Cam(ang);
  return objs.map(o => {
    const rel = [o.x - cam[0], o.y - cam[1]], u = rel[0] * r[0] + rel[1] * r[1], depth = rel[0] * d[0] + rel[1] * d[1];
    const f = o.f || [0, 1], toward = -(f[0] * d[0] + f[1] * d[1]), fr = f[0] * r[0] + f[1] * r[1];
    const view = Math.abs(toward) >= Math.abs(fr) ? (toward > 0 ? "front" : "back") : "side";
    return { o, u, depth, view, side: fr < 0 ? -1 : 1 };
  }).sort((a, b) => a.u - b.u);
}
const SP6_STONE = "#A7AFB4", SP6_STONE2 = "#8A949A";
/* 물건 그림(바닥 가운데가 (0,0), 위쪽이 −y). side = −1이면 앞쪽이 화면 왼쪽 */
function sp6Sprite(kind, view, side) {
  const g = svgEl("g"), P = (tag, a) => g.append(svgEl(tag, a)), ink = "#3B3B3B";
  const flip = side < 0 ? -1 : 1;
  if (kind === "gate") {
    if (view === "side") { P("rect", { x: -6, y: -78, width: 12, height: 78, fill: "#C98B52", stroke: ink, "stroke-width": 2 }); P("rect", { x: -9, y: -88, width: 18, height: 12, fill: "#8E5A2E", stroke: ink, "stroke-width": 2 }); }
    else { P("rect", { x: -44, y: -78, width: 12, height: 78, fill: "#C98B52", stroke: ink, "stroke-width": 2 }); P("rect", { x: 32, y: -78, width: 12, height: 78, fill: "#C98B52", stroke: ink, "stroke-width": 2 });
      P("rect", { x: -52, y: -90, width: 104, height: 14, fill: "#8E5A2E", stroke: ink, "stroke-width": 2 }); g.append(txt(0, -60, "입구", 13, { fill: "#5A3A1E" })); }
  } else if (kind === "clap") {
    if (view === "side") { P("rect", { x: -9, y: -50, width: 18, height: 50, fill: "#2E2E2E", stroke: ink, "stroke-width": 2 }); P("rect", { x: -9, y: -62, width: 18, height: 10, fill: "#F2F2F2", stroke: ink, "stroke-width": 2 }); }
    else { P("rect", { x: -28, y: -50, width: 56, height: 50, fill: "#2E2E2E", stroke: ink, "stroke-width": 2 });
      [-14, 0, 14].forEach(yy => P("line", { x1: -22, x2: 22, y1: -30 + yy * .9, y2: -30 + yy * .9, stroke: "#EEE", "stroke-width": 1.5 }));
      const bar = svgEl("g", { transform: "rotate(-14 -28 -52)" }); bar.append(svgEl("rect", { x: -28, y: -62, width: 56, height: 10, fill: "#F2F2F2", stroke: ink, "stroke-width": 2 }));
      [-20, -6, 8, 22].forEach(xx => bar.append(svgEl("polygon", { points: `${xx},-62 ${xx + 7},-62 ${xx + 3},-52 ${xx - 4},-52`, fill: "#2E2E2E" }))); g.append(bar); }
  } else if (kind === "film") {
    P("rect", { x: -3, y: -26, width: 6, height: 26, fill: "#777", stroke: ink, "stroke-width": 1.5 });
    if (view === "side") P("ellipse", { cx: 0, cy: -48, rx: 6, ry: 24, fill: "#5C6670", stroke: ink, "stroke-width": 2 });
    else { P("circle", { cx: 0, cy: -48, r: 24, fill: "#5C6670", stroke: ink, "stroke-width": 2 }); [0, 72, 144, 216, 288].forEach(a => { const t = a * Math.PI / 180; P("circle", { cx: sp6R(13 * Math.cos(t)), cy: sp6R(-48 + 13 * Math.sin(t)), r: 5, fill: "#E8E8E8" }); });
      P("path", { d: "M20,-34 Q40,-20 46,-2 L34,0 Q30,-14 14,-26 Z", fill: "#3A3A3A", stroke: ink, "stroke-width": 1.5 }); }
  } else if (kind === "haetae") {
    if (view === "side") { const s = svgEl("g", { transform: `scale(${flip},1)` });
      s.append(svgEl("rect", { x: -30, y: -10, width: 64, height: 10, fill: SP6_STONE2, stroke: ink, "stroke-width": 1.5 }));
      s.append(svgEl("ellipse", { cx: 4, cy: -26, rx: 26, ry: 14, fill: SP6_STONE, stroke: ink, "stroke-width": 2 }));
      [-14, 18].forEach(xx => s.append(svgEl("rect", { x: xx, y: -18, width: 7, height: 10, fill: SP6_STONE, stroke: ink, "stroke-width": 1.5 })));
      s.append(svgEl("circle", { cx: 30, cy: -44, r: 14, fill: SP6_STONE, stroke: ink, "stroke-width": 2 }));
      s.append(svgEl("circle", { cx: 36, cy: -47, r: 2.5, fill: ink }));
      s.append(svgEl("path", { d: "M-22,-30 q-14,-6 -10,-20 q6,4 4,12", fill: "none", stroke: ink, "stroke-width": 2.5 }));
      g.append(s); }
    else if (view === "front") { P("rect", { x: -26, y: -10, width: 52, height: 10, fill: SP6_STONE2, stroke: ink, "stroke-width": 1.5 });
      P("rect", { x: -16, y: -30, width: 32, height: 20, fill: SP6_STONE, stroke: ink, "stroke-width": 2 });
      P("circle", { cx: 0, cy: -46, r: 20, fill: SP6_STONE, stroke: ink, "stroke-width": 2 });
      P("circle", { cx: -7, cy: -50, r: 3, fill: ink }); P("circle", { cx: 7, cy: -50, r: 3, fill: ink }); P("path", { d: "M-8,-38 q8,6 16,0", fill: "none", stroke: ink, "stroke-width": 2 }); }
    else { P("rect", { x: -26, y: -10, width: 52, height: 10, fill: SP6_STONE2, stroke: ink, "stroke-width": 1.5 });
      P("ellipse", { cx: 0, cy: -28, rx: 20, ry: 18, fill: SP6_STONE, stroke: ink, "stroke-width": 2 });
      P("circle", { cx: 0, cy: -50, r: 16, fill: SP6_STONE2, stroke: ink, "stroke-width": 2 });
      P("path", { d: "M0,-20 q12,-8 6,-22 q-8,2 -4,10", fill: "none", stroke: ink, "stroke-width": 2.5 }); }
  } else if (kind === "swing") {
    const wood = "#B9773E";
    if (view === "side") { P("line", { x1: -26, y1: 0, x2: 0, y2: -70, stroke: wood, "stroke-width": 5 }); P("line", { x1: 26, y1: 0, x2: 0, y2: -70, stroke: wood, "stroke-width": 5 });
      P("line", { x1: 0, y1: -70, x2: 0, y2: -22, stroke: "#666", "stroke-width": 2 }); P("rect", { x: -7, y: -22, width: 14, height: 5, fill: "#E2574C", stroke: ink, "stroke-width": 1 }); }
    else { P("line", { x1: -46, y1: 0, x2: -46, y2: -70, stroke: wood, "stroke-width": 5 }); P("line", { x1: 46, y1: 0, x2: 46, y2: -70, stroke: wood, "stroke-width": 5 }); P("line", { x1: -50, y1: -70, x2: 50, y2: -70, stroke: wood, "stroke-width": 6 });
      [-20, 20].forEach(xx => { P("line", { x1: xx - 9, y1: -70, x2: xx - 9, y2: -22, stroke: "#666", "stroke-width": 2 }); P("line", { x1: xx + 9, y1: -70, x2: xx + 9, y2: -22, stroke: "#666", "stroke-width": 2 }); P("rect", { x: xx - 12, y: -22, width: 24, height: 5, fill: "#E2574C", stroke: ink, "stroke-width": 1 }); }); }
  } else if (kind === "bench") {
    const c = "#4E9A6B";
    if (view === "side") { const s = svgEl("g", { transform: `scale(${flip},1)` });
      s.append(svgEl("rect", { x: -12, y: -20, width: 24, height: 5, fill: c, stroke: ink, "stroke-width": 1.5 })); s.append(svgEl("rect", { x: -14, y: -44, width: 5, height: 29, fill: c, stroke: ink, "stroke-width": 1.5 }));
      s.append(svgEl("line", { x1: -8, y1: -15, x2: -8, y2: 0, stroke: ink, "stroke-width": 3 })); s.append(svgEl("line", { x1: 9, y1: -15, x2: 9, y2: 0, stroke: ink, "stroke-width": 3 })); g.append(s); }
    else { P("rect", { x: -40, y: -42, width: 80, height: 12, fill: c, stroke: ink, "stroke-width": 1.5 }); P("rect", { x: -40, y: -22, width: 80, height: 6, fill: c, stroke: ink, "stroke-width": 1.5 });
      [-34, 34].forEach(xx => P("line", { x1: xx, y1: -16, x2: xx, y2: 0, stroke: ink, "stroke-width": 3 })); }
  } else if (kind === "slide") {
    const c = "#F2B33D", m = "#6C7A89";
    if (view === "side") { const s = svgEl("g", { transform: `scale(${flip},1)` });   // 앞쪽(+x)으로 내려가는 미끄럼판
      s.append(svgEl("line", { x1: -34, y1: 0, x2: -26, y2: -60, stroke: m, "stroke-width": 3 })); s.append(svgEl("line", { x1: -24, y1: 0, x2: -16, y2: -60, stroke: m, "stroke-width": 3 }));
      [-12, -24, -36, -48].forEach(yy => s.append(svgEl("line", { x1: -33 + (-yy / 60) * 8, y1: yy, x2: -23 + (-yy / 60) * 8, y2: yy, stroke: m, "stroke-width": 2 })));
      s.append(svgEl("rect", { x: -28, y: -64, width: 18, height: 6, fill: m }));
      s.append(svgEl("path", { d: "M-10,-64 L40,-4 L48,-4 L48,0 L36,0 L-12,-56 Z", fill: c, stroke: ink, "stroke-width": 1.5 })); g.append(s); }
    else { P("rect", { x: -12, y: -64, width: 24, height: 6, fill: m }); P("line", { x1: -12, y1: -60, x2: -12, y2: 0, stroke: m, "stroke-width": 3 }); P("line", { x1: 12, y1: -60, x2: 12, y2: 0, stroke: m, "stroke-width": 3 });
      P("polygon", { points: "-10,-58 10,-58 16,0 -16,0", fill: c, stroke: ink, "stroke-width": 1.5 }); }
  } else if (kind === "bldg") {
    const wall = "#E8DCC8", p = "#C9D9EA";
    const win = (x, y) => P("rect", { x, y, width: 10, height: 10, fill: "#7FA9D6", stroke: ink, "stroke-width": 1 });
    if (view === "side") { const s = svgEl("g", { transform: `scale(${flip},1)` });
      s.append(svgEl("rect", { x: -40, y: -80, width: 50, height: 80, fill: wall, stroke: ink, "stroke-width": 2 }));
      s.append(svgEl("rect", { x: 10, y: -40, width: 34, height: 40, fill: p, stroke: ink, "stroke-width": 2 })); g.append(s);
      [-66, -46, -26].forEach(yy => { win(-30 * flip - 5, yy); }); }
    else if (view === "front") { P("rect", { x: -60, y: -80, width: 120, height: 80, fill: wall, stroke: ink, "stroke-width": 2 });
      [-50, -30, 20, 40].forEach(xx => { win(xx, -68); win(xx, -46); });
      P("rect", { x: -26, y: -44, width: 52, height: 44, fill: p, stroke: ink, "stroke-width": 2.5 }); P("rect", { x: -9, y: -26, width: 18, height: 26, fill: "#8E5A2E", stroke: ink, "stroke-width": 1.5 }); }
    else { P("rect", { x: -60, y: -80, width: 120, height: 80, fill: wall, stroke: ink, "stroke-width": 2 }); [-50, -30, -10, 10, 30].forEach(xx => { win(xx + 4, -68); win(xx + 4, -46); win(xx + 4, -24); }); }
  } else if (kind === "kettle") {
    const c = "#D9DEE2";
    P("ellipse", { cx: 0, cy: -18, rx: 22, ry: 18, fill: c, stroke: ink, "stroke-width": 2 }); P("rect", { x: -6, y: -42, width: 12, height: 6, rx: 3, fill: "#555" });
    if (view === "side") { const s = svgEl("g", { transform: `scale(${flip},1)` });
      s.append(svgEl("path", { d: "M18,-20 L40,-34 L42,-30 L22,-12 Z", fill: c, stroke: ink, "stroke-width": 2 }));
      s.append(svgEl("path", { d: "M-20,-26 q-16,4 -6,20", fill: "none", stroke: "#555", "stroke-width": 5 })); g.append(s); }
    else if (view === "front") P("circle", { cx: 0, cy: -20, r: 5, fill: "#9AA3AA", stroke: ink, "stroke-width": 1.5 });
    else P("path", { d: "M-8,-34 q8,-10 16,0", fill: "none", stroke: "#555", "stroke-width": 5 });
  } else if (kind === "pot") {
    P("rect", { x: -26, y: -32, width: 52, height: 32, rx: 4, fill: "#E07A5F", stroke: ink, "stroke-width": 2 }); P("rect", { x: -29, y: -36, width: 58, height: 6, rx: 3, fill: "#B5523B", stroke: ink, "stroke-width": 1.5 });
    if (view === "side") P("rect", { x: -4, y: -26, width: 8, height: 8, fill: "#333" });
    else { P("rect", { x: -36, y: -28, width: 10, height: 5, fill: "#333" }); P("rect", { x: 26, y: -28, width: 10, height: 5, fill: "#333" }); }
  }
  return g;
}
/* 사진기에서 본 모습 그림 */
function sp6Photo(objs, ang, opt = {}) {
  const W = 360, Hh = 170, hz = 70;
  return sp6Fig(W, Hh, s => {
    s.append(svgEl("rect", { x: 0, y: 0, width: W, height: hz, fill: "#E3F1FB" }), svgEl("rect", { x: 0, y: hz, width: W, height: Hh - hz, fill: "#E5F2DF" }));
    sp6Shot(objs, ang).slice().sort((a, b) => b.depth - a.depth).forEach(o => {
      const sc = Math.max(.45, Math.min(1.6, SP6_RC / Math.max(o.depth, .5)));
      const x = W / 2 + o.u * sc * (opt.K || 60), y = hz + 52 * sc;
      const g = sp6Sprite(o.o.kind, o.view, o.side); g.setAttribute("transform", `translate(${sp6R(x)},${sp6R(y)}) scale(${sp6R(sc * 1.15 * (o.o.size || 1))})`); s.append(g);
    });
    if (opt.label) s.append(txt(10, 16, opt.label, 15, { fill: SP6.ink, "text-anchor": "start" }));
  }, opt.maxW || "100%", true);
}
/* 위에서 본 지도: 물건 자리와 방향 표시 */
function sp6Map(objs, marks, opt = {}) {
  const S = 34, W = 2 * (SP6_RC + 1.2) * S, cx = W / 2;
  const svg = sp6Fig(W, W, s => {
    s.append(svgEl("circle", { cx, cy: cx, r: SP6_RC * S, fill: "none", stroke: "#D5DEE3", "stroke-width": 1.5, "stroke-dasharray": "5 5" }));
    if (opt.road) s.append(svgEl("rect", { x: cx - 18, y: cx - 1.2 * S, width: 36, height: SP6_RC * S + 1.2 * S, fill: "#EDE6D8" }));
    objs.forEach(o => {
      const x = cx + o.x * S, y = cx + o.y * S, f = o.f || [0, 1];
      s.append(svgEl("rect", { x: x - 15, y: y - 15, width: 30, height: 30, rx: 6, fill: "#FFF6E5", stroke: SP6.ink, "stroke-width": 1.5 }));
      s.append(svgEl("line", { x1: x, y1: y, x2: sp6R(x + f[0] * 13), y2: sp6R(y + f[1] * 13), stroke: SP6.red, "stroke-width": 2.5 }));
      s.append(txt(x, y + 26, o.name, 13, { fill: SP6.ink }));
    });
    marks.forEach(m => { const t = m.ang * Math.PI / 180, x = cx + (SP6_RC + .55) * S * Math.cos(t), y = cx + (SP6_RC + .55) * S * Math.sin(t);
      s.append(svgEl("circle", { cx: sp6R(x), cy: sp6R(y), r: 14, fill: m.color || "#FFFFFF", stroke: SP6.blue, "stroke-width": 2 }), txt(sp6R(x), sp6R(y + 1), m.t, m.t.length > 1 ? 11 : 15, { fill: SP6.blue }));
      if (m.arrow !== false) { const a1 = [cx + (SP6_RC - .2) * S * Math.cos(t), cx + (SP6_RC - .2) * S * Math.sin(t)], a2 = [cx + (SP6_RC - .9) * S * Math.cos(t), cx + (SP6_RC - .9) * S * Math.sin(t)];
        s.append(svgEl("line", { x1: sp6R(a1[0]), y1: sp6R(a1[1]), x2: sp6R(a2[0]), y2: sp6R(a2[1]), stroke: SP6.blue, "stroke-width": 2 })); } });
    if (opt.extra) opt.extra(s, cx, S);
  }, opt.maxW || "17em");
  return svg;
}
/* 사진기를 돌려 보기: marks에 모두 가 보면 끝 */
function sp6Scene(body, api, opt) {
  let ang = opt.start == null ? 60 : opt.start; const seen = new Set();
  const photoBox = h("div"), say = h("div", { class: "sp6box" });
  const camG = svgEl("g");
  const map = sp6Map(opt.objs, opt.marks, { road: opt.road, maxW: "17em", extra: (s, cx, S) => { s.append(camG); camG.cx = cx; camG.S = S; } });
  function draw() {
    const t = ang * Math.PI / 180, cx = camG.cx, S = camG.S, x = cx + SP6_RC * S * Math.cos(t), y = cx + SP6_RC * S * Math.sin(t);
    camG.innerHTML = "";
    camG.append(svgEl("line", { x1: sp6R(x), y1: sp6R(y), x2: cx, y2: cx, stroke: "#F0A030", "stroke-width": 1.5, "stroke-dasharray": "4 4" }));
    const cam = svgEl("g", { transform: `translate(${sp6R(x)},${sp6R(y)}) rotate(${sp6R(ang + 180)})`, style: "cursor:grab" });
    cam.append(svgEl("rect", { x: -11, y: -9, width: 18, height: 18, rx: 3, fill: "#333" }), svgEl("polygon", { points: "7,-6 15,-10 15,10 7,6", fill: "#555" }), svgEl("circle", { cx: 0, cy: 0, r: 13, fill: "transparent" }));
    camG.append(cam);
    photoBox.innerHTML = ""; photoBox.append(sp6Photo(opt.objs, ang, { label: "사진기로 본 모습" }));
    const order = sp6Shot(opt.objs, ang).map(o => o.o.name);
    say.textContent = opt.order === false ? "" : "왼쪽부터 " + order.slice(0, -1).join(", ") + (order.length > 1 ? ", " : "") + sp6Jo(order[order.length - 1], "이/가") + " 보여요. ";
    const near = opt.marks.find(m => Math.abs(((ang - m.ang) % 360 + 540) % 360 - 180) <= 10);
    if (near) { seen.add(near.t); say.textContent += `지금은 ‘${near.t}’ ${opt.markWord || "방향"}에서 보고 있어요.`; }
    if (!body.sp6Fin) {
      if (seen.size >= opt.marks.length) sp6Then(body, api, opt, "모든 방향에서 봄", opt.msg || "모든 방향에서 살펴봤어요.");
      else api.hint(`가 본 ${opt.markWord || "방향"} ${seen.size}곳 / ${opt.marks.length}곳 — 사진기를 끌어 돌리거나 아래 단추를 눌러 보세요.`);
    }
  }
  dragOn(map, () => true, p => { const cx = camG.cx; ang = (Math.atan2(p.y - cx, p.x - cx) * 180 / Math.PI + 360) % 360; draw(); });
  map.addEventListener("click", e => { const p = svgPt(map, e), cx = camG.cx; ang = (Math.atan2(p.y - cx, p.x - cx) * 180 / Math.PI + 360) % 360; draw(); });
  const btns = opt.marks.map(m => h("button", { type: "button", onclick: () => { ang = m.ang; draw(); } }, `${m.t}${opt.markWord === "사람" ? "" : " 방향"}`));
  api.provide({ words: opt.words || ["보는 방향", "왼쪽", "오른쪽"], answers: [] });
  body.append(h("div", { class: "sp6row" }, h("div", {}, map, h("div", { class: "sp6btns" }, ...btns)), h("div", {}, photoBox, say)));
  draw();
}

/* ---------- 놀이: 위 → 앞 → 옆 차례로 보고 똑같이 쌓기 (10점 먼저) ---------- */
function sp6Trim3(H) { const m = sp6Trim(H.map(r => r.map(v => v)), false); if (!m.length) return []; let r0 = 0, c0 = 0; while (H[r0].every(v => !v)) r0++; while (H.every(r => !r[c0])) c0++; return m.map((row, i) => row.map((_, j) => H[r0 + i][c0 + j])); }
function sp6Rand(n) {
  for (let t = 0; t < 400; t++) {
    const H = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; let cells = [[1, 1]]; H[1][1] = 1; let left = n - 1;
    while (left > 0) {
      if (Math.random() < .55) { const [y, x] = cells[Math.floor(Math.random() * cells.length)]; if (H[y][x] < 3) { H[y][x]++; left--; } continue; }
      const [y, x] = cells[Math.floor(Math.random() * cells.length)], d = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)], yy = y + d[0], xx = x + d[1];
      if (yy < 0 || yy > 2 || xx < 0 || xx > 2 || H[yy][xx]) continue; H[yy][xx] = 1; cells.push([yy, xx]); left--;
    }
    if (sp6Max(H) >= 2 && cells.length >= 3) return H;
  }
  return [[0, 1, 0], [1, 2, 1], [0, 0, 0]];
}
function sp6Guess(body, api, opt) {
  const goal = opt.goal || 10, n = opt.n || 5; let score = 0, round = 0, T = null, stage = 0, finished = false;
  const sc = h("div", { class: "sp6score" }), clue = h("div"), boardBox = h("div"), say = h("div", { class: "sp6box" });
  let G = null, mode = 1;
  const pts = [3, 2, 1];
  function newRound() {
    round++; stage = 0; T = sp6Rand(n); G = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; mode = 1; showClue(); paint(); say.textContent = `${round}판: 위에서 본 모양만 보고 쌓기나무 ${n}개로 똑같이 쌓아 보세요. 맞으면 3점!`;
  }
  function showClue() {
    const V = sp6Views(sp6Trim3(T)), rows = 3;
    clue.innerHTML = ""; clue.append(sp6Views3(V, { show: ["top", "front", "side"].slice(0, stage + 1), rows, cell: 24 }));
  }
  const cells = [], board = h("div", { class: "sp6board", style: "grid-template-columns:repeat(3,auto)" });
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) { const b = h("button", { type: "button", onclick: () => { if (finished) return; G[y][x] = Math.max(0, Math.min(3, G[y][x] + mode)); paint(); } }); cells.push([y, x, b]); board.append(b); }
  const prev = h("div"), cnt = h("div", { class: "sp6cnt" });
  const mB = [h("button", { type: "button", onclick: () => { mode = 1; paint(); } }, "＋ 쌓기"), h("button", { type: "button", onclick: () => { mode = -1; paint(); } }, "－ 빼기")];
  function paint() {
    cells.forEach(([y, x, b]) => { const v = G[y][x]; b.textContent = v ? String(v) : "​"; b.className = v ? "sp6h" + v : ""; });
    mB[0].classList.toggle("sp6-pick", mode === 1); mB[1].classList.toggle("sp6-pick", mode === -1);
    cnt.textContent = `쌓은 쌓기나무 ${sp6Sum(G)}개 / ${n}개`;
    prev.innerHTML = ""; prev.append(sp6Iso(G, { frame: [3, 3, 3], maxW: "100%", plain: true }));
    sc.innerHTML = ""; sc.append("내 점수 ", h("b", {}, String(score)), ` 점 / ${goal}점`, h("span", { class: "sp6small" }, ` · ${round}판째`));
  }
  const tryB = h("button", { type: "button", class: "big", onclick: () => {
    if (finished) return;
    if (sp6Sum(G) !== n) return say.textContent = `쌓기나무를 ${n}개 쌓아야 해요. 지금은 ${sp6Sum(G)}개예요.`;
    if (!sp6Joined(G)) return say.textContent = "떨어져 있는 쌓기나무가 있어요. 면과 면이 맞닿게 쌓아요.";
    api.tryOnce();
    if (sp6Same(sp6Trim3(G), sp6Trim3(T))) {
      score += pts[stage]; say.textContent = `맞았어요! ${["위에서 본 모양만", "위, 앞에서 본 모양을", "위, 앞, 옆에서 본 모양을"][stage]} 보고 맞혀서 ${pts[stage]}점이에요.`;
      paint(); return end();
    }
    if (stage < 2) { stage++; showClue(); say.textContent = `아쉬워요. ${stage === 1 ? "앞" : "옆"}에서 본 모양을 더 보여 줄게요. 다시 쌓아 보세요.`; return; }
    say.textContent = "위, 앞, 옆에서 본 모양을 다 보고도 달랐어요(0점). 숨은 자리가 있으면 세 모양이 같아도 다르게 쌓일 수 있어요. 아래가 컴퓨터가 쌓은 모양이에요.";
    end(true);
  } }, "맞는지 보기");
  const ansBox = h("div");
  function end(showAns) {
    ansBox.innerHTML = ""; if (showAns || true) ansBox.append(h("div", { class: "sp6figs" }, h("figure", {}, sp6Iso(sp6Trim3(T), { maxW: "9em" }), h("figcaption", {}, "컴퓨터가 쌓은 모양"))));
    if (score >= goal) { finished = true; api.done(`놀이 ${round}판, ${score}점`, `${round}판 만에 ${score}점을 모았어요! 보이는 모양이 많을수록 더 정확하게 알 수 있었지요?`); return; }
    tryB.disabled = true; more.classList.remove("hidden");
  }
  const more = h("button", { type: "button", class: "ghost hidden", onclick: () => { more.classList.add("hidden"); tryB.disabled = false; ansBox.innerHTML = ""; newRound(); } }, "한 판 더");
  api.provide({ words: ["위에서 본 모양", "앞에서 본 모양", "옆에서 본 모양"], answers: [] });
  body.append(sc, h("div", { class: "sp6row" }, h("div", {}, h("div", { class: "jua" }, "컴퓨터가 보여 주는 모양"), clue), h("div", {}, h("div", { class: "sp6build" },
    h("div", { class: "sp6l" }, h("div", { class: "sp6side" }, "뒤"), board, h("div", { class: "sp6side" }, "앞"), h("div", { class: "sp6btns" }, ...mB), cnt), h("div", { class: "sp6r" }, prev)))),
    say, ansBox, h("div", { class: "sp6btns" }, tryB, more));
  newRound();
}
//@@LESSONS
const UNIT_STORY = { title: "규진이와 시연이의 영상 촬영 학교", lines: [
  "규진이와 시연이가 영상 촬영 학교에 방문했어요. 학교 입구의 모습을 살펴보고, 영상 만드는 법을 배웠어요. 규진이와 시연이는 쌓기나무로 만든 발전소, 시청, 식물원, 호텔 모양으로 영상을 만들었어요.",
  "규진이, 시연이와 함께 여러 방향에서 본 모습을 알아보고, 쌓기나무로 만든 모양을 위에서 본 모양, 위·앞·옆에서 본 모양, 위에서 본 모양에 수를 쓰는 방법, 층별로 나타내는 방법으로 나타내며 쌓기나무의 개수를 구해 봐요.",
  "교과서 「수학 6-2」 3. 공간과 입체의 차시 순서 그대로 만들었어요."],
  one: "공간과 입체 · 영상 촬영 학교에서 여러 방향으로 보고, 쌓기나무를 쌓고, 모양을 평면에 나타내 봐요." };
const UNIT_KEYWORDS = ["보는 방향", "앞", "옆(오른쪽)", "쌓기나무", "숨겨진 쌓기나무", "바닥에 닿아 있는 면", "위에서 본 모양", "앞에서 본 모양", "옆에서 본 모양", "가장 높은 층", "위에서 본 모양에 수를 쓰는 방법", "층별로 나타내는 방법", "1층", "2층", "3층"];

/* ---- 쌓기나무 배치(교과서 그림 대신 이 앱이 새로 설계함 — 지도서의 답이 그대로 나오는지 build 전에 코드로 확인) ---- */
const SP6_D = {
  l1A: [[1, 0, 0], [1, 1, 1], [0, 0, 3]],      // 1차시 건물: 1층 5, 2층 1, 3층 1 (뒤쪽 두 자리가 보이지 않음)
  l1B: [[0, 0, 0], [1, 2, 1], [0, 0, 3]],      //            1층 4, 2층 2, 3층 1 — 투영도가 l1A와 똑같음
  power: [[0, 1, 0], [1, 2, 2], [0, 1, 0]],    // 3차시 발전소: 보이는 6개 + 숨은 1개 = 7 (1층 5, 2층 2)
  l3a3: [[1, 0, 1], [1, 3, 2], [0, 1, 1]],     // 3차시 활동 3: 위에서 본 모양까지 보아도 10개 또는 11개
  l3a4L: [[3, 0, 0], [2, 0, 0], [1, 1, 1]],    // 3차시 활동 4 왼쪽: 숨은 것 없음, 5+2+1 = 8
  l3a4R: [[0, 1, 0], [2, 3, 2], [1, 0, 1]],    //            오른쪽: 숨은 1개, 6+3+1 = 10
  l3ch: [[1, 1, 0], [0, 2, 0], [2, 1, 1]],     // 3차시 도전: 숨은 1개, 8개
  city: [[1, 3, 1], [1, 0, 1], [0, 1, 2]],     // 4차시 시청
  l4a2: [[2, 2, 1], [0, 1, 0], [2, 1, 1]],     // 4차시 활동 2: 위·앞·옆 모양이 같아도 9~11개
  dice: [[3, 1, 1], [0, 1, 0]],                // 4차시 활동 3 주사위 미술품: ◯ 1개씩 3자리 + ☆ 3개 = 6
  l4u: [[0, 1, 0], [0, 3, 0], [1, 2, 1]],      // 4차시 수학익힘 유사: 8개
  l4chA: [[0, 1, 1], [2, 3, 0], [1, 0, 0]], l4chB: [[0, 1, 1], [3, 2, 0], [1, 0, 0]], l4chC: [[0, 1, 1], [3, 2, 0], [0, 1, 0]],
  plant: [[0, 1], [3, 2], [0, 1]],             // 5차시 식물원 ㉠1 ㉡3 ㉢2 ㉣1
  l5ex: [[3, 1, 1], [2, 2, 0], [1, 0, 0]],     // 5차시 활동 2 예시 10개
  l5b: [[0, 2, 0], [1, 1, 1], [2, 0, 1]],      //   8개
  l5c: [[0, 0, 2], [2, 3, 1], [1, 1, 1]],      //   11개
  l5d: [[0, 1, 1], [0, 3, 1], [2, 1, 2]],      //   11개
  l5a3: [[0, 2, 0], [2, 3, 1], [0, 2, 0]],     // 5차시 활동 3: 3, 1, 2, 2, 2 → 10개
  l5chA: [[3, 2, 1], [0, 1, 1], [2, 3, 0]], l5chB: [[2, 3, 1], [0, 1, 1], [2, 3, 0]],   // 5차시 도전: 수를 쓴 것은 나(l5chB)
  hotel: [[3, 3, 2], [3, 1, 0]],               // 6차시 호텔 5+4+3 = 12
  l6a2: [[3, 3, 3], [3, 2, 1]],                // 6차시 활동 2: 6+5+4 = 15
  l6u: [[1, 2, 3], [3, 2, 1]],                 // 6차시 유사: 위에서 본 모양에 수 1, 2, 3, 3, 2, 1
  ga: [[1, 0, 0], [2, 1, 0]],                  // 7~8차시 가 모양(4개)
  gaC: [[[1, 0, 0], [2, 1, 1]], [[2, 0, 0], [1, 1, 1]], [[1, 1, 0], [2, 1, 0]]],   // ㉠ ㉡ ㉢ (㉠, ㉢ 가능)
  na: [[0, 2, 0], [1, 1, 1]],                  // 나 모양(5개)
  naC: [[[0, 2, 0], [1, 1, 2]], [[0, 2, 1], [1, 1, 2]], [[0, 1, 0], [3, 2, 1]], [[0, 3, 0], [1, 2, 1]]],   // ㉠~㉣ (㉡, ㉣ 가능)
  card1: [[2, 1], [3, 0], [1, 0]], card2: [[1, 3, 2], [1, 1, 2]], card3: [[0, 2, 2], [3, 1, 0], [0, 2, 0]], cardCh: [[3, 3, 2], [1, 2, 1], [1, 0, 0]],
  t2: [[1, 0, 0], [3, 2, 1], [1, 0, 1]],       // 10차시 2번: 숨은 1개, 6+2+1 = 9
  t3: [[2, 3], [1, 1], [1, 0]],                // 10차시 3번: 8개, 앞 2층·3층, 옆 1층·1층·3층
  t4: [[0, 2, 2], [0, 3, 1], [1, 1, 0]], t4A: [[0, 2, 1], [0, 3, 2], [1, 1, 0]], t4B: [[0, 2, 2], [0, 3, 1], [0, 1, 0]],   // 10차시 4번(답 다 = t4)
  t5: [[0, 2, 1], [1, 3, 2], [0, 1, 0]],       // 10차시 5번: 2층 3개, 3층 1개
  t6: [[0, 1, 0], [3, 1, 1], [0, 1, 0]],       // 10차시 6번: 수 1, 3, 1, 1, 1 → 옆 1층·3층·1층
  k1: [[0, 0, 1], [3, 2, 1], [0, 0, 2]],       // 확인 1: 5+3+1 = 9
  k2: [[2, 1, 0], [2, 2, 1]],                  // 확인 2: ㉠ 자리 1개
  k3: [[2, 2, 1], [3, 2, 0], [1, 0, 0]]        // 확인 3: 2층 4개
};
const sp6Lay = H => [1, 2, 3, 4].map(k => sp6LayerCount(H, k));
const sp6Hid = H => sp6Look(H).gone;
/* 모양이 똑같이 보이는지 채점하는 도우미 */
function sp6SameIso(T, msgLayers) {
  return G => {
    if (sp6Sig(G) !== sp6Sig(T)) return "그림과 똑같아 보이지 않아요. 오른쪽에 그려지는 내 모양과 문제의 그림을 한 자리씩 견주어 봐요.";
    return msgLayers ? msgLayers(G) : null;
  };
}
function sp6SameTop(T) {
  return G => {
    if (!sp6Same(sp6Views(G).top, sp6Views(T).top)) return "바닥에 닿아 있는 면의 모양이 위에서 본 모양과 달라요. 위에서 본 모양의 칸마다 쌓기나무가 있어야 해요.";
    if (sp6Sig(G) !== sp6Sig(T)) return "위에서 본 모양은 맞아요. 그런데 그림과 똑같아 보이지 않아요. 보이는 쌓기나무의 높이를 다시 견주어 봐요.";
    return null;
  };
}
function sp6SameViews(T) {
  return G => {
    const a = sp6Views(G), b = sp6Views(T);
    if (!sp6Same(a.top, b.top)) return "위에서 본 모양이 달라요. 바닥에 닿아 있는 면의 모양을 위에서 본 모양과 같게 해요.";
    if (!sp6Same(a.front, b.front)) return "앞에서 본 모양이 달라요. 앞에서 볼 때 세로줄마다 가장 높은 층을 견주어 봐요.";
    if (!sp6Same(a.side, b.side)) return "옆에서 본 모양이 달라요. 오른쪽에서 볼 때 왼쪽이 앞줄이에요. 줄마다 가장 높은 층을 견주어 봐요.";
    return null;
  };
}
const sp6LayTxt = G => sp6Lay(G).filter(Boolean).map((n, i) => `${i + 1}층 ${n}개`).join(", ");
/* 1차시 성산 일출봉 그림 */
function sp6Peak(kind) {
  return sp6Fig(200, 130, s => {
    if (kind === "top") { s.append(svgEl("ellipse", { cx: 100, cy: 65, rx: 78, ry: 54, fill: "#8DBF6A", stroke: "#4E7A37", "stroke-width": 2 }), svgEl("ellipse", { cx: 102, cy: 62, rx: 48, ry: 32, fill: "#C9DFA6", stroke: "#4E7A37", "stroke-width": 2 }));
      [0, 40, 80, 120, 160, 200, 240, 280, 320].forEach(a => { const t = a * Math.PI / 180; s.append(svgEl("line", { x1: sp6R(100 + 52 * Math.cos(t)), y1: sp6R(65 + 36 * Math.sin(t)), x2: sp6R(100 + 74 * Math.cos(t)), y2: sp6R(65 + 51 * Math.sin(t)), stroke: "#4E7A37", "stroke-width": 1.5 })); });
      s.append(svgEl("rect", { x: 0, y: 0, width: 200, height: 130, fill: "none" })); }
    else if (kind === "side") { s.append(svgEl("rect", { x: 0, y: 95, width: 200, height: 35, fill: "#9FCBEA" }), svgEl("path", { d: "M10,100 L50,40 L70,46 L130,46 L150,38 L190,100 Z", fill: "#8DBF6A", stroke: "#4E7A37", "stroke-width": 2 })); }
    else { s.append(svgEl("rect", { x: 0, y: 95, width: 200, height: 35, fill: "#9FCBEA" }), svgEl("path", { d: "M30,100 L100,20 L170,100 Z", fill: "#B9A27A", stroke: "#6F5A3A", "stroke-width": 2 })); }
  }, "100%", true);
}
/* 2차시 장면 */
const SP6_GATE = [{ kind: "gate", name: "입구", x: 0, y: -1.2, f: [0, 1] }, { kind: "clap", name: "클래퍼보드 조형물", x: -1.6, y: .8, f: [0, 1] }, { kind: "film", name: "필름 조형물", x: 1.6, y: .3, f: [0, 1] }];
const SP6_GATE_DIR = [{ t: "가", ang: 180 }, { t: "나", ang: 90 }, { t: "다", ang: 0 }];
const SP6_HAE = [{ kind: "haetae", name: "해태 조형물", x: 0, y: 0, f: [0, 1], size: 1.3 }];
const SP6_PEOPLE = [{ t: "소민", ang: 90 }, { t: "승우", ang: 0 }, { t: "시후", ang: 270 }, { t: "은채", ang: 180 }];
const SP6_PARK = [{ kind: "swing", name: "그네", x: -1.5, y: -1, f: [1, 0] }, { kind: "bench", name: "의자", x: 0, y: 1.2, f: [0, 1] }, { kind: "slide", name: "미끄럼틀", x: 1.5, y: 0, f: [-1, 0] }];
const SP6_PARK_DIR = [{ t: "가", ang: 180 }, { t: "나", ang: 90 }, { t: "다", ang: 0 }, { t: "라", ang: 270 }];
const SP6_KIT = [{ kind: "kettle", name: "주전자", x: -.7, y: .4, f: [1, 0], size: 1.2 }, { kind: "pot", name: "냄비", x: .8, y: -.3, f: [0, 1], size: 1.2 }];
const SP6_BLD = [{ kind: "bldg", name: "건축물", x: 0, y: 0, f: [0, 1], size: 1.2 }];
const SP6_BLD_DIR = [{ t: "가", ang: 180 }, { t: "나", ang: 270 }, { t: "다", ang: 90 }];
function sp6PhotoCard(objs, ang, name) { return h("figure", { style: "margin:0;width:100%;text-align:center" }, h("div", { class: "sp6photo" }, sp6Photo(objs, ang)), h("figcaption", {}, name)); }
function sp6Photos(objs, list) { return h("div", { class: "sp6cards", style: "grid-template-columns:repeat(auto-fill,minmax(11em,1fr))" }, ...list.map(([ang, name]) => sp6PhotoCard(objs, ang, name))); }
const sp6Fr = (el, cap) => h("figure", {}, el, h("figcaption", {}, cap));

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 영상 촬영 학교에 가요", soop: "개념 찾기(S)",
  question: "물체를 여러 위치와 방향에서 보면 어떻게 보일까요? 쌓기나무로 만든 모양은 어떻게 알 수 있을까요?",
  summary: "같은 물체라도 보는 위치와 방향에 따라 보이는 모습이 달라요. 쌓기나무로 만든 모양을 한 방향에서만 보면 보이지 않는 부분이 있어서, 여러 가지로 만들 수 있어요. 이 단원에서는 여러 방향에서 본 모양을 알아보고, 쌓기나무로 만든 모양을 평면에 나타내는 방법과 쌓기나무의 개수를 구하는 방법을 알아봐요.",
  steps: [
    { name: "살펴보기", inst: "제주특별자치도에 있는 성산 일출봉은 화산 활동으로 만들어졌어요. 성산 일출봉을 옆에서 본 모습은 ㉠이에요. 성산 일출봉을 위에서 보면 어떤 모습일까요?", hints: ["성산 일출봉은 가운데가 움푹 들어간 분화구가 있어요.", "위에서 내려다보면 산의 둘레와 가운데 분화구가 보여요."],
      render: (b, a) => sp6Pick(b, a, { show: () => h("div", { class: "sp6figs" }, sp6Fr(h("div", { style: "width:12em" }, sp6Peak("side")), "㉠ 옆에서 본 모습")), q: "위에서 본 모습을 골라 보세요.",
        items: [{ name: "가", fig: () => sp6Peak("cone") }, { name: "나", fig: () => sp6Peak("top") }, { name: "다", fig: () => sp6Peak("side") }], a: 1,
        whyExtra: i => ["가는 뾰족한 산을 옆에서 본 모습이에요.", "", "다는 ㉠과 같은, 옆에서 본 모습이에요."][i],
        ok: "위에서 보면 산의 둘레 안에 움푹한 분화구가 보여요. 같은 산이라도 보는 방향에 따라 모습이 달라요." }) },
    { name: "이야기 보기", inst: "규진이와 시연이가 영상 촬영 학교에 방문했어요. 학교 입구의 모습을 살펴보고, 영상 만드는 법을 배웠어요. 규진이와 시연이는 쌓기나무로 만든 발전소, 시청, 식물원, 호텔 모양으로 영상을 만들었어요.", hints: ["이야기에 나온 장소와 쌓기나무 모양을 떠올려요.", "학교 입구에는 조형물이 있어요."],
      render: (b, a) => quiz(b, a, [
        { q: "규진이와 시연이가 쌓기나무로 만든 모양을 모두 골라 보세요.", o: ["발전소", "시청", "식물원", "호텔", "기차역"], a: [0, 1, 2, 3] },
        { q: "물체를 여러 방향에서 본 경험으로 알맞은 것을 골라 보세요.", o: ["영화관에서 앉은 자리에 따라 화면이 다르게 보였어요.", "같은 자리에서 보면 언제나 모든 면이 다 보여요."], a: 0 }],
        { ok: "규진이와 시연이는 쌓기나무로 발전소, 시청, 식물원, 호텔을 만들었어요. 앉은 자리나 보는 방향에 따라 보이는 모습이 달라져요." }) },
    { name: "만져 보기", inst: "쌓기나무로 만든 건물 모양을 보고, 규진이는 “1층에 5개, 2층에 1개, 3층에 1개를 쌓아서 만들었습니다.”, 시연이는 “1층에 4개, 2층에 2개, 3층에 1개를 쌓아서 만든 것 같은데 보이지 않는 부분이 있습니다.”라고 했어요. 두 사람의 말대로 각각 쌓아 보세요.", hints: ["판은 바닥이에요. 그림의 바닥 칸과 같은 자리에 쌓아요.", "보이지 않는 뒤쪽 자리에 쌓기나무가 있어도 그림은 똑같이 보일 수 있어요."],
      render: (b, a) => sp6Chain(b, a, [
        { title: "① 규진이의 말대로: 그림과 똑같아 보이게, 1층 5개 · 2층 1개 · 3층 1개", run: (bx, ax) => sp6Build(bx, ax, { R: 3, C: 3, M: 3, show: () => h("div", {}, sp6Fr(sp6Iso(SP6_D.l1A, { maxW: "13em" }), "쌓기나무 건물"), sp6Redrawn()),
          check: sp6SameIso(SP6_D.l1A, G => sp6Lay(G).join() === "5,1,1,0" ? null : `규진이의 말처럼 1층 5개, 2층 1개, 3층 1개가 되게 쌓아요. 지금은 ${sp6LayTxt(G)}예요.`), msg: "규진이의 말대로 쌓아도 그림과 똑같아 보여요." }) },
        { title: "② 시연이의 말대로: 그림과 똑같아 보이게, 1층 4개 · 2층 2개 · 3층 1개", run: (bx, ax) => sp6Build(bx, ax, { R: 3, C: 3, M: 3,
          check: sp6SameIso(SP6_D.l1A, G => sp6Lay(G).join() === "4,2,1,0" ? null : `시연이의 말처럼 1층 4개, 2층 2개, 3층 1개가 되게 쌓아요. 지금은 ${sp6LayTxt(G)}예요.`),
          ask: [{ q: "두 사람이 쌓은 쌓기나무는 각각 몇 개인가요?", parts: ["규진이는 ", { n: 7 }, "개, 시연이는 ", { n: 7 }, "개예요."] },
            { q: "같은 그림을 보고 두 사람이 다르게 말한 까닭은 무엇일까요?", parts: [{ o: ["보이지 않는 부분이 있어서", "쌓기나무의 크기가 달라서", "그림을 잘못 그려서"], a: 0 }] }],
          ok: "그림에서 보이지 않는 부분이 있으면 똑같아 보여도 여러 가지로 쌓을 수 있어요. 이 단원에서 보이지 않는 부분까지 알 수 있는 방법을 배워요." }) }]) },
    { name: "배울 내용", inst: "‘쌓기나무로 만든 모양을 보고 사용된 쌓기나무의 개수를 어떻게 구할 수 있을까요?’ 이 단원에서 배울 내용을 모두 골라 보세요.", hints: ["이 단원의 이름은 ‘공간과 입체’예요.", "평면도형을 돌리는 것은 4학년, 직육면체의 전개도는 5학년에 배웠어요."],
      render: (b, a) => quiz(b, a, [{ q: "배울 내용 붙임딱지를 골라 보세요.", o: ["어느 방향에서 보았는지 알아보기", "위, 앞, 옆에서 본 모양 알아보기", "위에서 본 모양에 수를 써서 나타내기", "층별로 나타내기", "평면도형 돌리기", "직육면체의 전개도 그리기"], a: [0, 1, 2, 3],
        why: { "4": "평면도형 돌리기는 4학년 때 배운 내용이에요.", "5": "직육면체의 전개도는 5학년 때 배운 내용이에요." } }],
        { ok: "여러 방향에서 본 모양을 알아보고, 쌓기나무로 만든 모양을 위·앞·옆에서 본 모양, 수를 쓴 모양, 층별 모양으로 나타내 봐요." }) },
    { name: "떠올리기", inst: "배운 내용을 떠올려 보세요. (2학년 때 쌓기나무로 모양을 만들고 위치를 말해 보았어요.)", hints: ["모양의 왼쪽과 오른쪽은 보는 사람(나)을 기준으로 말해요.", "보이는 쌓기나무를 하나씩 세어요."],
      render: (b, a) => sp6Ask(b, a, [
        { q: "쌓기나무 몇 개로 만든 모양인가요? (숨은 쌓기나무는 없어요.)", fig: () => sp6Iso([[0, 0, 0], [1, 2, 1]], { maxW: "11em" }), parts: [{ n: 4, why: { "3": "2층에 있는 쌓기나무 아래에도 쌓기나무가 있어요." } }, "개"] },
        { q: "2층에 있는 쌓기나무는 1층의 어느 쌓기나무 위에 있나요?", parts: [{ o: ["가운데", "왼쪽", "오른쪽"], a: 0 }, " 쌓기나무 위에 있어요."] }],
        { ok: "쌓기나무는 바닥부터 쌓아요. 위층 쌓기나무의 아래에는 반드시 쌓기나무가 있어요." }) }
  ],
  challenge: { inst: "쌓기나무 6개로, 그림에서는 쌓기나무가 5개만 보이도록 쌓아 보세요. (한 자리의 쌓기나무가 통째로 숨어야 해요.)", hints: ["높이 쌓은 쌓기나무의 왼쪽 뒤에 낮게 쌓으면 가려져요.", "그림은 오른쪽 앞 위에서 본 모습이에요."],
    render: (b, a) => sp6Build(b, a, { R: 3, C: 3, M: 3,
      check: G => sp6Sum(G) !== 6 ? `쌓기나무를 6개 쌓아요. 지금은 ${sp6Sum(G)}개예요.` : sp6Hid(G).length < 1 ? "지금은 숨은 자리가 없어요. 높이 쌓은 쌓기나무 바로 왼쪽 뒤 자리에 낮게 쌓아 보세요." : sp6Look(G).part.length ? "윗면은 안 보이는데 옆면이 보이는 자리가 있어요. 한 자리가 통째로 숨게 해 봐요." : null,
      msg: "6개를 쌓았는데 그림에서는 5개만 보여요! 이렇게 숨은 쌓기나무가 있을 수 있어요.", ok: "높은 쌓기나무 뒤에 숨은 쌓기나무는 그림만 보아서는 알 수 없어요." }) }
},
{
  id: "t2", no: 2, title: "어느 방향에서 보았는지 알아볼까요", soop: "개념 구축하기(O)",
  question: "여러 방향에서 본 모습을 보고 어느 방향에서 본 것인지 어떻게 알 수 있을까요?",
  summary: "보는 방향에 따라 보이는 물체와 그 차례가 달라져요. 가장 왼쪽과 가장 오른쪽에 무엇이 보이는지, 물체의 앞·옆·뒤 중 어느 모습이 보이는지를 살펴보면 어느 방향에서 본 것인지 알 수 있어요. 방향을 말할 때는 기준을 정해 ‘~의 오른쪽’, ‘~의 왼쪽’처럼 말해요.",
  steps: [
    { name: "만져 보기", inst: "규진이와 시연이가 영상 촬영 학교에 들어섰어요. 길 왼쪽에는 클래퍼보드 조형물이 있고, 길 오른쪽에는 필름 조형물이 있어요. 지도에서 사진기를 끌어 돌리거나 단추를 눌러 가, 나, 다 방향에서 학교 입구를 모두 보세요.", hints: ["사진기는 지도 가운데를 바라보며 원을 따라 움직여요.", "사진에서 가장 왼쪽과 가장 오른쪽에 무엇이 있는지 살펴봐요."],
      words: ["입구", "클래퍼보드 조형물", "필름 조형물"],
      render: (b, a) => sp6Scene(b, a, { objs: SP6_GATE, marks: SP6_GATE_DIR, road: true, start: 120, msg: "가, 나, 다 방향에서 모두 보았어요.",
        askTitle: "아래 사진은 각각 어느 방향에서 찍은 것일까요?",
        ask: () => [{ fig: () => sp6Photos(SP6_GATE, [[180, "㉠"], [0, "㉡"], [90, "㉢"]]), parts: ["㉠은 ", { o: ["가", "나", "다"], a: 0 }, " 방향, ㉡은 ", { o: ["가", "나", "다"], a: 2 }, " 방향, ㉢은 ", { o: ["가", "나", "다"], a: 1 }, " 방향에서 찍었어요."] }],
        ok: "㉠은 가장 왼쪽에 입구, 가장 오른쪽에 클래퍼보드 조형물이 보이니까 가 방향, ㉡은 가장 왼쪽에 클래퍼보드 조형물, 가장 오른쪽에 입구가 보이니까 다 방향, ㉢은 가장 왼쪽에 클래퍼보드 조형물, 가장 오른쪽에 필름 조형물이 보이니까 나 방향이에요." }) },
    { name: "말해 보기", inst: "보는 방향에 따라 학교 입구가 어떻게 달라지는지 왼쪽부터 차례대로 말해 보세요.", hints: ["앞 계단의 사진 ㉠은 가, ㉡은 다, ㉢은 나 방향에서 찍었어요.", "가 방향과 다 방향은 서로 반대쪽이에요."],
      render: (b, a) => { const o = ["입구", "클래퍼보드 조형물", "필름 조형물"];
        sp6Ask(b, a, [
          { q: "가 방향", fig: () => h("div", { style: "max-width:14em" }, sp6Photo(SP6_GATE, 180)), parts: ["왼쪽부터 ", { o, a: 0 }, ", ", { o, a: 2 }, ", ", { o, a: 1 }] },
          { q: "나 방향", parts: ["왼쪽부터 ", { o, a: 1 }, ", ", { o, a: 0 }, ", ", { o, a: 2 }] },
          { q: "다 방향", parts: ["왼쪽부터 ", { o, a: 1 }, ", ", { o, a: 2 }, ", ", { o, a: 0 }] }],
          { ok: "가 방향은 입구, 필름 조형물, 클래퍼보드 조형물, 나 방향은 클래퍼보드 조형물, 입구, 필름 조형물, 다 방향은 클래퍼보드 조형물, 필름 조형물, 입구 차례로 보여요." }); } },
    { name: "그려 보기", inst: "조형물의 사진을 여러 방향에서 찍었어요. 소민이가 사진을 찍는 방향을 앞이라고 하면, 각 사진을 찍은 사람은 누구일까요? 먼저 지도에서 사진기를 돌려 네 사람이 서 있는 곳에서 모두 보세요.", hints: ["소민이가 서 있는 곳을 앞이라고 하면, 소민이의 오른쪽에 승우, 왼쪽에 은채, 맞은편(뒤)에 시후가 있어요.", "얼굴이 보이면 앞, 꼬리만 보이면 뒤에서 찍은 사진이에요. 얼굴이 어느 쪽을 보는지도 살펴봐요."],
      render: (b, a) => sp6Scene(b, a, { objs: SP6_HAE, marks: SP6_PEOPLE, markWord: "사람", order: false, start: 45, msg: "네 사람이 서 있는 곳에서 모두 보았어요.",
        askTitle: "사진 ㉠~㉣을 찍은 사람을 찾아보세요.",
        ask: () => { const o = ["소민", "승우", "시후", "은채"];
          return [{ fig: () => sp6Photos(SP6_HAE, [[270, "㉠"], [0, "㉡"], [180, "㉢"], [90, "㉣"]]), parts: ["㉠ ", { o, a: 2 }, " · ㉡ ", { o, a: 1 }, " · ㉢ ", { o, a: 3 }, " · ㉣ ", { o, a: 0 }] }]; },
        ok: "㉠은 뒤에서 찍었으니 시후, ㉡은 오른쪽에서 찍었으니 승우, ㉢은 왼쪽에서 찍었으니 은채, ㉣은 앞에서 찍었으니 소민이가 찍은 사진이에요." }) },
    { name: "약속하기", inst: "여러 방향에서 본 모습에 대해 정리해 보세요.", hints: ["같은 물체라도 보는 방향이 바뀌면 보이는 모습이 달라요.", "누구를 기준으로 하는지 정하면 방향을 정확하게 말할 수 있어요."],
      render: (b, a) => blanks(b, a, ["물체를 보는 ", { o: ["방향", "시간", "크기"], a: 0 }, "에 따라 보이는 모습이 달라요. 방향을 기호(가, 나, 다)로 나타내면 편리하고, 방향을 말할 때는 ", { o: ["기준", "색깔", "개수"], a: 0 }, "을 정하여 ‘~의 오른쪽’, ‘~의 왼쪽’처럼 말해요."],
        { ok: "보는 방향에 따라 보이는 모습이 달라요. 기준을 정해 방향을 말해요." }) },
    { name: "확인하기", inst: "놀이터의 각 모습은 어느 방향에서 본 것인지 찾고, 그렇게 생각한 까닭을 친구에게 설명해 보세요.", hints: ["왼쪽부터 무엇이 보이는지 차례를 살펴봐요.", "나 방향과 라 방향, 가 방향과 다 방향은 서로 반대쪽이라 보이는 차례가 거꾸로예요."],
      render: (b, a) => { const o = ["가", "나", "다", "라"];
        b.append(h("div", { class: "sp6row" }, h("div", {}, sp6Map(SP6_PARK, SP6_PARK_DIR, { maxW: "15em" })), h("div", {}, sp6Photos(SP6_PARK, [[90, "㉠"], [0, "㉡"], [270, "㉢"], [180, "㉣"]]))));
        sp6Chain(b, a, [
          (bx, ax) => sp6Ask(bx, ax, [{ parts: ["㉠ ", { o, a: 1 }, " 방향 · ㉡ ", { o, a: 2 }, " 방향 · ㉢ ", { o, a: 3 }, " 방향 · ㉣ ", { o, a: 0 }, " 방향"] }],
            { ok: "㉠ 나, ㉡ 다, ㉢ 라, ㉣ 가 방향이에요.", bad: "왼쪽부터 보이는 차례를 다시 살펴봐요. 지도에서 그 방향에 서서 가운데를 본다고 생각해요." }),
          (bx, ax) => writeStep(bx, ax, [{ q: "㉡을 다 방향에서 보았다고 생각한 까닭을 써 보세요.", tag: "까닭", ph: "예) 왼쪽부터 의자, 미끄럼틀, 그네가 보이고 의자의 옆 모습이 보여서 다 방향이에요." }])]); } }
  ],
  challenge: { inst: "주전자와 냄비를 여러 방향에서 찍은 사진이에요. 각 사진은 어느 방향에서 찍은 것인지 찾아보세요. (수학익힘 유사 문제)", hints: ["주전자의 주둥이가 어느 쪽을 향하는지 살펴봐요.", "주전자와 냄비 중 무엇이 왼쪽에 보이는지도 살펴봐요."],
    render: (b, a) => { const o = ["가", "나", "다"];
      sp6Ask(b, a, [{ fig: () => h("div", { class: "sp6row" }, h("div", {}, sp6Map(SP6_KIT, SP6_GATE_DIR, { maxW: "14em" })), h("div", {}, sp6Photos(SP6_KIT, [[180, "㉠"], [0, "㉡"], [90, "㉢"]]))),
        parts: ["㉠ ", { o, a: 0 }, " 방향 · ㉡ ", { o, a: 2 }, " 방향 · ㉢ ", { o, a: 1 }, " 방향"] }],
        { ok: "㉠은 가, ㉡은 다, ㉢은 나 방향에서 찍었어요. 주둥이와 손잡이가 보이는 모습, 물건의 차례로 방향을 찾을 수 있어요." }); } }
},
{
  id: "t3", no: 3, title: "만든 모양과 쌓기나무의 개수를 알아볼까요 ⑴ ― 만든 모양과 위에서 본 모양", soop: "개념 구축하기(O)",
  question: "쌓기나무로 만든 모양과 위에서 본 모양을 보고 쌓기나무의 개수를 어떻게 구할 수 있을까요?",
  summary: "쌓기나무로 만든 모양만 보면 뒤에 숨겨진 쌓기나무가 있을 수 있어서 똑같이 만들 수 없을 때가 있어요. 위에서 본 모양은 바닥에 닿아 있는 면의 모양과 같아서, 만든 모양과 위에서 본 모양을 함께 보면 숨겨진 쌓기나무가 있는지 알 수 있어요. 그래도 숨겨진 쌓기나무가 몇 개인지 알 수 없으면 개수가 여러 가지일 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "쌓기나무로 발전소 모양을 만들려고 해요. “6개일까?” “6개보다 더 필요할 수도 있어!” 그림과 똑같아 보이게 쌓아 보고, 쌓기나무의 수를 다르게 하여 한 번 더 쌓아 보세요.", hints: ["보이는 쌓기나무를 먼저 쌓아요.", "높이 쌓은 쌓기나무 뒤쪽에 쌓기나무가 숨어 있을 수도 있어요."],
      render: (b, a) => sp6Build(b, a, { R: 3, C: 3, M: 3, show: () => h("div", {}, sp6Fr(sp6Iso(SP6_D.power, { maxW: "13em" }), "발전소 모양"), sp6Redrawn()),
        check: sp6SameIso(SP6_D.power), distinct: { n: 2, key: G => sp6Sum(G), same: "앞에서 쌓은 것과 쌓기나무의 수가 같아요. 수를 다르게 하여 똑같아 보이게 쌓아 보세요.", more: f => `${f[0].length ? sp6Sum(f[0]) : ""}개로 쌓았어요! 이번에는 쌓기나무의 수를 다르게 하여 똑같아 보이게 쌓아 보세요.` },
        ask: [{ q: "내가 쌓은 두 모양을 비교해 보세요.", parts: ["앞에서 보면 똑같지만 ", { o: ["뒤에서 본 모양", "앞에서 본 모양"], a: 0 }, "이 서로 달라요."] },
          { q: "똑같은 모양으로 만들려면 무엇을 더 알아야 할까요?", parts: [{ o: ["만든 모양을 위에서 본 모양", "쌓기나무의 색깔", "쌓기나무의 무게"], a: 0 }] }],
        ok: "그림만으로는 숨겨진 쌓기나무를 알 수 없어서 여러 가지로 만들 수 있어요. 바닥에 닿아 있는 쌓기나무, 곧 위에서 본 모양을 알아야 해요." }) },
    { name: "그려 보기", inst: "쌓기나무로 만든 모양과 위에서 본 모양을 보고 똑같이 쌓아 보세요. 그다음 필요한 쌓기나무의 개수를 구해 보세요.", hints: ["위에서 본 모양은 바닥에 닿아 있는 면의 모양과 같아요.", "위에서 본 모양에는 있는데 그림에서 보이지 않는 자리에 숨겨진 쌓기나무가 있어요."],
      render: (b, a) => sp6Build(b, a, { R: 3, C: 3, M: 3, show: () => sp6IsoTop(SP6_D.power), check: G => sp6SameTop(SP6_D.power)(G) || (sp6Same(G, SP6_D.power) ? null : "다시 살펴봐요."),
        ask: [{ q: "위에서 본 모양을 보고 무엇을 알 수 있나요?", parts: [{ o: ["바닥에 닿아 있는 면의 모양", "가장 높은 층의 수"], a: 0 }, "을 알 수 있어요."] },
          { q: "필요한 쌓기나무의 개수를 구해 보세요.", parts: ["1층에 ", { n: 5 }, "개, 2층에 ", { n: 2 }, "개이므로 모두 ", { n: 7, why: { "6": "그림에 보이는 쌓기나무만 세었어요. 위에서 본 모양과 비교해 숨겨진 쌓기나무를 찾아봐요." } }, "개예요."] }],
        ok: "위에서 본 모양을 보면 그림에서 보이지 않던 자리에 쌓기나무가 1개 숨어 있다는 것을 알 수 있어요. 필요한 쌓기나무는 7개예요." }) },
    { name: "말해 보기", inst: "쌓기나무로 만든 모양과 위에서 본 모양을 보고 똑같이 쌓아 보세요. 쌓기나무의 수를 다르게 하여 똑같은 모양을 한 번 더 쌓아 보세요.", hints: ["위에서 본 모양의 칸마다 쌓기나무가 있어야 해요.", "숨겨진 자리에 쌓기나무를 1개 쌓을 수도, 2개 쌓을 수도 있는지 살펴봐요."],
      render: (b, a) => sp6Build(b, a, { R: 3, C: 3, M: 3, show: () => sp6IsoTop(SP6_D.l3a3), check: sp6SameTop(SP6_D.l3a3),
        distinct: { n: 2, key: G => sp6Sum(G), same: "앞에서 쌓은 것과 개수가 같아요. 숨겨진 자리의 개수를 바꾸어 보세요.", more: () => "잘 쌓았어요! 숨겨진 자리의 쌓기나무 개수를 바꾸어 한 번 더 쌓아 보세요." },
        ask: [{ q: "필요한 쌓기나무는 몇 개인가요?", parts: [{ n: 10 }, "개 또는 ", { n: 11 }, "개"] },
          { q: "개수가 여러 가지인 까닭은 무엇일까요?", parts: [{ o: ["숨겨진 쌓기나무가 1개일지 2개일지 알 수 없기 때문이에요.", "위에서 본 모양이 잘못되었기 때문이에요."], a: 0 }] }],
        ok: "만든 모양과 위에서 본 모양을 보고 똑같이 만들어도, 숨겨진 쌓기나무가 1개일지 2개일지 알 수 없어서 10개 또는 11개로 여러 가지 모양이 나올 수 있어요." }) },
    { name: "약속하기", inst: "만든 모양과 위에서 본 모양으로 쌓기나무의 개수를 구하는 방법을 정리해 보세요.", hints: ["위에서 본 모양 = 바닥에 닿아 있는 면의 모양이에요.", "보이는 위의 면들과 위에서 본 모양이 일치하는지 견주어 봐요."],
      render: (b, a) => blanks(b, a, ["위에서 본 모양은 ", { o: ["바닥에 닿아 있는 면", "앞에서 본 면"], a: 0 }, "의 모양과 같아요. 만든 모양에서 보이는 위의 면들과 위에서 본 모양이 일치하면 숨겨진 쌓기나무가 ", { o: ["없어요", "있어요"], a: 0 }, ". 위에서 본 모양에는 있는데 만든 모양에서 보이지 않는 자리가 있으면 숨겨진 쌓기나무가 ", { o: ["있어요", "없어요"], a: 0 }, "."],
        { ok: "위에서 본 모양과 만든 모양에서 보이는 위의 면들을 견주어 숨겨진 쌓기나무를 찾아요." }) },
    { name: "확인하기", inst: "쌓기나무로 만든 모양과 위에서 본 모양을 보고 똑같은 모양으로 만드는 데 필요한 쌓기나무는 몇 개인지 구해 보세요. “숨겨진 쌓기나무가 몇 개일지 생각해 봐.”", hints: ["보이는 위의 면들과 위에서 본 모양을 견주어 숨겨진 자리를 찾아요.", "층별로 세어 더하면 실수가 줄어요."],
      render: (b, a) => sp6Ask(b, a, [
        { q: "가", fig: () => sp6IsoTop(SP6_D.l3a4L), parts: ["숨겨진 쌓기나무 ", { n: 0 }, "개 · 1층 ", { n: 5 }, "개, 2층 ", { n: 2 }, "개, 3층 ", { n: 1 }, "개 → 모두 ", { n: 8 }, "개"] },
        { q: "나", fig: () => sp6IsoTop(SP6_D.l3a4R), parts: ["숨겨진 쌓기나무 ", { n: 1 }, "개 · 1층 ", { n: 6, why: { "5": "위에서 본 모양의 칸 수를 세어 보세요. 숨겨진 자리도 1층이에요." } }, "개, 2층 ", { n: 3 }, "개, 3층 ", { n: 1 }, "개 → 모두 ", { n: 10, why: { "9": "숨겨진 쌓기나무 1개를 빠뜨렸어요." } }, "개"] }],
        { ok: "가는 숨겨진 쌓기나무가 없어서 5+2+1=8(개), 나는 숨겨진 쌓기나무가 1개 있어서 6+3+1=10(개)이에요." }) }
  ],
  challenge: { inst: "쌓기나무로 만든 모양과 위에서 본 모양이에요. 똑같은 모양으로 만드는 데 필요한 쌓기나무는 몇 개일까요? (수학익힘 유사 문제)", hints: ["위에서 본 모양의 칸 수가 1층의 쌓기나무 수예요.", "그림에서 보이지 않는 자리가 있는지 살펴봐요."],
    render: (b, a) => sp6Ask(b, a, [{ fig: () => sp6IsoTop(SP6_D.l3ch), parts: [{ n: sp6Sum(SP6_D.l3ch), why: { [String(sp6Sum(SP6_D.l3ch) - 1)]: "그림에 보이는 쌓기나무만 세었어요. 위에서 본 모양에 숨겨진 자리가 있어요." } }, "개"] }],
      { ok: `1층 ${sp6Lay(SP6_D.l3ch)[0]}개, 2층 ${sp6Lay(SP6_D.l3ch)[1]}개로 모두 ${sp6Sum(SP6_D.l3ch)}개예요. 왼쪽 뒤에 숨겨진 쌓기나무가 1개 있어요.` }) }
},
{
  id: "t4", no: 4, title: "만든 모양과 쌓기나무의 개수를 알아볼까요 ⑵ ― 위, 앞, 옆에서 본 모양", soop: "개념 구축하기(O)",
  question: "쌓기나무로 만든 모양을 위, 앞, 옆에서 본 모양으로 어떻게 나타내고, 이 모양을 보고 쌓기나무의 개수를 어떻게 추측할까요?",
  summary: "앞과 뒤, 오른쪽과 왼쪽에서 본 모양은 좌우로 뒤집으면 같으므로 위, 앞, 옆(오른쪽)의 세 방향에서 본 모양만 알면 돼요. 위에서 본 모양은 바닥에 닿아 있는 면의 모양과 같게, 앞과 옆에서 본 모양은 각 방향에서 세로줄의 가장 높은 층의 수에 따라 그려요. 위, 앞, 옆에서 본 모양이 같아도 숨어 있는 부분 때문에 쌓기나무의 개수가 여러 가지일 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "규진이가 쌓기나무로 시청 모양을 완성했어요. 시청을 각 방향에서 촬영하려고 해요. 방향 단추를 눌러 위, 앞, 뒤, 왼쪽, 오른쪽에서 본 모양을 모두 살펴보세요.", hints: ["앞에서 본 모양과 뒤에서 본 모양을 견주어 봐요.", "오른쪽에서 본 모양과 왼쪽에서 본 모양도 견주어 봐요."],
      render: (b, a) => sp6Turn(b, a, { H: SP6_D.city,
        ask: [{ q: "앞과 뒤, 오른쪽과 왼쪽에서 본 모양은 어떤 관계인가요?", parts: [{ o: ["좌우로 뒤집었을 때 모양이 같아요", "위아래로 뒤집었을 때 모양이 같아요", "서로 전혀 관계가 없어요"], a: 0 }, "."] },
          { q: "각 방향에서 본 모양을 모두 알아야만 쌓기나무로 만든 모양을 나타낼 수 있나요?", parts: [{ o: ["아니요. 위, 앞, 옆의 세 방향만 알아도 돼요.", "네. 다섯 방향을 모두 알아야 해요."], a: 0 }] }],
        ok: "앞과 뒤, 오른쪽과 왼쪽에서 본 모양은 좌우로 뒤집으면 같아요. 그래서 위, 앞, 옆의 세 방향에서 본 모양만 알면 돼요. “이제부터 옆에서 본 모양은 오른쪽에서 본 모양으로 해.”" }) },
    { name: "그려 보기", inst: "시청 모양을 보고 위, 앞, 옆에서 본 모양을 각각 칸에 칠해 그려 보세요. (옆은 오른쪽이에요.)", hints: ["위에서 본 모양은 바닥에 닿아 있는 면의 모양과 같게 그려요.", "앞에서 본 모양은 앞에서 보이는 세로줄마다, 옆에서 본 모양은 오른쪽에서 보이는 세로줄마다 가장 높은 층의 수만큼 그려요. 오른쪽에서 보면 내 왼쪽이 모양의 앞쪽이에요."],
      render: (b, a) => sp6Paint(b, a, { show: () => sp6Fr(sp6Iso(SP6_D.city, { side: true, maxW: "14em" }), "시청 모양"), items: sp6PaintItems(SP6_D.city, ["top", "front", "side"]),
        ok: "위에서 본 모양은 바닥 면의 모양, 앞과 옆에서 본 모양은 세로줄마다 가장 높은 층의 수에 따라 그려요." }) },
    { name: "말해 보기", inst: "쌓기나무로 만든 모양을 위, 앞, 옆에서 본 모양이에요. 세 모양이 똑같이 되도록 쌓아 보고, 쌓기나무의 수를 다르게 하여 한 번 더 쌓아 보세요.", hints: ["위에서 본 모양의 칸마다 쌓기나무를 1개씩 놓고 시작해요.", "앞이나 옆에서 볼 때 가려지는 자리는 높이를 바꾸어도 세 모양이 그대로일 수 있어요."],
      render: (b, a) => sp6Build(b, a, { R: 3, C: 3, M: 3, live: ["views"], show: () => h("div", {}, h("div", { class: "jua" }, "문제의 모양"), sp6Views3(sp6Views(SP6_D.l4a2), { rows: 3 }), sp6Redrawn()), check: sp6SameViews(SP6_D.l4a2),
        distinct: { n: 2, key: G => sp6Sum(G), same: "앞에서 쌓은 것과 개수가 같아요. 개수를 바꾸어 세 모양이 같도록 쌓아 보세요.", more: f => `${sp6Sum(f[0])}개로 쌓았어요! 쌓기나무의 수를 다르게 하여 한 번 더 쌓아 보세요.` },
        ask: [{ q: "필요한 쌓기나무는 몇 개일까요?", parts: ["가장 적으면 ", { n: 9 }, "개, 가장 많으면 ", { n: 11 }, "개예요."] },
          { q: "똑같은 모양으로 만들려면 무엇을 더 알아야 할까요?", parts: ["숨어 있는 부분을 확인할 수 있도록 ", { o: ["쌓기나무의 수나 층별 모양", "쌓기나무의 색깔"], a: 0 }, "을 알아야 해요."] }],
        ok: "위, 앞, 옆에서 본 모양은 똑같지만 숨어 있는 부분의 쌓기나무를 확인할 수 없어서 9개, 10개, 11개로 여러 가지 모양이 나와요." }) },
    { name: "약속하기", inst: "쌓기나무로 만든 모양을 보고 위, 앞, 옆에서 본 모양을 그리는 방법을 정리해 보세요.", hints: ["바닥에 닿아 있는 면을 떠올려요.", "앞이나 옆에서 보면 세로줄마다 가장 높은 쌓기나무만 보여요."],
      render: (b, a) => blanks(b, a, ["위에서 본 모양은 ", { o: ["바닥에 닿아 있는 면", "가장 높은 층"], a: 0 }, "의 모양과 같게 그려요. 앞과 옆에서 본 모양은 쌓기나무로 만든 모양의 각 방향에서 세로줄의 ", { o: ["가장 높은 층의 수", "쌓기나무를 모두 더한 수"], a: 0 }, "에 따라 그려요. 옆에서 본 모양은 ", { o: ["오른쪽", "왼쪽"], a: 0 }, "에서 본 모양으로 해요."],
        { ok: "위는 바닥 면의 모양, 앞과 옆은 세로줄마다 가장 높은 층의 수로 그려요." }) },
    { name: "확인하기", inst: "크기가 같은 정육면체 모양의 주사위로 만든 미술품을 위, 앞, 옆에서 본 모양이에요. 똑같은 모양으로 만드는 데 필요한 주사위는 몇 개인지 구해 보세요.", hints: ["위에서 본 모양의 칸마다 주사위가 적어도 1개 있어요.", "앞에서 본 모양에서 3층인 줄과 옆에서 본 모양에서 3층인 줄이 만나는 자리를 찾아요."],
      render: (b, a) => sp6Chain(b, a, [
        (bx, ax) => sp6Ask(bx, ax, [{ fig: () => sp6Views3(sp6Views(SP6_D.dice), { rows: 3 }), parts: ["필요한 주사위는 ", { n: 6, why: { "4": "위에서 본 모양의 칸 수만 세었어요. 앞과 옆에서 본 모양에 3층인 곳이 있어요.", "8": "3층인 곳은 한 자리뿐이에요. 앞과 옆에서 본 모양을 함께 살펴봐요." } }, "개예요."] }],
          { ok: "앞과 옆 모양에서 3층이 만나는 ☆ 자리에 3개, 나머지 ◯ 자리 3곳에 1개씩 있어요. 3+1+1+1=6(개)이에요." }),
        { title: "쌓기나무로 직접 쌓아서 확인해 보세요.", run: (bx, ax) => sp6Build(bx, ax, { R: 2, C: 3, M: 3, live: ["views"], check: G => sp6SameViews(SP6_D.dice)(G) || (sp6Sum(G) !== 6 ? "세 모양은 맞지만 개수가 달라요." : null),
          msg: "위, 앞, 옆 모양이 같게 쌓으니 주사위 6개로 한 가지 모양만 나와요.", ok: "이 미술품은 위, 앞, 옆에서 본 모양으로 한 가지로 정해지고, 주사위는 6개 필요해요." }) }]) }
  ],
  challenge: { inst: "위, 앞, 옆에서 본 모양이 보기와 같은 것을 찾아보세요. (수학익힘 유사 문제)", hints: ["먼저 위에서 본 모양(바닥 면)이 같은지 살펴봐요.", "앞에서 볼 때 세로줄마다 가장 높은 층을 견주어 봐요."],
    render: (b, a) => sp6Pick(b, a, { show: () => h("div", {}, h("div", { class: "jua" }, "보기"), sp6Views3(sp6Views(SP6_D.l4chB), { rows: 3, cell: 24 })),
      items: [{ name: "가", fig: () => sp6Iso(SP6_D.l4chA, { maxW: "100%", plain: true }) }, { name: "나", fig: () => sp6Iso(SP6_D.l4chB, { maxW: "100%", plain: true }) }, { name: "다", fig: () => sp6Iso(SP6_D.l4chC, { maxW: "100%", plain: true }) }], a: 1,
      whyExtra: i => ["가는 앞에서 본 모양이 달라요. 왼쪽 줄이 2층이에요.", "", "다는 위에서 본 모양이 달라요."][i], ok: "나는 위, 앞, 옆에서 본 모양이 모두 보기와 같아요." }) }
},
{
  id: "t5", no: 5, title: "만든 모양과 쌓기나무의 개수를 알아볼까요 ⑶ ― 위에서 본 모양에 수를 쓰는 방법", soop: "개념 구축하기(O)",
  question: "위에서 본 모양에 수를 쓰는 방법으로 쌓기나무로 만든 모양과 개수를 어떻게 알 수 있을까요?",
  summary: "위에서 본 모양의 각 자리에 그 자리에 쌓여 있는 쌓기나무의 개수를 써서 나타낼 수 있어요. 각 자리의 개수를 모두 알 수 있으므로 모양이 한 가지로만 만들어져요. 필요한 쌓기나무의 개수는 위에서 본 모양에 쓴 수를 모두 더한 것과 같아요. 앞과 옆에서 본 모양은 각 방향의 각 줄에 쓰여 있는 가장 큰 수만큼 칸을 칠해요.",
  steps: [
    { name: "만져 보기", inst: "“뭔가 부족한데.... 식물원도 만들어 볼까?” 쌓기나무로 식물원 모양을 만들었어요. 각 자리 ㉠, ㉡, ㉢, ㉣에 쌓여 있는 쌓기나무는 몇 개인지 생각해 보세요.", hints: ["쌓기나무는 바닥부터 쌓아요. 위에 보이는 쌓기나무 아래에는 반드시 쌓기나무가 있어요.", "기호가 쓰인 맨 위 쌓기나무가 몇 층인지 세어 봐요."],
      render: (b, a) => { const H = SP6_D.plant, mk = [[0, 1], [1, 0], [1, 1], [2, 1]].map(([y, x], i) => ({ y, x, t: SP6_KO[i] }));
        sp6Ask(b, a, [{ fig: () => h("div", {}, sp6Fr(sp6Iso(H, { marks: mk, maxW: "12em" }), "식물원 모양"), sp6Redrawn()), parts: ["㉠ ", { n: 1 }, "개, ㉡ ", { n: 3 }, "개, ㉢ ", { n: 2 }, "개, ㉣ ", { n: 1 }, "개"] },
          { q: "필요한 쌓기나무는 몇 개인가요?", parts: ["1+3+2+1=", { n: 7 }, "(개)"] }],
          { ok: "㉠ 1개, ㉡ 3개, ㉢ 2개, ㉣ 1개예요. 위에서 본 모양에 쓴 수를 모두 더하면 1+3+2+1=7(개)이에요." }); } },
    { name: "그려 보기", inst: "위에서 본 모양에 수를 쓴 것을 보고 식물원 모양을 똑같이 쌓아 보세요.", hints: ["위에서 본 모양의 각 칸에 쓰인 수만큼 그 자리에 쌓아요.", "판의 아래쪽이 앞이에요."],
      render: (b, a) => sp6Build(b, a, { R: 3, C: 2, M: 3, show: () => sp6Fr(sp6View("top", SP6_D.plant, { nums: true }), "위에서 본 모양에 수를 쓴 것"), check: G => sp6Same(G, SP6_D.plant) ? null : "위에서 본 모양의 칸마다 쓰인 수와 쌓은 개수가 같은지 견주어 봐요.",
        ask: [{ q: "위에서 본 모양에 수를 쓰는 방법은 어떤 점이 좋은가요?", parts: ["각 자리에 쌓여 있는 쌓기나무의 개수를 모두 알 수 있으므로 모양이 ", { o: ["한 가지로만", "여러 가지로"], a: 0 }, " 만들어져서 만든 모양을 정확하게 알 수 있어요."] }],
        ok: "수를 쓴 것을 보고 만들면 주어진 식물원 모양과 똑같아요. 모양이 한 가지로만 만들어져요." }) },
    { name: "말해 보기", inst: "쌓기나무로 만든 모양을 보고 위에서 본 모양에 수를 쓰고, 똑같은 모양으로 만드는 데 필요한 쌓기나무는 몇 개인지 구해 보세요.", hints: ["그림에서 각 자리의 맨 위 쌓기나무가 몇 층인지 세어 봐요.", "위에서 본 모양에 쓴 수를 모두 더해요."],
      render: (b, a) => sp6Chain(b, a, [
        { title: "보기", run: (bx, ax) => sp6Nums(bx, ax, { H: SP6_D.l5ex, given: true, total: true, show: () => h("div", {}, sp6Iso(SP6_D.l5ex, { maxW: "12em" }), sp6Redrawn()), msg: "보기처럼 수를 쓰고 모두 더해요." }) },
        { title: "①", run: (bx, ax) => sp6Nums(bx, ax, { H: SP6_D.l5b, total: true, show: () => sp6Iso(SP6_D.l5b, { maxW: "12em" }) }) },
        { title: "②", run: (bx, ax) => sp6Nums(bx, ax, { H: SP6_D.l5c, total: true, show: () => sp6Iso(SP6_D.l5c, { maxW: "12em" }) }) },
        { title: "③", run: (bx, ax) => sp6Nums(bx, ax, { H: SP6_D.l5d, total: true, show: () => sp6Iso(SP6_D.l5d, { maxW: "12em" }), ok: `①은 ${sp6Sum(SP6_D.l5b)}개, ②는 ${sp6Sum(SP6_D.l5c)}개, ③은 ${sp6Sum(SP6_D.l5d)}개예요. 위에서 본 모양에 쓴 수를 모두 더하면 쌓기나무의 개수가 돼요.` }) }]) },
    { name: "약속하기", inst: "위에서 본 모양에 수를 쓰는 방법을 정리해 보세요.", hints: ["각 자리에 쓴 수는 그 자리에 쌓인 쌓기나무의 개수예요.", "앞에서 볼 때 한 세로줄에서는 가장 높은 쌓기나무만 보여요."],
      render: (b, a) => blanks(b, a, ["위에서 본 모양의 각 자리에 쌓여 있는 쌓기나무의 개수를 쓰면, 필요한 쌓기나무의 개수는 쓴 수를 모두 ", { o: ["더한 것", "곱한 것"], a: 0 }, "과 같아요. 앞과 옆에서 본 모양을 그릴 때는 위에서 본 모양에서 각 방향의 각 줄에 쓰여 있는 ", { o: ["가장 큰 수", "가장 작은 수"], a: 0 }, "만큼 칸을 칠해요."],
        { ok: "개수는 쓴 수를 모두 더하고, 앞·옆 모양은 각 줄의 가장 큰 수만큼 칠해요." }) },
    { name: "확인하기", inst: "쌓기나무로 만든 모양을 보고 위에서 본 모양에 수를 쓴 것이에요. “위에서 본 모양에 수를 쓴 것만 보고도 앞과 옆에서 본 모양을 각각 그릴 수 있을까?” 쌓기나무의 개수를 구하고, 앞과 옆에서 본 모양을 그려 보세요.", hints: ["앞에서 볼 때는 세로줄마다, 옆(오른쪽)에서 볼 때는 가로줄마다 가장 큰 수를 찾아요.", "옆에서 본 모양은 앞줄이 왼쪽에 와요."],
      render: (b, a) => sp6Chain(b, a, [
        (bx, ax) => sp6Ask(bx, ax, [{ fig: () => sp6Fr(sp6View("top", SP6_D.l5a3, { nums: true }), "위에서 본 모양에 수를 쓴 것"), parts: ["쌓기나무는 3+1+2+2+2=", { n: 10 }, "(개)예요."] }], { ok: "위에서 본 모양에 쓴 수를 모두 더하면 10개예요." }),
        { title: "앞과 옆에서 본 모양을 그려 보세요.", run: (bx, ax) => sp6Paint(bx, ax, { items: sp6PaintItems(SP6_D.l5a3, ["front", "side"]), ok: "각 방향의 각 줄에 쓰인 가장 큰 수만큼 칠하면 앞과 옆에서 본 모양이 돼요." }) }]) }
  ],
  challenge: { inst: "쌓기나무로 만든 모양을 보고 위에서 본 모양에 수를 쓴 것이에요. 가와 나 중 어떤 모양을 보고 쓴 것인지 찾아보세요. (수학익힘 유사 문제)", hints: ["가와 나의 각 자리에 쌓인 개수를 세어 수를 쓴 것과 견주어 봐요.", "맨 뒷줄에서 3층인 자리가 어디인지 살펴봐요."],
    render: (b, a) => sp6Pick(b, a, { show: () => sp6Fr(sp6View("top", SP6_D.l5chB, { nums: true }), "위에서 본 모양에 수를 쓴 것"),
      items: [{ name: "가", fig: () => sp6Iso(SP6_D.l5chA, { maxW: "100%", plain: true }) }, { name: "나", fig: () => sp6Iso(SP6_D.l5chB, { maxW: "100%", plain: true }) }], a: 1,
      whyExtra: () => "가는 맨 뒷줄의 왼쪽 자리가 3층이에요. 수를 쓴 것과 견주어 봐요.", ok: "나의 각 자리에 쌓인 개수가 수를 쓴 것과 똑같아요." }) }
},
{
  id: "t6", no: 6, title: "만든 모양과 쌓기나무의 개수를 알아볼까요 ⑷ ― 층별로 나타내는 방법", soop: "개념 구축하기(O)",
  question: "쌓기나무로 만든 모양을 층별로 어떻게 나타내고, 층별로 나타낸 모양을 보고 개수를 어떻게 구할까요?",
  summary: "쌓기나무로 만든 모양을 1층, 2층, 3층으로 나누어 각 층을 위에서 본 모양으로 나타낼 수 있어요. 층별로 나타낸 대로 만들면 모양이 한 가지로만 만들어지고, 각 층의 모양과 개수를 정확하게 알 수 있어요. 1층 모양은 위에서 본 모양과 같고, 위층에 쌓으려면 바로 아래층의 같은 자리에 쌓기나무가 있어야 해요. 층별 모양은 방향과 위치가 달라지면 실제 모양도 달라져요.",
  steps: [
    { name: "만져 보기", inst: "“마지막으로 호텔을 만들어 보자!” 시연이가 1층은 식당, 2층은 운동 시설, 3층은 숙소로 쓸 호텔 모양을 만들었어요. 층 단추를 눌러 만든 모양을 층별로 살펴보세요.", hints: ["층 단추를 누르면 그 층만 진하게 보이고, 그 층을 위에서 본 모양도 보여요.", "각 층에 쌓기나무가 몇 개인지 세어 봐요."],
      render: (b, a) => sp6Layers(b, a, { H: SP6_D.hotel, names: ["식당", "운동 시설", "숙소"],
        ask: [{ q: "층마다 쌓기나무는 몇 개인가요?", parts: ["1층 ", { n: 5 }, "개, 2층 ", { n: 4 }, "개, 3층 ", { n: 3 }, "개 → 모두 ", { n: 12 }, "개"] }],
        ok: "층별로 살펴보면 층마다 모양과 개수가 달라요. 필요한 쌓기나무는 5+4+3=12(개)예요." }) },
    { name: "그려 보기", inst: "호텔 모양을 층별로 위에서 본 모양을 칸에 칠해 그려 보세요. (각 그림의 아래쪽이 앞이에요.)", hints: ["1층 모양은 위에서 본 모양(바닥 면의 모양)과 같아요.", "2층, 3층은 그 층에 있는 쌓기나무만, 아래층과 같은 자리에 그려요."],
      render: (b, a) => sp6Paint(b, a, { show: () => sp6Fr(sp6Iso(SP6_D.hotel, { maxW: "13em" }), "호텔 모양"), items: sp6PaintItems(SP6_D.hotel, ["L1", "L2", "L3"]),
        tip: "칸을 누르면 색칠돼요. 세 그림의 칸은 같은 자리를 나타내요.",
        ask: [{ q: "층별 모양을 보고 만들면 어떤 점이 좋은가요?", parts: ["층별로 나타낸 대로 만들면 모양이 ", { o: ["한 가지로만", "여러 가지로"], a: 0 }, " 만들어져서 각 층의 모양과 개수를 정확하게 알 수 있어요."] }],
        ok: "층별로 나타내면 각 층의 모양과 개수를 정확하게 알 수 있어요." }) },
    { name: "말해 보기", inst: "어떤 친구가 호텔의 2층 모양을 [그림 1]처럼 그렸어요. [그림 1]과 [그림 2] 중 호텔의 2층 모양으로 알맞은 것은 무엇일까요?", hints: ["층별 모양은 각 층을 위에서 본 모양이에요. 모양뿐 아니라 자리도 맞아야 해요.", "위층에 쌓으려면 바로 아래층의 같은 자리에 쌓기나무가 있어야 해요."],
      render: (b, a) => sp6Chain(b, a, [
        (bx, ax) => sp6Ask(bx, ax, [{ fig: () => h("div", { class: "sp6figs" }, sp6Fr(sp6View("layer", sp6Layer(SP6_D.hotel, 1), { frame: true, cell: 26 }), "1층"), sp6Fr(sp6View("layer", [[0, 0, 1], [1, 1, 1]], { frame: true, cell: 26 }), "[그림 1]"), sp6Fr(sp6View("layer", sp6Layer(SP6_D.hotel, 2), { frame: true, cell: 26 }), "[그림 2]")),
          parts: ["호텔의 2층 모양은 ", { o: ["[그림 1]", "[그림 2]"], a: 1 }, "이에요. [그림 1]은 모양은 같지만 ", { o: ["자리가 달라서", "쌓기나무 수가 달라서"], a: 0 }, " 다른 모양이에요."] },
          { q: "[그림 1]처럼 쌓을 수 없는 까닭은 무엇일까요?", parts: [{ o: ["앞줄 오른쪽 자리는 1층에 쌓기나무가 없어서 그 위에 쌓을 수 없어요.", "2층에는 쌓기나무를 4개까지만 쌓을 수 있어요."], a: 0 }] }],
          { ok: "층별 모양은 각 층을 위에서 본 모양이라서 방향과 위치가 달라지면 실제 모양도 달라져요. 위층은 바로 아래층의 같은 자리에 쌓아야 해요." }),
        { title: "층별 모양을 보고 호텔을 쌓아 보세요.", run: (bx, ax) => sp6Build(bx, ax, { R: 2, C: 3, M: 3, show: () => sp6LayerFigs(SP6_D.hotel), live: ["layers"], check: G => sp6Same(G, SP6_D.hotel) ? null : "내가 쌓은 모양의 층별 모양(아래)을 문제의 층별 모양과 견주어 봐요.",
          msg: "층별 모양대로 쌓으니 호텔 모양과 똑같아요.", ok: "층별 모양을 보고 만들면 처음 호텔 모양과 같아요." }) }]) },
    { name: "약속하기", inst: "층별로 나타내는 방법을 정리해 보세요.", hints: ["1층 모양은 바닥에 닿아 있는 면의 모양이에요.", "각 층의 쌓기나무 수를 모두 더해요."],
      render: (b, a) => blanks(b, a, ["쌓기나무로 만든 모양을 층별로 위에서 본 모양으로 나타낼 수 있어요. 1층 모양은 ", { o: ["위에서 본 모양", "앞에서 본 모양"], a: 0 }, "과 같아요. 위층에 쌓으려면 바로 아래층의 ", { o: ["같은 자리", "옆자리"], a: 0 }, "에 쌓기나무가 있어야 해요. 필요한 쌓기나무의 개수는 각 층의 개수를 모두 ", { o: ["더해서", "곱해서"], a: 0 }, " 구해요."],
        { ok: "1층 모양 = 위에서 본 모양, 위층은 아래층의 같은 자리 위에, 개수는 층별 개수의 합이에요." }) },
    { name: "확인하기", inst: "쌓기나무로 만든 모양을 층별로 나타낸 모양이에요. “1층 모양과 위에서 본 모양을 비교해 볼까?” 쌓기나무의 개수를 구하고, 위, 앞, 옆에서 본 모양을 그려 보세요.", hints: ["층마다 칠해진 칸을 세어 더해요.", "앞에서 볼 때 세로줄마다 몇 층까지 쌓기나무가 있는지 층별 모양에서 찾아요."],
      render: (b, a) => sp6Chain(b, a, [
        (bx, ax) => sp6Ask(bx, ax, [{ fig: () => h("div", {}, sp6LayerFigs(SP6_D.l6a2), sp6Redrawn()), parts: ["1층 ", { n: 6 }, "개, 2층 ", { n: 5 }, "개, 3층 ", { n: 4 }, "개 → 모두 ", { n: 15 }, "개"] },
          { q: "1층 모양과 위에서 본 모양을 비교해 보세요.", parts: ["두 모양은 ", { o: ["같아요", "달라요"], a: 0 }, "."] }], { ok: "6+5+4=15(개)이고, 1층 모양과 위에서 본 모양은 같아요." }),
        { title: "위, 앞, 옆에서 본 모양을 그려 보세요.", run: (bx, ax) => sp6Paint(bx, ax, { items: sp6PaintItems(SP6_D.l6a2, ["top", "front", "side"]), ok: "위에서 본 모양은 1층 모양과 같고, 앞과 옆에서 본 모양은 세로줄마다 가장 높은 층의 수에 따라 그려요." }) }]) }
  ],
  challenge: { inst: "승우가 말했어요. “쌓기나무를 1층에 5개, 2층에 4개, 3층에 2개 쌓아서 만들었어.” 승우처럼 쌓아 보고, 내가 쌓은 모양의 층별 모양을 그려 보세요.", hints: ["1층에 5개를 먼저 놓고, 그 위에 2층 4개, 다시 그 위에 3층 2개를 쌓아요.", "층별 모양은 내가 쌓은 모양을 층마다 위에서 본 모양이에요."],
    render: (b, a) => sp6Build(b, a, { R: 3, C: 3, M: 3, live: ["layers"], check: G => sp6Lay(G).join() === "5,4,2,0" ? null : `1층 5개, 2층 4개, 3층 2개가 되게 쌓아요. 지금은 ${sp6LayTxt(G)}예요.`,
      msg: "승우처럼 쌓았어요.", then: (bx, ax, G) => { bx.append(h("p", { class: "inst" }, "이제 내가 쌓은 모양의 1층, 2층, 3층 모양을 그려 보세요. (위에서 칸 아래의 층별 모양은 잠시 가려 두었어요.)"));
        const lv = bx.parentNode.querySelector(".sp6build + div"); if (lv) lv.style.display = "none";
        sp6Paint(bx, ax, { show: () => sp6Iso(G, { frame: [3, 3, 3], maxW: "12em" }), items: sp6PaintItems(G, ["L1", "L2", "L3"]).map(it => Object.assign(it, { rows: 3, cols: 3, ans: it.ans })), ok: "쌓은 모양을 층별 모양으로 바르게 나타냈어요. 친구가 이 층별 모양을 보면 내 모양과 똑같이 만들 수 있어요." }); } }) }
},
{
  id: "t7", no: "7~8", title: "생각을 더하다 ― 쌓기나무를 더 붙여서 멋지게 만들어 볼까요", soop: "탐구 정리하기(O)",
  question: "쌓기나무를 1개, 2개 더 붙여서 만들 수 있는 모양을 찾고, 여러 가지 방법으로 나타낼 수 있을까요?",
  summary: "주어진 모양에 쌓기나무를 더 붙여 만든 모양에는 처음 모양이 그대로 들어 있어야 하고, 더 붙인 쌓기나무 수만큼 개수가 늘어나요. 쌓기나무로 만든 모양은 만든 모양과 위에서 본 모양, 위·앞·옆에서 본 모양, 위에서 본 모양에 수를 쓰는 방법, 층별로 나타내는 방법으로 나타낼 수 있어요. 수를 쓰는 방법과 층별로 나타내는 방법은 모양이 한 가지로 정해져요.",
  steps: [
    { name: "만져 보기", inst: "지아는 쌓기나무로 건물 모양을 만들고 있어요. “쌓기나무를 더 붙여서 좀 더 멋지게 만들고 싶어.” 가 모양에 쌓기나무 1개를 더 붙여서 학교 모양을 만들어 보세요. 서로 다른 모양을 2가지 만들어 보세요.", hints: ["점선 칸은 가 모양이라 뺄 수 없어요.", "더 붙이는 쌓기나무는 면과 면이 맞닿게, 바닥이나 다른 쌓기나무 위에 놓아요."],
      render: (b, a) => { const st = [[0, 0, 0, 0], [0, 1, 0, 0], [0, 2, 1, 0], [0, 0, 0, 0]];
        sp6Build(b, a, { R: 4, C: 4, M: 3, start: st, lock: true, show: () => h("div", {}, sp6Fr(sp6Iso(SP6_D.ga, { maxW: "10em" }), "가 모양(쌓기나무 4개)"), sp6Redrawn()),
          check: G => sp6Sum(G) !== 5 ? `쌓기나무 1개만 더 붙여요. 지금은 ${sp6Sum(G) - 4}개를 더 붙였어요.` : null,
          distinct: { n: 2, more: () => "학교 모양을 하나 만들었어요! 쌓기나무 1개를 다른 자리에 붙여 한 가지 더 만들어 보세요." },
          ok: "가 모양에 쌓기나무 1개를 붙이는 자리에 따라 여러 가지 학교 모양을 만들 수 있어요." }); } },
    { name: "그려 보기", inst: "가 모양에 쌓기나무 1개를 더 붙여서 만들 수 있는 모양을 모두 찾고, 위에서 본 모양에 수를 써 보세요.", hints: ["후보 모양 안에 가 모양이 그대로 들어 있는지 살펴봐요.", "가 모양의 2층 쌓기나무가 어디에 있는지 견주어 봐요."],
      render: (b, a) => sp6Pick(b, a, { show: () => sp6Fr(sp6Iso(SP6_D.ga, { maxW: "9em" }), "가 모양"),
        items: SP6_D.gaC.map((H, i) => ({ name: SP6_KO[i], fig: () => sp6Iso(H, { maxW: "100%", plain: true }) })), a: [0, 2],
        whyExtra: i => i === 1 ? "㉡에는 가 모양이 들어 있지 않아요. 2층 쌓기나무의 자리가 가 모양과 달라요." : "",
        then: (bx, ax) => sp6Chain(bx, ax, [
          { title: "㉠을 위에서 본 모양에 수를 써 보세요.", run: (cx, cy) => sp6Nums(cx, cy, { H: SP6_D.gaC[0], show: () => sp6Iso(SP6_D.gaC[0], { maxW: "9em" }) }) },
          { title: "㉢을 위에서 본 모양에 수를 써 보세요.", run: (cx, cy) => sp6Nums(cx, cy, { H: SP6_D.gaC[2], show: () => sp6Iso(SP6_D.gaC[2], { maxW: "9em" }), ok: "㉠과 ㉢은 가 모양에 쌓기나무 1개를 붙인 모양이에요. 위에서 본 모양에 수를 쓰면 쓴 수의 합이 5예요." }) }]) }) },
    { name: "말해 보기", inst: "나 모양에 쌓기나무 2개를 더 붙여서 체육관 모양을 만들려고 해요. 만들 수 있는 모양을 모두 찾아보세요.", hints: ["후보 모양의 쌓기나무가 나 모양보다 2개 많은지 세어 봐요.", "나 모양이 그대로 들어 있는지도 살펴봐요."],
      render: (b, a) => sp6Pick(b, a, { show: () => sp6Fr(sp6Iso(SP6_D.na, { maxW: "9em" }), "나 모양(쌓기나무 5개)"),
        items: SP6_D.naC.map((H, i) => ({ name: SP6_KO[i], fig: () => sp6Iso(H, { maxW: "100%", plain: true }) })), a: [1, 3],
        whyExtra: i => ["㉠은 쌓기나무를 1개만 더 붙였어요. 쌓기나무가 모두 6개예요.", "", "㉢에는 나 모양이 들어 있지 않아요. 가운데 뒤 자리가 2층이 아니에요.", ""][i],
        ok: "㉡과 ㉣은 나 모양에 쌓기나무 2개를 더 붙인 모양이에요." }) },
    { name: "그려 보기 ②", inst: "㉡을 위, 앞, 옆에서 본 모양과 층별 모양(1층, 2층)으로 나타내 보세요.", hints: ["위에서 본 모양과 1층 모양은 같아요.", "앞과 옆에서 본 모양은 세로줄마다 가장 높은 층의 수만큼 그려요."],
      render: (b, a) => sp6Paint(b, a, { show: () => sp6Fr(sp6Iso(SP6_D.naC[1], { side: true, maxW: "12em" }), "㉡ 모양"), items: sp6PaintItems(SP6_D.naC[1], ["top", "front", "side", "L1", "L2"]),
        ok: "㉡을 위, 앞, 옆에서 본 모양과 층별 모양으로 나타냈어요." }) },
    { name: "확인하기", inst: "쌓기나무로 만든 모양을 나타내는 여러 가지 방법을 정리해 보세요.", hints: ["숨은 쌓기나무까지 알 수 있는 방법을 떠올려요.", "각 자리의 개수나 각 층의 모양을 알면 모양이 한 가지로 정해져요."],
      render: (b, a) => quiz(b, a, [
        { q: "나타낸 것만 보고 만들 때 모양이 언제나 한 가지로 정해지는 방법을 모두 골라 보세요.", o: ["만든 모양과 위에서 본 모양", "위, 앞, 옆에서 본 모양", "위에서 본 모양에 수를 쓰는 방법", "층별로 나타내는 방법"], a: [2, 3],
          why: { "0": "만든 모양과 위에서 본 모양만으로는 숨겨진 쌓기나무가 몇 개인지 모를 때가 있어요(3차시 10개 또는 11개).", "1": "위, 앞, 옆에서 본 모양이 같아도 개수가 다를 수 있었어요(4차시 9~11개)." } },
        { q: "쌓기나무의 개수를 가장 빨리 구할 수 있는 방법은 무엇일까요?", o: ["위에서 본 모양에 쓴 수를 모두 더하기", "앞에서 본 모양의 칸 수 세기"], a: 0 }],
        { ok: "수를 쓰는 방법과 층별로 나타내는 방법은 모양이 한 가지로 정해져요. 위에서 본 모양에 쓴 수를 더하면 개수를 바로 알 수 있어요." }) }
  ],
  challenge: { inst: "나 모양에 쌓기나무 2개를 더 붙여서 ㉡, ㉣과 다른 체육관 모양을 만들어 보세요.", hints: ["점선 칸은 나 모양이라 뺄 수 없어요.", "2개를 같은 자리에 쌓을 수도, 서로 다른 자리에 붙일 수도 있어요."],
    render: (b, a) => { const off = H => { const G = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]; H.forEach((r, y) => r.forEach((v, x) => { G[y + 1][x + 1] = v; })); return G; };
      const st = off(SP6_D.na), no = [off(SP6_D.naC[1]), off(SP6_D.naC[3])];
      sp6Build(b, a, { R: 4, C: 5, M: 3, start: st, lock: true, show: () => h("div", { class: "sp6figs" }, sp6Fr(sp6Iso(SP6_D.na, { maxW: "8em" }), "나"), sp6Fr(sp6Iso(SP6_D.naC[1], { maxW: "8em" }), "㉡"), sp6Fr(sp6Iso(SP6_D.naC[3], { maxW: "8em" }), "㉣")),
        check: G => sp6Sum(G) !== 7 ? `쌓기나무 2개를 더 붙여요. 지금은 ${sp6Sum(G) - 5}개를 더 붙였어요.` : no.some(N => sp6Same(N, G)) ? "㉡이나 ㉣과 같은 모양이에요. 다른 자리에 붙여 보세요." : null,
        ok: "나 모양에 쌓기나무 2개를 붙이는 방법은 여러 가지예요. 내가 만든 모양도 위에서 본 모양에 수를 쓰거나 층별로 나타낼 수 있어요." }); } }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 힘을 합해 쌓기나무로 만들어 봐요", soop: "탐구 정리하기(O)",
  question: "여러 가지 방법으로 나타낸 카드를 보고 층별 모양을 그리고, 힘을 합해 쌓기나무로 똑같이 만들 수 있을까요?",
  summary: "만든 모양과 위에서 본 모양, 위에서 본 모양에 수를 쓴 것을 보고 층별 모양을 옳게 그리면, 층별 모양을 보고 쌓기나무로 똑같이 만들 수 있어요. 친구가 잘못 만들었을 때는 비난하지 않고 옳게 만들 수 있도록 도와줘요.",
  steps: [
    { name: "놀이 알아보기", inst: "4명이 함께 하는 놀이예요. 가위바위보로 놀이 순서를 정하고, 카드를 섞은 후 뒤집어 쌓아 두어요. 놀이 방법을 차례대로 눌러 보세요.", hints: ["먼저 카드를 보여 주고, 층별 모양을 그린 다음, 쌓기나무로 만들어요.", "역할을 바꾸어 모두 한 번씩 만들면 놀이가 끝나요."],
      render: (b, a) => sequence(b, a, [
        "㉢ 첫 번째 순서인 사람은 세 사람이 그린 1층, 2층, 3층 모양을 보고 쌓기나무로 만들어요. 옳게 만들면 다음 사람에게 차례가 넘어가고, 잘못 만들면 세 사람이 도와줘요.",
        "㉠ 첫 번째 순서인 사람은 뒤돌아 있고, 두 번째 순서인 사람은 카드 한 장을 나머지 두 사람과 함께 볼 수 있도록 뒤집어 내려놓아요.",
        "㉣ 순서를 바꾸어 가며 쌓기나무로 만드는 역할을 모두 한 번씩 하면 놀이가 끝나요.",
        "㉡ 카드를 보고 두 번째 사람은 1층, 세 번째 사람은 2층, 네 번째 사람은 3층 모양을 그리고, 옳게 그렸는지 서로 확인해요."], [1, 3, 0, 2],
        { ok: "카드 보여 주기 → 층별 모양 그리기 → 쌓기나무로 만들기 → 역할 바꾸기 차례로 해요." }) },
    { name: "만져 보기", inst: "1번 카드예요. 카드를 보고 1층, 2층, 3층 모양을 그린 다음, 그 층별 모양을 보고 쌓기나무로 만들어 보세요.", hints: ["1층 모양은 위에서 본 모양과 같아요.", "2층, 3층은 그림에서 그 층에 있는 쌓기나무의 자리를 찾아 칠해요."],
      render: (b, a) => { const H = SP6_D.card1;
        sp6Chain(b, a, [
          { title: "① 층별 모양 그리기", run: (bx, ax) => sp6Paint(bx, ax, { show: () => h("div", {}, h("div", { class: "jua" }, "1번 카드 · 만든 모양과 위에서 본 모양"), sp6IsoTop(H), sp6Redrawn()), items: sp6PaintItems(H, ["L1", "L2", "L3"]), msg: "층별 모양을 옳게 그렸어요." }) },
          { title: "② 층별 모양을 보고 쌓기나무로 만들기", run: (bx, ax) => sp6Build(bx, ax, { R: H.length, C: H[0].length, M: 3, show: () => sp6LayerFigs(H), check: G => sp6Same(G, H) ? null : "층별 모양과 견주어 봐요. 1층, 2층, 3층의 자리가 모두 맞아야 해요.", ok: "힘을 합해 1번 카드와 똑같이 만들었어요!" }) }]); } },
    { name: "역할 바꾸기", inst: "2번 카드예요. 이번에는 위에서 본 모양에 수를 쓴 카드예요. 층별 모양을 그린 다음 쌓기나무로 만들어 보세요.", hints: ["1층 모양은 수가 쓰인 칸 모두예요.", "2층은 2 이상이 쓰인 칸, 3층은 3이 쓰인 칸이에요."],
      render: (b, a) => { const H = SP6_D.card2;
        sp6Chain(b, a, [
          { title: "① 층별 모양 그리기", run: (bx, ax) => sp6Paint(bx, ax, { show: () => sp6Fr(sp6View("top", H, { nums: true }), "2번 카드 · 위에서 본 모양에 수를 쓴 것"), items: sp6PaintItems(H, ["L1", "L2", "L3"]), msg: "층별 모양을 옳게 그렸어요." }) },
          { title: "② 층별 모양을 보고 쌓기나무로 만들기", run: (bx, ax) => sp6Build(bx, ax, { R: H.length, C: H[0].length, M: 3, show: () => sp6LayerFigs(H), check: G => sp6Same(G, H) ? null : "층별 모양과 견주어 봐요. 1층, 2층, 3층의 자리가 모두 맞아야 해요.", ok: "2번 카드와 똑같이 만들었어요!" }) }]); } },
    { name: "또 다른 놀이", inst: "2명이 하는 놀이를 컴퓨터와 해 보세요. 컴퓨터가 쌓기나무 5개로 만든 모양의 위에서 본 모양을 보여 줘요. 위에서 본 모양만 보고 옳게 만들면 3점, 위·앞을 보고 만들면 2점, 위·앞·옆을 보고 만들면 1점, 위·앞·옆을 보고도 다르게 만들면 0점이에요. 10점을 먼저 모아 보세요.", hints: ["위에서 본 모양의 칸 수만큼 1층에 놓고, 남은 쌓기나무를 어디에 쌓을지 추측해요.", "앞에서 본 모양으로 세로줄마다 가장 높은 층을, 옆에서 본 모양으로 가로줄마다 가장 높은 층을 알 수 있어요."],
      render: (b, a) => sp6Guess(b, a, { n: 5, goal: 10 }) },
    { name: "확인하기", inst: "놀이를 하며 느낀 점을 정리해 보세요.", hints: ["층별 모양을 그릴 때 어떤 점에 주의했는지 떠올려요.", "친구와 힘을 합할 때 어떻게 도왔는지 떠올려요."],
      render: (b, a) => writeStep(b, a, [
        { q: "카드와 똑같이 만들려면 층별 모양을 그릴 때 무엇에 주의해야 하나요?", tag: "주의할 점", ph: "예) 1층 모양은 위에서 본 모양과 같게, 2층과 3층은 아래층의 같은 자리에 그려요." },
        { q: "친구가 잘못 만들었을 때 어떻게 도와주면 좋을까요?", tag: "배려와 협동", ph: "예) 비난하지 않고 어느 층이 다른지 함께 찾아봐요." }]) }
  ],
  challenge: { inst: "도전 카드예요. 위에서 본 모양에 수를 쓴 것을 보고 1층, 2층, 3층 모양을 그려 보세요.", hints: ["3이 쓰인 칸은 1층, 2층, 3층에 모두 있어요.", "칸의 자리를 바꾸지 말고 그대로 그려요."],
    render: (b, a) => sp6Paint(b, a, { show: () => sp6Fr(sp6View("top", SP6_D.cardCh, { nums: true }), "도전 카드"), items: sp6PaintItems(SP6_D.cardCh, ["L1", "L2", "L3"]),
      ok: `1층 ${sp6Lay(SP6_D.cardCh)[0]}개, 2층 ${sp6Lay(SP6_D.cardCh)[1]}개, 3층 ${sp6Lay(SP6_D.cardCh)[2]}개로 모두 ${sp6Sum(SP6_D.cardCh)}개예요.` }) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "공간과 입체 단원에서 배운 내용으로 문제를 해결할 수 있을까요?",
  summary: "어느 방향에서 본 모습인지 찾을 수 있어요. 쌓기나무로 만든 모양은 만든 모양과 위에서 본 모양, 위·앞·옆에서 본 모양, 위에서 본 모양에 수를 쓰는 방법, 층별로 나타내는 방법으로 나타내고, 이를 보고 쌓기나무의 개수를 구할 수 있어요.",
  steps: [
    { name: "1번", inst: "건축물을 어느 방향에서 본 모습인지 기호를 써 보세요.", hints: ["지도에서 건축물의 앞으로 튀어나온 부분이 어느 쪽에 있는지 살펴봐요.", "사진에서 튀어나온 부분이 정면으로 보여요."],
      render: (b, a) => sp6Ask(b, a, [{ fig: () => h("div", { class: "sp6row" }, h("div", {}, sp6Map(SP6_BLD, SP6_BLD_DIR, { maxW: "14em" }), h("p", { class: "sp6small" }, "빨간 선 쪽으로 건물의 한 부분이 앞으로 튀어나와 있어요.")), h("div", {}, sp6PhotoCard(SP6_BLD, 90, "건축물의 모습"))),
        parts: [{ o: ["가", "나", "다"], a: 2, why: { "0": "가 방향에서 보면 튀어나온 부분이 옆쪽에 보여요.", "1": "나 방향은 튀어나온 부분의 반대쪽이라 튀어나온 부분이 가려져요." } }, " 방향"] }],
        { ok: "건축물에서 앞으로 튀어나온 부분이 정면으로 보이므로 다 방향에서 본 모습이에요." }) },
    { name: "2번", inst: "쌓기나무로 만든 모양과 위에서 본 모양을 보고 똑같은 모양으로 만드는 데 필요한 쌓기나무는 몇 개인지 구해 보세요.", hints: ["위에서 본 모양과 견주어 숨겨진 쌓기나무가 있는지 찾아요.", "층별로 세어 더해요."],
      render: (b, a) => sp6Ask(b, a, [
        { q: "①", fig: () => sp6IsoTop(SP6_D.t2), parts: ["1층 ", { n: 6 }, "개, 2층 ", { n: 2 }, "개, 3층 ", { n: 1 }, "개 → 모두 ", { n: 9, why: { "8": "숨겨진 쌓기나무 1개를 빠뜨렸어요. 위에서 본 모양과 견주어 봐요." } }, "개"] },
        { q: "②", fig: () => sp6IsoTop(SP6_D.k1), parts: ["1층에 ", { n: 5 }, "개, 2층에 ", { n: 3 }, "개, 3층에 ", { n: 1 }, "개이므로 필요한 쌓기나무는 ", { n: 9 }, "개예요."] }],
        { ok: "①은 숨겨진 쌓기나무가 1개 있어서 6+2+1=9(개), ②는 5+3+1=9(개)예요." }) },
    { name: "3번", inst: "쌓기나무 8개로 만든 모양이에요. 위, 앞, 옆에서 본 모양을 각각 그려 보세요.", hints: ["8개로 만든 모양이므로 숨겨진 쌓기나무가 없어요.", "옆에서 본 모양은 오른쪽에서 볼 때 왼쪽부터(앞줄부터) 가장 높은 층을 그려요."],
      render: (b, a) => sp6Paint(b, a, { show: () => sp6Fr(sp6Iso(SP6_D.t3, { side: true, maxW: "11em" }), "쌓기나무 8개로 만든 모양"), items: sp6PaintItems(SP6_D.t3, ["top", "front", "side"]),
        ok: "앞에서 본 모양은 가장 높은 층이 왼쪽부터 2층, 3층이고, 옆에서 본 모양은 왼쪽부터 1층, 1층, 3층이에요." }) },
    { name: "4번 · 5번", inst: "위에서 본 모양에 수를 쓴 것을 보고 어떤 모양을 본 것인지 찾고, 만든 모양과 1층 모양을 보고 2층과 3층 모양을 그려 보세요.", hints: ["가, 나, 다의 각 자리에 쌓인 개수를 세어 수를 쓴 것과 견주어요.", "위층은 바로 아래층의 같은 자리에 있어야 해요."],
      render: (b, a) => sp6Chain(b, a, [
        { title: "4번", run: (bx, ax) => sp6Pick(bx, ax, { show: () => sp6Fr(sp6View("top", SP6_D.t4, { nums: true }), "위에서 본 모양에 수를 쓴 것"),
          items: [{ name: "가", fig: () => sp6Iso(SP6_D.t4A, { maxW: "100%", plain: true }) }, { name: "나", fig: () => sp6Iso(SP6_D.t4B, { maxW: "100%", plain: true }) }, { name: "다", fig: () => sp6Iso(SP6_D.t4, { maxW: "100%", plain: true }) }], a: 2,
          whyExtra: i => ["가를 수로 나타내면 쓰인 수와 달라요. 오른쪽 세로줄의 자리를 견주어 봐요.", "나는 앞줄 왼쪽 자리에 쌓기나무가 없어요. 위에서 본 모양부터 달라요."][i], msg: "다의 각 자리 개수가 쓰인 수와 같아요." }) },
        { title: "5번", run: (bx, ax) => sp6Paint(bx, ax, { show: () => h("div", { class: "sp6figs" }, sp6Fr(sp6Iso(SP6_D.t5, { maxW: "11em" }), "만든 모양"), sp6Fr(sp6View("layer", sp6Layer(SP6_D.t5, 1), { frame: true, cell: 26 }), "1층 모양")),
          items: sp6PaintItems(SP6_D.t5, ["L2", "L3"]), ok: "2층에 쌓기나무 3개, 3층에 1개를 아래층과 같은 자리에 맞게 그렸어요." }) }]) },
    { name: "6번", inst: "쌓기나무로 만든 모양을 위와 앞에서 본 모양이에요. 옆에서 본 모양을 그리려고 해요. 위에서 본 모양에 수를 써 보고, 옆에서 본 모양을 그려 보세요.", hints: ["앞에서 본 모양에서 3층인 세로줄에는 위에서 본 모양의 칸이 하나뿐이에요. 그 자리가 ☆ 자리예요.", "앞에서 본 모양이 1층인 세로줄의 자리는 모두 1개씩이에요."],
      render: (b, a) => sp6Chain(b, a, [
        { title: "위에서 본 모양에 수 쓰기", run: (bx, ax) => sp6Nums(bx, ax, { H: SP6_D.t6, total: true, totalQ: "쌓기나무는 모두", show: () => sp6Views3(sp6Views(SP6_D.t6), { show: ["top", "front"], rows: 3 }), msg: "위와 앞에서 본 모양을 연결 지어 각 자리의 개수를 찾았어요." }) },
        { title: "옆에서 본 모양 그리기", run: (bx, ax) => sp6Paint(bx, ax, { items: sp6PaintItems(SP6_D.t6, ["side"]), ok: "◯ 자리는 각각 1개, ☆ 자리는 3개예요. 옆에서 본 모양은 왼쪽부터 1층, 3층, 1층이에요." }) }]) }
  ],
  challenge: { inst: "확인하고 정리해요. □ 안에 알맞은 수를 써 보세요.", hints: ["그림의 ㉠ 자리에 쌓인 쌓기나무를 세어 봐요.", "층별 모양에서 2층에 칠해진 칸을 세어 봐요."],
    render: (b, a) => { const V = SP6_D.k2.map(r => r.slice()), mk = { "1,2": "㉠" };
      sp6Ask(b, a, [
        { q: "위에서 본 모양에 수를 쓴 것과 만든 모양을 비교해 보세요.", fig: () => h("div", { class: "sp6figs" }, sp6Fr(sp6Iso(SP6_D.k2, { maxW: "10em" }), "만든 모양"), sp6Fr(sp6View("top", V, { nums: true, mark: mk }), "수를 쓴 것")), parts: ["㉠ 자리에 쌓여 있는 쌓기나무는 ", { n: SP6_D.k2[1][2] }, "개예요."] },
        { q: "층별 모양을 보고 2층에 쌓여 있는 쌓기나무의 개수를 세어 보세요.", fig: () => sp6LayerFigs(SP6_D.k3), parts: [{ n: sp6Lay(SP6_D.k3)[1] }, "개"] }],
        { ok: `㉠ 자리에는 ${SP6_D.k2[1][2]}개, 2층에는 ${sp6Lay(SP6_D.k3)[1]}개가 있어요.` }); } }
}
];
