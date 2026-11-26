/* 수학 방탈출 2 (2026-11-26 선생님: '말로만 방탈출, 몇 문제 풀고 끝'): 방 그림을 둘러보며 물건을 눌러 단서를 모으고,
   가방 속 물건을 쓰고, 여러 가지 자물쇠(숫자·방향·색·모양)를 풀어 다음 방으로, 마지막 문으로.
   자료 window.ER = { title, intro, outro, scenes:[{id, nm, bg, objs:[…]}], items:{id:{nm,k,c}}, flow:[물건 id 차례] }
   물건: { id, nm, art, x, y, w, h, p, look, lookFig, keep, need, needMsg, useMsg, lock:{t,len,code,q,hints,sol,opts}, give, after, afterFig, go, req, guide } */
window.TOOL = function (host, api) {
  var R = window.ER, A = ART.A, esc = ART.esc, st, tick = null, limit = 0;
  var OBJ = {}, SCN = {}; R.scenes.forEach(function (s) { SCN[s.id] = s; s.objs.forEach(function (o) { o.scene = s.id; OBJ[o.id] = o }) });
  function frac(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(\d+)\/(\d+)/g, '<span class="fd-fr"><i>$1</i><i>$2</i></span>') }
  function jo(w, a, b) { var s = String(w), ch = s.charCodeAt(s.length - 1), m = s.match(/\d+$/), f; if (m) { var t = m[0].replace(/0+$/, '') || '0'; f = m[0].length > t.length || '013678'.indexOf(t.slice(-1)) >= 0 } else f = ch >= 0xAC00 && ch <= 0xD7A3 && (ch - 0xAC00) % 28 > 0; return s + (f ? a : b) }
  function reset() { st = { t0: 0, scene: R.scenes[0].id, used: {}, solved: {}, given: {}, seen: {}, inv: [], sel: null, notes: [], hints: 0, wrong: 0, lh: {}, done: false, open: null, entry: {} }; stop(); draw() }
  function stop() { if (tick) clearInterval(tick); tick = null }
  function sec() { return st.t0 ? Math.floor((Date.now() - st.t0) / 1000) : 0 }
  function mmss(s) { s = Math.max(0, s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }
  function ok(o) { return (!o.need || st.used[o.id]) && (!o.lock || st.solved[o.id]) }
  function vis(o) { return !o.req || o.req.every(function (id) { return ok(OBJ[id]) }) }
  function sceneOpen(id) { return id === R.scenes[0].id || R.scenes.some(function (s) { return s.objs.some(function (o) { return o.go === id && ok(o) }) }) }
  function nLocks() { var n = 0, d = 0; for (var k in OBJ) if (OBJ[k].lock || OBJ[k].need) { n++; if (ok(OBJ[k])) d++ } return [d, n] }
  function note(title, html) { if (st.notes.some(function (n) { return n.h === html })) return; st.notes.push({ t: title, h: html }) }
  function fig(f) { if (!f) return ''; var w = f.w || 300, h = f.h || 200; return '<svg class="es-fig" viewBox="-12 -24 ' + (w + 24) + ' ' + (h + 36) + '" role="img" aria-label="단서 그림">' + A[f.art](w, h, f.p || {}, f.open) + '</svg>' }
  function timer() { var el = host.querySelector('.es-time'); if (!el) return; var s = sec(); el.textContent = limit ? '남은 시간 ' + mmss(limit * 60 - s) : '걸린 시간 ' + mmss(s); if (limit && s >= limit * 60 && !st.done) { el.textContent = '시간 끝! 계속 해도 돼요'; el.classList.add('es-over') } }
  /* 처음 화면 */
  function startView() {
    host.innerHTML = '<div class="es-start"><svg class="es-cover" viewBox="0 0 1000 300" aria-hidden="true">' + bg(SCN[R.scenes[0].id].bg, 300) + '</svg><p class="es-intro">' + frac(R.intro) + '</p>'
      + '<ul class="es-rules"><li>방 그림 속 <b>물건을 눌러</b> 살펴봐요. 단서는 <b>수첩</b>에 저절로 모여요.</li><li>얻은 물건은 <b>가방</b>에 들어가요. 가방에서 물건을 고른 뒤 쓸 곳을 눌러요.</li><li>자물쇠는 숫자·방향·색깔·모양 여러 가지예요. 단서를 이어 붙여 풀어요.</li><li>막히면 <b>어디를 볼까?</b> 힌트를 눌러요.</li></ul>'
      + '<p class="tl-row">시간 제한 <select class="es-lim"><option value="0">없음(걸린 시간만)</option><option value="15">15분</option><option value="20" selected>20분</option><option value="30">30분</option><option value="40">40분</option></select></p><button type="button" class="tl-btn tl-go es-go">탈출 시작!</button></div>';
    api.bar(R.title);
  }
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
  /* 놀이 화면 */
  function draw() {
    if (!st.t0) return startView();
    if (st.done) return win();
    var S = SCN[st.scene], dn = nLocks(), sel = st.sel;
    var h = '<div class="es-top"><span class="es-time"></span><span class="es-prog">자물쇠·장치 <b>' + dn[0] + '</b> / ' + dn[1] + '</span><span class="es-hc">힌트 ' + st.hints + ' · 틀림 ' + st.wrong + '</span><button type="button" class="tl-btn es-where" data-a="where">어디를 볼까?</button></div>';
    if (R.scenes.length > 1) h += '<div class="es-tabs" role="tablist">' + R.scenes.map(function (s) { var on = sceneOpen(s.id); return '<button type="button" role="tab" class="es-tab" data-sc="' + s.id + '" aria-selected="' + (s.id === st.scene) + '"' + (on ? '' : ' disabled') + '>' + (on ? esc(s.nm) : '잠긴 곳') + '</button>' }).join('') + '</div>';
    h += '<div class="es-main"><div class="es-room"><svg class="es-scene" viewBox="0 0 1000 560" role="group" aria-label="' + esc(S.nm) + '">' + bg(S.bg) + S.objs.filter(vis).map(function (o) {
      return '<g class="es-obj' + (ok(o) && (o.lock || o.need) ? ' es-done' : '') + (st.seen[o.id] ? '' : ' es-new') + '" data-o="' + o.id + '" transform="translate(' + o.x + ' ' + o.y + ')" tabindex="0" role="button" aria-label="' + esc(o.nm) + '">' + A[o.art](o.w, o.h, o.p || {}, ok(o) && (o.lock || o.need)) + '<rect class="es-hot" x="-8" y="-8" width="' + (o.w + 16) + '" height="' + (o.h + 16) + '" rx="10"/></g>';
    }).join('') + '</svg><p class="es-say" aria-live="polite">' + (sel ? '<b>' + esc(R.items[sel].nm) + '</b>' + jo(R.items[sel].nm, '을', '를').slice(-1) + ' 들었어요. 쓸 곳을 눌러요.' : esc(S.nm) + ' — 물건을 눌러 살펴봐요.') + '</p></div>';
    h += '<aside class="es-side"><h3>가방</h3><div class="es-inv">' + (st.inv.length ? st.inv.map(function (id) { var it = R.items[id]; return '<button type="button" class="es-it" data-it="' + id + '" aria-pressed="' + (sel === id) + '" title="' + esc(it.de || it.nm) + '">' + ART.item(it.k, it.c) + '<span>' + esc(it.nm) + '</span></button>' }).join('') : '<p class="es-empty">아직 비어 있어요</p>') + '</div>'
      + '<h3>수첩 <small>' + st.notes.length + '</small></h3><div class="es-notes">' + (st.notes.length ? st.notes.map(function (n, i) { return '<button type="button" class="es-nt" data-nt="' + i + '"><b>' + esc(n.t) + '</b></button>' }).join('') : '<p class="es-empty">살펴본 단서가 여기에 모여요</p>') + '</div></aside></div>';
    h += '<div class="es-modal" hidden></div>';
    host.innerHTML = h; timer();
    api.bar(R.title + ' · ' + S.nm);
    if (st.open) openObj(st.open, true);
  }
  function say(t, cls) { var p = host.querySelector('.es-say'); if (p) { p.innerHTML = t; p.className = 'es-say' + (cls ? ' ' + cls : '') } }
  /* 물건 크게 보기 */
  function openObj(id, keep) {
    var o = OBJ[id], m = host.querySelector('.es-modal'); st.open = id; st.seen[id] = 1;
    var h = '<div class="es-card" role="dialog" aria-modal="true" aria-label="' + esc(o.nm) + '"><div class="es-chd"><b>' + esc(o.nm) + '</b><button type="button" class="tl-btn es-x" data-a="close">닫기</button></div><div class="es-cbody"><div class="es-big"><svg viewBox="-20 -30 ' + (o.w + 40) + ' ' + (o.h + 50) + '" aria-hidden="true">' + A[o.art](o.w, o.h, o.p || {}, ok(o) && (o.lock || o.need)) + '</svg></div><div class="es-ctext">';
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
  function give(o) { if (st.given[o.id]) return; st.given[o.id] = 1; (o.give || []).forEach(function (iid) { if (st.inv.indexOf(iid) < 0) st.inv.push(iid) }); if (o.give && o.give.length) toast('가방에 넣었어요: ' + o.give.map(function (i) { return R.items[i].nm }).join(', ')) }
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
  function tryLock(o) {
    var L = o.lock, e = st.entry[o.id], got = L.t === 'num' ? e.join('') : e.join(','), want = L.t === 'num' ? L.code : L.code.join(','), msg = host.querySelector('.es-msg');
    if (L.t !== 'num' && e.length < L.code.length) { msg.textContent = '칸을 모두 채워요(' + L.code.length + '칸).'; return }
    if (got === want) { st.solved[o.id] = 1; give(o); toast('딸깍! ' + jo(o.nm, '이', '가') + ' 열렸어요'); sfx(1); var keep = st.open; draw(); st.open = keep; openObj(o.id); return }
    st.wrong++; sfx(0); var card = host.querySelector('.es-lock'); card.classList.remove('es-shake'); void card.offsetWidth; card.classList.add('es-shake');
    msg.textContent = '열리지 않아요. 단서를 다시 살펴봐요.'; if (L.t !== 'num') { st.entry[o.id] = []; refreshLock(o) } host.querySelector('.es-hc').textContent = '힌트 ' + st.hints + ' · 틀림 ' + st.wrong;
  }
  function refreshLock(o) { var box = host.querySelector('.es-lock'); if (!box) return; var t = document.createElement('div'); t.innerHTML = lockUI(o); box.replaceWith(t.firstChild) }
  function toast(t) { var d = document.createElement('div'); d.className = 'es-toast'; d.textContent = t; host.appendChild(d); setTimeout(function () { d.remove() }, 2200) }
  var AC = null; function sfx(good) { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); var o = AC.createOscillator(), g = AC.createGain(); o.connect(g); g.connect(AC.destination); o.frequency.value = good ? 660 : 180; g.gain.value = .08; o.start(); o.frequency.linearRampToValueAtTime(good ? 990 : 120, AC.currentTime + .18); g.gain.linearRampToValueAtTime(0, AC.currentTime + .25); o.stop(AC.currentTime + .26) } catch (e) {} }
  function useItem(o, iid) {
    if (o.need === iid) {
      st.used[o.id] = 1; var it = R.items[iid]; if (!it.keep) st.inv = st.inv.filter(function (x) { return x !== iid }); st.sel = null;
      if (!o.lock) give(o); toast(jo(it.nm, '을', '를') + ' 썼어요!'); sfx(1);
      var k = o.id; draw(); openObj(k); if (o.useMsg) { var c = host.querySelector('.es-ctext'); c.insertAdjacentHTML('afterbegin', '<p class="es-used">' + frac(o.useMsg) + '</p>') }
    } else { toast('여기에는 ' + jo(R.items[iid].nm, '이', '가') + ' 맞지 않아요'); st.wrong++; sfx(0); var hc = host.querySelector('.es-hc'); if (hc) hc.textContent = '힌트 ' + st.hints + ' · 틀림 ' + st.wrong }
  }
  function where() {
    st.hints++; var next = null; for (var i = 0; i < R.flow.length; i++) { var o = OBJ[R.flow[i]]; if (!ok(o) || (!st.seen[o.id] && o.keep)) { next = o; break } }
    if (!next) { var ex = null; for (var k in OBJ) if (OBJ[k].go === 'exit') ex = OBJ[k]; next = ex }
    draw();
    if (next.scene !== st.scene) say('힌트: <b>' + esc(jo(SCN[next.scene].nm, '으로', '로')) + '</b> 가 봐요.', 'es-hint');
    else { say('힌트: ' + frac(next.guide || jo(next.nm, '을', '를') + ' 살펴봐요.'), 'es-hint'); var g = host.querySelector('.es-obj[data-o="' + next.id + '"]'); if (g) g.classList.add('es-pulse') }
  }
  function win() {
    st.done = true; stop(); var s = st.sec, stars = st.hints <= 2 && st.wrong <= 3 ? 3 : st.hints <= 5 && st.wrong <= 8 ? 2 : 1;
    host.innerHTML = '<div class="es-win"><svg viewBox="0 0 1000 260" class="es-cover" aria-hidden="true">' + bg({ wall: '#FFF4D6', floor: '#F2C230' }, 260) + '<g transform="translate(430 20)">' + A.door(140, 200, { c: '초록' }, true) + '</g></svg><p class="es-bigt">탈출 성공!</p><p>' + frac(R.outro) + '</p><p class="es-stars" aria-label="별 ' + stars + '개">' + '★★★'.slice(0, stars) + '<i>' + '★★★'.slice(stars) + '</i></p><p>걸린 시간 <b>' + mmss(s) + '</b> · 힌트 <b>' + st.hints + '</b>번 · 틀린 횟수 <b>' + st.wrong + '</b>번 · 모은 단서 <b>' + st.notes.length + '</b>개</p><button type="button" class="tl-btn tl-go" data-a="again">처음부터 다시</button></div>';
    api.bar(R.title + ' · 탈출!');
  }
  /* 누르기 */
  host.addEventListener('click', function (e) {
    var t = e.target, b = t.closest('button'), g = t.closest('.es-obj');
    if (b && b.classList.contains('es-go')) { limit = +host.querySelector('.es-lim').value; st.t0 = Date.now(); tick = setInterval(timer, 1000); draw(); return }
    if (g && !t.closest('.es-modal')) { var o = OBJ[g.dataset.o]; if (st.sel) { var iid = st.sel; if (o.need && !st.used[o.id]) { useItem(o, iid); return } st.sel = null; draw(); toast('여기에는 쓸 수 없어요. 그냥 살펴볼게요') } openObj(o.id); return }
    if (!b) { if (t.classList.contains('es-modal')) closeM(); return }
    var a = b.dataset.a, o2 = st.open && OBJ[st.open];
    if (a === 'close') return closeM();
    if (a === 'again') return reset();
    if (a === 'where') return where();
    if (a === 'exit') { st.sec = sec(); return win() }
    if (b.dataset.sc) { st.scene = b.dataset.sc; st.open = null; st.sel = null; return draw() }
    if (b.dataset.go) { st.scene = b.dataset.go; st.open = null; return draw() }
    if (b.dataset.it) { st.sel = st.sel === b.dataset.it ? null : b.dataset.it; var keep = st.open; st.open = null; draw(); return }
    if (b.dataset.use && o2) return useItem(o2, b.dataset.use);
    if (b.dataset.nt) { var n = st.notes[+b.dataset.nt], m = host.querySelector('.es-modal'); st.open = null; m.innerHTML = '<div class="es-card"><div class="es-chd"><b>수첩 · ' + esc(n.t) + '</b><button type="button" class="tl-btn es-x" data-a="close">닫기</button></div><div class="es-ctext es-solo">' + n.h + '</div></div>'; m.hidden = false; return }
    if (!o2 || !o2.lock) return;
    var L = o2.lock, en = st.entry[o2.id];
    if (b.dataset.d != null) { var i = +b.dataset.d; en[i] = (en[i] + (+b.dataset.v) + 10) % 10; b.parentNode.querySelector('b').textContent = en[i]; return }
    if (b.dataset.put != null) { if (en.length < L.code.length) en.push(b.dataset.put); refreshLock(o2); return }
    if (a === 'del') { en.pop(); refreshLock(o2); return }
    if (a === 'try') return tryLock(o2);
    if (a === 'lhint') { st.lh[o2.id] = (st.lh[o2.id] || 0) + 1; st.hints++; refreshLock(o2); host.querySelector('.es-hc').textContent = '힌트 ' + st.hints + ' · 틀림 ' + st.wrong; return }
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
