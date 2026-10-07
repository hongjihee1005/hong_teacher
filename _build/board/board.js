/* 오목·바둑 화면: 인공지능과(단계 1~10, 한 수마다 시간) · 친구와 둘이. window.TOOL(host, api) */
window.TOOL = function (host, api) {
  var D = window.TL, GAME = D.game, LVS = D.levels, KEY = 'hj-board-v1';
  function ld() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { return {} } }
  function sv(o) { try { localStorage.setItem(KEY, JSON.stringify(o)) } catch (e) {} }
  var rec = ld(); rec[GAME] = rec[GAME] || { clear: 0, win: 0, lose: 0 };
  var R = rec[GAME], OM = GAME === 'omok' ? makeOmok() : null, BD = GAME === 'baduk' ? makeBaduk() : null;
  /* 워커: 엔진 글을 그대로 넣어 따로 계산(화면이 멈추지 않게). 안 되면 화면에서 계산 */
  var worker = null, wq = null;
  function mkWorker() {
    try {
      var src = window.ENG_SRC + '\nvar E=' + (OM ? 'makeOmok()' : 'makeBaduk()') + ';onmessage=function(e){var d=e.data,r;' +
        (OM ? 'r={p:E.ai(d.b,d.me,d.level,d.rule33)};' : 'var S=d.S;S.b=new Int8Array(S.b);if(d.cmd==="own"){var o=E.owner(S,d.k);r={own:Array.prototype.slice.call(o)}}else{r=E.mcts(S,d.it,d.komi,d.ms);r.kids=null}') + 'postMessage(r)}';
      worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
      worker.onmessage = function (e) { var f = wq; wq = null; if (f) f(e.data) };
      worker.onerror = function () { worker = null };
    } catch (e) { worker = null }
  }
  mkWorker();
  function ask(msg, cb) {
    if (worker) { wq = cb; worker.postMessage(msg); return }
    setTimeout(function () { var r; if (OM) r = { p: OM.ai(msg.b, msg.me, msg.level, msg.rule33) }; else { var S = msg.S; S.b = new Int8Array(S.b); if (msg.cmd === 'own') r = { own: BD.owner(S, msg.k) }; else r = BD.mcts(S, msg.it, msg.komi, msg.ms) } cb(r) }, 30);
  }
  function snd(f, d) { try { var A = snd.a = snd.a || new (window.AudioContext || window.webkitAudioContext)(), o = A.createOscillator(), g = A.createGain(); o.frequency.value = f; g.gain.value = .12; o.connect(g); g.connect(A.destination); o.start(); g.gain.exponentialRampToValueAtTime(.001, A.currentTime + d); o.stop(A.currentTime + d) } catch (e) {} }

  host.innerHTML = '<div class="bd-tabs" role="tablist"><button type="button" role="tab" class="bd-tab" data-m="ai">🤖 인공지능과</button><button type="button" role="tab" class="bd-tab" data-m="two">👫 친구와 둘이</button></div>' +
    '<div class="bd-setup"></div><div class="bd-play" hidden><div class="bd-top"></div><div class="bd-tbar" aria-hidden="true"><i></i></div><div class="bd-bwrap"><svg class="bd-svg" role="img" aria-label="판"></svg></div><p class="bd-msg" aria-live="polite"></p><p class="tl-row bd-ctl"></p></div>';
  var setup = host.querySelector('.bd-setup'), play = host.querySelector('.bd-play'), svg = host.querySelector('.bd-svg'), msgEl = host.querySelector('.bd-msg');
  var mode = 'ai', G = null;   // G: 지금 판
  host.querySelectorAll('.bd-tab').forEach(function (b) { b.onclick = function () { stopAll(); mode = b.dataset.m; showSetup() } });
  function tabs() { host.querySelectorAll('.bd-tab').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.m === mode) }) }

  /* ── 시작 화면 ── */
  function showSetup() {
    tabs(); play.hidden = true; setup.hidden = false; G = null;
    if (mode === 'ai') {
      api.bar('인공지능과 · 단계 고르기');
      setup.innerHTML = '<p class="bd-intro">나는 <b>흑(먼저)</b>, 인공지능은 <b>백</b>이에요. 한 수씩 번갈아 두고, 내 차례에는 <b>시간 제한</b>이 있어요(시간이 다 되면 그 판은 져요). 이기면 다음 단계가 열려요.</p>' +
        '<div class="bd-lvs">' + LVS.map(function (L, i) { var n = i + 1, lock = n > R.clear + 1, done = n <= R.clear; return '<button type="button" class="bd-lv' + (done ? ' bd-done' : '') + '" data-l="' + n + '"' + (lock ? ' disabled' : '') + '><b>' + (lock ? '🔒 ' : done ? '⭐ ' : '') + n + '단계</b><span>' + L.name + '</span><small>' + L.info + ' · 한 수 ' + L.t + '초</small></button>' }).join('') + '</div>' +
        '<p class="bd-rec">이긴 판 ' + R.win + ' · 진 판 ' + R.lose + ' · 깬 단계 ' + R.clear + '/10 <button type="button" class="tl-btn bd-unlock">🔓 선생님: 모든 단계 열기</button></p>';
      setup.querySelectorAll('.bd-lv').forEach(function (b) { b.onclick = function () { start({ mode: 'ai', level: +b.dataset.l }) } });
      setup.querySelector('.bd-unlock').onclick = function () { if (confirm('모든 단계를 열까요? (이 기기의 기록이 바뀌어요)')) { R.clear = Math.max(R.clear, 9); sv(rec); showSetup() } };
    } else {
      api.bar('친구와 둘이 · 준비');
      var o = GAME === 'omok' ? '<p class="tl-row"><b>규칙</b><label class="bd-opt"><input type="checkbox" id="bdR33" checked> 쌍삼(3·3) 금지</label></p>' :
        '<p class="tl-row"><b>판</b>' + [['c1', '따먹기 7줄 · 1개'], ['c3', '따먹기 7줄 · 3개'], ['c5', '따먹기 9줄 · 5개'], ['n9', '9줄 바둑'], ['n13', '13줄 바둑']].map(function (x, i) { return '<label class="bd-opt"><input type="radio" name="bdKind" value="' + x[0] + '"' + (i === 3 ? ' checked' : '') + '> ' + x[1] + '</label>' }).join('') + '</p><p class="tl-row"><b>덤(백에게 더하는 집)</b>' + ['0', '6.5'].map(function (x, i) { return '<label class="bd-opt"><input type="radio" name="bdKomi" value="' + x + '"' + (i ? ' checked' : '') + '> ' + x + '</label>' }).join('') + '</p>';
      setup.innerHTML = '<p class="bd-intro">한 화면에서 둘이 번갈아 둬요. <b>흑</b>이 먼저 둬요.</p>' + o +
        '<p class="tl-row"><b>한 수 시간</b>' + [0, 20, 30, 60].map(function (s, i) { return '<label class="bd-opt"><input type="radio" name="bdT" value="' + s + '"' + (i === 2 ? ' checked' : '') + '> ' + (s ? s + '초' : '없음') + '</label>' }).join('') + '</p>' +
        '<p class="tl-row"><label class="bd-opt">흑 <input class="bd-nm" id="bdN1" value="친구 1" maxlength="10"></label><label class="bd-opt">백 <input class="bd-nm" id="bdN2" value="친구 2" maxlength="10"></label></p>' +
        '<p class="tl-row"><button type="button" class="tl-btn tl-go bd-go2">▶ 시작</button></p>';
      setup.querySelector('.bd-go2').onclick = function () {
        var t = +setup.querySelector('input[name="bdT"]:checked').value, c = { mode: 'two', t: t, names: [setup.querySelector('#bdN1').value || '흑', setup.querySelector('#bdN2').value || '백'] };
        if (GAME === 'omok') c.rule33 = setup.querySelector('#bdR33').checked;
        else { var k = setup.querySelector('input[name="bdKind"]:checked').value; c.n = k[0] === 'c' ? (k === 'c5' ? 9 : 7) : +k.slice(1); c.goal = k[0] === 'c' ? +k[1] : 0; c.komi = c.goal ? 0 : +setup.querySelector('input[name="bdKomi"]:checked').value }
        start(c);
      };
    }
  }

  /* ── 판 그리기 ── */
  var CELL = 40, M = 30;
  function geo() { var n = G.n; return { n: n, size: M * 2 + CELL * (n - 1) } }
  function xy(i) { return M + i * CELL }
  function stars(n) { var s = n === 15 ? [3, 7, 11] : n === 13 ? [3, 6, 9] : n === 9 ? [2, 4, 6] : n === 7 ? [3] : []; var o = []; s.forEach(function (a) { s.forEach(function (b) { if (n !== 9 || (a !== 4) === (b !== 4) || (a === 4 && b === 4)) o.push([a, b]) }) }); return o }
  function draw() {
    var g = geo(), n = g.n, h = '<rect x="0" y="0" width="' + g.size + '" height="' + g.size + '" rx="14" class="bd-wood"/>';
    for (var i = 0; i < n; i++) h += '<line x1="' + xy(0) + '" y1="' + xy(i) + '" x2="' + xy(n - 1) + '" y2="' + xy(i) + '" class="bd-ln"/><line x1="' + xy(i) + '" y1="' + xy(0) + '" x2="' + xy(i) + '" y2="' + xy(n - 1) + '" class="bd-ln"/>';
    stars(n).forEach(function (s) { h += '<circle cx="' + xy(s[0]) + '" cy="' + xy(s[1]) + '" r="4" class="bd-star"/>' });
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var v = get(x, y), dead = G.score && G.dead && G.dead[pidx(x, y)], tr = G.score && G.score.terr[pidx(x, y)];
      if (v) h += '<circle cx="' + xy(x) + '" cy="' + xy(y) + '" r="' + (CELL * .46) + '" class="bd-st bd-s' + v + (dead ? ' bd-dead' : '') + '"/>';
      if (G.score && tr && (!v || dead)) h += '<rect x="' + (xy(x) - 7) + '" y="' + (xy(y) - 7) + '" width="14" height="14" class="bd-terr bd-t' + tr + '"/>';
    }
    if (G.last != null && G.last >= 0) { var lx = G.last % n, ly = (G.last / n) | 0; h += '<circle cx="' + xy(lx) + '" cy="' + xy(ly) + '" r="6" class="bd-lastm"/>' }
    if (G.warn != null) h += '<circle cx="' + xy(G.warn % n) + '" cy="' + xy((G.warn / n) | 0) + '" r="' + (CELL * .42) + '" class="bd-warn"/>';
    h += '<circle class="bd-ghost bd-s' + G.turn + '" r="' + (CELL * .44) + '" cx="-99" cy="-99"/>';
    svg.setAttribute('viewBox', '0 0 ' + g.size + ' ' + g.size); svg.innerHTML = h;
  }
  function pidx(x, y) { return (y + 1) * (G.n + 2) + (x + 1) }
  function get(x, y) { return OM ? G.b[y * 15 + x] : G.S.b[pidx(x, y)] }
  function pt(e) { var r = svg.getBoundingClientRect(), g = geo(), s = g.size / r.width, x = Math.round(((e.clientX - r.left) * s - M) / CELL), y = Math.round(((e.clientY - r.top) * s - M) / CELL); return x < 0 || y < 0 || x >= g.n || y >= g.n ? null : [x, y] }
  svg.addEventListener('pointermove', function (e) { if (!G || e.pointerType !== 'mouse') return; var g = svg.querySelector('.bd-ghost'), q = pt(e); if (!g) return; if (q && humanTurn() && !get(q[0], q[1])) { g.setAttribute('cx', xy(q[0])); g.setAttribute('cy', xy(q[1])) } else { g.setAttribute('cx', -99) } });
  svg.addEventListener('click', function (e) { if (!G) return; var q = pt(e); if (!q) return; if (G.score && G.cfg.mode === 'two' && !G.final) return toggleDead(q); if (humanTurn()) human(q[0], q[1]) });

  /* ── 한 판 ── */
  var tick = null;
  function stopAll() { if (tick) { clearInterval(tick); tick = null } wq = null; if (worker && G && G.busy) { try { worker.terminate() } catch (e) {} worker = null; mkWorker() } if (G) G.busy = false }
  function names() { return G.cfg.mode === 'ai' ? ['나', '인공지능'] : G.cfg.names }
  function start(cfg) {
    stopAll(); setup.hidden = true; play.hidden = false; tabs();
    var L = cfg.mode === 'ai' ? LVS[cfg.level - 1] : null;
    G = { cfg: cfg, L: L, turn: 1, last: -1, hist: [], over: false };
    if (OM) { G.n = 15; G.b = new Array(225).fill(0); G.rule33 = cfg.mode === 'ai' ? true : cfg.rule33 }
    else { G.n = L ? L.n : cfg.n; G.goal = L ? L.goal : cfg.goal; G.komi = L ? L.komi : cfg.komi; G.S = BD.init(G.n, G.goal) }
    G.tsec = L ? L.t : cfg.t;
    api.bar(cfg.mode === 'ai' ? cfg.level + '단계 · ' + L.name : '친구와 둘이');
    ctl(); top(); draw(); turnStart();
    setTimeout(function () { var r = play.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) play.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 50);
  }
  function humanTurn() { return G && !G.over && !G.busy && !G.score && (G.cfg.mode === 'two' || G.turn === 1) }
  function top() {
    var nm = names(), cap = BD ? G.S.cap : null;
    host.querySelector('.bd-top').innerHTML = [1, 2].map(function (c) { return '<span class="bd-pl' + (G.turn === c && !G.over ? ' bd-now' : '') + '"><i class="bd-chip bd-s' + c + '"></i>' + (c === 1 ? '흑' : '백') + ' · ' + nm[c - 1] + (cap ? ' <small>잡은 돌 ' + cap[c] + (G.goal ? '/' + G.goal : '') + '</small>' : '') + '</span>' }).join('<span class="bd-vs">vs</span>') +
      (BD && !G.goal ? '<span class="bd-komi">덤 ' + G.komi + '</span>' : '') + '<span class="bd-clock"></span>';
  }
  function ctl() {
    var c = host.querySelector('.bd-ctl'), h = '';
    if (BD && !G.goal) h += '<button type="button" class="tl-btn bd-pass">✋ 통과(쉬기)</button>';
    if (G.cfg.mode === 'two') h += '<button type="button" class="tl-btn bd-undo">↶ 무르기</button>';
    h += '<button type="button" class="tl-btn bd-resign">🏳️ 그만두기(기권)</button><button type="button" class="tl-btn bd-home">↩ 처음 화면</button>';
    c.innerHTML = h;
    var p = c.querySelector('.bd-pass'); if (p) p.onclick = function () { if (humanTurn()) humanPass() };
    var u = c.querySelector('.bd-undo'); if (u) u.onclick = undo;
    c.querySelector('.bd-resign').onclick = function () { if (G.over || G.score) return; if (confirm('이 판을 그만둘까요? (기권하면 상대가 이겨요)')) end(G.cfg.mode === 'ai' ? 2 : 3 - G.turn, '기권') };
    c.querySelector('.bd-home').onclick = function () { if (!G.over && !confirm('이 판을 그만두고 처음 화면으로 갈까요?')) return; stopAll(); showSetup() };
  }
  function msg(t, cls) { msgEl.innerHTML = t || ''; msgEl.className = 'bd-msg' + (cls ? ' ' + cls : '') }
  function turnStart() {
    top(); if (G.over || G.score) return;
    if (tick) { clearInterval(tick); tick = null }
    var bar = host.querySelector('.bd-tbar i'), clk = host.querySelector('.bd-clock');
    if (G.cfg.mode === 'ai' && G.turn === 2) { bar.style.width = '0'; clk.textContent = ''; return aiMove() }
    msg(G.cfg.mode === 'ai' ? '내 차례예요. 놓을 자리를 누르세요.' : names()[G.turn - 1] + '(' + (G.turn === 1 ? '흑' : '백') + ') 차례예요.');
    if (!G.tsec) { bar.style.width = '0'; clk.textContent = ''; return }
    var left = G.tsec, t0 = Date.now();
    bar.style.width = '100%'; bar.className = ''; clk.textContent = '⏱️ ' + left + '초';
    tick = setInterval(function () {
      var l = G.tsec - (Date.now() - t0) / 1000; bar.style.width = Math.max(0, l / G.tsec * 100) + '%'; bar.className = l <= 5 ? 'bd-hurry' : ''; clk.textContent = '⏱️ ' + Math.max(0, Math.ceil(l)) + '초';
      if (l <= 5 && Math.ceil(l) !== left) { left = Math.ceil(l); if (left > 0) snd(880, .08) }
      if (l <= 0) { clearInterval(tick); tick = null; end(3 - G.turn, '시간이 다 됨') }
    }, 200);
  }
  function save() { G.hist.push(OM ? { b: G.b.slice(), turn: G.turn, last: G.last } : { S: BD.clone(G.S), turn: G.turn, last: G.last }) }
  function undo() { if (!G.hist.length || G.over || G.score) return; var h = G.hist.pop(); if (OM) G.b = h.b; else G.S = h.S; G.turn = h.turn; G.last = h.last; G.warn = null; draw(); turnStart() }
  function human(x, y) {
    G.warn = null;
    if (OM) {
      var why = OM.legal(G.b, x, y, G.turn, G.rule33);
      if (why === 'stone') return;
      if (why === 'd3') { G.warn = y * 15 + x; draw(); msg('⚠️ 쌍삼(열린 3이 두 개 생기는 수)은 둘 수 없어요.', 'bd-bad'); return }
      save(); G.b[y * 15 + x] = G.turn; G.last = y * 15 + x; snd(520, .05);
      if (OM.five(G.b, x, y, G.turn)) return (draw(), end(G.turn, '다섯 개를 이었어요'));
      if (OM.full(G.b)) return (draw(), end(0, '판이 꽉 찼어요'));
    } else {
      var p = pidx(x, y), S = G.S;
      if (S.b[p]) return;
      if (p === S.ko) { msg('⚠️ 패: 방금 따낸 자리는 바로 다시 따낼 수 없어요. 다른 곳에 한 번 둔 뒤에 둘 수 있어요.', 'bd-bad'); return }
      save(); var c0 = S.cap[G.turn];
      if (!BD.play(S, p)) { G.hist.pop(); msg('⚠️ 그 자리에 두면 내 돌이 바로 잡혀요(스스로 잡히는 수). 둘 수 없어요.', 'bd-bad'); return }
      G.last = y * G.n + x; snd(S.cap[G.turn] > c0 ? 700 : 520, .06);
      if (G.goal && S.cap[G.turn] >= G.goal) return (draw(), end(G.turn, '돌을 ' + G.goal + '개 먼저 잡았어요'));
    }
    G.turn = 3 - G.turn; draw(); turnStart();
  }
  function humanPass() {
    save(); BD.play(G.S, -1); G.last = -1; G.turn = 3 - G.turn; draw();
    if (G.S.pass >= 2) return scoreStart();
    msg((G.cfg.mode === 'ai' ? '나' : names()[2 - G.turn]) + '는 통과했어요. 상대도 통과하면 집을 세요.'); turnStart();
  }
  function aiMove() {
    var L = G.L; G.busy = true; msg('🤖 인공지능이 생각하고 있어요…'); var t0 = Date.now();
    function done(p) { setTimeout(function () { G.busy = false; if (G.over || !G) return; aiPlay(p) }, Math.max(0, 450 - (Date.now() - t0))) }
    if (OM) return ask({ b: G.b, me: 2, level: G.cfg.level, rule33: G.rule33 }, function (r) { done(r.p) });
    var S = G.S;
    if (!G.goal && S.pass === 1) {   // 사람이 통과했으면: 이기고 있으면 통과
      return ask({ cmd: 'own', S: ser(S), k: 160 }, function (r) { var own = r.own, J = BD.judge(S, own, BD.deadFrom(S, own), G.komi); if (J.diff < 0) done(-1); else think() });
    }
    think();
    function think() { if (L.rnd && Math.random() < L.rnd) { var ms = BD.moves(S); return done(ms.length ? ms[(Math.random() * ms.length) | 0] : -1) } ask({ S: ser(S), it: L.it, komi: G.goal ? 0 : G.komi, ms: L.ms }, function (r) { done(r.p) }) }
  }
  function ser(S) { return { n: S.n, b: Array.prototype.slice.call(S.b), ko: S.ko, cap: S.cap.slice(), turn: S.turn, pass: S.pass, moves: S.moves, goal: S.goal, last: S.last } }
  function aiPlay(p) {
    if (OM) {
      if (p < 0) return end(0, '둘 곳이 없어요');
      G.b[p] = 2; G.last = p; snd(400, .05);
      if (OM.five(G.b, p % 15, (p / 15) | 0, 2)) return (draw(), end(2, '인공지능이 다섯 개를 이었어요'));
      if (OM.full(G.b)) return (draw(), end(0, '판이 꽉 찼어요'));
    } else {
      var S = G.S, c0 = S.cap[2];
      if (p < 0 || !BD.play(S, p)) { BD.play(S, -1); G.last = -1; G.turn = 1; draw(); if (S.pass >= 2) return scoreStart(); msg('🤖 인공지능은 통과했어요. 더 둘 곳이 없으면 나도 ‘통과’를 눌러 집을 세요.'); turnStart(); return }
      G.last = ((p / (G.n + 2) | 0) - 1) * G.n + (p % (G.n + 2) - 1); snd(S.cap[2] > c0 ? 700 : 400, .06);
      if (G.goal && S.cap[2] >= G.goal) return (draw(), end(2, '인공지능이 돌을 ' + G.goal + '개 먼저 잡았어요'));
    }
    G.turn = 1; draw(); turnStart();
  }
  /* ── 바둑 집 세기 ── */
  function scoreStart() {
    if (tick) { clearInterval(tick); tick = null } msg('🧮 집을 세고 있어요…'); G.busy = true;
    ask({ cmd: 'own', S: ser(G.S), k: 400 }, function (r) {
      G.busy = false; G.own = r.own; G.dead = BD.deadFrom(G.S, G.own); rescore();
      if (G.cfg.mode === 'two') { msg('두 사람 모두 통과해서 집을 셌어요. 죽은 돌이 틀렸으면 그 돌을 눌러 바꾸고 ‘결과 확정’을 누르세요. (네모 = 그 색의 집, 흐린 돌 = 죽은 돌)'); var c = host.querySelector('.bd-ctl'); c.innerHTML = '<button type="button" class="tl-btn tl-go bd-fin">✅ 결과 확정</button><button type="button" class="tl-btn bd-home">↩ 처음 화면</button>'; c.querySelector('.bd-fin').onclick = finalScore; c.querySelector('.bd-home').onclick = function () { stopAll(); showSetup() } }
      else finalScore();
    });
  }
  function rescore() { G.score = BD.judge(G.S, G.own, G.dead, G.komi); draw(); top() }
  function toggleDead(q) { var p = pidx(q[0], q[1]), v = G.S.b[p]; if (!v) return; var grp = []; BD.libs(G.S.b, G.n + 2, p, 0, grp); var to = G.dead[p] ? 0 : 1; grp.forEach(function (x) { G.dead[x] = to }); rescore() }
  function finalScore() { G.final = true; var J = G.score, w = J.diff > 0 ? 1 : J.diff < 0 ? 2 : 0; end(w, '흑 ' + J.b + ' · 백 ' + J.w + (J.komi ? ' + 덤 ' + J.komi : '') + ' (판 위의 돌 + 집)') }

  function end(w, why) {
    if (G.over) return; G.over = true; if (tick) { clearInterval(tick); tick = null } top();
    var nm = names(), t;
    if (G.cfg.mode === 'ai') {
      if (w === 1) { R.win++; var lv = G.cfg.level, newly = lv > R.clear; if (newly) R.clear = lv; t = '🏆 이겼어요! ' + why + (newly && lv < 10 ? ' — ' + (lv + 1) + '단계가 열렸어요!' : lv === 10 ? ' — 10단계까지 모두 깼어요! 🎉' : ''); snd(660, .15); setTimeout(function () { snd(880, .3) }, 160) }
      else if (w === 2) { R.lose++; t = '😢 졌어요. ' + why + ' 다시 도전해 봐요!'; snd(260, .4) } else t = '🤝 비겼어요. ' + why;
      sv(rec);
    } else t = w ? '🏆 ' + nm[w - 1] + '(' + (w === 1 ? '흑' : '백') + ') 승리! ' + why : '🤝 비겼어요. ' + why;
    msg(t, w === 1 || G.cfg.mode === 'two' ? 'bd-ok' : 'bd-bad');
    var c = host.querySelector('.bd-ctl'), lvl = G.cfg.level;
    c.innerHTML = '<button type="button" class="tl-btn tl-go bd-again">🔁 한 판 더</button>' + (G.cfg.mode === 'ai' && w === 1 && lvl < 10 ? '<button type="button" class="tl-btn tl-go bd-up">⬆ ' + (lvl + 1) + '단계 도전</button>' : '') + '<button type="button" class="tl-btn bd-home">↩ 처음 화면</button>';
    c.querySelector('.bd-again').onclick = function () { start(G.cfg) };
    var up = c.querySelector('.bd-up'); if (up) up.onclick = function () { start({ mode: 'ai', level: lvl + 1 }) };
    c.querySelector('.bd-home').onclick = function () { stopAll(); showSetup() };
  }
  showSetup();
};
