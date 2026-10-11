//@@APP
const APP={title:"친환경 에너지 공원 대응 관계", unit:"5-1 수학 3. 대응 관계(교과서)", key:"t51-corresp-v1", welcome:"친환경 에너지 공원 대응 관계 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 다온이와 한결이가 친환경 에너지 공원을 둘러보며 짝을 이루어 함께 변하는 두 양을 찾고, 그 대응 관계를 표와 말, □, △ 같은 기호를 사용한 식으로 나타내요."};
//@@UNIT
/* ===== 5-1 수학 3. 대응 관계 — 단원 조작 부품 (앞글자 cr3) =====
   cr3Do     한 계단 묶음: 그림(＋/− 로 늘리고 줄이며, 세는 것을 눌러 세기) · 표 빈칸 · 말 빈칸 · 고르기 · 짝 잇기 · 기호 식 · 수 쓰기를 한 번에 채점
   cr3Cards  보기 카드를 눌러 낱말 식 만들기(곱셈식·나눗셈식 둘 다)
   cr3Find   친환경 에너지 공원 그림에서 서로 대응하는 두 양 찾기
   cr3Game   놀이: 자신만만 대응 관계(카드 뒤집기 → 기호 식 → 주사위로 점수 더하기)
   식은 표의 수를 하나하나 넣어 보아 맞는지 판단해요(곱셈식·나눗셈식, 덧셈식·뺄셈식 모두 정답).
   그림은 모두 수에서 계산해 그려요. 표·정답 식은 화면을 그릴 때 스스로 다시 검사해요(틀리면 오류를 냄). */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.cr3fig{margin:.3em 0}
.cr3fig svg{width:100%;height:auto;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;max-height:48vh}
.cr3cap{font-family:"Jua";color:var(--night);margin:.25em 0 0;text-align:center;word-break:keep-all}
.cr3step{display:flex;flex-wrap:wrap;gap:.4em;align-items:center;justify-content:center;margin:.35em 0}
.cr3step button,.cr3btn{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .7em;word-break:keep-all;font-size:1em}
.cr3step b{font-family:"Jua";font-size:1.15em;color:var(--night);min-width:6em;text-align:center}
.cr3muted{color:var(--muted);font-size:var(--fs-s);word-break:keep-all}
.cr3tbl{max-width:100%;overflow-x:auto;margin:.4em 0 .6em}
.cr3tbl table{border-collapse:collapse;background:#fff}
.cr3tbl td,.cr3tbl th{border:2px solid var(--line);padding:.25em .45em;text-align:center;white-space:nowrap}
.cr3tbl th{font-weight:normal;font-family:"Jua";color:var(--night);background:#F4F8F6;white-space:normal;word-break:keep-all;min-width:6.5em;max-width:11em;text-align:left}
.cr3tbl input{width:var(--w,3.4em);text-align:center;font-size:1em;padding:.1em}
.cr3box{border:2px dashed var(--line);border-radius:12px;padding:.5em .7em;margin:.5em 0;background:#FFFEFB}
.cr3boxt{font-family:"Jua";color:var(--night);margin-bottom:.25em;word-break:keep-all}
.cr3say p{margin:.35em 0;line-height:2.1;word-break:keep-all}
.cr3say input{width:3.4em;text-align:center;font-size:1em;padding:.05em}
.cr3slot{display:inline-flex;flex-wrap:wrap;gap:.2em;vertical-align:middle;margin:0 .15em}
.cr3slot button{border:2px solid var(--line);background:#fff;border-radius:.5em;padding:.05em .45em;font-size:.95em;word-break:keep-all}
.cr3slot button.cr3on,.cr3opts button.cr3on,.cr3pal button.cr3on{background:var(--night);color:#fff;border-color:var(--night)}
.cr3opts{display:flex;flex-wrap:wrap;gap:.35em;margin:.25em 0}
.cr3opts button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .65em;text-align:left;word-break:keep-all;max-width:100%}
.cr3q{font-family:"Jua";margin-top:.5em;word-break:keep-all}
.cr3good{border-color:var(--ok)!important;background:#E3F4EA!important;color:#1D2A2A!important}
.cr3bad{border-color:var(--no)!important;background:#FBE7E2!important;color:#1D2A2A!important}
.cr3vars{display:flex;flex-wrap:wrap;gap:.3em 1.1em;margin:.2em 0 .4em;word-break:keep-all}
.cr3vars span b{font-size:1.25em;color:#2B7BD6}
.cr3pal{display:flex;flex-wrap:wrap;gap:.25em;margin:.15em 0 .35em}
.cr3pal button{min-width:2.3em;border:2px solid var(--line);background:#fff;border-radius:.5em;font-size:1.15em;padding:.05em .3em}
.cr3eqrow{display:flex;flex-wrap:wrap;gap:.4em;align-items:center;margin:.3em 0}
.cr3eqrow input{width:11em;max-width:100%;font-size:1.2em;padding:.15em .3em}
.cr3keys{display:flex;flex-wrap:wrap;gap:.25em;margin:.35em 0}
.cr3keys button{min-width:2.4em;border:2px solid var(--line);background:#fff;border-radius:.5em;font-size:1.12em;padding:.1em .35em}
.cr3keys button.cr3sym{color:#2B7BD6;border-color:#9DC0EA}
.cr3cards{display:flex;flex-wrap:wrap;gap:.35em;margin:.4em 0}
.cr3cards button{border:2px solid #E2C9A0;background:#FFF7E8;border-radius:.6em;padding:.3em .7em;font-family:"Jua";font-size:1.05em;word-break:keep-all}
.cr3line{display:flex;flex-wrap:wrap;gap:.3em;align-items:center;min-height:2.6em;border:2px solid var(--line);border-radius:.7em;padding:.3em .5em;margin:.3em 0;background:#fff;cursor:pointer}
.cr3line.cr3cur{border-color:#2B7BD6;background:#F2F7FD}
.cr3line .cr3tk{border:2px solid #E2C9A0;background:#FFF7E8;border-radius:.5em;padding:.1em .45em;font-family:"Jua";word-break:keep-all}
.cr3line .cr3lab{color:var(--muted);font-size:var(--fs-s);margin-right:.2em}
.cr3link{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.4em 1em;margin:.4em 0}
.cr3link>div{display:flex;flex-direction:column;gap:.35em;min-width:0}
.cr3link button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.35em .5em;word-break:keep-all;text-align:left;font-size:1em}
.cr3link button.cr3pick{border-color:#2B7BD6;background:#DCEAFB}
.cr3found{display:flex;flex-direction:column;gap:.3em;margin:.4em 0}
.cr3found div{border:2px solid var(--ok);background:#E3F4EA;border-radius:.6em;padding:.25em .6em;word-break:keep-all}
.cr3promise{border:3px solid #E47A38;background:#FFF4E6;border-radius:12px;padding:.6em .8em;margin:.4em 0;font-family:"Jua";line-height:1.7;word-break:keep-all}
.cr3game{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.8em;align-items:start}
@media (max-width:900px){.cr3game{grid-template-columns:minmax(0,1fr)}}
.cr3score{font-family:"Jua";font-size:1.15em;color:var(--night)}
.cr3card{border:3px solid #9DC0EA;border-radius:14px;background:#fff;padding:.4em;min-width:0}
.cr3card svg{width:100%;height:auto;display:block}
.cr3cardt{font-family:"Jua";text-align:center;word-break:keep-all;margin:.2em 0}
.cr3log{font-size:var(--fs-s);color:var(--muted);word-break:keep-all}
`;
  document.head.append(s);
})();
let cr3Uid = 0;
const CR3SYMS = ["□", "△", "☆", "○", "◇", "♡", "▽", "⊙", "♧", "▷", "◎"];
const CR3SNAME = { "□": "네모", "△": "세모", "☆": "별", "○": "동그라미", "◇": "마름모", "♡": "하트", "▽": "역삼각형", "⊙": "점동그라미", "♧": "클로버", "▷": "삼각형", "◎": "겹동그라미" };

/* 받침 있는 말 뒤 조사: cr3J("36", "이/가") → "36이", cr3J("☆", "과/와") → "☆과" */
function cr3Jong(w) {
  const t = String(w).trim(); const last = t.slice(-1);
  if (CR3SNAME[last]) { const n = CR3SNAME[last], c = n.charCodeAt(n.length - 1); return (c - 0xAC00) % 28 !== 0; }
  const s = t.replace(/[^가-힣A-Za-z0-9]+$/, "");
  const c = s.charCodeAt(s.length - 1);
  if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 !== 0;
  if (/[0-9]$/.test(s)) { if (/0$/.test(s)) return true; return /[013678]$/.test(s); }
  return false;
}
function cr3J(w, pair) {
  const [a, b] = pair.split("/");
  if (pair === "으로/로") { const t = String(w).trim(), s = t.replace(/[^가-힣A-Za-z0-9]+$/, ""), c = s.charCodeAt(s.length - 1);
    if (c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 === 8) return w + "로";
    if (/[0-9]$/.test(s) && /[1]$/.test(s) && !/0$/.test(s)) return w + "로";
  }
  return w + (cr3Jong(w) ? a : b);
}
const cr3Fmt = v => String(Math.round(v * 1e6) / 1e6);
function cr3Mark(el, good) { el.classList.remove("cr3good", "cr3bad"); if (good != null) el.classList.add(good ? "cr3good" : "cr3bad"); }
function cr3Num(s) { const t = String(s).replace(/[\s,]/g, ""); return t === "" || isNaN(+t) ? NaN : +t; }

/* ---------- 식 판단(기호 식·낱말 식 공통) ---------- */
function cr3Norm(s) {
  return String(s).replace(/\s+/g, "").replace(/,/g, "").replace(/[xX*✕✖]/g, "×").replace(/[\/:]/g, "÷").replace(/[-–—－]/g, "−").replace(/＝/g, "=").replace(/＋/g, "+").replace(/ㅁ/g, "□").replace(/[◻⬜■]/g, "□").replace(/[▲]/g, "△").replace(/[★]/g, "☆").replace(/[◯●]/g, "○").replace(/[♥]/g, "♡");
}
function cr3Tok(s) { const t = cr3Norm(s); return t.match(/\d+(?:\.\d+)?|[+−×÷=]|./g) || []; }
const CR3OP = { "+": (a, b) => a + b, "−": (a, b) => a - b, "×": (a, b) => a * b, "÷": (a, b) => a / b };
const CR3OPN = { "+": "덧셈식", "−": "뺄셈식", "×": "곱셈식", "÷": "나눗셈식" };
/* toks: 토큰 배열, vars: {토큰: {name, v:[…]}}  → {ok, msg, op} */
function cr3Judge(toks, vars) {
  const keys = Object.keys(vars);
  if (!toks.length) return { ok: false, msg: "빈칸에 식을 써요." };
  const bad = toks.find(t => !(t in vars) && !/^\d+(\.\d+)?$/.test(t) && !(t in CR3OP) && t !== "=");
  if (bad) return { ok: false, msg: CR3SNAME[bad] ? `${cr3J(bad, "은/는")} 이 식에서 쓰지 않는 기호예요. ${keys.join(", ")} 중에서 알맞은 기호를 써요.` : `‘${bad}’는 식에 쓸 수 없어요. 기호와 수, + − × ÷ =만 써요.` };
  const eqs = toks.filter(t => t === "=").length;
  if (eqs !== 1) return { ok: false, msg: "등호(=)를 한 번 써서 식을 만들어요." };
  const k = toks.indexOf("="), L = toks.slice(0, k), R = toks.slice(k + 1);
  const isOpd = t => t in vars || /^\d/.test(t);
  const sideOk = S => S.length % 2 === 1 && S.every((t, i) => i % 2 === 0 ? isOpd(t) : t in CR3OP);
  if (!sideOk(L) || !sideOk(R)) return { ok: false, msg: "식이 덜 끝났거나 기호 순서가 어색해요. 예) △=□+1 처럼 써요." };
  const ops = toks.filter(t => t in CR3OP);
  for (const v of keys) { const c = toks.filter(t => t === v).length; if (!c) return { ok: false, msg: `두 양을 나타내는 ${keys.length === 2 && keys.every(k => k.length === 1) ? keys.join(", ") + " 기호" : "말"}를 모두 한 번씩 써서 식을 만들어요.` }; if (c > 1) return { ok: false, msg: `${cr3J(v, "을/를")} 두 번 썼어요. 두 양을 한 번씩만 써요.` }; }
  if (!ops.length) return { ok: false, msg: "두 양 사이의 관계를 + − × ÷ 중 하나를 써서 나타내요." };
  if (ops.length > 1) return { ok: false, msg: "이 단원에서는 + − × ÷ 중 한 가지 기호만 한 번 써서 나타내요." };
  const n = vars[keys[0]].v.length;
  const evalS = (S, j, sw) => { const val = t => t in vars ? vars[sw && keys.length === 2 ? keys[1 - keys.indexOf(t)] : t].v[j] : +t; let acc = val(S[0]); for (let i = 1; i < S.length; i += 2) acc = CR3OP[S[i]](acc, val(S[i + 1])); return acc; };
  const holds = sw => { for (let j = 0; j < n; j++) if (Math.abs(evalS(L, j, sw) - evalS(R, j, sw)) > 1e-9) return j; return -1; };
  const f = holds(false);
  if (f < 0) return { ok: true, op: ops[0] };
  if (keys.length === 2 && holds(true) < 0) return { ok: false, msg: keys.every(k => k.length === 1) ? `${cr3J(keys[0], "은/는")} ${vars[keys[0]].name}, ${cr3J(keys[1], "은/는")} ${cr3J(vars[keys[1]].name, "이에요/예요")}. 두 기호가 나타내는 양을 서로 바꾸어 쓴 것 같아요.` : "두 양의 자리를 서로 바꾸어 쓴 것 같아요. 어느 양이 더 큰지 다시 살펴봐요." };
  const pair = keys.map(v => `${v}=${cr3Fmt(vars[v].v[f])}`).join(", ");
  return { ok: false, msg: `표에서 ${pair}일 때를 식에 넣어 계산해 보면 등호 양쪽이 같지 않아요. 두 양이 어떻게 짝을 이루는지 다시 살펴봐요.` };
}

/* ---------- 그림(＋/− 로 늘리고 줄이기, 세는 것을 눌러 세기) ---------- */
const CR3C = { blue: "#2B7BD6", orange: "#E47A38", green: "#3E9B6A", gray: "#6B7B78", pink: "#F29BB8", yel: "#F6C85F", ink: "#1D2A2A", sky: "#DCEAFB", panel: "#2F4F7A" };
const cr3P = pts => pts.map(p => p.join(",")).join(" ");
/* 한 개씩 따로 그리는 것: d(g, add) 는 (0,0)을 가운데 아래 기준이 아닌, 가운데 x=0 기준으로 그림 */
const CR3EACH = {
  wind: { w: 130, h: 230, d(g, add) {
    g.append(svgEl("line", { x1: 0, y1: 220, x2: 0, y2: 82, stroke: "#9AA9A3", "stroke-width": 6, "stroke-linecap": "round" }));
    for (let k = 0; k < 3; k++) { const a = (-90 + 120 * k) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), px = -s, py = c;
      const tip = [58 * c, 80 + 58 * s], b1 = [7 * px + 6 * c, 80 + 7 * py + 6 * s], b2 = [-5 * px + 6 * c, 80 - 5 * py + 6 * s];
      const el = svgEl("polygon", { points: cr3P([b1, [tip[0] + 3 * px, tip[1] + 3 * py], tip, b2]), fill: "#fff", stroke: CR3C.blue, "stroke-width": 2.5, "stroke-linejoin": "round" });
      g.append(el); add(el, 34 * c, 80 + 34 * s); }
    g.append(svgEl("circle", { cx: 0, cy: 80, r: 7, fill: CR3C.gray }));
  } },
  bike: { w: 160, h: 160, d(g, add) {
    const W1 = [-40, 118], W2 = [40, 118];
    [W1, W2].forEach(p => { const el = svgEl("circle", { cx: p[0], cy: p[1], r: 27, fill: "#fff", stroke: CR3C.ink, "stroke-width": 4 }); g.append(el); g.append(svgEl("circle", { cx: p[0], cy: p[1], r: 3, fill: CR3C.ink })); add(el, p[0], p[1]); });
    g.append(svgEl("polyline", { points: cr3P([W1, [0, 118], [-14, 80], W1]), fill: "none", stroke: CR3C.orange, "stroke-width": 4, "stroke-linejoin": "round" }));
    g.append(svgEl("polyline", { points: cr3P([[0, 118], [26, 80], [-14, 80]]), fill: "none", stroke: CR3C.orange, "stroke-width": 4, "stroke-linejoin": "round" }));
    g.append(svgEl("polyline", { points: cr3P([W2, [26, 80], [30, 64], [42, 62]]), fill: "none", stroke: CR3C.orange, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" }));
    g.append(svgEl("line", { x1: -26, y1: 72, x2: -4, y2: 72, stroke: CR3C.ink, "stroke-width": 6, "stroke-linecap": "round" }));
    g.append(svgEl("line", { x1: -14, y1: 80, x2: -15, y2: 72, stroke: CR3C.ink, "stroke-width": 3 }));
  } },
  table: { w: 140, h: 170, d(g, add) {
    const legs = [[-30, 92, 142, "#B9A68A"], [46, 92, 142, "#B9A68A"], [-46, 104, 160, "#8C6F4E"], [30, 104, 160, "#8C6F4E"]];
    legs.slice(0, 2).forEach(l => { const el = svgEl("line", { x1: l[0], y1: l[1], x2: l[0], y2: l[2], stroke: l[3], "stroke-width": 7, "stroke-linecap": "round" }); g.append(el); add(el, l[0], (l[1] + l[2]) / 2 + 8); });
    g.append(svgEl("polygon", { points: cr3P([[-54, 104], [38, 104], [54, 88], [-38, 88]]), fill: "#E8C9A0", stroke: "#8C6F4E", "stroke-width": 3, "stroke-linejoin": "round" }));
    legs.slice(2).forEach(l => { const el = svgEl("line", { x1: l[0], y1: l[1], x2: l[0], y2: l[2], stroke: l[3], "stroke-width": 7, "stroke-linecap": "round" }); g.append(el); add(el, l[0], (l[1] + l[2]) / 2 + 6); });
  } },
  photo: { w: 120, h: 160, d(g, add) {
    g.append(svgEl("rect", { x: -38, y: 52, width: 76, height: 92, rx: 4, fill: "#fff", stroke: CR3C.gray, "stroke-width": 3 }));
    g.append(svgEl("rect", { x: -30, y: 60, width: 60, height: 58, fill: CR3C.sky }));
    g.append(svgEl("circle", { cx: 12, cy: 76, r: 8, fill: CR3C.yel }));
    g.append(svgEl("polygon", { points: cr3P([[-30, 118], [-8, 90], [8, 108], [18, 98], [30, 118]]), fill: CR3C.green }));
    [-24, 24].forEach(x => { const el = svgEl("rect", { x: x - 5, y: 34, width: 10, height: 26, rx: 2, fill: CR3C.orange, stroke: "#B5541C", "stroke-width": 1.5 }); g.append(el); add(el, x, 47); });
  } },
  cotton: { w: 130, h: 200, d(g, add) {
    g.append(svgEl("line", { x1: 0, y1: 70, x2: 0, y2: 118, stroke: "#B9A68A", "stroke-width": 4 }));
    [[0, 44, 26], [-18, 56, 18], [18, 56, 18], [0, 62, 20]].forEach(c => g.append(svgEl("circle", { cx: c[0], cy: c[1], r: c[2], fill: CR3C.pink, stroke: "#D86F95", "stroke-width": 2 })));
    for (let k = 0; k < 4; k++) { const x = -56 + 28 * k; const el = svgEl("rect", { x, y: 140, width: 26, height: 30, rx: 4, fill: "#FFF1D6", stroke: CR3C.orange, "stroke-width": 2 }); g.append(el); g.append(txt(x + 13, 155, "1분", 11, { fill: "#B5541C" })); add(el, x + 13, 155); }
  } },
  tball: { w: 100, h: 150, d(g) {
    g.append(svgEl("circle", { cx: 0, cy: 66, r: 34, fill: "#FFF8E4", stroke: CR3C.ink, "stroke-width": 3 }));
    g.append(svgEl("path", { d: "M-24,42 Q-6,66 -24,90 M24,42 Q6,66 24,90", fill: "none", stroke: "#D3473A", "stroke-width": 2.5, "stroke-dasharray": "5 3" }));
    g.append(txt(0, 126, "80 g", 22, { fill: CR3C.blue }));
  } },
  fan: { w: 150, h: 210, d(g, add) {
    g.append(svgEl("line", { x1: 0, y1: 140, x2: 0, y2: 192, stroke: "#9AA9A3", "stroke-width": 7 }));
    g.append(svgEl("ellipse", { cx: 0, cy: 196, rx: 40, ry: 9, fill: "#C9D6D1" }));
    g.append(svgEl("circle", { cx: 0, cy: 80, r: 62, fill: "#F7FBFF", stroke: "#9AA9A3", "stroke-width": 2.5 }));
    for (let k = 0; k < 5; k++) { const a = (-90 + 72 * k) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      const el = svgEl("ellipse", { cx: 32 * c, cy: 80 + 32 * s, rx: 25, ry: 12, transform: `rotate(${-90 + 72 * k} ${32 * c} ${80 + 32 * s})`, fill: "#BFE0F7", stroke: CR3C.blue, "stroke-width": 2.5 });
      g.append(el); add(el, 34 * c, 80 + 34 * s); }
    g.append(svgEl("circle", { cx: 0, cy: 80, r: 9, fill: CR3C.gray }));
  } },
  egg: { w: 150, h: 130, d(g, add) {
    g.append(svgEl("rect", { x: -68, y: 30, width: 136, height: 78, rx: 8, fill: "#E8D2B0", stroke: "#8C6F4E", "stroke-width": 3 }));
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const x = -52 + 26 * c, y = 52 + 34 * r;
      const el = svgEl("ellipse", { cx: x, cy: y, rx: 10.5, ry: 13, fill: "#FFFDF6", stroke: "#B9A68A", "stroke-width": 2 }); g.append(el); add(el, x, y); }
  } },
  bucket: { w: 92, h: 200, d(g) {
    g.append(svgEl("polygon", { points: cr3P([[-30, 96], [30, 96], [24, 168], [-24, 168]]), fill: "#C9B26B", stroke: "#7A6420", "stroke-width": 3, "stroke-linejoin": "round" }));
    g.append(svgEl("path", { d: "M-26,96 Q0,62 26,96", fill: "none", stroke: "#7A6420", "stroke-width": 3 }));
    g.append(txt(0, 134, "54 t", 18, { fill: "#fff" }));
  } },
  flower: { w: 120, h: 160, d(g, add) {
    g.append(svgEl("line", { x1: 0, y1: 70, x2: 0, y2: 150, stroke: CR3C.green, "stroke-width": 5 }));
    g.append(svgEl("ellipse", { cx: 14, cy: 118, rx: 14, ry: 6, fill: CR3C.green, transform: "rotate(-30 14 118)" }));
    for (let k = 0; k < 5; k++) { const a = (-90 + 72 * k) * Math.PI / 180, x = 24 * Math.cos(a), y = 62 + 24 * Math.sin(a);
      const el = svgEl("circle", { cx: x, cy: y, r: 15, fill: "#FFC9DA", stroke: "#D86F95", "stroke-width": 2 }); g.append(el); add(el, x, y); }
    g.append(svgEl("circle", { cx: 0, cy: 62, r: 11, fill: CR3C.yel, stroke: "#C99A1A", "stroke-width": 2 }));
  } },
  clover: { w: 110, h: 160, d(g, add) {
    g.append(svgEl("path", { d: "M0,72 Q6,110 -4,150", fill: "none", stroke: CR3C.green, "stroke-width": 5 }));
    for (let k = 0; k < 3; k++) { const a = (-90 + 120 * k) * Math.PI / 180, x = 21 * Math.cos(a), y = 66 + 21 * Math.sin(a);
      const leaf = svgEl("ellipse", { cx: x, cy: y, rx: 19, ry: 15, transform: `rotate(${-90 + 120 * k} ${x} ${y})`, fill: "#7CC48A", stroke: "#2E7D4A", "stroke-width": 2 });
      g.append(leaf); add(leaf, x, y); }
  } },
  octopus: { w: 140, h: 160, d(g, add) {
    for (let k = 0; k < 8; k++) { const x0 = -35 + 10 * k, x1 = -60 + 120 * k / 7;
      const el = svgEl("path", { d: `M${x0},78 Q${(x0 + x1) / 2 + (k % 2 ? 8 : -8)},112 ${x1},142`, fill: "none", stroke: "#E0708A", "stroke-width": 7, "stroke-linecap": "round" }); g.append(el); add(el, (x0 + 2 * x1) / 3, 122); }
    g.append(svgEl("ellipse", { cx: 0, cy: 54, rx: 42, ry: 36, fill: "#F29BB0", stroke: "#C2506E", "stroke-width": 3 }));
    g.append(svgEl("circle", { cx: -13, cy: 54, r: 5, fill: CR3C.ink })); g.append(svgEl("circle", { cx: 13, cy: 54, r: 5, fill: CR3C.ink }));
  } },
  trike: { w: 150, h: 160, d(g, add) {
    const ws = [[44, 108, 30, CR3C.ink], [-34, 124, 20, "#7D8B88"], [-48, 118, 20, CR3C.ink]];
    ws.forEach(w => { const el = svgEl("circle", { cx: w[0], cy: w[1], r: w[2], fill: "#fff", stroke: w[3], "stroke-width": 4 }); g.append(el); add(el, w[0], w[1]); });
    g.append(svgEl("polyline", { points: cr3P([[-48, 118], [-6, 96], [44, 108]]), fill: "none", stroke: CR3C.blue, "stroke-width": 5, "stroke-linejoin": "round" }));
    g.append(svgEl("polyline", { points: cr3P([[44, 108], [36, 66], [26, 62]]), fill: "none", stroke: CR3C.blue, "stroke-width": 5, "stroke-linecap": "round" }));
    g.append(svgEl("line", { x1: -18, y1: 84, x2: 4, y2: 84, stroke: CR3C.ink, "stroke-width": 7, "stroke-linecap": "round" }));
  } }
};
/* 한 줄로 이어서 그리는 것: A를 n개, 그 사이(between) 또는 사이와 양 끝(ends)에 B */
const CR3ROW = {
  shade: { wa: 140, wb: 0, ends: true, h: 190,
    A(g, x, w) { g.append(svgEl("polygon", { points: cr3P([[x - 6, 74], [x + w + 6, 74], [x + w - 8, 46], [x + 8, 46]]), fill: CR3C.panel, stroke: "#1E3557", "stroke-width": 2.5, "stroke-linejoin": "round" }));
      for (let k = 1; k < 4; k++) g.append(svgEl("line", { x1: x + w * k / 4, y1: 48, x2: x + w * k / 4 + (k - 2) * 3, y2: 72, stroke: "#7FA6D6", "stroke-width": 1.5 })); },
    B(g, x, add) { const el = svgEl("rect", { x: x - 5, y: 72, width: 10, height: 100, rx: 3, fill: "#8C9B98", stroke: "#5E6D6A", "stroke-width": 1.5 }); g.append(el, svgEl("rect", { x: x - 11, y: 170, width: 22, height: 8, rx: 2, fill: "#5E6D6A" })); add(el, x, 128); } },
  card: { wa: 120, wb: 0, ends: true, h: 170,
    A(g, x, w) { g.append(svgEl("rect", { x, y: 46, width: w, height: 98, fill: "#FFFDF6", stroke: "#B9A68A", "stroke-width": 2.5 }));
      g.append(svgEl("rect", { x: x + w - 34, y: 56, width: 24, height: 28, fill: "#F2C6C6", stroke: "#C27070", "stroke-width": 1.5, "stroke-dasharray": "3 2" }));
      for (let k = 0; k < 3; k++) g.append(svgEl("line", { x1: x + 12, y1: 100 + 13 * k, x2: x + w - 14, y2: 100 + 13 * k, stroke: "#D8CDBB", "stroke-width": 2 })); },
    B(g, x, add) { const el = svgEl("circle", { cx: x, cy: 46, r: 11, fill: "#E5533D", stroke: "#9E2A1A", "stroke-width": 2 }); g.append(el); add(el, x, 46); } },
  bars: { wa: 120, wb: 40, ends: false, h: 120,
    A(g, x, w) { g.append(svgEl("rect", { x, y: 48, width: w, height: 22, rx: 11, fill: "#8EC1F0", stroke: CR3C.blue, "stroke-width": 2.5 })); g.append(txt(x + w / 2, 59, "가", 15, { fill: "#1D4E89" })); },
    B(g, x, add, w) { const el = svgEl("rect", { x: x + 4, y: 30, width: w - 8, height: 58, rx: 6, fill: "#FFD1A6", stroke: CR3C.orange, "stroke-width": 2.5 }); g.append(el, txt(x + w / 2, 59, "나", 15, { fill: "#8A3E10" })); add(el, x + w / 2, 59); } },
  hextri: { wa: 92, wb: 52, ends: true, h: 140,
    A(g, x, w) { const cx = x + w / 2, r = w / Math.sqrt(3); g.append(svgEl("polygon", { points: cr3P([0, 1, 2, 3, 4, 5].map(k => { const a = (30 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), 72 + r * Math.sin(a)]; })), fill: "#BFE6C8", stroke: CR3C.green, "stroke-width": 2.5 })); },
    B(g, x, add, w) { const el = svgEl("polygon", { points: cr3P([[x + 4, 94], [x + w - 4, 94], [x + w / 2, 50]]), fill: CR3C.yel, stroke: "#B58A12", "stroke-width": 2.5, "stroke-linejoin": "round" }); g.append(el); add(el, x + w / 2, 80); } },
  chair: { wa: 96, wb: 46, ends: false, h: 170,
    A(g, x, w) { g.append(svgEl("rect", { x: x + 8, y: 40, width: w - 16, height: 58, rx: 8, fill: "#9ED39A", stroke: "#3E8A46", "stroke-width": 2.5 }));
      g.append(svgEl("rect", { x: x + 2, y: 98, width: w - 4, height: 16, rx: 5, fill: "#7BBE77", stroke: "#3E8A46", "stroke-width": 2.5 }));
      [x + 10, x + w - 10].forEach(lx => g.append(svgEl("line", { x1: lx, y1: 114, x2: lx, y2: 150, stroke: "#5E6D6A", "stroke-width": 5 }))); },
    B(g, x, add, w) { const el = svgEl("rect", { x: x + 6, y: 70, width: w - 12, height: 80, rx: 6, fill: "#E8EEF6", stroke: "#5E6D6A", "stroke-width": 2.5 }); g.append(el);
      g.append(svgEl("rect", { x: x + 2, y: 58, width: w - 4, height: 14, fill: CR3C.panel, stroke: "#1E3557", "stroke-width": 1.5 }));
      g.append(svgEl("rect", { x: x + w / 2 - 6, y: 92, width: 12, height: 18, rx: 2, fill: CR3C.yel, stroke: "#B58A12", "stroke-width": 1.5 })); add(el, x + w / 2, 128); } },
  art: { wa: 104, wb: 40, ends: false, h: 160,
    A(g, x, w) { g.append(svgEl("rect", { x, y: 40, width: w, height: 90, fill: "#fff", stroke: "#8C6F4E", "stroke-width": 4 }));
      g.append(svgEl("circle", { cx: x + w * .35, cy: 74, r: 14, fill: "#F2A0A0" })); g.append(svgEl("polygon", { points: cr3P([[x + 10, 122], [x + w * .5, 84], [x + w - 10, 122]]), fill: "#9ED39A" })); },
    B(g, x, add, w) { const el = svgEl("circle", { cx: x + w / 2, cy: 64, r: 12, fill: "none", stroke: "#C99A1A", "stroke-width": 5 });
      g.append(svgEl("line", { x1: x - 2, y1: 64, x2: x + w / 2 - 12, y2: 64, stroke: "#C99A1A", "stroke-width": 3 }), svgEl("line", { x1: x + w / 2 + 12, y1: 64, x2: x + w + 2, y2: 64, stroke: "#C99A1A", "stroke-width": 3 }), el); add(el, x + w / 2, 64); } },
  armchair: { wa: 84, wb: 22, ends: true, h: 150,
    A(g, x, w) { g.append(svgEl("rect", { x: x + 2, y: 34, width: w - 4, height: 52, rx: 8, fill: "#C5A5E8", stroke: "#7650A8", "stroke-width": 2.5 }));
      g.append(svgEl("rect", { x, y: 86, width: w, height: 18, rx: 4, fill: "#B08BDC", stroke: "#7650A8", "stroke-width": 2.5 }));
      [x + 8, x + w - 8].forEach(lx => g.append(svgEl("line", { x1: lx, y1: 104, x2: lx, y2: 136, stroke: "#5E6D6A", "stroke-width": 5 }))); },
    B(g, x, add, w) { const el = svgEl("rect", { x: x + 3, y: 66, width: w - 6, height: 40, rx: 6, fill: "#8C6F4E", stroke: "#5B4630", "stroke-width": 2 }); g.append(el); add(el, x + w / 2, 86); } }
};
function cr3Scene(cfg) {
  const kind = cfg.kind, max = cfg.max || 4, W = 640;
  const isRow = !!CR3ROW[kind], K = isRow ? CR3ROW[kind] : CR3EACH[kind];
  const left = cfg.tower ? 150 : 0;
  const H = cfg.h || K.h || 180;
  const st = { n: cfg.n0 || 1, max: cfg.n0 || 1, marks: 0 };
  const svg = makeSvg(W, H);
  const lab = h("b", {}), cnt = h("span", { class: "cr3muted" });
  function draw() {
    svg.innerHTML = ""; st.marks = 0;
    if (cfg.tower) cr3Tower(svg);
    const add = (el, x, y, g) => {
      if (!cfg.count) return;
      el.style.cursor = "pointer";
      el.addEventListener("click", ev => { ev.stopPropagation();
        if (el._m) { el._m.remove(); el._m = null; st.marks--; } else { st.marks++; const m = svgEl("g", { "pointer-events": "none" }); m.append(svgEl("circle", { cx: x, cy: y, r: 12, fill: "#FFE9C7", stroke: CR3C.orange, "stroke-width": 2.5 }), txt(x, y + 1, String(st.marks), 14, { fill: "#8A3E10" })); g.append(m); el._m = m; }
        cnt.textContent = st.marks ? `눌러서 센 ${cfg.countName || "것"}: ${st.marks}개` : ""; });
    };
    if (isRow) {
      const k = Math.min(1, (W - 52) / ((max * K.wa + (K.ends ? max + 1 : max - 1) * K.wb)));
      const tot = n => n * K.wa + (K.ends ? n + 1 : Math.max(0, n - 1)) * K.wb;
      const g = svgEl("g", { transform: `translate(${(W - tot(max) * k) / 2} ${(H - K.h * k) / 2}) scale(${k})` }); svg.append(g);
      let x = 0; const bAt = [];
      if (K.ends) { bAt.push(x); x += K.wb; }
      for (let i = 0; i < st.n; i++) { K.A(g, x, K.wa); x += K.wa; if (K.ends || i < st.n - 1) { bAt.push(x); x += K.wb; } }
      bAt.forEach(bx => K.B(g, bx, (el, cx, cy) => add(el, cx, cy, g), K.wb));
    } else if (kind === "sqtri") {
      const s = Math.min(78, (W - 60) / (max + 1.6)), t = s * .8, x0 = (W - (max * s + 2 * t)) / 2 + t, y0 = (H - s) / 2 + s * .35;
      const g = svgEl("g"); svg.append(g);
      for (let i = 0; i < st.n; i++) g.append(svgEl("rect", { x: x0 + i * s, y: y0, width: s, height: s, fill: "#BFE0F7", stroke: CR3C.blue, "stroke-width": 2.5 }));
      const tris = [[[x0, y0], [x0, y0 + s], [x0 - t, y0 + s / 2]]];
      for (let i = 0; i < st.n; i++) tris.push([[x0 + i * s, y0], [x0 + (i + 1) * s, y0], [x0 + (i + .5) * s, y0 - t]]);
      tris.push([[x0 + st.n * s, y0], [x0 + st.n * s, y0 + s], [x0 + st.n * s + t, y0 + s / 2]]);
      tris.forEach(p => { const el = svgEl("polygon", { points: cr3P(p), fill: "#FFD1A6", stroke: CR3C.orange, "stroke-width": 2.5, "stroke-linejoin": "round" }); g.append(el); add(el, (p[0][0] + p[1][0] + p[2][0]) / 3, (p[0][1] + p[1][1] + p[2][1]) / 3); });
    } else {
      const pad = 16, uw = (W - left - 2 * pad) / max, k = Math.min(1, uw / K.w, H / K.h);
      if (kind === "photo") svg.append(svgEl("line", { x1: left + 6, y1: 40 * k + (H - K.h * k) / 2, x2: W - 6, y2: 40 * k + (H - K.h * k) / 2, stroke: "#8C6F4E", "stroke-width": 3 }));
      for (let i = 0; i < st.n; i++) {
        const g = svgEl("g", { transform: `translate(${left + pad + uw * (i + .5)} ${(H - K.h * k) / 2}) scale(${k})` }); svg.append(g);
        K.d(g, (el, x, y) => add(el, x, y, g));
        if (cfg.numbered) g.append(txt(0, K.h - 8, `${i + 1}번째`, 14, { fill: CR3C.gray }));
      }
    }
    lab.textContent = cfg.label ? cfg.label(st.n) : String(st.n);
    cnt.textContent = cfg.count ? `세는 ${cfg.countName || "것"}을(를) 눌러 하나씩 세어 봐요.`.replace("을(를)", cr3Jong(cfg.countName || "것") ? "을" : "를") : "";
    minus.disabled = st.n <= 1; plus.disabled = st.n >= max;
  }
  const minus = h("button", { type: "button", onclick: () => { if (st.n > 1) { st.n--; draw(); } } }, "− 하나 빼기");
  const plus = h("button", { type: "button", onclick: () => { if (st.n < max) { st.n++; st.max = Math.max(st.max, st.n); draw(); } } }, "＋ 하나 더");
  const el = h("div", { class: "cr3fig" }, svg);
  if (!cfg.static) el.append(h("div", { class: "cr3step" }, minus, lab, plus));
  if (cfg.count && !cfg.static) el.append(h("p", { class: "cr3cap" }, cnt));
  if (cfg.cap) el.append(h("p", { class: "cr3cap" }, cfg.cap));
  if (cfg.static) { st.n = cfg.n0 || 1; }
  draw();
  return { el, st, check() { if (cfg.need && st.max < cfg.need) return `그림 아래 ‘＋ 하나 더’를 눌러 ${cfg.label(cfg.need)}까지 늘려 보며 세어 봐요.`; return null; } };
}
function cr3Tower(svg) {
  const g = svgEl("g", { fill: "none", stroke: "#7A6420", "stroke-width": 3, "stroke-linejoin": "round" });
  g.append(svgEl("polygon", { points: cr3P([[80, 14], [86, 60], [104, 120], [132, 192], [28, 192], [56, 120], [74, 60]]), fill: "#E9DDB4" }));
  g.append(svgEl("path", { d: "M56,120 L104,120 M64,94 L96,94 M70,60 L90,60 M44,192 Q80,140 116,192" }));
  svg.append(g);
}
/* 정적인 그림 하나 */
function cr3Pic(kind, n, cap, h0) { return () => cr3Scene({ kind, n0: n, max: n, static: true, cap, h: h0 }).el; }

/* ---------- 표 ---------- */
/* cfg = {heads:[윗줄 이름, 아랫줄 이름], x:[…], y:[…], bx:[빈칸 칸 번호], by:[…], f: x→y, more:true(…칸), w} */
function cr3Table(cfg) {
  (cfg.x || []).forEach((x, i) => { if (cfg.f && Math.abs(cfg.f(x) - cfg.y[i]) > 1e-9) throw new Error(`cr3 표 오류: ${cfg.heads[0]} ${x} → ${cfg.y[i]}`); });
  const ins = [], tb = h("table");
  [["x", cfg.x, cfg.bx || []], ["y", cfg.y, cfg.by || []]].forEach(([k, vals, blank], r) => {
    const tr = h("tr", {}, h("th", {}, cfg.heads[r]));
    vals.forEach((v, i) => {
      if (blank.includes(i)) { const inp = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": `${cfg.heads[r]} ${i + 1}째 칸` }); ins.push({ inp, a: v, r }); tr.append(h("td", {}, inp)); }
      else tr.append(h("td", {}, cr3Fmt(v)));
    });
    if (cfg.more !== false) tr.append(h("td", { class: "cr3muted" }, "…"));
    tb.append(tr);
  });
  const el = h("div", { class: "cr3tbl", style: cfg.w ? `--w:${cfg.w}` : "" }, tb);
  return { el, answers: ins.length ? [`표 빈칸: ${ins.map(x => cr3Fmt(x.a)).join(", ")}`] : [],
    check() {
      let bad = null;
      ins.forEach(x => { const v = cr3Num(x.inp.value), g = Math.abs(v - x.a) < 1e-9; cr3Mark(x.inp, g); if (!g && !bad) bad = x; });
      if (!bad) return null;
      if (bad.inp.value.trim() === "") return "표의 빈칸을 모두 채워요.";
      return cfg.why || "표의 빨간 칸을 다시 살펴봐요. 한 양이 1씩 늘어날 때 다른 양은 어떻게 변하나요?";
    }, given: () => ins.map(x => x.inp.value.trim()).join(",") };
}

/* ---------- 말 빈칸(수 입력·고르기) ---------- */
/* lines: [["글", {a:수}, "글", {o:[…], a:번호}, …], …] */
function cr3Say(lines) {
  const items = [], el = h("div", { class: "cr3say" });
  lines.forEach(L => {
    const p = h("p");
    L.forEach(seg => {
      if (typeof seg === "string") p.append(seg);
      else if (seg.o) { const it = { type: "o", seg, sel: null }; const slot = h("span", { class: "cr3slot" });
        seg.o.forEach((o, oi) => slot.append(h("button", { type: "button", onclick: e => { [...slot.children].forEach(b => b.classList.remove("cr3on", "cr3good", "cr3bad")); e.currentTarget.classList.add("cr3on"); it.sel = oi; } }, o)));
        it.slot = slot; items.push(it); p.append(slot); }
      else { const inp = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": "빈칸" }); items.push({ type: "n", seg, inp }); p.append(inp); }
    });
    el.append(p);
  });
  const full = lines.map(L => L.map(s => typeof s === "string" ? s : s.o ? s.o[s.a] : cr3Fmt(s.a)).join("")).join(" ");
  return { el, answers: [full], words: lines.flat().filter(s => typeof s !== "string" && s.o).map(s => s.o[s.a]),
    check() {
      let msg = null;
      items.forEach(it => {
        if (it.type === "n") { const v = cr3Num(it.inp.value), g = Math.abs(v - it.seg.a) < 1e-9; cr3Mark(it.inp, g); if (!g && !msg) msg = it.inp.value.trim() === "" ? "문장의 빈칸을 모두 채워요." : ((it.seg.why && it.seg.why[String(v)]) || "문장의 빨간 칸을 다시 생각해 봐요."); }
        else { const g = it.sel === it.seg.a; [...it.slot.children].forEach((b, i) => { b.classList.remove("cr3good", "cr3bad"); if (i === it.sel) b.classList.add(g ? "cr3good" : "cr3bad"); }); if (!g && !msg) msg = it.sel == null ? "문장의 빈칸에 알맞은 말을 골라요." : ((it.seg.why && it.seg.why[String(it.sel)]) || "빨간 말을 다시 골라 봐요."); }
      });
      return msg;
    }, given: () => items.map(it => it.type === "n" ? it.inp.value.trim() : (it.sel == null ? "-" : it.seg.o[it.sel])).join("/") };
}

/* ---------- 고르기 ---------- */
function cr3Choose(list) {
  const el = h("div"), st = list.map(() => null), rows = [];
  list.forEach((it, i) => {
    const row = h("div", { class: "cr3opts" }), multi = Array.isArray(it.a), sel = new Set();
    it.o.forEach((o, oi) => row.append(h("button", { type: "button", onclick: e => {
      if (multi) { sel.has(oi) ? sel.delete(oi) : sel.add(oi); e.currentTarget.classList.toggle("cr3on"); st[i] = [...sel]; }
      else { [...row.children].forEach(b => b.classList.remove("cr3on", "cr3good", "cr3bad")); e.currentTarget.classList.add("cr3on"); st[i] = oi; }
    } }, o)));
    rows.push(row);
    el.append(h("div", { class: "qitem" }, it.fig ? it.fig() : null, h("div", { class: "cr3q" }, it.q), row));
  });
  return { el, words: list.flatMap(it => (Array.isArray(it.a) ? it.a : [it.a]).map(k => it.o[k])),
    answers: list.map(it => (Array.isArray(it.a) ? it.a : [it.a]).map(k => it.o[k]).join(", ")),
    check() {
      let msg = null;
      list.forEach((it, i) => {
        const v = st[i], good = Array.isArray(it.a) ? (Array.isArray(v) && v.length === it.a.length && it.a.every(x => v.includes(x))) : v === it.a;
        [...rows[i].children].forEach((b, k) => { b.classList.remove("cr3good", "cr3bad"); const on = Array.isArray(v) ? v.includes(k) : v === k; if (on) b.classList.add(good ? "cr3good" : "cr3bad"); });
        if (!good && !msg) msg = v == null || (Array.isArray(v) && !v.length) ? "아직 고르지 않은 문제가 있어요." : ((it.why && !Array.isArray(v) && it.why[String(v)]) || (Array.isArray(it.a) ? "알맞은 것을 모두 골랐는지, 알맞지 않은 것을 고르지 않았는지 살펴봐요." : "빨간 답을 다시 골라 봐요."));
      });
      return msg;
    }, given: () => st.map((v, i) => v == null ? "-" : (Array.isArray(v) ? v.map(k => list[i].o[k]).join("·") : list[i].o[v])).join("/") };
}

/* ---------- 짝 잇기 ---------- */
/* cfg = {left:[…], right:[…], pairs:[오른쪽 번호 …](왼쪽 차례대로)} */
function cr3Link(cfg) {
  const el = h("div"), grid = h("div", { class: "cr3link" }), L = h("div"), R = h("div"), cols = ["#DCEAFB", "#FFE9C7", "#E3F4EA", "#F6DDF0", "#FFF3B5", "#E6E0FA"];
  const pair = cfg.left.map(() => null); let pick = null;
  const lb = cfg.left.map((t, i) => h("button", { type: "button", onclick: () => { pick = i; paint(); } }, t));
  const rb = cfg.right.map((t, j) => h("button", { type: "button", onclick: () => { if (pick == null) return; pair.forEach((p, i) => { if (p === j) pair[i] = null; }); pair[pick] = j; pick = null; paint(); } }, t));
  function paint() {
    lb.forEach((b, i) => { b.classList.remove("cr3good", "cr3bad"); b.classList.toggle("cr3pick", pick === i); b.style.background = pair[i] != null ? cols[i % cols.length] : ""; });
    rb.forEach((b, j) => { b.classList.remove("cr3good", "cr3bad"); const i = pair.indexOf(j); b.style.background = i >= 0 ? cols[i % cols.length] : ""; });
  }
  L.append(h("div", { class: "cr3muted" }, cfg.lt || "한 양"), ...lb); R.append(h("div", { class: "cr3muted" }, cfg.rt || "짝을 이루는 양"), ...rb);
  grid.append(L, R); el.append(h("p", { class: "cr3muted" }, "왼쪽을 누른 뒤, 짝을 이루어 함께 변하는 오른쪽 양을 눌러 이어요. 같은 색이 짝이에요."), grid);
  return { el, answers: cfg.left.map((t, i) => `${t} ↔ ${cfg.right[cfg.pairs[i]]}`),
    check() {
      let msg = null;
      pair.forEach((p, i) => { const g = p === cfg.pairs[i]; cr3Mark(lb[i], g); if (p != null) cr3Mark(rb[p], g); if (!g && !msg) msg = p == null ? "아직 잇지 않은 양이 있어요." : ((cfg.why && cfg.why[`${i}-${p}`]) || `‘${cfg.left[i]}’${cr3Jong(cfg.left[i]) ? "과" : "와"} 함께 변하는 양을 다시 찾아봐요.`); });
      return msg;
    }, given: () => pair.map((p, i) => `${cfg.left[i]}-${p == null ? "?" : cfg.right[p]}`).join(" / ") };
}

/* ---------- 기호 식 ---------- */
/* cfg = {vars:[{s:"□", name:"엽서의 수", v:[…]}, …], need:1|2, pick:false, ans:["△=□+1", …], extra:["☆"], fig, q} */
function cr3Eq(cfg) {
  const el = h("div", { class: "cr3box" }), id = ++cr3Uid;
  const chosen = cfg.vars.map(v => cfg.pick ? null : v.s);
  if (cfg.q) el.append(h("div", { class: "cr3boxt" }, cfg.q));
  if (cfg.fig) el.append(cfg.fig());
  const varsLine = h("div", { class: "cr3vars" });
  const ins = [];
  let focus = null;
  const keys = h("div", { class: "cr3keys" });
  function drawKeys() {
    keys.innerHTML = "";
    const syms = chosen.filter(Boolean).concat(cfg.pick ? [] : (cfg.extra || []));
    syms.forEach(s => keys.append(h("button", { type: "button", class: "cr3sym", onmousedown: e => e.preventDefault(), onclick: () => ins_(s) }, s)));
    ["+", "−", "×", "÷", "="].concat("0123456789".split("")).forEach(k => keys.append(h("button", { type: "button", onmousedown: e => e.preventDefault(), onclick: () => ins_(k) }, k)));
    keys.append(h("button", { type: "button", onmousedown: e => e.preventDefault(), onclick: () => { const inp = focus || ins[0]; inp.value = inp.value.slice(0, -1); inp.focus(); } }, "⌫ 지우기"));
  }
  function ins_(k) { const inp = focus || ins[0]; const s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, e = inp.selectionEnd == null ? s : inp.selectionEnd; inp.value = inp.value.slice(0, s) + k + inp.value.slice(e); inp.focus(); try { inp.setSelectionRange(s + k.length, s + k.length); } catch (_) {} }
  function drawVars() {
    varsLine.innerHTML = "";
    cfg.vars.forEach((v, i) => {
      if (!cfg.pick) { varsLine.append(h("span", {}, `${v.name}: `, h("b", {}, v.s))); return; }
      const pal = h("div", { class: "cr3pal" });
      (cfg.palette || ["□", "△", "☆", "○", "◇", "♡", "▽", "⊙"]).forEach(s => pal.append(h("button", { type: "button", class: chosen[i] === s ? "cr3on" : "", onclick: () => { chosen[i] = s; drawVars(); drawKeys(); } }, s)));
      varsLine.append(h("div", { style: "min-width:0" }, h("span", {}, `${v.name}을(를) 나타낼 기호 `.replace("을(를)", cr3Jong(v.name) ? "을" : "를"), h("b", {}, chosen[i] || "?")), pal));
    });
  }
  el.append(varsLine);
  for (let k = 0; k < (cfg.need || 1); k++) {
    const inp = h("input", { type: "text", autocomplete: "off", "aria-label": `식 ${k + 1}`, placeholder: cfg.ph || "기호와 + − × ÷ = 로 식을 써요" });
    inp.addEventListener("focus", () => { focus = inp; });
    ins.push(inp); el.append(h("div", { class: "cr3eqrow" }, h("span", { class: "jua" }, (cfg.need || 1) > 1 ? `식 ${k + 1}` : "식"), inp));
  }
  el.append(keys); drawVars(); drawKeys();
  const mk = () => { const o = {}; cfg.vars.forEach((v, i) => { o[chosen[i]] = { name: v.name, v: v.v }; }); return o; };
  // 정답 식 스스로 검사
  if (!cfg.pick) (cfg.ans || []).forEach(a => { const r = cr3Judge(cr3Tok(a), mk()); if (!r.ok) throw new Error("cr3 정답 식 오류: " + a + " " + r.msg); });
  return { el, answers: cfg.ans ? [cfg.ans.slice(0, cfg.need || 1).join("  또는  ")] : [],
    check() {
      if (cfg.pick) { if (chosen.some(c => !c)) return "먼저 두 양을 나타낼 기호를 하나씩 골라요."; if (chosen[0] === chosen[1]) return "두 양은 서로 다른 기호로 나타내요."; }
      const vars = mk(); const ops = [];
      for (let k = 0; k < ins.length; k++) {
        const r = cr3Judge(cr3Tok(ins[k].value), vars); cr3Mark(ins[k], r.ok);
        if (!r.ok) return (ins.length > 1 ? `식 ${k + 1}: ` : "") + r.msg;
        ops.push(r.op);
      }
      if (ins.length > 1) {
        const fam = o => (o === "+" || o === "−") ? "합차" : "곱몫";
        const kinds = new Set(ops);
        if (kinds.size < ops.length) { ins.forEach(x => cr3Mark(x, false)); return `두 식이 모두 ${CR3OPN[ops[0]]}이에요. 기준을 바꾸어 다른 연산 기호로도 나타내 봐요(× ↔ ÷, + ↔ −).`; }
        if (fam(ops[0]) !== fam(ops[1])) return "두 식의 계산이 서로 짝이 맞지 않아요.";
      }
      return null;
    }, given: () => (cfg.pick ? `[${cfg.vars.map((v, i) => `${v.name}=${chosen[i] || "?"}`).join(", ")}] ` : "") + ins.map(x => x.value.trim()).join(" , "),
    chosen };
}

/* ---------- 수 쓰기 ---------- */
function cr3Ask(list) {
  const el = h("div"), ins = [];
  list.forEach(it => { const inp = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", style: "width:6.5em;font-size:1.1em", "aria-label": it.q }); ins.push(inp); el.append(h("div", { class: "qitem" }, h("span", { class: "jua" }, it.q + " "), inp, it.unit ? h("span", {}, " " + it.unit) : null)); });
  return { el, answers: list.map(it => `${it.q} ${cr3Fmt(it.a)}${it.unit ? " " + it.unit : ""}`),
    check() {
      let msg = null;
      list.forEach((it, i) => { const v = cr3Num(ins[i].value), g = Math.abs(v - it.a) < 1e-9; cr3Mark(ins[i], g); if (!g && !msg) msg = ins[i].value.trim() === "" ? "빈칸에 수를 써요." : ((it.why && it.why[String(v)]) || "빨간 칸을 다시 계산해 봐요."); });
      return msg;
    }, given: () => ins.map(x => x.value.trim()).join(",") };
}

/* ---------- 한 계단 묶음 ---------- */
/* opt = {fig, scene, table, say, choose, link, eq, ask, after, ok, words} — 차례대로 그리고, 확인하기 한 번으로 모두 채점 */
function cr3Do(body, api, opt) {
  const parts = [];
  const add = (p, title) => { if (title) body.append(h("div", { class: "cr3q" }, title)); body.append(p.el); parts.push(p); };
  if (opt.promise) body.append(h("div", { class: "cr3promise" }, opt.promise));
  if (opt.fig) body.append(opt.fig());
  if (opt.scene) { const sc = cr3Scene(opt.scene); body.append(sc.el); parts.push({ check: sc.check, answers: [], given: () => `그림 ${sc.st.max}까지` }); }
  if (opt.link) add(cr3Link(opt.link), opt.linkT);
  if (opt.table) add(cr3Table(opt.table), opt.tableT);
  if (opt.say) add(cr3Say(opt.say), opt.sayT);
  if (opt.choose) add(cr3Choose(opt.choose), opt.chooseT);
  if (opt.eq) [].concat(opt.eq).forEach(e => add(cr3Eq(e), e.title));
  if (opt.ask) add(cr3Ask(opt.ask), opt.askT);
  api.provide({ words: opt.words || parts.flatMap(p => p.words || []), answers: parts.flatMap(p => p.answers || []) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    let msg = null; parts.forEach(p => { const m = p.check(); if (m && !msg) msg = m; });
    const given = parts.map(p => p.given ? p.given() : "").filter(Boolean).join(" | ");
    if (msg) return api.fail(msg, given);
    api.done(given, opt.ok);
  } }, "확인하기")));
}

/* ---------- 보기 카드로 낱말 식 만들기 ---------- */
/* opt = {cards:[…], vars:{"솜사탕의 수":[…], …}, need:2, ans:[["…","=",…], …], table, ok} */
function cr3Cards(body, api, opt) {
  if (opt.fig) body.append(opt.fig());
  if (opt.table) body.append(cr3Table(opt.table).el);
  const vars = {}; Object.keys(opt.vars).forEach(k => { vars[k] = { name: k, v: opt.vars[k] }; });
  opt.ans.forEach(a => { const r = cr3Judge(a, vars); if (!r.ok) throw new Error("cr3 카드 정답 오류: " + a.join(" ")); });
  const lines = []; let cur = 0;
  const lineEls = [];
  for (let k = 0; k < (opt.need || 1); k++) {
    lines.push([]);
    const el = h("div", { class: "cr3line" + (k === 0 ? " cr3cur" : ""), onclick: () => { cur = k; lineEls.forEach((e, i) => e.classList.toggle("cr3cur", i === k)); } });
    lineEls.push(el);
  }
  function paint() { lineEls.forEach((el, k) => { el.innerHTML = ""; el.append(h("span", { class: "cr3lab" }, `식 ${k + 1}`)); if (!lines[k].length) el.append(h("span", { class: "cr3muted" }, "카드를 눌러 식을 만들어요")); lines[k].forEach(t => el.append(h("span", { class: "cr3tk" }, t))); }); }
  const deck = h("div", { class: "cr3cards" }, opt.cards.map(c => h("button", { type: "button", onclick: () => { lines[cur].push(c); lineEls[cur].classList.remove("cr3good", "cr3bad"); paint(); } }, c)));
  body.append(h("div", { class: "cr3q" }, "보기 카드"), deck, ...lineEls,
    h("div", { class: "cr3opts" }, h("button", { type: "button", onclick: () => { lines[cur].pop(); paint(); } }, "⌫ 마지막 카드 빼기"), h("button", { type: "button", onclick: () => { lines[cur] = []; paint(); } }, "이 줄 비우기")));
  paint();
  api.provide({ words: opt.cards.filter(c => /[가-힣]/.test(c)), answers: opt.ans.slice(0, opt.need || 1).map(a => a.join(" ")) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ops = [];
    for (let k = 0; k < lines.length; k++) {
      const toks = lines[k].map(t => t === "−" ? "−" : t);
      const r = cr3Judge(toks, vars); cr3Mark(lineEls[k], r.ok);
      if (!r.ok) return api.fail((lines.length > 1 ? `식 ${k + 1}: ` : "") + r.msg, lines.map(l => l.join(" ")).join(" / "));
      ops.push(r.op);
    }
    if (new Set(ops).size < ops.length) { lineEls.forEach(e => cr3Mark(e, false)); return api.fail("두 식이 같은 연산이에요. 나타낸 식을 다른 연산 기호로도 나타내 봐요.", lines.map(l => l.join(" ")).join(" / ")); }
    api.done(lines.map(l => l.join(" ")).join(" / "), opt.ok);
  } }, "확인하기")));
}

/* ---------- 공원 그림에서 대응하는 두 양 찾기 ---------- */
function cr3ParkFig(onTap) {
  const W = 640, H = 300, svg = makeSvg(W, H);
  svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: 200, fill: "#EAF4FB" }), svgEl("rect", { x: 0, y: 200, width: W, height: 100, fill: "#DCEFD6" }));
  const spots = [];
  const spot = (id, g, cx, cy, label) => { g.style.cursor = "pointer"; g.addEventListener("click", () => onTap && onTap(id, g)); svg.append(g); spots.push({ id, g }); if (label) svg.append(txt(cx, cy, label, 14, { fill: CR3C.gray, "pointer-events": "none" })); };
  // 풍력 발전기 2대
  const gw = svgEl("g"); [[70, 0], [140, 18]].forEach(([x, dy]) => { const t = svgEl("g", { transform: `translate(${x} ${dy}) scale(.62)` }); CR3EACH.wind.d(t, () => {}); gw.append(t); }); gw.append(svgEl("rect", { x: 20, y: 10, width: 170, height: 150, fill: "transparent" }));
  spot("wind", gw, 105, 172, "풍력 발전기");
  // 전기 열차
  const gt = svgEl("g"); gt.append(svgEl("line", { x1: 220, y1: 270, x2: 630, y2: 270, stroke: "#8C9B98", "stroke-width": 4 }));
  [[240, "#2B7BD6"], [330, "#3E9B6A"]].forEach(([x, c]) => { gt.append(svgEl("rect", { x, y: 228, width: 84, height: 38, rx: 8, fill: c })); for (let k = 0; k < 3; k++) gt.append(svgEl("rect", { x: x + 8 + 25 * k, y: 236, width: 18, height: 14, rx: 2, fill: "#fff" })); gt.append(svgEl("circle", { cx: x + 18, cy: 268, r: 6, fill: CR3C.ink }), svgEl("circle", { cx: x + 66, cy: 268, r: 6, fill: CR3C.ink })); });
  gt.append(svgEl("rect", { x: 230, y: 220, width: 196, height: 56, fill: "transparent" }));
  spot("train", gt, 330, 290, "전기 열차");
  // 모노레일(페달)
  const gm = svgEl("g"); gm.append(svgEl("line", { x1: 220, y1: 60, x2: 620, y2: 60, stroke: "#5E6D6A", "stroke-width": 6 }));
  gm.append(svgEl("rect", { x: 440, y: 66, width: 70, height: 46, rx: 10, fill: "#FFD1A6", stroke: CR3C.orange, "stroke-width": 2.5 }), svgEl("line", { x1: 475, y1: 60, x2: 475, y2: 66, stroke: "#5E6D6A", "stroke-width": 4 }), svgEl("circle", { cx: 475, cy: 100, r: 9, fill: "none", stroke: CR3C.ink, "stroke-width": 3 }));
  gm.append(svgEl("rect", { x: 430, y: 50, width: 100, height: 70, fill: "transparent" }));
  spot("mono", gm, 475, 132, "모노레일");
  // 의자와 태양열 충전기
  const gc = svgEl("g", { transform: "translate(232 112) scale(.5)" }); cr3DrawRowInto(gc, "chair", 3); gc.append(svgEl("rect", { x: 0, y: 20, width: 400, height: 150, fill: "transparent" }));
  spot("chair", gc, 330, 205, "");
  svg.append(txt(330, 196, "의자와 태양열 충전기", 14, { fill: CR3C.gray, "pointer-events": "none" }));
  // 자전거
  const gb = svgEl("g", { transform: "translate(565 150) scale(.5)" }); CR3EACH.bike.d(gb, () => {}); gb.append(svgEl("rect", { x: -80, y: 50, width: 160, height: 110, fill: "transparent" }));
  spot("bike", gb, 565, 236, "자전거");
  return svg;
}
function cr3DrawRowInto(g, kind, n) { const K = CR3ROW[kind]; let x = 0; const bAt = []; if (K.ends) { bAt.push(x); x += K.wb; } for (let i = 0; i < n; i++) { K.A(g, x, K.wa); x += K.wa; if (K.ends || i < n - 1) { bAt.push(x); x += K.wb; } } bAt.forEach(bx => K.B(g, bx, () => {}, K.wb)); }
/* opt = {spots:{id:"찾은 두 양 글"}, need, ok} */
function cr3Find(body, api, opt) {
  const found = new Set(), list = h("div", { class: "cr3found" }), info = h("p", { class: "cr3muted" });
  const svg = cr3ParkFig((id, g) => {
    if (!opt.spots[id] || found.has(id)) return;
    found.add(id); g.setAttribute("opacity", ".55");
    list.append(h("div", {}, `${found.size}. ${opt.spots[id]}`));
    info.textContent = `찾은 짝: ${found.size}가지 / ${opt.need}가지`;
  });
  info.textContent = `찾은 짝: 0가지 / ${opt.need}가지`;
  body.append(h("div", { class: "cr3fig" }, svg), info, list);
  const C = opt.choose ? cr3Choose(opt.choose) : null; if (C) body.append(C.el);
  api.provide({ words: Object.values(opt.spots), answers: Object.values(opt.spots).concat(C ? C.answers : []) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (found.size < opt.need) return api.fail(`공원 그림의 시설을 눌러 서로 대응하는 두 양을 ${opt.need}가지 찾아요. 지금 ${found.size}가지예요.`, [...found].join(","));
    const m = C ? C.check() : null; if (m) return api.fail(m, C.given());
    api.done([...found].map(id => opt.spots[id]).join(" / "), opt.ok);
  } }, "확인하기")));
}

/* ---------- 놀이: 자신만만 대응 관계 ---------- */
const CR3DECK = [
  { kind: "flower", n: 2, t: "꽃의 수(□)와 꽃잎의 수(△)", vars: [{ s: "□", name: "꽃의 수", f: n => n }, { s: "△", name: "꽃잎의 수", f: n => 5 * n }], note: "꽃 1송이에 꽃잎이 5장이에요.", ans: ["△=□×5", "□=△÷5"] },
  { kind: "clover", n: 2, t: "토끼풀의 수(□)와 잎의 수(△)", vars: [{ s: "□", name: "토끼풀의 수", f: n => n }, { s: "△", name: "잎의 수", f: n => 3 * n }], note: "토끼풀 1개에 잎이 3장이에요.", ans: ["△=□×3", "□=△÷3"] },
  { kind: "armchair", n: 3, t: "의자의 수(○)와 팔걸이의 수(☆)", vars: [{ s: "○", name: "의자의 수", f: n => n }, { s: "☆", name: "팔걸이의 수", f: n => n + 1 }], note: "의자를 한 줄로 이어 놓았어요. 의자 사이와 양 끝에 팔걸이가 있어요.", ans: ["☆=○+1", "○=☆−1"] },
  { kind: "octopus", n: 1, t: "문어의 수(◇)와 문어 다리의 수(○)", vars: [{ s: "◇", name: "문어의 수", f: n => n }, { s: "○", name: "문어 다리의 수", f: n => 8 * n }], note: "문어 1마리에 다리가 8개예요.", ans: ["○=◇×8", "◇=○÷8"] },
  { kind: "trike", n: 2, t: "세발자전거의 수(△)와 바퀴의 수(♡)", vars: [{ s: "△", name: "세발자전거의 수", f: n => n }, { s: "♡", name: "바퀴의 수", f: n => 3 * n }], note: "세발자전거 1대에 바퀴가 3개예요.", ans: ["♡=△×3", "△=♡÷3"] },
  { kind: "age", n: 0, t: "동생의 나이(□)와 언니의 나이(○)", vars: [{ s: "□", name: "동생의 나이", f: n => n + 8 }, { s: "○", name: "언니의 나이", f: n => n + 11 }], note: "동생이 9살일 때 언니는 12살이에요. 해마다 두 사람 모두 1살씩 많아져요.", ans: ["○=□+3", "□=○−3"] }
];
function cr3DieSvg(v) {
  const s = makeSvg(90, 90); s.append(svgEl("rect", { x: 5, y: 5, width: 80, height: 80, rx: 14, fill: "#fff", stroke: CR3C.ink, "stroke-width": 3 }));
  const P = { 1: [[45, 45]], 2: [[27, 27], [63, 63]], 3: [[25, 25], [45, 45], [65, 65]], 4: [[27, 27], [63, 27], [27, 63], [63, 63]], 5: [[25, 25], [65, 25], [45, 45], [25, 65], [65, 65]], 6: [[27, 23], [63, 23], [27, 45], [63, 45], [27, 67], [63, 67]] };
  (P[v] || []).forEach(([x, y]) => s.append(svgEl("circle", { cx: x, cy: y, r: 7.5, fill: v === 1 ? "#D3473A" : CR3C.ink })));
  s.style.width = "90px"; s.style.height = "90px"; return s;
}
function cr3Game(body, api, opt) {
  const deck = CR3DECK.slice(0, opt.cards || CR3DECK.length);
  let i = -1, score = 0, phase = "flip", firstTry = true;
  const log = h("div", { class: "cr3log" }), scoreEl = h("div", { class: "cr3score" });
  const cardBox = h("div", { class: "cr3card" }), side = h("div");
  body.append(h("div", { class: "cr3game" }, cardBox, side), log);
  api.provide({ words: ["□", "△", "×", "÷", "+", "−"], answers: deck.map(c => `${c.t}: ${c.ans.join(" 또는 ")}`) });
  function sc() { scoreEl.textContent = `내 점수 ${score}점 · 남은 카드 ${deck.length - i - 1}장`; }
  function showBack() {
    cardBox.innerHTML = "";
    const s = makeSvg(300, 200); s.append(svgEl("rect", { x: 10, y: 10, width: 280, height: 180, rx: 18, fill: "#DCEAFB", stroke: "#9DC0EA", "stroke-width": 4 }));
    for (let k = 0; k < 5; k++) s.append(txt(50 + 50 * k, 100, ["□", "△", "☆", "○", "◇"][k], 30, { fill: "#7FA6D6" }));
    cardBox.append(s, h("div", { class: "cr3cardt" }, `쌓아 둔 카드 ${deck.length - i - 1}장`));
  }
  function render() {
    side.innerHTML = ""; sc(); side.append(scoreEl);
    if (phase === "flip") {
      showBack();
      if (i >= deck.length - 1) { return; }
      side.append(h("p", {}, "내 차례예요. 쌓아 둔 카드 한 장을 뒤집어요."), h("button", { class: "big", type: "button", onclick: () => { i++; phase = "eq"; firstTry = true; render(); } }, "카드 뒤집기"));
      return;
    }
    const c = deck[i];
    cardBox.innerHTML = "";
    if (c.kind === "age") { const s = makeSvg(300, 200); s.append(txt(150, 46, "동생 9살", 26, { fill: CR3C.blue }), txt(150, 92, "언니 12살", 26, { fill: CR3C.orange }), txt(150, 150, "해마다 두 사람 모두", 18, { fill: CR3C.gray }), txt(150, 176, "1살씩 많아져요", 18, { fill: CR3C.gray })); cardBox.append(s); }
    else cardBox.append(cr3Scene({ kind: c.kind, n0: c.n, max: c.n, static: true, h: 180 }).el);
    cardBox.append(h("div", { class: "cr3cardt" }, c.t), h("p", { class: "cr3muted", style: "text-align:center" }, c.note));
    if (phase === "eq") {
      const ns = [1, 2, 3, 4, 5, 6];
      const E = cr3Eq({ vars: c.vars.map(v => ({ s: v.s, name: v.name, v: ns.map(v.f) })), ans: c.ans, q: "카드에 정해진 기호로 두 양 사이의 대응 관계를 식으로 나타내요." });
      const fb = h("p", { class: "cr3muted" });
      side.append(E.el, h("button", { class: "big", type: "button", onclick: () => {
        api.tryOnce(); const m = E.check();
        if (m) { firstTry = false; fb.textContent = "× " + m + " 다시 써 봐요."; return; }
        if (firstTry) { score += 1; log.prepend(h("div", {}, `${i + 1}번 카드: 식이 맞아서 1점 (${E.given()})`)); phase = "die"; }
        else { log.prepend(h("div", {}, `${i + 1}번 카드: 다시 써서 맞혔어요. 이번 카드는 점수 없이 넘어가요 (${E.given()})`)); phase = i >= deck.length - 1 ? "end" : "flip"; }
        render();
      } }, "식 확인"), fb);
      return;
    }
    if (phase === "die") {
      const dieBox = h("div"), res = h("p", { class: "jua" });
      dieBox.append(cr3DieSvg(1));
      side.append(h("p", {}, "식이 맞았어요(1점). 이 카드를 뒤집은 사람은 나예요. 주사위를 던져요. 홀수가 나오면 1점, 짝수가 나오면 2점을 더 얻어요."), dieBox,
        h("button", { class: "big", type: "button", onclick: e => {
          e.currentTarget.disabled = true; let t = 0;
          const spin = setInterval(() => { dieBox.innerHTML = ""; dieBox.append(cr3DieSvg(1 + Math.floor(Math.random() * 6))); if (++t > 8) { clearInterval(spin);
            const v = 1 + Math.floor(Math.random() * 6), plus = v % 2 ? 1 : 2; dieBox.innerHTML = ""; dieBox.append(cr3DieSvg(v)); score += plus;
            res.textContent = `${v}${v % 2 ? "은(는) 홀수" : "은(는) 짝수"}라서 ${plus}점을 더 얻었어요. 이 카드에서 1+${plus}=${1 + plus}(점)!`.replace(/(\d)은\(는\)/, (m0, d) => d + (cr3Jong(d) ? "은" : "는"));
            log.prepend(h("div", {}, `   주사위 ${v} → ${plus}점 더`));
            phase = i >= deck.length - 1 ? "end" : "flip"; sc();
            side.append(h("button", { class: "big", type: "button", onclick: render }, phase === "end" ? "결과 보기" : "다음 카드로")); } }, 70);
        } }, "주사위 던지기"), res);
      return;
    }
    if (phase === "end") {
      showBack();
      side.append(h("p", { class: "jua" }, `남은 카드가 없어요. 놀이 끝! 내 점수는 ${score}점이에요.`), h("p", {}, "친구들과 할 때는 점수의 합이 가장 높은 사람이 이겨요. 카드의 기호를 잘 보고 식을 세우면 점수를 얻을 수 있어요."));
      api.done(`놀이 점수 ${score}점`, opt.ok || `카드 ${deck.length}장 놀이를 마쳤어요. 내 점수는 ${score}점이에요.`);
    }
  }
  render();
}
//@@LESSONS
