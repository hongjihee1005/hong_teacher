//@@APP
const APP={title:"우리 반 학급 운동회 준비", unit:"5-2 수학 6. 평균과 가능성", key:"s52-avg-v1", welcome:"우리 반 학급 운동회 준비에 온 것을 환영해요", intro:"한별초등학교 5학년 3반이 학급 운동회를 준비해요. 모둠마다 다른 기록을 고르게 하여 대표 기록을 정하고, 사람 수가 다른 청팀과 백팀을 평균으로 비교하고, 팀 평균으로 빠진 기록을 알아내요. 경품 뽑기와 회전판 게임에서 당첨될 가능성을 말과 0·1/2·1로 나타내고, 동전·주사위 실험 부스에서 여러 번 던져 봐요."};
//@@UNIT
/* =========================================================
   5-2 수학 6. 평균과 가능성 — 이야기 버전 단원 조작 부품 (앞글자 av6, 이야기 전용 av6s)
   교과서 버전(u6-avg.tb.js)의 av6 부품을 복사해 쓰고, '확인하기' 단추 없이 autoRun으로 저절로 확인해요.
   기다리는 시간: 입력칸 900ms(Enter는 blur) · 보기 고르기 260ms · 끌기·색칠·카드 놓기 1200ms(손을 뗀 뒤).
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
   av6sField 학급 운동회 준비 운동장 둘러보기   av6Near·av6Secret  운동회 기록왕 놀이
   av6Calc   화면 계산기(계산기를 써도 되는 계단)
   엔진의 hj-multi(한 계단 여러 활동 세기)가 이 부품들을 활동으로 셀 수 있게, 부품마다 'api.done(' 길을 주석으로 적어 두었어요.
   (부품 → av6Finish → api.done( 또는 av6Ask → api.done( )
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
function av6Ask(body, api, items, opts = {}) {
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
  const filled = s => s.pt.o ? (s.pt.multi ? s.v.size === s.pt.a.length : s.v != null) : s.inp.value.trim() !== "";
  const check = () => {
    api.tryOnce(); const ans = all.map(val).join(" / ");
    all.forEach(s => {
      if (s.pt.o) { [...s.slot.children].forEach((b, i) => { b.classList.remove("good", "bad"); const picked = s.pt.multi ? s.v.has(i) : s.v === i; if (picked) b.classList.add(good(s) ? "good" : "bad"); }); }
      else s.inp.style.borderColor = good(s) ? "var(--ok)" : "var(--no)";
    });
    const bad = all.find(s => !good(s));
    if (!bad) { all.forEach(s => { if (s.inp) s.inp.readOnly = true; }); api.done(ans, opts.ok); return true; }
    const key = bad.pt.o ? (bad.pt.multi ? [...bad.v].sort().join(",") : String(bad.v)) : String(av6Num(bad.inp.value));
    api.fail((bad.pt.why && bad.pt.why[key]) || opts.bad || "빨간 칸을 다시 살펴봐요.", ans);
    return false;
  };
  const hasIn = all.some(s => !s.pt.o);
  const kick = autoRun(() => all.every(filled), () => all.map(val).join("\u0001") + "|" + all.map(s => s.v instanceof Set ? [...s.v].sort().join(",") : "").join(";"), check, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  wrap.addEventListener("click", e => { if (e.target.closest(".opt")) later(hasIn ? 600 : 260); });
  all.forEach(s => { if (!s.inp) return;
    s.inp.addEventListener("input", e => { s.inp.style.borderColor = ""; if (!e.isComposing) later(900); });
    s.inp.addEventListener("change", () => later(200));
    s.inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); s.inp.blur(); } }); });
  body.append(wrap);
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
  /* 다 하면 av6Finish → (물음이 있으면 av6Ask →) api.done( 으로 계단을 통과해요. */
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
  /* 다 하면 av6Finish → (물음이 있으면 av6Ask →) api.done( 으로 계단을 통과해요. */
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
    if (Math.abs(ex - de) < 1e-9) { fin = true; draw(); av6Finish(body, api, opt, `평균 ${av6Fmt(L)}${unit}`, opt.msg || `넘치는 양과 모자란 양이 ${av6Fmt(ex)}${unit}로 같아요. 넘치는 것을 모자란 곳에 채우면 모두 ${av6Fmt(L)}${unit}로 고르게 돼요.`, { L }); }
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
  /* 다 하면 av6Finish → (물음이 있으면 av6Ask →) api.done( 으로 계단을 통과해요. */
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
  /* 다 하면 av6Finish → (물음이 있으면 av6Ask →) api.done( 으로 계단을 통과해요. */
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
  /* 다 하면 av6Finish → (물음이 있으면 av6Ask →) api.done( 으로 계단을 통과해요. */
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
  /* 다 하면 av6Finish → (물음이 있으면 av6Ask →) api.done( 으로 계단을 통과해요. */
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
  /* 모든 칸을 칠하고 1.2초 뒤에 저절로 확인 → api.done( */
  const fill = Array(k).fill(null); let pen = 0, fin = false;
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = "20em";
  const els = [];
  for (let j = 0; j < k; j++) {
    const a0 = -90 + j * 360 / k, a1 = a0 + 360 / k, p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)], A = p(a0), B = p(a1);
    const e = svgEl("path", { d: `M${cx} ${cy} L${av6R(A[0])} ${av6R(A[1])} A${r} ${r} 0 0 1 ${av6R(B[0])} ${av6R(B[1])} Z`, fill: "#fff", stroke: AV6.ink, "stroke-width": 2, style: "cursor:pointer" });
    e.addEventListener("click", () => { if (fin) return; fill[j] = pen; e.setAttribute("fill", opt.colors[pen].c); kick(); });
    els.push(e); svg.append(e);
  }
  svg.append(svgEl("circle", { cx, cy, r: 6, fill: "#fff", stroke: AV6.ink, "stroke-width": 2 }));
  const pal = h("div", { class: "av6tools" }, h("span", { class: "jua" }, "색 고르기: "), ...opt.colors.map((c, i) => h("button", { class: i === 0 ? "av6on" : "", style: `border-color:${c.c}`, onclick: e => { pen = i; [...pal.querySelectorAll("button")].forEach(b => b.classList.toggle("av6on", b === e.currentTarget)); } }, h("span", { style: `display:inline-block;width:.9em;height:.9em;border-radius:50%;background:${c.c};vertical-align:middle;margin-right:.3em` }), c.t)));
  api.provide({ words: opt.words || [], answers: opt.answer ? [opt.answer] : [] });
  const run = () => {
    api.tryOnce();
    const cnt = opt.colors.map((_, i) => fill.filter(v => v === i).length), msg = opt.rule(cnt), ans = opt.colors.map((c, i) => `${c.t} ${cnt[i]}칸`).join(", ");
    if (msg) { api.fail(msg, ans); return false; }
    fin = true; api.done(ans, opt.ok); return true;
  };
  const kick = autoRun(() => fill.every(v => v != null), () => fill.join(","), run, 1200);
  body.append(pal, svg, h("p", { class: "av6small" }, "모든 칸을 칠하면 저절로 확인해요. 고치고 싶으면 다른 색으로 다시 칠해요."));
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
  let fin = false;
  const put = (i, j) => { if (fin) return; place[i] = j; lists[j].append(cards[i]); cards[i].classList.remove("av6on", "av6good", "av6bad"); sel = null; cards.forEach(c => c.classList.remove("av6on")); kick(); };
  /* 카드를 모두 놓고 1.2초 뒤에 저절로 확인 → api.done( */
  const run = () => {
    api.tryOnce();
    let bad = -1;
    opt.cards.forEach((c, i) => { const ok = place[i] === c.a; cards[i].classList.toggle("av6good", ok); cards[i].classList.toggle("av6bad", !ok); if (!ok && bad < 0) bad = i; });
    const ans = opt.cards.map((c, i) => `${av6Plain(c.t)}→${av6Plain(heads[place[i]])}`).join(" / ");
    if (bad < 0) { fin = true; api.done(ans, opt.ok); return true; }
    const c = opt.cards[bad];
    api.fail((c.why && c.why[String(place[bad])]) || c.hint || "빨간 카드를 다시 생각해 봐요.", ans);
    return false;
  };
  const kick = autoRun(() => place.every(p => p >= 0), () => place.join(","), run, 1200);
  api.provide({ words: heads.map(av6Plain), answers: opt.cards.map(c => `${av6Plain(c.t)} → ${av6Plain(heads[c.a])}`) });
  body.append(h("p", { class: "av6small" }, "카드를 끌어 알맞은 칸에 놓아요. (카드를 누른 뒤 칸을 눌러도 돼요)"), pool,
    h("div", { class: "av6arrow" }), h("div", { class: "av6small", style: "display:flex;justify-content:space-between;margin:0 .3em .2em" }, h("span", {}, "가능성이 낮아요"), h("span", {}, "가능성이 높아요")), bins,
    h("p", { class: "av6small" }, "카드를 모두 놓으면 저절로 확인해요."));
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
  /* 다 하면 av6Finish → (물음이 있으면 av6Ask →) api.done( 으로 계단을 통과해요. */
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
    if (!fin && res.length >= need) { fin = true; av6Finish(body, api, opt, `${res.length}번: ${G[0]} ${cntA()}, ${G[1]} ${res.length - cntA()}`, opt.msg || `${need}번 던지기를 마쳤어요.`, { a: rows[ms.length - 1] ? rows[ms.length - 1][0] : cntA(), b: rows[ms.length - 1] ? rows[ms.length - 1][1] : res.length - cntA(), n: res.length }); }
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
  /* 막대를 모두 그리고 손을 떼면 1.2초 뒤에 저절로 확인 → api.done( */
  let fin = false;
  const run = () => {
    api.tryOnce(); const bad = cur.findIndex((v, i) => v !== opt.vals[i]), ans = names.map((nm, i) => `${nm} ${cur[i]}`).join(", ");
    if (bad < 0) { fin = true; api.done(ans, opt.ok); return true; }
    api.fail(`${names[bad]}의 막대를 다시 보세요. ${opt.vals[bad]}${opt.unit}${st > 1 ? `는 눈금 ${opt.vals[bad] / st}칸이에요` : "만큼 그려야 해요"}.`, ans);
    return false;
  };
  const kick = autoRun(() => col < 0 && cur.every(v => v > 0), () => cur.join(","), run, 1200);
  dragOn(svg, p => { if (fin) return false; const i = Math.floor((p.x - padL) / cw); if (i < 0 || i >= n) return false; col = i; set(p); return true; }, set, () => { col = -1; kick(); });
  api.provide({ words: ["눈금 한 칸", "막대의 길이"], answers: [names.map((nm, i) => `${nm} ${opt.vals[i]}`).join(", ")] });
  body.append(av6HTbl(opt.cap, names, opt.vals.map(String), { h1: opt.catAxis || "항목", h2: `${opt.valAxis || "수"}(${opt.unit})` }), svg,
    h("p", { class: "av6small" }, `막대를 위아래로 끌어 그려요. 세로 눈금 한 칸은 ${st}${opt.unit}예요.`),
    h("p", { class: "av6small" }, "막대를 모두 그리면 저절로 확인해요."));
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
   12. 학급 운동회 준비 운동장 — 곳곳을 눌러 어떤 준비를 하는지 살펴봐요
   여섯 곳을 모두 누르면 av6Finish → api.done(
   ========================================================= */
const AV6S_SPOTS = [
  { k: "rope", t: "줄넘기 기록판", x: 110, y: 118, say: "모둠마다 줄넘기 기록이 달라요. 모둠을 대표하는 기록은 몇 번이라고 하면 좋을까요?", tag: "평균" },
  { k: "team", t: "팀 나누기 게시판", x: 320, y: 118, say: "청팀은 3명, 백팀은 5명이 공 넣기 예선을 했어요. 사람 수가 다른 두 팀은 어떻게 비교할까요?", tag: "평균" },
  { k: "relay", t: "이어달리기 기록표", x: 530, y: 118, say: "한 친구의 기록이 빠졌어요. 팀 기록의 평균을 알면 빠진 기록을 알아낼 수 있을까요?", tag: "평균" },
  { k: "prize", t: "경품 뽑기 상자", x: 110, y: 268, say: "상자마다 당첨 카드가 다르게 들어 있어요. 당첨될 가능성은 어느 정도일까요?", tag: "가능성" },
  { k: "spin", t: "회전판 게임", x: 320, y: 268, say: "회전판마다 당첨 칸의 넓이가 달라요. 어느 회전판이 당첨되기 쉬울까요?", tag: "가능성" },
  { k: "coin", t: "동전·주사위 실험 부스", x: 530, y: 268, say: "동전을 여러 번 던지면 그림면과 숫자 면이 꼭 반반씩 나올까요?", tag: "가능성" }];
function av6sField(body, api, opt) {
  /* 여섯 곳을 모두 누르면 av6Finish → api.done( 으로 계단을 통과해요. */
  const W = 640, H = 360, seen = new Set();
  const svg = makeSvg(W, H); svg.setAttribute("class", "av6fig"); svg.style.maxWidth = "38em";
  svg.append(svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "#E5F2DA" }));
  svg.append(svgEl("rect", { x: 30, y: 58, width: W - 60, height: 290, rx: 140, fill: "none", stroke: "#E9B98F", "stroke-width": 14 }));
  svg.append(svgEl("rect", { x: 30, y: 58, width: W - 60, height: 290, rx: 140, fill: "none", stroke: "#fff", "stroke-width": 1.5, "stroke-dasharray": "10 8" }));
  svg.append(svgEl("rect", { x: 175, y: 10, width: 290, height: 34, rx: 6, fill: "#2B6FB8" }));
  svg.append(txt(320, 28, opt.banner || "5학년 3반 학급 운동회", 18, { fill: "#fff" }));
  const pic = {
    rope: (g, x, y) => { g.append(svgEl("rect", { x: x - 34, y: y - 30, width: 68, height: 50, rx: 4, fill: "#fff", stroke: AV6.ink })); [0, 1, 2].forEach(k => g.append(svgEl("line", { x1: x - 26, y1: y - 18 + k * 13, x2: x + 26, y2: y - 18 + k * 13, stroke: AV6.gray, "stroke-width": 2 }))); g.append(svgEl("path", { d: `M${x - 46} ${y + 18} q46 30 92 0`, fill: "none", stroke: AV6.red, "stroke-width": 3 })); },
    team: (g, x, y) => { g.append(svgEl("rect", { x: x - 40, y: y - 30, width: 38, height: 48, rx: 4, fill: "#5B9BD5" })); g.append(svgEl("rect", { x: x + 2, y: y - 30, width: 38, height: 48, rx: 4, fill: "#fff", stroke: AV6.ink })); g.append(txt(x - 21, y - 6, "청", 16, { fill: "#fff" })); g.append(txt(x + 21, y - 6, "백", 16)); },
    relay: (g, x, y) => { g.append(svgEl("rect", { x: x - 30, y: y - 30, width: 60, height: 50, rx: 4, fill: "#fff", stroke: AV6.ink })); g.append(txt(x, y - 12, "기록", 13)); g.append(txt(x, y + 8, "? 초", 15, { fill: AV6.red })); g.append(svgEl("rect", { x: x + 34, y: y - 4, width: 22, height: 8, rx: 4, fill: AV6.orange })); },
    prize: (g, x, y) => { [0, 1, 2].forEach(k => { g.append(svgEl("rect", { x: x - 50 + k * 34, y: y - 20, width: 30, height: 30, rx: 4, fill: "#FFF6E0", stroke: "#B9873E", "stroke-width": 2 })); g.append(txt(x - 35 + k * 34, y - 5, "가나다"[k], 13)); }); },
    spin: (g, x, y) => { av6DrawSpinner(g, x, y - 8, 28, [{ c: "#9C7BC7", f: .25 }, { c: "#BFE0F5", f: .75 }], 50); },
    coin: (g, x, y) => { g.append(svgEl("circle", { cx: x - 18, cy: y - 8, r: 18, fill: "#E9C46A", stroke: "#A27B1F", "stroke-width": 3 })); g.append(svgEl("rect", { x: x + 4, y: y - 26, width: 34, height: 34, rx: 6, fill: "#fff", stroke: AV6.ink, "stroke-width": 2 })); [[13, -17], [29, -1], [21, -9]].forEach(([dx, dy]) => g.append(svgEl("circle", { cx: x + dx, cy: y + dy, r: 3.5, fill: AV6.ink }))); }
  };
  AV6S_SPOTS.forEach((sp, i) => {
    const g = svgEl("g", { style: "cursor:pointer" });
    g.append(svgEl("rect", { x: sp.x - 92, y: sp.y - 52, width: 184, height: 112, rx: 12, fill: "#ffffffaa" }));
    pic[sp.k](g, sp.x, sp.y);
    g.append(txt(sp.x, sp.y + 44, sp.t, 14, { fill: AV6.ink }));
    const m = svgEl("circle", { cx: sp.x + 76, cy: sp.y - 38, r: 11, fill: AV6.gray }); const mt = txt(sp.x + 76, sp.y - 38, "?", 13, { fill: "#fff" });
    g.append(m, mt);
    g.addEventListener("click", () => { seen.add(i); m.setAttribute("fill", AV6.green); mt.textContent = "✓"; card.innerHTML = ""; card.append(h("b", {}, `${sp.t} — `), sp.say, h("br"), h("span", { class: "av6small" }, `→ ${sp.tag}과 관련 있어요.`)); check(); });
    svg.append(g);
  });
  const card = h("div", { class: "av6box" }, "운동장 곳곳(물음표)을 눌러 어떤 준비를 하고 있는지 살펴보세요.");
  let fin = false;
  const check = () => { if (!fin && seen.size === AV6S_SPOTS.length) { fin = true; av6Finish(body, api, opt, "여섯 곳을 모두 살펴봄", opt.msg || "운동회 준비 여섯 곳을 모두 살펴보았어요.", {}); } };
  api.provide({ words: AV6S_SPOTS.map(s => s.t), answers: [] });
  body.append(svg, card);
}

/* =========================================================
   13. 운동회 기록왕 놀이 — 우리 모둠 기록의 평균에 가장 가까운 사람 찾기
   기록 4개와 평균을 쓰면 저절로 확인 → 평균에 가장 가까운 사람을 누르면 api.done(
   ========================================================= */
function av6Near(body, api, opt) {
  const topics = opt.topics;
  let round = 0, fin = false;
  const host = h("div");
  const play = () => {
    host.innerHTML = "";
    const tsel = h("select", { "aria-label": "주제", style: "font-size:1em;max-width:100%" }, ...topics.map(t => h("option", { value: t.t }, `${t.t}(${t.u})`)));
    tsel.selectedIndex = round % topics.length;
    const nm = opt.names.map(x => h("input", { type: "text", value: x, "aria-label": "이름", style: "width:4.6em;max-width:100%" }));
    const rc = opt.names.map(() => h("input", { type: "text", inputmode: "decimal", "aria-label": "기록", style: "width:4.6em;max-width:100%" }));
    const avIn = h("input", { type: "text", inputmode: "decimal", "aria-label": "평균", style: "width:6em;font-size:1.1em;text-align:center" });
    const who = h("div", { class: "av6tools" });
    const out = h("div", { class: "av6box", style: "display:none" });
    let step = 0, avg = 0, recs = [];
    const unitOf = () => topics[tsel.selectedIndex].u;
    const checkAvg = () => {
      if (step !== 0) return true;
      api.tryOnce();
      recs = rc.map(x => av6Num(x.value));
      if (recs.some(v => !isFinite(v) || v < 0)) { api.fail("네 사람의 기록을 모두 수로 써 주세요.", "기록 빠짐"); return false; }
      avg = recs.reduce((a, b) => a + b, 0) / recs.length;
      if (Math.abs(av6Num(avIn.value) - avg) > 1e-9) { avIn.style.borderColor = "var(--no)"; api.fail(`네 기록을 모두 더한 수를 4로 나누어 보세요. (합계 ${av6Fmt(recs.reduce((a, b) => a + b, 0))})`, avIn.value); return false; }
      step = 1; avIn.style.borderColor = "var(--ok)"; [...rc, avIn, ...nm].forEach(x => { x.readOnly = true; }); tsel.disabled = true;
      api.hint(`○ 평균은 ${av6Fmt(avg)}${unitOf()}예요. 이제 평균에 가장 가까운 사람을 눌러요.`);
      who.innerHTML = ""; who.append(h("span", { class: "jua" }, "평균에 가장 가까운 사람: "), ...nm.map((x, i) => h("button", { onclick: () => pick(i) }, x.value || `${i + 1}번`)));
      return true;
    };
    const kick = autoRun(() => step === 0 && rc.every(x => x.value.trim() !== "") && avIn.value.trim() !== "", () => [...rc, avIn].map(x => x.value).join("|"), checkAvg, 0);
    let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
    [...rc, avIn].forEach(x => { x.addEventListener("input", e => { x.style.borderColor = ""; if (!e.isComposing) later(900); }); x.addEventListener("change", () => later(200));
      x.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); x.blur(); } }); });
    const pick = i => {
      if (step !== 1) return;
      const d = recs.map(v => Math.abs(v - avg)), best = Math.min(...d);
      if (Math.abs(d[i] - best) > 1e-9) return api.fail(`${nm[i].value}의 기록과 평균의 차이는 ${av6Fmt(d[i])}예요. 차이가 더 작은 사람이 있어요.`, nm[i].value);
      step = 2; out.style.display = "";
      out.innerHTML = ""; out.append(h("b", {}, `${tsel.value} 평균 ${av6Fmt(avg)}${unitOf()}`), h("br"),
        ...recs.map((v, k) => h("div", {}, `${nm[k].value}: ${av6Fmt(v)}${unitOf()} → 평균과 ${av6Fmt(d[k])}만큼 차이${Math.abs(d[k] - best) < 1e-9 ? " ★ 우리 모둠을 대표하는 친구" : ""}`)),
        h("div", { class: "av6tools" }, h("button", { onclick: () => { round++; play(); } }, "다른 주제로 한 판 더")));
      if (!fin) { fin = true; api.done(`${tsel.value}: 평균 ${av6Fmt(avg)}, 가장 가까운 사람 ${nm[i].value}`, opt.ok || "평균을 구하고 평균에 가장 가까운 친구를 찾았어요. 다른 주제로도 해 보세요."); }
    };
    host.append(h("div", { class: "av6tools" }, h("span", { class: "jua" }, "주제: "), tsel),
      h("div", { class: "av6tbl" }, h("table", {}, h("tr", {}, h("th", {}, "이름"), ...nm.map(x => h("td", {}, x))), h("tr", {}, h("th", {}, "기록"), ...rc.map(x => h("td", {}, x))))),
      h("p", { class: "sent" }, "우리 모둠 기록의 평균: ", avIn), h("p", { class: "av6small" }, "기록과 평균을 모두 쓰면 저절로 확인해요."), who, out);
  };
  api.provide({ words: ["(평균) = (기록을 모두 더한 수) ÷ 4", "평균과의 차이가 가장 작은 사람"], answers: [] });
  body.append(host); play();
}
/* 또 다른 놀이: 비밀 숫자 찾기 — 4개의 수와 5개 수의 평균을 보고 비밀 숫자를 찾아요(goal점 먼저 → api.done( ) */
function av6Secret(body, api, opt) {
  const goal = opt.goal || 3;
  let R = 20, score = 0, tries = 0, cur = null, fin = false;
  const nm = opt.names || ["가", "나", "다", "라"];
  const board = h("div"), sc = h("div", { class: "av6score" }), inp = h("input", { type: "text", inputmode: "numeric", "aria-label": "비밀 숫자", style: "width:5em;font-size:1.2em;text-align:center" });
  const rng = h("div", { class: "av6tools" }, h("span", { class: "jua" }, "고르는 수의 범위: "), ...[20, 30, 40, 50].map(v => h("button", { class: v === 20 ? "av6on" : "", onclick: e => { R = v; [...rng.querySelectorAll("button")].forEach(b => b.classList.toggle("av6on", b === e.currentTarget)); deal(); } }, `${v} 이하`)));
  const deal = () => {
    let a, s, cand;
    do { a = [0, 1, 2, 3].map(() => 1 + Math.floor(Math.random() * R)); s = a.reduce((x, y) => x + y, 0); cand = []; for (let x = 1; x <= R; x++) if ((s + x) % 5 === 0) cand.push(x); } while (!cand.length);
    const sec = cand[Math.floor(Math.random() * cand.length)];
    cur = { a, sec, avg: (s + sec) / 5 }; tries = 0; inp.value = ""; inp.style.borderColor = ""; inp.readOnly = false;
    board.innerHTML = "";
    board.append(av6Tbl(["", ...nm, opt.maker || "설계자"], [["고른 수", ...a.map(String), "?"]], { rowHead: true }),
      h("p", { class: "av6read" }, `${opt.maker || "설계자"}: “5개 수의 평균은 ${cur.avg}이에요. 비밀 숫자는 ${R} 이하의 수예요.”`));
  };
  const show = () => { sc.textContent = `점수 ${score}점 ${"★".repeat(score)}${"☆".repeat(Math.max(0, goal - score))}`; };
  const go = () => {
    if (!cur) return true; api.tryOnce(); tries++;
    const v = av6Num(inp.value);
    if (v === cur.sec) {
      score++; show(); inp.style.borderColor = "var(--ok)"; inp.readOnly = true;
      const msg = `○ 맞아요! ${cur.avg} × 5 = ${cur.avg * 5}, ${cur.avg * 5} − ${cur.a.reduce((x, y) => x + y, 0)} = ${cur.sec}`;
      cur = null;
      if (score >= goal && !fin) { fin = true; api.done(`비밀 숫자 놀이 ${goal}점`, `${goal}점을 모았어요! 평균 × 수의 개수로 전체 합을 구하면 모르는 수를 찾을 수 있어요.`); }
      else if (!fin) { api.hint(msg + " ‘한 판 더’를 눌러 계속해요."); }
      else api.hint(msg);
      return false;
    }
    inp.style.borderColor = "var(--no)";
    api.fail(tries >= 2 ? `5개 수의 합계는 평균 × 5 = ${cur.avg * 5}이에요. 여기에서 네 수의 합을 빼 보세요.` : "평균에 수의 개수 5를 곱하면 다섯 수의 합계가 돼요.", inp.value);
    return false;
  };
  const kick = autoRun(() => !!cur && inp.value.trim() !== "", () => (cur ? cur.a.join(",") + "#" + cur.sec : "-") + "|" + inp.value, go, 0);
  let tm = null; const later = w => { clearTimeout(tm); tm = setTimeout(kick, w); };
  inp.addEventListener("input", e => { inp.style.borderColor = ""; if (!e.isComposing) later(900); });
  inp.addEventListener("change", () => later(200));
  inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); inp.blur(); } });
  api.provide({ words: ["(평균) × 5 = 합계", "합계 − 네 수의 합 = 비밀 숫자"], answers: [] });
  body.append(rng, board, h("p", { class: "sent" }, "비밀 숫자: ", inp), h("p", { class: "av6small" }, "수를 쓰면 저절로 확인해요."), h("div", { class: "av6tools" }, h("button", { onclick: deal }, "한 판 더"), sc));
  deal(); show();
}

/* ---------- 이야기 버전 그림: 운동회 준비 회의 칠판 ---------- */
function av6sBoardFig() {
  const rows = ["① 모둠 줄넘기 기록으로 모둠 대표 기록 정하기", "② 사람 수가 다른 청팀·백팀 기록 비교하기", "③ 빠진 이어달리기 기록 알아내기", "④ 경품 뽑기 상자와 회전판 게임 만들기", "⑤ 동전·주사위 실험 부스 열기"];
  return av6Fig(600, 250, s => {
    s.append(svgEl("rect", { x: 10, y: 10, width: 580, height: 230, rx: 12, fill: "#2F5D4E", stroke: "#8A5A2B", "stroke-width": 10 }));
    s.append(txt(300, 42, "학급 운동회 준비 회의", 20, { fill: "#FFF6C8" }));
    rows.forEach((t, i) => s.append(txt(46, 80 + i * 32, t, 16, { fill: "#fff", "text-anchor": "start" })));
    s.append(svgEl("circle", { cx: 548, cy: 70, r: 16, fill: "#5B9BD5" })); s.append(txt(548, 70, "청", 13, { fill: "#fff" }));
    s.append(svgEl("circle", { cx: 548, cy: 108, r: 16, fill: "#fff" })); s.append(txt(548, 108, "백", 13, { fill: AV6.ink }));
  }, "34em");
}
//@@LESSONS
const UNIT_STORY = { title: "우리 반 학급 운동회 준비", lines: [
  "한별초등학교 5학년 3반이 학급 운동회를 열기로 했어요. 준비 위원장 서준, 기록 담당 하윤, 진행 담당 민재, 질문 대장 예나가 친구들과 함께 운동회를 준비해요.",
  "모둠마다 다른 줄넘기 기록을 고르게 하여 대표 기록을 정하고, 사람 수가 다른 청팀과 백팀을 평균으로 비교하고, 팀 평균으로 빠진 기록을 알아내요.",
  "경품 뽑기 상자와 회전판 게임에서 당첨될 가능성을 말과 0·[1/2]·1로 나타내고, 동전·주사위 실험 부스에서 여러 번 던져 보며 운동회 준비 보고회까지 마쳐요."],
  one: "우리 반 학급 운동회 준비 · 기록을 고르게 하여 평균을 구하고, 경품 뽑기와 회전판 게임에서 일이 일어날 가능성을 말과 수로 나타내요." };
const UNIT_KEYWORDS = ["자룟값", "고르게 하기", "평균", "(평균)=(자룟값을 모두 더한 수)÷(자료의 수)", "자료의 수", "가능성", "불가능하다", "~아닐 것 같다", "반반이다", "~일 것 같다", "확실하다", "0", "1/2", "1"];

/* ---- 자주 쓰는 자료 ---- */
const AV6_GREEN = "#5DB66A", AV6_YEL = "#F2CC3B", AV6_RED = "#E25C4B", AV6_BLUE = "#4E8FD9", AV6_ORG = "#F08C2E", AV6_WIN = "#9C7BC7", AV6_LOSE = "#BFE0F5";
const AV6_W3 = ["불가능하다", "반반이다", "확실하다"];
const AV6_N3 = ["0", "[1/2]", "1"];
const AV6S_KIDS = ["서준", "하윤", "민재", "예나"];
/* 6차시 회전판 게임 가~마: 화살이 당첨(보라)에 멈출 가능성 */
const AV6S_SP6 = [
  { name: "가", secs: [{ c: AV6_WIN, f: .75, t: "당첨", k: "당첨" }, { c: AV6_LOSE, f: .25, t: "꽝", k: "꽝" }] },
  { name: "나", secs: [{ c: AV6_LOSE, f: 1, t: "꽝", k: "꽝" }] },
  { name: "다", secs: [{ c: AV6_WIN, f: 1, t: "당첨", k: "당첨" }] },
  { name: "라", secs: [{ c: AV6_WIN, f: .5, t: "당첨", k: "당첨" }, { c: AV6_LOSE, f: .5, t: "꽝", k: "꽝" }] },
  { name: "마", secs: [{ c: AV6_WIN, f: .25, t: "당첨", k: "당첨" }, { c: AV6_LOSE, f: .75, t: "꽝", k: "꽝" }] }];
/* 7차시 회전판 가·나·다: 화살이 빨간색에 멈출 가능성 */
const AV6S_SP7 = [
  { name: "가", secs: [{ c: AV6_RED, f: .5, t: "빨간색", k: "빨" }, { c: AV6_YEL, f: .5, t: "노란색", k: "노" }] },
  { name: "나", secs: [{ c: AV6_RED, f: 1, t: "빨간색", k: "빨" }] },
  { name: "다", secs: [{ c: AV6_YEL, f: 1, t: "노란색", k: "노" }] }];
/* 10차시 회전판 ㉠·㉡·㉢(빨강·노랑·파랑) */
const AV6S_SP10 = [
  { name: "㉠", secs: [{ c: AV6_RED, f: 1 / 3, t: "빨" }, { c: AV6_YEL, f: 1 / 3, t: "노" }, { c: AV6_BLUE, f: 1 / 3, t: "파" }] },
  { name: "㉡", secs: [{ c: AV6_BLUE, f: .5, t: "파" }, { c: AV6_RED, f: .25, t: "빨" }, { c: AV6_YEL, f: .25, t: "노" }] },
  { name: "㉢", secs: [{ c: AV6_RED, f: .75, t: "빨" }, { c: AV6_YEL, f: .125, t: "노" }, { c: AV6_BLUE, f: .125, t: "파" }] }];
/* 9차시 운동회 기록왕 놀이: 네 친구의 기록(평균과 가장 가까운 사람은 아래 점검에서 다시 계산) */
const AV6S_T9 = [
  { t: "공 멀리 던지기", u: "m", recs: [21, 17, 24, 18], avg: 20, near: 0 },
  { t: "30초 줄넘기", u: "회", recs: [50, 62, 47, 57], avg: 54, near: 3 },
  { t: "제자리멀리뛰기", u: "cm", recs: [139.4, 146.8, 152.1, 141.3], avg: 144.9, near: 1 },
  { t: "왕복 오래달리기", u: "회", recs: [44, 58, 51, 53], avg: 51.5, near: 2 }];
(function av6sSelfCheck() {   // 자료가 바뀌어도 평균·가장 가까운 사람이 맞는지 확인
  AV6S_T9.forEach(t => {
    const m = Math.round(t.recs.reduce((a, b) => a + b, 0) / t.recs.length * 1000) / 1000, d = t.recs.map(v => Math.abs(v - m)), best = Math.min(...d);
    if (Math.abs(m - t.avg) > 1e-9) throw new Error(`${t.t} 평균이 ${m}이에요`);
    if (d.filter(x => Math.abs(x - best) < 1e-9).length !== 1 || Math.abs(d[t.near] - best) > 1e-9) throw new Error(`${t.t} 가장 가까운 사람이 하나가 아니에요`);
  });
})();
const LESSONS = [
{
  id: "s1", no: 1, title: "학급 운동회 준비 회의", soop: "개념 찾기(S)",
  question: "학급 운동회를 준비하면서 평균과 가능성이 필요한 곳은 어디일까요?",
  summary: "5학년 3반은 학급 운동회를 준비해요. 모둠 기록을 대표하는 값을 정하거나 사람 수가 다른 팀을 비교할 때는 평균이, 경품 뽑기나 회전판 게임에서 당첨될 정도를 말할 때는 가능성이 필요해요. 이 단원에서는 자료를 고르게 하여 평균을 구하고, 일이 일어날 가능성을 말과 수로 나타내 봐요.",
  steps: [
    { name: "만져 보기 — 보기·생각하기·궁금해하기", inst: "한별초등학교 5학년 3반이 학급 운동회를 열기로 했어요. 준비 위원장 서준이가 칠판에 준비할 일을 적었어요. 칠판을 보고 떠오르는 것을 세 칸에 써서 붙여요.", hints: ["모둠 기록, 청팀·백팀, 경품 뽑기, 회전판, 동전·주사위가 보여요.", "기록을 하나의 수로 나타내거나, 당첨될지 미리 생각해 보려면 무엇이 필요할지 떠올려 봐요."],
      render: (b, a) => { b.append(av6sBoardFig()); panes(b, a, [
        { t: "보여요", e: "👀", ph: "칠판에 ~이 보여요", hint: "칠판에 적힌 준비할 일", ex: ["모둠 줄넘기 기록으로 모둠 대표 기록을 정한다고 적혀 있어요.", "경품 뽑기 상자와 회전판 게임을 만든다고 적혀 있어요."] },
        { t: "생각해요", e: "💭", ph: "~하려면 ~을 알아야 해요", hint: "평균이나 가능성이 필요한 까닭", ex: ["청팀과 백팀의 사람 수가 다르면 기록을 그냥 더해서 비교하면 안 될 것 같아요.", "회전판의 당첨 칸이 넓을수록 당첨되기 쉬울 것 같아요."] },
        { t: "궁금해요", e: "❓", ph: "~은 어떻게 정할까?", hint: "평균과 가능성에 대해 궁금한 것", ex: ["기록이 모두 다른데 모둠을 대표하는 기록은 어떻게 정할까?", "경품에 당첨될 가능성을 수로 나타낼 수 있을까?"] }],
        { ok: "운동회 준비 곳곳에 평균과 가능성이 숨어 있어요! 이 단원에서 하나씩 해결해 봐요." }); } },
    { name: "그려 보기 — 운동장 둘러보기", inst: "운동회 전날, 운동장 곳곳에서 준비가 한창이에요. 물음표가 있는 여섯 곳을 모두 눌러 무엇을 알아봐야 하는지 살펴보세요.", hints: ["물음표가 있는 여섯 곳을 모두 눌러요.", "위쪽 세 곳은 평균, 아래쪽 세 곳은 가능성과 관련 있어요."],
      render: (b, a) => av6sField(b, a, { ok: "기록판·팀 나누기·이어달리기에서는 평균을, 경품 뽑기·회전판 게임·실험 부스에서는 가능성을 알아볼 거예요." }) },
    { name: "말해 보기 — 평균일까, 가능성일까", inst: "기록 담당 하윤이가 준비할 일을 적었어요. 각 일이 평균과 가능성 중 무엇과 관련 있는지 골라 보세요.", hints: ["여러 기록을 대표하는 값을 구하는 일은 평균이에요.", "어떤 일이 일어나길 기대할 수 있는 정도는 가능성이에요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "우리 모둠 줄넘기 기록을 대표하는 값 정하기", o: ["평균", "가능성"], a: 0, why: { "1": "여러 기록을 하나의 수로 대표하는 일이에요." } },
        { q: "동전을 던져 청팀이 먼저 할 정도 알아보기", o: ["평균", "가능성"], a: 1, why: { "0": "동전을 던질 때 어떤 면이 나오길 기대할 수 있는 정도를 알아보는 일이에요." } },
        { q: "청팀과 백팀의 공 넣기 기록 비교하기", o: ["평균", "가능성"], a: 0, why: { "1": "팀마다 기록을 대표하는 값을 구해 비교하는 일이에요." } },
        { q: "경품 뽑기에서 당첨 카드가 나올 정도 알아보기", o: ["평균", "가능성"], a: 1, why: { "0": "당첨 카드가 나오길 기대할 수 있는 정도를 알아보는 일이에요." } }],
        { ok: "기록을 대표하거나 비교하는 일은 평균, 무엇이 나올지 기대하는 정도는 가능성과 관련 있어요." }),
        { q: "경품 뽑기에서 당첨 카드가 나올 정도가 평균이 아니라 가능성과 관련 있는 까닭을 써 볼까요?", ph: "경품 뽑기는 ~", help: ["① 경품 뽑기를 할 때 결과를 미리 알 수 있는지 떠올려요. → ② 평균과 가능성의 뜻과 견주어 써요.", "‘경품 뽑기는 무엇이 나올지 ~하므로, 당첨 카드가 나오길 ~하는 정도인 가능성과 관련 있어요.’ 꼴로 써요."], ans: "경품 뽑기는 무엇이 나올지 미리 알 수 없으므로, 당첨 카드가 나오길 기대할 수 있는 정도인 가능성과 관련 있어요." }) },
    { name: "약속하기 — 4학년 때 배운 그래프", inst: "진행 담당 민재가 4학년 때 배운 막대그래프와 꺾은선그래프를 떠올리며 운동회 자료를 정리해요.", hints: ["막대의 길이는 표의 수만큼, 세로 눈금 한 칸은 1명이에요.", "꺾은선그래프에서 선이 가장 많이 기울어진 곳이 가장 많이 변한 곳이에요."],
      render: (b, a) => av6Chain(b, a, [
        { title: "① 표를 보고 막대그래프로 나타내기", run: (bx, ax) => av6Bars(bx, ax, { cap: "운동회에서 하고 싶은 경기", title: "하고 싶은 경기별 학생 수", names: ["이어달리기", "줄다리기", "공 넣기", "2인 3각"], vals: [9, 6, 4, 7], unit: "명", max: 10, catAxis: "경기", valAxis: "학생 수", ok: "표의 수만큼 막대를 알맞게 그렸어요." }) },
        { title: "② 꺾은선그래프 읽기", run: (bx, ax) => av6Ask(bx, ax, [
          { fig: () => av6LineFig({ title: "운동회 날 운동장의 기온", names: ["9시", "10시", "11시", "12시", "1시"], vals: [11, 13, 16, 18, 19], lo: 10, hi: 20, gs: 2, unit: "℃" }),
            parts: ["11시의 운동장 기온은 ", { n: 16, why: { "15": "11시의 점은 16℃ 눈금 위에 있어요." } }, "℃예요. 기온이 가장 많이 오른 때는 ", { o: ["9시와 10시 사이", "10시와 11시 사이", "11시와 12시 사이", "12시와 1시 사이"], a: 1, why: { "0": "9시와 10시 사이에는 2℃ 올랐어요. 선이 가장 많이 기울어진 곳을 찾아요.", "2": "11시와 12시 사이에는 2℃ 올랐어요.", "3": "12시와 1시 사이에는 1℃ 올랐어요." } }, "예요."] }],
          { ok: "11시에는 16℃이고, 10시와 11시 사이에 3℃로 가장 많이 올랐어요." }) }]) },
    { name: "확인하기 — 무엇을 배울까요", inst: "이 단원에서 배울 내용이에요. 배우는 순서대로 눌러 보세요.", hints: ["평균의 뜻을 알아야 평균을 구하고 활용할 수 있어요.", "가능성은 말로 표현하기 → 비교하기 → 수로 나타내기 순서예요."],
      render: (b, a) => sequence(b, a, ["일이 일어날 가능성을 수로 나타내기", "자료를 고르게 하여 평균의 뜻 알기", "일이 일어날 가능성을 말로 표현하기", "평균을 이용하여 문제 해결하기", "평균을 구하는 방법 알기", "일이 일어날 가능성을 비교하기"], [1, 4, 3, 2, 5, 0],
        { ok: "평균의 뜻 → 평균 구하기 → 평균 활용 → 가능성을 말로 → 비교하기 → 수로 나타내기 순서로 운동회를 준비해요." }) }
  ],
  challenge: { inst: "운동회를 도와줄 학년별 도우미 수를 막대그래프로 나타내 보세요. 이번에는 세로 눈금 한 칸이 2명이에요.", hints: ["16명은 눈금 8칸이에요.", "세로 눈금 한 칸이 2명이니까 (학생 수)÷2만큼 칸을 올려요."],
    render: (b, a) => av6Bars(b, a, { cap: "학년별 운동회 도우미 수", title: "학년별 도우미 수", names: ["3학년", "4학년", "5학년", "6학년"], vals: [8, 12, 16, 10], unit: "명", max: 18, step: 2, catAxis: "학년", valAxis: "도우미 수", ok: "세로 눈금 한 칸이 2명일 때도 막대를 알맞게 그렸어요." }) }
},
{
  id: "s2", no: 2, title: "모둠 대표 기록을 정해요 ― 평균의 뜻", soop: "개념 구축하기(O)",
  question: "모둠마다 기록이 다를 때 대표하는 값은 어떻게 정할 수 있을까요?",
  summary: "모둠별 깃발 수처럼 자료 하나하나의 값을 자룟값이라고 해요. 자룟값을 고르게 하여 그 자료를 대표하는 값으로 정할 수 있고, 이 값을 평균이라고 해요. 많은 곳에서 적은 곳으로 옮겨 모두 같게 만들면 평균을 알 수 있어요.",
  steps: [
    { name: "만져 보기 — 응원 깃발 고르게 하기", inst: "모둠마다 운동회 응원 깃발을 만들었어요(1모둠 6개, 2모둠 9개, 3모둠 7개, 4모둠 6개). 서준: “한 모둠이 만든 깃발 수를 대표하는 값은 몇 개라고 하면 좋을까?” 먼저 예상을 쓰고, 쌓기나무를 옮겨 높이를 고르게 해 보세요.", hints: ["쌓기나무를 끌어 많은 곳에서 적은 곳으로 옮겨요.", "가장 높은 2모둠에서 낮은 1모둠과 4모둠으로 옮겨 봐요."],
      render: ruleFirst((b, a) => av6Level(b, a, { names: ["1모둠", "2모둠", "3모둠", "4모둠"], vals: [6, 9, 7, 6], unit: "개", item: "block", max: 10, title: "모둠별로 만든 응원 깃발 수(쌓기나무 1개 = 깃발 1개)",
        ask: [{ parts: ["2모둠에서 1모둠으로 ", { n: 1 }, "개, 2모둠에서 4모둠으로 ", { n: 1 }, "개를 옮기면 모두 같아져요. 한 모둠이 만든 깃발 수를 대표하는 값은 ", { n: 7, why: { "6": "6개인 모둠이 가장 많지만, 그러면 9개를 만든 2모둠의 깃발 수가 반영되지 않아요. 고르게 한 수를 써요.", "9": "9개는 가장 많이 만든 모둠의 깃발 수예요. 고르게 한 수를 써요." } }, "개예요."] }],
        ok: "2모둠의 쌓기나무를 1모둠과 4모둠에 1개씩 옮기면 모두 7개로 고르게 돼요. 한 모둠이 만든 깃발 수를 대표하는 값은 7개예요." }),
        { q: "모둠마다 다른 깃발 수를 하나의 수로 나타내려면 어떻게 하면 좋을까요?", ph: "내 생각: ~", help: ["① 깃발 수가 많은 모둠과 적은 모둠을 찾아요. → ② 모두 같게 만드는 방법을 떠올려요.", "‘많은 모둠의 깃발을 ~으로 옮겨 ~하면 그 수가 대표하는 수가 돼요.’ 꼴로 써요."], ans: "많은 모둠의 깃발을 적은 모둠으로 옮겨 모두 같게 만들면, 그 같아진 수가 모둠이 만든 깃발 수를 대표하는 수가 돼요." }) },
    { name: "그려 보기 — 공 넣기 연습 ○ 옮기기", inst: "하윤이네 모둠 다섯 명이 공 넣기 연습에서 넣은 공의 수를 ○로 나타냈어요. ○를 옮겨 고르게 해 보세요.", hints: ["많이 넣은 사람의 ○를 적게 넣은 사람에게 옮겨요.", "○는 모두 20개이고 5명이에요."],
      render: (b, a) => { b.append(av6HTbl("학생별 공 넣기 연습 기록", ["하윤", "서준", "민재", "예나", "도현"], [3, 6, 2, 5, 4], { h2: "넣은 공(개)" })); av6Level(b, a, { names: ["하윤", "서준", "민재", "예나", "도현"], vals: [3, 6, 2, 5, 4], unit: "개", item: "circle", title: "학생별 공 넣기 연습 기록",
        ask: [{ parts: ["○를 고르게 하면 한 사람에 ", { n: 4 }, "개씩이에요. 하윤이네 모둠의 공 넣기 기록의 평균은 ", { n: 4, why: { "6": "6개는 가장 많이 넣은 서준이의 기록이에요. 고르게 한 수를 써요.", "20": "20개는 모두 더한 수예요. 고르게 한 수를 써요." } }, "개예요."] }],
        ok: "서준이의 ○ 2개를 민재에게, 예나의 ○ 1개를 하윤이에게 옮기면 모두 4개예요. 평균은 4개예요." }); } },
    { name: "말해 보기 — 대표하는 값 정하기", inst: "예나가 질문했어요. “6개인 모둠이 두 모둠이나 되니까 대표 값을 6개로 하면 안 될까?” 대표하는 값을 정하는 방법을 골라 보세요.", hints: ["가장 많이 나온 수로 정하면 다른 모둠의 깃발 수가 반영되지 않아요.", "모든 자룟값을 고르게 한 수가 자료를 대표해요."],
      render: thenWhy((b, a) => quiz(b, a, [
        { q: "깃발 수(1모둠 6개, 2모둠 9개, 3모둠 7개, 4모둠 6개)를 대표하는 값을 정하는 방법으로 가장 알맞은 것은?", o: ["6개인 모둠이 가장 많으니까 6개로 정해요.", "가장 많이 만든 9개로 정해요.", "모둠별 깃발 수를 고르게 한 7개로 정해요."], a: 2, why: { "0": "6개로 정하면 9개, 7개를 만든 모둠의 깃발 수가 반영되지 않아요.", "1": "가장 큰 수는 다른 모둠의 깃발 수를 대표하지 못해요." } },
        { q: "모둠별 깃발 수처럼 자료 하나하나의 값을 무엇이라고 할까요?", o: ["자룟값", "합계", "눈금"], a: 0 }],
        { ok: "모둠별 깃발 수와 같은 값을 자룟값이라고 하고, 자룟값을 고르게 한 수로 대표하는 값을 정해요." }),
        { q: "가장 많이 나온 수(6개)를 대표하는 값으로 정하면 안 되는 까닭을 써 볼까요?", ph: "6개로 정하면 ~", help: ["① 6개로 정하면 어느 모둠의 깃발 수가 빠지는지 살펴봐요. → ② 고르게 한 수와 견주어 써요.", "‘6개로 정하면 ~의 깃발 수가 반영되지 않아요. 모든 모둠의 깃발 수를 ~한 7개가 대표해요.’ 꼴로 써요."], ans: "6개로 정하면 9개를 만든 2모둠과 7개를 만든 3모둠의 깃발 수가 반영되지 않아요. 모든 모둠의 깃발 수를 고르게 한 7개가 모둠을 대표해요." }) },
    { name: "약속하기 — 평균", inst: "약속하기를 완성해 보세요.", hints: ["쌓기나무와 ○를 어떻게 했는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["자룟값을 ", { o: ["고르게 하여", "모두 더하여", "가장 큰 수로"], a: 0 }, " 그 자료를 대표하는 값으로 정할 수 있습니다. 이 값을 ", { o: ["평균", "합계", "자룟값"], a: 0 }, "이라고 합니다."],
        { ok: "자룟값을 고르게 하여 그 자료를 대표하는 값으로 정할 수 있고, 이 값을 평균이라고 해요." }) },
    { name: "확인하기 — 반별 도우미 수", inst: "5학년 네 반에서 운동회 도우미를 뽑았어요. 평균을 10명쯤으로 예상하고, 빨간 선을 끌어 넘치는 양과 모자란 양이 같아지는 높이를 찾아보세요.", hints: ["선을 10에 맞추고 넘치는 양과 모자란 양을 비교해 봐요.", "3반은 10명보다 3명 많고, 4반은 10명보다 3명 적어요."],
      render: (b, a) => av6Line(b, a, { names: ["1반", "2반", "3반", "4반"], vals: [11, 9, 13, 7], unit: "명", lo: 0, hi: 14, gstep: 2, snap: 1, start: 4, title: "반별 운동회 도우미 수",
        ask: [{ parts: ["1반은 예상한 평균 10명보다 ", { n: 1 }, "명 많고, 2반은 ", { n: 1 }, "명 적어요. 3반은 10명보다 ", { n: 3 }, "명 많고, 4반은 ", { n: 3 }, "명 적어요. 도우미 수를 고르게 하여 평균을 구하면 ", { n: 10 }, "명이에요."] }],
        ok: "1반과 2반, 3반과 4반이 서로 채워져서 모두 10명으로 고르게 돼요. 평균은 10명이에요." }),
      easy: (b, a) => av6Level(b, a, { names: ["1반", "2반", "3반"], vals: [5, 3, 4], unit: "명", item: "circle", title: "반별 응원 단장 후보 수", ask: [{ parts: ["후보 수의 평균은 ", { n: 4 }, "명이에요."] }], ok: "1반의 ○ 1개를 2반에 옮기면 모두 4개예요." }) }
  ],
  challenge: { inst: "운동회 주간의 아침 기온과 예나네 모둠의 아침 운동 시간이에요. 고르게 하여 평균을 구해 보세요.", hints: ["15℃를 기준으로 높은 날과 낮은 날을 짝지어 봐요.", "넘치는 양과 모자란 양이 같아지는 높이를 찾아요."],
    render: (b, a) => av6Chain(b, a, [
      { title: "① 운동회 주간의 아침 기온", run: (bx, ax) => av6Line(bx, ax, { names: ["월", "화", "수", "목", "금"], vals: [14, 17, 15, 13, 16], unit: "℃", lo: 10, hi: 20, gstep: 1, start: 18, title: "요일별 아침 기온",
        ask: [{ parts: ["15℃보다 화요일은 ", { n: 2 }, "℃ 더 높고, 목요일은 ", { n: 2 }, "℃ 더 낮아요. 15℃보다 금요일은 ", { n: 1 }, "℃ 더 높고, 월요일은 ", { n: 1 }, "℃ 더 낮아요. 기온을 고르게 하여 평균을 구하면 ", { n: 15 }, "℃예요."] }],
        ok: "화요일과 목요일, 금요일과 월요일이 서로 채워져서 평균은 15℃예요." }) },
      { title: "② 아침 운동 시간", run: (bx, ax) => av6Ask(bx, ax, [
        { q: "예나네 모둠의 아침 운동 시간이에요. 고르게 하면 한 사람당 몇 분일까요?", fig: () => av6HTbl("", ["예나", "도현", "지아", "준우"], [18, 24, 20, 22], { h2: "시간(분)" }), parts: [{ n: 21, why: { "24": "24분은 도현이의 시간이에요. 모두 고르게 한 수를 구해요.", "84": "84분은 모두 더한 시간이에요. 고르게 한 수를 구해요." } }, "분"] }],
        { ok: "도현이의 3분을 예나에게, 준우의 1분을 지아에게 옮기면 모두 21분이에요." }) }]) }
},
{
  id: "s3", no: 3, title: "콩 주머니를 나누어요 ― 평균 구하기", soop: "개념 구축하기(O)",
  question: "평균은 어떻게 구할 수 있을까요?",
  summary: "평균은 자룟값을 모두 더한 수를 자료의 수로 나누어서 구해요. (평균)=(자룟값을 모두 더한 수)÷(자료의 수). 종이띠를 이어 붙이는 것은 자룟값을 더하는 것, 자료의 수만큼 등분하는 것은 자료의 수로 나누는 것과 같아요.",
  steps: [
    { name: "만져 보기 — 콩 주머니 띠 이어 붙이기", inst: "콩 주머니 던지기에 쓸 바구니 4개에 콩 주머니가 다르게 들어 있어요(빨강 8개, 파랑 5개, 노랑 9개, 초록 6개). 민재: “쌓기나무 말고 다른 방법으로 고르게 할 수 없을까?” 콩 주머니 수만큼 그린 종이띠를 하나씩 눌러 이어 붙이고, 이어 붙인 띠를 등분해 보세요.", hints: ["종이띠 4개를 모두 눌러 이어 붙여요.", "바구니가 4개이니까 4등분해요."],
      render: (b, a) => av6Strip(b, a, { names: ["빨강 바구니", "파랑 바구니", "노랑 바구니", "초록 바구니"], vals: [8, 5, 9, 6], unit: "개", ring: true,
        ask: [{ parts: ["콩 주머니는 모두 8 + 5 + 9 + 6 = ", { n: 28, why: { "27": "8+5+9+6을 다시 더해 봐요." } }, "(개)예요. 4등분한 띠에는 28 ÷ 4 = ", { n: 7 }, "(개)씩 있어요. 바구니 한 개에 든 콩 주머니 수의 평균은 ", { n: 7 }, "개예요."] }],
        ok: "종이띠를 이어 붙이면 28개, 4등분하면 7개씩이에요. 콩 주머니 수의 평균은 7개예요." }) },
    { name: "그려 보기 — 줄넘기 기록 띠", inst: "서준이가 운동회 전 5일 동안 잰 1분 줄넘기 기록이에요. 기록 띠를 이어 붙이고 등분하여 평균을 구해 보세요.", hints: ["112+118+109+121+115를 계산해요.", "5일 동안의 기록이니까 5등분해요."],
      render: (b, a) => { b.append(av6HTbl("서준이의 1분 줄넘기 기록", ["1일", "2일", "3일", "4일", "5일"], [112, 118, 109, 121, 115], { h1: "날짜", h2: "기록(회)" })); av6Strip(b, a, { names: ["1일", "2일", "3일", "4일", "5일"], vals: [112, 118, 109, 121, 115], unit: "회",
        ask: [{ parts: ["기록을 모두 더하면 ", { n: 575, why: { "565": "112+118+109+121+115를 다시 더해 봐요." } }, "회이고, 기록을 잰 날은 ", { n: 5 }, "일이에요. 평균은 ", { n: 575 }, " ÷ ", { n: 5 }, " = ", { n: 115, why: { "113": "575÷5를 다시 계산해 봐요." } }, "(회)예요."] }],
        ok: "(112+118+109+121+115)÷5 = 575÷5 = 115(회)예요." }); } },
    { name: "말해 보기 — 띠와 계산 잇기", inst: "종이띠로 평균을 구한 방법을 계산과 이어 말해 보세요.", hints: ["이어 붙이면 콩 주머니가 모두 몇 개인지 알 수 있어요.", "4등분은 4로 나누는 것과 같아요."],
      render: thenWhy((b, a) => blanks(b, a, ["종이띠를 이어 붙이는 것은 자룟값을 ", { o: ["모두 더하는", "모두 빼는", "곱하는"], a: 0 }, " 것과 같아요. 이어 붙인 띠를 4등분하는 것은 ", { o: ["자료의 수", "가장 큰 자룟값", "콩 주머니 한 개"], a: 0 }, "로 나누는 것과 같아요."],
        { ok: "이어 붙이기는 자룟값을 모두 더하기, 등분하기는 자료의 수로 나누기와 같아요." }),
        { q: "콩 주머니 띠를 3등분이나 5등분이 아니라 4등분한 까닭을 써 볼까요?", ph: "바구니가 ~", help: ["① 자료가 몇 개였는지 세어 봐요. → ② 등분한 한 칸이 무엇을 뜻하는지 써요.", "‘바구니가 ~개라서 자료의 수가 ~이므로, ~등분해야 바구니 한 개에 ~ 수를 알 수 있어요.’ 꼴로 써요."], ans: "바구니가 4개라서 자료의 수가 4이므로, 이어 붙인 28개를 4등분해야 바구니 한 개에 고르게 들어가는 수를 알 수 있어요." }) },
    { name: "약속하기 — 평균 구하는 식", inst: "약속하기를 완성해 보세요.", hints: ["먼저 모두 더하고, 자료의 수로 나눠요."],
      render: (b, a) => blanks(b, a, ["평균은 자룟값을 모두 더한 수를 ", { o: ["자료의 수", "가장 큰 수", "2"], a: 0 }, "로 나누어서 구합니다. (평균) = (", { o: ["자룟값을 모두 더한 수", "가장 큰 자룟값", "자료의 수"], a: 0 }, ") ÷ (", { o: ["자료의 수", "자룟값을 모두 더한 수", "평균"], a: 0 }, ")"],
        { ok: "(평균) = (자룟값을 모두 더한 수) ÷ (자료의 수)예요." }) },
    { name: "확인하기 — 평균 구하기", inst: "우리 모둠의 줄넘기 연습 시간과 운동회 연습 기간 7일 동안 운동장을 쓴 학생 수예요. 평균을 구해 보세요.", hints: ["모두 더해 자료의 수로 나눠요.", "수가 크면 계산기를 써도 돼요."],
      render: av6WithCalc((b, a) => av6Ask(b, a, [
        { fig: () => av6HTbl("지난주 줄넘기 연습 시간", AV6S_KIDS, [35, 42, 28, 39], { h2: "시간(분)" }),
          parts: ["우리 모둠의 줄넘기 연습 시간의 평균은 ", { n: 36, why: { "144": "144분은 모두 더한 시간이에요. 4명이니까 4로 나눠요." } }, "분이에요."] },
        { fig: () => av6HTbl("날짜별 운동장을 쓴 학생 수", ["1일", "2일", "3일", "4일", "5일", "6일", "7일"], [184, 205, 198, 176, 220, 213, 190], { h1: "날짜", h2: "학생 수(명)" }),
          parts: ["(184 + 205 + 198 + 176 + 220 + 213 + 190) ÷ 7 = ", { n: 1386 }, " ÷ 7 = ", { n: 198, why: { "231": "자료의 수 7로 나누었는지 확인해요." } }, "(명)"] }],
        { ok: "줄넘기 연습 시간의 평균은 144÷4=36(분), 운동장을 쓴 학생 수의 평균은 1386÷7=198(명)이에요." })) }
  ],
  challenge: { inst: "운동회 준비 위원회가 조사한 자료예요. 평균을 구해 보세요.", hints: ["(평균) = (자룟값을 모두 더한 수) ÷ (자료의 수)", "평균보다 비싼 곳은 10000원보다 비싼 곳이에요."],
    render: av6WithCalc((b, a) => av6Chain(b, a, [
      (bx, ax) => av6Ask(bx, ax, [
        { fig: () => av6HTbl("가게별 팀 티셔츠 한 장 가격", ["가", "나", "다", "라", "마"], [9800, 10500, 9200, 11000, 9500], { h1: "가게", h2: "가격(원)" }),
          parts: ["가격의 합: 9800 + 10500 + 9200 + 11000 + 9500 = ", { n: 50000 }, "(원)", h("br"), "가격의 평균: 50000 ÷ 5 = ", { n: 10000 }, "(원)", h("br"), "평균보다 비싼 가게: ", { o: ["가", "나", "다", "라", "마"], a: [1, 3], multi: true }] }],
        { ok: "평균은 10000원이고, 10000원보다 비싼 곳은 나(10500원)와 라(11000원)예요." }),
      (bx, ax) => av6Ask(bx, ax, [
        { q: "예나네 모둠의 100 m 달리기 기록: 예나 19초, 도현 22초, 하윤 20초, 민재 23초", parts: ["기록의 합 ", { n: 84 }, "초, 학생 수 ", { n: 4 }, "명, 평균 ", { n: 21 }, "초"] },
        { q: "서준이가 달리기를 하고 나서 1분 동안 잰 맥박 수(5번): 96회, 104회, 100회, 92회, 108회", parts: ["맥박 수의 평균 ", { n: 100, why: { "500": "500회는 모두 더한 수예요. 5번 잰 것이니까 5로 나눠요." } }, "회"] }],
        { ok: "달리기 기록의 평균은 84÷4=21(초), 맥박 수의 평균은 500÷5=100(회)이에요." })])) }
},
{
  id: "s4", no: 4, title: "청팀과 백팀, 어느 팀이 잘했을까 ― 평균 활용", soop: "개념 구축하기(O)",
  question: "평균을 이용하여 어떤 문제를 해결할 수 있을까요?",
  summary: "참가한 사람 수가 다른 두 팀은 합계가 아니라 평균으로 비교해요. 평균을 알면 (평균)×(자료의 수)로 전체 합을 구하고, 전체 합에서 아는 자룟값을 빼어 모르는 자룟값을 구할 수 있어요.",
  steps: [
    { name: "만져 보기 — 청팀과 백팀 비교하기", inst: "공 넣기 예선에서 청팀은 3명, 백팀은 5명이 공을 넣었어요. 민재: “백팀이 모두 더 많이 넣었으니 백팀이 이긴 거 아니야?” 먼저 예상을 쓰고, 두 팀의 기록을 각각 고르게 해 보세요.", hints: ["청팀 기록 8, 6, 10을 고르게 해요.", "백팀 기록 7, 9, 5, 6, 8을 고르게 해요."],
      render: ruleFirst((b, a) => av6Chain(b, a, [
        { title: "① 청팀(3명) 공 넣기 기록", run: (bx, ax) => av6Level(bx, ax, { names: ["1번", "2번", "3번"], vals: [8, 6, 10], unit: "개", item: "block", max: 10, title: "청팀 공 넣기 기록(쌓기나무 1개 = 공 1개)", ok: "청팀 기록을 고르게 하면 8개씩이에요." }) },
        { title: "② 백팀(5명) 공 넣기 기록", run: (bx, ax) => av6Level(bx, ax, { names: ["1번", "2번", "3번", "4번", "5번"], vals: [7, 9, 5, 6, 8], unit: "개", item: "block", max: 10, title: "백팀 공 넣기 기록(쌓기나무 1개 = 공 1개)",
          ask: [{ parts: ["넣은 공의 합계는 청팀 ", { n: 24 }, "개, 백팀 ", { n: 35 }, "개예요. 평균은 청팀 (8 + 6 + 10) ÷ 3 = ", { n: 8 }, "(개), 백팀 (7 + 9 + 5 + 6 + 8) ÷ 5 = ", { n: 7 }, "(개)예요. 평균이 더 높은 ", { o: ["청팀", "백팀"], a: 0, why: { "1": "백팀은 합계(35개)가 더 크지만 참가한 사람이 더 많아요. 평균을 비교해요." } }, "이 더 잘했다고 할 수 있어요."] }],
          ok: "청팀 평균 8개, 백팀 평균 7개예요. 한 사람당 넣은 공이 더 많은 청팀이 더 잘했어요." }) }]),
        { q: "사람 수가 다른 두 팀의 기록을 공정하게 비교하려면 어떻게 하면 좋을까요?", ph: "내 생각: ~", help: ["① 합계로 비교하면 어느 팀이 유리한지 생각해 봐요. → ② 한 사람당 기록을 구하는 방법을 떠올려요.", "‘두 팀의 기록을 각각 ~하여 한 사람당 ~을 구해 비교해요.’ 꼴로 써요."], ans: "두 팀의 기록을 각각 고르게 하여 한 사람당 넣은 공의 수(평균)를 구해 비교해요. 합계로 비교하면 사람이 많은 팀이 유리해서 공정하지 않아요." }) },
    { name: "그려 보기 — 빠진 반의 기록", inst: "5학년 여섯 반이 만든 응원 도구 수의 평균은 25개예요. 3반 기록이 빠졌어요. 3반 막대를 끌어 평균이 25개가 되게 해 보세요.", hints: ["파란 점선(지금 고르게 한 높이)이 빨간 평균선과 겹치게 해요.", "평균 25개에 반의 수 6을 곱하면 전체 응원 도구 수예요."],
      render: (b, a) => { b.append(av6HTbl("반별 응원 도구 수", ["1반", "2반", "3반", "4반", "5반", "6반"], [30, 22, "?", 28, 19, 24], { h1: "반", h2: "응원 도구 수(개)" })); av6Guess(b, a, { names: ["1반", "2반", "3반", "4반", "5반", "6반"], vals: [30, 22, null, 28, 19, 24], target: 25, unit: "개", hi: 40, gstep: 5, start: 5,
        ask: [{ parts: ["먼저 전체 응원 도구 수를 구해요: 25 × 6 = ", { n: 150, why: { "31": "평균에 자료의 수를 더하지 말고 곱해요." } }, "(개)", h("br"), "3반: 150 − (30 + 22 + 28 + 19 + 24) = 150 − ", { n: 123 }, " = ", { n: 27 }, "(개)"] },
          { q: "응원 도구 수가 평균보다 적은 반을 모두 고르세요.", parts: [{ o: ["1반", "2반", "3반", "4반", "5반", "6반"], a: [1, 4, 5], multi: true }] }],
        ok: "전체는 25×6=150(개), 3반은 150−123=27(개)이에요. 평균 25개보다 적은 반은 2반(22개), 5반(19개), 6반(24개)이에요." }); } },
    { name: "말해 보기 — 합계와 평균", inst: "두 팀을 비교한 방법을 말해 보세요.", hints: ["백팀 합계는 35개, 청팀 합계는 24개예요.", "참가한 사람 수가 다르면 합계로 비교하기 어려워요."],
      render: thenWhy((b, a) => blanks(b, a, ["백팀의 공 넣기 합계가 더 크지만 두 팀의 ", { o: ["참가한 사람 수가 달라서", "기록이 모두 같아서"], a: 0 }, " 합계로 비교하면 알맞지 않아요. 사람 수가 다른 두 집단은 ", { o: ["평균", "가장 높은 기록", "합계"], a: 0 }, "으로 비교해요."],
        { ok: "참가한 사람 수가 다른 두 집단은 합계가 아니라 평균으로 비교해요." }),
        { q: "백팀의 합계가 더 큰데도 청팀이 더 잘했다고 할 수 있는 까닭을 써 볼까요?", ph: "백팀은 ~명, 청팀은 ~명으로 ~", help: ["① 두 팀의 참가한 사람 수를 견주어요. → ② 한 사람당 넣은 공의 수(평균)를 견주어 써요.", "‘두 팀은 참가한 사람 수가 달라요. 평균은 청팀이 ~개, 백팀이 ~개라서 ~.’ 꼴로 써요."], ans: "백팀은 5명, 청팀은 3명으로 참가한 사람 수가 달라요. 한 사람당 넣은 공의 수인 평균은 청팀이 8개, 백팀이 7개라서 청팀이 더 잘했어요." }) },
    { name: "약속하기 — 모르는 자룟값 구하기", inst: "평균을 이용하여 모르는 자룟값을 구하는 방법을 정리해 보세요.", hints: ["빠진 3반 기록을 구할 때 먼저 무엇을 구했는지 떠올려요."],
      render: (b, a) => blanks(b, a, ["평균을 알면 (평균) ", { o: ["×", "+", "÷"], a: 0 }, " (자료의 수)로 전체 합을 구할 수 있어요. 전체 합에서 아는 자룟값을 모두 ", { o: ["빼면", "더하면", "곱하면"], a: 0 }, " 모르는 자룟값을 구할 수 있어요."],
        { ok: "(평균)×(자료의 수)=(전체 합), (전체 합)−(아는 자룟값의 합)=(모르는 자룟값)이에요." }) },
    { name: "확인하기 — 평균이 같은 두 모둠", inst: "제기차기 대회에서 서준이네 모둠과 하윤이네 모둠의 기록의 평균이 같았어요. 하윤이네 모둠 예나의 기록이 빠졌어요. 예나의 기록을 구해 보세요.", hints: ["먼저 서준이네 모둠 기록의 평균을 구해요.", "하윤이네 모둠은 5명이니까 평균에 5를 곱하면 전체 기록이에요."],
      render: (b, a) => av6Chain(b, a, [
        (bx, ax) => av6Ask(bx, ax, [{ fig: () => av6HTbl("서준이네 모둠의 제기차기 기록", ["서준", "준우", "지아", "도현"], [7, 5, 9, 7], { h2: "기록(개)" }),
          parts: ["서준이네 모둠 기록의 평균: (7 + 5 + 9 + 7) ÷ 4 = ", { n: 7 }, "(개)"] }], { ok: "서준이네 모둠 기록의 평균은 7개예요. 하윤이네 모둠의 평균도 7개예요." }),
        (bx, ax) => { bx.append(av6HTbl("하윤이네 모둠의 제기차기 기록", ["하윤", "민재", "예나", "수아", "태오"], [6, 8, "?", 9, 4], { h2: "기록(개)" }));
          av6Guess(bx, ax, { names: ["하윤", "민재", "예나", "수아", "태오"], vals: [6, 8, null, 9, 4], target: 7, unit: "개", hi: 12, gstep: 2, start: 2,
            ask: [{ parts: ["하윤이네 모둠 기록의 합: 7 × 5 = ", { n: 35 }, "(개)", h("br"), "예나: 35 − (6 + 8 + 9 + 4) = ", { n: 8 }, "(개)"] }],
            ok: "하윤이네 모둠의 전체 기록은 7×5=35(개), 예나는 35−27=8(개)이에요." }); }]) }
  ],
  challenge: { inst: "운동회 준비 위원회의 문제예요. 평균을 활용해 해결해 보세요.", hints: ["한 학생당 모은 개수 = (반이 모은 개수) ÷ (반의 학생 수)", "모르는 기록 = (평균) × (횟수) − (아는 기록의 합)"],
    render: av6WithCalc((b, a) => av6Chain(b, a, [
      (bx, ax) => av6Ask(bx, ax, [{ q: "운동회가 끝나고 반별로 운동장 쓰레기를 주웠어요. 한 학생당 주운 쓰레기 수의 평균을 구해 보세요.",
        fig: () => av6Tbl(["반", "1반", "2반", "3반", "4반"], [["학생 수(명)", "20", "25", "24", "22"], ["주운 쓰레기(개)", "120", "125", "96", "88"]], { rowHead: true }),
        parts: ["1반 ", { n: 6 }, "개, 2반 ", { n: 5 }, "개, 3반 ", { n: 4 }, "개, 4반 ", { n: 4 }, "개", h("br"), "한 학생당 주운 쓰레기가 가장 많은 반: ", { o: ["1반", "2반", "3반", "4반"], a: 0, why: { "1": "2반은 주운 개수가 가장 많지만 학생 수도 가장 많아요. 한 학생당 주운 개수를 비교해요." } }] }], { ok: "한 학생당 6, 5, 4, 4개라서 1반이 가장 많아요." }),
      (bx, ax) => av6Ask(bx, ax, [
        { q: "민재의 2단 뛰기 기록은 1회 18번, 2회 22번, 4회 15번이고, 4번의 평균은 19번이에요. 3회의 기록은?", parts: [{ n: 21, why: { "19": "평균과 같다고 생각하면 안 돼요. 19×4에서 세 번의 기록을 빼요." } }, "번"] },
        { q: "예나의 공 멀리 던지기 1~4회 기록은 21 m, 17 m, 19 m, 23 m예요. 5회까지의 평균이 21 m 이상이어야 대표 선수가 돼요. 5회에는 적어도 몇 m를 던져야 할까요?", parts: [{ n: 25 }, " m 이상"] }],
        { ok: "3회는 19×4−55=21(번), 5회에는 21×5−80=25이므로 25 m 이상 던져야 해요." })])) }
},
{
  id: "s5", no: 5, title: "운동회 날 일어날 일 ― 가능성을 말로 표현하기", soop: "개념 구축하기(O)",
  question: "일이 일어날 가능성을 어떤 말로 표현할 수 있을까요?",
  summary: "어떠한 상황에서 특정한 일이 일어나길 기대할 수 있는 정도를 가능성이라고 해요. 가능성은 불가능하다, ~아닐 것 같다, 반반이다, ~일 것 같다, 확실하다 등으로 표현할 수 있어요. 주머니에 많이 들어 있는 것일수록 나올 가능성이 높아요.",
  steps: [
    { name: "만져 보기 — 간식 상자에서 꺼내기", inst: "민재가 운동회 간식으로 초코우유 3개와 바나나우유 3개를 상자에 넣었어요. 딸기우유는 준비하지 않았어요. 상자를 눌러 여러 번 꺼내 보고(꺼낸 것은 다시 넣어요), 일이 일어날 가능성을 말로 나타내 보세요.", hints: ["초코우유와 바나나우유의 개수가 같아요.", "물 바구니에는 물만 들어 있고, 딸기우유는 준비하지 않았어요."],
      render: (b, a) => av6Bag(b, a, { bags: [{ name: "간식 상자", shape: "sq", items: [{ c: "#8B5A2B", t: "초코우유", k: "초코", n: 3 }, { c: "#F2D04B", t: "바나나우유", k: "바나나", n: 3 }] }], kind: "box", need: 6, legend: "갈색: 초코우유 3개 · 노란색: 바나나우유 3개",
        ask: [{ q: "알맞은 말을 골라 보세요.", parts: ["물만 든 물 바구니에서 하나를 꺼낼 때 물이 나올 가능성은 ", { o: AV6_W3, a: 2 }, ".", h("br"), "간식 상자에서 초코우유가 나올 가능성은 ", { o: AV6_W3, a: 1, why: { "2": "바나나우유도 들어 있어서 꼭 초코우유가 나오지는 않아요." } }, ".", h("br"), "간식 상자에서 바나나우유가 나올 가능성은 ", { o: AV6_W3, a: 1 }, ".", h("br"), "간식 상자에서 딸기우유가 나올 가능성은 ", { o: AV6_W3, a: 0, why: { "1": "간식 상자에는 딸기우유가 없어요." } }, "."] }],
        ok: "물은 확실하다, 초코우유와 바나나우유는 반반이다, 딸기우유는 불가능하다예요." }) },
    { name: "그려 보기 — 가능성 띠에 카드 놓기", inst: "하윤이가 운동회 날 일어날 수 있는 일을 카드에 적었어요. 일이 일어날 가능성을 생각하여 알맞은 곳에 카드를 놓아 보세요.", hints: ["하루는 24시간이에요.", "번호표 1~10 가운데 1만 2보다 작아요."],
      render: (b, a) => av6Scale(b, a, { cards: [
        { t: "운동회 날 하루는 25시간일 것입니다.", a: 0 },
        { t: "주사위를 5번 던지면 5번 모두 6이 나올 것입니다.", a: 1, why: { "0": "5번 모두 6이 나오기는 아주 어렵지만, 일어날 수 없는 일은 아니에요." } },
        { t: "동전을 던져 먼저 할 팀을 정할 때 청팀이 먼저 할 것입니다.", a: 2 },
        { t: "1부터 10까지의 번호표 중 한 장을 뽑으면 2 이상의 수가 나올 것입니다.", a: 3, why: { "4": "1이 나올 수도 있어서 꼭 그렇다고 할 수는 없어요." } },
        { t: "운동회가 수요일이면 하루 뒤는 목요일일 것입니다.", a: 4 }], ok: "25시간은 불가능하다, 5번 모두 6은 ~아닐 것 같다, 청팀이 먼저는 반반이다, 2 이상은 ~일 것 같다, 수요일의 하루 뒤가 목요일인 것은 확실하다예요." }) },
    { name: "말해 보기 — 응원 막대 뽑기", inst: "응원 막대 주머니에 파란 막대 2개와 노란 막대 6개가 들어 있어요. 주머니를 눌러 여러 번 꺼내 보세요(꺼낸 것은 다시 넣어요).", hints: ["파란 막대가 노란 막대보다 적게 들어 있어요.", "개수가 많을수록 나올 가능성이 높아요."],
      render: thenWhy((b, a) => av6Bag(b, a, { bags: [{ name: "응원 막대 주머니", shape: "sq", items: [{ c: AV6_BLUE, t: "파란 막대", k: "파랑", n: 2 }, { c: AV6_YEL, t: "노란 막대", k: "노랑", n: 6 }] }], need: 8, legend: "파란 막대 2개 · 노란 막대 6개",
        ask: [{ parts: ["꺼낼 때 나올 수 있는 막대: ", { o: ["파란 막대", "노란 막대", "빨간 막대"], a: [0, 1], multi: true }, h("br"), "파란 막대가 나올 가능성은 ", { o: AV6_WORDS, a: 1, why: { "0": "파란 막대도 들어 있어서 나올 수는 있어요.", "2": "파란 막대가 노란 막대보다 적게 들어 있어요." } }, h("br"), "노란 막대가 나올 가능성은 ", { o: AV6_WORDS, a: 3, why: { "4": "파란 막대도 들어 있어서 꼭 노란 막대가 나온다고 할 수는 없어요.", "2": "노란 막대가 파란 막대보다 많이 들어 있어요." } }] }],
        ok: "파란 막대는 적게 들어 있어서 ‘~아닐 것 같다’, 노란 막대는 많이 들어 있어서 ‘~일 것 같다’예요." }),
        { q: "노란 막대가 나올 가능성을 ‘~일 것 같다’라고 한 까닭을 써 볼까요?", ph: "주머니에 노란 막대가 ~", help: ["① 주머니에 든 두 가지 막대의 개수를 견주어요. → ② 개수와 가능성을 이어서 써요.", "‘노란 막대가 ~개, 파란 막대가 ~개라서 노란 막대가 더 많으므로 ~.’ 꼴로 써요."], ans: "주머니에 노란 막대가 6개, 파란 막대가 2개 들어 있어서 노란 막대가 더 많으므로, 노란 막대가 나올 가능성이 반반보다 높아요." }) },
    { name: "약속하기 — 가능성", inst: "약속하기를 완성해 보세요.", hints: ["일이 일어나길 기대할 수 있는 정도를 나타내는 말이에요."],
      render: (b, a) => blanks(b, a, ["어떠한 상황에서 특정한 일이 일어나길 기대할 수 있는 정도를 ", { o: ["가능성", "평균", "자룟값"], a: 0 }, "이라고 합니다. 가능성은 불가능하다, ~아닐 것 같다, ", { o: ["반반이다", "고르다", "평균이다"], a: 0 }, ", ~일 것 같다, ", { o: ["확실하다", "많다", "적다"], a: 0 }, " 등으로 표현할 수 있습니다."],
        { ok: "가능성은 불가능하다, ~아닐 것 같다, 반반이다, ~일 것 같다, 확실하다 등으로 표현해요." }) },
    { name: "확인하기 — 잘못 말한 친구 찾기", inst: "친구들이 운동회 준비를 하며 가능성을 말했어요. 잘못 말한 친구를 찾아 바르게 고쳐 보세요.", hints: ["6×4=24예요.", "○× 퀴즈의 정답은 ○이거나 ×예요."],
      render: (b, a) => quiz(b, a, [
        { q: "가능성을 잘못 말한 사람은 누구일까요? 하윤: “지금은 오전 10시니까 2시간 후에 낮 12시일 가능성은 ‘확실하다’야.” 민재: “계산기에 6, ×, 4, =을 차례대로 누르면 20이 나올 가능성은 ‘불가능하다’야.” 예나: “○× 퀴즈의 정답이 ○일 가능성은 ‘확실하다’야.”", o: ["하윤", "민재", "예나"], a: 2, why: { "0": "오전 10시에서 2시간 후는 낮 12시예요. 하윤이는 바르게 말했어요.", "1": "6×4=24이니까 20이 나오는 것은 불가능해요. 민재는 바르게 말했어요." } },
        { q: "예나의 말을 바르게 고치면?", o: ["○× 퀴즈의 정답이 ○일 가능성은 ‘반반이다’예요.", "○× 퀴즈의 정답이 ○일 가능성은 ‘불가능하다’예요."], a: 0, why: { "1": "정답이 ○일 수도 있으니 불가능하지 않아요." } }],
        { ok: "예나가 잘못 말했어요. 정답은 ○이거나 ×이니까 ‘반반이다’예요." }) }
  ],
  challenge: { inst: "운동회와 우리 생활에서 가능성을 나타낼 수 있는 상황을 찾아 말로 표현해 보세요.", hints: ["일어날 수 없는 일은 ‘불가능하다’예요.", "두 가지 중 하나가 나오고 두 가지가 똑같이 나올 수 있으면 ‘반반이다’예요."],
    render: (b, a) => writeStep(b, a, [
      { q: "‘불가능하다’로 표현할 수 있는 일을 써 보세요.", tag: "불가능하다", ph: "예) 2월의 다음 달이 1월일 가능성은 ~", help: ["① 절대로 일어날 수 없는 일을 찾아요. → ② 그 일이 일어날 가능성을 말로 나타내요.", "‘~일 가능성은 불가능하다예요. 왜냐하면 ~이기 때문이에요.’ 꼴로 써요."], ans: "운동회 날 해가 서쪽에서 뜰 가능성은 불가능하다예요. 해는 언제나 동쪽에서 뜨기 때문이에요." },
      { q: "‘반반이다’로 표현할 수 있는 일을 써 보세요.", tag: "반반이다", ph: "예) 1부터 10까지의 수 카드 중 한 장을 뽑을 때 ~", help: ["① 결과가 두 가지로 나뉘고 두 가지가 나올 정도가 같은 일을 찾아요. → ② 가능성을 말로 나타내요.", "‘~일 가능성은 반반이다예요. ~와 ~가 나올 가능성이 같기 때문이에요.’ 꼴로 써요."], ans: "1부터 10까지의 수 카드 중 한 장을 뽑을 때 홀수가 나올 가능성은 반반이다예요. 홀수 카드와 짝수 카드가 5장씩 있어서 나올 가능성이 같기 때문이에요." }]) }
},
{
  id: "s6", no: 6, title: "어느 게임이 당첨되기 쉬울까 ― 가능성 비교하기", soop: "개념 구축하기(O)",
  question: "일이 일어날 가능성을 어떻게 비교할 수 있을까요?",
  summary: "일이 일어날 가능성은 ‘반반이다’를 기준으로 비교할 수 있어요. 주머니에 든 개수가 많을수록, 회전판에서 색칠된 부분이 넓을수록 가능성이 높아요. 여러 번 해 본 결과 표를 보고 가능성을 예상할 수도 있어요.",
  steps: [
    { name: "만져 보기 — 팀 조끼 주머니", inst: "청팀이 입을 파란 조끼를 주머니에서 꺼내요. 주머니 가에는 파란 조끼 4벌, 나에는 파란 조끼 2벌과 빨간 조끼 2벌, 다에는 빨간 조끼 4벌이 들어 있어요. 주머니마다 눌러서 여러 번 꺼내 보세요(꺼낸 것은 다시 넣어요).", hints: ["주머니 가에는 파란 조끼만, 다에는 빨간 조끼만 있어요.", "‘반반이다’를 기준으로 비교해요."],
      render: (b, a) => av6Bag(b, a, { bags: [
        { name: "가", shape: "sq", items: [{ c: AV6_BLUE, t: "파란 조끼", k: "파", n: 4 }] },
        { name: "나", shape: "sq", items: [{ c: AV6_BLUE, t: "파란 조끼", k: "파", n: 2 }, { c: AV6_RED, t: "빨간 조끼", k: "빨", n: 2 }] },
        { name: "다", shape: "sq", items: [{ c: AV6_RED, t: "빨간 조끼", k: "빨", n: 4 }] }], need: 4, legend: "가: 파란 조끼 4벌 · 나: 파란 조끼 2벌, 빨간 조끼 2벌 · 다: 빨간 조끼 4벌",
        ask: [{ q: "꺼낸 조끼가 파란색일 가능성을 비교해 보세요.", parts: ["확실한 주머니 ", { o: ["가", "나", "다"], a: 0 }, ", 반반인 주머니 ", { o: ["가", "나", "다"], a: 1 }, ", 불가능한 주머니 ", { o: ["가", "나", "다"], a: 2 }, h("br"), "가능성이 높은 주머니부터 차례로: ", { o: ["가, 나, 다", "다, 나, 가", "나, 가, 다"], a: 0 }] }],
        ok: "파란 조끼가 나올 가능성은 가(확실하다) > 나(반반이다) > 다(불가능하다) 차례로 높아요." }) },
    { name: "그려 보기 — 회전판 게임 돌리기", inst: "민재가 운동회 회전판 게임을 다섯 개 만들었어요. 보라색은 당첨, 하늘색은 꽝이에요. 회전판을 돌려 보며 화살이 당첨에 멈출 가능성을 생각해 보세요.", hints: ["회전판을 누르거나 ‘모두 한 번씩 돌리기’를 눌러요.", "당첨 부분이 넓을수록 당첨에 멈출 가능성이 높아요."],
      render: (b, a) => av6Spin(b, a, { spins: AV6S_SP6, need: 3, legend: "보라색 = 당첨, 하늘색 = 꽝",
        ask: [{ parts: ["꽝에만 멈출 수 있는 회전판 ", { o: ["가", "나", "다", "라", "마"], a: 1 }, ", 당첨에 멈출 가능성이 반반인 회전판 ", { o: ["가", "나", "다", "라", "마"], a: 3 }, h("br"), "당첨에 멈출 가능성이 가장 높은 회전판 ", { o: ["가", "나", "다", "라", "마"], a: 2 }, ", 가와 마 중 더 높은 회전판 ", { o: ["가", "마"], a: 0, why: { "1": "마는 당첨 부분이 전체의 [1/4]이고, 가는 전체의 [3/4]이에요. 당첨 부분이 더 넓은 쪽을 골라요." } }] }],
        ok: "나는 꽝뿐이고, 라는 반반, 다는 전체가 당첨이에요. 당첨 부분이 더 넓은 가가 마보다 가능성이 높아요." }) },
    { name: "말해 보기 — 당첨되기 쉬운 차례", inst: "화살이 당첨에 멈출 가능성이 높은 회전판부터 차례대로 눌러 보세요.", hints: ["다는 확실하다, 나는 불가능하다예요.", "가(~일 것 같다) → 라(반반이다) → 마(~아닐 것 같다)"],
      render: thenWhy((b, a) => av6Rank(b, a, { items: AV6S_SP6.map(sp => ({ t: sp.name, fig: () => av6SpinFig([Object.assign({}, sp, { name: "" })], { cw: 110, r: 42, maxW: "7em" }) })), order: [2, 0, 3, 4, 1], ok: "다, 가, 라, 마, 나 차례로 당첨에 멈출 가능성이 높아요." }),
        { q: "회전판 가가 라보다 당첨될 가능성이 높은 까닭을 써 볼까요?", ph: "회전판 가는 당첨 부분이 ~", help: ["① 두 회전판의 당첨 부분 넓이를 견주어요. → ② 넓이와 가능성을 이어서 써요.", "‘가는 당첨 부분이 ~보다 넓고, 라는 ~이라서 ~.’ 꼴로 써요."], ans: "회전판 가는 당첨 부분이 전체의 반보다 넓고, 라는 당첨 부분이 꼭 반이라서, 당첨 부분이 더 넓은 가가 화살이 당첨에 멈출 가능성이 더 높아요." }) },
    { name: "약속하기 — 가능성 비교하기", inst: "가능성을 비교하는 방법을 정리해 보세요.", hints: ["주머니에서는 개수, 회전판에서는 넓이를 살펴봤어요."],
      render: (b, a) => blanks(b, a, ["가능성은 ‘", { o: ["반반이다", "확실하다", "평균"], a: 0 }, "’를 기준으로 비교할 수 있어요. 주머니에 들어 있는 개수가 ", { o: ["많을수록", "적을수록"], a: 0 }, ", 회전판에서 색칠된 부분이 ", { o: ["넓을수록", "좁을수록"], a: 0 }, " 그것이 나올 가능성이 높아요."],
        { ok: "‘반반이다’를 기준으로, 개수가 많을수록·색칠된 부분이 넓을수록 가능성이 높아요." }) },
    { name: "확인하기 — 결과 표로 예상하기", inst: "예나가 경품 상자에서 공을 한 개 꺼내 색을 확인하고 다시 넣기를 100번 했어요. 결과를 보고 가능성을 비교하고 예상해 보세요. 주사위 문제도 풀어 보세요.", hints: ["많이 나온 색일수록 나올 가능성이 높아요.", "3의 배수는 3, 6 / 2 이상은 2, 3, 4, 5, 6 / 6의 약수는 1, 2, 3, 6이에요."],
      render: (b, a) => av6Ask(b, a, [
        { fig: () => h("div", {}, av6HTbl("색별 나온 공의 횟수", ["흰색", "노란색", "초록색", "합계"], [12, 57, 31, 100], { h1: "색", h2: "횟수(번)" }),
          av6Fig(520, 120, s => { [[12, "#C9CED1", "흰색"], [57, AV6_YEL, "노란색"], [31, AV6_GREEN, "초록색"]].forEach(([v, c, t], i) => { s.append(txt(70, 25 + i * 35, t, 14, { "text-anchor": "end" })); s.append(svgEl("rect", { x: 80, y: 13 + i * 35, width: v * 7, height: 24, fill: c, stroke: "#00000033" })); s.append(txt(86 + v * 7, 25 + i * 35, `${v}번`, 13, { "text-anchor": "start" })); }); }, "28em")),
          parts: ["흰색과 초록색 중 나올 가능성이 더 높은 색은 ", { o: ["흰색", "초록색"], a: 1 }, "이에요. 나올 가능성이 높은 색부터 차례로 쓰면 ", { o: ["노란색, 초록색, 흰색", "흰색, 초록색, 노란색", "초록색, 노란색, 흰색"], a: 0 }, "이에요. 상자에 가장 많이 들어 있을 것 같은 색은 ", { o: ["흰색", "노란색", "초록색"], a: 1 }, "이에요."] },
        { q: "주사위를 한 번 던질 때 일이 일어날 가능성이 가장 높은 것은? ㉠ 눈의 수가 3의 배수 ㉡ 눈의 수가 2 이상 ㉢ 눈의 수가 6의 약수", parts: [{ o: ["㉠", "㉡", "㉢"], a: 1, why: { "0": "3의 배수는 3, 6으로 2가지, 2 이상은 2, 3, 4, 5, 6으로 5가지예요.", "2": "6의 약수는 1, 2, 3, 6으로 4가지, 2 이상은 5가지예요." } }] }],
        { ok: "12번 < 31번 < 57번이니까 노란색, 초록색, 흰색 차례로 가능성이 높고, 노란색 공이 가장 많이 들어 있을 것 같아요. 주사위는 ㉡(5가지)이 가장 높아요." }) }
  ],
  challenge: { inst: "빨간색, 파란색, 노란색으로 8칸 회전판을 색칠해 보세요. 조건: 화살이 노란색에 멈출 가능성은 ‘반반이다’이고, 파란색에 멈출 가능성은 빨간색에 멈출 가능성의 3배예요.", hints: ["노란색이 반반이려면 8칸 중 몇 칸이어야 할까요?", "남은 칸을 빨간색과 파란색이 1 : 3으로 나누어요."],
    render: (b, a) => av6Paint(b, a, { k: 8, colors: [{ c: AV6_RED, t: "빨간색" }, { c: AV6_BLUE, t: "파란색" }, { c: AV6_YEL, t: "노란색" }], words: ["빨간색 1칸", "파란색 3칸", "노란색 4칸"], answer: "빨간색 1칸, 파란색 3칸, 노란색 4칸",
      rule: c => c[2] !== 4 ? `노란색이 ${c[2]}칸이에요. 반반이려면 8칸 중 절반인 4칸이어야 해요.` : c[1] !== 3 * c[0] ? `파란색 칸 수(${c[1]}칸)가 빨간색 칸 수(${c[0]}칸)의 3배가 되어야 해요.` : "",
      ok: "노란색 4칸(반반), 빨간색 1칸, 파란색 3칸이에요. 파란색은 빨간색의 3배예요." }) }
},
{
  id: "s7", no: 7, title: "경품 뽑기 ― 가능성을 수로 나타내기", soop: "개념 구축하기(O)",
  question: "일이 일어날 가능성을 어떤 수로 나타낼 수 있을까요?",
  summary: "일이 일어날 가능성을 0부터 1까지의 수로 나타내면 ‘불가능하다’는 0으로, ‘반반이다’는 [1/2]로, ‘확실하다’는 1로 나타낼 수 있어요. 일이 일어날 가능성과 일어나지 않을 가능성이 같으면 [1/2]이에요.",
  steps: [
    { name: "만져 보기 — 경품 상자에서 꺼내기", inst: "운동회 마지막 순서는 경품 뽑기예요. 금색 카드가 나오면 1등 경품을 받아요. 상자 가에는 금색 카드 1장과 은색 카드 1장, 나에는 금색 카드 2장, 다에는 은색 카드 2장이 들어 있어요. 상자마다 눌러 여러 번 꺼내 보세요(꺼낸 카드는 다시 넣어요).", hints: ["가에는 금색과 은색이 한 장씩 있어요.", "나에는 금색 카드만, 다에는 은색 카드만 있어요."],
      render: (b, a) => av6Bag(b, a, { kind: "box", bags: [
        { name: "가", shape: "sq", items: [{ c: "#E0B43A", t: "금색 카드", k: "금", n: 1 }, { c: "#B8C0C6", t: "은색 카드", k: "은", n: 1 }] },
        { name: "나", shape: "sq", items: [{ c: "#E0B43A", t: "금색 카드", k: "금", n: 2 }] },
        { name: "다", shape: "sq", items: [{ c: "#B8C0C6", t: "은색 카드", k: "은", n: 2 }] }], need: 4, legend: "가: 금색 1장, 은색 1장 · 나: 금색 2장 · 다: 은색 2장",
        ask: [{ q: "각 상자에서 금색 카드가 나올 가능성을 말로 나타내 보세요.", parts: ["가 ", { o: AV6_W3, a: 1 }, h("br"), "나 ", { o: AV6_W3, a: 2 }, h("br"), "다 ", { o: AV6_W3, a: 0 }] }],
        ok: "금색 카드가 나올 가능성은 가는 반반이다, 나는 확실하다, 다는 불가능하다예요." }) },
    { name: "그려 보기 — 가능성 띠를 수로", inst: "금색 카드가 나올 가능성을 0부터 1까지의 수직선(가능성 띠)에 놓아 보고, 각 말을 수로 나타내 보세요. 먼저 어떤 수일지 예상해 써요.", hints: ["불가능하다는 가장 왼쪽 0, 확실하다는 가장 오른쪽 1이에요.", "반반이다는 0과 1의 한가운데예요."],
      render: ruleFirst((b, a) => av6Chain(b, a, [
        (bx, ax) => av6Scale(bx, ax, { pos: 3, cards: [{ t: "상자 가에서 금색 카드가 나올 가능성", a: 1 }, { t: "상자 나에서 금색 카드가 나올 가능성", a: 2 }, { t: "상자 다에서 금색 카드가 나올 가능성", a: 0 }], ok: "다는 왼쪽 끝, 가는 한가운데, 나는 오른쪽 끝이에요." }),
        (bx, ax) => av6Ask(bx, ax, [{ fig: () => av6Fig(560, 90, s => { s.append(svgEl("line", { x1: 40, y1: 40, x2: 520, y2: 40, stroke: AV6.ink, "stroke-width": 3 })); [[40, "불가능하다"], [280, "반반이다"], [520, "확실하다"]].forEach(([x, t]) => { s.append(svgEl("line", { x1: x, y1: 30, x2: x, y2: 50, stroke: AV6.ink, "stroke-width": 3 })); s.append(txt(x, 16, t, 15)); s.append(svgEl("rect", { x: x - 20, y: 56, width: 40, height: 28, rx: 4, fill: "#fff", stroke: AV6.red, "stroke-width": 2 })); s.append(txt(x, 70, "?", 15, { fill: AV6.red })); }); }, "30em"),
          parts: ["수로 나타내면 불가능하다 → ", { o: AV6_N3, a: 0 }, ", 반반이다 → ", { o: AV6_N3, a: 1 }, ", 확실하다 → ", { o: AV6_N3, a: 2 }, h("br"), "금색 카드가 나올 가능성을 수로: 가 ", { o: AV6_N3, a: 1 }, ", 나 ", { o: AV6_N3, a: 2 }, ", 다 ", { o: AV6_N3, a: 0 }] }],
          { ok: "불가능하다 0, 반반이다 [1/2], 확실하다 1이에요. 가는 [1/2], 나는 1, 다는 0이에요." })]),
        { q: "‘불가능하다’, ‘반반이다’, ‘확실하다’를 0부터 1까지의 수로 나타낸다면 각각 어떤 수일지 예상해 볼까요?", ph: "내 예상: 불가능하다는 ~", help: ["① 가능성 띠의 왼쪽 끝과 오른쪽 끝에 어떤 수를 놓을지 생각해요. → ② 한가운데에 놓일 수를 떠올려요.", "‘불가능하다는 ~, 반반이다는 ~, 확실하다는 ~일 것 같아요.’ 꼴로 써요."], ans: "불가능하다는 가장 작은 수 0, 확실하다는 가장 큰 수 1, 반반이다는 0과 1의 한가운데인 [1/2]로 나타내요." }) },
    { name: "말해 보기 — 동전과 회전판", inst: "동전 한 개를 던질 때와 회전판 게임을 돌릴 때 일이 일어날 가능성을 수로 나타내 보세요.", hints: ["동전에는 그림면과 숫자 면이 하나씩 있어요.", "회전판 다에는 빨간색이 없고, 나는 전체가 빨간색이에요."],
      render: thenWhy((b, a) => av6Ask(b, a, [
        { q: "동전 한 개를 던질 때", fig: () => h("div", { style: "display:flex;gap:.6em" }, av6Face("coin", 0), av6Face("coin", 1)), parts: ["그림면이 나올 가능성 ", { o: AV6_N3, a: 1 }, ", 숫자 면이 나올 가능성 ", { o: AV6_N3, a: 1 }] },
        { q: "회전판을 돌릴 때 화살이 빨간색에 멈출 가능성", fig: () => av6SpinFig(AV6S_SP7, { cw: 140, r: 48 }), parts: ["반반인 회전판은 ", { o: ["가", "나", "다"], a: 0 }, "예요. 가 ", { o: AV6_N3, a: 1 }, ", 나 ", { o: AV6_N3, a: 2 }, ", 다 ", { o: AV6_N3, a: 0, why: { "1": "회전판 다에는 빨간색 부분이 없어요." } }] }],
        { ok: "동전은 그림면 [1/2], 숫자 면 [1/2]이에요. 회전판 가는 [1/2], 나는 1, 다는 0이에요." }),
        { q: "동전을 던질 때 그림면이 나올 가능성을 [1/2]로 나타내는 까닭을 써 볼까요?", ph: "동전에는 ~", help: ["① 동전에 있는 면을 떠올려요. → ② 그림면이 나올 가능성과 나오지 않을 가능성을 견주어 써요.", "‘동전에는 ~이 하나씩 있어서 그림면이 나올 가능성과 나오지 않을 가능성이 ~하므로 [1/2]로 나타내요.’ 꼴로 써요."], ans: "동전에는 그림면과 숫자 면이 하나씩 있어서 그림면이 나올 가능성과 나오지 않을 가능성이 같은 ‘반반이다’이므로 [1/2]로 나타내요." }) },
    { name: "약속하기 — 가능성을 수로", inst: "약속하기를 완성해 보세요.", hints: ["가능성 띠의 왼쪽 끝은 0, 오른쪽 끝은 1이에요."],
      render: (b, a) => av6Ask(b, a, [{ parts: ["일이 일어날 가능성을 0부터 1까지의 수로 나타내면 ‘불가능하다’는 ", { o: AV6_N3, a: 0 }, "으로, ‘반반이다’는 ", { o: AV6_N3, a: 1 }, "로, ‘확실하다’는 ", { o: AV6_N3, a: 2 }, "로 나타낼 수 있습니다."] }],
        { ok: "불가능하다는 0, 반반이다는 [1/2], 확실하다는 1이에요." }) },
    { name: "확인하기 — 주사위 말과 수", inst: "주사위 놀이 순서를 정하려고 주사위를 한 번 던져요. 일이 일어날 가능성을 말과 수로 각각 나타내 보세요.", hints: ["주사위 눈은 1, 2, 3, 4, 5, 6이에요.", "홀수는 1, 3, 5로 6가지 중 3가지예요."],
      render: (b, a) => av6Ask(b, a, [
        { q: "주사위 눈의 수를 홀수와 짝수로 분류해요.", fig: () => h("div", { style: "display:flex;flex-wrap:wrap;gap:.3em" }, ...[1, 2, 3, 4, 5, 6].map(v => av6Face("dice", v))), parts: ["홀수인 눈: ", { o: ["1", "2", "3", "4", "5", "6"], a: [0, 2, 4], multi: true }] },
        { q: "말과 수로 나타내요.", parts: ["홀수가 나올 가능성: ", { o: AV6_W3, a: 1 }, ", ", { o: AV6_N3, a: 1 }, h("br"), "0이 나올 가능성: ", { o: AV6_W3, a: 0 }, ", ", { o: AV6_N3, a: 0 }, h("br"), "1 이상이 나올 가능성: ", { o: AV6_W3, a: 2, why: { "1": "주사위 눈은 모두 1 이상이에요." } }, ", ", { o: AV6_N3, a: 2 }] }],
        { ok: "홀수는 반반이다·[1/2], 0은 불가능하다·0, 1 이상은 확실하다·1이에요." }) }
  ],
  challenge: { inst: "경품 뽑기와 수 카드 문제예요. 가능성을 수로 나타내 보세요.", hints: ["1년은 많아야 366일이에요.", "당첨 제비가 8개 중 4개이면 반반이에요."],
    render: (b, a) => av6Chain(b, a, [
      (bx, ax) => av6Ask(bx, ax, [
        { q: "제비 8개 중 당첨 제비가 4개예요. 한 개를 뽑을 때 당첨될 가능성", parts: [{ o: AV6_N3, a: 1 }] },
        { q: "가능성을 수로 나타내면 0인 것은? ㉠ 운동회에 온 400명 중 생일이 같은 사람이 있을 것입니다. ㉡ 1번부터 20번까지 번호표 중 한 장을 뽑으면 25번이 나올 것입니다.", parts: [{ o: ["㉠", "㉡"], a: 1, why: { "0": "1년은 많아야 366일이라 400명 중에는 생일이 같은 사람이 꼭 있어요. ㉠은 1이에요." } }] }],
        { ok: "당첨될 가능성은 [1/2], 0인 것은 ㉡이에요." }),
      (bx, ax) => { bx.append(h("p", { class: "inst" }, "수 카드 2, 4, 6, 8, 10, 12 중 한 장을 뽑아요. 일이 일어날 가능성에 맞게 카드를 놓아 보세요."));
        av6Scale(bx, ax, { pos: 3, nums: true, cards: [
          { t: "뽑은 수 카드는 홀수일 것입니다.", a: 0 },
          { t: "뽑은 수 카드는 4의 배수일 것입니다.", a: 1, why: { "0": "4, 8, 12가 4의 배수예요. 6장 중 3장이에요.", "2": "2, 6, 10은 4의 배수가 아니에요. 6장 중 3장만 4의 배수예요." } },
          { t: "뽑은 수 카드는 13보다 작은 수일 것입니다.", a: 2 },
          { t: "뽑은 수 카드는 짝수일 것입니다.", a: 2 }], ok: "홀수는 0, 4의 배수(4, 8, 12)는 [1/2], 13보다 작은 수와 짝수는 1이에요." }); }]) }
},
{
  id: "s8", no: 8, title: "동전·주사위 실험 부스 ― 여러 번 던져도 가능성이 같을까요", soop: "탐구 정리하기(O)",
  question: "동전이나 주사위를 여러 번 던지면 나온 횟수는 어떻게 될까요?",
  summary: "동전의 그림면과 숫자 면, 주사위의 홀수와 짝수가 나올 가능성은 모두 [1/2]로 같아요. 적게 던지면 결과가 반반과 크게 다를 수 있지만, 던진 횟수가 많아질수록 두 가지가 나온 횟수가 비슷해져요. 앞에서 무엇이 나왔는지는 다음 결과에 영향을 주지 않아요.",
  steps: [
    { name: "만져 보기 — 동전의 가능성", inst: "줄다리기를 먼저 할 팀을 동전 던지기로 정하기로 했어요. 예나: “연습할 때 그림면이 세 번이나 연속으로 나왔어. 그림면이 더 잘 나오는 거 아니야?” 동전 한 개를 던질 때의 가능성을 먼저 생각해 보세요.", hints: ["동전에는 그림면과 숫자 면이 하나씩 있어요.", "반반이다는 [1/2]이에요."],
      render: (b, a) => av6Ask(b, a, [{ parts: ["그림면이 나올 가능성은 ", { o: AV6_W3, a: 1 }, "이고 수로 ", { o: AV6_N3, a: 1 }, "이에요. 숫자 면이 나올 가능성은 수로 ", { o: AV6_N3, a: 1 }, "이에요. 두 가능성은 ", { o: ["같아요", "달라요"], a: 0, why: { "1": "그림면과 숫자 면은 하나씩이라 나올 가능성이 같아요." } }, "."] }],
        { ok: "그림면과 숫자 면이 나올 가능성은 모두 [1/2]로 같아요. 정말 그런지 실험 부스에서 던져 봐요." }) },
    { name: "그려 보기 — 동전 10번 던지기", inst: "실험 부스에서 동전 한 개를 10번 던져 보세요.", hints: ["‘10번 던지기’를 한 번 눌러도 돼요.", "표에서 내 결과를 읽어요."],
      render: (b, a) => av6Sim(b, a, { kind: "coin", ms: [10], need: 10,
        ask: d => [{ parts: ["10번 던졌을 때 그림면은 ", { n: d.a }, "번, 숫자 면은 ", { n: d.b }, "번 나왔어요."] },
          { q: "동전을 10번 던지면 그림면과 숫자 면이 꼭 5번씩 나올까요?", parts: [{ o: ["네, 꼭 5번씩 나와요.", "아니요, 적게 던지면 5번씩 나오지 않을 수도 있어요."], a: 1, why: { "0": "‘새로 다시 실험하기’로 다시 해 보면 6번과 4번, 7번과 3번처럼 나올 때도 있어요." } }] }],
        ok: "가능성은 [1/2]씩이지만 10번만 던지면 꼭 5번씩 나오지는 않아요." }) },
    { name: "말해 보기 — 동전 120번 던지기", inst: "모둠 친구들의 결과를 모으듯이 동전을 120번까지 던져 보세요. 던진 횟수별 결과가 표에 적혀요.", hints: ["‘20번 던지기’를 여러 번 누르거나 ‘100번 더 던지기’를 눌러요.", "가운데 빨간 점선(반반)과 막대를 비교해 봐요."],
      render: thenWhy((b, a) => av6Sim(b, a, { kind: "coin", ms: [40, 60, 80, 100, 120], need: 120,
        ask: [{ parts: ["던진 횟수가 많아질수록 그림면과 숫자 면이 나온 횟수는 ", { o: ["비슷해져요", "점점 크게 달라져요", "늘 똑같아요"], a: 0 }, "."] }],
        ok: "던진 횟수가 많아질수록 그림면과 숫자 면이 나온 횟수가 비슷해져요." }),
        { q: "10번 던졌을 때와 120번 던졌을 때를 견주어 알게 된 것을 써 볼까요?", ph: "적게 던지면 ~, 많이 던지면 ~", help: ["① 10번 던진 결과와 120번 던진 결과를 견주어요. → ② 던진 횟수와 두 면이 나온 횟수의 관계를 써요.", "‘적게 던지면 ~ 수 있지만, 많이 던질수록 ~해서 ~을 확인할 수 있어요.’ 꼴로 써요."], ans: "10번처럼 적게 던지면 그림면과 숫자 면이 나온 횟수가 크게 다를 수 있지만, 많이 던질수록 두 면이 나온 횟수가 비슷해져서 두 면이 나올 가능성이 [1/2]로 같다는 것을 확인할 수 있어요." }) },
    { name: "약속하기 — 주사위 홀수와 짝수", inst: "주사위 놀이에서 홀수가 나오면 청팀, 짝수가 나오면 백팀이 먼저 해요. 이 방법이 공정한지 가능성을 비교하고, 10번 던져 보세요.", hints: ["홀수 눈은 1, 3, 5, 짝수 눈은 2, 4, 6이에요.", "6가지 중 3가지씩이니까 반반이에요."],
      render: (b, a) => av6Chain(b, a, [
        (bx, ax) => av6Ask(bx, ax, [{ parts: ["짝수인 눈: ", { o: ["1", "2", "3", "4", "5", "6"], a: [1, 3, 5], multi: true }, h("br"), "홀수가 나올 가능성 ", { o: AV6_N3, a: 1 }, ", 짝수가 나올 가능성 ", { o: AV6_N3, a: 1 }, " → 이 방법은 두 팀에게 ", { o: ["공정해요", "공정하지 않아요"], a: 0, why: { "1": "홀수와 짝수가 나올 가능성이 [1/2]로 같으니 어느 팀에도 유리하지 않아요." } }] }], { ok: "홀수와 짝수가 나올 가능성은 모두 [1/2]로 같아서 공정해요." }),
        (bx, ax) => av6Sim(bx, ax, { kind: "dice", ms: [10], need: 10,
          ask: d => [{ parts: ["10번 던졌을 때 홀수는 ", { n: d.a }, "번, 짝수는 ", { n: d.b }, "번 나왔어요."] }],
          ok: "10번만 던지면 홀수 2번, 짝수 8번처럼 반반과 크게 다를 수도 있어요." })]) },
    { name: "확인하기 — 주사위 여러 번", inst: "주사위를 120번까지 던져 보고, 던진 횟수가 많아질 때 결과를 살펴보세요.", hints: ["‘20번 던지기’나 ‘100번 더 던지기’를 눌러요.", "‘새로 다시 실험하기’를 하면 표의 수가 바뀌어요."],
      render: (b, a) => av6Sim(b, a, { kind: "dice", ms: [40, 60, 80, 100, 120], need: 120,
        ask: [{ parts: ["던진 횟수가 많아질수록 홀수와 짝수가 나온 횟수는 ", { o: ["비슷해져요", "점점 크게 달라져요"], a: 0 }, ". 같은 실험을 다시 하면 표의 수는 ", { o: ["똑같이 나와요", "조금씩 달라질 수 있어요"], a: 1 }, "."] }],
        ok: "실험할 때마다 결과는 조금씩 다르지만, 많이 던질수록 홀수와 짝수가 나온 횟수가 비슷해져요." }) }
  ],
  challenge: { inst: "실험 부스에서 나온 이야기와 결과를 보고 생각해 보세요.", hints: ["동전은 앞에서 무엇이 나왔는지 기억하지 못해요.", "던진 횟수의 절반과 비교해 봐요."],
    render: (b, a) => av6Ask(b, a, [
      { q: "민재가 동전을 던졌더니 그림면, 숫자 면, 그림면, 그림면, 그림면이 나왔어요. 다음에 던지면?", parts: [{ o: ["이번에는 반드시 숫자 면이 나와요.", "반드시 그림면이 또 나와요.", "그림면과 숫자 면이 나올 가능성은 여전히 반반이에요."], a: 2, why: { "0": "앞에서 무엇이 나왔든 다음에 던질 때 두 면이 나올 가능성은 같아요.", "1": "앞에서 그림면이 많이 나왔어도 다음 결과를 미리 알 수는 없어요." } }] },
      { q: "어느 모둠의 동전 던지기 결과예요.", fig: () => av6Tbl(["던진 횟수(번)", "40", "60", "80", "100", "120"], [["그림면(번)", "18", "28", "41", "52", "62"], ["숫자 면(번)", "22", "32", "39", "48", "58"]], { rowHead: true }),
        parts: ["120번 던졌을 때 그림면은 ", { n: 62 }, "번 나왔어요. 던진 횟수가 많아질수록 그림면이 나온 횟수는 던진 횟수의 ", { o: ["절반", "2배", "4분의 1"], a: 0 }, "에 가까워져요."] }],
      { ok: "다음 결과는 앞의 결과와 상관없이 반반이에요. 많이 던질수록 나온 횟수가 던진 횟수의 절반에 가까워져요." }) }
},
{
  id: "s9", no: 9, title: "운동회 기록왕 놀이 ― 누가 평균에 가까울까요", soop: "발표하기(P)",
  question: "모둠 기록의 평균에 가장 가까운 친구는 누구일까요?",
  summary: "주제를 정해 기록을 재고, 계산기로 모둠 기록의 평균을 구한 뒤 평균과 기록의 차이를 견주어 평균에 가장 가까운 사람을 찾아요. 그 사람이 우리 모둠을 대표하는 친구예요. 평균과 수의 개수를 알면 (평균)×(수의 개수)로 모르는 수도 찾을 수 있어요.",
  steps: [
    { name: "만져 보기 — 놀이 방법", inst: "운동회 날 쉬는 시간에 ‘기록왕 놀이’를 해요. 놀이 방법을 차례대로 눌러 보세요. (모둠 4명, 준비물: 계산기, 공, 줄넘기, 초시계, 줄자)", hints: ["주제를 먼저 정하고 기록을 재요.", "평균을 구한 다음에 평균에 가까운 사람을 찾아요."],
      render: (b, a) => sequence(b, a, ["기록을 재요.", "평균을 구할 주제를 정해요.", "평균에 가장 가까운 사람을 찾아요.", "표에 제목, 이름, 기록을 적어요.", "다른 주제를 정하여 되풀이해요."], [1, 0, 3, 2, 4], { ok: "주제 정하기 → 기록 재기 → 표에 적기 → 평균을 구해 가장 가까운 사람 찾기 → 다른 주제로 되풀이해요." }) },
    { name: "그려 보기 — 주제별 평균 구하기", inst: "서준이네 모둠이 네 가지 주제로 기록을 쟀어요. 계산기를 써서 주제별 모둠 기록의 평균을 구해 보세요.", hints: ["네 사람의 기록을 모두 더하여 4로 나눠요.", "제자리멀리뛰기와 왕복 오래달리기는 평균이 소수로 나와요."],
      render: av6WithCalc((b, a) => av6Ask(b, a, AV6S_T9.map(t => ({ fig: () => av6HTbl(`${t.t}`, AV6S_KIDS, t.recs.map(String), { h2: `기록(${t.u})` }), parts: [`${t.t} 기록의 평균: `, { n: t.avg, w: "6em" }, ` ${t.u}`] })),
        { ok: "평균은 공 멀리 던지기 20 m, 30초 줄넘기 54회, 제자리멀리뛰기 144.9 cm, 왕복 오래달리기 51.5회예요." })) },
    { name: "말해 보기 — 가장 가까운 사람", inst: "주제마다 평균에 가장 가까운 사람을 찾아보세요.", hints: ["기록과 평균의 차이를 구해 가장 작은 사람을 찾아요.", "공 멀리 던지기: 21−20=1, 20−17=3, 24−20=4, 20−18=2"],
      render: thenWhy((b, a) => av6Ask(b, a, AV6S_T9.map(t => ({ fig: () => av6HTbl(`${t.t} (평균 ${t.avg} ${t.u})`, AV6S_KIDS, t.recs.map(String), { h2: `기록(${t.u})` }), parts: ["평균에 가장 가까운 사람: ", { o: AV6S_KIDS, a: t.near }] })),
        { ok: "공 멀리 던지기는 서준, 30초 줄넘기는 예나, 제자리멀리뛰기는 하윤, 왕복 오래달리기는 민재가 평균에 가장 가까워요." }),
        { q: "평균에 가장 가까운 사람을 ‘모둠을 대표하는 친구’라고 할 수 있는 까닭을 써 볼까요?", ph: "평균은 모둠 기록을 ~", help: ["① 평균이 어떤 값인지 떠올려요. → ② 평균과의 차이가 작다는 것이 무슨 뜻인지 써요.", "‘평균은 모둠 기록을 ~한 값이라 ~을 대표해요. 그래서 평균과의 차이가 ~ 친구가 ~.’ 꼴로 써요."], ans: "평균은 모둠 기록을 고르게 한 값이라 모둠을 대표하는 값이에요. 그래서 평균과의 차이가 가장 작은 기록을 낸 친구가 모둠의 기록을 가장 잘 대표해요." }) },
    { name: "약속하기 — 우리 모둠 기록왕 놀이", inst: "우리 모둠의 주제를 고르고, 친구들의 이름과 기록을 써서 놀이를 해 보세요. 평균을 구해 쓰면 평균에 가장 가까운 친구를 찾을 수 있어요.", hints: ["기록을 정확하게 재요.", "기록 4개를 더하여 4로 나누면 평균이에요."],
      render: av6WithCalc((b, a) => av6Near(b, a, { names: ["나", "친구 1", "친구 2", "친구 3"], topics: [{ t: "공 멀리 던지기", u: "m" }, { t: "30초 줄넘기", u: "회" }, { t: "제자리멀리뛰기", u: "cm" }, { t: "왕복 오래달리기", u: "회" }, { t: "눈 감고 외발 서기", u: "초" }] })) },
    { name: "확인하기 — 비밀 숫자 찾기", inst: "또 다른 놀이 ‘비밀 숫자 찾기’예요. 네 친구가 고른 수와 진행자 민재가 알려 준 5개 수의 평균을 보고 민재의 비밀 숫자를 찾아보세요. 3점을 모으면 성공이에요.", hints: ["(평균) × 5 = 5개 수의 합계예요.", "합계에서 네 수의 합을 빼면 비밀 숫자예요."],
      render: (b, a) => av6Secret(b, a, { names: ["서준", "하윤", "예나", "도현"], maker: "민재", goal: 3 }) }
  ],
  challenge: { inst: "이번에는 내가 진행자가 되어 보세요. 친구들이 11, 6, 15, 9를 골랐어요.", hints: ["네 수의 합은 41이에요.", "41에 비밀 숫자를 더한 수가 5로 나누어떨어져야 평균이 자연수예요."],
    render: (b, a) => av6Ask(b, a, [
      { q: "5개 수의 평균이 자연수가 되도록 20 이하의 비밀 숫자를 정하려고 해요. 비밀 숫자가 될 수 있는 수를 모두 고르세요.", parts: [{ o: ["4", "5", "9", "10", "14", "15", "19", "20"], a: [0, 2, 4, 6], multi: true }] },
      { q: "비밀 숫자를 14로 정했어요.", parts: ["5개 수의 평균은 (11 + 6 + 15 + 9 + 14) ÷ 5 = ", { n: 11 }, "이에요."] }],
      { ok: "41+4=45, 41+9=50, 41+14=55, 41+19=60이 5로 나누어떨어져요. 14로 정하면 평균은 55÷5=11이에요." }) }
},
{
  id: "s10", no: 10, title: "학급 운동회 준비 보고회", soop: "발표하기(P)",
  question: "평균과 가능성을 이용해 운동회 준비를 어떻게 했는지 발표할 수 있나요?",
  summary: "(평균)=(자룟값을 모두 더한 수)÷(자료의 수)예요. 사람 수가 다른 팀은 평균으로 비교하고, 평균을 알면 (평균)×(자료의 수)로 전체 합과 모르는 값을 구할 수 있어요. 가능성은 불가능하다(0), ~아닐 것 같다, 반반이다([1/2]), ~일 것 같다, 확실하다(1)로 나타내고, 개수가 많을수록·색칠된 부분이 넓을수록 가능성이 높아요.",
  steps: [
    { name: "만져 보기 — 공 넣기 기록 고르게 하기", inst: "보고회 날이에요! 서준이가 민재의 회별 공 넣기 기록을 ○로 나타내 발표 자료를 만들어요. ○를 옮겨 고르게 하여 평균을 구해 보세요.", hints: ["1회의 ○를 2회로 옮겨 봐요.", "○는 모두 12개, 4회예요."],
      render: (b, a) => av6Level(b, a, { names: ["1회", "2회", "3회", "4회"], vals: [4, 1, 3, 4], unit: "개", item: "circle", max: 4, title: "민재의 회별 공 넣기 기록",
        ask: [{ parts: ["민재의 공 넣기 기록의 평균은 ", { n: 3, why: { "4": "4개는 가장 많이 넣은 기록이에요. 고르게 한 수를 써요.", "12": "12개는 모두 더한 수예요. 고르게 한 수를 써요." } }, "개예요."] }], ok: "1회와 4회의 ○를 1개씩 2회로 옮기면 모두 3개예요. 평균은 3개예요." }) },
    { name: "그려 보기 — 응원 연습 참여 학생 수", inst: "하윤이가 운동회 전 5일 동안 응원 연습에 참여한 학생 수를 조사했어요. 평균을 구해 보세요.", hints: ["86+92+88+95+89를 먼저 구해요.", "5일이니까 5로 나눠요."],
      render: av6WithCalc((b, a) => av6Ask(b, a, [{ fig: () => av6HTbl("날짜별 응원 연습에 참여한 학생 수", ["1일", "2일", "3일", "4일", "5일"], [86, 92, 88, 95, 89], { h1: "날짜", h2: "학생 수(명)" }),
        parts: ["(86 + 92 + 88 + 95 + 89) ÷ 5 = ", { n: 450 }, " ÷ 5 = ", { n: 90, why: { "450": "5로 나누어야 해요." } }, "(명)"] }], { ok: "450÷5=90(명)이에요." })) },
    { name: "말해 보기 — 경품 뽑기와 회전판 발표", inst: "민재가 만든 경품 뽑기 주머니와 회전판 게임을 발표해요. 빨간 공이 나올 가능성이 높은 주머니부터 차례대로 누르고, 회전판과 결과 표를 알맞게 이어 보세요.", hints: ["빨간 공이 많을수록 가능성이 높아요.", "50번 중 빨간색에 34번 멈췄다면 빨간색이 가장 넓은 회전판이에요."],
      render: thenWhy((b, a) => av6Chain(b, a, [
        { title: "① 빨간 공이 나올 가능성이 높은 주머니부터", run: (bx, ax) => av6Rank(bx, ax, { items: [
          { t: "가", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_RED, n: 5 }, { c: AV6_BLUE, n: 1 }] }], { cw: 150, H: 150, maxW: "7em" }) },
          { t: "나", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_RED, n: 3 }, { c: AV6_BLUE, n: 3 }] }], { cw: 150, H: 150, maxW: "7em" }) },
          { t: "다", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_RED, n: 6 }] }], { cw: 150, H: 150, maxW: "7em" }) },
          { t: "라", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_BLUE, n: 6 }] }], { cw: 150, H: 150, maxW: "7em" }) },
          { t: "마", fig: () => av6BagFig([{ name: "", shape: "ball", items: [{ c: AV6_RED, n: 1 }, { c: AV6_BLUE, n: 5 }] }], { cw: 150, H: 150, maxW: "7em" }) }],
          order: [2, 0, 1, 4, 3], ok: "다(확실하다), 가(~일 것 같다), 나(반반이다), 마(~아닐 것 같다), 라(불가능하다) 차례예요." }) },
        { title: "② 회전판과 50번 돌린 결과 표 잇기", run: (bx, ax) => av6Ask(bx, ax, [{ fig: () => av6SpinFig(AV6S_SP10, { cw: 130, r: 46 }),
          parts: ["표 ① 빨 17번, 노 16번, 파 17번 → ", { o: ["㉠", "㉡", "㉢"], a: 0 }, h("br"), "표 ② 빨 34번, 노 8번, 파 8번 → ", { o: ["㉠", "㉡", "㉢"], a: 2 }, h("br"), "표 ③ 빨 12번, 노 13번, 파 25번 → ", { o: ["㉠", "㉡", "㉢"], a: 1 }] }],
          { ok: "세 색이 비슷한 표 ①은 ㉠, 빨간색이 가장 많은 표 ②는 ㉢, 파란색이 절반쯤인 표 ③은 ㉡이에요." }) }]),
        { q: "결과 표 ②가 회전판 ㉢과 어울리는 까닭을 써 볼까요?", ph: "표 ②에서 ~", help: ["① 표 ②에서 가장 많이 멈춘 색을 찾아요. → ② 그 색이 가장 넓은 회전판과 이어서 써요.", "‘표 ②에서 50번 중 ~에 ~번으로 가장 많이 멈췄으니, ~이 가장 넓은 회전판 ㉢을 돌렸을 가능성이 높아요.’ 꼴로 써요."], ans: "표 ②에서 50번 중 빨간색에 34번으로 가장 많이 멈췄으니, 빨간색 부분이 가장 넓은 회전판 ㉢을 돌렸을 가능성이 높아요." }) },
    { name: "약속하기 — 말과 수, 평균 활용", inst: "예나가 보고회에서 낸 문제예요. 풀어 보세요.", hints: ["1부터 10까지의 짝수는 2, 4, 6, 8, 10으로 5장이에요.", "모둠 한 개의 평균 × 모둠의 수 = 전체 종이꽃 수"],
      render: (b, a) => av6Ask(b, a, [
        { q: "1부터 10까지의 수 카드 10장이 든 상자에서 카드 한 장을 꺼내요.", parts: ["짝수일 가능성을 말로: ", { o: AV6_W3, a: 1 }, h("br"), "11 이상일 가능성을 수로: ", { o: AV6_N3, a: 0 }] },
        { q: "청팀은 모둠 6개가 응원 종이꽃을 모둠마다 평균 45개씩, 백팀은 모둠 5개가 모둠마다 평균 56개씩 만들었어요. 종이꽃을 더 많이 만든 팀은?",
          parts: ["청팀: 45 × 6 = ", { n: 270 }, "(개), 백팀: 56 × 5 = ", { n: 280 }, "(개) → 더 많이 만든 팀은 ", { o: ["청팀", "백팀"], a: 1, why: { "0": "모둠 수는 청팀이 많지만 전체 종이꽃 수를 구해 비교해요." } }] }],
        { ok: "짝수는 반반이다, 11 이상은 0이에요. 청팀 270개, 백팀 280개라서 백팀이 더 많이 만들었어요." }) },
    { name: "확인하기 — 처음 궁금증 돌아보기", inst: "1차시에 붙인 ‘궁금해요’ 쪽지를 다시 보고, 운동회 준비를 마무리하는 글을 써 보세요.", hints: ["궁금했던 것을 이제 평균이나 가능성으로 답할 수 있는지 살펴봐요.", "직접 고르게 하거나 던져 본 활동을 떠올려요."],
      render: wonderRecall((b, a) => writeStep(b, a, [
        { q: "1차시에 궁금했던 것 하나에 이제 답해 보세요.", tag: "궁금증에 답하기", ph: "예) 모둠을 대표하는 기록을 어떻게 정할지 궁금했어요. ~", help: ["① 궁금했던 것을 하나 골라요. → ② 배운 방법(평균 구하기, 가능성을 말과 수로 나타내기)으로 답해요.", "‘~이 궁금했어요. 이제 ~하면 된다는 것을 알아요. 예를 들어 ~.’ 꼴로 써요."], ans: "기록이 모두 다를 때 모둠을 대표하는 기록을 어떻게 정할지 궁금했어요. 이제 기록을 모두 더해 사람 수로 나누어 평균을 구하면 된다는 것을 알아요. 예를 들어 깃발 수 6, 9, 7, 6의 평균은 28÷4=7(개)예요." },
        { q: "운동회를 준비하며 가장 기억에 남는 평균이나 가능성 활동을 소개해 보세요.", tag: "기억에 남는 활동", ph: "예) 청팀과 백팀의 공 넣기 기록을 비교한 것이 ~", help: ["① 가장 기억에 남는 활동을 골라요. → ② 무엇을 알게 되었는지 차례대로 써요.", "‘~을 했어요. ~해 보니 ~라는 것을 알게 되었어요.’ 꼴로 써요."], ans: "청팀과 백팀의 공 넣기 기록을 비교했어요. 백팀의 합계가 더 컸지만 평균을 구해 보니 청팀이 8개, 백팀이 7개라서, 사람 수가 다르면 평균으로 비교해야 한다는 것을 알게 되었어요." }])) }
  ],
  challenge: { inst: "운동회 마지막 놀이 문제예요. 평균과 가능성을 모두 써서 해결해 보세요.", hints: ["4명의 평균이 6이 되려면 네 수의 합은 6×4=24예요.", "주사위 눈 1~6 중 6은 1가지, 3 이상은 4가지예요."],
    render: (b, a) => av6Chain(b, a, [
      (bx, ax) => av6Ask(bx, ax, [{ q: "1부터 9까지의 수 카드 9장 중 모둠원 3명이 2, 8, 5를 뽑았어요. 남은 카드에서 한 장을 더 가져와 4장의 평균이 6이 되게 하려면 어떤 카드를 가져와야 할까요?", parts: [{ n: 9, why: { "6": "평균이 6이 되려면 네 수의 합이 24여야 해요. 2+8+5=15이니까 24−15를 계산해요." } }, " 카드를 가져오면 평균이 정확히 6이에요."] }], { ok: "6×4=24, 24−(2+8+5)=9예요. 9를 가져오면 평균이 6이에요." }),
      (bx, ax) => { bx.append(h("p", { class: "inst" }, "주사위 한 개를 던졌을 때 나온 눈의 수가 … 가능성을 가능성 띠에 놓아 보세요."));
        av6Scale(bx, ax, { nums: true, cards: [
          { t: "7일 가능성", a: 0 }, { t: "6일 가능성", a: 1, why: { "0": "6은 주사위에 있어요. 6가지 중 1가지예요.", "2": "6은 6가지 중 1가지뿐이라 반반보다 낮아요." } }, { t: "짝수일 가능성", a: 2 }, { t: "3 이상일 가능성", a: 3, why: { "2": "3, 4, 5, 6으로 6가지 중 4가지라서 반반보다 높아요.", "4": "1이나 2가 나오면 3 이상이 아니에요." } }, { t: "6 이하일 가능성", a: 4 }],
          ok: "7은 불가능하다(0), 6은 ~아닐 것 같다, 짝수는 반반이다([1/2]), 3 이상은 ~일 것 같다, 6 이하는 확실하다(1)예요. 운동회 준비 끝!" }); }]) }
}
];
