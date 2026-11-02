//@@APP
const APP={title:"우리 반 환경 동아리 탐사대", unit:"5-1 수학 3. 대응 관계", key:"s51-corresp-v1", welcome:"우리 반 환경 동아리 탐사대에 온 것을 환영해요", intro:"햇살초등학교 5학년 2반 환경 동아리 ‘초록 탐사대’가 재활용과 에너지 절약 캠페인을 펼쳐요. 페트병 묶음과 병의 수, 모은 날수와 캔의 수, 모둠의 수와 인원처럼 짝을 이루어 함께 변하는 두 양을 표로 정리하고, 규칙을 찾아 □, △, ○, ☆ 같은 기호를 사용한 식으로 나타내요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u3-corresp.tb.js)의 cr3 부품을 복사해 쓰고, 확인은 autoRun으로 저절로 해요(‘확인하기’ 단추 없음).
   이 파일에서 새로 만든 것은 앞글자 cr3s(학교 그림 cr3sSchoolFig, 내 대응 관계 카드 만들기 cr3sMake), 그림 종류 pack·canday·team·lamp·can15·milk·fence·bins를 더했어요. */
/* ===== 5-1 수학 3. 대응 관계 — 단원 조작 부품 (앞글자 cr3) =====
   cr3Do     한 계단 묶음: 그림(＋/− 로 늘리고 줄이며, 세는 것을 눌러 세기) · 표 빈칸 · 말 빈칸 · 고르기 · 짝 잇기 · 기호 식 · 수 쓰기를 모두 채우면 저절로 채점
   cr3Cards  보기 카드를 눌러 낱말 식 만들기(곱셈식·나눗셈식 둘 다)
   cr3Find   학교 그림에서 서로 대응하는 두 양 찾기
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
  const t = String(w).trim().replace(/\s*\([^()]*\)$/, ""); const last = t.slice(-1);   /* ‘양(L)’처럼 괄호가 붙으면 괄호 앞 말로 */
  if (CR3SNAME[last]) { const n = CR3SNAME[last], c = n.charCodeAt(n.length - 1); return (c - 0xAC00) % 28 !== 0; }
  const s = t.replace(/[^가-힣A-Za-z0-9]+$/, "");
  const c = s.charCodeAt(s.length - 1);
  if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 !== 0;
  if (/[0-9]$/.test(s)) { if (/0$/.test(s)) return true; return /[013678]$/.test(s); }
  return false;
}
function cr3J(w, pair) {
  const [a, b] = pair.split("/");
  if (pair === "으로/로") { const t = String(w).trim().replace(/\s*\([^()]*\)$/, ""), s = t.replace(/[^가-힣A-Za-z0-9]+$/, ""), c = s.charCodeAt(s.length - 1);
    if (c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 === 8) return w + "로";
    if (/[0-9]$/.test(s) && /[178]$/.test(s)) return w + "로";
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
  pack: { w: 150, h: 190, d(g, add) {
    [-54, -18, 18, 54].forEach(x => {
      const el = svgEl("rect", { x: x - 15, y: 70, width: 30, height: 104, rx: 9, fill: "#DFF3FA", stroke: "#4A8FB8", "stroke-width": 2.5 });
      g.append(svgEl("rect", { x: x - 7, y: 52, width: 14, height: 20, rx: 3, fill: "#DFF3FA", stroke: "#4A8FB8", "stroke-width": 2 }), el,
        svgEl("rect", { x: x - 9, y: 42, width: 18, height: 12, rx: 3, fill: CR3C.blue }));
      add(el, x, 142); });
    g.append(svgEl("rect", { x: -72, y: 98, width: 144, height: 14, rx: 4, fill: "#F6C85F", stroke: "#B58A12", "stroke-width": 2, opacity: .9 }));
  } },
  canday: { w: 150, h: 196, d(g, add) {
    g.append(svgEl("rect", { x: -66, y: 46, width: 132, height: 124, rx: 10, fill: "#F4F8F6", stroke: "#8C9B98", "stroke-width": 2.5 }));
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { const x = -40 + 40 * c, y = 58 + 56 * r;
      const el = svgEl("rect", { x: x - 14, y, width: 28, height: 46, rx: 5, fill: r ? "#E5533D" : "#C9D6D1", stroke: "#5E6D6A", "stroke-width": 2 });
      g.append(el, svgEl("ellipse", { cx: x, cy: y + 3, rx: 12, ry: 3.5, fill: "#fff", stroke: "#5E6D6A", "stroke-width": 1.2 })); add(el, x, y + 26); }
  } },
  team: { w: 160, h: 180, d(g, add) {
    g.append(svgEl("rect", { x: -74, y: 32, width: 148, height: 146, rx: 18, fill: "#F7F3EA", stroke: "#C9B79A", "stroke-width": 2, "stroke-dasharray": "6 4" }));
    g.append(svgEl("ellipse", { cx: 0, cy: 106, rx: 34, ry: 20, fill: "#E8C9A0", stroke: "#8C6F4E", "stroke-width": 3 }));
    const seats = [[-50, 78], [0, 54], [50, 78], [-32, 144], [32, 144]];
    const cols = ["#F29BB8", "#7CC48A", "#8EC1F0", "#F6C85F", "#C5A5E8"];
    seats.forEach(([x, y], k) => { g.append(svgEl("path", { d: `M${x - 15},${y + 26} Q${x},${y + 4} ${x + 15},${y + 26} Z`, fill: cols[k], stroke: "#5E6D6A", "stroke-width": 1.5 }));
      const el = svgEl("circle", { cx: x, cy: y, r: 12, fill: "#FFE3C4", stroke: "#8C6F4E", "stroke-width": 2 }); g.append(el); add(el, x, y); });
  } },
  lamp: { w: 140, h: 120, d(g, add) {
    g.append(svgEl("rect", { x: -64, y: 28, width: 128, height: 62, rx: 6, fill: "#EEF1EF", stroke: "#8C9B98", "stroke-width": 2.5 }));
    [40, 56, 72].forEach(y => { const el = svgEl("rect", { x: -54, y: y - 4, width: 108, height: 9, rx: 4.5, fill: "#FFF6C8", stroke: "#C99A1A", "stroke-width": 1.8 }); g.append(el); add(el, 0, y); });
  } },
  can15: { w: 110, h: 160, d(g) {
    g.append(svgEl("rect", { x: -26, y: 30, width: 52, height: 84, rx: 8, fill: "#C9D6D1", stroke: "#5E6D6A", "stroke-width": 3 }));
    g.append(svgEl("ellipse", { cx: 0, cy: 34, rx: 22, ry: 6, fill: "#fff", stroke: "#5E6D6A", "stroke-width": 2 }));
    g.append(svgEl("rect", { x: -26, y: 60, width: 52, height: 22, fill: "#3E9B6A" }));
    g.append(txt(0, 140, "15 g", 22, { fill: CR3C.blue }));
  } },
  milk: { w: 170, h: 170, d(g, add) {
    g.append(svgEl("rect", { x: -80, y: 40, width: 160, height: 116, rx: 8, fill: "#9ED39A", stroke: "#3E8A46", "stroke-width": 3 }));
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const x = -60 + 30 * c, y = 54 + 38 * r;
      const el = svgEl("polygon", { points: cr3P([[x - 11, y + 22], [x + 11, y + 22], [x + 11, y + 4], [x, y - 6], [x - 11, y + 4]]), fill: "#fff", stroke: "#4A8FB8", "stroke-width": 2 }); g.append(el); add(el, x, y + 10); }
    g.append(txt(0, 142, "우유 10팩", 16, { fill: "#fff" }));
  } },
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
  fence: { wa: 120, wb: 0, ends: true, h: 190,
    A(g, x, w) { [84, 128].forEach(y => g.append(svgEl("rect", { x, y, width: w, height: 12, fill: "#E8C9A0", stroke: "#8C6F4E", "stroke-width": 2 })));
      for (let k = 1; k < 4; k++) g.append(svgEl("rect", { x: x + w * k / 4 - 6, y: 70, width: 12, height: 92, rx: 2, fill: "#F3DEC0", stroke: "#8C6F4E", "stroke-width": 1.5 })); },
    B(g, x, add) { const el = svgEl("polygon", { points: cr3P([[x - 8, 176], [x - 8, 62], [x, 48], [x + 8, 62], [x + 8, 176]]), fill: "#8C6F4E", stroke: "#5B4630", "stroke-width": 2, "stroke-linejoin": "round" }); g.append(el); add(el, x, 150); } },
  bins: { wa: 100, wb: 20, ends: false, h: 180,
    A(g, x, w) { const k = Math.round(x / 120) % 4, col = ["#2B7BD6", "#E47A38", "#3E9B6A", "#C2506E"][k], nm = ["종이", "캔", "유리병", "플라스틱"][k];
      g.append(svgEl("rect", { x: x + 6, y: 60, width: w - 12, height: 104, rx: 6, fill: "#fff", stroke: col, "stroke-width": 3 }), svgEl("rect", { x: x + 2, y: 48, width: w - 4, height: 16, rx: 4, fill: col }));
      g.append(txt(x + w / 2, 110, nm, nm.length > 3 ? 15 : 18, { fill: col })); },
    B(g, x, add, w) { const el = svgEl("rect", { x: x + 4, y: 34, width: w - 8, height: 138, rx: 3, fill: "#B9C4C1", stroke: "#5E6D6A", "stroke-width": 2 }); g.append(el); add(el, x + w / 2, 104); } },
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
  const left = 0;
  const H = cfg.h || K.h || 180;
  const st = { n: cfg.n0 || 1, max: cfg.n0 || 1, marks: 0 };
  const svg = makeSvg(W, H);
  const lab = h("b", {}), cnt = h("span", { class: "cr3muted" });
  function draw() {
    svg.innerHTML = ""; st.marks = 0;
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
        if (cfg.numbered) g.append(txt(0, K.h - 8, typeof cfg.numbered === "function" ? cfg.numbered(i + 1) : `${i + 1}번째`, 14, { fill: CR3C.gray }));
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
  return { el, st, filled: () => !cfg.need || st.max >= cfg.need, key: () => String(!cfg.need || st.max >= cfg.need),
    check() { if (cfg.need && st.max < cfg.need) return `그림 아래 ‘＋ 하나 더’를 눌러 ${cfg.label(cfg.need)}까지 늘려 보며 세어 봐요.`; return null; } };
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
  return { el, answers: ins.length ? [`표 빈칸: ${ins.map(x => cr3Fmt(x.a)).join(", ")}`] : [], inputs: ins.map(x => x.inp),
    filled: () => ins.every(x => x.inp.value.trim() !== ""), key: () => ins.map(x => x.inp.value.trim()).join(","),
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
  return { el, answers: [full], words: lines.flat().filter(s => typeof s !== "string" && s.o).map(s => s.o[s.a]), inputs: items.filter(it => it.type === "n").map(it => it.inp),
    filled: () => items.every(it => it.type === "n" ? it.inp.value.trim() !== "" : it.sel != null), key: () => items.map(it => it.type === "n" ? it.inp.value.trim() : it.sel).join("/"),
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
  return { el, words: list.flatMap(it => (Array.isArray(it.a) ? it.a : [it.a]).map(k => it.o[k])), choice: true,
    filled: () => list.every((it, i) => Array.isArray(it.a) ? (Array.isArray(st[i]) && st[i].length >= it.a.length) : st[i] != null),
    key: () => st.map(v => Array.isArray(v) ? v.slice().sort().join(".") : v).join("/"),
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
  return { el, answers: cfg.left.map((t, i) => `${t} ↔ ${cfg.right[cfg.pairs[i]]}`), slow: true,
    filled: () => pair.every(p => p != null), key: () => pair.join(","),
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
  ins.forEach(inp => inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } }));
  return { el, answers: cfg.ans ? [cfg.ans.slice(0, cfg.need || 1).join("  또는  ")] : [], inputs: ins,
    filled: () => ins.every(x => x.value.trim() !== "") && (!cfg.pick || chosen.every(Boolean)), key: () => chosen.join("") + "#" + ins.map(x => cr3Norm(x.value)).join("|"),
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
  return { el, answers: list.map(it => `${it.q} ${cr3Fmt(it.a)}${it.unit ? " " + it.unit : ""}`), inputs: ins,
    filled: () => ins.every(x => x.value.trim() !== ""), key: () => ins.map(x => x.value.trim()).join(","),
    check() {
      let msg = null;
      list.forEach((it, i) => { const v = cr3Num(ins[i].value), g = Math.abs(v - it.a) < 1e-9; cr3Mark(ins[i], g); if (!g && !msg) msg = ins[i].value.trim() === "" ? "빈칸에 수를 써요." : ((it.why && it.why[String(v)]) || "빨간 칸을 다시 계산해 봐요."); });
      return msg;
    }, given: () => ins.map(x => x.value.trim()).join(",") };
}

/* ---------- 한 계단 묶음 ---------- */
/* opt = {fig, scene, table, say, choose, link, eq, ask, after, ok, words} — 차례대로 그리고, 확인하기 한 번으로 모두 채점 */
function cr3Do(body, api, opt) {
  const parts = [], wrap = h("div", { class: "cr3wrap" });
  const add = (p, title) => { if (title) wrap.append(h("div", { class: "cr3q" }, title)); wrap.append(p.el); parts.push(p); };
  if (opt.promise) wrap.append(h("div", { class: "cr3promise" }, opt.promise));
  if (opt.fig) wrap.append(opt.fig());
  let sc = null;
  if (opt.scene) { sc = cr3Scene(opt.scene); wrap.append(sc.el); parts.push({ check: sc.check, filled: sc.filled, key: sc.key, answers: [], given: () => `그림 ${sc.st.max}까지`, scene: true }); }
  if (opt.link) add(cr3Link(opt.link), opt.linkT);
  if (opt.table) add(cr3Table(opt.table), opt.tableT);
  if (opt.say) add(cr3Say(opt.say), opt.sayT);
  if (opt.choose) add(cr3Choose(opt.choose), opt.chooseT);
  if (opt.eq) [].concat(opt.eq).forEach(e => add(cr3Eq(e), e.title));
  if (opt.ask) add(cr3Ask(opt.ask), opt.askT);
  body.append(wrap);
  api.provide({ words: opt.words || parts.flatMap(p => p.words || []), answers: parts.flatMap(p => p.answers || []) });
  const hasIn = parts.some(p => p.inputs && p.inputs.length), slow = parts.some(p => p.slow || p.scene);
  let told = false;
  const ready = () => {
    const rest = parts.filter(p => !p.scene).every(p => p.filled());
    const scOk = !sc || sc.filled();
    if (rest && !scOk && !told) { told = true; api.hint(sc.check()); }
    return rest && scOk;
  };
  const sign = () => parts.map(p => p.key()).join("¦");
  const run = () => {
    api.tryOnce();
    let msg = null; parts.forEach(p => { const m = p.check(); if (m && !msg) msg = m; });
    const given = parts.map(p => p.given ? p.given() : "").filter(Boolean).join(" | ");
    if (msg) { api.fail(msg, given); return false; }
    api.done(given, opt.ok); return true;
  };
  const auto = autoRun(ready, sign, run, hasIn ? 900 : slow ? 1200 : 260);
  wrap.addEventListener("input", auto); wrap.addEventListener("change", auto); wrap.addEventListener("click", auto);
  parts.forEach(p => (p.inputs || []).forEach(inp => { if (!inp._cr3k) { inp._cr3k = 1; inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } }); } }));
}

/* ---------- 보기 카드로 낱말 식 만들기 ---------- */
/* opt = {cards:[…], vars:{"돌린 시간":[…], …}, need:2, ans:[["…","=",…], …], table, ok} */
function cr3Cards(body, api, opt) {
  const wrap = h("div", { class: "cr3wrap" });
  if (opt.fig) wrap.append(opt.fig());
  if (opt.table) wrap.append(cr3Table(opt.table).el);
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
  const deck = h("div", { class: "cr3cards" }, opt.cards.map(c => h("button", { type: "button", onclick: () => { lines[cur].push(c); lineEls[cur].classList.remove("cr3good", "cr3bad"); paint(); auto(); } }, c)));
  wrap.append(h("div", { class: "cr3q" }, "보기 카드"), deck, ...lineEls,
    h("div", { class: "cr3opts" }, h("button", { type: "button", onclick: () => { lines[cur].pop(); paint(); auto(); } }, "⌫ 마지막 카드 빼기"), h("button", { type: "button", onclick: () => { lines[cur] = []; paint(); } }, "이 줄 비우기")),
    h("p", { class: "cr3muted" }, (opt.need || 1) > 1 ? "식 1을 다 만들면 ‘식 2’ 줄을 눌러 이어서 만들어요. 두 식을 다 만들면 저절로 확인해요." : "식을 다 만들면 저절로 확인해요."));
  body.append(wrap);
  paint();
  api.provide({ words: opt.cards.filter(c => /[가-힣]/.test(c)), answers: opt.ans.slice(0, opt.need || 1).map(a => a.join(" ")) });
  const isOpd = t => !(t in CR3OP) && t !== "=";
  const whole = l => l.length >= 5 && l.length % 2 === 1 && l.filter(t => t === "=").length === 1 && isOpd(l[l.length - 1]) && isOpd(l[0]);
  const run = () => {
    api.tryOnce(); const ops = [];
    const given = lines.map(l => l.join(" ")).join(" / ");
    for (let k = 0; k < lines.length; k++) {
      const r = cr3Judge(lines[k], vars); cr3Mark(lineEls[k], r.ok);
      if (!r.ok) { api.fail((lines.length > 1 ? `식 ${k + 1}: ` : "") + r.msg, given); return false; }
      ops.push(r.op);
    }
    if (new Set(ops).size < ops.length) { lineEls.forEach(e => cr3Mark(e, false)); api.fail("두 식이 같은 연산이에요. 기준을 바꾸어 다른 연산 기호로도 나타내 봐요.", given); return false; }
    api.done(given, opt.ok); return true;
  };
  const auto = autoRun(() => lines.every(whole), () => lines.map(l => l.join(" ")).join("/"), run, 1200);
}

/* ---------- 학교 그림에서 대응하는 두 양 찾기 (이야기 버전) ---------- */
function cr3sSchoolFig(onTap) {
  const W = 640, H = 320, svg = makeSvg(W, H);
  svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "#F5F1E8" }), svgEl("rect", { x: 0, y: 250, width: W, height: 70, fill: "#E2D6BE" }));
  const spot = (id, g, cx, cy, label) => { g.style.cursor = "pointer"; g.addEventListener("click", () => onTap && onTap(id, g)); svg.append(g); if (label) svg.append(txt(cx, cy, label, 14, { fill: CR3C.gray, "pointer-events": "none" })); };
  // 교실 전등(1줄에 형광등 3개) 2줄
  const gl = svgEl("g"); [[40, 18], [160, 18]].forEach(([x, y]) => { const t = svgEl("g", { transform: `translate(${x + 50} ${y - 22}) scale(.8)` }); CR3EACH.lamp.d(t, () => {}); gl.append(t); });
  gl.append(svgEl("rect", { x: 30, y: 8, width: 240, height: 70, fill: "transparent" })); spot("lamp", gl, 150, 92, "교실 전등");
  // 창문(1개에 유리 2장) 2개
  const gw = svgEl("g"); [300, 390].forEach(x => { gw.append(svgEl("rect", { x, y: 24, width: 80, height: 92, fill: "#DCEAFB", stroke: "#8C6F4E", "stroke-width": 4 }), svgEl("line", { x1: x + 40, y1: 24, x2: x + 40, y2: 116, stroke: "#8C6F4E", "stroke-width": 4 })); });
  gw.append(svgEl("rect", { x: 296, y: 20, width: 178, height: 100, fill: "transparent" })); spot("window", gw, 385, 136, "창문");
  // 우유 상자
  const gm = svgEl("g", { transform: "translate(545 30) scale(.62)" }); CR3EACH.milk.d(gm, () => {}); gm.append(svgEl("rect", { x: -80, y: 20, width: 160, height: 150, fill: "transparent" })); spot("milk", gm, 545, 146, "급식 우유 상자");
  // 수돗가
  const gt = svgEl("g"); gt.append(svgEl("rect", { x: 40, y: 190, width: 150, height: 60, rx: 6, fill: "#C9D6D1", stroke: "#5E6D6A", "stroke-width": 3 }),
    svgEl("path", { d: "M100,160 L100,176 L118,176 L118,184", fill: "none", stroke: "#5E6D6A", "stroke-width": 6, "stroke-linecap": "round" }), svgEl("circle", { cx: 100, cy: 156, r: 7, fill: "#D3473A" }));
  for (let k = 0; k < 3; k++) gt.append(svgEl("ellipse", { cx: 118, cy: 196 + 14 * k, rx: 3.5, ry: 6, fill: "#5FA8E8" }));
  gt.append(svgEl("rect", { x: 34, y: 140, width: 162, height: 116, fill: "transparent" })); spot("tap", gt, 115, 276, "수돗가");
  // 분리수거함과 칸막이
  const gb = svgEl("g", { transform: "translate(250 150) scale(.62)" }); cr3DrawRowInto(gb, "bins", 4); gb.append(svgEl("rect", { x: 0, y: 20, width: 470, height: 160, fill: "transparent" })); spot("bins", gb, 400, 276, "분리수거함과 칸막이");
  return svg;
}
function cr3DrawRowInto(g, kind, n) { const K = CR3ROW[kind]; let x = 0; const bAt = []; if (K.ends) { bAt.push(x); x += K.wb; } for (let i = 0; i < n; i++) { K.A(g, x, K.wa); x += K.wa; if (K.ends || i < n - 1) { bAt.push(x); x += K.wb; } } bAt.forEach(bx => K.B(g, bx, () => {}, K.wb)); }
/* opt = {spots:{id:"찾은 두 양 글"}, need, choose, ok} */
function cr3Find(body, api, opt) {
  const found = new Set(), list = h("div", { class: "cr3found" }), info = h("p", { class: "cr3muted" }), wrap = h("div", { class: "cr3wrap" });
  const svg = cr3sSchoolFig((id, g) => {
    if (!opt.spots[id] || found.has(id)) return;
    found.add(id); g.setAttribute("opacity", ".55");
    list.append(h("div", {}, `${found.size}. ${opt.spots[id]}`));
    info.textContent = `찾은 짝: ${found.size}가지 / ${opt.need}가지`;
    auto();
  });
  info.textContent = `찾은 짝: 0가지 / ${opt.need}가지 — 그림 속 시설을 눌러요.`;
  wrap.append(h("div", { class: "cr3fig" }, svg), info, list);
  const C = opt.choose ? cr3Choose(opt.choose) : null; if (C) wrap.append(C.el);
  body.append(wrap);
  api.provide({ words: Object.values(opt.spots), answers: Object.values(opt.spots).concat(C ? C.answers : []) });
  const run = () => {
    api.tryOnce();
    const m = C ? C.check() : null; if (m) { api.fail(m, C.given()); return false; }
    api.done([...found].map(id => opt.spots[id]).join(" / "), opt.ok); return true;
  };
  const auto = autoRun(() => found.size >= opt.need && (!C || C.filled()), () => found.size + "#" + (C ? C.key() : ""), run, 600);
  if (C) C.el.addEventListener("click", auto);
}

/* ---------- 놀이: 자신만만 대응 관계 (이야기 버전 카드: 우리 동아리 캠페인에서 만난 두 양) ---------- */
const CR3DECK = [
  { kind: "pack", n: 2, t: "페트병 묶음의 수(□)와 페트병의 수(△)", vars: [{ s: "□", name: "페트병 묶음의 수", f: n => n }, { s: "△", name: "페트병의 수", f: n => 4 * n }], note: "한 묶음에 페트병이 4개예요.", ans: ["△=□×4", "□=△÷4"] },
  { kind: "canday", n: 2, t: "캔을 모은 날수(○)와 모은 캔의 수(☆)", vars: [{ s: "○", name: "캔을 모은 날수", f: n => n }, { s: "☆", name: "모은 캔의 수", f: n => 6 * n }], note: "하루에 캔을 6개씩 모아요.", numbered: n => `${n}일째`, ans: ["☆=○×6", "○=☆÷6"] },
  { kind: "fence", n: 3, t: "울타리 판의 수(△)와 말뚝의 수(♡)", vars: [{ s: "△", name: "울타리 판의 수", f: n => n }, { s: "♡", name: "말뚝의 수", f: n => n + 1 }], note: "울타리 판을 한 줄로 잇고, 판 사이와 양 끝에 말뚝을 박아요.", ans: ["♡=△+1", "△=♡−1"] },
  { kind: "team", n: 2, t: "모둠의 수(◇)와 모둠 친구의 수(○)", vars: [{ s: "◇", name: "모둠의 수", f: n => n }, { s: "○", name: "모둠 친구의 수", f: n => 5 * n }], note: "한 모둠은 5명이에요.", ans: ["○=◇×5", "◇=○÷5"] },
  { kind: "bins", n: 3, t: "분리수거함의 수(□)와 칸막이의 수(☆)", vars: [{ s: "□", name: "분리수거함의 수", f: n => n }, { s: "☆", name: "칸막이의 수", f: n => n - 1 }], note: "분리수거함을 한 줄로 놓고, 수거함과 수거함 사이에만 칸막이를 세워요.", ans: ["☆=□−1", "□=☆+1"] },
  { kind: "age", n: 0, t: "윤서의 나이(□)와 언니의 나이(○)", vars: [{ s: "□", name: "윤서의 나이", f: n => n + 10 }, { s: "○", name: "언니의 나이", f: n => n + 14 }], note: "윤서가 11살일 때 언니는 15살이에요. 해마다 두 사람 모두 1살씩 많아져요.", ans: ["○=□+4", "□=○−4"] }
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
    const s = makeSvg(300, 200); s.append(svgEl("rect", { x: 10, y: 10, width: 280, height: 180, rx: 18, fill: "#DFF1E4", stroke: "#8CC9A0", "stroke-width": 4 }));
    for (let k = 0; k < 5; k++) s.append(txt(50 + 50 * k, 100, ["□", "△", "☆", "○", "◇"][k], 30, { fill: "#4F9A6A" }));
    cardBox.append(s, h("div", { class: "cr3cardt" }, `쌓아 둔 카드 ${deck.length - i - 1}장`));
  }
  function render() {
    side.innerHTML = ""; sc(); side.append(scoreEl);
    if (phase === "flip") {
      showBack();
      side.append(h("p", {}, "내 차례예요. 쌓아 둔 카드 한 장을 뒤집어요."), h("button", { class: "big", type: "button", onclick: () => { i++; phase = "eq"; firstTry = true; render(); } }, "카드 뒤집기"));
      return;
    }
    const c = deck[i];
    cardBox.innerHTML = "";
    if (c.kind === "age") { const s = makeSvg(300, 200); s.append(txt(150, 46, "윤서 11살", 26, { fill: CR3C.blue }), txt(150, 92, "언니 15살", 26, { fill: CR3C.orange }), txt(150, 150, "해마다 두 사람 모두", 18, { fill: CR3C.gray }), txt(150, 176, "1살씩 많아져요", 18, { fill: CR3C.gray })); cardBox.append(s); }
    else cardBox.append(cr3Scene({ kind: c.kind, n0: c.n, max: c.n, static: true, h: 180, numbered: c.numbered }).el);
    cardBox.append(h("div", { class: "cr3cardt" }, c.t), h("p", { class: "cr3muted", style: "text-align:center" }, c.note));
    if (phase === "eq") {
      const ns = [1, 2, 3, 4, 5, 6];
      const E = cr3Eq({ vars: c.vars.map(v => ({ s: v.s, name: v.name, v: ns.map(v.f) })), ans: c.ans, q: "카드에 정해진 기호로 두 양 사이의 대응 관계를 식으로 나타내요. 다 쓰면 저절로 확인해요." });
      const fb = h("p", { class: "cr3muted" });
      const run = () => {
        api.tryOnce(); const m = E.check();
        if (m) { firstTry = false; fb.textContent = "× " + m + " 다시 써 봐요."; return false; }
        if (firstTry) { score += 1; log.prepend(h("div", {}, `${i + 1}번 카드: 식이 맞아서 1점 (${E.given()})`)); phase = "die"; }
        else { log.prepend(h("div", {}, `${i + 1}번 카드: 다시 써서 맞혔어요. 이번 카드는 점수 없이 넘어가요 (${E.given()})`)); phase = i >= deck.length - 1 ? "end" : "flip"; }
        render(); return true;
      };
      const auto = autoRun(E.filled, E.key, run, 900);
      E.el.addEventListener("input", auto); E.el.addEventListener("click", auto);
      side.append(E.el, fb);
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
            res.textContent = `${v}${cr3Jong(String(v)) ? "은" : "는"} ${v % 2 ? "홀수" : "짝수"}라서 ${plus}점을 더 얻었어요. 이 카드에서 1+${plus}=${1 + plus}(점)!`;
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

/* ---------- 내 대응 관계 카드 만들기 (이야기 버전 새 부품) ----------
   두 양의 이름 → 관계(+ − × ÷와 수) → 표의 아랫줄 채우기(첫째 양의 수는 관계에 맞게 저절로 정해짐) → 기호를 골라 식 두 가지.
   표와 식은 고른 관계로 계산해 채점해요. */
function cr3sMake(body, api, opt) {
  const wrap = h("div", { class: "cr3wrap" });
  const nA = h("input", { type: "text", autocomplete: "off", placeholder: "예) 화분의 수", "aria-label": "첫째 양의 이름", style: "width:12em;max-width:100%" });
  const nB = h("input", { type: "text", autocomplete: "off", placeholder: "예) 상추 모종의 수", "aria-label": "둘째 양의 이름", style: "width:12em;max-width:100%" });
  const kIn = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", "aria-label": "관계의 수", style: "width:4em;text-align:center" });
  let op = null;
  const opRow = h("span", { class: "cr3slot" });
  ["×", "÷", "+", "−"].forEach(o => opRow.append(h("button", { type: "button", onclick: e => { [...opRow.children].forEach(b => b.classList.remove("cr3on")); e.currentTarget.classList.add("cr3on"); op = o; rebuild(); } }, o)));
  const tblBox = h("div"), eqBox = h("div"), say = h("p", { class: "cr3muted" });
  const vars = [{ name: "첫째 양", v: [1, 2, 3, 4] }, { name: "둘째 양", v: [1, 2, 3, 4] }];
  let T = null, E = null, made = "";
  const kv = () => { const k = cr3Num(kIn.value); return Number.isInteger(k) && k >= 1 && k <= 100 ? k : null; };
  const xs = (o, k) => o === "÷" ? [k, 2 * k, 3 * k, 4 * k] : o === "−" ? [k + 1, k + 2, k + 3, k + 4] : [1, 2, 3, 4];
  function rebuild() {
    const k = kv(), sig = `${op}${k}`;
    if (!op || !k) { tblBox.innerHTML = ""; eqBox.innerHTML = ""; T = E = null; made = ""; say.textContent = "관계의 기호와 수를 정하면 표가 나타나요."; return; }
    if (sig === made) return; made = sig;
    const x = xs(op, k), y = x.map(v => CR3OP[op](v, k));
    vars[0].v = x; vars[1].v = y;
    T = cr3Table({ heads: ["첫째 양", "둘째 양"], x, y, by: [0, 1, 2, 3], why: "내가 정한 관계대로 첫째 양의 수를 계산해 봐요." });
    tblBox.innerHTML = ""; tblBox.append(h("div", { class: "cr3q" }, "② 표의 아랫줄을 채워요"), T.el);
    E = cr3Eq({ pick: true, vars, need: 2, palette: ["□", "△", "☆", "○", "◇", "♡"], q: "③ 두 양을 나타낼 기호를 고르고, 대응 관계를 식 두 가지로 나타내요" });
    eqBox.innerHTML = ""; eqBox.append(E.el);
    say.textContent = `둘째 양은 첫째 양${{ "×": `의 ${k}배`, "÷": `을 ${cr3J(String(k), "으로/로")} 나눈 것`, "+": `에 ${cr3J(String(k), "을/를")} 더한 것`, "−": `에서 ${cr3J(String(k), "을/를")} 뺀 것` }[op]}이에요. 첫째 양이 ${x.join(", ")}일 때 둘째 양을 구해 표를 채워요.`;
  }
  kIn.addEventListener("input", rebuild);
  wrap.append(h("div", { class: "cr3box" }, h("div", { class: "cr3boxt" }, "① 짝을 이루어 함께 변하는 두 양과 관계를 정해요"),
    h("div", { class: "cr3eqrow" }, h("span", { class: "jua" }, "첫째 양"), nA), h("div", { class: "cr3eqrow" }, h("span", { class: "jua" }, "둘째 양"), nB),
    h("div", { class: "cr3eqrow" }, h("span", {}, "둘째 양 = 첫째 양"), opRow, kIn), say), tblBox, eqBox);
  body.append(wrap); rebuild();
  api.provide({ words: ["첫째 양", "둘째 양"], answers: [opt.sample || "예) 화분의 수와 상추 모종의 수, 둘째 양 = 첫째 양 × 3, 표 3, 6, 9, 12, △=□×3 또는 □=△÷3"] });
  const ready = () => nA.value.trim().length >= 2 && nB.value.trim().length >= 2 && T && E && T.filled() && E.filled();
  const run = () => {
    api.tryOnce();
    const given = `${nA.value.trim()} / ${nB.value.trim()} / ${op}${kIn.value.trim()} | ${T.given()} | ${E.given()}`;
    if (nA.value.trim() === nB.value.trim()) { api.fail("두 양은 서로 다른 양이어야 해요.", given); return false; }
    const m = T.check() || E.check();
    if (m) { api.fail(m, given); return false; }
    api.done(given, opt.ok || "나만의 대응 관계 카드를 만들었어요! 친구에게 문제로 내 봐요."); return true;
  };
  const auto = autoRun(ready, () => [nA.value, nB.value, op, kIn.value, T ? T.key() : "", E ? E.key() : ""].join("|"), run, 900);
  wrap.addEventListener("input", auto); wrap.addEventListener("click", auto);
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 환경 동아리 탐사대", lines: [
  "햇살초등학교 5학년 2반 환경 동아리 ‘초록 탐사대’가 한 학기 동안 재활용과 에너지 절약 캠페인을 펼쳐요. 동아리장 윤서, 기록 담당 태오, 그림 담당 하린, 계산 담당 준서, 질문 대장 민아가 함께해요.",
  "페트병 묶음과 병의 수, 캔을 모은 날수와 캔의 수, 꽃밭 울타리 판과 말뚝, 분리수거함과 칸막이처럼 짝을 이루어 함께 변하는 두 양을 찾아 표로 정리하고, 규칙을 □, △, ○, ☆ 같은 기호를 사용한 식으로 나타내요.",
  "학교 곳곳에서 대응 관계를 찾고, 남긴 음식이 물을 얼마나 더럽히는지 계산해 보고, 대응 관계 놀이와 ‘내가 만든 대응 관계 문제’ 발표회로 탐사를 마무리해요."],
  one: "우리 반 환경 동아리 탐사대 · 재활용과 에너지 절약 캠페인에서 함께 변하는 두 양을 찾아 기호를 사용한 식으로 나타내요." };
const UNIT_KEYWORDS = ["두 양", "함께 변하는 양", "대응한다", "대응 관계", "표", "몇 배", "~로 나눈 것", "더한 것", "뺀 것", "□, △, ○, ☆ 같은 기호", "기호를 사용한 식", "곱셈식·나눗셈식", "덧셈식·뺄셈식", "기준에 따라 두 가지 식", "생활 속 대응 관계"];

const CR3WATER = [["콜라", 24], ["우유", 54], ["식용유", 37], ["라면 국물", 7]];
function cr3WaterFig() {
  const tb = h("table"); tb.append(h("tr", {}, h("th", {}, "음식물"), ...CR3WATER.map(r => h("td", { class: "jua" }, r[0]))), h("tr", {}, h("th", {}, "음식물 1 mL를 깨끗한 물로 만드는 데 필요한 물의 양"), ...CR3WATER.map(r => h("td", {}, `${r[1]} L`))));
  return h("div", {}, h("div", { class: "cr3tbl" }, tb), h("p", { class: "cr3muted" }, "출처: 국립환경과학원, 『우리가 남긴 음식물, 물을 얼마나 오염시킬까요?』"));
}
/* 동아리 게시판 그림(1차시) */
function cr3sClubFig() {
  const W = 640, H = 250, svg = makeSvg(W, H);
  svg.append(svgEl("rect", { x: 8, y: 8, width: W - 16, height: H - 16, rx: 16, fill: "#EAF6EC", stroke: "#8CC9A0", "stroke-width": 4 }));
  svg.append(txt(W / 2, 34, "초록 탐사대 캠페인 — 모으고, 아끼고, 나눠요", 20, { fill: "#2E7D4A" }));
  const put = (kind, x, y, k) => { const g = svgEl("g", { transform: `translate(${x} ${y}) scale(${k})` }); CR3EACH[kind].d(g, () => {}); svg.append(g); };
  put("pack", 95, 40, .9); put("canday", 245, 36, .9); put("team", 395, 40, .9);
  const gf = svgEl("g", { transform: "translate(478 92) scale(.5)" }); cr3DrawRowInto(gf, "fence", 2); svg.append(gf);
  [["페트병 4개 한 묶음", 95], ["하루에 캔 6개", 245], ["한 모둠 5명", 395], ["꽃밭 울타리", 538]].forEach(([t, x]) => svg.append(txt(x, 226, t, 15, { fill: CR3C.gray })));
  return h("div", { class: "cr3fig" }, svg);
}
/* 손 발전기 손전등 그림(4차시) */
function cr3sCrankFig() {
  const W = 640, H = 210, svg = makeSvg(W, H);
  svg.append(svgEl("rect", { x: 70, y: 80, width: 170, height: 60, rx: 14, fill: "#F6C85F", stroke: "#B58A12", "stroke-width": 3 }));
  svg.append(svgEl("polygon", { points: cr3P([[240, 72], [290, 56], [290, 164], [240, 148]]), fill: "#FFE9A8", stroke: "#B58A12", "stroke-width": 3 }));
  svg.append(svgEl("circle", { cx: 130, cy: 110, r: 16, fill: "#fff", stroke: "#5E6D6A", "stroke-width": 3 }), svgEl("line", { x1: 130, y1: 110, x2: 130, y2: 60, stroke: "#5E6D6A", "stroke-width": 6, "stroke-linecap": "round" }), svgEl("circle", { cx: 130, cy: 56, r: 9, fill: CR3C.orange }));
  svg.append(svgEl("path", { d: "M300,80 L380,50 M300,110 L392,110 M300,140 L380,170", stroke: "#F6C85F", "stroke-width": 5, "stroke-linecap": "round" }));
  svg.append(txt(130, 176, "손잡이를 1분 돌리면", 18, { fill: CR3C.gray }), txt(500, 96, "불이 5분 동안", 22, { fill: "#B5541C" }), txt(500, 128, "켜져요", 22, { fill: "#B5541C" }));
  return h("div", { class: "cr3fig" }, svg);
}

const LESSONS = [
{
  id: "s1", no: 1, title: "초록 탐사대, 캠페인을 시작해요", soop: "개념 찾기(S)",
  question: "우리 동아리 캠페인 속에서 한 양이 변할 때 함께 변하는 다른 양에는 무엇이 있을까요?",
  summary: "초록 탐사대는 페트병을 4개씩 묶고, 하루에 캔을 6개씩 모으고, 5명씩 모둠을 만들어 캠페인을 해요. 묶음이 늘면 페트병의 수도, 날수가 늘면 캔의 수도 함께 늘어나요. 이 단원에서는 이렇게 짝을 이루어 함께 변하는 두 양 사이의 관계를 표와 식으로 나타내요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "환경 동아리 ‘초록 탐사대’의 첫 모임이에요. 동아리장 윤서가 캠페인 게시판을 붙였어요. 게시판을 보고 떠오르는 것을 세 칸에 써서 붙여요.", hints: ["페트병 묶음, 캔 상자, 모둠 책상, 꽃밭 울타리에서 수를 세어 봐요.", "묶음이나 날수가 늘어나면 무엇이 함께 늘어날지 생각해 봐요."],
      render: (b, a) => { b.append(cr3sClubFig()); panes(b, a, [
        { t: "보여요", e: "👀", ph: "게시판에서 ~이 보여요", hint: "게시판 그림에서 보이는 것", ex: ["페트병 4개가 노란 띠로 한 묶음으로 묶여 있어요.", "모둠 책상 하나에 친구 5명이 둘러앉아 있어요."] },
        { t: "생각해요", e: "💭", ph: "~이 늘어나면 ~도 ~", hint: "함께 늘어나는 것에 대한 생각", ex: ["페트병 묶음이 늘어나면 페트병의 수도 함께 늘어날 것 같아요.", "캔을 모은 날이 많아질수록 모은 캔도 많아질 거예요."] },
        { t: "궁금해요", e: "❓", ph: "~일 때 ~은 몇 개일까?", hint: "함께 변하는 두 양에 대해 궁금한 것", ex: ["캔을 30일 동안 모으면 캔은 모두 몇 개가 될까?", "울타리 판이 늘어나면 말뚝은 몇 개가 필요할까?"] }],
        { ok: "게시판 속에 벌써 함께 변하는 두 양이 보여요! 이 단원에서 그 관계를 표와 식으로 나타내 봐요." }); } },
    { name: "그려 보기 — 함께 늘어나는 두 양", inst: "태오가 모은 페트병을 4개씩 한 묶음으로 묶고 있어요. ‘＋ 하나 더’를 눌러 묶음을 3개까지 늘려 보며 페트병을 눌러 세고, 표를 완성해 보세요.", hints: ["한 묶음에 페트병이 4개예요. 페트병을 하나씩 누르면 번호가 붙어요.", "2묶음은 4개씩 2번, 3묶음은 4개씩 3번이에요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "pack", n0: 1, max: 4, need: 3, count: true, countName: "페트병", label: n => `페트병 ${n}묶음` },
        table: { heads: ["페트병 묶음의 수(묶음)", "페트병의 수(개)"], x: [1, 2, 3], y: [4, 8, 12], by: [1, 2], f: n => 4 * n, why: "그림에서 묶음을 늘려 가며 페트병을 다시 세어 봐요. 한 묶음은 4개예요." },
        ok: "페트병 묶음이 1묶음, 2묶음, 3묶음으로 늘어나면 페트병은 4개, 8개, 12개로 함께 늘어나요." }) },
    { name: "말해 보기 — 함께 변하는 짝 찾기", inst: "민아가 동아리 활동 목록을 보고 질문했어요. “한 양이 변할 때 함께 변하는 두 양은 어떤 것일까?” 알맞은 것을 모두 골라 보세요.", hints: ["하나가 늘어날 때 다른 하나도 정해진 만큼 늘어나는지 생각해요.", "윤서의 키는 동아리 이름이 바뀐다고 변하지 않아요."],
      render: thenWhy((b, a) => cr3Do(b, a, { choose: [{ q: "한 양이 변할 때 다른 양도 함께 변하는 두 양을 모두 고르세요.", o: ["캔을 모은 날수와 모은 캔의 수(하루에 6개씩)", "모둠의 수와 모둠 친구의 수(한 모둠 5명)", "울타리 판의 수와 필요한 말뚝의 수", "동아리 이름과 윤서의 키"], a: [0, 1, 2] }],
        ok: "날수와 캔의 수, 모둠의 수와 친구의 수, 울타리 판과 말뚝의 수는 짝을 이루어 함께 변해요." }),
        { q: "캔을 모은 날수와 모은 캔의 수가 함께 변한다고 할 수 있는 까닭을 써 볼까요?", ph: "날수가 하루 늘어날 때마다 캔은 ~", help: ["① 하루에 캔을 몇 개씩 모으는지 떠올려요. → ② 날수가 늘어날 때 캔이 어떻게 되는지 써요.", "‘하루에 캔을 ~개씩 모으므로 날수가 1일 늘어날 때마다 캔은 ~개씩 늘어나요.’ 꼴로 써요."], ans: "하루에 캔을 6개씩 모으므로 날수가 1일 늘어날 때마다 캔은 6개씩 늘어나요. 그래서 날수가 정해지면 캔의 수도 정해져요." }) },
    { name: "약속하기 — 무엇을 배울까요", inst: "이 단원에서 배울 내용을 살펴봐요. 배우는 순서대로 눌러 보세요.", hints: ["먼저 두 양 사이의 관계를 알아본 뒤에 식으로 나타내요.", "생활 속에서 찾기와 문제 해결은 식으로 나타내기를 배운 다음이에요."],
      render: (b, a) => sequence(b, a, ["대응 관계를 □, △ 같은 기호를 사용하여 식으로 나타내기", "두 양 사이의 관계 알아보기", "대응 관계를 이용하여 문제 해결하기", "학교와 생활 속에서 대응 관계를 찾아 식으로 나타내기"], [1, 0, 3, 2],
        { ok: "두 양 사이의 관계 알아보기 → 식으로 나타내기 → 생활 속에서 찾아 식으로 나타내기 → 문제 해결하기 순서로 탐사해요." }) },
    { name: "확인하기 — 4학년 때 배운 규칙", inst: "4학년 때 배운 수의 배열과 도형의 배열에서 규칙을 찾아보세요.", hints: ["5, 10, 20, 40은 앞의 수의 몇 배가 되나요?", "사각형이 2개, 5개, 8개, 11개로 늘어나요. 몇 개씩 늘어나나요?"],
      render: (b, a) => numbers(b, a, [
        { q: "수의 배열 5, 10, 20, 40, □에서 □에 알맞은 수는?", a: 80, why: { "45": "5씩 커지는 것이 아니에요. 5 → 10 → 20은 2배씩 커져요.", "60": "20씩 커지는 것이 아니에요. 앞의 수의 2배가 돼요." } },
        { q: "사각형이 2개, 5개, 8개, 11개로 놓인 도형의 배열에서 다섯째에 놓일 사각형은 몇 개?", a: 14, unit: "개", why: { "12": "사각형이 1개씩이 아니라 3개씩 늘어나요.", "13": "11에 3을 더해요." } }],
        { ok: "4학년 때는 한 양이 어떻게 변하는지 규칙을 찾았어요. 이 단원에서는 두 양이 함께 어떻게 변하는지 알아봐요." }) }
  ],
  challenge: { inst: "동아리방 전등은 1줄에 형광등이 3개씩 있어요. 또, 한 모둠은 5명이에요. 함께 변하는 두 양을 생각하며 답해 보세요.", hints: ["전등이 1줄씩 늘어날 때마다 형광등은 3개씩 늘어나요.", "10줄이면 3개씩 10묶음이에요."],
    render: (b, a) => numbers(b, a, [
      { q: "전등이 4줄이면 형광등은 몇 개?", a: 12, unit: "개", why: { "7": "4+3이 아니라 3개씩 4줄이에요." } },
      { q: "전등이 10줄이면 형광등은 몇 개?", a: 30, unit: "개", why: { "13": "10+3이 아니라 3개씩 10줄이에요." } },
      { q: "모둠이 6개이면 모둠 친구는 모두 몇 명?", a: 30, unit: "명", why: { "11": "6+5가 아니라 5명씩 6모둠이에요." } }],
      { ok: "전등 줄의 수와 형광등의 수, 모둠의 수와 친구의 수는 짝을 이루어 함께 변해요." }) }
},
{
  id: "s2", no: 2, title: "페트병 묶음과 캔 모으기 ― 두 양 사이의 관계 ⑴", soop: "개념 구축하기(O)",
  question: "한 양이 변할 때 다른 양은 어떻게 함께 변할까요?",
  summary: "페트병 묶음이 1묶음씩 늘어날 때마다 페트병은 4개씩 늘어나요. 페트병의 수는 묶음의 수의 4배이고, 묶음의 수는 페트병의 수를 4로 나눈 것과 같아요. 두 양이 짝을 이루는 것을 대응한다고 하고, 한 양이 변함에 따라 다른 양이 변할 때 두 양 사이의 관계를 대응 관계라고 해요.",
  steps: [
    { name: "만져 보기 — 페트병 묶음 세기", inst: "재활용 날, 태오가 페트병을 4개씩 한 묶음으로 묶어요. 먼저 예상을 쓰고, 묶음을 4개까지 늘려 보며 표와 문장을 완성해 보세요.", hints: ["묶음을 하나 더 늘리면 페트병이 몇 개 더 생기는지 세어 봐요.", "4, 8, 12, 16은 4씩 커져요."],
      render: ruleFirst((b, a) => cr3Do(b, a, { scene: { kind: "pack", n0: 1, max: 5, need: 4, count: true, countName: "페트병", label: n => `페트병 ${n}묶음` },
        table: { heads: ["페트병 묶음의 수(묶음)", "페트병의 수(개)"], x: [1, 2, 3, 4], y: [4, 8, 12, 16], by: [1, 2, 3], f: n => 4 * n },
        say: [["페트병 묶음이 1묶음씩 늘어날 때마다 페트병은 ", { a: 4, why: { "1": "묶음이 1개 늘면 페트병은 1개가 아니라 한 묶음만큼 늘어나요." } }, "개씩 늘어나요."]],
        ok: "묶음이 1묶음씩 늘어날 때마다 페트병은 4개씩 늘어나요. 묶음이 4묶음이면 페트병은 16개예요." }),
        { q: "페트병 묶음이 늘어나면 페트병의 수는 어떻게 될지 예상해 봐요.", ph: "내 예상: 묶음이 1묶음씩 늘어나면 페트병은 ~", help: ["① 한 묶음에 페트병이 몇 개인지 떠올려요. → ② 묶음이 하나 늘 때 페트병이 몇 개 느는지 생각해요.", "‘내 예상: 묶음이 1묶음씩 늘어나면 페트병은 ~개씩 늘어나요.’ 꼴로 써요."], ans: "페트병 묶음이 1묶음씩 늘어날 때마다 페트병은 4개씩 늘어나요. 페트병의 수는 묶음의 수의 4배예요." }) },
    { name: "그려 보기 — 캔 모으기 달력", inst: "준서는 날마다 캔을 6개씩 모아 상자에 담아요. 날을 4일째까지 늘려 보며 캔을 세고, 표를 완성해 보세요.", hints: ["하루에 캔이 6개씩 들어 있어요.", "모은 캔은 6, 12, 18, …로 6씩 커져요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "canday", n0: 1, max: 5, need: 4, count: true, countName: "캔", label: n => `캔을 모은 날 ${n}일`, numbered: n => `${n}일째` },
        table: { heads: ["캔을 모은 날수(일)", "모은 캔의 수(개)"], x: [1, 2, 3, 4], y: [6, 12, 18, 24], by: [1, 2, 3], f: n => 6 * n },
        ask: [{ q: "5일 동안 모으면 캔은 몇 개?", a: 30, unit: "개", why: { "11": "날수에 6을 더한 것이 아니에요. 캔이 6개씩 5일 동안이에요.", "25": "24에 1개가 아니라 하루치 6개가 더 늘어나요." } }],
        ok: "날수가 1일씩 늘어날 때마다 캔은 6개씩 늘어나서, 5일 동안 모으면 30개예요." }) },
    { name: "말해 보기 — 두 양을 함께 말하기", inst: "기록 담당 태오가 탐사 노트에 두 양 사이의 관계를 적으려고 해요. 빈칸을 채우고, 두 양을 함께 관련지어 말한 문장을 골라 보세요.", hints: ["모은 캔의 수는 모은 날수의 몇 배인가요? 6÷1, 12÷2, 18÷3을 생각해요.", "‘캔은 6개씩 늘어나요’는 캔의 수 한 양만 말한 것이에요."],
      render: thenWhy((b, a) => cr3Do(b, a, { fig: cr3Pic("canday", 3, "3일 동안 모은 캔 18개", 200),
        say: [["모은 캔의 수는 모은 날수의 ", { a: 6 }, "배예요."], ["모은 날수는 모은 캔의 수를 ", { a: 6 }, "으로 나눈 것과 같아요."]],
        choose: [{ q: "두 양을 함께 관련지어 말한 것은 어느 것인가요?", o: ["캔은 6개씩 늘어나요.", "모은 캔의 수는 모은 날수의 6배예요.", "날수는 하루씩 늘어나요."], a: 1, why: { "0": "캔 한 양만 보고 말했어요. 모은 날수와 함께 관련지어 말해 봐요.", "2": "날수 한 양만 보고 말했어요. 모은 캔의 수와 함께 관련지어 말해 봐요." } }],
        ok: "모은 캔의 수는 모은 날수의 6배이고, 모은 날수는 모은 캔의 수를 6으로 나눈 것과 같아요." }),
        { q: "‘캔은 6개씩 늘어나요’라고만 말하면 부족한 까닭은 무엇일까요?", ph: "이 말에는 ~ 한 양만 들어 있어서 ~", help: ["① 이 문장에 어떤 양이 들어 있는지 찾아요. → ② 빠진 양을 넣어 다시 말해요.", "‘~ 한 양만 말했기 때문이에요. ~처럼 두 양을 함께 말해야 해요.’ 꼴로 써요."], ans: "캔의 수 한 양만 말했기 때문이에요. ‘모은 캔의 수는 모은 날수의 6배예요’처럼 모은 날수와 함께 두 양을 관련지어 말해야 해요." }) },
    { name: "약속하기 — 대응과 대응 관계", inst: "오늘 알게 된 것을 약속으로 정리해 보세요.", hints: ["두 양이 짝을 이루는 것을 나타내는 말을 골라요.", "한 양이 변함에 따라 다른 양이 변할 때 두 양 사이의 ‘관계’예요."],
      render: (b, a) => blanks(b, a, ["페트병 묶음의 수와 페트병의 수와 같이 두 양이 짝을 이루는 것을 ", { o: ["대응한다", "비교한다", "어림한다"], a: 0 }, "고 하고, 한 양이 변함에 따라 다른 양이 변할 때 두 양 사이의 관계를 ", { o: ["대응 관계", "크기 관계", "순서 관계"], a: 0 }, "라고 합니다."]) },
    { name: "확인하기 — 모둠과 친구 수", inst: "동아리방에서 서로 대응하는 두 양을 짝 지어 보고, 모둠 그림을 늘려 가며 대응 관계를 말해 보세요.", hints: ["한 모둠은 5명이에요. 모둠을 3개까지 늘려 친구를 세어 봐요.", "페트병은 묶음과, 모은 캔은 날수와 짝을 이뤄요."],
      render: (b, a) => cr3Do(b, a, {
        link: { lt: "한 양", rt: "짝을 이루는 양", left: ["모둠의 수(한 모둠 5명)", "페트병 묶음의 수", "캔을 모은 날수"], right: ["모은 캔의 수", "모둠 친구의 수", "페트병의 수"], pairs: [1, 2, 0] },
        scene: { kind: "team", n0: 1, max: 4, need: 3, count: true, countName: "친구", label: n => `모둠 ${n}개` },
        say: [["모둠 친구의 수는 모둠의 수의 ", { a: 5 }, "배예요."], ["모둠의 수는 모둠 친구의 수를 ", { a: 5 }, "로 나눈 것과 같아요."]],
        ok: "동아리방에도 대응 관계가 많아요. 모둠 친구의 수는 모둠의 수의 5배, 모둠의 수는 모둠 친구의 수를 5로 나눈 것과 같아요." }) }
  ],
  challenge: { inst: "하린이가 동아리 텃밭의 화분 1개에 상추 모종을 3포기씩 심어요. 표를 완성하고 물음에 답해 보세요.", hints: ["상추 모종의 수는 화분의 수의 3배예요.", "모종이 45포기이면 화분의 수는 45를 3으로 나눈 것이에요."],
    render: (b, a) => cr3Do(b, a, {
      table: { heads: ["화분의 수(개)", "상추 모종의 수(포기)"], x: [1, 2, 3, 4], y: [3, 6, 9, 12], by: [1, 2, 3], f: n => 3 * n },
      say: [["상추 모종의 수는 화분의 수의 ", { a: 3 }, "배이고, 화분의 수는 상추 모종의 수를 ", { a: 3 }, "으로 나눈 것과 같아요."]],
      ask: [{ q: "화분이 12개이면 상추 모종은 몇 포기?", a: 36, unit: "포기", why: { "15": "12+3이 아니라 3포기씩 12개예요." } },
        { q: "상추 모종 45포기를 모두 심으려면 화분은 몇 개?", a: 15, unit: "개", why: { "42": "45−3이 아니라 45를 3으로 나눠요.", "135": "화분의 수는 모종의 수를 3으로 나눈 것이에요. 곱하면 안 돼요." } }],
      ok: "두 양 사이의 대응 관계를 이용하면 표에 없는 수도 구할 수 있어요." }) }
},
{
  id: "s3", no: 3, title: "꽃밭 울타리와 분리수거함 ― 두 양 사이의 관계 ⑵", soop: "개념 구축하기(O)",
  question: "더하거나 빼는 관계인 두 양 사이의 대응 관계는 어떻게 말할까요?",
  summary: "울타리 판을 한 줄로 잇고 판 사이와 양 끝에 말뚝을 박으면 말뚝의 수는 울타리 판의 수보다 1개 더 많아요. 분리수거함 사이에만 칸막이를 세우면 칸막이의 수는 분리수거함의 수보다 1개 더 적어요. 몇 배인 관계뿐 아니라 더하거나 빼는 관계도 대응 관계예요. ‘1 차이’라고만 하지 말고 어느 쪽이 더 많은지 함께 말해요.",
  steps: [
    { name: "만져 보기 — 꽃밭 울타리 세우기", inst: "초록 탐사대가 학교 꽃밭에 울타리를 세워요. 울타리 판을 한 줄로 잇고, 판 사이와 양 끝에 말뚝을 박아요. 먼저 예상을 쓰고, 판을 늘려 가며 말뚝을 세어 표를 완성해 보세요.", hints: ["울타리 판 1개에는 양 끝에 말뚝이 2개 있어요.", "판을 하나 더 이으면 말뚝은 1개만 더 필요해요. 이웃한 판은 말뚝을 함께 써요."],
      render: ruleFirst((b, a) => cr3Do(b, a, { scene: { kind: "fence", n0: 1, max: 5, need: 4, count: true, countName: "말뚝", label: n => `울타리 판 ${n}개` },
        table: { heads: ["울타리 판의 수(개)", "말뚝의 수(개)"], x: [1, 2, 3, 4], y: [2, 3, 4, 5], by: [1, 2, 3], f: n => n + 1, why: "판을 하나 더 이으면 말뚝이 몇 개 늘어나는지 그림에서 세어 봐요." },
        ask: [{ q: "울타리 판이 6개일 때 말뚝은 몇 개?", a: 7, unit: "개", why: { "12": "판마다 말뚝이 2개씩 따로 있는 것이 아니에요. 이웃한 판은 말뚝을 함께 써요.", "6": "양 끝에도 말뚝이 있어서 판보다 말뚝이 하나 더 많아요." } }],
        ok: "울타리 판이 1개씩 늘어날 때마다 말뚝도 1개씩 늘어나요. 판 6개에는 말뚝이 7개 필요해요." }),
        { q: "울타리 판이 늘어날 때 말뚝의 수는 어떻게 될지 예상해 봐요.", ph: "내 예상: 판이 1개씩 늘어나면 말뚝은 ~", help: ["① 판 1개, 2개일 때 말뚝이 몇 개인지 떠올려요. → ② 판과 말뚝 중 어느 쪽이 몇 개 더 많은지 생각해요.", "‘내 예상: 판이 1개씩 늘어나면 말뚝은 ~개씩 늘어나고, 말뚝은 판보다 ~개 더 많아요.’ 꼴로 써요."], ans: "울타리 판이 1개씩 늘어날 때마다 말뚝도 1개씩 늘어나요. 말뚝의 수는 울타리 판의 수보다 1개 더 많아요." }) },
    { name: "그려 보기 — 1 차이를 바르게 말하기", inst: "민아가 “말뚝과 판은 1 차이가 나!”라고 말했어요. 어느 쪽이 더 많은지까지 넣어 대응 관계를 말해 보세요.", hints: ["표에서 판 2개 → 말뚝 3개, 판 3개 → 말뚝 4개예요.", "‘1을 더한 것’과 ‘1을 뺀 것’은 무엇을 기준으로 하느냐에 따라 달라요."],
      render: thenWhy((b, a) => cr3Do(b, a, { fig: cr3Pic("fence", 3, "울타리 판 3개, 말뚝 4개"),
        say: [["말뚝의 수는 울타리 판의 수보다 ", { a: 1 }, "개 더 ", { o: ["적어요", "많아요"], a: 1 }, "."], ["울타리 판의 수는 말뚝의 수보다 ", { a: 1 }, "개 더 ", { o: ["적어요", "많아요"], a: 0 }, "."]],
        choose: [{ q: "울타리 판의 수와 말뚝의 수 사이의 대응 관계를 바르게 말한 것을 모두 고르세요.", o: ["말뚝의 수는 울타리 판의 수에 1을 더한 것과 같아요.", "울타리 판의 수는 말뚝의 수에서 1을 뺀 것과 같아요.", "말뚝의 수는 울타리 판의 수의 2배예요.", "말뚝은 1개씩 늘어나요."], a: [0, 1] }],
        ok: "말뚝의 수는 울타리 판의 수에 1을 더한 것과 같고, 울타리 판의 수는 말뚝의 수에서 1을 뺀 것과 같아요." }),
        { q: "‘말뚝의 수는 울타리 판의 수의 2배예요’라고 하면 안 되는 까닭은 무엇일까요?", ph: "판이 1개일 때는 ~지만, 판이 2개일 때는 ~", help: ["① 판이 1개일 때와 2개일 때 말뚝의 수를 표에서 찾아요. → ② 2배가 맞는지 각각 따져 봐요.", "‘판이 ~개일 때는 맞지만, 판이 ~개일 때 말뚝은 ~개가 아니라 ~개예요.’ 꼴로 써요."], ans: "울타리 판이 1개일 때는 말뚝이 2개라서 2배가 맞지만, 판이 2개일 때 말뚝은 4개가 아니라 3개예요. 표의 모든 짝에 맞는 관계는 ‘판의 수에 1을 더한 것’이에요." }) },
    { name: "말해 보기 — 분리수거함 칸막이", inst: "분리수거장에 수거함을 한 줄로 놓고, 수거함과 수거함 사이에만 칸막이를 세웠어요. 수거함을 늘려 가며 칸막이를 세고, 표와 문장을 완성해 보세요.", hints: ["수거함이 1개일 때는 사이가 없어서 칸막이가 0개예요.", "칸막이는 수거함 사이에만 있어서 수거함보다 1개 더 적어요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "bins", n0: 1, max: 5, need: 4, count: true, countName: "칸막이", label: n => `분리수거함 ${n}개` },
        table: { heads: ["분리수거함의 수(개)", "칸막이의 수(개)"], x: [1, 2, 3, 4], y: [0, 1, 2, 3], by: [1, 2, 3], f: n => n - 1 },
        say: [["칸막이의 수는 분리수거함의 수에서 ", { a: 1 }, "을 뺀 것과 같아요."], ["분리수거함의 수는 칸막이의 수에 ", { a: 1 }, "을 더한 것과 같아요."]],
        ask: [{ q: "분리수거함이 9개일 때 칸막이는 몇 개?", a: 8, unit: "개", why: { "10": "칸막이가 수거함보다 1개 더 적어요.", "9": "칸막이는 수거함 사이에만 있어서 1개 더 적어요." } }],
        ok: "분리수거함이 1개씩 늘어날 때마다 칸막이도 1개씩 늘어나요. 칸막이의 수는 분리수거함의 수에서 1을 뺀 것과 같아요." }) },
    { name: "약속하기 — 곱의 관계와 합(차)의 관계", inst: "지금까지 만난 두 양과 대응 관계를 이어 보고, 알맞은 말을 골라 정리해요.", hints: ["페트병과 캔은 ‘몇 배’로 말했어요.", "울타리와 칸막이는 ‘몇 개 더 많다(적다)’로 말했어요."],
      render: (b, a) => cr3Do(b, a, { link: { lt: "두 양", rt: "대응 관계", left: ["페트병 묶음의 수와 페트병의 수", "울타리 판의 수와 말뚝의 수", "캔을 모은 날수와 모은 캔의 수", "분리수거함의 수와 칸막이의 수"], right: ["칸막이의 수는 분리수거함의 수에서 1을 뺀 것", "페트병의 수는 묶음의 수의 4배", "말뚝의 수는 울타리 판의 수에 1을 더한 것", "모은 캔의 수는 모은 날수의 6배"], pairs: [1, 2, 3, 0] },
        choose: [{ q: "어느 말이 맞나요?", o: ["몇 배인 관계만 대응 관계예요.", "몇 배인 관계도, 더하거나 빼는 관계도 모두 대응 관계예요."], a: 1, why: { "0": "울타리 판과 말뚝처럼 더하거나 빼는 관계도 한 양이 변할 때 다른 양이 함께 변하는 대응 관계예요." } }],
        ok: "몇 배인 관계도, 더하거나 빼는 관계도 모두 대응 관계예요." }) },
    { name: "확인하기 — 동아리 게시판 테두리", inst: "하린이가 동아리 게시판 아래쪽을 사각형과 삼각형 색종이로 꾸미고 있어요. 사각형을 늘려 가며 삼각형을 세고, 서로 대응하는 두 양 사이의 대응 관계를 알아보세요.", hints: ["사각형마다 위에 삼각형이 1개씩, 그리고 양 끝에 삼각형이 1개씩 있어요.", "삼각형의 수는 사각형의 수보다 2개 더 많아요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "sqtri", n0: 1, max: 5, need: 4, count: true, countName: "삼각형", label: n => `사각형 ${n}개`, h: 200 },
        table: { heads: ["사각형의 수(개)", "삼각형의 수(개)"], x: [1, 2, 3, 4], y: [3, 4, 5, 6], by: [1, 2, 3], f: n => n + 2 },
        say: [["삼각형의 수는 사각형의 수에 ", { a: 2, why: { "1": "사각형 1개일 때 삼각형이 3개예요. 3은 1보다 얼마나 큰가요?" } }, "를 더한 것과 같아요."], ["사각형의 수는 삼각형의 수에서 ", { a: 2 }, "를 뺀 것과 같아요."]],
        choose: [{ q: "서로 대응하는 두 양은 무엇인가요?", o: ["사각형의 수와 삼각형의 수", "사각형의 색깔과 삼각형의 색깔", "게시판의 이름과 색종이의 크기"], a: 0 }],
        ok: "사각형이 1개씩 늘어날 때마다 삼각형도 1개씩 늘어나요. 삼각형의 수는 사각형의 수에 2를 더한 것과 같아요." }) }
  ],
  challenge: { inst: "매년 3월 1일에 윤서와 언니의 나이를 적었어요. 윤서가 11살일 때 언니는 15살이에요. 표를 완성하고 물음에 답해 보세요.", hints: ["해마다 두 사람 모두 1살씩 많아져요.", "언니의 나이는 윤서의 나이에 4를 더한 것과 같아요."],
    render: (b, a) => cr3Do(b, a, {
      table: { heads: ["윤서의 나이(살)", "언니의 나이(살)"], x: [11, 12, 13, 14], y: [15, 16, 17, 18], by: [1, 2, 3], f: n => n + 4 },
      ask: [{ q: "윤서가 20살인 해에 언니는 몇 살?", a: 24, unit: "살", why: { "21": "언니는 윤서보다 1살이 아니라 4살 더 많아요.", "16": "언니가 윤서보다 나이가 더 많아요." } },
        { q: "언니가 30살인 해에 윤서는 몇 살?", a: 26, unit: "살", why: { "34": "윤서는 언니보다 4살 더 적어요. 30에서 4를 빼요." } }],
      ok: "언니의 나이는 윤서의 나이에 4를 더한 것, 윤서의 나이는 언니의 나이에서 4를 뺀 것과 같아요." }) }
},
{
  id: "s4", no: 4, title: "손 발전기 손전등 ― 대응 관계를 식으로 나타내기", soop: "개념 구축하기(O)",
  question: "두 양 사이의 대응 관계를 기호를 사용하여 식으로 어떻게 나타낼까요?",
  summary: "손 발전기 손전등은 손잡이를 1분 돌리면 5분 동안 켜져요. (켜지는 시간)=(돌린 시간)×5 또는 (돌린 시간)=(켜지는 시간)÷5로 나타내요. 울타리 판의 수를 □, 말뚝의 수를 △라고 하면 △=□+1 또는 □=△−1이에요. 각 양을 □, △, ○, ☆ 같은 기호로 나타내면 대응 관계를 식으로 간단하게 나타낼 수 있어요.",
  steps: [
    { name: "만져 보기 — 돌린 시간과 켜지는 시간", inst: "에너지 절약 체험 날, 준서가 손 발전기 손전등을 가져왔어요. 손잡이를 1분 돌리면 불이 5분 동안 켜진대요. 표를 완성하고 문장을 채워 보세요.", hints: ["손잡이를 2분 돌리면 5분씩 두 번 켜져요.", "20분은 5분씩 4번이에요. 그러면 손잡이를 몇 분 돌린 걸까요?"],
      render: (b, a) => cr3Do(b, a, { fig: cr3sCrankFig,
        table: { heads: ["손잡이를 돌린 시간(분)", "불이 켜지는 시간(분)"], x: [1, 2, 3, 4, 5], y: [5, 10, 15, 20, 25], bx: [3], by: [1, 2, 4], f: n => 5 * n },
        say: [["손잡이를 돌린 시간이 1분씩 늘어날 때마다 불이 켜지는 시간은 ", { a: 5 }, "분씩 늘어나요."], ["불이 켜지는 시간은 손잡이를 돌린 시간의 ", { a: 5 }, "배예요."]],
        ok: "서로 대응하는 두 양은 손잡이를 돌린 시간과 불이 켜지는 시간이에요. 켜지는 시간은 돌린 시간의 5배예요." }) },
    { name: "그려 보기 — 보기 카드로 식 만들기", inst: "보기 카드를 눌러 돌린 시간과 켜지는 시간 사이의 대응 관계를 식으로 나타내 보세요. 식 1을 만든 뒤, 식 2 줄을 눌러 다른 연산 기호로도 나타내 보세요.", hints: ["(켜지는 시간)=(돌린 시간)×5 처럼 곱셈식으로 나타낼 수 있어요.", "기준을 바꾸면 나눗셈식이 돼요. (돌린 시간)=(켜지는 시간)÷5"],
      render: (b, a) => cr3Cards(b, a, { cards: ["=", "1", "5", "+", "−", "×", "÷", "돌린 시간", "켜지는 시간"], vars: { "돌린 시간": [1, 2, 3, 4, 5], "켜지는 시간": [5, 10, 15, 20, 25] }, need: 2,
        table: { heads: ["돌린 시간(분)", "켜지는 시간(분)"], x: [1, 2, 3, 4, 5], y: [5, 10, 15, 20, 25], f: n => 5 * n },
        ans: [["켜지는 시간", "=", "돌린 시간", "×", "5"], ["돌린 시간", "=", "켜지는 시간", "÷", "5"]],
        ok: "(켜지는 시간)=(돌린 시간)×5, (돌린 시간)=(켜지는 시간)÷5로 나타낼 수 있어요. 같은 대응 관계를 곱셈식과 나눗셈식으로 나타냈어요." }) },
    { name: "말해 보기 — 울타리를 낱말 식으로", inst: "3차시의 꽃밭 울타리예요. 보기 카드로 울타리 판의 수와 말뚝의 수 사이의 대응 관계를 덧셈식과 뺄셈식으로 나타내 보세요.", hints: ["말뚝의 수는 울타리 판의 수에 1을 더한 것과 같아요.", "기준을 바꾸면 (울타리 판의 수)=(말뚝의 수)−1이에요."],
      render: thenWhy((b, a) => cr3Cards(b, a, { cards: ["=", "1", "2", "+", "−", "×", "÷", "울타리 판의 수", "말뚝의 수"], vars: { "울타리 판의 수": [1, 2, 3, 4, 5], "말뚝의 수": [2, 3, 4, 5, 6] }, need: 2,
        fig: cr3Pic("fence", 3, "울타리 판 3개, 말뚝 4개"),
        ans: [["말뚝의 수", "=", "울타리 판의 수", "+", "1"], ["울타리 판의 수", "=", "말뚝의 수", "−", "1"]],
        ok: "(말뚝의 수)=(울타리 판의 수)+1, (울타리 판의 수)=(말뚝의 수)−1이에요." }),
        { q: "덧셈식과 뺄셈식이 둘 다 맞는 까닭은 무엇일까요?", ph: "무엇을 기준으로 하느냐에 따라 ~", help: ["① 말뚝의 수를 구할 때와 판의 수를 구할 때를 나누어 생각해요. → ② 각각 어떤 계산을 하는지 써요.", "‘말뚝의 수를 구할 때는 ~, 판의 수를 구할 때는 ~. 기준이 달라서 식이 두 가지예요.’ 꼴로 써요."], ans: "무엇을 기준으로 하느냐에 따라 달라요. 말뚝의 수를 구할 때는 울타리 판의 수에 1을 더하고, 울타리 판의 수를 구할 때는 말뚝의 수에서 1을 빼요. 두 식은 같은 대응 관계를 나타내요." }) },
    { name: "약속하기 — 기호로 간단하게", inst: "낱말 식은 길어요. 울타리 판의 수를 □, 말뚝의 수를 △라고 할 때, 두 양 사이의 대응 관계를 식으로 나타내 보세요. 덧셈식과 뺄셈식으로 모두 나타내요.", hints: ["(말뚝의 수)=(울타리 판의 수)+1에서 낱말을 기호로 바꿔요.", "△=□+1, 기준을 바꾸면 □=△−1"],
      render: (b, a) => cr3Do(b, a, { promise: "각 양을 □, △, ○, ☆과 같은 기호로 나타내면 두 양 사이의 대응 관계를 식으로 간단하게 나타낼 수 있어요.",
        table: { heads: ["울타리 판의 수(개) □", "말뚝의 수(개) △"], x: [1, 2, 3, 4, 5], y: [2, 3, 4, 5, 6], f: n => n + 1 },
        eq: { vars: [{ s: "□", name: "울타리 판의 수", v: [1, 2, 3, 4, 5] }, { s: "△", name: "말뚝의 수", v: [2, 3, 4, 5, 6] }], need: 2, ans: ["△=□+1", "□=△−1"] },
        ok: "△=□+1 또는 □=△−1로 간단하게 나타낼 수 있어요." }) },
    { name: "확인하기 — 캔의 무게", inst: "준서가 모은 빈 캔의 무게를 재요. 빈 캔 1개의 무게를 15 g이라고 할 때, 표를 완성하고 캔의 수를 ☆, 캔의 무게를 ○라고 하여 대응 관계를 식으로 나타내 보세요.", hints: ["캔의 무게는 캔의 수의 15배예요.", "○=☆×15, 기준을 바꾸면 ☆=○÷15"],
      render: (b, a) => cr3Do(b, a, { fig: cr3Pic("can15", 3, "빈 캔 1개의 무게는 15 g"),
        table: { heads: ["캔의 수(개)", "캔의 무게(g)"], x: [1, 2, 3, 4, 5], y: [15, 30, 45, 60, 75], bx: [2, 4], by: [1, 3, 4], f: n => 15 * n },
        eq: { vars: [{ s: "☆", name: "캔의 수", v: [1, 2, 3, 4, 5] }, { s: "○", name: "캔의 무게", v: [15, 30, 45, 60, 75] }], need: 2, ans: ["○=☆×15", "☆=○÷15"] },
        ask: [{ q: "빈 캔 40개의 무게는 몇 g?", a: 600, unit: "g", why: { "55": "40+15가 아니라 15 g씩 40개예요.", "6000": "40×15를 다시 계산해 봐요. 4×15=60이에요." } }],
        ok: "○=☆×15 또는 ☆=○÷15예요. 식을 이용하면 캔 40개의 무게 40×15=600(g)도 쉽게 구할 수 있어요." }) }
  ],
  challenge: { inst: "동아리에서 병뚜껑으로 화분을 꾸며요. 화분 1개에 병뚜껑을 8개씩 붙여요. 또, 윤서는 2026년 1월 1일에 11살이에요. 물음에 답해 보세요.", hints: ["민아의 식 ○=☆÷8에서 ☆를 8로 나누면 ○가 돼요. ☆가 병뚜껑의 수여야 해요.", "2026년에 11살이면 나이는 연도에서 2015를 뺀 것과 같아요."],
    render: (b, a) => cr3Do(b, a, {
      choose: [{ q: "화분의 수와 병뚜껑의 수 사이의 대응 관계를 잘못 설명한 사람은?", o: ["태오: 화분의 수를 ◇, 병뚜껑의 수를 ♡라고 하면 ♡=◇×8이에요.", "민아: ○=☆÷8에서 ☆는 화분의 수, ○는 병뚜껑의 수예요."], a: 1, why: { "0": "병뚜껑의 수는 화분의 수의 8배예요. 태오의 식은 맞아요." } }],
      eq: [{ title: "매년 1월 1일의 연도를 △, 윤서의 나이를 ☆라고 할 때", vars: [{ s: "△", name: "연도", v: [2026, 2027, 2028, 2029] }, { s: "☆", name: "윤서의 나이", v: [11, 12, 13, 14] }], need: 1, ans: ["☆=△−2015", "△=☆+2015"] }],
      ok: "민아는 기호가 나타내는 양을 바꾸어 말했어요. ○=☆÷8이면 ☆가 병뚜껑의 수, ○가 화분의 수예요. 윤서의 나이는 ☆=△−2015로 나타내요." }) }
},
{
  id: "s5", no: 5, title: "학교 곳곳에서 찾은 대응 관계", soop: "개념 구축하기(O)",
  question: "학교와 생활 속에서 서로 대응하는 두 양을 찾아 식으로 어떻게 나타낼까요?",
  summary: "교실 전등 1줄에 형광등이 3개이면 전등 줄의 수를 ◇, 형광등의 수를 ♡라고 할 때 ♡=◇×3이에요. 같은 대응 관계라도 어떤 기호를 쓰는지, 무엇을 기준으로 하는지에 따라 식이 달라질 수 있어요. 덧셈식·뺄셈식으로 나타나는 대응 관계도 생활 속에 있어요.",
  steps: [
    { name: "만져 보기 — 학교 탐사", inst: "초록 탐사대가 에너지 절약 점검표를 들고 학교를 둘러봐요. 교실 전등은 1줄에 형광등이 3개, 창문 1개에 유리가 2장, 급식 우유 상자 1개에 우유가 10팩 들어 있어요. 수돗가 꼭지를 1분 틀면 물이 6 L 나온다고 해요(탐사대가 정한 양). 그림에서 시설을 눌러 서로 대응하는 두 양을 4가지 찾아보세요.", hints: ["그림에 이름이 적힌 시설을 하나씩 눌러 봐요.", "시설 하나에서 짝을 이루어 함께 변하는 두 양이 나와요."],
      render: (b, a) => cr3Find(b, a, { need: 4, spots: { lamp: "전등 줄의 수와 형광등의 수", window: "창문의 수와 유리의 수", milk: "우유 상자의 수와 우유의 수", tap: "물을 튼 시간과 쓴 물의 양", bins: "분리수거함의 수와 칸막이의 수" },
        ok: "학교에는 서로 대응하는 두 양이 아주 많아요." }) },
    { name: "그려 보기 — 교실 전등", inst: "교실 전등의 줄의 수와 형광등의 수 사이의 대응 관계를 알아봐요. 전등 줄을 늘려 가며 형광등을 세고, 표를 완성한 뒤 기호 식으로 나타내 보세요.", hints: ["형광등의 수는 전등 줄의 수의 3배예요.", "♡=◇×3, 기준을 바꾸면 ◇=♡÷3"],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "lamp", n0: 1, max: 4, need: 3, count: true, countName: "형광등", label: n => `전등 ${n}줄`, h: 140 },
        table: { heads: ["전등 줄의 수(줄) ◇", "형광등의 수(개) ♡"], x: [1, 2, 3, 4], y: [3, 6, 9, 12], bx: [3], by: [1, 2], f: n => 3 * n },
        eq: { vars: [{ s: "◇", name: "전등 줄의 수", v: [1, 2, 3, 4] }, { s: "♡", name: "형광등의 수", v: [3, 6, 9, 12] }], need: 2, ans: ["♡=◇×3", "◇=♡÷3"] },
        ok: "♡=◇×3 또는 ◇=♡÷3이에요. 쓰지 않는 줄의 전등을 끄면 형광등 3개씩 전기를 아낄 수 있어요." }) },
    { name: "말해 보기 — 내가 고른 기호로", inst: "학교에서 찾은 다른 두 양도 식으로 나타내 보세요. 이번에는 두 양을 나타낼 기호를 내가 골라요.", hints: ["수돗가 꼭지를 1분 틀면 물이 6 L 나와요. 쓴 물의 양은 물을 튼 시간의 6배예요.", "칸막이는 분리수거함 사이에만 있어요. 칸막이의 수는 분리수거함의 수보다 1개 더 적어요."],
      render: (b, a) => cr3Do(b, a, { eq: [
        { title: "수돗가 (꼭지를 1분 틀면 물 6 L)", pick: true, vars: [{ name: "물을 튼 시간(분)", v: [1, 2, 3, 4] }, { name: "쓴 물의 양(L)", v: [6, 12, 18, 24] }], need: 1, ans: ["예) ☆=□×6 (□: 시간, ☆: 물의 양)"] },
        { title: "분리수거함과 칸막이 (수거함 사이에만 칸막이)", pick: true, fig: cr3Pic("bins", 3, "분리수거함 3개, 칸막이 2개", 180), vars: [{ name: "분리수거함의 수", v: [1, 2, 3, 4, 5] }, { name: "칸막이의 수", v: [0, 1, 2, 3, 4] }], need: 1, ans: ["예) △=□−1 (□: 분리수거함, △: 칸막이)"] }],
        ok: "내가 고른 기호로 대응 관계를 식으로 나타냈어요." }) },
    { name: "약속하기 — 친구의 식과 견주기", inst: "탐사대 친구들이 수돗가의 대응 관계를 서로 다른 식으로 나타냈어요. 식을 견주어 보고, 우유 상자의 대응 관계도 식으로 나타내 보세요.", hints: ["표의 수를 넣어 보면 두 식 모두 등호 양쪽이 같아요.", "우유의 수는 우유 상자의 수의 10배예요."],
      render: (b, a) => cr3Do(b, a, { promise: "같은 대응 관계라도 어떤 기호를 쓰는지, 무엇을 기준으로 하는지에 따라 식이 달라질 수 있어요. □, △ 말고도 ○, ☆, ♡, ◇ 같은 여러 가지 기호를 쓸 수 있어요.",
        choose: [{ q: "태오는 ☆=□×6, 하린이는 ♡=◇×6으로 나타냈어요. (□, ◇는 물을 튼 시간, ☆, ♡는 쓴 물의 양) 어떻게 생각하나요?", o: ["두 식 모두 맞아요. 기호만 다르게 하여 같은 대응 관계를 나타냈어요.", "□와 △만 쓸 수 있으니 하린이의 식은 틀렸어요.", "두 식 모두 틀렸어요."], a: 0, why: { "1": "대응 관계를 식으로 나타낼 때는 ○, ☆, ♡, ◇처럼 여러 가지 기호를 쓸 수 있어요.", "2": "표의 수를 넣어 보면 두 식 모두 맞아요." } },
          { q: "준서는 같은 관계를 □=☆÷6으로 나타냈어요. (□는 물을 튼 시간, ☆는 쓴 물의 양) 어떻게 생각하나요?", o: ["맞아요. 쓴 물의 양을 기준으로 하여 나눗셈식으로 나타냈어요.", "틀렸어요. 곱셈식으로만 나타낼 수 있어요."], a: 0, why: { "1": "☆가 18이면 □는 18÷6=3이에요. 기준을 바꾸면 나눗셈식으로도 나타낼 수 있어요." } }],
        eq: { title: "우유 상자의 수를 □, 우유의 수를 ○라고 할 때 (상자 1개에 우유 10팩)", vars: [{ s: "□", name: "우유 상자의 수", v: [1, 2, 3, 4] }, { s: "○", name: "우유의 수", v: [10, 20, 30, 40] }], need: 1, ans: ["○=□×10", "□=○÷10"] },
        ok: "기호나 기준이 달라도 같은 대응 관계를 나타낼 수 있어요. 우유 상자는 ○=□×10 또는 □=○÷10이에요." }) },
    { name: "확인하기 — 우리 주변 대응 관계", inst: "급식실 의자 1개에는 다리가 4개 있어요. 기호를 골라 식으로 나타내고, 우리 집이나 학교에서 찾은 대응 관계도 하나 써 보세요.", hints: ["의자 다리의 수는 의자의 수의 4배예요.", "곱셈식뿐 아니라 덧셈식·뺄셈식으로 나타나는 대응 관계도 찾아봐요(예: 나이, 사이사이에 놓인 것)."],
      render: (b, a) => { cr3Do(b, a, { eq: { title: "급식실 의자의 수와 의자 다리의 수", pick: true, vars: [{ name: "의자의 수", v: [1, 2, 3, 4] }, { name: "의자 다리의 수", v: [4, 8, 12, 16] }], need: 1, ans: ["예) ○=□×4 (□: 의자, ○: 의자 다리)"] },
        ok: "의자 다리의 수는 의자의 수의 4배예요." });
        writeStep(b, a, [{ q: "우리 집이나 학교에서 찾은 대응 관계를 두 양, 관계, 기호 식으로 써 보세요.", tag: "내가 찾은 대응 관계", ph: "예) 두 양: ~의 수와 ~의 수 / 관계: ~ / 식: ~", help: ["① 짝을 이루어 함께 변하는 두 양을 정해요. → ② 관계를 말로 쓰고 → ③ 기호를 정해 식으로 써요.", "‘~의 수(□)와 ~의 수(△): △는 □의 ~배(□에 ~를 더한 것)이므로 △=□×~(△=□+~)’ 꼴로 써요."], ans: "횡단보도의 흰 줄의 수(□)와 그 사이 검은 줄의 수(△): 흰 줄 사이에만 검은 줄이 있으므로 △=□−1이에요." }]); } }
  ],
  challenge: { inst: "급식 우유 상자 1개에 우유가 10팩씩 들어 있어요. 또, 수돗가 꼭지를 1분 틀면 물이 6 L 나와요. 기호를 사용하여 식으로 나타내고 물음에 답해 보세요.", hints: ["우유의 수는 우유 상자의 수의 10배예요. 상자의 수는 우유의 수를 10으로 나눈 것이에요.", "쓴 물의 양은 물을 튼 시간의 6배예요."],
    render: (b, a) => cr3Do(b, a, {
      eq: [{ title: "물을 튼 시간(분)을 ◇, 쓴 물의 양(L)을 ○라고 할 때", vars: [{ s: "◇", name: "물을 튼 시간", v: [1, 2, 3, 4] }, { s: "○", name: "쓴 물의 양", v: [6, 12, 18, 24] }], need: 1, ans: ["○=◇×6", "◇=○÷6"] }],
      ask: [{ q: "우유 140팩을 담으려면 우유 상자는 몇 개?", a: 14, unit: "개", why: { "130": "140−10이 아니라 140을 10으로 나눠요.", "1400": "상자의 수는 우유의 수를 10으로 나눈 것이에요." } },
        { q: "양치하는 3분 동안 물을 틀어 두면 물은 몇 L 쓰일까요?", a: 18, unit: "L", why: { "9": "3+6이 아니라 6 L씩 3분이에요." } }],
      ok: "○=◇×6이므로 3분이면 18 L예요. 양치할 때 컵을 쓰면 물을 아낄 수 있어요!" }) }
},
{
  id: "s6", no: 6, title: "남긴 음식이 물을 더럽혀요 ― 대응 관계로 문제 해결하기", soop: "개념 구축하기(O)",
  question: "대응 관계를 이용하여 남긴 음식을 깨끗한 물로 만드는 데 필요한 물의 양을 어떻게 구할까요?",
  summary: "우유 1 mL를 깨끗한 물로 만드는 데 물 54 L가 필요해요. 우유의 양을 □, 필요한 물의 양을 △라고 하면 △=□×54이고, 남긴 우유 150 mL에는 150×54=8100(L)의 물이 필요해요. 대응 관계를 식으로 나타내면 양이 바뀌어도 쉽게 구할 수 있어요.",
  steps: [
    { name: "만져 보기 — 문제 이해하기", inst: "초록 탐사대가 ‘급식 남기지 않기’ 캠페인을 준비해요. 태오가 조사한 표를 보면 버려진 음식물은 물을 더럽히고, 이 물을 깨끗하게 하려면 많은 물이 필요해요. “우리 모둠이 오늘 남긴 우유 150 mL를 깨끗한 물로 만드는 데 필요한 물은 몇 L일까?” 문제를 이해해 보세요.", hints: ["문제의 마지막 문장에 구하려는 것이 있어요.", "표에서 우유 칸을 찾아요."],
      render: (b, a) => cr3Do(b, a, { fig: cr3WaterFig,
        choose: [{ q: "구하려는 것은 무엇인가요?", o: ["남긴 우유 150 mL를 깨끗한 물로 만드는 데 필요한 물의 양", "우유 1 mL를 깨끗한 물로 만드는 데 필요한 물의 양", "남긴 우유 150 mL의 무게"], a: 0, why: { "1": "우유 1 mL에 필요한 물의 양은 표에 이미 나와 있어요." } }],
        ask: [{ q: "우유 1 mL를 깨끗한 물로 만드는 데 필요한 물은?", a: 54, unit: "L", why: { "24": "24 L는 콜라예요. 우유 칸을 다시 찾아봐요.", "37": "37 L는 식용유예요. 우유 칸을 다시 찾아봐요." } }],
        ok: "우유 1 mL에 물 54 L가 필요해요. 남긴 우유 150 mL에 필요한 물의 양을 구해요." }) },
    { name: "그려 보기 — 해결 계획 세우기", inst: "준서: “우유가 1 mL, 2 mL, 3 mL, …일 때 필요한 물은 각각 몇 L인지 생각해 볼까?” 어떻게 해결하면 좋을지 골라 보세요.", hints: ["우유의 양과 필요한 물의 양은 짝을 이루어 함께 변해요.", "우유가 2 mL이면 물도 54 L의 2배가 필요해요."],
      render: (b, a) => cr3Do(b, a, { choose: [{ q: "어떤 방법으로 해결하면 좋을까요?", o: ["우유가 1 mL씩 늘어날 때마다 필요한 물이 몇 L씩 늘어나는지 표로 알아보고, 대응 관계를 식으로 나타내요.", "우유 150 mL와 54 L를 더해요.", "우유가 150 mL이니 물도 150 L가 필요하다고 생각해요."], a: 0, why: { "1": "우유의 양과 물의 양은 더하는 관계가 아니에요. 우유 2 mL에 물이 얼마나 필요한지 생각해 봐요.", "2": "우유 1 mL에 물이 1 L가 아니라 54 L 필요해요." } }],
        ok: "표를 만들어 대응 관계를 찾고, 식으로 나타내어 150 mL일 때를 구해요." }) },
    { name: "말해 보기 — 표와 식으로 나타내기", inst: "표를 완성하고, 우유의 양을 □, 필요한 물의 양을 △라고 할 때 대응 관계를 식으로 나타내 보세요.", hints: ["우유가 1 mL씩 늘어날 때마다 물은 54 L씩 늘어나요.", "필요한 물의 양(L)은 우유의 양(mL)의 54배예요. △=□×54"],
      render: (b, a) => cr3Do(b, a, {
        table: { heads: ["우유의 양(mL) □", "필요한 물의 양(L) △"], x: [1, 2, 3, 4], y: [54, 108, 162, 216], by: [1, 2, 3], f: n => 54 * n, w: "4em" },
        say: [["필요한 물의 양(L)은 우유의 양(mL)의 ", { a: 54 }, "배예요."]],
        eq: { vars: [{ s: "□", name: "우유의 양(mL)", v: [1, 2, 3, 4] }, { s: "△", name: "필요한 물의 양(L)", v: [54, 108, 162, 216] }], need: 1, ans: ["△=□×54", "□=△÷54"] },
        ok: "△=□×54 또는 □=△÷54예요." }) },
    { name: "약속하기 — 어림하고 식으로 구하기", inst: "△=□×54를 이용해요. 먼저 남긴 우유 150 mL에 필요한 물이 어느 정도일지 어림해 보고, 실제로 계산해 보세요.", hints: ["150은 100과 200 사이예요. 100×54=5400, 200×54=10800이에요.", "△=□×54에서 □ 자리에 150을 넣어 150×54를 계산해요."],
      render: (b, a) => predictCheck(b, a, { ask: "남긴 우유 150 mL에 필요한 물은 어느 정도일까요?", o: ["약 200 L", "약 8000 L", "약 80000 L"], a: 1, then: "△=□×54에 □=150을 넣어 실제로 계산해 보세요. 필요한 물은 몇 L인가요?", real: 8100, unit: "L", why: "150×54=8100이에요. 우리 모둠이 남긴 우유 한 컵을 깨끗하게 하는 데 큰 물탱크 하나만큼의 물이 필요해요." }) },
    { name: "확인하기 — 다른 음식물도 구하고 되돌아보기", inst: "민아가 다른 음식물도 궁금해했어요. 표를 보고 필요한 물의 양을 구한 뒤, 문제를 해결한 과정을 되돌아보세요.", hints: ["콜라는 1 mL에 24 L, 식용유는 37 L, 라면 국물은 7 L예요.", "필요한 물의 양은 음식물의 양에 1 mL당 필요한 물의 양을 곱해요."],
      render: (b, a) => { cr3Do(b, a, { fig: cr3WaterFig,
        ask: [{ q: "콜라 250 mL에 필요한 물은?", a: 6000, unit: "L", why: { "274": "250+24가 아니라 250×24를 계산해요.", "600": "250×24를 다시 계산해 봐요. 25×24=600이니 250×24는?" } },
          { q: "식용유 20 mL에 필요한 물은?", a: 740, unit: "L", why: { "57": "20+37이 아니라 20×37을 계산해요." } },
          { q: "라면 국물 400 mL에 필요한 물은?", a: 2800, unit: "L", why: { "407": "400+7이 아니라 400×7을 계산해요." } }],
        ok: "콜라 250 mL에는 6000 L, 식용유 20 mL에는 740 L, 라면 국물 400 mL에는 2800 L의 물이 필요해요." });
        writeStep(b, a, [
          { q: "문제를 해결한 방법을 설명해 보세요.", tag: "방법", ph: "예) 표를 만들어 대응 관계를 찾고 식으로 나타낸 뒤 ~", help: ["① 표로 무엇을 알아냈는지 써요. → ② 어떤 식을 세웠는지 → ③ 식에 어떤 수를 넣었는지 써요.", "‘표에서 ~배인 관계를 찾아 △=□×~로 나타내고, □에 ~을 넣어 ~ L를 구했어요.’ 꼴로 써요."], ans: "표에서 필요한 물의 양이 우유의 양의 54배인 관계를 찾아 △=□×54로 나타내고, □에 150을 넣어 150×54=8100(L)를 구했어요." },
          { q: "물을 지키기 위해 우리 동아리가 할 수 있는 일을 써 보세요.", tag: "실천", ph: "예) 먹을 만큼만 받아서 ~", help: ["① 오늘 구한 물의 양을 떠올려요. → ② 급식이나 집에서 할 수 있는 일을 정해요.", "‘~하면 물을 ~ L나 아낄 수 있으니 ~하겠어요.’ 꼴로 써요."], ans: "급식을 먹을 만큼만 받아 남기지 않겠어요. 우유 150 mL만 남겨도 물이 8100 L나 필요하니까요. 라면 국물도 하수구에 버리지 않을게요." }]); } }
  ],
  challenge: { inst: "조건을 바꾸어 풀어 보세요.", hints: ["1 L는 1000 mL예요. 1000×54를 계산해요.", "남긴 우유 150 mL와 콜라 250 mL에 필요한 물의 양을 각각 구해 차를 구해요."],
    render: (b, a) => numbers(b, a, [
      { q: "우유 1 L(=1000 mL)를 깨끗한 물로 만드는 데 필요한 물은 몇 L?", a: 54000, unit: "L", why: { "54": "54 L는 우유 1 mL에 필요한 물이에요. 1 L는 1000 mL예요." } },
      { q: "남긴 우유 150 mL에는 콜라 250 mL보다 물이 몇 L 더 필요한가요?", a: 2100, unit: "L", why: { "30": "54−24는 1 mL일 때의 차예요. 150 mL와 250 mL일 때를 각각 구해요.", "14100": "두 양의 합이 아니라 차를 구해요." } }],
      { ok: "대응 관계를 식으로 나타내면 조건이 바뀌어도 쉽게 구할 수 있어요." }) }
},
{
  id: "s7", no: 7, title: "탐사 노트 정리하기", soop: "탐구 정리하기(O)",
  question: "지금까지 찾은 대응 관계를 표와 기호 식으로 정리할 수 있나요?",
  summary: "두 양 사이의 대응 관계를 표에서 찾아 말로 설명하고, □, △ 같은 기호를 사용하여 곱셈식·나눗셈식 또는 덧셈식·뺄셈식으로 나타내요. 식을 이용하면 표에 없는 큰 수일 때도 쉽게 구할 수 있어요.",
  steps: [
    { name: "만져 보기 — 탐사 노트 ① 교실 전등", inst: "태오의 탐사 노트 첫 장이에요. 전등 줄을 늘려 가며 형광등을 세고, 대응 관계를 찾아보세요.", hints: ["전등 1줄에 형광등이 몇 개인지 세어 봐요.", "1줄 → 3개, 2줄 → 6개, 3줄 → 9개"],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "lamp", n0: 1, max: 4, need: 3, count: true, countName: "형광등", label: n => `전등 ${n}줄`, h: 140 },
        say: [["형광등의 수는 전등 줄의 수의 ", { a: 3 }, "배예요."], ["전등 줄의 수는 형광등의 수를 ", { a: 3 }, "으로 나눈 것과 같아요."]],
        ok: "전등 1줄에 형광등이 3개이므로 형광등의 수는 전등 줄의 수의 3배예요." }) },
    { name: "그려 보기 — 탐사 노트 ② 우유 상자", inst: "급식 우유 상자 1개에 우유가 10팩씩 들어 있어요. 표를 완성하고, 상자의 수를 □, 우유의 수를 ☆라고 할 때 식으로 나타낸 뒤 물음에 답해 보세요.", hints: ["우유의 수는 상자의 수의 10배예요.", "☆=□×10에서 □에 8을 넣어요."],
      render: (b, a) => cr3Do(b, a, { fig: cr3Pic("milk", 2, "상자 1개에 우유 10팩"),
        table: { heads: ["우유 상자의 수(개)", "우유의 수(팩)"], x: [1, 2, 3, 4], y: [10, 20, 30, 40], bx: [2], by: [1, 3], f: n => 10 * n },
        eq: { vars: [{ s: "□", name: "우유 상자의 수", v: [1, 2, 3, 4] }, { s: "☆", name: "우유의 수", v: [10, 20, 30, 40] }], need: 1, ans: ["☆=□×10", "□=☆÷10"] },
        ask: [{ q: "우유 상자 8개에 들어 있는 우유는 모두 몇 팩?", a: 80, unit: "팩", why: { "18": "8+10이 아니라 10팩씩 8상자예요." } }],
        ok: "☆=□×10 또는 □=☆÷10이고, 상자 8개에는 우유가 80팩 들어 있어요." }) },
    { name: "말해 보기 — 탐사 노트 ③ 병뚜껑 아트", inst: "하린이가 병뚜껑으로 육각형 판과 삼각형 판을 번갈아 이어 붙여요. 육각형 사이와 양 끝에 삼각형이 있어요. 육각형을 늘려 가며 삼각형을 세고, 표를 완성한 뒤 식으로 나타내 보세요.", hints: ["삼각형은 육각형 사이와 양 끝에 있어서 육각형보다 1개 더 많아요.", "△=□+1에서 △가 35이면 □는 35−1이에요."],
      render: (b, a) => cr3Do(b, a, { scene: { kind: "hextri", n0: 1, max: 5, need: 4, count: true, countName: "삼각형", label: n => `육각형 ${n}개` },
        table: { heads: ["육각형의 수(개)", "삼각형의 수(개)"], x: [1, 2, 3, 4, 5], y: [2, 3, 4, 5, 6], bx: [2], by: [1, 3, 4], f: n => n + 1 },
        eq: { title: "육각형의 수를 □, 삼각형의 수를 △라고 할 때", vars: [{ s: "□", name: "육각형의 수", v: [1, 2, 3, 4, 5] }, { s: "△", name: "삼각형의 수", v: [2, 3, 4, 5, 6] }], need: 1, ans: ["△=□+1", "□=△−1"] },
        ask: [{ q: "삼각형이 35개일 때 육각형은 몇 개?", a: 34, unit: "개", why: { "36": "35에 1을 더하면 안 돼요. 육각형이 삼각형보다 1개 더 적어요." } }],
        ok: "△=□+1 또는 □=△−1이에요. 삼각형이 35개이면 육각형은 35−1=34(개)예요." }) },
    { name: "약속하기 — 탐사 노트 정리", inst: "모둠과 친구, 울타리 판과 말뚝을 떠올리며 빈칸을 채워 정리해 보세요.", hints: ["한 모둠은 5명이에요.", "판 사이와 양 끝에 말뚝이 있어서 말뚝은 판보다 1개 더 많아요."],
      render: (b, a) => cr3Do(b, a, { say: [
        ["모둠 친구의 수는 모둠의 수의 ", { a: 5 }, "배예요. → (모둠 친구의 수)=(모둠의 수)×", { a: 5 }],
        ["모둠의 수는 모둠 친구의 수를 5로 나눈 것과 같아요. → (모둠의 수)=(모둠 친구의 수)÷5"],
        ["말뚝의 수는 울타리 판의 수에 1을 더한 것과 같아요. → (말뚝의 수)=(울타리 판의 수)+1"],
        ["울타리 판의 수는 말뚝의 수에서 ", { a: 1 }, "을 뺀 것과 같아요. → (울타리 판의 수)=(말뚝의 수)−", { a: 1 }]],
        ok: "곱의 관계는 곱셈식·나눗셈식으로, 합(차)의 관계는 덧셈식·뺄셈식으로 나타내요." }) },
    { name: "확인하기 — 식에 맞는 상황", inst: "대응 관계를 나타낸 식 ○=△×6에 알맞은 상황을 모두 찾아보세요.", hints: ["○는 △의 6배예요. △가 1일 때 ○가 6인 상황을 찾아요.", "기호가 나타내는 양을 바꾸어 쓰지 않았는지 살펴봐요."],
      render: (b, a) => cr3Do(b, a, { choose: [{ q: "○=△×6에 알맞은 상황을 모두 고르세요.", o: ["캔을 모은 날수(△)와 모은 캔의 수(○) — 하루 6개씩", "곤충의 수(△)와 곤충 다리의 수(○)", "모은 캔의 수(△)와 캔을 모은 날수(○) — 하루 6개씩", "의자의 수(△)와 의자 다리의 수(○) — 의자 1개에 다리 4개", "육각형의 수(△)와 육각형 변의 수(○)"], a: [0, 1, 4] }],
        ok: "하루 6개씩 모은 캔, 곤충 다리, 육각형의 변은 모두 하나에 6개씩이에요. 기호가 나타내는 양을 바꾸어 쓰면 다른 식이 돼요." }) }
  ],
  challenge: { inst: "탐사에서 만난 두 양과 대응 관계를 나타낸 식을 이어 보세요. 왼쪽 두 양에서 앞의 양이 □, 뒤의 양이 △예요.", hints: ["페트병 한 묶음은 4개, 하루에 캔 6개예요.", "말뚝은 판보다 1개 더 많고, 칸막이는 분리수거함보다 1개 더 적어요."],
    render: (b, a) => cr3Do(b, a, { link: { lt: "두 양 (□, △)", rt: "식", left: ["페트병 묶음의 수와 페트병의 수", "울타리 판의 수와 말뚝의 수", "분리수거함의 수와 칸막이의 수", "캔을 모은 날수와 모은 캔의 수"], right: ["△=□+1", "△=□×6", "△=□×4", "△=□−1"], pairs: [2, 0, 3, 1] },
      ok: "대응 관계를 기호를 사용한 식으로 나타내면 두 양 사이의 관계를 간단하고 분명하게 알 수 있어요." }) }
},
{
  id: "s8", no: 8, title: "자신만만 대응 관계 놀이", soop: "발표하기(P)",
  question: "놀이 카드에서 두 양 사이의 대응 관계를 찾아 기호를 사용하여 식으로 나타낼 수 있나요?",
  summary: "캠페인에서 만난 두 양으로 놀이 카드를 만들었어요. 카드를 뒤집어 카드에 정해진 기호로 식을 세워요. 식이 맞으면 1점, 카드를 뒤집은 사람은 주사위를 던져 홀수이면 1점, 짝수이면 2점을 더 얻어요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알기", inst: "윤서가 캠페인에서 만난 두 양으로 놀이 카드를 만들었어요. 놀이 방법을 차례대로 눌러 보세요.", hints: ["카드를 섞어 쌓아 두고 순서를 정한 뒤에 카드를 뒤집어요.", "점수의 합이 가장 높은 사람이 이겨요."],
      render: (b, a) => sequence(b, a, ["카드를 보고 두 양 사이의 대응 관계를 기호를 사용하여 각자 식으로 나타내요", "카드를 섞어 뒤집어 쌓아 두고 가위바위보로 순서를 정해요", "남은 카드가 없을 때까지 반복하고, 점수의 합이 가장 높은 사람이 이겨요", "자기 차례에 카드 한 장을 뒤집어 내려놓아요", "식이 맞은 사람은 1점, 카드를 뒤집은 사람은 주사위를 던져 점수를 더 얻어요"], [1, 3, 0, 4, 2],
        { ok: "섞어 쌓기 → 카드 뒤집기 → 식 세우기 → 점수 얻기 → 반복하기 순서예요." }) },
    { name: "그려 보기 — 규칙 살펴보기", inst: "놀이에서 주의할 점과 점수 얻는 방법을 알아봐요.", hints: ["카드에 기호가 정해져 있어요.", "주사위 눈이 짝수(2, 4, 6)이면 2점을 더 얻어요."],
      render: (b, a) => cr3Do(b, a, {
        choose: [{ q: "페트병 카드: 페트병 묶음의 수(□)와 페트병의 수(△), 한 묶음에 페트병이 4개예요. 맞는 식을 모두 고르세요.", o: ["△=□×4", "□=△÷4", "△=□+4", "□=△×4"], a: [0, 1] },
          { q: "식이 맞고, 내가 카드를 뒤집었는데 주사위 눈이 6이 나왔어요. 이 카드에서 얻은 점수는?", o: ["1점", "2점", "3점"], a: 2, why: { "0": "카드를 뒤집은 사람은 주사위 점수를 더 얻어요.", "1": "식이 맞아서 얻은 1점에 주사위 점수를 더해요." } }],
        ok: "카드에 정해진 기호를 잘 살펴보고, 식은 기준에 따라 두 가지로 나타낼 수 있어요. 6은 짝수라서 1+2=3(점)이에요." }) },
    { name: "말해 보기 — 놀이하기", inst: "카드를 한 장씩 뒤집어 대응 관계를 식으로 나타내 보세요. 식이 맞으면 주사위를 던져 점수를 더 얻어요. 친구와 함께 할 때는 각자 공책에 식을 써요.", hints: ["카드에 적힌 기호를 그대로 써요.", "그림 속 하나에 몇 개씩 있는지, 또는 몇 개 더 많은지 먼저 세어 봐요."],
      render: (b, a) => cr3Game(b, a, {}) },
    { name: "약속하기 — 또 다른 놀이", inst: "민아가 문제를 냈어요. “내 식은 ○=△×8이야. 알맞은 상황을 찾아봐!” 식에 알맞은 상황을 골라 보세요.", hints: ["○는 △의 8배예요. 1개에 8개씩 있는 것을 떠올려요.", "△가 1일 때 ○가 8이 되어야 해요."],
      render: thenWhy((b, a) => cr3Do(b, a, { fig: cr3Pic("octopus", 2, "문어 1마리에 다리 8개"),
        choose: [{ q: "○=△×8에 알맞은 상황은?", o: ["문어의 수(△)와 문어 다리의 수(○)", "문어 다리의 수(△)와 문어의 수(○)", "나이가 8살 차이 나는 형(○)과 동생(△)"], a: 0, why: { "1": "△와 ○를 바꾸어 썼어요. △가 1이면 ○는 8이 되어야 해요.", "2": "8살 차이는 ○=△+8로 나타내요." } }],
        ok: "문어 1마리에 다리가 8개이므로 ○=△×8이에요." }),
        { q: "‘문어 다리의 수(△)와 문어의 수(○)’가 답이 될 수 없는 까닭은 무엇일까요?", ph: "△가 8이면 ○는 ~", help: ["① △에 문어 다리의 수 8을 넣어 ○를 계산해 봐요. → ② 그 값이 문어의 수와 같은지 살펴봐요.", "‘△가 8이면 ○=8×8=~이 되는데, 문어는 ~마리이므로 맞지 않아요.’ 꼴로 써요."], ans: "△가 문어 다리의 수 8이면 ○=8×8=64가 되는데, 문어는 1마리뿐이므로 맞지 않아요. 기호가 나타내는 양을 바꾸면 식도 바뀌어요." }) },
    { name: "확인하기 — 놀이 돌아보기", inst: "놀이를 하며 알게 된 것을 정리해 보세요.", hints: ["카드마다 기호가 정해져 있었어요.", "캠페인에서 만난 다른 두 양으로 새 카드를 만들어 봐요."],
      render: (b, a) => writeStep(b, a, [
        { q: "놀이에서 식을 세울 때 주의할 점은 무엇인가요?", tag: "주의할 점", ph: "예) 카드에 정해진 기호가 어떤 양을 나타내는지 ~", help: ["① 놀이에서 헷갈렸던 점을 떠올려요. → ② 다음에는 어떻게 할지 써요.", "‘~와 ~ 기호가 각각 무엇을 나타내는지 확인하고 식을 세워요.’ 꼴로 써요."], ans: "카드에 정해진 기호가 각각 어떤 양을 나타내는지 확인하고 식을 세워요. 표의 수를 식에 넣어 등호 양쪽이 같은지 확인해요." },
        { q: "놀이 카드에 넣고 싶은 새로운 대응 관계를 써 보세요.", tag: "새 카드", ph: "예) 거미의 수(□)와 거미 다리의 수(△): △=□×8", help: ["① 짝을 이루어 함께 변하는 두 양을 정하고 기호를 붙여요. → ② 관계를 식으로 써요.", "‘~의 수(□)와 ~의 수(△): △=□×~’ 꼴로 써요."], ans: "세발자전거의 수(□)와 바퀴의 수(△): 세발자전거 1대에 바퀴가 3개이므로 △=□×3이에요." }]) }
  ],
  challenge: { inst: "또 다른 놀이에서 하린이가 식 ☆=◇+2를 냈어요. 알맞은 상황을 모두 골라 보세요.", hints: ["☆는 ◇보다 2만큼 커요.", "게시판 테두리의 사각형의 수(◇)와 삼각형의 수(☆)를 떠올려요(3차시)."],
    render: (b, a) => cr3Do(b, a, { choose: [{ q: "☆=◇+2에 알맞은 상황을 모두 고르세요.", o: ["사각형의 수(◇)와 삼각형의 수(☆) — 3차시 게시판 테두리", "동생의 나이(◇)와 2살 많은 형의 나이(☆)", "모둠의 수(◇)와 모둠 친구의 수(☆)", "형의 나이(◇)와 2살 적은 동생의 나이(☆)"], a: [0, 1] }],
      ok: "☆가 ◇보다 2만큼 큰 상황이에요. 모둠 친구의 수는 ☆=◇×5로 나타내요." }) }
},
{
  id: "s9", no: 9, title: "우리가 만든 대응 관계 문제 발표회", soop: "발표하기(P)",
  question: "생활 속 대응 관계로 문제를 만들어 친구에게 설명할 수 있나요?",
  summary: "초록 탐사대는 생활 속에서 짝을 이루어 함께 변하는 두 양을 찾아 대응 관계 카드를 만들고 발표했어요. 두 양을 정하고, 표를 만들고, 기호를 정해 식 두 가지로 나타내면 친구도 쉽게 이해할 수 있어요. 대응 관계를 식으로 나타내면 간단하고 편리해요.",
  steps: [
    { name: "만져 보기 — 친구의 카드 풀기", inst: "태오가 만든 문제 카드예요. “동아리 텃밭 화분 1개에 상추 모종을 3포기씩 심어요. 화분의 수를 □, 상추 모종의 수를 △라고 할 때 대응 관계를 식 두 가지로 나타내고, 모종 27포기를 심으려면 화분이 몇 개 필요한지 구해 보세요.”", hints: ["△=□×3, 기준을 바꾸면 □=△÷3이에요.", "□=△÷3에서 △에 27을 넣어요."],
      render: (b, a) => cr3Do(b, a, {
        table: { heads: ["화분의 수(개) □", "상추 모종의 수(포기) △"], x: [1, 2, 3, 4], y: [3, 6, 9, 12], f: n => 3 * n },
        eq: { vars: [{ s: "□", name: "화분의 수", v: [1, 2, 3, 4] }, { s: "△", name: "상추 모종의 수", v: [3, 6, 9, 12] }], need: 2, ans: ["△=□×3", "□=△÷3"] },
        ask: [{ q: "상추 모종 27포기를 심으려면 화분은 몇 개?", a: 9, unit: "개", why: { "81": "화분의 수는 모종의 수를 3으로 나눈 것이에요. 곱하면 안 돼요.", "24": "27−3이 아니라 27÷3이에요." } }],
        ok: "△=□×3 또는 □=△÷3이고, 모종 27포기에는 화분 27÷3=9(개)가 필요해요." }) },
    { name: "그려 보기 — 내 대응 관계 카드 만들기", inst: "이제 내가 문제를 만들 차례예요. ① 짝을 이루어 함께 변하는 두 양과 관계를 정하고, ② 표를 채우고, ③ 기호를 골라 식 두 가지로 나타내요. 모두 채우면 저절로 확인해요.", hints: ["예) 화분의 수와 상추 모종의 수 → 둘째 양 = 첫째 양 × 3", "덧셈·뺄셈 관계도 좋아요. 예) 윤서의 나이와 언니의 나이 → 둘째 양 = 첫째 양 + 4"],
      render: (b, a) => cr3sMake(b, a, { ok: "나만의 대응 관계 카드를 만들었어요! 표와 식이 내가 정한 관계에 꼭 맞아요." }) },
    { name: "말해 보기 — 발표 원고 쓰기", inst: "발표회에서 내 카드를 소개할 원고를 써 보세요.", hints: ["두 양 → 관계 → 표 → 식 차례로 말하면 듣는 친구가 이해하기 쉬워요.", "식이 두 가지인 까닭도 함께 말해요."],
      render: (b, a) => writeStep(b, a, [
        { q: "내 카드의 두 양과 대응 관계를 소개해 보세요.", tag: "카드 소개", ph: "예) 제 카드의 두 양은 ~와 ~예요. ~이 1씩 늘어날 때마다 ~", help: ["① 두 양의 이름 → ② 한 양이 늘 때 다른 양이 어떻게 변하는지 → ③ 관계를 말해요.", "‘제 카드의 두 양은 ~와 ~예요. ~은 ~의 ~배(~에 ~를 더한 것)예요.’ 꼴로 써요."], ans: "제 카드의 두 양은 화분의 수와 상추 모종의 수예요. 화분이 1개씩 늘어날 때마다 모종은 3포기씩 늘어나요. 모종의 수는 화분의 수의 3배예요." },
        { q: "식을 두 가지로 나타낸 까닭을 설명해 보세요.", tag: "식이 두 가지인 까닭", ph: "예) 무엇을 기준으로 하느냐에 따라 ~", help: ["① 내가 쓴 두 식을 떠올려요. → ② 각 식이 무엇을 구하는 식인지 말해요.", "‘△=~는 ~를 구할 때, □=~는 ~를 구할 때 써요.’ 꼴로 써요."], ans: "△=□×3은 화분의 수로 모종의 수를 구할 때, □=△÷3은 모종의 수로 화분의 수를 구할 때 써요. 기준이 달라서 식이 두 가지예요." }]) },
    { name: "약속하기 — 친구의 식 살펴보기", inst: "발표회에서 준서가 카드를 소개했어요. “책꽂이 한 칸에 책을 12권씩 꽂아요. 칸의 수를 □, 책의 수를 △라고 하면 △=□+12예요.” 친구의 식을 살펴보세요.", hints: ["□에 1, 2를 넣어 △가 12, 24가 되는지 확인해요.", "12권씩 묶음이 늘어나는 관계는 몇 배인 관계예요."],
      render: thenWhy((b, a) => cr3Do(b, a, {
        table: { heads: ["책꽂이 칸의 수(칸) □", "책의 수(권) △"], x: [1, 2, 3], y: [12, 24, 36], by: [1, 2], f: n => 12 * n },
        choose: [{ q: "준서의 식 △=□+12를 어떻게 고치면 좋을까요?", o: ["△=□×12로 고쳐요. 책의 수는 칸의 수의 12배예요.", "고치지 않아도 돼요. 칸이 1일 때 책이 13권이에요.", "□=△+12로 고쳐요."], a: 0, why: { "1": "칸이 1일 때 책은 13권이 아니라 12권이에요. 표의 수를 넣어 확인해 봐요.", "2": "칸의 수가 책의 수보다 커지게 돼요. 표의 수를 넣어 확인해 봐요." } }],
        ok: "책의 수는 칸의 수의 12배이므로 △=□×12 또는 □=△÷12로 나타내요." }),
        { q: "친구의 식이 맞는지 확인하는 방법을 써 볼까요?", ph: "표의 수를 식에 넣어 ~", help: ["① 표에서 짝을 이루는 두 수를 골라요. → ② 식의 기호 자리에 넣어 등호 양쪽이 같은지 봐요.", "‘□에 ~, △에 ~를 넣으면 ~이므로 식이 (맞아요/틀려요).’ 꼴로 써요."], ans: "표의 수를 식에 넣어 봐요. □에 2, △에 24를 넣으면 2+12=14로 24와 같지 않으므로 △=□+12는 틀렸어요. 2×12=24이므로 △=□×12가 맞아요." }) },
    { name: "확인하기 — 처음 궁금증 돌아보기", inst: "1차시에 붙인 ‘궁금해요’ 쪽지를 다시 보고, 탐사를 마무리하는 글을 써 보세요.", hints: ["궁금했던 것을 이제 표나 식으로 답할 수 있는지 살펴봐요.", "식으로 나타내서 편리했던 순간을 떠올려요."],
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "1차시에 궁금했던 것 하나에 이제 답해 보세요.", tag: "궁금증에 답하기", ph: "예) 캔을 30일 동안 모으면 ~", help: ["① 궁금했던 것을 하나 골라요. → ② 두 양의 대응 관계를 식으로 쓰고 → ③ 답을 구해요.", "‘~이 궁금했어요. ~=~×~이므로 ~예요.’ 꼴로 써요."], ans: "캔을 30일 동안 모으면 몇 개인지 궁금했어요. 모은 날수를 □, 캔의 수를 △라고 하면 △=□×6이므로 30×6=180(개)예요." },
        { q: "대응 관계를 기호를 사용한 식으로 나타내면 좋은 점은 무엇인가요?", tag: "좋은 점", ph: "예) 식으로 나타내면 ~", help: ["① 표로만 구할 때와 식으로 구할 때를 견주어요. → ② 식이 편리했던 예를 함께 써요.", "‘식으로 나타내면 ~할 수 있어요. 예를 들어 ~’ 꼴로 써요."], ans: "식으로 나타내면 두 양 사이의 관계를 짧고 분명하게 나타낼 수 있어요. 예를 들어 △=□+1을 알면 울타리 판이 100개일 때 말뚝이 101개인 것을 표를 끝까지 만들지 않아도 바로 알 수 있어요." }])) }
  ],
  challenge: { inst: "윤서가 낸 마지막 퀴즈예요. 식을 보고 물음에 답해 보세요.", hints: ["○=☆−3에서 ☆ 자리에 50을 넣어요.", "♡=◇÷5에서 ♡가 9이면 ◇는 9의 5배예요."],
    render: (b, a) => cr3Do(b, a, {
      ask: [{ q: "○=☆−3에서 ☆가 50일 때 ○는?", a: 47, why: { "53": "○=☆−3이므로 50에서 3을 빼요." } },
        { q: "♡=◇÷5에서 ♡가 9일 때 ◇는?", a: 45, why: { "14": "◇÷5=9가 되는 수를 찾아요. 9+5가 아니에요.", "4": "◇를 5로 나누면 9예요. ◇는 9의 5배예요." } },
        { q: "△=□×12에서 △가 96일 때 □는?", a: 8, why: { "84": "□×12=96이 되는 수를 찾아요. 96÷12를 계산해요." } }],
      ok: "식을 알면 한 양만 알아도 다른 양을 바로 구할 수 있어요. 초록 탐사대의 대응 관계 탐사 끝!" }) }
}
];
