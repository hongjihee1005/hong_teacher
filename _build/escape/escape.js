/* 수학 방탈출 2 (2026-11-26 선생님: '말로만 방탈출, 몇 문제 풀고 끝'): 방 그림을 둘러보며 물건을 눌러 단서를 모으고,
   가방 속 물건을 쓰고, 여러 가지 자물쇠(숫자·방향·색·모양)를 풀어 다음 방으로, 마지막 문으로.
   2026-11-27 더함: ① 처음 이야기 장면·자물쇠가 열리는 움직임·문이 열리며 다른 곳으로·효과음(끄고 켜기) ② 가방 물건 합치기(R.combine)
   ③ 크게 볼 때만 보이는 숨은 곳(물건의 in = 부모 물건 id, 부모 그림 안 좌표 — 서랍 안의 서랍·작은 쪽지) ④ 모둠 대항(모둠 이름·결과 코드, 점수판 board.html)
   자료 window.ER = { idx, title, intro, story:[…], outro, scenes:[{id, nm, bg, objs:[…]}], items:{id:{nm,k,c}}, combine:[{a,b,make,msg}], flow:[물건 id 또는 'a+b'] }
   물건: { id, nm, art, x, y, w, h, p, in, look, lookFig, keep, need, needMsg, useMsg, lock:{t,code,q,hints,sol,opts}, give, after, afterFig, go, req, guide } */
window.TOOL = function (host, api) {
  var R = window.ER, A = ART.A, esc = ART.esc, st, tick = null, limit = 0, team = '';
  var OBJ = {}, SCN = {}, KIDS = {}; R.scenes.forEach(function (s) { SCN[s.id] = s; s.objs.forEach(function (o) { o.scene = s.id; OBJ[o.id] = o; if (o.in) (KIDS[o.in] = KIDS[o.in] || []).push(o) }) });
  var COMB = R.combine || [], RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SNDK = 'hj-escape-snd', snd = true; try { snd = localStorage.getItem(SNDK) !== '0' } catch (e) {}
  function frac(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(\d+)\/(\d+)/g, '<span class="fd-fr"><i>$1</i><i>$2</i></span>') }
  function jo(w, a, b) { var s = String(w), ch = s.charCodeAt(s.length - 1), m = s.match(/\d+$/), f; if (m) { var t = m[0].replace(/0+$/, '') || '0'; f = m[0].length > t.length || '013678'.indexOf(t.slice(-1)) >= 0 } else f = ch >= 0xAC00 && ch <= 0xD7A3 && (ch - 0xAC00) % 28 > 0; return s + (f ? a : b) }
  function reset() { st = { t0: 0, scene: R.scenes[0].id, used: {}, solved: {}, given: {}, seen: {}, inv: [], sel: null, notes: [], hints: 0, wrong: 0, lh: {}, done: false, open: null, entry: {}, made: {}, shown: {}, drawn: {} }; stop(); draw() }
  function stop() { if (tick) clearInterval(tick); tick = null }
  function sec() { return st.t0 ? Math.floor((Date.now() - st.t0) / 1000) : 0 }
  function mmss(s) { s = Math.max(0, s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }
  function ok(o) { return (!o.need || st.used[o.id]) && (!o.lock || st.solved[o.id]) }
  function vis(o) { return (!o.req || o.req.every(function (id) { return ok(OBJ[id]) })) && (!o.in || (vis(OBJ[o.in]) && ok(OBJ[o.in]))) }
  function sceneOpen(id) { return id === R.scenes[0].id || R.scenes.some(function (s) { return s.objs.some(function (o) { return o.go === id && ok(o) }) }) }
  function nLocks() { var n = 0, d = 0; for (var k in OBJ) if (OBJ[k].lock || OBJ[k].need) { n++; if (ok(OBJ[k])) d++ } return [d, n] }
  function note(title, html) { if (st.notes.some(function (n) { return n.h === html })) return; st.notes.push({ t: title, h: html }) }
  function fig(f) { if (!f) return ''; var w = f.w || 300, h = f.h || 200; return '<svg class="es-fig" viewBox="-12 -24 ' + (w + 24) + ' ' + (h + 36) + '" role="img" aria-label="단서 그림">' + A[f.art](w, h, f.p || {}, f.open) + '</svg>' }
  function timer() { var el = host.querySelector('.es-time'); if (!el) return; var s = sec(); el.textContent = limit ? '남은 시간 ' + mmss(limit * 60 - s) : '걸린 시간 ' + mmss(s); if (limit && s >= limit * 60 && !st.done) { el.textContent = '시간 끝! 계속 해도 돼요'; el.classList.add('es-over') } }
  function exitObj() { for (var k in OBJ) if (OBJ[k].go === 'exit') return OBJ[k] }

  /* ── 효과음(Web Audio, 누른 뒤에만 만듦) ── */
  var AC = null;
  function ac() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC } catch (e) { return null } }
  function tone(f, t0, d, type, vol, f2) { var a = ac(); if (!a) return; var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0; o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.linearRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .08, t + .015); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + .02) }
  function noise(t0, d, vol, lp) { var a = ac(); if (!a) return; var n = Math.floor(a.sampleRate * d), b = a.createBuffer(1, n, a.sampleRate), x = b.getChannelData(0); for (var i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n); var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), t = a.currentTime + t0; s.buffer = b; f.type = 'lowpass'; f.frequency.value = lp || 900; g.gain.value = vol || .15; s.connect(f); f.connect(g); g.connect(a.destination); s.start(t) }
  function sfx(k) {
    if (!snd) return;
    if (k === 1 || k === 'unlock') { noise(0, .06, .25, 3000); tone(784, .08, .18, 'triangle', .09); tone(988, .18, .18, 'triangle', .09); tone(1319, .28, .35, 'triangle', .08) }
    else if (k === 0 || k === 'wrong') { tone(200, 0, .14, 'square', .05, 150); tone(140, .14, .22, 'square', .05, 110) }
    else if (k === 'pick') { tone(660, 0, .1, 'sine', .08); tone(990, .09, .16, 'sine', .08) }
    else if (k === 'tap') tone(520, 0, .05, 'sine', .04)
    else if (k === 'door') { tone(95, 0, .55, 'sawtooth', .035, 70); tone(140, .1, .45, 'sawtooth', .02, 110); noise(.5, .18, .2, 400) }
    else if (k === 'slam') { noise(0, .25, .35, 300); tone(70, 0, .3, 'sine', .12, 45); noise(.45, .05, .25, 2500) }
    else if (k === 'combine') { tone(523, 0, .1, 'triangle', .08); tone(659, .08, .1, 'triangle', .08); tone(784, .16, .22, 'triangle', .08) }
    else if (k === 'win') [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(f, i * .13, i === 5 ? .6 : .16, 'triangle', .09) });
  }
  function sndBtn() { return '<button type="button" class="tl-btn es-sndb" data-a="snd" aria-pressed="' + snd + '">' + (snd ? '소리 켜짐' : '소리 꺼짐') + '</button>' }

  /* ── 움직임: 자물쇠 열림 · 문 열고 들어가기 · 꽃가루 ── */
  function fx(kind, label, cb) {
    if (RM) { cb && cb(); return }
    var d = document.createElement('div'); d.className = 'es-fx es-fx-' + kind; d.setAttribute('aria-hidden', 'true');
    if (kind === 'unlock') d.innerHTML = '<svg viewBox="0 0 120 140" class="es-pad"><path class="es-shk" d="M30 62V40a30 30 0 0 1 60 0v22" fill="none" stroke="#8A929C" stroke-width="12" stroke-linecap="round"/><rect x="14" y="60" width="92" height="72" rx="14" fill="#F2C230" stroke="#3A2C22" stroke-width="5"/><circle cx="60" cy="90" r="9" fill="#3A2C22"/><rect x="56" y="94" width="8" height="20" rx="3" fill="#3A2C22"/></svg><b>' + esc(label || '열렸어요!') + '</b>';
    else d.innerHTML = '<i class="es-dl"></i><i class="es-dr"></i><b>' + esc(label || '') + '</b>';
    host.appendChild(d); setTimeout(function () { d.remove(); cb && cb() }, kind === 'unlock' ? 950 : 1150);
  }
  function confetti() { if (RM) return; var w = host.querySelector('.es-win'); if (!w) return; var cols = ['#E5534B', '#F2C230', '#3DA35D', '#3B6FD6', '#EE7DB0', '#8A5BC9'], h = ''; for (var i = 0; i < 46; i++) h += '<i style="left:' + (i * 37 % 100) + '%;background:' + cols[i % 6] + ';animation-delay:' + (i % 9) * .14 + 's;animation-duration:' + (1.8 + (i % 5) * .3) + 's"></i>'; w.insertAdjacentHTML('afterbegin', '<div class="es-conf" aria-hidden="true">' + h + '</div>') }

  /* 처음 화면 */
  function startView() {
    host.innerHTML = '<div class="es-start"><svg class="es-cover" viewBox="0 0 1000 300" aria-hidden="true">' + bg(SCN[R.scenes[0].id].bg, 300) + '</svg><p class="es-intro">' + frac(R.intro) + '</p>'
      + '<ul class="es-rules"><li>방 그림 속 <b>물건을 눌러</b> 크게 봐요. 크게 본 그림 속 <b>작은 곳</b>도 눌러 볼 수 있어요 — 서랍 안에 또 서랍이 숨어 있기도 해요.</li><li>단서는 <b>수첩</b>에 저절로 모여요. 얻은 물건은 <b>가방</b>에 들어가요. 가방에서 물건을 고른 뒤 쓸 곳을 누르고, 가방의 두 물건을 차례로 누르면 <b>합쳐 볼</b> 수 있어요.</li><li>자물쇠는 숫자·방향·색깔·모양 여러 가지예요. 여러 곳의 단서를 이어 붙여 풀어요.</li><li>막히면 <b>어디를 볼까?</b> 힌트를 눌러요.</li></ul>'
      + '<p class="tl-row es-opts"><label>시간 제한 <select class="es-lim"><option value="0">없음(걸린 시간만)</option><option value="15">15분</option><option value="20" selected>20분</option><option value="30">30분</option><option value="40">40분</option></select></label><label>이름 또는 모둠 <input class="es-team-in" maxlength="12" placeholder="예: 3번 · 1모둠" value="' + esc(team) + '"></label>' + sndBtn() + '</p><button type="button" class="tl-btn tl-go es-go">이야기 보고 시작하기</button></div>';
    api.bar(R.title);
  }
  /* 이야기 장면: 첫 장면 그림 + 쾅 닫히는 문 + 이야기 줄이 하나씩 */
  function story() {
    var ex = exitObj(), lines = R.story && R.story.length ? R.story : String(R.intro).split(/(?<=[.!?])\s+/), dw = 200, dh = 300;
    var h = '<div class="es-story"><svg class="es-stsv" viewBox="0 0 1000 420" aria-hidden="true">' + bg(SCN[R.scenes[0].id].bg, 420) + '<g class="es-stdoor" transform="translate(400 70)">' + A.door(dw, dh, { c: (ex && ex.p && ex.p.c) || '갈색' }, false) + '</g><g class="es-stlock" transform="translate(470 175)"><rect x="0" y="22" width="60" height="48" rx="9" fill="#F2C230" stroke="#3A2C22" stroke-width="4"/><path d="M12 24V14a18 18 0 0 1 36 0v10" fill="none" stroke="#8A929C" stroke-width="8"/><circle cx="30" cy="44" r="6" fill="#3A2C22"/></g></svg><div class="es-stlines">'
      + lines.map(function (t, i) { return '<p style="animation-delay:' + (0.6 + i * 1.5) + 's">' + frac(t) + '</p>' }).join('') + '</div><div class="tl-row"><button type="button" class="tl-btn" data-a="go">건너뛰기</button><button type="button" class="tl-btn tl-go es-stgo" data-a="go" style="animation-delay:' + (0.6 + lines.length * 1.5) + 's">탈출 시작!</button></div></div>';
    host.innerHTML = h; api.bar(R.title + ' · 이야기'); sfx('slam');
    var b = host.querySelector('.es-stgo'); if (b) b.focus({ preventScroll: true });
  }
  function begin() { st.t0 = Date.now(); tick = setInterval(timer, 1000); draw() }
  function bg(b, H) {
    b = b || {}; H = H || 560; var wall = b.wall || '#F3E3C8', floor = b.floor || '#C9A27A', fy = H * .68, o = '<rect width="1000" height="' + H + '" fill="' + wall + '"/>';
    if (b.deco === 'stripe') for (var x = 0; x < 1000; x += 60) o += '<rect x="' + x + '" y="0" width="30" height="' + fy + '" fill="#000" opacity=".035"/>';
    if (b.deco === 'brick') for (var y = 10, r = 0; y < fy; y += 36, r++) for (var x2 = (r % 2) * -40; x2 < 1000; x2 += 80) o += '<rect x="' + x2 + '" y="' + y + '" width="76" height="32" rx="3" fill="#000" opacity=".05"/>';
    if (b.deco === 'stars') for (var i = 0; i < 40; i++) o += '<circle cx="' + ((i * 137) % 1000) + '" cy="' + ((i * 71) % (fy - 20) + 10) + '" r="' + (i % 3 + 1) + '" fill="#fff" opacity=".7"/>';
    if (b.deco === 'bubble') for (var j = 0; j < 24; j++) o += '<circle cx="' + ((j * 173) % 1000) + '" cy="' + ((j * 97) % (fy - 30) + 15) + '" r="' + (j % 4 * 3 + 4) + '" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>';
    if (b.deco === 'tile') for (var k = 0; k < 1000; k += 50) for (var y3 = 0; y3 < fy; y3 += 50) o += '<rect x="' + (k + 2) + '" y="' + (y3 + 2) + '" width="46" height="46" rx="3" fill="#fff" opacity=".18"/>';
    o += '<rect y="' + fy + '" width="1000" height="' + (H - fy) + '" fill="' + floor + '"/><rect y="' + (fy - 8) + '" width="1000" height="10" fill="#000" opacity=".15"/>';
    for (var x3 = 0; x3 < 1000; x3 += 120) o += '<line x1="' + x3 + '" y1="' + fy + '" x2="' + (x3 - 60) + '" y2="' + H + '" stroke="#000" stroke-opacity=".06" stroke-width="2"/>';
    return o;
  }
  function objG(o, cls) { var op = ok(o) && (o.lock || o.need); return '<g class="es-obj' + (cls || '') + (op ? ' es-done' : '') + '" data-o="' + o.id + '" transform="translate(' + o.x + ' ' + o.y + ')" tabindex="0" role="button" aria-label="' + esc(o.nm) + '"><g class="es-art">' + A[o.art](o.w, o.h, o.p || {}, op) + '</g><rect class="es-hot" x="-8" y="-8" width="' + (o.w + 16) + '" height="' + (o.h + 16) + '" rx="10"/></g>' }
  /* 놀이 화면 */
  function draw() {
    if (!st.t0) return startView();
    if (st.done) return win();
    var S = SCN[st.scene], dn = nLocks(), sel = st.sel, first = !st.drawn[S.id];
    var h = '<div class="es-top">' + (team ? '<span class="es-team">' + esc(team) + '</span>' : '') + '<span class="es-time"></span><span class="es-prog">자물쇠·장치 <b>' + dn[0] + '</b> / ' + dn[1] + '<i class="es-pbar"><i style="width:' + Math.round(dn[0] / Math.max(1, dn[1]) * 100) + '%"></i></i></span><span class="es-hc">힌트 ' + st.hints + ' · 틀림 ' + st.wrong + '</span><button type="button" class="tl-btn es-where" data-a="where">어디를 볼까?</button>' + sndBtn() + '</div>';
    if (R.scenes.length > 1) h += '<div class="es-tabs" role="tablist">' + R.scenes.map(function (s) { var on = sceneOpen(s.id); return '<button type="button" role="tab" class="es-tab" data-sc="' + s.id + '" aria-selected="' + (s.id === st.scene) + '"' + (on ? '' : ' disabled') + '>' + (on ? esc(s.nm) : '잠긴 곳') + '</button>' }).join('') + '</div>';
    h += '<div class="es-main"><div class="es-room"><svg class="es-scene" viewBox="0 0 1000 560" role="group" aria-label="' + esc(S.nm) + '">' + bg(S.bg) + S.objs.filter(function (o) { return !o.in && vis(o) }).map(function (o) {
      var c = st.shown[o.id] || first ? '' : ' es-appear'; st.shown[o.id] = 1; return objG(o, c);
    }).join('') + '</svg><p class="es-say" aria-live="polite">' + (sel ? '<b>' + esc(R.items[sel].nm) + '</b>' + jo(R.items[sel].nm, '을', '를').slice(-1) + ' 들었어요. 쓸 곳을 누르거나, 가방의 다른 물건을 눌러 합쳐 봐요.' : esc(S.nm) + ' — 물건을 눌러 살펴봐요.') + '</p></div>';
    st.drawn[S.id] = 1;
    h += '<aside class="es-side"><h3>가방</h3><div class="es-inv">' + (st.inv.length ? st.inv.map(function (id) { var it = R.items[id]; return '<button type="button" class="es-it" data-it="' + id + '" aria-pressed="' + (sel === id) + '" title="' + esc(it.de || it.nm) + '">' + ART.item(it.k, it.c) + '<span>' + esc(it.nm) + '</span></button>' }).join('') : '<p class="es-empty">아직 비어 있어요</p>') + '</div>'
      + '<h3>수첩 <small>' + st.notes.length + '</small></h3><div class="es-notes">' + (st.notes.length ? st.notes.map(function (n, i) { return '<button type="button" class="es-nt" data-nt="' + i + '"><b>' + esc(n.t) + '</b></button>' }).join('') : '<p class="es-empty">살펴본 단서가 여기에 모여요</p>') + '</div></aside></div>';
    h += '<div class="es-modal" hidden></div>';
    host.innerHTML = h; timer();
    api.bar(R.title + ' · ' + S.nm);
    if (st.open) openObj(st.open, true);
  }
  function say(t, cls) { var p = host.querySelector('.es-say'); if (p) { p.innerHTML = t; p.className = 'es-say' + (cls ? ' ' + cls : '') } }
  /* 물건 크게 보기 — 크게 본 그림 안의 숨은 곳(KIDS)도 누를 수 있음 */
  function openObj(id, keep) {
    var o = OBJ[id], m = host.querySelector('.es-modal'); st.open = id; st.seen[id] = 1;
    var kids = (KIDS[id] || []).filter(vis), op = ok(o) && (o.lock || o.need);
    var h = '<div class="es-card" role="dialog" aria-modal="true" aria-label="' + esc(o.nm) + '"><div class="es-chd"><b>' + esc(o.nm) + '</b><span>' + (o.in ? '<button type="button" class="tl-btn" data-back="' + o.in + '">◀ ' + esc(OBJ[o.in].nm) + '</button> ' : '') + '<button type="button" class="tl-btn es-x" data-a="close">닫기</button></span></div><div class="es-cbody"><div class="es-bigw"><div class="es-big"><svg viewBox="-20 -30 ' + (o.w + 40) + ' ' + (o.h + 50) + '" role="group" aria-label="' + esc(o.nm) + ' 크게 보기"><g class="es-art' + (op && st.fresh === id ? ' es-opening' : '') + '">' + A[o.art](o.w, o.h, o.p || {}, op) + '</g>' + kids.map(function (k) { return objG(k, ' es-spot' + (st.seen[k.id] ? '' : ' es-new')) }).join('') + '</svg></div><p class="es-peek">그림 속 작은 곳도 눌러 볼 수 있어요.</p></div><div class="es-ctext">';
    st.fresh = null;
    if (o.look) { h += '<p class="es-look">' + frac(o.look) + '</p>' + fig(o.lookFig); if (o.keep) note(o.nm, '<p>' + frac(o.look) + '</p>' + fig(o.lookFig)) }
    if (o.need && !st.used[o.id]) {
      h += '<div class="es-need"><p>' + frac(o.needMsg || '무언가가 필요해 보여요.') + '</p>' + (st.inv.length ? '<p class="es-try">가방에서 써 볼 물건:</p><div class="es-inv es-inv2">' + st.inv.map(function (iid) { var it = R.items[iid]; return '<button type="button" class="es-it" data-use="' + iid + '">' + ART.item(it.k, it.c) + '<span>' + esc(it.nm) + '</span></button>' }).join('') + '</div>' : '<p class="es-try">가방이 비어 있어요. 다른 곳을 먼저 살펴봐요.</p>') + '</div>';
    } else if (o.lock && !st.solved[o.id]) h += lockUI(o);
    else if (o.lock || o.need || o.after) h += done(o);
    h += '</div></div></div>';
    m.innerHTML = h; m.hidden = false;
    if (!keep) { var f = m.querySelector('.es-dial button, .es-it, .es-x'); if (f) f.focus({ preventScroll: true }) }
    if (!(o.lock || o.need) && o.give) give(o);
  }
  function give(o) { if (st.given[o.id]) return; st.given[o.id] = 1; (o.give || []).forEach(function (iid) { if (st.inv.indexOf(iid) < 0) st.inv.push(iid) }); if (o.give && o.give.length) { toast('가방에 넣었어요: ' + o.give.map(function (i) { return R.items[i].nm }).join(', ')); setTimeout(function () { sfx('pick') }, 350) } }
  function done(o) {
    var h = '';
    if (o.after) { h += '<div class="es-after"><p>' + frac(o.after) + '</p>' + fig(o.afterFig) + '</div>'; note(o.nm, '<p>' + frac(o.after) + '</p>' + fig(o.afterFig)) }
    if (o.go === 'exit') h += '<button type="button" class="tl-btn tl-go es-goexit" data-a="exit">밖으로 나가기</button>';
    else if (o.go) h += '<button type="button" class="tl-btn tl-go" data-go="' + o.go + '">' + esc(jo(SCN[o.go].nm, '으로', '로')) + ' 가기</button>';
    return h;
  }
  /* 자물쇠 */
  var SYM = { dir: ['↑', '→', '↓', '←'], shape: ['○', '△', '□', '☆'], color: ['빨강', '노랑', '초록', '파랑'] };
  function lockUI(o) {
    var L = o.lock, e = st.entry[o.id] || (st.entry[o.id] = L.t === 'num' ? L.code.split('').map(function () { return 0 }) : []), h = '<div class="es-lock es-lk-' + L.t + '"><p class="es-lq">' + frac(L.q) + '</p>';
    if (L.t === 'num') h += '<div class="es-dials">' + e.map(function (d, i) { return '<div class="es-dial"><button type="button" data-d="' + i + '" data-v="1" aria-label="' + (i + 1) + '번째 숫자 올리기">▲</button><b>' + d + '</b><button type="button" data-d="' + i + '" data-v="-1" aria-label="' + (i + 1) + '번째 숫자 내리기">▼</button></div>' }).join('') + '</div>';
    else {
      var opts = L.opts || SYM[L.t];
      h += '<div class="es-slots">' + L.code.map(function (_, i) { var v = e[i]; return '<span class="es-slot">' + (v == null ? '' : sym(L.t, v, 22)) + '</span>' }).join('') + '</div><div class="es-keys">' + opts.map(function (v) { return '<button type="button" class="es-key" data-put="' + esc(v) + '" aria-label="' + esc(v) + '">' + sym(L.t, v, 26) + (L.t === 'color' ? '<span>' + esc(v) + '</span>' : '') + '</button>' }).join('') + '<button type="button" class="es-key es-del" data-a="del">한 칸 지우기</button></div>';
    }
    h += '<div class="tl-row"><button type="button" class="tl-btn tl-go es-try" data-a="try">열어 보기</button></div><p class="es-msg" aria-live="polite"></p>';
    if (st.notes.length) h += '<details class="es-nbk"><summary>수첩 펼쳐 보기 (' + st.notes.length + ')</summary>' + st.notes.map(function (n) { return '<div class="es-nbi"><b>' + esc(n.t) + '</b>' + n.h + '</div>' }).join('') + '</details>';
    var n = st.lh[o.id] || 0;
    h += '<div class="es-lh">' + L.hints.slice(0, n).map(function (t, i) { return '<p>힌트 ' + (i + 1) + '. ' + frac(t) + '</p>' }).join('') + '</div><div class="tl-row es-lrow">' + (n < L.hints.length ? '<button type="button" class="tl-btn" data-a="lhint">힌트 보기 (' + (L.hints.length - n) + ')</button>' : '') + '<button type="button" class="tl-btn es-teach" data-a="ans">정답 보기(선생님)</button></div></div>';
    return h;
  }
  function sym(t, v, s) {
    if (t === 'dir') return '<svg viewBox="0 0 40 40" width="' + s + '" height="' + s + '" aria-hidden="true">' + ART.arrow(v, 20, 20, 15) + '</svg>';
    if (t === 'shape') return '<svg viewBox="0 0 40 40" width="' + s + '" height="' + s + '" aria-hidden="true">' + ART.shape(v, 20, 21, 15) + '</svg>';
    if (t === 'color') return '<i class="es-sw" style="background:' + ART.c(v) + '"></i>';
    return esc(v);
  }
  function hc() { var el = host.querySelector('.es-hc'); if (el) el.textContent = '힌트 ' + st.hints + ' · 틀림 ' + st.wrong }
  function tryLock(o) {
    var L = o.lock, e = st.entry[o.id], got = L.t === 'num' ? e.join('') : e.join(','), want = L.t === 'num' ? L.code : L.code.join(','), msg = host.querySelector('.es-msg');
    if (L.t !== 'num' && e.length < L.code.length) { msg.textContent = '칸을 모두 채워요(' + L.code.length + '칸).'; return }
    if (got === want) { st.solved[o.id] = 1; sfx(1); var k = o.id; host.querySelector('.es-modal').hidden = true; fx('unlock', jo(o.nm, '이', '가') + ' 열렸어요!', function () { st.fresh = k; give(o); draw(); openObj(k) }); return }
    st.wrong++; sfx(0); var card = host.querySelector('.es-lock'); card.classList.remove('es-shake'); void card.offsetWidth; card.classList.add('es-shake');
    msg.textContent = '열리지 않아요. 단서를 다시 살펴봐요.'; if (L.t !== 'num') { st.entry[o.id] = []; refreshLock(o) } hc();
  }
  function refreshLock(o) { var box = host.querySelector('.es-lock'); if (!box) return; var t = document.createElement('div'); t.innerHTML = lockUI(o); box.replaceWith(t.firstChild) }
  function toast(t) { var d = document.createElement('div'); d.className = 'es-toast'; d.textContent = t; (host.parentNode || host).appendChild(d); setTimeout(function () { d.remove() }, 2200) }
  function useItem(o, iid) {
    if (o.need === iid) {
      st.used[o.id] = 1; var it = R.items[iid]; if (!it.keep) st.inv = st.inv.filter(function (x) { return x !== iid }); st.sel = null;
      sfx(1); var k = o.id; host.querySelector('.es-modal').hidden = true;
      fx('unlock', jo(it.nm, '을', '를') + ' 썼어요!', function () {
        if (!o.lock) { st.fresh = k; give(o) } draw(); openObj(k);
        if (o.useMsg) { var c = host.querySelector('.es-ctext'); c.insertAdjacentHTML('afterbegin', '<p class="es-used">' + frac(o.useMsg) + '</p>') }
      });
    } else { toast('여기에는 ' + jo(R.items[iid].nm, '이', '가') + ' 맞지 않아요'); st.wrong++; sfx(0); hc() }
  }
  /* 가방 물건 합치기 */
  function combine(a, b) {
    var c = COMB.filter(function (x) { return (x.a === a && x.b === b) || (x.a === b && x.b === a) })[0];
    st.sel = null;
    if (!c) { draw(); toast(jo(R.items[a].nm, '과', '와') + ' ' + jo(R.items[b].nm, '은', '는') + ' 합쳐지지 않아요'); sfx(0); return }
    st.inv = st.inv.filter(function (x) { return x !== a && x !== b }); st.inv.push(c.make); st.made[c.make] = 1; sfx('combine');
    draw(); var m = host.querySelector('.es-modal'), it = R.items[c.make];
    m.innerHTML = '<div class="es-card" role="dialog" aria-modal="true" aria-label="합치기"><div class="es-chd"><b>합쳤어요!</b><button type="button" class="tl-btn es-x" data-a="close">닫기</button></div><div class="es-ctext es-solo es-comb"><div class="es-cmb"><span>' + ART.item(R.items[a].k, R.items[a].c) + '<small>' + esc(R.items[a].nm) + '</small></span><b>+</b><span>' + ART.item(R.items[b].k, R.items[b].c) + '<small>' + esc(R.items[b].nm) + '</small></span><b>=</b><span class="es-cmk">' + ART.item(it.k, it.c) + '<small>' + esc(it.nm) + '</small></span></div><p class="es-look">' + frac(c.msg || (jo(it.nm, '이', '가') + ' 되었어요!')) + '</p></div></div>';
    m.hidden = false; var x = m.querySelector('.es-x'); if (x) x.focus({ preventScroll: true });
  }
  function nextStep() {
    for (var i = 0; i < R.flow.length; i++) {
      var f = R.flow[i];
      if (f.indexOf('+') > 0) { var ab = f.split('+'), c = COMB.filter(function (x) { return (x.a === ab[0] && x.b === ab[1]) || (x.a === ab[1] && x.b === ab[0]) })[0]; if (c && !st.made[c.make]) return { comb: c }; continue }
      var o = OBJ[f]; if (!ok(o) || (!st.seen[o.id] && (o.keep || o.give))) return o;
    }
    return exitObj();
  }
  function where() {
    st.hints++; var next = nextStep();
    draw();
    if (next.comb) { say('힌트: 가방의 <b>' + esc(R.items[next.comb.a].nm) + '</b>' + jo(R.items[next.comb.a].nm, '과', '와').slice(-1) + ' <b>' + esc(R.items[next.comb.b].nm) + '</b>' + jo(R.items[next.comb.b].nm, '을', '를').slice(-1) + ' 차례로 눌러 합쳐 봐요.', 'es-hint'); [next.comb.a, next.comb.b].forEach(function (i) { var b = host.querySelector('.es-it[data-it="' + i + '"]'); if (b) b.classList.add('es-pulse2') }); return }
    var top = next; while (top.in) top = OBJ[top.in];
    if (top.scene !== st.scene) { say('힌트: <b>' + esc(jo(SCN[top.scene].nm, '으로', '로')) + '</b> 가 봐요.', 'es-hint'); return }
    if (next.in) say('힌트: <b>' + esc(jo(top.nm, '을', '를')) + '</b> 크게 보고, 그림 속 작은 곳을 구석구석 눌러 봐요.', 'es-hint');
    else say('힌트: ' + frac(next.guide || jo(next.nm, '을', '를') + ' 살펴봐요.'), 'es-hint');
    var g = host.querySelector('.es-obj[data-o="' + top.id + '"]'); if (g) g.classList.add('es-pulse');
  }
  /* 모둠 결과 코드: 방 번호·걸린 초·힌트·틀림을 숫자 하나로 섞고 끝에 확인 숫자(점수판 board.html이 풀어 읽음) */
  function rcode(s) {
    var n = ((((R.idx || 0) * 6000 + Math.min(s, 5999)) * 100 + Math.min(st.hints, 99)) * 100 + Math.min(st.wrong, 99)), m = String((BigInt(n) * 7919n + 123457n) % 1000000000n).padStart(9, '0'), k = 0;
    for (var i = 0; i < 9; i++) k += (+m[i]) * (i % 2 ? 3 : 1); m += (10 - k % 10) % 10; return m.slice(0, 3) + '-' + m.slice(3, 6) + '-' + m.slice(6);
  }
  function when() { var d = new Date(), h = d.getHours(); return d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + '일월화수목금토'[d.getDay()] + '요일 · ' + (h < 12 ? '오전 ' : '오후 ') + ((h + 11) % 12 + 1) + '시 ' + String(d.getMinutes()).padStart(2, '0') + '분 탈출' }
  function win() {
    st.done = true; stop(); var s = st.sec, stars = st.hints <= 2 && st.wrong <= 3 ? 3 : st.hints <= 5 && st.wrong <= 8 ? 2 : 1, code = '';
    try { code = rcode(s) } catch (e) {}
    host.innerHTML = '<div class="es-win"><svg viewBox="0 0 1000 260" class="es-cover" aria-hidden="true">' + bg({ wall: '#FFF4D6', floor: '#F2C230' }, 260) + '<g transform="translate(430 20)">' + A.door(140, 200, { c: '초록' }, true) + '</g></svg><p class="es-bigt">탈출 성공!</p>' + (team ? '<p class="es-wteam">' + esc(team) + '</p>' : '') + '<p class="es-when">' + when() + '</p><p>' + frac(R.outro) + '</p><p class="es-stars" aria-label="별 ' + stars + '개">' + '★★★'.slice(0, stars) + '<i>' + '★★★'.slice(stars) + '</i></p><p>걸린 시간 <b>' + mmss(s) + '</b> · 힌트 <b>' + st.hints + '</b>번 · 틀린 횟수 <b>' + st.wrong + '</b>번 · 모은 단서 <b>' + st.notes.length + '</b>개</p>'
      + (code ? '<div class="es-code"><small>결과 코드</small><b>' + code + '</b></div>' : '') + '<button type="button" class="tl-btn tl-go" data-a="again">처음부터 다시</button></div>';
    api.bar(R.title + ' · 탈출!'); sfx('win'); confetti();
  }
  /* 누르기 */
  host.addEventListener('click', function (e) {
    var t = e.target, b = t.closest('button'), g = t.closest('.es-obj');
    if (b && b.dataset.a === 'snd') { snd = !snd; try { localStorage.setItem(SNDK, snd ? '1' : '0') } catch (er) {} host.querySelectorAll('.es-sndb').forEach(function (x) { x.textContent = snd ? '소리 켜짐' : '소리 꺼짐'; x.setAttribute('aria-pressed', snd) }); if (snd) sfx('tap'); return }
    if (b && b.classList.contains('es-go')) { limit = +host.querySelector('.es-lim').value; team = (host.querySelector('.es-team-in').value || '').trim(); ac(); story(); return }
    if (b && b.dataset.a === 'go' && !st.t0) return begin();
    if (g && g.classList.contains('es-spot')) { sfx('tap'); openObj(g.dataset.o); return }
    if (g && !t.closest('.es-modal')) { var o = OBJ[g.dataset.o]; if (st.sel) { var iid = st.sel; if (o.need && !st.used[o.id]) { useItem(o, iid); return } st.sel = null; draw(); toast('여기에는 쓸 수 없어요. 그냥 살펴볼게요') } sfx('tap'); openObj(o.id); return }
    if (!b) { if (t.classList.contains('es-modal')) closeM(); return }
    var a = b.dataset.a, o2 = st.open && OBJ[st.open];
    if (a === 'close') return closeM();
    if (a === 'again') return reset();
    if (a === 'where') return where();
    if (a === 'exit') { st.sec = sec(); sfx('door'); host.querySelector('.es-modal').hidden = true; return fx('door', '밖으로!', win) }
    if (b.dataset.back) return openObj(b.dataset.back);
    if (b.dataset.sc) { st.scene = b.dataset.sc; st.open = null; st.sel = null; return draw() }
    if (b.dataset.go) { var to = b.dataset.go; sfx('door'); host.querySelector('.es-modal').hidden = true; return fx('door', SCN[to].nm, function () { st.scene = to; st.open = null; draw() }) }
    if (b.dataset.it) { var it = b.dataset.it; if (st.sel && st.sel !== it) return combine(st.sel, it); st.sel = st.sel === it ? null : it; st.open = null; draw(); return }
    if (b.dataset.use && o2) return useItem(o2, b.dataset.use);
    if (b.dataset.nt) { var n = st.notes[+b.dataset.nt], m = host.querySelector('.es-modal'); st.open = null; m.innerHTML = '<div class="es-card"><div class="es-chd"><b>수첩 · ' + esc(n.t) + '</b><button type="button" class="tl-btn es-x" data-a="close">닫기</button></div><div class="es-ctext es-solo">' + n.h + '</div></div>'; m.hidden = false; return }
    if (!o2 || !o2.lock) return;
    var L = o2.lock, en = st.entry[o2.id];
    if (b.dataset.d != null) { var i = +b.dataset.d; en[i] = (en[i] + (+b.dataset.v) + 10) % 10; b.parentNode.querySelector('b').textContent = en[i]; sfx('tap'); return }
    if (b.dataset.put != null) { if (en.length < L.code.length) en.push(b.dataset.put); sfx('tap'); refreshLock(o2); return }
    if (a === 'del') { en.pop(); refreshLock(o2); return }
    if (a === 'try') return tryLock(o2);
    if (a === 'lhint') { st.lh[o2.id] = (st.lh[o2.id] || 0) + 1; st.hints++; refreshLock(o2); hc(); return }
    if (a === 'ans' && confirm('정답을 볼까요? (선생님 확인용)')) { host.querySelector('.es-msg').innerHTML = '정답: <b>' + esc(L.t === 'num' ? L.code : L.code.join(' → ')) + '</b> — ' + frac(L.sol) }
  });
  function closeM() { var m = host.querySelector('.es-modal'); if (m) { m.hidden = true; m.innerHTML = '' } st.open = null; draw() }
  host.addEventListener('keydown', function (e) {
    var g = e.target.closest && e.target.closest('.es-obj'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })) }
  });
  document.addEventListener('keydown', function (e) {
    if (!st || !st.open || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return; var o = OBJ[st.open];
    if (e.key === 'Escape') return closeM();
    if (!o.lock || st.solved[o.id] || (o.need && !st.used[o.id])) return; var L = o.lock, en = st.entry[o.id];
    if (L.t === 'num' && /^[0-9]$/.test(e.key)) { var i = en.__p || 0; en[i] = +e.key; en.__p = (i + 1) % en.length; refreshLock(o); return }
    if (L.t === 'dir') { var k = { ArrowUp: '↑', ArrowRight: '→', ArrowDown: '↓', ArrowLeft: '←' }[e.key]; if (k) { e.preventDefault(); if (en.length < L.code.length) en.push(k); refreshLock(o); return } }
    if (e.key === 'Backspace' && L.t !== 'num') { en.pop(); refreshLock(o); return }
    if (e.key === 'Enter') { e.preventDefault(); tryLock(o) }
  });
  document.getElementById('esPrint').onclick = function () { document.documentElement.classList.add('es-printing'); var off = function () { document.documentElement.classList.remove('es-printing'); window.removeEventListener('afterprint', off) }; window.addEventListener('afterprint', off); setTimeout(function () { window.print() }, 80) };
  reset();
};
