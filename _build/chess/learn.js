/* 체스 학습관 공통 틀 — 차시 목록(진도 지도) · 차시 진행(설명·예시·따라 하기·연습·마무리) · 저절로 힌트 · 읽어 주기 · 확인 시험 · 다시 보기 · 수료증
   마당 자료는 window.MADANG = {id:'m1', no:1, title, rank:'폰', units:[{title, lessons:[…]}]}  (m1.js …)
   차시 = {id, title, goal, kind:'easy'|'one'|'deep', screens:[…], practice:{n, gen(R)}, sum}
   화면 = {t:'say', text, board, big} | {t:'ex', text, board, frames:[{pos, marks, arrows, mv:[from,to], cap}]} | {t:'do', task}
   문제(task) = {type:'click'|'pick'|'place', q, board:{pos, marks, arrows, coords, swap, flip}, ans, all, opts, tray, need, hint:[글, {text, marks}], why(답)→{text, marks}, ok:'맞혔을 때 풀이'} */
(function () {
  'use strict';
  var CH = window.CH, CB = window.CB, PC = window.PIECES, MD = window.MADANG;
  var KEY = 'hj-chess-v1';
  var TIMES = { easy: [10, 10, 10], one: [15, 15, 15], deep: [20, 20, 20] };
  var SPEED = { f: .5, n: 1, s: 2, off: 0 }, SPNAME = { f: '빠르게', n: '보통', s: '느긋하게', off: '끄기' };
  var RANKS = ['폰', '나이트', '비숍', '룩', '퀸', '킹'];
  var PHASE = { say: '📖 설명', ex: '👀 예시', do: '👆 따라 하기', pr: '✏️ 연습', sum: '⭐ 마무리' };

  /* ---------- 기록 ---------- */
  var DB = {};
  try { DB = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { DB = {}; }
  DB.l = DB.l || {}; DB.wr = DB.wr || {}; DB.pass = DB.pass || {}; DB.ex = DB.ex || {};
  if (DB.tts === undefined) DB.tts = 1; if (!DB.sp) DB.sp = 'n';
  function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { } }

  /* ---------- 차시 목록 ---------- */
  var LES = [];
  MD.units.forEach(function (u, ui) { u.lessons.forEach(function (l) { l.unit = ui; l.no = LES.length + 1; LES.push(l); }); });
  function done(l) { return !!DB.l[l.id]; }
  function open(i) { return DB.open || i === 0 || done(LES[i - 1]); }
  function allDone() { return LES.every(done); }

  /* ---------- 무작위 ---------- */
  var R = {
    int: function (n) { return Math.floor(Math.random() * n); },
    pick: function (a) { return a[R.int(a.length)]; },
    shuffle: function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = R.int(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; },
    sq: function () { return CH.name(R.int(64)); },
    /* 말 글자 목록을 빈 판에 흩어 놓기(폰은 1·8줄에 놓지 않음) → 64칸 배열 */
    scatter: function (list, avoid) {
      var b = CH.board('8/8/8/8/8/8/8/8'), used = {}; (avoid || []).forEach(function (s) { used[CH.idx(s)] = 1; });
      list.forEach(function (c) { var i, n = 0; do { i = R.int(64); n++; } while ((used[i] || (/p/i.test(c) && (i < 8 || i > 55))) && n < 500); used[i] = 1; b[i] = c; });
      return b;
    },
    opts: function (ans, pool, n) { var o = [ans]; R.shuffle(pool).forEach(function (x) { if (o.length < (n || 4) && o.indexOf(x) < 0) o.push(x); }); return R.shuffle(o); }
  };
  window.CSR = R;

  /* ---------- 읽어 주기 ---------- */
  var SS = window.speechSynthesis, voice = null;
  function pickVoice() { if (!SS) return; var v = SS.getVoices().filter(function (x) { return /^ko/i.test(x.lang); }); voice = v[0] || null; }
  if (SS) { pickVoice(); SS.onvoiceschanged = pickVoice; }
  function plain(t) { var d = document.createElement('div'); d.innerHTML = String(t || ''); return d.textContent.replace(/[←-⇿☀-➿️‍]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function canSpeak() { return !!(SS && DB.tts); }
  var spkId = 0;
  function speak(t, cb) {
    var my = ++spkId, txt = plain(t), fired = false;
    function fin() { if (fired || my !== spkId) return; fired = true; if (cb) cb(); }
    if (!canSpeak() || !txt) { if (cb) setTimeout(fin, 0); return; }
    try { SS.cancel(); } catch (e) { }
    var u = new SpeechSynthesisUtterance(txt); u.lang = 'ko-KR'; if (voice) u.voice = voice; u.rate = .95;
    u.onend = fin; u.onerror = fin;
    setTimeout(function () { try { SS.speak(u); } catch (e) { fin(); } }, 60);
    setTimeout(fin, (txt.length / 3 + 6) * 1000); /* 끝 알림이 오지 않을 때 */
  }
  function hush() { spkId++; try { if (SS) SS.cancel(); } catch (e) { } }

  /* ---------- 화면 뼈대 ---------- */
  var app = document.getElementById('csApp');
  (function () { var css = document.createElement('style'); css.id = 'csPcCss'; css.textContent = PC.CSS; document.head.appendChild(css); })(); /* 말 그림 색(판이 없는 화면에서도) */
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function btn(txt, cls, fn) { var b = h('button', 'cs-btn ' + (cls || ''), txt); b.type = 'button'; if (fn) b.onclick = fn; return b; }
  function stars(n) { var s = ''; for (var i = 0; i < 3; i++) s += i < n ? '★' : '☆'; return s; }
  function rankOf() { var r = ''; for (var i = 1; i <= 6; i++) if (DB.pass['m' + i]) r = RANKS[i - 1]; return r; }

  /* ---------- 힌트 타이머 ---------- */
  var HT = { lv: 0, t: 0, task: null, on: false, wait: 0 };
  function stopTimer() { clearTimeout(HT.t); HT.on = false; }
  function armTimer() {
    clearTimeout(HT.t); if (!HT.task || !HT.on || HT.lv >= 3) return;
    var sp = SPEED[DB.sp]; if (!sp) return;
    var sec = (TIMES[HT.task.kind] || TIMES.easy)[HT.lv] * sp;
    HT.t = setTimeout(function () { if (HT.task && HT.task.hint) HT.task.hint(HT.lv + 1, true); }, sec * 1000 + HT.wait);
    HT.wait = 0;
  }
  /* 문제가 나오면: 읽어 주기가 끝난 뒤, 또는 '읽을 시간'(글자 수 ÷ 5초, 최소 3초)이 지난 뒤부터 셈 */
  function startTimer(task, text, auto) {
    stopTimer(); HT.task = task; HT.lv = 0; if (!auto) return;
    var go = function () { if (HT.task === task) { HT.on = true; armTimer(); } };
    if (canSpeak()) speak(text, go);
    else { HT.wait = Math.max(3, plain(text).length / 5) * 1000; go(); }
  }
  ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, function () { if (HT.on) armTimer(); }, true); });

  /* ---------- 문제 하나 ---------- */
  /* host: 판 칸 + 글 칸, opt: {kind, auto(저절로 힌트), onEnd(firstTry)} */
  function runTask(T, view, panel, opt) {
    var tries = 0, revealed = false, finished = false, found = {}, hintMarks = {}, tray = (T.tray || []).slice(), pickT = -1, placed = {};
    var ans = T.ans === undefined ? [] : Array.isArray(T.ans) ? T.ans.slice() : [T.ans];
    var baseMarks = Object.assign({}, (T.board && T.board.marks) || {});
    var pos = T.board && T.board.pos !== undefined ? (typeof T.board.pos === 'string' ? CH.board(T.board.pos.split(' ')[0]) : T.board.pos.slice()) : CH.board('8/8/8/8/8/8/8/8');
    var q = h('div', 'cs-q', T.q), fb = h('div', 'cs-fb'), hb = h('div', 'cs-hint'), area = h('div', 'cs-area'), nextRow = h('div', 'cs-row');
    hb.hidden = true;
    panel.appendChild(q); panel.appendChild(area); panel.appendChild(hb); panel.appendChild(fb); panel.appendChild(nextRow);
    function draw(extra) {
      var m = {}; function add(src) { Object.keys(src || {}).forEach(function (k) { var key = typeof k === 'number' ? CH.name(k) : k; var v = src[k]; m[key] = (m[key] || []).concat(Array.isArray(v) ? v : [v]); }); }
      add(baseMarks); add(hintMarks); Object.keys(found).forEach(function (s) { add(objOf(s, 'ok')); }); add(extra);
      view.set({ pos: pos, marks: m, arrows: (T.board && T.board.arrows) || [], coords: T.board && T.board.coords !== undefined ? T.board.coords : true, swap: T.board && T.board.swap, flip: T.board && T.board.flip });
    }
    function objOf(k, v) { var o = {}; o[k] = v; return o; }
    var lastExtra = {};
    function show(extra) { lastExtra = extra || {}; draw(lastExtra); }
    /* 힌트 lv: 1 실마리, 2 더 큰 실마리, 3 답 보여 주기 */
    function hint(lv, auto) {
      if (finished || lv <= HT.lv && auto) return; lv = Math.min(3, lv); HT.lv = Math.max(HT.lv, lv);
      var H = (T.hint || [])[lv - 1], text, marks = {};
      if (lv === 3) { revealed = true; text = '정답을 보여 줄게요. ' + (T.type === 'pick' ? '반짝이는 답을 눌러 보세요.' : T.type === 'place' ? '반짝이는 칸에 놓아 보세요.' : '반짝이는 칸을 눌러 보세요.'); answerMarks(marks); }
      else if (H) { if (typeof H === 'string') text = H; else { text = H.text; marks = H.marks || {}; } }
      else text = lv === 1 ? '문제를 천천히 다시 읽어 보세요.' : '설명에서 본 것을 떠올려 보세요.';
      hintMarks = marks; hb.hidden = false; hb.innerHTML = '<b>💡 힌트 ' + lv + '</b> ' + text;
      if (T.type === 'pick') area.querySelectorAll('.cs-opt').forEach(function (b) { b.classList.toggle('cs-blink2', lv === 3 && ans.indexOf(b.dataset.v) >= 0); });
      if (T.type === 'place' && lv === 3) area.querySelectorAll('.cs-tray button').forEach(function (b, i) { b.classList.toggle('cs-blink2', i === 0); });
      draw(lastExtra);
      if (auto && canSpeak()) { HT.on = false; speak(text, function () { HT.on = true; armTimer(); }); } else armTimer();
    }
    function answerMarks(m) {
      if (T.type === 'click') ans.forEach(function (s) { if (!found[s]) m[s] = 'hint'; });
      if (T.type === 'place') { var want = tray[pickT >= 0 ? pickT : 0]; if (opt.once) { Object.keys(T.need).forEach(function (s) { if (!placed[s]) m[s] = 'hint'; }); return; } Object.keys(T.need).forEach(function (s) { if (!placed[s] && T.need[s] === want) m[s] = 'hint'; }); }
    }
    T.kind = T.kind || opt.kind; window.csNow = T; /* 점검(Playwright)용 */
    var timerTask = { kind: T.kind, hint: hint };
    function finish() {
      finished = true; stopTimer(); hb.hidden = true; hintMarks = {};
      var first = tries === 0 && !revealed;
      fb.className = 'cs-fb cs-good'; fb.innerHTML = (first ? '<b>맞아요! 👏</b> ' : '<b>잘했어요.</b> ') + (T.ok || '');
      if (T.after) { pos = typeof T.after === 'string' ? CH.board(T.after) : T.after; }
      draw({});
      speak((first ? '맞아요! ' : '잘했어요. ') + plain(T.ok || ''));
      if (opt.onEnd) opt.onEnd(first, nextRow);
    }
    function wrong(info) {
      tries++; if (opt.onWrong) opt.onWrong();
      if (opt.once) { /* 확인 시험: 한 번에 끝, 정답만 보여 줌 */
        finished = true; stopTimer(); var am = {}; answerMarks(am); hintMarks = am;
        if (T.type === 'pick') area.querySelectorAll('.cs-opt').forEach(function (b) { b.disabled = true; if (ans.indexOf(b.dataset.v) >= 0) b.classList.add('cs-right'); });
        fb.className = 'cs-fb cs-badfb'; fb.innerHTML = '<b>아쉬워요.</b> ' + ((info || {}).text || '') + (T.type === 'click' ? ' 반짝이는 칸이 정답이에요.' : T.type === 'pick' ? ' 초록 답이 정답이에요.' : '');
        show((info || {}).marks || {}); if (opt.onEnd) opt.onEnd(false, nextRow); return;
      }
      fb.className = 'cs-fb cs-badfb';
      var w = info || {}; fb.innerHTML = '<b>' + (tries === 1 ? '다시 생각해 봐요.' : '괜찮아요, 같이 봐요.') + '</b> ' + (w.text || '');
      show(w.marks || {});
      if (tries === 1) { if (HT.lv < 1) hint(1); else speak(w.text || ''); }
      else if (!revealed) hint(3);
      else speak(w.text || '');
    }
    /* 고르기 */
    if (T.type === 'pick') {
      var row = h('div', 'cs-opts'); area.appendChild(row);
      T.opts.forEach(function (o) {
        var b = btn(o, 'cs-opt'); b.dataset.v = o; row.appendChild(b);
        b.onclick = function () {
          if (finished) return;
          if (ans.indexOf(o) >= 0) { b.classList.add('cs-right'); finish(); }
          else { b.classList.add('cs-wrong'); b.disabled = true; wrong(T.why ? T.why(o) : { text: '‘' + o + '’' + PC.jo(o, '이').slice(o.length) + ' 아니에요.' }); }
        };
      });
    }
    /* 놓기: 판 아래 말 상자에서 말을 고르고 칸을 누름 */
    function drawTray() {
      area.innerHTML = ''; if (!tray.length) return;
      var t = h('div', 'cs-tray'); area.appendChild(t);
      tray.forEach(function (c, i) {
        var b = btn('<svg viewBox="0 0 100 100" aria-hidden="true">' + PC.svg(c) + '</svg><span>' + (CH.isW(c) ? '백 ' : '흑 ') + PC.NAME[c.toUpperCase()] + '</span>', 'cs-tp' + (i === pickT ? ' cs-tp-on' : ''));
        b.onclick = function () { pickT = i; drawTray(); if (HT.lv >= 3) { var m = {}; answerMarks(m); hintMarks = m; draw(lastExtra); } }; t.appendChild(b);
      });
    }
    if (T.type === 'place') { pickT = 0; drawTray(); }
    view.onSq = function (i) {
      if (finished) return; var s = CH.name(i);
      if (T.type === 'click') {
        if (ans.indexOf(s) >= 0) {
          if (found[s]) return; found[s] = 1;
          if (!T.all || ans.every(function (a) { return found[a]; })) finish();
          else { fb.className = 'cs-fb cs-good'; fb.innerHTML = '좋아요! <b>' + Object.keys(found).length + '</b> / ' + ans.length + '칸 찾았어요.'; show({}); }
        } else wrong(T.why ? T.why(s) : T.board && T.board.coords === false ? { text: '그 칸이 아니에요.', marks: objOf(s, 'bad') } : { text: '그 칸은 <b>' + s + '</b>' + PC.jo(s, '이에요').slice(s.length) + '.', marks: objOf(s, ['bad', { t: 'label', s: s, small: 1 }]) });
      } else if (T.type === 'place') {
        if (pickT < 0) { fb.className = 'cs-fb'; fb.textContent = '먼저 아래에서 놓을 말을 골라요.'; return; }
        var c = tray[pickT];
        if (T.need[s] === c && !placed[s]) {
          placed[s] = 1; pos[i] = c; tray.splice(pickT, 1); pickT = tray.length ? 0 : -1; drawTray();
          fb.className = 'cs-fb cs-good'; fb.innerHTML = '좋아요! ' + (tray.length ? '남은 말: ' + tray.length + '개' : '');
          hintMarks = {}; if (HT.lv >= 3) { var mm = {}; answerMarks(mm); hintMarks = mm; }
          show({}); if (!tray.length) finish();
        } else wrong(T.why ? T.why(s, c) : { text: PC.NAME[c.toUpperCase()] + '의 자리가 아니에요.', marks: objOf(s, 'bad') });
      }
    };
    show({});
    startTimer(timerTask, plain(T.q), opt.auto);
    return { hint: hint, stop: function () { finished = true; stopTimer(); } };
  }

  /* ---------- 공통 머리 ---------- */
  var cur = null, view = null;
  function clear(inLesson) {
    hush(); stopTimer(); HT.task = null; if (cur && cur.stop) cur.stop(); cur = null; app.innerHTML = '';
    document.body.classList.toggle('cs-inlesson', !!inLesson); /* 차시·시험 화면에서는 위 제목을 숨겨 판을 크게 */
    window.scrollTo(0, inLesson ? app.getBoundingClientRect().top + window.scrollY - 8 : 0);
  }
  function toolBtns(row, withHint, hintFn) {
    var tt = btn(DB.tts ? '🔊 읽어 주기 켜짐' : '🔇 읽어 주기 꺼짐', 'cs-tts', function () { DB.tts = DB.tts ? 0 : 1; save(); tt.innerHTML = DB.tts ? '🔊 읽어 주기 켜짐' : '🔇 읽어 주기 꺼짐'; if (!DB.tts) hush(); });
    tt.setAttribute('aria-pressed', DB.tts ? 'true' : 'false');
    if (!SS) { tt.disabled = true; tt.title = '이 브라우저는 읽어 주기를 지원하지 않아요.'; }
    row.appendChild(tt);
    if (withHint) row.appendChild(btn('💡 힌트', 'cs-hb', hintFn));
  }

  /* ---------- 진도 지도(차시 목록) ---------- */
  function hub() {
    clear();
    var n = LES.filter(done).length, rk = rankOf();
    var top = h('section', 'cs-hubtop');
    top.innerHTML = '<div class="cs-rank"><span class="cs-rk-ico">' + (rk ? '🏅' : '🌱') + '</span><div><b>' + (rk ? rk + ' 등급' : '아직 등급이 없어요') + '</b><small>마당 확인 시험을 통과하면 등급이 올라가요: 폰 → 나이트 → 비숍 → 룩 → 퀸 → 킹</small></div></div>' +
      '<div class="cs-prog"><div class="cs-prog-t">' + MD.no + '마당 · ' + MD.title + ' — ' + LES.length + '차시 중 <b>' + n + '</b>차시 마침</div><div class="cs-bar"><i style="width:' + Math.round(n / LES.length * 100) + '%"></i></div></div>';
    var row = h('div', 'cs-row cs-hubbtn');
    var nx = LES.findIndex(function (l) { return !done(l); });
    row.appendChild(btn(nx < 0 ? '✅ 모든 차시를 마쳤어요 · 확인 시험 보기' : (n ? '▶ 이어서 배우기: ' : '▶ 처음부터 배우기: ') + (nx < 0 ? '' : LES[nx].no + '. ' + LES[nx].title), 'cs-main', function () { location.hash = nx < 0 ? 'exam' : 'l' + LES[nx].no; }));
    if (n) row.appendChild(btn('🔁 다시 보기 3문제', '', function () { location.hash = 'review'; }));
    toolBtns(row);
    row.appendChild(btn('⚙️ 선생님 설정', '', settings));
    top.appendChild(row); app.appendChild(top);
    MD.units.forEach(function (u, ui) {
      var sec = h('section', 'cs-unit'); sec.appendChild(h('h2', 'cs-uh', '<span>' + (ui + 1) + '단원</span> ' + u.title));
      var path = h('div', 'cs-path');
      LES.filter(function (l) { return l.unit === ui; }).forEach(function (l) {
        var i = l.no - 1, ok = open(i), d = DB.l[l.id];
        var a = h('a', 'cs-node' + (d ? ' cs-done' : '') + (ok ? '' : ' cs-lock') + (i === nx ? ' cs-now' : ''));
        a.innerHTML = '<span class="cs-no">' + (ok ? l.no : '🔒') + '</span><span class="cs-nt">' + l.title + '</span><span class="cs-st" aria-label="별 ' + (d ? d.s : 0) + '개">' + (d ? stars(d.s) : '') + '</span>';
        if (ok) a.href = '#l' + l.no; else { a.setAttribute('aria-disabled', 'true'); a.title = '앞 차시를 마치면 열려요.'; }
        path.appendChild(a);
      });
      sec.appendChild(path); app.appendChild(sec);
    });
    var ex = h('section', 'cs-unit cs-examsec'), pass = DB.pass[MD.id];
    ex.innerHTML = '<h2 class="cs-uh"><span>마무리</span> ' + MD.no + '마당 확인 시험</h2><p>모든 차시를 마치면 열려요. ' + EXAM_N + '문제 중 ' + EXAM_PASS + '문제 이상 맞히면 통과, <b>' + MD.rank + ' 등급</b>을 받아요. 확인 시험에서는 힌트가 없어요.</p>';
    var er = h('div', 'cs-row');
    var eb = btn(pass ? '📝 확인 시험 다시 보기' : '📝 확인 시험 보기', allDone() || DB.open ? 'cs-main' : '', function () { location.hash = 'exam'; });
    if (!(allDone() || DB.open)) { eb.disabled = true; }
    er.appendChild(eb);
    if (DB.ex[MD.id] !== undefined) er.appendChild(h('span', 'cs-best', '최고 점수 ' + DB.ex[MD.id] + ' / ' + EXAM_N + (pass ? ' · 통과 🏅' : '')));
    if (pass) er.appendChild(btn('🖨️ 수료증 만들기', '', function () { location.hash = 'cert'; }));
    ex.appendChild(er); app.appendChild(ex);
  }
  function settings() {
    var dl = h('div', 'cs-modal'), box = h('div', 'cs-mbox');
    box.innerHTML = '<h2>⚙️ 선생님 설정</h2><p class="cs-small">이 기기에만 저장돼요.</p><h3>저절로 나오는 힌트</h3><p class="cs-small">아무 움직임이 없을 때 힌트가 나오는 시간이에요. 보통: 쉬운 문제 10초씩 · 한 수 생각 15초씩 · 깊은 생각 20초씩.</p>';
    var r1 = h('div', 'cs-row');
    Object.keys(SPNAME).forEach(function (k) { var b = btn(SPNAME[k] + (k === 'f' ? ' (절반)' : k === 's' ? ' (두 배)' : ''), DB.sp === k ? 'cs-main' : '', function () { DB.sp = k; save(); dl.remove(); settings(); }); b.setAttribute('aria-pressed', DB.sp === k); r1.appendChild(b); });
    box.appendChild(r1);
    box.appendChild(h('h3', '', '차시 열기'));
    var r2 = h('div', 'cs-row');
    r2.appendChild(btn(DB.open ? '🔒 차례대로 열기로 되돌리기' : '🔓 모든 차시 열기', '', function () { DB.open = DB.open ? 0 : 1; save(); dl.remove(); route(); }));
    r2.appendChild(btn('🗑️ 이 기기의 체스 기록 지우기', '', function () { if (confirm('이 기기에 저장된 체스 학습관 기록(별·시험 점수·등급)을 모두 지울까요?')) { var t = DB.tts, s = DB.sp; DB = { l: {}, wr: {}, pass: {}, ex: {}, tts: t, sp: s }; save(); dl.remove(); route(); } }));
    box.appendChild(r2);
    var cl = btn('닫기', 'cs-main', function () { dl.remove(); }); var r3 = h('div', 'cs-row'); r3.appendChild(cl); box.appendChild(r3);
    dl.appendChild(box); dl.onclick = function (e) { if (e.target === dl) dl.remove(); }; document.body.appendChild(dl); cl.focus();
  }

  /* ---------- 차시 진행 ---------- */
  function lessonView(l) {
    clear(true);
    var steps = l.screens.slice(), nPr = l.practice ? l.practice.n : 0;
    steps = steps.concat(nPr ? [{ t: 'pr' }] : []).concat([{ t: 'sum' }]);
    var si = 0, score = { ok: 0, n: 0 };
    var top = h('div', 'cs-ltop');
    var back = btn('← 차시 목록', 'cs-back', function () { location.hash = ''; });
    top.appendChild(back);
    top.appendChild(h('div', 'cs-lt', '<small>' + MD.no + '마당 · ' + (l.unit + 1) + '단원 · ' + l.no + '차시</small><b>' + l.title + '</b>'));
    var tools = h('div', 'cs-row cs-tools'); toolBtns(tools, true, function () { if (cur && cur.hint) cur.hint(HT.lv + 1); else if (cur && cur.noHint) cur.noHint(); }); top.appendChild(tools);
    app.appendChild(top);
    var ph = h('div', 'cs-phases'); app.appendChild(ph);
    var run = h('div', 'cs-run'), bh = h('div', 'cs-bwrap'), panel = h('div', 'cs-panel');
    run.appendChild(bh); run.appendChild(panel); app.appendChild(run);
    view = CB.make(bh, { onSq: function (i, e) { if (view.onSq) view.onSq(i, e); } });
    var lastPh = '';
    function phases(t) {
      var order = ['say', 'ex', 'do', 'pr', 'sum'], have = {}; steps.forEach(function (s) { have[s.t] = 1; });
      ph.innerHTML = ''; order.forEach(function (k) { if (!have[k]) return; ph.appendChild(h('span', 'cs-ph' + (k === t ? ' cs-ph-now' : ''), PHASE[k])); });
      ph.appendChild(h('span', 'cs-ph-n', (si + 1) + ' / ' + steps.length));
    }
    function nav(canBack) {
      var row = h('div', 'cs-row cs-navrow');
      if (canBack && si > 0) row.appendChild(btn('◀ 이전 화면', 'cs-prev', function () { si--; go(); }));
      var n = btn(si === steps.length - 1 ? '✔ 차시 마치기' : '이어서 ▶', 'cs-main cs-go', function () { if (si === steps.length - 1) { location.hash = ''; } else { si++; go(); } });
      row.appendChild(n); return row;
    }
    var goId = 0;
    function go() {
      goId++; hush(); stopTimer(); HT.task = null; if (cur && cur.stop) cur.stop(); cur = null; view.onSq = null;
      var s = steps[si]; panel.innerHTML = ''; if (s.t !== lastPh) { lastPh = s.t; } phases(s.t);
      panel.appendChild(h('div', 'cs-phl', PHASE[s.t]));
      bh.hidden = false; run.classList.remove('cs-nob');
      if (s.t === 'say' || s.t === 'ex') {
        if (s.big) { var bg = h('div', 'cs-big'); s.big.forEach(function (c) { bg.appendChild(h('span', '', '<svg viewBox="0 0 100 100" aria-hidden="true">' + PC.svg(c) + '</svg>')); }); panel.appendChild(bg); }
        panel.appendChild(h('div', 'cs-text', s.text));
        if (s.board) view.set(Object.assign({ coords: true }, s.board)); else { bh.hidden = true; run.classList.add('cs-nob'); }
        var capEl = h('div', 'cs-cap'); panel.appendChild(capEl);
        if (s.t === 'ex' && s.frames) {
          var rp = btn('▶ 예시 다시 보기', 'cs-replay', function () { play(); }); var rr = h('div', 'cs-row'); rr.appendChild(rp); panel.appendChild(rr);
          var myGo = goId;
          var play = function () {
            if (goId !== myGo) return;
            var k = 0; hush(); view.set(Object.assign({ coords: true }, s.board));
            capEl.innerHTML = '';
            (function frame() {
              if (goId !== myGo || k >= s.frames.length) return;
              var f = s.frames[k++], b = Object.assign({ coords: true }, s.board, { marks: f.marks || {}, arrows: f.arrows || [] }); ['pos', 'swap', 'flip', 'coords'].forEach(function (x) { if (f[x] !== undefined) b[x] = f[x]; });
              var after = function () { if (f.cap) { capEl.innerHTML = f.cap; } if (canSpeak() && f.cap) speak(f.cap, function () { setTimeout(frame, 500); }); else setTimeout(frame, f.cap ? 1700 + plain(f.cap).length * 40 : 1200); };
              if (f.mv) { view.set(Object.assign({}, b, { pos: view.state.pos.slice(), marks: {}, arrows: [] })); view.anim(f.mv[0], f.mv[1], 650, function () { if (goId !== myGo) return; var p = view.state.pos.slice(); p[CH.idx(f.mv[1])] = p[CH.idx(f.mv[0])]; p[CH.idx(f.mv[0])] = '.'; b.pos = p; view.set(b); after(); }); }
              else { view.set(b); after(); }
            })();
          };
          if (canSpeak()) speak(s.text, function () { if (goId === myGo) play(); }); else setTimeout(play, 900);
        } else speak(s.text);
        panel.appendChild(nav(true));
      } else if (s.t === 'do') {
        var T = typeof s.task === 'function' ? s.task(R) : s.task;
        var nr = nav(true), gob = nr.querySelector('.cs-go'); gob.disabled = true;
        cur = runTask(T, view, panel, { kind: l.kind || 'easy', auto: true, onEnd: function () { gob.disabled = false; gob.focus(); } });
        panel.appendChild(nr);
      } else if (s.t === 'pr') practice();
      else if (s.t === 'sum') summary();
    }
    /* 연습: n문제, 두 번 틀린 문제는 비슷한 문제를 하나 더 */
    function practice() {
      var n = l.practice.n, k = 0, extra = 0;
      score = { ok: 0, n: n };
      function one(isExtra) {
        hush(); stopTimer(); if (cur && cur.stop) cur.stop(); panel.innerHTML = ''; phases('pr');
        panel.appendChild(h('div', 'cs-phl', PHASE.pr + ' <span class="cs-cnt">' + (isExtra ? '비슷한 문제 하나 더' : (k + 1) + ' / ' + n) + '</span>'));
        var T = l.practice.gen(R), wrongs = 0;
        var nr = h('div', 'cs-row cs-navrow');
        cur = runTask(T, view, panel, {
          kind: l.kind || 'easy', auto: true,
          onWrong: function () { wrongs++; },
          onEnd: function (first) {
            if (!isExtra) { if (first) score.ok++; k++; }
            if (!first) { DB.wr[l.id] = (DB.wr[l.id] || 0) + 1; save(); }
            var more = !isExtra && wrongs >= 2 && extra < 3;
            var b = btn(k >= n && !more ? '⭐ 마무리 보기' : '이어서 ▶', 'cs-main cs-go', function () { if (more) { extra++; one(true); } else if (k >= n) { si++; go(); } else one(false); });
            nr.appendChild(b); b.focus();
          }
        });
        panel.appendChild(nr);
      }
      one(false);
    }
    function summary() {
      var st = nPr ? (score.ok / score.n >= .9 ? 3 : score.ok / score.n >= .7 ? 2 : 1) : 3;
      if (nPr && !score.n) st = (DB.l[l.id] && DB.l[l.id].s) || 1; /* 연습을 건너뛰고 앞으로 돌아온 경우 */
      var old = DB.l[l.id]; DB.l[l.id] = { s: Math.max(st, old ? old.s : 0) }; save();
      view.set({ pos: CH.board('8/8/8/8/8/8/8/8'), marks: {}, coords: true });
      bh.hidden = true; run.classList.add('cs-nob');
      var box = h('div', 'cs-sum');
      box.innerHTML = '<div class="cs-bigstar">' + stars(st) + '</div>' + (nPr ? '<p>연습 ' + score.n + '문제 중 <b>' + score.ok + '</b>문제를 한 번에 맞혔어요.</p>' : '') +
        '<div class="cs-learned"><b>오늘 배운 것</b><p>' + l.sum + '</p></div>';
      panel.appendChild(box);
      speak('오늘 배운 것. ' + plain(l.sum));
      var row = h('div', 'cs-row cs-navrow');
      if (nPr) row.appendChild(btn('✏️ 연습 한 번 더', '', function () { si = steps.length - 2; go(); }));
      var nx = LES[l.no];
      row.appendChild(btn('📋 차시 목록', '', function () { location.hash = ''; }));
      if (nx) row.appendChild(btn('이어서 배우기 ▶ ' + nx.no + '. ' + nx.title, 'cs-main', function () { location.hash = 'l' + nx.no; }));
      else row.appendChild(btn('📝 확인 시험 보러 가기', 'cs-main', function () { location.hash = 'exam'; }));
      panel.appendChild(row); var mb = row.querySelector('.cs-main'); if (mb) mb.focus();
    }
    go();
  }

  /* ---------- 확인 시험 · 다시 보기 ---------- */
  var EXAM_N = MD.examN || 15, EXAM_PASS = Math.ceil(EXAM_N * .8);
  function quiz(kind) {
    clear(true);
    var pool = LES.filter(function (l) { return l.practice && (kind === 'exam' || done(l)); });
    var list;
    if (kind === 'exam') { list = []; var sh = R.shuffle(pool); while (list.length < EXAM_N) list = list.concat(R.shuffle(sh)); list = list.slice(0, EXAM_N).sort(function (a, b) { return a.no - b.no; }); }
    else { list = pool.slice().sort(function (a, b) { return ((DB.wr[b.id] || 0) - (DB.wr[a.id] || 0)) || (Math.random() - .5); }).slice(0, 6); list = R.shuffle(list).slice(0, 3); }
    if (!list.length) { location.hash = ''; return; }
    var top = h('div', 'cs-ltop'); top.appendChild(btn('← 차시 목록', 'cs-back', function () { location.hash = ''; }));
    top.appendChild(h('div', 'cs-lt', kind === 'exam' ? '<small>' + MD.no + '마당 · 힌트 없이 풀어요</small><b>📝 확인 시험</b>' : '<small>배운 차시에서 골랐어요</small><b>🔁 다시 보기</b>'));
    var tools = h('div', 'cs-row cs-tools'); toolBtns(tools, kind !== 'exam', function () { if (cur && cur.hint) cur.hint(HT.lv + 1); }); top.appendChild(tools);
    app.appendChild(top);
    var run = h('div', 'cs-run'), bh = h('div', 'cs-bwrap'), panel = h('div', 'cs-panel'); run.appendChild(bh); run.appendChild(panel); app.appendChild(run);
    view = CB.make(bh, { onSq: function (i, e) { if (view.onSq) view.onSq(i, e); } });
    var k = 0, ok = 0, miss = [];
    function one() {
      hush(); stopTimer(); if (cur && cur.stop) cur.stop(); panel.innerHTML = ''; bh.hidden = false; run.classList.remove('cs-nob');
      var l = list[k];
      panel.appendChild(h('div', 'cs-phl', (kind === 'exam' ? '📝 ' : '🔁 ') + (k + 1) + ' / ' + list.length + ' <span class="cs-cnt">' + l.no + '차시 ' + l.title + '</span>'));
      var T = l.practice.gen(R), nr = h('div', 'cs-row cs-navrow');
      if (kind === 'exam') { T.hint = []; }
      cur = runTask(T, view, panel, {
        kind: l.kind || 'easy', auto: kind !== 'exam', once: kind === 'exam',
        onEnd: function (first) {
          if (first) ok++; else { miss.push(l); if (kind !== 'exam') { DB.wr[l.id] = (DB.wr[l.id] || 0) + 1; save(); } }
          k++; var b = btn(k >= list.length ? '결과 보기 ▶' : '이어서 ▶', 'cs-main cs-go', function () { if (k >= list.length) result(); else one(); }); nr.appendChild(b); b.focus();
        }
      });
      if (kind === 'exam') cur.hint = null;
      panel.appendChild(nr);
    }
    function result() {
      hush(); stopTimer(); panel.innerHTML = ''; bh.hidden = true; run.classList.add('cs-nob');
      var box = h('div', 'cs-sum');
      if (kind === 'exam') {
        var pass = ok >= EXAM_PASS, before = DB.pass[MD.id];
        DB.ex[MD.id] = Math.max(DB.ex[MD.id] || 0, ok); if (pass) DB.pass[MD.id] = 1; save();
        box.innerHTML = '<div class="cs-bigstar">' + (pass ? '🏅' : '💪') + '</div><p class="cs-res">' + list.length + '문제 중 <b>' + ok + '</b>문제를 한 번에 맞혔어요.</p>' +
          (pass ? '<p><b>통과!</b> ' + (before ? '' : '이제 <b>' + MD.rank + ' 등급</b>이에요. ') + '수료증을 만들 수 있어요.</p>' : '<p>' + EXAM_PASS + '문제 이상이면 통과예요. 틀린 차시를 다시 보고 도전해요.</p>') +
          (miss.length ? '<div class="cs-learned"><b>다시 보면 좋은 차시</b><p>' + miss.filter(function (x, i, a) { return a.indexOf(x) === i; }).map(function (x) { return '<a href="#l' + x.no + '">' + x.no + '. ' + x.title + '</a>'; }).join(' · ') + '</p></div>' : '');
        speak(list.length + '문제 중 ' + ok + '문제를 맞혔어요. ' + (pass ? '통과예요!' : '다시 도전해요.'));
      } else {
        box.innerHTML = '<div class="cs-bigstar">🔁</div><p class="cs-res">' + list.length + '문제 중 <b>' + ok + '</b>문제를 한 번에 맞혔어요.</p><p>배운 것을 잊지 않게 가끔 다시 보기를 해요.</p>';
        speak(list.length + '문제 중 ' + ok + '문제를 맞혔어요.');
      }
      panel.appendChild(box);
      var row = h('div', 'cs-row cs-navrow');
      row.appendChild(btn(kind === 'exam' ? '📝 시험 한 번 더' : '🔁 다시 보기 한 번 더', '', function () { quiz(kind); }));
      if (kind === 'exam' && DB.pass[MD.id]) row.appendChild(btn('🖨️ 수료증 만들기', '', function () { location.hash = 'cert'; }));
      row.appendChild(btn('📋 차시 목록', 'cs-main', function () { location.hash = ''; }));
      panel.appendChild(row);
    }
    one();
  }

  /* ---------- 수료증 ---------- */
  function cert() {
    clear();
    if (!DB.pass[MD.id]) { location.hash = ''; return; }
    var top = h('div', 'cs-ltop'); top.appendChild(btn('← 차시 목록', 'cs-back', function () { location.hash = ''; })); top.appendChild(h('div', 'cs-lt', '<b>🖨️ 수료증 만들기</b>')); app.appendChild(top);
    var f = h('div', 'cs-certform');
    f.innerHTML = '<label>이름 <input id="csName" maxlength="12" autocomplete="off"></label>';
    var row = h('div', 'cs-row'); f.appendChild(row); app.appendChild(f);
    var c = h('div', 'cs-cert'); app.appendChild(c);
    var d = new Date(), ds = d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일';
    function draw() {
      var nm = (document.getElementById('csName').value || '').trim();
      c.innerHTML = '<div class="cs-cin"><div class="cs-cico"><svg viewBox="0 0 100 100" aria-hidden="true">' + PC.svg(MD.rankPc || 'P') + '</svg></div><h2>수 료 증</h2><p class="cs-cnm"><span>' + (nm ? nm.replace(/[<>&]/g, '') : '　') + '</span></p>' +
        '<p>위 어린이는 체스 학습관 <b>' + MD.no + '마당 「' + MD.title + '」</b>의 ' + LES.length + '차시를 모두 배우고<br>확인 시험을 통과하여 <b>' + MD.rank + ' 등급</b>이 되었기에 이 증서를 줍니다.</p><p class="cs-cdate">' + ds + '</p><p class="cs-cby">체스 학습관 · 초등교사 홍지희</p></div>';
    }
    var inp = document.getElementById('csName'); inp.value = DB.nm || ''; inp.oninput = function () { DB.nm = inp.value; save(); draw(); };
    row.appendChild(btn('🖨️ 인쇄하기', 'cs-main', function () { document.body.classList.add('cs-printcert'); window.print(); setTimeout(function () { document.body.classList.remove('cs-printcert'); }, 500); }));
    draw();
  }

  /* ---------- 주소로 화면 고르기 ---------- */
  function route() {
    var hs = location.hash.replace('#', ''), m = /^l(\d+)$/.exec(hs);
    if (m) { var i = +m[1] - 1; if (LES[i] && open(i)) return lessonView(LES[i]); location.hash = ''; return; }
    if (hs === 'exam') { if (allDone() || DB.open) return quiz('exam'); location.hash = ''; return; }
    if (hs === 'review') return quiz('review');
    if (hs === 'cert') return cert();
    hub();
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || /INPUT|TEXTAREA|BUTTON/.test((e.target || {}).tagName || '')) return;
    var g = app.querySelector('.cs-go:not([disabled])'); if (g) { e.preventDefault(); g.click(); }
  });
  route();
})();
