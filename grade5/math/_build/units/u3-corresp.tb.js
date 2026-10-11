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
  for (const v of keys) { const c = toks.filter(t => t === v).length; if (!c) return { ok: false, msg: `두 양을 나타내는 ${keys.length === 2 && keys.every(k => k.length === 1) ? keys.join(", ") + " 기호를" : "말을"} 모두 한 번씩 써서 식을 만들어요.` }; if (c > 1) return { ok: false, msg: `${cr3J(v, "을/를")} 두 번 썼어요. 두 양을 한 번씩만 써요.` }; }
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
            side.append(h("button", { class: "big", type: "button", onclick: render }, phase === "end" ? "결과 보기" : "이어서 카드 뒤집기 ▶")); } }, 70);
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
const UNIT_STORY = { title: "친환경 에너지 공원에서 대응 관계 찾기", lines: [
  "다온이는 한결이와 함께 친환경 에너지 공원에 왔어요. 태양광 그늘막, 자전거 발전기, 전기 열차, 풍력 발전기, 태양열 충전기처럼 환경을 보호하는 멋진 시설물이 가득해요.",
  "공원을 둘러보며 짝을 이루어 함께 변하는 두 양을 찾고, 그 대응 관계를 표와 말, □, △ 같은 기호를 사용한 식으로 나타내요.",
  "교과서 「수학 5-1」 3. 대응 관계의 차시 순서 그대로 만들었어요."],
  one: "대응 관계 · 다온이와 한결이가 친환경 에너지 공원에서 함께 변하는 두 양을 찾아 식으로 나타내요." };
const UNIT_KEYWORDS = ["두 양", "대응한다", "대응 관계", "짝을 이루는 두 양", "표", "몇 배", "~로 나눈 것", "더한 것", "뺀 것", "□, △ 같은 기호", "기호를 사용한 식", "곱셈식·나눗셈식", "덧셈식·뺄셈식", "기준에 따라 두 가지 식", "생활 속 대응 관계"];

const cr3Range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const CR3WATER = [["콜라", 24], ["우유", 54], ["식용유", 37], ["라면 국물", 7]];
function cr3WaterFig() {
  const tb = h("table"); tb.append(h("tr", {}, h("th", {}, "음식물"), ...CR3WATER.map(r => h("td", { class: "jua" }, r[0]))), h("tr", {}, h("th", {}, "음식물 1 mL를 깨끗한 물로 만드는 데 필요한 물의 양"), ...CR3WATER.map(r => h("td", {}, `${r[1]} L`))));
  return h("div", {}, h("div", { class: "cr3tbl" }, tb), h("p", { class: "cr3muted" }, "출처: 국립환경과학원, 『우리가 남긴 음식물, 물을 얼마나 오염시킬까요?』"));
}

const LESSONS = [
{
  id: "c1", no: 1, title: "단원 도입 ― 친환경 에너지 공원", soop: "개념 찾기(S)",
  question: "우리 주변에서 한 양이 변할 때 함께 변하는 다른 양에는 무엇이 있을까요?",
  summary: "에펠 탑을 칠하는 횟수가 늘면 사용한 페인트의 양도 늘어나고, 풍력 발전기가 늘면 날개의 수도 늘어나요. 이 단원에서는 이렇게 짝을 이루어 함께 변하는 두 양 사이의 관계를 표와 식으로 나타내요.",
  steps: [
    { name: "그림 살펴보기", inst: "에펠 탑은 주기적으로 새로 칠하는데 1번 칠할 때마다 페인트 54 t을 사용한대요. ‘＋ 하나 더’를 눌러 칠하는 횟수를 늘려 보고, 표를 완성해 보세요.", hints: ["1번 칠할 때 54 t이면, 2번 칠할 때는 54 t을 두 번 사용해요.", "54+54=108, 108+54=162"],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "bucket", tower: true, n0: 1, max: 4, need: 3, label: n => `${n}번 칠할 때`, h: 200 },
        table: { heads: ["칠하는 횟수(번)", "사용한 페인트의 양(t)"], x: [1, 2, 3], y: [54, 108, 162], by: [1, 2], f: n => 54 * n },
        ok: "에펠 탑을 칠하는 횟수가 1번씩 늘어날 때마다 페인트의 양은 54 t씩 늘어나요. 두 양이 함께 변해요." }) },
    { name: "공원 둘러보기", inst: "다온이는 한결이와 함께 친환경 에너지 공원에 왔어요. 그림을 보고 공원에서 볼 수 있는 시설을 모두 골라 보세요.", hints: ["그림에 이름이 적힌 시설을 살펴봐요.", "친환경 에너지 공원은 자연의 힘(햇빛, 바람, 사람의 힘)으로 움직이는 곳이에요."],
      render: (b, a) => cr3Do(b, a, { fig: () => h("div", { class: "cr3fig" }, cr3ParkFig()),
        choose: [{ q: "공원에서 볼 수 있는 친환경 시설을 모두 고르세요.", o: ["풍력 발전기", "전기 열차", "의자와 태양열 충전기", "석탄을 태우는 발전소", "모노레일"], a: [0, 1, 2, 4] }],
        ok: "공원에는 풍력 발전기, 전기 열차, 태양열 충전기, 모노레일처럼 환경을 보호하는 시설이 있어요." }) },
    { name: "함께 변하는 두 양", inst: "풍력 발전기 1대에는 날개가 몇 개 있을까요? 날개를 눌러 세어 보고, 발전기를 2대로 늘려 다시 세어 보세요.", hints: ["날개를 하나씩 누르면 번호가 붙어요.", "1대에 날개가 3개이면 2대에는 3개가 두 번이에요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "wind", n0: 1, max: 4, need: 2, count: true, countName: "날개", label: n => `풍력 발전기 ${n}대` },
        ask: [{ q: "풍력 발전기 1대의 날개는?", a: 3, unit: "개" }, { q: "풍력 발전기 2대의 날개는?", a: 6, unit: "개", why: { "4": "2대에 날개가 1개씩 늘어난 것이 아니에요. 3개씩 두 묶음이에요.", "5": "1대에 날개가 3개씩 있어요. 3+3을 계산해요." } }],
        ok: "풍력 발전기가 1대에서 2대로 늘어나면 날개는 3개에서 6개로 늘어나요." }) },
    { name: "배울 내용 살펴보기", inst: "책장을 넘겨 이 단원에서 배울 내용을 살펴봐요. 배우는 순서대로 눌러 보세요.", hints: ["먼저 두 양 사이의 관계를 알아본 뒤에 식으로 나타내요.", "생활 속에서 찾기와 문제 해결은 식으로 나타내기를 배운 다음이에요."],
      render: (b, a) => sequence(b, a, ["대응 관계를 식으로 나타내기", "두 양 사이의 관계 알아보기", "대응 관계를 이용하여 문제 해결하기", "생활 속에서 대응 관계를 찾아 식으로 나타내기"], [1, 0, 3, 2],
        { ok: "두 양 사이의 관계 알아보기 → 식으로 나타내기 → 생활 속에서 찾아 식으로 나타내기 → 문제 해결하기 순서로 배워요." }) },
    { name: "배운 내용 떠올리기", inst: "4학년 때 배운 수의 배열과 도형의 배열에서 규칙을 찾아보세요.", hints: ["3, 6, 12, 24는 앞의 수의 몇 배가 되나요?", "사각형이 1개, 3개, 5개, 7개로 늘어나요. 몇 개씩 늘어나나요?"],
      render: (b, a) => numbers(b, a, [
        { q: "수의 배열 3, 6, 12, 24, □에서 □에 알맞은 수는?", a: 48, why: { "27": "3씩 커지는 것이 아니에요. 3 → 6 → 12는 2배씩 커져요.", "36": "12씩 커지는 것이 아니에요. 앞의 수의 2배가 돼요." } },
        { q: "사각형이 1개, 3개, 5개, 7개로 놓인 도형의 배열에서 다섯째에 놓일 사각형은 몇 개?", a: 9, unit: "개", why: { "8": "사각형이 1개씩이 아니라 2개씩 늘어나요." } }],
        { ok: "4학년 때는 한 양이 어떻게 변하는지 규칙을 찾았어요. 이 단원에서는 두 양이 함께 어떻게 변하는지 알아봐요." }) }
  ],
  challenge: { inst: "블록 자동차 1대에는 바퀴가 4개, 관람차 1칸에는 4명이 탈 수 있어요. 함께 변하는 두 양을 생각하며 답해 보세요.", hints: ["자동차가 1대씩 늘어날 때마다 바퀴는 4개씩 늘어나요.", "10대이면 4개씩 10묶음이에요."],
    render: (b, a) => numbers(b, a, [
      { q: "블록 자동차가 2대이면 바퀴는 몇 개?", a: 8, unit: "개" },
      { q: "블록 자동차가 10대이면 바퀴는 몇 개?", a: 40, unit: "개", why: { "14": "10+4가 아니라 바퀴 4개씩 10묶음이에요." } },
      { q: "관람차 3칸에는 몇 명이 탈 수 있나요?", a: 12, unit: "명", why: { "7": "3+4가 아니라 4명씩 3칸이에요." } }],
      { ok: "자동차의 수와 바퀴의 수, 관람차 칸의 수와 탈 수 있는 사람의 수는 짝을 이루어 함께 변해요." }) }
},
{
  id: "c2", no: 2, title: "두 양 사이의 관계를 알아볼까요 ⑴", soop: "개념 구축하기(O)",
  question: "한 양이 변할 때 다른 양은 어떻게 함께 변할까요?",
  summary: "식탁이 1개씩 늘어날 때마다 식탁 다리는 4개씩 늘어나요. 식탁 다리의 수는 식탁의 수의 4배이고, 식탁의 수는 식탁 다리의 수를 4로 나눈 것과 같아요. 두 양이 짝을 이루는 것을 대응한다고 하고, 한 양이 변함에 따라 다른 양이 변할 때 두 양 사이의 관계를 대응 관계라고 해요.",
  steps: [
    { name: "만져 보기", inst: "공원 입구 무인 자전거 대여소예요. 한결: “자전거 1대에 바퀴가 2개씩 있어.” 자전거를 늘려 가며 바퀴를 눌러 세고, 표를 완성해 보세요.", hints: ["‘＋ 하나 더’를 눌러 자전거를 3대까지 늘려요.", "자전거가 1대 늘 때마다 바퀴는 2개씩 늘어나요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "bike", n0: 1, max: 4, need: 3, count: true, countName: "바퀴", label: n => `자전거 ${n}대` },
        table: { heads: ["자전거의 수(대)", "자전거 바퀴의 수(개)"], x: [1, 2, 3], y: [2, 4, 6], by: [1, 2], f: n => 2 * n },
        say: [["자전거가 1대씩 늘어날 때마다 자전거 바퀴는 ", { a: 2, why: { "1": "자전거가 1대 늘면 바퀴는 1개가 아니라 2개가 늘어나요." } }, "개씩 늘어나요."]],
        choose: [{ q: "자전거의 수에 따라 함께 변하는 것을 모두 고르세요.", o: ["자전거 바퀴의 수", "자전거 손잡이의 수", "자전거 페달의 수", "자전거 대여소의 수"], a: [0, 1, 2] }],
        ok: "자전거가 1대, 2대, 3대로 늘어나면 바퀴는 2개, 4개, 6개로 늘어나요. 손잡이와 페달의 수도 함께 변해요." }) },
    { name: "그려 보기", inst: "식탁 1개에는 다리가 4개 있어요. 식탁을 4개까지 늘려 다리를 세고, 표를 완성해 보세요.", hints: ["식탁이 1개씩 늘어날 때마다 다리는 4개씩 늘어나요.", "식탁 다리의 수는 4, 8, 12, …예요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "table", n0: 1, max: 5, need: 4, count: true, countName: "다리", label: n => `식탁 ${n}개` },
        table: { heads: ["식탁의 수(개)", "식탁 다리의 수(개)"], x: [1, 2, 3, 4], y: [4, 8, 12, 16], by: [1, 2, 3], f: n => 4 * n },
        ask: [{ q: "식탁이 5개일 때 식탁 다리는 몇 개?", a: 20, unit: "개", why: { "9": "식탁 수에 4를 더한 것이 아니에요. 다리가 4개씩 5묶음이에요.", "17": "16보다 1개가 아니라 4개가 더 늘어나요." } }],
        ok: "식탁이 1개씩 늘어날 때마다 다리는 4개씩 늘어나서, 식탁 5개의 다리는 20개예요." }) },
    { name: "말해 보기", inst: "식탁의 수와 식탁 다리의 수 사이에는 어떤 관계가 있는지 말해 보세요.", hints: ["식탁 다리의 수는 식탁의 수의 몇 배인가요? 4÷1, 8÷2, 12÷3을 생각해요.", "거꾸로 식탁의 수는 식탁 다리의 수를 몇으로 나누면 될까요?"],
      render: (b, a) => cr3Do(b, a, { fig: cr3Pic("table", 3, "식탁 3개, 식탁 다리 12개"),
        say: [["식탁 다리의 수는 식탁의 수의 ", { a: 4 }, "배예요."], ["식탁의 수는 식탁 다리의 수를 ", { a: 4 }, "로 나눈 것과 같아요."]],
        choose: [{ q: "두 양을 함께 관련지어 말한 것은 어느 것인가요?", o: ["식탁 다리는 4개씩 늘어나요.", "식탁 다리의 수는 식탁의 수의 4배예요.", "식탁은 1개씩 늘어나요."], a: 1, why: { "0": "식탁 다리 한 양만 보고 말했어요. 식탁의 수와 함께 관련지어 말해 봐요.", "2": "식탁 한 양만 보고 말했어요. 식탁 다리의 수와 함께 관련지어 말해 봐요." } }],
        ok: "식탁 다리의 수는 식탁의 수의 4배이고, 식탁의 수는 식탁 다리의 수를 4로 나눈 것과 같아요." }) },
    { name: "약속하기", inst: "약속을 완성해 보세요.", hints: ["두 양이 짝을 이루는 것을 나타내는 말을 골라요.", "한 양이 변함에 따라 다른 양이 변할 때 두 양 사이의 ‘관계’예요."],
      render: (b, a) => blanks(b, a, ["식탁의 수와 식탁 다리의 수와 같이 두 양이 짝을 이루는 것을 ", { o: ["대응한다", "비교한다", "규칙이다"], a: 0 }, "고 하고, 한 양이 변함에 따라 다른 양이 변할 때 두 양 사이의 관계를 ", { o: ["대응 관계", "크기 관계", "덧셈 관계"], a: 0 }, "라고 합니다."]) },
    { name: "확인하기", inst: "교실에서 서로 대응하는 두 양을 찾아봐요. 짝을 잇고, 사진과 집게 그림을 보며 대응 관계를 말해 보세요.", hints: ["사진 1장을 걸 때 집게가 2개 필요해요. 사진을 3장까지 늘려 집게를 세어 봐요.", "의자 1개에는 다리가 4개, 모둠 1개에는 책상이 4개 있어요."],
      render: (b, a) => cr3Do(b, a, {
        link: { lt: "한 양", rt: "짝을 이루는 양", left: ["의자의 수", "사진의 수", "모둠의 수(모둠마다 책상 4개)"], right: ["책상의 수", "의자 다리의 수", "집게의 수"], pairs: [1, 2, 0] },
        scene: { kind: "photo", n0: 1, max: 4, need: 3, count: true, countName: "집게", label: n => `사진 ${n}장` },
        say: [["집게의 수는 사진의 수의 ", { a: 2 }, "배예요."], ["사진의 수는 집게의 수를 ", { a: 2 }, "로 나눈 것과 같아요."]],
        ok: "교실에도 대응 관계가 많아요. 집게의 수는 사진의 수의 2배, 사진의 수는 집게의 수를 2로 나눈 것과 같아요." }) }
  ],
  challenge: { inst: "컵 1개에 칫솔이 2개씩 꽂혀 있어요. 표를 완성하고 물음에 답해 보세요.", hints: ["칫솔의 수는 컵의 수의 2배예요.", "그릇 1개에 방울토마토 12개씩, 그릇 8개이면 12×8이에요."],
    render: (b, a) => cr3Do(b, a, {
      table: { heads: ["컵의 수(개)", "칫솔의 수(개)"], x: [1, 2, 3], y: [2, 4, 6], by: [1, 2], f: n => 2 * n },
      say: [["컵이 1개씩 늘어날 때 칫솔은 ", { a: 2 }, "개씩 늘어나요."], ["칫솔의 수는 컵의 수의 ", { a: 2 }, "배이고, 컵의 수는 칫솔의 수를 ", { a: 2 }, "로 나눈 것과 같아요."]],
      ask: [{ q: "삼각형 1개마다 사각형 3개를 놓는 배열에서 삼각형이 4개이면 사각형은 몇 개?", a: 12, unit: "개", why: { "7": "4+3이 아니라 사각형이 3개씩 4묶음이에요." } },
        { q: "그릇 한 개에 방울토마토가 12개씩 있어요. 그릇 8개에는 모두 몇 개?", a: 96, unit: "개", why: { "20": "12+8이 아니라 12개씩 8묶음이에요." } }],
      ok: "두 양 사이의 대응 관계를 이용하면 표에 없는 수도 구할 수 있어요." }) }
},
{
  id: "c3", no: 3, title: "두 양 사이의 관계를 알아볼까요 ⑵", soop: "개념 구축하기(O)",
  question: "더하거나 빼는 관계인 두 양 사이의 대응 관계는 어떻게 말할까요?",
  summary: "길을 따라 이어진 태양광 그늘막에서 기둥의 수는 그늘막의 수보다 1개 더 많아요. 그늘막의 수는 기둥의 수보다 1개 더 적어요. 몇 배인 관계뿐 아니라 더하거나 빼는 관계도 대응 관계예요.",
  steps: [
    { name: "만져 보기", inst: "태양광 그늘막이 공원 길을 따라 이어져 있어요. 이웃한 그늘막은 기둥을 함께 써요. 그늘막을 늘려 가며 기둥을 눌러 세고, 표를 완성해 보세요.", hints: ["그늘막 1개에는 양 끝에 기둥이 2개 있어요.", "그늘막을 하나 더 이으면 기둥은 1개만 늘어나요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "shade", n0: 1, max: 5, need: 4, count: true, countName: "기둥", label: n => `그늘막 ${n}개` },
        table: { heads: ["그늘막의 수(개)", "기둥의 수(개)"], x: [1, 2, 3, 4], y: [2, 3, 4, 5], by: [1, 2, 3], f: n => n + 1, why: "그늘막을 하나 더 이으면 기둥이 몇 개 늘어나는지 그림에서 세어 봐요." },
        ask: [{ q: "그늘막이 5개일 때 기둥은 몇 개?", a: 6, unit: "개", why: { "10": "그늘막 1개에 기둥이 2개씩 따로 있는 것이 아니에요. 이웃한 그늘막은 기둥을 함께 써요.", "5": "양 끝에 기둥이 있으니 그늘막보다 기둥이 하나 더 있어요." } }],
        ok: "그늘막이 1개씩 늘어날 때마다 기둥도 1개씩 늘어나요. 그늘막 5개에는 기둥이 6개 있어요." }) },
    { name: "그려 보기", inst: "그늘막의 수와 기둥의 수 사이의 대응 관계를 말해 보세요.", hints: ["표에서 그늘막 2개 → 기둥 3개, 그늘막 3개 → 기둥 4개예요.", "기둥의 수와 그늘막의 수는 항상 1만큼 차이가 나요. 어느 쪽이 더 많은지 함께 말해요."],
      render: (b, a) => cr3Do(b, a, { fig: cr3Pic("shade", 3, "그늘막 3개, 기둥 4개"),
        say: [["그늘막의 수는 기둥의 수보다 ", { a: 1 }, "개 더 ", { o: ["적어요", "많아요"], a: 0 }, "."], ["기둥의 수는 그늘막의 수보다 ", { a: 1 }, "개 더 ", { o: ["적어요", "많아요"], a: 1 }, "."]],
        choose: [{ q: "그늘막의 수와 기둥의 수 사이의 대응 관계를 바르게 말한 것을 모두 고르세요.", o: ["기둥의 수는 그늘막의 수에 1을 더한 것과 같아요.", "그늘막의 수는 기둥의 수에서 1을 뺀 것과 같아요.", "기둥의 수는 그늘막의 수의 2배예요.", "기둥은 1개씩 늘어나요."], a: [0, 1] }],
        ok: "기둥의 수는 그늘막의 수에 1을 더한 것과 같고, 그늘막의 수는 기둥의 수에서 1을 뺀 것과 같아요. ‘2배’는 그늘막이 1개일 때만 맞아요." }) },
    { name: "말해 보기", inst: "가 모양 막대 사이사이에 나 모양 막대를 끼워 이었어요. 가 모양 막대를 늘려 가며 나 모양 막대를 세고, 표를 완성해 보세요.", hints: ["가 모양 막대가 1개일 때는 사이가 없어서 나 모양 막대가 0개예요.", "나 모양 막대는 가 모양 막대 사이에만 있어요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "bars", n0: 1, max: 5, need: 4, count: true, countName: "나 모양 막대", label: n => `가 모양 막대 ${n}개` },
        table: { heads: ["가 모양 막대의 수(개)", "나 모양 막대의 수(개)"], x: [1, 2, 3, 4], y: [0, 1, 2, 3], by: [1, 2, 3], f: n => n - 1 },
        say: [["나 모양 막대의 수는 가 모양 막대의 수에서 ", { a: 1 }, "을 뺀 것과 같아요."], ["가 모양 막대의 수는 나 모양 막대의 수에 ", { a: 1 }, "을 더한 것과 같아요."]],
        ask: [{ q: "가 모양 막대가 10개일 때 나 모양 막대는 몇 개?", a: 9, unit: "개", why: { "11": "나 모양 막대가 가 모양 막대보다 1개 더 적어요.", "10": "나 모양 막대는 가 모양 막대 사이에만 있어서 1개 더 적어요." } }],
        ok: "가 모양 막대가 1개씩 늘어날 때마다 나 모양 막대도 1개씩 늘어나요. 나 모양 막대의 수는 가 모양 막대의 수에서 1을 뺀 것과 같아요." }) },
    { name: "정리하기", inst: "곱의 관계와 합(차)의 관계를 정리해 보세요.", hints: ["자전거와 바퀴는 ‘몇 배’로 말했어요.", "그늘막과 기둥은 ‘몇 개 더 많다(적다)’로 말했어요."],
      render: (b, a) => cr3Do(b, a, { link: { lt: "두 양", rt: "대응 관계", left: ["자전거의 수와 바퀴의 수", "그늘막의 수와 기둥의 수", "식탁의 수와 식탁 다리의 수", "가 모양 막대의 수와 나 모양 막대의 수"], right: ["나 모양 막대의 수는 가 모양 막대의 수에서 1을 뺀 것", "바퀴의 수는 자전거의 수의 2배", "기둥의 수는 그늘막의 수에 1을 더한 것", "식탁 다리의 수는 식탁의 수의 4배"], pairs: [1, 2, 3, 0] },
        choose: [{ q: "어느 말이 맞나요?", o: ["몇 배인 관계만 대응 관계예요.", "몇 배인 관계도, 더하거나 빼는 관계도 모두 대응 관계예요."], a: 1, why: { "0": "그늘막과 기둥처럼 더하거나 빼는 관계도 한 양이 변할 때 다른 양이 함께 변하는 대응 관계예요." } }],
        ok: "몇 배인 관계도, 더하거나 빼는 관계도 모두 대응 관계예요." }) },
    { name: "확인하기", inst: "사각형과 삼각형을 이용하여 규칙적인 배열을 만들고 있어요. 사각형을 늘려 가며 삼각형을 세고, 서로 대응하는 두 양 사이의 대응 관계를 알아보세요.", hints: ["사각형마다 위에 삼각형이 1개씩, 그리고 양 끝에 삼각형이 1개씩 있어요.", "삼각형의 수는 사각형의 수보다 2개 더 많아요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "sqtri", n0: 1, max: 5, need: 4, count: true, countName: "삼각형", label: n => `사각형 ${n}개`, h: 200 },
        table: { heads: ["사각형의 수(개)", "삼각형의 수(개)"], x: [1, 2, 3, 4], y: [3, 4, 5, 6], by: [1, 2, 3], f: n => n + 2 },
        say: [["삼각형의 수는 사각형의 수에 ", { a: 2, why: { "1": "사각형 1개일 때 삼각형이 3개예요. 3은 1보다 얼마나 큰가요?" } }, "를 더한 것과 같아요."], ["사각형의 수는 삼각형의 수에서 ", { a: 2 }, "를 뺀 것과 같아요."]],
        choose: [{ q: "서로 대응하는 두 양은 무엇인가요?", o: ["사각형의 수와 삼각형의 수", "사각형의 색깔과 삼각형의 색깔", "배열의 이름과 종이의 수"], a: 0 }],
        ok: "사각형이 1개씩 늘어날 때마다 삼각형도 1개씩 늘어나요. 삼각형의 수는 사각형의 수에 2를 더한 것과 같아요." }) }
  ],
  challenge: { inst: "의자를 나란히 이어 놓았어요. 의자 사이와 양 끝에 팔걸이가 있어요. 표를 완성하고 물음에 답해 보세요. 또, 매년 3월 1일에 민지는 10살, 11살, 12살일 때 오빠는 14살, 15살, 16살이었어요.", hints: ["팔걸이의 수는 의자의 수에 1을 더한 것과 같아요.", "오빠의 나이는 민지의 나이에 4를 더한 것과 같아요."],
    render: (b, a) => cr3Do(b, a, { fig: cr3Pic("armchair", 3, "의자 3개, 팔걸이 4개"),
      table: { heads: ["의자의 수(개)", "팔걸이의 수(개)"], x: [1, 2, 3, 4], y: [2, 3, 4, 5], by: [1, 2, 3], f: n => n + 1 },
      ask: [{ q: "의자가 20개일 때 팔걸이는 몇 개?", a: 21, unit: "개", why: { "40": "의자마다 팔걸이가 2개씩 따로 있는 것이 아니에요. 이웃한 의자는 팔걸이를 함께 써요.", "19": "양 끝에도 팔걸이가 있어서 의자보다 1개 더 많아요." } },
        { q: "민지가 15살인 해에 오빠는 몇 살?", a: 19, unit: "살", why: { "16": "오빠는 민지보다 1살이 아니라 4살 더 많아요.", "11": "오빠가 민지보다 나이가 더 많아요." } }],
      ok: "팔걸이의 수는 의자의 수에 1을 더한 것, 오빠의 나이는 민지의 나이에 4를 더한 것과 같아요." }) }
},
{
  id: "c4", no: 4, title: "대응 관계를 식으로 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "두 양 사이의 대응 관계를 기호를 사용하여 식으로 어떻게 나타낼까요?",
  summary: "솜사탕 1개를 만들려면 페달을 4분 동안 밟아야 해요. (페달을 밟는 시간)=(솜사탕의 수)×4 또는 (솜사탕의 수)=(페달을 밟는 시간)÷4로 나타내요. 엽서의 수를 □, 자석의 수를 △라고 하면 △=□+1 또는 □=△−1이에요. 각 양을 ○, △, □, ☆과 같은 기호로 나타내면 대응 관계를 식으로 간단하게 나타낼 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "자전거 발전기로 솜사탕 1개를 만들려면 페달을 4분 동안 밟아야 해요. 솜사탕을 늘려 가며 1분 칸을 눌러 세고, 표를 완성해 보세요.", hints: ["솜사탕 1개마다 1분 칸이 4개씩 있어요.", "16분은 4분씩 4번이에요. 그러면 솜사탕은 몇 개일까요?"],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "cotton", n0: 1, max: 4, need: 3, count: true, countName: "1분 칸", label: n => `솜사탕 ${n}개`, h: 200 },
        table: { heads: ["솜사탕의 수(개)", "페달을 밟는 시간(분)"], x: [1, 2, 3, 4, 5], y: [4, 8, 12, 16, 20], bx: [3], by: [1, 2, 4], f: n => 4 * n },
        say: [["솜사탕이 1개씩 늘어날 때마다 페달을 밟는 시간은 ", { a: 4 }, "분씩 늘어나요."], ["페달을 밟는 시간은 솜사탕의 수의 ", { a: 4 }, "배예요."]],
        ok: "서로 대응하는 두 양은 솜사탕의 수와 페달을 밟는 시간이에요. 페달을 밟는 시간은 솜사탕의 수의 4배예요." }) },
    { name: "그려 보기", inst: "보기 카드에서 알맞은 카드를 골라 솜사탕의 수와 페달을 밟는 시간 사이의 대응 관계를 식으로 나타내 보세요. 식 1을 만든 뒤, 식 2 줄을 눌러 다른 연산 기호로도 나타내 보세요.", hints: ["(페달을 밟는 시간)=(솜사탕의 수)×4 처럼 곱셈식으로 나타낼 수 있어요.", "기준을 바꾸면 나눗셈식이 돼요. (솜사탕의 수)=(페달을 밟는 시간)÷4"],
      render: (b, a) => cr3Cards(b, a, { cards: ["=", "2", "4", "+", "−", "×", "÷", "솜사탕의 수", "페달을 밟는 시간"], vars: { "솜사탕의 수": [1, 2, 3, 4, 5], "페달을 밟는 시간": [4, 8, 12, 16, 20] }, need: 2,
        table: { heads: ["솜사탕의 수(개)", "페달을 밟는 시간(분)"], x: [1, 2, 3, 4, 5], y: [4, 8, 12, 16, 20], f: n => 4 * n },
        ans: [["페달을 밟는 시간", "=", "솜사탕의 수", "×", "4"], ["솜사탕의 수", "=", "페달을 밟는 시간", "÷", "4"]],
        ok: "(페달을 밟는 시간)=(솜사탕의 수)×4, (솜사탕의 수)=(페달을 밟는 시간)÷4로 나타낼 수 있어요. 같은 대응 관계를 곱셈식과 나눗셈식으로 나타냈어요." }) },
    { name: "말해 보기", inst: "엽서를 나란히 붙이며 엽서와 엽서가 만나는 곳과 양 끝에 자석을 붙였어요. 엽서를 늘려 가며 자석을 세고, 표를 완성해 보세요.", hints: ["엽서 1장에는 자석이 2개 필요해요.", "엽서를 1장 더 붙이면 자석은 1개만 더 필요해요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "card", n0: 1, max: 5, need: 4, count: true, countName: "자석", label: n => `엽서 ${n}장` },
        table: { heads: ["엽서의 수(장)", "자석의 수(개)"], x: [1, 2, 3, 4, 5], y: [2, 3, 4, 5, 6], bx: [2, 4], by: [3], f: n => n + 1 },
        say: [["자석의 수는 엽서의 수에 ", { a: 1 }, "을 더한 것과 같아요."], ["엽서의 수는 자석의 수에서 ", { a: 1 }, "을 뺀 것과 같아요."]],
        ok: "엽서가 1장씩 늘어날 때마다 자석은 1개씩 늘어나요. (자석의 수)=(엽서의 수)+1, (엽서의 수)=(자석의 수)−1이에요." }) },
    { name: "약속하기", inst: "엽서의 수를 □, 자석의 수를 △라고 할 때, 두 양 사이의 대응 관계를 식으로 나타내 보세요. 덧셈식과 뺄셈식으로 모두 나타내요.", hints: ["(자석의 수)=(엽서의 수)+1에서 낱말을 기호로 바꿔요.", "△=□+1, 기준을 바꾸면 □=△−1"],
      render: (b, a) => cr3Do(b, a, { promise: "각 양을 ○, △, □, ☆과 같은 기호로 나타내면 두 양 사이의 대응 관계를 식으로 간단하게 나타낼 수 있어요.",
        table: { heads: ["엽서의 수(장) □", "자석의 수(개) △"], x: [1, 2, 3, 4, 5], y: [2, 3, 4, 5, 6], f: n => n + 1 },
        eq: { vars: [{ s: "□", name: "엽서의 수", v: [1, 2, 3, 4, 5] }, { s: "△", name: "자석의 수", v: [2, 3, 4, 5, 6] }], need: 2, ans: ["△=□+1", "□=△−1"] },
        ok: "△=□+1 또는 □=△−1로 간단하게 나타낼 수 있어요." }) },
    { name: "확인하기", inst: "티볼 공 1개의 무게는 80 g이에요. 표를 완성하고, 티볼 공의 수를 ☆, 티볼 공의 무게를 □라고 할 때 대응 관계를 식으로 나타내 보세요.", hints: ["티볼 공의 무게는 티볼 공의 수의 80배예요.", "□=☆×80, 기준을 바꾸면 ☆=□÷80"],
      render: (b, a) => cr3Do(b, a, { fig: cr3Pic("tball", 3, "티볼 공 1개의 무게는 80 g"),
        table: { heads: ["티볼 공의 수(개)", "티볼 공의 무게(g)"], x: [1, 2, 3, 4, 5], y: [80, 160, 240, 320, 400], bx: [2, 4], by: [1, 3, 4], f: n => 80 * n },
        eq: { vars: [{ s: "☆", name: "티볼 공의 수", v: [1, 2, 3, 4, 5] }, { s: "□", name: "티볼 공의 무게", v: [80, 160, 240, 320, 400] }], need: 2, ans: ["□=☆×80", "☆=□÷80"] },
        ask: [{ q: "티볼 공 50개의 무게는 몇 g?", a: 4000, unit: "g", why: { "130": "50+80이 아니라 80 g씩 50개예요.", "400": "50×8이 아니라 50×80을 계산해요." } }],
        ok: "□=☆×80 또는 ☆=□÷80이에요. 식을 이용하면 티볼 공 50개의 무게 50×80=4000(g)도 쉽게 구할 수 있어요." }) }
  ],
  challenge: { inst: "날개가 6개인 바람개비, 매년 1월 1일의 연도와 서우의 나이(2023년에 10살), 팔찌 1개에 구슬 20개인 상황이에요. 기호를 사용하여 식으로 나타내 보세요.", hints: ["바람개비 날개의 수는 바람개비의 수의 6배예요.", "2023년에 10살이면 나이는 연도에서 2013을 뺀 것과 같아요. 세빈이는 ◎와 ♡가 무엇을 나타내는지 살펴봐요."],
    render: (b, a) => cr3Do(b, a, {
      choose: [{ q: "팔찌 1개에 구슬이 20개씩 있어요. 대응 관계를 잘못 설명한 사람은?", o: ["미나: 팔찌의 수를 □, 구슬의 수를 ▽라고 하면 □=▽÷20이에요.", "세빈: ♡=◎×20에서 ◎는 구슬의 수, ♡는 팔찌의 수예요."], a: 1, why: { "0": "구슬의 수를 20으로 나누면 팔찌의 수가 돼요. 미나의 식은 맞아요." } }],
      eq: [{ title: "바람개비의 수를 □, 바람개비 날개의 수를 ○라고 할 때", vars: [{ s: "□", name: "바람개비의 수", v: [1, 2, 3, 4] }, { s: "○", name: "바람개비 날개의 수", v: [6, 12, 18, 24] }], need: 1, ans: ["○=□×6", "□=○÷6"] },
        { title: "연도를 △, 서우의 나이를 ☆라고 할 때", vars: [{ s: "△", name: "연도", v: [2023, 2024, 2025, 2026] }, { s: "☆", name: "서우의 나이", v: [10, 11, 12, 13] }], need: 1, ans: ["☆=△−2013", "△=☆+2013"] }],
      ok: "세빈이는 기호가 나타내는 양을 바꾸어 말했어요. ◎가 팔찌의 수, ♡가 구슬의 수여야 해요." }) }
},
{
  id: "c5", no: 5, title: "생활 속에서 대응 관계를 찾아 식으로 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "생활 속에서 서로 대응하는 두 양을 찾아 식으로 어떻게 나타낼까요?",
  summary: "풍력 발전기 1대에 날개가 3개이면 풍력 발전기의 수를 ◇, 날개의 수를 ♡라고 할 때 ♡=◇×3이에요. 같은 대응 관계라도 어떤 기호를 쓰는지, 무엇을 기준으로 하는지에 따라 식이 달라질 수 있어요.",
  steps: [
    { name: "만져 보기", inst: "“풍력 발전기는 1대당 날개가 3개씩 있고, 의자 2개 사이에 태양열 충전기가 1개씩 있어.” “전기 열차는 1분에 100 m씩 이동하고, 모노레일은 페달을 1번 밟으면 50 cm를 이동한대.” 공원 그림에서 시설을 눌러 서로 대응하는 두 양을 4가지 찾아보세요.", hints: ["그림에 이름이 적힌 시설을 하나씩 눌러 봐요.", "시설 하나에서 짝을 이루어 함께 변하는 두 양이 나와요."],
      render: (b, a) => cr3Find(b, a, { need: 4, spots: { wind: "풍력 발전기의 수와 날개의 수", train: "전기 열차가 달린 시간과 이동 거리", mono: "모노레일 페달을 밟은 횟수와 이동 거리", chair: "의자의 수와 태양열 충전기의 수", bike: "자전거의 수와 자전거 바퀴의 수" },
        ok: "에너지 공원에는 서로 대응하는 두 양이 아주 많아요." }) },
    { name: "그려 보기", inst: "풍력 발전기의 수와 날개의 수 사이의 대응 관계를 알아봐요. 발전기를 늘려 가며 날개를 세고, 표를 완성한 뒤 기호 식으로 나타내 보세요.", hints: ["날개의 수는 풍력 발전기의 수의 3배예요.", "♡=◇×3, 기준을 바꾸면 ◇=♡÷3"],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "wind", n0: 1, max: 4, need: 3, count: true, countName: "날개", label: n => `풍력 발전기 ${n}대` },
        table: { heads: ["풍력 발전기의 수(대) ◇", "날개의 수(개) ♡"], x: [1, 2, 3, 4], y: [3, 6, 9, 12], bx: [3], by: [1, 2], f: n => 3 * n },
        eq: { vars: [{ s: "◇", name: "풍력 발전기의 수", v: [1, 2, 3, 4] }, { s: "♡", name: "날개의 수", v: [3, 6, 9, 12] }], need: 2, ans: ["♡=◇×3", "◇=♡÷3"] },
        ok: "♡=◇×3 또는 ◇=♡÷3이에요." }) },
    { name: "말해 보기", inst: "에너지 공원에서 찾은 다른 두 양도 식으로 나타내 보세요. 이번에는 두 양을 나타낼 기호를 내가 골라요.", hints: ["전기 열차는 1분에 100 m씩 이동해요. 이동 거리는 달린 시간의 100배예요.", "의자 2개 사이에 충전기가 1개씩 있어요. 충전기의 수는 의자의 수보다 1개 더 적어요."],
      render: (b, a) => cr3Do(b, a, { eq: [
        { title: "전기 열차 (1분에 100 m씩 이동)", pick: true, vars: [{ name: "전기 열차가 달린 시간(분)", v: [1, 2, 3, 4] }, { name: "이동 거리(m)", v: [100, 200, 300, 400] }], need: 1, ans: ["예) ☆=□×100 (□: 시간, ☆: 거리)"] },
        { title: "의자와 태양열 충전기 (의자 2개 사이에 충전기 1개)", pick: true, fig: cr3Pic("chair", 3, "의자 3개, 태양열 충전기 2개", 170), vars: [{ name: "의자의 수", v: [2, 3, 4, 5] }, { name: "태양열 충전기의 수", v: [1, 2, 3, 4] }], need: 1, ans: ["예) △=□−1 (□: 의자, △: 충전기)"] }],
        ok: "내가 고른 기호로 대응 관계를 식으로 나타냈어요." }) },
    { name: "비교하기", inst: "친구가 나타낸 식과 비교해 보세요. 그리고 모노레일(페달을 1번 밟으면 50 cm 이동)의 대응 관계도 식으로 나타내 보세요.", hints: ["두 식 모두 이동 거리가 달린 시간의 100배라는 같은 관계를 나타내요.", "▽=⊙×50"],
      render: (b, a) => cr3Do(b, a, {
        choose: [{ q: "다온이는 전기 열차의 대응 관계를 ☆=□×100, 한결이는 ▽=⊙×100으로 나타냈어요. (□, ⊙는 달린 시간, ☆, ▽는 이동 거리) 어떻게 생각하나요?", o: ["두 식 모두 맞아요. 기호만 다르게 하여 같은 대응 관계를 나타냈어요.", "□와 △만 쓸 수 있으니 한결이의 식은 틀렸어요.", "두 식 모두 틀렸어요."], a: 0, why: { "1": "대응 관계를 식으로 나타낼 때는 ○, ☆, ♡, ⊙처럼 여러 가지 기호를 쓸 수 있어요.", "2": "표의 수를 넣어 보면 두 식 모두 맞아요." } }],
        eq: { title: "모노레일 페달을 밟은 횟수를 ⊙, 이동 거리(cm)를 ▽라고 할 때", vars: [{ s: "⊙", name: "페달을 밟은 횟수", v: [1, 2, 3, 4] }, { s: "▽", name: "이동 거리(cm)", v: [50, 100, 150, 200] }], need: 1, ans: ["▽=⊙×50", "⊙=▽÷50"] },
        ok: "같은 대응 관계도 기호를 다르게 하여 나타낼 수 있어요. 모노레일은 ▽=⊙×50 또는 ⊙=▽÷50이에요." }) },
    { name: "확인하기", inst: "우리 주변에서도 대응 관계를 찾아봐요. “작품을 전시하기 위해 사용한 고리의 수는 작품의 수보다 1개 더 적어.” 작품을 늘려 가며 고리를 세고, 기호를 골라 식으로 나타내 보세요.", hints: ["작품과 작품 사이에만 고리가 있어요.", "작품의 수를 □, 고리의 수를 △라고 하면 △=□−1"],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "art", n0: 1, max: 5, need: 4, count: true, countName: "고리", label: n => `작품 ${n}개` },
        eq: { pick: true, vars: [{ name: "작품의 수", v: [1, 2, 3, 4, 5] }, { name: "고리의 수", v: [0, 1, 2, 3, 4] }], need: 1, ans: ["예) △=□−1 (□: 작품, △: 고리)"] },
        ok: "고리의 수는 작품의 수보다 1개 더 적어요. 덧셈식이나 뺄셈식으로 나타나는 대응 관계도 생활 속에 있어요." }) }
  ],
  challenge: { inst: "도시락마다 초밥이 8개씩 있어요. 또, 어느 해 4월 1일에 주호는 9살, 누나는 14살이었어요. 기호를 사용하여 식으로 나타내 보세요.", hints: ["초밥의 수는 도시락의 수의 8배예요.", "누나의 나이는 주호의 나이에 5를 더한 것과 같아요."],
    render: (b, a) => cr3Do(b, a, {
      eq: [{ title: "도시락의 수를 □, 초밥의 수를 ○라고 할 때", vars: [{ s: "□", name: "도시락의 수", v: [1, 2, 3, 4] }, { s: "○", name: "초밥의 수", v: [8, 16, 24, 32] }], need: 1, ans: ["○=□×8", "□=○÷8"] },
        { title: "주호의 나이를 □, 누나의 나이를 ○라고 할 때", vars: [{ s: "□", name: "주호의 나이", v: [9, 10, 11, 12] }, { s: "○", name: "누나의 나이", v: [14, 15, 16, 17] }], need: 1, ans: ["○=□+5", "□=○−5"] }],
      ask: [{ q: "주호가 13살이 되는 해에 누나는 몇 살?", a: 18, unit: "살", why: { "14": "누나는 주호보다 1살이 아니라 5살 더 많아요.", "8": "누나가 주호보다 나이가 더 많아요." } }],
      ok: "○=□×8, ○=□+5처럼 식으로 나타내면 대응 관계를 간단하게 알 수 있어요." }) }
},
{
  id: "c6", no: 6, title: "생각을 더하다 ― 소중한 물, 우리가 지켜요", soop: "탐구 정리하기(O)",
  question: "대응 관계를 이용하여 음식물을 깨끗한 물로 만드는 데 필요한 물의 양을 어떻게 구할까요?",
  summary: "우유 1 mL를 깨끗한 물로 만드는 데 물 54 L가 필요해요. 우유의 양을 □, 필요한 물의 양을 △라고 하면 △=□×54이고, 우유 200 mL에는 200×54=10800(L)의 물이 필요해요.",
  steps: [
    { name: "이해해요", inst: "물은 우리의 건강을 지키고 물에서 사는 동물과 식물을 보호하는 소중한 자원이에요. 물을 오염시키는 원인 중 하나가 버려진 음식물이에요. 표를 보고, 우유 200 mL를 깨끗한 물로 만드는 데 필요한 물은 몇 L인지 구하는 문제를 이해해 보세요.", hints: ["문제의 마지막 문장에 구하려는 것이 있어요.", "표에서 우유 칸을 찾아요."],
      render: (b, a) => cr3Do(b, a, { fig: cr3WaterFig,
        choose: [{ q: "구하려는 것은 무엇인가요?", o: ["우유 200 mL를 깨끗한 물로 만드는 데 필요한 물의 양", "우유 1 mL를 깨끗한 물로 만드는 데 필요한 물의 양", "우유 200 mL의 무게"], a: 0, why: { "1": "우유 1 mL에 필요한 물의 양은 표에 이미 나와 있어요." } }],
        ask: [{ q: "우유 1 mL를 깨끗한 물로 만드는 데 필요한 물은?", a: 54, unit: "L", why: { "24": "24 L는 콜라예요. 우유 칸을 다시 찾아봐요." } }],
        ok: "우유 1 mL에 물 54 L가 필요해요. 우유 200 mL에 필요한 물의 양을 구해요." }) },
    { name: "계획해요", inst: "“우유가 1 mL, 2 mL, 3 mL, …일 때, 필요한 물은 각각 몇 L인지 생각해 볼까?” 어떻게 해결하면 좋을지 골라 보세요.", hints: ["우유의 양과 필요한 물의 양은 짝을 이루어 함께 변해요."],
      render: (b, a) => cr3Do(b, a, { choose: [{ q: "어떤 방법으로 해결하면 좋을까요?", o: ["우유가 1 mL씩 늘어날 때마다 필요한 물이 몇 L씩 늘어나는지 알아보고, 대응 관계를 식으로 나타내요.", "우유 200 mL와 54 L를 더해요.", "우유가 200 mL이니 물도 200 L가 필요하다고 생각해요."], a: 0, why: { "1": "우유의 양과 물의 양은 더하는 관계가 아니에요. 우유 2 mL에 물이 얼마나 필요한지 생각해 봐요.", "2": "우유 1 mL에 물이 1 L가 아니라 54 L 필요해요." } }],
        ok: "표를 만들어 대응 관계를 찾고, 식으로 나타내어 200 mL일 때를 구해요." }) },
    { name: "해결해요 ①", inst: "표를 완성하고, 우유의 양을 □, 필요한 물의 양을 △라고 할 때 대응 관계를 식으로 나타내 보세요.", hints: ["우유가 1 mL씩 늘어날 때마다 물은 54 L씩 늘어나요.", "필요한 물의 양(L)은 우유의 양(mL)의 54배예요. △=□×54"],
      render: (b, a) => cr3Do(b, a, {
        table: { heads: ["우유의 양(mL) □", "필요한 물의 양(L) △"], x: [1, 2, 3, 4], y: [54, 108, 162, 216], by: [1, 2, 3], f: n => 54 * n, w: "4em" },
        say: [["필요한 물의 양(L)은 우유의 양(mL)의 ", { a: 54 }, "배예요."]],
        eq: { vars: [{ s: "□", name: "우유의 양(mL)", v: [1, 2, 3, 4] }, { s: "△", name: "필요한 물의 양(L)", v: [54, 108, 162, 216] }], need: 1, ans: ["△=□×54", "□=△÷54"] },
        ok: "△=□×54 또는 □=△÷54예요." }) },
    { name: "해결해요 ②", inst: "식을 이용하여 우유 200 mL를 깨끗한 물로 만드는 데 필요한 물의 양을 구하고, 다른 음식물도 구해 보세요(콜라 200 mL, 식용유 15 mL, 라면 국물 500 mL).", hints: ["△=□×54에서 □ 자리에 200을 넣어요.", "콜라는 1 mL에 24 L, 식용유는 37 L, 라면 국물은 7 L예요."],
      render: (b, a) => cr3Do(b, a, { fig: cr3WaterFig,
        ask: [{ q: "우유 200 mL에 필요한 물은?", a: 10800, unit: "L", why: { "254": "200+54가 아니라 200×54를 계산해요.", "1080": "200×54를 다시 계산해 봐요. 2×54=108이니 200×54는?" } },
          { q: "콜라 200 mL에 필요한 물은?", a: 4800, unit: "L", why: { "224": "200+24가 아니라 200×24를 계산해요." } },
          { q: "식용유 15 mL에 필요한 물은?", a: 555, unit: "L", why: { "52": "15+37이 아니라 15×37을 계산해요." } },
          { q: "라면 국물 500 mL에 필요한 물은?", a: 3500, unit: "L", why: { "507": "500+7이 아니라 500×7을 계산해요." } }],
        ok: "우유 200 mL에는 10800 L, 콜라 200 mL에는 4800 L, 식용유 15 mL에는 555 L, 라면 국물 500 mL에는 3500 L의 물이 필요해요. 음식물을 남기지 않는 것이 물을 지키는 방법이에요." }) },
    { name: "되돌아봐요", inst: "문제를 해결한 과정을 되돌아봐요.",
      render: (b, a) => writeStep(b, a, [
        { q: "문제를 해결한 방법을 설명해 보세요.", tag: "방법", ph: "예) 표를 만들어 대응 관계를 찾고 △=□×54로 나타낸 뒤, □에 200을 넣어 10800 L를 구했어요." },
        { q: "물을 지키기 위해 내가 할 수 있는 일을 써 보세요.", tag: "실천", ph: "예) 먹을 만큼만 받아서 음식물을 남기지 않아요." }]) }
  ],
  challenge: { inst: "조건을 바꾸어 풀어 보세요.", hints: ["1 L는 1000 mL예요. 1000×54를 계산해요.", "우유 200 mL와 콜라 200 mL에 필요한 물의 양의 차를 구해요."],
    render: (b, a) => numbers(b, a, [
      { q: "우유 1 L(=1000 mL)를 깨끗한 물로 만드는 데 필요한 물은 몇 L?", a: 54000, unit: "L", why: { "54": "54 L는 우유 1 mL에 필요한 물이에요. 1 L는 1000 mL예요." } },
      { q: "우유 200 mL에는 콜라 200 mL보다 물이 몇 L 더 필요한가요?", a: 6000, unit: "L", why: { "30": "54−24는 1 mL일 때의 차예요. 200 mL일 때를 구해요." } }],
      { ok: "대응 관계를 식으로 나타내면 조건이 바뀌어도 쉽게 구할 수 있어요." }) }
},
{
  id: "c7", no: 7, title: "놀이를 더하다 ― 자신만만 대응 관계", soop: "발표하기(P)",
  question: "놀이 카드에서 두 양 사이의 대응 관계를 찾아 기호를 사용하여 식으로 나타낼 수 있나요?",
  summary: "카드를 뒤집어 두 양 사이의 대응 관계를 카드에 정해진 기호로 식을 세워요. 식이 맞으면 1점, 카드를 뒤집은 사람은 주사위를 던져 홀수이면 1점, 짝수이면 2점을 더 얻어요.",
  steps: [
    { name: "놀이 방법 알기", inst: "놀이 방법을 차례대로 눌러 보세요.", hints: ["카드를 섞어 쌓아 두고 순서를 정한 뒤에 카드를 뒤집어요.", "점수의 합이 가장 높은 사람이 이겨요."],
      render: (b, a) => sequence(b, a, ["카드를 보고 두 양 사이의 대응 관계를 기호를 사용하여 각자 식으로 나타내요", "카드를 섞어 뒤집어 쌓아 두고 가위바위보로 순서를 정해요", "남은 카드가 없을 때까지 반복하고, 점수의 합이 가장 높은 사람이 이겨요", "자기 차례에 카드 한 장을 뒤집어 내려놓아요", "식이 맞은 사람은 1점, 카드를 뒤집은 사람은 주사위를 던져 점수를 더 얻어요"], [1, 3, 0, 4, 2],
        { ok: "섞어 쌓기 → 카드 뒤집기 → 식 세우기 → 점수 얻기 → 반복하기 순서예요." }) },
    { name: "규칙 살펴보기", inst: "놀이에서 주의할 점과 점수 얻는 방법을 알아봐요.", hints: ["카드에 기호가 정해져 있어요.", "주사위 눈이 짝수(2, 4, 6)이면 2점을 더 얻어요."],
      render: (b, a) => cr3Do(b, a, {
        choose: [{ q: "토끼풀 카드: 토끼풀의 수(□)와 잎의 수(△), 토끼풀 1개에 잎이 3장이에요. 맞는 식을 모두 고르세요.", o: ["△=□×3", "□=△÷3", "△=□+3", "□=△×3"], a: [0, 1] },
          { q: "식이 맞고, 내가 카드를 뒤집었는데 주사위 눈이 4가 나왔어요. 이 카드에서 얻은 점수는?", o: ["1점", "2점", "3점"], a: 2, why: { "0": "카드를 뒤집은 사람은 주사위 점수를 더 얻어요.", "1": "식이 맞아서 얻은 1점에 주사위 점수를 더해요." } }],
        ok: "카드에 정해진 기호를 잘 살펴보고, 식은 기준에 따라 두 가지로 나타낼 수 있어요. 4는 짝수라서 1+2=3(점)이에요." }) },
    { name: "놀이하기", inst: "카드를 한 장씩 뒤집어 대응 관계를 식으로 나타내 보세요. 식이 맞으면 주사위를 던져 점수를 더 얻어요. 친구와 함께 할 때는 각자 공책에 식을 써요.", hints: ["카드에 적힌 기호를 그대로 써요.", "그림 속 하나에 몇 개씩 있는지 먼저 세어 봐요."],
      render: (b, a) => cr3Game(b, a, {}) },
    { name: "또 다른 놀이", inst: "문제를 내는 사람이 대응 관계를 기호 식으로 나타내면, 나머지는 식에 알맞은 상황을 찾아요. 식 ○=△×8에 알맞은 상황을 골라 보세요.", hints: ["○는 △의 8배예요. 1개에 8개씩 있는 것을 떠올려요.", "△가 하나일 때 ○가 8이 되어야 해요."],
      render: (b, a) => cr3Do(b, a, { fig: cr3Pic("octopus", 2, "문어 1마리에 다리 8개"),
        choose: [{ q: "○=△×8에 알맞은 상황은?", o: ["문어의 수(△)와 문어 다리의 수(○)", "문어 다리의 수(△)와 문어의 수(○)", "나이가 8살 차이 나는 형(○)과 동생(△)"], a: 0, why: { "1": "△와 ○를 바꾸어 썼어요. △가 1이면 ○는 8이 되어야 해요.", "2": "8살 차이는 ○=△+8로 나타내요." } }],
        ok: "문어 1마리에 다리가 8개이므로 ○=△×8이에요." }) },
    { name: "정리하기", inst: "놀이를 하며 알게 된 것을 정리해 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 식을 세울 때 주의할 점은 무엇인가요?", tag: "주의할 점", ph: "예) 카드에 정해진 기호가 어떤 양을 나타내는지 잘 살펴봐요." },
        { q: "놀이 카드에 넣고 싶은 새로운 대응 관계를 써 보세요.", tag: "새 카드", ph: "예) 거미의 수(□)와 거미 다리의 수(△): △=□×8" }]) }
  ],
  challenge: { inst: "또 다른 놀이에서 친구가 식 ☆=◇+2를 냈어요. 알맞은 상황을 모두 골라 보세요.", hints: ["☆는 ◇보다 2만큼 커요.", "사각형의 수(◇)와 삼각형의 수(☆) 배열을 떠올려요(3차시)."],
    render: (b, a) => cr3Do(b, a, { choose: [{ q: "☆=◇+2에 알맞은 상황을 모두 고르세요.", o: ["사각형의 수(◇)와 삼각형의 수(☆) — 3차시 배열", "동생의 나이(◇)와 2살 많은 언니의 나이(☆)", "자전거의 수(◇)와 바퀴의 수(☆)", "언니의 나이(◇)와 2살 적은 동생의 나이(☆)"], a: [0, 1] }],
      ok: "☆가 ◇보다 2만큼 큰 상황이에요. 자전거의 바퀴는 ☆=◇×2로 나타내요." }) }
},
{
  id: "c8", no: 8, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "대응 관계에서 배운 내용을 잘 알고 있나요?",
  summary: "두 양 사이의 대응 관계를 표에서 찾아 말로 설명하고, □, △ 같은 기호를 사용하여 곱셈식·나눗셈식 또는 덧셈식·뺄셈식으로 나타내요. 식을 이용하면 표에 없는 큰 수일 때도 쉽게 구할 수 있어요.",
  steps: [
    { name: "1번", inst: "선풍기의 수와 선풍기 날개의 수 사이의 대응 관계를 찾아보세요. 선풍기를 늘려 가며 날개를 세어 봐요.", hints: ["선풍기 1대에 날개가 몇 개인지 세어 봐요.", "1대 → 5개, 2대 → 10개, 3대 → 15개"],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "fan", n0: 1, max: 4, need: 3, count: true, countName: "날개", label: n => `선풍기 ${n}대`, h: 200 },
        say: [["선풍기 날개의 수는 선풍기의 수의 ", { a: 5 }, "배예요."]],
        ok: "선풍기 1대에 날개가 5개이므로 날개의 수는 선풍기의 수의 5배예요." }) },
    { name: "2~4번", inst: "상자 1개에 달걀이 10개씩 들어 있어요. 표를 완성하고, 상자의 수를 □, 달걀의 수를 ☆라고 할 때 식으로 나타낸 뒤 물음에 답해 보세요.", hints: ["달걀의 수는 상자의 수의 10배예요.", "☆=□×10에서 □에 9를 넣어요."],
      render: (b, a) => cr3Do(b, a, { fig: cr3Pic("egg", 2, "상자 1개에 달걀 10개"),
        table: { heads: ["상자의 수(개)", "달걀의 수(개)"], x: [1, 2, 3, 4], y: [10, 20, 30, 40], bx: [2], by: [1, 3], f: n => 10 * n },
        eq: { vars: [{ s: "□", name: "상자의 수", v: [1, 2, 3, 4] }, { s: "☆", name: "달걀의 수", v: [10, 20, 30, 40] }], need: 1, ans: ["☆=□×10", "□=☆÷10"] },
        ask: [{ q: "상자 9개에 들어 있는 달걀은 모두 몇 개?", a: 90, unit: "개", why: { "19": "9+10이 아니라 10개씩 9상자예요." } }],
        ok: "☆=□×10 또는 □=☆÷10이고, 상자 9개에는 달걀이 90개 들어 있어요." }) },
    { name: "5~7번", inst: "예준이가 육각형과 삼각형으로 규칙적인 배열을 만들고 있어요. 육각형을 늘려 가며 삼각형을 세고, 표를 완성한 뒤 식으로 나타내 보세요.", hints: ["삼각형은 육각형 사이와 양 끝에 있어서 육각형보다 1개 더 많아요.", "△=□+1에서 △가 28이면 □는 28−1이에요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "hextri", n0: 1, max: 5, need: 4, count: true, countName: "삼각형", label: n => `육각형 ${n}개` },
        table: { heads: ["육각형의 수(개)", "삼각형의 수(개)"], x: [1, 2, 3, 4, 5], y: [2, 3, 4, 5, 6], bx: [2], by: [1, 3, 4], f: n => n + 1 },
        eq: { title: "육각형의 수를 □, 삼각형의 수를 △라고 할 때", vars: [{ s: "□", name: "육각형의 수", v: [1, 2, 3, 4, 5] }, { s: "△", name: "삼각형의 수", v: [2, 3, 4, 5, 6] }], need: 1, ans: ["△=□+1", "□=△−1"] },
        ask: [{ q: "삼각형이 28개일 때 육각형은 몇 개?", a: 27, unit: "개", why: { "29": "28에 1을 더하면 삼각형의 수가 아니에요. 육각형이 삼각형보다 1개 더 적어요." } }],
        ok: "△=□+1 또는 □=△−1이에요. 삼각형이 28개이면 육각형은 28−1=27(개)예요." }) },
    { name: "8번", inst: "대응 관계를 나타낸 식 ○=△×4에 알맞은 상황을 생활 속에서 찾아보세요.", hints: ["○는 △의 4배예요. △가 1일 때 ○가 4인 상황을 찾아요.", "□와 △처럼 기호가 나타내는 양을 바꾸어 쓰지 않았는지 살펴봐요."],
      render: (b, a) => cr3Do(b, a, { choose: [{ q: "○=△×4에 알맞은 상황을 모두 고르세요.", o: ["고양이의 수(△)와 고양이 다리의 수(○)", "네발자전거의 수(△)와 바퀴의 수(○)", "사각형의 수(△)와 사각형 꼭짓점의 수(○)", "고양이 다리의 수(△)와 고양이의 수(○)", "세발자전거의 수(△)와 바퀴의 수(○)"], a: [0, 1, 2] }],
        ok: "고양이 다리, 네발자전거 바퀴, 사각형 꼭짓점은 모두 하나에 4개씩이에요. 기호가 나타내는 양을 바꾸어 쓰면 다른 식이 돼요." }) },
    { name: "확인하고 정리해요", inst: "기린과, 기둥 사이에 줄을 맨 그림을 떠올리며 빈칸을 채워 정리해 보세요.", hints: ["기린 1마리에 다리가 4개예요.", "기둥 사이에 줄이 있어서 줄은 기둥보다 1개 더 적어요."],
      render: (b, a) => cr3Do(b, a, { say: [
        ["기린 다리의 수는 기린의 수의 ", { a: 4 }, "배예요. → (기린 다리의 수)=(기린의 수)×", { a: 4 }],
        ["기린의 수는 기린 다리의 수를 4로 나눈 것과 같아요. → (기린의 수)=(기린 다리의 수)÷4"],
        ["기둥의 수는 줄의 수에 1을 더한 것과 같아요. → (기둥의 수)=(줄의 수)+1"],
        ["줄의 수는 기둥의 수에서 ", { a: 1 }, "을 뺀 것과 같아요. → (줄의 수)=(기둥의 수)−", { a: 1 }]],
        ok: "곱의 관계는 곱셈식·나눗셈식으로, 합(차)의 관계는 덧셈식·뺄셈식으로 나타내요." }) }
  ],
  challenge: { inst: "이 단원에서 만난 두 양과 대응 관계를 나타낸 식을 이어 보세요. 왼쪽 두 양에서 앞의 양이 □, 뒤의 양이 △예요.", hints: ["풍력 발전기 1대에 날개 3개, 솜사탕 1개에 페달 4분이에요.", "그늘막은 기둥보다 1개 더 적고, 충전기는 의자보다 1개 더 적어요."],
    render: (b, a) => cr3Do(b, a, { link: { lt: "두 양 (□, △)", rt: "식", left: ["풍력 발전기의 수와 날개의 수", "그늘막의 수와 기둥의 수", "의자의 수와 태양열 충전기의 수", "솜사탕의 수와 페달을 밟는 시간(분)"], right: ["△=□+1", "△=□×4", "△=□×3", "△=□−1"], pairs: [2, 0, 3, 1] },
      ok: "대응 관계를 기호를 사용한 식으로 나타내면 두 양 사이의 관계를 간단하고 분명하게 알 수 있어요." }) }
}
];
