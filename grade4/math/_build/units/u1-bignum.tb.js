//@@APP
const APP={title:"예준이의 나눔 큰 수", unit:"4-1 수학 1. 큰 수(교과서)", key:"t41-bignum-v1", welcome:"예준이와 함께 나눔과 기부 속 큰 수를 배우는 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 예준이와 함께 나눔과 기부 활동 속 큰 수를 읽고 쓰고, 뛰어 세고, 크기를 비교해요."};
//@@UNIT
/* ===== 큰 수 단원: 수 읽기·쓰기 도우미 (BigInt, 문자열) ===== */
const N1_D = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const N1_P = ["", "십", "백", "천"];
const N1_U = ["", "만", "억", "조"];
const N1_PLACE = ["일", "십", "백", "천", "만", "십만", "백만", "천만", "억", "십억", "백억", "천억", "조", "십조", "백조", "천조"];
function n1S(v) { return BigInt(typeof v === "string" ? v.replace(/[^\d]/g, "") || "0" : v).toString(); }
function n1Chunks(v) { const s = n1S(v), out = []; for (let i = s.length; i > 0; i -= 4) out.push(Number(s.slice(Math.max(0, i - 4), i))); return out; }
function n1Read4(c) { let r = ""; const ds = String(c).padStart(4, "0"); for (let i = 0; i < 4; i++) { const d = +ds[i], p = 3 - i; if (!d) continue; r += (d === 1 && p > 0 ? "" : N1_D[d]) + N1_P[p]; } return r; }
/* 수 → 읽는 말 (만·억·조 단위로 띄어 씀). 10000 → "만", 12000 → "만 이천", 100000000 → "일억" */
function n1Read(v) {
  const s = n1S(v); if (s === "0") return "영";
  const ch = n1Chunks(s), parts = [];
  for (let k = ch.length - 1; k >= 0; k--) {
    const c = ch[k]; if (!c) continue;
    let w = n1Read4(c);
    if (k > 0 && c === 1) w = (k === ch.length - 1 && k === 1) ? "" : "일";
    parts.push(w + N1_U[k]);
  }
  return parts.join(" ");
}
/* 바르게 읽은 말들(띄어쓰기 뺌): 1이 붙은 만·억·조는 '일만'·'만' 모두 받음 */
function n1ReadSet(v) {
  const ch = n1Chunks(v); let outs = [""];
  for (let k = ch.length - 1; k >= 0; k--) {
    const c = ch[k]; if (!c) continue;
    const opts = (k > 0 && c === 1) ? ["일" + N1_U[k], N1_U[k]] : [n1Read4(c) + N1_U[k]];
    outs = outs.flatMap(o => opts.map(x => o + x));
  }
  return new Set(outs);
}
/* 수 → 섞어 쓰기: 23586 → "2만 3586", 384500000000 → "3845억" */
function n1Mix(v) {
  const ch = n1Chunks(v); if (ch.length === 1) return String(ch[0]);
  const parts = [];
  for (let k = ch.length - 1; k >= 0; k--) if (ch[k]) parts.push(ch[k] + N1_U[k]);
  return parts.join(" ") || "0";
}
/* 세 자리마다 쉼표(생활에서 쓰는 꼴) */
function n1Comma(v) { return n1S(v).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
/* 학생이 쓴 수 → 숫자 문자열 (쉼표·띄어쓰기·끝 단위 무시, '2만 3586' 꼴도 받음). 못 읽으면 null */
function n1Parse(raw, opt = {}) {
  let s = String(raw == null ? "" : raw).replace(/[\s,，_]/g, "").replace(/(원|명|회|kg|km|개|년|mL|화소|배|씩)$/, "");
  if (!s) return null;
  if (/^\d+$/.test(s)) return s.length > 1 && s[0] === "0" ? null : BigInt(s).toString();
  if (opt.digits) return null;
  const m = s.match(/^(?:(\d{1,4})조)?(?:(\d{1,4})억)?(?:(\d{1,4})만)?(\d{1,4})?$/);
  if (!m || !(m[1] || m[2] || m[3])) return null;
  let v = 0n;
  [[m[1], 12], [m[2], 8], [m[3], 4], [m[4], 0]].forEach(([d, e]) => { if (d) v += BigInt(d) * 10n ** BigInt(e); });
  return v.toString();
}
/* 한글로 읽은 말 → 수 (진단용, 너그럽게). {v, zero:'영'을 씀, ilBad:'일천' 꼴} */
function n1ParseKo(raw) {
  const s = String(raw == null ? "" : raw).replace(/[\s,]/g, "");
  if (!s || !/^[일이삼사오육칠팔구영공십백천만억조]+$/.test(s)) return null;
  const D = { 일: 1, 이: 2, 삼: 3, 사: 4, 오: 5, 육: 6, 칠: 7, 팔: 8, 구: 9, 영: 0, 공: 0 }, P = { 십: 1, 백: 2, 천: 3 }, U = { 만: 4, 억: 8, 조: 12 };
  let total = 0n, chunk = 0, digit = null, zero = false, ilBad = false, lastU = 99, lastP = 99, any = false;
  for (const ch of s) {
    if (ch in D) { if (digit !== null) return null; digit = D[ch]; if (digit === 0) zero = true; }
    else if (ch in P) { const p = P[ch]; if (p >= lastP) return null; if (digit === 1) ilBad = true; chunk += (digit === null ? 1 : digit) * 10 ** p; digit = null; lastP = p; any = true; }
    else { const u = U[ch]; if (u >= lastU) return null; if (digit !== null) chunk += digit; else if (!any && chunk === 0) chunk = 1; total += BigInt(chunk) * 10n ** BigInt(u); chunk = 0; digit = null; lastP = 99; lastU = u; any = false; }
  }
  if (digit !== null) chunk += digit; total += BigInt(chunk);
  return { v: total.toString(), zero, ilBad };
}
/* 읽은 말 채점: {ok, msg} */
function n1JudgeRead(input, target) {
  const norm = String(input == null ? "" : input).replace(/[\s,]/g, "");
  if (!norm) return { ok: false, msg: "읽는 말을 한글로 써 봐요." };
  if (n1ReadSet(target).has(norm)) return { ok: true };
  if (/\d/.test(norm)) return { ok: false, msg: "숫자가 아니라 읽는 말(한글)로 써요. 예: 2만 3586 → 이만 삼천오백팔십육" };
  const p = n1ParseKo(norm);
  if (!p) return { ok: false, msg: "높은 자리부터 ‘천, 백, 십’과 ‘만, 억, 조’를 차례대로 붙여 읽어 봐요." };
  if (p.zero) return { ok: false, msg: "숫자가 0인 자리는 읽지 않아요. ‘영’을 빼고 다시 읽어 봐요." };
  if (p.v === n1S(target) && p.ilBad) return { ok: false, msg: "십, 백, 천 앞의 ‘일’은 읽지 않아요. 예: 천오백(○), 일천오백(×)" };
  if (p.v === n1S(target)) return { ok: false, msg: "거의 맞았어요. 띄어쓰기 말고 글자를 다시 살펴봐요." };
  return { ok: false, msg: "일의 자리부터 네 자리씩 끊고, 높은 자리부터 만·억·조를 붙여 읽어 봐요." };
}
/* 수 → 각 자리 값의 합 */
function n1Parts(v) { const s = n1S(v); const out = []; for (let i = 0; i < s.length; i++) if (s[i] !== "0") out.push(s[i] + "0".repeat(s.length - 1 - i)); return out; }
function n1Expand(v) { return n1Parts(v).join(" + "); }
function n1Cmp(a, b) { const x = BigInt(n1S(a)), y = BigInt(n1S(b)); return x > y ? ">" : x < y ? "<" : "="; }
/* 받침 있는 말 뒤 조사: n1J("23586", "은/는") */
function n1HasB(word) {
  let w = String(word).trim(); if (/^\d[\d,]*$/.test(w)) w = n1Read(w);
  const c = w.charCodeAt(w.length - 1); if (c < 0xAC00 || c > 0xD7A3) return false; return (c - 0xAC00) % 28 !== 0;
}
function n1J(word, pair) { const [a, b] = pair.split("/"); return String(word) + (n1HasB(word) ? a : b); }
function n1Place(e) { return N1_PLACE[e] + "의 자리"; }
/* 으로/로: 받침이 없거나 ㄹ 받침이면 '로' */
function n1Ro(word) { let w = String(word).trim(); if (/^\d+$/.test(w)) w = n1Read(w); const j = (w.charCodeAt(w.length - 1) - 0xAC00) % 28; return String(word) + (j === 0 || j === 8 ? "로" : "으로"); }

/* ===== 화면 도우미 ===== */
function n1Esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function n1R(s) { return n1Esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
function n1T(s) { return String(s).replace(/\*\*/g, ""); }
function n1H(tag, attrs, s) { const e = h(tag, attrs || {}); e.innerHTML = n1R(s); return e; }
function n1Fit(svg, mh) { svg.style.maxHeight = mh || "52vh"; svg.style.width = "100%"; svg.style.height = "auto"; svg.style.display = "block"; return svg; }
function n1Inp(w, label, kb) { return h("input", { type: "text", inputmode: kb || "numeric", autocomplete: "off", spellcheck: "false", style: `width:${w};max-width:100%;font-size:1.15em`, "aria-label": label || "답" }); }
const N1_BLUE = "#2B7BD6", N1_RED = "#D9534F", N1_SOFT = ["#FFF3E0", "#E8F4FD", "#EAF7EE", "#F6EDFB"];
const N1_WRAP = "overflow-wrap:anywhere;word-break:break-all";
/* 숫자 문자열에서 바뀐 자리 숫자를 칠해 보여 줌 */
function n1Diff(prev, cur) {
  const a = n1S(prev), b = n1S(cur), L = Math.max(a.length, b.length), pa = a.padStart(L, " "), pb = b.padStart(L, " ");
  let out = ""; for (let i = 0; i < L; i++) { if (pb[i] === " ") continue; out += pa[i] !== pb[i] ? `<b style="color:${N1_RED}">${pb[i]}</b>` : pb[i]; }
  return out;
}

/* ---------- 묻기 모음 ----------
   t:"num"  수 쓰기 (a: 답, digits:true 이면 0을 모두 쓴 수만, kb:"text" 이면 '30만' 꼴 입력 편하게)
   t:"read" 읽는 말 쓰기 (a: 수)
   t:"pick" 고르기 (o, a: 번호|[번호…], why:{"번호": 까닭})
   t:"cmp"  두 수 비교 (l, r: 수, ls, rs: 보여 줄 글)
   t:"line" 빈칸 채우기 (parts: ["글", {a:수, show:"351억"}, …]) */
function n1Ask(body, api, items, opts = {}) {
  const wrap = h("div"), rows = [];
  const ansOf = it => it.t === "pick" ? (Array.isArray(it.a) ? it.a : [it.a]).map(i => n1T(it.o[i])).join(", ")
    : it.t === "read" ? n1Read(it.a)
    : it.t === "cmp" ? `${n1T(it.ls || it.l)} ${n1Cmp(it.l, it.r)} ${n1T(it.rs || it.r)}`
    : it.t === "line" ? it.parts.filter(p => typeof p !== "string").map(p => p.show || n1S(p.a)).join(", ")
    : `${it.show || n1S(it.a)}${it.unit ? " " + it.unit : ""}`;
  items.forEach((it, qi) => {
    const box = h("div", { class: "qitem" });
    if (it.q) box.append(n1H("div", { class: "jua", style: N1_WRAP }, `${items.length > 1 ? qi + 1 + ". " : ""}${it.q}`));
    if (it.fig) box.append(it.fig());
    const row = { it, msg: null };
    if (it.t === "pick") {
      const sel = new Set(), multi = Array.isArray(it.a), line = h("div", { class: "opts" });
      it.o.forEach((o, oi) => {
        const b = n1H("button", { class: "opt", style: N1_WRAP }, o);
        b.onclick = () => { if (multi) { sel.has(oi) ? sel.delete(oi) : sel.add(oi); b.classList.toggle("on"); } else { sel.clear(); sel.add(oi); [...line.children].forEach(x => x.classList.remove("on")); b.classList.add("on"); } };
        line.append(b);
      });
      box.append(line);
      const get = () => [...sel].sort((a, b) => a - b);
      row.ok = () => { const v = get(), w = (multi ? it.a : [it.a]).slice().sort((a, b) => a - b); return v.length === w.length && w.every((x, i) => x === v[i]); };
      row.show = g => [...line.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (sel.has(i)) b.classList.add(g ? "good" : "bad"); });
      row.val = () => get().map(i => n1T(it.o[i])).join("·") || "-";
      row.key = () => get().join(",");
    } else if (it.t === "cmp") {
      const want = n1Cmp(it.l, it.r); let v = null;
      const signs = h("span", { class: "slot" });
      [">", "=", "<"].forEach(sg => signs.append(h("button", { class: "opt", style: "font-size:1.2em;min-width:2.2em;text-align:center", onclick: e => { [...signs.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); v = sg; } }, sg)));
      box.append(h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.5em;font-size:1.15em;margin-top:.3em;" + N1_WRAP },
        h("b", { class: "jua" }, n1T(it.ls || it.l)), signs, h("b", { class: "jua" }, n1T(it.rs || it.r))));
      row.ok = () => v === want;
      row.show = g => [...signs.children].forEach(b => { b.classList.remove("good", "bad"); if (b.classList.contains("on")) b.classList.add(g ? "good" : "bad"); });
      row.val = () => v || "-"; row.key = () => v || "";
      row.msg = () => v == null ? "○ 안에 >, =, < 중 하나를 골라요." : null;
    } else if (it.t === "read") {
      const inp = n1Inp("min(100%,22em)", "읽는 말", "text");
      box.append(h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em" }, h("span", {}, it.pre || "읽기: "), inp));
      row.ok = () => n1JudgeRead(inp.value, it.a).ok;
      row.msg = () => n1JudgeRead(inp.value, it.a).msg;
      row.show = g => inp.style.borderColor = g ? "var(--ok)" : "var(--no)";
      row.val = () => inp.value.trim() || "-"; row.key = () => inp.value.replace(/\s/g, "");
    } else if (it.t === "line") {
      const ins = [], line = h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.35em;font-size:1.12em;line-height:2;" + N1_WRAP });
      it.parts.forEach(p => {
        if (typeof p === "string") line.append(h("span", { class: "jua" }, p));
        else { const len = (p.show || n1S(p.a)).length; const inp = n1Inp(`${Math.max(4, Math.min(16, len + 1.5))}em`, "빈칸", p.show || it.kb ? "text" : "numeric"); ins.push({ inp, p }); line.append(inp); }
      });
      box.append(line);
      const good = x => { const v = n1Parse(x.inp.value, { digits: x.p.digits }); return v !== null && v === n1S(x.p.a); };
      row.ok = () => ins.every(good);
      row.show = () => ins.forEach(x => x.inp.style.borderColor = good(x) ? "var(--ok)" : "var(--no)");
      row.val = () => ins.map(x => x.inp.value.trim() || "-").join(", ");
      row.key = () => ins.map(x => n1Parse(x.inp.value) || "").join(",");
      row.msg = () => { const b = ins.find(x => !good(x)); if (!b) return null; if (!b.inp.value.trim()) return "빈칸을 모두 채워요."; if (n1Parse(b.inp.value) === null) return "수를 숫자로 써요. ‘30만’처럼 만·억·조를 섞어 써도 돼요."; const g = n1Parse(b.inp.value), w = n1S(b.p.a); if (g.replace(/0+$/, "") === w.replace(/0+$/, "")) return "숫자는 맞게 썼는데 0의 개수가 달라요. 일의 자리부터 네 자리씩 끊어 다시 세어 봐요."; return null; };
    } else {
      const s = it.show || n1S(it.a);
      const inp = n1Inp(`${Math.max(5, Math.min(17, s.length + 2))}em`, n1T(it.q || "답"), it.kb || (/[만억조]/.test(s) ? "text" : "numeric"));
      box.append(h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em" }, h("span", {}, it.pre || "답: "), inp, it.unit ? h("span", {}, it.unit) : null));
      const pv = () => n1Parse(inp.value, { digits: it.digits });
      row.ok = () => pv() === n1S(it.a);
      row.show = g => inp.style.borderColor = g ? "var(--ok)" : "var(--no)";
      row.val = () => inp.value.trim() || "-"; row.key = () => pv() || "";
      row.msg = () => {
        if (!inp.value.trim()) return "빈칸에 답을 써요.";
        if (pv() === null) {
          if (it.digits && n1Parse(inp.value) === n1S(it.a)) return "값은 맞아요! 이번에는 0을 모두 써서 숫자로만 나타내 봐요.";
          if (/[일이삼사오육칠팔구십백천]/.test(inp.value)) return "읽는 말이 아니라 숫자로 써요.";
          return "수를 숫자로 써요. 쉼표나 띄어쓰기는 써도 괜찮아요.";
        }
        if (pv().replace(/0+$/, "") === n1S(it.a).replace(/0+$/, "")) return "숫자는 맞게 썼는데 0의 개수가 달라요. 일의 자리부터 네 자리씩 끊어 다시 세어 봐요.";
        return null;
      };
    }
    rows.push(row); wrap.append(box);
  });
  api.provide && api.provide({
    words: opts.words || items.filter(it => it.t === "pick").map(ansOf),
    answers: items.map((it, qi) => `${items.length > 1 ? (qi + 1) + ") " : ""}${ansOf(it)}`)
  });
  body.append(wrap, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    let all = true; rows.forEach(r => { const g = r.ok(); r.show(g); if (!g) all = false; });
    const given = rows.map(r => r.val()).join(" / ");
    if (all) return api.done(given, opts.ok);
    const bad = rows.find(r => !r.ok());
    const why = bad.it.why && bad.it.why[bad.key()];
    api.fail(why || (bad.msg && bad.msg()) || opts.bad || "빨간 칸을 다시 살펴봐요. 자리를 하나씩 짚으며 차근차근 생각해 봐요.", given);
  } }, "확인하기")));
}

/* ---------- 자릿값 표 그림 (보기용·비교용) ----------
   o.cols: 칸 수, o.rows: [{label, v}], o.hl: 칠할 자리(지수) 배열, o.group: 칠할 마디(0 일, 1 만, 2 억, 3 조), o.full: 머리에 자리 이름을 모두 씀 */
function n1ChartSvg(o) {
  const cols = o.cols, CW = o.cw || 64, LW = o.rows.some(r => r.label) ? (o.lw || 150) : 0, X0 = 14 + LW, HH = 40, RH = o.rh || 66, GH = o.full ? 0 : 34;
  const W = X0 + cols * CW + 14, H = 10 + HH + RH * o.rows.length + GH + 10;
  const svg = makeSvg(W, H);
  const x = c => X0 + c * CW, ex = c => cols - 1 - c;
  for (let c = 0; c < cols; c++) {
    const g = Math.floor(ex(c) / 4);
    svg.append(svgEl("rect", { x: x(c), y: 10, width: CW, height: HH + RH * o.rows.length + GH, fill: o.group === g ? "#FFE7C2" : N1_SOFT[g % 4], stroke: "#B8C4C0", "stroke-width": 1.5 }));
    if (o.hl && o.hl.includes(ex(c))) svg.append(svgEl("rect", { x: x(c) + 3, y: 13, width: CW - 6, height: HH + RH * o.rows.length - 6, fill: "none", stroke: N1_RED, "stroke-width": 4, rx: 8 }));
    const p = ex(c) % 4;
    svg.append(txt(x(c) + CW / 2, 10 + HH / 2, o.full ? N1_PLACE[ex(c)] : (p === 0 ? "일" : N1_P[p]), o.full && N1_PLACE[ex(c)].length > 1 ? 17 : 20, { fill: "#4A5753" }));
  }
  svg.append(svgEl("line", { x1: X0, y1: 10 + HH, x2: X0 + cols * CW, y2: 10 + HH, stroke: "#8A9692", "stroke-width": 2 }));
  if (!o.full) {
    const gy = 10 + HH + RH * o.rows.length;
    svg.append(svgEl("line", { x1: X0, y1: gy, x2: X0 + cols * CW, y2: gy, stroke: "#8A9692", "stroke-width": 2 }));
    for (let g = 0; g * 4 < cols; g++) {
      const cR = cols - 1 - g * 4, cL = Math.max(0, cR - 3);
      svg.append(txt((x(cL) + x(cR) + CW) / 2, gy + GH / 2, g === 0 ? "일" : N1_U[g], 21, { fill: g === o.group ? "#B4610F" : "#2F6B57" }));
    }
  }
  for (let g = 1; g * 4 < cols; g++) { const c = cols - g * 4; svg.append(svgEl("line", { x1: x(c), y1: 10, x2: x(c), y2: H - 10, stroke: "#5B6764", "stroke-width": 3.5 })); }
  o.rows.forEach((r, ri) => {
    const y = 10 + HH + RH * ri;
    if (ri) svg.append(svgEl("line", { x1: X0, y1: y, x2: X0 + cols * CW, y2: y, stroke: "#B8C4C0", "stroke-width": 1.5 }));
    if (r.label) svg.append(txt(14 + LW / 2, y + RH / 2, r.label, r.label.length > 6 ? 17 : 21, { fill: r.color || INK }));
    if (r.v != null) { const s = n1S(r.v); for (let i = 0; i < s.length; i++) { const c = cols - s.length + i; if (c >= 0) svg.append(txt(x(c) + CW / 2, y + RH / 2 + 2, s[i], 32, { fill: r.color || INK })); } }
  });
  svg._x = x; svg._X0 = X0; svg._CW = CW; svg._top = 10; svg._H = H;
  return svg;
}
function n1ChartFig(v, cols, o = {}) { return () => h("div", { style: "max-width:" + (o.maxW || Math.min(100, cols * 7 + 10)) + "em;margin:.4em 0" }, n1Fit(n1ChartSvg(Object.assign({ cols, rows: [{ v }] }, o)), "34vh")); }

/* ---------- 자릿값 표에 숫자 카드 놓기 ----------
   opt.value 목표 수, opt.cols 칸 수, opt.say 무엇을 나타낼지, opt.group 배우는 마디 */
function n1Chart(body, api, opt) {
  const cols = opt.cols, target = n1S(opt.value), CW = 64, X0 = 20, HH = 40, RH = 78, full = cols <= 5, GH = full ? 0 : 34;
  const CARD = 60, CG = 8, nCard = 11, cardsW = nCard * CARD + (nCard - 1) * CG;
  const W = Math.max(cols * CW, cardsW) + 2 * X0, chartX = (W - cols * CW) / 2, cardY = 10 + HH + RH + GH + 44;
  const H = cardY + CARD + 14;
  const svg = makeSvg(W, H);
  const cells = Array(cols).fill(null);
  let selc = cols - target.length >= 0 ? cols - target.length : 0, locked = false;
  const x = c => chartX + c * CW, ex = c => cols - 1 - c;
  const gCells = svgEl("g"), gCards = svgEl("g"), gDrag = svgEl("g");
  for (let c = 0; c < cols; c++) {
    const g = Math.floor(ex(c) / 4), p = ex(c) % 4;
    svg.append(svgEl("rect", { x: x(c), y: 10, width: CW, height: HH + RH + GH, fill: opt.group === g ? "#FFE7C2" : N1_SOFT[g % 4], stroke: "#B8C4C0", "stroke-width": 1.5 }));
    svg.append(txt(x(c) + CW / 2, 10 + HH / 2, full ? N1_PLACE[ex(c)] : p === 0 ? "일" : N1_P[p], 20, { fill: "#4A5753" }));
  }
  const gy = 10 + HH + RH;
  svg.append(svgEl("line", { x1: x(0), y1: 10 + HH, x2: x(cols), y2: 10 + HH, stroke: "#8A9692", "stroke-width": 2 }));
  svg.append(svgEl("line", { x1: x(0), y1: gy, x2: x(cols), y2: gy, stroke: "#8A9692", "stroke-width": 2 }));
  if (!full) for (let g = 0; g * 4 < cols; g++) { const cR = cols - 1 - g * 4, cL = Math.max(0, cR - 3); svg.append(txt((x(cL) + x(cR) + CW) / 2, gy + GH / 2, g === 0 ? "일" : N1_U[g], 21, { fill: g === opt.group ? "#B4610F" : "#2F6B57" })); }
  for (let g = 1; g * 4 < cols; g++) { const c = cols - g * 4; svg.append(svgEl("line", { x1: x(c), y1: 10, x2: x(c), y2: gy + GH, stroke: "#5B6764", "stroke-width": 3.5 })); }
  svg.append(gCells, gCards, gDrag);
  const cardX = i => (W - cardsW) / 2 + i * (CARD + CG);
  const cardLab = i => i < 10 ? String(i) : "⌫";
  function drawCells(bad) {
    gCells.innerHTML = "";
    for (let c = 0; c < cols; c++) {
      const isSel = c === selc && !locked, isBad = bad && bad.includes(c);
      gCells.append(svgEl("rect", { x: x(c) + 6, y: 10 + HH + 8, width: CW - 12, height: RH - 16, rx: 9, fill: cells[c] == null ? "#fff" : "#FFFDF7", stroke: isBad ? N1_RED : isSel ? N1_BLUE : "#C9D3CF", "stroke-width": isBad || isSel ? 4 : 2, "stroke-dasharray": cells[c] == null && !isSel ? "6 5" : "none" }));
      if (cells[c] != null) gCells.append(txt(x(c) + CW / 2, 10 + HH + RH / 2 + 2, String(cells[c]), 38, { fill: isBad ? N1_RED : INK }));
    }
  }
  for (let i = 0; i < nCard; i++) {
    gCards.append(svgEl("rect", { x: cardX(i), y: cardY, width: CARD, height: CARD, rx: 10, fill: i < 10 ? "#FFF4DD" : "#EEF1F0", stroke: "#D9A44E", "stroke-width": 2.5 }));
    gCards.append(txt(cardX(i) + CARD / 2, cardY + CARD / 2 + 2, cardLab(i), i < 10 ? 32 : 26, { fill: i < 10 ? "#8A4B0F" : "#5B6764" }));
  }
  svg.append(txt(W / 2, cardY - 14, "숫자 카드를 칸으로 끌어 놓거나, 칸을 누른 뒤 카드를 눌러요.", 17, { fill: "#6B7773" }));
  const out = h("div", { class: "readout", style: "font-size:1.05em;" + N1_WRAP });
  const info = h("div", { style: "margin-top:.3em;" + N1_WRAP });
  function put(c, d) {
    if (locked || c == null || c < 0 || c >= cols) return;
    cells[c] = d === 10 ? null : d;
    if (d !== 10 && c < cols - 1) selc = c + 1; else selc = c;
    drawCells(); show();
  }
  function show() {
    const s = cells.map(v => v == null ? "" : v).join("");
    out.innerHTML = s ? `표의 수: <b>${n1Esc(s)}</b>` : "표가 비어 있어요.";
  }
  const hitCell = p => { if (p.y < 10 + HH || p.y > gy) return null; const c = Math.floor((p.x - chartX) / CW); return c >= 0 && c < cols ? c : null; };
  const hitCard = p => { if (p.y < cardY || p.y > cardY + CARD) return null; for (let i = 0; i < nCard; i++) if (p.x >= cardX(i) && p.x <= cardX(i) + CARD) return i; return null; };
  let drag = null;
  dragOn(svg, p => {
    if (locked) return false;
    const k = hitCard(p);
    if (k != null) { drag = { k, p0: p, moved: false }; return true; }
    const c = hitCell(p); if (c != null) { selc = c; drawCells(); }
    return false;
  }, p => {
    if (!drag) return;
    if (!drag.moved && dist(p, drag.p0) > 6) drag.moved = true;
    gDrag.innerHTML = "";
    if (drag.moved) { gDrag.append(svgEl("rect", { x: p.x - CARD / 2, y: p.y - CARD / 2, width: CARD, height: CARD, rx: 10, fill: "#FFE2A8", stroke: "#B4610F", "stroke-width": 3, opacity: .92 })); gDrag.append(txt(p.x, p.y + 2, cardLab(drag.k), 32, { fill: "#8A4B0F" })); }
  }, p => {
    if (!drag) return; gDrag.innerHTML = "";
    if (drag.moved) { const c = hitCell(p); if (c != null) put(c, drag.k); }
    else put(selc, drag.k);
    drag = null;
  });
  const wrap = h("div", { tabindex: "0", style: "outline:none" }, n1Fit(svg, "56vh"));
  wrap.addEventListener("keydown", e => {
    if (/^[0-9]$/.test(e.key)) { put(selc, +e.key); e.preventDefault(); }
    else if (e.key === "Backspace" || e.key === "Delete") { put(selc, 10); if (e.key === "Backspace" && selc > 0) { selc--; drawCells(); } e.preventDefault(); }
    else if (e.key === "ArrowLeft" && selc > 0) { selc--; drawCells(); } else if (e.key === "ArrowRight" && selc < cols - 1) { selc++; drawCells(); }
  });
  drawCells(); show();
  api.provide({ words: opt.words || ["일의 자리부터 네 자리씩", "천, 백, 십, 일", "0인 자리에도 0을 써요"], answers: [target] });
  body.append(opt.say ? n1H("p", { class: "jua", style: "font-size:1.15em;" + N1_WRAP }, opt.say) : "", wrap, out, info,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      const first = cells.findIndex(v => v != null);
      const s = cells.map(v => v == null ? "_" : v).join("").replace(/^_+/, "");
      if (first < 0) return api.fail("숫자 카드를 표에 놓아 봐요.", "-");
      if (s.includes("_")) { drawCells(cells.map((v, c) => c > first && v == null ? c : -1).filter(c => c >= 0)); return api.fail("수의 중간에 빈칸이 있어요. 숫자가 0인 자리에는 0 카드를 놓아요.", s); }
      if (cells[first] === 0) { drawCells([first]); return api.fail("가장 높은 자리에는 0을 놓지 않아요.", s); }
      const tp = target.padStart(cols, "_"), bad = [];
      for (let c = 0; c < cols; c++) { const v = cells[c] == null ? "_" : String(cells[c]); if (v !== tp[c]) bad.push(c); }
      if (!bad.length) {
        locked = true; drawCells();
        info.innerHTML = n1Parts(target).map(pt => `<div>${pt[0]} → ${n1Place(pt.length - 1)} → <b>${pt}</b></div>`).join("")
          + `<div style="margin-top:.3em">${target} = ${n1Parts(target).join(" + ")}</div>` + (opt.note ? `<div style="margin-top:.3em;color:#B4610F">${n1R(opt.note)}</div>` : "");
        return api.done(s, opt.ok || "자릿값 표에 바르게 나타냈어요. 각 자리 숫자가 나타내는 값을 살펴봐요.");
      }
      drawCells(bad);
      const lenNow = s.length;
      if (lenNow !== target.length) return api.fail(`지금 수는 ${lenNow}자리예요. ${target.length}자리 수가 되도록 일의 자리부터 맞추어 놓아 봐요.`, s);
      api.fail(`${n1Place(ex(bad[0]))} 숫자를 다시 봐요. 일의 자리부터 네 자리씩 끊어 살펴봐요.`, s);
    } }, "확인하기"), h("button", { class: "ghost", onclick: () => { if (locked) return; cells.fill(null); selc = Math.max(0, cols - target.length); info.innerHTML = ""; drawCells(); show(); } }, "모두 지우기")));
}

/* ---------- 돈 모형 (지폐·동전·묶음) ----------
   opt.denoms 큰 것부터, opt.targets [{v, need:{액면:개수}, say}], opt.bundle 10개 묶기, opt.addable + 단추가 있는 액면, opt.steps {액면:[1,10,100]}, opt.fewest 가장 적은 개수로 */
const N1_MONEY = {
  1: { k: "coin", t: "1", c: "#D8B26A" }, 10: { k: "coin", t: "10", c: "#E3A35F" }, 100: { k: "coin", t: "100", c: "#C9CDD0" }, 500: { k: "coin", t: "500", c: "#D4D7DA" },
  1000: { k: "bill", t: "1000", c: "#A9CFE8" }, 10000: { k: "bill", t: "10000", c: "#BFE1B0" },
  100000: { k: "bundle", t: "10만", c: "#BFE1B0" }, 1000000: { k: "box", t: "100만", c: "#F3D9A4" }, 10000000: { k: "box", t: "1000만", c: "#F2B9A0" }
};
function n1MoneyName(d) { return { 1: "1원짜리 동전", 10: "10원짜리 동전", 100: "100원짜리 동전", 500: "500원짜리 동전", 1000: "1000원짜리 지폐", 10000: "10000원짜리 지폐", 100000: "10만 원 묶음", 1000000: "100만 원 묶음", 10000000: "1000만 원 묶음" }[d]; }
function n1MoneyUnit(d) { return N1_MONEY[d].k === "coin" ? "개" : N1_MONEY[d].k === "bill" ? "장" : "묶음"; }
function n1Money(body, api, opt) {
  const D = opt.denoms, cnt = {}; D.forEach(d => cnt[d] = 0);
  let ti = 0, fin = false;
  const CW = 180, W = D.length * CW + 20, H = 250;
  const svg = makeSvg(W, H);
  const say = h("p", { class: "jua", style: "font-size:1.15em" });
  const out = h("div", { class: "readout", style: N1_WRAP });
  const tbl = h("div", { style: "font-size:1.02em;" + N1_WRAP });
  const total = () => D.reduce((t, d) => t + BigInt(d) * BigInt(cnt[d]), 0n);
  function icon(g, d, x, y) {
    const m = N1_MONEY[d];
    if (m.k === "coin") { g.append(svgEl("circle", { cx: x, cy: y, r: 30, fill: m.c, stroke: "#8C7A55", "stroke-width": 2 })); g.append(txt(x, y + 1, m.t, d >= 100 ? 17 : 20, { fill: "#4B3B1C" })); }
    else if (m.k === "bill") { g.append(svgEl("rect", { x: x - 62, y: y - 28, width: 124, height: 56, rx: 6, fill: m.c, stroke: "#5D7F63", "stroke-width": 2 })); g.append(txt(x, y + 1, m.t + "원", 20, { fill: "#24452C" })); }
    else if (m.k === "bundle") { for (let k = 2; k >= 0; k--) g.append(svgEl("rect", { x: x - 62 + k * 3, y: y - 30 + k * 3, width: 124, height: 56, rx: 6, fill: m.c, stroke: "#5D7F63", "stroke-width": 2 })); g.append(svgEl("rect", { x: x - 10, y: y - 30, width: 20, height: 62, fill: "#F6E7B0", stroke: "#B49A45" })); g.append(txt(x, y + 1, m.t, 20, { fill: "#24452C", "font-weight": 700 })); }
    else { g.append(svgEl("rect", { x: x - 58, y: y - 32, width: 116, height: 64, rx: 6, fill: m.c, stroke: "#8C6A3A", "stroke-width": 2.5 })); g.append(svgEl("line", { x1: x - 58, y1: y - 14, x2: x + 58, y2: y - 14, stroke: "#8C6A3A", "stroke-width": 2 })); g.append(txt(x, y + 8, m.t + " 원", 19, { fill: "#4B3418", "font-weight": 700 })); }
  }
  function draw() {
    svg.innerHTML = "";
    D.forEach((d, i) => {
      const cx = 10 + i * CW + CW / 2, n = cnt[d], g = svgEl("g");
      svg.append(svgEl("rect", { x: 10 + i * CW + 6, y: 8, width: CW - 12, height: H - 16, rx: 12, fill: "#FBFCFB", stroke: "#DCE4E0", "stroke-width": 2 }));
      const show = Math.min(n, 10);
      for (let k = 0; k < show; k++) icon(g, d, cx - 4 + (k % 2) * 8, 52 + k * 13);
      svg.append(g);
      svg.append(txt(cx, H - 30, n ? `${n}${n1MoneyUnit(d)}` : "없음", 22, { fill: n ? INK : "#9AA5A1" }));
    });
    const tt = total();
    out.innerHTML = `모두 <b>${tt.toString()}원</b>` + (tt > 0n ? ` <small>(${n1Read(tt)} 원)</small>` : "");
    tbl.innerHTML = D.filter(d => cnt[d]).map(d => `${n1MoneyName(d)} ${cnt[d]}${n1MoneyUnit(d)} → ${(BigInt(d) * BigInt(cnt[d])).toString()}원`).join("<br>");
    tools.forEach(t => t.upd());
  }
  const steps = opt.steps || {};
  const tools = D.map((d, i) => {
    const row = h("div", { class: "tools" }, h("span", { style: "min-width:8.5em" }, n1MoneyName(d)));
    const can = !opt.addable || opt.addable.includes(d);
    if (can) (steps[d] || [1]).forEach(s => row.append(h("button", { onclick: () => { if (fin) return; cnt[d] += s; draw(); } }, `+${s}`)));
    if (can) row.append(h("button", { onclick: () => { if (fin) return; cnt[d] = Math.max(0, cnt[d] - 1); draw(); } }, "−1"));
    const up = i > 0 && D[i - 1] === d * 10 ? D[i - 1] : null;
    const bb = up && opt.bundle ? h("button", { style: "font-weight:700", onclick: () => { if (fin || cnt[d] < 10) return; cnt[d] -= 10; cnt[up] += 1; draw(); } }, `10${n1MoneyUnit(d) === "묶음" ? "개" : n1MoneyUnit(d)} 묶기 → ${N1_MONEY[up].t}${/만$/.test(N1_MONEY[up].t) ? " 원" : "원"}`) : null;
    if (bb) row.append(bb);
    row.upd = () => { if (bb) bb.disabled = cnt[d] < 10; };
    return row;
  });
  function setT() { const t = opt.targets[ti]; say.innerHTML = n1R(t.say || `${t.v}원을 만들어 보세요.`); }
  setT(); draw();
  api.provide({ words: opt.words || ["1000이 10개", "10000", "만"], answers: [] });
  body.append(say, h("div", { class: "panel" }, h("div", { class: "stage" }, n1Fit(svg, "42vh")), h("div", { class: "side" }, out, tbl, ...tools,
    h("button", { class: "big", onclick: () => {
      if (fin) return;
      api.tryOnce();
      const t = opt.targets[ti], tt = total(), v = BigInt(n1S(t.v)), ans = `${tt}원 (` + D.filter(d => cnt[d]).map(d => `${d}원×${cnt[d]}`).join(", ") + ")";
      if (tt < v) return api.fail(`지금 ${tt}원이에요. ${(v - tt).toString()}원이 더 있어야 해요.`, ans);
      if (tt > v) return api.fail(`지금 ${tt}원이에요. ${(tt - v).toString()}원이 넘었어요. −1 단추로 줄여 봐요.`, ans);
      let need = t.need;
      if (opt.fewest) { need = {}; let r = v; D.forEach(d => { need[d] = Number(r / BigInt(d)); r %= BigInt(d); }); }
      if (need) {
        const wrong = D.find(d => (need[d] || 0) !== cnt[d]);
        if (wrong != null) return api.fail(t.needMsg || (opt.fewest ? `모두 ${tt}원이 맞아요! 이번에는 큰 돈부터 써서 지폐와 동전의 수가 가장 적게 만들어 봐요.` : `${n1J(n1MoneyName(wrong), "을/를")} ${need[wrong] || 0}${n1MoneyUnit(wrong)} 써서 만들어요.`), ans);
      }
      if (ti < opt.targets.length - 1) {
        ti++; if (opt.resetEach) D.forEach(d => cnt[d] = 0); setT(); draw();
        return api.hint("○ " + (t.ok || "맞아요!") + " 이어서 다음 것도 해 봐요.");
      }
      fin = true; api.done(ans, t.ok || opt.ok);
    } }, "확인하기"))));
}

/* ---------- 수직선 확대하기 (10000은 얼마만큼의 수) ---------- */
function n1Zoom(body, api, opt) {
  const L = opt.levels; let lv = 0, solved = false, fin = false;
  const W = 900, H = 190, svg = makeSvg(W, H);
  const q = h("div", { class: "jua", style: "font-size:1.15em;display:flex;flex-wrap:wrap;align-items:center;gap:.4em" });
  const inp = n1Inp("6em", "얼마만큼 더 큰 수");
  const tip = h("p", { class: "inst" });
  function draw() {
    svg.innerHTML = "";
    const { from, step } = L[lv], xs = k => 70 + k * 190;
    svg.append(svgEl("line", { x1: 30, y1: 100, x2: 870, y2: 100, stroke: INK, "stroke-width": 3 }));
    if (solved && lv < L.length - 1) {
      const seg = svgEl("rect", { x: xs(3), y: 62, width: 190, height: 76, rx: 10, fill: "#FFE7C2", stroke: "#B4610F", "stroke-width": 3, "stroke-dasharray": "8 6", style: "cursor:pointer" });
      seg.addEventListener("click", () => { lv++; solved = false; inp.value = ""; inp.style.borderColor = ""; draw(); });
      svg.append(seg, txt(xs(3) + 95, 50, "여기를 눌러 크게 보기 🔍", 18, { fill: "#B4610F" }));
    }
    for (let k = 0; k <= 4; k++) {
      const v = from + k * step;
      svg.append(svgEl("line", { x1: xs(k), y1: 84, x2: xs(k), y2: 116, stroke: INK, "stroke-width": 3 }));
      svg.append(txt(xs(k), 146, String(v), 26, { fill: v === 10000 ? N1_RED : INK }));
      if (k < 4) { svg.append(svgEl("path", { d: `M ${xs(k) + 8} 80 Q ${xs(k) + 95} 30 ${xs(k + 1) - 8} 80`, fill: "none", stroke: N1_BLUE, "stroke-width": 2.5 })); if (!(solved && k === 3 && lv < L.length - 1)) svg.append(txt(xs(k) + 95, 40, `+${step}`, 19, { fill: N1_BLUE })); }
    }
    svg.append(txt(450, 178, `${step}씩 커지는 수직선`, 17, { fill: "#6B7773" }));
    q.innerHTML = ""; q.append(`10000은 ${10000 - step}보다`, inp, "만큼 더 큰 수예요.");
    tip.textContent = solved ? (lv < L.length - 1 ? `맞아요! 이제 ${n1J(String(10000 - step), "과/와")} 10000 사이(주황 칸)를 눌러 더 크게 봐요.` : "") : "수직선의 눈금 한 칸이 얼마인지 보고 빈칸을 채워요.";
  }
  draw();
  api.provide({ words: ["1000", "100", "10", "1"], answers: ["1000, 100, 10, 1"] });
  body.append(n1Fit(svg, "36vh"), q, tip, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (fin) return; api.tryOnce();
    const st = L[lv].step, v = n1Parse(inp.value);
    if (v !== String(st)) { inp.style.borderColor = "var(--no)"; return api.fail(v === String(10000 - st) ? `${n1J(String(10000 - st), "은/는")} 바로 앞 눈금의 수예요. 두 눈금 사이가 얼마인지 생각해요.` : "10000 바로 앞 눈금에서 10000까지 한 칸이 얼마인지 봐요.", inp.value); }
    inp.style.borderColor = "var(--ok)";
    if (lv === L.length - 1) { fin = true; return api.done("1000, 100, 10, 1", opt.ok); }
    solved = true; draw(); api.hint("○ 맞아요! 주황 칸을 눌러 수직선을 크게 봐요.");
  } }, "확인하기")));
}

/* ---------- 10배씩 (10개 모으기) ---------- */
function n1Times(body, api, opt) {
  let vals = [n1S(opt.start)];
  const W = 980, svg = makeSvg(W, 170);
  const chartBox = h("div", { style: "max-width:60em" });
  const btn = h("button", { class: "big", style: "background:#2F6B57;box-shadow:0 4px 0 #1E4A3B" }, "10개 모으기 ×10");
  function draw() {
    svg.innerHTML = "";
    const n = opt.times + 1, bw = 150, gap = (W - 20 - n * bw) / (n - 1);
    for (let i = 0; i < n; i++) {
      const xx = 10 + i * (bw + gap), v = vals[i];
      svg.append(svgEl("rect", { x: xx, y: 40, width: bw, height: 76, rx: 12, fill: v ? (i === vals.length - 1 ? "#FFE7C2" : "#fff") : "#F2F5F4", stroke: v ? "#B4610F" : "#C9D3CF", "stroke-width": 2.5, "stroke-dasharray": v ? "none" : "7 5" }));
      svg.append(txt(xx + bw / 2, 66, v ? n1Mix(v) : "?", 26, { fill: v ? INK : "#9AA5A1" }));
      if (v) svg.append(txt(xx + bw / 2, 98, `(${n1S(v).length}자리)`, 16, { fill: "#6B7773" }));
      if (i < n - 1) { const ax = xx + bw + 4, bx = xx + bw + gap - 4; svg.append(svgEl("line", { x1: ax, y1: 78, x2: bx - 6, y2: 78, stroke: vals[i + 1] ? N1_BLUE : "#C9D3CF", "stroke-width": 3 })); svg.append(svgEl("path", { d: `M ${bx} 78 l -10 -7 v 14 z`, fill: vals[i + 1] ? N1_BLUE : "#C9D3CF" })); svg.append(txt((ax + bx) / 2, 150, "10개", 17, { fill: vals[i + 1] ? N1_BLUE : "#9AA5A1" })); }
    }
    chartBox.innerHTML = ""; chartBox.append(n1Fit(n1ChartSvg({ cols: opt.cols, rows: [{ v: vals[vals.length - 1] }], group: opt.group }), "30vh"));
    btn.disabled = vals.length > opt.times;
  }
  btn.onclick = () => { if (vals.length > opt.times) return; vals.push((BigInt(vals[vals.length - 1]) * 10n).toString()); draw(); };
  draw();
  body.append(n1Fit(svg, "26vh"), h("div", { class: "tools", style: "margin:.4em 0" }, btn, h("button", { class: "ghost", onclick: () => { vals = [n1S(opt.start)]; draw(); } }, "처음으로")), chartBox);
  n1Ask(body, Object.assign({}, api, { done: (a, m) => { if (vals.length <= opt.times) return api.fail("먼저 ‘10개 모으기’를 눌러 끝까지 모아 봐요.", a); api.done(a, m); } }), opt.ask, { ok: opt.ok });
}

/* ---------- 뛰어 세기 (수직선 위에서 뛰기) ----------
   opt.tasks [{start, step, n, say, unit}] 정해진 만큼, opt.free {start, n, choices} 내가 정해서 */
function n1Hop(body, api, opt) {
  const tasks = opt.tasks || [Object.assign({ free: true }, opt.free)];
  let ti = 0, seq, pick = null, fin = false;
  const W = 960, H = 200, svg = makeSvg(W, H);
  const say = h("p", { class: "jua", style: "font-size:1.15em" });
  const chips = h("div", { class: "opts" });
  const readout = h("div", { class: "readout", style: "font-size:1.05em;" + N1_WRAP });
  const after = h("div");
  const hopBtn = h("button", { class: "big", style: "background:#2B7BD6;box-shadow:0 4px 0 #1B5AA3" }, "한 번 뛰기 ↷");
  const fmt = v => opt.digits ? n1S(v) : n1Mix(v);
  function setT() {
    const t = tasks[ti]; seq = [n1S(t.start)]; pick = null;
    say.innerHTML = n1R(t.say || `${fmt(t.start)}부터 뛰어 세어 보세요.`);
    chips.innerHTML = "";
    (t.choices || opt.choices).forEach(c => chips.append(h("button", { class: "opt", onclick: e => { if (seq.length > 1 && !t.free) return; if (seq.length > 1) return api.hint("이미 뛰기 시작했어요. 바꾸려면 ‘다시’를 눌러요."); [...chips.children].forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); pick = n1S(c); } }, `${fmt(c)}씩`)));
    draw();
  }
  function draw() {
    const t = tasks[ti], n = t.n; svg.innerHTML = "";
    const xs = k => 70 + k * (820 / n);
    svg.append(svgEl("line", { x1: 30, y1: 130, x2: 930, y2: 130, stroke: INK, "stroke-width": 3 }));
    svg.append(svgEl("path", { d: "M 930 130 l -12 -8 v 16 z", fill: INK }));
    for (let k = 0; k <= n; k++) {
      const v = seq[k];
      svg.append(svgEl("line", { x1: xs(k), y1: 116, x2: xs(k), y2: 144, stroke: INK, "stroke-width": 3 }));
      svg.append(v ? txt(xs(k), 172, fmt(v), opt.digits ? 19 : 24, { fill: k === seq.length - 1 ? "#B4610F" : INK }) : txt(xs(k), 172, "?", 24, { fill: "#9AA5A1" }));
      if (k < n && seq[k + 1]) {
        svg.append(svgEl("path", { d: `M ${xs(k) + 6} 112 Q ${(xs(k) + xs(k + 1)) / 2} 40 ${xs(k + 1) - 6} 112`, fill: "none", stroke: N1_BLUE, "stroke-width": 3 }));
        svg.append(txt((xs(k) + xs(k + 1)) / 2, 52, "+" + fmt(BigInt(seq[k + 1]) - BigInt(seq[k])), 20, { fill: N1_BLUE }));
      }
    }
    svg.append(svgEl("circle", { cx: xs(seq.length - 1), cy: 100, r: 13, fill: "#F2C14E", stroke: "#B4610F", "stroke-width": 3 }));
    readout.innerHTML = seq.map((v, i) => i ? n1Diff(seq[i - 1], v) : n1S(v)).join(" → ") + (seq.length > 1 ? `<br><small>빨간 숫자: 바뀐 자리</small>` : "");
    hopBtn.disabled = seq.length > n || fin;
  }
  hopBtn.onclick = () => {
    const t = tasks[ti]; if (seq.length > t.n || fin) return;
    if (!pick) return api.hint("먼저 얼마씩 뛸지 골라요.");
    if (!t.free && pick !== n1S(t.step)) { api.tryOnce(); return api.fail(t.why || `문제를 다시 읽어 봐요. ${fmt(t.step)}씩 뛰어 세어야 해요.`, `${fmt(pick)}씩`); }
    seq.push((BigInt(seq[seq.length - 1]) + BigInt(pick)).toString()); draw();
    if (seq.length > t.n) {
      if (ti < tasks.length - 1) { api.hint(`○ ${t.ok || "잘 뛰어 세었어요!"} 다음 것도 해 봐요.`); setTimeout(() => { ti++; setT(); }, 900); }
      else if (t.free) ask();
      else { fin = true; api.done(seq.map(fmt).join(", "), t.ok || opt.ok); }
    }
  };
  function ask() {
    after.innerHTML = "";
    const e = n1S(pick).length - 1;
    const names = opt.free.places || [7, 8, 9, 10, 11];
    after.append(h("p", { class: "jua" }, `${fmt(pick)}씩 뛰어 세었더니 어느 자리 숫자가 커졌나요?`));
    n1Ask(after, Object.assign({}, api, { done: (a, m) => { fin = true; api.done(`${fmt(pick)}씩: ${seq.map(fmt).join(", ")} / ${a}`, m); } }),
      [{ t: "pick", o: names.map(k => n1Place(k)), a: names.indexOf(e) }], { ok: `맞아요! ${fmt(pick)}씩 뛰어 세면 ${n1Place(e)} 숫자가 ${n1S(pick)[0]}씩 커져요. ${opt.friend || ""}` });
  }
  setT();
  api.provide({ words: opt.words || ["어느 자리 숫자가 변하는지", "얼마씩"], answers: [] });
  body.append(say, chips, n1Fit(svg, "34vh"), h("div", { class: "tools", style: "margin:.4em 0" }, hopBtn, h("button", { class: "ghost", onclick: () => { if (fin) return; after.innerHTML = ""; setT(); } }, "다시")), readout, after);
}
/* 뛰어 세기 그림(보기용): vals 수 목록, step 글('?') */
function n1HopFig(vals, step, o = {}) {
  return () => {
    const n = vals.length - 1, W = 960, svg = makeSvg(W, 170), xs = k => 80 + k * (800 / n);
    svg.append(svgEl("line", { x1: 30, y1: 110, x2: 930, y2: 110, stroke: INK, "stroke-width": 3 }));
    vals.forEach((v, k) => {
      svg.append(svgEl("line", { x1: xs(k), y1: 96, x2: xs(k), y2: 124, stroke: INK, "stroke-width": 3 }));
      svg.append(txt(xs(k), 150, v, o.fs || 22));
      if (k < n) { svg.append(svgEl("path", { d: `M ${xs(k) + 6} 92 Q ${(xs(k) + xs(k + 1)) / 2} 26 ${xs(k + 1) - 6} 92`, fill: "none", stroke: N1_BLUE, "stroke-width": 3 })); svg.append(txt((xs(k) + xs(k + 1)) / 2, 38, step, 20, { fill: N1_BLUE })); }
    });
    return h("div", { style: "max-width:46em" }, n1Fit(svg, "24vh"));
  };
}

/* ---------- 두 수 비교 (자릿값 표에서 비교하는 자리 누르기 → 부등호) ----------
   opt.pairs [{a, b, la, lb, unit}] */
function n1Compare(body, api, opt) {
  let pi = 0, col = null, sign = null, fin = false;
  const stage = h("div", { style: "max-width:66em" }), q = h("p", { class: "jua", style: "font-size:1.12em;" + N1_WRAP });
  const step1 = h("p", { class: "inst" }, "① 두 수의 크기가 정해지는 자리(세로 칸)를 표에서 눌러요.");
  const signs = h("span", { class: "slot" });
  const line = h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.5em;font-size:1.15em;" + N1_WRAP });
  const res = h("div", { class: "readout", style: "font-size:1.02em;" + N1_WRAP });
  const P = () => opt.pairs[pi];
  const decide = () => { const a = n1S(P().a), b = n1S(P().b); if (a.length !== b.length) return Math.max(a.length, b.length) - 1; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a.length - 1 - i; return -1; };
  function draw() {
    const p = P(), a = n1S(p.a), b = n1S(p.b), cols = opt.cols || Math.max(a.length, b.length);
    const svg = n1ChartSvg({ cols, full: true, rows: [{ label: p.la, v: a, color: "#1E5FA8" }, { label: p.lb, v: b, color: "#A8321E" }], hl: col == null ? [] : [col], lw: 150, rh: 60 });
    svg.style.cursor = "pointer";
    svg.addEventListener("click", ev => { if (fin) return; const pt = svgPt(svg, ev); const c = Math.floor((pt.x - svg._X0) / svg._CW); if (c >= 0 && c < cols) { col = cols - 1 - c; draw(); } });
    stage.innerHTML = ""; stage.append(n1Fit(svg, "40vh"));
    q.innerHTML = n1R(p.say || `${p.la}: **${a}**${p.unit || ""}, ${p.lb}: **${b}**${p.unit || ""}`);
    line.innerHTML = ""; signs.innerHTML = "";
    [">", "=", "<"].forEach(sg => signs.append(h("button", { class: "opt" + (sign === sg ? " on" : ""), style: "font-size:1.2em;min-width:2.2em;text-align:center", onclick: () => { sign = sg; draw(); } }, sg)));
    line.append(h("span", {}, "② "), h("b", { class: "jua", style: "color:#1E5FA8" }, a), signs, h("b", { class: "jua", style: "color:#A8321E" }, b));
    res.innerHTML = `${p.la}: ${a.length}자리 수 · ${p.lb}: ${b.length}자리 수` + (col != null ? `<br>고른 자리: <b>${n1Place(col)}</b>` : "");
  }
  draw();
  api.provide({ words: ["자리 수가 많은 쪽이 더 큰 수", "높은 자리 수부터 차례대로"], answers: opt.pairs.map(p => `${n1S(p.a)} ${n1Cmp(p.a, p.b)} ${n1S(p.b)}`) });
  body.append(q, stage, step1, res, line, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (fin) return; api.tryOnce();
    const p = P(), a = n1S(p.a), b = n1S(p.b), d = decide(), want = n1Cmp(a, b), ans = `${n1Place(col == null ? 0 : col)} / ${a} ${sign || "?"} ${b}`;
    if (col == null) return api.fail("먼저 두 수의 크기가 정해지는 자리를 표에서 눌러요.", ans);
    if (col !== d) {
      if (a.length !== b.length) return api.fail(`두 수의 자리 수가 달라요(${a.length}자리, ${b.length}자리). 자리 수가 많은 수의 맨 앞 자리, ${n1Place(d)}를 눌러 봐요.`, ans);
      if (col > d) return api.fail(col >= a.length ? `두 수 모두 ${n1Place(col)}에는 숫자가 없어요. 두 수의 가장 높은 자리부터 비교해요.` : `${n1Place(col)} 숫자는 두 수가 같아요. 같으면 바로 다음 자리로 내려가 비교해요.`, ans);
      return api.fail("그보다 높은 자리에서 이미 숫자가 달라요. 가장 높은 자리부터 차례대로 비교해요.", ans);
    }
    if (!sign) return api.fail("이제 ○ 안에 들어갈 >, =, < 중 하나를 골라요.", ans);
    if (sign !== want) return api.fail(a.length !== b.length ? "자리 수가 많은 쪽이 더 큰 수예요. 입이 벌어진 쪽이 큰 수를 향해요." : `${n1Place(d)} 숫자를 비교해요. ${n1J(a[a.length - 1 - d], "과/와")} ${b[b.length - 1 - d]} 중 어느 것이 더 큰가요?`, ans);
    if (pi < opt.pairs.length - 1) { pi++; col = null; sign = null; draw(); return api.hint("○ " + (p.ok || "맞아요!") + " 다음 두 수도 비교해 봐요."); }
    fin = true; api.done(ans, p.ok || opt.ok);
  } }, "확인하기")));
}

/* ---------- 차례대로 늘어놓기 ----------
   opt.items [{name, show, v}], opt.dir "desc"(큰 것부터)|"asc", opt.k 몇 개를 고를지(없으면 모두), opt.unit */
function n1Rank(body, api, opt) {
  const items = opt.items, k = opt.k || items.length; let picked = [], conv = false, fin = false;
  const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(13em,1fr));gap:.6em;margin:.5em 0" });
  const show = h("div", { class: "readout", style: "font-size:1.05em;" + N1_WRAP });
  function draw() {
    grid.innerHTML = "";
    items.forEach((it, i) => {
      const pos = picked.indexOf(i);
      const b = h("button", { class: "opt" + (pos >= 0 ? " on" : ""), style: "text-align:left;padding:.6em .8em;" + N1_WRAP, onclick: () => {
        if (fin) return; const j = picked.indexOf(i);
        if (j >= 0) picked.splice(j, 1); else if (picked.length < k) picked.push(i); else return api.hint(`${k}개를 모두 골랐어요. 바꾸려면 고른 카드를 다시 눌러요.`);
        draw();
      } });
      b.append(h("div", { class: "jua", style: "font-size:1.1em" }, (pos >= 0 ? `${pos + 1}. ` : "") + it.name), h("div", {}, it.show));
      if (conv) b.append(h("div", { style: "color:#2F6B57;font-size:.95em;margin-top:.2em" }, `= ${n1Mix(it.v)} = ${n1S(it.v)}`));
      grid.append(b);
    });
    show.textContent = "고른 차례: " + (picked.map(i => items[i].name).join(" → ") || "아직 없음");
  }
  draw();
  const order = items.map((_, i) => i).sort((x, y) => { const c = n1Cmp(items[x].v, items[y].v); return opt.dir === "asc" ? (c === "<" ? -1 : 1) : (c === ">" ? -1 : 1); });
  api.provide({ words: ["같은 형태로 바꾸어", "자리 수", "높은 자리부터"], answers: k === items.length ? [order.map(i => items[i].name).join(", ")] : [] });
  const tools = h("div", { class: "tools" }, h("button", { class: "ghost", onclick: () => { if (fin) return; picked = []; draw(); } }, "다시"));
  if (opt.convert) tools.prepend(h("button", { onclick: () => { conv = !conv; draw(); } }, "🔁 수의 형태를 같게 보기"));
  body.append(grid, tools, show, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (fin) return; api.tryOnce();
    const ans = picked.map(i => items[i].name).join(", ");
    if (picked.length < k) return api.fail(`${k}개를 차례대로 눌러요. 지금 ${picked.length}개를 골랐어요.`, ans);
    for (let j = 1; j < picked.length; j++) {
      const A = items[picked[j - 1]], B = items[picked[j]], c = n1Cmp(A.v, B.v);
      if (opt.dir === "asc" ? c !== "<" : c !== ">") return api.fail(`${n1J(A.name, "과/와")} ${B.name}의 차례를 다시 봐요. 두 수를 같은 형태로 바꾸어 자리 수부터 비교해요.`, ans);
    }
    fin = true; api.done(ans, opt.ok);
  } }, "확인하기")));
}

/* ---------- 수 카드로 수 만들기 ----------
   opt.cards 숫자들, opt.rules [{t:조건 글, f:(s)=>참/거짓}], opt.read 읽기도 씀, opt.target 정답이 하나일 때 */
function n1Cards(body, api, opt) {
  const n = opt.cards.length; let slots = Array(n).fill(null), fin = false;
  const slotRow = h("div", { class: "opts", style: "gap:.4em" }), cardRow = h("div", { class: "opts", style: "gap:.4em" });
  const rules = h("div"), readIn = n1Inp("min(100%,20em)", "읽는 말", "text");
  const cur = () => slots.every(v => v != null) ? slots.map(i => opt.cards[i]).join("") : null;
  function draw() {
    slotRow.innerHTML = ""; cardRow.innerHTML = "";
    slots.forEach((ci, s) => slotRow.append(h("button", { class: "opt", style: "min-width:2.6em;min-height:2.8em;font-size:1.5em;text-align:center;font-family:Jua", onclick: () => { if (fin) return; slots[s] = null; draw(); } },
      ci == null ? h("span", { style: "color:#9AA5A1;font-size:.6em" }, N1_PLACE[n - 1 - s]) : String(opt.cards[ci]))));
    opt.cards.forEach((c, ci) => { const used = slots.includes(ci); cardRow.append(h("button", { class: "opt", disabled: used, style: `min-width:2.6em;min-height:2.6em;font-size:1.5em;text-align:center;font-family:Jua;background:${used ? "#EEF1F0" : "#FFF4DD"};border-color:#D9A44E;opacity:${used ? .4 : 1}`, onclick: () => { if (fin) return; const e = slots.indexOf(null); if (e >= 0) { slots[e] = ci; draw(); } } }, String(c))); });
    rules.innerHTML = "";
    const s = cur();
    (opt.rules || []).forEach(r => rules.append(h("div", { style: "margin:.15em 0" }, (s ? (r.f(s) ? "✅ " : "⬜ ") : "⬜ ") + r.t)));
  }
  draw();
  api.provide({ words: opt.words || ["만의 자리에는 0을 쓸 수 없어요"], answers: opt.target ? [String(opt.target)] : [] });
  body.append(h("p", { class: "inst" }, "카드를 누르면 왼쪽 칸부터 차례로 들어가요. 칸을 누르면 카드가 돌아와요."),
    h("div", { class: "jua" }, "내가 만든 수"), slotRow, h("div", { class: "jua", style: "margin-top:.4em" }, "수 카드"), cardRow, rules,
    opt.read ? h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em;margin-top:.6em" }, h("span", { class: "jua" }, "만든 수를 읽어 보세요:"), readIn) : "",
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (fin) return; api.tryOnce();
      const s = cur(); const ans = (s || "-") + (opt.read ? " / " + readIn.value : "");
      if (!s) return api.fail("카드를 모두 칸에 놓아요.", ans);
      if (s[0] === "0") return api.fail(`${N1_PLACE[n - 1]}의 자리에는 0을 쓸 수 없어요. 0을 쓰면 ${n}자리 수가 되지 않아요.`, ans);
      const br = (opt.rules || []).find(r => !r.f(s)); if (br) return api.fail(br.why || `‘${br.t}’ 조건을 다시 살펴봐요.`, ans);
      if (opt.target && s !== String(opt.target)) return api.fail("조건을 모두 만족하는지 하나씩 다시 확인해요.", ans);
      if (opt.read) { const j = n1JudgeRead(readIn.value, s); if (!j.ok) { readIn.style.borderColor = "var(--no)"; return api.fail(j.msg, ans); } readIn.style.borderColor = "var(--ok)"; }
      fin = true; api.done(ans, (opt.ok || "멋진 수를 만들었어요!") + ` ${s} = ${n1Mix(s)}, ${n1Read(s)}`);
    } }, "확인하기"), h("button", { class: "ghost", onclick: () => { if (fin) return; slots = Array(n).fill(null); draw(); } }, "다시")));
}

/* ---------- 설명한 수 쓰기 (1조가 □개, 1억이 □개, 1만이 □개인 수) ---------- */
function n1Describe(body, api, opt) {
  const U = opt.units; let fin = false;
  const ins = U.map(u => n1Inp("4.5em", `1${u}의 개수`));
  const line = h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em;font-size:1.12em" });
  U.forEach((u, i) => line.append(h("span", { class: "jua" }, `1${u === "일" ? "" : u}${u === "조" ? "가" : "이"}`), ins[i], h("span", { class: "jua" }, i < U.length - 1 ? "개," : "개인 수")));
  const numIn = n1Inp("min(100%,16em)", "수");
  api.provide({ words: ["네 자리씩", "0인 자리에는 0"], answers: [] });
  body.append(n1H("p", { class: "inst" }, opt.tip || "□ 안에 1부터 9999까지의 수를 마음대로 정해 써요."), line,
    h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em;margin-top:.6em" }, h("span", { class: "jua" }, "이 수를 숫자로 쓰면:"), numIn),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (fin) return; api.tryOnce();
      const cs = ins.map(i => i.value.trim()), ans = cs.join("·") + " → " + numIn.value;
      const bad = cs.findIndex(c => !/^\d{1,4}$/.test(c) || Number(c) < 1);
      if (bad >= 0) { ins[bad].style.borderColor = "var(--no)"; return api.fail("□ 안에는 1부터 9999까지의 수를 써요.", ans); }
      ins.forEach(i => i.style.borderColor = "var(--ok)");
      const exp = { 일: 0, 만: 4, 억: 8, 조: 12 };
      const v = U.reduce((t, u, i) => t + BigInt(cs[i]) * 10n ** BigInt(exp[u]), 0n).toString();
      const got = n1Parse(numIn.value, { digits: true });
      if (got !== v) {
        numIn.style.borderColor = "var(--no)";
        if (n1Parse(numIn.value) === v) return api.fail("값은 맞아요! 이번에는 0을 모두 써서 숫자로만 써 봐요.", ans);
        return api.fail(`${U.map((u, i) => `1${u === "일" ? "" : u}${u === "조" ? "가" : "이"} ${cs[i]}개`).join(", ")}이면 ${U.map((u, i) => cs[i] + (u === "일" ? "" : u)).join(" ")}이에요. 네 자리씩 끊어 빈자리에는 0을 써요.`, ans);
      }
      numIn.style.borderColor = "var(--ok)"; fin = true;
      api.done(ans, `맞아요! ${v} = ${n1Mix(v)}, ${n1Read(v)}라고 읽어요.`);
    } }, "확인하기")));
}

/* ---------- 눌러서 고르기 그림 (큰 수 찾기) ---------- */
function n1Spot(body, api, opt) {
  const it = opt.items, sel = new Set(); let fin = false;
  const cols = opt.cols || 3, CW = 300, CH = 130, W = cols * CW + 20, rows = Math.ceil(it.length / cols), svg = makeSvg(W, rows * CH + 20);
  function draw() {
    svg.innerHTML = "";
    it.forEach((x, i) => {
      const gx = 10 + (i % cols) * CW, gy = 10 + Math.floor(i / cols) * CH, g = svgEl("g", { style: "cursor:pointer" });
      g.append(svgEl("rect", { x: gx + 8, y: gy + 8, width: CW - 16, height: CH - 16, rx: 14, fill: sel.has(i) ? "#FFF1D6" : "#fff", stroke: sel.has(i) ? "#B4610F" : "#C9D3CF", "stroke-width": sel.has(i) ? 4 : 2 }));
      g.append(txt(gx + CW / 2, gy + 44, x.t, 18, { fill: "#4A5753" }));
      g.append(txt(gx + CW / 2, gy + 84, x.v, 30));
      if (sel.has(i)) g.append(svgEl("ellipse", { cx: gx + CW / 2, cy: gy + 84, rx: Math.min(CW / 2 - 20, 14 * x.v.length + 20), ry: 26, fill: "none", stroke: N1_RED, "stroke-width": 3.5 }));
      g.addEventListener("click", () => { if (fin) return; sel.has(i) ? sel.delete(i) : sel.add(i); draw(); });
      svg.append(g);
    });
  }
  draw();
  api.provide({ words: opt.words || [], answers: [it.filter(x => x.ok).map(x => x.v).join(", ")] });
  body.append(n1Fit(svg, "54vh"), h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    if (fin) return; api.tryOnce();
    const ans = [...sel].map(i => it[i].v).join(", ") || "-";
    const miss = it.findIndex((x, i) => !!x.ok !== sel.has(i));
    if (miss < 0) { fin = true; return api.done(ans, opt.ok); }
    api.fail(sel.has(miss) ? (it[miss].why || `${n1J(it[miss].v, "은/는")} 조건에 맞지 않아요. 숫자가 몇 개인지 세어 봐요.`) : "아직 찾지 못한 카드가 있어요. 숫자가 몇 개인지 하나씩 세어 봐요.", ans);
  } }, "확인하기")));
}

/* ---------- 10배 관계 그림 ---------- */
function n1ChainFig(vals, lab = "10배") {
  return () => {
    const n = vals.length, W = 940, svg = makeSvg(W, 130), bw = 130, gap = (W - 20 - n * bw) / (n - 1);
    vals.forEach((v, i) => {
      const x = 10 + i * (bw + gap);
      svg.append(svgEl("rect", { x, y: 40, width: bw, height: 60, rx: 12, fill: v == null ? "#F2F5F4" : "#fff", stroke: v == null ? "#B4610F" : "#8A9692", "stroke-width": 2.5, "stroke-dasharray": v == null ? "7 5" : "none" }));
      svg.append(txt(x + bw / 2, 71, v == null ? "?" : String(v), 26, { fill: v == null ? "#B4610F" : INK }));
      if (i < n - 1) { const ax = x + bw + 4, bx = x + bw + gap - 4; svg.append(svgEl("line", { x1: ax, y1: 70, x2: bx - 8, y2: 70, stroke: N1_BLUE, "stroke-width": 3 })); svg.append(svgEl("path", { d: `M ${bx} 70 l -11 -7 v 14 z`, fill: N1_BLUE })); svg.append(txt((ax + bx) / 2, 26, lab, 18, { fill: N1_BLUE })); }
    });
    return h("div", { style: "max-width:48em" }, n1Fit(svg, "20vh"));
  };
}

/* ---------- 카드 3장으로 가장 큰 수 만들기 ---------- */
function n1Best(cards) { const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p])); return perms(cards).map(p => p.join("")).reduce((m, s) => BigInt(s) > BigInt(m) ? s : m); }
function n1CardBtn(t, o = {}) { return h("button", { class: "opt", disabled: !!o.disabled, style: `min-width:3.2em;min-height:2.6em;font-size:1.45em;text-align:center;font-family:Jua;background:${o.bg || "#FFF4DD"};border-color:${o.bc || "#D9A44E"};opacity:${o.disabled ? .35 : 1}`, onclick: o.onclick }, t); }
function n1Arrange(body, api, opt) {
  let si = 0, order = [], fin = false;
  const say = h("p", { class: "jua", style: "font-size:1.12em" }), made = h("div", { class: "opts" }), pool = h("div", { class: "opts" }), out = h("div", { class: "readout", style: N1_WRAP });
  function draw() {
    const cs = opt.sets[si]; say.textContent = `${si + 1}번째: 카드 ${cs.slice(0, -1).join(", ")}, ${n1Ro(cs[cs.length - 1])} 가장 큰 수를 만들어 보세요.`;
    made.innerHTML = ""; pool.innerHTML = "";
    [0, 1, 2].forEach(k => made.append(order[k] == null ? h("span", { class: "opt", style: "min-width:3.2em;min-height:2.6em;color:#9AA5A1;text-align:center" }, `${k + 1}번째`) : n1CardBtn(cs[order[k]], { onclick: () => { if (!fin) { order.splice(k, 1); draw(); } } })));
    cs.forEach((c, i) => pool.append(n1CardBtn(c, { disabled: order.includes(i), onclick: () => { if (!fin && order.length < 3) { order.push(i); draw(); } } })));
    const s = order.length === 3 ? order.map(i => cs[i]).join("") : null;
    out.innerHTML = s ? `만든 수: <b>${s}</b> <small>(${n1Mix(s)}, ${s.length}자리)</small>` : "카드를 차례로 눌러 수를 만들어요.";
  }
  draw();
  api.provide({ words: ["자리 수", "높은 자리에 큰 숫자"], answers: opt.sets.map(n1Best) });
  body.append(say, h("div", { class: "jua" }, "카드를 놓는 차례 (왼쪽부터 이어 붙여요)"), made, h("div", { class: "jua" }, "가진 카드"), pool, out,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      if (fin) return; api.tryOnce();
      const cs = opt.sets[si]; if (order.length < 3) return api.fail("카드 3장을 모두 놓아요.", "-");
      const s = order.map(i => cs[i]).join(""), best = n1Best(cs);
      if (s !== best) return api.fail(`${s}보다 더 큰 수를 만들 수 있어요. 맨 앞에 오는 숫자가 가장 크게 되도록 카드 순서를 바꿔 봐요.`, s);
      if (si < opt.sets.length - 1) { si++; order = []; draw(); return api.hint(`○ ${s}, 가장 큰 수예요! 다음 카드도 해 봐요.`); }
      fin = true; api.done(s, opt.ok);
    } }, "확인하기"), h("button", { class: "ghost", onclick: () => { if (!fin) { order = []; draw(); } } }, "다시")));
}

/* ---------- 놀이: 도전! 연속된 세 칸을 먼저 색칠해요 (컴퓨터와) ---------- */
const N1_DECK = ["158", "7", "93", "406", "25", "8", "61", "370", "9", "42", "805", "3"];
const N1_BOARD = [["158", "7", "93", "406"], ["25", "805", "61", "3"], ["370", "9", "42", "8"]];
const N1_LINES = (() => { const L = [], R = 3, C = 4, ok = (r, c) => r >= 0 && r < R && c >= 0 && c < C; for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) [[0, 1], [1, 0], [1, 1], [1, -1]].forEach(([dr, dc]) => { const l = [0, 1, 2].map(k => [r + dr * k, c + dc * k]); if (l.every(([a, b]) => ok(a, b))) L.push(l.map(([a, b]) => a * C + b)); }); return L; })();
function n1BoardSvg(col, opt = {}) {
  const CW = 150, CH = 92, svg = makeSvg(4 * CW + 20, 3 * CH + 20);
  N1_BOARD.flat().forEach((v, i) => {
    const r = Math.floor(i / 4), c = i % 4, x = 10 + c * CW, y = 10 + r * CH, who = col[i];
    const g = svgEl("g", { "data-i": i });
    g.append(svgEl("rect", { x: x + 4, y: y + 4, width: CW - 8, height: CH - 8, rx: 12, fill: who === "me" ? "#9CC7F2" : who === "cpu" ? "#F4A79A" : "#fff", stroke: opt.can && opt.can.includes(i) ? "#B4610F" : "#9AA5A1", "stroke-width": opt.can && opt.can.includes(i) ? 4.5 : 2, "stroke-dasharray": opt.can && opt.can.includes(i) ? "8 5" : "none" }));
    g.append(txt(x + CW / 2, y + CH / 2 + 2, v, 34, { fill: INK }));
    if (opt.onPick) { g.style.cursor = "pointer"; g.addEventListener("click", () => opt.onPick(i)); }
    svg.append(g);
  });
  return svg;
}
function n1Win(col, who) { return N1_LINES.some(l => l.every(i => col[i] === who)); }
function n1Game(body, api, opt) {
  let col = Array(12).fill(null), me, cpu, order, phase, round = 0, over = false, doneOnce = false, myNum = "", cpuNum = "";
  const boardBox = h("div", { style: "max-width:34em" }), area = h("div"), log = h("div", { class: "readout", style: "font-size:1.02em;" + N1_WRAP });
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cellsOf = cards => N1_BOARD.flat().map((v, i) => cards.includes(v) && !col[i] ? i : -1).filter(i => i >= 0);
  function deal() { const d = shuffle(N1_DECK); me = d.slice(0, 3); cpu = d.slice(3, 6); order = []; phase = "make"; round++; draw(); }
  function board(can, onPick) { boardBox.innerHTML = ""; boardBox.append(n1Fit(n1BoardSvg(col, { can, onPick }), "38vh")); }
  function finish(msg) {
    over = true; log.innerHTML = msg;
    area.innerHTML = ""; area.append(h("div", { class: "tools" }, h("button", { onclick: () => { col = Array(12).fill(null); round = 0; over = false; deal(); } }, "새 놀이 시작")));
    if (!doneOnce) { doneOnce = true; api.done(msg.replace(/<[^>]+>/g, ""), "놀이를 끝까지 했어요! 수를 만들고 비교한 방법을 친구에게 설명해 봐요."); }
  }
  function afterColor() {
    if (n1Win(col, "me")) return finish("🎉 <b>파란색(나)</b>이 연속된 세 칸을 먼저 색칠했어요. 내가 이겼어요!");
    if (n1Win(col, "cpu")) return finish("빨간색(컴퓨터)이 연속된 세 칸을 먼저 색칠했어요. 아깝다! ‘새 놀이 시작’으로 다시 도전해요.");
    if (col.every(Boolean) || round >= 14) return finish("색칠할 칸이 모자라 비겼어요. 다시 해 볼까요?");
    area.innerHTML = ""; area.append(h("div", { class: "tools" }, h("button", { class: "big", onclick: deal }, "한 판 더")));
  }
  function cpuColor() {
    const can = cellsOf(cpu.filter(c => true));
    if (!can.length) { log.innerHTML += "<br>컴퓨터는 가진 카드의 수가 모두 색칠되어 있어서 이번에는 색칠하지 못해요."; return afterColor(); }
    const tryWin = can.find(i => { const c2 = col.slice(); c2[i] = "cpu"; return n1Win(c2, "cpu"); });
    const block = can.find(i => { const c2 = col.slice(); c2[i] = "me"; return n1Win(c2, "me"); });
    const pick = tryWin != null ? tryWin : block != null ? block : can[Math.floor(Math.random() * can.length)];
    col[pick] = "cpu"; board(); log.innerHTML += `<br>컴퓨터가 <b>${N1_BOARD.flat()[pick]}</b> 칸을 빨간색으로 색칠했어요.`; afterColor();
  }
  function draw() {
    board(); area.innerHTML = "";
    if (phase === "make") {
      log.innerHTML = `${round}번째 판 · 내가 가져온 카드: <b>${me.join(", ")}</b>`;
      const made = h("div", { class: "opts" }), pool = h("div", { class: "opts" });
      [0, 1, 2].forEach(k => made.append(order[k] == null ? h("span", { class: "opt", style: "min-width:3.2em;min-height:2.6em;color:#9AA5A1;text-align:center" }, `${k + 1}`) : n1CardBtn(me[order[k]], { onclick: () => { order.splice(k, 1); draw(); } })));
      me.forEach((c, i) => pool.append(n1CardBtn(c, { disabled: order.includes(i), onclick: () => { if (order.length < 3) { order.push(i); draw(); } } })));
      area.append(h("div", { class: "jua" }, "카드 3장을 모두 사용하여 가장 큰 수를 만들어요."), made, pool,
        h("div", { class: "tools" }, h("button", { class: "big", onclick: () => {
          if (order.length < 3) return api.hint("카드 3장을 모두 놓아요.");
          myNum = order.map(i => me[i]).join("");
          if (myNum !== n1Best(me)) return api.hint(`${myNum}보다 더 큰 수를 만들 수 있어요. 카드 순서를 바꿔 봐요.`);
          cpuNum = n1Best(cpu); phase = "cmp"; api.hint("가장 큰 수를 만들었어요!"); draw();
        } }, "다 만들었어요")));
    } else if (phase === "cmp") {
      log.innerHTML = `나(파랑): <b>${myNum}</b> <small>(${n1Mix(myNum)})</small><br>컴퓨터(빨강, 카드 ${cpu.join(", ")}): <b>${cpuNum}</b> <small>(${n1Mix(cpuNum)})</small>`;
      const s = h("span", { class: "slot" });
      [">", "<"].forEach(sg => s.append(h("button", { class: "opt", style: "font-size:1.2em;min-width:2.2em;text-align:center", onclick: () => {
        if (sg !== n1Cmp(myNum, cpuNum)) return api.hint(myNum.length !== cpuNum.length ? "자리 수부터 세어 봐요. 자리 수가 많은 쪽이 더 큰 수예요." : "자리 수가 같아요. 높은 자리 수부터 차례대로 비교해 봐요.");
        if (sg === ">") { phase = "color"; api.hint("내가 만든 수가 더 커요! 내 카드의 수 중 하나를 골라 놀이판에서 한 칸 색칠해요."); draw(); }
        else { api.hint("컴퓨터가 만든 수가 더 커요. 컴퓨터가 색칠해요."); phase = "wait"; draw(); setTimeout(cpuColor, 700); }
      } }, sg)));
      area.append(h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.5em;font-size:1.15em" }, h("b", { class: "jua" }, myNum), s, h("b", { class: "jua" }, cpuNum)));
    } else if (phase === "color") {
      log.innerHTML = `내 카드: <b>${me.join(", ")}</b> · 주황 점선 칸 중 하나를 눌러 색칠해요.`;
      const can = cellsOf(me);
      if (!can.length) { log.innerHTML = "내 카드의 수가 모두 이미 색칠되어 있어서 이번에는 색칠할 수 없어요."; return afterColor(); }
      board(can, i => { if (!can.includes(i)) return api.hint("내가 가진 카드의 수가 적힌 빈칸만 색칠할 수 있어요."); col[i] = "me"; phase = "done"; board(); afterColor(); });
      area.append(h("p", { class: "inst" }, "이미 색칠된 칸은 색칠할 수 없어요."));
    }
  }
  api.provide({ words: ["자리 수가 많은 쪽", "높은 자리에 큰 숫자", "연속된 세 칸"], answers: [] });
  body.append(h("p", { class: "inst" }, "나는 파란색, 컴퓨터는 빨간색이에요. 가로·세로·대각선으로 연속된 세 칸을 먼저 색칠하면 이겨요."), boardBox, log, area);
  deal();
}

/* ---------- 세계 여러 나라의 인구 그림 ---------- */
const N1_POP = [
  { name: "프랑스", show: "6794만 명", v: "67940000" }, { name: "카자흐스탄", show: "천구백육십이만 명", v: "19620000" },
  { name: "중국", show: "14억 1218만 명", v: "1412180000" }, { name: "미국", show: "삼억 삼천삼백이십구만 명", v: "333290000" },
  { name: "대한민국", show: "오천백육십삼만 명", v: "51630000" }, { name: "필리핀", show: "1억 1556만 명", v: "115560000" },
  { name: "남아프리카 공화국", show: "59890000명", v: "59890000" }, { name: "인도", show: "십사억 천칠백십칠만 명", v: "1417170000" },
  { name: "브라질", show: "2억 1531만 명", v: "215310000" }, { name: "호주", show: "2598만 명", v: "25980000" }];
function n1PopFig(names) {
  return () => {
    const list = names ? N1_POP.filter(p => names.includes(p.name)) : N1_POP, cols = Math.min(4, list.length), CW = 245, CH = 96, rows = Math.ceil(list.length / cols);
    const svg = makeSvg(cols * CW + 20, rows * CH + 50);
    svg.append(txt((cols * CW + 20) / 2, 22, "2022년 세계 여러 나라의 인구 (출처: 세계은행, 2023)", 18, { fill: "#4A5753" }));
    list.forEach((p, i) => {
      const x = 10 + (i % cols) * CW, y = 40 + Math.floor(i / cols) * CH;
      svg.append(svgEl("rect", { x: x + 5, y: y + 5, width: CW - 10, height: CH - 10, rx: 12, fill: p.name === "대한민국" ? "#FFF1D6" : "#F4F9FD", stroke: "#9DB8CF", "stroke-width": 2 }));
      svg.append(txt(x + CW / 2, y + 32, p.name, 20, { fill: "#1E4F7A" }));
      svg.append(txt(x + CW / 2, y + 64, p.show, p.show.length > 11 ? 16 : 19));
    });
    return h("div", { style: "max-width:52em" }, n1Fit(svg, "40vh"));
  };
}
//@@LESSONS
const UNIT_STORY = { title: "예준이와 함께 나눔과 기부로 세상을 아름답게", lines: [
  "예준이가 인터넷에서 나눔과 기부에 관한 기사를 읽고 있어요. 희망 나눔 전시회, 책 보내기 운동, 나눔 콘서트처럼 세상을 아름답게 만드는 활동에는 0이 많은 큰 수가 자주 나와요.",
  "예준이와 함께 만, 다섯 자리 수, 십만·백만·천만, 억, 조를 알아보고, 큰 수를 뛰어 세고 크기를 비교해요.",
  "교과서 「수학 4-1」 1. 큰 수의 차시 순서 그대로 만들었어요."],
  one: "큰 수 · 예준이와 함께 나눔과 기부 활동 속 큰 수를 읽고 쓰고 비교해요." };
const UNIT_KEYWORDS = ["10000", "만(일만)", "다섯 자리 수", "자릿값", "십만·백만·천만", "억(일억)", "조(일조)", "네 자리씩 끊어 읽기", "0인 자리는 읽지 않아요", "각 자리 값의 합", "뛰어 세기", "자리 수", "높은 자리부터 비교", "같은 형태로 바꾸기"];

const LESSONS = [
{
  id: "b1", no: 1, title: "단원 도입 ― 나눔과 기부 속의 큰 수", soop: "개념 찾기(S)",
  question: "우리 주변에서 0이 많은 큰 수를 어디에서 볼 수 있을까요?",
  summary: "기사, 가격표, 기부 금액, 새가 날아간 거리처럼 우리 주변에는 큰 수가 많아요. 이 단원에서는 10000보다 큰 수를 읽고 쓰고, 뛰어 세고, 크기를 비교하는 방법을 배워요.",
  steps: [
    { inst: "예준이가 읽은 나눔과 기부 기사, 그리고 흑꼬리도요 소식에 나온 수예요. 숫자가 다섯 개 이상인 큰 수가 적힌 카드를 모두 눌러 동그라미 해 보세요.", hints: ["카드에 적힌 수의 숫자가 몇 개인지 하나씩 세어 봐요.", "1000은 숫자가 4개, 12200은 숫자가 5개예요."],
      render: (b, a) => n1Spot(b, a, { items: [
        { t: "흑꼬리도요가 한 번에 날아간 거리", v: "12200 km", ok: true },
        { t: "흑꼬리도요가 쉬지 않고 날아간 날", v: "11일" },
        { t: "희망 나눔 전시회 입장권 한 장", v: "1000원", why: "1000은 숫자가 4개인 네 자리 수예요." },
        { t: "아버지 회사가 기증한 책의 금액", v: "10000000원", ok: true },
        { t: "예준이가 통장에 모은 돈", v: "23586원", ok: true },
        { t: "함께 전시회에 간 친구", v: "10명" }],
        ok: "12200, 10000000, 23586은 숫자가 다섯 개 이상인 큰 수예요. 흑꼬리도요는 11일 동안 12200 km를 한 번에 날았대요!" }) },
    { name: "떠올리기 ①", inst: "2학년 때 배운 네 자리 수를 떠올려요. 삼천오백팔십육을 자릿값 표에 숫자 카드로 나타내 보세요.", hints: ["천의 자리부터 숫자를 하나씩 놓아요.", "삼천 → 천의 자리 3, 오백 → 백의 자리 5, 팔십 → 십의 자리 8, 육 → 일의 자리 6"],
      render: (b, a) => n1Chart(b, a, { cols: 4, value: 3586, say: "삼천오백팔십육", ok: "3586은 1000이 3개, 100이 5개, 10이 8개, 1이 6개인 수예요." }) },
    { inst: "그림을 보고 이야기해 보세요. 예준이는 희망 나눔 전시회에 가고, 책 보내기 운동에 참여했어요.", render: (b, a) => writeStep(b, a, [
      { q: "보기: 생활 속에서 0이 많은 큰 수를 본 적이 있나요? 어디에서 보았나요?", tag: "본 경험", ph: "예: 텔레비전 가격표에서 보았어요." },
      { q: "생각하기: 나눔과 기부 활동을 해 본 경험을 써 보세요.", tag: "나눔 경험", ph: "예: 안 입는 옷을 기부했어요." },
      { q: "궁금해하기: 큰 수에 대해 무엇이 궁금한가요?", tag: "궁금", ph: "예: 0이 아주 많은 수는 어떻게 읽을까요?" }]) },
    { name: "떠올리기 ②", inst: "네 자리 수의 크기를 비교해 보세요. ○ 안에 >, =, < 중 알맞은 것을 골라요.", hints: ["천의 자리 숫자부터 차례대로 비교해요.", "자리 수가 다르면 자리 수가 많은 쪽이 더 커요."],
      render: (b, a) => n1Ask(b, a, [
        { t: "cmp", l: 3586, r: 3612, why: { ">": "천의 자리 숫자는 3으로 같아요. 백의 자리 숫자 5와 6을 비교해요." } },
        { t: "cmp", l: 7140, r: 7104, why: { "<": "백의 자리까지 같아요. 십의 자리 숫자 4와 0을 비교해요." } },
        { t: "cmp", l: 999, r: 9999, why: { ">": "999는 세 자리 수, 9999는 네 자리 수예요." } }], { ok: "높은 자리부터 차례대로 비교했어요. 이 방법은 큰 수에서도 똑같이 쓰여요." }) },
    { inst: "큰 수가 필요한 상황을 생각해 보세요.", hints: ["사람 수, 물건 값, 먼 거리처럼 아주 많거나 큰 양을 떠올려요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "큰 수가 필요한 상황을 모두 고르세요.", t: "pick", o: ["우리나라 사람 수를 나타낼 때", "자동차의 가격을 말할 때", "필통 속 연필 수를 셀 때", "흑꼬리도요가 날아간 거리를 나타낼 때"], a: [0, 1, 3], why: { "0,1,2,3": "필통 속 연필은 몇 자루뿐이라 큰 수가 필요하지 않아요." } },
        { q: "12200 km에서 숫자는 모두 몇 개인가요?", t: "num", a: 5, unit: "개" }], { ok: "우리 생활에는 큰 수가 필요한 곳이 많아요. 이제 큰 수를 읽고 쓰는 방법을 배워 봐요." }) }
  ],
  challenge: { inst: "다음 시간에 배울 수를 미리 생각해 보세요.", hints: ["9999에 1을 더하면 일의 자리부터 차례로 받아올림이 생겨요."],
    render: (b, a) => n1Ask(b, a, [
      { q: "1000원짜리 지폐 9장은 모두 얼마인가요?", t: "num", a: 9000, unit: "원" },
      { q: "가장 큰 네 자리 수 9999보다 1만큼 더 큰 수를 숫자로 써 보세요.", t: "num", a: 10000, why: { "99991": "9999 뒤에 1을 붙인 것이 아니라 1만큼 더한 수예요." } },
      { q: "그 수는 몇 자리 수인가요?", t: "num", a: 5, unit: "자리" }], { ok: "9999보다 1만큼 더 큰 수는 다섯 자리 수 10000이에요. 다음 시간에 자세히 알아봐요!" }) }
},
{
  id: "b2", no: 2, title: "만을 알아볼까요", soop: "개념 구축하기(O)",
  question: "1000이 10개인 수는 어떻게 쓰고 읽을까요?",
  summary: "1000이 10개인 수를 10000 또는 1만이라 쓰고, 만 또는 일만이라고 읽어요. 10000은 9000보다 1000, 9900보다 100, 9990보다 10, 9999보다 1만큼 더 큰 수예요.",
  steps: [
    { inst: "희망 나눔 전시회의 입장권은 한 장에 1000원이에요. 예준이네 모둠 10명의 입장권 10장 값만큼 1000원짜리 지폐를 놓아 보세요.", hints: ["+1 단추를 눌러 1000원짜리 지폐를 한 장씩 놓아요. 8장, 9장일 때 모두 얼마인지 살펴봐요.", "1000원짜리가 10장이 되면 ‘10장 묶기’로 10000원짜리 한 장으로 바꿀 수 있어요."],
      render: (b, a) => n1Money(b, a, { denoms: [10000, 1000], addable: [1000], bundle: true, words: ["1000이 10개", "10000"], targets: [
        { v: 10000, need: { 1000: 10, 10000: 0 }, say: "입장권 10장 값만큼 **1000원짜리 지폐**를 놓아 보세요.", ok: "1000원짜리 10장은 10000원이에요." },
        { v: 10000, need: { 1000: 0, 10000: 1 }, say: "이번에는 1000원짜리 10장을 묶어 **10000원짜리 지폐 한 장**으로 바꿔 보세요.", ok: "1000원짜리 10장과 10000원짜리 한 장은 같은 금액이에요!" }] }) },
    { inst: "수직선에서 10000은 얼마만큼의 수인지 알아보세요. 빈칸을 채우고, 주황 칸을 눌러 수직선을 점점 크게 보세요.", hints: ["10000 바로 앞 눈금과 10000 사이가 한 칸이에요.", "눈금 한 칸의 크기가 1000, 100, 10, 1로 점점 작아져요."],
      render: (b, a) => n1Zoom(b, a, { levels: [{ from: 6000, step: 1000 }, { from: 9600, step: 100 }, { from: 9960, step: 10 }, { from: 9996, step: 1 }], ok: "10000은 9000보다 1000, 9900보다 100, 9990보다 10, 9999보다 1만큼 더 큰 수예요." }) },
    { inst: "10000까지의 수 사이의 관계를 알아보세요.", hints: ["어떤 수의 10배는 그 수 뒤에 0을 하나 붙인 수예요.", "10000은 100이 100개, 10이 1000개, 1이 10000개인 수예요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "1 → 10 → ? → 1000 → ?  (화살표마다 10배)", fig: n1ChainFig([1, 10, null, 1000, null]), t: "line", parts: ["1, 10, ", { a: 100 }, ", 1000, ", { a: 10000 }] },
        { q: "10000은 1000의 몇 배인가요?", t: "num", a: 10, unit: "배" },
        { q: "10000은 100의 몇 배인가요?", t: "num", a: 100, unit: "배", why: { "10": "100의 10배는 1000이에요. 10000이 되려면 100을 몇 번 곱해야 할까요?" } },
        { q: "10000은 10의 몇 배인가요?", t: "num", a: 1000, unit: "배" },
        { q: "1, 10, 100, 1000, 10000에는 어떤 규칙이 있나요?", t: "pick", o: ["오른쪽으로 갈수록 0이 하나씩 늘어나요(10배씩 커져요).", "오른쪽으로 갈수록 1씩 커져요."], a: 0 }], { ok: "1, 10, 100, 1000, 10000은 10배씩 커져요. 10000은 1의 10000배, 10의 1000배, 100의 100배, 1000의 10배예요." }) },
    { inst: "만의 약속을 완성해요.", hints: ["1000이 10개인 수는 1 뒤에 0이 4개예요."],
      render: (b, a) => blanks(b, a, ["1000이 10개인 수를 ", { o: ["10000", "1000", "100000"], a: 0 }, " 또는 ", { o: ["1만", "10천", "1000만"], a: 0 }, "이라 쓰고, ", { o: ["만 또는 일만", "십천", "천십"], a: 0 }, "이라고 읽어요."]) },
    { inst: "100원짜리 동전과 10원짜리 동전을 각각 모아 10000원을 만들어 보세요. 동전이 몇 개씩 필요한가요?", hints: ["100원짜리 10개는 1000원이에요. 10000원은 1000원이 10개예요.", "10원짜리 100개는 1000원이에요."],
      render: (b, a) => n1Money(b, a, { denoms: [100, 10], resetEach: true, steps: { 100: [1, 10], 10: [1, 10, 100] }, words: ["100이 100개", "10이 1000개"], targets: [
        { v: 10000, need: { 100: 100, 10: 0 }, say: "**100원짜리 동전만** 모아 10000원을 만들어 보세요.", ok: "100원짜리 동전 100개가 10000원이에요." },
        { v: 10000, need: { 100: 0, 10: 1000 }, say: "이번에는 **10원짜리 동전만** 모아 10000원을 만들어 보세요.", ok: "100원짜리는 100개, 10원짜리는 1000개가 있어야 10000원이 돼요." }] }) }
  ],
  challenge: { inst: "10000에 대해 더 생각해 보세요.", hints: ["각각 계산하여 10000이 되는지 확인해요.", "10000 mL에서 7000 mL를 빼요."],
    render: (b, a) => n1Ask(b, a, [
      { q: "설명하는 수가 다른 하나를 고르세요.", t: "pick", o: ["㉠ 9999보다 1만큼 더 큰 수", "㉡ 8000보다 200만큼 더 큰 수", "㉢ 100이 100개인 수", "㉣ 1000이 10개인 수"], a: 1, why: { "2": "100이 100개이면 10000이에요." } },
      { q: "윤서는 들이가 10000 mL인 물통에 물을 7000 mL 담았어요. 가득 담으려면 몇 mL를 더 담아야 하나요?", t: "num", a: 3000, unit: "mL" },
      { q: "가격이 10000원이 아닌 것을 고르세요.", t: "pick", o: ["㉠ 1000원짜리 볼펜 10자루", "㉡ 100원짜리 구슬 100개", "㉢ 500원짜리 공책 2권"], a: 2 },
      { q: "500원짜리 동전만으로 10000원을 만들려면 몇 개가 필요한가요?", t: "num", a: 20, unit: "개", why: { "2": "500원짜리 2개는 1000원이에요. 10000원은 1000원이 10개예요." } }], { ok: "10000을 여러 가지 방법으로 나타낼 수 있어요!" }) }
},
{
  id: "b3", no: 3, title: "다섯 자리 수를 알아볼까요", soop: "개념 구축하기(O)",
  question: "10000이 2개, 1000이 3개, 100이 5개, 10이 8개, 1이 6개인 수는 어떻게 쓰고 읽을까요?",
  summary: "10000이 2개, 1000이 3개, 100이 5개, 10이 8개, 1이 6개인 수를 23586 또는 2만 3586이라 쓰고, 이만 삼천오백팔십육이라고 읽어요. 같은 숫자라도 자리에 따라 나타내는 값이 달라요.",
  steps: [
    { inst: "예준이는 통장에 모은 23586원을 아프리카 아이들을 위해 기부하려고 해요. 모형 돈으로 23586원을 만들어 보세요.", hints: ["10000원짜리부터 놓아요. 23586에서 10000은 몇 개 들어 있나요?", "10000원 2장, 1000원 3장, 100원 5개, 10원 8개, 1원 6개예요."],
      render: (b, a) => n1Money(b, a, { denoms: [10000, 1000, 100, 10, 1], fewest: true, words: ["10000이 2개", "1000이 3개", "100이 5개", "10이 8개", "1이 6개"], targets: [{ v: 23586, say: "모형 돈으로 **23586원**을 만들어 보세요. 오른쪽에 금액이 나와요.", ok: "10000원 2장(20000원), 1000원 3장(3000원), 100원 5개(500원), 10원 8개(80원), 1원 6개(6원), 모두 23586원이에요." }] }) },
    { inst: "51465를 자릿값 표에 숫자 카드로 나타내 보세요. 다 놓으면 각 자리 숫자가 나타내는 값이 나와요.", hints: ["다섯 자리 수는 만, 천, 백, 십, 일의 자리가 있어요.", "가장 왼쪽 5는 만의 자리에 놓아요."],
      render: (b, a) => n1Chart(b, a, { cols: 5, value: 51465, say: "51465", note: "같은 숫자 5라도 만의 자리 5는 50000, 일의 자리 5는 5를 나타내요.", ok: "51465는 50000 + 1000 + 400 + 60 + 5예요." }) },
    { inst: "51465는 얼마만큼의 수인지 말해 보세요.", hints: ["만의 자리 숫자 5는 10000이 5개라는 뜻이에요.", "백의 자리 숫자 4는 100이 4개라는 뜻이에요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "51465에서 **만의 자리 숫자 5**가 나타내는 값은?", t: "num", a: 50000, why: { "5": "그것은 일의 자리 숫자 5가 나타내는 값이에요. 만의 자리는 10000이 몇 개인지 나타내요." } },
        { q: "51465에서 **일의 자리 숫자 5**가 나타내는 값은?", t: "num", a: 5 },
        { q: "빈칸을 채워 각 자리 숫자가 나타내는 값의 합으로 나타내 보세요.", t: "line", parts: ["51465 = ", { a: 50000 }, " + 1000 + ", { a: 400 }, " + 60 + 5"] }], { ok: "같은 숫자라도 자리에 따라 나타내는 값이 달라요. 51465는 각 자리 값의 합이에요." }) },
    { inst: "다섯 자리 수의 약속을 완성해요.", hints: ["만의 자리 숫자를 읽고 ‘만’을 붙인 다음, 나머지 네 자리를 읽어요."],
      render: (b, a) => blanks(b, a, ["10000이 2개, 1000이 3개, 100이 5개, 10이 8개, 1이 6개인 수를 ", { o: ["23586", "2358", "200003586"], a: 0 }, " 또는 ", { o: ["2만 3586", "23만 586", "2만 358"], a: 0 }, "이라 쓰고, ", { o: ["이만 삼천오백팔십육", "이 삼 오 팔 육", "이천삼백오십팔만 육"], a: 0 }, "이라고 읽어요."]) },
    { inst: "다섯 자리 수를 쓰고 읽어 보세요.", hints: ["숫자가 0인 자리는 읽지 않아요.", "읽은 말에 없는 자리에는 0을 써요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "사만 육천이백오십구를 수로 써 보세요.", t: "num", a: 46259 },
        { q: "80573을 읽어 보세요.", t: "read", a: 80573 },
        { q: "10000이 3개, 1000이 1개, 100이 5개, 10이 4개, 1이 8개인 수를 써 보세요.", t: "num", a: 31548 },
        { q: "31548을 읽어 보세요.", t: "read", a: 31548 },
        { q: "숫자 3이 30000을 나타내는 수를 고르세요.", t: "pick", o: ["㉠ 79831", "㉡ 30754", "㉢ 13256"], a: 1, why: { "2": "13256에서 3은 천의 자리 숫자라 3000을 나타내요." } },
        { q: "민호는 ‘35012 = 30000 + 500 + 10 + 2’라고 했어요. 바르게 고친 식을 고르세요.", t: "pick", o: ["35012 = 30000 + 5000 + 10 + 2", "35012 = 30000 + 500 + 100 + 2", "35012 = 3000 + 5000 + 10 + 2"], a: 0 }], { ok: "0인 자리는 읽지 않고, 읽지 않은 자리에는 0을 써요. 잘했어요!" }) }
  ],
  challenge: { inst: "수 카드 3, 5, 6, 8, 0을 한 번씩 모두 사용하여 다섯 자리 수를 만들고, 만든 수를 읽어 보세요.", hints: ["만의 자리에는 0을 쓸 수 없어요.", "0이 있는 자리는 읽지 않아요."],
    render: (b, a) => n1Cards(b, a, { cards: [3, 5, 6, 8, 0], read: true, ok: "다섯 자리 수를 만들고 바르게 읽었어요! 이 카드로 만들 수 있는 가장 큰 수는 86530, 가장 작은 수는 30568이에요." }) }
},
{
  id: "b4", no: 4, title: "십만, 백만, 천만을 알아볼까요", soop: "개념 구축하기(O)",
  question: "10000이 10개, 100개, 1000개인 수는 어떻게 쓰고 읽을까요?",
  summary: "10000이 10개인 수는 100000(10만, 십만), 100개인 수는 1000000(100만, 백만), 1000개인 수는 10000000(1000만, 천만)이에요. 10000이 8629개인 수를 86290000 또는 8629만이라 쓰고, 팔천육백이십구만이라고 읽어요.",
  steps: [
    { inst: "예준이는 100000원, 예준이네 학교는 1000000원, 아버지의 회사는 10000000원 상당의 책을 도서관에 기증했어요. 돈 모형을 10개씩 묶어 가며 차례대로 만들어 보세요.", hints: ["10000원짜리 10장을 묶으면 10만 원 묶음 하나가 돼요.", "10만 원 묶음 10개를 묶으면 100만 원, 100만 원 10개를 묶으면 1000만 원이에요."],
      render: (b, a) => n1Money(b, a, { denoms: [10000000, 1000000, 100000, 10000], addable: [10000, 100000, 1000000], bundle: true, words: ["10000이 10개", "10만이 10개", "100만이 10개"], targets: [
        { v: 100000, say: "예준이가 기증한 **100000원**(10만 원)을 만들어 보세요.", ok: "10000이 10개인 수는 100000, 10만이에요." },
        { v: 1000000, say: "더 모아서 예준이네 학교가 기증한 **1000000원**(100만 원)을 만들어 보세요.", ok: "10000이 100개인 수는 1000000, 100만이에요." },
        { v: 10000000, need: { 10000000: 1, 1000000: 0, 100000: 0, 10000: 0 }, needMsg: "금액은 맞아요! 100만 원 묶음 10개를 묶어 1000만 원 묶음 하나로 바꿔 봐요.", say: "더 모아서 아버지 회사가 기증한 **10000000원**(1000만 원)을 만들고, 1000만 원 묶음으로 바꿔 보세요.", ok: "10000이 1000개인 수는 10000000, 1000만이에요!" }] }) },
    { inst: "86290000을 자릿값 표에 숫자 카드로 나타내 보세요.", hints: ["일의 자리부터 네 자리씩 끊으면 8629 / 0000이에요.", "앞의 네 자리 8629는 만 아래의 천, 백, 십, 일 칸에 놓아요."],
      render: (b, a) => n1Chart(b, a, { cols: 8, value: 86290000, group: 1, say: "86290000", ok: "86290000 = 80000000 + 6000000 + 200000 + 90000이에요." }) },
    { inst: "86290000은 얼마만큼의 수인지 말해 보세요.", hints: ["8은 천만의 자리 숫자예요. 10000000이 8개라는 뜻이에요.", "6은 백만의 자리, 2는 십만의 자리, 9는 만의 자리 숫자예요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "86290000에서 숫자 8이 나타내는 값은?", t: "num", a: 80000000, why: { "8000000": "8은 천만의 자리 숫자예요. 0의 개수를 다시 세어 봐요." } },
        { q: "86290000에서 숫자 2는 몇의 자리 숫자인가요?", t: "pick", o: ["만의 자리", "십만의 자리", "백만의 자리"], a: 1 },
        { q: "각 자리 숫자가 나타내는 값의 합으로 나타내 보세요.", t: "line", parts: ["86290000 = 80000000 + ", { a: 6000000 }, " + ", { a: 200000 }, " + 90000"] }], { ok: "86290000은 각 자리 숫자가 나타내는 값의 합이에요." }) },
    { inst: "십만, 백만, 천만의 약속을 완성해요.", hints: ["10000이 8629개이면 8629 뒤에 0을 4개 붙여요."],
      render: (b, a) => blanks(b, a, ["10000이 10개인 수를 100000 또는 10만이라 쓰고 ", { o: ["십만", "만십", "일십만"], a: 0 }, "이라고 읽어요. 10000이 8629개인 수를 ", { o: ["86290000", "8629000", "862900000"], a: 0 }, " 또는 ", { o: ["8629만", "8629천", "86만 2900"], a: 0 }, "이라 쓰고, ", { o: ["팔천육백이십구만", "팔백육십이만 구천", "팔만 육천이백구십"], a: 0 }, "이라고 읽어요."]) },
    { inst: "수를 쓰고 읽어 보세요. 수를 읽을 때에는 일의 자리부터 네 자리씩 나누어 읽어요.", hints: ["2090458 → 209 / 0458 → 이백구만 사백오십팔", "만 앞의 네 자리를 먼저 읽고 ‘만’을 붙여요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "오천이백십구만을 수로 써 보세요.", t: "num", a: 52190000, why: { "5219": "‘만’이 붙어 있으니 뒤에 네 자리(0000)가 더 있어야 해요." } },
        { q: "476245를 읽어 보세요.", t: "read", a: 476245 },
        { q: "휴대 전화 광고에 ‘6400만 화소 카메라!’라고 적혀 있어요. 6400만을 0을 모두 써서 나타내 보세요.", t: "num", a: 64000000, digits: true },
        { q: "‘판매량 1000000개 돌파!’에서 1000000을 읽어 보세요.", t: "read", a: 1000000 }], { ok: "광고 속의 큰 수도 네 자리씩 나누어 읽고 쓸 수 있어요." }) }
  ],
  challenge: { inst: "천만 단위까지의 수를 더 알아보세요.", hints: ["숫자가 나타내는 값은 그 숫자 뒤에 남은 자리 수만큼 0을 붙여요.", "천만은 십만의 100배예요."],
    render: (b, a) => n1Ask(b, a, [
      { q: "10000이 3705개인 수를 써 보세요.", t: "num", a: 37050000 },
      { q: "37050000을 읽어 보세요.", t: "read", a: 37050000 },
      { q: "숫자 5가 나타내는 값이 가장 작은 수를 고르세요.", t: "pick", o: ["㉠ 1540000", "㉡ 25700000", "㉢ 57910000"], a: 0 },
      { q: "25264108에서 천만의 자리 숫자 2가 나타내는 값은 십만의 자리 숫자 2가 나타내는 값의 몇 배인가요?", t: "num", a: 100, unit: "배", why: { "10": "20000000과 200000의 0의 개수를 비교해 봐요. 0이 2개 차이 나요." } }], { ok: "천만 단위까지의 수를 자유롭게 다루었어요!" }) }
},
{
  id: "b5", no: 5, title: "억을 알아볼까요", soop: "개념 구축하기(O)",
  question: "1000만이 10개인 수는 어떻게 쓰고 읽을까요?",
  summary: "1000만이 10개인 수를 100000000 또는 1억이라 쓰고, 억 또는 일억이라고 읽어요. 1억이 3845개인 수를 384500000000 또는 3845억이라 쓰고, 삼천팔백사십오억이라고 읽어요.",
  steps: [
    { inst: "나눔 콘서트 영상의 조회 수가 100000000회예요. 1만에서 시작해 ‘10개 모으기’를 눌러 10배씩 키우며 얼마만큼의 수인지 알아보세요.", hints: ["1만이 10개이면 10만, 10만이 10개이면 100만이에요.", "1000만이 10개인 수는 1 뒤에 0이 8개예요."],
      render: (b, a) => n1Times(b, a, { start: 10000, times: 4, cols: 12, group: 2, ask: [{ q: "1000만이 10개인 수를 0을 모두 써서 나타내 보세요.", t: "num", a: 100000000, digits: true }], ok: "1000만이 10개인 수는 100000000, 1억이에요. 영상의 조회 수는 1억 회예요!" }) },
    { inst: "384500000000을 자릿값 표에 숫자 카드로 나타내 보세요.", hints: ["일의 자리부터 네 자리씩 끊으면 3845 / 0000 / 0000이에요.", "3845는 억 아래의 천, 백, 십, 일 칸에 놓아요."],
      render: (b, a) => n1Chart(b, a, { cols: 12, value: 384500000000, group: 2, say: "384500000000", ok: "384500000000은 1억이 3845개인 수, 3845억이에요." }) },
    { inst: "384500000000은 얼마만큼의 수인지 말해 보세요.", hints: ["3은 천억의 자리 숫자예요.", "4는 십억의 자리 숫자예요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "각 자리 숫자가 나타내는 값의 합으로 나타내 보세요.", t: "line", parts: ["384500000000 = ", { a: 300000000000 }, " + 80000000000 + ", { a: 4000000000 }, " + 500000000"] },
        { q: "1억이 10개, 100개, 1000개인 수를 바르게 쓴 것은?", t: "pick", o: ["10억, 100억, 1000억", "1억 10, 1억 100, 1억 1000", "10만, 100만, 1000만"], a: 0 }], { ok: "1억이 10개이면 10억, 100개이면 100억, 1000개이면 1000억이에요." }) },
    { inst: "억의 약속을 완성해요.", hints: ["1000만이 10개이면 0이 8개인 수예요."],
      render: (b, a) => blanks(b, a, ["1000만이 10개인 수를 ", { o: ["100000000", "10000000", "1000000000"], a: 0 }, " 또는 ", { o: ["1억", "10천만", "1000만"], a: 0 }, "이라 쓰고, ", { o: ["억 또는 일억", "천만", "십천만"], a: 0 }, "이라고 읽어요. 1억이 3845개인 수는 ", { o: ["3845억", "3845만", "384억 5000"], a: 0 }, "이에요."]) },
    { inst: "수를 쓰거나 읽어 보세요. (예: 4100000000 → 사십일억)", hints: ["일의 자리부터 네 자리씩 끊고 억, 만을 붙여 읽어요.", "27506100000 → 275 / 0610 / 0000"],
      render: (b, a) => n1Ask(b, a, [
        { q: "삼천이백칠십사억 오천사백육십일만을 수로 써 보세요.", t: "num", a: 327454610000 },
        { q: "27506100000을 읽어 보세요.", t: "read", a: 27506100000 },
        { q: "뉴스: ‘영국 요크셔 해안에서 **1억 6600만 년** 전 공룡 발자국이 발견됐대.’ 1억 6600만을 0을 모두 써서 나타내 보세요.", t: "num", a: 166000000, digits: true }], { ok: "천억 단위까지의 수를 쓰고 읽을 수 있어요." }) }
  ],
  challenge: { inst: "천억 단위까지의 수를 더 알아보세요.", hints: ["1억이 2530개 → 2530억, 1만이 2901개 → 2901만, 1이 6789개 → 6789", "154800693257을 네 자리씩 끊으면 1548 / 0069 / 3257이에요."],
    render: (b, a) => n1Ask(b, a, [
      { q: "1억이 2530개, 1만이 2901개, 1이 6789개인 수를 써 보세요.", t: "num", a: 253029016789 },
      { q: "위의 수를 읽어 보세요.", t: "read", a: 253029016789 },
      { q: "154800693257에 대해 옳게 말한 것을 고르세요.", t: "pick", o: ["㉠ 숫자 1은 1000억을 나타내요.", "㉡ 숫자 4는 억의 자리 숫자예요.", "㉢ 백억의 자리 숫자는 8이에요."], a: 0, why: { "1": "4는 십억의 자리 숫자예요.", "2": "백억의 자리 숫자는 5예요." } },
      { q: "9000만보다 1000만만큼 더 큰 수를 써 보세요.", t: "num", a: 100000000 }], { ok: "천억 단위까지의 수를 자유롭게 다루었어요!" }) }
},
{
  id: "b6", no: 6, title: "조를 알아볼까요", soop: "개념 구축하기(O)",
  question: "1000억이 10개인 수는 어떻게 쓰고 읽을까요?",
  summary: "1000억이 10개인 수를 1000000000000 또는 1조라 쓰고, 조 또는 일조라고 읽어요. 1조가 2893개인 수를 2893000000000000 또는 2893조라 쓰고, 이천팔백구십삼조라고 읽어요.",
  steps: [
    { inst: "예준이가 사는 도시는 올해 노인 복지를 위해 1000000000000원을 사용할 계획이에요. 1억에서 시작해 ‘10개 모으기’로 10배씩 키워 보세요.", hints: ["1억이 10개이면 10억, 10억이 10개이면 100억이에요.", "1000억이 10개인 수는 1 뒤에 0이 12개예요."],
      render: (b, a) => n1Times(b, a, { start: 100000000, times: 4, cols: 16, group: 3, ask: [{ q: "1000억이 10개인 수를 0을 모두 써서 나타내 보세요.", t: "num", a: 1000000000000, digits: true }], ok: "1000억이 10개인 수는 1000000000000, 1조예요. 노인 복지에 1조 원을 쓸 계획이에요!" }) },
    { inst: "2893000000000000을 자릿값 표에 숫자 카드로 나타내 보세요.", hints: ["일의 자리부터 네 자리씩 끊으면 2893 / 0000 / 0000 / 0000이에요.", "2893은 조 아래의 천, 백, 십, 일 칸에 놓아요."],
      render: (b, a) => n1Chart(b, a, { cols: 16, value: "2893000000000000", group: 3, say: "2893000000000000", ok: "2893000000000000은 1조가 2893개인 수, 2893조예요." }) },
    { inst: "2893000000000000은 얼마만큼의 수인지 말해 보세요.", hints: ["8은 백조의 자리 숫자예요.", "9는 십조의 자리 숫자예요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "각 자리 숫자가 나타내는 값의 합으로 나타내 보세요.", t: "line", parts: ["2893000000000000 = 2000000000000000 + ", { a: "800000000000000" }, " + ", { a: "90000000000000" }, " + 3000000000000"] },
        { q: "숫자 2는 몇의 자리 숫자인가요?", t: "pick", o: ["조의 자리", "십조의 자리", "천조의 자리"], a: 2 }], { ok: "2893조는 각 자리 숫자가 나타내는 값의 합이에요." }) },
    { inst: "조의 약속을 완성해요.", hints: ["1000억이 10개인 수는 0이 12개예요."],
      render: (b, a) => blanks(b, a, ["1000억이 10개인 수를 ", { o: ["1000000000000", "100000000000", "10000000000000"], a: 0 }, " 또는 ", { o: ["1조", "10조", "1000조"], a: 0 }, "라 쓰고, ", { o: ["조 또는 일조", "십조", "천조"], a: 0 }, "라고 읽어요. 1조가 2893개인 수 → ", { o: ["2893조", "2893억", "2893만"], a: 0 }]) },
    { inst: "수를 쓰거나 읽어 보세요. (예: 325000000000000 → 삼백이십오조)", hints: ["‘조’, ‘억’, ‘만’ 사이에 네 자리씩 있어요. 비어 있는 자리에는 0을 써요.", "2059038000000000 → 2059 / 0380 / 0000 / 0000"],
      render: (b, a) => n1Ask(b, a, [
        { q: "칠십구조 천이백억 백오십만을 수로 써 보세요.", t: "num", a: "79120001500000" },
        { q: "2059038000000000을 읽어 보세요.", t: "read", a: "2059038000000000" },
        { q: "1조가 10개인 수를 써 보세요.", t: "num", a: "10000000000000" },
        { q: "설명하는 수가 다른 하나를 고르세요.", t: "pick", o: ["㉠ 10억이 1000개인 수", "㉡ 1조의 10배인 수", "㉢ 9조보다 1조만큼 더 큰 수"], a: 0, why: { "1": "1조의 10배는 10조예요. 다른 것도 계산해 봐요.", "2": "9조보다 1조만큼 더 큰 수는 10조예요." } }], { ok: "천조 단위까지의 수를 쓰고 읽을 수 있어요." }) }
  ],
  challenge: { inst: "친구에게 설명할 수를 정해 보세요. ‘1조가 □개, 1억이 □개, 1만이 □개인 수’의 □를 마음대로 채우고, 그 수를 숫자로 써 보세요. (예: 1조가 1632개, 1억이 2789개, 1만이 3085개인 수 → 1632278930850000)", hints: ["1632조 2789억 3085만처럼 먼저 섞어 써 봐요.", "만 아래 네 자리(일, 십, 백, 천의 자리)에는 0을 4개 써요."],
    render: (b, a) => n1Describe(b, a, { units: ["조", "억", "만"] }) }
},
{
  id: "b7", no: 7, title: "뛰어 세기를 해 볼까요", soop: "개념 구축하기(O)",
  question: "큰 수를 뛰어 세면 어느 자리 숫자가 어떻게 변할까요?",
  summary: "10만씩 뛰어 세면 십만의 자리 숫자가 1씩, 20만씩 뛰어 세면 2씩 커져요. 뛰어 세기를 할 때에는 어느 자리 숫자가 얼마씩 변하는지 살펴봐요.",
  steps: [
    { inst: "예준이 아버지의 회사는 매년 콩 10만 kg과 쌀 20만 kg을 기부해요. 4년 동안 기부한 무게를 뛰어 세기로 알아보세요.", hints: ["얼마씩 뛸지 먼저 고르고 ‘한 번 뛰기’를 눌러요.", "콩은 매년 10만 kg씩, 쌀은 매년 20만 kg씩 늘어나요."],
      render: (b, a) => n1Hop(b, a, { choices: [10000, 100000, 200000, 1000000], tasks: [
        { start: 100000, step: 100000, n: 3, say: "**콩**: 1년째 10만 kg에서 시작해 4년째까지 뛰어 세어 보세요.", why: "콩은 매년 10만 kg씩 기부해요.", ok: "콩은 10만, 20만, 30만, 40만 kg이에요." },
        { start: 200000, step: 200000, n: 3, say: "**쌀**: 1년째 20만 kg에서 시작해 4년째까지 뛰어 세어 보세요.", why: "쌀은 매년 20만 kg씩 기부해요.", ok: "쌀은 20만, 40만, 60만, 80만 kg이에요." }],
        ok: "4년 동안 콩 40만 kg, 쌀 80만 kg을 기부했어요. 10만씩 뛰면 십만의 자리 숫자가 1씩, 20만씩 뛰면 2씩 커져요." }) },
    { inst: "얼마씩 뛰어 세었는지 알아보세요. 답은 1000만, 2억처럼 써도 돼요.", hints: ["두 수에서 숫자가 바뀐 자리를 찾아봐요.", "그 자리 숫자가 얼마씩 커졌는지 보면 얼마씩 뛰어 세었는지 알 수 있어요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "2400만 – 3400만 – 4400만 – 5400만은 얼마씩 뛰어 세었나요?", fig: n1HopFig(["2400만", "3400만", "4400만", "5400만"], "+ ?"), t: "num", a: 10000000, kb: "text", unit: "씩", why: { "1000": "‘만’이 붙어 있어요. 2400만과 3400만의 차이는 1000만이에요." } },
        { q: "1356000000 – 1556000000 – 1756000000 – 1956000000은 얼마씩 뛰어 세었나요?", fig: n1HopFig(["1356000000", "1556000000", "1756000000", "1956000000"], "+ ?", { fs: 19 }), t: "num", a: 200000000, kb: "text", unit: "씩", why: { "100000000": "억의 자리 숫자가 1씩이 아니라 2씩 커졌어요.", "2000000": "0의 개수를 다시 세어 봐요. 억의 자리 숫자가 2씩 커졌어요." } },
        { q: "1356000000 – 1556000000 – …에서 숫자가 변하는 자리는?", t: "pick", o: ["억의 자리", "천만의 자리", "십억의 자리"], a: 0 }], { ok: "천만의 자리 숫자가 1씩 커지면 1000만씩, 억의 자리 숫자가 2씩 커지면 2억씩 뛰어 센 거예요." }) },
    { inst: "얼마씩 뛰어 셀지 내가 정해서 3억부터 4번 뛰어 세어 보세요. 그리고 어느 자리 숫자가 변했는지 말해 보세요.", hints: ["원하는 만큼을 하나 고르고 ‘한 번 뛰기’를 4번 눌러요.", "빨간 숫자가 바뀐 자리예요."],
      render: (b, a) => n1Hop(b, a, { free: { start: 300000000, n: 4, choices: [10000000, 20000000, 100000000, 1000000000, 10000000000, 100000000000], places: [7, 8, 9, 10, 11] }, friend: "친구는 1억씩 뛰어 세었대요: 3억, 4억, 5억, 6억, 7억. 내 것과 비교해 봐요.", say: "" }) },
    { inst: "뛰어 세기의 약속을 완성해요.", hints: ["10만씩 뛰어 세면 십만의 자리 숫자가 커져요.", "90만에서 10만을 더 뛰면 십만의 자리 숫자가 10이 되어 백만의 자리로 올라가요."],
      render: (b, a) => blanks(b, a, ["10만씩 뛰어 세면 ", { o: ["십만", "만", "백만"], a: 0 }, "의 자리 숫자가 1씩 커져요. 10만씩 뛰어 셀 때 90만 다음 수는 ", { o: ["100만", "91만", "900만"], a: 0 }, "이에요. 뛰어 세기를 할 때에는 ", { o: ["어느 자리 숫자가 얼마씩 변하는지", "0이 모두 몇 개인지만"], a: 0 }, " 살펴봐요."]) },
    { inst: "뛰어 세기를 하여 빈 곳에 알맞은 수를 써넣어 보세요. ‘351억’처럼 써도 돼요.", hints: ["먼저 이웃한 두 수를 보고 얼마씩 뛰어 세었는지 찾아요.", "첫 번째 빈칸이 맨 앞에 있으면 거꾸로 뛰어 세어요."],
      render: (b, a) => n1Ask(b, a, [
        { t: "line", parts: ["120000, 150000, 180000, ", { a: 210000 }, ", ", { a: 240000 }] },
        { t: "line", parts: [{ a: 35100000000, show: "351억" }, ", 451억, 551억, 651억, ", { a: 75100000000, show: "751억" }] },
        { t: "line", parts: ["2180조, 2380조, ", { a: "2580000000000000", show: "2580조" }, ", 2780조, ", { a: "2980000000000000", show: "2980조" }] },
        { q: "지민이는 1월부터 한 달에 30000원씩 기부했어요. 5월까지 모두 얼마를 기부했나요?", t: "num", a: 150000, unit: "원", why: { "120000": "1월, 2월, 3월, 4월, 5월은 모두 5달이에요." } }], { ok: "30000씩, 100억씩, 200조씩 뛰어 세었어요." }) }
  ],
  challenge: { inst: "뛰어 세기로 문제를 해결해 보세요.", hints: ["거꾸로 뛰어 세면 처음 수를 찾을 수 있어요.", "34조 2540억과 36조 2540억의 차이를 생각해요."],
    render: (b, a) => n1Ask(b, a, [
      { q: "★에서 60만씩 3번 뛰어 세었더니 520만이 되었어요. ★은 얼마인가요? (340만처럼 써도 돼요)", t: "num", a: 3400000, kb: "text", why: { "7000000": "520만에서 60만씩 거꾸로 3번 뛰어 세어야 해요.", "4600000": "60만씩 3번이에요. 한 번만 거꾸로 뛰었어요." } },
      { q: "200조씩 뛰어 세어 보세요.", t: "line", parts: ["4013조, 4213조, 4413조, ", { a: "4613000000000000", show: "4613조" }, ", ", { a: "4813000000000000", show: "4813조" }, ", ", { a: "5013000000000000", show: "5013조" }] },
      { q: "34조 2540억 – 36조 2540억 – 38조 2540억 – 40조 2540억은 얼마씩 뛰어 세었나요?", t: "num", a: 2000000000000, kb: "text", unit: "씩" }], { ok: "뛰어 세기의 규칙을 찾아 문제를 해결했어요!" }) }
},
{
  id: "b8", no: 8, title: "수의 크기를 비교해 볼까요", soop: "개념 구축하기(O)",
  question: "큰 수의 크기는 어떻게 비교할까요?",
  summary: "자리 수가 다르면 자리 수가 많은 쪽이 더 큰 수예요. 자리 수가 같으면 높은 자리 수부터 차례대로 비교하여 높은 자리 수가 큰 쪽이 더 큰 수예요.",
  steps: [
    { inst: "여러 기업에서 기부한 콩 9600000 kg과 쌀 14400000 kg을 어려운 이웃에게 나누어 주려고 해요. 표에서 두 수의 크기가 정해지는 자리를 누르고, >, < 중 알맞은 것을 골라요.", hints: ["두 수가 각각 몇 자리 수인지 세어 봐요.", "14400000은 여덟 자리, 9600000은 일곱 자리예요."],
      render: (b, a) => n1Compare(b, a, { pairs: [{ a: 9600000, b: 14400000, la: "콩(kg)", lb: "쌀(kg)", ok: "14400000은 8자리, 9600000은 7자리예요. 자리 수가 많은 쌀이 더 무거워요." }] }) },
    { inst: "1273000000000과 1281000000000의 크기를 비교해 보세요. 표에서 크기가 정해지는 자리를 누르고 부등호를 골라요.", hints: ["두 수는 모두 13자리예요.", "조의 자리, 천억의 자리는 같아요. 그다음 자리를 비교해요."],
      render: (b, a) => n1Compare(b, a, { pairs: [{ a: 1273000000000, b: 1281000000000, la: "가", lb: "나", ok: "자리 수가 같아서 높은 자리부터 비교했어요. 백억의 자리에서 7 < 8이므로 1281000000000이 더 커요." }] }) },
    { inst: "두 수의 크기를 비교하여 ○ 안에 >, =, < 중 알맞은 것을 골라요.", hints: ["먼저 자리 수를 세어요.", "자리 수가 같으면 높은 자리부터 차례대로 비교해요."],
      render: (b, a) => n1Ask(b, a, [
        { t: "cmp", l: 423518, r: 5106730, why: { ">": "앞자리 숫자만 보면 안 돼요. 423518은 여섯 자리, 5106730은 일곱 자리예요." } },
        { t: "cmp", l: 387653000, r: 387461000, why: { "<": "백만의 자리까지 같아요. 십만의 자리 숫자 6과 4를 비교해요." } },
        { t: "cmp", l: 2457000, r: 213900 },
        { t: "cmp", l: 5170320000, r: 5172130000, ls: "51억 7032만", rs: "51억 7213만" }], { ok: "자리 수를 먼저 보고, 같으면 높은 자리부터 비교했어요." }) },
    { inst: "수의 크기를 비교하는 방법을 정리해요.", hints: ["381627 > 59240 (6자리 수 > 5자리 수)", "23475 < 23896 (백의 자리에서 4 < 8)"],
      render: (b, a) => blanks(b, a, ["자리 수가 다를 때에는 자리 수가 ", { o: ["많은", "적은"], a: 0 }, " 쪽이 더 큰 수예요. 자리 수가 같을 때에는 ", { o: ["높은", "낮은"], a: 0 }, " 자리 수부터 차례대로 비교하여 높은 자리 수가 ", { o: ["큰", "작은"], a: 0 }, " 쪽이 더 큰 수예요."]) },
    { inst: "우주 발사체 나로호, 누리호, 다누리호의 개발 비용이에요(출처: 한국항공우주연구원, 2023). 개발 비용이 많은 것부터 차례대로 눌러 보세요.", hints: ["‘수의 형태를 같게 보기’를 눌러 세 수를 같은 형태로 바꿔 봐요.", "누리호는 1조가 넘어요. 나로호와 다누리호는 천억의 자리 숫자를 비교해요."],
      render: (b, a) => n1Rank(b, a, { dir: "desc", convert: true, items: [
        { name: "나로호", show: "약 5025억 원 (우리나라 첫 우주 발사체)", v: "502500000000" },
        { name: "누리호", show: "약 1조 9572억 원 (우리나라 독자 기술로 만든 우주 발사체)", v: "1957200000000" },
        { name: "다누리호", show: "약 236700000000원 (우리나라 첫 달 탐사선)", v: "236700000000" }],
        ok: "누리호(1조 9572억) > 나로호(5025억) > 다누리호(2367억)예요. 형태를 같게 나타내고 자리 수부터 비교했어요." }) }
  ],
  challenge: { inst: "큰 수의 크기 비교를 더 해 보세요.", hints: ["19462700과 194□2700은 □ 자리(만의 자리)만 달라요.", "형태가 다른 수는 같은 형태로 바꾸어 비교해요."],
    render: (b, a) => n1Ask(b, a, [
      { q: "19462700 < 194□2700에서 □ 안에 들어갈 수 있는 수를 모두 고르세요.", t: "pick", o: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], a: [7, 8, 9], why: { "6,7,8,9": "6을 넣으면 두 수가 같아져요. 같은 수는 < 가 아니에요." } },
      { q: "작은 수부터 차례대로 쓴 것을 고르세요. ㉠ 290만  ㉡ 292000000  ㉢ 293000", t: "pick", o: ["㉢, ㉠, ㉡", "㉠, ㉡, ㉢", "㉢, ㉡, ㉠"], a: 0 },
      { q: "창덕궁 관람객 수예요(출처: 국가통계포털, 2023). 2020년 사십칠만 이천팔백칠십오 명, 2021년 643549명, 2022년 118만 6361명. 관람객이 가장 적었던 해는?", t: "pick", o: ["2020년", "2021년", "2022년"], a: 0 }], { ok: "□ 안의 수, 형태가 다른 수까지 비교했어요!" }) }
},
{
  id: "b9", no: 9, title: "생각을 더하다 ― 세계 여러 나라의 인구를 비교해 볼까요", soop: "탐구 정리하기(O)",
  question: "형태가 다른 큰 수의 크기를 어떻게 비교할까요?",
  summary: "수의 형태가 다르면 먼저 같은 형태로 바꾸어요. 그다음 자리 수를 비교하고, 자리 수가 같으면 높은 자리 수부터 차례대로 비교해요.",
  steps: [
    { name: "수로 쓰기", inst: "2022년 세계 여러 나라의 인구예요. 대한민국의 인구는 51630000명이에요. 중국, 인도, 필리핀의 인구를 0을 모두 써서 수로 나타내 보세요.", hints: ["14억 1218만 → 14 / 1218 / 0000", "십사억 천칠백십칠만 → 14억 1717만"],
      render: (b, a) => n1Ask(b, a, [
        { q: "중국 (14억 1218만 명)", fig: n1PopFig(), t: "num", a: 1412180000, digits: true, unit: "명" },
        { q: "인도 (십사억 천칠백십칠만 명)", t: "num", a: 1417170000, digits: true, unit: "명" },
        { q: "필리핀 (1억 1556만 명)", t: "num", a: 115560000, digits: true, unit: "명" }], { ok: "대한민국 51630000, 중국 1412180000, 인도 1417170000, 필리핀 115560000이에요." }) },
    { name: "차례 정하기", inst: "대한민국, 중국, 인도, 필리핀을 인구가 많은 나라부터 차례대로 눌러 보세요.", hints: ["먼저 자리 수를 비교해요. 중국과 인도는 10자리예요.", "중국과 인도는 백만의 자리 숫자 2와 7을 비교해요."],
      render: (b, a) => n1Rank(b, a, { dir: "desc", convert: true, items: N1_POP.filter(p => ["대한민국", "중국", "인도", "필리핀"].includes(p.name)), ok: "인도 > 중국 > 필리핀 > 대한민국이에요." }) },
    { name: "말해 보기", inst: "인구를 비교하며 알게 된 것을 말해 보세요.", hints: ["필리핀은 1억 1556만 명이에요.", "1412180000과 1417170000을 높은 자리부터 비교해요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "필리핀보다 인구가 많은 나라를 모두 고르세요.", t: "pick", o: ["대한민국", "중국", "인도"], a: [1, 2] },
        { q: "중국과 인도의 인구는 어느 자리에서 크기가 정해지나요?", t: "pick", o: ["십억의 자리", "억의 자리", "천만의 자리", "백만의 자리"], a: 3, why: { "2": "천만의 자리 숫자는 두 나라 모두 1이에요." } }], { ok: "자리 수가 같은 중국과 인도는 백만의 자리에서 2 < 7이라 인도의 인구가 더 많아요." }) },
    { name: "정리하기", inst: "형태가 다른 큰 수를 비교하는 방법을 정리해요.", hints: ["14억 1218만, 1412180000처럼 형태가 섞여 있으면 바로 비교하기 어려워요."],
      render: (b, a) => blanks(b, a, ["수의 형태가 다르면 먼저 ", { o: ["같은 형태로 바꾸어요", "앞자리 숫자만 비교해요"], a: 0 }, ". 그다음 ", { o: ["자리 수", "숫자 0의 개수"], a: 0 }, "를 비교하고, 자리 수가 같으면 ", { o: ["높은 자리", "일의 자리"], a: 0 }, " 수부터 차례대로 비교해요."]) },
    { name: "확인하기", inst: "프랑스, 카자흐스탄, 미국, 남아프리카 공화국, 호주, 브라질 중 3곳을 정하여, 인구가 적은 나라부터 차례대로 눌러 보세요.", hints: ["‘수의 형태를 같게 보기’로 세 나라의 인구를 같은 형태로 바꿔요.", "자리 수가 가장 적은 나라부터 찾아요."],
      render: (b, a) => n1Rank(b, a, { dir: "asc", k: 3, convert: true, items: N1_POP.filter(p => ["프랑스", "카자흐스탄", "미국", "남아프리카 공화국", "호주", "브라질"].includes(p.name)), ok: "세 나라를 인구가 적은 나라부터 바르게 늘어놓았어요. 어떻게 비교했는지 친구에게 설명해 봐요." }) }
  ],
  challenge: { inst: "이번에는 여섯 나라 모두를 인구가 적은 나라부터 차례대로 눌러 보세요.", hints: ["8자리 수인 나라와 9자리 수인 나라로 먼저 나누어요.", "8자리 수끼리는 천만의 자리부터 비교해요."],
    render: (b, a) => n1Rank(b, a, { dir: "asc", convert: true, items: N1_POP.filter(p => ["프랑스", "카자흐스탄", "미국", "남아프리카 공화국", "호주", "브라질"].includes(p.name)), ok: "카자흐스탄 < 호주 < 남아프리카 공화국 < 프랑스 < 브라질 < 미국이에요!" }) }
},
{
  id: "b10", no: 10, title: "놀이를 더하다 ― 도전! 연속된 세 칸을 먼저 색칠해요!", soop: "발표하기(P)",
  question: "수 카드 3장으로 가장 큰 수를 만들려면 어떻게 놓아야 할까요?",
  summary: "카드를 이어 붙여 가장 큰 수를 만들려면 숫자가 많은 카드를 모두 쓰고, 가장 높은 자리에 큰 숫자가 오도록 카드 차례를 정해요. 두 수는 자리 수부터 비교하고, 같으면 높은 자리부터 비교해요.",
  steps: [
    { name: "놀이 방법 알기", inst: "놀이 방법을 읽고 알맞은 것을 골라요. ① 수 카드 12장을 섞어 뒤집어 놓아요. ② 순서대로 카드를 3장 가져와 모두 사용하여 가장 큰 수를 만들어요. ③ 만든 수의 크기를 비교해요. ④ 더 큰 수를 만든 사람이 자기 카드 중 1장을 골라 놀이판에서 그 수를 찾아 한 칸만 색칠해요(이미 색칠된 칸은 안 돼요). ⑤ 연속된 세 칸을 먼저 색칠하는 사람이 이겨요.", hints: ["놀이 방법 ④, ⑤를 다시 읽어 봐요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "가져온 카드 3장으로 무엇을 하나요?", t: "pick", o: ["모두 사용하여 가장 큰 수를 만들어요", "가장 큰 카드 1장만 내요"], a: 0 },
        { q: "놀이판에 색칠할 수 있는 사람은?", t: "pick", o: ["더 큰 수를 만든 사람", "더 작은 수를 만든 사람", "두 사람 모두"], a: 0 },
        { q: "이미 색칠된 칸을 다시 색칠할 수 있나요?", t: "pick", o: ["있어요", "없어요"], a: 1 },
        { q: "놀이에서 이기는 사람은?", t: "pick", o: ["연속된 세 칸을 먼저 색칠한 사람", "가장 큰 카드를 가진 사람"], a: 0 }], { ok: "놀이 방법을 알았어요. 가장 큰 수 만들기부터 연습해요!" }) },
    { name: "가장 큰 수 만들기", inst: "카드 3장을 모두 사용하여 가장 큰 수를 만들어 보세요. 카드를 누른 차례대로 왼쪽부터 이어 붙어요.", hints: ["9와 93 중 무엇을 앞에 놓을지 두 가지로 놓아 보고 비교해요: 993과 939", "가장 높은 자리에 오는 숫자가 가장 크게 되도록 차례를 정해요."],
      render: (b, a) => n1Arrange(b, a, { sets: [["9", "93", "406"], ["8", "805", "25"], ["3", "370", "42"]], ok: "993406, 880525, 423703! 카드 차례를 바꾸어 보며 가장 큰 수를 찾았어요." }) },
    { name: "크기 비교하기", inst: "두 사람이 만든 수의 크기를 비교해 보세요. 표에서 크기가 정해지는 자리를 누르고 부등호를 골라요.", hints: ["먼저 자리 수를 세어 봐요.", "자리 수가 같으면 높은 자리부터 비교해요."],
      render: (b, a) => n1Compare(b, a, { cols: 7, pairs: [
        { a: 7406158, b: 93861, la: "예준(7, 406, 158)", lb: "친구(93, 61, 8)", ok: "7406158은 7자리, 93861은 5자리예요. 숫자 3개짜리 카드가 많으면 자리 수가 많아져요." },
        { a: 805423, b: 937025, la: "예준(805, 42, 3)", lb: "친구(370, 25, 9)", ok: "둘 다 6자리라 십만의 자리부터 비교했어요. 8 < 9라서 친구의 수가 더 커요." }] }) },
    { name: "놀이하기", inst: "컴퓨터와 놀이를 해 보세요. 카드를 받으면 가장 큰 수를 만들고, 두 수를 비교한 뒤, 이긴 사람이 놀이판에 색칠해요.", hints: ["놀이판에서 내 카드의 수가 적힌 칸 중, 이미 색칠한 내 칸과 이어지는 칸을 골라요.", "컴퓨터가 두 칸을 이었으면 남은 한 칸을 먼저 막아요."],
      render: (b, a) => n1Game(b, a, {}) },
    { name: "발표하기", inst: "놀이를 되돌아보고 친구에게 발표할 내용을 써 보세요.", render: (b, a) => writeStep(b, a, [
      { q: "카드 3장으로 가장 큰 수를 만들 때 어떻게 카드를 놓았나요?", tag: "방법", ph: "예: 숫자가 3개인 카드를 … / 맨 앞에 큰 숫자가 오도록 …" },
      { q: "연속된 세 칸을 먼저 색칠하기 위한 나의 전략은?", tag: "전략", ph: "예: 상대가 두 칸을 이으면 …" }]) }
  ],
  challenge: { inst: "놀이판을 보고 어느 칸을 색칠해야 할지 생각해 보세요. (파란색: 나, 빨간색: 상대)", hints: ["가로, 세로, 대각선으로 두 칸이 이어진 곳을 찾아요.", "남은 한 칸에 적힌 수가 내 카드에 있는지 살펴봐요."],
    render: (b, a) => n1Ask(b, a, [
      { q: "내가 이겨서 색칠할 차례예요. 내 카드는 61, 9, 158이에요. 이 판에서 바로 이기려면 어느 수를 색칠해야 하나요?", fig: () => h("div", { style: "max-width:30em" }, n1Fit(n1BoardSvg((() => { const c = Array(12).fill(null); c[4] = "me"; c[5] = "me"; c[2] = "cpu"; c[10] = "cpu"; return c; })()), "30vh")), t: "pick", o: ["61", "9", "158"], a: 0 },
      { q: "이번에도 내가 색칠할 차례예요. 내 카드는 42, 7, 406이에요. 상대가 이기지 못하게 막으려면 어느 수를 색칠해야 하나요?", fig: () => h("div", { style: "max-width:30em" }, n1Fit(n1BoardSvg((() => { const c = Array(12).fill(null); c[8] = "cpu"; c[9] = "cpu"; c[0] = "me"; c[7] = "me"; return c; })()), "30vh")), t: "pick", o: ["42", "7", "406"], a: 0 }], { ok: "이기는 칸과 막는 칸을 찾았어요. 놀이에서 전략으로 써 봐요!" }) }
},
{
  id: "b11", no: 11, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "큰 수를 읽고 쓰고, 뛰어 세고, 크기를 비교할 수 있나요?",
  summary: "만·억·조 단위의 큰 수를 네 자리씩 끊어 읽고 쓰고, 각 자리 숫자가 나타내는 값을 알고, 뛰어 세고, 크기를 비교하는 방법을 모두 확인했어요.",
  steps: [
    { name: "확인 1", inst: "만과 다섯 자리 수를 확인해요.", hints: ["10000은 9000보다 1000만큼 더 큰 수예요.", "10000이 8개 → 만의 자리 숫자 8"],
      render: (b, a) => n1Ask(b, a, [
        { q: "10000은 9000보다 □만큼 더 큰 수예요.", t: "num", a: 1000 },
        { q: "10000이 8개, 1000이 3개, 100이 4개, 10이 9개, 1이 2개인 수를 써 보세요.", t: "num", a: 83492 },
        { q: "위의 수를 읽어 보세요.", t: "read", a: 83492 }], { ok: "83492(8만 3492), 팔만 삼천사백구십이예요." }) },
    { name: "확인 2", inst: "큰 수를 쓰고 읽고, 숫자가 나타내는 값을 알아보세요. (예: 35만 – 350000 – 삼십오만)", hints: ["1089억 → 1089 / 0000 / 0000", "자릿값 표에서 숫자 8이 어느 자리에 있는지 봐요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "1089억을 0을 모두 써서 나타내 보세요.", t: "num", a: 108900000000, digits: true },
        { q: "268만(2680000)을 읽어 보세요.", t: "read", a: 2680000 },
        { q: "59804620000에서 숫자 8이 나타내는 값은?", fig: n1ChartFig("59804620000", 12, { hl: [8] }), t: "num", a: 800000000, why: { "80000000": "8은 억의 자리 숫자예요. 0의 개수를 다시 세어 봐요." } },
        { q: "8259107930000에서 숫자 8이 나타내는 값은?", fig: n1ChartFig("8259107930000", 13, { hl: [12] }), t: "num", a: 8000000000000 }], { ok: "같은 숫자 8이라도 억의 자리에서는 8억, 조의 자리에서는 8조를 나타내요." }) },
    { name: "확인 3", inst: "뛰어 세기를 하고, 두 수의 크기를 비교해 보세요.", hints: ["506억과 546억 사이에 한 칸이 비어 있어요. 두 번 뛰어 40억이 커졌어요.", "자리 수부터 비교해요."],
      render: (b, a) => n1Ask(b, a, [
        { t: "line", parts: ["506억, ", { a: 52600000000, show: "526억" }, ", 546억, 566억, ", { a: 58600000000, show: "586억" }] },
        { t: "line", parts: ["82570000, 83570000, ", { a: 84570000 }, ", 85570000, ", { a: 86570000 }] },
        { t: "cmp", l: 932800, r: 1263840 },
        { t: "cmp", l: 72648392800, r: 72503840510 }], { ok: "20억씩, 1000000씩 뛰어 세었고, 자리 수와 높은 자리부터 비교했어요." }) },
    { name: "확인 4", inst: "2020년 나라별 등록된 자동차 수예요(출처: 국가통계포털, 2023). 대한민국 24365979대, 미국 2억 8903만 7000대, 스위스 ㉠ 오백이십칠만 사천사백칠십삼 대, 이집트 7162200대.", hints: ["미국은 289037000대예요.", "이집트는 7자리 수예요. 7자리 수끼리는 높은 자리부터 비교해요."],
      render: (b, a) => n1Ask(b, a, [
        { q: "㉠을 수로 써 보세요.", t: "num", a: 5274473, unit: "대" },
        { q: "이집트보다 등록된 자동차 수가 많은 나라를 모두 고르세요.", t: "pick", o: ["대한민국", "미국", "스위스"], a: [0, 1], why: { "0,1,2": "스위스(5274473)와 이집트(7162200)는 자리 수가 같아요. 백만의 자리 5와 7을 비교해요." } }], { ok: "대한민국과 미국은 자리 수가 많아서, 스위스는 백만의 자리 숫자가 작아서 이렇게 정해졌어요." }) },
    { name: "확인 5", inst: "1부터 5까지의 수를 한 번씩 모두 사용하여 세 친구의 설명에 맞는 다섯 자리 수를 만들어 보세요. 민우: 5만보다 큰 수야. 유주: 천의 자리 숫자가 4, 백의 자리 숫자가 2인 수야. 나은: 일의 자리 숫자가 가장 작아.", hints: ["5만보다 크려면 만의 자리 숫자가 5여야 해요.", "일의 자리에는 가장 작은 수 1, 남은 3은 십의 자리예요."],
      render: (b, a) => n1Cards(b, a, { cards: [1, 2, 3, 4, 5], target: "54231", words: ["만의 자리", "천의 자리", "일의 자리"], rules: [
        { t: "민우: 5만보다 큰 수", f: s => Number(s) > 50000, why: "5만보다 크려면 만의 자리 숫자가 5여야 해요." },
        { t: "유주: 천의 자리 숫자가 4, 백의 자리 숫자가 2", f: s => s[1] === "4" && s[2] === "2", why: "천의 자리(왼쪽에서 두 번째)에 4, 백의 자리에 2를 놓아요." },
        { t: "나은: 일의 자리 숫자가 가장 작음", f: s => s[4] === "1", why: "1부터 5 중 가장 작은 수는 1이에요. 일의 자리에 놓아요." }], ok: "세 친구의 설명을 모두 만족하는 수를 찾았어요!" }) }
  ],
  challenge: { name: "꼭꼭", inst: "□ 안에 알맞은 수를 구하여 실 전화기를 따라 내려가 보세요.", hints: ["100만이 100개 → 100만의 100배", "41조에서 3조씩 두 번 → 44조, 47조"],
    render: (b, a) => n1Ask(b, a, [
      { q: "100만이 100개인 수는 □억이에요.", t: "num", a: 1, unit: "억", why: { "100": "100만이 100개이면 100000000이에요. 몇 억인가요?" } },
      { q: "10000은 9980보다 □만큼 더 큰 수예요.", t: "num", a: 20 },
      { q: "17062845에서 7000000을 나타내는 숫자를 써 보세요.", t: "num", a: 7 },
      { q: "41조에서 3조씩 두 번 뛰어 세면 □조예요.", t: "num", a: 47, unit: "조" }], { ok: "큰 수 단원을 모두 마쳤어요! 다음 시간에는 각도를 공부해요." }) }
}];
