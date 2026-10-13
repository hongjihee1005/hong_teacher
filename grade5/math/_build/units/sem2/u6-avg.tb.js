//@@APP
const APP={title:"마을 연합 송년 잔치 평균과 가능성", unit:"5-2 수학 6. 평균과 가능성(교과서)", key:"t52-avg-v1", welcome:"마을 연합 송년 잔치 평균과 가능성 교실에 온 것을 환영해요", intro:"교과서 차시 그대로, 건우네 학교 학생 자치회가 준비한 마을 연합 송년 잔치에서 쌓기나무와 ○를 옮겨 고르게 하고, 종이띠를 이어 붙여 평균을 구하고, 주머니·회전판·동전·주사위로 일이 일어날 가능성을 말과 수로 나타내 봐요."};
//@@UNIT
/* =========================================================
   5-2 수학 6. 평균과 가능성 — 단원 조작 부품 (앞글자 av6)
   av6Level  쌓기나무·○를 많은 곳에서 적은 곳으로 옮겨 고르게 하기
   av6Line   막대그래프 위 선을 끌어 '넘치는 양 = 모자란 양'인 높이 찾기
   av6Strip  종이띠를 이어 붙이고(더하기) 자료의 수만큼 등분하기(나누기)
   av6Guess  모르는 막대를 끌어 목표 평균 맞추기(평균 활용)
   av6Bag    주머니·상자에서 하나씩 꺼내 보기(꺼낸 것은 다시 넣음)
   av6Spin   회전판 돌리기            av6Paint 조건에 맞게 회전판 색칠하기
   av6Scale  가능성 띠(불가능하다 ~ 확실하다, 0 · [1/2] · 1)에 카드 놓기
   av6Sim    동전·주사위를 여러 번 던지는 실험(누적 표, 비율 막대)
   av6Rank   가능성이 높은 것부터 차례로 누르기
   av6Bars   표를 보고 막대그래프 그리기(막대 끌기)
   av6Party  송년 잔치 체육관 둘러보기   av6Near·av6Secret  9차시 평균 놀이
   av6Calc   화면 계산기(계산기를 써도 되는 계단)
   글 속 [1/2] 은 화면에서 세로 분수로 보여요.
   ========================================================= */
(function () {
  const s = document.createElement("style");
  s.textContent = `
.av6fig{width:100%;height:auto;display:block;margin:.3em 0;background:#FBFCFB;border:2px solid var(--line);border-radius:12px;touch-action:none}
.av6small{font-size:var(--fs-s);color:var(--muted)}
.av6part{margin-top:.8em;padding-top:.5em;border-top:2px dashed var(--line)}
.av6tbl{max-width:100%;overflow-x:auto;margin:.3em 0}
.av6tbl table{border-collapse:collapse;background:#fff;word-break:keep-all}
.av6tbl th,.av6tbl td{border:1.5px solid var(--line);padding:.25em .6em;text-align:center}
.av6tbl th{background:#F2F5F4;font-family:"Jua",sans-serif;font-weight:400}
.av6tbl input{width:5em;font-size:1em;text-align:center;max-width:100%}
.av6tbl td.av6hi{background:#FFF1C7}
.av6read{font-family:"Jua",sans-serif;font-size:var(--fs);color:var(--night);line-height:1.5;word-break:keep-all;margin:.2em 0}
.av6tools{display:flex;flex-wrap:wrap;gap:.45em;align-items:center;margin:.4em 0}
.av6tools button{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.25em .8em;font-size:var(--fs-s)}
.av6tools button.av6on{background:var(--night);color:#fff;border-color:var(--night)}
.av6tools button:disabled{opacity:.45}
.av6box{background:#FFFBF2;border:2px solid #E8D3B0;border-radius:12px;padding:.5em .8em;word-break:keep-all;margin:.3em 0}
.av6fr{display:inline-flex;flex-direction:column;align-items:stretch;text-align:center;vertical-align:middle;font-size:.82em;line-height:1.05;margin:0 .12em;font-family:Jua,sans-serif}
.av6fr>.av6n{border-bottom:.11em solid currentColor;padding:0 .14em .06em}
.av6fr>.av6d{padding:.06em .14em 0}
.av6pool{display:flex;flex-wrap:wrap;gap:.45em;min-height:2.8em;margin:.3em 0 .5em;padding:.4em;border:2px dashed var(--line);border-radius:12px;background:#FBFCFB}
.av6crd{border:2px solid var(--line);background:#fff;border-radius:.6em;padding:.35em .6em;text-align:left;word-break:keep-all;max-width:100%;font-size:var(--fs-s);line-height:1.4;cursor:grab;touch-action:none}
.av6crd.av6on{border-color:var(--ring);background:var(--ring-soft);box-shadow:0 0 0 2px var(--ring)}
.av6crd.av6good{border-color:var(--ok)}
.av6crd.av6bad{border-color:var(--no);background:#FDECEC}
.av6ghost{position:fixed;z-index:99;pointer-events:none;opacity:.85;transform:translate(-50%,-50%)}
.av6arrow{position:relative;height:1.6em;margin:.4em .4em 0}
.av6arrow::before{content:"";position:absolute;left:0;right:.6em;top:.7em;height:.22em;background:var(--night);border-radius:.1em}
.av6arrow::after{content:"";position:absolute;right:0;top:.35em;border-left:.8em solid var(--night);border-top:.45em solid transparent;border-bottom:.45em solid transparent}
.av6bins{display:grid;gap:.35em}
.av6bin{border:2px dashed var(--line);border-radius:.8em;padding:.3em;min-height:6.5em;display:flex;flex-direction:column;gap:.3em;cursor:pointer;background:#fff;min-width:0}
.av6bin.av6over{background:var(--ring-soft)}
.av6binh{font-family:Jua,sans-serif;text-align:center;color:var(--night);font-size:var(--fs-s);word-break:keep-all;line-height:1.25}
.av6binn{font-family:Jua,sans-serif;text-align:center;color:#C0392B;font-size:1.05em;min-height:1.3em}
.av6bin .av6crd{width:100%;padding:.25em .35em;font-size:.82em}
.av6pick{display:flex;flex-wrap:wrap;gap:.5em;margin:.4em 0}
.av6pick>button{border:2px solid var(--line);background:#fff;border-radius:12px;padding:.25em;display:flex;flex-direction:column;align-items:center;gap:.1em;min-width:5.5em;font-family:Jua,sans-serif}
.av6pick>button svg{width:6.5em;height:auto;display:block}
.av6pick>button.av6on{border-color:var(--ring);background:var(--ring-soft)}
.av6pick .av6no{display:inline-grid;place-items:center;min-width:1.5em;height:1.5em;border-radius:50%;background:var(--night);color:#fff;font-size:.85em}
.av6calc{display:inline-grid;grid-template-columns:repeat(4,3em);gap:.3em;background:#EEF2F1;border:2px solid var(--line);border-radius:12px;padding:.5em;margin:.3em 0}
.av6calc .av6disp{grid-column:1/-1;background:#fff;border:2px solid var(--line);border-radius:.4em;text-align:right;padding:.2em .4em;font-family:Jua,sans-serif;font-size:1.15em;min-height:1.6em;overflow:hidden;word-break:break-all}
.av6calc button{border:2px solid var(--line);background:#fff;border-radius:.5em;padding:.3em 0;font-family:Jua,sans-serif;font-size:1.05em}
.av6calc button.av6op{background:#FFF1C7}
.av6grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15em),1fr));gap:.6em}
.av6score{font-family:Jua,sans-serif;font-size:1.2em;color:var(--night)}
.av6big{font-family:Jua,sans-serif;font-size:1.6em;color:var(--night)}
`;
  document.head.append(s);
})();

const AV6 = { ink: "#1D2A2A", grid: "#DCE4E0", gray: "#7B8A8A", red: "#D64545", blue: "#2B7BD6", green: "#2E8B57", yellow: "#F2C230", orange: "#E47A38", purple: "#7A5BB0",
  pink: "#E77FA4", brown: "#A0683A", sky: "#7FB8E8", lime: "#9BCB55", over: "#F6A35B", lack: "#CFE3F7" };
const AV6_COLS = ["#E8835A", "#5B9BD5", "#6BB36B", "#E9B949", "#9C7BC7", "#E77FA4", "#4FB3B3"];
const AV6_WORDS = ["불가능하다", "~아닐 것 같다", "반반이다", "~일 것 같다", "확실하다"];

/* ---------- 세로 분수: 글 속 [1/2] → 분수 모양 ---------- */
function av6FracEl(n, d) { return h("span", { class: "av6fr" }, h("span", { class: "av6n" }, String(n)), h("span", { class: "av6d" }, String(d))); }
function av6RenderText(node) {
  const s = node.nodeValue; if (!s || s.indexOf("[") < 0 || s.indexOf("/") < 0) return;
  const p = node.parentNode; if (!p || !p.closest || p.closest("svg,textarea,script,style,.copyrow")) return;
  const re = /\[(\d+)\/(\d+)\]/g; let m, last = 0, any = false; const frag = document.createDocumentFragment();
  while ((m = re.exec(s))) { any = true; if (m.index > last) frag.append(s.slice(last, m.index)); frag.append(av6FracEl(m[1], m[2])); last = m.index + m[0].length; }
  if (!any) return; if (last < s.length) frag.append(s.slice(last)); p.replaceChild(frag, node);
}
function av6RenderNode(n) {
  if (!n) return; if (n.nodeType === 3) return av6RenderText(n);
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT), list = []; while (tw.nextNode()) list.push(tw.currentNode); list.forEach(av6RenderText);
}
const av6Plain = s => String(s == null ? "" : s).replace(/\[(\d+)\/(\d+)\]/g, "$1/$2");
(function av6Boot() {
  try { new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") av6RenderText(m.target); else m.addedNodes.forEach(av6RenderNode); } })
    .observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (e) { }
  const U = window.SpeechSynthesisUtterance;
  if (U) { const W = function (t) { return new U(String(t).replace(/\[(\d+)\/(\d+)\]/g, "$2분의 $1")); }; W.prototype = U.prototype; window.SpeechSynthesisUtterance = W; }
})();
/* 엔진 부품(quiz·blanks)의 '답 따라 쓰기' 글에서 [1/2] → 1/2 */
function av6A(a) { return Object.assign({}, a, { provide: info => a.provide({ words: ((info && info.words) || []).map(av6Plain), answers: ((info && info.answers) || []).map(av6Plain) }) }); }

/* 받침에 따라 조사 고르기 */
function av6Jo(w, pair) {
  const s = String(w), [a, b] = pair.split("/"), c = s.trim().slice(-1);
  let bat = false, rieul = false;
  if (/[0-9]/.test(c)) { bat = "0136780".includes(c); rieul = "178".includes(c); }
  else if (/[가-힣]/.test(c)) { const k = (c.charCodeAt(0) - 0xAC00) % 28; bat = k !== 0; rieul = k === 8; }
  if (pair === "으로/로") return s + (bat && !rieul ? "으로" : "로");
  return s + (bat ? a : b);
}
function av6Num(s) {
  let t = String(s == null ? "" : s).replace(/[\s,]/g, "");
  t = t.replace(/(명|개|회|번|점|초|분|시간|마리|원|권|kg|cm|℃|도|일|장|살)$/i, "");
  return t === "" || !/^-?\d+(\.\d+)?$/.test(t) ? NaN : Number(t);
}
const av6Fmt = v => { const r = Math.round(v * 1000) / 1000; return String(r); };
const av6R = v => Math.round(v * 100) / 100;
function av6Tbl(head, rows, o = {}) {
  return h("div", { class: "av6tbl" }, o.cap ? h("div", { class: "jua", style: "margin-bottom:.15em" }, o.cap) : "", h("table", {},
    h("tr", {}, ...head.map(t => h("th", {}, t))), ...rows.map(r => h("tr", {}, ...r.map((t, i) => i === 0 && o.rowHead ? h("th", {}, t) : h("td", {}, t === "" ? "​" : t))))));
}
/* 가로 표: 첫 줄 제목 + 값 줄 */
function av6HTbl(cap, heads, vals, o = {}) {
  return h("div", { class: "av6tbl" }, cap ? h("div", { class: "jua", style: "margin-bottom:.15em" }, cap) : "",
    h("table", {}, h("tr", {}, h("th", {}, o.h1 || "이름"), ...heads.map(t => h("th", {}, t))),
      h("tr", {}, h("th", {}, o.h2 || "기록"), ...vals.map(v => h("td", { class: v === "?" ? "av6hi" : "" }, String(v))))));
}
function av6Fig(W, H, draw, maxW) { const s = makeSvg(W, H); draw(s); s.setAttribute("class", "av6fig"); s.style.maxWidth = maxW || "36em"; return s; }

/* ---------- 묻고 답하기(빈칸 고르기·수 쓰기) ---------- */
function av6Ask(host, api, items, opts = {}) {
  const wrap = h("div", { class: "av6ask", style: "margin-top:.6em" }), all = [];
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
        const len = String(pt.n).length, w = pt.w || (len > 5 ? "6.5em" : len > 3 ? "5em" : "4em");
        const inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "답", style: `width:${w};max-width:100%;font-size:1.1em;text-align:center` });
        sent.append(inp); all.push({ pt, inp });
      }
    });
    box.append(sent); wrap.append(box);
  });
  const right = pt => av6Plain(pt.o ? (pt.multi ? pt.a.map(i => pt.o[i]).join(", ") : pt.o[pt.a]) : String(pt.n));
  api.provide({ words: all.map(s => right(s.pt)), answers: items.map(it => (it.parts || []).map(pt => typeof pt === "string" ? av6Plain(pt) : pt.nodeType ? " " : right(pt)).join("")) });
  const good = s => s.pt.o ? (s.pt.multi ? (s.v.size === s.pt.a.length && s.pt.a.every(i => s.v.has(i))) : s.v === s.pt.a) : Math.abs(av6Num(s.inp.value) - s.pt.n) < 1e-9;
  const val = s => av6Plain(s.pt.o ? (s.pt.multi ? ([...s.v].sort().map(i => s.pt.o[i]).join("·") || "-") : (s.v == null ? "-" : s.pt.o[s.v])) : (s.inp.value.trim() || "-"));
  const check = h("button", { class: "big", onclick: () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) { [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); }); }
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) return api.done(ans, opts.ok);
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(av6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
  } }, "확인하기");
  host.append(wrap, h("div", { class: "actions" }, check));
  return wrap;
}
/* 조작을 마친 뒤: then(이어서 할 활동) → ask(물음) → 없으면 바로 해결 */
function av6Finish(body, api, opt, ans, msg, data) {
  const go = el => setTimeout(() => { try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
  if (opt.then) { api.hint("○ " + (msg || "잘했어요!") + " 아래도 이어서 해 봐요."); const box = h("div", { class: "av6part" }); body.append(box); opt.then(box, api, data); go(box); return; }
  const ask = typeof opt.ask === "function" ? opt.ask(data) : opt.ask;
  if (ask && ask.length) { api.hint("○ " + (msg || "잘했어요!") + " 아래 물음에 답해 봐요."); const w = av6Ask(body, api, ask, { ok: opt.ok, title: opt.askTitle }); go(w); }
  else api.done(ans, opt.ok || msg);
}
/* 여러 활동을 차례로: 앞 활동을 해결하면 다음 활동이 열림 */
function av6Chain(body, api, parts) {
  let k = 0;
  const run = () => {
    const box = h("div", { class: k ? "av6part" : "" }); body.append(box);
    const last = k === parts.length - 1, myK = k;
    const sub = Object.assign({}, api, { done: (ans, msg, lv) => {
      if (last) return api.done(ans, msg, lv);
      if (myK !== k) return;
      api.hint("○ " + (msg || "좋아요!") + " 아래 활동도 이어서 해 봐요.");
      box.querySelectorAll(".actions button.big").forEach(b => { b.disabled = true; });
      k++; run(); setTimeout(() => { try { body.lastChild.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) { } }, 60);
    } });
    if (parts[myK].title) box.append(h("p", { class: "inst" }, h("b", {}, parts[myK].title)));
    (parts[myK].run || parts[myK])(box, sub);
  };
  run();
}

/* ---------- 화면 계산기 ---------- */
function av6Eval(e) {
  const t = String(e).replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  if (!/^[0-9.+\-*/]+$/.test(t)) return NaN;
  const tok = t.match(/\d+(\.\d+)?|[+\-*/]/g); if (!tok) return NaN;
  const nums = [], ops = [];
  for (let i = 0; i < tok.length; i++) {
    const x = tok[i];
    if (i % 2 === 0) { if (!/^\d/.test(x)) return NaN; nums.push(Number(x)); }
    else { if (!/^[+\-*/]$/.test(x)) return NaN; ops.push(x); }
  }
  if (nums.length !== ops.length + 1) return NaN;
  const n2 = [nums[0]], o2 = [];
  ops.forEach((o, i) => { if (o === "*" || o === "/") { const a = n2.pop(); n2.push(o === "*" ? a * nums[i + 1] : a / nums[i + 1]); } else { o2.push(o); n2.push(nums[i + 1]); } });
  let r = n2[0]; o2.forEach((o, i) => { r = o === "+" ? r + n2[i + 1] : r - n2[i + 1]; });
  return Math.round(r * 1e9) / 1e9;
}
function av6Calc() {
  let ex = "";
  const disp = h("div", { class: "av6disp" }, "0");
  const show = () => { disp.textContent = ex || "0"; };
  const key = (t, cls) => h("button", { class: cls || "", onclick: () => {
    if (t === "C") ex = "";
    else if (t === "←") ex = ex.slice(0, -1);
    else if (t === "=") { const r = av6Eval(ex); ex = isFinite(r) ? String(r) : ""; if (!isFinite(r)) { disp.textContent = "식을 다시 써요"; return; } }
    else ex += t;
    show();
  } }, t);
  const pad = h("div", { class: "av6calc", "aria-label": "계산기" }, disp,
    key("7"), key("8"), key("9"), key("÷", "av6op"), key("4"), key("5"), key("6"), key("×", "av6op"),
    key("1"), key("2"), key("3"), key("−", "av6op"), key("0"), key("."), key("=", "av6op"), key("+", "av6op"), key("C", "av6op"), key("←", "av6op"));
  pad.style.display = "none";
  const tog = h("button", { onclick: () => { const on = pad.style.display === "none"; pad.style.display = on ? "inline-grid" : "none"; tog.textContent = on ? "계산기 닫기" : "계산기 열기"; tog.classList.toggle("av6on", on); } }, "계산기 열기");
  return h("div", {}, h("div", { class: "av6tools" }, tog, h("span", { class: "av6small" }, "수가 크면 계산기를 써도 좋아요.")), pad);
}
/* 계단 앞에 계산기를 붙여 줌 */
const av6WithCalc = render => (b, a) => { b.append(av6Calc()); return render(b, a); };

/* =========================================================
   1. 고르게 하기 — 쌓기나무(block)나 ○(circle)를 많은 곳에서 적은 곳으로 옮겨요
   opt: {names, vals, unit, item:"block"|"circle", max, title, tip, ask|then, ok, msg}
   끌어서 옮기거나, 한 줄을 누른 뒤 다른 줄을 눌러도 옮겨져요.
   ========================================================= */
function av6Level(body, api, opt) {
  const names = opt.names, n = names.length, unit = opt.unit || "개";
  const st = opt.vals.map((v, i) => Array.from({ length: v }, () => i));
  const sum = opt.vals.reduce((a, b) => a + b, 0); if (sum % n) throw new Error("고르게 할 수 없는 자료");
  const avg = sum / n, top = Math.max(opt.max || 0, ...opt.vals);
  const W = 640, padL = 44, padR = 14, padT = 40, cw = (W - padL - padR) / n;
  const cs = Math.min(32, 280 / top, cw * .62), baseY = padT + top * cs + 4, H = baseY + 40;
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = opt.maxW || "36em";
  if (opt.title) svg.append(txt(W / 2, 16, opt.title, 16, { fill: AV6.gray }));
  const bg = svgEl("g"), grid = svgEl("g"), items = svgEl("g"), over = svgEl("g"), ghost = svgEl("g", { "pointer-events": "none" });
  svg.append(bg, grid, items, over, ghost);
  for (let k = 0; k <= top; k++) {
    const y = baseY - k * cs;
    grid.append(svgEl("line", { x1: padL, y1: y, x2: W - padR, y2: y, stroke: k ? AV6.grid : AV6.ink, "stroke-width": k ? 1 : 2 }));
    if (k && (top <= 12 || k % 2 === 0)) grid.append(txt(padL - 10, y - cs / 2 + cs / 2, String(k), 12, { fill: AV6.gray, "text-anchor": "end" }));
  }
  const cols = names.map((nm, i) => {
    const x0 = padL + cw * i;
    const r = svgEl("rect", { x: x0 + 3, y: padT - 26, width: cw - 6, height: baseY - padT + 26, rx: 8, fill: "transparent" });
    bg.append(r); grid.append(txt(x0 + cw / 2, baseY + 20, nm, n > 5 ? 14 : 16));
    return r;
  });
  const shape = (g, cx, cy, ci, faded) => {
    const c = AV6_COLS[ci % AV6_COLS.length];
    if (opt.item === "circle") g.append(svgEl("circle", { cx, cy, r: cs * .36, fill: "#fff", stroke: c, "stroke-width": 3, opacity: faded ? .35 : 1 }));
    else {
      const s = cs - 4; g.append(svgEl("rect", { x: cx - s / 2, y: cy - s / 2, width: s, height: s, rx: 3, fill: c, stroke: "#00000044", "stroke-width": 1.2, opacity: faded ? .35 : 1 }));
      g.append(svgEl("rect", { x: cx - s / 2 + 2, y: cy - s / 2 + 2, width: s - 4, height: s * .22, rx: 2, fill: "#ffffff55", opacity: faded ? .35 : 1 }));
    }
  };
  let sel = null, drag = null, fin = false; const moves = [];
  const read = h("div", { class: "av6read" });
  const merged = () => { const out = []; moves.forEach(([a, b]) => { const l = out[out.length - 1]; if (l && l[0] === a && l[1] === b) l[2]++; else out.push([a, b, 1]); }); return out; };
  const moveText = () => merged().map(([a, b, c]) => `${names[a]} → ${names[b]} ${c}${unit}`).join(", ");
  const draw = () => {
    items.innerHTML = ""; over.innerHTML = "";
    st.forEach((col, i) => {
      const cx = padL + cw * (i + .5);
      col.forEach((ci, k) => { if (drag && drag.from === i && k === col.length - 1) return; shape(items, cx, baseY - (k + .5) * cs, ci); });
      over.append(txt(cx, baseY - col.length * cs - 12, String(col.length), 16, { fill: AV6.ink }));
      cols[i].setAttribute("fill", sel === i ? "#FFF1C7" : "transparent");
    });
    if (fin) {
      const y = baseY - avg * cs;
      over.append(svgEl("line", { x1: padL, y1: y, x2: W - padR, y2: y, stroke: AV6.red, "stroke-width": 2.5, "stroke-dasharray": "8 5" }));
    }
    read.textContent = moves.length ? `옮긴 것: ${moveText()}` : (opt.tip0 || `많은 곳의 ${opt.item === "circle" ? "○" : "쌓기나무"}를 끌어 적은 곳으로 옮겨 높이를 고르게 해요.`);
  };
  const colAt = p => { const i = Math.floor((p.x - padL) / cw); return i >= 0 && i < n && p.y > padT - 30 && p.y < baseY + 34 ? i : -1; };
  const doMove = (a, b) => {
    if (!st[a].length || a === b) return;
    st[b].push(st[a].pop()); moves.push([a, b]);
    if (st.every(c => c.length === avg)) {
      fin = true; sel = null; draw();
      av6Finish(body, api, opt, `고르게 한 수 ${avg}${unit} (${moveText()})`, opt.msg || `모두 ${avg}${unit}씩으로 고르게 되었어요.`, { avg, moves: merged() });
    }
  };
  dragOn(svg, p => {
    if (fin) return false; const i = colAt(p); if (i < 0) return false;
    if (sel != null && sel !== i) { doMove(sel, i); sel = null; draw(); return false; }
    if (!st[i].length) return false;
    drag = { from: i, p0: p, moved: false }; draw(); ghost.innerHTML = ""; shape(ghost, p.x, p.y, st[i][st[i].length - 1]); return true;
  }, p => {
    if (!drag) return; if (Math.hypot(p.x - drag.p0.x, p.y - drag.p0.y) > 6) drag.moved = true;
    ghost.innerHTML = ""; shape(ghost, p.x, p.y, st[drag.from][st[drag.from].length - 1]);
  }, p => {
    const d = drag; drag = null; ghost.innerHTML = ""; if (!d) return;
    const j = colAt(p);
    if (d.moved && j >= 0 && j !== d.from) doMove(d.from, j);
    else if (!d.moved) sel = sel === d.from ? null : d.from;
    if (!fin) draw();
  });
  api.provide({ words: ["고르게 하기", "많은 곳에서 적은 곳으로", "평균"], answers: [`고르게 한 수 ${avg}${unit}`] });
  body.append(...(opt.tip ? [h("p", { class: "av6small" }, opt.tip)] : []), svg, read,
    h("div", { class: "av6tools" }, h("button", { onclick: () => { if (fin) return; st.forEach((c, i) => { c.length = 0; for (let k = 0; k < opt.vals[i]; k++) c.push(i); }); moves.length = 0; sel = null; draw(); } }, "처음으로 되돌리기")));
  draw();
}

/* =========================================================
   2. 평균선 찾기 — 막대그래프 위의 선을 끌어 '선보다 넘치는 양'과 '선까지 모자란 양'이 같은 높이를 찾아요
   opt: {names, vals, unit, lo, hi, gstep, start, title, ask|then, ok}
   ========================================================= */
function av6Line(body, api, opt) {
  const names = opt.names, vals = opt.vals, n = vals.length, unit = opt.unit || "", lo = opt.lo || 0, hi = opt.hi, gs = opt.gstep || 1;
  const sum = vals.reduce((a, b) => a + b, 0), mean = sum / n;
  const W = 640, padL = 54, padR = 18, padT = 34, plotH = 250, baseY = padT + plotH, H = baseY + 40, cw = (W - padL - padR) / n, bw = Math.min(58, cw * .55);
  const y = v => baseY - (v - lo) / (hi - lo) * plotH;
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = opt.maxW || "36em";
  if (opt.title) svg.append(txt(W / 2, 15, opt.title, 15, { fill: AV6.gray }));
  for (let v = lo; v <= hi + 1e-9; v += gs) { svg.append(svgEl("line", { x1: padL, y1: y(v), x2: W - padR, y2: y(v), stroke: v === lo ? AV6.ink : AV6.grid, "stroke-width": v === lo ? 2 : 1 })); svg.append(txt(padL - 8, y(v), av6Fmt(v), 12, { fill: AV6.gray, "text-anchor": "end" })); }
  if (lo > 0) svg.append(svgEl("path", { d: `M${padL - 6} ${baseY - 8} l6 -4 l6 4 l6 -4`, fill: "none", stroke: AV6.ink, "stroke-width": 1.5 }));
  const dyn = svgEl("g"); svg.append(dyn);
  names.forEach((nm, i) => { const cx = padL + cw * (i + .5); svg.append(txt(cx, baseY + 18, nm, 14)); });
  let L = opt.start != null ? opt.start : lo + Math.round((hi - lo) * .3), fin = false;
  if (Math.abs(L - mean) < 1e-9) L = lo + gs;
  const read = h("div", { class: "av6read" });
  const draw = () => {
    dyn.innerHTML = ""; let ex = 0, de = 0;
    vals.forEach((v, i) => {
      const cx = padL + cw * (i + .5);
      dyn.append(svgEl("rect", { x: cx - bw / 2, y: y(v), width: bw, height: baseY - y(v), fill: AV6_COLS[1], opacity: .85 }));
      if (v > L) { ex += v - L; dyn.append(svgEl("rect", { x: cx - bw / 2, y: y(v), width: bw, height: y(L) - y(v), fill: AV6.over, stroke: AV6.orange, "stroke-width": 1.5 })); }
      if (v < L) { de += L - v; dyn.append(svgEl("rect", { x: cx - bw / 2, y: y(L), width: bw, height: y(v) - y(L), fill: "#fff", stroke: AV6.blue, "stroke-width": 1.5, "stroke-dasharray": "5 4" })); }
      dyn.append(txt(cx, Math.min(y(v), y(L)) - 10, av6Fmt(v), 14, { fill: AV6.ink }));
    });
    const c = fin ? AV6.green : AV6.red;
    dyn.append(svgEl("line", { x1: padL, y1: y(L), x2: W - padR, y2: y(L), stroke: c, "stroke-width": 3, "stroke-dasharray": fin ? "" : "9 5" }));
    dyn.append(svgEl("circle", { cx: W - padR - 8, cy: y(L), r: 9, fill: c }));
    dyn.append(txt(W - padR - 24, y(L) - 14, `${av6Fmt(L)}${unit}`, 14, { fill: c, "text-anchor": "end" }));
    read.textContent = `선의 높이 ${av6Fmt(L)}${unit} · 선보다 넘치는 양(주황) ${av6Fmt(ex)}${unit} · 선까지 모자란 양(파랑 점선) ${av6Fmt(de)}${unit}`;
    return [ex, de];
  };
  const setL = p => { let v = lo + (baseY - p.y) / plotH * (hi - lo); const sn = opt.snap || gs; v = Math.round(v / sn) * sn; L = Math.max(lo, Math.min(hi, av6R(v))); draw(); };
  dragOn(svg, p => { if (fin) return false; setL(p); return true; }, setL, () => {
    if (fin) return; const [ex, de] = draw();
    if (Math.abs(ex - de) < 1e-9) { fin = true; draw(); av6Finish(body, api, opt, `평균 ${av6Fmt(L)}${unit}`, opt.msg || `넘치는 양과 모자란 양이 ${av6Jo(av6Fmt(ex) + unit, "으로/로")} 같아요. 넘치는 것을 모자란 곳에 채우면 모두 ${av6Jo(av6Fmt(L) + unit, "으로/로")} 고르게 돼요.`, { L }); }
  });
  api.provide({ words: ["넘치는 양", "모자란 양", "고르게 하기"], answers: [`선의 높이 ${av6Fmt(mean)}`] });
  body.append(svg, read, h("p", { class: "av6small" }, "선을 위아래로 끌어 보세요. 넘치는 양과 모자란 양이 같아지는 높이가 고르게 한 수예요."));
  draw();
}

/* =========================================================
   3. 종이띠 — 띠를 하나씩 눌러 이어 붙이고(더하기), 자료의 수만큼 등분해요(나누기)
   opt: {names, vals, unit, ring(고리 그림), ask|then, ok}
   ========================================================= */
function av6Strip(body, api, opt) {
  const names = opt.names, vals = opt.vals, n = vals.length, unit = opt.unit || "", sum = vals.reduce((a, b) => a + b, 0), avg = sum / n;
  const W = 660, px = 24, k = (W - px * 2) / sum, sh = 34, gap = 12, yL = 22 + n * (sh + gap) + 30, H = yL + sh + 66;
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = opt.maxW || "38em";
  const g = svgEl("g"); svg.append(g);
  const used = [], read = h("div", { class: "av6read" }), tools = h("div", { class: "av6tools" });
  let parts = 0, fin = false;
  const ringRow = (gg, x, yy, v, col) => { if (!opt.ring) return; const r = Math.min(k * .3, sh * .3); for (let u = 0; u < v; u++) gg.append(svgEl("circle", { cx: x + (u + .5) * k, cy: yy + sh / 2, r, fill: "none", stroke: col, "stroke-width": 3 })); };
  const draw = () => {
    g.innerHTML = "";
    vals.forEach((v, i) => {
      const yy = 18 + i * (sh + gap), c = AV6_COLS[i % AV6_COLS.length], u = used.includes(i), w = v * k;
      const r = svgEl("rect", { x: px, y: yy, width: w, height: sh, rx: 5, fill: u ? "#F1F3F2" : c + "33", stroke: u ? AV6.grid : c, "stroke-width": 2, "stroke-dasharray": u ? "5 4" : "" });
      g.append(r); if (!u) ringRow(g, px, yy, v, c);
      const t = `${names[i]} ${v}${unit}`, inside = w > 150;
      g.append(txt(inside ? px + w - 8 : px + w + 8, yy + sh / 2, t, 15, { fill: u ? AV6.gray : AV6.ink, "text-anchor": inside ? "end" : "start", "paint-order": "stroke", stroke: "#fff", "stroke-width": 3 }));
      if (!u && !fin) { const hit = svgEl("rect", { x: px - 4, y: yy - 4, width: Math.max(w + 8, 160), height: sh + 8, fill: "transparent", style: "cursor:pointer" }); hit.addEventListener("click", () => attach(i)); g.append(hit); }
    });
    g.append(txt(px, yL - 14, used.length === n ? `이어 붙인 띠: 모두 ${av6Fmt(sum)}${unit}` : "이어 붙인 띠", 15, { fill: AV6.ink, "text-anchor": "start" }));
    g.append(svgEl("rect", { x: px, y: yL, width: sum * k, height: sh, rx: 5, fill: "#fff", stroke: AV6.grid, "stroke-width": 2, "stroke-dasharray": "6 4" }));
    let x = px;
    used.forEach(i => { const v = vals[i], c = AV6_COLS[i % AV6_COLS.length]; g.append(svgEl("rect", { x, y: yL, width: v * k, height: sh, fill: c + "55", stroke: c, "stroke-width": 1.5 })); ringRow(g, x, yL, v, c); if (!opt.ring) g.append(txt(x + v * k / 2, yL + sh / 2, String(v), 14)); x += v * k; });
    if (parts) {
      const pw = sum * k / parts;
      for (let j = 1; j < parts; j++) g.append(svgEl("line", { x1: px + pw * j, y1: yL - 8, x2: px + pw * j, y2: yL + sh + 8, stroke: parts === n ? AV6.red : AV6.gray, "stroke-width": 3 }));
      for (let j = 0; j < parts; j++) {
        g.append(svgEl("path", { d: `M${px + pw * j + 3} ${yL + sh + 10} q${pw / 2 - 3} 14 ${pw - 6} 0`, fill: "none", stroke: parts === n ? AV6.red : AV6.gray, "stroke-width": 1.5 }));
        g.append(txt(px + pw * (j + .5), yL + sh + 36, `${av6Fmt(sum / parts)}${unit}`, 14, { fill: parts === n ? AV6.red : AV6.gray }));
      }
    }
    read.textContent = used.length < n ? `띠를 눌러 이어 붙여요: ${used.map(i => vals[i]).join(" + ") || "…"}` :
      parts ? `${av6Fmt(sum)} ÷ ${parts} = ${av6Fmt(sum / parts)}` : `${vals.join(" + ")} = ${av6Fmt(sum)} (${unit || "모두"}) — 이제 몇 등분할지 골라요.`;
  };
  const attach = i => {
    if (used.includes(i) || fin) return; used.push(i); draw();
    if (used.length === n) {
      tools.innerHTML = "";
      tools.append(h("span", { class: "jua" }, "이어 붙인 띠를 "));
      for (let p = 2; p <= Math.max(n + 2, 5); p++) tools.append(h("button", { onclick: e => cut(p, e.currentTarget) }, `${p}등분`));
      tools.append(h("span", { class: "jua" }, " 하기"));
    }
  };
  const cut = (p, btn) => {
    if (fin) return; parts = p; [...tools.querySelectorAll("button")].forEach(b => b.classList.toggle("av6on", b === btn)); draw();
    if (p !== n) { api.fail(`자료가 ${n}개이니까 ${p}등분이 아니라 자료의 수만큼(${n}등분) 똑같이 나누어야 해요.`, `${p}등분`); return; }
    fin = true;
    av6Finish(body, api, opt, `${vals.join("+")}=${av6Fmt(sum)}, ${av6Fmt(sum)}÷${n}=${av6Fmt(avg)}`, opt.msg || `띠를 이어 붙이면 ${av6Fmt(sum)}${unit}, ${n}등분하면 한 칸에 ${av6Fmt(avg)}${unit}씩이에요.`, { sum, avg });
  };
  api.provide({ words: ["이어 붙이기 = 더하기", "등분하기 = 나누기", "자료의 수"], answers: [`${vals.join(" + ")} = ${av6Fmt(sum)}, ${av6Fmt(sum)} ÷ ${n} = ${av6Fmt(avg)}`] });
  body.append(svg, read, tools); draw();
}

/* =========================================================
   4. 평균을 이용해 모르는 값 찾기 — ? 막대를 끌어 올리고 내려 평균이 목표와 같아지게 해요
   파란 점선 = 지금 자료를 고르게 한 높이(지금 평균), 빨간 선 = 알려 준 평균
   opt: {names, vals(모르는 값 null), target, unit, hi, gstep, start, ask|then, ok}
   ========================================================= */
function av6Guess(body, api, opt) {
  const names = opt.names, vals = opt.vals, n = vals.length, u = vals.indexOf(null), unit = opt.unit || "", hi = opt.hi, gs = opt.gstep || 10;
  const known = vals.reduce((a, v) => a + (v || 0), 0), ans = opt.target * n - known;
  let cur = opt.start != null ? opt.start : Math.round(hi * .15), fin = false;
  const W = 640, padL = 50, padR = 70, padT = 22, plotH = 250, baseY = padT + plotH, H = baseY + 40, cw = (W - padL - padR) / n, bw = Math.min(54, cw * .55);
  const y = v => baseY - v / hi * plotH;
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = opt.maxW || "36em";
  for (let v = 0; v <= hi; v += gs) { svg.append(svgEl("line", { x1: padL, y1: y(v), x2: W - padR, y2: y(v), stroke: v ? AV6.grid : AV6.ink, "stroke-width": v ? 1 : 2 })); svg.append(txt(padL - 8, y(v), String(v), 12, { fill: AV6.gray, "text-anchor": "end" })); }
  names.forEach((nm, i) => svg.append(txt(padL + cw * (i + .5), baseY + 18, nm, 14, { fill: i === u ? AV6.red : AV6.ink })));
  const dyn = svgEl("g"); svg.append(dyn);
  const read = h("div", { class: "av6read" });
  const draw = () => {
    dyn.innerHTML = "";
    vals.forEach((v0, i) => {
      const v = i === u ? cur : v0, cx = padL + cw * (i + .5);
      dyn.append(svgEl("rect", { x: cx - bw / 2, y: y(v), width: bw, height: baseY - y(v), fill: i === u ? (fin ? AV6.green : "#F6C8B5") : AV6_COLS[1], stroke: i === u ? AV6.red : "none", "stroke-width": 2, "stroke-dasharray": i === u && !fin ? "6 4" : "" }));
      dyn.append(txt(cx, y(v) - 11, i === u ? (fin ? String(v) : `? (${v})`) : String(v), 14, { fill: i === u ? AV6.red : AV6.ink }));
      if (i === u && !fin) dyn.append(svgEl("rect", { x: cx - bw / 2 - 4, y: y(v) - 5, width: bw + 8, height: 10, rx: 5, fill: AV6.red }));
    });
    const m = (known + cur) / n;
    dyn.append(svgEl("line", { x1: padL, y1: y(opt.target), x2: W - padR + 4, y2: y(opt.target), stroke: AV6.red, "stroke-width": 2.5 }));
    dyn.append(txt(W - padR + 8, y(opt.target), `평균 ${opt.target}`, 13, { fill: AV6.red, "text-anchor": "start" }));
    dyn.append(svgEl("line", { x1: padL, y1: y(m), x2: W - padR + 4, y2: y(m), stroke: AV6.blue, "stroke-width": 2.5, "stroke-dasharray": "7 5" }));
    dyn.append(txt(W - padR + 8, y(m) + (Math.abs(y(m) - y(opt.target)) < 16 ? 16 : 0), "지금", 13, { fill: AV6.blue, "text-anchor": "start" }));
    const cmp = Math.abs(m - opt.target) < 1e-9 ? "과 같아요" : m < opt.target ? "보다 낮아요" : "보다 높아요";
    read.textContent = `${av6Jo(names[u], "이/가")} ${cur}${unit}일 때, 고르게 한 높이(파란 점선)가 평균 ${opt.target}${unit}${cmp}.`;
  };
  const set = p => { let v = Math.round(((baseY - p.y) / plotH * hi) / (opt.step || 1)) * (opt.step || 1); cur = Math.max(0, Math.min(hi, v)); draw(); };
  dragOn(svg, p => { if (fin) return false; set(p); return true; }, set, () => {
    if (fin) return;
    if (cur === ans) { fin = true; draw(); av6Finish(body, api, opt, `${names[u]} ${ans}${unit}`, opt.msg || `${av6Jo(names[u], "이/가")} ${ans}${unit}일 때 평균이 ${av6Jo(opt.target + unit, "이/가")} 돼요.`, { ans }); }
  });
  api.provide({ words: ["(평균) × (자료의 수)", "전체 합", "모르는 값 = 전체 − 아는 값의 합"], answers: [`${names[u]} ${ans}${unit}`] });
  body.append(svg, read, h("p", { class: "av6small" }, "빨간 손잡이가 있는 ? 막대를 위아래로 끌어 보세요. 파란 점선이 빨간 평균선과 겹치면 돼요."));
  draw();
}

/* ---------- 주머니·상자 그림 ---------- */
/* bags: [{name, items:[{c, t, n}], shape:"ball"|"sq"|"fish"}], kind: "bag"|"box" */
function av6ItemShape(g, x, y, r, it, shape) {
  if (shape === "sq") g.append(svgEl("rect", { x: x - r, y: y - r * .8, width: r * 2, height: r * 1.6, rx: 3, fill: it.c, stroke: "#00000055", "stroke-width": 1.2 }));
  else if (shape === "fish") { g.append(svgEl("ellipse", { cx: x - r * .15, cy: y, rx: r * .95, ry: r * .6, fill: it.c, stroke: "#7A4A1E", "stroke-width": 1.2 })); g.append(svgEl("path", { d: `M${x + r * .7} ${y} l${r * .5} ${-r * .45} v${r * .9} z`, fill: it.c, stroke: "#7A4A1E", "stroke-width": 1.2 })); }
  else g.append(svgEl("circle", { cx: x, cy: y, r, fill: it.c, stroke: "#00000055", "stroke-width": 1.2 }));
}
function av6DrawBag(g, cx, cy, bag, kind, scale) {
  const s = scale || 1, w = 120 * s, hh = 104 * s;
  if (kind === "box") {
    g.append(svgEl("rect", { x: cx - w / 2, y: cy - hh / 2, width: w, height: hh, rx: 8, fill: "#FFF6E0", stroke: "#B9873E", "stroke-width": 2.5 }));
    g.append(svgEl("rect", { x: cx - w * .22, y: cy - hh / 2 - 3, width: w * .44, height: 8, rx: 4, fill: "#7A4A1E" }));
  } else {
    g.append(svgEl("path", { d: `M${cx - w * .3} ${cy - hh * .42} Q${cx - w * .62} ${cy + hh * .1} ${cx - w * .42} ${cy + hh * .45} Q${cx} ${cy + hh * .6} ${cx + w * .42} ${cy + hh * .45} Q${cx + w * .62} ${cy + hh * .1} ${cx + w * .3} ${cy - hh * .42} Z`, fill: "#EAF3FB", stroke: "#5F7F9B", "stroke-width": 2.5 }));
    g.append(svgEl("path", { d: `M${cx - w * .3} ${cy - hh * .42} Q${cx} ${cy - hh * .56} ${cx + w * .3} ${cy - hh * .42}`, fill: "none", stroke: "#B5523B", "stroke-width": 3 }));
  }
  const list = []; bag.items.forEach(it => { for (let k = 0; k < it.n; k++) list.push(it); });
  const per = list.length <= 4 ? 2 : 3, r = (list.length <= 4 ? 15 : 12) * s, rows = Math.ceil(list.length / per);
  list.forEach((it, k) => {
    const row = Math.floor(k / per), col = k % per, inRow = Math.min(per, list.length - row * per);
    const x = cx + (col - (inRow - 1) / 2) * r * 2.5, yy = cy + 4 * s + (row - (rows - 1) / 2) * r * 2.3;
    av6ItemShape(g, x, yy, r, it, bag.shape);
  });
  g.append(txt(cx, cy + hh / 2 + 18 * s, bag.name, 18 * s));
}
function av6BagFig(bags, o = {}) {
  const n = bags.length, cw = o.cw || (n > 3 ? 130 : 200), W = cw * n, H = o.H || 175, sc = o.scale || (n > 3 ? .9 : 1);
  return av6Fig(W, H, s => bags.forEach((b, i) => av6DrawBag(s, cw * (i + .5), 75, b, o.kind, sc)), o.maxW || (n > 3 ? "36em" : "30em"));
}
function av6Legend(items) {
  return h("div", { class: "av6small" }, items.map(it => `${it.t}`).join(" · "));
}
/* =========================================================
   5. 꺼내 보기 — 주머니(상자)를 누르면 하나를 꺼내 보여 주고 다시 넣어요
   opt: {bags, kind, need(주머니마다 꺼낼 횟수), legend, ask|then, ok}
   ========================================================= */
function av6Bag(body, api, opt) {
  const bags = opt.bags, n = bags.length, need = opt.need || 4, cw = n > 3 ? 130 : 200, W = cw * n, H = 260, sc = n > 3 ? .9 : 1;
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = opt.maxW || (n > 3 ? "38em" : n === 1 ? "15em" : "32em");
  const tally = bags.map(b => b.items.map(() => 0)), cnt = bags.map(() => 0), last = bags.map(() => null); let fin = false;
  const dyn = svgEl("g");
  bags.forEach((b, i) => {
    const g = svgEl("g", { style: "cursor:pointer" }); av6DrawBag(g, cw * (i + .5), 95, b, opt.kind, sc);
    g.append(svgEl("rect", { x: cw * i + 6, y: 20, width: cw - 12, height: 170, fill: "transparent" }));
    g.addEventListener("click", () => pull(i)); svg.append(g);
  });
  svg.append(dyn);
  const read = h("div", { class: "av6read" });
  const draw = () => {
    dyn.innerHTML = "";
    bags.forEach((b, i) => {
      const cx = cw * (i + .5);
      if (last[i] != null) { const it = b.items[last[i]]; dyn.append(svgEl("rect", { x: cx - 34, y: 4, width: 68, height: 28, rx: 14, fill: "#fff", stroke: it.c, "stroke-width": 2 })); av6ItemShape(dyn, cx - 18, 18, 9, it, b.shape); dyn.append(txt(cx + 8, 19, "꺼냄!", 12, { fill: AV6.ink })); }
      const t = b.items.map((it, j) => `${it.k || it.t.slice(0, 1)} ${tally[i][j]}`).join(" · ");
      dyn.append(txt(cx, 222, cnt[i] ? t : "눌러서 꺼내 봐요", 13, { fill: AV6.gray }));
      dyn.append(txt(cx, 244, `${cnt[i]}번 꺼냄`, 13, { fill: cnt[i] >= need ? AV6.green : AV6.gray }));
    });
    read.textContent = fin ? "충분히 꺼내 봤어요. 꺼낸 것은 다시 넣었어요." : `주머니마다 ${need}번 이상 꺼내 보세요. (꺼낸 것은 다시 넣어요)`;
  };
  const pull = i => {
    const tot = bags[i].items.reduce((a, it) => a + it.n, 0); let r = Math.random() * tot, j = 0;
    while (r >= bags[i].items[j].n) { r -= bags[i].items[j].n; j++; }
    tally[i][j]++; cnt[i]++; last[i] = j; draw();
    if (!fin && cnt.every(c => c >= need)) { fin = true; draw(); av6Finish(body, api, opt, bags.map((b, k) => `${b.name}: ` + b.items.map((it, jj) => `${it.t} ${tally[k][jj]}`).join(", ")).join(" / "), opt.msg || "여러 번 꺼내 보았어요.", { tally }); }
  };
  const all = h("button", { onclick: () => bags.forEach((_, i) => pull(i)) }, "모두 한 번씩 꺼내기");
  api.provide({ words: ["나올 수 있는 것", "개수가 많을수록", "가능성"], answers: [] });
  body.append(...(opt.legend ? [h("p", { class: "av6small" }, opt.legend)] : []), svg, read, h("div", { class: "av6tools" }, all));
  draw();
}

/* ---------- 회전판 그림 ---------- */
/* secs: [{c, f}] f는 원 전체에 대한 몫, 12시 방향에서 시계 방향으로 */
function av6DrawSpinner(g, cx, cy, r, secs, ang) {
  let a0 = -90;
  secs.forEach(s => {
    const a1 = a0 + s.f * 360;
    if (s.f >= .9999) g.append(svgEl("circle", { cx, cy, r, fill: s.c, stroke: AV6.ink, "stroke-width": 2 }));
    else if (s.f > 0) {
      const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)], A = p(a0), B = p(a1);
      g.append(svgEl("path", { d: `M${cx} ${cy} L${av6R(A[0])} ${av6R(A[1])} A${r} ${r} 0 ${s.f > .5 ? 1 : 0} 1 ${av6R(B[0])} ${av6R(B[1])} Z`, fill: s.c, stroke: AV6.ink, "stroke-width": 1.5 }));
    }
    a0 = a1;
  });
  const nd = svgEl("g", { transform: `rotate(${ang || 0} ${cx} ${cy})` });
  nd.append(svgEl("path", { d: `M${cx - 5} ${cy} L${cx} ${cy - r * .82} L${cx + 5} ${cy} Z`, fill: AV6.ink }));
  nd.append(svgEl("circle", { cx, cy, r: 6, fill: "#fff", stroke: AV6.ink, "stroke-width": 2 }));
  g.append(nd); return nd;
}
function av6SpinFig(spins, o = {}) {
  const n = spins.length, cw = o.cw || 130, W = cw * n, r = o.r || 46, H = r * 2 + 50;
  return av6Fig(W, H, s => spins.forEach((sp, i) => { av6DrawSpinner(s, cw * (i + .5), r + 10, r, sp.secs, sp.ang || 30); s.append(txt(cw * (i + .5), r * 2 + 32, sp.name, 18)); }), o.maxW || (n > 3 ? "36em" : "26em"));
}
/* =========================================================
   6. 회전판 돌리기 — 회전판을 누르면 화살이 돌다가 멈춰요
   opt: {spins:[{name, secs:[{c, f, t}]}], need, legend, ask|then, ok}
   ========================================================= */
function av6Spin(body, api, opt) {
  const spins = opt.spins, n = spins.length, need = opt.need || 3, cw = n > 3 ? 128 : 170, r = n > 3 ? 48 : 60, W = cw * n, H = r * 2 + 88;
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = opt.maxW || (n > 3 ? "38em" : "30em");
  const cnt = spins.map(() => 0), tally = spins.map(sp => sp.secs.map(() => 0)), ang = spins.map(() => 20), busy = spins.map(() => false); let fin = false;
  const needles = [], labs = [];
  spins.forEach((sp, i) => {
    const g = svgEl("g", { style: "cursor:pointer" }), cx = cw * (i + .5);
    needles.push(av6DrawSpinner(g, cx, r + 12, r, sp.secs, ang[i]));
    g.append(txt(cx, r * 2 + 34, sp.name, 18));
    g.append(svgEl("rect", { x: cx - r - 6, y: 4, width: 2 * r + 12, height: 2 * r + 16, fill: "transparent" }));
    g.addEventListener("click", () => spin(i)); svg.append(g);
    const t = txt(cx, r * 2 + 58, "눌러서 돌려요", 12, { fill: AV6.gray }); labs.push(t); svg.append(t);
  });
  const secAt = (sp, a) => { let x = ((a % 360) + 360) % 360, acc = 0; for (let j = 0; j < sp.secs.length; j++) { acc += sp.secs[j].f * 360; if (x < acc - 1e-9) return j; } return sp.secs.length - 1; };
  const read = h("div", { class: "av6read" }, `회전판마다 ${need}번 이상 돌려 보세요.`);
  const spin = i => {
    if (busy[i]) return; busy[i] = true;
    const from = ang[i], to = from + 720 + Math.random() * 360, t0 = performance.now(), dur = 900;
    const cx = cw * (i + .5), cy = r + 12;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3), a = from + (to - from) * e;
      needles[i].setAttribute("transform", `rotate(${av6R(a)} ${cx} ${cy})`);
      if (t < 1) return requestAnimationFrame(step);
      ang[i] = to % 360; busy[i] = false; const j = secAt(spins[i], ang[i]); tally[i][j]++; cnt[i]++;
      labs[i].textContent = spins[i].secs.map((s, jj) => `${s.k || (s.t || "").slice(0, 1)} ${tally[i][jj]}`).join(" · ");
      if (!fin && cnt.every(c => c >= need)) { fin = true; read.textContent = "충분히 돌려 보았어요."; av6Finish(body, api, opt, spins.map((sp, k) => `${sp.name}: ` + sp.secs.map((s, jj) => `${s.t} ${tally[k][jj]}`).join(", ")).join(" / "), opt.msg || "회전판을 여러 번 돌려 보았어요.", { tally }); }
    };
    requestAnimationFrame(step);
  };
  api.provide({ words: ["색칠된 부분의 넓이", "넓을수록 가능성이 높아요"], answers: [] });
  body.append(...(opt.legend ? [h("p", { class: "av6small" }, opt.legend)] : []), svg, read, h("div", { class: "av6tools" }, h("button", { onclick: () => spins.forEach((_, i) => spin(i)) }, "모두 한 번씩 돌리기")));
}
/* =========================================================
   7. 회전판 색칠하기 — 색을 고르고 칸을 눌러 칠해요
   opt: {k(칸 수), colors:[{c,t}], rule(셈) → 맞으면 "", 아니면 까닭, ok}
   ========================================================= */
function av6Paint(body, api, opt) {
  const k = opt.k || 6, W = 340, H = 300, cx = 170, cy = 150, r = 120;
  const fill = Array(k).fill(null); let pen = 0;
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = "20em";
  const els = [];
  for (let j = 0; j < k; j++) {
    const a0 = -90 + j * 360 / k, a1 = a0 + 360 / k, p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)], A = p(a0), B = p(a1);
    const e = svgEl("path", { d: `M${cx} ${cy} L${av6R(A[0])} ${av6R(A[1])} A${r} ${r} 0 0 1 ${av6R(B[0])} ${av6R(B[1])} Z`, fill: "#fff", stroke: AV6.ink, "stroke-width": 2, style: "cursor:pointer" });
    e.addEventListener("click", () => { fill[j] = pen; e.setAttribute("fill", opt.colors[pen].c); });
    els.push(e); svg.append(e);
  }
  svg.append(svgEl("circle", { cx, cy, r: 6, fill: "#fff", stroke: AV6.ink, "stroke-width": 2 }));
  const pal = h("div", { class: "av6tools" }, h("span", { class: "jua" }, "색 고르기: "), ...opt.colors.map((c, i) => h("button", { class: i === 0 ? "av6on" : "", style: `border-color:${c.c}`, onclick: e => { pen = i; [...pal.querySelectorAll("button")].forEach(b => b.classList.toggle("av6on", b === e.currentTarget)); } }, h("span", { style: `display:inline-block;width:.9em;height:.9em;border-radius:50%;background:${c.c};vertical-align:middle;margin-right:.3em` }), c.t)));
  api.provide({ words: opt.words || [], answers: opt.answer ? [opt.answer] : [] });
  body.append(pal, svg, h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
    api.tryOnce();
    if (fill.some(v => v == null)) return api.fail("모든 칸을 색칠해 주세요.", "빈칸 있음");
    const cnt = opt.colors.map((_, i) => fill.filter(v => v === i).length), msg = opt.rule(cnt), ans = opt.colors.map((c, i) => `${c.t} ${cnt[i]}칸`).join(", ");
    msg ? api.fail(msg, ans) : api.done(ans, opt.ok);
  } }, "확인하기")));
}

/* =========================================================
   8. 가능성 띠에 카드 놓기 — 카드를 끌어 놓거나, 카드를 누른 뒤 칸을 눌러요
   opt: {pos: 5|3, cards:[{t, a(칸 번호), why}], nums(0·[1/2]·1 보이기), heads(칸 이름 바꾸기), ok}
   ========================================================= */
function av6Scale(body, api, opt) {
  const P = opt.pos || 5;
  const heads = opt.heads || (P === 3 ? ["불가능하다", "반반이다", "확실하다"] : AV6_WORDS);
  const nums = opt.nums ? (P === 3 ? ["0", "[1/2]", "1"] : ["0", "", "[1/2]", "", "1"]) : null;
  const place = opt.cards.map(() => -1); let sel = null;
  const pool = h("div", { class: "av6pool" });
  const bins = h("div", { class: "av6bins", style: `grid-template-columns:repeat(${P},minmax(0,1fr))` });
  const lists = [];
  for (let j = 0; j < P; j++) {
    const lst = h("div", { style: "display:flex;flex-direction:column;gap:.3em" });
    const bin = h("div", { class: "av6bin", "data-bin": String(j), onclick: e => { if (e.target.closest(".av6crd")) return; if (sel != null) { put(sel, j); } } },
      h("div", { class: "av6binh" }, heads[j]), ...(nums ? [h("div", { class: "av6binn" }, nums[j] || "​")] : []), lst);
    lists.push(lst); bins.append(bin);
  }
  const cards = opt.cards.map((c, i) => {
    const el = h("button", { class: "av6crd", type: "button" }, c.t);
    let down = null, ghost = null;
    el.addEventListener("pointerdown", e => { down = { x: e.clientX, y: e.clientY }; try { el.setPointerCapture(e.pointerId); } catch (_) { } });
    el.addEventListener("pointermove", e => {
      if (!down) return;
      if (!ghost && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) { ghost = el.cloneNode(true); ghost.classList.add("av6ghost"); ghost.style.width = el.offsetWidth + "px"; document.body.append(ghost); }
      if (ghost) { ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px"; const b = document.elementFromPoint(e.clientX, e.clientY); [...bins.children].forEach(x => x.classList.toggle("av6over", !!b && x.contains(b))); }
    });
    const up = e => {
      if (!down) return; const wasDrag = !!ghost; down = null;
      if (ghost) { ghost.remove(); ghost = null; [...bins.children].forEach(x => x.classList.remove("av6over")); const b = document.elementFromPoint(e.clientX, e.clientY), bin = b && b.closest && b.closest(".av6bin"); if (bin && bins.contains(bin)) put(i, +bin.dataset.bin); }
      if (!wasDrag) { sel = sel === i ? null : i; cards.forEach((c2, k) => c2.classList.toggle("av6on", k === sel)); }
    };
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", () => { down = null; if (ghost) { ghost.remove(); ghost = null; } });
    pool.append(el); return el;
  });
  const put = (i, j) => { place[i] = j; lists[j].append(cards[i]); cards[i].classList.remove("av6on", "av6good", "av6bad"); sel = null; cards.forEach(c => c.classList.remove("av6on")); };
  api.provide({ words: heads.map(av6Plain), answers: opt.cards.map(c => `${av6Plain(c.t)} → ${av6Plain(heads[c.a])}`) });
  body.append(h("p", { class: "av6small" }, "카드를 끌어 알맞은 칸에 놓아요. (카드를 누른 뒤 칸을 눌러도 돼요)"), pool,
    h("div", { class: "av6arrow" }), h("div", { class: "av6small", style: "display:flex;justify-content:space-between;margin:0 .3em .2em" }, h("span", {}, "가능성이 낮아요"), h("span", {}, "가능성이 높아요")), bins,
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce();
      if (place.some(p => p < 0)) return api.fail("모든 카드를 칸에 놓아 주세요.", "덜 놓음");
      let bad = -1;
      opt.cards.forEach((c, i) => { const ok = place[i] === c.a; cards[i].classList.toggle("av6good", ok); cards[i].classList.toggle("av6bad", !ok); if (!ok && bad < 0) bad = i; });
      const ans = opt.cards.map((c, i) => `${av6Plain(c.t)}→${av6Plain(heads[place[i]])}`).join(" / ");
      if (bad < 0) return api.done(ans, opt.ok);
      const c = opt.cards[bad];
      api.fail((c.why && c.why[String(place[bad])]) || c.hint || "빨간 카드를 다시 생각해 봐요.", ans);
    } }, "확인하기")));
}

/* =========================================================
   9. 던지기 실험 — 동전(그림면·숫자 면)이나 주사위(홀수·짝수)를 여러 번 던져요
   opt: {kind:"coin"|"dice", ms:[기록할 던진 횟수…], need, ask|then, ok}
   ========================================================= */
function av6Face(kind, v) {
  const W = 120, H = 120, s = makeSvg(W, H); s.setAttribute("class", "av6fig"); s.style.maxWidth = "6.5em"; s.style.display = "inline-block"; s.style.margin = "0";
  if (kind === "coin") {
    s.append(svgEl("circle", { cx: 60, cy: 60, r: 50, fill: "#E9C46A", stroke: "#A27B1F", "stroke-width": 4 }));
    s.append(svgEl("circle", { cx: 60, cy: 60, r: 41, fill: "none", stroke: "#A27B1F", "stroke-width": 1.5 }));
    if (v === 0) {   // 그림면: 꽃 그림
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; s.append(svgEl("ellipse", { cx: 60 + 14 * Math.cos(a), cy: 56 + 14 * Math.sin(a), rx: 9, ry: 6, transform: `rotate(${k * 60} ${60 + 14 * Math.cos(a)} ${56 + 14 * Math.sin(a)})`, fill: "#C98E1E" })); }
      s.append(svgEl("circle", { cx: 60, cy: 56, r: 7, fill: "#8A5A0B" })); s.append(txt(60, 88, "그림", 13, { fill: "#6B4A0B" }));
    } else { s.append(txt(60, 56, "100", 28, { fill: "#6B4A0B" })); s.append(txt(60, 86, "숫자", 13, { fill: "#6B4A0B" })); }
  } else {
    s.append(svgEl("rect", { x: 12, y: 12, width: 96, height: 96, rx: 16, fill: "#fff", stroke: AV6.ink, "stroke-width": 3 }));
    const P = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] };
    (P[v] || []).forEach(([a, b]) => s.append(svgEl("circle", { cx: 12 + a * 24, cy: 12 + b * 24, r: 8, fill: v === 1 ? AV6.red : AV6.ink })));
  }
  return s;
}
function av6Sim(body, api, opt) {
  const coin = opt.kind === "coin", G = coin ? ["그림면", "숫자 면"] : ["홀수", "짝수"], ms = opt.ms || [10], need = opt.need || ms[ms.length - 1];
  let res = [], fin = false; const rows = [], past = [];
  const face = h("span", {}, av6Face(opt.kind, coin ? 0 : 1));
  const big = h("div", { class: "av6big" }, "던져 보세요!");
  const tbl = h("div");
  const bar = makeSvg(600, 54); bar.setAttribute("class", "av6fig"); bar.style.maxWidth = "36em";
  const cntA = () => res.filter(r => r === 0).length;
  const draw = () => {
    const N = res.length, a = cntA(), b = N - a;
    tbl.innerHTML = "";
    const head = ["던진 횟수(번)", ...ms.map(String), ...(N > ms[ms.length - 1] ? [`${N}`] : [])];
    const vA = ms.map(m => rows[ms.indexOf(m)] ? String(rows[ms.indexOf(m)][0]) : "​"), vB = ms.map(m => rows[ms.indexOf(m)] ? String(rows[ms.indexOf(m)][1]) : "​");
    if (N > ms[ms.length - 1]) { vA.push(String(a)); vB.push(String(b)); }
    tbl.append(av6Tbl(head, [[`${G[0]}(번)`, ...vA], [`${G[1]}(번)`, ...vB]], { rowHead: true, cap: `던진 횟수별 ${G[0]}${coin ? "과" : "와"} ${G[1]}${coin ? "이" : "가"} 나온 횟수` }));
    past.forEach((p, i) => tbl.append(h("div", { class: "av6small" }, `지난 실험 ${i + 1}: ${p}`)));
    bar.innerHTML = "";
    const x0 = 20, w = 560, fa = N ? a / N : .5;
    bar.append(svgEl("rect", { x: x0, y: 8, width: w * fa, height: 24, fill: !N ? "#EEF1F0" : coin ? "#E9C46A" : AV6.orange }));
    bar.append(svgEl("rect", { x: x0 + w * fa, y: 8, width: w * (1 - fa), height: 24, fill: !N ? "#EEF1F0" : coin ? "#A9C7E8" : AV6.sky }));
    bar.append(svgEl("rect", { x: x0, y: 8, width: w, height: 24, fill: "none", stroke: AV6.ink, "stroke-width": 1.5 }));
    bar.append(svgEl("line", { x1: x0 + w / 2, y1: 2, x2: x0 + w / 2, y2: 38, stroke: AV6.red, "stroke-width": 2.5, "stroke-dasharray": "4 3" }));
    if (N) { bar.append(txt(x0 + 6, 20, `${G[0]} ${a}`, 13, { "text-anchor": "start" })); bar.append(txt(x0 + w - 6, 20, `${G[1]} ${b}`, 13, { "text-anchor": "end" })); }
    bar.append(txt(x0 + w / 2, 45, "반반", 12, { fill: AV6.red }));
    big.textContent = N ? `지금까지 ${N}번: ${G[0]} ${a}번, ${G[1]} ${b}번` : "던져 보세요!";
  };
  const one = () => coin ? (Math.random() < .5 ? 0 : 1) : (1 + Math.floor(Math.random() * 6));
  const toss = k => {
    let lastV = null;
    for (let t = 0; t < k; t++) {
      const v = one(); lastV = v; res.push(coin ? v : (v % 2 ? 0 : 1));
      const j = ms.indexOf(res.length); if (j >= 0) rows[j] = [cntA(), res.length - cntA()];
    }
    face.innerHTML = ""; face.append(av6Face(opt.kind, lastV));
    draw();
    if (!fin && res.length >= need) { fin = true; if (typeof opt.ask === "function") { again.disabled = true; again.title = "아래 물음에 내 결과를 쓴 뒤에는 표를 지우지 않아요."; } av6Finish(body, api, opt, `${res.length}번: ${G[0]} ${cntA()}, ${G[1]} ${res.length - cntA()}`, opt.msg || `${need}번 던지기를 마쳤어요.`, { a: rows[ms.length - 1] ? rows[ms.length - 1][0] : cntA(), b: rows[ms.length - 1] ? rows[ms.length - 1][1] : res.length - cntA(), n: res.length }); }
  };
  const again = h("button", { onclick: () => { if (!res.length) return; past.push(`${res.length}번 던져 ${G[0]} ${cntA()}번, ${G[1]} ${res.length - cntA()}번`); res = []; rows.length = 0; draw(); } }, "새로 다시 실험하기");
  api.provide({ words: ["반반이다", "[1/2]", "던진 횟수가 많을수록", "비슷해져요"].map(av6Plain), answers: [] });
  body.append(h("div", { style: "display:flex;align-items:center;gap:.8em;flex-wrap:wrap" }, face, big),
    h("div", { class: "av6tools" }, h("button", { onclick: () => toss(1) }, "1번 던지기"), h("button", { onclick: () => toss(10) }, "10번 던지기"),
      ...(ms.length > 1 ? [h("button", { onclick: () => toss(20) }, "20번 던지기(친구 한 명 몫)"), h("button", { onclick: () => toss(100) }, "100번 더 던지기")] : []), again),
    bar, tbl, h("p", { class: "av6small" }, opt.note || "꺼낼 때마다, 던질 때마다 결과는 달라요. ‘새로 다시 실험하기’로 다시 해 보면 표의 수가 바뀌어요."));
  draw();
}

/* =========================================================
   10. 차례로 누르기 — 가능성이 높은 것부터 차례로 눌러요(그림 카드)
   opt: {items:[{t, fig}], order:[번호…], ok, bad}
   ========================================================= */
function av6Rank(body, api, opt) {
  const picked = [];
  const row = h("div", { class: "av6pick" });
  const show = h("div", { class: "av6read" }, "차례: ");
  const btns = opt.items.map((it, i) => h("button", { type: "button", onclick: e => {
    if (picked.includes(i)) return; picked.push(i); e.currentTarget.classList.add("av6on");
    e.currentTarget.prepend(h("span", { class: "av6no" }, String(picked.length))); show.textContent = "차례: " + picked.map(k => opt.items[k].t).join(", ");
    if (picked.length === opt.items.length) {
      api.tryOnce(); const ans = picked.map(k => opt.items[k].t).join(", ");
      if (picked.every((v, k) => v === opt.order[k])) api.done(ans, opt.ok);
      else api.fail(opt.bad || "차례가 달라요. ‘다시 고르기’를 누르고 한 번 더 해 봐요.", ans);
    }
  } }, ...(it.fig ? [it.fig()] : []), it.t));
  row.append(...btns);
  api.provide({ words: opt.items.map(it => it.t), answers: [opt.order.map(k => opt.items[k].t).join(", ")] });
  body.append(row, show, h("div", { class: "av6tools" }, h("button", { onclick: () => { picked.length = 0; btns.forEach(b => { b.classList.remove("av6on"); const x = b.querySelector(".av6no"); x && x.remove(); }); show.textContent = "차례: "; } }, "다시 고르기")));
}

/* =========================================================
   11. 막대그래프 그리기 — 막대 끝을 끌어 표의 수만큼 그려요
   opt: {names, vals, unit, max, step(눈금 한 칸의 크기), title, valAxis, catAxis, ok}
   ========================================================= */
function av6Bars(body, api, opt) {
  const names = opt.names, n = names.length, st = opt.step || 1, cells = Math.ceil(opt.max / st), cur = names.map(() => 0);
  const W = 560, padL = 64, padR = 16, padT = 40, cs = Math.min(26, 250 / cells), baseY = padT + cells * cs, H = baseY + 46, cw = (W - padL - padR) / n, bw = Math.min(48, cw * .5);
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = opt.maxW || "32em";
  svg.append(txt(W / 2, 16, opt.title || "", 16));
  for (let k = 0; k <= cells; k++) { const y = baseY - k * cs; svg.append(svgEl("line", { x1: padL, y1: y, x2: W - padR, y2: y, stroke: k ? AV6.grid : AV6.ink, "stroke-width": k ? 1 : 2 })); if (k % (opt.every || 1) === 0) svg.append(txt(padL - 8, y, String(k * st), 12, { fill: AV6.gray, "text-anchor": "end" })); }
  svg.append(svgEl("line", { x1: padL, y1: padT - 6, x2: padL, y2: baseY, stroke: AV6.ink, "stroke-width": 2 }));
  svg.append(txt(padL - 8, padT - 20, `(${opt.unit})`, 12, { fill: AV6.gray, "text-anchor": "end" }));
  names.forEach((nm, i) => svg.append(txt(padL + cw * (i + .5), baseY + 18, nm, 13)));
  const dyn = svgEl("g"); svg.append(dyn);
  const draw = () => { dyn.innerHTML = ""; cur.forEach((v, i) => { const cx = padL + cw * (i + .5), hh = v / st * cs; dyn.append(svgEl("rect", { x: cx - bw / 2, y: baseY - hh, width: bw, height: hh, fill: AV6_COLS[i % AV6_COLS.length], opacity: .9 })); dyn.append(svgEl("rect", { x: cx - bw / 2 - 3, y: baseY - hh - 4, width: bw + 6, height: 8, rx: 4, fill: AV6.ink, opacity: .7 })); }); };
  let col = -1;
  const set = p => { if (col < 0) return; let v = Math.round((baseY - p.y) / cs) * st; cur[col] = Math.max(0, Math.min(cells * st, v)); draw(); };
  dragOn(svg, p => { const i = Math.floor((p.x - padL) / cw); if (i < 0 || i >= n) return false; col = i; set(p); return true; }, set, () => { col = -1; });
  api.provide({ words: ["눈금 한 칸", "막대의 길이"], answers: [names.map((nm, i) => `${nm} ${opt.vals[i]}`).join(", ")] });
  body.append(av6HTbl(opt.cap, names, opt.vals.map(String), { h1: opt.catAxis || "항목", h2: `${opt.valAxis || "수"}(${opt.unit})` }), svg,
    h("p", { class: "av6small" }, `막대를 위아래로 끌어 그려요. 세로 눈금 한 칸은 ${av6Jo(st + opt.unit, "이에요/예요")}.`),
    h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {
      api.tryOnce(); const bad = cur.findIndex((v, i) => v !== opt.vals[i]), ans = names.map((nm, i) => `${nm} ${cur[i]}`).join(", ");
      if (bad < 0) return api.done(ans, opt.ok);
      api.fail(`${names[bad]}의 막대를 다시 보세요. ${st > 1 ? `${av6Jo(opt.vals[bad] + opt.unit, "은/는")} 눈금 ${opt.vals[bad] / st}칸이에요` : `${opt.vals[bad]}${opt.unit}만큼 그려야 해요`}.`, ans);
    } }, "확인하기")));
  draw();
}

/* 꺾은선그래프 그림(읽기용) */
function av6LineFig(o) {
  const n = o.names.length, W = 560, padL = 60, padR = 20, padT = 36, plotH = 200, baseY = padT + plotH, H = baseY + 42, cw = (W - padL - padR) / n;
  const y = v => baseY - (v - o.lo) / (o.hi - o.lo) * plotH;
  return av6Fig(W, H, s => {
    s.append(txt(W / 2, 16, o.title, 15));
    for (let v = o.lo; v <= o.hi; v += o.gs) { s.append(svgEl("line", { x1: padL, y1: y(v), x2: W - padR, y2: y(v), stroke: v === o.lo ? AV6.ink : AV6.grid, "stroke-width": v === o.lo ? 2 : 1 })); s.append(txt(padL - 8, y(v), String(v), 12, { fill: AV6.gray, "text-anchor": "end" })); }
    s.append(txt(padL - 8, padT - 18, `(${o.unit})`, 12, { fill: AV6.gray, "text-anchor": "end" }));
    if (o.lo > 0) s.append(svgEl("path", { d: `M${padL - 6} ${baseY - 8} l6 -4 l6 4 l6 -4`, fill: "none", stroke: AV6.ink, "stroke-width": 1.5 }));
    const pts = o.vals.map((v, i) => [padL + cw * (i + .5), y(v)]);
    s.append(svgEl("polyline", { points: pts.map(p => p.join(",")).join(" "), fill: "none", stroke: AV6.red, "stroke-width": 3 }));
    pts.forEach((p, i) => { s.append(svgEl("circle", { cx: p[0], cy: p[1], r: 5, fill: AV6.red })); s.append(txt(p[0], baseY + 18, o.names[i], 13)); });
  }, "32em");
}

/* =========================================================
   12. 송년 잔치 체육관 — 곳곳을 눌러 어떤 활동이 있는지 살펴봐요
   ========================================================= */
const AV6_SPOTS = [
  { k: "ring", t: "고리 던지기", x: 110, y: 120, say: "바구니마다 고리 수가 달라요. 바구니 한 개에 고리가 평균 몇 개씩 들어 있을까요?", tag: "평균" },
  { k: "bean", t: "콩 주머니 던지기", x: 300, y: 125, say: "건강 팀과 장수 팀은 참가한 사람 수가 달라요. 어느 팀이 더 잘했는지 어떻게 비교할까요?", tag: "평균" },
  { k: "gym", t: "건강 체조", x: 500, y: 110, say: "주머니에서 손수건 한 장을 꺼내요. 빨간색 손수건이 나올 가능성은 어느 정도일까요?", tag: "가능성" },
  { k: "snack", t: "간식(귤·붕어빵·우유)", x: 160, y: 270, say: "크림붕어빵 2개와 팥붕어빵 2개가 든 통에서 하나를 꺼내면 크림붕어빵이 나올까요?", tag: "가능성" },
  { k: "prize", t: "경품 뽑기", x: 450, y: 275, say: "경품함 세 개에 든 공이 서로 달라요. 주황색 공이 나올 가능성을 수로 나타낼 수 있을까요?", tag: "가능성" }];
function av6Party(body, api, opt) {
  const W = 620, H = 350, seen = new Set();
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = "38em";
  svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "#F6EBD9" }));
  svg.append(svgEl("rect", { x: 0, y: 190, width: W, height: 160, fill: "#E8CFA6" }));
  svg.append(svgEl("rect", { x: 170, y: 14, width: 280, height: 34, rx: 6, fill: "#C9463B" }));
  svg.append(txt(310, 32, "마을 연합 송년 잔치", 18, { fill: "#fff" }));
  const pic = {
    ring: g => { [0, 1, 2, 3].forEach(k => { g.append(svgEl("rect", { x: 66 + k * 24, y: 128, width: 20, height: 18, rx: 3, fill: AV6_COLS[k], stroke: AV6.ink })); }); g.append(svgEl("circle", { cx: 110, cy: 100, r: 12, fill: "none", stroke: AV6.red, "stroke-width": 4 })); },
    bean: g => { [34, 24, 14].forEach((r, k) => g.append(svgEl("circle", { cx: 300, cy: 128, r, fill: k % 2 ? "#fff" : "#F1A93B", stroke: AV6.ink }))); g.append(svgEl("rect", { x: 330, y: 92, width: 16, height: 14, rx: 4, fill: AV6.green })); },
    gym: g => { g.append(svgEl("circle", { cx: 500, cy: 82, r: 11, fill: "#F2C9A0", stroke: AV6.ink })); g.append(svgEl("path", { d: "M500 93 v30 M500 100 l-20 -12 M500 100 l20 -12 M500 123 l-12 22 M500 123 l12 22", stroke: AV6.ink, "stroke-width": 3, fill: "none" })); g.append(svgEl("rect", { x: 470, y: 78, width: 12, height: 10, fill: AV6.red })); g.append(svgEl("rect", { x: 518, y: 78, width: 12, height: 10, fill: AV6.green })); },
    snack: g => { g.append(svgEl("rect", { x: 110, y: 250, width: 100, height: 40, rx: 5, fill: "#fff", stroke: AV6.ink })); g.append(svgEl("circle", { cx: 128, cy: 268, r: 9, fill: AV6.orange })); av6ItemShape(g, 160, 268, 11, { c: "#D9A35B" }, "fish"); g.append(svgEl("rect", { x: 186, y: 256, width: 14, height: 24, fill: "#fff", stroke: AV6.blue, "stroke-width": 2 })); },
    prize: g => { [0, 1, 2].forEach(k => { g.append(svgEl("rect", { x: 400 + k * 36, y: 258, width: 30, height: 30, rx: 4, fill: "#FFF6E0", stroke: "#B9873E", "stroke-width": 2 })); g.append(txt(415 + k * 36, 273, "가나다"[k], 13)); }); }
  };
  const marks = [];
  AV6_SPOTS.forEach((sp, i) => {
    const g = svgEl("g", { style: "cursor:pointer" }); pic[sp.k](g);
    g.append(svgEl("rect", { x: sp.x - 75, y: sp.y - 50, width: 150, height: 95, fill: "transparent" }));
    const lab = txt(sp.x, sp.y + 54, sp.t, 14, { fill: AV6.ink }); g.append(lab);
    const m = svgEl("circle", { cx: sp.x + 62, cy: sp.y - 40, r: 11, fill: AV6.gray }); const mt = txt(sp.x + 62, sp.y - 40, "?", 13, { fill: "#fff" });
    g.append(m, mt); marks.push([m, mt]);
    g.addEventListener("click", () => { seen.add(i); m.setAttribute("fill", AV6.green); mt.textContent = "✓"; card.innerHTML = ""; card.append(h("b", {}, `${sp.t} — `), sp.say, h("br"), h("span", { class: "av6small" }, `→ ${sp.tag}과 관련 있어요.`)); check(); });
    svg.append(g);
  });
  const card = h("div", { class: "av6box" }, "체육관 곳곳(물음표)을 눌러 어떤 활동이 준비되어 있는지 살펴보세요.");
  let fin = false;
  const check = () => { if (!fin && seen.size === AV6_SPOTS.length) { fin = true; av6Finish(body, api, opt, "다섯 곳을 모두 살펴봄", opt.msg || "송년 잔치의 다섯 가지 활동을 모두 살펴보았어요.", {}); } };
  api.provide({ words: ["고리 던지기", "콩 주머니 던지기", "건강 체조", "간식", "경품 뽑기"], answers: [] });
  body.append(svg, card);
}

/* =========================================================
   13. 9차시 놀이 — 우리 모둠 기록의 평균에 가장 가까운 사람 찾기
   기록 4개를 쓰고 → 평균을 구해 쓰고 → 평균에 가장 가까운 사람을 눌러요.
   ========================================================= */
function av6Near(body, api, opt) {
  const topics = opt.topics;
  let round = 0, fin = false;
  const host = h("div");
  const play = () => {
    host.innerHTML = "";
    const tsel = h("select", { "aria-label": "주제", style: "font-size:1em;max-width:100%" }, ...topics.map(t => h("option", { value: t.t }, `${t.t}(${t.u})`)));
    tsel.selectedIndex = round % topics.length;
    const nm = opt.names.map(x => h("input", { type: "text", value: x, "aria-label": "이름", style: "width:5em" }));
    const rc = opt.names.map(() => h("input", { type: "text", inputmode: "decimal", "aria-label": "기록", style: "width:5em" }));
    const avIn = h("input", { type: "text", inputmode: "decimal", "aria-label": "평균", style: "width:6em;font-size:1.1em;text-align:center" });
    const who = h("div", { class: "av6tools" });
    const out = h("div", { class: "av6box", style: "display:none" });
    let step = 0, avg = 0, recs = [];
    const go1 = h("button", { class: "big", onclick: () => {
      api.tryOnce();
      recs = rc.map(x => av6Num(x.value));
      if (recs.some(v => !isFinite(v) || v < 0)) return api.fail("네 사람의 기록을 모두 수로 써 주세요.", "기록 빠짐");
      avg = recs.reduce((a, b) => a + b, 0) / recs.length;
      if (Math.abs(av6Num(avIn.value) - avg) > 1e-9) return api.fail(`네 기록을 모두 더한 수를 4로 나누어 보세요. (합계 ${av6Fmt(recs.reduce((a, b) => a + b, 0))})`, avIn.value);
      step = 1; go1.disabled = true;
      api.hint(`○ 평균은 ${av6Fmt(avg)}${unitOf()}예요. 이제 평균에 가장 가까운 사람을 눌러요.`);
      who.innerHTML = ""; who.append(h("span", { class: "jua" }, "평균에 가장 가까운 사람: "), ...nm.map((x, i) => h("button", { onclick: () => pick(i) }, x.value || `${i + 1}번`)));
    } }, "평균 확인하기");
    const unitOf = () => topics[tsel.selectedIndex].u;
    const pick = i => {
      if (step !== 1) return;
      const d = recs.map(v => Math.abs(v - avg)), best = Math.min(...d);
      if (Math.abs(d[i] - best) > 1e-9) return api.fail(`${nm[i].value}의 기록과 평균의 차이는 ${av6Jo(av6Fmt(d[i]), "이에요/예요")}. 차이가 더 작은 사람이 있어요.`, nm[i].value);
      step = 2; out.style.display = "";
      out.innerHTML = ""; out.append(h("b", {}, `${tsel.value} 평균 ${av6Fmt(avg)}${unitOf()}`), h("br"),
        ...recs.map((v, k) => h("div", {}, `${nm[k].value}: ${av6Fmt(v)}${unitOf()} → 평균과 ${av6Fmt(d[k])}만큼 차이${Math.abs(d[k] - best) < 1e-9 ? " ★ 우리 모둠을 대표하는 친구" : ""}`)),
        h("div", { class: "av6tools" }, h("button", { onclick: () => { round++; play(); } }, "다른 주제로 한 판 더")));
      if (!fin) { fin = true; api.done(`${tsel.value}: 평균 ${av6Fmt(avg)}, 가장 가까운 사람 ${nm[i].value}`, opt.ok || "평균을 구하고 평균에 가장 가까운 친구를 찾았어요. 다른 주제로도 해 보세요."); }
    };
    host.append(h("div", { class: "av6tools" }, h("span", { class: "jua" }, "주제: "), tsel),
      h("div", { class: "av6tbl" }, h("table", {}, h("tr", {}, h("th", {}, "이름"), ...nm.map(x => h("td", {}, x))), h("tr", {}, h("th", {}, "기록"), ...rc.map(x => h("td", {}, x))))),
      h("p", { class: "sent" }, "우리 모둠 기록의 평균: ", avIn), h("div", { class: "actions" }, go1), who, out);
  };
  api.provide({ words: ["(평균) = (기록을 모두 더한 수) ÷ 4", "평균과의 차이가 가장 작은 사람"], answers: [] });
  body.append(host); play();
}
/* 또 다른 놀이: 비밀 숫자 찾기 — 4개의 수와 5개 수의 평균을 보고 비밀 숫자를 찾아요(5점 먼저) */
function av6Secret(body, api, opt) {
  let R = 20, score = 0, tries = 0, cur = null, fin = false;
  const nm = opt.names || ["가은", "도윤", "지민", "현우"];
  const board = h("div"), sc = h("div", { class: "av6score" }), inp = h("input", { type: "text", inputmode: "numeric", "aria-label": "비밀 숫자", style: "width:5em;font-size:1.2em;text-align:center" });
  const rng = h("div", { class: "av6tools" }, h("span", { class: "jua" }, "고르는 수의 범위: "), ...[20, 30, 40, 50].map(v => h("button", { class: v === 20 ? "av6on" : "", onclick: e => { R = v; [...rng.querySelectorAll("button")].forEach(b => b.classList.toggle("av6on", b === e.currentTarget)); deal(); } }, `${v} 이하`)));
  const deal = () => {
    let a, s, cand;
    do { a = [0, 1, 2, 3].map(() => 1 + Math.floor(Math.random() * R)); s = a.reduce((x, y) => x + y, 0); cand = []; for (let x = 1; x <= R; x++) if ((s + x) % 5 === 0) cand.push(x); } while (!cand.length);
    const sec = cand[Math.floor(Math.random() * cand.length)];
    cur = { a, sec, avg: (s + sec) / 5 }; tries = 0; inp.value = ""; inp.style.borderColor = "";
    board.innerHTML = "";
    board.append(av6Tbl(["", ...nm, "설계자"], [["고른 수", ...a.map(String), "?"]], { rowHead: true }),
      h("p", { class: "av6read" }, `설계자: “5개 수의 평균은 ${av6Jo(cur.avg, "이에요/예요")}. 비밀 숫자는 ${R} 이하의 수예요.”`));
  };
  const show = () => { sc.textContent = `점수 ${score}점 ${"★".repeat(score)}${"☆".repeat(Math.max(0, 5 - score))}`; };
  const go = h("button", { class: "big", onclick: () => {
    if (!cur) return; api.tryOnce(); tries++;
    const v = av6Num(inp.value);
    if (v === cur.sec) {
      score++; show(); inp.style.borderColor = "var(--ok)";
      const msg = `○ 맞아요! ${cur.avg} × 5 = ${cur.avg * 5}, ${cur.avg * 5} − ${cur.a.reduce((x, y) => x + y, 0)} = ${cur.sec}`;
      if (score >= 5 && !fin) { fin = true; api.done(`비밀 숫자 놀이 5점`, "5점을 먼저 얻었어요! 평균 × 수의 개수로 전체 합을 구하면 모르는 수를 찾을 수 있어요."); }
      else api.hint(msg + (score < 5 ? " ‘한 판 더’를 눌러 계속해요." : ""));
      cur = null; return;
    }
    inp.style.borderColor = "var(--no)";
    api.fail(tries >= 2 ? `5개 수의 합계는 평균 × 5 = ${av6Jo(cur.avg * 5, "이에요/예요")}. 여기에서 네 수의 합을 빼 보세요.` : "평균에 수의 개수 5를 곱하면 다섯 수의 합계가 돼요.", inp.value);
  } }, "비밀 숫자 확인");
  inp.addEventListener("keydown", e => { if (e.key === "Enter") go.click(); });
  api.provide({ words: ["(평균) × 5 = 합계", "합계 − 네 수의 합 = 비밀 숫자"], answers: [] });
  body.append(rng, board, h("p", { class: "sent" }, "비밀 숫자: ", inp), h("div", { class: "actions" }, go), h("div", { class: "av6tools" }, h("button", { onclick: deal }, "한 판 더"), sc));
  deal(); show();
}
//@@LESSONS
const UNIT_STORY = { title: "마을 연합 송년 잔치", lines: [
  "오늘은 건우네 학교 학생 자치회에서 준비한 마을 연합 송년 잔치를 하는 날이에요. 행복 마을, 사랑 마을, 솔잎 마을, 가온 마을, 누리 마을의 할아버지와 할머니들이 오셨어요.",
  "고리 던지기, 콩 주머니 던지기, 건강 체조, 간식 나누기, 경품 뽑기를 함께 하며 자료를 고르게 하여 평균을 구하고, 일이 일어날 가능성을 말과 수로 나타내 봐요.",
  "교과서 「수학 5-2」 6. 평균과 가능성의 차시 순서 그대로 만들었어요."],
  one: "평균과 가능성 · 송년 잔치에서 자료를 고르게 하여 평균을 구하고, 일이 일어날 가능성을 말과 수로 나타내요." };
const UNIT_KEYWORDS = ["자룟값", "고르게 하기", "평균", "(평균)=(자룟값을 모두 더한 수)÷(자료의 수)", "자료의 수", "가능성", "불가능하다", "~아닐 것 같다", "반반이다", "~일 것 같다", "확실하다", "0", "1/2", "1"];

/* ---- 자주 쓰는 자료 ---- */
const AV6_VIL = ["행복 마을", "사랑 마을", "솔잎 마을", "가온 마을", "누리 마을"];
const AV6_GREEN = "#5DB66A", AV6_YEL = "#F2CC3B", AV6_RED = "#E25C4B", AV6_BLUE = "#4E8FD9", AV6_ORG = "#F08C2E";
const AV6_SP6 = [   // 6차시 회전판 가~마: 화살이 초록색에 멈출 가능성
  { name: "가", secs: [{ c: AV6_GREEN, f: .5, t: "초록색", k: "초" }, { c: AV6_YEL, f: .5, t: "노란색", k: "노" }] },
  { name: "나", secs: [{ c: AV6_YEL, f: 1, t: "노란색", k: "노" }] },
  { name: "다", secs: [{ c: AV6_GREEN, f: .25, t: "초록색", k: "초" }, { c: AV6_YEL, f: .75, t: "노란색", k: "노" }] },
  { name: "라", secs: [{ c: AV6_GREEN, f: .75, t: "초록색", k: "초" }, { c: AV6_YEL, f: .25, t: "노란색", k: "노" }] },
  { name: "마", secs: [{ c: AV6_GREEN, f: 1, t: "초록색", k: "초" }] }];
const AV6_SP7 = [   // 7차시 회전판 가·나·다: 화살이 빨간색에 멈출 가능성
  { name: "가", secs: [{ c: AV6_BLUE, f: 1, t: "파란색", k: "파" }] },
  { name: "나", secs: [{ c: AV6_RED, f: .5, t: "빨간색", k: "빨" }, { c: AV6_BLUE, f: .5, t: "파란색", k: "파" }] },
  { name: "다", secs: [{ c: AV6_RED, f: 1, t: "빨간색", k: "빨" }] }];
const AV6_SP10 = [  // 10차시 4번 회전판(빨강·노랑·파랑)
  { name: "㉠", secs: [{ c: AV6_RED, f: .75, t: "빨" }, { c: AV6_YEL, f: .125, t: "노" }, { c: AV6_BLUE, f: .125, t: "파" }] },
  { name: "㉡", secs: [{ c: AV6_RED, f: 1 / 3, t: "빨" }, { c: AV6_YEL, f: 1 / 3, t: "노" }, { c: AV6_BLUE, f: 1 / 3, t: "파" }] },
  { name: "㉢", secs: [{ c: AV6_BLUE, f: .5, t: "파" }, { c: AV6_RED, f: .25, t: "빨" }, { c: AV6_YEL, f: .25, t: "노" }] }];
const AV6_SP6B = [  // 6차시 확인하기(익힘): 140회 돌린 결과와 가장 비슷한 회전판
  { name: "㉠", secs: [{ c: AV6_RED, f: .5, t: "빨" }, { c: AV6_YEL, f: .25, t: "노" }, { c: AV6_BLUE, f: .25, t: "파" }] },
  { name: "㉡", secs: [{ c: AV6_RED, f: .25, t: "빨" }, { c: AV6_YEL, f: .25, t: "노" }, { c: AV6_BLUE, f: .5, t: "파" }] },
  { name: "㉢", secs: [{ c: AV6_RED, f: 1 / 3, t: "빨" }, { c: AV6_YEL, f: 1 / 3, t: "노" }, { c: AV6_BLUE, f: 1 / 3, t: "파" }] }];
const AV6_W3 = ["불가능하다", "반반이다", "확실하다"];
const AV6_N3 = ["0", "[1/2]", "1"];
/* 9차시 교과서 예시 '우리 모둠 기록의 평균'(평균은 교과서, 사람별 기록은 평균이 맞게 정한 것) */
const AV6_NM9 = ["가은", "도윤", "지민", "현우"];
const AV6_T9 = [
  { t: "눈 감고 외발 서기", u: "초", recs: [41, 28, 33, 38], avg: 35, near: 2 },
  { t: "줄넘기 2단 뛰기", u: "회", recs: [9, 20, 22, 13], avg: 16, near: 3 },
  { t: "제자리멀리뛰기", u: "cm", recs: [148.2, 155.6, 139.8, 156.8], avg: 150.1, near: 0 },
  { t: "왕복 오래달리기", u: "회", recs: [66, 62, 50, 68], avg: 61.5, near: 1 }];

const LESSONS = [
{
  id: "t1", no: 1, title: "단원 도입 ― 마을 연합 송년 잔치에 가요", soop: "개념 찾기(S)",
  question: "우리 주변에서 평균과 가능성을 이용하는 상황에는 무엇이 있을까요?",
  summary: "자료를 대표하는 값과 일이 일어날 가능성은 생활 곳곳에서 쓰여요. 이 단원에서는 자료를 고르게 하여 평균을 알아보고, 일이 일어날 가능성을 말과 수로 나타내 봐요.",
  steps: [
    { name: "동전 던지기", inst: "축구 경기를 시작하기 전에 심판이 앞면과 뒷면이 다른 동전을 던져서 먼저 공격하는 팀을 정해요. 우리 팀은 그림면을 골랐어요. 동전을 6번 이상 던져 보세요.", hints: ["‘1번 던지기’를 여러 번 누르거나 ‘10번 던지기’를 눌러요.", "던질 때마다 어느 면이 나올지 미리 알 수 있는지 생각해 봐요."],
      render: (b, a) => av6Sim(b, a, { kind: "coin", ms: [6], need: 6, note: "던질 때마다 어느 면이 나올지 미리 알 수 없어요.",
        ask: [{ q: "우리 팀이 선택한 동전의 면이 나올 가능성은 어느 정도일까요?", parts: ["그림면과 숫자 면 중 어느 면이 나올지 ", { o: ["미리 알 수 있어요", "미리 알 수 없어요"], a: 1 }, ". 그림면이 나올 가능성과 숫자 면이 나올 가능성은 ", { o: ["비슷해요", "크게 달라요"], a: 0, why: { "1": "동전은 앞면과 뒷면이 하나씩이에요. 두 면이 나올 가능성을 다시 생각해 봐요." } }, "."] }],
        ok: "동전을 던질 때 어느 면이 나올지는 알 수 없지만, 두 면이 나올 가능성은 비슷해요. 이런 ‘가능성’을 이 단원에서 배워요." }) },
    { name: "배울 내용 살펴보기", inst: "이 단원에서는 ‘자료를 대표하는 값을 어떻게 정할까요?’와 ‘일이 일어날 가능성을 어떻게 비교할 수 있을까요?’를 배워요. 각 상황이 평균과 가능성 중 무엇과 관련 있는지 골라 보세요.", hints: ["여러 기록을 대표하는 값을 구하는 것은 평균이에요.", "어떤 일이 일어날지 기대하는 정도는 가능성이에요."],
      render: (b, a) => quiz(b, a, [
        { q: "우리 반 수학 성적을 대표하는 값", o: ["평균", "가능성"], a: 0 },
        { q: "주사위를 던졌을 때 눈의 수가 짝수가 나올 정도", o: ["평균", "가능성"], a: 1 },
        { q: "일주일 동안 한 줄넘기 기록을 대표하는 값", o: ["평균", "가능성"], a: 0 },
        { q: "동전을 던졌을 때 숫자 면이 나올 정도", o: ["평균", "가능성"], a: 1 }], { ok: "성적·기록을 대표하는 값은 평균, 짝수 눈이나 숫자 면이 나올 정도는 가능성과 관련 있어요." }) },
    { name: "배운 내용 떠올리기", inst: "4학년 때 배운 막대그래프와 꺾은선그래프를 떠올려 보세요. (수학익힘 ‘이전에 배웠어요’)", hints: ["막대의 길이는 표의 수만큼, 세로 눈금 한 칸은 1명이에요.", "꺾은선그래프에서 선이 가장 많이 기울어진 곳이 가장 많이 변한 곳이에요."],
      render: (b, a) => av6Chain(b, a, [
        { title: "① 표를 보고 막대그래프로 나타내기", run: (bx, ax) => av6Bars(bx, ax, { cap: "송년 잔치에서 해 보고 싶은 활동", title: "해 보고 싶은 활동별 학생 수", names: ["고리 던지기", "콩 주머니", "건강 체조", "경품 뽑기"], vals: [7, 5, 3, 9], unit: "명", max: 10, catAxis: "활동", valAxis: "학생 수", ok: "표의 수만큼 막대를 알맞게 그렸어요." }) },
        { title: "② 꺾은선그래프의 내용 알아보기", run: (bx, ax) => av6Ask(bx, ax, [
          { fig: () => av6LineFig({ title: "송년 잔치 날 체육관의 온도", names: ["9시", "10시", "11시", "12시", "1시"], vals: [12, 14, 17, 19, 20], lo: 10, hi: 22, gs: 2, unit: "℃" }),
            parts: ["11시의 체육관 온도는 ", { n: 17, why: { "16": "11시의 점은 16과 18 사이 가운데에 있어요." } }, "℃예요. 온도가 가장 많이 오른 때는 ", { o: ["9시와 10시 사이", "10시와 11시 사이", "11시와 12시 사이", "12시와 1시 사이"], a: 1, why: { "0": "9시와 10시 사이에는 2℃ 올랐어요. 선이 가장 많이 기울어진 곳을 찾아요.", "2": "11시와 12시 사이에는 2℃ 올랐어요.", "3": "12시와 1시 사이에는 1℃ 올랐어요." } }, "예요."] }],
          { ok: "11시에는 17℃이고, 10시와 11시 사이에 3℃로 가장 많이 올랐어요." }) }]) },
    { name: "송년 잔치 둘러보기", inst: "건우네 학교 체육관에서 마을 연합 송년 잔치가 열렸어요. 체육관 곳곳을 눌러 어떤 활동이 준비되어 있는지 살펴보세요.", hints: ["물음표가 있는 다섯 곳을 모두 눌러요.", "눌러 보면 이 단원에서 어떤 것을 배우는지 알 수 있어요."],
      render: (b, a) => av6Party(b, a, { ok: "고리 던지기·콩 주머니 던지기에서는 평균을, 건강 체조·간식·경품 뽑기에서는 가능성을 알아볼 거예요." }) },
    { name: "확인하기", inst: "이 단원에서 공부할 내용을 생각하며 학습 계획을 세워 보세요.",
      render: (b, a) => writeStep(b, a, [
        { q: "제비뽑기나 동전 던지기, 경품 뽑기를 해 본 경험을 써 보세요.", tag: "경험", ph: "예) 체육 시간에 티볼 경기를 할 때 먼저 공격할 팀을 동전 던지기로 정한 적이 있어요." },
        { q: "이 단원에서 알고 싶은 것을 써 보세요.", tag: "알고 싶은 것", ph: "예) 자료를 대표하는 값을 어떻게 정하는지 알고 싶어요." }]) }
  ],
  challenge: { inst: "송년 잔치를 도와준 학년별 도우미 수를 막대그래프로 나타내 보세요. 이번에는 세로 눈금 한 칸이 2명이에요.", hints: ["14명은 눈금 7칸이에요.", "세로 눈금 한 칸이 2명이니까 (학생 수)÷2만큼 칸을 올려요."],
    render: (b, a) => av6Bars(b, a, { cap: "학년별 송년 잔치 도우미 수", title: "학년별 도우미 수", names: ["3학년", "4학년", "5학년", "6학년"], vals: [6, 10, 14, 12], unit: "명", max: 16, step: 2, catAxis: "학년", valAxis: "도우미 수", ok: "세로 눈금 한 칸이 2명일 때도 막대를 알맞게 그렸어요." }) }
},
{
  id: "t2", no: 2, title: "평균을 알아볼까요", soop: "개념 구축하기(O)",
  question: "자료를 대표하는 값은 어떻게 정할 수 있을까요?",
  summary: "자룟값을 고르게 하여 그 자료를 대표하는 값으로 정할 수 있어요. 이 값을 평균이라고 해요. 많은 곳에서 적은 곳으로 옮겨 모두 같게 만들어요.",
  steps: [
    { inst: "마을별로 송년 잔치에 참여한 인원수를 쌓기나무로 쌓았어요. 건우: “한 마을당 참여한 인원수를 대표하는 값은 몇 명일까?” 쌓기나무를 옮겨 높이를 고르게 해 보세요.", hints: ["쌓기나무를 끌어 많은 곳에서 적은 곳으로 옮겨요.", "가장 높은 사랑 마을과 가장 낮은 가온 마을을 보세요."],
      render: (b, a) => av6Level(b, a, { names: AV6_VIL, vals: [8, 9, 8, 7, 8], unit: "명", item: "block", title: "마을별 송년 잔치에 참여한 인원수(쌓기나무 1개 = 1명)",
        ask: [{ parts: ["가장 적게 옮기려면 ", { o: ["사랑 마을에서 1개를 가온 마을로", "가온 마을에서 1개를 사랑 마을로", "행복 마을에서 1개를 누리 마을로"], a: 0, why: { "1": "많은 곳에서 적은 곳으로 옮겨야 고르게 돼요." } }, " 옮기면 돼요. 한 마을당 참여한 인원수를 대표하는 값은 ", { n: 8, why: { "9": "9명은 가장 많은 마을의 인원수예요. 고르게 한 수를 써요.", "7": "7명은 가장 적은 마을의 인원수예요. 고르게 한 수를 써요." } }, "명이에요."] }],
        ok: "사랑 마을의 쌓기나무 1개를 가온 마을로 옮기면 모두 8개로 고르게 돼요. 한 마을당 참여한 인원수를 대표하는 값은 8명이에요." }) },
    { inst: "가은이네 모둠의 제기차기 기록을 ○로 나타냈어요. ○를 옮겨 고르게 해 보세요.", hints: ["많이 찬 사람의 ○를 적게 찬 사람에게 옮겨요.", "○는 모두 15개이고 5명이에요."],
      render: (b, a) => b.append(av6HTbl("학생별 제기차기 기록", ["가은", "도윤", "지민", "현우", "시아"], [4, 5, 2, 3, 1], { h2: "기록(개)" })) || av6Level(b, a, { names: ["가은", "도윤", "지민", "현우", "시아"], vals: [4, 5, 2, 3, 1], unit: "개", item: "circle", title: "학생별 제기차기 기록",
        ask: [{ parts: ["가은이의 기록에서 ", { n: 1 }, "개를 지민이에게, 도윤이의 기록에서 ", { n: 2 }, "개를 시아에게 옮기면 고르게 돼요. 가은이네 모둠의 제기차기 기록의 평균은 ", { n: 3, why: { "5": "가장 많이 찬 기록이에요. 고르게 한 수를 써요.", "15": "15는 모두 더한 수예요. 고르게 한 수를 써요." } }, "개예요."] }],
        ok: "가은이 → 지민이 1개, 도윤이 → 시아 2개를 옮기면 모두 3개로 고르게 돼요. 평균은 3개예요." }) },
    { inst: "한 마을당 참여한 인원수를 대표하는 값을 어떻게 정하면 좋을지 이야기해 보세요.", hints: ["가장 많이 나온 수로 정하면 다른 마을의 인원수가 반영되지 않아요.", "모든 자룟값을 고르게 한 수가 자료를 대표해요."],
      render: (b, a) => quiz(b, a, [
        { q: "대표하는 값을 정하는 방법으로 가장 알맞은 것은 무엇일까요?", o: ["8명인 마을이 가장 많으니까 8명으로 정해요.", "가장 큰 수인 9명으로 정해요.", "마을별 인원수를 고르게 하여 정해요."], a: 2, why: { "0": "이번에는 우연히 같은 8명이지만, 가장 많이 나온 수로 정하면 다른 마을의 인원수가 반영되지 않아요.", "1": "가장 큰 수는 다른 마을의 인원수를 대표하지 못해요." } },
        { q: "마을별 참여 인원수와 같은 것을 무엇이라고 할까요?", o: ["자룟값", "합계", "눈금"], a: 0 }],
        { ok: "마을별 인원수와 같은 것을 자룟값이라고 하고, 자룟값을 고르게 하여 대표하는 값을 정해요." }) },
    { inst: "약속하기를 완성해 보세요.", hints: ["쌓기나무와 ○를 어떻게 했는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["자룟값을 ", { o: ["고르게 하여", "모두 더하여", "가장 큰 수로"], a: 0 }, " 그 자료를 대표하는 값으로 정할 수 있습니다. 이 값을 ", { o: ["평균", "합계", "자룟값"], a: 0 }, "이라고 합니다."],
        { ok: "자룟값을 고르게 하여 그 자료를 대표하는 값으로 정할 수 있고, 이 값을 평균이라고 해요." }) },
    { inst: "상자 4개에 들어 있는 구슬 수예요. 구슬 수의 평균을 예상한 후, 빨간 선을 끌어 넘치는 구슬과 모자란 구슬이 같아지는 높이를 찾아보세요.", hints: ["평균을 먼저 12개쯤으로 예상해 봐요.", "파란색은 12개보다 2개 많고, 초록색은 12개보다 2개 적어요."],
      render: (b, a) => av6Line(b, a, { names: ["파란색", "빨간색", "노란색", "초록색"], vals: [14, 12, 12, 10], unit: "개", lo: 0, hi: 16, gstep: 2, snap: 1, start: 6, title: "상자별 구슬 수",
        ask: [{ parts: ["파란색 상자에 들어 있는 구슬은 예상한 평균 ", { n: 12 }, "개보다 ", { n: 2 }, "개 더 많이 들어 있어요. 초록색 상자에 들어 있는 구슬은 예상한 평균 ", { n: 12 }, "개보다 ", { n: 2 }, "개 더 적게 들어 있어요. 구슬 수를 고르게 하여 4상자에 들어 있는 구슬 수의 평균을 구하면 ", { n: 12 }, "개예요."] }],
        ok: "파란색 상자의 2개를 초록색 상자로 옮기면 모두 12개예요. 평균은 12개예요." }),
      easy: (b, a) => av6Level(b, a, { names: ["지원", "원석", "소연", "준우"], vals: [4, 3, 5, 4], unit: "명", item: "circle", title: "모둠 친구들의 가족 구성원 수", ask: [{ parts: ["가족 구성원 수를 대표하는 값은 ", { n: 4 }, "명이에요."] }], ok: "소연이의 ○ 1개를 원석이에게 옮기면 모두 4개예요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 고르게 하여 평균을 구해 보세요.", hints: ["20℃를 기준으로 높은 날과 낮은 날을 짝지어 봐요.", "넘치는 양과 모자란 양이 같아지는 높이를 찾아요."],
    render: (b, a) => av6Chain(b, a, [
      { title: "① 지난주 교실 온도(매일 낮 12시)", run: (bx, ax) => av6Line(bx, ax, { names: ["월", "화", "수", "목", "금"], vals: [21, 20, 19, 23, 17], unit: "℃", lo: 15, hi: 25, gstep: 1, start: 22, title: "요일별 교실 온도",
        ask: [{ parts: ["20℃보다 월요일은 ", { n: 1 }, "℃ 더 높고, 수요일은 ", { n: 1 }, "℃ 더 낮아요. 20℃보다 목요일은 ", { n: 3 }, "℃ 더 높고, 금요일은 ", { n: 3 }, "℃ 더 낮아요. 온도를 고르게 하여 평균을 구하면 ", { n: 20 }, "℃예요."] }],
        ok: "월요일과 수요일, 목요일과 금요일이 서로 채워져서 평균은 20℃예요." }) },
      { title: "② 대표하는 값", run: (bx, ax) => av6Ask(bx, ax, [
        { q: "주머니 4개에 사탕이 들어 있어요. 한 주머니당 사탕 수를 대표하는 값은 어떻게 정할 수 있을까요?", parts: [{ o: ["가장 큰 수", "가장 작은 수", "고르게 한 수"], a: 2 }, "로 정할 수 있어요."] },
        { q: "미정이네 모둠의 하루 컴퓨터 사용 시간이에요. 고르게 하면 한 사람당 몇 분일까요?", fig: () => av6HTbl("", ["미정", "유찬", "민지", "서준"], [38, 46, 50, 42], { h2: "시간(분)" }), parts: [{ n: 44, why: { "46": "46분은 유찬이의 시간이에요. 모두 고르게 한 수를 구해요." } }, "분"] }],
        { ok: "대표하는 값은 고르게 한 수로 정하고, 컴퓨터 사용 시간의 평균은 44분이에요." }) }]) }
},
{
  id: "t3", no: 3, title: "평균을 구해 볼까요", soop: "개념 구축하기(O)",
  question: "평균은 어떻게 구할 수 있을까요?",
  summary: "평균은 자룟값을 모두 더한 수를 자료의 수로 나누어서 구해요. (평균)=(자룟값을 모두 더한 수)÷(자료의 수). 종이띠를 이어 붙이는 것은 더하기, 자료의 수만큼 등분하는 것은 나누기와 같아요.",
  steps: [
    { inst: "고리 던지기를 준비하는데 바구니마다 고리 수가 달라요(빨간색 7개, 노란색 4개, 파란색 6개, 초록색 3개). 고리가 그려진 종이띠를 하나씩 눌러 겹치지 않게 이어 붙이고, 이어 붙인 띠를 등분해 보세요.", hints: ["종이띠 4개를 모두 눌러 이어 붙여요.", "바구니가 4개이니까 4등분해요(반으로 접고 다시 반으로 접기)."],
      render: (b, a) => av6Strip(b, a, { names: ["빨간색 바구니", "노란색 바구니", "파란색 바구니", "초록색 바구니"], vals: [7, 4, 6, 3], unit: "개", ring: true,
        ask: [{ parts: ["고리는 모두 7 + 4 + 6 + 3 = ", { n: 20, why: { "17": "7+4+6+3을 다시 더해 봐요." } }, "(개)예요. 4등분한 띠에는 20 ÷ 4 = ", { n: 5 }, "(개)씩 있어요. 바구니 한 개에 들어 있는 고리 수의 평균은 ", { n: 5 }, "개예요."] }],
        ok: "종이띠를 이어 붙이면 20개, 4등분하면 5개씩이에요. 고리 수의 평균은 5개예요." }) },
    { inst: "종이띠로 평균을 구한 방법을 말해 보세요.", hints: ["이어 붙이면 고리 수가 모두 몇 개인지 알 수 있어요.", "4등분은 4로 나누는 것과 같아요."],
      render: (b, a) => blanks(b, a, ["종이띠를 이어 붙이는 것은 자룟값을 ", { o: ["모두 더하는", "모두 빼는", "곱하는"], a: 0 }, " 것과 같아요. 이어 붙인 띠를 4등분하는 것은 ", { o: ["자료의 수", "가장 큰 자룟값", "고리 한 개"], a: 0 }, "로 나누는 것과 같아요."],
        { ok: "이어 붙이기는 자룟값을 모두 더하기, 등분하기는 자료의 수로 나누기와 같아요." }) },
    { inst: "약속하기를 완성해 보세요.", hints: ["먼저 모두 더하고, 자료의 수로 나눠요."],
      render: (b, a) => blanks(b, a, ["평균은 자룟값을 모두 더한 수를 ", { o: ["자료의 수", "가장 큰 수", "2"], a: 0 }, "로 나누어서 구합니다. (평균) = (", { o: ["자룟값을 모두 더한 수", "가장 큰 자룟값", "자료의 수"], a: 0 }, ") ÷ (", { o: ["자료의 수", "자룟값을 모두 더한 수", "평균"], a: 0 }, ")"],
        { ok: "(평균) = (자룟값을 모두 더한 수) ÷ (자료의 수)예요." }) },
    { name: "평균 구하기", inst: "수현이가 5일 동안 한 왕복 달리기 기록이에요. 기록 띠를 이어 붙이고 등분하여 평균을 구해 보세요.", hints: ["87+92+85+90+91을 계산해요.", "5일 동안의 기록이니까 5로 나눠요."],
      render: (b, a) => b.append(av6HTbl("수현이의 왕복 달리기 기록", ["1일", "2일", "3일", "4일", "5일"], [87, 92, 85, 90, 91], { h1: "날짜", h2: "기록(회)" })) || av6Strip(b, a, { names: ["1일", "2일", "3일", "4일", "5일"], vals: [87, 92, 85, 90, 91], unit: "회",
        ask: [{ parts: ["기록을 모두 더하면 ", { n: 445, why: { "435": "87+92+85+90+91을 다시 더해 봐요." } }, "회이고, 기록을 잰 날은 ", { n: 5 }, "일이에요. 평균은 ", { n: 445 }, " ÷ ", { n: 5 }, " = ", { n: 89, why: { "90": "445÷5를 다시 계산해 봐요." } }, "(회)예요."] }],
        ok: "(87+92+85+90+91)÷5 = 445÷5 = 89(회)예요." }) },
    { inst: "어느 박물관의 일주일 관람객 수와 윤호네 모둠이 지난달에 읽은 책 수예요. 평균을 구해 보세요.", hints: ["7일 동안의 관람객 수를 모두 더해 7로 나눠요.", "수가 크면 계산기를 써도 돼요."],
      render: av6WithCalc((b, a) => av6Ask(b, a, [
        { fig: () => av6HTbl("박물관의 일주일 관람객 수", ["월", "화", "수", "목", "금", "토", "일"], [540, 630, 690, 470, 710, 870, 780], { h1: "요일", h2: "관람객 수(명)" }),
          parts: ["(540 + 630 + 690 + 470 + 710 + 870 + 780) ÷ 7 = ", { n: 4690 }, " ÷ 7 = ", { n: 670, why: { "781": "자료의 수 7로 나누었는지 확인해요." } }, "(명)"] },
        { fig: () => av6HTbl("학생별 지난달에 읽은 책 수", ["윤호", "주아", "은찬", "가은"], [4, 6, 8, 6], { h2: "책 수(권)" }),
          parts: ["윤호네 모둠이 지난달에 읽은 책 수의 평균은 ", { n: 6, why: { "24": "24권은 모두 더한 수예요. 4명이니까 4로 나눠요." } }, "권이에요."] }],
        { ok: "박물관 관람객 수의 평균은 4690÷7=670(명), 책 수의 평균은 24÷4=6(권)이에요." })) }
  ],
  challenge: { inst: "수학익힘 문제예요. 평균을 구해 보세요.", hints: ["(평균) = (자룟값을 모두 더한 수) ÷ (자료의 수)", "평균보다 비싼 곳은 4000원보다 비싼 곳이에요."],
    render: av6WithCalc((b, a) => av6Chain(b, a, [
      (bx, ax) => av6Ask(bx, ax, [
        { fig: () => av6HTbl("분식집별 떡볶이 1인분 가격", ["맛나", "한입", "호호", "전설", "소풍"], [4600, 3700, 4000, 3500, 4200], { h1: "분식집", h2: "가격(원)" }),
          parts: ["가격의 합: 4600 + 3700 + 4000 + 3500 + 4200 = ", { n: 20000 }, "(원)", h("br"), "가격의 평균: 20000 ÷ 5 = ", { n: 4000 }, "(원)", h("br"), "평균보다 비싼 분식집: ", { o: ["맛나", "한입", "호호", "전설", "소풍"], a: [0, 4], multi: true }] }],
        { ok: "평균은 4000원이고, 4000원보다 비싼 곳은 맛나(4600원)와 소풍(4200원)이에요." }),
      (bx, ax) => av6Ask(bx, ax, [
        { q: "혜영이네 모둠의 100 m 달리기 기록: 혜영 21초, 민재 19초, 석훈 24초, 지연 20초", parts: ["기록의 합 ", { n: 84 }, "초, 학생 수 ", { n: 4 }, "명, 평균 ", { n: 21 }, "초"] },
        { q: "동준이가 1분 동안 잰 맥박 수(5번): 80회, 76회, 90회, 85회, 79회", parts: ["맥박 수의 평균 ", { n: 82, why: { "410": "410회는 모두 더한 수예요. 5번 잰 것이니까 5로 나눠요." } }, "회"] }],
        { ok: "달리기 기록의 평균은 84÷4=21(초), 맥박 수의 평균은 410÷5=82(회)예요." })])) }
},
{
  id: "t4", no: 4, title: "평균을 활용해 볼까요", soop: "개념 구축하기(O)",
  question: "평균을 이용하여 어떤 문제를 해결할 수 있을까요?",
  summary: "참가 인원수가 다른 두 집단은 합계가 아니라 평균으로 비교해요. 평균을 알면 (평균)×(자료의 수)로 전체 합을 구하고, 전체 합에서 아는 자룟값을 빼어 모르는 자룟값을 구할 수 있어요.",
  steps: [
    { inst: "콩 주머니 던지기를 했어요. 건강 팀은 3명, 장수 팀은 4명이 참가했어요. 두 팀의 점수를 각각 고르게 하여 비교해 보세요.", hints: ["건강 팀 점수 7, 9, 8을 고르게 해요.", "장수 팀 점수 6, 10, 7, 5를 고르게 해요."],
      render: (b, a) => av6Chain(b, a, [
        { title: "① 건강 팀(3명) 점수", run: (bx, ax) => av6Level(bx, ax, { names: ["1번 선수", "2번 선수", "3번 선수"], vals: [7, 9, 8], unit: "점", item: "block", max: 10, title: "건강 팀 콩 주머니 던지기 점수(쌓기나무 1개 = 1점)", ok: "건강 팀 점수를 고르게 하면 8점씩이에요." }) },
        { title: "② 장수 팀(4명) 점수", run: (bx, ax) => av6Level(bx, ax, { names: ["1번 선수", "2번 선수", "3번 선수", "4번 선수"], vals: [6, 10, 7, 5], unit: "점", item: "block", max: 10, title: "장수 팀 콩 주머니 던지기 점수(쌓기나무 1개 = 1점)",
          ask: [{ parts: ["건강 팀 점수의 평균은 (7 + 9 + 8) ÷ 3 = ", { n: 8 }, "(점), 장수 팀 점수의 평균은 (6 + 10 + 7 + 5) ÷ 4 = ", { n: 7 }, "(점)이에요. 평균이 더 높은 ", { o: ["건강 팀", "장수 팀"], a: 0, why: { "1": "장수 팀은 합계(28점)가 더 크지만 참가 인원수가 더 많아요. 평균을 비교해요." } }, "이 이겼다고 할 수 있어요."] }],
          ok: "건강 팀 평균 8점, 장수 팀 평균 7점이에요. 평균이 더 높은 건강 팀이 이겼어요." }) }]) },
    { inst: "주아네 학교에서 물통을 들고 다니는 학생 수의 평균은 64명이에요. 5학년 학생 수를 모르는데, 5학년 막대를 끌어 평균이 64명이 되게 해 보세요.", hints: ["파란 점선(지금 고르게 한 높이)이 빨간 평균선과 겹치게 해요.", "평균 64명에 학년 수 6을 곱하면 전체 학생 수예요."],
      render: (b, a) => b.append(av6HTbl("학년별 물통을 들고 다니는 학생 수", ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"], [80, 76, 80, 61, "?", 48], { h1: "학년", h2: "학생 수(명)" })) || av6Guess(b, a, { names: ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"], vals: [80, 76, 80, 61, null, 48], target: 64, unit: "명", hi: 100, gstep: 10, start: 10,
        ask: [{ parts: ["먼저 전체 학생 수를 구해요: 64 × 6 = ", { n: 384, why: { "70": "평균에 자료의 수를 더하지 말고 곱해요." } }, "(명)", h("br"), "5학년: 384 − (80 + 76 + 80 + 61 + 48) = 384 − ", { n: 345 }, " = ", { n: 39 }, "(명)"] },
          { q: "물통을 들고 다니는 학생 수가 평균보다 더 적은 학년을 모두 고르세요.", parts: [{ o: ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"], a: [3, 4, 5], multi: true }] }],
        ok: "전체는 64×6=384(명), 5학년은 384−345=39(명)이에요. 평균 64명보다 적은 학년은 4학년(61명), 5학년(39명), 6학년(48명)이에요." }) },
    { inst: "두 팀의 점수를 비교한 방법을 말해 보세요.", hints: ["장수 팀 합계는 28점, 건강 팀 합계는 24점이에요.", "참가 인원수가 다르면 합계로 비교하기 어려워요."],
      render: (b, a) => blanks(b, a, ["장수 팀의 점수 합계가 더 크지만 두 팀의 ", { o: ["참가 인원수가 달라서", "점수가 모두 같아서"], a: 0 }, " 합계로 비교하면 알맞지 않아요. 인원수가 다른 두 집단은 ", { o: ["평균", "가장 높은 점수", "합계"], a: 0 }, "으로 비교해요."],
        { ok: "참가 인원수가 다른 두 집단은 합계가 아니라 평균으로 비교해요." }) },
    { name: "정리하기", inst: "평균을 이용하여 모르는 자룟값을 구하는 방법을 정리해 보세요.", hints: ["물통 문제에서 먼저 무엇을 구했는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["평균을 알면 (평균) ", { o: ["×", "+", "÷"], a: 0 }, " (자료의 수)로 전체 합을 구할 수 있어요. 전체 합에서 아는 자룟값을 모두 ", { o: ["빼면", "더하면", "곱하면"], a: 0 }, " 모르는 자룟값을 구할 수 있어요."],
        { ok: "(평균)×(자료의 수)=(전체 합), (전체 합)−(아는 자룟값의 합)=(모르는 자룟값)이에요." }) },
    { inst: "윤호네 가족과 예린이네 가족의 일주일 운동 시간의 평균이 같아요. 예린이의 운동 시간을 구해 보세요.", hints: ["먼저 윤호네 가족의 운동 시간의 평균을 구해요.", "예린이네 가족은 5명이니까 평균에 5를 곱하면 전체 시간이에요."],
      render: (b, a) => av6Chain(b, a, [
        (bx, ax) => av6Ask(bx, ax, [{ fig: () => av6HTbl("윤호네 가족의 운동 시간", ["아버지", "어머니", "누나", "윤호"], [9, 8, 6, 9], { h1: "가족", h2: "시간(시간)" }),
          parts: ["윤호네 가족의 운동 시간의 평균: (9 + 8 + 6 + 9) ÷ 4 = ", { n: 8 }, "(시간)"] }], { ok: "윤호네 가족의 운동 시간의 평균은 8시간이에요. 예린이네 가족의 평균도 8시간이에요." }),
        (bx, ax) => { bx.append(av6HTbl("예린이네 가족의 운동 시간", ["할머니", "아버지", "어머니", "예린", "동생"], [7, 9, 7, "?", 8], { h1: "가족", h2: "시간(시간)" }));
          av6Guess(bx, ax, { names: ["할머니", "아버지", "어머니", "예린", "동생"], vals: [7, 9, 7, null, 8], target: 8, unit: "시간", hi: 12, gstep: 2, start: 2,
            ask: [{ parts: ["예린이네 가족의 운동 시간의 합: 8 × 5 = ", { n: 40 }, "(시간)", h("br"), "예린: 40 − (7 + 9 + 7 + 8) = ", { n: 9 }, "(시간)"] }],
            ok: "예린이네 가족의 전체 운동 시간은 8×5=40(시간), 예린이는 40−31=9(시간)이에요." }); }]) }
  ],
  challenge: { inst: "수학익힘 문제예요. 평균을 활용해 문제를 해결해 보세요.", hints: ["한 학생당 수집량 = (반의 수집량) ÷ (반의 학생 수)", "모르는 점수 = (평균) × (횟수) − (아는 점수의 합)"],
    render: av6WithCalc((b, a) => av6Chain(b, a, [
      (bx, ax) => av6Ask(bx, ax, [{ q: "5학년 반별 1년 동안의 헌 종이 수집량이에요. 한 학생당 수집량의 평균을 구해 보세요.",
        fig: () => av6Tbl(["반", "1반", "2반", "3반", "4반", "5반"], [["학생 수(명)", "19", "20", "15", "22", "23"], ["수집량(kg)", "95", "80", "90", "88", "46"]], { rowHead: true }),
        parts: ["1반 ", { n: 5 }, " kg, 2반 ", { n: 4 }, " kg, 3반 ", { n: 6 }, " kg, 4반 ", { n: 4 }, " kg, 5반 ", { n: 2 }, " kg", h("br"), "한 학생당 수집량이 가장 많은 반: ", { o: ["1반", "2반", "3반", "4반", "5반"], a: 2, why: { "0": "1반은 수집량이 많지만 학생 수도 많아요. 한 학생당 수집량을 비교해요." } }] }], { ok: "한 학생당 5, 4, 6, 4, 2 kg이라서 3반이 가장 많아요." }),
      (bx, ax) => av6Ask(bx, ax, [
        { q: "민하의 한자 시험 점수는 1회 89점, 2회 94점, 4회 85점이고, 4번의 평균은 88점이에요. 3회의 점수는?", parts: [{ n: 84, why: { "88": "평균과 같다고 생각하면 안 돼요. 88×4에서 세 번의 점수를 빼요." } }, "점"] },
        { q: "지석이(1~5회: 150, 147, 136, 148, 144 cm)와 유담이(1~4회: 150, 135, ?, 140 cm)의 제자리멀리뛰기 기록의 평균이 같아요.", parts: ["지석이의 평균 ", { n: 145 }, " cm, 유담이의 3회 기록 ", { n: 155 }, " cm"] },
        { q: "민우네 농구팀의 1~4회 점수는 85, 72, 68, 79점이에요. 5회까지의 평균이 78점 이상이어야 결승에 가요. 5회에는 적어도 몇 점을 얻어야 할까요?", parts: [{ n: 86 }, "점 이상"] }],
        { ok: "3회 84점, 지석이 평균 145 cm·유담이 3회 155 cm, 5회에는 86점 이상이에요." })])) }
},
{
  id: "t5", no: 5, title: "일이 일어날 가능성을 말로 표현해 볼까요", soop: "개념 구축하기(O)",
  question: "일이 일어날 가능성을 어떤 말로 표현할 수 있을까요?",
  summary: "어떠한 상황에서 특정한 일이 일어나길 기대할 수 있는 정도를 가능성이라고 해요. 가능성은 불가능하다, ~아닐 것 같다, 반반이다, ~일 것 같다, 확실하다 등으로 표현할 수 있어요.",
  steps: [
    { inst: "할머니께서 크림붕어빵 2개와 팥붕어빵 2개가 든 통에서 붕어빵을 한 개 꺼내세요. 통을 눌러 여러 번 꺼내 보고(꺼낸 것은 다시 넣어요), 일이 일어날 가능성을 말로 나타내 보세요.", hints: ["크림붕어빵과 팥붕어빵의 개수가 같아요.", "귤 한 상자에는 귤만 들어 있고, 우유 중에 딸기우유는 없어요."],
      render: (b, a) => av6Bag(b, a, { bags: [{ name: "붕어빵 통", shape: "fish", items: [{ c: "#F3D27A", t: "크림붕어빵", k: "크림", n: 2 }, { c: "#B7793F", t: "팥붕어빵", k: "팥", n: 2 }] }], kind: "box", need: 6, legend: "노란 붕어빵: 크림붕어빵 2개 · 갈색 붕어빵: 팥붕어빵 2개",
        ask: [{ q: "알맞은 말을 골라 보세요.", parts: ["귤 한 상자를 열었을 때 귤이 나올 가능성은 ", { o: AV6_W3, a: 2 }, ".", h("br"), "할머니께서 크림붕어빵을 드실 가능성은 ", { o: AV6_W3, a: 1 }, ".", h("br"), "할머니께서 팥붕어빵을 드실 가능성은 ", { o: AV6_W3, a: 1 }, ".", h("br"), "할아버지께서 딸기우유를 드실 가능성은 ", { o: AV6_W3, a: 0, why: { "1": "준비한 우유에는 딸기우유가 없어요." } }, "."] }],
        ok: "귤은 확실하다, 크림붕어빵과 팥붕어빵은 반반이다, 딸기우유는 불가능하다예요." }) },
    { inst: "일이 일어날 가능성을 생각하여 알맞은 곳에 카드를 놓아 보세요.", hints: ["하루는 24시간이에요.", "우체국 대기표의 번호는 홀수이거나 짝수예요."],
      render: (b, a) => av6Scale(b, a, { cards: [
        { t: "내일 하루는 25시간일 것입니다.", a: 0 },
        { t: "윷놀이에서 8번 연속으로 모가 나올 것입니다.", a: 1, why: { "0": "8번 연속으로 모가 나오기는 아주 어렵지만, 일어날 수 없는 일은 아니에요." } },
        { t: "우체국에서 뽑은 대기표의 번호는 짝수일 것입니다.", a: 2 },
        { t: "우리 반에는 오른손잡이가 많을 것입니다.", a: 3, why: { "4": "대부분의 사람이 오른손잡이지만 꼭 그렇다고 할 수는 없어요." } },
        { t: "내일 아침에 해가 동쪽에서 뜰 것입니다.", a: 4 }], ok: "25시간은 불가능하다, 모 8번은 ~아닐 것 같다, 짝수 대기표는 반반이다, 오른손잡이는 ~일 것 같다, 해가 동쪽에서 뜨는 것은 확실하다예요." }) },
    { inst: "딸기 맛 사탕과 포도 맛 사탕이 들어 있는 주머니에서 사탕을 한 개 꺼내요. 주머니를 눌러 여러 번 꺼내 보세요(꺼낸 것은 다시 넣어요).", hints: ["딸기 맛 사탕이 포도 맛 사탕보다 적게 들어 있어요.", "개수가 많을수록 나올 가능성이 높아요."],
      render: (b, a) => av6Bag(b, a, { bags: [{ name: "사탕 주머니", shape: "ball", items: [{ c: "#F07A8E", t: "딸기 맛", k: "딸기", n: 2 }, { c: "#8E5BB5", t: "포도 맛", k: "포도", n: 6 }] }], need: 8, legend: "분홍: 딸기 맛 사탕 2개 · 보라: 포도 맛 사탕 6개",
        ask: [{ parts: ["꺼낼 때 나올 수 있는 맛: ", { o: ["딸기 맛", "포도 맛", "사과 맛"], a: [0, 1], multi: true }, h("br"), "딸기 맛 사탕이 나올 가능성은 ", { o: AV6_WORDS, a: 1, why: { "0": "딸기 맛 사탕도 들어 있어서 나올 수는 있어요.", "2": "딸기 맛이 포도 맛보다 적게 들어 있어요." } }, h("br"), "포도 맛 사탕이 나올 가능성은 ", { o: AV6_WORDS, a: 3, why: { "4": "딸기 맛 사탕도 들어 있어서 꼭 포도 맛이 나온다고 할 수는 없어요." } }] }],
        ok: "딸기 맛은 적게 들어 있어서 ‘~아닐 것 같다’, 포도 맛은 많이 들어 있어서 ‘~일 것 같다’예요." }) },
    { inst: "약속하기를 완성해 보세요.", hints: ["일이 일어나길 기대할 수 있는 정도를 나타내는 말이에요."],
      render: (b, a) => blanks(b, a, ["어떠한 상황에서 특정한 일이 일어나길 기대할 수 있는 정도를 ", { o: ["가능성", "평균", "자룟값"], a: 0 }, "이라고 합니다. 가능성은 불가능하다, ~아닐 것 같다, ", { o: ["반반이다", "고르다", "평균이다"], a: 0 }, ", ~일 것 같다, ", { o: ["확실하다", "많다", "적다"], a: 0 }, " 등으로 표현할 수 있습니다."],
        { ok: "가능성은 불가능하다, ~아닐 것 같다, 반반이다, ~일 것 같다, 확실하다 등으로 표현해요." }) },
    { inst: "수학익힘 문제예요. 일이 일어날 가능성을 생각하여 알맞은 곳에 카드를 놓아 보세요.", hints: ["1월은 31일까지 있어요.", "주사위 눈 1~6 가운데 2 이상은 5가지예요."],
      render: (b, a) => av6Scale(b, a, { cards: [
        { t: "수요일의 다음 날은 목요일일 것입니다.", a: 4 },
        { t: "내일 전학 오는 학생은 여학생일 것입니다.", a: 2 },
        { t: "동전을 10번 던지면 10번 모두 그림면이 나올 것입니다.", a: 1 },
        { t: "주사위 한 개를 던지면 눈의 수가 2 이상일 것입니다.", a: 3 },
        { t: "내년 1월 달력에는 날짜가 35일까지 있을 것입니다.", a: 0 }], ok: "확실하다, 반반이다, ~아닐 것 같다, ~일 것 같다, 불가능하다예요." }) }
  ],
  challenge: { inst: "잘못 말한 친구를 찾아 고치고, 주변에서 가능성을 나타낼 수 있는 상황을 찾아 말로 표현해 보세요.", hints: ["4×3=12예요.", "○× 문제의 정답은 ○이거나 ×예요."],
    render: (b, a) => av6Chain(b, a, [
      (bx, ax) => quiz(bx, ax, [
        { q: "가능성을 잘못 말한 사람은 누구일까요? 수정: “지금은 오후 2시니까 3시간 후에 오후 5시일 가능성은 ‘확실하다’야.” 정하: “계산기에 4, ×, 3, =을 차례대로 누르면 15가 나올 가능성은 ‘불가능하다’야.” 예지: “○× 문제의 정답이 ×일 가능성은 ‘~아닐 것 같다’야.”", o: ["수정", "정하", "예지"], a: 2, why: { "1": "4×3=12이니까 15가 나오는 것은 불가능해요. 정하는 바르게 말했어요." } },
        { q: "예지의 말을 바르게 고치면?", o: ["○× 문제의 정답이 ×일 가능성은 ‘반반이다’예요.", "○× 문제의 정답이 ×일 가능성은 ‘확실하다’예요."], a: 0 }], { ok: "예지가 잘못 말했어요. 정답은 ○이거나 ×이니까 ‘반반이다’예요." }),
      (bx, ax) => writeStep(bx, ax, [
        { q: "‘불가능하다’로 표현할 수 있는 일을 써 보세요.", tag: "불가능하다", ph: "예) 2월의 다음 달이 1월일 가능성은 불가능해요." },
        { q: "‘반반이다’로 표현할 수 있는 일을 써 보세요.", tag: "반반이다", ph: "예) 1부터 10까지의 수 카드 중 한 장을 뽑을 때 홀수가 나올 가능성은 반반이에요." }])]) }
},
{
  id: "t6", no: 6, title: "일이 일어날 가능성을 비교해 볼까요", soop: "개념 구축하기(O)",
  question: "일이 일어날 가능성을 어떻게 비교할 수 있을까요?",
  summary: "일이 일어날 가능성은 ‘반반이다’를 기준으로 비교할 수 있어요. 주머니에 든 개수가 많을수록, 회전판에서 색칠된 부분이 넓을수록 가능성이 높아요. 실험 결과 표를 보고 가능성을 예상할 수도 있어요.",
  steps: [
    { inst: "건강 체조를 하려면 주머니에서 손수건 한 장을 꺼내야 해요. 주머니마다 눌러서 여러 번 꺼내 보세요(꺼낸 것은 다시 넣어요).", hints: ["주머니 가에는 빨간색만, 다에는 초록색만 있어요.", "‘반반이다’를 기준으로 비교해요."],
      render: (b, a) => av6Bag(b, a, { bags: [
        { name: "가", shape: "sq", items: [{ c: AV6_RED, t: "빨간색", k: "빨", n: 4 }] },
        { name: "나", shape: "sq", items: [{ c: AV6_RED, t: "빨간색", k: "빨", n: 2 }, { c: AV6_GREEN, t: "초록색", k: "초", n: 2 }] },
        { name: "다", shape: "sq", items: [{ c: AV6_GREEN, t: "초록색", k: "초", n: 4 }] }], need: 4, legend: "가: 빨간색 4장 · 나: 빨간색 2장, 초록색 2장 · 다: 초록색 4장",
        ask: [{ q: "꺼낸 손수건이 빨간색일 가능성을 비교해 보세요.", parts: ["확실한 주머니 ", { o: ["가", "나", "다"], a: 0 }, ", 반반인 주머니 ", { o: ["가", "나", "다"], a: 1 }, ", 불가능한 주머니 ", { o: ["가", "나", "다"], a: 2 }, h("br"), "가능성이 높은 주머니부터 차례로: ", { o: ["가, 나, 다", "다, 나, 가", "나, 가, 다"], a: 0 }] }],
        ok: "빨간색 손수건이 나올 가능성은 가(확실하다) > 나(반반이다) > 다(불가능하다) 차례로 높아요." }) },
    { inst: "회전판 다섯 개를 돌려 보세요. 화살이 초록색에 멈출 가능성을 생각해 보세요.", hints: ["회전판을 누르거나 ‘모두 한 번씩 돌리기’를 눌러요.", "초록색이 칠해진 부분이 넓을수록 초록색에 멈출 가능성이 높아요."],
      render: (b, a) => av6Spin(b, a, { spins: AV6_SP6, need: 3, legend: "초록색과 노란색으로 색칠한 회전판이에요.",
        ask: [{ parts: ["노란색에만 멈출 수 있는 회전판 ", { o: ["가", "나", "다", "라", "마"], a: 1 }, ", 초록색에 멈출 가능성이 반반인 회전판 ", { o: ["가", "나", "다", "라", "마"], a: 0 }, h("br"), "초록색에 멈출 가능성이 가장 높은 회전판 ", { o: ["가", "나", "다", "라", "마"], a: 4 }, ", 다와 라 중 더 높은 회전판 ", { o: ["다", "라"], a: 1, why: { "0": "다는 초록색 부분이 노란색 부분보다 좁고, 라는 초록색 부분이 노란색 부분보다 넓어요." } }] }],
        ok: "나는 노란색뿐이고, 가는 반반, 마는 전체가 초록색이에요. 초록색 부분이 더 넓은 라가 다보다 가능성이 높아요." }) },
    { name: "차례 정하기", inst: "화살이 초록색에 멈출 가능성이 높은 회전판부터 차례대로 눌러 보세요.", hints: ["마는 확실하다, 나는 불가능하다예요.", "라(~일 것 같다) → 가(반반이다) → 다(~아닐 것 같다)"],
      render: (b, a) => av6Rank(b, a, { items: AV6_SP6.map(sp => ({ t: sp.name, fig: () => av6SpinFig([Object.assign({}, sp, { name: "" })], { cw: 110, r: 42, maxW: "7em" }) })), order: [4, 3, 0, 2, 1], ok: "마, 라, 가, 다, 나 차례로 초록색에 멈출 가능성이 높아요." }) },
    { inst: "상자에서 구슬 한 개를 꺼내 색을 확인하고 다시 넣기를 100번 했어요. 결과를 보고 가능성을 비교하고 예상해 보세요.", hints: ["많이 나온 색일수록 나올 가능성이 높아요.", "많이 나온 색의 구슬이 상자에 많이 들어 있을 것 같아요."],
      render: (b, a) => av6Ask(b, a, [{ fig: () => h("div", {}, av6HTbl("색별 나온 구슬의 횟수", ["빨간색", "초록색", "파란색", "합계"], [11, 30, 59, 100], { h1: "색", h2: "횟수(번)" }),
        av6Fig(520, 120, s => { [[11, AV6_RED, "빨간색"], [30, AV6_GREEN, "초록색"], [59, AV6_BLUE, "파란색"]].forEach(([v, c, t], i) => { s.append(txt(70, 25 + i * 35, t, 14, { "text-anchor": "end" })); s.append(svgEl("rect", { x: 80, y: 13 + i * 35, width: v * 6, height: 24, fill: c })); s.append(txt(86 + v * 6, 25 + i * 35, `${v}번`, 13, { "text-anchor": "start" })); }); }, "28em")),
        parts: ["빨간색과 초록색 중 나올 가능성이 더 높은 색은 ", { o: ["빨간색", "초록색"], a: 1 }, "이에요. 나올 가능성이 높은 색부터 차례로 쓰면 ", { o: ["파란색, 초록색, 빨간색", "빨간색, 초록색, 파란색", "초록색, 파란색, 빨간색"], a: 0 }, "이에요. 상자에 가장 많이 들어 있을 것 같은 색은 ", { o: ["빨간색", "초록색", "파란색"], a: 2 }, "이에요."] }],
      { ok: "11번 < 30번 < 59번이니까 파란색, 초록색, 빨간색 차례로 가능성이 높고, 파란색 구슬이 가장 많이 들어 있을 것 같아요." }) },
    { inst: "수학익힘 문제예요. 가능성을 비교해 보세요.", hints: ["2의 배수는 2, 4, 6 / 1 이상 5 이하는 1, 2, 3, 4, 5 / 4의 배수는 4예요.", "세 색이 나온 횟수가 비슷하면 세 색의 넓이도 비슷해요."],
      render: (b, a) => av6Ask(b, a, [
        { q: "주사위를 한 번 던질 때 일이 일어날 가능성이 가장 높은 것은? ㉠ 눈의 수가 2의 배수 ㉡ 눈의 수가 1 이상 5 이하 ㉢ 눈의 수가 4의 배수", parts: [{ o: ["㉠", "㉡", "㉢"], a: 1, why: { "0": "2의 배수는 2, 4, 6으로 3가지, 1 이상 5 이하는 5가지예요." } }] },
        { q: "회전판을 140회 돌렸더니 화살이 빨간색에 46회, 노란색에 47회, 파란색에 47회 멈췄어요. 어느 회전판을 돌렸을 가능성이 가장 높을까요?", fig: () => av6SpinFig(AV6_SP6B, { cw: 130, r: 46 }), parts: [{ o: ["㉠", "㉡", "㉢"], a: 2, why: { "0": "㉠은 빨간색이 절반이라 빨간색에 훨씬 많이 멈출 것 같아요.", "1": "㉡은 파란색이 절반이라 파란색에 훨씬 많이 멈출 것 같아요." } }] }],
        { ok: "㉡(1 이상 5 이하)이 가장 높고, 세 색이 비슷하게 나왔으니 세 색의 넓이가 같은 ㉢이에요." }) }
  ],
  challenge: { inst: "빨간색, 초록색, 노란색으로 회전판을 색칠해 보세요. 조건: 화살이 노란색에 멈출 가능성이 가장 높고, 초록색에 멈출 가능성은 빨간색에 멈출 가능성의 2배예요.", hints: ["초록색 칸 수가 빨간색 칸 수의 2배가 되어야 해요.", "6칸이니까 빨간색 1칸, 초록색 2칸이면 노란색은 몇 칸일까요?"],
    render: (b, a) => av6Paint(b, a, { k: 6, colors: [{ c: AV6_RED, t: "빨간색" }, { c: AV6_GREEN, t: "초록색" }, { c: AV6_YEL, t: "노란색" }], words: ["빨간색 1칸", "초록색 2칸", "노란색 3칸"], answer: "빨간색 1칸, 초록색 2칸, 노란색 3칸",
      rule: c => !c[0] ? "빨간색도 칠해야 해요. 빨간색에 멈출 수 있어야 초록색이 빨간색의 2배인지 견줄 수 있어요." : c[1] !== 2 * c[0] ? `초록색 칸 수(${c[1]}칸)가 빨간색 칸 수(${c[0]}칸)의 2배가 되어야 해요.` : !(c[2] > c[1] && c[2] > c[0]) ? "노란색 칸이 가장 많아야 노란색에 멈출 가능성이 가장 높아요." : "",
      ok: "빨간색 1칸, 초록색 2칸, 노란색 3칸이에요. 노란색이 가장 넓고 초록색은 빨간색의 2배예요." }) }
},
{
  id: "t7", no: 7, title: "일이 일어날 가능성을 수로 나타내어 볼까요", soop: "개념 구축하기(O)",
  question: "일이 일어날 가능성을 어떤 수로 나타낼 수 있을까요?",
  summary: "일이 일어날 가능성을 0부터 1까지의 수로 나타내면 ‘불가능하다’는 0으로, ‘반반이다’는 [1/2]로, ‘확실하다’는 1로 나타낼 수 있어요.",
  steps: [
    { inst: "송년 잔치를 마무리하며 경품 뽑기를 해요. 경품함마다 눌러 공을 여러 번 꺼내 보세요(꺼낸 공은 다시 넣어요).", hints: ["가에는 주황색 공 1개와 파란색 공 1개가 들어 있어요.", "나에는 주황색 공만, 다에는 파란색 공만 들어 있어요."],
      render: (b, a) => av6Bag(b, a, { kind: "box", bags: [
        { name: "가", shape: "ball", items: [{ c: AV6_ORG, t: "주황색", k: "주", n: 1 }, { c: AV6_BLUE, t: "파란색", k: "파", n: 1 }] },
        { name: "나", shape: "ball", items: [{ c: AV6_ORG, t: "주황색", k: "주", n: 2 }] },
        { name: "다", shape: "ball", items: [{ c: AV6_BLUE, t: "파란색", k: "파", n: 2 }] }], need: 4, legend: "가: 주황색 공 1개, 파란색 공 1개 · 나: 주황색 공 2개 · 다: 파란색 공 2개",
        ask: [{ q: "각각의 경품함에서 주황색 공이 나올 가능성을 말로 나타내 보세요.", parts: ["가 ", { o: AV6_W3, a: 1 }, h("br"), "나 ", { o: AV6_W3, a: 2 }, h("br"), "다 ", { o: AV6_W3, a: 0 }] }],
        ok: "주황색 공이 나올 가능성은 가는 반반이다, 나는 확실하다, 다는 불가능하다예요." }) },
    { inst: "주황색 공이 나올 가능성을 0부터 1까지의 수직선(가능성 띠)에 놓아 보고, 각 말을 수로 나타내 보세요.", hints: ["불가능하다는 가장 왼쪽 0, 확실하다는 가장 오른쪽 1이에요.", "반반이다는 0과 1의 한가운데예요."],
      render: (b, a) => av6Chain(b, a, [
        (bx, ax) => av6Scale(bx, ax, { pos: 3, cards: [{ t: "경품함 가에서 주황색 공이 나올 가능성", a: 1 }, { t: "경품함 나에서 주황색 공이 나올 가능성", a: 2 }, { t: "경품함 다에서 주황색 공이 나올 가능성", a: 0 }], ok: "다는 왼쪽 끝, 가는 한가운데, 나는 오른쪽 끝이에요." }),
        (bx, ax) => av6Ask(bx, ax, [{ fig: () => av6Fig(560, 90, s => { s.append(svgEl("line", { x1: 40, y1: 40, x2: 520, y2: 40, stroke: AV6.ink, "stroke-width": 3 })); [[40, "불가능하다"], [280, "반반이다"], [520, "확실하다"]].forEach(([x, t]) => { s.append(svgEl("line", { x1: x, y1: 30, x2: x, y2: 50, stroke: AV6.ink, "stroke-width": 3 })); s.append(txt(x, 16, t, 15)); s.append(svgEl("rect", { x: x - 20, y: 56, width: 40, height: 28, rx: 4, fill: "#fff", stroke: AV6.red, "stroke-width": 2 })); s.append(txt(x, 70, "?", 15, { fill: AV6.red })); }); }, "30em"),
          parts: ["수로 나타내면 불가능하다 → ", { o: AV6_N3, a: 0 }, ", 반반이다 → ", { o: AV6_N3, a: 1 }, ", 확실하다 → ", { o: AV6_N3, a: 2 }, h("br"), "주황색 공이 나올 가능성을 수로: 가 ", { o: AV6_N3, a: 1 }, ", 나 ", { o: AV6_N3, a: 2 }, ", 다 ", { o: AV6_N3, a: 0 }] }],
          { ok: "불가능하다 0, 반반이다 [1/2], 확실하다 1이에요. 가는 [1/2], 나는 1, 다는 0이에요." })]) },
    { inst: "동전 한 개를 던질 때와 회전판을 돌릴 때 일이 일어날 가능성을 수로 나타내 보세요.", hints: ["동전에는 그림면과 숫자 면이 하나씩 있어요.", "회전판 가에는 빨간색이 없고, 다는 전체가 빨간색이에요."],
      render: (b, a) => av6Ask(b, a, [
        { q: "동전 한 개를 던질 때", fig: () => h("div", { style: "display:flex;gap:.6em" }, av6Face("coin", 0), av6Face("coin", 1)), parts: ["그림면이 나올 가능성 ", { o: AV6_N3, a: 1 }, ", 숫자 면이 나올 가능성 ", { o: AV6_N3, a: 1 }] },
        { q: "회전판을 돌릴 때 화살이 빨간색에 멈출 가능성", fig: () => av6SpinFig(AV6_SP7, { cw: 140, r: 48 }), parts: ["반반인 회전판은 ", { o: ["가", "나", "다"], a: 1 }, "예요. 가 ", { o: AV6_N3, a: 0, why: { "1": "회전판 가에는 빨간색 부분이 없어요." } }, ", 나 ", { o: AV6_N3, a: 1 }, ", 다 ", { o: AV6_N3, a: 2 }] }],
        { ok: "동전은 그림면 [1/2], 숫자 면 [1/2]이에요. 회전판 가는 0, 나는 [1/2], 다는 1이에요." }) },
    { inst: "약속하기를 완성해 보세요.", hints: ["가능성 띠의 왼쪽 끝은 0, 오른쪽 끝은 1이에요."],
      render: (b, a) => av6Ask(b, a, [{ parts: ["일이 일어날 가능성을 0부터 1까지의 수로 나타내면 ‘불가능하다’는 ", { o: AV6_N3, a: 0 }, "으로, ‘반반이다’는 ", { o: AV6_N3, a: 1 }, "로, ‘확실하다’는 ", { o: AV6_N3, a: 2 }, "로 나타낼 수 있습니다."] }],
        { ok: "불가능하다는 0, 반반이다는 [1/2], 확실하다는 1이에요." }) },
    { inst: "주사위를 한 번 던질 때 일이 일어날 가능성을 말과 수로 각각 나타내 보세요.", hints: ["주사위 눈은 1, 2, 3, 4, 5, 6이에요.", "짝수는 2, 4, 6으로 6가지 중 3가지예요."],
      render: (b, a) => av6Ask(b, a, [
        { q: "주사위 눈의 수를 홀수와 짝수로 분류해요.", fig: () => h("div", { style: "display:flex;flex-wrap:wrap;gap:.3em" }, ...[1, 2, 3, 4, 5, 6].map(v => av6Face("dice", v))), parts: ["짝수인 눈: ", { o: ["1", "2", "3", "4", "5", "6"], a: [1, 3, 5], multi: true }] },
        { q: "말과 수로 나타내요.", parts: ["짝수가 나올 가능성: ", { o: AV6_W3, a: 1 }, ", ", { o: AV6_N3, a: 1 }, h("br"), "7이 나올 가능성: ", { o: AV6_W3, a: 0 }, ", ", { o: AV6_N3, a: 0 }, h("br"), "6 이하로 나올 가능성: ", { o: AV6_W3, a: 2, why: { "1": "주사위 눈은 모두 6 이하예요." } }, ", ", { o: AV6_N3, a: 2 }] }],
        { ok: "짝수는 반반이다·[1/2], 7은 불가능하다·0, 6 이하는 확실하다·1이에요." }) }
  ],
  challenge: { inst: "수학익힘 문제예요. 가능성을 수로 나타내 보세요.", hints: ["1년은 366일보다 많지 않아요.", "당첨 제비가 6개 중 3개이면 반반이에요."],
    render: (b, a) => av6Chain(b, a, [
      (bx, ax) => av6Ask(bx, ax, [
        { q: "검은색 바둑돌 3개와 흰색 바둑돌 3개가 든 주머니에서 한 개를 꺼낼 때 흰색일 가능성", parts: [{ o: AV6_W3, a: 1 }, ", 수로 ", { o: AV6_N3, a: 1 }] },
        { q: "가능성을 수로 나타내면 0인 것은? ㉠ 423명 중 생일이 같은 사람이 있을 것입니다. ㉡ 1번부터 10번까지 번호표 중 한 장을 뽑으면 15번이 나올 것입니다.", parts: [{ o: ["㉠", "㉡"], a: 1, why: { "0": "1년은 많아야 366일이라 423명 중에는 생일이 같은 사람이 꼭 있어요. ㉠은 1이에요." } }] },
        { q: "제비 6개 중 당첨 제비가 3개예요. 한 개를 뽑을 때 당첨될 가능성", parts: [{ o: AV6_N3, a: 1 }] }],
        { ok: "흰색은 반반이다·[1/2], 0인 것은 ㉡, 당첨될 가능성은 [1/2]이에요." }),
      (bx, ax) => { bx.append(h("p", { class: "inst" }, "수 카드 1, 3, 5, 7, 9, 11 중 한 장을 뽑아요. 일이 일어날 가능성에 맞게 카드를 놓아 보세요."));
        av6Scale(bx, ax, { pos: 3, nums: true, cards: [
          { t: "뽑은 수 카드는 2의 배수일 것입니다.", a: 0 },
          { t: "뽑은 수 카드는 9의 약수일 것입니다.", a: 1, why: { "0": "9의 약수 1, 3, 9가 카드에 있어요. 6장 중 3장이에요." } },
          { t: "뽑은 수 카드는 12보다 작은 수일 것입니다.", a: 2 },
          { t: "뽑은 수 카드는 홀수일 것입니다.", a: 2 }], ok: "2의 배수는 0, 9의 약수(1, 3, 9)는 [1/2], 12보다 작은 수와 홀수는 1이에요." }); }]) }
},
{
  id: "t8", no: 8, title: "생각을 더하다 ― 여러 번 던져도 가능성이 같을까요", soop: "탐구 정리하기(O)",
  question: "동전이나 주사위를 여러 번 던지면 가능성은 어떻게 될까요?",
  summary: "동전의 그림면과 숫자 면, 주사위의 홀수와 짝수가 나올 가능성은 모두 [1/2]로 같아요. 적게 던지면 결과가 반반과 크게 다를 수 있지만, 던진 횟수가 많아질수록 두 가지가 나온 횟수가 비슷해져요.",
  steps: [
    { name: "동전의 가능성", inst: "“동전을 던져서 누가 간식을 먹을지 정하자! 그림면이 나오면 내가 먹을래.” “또 그림면이 나왔네! 왜 그림면만 나오는 거야?” 동전 한 개를 던질 때 가능성을 생각해 보세요.", hints: ["동전에는 그림면과 숫자 면이 하나씩 있어요.", "반반이다는 [1/2]이에요."],
      render: (b, a) => av6Ask(b, a, [{ parts: ["그림면이 나올 가능성은 ", { o: AV6_W3, a: 1 }, "이고 수로 ", { o: AV6_N3, a: 1 }, "이에요. 숫자 면이 나올 가능성은 수로 ", { o: AV6_N3, a: 1 }, "이에요. 두 가능성은 ", { o: ["같아요", "달라요"], a: 0 }, "."] }],
        { ok: "그림면과 숫자 면이 나올 가능성은 모두 [1/2]로 같아요." }) },
    { name: "동전 10번", inst: "동전 한 개를 10번 던져 보세요.", hints: ["‘10번 던지기’를 한 번 눌러도 돼요.", "표에서 내 결과를 읽어요."],
      render: (b, a) => av6Sim(b, a, { kind: "coin", ms: [10], need: 10,
        ask: d => [{ parts: ["10번 던졌을 때 그림면은 ", { n: d.a }, "번, 숫자 면은 ", { n: d.b }, "번 나왔어요."] },
          { q: "동전을 10번 던지면 그림면과 숫자 면이 꼭 5번씩 나올까요?", parts: [{ o: ["네, 꼭 5번씩 나와요.", "아니요, 적게 던지면 5번씩 나오지 않을 수도 있어요."], a: 1, why: { "0": "다시 실험해 보면 6번과 4번, 7번과 3번처럼 나올 때도 있어요." } }] }],
        ok: "가능성은 [1/2]씩이지만 10번만 던지면 꼭 5번씩 나오지는 않아요." }) },
    { name: "동전 여러 번", inst: "모둠 친구들의 결과를 더하듯이 동전을 120번까지 던져 보세요. 던진 횟수별 결과가 표에 적혀요.", hints: ["‘20번 던지기’를 여러 번 누르거나 ‘100번 더 던지기’를 눌러요.", "가운데 빨간 점선(반반)과 막대를 비교해 봐요."],
      render: (b, a) => av6Sim(b, a, { kind: "coin", ms: [40, 60, 80, 100, 120], need: 120,
        ask: [{ parts: ["던진 횟수가 많아질수록 그림면과 숫자 면이 나온 횟수는 ", { o: ["비슷해져요", "점점 크게 달라져요", "늘 똑같아요"], a: 0 }, "."] }],
        ok: "던진 횟수가 많아질수록 그림면과 숫자 면이 나온 횟수가 비슷해져요. ‘100번 더 던지기’로 더 많이 던져 봐도 좋아요." }) },
    { name: "주사위의 가능성", inst: "주사위 한 개를 던질 때 홀수와 짝수가 나올 가능성을 비교하고, 10번 던져 보세요.", hints: ["홀수 눈은 1, 3, 5, 짝수 눈은 2, 4, 6이에요.", "6가지 중 3가지씩이니까 반반이에요."],
      render: (b, a) => av6Chain(b, a, [
        (bx, ax) => av6Ask(bx, ax, [{ parts: ["홀수인 눈: ", { o: ["1", "2", "3", "4", "5", "6"], a: [0, 2, 4], multi: true }, h("br"), "홀수가 나올 가능성 ", { o: AV6_N3, a: 1 }, ", 짝수가 나올 가능성 ", { o: AV6_N3, a: 1 }, " → 두 가능성은 ", { o: ["같아요", "달라요"], a: 0 }] }], { ok: "홀수와 짝수가 나올 가능성은 모두 [1/2]로 같아요." }),
        (bx, ax) => av6Sim(bx, ax, { kind: "dice", ms: [10], need: 10,
          ask: d => [{ parts: ["10번 던졌을 때 홀수는 ", { n: d.a }, "번, 짝수는 ", { n: d.b }, "번 나왔어요."] }],
          ok: "10번만 던지면 홀수 2번, 짝수 8번처럼 반반과 크게 다를 수도 있어요." })]) },
    { name: "주사위 여러 번", inst: "주사위를 120번까지 던져 보고, 던진 횟수가 많아질 때 결과를 살펴보세요.", hints: ["‘20번 던지기’나 ‘100번 더 던지기’를 눌러요.", "‘새로 다시 실험하기’를 하면 표의 수가 바뀌어요."],
      render: (b, a) => av6Sim(b, a, { kind: "dice", ms: [40, 60, 80, 100, 120], need: 120,
        ask: [{ parts: ["던진 횟수가 많아질수록 홀수와 짝수가 나온 횟수는 ", { o: ["비슷해져요", "점점 크게 달라져요"], a: 0 }, ". 같은 실험을 다시 하면 표의 수는 ", { o: ["똑같이 나와요", "조금씩 달라질 수 있어요"], a: 1 }, "."] }],
        ok: "실험할 때마다 결과는 조금씩 다르지만, 많이 던질수록 홀수와 짝수가 나온 횟수가 비슷해져요." }) }
  ],
  challenge: { inst: "실험 결과를 보고 생각해 보세요.", hints: ["동전은 앞에 무엇이 나왔는지 기억하지 못해요.", "던진 횟수의 절반과 비교해 봐요."],
    render: (b, a) => av6Ask(b, a, [
      { q: "동전을 던졌더니 앞, 뒤, 앞, 앞, 뒤가 나왔어요. 다음에 던지면?", parts: [{ o: ["반드시 뒤가 나와요.", "반드시 앞이 나와요.", "앞과 뒤가 나올 가능성은 여전히 반반이에요."], a: 2, why: { "0": "앞에서 무엇이 나왔든 다음에 던질 때 앞과 뒤가 나올 가능성은 같아요." } }] },
      { q: "어느 모둠의 동전 던지기 결과예요.", fig: () => av6Tbl(["던진 횟수(번)", "40", "60", "80", "100", "120"], [["그림면(번)", "16", "27", "38", "49", "59"], ["숫자 면(번)", "24", "33", "42", "51", "61"]], { rowHead: true }),
        parts: ["120번 던졌을 때 그림면은 ", { n: 59 }, "번 나왔어요. 던진 횟수가 많아질수록 그림면이 나온 횟수는 던진 횟수의 ", { o: ["절반", "2배", "4분의 1"], a: 0 }, "에 가까워져요."] }],
      { ok: "다음 결과는 앞의 결과와 상관없이 반반이에요. 많이 던질수록 나온 횟수가 던진 횟수의 절반에 가까워져요." }) }
},
{
  id: "t9", no: 9, title: "놀이를 더하다 ― 누가 더 평균에 가까울까요", soop: "탐구 정리하기(O)",
  question: "모둠 기록의 평균에 가장 가까운 친구는 누구일까요?",
  summary: "주제를 정해 기록을 재고, 계산기로 모둠 기록의 평균을 구한 뒤 평균과 기록을 비교하여 평균에 가장 가까운 사람을 찾아요. 그 사람이 우리 모둠을 대표하는 친구예요.",
  steps: [
    { name: "놀이 방법", inst: "‘누가 더 평균에 가까울까요’ 놀이 방법이에요. 차례대로 눌러 보세요. (인원 4명, 준비물: 계산기, 줄넘기, 초시계, 줄자)", hints: ["주제를 먼저 정하고 기록을 재요.", "평균을 구한 다음에 평균에 가까운 사람을 찾아요."],
      render: (b, a) => sequence(b, a, ["기록을 측정해요.", "평균을 구할 주제를 정해요.", "평균에 가장 가까운 사람을 찾아요.", "표에 제목, 이름, 기록을 적어요.", "다른 주제를 정하여 되풀이해요."], [1, 0, 3, 2, 4], { ok: "주제 정하기 → 기록 측정 → 표에 적기 → 평균 구해 가장 가까운 사람 찾기 → 다른 주제로 되풀이해요." }) },
    { name: "평균 구하기", inst: "가은이네 모둠이 네 가지 주제로 기록을 측정했어요. 계산기를 써서 주제별 모둠 기록의 평균을 구해 보세요.", hints: ["네 사람의 기록을 모두 더하여 4로 나눠요.", "제자리멀리뛰기와 왕복 오래달리기는 평균이 소수로 나와요."],
      render: av6WithCalc((b, a) => av6Ask(b, a, AV6_T9.map(t => ({ fig: () => av6HTbl(`${t.t}`, AV6_NM9, t.recs.map(String), { h2: `기록(${t.u})` }), parts: [`${t.t} 기록의 평균: `, { n: t.avg, w: "6em" }, ` ${t.u}`] })),
        { ok: "평균은 외발 서기 35초, 2단 뛰기 16회, 제자리멀리뛰기 150.1 cm, 왕복 오래달리기 61.5회예요." })) },
    { name: "가장 가까운 사람", inst: "주제마다 평균에 가장 가까운 사람을 찾아보세요.", hints: ["기록과 평균의 차이를 구해 가장 작은 사람을 찾아요.", "외발 서기: 41−35=6, 35−28=7, 35−33=2, 38−35=3"],
      render: (b, a) => av6Ask(b, a, AV6_T9.map(t => ({ fig: () => av6HTbl(`${t.t} (평균 ${t.avg}${t.u})`, AV6_NM9, t.recs.map(String), { h2: `기록(${t.u})` }), parts: ["평균에 가장 가까운 사람: ", { o: AV6_NM9, a: t.near }] })),
        { ok: "외발 서기는 지민, 2단 뛰기는 현우, 제자리멀리뛰기는 가은, 왕복 오래달리기는 도윤이가 평균에 가장 가까워요." }) },
    { name: "우리 모둠 놀이", inst: "우리 모둠의 주제를 고르고, 친구들의 이름과 기록을 써서 놀이를 해 보세요. 평균을 구해 쓰면 평균에 가장 가까운 친구를 찾을 수 있어요.", hints: ["기록을 정확하게 측정해요.", "기록 4개를 더하여 4로 나누면 평균이에요."],
      render: av6WithCalc((b, a) => av6Near(b, a, { names: ["나", "친구 1", "친구 2", "친구 3"], topics: [{ t: "눈 감고 외발 서기", u: "초" }, { t: "줄넘기 2단 뛰기", u: "회" }, { t: "제자리멀리뛰기", u: "cm" }, { t: "왕복 오래달리기", u: "회" }, { t: "1분 동안 공 튀기기", u: "회" }] })) },
    { name: "또 다른 놀이", inst: "또 다른 놀이 ‘비밀 숫자 찾기’예요. 네 친구가 고른 수와 설계자가 알려 준 5개 수의 평균을 보고 설계자의 비밀 숫자를 찾아보세요. 5점을 먼저 얻으면 이겨요.", hints: ["(평균) × 5 = 5개 수의 합계예요.", "합계에서 네 수의 합을 빼면 비밀 숫자예요."],
      render: (b, a) => av6Secret(b, a, { names: ["가은", "도윤", "지민", "현우"] }) }
  ],
  challenge: { inst: "설계자가 되어 보세요. 친구들이 10, 7, 16, 9를 골랐어요.", hints: ["네 수의 합은 42예요.", "42에 비밀 숫자를 더한 수가 5로 나누어떨어져야 평균이 자연수예요."],
    render: (b, a) => av6Ask(b, a, [
      { q: "5개 수의 평균이 자연수가 되도록 20 이하의 비밀 숫자를 정하려고 해요. 비밀 숫자가 될 수 있는 수를 모두 고르세요.", parts: [{ o: ["3", "5", "8", "10", "13", "15", "18", "20"], a: [0, 2, 4, 6], multi: true }] },
      { q: "비밀 숫자를 13으로 정했어요.", parts: ["5개 수의 평균은 (10 + 7 + 16 + 9 + 13) ÷ 5 = ", { n: 11 }, "이에요."] }],
      { ok: "42+3=45, 42+8=50, 42+13=55, 42+18=60이 5로 나누어떨어져요. 13으로 정하면 평균은 11이에요." }) }
},
{
  id: "t10", no: 10, title: "공부한 내용을 확인해요", soop: "발표하기(P)",
  question: "평균과 가능성에 대해 공부한 내용을 잘 알고 있나요?",
  summary: "(평균)=(자룟값을 모두 더한 수)÷(자료의 수)예요. 평균을 알면 전체 합과 모르는 값을 구할 수 있어요. 가능성은 불가능하다(0), ~아닐 것 같다, 반반이다([1/2]), ~일 것 같다, 확실하다(1)로 나타내요.",
  steps: [
    { name: "고르게 하기", inst: "1번. 은찬이의 회별 고리 던지기 기록을 ○로 나타냈어요. ○를 옮겨 고르게 하여 평균을 구해 보세요.", hints: ["1회의 ○를 2회로 옮겨 봐요.", "○는 모두 8개, 4회예요."],
      render: (b, a) => av6Level(b, a, { names: ["1회", "2회", "3회", "4회"], vals: [3, 1, 2, 2], unit: "개", item: "circle", max: 3, title: "은찬이의 회별 고리 던지기 기록",
        ask: [{ parts: ["은찬이의 고리 던지기 기록의 평균은 ", { n: 2 }, "개예요."] }], ok: "1회의 ○ 1개를 2회로 옮기면 모두 2개예요. 평균은 2개예요." }) },
    { name: "평균 구하기", inst: "2번. 어느 도서관의 5일 동안의 이용객 수예요. 이용객 수의 평균을 구해 보세요.", hints: ["148+150+146+152+154를 먼저 구해요.", "5일이니까 5로 나눠요."],
      render: av6WithCalc((b, a) => av6Ask(b, a, [{ fig: () => av6HTbl("도서관의 요일별 이용객 수", ["월", "화", "수", "목", "금"], [148, 150, 146, 152, 154], { h1: "요일", h2: "이용객 수(명)" }),
        parts: ["(148 + 150 + 146 + 152 + 154) ÷ 5 = ", { n: 750 }, " ÷ 5 = ", { n: 150, why: { "750": "5로 나누어야 해요." } }, "(명)"] }], { ok: "750÷5=150(명)이에요." })) },
    { name: "가능성 비교", inst: "3~4번. 주머니에서 구슬 한 개를 꺼낼 때 노란색 구슬이 나올 가능성이 높은 주머니부터 차례대로 누르고, 회전판과 결과 표를 알맞게 이어 보세요.", hints: ["노란색 구슬이 많을수록 가능성이 높아요.", "50회 중 빨간색에 37회 멈췄다면 빨간색이 가장 넓은 회전판이에요."],
      render: (b, a) => av6Chain(b, a, [
        { title: "3번", run: (bx, ax) => av6Rank(bx, ax, { items: [
          { t: "가", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_GREEN, n: 3 }, { c: AV6_YEL, n: 3 }] }], { cw: 150, H: 150, maxW: "7em" }) },
          { t: "나", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_GREEN, n: 6 }] }], { cw: 150, H: 150, maxW: "7em" }) },
          { t: "다", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_GREEN, n: 5 }, { c: AV6_YEL, n: 1 }] }], { cw: 150, H: 150, maxW: "7em" }) },
          { t: "라", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_GREEN, n: 1 }, { c: AV6_YEL, n: 5 }] }], { cw: 150, H: 150, maxW: "7em" }) },
          { t: "마", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_YEL, n: 6 }] }], { cw: 150, H: 150, maxW: "7em" }) }],
          order: [4, 3, 0, 2, 1], ok: "마(확실하다), 라(~일 것 같다), 가(반반이다), 다(~아닐 것 같다), 나(불가능하다) 차례예요." }) },
        { title: "4번", run: (bx, ax) => av6Ask(bx, ax, [{ fig: () => av6SpinFig(AV6_SP10, { cw: 130, r: 46 }),
          parts: ["표 ① 빨 16회, 노 17회, 파 17회 → ", { o: ["㉠", "㉡", "㉢"], a: 1 }, h("br"), "표 ② 빨 13회, 노 12회, 파 25회 → ", { o: ["㉠", "㉡", "㉢"], a: 2 }, h("br"), "표 ③ 빨 37회, 노 7회, 파 6회 → ", { o: ["㉠", "㉡", "㉢"], a: 0 }] }],
          { ok: "세 색이 비슷한 표 ①은 ㉡, 파란색이 절반쯤인 표 ②는 ㉢, 빨간색이 가장 많은 표 ③은 ㉠이에요." }) }]) },
    { name: "말과 수·평균 활용", inst: "5~6번 문제를 풀어 보세요.", hints: ["1부터 8까지의 짝수는 2, 4, 6, 8로 4장이에요.", "통 한 개의 평균 × 통의 수 = 전체 종이학 수"],
      render: (b, a) => av6Ask(b, a, [
        { q: "5. 1부터 8까지의 수 카드 8장이 든 상자에서 카드 한 장을 꺼내요.", parts: ["짝수일 가능성을 말로: ", { o: AV6_W3, a: 1 }, h("br"), "9 이상일 가능성을 수로: ", { o: AV6_N3, a: 0 }] },
        { q: "6. 예린: “나는 통 8개에 종이학을 접어서 넣었어. 통 한 개에 평균 65마리가 들어 있어.” 윤호: “나는 통 6개에 종이학을 접어서 넣었어. 통 한 개에 평균 90마리가 들어 있어.” 종이학을 더 많이 접은 사람은?",
          parts: ["예린: 65 × 8 = ", { n: 520 }, "(마리), 윤호: 90 × 6 = ", { n: 540 }, "(마리) → 더 많이 접은 사람은 ", { o: ["예린", "윤호"], a: 1, why: { "0": "통의 수는 예린이가 많지만 전체 종이학 수를 구해 비교해요." } }] }],
        { ok: "짝수는 반반이다, 9 이상은 0이에요. 예린 520마리, 윤호 540마리라서 윤호가 더 많이 접었어요." }) },
    { name: "확인하고 정리해요", inst: "확인하고 정리해요(자기주도4). 단원에서 배운 내용을 정리해 보세요.", hints: ["(평균)=(자룟값을 모두 더한 수)÷(자료의 수)", "주사위 눈 1~6 중 2 이상은 5가지, 5보다 큰 것은 6 한 가지예요."],
      render: (b, a) => av6Chain(b, a, [
        (bx, ax) => av6Ask(bx, ax, [
          { parts: ["평균은 자룟값을 모두 더한 수를 ", { o: ["자료의 수", "가장 큰 자룟값"], a: 0 }, "로 나눈 값이에요."] },
          { q: "자료 20, 18, 25의 평균", parts: ["(평균) = (20 + 18 + 25) ÷ 3 = ", { n: 63 }, " ÷ 3 = ", { n: 21 }] }], { ok: "(20+18+25)÷3 = 63÷3 = 21이에요." }),
        (bx, ax) => { bx.append(h("p", { class: "inst" }, "주사위 한 개를 던졌을 때 나온 눈의 수가 … 가능성을 가능성 띠에 놓아 보세요."));
          av6Scale(bx, ax, { nums: true, cards: [
            { t: "0일 가능성", a: 0 }, { t: "5보다 클 가능성", a: 1, why: { "0": "5보다 큰 눈 6이 있어요. 6가지 중 1가지예요." } }, { t: "홀수일 가능성", a: 2 }, { t: "2 이상일 가능성", a: 3, why: { "4": "1이 나오면 2 이상이 아니에요. 6가지 중 5가지예요." } }, { t: "6 이하일 가능성", a: 4 }],
            ok: "0은 불가능하다(0), 5보다 큰 것은 ~아닐 것 같다, 홀수는 반반이다([1/2]), 2 이상은 ~일 것 같다, 6 이하는 확실하다(1)예요." }); }]) }
  ],
  challenge: { inst: "평균을 이용하는 놀이 문제예요. 그리고 이 단원에서 기억에 남는 내용을 정리해 보세요.", hints: ["4명의 평균이 6이 되려면 네 수의 합은 6×4=24예요.", "24에서 이미 뽑은 세 수의 합을 빼요."],
    render: (b, a) => av6Chain(b, a, [
      (bx, ax) => av6Ask(bx, ax, [{ q: "모둠원 3명이 1~9 수 카드 중 3, 7, 5를 뽑았어요. 남은 카드에서 한 장을 더 가져와 4장의 평균을 선생님이 말한 6에 가장 가깝게 하려면 어떤 카드를 가져와야 할까요?", parts: [{ n: 9, why: { "6": "평균이 6이 되려면 네 수의 합이 24여야 해요. 3+7+5=15이니까 24−15를 계산해요." } }, " 카드를 가져오면 평균이 정확히 6이에요."] }], { ok: "6×4=24, 24−(3+7+5)=9예요. 9를 가져오면 평균이 6이에요." }),
      (bx, ax) => writeStep(bx, ax, [
        { q: "이 단원에서 기억에 남는 내용을 나만의 방법(글, 그림, 기호 등)으로 정리해 써 보세요.", tag: "기억에 남는 내용", ph: "예) 평균은 자료를 고르게 한 값이에요. 쌓기나무를 옮겨 고르게 하거나, 모두 더해 자료의 수로 나누면 구할 수 있어요." },
        { q: "생활에서 평균이나 가능성을 써 보고 싶은 곳을 써 보세요.", tag: "생활에 쓰기", ph: "예) 일주일 동안 읽은 책 쪽수의 평균을 구해 보고 싶어요." }])]) }
}
];
