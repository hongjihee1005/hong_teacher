//@@APP
const APP={title:"꿈의 쉼터 설계 공모전", unit:"6-1 수학 2. 각기둥과 각뿔", key:"s61-prism-v1", welcome:"꿈의 쉼터 설계 공모전에 온 것을 환영해요", intro:"햇살초등학교 6학년 3반이 학교 뒤뜰 ‘꿈의 쉼터’ 설계 공모전에 도전해요. 공모 조건에 맞는 기둥을 고르며 각기둥을 알아보고, 기둥 재료를 세고, 텐트 천을 잘라 펼쳐 설계도(전개도)를 모눈에 그리고, 지붕과 조명 갓으로 각뿔을 알아봐요. 모서리 막대와 꼭짓점 이음새의 수를 정해 재료 주문서를 쓰고, 놀이와 설계 발표회로 마무리해요."};
//@@UNIT
/* =========================================================
   6-1 수학 2. 각기둥과 각뿔 — 이야기 버전 단원 조작 부품 (앞글자 pp6)
   교과서 버전(u2-prism.tb.js)의 pp6 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   기다리는 시간: 입력칸 900ms(Enter는 blur) · 보기·카드 고르기 260~700ms · 색칠·표시·그리기 1200ms.
   한 계단에 활동이 둘이면(hj-multi) 부품 함수 몸통에 done( 이 있어야 활동으로 세어져요 — 부품마다 api.done 경로를 적어 둠.
   입체도형은 3차원 좌표로 계산해서 그려요(정사영). 축은 위쪽(y), 앞쪽이 +z.
   전개도는 입체도형의 면을 실제로 펼쳐서(pp6Unfold) 만들고, 접어 보기(pp6FoldPts)도 같은 계산으로 해요.
   모눈에 그린 전개도는 pp6Judge가 입체도형의 면과 하나하나 맞춰 보아 채점해요(겹침·맞닿는 선분의 길이·면의 수).
   pp6Fig      입체도형 그림(각기둥·각뿔·뿔대·원기둥, 눕히기·돌리기, 꼭짓점 이름)
   pp6Turnable 돌려 볼 수 있는 입체도형 판           pp6Tap     면을 눌러 색칠하기(밑면·옆면 찾기, 면 이름)
   pp6Parts    모서리·꼭짓점·각뿔의 꼭짓점 표시하기    pp6Ruler   자와 삼각자로 높이 재기
   pp6Columns  주상 절리 윗면 살펴보기                pp6Make    공학 도구처럼 각기둥·각뿔 만들고 문제 만들기
   pp6FoldView 상자를 잘라 펼치기·접기(움직이는 그림)  pp6NetMark 전개도에 ◯·△ 표시하기
   pp6NetPairs 맞닿는 선분끼리 같은 색 칠하기          pp6NetJudge 전개도가 될 수 있는 것 찾기(예상 → 접어 보기)
   pp6NetDraw  모눈에 전개도 그리기(점을 찍어 면 그리기)   pp6NetFaces 접었을 때 만나는 면 찾기
   pp6Skeleton 이쑤시개·스타이로폼 공 모형 세기       pp6PlusGame 구성 요소의 수 더하고 빼기 놀이(이 앱이 정한 카드)
   pp6CodeGame 암호 놀이                            pp6Self    스스로 평가하기
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.pp6fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none}
.pp6fig.pp6plain{background:transparent;border:none}
.pp6small{font-size:var(--fs-s);color:var(--muted)}
.pp6part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.pp6read{font-family:"Jua",sans-serif;font-size:var(--fs);color:var(--night);line-height:1.5;word-break:keep-all;min-height:1.5em}
.pp6row{display:flex;flex-wrap:wrap;gap:.6em;align-items:flex-start}
.pp6row>div{flex:1 1 13em;min-width:0}
.pp6box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all;margin:.3em 0}
.pp6hit{cursor:pointer}
.pp6btns{display:flex;flex-wrap:wrap;gap:.35em;align-items:center;margin:.3em 0}
.pp6btns button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em;min-height:2.2em;font-family:"Jua",sans-serif}
.pp6btns button.pp6-pick{background:var(--night);color:#fff;border-color:var(--night)}
.pp6btns button.pp6-seen{border-color:var(--ok);background:#E3F4EA}
.pp6cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(8em,1fr));gap:.5em;margin:.4em 0}
.pp6card{border:2.5px solid var(--line);background:#fff;border-radius:12px;padding:.25em;text-align:center;cursor:pointer;min-width:0;font-family:"Jua",sans-serif;position:relative;word-break:keep-all}
.pp6card svg{width:100%;height:auto;display:block}
.pp6card.pp6-pick{border-color:var(--ring);background:#EAF3FD;box-shadow:0 0 0 2px var(--ring) inset}
.pp6card.pp6-good{border-color:var(--ok);background:#E3F4EA}
.pp6card.pp6-bad{border-color:var(--no);background:#FBE7E2}
.pp6card.pp6-guess::after{content:"예상";position:absolute;top:.2em;right:.3em;font-size:.75em;background:#FFD27A;border-radius:999px;padding:0 .45em}
.pp6bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(10.5em,1fr));gap:.5em;margin:.4em 0}
.pp6bin{border:2.5px dashed #B9C6D3;border-radius:12px;padding:.3em;min-height:7em;background:#FAFBFC;cursor:pointer;min-width:0}
.pp6bin.pp6-ready{border-color:var(--ring);background:#EEF5FD}
.pp6bin .pp6bh{font-family:"Jua",sans-serif;font-size:var(--fs-s);margin:.1em .2em .3em;word-break:keep-all}
.pp6bin .pp6cards{grid-template-columns:repeat(auto-fill,minmax(5.2em,1fr));gap:.3em;margin:0}
.pp6tray{border:2px solid var(--line);border-radius:12px;padding:.3em;background:#fff;min-height:3em}
.pp6slider{display:flex;align-items:center;gap:.5em;flex-wrap:wrap;margin:.3em 0}
.pp6slider input[type=range]{flex:1 1 10em;min-width:6em}
.pp6tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.pp6tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.pp6tbl th,.pp6tbl td{border:1.5px solid var(--line);padding:.25em .5em;text-align:center}
.pp6tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.pp6tbl input{width:3.2em;text-align:center;font-size:1em}
.pp6gc{border:3px solid #C9B48A;border-radius:14px;background:#FFFDF6;padding:.3em;text-align:center;font-family:"Jua",sans-serif;min-width:0;word-break:keep-all;display:flex;flex-direction:column;justify-content:center;min-height:7.5em;position:relative}
.pp6gc svg{width:100%;height:auto;display:block;max-height:6em}
.pp6gc .pp6gt{font-size:1em;line-height:1.3;padding:.1em .2em}
.pp6gc .pp6sg{position:absolute;top:.15em;left:.35em;font-size:1.5em;line-height:1}
.pp6gc .pp6mk{font-size:.62em;color:#9A8660;margin-top:.1em}
.pp6gc.pp6-back{background:repeating-linear-gradient(45deg,#EDE3CB,#EDE3CB 8px,#E2D4B2 8px,#E2D4B2 16px);color:transparent}
.pp6gc.pp6-on{border-color:var(--ring);box-shadow:0 0 0 3px var(--ring) inset;cursor:pointer}
.pp6gc.pp6-dim{opacity:.45}
.pp6hand{display:grid;grid-template-columns:repeat(auto-fill,minmax(8.5em,1fr));gap:.5em;margin:.4em 0}
.pp6table{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.4em;margin:.3em 0}
.pp6pl{border:2px solid var(--line);border-radius:10px;padding:.25em .3em;background:#fff;text-align:center;font-family:"Jua",sans-serif;font-size:var(--fs-s);min-width:0}
.pp6pl.pp6-turn{border-color:var(--ring);box-shadow:0 0 0 2px var(--ring) inset}
.pp6pl.pp6-out{opacity:.5}
.pp6big{font-family:"Jua",sans-serif;font-size:calc(var(--fs) * 1.6);color:var(--night);text-align:center}
.pp6chip{display:inline-block;border:2px solid var(--line);border-radius:999px;background:#fff;padding:.1em .7em;margin:.15em;cursor:pointer;font-family:"Jua",sans-serif;font-size:var(--fs-s)}
.pp6chip.pp6-pick{background:var(--night);color:#fff;border-color:var(--night)}
.pp6say{display:inline-block;background:#EAF3FD;border:2px solid #B5D2F2;border-radius:14px;padding:.25em .7em;margin:.2em 0;font-family:"Jua",sans-serif;word-break:keep-all}
.pp6self{display:grid;gap:.4em;margin:.4em 0}
.pp6self>div{border:2px solid var(--line);border-radius:12px;padding:.35em .6em;background:#fff}
`;
  document.head.append(s);
})();

/* ---------- 작은 도우미 ---------- */
const PP6 = { ink: "#1D2A2A", gray: "#8795A1", hid: "#7C8A96", blue: "#2B7BD6", red: "#D64545", green: "#2E8B57", org: "#E47A38", purple: "#7A5BB0", gold: "#E3A21A",
  side: "#E6EEF7", base: "#F7C9A3", sideN: "#FFF1C7", baseN: "#9CC3F0", stick: "#C08A3E", ball: "#FFFFFF" };
const PP6_D = Math.PI / 180;
const PP6_GA = ["가", "나", "다", "라", "마", "바"];
const PP6_KO = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥"];
const PP6_JA = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ".split("");
/* 받침에 따라 조사 고르기: pp6Jo("삼각기둥", "이/가") → "삼각기둥이" */
function pp6Jo(w, pair) {
  const s = String(w), [a, b] = pair.split("/"), c = s.trim().slice(-1);
  let bat = false, rieul = false;
  if (/[0-9]/.test(c)) { bat = "0136780".includes(c); rieul = "178".includes(c); }
  else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  else if (/[ㄱ-ㅎ]/.test(c)) { bat = true; rieul = c === "ㄹ"; }
  if (pair === "으로/로") return s + (bat && !rieul ? "으로" : "로");
  return s + (bat ? a : b);
}
function pp6Num(s) {
  const t = String(s == null ? "" : s).replace(/[\s,]/g, "").replace(/(센티미터|cm|개|번)$/i, "");
  return t === "" || !/^-?\d+(\.\d+)?$/.test(t) ? NaN : Number(t);
}
const pp6Go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
function pp6Shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pp6T(svg, x, y, t, size, attrs) { const e = txt(pp6R(x), pp6R(y), t, size || 16, Object.assign({ stroke: "#fff", "stroke-width": 4, "paint-order": "stroke", "stroke-linejoin": "round", "pointer-events": "none" }, attrs || {})); svg.append(e); return e; }
function pp6Seg(svg, p, q, attrs) { const e = svgEl("line", Object.assign({ x1: pp6R(p[0]), y1: pp6R(p[1]), x2: pp6R(q[0]), y2: pp6R(q[1]), stroke: PP6.ink, "stroke-width": 2, "stroke-linecap": "round", "pointer-events": "none" }, attrs || {})); svg.append(e); return e; }
function pp6Dot(svg, p, r, fill) { const e = svgEl("circle", { cx: pp6R(p[0]), cy: pp6R(p[1]), r: r || 4, fill: fill || PP6.ink, "pointer-events": "none" }); svg.append(e); return e; }
const pp6Pts = A => A.map(p => pp6R(p[0]) + "," + pp6R(p[1])).join(" ");
function pp6Hull(P) {
  const p = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 1e-9) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 1e-9) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up);
}
/* ---------- 다면체 계산(각기둥·각뿔·전개도) — 화면과 상관없는 계산 ---------- */
const PP6_EPS = 1e-6;
const pp6R = v => Math.round(v * 100) / 100;
const pp6Sub = (a, b) => a.map((x, i) => x - b[i]);
const pp6Dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const pp6Crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const pp6Len = a => Math.hypot(...a);
const pp6Unit = a => { const l = pp6Len(a); return a.map(x => x / l); };
/* 바닥 다각형 base [[x,z]…](위에서 보아 차례대로)와 높이 H */
const pp6Cen = base => { const n = base.length, cx = base.reduce((s, p) => s + p[0], 0) / n, cz = base.reduce((s, p) => s + p[1], 0) / n; return base.map(([x, z]) => [x - cx, z - cz]); };
function pp6Prism(base0, H) {
  const base = pp6Cen(base0), n = base.length, V = base.map(([x, z]) => [x, 0, z]).concat(base.map(([x, z]) => [x, H, z]));
  const F = [base.map((_, i) => i), base.map((_, i) => n + i)];
  for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]);
  return pp6Orient({ V, F, n, kind: "prism", H });
}
function pp6Pyramid(base0, H, apex) {
  const base = pp6Cen(base0), n = base.length, V = base.map(([x, z]) => [x, 0, z]).concat([[apex ? apex[0] : 0, H, apex ? apex[1] : 0]]);
  const F = [base.map((_, i) => i)]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n]);
  return pp6Orient({ V, F, n, kind: "pyr", H });
}
/* 뿔대(각뿔을 밑면에 평행하게 자른 모양): 윗면은 밑면을 k배로 줄인 것 */
function pp6Frustum(base, H, k) {
  const n = base.length, cx = base.reduce((s, p) => s + p[0], 0) / n, cz = base.reduce((s, p) => s + p[1], 0) / n;
  const P = pp6Prism(base, H); P.V = P.V.map((v, i) => i < n ? v : [cx + (v[0] - cx) * k, H, cz + (v[2] - cz) * k]); P.kind = "frus"; return pp6Orient(P);
}
function pp6Ngon(n, r, rot) { return Array.from({ length: n }, (_, i) => { const t = (rot == null ? -90 : rot) * Math.PI / 180 + i * 2 * Math.PI / n; return [r * Math.cos(t), r * Math.sin(t)]; }); }
/* 면의 차례를 바깥에서 보아 시계 반대 방향으로 맞추고, 면마다 평면 좌표(L)·바깥 방향(N)을 구함 */
function pp6Orient(S) {
  const V = S.V, cen = V.reduce((s, v) => s.map((x, i) => x + v[i] / V.length), [0, 0, 0]);
  S.N = []; S.L = [];
  S.F = S.F.map((f, fi) => {
    let n = [0, 0, 0]; f.forEach((a, j) => { const p = V[a], q = V[f[(j + 1) % f.length]]; n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]); });
    const fc = f.reduce((s, a) => s.map((x, i) => x + V[a][i] / f.length), [0, 0, 0]);
    let g = f.slice(); if (pp6Dot3(n, pp6Sub(fc, cen)) < 0) { g = f.slice().reverse(); n = n.map(x => -x); }
    n = pp6Unit(n); S.N[fi] = n;
    const o = V[g[0]], u = pp6Unit(pp6Sub(V[g[1]], o)), w = pp6Crs(n, u);
    S.L[fi] = g.map(a => { const d = pp6Sub(V[a], o); return [pp6Dot3(d, u), pp6Dot3(d, w)]; });
    return g;
  });
  S.E = new Map(); S.F.forEach((f, fi) => f.forEach((a, j) => { const b = f[(j + 1) % f.length], k = Math.min(a, b) + "-" + Math.max(a, b); (S.E.get(k) || S.E.set(k, []).get(k)).push(fi); }));
  return S;
}
const pp6EK = (a, b) => Math.min(a, b) + "-" + Math.max(a, b);
/* 이웃한 두 면이 접힌 각(바깥 방향끼리의 각) */
const pp6FoldAng = (S, f, g) => Math.acos(Math.max(-1, Math.min(1, pp6Dot3(S.N[f], S.N[g]))));
/* 두 점을 두 점에 맞추는 옮기기(돌리기+밀기) */
function pp6Rigid(a0, a1, b0, b1) {
  const ta = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]), tb = Math.atan2(b1[1] - b0[1], b1[0] - b0[0]), t = tb - ta, c = Math.cos(t), s = Math.sin(t);
  return p => [b0[0] + c * (p[0] - a0[0]) - s * (p[1] - a0[1]), b0[1] + s * (p[0] - a0[0]) + c * (p[1] - a0[1])];
}
/* 전개도 만들기: nodes [{f, p}] (f 면 번호, p 부모 마디 번호, 뿌리는 -1) — 같은 면을 두 번 써도 됨(잘못된 전개도) */
function pp6Unfold(S, nodes, rootRot) {
  const out = [];
  nodes.forEach((nd, i) => {
    const f = S.F[nd.f], L = S.L[nd.f];
    if (nd.p < 0) { const c = Math.cos(rootRot || 0), s = Math.sin(rootRot || 0); out[i] = { f: nd.f, ids: f.slice(), P: L.map(([x, y]) => [x * c - y * s, x * s + y * c]), p: -1 }; return; }
    const par = out[nd.p], pf = par.ids;
    let a = -1, b = -1;
    for (let j = 0; j < pf.length; j++) { const u = pf[j], v = pf[(j + 1) % pf.length]; const k = f.indexOf(v); if (k >= 0 && f[(k + 1) % f.length] === u) { a = j; b = k; break; } }
    if (a < 0) throw new Error("이웃하지 않은 면을 붙였어요: " + nd.f + " ← " + par.f);
    const Pa = par.P[a], Pb = par.P[(a + 1) % pf.length];       // 부모의 u→v
    const T = pp6Rigid(L[(b + 1) % f.length], L[b], Pa, Pb);     // 자식의 u(=b+1), v(=b)
    out[i] = { f: nd.f, ids: f.slice(), P: L.map(T), p: nd.p, hinge: [Pa, Pb], ang: pp6FoldAng(S, nd.f, par.f) };
  });
  return out;
}
/* 볼록 다각형 둘이 겹치는지(맞닿기만 하면 겹치지 않음) */
function pp6Overlap(A, B) {
  for (const P of [A, B]) for (let i = 0; i < P.length; i++) {
    const p = P[i], q = P[(i + 1) % P.length], nx = q[1] - p[1], ny = p[0] - q[0], l = Math.hypot(nx, ny);
    const pr = Q => Q.map(r => (r[0] * nx + r[1] * ny) / l), a = pr(A), b = pr(B);
    if (Math.min(Math.max(...a), Math.max(...b)) - Math.max(Math.min(...a), Math.min(...b)) < 1e-6) return false;
  }
  return true;
}
function pp6Area(P) { let s = 0; P.forEach((p, i) => { const q = P[(i + 1) % P.length]; s += p[0] * q[1] - q[0] * p[1]; }); return s / 2; }
/* 다각형 다듬기: 같은 점·한 직선 위의 점을 빼고 시계 반대 방향으로 */
function pp6Clean(P) {
  let Q = P.filter((p, i) => { const q = P[(i + 1) % P.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6; });
  let ch = true;
  while (ch && Q.length >= 3) { ch = false; for (let i = 0; i < Q.length; i++) { const a = Q[(i + Q.length - 1) % Q.length], b = Q[i], c = Q[(i + 1) % Q.length];
    if (Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) < 1e-6) { Q.splice(i, 1); ch = true; break; } } }
  if (Q.length >= 3 && pp6Area(Q) < 0) Q.reverse();
  return Q;
}
function pp6Convex(P) { if (P.length < 3) return false; let sg = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], c = P[(i + 2) % P.length], cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if (Math.abs(cr) < 1e-9) continue; if (!sg) sg = Math.sign(cr); else if (Math.sign(cr) !== sg) return false; } return true; }
const pp6Same = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-4;
/* 전개도 판정: polys(평면 다각형, 시계 반대 방향)가 입체 S의 전개도가 될 수 있는지
   돌려주는 것 {ok, why: "count"|"apart"|"part"|"len"|"dup"|"shape", map} */
function pp6Judge(S, polys0) {
  const best = { why: "shape", n: -1 };
  for (let i = 0; i < polys0.length; i++) for (let k = i + 1; k < polys0.length; k++) if (pp6Overlap(polys0[i], polys0[k])) return { ok: false, why: "flat" };
  for (const mir of [false, true]) {
    const polys = polys0.map(P => { const Q = mir ? P.map(([x, y]) => [-x, y]).reverse() : P.slice(); return Q; });
    const m = polys.length;
    // 이웃(접는 선): 같은 선분을 반대 방향으로 가진 두 다각형
    const adj = polys.map(() => []);
    let partial = false;
    for (let i = 0; i < m; i++) for (let j = 0; j < polys[i].length; j++) { const p = polys[i][j], q = polys[i][(j + 1) % polys[i].length];
      for (let k = 0; k < m; k++) { if (k === i) continue; for (let l = 0; l < polys[k].length; l++) { const r = polys[k][l], s = polys[k][(l + 1) % polys[k].length];
        if (pp6Same(p, s) && pp6Same(q, r)) adj[i].push({ j, k, l });
        else { // 한 직선 위에서 일부만 맞닿음
          const cr = (u, v, w) => (v[0] - u[0]) * (w[1] - u[1]) - (v[1] - u[1]) * (w[0] - u[0]);
          if (Math.abs(cr(p, q, r)) < 1e-6 && Math.abs(cr(p, q, s)) < 1e-6) { const dx = q[0] - p[0], dy = q[1] - p[1], L2 = dx * dx + dy * dy, t1 = ((r[0] - p[0]) * dx + (r[1] - p[1]) * dy) / L2, t2 = ((s[0] - p[0]) * dx + (s[1] - p[1]) * dy) / L2;
            if (Math.min(1, Math.max(t1, t2)) - Math.max(0, Math.min(t1, t2)) > 1e-6) partial = true; } } } } }
    const reach = new Set([0]), st = [0]; while (st.length) { const i = st.pop(); adj[i].forEach(e => { if (!reach.has(e.k)) { reach.add(e.k); st.push(e.k); } }); }
    if (reach.size < m) { const w = partial ? "part" : "apart"; if (best.n < 0) { best.why = w; best.n = 0; } continue; }
    // 면을 하나씩 맞춰 봄
    const fit = (P, fi, off) => { const L = S.L[fi], n = L.length; if (P.length !== n) return false; const T = pp6Rigid(L[off % n], L[(off + 1) % n], P[0], P[1]); return L.every((_, j) => pp6Same(T(L[(j + off) % n]), P[j])); };
    for (let f0 = 0; f0 < S.F.length; f0++) for (let o0 = 0; o0 < S.F[f0].length; o0++) {
      if (!fit(polys[0], f0, o0)) continue;
      const map = [], used = new Map(); map[0] = { f: f0, o: o0 }; used.set(f0, 0);
      const q = [0], par = [-1]; let why = null, cnt = 1;
      while (q.length && !why) { const i = q.shift(), mi = map[i], fi = S.F[mi.f], n = fi.length;
        for (const e of adj[i]) { const va = fi[(e.j + mi.o) % n], vb = fi[(e.j + 1 + mi.o) % n];
          const H = (S.E.get(pp6EK(va, vb)) || []).find(x => x !== mi.f); const fh = S.F[H], nh = fh.length;
          const kk = fh.indexOf(va), oo = ((kk - (e.l + 1)) % nh + nh) % nh;   // 이웃 다각형의 (l+1)번째 점 = va
          if (fh[(e.l + oo) % nh] !== vb) { why = "shape"; break; }
          if (!fit(polys[e.k], H, oo)) { why = polys[e.k].length === nh ? "len" : "shape"; break; }
          if (map[e.k]) { if (map[e.k].f !== H || map[e.k].o !== oo) { why = "dup"; break; } continue; }
          if (used.has(H)) { why = "dup"; break; }
          map[e.k] = { f: H, o: oo }; used.set(H, e.k); par[e.k] = i; q.push(e.k); cnt++; }
      }
      if (!why && cnt === m && m === S.F.length) return { ok: true, map, mir, par };
      if (!why) why = m < S.F.length ? "count" : "dup";
      if (cnt > best.n) { best.n = cnt; best.why = why; }
    }
  }
  return { ok: false, why: best.why };
}
/* 접는 그림: 전개도 마디(unfold 결과)를 t(0 펼침 ~ 1 접힘)만큼 접은 3차원 점 */
function pp6FoldPts(nodes, t) {
  const M = [];
  const rot = (A, B, ang) => { const d = pp6Unit([B[0] - A[0], B[1] - A[1], 0]), c = Math.cos(ang), s = Math.sin(ang), [x, y, z] = d;
    const R = [[c + x * x * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s], [y * x * (1 - c) + z * s, c + y * y * (1 - c), y * z * (1 - c) - x * s], [z * x * (1 - c) - y * s, z * y * (1 - c) + x * s, c + z * z * (1 - c)]];
    const a = [A[0], A[1], 0]; return p => { const q = pp6Sub(p, a); return [0, 1, 2].map(i => a[i] + R[i][0] * q[0] + R[i][1] * q[1] + R[i][2] * q[2]); }; };
  nodes.forEach((nd, i) => { if (nd.p < 0) { M[i] = p => p; return; } const r = rot(nd.hinge[0], nd.hinge[1], nd.ang * t), pm = M[nd.p]; M[i] = p => pm(r(p)); });
  return nodes.map((nd, i) => nd.P.map(([x, y]) => M[i]([x, y, 0])));
}
/* 구성 요소의 수 */
const PP6_KN = ["", "", "", "삼각", "사각", "오각", "육각", "칠각", "팔각", "구각", "십각"];
const pp6Cnt = (kind, n) => kind === "prism" ? { face: n + 2, edge: 3 * n, vert: 2 * n, side: n, base: 2 } : { face: n + 1, edge: 2 * n, vert: n + 1, side: n, base: 1 };
const pp6Name = (kind, n) => PP6_KN[n] + (kind === "prism" ? "기둥" : "뿔");

/* =========================================================
   입체도형 그리기
   o: solid(pp6Prism·pp6Pyramid·pp6Frustum 결과) 또는 kind "cyl"(r, h)
      yaw, pitch(기본 22), tilt(눕히기: z축 둘레 각도)
      s(1의 픽셀, 없으면 box에 맞춤), cx·cy, box [x,y,w,h], pad, maxS
      fc[면 번호]=색, side(기본 면 색), hidden "dash"|"none", sw
      tapF·tapE·tapV(누를 곳), ecol{"a-b":색}, vcol{번호:색}, lab[번호]=꼭짓점 이름, labCol
   돌려주는 것: {P(3차원 점)→[x,y], S2(꼭짓점 화면 자리), vis(보이는 면), Z(방향→앞쪽 값)}
   ========================================================= */
function pp6Draw(svg, o) {
  const ct = Math.cos((o.tilt || 0) * PP6_D), st = Math.sin((o.tilt || 0) * PP6_D);
  const ca = Math.cos((o.yaw || 0) * PP6_D), sa = Math.sin((o.yaw || 0) * PP6_D);
  const pb = (o.pitch == null ? 22 : o.pitch) * PP6_D, cb = Math.cos(pb), sb = Math.sin(pb);
  const S = o.solid, cyl = o.kind === "cyl", r = o.r || 1, hh = cyl ? o.h : 0;
  const ys = cyl ? [0, hh] : S.V.map(v => v[1]), mid = o.mid != null ? o.mid : (Math.max(...ys) + Math.min(...ys)) / 2;
  const rotV = (v, pt) => {
    const x = v[0], y = v[1] - (pt ? mid : 0), z = v[2];
    const x1 = x * ct - y * st, y1 = x * st + y * ct;
    const x3 = x1 * ca + z * sa, z3 = -x1 * sa + z * ca;
    return [x3, y1 * cb - z3 * sb, y1 * sb + z3 * cb];
  };
  const Zn = n => rotV(n, false)[2];
  const N = 72, TH = Array.from({ length: N }, (_, i) => i * 2 * Math.PI / N);
  const samples = cyl ? [0, hh].flatMap(y => TH.map(t => [r * Math.cos(t), y, r * Math.sin(t)])) : S.V;
  const Q = samples.map(p => rotV(p, true));
  let sc, mx = 0, my = 0, cx, cy;
  if (o.s) { sc = o.s; cx = o.cx; cy = o.cy; }
  else {
    const [bx, by, bw, bh] = o.box || [0, 0, 300, 240], pad = o.pad == null ? (o.lab ? 34 : 16) : o.pad;
    const xs = Q.map(q => q[0]), yy = Q.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...yy), y1 = Math.max(...yy);
    sc = Math.min((bw - 2 * pad) / Math.max(x1 - x0, 1e-6), (bh - 2 * pad) / Math.max(y1 - y0, 1e-6)); if (o.maxS) sc = Math.min(sc, o.maxS);
    mx = (x0 + x1) / 2; my = (y0 + y1) / 2; cx = bx + bw / 2; cy = by + bh / 2;
  }
  const scr = q => [cx + sc * (q[0] - mx), cy - sc * (q[1] - my)];
  const P = p => scr(rotV(p, true));
  const g = svgEl("g"); svg.append(g);
  const sw = o.sw || 2.4, HID = o.hidden || "dash";
  const info = { P, Z: Zn, S: sc, rotV };
  const hit = (e, k) => { e.classList.add("pp6hit"); e.dataset.k = k; return e; };
  if (cyl) {
    const sideN = t => [Math.cos(t), 0, Math.sin(t)], sv = t => Zn(sideN(t)) > 1e-6;
    const rims = [{ k: "bot", y: 0, n: [0, -1, 0] }, { k: "top", y: hh, n: [0, 1, 0] }];
    rims.forEach(R => { R.vis = Zn(R.n) > 1e-6; R.S = TH.map(t => P([r * Math.cos(t), R.y, r * Math.sin(t)])); });
    const hull = pp6Hull(samples.map(P));
    rims.forEach(R => { if (!R.vis) g.append(svgEl("polygon", { points: pp6Pts(R.S), fill: o.top || PP6.baseN, "fill-opacity": .3, stroke: "none" })); });
    g.append(svgEl("polygon", { points: pp6Pts(hull), fill: o.side || PP6.side, stroke: "none" }));
    rims.forEach(R => { if (R.vis) g.append(svgEl("polygon", { points: pp6Pts(R.S), fill: o.top || PP6.baseN, stroke: "none" })); });
    const dH = [], dV = [];
    rims.forEach(R => { for (let i = 0; i < N; i++) { const j = (i + 1) % N, vis = R.vis || sv(TH[i] + Math.PI / N); (vis ? dV : dH).push(`M${pp6R(R.S[i][0])} ${pp6R(R.S[i][1])}L${pp6R(R.S[j][0])} ${pp6R(R.S[j][1])}`); } });
    if (HID !== "none" && dH.length) g.append(svgEl("path", { d: dH.join(""), stroke: PP6.hid, "stroke-width": 1.6, "stroke-dasharray": "6 5", fill: "none", "pointer-events": "none" }));
    g.append(svgEl("polygon", { points: pp6Pts(hull), fill: "none", stroke: PP6.ink, "stroke-width": sw, "stroke-linejoin": "round", "pointer-events": "none" }));
    g.append(svgEl("path", { d: dV.join(""), stroke: PP6.ink, "stroke-width": sw, fill: "none", "pointer-events": "none" }));
    info.hull = hull; return info;
  }
  const V = S.V, F = S.F, S2 = V.map(P), fc = o.fc || [];
  const fv = S.N.map(n => Zn(n) > 1e-6);
  info.S2 = S2; info.vis = fv;
  if (o.skel) return info;
  F.forEach((f, i) => { if (!fv[i] && fc[i] && HID !== "none") g.append(svgEl("polygon", { points: pp6Pts(f.map(k => S2[k])), fill: fc[i], "fill-opacity": .3, stroke: "none", "pointer-events": "none" })); });
  F.forEach((f, i) => { if (!fv[i]) return; const e = svgEl("polygon", { points: pp6Pts(f.map(k => S2[k])), fill: fc[i] || o.side || PP6.side, "fill-opacity": .95, stroke: "none" }); g.append(o.tapF ? hit(e, "f" + i) : e); });
  const E = [...S.E.keys()].map(k => { const [a, b] = k.split("-").map(Number); return { k, a, b, v: S.E.get(k).some(fi => fv[fi]) }; });
  const ecol = o.ecol || {}, vcol = o.vcol || {};
  E.sort((x, y) => x.v - y.v).forEach(e => {
    const col = ecol[e.k];
    if (!e.v && HID === "none" && !col) return;
    pp6Seg(g, S2[e.a], S2[e.b], e.v ? { stroke: col || o.ink || PP6.ink, "stroke-width": col ? sw + 1.6 : sw } : { stroke: col || PP6.hid, "stroke-width": col ? 2.6 : 1.6, "stroke-dasharray": "6 5" });
  });
  if (o.tapE) E.forEach(e => g.append(hit(svgEl("line", { x1: pp6R(S2[e.a][0]), y1: pp6R(S2[e.a][1]), x2: pp6R(S2[e.b][0]), y2: pp6R(S2[e.b][1]), stroke: "rgba(0,0,0,0)", "stroke-width": 16, "stroke-linecap": "round" }), "e" + e.k)));
  V.forEach((v, i) => { if (vcol[i]) { pp6Dot(g, S2[i], 7, vcol[i]); } });
  if (o.ring != null) g.append(svgEl("circle", { cx: pp6R(S2[o.ring][0]), cy: pp6R(S2[o.ring][1]), r: 14, fill: "none", stroke: PP6.gold, "stroke-width": 3, "pointer-events": "none" }));
  if (o.tapV) V.forEach((v, i) => g.append(hit(svgEl("circle", { cx: pp6R(S2[i][0]), cy: pp6R(S2[i][1]), r: 12, fill: "rgba(0,0,0,0)" }), "v" + i)));
  if (o.lab) { const cxs = S2.reduce((s, p) => s + p[0], 0) / S2.length, cys = S2.reduce((s, p) => s + p[1], 0) / S2.length;
    o.lab.forEach((t, i) => { if (!t) return; const p = S2[i], dx = p[0] - cxs, dy = p[1] - cys, d = Math.hypot(dx, dy) || 1; pp6T(g, p[0] + dx / d * 17, p[1] + dy / d * 17, t, 21, { fill: o.labCol || PP6.blue, "font-weight": 700 }); }); }
  return info;
}
function pp6Fig(o) {
  const W = o.W || 300, H = o.H || 240, svg = makeSvg(W, H);
  svg.setAttribute("class", "pp6fig" + (o.plain ? " pp6plain" : "")); svg.style.maxWidth = o.maxW || "20em";
  const info = pp6Draw(svg, Object.assign({ box: [0, 0, W, H] }, o));
  if (o.after) o.after(svg, info);
  return svg;
}
/* 직각 표시: 꼭짓점 v에서 a·b 방향으로 */
function pp6Right(svg, info, v, a, b, k) {
  const P = info.P, s = k || .28, u = pp6Unit(pp6Sub(a, v)), w = pp6Unit(pp6Sub(b, v));
  const p1 = v.map((x, i) => x + u[i] * s), p3 = v.map((x, i) => x + w[i] * s), p2 = v.map((x, i) => x + (u[i] + w[i]) * s);
  svg.append(svgEl("polyline", { points: pp6Pts([P(p1), P(p2), P(p3)]), fill: "none", stroke: PP6.red, "stroke-width": 1.8, "pointer-events": "none" }));
}

/* ---------- 돌려 볼 수 있는 입체도형 판(끌거나 단추로 돌리기, 누르기) ---------- */
function pp6Turnable(o) {
  const W = o.W || 360, H = o.H || 300, svg = makeSvg(W, H);
  svg.setAttribute("class", "pp6fig"); svg.style.maxWidth = o.maxW || "24em";
  const st = { yaw: o.yaw == null ? -24 : o.yaw, pitch: o.pitch == null ? 22 : o.pitch };
  const opt = () => typeof o.solid === "function" ? o.solid(st) : o.solid;
  const fixS = () => { const s0 = opt(), V = s0.solid.V, ys = V.map(v => v[1]), m = (Math.max(...ys) + Math.min(...ys)) / 2;
    const R = Math.max(...V.map(v => Math.hypot(v[0], v[1] - m, v[2]))); return { s: Math.min(W, H) * (o.fill || .42) / R, cx: W / 2, cy: H / 2 }; };
  let I = null;
  const draw = () => { svg.innerHTML = ""; I = pp6Draw(svg, Object.assign({}, opt(), fixS(), { yaw: st.yaw, pitch: st.pitch })); if (o.after) o.after(svg, I, st); };
  let down = null;
  svg.addEventListener("pointerdown", e => { const p = svgPt(svg, e); down = { p, yaw: st.yaw, pitch: st.pitch, k: e.target && e.target.dataset ? e.target.dataset.k : null, moved: false }; try { svg.setPointerCapture(e.pointerId); } catch (er) { } });
  svg.addEventListener("pointermove", e => { if (!down) return; const p = svgPt(svg, e), dx = p.x - down.p.x, dy = p.y - down.p.y;
    if (!down.moved && Math.hypot(dx, dy) < 7) return; down.moved = true;
    st.yaw = down.yaw + dx * .6; st.pitch = Math.max(-90, Math.min(90, down.pitch + dy * .5)); draw(); o.onTurn && o.onTurn(st); });
  const up = () => { if (!down) return; const d = down; down = null; if (!d.moved && d.k && o.onTap) o.onTap(d.k); };
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", () => { down = null; });
  const turn = (dy, dp) => { st.yaw += dy; st.pitch = Math.max(-90, Math.min(90, st.pitch + dp)); draw(); o.onTurn && o.onTurn(st); };
  const tools = h("div", { class: "pp6btns" }, h("span", { class: "pp6small" }, "끌거나 눌러서 돌려요:"),
    h("button", { onclick: () => turn(-30, 0), "aria-label": "왼쪽으로 돌리기" }, "◀"), h("button", { onclick: () => turn(30, 0), "aria-label": "오른쪽으로 돌리기" }, "▶"),
    h("button", { onclick: () => turn(0, -30), "aria-label": "위로 돌리기" }, "▲"), h("button", { onclick: () => turn(0, 30), "aria-label": "아래로 돌리기" }, "▼"),
    h("button", { onclick: () => { st.yaw = o.yaw == null ? -24 : o.yaw; st.pitch = o.pitch == null ? 22 : o.pitch; draw(); o.onTurn && o.onTurn(st); } }, "처음 모양"));
  draw();
  return { svg, tools, draw, st, info: () => I, el: h("div", {}, svg, tools) };
}

/* ---------- 이 단원에서 쓰는 입체도형 ---------- */
const PP6_TRI345 = [[0, 0], [4, 0], [0, 3]];                     // 3·4·5 cm 직각삼각형
const PP6_TRAP = [[0, 0], [5, 0], [2, 4], [0, 4]];               // 변 5·5·2·4 cm 직각사다리꼴
const PP6_HEX = [[3, 0], [5, 0], [8, 4], [5, 8], [3, 8], [0, 4]]; // 변 2·5·5·2·5·5 cm 육각형(이 앱이 정한 모양)
const pp6PrN = (n, h, r, rot) => pp6Prism(pp6Ngon(n, r || 1, rot), h);
const pp6PyN = (n, h, r, rot) => pp6Pyramid(pp6Ngon(n, r || 1, rot), h);
const PP6_SH = {
  tri: () => pp6PrN(3, 1.7, 1.15, -67), sq: () => pp6Prism([[-1, -.75], [1, -.75], [1, .75], [-1, .75]], 1.5), cube: () => pp6Prism([[-1, -1], [1, -1], [1, 1], [-1, 1]], 2),
  pent: () => pp6PrN(5, 1.5, 1.05), hex: () => pp6PrN(6, 1.4, 1.05, 0), hept: () => pp6PrN(7, 1.4, 1.05), oct: () => pp6PrN(8, 1.3, 1.05, 22.5),
  trilie: () => pp6PrN(3, 2.6, .85, -90), trap: () => pp6Prism([[-1.2, -.7], [1.2, -.7], [.6, .7], [-.6, .7]], 1.4), lowhex: () => pp6PrN(6, .55, 1.2, 0), tallsq: () => pp6Prism([[-.6, -.6], [.6, -.6], [.6, .6], [-.6, .6]], 2.6),
  py3: () => pp6PyN(3, 1.9, 1.2, -67), py4: () => pp6Pyramid([[-1, -1], [1, -1], [1, 1], [-1, 1]], 1.9), py5: () => pp6PyN(5, 1.9, 1.15), py6: () => pp6PyN(6, 1.8, 1.15, 0),
  py7: () => pp6PyN(7, 1.8, 1.15), py8: () => pp6PyN(8, 1.7, 1.15, 22.5),
  frus4: () => pp6Frustum([[-1.1, -1.1], [1.1, -1.1], [1.1, 1.1], [-1.1, 1.1]], 1.3, .5), frus6: () => pp6Frustum(pp6Ngon(6, 1.2, 0), 1.2, .55)
};
/* 카드용 작은 그림: k는 PP6_SH 이름, o2로 눕히기 등 */
function pp6Shp(k, o2 = {}) { return () => { const S = PP6_SH[k](); return pp6Fig(Object.assign({ solid: S, W: 150, H: 130, plain: true, maxW: "100%", pad: 12, yaw: -22, pitch: 22, side: "#FFF1C7", fc: o2.tilt && S.kind === "prism" ? ["#F7D9BE", "#F7D9BE"] : null }, o2)); }; }
const pp6Cyl = (o2 = {}) => () => pp6Fig(Object.assign({ kind: "cyl", r: 1, h: 1.8, W: 150, H: 130, plain: true, maxW: "100%", pad: 12, pitch: 22, side: "#FFF1C7" }, o2));
/* 꼭짓점 이름: 각기둥은 한 밑면(위) ㄱㄴㄷ… 다른 밑면(아래) 그다음 글자, 각뿔은 꼭대기 ㄱ, 밑면 ㄴㄷㄹ… */
function pp6PrLab(n) { const L = []; for (let i = 0; i < n; i++) { L[n + i] = PP6_JA[i]; L[i] = PP6_JA[n + i]; } return L; }
function pp6PyLab(n) { const L = []; L[n] = PP6_JA[0]; for (let i = 0; i < n; i++) L[i] = PP6_JA[1 + i]; return L; }
/* 면 이름: 각기둥 옆면은 [위 i, 아래 i, 아래 i+1, 위 i+1], 각뿔 옆면은 [꼭대기, 밑 i, 밑 i+1] */
function pp6FaceName(S, fi, lab) {
  const n = S.n, f0 = S.F[fi];
  let ids;
  if (pp6IsBase(S, fi)) ids = f0.slice().sort((a, c) => a - c);
  else { const b = f0.filter(v => v < n).sort((a, c) => a - c); const [x, y] = (b[0] === 0 && b[1] === n - 1) ? [n - 1, 0] : b; ids = S.kind === "pyr" ? [n, x, y] : [n + x, x, y, n + y]; }
  return "면 " + ids.map(i => lab[i]).join("");
}
const pp6IsBase = (S, fi) => S.kind === "pyr" ? S.F[fi].every(v => v < S.n) : (S.F[fi].every(v => v < S.n) || S.F[fi].every(v => v >= S.n));

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기, 여러 개 고르기 multi) ---------- */
function pp6Ask(body, api, items, opts = {}) {   /* 다 채우면 저절로 확인 → api.done( */
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
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : Math.abs(pp6Num(s.inp.value) - s.pt.n) < 1e-9;
  const val = s => s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-");
  const filled = s => s.pt.o ? (s.pt.multi ? s.v.size >= s.pt.a.length : s.v != null) : s.inp.value.trim() !== "";
  let fin = false;
  const check = () => {
    if (fin) return true;
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); });
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) { fin = true; all.forEach(s => { if (s.inp) s.inp.readOnly = true; }); api.done(ans, opts.ok); return true; }
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(pp6Num(bad.inp.value));
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
  body.append(wrap);
  return wrap;
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열려요 */
function pp6Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "pp6part" : "" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); pp6Go(body.lastChild);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}
/* 조작을 마친 뒤 물음(ask)으로 이어 가기 */
function pp6Then(body, api, opt, ans, msg) {
  if (body.pp6Fin) return; body.pp6Fin = true;
  body.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "pp6part" }); body.append(box); opt.then(box, api); pp6Go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask() : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = pp6Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle, bad: opt.bad }); pp6Go(w); }
  else api.done(ans, opt.ok || msg);
}

/* ---------- 카드 여러 장 고르기 ---------- */
function pp6Pick(body, api, opt) {   /* 끝나면 pp6Then → api.done( */
  const sel = new Set(); let fin = false;
  const cards = opt.items.map((it, i) => { const c = h("div", { class: "pp6card" }, it.fig ? it.fig() : null, h("div", {}, it.name)); c.addEventListener("click", () => { if (fin) return; sel.has(i) ? sel.delete(i) : sel.add(i); c.classList.toggle("pp6-pick", sel.has(i)); c.classList.remove("pp6-good", "pp6-bad"); kick(); }); return c; });
  api.provide({ words: opt.a.map(i => opt.items[i].name), answers: [opt.a.map(i => opt.items[i].name).join(", ")] });
  const check = () => {
    if (fin) return true; api.tryOnce(); const got = [...sel].sort().map(i => opt.items[i].name).join(", ") || "-";
    cards.forEach((c, i) => { c.classList.remove("pp6-good", "pp6-bad"); if (sel.has(i)) c.classList.add(opt.a.includes(i) ? "pp6-good" : "pp6-bad"); });
    const ex = [...sel].find(i => !opt.a.includes(i));
    if (ex != null) { api.fail((opt.whyExtra && opt.whyExtra(ex)) || `${pp6Jo(opt.items[ex].name, "은/는")} 답이 아니에요.`, got); return false; }
    if (sel.size < opt.a.length) { api.fail(opt.whyMiss || `아직 ${opt.a.length - sel.size}개 더 있어요.`, got); return false; }
    fin = true; pp6Then(body, api, opt, got, opt.msg); return true;
  };
  const kick = autoRun(() => sel.size >= opt.a.length, () => [...sel].sort().join(","), check, 600);
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), h("div", { class: "pp6small" }, "알맞은 것을 모두 누르면 저절로 확인해요."), h("div", { class: "pp6cards", style: `grid-template-columns:repeat(auto-fill,minmax(${opt.cardW || "7.5em"},1fr))` }, ...cards));
}

/* ---------- 나누어 담기: 카드를 누르고 → 상자를 눌러요 ---------- */
function pp6Sort(body, api, opt) {   /* 끝나면 pp6Then → api.done( */
  const place = opt.items.map(() => -1); let sel = null, fin = false;
  const tray = h("div", { class: "pp6tray pp6cards", style: `grid-template-columns:repeat(auto-fill,minmax(${opt.cardW || "6.5em"},1fr))` });
  const binsEl = h("div", { class: "pp6bins" });
  const binBox = opt.bins.map((t, bi) => { const cards = h("div", { class: "pp6cards" }); const el = h("div", { class: "pp6bin" }, h("div", { class: "pp6bh" }, t), cards);
    el.addEventListener("click", e => { if (fin || e.target.closest(".pp6card")) return; if (sel == null) return api.hint("먼저 옮길 카드를 눌러 골라요."); place[sel] = bi; sel = null; draw(); kick(); }); binsEl.append(el); return { el, cards }; });
  const cardEl = opt.items.map((it, i) => { const c = h("div", { class: "pp6card" }, it.fig ? it.fig() : null, h("div", {}, it.name));
    c.addEventListener("click", () => { if (fin) return; sel = sel === i ? null : i; draw(); }); return c; });
  const msg = h("div", { class: "pp6small" }, "카드를 누른 다음, 넣을 상자를 눌러요. 상자에 넣은 카드도 다시 눌러 옮길 수 있어요. 카드를 모두 넣으면 저절로 확인해요.");
  function draw() {
    tray.innerHTML = ""; binBox.forEach(b => { b.cards.innerHTML = ""; b.el.classList.toggle("pp6-ready", sel != null); });
    cardEl.forEach((c, i) => { c.classList.toggle("pp6-pick", sel === i); c.classList.remove("pp6-good", "pp6-bad"); (place[i] < 0 ? tray : binBox[place[i]].cards).append(c); });
    if (!tray.children.length) tray.append(h("span", { class: "pp6small" }, "카드를 모두 상자에 넣었어요."));
  }
  api.provide({ words: opt.bins, answers: opt.bins.map((t, bi) => `${t}: ${opt.items.filter(it => it.bin === bi).map(it => it.name).join(", ")}`) });
  const check = () => {
    if (fin) return true; api.tryOnce(); const got = opt.bins.map((t, bi) => t + ": " + opt.items.filter((_, i) => place[i] === bi).map(it => it.name).join(",")).join(" / ");
    cardEl.forEach((c, i) => c.classList.add(place[i] === opt.items[i].bin ? "pp6-good" : "pp6-bad"));
    const w = opt.items.findIndex((it, i) => place[i] !== it.bin);
    if (w >= 0) { api.fail((opt.items[w].why) || opt.bad || `${pp6Jo(opt.items[w].name, "을/를")} 다시 살펴봐요.`, got); return false; }
    fin = true; pp6Then(body, api, opt, got, opt.msg); return true;
  };
  const kick = autoRun(() => place.every(p => p >= 0), () => place.join(","), check, 700);
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), msg, tray, binsEl);
  draw();
}

/* ---------- 면을 눌러 색칠하기 ----------
   opt.items [{name, S, yaw, pitch, tilt, lab, want:{면 번호: 펜 번호}}] (하나면 opt 자체), opt.pens [{c, n}]
   want가 없으면 밑면을 0번 펜으로. opt.names(면 이름 보이기) */
const PP6_PEN = { base: { c: "#F6A6A0", n: "빨간색", e: "#D64545" }, side: { c: "#9CC3F0", n: "파란색", e: "#2B7BD6" } };
function pp6Tap(body, api, opt) {
  const items = opt.items || [opt], pens = opt.pens || [PP6_PEN.base];
  let cur = 0, pen = 0, fin = false;
  const col = items.map(() => ({}));
  const want = it => it.want || Object.fromEntries(it.S.F.map((_, fi) => [fi, pp6IsBase(it.S, fi) ? 0 : null]).filter(([, v]) => v != null));
  const read = h("div", { class: "pp6read" });
  const T = pp6Turnable({ W: 360, H: 300, fill: opt.fill || .4, maxW: "23em",
    solid: () => { const it = items[cur]; return { solid: it.S, tilt: it.tilt || 0, tapF: true, lab: it.lab, fc: it.S.F.map((_, fi) => col[cur][fi] != null ? pens[col[cur][fi]].c : null), side: "#F4F8FC" }; },
    yaw: items[0].yaw, pitch: items[0].pitch,
    after: (svg, I) => { const it = items[cur]; it.S.F.forEach((f, fi) => { const c = col[cur][fi]; if (c == null || !I.vis[fi]) return; svg.append(svgEl("polygon", { points: pp6Pts(f.map(k => I.S2[k])), fill: "none", stroke: pens[c].e || PP6.red, "stroke-width": 4, "stroke-linejoin": "round", "pointer-events": "none" })); }); },
    onTap: k => { if (fin || k[0] !== "f") return; const fi = +k.slice(1); col[cur][fi] = col[cur][fi] === pen ? null : pen; T.draw(); say(); kick(); } });
  const say = () => {
    const it = items[cur], ks = Object.keys(col[cur]).filter(k => col[cur][k] != null);
    if (!ks.length) { read.textContent = "아직 색칠한 면이 없어요."; return; }
    read.textContent = pens.map((p, pi) => { const fs = ks.filter(k => col[cur][k] === pi); return fs.length ? `${p.n}(${p.t || ""}) ${fs.length}개` + (it.lab && opt.names !== false ? ": " + fs.map(k => pp6FaceName(it.S, +k, it.lab)).join(", ") : "") : ""; }).filter(Boolean).join(" / ").replace(/\(\)/g, "");
  };
  const tabs = items.length > 1 ? h("div", { class: "pp6btns" }, h("span", { class: "pp6small" }, "입체도형:"), ...items.map((it, i) => { const b = h("button", { class: i === 0 ? "pp6-pick" : "", onclick: () => { cur = i; T.st.yaw = it.yaw == null ? -24 : it.yaw; T.st.pitch = it.pitch == null ? 22 : it.pitch; [...tabs.querySelectorAll("button")].forEach((x, j) => x.classList.toggle("pp6-pick", j === i)); T.draw(); say(); } }, it.name); return b; })) : null;
  const penBar = pens.length > 1 ? h("div", { class: "pp6btns" }, h("span", { class: "pp6small" }, "색 고르기:"), ...pens.map((p, i) => { const b = h("button", { class: i === pen ? "pp6-pick" : "", onclick: () => { pen = i; [...penBar.querySelectorAll("button")].forEach((x, j) => x.classList.toggle("pp6-pick", j === i)); } }, h("span", { style: `display:inline-block;width:.9em;height:.9em;border-radius:50%;background:${p.c};vertical-align:-.1em;margin-right:.3em` }), p.t ? `${p.t}(${p.n})` : p.n); return b; })) : null;
  api.provide({ words: opt.words || [], answers: [] });
  const check = () => {
    if (fin) return true; api.tryOnce();
    for (let i = 0; i < items.length; i++) { const it = items[i], w = want(it), nm = items.length > 1 ? it.name + ": " : "";
      for (let fi = 0; fi < it.S.F.length; fi++) { const a = w[fi] == null ? null : w[fi], b = col[i][fi] == null ? null : col[i][fi];
        if (a === b) continue;
        const fnm = it.lab ? pp6FaceName(it.S, fi, it.lab) : "";
        let m;
        if (opt.why) m = opt.why(it, fi, a, b);
        if (!m) m = a == null ? `${nm}${fnm ? pp6Jo(fnm, "은/는") : "색칠한 면 중 하나는"} 칠하지 않는 면이에요.` : b == null ? `${nm}아직 찾지 못한 ${pens[a].t || "면"}이 있어요. 입체도형을 돌려 숨은 면도 살펴봐요.` : `${nm}${fnm ? pp6Jo(fnm, "은/는") : "색칠한 면 중 하나는"} ${pens[a].t || pens[a].n}이에요.`;
        if (items.length > 1 && cur !== i) { cur = i; [...tabs.querySelectorAll("button")].forEach((x, j) => x.classList.toggle("pp6-pick", j === i)); T.draw(); say(); }
        api.fail(m, read.textContent); return false;
      } }
    fin = true; pp6Then(body, api, opt, read.textContent, opt.msg); return true;
  };
  const need = items.map(it => Object.keys(want(it)).length);
  const kick = autoRun(() => items.every((it, i) => Object.keys(col[i]).filter(k => col[i][k] != null).length >= need[i]), () => JSON.stringify(col), check, 1200);
  body.append(h("div", { class: "pp6small" }, (opt.tip || "면을 누르면 색칠돼요. 칠한 면을 한 번 더 누르면 지워져요. 뒤에 숨은 면은 입체도형을 돌려서 찾아요.") + " 다 칠하면 저절로 확인해요."), ...(tabs ? [tabs] : []), ...(penBar ? [penBar] : []), T.svg, T.tools, read);
  say();
}

/* ---------- 모서리(빨강)·꼭짓점(파랑)·각뿔의 꼭짓점(◯) 표시하기 ---------- */
function pp6Parts(body, api, opt) {
  const S = opt.S, ecol = {}, vcol = {}; let ring = null, mode = "e", fin = false;
  const modes = [["e", "모서리 (빨간색)"], ["v", "꼭짓점 (파란색)"]].concat(opt.apex ? [["a", "옆면이 모두 만나는 점 ◯"]] : []);
  const read = h("div", { class: "pp6read" });
  const T = pp6Turnable({ W: 360, H: 300, maxW: "23em", fill: .4, solid: () => ({ solid: S, tapE: true, tapV: true, ecol, vcol, ring, side: "#F7FAFD" }), yaw: opt.yaw, pitch: opt.pitch,
    onTap: k => {
      if (fin) return;
      if (k[0] === "e") { if (mode !== "e") return api.hint("선분을 표시하려면 위에서 ‘모서리 (빨간색)’를 먼저 골라요."); const key = k.slice(1); ecol[key] = ecol[key] ? null : PP6.red; }
      else if (k[0] === "v") { const i = +k.slice(1); if (mode === "v") vcol[i] = vcol[i] ? null : PP6.blue; else if (mode === "a") ring = ring === i ? null : i; else return api.hint("점을 표시하려면 위에서 ‘꼭짓점 (파란색)’을 먼저 골라요."); }
      T.draw(); say(); kick(); } });
  const nE = S.E.size, nV = S.V.length;
  const say = () => { const e = Object.values(ecol).filter(Boolean).length, v = Object.values(vcol).filter(Boolean).length;
    read.textContent = `빨간 선분 ${e}개 · 파란 점 ${v}개` + (opt.apex ? ` · ◯ ${ring == null ? "없음" : "1개"}` : ""); };
  const bar = h("div", { class: "pp6btns" }, h("span", { class: "pp6small" }, "표시할 것:"), ...modes.map(([m, t], i) => h("button", { class: i === 0 ? "pp6-pick" : "", onclick: e => { mode = m; [...bar.querySelectorAll("button")].forEach(x => x.classList.remove("pp6-pick")); e.currentTarget.classList.add("pp6-pick"); } }, t)));
  api.provide({ words: ["모서리", "꼭짓점"].concat(opt.apex ? ["각뿔의 꼭짓점"] : []), answers: [] });
  const check = () => {
    if (fin) return true; api.tryOnce(); const e = Object.values(ecol).filter(Boolean).length, v = Object.values(vcol).filter(Boolean).length;
    if (e < nE) { api.fail(`아직 표시하지 않은 선분이 있어요. 점선으로 보이는 뒤쪽 선분도 표시해요. (지금 ${e}개)`, read.textContent); return false; }
    if (v < nV) { api.fail(`아직 표시하지 않은 점이 있어요. 뒤쪽에 숨은 점도 표시해요. (지금 ${v}개)`, read.textContent); return false; }
    if (opt.apex && ring !== S.n) { api.fail(ring == null ? "옆면이 모두 만나는 점을 찾아 ◯표 해요." : "◯표 한 점에서는 옆면이 모두 만나지 않아요. 옆면이 모두 만나는 뾰족한 점을 찾아요.", read.textContent); return false; }
    fin = true; pp6Then(body, api, opt, read.textContent, opt.msg || "모두 표시했어요."); return true;
  };
  const kick = autoRun(() => Object.values(ecol).filter(Boolean).length >= nE && Object.values(vcol).filter(Boolean).length >= nV && (!opt.apex || ring != null), () => JSON.stringify([ecol, vcol, ring]), check, 1200);
  body.append(h("div", { class: "pp6small" }, "면과 면이 만나는 선분을 눌러 빨간색으로, 선분과 선분이 만나는 점을 눌러 파란색으로 표시해요. 뒤에 숨은 것(점선)도 빠짐없이 표시해요. 모두 표시하면 저절로 확인해요."), bar, T.svg, T.tools, read);
  say();
}

/* ---------- 자와 삼각자로 높이 재기 ---------- */
function pp6Ruler(body, api, opt) {   /* 끝나면 pp6Then → api.done( */
  const S = opt.S, hh = opt.h, isPy = S.kind === "pyr", W = 440, H = 340, pitch = 7, yaw = opt.yaw == null ? -20 : opt.yaw, cbv = Math.cos(pitch * PP6_D);
  const xs = S.V.map(v => v[0] * Math.cos(yaw * PP6_D) + v[2] * Math.sin(yaw * PP6_D)), x0 = Math.min(...xs), x1 = Math.max(...xs);
  const rx = x1 + .6, top = hh + 1.8, sc = Math.min((H - 40) / ((hh + 3.2) * cbv), (W - 60) / (rx + 1.4 - x0)), cx = W / 2 - sc * (x0 + rx + .9) / 2, cy = H / 2 + .9 * sc * cbv;
  const svg = makeSvg(W, H); svg.setAttribute("class", "pp6fig"); svg.style.maxWidth = "28em";
  let yq = hh + 1.5, ok = false;
  const read = h("div", { class: "pp6read" });
  const draw = () => {
    svg.innerHTML = "";
    const I = pp6Draw(svg, { solid: S, s: sc, cx, cy, pitch, yaw, side: "#E8F1FB", fc: S.F.map((_, fi) => pp6IsBase(S, fi) ? "#B8D3F2" : null) });
    // 바닥과 자는 화면에 바로 그려요(돌리지 않은 좌표)
    const Pz = (x, y) => [cx + sc * x, cy - sc * ((y - hh / 2) * cbv)];
    pp6Seg(svg, Pz(x0 - .8, 0), Pz(rx + 1.4, 0), { stroke: "#B9A27A", "stroke-width": 3 });
    svg.append(svgEl("polygon", { points: pp6Pts([Pz(rx, 0), Pz(rx + .8, 0), Pz(rx + .8, top), Pz(rx, top)]), fill: "#FFF6D6", stroke: "#B8963A", "stroke-width": 1.5, "pointer-events": "none" }));
    for (let k = 0; k <= Math.floor(top * 2); k++) { const y = k / 2, big = k % 2 === 0; pp6Seg(svg, Pz(rx, y), Pz(rx + (big ? .35 : .2), y), { stroke: "#8A6D1F", "stroke-width": 1.2 });
      if (big) pp6T(svg, Pz(rx + .58, y)[0], Pz(rx + .58, y)[1], String(k / 2), 11, { fill: "#6A5313", stroke: "none" }); }
    const apexX = isPy ? I.P(S.V[S.n])[0] : null, reachX = isPy ? apexX : cx + sc * (x0 + (x1 - x0) * .35);
    const A = Pz(rx, yq), B = [reachX, Pz(rx, yq)[1]], C = Pz(rx, yq + 1.4);
    const tri = svgEl("polygon", { points: pp6Pts([A, B, C]), fill: ok ? "rgba(46,139,87,.28)" : "rgba(43,123,214,.22)", stroke: ok ? PP6.green : PP6.blue, "stroke-width": 2.2, class: "pp6hit" });
    svg.append(tri); pp6Seg(svg, A, B, { stroke: ok ? PP6.green : PP6.blue, "stroke-width": 3 });
    if (ok) { if (isPy) { const a = I.P(S.V[S.n]), b = I.P([S.V[S.n][0], 0, S.V[S.n][2]]); pp6Seg(svg, a, b, { stroke: PP6.red, "stroke-width": 3, "stroke-dasharray": "7 5" }); pp6T(svg, a[0] - 26, (a[1] + b[1]) / 2, "높이", 15, { fill: PP6.red }); }
      else { const a = Pz(rx - .12, 0), b = Pz(rx - .12, hh); pp6Seg(svg, a, b, { stroke: PP6.red, "stroke-width": 3.5 }); } }
    read.textContent = ok ? `삼각자가 ${isPy ? "각뿔의 뾰족한 점" : "위쪽 밑면"}에 닿았어요. 자의 눈금을 읽어 봐요.` : `파란 삼각자를 아래로 끌어 ${isPy ? "옆면이 모두 만나는 뾰족한 점" : "위쪽 밑면"}에 닿게 해요.`;
  };
  dragOn(svg, () => !ok, p => { const y = (cy - p.y) / (sc * cbv) + hh / 2 - .7; yq = Math.max(hh, Math.min(hh + 1.5, Math.round(y * 10) / 10)); if (yq - hh < .12) { yq = hh; ok = true; draw(); pp6Then(body, api, opt, `높이 ${hh} cm`, "삼각자를 맞추었어요."); return; } draw(); });
  api.provide({ words: ["수직", "자", "삼각자"], answers: [] });
  body.append(h("div", { class: "pp6small" }, "파란 삼각자를 끌어서 내려 보세요. 자는 바닥(눈금 0)에 수직으로 세워져 있어요."), svg, read);
  draw();
}

/* ---------- 주상 절리 윗면 살펴보기 ---------- */
const PP6_POLY = ["", "", "", "삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형"];
function pp6Columns(body, api, opt) {   /* 끝나면 pp6Then → api.done( */
  const cols = opt.cols, W = 460, H = 330, svg = makeSvg(W, H); svg.setAttribute("class", "pp6fig"); svg.style.maxWidth = "29em";
  const seen = new Set(), read = h("div", { class: "pp6read" }, "기둥 윗면을 하나씩 눌러 보세요.");
  const sol = cols.map(c => { const S = pp6Prism(pp6Ngon(c.n, c.r || .95, c.rot), c.h); S.V = S.V.map(v => [v[0] + c.x, v[1], v[2] + c.z]); return S; });
  const draw = () => {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H * .42, fill: "#E3F1FB" }), svgEl("rect", { x: 0, y: H * .42, width: W, height: H * .58, fill: "#DCE8E2" }));
    cols.map((c, i) => i).sort((a, b) => cols[a].z - cols[b].z).forEach(i => {
      const I = pp6Draw(svg, { solid: sol[i], s: 44, cx: W / 2, cy: H * .74, yaw: -12, pitch: 34, mid: 0, hidden: "none", side: "#8E97A1", fc: [null, seen.has(i) ? "#FFD27A" : "#B3BCC6"], sw: 2 });
      const top = sol[i].F[1].map(k => I.S2[k]), hit = svgEl("polygon", { points: pp6Pts(top), fill: "rgba(0,0,0,0)", class: "pp6hit" }); hit.dataset.k = "c" + i; svg.append(hit);
      if (seen.has(i)) { const c = top.reduce((s, p) => [s[0] + p[0] / top.length, s[1] + p[1] / top.length], [0, 0]); pp6T(svg, c[0], c[1], PP6_POLY[cols[i].n], 13, { fill: "#7A4E00" }); }
    });
  };
  svg.addEventListener("click", e => { const k = e.target.dataset && e.target.dataset.k; if (!k) return; const i = +k.slice(1); seen.add(i); draw();
    read.textContent = `이 기둥을 위에서 보면 ${PP6_POLY[cols[i].n]}이에요. (살펴본 기둥 ${seen.size}/${cols.length})`;
    if (seen.size === cols.length) pp6Then(body, api, opt, "윗면 모두 살펴봄", "기둥의 윗면을 모두 살펴보았어요."); });
  api.provide({ words: ["다각형"], answers: [] });
  body.append(svg, read); draw();
}

/* ---------- 공학 도구처럼 각기둥·각뿔 만들고 문제 만들기 ---------- */
function pp6Make(body, api, opt) {   /* 끝나면 pp6Then → api.done( */
  const kind = opt.kind; let n = null, fin = false;
  const read = h("div", { class: "pp6read" }, "밑면의 각의 수(변의 수)를 골라 만들어 보세요.");
  const box = h("div");
  const T = pp6Turnable({ W: 340, H: 270, maxW: "22em", fill: .38, solid: () => ({ solid: n ? (kind === "prism" ? pp6PrN(n, 1.5, 1.1) : pp6PyN(n, 1.8, 1.1)) : (kind === "prism" ? pp6PrN(3, 1.5, 1.1) : pp6PyN(3, 1.8, 1.1)), side: "#E8F1FB", fc: n ? (kind === "prism" ? [PP6.baseN, PP6.baseN] : [PP6.baseN]) : [] }), yaw: -20, pitch: 22 });
  const nb = h("div", { class: "pp6btns" }, h("span", { class: "pp6small" }, "밑면의 각의 수:"), ...[3, 4, 5, 6, 7, 8, 9, 10].map(k => h("button", { onclick: e => { if (fin) return; n = k; [...nb.querySelectorAll("button")].forEach(x => x.classList.remove("pp6-pick")); e.currentTarget.classList.add("pp6-pick"); T.draw(); read.textContent = `${pp6Name(kind, k)}을 만들었어요. 끌어서 이리저리 돌려 보세요.`; go.disabled = false; } }, String(k))));
  const go = h("button", { class: "ghost", disabled: true, onclick: () => {
    if (fin || !n) return; fin = true; go.disabled = true; const c = pp6Cnt(kind, n), nm = pp6Name(kind, n);
    read.textContent = `내가 만든 ${pp6Jo(nm, "으로/로")} 문제를 만들었어요. 친구처럼 풀어 보세요.`;
    pp6Then(box, api, { ask: [{ q: `내가 만든 문제: “${nm}의 면, 꼭짓점, 모서리, 옆면은 각각 몇 개인가요?”`, parts: ["면 ", { n: c.face }, "개, 꼭짓점 ", { n: c.vert }, "개, 모서리 ", { n: c.edge }, "개, 옆면 ", { n: c.side }, "개"] }],
      ok: opt.ok ? opt.ok(nm, c, n) : `${nm}의 면은 ${c.face}개, 꼭짓점은 ${c.vert}개, 모서리는 ${c.edge}개, 옆면은 ${c.side}개예요.` }, "", "");
  } }, "이 도형으로 문제 만들기");
  api.provide({ words: [kind === "prism" ? "면 = 변의 수 + 2" : "면 = 변의 수 + 1"], answers: [] });
  body.append(h("div", { class: "pp6small" }, `공학 도구(알지오매스 키즈 3D)에서처럼 ‘${kind === "prism" ? "각기둥" : "각뿔"}’을 고르고 밑면의 각의 수를 넣어 만들어요.`), nb, T.svg, T.tools, read, h("div", { class: "pp6btns" }, go), box);
}

/* =========================================================
   전개도
   ========================================================= */
/* 접는 그림(움직이는 그림 판): U = pp6Unfold 결과(또는 같은 꼴의 마디), set(t) 0 펼침 ~ 1 접힘 */
function pp6FoldSvg(S, U, o = {}) {
  const W = o.W || 420, H = o.H || 320, svg = makeSvg(W, H); svg.setAttribute("class", "pp6fig" + (o.plain ? " pp6plain" : "")); svg.style.maxWidth = o.maxW || "27em";
  const pad = o.pad == null ? 14 : o.pad, y0d = o.yaw == null ? -20 : o.yaw, p0 = o.p0 == null ? 74 : o.p0;
  const isB = nd => nd.base != null ? nd.base : pp6IsBase(S, nd.f);
  // 다 접었을 때: 같은 면이 두 번 나오면(겹침) 빨갛게, 빠진 면은 빨간 점선으로
  const F1 = pp6FoldPts(U, 1), seenF = new Set(), dup = U.map(nd => { const d = seenF.has(nd.f); seenF.add(nd.f); return d; });
  const pairs = new Map(); U.forEach((nd, i) => (nd.ids || []).forEach((id, k) => { if (!pairs.has(id)) pairs.set(id, F1[i][k]); }));
  let miss = [];
  if (U[0].ids) { const ids = [...pairs.keys()], v = ids.map(id => S.V[id]), f = ids.map(id => pairs.get(id));
    let q = null; for (let a = 1; a < ids.length && !q; a++) for (let b = a + 1; b < ids.length && !q; b++) for (let c = b + 1; c < ids.length && !q; c++) {
      const A = [pp6Sub(v[a], v[0]), pp6Sub(v[b], v[0]), pp6Sub(v[c], v[0])], det = pp6Dot3(A[0], pp6Crs(A[1], A[2])); if (Math.abs(det) > 1e-3) q = [a, b, c, A, det]; }
    if (q) { const [a, b, c, A] = q, Bm = [pp6Sub(f[a], f[0]), pp6Sub(f[b], f[0]), pp6Sub(f[c], f[0])];
      const solve = d => { const det = pp6Dot3(A[0], pp6Crs(A[1], A[2])); return [pp6Dot3(d, pp6Crs(A[1], A[2])) / det, pp6Dot3(A[0], pp6Crs(d, A[2])) / det, pp6Dot3(A[0], pp6Crs(A[1], d)) / det]; };
      const M = p => { const w = solve(pp6Sub(p, v[0])); return [0, 1, 2].map(k => f[0][k] + w[0] * Bm[0][k] + w[1] * Bm[1][k] + w[2] * Bm[2][k]); };
      miss = S.F.map((fc, fi) => seenF.has(fi) ? null : fc.map(id => M(S.V[id]))).filter(Boolean); } }
  const flag = miss.length ? miss[0] : dup.includes(true) ? F1[dup.indexOf(true)] : null;
  const W3 = q => [q[0], -q[2], -q[1]];
  const all1 = F1.flat().map(W3), cen1 = all1.reduce((a, q) => a.map((x, k) => x + q[k] / all1.length), [0, 0, 0]);
  let y1d = y0d, p1 = o.p1 == null ? 26 : o.p1;
  if (flag) { const c = flag.map(W3).reduce((a, q) => a.map((x, k) => x + q[k] / flag.length), [0, 0, 0]), d = pp6Sub(c, cen1);
    y1d = Math.atan2(-d[0], d[2]) / PP6_D; while (y1d - y0d > 180) y1d -= 360; while (y0d - y1d > 180) y1d += 360; p1 = Math.max(18, Math.min(62, Math.atan2(d[1], Math.hypot(d[0], d[2])) / PP6_D)); }
  const cam = t => [(y0d + (y1d - y0d) * t) * PP6_D, (p0 - (p0 - p1) * t) * PP6_D];
  const proj = (q, t) => { const [X, Y, Zd] = W3(q), [ya, p] = cam(t);
    const X1 = X * Math.cos(ya) + Zd * Math.sin(ya), Z1 = -X * Math.sin(ya) + Zd * Math.cos(ya); return [X1, Y * Math.cos(p) - Z1 * Math.sin(p), Y * Math.sin(p) + Z1 * Math.cos(p)]; };
  const bb = t => { const Q = pp6FoldPts(U, t).flat().concat(t > .97 ? miss.flat() : []).map(q => proj(q, t)), xs = Q.map(q => q[0]), ys = Q.map(q => q[1]); return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]; };
  const fit = b => Math.min((W - 2 * pad) / Math.max(b[1] - b[0], 1e-6), (H - 2 * pad) / Math.max(b[3] - b[2], 1e-6));
  const B0 = bb(0), B1 = bb(1), s0 = fit(B0), s1 = Math.min(fit(B1), s0 * 1.9);
  const set = t => {
    svg.innerHTML = "";
    const F = pp6FoldPts(U, t), sc = s0 + (s1 - s0) * t, c = [((B0[0] + B0[1]) / 2) * (1 - t) + ((B1[0] + B1[1]) / 2) * t, ((B0[2] + B0[3]) / 2) * (1 - t) + ((B1[2] + B1[3]) / 2) * t];
    const T2 = q => [W / 2 + sc * (q[0] - c[0]), H / 2 - sc * (q[1] - c[1])];
    const fs = F.map((pts, i) => { const Q = pts.map(q => proj(q, t)); return { i, Q, d: Q.reduce((s2, q) => s2 + q[2], 0) / Q.length }; }).sort((a, b) => a.d - b.d);
    fs.forEach(({ i, Q }) => svg.append(svgEl("polygon", { points: pp6Pts(Q.map(T2)), fill: (o.col && o.col[i]) || (dup[i] && t > .9 ? "#F28B82" : isB(U[i]) ? PP6.base : PP6.sideN), "fill-opacity": .9, stroke: PP6.ink, "stroke-width": 2, "stroke-linejoin": "round" })));
    if (t > .97) miss.forEach(m => svg.append(svgEl("polygon", { points: pp6Pts(m.map(q => T2(proj(q, t)))), fill: "rgba(214,69,69,.08)", stroke: PP6.red, "stroke-width": 2.6, "stroke-dasharray": "7 5" })));
  };
  set(o.t == null ? 0 : o.t);
  return { svg, set };
}
/* 상자를 잘라 펼치기(또는 접기) */
function pp6FoldView(body, api, opt) {   /* 끝나면 pp6Then → api.done( */
  const U = opt.U || pp6Unfold(opt.S, opt.nodes, opt.rot || 0), from = opt.from == null ? 1 : opt.from, to = 1 - from;
  const F = pp6FoldSvg(opt.S, U, { t: from, W: 440, H: 330, maxW: "28em" });
  let t = from, fin = false, anim = null;
  const read = h("div", { class: "pp6read" });
  const say = () => { read.textContent = from === 1 ? (t >= .999 ? "막대를 밀거나 ‘모서리를 잘라 펼치기’를 눌러 보세요." : t > .02 ? "잘린 모서리를 따라 펼치고 있어요." : "다 펼쳤어요!") : (t <= .001 ? "막대를 밀거나 ‘접어 보기’를 눌러 보세요." : t < .98 ? "접고 있어요." : "다 접었어요!"); };
  const rng = h("input", { type: "range", min: 0, max: 100, value: Math.round(from * 100), "aria-label": "펼치기" });
  const set = v => { t = Math.max(0, Math.min(1, v)); rng.value = Math.round(t * 100); F.set(t); say(); if (Math.abs(t - to) < .001 && !fin) { fin = true; pp6Then(body, api, opt, from === 1 ? "펼침" : "접음", opt.msg || (from === 1 ? "상자를 잘라서 펼쳤어요." : "전개도를 접었어요.")); } };
  rng.addEventListener("input", () => set(+rng.value / 100));
  const btn = h("button", { class: "ghost", onclick: () => { if (anim) return; anim = setInterval(() => { if (!F.svg.isConnected || Math.abs(t - to) < .001) { clearInterval(anim); anim = null; return; } set(t + (to - t > 0 ? .02 : -.02)); }, 40); } }, from === 1 ? "✂ 모서리를 잘라 펼치기" : "접어 보기");
  api.provide({ words: opt.words || ["밑면", "옆면", "전개도"], answers: [] });
  body.append(F.svg, h("div", { class: "pp6slider" }, h("span", { class: "pp6small" }, "펼친 그림"), rng, h("span", { class: "pp6small" }, "입체도형")), h("div", { class: "pp6btns" }, btn), read);
  say();
}

/* 전개도 그림: faces [{P(평면 좌표, y 위쪽), base}] */
function pp6NetSvg(faces, o = {}) {
  const pad = o.pad == null ? 14 : o.pad, all = faces.flatMap(f => f.P), xs = all.map(p => p[0]), ys = all.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = o.s || Math.min((o.W || 360) / (x1 - x0 || 1), (o.H || 300) / (y1 - y0 || 1));
  const W = (x1 - x0) * s + 2 * pad, H = (y1 - y0) * s + 2 * pad, svg = makeSvg(pp6R(W), pp6R(H));
  svg.setAttribute("class", "pp6fig" + (o.plain ? " pp6plain" : "")); svg.style.maxWidth = o.maxW || "24em";
  const X = p => [pad + (p[0] - x0) * s, pad + (y1 - p[1]) * s];
  const el = faces.map((f, i) => { const e = svgEl("polygon", { points: pp6Pts(f.P.map(X)), fill: (o.col && o.col[i]) || (f.base ? PP6.base : PP6.sideN), stroke: "none" }); if (o.tapF) { e.classList.add("pp6hit"); e.dataset.k = "f" + i; } svg.append(e); return e; });
  const segs = [];
  faces.forEach((f, i) => f.P.forEach((p, j) => { const q = f.P[(j + 1) % f.P.length];
    const fold = faces.some((g, k) => k !== i && g.P.some((r, l) => { const u = g.P[(l + 1) % g.P.length]; return (pp6Same(r, q) && pp6Same(u, p)) || (pp6Same(r, p) && pp6Same(u, q)); }));
    if (fold && segs.some(sg => sg.fold && ((pp6Same(sg.p, q) && pp6Same(sg.q, p)) || (pp6Same(sg.p, p) && pp6Same(sg.q, q))))) return;
    segs.push({ i, j, p, q, a: X(p), b: X(q), fold }); }));
  segs.filter(sg => sg.fold).forEach(sg => pp6Seg(svg, sg.a, sg.b, { stroke: "#4A5A66", "stroke-width": 1.8, "stroke-dasharray": "6 4" }));
  segs.filter(sg => !sg.fold).forEach(sg => pp6Seg(svg, sg.a, sg.b, { "stroke-width": 2.4 }));
  if (o.lens) o.lens.forEach(L => { const f = faces[L.i], c = f.P.reduce((a, r) => [a[0] + r[0] / f.P.length, a[1] + r[1] / f.P.length], [0, 0]);
    if (L.mid) { const at = X(c); pp6T(svg, at[0], at[1], L.t, L.size || 15, { fill: L.col || PP6.blue }); return; }
    let j = L.j; if (L.side) { const sc = { right: m => m[0], left: m => -m[0], top: m => m[1], bottom: m => -m[1] }[L.side]; let best = -1e9; f.P.forEach((p, k) => { const q = f.P[(k + 1) % f.P.length], v = sc([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]); if (v > best + 1e-9) { best = v; j = k; } }); }
    const p = f.P[j], q = f.P[(j + 1) % f.P.length];
    const M = X([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]), C = X(c), d = [M[0] - C[0], M[1] - C[1]], l = Math.hypot(...d) || 1, sg = (L.out == null || L.out > 0) ? 1 : -1;
    if (Math.abs(d[0]) > Math.abs(d[1])) pp6T(svg, M[0] + sg * Math.sign(d[0]) * 7, M[1], L.t, L.size || 14, { fill: L.col || PP6.blue, "text-anchor": (sg * d[0] > 0) ? "start" : "end" });
    else pp6T(svg, M[0], M[1] + sg * Math.sign(d[1]) * 14, L.t, L.size || 14, { fill: L.col || PP6.blue }); });
  if (o.vlab) o.vlab.forEach(({ p, t }) => { const c = all.reduce((a, r) => [a[0] + r[0] / all.length, a[1] + r[1] / all.length], [0, 0]), Q = X(p), C = X(c), d = [Q[0] - C[0], Q[1] - C[1]], l = Math.hypot(...d) || 1; pp6T(svg, Q[0] + d[0] / l * 11, Q[1] + d[1] / l * 11, t, 14, { fill: PP6.purple }); });
  if (o.after) o.after(svg, { X, s });
  return { svg, el, segs, X, s };
}
const pp6Faces = (S, U) => U.map(u => ({ P: u.P, base: pp6IsBase(S, u.f), f: u.f, ids: u.ids }));

/* 전개도에 밑면 ◯, 옆면 △ 표시하기 */
function pp6NetMark(body, api, opt) {
  const U = opt.U, faces = pp6Faces(opt.S, U), mk = {}, cyc = [null, "◯", "△"]; let fin = false;
  const N = pp6NetSvg(faces, { s: opt.s || 26, tapF: true, maxW: opt.maxW || "24em", col: faces.map(() => "#FFFFFF") });
  const marks = svgEl("g", { "pointer-events": "none" }); N.svg.append(marks);
  const draw = () => { marks.innerHTML = ""; Object.entries(mk).forEach(([i, m]) => { if (!m) return; const P = faces[i].P.map(N.X), c = P.reduce((a, r) => [a[0] + r[0] / P.length, a[1] + r[1] / P.length], [0, 0]);
    marks.append(txt(pp6R(c[0]), pp6R(c[1] + 2), m, 30, { fill: m === "◯" ? PP6.blue : PP6.org })); }); };
  N.svg.addEventListener("click", e => { if (fin) return; const k = e.target.dataset && e.target.dataset.k; if (!k) return; const i = +k.slice(1); mk[i] = cyc[(cyc.indexOf(mk[i] || null) + 1) % 3]; draw(); kick(); });
  api.provide({ words: ["밑면 ◯", "옆면 △"], answers: [] });
  const got = () => faces.map((f, i) => mk[i] || "-").join("");
  const check = () => {
    if (fin) return true; api.tryOnce();
    const nb = faces.filter((f, i) => f.base && mk[i] === "◯").length, ns = faces.filter((f, i) => !f.base && mk[i] === "△").length;
    if (faces.some((f, i) => !f.base && mk[i] === "◯")) { api.fail("◯표 한 면 중에 밑면이 아닌 것이 있어요. 밑면은 평행하고 합동인 두 면이에요.", got()); return false; }
    if (faces.some((f, i) => f.base && mk[i] === "△")) { api.fail("△표 한 면 중에 밑면이 있어요. 옆면은 두 밑면과 만나는 면이에요.", got()); return false; }
    if (nb < faces.filter(f => f.base).length) { api.fail("밑면을 모두 찾아 ◯표 해요. 각기둥의 밑면은 2개예요.", got()); return false; }
    if (ns < faces.filter(f => !f.base).length) { api.fail("옆면을 모두 찾아 △표 해요.", got()); return false; }
    fin = true; pp6Then(body, api, opt, got(), opt.msg || "밑면과 옆면을 모두 찾았어요."); return true;
  };
  const kick = autoRun(() => faces.every((f, i) => mk[i]), got, check, 1200);
  body.append(h("div", { class: "pp6small" }, "면을 누를 때마다 ◯ → △ → 지우기 차례로 바뀌어요. 모든 면에 표시하면 저절로 확인해요."), N.svg);
}

/* 접었을 때 맞닿는 선분끼리 같은 색으로 */
const PP6_PAIRC = ["#D64545", "#2E8B57", "#7A5BB0", "#2B7BD6", "#E47A38", "#C0398A", "#8A6D1F", "#1A9AA0", "#5A6B7B"];
function pp6NetPairs(body, api, opt) {   /* 끝나면 pp6Then → api.done( */
  const U = opt.U, faces = pp6Faces(opt.S, U);
  const N = pp6NetSvg(faces, { s: opt.s || 26, maxW: opt.maxW || "24em" });
  const cut = N.segs.filter(sg => !sg.fold).map(sg => Object.assign(sg, { key: pp6EK(faces[sg.i].ids[sg.j], faces[sg.i].ids[(sg.j + 1) % faces[sg.i].ids.length]) }));
  const pairs = [...new Set(cut.map(c => c.key))].filter(k => cut.filter(c => c.key === k).length === 2);
  const done = {}; let sel = null;
  const lay = svgEl("g"); N.svg.append(lay);
  const read = h("div", { class: "pp6read" });
  const draw = () => { lay.innerHTML = "";
    cut.forEach((c, i) => { const col = done[c.key] != null ? PP6_PAIRC[done[c.key] % PP6_PAIRC.length] : sel === i ? PP6.gold : null;
      if (col) pp6Seg(lay, c.a, c.b, { stroke: col, "stroke-width": 6 });
      const e = svgEl("line", { x1: pp6R(c.a[0]), y1: pp6R(c.a[1]), x2: pp6R(c.b[0]), y2: pp6R(c.b[1]), stroke: "rgba(0,0,0,0)", "stroke-width": 16, class: "pp6hit" }); e.dataset.k = "s" + i; lay.append(e); });
    read.textContent = `찾은 짝 ${Object.keys(done).length}/${pairs.length}` + (sel != null ? " · 짝이 될 선분을 하나 더 눌러요." : ""); };
  N.svg.addEventListener("click", e => { const k = e.target.dataset && e.target.dataset.k; if (!k) return; const i = +k.slice(1), c = cut[i];
    if (done[c.key] != null) return api.hint("이미 짝을 찾은 선분이에요.");
    if (sel == null || sel === i) { sel = sel === i ? null : i; draw(); return; }
    api.tryOnce();
    if (cut[sel].key === c.key) { done[c.key] = Object.keys(done).length; sel = null; draw(); if (Object.keys(done).length === pairs.length) pp6Then(body, api, opt, "짝 " + pairs.length + "개", opt.msg || "맞닿는 선분의 짝을 모두 찾았어요."); else api.hint("○ 맞아요! 접으면 두 선분이 맞닿아요."); }
    else { sel = null; draw(); api.fail("두 선분은 접었을 때 맞닿지 않아요. 머릿속으로 접어 보고 다시 골라요.", "-"); } });
  api.provide({ words: ["맞닿는 선분", "길이가 같아요"], answers: [] });
  body.append(h("div", { class: "pp6small" }, "실선(잘린 모서리)을 하나 누르고, 접었을 때 그 선분과 맞닿는 선분을 눌러요. 짝을 찾으면 같은 색이 칠해져요."), N.svg, read);
  draw();
}

/* 전개도가 될 수 있는 것 찾기: 예상하기 → 하나씩 접어 보기 */
function pp6NetJudge(body, api, opt) {   /* 끝나면 pp6Then → api.done( */
  const guess = new Set(); let phase = 0; const seen = new Set();
  const cards = opt.cards.map((C, i) => {
    const U = pp6Unfold(C.S, C.nodes, C.rot || 0), faces = pp6Faces(C.S, U);
    const J = pp6Judge(C.S, U.map(u => u.P)); if (J.ok !== C.ok) console.warn("전개도 판정이 맞지 않아요:", C.name, J);
    const res = h("div", { class: "pp6small" }, "​"), foldBox = h("div");
    const fb = h("button", { class: "ghost", style: "display:none;margin:.2em auto", onclick: e => { e.stopPropagation(); seen.add(i); foldBox.innerHTML = "";
      const F = pp6FoldSvg(C.S, U, { W: 220, H: 170, plain: true, maxW: "100%", pad: 8 }); foldBox.append(F.svg); let t = 0; const iv = setInterval(() => { if (!F.svg.isConnected || t >= 1) { clearInterval(iv); return; } t = Math.min(1, t + .04); F.set(t); }, 40);
      res.textContent = C.res; c.classList.add(C.ok ? "pp6-good" : "pp6-bad"); fb.style.display = "none"; if (seen.size === opt.cards.length) fin(); } }, "접어 보기");
    const c = h("div", { class: "pp6card" }, pp6NetSvg(faces, { s: opt.s || 12, plain: true, maxW: "100%", pad: 6 }).svg, h("div", {}, C.name), fb, foldBox, res);
    c.addEventListener("click", () => { if (phase) return; guess.has(i) ? guess.delete(i) : guess.add(i); c.classList.toggle("pp6-guess", guess.has(i)); });
    return { c, fb }; });
  const go = h("button", { class: "big", onclick: () => { if (!guess.size) return api.hint("먼저 전개도가 될 수 있다고 생각하는 것을 눌러 ‘예상’ 표시를 해요."); phase = 1; go.disabled = true; cards.forEach(x => x.fb.style.display = "block");
    api.hint("이제 하나씩 ‘접어 보기’를 눌러 예상이 맞았는지 확인해요."); } }, "예상 끝 · 하나씩 접어 보기");
  function fin() { const ok = opt.cards.map((C, i) => C.ok ? i : -1).filter(i => i >= 0), right = ok.length === guess.size && ok.every(i => guess.has(i));
    pp6Then(body, api, opt, "예상: " + [...guess].sort().map(i => opt.cards[i].name).join(","), right ? "예상이 모두 맞았어요!" : "모두 접어 보았어요. 예상과 다른 것이 있었네요."); }
  api.provide({ words: ["밑면 2개", "옆면은 한 밑면의 변의 수만큼", "겹치는 면이 없어야", "맞닿는 선분의 길이가 같게"], answers: [] });
  body.append(h("div", { class: "pp6small" }, "① 전개도가 될 수 있을 것 같은 그림을 눌러 ‘예상’ 표시를 해요. ② ‘예상 끝’을 누른 뒤 하나씩 접어 보아요."), h("div", { class: "pp6cards", style: `grid-template-columns:repeat(auto-fill,minmax(${opt.cardW || "11em"},1fr))` }, ...cards.map(x => x.c)), h("div", { class: "actions" }, go));
}

/* 접었을 때 만나는 면 찾기(전개도에 꼭짓점 이름) */
function pp6NetFaces(body, api, opt) {
  const S = opt.S, U = pp6Unfold(S, opt.nodes, opt.rot || 0), faces = pp6Faces(S, U);
  const pts = []; faces.forEach(f => f.P.forEach(p => { if (!pts.some(q => pp6Same(p, q))) pts.push(p); }));
  pts.sort((a, b) => (b[1] - a[1]) || (a[0] - b[0]));
  const lab = p => PP6_JA[pts.findIndex(q => pp6Same(p, q))];
  const fname = i => { const L = faces[i].P.map(lab), k = L.indexOf([...L].sort((a, b) => PP6_JA.indexOf(a) - PP6_JA.indexOf(b))[0]); return "면 " + L.slice(k).concat(L.slice(0, k)).join(""); };
  const tgt = opt.target, adj = faces.map((f, i) => i !== tgt && S.F[f.f].filter(v => S.F[faces[tgt].f].includes(v)).length === 2), sel = new Set(); let fin = false;
  const col = () => faces.map((f, i) => i === tgt ? "#FFD27A" : sel.has(i) ? "#9CC3F0" : "#FFFFFF");
  const box = h("div");
  const draw = () => { box.innerHTML = ""; const N = pp6NetSvg(faces, { s: opt.s || 26, pad: 26, tapF: true, col: col(), vlab: pts.map(p => ({ p, t: lab(p) })), maxW: "24em" }); box.append(N.svg);
    N.svg.addEventListener("click", e => { const k = e.target.dataset && e.target.dataset.k; if (!k) return; const i = +k.slice(1); if (fin) return; if (i === tgt) return api.hint(`노란 면이 ${fname(tgt)}이에요. 이 면과 만나는 면을 눌러요.`); sel.has(i) ? sel.delete(i) : sel.add(i); draw(); kick(); });
    read.textContent = sel.size ? "고른 면: " + [...sel].map(fname).join(", ") : "아직 고른 면이 없어요."; };
  const read = h("div", { class: "pp6read" });
  const ans = faces.map((_, i) => i).filter(i => adj[i]);
  api.provide({ words: ans.map(fname), answers: [ans.map(fname).join(", ")] });
  const check = () => {
    if (fin) return true; api.tryOnce(); const got = [...sel].map(fname).join(", ") || "-";
    const ex = [...sel].find(i => !adj[i]); if (ex != null) { api.fail(`${pp6Jo(fname(ex), "은/는")} 접었을 때 ${pp6Jo(fname(tgt), "과/와")} 만나지 않아요. 접으면 서로 마주 보게 되는 면이에요.`, got); return false; }
    if (sel.size < ans.length) { api.fail(`아직 더 있어요. 만나는 면은 모두 ${ans.length}개예요.`, got); return false; }
    fin = true; pp6Then(body, api, opt, got, opt.msg || `${pp6Jo(fname(tgt), "과/와")} 만나는 면은 ${ans.map(fname).join(", ")}이에요.`); return true;
  };
  const kick = autoRun(() => sel.size >= ans.length, () => [...sel].sort().join(","), check, 1200);
  body.append(h("div", { class: "jua" }, `전개도를 접었을 때 ${pp6Jo(fname(tgt), "과/와")} 만나는 면을 모두 눌러 보세요.`), box, read);
  draw();
}

/* ---------- 모눈에 전개도 그리기 ----------
   opt.S(입체도형), opt.nodes(전개도 마디 전체 = 정답 예시), opt.given(주어진 마디 번호), opt.cols·rows(모눈 칸 수), opt.at [x, y](정답 예시를 놓을 칸)
   opt.store·opt.differ: 앞에서 그린 것과 다른 모양으로 그리게 할 때 */
function pp6Cong(P, Q) {
  if (P.length !== Q.length) return false;
  for (const mir of [false, true]) { const R = mir ? Q.map(([x, y]) => [-x, y]).reverse() : Q, n = R.length;
    for (let o = 0; o < n; o++) { const T = pp6Rigid(R[o], R[(o + 1) % n], P[0], P[1]); if (R.every((_, j) => pp6Same(T(R[(j + o) % n]), P[j]))) return true; } }
  return false;
}
const pp6IsRect = P => P.length === 4 && P.every((p, i) => { const a = P[(i + 3) % 4], c = P[(i + 1) % 4]; return Math.abs((a[0] - p[0]) * (c[0] - p[0]) + (a[1] - p[1]) * (c[1] - p[1])) < 1e-6; });
/* 평면 다각형들(시계 반대 방향)과 판정 결과로 접는 그림 마디 만들기 */
function pp6NodesOf(S, polys, J) {
  const n = polys.length, order = [0], pos = { 0: 0 }, nodes = [{ P: polys[0], p: -1, f: J.map[0].f }];
  for (let h0 = 0; h0 < order.length; h0++) { const i = order[h0], A = polys[i];
    for (let k = 0; k < n; k++) { if (pos[k] != null) continue; const B = polys[k];
      for (let j = 0; j < A.length; j++) { const p = A[j], r = A[(j + 1) % A.length];
        if (B.some((u, l) => pp6Same(u, r) && pp6Same(B[(l + 1) % B.length], p))) { pos[k] = order.length; order.push(k); nodes.push({ P: B, p: pos[i], f: J.map[k].f, hinge: [p, r], ang: pp6FoldAng(S, J.map[k].f, J.map[i].f) }); break; } } } }
  return nodes;
}
function pp6NetDraw(body, api, opt) {   /* 다 그리면 저절로 확인 → pp6Then → api.done( */
  const S = opt.S, cols = opt.cols, rows = opt.rows, cs = opt.cs || 22, W = cols * cs, H = rows * cs;
  const U = pp6Unfold(S, opt.nodes, opt.rot || 0), all = U.flatMap(u => u.P), x0 = Math.min(...all.map(p => p[0])), y1 = Math.max(...all.map(p => p[1]));
  const toG = p => [Math.round((opt.at[0] + p[0] - x0) * 1e6) / 1e6, Math.round((opt.at[1] + y1 - p[1]) * 1e6) / 1e6];
  const given = opt.given.map(i => pp6Clean(U[i].P.map(toG)));
  const baseL = S.L[0], nb = S.F.filter((_, fi) => pp6IsBase(S, fi)).length, nsd = S.F.length - nb;
  const drawn = []; let cur = [], fin = false;
  const svg = makeSvg(W, H, cs); svg.setAttribute("class", "pp6fig"); svg.style.maxWidth = opt.maxW || "34em";
  const lay = svgEl("g"); svg.append(lay);
  const read = h("div", { class: "pp6read" });
  const kindOf = P => pp6Cong(P, baseL) ? "base" : pp6IsRect(P) ? "side" : "etc";
  const fillOf = k => k === "base" ? PP6.base : k === "side" ? PP6.sideN : "#E2E6EA";
  const G = p => [p[0] * cs, p[1] * cs];
  const draw = () => {
    lay.innerHTML = "";
    const polys = given.concat(drawn);
    polys.forEach((P, i) => lay.append(svgEl("polygon", { points: pp6Pts(P.map(G)), fill: fillOf(kindOf(P)), "fill-opacity": i < given.length ? 1 : .85, stroke: "none", "pointer-events": "none" })));
    // 선: 다 그리면 접는 선은 점선
    polys.forEach((P, i) => P.forEach((p, j) => { const q = P[(j + 1) % P.length];
      const shared = polys.some((Q, k) => k !== i && Q.some((u, l) => pp6Same(u, q) && pp6Same(Q[(l + 1) % Q.length], p)));
      pp6Seg(lay, G(p), G(q), fin && shared ? { stroke: "#4A5A66", "stroke-width": 1.8, "stroke-dasharray": "6 4" } : { stroke: i < given.length ? PP6.ink : "#3B4B57", "stroke-width": i < given.length ? 2.4 : 2.2 }); }));
    if (cur.length) { lay.append(svgEl("polyline", { points: pp6Pts(cur.map(G)), fill: "none", stroke: PP6.blue, "stroke-width": 2.6, "pointer-events": "none" }));
      cur.forEach((p, i) => pp6Dot(lay, G(p), i === 0 ? 7 : 5, i === 0 ? PP6.org : PP6.blue)); }
    if (opt.lens) opt.lens.forEach(L => { const P = given[L.g], p = P[L.j], q = P[(L.j + 1) % P.length], c = P.reduce((a, r) => [a[0] + r[0] / P.length, a[1] + r[1] / P.length], [0, 0]);
      const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], d = [m[0] - c[0], m[1] - c[1]], l = Math.hypot(...d) || 1; pp6T(lay, (m[0] - d[0] / l * .5) * cs, (m[1] - d[1] / l * .5) * cs, L.t, 13, { fill: PP6.blue }); });
    const kinds = drawn.map(kindOf);
    read.textContent = fin ? "전개도를 완성했어요! 잘린 모서리는 실선, 잘리지 않은 모서리는 점선이에요." :
      `그린 면: 밑면 모양 ${kinds.filter(k => k === "base").length}개, 직사각형 ${kinds.filter(k => k === "side").length}개` + (kinds.includes("etc") ? `, 다른 모양 ${kinds.filter(k => k === "etc").length}개` : "") + (cur.length ? ` · 지금 찍은 점 ${cur.length}개(처음 점을 다시 누르면 면이 닫혀요)` : "");
  };
  const close = () => {
    if (cur.length < 3) return api.hint("점을 3개 이상 찍어야 면이 돼요.");
    const P = pp6Clean(cur); cur = [];
    if (P.length < 3 || !pp6Convex(P)) { draw(); return api.hint("변이 서로 엇갈렸어요. 꼭짓점을 둘레를 따라 차례대로 찍어요."); }
    const polys = given.concat(drawn);
    if (polys.some(Q => pp6Overlap(P, Q))) { draw(); return api.hint("다른 면과 겹쳐요. 겹치지 않게 다시 그려요."); }
    drawn.push(P); draw(); kick();
  };
  svg.addEventListener("click", e => { if (fin) return; const p = svgPt(svg, e), g = [Math.round(p.x / cs), Math.round(p.y / cs)];
    if (Math.hypot(p.x / cs - g[0], p.y / cs - g[1]) > .4) return;
    if (cur.length >= 3 && pp6Same(g, cur[0])) return close();
    if (cur.some(q => pp6Same(q, g))) return api.hint("이미 찍은 점이에요.");
    cur.push(g); draw(); });
  const tools = h("div", { class: "pp6btns" },
    h("button", { onclick: () => { if (!fin) close(); } }, "면 닫기"),
    h("button", { onclick: () => { if (fin) return; cur.pop(); draw(); } }, "마지막 점 지우기"),
    h("button", { onclick: () => { if (fin) return; cur = []; drawn.pop(); draw(); kick(); } }, "마지막 면 지우기"),
    h("button", { onclick: () => { if (fin) return; cur = []; drawn.length = 0; draw(); } }, "모두 지우기"));
  const foldBox = h("div");
  api.provide({ words: ["밑면 2개", `옆면 ${nsd}개`, "겹치지 않게", "맞닿는 선분의 길이를 같게"], answers: [] });
  const check = () => {
      if (fin) return true; api.tryOnce();
      const polys = given.concat(drawn), kinds = polys.map(kindOf), got = `그린 면 ${drawn.length}개`;
      const b = kinds.filter(k => k === "base").length, sd = kinds.filter(k => k === "side").length;
      if (kinds.includes("etc")) { api.fail("각기둥의 면이 아닌 모양이 있어요. 밑면은 주어진 밑면과 같은 모양, 옆면은 직사각형으로 그려요. ‘마지막 면 지우기’로 고쳐요.", got); return false; }
      if (b !== nb || sd !== nsd) { api.fail(`밑면은 ${nb}개, 옆면은 한 밑면의 변의 수만큼 ${nsd}개 있어야 해요. 지금은 밑면 ${b}개, 옆면 ${sd}개예요.`, got); return false; }
      const J = pp6Judge(S, polys);
      if (!J.ok) { api.fail({ apart: "다른 면과 떨어져 있는 면이 있어요. 면의 한 변이 다른 면의 한 변과 꼭 맞닿게 그려요.", part: "맞닿는 선분의 길이가 같지 않은 곳이 있어요. 서로 맞닿는 두 선분의 길이를 같게 그려요.",
        len: "접었을 때 서로 맞닿는 선분의 길이가 같지 않아요. 옆면의 가로는 맞닿는 밑면의 변의 길이와 같아야 해요.", dup: "접으면 서로 겹치는 면이 있어요. 두 밑면이 옆면의 같은 쪽에 있거나, 같은 자리로 가는 옆면이 둘 있는지 살펴봐요.",
        flat: "겹친 면이 있어요.", count: "면의 수가 맞지 않아요.", shape: "접었을 때 면이 제자리에 맞지 않아요. 밑면의 각 변에 그 변의 길이와 같은 옆면이 오도록 그려요." }[J.why] || "다시 살펴봐요.", got); return false; }
      const key = drawn.map(P => P.map(p => p.join(",")).sort().join(";")).sort().join("|");
      if (opt.differ && opt.store && opt.store.key === key) { api.fail("앞에서 완성한 전개도와 같은 모양이에요. 면을 다른 자리에 붙여 다른 모양으로 완성해 봐요.", got); return false; }
      if (opt.store) opt.store.key = key;
      fin = true; draw();
      const nodes = pp6NodesOf(S, polys.map(P => pp6Clean(P.map(([x, y]) => [x, -y]))), J);
      foldBox.append(h("div", { class: "pp6btns" }, h("button", { class: "ghost", onclick: e => { e.currentTarget.disabled = true; const F = pp6FoldSvg(S, nodes, { W: 360, H: 260, maxW: "22em" }); foldBox.append(F.svg); let t = 0; const iv = setInterval(() => { if (!F.svg.isConnected || t >= 1) { clearInterval(iv); return; } t = Math.min(1, t + .03); F.set(t); }, 40); } }, "내 전개도 접어 보기")));
      pp6Then(body, api, opt, got, opt.msg || "각기둥의 전개도를 완성했어요.");
      return true;
  };
  const kick = autoRun(() => !cur.length && given.length + drawn.length >= S.F.length, () => drawn.map(P => P.map(p => p.join(",")).join(";")).join("|"), check, 1200);
  body.append(h("div", { class: "pp6small" }, "모눈 한 칸은 1 cm예요. 모눈의 점을 차례대로 눌러 면의 꼭짓점을 찍고, 처음 점을 다시 누르면(또는 ‘면 닫기’) 면이 그려져요. 면을 모두 그리면 저절로 확인해요."), svg, tools, read, foldBox);
  draw();
}

/* ---------- 이쑤시개·스타이로폼 공 모형 세기 ---------- */
function pp6Skeleton(body, api, opt) {   /* 끝나면 pp6Then → api.done( */
  const S = opt.S, te = {}, tv = {}; let ne = 0, nv = 0;
  const read = h("div", { class: "pp6read" });
  const T = pp6Turnable({ W: 360, H: 290, maxW: "23em", fill: .4, yaw: opt.yaw, pitch: opt.pitch, solid: () => ({ solid: S, skel: true }),
    after: (svg, I) => {
      [...S.E.keys()].forEach(k => { const [a, b] = k.split("-").map(Number); pp6Seg(svg, I.S2[a], I.S2[b], { stroke: te[k] ? PP6.org : PP6.stick, "stroke-width": te[k] ? 7 : 5.5 });
        const e = svgEl("line", { x1: pp6R(I.S2[a][0]), y1: pp6R(I.S2[a][1]), x2: pp6R(I.S2[b][0]), y2: pp6R(I.S2[b][1]), stroke: "rgba(0,0,0,0)", "stroke-width": 16, class: "pp6hit" }); e.dataset.k = "e" + k; svg.append(e);
        if (te[k]) { const m = [(I.S2[a][0] + I.S2[b][0]) / 2, (I.S2[a][1] + I.S2[b][1]) / 2]; pp6T(svg, m[0], m[1] - 10, String(te[k]), 13, { fill: "#9A4A00" }); } });
      S.V.forEach((v, i) => { const c = svgEl("circle", { cx: pp6R(I.S2[i][0]), cy: pp6R(I.S2[i][1]), r: 9, fill: tv[i] ? "#9CC3F0" : PP6.ball, stroke: "#55606A", "stroke-width": 1.8, class: "pp6hit" }); c.dataset.k = "v" + i; svg.append(c);
        if (tv[i]) pp6T(svg, I.S2[i][0], I.S2[i][1], String(tv[i]), 11, { fill: "#1F4F8A", stroke: "none" }); });
    },
    onTap: k => { if (k[0] === "e") { const key = k.slice(1); if (te[key]) return; te[key] = ++ne; } else { const i = +k.slice(1); if (tv[i]) return; tv[i] = ++nv; } T.draw(); say();
      if (ne === S.E.size && nv === S.V.length) pp6Then(body, api, opt, `이쑤시개 ${ne}개, 공 ${nv}개`, `이쑤시개 ${ne}개, 스타이로폼 공 ${nv}개를 모두 세었어요.`); } });
  const say = () => { read.textContent = `센 이쑤시개 ${ne}개 · 센 스타이로폼 공 ${nv}개`; };
  api.provide({ words: ["이쑤시개 = 모서리", "스타이로폼 공 = 꼭짓점"], answers: [] });
  body.append(h("div", { class: "pp6small" }, "이쑤시개(막대)와 스타이로폼 공을 하나씩 눌러 세어 보세요. 누른 것에는 차례대로 번호가 붙어요. 돌려 가며 빠짐없이 세어요."), T.svg, T.tools, read,
    h("div", { class: "pp6btns" }, h("button", { onclick: () => { for (const k in te) delete te[k]; for (const k in tv) delete tv[k]; ne = nv = 0; T.draw(); say(); } }, "처음부터 다시 세기")));
  say();
}

/* ---------- 표 채우기: rows [[글 또는 {n, why}…]] ---------- */
function pp6Table(body, api, opt) {   /* 다 쓰면 저절로 확인 → pp6Then → api.done( */
  const ins = []; let fin = false;
  const tb = h("table", {}, h("tr", {}, ...opt.head.map(t => h("th", {}, t))), ...opt.rows.map(r => h("tr", {}, ...r.map(c => {
    if (c && c.n != null) { const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": "답" }); ins.push({ inp, c }); return h("td", {}, inp); }
    if (typeof c === "function") return h("td", { style: "width:5.5em" }, c());
    return h("td", {}, c); }))));
  api.provide({ words: [], answers: opt.rows.map(r => r.map(c => c && c.n != null ? c.n : typeof c === "function" ? "" : c).join(" ")) });
  const check = () => {
    if (fin) return true; api.tryOnce(); const got = ins.map(x => x.inp.value.trim() || "-").join(",");
    ins.forEach(x => { x.inp.style.borderColor = pp6Num(x.inp.value) === x.c.n ? "var(--ok)" : "var(--no)"; });
    const bad = ins.find(x => pp6Num(x.inp.value) !== x.c.n);
    if (bad) { api.fail((bad.c.why && bad.c.why[String(pp6Num(bad.inp.value))]) || opt.bad || "빨간 칸을 다시 세어 봐요.", got); return false; }
    fin = true; ins.forEach(x => { x.inp.readOnly = true; }); pp6Then(body, api, opt, got, opt.msg); return true;
  };
  const kick = autoRun(() => ins.every(x => x.inp.value.trim() !== ""), () => ins.map(x => x.inp.value.trim()).join("\u0001"), check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  ins.forEach(x => { x.inp.addEventListener("input", e => { x.inp.style.borderColor = ""; if (!e.isComposing) later(900); });
    x.inp.addEventListener("change", () => later(200));
    x.inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); x.inp.blur(); } }); });
  body.append(...(opt.q ? [h("div", { class: "jua" }, opt.q)] : []), h("div", { class: "pp6tbl" }, tb));
}

/* ---------- 스스로 평가하기 ---------- */
function pp6Self(body, api, opt) {   /* 모두 고르면 api.done( */
  const st = opt.items.map(() => null); let fin = false;
  const C = ["◎ 잘했어요", "○ 보통이에요", "△ 더 노력할래요"];
  const go = () => { if (fin || st.some(v => v == null)) return; fin = true; api.tryOnce(); const low = opt.items.filter((_, i) => st[i] === 2);
    api.done(st.map(v => C[v][0]).join(""), low.length ? "스스로 평가했어요. △ 표시한 내용은 그 차시를 다시 열어 복습해 봐요." : "스스로 평가했어요. 잘했어요!"); };
  body.append(h("div", { class: "pp6small" }, "물음마다 하나씩 고르면 저절로 끝나요."), h("div", { class: "pp6self" }, ...opt.items.map((q, i) => { const row = h("div", { class: "pp6btns" });
    C.forEach((t, k) => row.append(h("button", { onclick: e => { if (fin) return; st[i] = k; [...row.children].forEach(b => b.classList.remove("pp6-pick")); e.currentTarget.classList.add("pp6-pick"); setTimeout(go, 260); } }, t)));
    return h("div", {}, h("div", { class: "jua" }, q), row); })));
  api.provide({ words: [], answers: [] });
}

/* ---------- 놀이 카드(이 앱이 정한 카드 12장) ---------- */
const PP6_EL = { face: "면의 수", edge: "모서리의 수", vert: "꼭짓점의 수", side: "옆면의 수" };
const PP6_CARDS = [
  { k: "prism", n: 3, e: "face", s: 1 }, { k: "pyr", n: 4, e: "edge", s: 1 }, { k: "prism", n: 5, e: "vert", s: 1 }, { k: "pyr", n: 6, e: "face", s: -1 },
  { k: "prism", n: 3, e: "vert", s: 1 }, { k: "prism", n: 4, e: "edge", s: -1 }, { k: "pyr", n: 5, e: "face", s: 1 }, { k: "prism", n: 6, e: "edge", s: 1 },
  { k: "pyr", n: 7, e: "vert", s: -1 }, { k: "prism", n: 8, e: "face", s: 1 }, { k: "pyr", n: 3, e: "edge", s: -1 }, { k: "prism", n: 5, e: "side", s: 1 }];
PP6_CARDS.forEach((c, i) => { c.id = i; c.name = pp6Name(c.k, c.n); c.v = pp6Cnt(c.k, c.n)[c.e]; c.code = `${c.n}${c.k === "prism" ? "▭" : "△"}${c.v}`; });
function pp6CardFig(c) { return pp6Fig({ solid: c.k === "prism" ? pp6PrN(c.n, 1.3, 1.1, c.n === 4 ? 45 : c.n === 8 ? 22.5 : null) : pp6PyN(c.n, 1.7, 1.1, c.n === 4 ? 45 : null), W: 140, H: 100, plain: true, maxW: "100%", pad: 8, yaw: -18, pitch: 20, side: c.k === "prism" ? "#FFF1C7" : "#FBE0E6", fc: c.k === "prism" ? ["#F7C9A3", "#F7C9A3"] : ["#F7C9A3"] }); }
function pp6CardFace(c, o = {}) {
  return h("div", { class: "pp6gc" + (o.cls ? " " + o.cls : "") }, o.noSign ? null : h("div", { class: "pp6sg", style: `color:${c.s > 0 ? PP6.red : PP6.blue}` }, c.s > 0 ? "+" : "−"), pp6CardFig(c),
    h("div", { class: "pp6gt" }, c.name), h("div", { class: "pp6gt", style: "color:#7A4E00" }, PP6_EL[c.e]), h("div", { class: "pp6mk" }, "이 앱이 정한 카드"));
}
/* 구성 요소의 수를 더하고 빼기 놀이: 나 + 컴퓨터 친구 2명 */
function pp6PlusGame(body, api, opt) {
  const NM = ["나", "친구 1", "친구 2"];
  let start = 10, end = 45, deck, pl, cur, p, phase = "set", pick = null, passes = 0, miss = 0, right = 0, total = 0, solved = false, timer = null, log = "";
  const wrap = h("div"); body.append(wrap);
  api.provide({ words: ["끝 수 미만이면 카드 한 장 가져오기", "끝 수 이상이면 카드를 모두 내려놓기"], answers: [] });
  const setUI = () => { wrap.innerHTML = "";
    const sb = h("div", { class: "pp6btns" }, h("span", { class: "pp6small" }, "시작 수:"), ...[8, 9, 10].map(v => h("button", { class: v === start ? "pp6-pick" : "", onclick: () => { start = v; setUI(); } }, String(v))));
    const eb = h("div", { class: "pp6btns" }, h("span", { class: "pp6small" }, "끝 수:"), ...Array.from({ length: 11 }, (_, i) => 40 + i).map(v => h("button", { class: v === end ? "pp6-pick" : "", onclick: () => { end = v; setUI(); } }, String(v))));
    wrap.append(h("div", { class: "jua" }, "① 시작 수는 8, 9, 10 중에서, 끝 수는 40부터 50까지의 자연수 중에서 정해요."), sb, eb,
      h("div", { class: "pp6small" }, "카드는 이 앱이 정한 12장을 두 벌(24장) 섞어 써요. 한 사람당 3장씩 나누어 가져요."), h("div", { class: "pp6btns" }, h("button", { class: "ghost", onclick: begin }, "놀이 시작"))); };
  function begin() { deck = pp6Shuffle([...PP6_CARDS, ...PP6_CARDS].map(c => c.id)); pl = NM.map(n => ({ n, hand: [deck.pop(), deck.pop(), deck.pop()], out: false })); cur = start; p = 0; passes = 0; phase = "me"; pick = null; log = `시작 수는 ${start}, 끝 수는 ${pp6Jo(end, "이에요/예요")}. 가위바위보로 정한 순서대로 해요. 내 차례예요. 낼 카드를 골라요.`; render(); }
  const live = () => pl.filter(x => !x.out);
  const can = id => cur + PP6_CARDS[id].s * PP6_CARDS[id].v >= 0;   // 0보다 작아지는 뺄셈은 하지 않아요(6학년은 음수를 배우지 않아요)
  function render() {
    wrap.innerHTML = "";
    wrap.append(h("div", { class: "pp6table" }, ...pl.map((x, i) => h("div", { class: "pp6pl" + (i === p && phase !== "over" ? " pp6-turn" : "") + (x.out ? " pp6-out" : "") }, x.n, h("div", {}, x.out ? "카드를 모두 내려놓음" : `가진 카드 ${x.hand.length}장`)))),
      h("div", { class: "pp6row" }, h("div", { style: "flex:0 1 11em" }, h("div", { class: "pp6small" }, "지금 수"), h("div", { class: "pp6big" }, String(cur)), h("div", { class: "pp6small" }, `끝 수 ${end} · 쌓아 둔 카드 ${deck.length}장`)),
        h("div", {}, h("div", { class: "pp6read" }, log))));
    if (phase === "me" || phase === "say") {
      const me = pl[0];
      wrap.append(h("div", { class: "jua" }, "내 카드" + (phase === "me" ? " (낼 카드를 눌러요)" : "")), h("div", { class: "pp6hand" }, ...me.hand.map((id, hi) => { const el = pp6CardFace(PP6_CARDS[id], { cls: phase === "me" ? "pp6-on" : (pick === hi ? "pp6-on" : "pp6-dim") }); if (phase === "me") el.addEventListener("click", () => { if (!can(id)) return api.hint(`지금 수 ${cur}에서 ${pp6Jo(PP6_CARDS[id].v, "을/를")} 빼면 0보다 작아져서 낼 수 없어요. 다른 카드를 골라요.`); pick = hi; phase = "say"; miss = 0; log = "카드를 냈어요. 계산한 값을 외쳐요(써요)."; render(); }); return el; })));
      if (phase === "say") { const c = PP6_CARDS[me.hand[pick]], inp = h("input", { type: "text", inputmode: "numeric", "aria-label": "계산한 값", style: "width:5em;font-size:1.2em;text-align:center" });
        const go = () => { const v = pp6Num(inp.value), ans = cur + c.s * c.v; if (isNaN(v)) return api.hint("계산한 값을 수로 써요.");
          if (v !== ans) { miss++; api.tryOnce(); if (miss === 1) return api.hint(`다시 계산해 봐요. ${c.name}의 ${pp6Jo(PP6_EL[c.e], "은/는")} 몇 개인지 먼저 세어 봐요.`);
            log = `${c.name}의 ${pp6Jo(PP6_EL[c.e], "은/는")} ${pp6Jo(c.v, "이니까/니까")} ${cur}${c.s > 0 ? "에 " + pp6Jo(c.v, "을/를") + " 더하면" : "에서 " + pp6Jo(c.v, "을/를") + " 빼면"} ${pp6Jo(ans, "이에요/예요")}.`; }
          else { log = `“${c.name}의 ${pp6Jo(PP6_EL[c.e], "은/는")} ${pp6Jo(c.v, "이니까/니까")} ${cur}${c.s > 0 ? "에 " + pp6Jo(c.v, "을/를") + " 더하면" : "에서 " + pp6Jo(c.v, "을/를") + " 빼면"} ${ans}!”`; if (miss === 0) right++; }
          total++; me.hand.splice(pick, 1); pick = null; after(0, ans); };
        inp.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
        wrap.append(h("div", { class: "pp6btns" }, h("span", { class: "jua" }, `${cur} ${c.s > 0 ? "+" : "−"} (${c.name}의 ${PP6_EL[c.e]}) =`), inp, h("button", { onclick: go }, "외치기"), h("button", { onclick: () => { pick = null; phase = "me"; log = "낼 카드를 다시 골라요."; render(); } }, "카드 다시 고르기")));
        setTimeout(() => { try { inp.focus(); } catch (e) { } }, 30); }
    }
    if (phase === "over") wrap.append(h("div", { class: "pp6btns" }, h("button", { class: "ghost", onclick: setUI }, "한 판 더")));
  }
  function after(i, v) {
    cur = v; passes = 0; const x = pl[i];
    if (cur >= end) { x.out = true; x.hand = []; log += ` ${x.n === "나" ? "내가 계산한 값" : x.n + "의 값"}이 끝 수 ${end} 이상이라서 ${x.n === "나" ? "나는" : pp6Jo(x.n, "은/는")} 가진 카드를 모두 내려놓아요.`; }
    else if (deck.length) { x.hand.push(deck.pop()); log += ` 끝 수보다 작아서 카드 한 장을 가져와요.`; }
    else log += " 쌓아 둔 카드가 없어서 가져오지 못해요.";
    phase = "wait"; render(); clearTimeout(timer); timer = setTimeout(nextTurn, 1500);
  }
  function nextTurn() {
    if (!wrap.isConnected) return;
    const L = live();
    if (L.length <= 1 || L.every(x => !x.hand.length)) return over();
    do { p = (p + 1) % 3; } while (pl[p].out);
    const x = pl[p];
    if (!x.hand.length) { log = `${x.n}: 낼 카드가 없어서 차례를 넘겨요.`; phase = "wait"; render(); timer = setTimeout(nextTurn, 1200); return; }
    if (!x.hand.some(can)) { passes++; log = `${x.n}: 지금 수 ${cur}에서 뺄 수 없는 − 카드만 남아서 차례를 넘겨요.`; if (passes >= live().length) return over(); phase = "wait"; render(); timer = setTimeout(nextTurn, 1200); return; }
    if (p === 0) { phase = "me"; log = `내 차례예요. 지금 수는 ${pp6Jo(cur, "이에요/예요")}. 낼 카드를 골라요.`; render(); return; }
    // 친구: 끝 수를 넘지 않는 카드 중에서 큰 값이 되는 카드를 주로 골라요
    const opts = x.hand.map((id, hi) => ({ hi, c: PP6_CARDS[id], v: cur + PP6_CARDS[id].s * PP6_CARDS[id].v })).filter(o => o.v >= 0);
    const safe = opts.filter(o => o.v < end).sort((a, b) => b.v - a.v), ch = safe.length ? (Math.random() < .7 ? safe[0] : safe[Math.floor(Math.random() * safe.length)]) : opts.sort((a, b) => a.v - b.v)[0];
    x.hand.splice(ch.hi, 1);
    log = `${x.n}: “${ch.c.name}의 ${pp6Jo(PP6_EL[ch.c.e], "은/는")} ${pp6Jo(ch.c.v, "이니까/니까")} ${cur}${ch.c.s > 0 ? "에 " + pp6Jo(ch.c.v, "을/를") + " 더하면" : "에서 " + pp6Jo(ch.c.v, "을/를") + " 빼면"} ${ch.v}!”`;
    phase = "wait"; after(p, ch.v);
  }
  function over() {
    phase = "over"; const L = live();
    const win = L.map(x => x.n), msg = win.length === 1 ? (win[0] === "나" ? "마지막까지 남은 내가 이겼어요!" : `마지막까지 남은 ${pp6Jo(win[0], "이/가")} 이겼어요.`) : `${win.join(", ")} 모두 마지막까지 남아 함께 이겼어요.`;
    log = `놀이가 끝났어요. ${msg}`; render();
    if (!solved) { solved = true; api.done(`계산 ${right}/${total}번 한 번에 맞힘`, `놀이를 끝까지 했어요. 내가 한 번에 바르게 계산한 횟수는 ${total}번 중 ${right}번이에요. ‘한 판 더’로 또 해도 좋아요.`); }
  }
  setUI();
}
/* 암호 놀이: 펼친 카드 5장 중 암호에 맞는 카드 찾기(5회) */
function pp6CodeGame(body, api, opt) {
  let deck, up, round, got, target, solved = false;
  const wrap = h("div"); body.append(wrap);
  api.provide({ words: ["암호 = 옆면의 수 + 옆면 모양 기호 + 카드에 적힌 구성 요소의 수", "직사각형 ▭, 삼각형 △"], answers: [] });
  const uniq = id => up.filter(j => PP6_CARDS[j].code === PP6_CARDS[id].code).length === 1;
  function start() { deck = pp6Shuffle(PP6_CARDS.map(c => c.id)); up = deck.splice(0, 5); round = 0; got = 0; nextRound("카드 5장을 펼쳤어요. 친구가 암호를 적어 보여 줘요."); }
  function nextRound(m) { if (round >= 5) return over(); round++; const c = up.filter(uniq); target = c[Math.floor(Math.random() * c.length)]; render(m); }
  function render(m) {
    wrap.innerHTML = "";
    wrap.append(h("div", { class: "pp6row" }, h("div", { style: "flex:0 1 12em;text-align:center" }, h("div", { class: "pp6small" }, `${round}번째 암호`), h("div", { class: "pp6big", style: "letter-spacing:.08em" }, PP6_CARDS[target].code)),
      h("div", {}, h("div", { class: "pp6read" }, m || ""), h("div", { class: "pp6small" }, `가져온 카드 ${got}장 · 남은 카드 ${deck.length}장`))),
      h("div", { class: "jua" }, "어떤 카드의 암호일까요? 카드를 눌러요."),
      h("div", { class: "pp6hand" }, ...up.map(id => { const el = pp6CardFace(PP6_CARDS[id], { cls: "pp6-on", noSign: true }); el.addEventListener("click", () => tap(id)); return el; })));
  }
  function tap(id) {
    api.tryOnce(); const c = PP6_CARDS[id], t = PP6_CARDS[target];
    if (id !== target) return api.fail(`${c.name} 카드의 암호는 옆면의 수 ${c.n}, 옆면 모양 ${c.k === "prism" ? "▭" : "△"}, ${PP6_EL[c.e]} ${pp6Jo(c.v, "을/를")} 차례로 쓴 ${pp6Jo(c.code, "이에요/예요")}. 다시 찾아봐요.`, c.code);
    got++; up.splice(up.indexOf(id), 1); if (deck.length) up.push(deck.pop());
    api.hint(`○ 맞아요! ${t.name}의 옆면은 ${t.n}개이고 ${t.k === "prism" ? "직사각형" : "삼각형"}, ${pp6Jo(PP6_EL[t.e], "은/는")} ${pp6Jo(t.v, "이라서/라서")} 암호는 ${pp6Jo(t.code, "이에요/예요")}.`);
    nextRound(`${t.name} 카드를 가져왔어요.`);
  }
  function over() { wrap.innerHTML = ""; wrap.append(h("div", { class: "pp6read" }, `5번 모두 찾았어요. 가져온 카드 ${got}장!`), h("div", { class: "pp6btns" }, h("button", { class: "ghost", onclick: start }, "한 판 더")));
    if (!solved) { solved = true; api.done("암호 5개 찾음", "암호 놀이를 끝까지 했어요."); } }
  start();
}
/* 내가 암호 만들기 */
function pp6CodeMake(body, api, opt) {   /* 다 쓰면 저절로 확인 → api.done( */
  let fin = false;
  const ids = opt.ids, rows = ids.map(id => { const c = PP6_CARDS[id], a = h("input", { type: "text", inputmode: "numeric", "aria-label": "옆면의 수", style: "width:3em;text-align:center" }), b = h("input", { type: "text", inputmode: "numeric", "aria-label": "구성 요소의 수", style: "width:3em;text-align:center" });
    let sh = null; const sb = h("span", { class: "pp6btns", style: "display:inline-flex;margin:0 .3em" }, ...["▭", "△"].map(t => h("button", { onclick: e => { if (fin) return; sh = t; [...sb.children].forEach(x => x.classList.remove("pp6-pick")); e.currentTarget.classList.add("pp6-pick"); later(600); } }, t)));
    return { c, a, b, sh: () => sh, el: h("div", { class: "pp6row", style: "align-items:center" }, h("div", { style: "flex:0 1 9em" }, pp6CardFace(c, { noSign: true })), h("div", {}, h("span", { class: "jua" }, "암호: "), a, sb, b)) }; });
  api.provide({ words: ids.map(id => PP6_CARDS[id].code), answers: ids.map(id => `${PP6_CARDS[id].name}·${PP6_EL[PP6_CARDS[id].e]}: ${PP6_CARDS[id].code}`) });
  const got = () => rows.map(r => `${r.a.value}${r.sh() || "?"}${r.b.value}`).join(", ");
  const check = () => {
    if (fin) return true; api.tryOnce();
    for (const r of rows) { const c = r.c;
      if (pp6Num(r.a.value) !== c.n) { api.fail(`${c.name}의 옆면의 수를 다시 세어 봐요. 옆면의 수는 밑면의 변의 수와 같아요.`, got()); return false; }
      if (r.sh() !== (c.k === "prism" ? "▭" : "△")) { api.fail(`${c.name}의 옆면은 ${c.k === "prism" ? "직사각형이라서 ▭" : "삼각형이라서 △"}를 골라요.`, got()); return false; }
      if (pp6Num(r.b.value) !== c.v) { api.fail(`${c.name}의 ${pp6Jo(PP6_EL[c.e], "을/를")} 다시 세어 봐요.`, got()); return false; } }
    fin = true; rows.forEach(r => { r.a.readOnly = r.b.readOnly = true; }); api.done(got(), opt.ok || "암호를 바르게 만들었어요."); return true;
  };
  const kick = autoRun(() => rows.every(r => r.a.value.trim() && r.b.value.trim() && r.sh()), got, check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  rows.forEach(r => [r.a, r.b].forEach(inp => { inp.addEventListener("input", e => { if (!e.isComposing) later(900); }); inp.addEventListener("change", () => later(200));
    inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); inp.blur(); } }); }));
  body.append(h("div", { class: "pp6small" }, "카드마다 옆면의 수, 옆면 모양 기호, 카드에 적힌 구성 요소의 수를 차례로 넣어요. 다 쓰면 저절로 확인해요."), ...rows.map(r => r.el));
}

/* ---------- 문제 그림 도우미 ---------- */
/* 표시가 있는 입체도형 그림: marks [{a, b, t, col, dash, w, at}] — a·b는 꼭짓점 번호 또는 [x,y,z], b가 없으면 점 */
function pp6Lab(o) {
  return pp6Fig(Object.assign({ W: 300, H: 240, maxW: "17em", pad: 30 }, o, { after: (svg, I) => {
    const S = o.solid, P = q => typeof q === "number" ? S.V[q] : q, cs = S.V.map(v => I.P(v)), C = cs.reduce((a, p) => [a[0] + p[0] / cs.length, a[1] + p[1] / cs.length], [0, 0]);
    (o.marks || []).forEach(m => {
      const A = I.P(P(m.a)), B = m.b != null ? I.P(P(m.b)) : null, col = m.col || PP6.red;
      if (B) pp6Seg(svg, A, B, { stroke: col, "stroke-width": m.w || 3, "stroke-dasharray": m.dash ? "6 4" : null });
      else if (!m.nodot) pp6Dot(svg, A, 5, col);
      const M = B ? [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2] : A, d = [M[0] - C[0], M[1] - C[1]], l = Math.hypot(...d) || 1, k = m.off == null ? 18 : m.off;
      const at = m.at ? [M[0] + m.at[0], M[1] + m.at[1]] : [M[0] + d[0] / l * k, M[1] + d[1] / l * k];
      if (m.t) pp6T(svg, at[0], at[1], m.t, m.size || (m.t.length > 2 ? 16 : 21), { fill: col, "font-weight": 700 });
    });
    if (o.after2) o.after2(svg, I);
  } }));
}
/* 이 단원의 물건·건물 그림 */
const PP6_OBJ = {
  snack: { n: "과자 상자", k: "prism", o: () => ({ solid: pp6PrN(3, 2.6, .8, -90), tilt: 90, yaw: -30, pitch: 22, side: "#F6B26B", fc: ["#E69138", "#E69138"] }) },
  parcel: { n: "택배 상자", k: "prism", o: () => ({ solid: pp6Prism([[-1.2, -.9], [1.2, -.9], [1.2, .9], [-1.2, .9]], 1.4), yaw: -28, pitch: 24, side: "#D9B38C", fc: [null, "#C99D6E"] }) },
  pencil: { n: "연필꽂이", k: "prism", o: () => ({ solid: pp6PrN(6, 2, .8, 0), yaw: -15, pitch: 24, side: "#9FC5E8", fc: ["#6FA8DC", "#FFFFFF"] }) },
  tower: { n: "석탑의 몸돌", k: "prism", o: () => ({ solid: pp6Prism([[-1, -1], [1, -1], [1, 1], [-1, 1]], 1.2), yaw: -30, pitch: 22, side: "#C9C9C9", fc: [null, "#B0B0B0"] }) },
  case: { n: "필통", k: "prism", o: () => ({ solid: pp6Prism([[-.45, -.4], [.45, -.4], [.45, .4], [-.45, .4]], 3), tilt: 90, yaw: -25, pitch: 25, side: "#B4A7D6", fc: ["#8E7CC3", "#8E7CC3"] }) },
  tissue: { n: "휴지 상자", k: "prism", o: () => ({ solid: pp6Prism([[-1.3, -.7], [1.3, -.7], [1.3, .7], [-1.3, .7]], .9), yaw: -25, pitch: 28, side: "#B6D7A8", fc: [null, "#93C47D"] }) },
  tent: { n: "인디언 텐트", k: "pyr", o: () => ({ solid: pp6PyN(6, 2.4, 1.1, 0), yaw: -15, pitch: 16, side: "#B6D7A8", fc: ["#6AA84F"] }) },
  louvre: { n: "루브르 피라미드", k: "pyr", o: () => ({ solid: pp6Pyramid([[-1.2, -1.2], [1.2, -1.2], [1.2, 1.2], [-1.2, 1.2]], 1.5), yaw: -30, pitch: 16, side: "#CFE2F3", fc: ["#9FC5E8"] }) },
  pyramid: { n: "피라미드", k: "pyr", o: () => ({ solid: pp6Pyramid([[-1.2, -1.2], [1.2, -1.2], [1.2, 1.2], [-1.2, 1.2]], 1.6), yaw: -38, pitch: 16, side: "#F1D99A", fc: ["#D9B85F"] }) },
  puzzle: { n: "각뿔 모양 퍼즐", k: "pyr", o: () => ({ solid: pp6PyN(3, 1.8, 1.2, -67), yaw: -20, pitch: 18, side: "#F4CCCC", fc: ["#E06666"] }) }
};
function pp6ObjFig(key, o2 = {}) { const ob = PP6_OBJ[key]; return pp6Fig(Object.assign({ W: 150, H: 120, plain: true, maxW: "100%", pad: 12, hidden: "none" }, ob.o(), o2)); }
/* 건물(7차시): 각뿔·각기둥 모양 건물, 앞면에 문 */
const PP6_BLD = [{ k: "pyr", n: 4 }, { k: "pyr", n: 5 }, { k: "prism", n: 3 }, { k: "pyr", n: 6 }, { k: "prism", n: 4 }, { k: "prism", n: 6 }];
function pp6BldFig(i) {
  const b = PP6_BLD[i], S = b.k === "prism" ? (b.n === 3 ? pp6Prism(pp6Ngon(3, 1.2, -90), 1.7) : pp6PrN(b.n, b.n === 4 ? 2.2 : 1.6, 1.1, b.n === 4 ? 45 : 0)) : pp6PyN(b.n, 2, 1.25, b.n === 4 ? 45 : b.n === 6 ? 0 : -90);
  return pp6Fig({ solid: S, W: 150, H: 130, plain: true, maxW: "100%", pad: 12, yaw: -20, pitch: 14, hidden: "none", side: b.k === "pyr" ? "#F9E1C8" : "#DDE8F3", fc: b.k === "pyr" ? ["#E8B58A"] : ["#A9C4DE", "#A9C4DE"] });
}
/* 꼭짓점 이름이 붙은 입체도형 */
const pp6PrL = (base, H, o2 = {}) => { const S = pp6Prism(base, H); return Object.assign({ S, lab: pp6PrLab(S.n) }, o2); };
const pp6PyL = (base, H, o2 = {}) => { const S = pp6Pyramid(base, H); return Object.assign({ S, lab: pp6PyLab(S.n) }, o2); };

/* 이쑤시개·공 모형 그림(움직이지 않는 그림) */
function pp6SkelFig(S) {
  return pp6Fig({ solid: S, skel: true, W: 150, H: 120, plain: true, maxW: "100%", pad: 12, yaw: -22, pitch: 22, after: (svg, I) => {
    [...S.E.keys()].forEach(k => { const [a, b] = k.split("-").map(Number); pp6Seg(svg, I.S2[a], I.S2[b], { stroke: PP6.stick, "stroke-width": 4 }); });
    S.V.forEach((v, i) => svg.append(svgEl("circle", { cx: pp6R(I.S2[i][0]), cy: pp6R(I.S2[i][1]), r: 6, fill: "#fff", stroke: "#55606A", "stroke-width": 1.5 }))); } });
}
/* 두 친구가 각뿔의 높이를 잰 그림: n1은 바르게(수직으로 세운 자), n2는 옆 모서리에 댄 자 */
function pp6HeightPair(n1 = "채린", n2 = "하진") {
  const W = 520, H = 270, svg = makeSvg(W, H); svg.setAttribute("class", "pp6fig"); svg.style.maxWidth = "30em";
  const S = pp6Pyramid([[-1, -1], [1, -1], [1, 1], [-1, 1]], 2.4), hh = 2.4;
  const ruler = (pts) => svg.append(svgEl("polygon", { points: pp6Pts(pts), fill: "#FFF6D6", stroke: "#B8963A", "stroke-width": 1.5 }));
  // 채린: 바닥에 수직으로 세운 자 + 삼각자
  const I1 = pp6Draw(svg, { solid: S, s: 66, cx: 120, cy: 128, yaw: 0, pitch: 5, side: "#FBE0E6", fc: [PP6.base] });
  const P1 = q => I1.P(q), rx = 1.5;
  ruler([P1([rx, 0, 0]), P1([rx + .35, 0, 0]), P1([rx + .35, 3, 0]), P1([rx, 3, 0])]);
  for (let k = 0; k <= 6; k++) pp6Seg(svg, P1([rx, k / 2, 0]), P1([rx + .15, k / 2, 0]), { stroke: "#8A6D1F", "stroke-width": 1.2 });
  svg.append(svgEl("polygon", { points: pp6Pts([P1([rx, hh, 0]), P1([0, hh, 0]), P1([rx, hh + .7, 0])]), fill: "rgba(43,123,214,.22)", stroke: PP6.blue, "stroke-width": 2 }));
  pp6Seg(svg, P1([0, 0, 0]), P1([0, hh, 0]), { stroke: PP6.red, "stroke-width": 2.4, "stroke-dasharray": "6 4" });
  pp6Seg(svg, P1([-1.6, 0, 0]), P1([rx + .7, 0, 0]), { stroke: "#B9A27A", "stroke-width": 3 });
  pp6T(svg, 110, H - 16, n1, 20, { fill: PP6.purple });
  // 하진: 옆면의 모서리에 댄 자
  const I2 = pp6Draw(svg, { solid: S, s: 66, cx: 390, cy: 128, yaw: 0, pitch: 5, side: "#FBE0E6", fc: [PP6.base] });
  const A = I2.P(S.V[4]), B = I2.P(S.V[2]), d = [A[0] - B[0], A[1] - B[1]], l = Math.hypot(...d), C2 = I2.P([0, hh / 2, 0]); let n = [d[1] / l * 12, -d[0] / l * 12]; if (n[0] * ((A[0] + B[0]) / 2 - C2[0]) + n[1] * ((A[1] + B[1]) / 2 - C2[1]) < 0) n = n.map(x => -x);
  ruler([[B[0] + n[0] * .2, B[1] + n[1] * .2], [A[0] + n[0] * .2, A[1] + n[1] * .2], [A[0] + n[0] * 1.6, A[1] + n[1] * 1.6], [B[0] + n[0] * 1.6, B[1] + n[1] * 1.6]]);
  for (let k = 0; k <= 6; k++) { const t = k / 6, p = [B[0] + d[0] * t + n[0] * .2, B[1] + d[1] * t + n[1] * .2]; pp6Seg(svg, p, [p[0] + n[0] * .6, p[1] + n[1] * .6], { stroke: "#8A6D1F", "stroke-width": 1.2 }); }
  pp6Seg(svg, B, A, { stroke: PP6.red, "stroke-width": 3 });
  pp6Seg(svg, I2.P([-1.6, 0, 0]), I2.P([1.9, 0, 0]), { stroke: "#B9A27A", "stroke-width": 3 });
  pp6T(svg, 380, H - 16, n2, 20, { fill: PP6.purple });
  return svg;
}
//@@LESSONS
