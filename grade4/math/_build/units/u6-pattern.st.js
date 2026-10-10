//@@APP
const APP={title:"우리 반 나눔 저금통 프로젝트", unit:"4-1 수학 6. 규칙과 관계", key:"s41-pattern-v1", welcome:"우리 반 나눔 저금통 프로젝트에 온 것을 환영해요", intro:"4학년 1반이 나눔 저금통을 만들어 규칙적으로 모으고 기부해요. 사물함 번호와 달력, 게시판 무늬, 저금 기록 식에서 규칙을 찾고, 저울로 공정하게 나누며 크기가 같은 두 양을 등호로 나타내요."};
//@@UNIT
/* 이야기 버전: 교과서 버전(u6-pattern.tb.js)의 r6 부품을 복사해 쓰고, 확인은 autoRun으로 저절로 해요. 이 파일에서 새로 만든 것은 앞글자 r6s. */
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
    el, filled: () => st.every(v => v != null), key: () => st.join(","),
    given: () => st.map((v, i) => v == null ? "-" : items[i].o[v]).join(" / "),
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
function r6Enter(inp) { inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } }); return inp; }
function r6Nums(items) {
  const rows = items.map(it => {
    const inp = r6Enter(h("input", { type: "text", inputmode: "numeric", class: "r6in", "aria-label": it.q, autocomplete: "off" }));
    return { it, inp, el: h("div", { class: "r6eqrow" }, h("span", { class: "jua" }, it.q), inp, it.unit ? h("span", {}, it.unit) : null) };
  });
  return {
    el: h("div", {}, rows.map(r => r.el)),
    filled: () => rows.every(r => r.inp.value.trim() !== ""), key: () => rows.map(r => r.inp.value.trim()).join("|"),
    given: () => rows.map(r => r.inp.value.trim() || "-").join(", "),
    answers: () => items.map(it => `${it.a}${it.unit || ""}`),
    check() {
      for (const { it, inp } of rows) {
        const raw = r6Norm(inp.value).replace(/(개|원)$/, ""), v = Number(raw), good = raw !== "" && v === it.a;
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
    filled: () => (!N || N.filled()) && (!C || C.filled()),
    key: () => [N ? N.key() : "", C ? C.key() : ""].join("#"),
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
/* 수를 눌러 규칙 찾기 → 빈칸 채우기 → (고르기)  ─ 이야기 버전: 다 고르고 쓰면 1.2초 뒤 저절로 확인
   opt = { rows | spiral, traces:[{start:[행,열]|번호, dir, notDirs, need, say}], nums, choose, ok } */
function r6Grid(body, api, opt) {
  const M = opt.spiral ? r6SpiralModel(opt.spiral) : r6GridModel(opt.rows);
  const tasks = (opt.traces || []).map(t => Object.assign({ need: 3 }, t));
  const blanks = M.pts.filter(p => p.a !== undefined);
  const st = { sel: [], done: [], fill: {} }, log = [];
  let ti = 0, kind = null, kval = "", auto = () => {};
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
    const inp = r6Enter(h("input", { type: "text", class: "r6in", "aria-label": `${p.lab}에 알맞은 수`, autocomplete: "off", inputmode: typeof p.a === "number" ? "numeric" : "text" }));
    inp.addEventListener("input", () => { st.fill[p.i] = inp.value.trim(); paint(); auto(); });
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
    paint(); drawSide(); auto();
  }
  function paint() { r6Paint(svg, M, st, tap); }
  function drawSide() {
    side.innerHTML = "";
    if (ti < tasks.length) {
      const t = tasks[ti], vals = st.sel.map(i => M.pts[i].v), run = r6RunOf(M, st.sel);
      side.append(h("div", { class: "r6task" }, `${tasks.length > 1 ? (ti + 1) + ". " : ""}${t.say}`));
      side.append(h("div", { class: "r6run" }, vals.length ? "누른 수: " + vals.join(" → ") : "수를 차례로 눌러 줄을 그어요. 마지막 수를 다시 누르면 지워져요."));
      const inp = r6Enter(h("input", { type: "text", inputmode: "numeric", class: "r6in", "aria-label": "몇씩(몇 배)", value: kval, autocomplete: "off" }));
      inp.addEventListener("input", () => { kval = inp.value; auto(); });
      const kinds = h("div", { class: "r6kinds" }, R6KBTN.map(([k, t2]) => h("button", { class: kind === k ? "r6pick" : "", onclick: e => { kind = k; [...e.currentTarget.parentNode.children].forEach(b => b.classList.toggle("r6pick", b === e.currentTarget)); auto(); } }, t2)));
      side.append(h("div", { class: "r6rule" }, h("span", {}, run ? `${vals[0]}부터 ${r6DirPhrase(run.dir)}` : "(시작하는 수)부터 (방향)으로"), inp), kinds);
      side.append(h("div", { class: "r6row" }, h("button", { class: "r6btn", onclick: () => { st.sel = []; paint(); drawSide(); } }, "줄 다시 긋기")));
      side.append(h("p", { class: "r6muted" }, "줄을 긋고 규칙을 고르면 저절로 확인해요."));
    } else {
      if (blanks.length) side.append(h("div", { class: "r6task" }, "빈칸에 알맞은 수를 써요."), ...fillEls.map(f => f.el));
      side.append(...X.els);
    }
  }
  function check() {
    api.tryOnce();
    if (ti < tasks.length) {
      const t = tasks[ti], sId = sIdOf(t), vals = st.sel.map(i => M.pts[i].v), giv = `${vals.join("→")} ${kval}${kind ? R6KBTN.find(x => x[0] === kind)[1] : ""}`;
      if (st.sel.length < t.need) { api.fail(`이웃한 수를 ${t.need}개 이상 차례로 눌러 줄을 그어요.`, giv); return false; }
      const run = r6RunOf(M, st.sel);
      if (!run) { api.fail("한 줄로 이어진 수를 차례로 눌러요.", giv); return false; }
      if (sId != null && st.sel[0] !== sId) { api.fail(`${M.pts[sId].v}부터 시작해요. ‘줄 다시 긋기’를 누르고 다시 해 봐요.`, giv); return false; }
      if (!allowed(t, run.dir)) { api.fail(t.dir ? `${r6DirPhrase(t.dir)} 이어지게 눌러요.` : (t.notMsg || "앞에서 찾은 것과 다른 방향으로 찾아요."), giv); return false; }
      const rs = r6RulesOf(vals);
      if (!rs.length) { api.fail("이 줄은 일정한 규칙으로 변하지 않아요. 다른 줄을 찾아요.", giv); return false; }
      const k = Number(r6Norm(kval));
      if (!kval.trim() || !(k > 0)) { api.fail("몇씩(몇 배) 변하는지 수를 써요.", giv); return false; }
      if (!rs.find(r => r.kind === kind && r.k === k)) {
        const r0 = rs[0], add = x => x === "up" || x === "down";
        let m = "고른 방향으로 갈수록 수가 커지는지 작아지는지 다시 살펴봐요.";
        if (r0.kind === kind) m = add(kind) ? "커지고 작아지는 것은 맞아요. 이웃한 두 수의 차를 다시 구해 봐요." : "몇 배인지(몇분의 1인지) 다시 구해 봐요. 이웃한 두 수를 견주어요.";
        else if (!add(r0.kind) && add(kind)) m = "이웃한 두 수의 차가 일정하지 않아요. 몇 배가 되는지, 몇분의 1이 되는지 살펴봐요.";
        else if (add(r0.kind) && !add(kind)) m = "몇 배가 되는 규칙이 아니에요. 이웃한 두 수의 차를 구해 봐요.";
        api.fail(m, giv); return false;
      }
      const good = rs.find(r => r.kind === kind && r.k === k), sent = `${vals[0]}부터 ${r6DirPhrase(run.dir)} ${R6KIND[good.kind](good.k)}`;
      log.push(sent); st.done.push(st.sel.slice()); st.sel = []; kind = null; kval = ""; ti++;
      if (ti < tasks.length || hasFinal) { paint(); drawSide(); api.hint(`○ ${sent}. ${ti < tasks.length ? "다음 규칙도 찾아요." : "이제 아래 물음을 해결해요."}`); return false; }
      api.done(log.join(" / "), opt.ok || `${sent}. 규칙을 잘 찾았어요!`); return true;
    }
    for (const f of fillEls) {
      const raw = f.inp.value.trim(), good = typeof f.p.a === "number" ? (raw !== "" && Number(r6Norm(raw)) === f.p.a) : r6Norm(raw) === r6Norm(f.p.a);
      f.inp.style.borderColor = good ? "var(--ok)" : "var(--no)";
      if (!good) { api.fail(raw === "" ? "빈칸을 모두 채워요." : (opt.fillWhy && opt.fillWhy[f.p.lab]) || `${r6J(f.p.lab, "은/는")} 규칙을 이용해 이웃한 수에서 구해 봐요.`, fillEls.map(x => x.inp.value || "-").join(", ")); return false; }
    }
    const bad = X.check();
    if (bad) { api.fail(bad, X.given()); return false; }
    log.push(fillEls.map(f => `${f.p.lab} ${f.inp.value.trim()}`).join(", "));
    api.done(log.filter(Boolean).join(" / "), opt.ok); return true;
  }
  const ready = () => ti < tasks.length ? (st.sel.length >= tasks[ti].need && !!kind && kval.trim() !== "") : (fillEls.every(f => f.inp.value.trim() !== "") && X.filled());
  const sign = () => [ti, st.sel.join(","), kind, kval.trim(), fillEls.map(f => f.inp.value.trim()).join(","), X.key()].join("|");
  auto = autoRun(ready, sign, check, 1200);
  side.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
  side.addEventListener("input", () => auto());
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
/* opt = { fig, rules:[{q, seqs:[[…]], both, need}], choose, ok }  ─ 식을 모두 쓰면 0.9초 뒤 저절로 확인 */
function r6EqWrite(body, api, opt) {
  if (opt.fig) body.append(opt.fig());
  let focus = null; const groups = [];
  opt.rules.forEach(rule => {
    const pairs = r6Pairs(rule.seqs, rule.both), ins = [];
    const box = h("div", { class: "qitem" }, h("div", { class: "jua" }, rule.q));
    for (let n = 0; n < (rule.need || 2); n++) {
      const inp = r6Enter(h("input", { type: "text", class: "r6eqin", "aria-label": `${rule.q} 식 ${n + 1}`, placeholder: "□ ○ □ = □", autocomplete: "off" }));
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
    if (/^\d+=\d+$/.test(s)) return "같은 수를 등호로만 이으면 규칙이 드러나지 않아요. 몇씩(몇 배) 변하는지 + − × ÷ 기호를 써서 나타내요.";
    const m = s.match(/^(\d+)([+\-×÷])(\d+)=(\d+)$/);
    if (!m) return "‘15+1=16’처럼 (수)(기호)(수)=(수)의 꼴로 써요.";
    const a = +m[1], op = m[2], b = +m[3], c = +m[4], val = r6Eval(`${a}${op}${b}`);
    if (val !== c) return Number.isInteger(val) ? `계산이 맞지 않아요. ${r6J(`${a}${r6Show(op)}${b}`, "은/는")} ${r6J(String(val), "이에요/예요")}.` : `${r6J(`${a}÷${b}`, "은/는")} 나누어떨어지지 않아요. 계산을 다시 해 봐요.`;
    const fit = g.pairs.find(p => p.op === op && p.k === b && p.a === a && p.c === c) || (op === "×" && g.pairs.find(p => p.op === "×" && p.k === a && p.a === b && p.c === c));
    if (fit) return null;
    const p0 = g.pairs.find(p => p.a === a && p.c === c) || (op === "×" && g.pairs.find(p => p.a === b && p.c === c));
    if (p0) return `계산은 맞지만 이 방향의 규칙이 드러나지 않아요. ${{ "+": `${p0.k}씩 커지는`, "-": `${p0.k}씩 작아지는`, "×": `${p0.k}배가 되는`, "÷": `1/${p0.k}만큼이 되는` }[p0.op]} 규칙이니 ${R6OPNAME[p0.op]}으로 나타내요.`;
    if (g.pairs.find(p => p.a === c && p.c === a)) return "방향을 거꾸로 썼어요. 정한 방향으로 앞에 있는 수에서 시작해 다음 수가 되는 식을 써요.";
    return "계산은 맞지만 물음에서 말한 방향으로 이웃한 두 수가 아니에요. 그 방향으로 이웃한 두 수로 식을 써요.";
  }
  const all = groups.flatMap(g => g.ins);
  const run = () => {
    api.tryOnce();
    const given = groups.map(g => g.ins.map(i => i.value.trim() || "-").join(", ")).join(" / ");
    for (const g of groups) {
      const seen = new Set();
      for (const inp of g.ins) {
        const s = r6Norm(inp.value), bad = judge(g, s) || (seen.has(s) ? "같은 식을 두 번 썼어요. 다른 이웃한 두 수로 써요." : null);
        inp.style.borderColor = bad ? "var(--no)" : "var(--ok)";
        if (bad) { api.fail(bad, given); return false; }
        seen.add(s);
      }
    }
    const cb = C && C.check();
    if (cb) { api.fail(cb, given + " / " + C.given()); return false; }
    api.done(given, opt.ok || "규칙에 맞게 이웃한 두 수로 식을 썼어요! 식은 한 가지만 있는 것이 아니에요."); return true;
  };
  const auto = autoRun(() => all.every(i => i.value.trim() !== "") && (!C || C.filled()), () => all.map(i => r6Norm(i.value)).join("|") + "#" + (C ? C.key() : ""), run, 900);
  all.forEach(i => { i.addEventListener("input", auto); i.addEventListener("change", auto); });
  if (C) C.el.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
}

/* ---------- 도형의 배열 ---------- */
const R6GEN = {
  rect3: n => { const a = []; for (let r = 0; r < 3; r++) for (let c = 0; c < n; c++) a.push([r, c]); return a; },          // 3줄 직사각형 3, 6, 9, 12
  tri: n => { const a = []; for (let r = 0; r < n; r++) for (let c = 0; c <= r; c++) a.push([r, c]); return a; },            // 1, 3, 6, 10 (삼각형·계단)
  ell: n => { const a = []; for (let r = 0; r < n; r++) a.push([r, 0]); for (let c = 1; c < n; c++) a.push([n - 1, c]); return a; },   // ㄴ 모양 1, 3, 5, 7
  plus: n => { const m = n - 1, a = [[m, m]]; for (let k = 1; k <= m; k++) a.push([m - k, m], [m + k, m], [m, m - k], [m, m + k]); return a; },   // 십자 1, 5, 9, 13
  stair2: n => { const a = [[0, 0], [0, 1], [0, 2]]; for (let k = 1; k < n; k++) a.push([k, k + 1], [k, k + 2]); return a; },  // 3, 5, 7, 9 (아래로 2개씩)
  rectP: n => { const a = []; for (let r = 0; r < n; r++) for (let c = 0; c < n + 2; c++) a.push([r, c]); return a; },       // 가로 n+2 × 세로 n: 3, 8, 15, 24
  coinOdd: n => { const a = []; for (let r = 0; r < n; r++) for (let c = 0; c < 2 * r + 1; c++) a.push([r, c]); return a; } // 1, 3, 5, 7개 줄
};
const R6LAYER = { rectP: (r, c) => Math.max(r + 1, c - 1, 1), tri: r => r + 1, stair2: r => r + 1, coinOdd: r => r + 1 };
function r6N0(cells) { const mr = Math.min(...cells.map(c => c[0])), mc = Math.min(...cells.map(c => c[1])); return cells.map(([r, c]) => [r - mr, c - mc]); }
function r6Key(cells) { return r6N0(cells).map(c => c.join(",")).sort().join(";"); }
function r6Bbox(cells) { const n = r6N0(cells); return { R: Math.max(...n.map(c => c[0])) + 1, C: Math.max(...n.map(c => c[1])) + 1 }; }
function r6Piece(g, kind, x, y, u, col, lab) {
  if (kind === "stone") {
    g.append(svgEl("circle", { cx: x + u / 2, cy: y + u / 2, r: u * .43, fill: "#2B2B2B" }));
    g.append(svgEl("circle", { cx: x + u * .37, cy: y + u * .36, r: u * .1, fill: "#8A8A8A" }));
  } else if (kind === "coin") {
    const c50 = lab === "50";
    g.append(svgEl("circle", { cx: x + u / 2, cy: y + u / 2, r: u * .44, fill: c50 ? "#E9D7A8" : "#DADADA", stroke: c50 ? "#A88A45" : "#8E8E8E", "stroke-width": 1.5 }));
    g.append(txt(x + u / 2, y + u / 2 + 1, lab || "100", u * (String(lab || "100").length > 2 ? .3 : .36), { fill: "#555" }));
  } else {
    g.append(svgEl("rect", { x: x + 1, y: y + 1, width: u - 2, height: u - 2, rx: kind === "mod" ? 4 : 2, fill: col || "#F6C85F", stroke: "#7A6233", "stroke-width": 1.5 }));
    if (kind === "mod") g.append(svgEl("rect", { x: x + u * .22, y: y + u * .22, width: u * .56, height: u * .56, rx: 2, fill: "none", stroke: "#fff", "stroke-width": 1.2, opacity: .7 }));
  }
}
function r6ShapeSvg(cells, o) {
  const u = o.u || 30, p = 6, R = o.box.R, C = o.box.C, svg = makeSvg(C * u + p * 2, R * u + p * 2);
  const nc = r6N0(cells), bb = r6Bbox(cells), dy = o.anchor === "top" ? 0 : R - bb.R;
  nc.forEach(([r, c]) => r6Piece(svg, o.kind, p + c * u, p + (r + dy) * u, u, o.layer ? R6LAY[(o.layer(r, c) - 1) % R6LAY.length] : null, o.lab));
  return svg;
}
function r6QSvg(box, u = 30) { const svg = makeSvg(box.C * u + 12, box.R * u + 12); svg.append(txt((box.C * u + 12) / 2, (box.R * u + 12) / 2, "?", Math.min(60, box.R * u * .6), { fill: "#9AA9A3" })); return svg; }
function r6BoxOf(gen, ns) { return ns.reduce((b, n) => { const bb = r6Bbox(R6GEN[gen](n)); return { R: Math.max(b.R, bb.R), C: Math.max(b.C, bb.C) }; }, { R: 1, C: 1 }); }
function r6ShapeRow(gen, ns, o = {}) {
  const G = R6GEN[gen], all = ns.concat(o.mystery ? [o.mystery] : []), box = r6BoxOf(gen, all);
  const lay = o.layers ? R6LAYER[gen] : null;
  const wrap = h("div", { class: "r6figs", style: `--n:${all.length}` });
  ns.forEach(n => wrap.append(h("div", {}, r6ShapeSvg(G(n), { kind: o.kind || "sq", box, anchor: o.anchor, layer: lay, lab: o.lab }), h("div", { class: "r6cap" }, R6ORD[n]))));
  if (o.mystery) wrap.append(h("div", {}, r6ShapeSvg(G(o.mystery), { kind: o.kind || "sq", box, anchor: o.anchor, layer: lay, lab: o.lab }), h("div", { class: "r6cap" }, "다음 모양")));
  return wrap;
}
/* opt = { gen, kind, lab, what:"사각형", items:[{n, cnt:true|"?", expr:"2+3"|{a, alt}, hide}], build:{n, from}, anchor, layers, nums, choose, ok }
   이야기 버전: 칸을 모두 채우고(판에 모양을 다 놓고) 손을 멈추면 저절로 확인 */
function r6Shape(body, api, opt) {
  const G = R6GEN[opt.gen], kind = opt.kind || "sq", what = opt.what || "사각형", lay = opt.layers ? R6LAYER[opt.gen] : null;
  const shownNs = opt.items.filter(it => !it.hide).map(it => it.n), box = r6BoxOf(opt.gen, shownNs.length ? shownNs : [1]);
  const row = h("div", { class: "r6figs", style: `--n:${opt.items.length}` }), checks = [], answers = [];
  let auto = () => {}, focusE = null;
  opt.items.forEach(it => {
    const cell = h("div", {}, it.hide ? r6QSvg(box) : r6ShapeSvg(G(it.n), { kind, box, anchor: opt.anchor, layer: lay, lab: opt.lab }), h("div", { class: "r6cap" }, R6ORD[it.n]));
    const cnt = G(it.n).length;
    if (it.cnt === true) cell.append(h("div", { class: "r6val" }, `${cnt}개`));
    else if (it.cnt === "?") {
      const inp = r6Enter(h("input", { type: "text", inputmode: "numeric", "aria-label": `${R6ORD[it.n]} ${what}의 수`, placeholder: "□개", autocomplete: "off" }));
      cell.append(inp); answers.push(`${R6ORD[it.n]} ${cnt}개`);
      checks.push(() => { const raw = r6Norm(inp.value).replace(/개$/, ""), good = raw !== "" && Number(raw) === cnt; inp.style.borderColor = good ? "var(--ok)" : "var(--no)"; return good ? null : (raw === "" ? "빈칸을 모두 채워요." : `${R6ORD[it.n]} 모양의 ${r6J(what, "을/를")} 다시 세어 봐요.`); });
    }
    if (typeof it.expr === "string") cell.append(h("div", { class: "r6val" }, r6Show(it.expr)));
    else if (it.expr) {
      const inp = r6Enter(h("input", { type: "text", "aria-label": `${R6ORD[it.n]} 식`, placeholder: "식", autocomplete: "off" }));
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
  body.append(row);
  if (opt.items.some(it => it.expr && typeof it.expr === "object")) body.append(r6EqKeys(() => focusE || row.querySelector("input")));
  // 다음 모양 만들기 판
  let built = null, buildCheck = null, target = null;
  if (opt.build) {
    const B = opt.build, bb = r6Bbox(G(B.n)), R = bb.R + 1, C = bb.C + 1, u = 44, pad = 6;
    target = G(B.n);
    const svg = makeSvg(C * u + pad * 2, R * u + pad * 2); svg.style.touchAction = "manipulation";
    built = new Set();
    const info = h("div", { class: "readout" });
    const draw = () => {
      svg.innerHTML = "";
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
        const x = pad + c * u, y = pad + r * u;
        if (built.has(r + "," + c)) r6Piece(svg, kind === "mod" ? "mod" : kind, x, y, u, kind === "mod" ? "#9ED39A" : null, opt.lab);
        else if (kind === "stone" || kind === "coin") svg.append(svgEl("circle", { cx: x + u / 2, cy: y + u / 2, r: u * .4, fill: "none", stroke: "#D3DDD9", "stroke-dasharray": "4 4" }));
        else svg.append(svgEl("rect", { x: x + 2, y: y + 2, width: u - 4, height: u - 4, rx: 3, fill: "none", stroke: "#D3DDD9", "stroke-dasharray": "4 4" }));
      }
      info.textContent = `놓은 ${what}: ${built.size}개`;
      auto();
    };
    svg.addEventListener("click", ev => {
      const p = svgPt(svg, ev), c = Math.floor((p.x - pad) / u), r = Math.floor((p.y - pad) / u);
      if (r < 0 || c < 0 || r >= R || c >= C) return;
      const k = r + "," + c; built.has(k) ? built.delete(k) : built.add(k); draw();
    });
    const side = h("div", { class: "side r6side" }, h("div", { class: "r6task" }, `${R6ORD[B.n]} 모양 만들기`), h("p", { class: "r6muted" }, `칸을 누르면 ${r6J(what, "이/가")} 놓이고, 다시 누르면 빠져요. 다 놓으면 저절로 확인해요.`), info,
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
  const ins = () => [...row.querySelectorAll("input")];
  const run = () => {
    api.tryOnce();
    const given = ins().map(i => i.value.trim() || "-").join(", ") + (built ? ` / 놓은 ${what} ${built.size}개` : "");
    for (const c of checks) { const m = c(); if (m) { api.fail(m, given); return false; } }
    if (buildCheck) { const m = buildCheck(); if (m) { api.fail(m, given); return false; } }
    const m = X.check(); if (m) { api.fail(m, given + " / " + X.given()); return false; }
    api.done(given, opt.ok); return true;
  };
  auto = autoRun(() => ins().every(i => i.value.trim() !== "") && (!built || built.size >= target.length) && X.filled(),
    () => ins().map(i => r6Norm(i.value)).join("|") + "#" + (built ? [...built].sort().join(";") : "") + "#" + X.key(), run, built ? 1200 : 900);
  body.addEventListener("input", () => auto());
  X.els.forEach(e => e.addEventListener("click", ev => { if (ev.target.closest(".opt")) auto(); }));
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
/* opt = { lists:[{title, heads, rows:[{lab, e:"88+2=90" | "□+1112=90000", a:[…]}]}], mark, calc, choose, ok }
   이야기 버전: 빈칸을 모두 채우고(변하는 자리를 다 표시하고) 손을 멈추면 저절로 확인 */
function r6Seq(body, api, opt) {
  const ins = [], marks = opt.lists.map(() => new Set());
  let auto = () => {};
  opt.lists.forEach((L, li) => {
    let el = null;
    const st = { ins, mark: !!(opt.mark && !L.noMark), onMark: col => { marks[li].has(col) ? marks[li].delete(col) : marks[li].add(col); el.querySelectorAll(".r6tok").forEach(b => b.classList.toggle("r6mk", marks[li].has(+b.dataset.col))); auto(); } };
    el = r6SeqTable(L, st); body.append(el);
  });
  ins.forEach(x => r6Enter(x.inp));
  if (opt.mark) body.append(h("p", { class: "r6muted" }, "수를 누르면 그 자리(세로 한 줄)가 모두 표시돼요. 다시 누르면 지워져요."));
  if (opt.calc) body.append(r6CalcEl());
  const C = opt.choose ? r6Choose(opt.choose) : null; if (C) body.append(C.el);
  const ans = opt.lists.flatMap(L => L.rows.filter(r => r.a).map(r => { let k = 0; return `${r.lab ? r.lab + " " : ""}${r6Show(r6Norm(r.e).replace(/□/g, () => r.a[k++]))}`; }));
  api.provide({ words: opt.words || ["변하는 수", "변하지 않는 수", "규칙", "추측"], answers: ans.concat(C ? C.answers() : []) });
  const want = opt.lists.map(L => opt.mark && !L.noMark ? r6Changing(L) : []);
  const run = () => {
    api.tryOnce();
    const given = ins.map(x => x.inp.value.trim() || "-").join(", ") + (opt.mark ? " / 표시 " + marks.map(s => s.size).join(",") : "");
    if (opt.mark) for (let li = 0; li < opt.lists.length; li++) {
      const L = opt.lists[li]; if (L.noMark) continue;
      const got = [...marks[li]];
      if (want[li].some(j => !marks[li].has(j))) { api.fail(`${L.title ? "‘" + L.title + "’에서 " : ""}변하는 수가 있는 자리를 모두 눌러 표시해요.`, given); return false; }
      if (got.some(j => !want[li].includes(j))) { api.fail(`${L.title ? "‘" + L.title + "’에서 " : ""}변하지 않는 수까지 표시했어요. 식마다 같은 수는 표시하지 않아요.`, given); return false; }
    }
    for (const x of ins) {
      const raw = r6Norm(x.inp.value), good = raw !== "" && Number(raw) === x.a;
      x.inp.style.borderColor = good ? "var(--ok)" : "var(--no)";
      if (!good) { api.fail(raw === "" ? "빈칸을 모두 채워요." : (x.row.why || `${x.row.lab ? x.row.lab + "의 " : ""}빨간 칸을 다시 추측해 봐요. 앞의 식들에서 변하는 수가 어떻게 변하는지 살펴봐요.`), given); return false; }
    }
    const cb = C && C.check(); if (cb) { api.fail(cb, given + " / " + C.given()); return false; }
    api.done(given + (C ? " / " + C.given() : ""), opt.ok); return true;
  };
  auto = autoRun(() => ins.every(x => x.inp.value.trim() !== "") && marks.every((s, li) => s.size >= want[li].length) && (!C || C.filled()),
    () => ins.map(x => r6Norm(x.inp.value)).join("|") + "#" + marks.map(s => [...s].sort().join(",")).join(";") + "#" + (C ? C.key() : ""), run, ins.length ? 900 : 1200);
  ins.forEach(x => { x.inp.addEventListener("input", auto); x.inp.addEventListener("change", auto); });
  if (C) C.el.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
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
/* opt.tasks = [{L, R, need:{L,R}} | {L, R, pre:{L|R}, eq:"10-2=12-□"}, …], 각 과제에 say·choose
   이야기 버전: 조각을 덜어 내고 □·고르기를 다 하면 1.2초 뒤 저절로 확인 */
function r6Balance(body, api, opt) {
  const tasks = opt.tasks, log = []; let ti = 0, sides = null, E = null, C = null, auto = () => {};
  const names = opt.names || ["가", "나"];
  const sc = r6Scale((si, k) => { const P = sides[si][k]; P.out = !P.out; sc.set(sides, names, true); info(); auto(); });
  const side = h("div", { class: "side r6side" }), infoEl = h("div", { class: "readout", style: "font-size:var(--fs)" });
  const rem = si => sides[si].filter(P => P.out).length;
  function info() { infoEl.textContent = `덜어 낸 것 ─ ${names[0]}: ${rem(0)}개, ${names[1]}: ${rem(1)}개 · 저울이 ${sc.state()}`; }
  function begin() {
    const t = tasks[ti];
    sides = [r6Pieces(t.L, "#F6C85F", t.pre && t.pre.L), r6Pieces(t.R, "#7FB8E6", t.pre && t.pre.R)];
    sc.set(sides, names, false);
    side.innerHTML = "";
    side.append(h("div", { class: "r6task" }, `${tasks.length > 1 ? (ti + 1) + ". " : ""}${t.say}`), h("p", { class: "r6muted" }, "조각을 누르면 덜어 내고, 다시 누르면 다시 올려요."), infoEl);
    E = t.eq ? r6EqTpl(t.eq) : null;
    if (E) { r6Enter(E.inp); E.inp.addEventListener("input", () => auto()); side.append(E.el); }
    C = t.choose ? r6Choose(t.choose) : null;
    if (C) { C.el.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); }); side.append(C.el); }
    side.append(h("div", { class: "r6row" }, h("button", { class: "r6btn", onclick: () => { sides.forEach(s => s.forEach(P => { if (!P.lock) P.out = false; })); sc.set(sides, names, true); info(); } }, "처음처럼 올리기")));
    info();
  }
  function check() {
    api.tryOnce();
    const t = tasks[ti], rl = rem(0), rr = rem(1), wl = t.L - rl, wr = t.R - rr, giv = `${names[0]} ${rl}개, ${names[1]} ${rr}개 덜어 냄${E ? ", □=" + (E.inp.value.trim() || "-") : ""}`;
    if (t.need) {
      if (rl !== t.need.L || rr !== t.need.R) { api.fail(`${names[0]}에서 ${t.need.L}개, ${names[1]}에서 ${t.need.R}개를 덜어 내요. 지금은 ${names[0]}에서 ${rl}개, ${names[1]}에서 ${rr}개를 덜어 냈어요.`, giv); return false; }
    } else {
      if (t.pre && t.pre.L && rl !== t.pre.L) { api.fail(`${names[0]}에서는 ${t.pre.L}개만 덜어 내요. ${names[1]}에서 덜어 내 수평을 맞춰요.`, giv); return false; }
      if (t.pre && t.pre.R && rr !== t.pre.R) { api.fail(`${names[1]}에서는 ${t.pre.R}개만 덜어 내요. ${names[0]}에서 덜어 내 수평을 맞춰요.`, giv); return false; }
      if (wl !== wr) { api.fail(`저울이 아직 ${wl > wr ? names[0] : names[1]} 쪽으로 기울어 있어요. 수평이 되도록 덜어 내거나 다시 올려요.`, giv); return false; }
    }
    if (E) { const v = r6Norm(E.inp.value); E.inp.style.borderColor = v !== "" && +v === E.ans ? "var(--ok)" : "var(--no)"; if (v === "" || +v !== E.ans) { api.fail("□에는 덜어 낸 수가 들어가요. 등호 양쪽의 크기가 같아지는 수를 써요.", giv); return false; } }
    if (C) { const m = C.check(); if (m) { api.fail(m, giv + " / " + C.given()); return false; } }
    log.push(E ? r6Show(t.eq.replace("□", E.ans)) : `${names[0]} ${rl}개, ${names[1]} ${rr}개 덜어 냄`);
    ti++;
    if (ti < tasks.length) { begin(); api.hint(`○ 맞아요! ${log[log.length - 1]}. 다음 저울을 해결해요.`); return false; }
    api.done(log.join(" / "), opt.ok); return true;
  }
  const preN = t => (t.pre && (t.pre.L || 0)) + (t.pre && (t.pre.R || 0)) || 0;
  const ready = () => {
    const t = tasks[ti]; if (!t) return false;
    const moved = rem(0) + rem(1);
    if (C && !C.filled()) return false;
    if (t.need) return moved >= t.need.L + t.need.R;
    return moved > preN(t) && (!E || E.inp.value.trim() !== "");
  };
  const sign = () => [ti, sides.map(s => s.map(P => P.out ? 1 : 0).join("")).join("|"), E ? E.inp.value.trim() : "", C ? C.key() : ""].join("#");
  api.provide({ words: ["수평", "등호(=)", "크기가 같은 두 양"], answers: tasks.map(t => t.eq ? r6Show(t.eq.replace("□", r6EqTpl(t.eq).ans)) : `${names[0]}에서 ${t.need.L}개, ${names[1]}에서 ${t.need.R}개`).concat(tasks.flatMap(t => t.choose ? t.choose.map(c => c.o[c.a]) : [])) });
  body.append(h("div", { class: "panel" }, h("div", { class: "stage r6stage" }, sc.svg), side));
  begin();
  auto = autoRun(ready, sign, check, 1200);
}
/* 등호 식의 양쪽을 저울 조각으로: a+b는 두 색, a−b는 b개를 덜어 낸 모습 */
function r6Side(expr) {
  const t = r6Norm(expr).match(/\d+|[+\-]/g), P = [], cols = ["#F6C85F", "#E58F8F", "#9ED39A"]; let term = 0;
  const add = (n, col) => { for (let i = 0; i < n; i++) P.push({ col, out: false, lock: true }); };
  add(+t[0], cols[0]);
  for (let i = 1; i < t.length; i += 2) { const n = +t[i + 1]; if (t[i] === "+") add(n, cols[++term % 3]); else { let m = n; for (let k = P.length - 1; k >= 0 && m > 0; k--) if (!P[k].out) { P[k].out = true; m--; } } }
  return P;
}
/* opt = { eqs:[…], why:{번호:"까닭"}, nums, ok }  ─ 모두 고르고 쓰면 저절로 확인 */
function r6Judge(body, api, opt) {
  const sc = r6Scale(null), st = opt.eqs.map(() => null), rows = [];
  const truth = opt.eqs.map(e => { const [l, r] = r6Norm(e).split("="); return r6Eval(l) === r6Eval(r); });
  const cap = h("div", { class: "readout", style: "font-size:var(--fs)" });
  let auto = () => {};
  const load = i => {
    const [l, r] = r6Norm(opt.eqs[i]).split("=");
    sc.set([r6Side(l), r6Side(r)], [r6Show(l), r6Show(r)], true);
    rows.forEach((x, k) => x.classList.toggle("r6cur", k === i));
    cap.textContent = `저울에 올린 식: ${r6Show(opt.eqs[i])}`;
  };
  const list = h("div");
  opt.eqs.forEach((e, i) => {
    const bt = h("div", { class: "r6opts" }, ["참(옳아요)", "거짓(옳지 않아요)"].map((o, k) => h("button", { class: "opt", onclick: ev => { [...bt.children].forEach(b => b.classList.remove("on", "good", "bad")); ev.currentTarget.classList.add("on"); st[i] = k === 0; auto(); } }, o)));
    const row = h("div", { class: "r6jrow" }, h("b", {}, r6Show(e)), h("button", { class: "r6btn", onclick: () => load(i) }, "저울에 올리기"), bt);
    rows.push(row); list.append(row);
  });
  const X = r6Extra(opt);
  body.append(h("div", { class: "panel" }, h("div", { class: "stage r6stage" }, sc.svg), h("div", { class: "side r6side" }, cap, h("p", { class: "r6muted" }, "덜어 낸 조각은 점선으로 보여요. 저울이 수평이면 등호 양쪽의 크기가 같아요."))), list, ...X.els);
  load(0);
  api.provide({ words: ["등호(=)", "참", "거짓", "크기가 같은 두 양"], answers: [opt.eqs.map((e, i) => `${r6Show(e)} ${truth[i] ? "참" : "거짓"}`).join(", ")].concat(X.answers()) });
  const run = () => {
    api.tryOnce();
    const given = st.map((v, i) => `${opt.eqs[i]}:${v == null ? "-" : v ? "참" : "거짓"}`).join(", ");
    for (let i = 0; i < st.length; i++) {
      const btns = rows[i].querySelectorAll(".opt");
      if (st[i] == null) { api.fail("모든 식에 참인지 거짓인지 골라요.", given); return false; }
      const good = st[i] === truth[i]; btns[st[i] ? 0 : 1].classList.add(good ? "good" : "bad");
      if (!good) { load(i); api.fail((opt.why && opt.why[i]) || `${r6Show(opt.eqs[i])}의 양쪽을 저울에 올려 크기가 같은지 확인해 봐요.`, given); return false; }
    }
    const m = X.check(); if (m) { api.fail(m, given + " / " + X.given()); return false; }
    api.done(given, opt.ok); return true;
  };
  auto = autoRun(() => st.every(v => v != null) && X.filled(), () => st.join(",") + "#" + X.key(), run, X.N ? 900 : 260);
  X.els.forEach(e => { e.addEventListener("input", () => auto()); e.addEventListener("click", ev => { if (ev.target.closest(".opt")) auto(); }); });
}

/* ---------- 초콜릿 접시 ---------- */
function r6PlateSvg(col, onTap) {
  const W = 440, H = 290, svg = makeSvg(W, H);
  svg.append(svgEl("ellipse", { cx: W / 2, cy: H / 2, rx: 205, ry: 132, fill: "#FFF8EC", stroke: "#D9C7A8", "stroke-width": 5 }));
  svg.append(svgEl("ellipse", { cx: W / 2, cy: H / 2, rx: 175, ry: 106, fill: "none", stroke: "#EADBC2", "stroke-width": 3 }));
  col.forEach((c, i) => {
    const r = Math.floor(i / 5), k = i % 5, x = W / 2 + (k - 2) * 62 - 24, y = H / 2 + (r - 1) * 60 - 24;
    const g = svgEl("g", { style: onTap ? "cursor:pointer" : "" });
    if (c) g.append(svgEl("rect", { x, y, width: 48, height: 48, rx: 10, fill: "#3B7DD8", stroke: "#1F4F99", "stroke-width": 2 }));
    else g.append(svgEl("circle", { cx: x + 24, cy: y + 24, r: 24, fill: "#D9534F", stroke: "#9B2C29", "stroke-width": 2 }));
    g.append(svgEl("path", { d: `M${x + 12} ${y + 24} H${x + 36} M${x + 24} ${y + 12} V${y + 36}`, stroke: "#fff", "stroke-width": 2, opacity: .35 }));
    if (onTap) g.addEventListener("click", () => onTap(i));
    svg.append(g);
  });
  return svg;
}
const r6Cols01 = (r, b) => Array.from({ length: r + b }, (_, i) => i < r ? 0 : 1);
/* 꾸러미 접시: 빨간 동그라미 = names[0], 파란 네모 = names[1]
   opt = { r, b, need, names, examples:[[r1,b1,r2,b2]], choose, ok }  ─ 식을 need개 담고 고르기를 하면 저절로 확인 */
function r6Plate(body, api, opt) {
  const nm = opt.names || ["빨간색", "파란색"];
  if (opt.examples) body.append(h("div", { class: "r6figs", style: `--n:${opt.examples.length * 2}` }, opt.examples.flatMap(([a, b, c, d]) => [
    h("div", {}, r6PlateSvg(r6Cols01(a, b)), h("div", { class: "r6cap" }, `${nm[0]} ${a}개 + ${nm[1]} ${b}개`)),
    h("div", {}, r6PlateSvg(r6Cols01(c, d)), h("div", { class: "r6cap" }, `${nm[0]} ${c}개 + ${nm[1]} ${d}개`))])),
    h("p", { class: "r6muted" }, opt.examples.map(([a, b, c, d]) => `${a}+${b}=${c}+${d}`).join("   ·   ")));
  const col = r6Cols01(opt.r, opt.b), rec = [];
  let auto = () => {};
  const stage = h("div", { class: "stage r6stage" }), eq = h("div", { class: "readout" }), list = h("div", { class: "r6list" });
  const red = () => col.filter(c => c === 0).length;
  const draw = () => { stage.innerHTML = ""; stage.append(r6PlateSvg(col, i => { col[i] = 1 - col[i]; draw(); })); eq.textContent = `${opt.r}+${opt.b} = ${red()}+${col.length - red()}`; };
  const side = h("div", { class: "side r6side" }, h("div", { class: "r6task" }, `${r6J(nm[0], "을/를")} 누르면 ${r6J(nm[1], "으로/로")}, ${r6J(nm[1], "을/를")} 누르면 ${r6J(nm[0], "으로/로")} 바뀌어요.`), eq,
    h("button", { class: "r6btn", onclick: () => {
      const r = red(), s = `${opt.r}+${opt.b}=${r}+${col.length - r}`;
      if (r === opt.r) return api.hint(`처음과 같은 식이에요. ${nm[0]}의 수를 바꿔 봐요.`);
      if (rec.includes(s)) return api.hint("이미 담은 식이에요. 다른 식을 만들어 봐요.");
      rec.push(s); list.append(h("span", {}, s)); api.hint(`○ ${s} ─ ${r6J(nm[0], "이/가")} ${Math.abs(r - opt.r)}개 ${r > opt.r ? "늘어난" : "줄어든"} 만큼 ${r6J(nm[1], "이/가")} ${r > opt.r ? "줄어들었어요" : "늘어났어요"}.`);
      auto();
    } }, "이 식 담기"), h("div", { class: "r6muted" }, `만든 식(${opt.need}개 이상):`), list);
  draw();
  body.append(h("div", { class: "panel" }, stage, side));
  const C = opt.choose ? r6Choose(opt.choose) : null; if (C) body.append(C.el);
  api.provide({ words: ["늘어난 만큼", "줄어들어요", "등호(=)"], answers: [`${opt.r}+${opt.b}=${opt.r - 1}+${opt.b + 1}, ${opt.r}+${opt.b}=${opt.r + 4}+${opt.b - 4}`].concat(C ? C.answers() : []) });
  const run = () => {
    api.tryOnce();
    const m = C && C.check(); if (m) { api.fail(m, rec.join(", ") + " / " + C.given()); return false; }
    api.done(rec.join(", "), opt.ok); return true;
  };
  auto = autoRun(() => rec.length >= opt.need && (!C || C.filled()), () => rec.length + "#" + (C ? C.key() : ""), run, 260);
  if (C) C.el.addEventListener("click", e => { if (e.target.closest(".opt")) auto(); });
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
/* 문제 카드 완성: 5+13=□+□ (두 자리 수 범위, 왼쪽과 다른 식) ─ 모두 쓰면 저절로 확인 */
function r6EqFill(body, api, opt) {
  const rows = opt.items.map(it => {
    const x = r6Enter(h("input", { type: "text", inputmode: "numeric", class: "r6in", style: "width:3.4em", "aria-label": `${it.l} 첫째 빈칸`, autocomplete: "off" }));
    const y = r6Enter(h("input", { type: "text", inputmode: "numeric", class: "r6in", style: "width:3.4em", "aria-label": `${it.l} 둘째 빈칸`, autocomplete: "off" }));
    body.append(h("div", { class: "r6eqrow qitem" }, h("span", { class: "jua" }, `${r6Show(it.l)} =`), x, h("span", { class: "jua" }, r6Show(it.op)), y));
    return { it, x, y };
  });
  const tip = { "+": "더해지는 수가 커진 만큼 더하는 수는 작아져야 크기가 같아요.", "-": "빼지는 수가 커진 만큼 빼는 수도 커져야 크기가 같아요.", "×": "한 수가 2배가 되면 다른 수는 반으로 줄어야 크기가 같아요." };
  api.provide({ words: ["크기가 같은 두 양", "등호(=)"], answers: opt.items.map(it => `${r6Show(it.l)}=${r6Show(it.ex)}`) });
  const run = () => {
    api.tryOnce();
    const given = rows.map(r => `${r.it.l}=${r.x.value || "□"}${r.it.op}${r.y.value || "□"}`).join(", ");
    for (const r of rows) {
      const a = r6Norm(r.x.value), b = r6Norm(r.y.value), bad = m => { r.x.style.borderColor = r.y.style.borderColor = "var(--no)"; api.fail(m, given); return false; };
      if (a === "" || b === "") return bad("빈칸을 모두 채워요.");
      if (!/^\d+$/.test(a) || !/^\d+$/.test(b) || +a > 99 || +b > 99) return bad("0부터 99까지의 수로 만들어요.");
      if (r.it.op === "×" && (+a === 0 || +b === 0)) return bad("곱셈에서는 0이 아닌 수로 만들어요.");
      if (r6Eval(`${a}${r.it.op}${b}`) !== r6Eval(r.it.l)) return bad(`${r6J(`${r6Show(r.it.l)}=${a}${r6Show(r.it.op)}${b}`, "은/는")} 등호 양쪽의 크기가 달라요. ${tip[r.it.op]}`);
      if (r6Norm(`${a}${r.it.op}${b}`) === r6Norm(r.it.l)) return bad(`${r6J(r6Show(r.it.l), "과/와")} 똑같은 식이에요. 다른 두 수로 만들어요.`);
      r.x.style.borderColor = r.y.style.borderColor = "var(--ok)";
    }
    api.done(given, opt.ok); return true;
  };
  const all = rows.flatMap(r => [r.x, r.y]);
  const auto = autoRun(() => all.every(i => i.value.trim() !== ""), () => all.map(i => i.value.trim()).join("|"), run, 900);
  all.forEach(i => { i.addEventListener("input", auto); i.addEventListener("change", auto); });
}

/* ---------- 동전 옮기기(덧셈을 곱셈으로) ---------- */
/* 동전 옮기기(덧셈을 곱셈으로)  opt = { rows:[1,3,5], lab:"100", nums, choose, ok }
   줄마다 동전 수가 같아지고 곱셈식·물음을 다 쓰면 1.2초 뒤 저절로 확인 */
function r6Coins(body, api, opt) {
  const rows = opt.rows.map((n, r) => Array.from({ length: n }, (_, k) => ({ from: r, id: r * 100 + k })));
  const maxLen = Math.max(...opt.rows), nr = rows.length, u = 54, lw = 92, top = 10;
  const W = lw + maxLen * u + 16, H = nr * u + top * 2, svg = makeSvg(W, H); svg.style.touchAction = "none";
  let sel = null, drag = null, auto = () => {};
  const tint = ["#F6E7B0", "#DCEAFB", "#E3F4EA", "#FBE3E3"];
  const rowAt = p => { const r = Math.floor((p.y - top) / u); return r >= 0 && r < nr ? r : -1; };
  const coinAt = p => { const r = rowAt(p), c = Math.floor((p.x - lw) / u); return r >= 0 && c >= 0 && rows[r][c] ? { r, c, coin: rows[r][c] } : null; };
  const info = h("div", { class: "readout", style: "font-size:var(--fs)" });
  function draw() {
    svg.innerHTML = "";
    rows.forEach((row, r) => {
      svg.append(svgEl("rect", { x: 4, y: top + r * u + 3, width: W - 8, height: u - 6, rx: 10, fill: "#FBFCFB", stroke: "#E1E8E5" }));
      svg.append(txt(lw / 2, top + r * u + u / 2, `${R6ORD[r + 1]} 줄`, 18, { fill: "#3B4A47" }));
      row.forEach((coin, c) => {
        if (drag && drag.coin === coin && drag.pos) return;
        const x = lw + c * u, y = top + r * u, g = svgEl("g");
        r6Piece(g, "coin", x + 2, y + 2, u - 4, null, opt.lab);
        if (coin.from !== r) g.firstChild.setAttribute("fill", tint[coin.from % 4]);
        if (sel === coin) g.append(svgEl("circle", { cx: x + u / 2, cy: y + u / 2, r: u * .47, fill: "none", stroke: "#2B7BD6", "stroke-width": 3 }));
        svg.append(g);
      });
    });
    if (drag && drag.pos) { const g = svgEl("g", { opacity: .85 }); r6Piece(g, "coin", drag.pos.x - u / 2 + 2, drag.pos.y - u / 2 + 2, u - 4, null, opt.lab); svg.append(g); }
    info.textContent = `줄마다 동전: ${rows.map(r => r.length + "개").join(", ")} → ${rows.map(r => r.length).join("+")}`;
    if (!drag) auto();
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
  }, p => { if (!drag) return; if (dist(p, drag.p0) > 8) drag.moved = true; drag.pos = drag.moved ? p : null; if (drag.moved) draw(); }, p => {
    if (!drag) return; const d = drag; drag = null;
    if (d.moved) { const r = rowAt(p); if (r >= 0) move(d.coin, r); sel = null; } else sel = sel === d.coin ? null : d.coin;
    draw();
  });
  const a = r6Enter(h("input", { type: "text", inputmode: "numeric", class: "r6in", style: "width:3em", "aria-label": "곱셈식 첫째 수", autocomplete: "off" }));
  const b = r6Enter(h("input", { type: "text", inputmode: "numeric", class: "r6in", style: "width:3em", "aria-label": "곱셈식 둘째 수", autocomplete: "off" }));
  const total = opt.rows.reduce((s, x) => s + x, 0), len = total / nr;
  const side = h("div", { class: "side r6side" }, h("div", { class: "r6task" }, "동전을 끌어 다른 줄로 옮겨요."), h("p", { class: "r6muted" }, "동전을 눌러 고른 뒤 옮길 줄을 눌러도 돼요."), info,
    h("div", { class: "r6eqrow" }, h("span", { class: "jua" }, `${opt.rows.join("+")} =`), a, h("span", { class: "jua" }, "×"), b),
    h("button", { class: "r6btn", onclick: () => { rows.forEach(r => r.length = 0); opt.rows.forEach((n, r) => { for (let k = 0; k < n; k++) rows[r].push({ from: r, id: r * 100 + k }); }); sel = null; draw(); } }, "처음 모양으로"));
  body.append(h("div", { class: "panel" }, h("div", { class: "stage r6stage" }, svg), side));
  const X = r6Extra(opt); X.els.forEach(e => body.append(e));
  api.provide({ words: ["덧셈을 곱셈으로", "정사각형", "직사각형"], answers: [`${opt.rows.join("+")}=${len}×${nr}`].concat(X.answers()) });
  const equal = () => rows.every(r => r.length === rows[0].length);
  const run = () => {
    api.tryOnce();
    const given = `${rows.map(r => r.length).join(",")} / ${a.value || "□"}×${b.value || "□"}`;
    if (!equal()) { api.fail("줄마다 동전의 수가 같아지게 옮겨요. 가장 긴 줄의 동전을 가장 짧은 줄로 옮겨 봐요.", given); return false; }
    const x = Number(r6Norm(a.value)), y = Number(r6Norm(b.value));
    if (!((x === len && y === nr) || (x === nr && y === len))) { a.style.borderColor = b.style.borderColor = "var(--no)"; api.fail("동전을 옮긴 모양을 보고 곱셈식을 써요. 한 줄에 몇 개씩 몇 줄인가요?", given); return false; }
    a.style.borderColor = b.style.borderColor = "var(--ok)";
    const m = X.check(); if (m) { api.fail(m, given + " / " + X.given()); return false; }
    api.done(given + (X.els.length ? " / " + X.given() : ""), opt.ok); return true;
  };
  auto = autoRun(() => equal() && a.value.trim() !== "" && b.value.trim() !== "" && X.filled(),
    () => rows.map(r => r.length).join(",") + "#" + a.value.trim() + "×" + b.value.trim() + "#" + X.key(), run, 1200);
  draw();
  [a, b].forEach(i => i.addEventListener("input", () => auto()));
  X.els.forEach(e => { e.addEventListener("input", () => auto()); e.addEventListener("click", ev => { if (ev.target.closest(".opt")) auto(); }); });
}

/* ---------- 섬에 나누어 넣기 · 글자 색칠 · 그림 ---------- */
/* 카드 나누어 넣기 ─ 모두 넣으면 1.2초 뒤 저절로 확인 */
function r6Sort(body, api, opt) {
  if (opt.fig) body.append(opt.fig());
  const where = opt.cards.map(() => -1); let sel = null, auto = () => {};
  const pool = h("div", { class: "r6pool" }), bins = h("div", { class: "r6bins" });
  function draw() {
    pool.innerHTML = ""; bins.innerHTML = "";
    const binEls = opt.bins.map((b, k) => { const el = h("div", { class: "r6bin", onclick: () => { if (sel == null) return api.hint("먼저 카드를 누른 다음, 넣을 상자를 눌러요."); where[sel] = k; sel = null; draw(); } }, h("div", { class: "r6bint" }, b)); bins.append(el); return el; });
    opt.cards.forEach((c, i) => (where[i] < 0 ? pool : binEls[where[i]]).append(h("button", { class: "r6chip" + (sel === i ? " r6pick" : ""), onclick: e => { e.stopPropagation(); sel = sel === i ? null : i; draw(); } }, c.t)));
    if (!pool.children.length) pool.append(h("span", { class: "r6muted" }, "카드를 모두 넣었어요."));
    auto();
  }
  const run = () => {
    api.tryOnce();
    const given = opt.cards.map((c, i) => `${c.t}→${where[i] < 0 ? "-" : opt.bins[where[i]]}`).join(", ");
    const bad = opt.cards.findIndex((c, i) => where[i] !== c.b);
    if (bad >= 0) { bins.querySelectorAll(".r6chip").forEach(b => { const i = opt.cards.findIndex(c => c.t === b.textContent); b.classList.add(where[i] === opt.cards[i].b ? "r6good" : "r6bad"); }); api.fail(opt.cards[bad].why || `${r6J(`‘${opt.cards[bad].t}’`, "은/는")} 어느 상자에 어울리는지 다시 생각해 봐요.`, given); return false; }
    api.done(given, opt.ok); return true;
  };
  auto = autoRun(() => where.every(w => w >= 0) && sel == null, () => where.join(","), run, 1200);
  draw();
  body.append(h("p", { class: "r6muted" }, "카드를 누른 뒤 알맞은 상자를 눌러요. 상자 안의 카드를 눌러 다른 상자로 옮길 수도 있어요. 모두 넣으면 저절로 확인해요."), pool, bins);
  api.provide({ words: opt.bins, answers: opt.bins.map((b, k) => `${b}: ${opt.cards.filter(c => c.b === k).map(c => c.t).join(", ")}`) });
}
/* 글자 색칠 ─ 답 수만큼 색칠하면 1.2초 뒤 저절로 확인 */
function r6Letters(body, api, opt) {
  body.append(h("div", { class: "r6probs" }, opt.probs.map(p => h("p", {}, p))));
  const pick = new Set(), grid = h("div", { class: "r6gridc", style: "--c:4" });
  let auto = () => {};
  opt.tiles.forEach(([n, ch]) => { const b = h("button", { class: "r6tile", "aria-label": `${n} ${ch}`, onclick: () => { pick.has(n) ? pick.delete(n) : pick.add(n); b.classList.toggle("r6pick", pick.has(n)); auto(); } }, h("b", {}, String(n)), h("span", {}, ch)); grid.append(b); });
  body.append(h("p", { class: "r6muted" }, "□ 안에 알맞은 수를 구해 그 수가 적힌 칸을 눌러 색칠해요."), grid);
  api.provide({ words: ["규칙", "계산식의 배열"], answers: [opt.ans.join(", ")] });
  const run = () => {
    api.tryOnce();
    const given = [...pick].join(", ");
    const extra = [...pick].find(n => !opt.ans.includes(n));
    if (extra != null) { api.fail(`${r6J(String(extra), "은/는")} □ 안에 알맞은 수가 아니에요. 규칙을 다시 찾아 봐요.`, given); return false; }
    if (opt.ans.some(n => !pick.has(n))) { api.fail("아직 색칠하지 않은 답이 있어요. □가 모두 몇 개인지 세어 봐요.", given); return false; }
    api.done(given, `색칠한 글자를 차례로 읽으면 ${r6J(`‘${opt.word}’`, "이에요/예요")}! ${opt.ok || ""}`); return true;
  };
  auto = autoRun(() => pick.size >= opt.ans.length, () => [...pick].sort((a, b) => a - b).join(","), run, 1200);
}
/* ---------- 이야기 버전 그림·자료 (앞글자 r6s) ---------- */
function r6sBankFig() {
  const svg = makeSvg(560, 230);
  svg.append(svgEl("rect", { x: 0, y: 0, width: 560, height: 230, rx: 14, fill: "#FFF6E9" }));
  svg.append(svgEl("ellipse", { cx: 190, cy: 132, rx: 120, ry: 78, fill: "#F6B8C4", stroke: "#B9707E", "stroke-width": 3 }));
  svg.append(svgEl("ellipse", { cx: 300, cy: 138, rx: 30, ry: 24, fill: "#F3A6B5", stroke: "#B9707E", "stroke-width": 3 }));
  svg.append(svgEl("circle", { cx: 292, cy: 136, r: 4, fill: "#8C4B57" })); svg.append(svgEl("circle", { cx: 308, cy: 136, r: 4, fill: "#8C4B57" }));
  svg.append(svgEl("circle", { cx: 250, cy: 104, r: 6, fill: "#3B2B2B" }));
  [[120, 196], [170, 202], [220, 202], [260, 196]].forEach(([x, y]) => svg.append(svgEl("rect", { x: x - 11, y: y - 10, width: 22, height: 24, rx: 6, fill: "#F3A6B5", stroke: "#B9707E", "stroke-width": 2 })));
  svg.append(svgEl("path", { d: "M120 64 L104 34 L146 56 Z", fill: "#F3A6B5", stroke: "#B9707E", "stroke-width": 3 }));
  svg.append(svgEl("rect", { x: 160, y: 56, width: 64, height: 9, rx: 4, fill: "#8C4B57" }));
  svg.append(txt(190, 140, "나눔 저금통", 22, { fill: "#7A3442" }));
  [[192, 20], [192, 42]].forEach(([x, y]) => { svg.append(svgEl("circle", { cx: x, cy: y, r: 12, fill: "#DADADA", stroke: "#8E8E8E", "stroke-width": 1.5 })); svg.append(txt(x, y + 1, "100", 8, { fill: "#555" })); });
  const cx = 360, cy = 30, cw = 26;
  svg.append(svgEl("rect", { x: cx - 6, y: cy - 22, width: cw * 7 + 12, height: 196, rx: 10, fill: "#fff", stroke: "#C9D6D1", "stroke-width": 2 }));
  svg.append(txt(cx + cw * 3.5, cy - 8, "11월 나눔 달력", 15, { fill: "#2F4A43" }));
  for (let d = 1; d <= 30; d++) { const r = Math.floor((d - 1) / 7), c = (d - 1) % 7; const x = cx + c * cw + cw / 2, y = cy + 18 + r * 32; if (d % 7 === 5) svg.append(svgEl("circle", { cx: x, cy: y, r: 12, fill: "#FFE9C7" })); svg.append(txt(x, y + 1, String(d), 14, { fill: c === 0 ? "#C8472E" : "#2F4A43" })); }
  return h("div", { class: "r6fig" }, svg, h("p", { class: "r6cap" }, "4학년 1반 나눔 저금통과 11월 나눔 달력(동그라미 = 저금통을 여는 날)"));
}
/* 2026년 11월 달력: 1일이 일요일 */
const R6S_CAL = [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20, 21], [22, 23, 24, 25, 26, 27, 28], [29, 30]];
const R6S_CALCOLS = [0, 1, 2, 3, 4, 5, 6].map(c => R6S_CAL.map(r => r[c]).filter(x => x != null));
const R6S_LOCK = [[1305, 2305, 3305, 4305], [1205, 2205, 3205, 4205], [1105, 2105, 3105, 4105], [1005, 2005, 3005, 4005]];
const R6S_SP = Array.from({ length: 16 }, (_, i) => 3 * (i + 1));
const R6S_ADD = { title: "서연이와 지후가 함께 넣은 돈(원)", heads: ["서연", "지후", "합"], rows: [{ e: "100+400=500" }, { e: "150+350=500" }, { e: "200+300=500" }, { e: "250+250=500" }] };
const R6S_SUB = { title: "하은이가 만든 뺄셈식 카드", heads: ["빼지는 수", "빼는 수", "차"], rows: [{ e: "520-120=400" }, { e: "530-130=400" }, { e: "540-140=400" }, { e: "550-150=400" }] };
const R6S_MUL = { title: "지후의 계산기 곱셈식", heads: ["곱해지는 수", "곱하는 수", "곱"], rows: [{ e: "1×6=6" }, { e: "11×6=66" }, { e: "111×6=666" }, { e: "1111×6=6666" }] };
const R6S_DIV = { title: "지후의 계산기 나눗셈식", heads: ["나누어지는 수", "나누는 수", "몫"], rows: [{ e: "8÷8=1" }, { e: "88÷8=11" }, { e: "888÷8=111" }, { e: "8888÷8=1111" }] };
const R6L = (L, extra) => Object.assign({}, L, { rows: L.rows.concat(extra || []) });
const R6S_PAIRS = [["7+15", "11+11"], ["14-3", "16-5"], ["9+8", "10+7"], ["2×9", "3×6"], ["40+40", "39+41"], ["63-23", "64-24"], ["5+9", "7+7"], ["30-17", "33-20"]];
const R6S_PAIRS2 = [["26+18", "28+16"], ["57-19", "58-20"], ["5×6", "10×3"], ["21+21", "20+22"], ["90-45", "85-40"], ["8×4", "16×2"], ["19+17", "20+16"], ["72-25", "70-23"], ["9×6", "18×3"], ["33+29", "31+31"]];
//@@LESSONS
const UNIT_STORY = { title: "우리 반 나눔 저금통 프로젝트", lines: [
  "푸른초등학교 4학년 1반은 한 학기 동안 ‘나눔 저금통’에 규칙적으로 돈을 모아 학기 말에 지역 아동센터에 기부하기로 했어요. 반장 서연, 저금 기록을 맡은 지후, 꾸미기 담당 하은, 동전 탑 쌓기를 좋아하는 민준, 퀴즈를 내는 다온이가 함께해요.",
  "사물함 번호와 11월 나눔 달력에서 수의 배열을, 게시판 꾸미기와 쿠키 상자에서 도형의 배열을, 저금 기록과 계산기 놀이에서 계산식의 배열을 찾아 규칙을 수와 식으로 나타내요.",
  "모은 것을 공정하게 나누려고 저울을 쓰며 크기가 같은 두 양을 등호(=)로 나타내고, 나눔 장터 놀이와 발표회로 프로젝트를 마무리해요."],
  one: "우리 반 나눔 저금통 · 규칙적으로 모아 기부하며 수·도형·계산식의 규칙과 크기가 같은 두 양을 찾아요." };
const UNIT_KEYWORDS = ["수의 배열", "도형의 배열", "규칙", "시작하는 수", "가로(→)", "세로(↓)", "방향", "커져요", "작아져요", "몇 배", "이웃한 두 수", "계산식의 배열", "변하는 수", "추측", "등호(=)", "크기가 같은 두 양", "저울", "수평"];

const LESSONS = [
{
  id: "s1", no: 1, title: "나눔 저금통 프로젝트를 시작해요", soop: "개념 찾기(S)",
  question: "우리 반 나눔 저금통 프로젝트 속에는 어떤 규칙과 관계가 숨어 있을까요?",
  summary: "4학년 1반은 나눔 저금통에 규칙적으로 돈을 모아 기부하기로 했어요. 사물함 번호와 달력 같은 수의 배열, 게시판 무늬 같은 도형의 배열, 저금 기록 같은 계산식의 배열에서 규칙을 찾고, 저울로 크기가 같은 두 양을 알아보며 등호(=)로 나타내요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "학급 회의에서 ‘나눔 저금통’을 만들기로 했어요. 저금통과 11월 나눔 달력을 보고 떠오르는 것을 세 칸에 써서 붙여요.", hints: ["달력의 날짜, 사물함 번호처럼 수가 차례로 놓인 곳을 떠올려요.", "매일 조금씩 늘려 가며 저금하면 어떻게 될지 생각해 봐요."],
      render: (b, a) => { b.append(r6sBankFig()); panes(b, a, [
        { t: "보여요", e: "👀", ph: "달력에서 ~이 보여요", hint: "저금통과 달력에서 보이는 것", ex: ["달력에서 동그라미 친 날이 5일, 12일, 19일, 26일로 7일마다 있어요.", "저금통에 100원짜리 동전이 차례로 들어가고 있어요."] },
        { t: "생각해요", e: "💭", ph: "규칙적으로 모으면 ~", hint: "규칙적으로 모으는 것에 대한 생각", ex: ["매일 조금씩 늘려 가며 모으면 금방 많이 모일 것 같아요.", "모은 돈을 모둠끼리 똑같이 나누려면 저울로 재 보면 좋겠어요."] },
        { t: "궁금해요", e: "❓", ph: "~은 어떤 규칙일까?", hint: "규칙과 관계에 대해 궁금한 것", ex: ["달력에서 아래 칸으로 가면 왜 7씩 커질까?", "매일 늘려 가며 모은 돈은 다 더하지 않고도 구할 수 있을까?"] }],
        { ok: "저금통과 달력 속에 벌써 규칙이 보여요! 이 단원에서 그 규칙을 수와 식으로 나타내 봐요." }); } },
    { name: "그려 보기 — 우리 반 규칙 모으기", inst: "프로젝트를 하며 만날 것들이에요. 카드를 알맞은 상자에 넣어 보세요.", hints: ["수가 차례로 놓여 있으면 ‘수의 배열’, 모양이 늘어나면 ‘도형의 배열’이에요.", "계산식이 줄지어 있으면 ‘계산식의 배열’, 저울로 양쪽이 같은지 재면 ‘크기가 같은 두 양’이에요."],
      render: (b, a) => r6Sort(b, a, { bins: ["수의 배열", "도형의 배열", "계산식의 배열", "크기가 같은 두 양"], cards: [
        { t: "사물함 번호 1105, 1205, 1305", b: 0 }, { t: "11월 달력의 날짜", b: 0 }, { t: "게시판 테두리의 색종이 무늬", b: 1 }, { t: "동전을 1개, 3개, 6개로 쌓은 탑", b: 1 },
        { t: "100+400=500, 150+350=500", b: 2 }, { t: "1×6=6, 11×6=66, 111×6=666", b: 2 }, { t: "저울 양쪽에 공책 꾸러미를 올려 수평 맞추기", b: 3 }],
        ok: "수의 배열 → 도형의 배열 → 계산식의 배열 → 크기가 같은 두 양 차례로 프로젝트 속 규칙을 찾아봐요." }) },
    { name: "말해 보기 — 곱셈표 떠올리기", inst: "다온이가 2학년 때 배운 곱셈표의 일부를 칠판에 붙였어요. 2부터 가로(→) 방향으로 수를 차례로 눌러 규칙을 찾고, 빈칸을 채워 보세요.", hints: ["2 → 4 → 6 → 8을 차례로 누르고 ‘씩 커져요’를 골라요.", "셋째 줄은 4단이에요. 4, 8, ㉠, 16은 4씩 커져요."],
      render: thenWhy((b, a) => r6Grid(b, a, { rows: [[2, 4, 6, 8], [3, 6, 9, 12], [4, 8, { a: 12, lab: "㉠" }, 16], [5, 10, 15, { a: 20, lab: "㉡" }]],
        traces: [{ start: [0, 0], dir: "→", say: "2부터 가로(→) 방향으로 수를 차례로 눌러요." }],
        fillWhy: { "㉠": "4, 8, ㉠, 16은 가로(→) 방향으로 4씩 커져요.", "㉡": "5, 10, 15, ㉡은 가로(→) 방향으로 5씩 커져요." },
        ok: "곱셈표에서도 방향을 정하면 규칙이 보여요. ㉠은 12, ㉡은 20이에요." }),
        { q: "곱셈표에서 ㉠이 12인 까닭을 규칙으로 설명해 볼까요?", ph: "㉠은 ~부터 ~ 방향으로 ~씩 커지는 줄에 있어서 ~", help: ["① ㉠이 있는 줄을 찾아요. → ② 그 줄이 어느 방향으로 몇씩 커지는지 말해요.", "‘㉠은 4부터 가로(→) 방향으로 ~씩 커지는 줄에 있으므로 8 다음 수 ~이에요.’ 꼴로 써요."], ans: "㉠은 4부터 가로(→) 방향으로 4씩 커지는 줄에 있으므로 8보다 4만큼 큰 12예요." }) },
    { name: "약속하기 — 무엇을 배울까요", inst: "이 단원에서 배울 것을 골라 보세요.", hints: ["수와 도형, 계산식에서 규칙을 찾아요.", "크기가 같은 두 양은 등호(=)로 나타내요."],
      render: (b, a) => quiz(b, a, [
        { q: "이 단원에서 배울 것을 모두 고르세요.", o: ["수의 배열에서 규칙을 찾아 식으로 나타내기", "도형의 배열에서 규칙을 찾아 식으로 나타내기", "계산식의 배열에서 다음 계산 결과 추측하기", "크기가 같은 두 양을 등호로 나타내기", "저금통을 가장 예쁘게 색칠하기"], a: [0, 1, 2, 3], why: { "4": "색칠은 꾸미기 활동이에요. 수학에서 배울 것을 골라요." } },
        { q: "규칙을 말할 때 꼭 함께 말해야 할 것은?", o: ["어느 방향으로 몇씩 변하는지", "수를 무슨 색으로 썼는지"], a: 0 }],
        { ok: "이 단원에서는 여러 가지 배열에서 규칙을 찾아 수와 식으로 나타내고, 크기가 같은 두 양을 등호로 나타내요." }) },
    { name: "확인하기 — 우리 반 저금 계획", inst: "나눔 저금통 프로젝트 계획을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "나눔 저금통에 어떤 규칙으로 돈을 모으면 좋을까요?", tag: "저금 규칙", ph: "예) 첫째 날 100원, 그다음부터 매일 100원씩 늘려서 넣어요.", help: ["① 첫째 날 넣을 돈을 정해요. → ② 다음 날부터 얼마씩 늘릴지 정해요.", "‘첫째 날 ~원을 넣고, 매일 ~원씩 늘려서 넣어요.’ 꼴로 써요."], ans: "첫째 날 100원을 넣고, 그다음부터 매일 100원씩 늘려서 넣어요." },
        { q: "규칙적으로 모으면 좋은 점은 무엇일까요?", tag: "좋은 점", ph: "예) 규칙을 알면 ~", help: ["① 규칙을 알면 미리 알 수 있는 것을 떠올려요. → ② 그 까닭을 함께 써요.", "‘규칙적으로 모으면 ~을 미리 알 수 있어요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요."], ans: "규칙적으로 모으면 며칠 뒤에 얼마가 모일지 미리 알 수 있어요. 날마다 넣는 돈이 일정하게 늘어나기 때문이에요." }]) }
  ],
  challenge: { inst: "프로젝트 속 규칙을 이어 가 보세요.", hints: ["100원, 300원, 500원은 200원씩 커져요.", "달력에서 바로 아래 칸은 일주일(7일) 뒤예요."],
    render: (b, a) => numbers(b, a, [
      { q: "민준이는 첫째 날 100원, 둘째 날 300원, 셋째 날 500원을 넣었어요. 같은 규칙이면 넷째 날에는 몇 원을 넣을까요?", a: 700, unit: "원", why: { "600": "100원, 300원, 500원은 100원씩이 아니라 200원씩 커져요.", "900": "500원에 200원을 더해요." } },
      { q: "11월 달력에서 9일 바로 아래 칸의 날짜는 며칠인가요?", a: 16, unit: "일", why: { "10": "10일은 9일 바로 오른쪽 칸이에요. 아래 칸은 일주일 뒤예요.", "18": "아래로 한 칸 가면 7일 뒤예요." } }],
      { ok: "규칙을 알면 다음 수를 미리 알 수 있어요!" }) }
},
{
  id: "s2", no: 2, title: "사물함 번호와 나눔 상자 번호 ― 수의 배열에서 규칙 찾기", soop: "개념 구축하기(O)",
  question: "수의 배열에서 규칙을 어떻게 찾을 수 있을까요?",
  summary: "수의 배열에서 규칙을 찾을 때는 어느 방향으로 몇씩 커지거나 작아지는지 살펴봐요. 덧셈·뺄셈으로 말하기 어려우면 몇 배가 되는지, 몇분의 1만큼이 되는지 생각해요. 규칙을 말할 때는 시작하는 수와 방향을 함께 말해요.",
  steps: [
    { name: "만져 보기 — 사물함 번호판", inst: "서연이가 저금통을 넣어 둘 사물함을 찾고 있어요. 사물함 번호판에서 수를 차례로 눌러 줄을 긋고, 규칙 문장을 완성해 보세요.", hints: ["2305는 1305보다 1000만큼 커요.", "2305, 2205, 2105는 백의 자리 수가 1씩 작아져요. 세 번째는 ↗나 ↑ 방향으로 찾아봐요."],
      render: ruleFirst((b, a) => r6Grid(b, a, { rows: R6S_LOCK,
        traces: [{ start: [0, 0], dir: "→", say: "1305부터 가로(→) 방향으로 수를 차례로 눌러요." }, { start: [0, 1], dir: "↓", say: "2305부터 세로(↓) 방향으로 수를 차례로 눌러요." },
          { notDirs: ["→", "↓"], say: "또 다른 규칙을 찾아요. 앞에서 찾은 것과 다른 방향으로 수를 차례로 눌러요.", notMsg: "가로(→)·세로(↓) 말고 다른 방향(↗, ↙, ←, ↑ 등)으로 찾아 봐요." }],
        ok: "1305부터 가로(→) 방향으로 1000씩 커지고, 2305부터 세로(↓) 방향으로 100씩 작아져요. 규칙을 말할 때는 시작하는 수와 방향을 함께 말해요!" }),
        { q: "사물함 번호가 어떤 규칙으로 붙어 있을지 예상해 봐요.", ph: "내 규칙: 오른쪽으로 가면 ~, 아래로 가면 ~", help: ["① 이웃한 두 번호에서 어느 자리 숫자가 바뀌는지 봐요. → ② 오른쪽과 아래쪽을 따로 살펴봐요.", "‘내 규칙: 오른쪽으로 가면 ~씩 커지고, 아래로 가면 ~씩 작아져요.’ 꼴로 써요."], ans: "오른쪽(→)으로 가면 천의 자리 숫자가 1씩 커져서 1000씩 커지고, 아래(↓)로 가면 백의 자리 숫자가 1씩 작아져서 100씩 작아져요." }) },
    { name: "그려 보기 — 몇 배가 되는 배열", inst: "다온이가 ‘규칙 수 퍼즐’을 만들었어요. 이번에는 덧셈과 뺄셈으로 말하기 어려운 배열이에요. 규칙을 찾고 빈칸 ㉠, ㉡에 알맞은 수를 써 보세요.", hints: ["48은 16의 3배예요.", "48, 24, 12, 6은 아래로 갈수록 반(1/2만큼)이 돼요."],
      render: (b, a) => r6Grid(b, a, { rows: [[16, 48, 144, 432], [8, 24, { a: 72, lab: "㉠" }, 216], [4, 12, 36, 108], [2, 6, 18, { a: 54, lab: "㉡" }]],
        traces: [{ start: [0, 0], dir: "→", say: "16부터 가로(→) 방향으로 수를 차례로 눌러요." }, { start: [0, 1], dir: "↓", say: "48부터 세로(↓) 방향으로 수를 차례로 눌러요." }],
        fillWhy: { "㉠": "가로(→) 방향으로 3배가 돼요. 24의 3배는 얼마일까요?", "㉡": "가로(→) 방향으로 3배가 돼요. 18의 3배는 얼마일까요?" },
        ok: "가로(→) 방향으로 3배가 되므로 ㉠은 72, ㉡은 54예요. 세로(↓) 방향으로 1/2만큼이 되는 규칙으로도 구할 수 있어요(144의 1/2은 72)." }) },
    { name: "말해 보기 — 나눔 상자 이름표", inst: "하은이가 계절마다 모을 나눔 상자에 이름표를 붙였어요. 이름표의 글자 부분과 수 부분을 따로 살펴보고 규칙을 고른 뒤, 빈 곳에 알맞은 이름표를 써 보세요.", hints: ["가로(→)로 가면 글자는 그대로이고 수가 바뀌어요.", "세로(↓)로 가면 수는 그대로이고 글자가 봄, 여름, 가을, 겨울로 바뀌어요."],
      render: thenWhy((b, a) => r6Grid(b, a, { rows: [["봄 205", "봄 215", "봄 225", { a: "봄 235", lab: "㉠" }], ["여름 205", { a: "여름 215", lab: "㉡" }, "여름 225", "여름 235"], ["가을 205", "가을 215", "가을 225", "가을 235"], ["겨울 205", "겨울 215", "겨울 225", "겨울 235"]],
        choose: [{ q: "가로(→) 방향의 규칙은?", o: ["글자는 그대로이고, 수는 10씩 커져요", "글자는 바뀌고, 수는 그대로예요", "글자는 그대로이고, 수는 1씩 커져요"], a: 0, why: { "2": "205, 215, 225는 십의 자리 숫자가 1씩 커져요. 얼마씩 커지는 걸까요?", "1": "가로(→)로 가면 글자는 봄, 봄, 봄으로 그대로예요." } },
          { q: "세로(↓) 방향의 규칙은?", o: ["글자는 봄, 여름, 가을, 겨울 순서대로 바뀌고, 수는 그대로예요", "글자는 그대로이고, 수는 10씩 커져요", "글자도 수도 그대로예요"], a: 0 }],
        fillWhy: { "㉠": "봄 225의 오른쪽이에요. 글자는 그대로이고 수는 10씩 커져요.", "㉡": "봄 215의 아래쪽이에요. 수는 그대로이고 글자가 바뀌어요." },
        ok: "봄 225의 오른쪽은 봄 235, 봄 215의 아래쪽은 여름 215예요. 글자와 수를 나누어 보니 규칙이 잘 보여요." }),
        { q: "규칙을 말할 때 시작하는 수와 방향을 함께 말해야 하는 까닭은 무엇일까요?", ph: "방향을 말하지 않으면 ~", help: ["① 같은 표에서 방향마다 규칙이 어떻게 달랐는지 떠올려요. → ② 방향이 빠지면 생기는 일을 써요.", "‘방향에 따라 규칙이 다르기 때문이에요. 예를 들어 → 방향은 ~, ↓ 방향은 ~예요.’ 꼴로 써요."], ans: "같은 표에서도 방향에 따라 규칙이 다르기 때문이에요. 사물함 번호판은 → 방향으로 1000씩 커지지만 ↓ 방향으로는 100씩 작아졌어요." }) },
    { name: "약속하기 — 수의 배열에서 규칙 찾기", inst: "수의 배열에서 규칙을 찾는 방법을 정리해요.", hints: ["오늘 규칙을 말할 때 무엇을 꼭 함께 말했는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["수의 배열에서 규칙을 찾을 때는 ", { o: ["어느 방향으로", "어느 색깔로"], a: 0 }, " 몇씩 ", { o: ["커지거나 작아지는지", "놓여 있는지"], a: 0 }, " 살펴봐요. 덧셈과 뺄셈으로 말하기 어려우면 몇 ", { o: ["배가 되는지", "개가 있는지"], a: 0 }, " 생각해요. 규칙을 말할 때는 시작하는 수와 ", { o: ["방향을", "글자 크기를"], a: 0 }, " 함께 말해요."]) },
    { name: "확인하기 — 신발장 번호표", inst: "학교 신발장 번호표 일부가 떨어졌어요. 규칙을 찾아 문장을 완성하고 빈칸 ㉠, ㉡에 알맞은 번호를 써 보세요.", hints: ["1080, 1580, 2080은 500씩 커져요.", "1580, 1560, 1540은 십의 자리 숫자가 2씩 작아져요."],
      render: (b, a) => r6Grid(b, a, { rows: [[1080, 1580, 2080, 2580], [1060, 1560, { a: 2060, lab: "㉠" }, 2560], [1040, 1540, 2040, 2540], [1020, { a: 1520, lab: "㉡" }, 2020, 2520]],
        traces: [{ start: [0, 0], dir: "→", say: "1080부터 가로(→) 방향으로 수를 차례로 눌러요." }, { start: [0, 1], dir: "↓", say: "1580부터 세로(↓) 방향으로 수를 차례로 눌러요." }],
        fillWhy: { "㉠": "1560의 오른쪽이에요. 가로(→) 방향으로 500씩 커져요.", "㉡": "1540의 아래쪽이에요. 세로(↓) 방향으로 20씩 작아져요." },
        ok: "가로(→) 방향으로 500씩 커지고 세로(↓) 방향으로 20씩 작아지므로 ㉠은 2060, ㉡은 1520이에요." }) }
  ],
  challenge: { inst: "다온이의 → 방향 수 퀴즈예요. 규칙을 찾아 ★과 ▲에 알맞은 수를 구해 보세요.", hints: ["243은 729를 3으로 나눈 수예요.", "커지는지 작아지는지 먼저 보고, 차가 일정하지 않으면 몇분의 1이 되는지 생각해요."],
    render: (b, a) => r6Grid(b, a, { rows: [[729, 243, 81, { a: 27, lab: "★" }, 9, { a: 3, lab: "▲" }]], traces: [{ start: [0, 0], dir: "→", say: "729부터 → 방향으로 수를 차례로 눌러요." }],
      fillWhy: { "★": "81의 1/3만큼이에요. 81÷3을 생각해요.", "▲": "9의 1/3만큼이에요." },
      ok: "729부터 → 방향으로 1/3만큼이 되므로 ★은 27, ▲는 3이에요." }) }
},
{
  id: "s3", no: 3, title: "11월 나눔 달력 ― 수의 배열을 식으로 나타내기", soop: "개념 구축하기(O)",
  question: "수의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
  summary: "수의 배열에서 한 방향을 정하고 이웃한 두 수로 식을 써요. 수가 커지면 덧셈식이나 곱셈식으로, 작아지면 뺄셈식이나 나눗셈식으로 나타낼 수 있어요. 규칙에 맞는 식은 한 가지만 있는 것이 아니에요.",
  steps: [
    { name: "만져 보기 — 나눔 달력의 규칙", inst: "지후가 11월 나눔 달력을 교실에 붙였어요. 달력의 날짜에서 가로(→)와 세로(↓) 방향의 규칙을 찾아보세요.", hints: ["8, 9, 10, 11은 1씩 커져요.", "3, 10, 17, 24는 아래로 한 칸 갈 때마다 일주일씩 지나요."],
      render: ruleFirst((b, a) => r6Grid(b, a, { rows: R6S_CAL,
        traces: [{ start: [1, 0], dir: "→", say: "8부터 가로(→) 방향으로 수를 차례로 눌러요." }, { start: [0, 2], dir: "↓", say: "3부터 세로(↓) 방향으로 수를 차례로 눌러요." }],
        ok: "가로(→) 방향으로 1씩 커지고, 세로(↓) 방향으로 7씩 커져요. 일주일은 7일이니까요!" }),
        { q: "달력에서 아래 칸으로 가면 날짜가 어떻게 변할지 예상해 봐요.", ph: "내 규칙: 아래 칸으로 가면 ~", help: ["① 한 줄에 날짜가 몇 개 있는지 세어 봐요. → ② 바로 아래 칸은 며칠 뒤인지 생각해요.", "‘내 규칙: 아래 칸으로 가면 ~씩 커져요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요."], ans: "아래 칸으로 가면 7씩 커져요. 한 줄에 일주일(7일)이 있기 때문이에요." }) },
    { name: "그려 보기 — 달력 규칙을 식으로", inst: "찾은 규칙을 ‘8+1=9’처럼 이웃한 두 수로 식을 써서 나타내어 보세요. 아래에서 위(↑)로 가는 규칙은 어떤 식이 좋을까요?", hints: ["1씩 커지는 규칙은 덧셈식으로 나타내요. 예) 15+1=16", "아래에서 위로 가면 7씩 작아져요. 뺄셈식으로 나타내요. 예) 24−7=17"],
      render: (b, a) => r6EqWrite(b, a, { fig: () => r6GridFig(R6S_CAL, "11월 나눔 달력"), rules: [
        { q: "가로(→) 방향의 규칙을 이웃한 두 수로 덧셈식 2개로 나타내어 보세요.", seqs: R6S_CAL, need: 2 },
        { q: "세로(↑) 방향(아래에서 위로)의 규칙을 이웃한 두 수로 뺄셈식 2개로 나타내어 보세요.", seqs: R6S_CALCOLS.map(c => c.slice().reverse()), need: 2 }],
        ok: "15+1=16처럼 가로 규칙을, 24−7=17처럼 위로 가는 규칙을 이웃한 두 수로 나타냈어요." }) },
    { name: "말해 보기 — 4배가 되는 수 카드", inst: "다온이가 수 카드 2, 8, 32, 128, 512를 한 줄로 놓았어요. 규칙을 고르고 → 방향은 곱셈식으로, ← 방향은 나눗셈식으로 나타내어 보세요.", hints: ["8을 4배 한 수가 32예요. 8×4=32", "32의 1/4만큼이 8이에요. 32÷4=8"],
      render: thenWhy((b, a) => r6EqWrite(b, a, { fig: () => r6GridFig([[2, 8, 32, 128, 512]]),
        choose: [{ q: "2부터 → 방향의 규칙은 무엇인가요?", o: ["6씩 커져요", "4배가 돼요", "4씩 커져요"], a: 1, why: { "0": "2와 8의 차는 6이지만 8과 32의 차는 24예요. 차가 일정하지 않아요.", "2": "2와 8의 차는 6이에요." } }],
        rules: [{ q: "→ 방향의 규칙을 이웃한 두 수로 곱셈식 2개로 나타내어 보세요.", seqs: [[2, 8, 32, 128, 512]], need: 2 },
          { q: "← 방향의 규칙을 이웃한 두 수로 나눗셈식 2개로 나타내어 보세요.", seqs: [[512, 128, 32, 8, 2]], need: 2 }],
        ok: "4배가 되는 규칙은 8×4=32처럼 곱셈식으로, 1/4만큼이 되는 규칙은 512÷4=128처럼 나눗셈식으로 나타낼 수 있어요." }),
        { q: "2, 8, 32, 128의 규칙을 덧셈식이 아니라 곱셈식으로 나타내는 까닭은 무엇일까요?", ph: "이웃한 두 수의 차가 ~", help: ["① 이웃한 두 수의 차를 구해 봐요. → ② 차가 일정한지, 몇 배가 일정한지 견주어요.", "‘이웃한 두 수의 차는 ~로 일정하지 않지만, ~배는 일정하기 때문이에요.’ 꼴로 써요."], ans: "이웃한 두 수의 차는 6, 24, 96으로 일정하지 않지만 언제나 4배가 되기 때문에 곱셈식으로 나타내요." }) },
    { name: "약속하기 — 규칙을 식으로", inst: "규칙을 식으로 나타내는 방법을 정리해요.", hints: ["오늘 1씩 커지는 것은 덧셈식, 4배가 되는 것은 곱셈식으로 나타냈어요."],
      render: (b, a) => blanks(b, a, ["수의 배열에서 규칙을 식으로 나타낼 때는 한 방향을 정해 ", { o: ["이웃한", "멀리 떨어진"], a: 0 }, " 두 수로 나타내요. 수가 커지면 ", { o: ["덧셈식이나 곱셈식", "뺄셈식이나 나눗셈식"], a: 0 }, "으로, 작아지면 ", { o: ["뺄셈식이나 나눗셈식", "덧셈식이나 곱셈식"], a: 0 }, "으로 나타낼 수 있어요. 8=8처럼 ", { o: ["등호만 쓰면", "기호를 쓰면"], a: 0 }, " 규칙이 드러나지 않아요."]) },
    { name: "확인하기 — 저금통 뚜껑의 소용돌이", inst: "하은이가 저금통 뚜껑에 소용돌이 모양으로 번호 스티커를 붙였어요. 3부터 소용돌이를 따라 수가 놓여 있어요. 한 방향(또는 소용돌이를 따라)으로 이웃한 수를 3개 이상 눌러 규칙을 찾고, ㉠과 ㉡에 알맞은 수를 구해 보세요.", hints: ["3, 15, 27, 39처럼 같은 쪽으로 뻗은 수들을 살펴봐요.", "9부터 ← 방향으로 12씩 커지고, 6부터 ↓ 방향으로 12씩 커져요."],
      render: (b, a) => r6Grid(b, a, { spiral: R6S_SP.map((v, i) => i === 6 ? { a: 21, lab: "㉠" } : i === 9 ? { a: 30, lab: "㉡" } : v),
        traces: [{ say: "한 방향(또는 소용돌이를 따라)으로 이웃한 수를 3개 이상 차례로 눌러요." }],
        fillWhy: { "㉠": "9부터 ← 방향으로 12씩 커져요. 9보다 12만큼 큰 수는?", "㉡": "6부터 ↓ 방향으로 12씩 커져요. 18보다 12만큼 큰 수는?" },
        ok: "9부터 ← 방향으로 12씩 커지므로 ㉠은 21, 6부터 ↓ 방향으로 12씩 커지므로 ㉡은 30이에요." }) }
  ],
  challenge: { inst: "소용돌이 수의 배열과 다온이의 수 카드에서 규칙을 찾아 이웃한 두 수로 식을 써 보세요.", hints: ["3+12=15처럼 한 방향으로 12씩 커지는 규칙도, 3+3=6처럼 소용돌이를 따라 3씩 커지는 규칙도 좋아요.", "5, 10, 20, 40은 2배씩 커져요."],
    render: (b, a) => r6EqWrite(b, a, { fig: () => r6SpiralFig(R6S_SP, "소용돌이 수의 배열(㉠ 21, ㉡ 30)"), rules: [
      { q: "소용돌이 위 수의 배열에서 한 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", seqs: [[3, 15, 27, 39], [6, 18, 30, 42], [9, 21, 33, 45], [12, 24, 36, 48], R6S_SP], both: true, need: 2 },
      { q: "5, 10, 20, 40, 80의 → 방향 규칙을 곱셈식으로 나타내어 보세요.", seqs: [[5, 10, 20, 40, 80]], need: 1 }],
      ok: "찾은 규칙을 여러 가지 식으로 나타냈어요. 규칙이 잘 드러나는 식을 골랐어요!" }) }
},
{
  id: "s4", no: 4, title: "나눔 게시판 꾸미기 ― 도형의 배열에서 규칙 찾기", soop: "개념 구축하기(O)",
  question: "도형의 배열에서 모양과 수는 어떻게 변할까요?",
  summary: "도형의 배열에서 규칙을 찾을 때는 첫째, 둘째, 셋째, ...로 갈수록 모양이 어떻게 바뀌는지와 도형의 수가 몇 개씩 늘어나는지를 함께 살펴봐요. 찾은 규칙으로 다음 모양을 만들거나 몇째 모양인지 알 수 있어요.",
  steps: [
    { name: "만져 보기 — 게시판 테두리 무늬", inst: "하은이가 나눔 게시판 테두리를 색종이 사각형으로 꾸미고 있어요. 사각형의 수를 세어 빈 곳에 써 보세요.", hints: ["셋째 모양은 가로로 3개씩 3줄이에요.", "셋째 수는 둘째 수보다 얼마나 커졌는지 살펴봐요."],
      render: ruleFirst((b, a) => r6Shape(b, a, { gen: "rect3", what: "사각형", items: [{ n: 1, cnt: true }, { n: 2, cnt: true }, { n: 3, cnt: "?" }, { n: 4, cnt: "?" }], ok: "사각형이 3개, 6개, 9개, 12개로 3개씩 늘어나요." }),
        { q: "다음 모양으로 갈 때 사각형이 어떻게 늘어날지 예상해 봐요.", ph: "내 규칙: 사각형이 ~", help: ["① 첫째와 둘째 모양을 견주어 어디에 붙었는지 봐요. → ② 몇 개가 늘었는지 세어요.", "‘내 규칙: 세로 3줄은 그대로이고, 오른쪽에 사각형이 ~개씩 늘어나요.’ 꼴로 써요."], ans: "세로 3줄은 그대로이고 오른쪽에 한 줄씩 붙어서 사각형이 3개씩 늘어나요." }) },
    { name: "그려 보기 — 다섯째 무늬 만들기", inst: "규칙을 생각하며 다섯째 모양을 판에 만들어 보세요. ‘넷째 모양 놓기’를 누르면 넷째 모양에서 시작할 수 있어요. 모양과 수의 규칙도 골라 보세요.", hints: ["가로에 놓인 사각형의 수가 1개, 2개, 3개, 4개로 늘어나요.", "다섯째는 넷째보다 사각형이 3개 많아요(가로 5개, 세로 3줄)."],
      render: (b, a) => r6Shape(b, a, { gen: "rect3", what: "사각형", items: [1, 2, 3, 4].map(n => ({ n, cnt: true })), build: { n: 5, from: 4 },
        choose: [{ q: "첫째부터 오른쪽으로 모양은 어떻게 변하나요?", o: ["세로 3줄은 그대로이고 가로가 1개씩 늘어나는 직사각형 모양이 돼요", "세로에 놓인 사각형이 1개씩 늘어나는 모양이 돼요", "모두 정사각형 모양이에요"], a: 0, why: { "2": "셋째만 가로 3개, 세로 3줄인 정사각형이에요." } },
          { q: "사각형의 수는 어떻게 변하나요?", o: ["3개씩 늘어나요", "1개씩 늘어나요", "2배가 돼요"], a: 0, why: { "2": "6의 2배는 12이지만, 셋째는 9개예요." } }],
        ok: "다섯째 모양은 넷째 모양보다 사각형이 3개 늘어난 15개예요(가로 5개, 세로 3줄)." }) },
    { name: "말해 보기 — 민준이의 동전 탑", inst: "민준이가 100원짜리 동전으로 탑을 쌓았어요. 어떻게 늘어나는지 살펴보고 빈 곳을 채운 뒤, 다섯째 탑을 판에 만들어 보세요.", hints: ["동전이 1줄, 2줄, 3줄, 4줄로 늘어나는 삼각형 모양이에요.", "늘어나는 동전의 수가 2개, 3개, 4개, ...예요. 다섯째에는 몇 개가 늘어날까요?"],
      render: thenWhy((b, a) => r6Shape(b, a, { gen: "tri", kind: "coin", lab: "100", what: "동전", items: [{ n: 1, cnt: true }, { n: 2, cnt: true }, { n: 3, cnt: "?" }, { n: 4, cnt: "?" }], build: { n: 5, from: 4 },
        nums: [{ q: "둘째에서 셋째로 늘어난 동전의 수", a: 3, unit: "개", why: { "2": "둘째는 3개, 셋째는 6개예요." } }, { q: "셋째에서 넷째로 늘어난 동전의 수", a: 4, unit: "개", why: { "3": "셋째는 6개, 넷째는 10개예요." } }],
        ok: "동전이 2개, 3개, 4개, ...씩 늘어나요. 다섯째 탑에는 넷째 10개에서 5개 늘어난 15개가 필요해요." }),
        { q: "게시판 무늬와 동전 탑은 늘어나는 방법이 어떻게 다른가요?", ph: "게시판 무늬는 ~, 동전 탑은 ~", help: ["① 두 배열에서 늘어난 수를 차례로 써 봐요. → ② 늘어난 수가 같은지, 달라지는지 견주어요.", "‘게시판 무늬는 ~개씩 일정하게 늘어나고, 동전 탑은 ~개, ~개, ~개씩 늘어나요.’ 꼴로 써요."], ans: "게시판 무늬는 3개씩 일정하게 늘어나지만, 동전 탑은 2개, 3개, 4개, ...로 늘어나는 수가 1개씩 커져요." }) },
    { name: "약속하기 — 도형의 배열에서 규칙 찾기", inst: "도형의 배열에서 규칙을 찾는 방법을 정리해요.", hints: ["게시판 무늬와 동전 탑에서 늘어나는 수를 견주어 봐요."],
      render: (b, a) => blanks(b, a, ["도형의 배열에서는 첫째, 둘째, 셋째, ...로 갈수록 ", { o: ["모양이", "색깔이"], a: 0 }, " 어떻게 바뀌는지와 도형의 ", { o: ["수가", "이름이"], a: 0 }, " 몇 개씩 늘어나는지를 함께 살펴봐요. 게시판 무늬는 ", { o: ["3개씩 일정하게", "2개, 3개, 4개씩"], a: 0 }, " 늘어나고, 동전 탑은 ", { o: ["2개, 3개, 4개, ...씩", "3개씩 일정하게"], a: 0 }, " 늘어나요."]) },
    { name: "확인하기 — 십자 모양 스티커", inst: "하은이가 게시판 가운데에 사각형 스티커로 십자 모양을 붙여 나갔어요. 오른쪽 끝의 모양은 몇째에 알맞은 모양일까요?", hints: ["첫째 1개, 둘째 5개, 셋째 9개, 넷째 13개예요.", "다음 모양의 사각형을 세어 봐요. 위·아래·왼쪽·오른쪽으로 각각 몇 개씩 늘어났나요?"],
      render: (b, a) => quiz(b, a, [
        { fig: () => r6ShapeRow("plus", [1, 2, 3, 4], { mystery: 6 }), q: "십자 모양의 사각형의 수는 어떻게 변하나요?", o: ["1개, 5개, 9개, 13개, ...로 4개씩 늘어나요", "1개씩 늘어나요", "2배가 돼요"], a: 0, why: { "1": "첫째 1개, 둘째 5개예요. 몇 개가 늘었나요?", "2": "5의 2배는 10이지만 셋째는 9개예요." } },
        { q: "‘다음 모양’은 몇째에 알맞은 모양인가요?", o: ["다섯째", "여섯째", "일곱째"], a: 1, why: { "0": "다섯째는 넷째(13개)보다 4개 많은 17개예요. 다음 모양의 사각형을 세어 봐요.", "2": "일곱째는 네 방향으로 각각 6개씩 늘어난 25개예요." } }],
        { ok: "다음 모양은 사각형이 21개예요. 첫째 모양에서 네 방향으로 각각 5개씩 늘어났으니 여섯째예요." }) }
  ],
  challenge: { inst: "민준이가 만든 ㄴ 모양 사각형 배열이에요. 빈 곳을 채우고, 옳은 설명을 골라 보세요.", hints: ["셋째는 위쪽과 오른쪽으로 2개씩 늘어난 모양이에요.", "사각형이 1개, 3개, 5개, 7개로 늘어나요."],
    render: (b, a) => r6Shape(b, a, { gen: "ell", what: "사각형", items: [{ n: 1, cnt: true }, { n: 2, cnt: true }, { n: 3, cnt: "?" }, { n: 4, cnt: "?" }],
      nums: [{ q: "사각형은 몇 개씩 늘어나나요?", a: 2, unit: "개", why: { "1": "위쪽에 1개, 오른쪽에 1개가 늘어나요. 모두 몇 개일까요?" } }],
      choose: [{ q: "옳은 설명은 무엇인가요?", o: ["사각형이 1개부터 시작하여 위쪽과 오른쪽으로 각각 1개씩 늘어나요", "사각형이 위쪽으로만 2개씩 늘어나요"], a: 0 }],
      ok: "사각형이 1개, 3개, 5개, 7개로 2개씩 늘어나요." }) }
},
{
  id: "s5", no: 5, title: "나눔 장터 쿠키 상자 ― 도형의 배열을 식으로 나타내기", soop: "개념 구축하기(O)",
  question: "도형의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
  summary: "도형의 배열에서 몇 개씩 늘어나는지 찾으면 덧셈식으로 나타낼 수 있어요. 직사각형 모양이면 가로와 세로의 수를 곱하는 곱셈식으로도 나타낼 수 있어요. 3+5+7+9+11과 7×5는 크기가 같아요.",
  steps: [
    { name: "만져 보기 — 계단 리본 장식", inst: "게시판 아래로 사각형 리본을 계단처럼 붙여 내려가요. 같은 색은 같은 때 붙인 리본이에요. 사각형의 수를 세고, 다섯째 모양을 판에 만들어 보세요.", hints: ["첫째는 3개, 그다음부터는 아래 오른쪽으로 2개씩 붙어요.", "넷째 모양의 맨 아래 줄보다 한 칸 아래, 한 칸 오른쪽에 2개를 놓아요."],
      render: ruleFirst((b, a) => r6Shape(b, a, { gen: "stair2", anchor: "top", what: "사각형", layers: true, items: [{ n: 1, cnt: true }, { n: 2, cnt: true }, { n: 3, cnt: "?" }, { n: 4, cnt: "?" }], build: { n: 5, from: 4 },
        choose: [{ q: "사각형의 수는 어떻게 변하나요?", o: ["3개부터 시작하여 2개씩 늘어나요", "2개부터 시작하여 3개씩 늘어나요", "2배가 돼요"], a: 0 }],
        ok: "사각형이 아래 오른쪽으로 늘어나는 계단 모양이 되고, 3개부터 시작하여 2개씩 늘어나요(3, 5, 7, 9, 11)." }),
        { q: "리본이 어떻게 늘어날지 예상해 봐요.", ph: "내 규칙: ~개부터 시작해서 ~", help: ["① 첫째 모양의 사각형 수를 세요. → ② 다음 모양에서 몇 개가 어디에 붙는지 봐요.", "‘내 규칙: ~개부터 시작해서 아래쪽에 ~개씩 늘어나요.’ 꼴로 써요."], ans: "3개부터 시작해서 아래 오른쪽에 2개씩 늘어나요." }) },
    { name: "그려 보기 — 리본 수를 덧셈식으로", inst: "사각형의 수의 규칙을 식으로 나타내어 보세요.", hints: ["둘째는 첫째 3개에 2개가 더해져 3+2예요.", "넷째는 셋째(3+2+2)에 2개가 더 늘어나요. 다섯째도 같은 방법으로 써요."],
      render: (b, a) => r6Shape(b, a, { gen: "stair2", anchor: "top", what: "사각형", layers: true, items: [{ n: 1, expr: "3" }, { n: 2, expr: "3+2" }, { n: 3, expr: "3+2+2" }, { n: 4, expr: { a: "3+2+2+2" } }, { n: 5, hide: true, expr: { a: "3+2+2+2+2" } }],
        ok: "넷째는 3+2+2+2, 다섯째는 넷째에서 2개 더 늘어나 3+2+2+2+2예요." }) },
    { name: "말해 보기 — 쿠키 상자", inst: "나눔 장터에서 팔 쿠키를 상자에 직사각형으로 담아요. 같은 색은 앞 상자에서 새로 늘어난 쿠키예요. 쿠키의 수를 덧셈식으로 나타내어 보세요.", hints: ["둘째는 첫째 3개에 5개가 늘어나 3+5예요.", "늘어나는 쿠키가 5개, 7개, 9개, ...예요. 다섯째에는 11개가 늘어나요."],
      render: (b, a) => r6Shape(b, a, { gen: "rectP", kind: "mod", what: "쿠키", layers: true, items: [{ n: 1, expr: "3" }, { n: 2, expr: "3+5" }, { n: 3, expr: "3+5+7" }, { n: 4, expr: { a: "3+5+7+9" } }, { n: 5, hide: true, expr: { a: "3+5+7+9+11" } }],
        ok: "쿠키가 3개부터 시작하여 5개, 7개, 9개, ...씩 늘어나며 직사각형이 커져요. 다섯째는 3+5+7+9+11이에요." }) },
    { name: "약속하기 — 도형의 배열을 식으로", inst: "도형의 배열에서 규칙을 식으로 나타내는 방법을 정리해요.", hints: ["쿠키 상자는 덧셈식으로도, 가로×세로의 곱셈식으로도 나타낼 수 있어요."],
      render: (b, a) => blanks(b, a, ["도형의 배열에서 몇 개씩 늘어나는지 찾으면 ", { o: ["덧셈식", "나눗셈식"], a: 0 }, "으로 나타낼 수 있어요. 직사각형 모양이면 가로와 세로의 수를 곱하는 ", { o: ["곱셈식", "뺄셈식"], a: 0 }, "으로도 나타낼 수 있어요. 한 가지 배열을 ", { o: ["여러 가지 식", "한 가지 식"], a: 0 }, "으로 나타낼 수 있어요."]) },
    { name: "확인하기 — 가로×세로로 세기", inst: "같은 쿠키 상자를 이번에는 가로와 세로의 수로 살펴봐요. 쿠키의 수를 (가로)×(세로)의 곱셈식으로 나타내어 보세요.", hints: ["첫째는 가로 3개, 세로 1줄이라 3×1이에요.", "가로와 세로가 각각 1줄씩 늘어나요. 다섯째는 가로 7개, 세로 5줄이에요."],
      render: thenWhy((b, a) => r6Shape(b, a, { gen: "rectP", kind: "mod", what: "쿠키", items: [{ n: 1, expr: "3×1" }, { n: 2, expr: "4×2" }, { n: 3, expr: "5×3" }, { n: 4, expr: { a: "6×4" } }, { n: 5, hide: true, expr: { a: "7×5" } }],
        choose: [{ q: "3+5+7+9+11과 7×5의 크기를 비교하면 어떤가요?", o: ["크기가 같아요", "3+5+7+9+11이 더 커요", "7×5가 더 커요"], a: 0, why: { "1": "둘 다 다섯째 상자의 쿠키 수를 나타낸 식이에요.", "2": "둘 다 다섯째 상자의 쿠키 수를 나타낸 식이에요." } }],
        ok: "다섯째는 7×5예요. 같은 상자를 3+5+7+9+11로도, 7×5로도 나타낼 수 있어요. 둘 다 35예요." }),
        { q: "3+5+7+9+11과 7×5의 크기가 같은 까닭을 쿠키 상자로 설명해 볼까요?", ph: "두 식은 모두 ~", help: ["① 두 식이 각각 무엇을 세었는지 떠올려요. → ② 같은 상자를 센 것인지 말해요.", "‘두 식은 모두 다섯째 상자의 쿠키 수예요. 덧셈식은 ~, 곱셈식은 ~로 센 것이에요.’ 꼴로 써요."], ans: "두 식은 모두 다섯째 상자의 쿠키 수예요. 덧셈식은 늘어난 쿠키를 차례로 더해 세었고, 곱셈식은 가로 7개씩 세로 5줄로 세었어요." }) }
  ],
  challenge: { inst: "여섯째 쿠키 상자를 판에 만들고, 쿠키의 수를 곱셈식으로 나타내어 보세요.", hints: ["‘다섯째 모양 놓기’를 누른 뒤 가로와 세로를 1줄씩 늘려요.", "여섯째는 가로 8개, 세로 6줄이에요."],
    render: (b, a) => r6Shape(b, a, { gen: "rectP", kind: "mod", what: "쿠키", items: [{ n: 4, expr: "6×4" }, { n: 5, expr: "7×5" }, { n: 6, hide: true, expr: { a: "8×6" } }], build: { n: 6, from: 5 },
      nums: [{ q: "여섯째 상자의 쿠키는 모두 몇 개인가요?", a: 48, unit: "개", why: { "42": "가로는 8개, 세로는 6줄이에요.", "36": "가로는 6개가 아니라 8개예요." } }],
      ok: "여섯째는 8×6=48(개)예요. 3+5+7+9+11+13으로 더해도 48이에요." }) }
},
{
  id: "s6", no: 6, title: "저금 기록장 ― 덧셈식과 뺄셈식의 배열", soop: "개념 구축하기(O)",
  question: "덧셈식과 뺄셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
  summary: "계산식의 배열에서는 변하는 수와 변하지 않는 수를 살펴 규칙을 찾아요. 합이 일정할 때 더해지는 수가 커진 만큼 더하는 수는 작아지고, 차가 일정할 때 빼지는 수가 커진 만큼 빼는 수도 커져요. 규칙으로 다음 계산 결과를 추측하고 계산기로 확인해요.",
  steps: [
    { name: "만져 보기 — 둘이 함께 500원", inst: "서연이와 지후는 날마다 둘이 합쳐 500원을 넣기로 했어요. 지후의 기록장에서 식마다 변하는 수가 있는 자리를 눌러 표시하고, 규칙을 골라 보세요.", hints: ["합 500은 모든 식에서 같아요.", "서연이가 넣은 돈은 100, 150, 200, 250으로, 지후는 400, 350, 300, 250으로 변해요."],
      render: ruleFirst((b, a) => r6Seq(b, a, { lists: [R6S_ADD], mark: true,
        choose: [{ q: "덧셈식의 배열에서 찾은 규칙은 무엇인가요?", o: ["합이 일정할 때 더해지는 수가 50씩 커지면 더하는 수는 50씩 작아져요", "더해지는 수와 더하는 수가 모두 50씩 커져요", "합이 50씩 커져요"], a: 0, why: { "1": "지후가 넣은 돈은 400, 350, 300으로 작아져요.", "2": "합은 모두 500이에요." } }],
        ok: "합이 500으로 일정할 때 서연이가 50원 더 넣으면 지후는 50원 덜 넣어요." }),
        { q: "서연이가 넣는 돈이 늘어나면 지후가 넣는 돈은 어떻게 될지 예상해 봐요.", ph: "내 규칙: 서연이가 늘어나면 지후는 ~", help: ["① 둘이 합친 돈이 늘 같다는 것을 떠올려요. → ② 한 사람이 늘리면 다른 사람은 어떻게 해야 할지 생각해요.", "‘내 규칙: 서연이가 ~원 늘리면 지후는 ~원 줄여요.’ 꼴로 써요."], ans: "둘이 합쳐 500원이 되어야 하므로 서연이가 50원 늘리면 지후는 50원 줄여요." }) },
    { name: "그려 보기 — 다음 식 쓰기", inst: "덧셈식과 뺄셈식의 배열에서 규칙을 찾아 ㉠과 ㉡에 알맞은 식을 써 보세요.", hints: ["㉠: 더해지는 수는 50 커지고, 더하는 수는 50 작아져요.", "㉡: 빼지는 수가 10씩 커지면 빼는 수도 10씩 커지고 차는 400으로 같아요."],
      render: (b, a) => r6Seq(b, a, { lists: [R6L(R6S_ADD, [{ lab: "㉠", e: "□+□=□", a: [300, 200, 500] }]), R6L(R6S_SUB, [{ lab: "㉡", e: "□-□=□", a: [560, 160, 400] }])],
        ok: "㉠은 300+200=500, ㉡은 560−160=400이에요. 차가 일정할 때 빼지는 수가 10씩 커지면 빼는 수도 10씩 커져요." }) },
    { name: "말해 보기 — 9와 1이 늘어나는 덧셈식", inst: "지후가 계산기로 신기한 덧셈식을 찾았어요. 규칙을 찾아 넷째 □를 추측하고, 다섯째에 알맞은 덧셈식을 써 보세요. 추측한 뒤 계산기로 확인해요.", hints: ["더해지는 수는 99부터 9가 1개씩 늘어나요.", "더하는 수는 11부터 1이 1개씩 늘어나고, 합은 110부터 1이 1개씩 늘어나요."],
      render: thenWhy((b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "덧셈식의 배열", heads: ["더해지는 수", "더하는 수", "합"], rows: [{ lab: "첫째", e: "99+11=110" }, { lab: "둘째", e: "999+111=1110" }, { lab: "셋째", e: "9999+1111=11110" }, { lab: "넷째", e: "□+11111=111110", a: [99999] }, { lab: "다섯째", e: "□+□=□", a: [999999, 111111, 1111110] }] }],
        ok: "넷째 □는 99999, 다섯째는 999999+111111=1111110이에요. 계산하지 않아도 규칙으로 추측할 수 있어요." }),
        { q: "다섯째 식을 계산하지 않고 어떻게 알아냈는지 설명해 볼까요?", ph: "더해지는 수는 ~, 더하는 수는 ~, 합은 ~", help: ["① 세 자리(더해지는 수·더하는 수·합)에서 무엇이 1개씩 늘어나는지 봐요. → ② 그 규칙을 다섯째에 그대로 이어요.", "‘더해지는 수는 9가, 더하는 수는 1이, 합은 1이 하나씩 늘어나므로 다섯째는 ~예요.’ 꼴로 써요."], ans: "더해지는 수는 9가 1개씩, 더하는 수는 1이 1개씩, 합은 1이 1개씩 늘어나므로 다섯째는 999999+111111=1111110이에요." }) },
    { name: "약속하기 — 계산식의 배열", inst: "덧셈식과 뺄셈식의 배열에서 찾은 규칙을 정리해요.", hints: ["서연이와 지후의 기록장, 하은이의 뺄셈식 카드를 떠올려요."],
      render: (b, a) => blanks(b, a, ["계산식의 배열에서는 ", { o: ["변하는 수와 변하지 않는 수", "가장 큰 수"], a: 0 }, "를 살펴 규칙을 찾아요. 합이 일정할 때 더해지는 수가 50씩 커지면 더하는 수는 50씩 ", { o: ["작아져요", "커져요"], a: 0 }, ". 차가 일정할 때 빼지는 수가 10씩 커지면 빼는 수도 10씩 ", { o: ["커져요", "작아져요"], a: 0 }, ". 찾은 규칙으로 다음 계산 결과를 ", { o: ["추측하고", "지우고"], a: 0 }, " 계산기로 확인해요."]) },
    { name: "확인하기 — 5와 3이 늘어나는 뺄셈식", inst: "하은이가 만든 뺄셈식의 배열이에요. 규칙을 찾아 다섯째에 알맞은 뺄셈식을 쓰고, 차가 2222222가 되는 식은 몇째인지 골라 보세요.", hints: ["빼지는 수는 54부터 5가 1개씩, 빼는 수는 32부터 3이 1개씩 늘어나요.", "차는 22부터 2가 1개씩 늘어나요. 첫째 차는 2가 2개예요."],
      render: (b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "뺄셈식의 배열", heads: ["빼지는 수", "빼는 수", "차"], rows: [{ lab: "첫째", e: "54-32=22" }, { lab: "둘째", e: "554-332=222" }, { lab: "셋째", e: "5554-3332=2222" }, { lab: "넷째", e: "55554-33332=22222" }, { lab: "다섯째", e: "□-□=□", a: [555554, 333332, 222222] }] }],
        choose: [{ q: "규칙에 따라 차가 2222222가 되는 뺄셈식은 몇째일까요?", o: ["다섯째", "여섯째", "일곱째"], a: 1, why: { "0": "다섯째 차는 222222예요. 2가 몇 개인지 세어 봐요.", "2": "첫째 차는 2가 2개, 둘째는 3개예요. 2가 7개면 몇째일까요?" } }],
        ok: "다섯째는 555554−333332=222222예요. 차의 2가 7개인 2222222는 여섯째(5555554−3333332)예요." }) }
  ],
  challenge: { inst: "다른 모둠의 저금 기록이에요. 규칙을 찾아 빈칸에 알맞은 식을 써 보세요.", hints: ["250+150, 230+170: 더해지는 수는 20씩 작아지고 더하는 수는 20씩 커져요.", "600−250, 650−300: 빼지는 수와 빼는 수가 모두 50씩 커져요."],
    render: (b, a) => r6Seq(b, a, { calc: true, lists: [
      { title: "덧셈식의 배열", heads: ["더해지는 수", "더하는 수", "합"], rows: [{ e: "250+150=400" }, { e: "230+170=400" }, { e: "210+190=400" }, { e: "190+210=400" }, { lab: "㉠", e: "□+□=□", a: [170, 230, 400] }] },
      { title: "뺄셈식의 배열", heads: ["빼지는 수", "빼는 수", "차"], rows: [{ e: "600-250=350" }, { e: "650-300=350" }, { e: "700-350=350" }, { e: "750-400=350" }, { lab: "㉡", e: "□-□=□", a: [800, 450, 350] }] }],
      ok: "㉠은 170+230=400, ㉡은 800−450=350이에요. 계산기로 확인해 보면 모두 맞아요!" }) }
},
{
  id: "s7", no: 7, title: "지후의 계산기 놀이 ― 곱셈식과 나눗셈식의 배열", soop: "개념 구축하기(O)",
  question: "곱셈식과 나눗셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
  summary: "곱셈식과 나눗셈식의 배열에서도 변하는 수와 변하지 않는 수를 살펴 규칙을 찾아요. 찾은 규칙으로 다음 곱이나 몫을 추측하고 계산기로 확인해요.",
  steps: [
    { name: "만져 보기 — 1이 늘어나는 곱셈식", inst: "저금 기록을 맡은 지후가 쉬는 시간에 계산기로 곱셈식을 만들었어요. 변하는 수가 있는 자리를 눌러 표시하고, 규칙을 찾아 ㉠에 알맞은 식을 써 보세요.", hints: ["곱하는 수 6은 모든 식에서 같아요.", "곱해지는 수의 1이 1개씩 늘어나면 곱의 6도 1개씩 늘어나요."],
      render: ruleFirst((b, a) => r6Seq(b, a, { lists: [R6L(R6S_MUL, [{ lab: "㉠", e: "□×□=□", a: [11111, 6, 66666] }])], mark: true,
        choose: [{ q: "곱셈식의 배열에서 찾은 규칙은 무엇인가요?", o: ["곱해지는 수는 1부터 1이 1개씩 늘어나고, 곱은 6부터 6이 1개씩 늘어나요", "곱하는 수가 1씩 커져요", "곱이 6씩 커져요"], a: 0, why: { "1": "곱하는 수는 모두 6이에요.", "2": "곱은 6, 66, 666으로 6이 1개씩 늘어나요." } }],
        ok: "㉠은 11111×6=66666이에요." }),
        { q: "1111×6 다음 식의 곱은 어떻게 될지 예상해 봐요.", ph: "내 규칙: 곱해지는 수에 1이 늘어나면 곱은 ~", help: ["① 곱해지는 수의 1의 개수와 곱의 6의 개수를 견주어요. → ② 다음 식에서 몇 개가 될지 생각해요.", "‘내 규칙: 곱해지는 수의 1이 ~개이면 곱의 6도 ~개예요.’ 꼴로 써요."], ans: "곱해지는 수의 1이 몇 개이면 곱의 6도 그만큼 있어요. 그래서 11111×6의 곱은 66666이에요." }) },
    { name: "그려 보기 — 8이 늘어나는 나눗셈식", inst: "이번에는 나눗셈식이에요. 변하는 수가 있는 자리를 눌러 표시하고 ㉡에 알맞은 식을 써 보세요.", hints: ["나누는 수 8은 모든 식에서 같아요.", "나누어지는 수의 8이 1개씩 늘어나면 몫의 1도 1개씩 늘어나요."],
      render: (b, a) => r6Seq(b, a, { lists: [R6L(R6S_DIV, [{ lab: "㉡", e: "□÷□=□", a: [88888, 8, 11111] }])], mark: true,
        ok: "나누어지는 수는 8부터 8이 1개씩 늘어나고, 몫은 1부터 1이 1개씩 늘어나요. ㉡은 88888÷8=11111이에요." }) },
    { name: "말해 보기 — 9가 늘어나는 곱셈식", inst: "곱셈식의 배열에서 규칙을 찾아 넷째 곱을 추측하고, 다섯째에 알맞은 곱셈식을 써 보세요. 추측한 뒤 계산기로 확인해요.", hints: ["곱해지는 수 6은 그대로이고 곱하는 수는 9부터 9가 1개씩 늘어나요.", "곱은 54부터 5와 4 사이에 9가 1개씩 늘어나요."],
      render: thenWhy((b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "곱셈식의 배열", heads: ["곱해지는 수", "곱하는 수", "곱"], rows: [{ lab: "첫째", e: "6×9=54" }, { lab: "둘째", e: "6×99=594" }, { lab: "셋째", e: "6×999=5994" }, { lab: "넷째", e: "6×9999=□", a: [59994] }, { lab: "다섯째", e: "□×□=□", a: [6, 99999, 599994] }] }],
        ok: "넷째 곱은 59994, 다섯째는 6×99999=599994예요." }),
        { q: "넷째 곱 59994를 어떻게 추측했는지 설명해 볼까요?", ph: "곱하는 수에 9가 1개 늘어나면 곱은 ~", help: ["① 곱하는 수의 9의 개수와 곱의 모양을 견주어요. → ② 셋째 곱에서 무엇이 하나 늘어나는지 써요.", "‘곱하는 수에 9가 1개 늘어나면 곱은 5와 4 사이에 9가 1개 늘어나므로 ~예요.’ 꼴로 써요."], ans: "곱하는 수에 9가 1개 늘어나면 곱은 5와 4 사이에 9가 1개 늘어나요. 셋째 곱 5994에서 9를 하나 더 넣으면 59994예요." }) },
    { name: "약속하기 — 곱셈식과 나눗셈식의 배열", inst: "곱셈식과 나눗셈식의 배열에서 규칙을 찾는 방법을 정리해요.", hints: ["오늘 계산을 모두 하지 않고도 다음 곱과 몫을 알아냈어요."],
      render: (b, a) => blanks(b, a, ["곱셈식과 나눗셈식의 배열에서도 ", { o: ["변하는 수와 변하지 않는 수", "가장 작은 수"], a: 0 }, "를 살펴 규칙을 찾아요. 곱해지는 수의 1이 1개씩 늘어나면 곱의 6도 1개씩 ", { o: ["늘어나요", "줄어들어요"], a: 0 }, ". 찾은 규칙으로 다음 곱이나 몫을 ", { o: ["추측하고", "어림하지 않고"], a: 0 }, " 계산기로 확인해요."]) },
    { name: "확인하기 — 81이 늘어나는 나눗셈식", inst: "나눗셈식의 배열에서 규칙을 찾아 다섯째에 알맞은 나눗셈식을 쓰고, 몫이 90909090909가 되는 식은 몇째인지 골라 보세요.", hints: ["나누어지는 수는 81부터 81이 1번씩 더 붙고, 나누는 수는 9로 같아요.", "몫은 9부터 09가 1번씩 더 붙어요. 몫의 9의 개수를 세어 봐요."],
      render: (b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "나눗셈식의 배열", heads: ["나누어지는 수", "나누는 수", "몫"], rows: [{ lab: "첫째", e: "81÷9=9" }, { lab: "둘째", e: "8181÷9=909" }, { lab: "셋째", e: "818181÷9=90909" }, { lab: "넷째", e: "81818181÷9=9090909" }, { lab: "다섯째", e: "□÷□=□", a: [8181818181, 9, 909090909] }] }],
        choose: [{ q: "규칙에 따라 몫이 90909090909가 되는 나눗셈식은 몇째일까요?", o: ["다섯째", "여섯째", "일곱째"], a: 1, why: { "0": "다섯째 몫은 909090909예요. 9가 몇 개인지 세어 봐요.", "2": "첫째 몫에는 9가 1개, 둘째에는 2개예요. 9가 6개면 몇째일까요?" } }],
        ok: "다섯째는 8181818181÷9=909090909예요. 몫의 9가 6개인 90909090909는 여섯째예요." }) }
  ],
  challenge: { inst: "다른 친구들이 찾은 계산식이에요. 규칙을 찾아 빈칸에 알맞은 식을 쓰고, 잘못 설명한 사람을 찾아보세요.", hints: ["20×101, 30×101: 곱해지는 수가 10씩 커지면 곱은 1010씩 커져요.", "612÷6, 6012÷6: 나누어지는 수의 6과 1 사이 0이 1개 늘어나면 몫의 1과 2 사이 0도 1개 늘어나요."],
    render: (b, a) => r6Seq(b, a, { calc: true, lists: [
      { title: "곱셈식의 배열", heads: ["곱해지는 수", "곱하는 수", "곱"], rows: [{ e: "20×101=2020" }, { e: "30×101=3030" }, { e: "40×101=4040" }, { e: "50×101=5050" }, { lab: "㉠", e: "□×□=□", a: [60, 101, 6060] }] },
      { title: "나눗셈식의 배열", heads: ["나누어지는 수", "나누는 수", "몫"], rows: [{ e: "240÷2=120" }, { e: "360÷3=120" }, { e: "480÷4=120" }, { e: "600÷5=120" }, { lab: "㉡", e: "□÷□=□", a: [720, 6, 120] }] },
      { title: "나눗셈식의 배열", heads: ["나누어지는 수", "나누는 수", "몫"], rows: [{ lab: "첫째", e: "612÷6=102" }, { lab: "둘째", e: "6012÷6=1002" }, { lab: "셋째", e: "60012÷6=10002" }, { lab: "넷째", e: "600012÷6=100002" }] }],
      choose: [{ q: "서연: “나누어지는 수는 6과 1 사이에 0이 1개씩 늘어나고 몫은 1과 2 사이에 0이 1개씩 늘어나.” 민준: “다섯째에 알맞은 나눗셈식은 6000012÷6=100002야.” 잘못 설명한 사람은?", o: ["서연", "민준"], a: 1, why: { "0": "서연이의 말은 맞아요. 민준이가 말한 몫의 0의 개수를 세어 봐요." } }],
      ok: "민준이가 잘못 설명했어요. 다섯째는 6000012÷6=1000002예요." }) }
},
{
  id: "s8", no: 8, title: "공정하게 나누어요 ― 크기가 같은 두 양과 등호", soop: "개념 구축하기(O)",
  question: "크기가 같은 두 양의 관계를 어떻게 식으로 나타낼 수 있을까요?",
  summary: "저울이 수평을 이루면 양쪽의 양이 같아요. 5+9=6+8, 9−4=12−7, 3×8=6×4와 같이 크기가 같은 두 양의 관계를 등호(=)를 사용하여 식으로 나타낼 수 있어요. 한쪽 수가 커지거나 작아진 만큼 다른 수가 어떻게 바뀌는지 살펴보면 계산하지 않고도 알 수 있어요.",
  steps: [
    { name: "만져 보기 — 저울로 확인하기", inst: "저금통 돈으로 산 공책을 두 모둠에 나누어 주려고 해요. 저울 왼쪽 가에는 공책 11권, 오른쪽 나에는 공책 14권이 있어요(공책의 무게는 모두 같아요). 식 11−1=14−4가 옳은지 저울로 확인해 보세요.", hints: ["가에서 1권을 덜어 내면 10권, 나에서 4권을 덜어 내면 10권이에요.", "저울이 수평이면 양쪽 공책의 수가 같아요."],
      render: thenWhy((b, a) => r6Balance(b, a, { tasks: [{ L: 11, R: 14, need: { L: 1, R: 4 }, say: "가에서 1권을, 나에서 4권을 덜어 내 보세요.",
        choose: [{ q: "저울이 수평을 이루나요?", o: ["수평을 이뤄요", "가 쪽으로 기울어요", "나 쪽으로 기울어요"], a: 0 },
          { q: "저울이 수평을 이루면 등호를 사용한 식 11−1=14−4는 옳은가요?", o: ["옳아요", "옳지 않아요"], a: 0, why: { "1": "저울 양쪽의 공책이 10권으로 같으니 등호 양쪽의 크기도 같아요." } }] }],
        ok: "가에서 1권을 덜어 내면 10권, 나에서 4권을 덜어 내면 10권이라 수평을 이뤄요. 그래서 11−1=14−4는 옳아요." }),
        { q: "등호(=)를 사용한 식이 옳은지 저울로 어떻게 알 수 있을까요?", ph: "저울이 ~이면 등호 양쪽의 ~", help: ["① 등호 왼쪽과 오른쪽을 저울의 어디에 올리는지 생각해요. → ② 수평일 때 무엇이 같은지 써요.", "‘등호 왼쪽과 오른쪽을 저울 양쪽에 올렸을 때 ~을 이루면 두 양의 크기가 같으므로 식이 옳아요.’ 꼴로 써요."], ans: "등호 왼쪽과 오른쪽을 저울 양쪽에 올렸을 때 수평을 이루면 두 양의 크기가 같으므로 식이 옳아요." }) },
    { name: "그려 보기 — 수평 만들기", inst: "저울을 이용하여 등호를 사용한 식을 만들어 보세요. 수평이 되도록 공책을 덜어 내고 □에 알맞은 수를 써요.", hints: ["가에서 3권을 덜어 내면 8권이에요. 나도 8권이 되려면 몇 권을 덜어 내야 할까요?", "나에서 8권을 덜어 내면 6권이에요. 가도 6권이 되려면?"],
      render: (b, a) => r6Balance(b, a, { tasks: [
        { L: 11, R: 14, pre: { L: 3 }, eq: "11-3=14-□", say: "가에서 3권을 덜어 냈어요. 저울이 수평을 이루도록 나에서 덜어 내고 식을 완성해요." },
        { L: 11, R: 14, pre: { R: 8 }, eq: "11-□=14-8", say: "이번에는 나에서 8권을 덜어 냈어요. 가에서 덜어 내 수평을 만들고 식을 완성해요." }],
        ok: "11−3=14−6, 11−5=14−8이에요. 가 쪽이 나 쪽보다 3권 적으니, 나에서 가보다 3권 더 많이 덜어 내야 수평이 돼요." }) },
    { name: "말해 보기 — 나눔 꾸러미", inst: "나눔 꾸러미에는 간식을 15개씩 담아요. 위 그림처럼 사탕의 수가 변하면 젤리의 수는 어떻게 변하는지 살펴보고, 아래 꾸러미로 6+9=□+□의 식을 2개 만들어 보세요.", hints: ["사탕이 1개 줄면 젤리는 1개 늘어나요. 6+9=5+10", "사탕이 3개 늘면 젤리는 3개 줄어요. 6+9=9+6"],
      render: (b, a) => r6Plate(b, a, { r: 6, b: 9, need: 2, names: ["사탕", "젤리"], examples: [[2, 13, 3, 12], [9, 6, 11, 4]],
        choose: [{ q: "사탕의 수가 늘어나면 젤리의 수는 어떻게 되나요?", o: ["늘어난 만큼 줄어들어요", "똑같이 늘어나요", "변하지 않아요"], a: 0, why: { "1": "꾸러미에 담는 간식은 15개로 같아요.", "2": "사탕이 늘어나면 15개를 맞추려고 젤리가 바뀌어요." } }],
        ok: "꾸러미에 담는 간식이 15개로 같아서 사탕이 늘어난 만큼 젤리가 줄어들어요." }) },
    { name: "약속하기 — 등호(=)", inst: "약속을 완성해요.", hints: ["저울이 수평을 이룬 것처럼 양쪽의 크기가 같아요."],
      render: (b, a) => blanks(b, a, ["5+9=6+8, 9−4=12−7, 3×8=6×4와 같이 ", { o: ["크기가 같은", "모양이 같은"], a: 0 }, " 두 양의 관계를 ", { o: ["등호(=)", "더하기 기호(+)"], a: 0 }, "를 사용하여 식으로 나타낼 수 있어요. 등호는 ‘답을 쓰라’는 표시가 아니라 양쪽의 크기가 ", { o: ["같다", "다르다"], a: 0 }, "는 뜻이에요."]) },
    { name: "확인하기 — 크기가 같은 두 양 찾기", inst: "나눔 장터 가격표에서 크기가 같은 두 양을 골라 등호로 이어 보세요. 25+35=30×2는 보기로 이미 이었어요. 계산하기보다 수의 변화를 살펴 두 카드를 차례로 눌러요.", hints: ["40+40에서 한 수가 1 작아지면 다른 수는 1 커져야 해요.", "63−23에서 빼지는 수가 2 커지면 빼는 수도 2 커져야 해요."],
      render: (b, a) => r6Match(b, a, { faceUp: true, cols: 3, order: ["25+35", "40+40", "63-23", "30×2", "65-25", "39+41"], pairs: [["25+35", "30×2"], ["40+40", "39+41"], ["63-23", "65-25"]], pre: [0],
        ok: "40+40=39+41, 63−23=65−25예요. 계산하지 않고 수의 변화로 찾았어요!" }) }
  ],
  challenge: { inst: "등호를 사용한 식이 옳으면 참, 옳지 않으면 거짓을 고르세요. ‘저울에 올리기’를 누르면 양쪽을 저울로 볼 수 있어요. 아래 □도 채워 보세요.", hints: ["15−6은 15개에서 6개를 덜어 낸 것이에요.", "등호는 ‘답을 쓰라’는 표시가 아니라 양쪽의 크기가 같다는 뜻이에요."],
    render: (b, a) => r6Judge(b, a, { eqs: ["6+7=13", "15-6=8", "9=4+5", "5+5=10+5", "8+5=15-2", "12=12"],
      why: { 1: "15개에서 6개를 덜어 내면 9개예요. 8과 같나요?", 2: "등호 왼쪽에 수 하나만 있어도 돼요. 9와 4+5의 크기를 비교해요.", 3: "5+5는 10, 10+5는 15예요. 크기가 같나요?", 4: "8+5와 15−2를 저울에 올려 비교해 봐요.", 5: "12와 12는 크기가 같아요." },
      nums: [{ q: "6+3+8=6+□", a: 11, why: { "17": "17은 6+3+8의 값이에요. 6+□가 17이 되어야 해요.", "23": "23은 등호 양쪽의 수를 모두 더한 수예요. 6+□도 17이 되어야 해요." } },
        { q: "3+16=7+□", a: 12, why: { "19": "19는 3+16의 값이에요. 3이 7로 4만큼 커졌으니 16은 4만큼 작아져야 해요.", "20": "3이 7로 커졌으니 16은 작아져야 해요." } },
        { q: "74−20=★−10에서 ★", a: 64, why: { "54": "54는 74−20의 값이에요. 빼는 수가 10만큼 작아졌으니 빼지는 수도 10만큼 작아져야 해요.", "84": "빼는 수가 작아지면 빼지는 수도 작아져야 차가 같아요." } }],
      ok: "등호는 양쪽의 크기가 같다는 뜻이에요. 6+7=13, 9=4+5, 8+5=15−2, 12=12는 참이고 15−6=8, 5+5=10+5는 거짓이에요." }) }
},
{
  id: "s9", no: "9~10", title: "나눔 저금통을 열어요 ― 규칙으로 모은 돈 구하기", soop: "탐구 정리하기(O)",
  question: "규칙을 찾아 식으로 나타내면 모은 금액을 어떻게 쉽게 구할 수 있을까요?",
  summary: "서연이는 50원부터 시작하여 매일 100원씩 늘려 가며 12일 동안 저금했어요. 날마다 넣은 50원짜리 동전은 1개, 3개, 5개, ...로 2개씩 늘어나요. 동전을 옮겨 정사각형을 만들면 1+3+5는 3×3이고, 12일 동안은 12×12=144(개)이므로 7200원이에요.",
  steps: [
    { name: "만져 보기 — 문제 이해하기", inst: "“서연이는 50원부터 시작하여 매일 100원씩 늘려 가며 나눔 저금통에 저금했어요. 12일 동안 저금했을 때, 서연이가 모은 금액은 모두 얼마일까요?” 문제를 이해해 보세요.", hints: ["문제의 마지막 문장에 구하려는 것이 있어요.", "‘매일 100원씩 늘려 가며’를 찾아봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "구하려는 것은 무엇인가요?", o: ["12일 동안 서연이가 모은 금액", "서연이가 첫째 날 넣은 금액", "서연이가 저금한 날수"], a: 0 },
        { q: "서연이는 매일 얼마씩 늘려 가며 저금하나요?", o: ["50원", "100원", "150원"], a: 1, why: { "0": "50원은 첫째 날 넣은 금액이에요." } },
        { q: "얼마 동안 저금했나요?", o: ["10일", "12일", "20일"], a: 1 }],
        { ok: "50원부터 시작하여 매일 100원씩 늘려 가며 12일 동안 모은 금액을 구해요." }) },
    { name: "그려 보기 — 해결 계획 세우기", inst: "민준: “넣은 동전의 수에서 규칙을 찾아볼까?” 하은: “그림을 그려 규칙을 식으로 나타내 볼까?” 어떻게 해결하면 좋을지 골라 보세요.", hints: ["날마다 넣은 50원짜리 동전의 수를 그림으로 나타내 봐요."],
      render: (b, a) => quiz(b, a, [
        { q: "어떤 방법으로 해결하면 좋을까요?", o: ["넣은 동전의 수에서 규칙을 찾아 식으로 나타내고, 그림을 그려 덧셈을 곱셈으로 바꾸어요", "날마다 넣은 금액을 대강 어림해요", "12일 동안 날마다 같은 금액을 넣었다고 생각해요"], a: 0, why: { "2": "서연이는 매일 100원씩 늘려 가며 넣었어요. 날마다 금액이 달라요." } },
        { q: "첫째 날 50원, 둘째 날 150원을 넣었어요. 50원짜리 동전으로 나타내면 둘째 날은 몇 개인가요?", o: ["2개", "3개", "4개"], a: 1, why: { "0": "50원짜리 2개는 100원이에요. 150원은 몇 개일까요?" } }],
        { ok: "50원짜리 동전의 수로 규칙을 찾고, 그림을 그려 식으로 나타내요." }) },
    { name: "말해 보기 — 동전 줄을 덧셈식으로", inst: "50원짜리 동전으로 날마다 넣은 동전을 줄지어 놓았어요. 첫째 줄은 첫째 날, 둘째 줄은 둘째 날이에요. 동전의 수를 식으로 나타내 보세요.", hints: ["날마다 동전이 1개, 3개, 5개, 7개로 2개씩 늘어나요.", "넷째는 1+3+5에 넷째 날 7개를 더해요."],
      render: (b, a) => r6Shape(b, a, { gen: "coinOdd", kind: "coin", lab: "50", what: "동전", items: [{ n: 1, expr: "1" }, { n: 2, expr: "1+3" }, { n: 3, expr: { a: "1+3+5" } }, { n: 4, expr: { a: "1+3+5+7" } }],
        ok: "셋째는 1+3+5, 넷째는 1+3+5+7이에요. 동전이 3개, 5개, 7개씩 늘어나요." }) },
    { name: "약속하기 — 덧셈을 곱셈으로", inst: "보기처럼 동전의 위치를 옮겨 덧셈을 곱셈으로 바꾸어요(보기: 1+3 → 2×2). 동전을 옮겨 정사각형을 만들고, 12일 동안의 동전과 금액을 구해 보세요.", hints: ["넷째 줄 동전 3개를 첫째 줄로, 셋째 줄 동전 1개를 둘째 줄로 옮기면 줄마다 4개가 돼요. 1+3+5+7=4×4", "둘째는 2×2, 셋째는 3×3, 넷째는 4×4예요. 열두째는 12×12예요."],
      render: thenWhy((b, a) => r6Coins(b, a, { rows: [1, 3, 5, 7], lab: "50",
        nums: [{ q: "열두째 날까지의 동전을 정사각형으로 옮기면 한 줄에 몇 개씩인가요?", a: 12, unit: "개", why: { "23": "23개는 열두째 날 하루에 넣은 동전 수예요." } },
          { q: "12일 동안 넣은 50원짜리 동전은 모두 몇 개인가요?", a: 144, unit: "개", why: { "23": "23개는 열두째 날 하루에 넣은 동전 수예요.", "24": "12×12를 계산해요.", "132": "12×12를 다시 계산해 봐요." } },
          { q: "서연이가 12일 동안 모은 금액은 모두 얼마인가요?", a: 7200, unit: "원", why: { "144": "144는 동전의 수예요. 50원짜리 동전 144개는 얼마일까요?", "14400": "동전 하나는 100원이 아니라 50원이에요." } }],
        ok: "1+3+5+7은 4×4예요. 12일 동안은 12×12=144(개)이므로 서연이는 7200원을 모았어요." }),
        { q: "1+3+5+7을 4×4로 바꿀 수 있는 까닭을 동전으로 설명해 볼까요?", ph: "동전을 옮겨 ~ 모양을 만들면 ~", help: ["① 동전을 옮긴 뒤의 모양을 떠올려요. → ② 한 줄에 몇 개씩 몇 줄인지 말해요.", "‘긴 줄의 동전을 짧은 줄로 옮기면 한 줄에 ~개씩 ~줄인 정사각형이 되기 때문이에요.’ 꼴로 써요."], ans: "긴 줄의 동전을 짧은 줄로 옮기면 한 줄에 4개씩 4줄인 정사각형이 되기 때문이에요. 동전의 수는 그대로예요." }) },
    { name: "확인하기 — 되돌아봐요", inst: "문제를 해결한 과정을 되돌아봐요.",
      render: (b, a) => writeStep(b, a, [
        { q: "문제를 해결한 방법을 설명해 보세요.", tag: "방법", ph: "예) 동전의 수를 1+3+5+...로 나타내고, 동전을 옮겨 정사각형을 만들어 12×12로 구했어요.", help: ["① 동전의 수를 어떤 식으로 나타냈는지 써요. → ② 그 식을 어떻게 곱셈으로 바꾸었는지 써요.", "‘동전의 수를 ~로 나타내고, 동전을 옮겨 ~ 모양을 만들어 ~×~로 구했어요.’ 꼴로 써요."], ans: "동전의 수를 1+3+5+…로 나타내고, 동전을 옮겨 정사각형 모양을 만들어 12×12=144(개)로 구했어요. 50원짜리 144개는 7200원이에요." },
        { q: "다른 방법으로도 해결할 수 있을까요?", tag: "다른 방법", ph: "예) 50원+150원+250원+...+1150원을 차례로 더해요.", help: ["① 날마다 넣은 금액을 차례로 써 봐요. → ② 그것을 어떻게 더할 수 있을지 생각해요.", "‘날마다 넣은 금액 ~원, ~원, …을 차례로 더해요.’ 꼴로 써요."], ans: "날마다 넣은 금액 50원, 150원, 250원, …, 1150원을 차례로 더해도 7200원이 나와요." }]) }
  ],
  challenge: { inst: "스스로 풀어요. 하은이는 300원부터 시작하여 매일 200원씩 늘려 가며 8일 동안 저금했어요. 100원짜리 동전을 옮겨 직사각형을 만들고, 하은이가 모은 금액을 구해 보세요.", hints: ["동전은 3개, 5개, 7개, 9개로 늘어나요. 3+5+7+9는 6×4로 바꿀 수 있어요.", "첫째 3×1, 둘째 4×2, 셋째 5×3, 넷째 6×4, ... 여덟째는 10×8이에요."],
    render: (b, a) => r6Coins(b, a, { rows: [3, 5, 7, 9], lab: "100",
      nums: [{ q: "8일 동안 하은이가 넣은 100원짜리 동전은 모두 몇 개인가요?", a: 80, unit: "개", why: { "64": "하은이는 첫째 날 동전 3개로 시작해요. 3+5는 4×2, 3+5+7은 5×3이에요.", "17": "17개는 여덟째 날 하루에 넣은 동전 수예요." } },
        { q: "하은이가 8일 동안 모은 금액은 모두 얼마인가요?", a: 8000, unit: "원", why: { "80": "80은 동전의 수예요. 100원짜리 동전 80개는 얼마일까요?" } }],
      ok: "3+5+7+9는 6×4예요. 8일 동안은 10×8=80(개)이므로 하은이는 8000원을 모았어요." }) }
},
{
  id: "s11", no: 11, title: "나눔 장터 ‘내 짝을 찾아라!’ 놀이", soop: "발표하기(P)",
  question: "크기가 같은 두 양을 어떻게 빨리 찾을 수 있을까요?",
  summary: "나눔 장터 놀이 부스에서 크기가 같은 두 양의 카드를 찾아 등호를 사용한 식을 완성했어요. 모두 계산하기보다 한쪽 수가 커진 만큼 다른 수가 작아졌는지(덧셈), 같이 커졌는지(뺄셈) 살펴보면 빨리 찾을 수 있어요.",
  steps: [
    { name: "만져 보기 — 놀이 방법 알기", inst: "나눔 장터에서 4학년 1반이 ‘내 짝을 찾아라!’ 놀이 부스를 열어요. 2명이 하는 놀이예요. 놀이 방법을 차례대로 눌러 보세요.", hints: ["먼저 문제 카드의 식을 완성하고 반으로 잘라요.", "카드를 더 많이 가져간 사람이 이겨요."],
      render: (b, a) => sequence(b, a, ["카드 2장을 골라 뒤집어요", "문제 카드의 식을 완성하고 반으로 잘라요", "카드를 더 많이 가져간 사람이 이겨요", "자른 카드를 섞어 뒤집어 놓고 가위바위보로 순서를 정해요", "크기가 같으면 카드를 가져오고, 다르면 다시 뒤집어 놓아요"], [1, 3, 0, 4, 2],
        { ok: "식 완성 → 섞어 뒤집기 → 2장 뒤집기 → 같으면 가져오기 → 많이 가져간 사람이 승리!" }) },
    { name: "그려 보기 — 문제 카드 만들기", inst: "부스에서 쓸 문제 카드의 등호를 사용한 식을 완성해요. 왼쪽과 똑같은 식이 아니면 어떤 수라도 좋아요(두 자리 수까지).", hints: ["6+17에서 6이 7로 1만큼 커지면 17은 16으로 1만큼 작아져야 해요.", "3×8에서 3을 2배 하면 8은 반으로 줄어야 해요. 6×4"],
      render: (b, a) => r6EqFill(b, a, { items: [{ l: "6+17", op: "+", ex: "7+16" }, { l: "15-4", op: "-", ex: "16-5" }, { l: "9+12", op: "+", ex: "10+11" }, { l: "3×8", op: "×", ex: "6×4" }],
        ok: "크기가 같은 두 양으로 문제 카드를 완성했어요. 친구와 서로 맞는지 확인해 봐요." }) },
    { name: "말해 보기 — 놀이하기", inst: "카드 2장을 차례로 뒤집어요. 크기가 같으면 카드를 가져오고, 다르면 다시 뒤집혀요. 친구와 ‘둘이 번갈아 하기’로 놀이해도 좋아요.", hints: ["뒤집었던 카드의 자리를 잘 기억해요.", "11+11과 짝이 되는 카드는 더해서 22가 되는 카드예요."],
      render: (b, a) => r6Match(b, a, { pairs: R6S_PAIRS, cols: 4, ok: "크기가 같은 두 양을 찾아 등호로 이었어요!" }) },
    { name: "약속하기 — 빨리 찾는 방법", inst: "놀이에서 알게 된 것을 정리해요.", hints: ["40+40=39+41, 63−23=64−24를 떠올려요."],
      render: thenWhy((b, a) => blanks(b, a, ["크기가 같은 두 양인지 알아볼 때는 모두 계산하기보다 수의 ", { o: ["변화를", "색깔을"], a: 0 }, " 살펴봐요. 덧셈에서는 한 수가 커진 만큼 다른 수가 ", { o: ["작아지면", "커지면"], a: 0 }, " 크기가 같고, 뺄셈에서는 빼지는 수가 커진 만큼 빼는 수도 ", { o: ["커지면", "작아지면"], a: 0 }, " 크기가 같아요."]),
        { q: "놀이 부스를 찾은 1학년 동생에게 짝을 빨리 찾는 비법을 알려 준다면 뭐라고 말할까요?", ph: "덧셈 카드에서는 ~, 뺄셈 카드에서는 ~", help: ["① 덧셈 카드끼리 짝인지 볼 때 살펴볼 것을 써요. → ② 뺄셈 카드도 써요.", "‘덧셈 카드는 한 수가 커진 만큼 다른 수가 ~ 짝이고, 뺄셈 카드는 두 수가 똑같이 ~ 짝이야.’ 꼴로 써요."], ans: "덧셈 카드는 한 수가 커진 만큼 다른 수가 작아졌으면 짝이고, 뺄셈 카드는 두 수가 똑같이 커지거나 작아졌으면 짝이야." }) },
    { name: "확인하기 — 가져올 수 있을까?", inst: "놀이 중에 두 카드를 뒤집었어요. 물음에 답해 보세요.", hints: ["26에서 27로 1 커졌으면 17은 1 작아져야 해요.", "19에서 21로 2 커졌으면 24는 2 작아져야 해요."],
      render: (b, a) => quiz(b, a, [
        { q: "가져올 수 있는 두 카드는 어느 것인가요?", o: ["26+17과 27+16", "40−13과 41−12", "7×4와 6×5"], a: 0, why: { "1": "빼지는 수가 1만큼 커지면 빼는 수도 1만큼 커져야 해요. 41−14여야 해요.", "2": "7×4는 28, 6×5는 30으로 크기가 달라요." } },
        { q: "19+24와 짝이 되는 카드는 어느 것인가요?", o: ["21+22", "21+26", "17+24"], a: 0, why: { "1": "19에서 21로 2만큼 커졌으니 24는 2만큼 작아져야 해요.", "2": "19는 17로 작아졌는데 24는 그대로예요." } }],
        { ok: "수의 변화를 살펴보면 계산하지 않고도 크기가 같은 두 양을 찾을 수 있어요." }) }
  ],
  challenge: { inst: "카드가 20장인 어려운 판이에요. 뒤집은 횟수를 줄여 모든 짝을 찾아보세요.", hints: ["곱셈 카드는 곱셈 카드끼리, 뺄셈 카드는 뺄셈 카드끼리 짝이 될 때가 많아요.", "26+18은 한 수가 2 커진 만큼 다른 수가 2 작아진 28+16과 짝이에요."],
    render: (b, a) => r6Match(b, a, { pairs: R6S_PAIRS2, cols: 5, ok: "어려운 판에서도 크기가 같은 두 양을 모두 찾았어요!" }) }
},
{
  id: "s12", no: 12, title: "나눔 저금통 발표회 ― 배운 내용 확인하기", soop: "발표하기(P)",
  question: "규칙과 관계에서 배운 내용을 잘 알고 있나요?",
  summary: "수의 배열과 도형의 배열에서 규칙을 찾아 식으로 나타내고, 계산식의 배열에서 다음 계산 결과를 추측해요. 크기가 같은 두 양은 등호를 사용하여 식으로 나타내요. 4학년 1반은 규칙적으로 모은 돈을 기부하며 나눔 저금통 프로젝트를 마쳤어요.",
  steps: [
    { name: "만져 보기 — 줄어드는 수의 배열", inst: "발표회 첫 문제예요. 수의 배열에서 → 방향의 규칙을 찾아 이웃한 두 수로 식을 써 보세요.", hints: ["486, 162, 54는 작아지는 배열이에요. 차가 일정한가요?", "작아지는 규칙은 뺄셈식이나 나눗셈식으로 나타내요. 486÷3=162"],
      render: (b, a) => r6EqWrite(b, a, { fig: () => r6GridFig([[486, 162, 54, 18, 6, 2]]),
        choose: [{ q: "486부터 → 방향의 규칙은 무엇인가요?", o: ["324씩 작아져요", "1/3만큼이 돼요", "3배가 돼요"], a: 1, why: { "0": "486−162=324이지만 162−54=108이에요. 차가 일정하지 않아요.", "2": "→ 방향으로 갈수록 수가 작아져요." } }],
        rules: [{ q: "→ 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", seqs: [[486, 162, 54, 18, 6, 2]], need: 2 }],
        ok: "486부터 → 방향으로 1/3만큼이 돼요. 486÷3=162, 162÷3=54처럼 나타내요." }) },
    { name: "그려 보기 — 십자 스티커를 식으로", inst: "하은이의 십자 모양 스티커 배열이에요. 사각형의 수를 식으로 나타내고, 다섯째 모양을 판에 만들어 보세요.", hints: ["둘째는 1+4, 셋째는 1+4+4예요.", "다섯째는 넷째 모양에서 위·아래·왼쪽·오른쪽 끝에 1개씩 더 붙여요."],
      render: (b, a) => r6Shape(b, a, { gen: "plus", what: "사각형", items: [{ n: 1, expr: "1" }, { n: 2, expr: "1+4" }, { n: 3, expr: { a: "1+4+4" } }, { n: 4, expr: { a: "1+4+4+4" } }], build: { n: 5, from: 4 },
        ok: "셋째는 1+4+4, 넷째는 1+4+4+4예요. 다섯째는 네 방향으로 1개씩 늘어난 17개예요." }) },
    { name: "말해 보기 — 등호 식 완성하기", inst: "등호(=)를 사용한 식을 완성해요. 계산하기보다 수의 변화를 살펴봐요.", hints: ["9+7=10+□: 더해지는 수가 1만큼 커졌으니 더하는 수는 1만큼 작아져야 해요.", "40−12=□−22: 빼는 수가 10만큼 커졌으니 빼지는 수도 10만큼 커져야 해요."],
      render: (b, a) => numbers(b, a, [
        { q: "9+7=10+□", a: 6, why: { "16": "16은 9+7의 값이에요. 10+□가 16이 되어야 해요.", "8": "더해지는 수가 커지면 더하는 수는 작아져야 해요." } },
        { q: "15+□=25+14", a: 24, why: { "39": "39는 25+14의 값이에요. 15+□가 39가 되어야 해요.", "4": "15가 25로 10만큼 커졌어요. 그러니 □는 14보다 10만큼 커야 해요." } },
        { q: "18−□=17−6", a: 7, why: { "11": "11은 17−6의 값이에요. 18−□도 11이 되어야 해요.", "5": "빼지는 수가 1만큼 커지면 빼는 수도 1만큼 커져야 해요." } },
        { q: "40−12=□−22", a: 50, why: { "28": "28은 40−12의 값이에요. □−22가 28이 되어야 해요.", "30": "빼는 수가 커지면 빼지는 수도 커져야 해요." } }],
      { ok: "6, 24, 7, 50이에요. 수의 변화를 살펴 등호 양쪽의 크기를 같게 만들었어요." }) },
    { name: "약속하기 — 여섯째 식 추측하기", inst: "계산식의 배열에서 규칙을 찾아 여섯째에 알맞은 식을 써 보세요.", hints: ["덧셈식: 더해지는 수는 100씩 커지고 더하는 수는 205 그대로예요.", "뺄셈식: 빼지는 수와 빼는 수가 모두 110씩 커지면 차는 223으로 그대로예요."],
      render: (b, a) => r6Seq(b, a, { calc: true, lists: [
        { title: "덧셈식의 배열", heads: ["더해지는 수", "더하는 수", "합"], rows: [{ lab: "첫째", e: "312+205=517" }, { lab: "둘째", e: "412+205=617" }, { lab: "셋째", e: "512+205=717" }, { lab: "넷째", e: "612+205=817" }, { lab: "다섯째", e: "712+205=917" }, { lab: "여섯째", e: "□+□=□", a: [812, 205, 1017] }] },
        { title: "뺄셈식의 배열", heads: ["빼지는 수", "빼는 수", "차"], rows: [{ lab: "첫째", e: "365-142=223" }, { lab: "둘째", e: "475-252=223" }, { lab: "셋째", e: "585-362=223" }, { lab: "넷째", e: "695-472=223" }, { lab: "다섯째", e: "805-582=223" }, { lab: "여섯째", e: "□-□=□", a: [915, 692, 223] }] }],
      ok: "여섯째 덧셈식은 812+205=1017, 뺄셈식은 915−692=223이에요." }) },
    { name: "확인하기 — 비밀 글자 찾기", inst: "수의 배열과 계산식의 배열에서 규칙을 찾아 □ 안에 알맞은 수를 구하고, 그 수가 적힌 칸을 색칠해 보세요. 발표회 마지막 구호가 나와요!", hints: ["4, 12, 36은 3배씩 커져요.", "62−40, 72−50: 빼지는 수와 빼는 수가 모두 10씩 커져요. 12÷1, 24÷2: 몫은 12로 같아요."],
      render: (b, a) => r6Letters(b, a, { probs: ["① 4, 12, 36, □, 324, □", "② 62−40=22, 72−50=22, 82−60=22, 92−□=22", "③ 12÷1=12, 24÷2=12, 36÷3=12, □÷4=12"],
        tiles: [[108, "나"], [118, "사"], [972, "눔"], [962, "랑"], [70, "실"], [60, "저"], [48, "천"], [44, "금"]], ans: [108, 972, 70, 48], word: "나눔 실천",
        ok: "□는 108, 972, 70, 48이에요." }) },
    { name: "확인하기 — 예전 생각, 지금 생각", inst: "1차시에 궁금했던 것을 떠올리며, 나눔 저금통 발표회에서 말할 내용을 써 보세요.",
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "1차시에 궁금했던 것 가운데 하나를 골라, 이제 어떻게 답할 수 있는지 써 보세요.", tag: "궁금증 해결", ph: "예) 달력에서 아래 칸으로 가면 7씩 커지는 까닭은 ~", help: ["① 1차시에 붙인 ‘궁금해요’ 쪽지 하나를 골라요. → ② 이 단원에서 배운 규칙으로 답해요.", "‘~이 궁금했는데, 이제는 ~ 때문이라는 것을 알아요.’ 꼴로 써요."], ans: "달력에서 아래 칸으로 가면 왜 7씩 커지는지 궁금했는데, 이제는 한 줄에 일주일(7일)이 있기 때문이라는 것을 알아요." },
        { q: "나눔 저금통 프로젝트에서 규칙을 알아서 편리했던 점을 발표문으로 써 보세요.", tag: "발표문", ph: "예) 규칙을 식으로 나타내니 ~", help: ["① 규칙을 이용한 활동 하나를 떠올려요. → ② 규칙을 알아서 무엇이 편했는지 써요.", "‘~에서 규칙을 찾아 ~로 나타내니 ~을 쉽게 알 수 있었어요.’ 꼴로 써요."], ans: "서연이가 모은 동전에서 규칙을 찾아 12×12로 나타내니 하나하나 더하지 않고도 모은 금액 7200원을 쉽게 알 수 있었어요." }])) }
  ],
  challenge: { inst: "마인드맵 — ‘규칙과 관계’를 정리해요. 떠오르는 말을 모으고, 묶고, 이어 보세요.", hints: ["수의 배열, 도형의 배열, 계산식의 배열, 등호", "시작하는 수와 방향, 변하는 수와 변하지 않는 수", "크기가 같은 두 양, 저울, 수평"],
    render: withOptional(
      (b, a) => panes(b, a, [
        { t: "떠오르는 말", e: "🧠", ph: "규칙과 관계 → ~", hint: "배열, 방향, 등호…", ex: ["규칙과 관계 → 수의 배열, 도형의 배열, 계산식의 배열", "규칙과 관계 → 등호, 저울, 크기가 같은 두 양"] },
        { t: "묶어 보기", e: "🗂", ph: "규칙 찾기: ~", hint: "비슷한 것끼리 묶어요", ex: ["규칙 찾기: 시작하는 수, 방향, 몇씩 커지거나 작아지는지", "등호: 저울의 수평, 크기가 같은 두 양, 수의 변화"] },
        { t: "이어지는 말", e: "🔗", ph: "~와 ~는 이어져요", hint: "예: 커지는 규칙과 덧셈식", ex: ["커지는 규칙과 덧셈식·곱셈식은 이어져요.", "저울이 수평인 것과 등호는 이어져요."] },
        { t: "덧붙이는 말", e: "✏️", ph: "예를 들면 ~", hint: "예를 들거나 더 설명해요", ex: ["예를 들면 달력은 아래로 7씩 커지니까 3+7=10으로 나타내요.", "예를 들면 40+40=39+41은 한 수가 1 작아진 만큼 다른 수가 1 커졌어요."] }],
        { min: 1, ok: "규칙과 관계를 한눈에 정리했어요. 나눔 저금통 프로젝트 완료!" }),
      (b, a) => r6Seq(b, a, { calc: true, lists: [{ title: "곱셈식의 배열", heads: ["곱해지는 수", "곱하는 수", "곱"], rows: [{ lab: "첫째", e: "12345679×9=111111111" }, { lab: "둘째", e: "12345679×18=222222222" }, { lab: "셋째", e: "12345679×27=333333333" }, { lab: "넷째", e: "12345679×36=444444444" }, { lab: "?", e: "12345679×□=777777777", a: [63], why: "곱이 111111111의 몇 배인지 생각해 봐요. 곱하는 수도 9의 그만큼 배가 돼요." }] }],
        choose: [{ q: "곱이 777777777이 되는 곱셈식은 몇째일까요?", o: ["여섯째", "일곱째", "여덟째"], a: 1, why: { "0": "여섯째 곱은 666666666이에요.", "2": "여덟째 곱하는 수는 9×8=72예요." } }],
        ok: "곱하는 수는 9씩 커지고 곱은 111111111씩 커져요. 777777777은 일곱째, 12345679×63이에요." }),
      { title: "더 해 보고 싶다면 — 선택 문제", inst: "발표회 보너스 문제예요. 곱셈식의 배열에서 규칙을 찾아 보세요." }) }
}
];
