/* 수학 퀴즈쇼: 선생님이 진행하는 모둠 대항 점수판 (분야 5 × 100~500점) */
window.TOOL = function (host, api) {
  var B = window.TL.board, KEY = 'hj-quiz-v1-' + B.id, EKEY = 'hj-quiz-v1-edit-' + B.id, PTS = [100, 200, 300, 400, 500];
  var COL = ['#2B6FB8', '#E5534B', '#2EAA6A', '#E0861A', '#7B4FB0', '#1C8C7A'];
  function ld(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch (e) { return null } }
  function sv(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function data() { var e = ld(EKEY), d = JSON.parse(JSON.stringify(B.cats)); if (e) d.forEach(function (c, i) { var x = e[i]; if (!x) return; if (x.n != null) c.n = x.n; c.qs.forEach(function (q, j) { var y = x.qs && x.qs[j]; if (y) { if (y.q != null) q.q = y.q; if (y.a != null) q.a = y.a } }) }); return d }
  var D = data();
  var S = ld(KEY) || fresh();
  function fresh() { return { started: false, teams: [1, 2, 3, 4].map(function (i) { return { n: i + '모둠', s: 0 } }), used: {}, minus: false, lucky: true, luckyAt: null, timer: 30, log: [] } }
  function save() { sv(KEY, S) }
  function playable(c, r) { return D[c] && D[c].qs[r] && String(D[c].qs[r].q).trim() !== '' }
  var audio; function beep(f, d) { try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); var o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = f; g.gain.value = .15; o.connect(g); g.connect(audio.destination); o.start(); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + d); o.stop(audio.currentTime + d) } catch (e) {} }

  /* ---------- 준비 화면 ---------- */
  function setup() {
    api.bar(B.title + ' · 준비');
    var n = S.teams.length;
    host.innerHTML = '<div class="qs-setup"><h2 class="qs-h">🏆 퀴즈쇼 준비</h2>' +
      '<p class="tl-row"><b>모둠 수</b>' + [2, 3, 4, 5, 6].map(function (k) { return '<button type="button" class="tl-btn qs-n" aria-pressed="' + (k === n) + '" data-k="' + k + '">' + k + '모둠</button>' }).join('') + '</p>' +
      '<div class="qs-names">' + S.teams.map(function (t, i) { return '<label style="--tc:' + COL[i] + '"><span class="qs-dot"></span><input class="qs-nm" data-i="' + i + '" value="' + esc(t.n) + '" maxlength="12" aria-label="' + (i + 1) + '번째 모둠 이름"></label>' }).join('') + '</div>' +
      '<p class="tl-row"><label class="qs-opt"><input type="checkbox" id="qsMinus"' + (S.minus ? ' checked' : '') + '> 틀리면 점수 빼기</label><label class="qs-opt"><input type="checkbox" id="qsLucky"' + (S.lucky ? ' checked' : '') + '> 🎁 행운 칸 1개(점수 두 배)</label></p>' +
      '<p class="tl-row"><b>생각할 시간</b>' + [0, 20, 30, 60].map(function (k) { return '<button type="button" class="tl-btn qs-t" aria-pressed="' + (k === S.timer) + '" data-k="' + k + '">' + (k ? k + '초' : '없음') + '</button>' }).join('') + '</p>' +
      '<p class="tl-row"><button type="button" class="tl-btn tl-go qs-start">▶ 퀴즈쇼 시작</button></p>' +
      '<p class="tl-row"><button type="button" class="tl-btn qs-pa">🖨️ 문제와 정답(선생님용)</button><button type="button" class="tl-btn qs-pb">🖨️ 모둠 답판(모둠마다 한 장)</button></p>' +
      '<details class="qs-edit"' + (B.id === 'my' ? ' open' : '') + '><summary>✏️ 문제 바꾸기 <small>(이 기기에 저장돼요)</small></summary><div class="qs-ed"></div><p class="tl-row"><button type="button" class="tl-btn qs-reset">↩️ 처음 문제로 되돌리기</button></p></details></div>';
    edTable();
    host.querySelectorAll('.qs-n').forEach(function (b) { b.onclick = function () { var k = +b.dataset.k; while (S.teams.length < k) S.teams.push({ n: (S.teams.length + 1) + '모둠', s: 0 }); S.teams.length = k; save(); setup() } });
    host.querySelectorAll('.qs-t').forEach(function (b) { b.onclick = function () { S.timer = +b.dataset.k; save(); setup() } });
    host.querySelectorAll('.qs-nm').forEach(function (x) { x.oninput = function () { S.teams[+x.dataset.i].n = x.value.trim() || (+x.dataset.i + 1) + '모둠'; save() } });
    host.querySelector('#qsMinus').onchange = function () { S.minus = this.checked; save() };
    host.querySelector('#qsLucky').onchange = function () { S.lucky = this.checked; save() };
    host.querySelector('.qs-start').onclick = function () {
      var free = []; for (var c = 0; c < 5; c++) for (var r = 0; r < 5; r++) if (playable(c, r)) free.push(c + '-' + r);
      if (!free.length) { alert('문제가 하나도 없어요. ‘✏️ 문제 바꾸기’에서 문제를 써 주세요.'); return }
      S.started = true; S.used = {}; S.log = []; S.teams.forEach(function (t) { t.s = 0 }); S.luckyAt = S.lucky ? free[Math.floor(Math.random() * free.length)] : null; save(); board();
    };
    host.querySelector('.qs-pa').onclick = function () { printSheet('key') };
    host.querySelector('.qs-pb').onclick = function () { printSheet('team') };
    host.querySelector('.qs-reset').onclick = function () { if (!confirm('바꾼 문제를 모두 지우고 처음 문제로 되돌릴까요?')) return; try { localStorage.removeItem(EKEY) } catch (e) {} D = data(); edTable() };
  }
  function edTable() {
    var w = host.querySelector('.qs-ed');
    w.innerHTML = D.map(function (c, i) { return '<fieldset class="qs-ec"><legend><input class="qs-ei" data-c="' + i + '" data-k="n" value="' + esc(c.n) + '" placeholder="분야 ' + (i + 1) + '" aria-label="분야 ' + (i + 1) + ' 이름"></legend>' + c.qs.map(function (q, j) { return '<div class="qs-er"><b>' + PTS[j] + '</b><textarea class="qs-ei" data-c="' + i + '" data-r="' + j + '" data-k="q" rows="2" placeholder="문제" aria-label="' + PTS[j] + '점 문제">' + esc(q.q) + '</textarea><input class="qs-ei" data-c="' + i + '" data-r="' + j + '" data-k="a" value="' + esc(q.a) + '" placeholder="답" aria-label="' + PTS[j] + '점 답"></div>' }).join('') + '</fieldset>' }).join('');
    w.querySelectorAll('.qs-ei').forEach(function (x) { x.oninput = function () {
      var c = +x.dataset.c, k = x.dataset.k; if (k === 'n') D[c].n = x.value; else D[c].qs[+x.dataset.r][k] = x.value;
      sv(EKEY, D.map(function (cc) { return { n: cc.n, qs: cc.qs.map(function (q) { return { q: q.q, a: q.a } }) } }));
    } });
  }

  /* ---------- 점수판 ---------- */
  function board() {
    var left = 0; for (var c = 0; c < 5; c++) for (var r = 0; r < 5; r++) if (playable(c, r) && !S.used[c + '-' + r]) left++;
    api.bar(B.title + ' · 남은 문제 ' + left + '개');
    host.innerHTML = '<div class="qs-board" role="grid">' + D.map(function (c) { return '<div class="qs-cat" role="columnheader">' + esc(c.n) + '</div>' }).join('') +
      PTS.map(function (p, r) { return D.map(function (c, ci) { var id = ci + '-' + r, u = S.used[id], ok = playable(ci, r); return '<button type="button" class="qs-tile' + (u ? ' qs-used' : '') + '" data-id="' + id + '"' + (ok && !u ? '' : ' disabled') + ' aria-label="' + esc(c.n) + ' ' + p + '점' + (u ? ' (끝남)' : ok ? '' : ' (문제 없음)') + '">' + (u ? '✓' : ok ? p : '—') + '</button>' }).join('') }).join('') + '</div>' +
      scores() + '<p class="tl-row"><button type="button" class="tl-btn tl-go qs-end">🏁 끝내고 순위 보기</button><button type="button" class="tl-btn qs-undo"' + (S.log.length ? '' : ' disabled') + '>↶ 마지막 점수 되돌리기</button><button type="button" class="tl-btn qs-new">🔄 처음부터(준비 화면)</button></p>';
    host.querySelectorAll('.qs-tile').forEach(function (b) { b.onclick = function () { open(b.dataset.id) } });
    bindScores();
    host.querySelector('.qs-end').onclick = finish;
    host.querySelector('.qs-new').onclick = function () { if (!confirm('점수를 지우고 준비 화면으로 갈까요?')) return; S.started = false; S.used = {}; S.log = []; S.teams.forEach(function (t) { t.s = 0 }); save(); setup() };
    host.querySelector('.qs-undo').onclick = function () { var l = S.log.pop(); if (!l) return; l.d.forEach(function (x) { S.teams[x[0]].s -= x[1] }); if (l.id) delete S.used[l.id]; save(); board() };
    if (!left) setTimeout(finish, 300);
  }
  function scores() { return '<div class="qs-scores">' + S.teams.map(function (t, i) { return '<div class="qs-team" style="--tc:' + COL[i] + '"><span class="qs-tn">' + esc(t.n) + '</span><b class="qs-ts">' + t.s + '</b><span class="qs-adj"><button type="button" class="qs-mini" data-i="' + i + '" data-d="-100" aria-label="' + esc(t.n) + ' 100점 빼기">−100</button><button type="button" class="qs-mini" data-i="' + i + '" data-d="100" aria-label="' + esc(t.n) + ' 100점 더하기">+100</button></span></div>' }).join('') + '</div>' }
  function bindScores() { host.querySelectorAll('.qs-mini').forEach(function (b) { b.onclick = function () { var i = +b.dataset.i, d = +b.dataset.d; S.teams[i].s += d; S.log.push({ d: [[i, d]] }); save(); board() } }) }

  /* ---------- 문제 창 ---------- */
  var tick = null;
  function open(id) {
    var c = +id.split('-')[0], r = +id.split('-')[1], Q = D[c].qs[r], lucky = S.luckyAt === id, pts = PTS[r] * (lucky ? 2 : 1), res = S.teams.map(function () { return 0 }), shown = false, left = S.timer;
    var m = document.createElement('div'); m.className = 'qs-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', D[c].n + ' ' + PTS[r] + '점 문제');
    m.innerHTML = '<div class="qs-box"><p class="qs-top"><span>' + esc(D[c].n) + ' · <b>' + PTS[r] + '점</b></span>' + (lucky ? '<span class="qs-lucky">🎁 행운 칸! 점수 두 배 (' + pts + '점)</span>' : '') + '</p>' +
      '<p class="qs-q">' + esc(Q.q).replace(/\n/g, '<br>') + '</p>' +
      (S.timer ? '<p class="tl-row"><span class="qs-clock" aria-live="polite">' + left + '초</span><button type="button" class="tl-btn qs-go">▶ 시간 재기</button></p>' : '') +
      '<p class="qs-a" hidden>정답: <b>' + esc(Q.a) + '</b></p>' +
      '<p class="tl-row"><button type="button" class="tl-btn tl-go qs-show">🔑 정답 보기</button></p>' +
      '<div class="qs-who"><p class="qs-wh">맞힌 모둠을 누르세요' + (S.minus ? ' (한 번 더 누르면 틀림 −' + pts + ', 또 누르면 취소)' : ' (다시 누르면 취소)') + '</p><div class="tl-row">' + S.teams.map(function (t, i) { return '<button type="button" class="qs-tb" data-i="' + i + '" style="--tc:' + COL[i] + '" aria-pressed="false">' + esc(t.n) + '<small></small></button>' }).join('') + '</div></div>' +
      '<p class="tl-row"><button type="button" class="tl-btn tl-go qs-apply">✅ 점수 주고 판으로</button><button type="button" class="tl-btn qs-close">✕ 그냥 닫기</button></p></div>';
    (document.fullscreenElement || host).appendChild(m);
    function stop() { if (tick) { clearInterval(tick); tick = null } }
    function show() { shown = true; m.querySelector('.qs-a').hidden = false; m.querySelector('.qs-show').hidden = true; stop(); beep(880, .25) }
    function close(apply) {
      stop(); document.removeEventListener('keydown', key);
      if (apply) { var d = []; res.forEach(function (v, i) { if (v === 1) d.push([i, pts]); else if (v === 2) d.push([i, -pts]) }); d.forEach(function (x) { S.teams[x[0]].s += x[1] }); S.used[id] = 1; S.log.push({ d: d, id: id }); save() }
      m.remove(); board();
      var t = host.querySelector('.qs-tile[data-id="' + id + '"]'); if (t && !t.disabled) t.focus();
    }
    m.querySelector('.qs-show').onclick = show;
    m.querySelectorAll('.qs-tb').forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; res[i] = (res[i] + 1) % (S.minus ? 3 : 2); b.setAttribute('aria-pressed', res[i] ? 'true' : 'false'); b.dataset.v = res[i]; b.querySelector('small').textContent = res[i] === 1 ? ' ⭕ +' + pts : res[i] === 2 ? ' ❌ −' + pts : '' } });
    m.querySelector('.qs-apply').onclick = function () { if (!shown && !confirm('아직 정답을 보여 주지 않았어요. 그래도 점수를 줄까요?')) return; close(true) };
    m.querySelector('.qs-close').onclick = function () { if (shown && !confirm('점수를 주지 않고 닫을까요? (이 문제는 끝난 것으로 표시돼요)')) return; if (shown) { S.used[id] = 1; S.log.push({ d: [], id: id }); save() } close(false) };
    var go = m.querySelector('.qs-go');
    if (go) go.onclick = function () {
      if (tick) { stop(); go.textContent = '▶ 이어서 재기'; return }
      go.textContent = '⏸ 멈추기'; var ck = m.querySelector('.qs-clock');
      tick = setInterval(function () { left--; ck.textContent = left > 0 ? left + '초' : '⏰ 시간 끝!'; ck.classList.toggle('qs-hurry', left <= 5); if (left > 0 && left <= 3) beep(660, .12); if (left <= 0) { stop(); beep(330, .6); go.hidden = true } }, 1000);
    };
    function key(e) { if (e.key === 'Escape') { e.preventDefault(); m.querySelector('.qs-close').click() } }
    document.addEventListener('keydown', key);
    setTimeout(function () { (go || m.querySelector('.qs-show')).focus() }, 50);
  }

  /* ---------- 결과 ---------- */
  function finish() {
    var rank = S.teams.map(function (t, i) { return { n: t.n, s: t.s, i: i } }).sort(function (a, b) { return b.s - a.s }), top = rank[0].s;
    api.bar(B.title + ' · 결과');
    host.innerHTML = '<div class="qs-end"><p class="qs-endt">🏆 ' + rank.filter(function (x) { return x.s === top }).map(function (x) { return esc(x.n) }).join(', ') + ' 우승!</p><ol class="qs-rank">' +
      rank.map(function (x) { var pl = 1 + rank.filter(function (y) { return y.s > x.s }).length; return '<li style="--tc:' + COL[x.i] + '"><span class="qs-pl">' + pl + '등</span><span class="qs-tn">' + esc(x.n) + '</span><b>' + x.s + '점</b></li>' }).join('') + '</ol>' +
      '<p class="tl-row"><button type="button" class="tl-btn qs-back">↩ 점수판으로</button><button type="button" class="tl-btn tl-go qs-new">🔄 새 퀴즈쇼</button></p></div>';
    host.querySelector('.qs-back').onclick = board;
    host.querySelector('.qs-new').onclick = function () { S.started = false; S.used = {}; S.log = []; S.teams.forEach(function (t) { t.s = 0 }); save(); setup() };
    beep(523, .15); setTimeout(function () { beep(659, .15) }, 160); setTimeout(function () { beep(784, .3) }, 320);
  }

  /* ---------- 인쇄 ---------- */
  function printSheet(kind) {
    var sh = document.getElementById('qsSheet'), h = '';
    if (kind === 'key') {
      h = '<div class="qp-pg qp-key"><div class="qp-hd"><b>🏆 ' + esc(B.title) + ' — 문제와 정답</b><span>선생님용</span></div><table class="qp-kt"><tr><th>분야</th><th>점수</th><th>문제</th><th>정답</th></tr>' +
        D.map(function (c) { return c.qs.map(function (q, j) { return '<tr><td>' + (j ? '' : esc(c.n)) + '</td><td>' + PTS[j] + '</td><td>' + esc(q.q) + '</td><td><b>' + esc(q.a) + '</b></td></tr>' }).join('') }).join('') + '</table><p class="qp-ft">수학 퀴즈쇼 · 초등교사 홍지희</p></div>';
    } else {
      h = S.teams.map(function (t) { return '<div class="qp-pg qp-team"><div class="qp-hd"><b>🏆 ' + esc(B.title) + ' — 모둠 답판</b><span>모둠: <u>' + esc(t.n) + '</u> &nbsp; 이름 ________________</span></div><div class="qp-grid">' +
        D.map(function (c) { return '<div class="qp-ch">' + esc(c.n) + '</div>' }).join('') +
        PTS.map(function (p, r) { return D.map(function (c, ci) { return '<div class="qp-cell"><span>' + esc(c.n) + ' ' + p + '</span></div>' }).join('') }).join('') + '</div><p class="qp-ft">문제를 듣고 칸에 답과 계산을 써요. · 수학 퀴즈쇼 · 초등교사 홍지희</p></div>' }).join('');
    }
    sh.innerHTML = h; document.documentElement.classList.add('qs-printing');
    var off = function () { document.documentElement.classList.remove('qs-printing'); window.removeEventListener('afterprint', off) }; window.addEventListener('afterprint', off);
    setTimeout(function () { window.print() }, 80);
  }

  if (S.started) board(); else setup();
};
