//@@APP
const APP={title:"마을 체육 대회 원기둥·원뿔·구", unit:"6-2 수학 6. 원기둥, 원뿔, 구(교과서)", key:"t62-cylinder-v1", welcome:"마을 체육 대회 원기둥·원뿔·구 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 마을 체육 대회가 열린 체육관에서 예빈이와 함께 물건을 분류하고, 입체도형을 이리저리 돌려 보고, 원기둥을 잘라 펼쳐 전개도를 그리고, 종이를 붙인 막대를 돌려 원기둥·원뿔·구를 만들어 봐요."};
//@@UNIT
/* =========================================================
   6-2 수학 6. 원기둥, 원뿔, 구 — 단원 조작 부품 (앞글자 cy6)
   입체도형은 3차원 좌표로 계산해서 그려요(정사영). 축은 위쪽(y), 앞쪽이 +z.
   보이는 면·보이지 않는 선은 면의 바깥 방향(법선)으로 정하고, 둘레는 표본점의 볼록 껍질로 그려요.
   cy6Fig      입체도형 그림(원기둥·원뿔·원뿔대·구·각기둥·각뿔, 눕히기·돌리기)
   cy6Sort     카드를 눌러 상자에 나누어 담기          cy6Pick    카드 여러 장 고르기
   cy6Tap      입체도형을 돌려 가며 면·꼭짓점 색칠하기  cy6Ruler   자와 삼각자로 높이 재기
   cy6Spin     종이를 붙인 막대를 돌려 입체도형 만들기   cy6Gen     원뿔에 모선 긋기
   cy6Probe    구의 중심 찾기·반지름 긋기              cy6Unroll  원기둥을 잘라 펼치기(움직이는 그림)
   cy6NetMark  전개도에 ◯·△ 표시하기                  cy6NetJudge 전개도가 될 수 있는 것 찾기(예상 → 접어 보기)
   cy6NetDraw  모눈에 원기둥의 전개도 그리기            cy6View    여러 방향에서 보기(앞·뒤·왼쪽·오른쪽·위·아래)
   cy6Make     공학 도구처럼 입체도형 만들기            cy6Riddle  알아맞히기 문제 만들기
   cy6Shout    이름을 외치고 확인하는 놀이(이 앱이 만든 카드)   cy6NameGame 물건 이름 대기 놀이
   cy6Tube     테니스공을 통에 넣어 보기
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.cy6fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none}
.cy6fig.cy6plain{background:transparent;border:none}
.cy6small{font-size:var(--fs-s);color:var(--muted)}
.cy6part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.cy6read{font-family:"Jua",sans-serif;font-size:var(--fs);color:var(--night);line-height:1.5;word-break:keep-all;min-height:1.5em}
.cy6row{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-start}
.cy6row>div{flex:1 1 13em;min-width:0}
.cy6box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all;margin:.3em 0}
.cy6hit{cursor:pointer}
.cy6btns{display:flex;flex-wrap:wrap;gap:.35em;align-items:center;margin:.3em 0}
.cy6btns button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em;min-height:2.2em;font-family:"Jua",sans-serif}
.cy6btns button.cy6-pick{background:var(--night);color:#fff;border-color:var(--night)}
.cy6btns button.cy6-seen{border-color:var(--ok);background:#E3F4EA}
.cy6cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(8em,1fr));gap:.5em;margin:.4em 0}
.cy6card{border:2.5px solid var(--line);background:#fff;border-radius:12px;padding:.25em;text-align:center;cursor:pointer;min-width:0;font-family:"Jua",sans-serif;position:relative;word-break:keep-all}
.cy6card svg{width:100%;height:auto;display:block}
.cy6card.cy6-pick{border-color:var(--ring);background:#EAF3FD;box-shadow:0 0 0 2px var(--ring) inset}
.cy6card.cy6-good{border-color:var(--ok);background:#E3F4EA}
.cy6card.cy6-bad{border-color:var(--no);background:#FBE7E2}
.cy6card.cy6-guess::after{content:"예상";position:absolute;top:.2em;right:.3em;font-size:.75em;background:#FFD27A;border-radius:999px;padding:0 .45em}
.cy6bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(10.5em,1fr));gap:.5em;margin:.4em 0}
.cy6bin{border:2.5px dashed #B9C6D3;border-radius:12px;padding:.3em;min-height:7em;background:#FAFBFC;cursor:pointer;min-width:0}
.cy6bin.cy6-ready{border-color:var(--ring);background:#EEF5FD}
.cy6bin .cy6bh{font-family:"Jua",sans-serif;font-size:var(--fs-s);margin:.1em .2em .3em;word-break:keep-all}
.cy6bin .cy6cards{grid-template-columns:repeat(auto-fill,minmax(5.2em,1fr));gap:.3em;margin:0}
.cy6tray{border:2px solid var(--line);border-radius:12px;padding:.3em;background:#fff;min-height:3em}
.cy6slider{display:flex;align-items:center;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.cy6slider input[type=range]{flex:1 1 10em;min-width:6em}
.cy6tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.cy6tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.cy6tbl th,.cy6tbl td{border:1.5px solid var(--line);padding:.25em .5em;text-align:center}
.cy6tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.cy6gc{border:3px solid #C9B48A;border-radius:14px;background:#FFFDF6;padding:.3em;text-align:center;font-family:"Jua",sans-serif;min-width:0;word-break:keep-all;display:flex;flex-direction:column;justify-content:center;min-height:7.5em}
.cy6gc svg{width:100%;height:auto;display:block;max-height:7em}
.cy6gc .cy6gt{font-size:1.05em;line-height:1.35;padding:.3em .2em}
.cy6gc .cy6mk{font-size:.62em;color:#9A8660;margin-top:.15em}
.cy6gc.cy6-back{background:repeating-linear-gradient(45deg,#EDE3CB,#EDE3CB 8px,#E2D4B2 8px,#E2D4B2 16px);color:transparent}
.cy6table{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.4em;margin:.3em 0}
.cy6pl{border:2px solid var(--line);border-radius:10px;padding:.25em .3em;background:#fff;text-align:center;font-family:"Jua",sans-serif;font-size:var(--fs-s);min-width:0}
.cy6pl.cy6-turn{border-color:var(--ring);box-shadow:0 0 0 2px var(--ring) inset}
.cy6pl .cy6pile{font-size:1.4em;color:var(--night)}
.cy6big{max-width:15em;margin:.3em auto}
.cy6chip{display:inline-block;border:2px solid var(--line);border-radius:999px;background:#fff;padding:.1em .7em;margin:.15em;cursor:pointer;font-family:"Jua",sans-serif;font-size:var(--fs-s)}
.cy6chip.cy6-pick{background:var(--night);color:#fff;border-color:var(--night)}
.cy6chip.cy6-good{border-color:var(--ok);background:#E3F4EA;color:var(--ink)}
.cy6chip.cy6-bad{border-color:var(--no);background:#FBE7E2;color:var(--ink)}
.cy6ccheck{display:grid;grid-template-columns:repeat(auto-fill,minmax(12em,1fr));gap:.5em}
.cy6ccheck>div{border:2px solid var(--line);border-radius:12px;padding:.3em;background:#fff;min-width:0;text-align:center}
.cy6say{display:inline-block;background:#EAF3FD;border:2px solid #B5D2F2;border-radius:14px;padding:.25em .7em;margin:.2em 0;font-family:"Jua",sans-serif;word-break:keep-all}
`;
  document.head.append(s);
})();

/* ---------- 작은 도우미 ---------- */
const CY6 = { ink: "#1D2A2A", gray: "#8795A1", hid: "#7C8A96", blue: "#2B7BD6", red: "#D64545", green: "#2E8B57", org: "#E47A38", purple: "#7A5BB0", gold: "#E3A21A",
  side: "#E6EEF7", top: "#C9DCF2", bot: "#C9DCF2", grid: "#D7E1E9", paper: "#FFE7B8", paper2: "#FBD3A6", stick: "#8B5A2B" };
const CY6_D = Math.PI / 180;
const CY6_PI = 3.14;
const cy6R = v => Math.round(v * 100) / 100;
const cy6M = (a, b) => Math.round(a * b * 100) / 100;          // 소수 곱셈(둘째 자리까지)
const CY6_GA = ["가", "나", "다", "라", "마", "바"];
const CY6_KO = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥"];
/* 받침에 따라 조사 고르기: cy6Jo("원기둥", "이/가") → "원기둥이" */
function cy6Jo(w, pair) {
  const s = String(w), [a, b] = pair.split("/"), c = s.trim().slice(-1);
  let bat = false, rieul = false;
  if (/[0-9]/.test(c)) { bat = "0136780".includes(c); rieul = "178".includes(c); }
  else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  if (pair === "으로/로") return s + (bat && !rieul ? "으로" : "로");
  return s + (bat ? a : b);
}
function cy6Num(s) {
  const t = String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/(센티미터|cm|개|번)$/i, "");
  return t === "" || !/^-?\d+(\.\d+)?$/.test(t) ? NaN : Number(t);
}
const cy6Go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
function cy6Shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function cy6T(svg, x, y, t, size, attrs) { const e = txt(cy6R(x), cy6R(y), t, size || 16, Object.assign({ stroke: "#fff", "stroke-width": 4, "paint-order": "stroke", "stroke-linejoin": "round", "pointer-events": "none" }, attrs || {})); svg.append(e); return e; }
function cy6Seg(svg, p, q, attrs) { const e = svgEl("line", Object.assign({ x1: cy6R(p[0]), y1: cy6R(p[1]), x2: cy6R(q[0]), y2: cy6R(q[1]), stroke: CY6.ink, "stroke-width": 2, "stroke-linecap": "round", "pointer-events": "none" }, attrs || {})); svg.append(e); return e; }
function cy6Dot(svg, p, r, fill) { const e = svgEl("circle", { cx: cy6R(p[0]), cy: cy6R(p[1]), r: r || 4, fill: fill || CY6.ink, "pointer-events": "none" }); svg.append(e); return e; }
/* 이름표: 가리키는 곳 p, 글자 자리 q */
function cy6Call(svg, p, q, t, col) { cy6Seg(svg, p, q, { stroke: col || CY6.gray, "stroke-width": 1.6 }); cy6Dot(svg, p, 3, col || CY6.gray); const b = svgEl("rect", { x: cy6R(q[0] - 9 - t.length * 7.5), y: cy6R(q[1] - 13), width: cy6R(18 + t.length * 15), height: 26, rx: 8, fill: "#fff", stroke: col || CY6.gray, "stroke-width": 1.5, "pointer-events": "none" }); svg.append(b); cy6T(svg, q[0], q[1] + 1, t, 15, { fill: col || CY6.ink, stroke: "none" }); }

/* ---------- 볼록 껍질(둘레) ---------- */
function cy6Hull(P) {
  const p = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 1e-9) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 1e-9) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up);
}
const cy6Pts = A => A.map(p => cy6R(p[0]) + "," + cy6R(p[1])).join(" ");

/* ---------- 다면체(각기둥·각뿔) ---------- */
function cy6Prism(base, hh) { const n = base.length, V = base.map(([x, z]) => [x, 0, z]).concat(base.map(([x, z]) => [x, hh, z]));
  const F = [base.map((_, i) => i), base.map((_, i) => n + i)]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]); return { V, F }; }
function cy6Pyramid(base, hh) { const n = base.length, V = base.map(([x, z]) => [x, 0, z]).concat([[0, hh, 0]]);
  const F = [base.map((_, i) => i)]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n]); return { V, F }; }
function cy6Ngon(n, r, rot) { return Array.from({ length: n }, (_, i) => { const t = (rot == null ? -90 : rot) * CY6_D + i * 2 * Math.PI / n; return [cy6R(r * Math.cos(t)), cy6R(r * Math.sin(t))]; }); }

/* =========================================================
   입체도형 그리기
   o: kind "cyl"|"cone"|"frus"|"sph"|"poly", r, h, r2(원뿔대 윗면), poly {V,F}
      yaw, pitch(기본 20), tilt(눕히기, z축 둘레 각도), spin(세운 채 돌리기)
      s(1 cm의 픽셀, 없으면 box에 맞춤), cx·cy(s가 있을 때 가운데), box [x,y,w,h], pad
      fill {side, top, bot, f:[면 색…]}, hidden "dash"|"none", gen(옆면에 그을 선 수), tap(true면 data-k), equator, apex(꼭짓점 점)
   돌려주는 것: {P(점)→[x,y], Z(방향)→화면 앞쪽 값, vis:{top,bot,apex}, S, hull}
   ========================================================= */
function cy6Draw(svg, o) {
  const kind = o.kind, r = o.r || 1, hh = o.h || 0, r2 = o.r2 || 0, N = 96;
  const ct = Math.cos((o.tilt || 0) * CY6_D), st = Math.sin((o.tilt || 0) * CY6_D);
  const cs = Math.cos((o.spin || 0) * CY6_D), ss = Math.sin((o.spin || 0) * CY6_D);
  const ca = Math.cos((o.yaw || 0) * CY6_D), sa = Math.sin((o.yaw || 0) * CY6_D);
  const pb = (o.pitch == null ? 20 : o.pitch) * CY6_D, cb = Math.cos(pb), sb = Math.sin(pb);
  const mid = kind === "sph" ? 0 : kind === "poly" ? (o.mid != null ? o.mid : (Math.max(...o.poly.V.map(v => v[1])) + Math.min(...o.poly.V.map(v => v[1]))) / 2) : hh / 2;
  const rotV = (v, pt) => {
    let x = v[0], y = v[1] - (pt ? mid : 0), z = v[2];
    const x1 = x * ct - y * st, y1 = x * st + y * ct;
    const x2 = x1 * cs + z * ss, z2 = -x1 * ss + z * cs;
    const x3 = x2 * ca + z2 * sa, z3 = -x2 * sa + z2 * ca;
    return [x3, y1 * cb - z3 * sb, y1 * sb + z3 * cb];
  };
  const Zn = n => rotV(n, false)[2];
  const TH = Array.from({ length: N }, (_, i) => i * 2 * Math.PI / N);
  const rim = (rr, y) => TH.map(t => [rr * Math.cos(t), y, rr * Math.sin(t)]);
  let rims = [], sideN = null, apex = null, samples = [];
  if (kind === "cyl") { rims = [{ k: "bot", L: rim(r, 0), n: [0, -1, 0] }, { k: "top", L: rim(r, hh), n: [0, 1, 0] }]; sideN = t => [Math.cos(t), 0, Math.sin(t)]; }
  else if (kind === "cone") { rims = [{ k: "bot", L: rim(r, 0), n: [0, -1, 0] }]; apex = [0, hh, 0]; sideN = t => [hh * Math.cos(t), r, hh * Math.sin(t)]; }
  else if (kind === "frus") { rims = [{ k: "bot", L: rim(r, 0), n: [0, -1, 0] }, { k: "top", L: rim(r2, hh), n: [0, 1, 0] }]; sideN = t => [hh * Math.cos(t), r - r2, hh * Math.sin(t)]; }
  rims.forEach(R => samples.push(...R.L)); if (apex) samples.push(apex);
  if (kind === "poly") samples = o.poly.V.slice();
  if (kind === "sph") samples = [[r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r]];
  const Q = samples.map(p => rotV(p, true));
  let S, mx = 0, my = 0, cx, cy;
  if (kind === "sph") { const c = rotV([0, 0, 0], true); Q.length = 0; for (let i = 0; i < 4; i++) Q.push([c[0] + [r, -r, 0, 0][i], c[1] + [0, 0, r, -r][i]]); }
  if (o.s) { S = o.s; cx = o.cx; cy = o.cy; }
  else {
    const [bx, by, bw, bh] = o.box || [0, 0, 300, 240], pad = o.pad == null ? 16 : o.pad;
    const xs = Q.map(q => q[0]), ys = Q.map(q => q[1]); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    S = Math.min((bw - 2 * pad) / Math.max(x1 - x0, 1e-6), (bh - 2 * pad) / Math.max(y1 - y0, 1e-6)); if (o.maxS) S = Math.min(S, o.maxS);
    mx = (x0 + x1) / 2; my = (y0 + y1) / 2; cx = bx + bw / 2; cy = by + bh / 2;
  }
  const scr = q => [cx + S * (q[0] - mx), cy - S * (q[1] - my)];
  const P = p => scr(rotV(p, true));
  const fill = o.fill || {}, HID = o.hidden || "dash", g = svgEl("g"); svg.append(g);
  const sw = o.sw || 2.4;
  const info = { P, Z: Zn, S, vis: {}, rotV };
  const hit = (e, k) => { if (o.tap) { e.classList.add("cy6hit"); e.dataset.k = k; } return e; };
  if (kind === "sph") {
    const c = P([0, 0, 0]), R = r * S;
    g.append(hit(svgEl("circle", { cx: cy6R(c[0]), cy: cy6R(c[1]), r: cy6R(R), fill: fill.side || CY6.side, stroke: CY6.ink, "stroke-width": sw }), "side"));
    if (o.shade !== false) g.append(svgEl("ellipse", { cx: cy6R(c[0] - R * .32), cy: cy6R(c[1] - R * .34), rx: cy6R(R * .26), ry: cy6R(R * .16), fill: "#fff", opacity: .55, "pointer-events": "none" }));
    if (o.equator) cy6Curve(g, info, t => [r * Math.cos(t), 0, r * Math.sin(t)], t => [Math.cos(t), 0, Math.sin(t)], { stroke: CY6.hid, width: 1.6, hidden: true });
    info.hull = []; info.c = c; info.R = R;
    return info;
  }
  if (kind === "poly") {
    const V = o.poly.V, F = o.poly.F, cen = V.reduce((s, v) => [s[0] + v[0] / V.length, s[1] + v[1] / V.length, s[2] + v[2] / V.length], [0, 0, 0]);
    const nrm = F.map(f => { const a = V[f[0]], b = V[f[1]], c = V[f[2]]; const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const fc = f.reduce((s, i) => [s[0] + V[i][0] / f.length, s[1] + V[i][1] / f.length, s[2] + V[i][2] / f.length], [0, 0, 0]);
      if (n[0] * (fc[0] - cen[0]) + n[1] * (fc[1] - cen[1]) + n[2] * (fc[2] - cen[2]) < 0) n = n.map(x => -x); return n; });
    const fv = nrm.map(n => Zn(n) > 1e-6), S2 = V.map(P), fc = (fill.f || []);
    F.forEach((f, i) => { if (!fv[i] && fc[i]) g.append(svgEl("polygon", { points: cy6Pts(f.map(k => S2[k])), fill: fc[i], "fill-opacity": .35, stroke: "none" })); });
    F.forEach((f, i) => { if (fv[i]) g.append(hit(svgEl("polygon", { points: cy6Pts(f.map(k => S2[k])), fill: fc[i] || fill.side || CY6.side, "fill-opacity": .95, stroke: "none" }), "f" + i)); });
    const E = new Map(); F.forEach((f, i) => f.forEach((a, j) => { const b = f[(j + 1) % f.length], key = Math.min(a, b) + "-" + Math.max(a, b); const e = E.get(key) || { a, b, v: false }; e.v = e.v || fv[i]; E.set(key, e); }));
    [...E.values()].sort((x, y) => x.v - y.v).forEach(e => { if (!e.v && HID === "none") return; cy6Seg(g, S2[e.a], S2[e.b], e.v ? { "stroke-width": sw } : { stroke: CY6.hid, "stroke-width": 1.6, "stroke-dasharray": "6 5" }); });
    info.vis.faces = fv; info.hull = cy6Hull(S2);
    return info;
  }
  // 굽은 면이 있는 입체(원기둥·원뿔·원뿔대)
  const sv = t => Zn(sideN(t)) > 1e-6;
  rims.forEach(R => { R.vis = Zn(R.n) > 1e-6; info.vis[R.k] = R.vis; R.S = R.L.map(P); });
  const SA = samples.map(P), hull = cy6Hull(SA); info.hull = hull;
  rims.forEach(R => { const c = fill[R.k]; if (!R.vis && c) g.append(svgEl("polygon", { points: cy6Pts(R.S), fill: c, "fill-opacity": .35, stroke: "none" })); });
  g.append(hit(svgEl("polygon", { points: cy6Pts(hull), fill: fill.side || CY6.side, stroke: "none" }), "side"));
  if (o.shadeSide !== false) { const lit = svgEl("polygon", { points: cy6Pts(hull), fill: "url(#cy6sh)", stroke: "none", "pointer-events": "none" }); cy6Grad(svg); g.append(lit); }
  rims.forEach(R => { if (R.vis) g.append(hit(svgEl("polygon", { points: cy6Pts(R.S), fill: fill[R.k] || (R.k === "top" ? CY6.top : CY6.bot), stroke: "none" }), R.k)); });
  if (o.gen) for (let k = 0; k < o.gen; k++) { const t = 2 * Math.PI * k / o.gen + (o.genOff || 0); if (!sv(t) || Zn(sideN(t)) < .05) continue;
    const p0 = P([r * Math.cos(t), 0, r * Math.sin(t)]), p1 = apex ? P(apex) : P([(kind === "frus" ? r2 : r) * Math.cos(t), hh, (kind === "frus" ? r2 : r) * Math.sin(t)]);
    cy6Seg(g, p0, p1, { stroke: o.genCol || "#9FB3C8", "stroke-width": 1.4 }); }
  // 보이지 않는 둘레(점선) → 바깥 둘레 → 보이는 둘레
  const dH = [], dV = [];
  rims.forEach(R => { for (let i = 0; i < N; i++) { const j = (i + 1) % N, tm = (TH[i] + Math.PI / N), vis = R.vis || sv(tm);
    (vis ? dV : dH).push(`M${cy6R(R.S[i][0])} ${cy6R(R.S[i][1])}L${cy6R(R.S[j][0])} ${cy6R(R.S[j][1])}`); } });
  if (HID !== "none" && dH.length) g.append(svgEl("path", { d: dH.join(""), stroke: CY6.hid, "stroke-width": 1.6, "stroke-dasharray": "6 5", fill: "none", "pointer-events": "none" }));
  g.append(svgEl("polygon", { points: cy6Pts(hull), fill: "none", stroke: CY6.ink, "stroke-width": sw, "stroke-linejoin": "round", "pointer-events": "none" }));
  if (dV.length) g.append(svgEl("path", { d: dV.join(""), stroke: CY6.ink, "stroke-width": sw, fill: "none", "stroke-linecap": "round", "pointer-events": "none" }));
  if (apex) { info.vis.apex = TH.some(t => sv(t)); if (o.apex && info.vis.apex) { const A = P(apex); g.append(hit(svgEl("circle", { cx: cy6R(A[0]), cy: cy6R(A[1]), r: 14, fill: "transparent" }), "apex")); } }
  return info;
}
function cy6Grad(svg) {
  if (svg.querySelector("#cy6sh")) return;
  const d = svgEl("defs"), lg = svgEl("linearGradient", { id: "cy6sh", x1: 0, y1: 0, x2: 1, y2: 0 });
  [[0, "#fff", .45], [.35, "#fff", .1], [.75, "#000", 0], [1, "#000", .12]].forEach(([o, c, a]) => lg.append(svgEl("stop", { offset: o, "stop-color": c, "stop-opacity": a })));
  d.append(lg); svg.prepend(d);
}
/* 입체도형 겉면 위의 곡선(보이는 곳만, hidden이면 점선도) */
function cy6Curve(svg, info, f, n, o = {}) {
  const st = o.steps || 72, a = o.from || 0, b = o.to == null ? 2 * Math.PI : o.to, dV = [], dH = [];
  for (let i = 0; i < st; i++) { const t0 = a + (b - a) * i / st, t1 = a + (b - a) * (i + 1) / st, tm = (t0 + t1) / 2, p = info.P(f(t0)), q = info.P(f(t1));
    (info.Z(n(tm)) > 0 ? dV : dH).push(`M${cy6R(p[0])} ${cy6R(p[1])}L${cy6R(q[0])} ${cy6R(q[1])}`); }
  if (o.hidden && dH.length) svg.append(svgEl("path", { d: dH.join(""), stroke: o.hcol || CY6.hid, "stroke-width": 1.4, "stroke-dasharray": "5 5", fill: "none", "pointer-events": "none" }));
  if (dV.length) svg.append(svgEl("path", { d: dV.join(""), stroke: o.stroke || CY6.ink, "stroke-width": o.width || 2, fill: "none", "stroke-linecap": "round", "pointer-events": "none" }));
}
function cy6Fig(o) {
  const W = o.W || 300, H = o.H || 240, svg = makeSvg(W, H);
  svg.setAttribute("class", "cy6fig" + (o.plain ? " cy6plain" : "")); svg.style.maxWidth = o.maxW || "22em";
  const info = cy6Draw(svg, Object.assign({ box: [0, 0, W, H] }, o));
  if (o.after) o.after(svg, info);
  return svg;
}

/* ---------- 물건 그림(놀이·분류용) ---------- */
const CY6_OBJS = {
  can: { n: "음료수 캔", k: "cyl", o: { kind: "cyl", r: 1, h: 1.9, fill: { side: "#E86B6B", top: "#D9DDE2", bot: "#D9DDE2" } } },
  bottle: { n: "물통", k: "cyl", o: { kind: "cyl", r: .85, h: 2.5, fill: { side: "#8CC1EA", top: "#5C8FBF", bot: "#5C8FBF" } } },
  tube: { n: "셔틀콕 보관 통", k: "cyl", o: { kind: "cyl", r: .55, h: 3.2, fill: { side: "#F2C14E", top: "#FFFFFF", bot: "#FFFFFF" } } },
  roller: { n: "폼 롤러", k: "cyl", o: { kind: "cyl", r: .75, h: 3, tilt: 90, yaw: -25, pitch: 25, fill: { side: "#A08BD6", top: "#7E68B8", bot: "#7E68B8" } } },
  baton: { n: "배턴", k: "cyl", o: { kind: "cyl", r: .3, h: 3.2, tilt: 90, yaw: -30, pitch: 25, fill: { side: "#F0A43A", top: "#C77F1E", bot: "#C77F1E" } } },
  pencase: { n: "원통 필통", k: "cyl", o: { kind: "cyl", r: .6, h: 2.6, fill: { side: "#7DC9A6", top: "#4E9E7C", bot: "#4E9E7C" } } },
  hat: { n: "고깔모자", k: "cone", o: { kind: "cone", r: 1, h: 2.3, fill: { side: "#F7A8C8", bot: "#E07AA5" }, gen: 10, genCol: "#E07AA5" } },
  rcone: { n: "러버 콘", k: "cone", o: { kind: "cone", r: 1, h: 2.5, fill: { side: "#F59A3C", bot: "#D97B22" }, band: true } },
  minicone: { n: "미니 콘", k: "cone", o: { kind: "cone", r: 1, h: 1.3, fill: { side: "#F7D65A", bot: "#D9B42C" } } },
  popper: { n: "폭죽", k: "cone", o: { kind: "cone", r: .9, h: 2.1, tilt: 180, pitch: 18, fill: { side: "#6CC7AE", bot: "#F5E6A8" }, gen: 8, genCol: "#3E9C83" } },
  icecream: { n: "아이스크림 콘 과자", k: "cone", o: { kind: "cone", r: .8, h: 2.2, tilt: 180, pitch: 18, fill: { side: "#E3B26E", bot: "#F6E1BE" }, gen: 12, genCol: "#B98544" } },
  roof: { n: "원뿔 모양 지붕", k: "cone", o: { kind: "cone", r: 1.2, h: 1.5, fill: { side: "#C9605A", bot: "#A8433E" }, gen: 14, genCol: "#A8433E" } },
  basket: { n: "농구공", k: "sph", o: { kind: "sph", r: 1, fill: { side: "#E8833A" }, deco: "basket" } },
  pingpong: { n: "탁구공", k: "sph", o: { kind: "sph", r: 1, fill: { side: "#FFFFFF" } } },
  volley: { n: "배구공", k: "sph", o: { kind: "sph", r: 1, fill: { side: "#F6EAB4" }, deco: "volley" } },
  candy: { n: "막대 사탕", k: "sph", o: { kind: "sph", r: 1, fill: { side: "#F38BAA" }, deco: "candy" } },
  globe: { n: "지구본", k: "sph", o: { kind: "sph", r: 1, fill: { side: "#8FC8F0" }, deco: "globe" } },
  marble: { n: "구슬", k: "sph", o: { kind: "sph", r: 1, fill: { side: "#B9E3C6" }, deco: "marble" } },
  dice: { n: "대형 주사위", k: "none", o: { kind: "poly", poly: cy6Prism([[-1, -1], [1, -1], [1, 1], [-1, 1]], 2), yaw: -30, pitch: 24, fill: { side: "#FFFFFF" }, deco: "dice" } }
};
function cy6ObjFig(key, o2 = {}) {
  const ob = CY6_OBJS[key], W = o2.W || 160, H = o2.H || 140, base = Object.assign({}, ob.o, { W, H, plain: o2.plain !== false, maxW: o2.maxW || "100%", hidden: "none", pad: 12 });
  if (ob.o.deco === "candy") base.box = [0, 0, W, H * .78];
  base.after = (svg, I) => {
    const d = ob.o.deco;
    if (d === "basket") { cy6Curve(svg, I, t => [Math.cos(t), 0, Math.sin(t)], t => [Math.cos(t), 0, Math.sin(t)], { width: 1.8 });
      cy6Curve(svg, I, t => [Math.sin(t) * .26, Math.cos(t), Math.sin(t) * .96], t => [Math.sin(t) * .26, Math.cos(t), Math.sin(t) * .96], { width: 1.8 });
      cy6Curve(svg, I, t => [Math.sin(t) * .96, Math.cos(t), -Math.sin(t) * .26], t => [Math.sin(t) * .96, Math.cos(t), -Math.sin(t) * .26], { width: 1.8 }); }
    if (d === "volley") [0, 60, 120].forEach(a => { const c = Math.cos(a * CY6_D), s = Math.sin(a * CY6_D);
      cy6Curve(svg, I, t => [Math.cos(t) * c, Math.sin(t), Math.cos(t) * s], t => [Math.cos(t) * c, Math.sin(t), Math.cos(t) * s], { width: 1.6, stroke: "#4A79B8" }); });
    if (d === "globe") { cy6Curve(svg, I, t => [Math.cos(t), 0, Math.sin(t)], t => [Math.cos(t), 0, Math.sin(t)], { width: 1.4, stroke: "#2E6FA8" });
      cy6Curve(svg, I, t => [Math.sin(t) * .5, Math.cos(t), Math.sin(t) * .87], t => [Math.sin(t) * .5, Math.cos(t), Math.sin(t) * .87], { width: 1.4, stroke: "#2E6FA8" });
      const c = I.P([0, 0, 0]); svg.append(svgEl("path", { d: `M${c[0] - 20} ${c[1] - 14}q12 -10 22 -2q8 8 -2 16q-14 6 -20 -14z`, fill: "#6DBB7A", "pointer-events": "none" })); }
    if (d === "candy") { const b = I.P([0, -1, 0]); cy6Seg(svg, b, [b[0], H - 6], { stroke: "#C8B79A", "stroke-width": 6 });
      cy6Curve(svg, I, t => [Math.cos(t) * .7, Math.sin(t) * .7, .71], t => [Math.cos(t) * .7, Math.sin(t) * .7, .71], { stroke: "#fff", width: 3 }); }
    if (d === "marble") cy6Curve(svg, I, t => [Math.sin(t) * .9, Math.cos(t) * .9, .44], t => [0, 0, 1], { stroke: "#5FAF7B", width: 3, from: .6, to: 2.5 });
    if (d === "dice") [[0, 2, 0], [0, 1, 1]].forEach(() => { });
    if (d === "dice") { [[0, 2, 0], [-.5, 2, -.5], [.5, 2, .5]].forEach(p => { const q = I.P(p); cy6Dot(svg, q, 4, "#D64545"); }); [[-.5, 1.5, 1], [.5, .5, 1]].forEach(p => cy6Dot(svg, I.P(p), 4, "#1D2A2A")); }
    if (ob.o.band) [.35, .62].forEach(y => cy6Curve(svg, I, t => [(1 - y) * Math.cos(t), y * 2.5, (1 - y) * Math.sin(t)], t => [2.5 * Math.cos(t), 1, 2.5 * Math.sin(t)], { stroke: "#fff", width: 5, steps: 60 }));
    if (key === "hat") { const a = I.P([0, 2.3, 0]); svg.append(svgEl("circle", { cx: a[0], cy: a[1] - 4, r: 7, fill: "#FFD27A", stroke: "#E3A21A", "pointer-events": "none" })); }
    if (key === "popper") { const a = I.P([0, 0, 0]); [[-22, -16, "#F2C14E"], [-6, -26, "#E86B6B"], [12, -20, "#2B7BD6"], [24, -10, "#7A5BB0"], [0, -12, "#2E8B57"]].forEach(([dx, dy, c]) => svg.append(svgEl("rect", { x: cy6R(a[0] + dx), y: cy6R(a[1] + dy - 10), width: 6, height: 6, fill: c, transform: `rotate(30 ${cy6R(a[0] + dx)} ${cy6R(a[1] + dy - 10)})` }))); }
    if (key === "icecream") { const a = I.P([0, 0, 0]); svg.append(svgEl("ellipse", { cx: a[0], cy: a[1] - 6, rx: 30, ry: 16, fill: "#FBE3EC", stroke: "#E0A5BC", "pointer-events": "none" })); }
  };
  return cy6Fig(base);
}
/* 이 단원에서 쓰는 입체도형 모양(분류 문제용) */
const CY6_SH = {
  cyl: { kind: "cyl", r: 1, h: 1.8, fill: { side: "#DCEAFB", top: "#9CC3F0", bot: "#9CC3F0" } },
  cylT: { kind: "cyl", r: .7, h: 2.6, fill: { side: "#DCEAFB", top: "#9CC3F0", bot: "#9CC3F0" } },
  cylL: { kind: "cyl", r: .9, h: 2.4, tilt: 90, yaw: -28, pitch: 22, fill: { side: "#DCEAFB", top: "#9CC3F0", bot: "#9CC3F0" } },
  cylW: { kind: "cyl", r: 1.3, h: .9, fill: { side: "#DCEAFB", top: "#9CC3F0", bot: "#9CC3F0" } },
  cone: { kind: "cone", r: 1, h: 2, fill: { side: "#FDE3D3", bot: "#F6B38E" } },
  coneT: { kind: "cone", r: .7, h: 2.6, fill: { side: "#FDE3D3", bot: "#F6B38E" } },
  coneL: { kind: "cone", r: .9, h: 2.4, tilt: 90, yaw: -25, pitch: 20, fill: { side: "#FDE3D3", bot: "#F6B38E" } },
  coneD: { kind: "cone", r: 1, h: 2, tilt: 180, pitch: 20, fill: { side: "#FDE3D3", bot: "#F6B38E" } },
  frus: { kind: "frus", r: 1.1, r2: .55, h: 1.6, fill: { side: "#EADFF6", top: "#C7B4E6", bot: "#C7B4E6" } },
  sph: { kind: "sph", r: 1, fill: { side: "#DDEDE5" } },
  sphS: { kind: "sph", r: .7, fill: { side: "#DDEDE5" } },
  tri: { kind: "poly", poly: cy6Prism(cy6Ngon(3, 1.15), 1.8), yaw: -20, pitch: 22, fill: { side: "#FFF1C7" } },
  box: { kind: "poly", poly: cy6Prism([[-1.1, -.7], [1.1, -.7], [1.1, .7], [-1.1, .7]], 1.4), yaw: -30, pitch: 22, fill: { side: "#FFF1C7" } },
  pent: { kind: "poly", poly: cy6Prism(cy6Ngon(5, 1.05), 1.6), yaw: -15, pitch: 22, fill: { side: "#FFF1C7" } },
  hex: { kind: "poly", poly: cy6Prism(cy6Ngon(6, 1.05, 0), 1.5), yaw: -15, pitch: 22, fill: { side: "#FFF1C7" } },
  pyr4: { kind: "poly", poly: cy6Pyramid([[-1, -1], [1, -1], [1, 1], [-1, 1]], 2), yaw: -28, pitch: 20, fill: { side: "#FBE0E6" } },
  pyr3: { kind: "poly", poly: cy6Pyramid(cy6Ngon(3, 1.2), 2), yaw: -20, pitch: 20, fill: { side: "#FBE0E6" } }
};
const cy6Shp = (k, o2 = {}) => () => cy6Fig(Object.assign({}, CY6_SH[k], { W: 150, H: 130, plain: true, maxW: "100%", pad: 12 }, o2));

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기, 여러 개 고르기 multi) ---------- */
function cy6Ask(host, api, items, opts = {}) {
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
        const slot = h("span", { class: "slot" }), s = { pt, v: pt.multi ? new Set() : null, slot };
        pt.o.forEach((o, oi) => slot.append(h("button", { class: "opt", onclick: e => {
          if (pt.multi) { s.v.has(oi) ? s.v.delete(oi) : s.v.add(oi); e.currentTarget.classList.toggle("on"); [...slot.children].forEach(b => b.classList.remove("good", "bad")); }
          else { [...slot.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); s.v = oi; }
        } }, o)));
        sent.append(slot); all.push(s);
      } else {
        const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "답", style: `width:${pt.w || "4.5em"};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : String(pt.n);
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? pt : pt.nodeType ? " " : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : Math.abs(cy6Num(s.inp.value) - s.pt.n) < 1e-9;
  const val = s => s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-");
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); });
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) return api.done(ans, opts.ok);
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(cy6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열려요 */
function cy6Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "cy6part" : "" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); cy6Go(body.lastChild);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}
/* 조작을 마친 뒤 물음(ask)으로 이어 가기 */
function cy6Then(body, api, opt, ans, msg) {
  if (body.cy6Fin) return; body.cy6Fin = true;
  body.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "cy6part" }); body.append(box); opt.then(box, api); cy6Go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask() : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = cy6Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle, bad: opt.bad }); cy6Go(w); }
  else api.done(ans, opt.ok || msg);
}

/* ---------- 카드 여러 장 고르기 ---------- */
function cy6Pick(body, api, opt) {
  const sel = new Set();
  const cards = opt.items.map((it, i) => { const c = h("div", { class: "cy6card" }, it.fig ? it.fig() : null, h("div", {}, it.name)); c.addEventListener("click", () => { sel.has(i) ? sel.delete(i) : sel.add(i); c.classList.toggle("cy6-pick", sel.has(i)); c.classList.remove("cy6-good", "cy6-bad"); }); return c; });
  api.provide({ words: opt.a.map(i => opt.items[i].name), answers: [opt.a.map(i => opt.items[i].name).join(", ")] });
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), h("div", { class: "cy6cards", style: `grid-template-columns:repeat(auto-fill,minmax(${opt.cardW || "7.5em"},1fr))` }, ...cards),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const got = [...sel].sort().map(i => opt.items[i].name).join(", ") || "-";
      cards.forEach((c, i) => { c.classList.remove("cy6-good", "cy6-bad"); if (sel.has(i)) c.classList.add(opt.a.includes(i) ? "cy6-good" : "cy6-bad"); });
      const ex = [...sel].find(i => !opt.a.includes(i));
      if (ex != null) return api.fail(opt.whyExtra ? (opt.whyExtra(ex) || `${cy6Jo(opt.items[ex].name, "은/는")} 답이 아니에요.`) : `${cy6Jo(opt.items[ex].name, "은/는")} 답이 아니에요.`, got);
      if (sel.size < opt.a.length) return api.fail(opt.whyMiss || `아직 ${opt.a.length - sel.size}개 더 있어요.`, got);
      cy6Then(body, api, opt, got, opt.msg);
    } }, "확인하기")));
}

/* ---------- 나누어 담기: 카드를 누르고 → 상자를 눌러요 ---------- */
function cy6Sort(body, api, opt) {
  const place = opt.items.map(() => -1); let sel = null;
  const tray = h("div", { class: "cy6tray cy6cards", style: `grid-template-columns:repeat(auto-fill,minmax(${opt.cardW || "6.5em"},1fr))` });
  const binsEl = h("div", { class: "cy6bins" });
  const binBox = opt.bins.map((t, bi) => { const cards = h("div", { class: "cy6cards" }); const el = h("div", { class: "cy6bin" }, h("div", { class: "cy6bh" }, t), cards);
    el.addEventListener("click", e => { if (e.target.closest(".cy6card")) return; if (sel == null) return api.hint("먼저 옮길 카드를 눌러 골라요."); place[sel] = bi; sel = null; draw(); }); binsEl.append(el); return { el, cards }; });
  const cardEl = opt.items.map((it, i) => { const c = h("div", { class: "cy6card" }, it.fig ? it.fig() : null, h("div", {}, it.name));
    c.addEventListener("click", () => { sel = sel === i ? null : i; draw(); }); return c; });
  const msg = h("div", { class: "cy6small" }, "카드를 누른 다음, 넣을 상자를 눌러요. 상자에 넣은 카드도 다시 눌러 옮길 수 있어요.");
  function draw() {
    tray.innerHTML = ""; binBox.forEach(b => { b.cards.innerHTML = ""; b.el.classList.toggle("cy6-ready", sel != null); });
    cardEl.forEach((c, i) => { c.classList.toggle("cy6-pick", sel === i); c.classList.remove("cy6-good", "cy6-bad"); (place[i] < 0 ? tray : binBox[place[i]].cards).append(c); });
    if (!tray.children.length) tray.append(h("span", { class: "cy6small" }, "카드를 모두 상자에 넣었어요."));
  }
  api.provide({ words: opt.bins, answers: opt.bins.map((t, bi) => `${t}: ${opt.items.filter(it => it.bin === bi).map(it => it.name).join(", ")}`) });
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), msg, tray, binsEl, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const got = opt.bins.map((t, bi) => t + ": " + opt.items.filter((_, i) => place[i] === bi).map(it => it.name).join(",")).join(" / ");
    if (place.some(p => p < 0)) return api.fail("아직 상자에 넣지 않은 카드가 있어요.", got);
    cardEl.forEach((c, i) => c.classList.add(place[i] === opt.items[i].bin ? "cy6-good" : "cy6-bad"));
    const w = opt.items.findIndex((it, i) => place[i] !== it.bin);
    if (w >= 0) return api.fail((opt.items[w].why) || opt.bad || `${cy6Jo(opt.items[w].name, "을/를")} 다시 살펴봐요.`, got);
    cy6Then(body, api, opt, got, opt.msg);
  } }, "확인하기")));
  draw();
}

/* ---------- 돌려 볼 수 있는 입체도형 판(끌거나 단추로 돌리기, 누르기) ---------- */
function cy6Turnable(o) {
  const W = o.W || 360, H = o.H || 300, svg = makeSvg(W, H);
  svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = o.maxW || "24em";
  const st = { yaw: o.yaw == null ? -20 : o.yaw, pitch: o.pitch == null ? 22 : o.pitch };
  const sol = () => typeof o.solid === "function" ? o.solid(st) : o.solid;
  const fixS = () => { const s0 = sol(); const Rb = s0.kind === "sph" ? s0.r : Math.hypot(Math.max(s0.r || 1, s0.r2 || 0), (s0.h || 0) / 2); return { s: Math.min(W, H) * (o.fill || .4) / Rb, cx: W / 2, cy: H / 2 }; };
  let I = null;
  const draw = () => { svg.innerHTML = ""; I = cy6Draw(svg, Object.assign({}, sol(), o.fit ? { box: [0, 0, W, H] } : fixS(), { yaw: st.yaw, pitch: st.pitch, tap: !!o.onTap })); if (o.after) o.after(svg, I, st); };
  let down = null;
  svg.addEventListener("pointerdown", e => { const p = svgPt(svg, e); down = { p, yaw: st.yaw, pitch: st.pitch, k: e.target && e.target.dataset ? e.target.dataset.k : null, moved: false }; try { svg.setPointerCapture(e.pointerId); } catch (er) { } });
  svg.addEventListener("pointermove", e => { if (!down) return; const p = svgPt(svg, e), dx = p.x - down.p.x, dy = p.y - down.p.y;
    if (!down.moved && Math.hypot(dx, dy) < 7) return; down.moved = true; if (o.fixed) return;
    st.yaw = down.yaw + dx * .6; st.pitch = Math.max(-90, Math.min(90, down.pitch + dy * .5)); draw(); o.onTurn && o.onTurn(st); });
  const up = () => { if (!down) return; const d = down; down = null; if (!d.moved && d.k && o.onTap) o.onTap(d.k); };
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", () => { down = null; });
  const turn = (dy, dp) => { st.yaw += dy; st.pitch = Math.max(-90, Math.min(90, st.pitch + dp)); draw(); o.onTurn && o.onTurn(st); };
  const tools = o.fixed ? null : h("div", { class: "cy6btns" }, h("span", { class: "cy6small" }, "끌거나 눌러서 돌려요:"),
    h("button", { onclick: () => turn(-30, 0), "aria-label": "왼쪽으로 돌리기" }, "◀"), h("button", { onclick: () => turn(30, 0), "aria-label": "오른쪽으로 돌리기" }, "▶"),
    h("button", { onclick: () => turn(0, -30), "aria-label": "위로 돌리기" }, "▲"), h("button", { onclick: () => turn(0, 30), "aria-label": "아래로 돌리기" }, "▼"),
    h("button", { onclick: () => { st.yaw = o.yaw == null ? -20 : o.yaw; st.pitch = o.pitch == null ? 22 : o.pitch; draw(); o.onTurn && o.onTurn(st); } }, "처음 모양"));
  draw();
  return { svg, tools, draw, st, info: () => I, el: h("div", {}, svg, tools) };
}

/* ---------- 색칠하기: 입체도형을 돌려 가며 면(꼭짓점)을 눌러 색칠 ---------- */
function cy6Tap(body, api, opt) {
  const pens = opt.pens || [{ c: "#F28B82", n: "빨간색" }];
  let pen = 0; const col = {};
  const NM = { top: "위쪽 평평한 면", bot: "아래쪽 평평한 면", side: "굽은 면", apex: "뾰족한 부분의 점" };
  const T = cy6Turnable({ W: 360, H: 300, solid: () => Object.assign({}, opt.solid, { fill: { side: col.side || "#F4F8FC", top: col.top || "#F4F8FC", bot: col.bot || "#F4F8FC" }, apex: opt.apexTap }),
    yaw: opt.yaw, pitch: opt.pitch,
    after: (svg, I) => { if (col.apex && I.vis.apex !== false) { const A = I.P([0, opt.solid.h, 0]); cy6Dot(svg, A, 9, col.apex); } },
    onTap: k => { if (k === "apex" && !opt.apexTap) return; col[k] = col[k] === pens[pen].c ? null : pens[pen].c; T.draw(); read.textContent = say(); } });
  const say = () => { const ks = Object.keys(col).filter(k => col[k]); return ks.length ? "색칠한 곳: " + ks.map(k => NM[k] + "(" + pens.find(p => p.c === col[k]).n + ")").join(", ") : "아직 색칠한 곳이 없어요."; };
  const read = h("div", { class: "cy6read" }, say());
  const penBar = pens.length > 1 ? h("div", { class: "cy6btns" }, h("span", { class: "cy6small" }, "색 고르기:"), ...pens.map((p, i) => { const b = h("button", { class: i === pen ? "cy6-pick" : "", onclick: () => { pen = i; [...penBar.querySelectorAll("button")].forEach((x, j) => x.classList.toggle("cy6-pick", j === i)); } }, h("span", { style: `display:inline-block;width:.9em;height:.9em;border-radius:50%;background:${p.c};vertical-align:-.1em;margin-right:.3em` }), p.n); return b; })) : null;
  api.provide({ words: opt.words || [], answers: [] });
  body.append(h("div", { class: "cy6small" }, "평평한 면이 아래에 숨어 있으면 입체도형을 돌려서 찾아요. 칠한 곳을 한 번 더 누르면 지워져요."), ...(penBar ? [penBar] : []), T.svg, T.tools, read,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const want = opt.want, ks = new Set([...Object.keys(want), ...Object.keys(col).filter(k => col[k])]);
      for (const k of ks) if ((col[k] || null) !== (want[k] || null)) {
        const m = (opt.why && opt.why(k, col[k], want[k])) || (want[k] ? `${NM[k]}을 ${pens.find(p => p.c === want[k]).n}으로 칠해야 해요.` : `${NM[k]}은 칠하지 않아요.`);
        return api.fail(m, say());
      }
      cy6Then(body, api, opt, say(), opt.msg);
    } }, "확인하기")));
}

/* ---------- 자와 삼각자로 높이 재기 ---------- */
function cy6Ruler(body, api, opt) {
  const kind = opt.kind, r = opt.r, hh = opt.h, W = 440, H = 340, pitch = 12, cbv = Math.cos(pitch * CY6_D);
  const TT = hh + 3.2, s = Math.min((H - 40) / (TT * cbv), (W - 60) / (2 * r + 3.6)), cx = W * .4, cy = H / 2 + 1.6 * s * cbv;
  const svg = makeSvg(W, H); svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = "28em";
  const rx = r + .7, top = hh + 1.8;
  let yq = hh + 1.5, ok = false;
  const draw = () => {
    svg.innerHTML = "";
    const I = cy6Draw(svg, { kind, r, h: hh, s, cx, cy, pitch, yaw: 0, fill: { side: "#E8F1FB", top: "#B8D3F2", bot: "#B8D3F2" } }), P = I.P;
    cy6Seg(svg, P([-r - 1, 0, 0]), P([rx + 1.6, 0, 0]), { stroke: "#B9A27A", "stroke-width": 3 });
    // 자
    svg.append(svgEl("polygon", { points: cy6Pts([P([rx, 0, 0]), P([rx + .8, 0, 0]), P([rx + .8, top, 0]), P([rx, top, 0])]), fill: "#FFF6D6", stroke: "#B8963A", "stroke-width": 1.5, "pointer-events": "none" }));
    for (let k = 0; k <= Math.floor(top * 2); k++) { const y = k / 2, big = k % 2 === 0; cy6Seg(svg, P([rx, y, 0]), P([rx + (big ? .35 : .2), y, 0]), { stroke: "#8A6D1F", "stroke-width": 1.2 });
      if (big && (hh <= 12 || k % 4 === 0)) cy6T(svg, P([rx + .58, y, 0])[0], P([rx + .58, y, 0])[1], String(k / 2), 11, { fill: "#6A5313", stroke: "none" }); }
    // 삼각자 (직각이 자 쪽에 있어요)
    const reach = kind === "cone" ? -.5 : -r * .4;
    const tri = svgEl("polygon", { points: cy6Pts([P([rx, yq, 0]), P([reach, yq, 0]), P([rx, yq + 1.4, 0])]), fill: ok ? "rgba(46,139,87,.28)" : "rgba(43,123,214,.22)", stroke: ok ? CY6.green : CY6.blue, "stroke-width": 2.2, class: "cy6hit" });
    tri.dataset.k = "sq"; svg.append(tri);
    cy6Seg(svg, P([reach, yq, 0]), P([rx, yq, 0]), { stroke: ok ? CY6.green : CY6.blue, "stroke-width": 3 });
    if (ok) { const a = P([0, 0, 0]), b = P([0, hh, 0]); cy6Seg(svg, a, b, { stroke: CY6.red, "stroke-width": 3, "stroke-dasharray": "7 5" }); cy6T(svg, a[0] - 26, (a[1] + b[1]) / 2, "높이", 15, { fill: CY6.red }); }
    read.textContent = ok ? `삼각자가 ${kind === "cone" ? "원뿔의 뾰족한 점" : "위쪽 밑면"}에 닿았어요. 자의 눈금을 읽어 봐요.` : `삼각자를 아래로 끌어 ${kind === "cone" ? "뾰족한 부분의 점" : "위쪽 평평한 면"}에 닿게 해요.`;
  };
  const read = h("div", { class: "cy6read" });
  dragOn(svg, p => true, p => { if (ok) return; const y = (cy - p.y) / (s * cbv) + hh / 2 - .7; yq = Math.max(hh, Math.min(hh + 1.5, Math.round(y * 10) / 10)); if (yq - hh < .12) { yq = hh; ok = true; draw(); cy6Then(body, api, opt, `높이 ${hh} cm`, "삼각자를 맞추었어요."); return; } draw(); });
  api.provide({ words: ["수직", "자", "삼각자"], answers: [] });
  body.append(h("div", { class: "cy6small" }, "파란 삼각자를 끌어서 내려 보세요. 자는 바닥(눈금 0)에 수직으로 세워져 있어요."), svg, read);
  draw();
}

/* ---------- 종이를 붙인 막대를 돌려 입체도형 만들기 ---------- */
function cy6Spin(body, api, opt) {
  const W = 440, H = 360, pb = 18 * CY6_D, cbv = Math.cos(pb), sbv = Math.sin(pb);
  let poly, hh, mu, keys, ghost;
  if (opt.shape === "rect") { const { w, h: hg } = opt; poly = [[0, 0], [w, 0], [w, hg], [0, hg]]; hh = hg; mu = w; keys = [[w, 0], [w, hg]]; ghost = { kind: "cyl", r: w, h: hg }; }
  else if (opt.shape === "tri") { const { b, h: hg } = opt; poly = [[0, 0], [b, 0], [0, hg]]; hh = hg; mu = b; keys = [[b, 0]]; ghost = { kind: "cone", r: b, h: hg }; }
  else { const R = opt.d / 2; poly = Array.from({ length: 41 }, (_, i) => { const t = Math.PI * i / 40; return [R * Math.sin(t), R - R * Math.cos(t)]; }); hh = opt.d; mu = R; keys = [[R, R], [R * Math.sin(Math.PI / 4), R - R * Math.cos(Math.PI / 4)], [R * Math.sin(Math.PI * .75), R - R * Math.cos(Math.PI * .75)]]; ghost = { kind: "sph", r: R }; }
  const s = Math.min((W - 90) / (2 * mu), (H - 70) / (hh + 2.6)), cx = W / 2, cy = H / 2 + 6;
  const P = ([x, y, z]) => [cx + s * x, cy - s * ((y - hh / 2) * cbv - z * sbv)];
  const svg = makeSvg(W, H); svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = "28em";
  const bins = new Set(); let phi = 0, fin = false, anim = null;
  const read = h("div", { class: "cy6read" });
  const draw = () => {
    svg.innerHTML = "";
    if (fin) cy6Draw(svg, Object.assign({}, ghost, { s, cx, cy, pitch: 18, yaw: 0, fill: { side: "rgba(255,210,122,.25)", top: "rgba(255,210,122,.35)", bot: "rgba(255,210,122,.35)" }, shadeSide: false, sw: 2 }));
    // 지나간 자취
    keys.forEach(([u, y]) => bins.forEach(bi => { const a0 = bi * 10 * CY6_D, a1 = (bi + 1) * 10 * CY6_D, front = Math.sin((a0 + a1) / 2) > 0;
      const pts = [0, 1, 2, 3, 4].map(k => { const a = a0 + (a1 - a0) * k / 4; return P([u * Math.cos(a), y, u * Math.sin(a)]); });
      svg.append(svgEl("polyline", { points: cy6Pts(pts), fill: "none", stroke: CY6.org, "stroke-width": front ? 3 : 2, opacity: front ? .95 : .45, "stroke-linecap": "round", "pointer-events": "none" })); }));
    const a = phi * CY6_D, ca = Math.cos(a), sa = Math.sin(a), sp = poly.map(([u, y]) => P([u * ca, y, u * sa]));
    const stick = () => { cy6Seg(svg, P([0, -1.3, 0]), P([0, hh + 1.3, 0]), { stroke: CY6.stick, "stroke-width": 7 }); };
    const shape = () => svg.append(svgEl("polygon", { points: cy6Pts(sp), fill: CY6.paper, "fill-opacity": .9, stroke: "#C98A2E", "stroke-width": 2.4, "stroke-linejoin": "round", "pointer-events": "none" }));
    if (sa > 0) { stick(); shape(); } else { shape(); stick(); }
    const md = ((phi % 360) + 360) % 360;
    if (md < 8 || md > 352) (opt.labels || []).forEach(L => { const q = P([L.at[0], L.at[1], 0]); cy6T(svg, q[0] + (L.dx || 0), q[1] + (L.dy || 0), L.t, 16, { fill: L.col || "#8A5A12" }); });
    if (fin && opt.qmarks) opt.qmarks.forEach(Q => { const p1 = P(Q.a), p2 = P(Q.b); cy6Seg(svg, p1, p2, { stroke: CY6.blue, "stroke-width": 2.5, "stroke-dasharray": "6 4" }); cy6T(svg, (p1[0] + p2[0]) / 2 + (Q.dx || 0), (p1[1] + p2[1]) / 2 + (Q.dy || 0), Q.t, 16, { fill: CY6.blue }); });
    read.textContent = fin ? "한 바퀴를 다 돌렸어요. 종이가 지나간 자리에 어떤 입체도형이 생겼을까요?" : `막대를 돌려 보세요. 돌린 정도: ${Math.round(bins.size / 36 * 100)}%`;
  };
  const step = d => { if (fin) return; phi += d; const b = Math.floor(((phi % 360) + 360) % 360 / 10); bins.add(b);
    if (bins.size >= 36) { fin = true; phi = 0; clearInterval(anim); draw(); cy6Then(body, api, opt, "한 바퀴 돌림", "한 바퀴를 돌렸어요."); return; } draw(); };
  let lx = null;
  dragOn(svg, p => { lx = p.x; return true; }, p => { const d = (p.x - lx) * 1.1; lx = p.x; if (Math.abs(d) > 0) step(Math.max(-9, Math.min(9, d))); });
  const btn = h("button", { class: "ghost", onclick: () => { if (fin || anim) return; let n = 0; anim = setInterval(() => { if (!svg.isConnected || fin || n++ > 80) { clearInterval(anim); anim = null; return; } step(5); }, 30); } }, "↻ 한 바퀴 돌리기");
  api.provide({ words: opt.words || [], answers: [] });
  body.append(h("div", { class: "cy6small" }, "그림을 옆으로 끌거나 ‘한 바퀴 돌리기’를 눌러 막대를 돌려요. 주황색 선은 종이의 끝이 지나간 자리예요."), svg, h("div", { class: "cy6btns" }, btn), read);
  for (let i = 0; i < 1; i++) bins.add(0);
  draw();
}

/* ---------- 원뿔에 모선 긋기 ---------- */
function cy6Gen(body, api, opt) {
  const r = opt.r || 2.4, hh = opt.h || 3.4, W = 380, H = 320, s = Math.min((W - 60) / (2 * r), (H - 50) / (hh + .8)), cx = W / 2, cy = H / 2;
  const svg = makeSvg(W, H); svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = "24em";
  const lines = []; let drag = null, fin = false, I = null;
  const read = h("div", { class: "cy6read" });
  const rimPt = t => [r * Math.cos(t), 0, r * Math.sin(t)];
  const draw = () => {
    svg.innerHTML = "";
    I = cy6Draw(svg, { kind: "cone", r, h: hh, s, cx, cy, pitch: 20, fill: { side: "#FDE9DC", bot: "#F6C7A8" } });
    const A = I.P([0, hh, 0]);
    lines.forEach((t, i) => { const q = I.P(rimPt(t)), vis = Math.sin(t) > -.05; cy6Seg(svg, A, q, { stroke: CY6.purple, "stroke-width": 2.6, "stroke-dasharray": vis ? null : "5 4", opacity: vis ? 1 : .6 }); });
    if (drag) cy6Seg(svg, A, drag, { stroke: CY6.purple, "stroke-width": 2, "stroke-dasharray": "3 4" });
    if (fin) { const b = I.P([0, 0, 0]); cy6Seg(svg, A, b, { stroke: CY6.red, "stroke-width": 2.6, "stroke-dasharray": "7 5" }); cy6T(svg, b[0] + 22, (A[1] + b[1]) / 2 + 20, "높이", 14, { fill: CY6.red }); }
    svg.append(svgEl("circle", { cx: cy6R(A[0]), cy: cy6R(A[1]), r: 8, fill: CY6.blue }));
    read.textContent = `그은 선분: ${lines.length}개` + (fin ? " · 빨간 점선은 원뿔의 높이예요." : " · 파란 점(원뿔의 꼭짓점)에서 밑면의 둘레까지 끌어 선분을 그어요.");
  };
  const nearRim = p => { let best = null, bd = 1e9; for (let i = 0; i < 120; i++) { const t = i * Math.PI * 2 / 120; if (Math.sin(t) < -.05) continue; const q = I.P(rimPt(t)), d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; best = t; } } return bd < 26 ? best : null; };
  dragOn(svg, p => { const A = I.P([0, hh, 0]); if (Math.hypot(p.x - A[0], p.y - A[1]) < 30) { drag = [p.x, p.y]; return true; } const t = nearRim(p); if (t != null) { add(t); } return false; },
    p => { drag = [p.x, p.y]; draw(); }, p => { const t = nearRim(p); drag = null; if (t != null) add(t); else { draw(); api.hint("밑면의 둘레(가장자리 선)까지 끌어야 선분이 그어져요."); } });
  function add(t) { if (lines.some(u => Math.abs(u - t) < .12)) { draw(); return api.hint("이미 그은 곳과 조금 떨어진 곳에 그어 봐요."); } lines.push(t); draw();
    if (lines.length >= (opt.need || 6) && !fin) { fin = true; draw(); cy6Then(body, api, opt, `선분 ${lines.length}개`, "선분을 여러 개 그었어요."); } }
  api.provide({ words: ["모선", "원뿔의 꼭짓점", "밑면의 둘레"], answers: [] });
  body.append(h("div", { class: "cy6small" }, `원뿔의 꼭짓점에서 밑면의 둘레의 한 점까지 선분을 ${opt.need || 6}개 그어 보세요. (둘레를 바로 눌러도 돼요.)`), svg, read);
  draw();
}

/* ---------- 구의 중심 찾기 · 반지름 긋기 ---------- */
function cy6Probe(body, api, opt) {
  const R = opt.R || 5, s = 24, W = 340, H = 320, cx = W / 2, cy = H / 2, RR = R * s;
  const svg = makeSvg(W, H); svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = "22em";
  let pt = [cx - 2.6 * s, cy + 1.6 * s], phase = 1; const rays = [];
  const read = h("div", { class: "cy6read" });
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("circle", { cx, cy, r: RR, fill: "#E3F1EA", stroke: CY6.ink, "stroke-width": 2.6 }));
    svg.append(svgEl("ellipse", { cx, cy, rx: RR, ry: RR * .28, fill: "none", stroke: CY6.hid, "stroke-width": 1.4, "stroke-dasharray": "5 5" }));
    svg.append(svgEl("ellipse", { cx: cx - RR * .35, cy: cy - RR * .4, rx: RR * .22, ry: RR * .13, fill: "#fff", opacity: .6 }));
    const d = Math.hypot(pt[0] - cx, pt[1] - cy) / s;
    if (phase === 1) {
      const ux = (pt[0] - cx) / (d * s || 1), uy = (pt[1] - cy) / (d * s || 1);
      const near = d < 1e-6 ? [cx + RR, cy] : [cx + ux * RR, cy + uy * RR], far = d < 1e-6 ? [cx - RR, cy] : [cx - ux * RR, cy - uy * RR];
      cy6Seg(svg, pt, near, { stroke: CY6.green, "stroke-width": 2.5 }); cy6Seg(svg, pt, far, { stroke: CY6.org, "stroke-width": 2.5 });
      read.textContent = `가장 가까운 겉면까지 ${cy6R(R - d)} cm, 가장 먼 겉면까지 ${cy6R(R + d)} cm. 두 거리가 같아지는 곳을 찾아 빨간 점을 끌어 보세요.`;
    } else {
      rays.forEach(t => { const q = [cx + RR * Math.cos(t), cy + RR * Math.sin(t)]; cy6Seg(svg, [cx, cy], q, { stroke: CY6.blue, "stroke-width": 2.6 }); cy6Dot(svg, q, 4, CY6.blue);
        cy6T(svg, cx + RR * .55 * Math.cos(t) + 12 * Math.sin(t), cy + RR * .55 * Math.sin(t) - 12 * Math.cos(t), `${R} cm`, 13, { fill: CY6.blue }); });
      read.textContent = phase === 2 ? `구의 겉면을 눌러 중심과 겉면의 한 점을 이어 보세요. (${rays.length}/4)` : "중심에서 겉면까지 이은 선분의 길이가 모두 같아요.";
    }
    svg.append(svgEl("circle", { cx: cy6R(pt[0]), cy: cy6R(pt[1]), r: phase === 1 ? 9 : 6, fill: CY6.red, class: "cy6hit" }));
  };
  dragOn(svg, p => {
    if (phase === 1) return Math.hypot(p.x - pt[0], p.y - pt[1]) < 34;
    if (phase === 2) { const t = Math.atan2(p.y - cy, p.x - cx); if (rays.some(u => Math.abs(Math.atan2(Math.sin(u - t), Math.cos(u - t))) < .3)) { api.hint("이미 그은 선분과 조금 떨어진 곳을 눌러요."); return false; }
      rays.push(t); if (rays.length >= 4) { phase = 3; draw(); cy6Then(body, api, opt, "중심 찾기·반지름 4개", "중심과 겉면을 이은 선분을 그었어요."); return false; } draw(); }
    return false;
  }, p => { const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy), m = RR - 12; pt = d > m ? [cx + dx / d * m, cy + dy / d * m] : [p.x, p.y]; draw(); },
  () => { if (phase !== 1) return; if (Math.hypot(pt[0] - cx, pt[1] - cy) < .35 * s) { pt = [cx, cy]; phase = 2; api.hint("○ 찾았어요! 가까운 겉면과 먼 겉면까지의 거리가 같은 점, 구의 가장 안쪽에 있는 점이에요."); } draw(); });
  api.provide({ words: ["구의 중심", "구의 반지름"], answers: [] });
  body.append(h("div", { class: "cy6small" }, "구를 반으로 자른 단면이에요. 빨간 점을 끌어 구의 가장 안쪽에 있는 점을 찾아보세요."), svg, read);
  draw();
}

/* ---------- 원기둥을 잘라 펼치기(움직이는 그림) ---------- */
function cy6Unroll(body, api, opt) {
  const r = opt.r || 1.4, hh = opt.h || 2.2, L = 2 * Math.PI * r, W = 460, H = 400, pb = 24 * CY6_D, cbv = Math.cos(pb), sbv = Math.sin(pb);
  const s = Math.min((W - 40) / L, (H - 30) / ((hh + 4 * r) * cbv + 2 * r * sbv)), cx = W / 2, cy = H / 2 + r * s * .2, mid = hh / 2;
  const PZ = ([x, y, z]) => [cx + s * x, cy - s * ((y - mid) * cbv - z * sbv), (y - mid) * sbv + z * cbv];
  const svg = makeSvg(W, H); svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = "30em";
  let t = 0, fin = false, anim = null;
  const cl = v => Math.max(0, Math.min(1, v));
  const draw = () => {
    svg.innerHTML = "";
    const al = cl(t / .4) * Math.PI / 2, kap = (1 - cl((t - .4) / .6)) / r, n = 48, prims = [], fc = [], qs = [];
    const strip = u => { if (kap < 1e-6) return [[u, 0], [0, 0, 1]]; const R = 1 / kap; return [[R * Math.sin(u * kap), R * Math.cos(u * kap) - R], [Math.sin(u * kap), 0, Math.cos(u * kap)]]; };
    for (let i = 0; i < n; i++) { const u0 = -L / 2 + L * i / n, u1 = -L / 2 + L * (i + 1) / n, [a] = strip(u0), [b] = strip(u1), [, nm] = strip((u0 + u1) / 2);
      const q = [[a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], hh, b[1]], [a[0], hh, a[1]]].map(PZ), dep = q.reduce((s2, p) => s2 + p[2], 0) / 4, face = nm[1] * sbv + nm[2] * cbv > 0;
      prims.push({ dep, draw: () => { svg.append(svgEl("polygon", { points: cy6Pts(q), fill: face ? "#FFE7B8" : "#E8C88E", stroke: face ? "#FFE7B8" : "#E8C88E", "stroke-width": .8 }));
        cy6Seg(svg, q[0], q[1], { "stroke-width": 2.2 }); cy6Seg(svg, q[2], q[3], { "stroke-width": 2.2 });
        if (i === 0) cy6Seg(svg, q[0], q[3], { stroke: CY6.red, "stroke-width": 2.4 }); if (i === n - 1) cy6Seg(svg, q[1], q[2], { stroke: CY6.red, "stroke-width": 2.4 }); } });
      fc.push(face); qs.push(q);
    }
    for (let i = 1; i < n; i++) if (fc[i] !== fc[i - 1]) { const q = qs[i]; prims.push({ dep: (q[0][2] + q[3][2]) / 2 + .002, draw: () => cy6Seg(svg, q[0], q[3], { "stroke-width": 2.2 }) }); }
    [[hh, 1], [0, -1]].forEach(([y0, sg]) => { const sa2 = Math.sin(al), ca2 = Math.cos(al), c = [0, y0 + sg * r * sa2, -r * ca2];
      const pts = Array.from({ length: 60 }, (_, k) => { const th = k * 2 * Math.PI / 60; return PZ([r * Math.cos(th), c[1] + sg * r * Math.sin(th) * sa2, c[2] - r * Math.sin(th) * ca2]); });
      const dep = PZ(c)[2] + (sg > 0 ? .001 : -.001);
      prims.push({ dep, draw: () => svg.append(svgEl("polygon", { points: cy6Pts(pts), fill: "#9CC3F0", stroke: CY6.ink, "stroke-width": 2.2 })) }); });
    prims.sort((x, y) => x.dep - y.dep).forEach(p => p.draw());
    read.textContent = t <= 0 ? "막대를 밀거나 ‘잘라서 펼치기’를 눌러 보세요." : t < .4 ? "밑면의 둘레를 따라 자르고 있어요." : t < 1 ? "옆면을 밑면에 수직으로 자른 선(빨간 선)을 따라 펼치고 있어요." : "다 펼쳤어요!";
  };
  const read = h("div", { class: "cy6read" });
  const rng = h("input", { type: "range", min: 0, max: 100, value: 0, "aria-label": "펼치기" });
  const set = v => { t = v; rng.value = Math.round(v * 100); draw(); if (t >= 1 && !fin) { fin = true; cy6Then(body, api, opt, "원기둥을 펼침", "원기둥을 잘라서 펼쳤어요."); } };
  rng.addEventListener("input", () => { if (fin) { rng.value = 100; return; } set(+rng.value / 100); });
  const btn = h("button", { class: "ghost", onclick: () => { if (fin || anim) return; anim = setInterval(() => { if (!svg.isConnected || fin) { clearInterval(anim); anim = null; return; } set(Math.min(1, t + .02)); }, 40); } }, "✂ 잘라서 펼치기");
  api.provide({ words: ["밑면의 둘레", "수직"], answers: [] });
  body.append(svg, h("div", { class: "cy6slider" }, h("span", { class: "cy6small" }, "원기둥"), rng, h("span", { class: "cy6small" }, "펼친 그림")), h("div", { class: "cy6btns" }, btn), read);
  draw();
}

/* ---------- 원기둥의 전개도 그림 ----------
   net = {w, h, c:[{x, side:"t"|"b", r}]}  (cm, x는 원의 중심이 직사각형 왼쪽에서 떨어진 거리) */
function cy6NetSvg(net, o = {}) {
  const s = o.s || 26, pad = o.pad == null ? 14 : o.pad, extraR = 0, extraPx = o.lab && o.lab.h ? 30 + o.lab.h.length * 15 : 0;
  const tR = Math.max(0, ...net.c.filter(c => c.side === "t").map(c => 2 * c.r)), bR = Math.max(0, ...net.c.filter(c => c.side === "b").map(c => 2 * c.r));
  const x0 = Math.min(0, ...net.c.map(c => c.x - c.r)), x1 = Math.max(net.w, ...net.c.map(c => c.x + c.r)) + extraR;
  const cw = Math.max(x1 - x0, o.box ? o.box[0] : 0), ch = Math.max(tR + net.h + bR, o.box ? o.box[1] : 0);
  const W = cw * s + 2 * pad + extraPx, H = ch * s + 2 * pad, ox = pad - x0 * s + (cw - (x1 - x0)) * s / 2, oy = pad + tR * s + (ch - (tR + net.h + bR)) * s / 2;
  const svg = makeSvg(W, H); svg.setAttribute("class", "cy6fig" + (o.plain ? " cy6plain" : "")); svg.style.maxWidth = o.maxW || "26em";
  const X = x => ox + x * s, Y = y => oy + y * s, el = {};
  const col = o.col || {};
  el.rect = svgEl("rect", { x: cy6R(X(0)), y: cy6R(Y(0)), width: cy6R(net.w * s), height: cy6R(net.h * s), fill: col.rect || "#FFE7B8", stroke: CY6.ink, "stroke-width": 2.2 });
  if (o.tap) { el.rect.classList.add("cy6hit"); el.rect.dataset.k = "rect"; } svg.append(el.rect);
  net.c.forEach((c, i) => { const yc = c.side === "t" ? -c.r : net.h + c.r;
    const e = svgEl("circle", { cx: cy6R(X(c.x)), cy: cy6R(Y(yc)), r: cy6R(c.r * s), fill: (col.c && col.c[i]) || "#9CC3F0", stroke: CY6.ink, "stroke-width": 2.2 });
    if (o.tap) { e.classList.add("cy6hit"); e.dataset.k = "c" + i; } svg.append(e); el["c" + i] = e; c._sx = X(c.x); c._sy = Y(yc); });
  const L = o.lab || {};
  if (L.w) { const yy = Y(net.h) - Math.min(.35, net.h * .18) * s; cy6Seg(svg, [X(.1), yy], [X(net.w - .1), yy], { stroke: CY6.blue, "stroke-width": 1.6 }); [[X(.1), 1], [X(net.w - .1), -1]].forEach(([x, d]) => svg.append(svgEl("path", { d: `M${cy6R(x + d * 8)} ${cy6R(yy - 5)}L${cy6R(x)} ${cy6R(yy)}L${cy6R(x + d * 8)} ${cy6R(yy + 5)}`, stroke: CY6.blue, fill: "none", "stroke-width": 1.6 })));
    cy6T(svg, X(net.w / 2), Math.max(Y(0) + 12, yy - 14), L.w, 15, { fill: CY6.blue }); }
  if (L.h) { const xx = X(net.w) + 12; cy6Seg(svg, [xx, Y(0)], [xx, Y(net.h)], { stroke: CY6.blue, "stroke-width": 1.6 }); cy6T(svg, xx + 10 + L.h.length * 7.5, Y(net.h / 2), L.h, 15, { fill: CY6.blue }); }
  if (L.r) L.r.forEach((t, i) => { if (!t) return; const c = net.c[i]; cy6Seg(svg, [c._sx, c._sy], [c._sx + c.r * s, c._sy], { stroke: CY6.red, "stroke-width": 1.8 }); cy6Dot(svg, [c._sx, c._sy], 3, CY6.red); cy6T(svg, c._sx + c.r * s / 2, c._sy - 11, t, 14, { fill: CY6.red }); });
  if (o.after) o.after(svg, { X, Y, s });
  return { svg, el };
}
/* 밑면에 ◯, 옆면에 △ 표시하기 */
function cy6NetMark(body, api, opt) {
  const net = opt.net, mk = {}, cyc = [null, "◯", "△"];
  const { svg, el } = cy6NetSvg(net, { s: opt.s || 26, tap: true, maxW: "24em" });
  const marks = svgEl("g", { "pointer-events": "none" }); svg.append(marks);
  const draw = () => { marks.innerHTML = ""; Object.entries(mk).forEach(([k, m]) => { if (!m) return; const e = el[k], bb = k === "rect" ? [+e.getAttribute("x") + +e.getAttribute("width") / 2, +e.getAttribute("y") + +e.getAttribute("height") / 2] : [+e.getAttribute("cx"), +e.getAttribute("cy")];
    marks.append(txt(bb[0], bb[1] + 2, m, 34, { fill: m === "◯" ? CY6.blue : CY6.org })); }); };
  svg.addEventListener("click", e => { const k = e.target.dataset && e.target.dataset.k; if (!k) return; mk[k] = cyc[(cyc.indexOf(mk[k] || null) + 1) % 3]; draw(); });
  api.provide({ words: ["밑면 ◯", "옆면 △"], answers: [] });
  body.append(h("div", { class: "cy6small" }, "누를 때마다 ◯ → △ → 지우기 차례로 바뀌어요."), svg, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const got = Object.entries(mk).filter(([, m]) => m).map(([k, m]) => (k === "rect" ? "직사각형" : "원") + m).join(", ") || "-";
    if (net.c.some((_, i) => mk["c" + i] !== "◯")) return api.fail(net.c.some((_, i) => mk["c" + i] === "△") ? "원 모양의 면은 밑면이에요. 밑면에는 ◯표를 해요." : "밑면을 모두 찾아 ◯표 해요. 밑면은 2개예요.", got);
    if (mk.rect !== "△") return api.fail("두 밑면과 만나는 옆면에 △표를 해요.", got);
    cy6Then(body, api, opt, got, opt.msg);
  } }, "확인하기")));
}
/* 접어 본 모습 */
function cy6FoldFig(N) {
  const rT = N.c.find(c => c.side === "t"), rB = N.c.find(c => c.side === "b");
  const res = N.res, r = N.c[0].r, hh = N.h;
  if (res === "ok") return cy6Fig({ kind: "cyl", r, h: hh, W: 150, H: 120, plain: true, maxW: "100%", pad: 10, fill: { side: "#FFE7B8", top: "#9CC3F0", bot: "#9CC3F0" } });
  if (res === "len") { const rt = N.w / (2 * Math.PI); return cy6Fig({ kind: "cyl", r: rt, h: hh, W: 150, H: 120, plain: true, maxW: "100%", pad: 10, box: [0, 10, 150, 110], fill: { side: "#FFE7B8", top: "#FFE7B8", bot: "#9CC3F0" },
    after: (svg, I) => cy6Disk(svg, I, r, hh + .02, "rgba(156,195,240,.85)") }); }
  if (res === "size") return cy6Fig({ kind: "cyl", r: rT.r, h: hh, W: 150, H: 120, pitch: -24, plain: true, maxW: "100%", pad: 10, fill: { side: "#FFE7B8", top: "#9CC3F0", bot: "#FFFFFF" },
    after: (svg, I) => cy6Disk(svg, I, rB.r, -.02, "#9CC3F0") });
  return cy6Fig({ kind: "cyl", r, h: hh, W: 150, H: 120, plain: true, maxW: "100%", pad: 10, box: [0, 12, 150, 108], fill: { side: "#FFE7B8", top: "#9CC3F0", bot: "#FFFFFF" },
    after: (svg, I) => cy6Disk(svg, I, r, hh + .35, "rgba(156,195,240,.9)") });
}
function cy6Disk(svg, I, rr, y, fill) { svg.append(svgEl("polygon", { points: cy6Pts(Array.from({ length: 60 }, (_, k) => I.P([rr * Math.cos(k * Math.PI / 30), y, rr * Math.sin(k * Math.PI / 30)]))), fill, stroke: CY6.ink, "stroke-width": 2, "pointer-events": "none" })); }
const CY6_FOLD = { ok: "원기둥이 돼요.", same: "두 밑면이 같은 쪽에서 겹치고 아래가 뚫려요.", size: "두 밑면의 크기가 달라 한쪽이 맞지 않아요.", len: "옆면의 가로가 밑면의 둘레보다 짧아 맞닿지 않아요." };
/* 전개도가 될 수 있는 것 찾기: 예상하기 → 하나씩 접어 보기 */
function cy6NetJudge(body, api, opt) {
  const guess = new Set(); let phase = 0; const seen = new Set();
  const cards = opt.nets.map((N, i) => { const res = h("div", { class: "cy6small" }, "​"), foldBox = h("div");
    const fb = h("button", { class: "ghost", style: "display:none;margin:.2em auto", onclick: e => { e.stopPropagation(); seen.add(i); foldBox.innerHTML = ""; foldBox.append(cy6FoldFig(N)); res.textContent = CY6_FOLD[N.res]; c.classList.add(N.res === "ok" ? "cy6-good" : "cy6-bad"); fb.style.display = "none"; if (seen.size === opt.nets.length) fin(); } }, "접어 보기");
    const c = h("div", { class: "cy6card" }, cy6NetSvg(N, { s: opt.s || 13, plain: true, maxW: "100%", pad: 6, box: opt.box || [6.6, 6.6] }).svg, h("div", {}, N.name), fb, foldBox, res);
    c.addEventListener("click", () => { if (phase) return; guess.has(i) ? guess.delete(i) : guess.add(i); c.classList.toggle("cy6-guess", guess.has(i)); });
    return { c, fb }; });
  const go = h("button", { class: "big", onclick: () => { if (!guess.size) return api.hint("먼저 전개도가 될 수 있다고 생각하는 것을 눌러 ‘예상’ 표시를 해요."); phase = 1; go.disabled = true; cards.forEach(x => x.fb.style.display = "block");
    api.hint("이제 하나씩 ‘접어 보기’를 눌러 예상이 맞았는지 확인해요."); } }, "예상 끝 · 접어서 확인하기");
  function fin() { const ok = opt.nets.map((N, i) => N.res === "ok" ? i : -1).filter(i => i >= 0), right = ok.length === guess.size && ok.every(i => guess.has(i));
    cy6Then(body, api, opt, "예상: " + [...guess].sort().map(i => opt.nets[i].name).join(","), right ? "예상이 모두 맞았어요!" : "모두 접어 보았어요. 예상과 다른 것이 있었네요."); }
  api.provide({ words: ["합동인 두 원", "마주 보는 위치", "밑면의 둘레 = 옆면의 가로"], answers: [] });
  body.append(h("div", { class: "cy6small" }, "① 전개도가 될 수 있을 것 같은 그림을 눌러 ‘예상’ 표시를 해요. ② ‘예상 끝’을 누른 뒤 하나씩 접어 보아요."), h("div", { class: "cy6cards", style: "grid-template-columns:repeat(auto-fill,minmax(9.5em,1fr))" }, ...cards.map(x => x.c)), h("div", { class: "actions" }, go));
}

/* ---------- 모눈에 원기둥의 전개도 그리기 ---------- */
function cy6NetDraw(body, api, opt) {
  const R = opt.r, HH = opt.h, WW = cy6M(2 * R, CY6_PI), cols = 18, rows = 14, s = 30, W = cols * s, H = rows * s;
  const svg = makeSvg(W, H, s); svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = "34em";
  const rc = { x: 1, y: 5, w: 6, h: 3 }, C = [{ x: 3.5, y: 2.2, r: 1.5, att: null }, { x: 13.5, y: 11.6, r: 1.2, att: null }];
  let sel = 0, drag = null, fin = false;
  const r1 = v => Math.round(v * 10) / 10;
  const attach = c => { if (c.att === "t") c.y = r1(rc.y - c.r); if (c.att === "b") c.y = r1(rc.y + rc.h + c.r); };
  const snap = c => { c.att = null; if (c.x >= rc.x - 1e-9 && c.x <= rc.x + rc.w + 1e-9) { if (Math.abs(c.y + c.r - rc.y) < .4) c.att = "t"; else if (Math.abs(c.y - c.r - rc.y - rc.h) < .4) c.att = "b"; } attach(c); };
  const read = h("div", { class: "cy6read" });
  const draw = () => {
    [...svg.querySelectorAll(".cy6d")].forEach(e => e.remove());
    const g = svgEl("g", { class: "cy6d" }); svg.append(g);
    g.append(svgEl("rect", { x: rc.x * s, y: rc.y * s, width: cy6R(rc.w * s), height: cy6R(rc.h * s), fill: "rgba(255,231,184,.85)", stroke: CY6.ink, "stroke-width": 2.4 }));
    C.forEach((c, i) => { const e = svgEl("circle", { cx: cy6R(c.x * s), cy: cy6R(c.y * s), r: cy6R(c.r * s), fill: i === sel ? "rgba(156,195,240,.85)" : "rgba(156,195,240,.6)", stroke: i === sel ? CY6.blue : CY6.ink, "stroke-width": i === sel ? 3 : 2.2, class: "cy6hit" }); e.dataset.k = "c" + i; g.append(e);
      cy6Dot(g, [c.x * s, c.y * s], 3); cy6T(g, c.x * s, c.y * s - 12, "①②"[i], 15, { fill: CY6.blue });
      const hd = svgEl("rect", { x: cy6R((c.x + c.r) * s - 8), y: cy6R(c.y * s - 8), width: 16, height: 16, rx: 3, fill: "#fff", stroke: CY6.blue, "stroke-width": 2, class: "cy6hit" }); hd.dataset.k = "r" + i; g.append(hd);
      g.append(svgEl("line", { x1: cy6R(c.x * s), y1: cy6R(c.y * s), x2: cy6R((c.x + c.r) * s - 8), y2: cy6R(c.y * s), stroke: CY6.blue, "stroke-width": 1.4, "stroke-dasharray": "4 3", "pointer-events": "none" })); });
    const hw = svgEl("rect", { x: cy6R((rc.x + rc.w) * s - 9), y: cy6R((rc.y + rc.h / 2) * s - 14), width: 18, height: 28, rx: 5, fill: CY6.org, class: "cy6hit" }); hw.dataset.k = "w"; g.append(hw);
    const hh2 = svgEl("rect", { x: cy6R((rc.x + rc.w / 2) * s - 14), y: cy6R((rc.y + rc.h) * s - 9), width: 28, height: 18, rx: 5, fill: CY6.org, class: "cy6hit" }); hh2.dataset.k = "h"; g.append(hh2);
    if (fin) { cy6T(g, (rc.x + rc.w / 2) * s, (rc.y + rc.h / 2) * s, `가로 ${WW} cm, 세로 ${HH} cm`, 16, { fill: CY6.blue });
      C.forEach(c => cy6T(g, (c.x + c.r / 2) * s, c.y * s + 14, `${R} cm`, 14, { fill: CY6.red })); }
    const at = c => c.att === "t" ? "위쪽에 붙음" : c.att === "b" ? "아래쪽에 붙음" : "떨어져 있음";
    read.innerHTML = ""; read.append(`옆면(직사각형): 가로 ${r1(rc.w)} cm, 세로 ${r1(rc.h)} cm`, h("br"), `밑면 ①: 반지름 ${r1(C[0].r)} cm (${at(C[0])}) · 밑면 ②: 반지름 ${r1(C[1].r)} cm (${at(C[1])})`);
  };
  dragOn(svg, p => { if (fin) return false; drag = null;
    const hitK = (() => { const x = p.x / s, y = p.y / s;
      if (Math.abs(x - rc.x - rc.w) < .45 && Math.abs(y - rc.y - rc.h / 2) < .6) return "w";
      if (Math.abs(y - rc.y - rc.h) < .45 && Math.abs(x - rc.x - rc.w / 2) < .6) return "h";
      for (let i = 0; i < 2; i++) if (Math.abs(x - C[i].x - C[i].r) < .4 && Math.abs(y - C[i].y) < .4) return "r" + i;
      for (let i = 0; i < 2; i++) if (Math.hypot(x - C[i].x, y - C[i].y) < C[i].r) return "c" + i; return null; })();
    if (!hitK) return false; drag = { k: hitK, dx: 0, dy: 0 }; if (hitK[0] === "c" || hitK[0] === "r") sel = +hitK[1];
    if (hitK[0] === "c") { drag.dx = C[sel].x - p.x / s; drag.dy = C[sel].y - p.y / s; } draw(); return true; },
  p => { if (!drag) return; const x = p.x / s, y = p.y / s, k = drag.k;
    if (k === "w") rc.w = r1(Math.max(1, Math.min(cols - rc.x - .2, x - rc.x)));
    else if (k === "h") rc.h = r1(Math.max(.5, Math.min(rows - rc.y - .3, y - rc.y)));
    else if (k[0] === "r") { const c = C[+k[1]]; c.r = r1(Math.max(.5, Math.min(4, x - c.x))); attach(c); }
    else { const c = C[+k[1]]; c.x = r1(Math.max(c.r * 0 + .3, Math.min(cols - .3, x + drag.dx))); c.y = r1(Math.max(.3, Math.min(rows - .3, y + drag.dy))); snap(c); }
    C.forEach(attach); draw(); }, () => { drag = null; });
  const nb = (t, f) => h("button", { onclick: () => { if (fin) return; f(); C.forEach(attach); draw(); } }, t);
  const tools = h("div", { class: "cy6btns" }, h("span", { class: "cy6small" }, "옆면 가로"), nb("−0.1", () => rc.w = r1(Math.max(1, rc.w - .1))), nb("+0.1", () => rc.w = r1(Math.min(cols - rc.x - .2, rc.w + .1))),
    h("span", { class: "cy6small" }, "세로"), nb("−0.1", () => rc.h = r1(Math.max(.5, rc.h - .1))), nb("+0.1", () => rc.h = r1(Math.min(rows - rc.y - .3, rc.h + .1))),
    h("span", { class: "cy6small" }, "고른 원의 반지름"), nb("−0.1", () => C[sel].r = r1(Math.max(.5, C[sel].r - .1))), nb("+0.1", () => C[sel].r = r1(Math.min(4, C[sel].r + .1))));
  api.provide({ words: ["밑면: 합동인 원 2개", "옆면: 직사각형 1개", `옆면의 가로 = ${2 * R}×3.14`, "옆면의 세로 = 높이"], answers: [] });
  body.append(h("div", { class: "cy6small" }, "모눈 한 칸은 1 cm예요. 주황 손잡이를 끌어 옆면의 가로·세로를 바꾸고, 원을 끌어 옆면에 붙이고, 원의 파란 네모를 끌어 반지름을 바꿔요. 작은 단추로 0.1 cm씩 고칠 수도 있어요."), svg, tools, read,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const got = `가로 ${r1(rc.w)}, 세로 ${r1(rc.h)}, 반지름 ${r1(C[0].r)}·${r1(C[1].r)}, ${C.map(c => c.att || "-").join("·")}`;
      if (r1(C[0].r) !== r1(C[1].r)) return api.fail("두 밑면은 합동인 원이어야 해요. 두 원의 반지름을 같게 해요.", got);
      if (r1(C[0].r) !== R) return api.fail(`밑면의 반지름은 ${R} cm예요. 원의 반지름을 다시 맞춰요.`, got);
      if (r1(rc.h) !== HH) return api.fail(`옆면의 세로는 원기둥의 높이(${HH} cm)와 같아요.`, got);
      const w10 = Math.round(rc.w * 10);
      if (w10 !== Math.round(WW * 10)) { const why = w10 === Math.round(cy6M(R, CY6_PI) * 10) ? "반지름에 원주율을 곱했어요. 밑면의 둘레는 (지름)×(원주율)이에요." : w10 === Math.round(2 * R * 10) ? "지름을 그대로 가로로 했어요. 옆면의 가로는 밑면의 둘레와 같아요." : `옆면의 가로는 밑면의 둘레와 같아요. (밑면의 지름)×(원주율)을 계산해 봐요.`; return api.fail(why, got); }
      const sides = C.map(c => c.att);
      if (sides.includes(null)) return api.fail("두 원을 옆면의 변에 꼭 맞게 붙여요. 원을 직사각형의 긴 변 가까이 끌면 저절로 붙어요.", got);
      if (sides[0] === sides[1]) return api.fail("두 밑면이 옆면의 같은 쪽에 있으면 접었을 때 겹쳐요. 한 원은 위쪽, 다른 원은 아래쪽에 붙여요.", got);
      fin = true; draw(); cy6Then(body, api, opt, got, "원기둥의 전개도를 그렸어요.");
    } }, "확인하기")));
  draw();
}

/* ---------- 여러 방향에서 보기 ---------- */
const CY6_DIRS = [["앞", 0, 0], ["뒤", 180, 0], ["왼쪽", 90, 0], ["오른쪽", -90, 0], ["위", 0, 90], ["아래", 0, -90]];
function cy6View(body, api, opt) {
  const seen = new Set(); let tw = null;
  const say = h("div", { class: "cy6read" }, "방향 단추를 눌러 살펴보세요.");
  const T = cy6Turnable({ W: 340, H: 300, fill: .36, solid: Object.assign({ gen: opt.solid.kind === "sph" ? 0 : 12 }, opt.solid, { genCol: "#B7C6D6" }), yaw: -25, pitch: 25,
    after: (svg, I) => { if (opt.solid.kind === "sph") { [0, 60, 120].forEach(a => { const c = Math.cos(a * CY6_D), s2 = Math.sin(a * CY6_D);
      cy6Curve(svg, I, t => [opt.solid.r * Math.cos(t) * c, opt.solid.r * Math.sin(t), opt.solid.r * Math.cos(t) * s2], t => [Math.cos(t) * c, Math.sin(t), Math.cos(t) * s2], { stroke: "#B7C6D6", width: 1.3 }); }); } },
    onTurn: () => { say.textContent = "돌려 보는 중이에요. 방향 단추를 누르면 그 방향에서 똑바로 본 모양이 보여요."; } });
  const bar = h("div", { class: "cy6btns" }, h("span", { class: "cy6small" }, "어느 쪽에서 볼까요?"));
  CY6_DIRS.forEach(([n, y, p]) => { const b = h("button", { onclick: () => {
    if (tw) clearInterval(tw); const y0 = T.st.yaw, p0 = T.st.pitch; let y1 = y; while (y1 - y0 > 180) y1 -= 360; while (y0 - y1 > 180) y1 += 360; let k = 0;
    tw = setInterval(() => { if (!T.svg.isConnected) { clearInterval(tw); return; } k++; const u = Math.min(1, k / 10), e = u * u * (3 - 2 * u); T.st.yaw = y0 + (y1 - y0) * e; T.st.pitch = p0 + (p - p0) * e; T.draw();
      if (u >= 1) { clearInterval(tw); tw = null; seen.add(n); b.classList.add("cy6-seen"); say.textContent = `${n}에서 본 모양이에요. (살펴본 방향 ${seen.size}/6)`; if (seen.size === 6) cy6Then(body, api, opt, "여섯 방향", "여섯 방향에서 모두 살펴보았어요."); } }, 28); } }, n); bar.append(b); });
  api.provide({ words: ["원", "직사각형", "삼각형"], answers: [] });
  body.append(bar, T.svg, T.tools, say);
}

/* ---------- 공학 도구처럼 입체도형 만들기 ---------- */
function cy6Make(body, api, opt) {
  const W = 480, H = 300, svg = makeSvg(W, H); svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = "30em";
  const TOOLS = [["cyl", "원기둥"], ["cone", "원뿔"], ["sph", "구"]], SH = { cyl: { kind: "cyl", r: 1, h: 1.8 }, cone: { kind: "cone", r: 1, h: 2 }, sph: { kind: "sph", r: 1 } };
  const COL = { cyl: { side: "#DCEAFB", top: "#9CC3F0", bot: "#9CC3F0" }, cone: { side: "#FDE3D3", bot: "#F6B38E" }, sph: { side: "#DDEDE5" } };
  let tool = null; const made = []; let fin = false;
  const read = h("div", { class: "cy6read" });
  const draw = () => { svg.innerHTML = "";
    const g = svgEl("g", { stroke: "#DCE4EC", "stroke-width": 1 }); for (let i = 0; i <= 12; i++) { g.append(svgEl("line", { x1: 40 + i * 33, y1: 70, x2: i * 33 + 0, y2: H - 20 })); } for (let j = 0; j <= 6; j++) { const y = 70 + j * (H - 90) / 6, sh = 40 * (1 - j / 6); g.append(svgEl("line", { x1: sh, y1: y, x2: sh + 396, y2: y })); } svg.append(g);
    made.slice().sort((a, b) => a.y - b.y).forEach(m => cy6Draw(svg, Object.assign({}, SH[m.k], { s: 26, cx: m.x, cy: m.y - (m.k === "sph" ? 26 : 26 * (SH[m.k].h / 2)), pitch: 22, yaw: -20, fill: COL[m.k] })));
    read.textContent = tool ? `[${TOOLS.find(t => t[0] === tool)[1]}] 도구를 골랐어요. 바닥의 만들고 싶은 위치를 눌러요.` : "위의 도구 중 하나를 눌러요.";
  };
  const bar = h("div", { class: "cy6btns" }, h("span", { class: "cy6small" }, "입체 도구:"), ...TOOLS.map(([k, n]) => h("button", { onclick: e => { tool = k; [...bar.querySelectorAll("button")].forEach(b => b.classList.remove("cy6-pick")); e.currentTarget.classList.add("cy6-pick"); draw(); } }, n)),
    h("button", { onclick: () => { made.length = 0; draw(); } }, "모두 지우기"));
  svg.addEventListener("click", e => { const p = svgPt(svg, e); if (!tool) return api.hint("먼저 [원기둥], [원뿔], [구] 중 하나를 눌러요."); if (p.y < 76 || p.y > H - 10) return api.hint("바닥(모눈) 위를 눌러요.");
    if (made.length >= 8) made.shift(); made.push({ k: tool, x: Math.max(40, Math.min(W - 40, p.x)), y: p.y }); draw();
    const kinds = new Set(made.map(m => m.k)); if (kinds.size === 3 && !fin) { fin = true; cy6Then(body, api, opt, "원기둥·원뿔·구를 만듦", "원기둥, 원뿔, 구를 모두 만들었어요."); } });
  api.provide({ words: ["원기둥", "원뿔", "구"], answers: [] });
  body.append(h("div", { class: "cy6small" }, "공학 도구(알지오매스 키즈)에서처럼 ➊ 입체 도구에서 [원기둥]을 누르고 ➋ 만들고 싶은 위치를 눌러 만들어요. 원뿔과 구도 만들어 보세요."), bar, svg, read);
  draw();
}

/* ---------- 알아맞히기 문제 만들기 ---------- */
const CY6_PROPS = [
  { c: "밑면이 2개인", l: "밑면이 2개예요", v: ["cyl"] }, { c: "두 밑면이 평행하고 합동인 원인", l: "두 밑면이 평행하고 합동인 원이에요", v: ["cyl"] },
  { c: "평평한 면이 원이고 1개인", l: "평평한 면이 원이고 1개예요", v: ["cone"] }, { c: "평평한 면이 없는", l: "평평한 면이 없어요", v: ["sph"] },
  { c: "굽은 면으로만 이루어진", l: "굽은 면으로만 이루어져 있어요", v: ["sph"] }, { c: "굽은 면이 있는", l: "굽은 면이 있어요", v: ["cyl", "cone", "sph"] },
  { c: "꼭짓점이 1개인", l: "꼭짓점이 1개예요", v: ["cone"] }, { c: "꼭짓점이 없는", l: "꼭짓점이 없어요", v: ["cyl", "sph"] },
  { c: "모선이 있는", l: "모선이 있어요", v: ["cone"] }, { c: "밑면이 원인", l: "밑면이 원이에요", v: ["cyl", "cone"] },
  { c: "앞에서 본 모양이 직사각형인", l: "앞에서 본 모양이 직사각형이에요", v: ["cyl"] }, { c: "앞에서 본 모양이 삼각형인", l: "앞에서 본 모양이 삼각형이에요", v: ["cone"] },
  { c: "어느 방향에서 보아도 원인", l: "어느 방향에서 보아도 원이에요", v: ["sph"] }];
const CY6_KN = { cyl: "원기둥", cone: "원뿔", sph: "구" };
function cy6Riddle(body, api, opt) {
  const objs = opt.objs; let ans = null; const sel = new Set(); let fin = false;
  const oc = objs.map((o, i) => { const c = h("div", { class: "cy6card" }, cy6ObjFig(o), h("div", {}, CY6_OBJS[o].n)); c.addEventListener("click", () => { ans = i; oc.forEach((x, j) => x.classList.toggle("cy6-pick", j === i)); show(); }); return c; });
  const chips = CY6_PROPS.map((p, i) => { const c = h("span", { class: "cy6chip", role: "button", tabindex: 0 }, p.l); c.addEventListener("click", () => { sel.has(i) ? sel.delete(i) : sel.size < 3 && sel.add(i); c.classList.toggle("cy6-pick", sel.has(i)); show(); }); return c; });
  const prev = h("div", { class: "cy6box" });
  const qtext = () => { const L = [...sel].sort((a, b) => a - b).map(i => CY6_PROPS[i].c); return L.length ? L.join(", ") + " 입체도형 모양의 물건은 무엇일까요?" : "…"; };
  const show = () => { prev.innerHTML = ""; prev.append(h("b", {}, "내가 만든 문제: "), qtext(), h("br"), h("span", { class: "cy6small" }, "답: " + (ans == null ? "(아직 안 골랐어요)" : CY6_OBJS[objs[ans]].n))); };
  api.provide({ words: ["밑면이 2개", "평평한 면이 원이고 1개", "평평한 면이 없는"], answers: [] });
  body.append(h("div", { class: "jua" }, "① 답이 될 물건을 하나 골라요."), h("div", { class: "cy6cards" }, ...oc), h("div", { class: "jua" }, "② 그 물건의 모양을 설명하는 말을 1~3개 골라요."), h("div", {}, ...chips), prev,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (fin) return; api.tryOnce(); const q = qtext();
      if (ans == null) return api.fail("답이 될 물건을 먼저 골라요.", q);
      if (!sel.size) return api.fail("설명하는 말을 하나 이상 골라요.", q);
      const k = CY6_OBJS[objs[ans]].k, bad = [...sel].find(i => !CY6_PROPS[i].v.includes(k));
      if (bad != null) return api.fail(`‘${CY6_PROPS[bad].l}’는 ${CY6_KN[k]} 모양인 ${CY6_OBJS[objs[ans]].n}에 맞지 않는 설명이에요.`, q);
      const fit = objs.filter(o => [...sel].every(i => CY6_PROPS[i].v.includes(CY6_OBJS[o].k)));
      if (fit.length > 1) return api.fail(`${fit.map(o => CY6_OBJS[o].n).join(", ")} 모두 답이 될 수 있어요. 답이 하나가 되도록 설명을 하나 더 골라요.`, q);
      fin = true; const nm = CY6_OBJS[objs[ans]].n;
      prev.append(h("div", { class: "cy6say" }, `친구: “설명하는 입체도형은 ${CY6_KN[k]} 모양이니까 ${nm}${/[가-힣]$/.test(nm) && (nm.charCodeAt(nm.length - 1) - 0xAC00) % 28 ? "이야" : "야"}.”`));
      cy6Then(body, api, opt, q + " → " + nm, "문제를 잘 만들었어요. 친구가 맞혔어요.");
    } }, "친구에게 내기")));
  show();
}

/* ---------- 놀이 카드(이 앱이 만든 카드) ---------- */
const CY6_ALL = ["cyl", "cone", "sph"];
const CY6_CARDS = [
  { o: "can" }, { o: "hat" }, { o: "basket" }, { o: "rcone" }, { o: "pingpong" }, { o: "tube" }, { o: "candy" }, { o: "popper" }, { o: "roller" },
  { t: "밑면이 2개예요.", rel: ["cyl"] }, { t: "꼭짓점이 1개 있어요.", rel: ["cone"] }, { t: "평평한 면이 없어요.", rel: ["sph"] }, { t: "모선이 있어요.", rel: ["cone"] },
  { t: "가장 안쪽에 있는 점에서 겉면까지의 거리가 모두 같아요.", rel: ["sph"] }, { t: "옆면을 펼치면 직사각형이에요.", rel: ["cyl"] }, { t: "앞에서 본 모양이 삼각형이에요.", rel: ["cone"] },
  { t: "어느 방향에서 보아도 원이에요.", rel: ["sph"] }, { t: "밑면이 원이에요.", rel: ["cyl", "cone"] }, { t: "굽은 면이 있어요.", rel: CY6_ALL }, { t: "꼭짓점이 없어요.", rel: ["cyl", "sph"] },
  { t: "앞에서 본 모양이 직사각형이에요.", rel: ["cyl"] }, { s: "cyl" }, { s: "cone" }, { s: "sph" }];
CY6_CARDS.forEach((c, i) => { c.id = i; c.rel = c.rel || (c.o ? [CY6_OBJS[c.o].k] : [c.s]); c.name = c.t || (c.o ? CY6_OBJS[c.o].n : CY6_KN[c.s] + " 그림"); });
function cy6CardFace(c, big) {
  const kids = c.t ? [h("div", { class: "cy6gt" }, c.t)] : c.o ? [cy6ObjFig(c.o, { W: 150, H: 120 }), h("div", { style: "font-size:.85em" }, CY6_OBJS[c.o].n)] : [cy6Shp(c.s === "cyl" ? "cyl" : c.s === "cone" ? "cone" : "sph")()];
  return h("div", { class: "cy6gc" + (big ? " cy6big" : "") }, ...kids, h("div", { class: "cy6mk" }, "이 앱이 만든 카드"));
}
/* 카드가 어느 입체도형과 관계있는지 살펴보기 */
function cy6CardCheck(body, api, opt) {
  const pick = opt.ids.map(id => CY6_CARDS[id]), st = pick.map(() => new Set());
  const boxes = pick.map((c, i) => { const chips = CY6_ALL.map(k => { const ch = h("span", { class: "cy6chip", role: "button" }, CY6_KN[k]); ch.addEventListener("click", () => { st[i].has(k) ? st[i].delete(k) : st[i].add(k); ch.classList.toggle("cy6-pick", st[i].has(k)); ch.classList.remove("cy6-good", "cy6-bad"); }); return ch; });
    return { el: h("div", {}, cy6CardFace(c), h("div", {}, ...chips)), chips }; });
  api.provide({ words: ["원기둥", "원뿔", "구"], answers: pick.map(c => `${c.name}: ${c.rel.map(k => CY6_KN[k]).join(", ")}`) });
  body.append(h("div", { class: "cy6small" }, "카드마다 관계가 있는 입체도형을 모두 눌러요. 두 가지 이상과 관계있는 카드도 있어요."), h("div", { class: "cy6ccheck" }, ...boxes.map(b => b.el)),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); let bad = -1;
      pick.forEach((c, i) => { const ok = c.rel.length === st[i].size && c.rel.every(k => st[i].has(k)); boxes[i].chips.forEach((ch, j) => { ch.classList.remove("cy6-good", "cy6-bad"); if (st[i].has(CY6_ALL[j])) ch.classList.add(ok ? "cy6-good" : "cy6-bad"); }); if (!ok && bad < 0) bad = i; });
      const got = pick.map((c, i) => c.name + ":" + [...st[i]].map(k => CY6_KN[k]).join("·")).join(" / ");
      if (bad >= 0) { const c = pick[bad]; return api.fail(`‘${c.name}’ 카드를 다시 살펴봐요.` + (c.rel.length > 1 ? " 이 카드는 여러 입체도형과 관계가 있어요." : ""), got); }
      cy6Then(body, api, opt, got, opt.msg || "카드 내용을 모두 알아보았어요.");
    } }, "확인하기")));
}
/* 이름을 외치고 확인하는 놀이: 나 + 컴퓨터 친구 3명 */
function cy6Win(win) { return win.length > 1 ? cy6Jo(win.join(", "), "이/가") + " 함께" : win[0] === "나" ? "내가" : cy6Jo(win[0], "이/가"); }
function cy6Shout(body, api, opt) {
  const NM = ["나", "친구 1", "친구 2", "친구 3"];
  let order = [], deck, piles, got, p, k, phase = "order", cur = null, right = 0, total = 0, solved = false, timer = null;
  const wrap = h("div"); body.append(wrap);
  api.provide({ words: ["정한 순서", "관계가 있으면 가져갈게!", "관계가 없으면 네 차례야."], answers: [] });
  const orderUI = () => { wrap.innerHTML = ""; const show = h("div", { class: "cy6read" }, "외치는 순서: " + (order.map(x => CY6_KN[x]).join(" → ") || "(눌러서 정해요)"));
    const bt = h("div", { class: "cy6btns" }, ...CY6_ALL.map(x => h("button", { onclick: () => { if (order.includes(x)) return; order.push(x); orderUI(); } }, CY6_KN[x])), h("button", { onclick: () => { order = []; orderUI(); } }, "다시 정하기"));
    wrap.append(h("div", { class: "jua" }, "① 원기둥, 원뿔, 구를 외치는 순서를 정해요. (예: “원뿔, 원기둥, 구의 순서로 외치자.”)"), bt, show,
      h("div", { class: "cy6btns" }, h("button", { class: "ghost", disabled: order.length < 3, onclick: start }, "놀이 시작"))); };
  function start() { deck = cy6Shuffle(CY6_CARDS.map(c => c.id)); piles = [0, 0, 0, 0]; got = [0, 0, 0, 0]; p = 0; k = 0; right = 0; total = 0; cur = null; phase = "flip"; render("가위바위보로 정한 순서대로 해요. 내 차례예요. 카드를 한 장 뒤집어요."); }
  const expect = () => order[k % 3];
  function render(msg) {
    wrap.innerHTML = "";
    const table = h("div", { class: "cy6table" }, ...NM.map((n, i) => h("div", { class: "cy6pl" + (i === p && phase !== "over" ? " cy6-turn" : "") }, h("div", {}, n), h("div", { class: "cy6pile" }, `🂠 ${piles[i]}`), h("div", {}, `앞에 놓인 카드 ${piles[i]}장`), h("div", {}, `가져온 카드 ${got[i]}장`))));
    const center = h("div", { style: "text-align:center" }, cur != null ? cy6CardFace(CY6_CARDS[cur], true) : h("div", { class: "cy6gc cy6big cy6-back" }, "​"), h("div", { class: "cy6small" }, `쌓아 둔 카드 ${deck.length}장`));
    const say = h("div", { class: "cy6read" }, msg || "");
    const acts = h("div", { class: "cy6btns" });
    if (phase === "flip") acts.append(h("button", { class: "ghost", onclick: myFlip }, "카드 한 장 뒤집기"));
    if (phase === "shout") { acts.append(h("span", { class: "cy6small" }, "정한 순서에 따라 외쳐요:")); CY6_ALL.forEach(x => acts.append(h("button", { onclick: () => myShout(x) }, CY6_KN[x] + "!"))); }
    if (phase === "judge") { acts.append(h("button", { onclick: () => myJudge(true) }, "가져갈게!"), h("button", { onclick: () => myJudge(false) }, "네 차례야.")); }
    if (phase === "over") acts.append(h("button", { class: "ghost", onclick: () => { order = []; orderUI(); } }, "한 판 더"));
    wrap.append(h("div", { class: "cy6small" }, "외치는 순서: " + order.map(x => CY6_KN[x]).join(" → ") + ` · 내가 바르게 판단한 횟수 ${right}/${total}`), table, center, say, acts);
  }
  function myFlip() { cur = deck.pop(); piles[0]++; phase = "shout"; render("카드를 뒤집었어요. 정한 순서에 맞는 입체도형을 외쳐요."); }
  function myShout(x) { total++; const e = expect(); k++;
    if (x !== e) { api.tryOnce(); phase = "wait"; render(`“${CY6_KN[x]}!” — 정한 순서에 맞지 않아요. 지금은 ${cy6Jo(CY6_KN[e], "을/를")} 외칠 차례였어요. “네 차례야.”`); return nextTurn(); }
    cur_e = e; phase = "judge"; render(`“${CY6_KN[x]}!” 이 카드는 ${cy6Jo(CY6_KN[e], "과/와")} 관계가 있을까요?`); }
  let cur_e = null;
  function myJudge(take) { const c = CY6_CARDS[cur], rel = c.rel.includes(cur_e); api.tryOnce(); phase = "wait";
    let m;
    if (take && rel) { right++; const n = piles.reduce((a, b) => a + b, 0); got[0] += n; piles = [0, 0, 0, 0]; m = `“가져갈게!” 맞아요. ‘${c.name}’ 카드는 ${cy6Jo(CY6_KN[cur_e], "과/와")} 관계가 있어요. 앞에 놓인 카드 ${n}장을 모두 가져왔어요.`; }
    else if (take) m = `‘${c.name}’ 카드는 ${cy6Jo(CY6_KN[cur_e], "과/와")} 관계가 없어서 가져갈 수 없어요. 차례가 넘어가요.`;
    else if (rel) m = `아까워요! ‘${c.name}’ 카드는 ${cy6Jo(CY6_KN[cur_e], "과/와")} 관계가 있어서 가져갈 수 있었어요.`;
    else { right++; m = `맞아요. ‘${c.name}’ 카드는 ${cy6Jo(CY6_KN[cur_e], "과/와")} 관계가 없어요. “네 차례야.”`; }
    render(m); nextTurn(); }
  function nextTurn() { clearTimeout(timer); timer = setTimeout(() => { if (!wrap.isConnected) return; if (!deck.length) return over(); p = (p + 1) % 4; if (p === 0) { phase = "flip"; cur = null; render("내 차례예요. 카드를 한 장 뒤집어요."); } else aiTurn(); }, 1500); }
  function aiTurn() { cur = deck.pop(); piles[p]++; const e = expect(); k++;
    const sayIt = Math.random() < .9 ? e : CY6_ALL.filter(x => x !== e)[Math.floor(Math.random() * 2)], c = CY6_CARDS[cur]; let m;
    if (sayIt !== e) m = `${NM[p]}: “${CY6_KN[sayIt]}!” — 정한 순서(지금은 ${CY6_KN[e]})에 맞지 않아서 차례가 넘어가요.`;
    else if (c.rel.includes(e) && Math.random() < .85) { const n = piles.reduce((a, b) => a + b, 0); got[p] += n; piles = [0, 0, 0, 0]; m = `${NM[p]}: “${CY6_KN[e]}!” “가져갈게!” ‘${c.name}’ 카드는 ${cy6Jo(CY6_KN[e], "과/와")} 관계가 있어서 카드 ${n}장을 가져갔어요.`; }
    else if (c.rel.includes(e)) m = `${NM[p]}: “${CY6_KN[e]}!” … 관계가 있는데 ${cy6Jo(NM[p], "이/가")} 놓쳤어요. “네 차례야.”`;
    else m = `${NM[p]}: “${CY6_KN[e]}!” ‘${c.name}’ 카드는 ${cy6Jo(CY6_KN[e], "과/와")} 관계가 없어요. “네 차례야.”`;
    phase = "wait"; render(m); nextTurn(); }
  function over() { phase = "over"; const mx = Math.max(...got), win = NM.filter((_, i) => got[i] === mx);
    render(`쌓아 둔 카드가 모두 없어졌어요. 가져온 카드: ${NM.map((n, i) => `${n} ${got[i]}장`).join(", ")}. ${cy6Win(win)} 이겼어요!`);
    if (!solved) { solved = true; api.done(`바르게 판단 ${right}/${total}, 가져온 카드 ${got[0]}장`, `놀이를 끝까지 했어요. 내가 바르게 판단한 횟수는 ${right}/${total}이에요. ‘한 판 더’로 또 해도 좋아요.`); } }
  orderUI();
}
/* 또 다른 놀이: 나온 입체도형 모양의 물건을 차례로 말하기 */
const CY6_BANK = { cyl: ["can", "bottle", "tube", "roller", "baton", "pencase"], cone: ["hat", "rcone", "minicone", "popper", "icecream", "roof"], sph: ["basket", "pingpong", "volley", "candy", "globe", "marble"] };
function cy6NameGame(body, api, opt) {
  const NM = ["나", "친구 1", "친구 2"], all = cy6Shuffle([...CY6_BANK.cyl, ...CY6_BANK.cone, ...CY6_BANK.sph]);
  let deck, held, card, used, p, starter, phase, solved = false, timer = null;
  const wrap = h("div"); body.append(wrap);
  api.provide({ words: ["원기둥 모양", "원뿔 모양", "구 모양"], answers: [] });
  function start() { deck = cy6Shuffle(["cyl", "cyl", "cone", "cone", "sph", "sph"]); held = [0, 0, 0]; starter = 0; newCard("카드를 뒤집었어요. 내 차례부터 이 입체도형 모양의 물건을 하나씩 말해요."); }
  function newCard(m) { card = deck.pop(); used = new Set(); p = starter; phase = p === 0 ? "me" : "ai"; render(m); if (phase === "ai") ai(); }
  const left = () => CY6_BANK[card].filter(o => !used.has(o)).length;
  function render(m) {
    wrap.innerHTML = "";
    const tiles = h("div", { class: "cy6cards", style: "grid-template-columns:repeat(auto-fill,minmax(6.2em,1fr))" }, ...all.map(o => { const c = h("div", { class: "cy6card" + (used.has(o) ? " cy6-good" : "") , style: used.has(o) ? "opacity:.55" : "" }, cy6ObjFig(o, { W: 120, H: 100 }), h("div", { style: "font-size:.8em" }, CY6_OBJS[o].n));
      c.addEventListener("click", () => mine(o, c)); return c; }));
    wrap.append(h("div", { class: "cy6table", style: "grid-template-columns:repeat(3,minmax(0,1fr))" }, ...NM.map((n, i) => h("div", { class: "cy6pl" + (i === p && phase !== "over" ? " cy6-turn" : "") }, n, h("div", {}, `가진 카드 ${held[i]}장`)))),
      h("div", { class: "cy6row" }, h("div", { style: "flex:0 1 12em" }, h("div", { class: "cy6gc" }, card ? cy6Shp(card)() : "​", h("div", {}, card ? CY6_KN[card] : ""), h("div", { class: "cy6mk" }, "이 앱이 만든 카드"))),
        h("div", {}, h("div", { class: "cy6read" }, m || ""), h("div", { class: "cy6small" }, `남은 카드 ${deck.length}장 · 이번 카드에서 말한 물건 ${used.size}개`),
          phase === "me" ? h("div", { class: "cy6btns" }, h("button", { onclick: giveUp }, "더 말할 수 없어요")) : null, phase === "over" ? h("div", { class: "cy6btns" }, h("button", { class: "ghost", onclick: start }, "한 판 더")) : null)),
      h("div", { class: "jua" }, phase === "me" ? "내 차례: 아래에서 물건을 하나 눌러 말해요." : "물건 그림"), tiles);
  }
  function mine(o, el) { if (phase !== "me") return; if (used.has(o)) return api.hint("이번 카드에서 이미 말한 물건이에요."); api.tryOnce();
    if (CY6_OBJS[o].k !== card) { el.classList.add("cy6-bad"); return api.hint(`${cy6Jo(CY6_OBJS[o].n, "은/는")} ${CY6_KN[CY6_OBJS[o].k]} 모양이에요. ${CY6_KN[card]} 모양의 물건을 찾아요.`); }
    used.add(o); turnOn(`나: “${CY6_OBJS[o].n}!”`); }
  function giveUp() { if (phase !== "me") return; const l = left(); take(0, l ? `나: “더 말할 수 없어요.” (아직 ${l}개가 남아 있었어요.) 내가 카드를 가져가요.` : "나: “더 말할 수 없어요.” 내가 카드를 가져가요."); }
  function take(i, m) { held[i]++; starter = (i + 1) % 3; phase = "wait"; render(m); clearTimeout(timer); timer = setTimeout(() => { if (!wrap.isConnected) return; if (!deck.length) return over(); newCard("새 카드를 뒤집었어요."); }, 1600); }
  function turnOn(m) { p = (p + 1) % 3; phase = p === 0 ? "me" : "ai"; render(m + (p === 0 ? " · 내 차례예요." : "")); if (phase === "ai") ai(); }
  function ai() { clearTimeout(timer); timer = setTimeout(() => { if (!wrap.isConnected) return; const l = left(), go = l >= 2 ? Math.random() < .85 : l === 1 ? Math.random() < .55 : false;
    if (!go) return take(p, `${NM[p]}: “음… 더 말할 수 없어요.” ${cy6Jo(NM[p], "이/가")} 카드를 가져가요.`);
    const o = CY6_BANK[card].filter(x => !used.has(x))[Math.floor(Math.random() * l)]; used.add(o); turnOn(`${NM[p]}: “${CY6_OBJS[o].n}!”`); }, 1100); }
  function over() { phase = "over"; const mn = Math.min(...held), win = NM.filter((_, i) => held[i] === mn); card = null;
    render(`카드가 모두 없어졌어요. 가진 카드: ${NM.map((n, i) => `${n} ${held[i]}장`).join(", ")}. 카드를 가장 적게 가진 ${cy6Win(win)} 이겼어요!`);
    if (!solved) { solved = true; api.done(`가진 카드 ${held[0]}장`, "놀이를 끝까지 했어요. ‘한 판 더’로 또 해도 좋아요."); } }
  start();
}

/* ---------- 테니스공 2개를 통에 넣어 보기 ---------- */
function cy6Tube(body, api, opt) {
  const d = opt.d || 6, R = d / 2, TH = 2 * d, W = 420, H = 380, s = Math.min(22, (H - 60) / (TH + 1.2)), pitch = 16;
  const cx = W * .33, cy = H / 2 + 8, svg = makeSvg(W, H); svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = "26em";
  const balls = [{ x: W * .78, y: H * .3, in: -1 }, { x: W * .78, y: H * .72, in: -1 }]; let drag = null, fin = false, I = null, n = 0;
  const read = h("div", { class: "cy6read" });
  const slotY = k => { const P = I.P([0, R + k * d, 0]); return P; };
  const draw = () => {
    svg.innerHTML = "";
    I = cy6Draw(svg, { kind: "cyl", r: R, h: TH, s, cx, cy, pitch, fill: { side: "#EEF5FD", top: "rgba(255,255,255,.2)", bot: "#DCE8F4" }, shadeSide: false, sw: 2 });
    balls.forEach((b, i) => { const c = b.in >= 0 ? slotY(b.in) : [b.x, b.y], rr = R * s * .99;
      svg.append(svgEl("circle", { cx: cy6R(c[0]), cy: cy6R(c[1]), r: cy6R(rr), fill: "#D6E64A", stroke: "#8EA21C", "stroke-width": 2, class: "cy6hit" }));
      svg.append(svgEl("path", { d: `M${cy6R(c[0] - rr * .8)} ${cy6R(c[1] - rr * .45)}q${cy6R(rr * .8)} ${cy6R(rr * .6)} ${cy6R(rr * 1.6)} 0M${cy6R(c[0] - rr * .8)} ${cy6R(c[1] + rr * .45)}q${cy6R(rr * .8)} ${cy6R(-rr * .6)} ${cy6R(rr * 1.6)} 0`, stroke: "#fff", "stroke-width": 3, fill: "none", "pointer-events": "none" })); });
    svg.append(svgEl("polygon", { points: cy6Pts(I.hull), fill: "rgba(160,200,240,.18)", stroke: CY6.ink, "stroke-width": 2, "pointer-events": "none" }));
    cy6Disk(svg, I, R, TH, "rgba(255,255,255,0)");
    if (fin) { const a = I.P([R + .9, 0, 0]), b = I.P([R + .9, TH, 0]), m = I.P([R + .9, d, 0]); cy6Seg(svg, a, b, { stroke: CY6.blue, "stroke-width": 2 }); [a, m, b].forEach(q => cy6Seg(svg, [q[0] - 6, q[1]], [q[0] + 6, q[1]], { stroke: CY6.blue, "stroke-width": 2 }));
      cy6T(svg, a[0] + 28, (a[1] + m[1]) / 2, `${d} cm`, 15, { fill: CY6.blue }); cy6T(svg, a[0] + 28, (m[1] + b[1]) / 2, `${d} cm`, 15, { fill: CY6.blue });
      const l = I.P([-R, -0.9, 0]), rr2 = I.P([R, -0.9, 0]); cy6Seg(svg, l, rr2, { stroke: CY6.red, "stroke-width": 2 }); cy6T(svg, (l[0] + rr2[0]) / 2, l[1] + 14, `밑면의 지름 ${d} cm`, 14, { fill: CY6.red }); }
    read.textContent = fin ? `공 2개가 통에 꼭 맞게 들어갔어요.` : `지름이 ${d} cm인 테니스공을 끌어서 통에 넣어 보세요. (${n}/2)`;
  };
  dragOn(svg, p => { if (fin) return false; const i = balls.findIndex(b => b.in < 0 && Math.hypot(p.x - b.x, p.y - b.y) < R * s); if (i < 0) return false; drag = i; return true; },
    p => { const b = balls[drag]; b.x = Math.max(20, Math.min(W - 20, p.x)); b.y = Math.max(20, Math.min(H - 20, p.y)); draw(); },
    p => { const b = balls[drag]; drag = null; const top = I.P([0, TH, 0]); if (Math.abs(b.x - top[0]) < R * s * 1.3 && b.y < cy + TH * s * .5) { b.in = n++; } else { b.x = W * .78; } draw();
      if (n === 2 && !fin) { fin = true; draw(); cy6Then(body, api, opt, "공 2개를 넣음", "통에 공 2개를 넣었어요."); } });
  api.provide({ words: ["통의 높이 = 공 2개의 지름의 합", "밑면의 지름 = 공의 지름"], answers: [] });
  body.append(svg, read); draw();
}

/* ---------- 문제 그림 ---------- */
/* 길이를 적은 입체도형: lab {r, d, h, gen, rTop} */
function cy6Dim(o) {
  const kind = o.kind, r = o.r, hh = o.h || 0, L = o.lab || {};
  return cy6Fig(Object.assign({ W: o.W || 300, H: o.H || 250, maxW: o.maxW || "17em", box: [o.bx || 0, 10, (o.W || 300) - (o.bx || 0) - (o.bw || 70), (o.H || 250) - 20], pad: 18,
    fill: kind === "cone" ? { side: "#FDE3D3", bot: "#F6B38E" } : kind === "sph" ? { side: "#DDEDE5" } : { side: "#DCEAFB", top: "#9CC3F0", bot: "#9CC3F0" } }, o, {
    after: (svg, I) => {
      const P = I.P;
      if (kind === "sph") {
        const c = P([0, 0, 0]); cy6Dot(svg, c, 4);
        if (L.r) { const q = P([r, 0, 0]); cy6Seg(svg, c, q, { stroke: CY6.red, "stroke-width": 2.4 }); cy6T(svg, (c[0] + q[0]) / 2, c[1] - 13, L.r, 15, { fill: CY6.red }); }
        if (L.d) { const a = P([-r, 0, 0]), b = P([r, 0, 0]); cy6Seg(svg, a, b, { stroke: CY6.red, "stroke-width": 2.4 }); cy6T(svg, c[0], c[1] - 13, L.d, 15, { fill: CY6.red }); }
        return;
      }
      if (L.r) { const yy = kind === "cyl" ? hh : 0, c = P([0, yy, 0]), q = P([r, yy, 0]); cy6Seg(svg, c, q, { stroke: CY6.red, "stroke-width": 2.4, "stroke-dasharray": kind === "cyl" ? null : "6 4" }); cy6Dot(svg, c, 3.5, CY6.red); cy6T(svg, (c[0] + q[0]) / 2, c[1] + (kind === "cyl" ? -15 : 15), L.r, 15, { fill: CY6.red }); }
      if (L.d) { const yy = kind === "cyl" ? hh : 0, a = P([-r, yy, 0]), b = P([r, yy, 0]); cy6Seg(svg, a, b, { stroke: CY6.red, "stroke-width": 2.4, "stroke-dasharray": kind === "cyl" ? null : "6 4" }); cy6T(svg, (a[0] + b[0]) / 2, a[1] + (kind === "cyl" ? -12 : 15), L.d, 15, { fill: CY6.red }); }
      if (L.h && kind === "cyl") { const x = r * 1.22, a = P([x, 0, 0]), b = P([x, hh, 0]); cy6Seg(svg, a, b, { stroke: CY6.blue, "stroke-width": 2 }); [a, b].forEach(q => cy6Seg(svg, [q[0] - 6, q[1]], [q[0] + 6, q[1]], { stroke: CY6.blue, "stroke-width": 2 })); cy6T(svg, a[0] + 10 + L.h.length * 4.3, (a[1] + b[1]) / 2, L.h, 15, { fill: CY6.blue }); }
      if (L.h && kind === "cone") { const a = P([0, 0, 0]), b = P([0, hh, 0]); cy6Seg(svg, a, b, { stroke: CY6.blue, "stroke-width": 2.2, "stroke-dasharray": "6 4" }); cy6T(svg, a[0] - 8 - L.h.length * 4.3, a[1] - (a[1] - b[1]) * .38, L.h, 15, { fill: CY6.blue }); }
      if (L.gen) { const a = P([0, hh, 0]), b = P([r, 0, 0]); cy6Seg(svg, a, b, { stroke: CY6.purple, "stroke-width": 3 }); cy6T(svg, (a[0] + b[0]) / 2 + 12 + L.gen.length * 4.3, (a[1] + b[1]) / 2, L.gen, 15, { fill: CY6.purple }); }
      if (o.after2) o.after2(svg, I);
    } }));
}
/* 이름표를 단 입체도형: items [{p, t}], p = "top"|"bot"|"side"|"h"|"apex"|"gen"|"r"|"c"|"d" */
function cy6PartsFig(o) {
  const kind = o.kind, r = o.r || 1, hh = o.h || 2, W = o.W || 420, H = o.H || 280;
  return cy6Fig(Object.assign({ W, H, maxW: o.maxW || "24em", box: [110, 8, W - 220, H - 16], pad: 14,
    fill: kind === "cone" ? { side: "#FDE3D3", bot: "#F6B38E" } : kind === "sph" ? { side: "#DDEDE5" } : { side: "#DCEAFB", top: "#9CC3F0", bot: "#9CC3F0" } }, o, {
    after: (svg, I) => {
      const P = I.P, A = {};
      if (kind === "sph") { const c = P([0, 0, 0]), e = P([r * Math.cos(-.5), r * Math.sin(-.5), 0]), a = P([-r * .8, -r * .6, 0]), b = P([r * .8, r * .6, 0]);
        cy6Dot(svg, c, 4.5); cy6Seg(svg, c, e, { stroke: CY6.red, "stroke-width": 2.6 }); cy6Seg(svg, a, b, { stroke: CY6.blue, "stroke-width": 2.6 });
        A.c = c; A.r = [(c[0] + e[0]) / 2, (c[1] + e[1]) / 2]; A.d = [a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25]; }
      else {
        A.top = I.vis.top ? P([-.15 * r, hh, -.25 * r]) : P([.35 * r, hh, r * .93]); A.bot = I.vis.bot ? P([.15 * r, 0, .25 * r]) : P([.35 * r, 0, r * .93]); A.side = P([-r * .55, hh * .45, r * .8]); A.apex = P([0, hh, 0]);
        if (o.items.some(x => x.p === "h")) { const a = P([0, 0, 0]), b = P([0, hh, 0]); cy6Seg(svg, a, b, { stroke: CY6.red, "stroke-width": 2.4, "stroke-dasharray": "6 4" }); A.h = [(a[0] + b[0]) / 2, a[1] * .55 + b[1] * .45]; }
        if (o.items.some(x => x.p === "gen")) { const a = P([0, hh, 0]), b = P([r * .62, 0, r * .78]); cy6Seg(svg, a, b, { stroke: CY6.purple, "stroke-width": 2.8 }); A.gen = [a[0] * .4 + b[0] * .6, a[1] * .4 + b[1] * .6]; }
        if (o.items.some(x => x.p === "r")) { const yy = kind === "cyl" ? hh : 0, a = P([0, yy, 0]), b = P([r, yy, 0]); cy6Seg(svg, a, b, { stroke: CY6.blue, "stroke-width": 2.4 }); A.r = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
        if (kind === "cone") cy6Dot(svg, A.apex, 4.5, CY6.ink);
      }
      const left = o.items.filter(x => x.side !== "R"), right = o.items.filter(x => x.side === "R");
      [[left, 0], [right, 1]].forEach(([L, sd]) => { const ys = L.map(it => A[it.p][1]).sort((a, b) => a - b); L.slice().sort((a, b) => A[a.p][1] - A[b.p][1]).forEach((it, k) => {
        let y = Math.max(22 + k * 36, Math.min(H - 20, A[it.p][1])); if (k && y - (L._last || -99) < 34) y = L._last + 34; L._last = y; const hw = (18 + it.t.length * 15) / 2 + 6; cy6Call(svg, A[it.p], [sd ? W - hw : hw, y], it.t, it.col); }); });
    } }));
}
/* 종이 모양(돌리기 전): 막대에 붙인 변을 굵게 */
function cy6Flat(o) {
  const s = o.s || 14, W = o.W || 260, H = o.H || 200, svg = makeSvg(W, H); svg.setAttribute("class", "cy6fig"); svg.style.maxWidth = o.maxW || "15em";
  let pts, ax;
  if (o.shape === "rect") { pts = [[0, 0], [o.w, 0], [o.w, o.h], [0, o.h]]; ax = [[0, 0], [0, o.h]]; }
  else if (o.shape === "tri") { pts = [[0, 0], [o.b, 0], [0, o.h]]; ax = [[0, 0], [0, o.h]]; }
  else { const R = o.d / 2; pts = Array.from({ length: 41 }, (_, i) => [R * Math.sin(Math.PI * i / 40), R - R * Math.cos(Math.PI * i / 40)]); ax = [[0, 0], [0, o.d]]; }
  const mw = Math.max(...pts.map(p => p[0])), mh = Math.max(...pts.map(p => p[1])), ox = (W - mw * s) / 2 + 10, oy = (H + mh * s) / 2;
  const X = p => [ox + p[0] * s, oy - p[1] * s];
  cy6Seg(svg, X([0, -.9]), X([0, mh + .9]), { stroke: CY6.stick, "stroke-width": 5 });
  svg.append(svgEl("polygon", { points: cy6Pts(pts.map(X)), fill: CY6.paper, stroke: "#C98A2E", "stroke-width": 2.2 }));
  (o.labels || []).forEach(L => { const q = X(L.at); cy6T(svg, q[0] + (L.dx || 0), q[1] + (L.dy || 0), L.t, 14, { fill: "#8A5A12" }); });
  return svg;
}
/* 원뿔에서 길이 재기 그림: type "h"(높이) | "gen"(모선) | "d"(밑면의 지름) */
function cy6MeasFig(type) {
  return cy6Fig({ kind: "cone", r: 1.4, h: 2.6, pitch: 8, W: 210, H: 190, plain: false, maxW: "100%", box: [10, 12, 150, 166], pad: 10, fill: { side: "#FDE3D3", bot: "#F6B38E" }, hidden: "none",
    after: (svg, I) => { const P = I.P, ruler = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * 9, ny = dx / L * 9;
      svg.append(svgEl("polygon", { points: cy6Pts([a, b, [b[0] + nx, b[1] + ny], [a[0] + nx, a[1] + ny]]), fill: "#FFF6D6", stroke: "#B8963A", "stroke-width": 1.3 }));
      for (let k = 0; k <= 10; k++) { const t = k / 10, q = [a[0] + dx * t, a[1] + dy * t]; cy6Seg(svg, q, [q[0] + nx * .5, q[1] + ny * .5], { stroke: "#8A6D1F", "stroke-width": 1 }); } };
      const sq = (p, w, hgt, flip) => svg.append(svgEl("polygon", { points: cy6Pts([p, [p[0] + (flip ? -w : w), p[1]], [p[0], p[1] + hgt]]), fill: "rgba(43,123,214,.25)", stroke: CY6.blue, "stroke-width": 1.6 }));
      const A = P([0, 2.6, 0]), B = P([0, 0, 0]), Rr = P([1.4, 0, 0]), Lf = P([-1.4, 0, 0]);
      if (type === "h") { ruler([Rr[0] + 18, B[1]], [Rr[0] + 18, A[1] - 6]); sq([A[0], A[1]], Rr[0] + 18 - A[0], 22); cy6Seg(svg, A, [Rr[0] + 18, A[1]], { stroke: CY6.blue, "stroke-width": 2.4 }); }
      if (type === "gen") { const n = [(Rr[1] - A[1]), -(Rr[0] - A[0])], L = Math.hypot(...n); ruler([Rr[0] + n[0] / L * 3, Rr[1] + n[1] / L * 3], [A[0] + n[0] / L * 3, A[1] + n[1] / L * 3]); }
      if (type === "d") { ruler([Lf[0] - 16, B[1] + 6], [Rr[0] + 16, B[1] + 6]); sq([Lf[0], B[1] + 4], 0, -1, false); [Lf, Rr].forEach((q, i) => svg.append(svgEl("polygon", { points: cy6Pts([[q[0], B[1] + 4], [q[0], B[1] - 44], [q[0] + (i ? 26 : -26), B[1] + 4]]), fill: "rgba(43,123,214,.25)", stroke: CY6.blue, "stroke-width": 1.6 }))); }
    } });
}
/* 같은 크기·모양 전개도 정의 */
const CY6_NETS = [
  { name: "가", w: 6.28, h: 2.5, c: [{ x: 1.6, side: "t", r: 1 }, { x: 4.7, side: "t", r: 1 }], res: "same" },
  { name: "나", w: 6.28, h: 2.5, c: [{ x: 3.14, side: "t", r: 1 }, { x: 3.14, side: "b", r: .6 }], res: "size" },
  { name: "다", w: 6.28, h: 2.5, c: [{ x: 3.14, side: "t", r: 1 }, { x: 3.14, side: "b", r: 1 }], res: "ok" },
  { name: "라", w: 6.28, h: 2.5, c: [{ x: 1.2, side: "t", r: 1 }, { x: 5.08, side: "b", r: 1 }], res: "ok" },
  { name: "마", w: 6.28, h: 2.5, c: [{ x: 1.05, side: "t", r: 1 }, { x: 1.05, side: "b", r: 1 }], res: "ok" },
  { name: "바", w: 4.2, h: 2.5, c: [{ x: 2.1, side: "t", r: 1 }, { x: 2.1, side: "b", r: 1 }], res: "len" }];
const cy6Net = (net, lab, s, maxW, box) => () => cy6NetSvg(net, { s: s || 14, lab, maxW: maxW || "20em", box }).svg;
const cy6Pair = (...figs) => h("div", { class: "cy6row" }, ...figs.map(f => h("div", { style: "text-align:center" }, typeof f === "function" ? f() : f)));
//@@LESSONS
const UNIT_STORY = { title: "예빈이네 마을 체육 대회", lines: [
  "오늘은 예빈이가 사는 마을에 체육 대회가 열리는 날이에요. 체육관에는 대형 주사위, 농구공, 탁구공, 셔틀콕 보관 통, 미니 콘처럼 여러 가지 물건이 있어요.",
  "예빈이와 함께 체육관 물건을 정리하며 원기둥을 알아보고, 원기둥 모양의 통을 잘라 펼쳐 전개도를 그리고, 물건 찾기 놀이와 공 경기에서 원뿔과 구를 알아봐요. 종이를 붙인 막대를 돌려 원기둥, 원뿔, 구를 만들어 보기도 해요.",
  "교과서 「수학 6-2」 6. 원기둥, 원뿔, 구의 차시 순서 그대로 만들었어요."],
  one: "원기둥, 원뿔, 구 · 마을 체육 대회가 열린 체육관에서 입체도형을 분류하고, 돌려 보고, 펼쳐 봐요." };
const UNIT_KEYWORDS = ["원기둥", "밑면", "옆면", "높이", "원기둥의 전개도", "원뿔", "원뿔의 꼭짓점", "모선", "구", "구의 중심", "구의 반지름", "구의 지름", "굽은 면", "평행", "합동", "원주율 3.14"];

const CY6_RED = { c: "#F28B82", n: "빨간색" }, CY6_BLUE = { c: "#7FB2F0", n: "파란색" };
const cy6Two = (a, b) => () => h("div", { class: "cy6row" }, h("div", { style: "text-align:center" }, a()), h("div", { style: "text-align:center" }, b()));

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 마을 체육 대회가 열려요", soop: "개념 찾기(S)",
  question: "체육관에 있는 여러 가지 물건은 어떤 입체도형 모양일까요?",
  summary: "체육관에는 공 모양, 평평한 면이 원인 기둥 모양, 평평한 면이 원인 뿔 모양의 물건이 있어요. 이 단원에서는 원기둥, 원기둥의 전개도, 원뿔, 구를 차례로 알아봐요.",
  steps: [
    { name: "살펴보기", inst: "오늘은 예빈이가 사는 마을에 체육 대회가 열리는 날이에요. 체육관에는 여러 가지 물건이 있어요. “여러 가지 물건의 모양을 살펴볼까?” 물건 카드를 모양에 따라 상자에 나누어 담아 보세요.", hints: ["농구공, 탁구공은 둥근 공 모양이에요.", "셔틀콕 보관 통은 평평한 면이 원인 기둥 모양, 미니 콘은 평평한 면이 원인 뿔 모양이에요."],
      render: (b, a) => cy6Sort(b, a, { bins: ["공 모양", "평평한 면이 원인 기둥 모양", "평평한 면이 원인 뿔 모양", "그 밖의 모양"], cardW: "6.2em",
        items: [{ name: "대형 주사위", fig: () => cy6ObjFig("dice"), bin: 3, why: "대형 주사위는 평평한 면이 정사각형인 상자 모양이에요." }, { name: "농구공", fig: () => cy6ObjFig("basket"), bin: 0 },
          { name: "셔틀콕 보관 통", fig: () => cy6ObjFig("tube"), bin: 1, why: "셔틀콕 보관 통은 평평한 면이 원인 기둥 모양이에요." }, { name: "탁구공", fig: () => cy6ObjFig("pingpong"), bin: 0 },
          { name: "미니 콘", fig: () => cy6ObjFig("minicone"), bin: 2, why: "미니 콘은 평평한 면이 원이고 위가 뾰족한 뿔 모양이에요." }, { name: "배구공", fig: () => cy6ObjFig("volley"), bin: 0 },
          { name: "배턴", fig: () => cy6ObjFig("baton"), bin: 1, why: "배턴은 누워 있지만 평평한 면이 원인 기둥 모양이에요." }, { name: "러버 콘", fig: () => cy6ObjFig("rcone"), bin: 2 }],
        ok: "농구공·탁구공·배구공은 공 모양, 셔틀콕 보관 통·배턴은 평평한 면이 원인 기둥 모양, 미니 콘·러버 콘은 평평한 면이 원인 뿔 모양이에요." }) },
    { name: "이야기 보기", inst: "예빈이는 정리한 물건의 모양과 놀이에 사용한 물건의 모양을 살펴보았어요. 그리고 농구, 탁구, 피구 경기에서 사용한 여러 가지 공의 모양도 살펴보았어요. 그림 속 이야기를 떠올려 답해 보세요.", hints: ["체육관에서는 체육 대회 준비와 경기가 함께 열리고 있어요.", "“네덜란드에는 둥근 뿔 모양의 도서관이 있어.”라고 했어요."],
      render: (b, a) => quiz(b, a, [
        { q: "체육관에서 볼 수 있는 모습을 모두 골라 보세요.", o: ["체육 대회가 열리고 있어요.", "마을 사람들이 물건을 정리하고 있어요.", "농구와 탁구 경기를 해요.", "수영 대회를 하고 있어요."], a: [0, 1, 2] },
        { q: "단원 도입 그림에서 네덜란드에는 어떤 모양의 도서관이 있다고 했나요?", o: ["둥근 뿔 모양", "공 모양", "상자 모양"], a: 0 },
        { q: "이어달리기에서 쓰는 배턴은 어떤 모양인가요?", fig: () => cy6ObjFig("baton", { maxW: "10em", plain: false }), o: ["기둥 모양", "뿔 모양", "공 모양"], a: 0 }],
        { ok: "체육 대회 날 체육관에서는 물건을 정리하고 여러 경기를 해요. 둥근 뿔 모양의 도서관, 기둥 모양의 배턴처럼 우리 주변에는 둥근 입체도형이 많아요." }) },
    { name: "떠올리기 ①", inst: "배운 내용을 떠올려 보세요. (수학익힘 ‘이전에 배웠어요’ ― 각기둥과 각뿔 알아보기)", hints: ["각기둥은 서로 평행하고 합동인 두 면이 있는 기둥 모양이에요.", "각뿔은 밑면이 1개이고 옆면이 모두 삼각형인 뿔 모양이에요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => cy6Pick(bx, ax, { q: "각기둥을 모두 골라 보세요.", items: [{ name: "가", fig: cy6Shp("tri") }, { name: "나", fig: cy6Shp("pyr4") }, { name: "다", fig: cy6Shp("pent") }, { name: "라", fig: cy6Shp("pyr3") }, { name: "마", fig: cy6Shp("hex") }], a: [0, 2, 4],
          whyExtra: i => ({ 1: "나는 사각뿔이에요. 뾰족한 꼭짓점이 있고 옆면이 삼각형이에요.", 3: "라는 삼각뿔이에요. 평행한 두 면이 없어요." })[i], ok: "가는 삼각기둥, 다는 오각기둥, 마는 육각기둥이에요." }),
        (bx, ax) => blanks(bx, ax, ["각기둥에서 서로 평행하고 합동인 두 면을 ", { o: ["밑면", "옆면", "꼭짓점"], a: 0 }, "이라 하고, 두 밑면과 만나는 면을 ", { o: ["밑면", "옆면", "꼭짓점"], a: 1 }, "이라고 해요. 각뿔에서 밑면과 만나는 면은 모두 ", { o: ["삼각형", "직사각형", "원"], a: 0 }, "이에요."],
          { ok: "각기둥의 평행하고 합동인 두 면은 밑면, 밑면과 만나는 면은 옆면이에요. 각뿔의 옆면은 모두 삼각형이에요." })]) },
    { name: "떠올리기 ②", inst: "배운 내용을 떠올려 보세요. (수학익힘 ‘이전에 배웠어요’ ― 각기둥의 전개도 그리기, 원주 구하기)", hints: ["삼각기둥의 옆면은 직사각형 3개예요.", "(원주) = (지름) × (원주율), 원주율은 3.14로 계산해요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [{ q: "삼각기둥의 전개도예요. 옆면은 어떤 모양이고 몇 개인가요?", fig: () => { const s = makeSvg(320, 212); s.setAttribute("class", "cy6fig"); s.style.maxWidth = "17em";
            [[40, 70], [120, 70], [200, 70]].forEach(([x, y]) => s.append(svgEl("rect", { x, y, width: 80, height: 70, fill: "#FFF1C7", stroke: CY6.ink, "stroke-width": 2 })));
            s.append(svgEl("polygon", { points: "120,70 200,70 160,1", fill: "#FBD3A6", stroke: CY6.ink, "stroke-width": 2 })); s.append(svgEl("polygon", { points: "120,140 200,140 160,209", fill: "#FBD3A6", stroke: CY6.ink, "stroke-width": 2 }));
            return s; }, o: ["직사각형 3개", "삼각형 3개", "직사각형 2개"], a: 0, why: { "1": "삼각형 2개는 밑면이에요. 옆면은 가운데의 사각형들이에요." } }], { ok: "삼각기둥의 전개도에서 밑면은 삼각형 2개, 옆면은 직사각형 3개예요." }),
        (bx, ax) => cy6Ask(bx, ax, [{ q: "원주를 구해 보세요. (원주율 3.14)", parts: ["지름이 10 cm인 원의 원주: ", { n: 31.4, why: { "15.7": "반지름(5 cm)에 원주율을 곱했어요. 원주는 (지름)×(원주율)이에요.", "10": "지름을 그대로 썼어요." } }, " cm", h("br"),
          "반지름이 4 cm인 원의 원주: ", { n: 25.12, why: { "12.56": "반지름에 원주율을 곱했어요. 지름은 4×2=8 (cm)이에요." } }, " cm"] }], { ok: "원주는 (지름)×(원주율)이에요. 10×3.14=31.4 (cm), 8×3.14=25.12 (cm)예요." })]) },
    { name: "확인하기", inst: "이 단원에서 배울 내용을 살펴보고 학습 계획을 세워 보세요.", hints: ["교과서의 차례는 원기둥 → 원기둥의 전개도 → 원뿔 → 구예요."],
      render: (b, a) => cy6Chain(b, a, [
        { title: "배울 내용을 교과서 차례대로 눌러 붙여 보세요.", run: (bx, ax) => sequence(bx, ax, ["원기둥을 알아볼까요", "원기둥의 전개도를 알아볼까요", "원뿔을 알아볼까요", "구를 알아볼까요"], [0, 1, 2, 3], { ok: "원기둥 → 원기둥의 전개도 → 원뿔 → 구 차례로 배워요." }) },
        (bx, ax) => writeStep(bx, ax, [{ q: "우리 주변에서 둥근 입체도형 모양의 물건을 찾아 써 보세요.", tag: "찾은 물건", ph: "예) 음료수 캔, 고깔모자, 축구공" },
          { q: "이 단원에서 알고 싶은 것이나 학습 계획을 써 보세요.", tag: "학습 계획", ph: "예) 원기둥의 전개도를 직접 그려 보고 싶어요." }])]) }
  ],
  challenge: { inst: "평평한 면이 원인 기둥 모양의 물건을 모두 골라 보세요.", hints: ["평평한 면이 원이고 기둥처럼 생긴 물건을 찾아요.", "누워 있어도 모양은 같아요."],
    render: (b, a) => cy6Pick(b, a, { items: [{ name: "음료수 캔", fig: () => cy6ObjFig("can") }, { name: "고깔모자", fig: () => cy6ObjFig("hat") }, { name: "농구공", fig: () => cy6ObjFig("basket") }, { name: "물통", fig: () => cy6ObjFig("bottle") }, { name: "러버 콘", fig: () => cy6ObjFig("rcone") }, { name: "폼 롤러", fig: () => cy6ObjFig("roller") }], a: [0, 3, 5],
      whyExtra: i => ({ 1: "고깔모자는 뿔 모양이에요.", 2: "농구공은 공 모양이에요.", 4: "러버 콘은 뿔 모양이에요." })[i], ok: "음료수 캔, 물통, 폼 롤러는 평평한 면이 원인 기둥 모양이에요." }) }
},
{
  id: "t2", no: 2, title: "원기둥을 알아볼까요", soop: "개념 구축하기(O)",
  question: "원기둥은 어떤 입체도형이고, 무엇으로 이루어져 있을까요?",
  summary: "두 면이 평행하고 합동인 원으로 이루어진 입체도형을 원기둥이라고 해요. 원기둥에서 평행하고 합동인 두 면을 밑면, 두 밑면과 만나는 굽은 면을 옆면, 두 밑면 사이의 거리를 높이라고 해요. 밑면은 아래에 있는 면이 아니라 평행하고 합동인 두 면이에요. 직사각형 모양의 종이를 한 변을 기준으로 돌리면 원기둥이 만들어져요.",
  steps: [
    { name: "분류하기", inst: "체육관에 도착한 예빈이가 대회를 준비하는 마을 사람들을 도와 물건을 정리하고 있어요. “어떻게 정리하면 좋을지 체육관에 있는 여러 가지 입체도형의 모양을 살펴볼까?” 입체도형 가~마를 분류해 보세요.", hints: ["두 면이 서로 평행하고 모양과 크기가 같은(합동인) 입체도형을 찾아요.", "평행하고 합동인 두 면이 원인지, 원이 아닌지 살펴봐요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => cy6Pick(bx, ax, { q: "평행한 두 면이 합동인 입체도형을 모두 골라 보세요.", items: [{ name: "가", fig: cy6Shp("tri") }, { name: "나", fig: cy6Shp("cylT") }, { name: "다", fig: cy6Shp("box") }, { name: "라", fig: cy6Shp("cylL") }, { name: "마", fig: cy6Shp("cone") }], a: [0, 1, 2, 3],
          whyExtra: () => "마에는 평행한 두 면이 없어요.", whyMiss: "아직 더 있어요. 라처럼 누워 있는 입체도형도 평행하고 합동인 두 면이 있는지 살펴봐요.", ok: "가, 나, 다, 라는 평행한 두 면이 합동이에요." }),
        (bx, ax) => cy6Sort(bx, ax, { q: "가, 나, 다, 라를 기준에 따라 분류해 보세요.", bins: ["평행하고 합동인 두 면이 원인 입체도형", "평행하고 합동인 두 면이 원이 아닌 입체도형"],
          items: [{ name: "가", fig: cy6Shp("tri"), bin: 1, why: "가의 평행하고 합동인 두 면은 삼각형이에요." }, { name: "나", fig: cy6Shp("cylT"), bin: 0 }, { name: "다", fig: cy6Shp("box"), bin: 1, why: "다의 평행하고 합동인 두 면은 사각형이에요." }, { name: "라", fig: cy6Shp("cylL"), bin: 0, why: "라는 누워 있지만 평행하고 합동인 두 면이 원이에요." }],
          ask: [{ q: "평행하고 합동인 두 면이 원인 입체도형의 특징을 모두 골라 보세요.", parts: [{ o: ["평행하고 합동인 두 면이 원이에요.", "굽은 면이 있어요.", "뾰족한 부분이 있어요.", "평평한 면이 1개예요."], multi: true, a: [0, 1], why: { "0,1,2": "뾰족한 부분은 없어요.", "0,2": "뾰족한 부분은 없어요." } }] }],
          ok: "나와 라는 평행하고 합동인 두 면이 원이고, 굽은 면이 있어요." })]) },
    { name: "약속하기", inst: "두 면이 평행하고 합동인 원으로 이루어진 물건을 찾고, 원기둥을 약속해 보세요.", hints: ["위아래(또는 양쪽)의 두 면이 똑같은 원인 물건을 찾아요.", "물건이 누워 있어도 모양은 같아요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => cy6Pick(bx, ax, { q: "두 면이 평행하고 합동인 원으로 이루어진 물건을 모두 골라 보세요.", items: [{ name: "음료수 캔", fig: () => cy6ObjFig("can") }, { name: "러버 콘", fig: () => cy6ObjFig("rcone") }, { name: "셔틀콕 보관 통", fig: () => cy6ObjFig("tube") }, { name: "농구공", fig: () => cy6ObjFig("basket") }, { name: "폼 롤러", fig: () => cy6ObjFig("roller") }, { name: "대형 주사위", fig: () => cy6ObjFig("dice") }], a: [0, 2, 4],
          whyExtra: i => ({ 1: "러버 콘은 평평한 면이 1개뿐이에요.", 3: "농구공은 평평한 면이 없어요.", 5: "대형 주사위의 평행하고 합동인 면은 정사각형이에요." })[i], ok: "음료수 캔, 셔틀콕 보관 통, 폼 롤러는 두 면이 평행하고 합동인 원이에요." }),
        (bx, ax) => blanks(bx, ax, ["음료수 캔, 셔틀콕 보관 통, 폼 롤러 등과 같이 두 면이 평행하고 합동인 ", { o: ["원", "삼각형", "사각형"], a: 0 }, "으로 이루어진 입체도형을 ", { o: ["원기둥", "원뿔", "각기둥"], a: 0 }, "이라고 해요."],
          { ok: "두 면이 평행하고 합동인 원으로 이루어진 입체도형이 원기둥이에요." })]) },
    { name: "색칠하기", inst: "원기둥을 돌려 가며 평행하고 합동인 두 면을 찾아 색칠해 보세요.", hints: ["위쪽 원과 아래쪽 원이 평행하고 합동인 두 면이에요.", "아래쪽 면은 원기둥을 위로 돌려야 잘 보여요(▲ 단추)."],
      render: (b, a) => cy6Tap(b, a, { solid: { kind: "cyl", r: 1.2, h: 2.2 }, pens: [CY6_RED], want: { top: CY6_RED.c, bot: CY6_RED.c },
        why: k => k === "side" ? "옆의 굽은 면은 칠하지 않아요. 평행하고 합동인 두 면만 칠해요." : "평행하고 합동인 두 면(위쪽 원과 아래쪽 원)을 모두 칠해요. 아래쪽 면은 돌려서 찾아요.",
        ask: [{ q: "색칠한 두 면과 만나는 면은 어떤 면인가요?", parts: ["색칠한 두 면과 만나는 면은 ", { o: ["굽은 면", "평평한 면", "삼각형 모양의 면"], a: 0 }, "이에요."] }],
        ok: "평행하고 합동인 두 면은 원이고, 두 면과 만나는 면은 굽은 면이에요." }) },
    { name: "약속하기 ②", inst: "평행하고 합동인 두 면 사이의 거리를 자와 삼각자로 재어 보고, 원기둥의 구성 요소를 약속해 보세요.", hints: ["삼각자를 내려 위쪽 면에 닿게 하고 자의 눈금을 읽어요.", "두 면 사이의 거리는 두 면에 수직인 선분의 길이예요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => cy6Ruler(bx, ax, { kind: "cyl", r: 2, h: 6,
          ask: [{ parts: ["이 원기둥에서 평행하고 합동인 두 면 사이의 거리는 ", { n: 6 }, " cm예요."] },
            { q: "두 면 사이의 거리는 어떻게 재면 좋을까요?", parts: [{ o: ["평행한 두 면에 수직인 선분의 길이를 자와 삼각자로 재요.", "옆면을 따라 비스듬히 재요.", "위쪽 원의 지름을 재요."], a: 0 }] }],
          ok: "평행한 두 면에 수직인 선분의 길이를 재면 두 면 사이의 거리를 알 수 있어요." }),
        (bx, ax) => blanks(bx, ax, ["원기둥에서 평행하고 합동인 두 면을 ", { o: ["밑면", "옆면", "꼭짓점"], a: 0 }, "이라 하고, 두 밑면과 만나는 굽은 면을 ", { o: ["밑면", "옆면", "꼭짓점"], a: 1 }, "이라고 해요. 또, 두 밑면 사이의 거리를 ", { o: ["높이", "둘레", "모서리"], a: 0 }, "라고 해요."],
          { ok: "평행하고 합동인 두 면은 밑면, 굽은 면은 옆면, 두 밑면 사이의 거리는 높이예요." }),
        (bx, ax) => cy6Ask(bx, ax, [{ q: "누워 있는 원기둥이에요. ㉠, ㉡, ㉢의 이름을 골라 보세요.", fig: () => cy6PartsFig({ kind: "cyl", r: 1, h: 2.6, tilt: 90, yaw: -20, pitch: 18, items: [{ p: "bot", t: "㉠", side: "R" }, { p: "h", t: "㉡" }, { p: "side", t: "㉢", side: "R" }] }),
          parts: ["㉠ ", { o: ["밑면", "옆면", "높이"], a: 0, why: { "1": "㉠은 평행하고 합동인 원 중 하나예요. 아래에 있지 않아도 밑면이에요." } }, "  ㉡ ", { o: ["밑면", "옆면", "높이"], a: 2 }, "  ㉢ ", { o: ["밑면", "옆면", "높이"], a: 1 }] }],
          { ok: "원기둥이 누워 있어도 평행하고 합동인 두 원이 밑면이고, 두 밑면 사이의 거리가 높이예요. 밑면은 아래에 있는 면이 아니에요." })]) },
    { name: "돌려 보기", inst: "가로 4 cm, 세로 10 cm인 직사각형 모양의 종이를 막대에 붙였어요(세로를 막대에 붙였어요). 막대를 돌리면 어떤 입체도형이 만들어지는지 알아보세요.", hints: ["막대를 한 바퀴 다 돌려요.", "직사각형의 가로는 막대에서 떨어진 거리라서 밑면의 반지름이 돼요."],
      render: (b, a) => cy6Spin(b, a, { shape: "rect", w: 4, h: 10, labels: [{ at: [2, 0], t: "4 cm", dy: 18 }, { at: [4, 5], t: "10 cm", dx: 34 }],
        qmarks: [{ a: [-4, 0, 0], b: [4, 0, 0], t: "지름 ?", dy: 36 }, { a: [-5, 0, 0], b: [-5, 10, 0], t: "높이 ?", dx: -36 }],
        ask: [{ parts: ["만들어진 입체도형은 ", { o: ["원기둥이에요.", "원뿔이에요.", "구예요."], a: 0 }] },
          { parts: ["밑면의 지름은 직사각형의 ", { o: ["가로의 2배", "가로", "세로"], a: 0, why: { "1": "가로는 막대에서 끝까지의 거리라서 밑면의 반지름이에요. 지름은 반지름의 2배예요." } }, "와 같고, 높이는 직사각형의 ", { o: ["세로", "가로", "가로의 2배"], a: 0 }, "와 같아요."] },
          { parts: ["밑면의 지름: ", { n: 8, why: { "4": "4 cm는 밑면의 반지름이에요. 지름은 4×2=8 (cm)예요." } }, " cm, 높이: ", { n: 10, why: { "4": "높이는 막대에 붙인 세로(10 cm)와 같아요." } }, " cm"] }],
        ok: "직사각형 모양의 종이를 돌리면 원기둥이 만들어져요. 밑면의 지름은 가로의 2배인 8 cm, 높이는 세로와 같은 10 cm예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 원기둥을 찾고, 구성 요소와 길이를 알아보세요.", hints: ["원기둥은 두 면이 평행하고 합동인 원으로 이루어져 있어요.", "원기둥에는 꼭짓점과 모서리가 없어요."],
    render: (b, a) => cy6Chain(b, a, [
      (bx, ax) => cy6Pick(bx, ax, { q: "원기둥을 모두 골라 보세요.", items: [{ name: "가", fig: cy6Shp("frus") }, { name: "나", fig: cy6Shp("cyl") }, { name: "다", fig: cy6Shp("cylL") }, { name: "라", fig: cy6Shp("hex") }], a: [1, 2],
        whyExtra: i => ({ 0: "가는 위와 아래의 원이 평행하지만 크기가 달라 합동이 아니에요.", 3: "라의 평행하고 합동인 두 면은 육각형이에요." })[i], ok: "나와 다가 원기둥이에요." }),
      (bx, ax) => quiz(bx, ax, [
        { q: "원기둥에서 각 부분의 이름이 잘못된 것을 골라 보세요.", fig: () => cy6PartsFig({ kind: "cyl", r: 1, h: 1.9, pitch: 22, items: [{ p: "h", t: "㉠ 높이", side: "R" }, { p: "top", t: "㉡ 밑면" }, { p: "bot", t: "㉢ 옆면" }, { p: "side", t: "㉣ 옆면", side: "R" }] }),
          o: ["㉠", "㉡", "㉢", "㉣"], a: 2, why: { "0": "㉠은 두 밑면 사이의 거리라서 높이가 맞아요.", "3": "㉣은 굽은 면이라서 옆면이 맞아요." } },
        { q: "원기둥과 각기둥에 대해 잘못 설명한 것을 골라 보세요.", o: ["㉠ 원기둥에는 꼭짓점이 없고 각기둥에는 꼭짓점이 있어요.", "㉡ 원기둥과 각기둥은 모두 모서리가 있어요."], a: 1 }],
        { ok: "㉢이 가리키는 곳은 밑면이에요. 원기둥에는 모서리와 꼭짓점이 없어요." }),
      (bx, ax) => cy6Ask(bx, ax, [
        { q: "원기둥의 높이는 몇 cm인가요?", fig: () => cy6Dim({ kind: "cyl", r: .9, h: 2, lab: { d: "18 cm", h: "20 cm" }, W: 300, H: 230 }), parts: ["높이: ", { n: 20, why: { "18": "18 cm는 밑면의 지름이에요. 높이는 두 밑면 사이의 거리예요." } }, " cm"] },
        { q: "직사각형 모양의 종이를 8 cm인 변을 기준으로 돌렸어요. 만들어진 입체도형의 밑면의 지름은 몇 cm인가요?", fig: () => cy6Flat({ shape: "rect", w: 5, h: 8, s: 16, labels: [{ at: [2.5, 0], t: "5 cm", dy: 14 }, { at: [0, 4], t: "8 cm", dx: -24 }] }),
          parts: ["밑면의 지름: ", { n: 10, why: { "5": "5 cm는 밑면의 반지름이에요.", "16": "8 cm인 변은 막대에 붙인 변이라서 높이가 돼요." } }, " cm"] },
        { q: "밑면의 반지름이 14 cm인 원기둥을 앞에서 본 모양이 정사각형이에요. 이 원기둥의 높이는 몇 cm인가요?", parts: ["높이: ", { n: 28, why: { "14": "앞에서 본 모양의 가로는 밑면의 지름(14×2=28 cm)이에요." } }, " cm"] }],
        { ok: "높이는 두 밑면 사이의 거리예요. 5 cm인 변이 반지름이 되어 지름은 10 cm, 앞에서 본 정사각형의 한 변은 지름 28 cm라서 높이도 28 cm예요." })]) }
},
{
  id: "t34", no: "3~4", title: "원기둥의 전개도를 알아볼까요", soop: "개념 구축하기(O)",
  question: "원기둥을 잘라서 펼치면 어떤 모양이 되고, 전개도는 어떻게 그릴까요?",
  summary: "원기둥을 잘라서 평면 위에 펼쳐 놓은 그림을 원기둥의 전개도라고 해요. 전개도에서 밑면은 합동인 원 2개, 옆면은 직사각형 1개예요. 옆면의 가로는 밑면의 둘레((밑면의 지름)×(원주율))와 같고, 옆면의 세로는 원기둥의 높이와 같아요. 두 밑면은 옆면의 마주 보는 두 변에 하나씩 붙어 있어야 해요.",
  steps: [
    { name: "펼쳐 보기", inst: "예빈이는 원기둥 모양의 통을 잘라서 펼쳐 정리하기로 했어요. 예빈: “원기둥 모양의 통을 어떻게 자르면 될까요?” 아저씨: “먼저 밑면의 둘레를 따라 자른 다음 옆면은 밑면에 수직으로 잘라 주렴.” 통을 잘라서 펼쳐 보세요.", hints: ["막대를 끝까지 밀거나 ‘잘라서 펼치기’를 눌러요.", "펼친 그림에서 원 모양은 밑면, 직사각형 모양은 옆면이에요."],
      render: (b, a) => cy6Unroll(b, a, { r: 1.4, h: 2.2, then: (bx, ax) => { bx.append(h("p", { class: "inst" }, h("b", {}, "펼친 그림에서 밑면을 모두 찾아 ◯표, 옆면을 찾아 △표 하세요.")));
        cy6NetMark(bx, ax, { net: { w: 8.79, h: 2.2, c: [{ x: 4.4, side: "t", r: 1.4 }, { x: 4.4, side: "b", r: 1.4 }] }, s: 26,
          ask: [{ parts: ["밑면의 모양은 ", { o: ["원", "직사각형", "삼각형"], a: 0 }, "이고, 옆면의 모양은 ", { o: ["직사각형", "원", "삼각형"], a: 0 }, "이에요."] },
            { q: "원기둥 모양의 통은 어떻게 자르면 펼칠 수 있나요?", parts: [{ o: ["밑면의 둘레를 따라 자르고, 옆면은 밑면에 수직으로 잘라요.", "옆면만 비스듬히 잘라요.", "밑면의 지름을 따라 잘라요."], a: 0 }] }],
          ok: "밑면은 원, 옆면은 직사각형이에요. 밑면의 둘레를 따라 자르고 옆면을 밑면에 수직으로 자르면 펼칠 수 있어요." }); } }) },
    { name: "약속하기", inst: "원기둥의 전개도를 약속해 보세요.", hints: ["원기둥을 잘라서 평면 위에 펼쳐 놓은 그림이에요."],
      render: (b, a) => blanks(b, a, ["원기둥을 잘라서 평면 위에 펼쳐 놓은 그림을 ", { o: ["원기둥의 전개도", "원기둥의 겨냥도", "원기둥의 높이"], a: 0 }, "라고 해요. 원기둥의 전개도에서 밑면은 ", { o: ["합동인 원 2개", "크기가 다른 원 2개", "원 1개"], a: 0 }, ", 옆면은 ", { o: ["직사각형 1개", "삼각형 1개", "직사각형 2개"], a: 0 }, "예요."],
        { ok: "원기둥을 잘라서 평면 위에 펼쳐 놓은 그림이 원기둥의 전개도예요. 합동인 원 2개와 직사각형 1개로 이루어져 있어요." }) },
    { name: "찾아보기", inst: "원기둥의 전개도가 될 수 있는 것을 찾아보세요. 먼저 예상한 다음, 하나씩 접어서 확인해요.", hints: ["두 밑면이 합동인지, 옆면을 기준으로 서로 마주 보는 위치에 있는지 살펴봐요.", "옆면의 가로가 밑면의 둘레와 맞는지도 살펴봐요."],
      render: (b, a) => cy6NetJudge(b, a, { nets: CY6_NETS,
        ask: [{ q: "원기둥의 전개도가 될 수 있는 것을 모두 골라 보세요.", parts: [{ o: CY6_GA, multi: true, a: [2, 3, 4] }] },
          { q: "원기둥의 전개도가 될 수 없는 것의 까닭을 골라 보세요.", parts: ["가: ", { o: ["접었을 때 두 밑면이 겹쳐요.", "밑면인 두 원이 합동이 아니에요.", "맞닿는 부분의 길이가 달라요."], a: 0 }, h("br"),
            "나: ", { o: ["접었을 때 두 밑면이 겹쳐요.", "밑면인 두 원이 합동이 아니에요.", "맞닿는 부분의 길이가 달라요."], a: 1 }, h("br"),
            "바: ", { o: ["접었을 때 두 밑면이 겹쳐요.", "밑면인 두 원이 합동이 아니에요.", "맞닿는 부분의 길이가 달라요."], a: 2 }] }],
        ok: "다, 라, 마는 원기둥의 전개도예요. 가는 두 밑면이 겹치고, 나는 두 원이 합동이 아니고, 바는 맞닿는 부분의 길이가 달라요." }) },
    { name: "길이 알아보기", inst: "밑면의 반지름이 3 cm, 높이가 5 cm인 원기둥의 전개도에서 옆면의 가로와 세로를 알아보세요. (원주율 3.14)", hints: ["옆면의 가로는 밑면의 둘레를 감싸요.", "(밑면의 둘레) = (밑면의 지름) × (원주율), 지름은 3×2=6 (cm)예요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => cy6Ask(bx, ax, [
          { fig: cy6Two(() => cy6Dim({ kind: "cyl", r: 1.5, h: 2.5, lab: { r: "3 cm", h: "5 cm" }, W: 260, H: 230, maxW: "13em" }), cy6Net({ w: 18.84, h: 5, c: [{ x: 9.42, side: "t", r: 3 }, { x: 9.42, side: "b", r: 3 }] }, { w: "옆면의 가로 ?", h: "세로 ?" }, 11, "17em")),
            parts: ["옆면의 가로: 원기둥의 ", { o: ["밑면의 둘레", "높이", "밑면의 반지름"], a: 0 }, h("br"), "옆면의 세로: 원기둥의 ", { o: ["높이", "밑면의 둘레", "밑면의 지름"], a: 0 }] },
          { q: "옆면의 가로와 세로는 각각 몇 cm인가요?", parts: ["가로: ", { n: 18.84, why: { "9.42": "반지름에 원주율을 곱했어요. 밑면의 둘레는 (지름)×(원주율)=6×3.14예요.", "6": "지름만 구했어요. 둘레는 지름에 원주율을 곱해요.", "15": "높이와 반지름을 곱하지 않아요. 밑면의 둘레를 구해요." } }, " cm, 세로: ", { n: 5 }, " cm"] },
          { q: "옆면의 가로를 구하는 방법을 골라 보세요.", parts: [{ o: ["(밑면의 지름)×(원주율)", "(밑면의 반지름)×(원주율)", "(밑면의 지름)×2"], a: 0 }] }],
          { ok: "옆면의 가로는 밑면의 둘레와 같아서 6×3.14=18.84 (cm), 세로는 높이와 같아서 5 cm예요." }),
        (bx, ax) => cy6Ask(bx, ax, [{ q: "밑면의 반지름이 2 cm, 높이가 7 cm인 원기둥이에요. 전개도의 □ 안에 알맞은 수를 써넣어 보세요.",
          fig: cy6Two(() => cy6Dim({ kind: "cyl", r: 1, h: 3.5, lab: { r: "2 cm", h: "7 cm" }, W: 240, H: 250, maxW: "11em" }), cy6Net({ w: 12.56, h: 7, c: [{ x: 6.28, side: "t", r: 2 }, { x: 6.28, side: "b", r: 2 }] }, { w: "가로 ㉡ cm", h: "세로 ㉢ cm", r: ["반지름 ㉠ cm"] }, 13, "17em")),
          parts: ["㉠ ", { n: 2 }, " cm, ㉡ ", { n: 12.56, why: { "6.28": "반지름에 원주율을 곱했어요. 지름은 2×2=4 (cm)예요.", "4": "지름만 구했어요. 밑면의 둘레는 4×3.14예요." } }, " cm, ㉢ ", { n: 7 }, " cm"] }],
          { ok: "밑면의 반지름은 2 cm, 옆면의 가로는 4×3.14=12.56 (cm), 세로는 높이와 같은 7 cm예요." })]) },
    { name: "그려 보기", inst: "밑면의 반지름이 2.5 cm, 높이가 2 cm인 원기둥의 전개도를 그려 보세요. (원주율 3.14)", hints: ["옆면의 가로는 (2.5×2)×3.14를 계산해요.", "두 밑면이 옆면의 위쪽과 아래쪽에 하나씩 붙어야 접었을 때 겹치지 않아요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => cy6Ask(bx, ax, [{ fig: () => cy6Dim({ kind: "cyl", r: 1.25, h: 1, lab: { r: "2.5 cm", h: "2 cm" }, W: 280, H: 200, maxW: "14em" }),
          parts: ["밑면의 반지름 ", { n: 2.5 }, " cm, 높이 ", { n: 2 }, " cm", h("br"), "옆면의 가로 ", { n: 15.7, why: { "7.85": "반지름에 원주율을 곱했어요. 지름은 2.5×2=5 (cm)예요.", "5": "지름만 구했어요. 둘레는 5×3.14예요." } }, " cm, 옆면의 세로 ", { n: 2 }, " cm", h("br"),
            "밑면은 ", { o: ["합동인 원 2개", "크기가 다른 원 2개"], a: 0 }, ", 옆면은 ", { o: ["직사각형 1개", "직사각형 2개"], a: 0 }, "로 그려요."] }],
          { ok: "옆면의 가로는 5×3.14=15.7 (cm), 세로는 2 cm예요. 밑면은 합동인 원 2개, 옆면은 직사각형 1개예요." }),
        { title: "모눈에 전개도를 그려 보세요.", run: (bx, ax) => cy6NetDraw(bx, ax, { r: 2.5, h: 2,
          ask: [{ q: "그린 전개도를 확인해 보세요. 옳게 그린 점을 모두 골라 보세요.", parts: [{ o: ["밑면은 합동인 원 2개로, 옆면은 직사각형 1개로 그렸어요.", "전개도를 접었을 때 맞닿는 부분의 길이를 같게 그렸어요.", "두 밑면을 옆면의 같은 쪽에 그렸어요."], multi: true, a: [0, 1], why: { "0,1,2": "두 밑면이 같은 쪽에 있으면 접었을 때 겹쳐요. 마주 보는 쪽에 그렸지요?" } }] }],
          ok: "밑면은 합동인 원 2개, 옆면은 직사각형 1개로 그리고, 접었을 때 맞닿는 부분의 길이를 같게 그렸으므로 옳게 그렸어요." }) }]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 원기둥의 전개도에서 길이를 구해 보세요. (원주율 3.14)", hints: ["옆면의 가로 = 밑면의 둘레 = (지름)×3.14", "옆면의 가로를 알면 (가로)÷3.14로 지름을 구해요."],
    render: (b, a) => cy6Chain(b, a, [
      (bx, ax) => cy6Ask(bx, ax, [{ q: "원기둥과 전개도를 보고 □ 안에 알맞은 수를 써넣어 보세요.", fig: cy6Two(() => cy6Dim({ kind: "cyl", r: 1.5, h: 2, lab: { r: "6 cm", h: "8 cm" }, W: 260, H: 220, maxW: "13em" }), cy6Net({ w: 37.68, h: 8, c: [{ x: 18.84, side: "t", r: 6 }, { x: 18.84, side: "b", r: 6 }] }, { w: "가로 ㉡ cm", h: "세로 ㉢ cm", r: ["반지름 ㉠ cm"] }, 6, "17em")),
        parts: ["㉠ ", { n: 6 }, " cm, ㉡ ", { n: 37.68, why: { "18.84": "반지름에 원주율을 곱했어요. 지름 12 cm에 3.14를 곱해요." } }, " cm, ㉢ ", { n: 8 }, " cm"] }], { ok: "반지름 6 cm, 옆면의 가로 12×3.14=37.68 (cm), 세로 8 cm예요." }),
      (bx, ax) => cy6Ask(bx, ax, [{ q: "원기둥의 전개도에서 옆면의 가로가 25.12 cm예요. 밑면의 반지름은 몇 cm인가요?", fig: cy6Net({ w: 25.12, h: 6, c: [{ x: 4, side: "t", r: 4 }, { x: 21, side: "b", r: 4 }] }, { w: "25.12 cm" }, 8, "17em"),
        parts: ["밑면의 지름: 25.12÷3.14 = ", { n: 8 }, " (cm), 밑면의 반지름: ", { n: 4, why: { "8": "8 cm는 지름이에요. 반지름은 지름의 반이에요." } }, " cm"] }], { ok: "25.12÷3.14=8이므로 지름은 8 cm, 반지름은 4 cm예요." }),
      (bx, ax) => cy6Ask(bx, ax, [{ q: "조건을 만족하는 원기둥의 밑면의 지름은 몇 cm인지 구해 보세요.", fig: () => h("div", { class: "cy6box" }, "• 전개도에서 옆면의 가로와 세로의 합은 51.96 cm예요.", h("br"), "• 전개도에서 옆면의 세로는 8 cm예요."),
        parts: ["옆면의 가로: 51.96 − 8 = ", { n: 43.96 }, " (cm)", h("br"), "밑면의 지름: 43.96 ÷ 3.14 = ", { n: 14, why: { "7": "7 cm는 반지름이에요. 가로÷3.14는 지름이에요." } }, " (cm)"] }], { ok: "옆면의 가로는 51.96−8=43.96 (cm)이고, 밑면의 지름은 43.96÷3.14=14 (cm)예요." })]) }
},
{
  id: "t5", no: 5, title: "원뿔을 알아볼까요", soop: "개념 구축하기(O)",
  question: "원뿔은 어떤 입체도형이고, 무엇으로 이루어져 있을까요?",
  summary: "평평한 면이 원이고 1개인 입체도형을 원뿔이라고 해요. 원뿔에서 평평한 면을 밑면, 옆을 둘러싼 굽은 면을 옆면, 뾰족한 부분의 점을 원뿔의 꼭짓점이라고 해요. 원뿔의 꼭짓점과 밑면의 둘레의 한 점을 이은 선분을 모선, 원뿔의 꼭짓점과 밑면 사이의 거리를 높이라고 해요. 모선은 셀 수 없이 많고 길이가 모두 같아요. 직각삼각형 모양의 종이를 돌리면 원뿔이 만들어져요.",
  steps: [
    { name: "분류하기", inst: "체육 대회가 시작되고 예빈이는 ‘여러 가지 모양의 물건을 찾는 놀이’에 참가했어요. “고깔모자를 찾아보세요.” “고깔모자 찾았다!” 예빈이는 고깔모자, 셔틀콕 보관 통, 러버 콘, 배턴을 찾았어요. 입체도형 가~마를 분류해 보세요.", hints: ["평평한 면을 세어 봐요. 누워 있거나 뒤집혀 있어도 면의 수는 같아요.", "라는 위와 아래에 평평한 면이 2개 있어요."],
      render: (b, a) => cy6Sort(b, a, { bins: ["평평한 면이 원이고 1개인 입체도형", "평평한 면이 원이고 1개가 아닌 입체도형"],
        items: [{ name: "가", fig: cy6Shp("cone"), bin: 0 }, { name: "나", fig: cy6Shp("cylT"), bin: 1, why: "나는 평평한 면이 2개예요." }, { name: "다", fig: cy6Shp("coneL"), bin: 0, why: "다는 누워 있지만 평평한 면이 원이고 1개예요." }, { name: "라", fig: cy6Shp("frus"), bin: 1, why: "라는 평평한 면이 2개예요(크기가 다른 원 2개)." }, { name: "마", fig: cy6Shp("coneD"), bin: 0, why: "마는 뒤집혀 있지만 평평한 면이 원이고 1개예요." }],
        ask: [{ q: "평평한 면이 원이고 1개인 입체도형의 특징을 모두 골라 보세요.", parts: [{ o: ["평평한 면이 원이고 1개예요.", "뾰족한 부분이 있어요.", "굽은 면이 있어요.", "평평한 면이 2개예요."], multi: true, a: [0, 1, 2] }] }],
        ok: "가, 다, 마는 평평한 면이 원이고 1개예요. 뾰족한 부분과 굽은 면이 있어요." }) },
    { name: "약속하기", inst: "평평한 면이 원이고 1개인 물건을 찾고, 원뿔을 약속해 보세요.", hints: ["뾰족한 부분이 있고 평평한 원 모양의 면이 1개인 물건을 찾아요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => cy6Pick(bx, ax, { q: "평평한 면이 원이고 1개인 물건을 모두 골라 보세요.", items: [{ name: "고깔모자", fig: () => cy6ObjFig("hat") }, { name: "셔틀콕 보관 통", fig: () => cy6ObjFig("tube") }, { name: "러버 콘", fig: () => cy6ObjFig("rcone") }, { name: "배턴", fig: () => cy6ObjFig("baton") }, { name: "폭죽", fig: () => cy6ObjFig("popper") }], a: [0, 2, 4],
          whyExtra: () => "그 물건은 평평한 면이 2개인 원기둥 모양이에요.", ok: "고깔모자, 러버 콘, 폭죽은 평평한 면이 원이고 1개예요." }),
        (bx, ax) => blanks(bx, ax, ["고깔모자, 러버 콘, 폭죽 등과 같이 평평한 면이 ", { o: ["원", "사각형", "삼각형"], a: 0 }, "이고 ", { o: ["1", "2", "3"], a: 0 }, "개인 입체도형을 ", { o: ["원뿔", "원기둥", "각뿔"], a: 0 }, "이라고 해요."], { ok: "평평한 면이 원이고 1개인 입체도형이 원뿔이에요." })]) },
    { name: "색칠하기", inst: "원뿔에서 평평한 면은 빨간색으로 색칠하고, 뾰족한 부분의 점은 파란색으로 표시해 보세요.", hints: ["평평한 면은 아래에 있어요. 원뿔을 위로 돌리면(▲) 잘 보여요.", "색을 바꾼 다음 뾰족한 부분의 점을 눌러요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => cy6Tap(bx, ax, { solid: { kind: "cone", r: 1.2, h: 2.4 }, pens: [CY6_RED, CY6_BLUE], apexTap: true, want: { bot: CY6_RED.c, apex: CY6_BLUE.c },
          why: (k, got, want) => k === "side" ? "옆을 둘러싼 굽은 면은 칠하지 않아요." : k === "bot" ? "평평한 면은 빨간색으로 칠해요. 원뿔을 돌려 아래쪽 면을 찾아요." : "뾰족한 부분의 점은 파란색으로 표시해요.",
          ask: [{ q: "색칠한 면과 만나는 면은 어떤 면인가요?", parts: [{ o: ["굽은 면", "평평한 면", "삼각형 모양의 면"], a: 0 }] }], ok: "평평한 면은 원이고, 색칠한 면과 만나는 면은 굽은 면이에요." }),
        { title: "뾰족한 부분의 점과 평평한 면 사이의 거리를 재어 보세요.", run: (bx, ax) => cy6Ruler(bx, ax, { kind: "cone", r: 2.5, h: 5,
          ask: [{ parts: ["뾰족한 부분의 점과 평평한 면 사이의 거리: ", { n: 5 }, " cm"] }, { q: "어떻게 재었나요?", parts: [{ o: ["뾰족한 부분의 점에서 평평한 면에 수직인 선분의 길이를 자와 삼각자로 재었어요.", "옆면을 따라 비스듬히 재었어요."], a: 0 }] }],
          ok: "뾰족한 부분의 점에서 평평한 면에 수직인 선분의 길이를 재면 돼요." }) }]) },
    { name: "약속하기 ②", inst: "원뿔의 구성 요소를 약속하고, 원뿔에 모선을 그어 보세요.", hints: ["원뿔의 꼭짓점과 밑면의 둘레의 한 점을 이은 선분이 모선이에요.", "둘레의 어느 점과도 이을 수 있어요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["원뿔에서 평평한 면을 ", { o: ["밑면", "옆면", "모선"], a: 0 }, ", 옆을 둘러싼 굽은 면을 ", { o: ["밑면", "옆면", "높이"], a: 1 }, ", 뾰족한 부분의 점을 ", { o: ["원뿔의 꼭짓점", "원의 중심", "모선"], a: 0 }, "이라고 해요. 원뿔의 꼭짓점과 밑면의 둘레의 한 점을 이은 선분을 ", { o: ["모선", "지름", "반지름"], a: 0 }, "이라 하고, 원뿔의 꼭짓점과 밑면 사이의 거리를 ", { o: ["높이", "둘레", "모서리"], a: 0 }, "라고 해요."],
          { ok: "밑면, 옆면, 원뿔의 꼭짓점, 모선, 높이를 약속했어요." }),
        (bx, ax) => cy6Gen(bx, ax, { need: 6,
          ask: [{ parts: ["원뿔에서 모선은 ", { o: ["셀 수 없이 많아요", "1개뿐이에요", "2개예요"], a: 0 }, ". 모선의 길이는 모두 ", { o: ["같아요", "달라요"], a: 0 }, ". 모선과 높이 중에서 더 긴 것은 ", { o: ["모선", "높이"], a: 0, why: { "1": "빨간 점선(높이)과 보라색 선(모선)을 비교해 봐요. 높이는 꼭짓점에서 밑면에 수직으로 내린 길이라서 더 짧아요." } }, "이에요."] }],
          ok: "모선은 셀 수 없이 많고 길이가 모두 같아요. 모선은 높이보다 길어요." }),
        (bx, ax) => quiz(bx, ax, [{ q: "원뿔의 무엇을 재는 것인지 골라 보세요.", fig: () => h("div", { class: "cy6row" }, ...[["h", "가"], ["gen", "나"], ["d", "다"]].map(([t, n]) => h("div", { style: "text-align:center" }, cy6MeasFig(t), h("div", { class: "jua" }, n)))),
          o: ["가 높이 · 나 모선 · 다 밑면의 지름", "가 모선 · 나 높이 · 다 밑면의 지름", "가 높이 · 나 밑면의 지름 · 다 모선"], a: 0 }], { ok: "가는 꼭짓점에서 밑면에 수직인 높이, 나는 옆면을 따라 잰 모선, 다는 삼각자 2개 사이의 밑면의 지름이에요." })]) },
    { name: "돌려 보기", inst: "직각삼각형 모양의 종이를 막대에 붙였어요(8 cm인 변을 막대에 붙였어요). 막대를 돌리면 어떤 입체도형이 만들어지는지 알아보세요.", hints: ["막대를 한 바퀴 다 돌려요.", "밑변(6 cm)은 밑면의 반지름, 가장 긴 변(10 cm)은 모선이 돼요."],
      render: (b, a) => cy6Spin(b, a, { shape: "tri", b: 6, h: 8, labels: [{ at: [3, 0], t: "6 cm", dy: 18 }, { at: [0, 4], t: "8 cm", dx: -32 }, { at: [3, 4], t: "10 cm", dx: 30, dy: -6 }],
        qmarks: [{ a: [-6, 0, 0], b: [6, 0, 0], t: "지름 ?", dy: 36 }],
        ask: [{ parts: ["만들어진 입체도형은 ", { o: ["원뿔이에요.", "원기둥이에요.", "구예요."], a: 0 }] },
          { parts: ["밑면의 지름은 직각삼각형의 ", { o: ["밑변의 길이의 2배", "밑변의 길이", "높이"], a: 0 }, "와 같고, 모선의 길이는 직각삼각형의 ", { o: ["가장 긴 변의 길이", "높이", "밑변의 길이"], a: 0 }, "와 같고, 높이는 직각삼각형의 ", { o: ["높이", "가장 긴 변의 길이"], a: 0 }, "와 같아요."] },
          { parts: ["밑면의 지름: ", { n: 12, why: { "6": "6 cm는 밑면의 반지름이에요. 지름은 6×2=12 (cm)예요." } }, " cm, 모선의 길이: ", { n: 10, why: { "8": "8 cm는 높이예요. 모선은 꼭짓점과 밑면의 둘레를 이은 가장 긴 변이에요." } }, " cm, 높이: ", { n: 8, why: { "10": "10 cm는 모선의 길이예요. 높이는 막대에 붙인 변이에요." } }, " cm"] }],
        ok: "직각삼각형 모양의 종이를 돌리면 원뿔이 만들어져요. 밑면의 지름은 12 cm, 모선의 길이는 10 cm, 높이는 8 cm예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 원뿔을 찾고, 구성 요소와 길이를 알아보세요.", hints: ["모선의 길이는 모두 같아요.", "직각삼각형을 돌리면 기준이 된 변은 높이, 다른 변은 밑면의 반지름이 돼요."],
    render: (b, a) => cy6Chain(b, a, [
      (bx, ax) => cy6Pick(bx, ax, { q: "원뿔을 모두 골라 보세요.", items: [{ name: "가", fig: cy6Shp("pyr4") }, { name: "나", fig: cy6Shp("coneT") }, { name: "다", fig: cy6Shp("cyl") }, { name: "라", fig: cy6Shp("coneL") }], a: [1, 3],
        whyExtra: i => ({ 0: "가는 밑면이 사각형인 사각뿔이에요.", 2: "다는 원기둥이에요." })[i], ok: "나와 라가 원뿔이에요." }),
      (bx, ax) => quiz(bx, ax, [
        { q: "원뿔에서 각 부분의 이름이 잘못된 것을 골라 보세요.", fig: () => cy6PartsFig({ kind: "cone", r: 1.1, h: 2.2, pitch: 18, items: [{ p: "apex", t: "㉠ 원뿔의 꼭짓점", side: "R" }, { p: "h", t: "㉡ 높이" }, { p: "side", t: "㉢ 옆면" }, { p: "bot", t: "㉣ 밑면", side: "R" }, { p: "gen", t: "㉤ 꼭짓점", side: "R" }], W: 460, H: 300 }),
          o: ["㉠", "㉡", "㉢", "㉣", "㉤"], a: 4 },
        { q: "원뿔에 대해 잘못 설명한 사람을 골라 보세요.", o: ["주연: 모선은 셀 수 없이 많아.", "동준: 밑면은 1개이고, 옆면은 굽은 면이야.", "민정: 원뿔에는 꼭짓점이 없어."], a: 2 }],
        { ok: "㉤이 가리키는 선분은 모선이에요. 원뿔에는 원뿔의 꼭짓점이 1개 있으므로 민정이가 잘못 말했어요." }),
      (bx, ax) => cy6Ask(bx, ax, [
        { q: "원뿔의 모선 하나의 길이가 10 cm예요. ㉠의 길이는 몇 cm인가요?", fig: () => cy6Dim({ kind: "cone", r: 1.2, h: 1.6, lab: { d: "12 cm", h: "8 cm", gen: "10 cm" }, W: 300, H: 240, after2: (svg, I) => { const A = I.P([0, 1.6, 0]), q = I.P([-1.2, 0, 0]); cy6Seg(svg, A, q, { stroke: CY6.purple, "stroke-width": 3 }); cy6T(svg, (A[0] + q[0]) / 2 - 18, (A[1] + q[1]) / 2, "㉠", 16, { fill: CY6.purple }); } }),
          parts: ["㉠: ", { n: 10, why: { "8": "8 cm는 높이예요. ㉠은 모선이에요.", "12": "12 cm는 밑면의 지름이에요." } }, " cm"] },
        { q: "직각을 낀 두 변이 14 cm, 8 cm인 직각삼각형 모양의 종이를 14 cm인 변을 기준으로 돌렸어요. 만들어진 입체도형의 밑면의 지름은 몇 cm인가요?", fig: () => cy6Flat({ shape: "tri", b: 8, h: 14, s: 10, labels: [{ at: [4, 0], t: "8 cm", dy: 14 }, { at: [0, 7], t: "14 cm", dx: -28 }] }),
          parts: ["밑면의 지름: ", { n: 16, why: { "8": "8 cm는 밑면의 반지름이에요.", "28": "14 cm인 변은 기준이 된 변이라서 높이가 돼요." } }, " cm"] },
        { q: "원기둥의 높이는 15 cm, 원뿔의 높이는 12 cm예요. 두 입체도형의 높이의 차는 몇 cm인가요?", fig: cy6Two(() => cy6Dim({ kind: "cyl", r: .8, h: 1.5, lab: { h: "15 cm" }, W: 200, H: 200, maxW: "10em", s: 80, cx: 80, cy: 100 }), () => cy6Dim({ kind: "cone", r: .9, h: 1.2, lab: { h: "12 cm" }, W: 200, H: 200, maxW: "10em", s: 80, cx: 110, cy: 112 })),
          parts: ["높이의 차: ", { n: 3 }, " cm"] }],
        { ok: "모선의 길이는 모두 같아서 ㉠은 10 cm예요. 밑면의 지름은 8×2=16 (cm), 높이의 차는 15−12=3 (cm)예요." })]) }
},
{
  id: "t6", no: 6, title: "구를 알아볼까요", soop: "개념 구축하기(O)",
  question: "구는 어떤 입체도형이고, 무엇으로 이루어져 있을까요?",
  summary: "탁구공, 배구공, 농구공 등과 같은 입체도형을 구라고 해요. 구에서 가장 안쪽에 있는 점을 구의 중심, 구의 중심과 구의 겉면의 한 점을 이은 선분을 구의 반지름이라고 해요. 구의 겉면의 두 점을 이은 선분이 구의 중심을 지날 때 이 선분을 구의 지름이라고 해요. 구의 중심은 1개이고, 구의 반지름은 길이가 모두 같아요. 반원 모양의 종이를 돌리면 구가 만들어져요.",
  steps: [
    { name: "공 살펴보기", inst: "체육관 곳곳에서 경기를 하고 있어요. 탁구에서는 공을 쳐서 넘기고, 피구에서는 공을 던지고, 농구에서는 골대에 공을 넣어요. 경기에서 사용한 공의 모양을 살펴보세요.", hints: ["크기와 색깔처럼 공마다 다른 점은 빼고 생각해요.", "평평한 면이나 뾰족한 부분이 있는지 살펴봐요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => cy6Ask(bx, ax, [{ fig: () => h("div", { class: "cy6cards", style: "grid-template-columns:repeat(3,minmax(0,1fr));max-width:30em" }, ...[["pingpong", "탁구공"], ["volley", "배구공"], ["basket", "농구공"]].map(([k, n]) => h("div", { class: "cy6card", style: "cursor:default" }, cy6ObjFig(k), h("div", {}, n)))),
          q: "탁구공, 배구공, 농구공의 공통점을 모두 골라 보세요.", parts: [{ o: ["굽은 면으로만 이루어져 있어요.", "평평한 면이 없어요.", "뾰족한 부분이 없어요.", "크기가 모두 같아요.", "색깔이 모두 같아요."], multi: true, a: [0, 1, 2],
            why: { "0,1,2,3": "공마다 크기가 달라요. 모양에서 같은 점만 골라요.", "0,1,2,4": "공마다 색깔이 달라요. 모양에서 같은 점만 골라요.", "0,1,2,3,4": "크기와 색깔은 공마다 달라요." } }] }], { ok: "세 공은 모두 굽은 면으로만 이루어져 있고, 평평한 면과 뾰족한 부분이 없어요." }),
        (bx, ax) => blanks(bx, ax, ["탁구공, 배구공, 농구공 등과 같은 입체도형을 ", { o: ["구라고", "원이라고", "원뿔이라고"], a: 0 }, " 해요."], { ok: "탁구공, 배구공, 농구공 등과 같은 입체도형이 구예요." })]) },
    { name: "중심 찾기", inst: "구를 반으로 자른 단면에서 구의 가장 안쪽에 있는 점을 찾고, 그 점과 겉면을 이어 보세요.", hints: ["가까운 겉면과 먼 겉면까지의 거리가 같아지는 곳이 가장 안쪽이에요.", "단면의 한가운데로 점을 옮겨요."],
      render: (b, a) => cy6Probe(b, a, { R: 5,
        ask: [{ q: "찾은 점과 선분을 무엇이라고 하면 좋을까요?", parts: ["구의 가장 안쪽에 있는 점: ", { o: ["구의 중심", "구의 꼭짓점", "구의 밑면"], a: 0 }, h("br"), "가장 안쪽에 있는 점과 겉면의 한 점을 이은 선분: ", { o: ["구의 반지름", "구의 모선", "구의 높이"], a: 0 }] },
          { parts: ["가장 안쪽에 있는 점과 겉면의 한 점을 이은 선분의 길이는 ", { o: ["모두 같아요", "모두 달라요"], a: 0 }, "."] }],
        ok: "구의 가장 안쪽에 있는 점은 구의 중심이고, 중심과 겉면을 이은 선분은 길이가 모두 같아요." }) },
    { name: "약속하기", inst: "구의 구성 요소를 약속하고, 그림에서 찾아보세요.", hints: ["구의 중심과 겉면의 한 점을 이으면 반지름이에요.", "겉면의 두 점을 이은 선분이 중심을 지나면 지름이에요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => blanks(bx, ax, ["구에서 가장 안쪽에 있는 점을 ", { o: ["구의 중심", "구의 꼭짓점"], a: 0 }, "이라고 해요. 구의 중심과 구의 겉면의 한 점을 이은 선분을 ", { o: ["구의 반지름", "구의 지름"], a: 0 }, "이라 하고, 구의 겉면의 두 점을 이은 선분이 구의 중심을 지날 때 이 선분을 ", { o: ["구의 반지름", "구의 지름"], a: 1 }, "이라고 해요."],
          { ok: "구의 중심, 구의 반지름, 구의 지름을 약속했어요." }),
        (bx, ax) => cy6Ask(bx, ax, [{ q: "㉠, ㉡, ㉢의 이름을 골라 보세요.", fig: () => cy6PartsFig({ kind: "sph", r: 1, items: [{ p: "c", t: "㉠" }, { p: "r", t: "㉡", side: "R" }, { p: "d", t: "㉢" }] }),
          parts: ["㉠ ", { o: ["구의 중심", "구의 반지름", "구의 지름"], a: 0 }, "  ㉡ ", { o: ["구의 중심", "구의 반지름", "구의 지름"], a: 1 }, "  ㉢ ", { o: ["구의 중심", "구의 반지름", "구의 지름"], a: 2 }] },
          { q: "원의 반지름이 셀 수 없이 많았던 것처럼, 구의 반지름은 몇 개일까요?", parts: [{ o: ["셀 수 없이 많아요", "1개뿐이에요", "2개예요"], a: 0 }] }],
          { ok: "구의 중심은 1개이고, 구의 반지름과 지름은 셀 수 없이 많아요." })]) },
    { name: "돌려 보기", inst: "지름이 10 cm인 반원 모양의 종이를 막대에 붙였어요(지름을 막대에 붙였어요). 막대를 돌리면 어떤 입체도형이 만들어지는지 알아보세요.", hints: ["막대를 한 바퀴 다 돌려요.", "반원의 반지름은 10÷2=5 (cm)예요."],
      render: (b, a) => cy6Spin(b, a, { shape: "semi", d: 10, labels: [{ at: [0, 5], t: "10 cm", dx: -36 }], qmarks: [{ a: [0, 5, 0], b: [5, 5, 0], t: "반지름 ?", dy: -16 }],
        ask: [{ parts: ["만들어진 입체도형은 ", { o: ["구예요.", "원기둥이에요.", "원뿔이에요."], a: 0 }, " 만들어진 입체도형의 반지름은 ", { o: ["반원의 반지름", "반원의 지름"], a: 0 }, "과 같아요."] },
          { parts: ["만들어진 입체도형의 반지름: ", { n: 5, why: { "10": "10 cm는 반원의 지름이에요. 반지름은 10÷2=5 (cm)예요." } }, " cm"] }],
        ok: "반원 모양의 종이를 돌리면 구가 만들어져요. 구의 반지름은 반원의 반지름과 같은 5 cm예요." }) },
    { name: "문제 만들기", inst: "우리 주변에서 찾은 원기둥, 원뿔, 구 모양의 물건(물통, 폭죽, 막대 사탕)을 보고 알아맞히기를 하려고 해요. 시후: “굽은 면으로만 이루어진 입체도형 모양의 물건은 무엇일까?” 은채: “설명하는 입체도형은 구 모양이니까 막대 사탕이야.” 시후와 같이 문제를 만들어 보세요.", hints: ["답이 될 물건의 모양을 먼저 정해요.", "답이 하나만 나오도록 설명을 골라요."],
      render: (b, a) => cy6Riddle(b, a, { objs: ["bottle", "popper", "candy"],
        ask: [{ q: "친구가 만든 문제를 풀어 보세요.", parts: ["밑면이 2개이고 합동인 원으로 이루어진 입체도형 모양의 물건: ", { o: ["물통", "폭죽", "막대 사탕"], a: 0 }, h("br"), "평평한 면이 원이고 1개인 입체도형 모양의 물건: ", { o: ["물통", "폭죽", "막대 사탕"], a: 1 }, h("br"), "평평한 면이 없는 입체도형 모양의 물건: ", { o: ["물통", "폭죽", "막대 사탕"], a: 2 }] }],
        ok: "물통은 원기둥, 폭죽은 원뿔, 막대 사탕은 구 모양이에요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 구를 찾고, 구의 성질과 길이를 알아보세요. (원주율 3.14)", hints: ["구의 반지름은 지름의 반이에요.", "구를 앞에서 본 모양은 원이고, 그 원의 지름은 구의 지름과 같아요."],
    render: (b, a) => cy6Chain(b, a, [
      (bx, ax) => cy6Pick(bx, ax, { q: "구를 모두 골라 보세요.", items: [{ name: "가", fig: cy6Shp("sphS") }, { name: "나", fig: cy6Shp("cylW") }, { name: "다", fig: cy6Shp("coneT") }, { name: "라", fig: cy6Shp("sph") }], a: [0, 3], ok: "가와 라가 구예요." }),
      (bx, ax) => quiz(bx, ax, [{ q: "구에 대해 옳게 설명한 것을 골라 보세요.", o: ["㉠ 구의 반지름은 구의 겉면의 두 점을 이은 선분이에요.", "㉡ 구의 지름은 셀 수 없이 많고, 길이가 모두 달라요.", "㉢ 구의 중심은 1개예요."], a: 2,
        why: { "0": "구의 반지름은 구의 중심과 겉면의 한 점을 이은 선분이에요.", "1": "구의 지름은 셀 수 없이 많지만 길이는 모두 같아요." } }], { ok: "구의 중심은 1개예요." }),
      (bx, ax) => cy6Ask(bx, ax, [
        { q: "구의 반지름은 몇 cm인가요?", fig: () => cy6Dim({ kind: "sph", r: 1, lab: { d: "26 cm" }, W: 240, H: 200, maxW: "12em", bw: 0 }), parts: ["반지름: ", { n: 13, why: { "26": "26 cm는 구의 지름이에요. 반지름은 지름의 반이에요." } }, " cm"] },
        { q: "지름이 14 cm인 반원 모양의 종이를 지름을 기준으로 돌렸어요. 만들어진 입체도형의 반지름은 몇 cm인가요?", fig: () => cy6Flat({ shape: "semi", d: 14, s: 10, labels: [{ at: [0, 7], t: "14 cm", dx: -28 }] }), parts: ["반지름: ", { n: 7, why: { "14": "14 cm는 반원의 지름이에요." } }, " cm"] },
        { q: "반지름이 12 cm인 구를 앞에서 본 모양의 둘레는 몇 cm인가요?", fig: () => cy6Dim({ kind: "sph", r: 1, lab: { r: "12 cm" }, W: 240, H: 200, maxW: "12em", bw: 0 }), parts: ["둘레: ", { n: 75.36, why: { "37.68": "반지름에 원주율을 곱했어요. 앞에서 본 원의 지름은 24 cm예요." } }, " cm"] }],
        { ok: "반지름은 26÷2=13 (cm), 14÷2=7 (cm)이에요. 구를 앞에서 본 모양은 지름이 24 cm인 원이라서 둘레는 24×3.14=75.36 (cm)예요." })]) }
},
{
  id: "t78", no: "7~8", title: "생각을 더하다 ― 공학 도구를 사용하여 원기둥, 원뿔, 구를 살펴볼까요", soop: "탐구 정리하기(O)",
  question: "원기둥, 원뿔, 구를 여러 방향에서 보면 어떤 모양일까요?",
  summary: "원기둥을 앞·뒤·왼쪽·오른쪽에서 보면 직사각형, 위·아래에서 보면 원이에요. 원뿔을 앞·뒤·왼쪽·오른쪽에서 보면 삼각형, 위·아래에서 보면 원이에요. 구는 어느 방향에서 보아도 원이에요. 세 입체도형은 모두 위에서 본 모양이 원이에요.",
  steps: [
    { name: "만들어 보기", inst: "공학 도구(알지오매스 키즈)를 사용하여 원기둥, 원뿔, 구를 만들어 보세요. 이 화면은 공학 도구를 흉내 낸 연습판이에요.", hints: ["도구 단추를 먼저 누르고 바닥을 눌러요.", "원기둥, 원뿔, 구를 하나씩 만들어요."],
      render: (b, a) => cy6Make(b, a, { ok: "공학 도구로 원기둥, 원뿔, 구를 만들었어요." }) },
    { name: "원기둥 살펴보기", inst: "만든 원기둥을 앞쪽, 뒤쪽, 왼쪽, 오른쪽, 위쪽, 아래쪽에서 차례로 살펴보세요.", hints: ["방향 단추 6개를 모두 눌러 봐요.", "앞·뒤·왼쪽·오른쪽에서 본 모양은 모두 같아요."],
      render: (b, a) => cy6View(b, a, { solid: { kind: "cyl", r: 1, h: 1.8, fill: { side: "#DCEAFB", top: "#9CC3F0", bot: "#9CC3F0" } },
        ask: [{ parts: ["원기둥을 앞·뒤·왼쪽·오른쪽에서 본 모양은 ", { o: ["직사각형", "원", "삼각형"], a: 0 }, "이고, 위·아래에서 본 모양은 ", { o: ["원", "직사각형", "삼각형"], a: 0 }, "이에요."] }],
        ok: "원기둥은 앞·뒤·왼쪽·오른쪽에서 보면 직사각형, 위·아래에서 보면 원이에요." }) },
    { name: "원뿔 살펴보기", inst: "만든 원뿔을 여섯 방향에서 살펴보세요.", hints: ["옆에서 보면 뾰족한 꼭짓점이 위에 보여요.", "위에서 보면 꼭짓점이 가운데 점으로 보여요."],
      render: (b, a) => cy6View(b, a, { solid: { kind: "cone", r: 1, h: 2, fill: { side: "#FDE3D3", bot: "#F6B38E" } },
        ask: [{ parts: ["원뿔을 앞·뒤·왼쪽·오른쪽에서 본 모양은 ", { o: ["삼각형", "원", "직사각형"], a: 0 }, "이고, 위·아래에서 본 모양은 ", { o: ["원", "삼각형", "직사각형"], a: 0 }, "이에요."] },
          { q: "원뿔을 앞에서 본 삼각형은 어떤 삼각형인가요?", parts: [{ o: ["이등변삼각형", "직각삼각형", "세 변의 길이가 모두 다른 삼각형"], a: 0 }] }],
        ok: "원뿔은 앞·뒤·왼쪽·오른쪽에서 보면 이등변삼각형, 위·아래에서 보면 원이에요." }) },
    { name: "구 살펴보기", inst: "만든 구를 여섯 방향에서 살펴보세요.", hints: ["어느 방향에서 보아도 같은 모양인지 살펴봐요."],
      render: (b, a) => cy6View(b, a, { solid: { kind: "sph", r: 1, fill: { side: "#DDEDE5" } },
        ask: [{ parts: ["구를 여섯 방향에서 본 모양은 모두 ", { o: ["원", "직사각형", "삼각형"], a: 0 }, "이고, 크기가 ", { o: ["모두 같아요", "모두 달라요"], a: 0 }, "."] }],
        ok: "구는 어느 방향에서 보아도 모양과 크기가 같은 원이에요." }) },
    { name: "표 완성하기", inst: "원기둥, 원뿔, 구를 위, 앞, 옆(오른쪽)에서 본 모양을 표로 정리해 보세요.", hints: ["옆은 오른쪽에서 본 모양이에요.", "세 입체도형을 위에서 본 모양은 모두 같아요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => { const O = ["원", "직사각형", "삼각형"], row = (n, ans) => [h("b", {}, n + " — "), "위: ", { o: O, a: ans[0] }, "  앞: ", { o: O, a: ans[1] }, "  옆: ", { o: O, a: ans[2] }];
          cy6Ask(bx, ax, [{ parts: row("원기둥", [0, 1, 1]) }, { parts: row("원뿔", [0, 2, 2]) }, { parts: row("구", [0, 0, 0]) }], { ok: "원기둥: 원·직사각형·직사각형, 원뿔: 원·삼각형·삼각형, 구: 원·원·원이에요." }); },
        (bx, ax) => writeStep(bx, ax, [{ q: "위, 앞, 옆에서 본 모양을 비교해 공통점과 차이점을 써 보세요.", tag: "공통점과 차이점", ph: "예) 세 입체도형 모두 위에서 본 모양은 원이에요. 앞과 옆에서 본 모양은 원기둥은 직사각형, 원뿔은 삼각형, 구는 원으로 달라요." }])]) }
  ],
  challenge: { inst: "여러 방향에서 본 모양을 보고 입체도형을 알아맞혀 보세요.", hints: ["앞에서 본 모양이 삼각형이면 원뿔, 직사각형이면 원기둥이에요.", "앞에서 본 직사각형의 가로는 밑면의 지름, 세로는 높이예요."],
    render: (b, a) => cy6Chain(b, a, [
      (bx, ax) => quiz(bx, ax, [
        { q: "위에서 본 모양은 원이고, 앞에서 본 모양은 삼각형인 입체도형은 무엇인가요?", o: ["원뿔", "원기둥", "구"], a: 0 },
        { q: "어느 방향에서 보아도 모양이 같은 입체도형은 무엇인가요?", o: ["구", "원기둥", "원뿔"], a: 0 },
        { q: "앞에서 본 모양이 직사각형이고 위에서 본 모양이 원인 입체도형은 무엇인가요?", o: ["원기둥", "원뿔", "구"], a: 0 }], { ok: "원뿔, 구, 원기둥이에요." }),
      (bx, ax) => cy6Ask(bx, ax, [{ q: "밑면의 지름이 10 cm인 원기둥을 앞에서 본 모양이 정사각형이에요. 이 원기둥의 높이는 몇 cm인가요?", parts: ["높이: ", { n: 10, why: { "5": "앞에서 본 직사각형의 가로는 반지름이 아니라 밑면의 지름(10 cm)이에요." } }, " cm"] }],
        { ok: "앞에서 본 모양의 가로는 밑면의 지름 10 cm이고, 정사각형이라서 높이도 10 cm예요." })]) }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 입체도형의 이름을 외치고 확인해요", soop: "발표하기(P)",
  question: "카드의 내용이 외친 입체도형과 관계가 있는지 어떻게 알 수 있을까요?",
  summary: "카드에 나온 물건이나 성질이 원기둥, 원뿔, 구 중 어느 것과 관계가 있는지 알아야 해요. 밑면이 2개이면 원기둥, 꼭짓점이 1개이고 모선이 있으면 원뿔, 평평한 면이 없으면 구예요. 여러 입체도형과 관계있는 카드도 있어요. 외치는 순서를 잘못 말하지 않도록 주의해요.",
  steps: [
    { name: "놀이 방법", inst: "4명이 하는 놀이예요. 가위바위보로 놀이 순서를 정하고, 놀이를 하는 사람들의 카드를 모두 모아 섞은 후 가운데에 뒤집어 쌓아 두어요. 놀이 방법을 순서대로 눌러 보세요.", hints: ["먼저 외치는 순서를 정해요.", "카드를 가장 많이 가져온 사람이 이겨요."],
      render: (b, a) => sequence(b, a, ["① 원기둥, 원뿔, 구를 외치는 순서를 정해요.", "② 쌓아 둔 카드를 한 장 뒤집어 자신의 앞에 놓으며, 정한 순서에 따라 원기둥, 원뿔, 구 중 하나를 외쳐요.", "③ 카드의 내용이 외친 입체도형과 관계가 있으면 사람들 앞에 놓인 카드를 모두 가져와요. 관계가 없거나 순서에 맞지 않게 외치면 옆 사람에게 차례가 넘어가요.", "④ 쌓아 둔 카드가 없을 때까지 되풀이해요. 카드를 가장 많이 가져온 사람이 이겨요."], [0, 1, 2, 3],
        { ok: "순서 정하기 → 뒤집으며 외치기 → 관계가 있으면 가져오기 → 끝까지 되풀이하기 순서예요." }) },
    { name: "카드 살펴보기", inst: "놀이 카드에 어떤 내용이 있는지 살펴봐요. (교과서 준비물 카드 대신 이 앱이 만든 카드예요.) 카드마다 관계가 있는 입체도형을 모두 골라 보세요.", hints: ["물건 카드는 그 물건의 모양을 생각해요.", "‘굽은 면이 있어요.’처럼 세 입체도형 모두와 관계있는 카드도 있어요."],
      render: (b, a) => cy6CardCheck(b, a, { ids: [0, 7, 6, 9, 12, 17, 18, 19], ok: "카드 내용이 어느 입체도형과 관계가 있는지 알아보았어요. 여러 입체도형과 관계있는 카드도 있어요." }) },
    { name: "놀이하기", inst: "컴퓨터 친구 3명과 놀이해요. 내 차례가 되면 카드를 뒤집고, 정한 순서에 맞게 외친 뒤, 카드가 외친 입체도형과 관계가 있으면 ‘가져갈게!’, 없으면 ‘네 차례야.’를 눌러요.", hints: ["외치는 순서는 차례가 넘어가도 이어져요. 앞 사람이 무엇을 외쳤는지 잘 들어요.", "카드를 가져가려면 카드의 내용이 외친 입체도형과 관계가 있어야 해요."],
      render: (b, a) => cy6Shout(b, a, {}) },
    { name: "또 다른 놀이", inst: "3명이 하는 또 다른 놀이예요. 카드를 한 장 뒤집어 나온 입체도형을 보고, 순서대로 그 입체도형 모양의 물건을 한 개씩 말해요. 더 이상 말하지 못하는 사람이 그 카드를 가져가고, 카드를 가장 적게 가진 사람이 이겨요.", hints: ["이미 말한 물건은 다시 말할 수 없어요.", "말할 수 있는 물건이 남아 있는지 잘 살펴봐요."],
      render: (b, a) => cy6NameGame(b, a, {}) },
    { name: "돌아보기", inst: "놀이를 돌아보며 생각을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 이기려면 어떻게 하면 좋을까요?", tag: "이기는 방법", ph: "예) 카드 내용이 어떤 입체도형과 관계가 있는지 알아야 하고, 외치는 순서를 잘못 말하지 않도록 주의해요." },
        { q: "카드가 외친 입체도형과 관계가 있는지 어떻게 알았나요?", tag: "알아본 방법", ph: "예) 밑면의 수, 꼭짓점이 있는지, 평평한 면이 있는지를 떠올렸어요." }]) }
  ],
  challenge: { inst: "놀이 상황을 보고 답해 보세요.", hints: ["원뿔의 성질을 떠올려요: 밑면 1개, 꼭짓점 1개, 모선, 굽은 면.", "정한 순서를 이어서 외쳐요."],
    render: (b, a) => cy6Chain(b, a, [
      (bx, ax) => cy6Pick(bx, ax, { q: "“원뿔!”을 외쳤어요. 카드를 가져갈 수 있는 카드를 모두 골라 보세요.", cardW: "9em",
        items: [9, 12, 18, 1, 19, 4].map((id, i) => ({ name: "①②③④⑤⑥"[i], fig: () => cy6CardFace(CY6_CARDS[id]) })), a: [1, 2, 3],
        whyExtra: i => ({ 0: "①은 원기둥과 관계가 있어요.", 4: "원뿔에는 꼭짓점이 1개 있어요.", 5: "탁구공은 구 모양이에요." })[i], ok: "모선, 굽은 면, 고깔모자 카드는 원뿔과 관계가 있어요." }),
      (bx, ax) => quiz(bx, ax, [{ q: "외치는 순서를 ‘원뿔, 원기둥, 구’로 정했어요. 앞 사람이 ‘원기둥’을 외쳤다면 나는 무엇을 외쳐야 할까요?", o: ["구", "원뿔", "원기둥"], a: 0 }], { ok: "원뿔 → 원기둥 → 구 순서이므로 원기둥 다음에는 구를 외쳐요." })]) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "원기둥, 원뿔, 구와 원기둥의 전개도에 대해 무엇을 알게 되었나요?",
  summary: "원기둥은 두 면이 평행하고 합동인 원으로 이루어진 입체도형이고, 원기둥에서 두 밑면 사이의 거리를 높이라고 해요. 원기둥을 잘라서 평면 위에 펼쳐 놓은 그림이 원기둥의 전개도이고, 옆면의 가로는 밑면의 둘레, 세로는 높이와 같아요. 원뿔은 평평한 면이 원이고 1개인 입체도형이에요. 구에서 가장 안쪽에 있는 점을 구의 중심이라고 해요.",
  steps: [
    { name: "1번", inst: "원기둥, 원뿔, 구를 각각 모두 찾아 상자에 담아 보세요.", hints: ["두 면이 평행하고 합동인 원 → 원기둥, 평평한 면이 원이고 1개 → 원뿔, 굽은 면으로만 → 구", "평평한 두 원의 크기가 다르면 원기둥이 아니에요."],
      render: (b, a) => cy6Sort(b, a, { bins: ["원기둥", "원뿔", "구", "어느 것도 아니에요"],
        items: [{ name: "가", fig: cy6Shp("cyl"), bin: 0 }, { name: "나", fig: cy6Shp("frus"), bin: 3, why: "나는 평평한 면이 2개이지만 두 원이 합동이 아니에요. 그래서 원기둥도 원뿔도 아니에요." }, { name: "다", fig: cy6Shp("sph"), bin: 2 }, { name: "라", fig: cy6Shp("cylL"), bin: 0, why: "라는 누워 있는 원기둥이에요." }, { name: "마", fig: cy6Shp("cone"), bin: 1 }],
        ok: "원기둥은 가, 라, 원뿔은 마, 구는 다예요. 나는 두 원이 합동이 아니라서 원기둥이 아니고, 평평한 면이 2개라서 원뿔도 아니에요." }) },
    { name: "2번", inst: "보기에서 알맞은 말을 골라 □ 안에 써넣어 보세요. 보기: 옆면, 밑면, 높이, 모선, 원뿔의 꼭짓점", hints: ["원기둥의 평행하고 합동인 두 면은 밑면이에요.", "원뿔의 꼭짓점과 밑면의 둘레의 한 점을 이은 선분은 모선이에요."],
      render: (b, a) => { const O = ["옆면", "밑면", "높이", "모선", "원뿔의 꼭짓점"];
        cy6Ask(b, a, [{ fig: () => cy6PartsFig({ kind: "cyl", r: 1, h: 1.9, items: [{ p: "top", t: "㉠" }, { p: "h", t: "㉡", side: "R" }, { p: "side", t: "㉢" }] }), parts: ["원기둥 — ㉠ ", { o: O, a: 1 }, "  ㉡ ", { o: O, a: 2 }, "  ㉢ ", { o: O, a: 0 }] },
          { fig: () => cy6PartsFig({ kind: "cone", r: 1.1, h: 2.2, items: [{ p: "apex", t: "㉣", side: "R" }, { p: "gen", t: "㉤", side: "R" }, { p: "h", t: "㉥" }] }), parts: ["원뿔 — ㉣ ", { o: O, a: 4 }, "  ㉤ ", { o: O, a: 3, why: { "2": "㉤은 꼭짓점과 밑면의 둘레를 이은 선분이에요. 높이는 꼭짓점과 밑면 사이의 거리예요." } }, "  ㉥ ", { o: O, a: 2, why: { "3": "㉥은 꼭짓점에서 밑면에 수직으로 내린 선분이라서 높이예요." } }] }],
          { ok: "원기둥: ㉠ 밑면, ㉡ 높이, ㉢ 옆면 / 원뿔: ㉣ 원뿔의 꼭짓점, ㉤ 모선, ㉥ 높이예요." }); } },
    { name: "3번", inst: "□ 안에 알맞은 수를 써넣어 보세요.", hints: ["원뿔의 밑면의 지름은 반지름의 2배예요.", "구의 지름은 반지름의 2배예요."],
      render: (b, a) => cy6Ask(b, a, [
        { fig: () => cy6Dim({ kind: "cone", r: 1.25, h: 3, lab: { r: "5 cm", h: "12 cm", gen: "13 cm" }, W: 300, H: 250 }), parts: ["밑면의 지름 ", { n: 10, why: { "5": "5 cm는 밑면의 반지름이에요. 지름은 5×2예요." } }, " cm, 모선의 길이 ", { n: 13, why: { "12": "12 cm는 높이예요." } }, " cm, 높이 ", { n: 12, why: { "13": "13 cm는 모선의 길이예요." } }, " cm"] },
        { fig: () => cy6Dim({ kind: "sph", r: 1, lab: { r: "4 cm" }, W: 240, H: 200, maxW: "12em", bw: 0 }), parts: ["구의 반지름 ", { n: 4 }, " cm, 구의 지름 ", { n: 8, why: { "4": "지름은 반지름의 2배예요." } }, " cm"] }],
        { ok: "원뿔: 밑면의 지름 10 cm, 모선 13 cm, 높이 12 cm / 구: 반지름 4 cm, 지름 8 cm예요." }) },
    { name: "4번", inst: "소민이의 일기(12월 10일): “친구에게 테니스공 2개를 선물 받았다. 지름이 6 cm인 테니스공 2개를 꼭 맞게 넣을 수 있는 원기둥 모양의 통을 만들려고 한다.” 전개도의 옆면의 세로와 가로는 각각 몇 cm로 그려야 할까요? (원주율 3.14)", hints: ["통의 높이는 공 2개의 지름의 합, 밑면의 지름은 공의 지름과 같아요.", "옆면의 세로 = 통의 높이, 옆면의 가로 = 밑면의 둘레"],
      render: (b, a) => cy6Tube(b, a, { d: 6,
        ask: [{ q: "이해해요 · 계획해요", parts: ["통의 높이는 공 2개의 ", { o: ["지름의 합", "반지름의 합", "지름"], a: 0 }, "과 같고, 통의 밑면의 지름은 공의 ", { o: ["지름", "반지름"], a: 0 }, "과 같아요."] },
          { q: "해결해요", parts: ["옆면의 세로: 6 × 2 = ", { n: 12, why: { "6": "공이 2개라서 통의 높이는 6×2예요." } }, " (cm)", h("br"), "옆면의 가로: 6 × 3.14 = ", { n: 18.84, why: { "9.42": "반지름(3 cm)에 원주율을 곱했어요. 밑면의 지름은 6 cm예요.", "37.68": "통의 높이에 원주율을 곱했어요. 가로는 밑면의 둘레예요." } }, " (cm)"] }],
        ok: "옆면의 세로는 통의 높이인 12 cm, 옆면의 가로는 밑면의 둘레인 6×3.14=18.84 (cm)로 그려야 해요." }) },
    { name: "5번·정리", inst: "원기둥, 원뿔, 구에 대해 잘못 설명한 사람을 찾아 옳게 고치고, 단원을 정리해 보세요.", hints: ["원기둥에는 꼭짓점이 없어요.", "원뿔에만 꼭짓점이 있어요."],
      render: (b, a) => cy6Chain(b, a, [
        (bx, ax) => quiz(bx, ax, [
          { q: "잘못 설명한 사람을 골라 보세요.", o: ["승우: 원기둥과 원뿔은 밑면이 있어.", "하윤: 원기둥, 원뿔, 구는 모두 굽은 면이 있어.", "재민: 원기둥과 원뿔은 꼭짓점이 있지만 구는 없어."], a: 2 },
          { q: "잘못 설명한 내용을 옳게 고친 것을 골라 보세요.", o: ["원뿔은 꼭짓점이 있지만 원기둥과 구는 없어.", "원기둥, 원뿔, 구는 모두 꼭짓점이 있어.", "원기둥은 꼭짓점이 있지만 원뿔과 구는 없어."], a: 0 }],
          { ok: "재민이가 잘못 말했어요. 원뿔은 꼭짓점이 있지만 원기둥과 구는 꼭짓점이 없어요." }),
        (bx, ax) => blanks(bx, ax, ["원기둥에서 두 밑면 사이의 거리를 ", { o: ["높이", "둘레", "모서리"], a: 0 }, "라고 해요. 원기둥을 잘라서 평면 위에 펼쳐 놓은 그림을 원기둥의 ", { o: ["전개도", "겨냥도"], a: 0 }, "라고 해요. 원뿔은 평평한 면이 원이고 ", { o: ["1", "2", "3"], a: 0 }, "개인 입체도형이에요. 구에서 가장 안쪽에 있는 점을 ", { o: ["구의 중심", "구의 반지름", "원뿔의 꼭짓점"], a: 0 }, "이라고 해요."],
          { ok: "높이, 전개도, 1, 구의 중심을 정리했어요." }),
        (bx, ax) => writeStep(bx, ax, [{ q: "이 단원에서 기억에 남는 내용을 글, 그림, 기호 등 나만의 방법으로 정리해 보세요.", tag: "기억에 남는 내용", ph: "예) 원기둥의 전개도에서 옆면의 가로는 (밑면의 지름)×3.14예요. 원뿔은 꼭짓점이 1개, 구는 중심이 1개예요." }])]) }
  ],
  challenge: { inst: "단원 종합 문제예요. 원기둥의 전개도를 찾고, 옆면의 둘레를 구해 보세요. (원주율 3.14)", hints: ["두 밑면이 합동이고 옆면의 마주 보는 두 변에 하나씩 붙어 있어야 해요.", "옆면은 직사각형이라서 둘레는 (가로+세로)×2예요."],
    render: (b, a) => cy6Chain(b, a, [
      (bx, ax) => cy6Pick(bx, ax, { q: "원기둥의 전개도를 모두 골라 보세요.", cardW: "9.5em", items: [
          { name: "가", fig: cy6Net({ w: 6.28, h: 2, c: [{ x: 5.2, side: "t", r: 1 }, { x: 5.2, side: "b", r: 1 }] }, null, 13, "100%", [6.6, 7.2]) },
          { name: "나", fig: cy6Net({ w: 6.28, h: 2, c: [{ x: 1.5, side: "t", r: 1 }, { x: 4.5, side: "b", r: .7 }] }, null, 13, "100%", [6.6, 7.2]) },
          { name: "다", fig: cy6Net({ w: 6.28, h: 3, c: [{ x: 4.8, side: "t", r: 1 }, { x: 1.4, side: "b", r: 1 }] }, null, 13, "100%", [6.6, 7.2]) },
          { name: "라", fig: cy6Net({ w: 6.28, h: 2, c: [{ x: 1.4, side: "b", r: 1 }, { x: 4.8, side: "b", r: 1 }] }, null, 13, "100%", [6.6, 7.2]) }], a: [0, 2],
        whyExtra: i => ({ 1: "나는 두 원의 크기가 달라 합동이 아니에요.", 3: "라는 두 밑면이 같은 쪽에 있어 접으면 겹쳐요." })[i], ok: "가와 다는 원기둥의 전개도예요." }),
      (bx, ax) => cy6Ask(bx, ax, [{ q: "밑면의 반지름이 5 cm, 높이가 10 cm인 원기둥의 전개도에서 옆면의 둘레는 몇 cm인가요?", fig: () => cy6Dim({ kind: "cyl", r: 1.25, h: 2.5, lab: { r: "5 cm", h: "10 cm" }, W: 260, H: 230, maxW: "13em" }),
        parts: ["옆면의 가로: 10 × 3.14 = ", { n: 31.4, why: { "15.7": "반지름에 원주율을 곱했어요. 지름은 10 cm예요." } }, " (cm)", h("br"), "옆면의 둘레: (31.4 + 10) × 2 = ", { n: 82.8, why: { "41.4": "직사각형의 둘레는 가로와 세로를 2번씩 더해요." } }, " (cm)"] }],
        { ok: "옆면의 가로는 10×3.14=31.4 (cm), 둘레는 (31.4+10)×2=82.8 (cm)예요." })]) }
}
];
