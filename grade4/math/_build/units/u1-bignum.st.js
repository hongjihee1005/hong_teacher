//@@APP
const APP={title:"우주 탐험대 큰 수 일지", unit:"4-1 수학 1. 큰 수", key:"s41-bignum-v1", welcome:"4학년 3반 우주 탐험대 교실에 온 것을 환영해요", intro:"우리 반이 우주 탐험대가 되어 우주 과학관 견학을 준비해요. 견학비, 관람객 수, 달·태양·행성까지의 거리 속 큰 수를 읽고 쓰고, 뛰어 세고, 크기를 비교해요."};
//@@UNIT
/* 4-1 수학 1. 큰 수 · 이야기 버전(홍지희 선생님 버전) — 수 읽기·쓰기 도우미와 그림은 교과서 버전(u1-bignum.tb.js)에서 옮겨 옴 */
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

/* ===================================================================
   이야기 버전 부품 (앞글자 n1s) — 교과서 버전 n1 부품을 옮겨 와
   '확인하기' 단추 없이 autoRun으로 저절로 확인하게 고침.
   기다리는 시간: 입력칸 900ms(Enter는 blur) · 보기 고르기 260ms · 카드 놓기·돈 놓기 1200ms
   안쪽 함수(…In)는 매개변수 이름을 (el, ap)로 써서 여러 활동 세기(hj-multi)에 잡히지 않게 하고,
   바깥 함수(body, api)만 계단의 활동으로 셉니다.
   =================================================================== */
/* autoRun 하나를 쓰되, 부를 때마다 기다리는 시간을 정할 수 있게 함 */
function n1sKick(ready, sign, run) {
  const go = autoRun(ready, sign, run, 0); let t = null;
  return w => { clearTimeout(t); t = setTimeout(go, w == null ? 260 : w); };
}
/* 입력칸 지켜보기: 쓰는 동안 900ms, 한글 조합 중에는 기다림, Enter·칸 나가기·2.6초 멈춤이면 '다 썼다'로 봄 */
function n1sWatch(inp, kick, st) {
  let slow = null;
  const touch = () => { st.commit = false; clearTimeout(slow); slow = setTimeout(() => { if (inp.value.trim()) { st.commit = true; kick(0); } }, 2600); };
  inp.addEventListener("input", e => { touch(); if (e.isComposing) return; kick(900); });
  inp.addEventListener("compositionend", () => kick(900));
  inp.addEventListener("change", () => { clearTimeout(slow); if (inp.value.trim()) st.commit = true; kick(200); });
  inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); inp.blur(); } });
}
/* 숫자 칸이 다 쓰였는지: 답의 자리 수만큼 썼거나, 다 썼다고 보일 때 */
function n1sFull(raw, want, st, digits) {
  const s = String(raw || "").trim(); if (!s) return false;
  if (st.commit) return true;
  const v = n1Parse(s, { digits });
  /* ‘8조 2500억’처럼 만·억·조를 섞어 쓰는 중이면(‘8조’까지만 써도 자리 수가 같아짐) 맞는 답이거나 다 썼을 때만 확인 */
  if (/[만억조]/.test(s) && v !== n1S(want)) return false;
  return v !== null && v.length >= n1S(want).length;
}

/* ---------- 묻기 모음 (교과서 n1Ask를 저절로 확인으로) ----------
   t:"num" 수 쓰기(a, digits, kb, unit, show) · t:"read" 읽는 말 쓰기 · t:"pick" 고르기(o, a: 번호|[번호…], why)
   t:"cmp" 두 수 비교(l, r, ls, rs) · t:"line" 빈칸 채우기(parts) */
function n1sAskIn(el, ap, items, opts = {}) {
  const wrap = h("div"), rows = []; let kick = null;
  const K = w => kick && kick(w);
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
        b.onclick = () => {
          [...line.children].forEach(x => x.classList.remove("good", "bad"));
          if (multi) { sel.has(oi) ? sel.delete(oi) : sel.add(oi); b.classList.toggle("on"); } else { sel.clear(); sel.add(oi); [...line.children].forEach(x => x.classList.remove("on")); b.classList.add("on"); }
          K(260);
        };
        line.append(b);
      });
      box.append(line);
      const get = () => [...sel].sort((a, b) => a - b);
      row.ready = () => sel.size >= (multi ? it.a.length : 1);
      row.ok = () => { const v = get(), w = (multi ? it.a : [it.a]).slice().sort((a, b) => a - b); return v.length === w.length && w.every((x, i) => x === v[i]); };
      row.show = g => [...line.children].forEach((b, i) => { b.classList.remove("good", "bad"); if (sel.has(i)) b.classList.add(g ? "good" : "bad"); });
      row.val = () => get().map(i => n1T(it.o[i])).join("·") || "-";
      row.key = () => get().join(","); row.sig = row.key;
    } else if (it.t === "cmp") {
      const want = n1Cmp(it.l, it.r); let v = null;
      const signs = h("span", { class: "slot" });
      [">", "=", "<"].forEach(sg => signs.append(h("button", { class: "opt", style: "font-size:1.2em;min-width:2.2em;text-align:center", onclick: e => { [...signs.children].forEach(b => b.classList.remove("on", "good", "bad")); e.currentTarget.classList.add("on"); v = sg; K(260); } }, sg)));
      box.append(h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.5em;font-size:1.15em;margin-top:.3em;" + N1_WRAP },
        h("b", { class: "jua" }, n1T(it.ls || it.l)), signs, h("b", { class: "jua" }, n1T(it.rs || it.r))));
      row.ready = () => v != null;
      row.ok = () => v === want;
      row.show = g => [...signs.children].forEach(b => { b.classList.remove("good", "bad"); if (b.classList.contains("on")) b.classList.add(g ? "good" : "bad"); });
      row.val = () => v || "-"; row.key = () => v || ""; row.sig = row.key;
    } else if (it.t === "read") {
      const inp = n1Inp("min(100%,22em)", "읽는 말", "text"), st = { commit: false };
      const minLen = Math.min(...[...n1ReadSet(it.a)].map(s => s.length));
      box.append(h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em" }, h("span", {}, it.pre || "읽기: "), inp));
      n1sWatch(inp, K, st);
      row.ready = () => { const v = inp.value.replace(/[\s,]/g, ""); return !!v && (st.commit || v.length >= minLen); };
      row.ok = () => n1JudgeRead(inp.value, it.a).ok;
      row.msg = () => n1JudgeRead(inp.value, it.a).msg;
      row.show = g => inp.style.borderColor = g ? "var(--ok)" : "var(--no)";
      row.val = () => inp.value.trim() || "-"; row.key = () => inp.value.replace(/\s/g, ""); row.sig = row.key;
    } else if (it.t === "line") {
      const ins = [], line = h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.35em;font-size:1.12em;line-height:2;" + N1_WRAP });
      it.parts.forEach(p => {
        if (typeof p === "string") line.append(h("span", { class: "jua" }, p));
        else { const len = (p.show || n1S(p.a)).length; const inp = n1Inp(`${Math.max(4, Math.min(16, len + 1.5))}em`, "빈칸", p.show || it.kb ? "text" : "numeric"); const st = { commit: false }; n1sWatch(inp, K, st); ins.push({ inp, p, st }); line.append(inp); }
      });
      box.append(line);
      const good = x => { const v = n1Parse(x.inp.value, { digits: x.p.digits }); return v !== null && v === n1S(x.p.a); };
      row.ready = () => ins.every(x => n1sFull(x.inp.value, x.p.a, x.st));
      row.ok = () => ins.every(good);
      row.show = () => ins.forEach(x => x.inp.style.borderColor = good(x) ? "var(--ok)" : "var(--no)");
      row.val = () => ins.map(x => x.inp.value.trim() || "-").join(", ");
      row.key = () => ins.map(x => n1Parse(x.inp.value) || "").join(",");
      row.sig = () => ins.map(x => x.inp.value.replace(/\s/g, "")).join(",");
      row.msg = () => { const b = ins.find(x => !good(x)); if (!b) return null; if (n1Parse(b.inp.value) === null) return "수를 숫자로 써요. ‘30만’처럼 만·억·조를 섞어 써도 돼요."; const g = n1Parse(b.inp.value), w = n1S(b.p.a); if (g.replace(/0+$/, "") === w.replace(/0+$/, "")) return "숫자는 맞게 썼는데 0의 개수가 달라요. 일의 자리부터 네 자리씩 끊어 다시 세어 봐요."; return null; };
    } else {
      const s = it.show || n1S(it.a), st = { commit: false };
      const inp = n1Inp(`${Math.max(5, Math.min(17, s.length + 2))}em`, n1T(it.q || "답"), it.kb || (/[만억조]/.test(s) ? "text" : "numeric"));
      box.append(h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em" }, h("span", {}, it.pre || "답: "), inp, it.unit ? h("span", {}, it.unit) : null));
      n1sWatch(inp, K, st);
      const pv = () => n1Parse(inp.value, { digits: it.digits });
      row.ready = () => n1sFull(inp.value, it.a, st);
      row.ok = () => pv() === n1S(it.a);
      row.show = g => inp.style.borderColor = g ? "var(--ok)" : "var(--no)";
      row.val = () => inp.value.trim() || "-"; row.key = () => pv() || "";
      row.sig = () => inp.value.replace(/\s/g, "");
      row.msg = () => {
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
  ap.provide && ap.provide({
    words: opts.words || items.filter(it => it.t === "pick").map(ansOf),
    answers: items.map((it, qi) => `${items.length > 1 ? (qi + 1) + ") " : ""}${ansOf(it)}`)
  });
  const judge = () => {
    ap.tryOnce();
    let all = true; rows.forEach(r => { const g = r.ok(); r.show(g); if (!g) all = false; });
    const given = rows.map(r => r.val()).join(" / ");
    if (all) { ap.done(given, opts.ok); return true; }
    const bad = rows.find(r => !r.ok());
    const why = bad.it.why && bad.it.why[bad.key()];
    ap.fail(why || (bad.msg && bad.msg()) || opts.bad || "빨간 칸을 다시 살펴봐요. 자리를 하나씩 짚으며 차근차근 생각해 봐요.", given);
    return false;
  };
  kick = n1sKick(() => rows.every(r => r.ready()), () => rows.map(r => r.sig()).join("\u0001"), judge);
  el.append(wrap);
}
function n1sAsk(body, api, items, opts) { return n1sAskIn(body, Object.assign({}, api, { done: (a, m) => api.done(a, m) }), items, opts); }

/* ---------- 자릿값 표에 숫자 카드 놓기 (opt.value, opt.cols, opt.say, opt.group, opt.note) ---------- */
function n1sChart(body, api, opt) {
  const cols = opt.cols, target = n1S(opt.value), CW = 64, HH = 40, RH = 78, full = cols <= 5, GH = full ? 0 : 34;
  const CARD = 60, CG = 8, nCard = 11, cardsW = nCard * CARD + (nCard - 1) * CG, X0 = 20;
  const W = Math.max(cols * CW, cardsW) + 2 * X0, chartX = (W - cols * CW) / 2, cardY = 10 + HH + RH + GH + 44;
  const H = cardY + CARD + 14;
  const svg = makeSvg(W, H);
  const cells = Array(cols).fill(null);
  let selc = Math.max(0, cols - target.length), locked = false;
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
  let kick = null;
  function put(c, d) {
    if (locked || c == null || c < 0 || c >= cols) return;
    cells[c] = d === 10 ? null : d;
    if (d !== 10 && c < cols - 1) selc = c + 1; else selc = c;
    drawCells(); show(); kick(1200);
  }
  function show() { const s = cells.map(v => v == null ? "" : v).join(""); out.innerHTML = s ? `표의 수: <b>${n1Esc(s)}</b>` : "표가 비어 있어요."; }
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
  const judge = () => {
    api.tryOnce();
    const first = cells.findIndex(v => v != null);
    const s = cells.map(v => v == null ? "_" : v).join("").replace(/^_+/, "");
    if (s.includes("_")) { drawCells(cells.map((v, c) => c > first && v == null ? c : -1).filter(c => c >= 0)); api.fail("수의 중간에 빈칸이 있어요. 숫자가 0인 자리에는 0 카드를 놓아요.", s); return false; }
    if (cells[first] === 0) { drawCells([first]); api.fail("가장 높은 자리에는 0을 놓지 않아요.", s); return false; }
    const tp = target.padStart(cols, "_"), bad = [];
    for (let c = 0; c < cols; c++) { const v = cells[c] == null ? "_" : String(cells[c]); if (v !== tp[c]) bad.push(c); }
    if (!bad.length) {
      locked = true; drawCells();
      info.innerHTML = n1Parts(target).map(pt => `<div>${pt[0]} → ${n1Place(pt.length - 1)} → <b>${pt}</b></div>`).join("")
        + `<div style="margin-top:.3em">${target} = ${n1Parts(target).join(" + ")}</div>` + (opt.note ? `<div style="margin-top:.3em;color:#B4610F">${n1R(opt.note)}</div>` : "");
      api.done(s, opt.ok || "자릿값 표에 바르게 나타냈어요. 각 자리 숫자가 나타내는 값을 살펴봐요.");
      return true;
    }
    drawCells(bad);
    if (s.length !== target.length) { api.fail(`지금 수는 ${s.length}자리예요. ${target.length}자리 수가 되도록 일의 자리부터 맞추어 놓아 봐요.`, s); return false; }
    api.fail(`${n1Place(ex(bad[0]))} 숫자를 다시 봐요. 일의 자리부터 네 자리씩 끊어 살펴봐요.`, s); return false;
  };
  kick = n1sKick(() => cells.filter(v => v != null).length >= target.length, () => cells.map(v => v == null ? "_" : v).join(""), judge);
  drawCells(); show();
  api.provide({ words: opt.words || ["일의 자리부터 네 자리씩", "천, 백, 십, 일", "0인 자리에도 0을 써요"], answers: [target] });
  body.append(opt.say ? n1H("p", { class: "jua", style: "font-size:1.15em;" + N1_WRAP }, opt.say) : "", wrap, out, info,
    h("div", { class: "actions" }, h("button", { class: "ghost", onclick: () => { if (locked) return; cells.fill(null); selc = Math.max(0, cols - target.length); info.innerHTML = ""; drawCells(); show(); } }, "모두 지우기")));
}

/* ---------- 돈 모형 (지폐·동전·묶음) ----------
   opt.denoms 큰 것부터, opt.targets [{v, need, needMsg, say, ok}], opt.bundle 10개 묶기, opt.addable, opt.steps {액면:[1,10]}, opt.fewest, opt.resetEach
   금액이 목표와 같아지거나 넘으면 1.2초 뒤 저절로 확인해요. 금액은 맞고 놓은 모양만 다르면 '틀림'으로 세지 않고 안내만 해요. */
const N1_MONEY = {
  1: { k: "coin", t: "1", c: "#D8B26A" }, 10: { k: "coin", t: "10", c: "#E3A35F" }, 100: { k: "coin", t: "100", c: "#C9CDD0" }, 500: { k: "coin", t: "500", c: "#D4D7DA" },
  1000: { k: "bill", t: "1000", c: "#A9CFE8" }, 10000: { k: "bill", t: "10000", c: "#BFE1B0" },
  100000: { k: "bundle", t: "10만", c: "#BFE1B0" }, 1000000: { k: "box", t: "100만", c: "#F3D9A4" }, 10000000: { k: "box", t: "1000만", c: "#F2B9A0" }
};
function n1MoneyName(d) { return { 1: "1원짜리 동전", 10: "10원짜리 동전", 100: "100원짜리 동전", 500: "500원짜리 동전", 1000: "1000원짜리 지폐", 10000: "10000원짜리 지폐", 100000: "10만 원 묶음", 1000000: "100만 원 묶음", 10000000: "1000만 원 묶음" }[d]; }
function n1MoneyUnit(d) { return N1_MONEY[d].k === "coin" ? "개" : N1_MONEY[d].k === "bill" ? "장" : "묶음"; }
function n1sMoney(body, api, opt) {
  const D = opt.denoms, cnt = {}; D.forEach(d => cnt[d] = 0);
  let ti = 0, fin = false, kick = null;
  const CW = 180, W = D.length * CW + 20, H = 250;
  const svg = makeSvg(W, H);
  const say = h("p", { class: "jua", style: "font-size:1.15em;" + N1_WRAP });
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
  const act = () => { draw(); kick(1200); };
  const steps = opt.steps || {};
  const tools = D.map((d, i) => {
    const row = h("div", { class: "tools" }, h("span", { style: "min-width:8.5em" }, n1MoneyName(d)));
    const can = !opt.addable || opt.addable.includes(d);
    if (can) (steps[d] || [1]).forEach(s => row.append(h("button", { onclick: () => { if (fin) return; cnt[d] += s; act(); } }, `+${s}`)));
    if (can) row.append(h("button", { onclick: () => { if (fin) return; cnt[d] = Math.max(0, cnt[d] - 1); act(); } }, "−1"));
    const up = i > 0 && D[i - 1] === d * 10 ? D[i - 1] : null;
    const bb = up && opt.bundle ? h("button", { style: "font-weight:700", onclick: () => { if (fin || cnt[d] < 10) return; cnt[d] -= 10; cnt[up] += 1; act(); } }, `10${n1MoneyUnit(d) === "묶음" ? "개" : n1MoneyUnit(d)} 묶기 → ${N1_MONEY[up].t}${/만$/.test(N1_MONEY[up].t) ? " 원" : "원"}`) : null;
    if (bb) row.append(bb);
    row.upd = () => { if (bb) bb.disabled = cnt[d] < 10; };
    return row;
  });
  function setT() { const t = opt.targets[ti]; say.innerHTML = n1R(t.say || `${t.v}원을 만들어 보세요.`); }
  const judge = () => {
    const t = opt.targets[ti], tt = total(), v = BigInt(n1S(t.v)), ans = `${tt}원 (` + D.filter(d => cnt[d]).map(d => `${d}원×${cnt[d]}`).join(", ") + ")";
    if (tt > v) { api.tryOnce(); api.fail(`지금 ${tt}원이에요. ${(tt - v).toString()}원이 넘었어요. −1 단추로 줄여 봐요.`, ans); return false; }
    let need = t.need;
    if (opt.fewest) { need = {}; let r = v; D.forEach(d => { need[d] = Number(r / BigInt(d)); r %= BigInt(d); }); }
    if (need) {
      const wrong = D.find(d => (need[d] || 0) !== cnt[d]);
      if (wrong != null) { api.hint(t.needMsg || (opt.fewest ? `모두 ${tt}원, 금액은 맞아요! 이번에는 큰 돈부터 써서 지폐와 동전의 수가 가장 적게 만들어 봐요.` : `금액은 맞아요! ${n1J(n1MoneyName(wrong), "을/를")} ${need[wrong] || 0}${n1MoneyUnit(wrong)} 쓰도록 바꿔 봐요.`)); return false; }
    }
    api.tryOnce();
    if (ti < opt.targets.length - 1) {
      ti++; if (opt.resetEach) D.forEach(d => cnt[d] = 0); setT(); draw();
      api.hint("○ " + (t.ok || "맞아요!") + " 이어서 다음 것도 해 봐요.");
      return false;
    }
    fin = true; api.done(ans, t.ok || opt.ok); return true;
  };
  kick = n1sKick(() => total() >= BigInt(n1S(opt.targets[ti].v)), () => ti + ":" + D.map(d => cnt[d]).join(","), judge);
  setT(); draw();
  api.provide({ words: opt.words || ["1000이 10개", "10000", "만"], answers: [] });
  body.append(say, h("div", { class: "panel" }, h("div", { class: "stage" }, n1Fit(svg, "42vh")), h("div", { class: "side" }, out, tbl, ...tools,
    h("p", { class: "inst", style: "margin-top:.4em" }, "목표 금액이 되면 저절로 확인해요."))));
}

/* ---------- 수직선 확대하기 (10000은 얼마만큼의 수) ---------- */
function n1sZoom(body, api, opt) {
  const L = opt.levels; let lv = 0, solved = false, fin = false;
  const W = 900, H = 190, svg = makeSvg(W, H);
  const q = h("div", { class: "jua", style: "font-size:1.15em;display:flex;flex-wrap:wrap;align-items:center;gap:.4em" });
  const inp = n1Inp("6em", "얼마만큼 더 큰 수"), st = { commit: false };
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
    inp.disabled = solved;
    tip.textContent = solved ? (lv < L.length - 1 ? `맞아요! 이제 ${n1J(String(10000 - step), "과/와")} 10000 사이(주황 칸)를 눌러 더 크게 봐요.` : "") : "수직선의 눈금 한 칸이 얼마인지 보고 빈칸을 채워요.";
  }
  const judge = () => {
    if (fin || solved) return false; api.tryOnce();
    const s = L[lv].step, v = n1Parse(inp.value);
    if (v !== String(s)) { inp.style.borderColor = "var(--no)"; api.fail(v === String(10000 - s) ? `${n1J(String(10000 - s), "은/는")} 바로 앞 눈금의 수예요. 두 눈금 사이가 얼마인지 생각해요.` : "10000 바로 앞 눈금에서 10000까지 한 칸이 얼마인지 봐요.", inp.value); return false; }
    inp.style.borderColor = "var(--ok)";
    if (lv === L.length - 1) { fin = true; api.done("1000, 100, 10, 1", opt.ok); return true; }
    solved = true; draw(); api.hint("○ 맞아요! 주황 칸을 눌러 수직선을 크게 봐요."); return false;
  };
  const kick = n1sKick(() => !!inp.value.trim() && !solved && !fin && (st.commit || (n1Parse(inp.value) || "").length >= String(L[lv].step).length), () => lv + ":" + inp.value.trim(), judge);
  n1sWatch(inp, kick, st);
  draw();
  api.provide({ words: ["1000", "100", "10", "1"], answers: ["1000, 100, 10, 1"] });
  body.append(n1Fit(svg, "36vh"), q, tip);
}

/* ---------- 10배씩 (10개 모으기) → 끝까지 모으면 묻기가 열림 ---------- */
function n1sTimes(body, api, opt) {
  let vals = [n1S(opt.start)];
  const W = 980, svg = makeSvg(W, 170);
  const chartBox = h("div", { style: "max-width:60em" });
  const btn = h("button", { class: "big", style: "background:#2F6B57;box-shadow:0 4px 0 #1E4A3B" }, "10개 모으기 ×10");
  const askBox = h("div", { style: "display:none" });
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
    if (vals.length > opt.times) askBox.style.display = "";
  }
  btn.onclick = () => { if (vals.length > opt.times) return; vals.push((BigInt(vals[vals.length - 1]) * 10n).toString()); draw(); if (vals.length > opt.times) api.hint("끝까지 모았어요! 아래 물음에 답해 봐요."); };
  n1sAskIn(askBox, api, opt.ask, { ok: opt.ok });
  draw();
  body.append(n1Fit(svg, "26vh"), h("div", { class: "tools", style: "margin:.4em 0" }, btn), chartBox, askBox);
}

/* ---------- 뛰어 세기 (수직선 위에서 뛰기) — 뛰기 자체가 활동이라 '한 번 뛰기' 단추는 남김 ----------
   opt.tasks [{start, step, n, say, why, ok}] 정해진 만큼, opt.free {start, n, choices, places} 내가 정해서 */
function n1sHop(body, api, opt) {
  const tasks = opt.tasks || [Object.assign({ free: true }, opt.free)];
  let ti = 0, seq, pick = null, fin = false;
  const W = 960, H = 200, svg = makeSvg(W, H);
  const say = h("p", { class: "jua", style: "font-size:1.15em;" + N1_WRAP });
  const chips = h("div", { class: "opts" });
  const readout = h("div", { class: "readout", style: "font-size:1.05em;" + N1_WRAP });
  const after = h("div");
  const hopBtn = h("button", { class: "big", style: "background:#2B7BD6;box-shadow:0 4px 0 #1B5AA3" }, "한 번 뛰기 ↷");
  const fmt = v => opt.digits ? n1S(v) : n1Mix(v);
  function setT() {
    const t = tasks[ti]; seq = [n1S(t.start)]; pick = null;
    say.innerHTML = n1R(t.say || opt.say || `${fmt(t.start)}부터 뛰어 세어 보세요.`);
    chips.innerHTML = "";
    (t.choices || opt.choices).forEach(c => chips.append(h("button", { class: "opt", onclick: e => { if (seq.length > 1) return api.hint("이미 뛰기 시작했어요. 바꾸려면 ‘다시’를 눌러요."); [...chips.children].forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); pick = n1S(c); } }, `${fmt(c)}씩`)));
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
      svg.append(v ? txt(xs(k), 172, fmt(v), opt.digits ? 19 : 22, { fill: k === seq.length - 1 ? "#B4610F" : INK }) : txt(xs(k), 172, "?", 24, { fill: "#9AA5A1" }));
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
    const e = n1S(pick).length - 1, names = opt.free.places || [7, 8, 9, 10, 11];
    after.append(h("p", { class: "jua" }, `${fmt(pick)}씩 뛰어 세었더니 어느 자리 숫자가 커졌나요?`));
    n1sAskIn(after, Object.assign({}, api, { done: (a, m) => { fin = true; api.done(`${fmt(pick)}씩: ${seq.map(fmt).join(", ")} / ${a}`, m); } }),
      [{ t: "pick", o: names.map(k => n1Place(k)), a: names.indexOf(e) }], { ok: `맞아요! ${fmt(pick)}씩 뛰어 세면 ${n1Place(e)} 숫자가 ${n1S(pick)[0]}씩 커져요. ${opt.friend || ""}` });
  }
  setT();
  api.provide({ words: opt.words || ["어느 자리 숫자가 변하는지", "얼마씩"], answers: [] });
  body.append(say, chips, n1Fit(svg, "34vh"), h("div", { class: "tools", style: "margin:.4em 0" }, hopBtn, h("button", { class: "ghost", onclick: () => { if (fin) return; after.innerHTML = ""; setT(); } }, "다시")), readout, after);
}

/* ---------- 두 수 비교 (자릿값 표에서 크기가 정해지는 자리 누르기 → 부등호) ----------
   opt.pairs [{a, b, la, lb, unit, say, ok}] — 자리와 부등호를 다 고르면 저절로 확인 */
function n1sCompare(body, api, opt) {
  let pi = 0, col = null, sign = null, fin = false, kick = null;
  const stage = h("div", { style: "max-width:66em" }), q = h("p", { class: "jua", style: "font-size:1.12em;" + N1_WRAP });
  const step1 = h("p", { class: "inst" }, "① 두 수의 크기가 정해지는 자리(세로 칸)를 표에서 눌러요. ② 그다음 >, =, < 중 하나를 골라요.");
  const signs = h("span", { class: "slot" });
  const line = h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.5em;font-size:1.15em;" + N1_WRAP });
  const res = h("div", { class: "readout", style: "font-size:1.02em;" + N1_WRAP });
  const P = () => opt.pairs[pi];
  const decide = () => { const a = n1S(P().a), b = n1S(P().b); if (a.length !== b.length) return Math.max(a.length, b.length) - 1; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a.length - 1 - i; return -1; };
  function draw() {
    const p = P(), a = n1S(p.a), b = n1S(p.b), cols = opt.cols || Math.max(a.length, b.length);
    const svg = n1ChartSvg({ cols, full: true, rows: [{ label: p.la, v: a, color: "#1E5FA8" }, { label: p.lb, v: b, color: "#A8321E" }], hl: col == null ? [] : [col], lw: 150, rh: 60 });
    svg.style.cursor = "pointer";
    svg.addEventListener("click", ev => { if (fin) return; const pt = svgPt(svg, ev); const c = Math.floor((pt.x - svg._X0) / svg._CW); if (c >= 0 && c < cols) { col = cols - 1 - c; draw(); kick(260); } });
    stage.innerHTML = ""; stage.append(n1Fit(svg, "40vh"));
    q.innerHTML = n1R(p.say || `${p.la}: **${a}**${p.unit || ""}, ${p.lb}: **${b}**${p.unit || ""}`);
    line.innerHTML = ""; signs.innerHTML = "";
    [">", "=", "<"].forEach(sg => signs.append(h("button", { class: "opt" + (sign === sg ? " on" : ""), style: "font-size:1.2em;min-width:2.2em;text-align:center", onclick: () => { if (fin) return; sign = sg; draw(); kick(260); } }, sg)));
    line.append(h("span", {}, "② "), h("b", { class: "jua", style: "color:#1E5FA8" }, a), signs, h("b", { class: "jua", style: "color:#A8321E" }, b));
    res.innerHTML = `${p.la}: ${a.length}자리 수 · ${p.lb}: ${b.length}자리 수` + (col != null ? `<br>고른 자리: <b>${n1Place(col)}</b>` : "");
  }
  const judge = () => {
    if (fin) return false; api.tryOnce();
    const p = P(), a = n1S(p.a), b = n1S(p.b), d = decide(), want = n1Cmp(a, b), ans = `${n1Place(col)} / ${a} ${sign} ${b}`;
    if (col !== d) {
      if (a.length !== b.length) { api.fail(`두 수의 자리 수가 달라요(${a.length}자리, ${b.length}자리). 자리 수가 많은 수의 맨 앞 자리, ${n1Place(d)}를 눌러 봐요.`, ans); return false; }
      if (col > d) { api.fail(col >= a.length ? `두 수 모두 ${n1Place(col)}에는 숫자가 없어요. 두 수의 가장 높은 자리부터 비교해요.` : `${n1Place(col)} 숫자는 두 수가 같아요. 같으면 바로 다음 자리로 내려가 비교해요.`, ans); return false; }
      api.fail("그보다 높은 자리에서 이미 숫자가 달라요. 가장 높은 자리부터 차례대로 비교해요.", ans); return false;
    }
    if (sign !== want) { api.fail(a.length !== b.length ? "자리 수가 많은 쪽이 더 큰 수예요. 입이 벌어진 쪽이 큰 수를 향해요." : `${n1Place(d)} 숫자를 비교해요. ${n1J(a[a.length - 1 - d], "과/와")} ${b[b.length - 1 - d]} 중 어느 것이 더 큰가요?`, ans); return false; }
    if (pi < opt.pairs.length - 1) { pi++; col = null; sign = null; draw(); api.hint("○ " + (p.ok || "맞아요!") + " 다음 두 수도 비교해 봐요."); return false; }
    fin = true; api.done(ans, p.ok || opt.ok); return true;
  };
  kick = n1sKick(() => col != null && sign != null && !fin, () => pi + ":" + col + ":" + sign, judge);
  draw();
  api.provide({ words: ["자리 수가 많은 쪽이 더 큰 수", "높은 자리 수부터 차례대로"], answers: opt.pairs.map(p => `${n1S(p.a)} ${n1Cmp(p.a, p.b)} ${n1S(p.b)}`) });
  body.append(q, stage, step1, res, line);
}

/* ---------- 차례대로 늘어놓기 (opt.items [{name, show, v}], opt.dir "desc"|"asc", opt.k, opt.convert) — 다 고르면 저절로 확인 ---------- */
function n1sRank(body, api, opt) {
  const items = opt.items, k = opt.k || items.length; let picked = [], conv = false, fin = false, kick = null;
  const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(13em,1fr));gap:.6em;margin:.5em 0" });
  const show = h("div", { class: "readout", style: "font-size:1.05em;" + N1_WRAP });
  function draw() {
    grid.innerHTML = "";
    items.forEach((it, i) => {
      const pos = picked.indexOf(i);
      const b = h("button", { class: "opt" + (pos >= 0 ? " on" : ""), style: "text-align:left;padding:.6em .8em;" + N1_WRAP, onclick: () => {
        if (fin) return; const j = picked.indexOf(i);
        if (j >= 0) picked.splice(j, 1); else if (picked.length < k) picked.push(i); else return api.hint(`${k}개를 모두 골랐어요. 바꾸려면 고른 카드를 다시 눌러요.`);
        draw(); kick(260);
      } });
      b.append(h("div", { class: "jua", style: "font-size:1.1em" }, (pos >= 0 ? `${pos + 1}. ` : "") + it.name), h("div", {}, it.show));
      if (conv) b.append(h("div", { style: "color:#2F6B57;font-size:.95em;margin-top:.2em" }, `= ${n1Mix(it.v)} = ${n1S(it.v)}`));
      grid.append(b);
    });
    show.textContent = "고른 차례: " + (picked.map(i => items[i].name).join(" → ") || "아직 없음");
  }
  const order = items.map((_, i) => i).sort((x, y) => { const c = n1Cmp(items[x].v, items[y].v); return opt.dir === "asc" ? (c === "<" ? -1 : 1) : (c === ">" ? -1 : 1); });
  const judge = () => {
    api.tryOnce();
    const ans = picked.map(i => items[i].name).join(", ");
    for (let j = 1; j < picked.length; j++) {
      const A = items[picked[j - 1]], B = items[picked[j]], c = n1Cmp(A.v, B.v);
      if (opt.dir === "asc" ? c !== "<" : c !== ">") { api.fail(`${n1J(A.name, "과/와")} ${B.name}의 차례를 다시 봐요. 두 수를 같은 형태로 바꾸어 자리 수부터 비교해요.`, ans); return false; }
    }
    if (k < items.length && picked.some((x, j) => x !== order[j])) { api.fail(`고르지 않은 카드 가운데 더 ${opt.dir === "asc" ? "작은" : "큰"} 수가 있어요. 모든 카드를 같은 형태로 바꾸어 비교해 봐요.`, ans); return false; }
    fin = true; api.done(ans, opt.ok); return true;
  };
  kick = n1sKick(() => picked.length === k && !fin, () => picked.join(","), judge);
  draw();
  api.provide({ words: ["같은 형태로 바꾸어", "자리 수", "높은 자리부터"], answers: [order.slice(0, k).map(i => items[i].name).join(", ")] });
  const tools = h("div", { class: "tools" }, h("button", { class: "ghost", onclick: () => { if (fin) return; picked = []; draw(); } }, "다시"));
  if (opt.convert) tools.prepend(h("button", { onclick: () => { conv = !conv; draw(); } }, "🔁 수의 형태를 같게 보기"));
  body.append(grid, tools, show);
}

/* ---------- 수 카드로 수 만들기 (opt.cards, opt.rules [{t, f, why}], opt.read, opt.target) ---------- */
function n1sCards(body, api, opt) {
  const n = opt.cards.length; let slots = Array(n).fill(null), fin = false, kick = null;
  const slotRow = h("div", { class: "opts", style: "gap:.4em" }), cardRow = h("div", { class: "opts", style: "gap:.4em" });
  const rules = h("div"), readIn = n1Inp("min(100%,20em)", "읽는 말", "text"), st = { commit: false };
  const cur = () => slots.every(v => v != null) ? slots.map(i => opt.cards[i]).join("") : null;
  function draw() {
    slotRow.innerHTML = ""; cardRow.innerHTML = "";
    slots.forEach((ci, s) => slotRow.append(h("button", { class: "opt", style: "min-width:2.6em;min-height:2.8em;font-size:1.5em;text-align:center;font-family:Jua", onclick: () => { if (fin) return; slots[s] = null; draw(); } },
      ci == null ? h("span", { style: "color:#9AA5A1;font-size:.6em" }, N1_PLACE[n - 1 - s]) : String(opt.cards[ci]))));
    opt.cards.forEach((c, ci) => { const used = slots.includes(ci); cardRow.append(h("button", { class: "opt", disabled: used, style: `min-width:2.6em;min-height:2.6em;font-size:1.5em;text-align:center;font-family:Jua;background:${used ? "#EEF1F0" : "#FFF4DD"};border-color:#D9A44E;opacity:${used ? .4 : 1}`, onclick: () => { if (fin) return; const e = slots.indexOf(null); if (e >= 0) { slots[e] = ci; draw(); kick(opt.read ? 900 : 260); } } }, String(c))); });
    rules.innerHTML = "";
    const s = cur();
    (opt.rules || []).forEach(r => rules.append(h("div", { style: "margin:.15em 0" }, (s ? (r.f(s) ? "✅ " : "⬜ ") : "⬜ ") + r.t)));
  }
  const readReady = () => { const s = cur(), v = readIn.value.replace(/[\s,]/g, ""); if (!s || !v) return false; return st.commit || v.length >= Math.min(...[...n1ReadSet(s)].map(x => x.length)); };
  const judge = () => {
    api.tryOnce();
    const s = cur(); const ans = (s || "-") + (opt.read ? " / " + readIn.value : "");
    if (s[0] === "0") { api.fail(`${N1_PLACE[n - 1]}의 자리에는 0을 쓸 수 없어요. 0을 쓰면 ${n}자리 수가 되지 않아요.`, ans); return false; }
    const br = (opt.rules || []).find(r => !r.f(s)); if (br) { api.fail(br.why || `‘${br.t}’ 조건을 다시 살펴봐요.`, ans); return false; }
    if (opt.target && s !== String(opt.target)) { api.fail("조건을 모두 만족하는지 하나씩 다시 확인해요.", ans); return false; }
    if (opt.read) { const j = n1JudgeRead(readIn.value, s); if (!j.ok) { readIn.style.borderColor = "var(--no)"; api.fail(j.msg, ans); return false; } readIn.style.borderColor = "var(--ok)"; }
    fin = true; api.done(ans, (opt.ok || "멋진 수를 만들었어요!") + ` ${s} = ${n1Mix(s)}, ${n1Read(s)}`); return true;
  };
  kick = n1sKick(() => !fin && cur() != null && (!opt.read || readReady()), () => (cur() || "") + "|" + readIn.value.replace(/\s/g, ""), judge);
  if (opt.read) n1sWatch(readIn, kick, st);
  draw();
  api.provide({ words: opt.words || ["가장 높은 자리에는 0을 쓸 수 없어요"], answers: opt.target ? [String(opt.target)] : [] });
  body.append(h("p", { class: "inst" }, "카드를 누르면 왼쪽 칸부터 차례로 들어가요. 칸을 누르면 카드가 돌아와요."),
    h("div", { class: "jua" }, "내가 만든 수"), slotRow, h("div", { class: "jua", style: "margin-top:.4em" }, "수 카드"), cardRow, rules,
    opt.read ? h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em;margin-top:.6em" }, h("span", { class: "jua" }, "만든 수를 읽어 보세요:"), readIn) : "",
    h("div", { class: "actions" }, h("button", { class: "ghost", onclick: () => { if (fin) return; slots = Array(n).fill(null); draw(); } }, "다시")));
}

/* ---------- 설명한 수 쓰기 (1조가 □개, 1억이 □개, 1만이 □개인 수) — 내가 정한 수라 정답이 여러 가지 ---------- */
function n1sDescribe(body, api, opt) {
  const U = opt.units, exp = { 일: 0, 만: 4, 억: 8, 조: 12 }; let fin = false, kick = null;
  const ins = U.map(u => n1Inp("4.5em", `1${u}의 개수`)), sts = U.map(() => ({ commit: false }));
  const line = h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em;font-size:1.12em" });
  U.forEach((u, i) => line.append(h("span", { class: "jua" }, `1${u === "일" ? "" : u}${u === "조" ? "가" : "이"}`), ins[i], h("span", { class: "jua" }, i < U.length - 1 ? "개," : "개인 수")));
  const numIn = n1Inp("min(100%,16em)", "수"), nst = { commit: false };
  const cs = () => ins.map(i => i.value.trim());
  const val = () => { const c = cs(); if (c.some(x => !/^\d{1,4}$/.test(x) || Number(x) < 1)) return null; return U.reduce((t, u, i) => t + BigInt(c[i]) * 10n ** BigInt(exp[u]), 0n).toString(); };
  const judge = () => {
    api.tryOnce();
    const c = cs(), ans = c.join("·") + " → " + numIn.value;
    const bad = c.findIndex(x => !/^\d{1,4}$/.test(x) || Number(x) < 1);
    if (bad >= 0) { ins[bad].style.borderColor = "var(--no)"; api.fail("□ 안에는 1부터 9999까지의 수를 써요.", ans); return false; }
    ins.forEach(i => i.style.borderColor = "var(--ok)");
    const v = val(), got = n1Parse(numIn.value, { digits: true });
    if (got !== v) {
      numIn.style.borderColor = "var(--no)";
      if (n1Parse(numIn.value) === v) { api.fail("값은 맞아요! 이번에는 0을 모두 써서 숫자로만 써 봐요.", ans); return false; }
      api.fail(`${U.map((u, i) => `1${u === "일" ? "" : u}${u === "조" ? "가" : "이"} ${c[i]}개`).join(", ")}이면 ${U.map((u, i) => c[i] + (u === "일" ? "" : u)).join(" ")}이에요. 네 자리씩 끊어 빈자리에는 0을 써요.`, ans); return false;
    }
    numIn.style.borderColor = "var(--ok)"; fin = true;
    api.done(ans, `맞아요! ${v} = ${n1Mix(v)}, ${n1J(n1Read(v), "이라고/라고")} 읽어요.`); return true;
  };
  kick = n1sKick(() => !fin && cs().every(Boolean) && (nst.commit || (() => { const v = val(), g = n1Parse(numIn.value); return v && g && g.length >= v.length; })()),
    () => cs().join(",") + "|" + numIn.value.replace(/\s/g, ""), judge);
  ins.forEach((i, k) => n1sWatch(i, kick, sts[k])); n1sWatch(numIn, kick, nst);
  api.provide({ words: ["네 자리씩", "0인 자리에는 0"], answers: [] });
  body.append(n1H("p", { class: "inst" }, opt.tip || "□ 안에 1부터 9999까지의 수를 마음대로 정해 써요."), line,
    h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4em;margin-top:.6em" }, h("span", { class: "jua" }, "이 수를 숫자로 쓰면:"), numIn));
}

/* ---------- 눌러서 고르기 그림 (opt.items [{t, v, ok, why}]) — 정답 수만큼 고르면 저절로 확인 ---------- */
function n1sSpot(body, api, opt) {
  const it = opt.items, sel = new Set(), need = it.filter(x => x.ok).length; let fin = false, kick = null;
  const cols = opt.cols || 3, CW = 300, CH = 130, W = cols * CW + 20, rows = Math.ceil(it.length / cols), svg = makeSvg(W, rows * CH + 20);
  function draw() {
    svg.innerHTML = "";
    it.forEach((x, i) => {
      const gx = 10 + (i % cols) * CW, gy = 10 + Math.floor(i / cols) * CH, g = svgEl("g", { style: "cursor:pointer" });
      g.append(svgEl("rect", { x: gx + 8, y: gy + 8, width: CW - 16, height: CH - 16, rx: 14, fill: sel.has(i) ? "#FFF1D6" : "#fff", stroke: sel.has(i) ? "#B4610F" : "#C9D3CF", "stroke-width": sel.has(i) ? 4 : 2 }));
      g.append(txt(gx + CW / 2, gy + 44, x.t, x.t.length > 14 ? 16 : 18, { fill: "#4A5753" }));
      g.append(txt(gx + CW / 2, gy + 84, x.v, 30));
      if (sel.has(i)) g.append(svgEl("ellipse", { cx: gx + CW / 2, cy: gy + 84, rx: Math.min(CW / 2 - 20, 14 * x.v.length + 20), ry: 26, fill: "none", stroke: N1_RED, "stroke-width": 3.5 }));
      g.addEventListener("click", () => { if (fin) return; sel.has(i) ? sel.delete(i) : sel.add(i); draw(); kick(260); });
      svg.append(g);
    });
  }
  const judge = () => {
    api.tryOnce();
    const ans = [...sel].map(i => it[i].v).join(", ") || "-";
    const miss = it.findIndex((x, i) => !!x.ok !== sel.has(i));
    if (miss < 0) { fin = true; api.done(ans, opt.ok); return true; }
    const wrongPick = [...sel].find(i => !it[i].ok);
    api.fail(wrongPick != null ? (it[wrongPick].why || `${n1J(it[wrongPick].v, "은/는")} 조건에 맞지 않아요. 숫자가 몇 개인지 세어 봐요.`) : "아직 찾지 못한 카드가 있어요. 숫자가 몇 개인지 하나씩 세어 봐요.", ans);
    return false;
  };
  kick = n1sKick(() => !fin && sel.size >= need, () => [...sel].sort().join(","), judge);
  draw();
  api.provide({ words: opt.words || [], answers: [it.filter(x => x.ok).map(x => x.v).join(", ")] });
  body.append(n1H("p", { class: "inst" }, `알맞은 카드 ${need}장을 모두 누르면 저절로 확인해요.`), n1Fit(svg, "54vh"));
}

/* ---------- 카드 3장으로 가장 큰 수 만들기 (opt.sets) — 3장을 다 놓으면 저절로 확인 ---------- */
function n1sArrange(body, api, opt) {
  let si = 0, order = [], fin = false, kick = null;
  const say = h("p", { class: "jua", style: "font-size:1.12em" }), made = h("div", { class: "opts" }), pool = h("div", { class: "opts" }), out = h("div", { class: "readout", style: N1_WRAP });
  function draw() {
    const cs = opt.sets[si]; say.textContent = `${si + 1}번째: 카드 ${cs.slice(0, -1).join(", ")}, ${n1Ro(cs[cs.length - 1])} 가장 큰 수를 만들어 보세요.`;
    made.innerHTML = ""; pool.innerHTML = "";
    [0, 1, 2].forEach(k => made.append(order[k] == null ? h("span", { class: "opt", style: "min-width:3.2em;min-height:2.6em;color:#9AA5A1;text-align:center" }, `${k + 1}번째`) : n1CardBtn(cs[order[k]], { onclick: () => { if (!fin) { order.splice(k, 1); draw(); } } })));
    cs.forEach((c, i) => pool.append(n1CardBtn(c, { disabled: order.includes(i), onclick: () => { if (!fin && order.length < 3) { order.push(i); draw(); kick(260); } } })));
    const s = order.length === 3 ? order.map(i => cs[i]).join("") : null;
    out.innerHTML = s ? `만든 수: <b>${s}</b> <small>(${n1Mix(s)}, ${s.length}자리)</small>` : "카드를 차례로 눌러 수를 만들어요.";
  }
  const judge = () => {
    api.tryOnce();
    const cs = opt.sets[si], s = order.map(i => cs[i]).join(""), best = n1Best(cs);
    if (s !== best) { api.fail(`${s}보다 더 큰 수를 만들 수 있어요. 맨 앞에 오는 숫자가 가장 크게 되도록 카드 순서를 바꿔 봐요.`, s); return false; }
    if (si < opt.sets.length - 1) { si++; order = []; draw(); api.hint(`○ ${s}, 가장 큰 수예요! 다음 카드도 해 봐요.`); return false; }
    fin = true; api.done(s, opt.ok); return true;
  };
  kick = n1sKick(() => !fin && order.length === 3, () => si + ":" + order.join(","), judge);
  draw();
  api.provide({ words: ["자리 수", "높은 자리에 큰 숫자"], answers: opt.sets.map(n1Best) });
  body.append(say, h("div", { class: "jua" }, "카드를 놓는 차례 (왼쪽부터 이어 붙여요)"), made, h("div", { class: "jua" }, "가진 카드"), pool, out,
    h("div", { class: "actions" }, h("button", { class: "ghost", onclick: () => { if (!fin) { order = []; draw(); } } }, "다시")));
}

/* ---------- 놀이: 별 세 칸 잇기 (컴퓨터와) — 놀이 자체라 단추를 남김 ---------- */
const N1S_DECK = ["264", "5", "81", "730", "19", "6", "402", "58", "3", "97", "615", "8"];
const N1S_BOARD = [["264", "5", "81", "730"], ["19", "615", "402", "6"], ["58", "3", "97", "8"]];
const N1S_LINES = (() => { const L = [], R = 3, C = 4, ok = (r, c) => r >= 0 && r < R && c >= 0 && c < C; for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) [[0, 1], [1, 0], [1, 1], [1, -1]].forEach(([dr, dc]) => { const l = [0, 1, 2].map(k => [r + dr * k, c + dc * k]); if (l.every(([a, b]) => ok(a, b))) L.push(l.map(([a, b]) => a * C + b)); }); return L; })();
function n1sBoardSvg(col, opt = {}) {
  const CW = 150, CH = 92, svg = makeSvg(4 * CW + 20, 3 * CH + 20);
  N1S_BOARD.flat().forEach((v, i) => {
    const r = Math.floor(i / 4), c = i % 4, x = 10 + c * CW, y = 10 + r * CH, who = col[i];
    const g = svgEl("g", { "data-i": i });
    g.append(svgEl("rect", { x: x + 4, y: y + 4, width: CW - 8, height: CH - 8, rx: 12, fill: who === "me" ? "#9CC7F2" : who === "cpu" ? "#F4A79A" : "#FFFBEF", stroke: opt.can && opt.can.includes(i) ? "#B4610F" : "#9AA5A1", "stroke-width": opt.can && opt.can.includes(i) ? 4.5 : 2, "stroke-dasharray": opt.can && opt.can.includes(i) ? "8 5" : "none" }));
    g.append(txt(x + 22, y + 24, "★", 18, { fill: who ? "#FFFFFF" : "#E9C46A" }));
    g.append(txt(x + CW / 2, y + CH / 2 + 2, v, 34, { fill: INK }));
    if (opt.onPick) { g.style.cursor = "pointer"; g.addEventListener("click", () => opt.onPick(i)); }
    svg.append(g);
  });
  return svg;
}
function n1sWin(col, who) { return N1S_LINES.some(l => l.every(i => col[i] === who)); }
function n1sGame(body, api, opt) {
  let col = Array(12).fill(null), me, cpu, order, phase, round = 0, doneOnce = false, myNum = "", cpuNum = "";
  const boardBox = h("div", { style: "max-width:34em" }), area = h("div"), log = h("div", { class: "readout", style: "font-size:1.02em;" + N1_WRAP });
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cellsOf = cards => N1S_BOARD.flat().map((v, i) => cards.includes(v) && !col[i] ? i : -1).filter(i => i >= 0);
  function deal() { const d = shuffle(N1S_DECK); me = d.slice(0, 3); cpu = d.slice(3, 6); order = []; phase = "make"; round++; draw(); }
  function board(can, onPick) { boardBox.innerHTML = ""; boardBox.append(n1Fit(n1sBoardSvg(col, { can, onPick }), "38vh")); }
  function finish(msg) {
    log.innerHTML = msg;
    area.innerHTML = ""; area.append(h("div", { class: "tools" }, h("button", { onclick: () => { col = Array(12).fill(null); round = 0; deal(); } }, "새 놀이 시작")));
    if (!doneOnce) { doneOnce = true; api.done(msg.replace(/<[^>]+>/g, ""), "놀이를 끝까지 했어요! 가장 큰 수를 만들고 비교한 방법을 친구에게 설명해 봐요."); }
  }
  function afterColor() {
    if (n1sWin(col, "me")) return finish("🎉 <b>파란 별(나)</b>이 이어진 세 칸을 먼저 색칠했어요. 내가 이겼어요!");
    if (n1sWin(col, "cpu")) return finish("빨간 별(컴퓨터)이 이어진 세 칸을 먼저 색칠했어요. 아깝다! ‘새 놀이 시작’으로 다시 도전해요.");
    if (col.every(Boolean) || round >= 14) return finish("색칠할 칸이 모자라 비겼어요. 다시 해 볼까요?");
    area.innerHTML = ""; area.append(h("div", { class: "tools" }, h("button", { class: "big", onclick: deal }, "한 판 더")));
  }
  function cpuColor() {
    const can = cellsOf(cpu);
    if (!can.length) { log.innerHTML += "<br>컴퓨터 카드의 수가 모두 색칠되어 있어서 이번에는 색칠하지 못해요."; return afterColor(); }
    const tryWin = can.find(i => { const c2 = col.slice(); c2[i] = "cpu"; return n1sWin(c2, "cpu"); });
    const block = can.find(i => { const c2 = col.slice(); c2[i] = "me"; return n1sWin(c2, "me"); });
    const pick = tryWin != null ? tryWin : block != null ? block : can[Math.floor(Math.random() * can.length)];
    col[pick] = "cpu"; board(); log.innerHTML += `<br>컴퓨터가 <b>${N1S_BOARD.flat()[pick]}</b> 칸을 빨간색으로 색칠했어요.`; afterColor();
  }
  function draw() {
    board(); area.innerHTML = "";
    if (phase === "make") {
      log.innerHTML = `${round}번째 판 · 내가 뽑은 카드: <b>${me.join(", ")}</b>`;
      const made = h("div", { class: "opts" }), pool = h("div", { class: "opts" });
      [0, 1, 2].forEach(k => made.append(order[k] == null ? h("span", { class: "opt", style: "min-width:3.2em;min-height:2.6em;color:#9AA5A1;text-align:center" }, `${k + 1}`) : n1CardBtn(me[order[k]], { onclick: () => { order.splice(k, 1); draw(); } })));
      me.forEach((c, i) => pool.append(n1CardBtn(c, { disabled: order.includes(i), onclick: () => { if (order.length < 3) { order.push(i); draw(); } } })));
      area.append(h("div", { class: "jua" }, "카드 3장을 모두 이어 붙여 가장 큰 수를 만들어요."), made, pool,
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
  api.provide({ words: ["자리 수가 많은 쪽", "높은 자리에 큰 숫자", "이어진 세 칸"], answers: [] });
  body.append(h("p", { class: "inst" }, "나는 파란 별, 컴퓨터는 빨간 별이에요. 가로·세로·대각선으로 이어진 세 칸을 먼저 색칠하면 이겨요."), boardBox, log, area);
  deal();
}

/* ---------- 우주 거리 카드 그림 (보기용) list [{name, show}] ---------- */
function n1sFactsFig(list, title, o = {}) {
  return () => {
    const cols = Math.min(o.cols || 3, list.length), CW = 300, CH = 96, rows = Math.ceil(list.length / cols);
    const svg = makeSvg(cols * CW + 20, rows * CH + 50);
    svg.append(txt((cols * CW + 20) / 2, 22, title, 18, { fill: "#4A5753" }));
    list.forEach((p, i) => {
      const x = 10 + (i % cols) * CW, y = 40 + Math.floor(i / cols) * CH;
      svg.append(svgEl("rect", { x: x + 5, y: y + 5, width: CW - 10, height: CH - 10, rx: 12, fill: "#EEF2FB", stroke: "#8EA2C8", "stroke-width": 2 }));
      svg.append(txt(x + CW / 2, y + 32, p.name, p.name.length > 12 ? 17 : 19, { fill: "#2A3D6B" }));
      svg.append(txt(x + CW / 2, y + 64, p.show, p.show.length > 14 ? 17 : 20));
    });
    return h("div", { style: "max-width:" + (cols * 19 + 4) + "em" }, n1Fit(svg, o.mh || "40vh"));
  };
}
//@@LESSONS
const UNIT_STORY = { title: "우주 탐험대 큰 수 일지", lines: [
  "4학년 3반 26명이 ‘우주 탐험대’가 되었어요. 다음 달 우주 과학관 견학을 앞두고 대장 하늘이와 서아, 도윤, 민준, 지우, 라온이가 함께 탐험 일지를 써요.",
  "견학비 만 원을 모으고, 과학관 관람객 수를 세고, 달·태양·행성까지의 거리와 별의 수처럼 0이 아주 많은 수를 만나요.",
  "우주의 거리와 별의 수는 모두 어림값(약)이에요. 큰 수를 읽고 쓰고, 뛰어 세고, 크기를 비교해서 마지막에 ‘우주 큰 수 신문’을 발표해요."],
  one: "우주 탐험대 · 우주 과학관 견학을 준비하며 견학비·관람객 수·우주 거리 속 큰 수를 읽고 쓰고 비교해요." };
const UNIT_KEYWORDS = ["10000", "만(일만)", "다섯 자리 수", "자릿값", "십만·백만·천만", "억(일억)", "조(일조)", "네 자리씩 끊어 읽기", "0인 자리는 읽지 않아요", "각 자리 값의 합", "뛰어 세기", "자리 수", "높은 자리부터 비교", "같은 형태로 바꾸기", "어림값(약)"];

const LESSONS = [
{
  id: "s1", no: 1, title: "우주 탐험대가 되었어요", soop: "개념 찾기(S)",
  question: "우주 이야기에는 왜 0이 많은 큰 수가 자주 나올까요?",
  summary: "견학비, 관람객 수, 달과 태양까지의 거리처럼 우리 주변과 우주에는 큰 수가 많아요. 이 단원에서는 10000보다 큰 수를 읽고 쓰고, 뛰어 세고, 크기를 비교하는 방법을 배워요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기",
      inst: "선생님이 ‘우주 과학관 견학 안내문’을 보여 주셨어요. ‘견학비 10000원, 지구에서 달까지 약 384400 km, 지구에서 태양까지 약 150000000 km’. 세 칸에 한 가지씩 써서 붙여요.",
      hints: ["보여요: 안내문에 있는 수를 그대로 써요.", "생각해요: 0이 많은 수를 보고 든 생각을 써요.", "궁금해요: 큰 수를 읽는 방법, 비교하는 방법 등 궁금한 것을 써요."],
      render: (b, a) => panes(b, a, [
        { t: "보여요", e: "👀", ph: "~이 보여요", hint: "안내문에서 눈에 띄는 수를 써요", ex: ["안내문에 견학비 10000원이 보여요.", "지구에서 태양까지 약 150000000 km라는 수가 보여요."] },
        { t: "생각해요", e: "💭", ph: "~인 것 같아요", hint: "0이 많은 수를 보고 든 생각을 써요", ex: ["150000000은 0이 7개나 있어서 아주 큰 수인 것 같아요.", "달까지 384400 km는 우리 동네에서 학교까지보다 훨씬 먼 거리인 것 같아요."] },
        { t: "궁금해요", e: "❓", ph: "왜 ~일까? / ~은 어떻게 할까?", hint: "큰 수에서 궁금한 것", ex: ["150000000은 어떻게 읽을까?", "0이 아주 많은 두 수는 어떻게 크기를 비교할까?"] }],
        { ok: "생각을 잘 모았어요! 궁금한 것은 단원 마지막 시간에 다시 꺼내 볼 거예요." }) },
    { name: "그려 보기 — 큰 수에 동그라미", inst: "안내문 속 수 카드예요. 숫자가 다섯 개 이상인 큰 수가 적힌 카드를 모두 눌러 동그라미 해 보세요.",
      hints: ["카드에 적힌 수의 숫자가 몇 개인지 하나씩 세어 봐요.", "120은 숫자가 3개, 40000은 숫자가 5개예요."],
      render: (b, a) => n1sSpot(b, a, { items: [
        { t: "견학비 (한 사람)", v: "10000원", ok: true },
        { t: "우리 반 탐험대원", v: "26명", why: "26은 숫자가 2개인 두 자리 수예요." },
        { t: "지구에서 달까지 (약)", v: "384400 km", ok: true },
        { t: "망원경으로 찾은 별자리", v: "7개", why: "7은 한 자리 수예요." },
        { t: "지구 둘레 (약)", v: "40000 km", ok: true },
        { t: "천체투영관 의자", v: "120개", why: "120은 숫자가 3개인 세 자리 수예요." }],
        ok: "10000, 384400, 40000은 숫자가 다섯 개 이상인 큰 수예요. 우주 이야기에는 이런 큰 수가 아주 많이 나와요!" }) },
    { name: "말해 보기 — 네 자리 수 떠올리기", inst: "3학년까지 배운 네 자리 수를 떠올려요. 과학관 우주 퀴즈 최고 점수는 ‘이천칠십오 점’이래요. 자릿값 표에 숫자 카드로 나타내 보세요.",
      hints: ["천의 자리부터 숫자를 하나씩 놓아요.", "이천 → 천의 자리 2, 백은 없어요 → 백의 자리 0, 칠십 → 십의 자리 7, 오 → 일의 자리 5"],
      render: thenWhy((b, a) => n1sChart(b, a, { cols: 4, value: 2075, say: "이천칠십오", ok: "2075는 1000이 2개, 100이 0개, 10이 7개, 1이 5개인 수예요." }),
        { q: "2075에서 백의 자리에 0 카드를 놓아야 하는 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① ‘이천칠십오’에 ‘백’이 들어 있는지 살펴봐요. → ② 그 자리를 비워 두면 어떤 수가 되는지 생각해요.", "‘왜냐하면 백의 자리 숫자가 ~이고, 0을 놓지 않으면 ~이 되기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 이천칠십오에는 백이 없어서 백의 자리 숫자가 0이고, 0을 놓지 않으면 275처럼 다른 수가 되기 때문이에요." }) },
    { name: "약속하기 — 네 자리 수 비교 떠올리기", inst: "네 자리 수의 크기를 비교하는 방법을 떠올려 알맞은 말을 골라요.",
      hints: ["천의 자리 숫자가 같으면 그다음 자리를 비교해요."],
      render: (b, a) => blanks(b, a, ["네 자리 수의 크기는 ", { o: ["낮은", "높은"], a: 1 }, " 자리 숫자부터 차례대로 비교해요. 2075와 2105는 천의 자리 숫자가 같으니 ", { o: ["십의 자리", "백의 자리", "일의 자리"], a: 1 }, " 숫자를 비교해요. 그래서 2075 ", { o: [">", "<"], a: 1 }, " 2105예요."]) },
    { name: "확인하기 — 큰 수가 필요한 곳", inst: "큰 수가 필요한 상황을 고르고, 두 수의 크기를 비교해 보세요.",
      hints: ["아주 많은 것을 세거나 아주 먼 거리를 나타낼 때 큰 수가 필요해요.", "자리 수가 다르면 자리 수가 많은 쪽이 더 커요."],
      render: (b, a) => n1sAsk(b, a, [
        { q: "큰 수가 필요한 상황을 모두 고르세요.", t: "pick", o: ["지구에서 태양까지의 거리를 나타낼 때", "우리 반 탐험대원 수를 셀 때", "과학관에 1년 동안 온 관람객 수를 나타낼 때", "필통 속 연필 수를 셀 때"], a: [0, 2], why: { "0,1": "우리 반 탐험대원은 26명이라 큰 수가 필요하지 않아요.", "0,3": "필통 속 연필은 몇 자루뿐이라 큰 수가 필요하지 않아요." } },
        { t: "cmp", l: 8640, r: 8604, why: { "<": "백의 자리까지 같아요. 십의 자리 숫자 4와 0을 비교해요." } },
        { t: "cmp", l: 999, r: 1000, why: { ">": "999는 세 자리 수, 1000은 네 자리 수예요." } }], { ok: "높은 자리부터 비교하는 방법은 큰 수에서도 그대로 쓰여요. 이제 큰 수를 만나러 출발해요!" }) }
  ],
  challenge: { inst: "서아가 견학비를 모으고 있어요. 다음 시간에 배울 수를 미리 생각해 보세요.", hints: ["1000원짜리 9장은 1000이 9개예요.", "9999에 1을 더하면 일의 자리부터 차례로 받아올림이 생겨요."],
    render: (b, a) => n1sAsk(b, a, [
      { q: "서아가 1000원짜리 지폐 9장을 모았어요. 모두 얼마인가요?", t: "num", a: 9000, unit: "원" },
      { q: "가장 큰 네 자리 수 9999보다 1만큼 더 큰 수를 숫자로 써 보세요.", t: "num", a: 10000, why: { "99991": "9999 뒤에 1을 붙인 것이 아니라 1만큼 더한 수예요.", "9910": "일의 자리부터 받아올림을 차례로 해 봐요." } },
      { q: "그 수는 몇 자리 수인가요?", t: "num", a: 5, unit: "자리" }], { ok: "9999보다 1만큼 더 큰 수는 다섯 자리 수 10000이에요. 견학비 10000원과 같은 수예요!" }) }
},
{
  id: "s2", no: 2, title: "견학비 만 원을 모아요 ― 만", soop: "개념 구축하기(O)",
  question: "1000이 10개인 수는 어떻게 쓰고 읽을까요?",
  summary: "1000이 10개인 수를 10000 또는 1만이라 쓰고, 만 또는 일만이라고 읽어요. 10000은 9000보다 1000, 9900보다 100, 9990보다 10, 9999보다 1만큼 더 큰 수예요.",
  steps: [
    { name: "만져 보기 — 1000원씩 모으기", inst: "견학비는 한 사람에 10000원이에요. 서아는 용돈에서 1000원짜리 지폐를 한 장씩 모으고 있어요. 먼저 예상을 쓰고, 지폐를 놓아 견학비를 만들어 보세요.",
      hints: ["+1 단추로 1000원짜리 지폐를 한 장씩 놓아요. 9장일 때 얼마인지 살펴봐요.", "1000원짜리가 10장이 되면 ‘10장 묶기’로 10000원짜리 한 장으로 바꿀 수 있어요."],
      render: ruleFirst((b, a) => n1sMoney(b, a, { denoms: [10000, 1000], addable: [1000], bundle: true, words: ["1000이 10개", "10000"], targets: [
        { v: 10000, need: { 1000: 10, 10000: 0 }, say: "**1000원짜리 지폐**로 견학비 10000원을 만들어 보세요.", ok: "1000원짜리 10장이 10000원이에요." },
        { v: 10000, need: { 1000: 0, 10000: 1 }, say: "이번에는 1000원짜리 10장을 묶어 **10000원짜리 한 장**으로 바꿔 보세요.", ok: "1000원짜리 10장과 10000원짜리 한 장은 같은 금액이에요!" }] }),
        { q: "1000원짜리 지폐 몇 장을 모으면 견학비 10000원이 될까요?", ph: "내 예상: 1000원짜리 ~장", help: ["① 1000원짜리 1장, 2장, 3장… 늘어날 때 금액을 떠올려요. → ② 9000원 다음은 얼마인지 생각해요.", "‘내 예상: 1000원짜리 ~장이 모이면 10000원이 될 것 같아요.’ 꼴로 써요."],
          ans: "1000원짜리 10장이 모이면 10000원이에요. 1000이 10개인 수가 10000이에요." }) },
    { name: "그려 보기 — 수직선 확대하기", inst: "10000은 얼마만큼의 수인지 수직선으로 알아봐요. 빈칸을 채우고, 주황 칸을 눌러 수직선을 점점 크게 보세요.",
      hints: ["10000 바로 앞 눈금과 10000 사이가 한 칸이에요.", "눈금 한 칸의 크기가 1000, 100, 10, 1로 점점 작아져요."],
      render: (b, a) => n1sZoom(b, a, { levels: [{ from: 6000, step: 1000 }, { from: 9600, step: 100 }, { from: 9960, step: 10 }, { from: 9996, step: 1 }], ok: "10000은 9000보다 1000, 9900보다 100, 9990보다 10, 9999보다 1만큼 더 큰 수예요." }) },
    { name: "말해 보기 — 10배씩 커지는 수", inst: "1, 10, 100, 1000, 10000 사이의 관계를 알아보고 까닭을 말해 보세요.",
      hints: ["어떤 수의 10배는 그 수 뒤에 0을 하나 붙인 수예요.", "10000은 100이 100개, 10이 1000개인 수예요."],
      render: thenWhy((b, a) => n1sAsk(b, a, [
        { q: "1 → 10 → ? → 1000 → ?  (화살표마다 10배)", fig: n1ChainFig([1, 10, null, 1000, null]), t: "line", parts: ["1, 10, ", { a: 100 }, ", 1000, ", { a: 10000 }] },
        { q: "10000은 1000의 몇 배인가요?", t: "num", a: 10, unit: "배" },
        { q: "10000은 100의 몇 배인가요?", t: "num", a: 100, unit: "배", why: { "10": "100의 10배는 1000이에요. 10000이 되려면 100이 몇 개 있어야 할까요?" } },
        { q: "10000은 10의 몇 배인가요?", t: "num", a: 1000, unit: "배", why: { "100": "10의 100배는 1000이에요. 0이 몇 개 더 있어야 할까요?" } }],
        { ok: "1, 10, 100, 1000, 10000은 10배씩 커져요. 10000은 1000의 10배, 100의 100배, 10의 1000배예요." }),
        { q: "10000이 100의 100배인 까닭을 말해 보세요.", ph: "왜냐하면 ~", help: ["① 100의 10배가 얼마인지 떠올려요. → ② 그 수의 10배가 얼마인지 이어서 생각해요.", "‘왜냐하면 100의 10배는 ~이고, ~의 10배가 10000이기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 100의 10배는 1000이고, 1000의 10배가 10000이라서 100이 100개 모여야 10000이 되기 때문이에요." }) },
    { name: "약속하기 — 만", inst: "만의 약속을 완성해요.", hints: ["1000이 10개인 수는 1 뒤에 0이 4개예요."],
      render: (b, a) => blanks(b, a, ["1000이 10개인 수를 ", { o: ["1000만", "10000", "100000"], a: 1 }, " 또는 ", { o: ["10천", "1만", "100만"], a: 1 }, "이라 쓰고, ", { o: ["십천", "천십", "만 또는 일만"], a: 2 }, "이라고 읽어요."]) },
    { name: "확인하기 — 저금통 동전으로 만 원", inst: "도윤이는 저금통의 동전으로 견학비를 내려고 해요. 100원짜리와 10원짜리 동전을 각각 모아 10000원을 만들어 보세요.",
      hints: ["100원짜리 10개는 1000원이에요. 10000원은 1000원이 10개예요.", "10원짜리 100개는 1000원이에요."],
      render: (b, a) => n1sMoney(b, a, { denoms: [100, 10], resetEach: true, steps: { 100: [1, 10], 10: [1, 10, 100] }, words: ["100이 100개", "10이 1000개"], targets: [
        { v: 10000, need: { 100: 100, 10: 0 }, say: "**100원짜리 동전만** 모아 10000원을 만들어 보세요.", ok: "100원짜리 동전 100개가 10000원이에요." },
        { v: 10000, need: { 100: 0, 10: 1000 }, say: "이번에는 **10원짜리 동전만** 모아 10000원을 만들어 보세요.", ok: "100원짜리는 100개, 10원짜리는 1000개가 있어야 10000원이 돼요." }] }) }
  ],
  challenge: { inst: "견학비 10000원을 여러 가지로 생각해 보세요.", hints: ["각각 계산하여 10000이 되는지 확인해요.", "10000에서 6000을 빼요."],
    render: (b, a) => n1sAsk(b, a, [
      { q: "설명하는 수가 다른 하나를 고르세요.", t: "pick", o: ["㉠ 9990보다 10만큼 더 큰 수", "㉡ 1000이 10개인 수", "㉢ 9000보다 100만큼 더 큰 수", "㉣ 10이 1000개인 수"], a: 2, why: { "0": "9990보다 10만큼 더 큰 수는 10000이에요.", "1": "1000이 10개이면 10000이에요.", "3": "10이 1000개이면 10000이에요." } },
      { q: "지우는 견학비 10000원 중에서 6000원을 냈어요. 얼마를 더 내야 하나요?", t: "num", a: 4000, unit: "원" },
      { q: "5000원짜리 지폐만으로 견학비 10000원을 내려면 몇 장이 필요한가요?", t: "num", a: 2, unit: "장" }], { ok: "10000을 여러 가지 방법으로 나타낼 수 있어요!" }) }
},
{
  id: "s3", no: 3, title: "우주 간식 통장 ― 다섯 자리 수", soop: "개념 구축하기(O)",
  question: "10000이 3개, 1000이 2개, 100이 6개, 10이 0개, 1이 4개인 수는 어떻게 쓰고 읽을까요?",
  summary: "10000이 3개, 1000이 2개, 100이 6개, 10이 0개, 1이 4개인 수를 32604 또는 3만 2604라 쓰고, 삼만 이천육백사라고 읽어요. 숫자가 0인 자리는 읽지 않아요. 같은 숫자라도 자리에 따라 나타내는 값이 달라요.",
  steps: [
    { name: "만져 보기 — 간식 통장 금액 만들기", inst: "우주 탐험대 ‘우주 간식’ 통장에 32604원이 모였어요. 돈 모형으로 32604원을 만들어 보세요.",
      hints: ["10000원짜리부터 놓아요. 32604에서 10000은 몇 개 들어 있나요?", "10000원 3장, 1000원 2장, 100원 6개, 10원 0개, 1원 4개예요."],
      render: (b, a) => n1sMoney(b, a, { denoms: [10000, 1000, 100, 10, 1], fewest: true, words: ["10000이 3개", "1000이 2개", "100이 6개", "10이 0개", "1이 4개"], targets: [{ v: 32604, say: "돈 모형으로 **32604원**을 만들어 보세요. 오른쪽에 금액이 나와요.", ok: "10000원 3장, 1000원 2장, 100원 6개, 1원 4개, 10원짜리는 하나도 없어요. 모두 32604원이에요." }] }) },
    { name: "그려 보기 — 관람객 수를 표에", inst: "우주 과학관의 지난달 관람객은 40527명이었대요. 40527을 자릿값 표에 숫자 카드로 나타내 보세요.",
      hints: ["다섯 자리 수는 만, 천, 백, 십, 일의 자리가 있어요.", "천의 자리 숫자는 0이에요. 0 카드도 놓아요."],
      render: (b, a) => n1sChart(b, a, { cols: 5, value: 40527, say: "지난달 관람객 40527명", note: "천의 자리 숫자가 0이에요. 표에는 0을 놓지만 읽을 때는 ‘사만 오백이십칠’처럼 0인 자리를 읽지 않아요.", ok: "40527 = 40000 + 500 + 20 + 7이에요." }) },
    { name: "말해 보기 — 같은 숫자, 다른 값", inst: "과학관 기념품 가게의 하루 판매 금액이 72471원이래요. 숫자 7이 두 번 나와요. 각 7이 나타내는 값을 말해 보세요.",
      hints: ["만의 자리 숫자 7은 10000이 7개라는 뜻이에요.", "십의 자리 숫자 7은 10이 7개라는 뜻이에요."],
      render: thenWhy((b, a) => n1sAsk(b, a, [
        { q: "72471에서 **만의 자리 숫자 7**이 나타내는 값은?", t: "num", a: 70000, why: { "70": "그것은 십의 자리 숫자 7이 나타내는 값이에요. 만의 자리는 10000이 몇 개인지 나타내요.", "7": "숫자 7만 쓰면 안 돼요. 만의 자리에 있으니 10000이 7개예요." } },
        { q: "72471에서 **십의 자리 숫자 7**이 나타내는 값은?", t: "num", a: 70, why: { "70000": "그것은 만의 자리 숫자 7이 나타내는 값이에요.", "7": "십의 자리 숫자 7은 10이 7개예요." } },
        { q: "빈칸을 채워 각 자리 숫자가 나타내는 값의 합으로 나타내 보세요.", t: "line", parts: ["72471 = 70000 + ", { a: 2000 }, " + 400 + ", { a: 70 }, " + 1"] }],
        { ok: "같은 숫자 7이라도 만의 자리에서는 70000, 십의 자리에서는 70을 나타내요." }),
        { q: "72471에서 두 7이 나타내는 값이 다른 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 앞의 7과 뒤의 7이 각각 어느 자리에 있는지 봐요. → ② 그 자리가 얼마를 나타내는지 생각해요.", "‘왜냐하면 앞의 7은 ~의 자리에 있어서 ~을, 뒤의 7은 ~의 자리에 있어서 ~을 나타내기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 앞의 7은 만의 자리에 있어서 70000을, 뒤의 7은 십의 자리에 있어서 70을 나타내기 때문이에요." }) },
    { name: "약속하기 — 다섯 자리 수", inst: "다섯 자리 수의 약속을 완성해요.", hints: ["만의 자리 숫자를 읽고 ‘만’을 붙인 다음, 나머지 네 자리를 읽어요.", "숫자가 0인 자리는 읽지 않아요."],
      render: (b, a) => blanks(b, a, ["10000이 3개, 1000이 2개, 100이 6개, 10이 0개, 1이 4개인 수를 ", { o: ["3264", "32604", "302604"], a: 1 }, " 또는 ", { o: ["3만 2604", "32만 604", "3만 264"], a: 0 }, "라 쓰고, ", { o: ["삼만 이천육백영사", "삼 이 육 영 사", "삼만 이천육백사"], a: 2 }, "라고 읽어요."]) },
    { name: "확인하기 — 쓰고 읽기", inst: "다섯 자리 수를 쓰고 읽어 보세요.", hints: ["숫자가 0인 자리는 읽지 않아요.", "읽은 말에 없는 자리에는 0을 써요."],
      render: (b, a) => n1sAsk(b, a, [
        { q: "칠만 오백구를 수로 써 보세요.", t: "num", a: 70509, why: { "7059": "천의 자리와 십의 자리에 0을 써야 다섯 자리 수가 돼요.", "75009": "오백은 백의 자리 숫자 5예요. 천의 자리에는 0을 써요." } },
        { q: "60380을 읽어 보세요.", t: "read", a: 60380 },
        { q: "10000이 5개, 100이 8개, 1이 3개인 수를 써 보세요.", t: "num", a: 50803, why: { "583": "10000이 5개이면 만의 자리 숫자가 5예요. 빈자리에는 0을 써요." } },
        { q: "숫자 4가 4000을 나타내는 수를 고르세요.", t: "pick", o: ["㉠ 84213", "㉡ 12340", "㉢ 40917"], a: 0, why: { "1": "12340에서 4는 십의 자리 숫자라 40을 나타내요.", "2": "40917에서 4는 만의 자리 숫자라 40000을 나타내요." } }], { ok: "0인 자리는 읽지 않고, 읽지 않은 자리에는 0을 써요. 잘했어요!" }) }
  ],
  challenge: { inst: "탐험대 수 카드 7, 0, 4, 2, 9를 한 번씩 모두 사용하여 다섯 자리 수를 만들고, 만든 수를 읽어 보세요.", hints: ["만의 자리에는 0을 쓸 수 없어요.", "0이 있는 자리는 읽지 않아요."],
    render: (b, a) => n1sCards(b, a, { cards: [7, 0, 4, 2, 9], read: true, ok: "다섯 자리 수를 만들고 바르게 읽었어요! 이 카드로 만들 수 있는 가장 큰 수는 97420, 가장 작은 수는 20479예요." }) }
},
{
  id: "s4", no: 4, title: "과학관을 다녀간 사람들 ― 십만, 백만, 천만", soop: "개념 구축하기(O)",
  question: "10000이 10개, 100개, 1000개인 수는 어떻게 쓰고 읽을까요?",
  summary: "10000이 10개인 수는 100000(10만, 십만), 100개인 수는 1000000(100만, 백만), 1000개인 수는 10000000(1000만, 천만)이에요. 10000이 2048개인 수를 20480000 또는 2048만이라 쓰고, 이천사십팔만이라고 읽어요.",
  steps: [
    { name: "만져 보기 — 10개씩 모으기", inst: "우주 과학관 안내판에 ‘관람객 1만 명 → 10만 명 → 100만 명 → 1000만 명 돌파!’라고 쓰여 있어요. 먼저 예상을 쓰고, 1만에서 시작해 ‘10개 모으기’로 10배씩 키워 보세요.",
      hints: ["1만이 10개이면 10만이에요.", "10만이 10개이면 100만, 100만이 10개이면 1000만이에요."],
      render: ruleFirst((b, a) => n1sTimes(b, a, { start: 10000, times: 3, cols: 8, group: 1, ask: [{ q: "10000이 1000개인 수를 0을 모두 써서 나타내 보세요.", t: "num", a: 10000000, digits: true, why: { "1000000": "그것은 10000이 100개인 수예요. 0을 하나 더 붙여요." } }], ok: "1만 → 10만 → 100만 → 1000만. 10000이 1000개인 수는 10000000, 1000만이에요." }),
        { q: "1만에서 10개씩 3번 모으면 0이 몇 개인 수가 될까요?", ph: "내 예상: 0이 ~개", help: ["① 10000에 0이 몇 개 있는지 세어요. → ② 10개씩 모을 때마다 0이 어떻게 되는지 생각해요.", "‘내 예상: 10개씩 모을 때마다 0이 ~개씩 늘어서 ~이 될 것 같아요.’ 꼴로 써요."],
          ans: "10개씩 모을 때마다 0이 하나씩 늘어나요. 그래서 10만, 100만, 1000만이 되고, 1000만은 1 뒤에 0이 7개인 10000000이에요." }) },
    { name: "그려 보기 — 2048만을 표에", inst: "과학관을 지금까지 다녀간 관람객이 20480000명이래요. 자릿값 표에 숫자 카드로 나타내 보세요.",
      hints: ["일의 자리부터 네 자리씩 끊으면 2048 / 0000이에요.", "앞의 네 자리 2048은 ‘만’ 아래의 천, 백, 십, 일 칸에 놓아요. 백만의 자리 숫자는 0이에요."],
      render: (b, a) => n1sChart(b, a, { cols: 8, value: 20480000, group: 1, say: "지금까지 다녀간 관람객 20480000명", ok: "20480000 = 20000000 + 400000 + 80000이에요." }) },
    { name: "말해 보기 — 얼마만큼의 수일까", inst: "20480000은 얼마만큼의 수인지 말하고, 까닭을 써 보세요.",
      hints: ["2는 천만의 자리 숫자예요. 10000000이 2개라는 뜻이에요.", "4는 십만의 자리, 8은 만의 자리 숫자예요."],
      render: thenWhy((b, a) => n1sAsk(b, a, [
        { q: "20480000에서 숫자 2가 나타내는 값은?", t: "num", a: 20000000, why: { "2000000": "2는 천만의 자리 숫자예요. 0의 개수를 다시 세어 봐요.", "200000000": "2는 천만의 자리 숫자예요. 0이 하나 많아요." } },
        { q: "20480000에서 백만의 자리 숫자는?", t: "pick", o: ["2", "0", "4"], a: 1, why: { "0": "2는 천만의 자리 숫자예요.", "2": "4는 십만의 자리 숫자예요." } },
        { q: "각 자리 숫자가 나타내는 값의 합으로 나타내 보세요.", t: "line", parts: ["20480000 = 20000000 + ", { a: 400000 }, " + ", { a: 80000 }] }], { ok: "20480000은 각 자리 숫자가 나타내는 값의 합이에요." }),
        { q: "20480000을 ‘2048만’이라고도 쓸 수 있는 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 일의 자리부터 네 자리씩 끊어 봐요. → ② 앞의 네 자리가 10000이 몇 개인지 생각해요.", "‘왜냐하면 네 자리씩 끊으면 ~ / ~이라서 10000이 ~개인 수이기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 일의 자리부터 네 자리씩 끊으면 2048 / 0000이라서, 10000이 2048개인 수이기 때문이에요." }) },
    { name: "약속하기 — 십만, 백만, 천만", inst: "십만, 백만, 천만의 약속을 완성해요.", hints: ["10000이 10개, 100개, 1000개이면 0이 하나씩 늘어나요.", "10000이 2048개이면 2048 뒤에 0을 4개 붙여요."],
      render: (b, a) => blanks(b, a, ["10000이 10개인 수를 100000 또는 10만이라 쓰고 ", { o: ["만십", "십만", "일십만"], a: 1 }, "이라고 읽어요. 10000이 100개인 수는 ", { o: ["100만", "10만", "1000만"], a: 0 }, ", 1000개인 수는 ", { o: ["100만", "1억", "1000만"], a: 2 }, "이에요. 10000이 2048개인 수를 20480000 또는 ", { o: ["2048천", "2048만", "20만 480"], a: 1 }, "이라 쓰고, ", { o: ["이천사십팔만", "이만 사백팔십", "이백사만 팔천"], a: 0 }, "이라고 읽어요."]) },
    { name: "확인하기 — 쓰고 읽기", inst: "천만 단위까지의 수를 쓰고 읽어 보세요.", hints: ["일의 자리부터 네 자리씩 끊고, 앞의 수에 ‘만’을 붙여 읽어요.", "생활에서 쓰는 쉼표(,)는 세 자리마다 찍어요. 읽을 때는 네 자리씩 끊어요."],
      render: (b, a) => n1sAsk(b, a, [
        { q: "오백칠만 삼천을 수로 써 보세요.", t: "num", a: 5073000, why: { "507300": "‘만’ 아래에는 네 자리가 있어요. 삼천은 3000이에요.", "50703000": "오백칠만은 507만이에요. 0이 하나 많아요." } },
        { q: "30600000을 읽어 보세요.", t: "read", a: 30600000 },
        { q: "과학관 안내판에 ‘1,250,000명’이라고 쓰여 있어요. 쉼표는 세 자리마다 찍은 거예요. 네 자리씩 끊어 읽어 보세요.", t: "read", a: 1250000 },
        { q: "10만 원 묶음이 10개이면 모두 얼마인가요?", t: "pick", o: ["10만 원", "100만 원", "1000만 원"], a: 1 }], { ok: "천만 단위까지의 수를 쓰고 읽을 수 있어요. 쉼표가 있어도 네 자리씩 끊어 읽었어요!" }) }
  ],
  challenge: { inst: "과학관의 ‘꿈나무 우주 교실’ 기금이 3050000원 모였대요. 돈 모형을 가장 적게 써서 3050000원을 만들어 보세요.", hints: ["3050000을 네 자리씩 끊으면 305 / 0000이에요.", "100만 원 묶음 3개, 10만 원 묶음 0개, 10000원 5장이에요."],
    render: (b, a) => n1sMoney(b, a, { denoms: [1000000, 100000, 10000], fewest: true, steps: { 1000000: [1], 100000: [1], 10000: [1] }, words: ["100만이 3개", "1만이 5개"], targets: [{ v: 3050000, say: "**3050000원**(305만 원)을 가장 적은 수의 돈 모형으로 만들어 보세요.", ok: "100만 원 묶음 3개와 10000원 5장, 모두 3050000원이에요. 십만의 자리 숫자는 0이에요." }] }) }
},
{
  id: "s5", no: 5, title: "태양까지 얼마나 멀까 ― 억", soop: "개념 구축하기(O)",
  question: "1000만이 10개인 수는 어떻게 쓰고 읽을까요?",
  summary: "1000만이 10개인 수를 100000000 또는 1억이라 쓰고, 억 또는 일억이라고 읽어요. 지구에서 태양까지는 약 1억 5000만 km예요. 1억이 14개, 1만이 3000개인 수는 1430000000(14억 3000만)이고, 십사억 삼천만이라고 읽어요.",
  steps: [
    { name: "만져 보기 — 1억까지 모으기", inst: "지구에서 태양까지는 약 150000000 km래요(어림값). 이 수를 알아보려고 1만에서 시작해 ‘10개 모으기’로 10배씩 키워 보세요.",
      hints: ["1만이 10개이면 10만, 10만이 10개이면 100만이에요.", "1000만이 10개인 수는 1 뒤에 0이 8개예요."],
      render: (b, a) => n1sTimes(b, a, { start: 10000, times: 4, cols: 12, group: 2, ask: [
        { q: "1000만이 10개인 수를 0을 모두 써서 나타내 보세요.", t: "num", a: 100000000, digits: true, why: { "10000000": "그것은 1000만이에요. 1000만이 10개이면 0이 하나 더 붙어요." } },
        { q: "지구에서 태양까지 약 1억 5000만 km예요. 1억 5000만을 0을 모두 써서 나타내 보세요.", t: "num", a: 150000000, digits: true, why: { "15000000": "1억은 0이 8개예요. 1억 5000만은 아홉 자리 수예요.", "100005000": "5000만은 50000000이에요. ‘만’ 아래 네 자리를 생각해요." } }],
        ok: "1000만이 10개인 수는 1억이에요. 지구에서 태양까지는 약 150000000 km, 1억 5000만 km예요!" }) },
    { name: "그려 보기 — 토성까지의 거리", inst: "태양에서 토성까지는 약 1430000000 km래요(어림값). 자릿값 표에 숫자 카드로 나타내 보세요.",
      hints: ["일의 자리부터 네 자리씩 끊으면 14 / 3000 / 0000이에요.", "14는 ‘억’ 아래 십, 일 칸에 놓아요."],
      render: (b, a) => n1sChart(b, a, { cols: 12, value: 1430000000, group: 2, say: "태양에서 토성까지 약 1430000000 km", ok: "1430000000은 1억이 14개, 1만이 3000개인 수, 14억 3000만이에요." }) },
    { name: "말해 보기 — 얼마만큼의 수일까", inst: "1430000000은 얼마만큼의 수인지 말하고, 읽는 방법의 까닭을 써 보세요.",
      hints: ["1은 십억의 자리 숫자예요.", "4는 억의 자리, 3은 천만의 자리 숫자예요."],
      render: thenWhy((b, a) => n1sAsk(b, a, [
        { q: "각 자리 숫자가 나타내는 값의 합으로 나타내 보세요.", t: "line", parts: ["1430000000 = ", { a: 1000000000 }, " + 400000000 + ", { a: 30000000 }] },
        { q: "1430000000에서 숫자 1은 몇의 자리 숫자인가요?", t: "pick", o: ["억의 자리", "십억의 자리", "백억의 자리"], a: 1, why: { "0": "4가 억의 자리 숫자예요. 1은 그보다 한 자리 높아요." } },
        { q: "1억이 10개, 100개, 1000개인 수를 바르게 쓴 것은?", t: "pick", o: ["10만, 100만, 1000만", "10억, 100억, 1000억", "1억 10, 1억 100, 1억 1000"], a: 1 }], { ok: "1억이 10개이면 10억, 100개이면 100억, 1000개이면 1000억이에요." }),
        { q: "1430000000을 ‘십사억 삼천만’이라고 읽는 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 일의 자리부터 네 자리씩 끊어 봐요. → ② 끊은 덩어리마다 억, 만을 붙여 봐요.", "‘왜냐하면 네 자리씩 끊으면 ~ / ~ / ~이라서 1억이 ~개, 1만이 ~개이기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 일의 자리부터 네 자리씩 끊으면 14 / 3000 / 0000이라서, 1억이 14개, 1만이 3000개인 수이기 때문이에요." }) },
    { name: "약속하기 — 억", inst: "억의 약속을 완성해요.", hints: ["1000만이 10개이면 0이 8개인 수예요.", "45억은 1억이 몇 개인지 생각해요."],
      render: (b, a) => blanks(b, a, ["1000만이 10개인 수를 ", { o: ["10000000", "1000000000", "100000000"], a: 2 }, " 또는 ", { o: ["1억", "1000만", "10천만"], a: 0 }, "이라 쓰고, ", { o: ["천만", "억 또는 일억", "십천만"], a: 1 }, "이라고 읽어요. 태양에서 해왕성까지는 약 45억 km예요. 45억은 1억이 ", { o: ["4500개", "45개", "450개"], a: 1 }, "인 수예요."]) },
    { name: "확인하기 — 행성까지의 거리", inst: "태양에서 행성까지의 거리(어림값)를 쓰거나 읽어 보세요.", hints: ["일의 자리부터 네 자리씩 끊고 억, 만을 붙여 읽어요.", "778000000 → 7 / 7800 / 0000"],
      render: (b, a) => n1sAsk(b, a, [
        { q: "태양에서 화성까지는 약 이억 이천팔백만 km예요. 수로 써 보세요.", t: "num", a: 228000000, unit: "km", why: { "22800000": "이억은 1억이 2개예요. 아홉 자리 수가 되어야 해요.", "200002800": "이천팔백만은 2800만이에요. ‘만’ 아래 네 자리는 0000이에요." } },
        { q: "태양에서 목성까지는 약 778000000 km예요. 읽어 보세요.", t: "read", a: 778000000 },
        { q: "태양에서 천왕성까지는 약 2870000000 km예요. 읽어 보세요.", t: "read", a: 2870000000 },
        { q: "태양에서 해왕성까지 약 45억 km를 0을 모두 써서 나타내 보세요.", t: "num", a: 4500000000, digits: true, unit: "km", why: { "450000000": "45억은 1억이 45개예요. 0이 8개 붙어요." } }], { ok: "천억 단위까지의 수를 쓰고 읽을 수 있어요. 행성들은 정말 멀리 있어요!" }) }
  ],
  challenge: { inst: "억 단위의 수를 더 알아보세요.", hints: ["1000억은 1억이 1000개예요.", "3500억 260만 → 3500 / 0260 / 0000"],
    render: (b, a) => n1sAsk(b, a, [
      { q: "우리 은하에는 별이 1000억 개가 넘는다고 해요(어림값). 1000억을 0을 모두 써서 나타내 보세요.", t: "num", a: 100000000000, digits: true },
      { q: "1억이 3500개, 1만이 260개인 수를 써 보세요.", t: "num", a: 350002600000, why: { "35002600000": "1만이 260개이면 ‘만’ 아래 네 자리 칸에는 0260이 들어가요. 자리를 다시 세어 봐요." } },
      { q: "위의 수를 읽어 보세요.", t: "read", a: 350002600000 },
      { q: "504360000000에 대해 옳게 말한 것을 고르세요.", t: "pick", o: ["㉠ 숫자 5는 5000억을 나타내요.", "㉡ 숫자 3은 백억의 자리 숫자예요.", "㉢ 십억의 자리 숫자는 0이에요."], a: 0, why: { "1": "504360000000을 네 자리씩 끊으면 5043 / 6000 / 0000이에요. 3은 억의 자리 숫자예요.", "2": "십억의 자리 숫자는 4예요." } }], { ok: "천억 단위까지의 수를 자유롭게 다루었어요!" }) }
},
{
  id: "s6", no: 6, title: "빛이 1년 동안 가는 거리 ― 조", soop: "개념 구축하기(O)",
  question: "1000억이 10개인 수는 어떻게 쓰고 읽을까요?",
  summary: "1000억이 10개인 수를 1000000000000 또는 1조라 쓰고, 조 또는 일조라고 읽어요. 빛이 1년 동안 가는 거리는 약 9460000000000 km, 9조 4600억 km이고, 구조 사천육백억이라고 읽어요.",
  steps: [
    { name: "만져 보기 — 1조까지 모으기", inst: "이웃 은하인 안드로메다은하에는 별이 약 1조 개 있다고 해요(어림값). 먼저 예상을 쓰고, 1억에서 시작해 ‘10개 모으기’로 10배씩 키워 보세요.",
      hints: ["1억이 10개이면 10억, 10억이 10개이면 100억이에요.", "1000억이 10개인 수는 1 뒤에 0이 12개예요."],
      render: ruleFirst((b, a) => n1sTimes(b, a, { start: 100000000, times: 4, cols: 16, group: 3, ask: [{ q: "1000억이 10개인 수를 0을 모두 써서 나타내 보세요.", t: "num", a: 1000000000000, digits: true, why: { "100000000000": "그것은 1000억이에요. 1000억이 10개이면 0이 하나 더 붙어요." } }], ok: "1000억이 10개인 수는 1000000000000, 1조예요. 안드로메다은하에는 별이 약 1조 개래요!" }),
        { q: "1억에서 10개씩 4번 모으면 어떤 수가 될까요?", ph: "내 예상: ~", help: ["① 1억, 10억, 100억… 차례대로 떠올려요. → ② 1000억 다음에 새 이름이 나오는지 생각해요.", "‘내 예상: 1억 → ~ → ~ → ~ → ~이 될 것 같아요.’ 꼴로 써요."],
          ans: "1억 → 10억 → 100억 → 1000억 → 1조가 돼요. 1조는 1 뒤에 0이 12개예요." }) },
    { name: "그려 보기 — 1광년을 표에", inst: "빛이 1년 동안 가는 거리(1광년)는 약 9460000000000 km래요(어림값). 자릿값 표에 숫자 카드로 나타내 보세요.",
      hints: ["일의 자리부터 네 자리씩 끊으면 9 / 4600 / 0000 / 0000이에요.", "9는 ‘조’ 아래 일 칸에 놓아요."],
      render: (b, a) => n1sChart(b, a, { cols: 16, value: "9460000000000", group: 3, say: "빛이 1년 동안 가는 거리 약 9460000000000 km", ok: "9460000000000은 1조가 9개, 1억이 4600개인 수, 9조 4600억이에요." }) },
    { name: "말해 보기 — 얼마만큼의 수일까", inst: "9460000000000은 얼마만큼의 수인지 말하고, 까닭을 써 보세요.",
      hints: ["9는 조의 자리 숫자예요.", "4는 천억의 자리, 6은 백억의 자리 숫자예요."],
      render: thenWhy((b, a) => n1sAsk(b, a, [
        { q: "각 자리 숫자가 나타내는 값의 합으로 나타내 보세요.", t: "line", parts: ["9460000000000 = ", { a: "9000000000000" }, " + 400000000000 + ", { a: "60000000000" }] },
        { q: "9460000000000에서 숫자 4는 몇의 자리 숫자인가요?", t: "pick", o: ["백억의 자리", "천억의 자리", "조의 자리"], a: 1, why: { "0": "6이 백억의 자리 숫자예요.", "2": "9가 조의 자리 숫자예요." } }], { ok: "9조 4600억은 각 자리 숫자가 나타내는 값의 합이에요." }),
        { q: "9460000000000을 ‘9조 4600억’이라고 쓰는 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 일의 자리부터 네 자리씩 끊어 봐요. → ② 덩어리마다 조, 억, 만을 붙여 봐요.", "‘왜냐하면 네 자리씩 끊으면 ~이라서 1조가 ~개, 1억이 ~개이기 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 일의 자리부터 네 자리씩 끊으면 9 / 4600 / 0000 / 0000이라서, 1조가 9개, 1억이 4600개인 수이기 때문이에요." }) },
    { name: "약속하기 — 조", inst: "조의 약속을 완성해요.", hints: ["1000억이 10개인 수는 0이 12개예요."],
      render: (b, a) => blanks(b, a, ["1000억이 10개인 수를 ", { o: ["1000000000000", "100000000000", "10000000000000"], a: 0 }, " 또는 ", { o: ["10억", "1조", "1000조"], a: 1 }, "라 쓰고, ", { o: ["조 또는 일조", "십억", "천조"], a: 0 }, "라고 읽어요. 1조가 9개, 1억이 4600개인 수는 ", { o: ["9억 4600만", "9조 4600억", "94조 600억"], a: 1 }, "이에요."]) },
    { name: "확인하기 — 쓰고 읽기", inst: "천조 단위까지의 수를 쓰거나 읽어 보세요.", hints: ["조, 억, 만 사이에는 네 자리씩 있어요. 비어 있는 자리에는 0을 써요.", "50080000000000 → 50 / 0800 / 0000 / 0000"],
      render: (b, a) => n1sAsk(b, a, [
        { q: "삼조 칠백억 이십만을 수로 써 보세요.", t: "num", a: "3070000200000", why: { "37000200000": "‘억’ 아래 네 자리에 0700, ‘만’ 아래 네 자리에 0020이 들어가요. 자리를 다시 세어 봐요." } },
        { q: "50080000000000을 읽어 보세요.", t: "read", a: "50080000000000" },
        { q: "1조가 10개인 수를 써 보세요.", t: "num", a: "10000000000000" },
        { q: "설명하는 수가 다른 하나를 고르세요.", t: "pick", o: ["㉠ 1000억이 10개인 수", "㉡ 10억이 1000개인 수", "㉢ 9999억보다 1억만큼 더 큰 수", "㉣ 1억이 1000개인 수"], a: 3, why: { "0": "1000억이 10개이면 1조예요.", "1": "10억이 1000개이면 1조예요.", "2": "9999억보다 1억만큼 더 큰 수는 1조예요." } }], { ok: "천조 단위까지의 수를 쓰고 읽을 수 있어요." }) }
  ],
  challenge: { inst: "탐험 일지에 나만의 큰 수를 적어 보세요. ‘1조가 □개, 1억이 □개, 1만이 □개인 수’의 □를 마음대로 채우고, 그 수를 숫자로 써 보세요. (예: 1조가 9개, 1억이 4600개, 1만이 25개인 수 → 9460000250000)", hints: ["9조 4600억 25만처럼 먼저 섞어 써 봐요.", "만 아래 네 자리(일, 십, 백, 천의 자리)에는 0을 4개 써요."],
    render: (b, a) => n1sDescribe(b, a, { units: ["조", "억", "만"] }) }
},
{
  id: "s7", no: 7, title: "빛처럼 뛰어 세기 ― 뛰어 세기", soop: "개념 구축하기(O)",
  question: "큰 수를 뛰어 세면 어느 자리 숫자가 어떻게 변할까요?",
  summary: "30만씩 뛰어 세면 십만의 자리 숫자가 3씩 커지고, 90만 다음은 120만처럼 백만의 자리로 올라가요. 1억씩 뛰어 세면 억의 자리 숫자가 1씩 커져요. 뛰어 세기를 할 때에는 어느 자리 숫자가 얼마씩 변하는지 살펴봐요.",
  steps: [
    { name: "만져 보기 — 빛과 로켓 뛰어 세기", inst: "빛은 1초에 약 30만 km를 가요(어림값). 탐험대는 우주 탐험 게임 속 로켓도 뛰어 세어 보기로 했어요. 먼저 예상을 쓰고 뛰어 세어 보세요.",
      hints: ["얼마씩 뛸지 먼저 고르고 ‘한 번 뛰기’를 눌러요.", "빛은 1초마다 30만 km씩, 게임 속 로켓은 한 번에 1억 km씩 가요."],
      render: ruleFirst((b, a) => n1sHop(b, a, { choices: [100000, 300000, 10000000, 100000000], tasks: [
        { start: 300000, step: 300000, n: 3, say: "**빛**: 1초 동안 가는 30만 km에서 시작해 4초까지 뛰어 세어 보세요.", why: "빛은 1초에 약 30만 km씩 가요.", ok: "30만, 60만, 90만, 120만 km! 빛은 1초가 조금 넘으면 약 38만 km 떨어진 달에 닿아요." },
        { start: 150000000, step: 100000000, n: 3, say: "**게임 속 로켓**: 1억 5000만 km에서 시작해 한 번에 1억 km씩 3번 뛰어 세어 보세요.", why: "게임 속 로켓은 한 번에 1억 km씩 날아가요.", ok: "1억 5000만, 2억 5000만, 3억 5000만, 4억 5000만 km예요." }],
        ok: "30만씩 뛰면 십만의 자리 숫자가 3씩, 1억씩 뛰면 억의 자리 숫자가 1씩 커져요." }),
        { q: "30만씩 뛰어 세면 어느 자리 숫자가 어떻게 변할까요?", ph: "내 예상: ~의 자리 숫자가 ~씩", help: ["① 30만에서 0이 아닌 숫자 3이 어느 자리에 있는지 봐요. → ② 그 자리 숫자가 한 번 뛸 때마다 얼마씩 커질지 생각해요.", "‘내 예상: ~의 자리 숫자가 ~씩 커질 것 같아요.’ 꼴로 써요."],
          ans: "30만씩 뛰어 세면 십만의 자리 숫자가 3씩 커져요. 90만 다음에는 십만의 자리 숫자가 10을 넘어 백만의 자리로 올라가서 120만이 돼요." }) },
    { name: "그려 보기 — 얼마씩 뛰었을까", inst: "얼마씩 뛰어 세었는지 알아보세요. 답은 500억, 2억처럼 써도 돼요.",
      hints: ["두 수에서 숫자가 바뀐 자리를 찾아봐요.", "그 자리 숫자가 얼마씩 커졌는지 보면 얼마씩 뛰어 세었는지 알 수 있어요."],
      render: (b, a) => n1sAsk(b, a, [
        { q: "게임 속 로켓 연구비가 2600억 – 3100억 – 3600억 – 4100억으로 늘었어요. 얼마씩 뛰어 세었나요?", fig: n1HopFig(["2600억", "3100억", "3600억", "4100억"], "+ ?"), t: "num", a: 50000000000, kb: "text", unit: "씩", why: { "500": "‘억’이 붙어 있어요. 2600억과 3100억의 차이는 500억이에요.", "5000000000": "0의 개수를 다시 세어 봐요. 2600억과 3100억의 차이는 500억이에요." } },
        { q: "4320000000 – 4520000000 – 4720000000 – 4920000000은 얼마씩 뛰어 세었나요?", fig: n1HopFig(["4320000000", "4520000000", "4720000000", "4920000000"], "+ ?", { fs: 19 }), t: "num", a: 200000000, kb: "text", unit: "씩", why: { "100000000": "억의 자리 숫자가 1씩이 아니라 2씩 커졌어요.", "20000000": "0의 개수를 다시 세어 봐요. 억의 자리 숫자가 2씩 커졌어요." } },
        { q: "두 번째 뛰어 세기에서 숫자가 변하는 자리는?", t: "pick", o: ["천만의 자리", "억의 자리", "십억의 자리"], a: 1 }], { ok: "이웃한 두 수의 차이가 500억이면 500억씩, 억의 자리 숫자가 2씩 커지면 2억씩 뛰어 센 거예요." }) },
    { name: "말해 보기 — 내가 정해서 뛰어 세기", inst: "얼마씩 뛰어 셀지 내가 정해서 1조부터 4번 뛰어 세어 보세요. 어느 자리 숫자가 변했는지 고르고, 까닭을 써 보세요.",
      hints: ["원하는 만큼을 하나 고르고 ‘한 번 뛰기’를 4번 눌러요.", "빨간 숫자가 바뀐 자리예요."],
      render: thenWhy((b, a) => n1sHop(b, a, { free: { start: 1000000000000, n: 4, choices: [100000000000, 1000000000000, 2000000000000, 10000000000000], places: [11, 12, 13] }, say: "내가 정한 만큼씩 **1조**부터 4번 뛰어 세어 보세요.", friend: "라온이는 1조씩 뛰어 세었대요: 1조, 2조, 3조, 4조, 5조. 내 것과 비교해 봐요." }),
        { q: "내가 고른 만큼 뛰어 세면 왜 그 자리 숫자만 변할까요?", ph: "왜냐하면 ~", help: ["① 내가 고른 수에서 0이 아닌 숫자가 어느 자리에 있는지 봐요. → ② 더할 때 어느 자리 숫자가 바뀌는지 생각해요.", "‘왜냐하면 더하는 수의 0이 아닌 숫자가 ~의 자리에만 있어서 ~ 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 더하는 수의 0이 아닌 숫자가 그 자리에만 있어서, 뛸 때마다 그 자리 숫자만 커지기 때문이에요." }) },
    { name: "약속하기 — 뛰어 세기", inst: "뛰어 세기의 약속을 완성해요.", hints: ["30만에서 3은 십만의 자리 숫자예요.", "90만에서 30만을 더 뛰면 십만의 자리 숫자가 10을 넘어 백만의 자리로 올라가요."],
      render: (b, a) => blanks(b, a, ["30만씩 뛰어 세면 ", { o: ["만", "십만", "백만"], a: 1 }, "의 자리 숫자가 3씩 커져요. 30만씩 뛰어 셀 때 90만 다음 수는 ", { o: ["93만", "900만", "120만"], a: 2 }, "이에요. 뛰어 세기를 할 때에는 ", { o: ["0이 모두 몇 개인지만", "어느 자리 숫자가 얼마씩 변하는지"], a: 1 }, " 살펴봐요."]) },
    { name: "확인하기 — 빈칸 채우기", inst: "뛰어 세기를 하여 빈 곳에 알맞은 수를 써넣어 보세요. ‘38억’처럼 써도 돼요.", hints: ["먼저 이웃한 두 수를 보고 얼마씩 뛰어 세었는지 찾아요.", "빈칸이 맨 앞에 있으면 거꾸로 뛰어 세어요."],
      render: (b, a) => n1sAsk(b, a, [
        { t: "line", parts: ["240000, 270000, ", { a: 300000 }, ", ", { a: 330000 }] },
        { t: "line", parts: ["8조 500억, 8조 1500억, ", { a: "8250000000000", show: "8조 2500억" }, ", ", { a: "8350000000000", show: "8조 3500억" }] },
        { t: "line", parts: [{ a: 3800000000, show: "38억" }, ", 48억, 58억, 68억"] },
        { q: "과학관 ‘별빛 기금’은 1월에 40만 원이었고, 매달 15만 원씩 늘었어요. 4월에는 얼마인가요? (85만처럼 써도 돼요)", t: "num", a: 850000, kb: "text", unit: "원", why: { "1000000": "1월에서 4월까지는 3번 늘었어요. 15만씩 3번 뛰어 세어요.", "700000": "4월까지 15만 원씩 3번 늘었어요. 한 번 더 뛰어 세어요." } }], { ok: "3만씩, 1000억씩, 10억씩, 15만씩 뛰어 세었어요." }) }
  ],
  challenge: { inst: "뛰어 세기로 탐험대 문제를 해결해 보세요.", hints: ["거꾸로 뛰어 세면 처음 수를 찾을 수 있어요.", "12조 750억과 15조 750억의 차이를 생각해요."],
    render: (b, a) => n1sAsk(b, a, [
      { q: "★에서 50만씩 4번 뛰어 세었더니 380만이 되었어요. ★은 얼마인가요? (180만처럼 써도 돼요)", t: "num", a: 1800000, kb: "text", why: { "5800000": "380만에서 50만씩 거꾸로 뛰어 세어야 해요.", "3300000": "50만씩 4번이에요. 한 번만 거꾸로 뛰었어요." } },
      { q: "200조씩 뛰어 세어 보세요.", t: "line", parts: ["3018조, 3218조, ", { a: "3418000000000000", show: "3418조" }, ", ", { a: "3618000000000000", show: "3618조" }] },
      { q: "12조 750억 – 15조 750억 – 18조 750억은 얼마씩 뛰어 세었나요?", t: "num", a: 3000000000000, kb: "text", unit: "씩", why: { "300000000000": "조의 자리 숫자가 3씩 커졌어요. 3000억이 아니라 3조예요." } }], { ok: "뛰어 세기의 규칙을 찾아 문제를 해결했어요!" }) }
},
{
  id: "s8", no: 8, title: "어느 쪽이 더 멀까요 ― 수의 크기 비교", soop: "개념 구축하기(O)",
  question: "큰 수의 크기는 어떻게 비교할까요?",
  summary: "자리 수가 다르면 자리 수가 많은 쪽이 더 큰 수예요. 자리 수가 같으면 높은 자리 수부터 차례대로 비교하여 높은 자리 수가 큰 쪽이 더 큰 수예요. 형태가 다르면 먼저 같은 형태로 바꾸어 비교해요.",
  steps: [
    { name: "만져 보기 — 표에서 비교하기", inst: "탐험대가 우주 거리 두 쌍을 비교해요(모두 어림값). 먼저 비교 방법을 예상하고, 표에서 크기가 정해지는 자리를 누른 뒤 부등호를 골라요.",
      hints: ["두 수가 각각 몇 자리 수인지 세어 봐요.", "자리 수가 같으면 가장 높은 자리부터 차례대로 비교해요."],
      render: ruleFirst((b, a) => n1sCompare(b, a, { pairs: [
        { a: 1390000, b: 384400, la: "태양 지름", lb: "지구~달", say: "태양의 지름은 약 **1390000 km**, 지구에서 달까지는 약 **384400 km**예요.", ok: "1390000은 일곱 자리, 384400은 여섯 자리예요. 태양의 지름이 지구에서 달까지의 거리보다 더 길어요!" },
        { a: 147100000, b: 152100000, la: "가까울 때", lb: "멀 때", say: "지구와 태양 사이는 가까울 때 약 **147100000 km**, 멀 때 약 **152100000 km**예요.", ok: "두 수 모두 아홉 자리예요. 억의 자리가 같아서 천만의 자리에서 4 < 5로 비교했어요." }] }),
        { q: "자리 수가 다른 두 수, 자리 수가 같은 두 수는 각각 어떻게 비교할까요?", ph: "내 예상: 자리 수가 다르면 ~, 같으면 ~", help: ["① 999와 1000처럼 자리 수가 다른 두 수를 떠올려요. → ② 2075와 2105처럼 자리 수가 같은 두 수를 비교한 방법을 떠올려요.", "‘내 예상: 자리 수가 다르면 ~, 자리 수가 같으면 ~부터 비교할 것 같아요.’ 꼴로 써요."],
          ans: "자리 수가 다르면 자리 수가 많은 쪽이 더 커요. 자리 수가 같으면 가장 높은 자리부터 차례대로 비교해서, 숫자가 처음 달라지는 자리에서 숫자가 큰 쪽이 더 커요." }) },
    { name: "그려 보기 — 부등호로 나타내기", inst: "두 수의 크기를 비교하여 ○ 안에 >, =, < 중 알맞은 것을 골라요.",
      hints: ["먼저 자리 수를 세어요.", "형태가 다르면 같은 형태로 바꾸어 생각해요. 38만 = 380000"],
      render: (b, a) => n1sAsk(b, a, [
        { t: "cmp", l: 527300, r: 4180000, why: { ">": "앞자리 숫자만 보면 안 돼요. 527300은 여섯 자리, 4180000은 일곱 자리예요." } },
        { t: "cmp", l: 2872500000, r: 2817900000, why: { "<": "십억, 억의 자리까지 같아요. 천만의 자리 숫자 7과 1을 비교해요." } },
        { t: "cmp", l: 9460000000000, r: 946000000000, ls: "9조 4600억", rs: "9460억", why: { "<": "9조 4600억을 숫자로 쓰면 13자리, 9460억은 12자리예요." } },
        { t: "cmp", l: 380000, r: 380000, ls: "38만", rs: "380000", why: { ">": "38만을 숫자로 쓰면 380000이에요. 두 수는 같아요.", "<": "38만을 숫자로 쓰면 380000이에요. 두 수는 같아요." } }], { ok: "자리 수를 먼저 보고, 같으면 높은 자리부터 비교했어요. 형태가 다른 수는 같은 형태로 바꾸었어요." }) },
    { name: "말해 보기 — 하늘이의 말 고치기", inst: "하늘이가 ‘384400이 1390000보다 커요. 3이 1보다 크니까요.’라고 말했어요. 하늘이의 생각을 바르게 고쳐 보세요.",
      hints: ["두 수의 자리 수를 세어 봐요.", "같은 숫자라도 자리에 따라 나타내는 값이 달라요."],
      render: thenWhy((b, a) => n1sAsk(b, a, [
        { q: "하늘이의 말을 바르게 고친 것을 고르세요.", t: "pick", o: ["두 수의 첫 숫자를 비교하면 되니까 384400이 더 커요.", "384400은 여섯 자리, 1390000은 일곱 자리라서 1390000이 더 커요.", "0이 많은 수가 언제나 더 커요."], a: 1, why: { "0": "384400의 3은 십만의 자리, 1390000의 1은 백만의 자리 숫자예요. 나타내는 값이 달라요.", "2": "0의 개수가 아니라 자리 수와 높은 자리의 숫자를 봐야 해요." } },
        { q: "‘2억 2800만’과 ‘778000000’을 비교할 때 가장 먼저 할 일은?", t: "pick", o: ["앞에 쓴 숫자 2와 7만 비교해요.", "두 수를 같은 형태로 바꾸어요."], a: 1 }], { ok: "자리 수를 세고, 형태가 다르면 같은 형태로 바꾸는 것이 먼저예요." }),
        { q: "앞자리 숫자만 보고 크기를 정하면 안 되는 까닭은 무엇일까요?", ph: "왜냐하면 ~", help: ["① 384400의 3과 1390000의 1이 각각 어느 자리 숫자인지 봐요. → ② 두 수의 자리 수를 견주어요.", "‘왜냐하면 자리 수가 다르면 앞자리 숫자가 나타내는 값이 ~ 때문이에요.’ 꼴로 써요."],
          ans: "왜냐하면 자리 수가 다르면 앞자리 숫자가 나타내는 값이 달라서, 자리 수가 많은 수가 더 크기 때문이에요." }) },
    { name: "약속하기 — 크기 비교", inst: "수의 크기를 비교하는 방법을 정리해요.", hints: ["1390000 > 384400 (일곱 자리 수 > 여섯 자리 수)", "147100000 < 152100000 (천만의 자리에서 4 < 5)"],
      render: (b, a) => blanks(b, a, ["자리 수가 다를 때에는 자리 수가 ", { o: ["적은", "많은"], a: 1 }, " 쪽이 더 큰 수예요. 자리 수가 같을 때에는 ", { o: ["높은", "낮은"], a: 0 }, " 자리 수부터 차례대로 비교하여 높은 자리 수가 ", { o: ["작은", "큰"], a: 1 }, " 쪽이 더 큰 수예요."]) },
    { name: "확인하기 — 가까운 행성부터", inst: "태양에서 행성까지의 거리예요(어림값). 태양에서 가까운 행성부터 차례대로 눌러 보세요.",
      hints: ["‘수의 형태를 같게 보기’를 눌러 네 수를 같은 형태로 바꿔 봐요.", "자리 수를 먼저 세고, 같으면 높은 자리부터 비교해요."],
      render: (b, a) => n1sRank(b, a, { dir: "asc", convert: true, items: [
        { name: "화성", show: "약 2억 2800만 km", v: "228000000" },
        { name: "목성", show: "약 778000000 km", v: "778000000" },
        { name: "토성", show: "약 십사억 삼천만 km", v: "1430000000" },
        { name: "지구", show: "약 1억 5000만 km", v: "150000000" }],
        ok: "지구(1억 5000만) < 화성(2억 2800만) < 목성(7억 7800만) < 토성(14억 3000만)이에요. 같은 형태로 바꾸고 자리 수부터 비교했어요." }) }
  ],
  challenge: { inst: "큰 수의 크기 비교를 더 해 보세요.", hints: ["38□200과 384400은 천의 자리만 달라질 수 있어요.", "9조, 990억, 9000억을 같은 형태로 바꾸어 봐요."],
    render: (b, a) => n1sAsk(b, a, [
      { q: "38□200 > 384400에서 □ 안에 들어갈 수 있는 수를 모두 고르세요.", t: "pick", o: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], a: [5, 6, 7, 8, 9], why: { "4,5,6,7,8,9": "4를 넣으면 384200이 되어 384400보다 작아요." } },
      { q: "큰 수부터 차례대로 쓴 것을 고르세요. ㉠ 9조  ㉡ 99000000000  ㉢ 9000억", t: "pick", o: ["㉠, ㉢, ㉡", "㉡, ㉢, ㉠", "㉢, ㉠, ㉡"], a: 0, why: { "1": "99000000000은 990억이에요. 같은 형태로 바꾸어 비교해 봐요." } }], { ok: "□ 안의 수, 형태가 다른 수까지 비교했어요!" }) }
},
{
  id: "s9", no: 9, title: "우주 거리 사다리 ― 형태가 다른 큰 수 비교", soop: "탐구 정리하기(O)",
  question: "형태가 다른 큰 수의 크기를 어떻게 비교할까요?",
  summary: "수의 형태가 다르면 먼저 같은 형태로 바꾸어요. 그다음 자리 수를 비교하고, 자리 수가 같으면 높은 자리 수부터 차례대로 비교해요. 우주의 거리처럼 아주 큰 수도 이 방법으로 차례를 정할 수 있어요.",
  steps: [
    { name: "만져 보기 — 같은 형태로 바꾸기", inst: "탐험대가 모은 우주 거리 카드예요(모두 어림값). 수의 형태가 제각각이에요. 0을 모두 써서 숫자로 나타내 보세요.",
      hints: ["38만 → 38 / 0000", "9조 4600억 → 9 / 4600 / 0000 / 0000"],
      render: (b, a) => n1sAsk(b, a, [
        { q: "지구에서 달까지 약 38만 km", fig: n1sFactsFig([{ name: "지구 → 달", show: "약 38만 km" }, { name: "태양 → 해왕성", show: "약 사십오억 km" }, { name: "빛이 1년 동안 가는 거리", show: "약 9조 4600억 km" }, { name: "보이저 1호 (2024년)", show: "240억 km보다 멀리" }], "탐험대 우주 거리 카드 (어림값)", { cols: 2 }), t: "num", a: 380000, digits: true, unit: "km" },
        { q: "태양에서 해왕성까지 약 사십오억 km", t: "num", a: 4500000000, digits: true, unit: "km", why: { "450000000": "사십오억은 1억이 45개예요. 열 자리 수가 되어야 해요." } },
        { q: "빛이 1년 동안 가는 거리 약 9조 4600억 km", t: "num", a: "9460000000000", digits: true, unit: "km" },
        { q: "탐사선 보이저 1호는 2024년에 지구에서 240억 km보다 더 멀리 날아갔어요. 240억을 0을 모두 써서 나타내 보세요.", t: "num", a: 24000000000, digits: true, unit: "km" }], { ok: "네 수를 모두 같은 형태(숫자)로 나타냈어요. 이제 자리 수를 셀 수 있어요." }) },
    { name: "그려 보기 — 우주 거리 사다리", inst: "먼 것부터 사다리를 쌓아요. 가장 먼 것부터 차례대로 눌러 보세요.",
      hints: ["‘수의 형태를 같게 보기’를 눌러 확인해요.", "자리 수가 많을수록 더 멀어요."],
      render: (b, a) => n1sRank(b, a, { dir: "desc", convert: true, items: [
        { name: "지구 → 달", show: "약 38만 km", v: "380000" },
        { name: "지구 → 태양", show: "약 150000000 km", v: "150000000" },
        { name: "태양 → 해왕성", show: "약 사십오억 km", v: "4500000000" },
        { name: "보이저 1호", show: "240억 km보다 멀리 (2024년)", v: "24000000000" },
        { name: "빛이 1년 동안 가는 거리", show: "약 9조 4600억 km", v: "9460000000000" },
        { name: "지구 둘레", show: "약 40000 km", v: "40000" }],
        ok: "빛이 1년 동안 가는 거리 > 보이저 1호 > 해왕성 > 태양 > 달 > 지구 둘레 순서예요. 같은 형태로 바꾸고 자리 수부터 비교했어요." }) },
    { name: "말해 보기 — 비교한 방법 설명하기", inst: "우주 거리 사다리를 만든 방법과 놀라운 점을 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "형태가 다른 수를 어떻게 비교했는지 차례대로 써 보세요.", tag: "방법", ph: "먼저 ~, 그다음 ~", help: ["① 38만, 사십오억처럼 형태가 다른 수를 어떻게 바꾸었는지 떠올려요. → ② 바꾼 다음 무엇부터 셌는지 써요.", "‘먼저 ~로 바꾸었어요. 그다음 ~를 세어 비교했어요.’ 꼴로 써요."],
          ans: "먼저 38만, 사십오억처럼 형태가 다른 수를 모두 숫자로 바꾸었어요. 그다음 자리 수를 세어 자리 수가 많은 쪽이 더 크다고 정했어요. 자리 수가 같으면 높은 자리부터 비교했어요." },
        { q: "우주 거리 사다리에서 가장 놀라운 점을 큰 수를 넣어 써 보세요.", tag: "놀라운 점", ph: "~이 가장 놀라워요", help: ["① 사다리에서 가장 먼 것과 가장 가까운 것을 봐요. → ② 두 수의 자리 수를 견주어요.", "‘~은 약 ~ km로, ~보다 훨씬 ~해서 놀라워요.’ 꼴로 써요."],
          ans: "빛이 1년 동안 가는 거리는 약 9조 4600억 km로, 지구에서 태양까지의 거리 약 1억 5000만 km보다 훨씬 멀어서 놀라워요." }]) },
    { name: "약속하기 — 형태가 다른 수 비교", inst: "형태가 다른 수를 비교하는 방법을 정리해요.", hints: ["38만과 380000은 같은 수예요."],
      render: (b, a) => blanks(b, a, ["형태가 다른 수는 먼저 ", { o: ["앞 숫자만 보고", "같은 형태로 바꾸어"], a: 1 }, " 나타내요. 그다음 ", { o: ["자리 수", "0이 아닌 숫자의 개수"], a: 0 }, "를 비교하고, 자리 수가 같으면 ", { o: ["낮은", "높은"], a: 1 }, " 자리 수부터 차례대로 비교해요."]) },
    { name: "확인하기 — 같은 형태로 비교", inst: "두 수의 크기를 비교하고, 몇 배인지 알아보세요.",
      hints: ["45억을 숫자로 쓰면 4500000000이에요.", "1000억의 10배는 1조예요."],
      render: (b, a) => n1sAsk(b, a, [
        { t: "cmp", l: 4500000000, r: 4500000000, ls: "45억", rs: "4500000000", why: { ">": "45억을 숫자로 바꾸어 봐요. 두 수는 같아요.", "<": "45억을 숫자로 바꾸어 봐요. 두 수는 같아요." } },
        { t: "cmp", l: 24000000000, r: 9460000000000, ls: "240억", rs: "9조 4600억", why: { ">": "240억은 11자리, 9조 4600억은 13자리 수예요." } },
        { q: "우리 은하의 별은 1000억 개가 넘고, 안드로메다은하의 별은 약 1조 개래요(어림값). 1조는 1000억의 몇 배인가요?", t: "num", a: 10, unit: "배", why: { "100": "1000억이 10개이면 1조예요." } }], { ok: "같은 형태로 바꾸면 우주처럼 큰 수도 쉽게 비교할 수 있어요." }) }
  ],
  challenge: { inst: "우주 카드 6장 중에서 가장 짧은 것 3개를 짧은 것부터 차례대로 눌러 보세요(모두 어림값).", hints: ["모두 같은 형태로 바꾸고 자리 수부터 세어요.", "국제우주정거장은 땅에서 약 400 km 높이에서 지구를 돌아요."],
    render: (b, a) => n1sRank(b, a, { dir: "asc", k: 3, convert: true, items: [
      { name: "땅 → 국제우주정거장", show: "약 400 km", v: "400" },
      { name: "지구 지름", show: "약 1만 2700 km", v: "12700" },
      { name: "지구 둘레", show: "약 40000 km", v: "40000" },
      { name: "태양 지름", show: "약 백삼십구만 km", v: "1390000" },
      { name: "지구 → 달", show: "약 384400 km", v: "384400" },
      { name: "달 지름", show: "약 3474 km", v: "3474" }],
      ok: "국제우주정거장까지(400) < 달 지름(3474) < 지구 지름(1만 2700)이에요!" }) }
},
{
  id: "s10", no: 10, title: "놀이를 더하다 ― 별 세 칸 잇기", soop: "발표하기(P)",
  question: "가장 큰 수를 만들고 크기를 비교하는 놀이에서 이기려면 어떻게 해야 할까요?",
  summary: "카드를 이어 붙여 가장 큰 수를 만들 때는 맨 앞에 오는 숫자가 가장 크도록 순서를 정해요. 크기를 비교할 때는 자리 수부터 세고, 같으면 높은 자리부터 비교해요.",
  steps: [
    { name: "놀이 준비 — 가장 큰 수 만들기", inst: "별 카드 3장을 이어 붙여 가장 큰 수를 만들어요. 카드 3장을 모두 놓으면 저절로 확인해요.",
      hints: ["카드를 모두 쓰면 자리 수는 늘 같아요. 맨 앞에 오는 숫자가 커지도록 순서를 바꿔 봐요.", "5, 730, 19 → 맨 앞 숫자가 7인 730을 먼저 놓아요."],
      render: (b, a) => n1sArrange(b, a, { sets: [["5", "730", "19"], ["81", "6", "402"], ["97", "3", "615"]], ok: "세 번 모두 가장 큰 수를 만들었어요. 맨 앞 숫자가 큰 카드를 앞에 놓았어요!" }) },
    { name: "비교하기 — 누가 더 클까", inst: "친구들이 만든 수를 비교해요. 표에서 크기가 정해지는 자리를 누르고 부등호를 골라요.",
      hints: ["먼저 자리 수를 세어요.", "자리 수가 같으면 가장 높은 자리부터 비교해요."],
      render: (b, a) => n1sCompare(b, a, { pairs: [
        { a: 816402, b: 976153, la: "하늘", lb: "도윤", ok: "두 수 모두 여섯 자리예요. 십만의 자리에서 8 < 9라서 도윤이의 수가 더 커요." },
        { a: 8730615, b: 976153, la: "서아", lb: "도윤", ok: "8730615는 일곱 자리, 976153은 여섯 자리예요. 서아의 수가 더 커요." }] }) },
    { name: "놀이하기 — 컴퓨터와 별 세 칸 잇기", inst: "카드 3장으로 가장 큰 수를 만들고, 컴퓨터가 만든 수와 비교해요. 더 큰 쪽이 별 칸 하나를 색칠해요. 이어진 세 칸을 먼저 색칠하면 이겨요.",
      hints: ["가장 큰 수를 만들어야 비교에서 이길 수 있어요.", "가운데 칸은 여러 방향으로 이어질 수 있어요. 컴퓨터가 두 칸을 이었으면 남은 칸을 막아요."],
      render: (b, a) => n1sGame(b, a, {}) },
    { name: "발표하기 — 이기는 방법", inst: "놀이에서 알게 된 방법을 친구에게 설명할 말로 써 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "가장 큰 수를 만드는 나만의 방법을 써 보세요.", tag: "만드는 방법", ph: "카드를 ~ 순서로 놓아요", help: ["① 카드 5, 730, 19로 만든 수들을 떠올려요. → ② 어떤 카드를 맨 앞에 놓았을 때 가장 컸는지 생각해요.", "‘맨 앞에 오는 숫자가 ~ 순서를 정해요. 예를 들어 ~로는 ~를 만들어요.’ 꼴로 써요."],
          ans: "카드를 이어 붙였을 때 맨 앞에 오는 숫자가 가장 크도록 순서를 정해요. 예를 들어 5, 730, 19로는 730519를 만들어요." },
        { q: "놀이판에서 이기려면 어떻게 색칠하면 좋을까요?", tag: "색칠 작전", ph: "~ 칸을 먼저 색칠해요", help: ["① 이어진 세 칸이 될 수 있는 방향(가로·세로·대각선)을 떠올려요. → ② 컴퓨터가 두 칸을 이었을 때 어떻게 했는지 떠올려요.", "‘~ 칸을 먼저 색칠하고, 컴퓨터가 ~하면 ~해요.’ 꼴로 써요."],
          ans: "여러 방향으로 이어질 수 있는 가운데 칸을 먼저 색칠하고, 컴퓨터가 두 칸을 이었으면 남은 한 칸을 먼저 색칠해 막아요." }]) }
  ],
  challenge: { inst: "수 카드 0, 1, 3, 5, 6, 8을 한 번씩 모두 사용하여 30만보다 큰 여섯 자리 수 중에서 가장 작은 수를 만들어 보세요.", hints: ["30만보다 크려면 십만의 자리 숫자는 3이나 그보다 큰 수여야 해요.", "십만의 자리에 3을 놓고, 나머지는 작은 숫자부터 놓아요."],
    render: (b, a) => n1sCards(b, a, { cards: [0, 1, 3, 5, 6, 8], target: "301568", rules: [{ t: "30만보다 커요", f: s => BigInt(s) > 300000n, why: "30만보다 큰 수를 만들어야 해요. 십만의 자리 숫자를 살펴봐요." }], ok: "30만보다 크면서 가장 작은 수는 301568이에요!" }) }
},
{
  id: "s11", no: 11, title: "우주 큰 수 신문을 발표해요", soop: "발표하기(P)",
  question: "큰 수를 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
  summary: "큰 수는 일의 자리부터 네 자리씩 끊어 만·억·조를 붙여 읽고, 숫자가 0인 자리는 읽지 않아요. 뛰어 세기는 변하는 자리를 살피고, 크기 비교는 자리 수부터 세요. 우주처럼 아주 큰 세상도 큰 수로 나타낼 수 있어요.",
  steps: [
    { name: "확인 1 — 읽고 쓰기", inst: "신문에 실을 큰 수를 바르게 읽고 써 보세요.", hints: ["일의 자리부터 네 자리씩 끊어요.", "읽은 말에 없는 자리에는 0을 써요."],
      render: (b, a) => n1sAsk(b, a, [
        { q: "4500000000을 읽어 보세요.", t: "read", a: 4500000000 },
        { q: "삼천이백팔만 오백을 수로 써 보세요.", t: "num", a: 32080500, why: { "3208500": "‘만’ 아래 네 자리는 0500이에요. 0을 빠뜨리지 않았는지 봐요." } },
        { q: "1억이 2개, 1만이 3800개인 수를 써 보세요.", t: "num", a: 238000000 },
        { q: "숫자 7이 70억을 나타내는 수를 고르세요.", t: "pick", o: ["㉠ 7350000000", "㉡ 73500000000", "㉢ 735000000"], a: 0, why: { "1": "73500000000에서 7은 백억의 자리 숫자라 700억을 나타내요.", "2": "735000000에서 7은 억의 자리 숫자라 7억을 나타내요." } }], { ok: "큰 수를 바르게 읽고 썼어요!" }) },
    { name: "확인 2 — 뛰어 세기와 비교", inst: "뛰어 세기를 하고, 두 수의 크기를 비교해 보세요.", hints: ["2400만, 2600만은 200만씩 뛰어 세었어요.", "형태가 다르면 같은 형태로 바꾸어 비교해요."],
      render: (b, a) => n1sAsk(b, a, [
        { t: "line", parts: ["2400만, 2600만, 2800만, ", { a: 30000000, show: "3000만" }, ", ", { a: 32000000, show: "3200만" }] },
        { t: "cmp", l: 150000000, r: 99999999, ls: "1억 5000만", rs: "99999999", why: { "<": "1억 5000만은 아홉 자리, 99999999는 여덟 자리 수예요." } },
        { t: "cmp", l: 1430000000, r: 2870000000, ls: "14억 3000만", rs: "2870000000", why: { ">": "2870000000은 28억 7000만이에요. 같은 형태로 바꾸어 비교해 봐요." } }], { ok: "뛰어 세기와 크기 비교를 정확히 했어요!" }) },
    { name: "신문 쓰기 — 우주 큰 수 신문", inst: "1차시에 궁금했던 것을 떠올리며 ‘우주 큰 수 신문’ 기사를 써 보세요. 쓴 기사로 모둠 친구들 앞에서 발표해요.",
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "신문 제목을 지어 보세요.", tag: "제목", ph: "예: 빛은 1년에 ~ km를 달려요!", help: ["① 이 단원에서 가장 기억에 남는 우주 큰 수를 골라요. → ② 그 수가 들어간 짧은 제목을 지어요.", "‘~은 ~ km!’처럼 큰 수가 들어가게 써요."],
          ans: "빛은 1년에 약 9조 4600억 km를 달려요!" },
        { q: "기사 1: 우주 속 큰 수 하나를 골라 숫자와 읽는 말로 소개해 보세요.", tag: "큰 수 기사", ph: "~까지는 약 ~ km예요. ~라고 읽어요.", help: ["① 숫자로 쓰고 네 자리씩 끊어 봐요. → ② 만·억·조를 붙여 읽는 말을 써요.", "‘~까지는 약 ~ km예요. ~이라 쓰고 ‘~’이라고 읽어요.’ 꼴로 써요."],
          ans: "지구에서 태양까지는 약 150000000 km예요. 1억 5000만이라 쓰고 ‘일억 오천만’이라고 읽어요." },
        { q: "기사 2: 두 거리를 비교하고, 비교한 방법도 써 보세요.", tag: "비교 기사", ph: "~가 ~보다 멀어요. 왜냐하면 ~", help: ["① 비교할 두 거리를 같은 형태로 바꾸어요. → ② 자리 수부터 세어 어느 쪽이 큰지 정해요.", "‘~가 ~보다 멀어요. 두 수를 ~ 바꾸면 ~자리와 ~자리라서 ~.’ 꼴로 써요."],
          ans: "태양에서 토성까지(약 14억 3000만 km)는 태양에서 목성까지(약 7억 7800만 km)보다 멀어요. 숫자로 바꾸면 10자리와 9자리라서 자리 수가 많은 토성이 더 멀어요." }])) },
    { name: "발표하기 — 예전 생각, 지금 생각", inst: "큰 수에 대한 생각이 어떻게 달라졌는지 세 칸에 써서 붙여요.",
      hints: ["예전엔: 0이 많은 수를 보면 어떤 느낌이었나요?", "지금은: 네 자리씩 끊기, 자리 수 세기를 떠올려요.", "왜 바뀌었나: 자릿값 표, 뛰어 세기, 우주 거리 사다리 중 무엇이 도움이 되었나요?"],
      render: (b, a) => panes(b, a, [
        { t: "예전 생각", e: "⏮", ph: "예전에는 ~라고 생각했어요", hint: "큰 수를 배우기 전의 생각", ex: ["예전에는 150000000 같은 수는 너무 길어서 읽을 수 없다고 생각했어요.", "예전에는 앞자리 숫자가 큰 수가 더 큰 수라고 생각했어요."] },
        { t: "지금 생각", e: "⏭", ph: "지금은 ~라고 생각해요", hint: "지금 알게 된 것", ex: ["지금은 일의 자리부터 네 자리씩 끊으면 아무리 큰 수도 읽을 수 있다고 생각해요.", "지금은 자리 수부터 세고, 같으면 높은 자리부터 비교해야 한다고 생각해요."] },
        { t: "왜 바뀌었나", e: "🔄", ph: "~을 해 보고 바뀌었어요", hint: "도움이 된 활동", ex: ["1광년 9460000000000을 자릿값 표에 놓아 보고 바뀌었어요.", "우주 거리 사다리를 같은 형태로 바꾸어 쌓아 보고 바뀌었어요."] }],
        { ok: "생각이 자랐어요! 우주 탐험대 큰 수 일지를 완성했어요." }) }
  ],
  challenge: { inst: "마인드맵 — 큰 수 낱말을 모아 이어요. 네 칸에 써서 붙여요.",
    hints: ["떠오르는 말: 만, 억, 조, 네 자리씩, 뛰어 세기, 자리 수…", "묶어 보기: 읽고 쓰기에 쓰는 말과 비교하기에 쓰는 말로 나누어 봐요.", "이어지는 말: 예) 네 자리씩 끊기와 읽기는 이어져요."],
    render: withOptional(
      (b, a) => panes(b, a, [
        { t: "떠오르는 말", e: "🧠", ph: "큰 수 하면 떠오르는 말", hint: "만, 억, 조, 어림값…", ex: ["큰 수 하면 만, 억, 조가 떠올라요.", "큰 수 하면 우주, 빛, 행성까지의 거리가 떠올라요."] },
        { t: "묶어 보기", e: "🗂", ph: "~와 ~는 비슷해요", hint: "비슷한 것끼리 묶어요", ex: ["만, 억, 조는 비슷해요. 모두 네 자리마다 새로 붙는 이름이에요.", "뛰어 세기와 10배는 비슷해요. 둘 다 자리 숫자가 바뀌는 것을 살펴요."] },
        { t: "이어지는 말", e: "🔗", ph: "~와 ~는 이어져요", hint: "예) 자리 수와 크기 비교", ex: ["자리 수와 크기 비교는 이어져요. 자리 수가 많으면 더 큰 수예요.", "네 자리씩 끊기와 읽기는 이어져요. 끊어야 만·억·조를 붙여 읽을 수 있어요."] },
        { t: "덧붙이는 말", e: "✏️", ph: "예를 들면 ~", hint: "예) 우주 거리로 예를 들어요", ex: ["예를 들면 지구에서 달까지 약 38만 km는 380000 km예요.", "예를 들면 1조는 1000억의 10배예요."] }],
        { min: 1, ok: "큰 수 마인드맵을 만들었어요! 우주 탐험대 임무 완료!" }),
      (b, a) => n1sAsk(b, a, [
        { q: "9999만보다 1만큼 더 큰 수를 써 보세요. (1억처럼 써도 돼요)", t: "num", a: 99990001, kb: "text", why: { "100000000": "9999만보다 1만 큰 수가 아니라 1만큼 큰 수예요. 일의 자리를 봐요." } },
        { q: "10억이 100개인 수를 써 보세요. (1000억처럼 써도 돼요)", t: "num", a: 100000000000, kb: "text" },
        { q: "가장 큰 수를 고르세요.", t: "pick", o: ["㉠ 9999억", "㉡ 1조", "㉢ 999900000000"], a: 1, why: { "0": "9999억보다 1억 큰 수가 1조예요.", "2": "999900000000은 9999억이에요." } }],
        { ok: "큰 수 단원을 모두 해냈어요! 우주 탐험대 임무 완료!" }),
      { title: "더 해 보고 싶다면 — 선택 문제", inst: "단원 도전 문제예요. 도움: 9999만 = 99990000이에요." }) }
}];
