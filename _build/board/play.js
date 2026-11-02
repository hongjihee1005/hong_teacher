/* 판 놀이 공통 화면(사목·오셀로·장기): 인공지능과(단계 1~10, 한 수마다 시간) · 친구와 둘이. window.TOOL(host, api)
   규칙·인공지능은 엔진 window[TL.make]()(워커에서도 같은 글로 돌림), 판 그리기·누르기는 window.VIEW */
window.TOOL = function (host, api) {
  var D = window.TL, GAME = D.game, LVS = D.levels, KEY = 'hj-board-v1', V = window.VIEW, E = window[D.make](), SIDE = V.side;
  function ld() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { return {} } }
  function sv(o) { try { localStorage.setItem(KEY, JSON.stringify(o)) } catch (e) {} }
  var rec = ld(); rec[GAME] = rec[GAME] || { clear: 0, win: 0, lose: 0 };
  var R = rec[GAME];
  /* 워커: 엔진 글을 그대로 넣어 따로 계산(화면이 멈추지 않게). 안 되면 화면에서 계산 */
  var worker = null, wq = null;
  function mkWorker() {
    try {
      var src = window.ENG_SRC + '\nvar E=' + D.make + '();onmessage=function(e){postMessage({mv:E.ai(e.data.st,e.data.level)})}';
      worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
      worker.onmessage = function (e) { var f = wq; wq = null; if (f) f(e.data) };
      worker.onerror = function () { worker = null };
    } catch (e) { worker = null }
  }
  mkWorker();
  function ask(msg, cb) {
    if (worker) { wq = cb; worker.postMessage(msg); return }
    setTimeout(function () { cb({ mv: E.ai(msg.st, msg.level) }) }, 30);
  }
  function snd(f, d) { try { var A = snd.a = snd.a || new (window.AudioContext || window.webkitAudioContext)(), o = A.createOscillator(), g = A.createGain(); o.frequency.value = f; g.gain.value = .12; o.connect(g); g.connect(A.destination); o.start(); g.gain.exponentialRampToValueAtTime(.001, A.currentTime + d); o.stop(A.currentTime + d) } catch (e) {} }

  host.innerHTML = '<div class="bd-tabs" role="tablist"><button type="button" role="tab" class="bd-tab" data-m="ai">🤖 인공지능과</button><button type="button" role="tab" class="bd-tab" data-m="two">👫 친구와 둘이</button></div>' +
    '<div class="bd-setup"></div><div class="bd-play" hidden><div class="bd-top"></div><div class="bd-tbar" aria-hidden="true"><i></i></div><div class="bd-bwrap pg-' + GAME + '"><svg class="bd-svg" role="img" aria-label="판"></svg></div><p class="bd-msg" aria-live="polite"></p><p class="tl-row bd-ctl"></p></div>';
  var setup = host.querySelector('.bd-setup'), play = host.querySelector('.bd-play'), svg = host.querySelector('.bd-svg'), msgEl = host.querySelector('.bd-msg');
  var mode = 'ai', G = null;
  host.querySelectorAll('.bd-tab').forEach(function (b) { b.onclick = function () { stopAll(); mode = b.dataset.m; showSetup() } });
  function tabs() { host.querySelectorAll('.bd-tab').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.m === mode) }) }

  /* ── 시작 화면 ── */
  function showSetup() {
    tabs(); play.hidden = true; setup.hidden = false; G = null;
    if (mode === 'ai') {
      api.bar('인공지능과 · 단계 고르기');
      setup.innerHTML = '<p class="bd-intro">나는 <b>' + SIDE[0] + '(먼저)</b>, 인공지능은 <b>' + SIDE[1] + '</b>이에요. 한 수씩 번갈아 두고, 내 차례에는 <b>시간 제한</b>이 있어요(시간이 다 되면 그 판은 져요). 이기면 다음 단계가 열려요.</p>' +
        '<div class="bd-lvs">' + LVS.map(function (L, i) { var n = i + 1, lock = n > R.clear + 1, done = n <= R.clear; return '<button type="button" class="bd-lv' + (done ? ' bd-done' : '') + '" data-l="' + n + '"' + (lock ? ' disabled' : '') + '><b>' + (lock ? '🔒 ' : done ? '⭐ ' : '') + n + '단계</b><span>' + L.name + '</span><small>' + L.info + ' · 한 수 ' + L.t + '초' + (L.drawOk ? ' · 비겨도 통과' : '') + '</small></button>' }).join('') + '</div>' +
        '<p class="bd-rec">이긴 판 ' + R.win + ' · 진 판 ' + R.lose + ' · 깬 단계 ' + R.clear + '/10 <button type="button" class="tl-btn bd-unlock">🔓 선생님: 모든 단계 열기</button></p>';
      setup.querySelectorAll('.bd-lv').forEach(function (b) { b.onclick = function () { start({ mode: 'ai', level: +b.dataset.l }) } });
      setup.querySelector('.bd-unlock').onclick = function () { if (confirm('모든 단계를 열까요? (이 기기의 기록이 바뀌어요)')) { R.clear = Math.max(R.clear, 9); sv(rec); showSetup() } };
    } else {
      api.bar('친구와 둘이 · 준비');
      setup.innerHTML = '<p class="bd-intro">한 화면에서 둘이 번갈아 둬요. <b>' + SIDE[0] + '</b>이 먼저 둬요.</p>' +
        (V.opts || []).map(function (o) { return '<p class="tl-row"><b>' + o.label + '</b>' + o.choices.map(function (c, i) { return '<label class="bd-opt"><input type="radio" name="bdO' + o.id + '" value="' + c[0] + '"' + (i === (o.def || 0) ? ' checked' : '') + '> ' + c[1] + '</label>' }).join('') + '</p>' }).join('') +
        '<p class="tl-row"><b>한 수 시간</b>' + V.twoT.map(function (s, i) { return '<label class="bd-opt"><input type="radio" name="bdT" value="' + s + '"' + (i === 2 ? ' checked' : '') + '> ' + (s ? s + '초' : '없음') + '</label>' }).join('') + '</p>' +
        '<p class="tl-row"><label class="bd-opt">' + SIDE[0] + ' <input class="bd-nm" id="bdN1" value="친구 1" maxlength="10"></label><label class="bd-opt">' + SIDE[1] + ' <input class="bd-nm" id="bdN2" value="친구 2" maxlength="10"></label></p>' +
        '<p class="tl-row"><button type="button" class="tl-btn tl-go bd-go2">▶ 시작</button></p>';
      setup.querySelector('.bd-go2').onclick = function () {
        var opt = {}; (V.opts || []).forEach(function (o) { opt[o.id] = +setup.querySelector('input[name="bdO' + o.id + '"]:checked').value });
        start({ mode: 'two', opt: opt, t: +setup.querySelector('input[name="bdT"]:checked').value, names: [setup.querySelector('#bdN1').value || SIDE[0], setup.querySelector('#bdN2').value || SIDE[1]] });
      };
    }
  }

  /* ── 판 ── */
  function draw() {
    var ui = { sel: G.sel, human: humanTurn(), legal: humanTurn() ? G.legal : [], over: G.res, hov: G.hov };
    var z = V.size(); svg.setAttribute('viewBox', '0 0 ' + z[0] + ' ' + z[1]); svg.innerHTML = V.draw(G.st, ui, E);
  }
  function pt(e) { var r = svg.getBoundingClientRect(), z = V.size(); return [(e.clientX - r.left) * z[0] / r.width, (e.clientY - r.top) * z[1] / r.height] }
  svg.addEventListener('pointermove', function (e) { if (!G || !V.hover || e.pointerType !== 'mouse') return; var h = humanTurn() ? V.hover(G.st, pt(e), E) : null; if (h !== G.hov) { G.hov = h; draw() } });
  svg.addEventListener('pointerleave', function () { if (G && G.hov != null) { G.hov = null; draw() } });
  svg.addEventListener('click', function (e) {
    if (!G || !humanTurn()) return;
    var r = V.hit(G.st, { sel: G.sel, legal: G.legal }, pt(e), E);
    if (!r) return;
    if (r.msg) { msg(r.msg, 'bd-bad') }
    if ('sel' in r) { G.sel = r.sel; draw(); return }
    if ('mv' in r) human(r.mv);
  });

  /* ── 한 판 ── */
  var tick = null;
  function stopAll() { if (tick) { clearInterval(tick); tick = null } wq = null; if (worker && G && G.busy) { try { worker.terminate() } catch (e) {} worker = null; mkWorker() } if (G) G.busy = false }
  function names() { return G.cfg.mode === 'ai' ? ['나', '인공지능'] : G.cfg.names }
  function start(cfg) {
    stopAll(); setup.hidden = true; play.hidden = false; tabs();
    var L = cfg.mode === 'ai' ? LVS[cfg.level - 1] : null;
    G = { cfg: cfg, L: L, st: E.init(L ? L.opt : cfg.opt), hist: [], sel: null, hov: null, res: null };
    G.tsec = L ? L.t : cfg.t;
    api.bar(cfg.mode === 'ai' ? cfg.level + '단계 · ' + L.name : '친구와 둘이');
    ctl(); turnStart();
    setTimeout(function () { var r = play.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) play.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 50);
  }
  function humanTurn() { return G && !G.res && !G.busy && (G.cfg.mode === 'two' || G.st.turn === 1) }
  function top() {
    var nm = names(), ex = V.status ? V.status(G.st, E) : ['', ''];
    host.querySelector('.bd-top').innerHTML = [1, 2].map(function (c) { return '<span class="bd-pl' + (G.st.turn === c && !G.res ? ' bd-now' : '') + '"><i class="bd-chip pc-' + GAME + c + '"></i>' + SIDE[c - 1] + ' · ' + nm[c - 1] + (ex[c - 1] ? ' <small>' + ex[c - 1] + '</small>' : '') + '</span>' }).join('<span class="bd-vs">vs</span>') +
      (ex[2] ? '<span class="bd-komi">' + ex[2] + '</span>' : '') + '<span class="bd-clock"></span>';
  }
  function ctl() {
    var c = host.querySelector('.bd-ctl'), h = '';
    if (G.cfg.mode === 'two') h += '<button type="button" class="tl-btn bd-undo">↶ 무르기</button>';
    h += '<button type="button" class="tl-btn bd-resign">🏳️ 그만두기(기권)</button><button type="button" class="tl-btn bd-home">↩ 처음 화면</button>';
    c.innerHTML = h;
    var u = c.querySelector('.bd-undo'); if (u) u.onclick = undo;
    c.querySelector('.bd-resign').onclick = function () { if (G.res) return; if (confirm('이 판을 그만둘까요? (기권하면 상대가 이겨요)')) end({ w: G.cfg.mode === 'ai' ? 2 : 3 - G.st.turn, why: '기권했어요.' }) };
    c.querySelector('.bd-home').onclick = function () { if (!G.res && !confirm('이 판을 그만두고 처음 화면으로 갈까요?')) return; stopAll(); showSetup() };
  }
  function msg(t, cls) { msgEl.innerHTML = t || ''; msgEl.className = 'bd-msg' + (cls ? ' ' + cls : '') }
  /* 차례가 바뀔 때: 끝났는지 → 둘 곳이 없으면 넘기기 → 인공지능 / 사람(시간 재기) */
  function turnStart(note) {
    if (tick) { clearInterval(tick); tick = null }
    G.sel = null; G.hov = null;
    var o = E.over(G.st); if (o) { G.legal = []; draw(); return end(o) }
    G.legal = E.moves(G.st);
    if (!G.legal.length) {   // 둘 곳이 없음 → 한 번 넘김
      var who = G.cfg.mode === 'ai' ? (G.st.turn === 1 ? '나' : '인공지능') : names()[G.st.turn - 1];
      G.hist.push(G.st); G.st = E.play(G.st, -1);
      return turnStart('↪️ ' + who + '는 둘 곳이 없어서 차례를 넘겨요.');
    }
    top(); draw();
    var bar = host.querySelector('.bd-tbar i'), clk = host.querySelector('.bd-clock'), extra = V.note ? V.note(G.st, E) : '';
    var pre = (note ? note + ' ' : '') + (extra ? extra + ' ' : '');
    if (G.cfg.mode === 'ai' && G.st.turn === 2) { bar.style.width = '0'; clk.textContent = ''; return aiMove(pre) }
    msg(pre + (G.cfg.mode === 'ai' ? '내 차례예요. ' + V.how : names()[G.st.turn - 1] + '(' + SIDE[G.st.turn - 1] + ') 차례예요.'), /⚠️/.test(extra) ? 'bd-bad' : '');
    if (!G.tsec) { bar.style.width = '0'; clk.textContent = ''; return }
    var left = G.tsec, t0 = Date.now();
    bar.style.width = '100%'; bar.className = ''; clk.textContent = '⏱️ ' + left + '초';
    tick = setInterval(function () {
      var l = G.tsec - (Date.now() - t0) / 1000; bar.style.width = Math.max(0, l / G.tsec * 100) + '%'; bar.className = l <= 5 ? 'bd-hurry' : ''; clk.textContent = '⏱️ ' + Math.max(0, Math.ceil(l)) + '초';
      if (l <= 5 && Math.ceil(l) !== left) { left = Math.ceil(l); if (left > 0) snd(880, .08) }
      if (l <= 0) { clearInterval(tick); tick = null; end({ w: 3 - G.st.turn, why: '시간이 다 됐어요.' }) }
    }, 200);
  }
  function undo() {
    if (!G.hist.length || G.res) return;
    G.st = G.hist.pop(); while (G.hist.length && !E.moves(G.st).length) G.st = G.hist.pop();   // 넘긴 차례도 함께 되돌림
    turnStart();
  }
  function human(mv) {
    if (G.legal.indexOf(mv) < 0) return;
    G.hist.push(G.st); G.st = E.play(G.st, mv); snd(520, .05); turnStart();
  }
  function aiMove(pre) {
    G.busy = true; msg(pre + '🤖 인공지능이 생각하고 있어요…', /⚠️/.test(pre) ? 'bd-bad' : ''); var t0 = Date.now(), want = G;
    ask({ st: G.st, level: G.cfg.level }, function (r) {
      setTimeout(function () { if (G !== want || G.res) return; G.busy = false; G.st = E.play(G.st, G.legal.indexOf(r.mv) >= 0 ? r.mv : G.legal[0]); snd(400, .05); turnStart() }, Math.max(0, 500 - (Date.now() - t0)));
    });
  }
  function end(o) {
    if (G.res) return; G.res = o; if (tick) { clearInterval(tick); tick = null } G.busy = false; top(); draw();
    var nm = names(), w = o.w, t;
    if (G.cfg.mode === 'ai') {
      if (w === 1) { R.win++; var lv = G.cfg.level, newly = lv > R.clear; if (newly) R.clear = lv; t = '🏆 이겼어요! ' + o.why + (newly && lv < 10 ? ' — ' + (lv + 1) + '단계가 열렸어요!' : lv === 10 ? ' — 10단계까지 모두 깼어요! 🎉' : ''); snd(660, .15); setTimeout(function () { snd(880, .3) }, 160) }
      else if (w === 2) { R.lose++; t = '😢 졌어요. ' + o.why + ' 다시 도전해 봐요!'; snd(260, .4) }
      else if (G.L.drawOk) { var lv2 = G.cfg.level, nw = lv2 > R.clear; if (nw) R.clear = lv2; t = '🤝 비겼어요. ' + o.why + ' 이 단계는 비기기만 해도 통과예요!' + (nw && lv2 < 10 ? ' — ' + (lv2 + 1) + '단계가 열렸어요!' : lv2 === 10 ? ' — 10단계까지 모두 깼어요! 🎉' : ''); w = -1 }
      else t = '🤝 비겼어요. ' + o.why;
      sv(rec);
    } else t = w ? '🏆 ' + nm[w - 1] + '(' + SIDE[w - 1] + ') 승리! ' + o.why : '🤝 비겼어요. ' + o.why;
    msg(t, w === 1 || w === -1 || G.cfg.mode === 'two' ? 'bd-ok' : 'bd-bad');
    var c = host.querySelector('.bd-ctl'), lvl = G.cfg.level;
    c.innerHTML = '<button type="button" class="tl-btn tl-go bd-again">🔁 한 판 더</button>' + (G.cfg.mode === 'ai' && (w === 1 || w === -1) && lvl < 10 ? '<button type="button" class="tl-btn tl-go bd-up">⬆ ' + (lvl + 1) + '단계 도전</button>' : '') + '<button type="button" class="tl-btn bd-home">↩ 처음 화면</button>';
    c.querySelector('.bd-again').onclick = function () { start(G.cfg) };
    var up = c.querySelector('.bd-up'); if (up) up.onclick = function () { start({ mode: 'ai', level: lvl + 1 }) };
    c.querySelector('.bd-home').onclick = function () { stopAll(); showSetup() };
  }
  showSetup();
};
