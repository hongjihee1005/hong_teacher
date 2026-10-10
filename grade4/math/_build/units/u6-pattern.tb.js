//@@APP
const APP={title:"수리수리 수학 나라 규칙과 관계", unit:"4-1 수학 6. 규칙과 관계(교과서)", key:"t41-pattern-v1", welcome:"수리수리 수학 나라 규칙과 관계 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 하진이와 지혜, 현우가 수학 가상 세계의 네 섬을 탐험하며 수와 도형, 계산식의 배열에서 규칙을 찾고 크기가 같은 두 양을 등호로 나타내요."};
//@@UNIT
/* ===== 4-1 수학 6. 규칙과 관계 — 단원 조작 부품 (앞글자 r6) =====
   r6Grid    수 배열표·나선: 수를 차례로 눌러 줄을 긋고(방향 자동) 규칙 문장 완성, 빈칸 채우기
   r6EqWrite 이웃한 두 수로 규칙을 식으로 쓰기(계산·이웃·방향·규칙을 모두 따져 채점)
   r6Shape   도형의 배열: 개수·식 빈칸, 다음 모양을 판에 직접 놓기
   r6Seq     계산식의 배열: 변하는 수 표시, 다음 식 추측, 계산기로 확인
   r6Balance 저울: 모양 조각을 덜어 내어 수평 만들기 · r6Judge 등호 식 참/거짓
   r6Plate   초콜릿 접시 · r6Match 내 짝을 찾아라(카드) · r6Coins 동전 옮기기 · r6EqFill 문제 카드 완성
   그림은 모두 수에서 계산해 그려요. 지도서 그림이 없는 배열은 답에 맞게 다시 만든 것(복원)이에요. */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.r6fig svg,.r6stage svg{width:100%;height:auto;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:12px}
.r6stage svg{max-height:62vh}
.r6fig{margin:.3em 0}
.r6cap{font-family:"Jua";color:var(--night);margin:.2em 0 0;text-align:center;word-break:keep-all}
.r6side{min-width:0}
.r6task{font-family:"Jua";color:var(--night);word-break:keep-all}
.r6run{font-size:var(--fs-s);color:var(--muted);word-break:keep-all}
.r6rule{display:flex;flex-wrap:wrap;gap:.3em;align-items:center;word-break:keep-all}
.r6in{width:5.2em;text-align:center;font-size:1em;padding:.15em;max-width:100%}
.r6kinds{display:flex;flex-wrap:wrap;gap:.3em}
.r6kinds button,.r6btn{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.2em .6em;word-break:keep-all}
.r6kinds button.r6pick,.r6btn.r6pick{background:var(--night);color:#fff;border-color:var(--night)}
.r6row{display:flex;flex-wrap:wrap;gap:.4em;align-items:center}
.r6q{font-family:"Jua";margin-top:.5em;word-break:keep-all}
.r6opts{display:flex;flex-wrap:wrap;gap:.35em;margin:.25em 0}
.r6figs{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:.5em;align-items:end;margin:.3em 0}
.r6figs>div{min-width:0;text-align:center}
.r6figs svg{width:100%;height:auto;display:block;background:#FBFCFB;border:2px solid var(--line);border-radius:10px}
.r6figs input{width:100%;max-width:10em;text-align:center;font-size:1em;margin-top:.2em}
.r6val{font-family:"Jua";font-size:1.1em;margin-top:.15em;word-break:keep-all}
.r6tbl{max-width:100%;overflow-x:auto;margin:.3em 0 .7em}
.r6tbl table{border-collapse:collapse;background:#fff}
.r6tbl td,.r6tbl th{padding:.25em .35em;text-align:right;white-space:nowrap;border-bottom:1px dashed var(--line)}
.r6tbl th{font-weight:normal;color:var(--muted);text-align:center;font-size:var(--fs-s);border-bottom:2px solid var(--line);white-space:normal;word-break:keep-all}
.r6tbl td.r6lab{text-align:left;font-family:"Jua";color:var(--night)}
.r6tbl td.r6op{text-align:center;color:var(--muted);padding:.25em .1em}
.r6tbl input{width:var(--w,5em);text-align:right;font-size:1em;padding:.1em}
.r6tok{border:2px dashed #C9D6D1;background:#fff;border-radius:.4em;padding:0 .3em;font:inherit}
.r6tok.r6mk{background:#FFE9C7;border:2px solid #E47A38}
.r6calc{border:2px dashed var(--line);border-radius:12px;padding:.5em .7em;background:#FBFCFB;margin:.4em 0}
.r6calc input{width:12em;max-width:100%;font-size:1.05em}
.r6calcout{font-family:"Jua";font-size:1.15em;color:var(--night);word-break:break-all}
.r6keys{display:flex;flex-wrap:wrap;gap:.3em;margin:.3em 0}
.r6keys button{min-width:2.4em;border:2px solid var(--line);background:#fff;border-radius:.5em;font-size:1.05em;padding:.1em .4em}
.r6eqrow{display:flex;flex-wrap:wrap;gap:.35em;align-items:center;margin:.3em 0;word-break:keep-all}
.r6eqrow input.r6eqin{width:11em;max-width:100%;font-size:1.05em}
.r6gridc{display:grid;grid-template-columns:repeat(var(--c),minmax(0,1fr));gap:.45em;margin:.4em 0}
.r6mc{min-height:3.2em;border:2px solid var(--line);border-radius:.7em;background:#fff;font-family:"Jua";font-size:1.1em;word-break:keep-all;padding:.2em;min-width:0}
.r6mc.r6back{background:#DCEAFB;color:#2B7BD6;border-color:#9DC0EA}
.r6mc.r6up{background:#FFF1D6;border-color:#E47A38}
.r6mc.r6got{background:#E3F4EA;border-color:var(--ok);color:#2E6B47}
.r6list{display:flex;flex-wrap:wrap;gap:.3em .9em;font-family:"Jua";color:#2E6B47;margin:.3em 0}
.r6pool{display:flex;flex-wrap:wrap;gap:.4em;min-height:2.6em;margin:.4em 0}
.r6bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:.6em}
.r6bin{border:2px dashed var(--line);border-radius:12px;padding:.5em;min-height:6em;cursor:pointer;background:#FBFCFB}
.r6bint{font-family:"Jua";color:var(--night);margin-bottom:.3em}
.r6chip{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.3em .6em;text-align:left;word-break:keep-all;max-width:100%}
.r6bin .r6chip{display:block;width:100%;margin:.25em 0}
.r6chip.r6pick{border-color:#2B7BD6;background:#DCEAFB}
.r6chip.r6good{border-color:var(--ok);background:#E3F4EA}
.r6chip.r6bad{border-color:var(--no);background:#FBE7E2}
.r6muted{color:var(--muted);font-size:var(--fs-s)}
.r6tile{display:flex;flex-direction:column;align-items:center;gap:.1em;border:2px solid var(--line);background:#fff;border-radius:.7em;padding:.35em .2em;min-width:0}
.r6tile b{font-family:"Jua";font-size:1.25em}
.r6tile.r6pick{background:#FFE9C7;border-color:#E47A38}
.r6jrow{display:flex;flex-wrap:wrap;gap:.35em;align-items:center;padding:.3em .4em;border-radius:.6em;border:2px solid transparent}
.r6jrow.r6cur{border-color:#2B7BD6;background:#F2F7FD}
.r6jrow b{font-family:"Jua";font-size:1.15em;min-width:6.5em}
.r6probs p{margin:.25em 0;font-family:"Jua";word-break:keep-all}
`;
  document.head.append(s);
})();
let r6Uid = 0;
const R6ORD = ["", "첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째", "일곱째", "여덟째", "아홉째", "열째"];
const R6DIR = { "0,1": "→", "0,-1": "←", "1,0": "↓", "-1,0": "↑", "-1,1": "↗", "1,-1": "↙", "1,1": "↘", "-1,-1": "↖" };
const R6LAY = ["#F6C85F", "#7FB8E6", "#9ED39A", "#F2A0A0", "#C5A5E8", "#F7B27A", "#8FD3D0"];

/* 받침 있는 말 뒤 조사: r6J("36", "이/가") → "36이" */
function r6Jong(w) {
  if (/[\u3260-\u326D\u3131-\u314E★]$/.test(String(w))) return true;   // ㉠(기역)·ㄱ·★(별)
  const s = String(w).replace(/[^가-힣A-Za-z0-9]+$/, "");
  const c = s.charCodeAt(s.length - 1);
  if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 !== 0;
  if (/[0-9]$/.test(s)) { if (/0$/.test(s)) return true; return /[013678]$/.test(s); }   // 영·일·삼·육·칠·팔 / 십·백·천
  return false;
}
function r6J(w, pair) { const [a, b] = pair.split("/"); return w + (r6Jong(w) ? a : b); }
/* 식 글자 정리: 띄어쓰기·쉼표를 빼고 기호를 한 가지로 */
function r6Norm(s) { return String(s).replace(/\s+/g, "").replace(/,/g, "").replace(/[xX*✕✖]/g, "×").replace(/[\/:]/g, "÷").replace(/[−–—]/g, "-").replace(/＝/g, "=").replace(/＋/g, "+"); }
function r6Show(s) { return String(s).replace(/-/g, "−"); }
/* + − × ÷ 식의 값(곱셈·나눗셈 먼저). 잘못된 식이면 NaN */
function r6Eval(e) {
  const s = r6Norm(e), t = s.match(/\d+|[+\-×÷]/g);
  if (!t || t.join("") !== s || t.length % 2 === 0) return NaN;
  const nums = [], ops = [];
  for (let i = 0; i < t.length; i++) { if (i % 2 === 0) { if (!/^\d+$/.test(t[i])) return NaN; nums.push(+t[i]); } else { if (/^\d+$/.test(t[i])) return NaN; ops.push(t[i]); } }
  const n2 = [nums[0]], o2 = [];
  ops.forEach((o, i) => { if (o === "×") n2[n2.length - 1] *= nums[i + 1]; else if (o === "÷") n2[n2.length - 1] /= nums[i + 1]; else { o2.push(o); n2.push(nums[i + 1]); } });
  return o2.reduce((acc, o, i) => o === "+" ? acc + n2[i + 1] : acc - n2[i + 1], n2[0]);
}
function r6Insert(inp, k) {
  const s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, e = inp.selectionEnd == null ? s : inp.selectionEnd;
  inp.value = inp.value.slice(0, s) + k + inp.value.slice(e); inp.focus();
  try { inp.setSelectionRange(s + k.length, s + k.length); } catch (_) {}
  inp.dispatchEvent(new Event("input"));
}
function r6Cols(rows) { return rows[0].map((_, c) => rows.map(r => r[c])); }
/* 이웃한 수들의 규칙: 차가 일정(up/down) · 몇 배(times) · 몇분의 1(part) */
function r6RulesOf(v) {
  const out = [];
  if (v.length < 2 || v.some(x => typeof x !== "number")) return out;
  const d = v[1] - v[0];
  if (d && v.every((x, i) => !i || x - v[i - 1] === d)) out.push(d > 0 ? { kind: "up", k: d } : { kind: "down", k: -d });
  if (v[0] && v[1] % v[0] === 0 && v[1] / v[0] >= 2) { const k = v[1] / v[0]; if (v.every((x, i) => !i || x === v[i - 1] * k)) out.push({ kind: "times", k }); }
  if (v[1] && v[0] % v[1] === 0 && v[0] / v[1] >= 2) { const k = v[0] / v[1]; if (v.every((x, i) => !i || x * k === v[i - 1])) out.push({ kind: "part", k }); }
  return out;
}
const R6KIND = { up: k => `${k}씩 커져요`, down: k => `${k}씩 작아져요`, times: k => `${k}배가 돼요`, part: k => `1/${k}만큼이 돼요` };
const R6KBTN = [["up", "씩 커져요"], ["down", "씩 작아져요"], ["times", "배가 돼요"], ["part", "분의 1만큼이 돼요"]];
function r6DirPhrase(d) { return { "→": "가로(→) 방향으로", "↓": "세로(↓) 방향으로", "나선": "나선을 따라", "나선 거꾸로": "나선을 거꾸로 따라" }[d] || `${d} 방향으로`; }

/* ---------- 고르기·수 쓰기 묶음(부품 안에서 함께 채점) ---------- */
function r6Choose(items) {
  const el = h("div"), st = items.map(() => null), rows = [];
  items.forEach((it, i) => {
    const row = h("div", { class: "r6opts" });
    it.o.forEach((o, k) => row.append(h("button", { class: "opt", onclick: e => { [...row.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); st[i] = k; } }, o)));
    rows.push(row); el.append(h("div", { class: "r6q" }, it.q), row);
  });
  return {
    el, given: () => st.map((v, i) => v == null ? "-" : items[i].o[v]).join(" / "),
    answers: () => items.map(it => it.o[it.a]),
    check() {
      for (let i = 0; i < items.length; i++) {
        const it = items[i], btns = rows[i].children;
        if (st[i] == null) return "아직 고르지 않은 물음이 있어요. 알맞은 것을 골라요.";
        if (st[i] !== it.a) { btns[st[i]].classList.add("bad"); return (it.why && it.why[st[i]]) || "빨간 칸을 다시 생각해 봐요."; }
        btns[st[i]].classList.add("good");
      }
      return null;
    }
  };
}
function r6Nums(items) {
  const rows = items.map(it => {
    const inp = h("input", { type: "text", inputmode: "numeric", class: "r6in", "aria-label": it.q, autocomplete: "off" });
    return { it, inp, el: h("div", { class: "r6eqrow" }, h("span", { class: "jua" }, it.q), inp, it.unit ? h("span", {}, it.unit) : null) };
  });
  return {
    el: h("div", {}, rows.map(r => r.el)),
    given: () => rows.map(r => r.inp.value.trim() || "-").join(", "),
    answers: () => items.map(it => `${it.a}${it.unit || ""}`),
    check() {
      for (const { it, inp } of rows) {
        const raw = r6Norm(inp.value), v = Number(raw), good = raw !== "" && v === it.a;
        inp.style.borderColor = good ? "var(--ok)" : "var(--no)";
        if (!good) return (it.why && it.why[String(v)]) || (raw === "" ? "빈칸을 모두 채워요." : `‘${it.q}’의 답을 다시 생각해 봐요.`);
      }
      return null;
    }
  };
}
function r6Extra(opt) {   // 부품 아래쪽 공통 묶음: nums(수 쓰기) + choose(고르기)
  const N = opt.nums ? r6Nums(opt.nums) : null, C = opt.choose ? r6Choose(opt.choose) : null;
  return { N, C, els: [N && N.el, C && C.el].filter(Boolean),
    check: () => (N && N.check()) || (C && C.check()) || null,
    given: () => [N && N.given(), C && C.given()].filter(Boolean).join(" / "),
    answers: () => [...(N ? N.answers() : []), ...(C ? C.answers() : [])] };
}

/* ---------- 수 배열표·나선 ---------- */
function r6GridModel(rows) {
  const R = rows.length, C = Math.max(...rows.map(r => r.length)), pts = [], id = {};
  rows.forEach((row, r) => row.forEach((v, c) => {
    if (v === undefined || v === "") return;
    const p = { r, c, i: pts.length };
    if (v !== null && typeof v === "object") { p.a = v.a; p.lab = v.lab || "□"; p.v = null; } else p.v = v;
    id[r + "," + c] = p.i; pts.push(p);
  }));
  const maxLen = Math.max(3, ...pts.map(p => String(p.v != null ? p.v : p.a).length));
  const cw = Math.max(72, maxLen * 15 + 30), ch = 58, pad = 8;
  pts.forEach(p => { p.x = pad + p.c * cw + cw / 2; p.y = pad + p.r * ch + ch / 2; p.w = cw - 10; p.h = ch - 12; });
  const lines = [];
  for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [-1, 1]]) pts.forEach(p => {
    if (id[(p.r - dr) + "," + (p.c - dc)] != null) return;
    const ids = []; let r = p.r, c = p.c;
    while (id[r + "," + c] != null) { ids.push(id[r + "," + c]); r += dr; c += dc; }
    if (ids.length >= 2) { lines.push({ ids, dir: R6DIR[dr + "," + dc] }); lines.push({ ids: ids.slice().reverse(), dir: R6DIR[(-dr) + "," + (-dc)] }); }
  });
  return { pts, lines, id, W: C * cw + pad * 2, H: R * ch + pad * 2, fs: 22 };
}
/* 나선: 2, 4, 6, 8이 가운데에서 → ↓ ← ↑ 순서로 돌고, 갈래마다 바깥으로 한 칸씩 (복원) */
function r6SpiralModel(vals) {
  const S = 64, V = [[1, 0], [0, 1], [-1, 0], [0, -1]], D = ["→", "↓", "←", "↑"], pts = [];
  vals.forEach((v, i) => {
    const k = Math.floor(i / 4), j = i % 4, rad = S * (0.95 + k + j / 4);
    const p = { i, k, j, rad, x: V[j][0] * rad, y: V[j][1] * rad, round: true, w: 52, h: 52 };
    if (v !== null && typeof v === "object") { p.a = v.a; p.lab = v.lab || "□"; p.v = null; } else p.v = v;
    pts.push(p);
  });
  const pad = 40, minX = Math.min(...pts.map(p => p.x)) - pad, minY = Math.min(...pts.map(p => p.y)) - pad;
  pts.forEach(p => { p.x -= minX; p.y -= minY; });
  const W = Math.max(...pts.map(p => p.x)) + pad, H = Math.max(...pts.map(p => p.y)) + pad;
  const lines = [];
  for (let j = 0; j < 4; j++) { const ids = pts.filter(p => p.j === j).map(p => p.i); lines.push({ ids, dir: D[j] }); lines.push({ ids: ids.slice().reverse(), dir: D[(j + 2) % 4] }); }
  const all = pts.map(p => p.i);
  lines.push({ ids: all, dir: "나선" }); lines.push({ ids: all.slice().reverse(), dir: "나선 거꾸로" });
  let path = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) { const r = (pts[i - 1].rad + pts[i].rad) / 2; path += ` A${r} ${r} 0 0 1 ${pts[i].x} ${pts[i].y}`; }
  return { pts, lines, id: {}, W, H, fs: 21, path };
}
function r6RunOf(M, sel) {
  if (sel.length < 2) return null;
  for (const L of M.lines) { const k = L.ids.indexOf(sel[0]); if (k < 0) continue; if (sel.every((s, j) => L.ids[k + j] === s)) return L; }
  return null;
}
function r6Marker(svg, col) {
  const id = "r6m" + (++r6Uid);
  let defs = svg.querySelector("defs"); if (!defs) { defs = svgEl("defs"); svg.append(defs); }
  const m = svgEl("marker", { id, viewBox: "0 0 10 10", refX: 7, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto-start-reverse" });
  m.append(svgEl("path", { d: "M0 0 L10 5 L0 10 Z", fill: col })); defs.append(m);
  return id;
}
function r6Arrows(svg, M, ids, col, w) {
  const mk = r6Marker(svg, col);
  for (let i = 0; i + 1 < ids.length; i++) {
    const a = M.pts[ids[i]], b = M.pts[ids[i + 1]], d = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / d, uy = (b.y - a.y) / d;
    const sh = Math.min(16, d / 4);
    svg.append(svgEl("line", { x1: a.x + ux * sh, y1: a.y + uy * sh, x2: b.x - ux * sh, y2: b.y - uy * sh, stroke: col, "stroke-width": w, "stroke-linecap": "round", opacity: .6, "marker-end": `url(#${mk})` }));
  }
}
function r6Paint(svg, M, st, onTap) {
  svg.innerHTML = "";
  if (M.path) svg.append(svgEl("path", { d: M.path, fill: "none", stroke: "#CFDCD7", "stroke-width": 7, "stroke-linecap": "round" }));
  const sel = st.sel || [];
  M.pts.forEach(p => {
    const on = sel.includes(p.i), blank = p.v == null;
    const attrs = { fill: on ? "#DCEAFB" : blank ? "#FFF8E8" : "#fff", stroke: on ? "#2B7BD6" : blank ? "#E47A38" : "#9AA9A3", "stroke-width": on ? 3 : 1.6 };
    if (blank) attrs["stroke-dasharray"] = "6 4";
    const shape = p.round ? svgEl("circle", Object.assign({ cx: p.x, cy: p.y, r: p.w / 2 }, attrs)) : svgEl("rect", Object.assign({ x: p.x - p.w / 2, y: p.y - p.h / 2, width: p.w, height: p.h, rx: 10 }, attrs));
    if (onTap) { shape.style.cursor = "pointer"; shape.addEventListener("click", () => onTap(p.i)); }
    svg.append(shape);
  });
  (st.done || []).forEach(run => r6Arrows(svg, M, run, "#E47A38", 5));
  if (sel.length > 1) r6Arrows(svg, M, sel, "#2B7BD6", 7);
  M.pts.forEach(p => {
    const blank = p.v == null, f = st.fill && st.fill[p.i];
    const t = blank ? (f ? f : p.lab) : String(p.v);
    const el = txt(p.x, p.y + 1, t, String(t).length > 6 ? M.fs - 4 : M.fs, { fill: blank ? (f ? "#2B7BD6" : "#C0601F") : "#1D2A2A", "paint-order": "stroke", stroke: "#fff", "stroke-width": 4, "pointer-events": "none" });
    svg.append(el);
  });
}
function r6BoardFig(M, cap) { const svg = makeSvg(M.W, M.H); r6Paint(svg, M, {}); return h("div", { class: "r6fig" }, svg, cap ? h("p", { class: "r6cap" }, cap) : null); }
function r6GridFig(rows, cap) { return r6BoardFig(r6GridModel(rows), cap); }
function r6SpiralFig(vals, cap) { return r6BoardFig(r6SpiralModel(vals), cap); }
/* 수를 눌러 규칙 찾기 → 빈칸 채우기 → (고르기)
   opt = { rows | spiral, traces:[{start:[행,열]|번호, dir, notDirs, need, say}], nums, choose, ok } */
function r6Grid(body, api, opt) {
  const M = opt.spiral ? r6SpiralModel(opt.spiral) : r6GridModel(opt.rows);
  const tasks = (opt.traces || []).map(t => Object.assign({ need: 3 }, t));
  const blanks = M.pts.filter(p => p.a !== undefined);
  const st = { sel: [], done: [], fill: {} }, log = [];
  let ti = 0, kind = null, kval = "";
  const svg = makeSvg(M.W, M.H); svg.style.touchAction = "manipulation";
  const side = h("div", { class: "side r6side" });
  const X = r6Extra(opt);
  const sIdOf = t => t.start == null ? null : (Array.isArray(t.start) ? M.id[t.start[0] + "," + t.start[1]] : t.start);
  const allowed = (t, dir) => !(t.dir && dir !== t.dir) && !(t.notDirs && t.notDirs.includes(dir)) && !(t.dirs && !t.dirs.includes(dir));
  function expect(t) {
    const sId = sIdOf(t);
    for (const L of M.lines) {
      if (!allowed(t, L.dir)) continue;
      for (let k = 0; k < L.ids.length; k++) {
        if (sId != null && L.ids[k] !== sId) continue;
        const run = []; for (let j = k; j < L.ids.length && M.pts[L.ids[j]].v != null; j++) run.push(L.ids[j]);
        if (run.length < t.need) continue;
        const rs = r6RulesOf(run.map(i => M.pts[i].v));
        if (rs.length) return `${M.pts[run[0]].v}부터 ${r6DirPhrase(L.dir)} ${R6KIND[rs[0].kind](rs[0].k)}`;
      }
    }
    return "";
  }
  const fillEls = blanks.map(p => {
    const inp = h("input", { type: "text", class: "r6in", "aria-label": `${p.lab}에 알맞은 수`, autocomplete: "off", inputmode: typeof p.a === "number" ? "numeric" : "text" });
    inp.addEventListener("input", () => { st.fill[p.i] = inp.value.trim(); paint(); });
    return { p, inp, el: h("div", { class: "r6eqrow" }, h("span", { class: "jua" }, p.lab), inp) };
  });
  const hasFinal = blanks.length > 0 || X.els.length > 0;
  function tap(i) {
    if (ti >= tasks.length) return api.hint(blanks.length ? "이제 빈칸에 알맞은 수를 써요." : "아래 물음에 답해요.");
    const p = M.pts[i];
    if (p.v == null) return api.hint("빈칸은 아직 수를 몰라요. 수가 있는 칸을 눌러요.");
    const k = st.sel.indexOf(i);
    if (k >= 0) st.sel = st.sel.slice(0, k === st.sel.length - 1 ? k : k + 1);
    else {
      const nx = st.sel.concat(i);
      if (!st.sel.length || r6RunOf(M, nx)) st.sel = nx;
      else { st.sel = [i]; api.hint("한 줄로 이웃한 수를 이어서 눌러요. 이 수부터 새로 시작했어요."); }
    }
    paint(); drawSide();
  }
  function paint() { r6Paint(svg, M, st, tap); }
  function drawSide() {
    side.innerHTML = "";
    if (ti < tasks.length) {
      const t = tasks[ti], vals = st.sel.map(i => M.pts[i].v), run = r6RunOf(M, st.sel);
      side.append(h("div", { class: "r6task" }, `${tasks.length > 1 ? (ti + 1) + ". " : ""}${t.say}`));
      side.append(h("div", { class: "r6run" }, vals.length ? "누른 수: " + vals.join(" → ") : "수를 차례로 눌러 줄을 그어요. 마지막 수를 다시 누르면 지워져요."));
      const inp = h("input", { type: "text", inputmode: "numeric", class: "r6in", "aria-label": "몇씩(몇 배)", value: kval, autocomplete: "off" });
      inp.addEventListener("input", () => { kval = inp.value; });
      const kinds = h("div", { class: "r6kinds" }, R6KBTN.map(([k, t2]) => h("button", { class: kind === k ? "r6pick" : "", onclick: e => { kind = k; [...e.currentTarget.parentNode.children].forEach(b => b.classList.toggle("r6pick", b === e.currentTarget)); } }, t2)));
      side.append(h("div", { class: "r6rule" }, h("span", {}, run ? `${vals[0]}부터 ${r6DirPhrase(run.dir)}` : "(시작하는 수)부터 (방향)으로"), inp), kinds);
      side.append(h("div", { class: "r6row" }, h("button", { class: "r6btn", onclick: () => { st.sel = []; paint(); drawSide(); } }, "줄 다시 긋기")));
    } else {
      if (blanks.length) side.append(h("div", { class: "r6task" }, "빈칸에 알맞은 수를 써요."), ...fillEls.map(f => f.el));
      side.append(...X.els);
    }
    side.append(h("button", { class: "big", onclick: check }, "확인하기"));
  }
  function check() {
    api.tryOnce();
    if (ti < tasks.length) {
      const t = tasks[ti], sId = sIdOf(t), vals = st.sel.map(i => M.pts[i].v), giv = `${vals.join("→")} ${kval}${kind ? R6KBTN.find(x => x[0] === kind)[1] : ""}`;
      if (st.sel.length < t.need) return api.fail(`이웃한 수를 ${t.need}개 이상 차례로 눌러 줄을 그어요.`, giv);
      const run = r6RunOf(M, st.sel);
      if (!run) return api.fail("한 줄로 이어진 수를 차례로 눌러요.", giv);
      if (sId != null && st.sel[0] !== sId) return api.fail(`${M.pts[sId].v}부터 시작해요. ‘줄 다시 긋기’를 누르고 다시 해 봐요.`, giv);
      if (!allowed(t, run.dir)) return api.fail(t.dir ? `${r6DirPhrase(t.dir)} 이어지게 눌러요.` : (t.notMsg || "앞에서 찾은 것과 다른 방향으로 찾아요."), giv);
      const rs = r6RulesOf(vals);
      if (!rs.length) return api.fail("이 줄은 일정한 규칙으로 변하지 않아요. 다른 줄을 찾아요.", giv);
      if (!kind) return api.fail("커지는지, 작아지는지, 몇 배가 되는지 골라요.", giv);
      const k = Number(r6Norm(kval));
      if (!kval.trim() || !(k > 0)) return api.fail("몇씩(몇 배) 변하는지 수를 써요.", giv);
      if (!rs.find(r => r.kind === kind && r.k === k)) {
        const r0 = rs[0], add = x => x === "up" || x === "down";
        if (r0.kind === kind) return api.fail(add(kind) ? "커지고 작아지는 것은 맞아요. 이웃한 두 수의 차를 다시 구해 봐요." : "몇 배인지(몇분의 1인지) 다시 구해 봐요. 이웃한 두 수를 견주어요.", giv);
        if (add(r0.kind) && add(kind)) return api.fail("고른 방향으로 갈수록 수가 커지는지 작아지는지 다시 살펴봐요.", giv);
        if (!add(r0.kind) && add(kind)) return api.fail("이웃한 두 수의 차가 일정하지 않아요. 몇 배가 되는지, 몇분의 1이 되는지 살펴봐요.", giv);
        if (add(r0.kind) && !add(kind)) return api.fail("몇 배가 되는 규칙이 아니에요. 이웃한 두 수의 차를 구해 봐요.", giv);
        return api.fail("고른 방향으로 갈수록 수가 커지는지 작아지는지 다시 살펴봐요.", giv);
      }
      const good = rs.find(r => r.kind === kind && r.k === k), sent = `${vals[0]}부터 ${r6DirPhrase(run.dir)} ${R6KIND[good.kind](good.k)}`;
      log.push(sent); st.done.push(st.sel.slice()); st.sel = []; kind = null; kval = ""; ti++;
      if (ti < tasks.length || hasFinal) { paint(); drawSide(); return api.hint(`○ ${sent}. ${ti < tasks.length ? "다음 규칙도 찾아요." : "이제 아래 물음을 해결해요."}`); }
      return api.done(log.join(" / "), opt.ok || `${sent}. 규칙을 잘 찾았어요!`);
    }
    for (const f of fillEls) {
      const raw = f.inp.value.trim(), good = typeof f.p.a === "number" ? (raw !== "" && Number(r6Norm(raw)) === f.p.a) : r6Norm(raw) === r6Norm(f.p.a);
      f.inp.style.borderColor = good ? "var(--ok)" : "var(--no)";
      if (!good) return api.fail(raw === "" ? "빈칸을 모두 채워요." : (opt.fillWhy && opt.fillWhy[f.p.lab]) || `${r6J(f.p.lab, "은/는")} 규칙을 이용해 이웃한 수에서 구해 봐요.`, fillEls.map(x => x.inp.value || "-").join(", "));
    }
    const bad = X.check();
    if (bad) return api.fail(bad, X.given());
    log.push(fillEls.map(f => `${f.p.lab} ${f.inp.value.trim()}`).join(", "));
    api.done(log.filter(Boolean).join(" / "), opt.ok);
  }
  api.provide({ words: opt.words || ["시작하는 수", "방향", "커져요", "작아져요", "몇 배", "이웃한 두 수"],
    answers: tasks.map(expect).concat(blanks.length ? [blanks.map(p => `${p.lab} ${p.a}`).join(", ")] : [], X.answers()).filter(Boolean) });
  paint(); drawSide();
  body.append(h("div", { class: "panel" }, h("div", { class: "stage r6stage" }, svg), side));
}

/* ---------- 이웃한 두 수로 식 쓰기 ---------- */
function r6Pairs(seqs, both) {
  const out = [];
  (both ? seqs.concat(seqs.map(s => s.slice().reverse())) : seqs).forEach(sq => {
    const rs = r6RulesOf(sq); if (!rs.length) return;
    const r = rs[0], op = { up: "+", down: "-", times: "×", part: "÷" }[r.kind];
    for (let i = 0; i + 1 < sq.length; i++) out.push({ a: sq[i], c: sq[i + 1], op, k: r.k });
  });
  return out;
}
const R6OPNAME = { "+": "덧셈식", "-": "뺄셈식", "×": "곱셈식", "÷": "나눗셈식" };
function r6EqKeys(getInp) {
  return h("div", { class: "r6keys" }, h("span", { class: "r6muted" }, "기호 넣기"), ["+", "−", "×", "÷", "="].map(k => h("button", { onmousedown: e => e.preventDefault(), onclick: () => r6Insert(getInp(), k) }, k)));
}
/* opt = { fig, rules:[{q, seqs:[[…]], both, need}], choose, ok } */
function r6EqWrite(body, api, opt) {
  if (opt.fig) body.append(opt.fig());
  let focus = null; const groups = [];
  opt.rules.forEach(rule => {
    const pairs = r6Pairs(rule.seqs, rule.both), ins = [];
    const box = h("div", { class: "qitem" }, h("div", { class: "jua" }, rule.q));
    for (let n = 0; n < (rule.need || 2); n++) {
      const inp = h("input", { type: "text", class: "r6eqin", "aria-label": `${rule.q} 식 ${n + 1}`, placeholder: "□ ○ □ = □", autocomplete: "off" });
      inp.addEventListener("focus", () => { focus = inp; });
      ins.push(inp); box.append(h("div", { class: "r6eqrow" }, h("span", {}, `식 ${n + 1}`), inp));
    }
    groups.push({ rule, pairs, ins }); body.append(box);
  });
  body.append(r6EqKeys(() => focus || groups[0].ins[0]));
  const C = opt.choose ? r6Choose(opt.choose) : null;
  if (C) body.append(C.el);
  const sample = g => g.pairs.slice(0, g.rule.need || 2).map(p => `${p.a}${r6Show(p.op)}${p.k}=${p.c}`);
  api.provide({ words: ["이웃한 두 수", "덧셈식", "뺄셈식", "곱셈식", "나눗셈식"], answers: groups.flatMap(sample).concat(C ? C.answers() : []) });
  function judge(g, s) {
    if (!s) return "빈칸에 식을 써요.";
    if (/^\d+=\d+$/.test(s)) return "43=43처럼 등호만 쓰면 규칙이 드러나지 않아요. 몇씩(몇 배) 변하는지 + − × ÷ 기호를 써서 나타내요.";
    const m = s.match(/^(\d+)([+\-×÷])(\d+)=(\d+)$/);
    if (!m) return "‘45+2=47’처럼 (수)(기호)(수)=(수)의 꼴로 써요.";
    const a = +m[1], op = m[2], b = +m[3], c = +m[4], val = r6Eval(`${a}${op}${b}`);
    if (val !== c) return Number.isInteger(val) ? `계산이 맞지 않아요. ${r6J(`${a}${r6Show(op)}${b}`, "은/는")} ${r6J(String(val), "이에요/예요")}.` : `${r6J(`${a}÷${b}`, "은/는")} 나누어떨어지지 않아요. 계산을 다시 해 봐요.`;
    const fit = g.pairs.find(p => p.op === op && p.k === b && p.a === a && p.c === c) || (op === "×" && g.pairs.find(p => p.op === "×" && p.k === a && p.a === b && p.c === c));
    if (fit) return null;
    const p0 = g.pairs.find(p => p.a === a && p.c === c) || (op === "×" && g.pairs.find(p => p.a === b && p.c === c));
    if (p0) return `계산은 맞지만 이 방향의 규칙이 드러나지 않아요. ${{ "+": `${p0.k}씩 커지는`, "-": `${p0.k}씩 작아지는`, "×": `${p0.k}배가 되는`, "÷": `1/${p0.k}만큼이 되는` }[p0.op]} 규칙이니 ${R6OPNAME[p0.op]}으로 나타내요.`;
    if (g.pairs.find(p => p.a === c && p.c === a)) return "방향을 거꾸로 썼어요. 정한 방향으로 앞에 있는 수에서 시작해 다음 수가 되는 식을 써요.";
    return "계산은 맞지만 배열에서 이웃한 두 수가 아니에요. 한 방향을 정하고 이웃한 두 수로 식을 써요.";
  }
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = groups.map(g => g.ins.map(i => i.value.trim() || "-").join(", ")).join(" / ");
    for (const g of groups) {
      const seen = new Set();
      for (const inp of g.ins) {
        const s = r6Norm(inp.value), bad = judge(g, s) || (seen.has(s) ? "같은 식을 두 번 썼어요. 다른 이웃한 두 수로 써요." : null);
        inp.style.borderColor = bad ? "var(--no)" : "var(--ok)";
        if (bad) return api.fail(bad, given);
        seen.add(s);
      }
    }
    const cb = C && C.check();
    if (cb) return api.fail(cb, given + " / " + C.given());
    api.done(given, opt.ok || "규칙에 맞게 이웃한 두 수로 식을 썼어요! 식은 한 가지만 있는 것이 아니에요.");
  } }, "확인하기")));
}

/* ---------- 도형의 배열 ---------- */
const R6GEN = {
  rect2: n => { const a = []; for (let r = 0; r < 2; r++) for (let c = 0; c < n; c++) a.push([r, c]); return a; },          // 2줄 직사각형 (복원)
  tri: n => { const a = []; for (let r = 0; r < n; r++) for (let c = 0; c <= r; c++) a.push([r, c]); return a; },            // 1, 3, 6, 10 (삼각형·계단)
  ell: n => { const a = []; for (let r = 0; r < n; r++) a.push([r, 0]); for (let c = 1; c < n; c++) a.push([n - 1, c]); return a; },   // ㄴ 모양 1, 3, 5, 7
  gamma: n => { const a = []; for (let c = 0; c < n; c++) a.push([0, c]); for (let r = 1; r < n; r++) a.push([r, 0]); return a; },     // 아래쪽과 오른쪽으로 1개씩
  stair3: n => { const a = [[0, 0], [0, 1]]; for (let k = 1; k < n; k++) for (let c = k - 1; c <= k + 1; c++) a.push([k, c]); return a; },  // 2, 5, 8, 11 (아래쪽으로 3개씩)
  rectM: n => { const a = []; for (let r = 0; r < n; r++) for (let c = 0; c <= n; c++) a.push([r, c]); return a; },         // 가로 n+1 × 세로 n
  coinOdd: n => { const a = []; for (let r = 0; r < n; r++) for (let c = 0; c < 2 * r + 1; c++) a.push([r, c]); return a; } // 1, 3, 5, 7개 줄
};
const R6LAYER = { rectM: (r, c) => Math.max(c, r + 1), tri: r => r + 1, stair3: r => r + 1, coinOdd: r => r + 1 };
function r6N0(cells) { const mr = Math.min(...cells.map(c => c[0])), mc = Math.min(...cells.map(c => c[1])); return cells.map(([r, c]) => [r - mr, c - mc]); }
function r6Key(cells) { return r6N0(cells).map(c => c.join(",")).sort().join(";"); }
function r6Bbox(cells) { const n = r6N0(cells); return { R: Math.max(...n.map(c => c[0])) + 1, C: Math.max(...n.map(c => c[1])) + 1 }; }
function r6Piece(g, kind, x, y, u, col) {
  if (kind === "stone") {
    g.append(svgEl("circle", { cx: x + u / 2, cy: y + u / 2, r: u * .43, fill: "#2B2B2B" }));
    g.append(svgEl("circle", { cx: x + u * .37, cy: y + u * .36, r: u * .1, fill: "#8A8A8A" }));
  } else if (kind === "coin") {
    g.append(svgEl("circle", { cx: x + u / 2, cy: y + u / 2, r: u * .44, fill: "#DADADA", stroke: "#8E8E8E", "stroke-width": 1.5 }));
    g.append(txt(x + u / 2, y + u / 2 + 1, "100", u * .3, { fill: "#555" }));
  } else {
    g.append(svgEl("rect", { x: x + 1, y: y + 1, width: u - 2, height: u - 2, rx: kind === "mod" ? 4 : 2, fill: col || "#F6C85F", stroke: "#7A6233", "stroke-width": 1.5 }));
    if (kind === "mod") g.append(svgEl("rect", { x: x + u * .22, y: y + u * .22, width: u * .56, height: u * .56, rx: 2, fill: "none", stroke: "#fff", "stroke-width": 1.2, opacity: .7 }));
  }
}
function r6ShapeSvg(cells, o) {
  const u = o.u || 30, p = 6, R = o.box.R, C = o.box.C, svg = makeSvg(C * u + p * 2, R * u + p * 2);
  const nc = r6N0(cells), bb = r6Bbox(cells), dy = o.anchor === "top" ? 0 : R - bb.R;
  nc.forEach(([r, c]) => r6Piece(svg, o.kind, p + c * u, p + (r + dy) * u, u, o.layer ? R6LAY[(o.layer(r, c) - 1) % R6LAY.length] : null));
  return svg;
}
function r6QSvg(box, u = 30) { const svg = makeSvg(box.C * u + 12, box.R * u + 12); svg.append(txt((box.C * u + 12) / 2, (box.R * u + 12) / 2, "?", Math.min(60, box.R * u * .6), { fill: "#9AA9A3" })); return svg; }
function r6BoxOf(gen, ns) { return ns.reduce((b, n) => { const bb = r6Bbox(R6GEN[gen](n)); return { R: Math.max(b.R, bb.R), C: Math.max(b.C, bb.C) }; }, { R: 1, C: 1 }); }
function r6ShapeRow(gen, ns, o = {}) {
  const G = R6GEN[gen], all = ns.concat(o.mystery ? [o.mystery] : []), box = r6BoxOf(gen, all);
  const lay = o.layers ? R6LAYER[gen] : null;
  const wrap = h("div", { class: "r6figs", style: `--n:${all.length}` });
  ns.forEach(n => wrap.append(h("div", {}, r6ShapeSvg(G(n), { kind: o.kind || "sq", box, anchor: o.anchor, layer: lay }), h("div", { class: "r6cap" }, R6ORD[n]))));
  if (o.mystery) wrap.append(h("div", {}, r6ShapeSvg(G(o.mystery), { kind: o.kind || "sq", box, anchor: o.anchor, layer: lay }), h("div", { class: "r6cap" }, "다음 모양")));
  return wrap;
}
/* opt = { gen, kind, what:"사각형", items:[{n, cnt:true|"?", expr:"2+3"|{a, alt}, hide}], build:{n, from}, anchor, layers, nums, choose, ok } */
function r6Shape(body, api, opt) {
  const G = R6GEN[opt.gen], kind = opt.kind || "sq", what = opt.what || "사각형", lay = opt.layers ? R6LAYER[opt.gen] : null;
  const shownNs = opt.items.filter(it => !it.hide).map(it => it.n), box = r6BoxOf(opt.gen, shownNs.length ? shownNs : [1]);
  const row = h("div", { class: "r6figs", style: `--n:${opt.items.length}` }), checks = [], answers = [];
  opt.items.forEach(it => {
    const cell = h("div", {}, it.hide ? r6QSvg(box) : r6ShapeSvg(G(it.n), { kind, box, anchor: opt.anchor, layer: lay }), h("div", { class: "r6cap" }, R6ORD[it.n]));
    const cnt = G(it.n).length;
    if (it.cnt === true) cell.append(h("div", { class: "r6val" }, `${cnt}개`));
    else if (it.cnt === "?") {
      const inp = h("input", { type: "text", inputmode: "numeric", "aria-label": `${R6ORD[it.n]} ${what}의 수`, placeholder: "□개", autocomplete: "off" });
      cell.append(inp); answers.push(`${R6ORD[it.n]} ${cnt}개`);
      checks.push(() => { const raw = r6Norm(inp.value).replace(/개$/, ""), good = raw !== "" && Number(raw) === cnt; inp.style.borderColor = good ? "var(--ok)" : "var(--no)"; return good ? null : (raw === "" ? "빈칸을 모두 채워요." : `${R6ORD[it.n]} 모양의 ${r6J(what, "을/를")} 다시 세어 봐요.`); });
    }
    if (typeof it.expr === "string") cell.append(h("div", { class: "r6val" }, r6Show(it.expr)));
    else if (it.expr) {
      const inp = h("input", { type: "text", "aria-label": `${R6ORD[it.n]} 식`, placeholder: "식", autocomplete: "off" });
      inp.addEventListener("focus", () => { focusE = inp; });
      cell.append(inp); answers.push(`${R6ORD[it.n]} ${r6Show(it.expr.a)}`);
      const ok = [it.expr.a].concat(it.expr.alt || []).map(r6Norm);
      const m = r6Norm(it.expr.a).match(/^(\d+)×(\d+)$/); if (m) ok.push(`${m[2]}×${m[1]}`);
      checks.push(() => {
        const s = r6Norm(inp.value), good = ok.includes(s);
        inp.style.borderColor = good ? "var(--ok)" : "var(--no)";
        if (good) return null;
        if (!s) return "빈칸에 식을 써요.";
        if (r6Eval(s) === r6Eval(it.expr.a)) return `${R6ORD[it.n]}의 값은 맞아요. 앞의 식들처럼 규칙이 드러나게 식을 써요.`;
        return `${R6ORD[it.n]}의 식을 다시 생각해 봐요. 앞의 식에서 무엇이 늘어나는지 그림과 견주어 봐요.`;
      });
    }
    row.append(cell);
  });
  let focusE = null;
  body.append(row);
  if (opt.items.some(it => it.expr && typeof it.expr === "object")) body.append(r6EqKeys(() => focusE || row.querySelector("input")));
  // 다음 모양 만들기 판
  let built = null, buildCheck = null;
  if (opt.build) {
    const B = opt.build, target = G(B.n), bb = r6Bbox(target), R = bb.R + 1, C = bb.C + 1, u = 44, pad = 6;
    const svg = makeSvg(C * u + pad * 2, R * u + pad * 2); svg.style.touchAction = "manipulation";
    built = new Set();
    const info = h("div", { class: "readout" });
    const draw = () => {
      svg.innerHTML = "";
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
        const x = pad + c * u, y = pad + r * u;
        if (built.has(r + "," + c)) r6Piece(svg, kind === "mod" ? "mod" : kind, x, y, u, kind === "mod" ? "#9ED39A" : null);
        else if (kind === "stone" || kind === "coin") svg.append(svgEl("circle", { cx: x + u / 2, cy: y + u / 2, r: u * .4, fill: "none", stroke: "#D3DDD9", "stroke-dasharray": "4 4" }));
        else svg.append(svgEl("rect", { x: x + 2, y: y + 2, width: u - 4, height: u - 4, rx: 3, fill: "none", stroke: "#D3DDD9", "stroke-dasharray": "4 4" }));
      }
      info.textContent = `놓은 ${what}: ${built.size}개`;
    };
    svg.addEventListener("click", ev => {
      const p = svgPt(svg, ev), c = Math.floor((p.x - pad) / u), r = Math.floor((p.y - pad) / u);
      if (r < 0 || c < 0 || r >= R || c >= C) return;
      const k = r + "," + c; built.has(k) ? built.delete(k) : built.add(k); draw();
    });
    const side = h("div", { class: "side r6side" }, h("div", { class: "r6task" }, `${R6ORD[B.n]} 모양 만들기`), h("p", { class: "r6muted" }, `칸을 누르면 ${r6J(what, "이/가")} 놓이고, 다시 누르면 빠져요.`), info,
      h("div", { class: "r6row" },
        B.from ? h("button", { class: "r6btn", onclick: () => { built = new Set(G(B.from).map(c => c.join(","))); draw(); } }, `${R6ORD[B.from]} 모양 놓기`) : null,
        h("button", { class: "r6btn", onclick: () => { built = new Set(); draw(); } }, "모두 지우기")));
    draw();
    body.append(h("div", { class: "panel" }, h("div", { class: "stage r6stage" }, svg), side));
    answers.push(`${R6ORD[B.n]} 모양: ${what} ${target.length}개`);
    buildCheck = () => {
      const cells = [...built].map(k => k.split(",").map(Number));
      if (!cells.length) return `판에 ${R6ORD[B.n]} 모양을 만들어요.`;
      if (cells.length !== target.length) return `지금 ${what} ${cells.length}개를 놓았어요. ${B.from ? R6ORD[B.from] + " 모양에서" : "앞의 모양에서"} 몇 개가 어디에 늘어나야 하는지 규칙을 생각해 봐요.`;
      if (r6Key(cells) !== r6Key(target)) return `${what}의 수는 맞아요. 모양이 규칙에 맞게 늘어나도록 놓아요.`;
      return null;
    };
  }
  const X = r6Extra(opt); X.els.forEach(e => body.append(e));
  api.provide({ words: opt.words || ["모양의 변화", "수의 변화", "늘어나요"], answers: answers.concat(X.answers()) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = [...row.querySelectorAll("input")].map(i => i.value.trim() || "-").join(", ") + (built ? ` / 놓은 ${what} ${built.size}개` : "");
    for (const c of checks) { const m = c(); if (m) return api.fail(m, given); }
    if (buildCheck) { const m = buildCheck(); if (m) return api.fail(m, given); }
    const m = X.check(); if (m) return api.fail(m, given + " / " + X.given());
    api.done(given, opt.ok);
  } }, "확인하기")));
}

/* ---------- 계산식의 배열 ---------- */
function r6Tok(e) { return r6Norm(e).match(/\d+|□|[+\-×÷=]/g); }
const R6ISOP = t => /^[+\-×÷=]$/.test(t);
function r6SeqTable(list, st) {
  const toks = list.rows.map(r => r6Tok(r.e)), tb = h("tbody");
  if (list.heads) { const tr = h("tr", {}, h("th", {}, "​")); let ni = 0; toks[0].forEach(t => tr.append(h("th", {}, R6ISOP(t) ? "​" : (list.heads[ni++] || "​")))); tb.append(tr); }
  list.rows.forEach((r, ri) => {
    const tr = h("tr", {}, h("td", { class: "r6lab" }, r.lab || "​"));
    let ni = 0, bi = 0;
    toks[ri].forEach(t => {
      if (R6ISOP(t)) { tr.append(h("td", { class: "r6op" }, r6Show(t))); return; }
      const col = ni++;
      if (t === "□") {
        const a = r.a[bi++], inp = h("input", { type: "text", inputmode: "numeric", "aria-label": `${r.lab || ""} 빈칸`, style: `--w:${String(a).length * .62 + 1.6}em`, autocomplete: "off" });
        st && st.ins.push({ inp, a, row: r }); tr.append(h("td", {}, inp)); return;
      }
      if (st && st.mark) tr.append(h("td", {}, h("button", { class: "r6tok", "data-col": col, onclick: () => st.onMark(col) }, t)));
      else tr.append(h("td", {}, t));
    });
    tb.append(tr);
  });
  return h("div", { class: "r6tbl" }, list.title ? h("div", { class: "r6task" }, list.title) : null, h("table", {}, tb));
}
function r6SeqFig(lists) { return h("div", { class: "r6fig" }, lists.map(L => r6SeqTable(L, null))); }
function r6Changing(list) {
  const cols = []; list.rows.forEach(r => { r6Tok(r.e).filter(t => !R6ISOP(t)).forEach((t, j) => { if (t === "□") return; (cols[j] = cols[j] || new Set()).add(t); }); });
  return cols.map((s, j) => s && s.size > 1 ? j : -1).filter(j => j >= 0);
}
function r6CalcEl() {
  const inp = h("input", { type: "text", "aria-label": "계산기에 식 쓰기", placeholder: "예) 3×9999", autocomplete: "off" });
  const out = h("span", { class: "r6calcout" }, "= ?");
  const go = () => { const v = r6Eval(inp.value); out.textContent = isFinite(v) ? "= " + (Number.isInteger(v) ? v : Math.round(v * 1000) / 1000) : "= 식을 다시 써 봐요"; };
  inp.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
  return h("div", { class: "r6calc" }, h("div", { class: "r6task" }, "계산기로 확인하기"), h("div", { class: "r6row" }, inp, out),
    h("div", { class: "r6keys" }, ["+", "−", "×", "÷"].map(k => h("button", { onmousedown: e => e.preventDefault(), onclick: () => r6Insert(inp, k) }, k)),
      h("button", { onclick: go }, "="), h("button", { onclick: () => { inp.value = ""; out.textContent = "= ?"; } }, "지우기")));
}
/* opt = { lists:[{title, heads, rows:[{lab, e:"88+2=90" | "□+1112=90000", a:[…]}]}], mark, calc, choose, ok } */
function r6Seq(body, api, opt) {
  const ins = [], marks = opt.lists.map(() => new Set());
  opt.lists.forEach((L, li) => {
    let el = null;
    const st = { ins, mark: !!(opt.mark && !L.noMark), onMark: col => { marks[li].has(col) ? marks[li].delete(col) : marks[li].add(col); el.querySelectorAll(".r6tok").forEach(b => b.classList.toggle("r6mk", marks[li].has(+b.dataset.col))); } };
    el = r6SeqTable(L, st); body.append(el);
  });
  if (opt.mark) body.append(h("p", { class: "r6muted" }, "수를 누르면 그 자리(세로 한 줄)가 모두 표시돼요. 다시 누르면 지워져요."));
  if (opt.calc) body.append(r6CalcEl());
  const C = opt.choose ? r6Choose(opt.choose) : null; if (C) body.append(C.el);
  const ans = opt.lists.flatMap(L => L.rows.filter(r => r.a).map(r => { let k = 0; return `${r.lab ? r.lab + " " : ""}${r6Show(r6Norm(r.e).replace(/□/g, () => r.a[k++]))}`; }));
  api.provide({ words: opt.words || ["변하는 수", "변하지 않는 수", "규칙", "추측"], answers: ans.concat(C ? C.answers() : []) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = ins.map(x => x.inp.value.trim() || "-").join(", ");
    if (opt.mark) for (let li = 0; li < opt.lists.length; li++) {
      const L = opt.lists[li]; if (L.noMark) continue;
      const want = r6Changing(L), got = [...marks[li]];
      if (want.some(j => !marks[li].has(j))) return api.fail(`${L.title ? "‘" + L.title + "’에서 " : ""}변하는 수가 있는 자리를 모두 눌러 표시해요.`, given);
      if (got.some(j => !want.includes(j))) return api.fail(`${L.title ? "‘" + L.title + "’에서 " : ""}변하지 않는 수까지 표시했어요. 식마다 같은 수는 표시하지 않아요.`, given);
    }
    for (const x of ins) {
      const raw = r6Norm(x.inp.value), good = raw !== "" && Number(raw) === x.a;
      x.inp.style.borderColor = good ? "var(--ok)" : "var(--no)";
      if (!good) return api.fail(raw === "" ? "빈칸을 모두 채워요." : (x.row.why || `${x.row.lab ? x.row.lab + "의 " : ""}빨간 칸을 다시 추측해 봐요. 앞의 식들에서 변하는 수가 어떻게 변하는지 살펴봐요.`), given);
    }
    const cb = C && C.check(); if (cb) return api.fail(cb, given + " / " + C.given());
    api.done(given + (C ? " / " + C.given() : ""), opt.ok);
  } }, "확인하기")));
}

/* ---------- 저울 ---------- */
function r6Scale(onTap) {
  const W = 660, H = 360, px = 330, py = 96, arm = 230;
  const svg = makeSvg(W, H); svg.style.touchAction = "manipulation";
  let ang = 0, target = 0, sides = [[], []], labels = ["", ""], raf = 0;
  function paint() {
    svg.innerHTML = "";
    svg.append(svgEl("path", { d: `M${px} ${py} L${px - 46} ${H - 26} L${px + 46} ${H - 26} Z`, fill: "#D8C8B6", stroke: "#8C7A68", "stroke-width": 2 }));
    svg.append(svgEl("rect", { x: px - 110, y: H - 28, width: 220, height: 14, rx: 6, fill: "#8C7A68" }));
    const t = ang * Math.PI / 180, ex = Math.cos(t) * arm, ey = Math.sin(t) * arm;
    const E = [{ x: px - ex, y: py - ey }, { x: px + ex, y: py + ey }];
    svg.append(svgEl("line", { x1: E[0].x, y1: E[0].y, x2: E[1].x, y2: E[1].y, stroke: "#6B5A48", "stroke-width": 9, "stroke-linecap": "round" }));
    svg.append(svgEl("circle", { cx: px, cy: py, r: 10, fill: "#6B5A48" }));
    svg.append(svgEl("line", { x1: px, y1: py, x2: px - Math.sin(t) * 46, y2: py + Math.cos(t) * 46, stroke: "#C8472E", "stroke-width": 4, "stroke-linecap": "round" }));
    E.forEach((e, si) => {
      const panY = e.y + 124, pw = 200;
      svg.append(svgEl("line", { x1: e.x, y1: e.y, x2: e.x - pw / 2 + 8, y2: panY, stroke: "#A8977F", "stroke-width": 2 }));
      svg.append(svgEl("line", { x1: e.x, y1: e.y, x2: e.x + pw / 2 - 8, y2: panY, stroke: "#A8977F", "stroke-width": 2 }));
      sides[si].forEach((P, k) => {
        const row = Math.floor(k / 5), col = k % 5, s = 30, x = e.x - 88 + col * 36, y = panY - 4 - (row + 1) * 33;
        const r = svgEl("rect", { x, y, width: s, height: s, rx: 5, fill: P.out ? "none" : P.col, stroke: P.out ? "#B9C4C0" : "#6B5A48", "stroke-width": P.out ? 1.5 : 1.6 });
        if (P.out) r.setAttribute("stroke-dasharray", "4 3");
        svg.append(r);
        if (P.out) { svg.append(svgEl("line", { x1: x + 7, y1: y + 7, x2: x + s - 7, y2: y + s - 7, stroke: "#B9C4C0", "stroke-width": 2 })); svg.append(svgEl("line", { x1: x + s - 7, y1: y + 7, x2: x + 7, y2: y + s - 7, stroke: "#B9C4C0", "stroke-width": 2 })); }
        if (onTap && !P.lock) { const hit = svgEl("rect", { x, y, width: s, height: s, fill: "transparent", style: "cursor:pointer" }); hit.addEventListener("click", () => onTap(si, k)); svg.append(hit); }
      });
      svg.append(svgEl("path", { d: `M${e.x - pw / 2} ${panY} Q${e.x} ${panY + 30} ${e.x + pw / 2} ${panY} Z`, fill: "#E9DCCB", stroke: "#8C7A68", "stroke-width": 2 }));
      svg.append(txt(e.x, panY + 40, labels[si], 22, { fill: "#3B4A47" }));
    });
  }
  const weight = si => sides[si].filter(P => !P.out).length;
  function anim() { ang += (target - ang) * .22; if (Math.abs(target - ang) < .05) { ang = target; raf = 0; paint(); return; } paint(); raf = requestAnimationFrame(anim); }
  return {
    svg, weight,
    set(s, l, animate) {
      sides = s; labels = l; target = Math.max(-12, Math.min(12, (weight(1) - weight(0)) * 2.5));
      if (!animate) { ang = target; paint(); return; }
      if (!raf) raf = requestAnimationFrame(anim);
    },
    state: () => weight(0) === weight(1) ? "수평이에요" : `${weight(0) > weight(1) ? "왼쪽" : "오른쪽"}으로 기울었어요`
  };
}
function r6Pieces(n, col, pre) { return Array.from({ length: n }, (_, k) => ({ col, out: k >= n - (pre || 0), lock: k >= n - (pre || 0) })); }
function r6EqTpl(tpl) {
  const parts = r6Show(tpl).split("□"), inp = h("input", { type: "text", inputmode: "numeric", class: "r6in", "aria-label": "□에 알맞은 수", autocomplete: "off", style: "width:3.2em" });
  const el = h("div", { class: "r6eqrow" }, h("span", { class: "jua" }, "식:"), h("span", { class: "jua" }, parts[0]), inp, h("span", { class: "jua" }, parts[1] || "​"));
  let ans = null; for (let v = 0; v < 100 && ans == null; v++) { const [l, r] = r6Norm(tpl.replace("□", v)).split("="); if (r6Eval(l) === r6Eval(r)) ans = v; }
  return { el, inp, ans };
}
/* opt.tasks = [{L, R, need:{L,R}} | {L, R, pre:{L|R}, eq:"10-2=12-□"}, …], 각 과제에 say·choose */
function r6Balance(body, api, opt) {
  const tasks = opt.tasks, log = []; let ti = 0, sides = null, E = null, C = null;
  const sc = r6Scale((si, k) => { const P = sides[si][k]; P.out = !P.out; sc.set(sides, ["가", "나"], true); info(); });
  const side = h("div", { class: "side r6side" }), infoEl = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const rem = si => sides[si].filter(P => P.out).length;
  function info() { infoEl.textContent = `덜어 낸 조각 ─ 가: ${rem(0)}개, 나: ${rem(1)}개 · 저울이 ${sc.state()}`; }
  function begin() {
    const t = tasks[ti];
    sides = [r6Pieces(t.L, "#F6C85F", t.pre && t.pre.L), r6Pieces(t.R, "#7FB8E6", t.pre && t.pre.R)];
    sc.set(sides, ["가", "나"], false);
    side.innerHTML = "";
    side.append(h("div", { class: "r6task" }, `${tasks.length > 1 ? (ti + 1) + ". " : ""}${t.say}`), h("p", { class: "r6muted" }, "조각을 누르면 덜어 내고, 다시 누르면 다시 올려요."), infoEl);
    E = t.eq ? r6EqTpl(t.eq) : null; if (E) side.append(E.el);
    C = t.choose ? r6Choose(t.choose) : null; if (C) side.append(C.el);
    side.append(h("div", { class: "r6row" }, h("button", { class: "r6btn", onclick: () => { sides.forEach(s => s.forEach(P => { if (!P.lock) P.out = false; })); sc.set(sides, ["가", "나"], true); info(); } }, "처음처럼 올리기")),
      h("button", { class: "big", onclick: check }, "확인하기"));
    info();
  }
  function check() {
    api.tryOnce();
    const t = tasks[ti], rl = rem(0), rr = rem(1), wl = t.L - rl, wr = t.R - rr, giv = `가 ${rl}개, 나 ${rr}개 덜어 냄${E ? ", □=" + (E.inp.value.trim() || "-") : ""}`;
    if (t.need) {
      if (rl !== t.need.L || rr !== t.need.R) return api.fail(`가에서 ${t.need.L}개, 나에서 ${t.need.R}개를 덜어 내요. 지금은 가에서 ${rl}개, 나에서 ${rr}개를 덜어 냈어요.`, giv);
    } else {
      if (t.pre && t.pre.L && rl !== t.pre.L) return api.fail(`가에서는 ${t.pre.L}개만 덜어 내요. 나에서 조각을 덜어 내 수평을 맞춰요.`, giv);
      if (t.pre && t.pre.R && rr !== t.pre.R) return api.fail(`나에서는 ${t.pre.R}개만 덜어 내요. 가에서 조각을 덜어 내 수평을 맞춰요.`, giv);
      if (wl !== wr) return api.fail(`저울이 아직 ${wl > wr ? "가" : "나"} 쪽으로 기울어 있어요. 수평이 되도록 조각을 덜어 내거나 다시 올려요.`, giv);
    }
    if (E) { const v = r6Norm(E.inp.value); E.inp.style.borderColor = v !== "" && +v === E.ans ? "var(--ok)" : "var(--no)"; if (v === "" || +v !== E.ans) return api.fail("□에는 덜어 낸 조각의 수가 들어가요. 등호 양쪽의 크기가 같아지는 수를 써요.", giv); }
    if (C) { const m = C.check(); if (m) return api.fail(m, giv + " / " + C.given()); }
    log.push(E ? r6Show(t.eq.replace("□", E.ans)) : `가 ${rl}개, 나 ${rr}개 덜어 냄`);
    ti++;
    if (ti < tasks.length) { begin(); return api.hint(`○ 맞아요! ${log[log.length - 1]}. 다음 저울을 해결해요.`); }
    api.done(log.join(" / "), opt.ok);
  }
  api.provide({ words: ["수평", "등호(=)", "크기가 같은 두 양"], answers: tasks.map(t => t.eq ? r6Show(t.eq.replace("□", r6EqTpl(t.eq).ans)) : `가에서 ${t.need.L}개, 나에서 ${t.need.R}개`).concat(tasks.flatMap(t => t.choose ? t.choose.map(c => c.o[c.a]) : [])) });
  body.append(h("div", { class: "panel" }, h("div", { class: "stage r6stage" }, sc.svg), side));
  begin();
}
/* 등호 식의 양쪽을 저울 조각으로: a+b는 두 색, a−b는 b개를 덜어 낸 모습 */
function r6Side(expr) {
  const t = r6Norm(expr).match(/\d+|[+\-]/g), P = [], cols = ["#F6C85F", "#E58F8F", "#9ED39A"]; let term = 0;
  const add = (n, col) => { for (let i = 0; i < n; i++) P.push({ col, out: false, lock: true }); };
  add(+t[0], cols[0]);
  for (let i = 1; i < t.length; i += 2) { const n = +t[i + 1]; if (t[i] === "+") add(n, cols[++term % 3]); else { let m = n; for (let k = P.length - 1; k >= 0 && m > 0; k--) if (!P[k].out) { P[k].out = true; m--; } } }
  return P;
}
/* opt = { eqs:[…], why:{번호:"까닭"}, nums, ok } */
function r6Judge(body, api, opt) {
  const sc = r6Scale(null), st = opt.eqs.map(() => null), rows = [];
  const truth = opt.eqs.map(e => { const [l, r] = r6Norm(e).split("="); return r6Eval(l) === r6Eval(r); });
  const cap = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const load = i => {
    const [l, r] = r6Norm(opt.eqs[i]).split("=");
    sc.set([r6Side(l), r6Side(r)], [r6Show(l), r6Show(r)], true);
    rows.forEach((x, k) => x.classList.toggle("r6cur", k === i));
    cap.textContent = `저울에 올린 식: ${r6Show(opt.eqs[i])}`;
  };
  const list = h("div");
  opt.eqs.forEach((e, i) => {
    const bt = h("div", { class: "r6opts" }, ["참(옳아요)", "거짓(옳지 않아요)"].map((o, k) => h("button", { class: "opt", onclick: ev => { [...bt.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); st[i] = k === 0; } }, o)));
    const row = h("div", { class: "r6jrow" }, h("b", {}, r6Show(e)), h("button", { class: "r6btn", onclick: () => load(i) }, "저울에 올리기"), bt);
    rows.push(row); list.append(row);
  });
  const X = r6Extra(opt);
  body.append(h("div", { class: "panel" }, h("div", { class: "stage r6stage" }, sc.svg), h("div", { class: "side r6side" }, cap, h("p", { class: "r6muted" }, "덜어 낸 조각은 점선으로 보여요. 저울이 수평이면 등호 양쪽의 크기가 같아요."))), list, ...X.els);
  load(0);
  api.provide({ words: ["등호(=)", "참", "거짓", "크기가 같은 두 양"], answers: [opt.eqs.map((e, i) => `${r6Show(e)} ${truth[i] ? "참" : "거짓"}`).join(", ")].concat(X.answers()) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = st.map((v, i) => `${opt.eqs[i]}:${v == null ? "-" : v ? "참" : "거짓"}`).join(", ");
    for (let i = 0; i < st.length; i++) {
      const btns = rows[i].querySelectorAll(".opt");
      if (st[i] == null) return api.fail("모든 식에 참인지 거짓인지 골라요.", given);
      const good = st[i] === truth[i]; btns[st[i] ? 0 : 1].classList.add(good ? "good" : "bad");
      if (!good) { load(i); return api.fail((opt.why && opt.why[i]) || `${r6Show(opt.eqs[i])}의 양쪽을 저울에 올려 크기가 같은지 확인해 봐요.`, given); }
    }
    const m = X.check(); if (m) return api.fail(m, given + " / " + X.given());
    api.done(given, opt.ok);
  } }, "확인하기")));
}

/* ---------- 초콜릿 접시 ---------- */
function r6PlateSvg(col, onTap, small) {
  const W = 440, H = 290, svg = makeSvg(W, H);
  svg.append(svgEl("ellipse", { cx: W / 2, cy: H / 2, rx: 205, ry: 132, fill: "#FFF8EC", stroke: "#D9C7A8", "stroke-width": 5 }));
  svg.append(svgEl("ellipse", { cx: W / 2, cy: H / 2, rx: 175, ry: 106, fill: "none", stroke: "#EADBC2", "stroke-width": 3 }));
  col.forEach((c, i) => {
    const r = Math.floor(i / 5), k = i % 5, x = W / 2 + (k - 2) * 62 - 24, y = H / 2 + (r - 1) * 60 - 24;
    const g = svgEl("g", { style: onTap ? "cursor:pointer" : "" });
    g.append(svgEl("rect", { x, y, width: 48, height: 48, rx: 10, fill: c ? "#3B7DD8" : "#D9534F", stroke: c ? "#1F4F99" : "#9B2C29", "stroke-width": 2 }));
    g.append(svgEl("path", { d: `M${x + 10} ${y + 24} H${x + 38} M${x + 24} ${y + 10} V${y + 38}`, stroke: "#fff", "stroke-width": 2, opacity: .35 }));
    if (onTap) g.addEventListener("click", () => onTap(i));
    svg.append(g);
  });
  return svg;
}
const r6Cols01 = (r, b) => Array.from({ length: r + b }, (_, i) => i < r ? 0 : 1);
/* opt = { r, b, need, examples:[[r1,b1,r2,b2]], choose, ok } */
function r6Plate(body, api, opt) {
  if (opt.examples) body.append(h("div", { class: "r6figs", style: `--n:${opt.examples.length * 2}` }, opt.examples.flatMap(([a, b, c, d]) => [
    h("div", {}, r6PlateSvg(r6Cols01(a, b)), h("div", { class: "r6cap" }, `빨간색 ${a}개 + 파란색 ${b}개`)),
    h("div", {}, r6PlateSvg(r6Cols01(c, d)), h("div", { class: "r6cap" }, `빨간색 ${c}개 + 파란색 ${d}개`))])),
    h("p", { class: "r6muted" }, opt.examples.map(([a, b, c, d]) => `${a}+${b}=${c}+${d}`).join("   ·   ")));
  const col = r6Cols01(opt.r, opt.b), rec = [];
  let svg = null;
  const stage = h("div", { class: "stage r6stage" }), eq = h("div", { class: "readout" }), list = h("div", { class: "r6list" });
  const red = () => col.filter(c => c === 0).length;
  const draw = () => { stage.innerHTML = ""; svg = r6PlateSvg(col, i => { col[i] = 1 - col[i]; draw(); }); stage.append(svg); eq.textContent = `${opt.r}+${opt.b} = ${red()}+${col.length - red()}`; };
  const side = h("div", { class: "side r6side" }, h("div", { class: "r6task" }, "초콜릿을 누르면 빨간색 ↔ 파란색이 바뀌어요."), eq,
    h("button", { class: "r6btn", onclick: () => {
      const r = red(), s = `${opt.r}+${opt.b}=${r}+${col.length - r}`;
      if (r === opt.r) return api.hint("처음과 같은 식이에요. 빨간색 초콜릿의 수를 바꿔 봐요.");
      if (rec.includes(s)) return api.hint("이미 담은 식이에요. 다른 식을 만들어 봐요.");
      rec.push(s); list.append(h("span", {}, s)); api.hint(`○ ${s} ─ 빨간색이 ${Math.abs(r - opt.r)}개 ${r > opt.r ? "늘어난" : "줄어든"} 만큼 파란색이 ${r > opt.r ? "줄어들었어요" : "늘어났어요"}.`);
    } }, "이 식 담기"), h("div", { class: "r6muted" }, `만든 식(${opt.need}개 이상):`), list);
  draw();
  body.append(h("div", { class: "panel" }, stage, side));
  const C = opt.choose ? r6Choose(opt.choose) : null; if (C) body.append(C.el);
  api.provide({ words: ["늘어난 만큼", "줄어들어요", "등호(=)"], answers: [`${opt.r}+${opt.b}=${opt.r - 1}+${opt.b + 1}, ${opt.r}+${opt.b}=${opt.r + 4}+${opt.b - 4}`].concat(C ? C.answers() : []) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (rec.length < opt.need) return api.fail(`접시의 초콜릿 색을 바꾸고 ‘이 식 담기’를 눌러 식을 ${opt.need}개 만들어요.`, rec.join(", ") || "-");
    const m = C && C.check(); if (m) return api.fail(m, rec.join(", ") + " / " + C.given());
    api.done(rec.join(", "), opt.ok);
  } }, "확인하기")));
}

/* ---------- 내 짝을 찾아라(카드) ----------
   opt = { pairs:[["5+13","9+9"],…], faceUp, order:[카드 글…], pre:[짝 번호…], cols, ok }
   카드의 값을 코드로 계산해 짝마다 같은지, 짝끼리 값이 겹치지 않는지, 두 자리 수 범위인지 먼저 확인해요. */
function r6CheckPairs(pairs) {
  const vals = pairs.map(([x, y]) => {
    const a = r6Eval(x), b = r6Eval(y);
    if (!(a === b && Number.isInteger(a))) throw new Error(`짝 카드의 크기가 달라요: ${x}, ${y}`);
    if ((x + " " + y).match(/\d+/g).some(n => +n > 99)) throw new Error(`두 자리 수를 넘어요: ${x}, ${y}`);
    return a;
  });
  if (new Set(vals).size !== vals.length) throw new Error("서로 다른 짝의 크기가 겹쳐요");
  return vals;
}
function r6Shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function r6Match(body, api, opt) {
  r6CheckPairs(opt.pairs);
  const base = opt.pairs.flatMap(([x, y], k) => [{ t: x, k }, { t: y, k }]);
  let cards, up, got, flips, lock, players = 1, turn = 0, score = [0, 0];
  const grid = h("div", { class: "r6gridc", style: `--c:${opt.cols || 4}` }), status = h("div", { class: "readout", style: "font-size:var(--fs)" }), list = h("div", { class: "r6list" });
  function start() {
    cards = opt.order ? opt.order.map(t => base.find(c => r6Norm(c.t) === r6Norm(t))) : r6Shuffle(base);
    up = []; got = new Set(); flips = 0; lock = false; turn = 0; score = [0, 0]; list.innerHTML = "";
    (opt.pre || []).forEach(k => { cards.forEach((c, i) => { if (c.k === k) got.add(i); }); list.append(h("span", {}, `${r6Show(opt.pairs[k][0])} = ${r6Show(opt.pairs[k][1])} (보기)`)); });
    render();
  }
  function render() {
    grid.innerHTML = "";
    cards.forEach((c, i) => {
      const shown = opt.faceUp || up.includes(i) || got.has(i);
      grid.append(h("button", { class: "r6mc" + (got.has(i) ? " r6got" : up.includes(i) ? " r6up" : shown ? "" : " r6back"), "aria-label": shown ? c.t : "뒤집힌 카드", onclick: () => flip(i) }, shown ? r6Show(c.t) : "?"));
    });
    const left = (cards.length - got.size) / 2;
    status.textContent = opt.faceUp ? `찾을 짝: ${left}쌍 남음` : players === 2 ? `${turn + 1}번 친구 차례 · 1번 ${score[0] * 2}장, 2번 ${score[1] * 2}장 · 남은 짝 ${left}쌍` : `뒤집은 횟수 ${flips}번 · 남은 짝 ${left}쌍`;
  }
  function flip(i) {
    if (lock || got.has(i)) return;
    if (up.includes(i)) { if (opt.faceUp) { up = up.filter(x => x !== i); render(); } return; }
    up.push(i); render();
    if (up.length < 2) return;
    const [a, b] = up, A = cards[a], B = cards[b];
    if (!opt.faceUp) flips++;
    if (A.k === B.k) {
      got.add(a); got.add(b); up = []; score[turn]++;
      list.append(h("span", {}, `${r6Show(A.t)} = ${r6Show(B.t)}`));
      if (players === 2) turn = 1 - turn;
      render();
      if (got.size === cards.length) {
        const msg = players === 2 ? (score[0] === score[1] ? `두 친구가 ${score[0] * 2}장씩 모아 비겼어요!` : `${score[0] > score[1] ? 1 : 2}번 친구가 ${Math.max(...score) * 2}장을 모아 이겼어요!`) : (opt.faceUp ? "" : `${flips}번 뒤집어 모든 짝을 찾았어요! `);
        api.done([...list.children].map(s => s.textContent).join(", "), msg + (opt.ok || "크기가 같은 두 양을 모두 찾아 등호로 이었어요!"));
      }
      return;
    }
    if (opt.faceUp) { up = []; render(); api.fail(opt.bad || `${r6J(r6Show(A.t), "과/와")} ${r6J(r6Show(B.t), "은/는")} 크기가 달라요. 한쪽 수가 커지거나 작아진 만큼 다른 수가 어떻게 바뀌었는지 살펴봐요.`, `${A.t} / ${B.t}`); return; }
    lock = true;
    setTimeout(() => { up = []; lock = false; if (players === 2) turn = 1 - turn; render(); }, 1100);
  }
  if (!opt.faceUp) {
    const b1 = h("button", { class: "r6btn r6pick", onclick: () => { players = 1; b1.classList.add("r6pick"); b2.classList.remove("r6pick"); start(); } }, "혼자 하기");
    const b2 = h("button", { class: "r6btn", onclick: () => { players = 2; b2.classList.add("r6pick"); b1.classList.remove("r6pick"); start(); } }, "둘이 번갈아 하기");
    body.append(h("div", { class: "r6row" }, b1, b2, h("button", { class: "r6btn", onclick: start }, "카드 다시 섞기")));
  }
  body.append(status, grid, h("div", { class: "r6muted" }, "완성한 식:"), list);
  api.provide({ words: ["크기가 같은 두 양", "등호(=)"], answers: [opt.pairs.map(([x, y]) => `${r6Show(x)}=${r6Show(y)}`).join(", ")] });
  start();
}
/* 문제 카드 완성: 5+13=□+□ (두 자리 수 범위, 왼쪽과 다른 식) */
function r6EqFill(body, api, opt) {
  const rows = opt.items.map(it => {
    const x = h("input", { type: "text", inputmode: "numeric", class: "r6in", style: "width:3.4em", "aria-label": `${it.l} 첫째 빈칸`, autocomplete: "off" });
    const y = h("input", { type: "text", inputmode: "numeric", class: "r6in", style: "width:3.4em", "aria-label": `${it.l} 둘째 빈칸`, autocomplete: "off" });
    body.append(h("div", { class: "r6eqrow qitem" }, h("span", { class: "jua" }, `${r6Show(it.l)} =`), x, h("span", { class: "jua" }, r6Show(it.op)), y));
    return { it, x, y };
  });
  const tip = { "+": "더해지는 수가 커진 만큼 더하는 수는 작아져야 크기가 같아요.", "-": "빼지는 수가 커진 만큼 빼는 수도 커져야 크기가 같아요.", "×": "한 수가 2배가 되면 다른 수는 반으로 줄어야 크기가 같아요." };
  api.provide({ words: ["크기가 같은 두 양", "등호(=)"], answers: opt.items.map(it => `${r6Show(it.l)}=${r6Show(it.ex)}`) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = rows.map(r => `${r.it.l}=${r.x.value || "□"}${r.it.op}${r.y.value || "□"}`).join(", ");
    for (const r of rows) {
      const a = r6Norm(r.x.value), b = r6Norm(r.y.value), bad = m => { r.x.style.borderColor = r.y.style.borderColor = "var(--no)"; return api.fail(m, given); };
      if (a === "" || b === "") return bad("빈칸을 모두 채워요.");
      if (!/^\d+$/.test(a) || !/^\d+$/.test(b) || +a > 99 || +b > 99) return bad("0부터 99까지의 수로 만들어요.");
      if (r.it.op === "×" && (+a === 0 || +b === 0)) return bad("곱셈에서는 0이 아닌 수로 만들어요.");
      if (r6Eval(`${a}${r.it.op}${b}`) !== r6Eval(r.it.l)) return bad(`${r6J(`${r6Show(r.it.l)}=${a}${r6Show(r.it.op)}${b}`, "은/는")} 등호 양쪽의 크기가 달라요. ${tip[r.it.op]}`);
      if (r6Norm(`${a}${r.it.op}${b}`) === r6Norm(r.it.l)) return bad(`${r6J(r6Show(r.it.l), "과/와")} 똑같은 식이에요. 다른 두 수로 만들어요.`);
      r.x.style.borderColor = r.y.style.borderColor = "var(--ok)";
    }
    api.done(given, opt.ok);
  } }, "확인하기")));
}

/* ---------- 동전 옮기기(덧셈을 곱셈으로) ---------- */
function r6Coins(body, api, opt) {
  const rows = opt.rows.map((n, r) => Array.from({ length: n }, (_, k) => ({ from: r, id: r * 100 + k })));
  const maxLen = Math.max(...opt.rows), nr = rows.length, u = 54, lw = 92, top = 10;
  const W = lw + maxLen * u + 16, H = nr * u + top * 2, svg = makeSvg(W, H); svg.style.touchAction = "none";
  let sel = null, drag = null;
  const tint = ["#F6E7B0", "#DCEAFB", "#E3F4EA", "#FBE3E3"];
  const rowAt = p => { const r = Math.floor((p.y - top) / u); return r >= 0 && r < nr ? r : -1; };
  const coinAt = p => { const r = rowAt(p), c = Math.floor((p.x - lw) / u); return r >= 0 && c >= 0 && rows[r][c] ? { r, c, coin: rows[r][c] } : null; };
  const info = h("div", { class: "readout", style: "font-size:var(--fs)" });
  function draw() {
    svg.innerHTML = "";
    rows.forEach((row, r) => {
      svg.append(svgEl("rect", { x: 4, y: top + r * u + 3, width: W - 8, height: u - 6, rx: 10, fill: sel && rowAt({ y: top + r * u + 5 }) === r ? "#F2F7FD" : "#FBFCFB", stroke: "#E1E8E5" }));
      svg.append(txt(lw / 2, top + r * u + u / 2, `${R6ORD[r + 1]} 줄`, 18, { fill: "#3B4A47" }));
      row.forEach((coin, c) => {
        if (drag && drag.coin === coin) return;
        const x = lw + c * u, y = top + r * u, g = svgEl("g");
        r6Piece(g, "coin", x + 2, y + 2, u - 4);
        if (coin.from !== r) g.firstChild.setAttribute("fill", tint[coin.from % 4]);
        if (sel === coin) g.append(svgEl("circle", { cx: x + u / 2, cy: y + u / 2, r: u * .47, fill: "none", stroke: "#2B7BD6", "stroke-width": 3 }));
        svg.append(g);
      });
    });
    if (drag && drag.pos) { const g = svgEl("g", { opacity: .85 }); r6Piece(g, "coin", drag.pos.x - u / 2 + 2, drag.pos.y - u / 2 + 2, u - 4); svg.append(g); }
    info.textContent = `줄마다 동전: ${rows.map(r => r.length + "개").join(", ")} → ${rows.map(r => r.length).join("+")}`;
  }
  function move(coin, r) {
    const from = rows.findIndex(row => row.includes(coin));
    if (from === r) return;
    if (rows[r].length >= maxLen) return api.hint("그 줄에는 더 놓을 자리가 없어요.");
    rows[from].splice(rows[from].indexOf(coin), 1); rows[r].push(coin);
  }
  dragOn(svg, p => {
    const hit = coinAt(p);
    if (hit) { drag = { coin: hit.coin, p0: p, moved: false }; return true; }
    const r = rowAt(p); if (sel && r >= 0) { move(sel, r); sel = null; draw(); }
    return false;
  }, p => { if (!drag) return; if (dist(p, drag.p0) > 8) drag.moved = true; drag.pos = drag.moved ? p : null; draw(); }, p => {
    if (!drag) return; const d = drag; drag = null;
    if (d.moved) { const r = rowAt(p); if (r >= 0) move(d.coin, r); sel = null; } else sel = sel === d.coin ? null : d.coin;
    draw();
  });
  const a = h("input", { type: "text", inputmode: "numeric", class: "r6in", style: "width:3em", "aria-label": "곱셈식 첫째 수", autocomplete: "off" });
  const b = h("input", { type: "text", inputmode: "numeric", class: "r6in", style: "width:3em", "aria-label": "곱셈식 둘째 수", autocomplete: "off" });
  const total = opt.rows.reduce((s, x) => s + x, 0), len = total / nr;
  const side = h("div", { class: "side r6side" }, h("div", { class: "r6task" }, "동전을 끌어 다른 줄로 옮겨요."), h("p", { class: "r6muted" }, "동전을 눌러 고른 뒤 옮길 줄을 눌러도 돼요."), info,
    h("div", { class: "r6eqrow" }, h("span", { class: "jua" }, `${opt.rows.join("+")} =`), a, h("span", { class: "jua" }, "×"), b),
    h("button", { class: "r6btn", onclick: () => { rows.forEach(r => r.length = 0); opt.rows.forEach((n, r) => { for (let k = 0; k < n; k++) rows[r].push({ from: r, id: r * 100 + k }); }); sel = null; draw(); } }, "처음 모양으로"));
  draw();
  body.append(h("div", { class: "panel" }, h("div", { class: "stage r6stage" }, svg), side));
  const X = r6Extra(opt); X.els.forEach(e => body.append(e));
  api.provide({ words: ["덧셈을 곱셈으로", "정사각형", "직사각형"], answers: [`${opt.rows.join("+")}=${len}×${nr}`].concat(X.answers()) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = `${rows.map(r => r.length).join(",")} / ${a.value || "□"}×${b.value || "□"}`;
    if (rows.some(r => r.length !== rows[0].length)) return api.fail("줄마다 동전의 수가 같아지게 옮겨요. 가장 긴 줄의 동전을 가장 짧은 줄로 옮겨 봐요.", given);
    const x = Number(r6Norm(a.value)), y = Number(r6Norm(b.value));
    if (!((x === len && y === nr) || (x === nr && y === len))) { a.style.borderColor = b.style.borderColor = "var(--no)"; return api.fail(`동전을 옮긴 모양을 보고 곱셈식을 써요. 한 줄에 몇 개씩 몇 줄인가요?`, given); }
    a.style.borderColor = b.style.borderColor = "var(--ok)";
    const m = X.check(); if (m) return api.fail(m, given + " / " + X.given());
    api.done(given + (X.els.length ? " / " + X.given() : ""), opt.ok);
  } }, "확인하기")));
}

/* ---------- 섬에 나누어 넣기 · 글자 색칠 · 그림 ---------- */
function r6Sort(body, api, opt) {
  if (opt.fig) body.append(opt.fig());
  const where = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "r6pool" }), bins = h("div", { class: "r6bins" });
  function draw() {
    pool.innerHTML = ""; bins.innerHTML = "";
    const binEls = opt.bins.map((b, k) => { const el = h("div", { class: "r6bin", onclick: () => { if (sel == null) return; where[sel] = k; sel = null; draw(); } }, h("div", { class: "r6bint" }, b)); bins.append(el); return el; });
    opt.cards.forEach((c, i) => (where[i] < 0 ? pool : binEls[where[i]]).append(h("button", { class: "r6chip" + (sel === i ? " r6pick" : ""), onclick: e => { e.stopPropagation(); sel = sel === i ? null : i; draw(); } }, c.t)));
    if (!pool.children.length) pool.append(h("span", { class: "r6muted" }, "카드를 모두 넣었어요."));
  }
  draw();
  body.append(h("p", { class: "r6muted" }, "카드를 누른 뒤 알맞은 섬 상자를 눌러요."), pool, bins);
  api.provide({ words: opt.bins, answers: opt.bins.map((b, k) => `${b}: ${opt.cards.filter(c => c.b === k).map(c => c.t).join(", ")}`) });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = opt.cards.map((c, i) => `${c.t}→${where[i] < 0 ? "-" : opt.bins[where[i]]}`).join(", ");
    if (where.some(w => w < 0)) return api.fail("카드를 모두 섬 상자에 넣어요.", given);
    const bad = opt.cards.findIndex((c, i) => where[i] !== c.b);
    if (bad >= 0) { draw(); bins.querySelectorAll(".r6chip").forEach(b => { const i = opt.cards.findIndex(c => c.t === b.textContent); b.classList.add(where[i] === opt.cards[i].b ? "r6good" : "r6bad"); }); return api.fail(`${r6J(`‘${opt.cards[bad].t}’`, "은/는")} 어느 섬에서 볼 수 있는지 다시 생각해 봐요.`, given); }
    api.done(given, opt.ok);
  } }, "확인하기")));
}
function r6Letters(body, api, opt) {
  body.append(h("div", { class: "r6probs" }, opt.probs.map(p => h("p", {}, p))));
  const pick = new Set(), grid = h("div", { class: "r6gridc", style: "--c:4" });
  opt.tiles.forEach(([n, ch]) => { const b = h("button", { class: "r6tile", "aria-label": `${n} ${ch}`, onclick: () => { pick.has(n) ? pick.delete(n) : pick.add(n); b.classList.toggle("r6pick", pick.has(n)); } }, h("b", {}, String(n)), h("span", {}, ch)); grid.append(b); });
  body.append(h("p", { class: "r6muted" }, "□ 안에 알맞은 수를 구해 그 수가 적힌 칸을 눌러 색칠해요."), grid);
  api.provide({ words: ["규칙", "계산식의 배열"], answers: [opt.ans.join(", ")] });
  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    const given = [...pick].join(", ");
    const extra = [...pick].find(n => !opt.ans.includes(n));
    if (extra != null) return api.fail(`${r6J(String(extra), "은/는")} □ 안에 알맞은 수가 아니에요. 규칙을 다시 찾아 봐요.`, given);
    if (opt.ans.some(n => !pick.has(n))) return api.fail("아직 색칠하지 않은 답이 있어요. □가 모두 몇 개인지 세어 봐요.", given);
    api.done(given, `색칠한 글자를 차례로 읽으면 ‘${opt.word}’예요! ${opt.ok || ""}`);
  } }, "확인하기")));
}
function r6ShellFig() {
  const s = [1, 2, 3, 5, 8], u = 22, gap = 12, cols = ["#F6C85F", "#F7B27A", "#F2A0A0", "#9ED39A", "#7FB8E6"];
  const W = s.reduce((a, b) => a + b * u + gap, gap), H = 8 * u + 46, svg = makeSvg(W, H); let x = gap;
  s.forEach((k, i) => {
    const y = H - 32 - k * u;
    svg.append(svgEl("rect", { x, y, width: k * u, height: k * u, fill: cols[i], stroke: "#6B5A48", "stroke-width": 2, rx: 3 }));
    svg.append(svgEl("path", { d: `M${x} ${y + k * u} A${k * u} ${k * u} 0 0 1 ${x + k * u} ${y}`, fill: "none", stroke: "#8C5A2B", "stroke-width": 2.5 }));
    svg.append(txt(x + k * u / 2, H - 15, `${k}`, 18)); x += k * u + gap;
  });
  return h("div", { class: "r6fig" }, svg, h("p", { class: "r6cap" }, "암모나이트 단면 ─ 한 변의 길이가 1, 2, 3, 5, 8인 정사각형"));
}
function r6IslandsFig() {
  const svg = makeSvg(720, 220);
  svg.append(svgEl("rect", { x: 0, y: 0, width: 720, height: 220, rx: 14, fill: "#DCEFFA" }));
  svg.append(svgEl("path", { d: "M100 120 C190 60 200 60 280 120 S370 180 460 120 S560 60 640 120", fill: "none", stroke: "#6FA8D6", "stroke-width": 3, "stroke-dasharray": "8 7" }));
  const xs = [100, 280, 460, 640], names = ["숫자 섬", "도형 섬", "무지개 섬", "저울 섬"];
  xs.forEach((x, i) => {
    svg.append(svgEl("ellipse", { cx: x, cy: 132, rx: 74, ry: 34, fill: "#F3E3B8", stroke: "#B9975B", "stroke-width": 2 }));
    svg.append(svgEl("ellipse", { cx: x, cy: 124, rx: 56, ry: 20, fill: "#BFE3A9" }));
    svg.append(txt(x, 196, names[i], 22, { fill: "#2F4A43" }));
  });
  svg.append(txt(100, 96, "1201 2201", 18, { fill: "#2F4A43" }));
  svg.append(svgEl("path", { d: "M252 106 L266 82 L280 106 Z", fill: "#F2A0A0", stroke: "#7A3B3B" }));
  svg.append(svgEl("rect", { x: 286, y: 84, width: 22, height: 22, fill: "#7FB8E6", stroke: "#2F5E8A" }));
  [["#E57373", 46], ["#F6C85F", 38], ["#7FB8E6", 30]].forEach(([c, r]) => svg.append(svgEl("path", { d: `M${460 - r} 112 A${r} ${r} 0 0 1 ${460 + r} 112`, fill: "none", stroke: c, "stroke-width": 7 })));
  svg.append(svgEl("line", { x1: 610, y1: 86, x2: 670, y2: 86, stroke: "#6B5A48", "stroke-width": 5 }));
  svg.append(svgEl("line", { x1: 640, y1: 86, x2: 640, y2: 112, stroke: "#6B5A48", "stroke-width": 4 }));
  svg.append(svgEl("path", { d: "M600 96 Q610 108 620 96 Z M660 96 Q670 108 680 96 Z", fill: "#E9DCCB", stroke: "#8C7A68" }));
  return h("div", { class: "r6fig" }, svg);
}
/* 차시에서 쓰는 수 배열 */
const R6T3 = [[43, 45, 47, 49, 51, 53], [40, 42, 44, 46, 48, 50], [37, 39, 41, 43, 45, 47], [34, 36, 38, 40, 42, 44]];
const R6SP = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
const R6ADD = { title: "무지개 위 덧셈식", heads: ["더해지는 수", "더하는 수", "합"], rows: [{ e: "10+90=100" }, { e: "20+80=100" }, { e: "30+70=100" }, { e: "40+60=100" }] };
const R6SUB = { title: "무지개 위 뺄셈식", heads: ["빼지는 수", "빼는 수", "차"], rows: [{ e: "121-11=110" }, { e: "122-12=110" }, { e: "123-13=110" }, { e: "124-14=110" }] };
const R6MUL = { title: "사다리 위 곱셈식", heads: ["곱해지는 수", "곱하는 수", "곱"], rows: [{ e: "1×3=3" }, { e: "11×3=33" }, { e: "111×3=333" }, { e: "1111×3=3333" }] };
const R6DIV = { title: "사다리 위 나눗셈식", heads: ["나누어지는 수", "나누는 수", "몫"], rows: [{ e: "5÷5=1" }, { e: "55÷5=11" }, { e: "555÷5=111" }, { e: "5555÷5=1111" }] };
const R6L = (L, extra) => Object.assign({}, L, { rows: L.rows.concat(extra || []) });
const R6PAIRS = [["5+13", "9+9"], ["12-2", "15-5"], ["10+7", "8+9"], ["4×6", "3×8"], ["30+30", "29+31"], ["51-11", "52-12"], ["6+8", "7+7"], ["20-15", "18-13"]];
const R6PAIRS2 = [["25+17", "27+15"], ["46-19", "47-20"], ["6×4", "12×2"], ["33+33", "30+36"], ["70-35", "80-45"], ["9×5", "15×3"], ["18+19", "20+17"], ["64-28", "66-30"], ["8×7", "28×2"], ["41+29", "35+35"]];
//@@LESSONS
const UNIT_STORY = { title: "수리수리 수학 나라에서 규칙 찾기", lines: [
  "하진이는 지혜, 현우와 함께 수학 가상 세계 ‘수리수리 수학 나라’에 들어갔어요. 숫자 섬, 도형 섬, 무지개 섬, 저울 섬 곳곳에 비밀이 숨어 있어요.",
  "수와 도형의 배열, 계산식의 배열에서 규칙을 찾아 수나 식으로 나타내고, 저울로 크기가 같은 두 양을 등호(=)를 사용한 식으로 나타내요.",
  "교과서 「수학 4-1」 6. 규칙과 관계의 차시 순서 그대로 만들었어요."],
  one: "규칙과 관계 · 하진이와 친구들이 수학 가상 세계의 네 섬에서 숨겨진 규칙을 찾아요." };
const UNIT_KEYWORDS = ["수의 배열", "도형의 배열", "규칙", "가로(→)", "세로(↓)", "방향", "커져요", "작아져요", "몇 배", "이웃한 두 수", "계산식의 배열", "변하는 수", "등호(=)", "크기가 같은 두 양", "저울", "수평"];

const LESSONS = [
{
  id: "r1", no: 1, title: "단원 도입 ― 수리수리 수학 나라", soop: "개념 찾기(S)",
  question: "수와 도형, 계산식의 배열 속에는 어떤 규칙이 숨어 있을까요?",
  summary: "하진이와 지혜, 현우는 수학 가상 세계 ‘수리수리 수학 나라’의 숫자 섬, 도형 섬, 무지개 섬, 저울 섬을 탐험하며 숨겨진 규칙을 찾아요. 이 단원에서는 수의 배열, 도형의 배열, 계산식의 배열에서 규칙을 찾고, 크기가 같은 두 양을 등호로 나타내요.",
  steps: [
    { name: "그림 살펴보기", inst: "땅속에 암모나이트 화석이 있어요. 암모나이트의 단면은 한 변의 길이가 각각 1, 2, 3, 5, 8, ...인 정사각형들로 이어 붙여 그릴 수 있대요. 그림을 보고 답해 보세요.", hints: ["정사각형의 한 변의 길이가 일정한 차례로 커져요.", "옷, 커튼, 포장지의 무늬나 달력, 사물함 번호에도 규칙이 있어요."],
      render: (b, a) => quiz(b, a, [
        { fig: r6ShellFig, q: "그림을 보고 알 수 있는 것은 무엇인가요?", o: ["자연 속에서도 규칙을 찾을 수 있어요", "정사각형의 크기가 모두 같아요", "규칙은 수학책에만 있어요"], a: 0, why: { "1": "정사각형의 한 변의 길이가 1, 2, 3, 5, 8로 달라져요.", "2": "땅속 화석처럼 자연 속에서도 규칙을 찾을 수 있어요." } },
        { q: "우리 주변에서 규칙을 찾을 수 있는 것을 모두 고르세요.", o: ["포장지와 벽지의 무늬", "달력의 수 배열", "사물함 번호", "아무렇게나 쏟아 놓은 블록"], a: [0, 1, 2] }],
        { ok: "자연 속에도, 우리 주변의 무늬와 수 배열에도 규칙이 숨어 있어요." }) },
    { name: "똑똑! 무엇을 배울까요", inst: "‘수학 가상 세계에 오신 것을 환영합니다! 숫자 섬, 도형 섬, 무지개 섬 그리고 저울 섬 곳곳에 비밀이 숨어 있어요.’ 각 섬에서 볼 수 있는 것을 알맞은 섬에 넣어 보세요.", hints: ["숫자 섬에서는 수의 배열을, 도형 섬에서는 도형의 배열을 만나요.", "무지개와 사다리 위에는 계산식이 있고, 저울 섬에는 저울이 있어요."],
      render: (b, a) => r6Sort(b, a, { fig: r6IslandsFig, bins: ["숫자 섬", "도형 섬", "무지개 섬", "저울 섬"], cards: [
        { t: "입구 바닥에 나타난 수의 배열", b: 0 }, { t: "가상 화면에 줄지은 수의 배열", b: 0 }, { t: "하늘 위로 떠오른 도형의 배열", b: 1 }, { t: "거대한 문에 나타난 도형의 배열", b: 1 },
        { t: "무지개 위의 덧셈식과 뺄셈식", b: 2 }, { t: "사다리 위의 곱셈식과 나눗셈식", b: 2 }, { t: "크기가 같은 두 양을 재는 저울", b: 3 }],
        ok: "수의 배열 → 도형의 배열 → 계산식의 배열 → 크기가 같은 두 양 순서로 탐험하며 규칙을 찾아요." }) },
    { name: "그림 보며 이야기하기", inst: "무지개와 사다리 위에 계산식들이 나타났어요. 계산식을 살펴보고 답해 보세요.", hints: ["덧셈식마다 등호 오른쪽의 수를 살펴봐요.", "1, 11, 111, 1111에서 1의 개수를 세어 봐요."],
      render: (b, a) => quiz(b, a, [
        { fig: () => r6SeqFig([R6ADD, R6MUL]), q: "무지개 위 덧셈식들의 같은 점은 무엇인가요?", o: ["합이 모두 100이에요", "더하는 수가 모두 같아요", "더해지는 수가 모두 같아요"], a: 0, why: { "1": "더하는 수는 90, 80, 70, 60으로 달라요.", "2": "더해지는 수는 10, 20, 30, 40으로 달라요." } },
        { q: "사다리 위 곱셈식에서 곱해지는 수 1, 11, 111, 1111은 어떻게 변하나요?", o: ["1이 1개씩 늘어나요", "1씩 커져요", "2배가 돼요"], a: 0, why: { "1": "1 다음이 2가 아니라 11이에요.", "2": "1의 2배는 2예요. 11이 아니에요." } },
        { q: "하진이와 친구들에게 앞으로 어떤 일들이 펼쳐질 것 같나요?", o: ["여러 가지 배열에서 규칙을 찾아 섬을 탈출할 것 같아요", "규칙 없이 아무 길로나 갈 것 같아요"], a: 0 }],
        { ok: "계산식의 배열에도 규칙이 있어요. 앞으로 각 섬에 숨겨진 규칙을 찾아봐요." }) },
    { name: "곰곰! 배운 내용을 떠올려요", inst: "2학년 때 배운 덧셈표를 떠올려요. 1, 2, 3, 4끼리 더한 덧셈표의 일부예요. 2부터 ↘ 방향으로 수를 차례로 눌러 규칙을 찾고, 빈칸을 채워 보세요.", hints: ["2 → 4 → 6으로 이어지는 수를 차례로 눌러요.", "덧셈표는 오른쪽으로 갈수록, 아래로 갈수록 1씩 커져요."],
      render: (b, a) => r6Grid(b, a, { rows: [[2, 3, 4, 5], [3, 4, { a: 5, lab: "㉠" }, 6], [4, 5, 6, 7], [5, 6, 7, { a: 8, lab: "㉡" }]],
        traces: [{ start: [0, 0], dir: "↘", say: "2부터 ↘ 방향으로 수를 차례로 눌러요." }], ok: "덧셈표에서도 방향에 따라 규칙을 찾을 수 있어요. ↘ 방향으로 2씩 커지므로 ㉡은 8이에요." }) },
    { name: "생각 나누기", inst: "단원 도입 이야기를 떠올리며 내 생각을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "가상 세계를 경험해 본 적이 있나요? (가상 세계: 실제 있는 것처럼 보이지만 실제로는 없는 세계)", tag: "경험", ph: "예) 가상 현실 기기로 생존 수영 수업을 해 봤어요." },
        { q: "4개의 섬에서 하진이와 친구들에게 어떤 일이 펼쳐질지 예상해 써 보세요.", tag: "예상", ph: "예) 수의 배열에서 규칙을 찾아 섬을 탈출할 것 같아요." }]) }
  ],
  challenge: { inst: "그림 속 규칙을 이어 가 보세요.", hints: ["1+2=3, 2+3=5, 3+5=8이에요.", "곱해지는 수의 1이 1개 늘어나면 곱의 3도 1개 늘어나요."],
    render: (b, a) => numbers(b, a, [
      { q: "암모나이트 정사각형의 한 변의 길이 1, 2, 3, 5, 8 다음에 올 수는? (앞의 두 수를 더해요)", a: 13, why: { "11": "8보다 3만큼 큰 수가 아니라 앞의 두 수 5와 8을 더해요.", "16": "8의 2배가 아니라 앞의 두 수 5와 8을 더해요." } },
      { q: "1×3=3, 11×3=33, 111×3=333, 1111×3=3333 다음 식 11111×3의 곱은?", a: 33333, why: { "3333": "곱해지는 수의 1이 5개가 되었으니 곱의 3도 5개가 돼요." } }],
      { ok: "그림과 계산식 속 규칙을 이어 갔어요!" }) }
},
{
  id: "r2", no: 2, title: "수의 배열에서 규칙을 찾아볼까요", soop: "개념 구축하기(O)",
  question: "수의 배열에서 규칙을 어떻게 찾을 수 있을까요?",
  summary: "수의 배열에서 규칙을 찾을 때는 어느 방향으로 몇씩 커지거나 작아지는지 살펴봐요. 덧셈·뺄셈으로 말하기 어려우면 몇 배가 되는지, 몇분의 1만큼이 되는지 생각해요. 규칙을 말할 때는 시작하는 수와 방향을 함께 말해요.",
  steps: [
    { inst: "숫자 섬 입구 바닥에 수의 배열이 나타났어요. 수를 차례로 눌러 줄을 긋고 규칙 문장을 완성해 보세요.", hints: ["2201은 1201보다 1000만큼 커요.", "2201, 2101, 2001은 백의 자리 수가 1씩 작아져요. 또 다른 규칙은 901부터 ↗ 방향이나 ↑ 방향으로 찾아봐요."],
      render: (b, a) => r6Grid(b, a, { rows: [[1201, 2201, 3201, 4201], [1101, 2101, 3101, 4101], [1001, 2001, 3001, 4001], [901, 1901, 2901, 3901]],
        traces: [{ start: [0, 0], dir: "→", say: "1201부터 가로(→) 방향으로 수를 차례로 눌러요." }, { start: [0, 1], dir: "↓", say: "2201부터 세로(↓) 방향으로 수를 차례로 눌러요." },
          { notDirs: ["→", "↓"], say: "또 다른 규칙을 찾아요. 앞에서 찾은 것과 다른 방향으로 수를 차례로 눌러요.", notMsg: "가로(→)·세로(↓) 말고 다른 방향(↗, ↙, ↘, ←, ↑ 등)으로 찾아 봐요." }],
        ok: "규칙을 찾으려면 어느 방향으로 몇씩 커지거나 작아지는지 살펴봐요. 시작하는 수와 방향도 함께 말해요!" }) },
    { inst: "이번에는 덧셈과 뺄셈으로 말하기 어려운 수의 배열이에요. 규칙을 찾고 빈칸 ㉠, ㉡에 알맞은 수를 써 보세요.", hints: ["54는 27의 2배예요.", "54, 18, 6, 2는 아래로 갈수록 3으로 나눈 수예요."],
      render: (b, a) => r6Grid(b, a, { rows: [[27, 54, 108, 216], [9, 18, { a: 36, lab: "㉠" }, 72], [3, 6, 12, 24], [1, 2, 4, { a: 8, lab: "㉡" }]],
        traces: [{ start: [0, 0], dir: "→", say: "27부터 가로(→) 방향으로 수를 차례로 눌러요." }, { start: [0, 1], dir: "↓", say: "54부터 세로(↓) 방향으로 수를 차례로 눌러요." }],
        fillWhy: { "㉠": "가로(→) 방향으로 2배가 돼요. 18의 2배는 얼마일까요?", "㉡": "가로(→) 방향으로 2배가 돼요. 4의 2배는 얼마일까요?" },
        ok: "가로(→) 방향으로 2배가 되므로 18의 오른쪽은 36, 4의 오른쪽은 8이에요. 세로(↓) 방향으로 1/3만큼이 되는 규칙으로도 구할 수 있어요." }) },
    { inst: "바구니에 적힌 번호예요. 번호의 글자 부분과 수 부분을 각각 살펴보고 규칙을 고른 뒤, 빈 곳에 알맞은 번호를 써 보세요.", hints: ["가로(→)로 가면 글자는 그대로이고 수가 바뀌어요.", "세로(↓)로 가면 수는 그대로이고 글자가 가, 나, 다, 라로 바뀌어요."],
      render: (b, a) => r6Grid(b, a, { rows: [["가 708", "가 718", "가 728", { a: "가 738", lab: "㉠" }], ["나 708", { a: "나 718", lab: "㉡" }, "나 728", "나 738"], ["다 708", "다 718", "다 728", "다 738"], ["라 708", "라 718", "라 728", "라 738"]],
        choose: [{ q: "가로(→) 방향의 규칙은?", o: ["글자는 그대로이고, 수는 10씩 커져요", "글자는 바뀌고, 수는 그대로예요", "글자는 그대로이고, 수는 1씩 커져요"], a: 0, why: { "2": "708, 718, 728은 십의 자리 수가 1씩 커져요. 얼마씩 커지는 걸까요?" } },
          { q: "세로(↓) 방향의 규칙은?", o: ["글자는 가, 나, 다, 라 순서대로 바뀌고, 수는 그대로예요", "글자는 그대로이고, 수는 10씩 커져요", "글자도 수도 그대로예요"], a: 0 }],
        fillWhy: { "㉠": "가 728의 오른쪽이에요. 글자는 그대로이고 수는 10씩 커져요.", "㉡": "가 718의 아래쪽이에요. 수는 그대로이고 글자가 바뀌어요." },
        ok: "가 728의 오른쪽은 가 738, 가 718의 아래쪽은 나 718이에요. 글자와 수를 나누어 살펴보니 규칙이 잘 보여요." }) },
    { inst: "수의 배열에서 규칙을 찾는 방법을 정리해요.", hints: ["오늘 규칙을 말할 때 무엇을 꼭 함께 말했는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["수의 배열에서 규칙을 찾을 때는 ", { o: ["어느 방향으로", "어느 색깔로"], a: 0 }, " 몇씩 ", { o: ["커지거나 작아지는지", "놓여 있는지"], a: 0 }, " 살펴봐요. 덧셈과 뺄셈으로 말하기 어려우면 몇 ", { o: ["배가 되는지", "개가 있는지"], a: 0 }, " 생각해요. 규칙을 말할 때는 시작하는 수와 ", { o: ["방향을", "글자 크기를"], a: 0 }, " 함께 말해요."]) },
    { inst: "익힘책 문제예요. 규칙을 찾아 문장을 완성하고 빈칸 ㉠, ㉡에 알맞은 수를 써 보세요.", hints: ["2072, 2272, 2472는 백의 자리 수가 2씩 커져요.", "2272, 2262, 2252는 십의 자리 수가 1씩 작아져요."],
      render: (b, a) => r6Grid(b, a, { rows: [[2072, 2272, 2472, 2672], [2062, 2262, { a: 2462, lab: "㉠" }, 2662], [2052, 2252, 2452, 2652], [2042, { a: 2242, lab: "㉡" }, 2442, 2642]],
        traces: [{ start: [0, 0], dir: "→", say: "2072부터 가로(→) 방향으로 수를 차례로 눌러요." }, { start: [0, 1], dir: "↓", say: "2272부터 세로(↓) 방향으로 수를 차례로 눌러요." }],
        ok: "가로(→) 방향으로 200씩 커지고 세로(↓) 방향으로 10씩 작아지므로 ㉠은 2462, ㉡은 2242예요." }) }
  ],
  challenge: { inst: "→ 방향의 수의 배열이에요. 규칙을 찾아 ★과 ▲에 알맞은 수를 구해 보세요.", hints: ["128은 256의 반이에요.", "커지는지 작아지는지 먼저 살펴보고, 차가 일정하지 않으면 몇분의 1이 되는지 생각해요."],
    render: (b, a) => r6Grid(b, a, { rows: [[256, 128, 64, { a: 32, lab: "★" }, 16, { a: 8, lab: "▲" }]], traces: [{ start: [0, 0], dir: "→", say: "256부터 → 방향으로 수를 차례로 눌러요." }],
      ok: "256부터 → 방향으로 1/2만큼이 되므로 ★은 32, ▲는 8이에요." }) }
},
{
  id: "r3", no: 3, title: "수의 배열에서 규칙을 찾아 식으로 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "수의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
  summary: "수의 배열에서 한 방향을 정하고 이웃한 두 수로 식을 써요. 수가 커지면 덧셈식이나 곱셈식으로, 작아지면 뺄셈식이나 나눗셈식으로 나타낼 수 있어요. 규칙에 맞는 식은 한 가지만 있는 것이 아니에요.",
  steps: [
    { inst: "‘숫자 섬을 탈출하려면 화면에 나타난 수의 배열에서 규칙을 찾아 식으로 나타내어야 합니다.’ 먼저 가로(→)와 세로(↓) 방향의 규칙을 찾아보세요.", hints: ["43, 45, 47은 2씩 커져요.", "43, 40, 37은 3씩 작아져요."],
      render: (b, a) => r6Grid(b, a, { rows: R6T3, traces: [{ start: [0, 0], dir: "→", say: "43부터 가로(→) 방향으로 수를 차례로 눌러요." }, { start: [0, 0], dir: "↓", say: "43부터 세로(↓) 방향으로 수를 차례로 눌러요." }],
        ok: "가로(→) 방향으로 2씩 커지고, 세로(↓) 방향으로 3씩 작아져요. 43보다 2만큼 큰 수가 45예요." }) },
    { inst: "찾은 규칙을 [43][45]처럼 이웃한 두 수로 식을 써서 나타내어 보세요. 2씩 커지는 것은 어떤 식으로 나타내면 좋을까요?", hints: ["2씩 커지는 규칙은 덧셈식으로 나타내요. 예) 43+2=45", "3씩 작아지는 규칙은 뺄셈식으로 나타내요. 같은 세로줄에서 위의 수에서 시작해요."],
      render: (b, a) => r6EqWrite(b, a, { fig: () => r6GridFig(R6T3), rules: [
        { q: "가로(→) 방향의 규칙을 이웃한 두 수로 덧셈식 2개로 나타내어 보세요.", seqs: R6T3, need: 2 },
        { q: "세로(↓) 방향의 규칙을 이웃한 두 수로 뺄셈식 2개로 나타내어 보세요.", seqs: r6Cols(R6T3), need: 2 }],
        ok: "43+2=45, 45+2=47 …, 43−3=40, 40−3=37 … 처럼 이웃한 두 수로 규칙을 식으로 나타냈어요." }) },
    { inst: "한 줄로 늘어선 수의 배열이에요. 규칙을 고르고 → 방향은 곱셈식으로, ← 방향은 나눗셈식으로 나타내어 보세요.", hints: ["9를 3배 한 수가 27이에요. 9×3=27", "27의 1/3만큼이 9예요. 27÷3=9"],
      render: (b, a) => r6EqWrite(b, a, { fig: () => r6GridFig([[3, 9, 27, 81, 243, 729]]),
        choose: [{ q: "3부터 → 방향의 규칙은 무엇인가요?", o: ["6씩 커져요", "3배가 돼요", "3씩 커져요"], a: 1, why: { "0": "3과 9의 차는 6이지만 9와 27의 차는 18이에요. 차가 일정하지 않아요.", "2": "3과 9의 차는 6이에요." } }],
        rules: [{ q: "→ 방향의 규칙을 이웃한 두 수로 곱셈식 2개로 나타내어 보세요.", seqs: [[3, 9, 27, 81, 243, 729]], need: 2 },
          { q: "← 방향의 규칙을 이웃한 두 수로 나눗셈식 2개로 나타내어 보세요.", seqs: [[729, 243, 81, 27, 9, 3]], need: 2 }],
        ok: "3배가 되는 규칙은 9×3=27처럼 곱셈식으로, 1/3만큼이 되는 규칙은 729÷3=243처럼 나눗셈식으로 나타낼 수 있어요." }) },
    { inst: "규칙을 식으로 나타내는 방법을 정리해요.", hints: ["오늘 2씩 커지는 것은 덧셈식, 3배가 되는 것은 곱셈식으로 나타냈어요."],
      render: (b, a) => blanks(b, a, ["수의 배열에서 규칙을 식으로 나타낼 때는 한 방향을 정해 ", { o: ["이웃한", "멀리 떨어진"], a: 0 }, " 두 수로 나타내요. 수가 커지면 ", { o: ["덧셈식이나 곱셈식", "뺄셈식이나 나눗셈식"], a: 0 }, "으로, 작아지면 ", { o: ["뺄셈식이나 나눗셈식", "덧셈식이나 곱셈식"], a: 0 }, "으로 나타낼 수 있어요. 43=43처럼 ", { o: ["등호만 쓰면", "기호를 쓰면"], a: 0 }, " 규칙이 드러나지 않아요."]) },
    { inst: "나선 모양 위에 있는 수의 배열이에요. 2부터 나선을 따라 수가 놓여 있어요. 한 방향(또는 나선을 따라)으로 이웃한 수를 3개 이상 눌러 규칙을 찾고, ㉠과 ㉡에 알맞은 수를 구해 보세요.", hints: ["2, 10, 18, 26처럼 같은 쪽으로 뻗은 수들을 살펴봐요.", "6부터 ← 방향으로 8씩 커지고, 4부터 ↓ 방향으로 8씩 커져요."],
      render: (b, a) => r6Grid(b, a, { spiral: [2, 4, 6, 8, 10, 12, { a: 14, lab: "㉠" }, 16, 18, { a: 20, lab: "㉡" }, 22, 24, 26, 28, 30, 32],
        traces: [{ say: "한 방향(또는 나선을 따라)으로 이웃한 수를 3개 이상 차례로 눌러요." }],
        fillWhy: { "㉠": "6부터 ← 방향으로 8씩 커져요. 6보다 8만큼 큰 수는?", "㉡": "4부터 ↓ 방향으로 8씩 커져요. 12보다 8만큼 큰 수는?" },
        ok: "6부터 ← 방향으로 8씩 커지므로 ㉠은 14, 4부터 ↓ 방향으로 8씩 커지므로 ㉡은 20이에요." }) }
  ],
  challenge: { inst: "나선 모양 수의 배열과 익힘책 수의 배열에서 규칙을 찾아 이웃한 두 수로 식을 써 보세요.", hints: ["2+8=10처럼 한 방향으로 8씩 커지는 규칙도, 2+2=4처럼 나선을 따라 2씩 커지는 규칙도 좋아요.", "4, 12, 36은 3배씩 커져요."],
    render: (b, a) => r6EqWrite(b, a, { fig: () => r6SpiralFig(R6SP, "나선 모양 수의 배열(㉠ 14, ㉡ 20)"), rules: [
      { q: "나선 위 수의 배열에서 한 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", seqs: [[2, 10, 18, 26], [4, 12, 20, 28], [6, 14, 22, 30], [8, 16, 24, 32], R6SP], both: true, need: 2 },
      { q: "4, 12, 36, 108, 324의 → 방향 규칙을 곱셈식으로 나타내어 보세요.", seqs: [[4, 12, 36, 108, 324]], need: 1 }],
      ok: "찾은 규칙을 여러 가지 식으로 나타냈어요. 덧셈·뺄셈·곱셈·나눗셈 중 규칙이 잘 드러나는 식을 골랐어요!" }) }
},
{
  id: "r4", no: 4, title: "도형의 배열에서 규칙을 찾아볼까요", soop: "개념 구축하기(O)",
  question: "도형의 배열에서 모양과 수는 어떻게 변할까요?",
  summary: "도형의 배열에서 규칙을 찾을 때는 첫째, 둘째, 셋째, ...로 갈수록 모양이 어떻게 바뀌는지와 도형의 수가 몇 개씩 늘어나는지를 함께 살펴봐요. 찾은 규칙으로 다음 모양을 그리거나 몇째 모양인지 알 수 있어요.",
  steps: [
    { inst: "‘도형 섬으로 가고 싶다면 도형의 배열에서 비밀을 알아내세요.’ 하늘 위로 떠오른 사각형으로 만든 모양의 배열이에요. 사각형의 수를 세어 빈 곳에 써 보세요.", hints: ["셋째 모양은 가로로 3개씩 2줄이에요.", "셋째 수는 둘째 수보다 얼마가 커졌는지 살펴봐요."],
      render: (b, a) => r6Shape(b, a, { gen: "rect2", what: "사각형", items: [{ n: 1, cnt: true }, { n: 2, cnt: true }, { n: 3, cnt: "?" }, { n: 4, cnt: "?" }], ok: "사각형이 2개, 4개, 6개, 8개로 늘어나요." }) },
    { inst: "규칙을 생각하며 다섯째 모양을 판에 만들어 보세요. ‘넷째 모양 놓기’를 누르면 넷째 모양에서 시작할 수 있어요. 모양과 수의 규칙도 골라 보세요.", hints: ["가로에 놓인 사각형의 수가 1개, 2개, 3개, 4개로 늘어나요.", "다섯째는 넷째보다 사각형이 2개 많아요(가로 5개, 세로 2줄)."],
      render: (b, a) => r6Shape(b, a, { gen: "rect2", what: "사각형", items: [1, 2, 3, 4].map(n => ({ n, cnt: true })), build: { n: 5, from: 4 },
        choose: [{ q: "첫째부터 오른쪽으로 모양은 어떻게 변하나요?", o: ["가로에 놓인 사각형이 1개씩 늘어나는 직사각형 모양이 돼요", "세로에 놓인 사각형이 1개씩 늘어나는 모양이 돼요", "모두 정사각형 모양이에요"], a: 0 },
          { q: "사각형의 수는 어떻게 변하나요?", o: ["2개씩 늘어나요", "1개씩 늘어나요", "2배가 돼요"], a: 0, why: { "2": "4의 2배는 8이지만, 셋째는 6개예요." } }],
        ok: "다섯째 모양은 넷째 모양보다 사각형이 2개 늘어난 10개예요(가로 5개, 세로 2줄)." }) },
    { inst: "바둑돌로 만든 모양의 배열이에요. 어떻게 늘어나는지 살펴보고 빈 곳을 채운 뒤, 다섯째 모양을 판에 만들어 보세요.", hints: ["바둑돌이 1줄, 2줄, 3줄, 4줄로 늘어나는 삼각형 모양이에요.", "늘어나는 바둑돌의 수가 2개, 3개, 4개, ...예요. 다섯째에는 몇 개가 늘어날까요?"],
      render: (b, a) => r6Shape(b, a, { gen: "tri", kind: "stone", what: "바둑돌", items: [{ n: 1, cnt: true }, { n: 2, cnt: true }, { n: 3, cnt: "?" }, { n: 4, cnt: "?" }], build: { n: 5, from: 4 },
        nums: [{ q: "둘째에서 셋째로 늘어난 바둑돌의 수", a: 3, unit: "개" }, { q: "셋째에서 넷째로 늘어난 바둑돌의 수", a: 4, unit: "개" }],
        ok: "바둑돌이 2개, 3개, 4개, ...씩 늘어나요. 다섯째에는 넷째 10개에서 5개 늘어난 15개가 필요해요." }) },
    { inst: "도형의 배열에서 규칙을 찾는 방법을 정리해요.", hints: ["사각형 배열과 바둑돌 배열의 늘어나는 수를 견주어 봐요."],
      render: (b, a) => blanks(b, a, ["도형의 배열에서는 첫째, 둘째, 셋째, ...로 갈수록 ", { o: ["모양이", "색깔이"], a: 0 }, " 어떻게 바뀌는지와 도형의 ", { o: ["수가", "이름이"], a: 0 }, " 몇 개씩 늘어나는지를 함께 살펴봐요. 사각형의 배열은 ", { o: ["2개씩 일정하게", "2개, 3개, 4개씩"], a: 0 }, " 늘어나고, 바둑돌의 배열은 ", { o: ["2개, 3개, 4개, ...씩", "2개씩 일정하게"], a: 0 }, " 늘어나요."]) },
    { inst: "사각형으로 만든 ‘ㄴ’ 모양의 배열이에요. 오른쪽 끝의 모양은 몇째에 알맞은 모양일까요?", hints: ["첫째 1개, 둘째 3개, 셋째 5개, 넷째 7개예요.", "다음 모양의 사각형을 세어 봐요. 위쪽과 오른쪽으로 각각 몇 개씩 늘어났나요?"],
      render: (b, a) => quiz(b, a, [
        { fig: () => r6ShapeRow("ell", [1, 2, 3, 4], { mystery: 6 }), q: "ㄴ 모양의 사각형의 수는 어떻게 변하나요?", o: ["1개, 3개, 5개, 7개, ...로 2개씩 늘어나요", "1개씩 늘어나요", "2배가 돼요"], a: 0 },
        { q: "‘다음 모양’은 몇째에 알맞은 모양인가요?", o: ["다섯째", "여섯째", "일곱째"], a: 1, why: { "0": "다섯째는 넷째(7개)보다 2개 많은 9개예요. 다음 모양의 사각형을 세어 봐요.", "2": "일곱째는 위쪽과 오른쪽으로 각각 6개씩 늘어난 13개예요." } }],
        { ok: "다음 모양은 사각형이 11개예요. 첫째 모양보다 위쪽과 오른쪽으로 각각 5개씩 늘어났으니 여섯째예요." }) }
  ],
  challenge: { inst: "익힘책 문제예요. 사각형으로 만든 모양의 배열을 보고 빈 곳을 채우고, 옳은 설명을 골라 보세요.", hints: ["셋째는 아래쪽과 오른쪽으로 2개씩 늘어난 모양이에요.", "사각형이 1개, 3개, 5개, 7개로 늘어나요."],
    render: (b, a) => r6Shape(b, a, { gen: "gamma", anchor: "top", what: "사각형", items: [{ n: 1, cnt: true }, { n: 2, cnt: true }, { n: 3, cnt: "?" }, { n: 4, cnt: "?" }],
      nums: [{ q: "사각형은 몇 개씩 늘어나나요?", a: 2, unit: "개" }],
      choose: [{ q: "옳은 설명은 무엇인가요?", o: ["사각형이 1개부터 시작하여 아래쪽과 오른쪽으로 각각 1개씩 늘어나요", "사각형이 가로, 세로 방향으로 각각 3개씩 늘어나요"], a: 0 }],
      ok: "사각형이 1개, 3개, 5개, 7개로 2개씩 늘어나요." }) }
},
{
  id: "r5", no: 5, title: "도형의 배열에서 규칙을 찾아 식으로 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "도형의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
  summary: "도형의 배열에서 몇 개씩 늘어나는지 찾으면 덧셈식으로 나타낼 수 있어요. 직사각형 모양이면 가로와 세로의 수를 곱하는 곱셈식으로도 나타낼 수 있어요. 2+4+6+8+10과 6×5는 크기가 같아요.",
  steps: [
    { inst: "‘도형의 배열에서 규칙을 찾아야 문이 열릴 것 같아.’ 도형 섬을 나가는 거대한 문에 나타난 배열이에요. 사각형의 수를 세고, 다섯째 모양을 판에 만들어 보세요.", hints: ["사각형이 아래쪽으로 3개씩 붙어 계단 모양이 돼요.", "넷째 모양의 맨 아래 줄보다 한 칸 오른쪽에 3개를 놓아요."],
      render: (b, a) => r6Shape(b, a, { gen: "stair3", anchor: "top", what: "사각형", layers: true, items: [{ n: 1, cnt: true }, { n: 2, cnt: true }, { n: 3, cnt: "?" }, { n: 4, cnt: "?" }], build: { n: 5, from: 4 },
        choose: [{ q: "사각형의 수는 어떻게 변하나요?", o: ["2개부터 시작하여 3개씩 늘어나요", "3개부터 시작하여 2개씩 늘어나요", "2배가 돼요"], a: 0 }],
        ok: "사각형이 아래쪽으로 늘어나는 계단 모양이 되고, 2개부터 시작하여 3개씩 늘어나요(2, 5, 8, 11, 14)." }) },
    { inst: "사각형의 수의 규칙을 식으로 나타내어 보세요.", hints: ["둘째는 첫째 2개에 3개가 더해져 2+3이에요.", "넷째는 셋째(2+3+3)에 3개가 더 늘어나요. 다섯째도 같은 방법으로 써요."],
      render: (b, a) => r6Shape(b, a, { gen: "stair3", anchor: "top", what: "사각형", layers: true, items: [{ n: 1, expr: "2" }, { n: 2, expr: "2+3" }, { n: 3, expr: "2+3+3" }, { n: 4, expr: { a: "2+3+3+3" } }, { n: 5, hide: true, expr: { a: "2+3+3+3+3" } }],
        ok: "넷째는 2+3+3+3, 다섯째는 넷째에서 3개 더 늘어나 2+3+3+3+3이에요." }) },
    { inst: "모형으로 만든 모양의 배열이에요. 같은 색은 앞 모양에서 새로 늘어난 모형이에요. 모형의 수를 덧셈식으로 나타내어 보세요.", hints: ["둘째는 첫째 2개에 4개가 늘어나 2+4예요.", "늘어나는 모형이 4개, 6개, 8개, ...예요. 다섯째에는 10개가 늘어나요."],
      render: (b, a) => r6Shape(b, a, { gen: "rectM", kind: "mod", what: "모형", layers: true, items: [{ n: 1, expr: "2" }, { n: 2, expr: "2+4" }, { n: 3, expr: "2+4+6" }, { n: 4, expr: { a: "2+4+6+8" } }, { n: 5, hide: true, expr: { a: "2+4+6+8+10" } }],
        ok: "모형이 2개부터 시작하여 4개, 6개, 8개, ...씩 늘어나며 직사각형 모양이 커져요. 다섯째는 2+4+6+8+10이에요." }) },
    { inst: "도형의 배열에서 규칙을 식으로 나타내는 방법을 정리해요.", hints: ["모형의 배열은 덧셈식으로도, 가로×세로의 곱셈식으로도 나타낼 수 있어요."],
      render: (b, a) => blanks(b, a, ["도형의 배열에서 몇 개씩 늘어나는지 찾으면 ", { o: ["덧셈식", "나눗셈식"], a: 0 }, "으로 나타낼 수 있어요. 직사각형 모양이면 가로와 세로의 수를 곱하는 ", { o: ["곱셈식", "뺄셈식"], a: 0 }, "으로도 나타낼 수 있어요. 한 가지 배열을 ", { o: ["여러 가지 식", "한 가지 식"], a: 0 }, "으로 나타낼 수 있어요."]) },
    { inst: "같은 모형의 배열을 이번에는 가로와 세로의 수로 살펴봐요. 모형의 수를 (가로)×(세로)의 곱셈식으로 나타내어 보세요.", hints: ["첫째는 가로 2개, 세로 1줄이라 2×1이에요.", "가로와 세로가 각각 1줄씩 늘어나요. 다섯째는 가로 6개, 세로 5줄이에요."],
      render: (b, a) => r6Shape(b, a, { gen: "rectM", kind: "mod", what: "모형", items: [{ n: 1, expr: "2×1" }, { n: 2, expr: "3×2" }, { n: 3, expr: "4×3" }, { n: 4, expr: { a: "5×4" } }, { n: 5, hide: true, expr: { a: "6×5" } }],
        choose: [{ q: "2+4+6+8+10과 6×5의 크기를 비교하면 어떤가요?", o: ["크기가 같아요", "2+4+6+8+10이 더 커요", "6×5가 더 커요"], a: 0, why: { "1": "둘 다 다섯째 모양의 모형 수를 나타낸 식이에요.", "2": "둘 다 다섯째 모양의 모형 수를 나타낸 식이에요." } }],
        ok: "다섯째는 6×5예요. 같은 모양을 2+4+6+8+10으로도, 6×5로도 나타낼 수 있어요. 둘 다 30이에요." }) }
  ],
  challenge: { inst: "모형의 배열에서 여섯째 모양을 판에 만들고, 모형의 수를 곱셈식으로 나타내어 보세요.", hints: ["‘다섯째 모양 놓기’를 누른 뒤 가로와 세로를 1줄씩 늘려요.", "여섯째는 가로 7개, 세로 6줄이에요."],
    render: (b, a) => r6Shape(b, a, { gen: "rectM", kind: "mod", what: "모형", items: [{ n: 4, expr: "5×4" }, { n: 5, expr: "6×5" }, { n: 6, hide: true, expr: { a: "7×6" } }], build: { n: 6, from: 5 },
      nums: [{ q: "여섯째 모양의 모형은 모두 몇 개인가요?", a: 42, unit: "개", why: { "36": "가로는 7개, 세로는 6줄이에요." } }],
      ok: "여섯째는 7×6=42(개)예요. 2+4+6+8+10+12로 더해도 42예요." }) }
},
{
  id: "r6", no: 6, title: "덧셈식과 뺄셈식의 배열에서 규칙을 찾아볼까요", soop: "개념 구축하기(O)",
  question: "덧셈식과 뺄셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
  summary: "계산식의 배열에서는 변하는 수와 변하지 않는 수를 살펴 규칙을 찾아요. 합이 일정할 때 더해지는 수가 커진 만큼 더하는 수는 작아지고, 차가 일정할 때 빼지는 수가 커진 만큼 빼는 수도 커져요. 규칙으로 다음 계산 결과를 추측하고 계산기로 확인해요.",
  steps: [
    { inst: "무지개 섬에 도착하니 커다란 무지개 위로 덧셈식의 배열이 나타났어요. 식마다 변하는 수가 있는 자리를 눌러 표시하고, 규칙을 골라 보세요.", hints: ["합 100은 모든 식에서 같아요.", "더해지는 수는 10, 20, 30, 40으로, 더하는 수는 90, 80, 70, 60으로 변해요."],
      render: (b, a) => r6Seq(b, a, { lists: [R6ADD], mark: true,
        choose: [{ q: "덧셈식의 배열에서 찾은 규칙은 무엇인가요?", o: ["합이 일정할 때 더해지는 수가 10씩 커지면 더하는 수는 10씩 작아져요", "더해지는 수와 더하는 수가 모두 10씩 커져요", "합이 10씩 커져요"], a: 0, why: { "1": "더하는 수는 90, 80, 70, 60으로 작아져요.", "2": "합은 모두 100이에요." } }],
        ok: "합이 100으로 일정할 때 더해지는 수가 10씩 커지면 더하는 수는 10씩 작아져요." }) },
    { inst: "덧셈식과 뺄셈식의 배열에서 규칙을 찾아 ㉠과 ㉡에 알맞은 식을 써 보세요.", hints: ["㉠: 더해지는 수는 10 커지고, 더하는 수는 10 작아져요.", "㉡: 빼지는 수가 1씩 커지면 빼는 수도 1씩 커지고 차는 110으로 같아요."],
      render: (b, a) => r6Seq(b, a, { lists: [R6L(R6ADD, [{ lab: "㉠", e: "□+□=□", a: [50, 50, 100] }]), R6L(R6SUB, [{ lab: "㉡", e: "□-□=□", a: [125, 15, 110] }])],
        ok: "㉠은 50+50=100, ㉡은 125−15=110이에요. 차가 일정할 때 빼지는 수가 1씩 커지면 빼는 수도 1씩 커져요." }) },
    { inst: "덧셈식의 배열에서 규칙을 찾아 넷째 □를 추측하고, 다섯째에 알맞은 덧셈식을 써 보세요. 추측한 뒤 계산기로 확인해요.", hints: ["더해지는 수는 88부터 8이 1개씩 늘어나요.", "더하는 수는 2부터 앞자리에 1이 1개씩 늘어나고, 합은 90부터 0이 1개씩 늘어나요."],
      render: (b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "덧셈식의 배열", heads: ["더해지는 수", "더하는 수", "합"], rows: [{ lab: "첫째", e: "88+2=90" }, { lab: "둘째", e: "888+12=900" }, { lab: "셋째", e: "8888+112=9000" }, { lab: "넷째", e: "□+1112=90000", a: [88888] }, { lab: "다섯째", e: "□+□=□", a: [888888, 11112, 900000] }] }],
        ok: "넷째 □는 88888, 다섯째는 888888+11112=900000이에요. 계산하지 않아도 규칙으로 추측할 수 있어요." }) },
    { inst: "덧셈식과 뺄셈식의 배열에서 찾은 규칙을 정리해요.", hints: ["무지개 위의 덧셈식과 뺄셈식을 떠올려요."],
      render: (b, a) => blanks(b, a, ["계산식의 배열에서는 ", { o: ["변하는 수와 변하지 않는 수", "가장 큰 수"], a: 0 }, "를 살펴 규칙을 찾아요. 합이 일정할 때 더해지는 수가 10씩 커지면 더하는 수는 10씩 ", { o: ["작아져요", "커져요"], a: 0 }, ". 차가 일정할 때 빼지는 수가 1씩 커지면 빼는 수도 1씩 ", { o: ["커져요", "작아져요"], a: 0 }, ". 찾은 규칙으로 다음 계산 결과를 ", { o: ["추측하고", "지우고"], a: 0 }, " 계산기로 확인해요."]) },
    { inst: "뺄셈식의 배열에서 규칙을 찾아 다섯째에 알맞은 뺄셈식을 쓰고, 차가 1111111이 되는 식은 몇째인지 골라 보세요.", hints: ["빼지는 수는 13부터 3이 1개씩, 빼는 수는 2부터 2가 1개씩 늘어나요.", "차는 11부터 1이 1개씩 늘어나요. 첫째 차는 1이 2개예요."],
      render: (b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "뺄셈식의 배열", heads: ["빼지는 수", "빼는 수", "차"], rows: [{ lab: "첫째", e: "13-2=11" }, { lab: "둘째", e: "133-22=111" }, { lab: "셋째", e: "1333-222=1111" }, { lab: "넷째", e: "13333-2222=11111" }, { lab: "다섯째", e: "□-□=□", a: [133333, 22222, 111111] }] }],
        choose: [{ q: "규칙에 따라 차가 1111111이 되는 뺄셈식은 몇째일까요?", o: ["다섯째", "여섯째", "일곱째"], a: 1, why: { "0": "다섯째 차는 111111이에요. 1이 몇 개인지 세어 봐요.", "2": "첫째 차는 1이 2개, 둘째는 3개예요. 1이 7개면 몇째일까요?" } }],
        ok: "다섯째는 133333−22222=111111이에요. 차의 1이 7개인 1111111은 여섯째(1333333−222222)예요." }) }
  ],
  challenge: { inst: "익힘책 문제예요. 규칙을 찾아 빈칸에 알맞은 식을 써 보세요.", hints: ["130+100, 110+120: 더해지는 수는 20씩 작아지고 더하는 수는 20씩 커져요.", "350−150, 400−200: 빼지는 수와 빼는 수가 모두 50씩 커져요."],
    render: (b, a) => r6Seq(b, a, { calc: true, lists: [
      { title: "덧셈식의 배열", heads: ["더해지는 수", "더하는 수", "합"], rows: [{ e: "130+100=230" }, { e: "110+120=230" }, { e: "90+140=230" }, { e: "70+160=230" }, { lab: "㉠", e: "□+□=□", a: [50, 180, 230] }] },
      { title: "뺄셈식의 배열", heads: ["빼지는 수", "빼는 수", "차"], rows: [{ e: "350-150=200" }, { e: "400-200=200" }, { e: "450-250=200" }, { e: "500-300=200" }, { lab: "㉡", e: "□-□=□", a: [550, 350, 200] }] },
      { title: "덧셈식의 배열", heads: ["더해지는 수", "더하는 수", "합"], rows: [{ lab: "첫째", e: "12+89=101" }, { lab: "둘째", e: "112+889=1001" }, { lab: "셋째", e: "1112+8889=10001" }, { lab: "넷째", e: "11112+88889=100001" }, { lab: "다섯째", e: "□+□=□", a: [111112, 888889, 1000001] }] }],
      ok: "규칙으로 다음 식을 추측했어요. 계산기로 확인해 보면 모두 맞아요!" }) }
},
{
  id: "r7", no: 7, title: "곱셈식과 나눗셈식의 배열에서 규칙을 찾아볼까요", soop: "개념 구축하기(O)",
  question: "곱셈식과 나눗셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
  summary: "곱셈식과 나눗셈식의 배열에서도 변하는 수와 변하지 않는 수를 살펴 규칙을 찾아요. 찾은 규칙으로 다음 곱이나 몫을 추측하고 계산기로 확인해요.",
  steps: [
    { inst: "하늘에서 사다리가 내려왔어요. 사다리 위 곱셈식에서 변하는 수가 있는 자리를 눌러 표시하고, 규칙을 찾아 ㉠에 알맞은 식을 써 보세요.", hints: ["곱하는 수 3은 모든 식에서 같아요.", "곱해지는 수의 1이 1개씩 늘어나면 곱의 3도 1개씩 늘어나요."],
      render: (b, a) => r6Seq(b, a, { lists: [R6L(R6MUL, [{ lab: "㉠", e: "□×□=□", a: [11111, 3, 33333] }])], mark: true,
        choose: [{ q: "곱셈식의 배열에서 찾은 규칙은 무엇인가요?", o: ["곱해지는 수는 1부터 1이 1개씩 늘어나고, 곱은 3부터 3이 1개씩 늘어나요", "곱하는 수가 1씩 커져요", "곱이 3씩 커져요"], a: 0, why: { "1": "곱하는 수는 모두 3이에요.", "2": "곱은 3, 33, 333으로 3이 1개씩 늘어나요." } }],
        ok: "㉠은 11111×3=33333이에요." }) },
    { inst: "사다리 위 나눗셈식이에요. 변하는 수가 있는 자리를 눌러 표시하고 ㉡에 알맞은 식을 써 보세요.", hints: ["나누는 수 5는 모든 식에서 같아요.", "나누어지는 수의 5가 1개씩 늘어나면 몫의 1도 1개씩 늘어나요."],
      render: (b, a) => r6Seq(b, a, { lists: [R6L(R6DIV, [{ lab: "㉡", e: "□÷□=□", a: [55555, 5, 11111] }])], mark: true,
        ok: "나누어지는 수는 5부터 5가 1개씩 늘어나고, 몫은 1부터 1이 1개씩 늘어나요. ㉡은 55555÷5=11111이에요." }) },
    { inst: "곱셈식의 배열에서 규칙을 찾아 넷째 곱을 추측하고, 다섯째에 알맞은 곱셈식을 써 보세요. 추측한 뒤 계산기로 확인해요.", hints: ["곱해지는 수 3은 그대로이고 곱하는 수는 9부터 9가 1개씩 늘어나요.", "곱은 27부터 2와 7 사이에 9가 1개씩 늘어나요."],
      render: (b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "곱셈식의 배열", heads: ["곱해지는 수", "곱하는 수", "곱"], rows: [{ lab: "첫째", e: "3×9=27" }, { lab: "둘째", e: "3×99=297" }, { lab: "셋째", e: "3×999=2997" }, { lab: "넷째", e: "3×9999=□", a: [29997] }, { lab: "다섯째", e: "□×□=□", a: [3, 99999, 299997] }] }],
        ok: "넷째 곱은 29997, 다섯째는 3×99999=299997이에요." }) },
    { inst: "곱셈식과 나눗셈식의 배열에서 규칙을 찾는 방법을 정리해요.", hints: ["오늘 계산을 모두 하지 않고도 다음 곱과 몫을 알아냈어요."],
      render: (b, a) => blanks(b, a, ["곱셈식과 나눗셈식의 배열에서도 ", { o: ["변하는 수와 변하지 않는 수", "가장 작은 수"], a: 0 }, "를 살펴 규칙을 찾아요. 곱해지는 수의 1이 1개씩 늘어나면 곱의 3도 1개씩 ", { o: ["늘어나요", "줄어들어요"], a: 0 }, ". 찾은 규칙으로 다음 곱이나 몫을 ", { o: ["추측하고", "어림하지 않고"], a: 0 }, " 계산기로 확인해요."]) },
    { inst: "나눗셈식의 배열에서 규칙을 찾아 다섯째에 알맞은 나눗셈식을 쓰고, 몫이 666667이 되는 식은 몇째인지 골라 보세요.", hints: ["나누어지는 수는 42부터 4와 2가 1개씩, 나누는 수는 6부터 6이 1개씩 늘어나요.", "몫은 7부터 앞자리에 6이 1개씩 늘어나요. 첫째 몫에는 6이 없어요."],
      render: (b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "나눗셈식의 배열", heads: ["나누어지는 수", "나누는 수", "몫"], rows: [{ lab: "첫째", e: "42÷6=7" }, { lab: "둘째", e: "4422÷66=67" }, { lab: "셋째", e: "444222÷666=667" }, { lab: "넷째", e: "44442222÷6666=6667" }, { lab: "다섯째", e: "□÷□=□", a: [4444422222, 66666, 66667] }] }],
        choose: [{ q: "규칙에 따라 몫이 666667이 되는 나눗셈식은 몇째일까요?", o: ["다섯째", "여섯째", "일곱째"], a: 1, why: { "0": "다섯째 몫은 66667이에요. 6이 몇 개인지 세어 봐요.", "2": "둘째 몫 67에는 6이 1개, 셋째 667에는 2개예요. 6이 5개면 몇째일까요?" } }],
        ok: "다섯째는 4444422222÷66666=66667이에요. 몫의 6이 5개인 666667은 여섯째예요." }) }
  ],
  challenge: { inst: "익힘책 문제예요. 규칙을 찾아 빈칸에 알맞은 식을 쓰고, 잘못 설명한 사람을 찾아보세요.", hints: ["105×6, 1005×6: 곱해지는 수의 1과 5 사이에 0이 1개씩 늘어나요.", "721÷7, 7021÷7: 나누어지는 수의 7과 2 사이 0이 1개 늘어나면 몫의 1과 3 사이 0도 1개 늘어나요."],
    render: (b, a) => r6Seq(b, a, { calc: true, lists: [
      { title: "나눗셈식의 배열", heads: ["나누어지는 수", "나누는 수", "몫"], rows: [{ e: "200÷2=100" }, { e: "300÷3=100" }, { e: "400÷4=100" }, { e: "500÷5=100" }, { lab: "다섯째", e: "□÷□=□", a: [600, 6, 100] }] },
      { title: "곱셈식의 배열", heads: ["곱해지는 수", "곱하는 수", "곱"], rows: [{ lab: "첫째", e: "105×6=630" }, { lab: "둘째", e: "1005×6=6030" }, { lab: "셋째", e: "10005×6=60030" }, { lab: "넷째", e: "□×□=□", a: [100005, 6, 600030] }] },
      { title: "나눗셈식의 배열", heads: ["나누어지는 수", "나누는 수", "몫"], rows: [{ lab: "첫째", e: "721÷7=103" }, { lab: "둘째", e: "7021÷7=1003" }, { lab: "셋째", e: "70021÷7=10003" }, { lab: "넷째", e: "700021÷7=100003" }] }],
      choose: [{ q: "지혜: “나누어지는 수는 7과 2 사이에 0이 1개씩 늘어나고 몫은 1과 3 사이에 0이 1개씩 늘어나.” 은솔: “다섯째에 알맞은 나눗셈식은 7000021÷7=100003이야.” 잘못 설명한 사람은?", o: ["지혜", "은솔"], a: 1, why: { "0": "지혜의 말은 맞아요. 은솔이가 말한 몫의 0의 개수를 세어 봐요." } }],
      ok: "은솔이가 잘못 설명했어요. 다섯째는 7000021÷7=1000003이에요." }) }
},
{
  id: "r8", no: 8, title: "크기가 같은 두 양의 관계를 식으로 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "크기가 같은 두 양의 관계를 어떻게 식으로 나타낼 수 있을까요?",
  summary: "저울이 수평을 이루면 양쪽의 양이 같아요. 4+8=5+7, 6−3=10−7, 4×6=8×3과 같이 크기가 같은 두 양의 관계를 등호(=)를 사용하여 식으로 나타낼 수 있어요. 한쪽 수가 커지거나 작아진 만큼 다른 수가 어떻게 바뀌는지 살펴보면 계산하지 않고도 알 수 있어요.",
  steps: [
    { inst: "저울 섬에 도착했어요. 왼쪽 접시에는 가(모양 조각 10개), 오른쪽 접시에는 나(모양 조각 12개)가 있어요. 모양 조각 하나의 무게는 모두 같아요. 식 10−1=12−3이 옳은지 저울로 확인해 보세요.", hints: ["가에서 1개를 덜어 내면 9개, 나에서 3개를 덜어 내면 9개예요.", "저울이 수평이면 양쪽 조각의 수가 같아요."],
      render: (b, a) => r6Balance(b, a, { tasks: [{ L: 10, R: 12, need: { L: 1, R: 3 }, say: "가에서 1개를, 나에서 3개를 덜어 내 보세요.",
        choose: [{ q: "저울이 수평을 이루나요?", o: ["수평을 이뤄요", "가 쪽으로 기울어요", "나 쪽으로 기울어요"], a: 0 },
          { q: "저울이 수평을 이루면 등호를 사용한 식 10−1=12−3은 옳은가요?", o: ["옳아요", "옳지 않아요"], a: 0, why: { "1": "저울 양쪽의 모양 조각이 9개로 같으니 등호 양쪽의 크기도 같아요." } }] }],
        ok: "가에서 1개를 덜어 내면 9개, 나에서 3개를 덜어 내면 9개라 수평을 이뤄요. 그래서 10−1=12−3은 옳아요." }) },
    { inst: "저울을 이용하여 등호를 사용한 식을 만들어 보세요. 수평이 되도록 조각을 덜어 내고 □에 알맞은 수를 써요.", hints: ["가에서 2개를 덜어 내면 8개예요. 나도 8개가 되려면 몇 개를 덜어 내야 할까요?", "나에서 6개를 덜어 내면 6개예요. 가도 6개가 되려면?"],
      render: (b, a) => r6Balance(b, a, { tasks: [
        { L: 10, R: 12, pre: { L: 2 }, eq: "10-2=12-□", say: "가에서 2개를 덜어 냈어요. 저울이 수평을 이루도록 나에서 조각을 덜어 내고 식을 완성해요." },
        { L: 10, R: 12, pre: { R: 6 }, eq: "10-□=12-6", say: "이번에는 나에서 6개를 덜어 냈어요. 가에서 조각을 덜어 내 수평을 만들고 식을 완성해요." }],
        ok: "10−2=12−4, 10−4=12−6이에요. 가가 나보다 2개 적으니 나에서 2개 더 많이 덜어 내야 수평이 돼요." }) },
    { inst: "접시마다 초콜릿을 15개씩 담을 수 있어요. 위 그림처럼 빨간색 초콜릿의 수가 변하면 파란색 초콜릿의 수는 어떻게 변하는지 살펴보고, 아래 접시로 7+8=□+□의 식을 2개 만들어 보세요.", hints: ["빨간색이 1개 줄면 파란색은 1개 늘어나요. 7+8=6+9", "빨간색이 4개 늘면 파란색은 4개 줄어요. 7+8=11+4"],
      render: (b, a) => r6Plate(b, a, { r: 7, b: 8, need: 2, examples: [[3, 12, 4, 11], [10, 5, 12, 3]],
        choose: [{ q: "빨간색 초콜릿의 수가 늘어나면 파란색 초콜릿의 수는 어떻게 되나요?", o: ["늘어난 만큼 줄어들어요", "똑같이 늘어나요", "변하지 않아요"], a: 0, why: { "1": "접시에 담는 초콜릿은 15개로 같아요.", "2": "빨간색이 늘어나면 15개를 맞추기 위해 파란색이 바뀌어요." } }],
        ok: "접시에 담는 초콜릿이 15개로 같아서 빨간색이 늘어난 만큼 파란색이 줄어들어요." }) },
    { inst: "약속을 완성해요.", hints: ["저울이 수평을 이룬 것처럼 양쪽의 크기가 같아요."],
      render: (b, a) => blanks(b, a, ["4+8=5+7, 6−3=10−7, 4×6=8×3과 같이 ", { o: ["크기가 같은", "모양이 같은"], a: 0 }, " 두 양의 관계를 ", { o: ["등호(=)", "더하기 기호(+)"], a: 0 }, "를 사용하여 식으로 나타낼 수 있어요."]) },
    { inst: "보기에서 크기가 같은 두 양을 골라 등호를 사용한 식으로 나타내 보세요. 42+38=40×2는 보기로 이미 이었어요. 계산하기보다 수의 변화를 살펴 두 카드를 차례로 눌러요.", hints: ["30+30에서 한 수가 1 작아지면 다른 수는 1 커져야 해요.", "51−11에서 빼지는 수가 1 커지면 빼는 수도 1 커져야 해요."],
      render: (b, a) => r6Match(b, a, { faceUp: true, cols: 3, order: ["42+38", "30+30", "51-11", "52-12", "40×2", "29+31"], pairs: [["42+38", "40×2"], ["30+30", "29+31"], ["51-11", "52-12"]], pre: [0],
        ok: "30+30=29+31, 51−11=52−12예요. 계산하지 않고 수의 변화로 찾았어요!" }) }
  ],
  challenge: { inst: "등호를 사용한 식이 옳으면 참, 옳지 않으면 거짓을 고르세요. ‘저울에 올리기’를 누르면 양쪽을 저울로 볼 수 있어요. 아래 □도 채워 보세요.", hints: ["12−5는 12개에서 5개를 덜어 낸 것이에요.", "등호는 ‘답을 쓰라’는 표시가 아니라 양쪽의 크기가 같다는 뜻이에요."],
    render: (b, a) => r6Judge(b, a, { eqs: ["4+5=9", "12-5=9", "7=3+4", "8+2=10+4", "7+4=15-4", "8=8"],
      why: { 1: "12개에서 5개를 덜어 내면 7개예요. 9와 같나요?", 2: "등호 왼쪽에 수 하나만 있어도 돼요. 7과 3+4의 크기를 비교해요.", 3: "8+2는 10, 10+4는 14예요. 크기가 같나요?", 4: "7+4와 15−4를 저울에 올려 비교해 봐요.", 5: "8과 8은 크기가 같아요." },
      nums: [{ q: "7+4+5=7+□", a: 9, why: { "23": "23은 등호 양쪽의 수를 모두 더한 수예요. 7+□도 16이 되어야 해요.", "16": "16은 7+4+5의 값이에요. 7+□가 16이 되는 □를 구해요." } },
        { q: "2+15=5+□", a: 12, why: { "17": "17은 2+15의 값이에요. 2가 5로 3만큼 커졌으니 15는 3만큼 작아져야 해요." } },
        { q: "83−30=★−10에서 ★", a: 63, why: { "53": "53은 83−30의 값이에요. 빼는 수가 20만큼 작아졌으니 빼지는 수도 20만큼 작아져야 해요.", "103": "빼는 수가 작아지면 빼지는 수도 작아져야 차가 같아요." } }],
      ok: "등호는 양쪽의 크기가 같다는 뜻이에요. 4+5=9, 7=3+4, 7+4=15−4, 8=8은 참이고 12−5=9, 8+2=10+4는 거짓이에요." }) }
},
{
  id: "r9", no: "9~10", title: "생각을 더하다 ― 규칙적으로 모아 기부해 볼까요", soop: "탐구 정리하기(O)",
  question: "규칙을 찾아 식으로 나타내면 모은 금액을 어떻게 쉽게 구할 수 있을까요?",
  summary: "은지는 100원부터 시작하여 매일 200원씩 늘려가며 10일 동안 저금했어요. 날마다 저금한 100원짜리 동전은 1개, 3개, 5개, ...로 2개씩 늘어나요. 동전을 옮겨 정사각형을 만들면 1+3+5는 3×3이고, 10일 동안은 10×10=100(개)이므로 10000원이에요.",
  steps: [
    { name: "이해해요", inst: "“은지는 100원부터 시작하여 매일 200원씩 늘려가며 저금한 금액을 기부하려고 합니다. 10일 동안 저금하였을 때, 은지가 모은 금액은 모두 얼마인지 구해 봅시다.” 문제를 이해해 보세요.", hints: ["문제의 마지막 문장에 구하려는 것이 있어요.", "‘매일 200원씩 늘려가며’를 찾아봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "구하려는 것은 무엇인가요?", o: ["10일 동안 은지가 모은 금액", "은지가 첫째 날 저금한 금액", "은지가 저금한 날수"], a: 0 },
        { q: "은지는 매일 얼마씩 늘려가며 저금하나요?", o: ["100원", "200원", "300원"], a: 1, why: { "0": "100원은 첫째 날 저금한 금액이에요." } },
        { q: "얼마 동안 저금했나요?", o: ["5일", "10일", "20일"], a: 1 }],
        { ok: "100원부터 시작하여 매일 200원씩 늘려가며 10일 동안 모은 금액을 구해요." }) },
    { name: "계획해요", inst: "“저금한 동전의 수에서 규칙을 찾아볼까?” “그림을 그려 규칙을 식으로 나타내어 볼까?” 어떻게 해결하면 좋을지 골라 보세요.", hints: ["날마다 저금한 100원짜리 동전의 수를 그림으로 나타내 봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "어떤 방법으로 해결하면 좋을까요?", o: ["저금한 동전의 수에서 규칙을 찾아 식으로 나타내고, 그림을 그려 덧셈을 곱셈으로 바꾸어요", "날마다 저금한 금액을 대강 어림해요", "10일 동안 날마다 같은 금액을 저금했다고 생각해요"], a: 0, why: { "2": "은지는 매일 200원씩 늘려가며 저금했어요. 날마다 금액이 달라요." } },
        { q: "첫째 날 100원, 둘째 날 300원을 저금했어요. 100원짜리 동전으로 나타내면 둘째 날은 몇 개인가요?", o: ["2개", "3개", "4개"], a: 1 }],
        { ok: "100원짜리 동전의 수로 규칙을 찾고, 그림을 그려 식으로 나타내요." }) },
    { name: "해결해요 ①", inst: "100원짜리 동전으로 날마다 저금한 동전을 줄지어 놓았어요. 첫째 줄은 첫째 날, 둘째 줄은 둘째 날이에요. 동전의 수를 식으로 나타내 보세요.", hints: ["날마다 동전이 1개, 3개, 5개, 7개로 2개씩 늘어나요.", "넷째는 1+3+5에 넷째 날 7개를 더해요."],
      render: (b, a) => r6Shape(b, a, { gen: "coinOdd", kind: "coin", what: "동전", items: [{ n: 1, expr: "1" }, { n: 2, expr: "1+3" }, { n: 3, expr: { a: "1+3+5" } }, { n: 4, expr: { a: "1+3+5+7" } }],
        ok: "셋째는 1+3+5, 넷째는 1+3+5+7이에요. 동전이 3개, 5개, 7개씩 늘어나요." }) },
    { name: "해결해요 ②", inst: "보기처럼 동전의 위치를 옮겨 덧셈을 곱셈으로 바꾸어요(보기: 1+3 → 2×2). 셋째 줄의 동전을 첫째 줄로 옮겨 정사각형을 만들고, 열째까지의 동전과 금액을 구해 보세요.", hints: ["셋째 줄 동전 2개를 첫째 줄로 옮기면 줄마다 3개가 돼요. 1+3+5=3×3", "둘째는 2×2, 셋째는 3×3이에요. 열째는 10×10이에요."],
      render: (b, a) => r6Coins(b, a, { rows: [1, 3, 5],
        nums: [{ q: "열째까지의 동전을 정사각형으로 옮기면 한 줄에 몇 개씩인가요?", a: 10, unit: "개" },
          { q: "10일 동안 저금한 100원짜리 동전은 모두 몇 개인가요?", a: 100, unit: "개", why: { "19": "19개는 열째 날 하루에 저금한 동전 수예요.", "20": "10×10을 계산해요." } },
          { q: "은지가 10일 동안 모은 금액은 모두 얼마인가요?", a: 10000, unit: "원", why: { "100": "100은 동전의 수예요. 100원짜리 동전 100개는 얼마일까요?", "1900": "1900원은 열째 날 하루에 저금한 금액이에요." } }],
        ok: "1+3+5는 3×3이에요. 10일 동안은 10×10=100(개)이므로 은지는 10000원을 모았어요." }) },
    { name: "되돌아봐요", inst: "문제를 해결한 과정을 되돌아봐요.",
      render: (b, a) => writeStep(b, a, [
        { q: "문제를 해결한 방법을 설명해 보세요.", tag: "방법", ph: "예) 동전의 수를 1+3+5+...로 나타내고, 동전을 옮겨 정사각형을 만들어 10×10으로 구했어요." },
        { q: "다른 방법으로도 해결할 수 있을까요?", tag: "다른 방법", ph: "예) 100원+300원+500원+...+1900원을 차례로 더해요." }]) }
  ],
  challenge: { inst: "척척! 내 힘으로 풀어요. 준호는 200원부터 시작하여 매일 200원씩 늘려가며 10일 동안 저금했어요. 동전을 옮겨 직사각형을 만들고, 준호가 모은 금액을 구해 보세요.", hints: ["동전은 2개, 4개, 6개, 8개로 늘어나요. 2+4+6+8은 5×4로 바꿀 수 있어요.", "첫째 2×1, 둘째 3×2, 셋째 4×3, ... 열째는 11×10이에요."],
    render: (b, a) => r6Coins(b, a, { rows: [2, 4, 6, 8],
      nums: [{ q: "10일 동안 준호가 저금한 100원짜리 동전은 모두 몇 개인가요?", a: 110, unit: "개", why: { "100": "준호는 첫째 날 동전 2개로 시작해요. 열째는 11×10이에요.", "20": "20개는 열째 날 하루에 저금한 동전 수예요." } },
        { q: "준호가 10일 동안 모은 금액은 모두 얼마인가요?", a: 11000, unit: "원", why: { "110": "110은 동전의 수예요. 100원짜리 동전 110개는 얼마일까요?" } }],
      ok: "2+4+6+8은 5×4예요. 10일 동안은 11×10=110(개)이므로 준호는 11000원을 모았어요." }) }
},
{
  id: "r11", no: 11, title: "놀이를 더하다 ― 내 짝을 찾아라!", soop: "발표하기(P)",
  question: "크기가 같은 두 양을 어떻게 빨리 찾을 수 있을까요?",
  summary: "뒤집은 카드 2장의 크기가 같으면 등호를 사용한 식을 완성할 수 있어요. 모두 계산하기보다 한쪽 수가 커진 만큼 다른 수가 작아졌는지(덧셈), 같이 커졌는지(뺄셈) 살펴보면 빨리 찾을 수 있어요.",
  steps: [
    { name: "놀이 방법 알기", inst: "2명이 하는 놀이예요. 놀이 방법을 차례대로 눌러 보세요.", hints: ["먼저 문제 카드의 식을 완성하고 반으로 잘라요.", "카드를 더 많이 가져간 사람이 이겨요."],
      render: (b, a) => sequence(b, a, ["카드 2장을 골라 뒤집어요", "문제 카드의 식을 완성하고 반으로 잘라요", "카드를 더 많이 가져간 사람이 이겨요", "자른 카드를 섞어 뒤집어 놓고 가위바위보로 순서를 정해요", "크기가 같으면 카드를 가져오고, 다르면 다시 뒤집어 놓아요"], [1, 3, 0, 4, 2],
        { ok: "식 완성 → 섞어 뒤집기 → 2장 뒤집기 → 같으면 가져오기 → 많이 가져간 사람이 승리!" }) },
    { name: "문제 카드 완성하기", inst: "문제 카드의 등호를 사용한 식을 완성해요. 왼쪽과 똑같은 식이 아니면 어떤 수라도 좋아요(두 자리 수까지).", hints: ["5+13에서 5가 4로 1만큼 작아지면 13은 14로 1만큼 커져야 해요.", "4×6에서 4를 반으로 하면 6은 2배가 되어야 해요. 2×12"],
      render: (b, a) => r6EqFill(b, a, { items: [{ l: "5+13", op: "+", ex: "4+14" }, { l: "12-2", op: "-", ex: "15-5" }, { l: "10+7", op: "+", ex: "8+9" }, { l: "4×6", op: "×", ex: "3×8" }],
        ok: "크기가 같은 두 양으로 문제 카드를 완성했어요. 친구와 서로 맞는지 확인해 봐요." }) },
    { name: "놀이하기", inst: "카드 2장을 차례로 뒤집어요. 크기가 같으면 카드를 가져오고, 다르면 다시 뒤집혀요. 친구와 ‘둘이 번갈아 하기’로 놀이해도 좋아요.", hints: ["뒤집었던 카드의 자리를 잘 기억해요.", "9+9와 짝이 되는 카드는 5+13처럼 더해서 18이 되는 카드예요."],
      render: (b, a) => r6Match(b, a, { pairs: R6PAIRS, cols: 4, ok: "크기가 같은 두 양을 찾아 등호로 이었어요!" }) },
    { name: "정리하기", inst: "놀이에서 알게 된 것을 정리해요.", hints: ["30+30=29+31, 51−11=52−12를 떠올려요."],
      render: (b, a) => blanks(b, a, ["크기가 같은 두 양인지 알아볼 때는 모두 계산하기보다 수의 ", { o: ["변화를", "색깔을"], a: 0 }, " 살펴봐요. 덧셈에서는 한 수가 커진 만큼 다른 수가 ", { o: ["작아지면", "커지면"], a: 0 }, " 크기가 같고, 뺄셈에서는 빼지는 수가 커진 만큼 빼는 수도 ", { o: ["커지면", "작아지면"], a: 0 }, " 크기가 같아요."]) },
    { name: "확인하기", inst: "놀이 중에 두 카드를 뒤집었어요. 물음에 답해 보세요.", hints: ["24에서 25로 1 커졌으면 17은 1 작아져야 해요.", "18에서 20으로 2 커졌으면 25는 2 작아져야 해요."],
      render: (b, a) => quiz(b, a, [
        { q: "가져올 수 있는 두 카드는 어느 것인가요?", o: ["24+17과 25+16", "30−12와 31−11", "6×4와 5×5"], a: 0, why: { "1": "빼지는 수가 1만큼 커지면 빼는 수도 1만큼 커져야 해요. 31−13이어야 해요.", "2": "6×4는 24, 5×5는 25로 크기가 달라요." } },
        { q: "18+25와 짝이 되는 카드는 어느 것인가요?", o: ["20+23", "20+27", "16+25"], a: 0, why: { "1": "18에서 20으로 2만큼 커졌으니 25는 2만큼 작아져야 해요.", "2": "18은 16으로 작아졌는데 25는 그대로예요." } }],
        { ok: "수의 변화를 살펴보면 계산하지 않고도 크기가 같은 두 양을 찾을 수 있어요." }) }
  ],
  challenge: { inst: "카드가 20장인 어려운 판이에요. 뒤집은 횟수를 줄여 모든 짝을 찾아보세요.", hints: ["곱셈 카드는 곱셈 카드끼리, 뺄셈 카드는 뺄셈 카드끼리 짝이 될 때가 많아요.", "25+17은 한 수가 2 커진 만큼 다른 수가 2 작아진 27+15와 짝이에요."],
    render: (b, a) => r6Match(b, a, { pairs: R6PAIRS2, cols: 5, ok: "어려운 판에서도 크기가 같은 두 양을 모두 찾았어요!" }) }
},
{
  id: "r12", no: 12, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "규칙과 관계에서 배운 내용을 잘 알고 있나요?",
  summary: "수의 배열과 도형의 배열에서 규칙을 찾아 식으로 나타내고, 계산식의 배열에서 다음 계산 결과를 추측해요. 크기가 같은 두 양은 등호를 사용하여 식으로 나타내요.",
  steps: [
    { name: "척척! 1번", inst: "수의 배열에서 → 방향의 규칙을 찾아 이웃한 두 수로 식을 써 보세요.", hints: ["128, 64, 32는 작아지는 배열이에요. 차가 일정한가요?", "작아지는 규칙은 뺄셈식이나 나눗셈식으로 나타내요. 128÷2=64"],
      render: (b, a) => r6EqWrite(b, a, { fig: () => r6GridFig([[128, 64, 32, 16, 8, 4]]),
        choose: [{ q: "128부터 → 방향의 규칙은 무엇인가요?", o: ["64씩 작아져요", "1/2만큼이 돼요", "2배가 돼요"], a: 1, why: { "0": "128−64=64이지만 64−32=32예요. 차가 일정하지 않아요.", "2": "→ 방향으로 갈수록 수가 작아져요." } }],
        rules: [{ q: "→ 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", seqs: [[128, 64, 32, 16, 8, 4]], need: 2 }],
        ok: "128부터 → 방향으로 1/2만큼이 돼요. 128÷2=64, 64÷2=32처럼 나타내요." }) },
    { name: "척척! 2번", inst: "사각형으로 만든 계단 모양의 배열이에요. 사각형의 수를 식으로 나타내고, 다섯째 모양을 판에 만들어 보세요.", hints: ["둘째는 1+2, 셋째는 1+2+3이에요.", "다섯째는 넷째 모양 아래쪽에 사각형 5개가 늘어난 계단 모양이에요."],
      render: (b, a) => r6Shape(b, a, { gen: "tri", what: "사각형", layers: true, items: [{ n: 1, expr: "1" }, { n: 2, expr: "1+2" }, { n: 3, expr: { a: "1+2+3" } }, { n: 4, expr: { a: "1+2+3+4" } }], build: { n: 5, from: 4 },
        ok: "셋째는 1+2+3, 넷째는 1+2+3+4예요. 다섯째는 아래쪽으로 사각형이 5개 늘어난 15개예요." }) },
    { name: "척척! 3번", inst: "등호(=)를 사용한 식을 완성해요. 계산하기보다 수의 변화를 살펴봐요.", hints: ["6+8=7+□: 더해지는 수가 1만큼 커졌으니 더하는 수는 1만큼 작아져야 해요.", "30−15=□−25: 빼는 수가 10만큼 커졌으니 빼지는 수도 10만큼 커져야 해요."],
      render: (b, a) => numbers(b, a, [
        { q: "6+8=7+□", a: 7, why: { "14": "14는 6+8의 값이에요. 7+□가 14가 되어야 해요.", "9": "더해지는 수가 커지면 더하는 수는 작아져야 해요." } },
        { q: "13+□=23+12", a: 22, why: { "35": "35는 23+12의 값이에요. 13+□가 35가 되어야 해요.", "2": "13이 23으로 10만큼 커졌어요. 그러니 □는 12보다 10만큼 커야 해요." } },
        { q: "11−□=10−5", a: 6, why: { "5": "5는 10−5의 값이에요. 11−□도 5가 되어야 해요.", "4": "빼지는 수가 1만큼 커지면 빼는 수도 1만큼 커져야 해요." } },
        { q: "30−15=□−25", a: 40, why: { "15": "15는 30−15의 값이에요. □−25가 15가 되어야 해요.", "20": "빼는 수가 커지면 빼지는 수도 커져야 해요." } }],
      { ok: "7, 22, 6, 40이에요. 수의 변화를 살펴 등호 양쪽의 크기를 같게 만들었어요." }) },
    { name: "척척! 4번", inst: "계산식의 배열에서 규칙을 찾아 여섯째에 알맞은 식을 써 보세요.", hints: ["덧셈식: 더해지는 수는 100씩 커지고 더하는 수는 149 그대로예요.", "뺄셈식: 빼지는 수와 빼는 수가 모두 110씩 커지면 차는 131로 그대로예요."],
      render: (b, a) => r6Seq(b, a, { calc: true, lists: [
        { title: "덧셈식의 배열", heads: ["더해지는 수", "더하는 수", "합"], rows: [{ lab: "첫째", e: "541+149=690" }, { lab: "둘째", e: "641+149=790" }, { lab: "셋째", e: "741+149=890" }, { lab: "넷째", e: "841+149=990" }, { lab: "다섯째", e: "941+149=1090" }, { lab: "여섯째", e: "□+□=□", a: [1041, 149, 1190] }] },
        { title: "뺄셈식의 배열", heads: ["빼지는 수", "빼는 수", "차"], rows: [{ lab: "첫째", e: "254-123=131" }, { lab: "둘째", e: "364-233=131" }, { lab: "셋째", e: "474-343=131" }, { lab: "넷째", e: "584-453=131" }, { lab: "다섯째", e: "694-563=131" }, { lab: "여섯째", e: "□-□=□", a: [804, 673, 131] }] }],
      ok: "여섯째 덧셈식은 1041+149=1190, 뺄셈식은 804−673=131이에요." }) },
    { name: "꼭꼭! 확인하고 정리해요", inst: "수의 배열과 계산식의 배열에서 규칙을 찾아 □ 안에 알맞은 수를 구하고, 그 수가 적힌 칸을 색칠해 보세요.", hints: ["3, 6, 12는 2배씩 커져요.", "45−30, 55−40: 빼지는 수와 빼는 수가 모두 10씩 커져요. 11÷1, 22÷2: 몫은 11로 같아요."],
      render: (b, a) => r6Letters(b, a, { probs: ["① 3, 6, 12, □, 48, □", "② 45−30=15, 55−40=15, 65−50=15, 75−□=15", "③ 11÷1=11, 22÷2=11, 33÷3=11, □÷4=11"],
        tiles: [[24, "규"], [34, "사"], [96, "칙"], [54, "연"], [60, "찾"], [78, "심"], [44, "기"], [42, "산"]], ans: [24, 96, 60, 44], word: "규칙 찾기",
        ok: "□는 24, 96, 60, 44예요." }) }
  ],
  challenge: { inst: "나눗셈식의 배열에서 규칙을 찾아 나누는 수가 63이 되는 나눗셈식을 써 보세요. 이해해요 → 계획해요 → 해결해요 → 되돌아봐요 순서로 풀어요.", hints: ["나누어지는 수는 111111111씩, 나누는 수는 9씩 커지고 몫은 12345679로 같아요.", "63은 9의 7배예요. 그러면 몇째일까요?"],
    render: (b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "나눗셈식의 배열", heads: ["나누어지는 수", "나누는 수", "몫"], rows: [{ lab: "첫째", e: "111111111÷9=12345679" }, { lab: "둘째", e: "222222222÷18=12345679" }, { lab: "셋째", e: "333333333÷27=12345679" }, { lab: "넷째", e: "444444444÷36=12345679" }, { lab: "다섯째", e: "555555555÷45=12345679" }, { lab: "?", e: "□÷63=□", a: [777777777, 12345679], why: "나누는 수 63은 9의 몇 배인지 생각해 봐요. 나누어지는 수도 111111111의 그만큼 배가 되고, 몫은 그대로예요." }] }],
      choose: [{ q: "나누는 수가 63이 되는 나눗셈식은 몇째일까요?", o: ["여섯째", "일곱째", "여덟째"], a: 1, why: { "0": "여섯째 나누는 수는 45보다 9 큰 54예요.", "2": "여덟째 나누는 수는 9×8=72예요." } }],
      ok: "나누는 수 63은 9의 7배이므로 일곱째, 777777777÷63=12345679예요." }) }
}
];
