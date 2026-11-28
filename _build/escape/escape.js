/* 수학 방탈출 2 (2026-11-26 선생님: '말로만 방탈출, 몇 문제 풀고 끝'): 방 그림을 둘러보며 물건을 눌러 단서를 모으고,
   가방 속 물건을 쓰고, 여러 가지 자물쇠(숫자·방향·색·모양)를 풀어 다음 방으로, 마지막 문으로.
   2026-11-27 더함: ① 처음 이야기 장면·자물쇠가 열리는 움직임·문이 열리며 다른 곳으로·효과음(끄고 켜기) ② 가방 물건 합치기(R.combine)
   ③ 크게 볼 때만 보이는 숨은 곳(물건의 in = 부모 물건 id, 부모 그림 안 좌표 — 서랍 안의 서랍·작은 쪽지) ④ 모둠 대항(모둠 이름·결과 코드, 점수판 board.html)
   자료 window.ER = { idx, title, intro, story:[…], outro, scenes:[{id, nm, bg, objs:[…]}], items:{id:{nm,k,c}}, combine:[{a,b,make,msg}], flow:[물건 id 또는 'a+b'] }
   물건: { id, nm, art, x, y, w, h, p, in, look, lookFig, keep, need, needMsg, useMsg, lock:{t,code,q,hints,sol,opts}, give, after, afterFig, go, req, guide } */
window.TOOL = function (host, api) {
  var R = window.ER, A = ART.A, esc = ART.esc, st, tick = null, limit = 0, team = '', root = host.closest('.tl-stage') || host;
  var OBJ = {}, SCN = {}, KIDS = {}; R.scenes.forEach(function (s) { SCN[s.id] = s; s.objs.forEach(function (o) { o.scene = s.id; OBJ[o.id] = o; if (o.in) (KIDS[o.in] = KIDS[o.in] || []).push(o) }) });
  var COMB = R.combine || [], RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SNDK = 'hj-escape-snd', snd = true; try { snd = localStorage.getItem(SNDK) !== '0' } catch (e) {}
  /* 모양 글자(○△□☆◇♡)는 자물쇠 단추·그림과 같은 꽉 찬 작은 모양으로(2026-11-28) — '32 : □'처럼 모르는 수 자리의 □는 그대로 */
  var SHN = { '○': '동그라미', '△': '세모', '□': '네모', '☆': '별', '◇': '마름모', '♡': '하트' };
  function shp(v) { return '<svg class="es-shp" viewBox="0 0 40 40" role="img" aria-label="' + SHN[v] + '">' + ART.shape(v, 20, 21, 16) + '</svg>' }
  function frac(s) {
    return esc(s).replace(/([^\s<>*]*?)(\d+)\/(\d+)([^\s<>*]*)/g, '<span class="es-nw">$1<span class="fd-fr"><i>$2</i><i>$3</i></span>$4</span>')
      .replace(/\*\*(.+?)\*\*/g, function (m, t) { return t.replace(/<[^>]+>/g, '').length <= 12 ? '<b class="es-nw">' + t + '</b>' : '<b>' + t + '</b>' })
      .replace(/[○△□☆◇♡]/g, function (v, i, all) { return v === '□' && (/[=:×÷+−-]\s*$/.test(all.slice(Math.max(0, i - 3), i)) || /^\s*[=:]/.test(all.slice(i + 1, i + 4))) ? v : shp(v) });
  }
  /* 받침에 따라 조사: jo(낱말, '을', '를') — '으로/로'는 받침 ㄹ이면 '로'(우리길로, 1로·7로·8로) */
  function jo(w, a, b) {
    var s = String(w), ch = s.charCodeAt(s.length - 1), m = s.match(/\d+$/), f, rl = false;
    if (m) { var t = m[0].replace(/0+$/, '') || '0', d = t.slice(-1); f = m[0].length > t.length || '013678'.indexOf(d) >= 0; rl = m[0].length === t.length && '178'.indexOf(d) >= 0 }
    else { var j = ch >= 0xAC00 && ch <= 0xD7A3 ? (ch - 0xAC00) % 28 : 0; f = j > 0; rl = j === 8 }
    if (a === '으로' && rl) f = false;
    return s + (f ? a : b);
  }
  function reset(keep) { BUD = null; stopIntro(); st = { t0: 0, scene: R.scenes[0].id, used: {}, solved: {}, given: {}, seen: {}, inv: [], sel: null, notes: [], hints: 0, wrong: 0, ans: {}, lh: {}, done: false, open: null, entry: {}, made: {}, shown: {}, drawn: {} }; stop(); if (!keep) unsave(); draw() }
  /* 진행 저장(2026-11-28 예비 사용자 팀): 새로 고침·다른 쪽에 갔다 와도 이 탭(sessionStorage)에서 '이어서 하기' — 걸린 시간은 떠나 있던 동안 멈춤 */
  var SVK = 'hj-escape-run:' + (R.id || R.idx);
  function save() { if (!st || !st.t0 || st.done) return; try { var c = JSON.parse(JSON.stringify(st)); c.el = sec(); c.open = null; c.sel = null; sessionStorage.setItem(SVK, JSON.stringify({ st: c, limit: limit, team: team })) } catch (e) {} }
  function unsave() { try { sessionStorage.removeItem(SVK) } catch (e) {} }
  function saved() { try { var v = JSON.parse(sessionStorage.getItem(SVK)); return v && v.st && v.st.t0 && !v.st.done ? v : null } catch (e) { return null } }
  function resume(v) { st = v.st; limit = v.limit || 0; team = v.team || ''; st.t0 = Date.now() - (st.el || 0) * 1000; delete st.el; st.drawn = {}; st.shown = {}; st.lp = sec(); stop(); tick = setInterval(timer, 1000); draw() }
  window.addEventListener('beforeunload', function (e) { if (st && st.t0 && !st.done) { save(); e.preventDefault(); e.returnValue = '' } });
  function stop() { if (tick) clearInterval(tick); tick = null }
  function sec() { return st.t0 ? Math.floor((Date.now() - st.t0) / 1000) : 0 }
  function mmss(s) { s = Math.max(0, s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }
  function ok(o) { return (!o.need || st.used[o.id]) && (!o.lock || st.solved[o.id]) }
  function vis(o) { return (!o.req || o.req.every(function (id) { return ok(OBJ[id]) })) && (!o.in || (vis(OBJ[o.in]) && ok(OBJ[o.in]))) }
  /* 열린 장면: 첫 장면에서 시작해, 열린 장면 안의 '보이고(req·부모) 풀린' 문이 가리키는 장면만 더함 */
  function openScenes() { var on = {}, ch = true; on[R.scenes[0].id] = 1; while (ch) { ch = false; R.scenes.forEach(function (s) { if (!on[s.id]) return; s.objs.forEach(function (o) { if (o.go && o.go !== 'exit' && !on[o.go] && ok(o) && vis(o)) { on[o.go] = 1; ch = true } }) }) } return on }
  function sceneOpen(id) { return !!openScenes()[id] }
  function nLocks() { var n = 0, d = 0; for (var k in OBJ) if (OBJ[k].lock || OBJ[k].need) { n++; if (ok(OBJ[k])) d++ } return [d, n] }
  function note(title, html) { if (st.notes.some(function (n) { return n.h === html })) return; st.notes.push({ t: title, h: html }) }
  function fig(f) { if (!f) return ''; var w = f.w || 300, h = f.h || 200; return '<svg class="es-fig" viewBox="-12 -24 ' + (w + 24) + ' ' + (h + 36) + '" role="img" aria-label="단서 그림">' + A[f.art](w, h, f.p || {}, f.open) + '</svg>' }
  function timer() { var el = root.querySelector('.es-time'); if (!el) return; save(); var s = sec(); el.textContent = limit ? '남은 시간 ' + mmss(limit * 60 - s) : '걸린 시간 ' + mmss(s); if (limit && s >= limit * 60 && !st.done) { el.textContent = '시간 끝! 계속 해도 돼요'; el.classList.add('es-over') }
    /* 60초 동안 아무것도 못 열면 친구가 '어디를 볼까?'·'힌트 보기'를 권함(힌트로 세지 않음) */
    if (!st.done && s - (st.lp || 0) >= 60) { st.lp = s; var lo = st.open && OBJ[st.open].lock && !st.solved[st.open] && !(OBJ[st.open].need && !st.used[st.open]); if (lo) buddy('momo', '힌트 보기를 눌러 봐도 돼.'); else fl('idle') } }
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
  var SPK = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z"/>';
  /* 소리 단추: 놀이 중에는 아이콘만(es-sndt면 글도) */
  function sndBtn(t) { return '<button type="button" class="tl-btn es-sndb' + (t ? ' es-sndt' : '') + '" data-a="snd" aria-pressed="' + snd + '" aria-label="' + (snd ? '소리 켜짐 — 누르면 꺼요' : '소리 꺼짐 — 누르면 켜요') + '" title="' + (snd ? '소리 켜짐' : '소리 꺼짐') + '">' + SPK + (snd ? '<path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>' : '<path d="m16 9.5 5 5M21 9.5l-5 5"/>') + '</svg>' + (t ? '<span>' + (snd ? '켜짐' : '꺼짐') + '</span>' : '') + '</button>' }

  /* ── 움직임: 자물쇠 열림 · 문 열고 들어가기 · 꽃가루 ── */
  function fx(kind, label, cb) {
    if (RM) { cb && cb(); return }
    var d = document.createElement('div'); d.className = 'es-fx es-fx-' + kind; d.setAttribute('aria-hidden', 'true');
    if (kind === 'unlock') d.innerHTML = '<svg viewBox="0 0 120 140" class="es-pad"><path class="es-shk" d="M30 62V40a30 30 0 0 1 60 0v22" fill="none" stroke="#8A929C" stroke-width="12" stroke-linecap="round"/><rect x="14" y="60" width="92" height="72" rx="14" fill="#F2C230" stroke="#3A2C22" stroke-width="5"/><circle cx="60" cy="90" r="9" fill="#3A2C22"/><rect x="56" y="94" width="8" height="20" rx="3" fill="#3A2C22"/></svg><b>' + esc(label || '열렸어요!') + '</b>';
    else d.innerHTML = '<i class="es-dl"></i><i class="es-dr"></i><b>' + esc(label || '') + '</b>';
    host.appendChild(d); setTimeout(function () { d.remove(); cb && cb() }, kind === 'unlock' ? 950 : 1150);
  }
  function confetti() { if (RM) return; var w = host.querySelector('.es-win'); if (!w) return; var cols = ['#E5534B', '#F2C230', '#3DA35D', '#3B6FD6', '#EE7DB0', '#8A5BC9'], h = ''; for (var i = 0; i < 46; i++) h += '<i style="left:' + (i * 37 % 100) + '%;background:' + cols[i % 6] + ';animation-delay:' + (i % 9) * .14 + 's;animation-duration:' + (1.8 + (i % 5) * .3) + 's"></i>'; w.insertAdjacentHTML('afterbegin', '<div class="es-conf" aria-hidden="true">' + h + '</div>') }

  /* 읽어 주기(2026-11-28): 누를 때만, 브라우저 한국어 목소리 — 없으면 단추를 숨김(html.es-ttson) */
  var SS = window.speechSynthesis, KOV = null;
  function kov() { try { KOV = SS && SS.getVoices().filter(function (v) { return /^ko/i.test(v.lang) })[0] || null } catch (e) { KOV = null } document.documentElement.classList.toggle('es-ttson', !!KOV) }
  if (SS) { kov(); try { SS.addEventListener('voiceschanged', kov) } catch (e) { SS.onvoiceschanged = kov } }
  function spk() { return '<button type="button" class="es-spk" data-a="speak" aria-label="읽어 주기" title="읽어 주기">' + SPK + '<path d="M15.5 9a4 4 0 0 1 0 6"/></svg></button>' }
  function ttsTxt(el) {
    var c = el.cloneNode(true);
    [].forEach.call(c.querySelectorAll('button'), function (x) { x.remove() });
    [].forEach.call(c.querySelectorAll('.fd-fr'), function (f) { var i = f.querySelectorAll('i'); f.replaceWith(' ' + i[1].textContent + '분의 ' + i[0].textContent + ' ') });
    [].forEach.call(c.querySelectorAll('.es-shp'), function (x) { x.replaceWith(' ' + x.getAttribute('aria-label') + ' ') });
    return c.textContent.replace(/×/g, ' 곱하기 ').replace(/÷/g, ' 나누기 ').replace(/−/g, ' 빼기 ').replace(/\+/g, ' 더하기 ').replace(/=/g, ' 는 ').replace(/ → /g, ', ').replace(/[↑→↓←]/g, function (v) { return ' ' + DIRN[v] + ' ' }).replace(/\s+/g, ' ').trim();
  }
  function plainTxt(html) { var d = document.createElement('div'); d.innerHTML = html; return ttsTxt(d) }
  var UREAD = false, VO = null;
  function speak(el) {
    if (!SS || !el) return; var t = ttsTxt(el);
    try { SS.cancel(); VO = null; var u = new SpeechSynthesisUtterance(t); u.lang = 'ko-KR'; if (KOV) u.voice = KOV; u.rate = .95; UREAD = true; u.onend = u.onerror = function () { UREAD = false }; SS.speak(u) } catch (e) {}
  }
  /* ── 함께하는 친구 토리·모모(2026-11-28 선생님: '다른 캐릭터도 나와서 같이 방탈출을 하는 느낌') ──
     목소리: 브라우저 한국어 목소리로 사람마다 높이·빠르기를 달리(토리 높고 빠르게, 모모 낮고 또박또박). 소리 꺼짐·목소리 없음이면 글만.
     학생이 누른 읽어 주기(🔊)가 나오는 중이면 친구 목소리는 내지 않음. 학생이 다른 것을 누르면 멈춤(hush). */
  var VP = { tori: [1.5, 1.08], momo: [.72, .88], nar: [1, .95] };
  /* 게임 중 친구 목소리는 처음엔 꺼 둠(말풍선만) — 소리 단추 옆 '친구 목소리'로 따로 켬. 인트로·탈출 대사는 소리 켜짐이면 읽음 */
  var FVK = 'hj-escape-fv', fv = false; try { fv = localStorage.getItem(FVK) === '1' } catch (e) {}
  function fvBtn() { return '<button type="button" class="tl-btn es-fvb" data-a="fv" aria-pressed="' + fv + '" title="게임 중에 친구 말을 목소리로도 들려줘요">친구 목소리 ' + (fv ? '켜짐' : '꺼짐') + '</button>' }
  function voice(who, html, cb, game) {
    if (!snd || !SS || !KOV || (UREAD && SS.speaking) || (game && !fv)) return false;
    try { SS.cancel(); UREAD = false; var u = new SpeechSynthesisUtterance(plainTxt(html)), p = VP[who] || VP.nar; u.lang = 'ko-KR'; u.voice = KOV; u.pitch = p[0]; u.rate = p[1]; VO = u; u.onend = u.onerror = function () { if (VO === u) VO = null; cb && cb() }; SS.speak(u); return true } catch (e) { return false }
  }
  function hush() { if (VO) { VO = null; try { SS.cancel() } catch (e) {} } }
  /* 친구 말풍선: 크게 보기·자물쇠 창이 열려 있으면 창 안 맨 위(.es-mbud)에, 아니면 가방 판 위(.es-bud)에 — 창을 가리지 않게 */
  var BUD = null, BUDT = null, BN = 0, LI = {}, LINES = {
    unlock: [['tori', '열렸다! 우리 진짜 잘한다!'], ['momo', '딱 맞았어. 단서 정리가 잘 됐네.'], ['tori', '우와, 철컥 열렸어!'], ['momo', '단서를 잘 이었구나.'], ['tori', '해냈어! 또 찾아보자!'], ['momo', '좋아, 하나 더 풀었어.']],
    use: [['tori', '딱 맞는 물건이었어!'], ['momo', '알맞은 곳에 잘 썼어.']],
    wrong1: [['momo', '괜찮아, 단서를 다시 보자.'], ['tori', '아깝다! 한 번 더 해 보자.'], ['momo', '수첩을 펼쳐 보면 어때?']],
    wrong2: [['momo', '힌트 보기를 눌러 봐도 돼.'], ['tori', '막히면 힌트를 봐도 괜찮아!']],
    wrongi: [['tori', '음, 여기엔 안 맞나 봐.'], ['momo', '막히면 ‘어디를 볼까?’ 단추를 눌러 봐.']],
    item: [['tori', '좋은 걸 찾았어! 어디에 쓸까?'], ['tori', '가방에 쏙! 잘 챙겨 두자.']],
    comb: [['momo', '두 조각이 딱 맞았어.'], ['tori', '우와, 합치니까 완성이야!']],
    idle: [['momo', '‘어디를 볼까?’ 단추를 누르면 내가 알려 줄게.'], ['tori', '같이 구석구석 눌러 보자!']]
  };
  function pick(k) { var a = LINES[k]; LI[k] = ((LI[k] == null ? -1 : LI[k]) + 1) % a.length; return a[LI[k]] }
  /* 힌트(o.hint)는 다른 것을 누를 때까지 남음 */
  function buddy(who, html, o) {
    o = o || {}; var id = ++BN, len = plainTxt(html).length; clearTimeout(BUDT);
    BUD = { w: who, t: html, m: o.mood || 'base', hint: !!o.hint, id: id, talk: true }; paintBud();
    var ms = o.ms || Math.max(3600, len * 85 + 1300);
    var end = function () { if (BUD && BUD.id === id) { BUD.talk = false; paintBud() } };
    var spoke = voice(who, html, function () { end(); if (BUD && BUD.id === id && !BUD.hint) BUDT = setTimeout(function () { if (BUD && BUD.id === id) { BUD = null; paintBud() } }, 1400) }, true);
    if (!spoke) setTimeout(end, Math.min(ms - 600, 300 + len * 45));
    if (!o.hint) BUDT = setTimeout(function () { if (BUD && BUD.id === id && !(spoke && VO)) { BUD = null; paintBud() } }, ms);
  }
  function budFace(w, b) { var on = b && b.w === w; return '<span class="es-bf es-bf-' + w + (on ? ' es-on' + (b.talk ? ' cs-talk' : '') : '') + '">' + CAST.face(w, on ? b.m : 'base') + '</span>' }
  function budText(b) { return '<b class="es-bnm">' + (b.hint ? '힌트' : CAST.NM[b.w]) + '</b>' + b.t }
  function budSide(b) {
    var M = R.mission;
    return '<div class="es-bfaces">' + budFace('tori', b) + budFace('momo', b) + '</div><p class="es-bub' + (b ? ' es-bub-' + b.w + (b.hint ? ' es-bub-hint' : '') : ' es-bub-idle') + '">' + (b ? budText(b) : '<b class="es-bnm">미션</b>' + frac(M ? M.title : R.title)) + '</p>';
  }
  function paintBud() {
    var m = host.querySelector('.es-modal'), mo = m && !m.hidden, ms = host.querySelector('.es-mbud'), sd = host.querySelector('.es-bud');
    if (ms) { ms.innerHTML = BUD && mo ? budFace(BUD.w, BUD) + '<p class="es-bub es-bub-' + BUD.w + (BUD.hint ? ' es-bub-hint' : '') + '">' + budText(BUD) + '</p>' : ''; ms.hidden = !(BUD && mo) }
    if (sd) sd.innerHTML = budSide(BUD && !(mo && ms) ? BUD : null);
  }
  /* 친구가 너무 자주 말하지 않게(예비 사용자 팀): 같은 종류는 GAP초 안에 되풀이하지 않고, 물건 얻기·쓰기 반응은 세 번에 한 번쯤 */
  var LT = {}, NC = {}, GAP = { unlock: 10, wrong1: 15, wrong2: 15, wrongi: 15, item: 25, use: 25, comb: 10, idle: 0 };
  function fl(k, o) {
    var now = Date.now() / 1000, g = GAP[k] == null ? 15 : GAP[k];
    if (k === 'item' || k === 'use') { NC[k] = (NC[k] || 0) + 1; if (NC[k] % 3 !== 1) return }
    if (LT[k] && now - LT[k] < g) return; LT[k] = now;
    var x = pick(k); buddy(x[0], x[1], o);
  }
  /* ── 인트로: 첫 장면 그림 위에 영화 자막처럼 한 줄씩(말하는 친구 얼굴 · 타자 치듯 · 목소리), 끝나면 '미션 시작!' ── */
  var IN = null;
  function introLines() {
    if (R.dialog && R.dialog.length) return R.dialog.map(function (x) { return { w: x[0], t: x[1] } });
    var L = R.story && R.story.length ? R.story : String(R.intro).split(/(?<=[.!?])\s+/);
    return L.map(function (t) { return { w: 'nar', t: t } });
  }
  /* 자막 마지막 줄에 낱말 하나만 남지 않게 마지막 낱말들(일곱 글자까지)을 붙는 빈칸으로 */
  function glue(t) { t = String(t); var k = t.lastIndexOf(' '); for (var c = 0; c < 3 && k > 0; c++) { t = t.slice(0, k) + '\u00a0' + t.slice(k + 1); if (t.slice(k + 1).replace(/[\s\u00a0*]/g, '').length >= 7) break; k = t.lastIndexOf(' ', k - 1) } return t }
  /* 타자: 글 전체를 처음부터 깔아 두고(낱말마다 줄바꿈 없는 묶음, 글자마다 투명) 글자 색만 차례로 입힘 — 타자 중에도 줄 배치가 끝 모습과 같음.
     돌려주는 {iv, done(), finish()}: finish는 남은 글자를 한꺼번에 보여 줌 */
  function typeIn(p, html, cb) {
    p.innerHTML = frac(glue(html));
    var cs = [], w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), n, ns = []; while ((n = w.nextNode())) ns.push(n);
    ns.forEach(function (t) {
      var f = document.createDocumentFragment();
      t.nodeValue.split(/( +)/).forEach(function (tok) {
        if (!tok) return; if (/^ +$/.test(tok)) { f.appendChild(document.createTextNode(tok)); return }
        var wd = document.createElement('span'); wd.className = 'es-tw';
        Array.from(tok).forEach(function (ch) { var c = document.createElement('span'); c.className = 'es-tc'; c.textContent = ch; wd.appendChild(c); cs.push(c) });
        f.appendChild(wd);
      });
      t.parentNode.replaceChild(f, t);
    });
    var k = 0, fin = false, T = { iv: null, done: function () { return fin } };
    T.finish = function () { if (fin) return; clearInterval(T.iv); for (; k < cs.length; k++) cs[k].className = ''; fin = true; cb && cb() };
    if (RM) { T.finish(); return T }
    T.iv = setInterval(function () { if (k >= cs.length) return T.finish(); cs[k++].className = '' }, 34);
    return T;
  }
  function moodOf(l) { return l.w === 'tori' ? (/[!?]/.test(l.t) ? 'wow' : 'base') : 'base' }
  function stopIntro() { if (IN) { IN.ty && clearInterval(IN.ty.iv); clearTimeout(IN.to); clearTimeout(IN.to2); IN.tok++; IN = null } hush() }
  function introShow() {
    if (!IN) return; hush(); IN.ty && clearInterval(IN.ty.iv); clearTimeout(IN.to); clearTimeout(IN.to2);
    var tok = ++IN.tok, i = IN.i, ln = IN.lines[i], sv = host.querySelector('.es-stsv');
    if (!ln || !sv) return introEnd();
    if (i >= IN.sl && !IN.slammed) { IN.slammed = 1; sv.classList.add('es-slammed'); sfx('slam') }
    var sub = host.querySelector('.es-sub'), mood = moodOf(ln);
    sub.className = 'es-sub es-sub-' + ln.w + (RM ? '' : ' es-subin');
    host.querySelector('.es-sface').innerHTML = ln.w === 'nar' ? '' : CAST.face(ln.w, mood, 'cs-talk');
    host.querySelector('.es-swho').textContent = CAST.NM[ln.w] || '';
    ['tori', 'momo'].forEach(function (w) { var g = sv.querySelector('.es-sc-' + w); if (g) g.classList.toggle('cs-talk', ln.w === w) });
    var pr = host.querySelector('.es-sprog'); if (pr) pr.textContent = (i + 1) + ' / ' + IN.lines.length;
    var len = plainTxt(frac(ln.t)).length, quiet = function () { if (IN && IN.tok === tok) { [].forEach.call(host.querySelectorAll('.es-stg .cs-talk'), function (x) { x.classList.remove('cs-talk') }) } };
    var go = function () { if (IN && IN.tok === tok) { IN.i++; introShow() } };
    /* 목소리가 없거나 소리 꺼짐: 1·2학년 방은 저절로 넘기지 않고 '계속'을 기다림, 3학년부터는 타자가 끝난 뒤 4초(글자당 0.15초) 넘게 */
    var spoke = false, nx = host.querySelector('.es-snext'); if (nx) nx.classList.remove('es-wait'); var rw0 = host.querySelector('.es-strow'); if (rw0) rw0.classList.remove('es-waiting');
    IN.ty = typeIn(host.querySelector('.es-sline'), ln.t, function () {
      if (spoke || !IN || IN.tok !== tok) return; quiet();
      if (LOW) { if (nx) nx.classList.add('es-wait'); var rw = host.querySelector('.es-strow'); if (rw) rw.classList.add('es-waiting') } else IN.to2 = setTimeout(go, Math.max(4, len * .15) * 1000);
    });
    spoke = voice(ln.w, frac(ln.t), function () { if (!IN || IN.tok !== tok) return; quiet(); clearTimeout(IN.to2); IN.to = setTimeout(go, 650) });
    if (spoke) IN.to2 = setTimeout(go, (len * .25 + 6) * 1000);
  }
  function introEnd() { stopIntro(); begin() }
  /* 미션 시작 알림(누르기를 막지 않음) */
  function mflash() {
    var M = R.mission, d = document.createElement('div'); d.className = 'es-mflash'; d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<span class="es-mtag">미션 시작!</span><b>' + frac(M ? M.title : R.title) + '</b>';
    var sc = host.querySelector('.es-scene'), r = sc && sc.getBoundingClientRect(); if (r && r.width) { d.style.left = (r.left + r.width / 2) + 'px'; d.style.top = (r.top + r.height / 2) + 'px' }
    (host.parentNode || host).appendChild(d); setTimeout(function () { d.remove() }, 1500);
  }
  /* 처음 화면 */
  function limTxt(m) { return m ? '시간 제한 ' + m + '분' : '시간 제한 없음' }
  function startView() {
    var sv = saved(); if (sv && sv.team && !team) team = sv.team;
    var lim = (R.g || 3) <= 2 ? 30 : 20, M = R.mission || { title: R.title, goal: R.intro }, tips = M.tips || [];
    host.innerHTML = '<div class="es-start">' + (sv ? '<div class="es-resume"><p><b>하던 탈출이 있어요.</b> 걸린 시간 ' + mmss(sv.st.el || 0) + (sv.team ? ' · ' + esc(sv.team) : '') + '</p><div class="tl-row"><button type="button" class="tl-btn tl-go" data-a="resume">이어서 하기</button><button type="button" class="tl-btn" data-a="fresh">처음부터</button></div></div>' : '')
      + '<section class="es-mission" aria-label="미션"><span class="es-mc es-mc-l">' + CAST.full('tori', 'wow') + '</span><div class="es-mbody"><span class="es-mtag">미션</span><h2 class="es-mtt">' + frac(M.title) + '</h2><p class="es-mgoal">' + frac(M.goal) + '</p>'
      + '<p class="es-mmeta"><span>자물쇠와 장치 ' + nLocks()[1] + '개</span><span class="es-mlim">' + limTxt(lim) + '</span></p>' + (tips.length ? '<ul class="es-tips">' + tips.map(function (t) { return '<li>' + frac(t) + '</li>' }).join('') + '</ul>' : '') + '</div><span class="es-mc es-mc-r">' + CAST.full('momo', 'base') + '</span></section>'
      + '<ol class="es-steps"><li><span><b>물건을 눌러</b> 크게 살펴봐요</span></li><li><span>단서는 <b>수첩</b>에, 찾은 물건은 <b>가방</b>에 모여요</span></li><li><span>막히면 <b>어디를 볼까?</b>를 눌러요</span></li></ol>'
      + '<div class="es-opts"><label class="es-opt"><span>이름 또는 모둠</span><input class="es-team-in" maxlength="12" placeholder="예: 3번, 1모둠" value="' + esc(team) + '"></label><label class="es-opt"><span>시간 제한</span><select class="es-lim">' + [0, 15, 20, 25, 30, 40].map(function (m) { return '<option value="' + m + '"' + (m === lim ? ' selected' : '') + '>' + (m ? m + '분' : '없음') + '</option>' }).join('') + '</select></label><div class="es-opt"><span>소리</span>' + sndBtn(true) + '</div></div><button type="button" class="tl-btn tl-go es-go">이야기 보고 시작하기</button></div>';
    api.bar('');
  }
  /* 이야기 장면: 첫 장면 그림(친구 둘 · 열린 문 → 쾅 닫히는 문과 자물쇠) + 아래 자막 */
  function story() {
    var ex = exitObj(), lines = introLines(), dc = (ex && ex.p && ex.p.c) || '갈색', sl = -1;
    lines.some(function (l, i) { if (/쾅|덜컥|철컥|닫히|닫혔|닫혀|잠겼|잠기|잠갔|잠가|갇혔|갇혀/.test(l.t)) { sl = i; return true } });
    if (sl < 0) sl = Math.min(1, lines.length - 1);
    var S0 = SCN[R.scenes[0].id];   /* 배경: 그 방 첫 장면(물건 포함)을 흐리고 어둡게 — 방마다 다른 그림(2026-11-28). 따로 한 겹이라 문·친구가 움직여도 다시 그리지 않음 */
    host.innerHTML = '<div class="es-story"><div class="es-stg"><div class="es-stbg" aria-hidden="true"><svg viewBox="0 20 1000 520" preserveAspectRatio="xMidYMid slice">' + bg(S0.bg) + S0.objs.filter(function (o) { return !o.in && vis(o) }).map(function (o) { return '<g transform="translate(' + o.x + ' ' + o.y + ')">' + A[o.art](o.w, o.h, o.p || {}, false) + '</g>' }).join('') + '</svg></div><svg class="es-stsv" viewBox="0 0 1000 520" aria-hidden="true">'
      + '<g class="es-stopen" transform="translate(400 40)">' + A.door(200, 300, { c: dc }, true) + '</g><g class="es-stdoor" transform="translate(400 40)">' + A.door(200, 300, { c: dc }, false) + '</g>'
      + '<g class="es-stlock" transform="translate(470 145)"><rect x="0" y="22" width="60" height="48" rx="9" fill="#F2C230" stroke="#3A2C22" stroke-width="4"/><path d="M12 24V14a18 18 0 0 1 36 0v10" fill="none" stroke="#8A929C" stroke-width="8"/><circle cx="30" cy="44" r="6" fill="#3A2C22"/></g>'
      + '<g class="es-sc-tori">' + CAST.full('tori', 'wow', '', 'x="170" y="150" width="190" height="230"') + '</g><g class="es-sc-momo">' + CAST.full('momo', 'base', '', 'x="650" y="154" width="180" height="230"') + '</g></svg>'
      + '<div class="es-sub" aria-live="polite"><span class="es-sface"></span><div class="es-stx"><b class="es-swho"></b><p class="es-sline"></p></div></div></div>'
      + '<div class="es-strow"><button type="button" class="tl-btn es-skip es-stgo" data-a="go">건너뛰기</button>' + sndBtn(true) + '<span class="es-sprog"></span><span class="es-swait">계속을 눌러요</span><button type="button" class="tl-btn tl-go es-snext" data-a="next">▶ 계속</button></div></div>';
    api.bar('');
    IN = { lines: lines, i: 0, sl: sl, tok: 0 };
    introShow();
    var b = host.querySelector('.es-snext'); if (b) b.focus({ preventScroll: true });
  }
  function begin() { stopIntro(); st.t0 = Date.now(); st.lp = 0; tick = setInterval(timer, 1000); draw(); mflash(); setTimeout(function () { if (st.t0 && !st.done && !BUD) buddy('tori', '좋아, 같이 둘러보자!', { mood: 'joy' }) }, RM ? 300 : 1900) }
  /* 장면 바탕(B안 · 그림책 삽화, 2026-11-28): 벽지·몰딩·원근 바닥 널·창문 빛줄기. 무늬·그러데이션은 ART.fx(문서에 하나뿐인 defs) */
  function bg(b, H) {
    b = b || {}; H = H || 560; var F = ART.fx, sh = F.sh, wall = b.wall || '#F3E3C8', floor = b.floor || '#C9A27A', fy = H * .68, d = b.deco, lw = F.lum(wall), dark = lw < .42, out = !d;   /* 무늬가 없으면 바깥(하늘·땅) */
    var o = '<rect width="1000" height="' + fy + '" fill="' + F.lin([[0, sh(wall, .1)], [1, sh(wall, -.07)]]) + '"/>';
    /* 벽 무늬 */
    if (d === 'stripe' || d === 'brick' || d === 'tile') o += '<rect width="1000" height="' + fy + '" fill="' + F.pat(d, wall, 50) + '" opacity="' + (d === 'stripe' ? .55 : d === 'brick' ? .8 : .6) + '"/>';
    if (d === 'stars') for (var i = 0; i < 40; i++) { var sx = (i * 137) % 1000, sy = (i * 71) % (fy - 20) + 10, sr = i % 3 + 1.4; o += '<path d="M' + sx + ' ' + (sy - sr * 2) + 'Q' + sx + ' ' + sy + ' ' + (sx + sr * 2) + ' ' + sy + 'Q' + sx + ' ' + sy + ' ' + sx + ' ' + (sy + sr * 2) + 'Q' + sx + ' ' + sy + ' ' + (sx - sr * 2) + ' ' + sy + 'Q' + sx + ' ' + sy + ' ' + sx + ' ' + (sy - sr * 2) + 'Z" fill="' + (dark ? '#FFF6D0' : '#fff') + '" opacity="' + (dark ? .85 : .75) + '"/>' }
    /* 유리창 틀(bg.panes): 별 벽을 창밖 하늘로 보이게 — 세로 창살·위 가로대·아래 창턱 + 유리 반사 */
    if (b.panes) { var pf = b.panes === true || b.panes === 1 ? '#3A3F4C' : b.panes, pm = F.mat('metal', pf), pe = F.edge(pf, 1.4); o += '<path d="M60 30L130 30L40 ' + (fy - 50) + 'L-30 ' + (fy - 50) + 'Z M560 30L600 30L510 ' + (fy - 50) + 'L470 ' + (fy - 50) + 'Z" fill="#FFFFFF" opacity=".07"/>'; o += '<rect x="0" y="14" width="1000" height="18" fill="' + pm + '"' + pe + '/><rect x="0" y="' + (fy - 52) + '" width="1000" height="22" fill="' + pm + '"' + pe + '/><rect x="0" y="' + (fy - 31) + '" width="1000" height="4" fill="#000" opacity=".25"/>'; [0, 250, 500, 750, 1000].forEach(function (x) { o += '<rect x="' + (x - 9) + '" y="20" width="18" height="' + (fy - 60) + '" fill="' + pm + '"' + pe + '/><rect x="' + (x - 7) + '" y="22" width="4" height="' + (fy - 64) + '" fill="#fff" opacity=".18"/>' }) }
    if (d === 'bubble') { o += '<path d="M120 0L230 0L80 ' + fy + 'L-60 ' + fy + 'Z M420 0L490 0L360 ' + fy + 'L260 ' + fy + 'Z M700 0L760 0L690 ' + fy + 'L610 ' + fy + 'Z" fill="' + F.lin([[0, '#FFFFFF', .28], [1, '#FFFFFF', 0]]) + '"/>'; for (var j = 0; j < 24; j++) { var bx = (j * 173) % 1000, by = (j * 97) % (fy - 30) + 15, br = j % 4 * 3 + 4; o += '<circle cx="' + bx + '" cy="' + by + '" r="' + br + '" fill="' + F.rad([[0, '#FFFFFF', 0], [.75, '#FFFFFF', .08], [1, '#FFFFFF', .45]]) + '" stroke="#fff" stroke-width="1.2" stroke-opacity=".5"/><circle cx="' + (bx - br * .35) + '" cy="' + (by - br * .35) + '" r="' + (br * .22) + '" fill="#fff" opacity=".7"/>' } }
    /* 빛: 왼쪽 위 창문에서 들어오는 빛줄기(밝은 실내 벽만) + 오른쪽 아래로 갈수록 살짝 어둡게 */
    if (!dark && d !== 'bubble') o += '<path d="M0 0H340L150 ' + fy + 'H0Z" fill="' + F.lin([[0, '#FFF7DA', out ? .25 : .45], [1, '#FFF7DA', 0]], 0, 0, 1, 0) + '"/>';
    o += '<rect width="1000" height="' + fy + '" fill="' + F.lin([[0, '#FFFFFF', dark ? .06 : .22], [.5, '#FFFFFF', 0], [1, '#2A1608', dark ? .25 : .1]], 0, 0, 1, .5) + '"/>';
    if (!out) {
      /* 천장 몰딩 · 걸레받이 */
      var mo = sh(wall, dark ? .12 : .3);
      o += '<rect width="1000" height="14" fill="' + F.lin([[0, sh(mo, .2)], [1, sh(wall, -.12)]]) + '"/><rect y="14" width="1000" height="4" fill="#1A0E06" opacity=".08"/>';
      o += '<rect y="' + (fy - 20) + '" width="1000" height="20" fill="' + F.lin([[0, sh(mo, .15)], [.3, mo], [1, sh(wall, -.2)]]) + '"/><rect y="' + (fy - 21) + '" width="1000" height="1.5" fill="' + sh(wall, -.3) + '" opacity=".6"/>';
    }
    /* 바닥: 따뜻한 색이면 원근 나무 널, 차가운 색이면 원근 타일, 바깥이면 흙·풀 */
    var warm = (function () { var m = /^#?([0-9a-f]{6})$/i.exec(floor); if (!m) return true; var v = parseInt(m[1], 16); return ((v >> 16) & 255) > (v & 255) + 18 })(), vx = 500, vy = fy - (H - fy) * 1.55, lnk = sh(floor, -.45);
    o += '<rect y="' + fy + '" width="1000" height="' + (H - fy) + '" fill="' + F.lin([[0, sh(floor, -.1)], [1, sh(floor, .12)]]) + '"/>';
    function px(bx, yy) { var t = (yy - vy) / (H - vy); return (vx + (bx - vx) * t).toFixed(1) }
    if (out) { for (var g = 0; g < 70; g++) { var gx = (g * 263) % 1000, gy = fy + 8 + (g * 89) % (H - fy - 12); o += '<path d="M' + gx + ' ' + gy + 'l3 -' + (4 + g % 4) + 'M' + (gx + 4) + ' ' + gy + 'l-1 -' + (3 + g % 3) + '" stroke="' + lnk + '" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/>' } }
    else if (warm) {
      for (var k = -12; k <= 12; k++) { var bx2 = 500 + k * 110; o += '<line x1="' + px(bx2, fy) + '" y1="' + fy + '" x2="' + bx2 + '" y2="' + H + '" stroke="' + lnk + '" stroke-opacity=".3" stroke-width="1.5"/>' }
      [[1, .3], [3, .7], [-2, .5], [5, .2], [-4, .8], [0, .85], [2, .45], [-1, .15], [4, .6], [-3, .35], [6, .5], [-5, .6], [-6, .25], [7, .75]].forEach(function (s) { var yy = fy + (H - fy) * s[1]; o += '<line x1="' + px(500 + s[0] * 110, yy) + '" y1="' + yy.toFixed(1) + '" x2="' + px(500 + (s[0] + 1) * 110, yy) + '" y2="' + yy.toFixed(1) + '" stroke="' + lnk + '" stroke-opacity=".28" stroke-width="1.3"/>' });
    } else {
      for (var k2 = -10; k2 <= 10; k2++) { var bx3 = 500 + k2 * 100; o += '<line x1="' + px(bx3, fy) + '" y1="' + fy + '" x2="' + bx3 + '" y2="' + H + '" stroke="' + lnk + '" stroke-opacity=".28" stroke-width="1.3"/>' }
      for (var r2 = 1, yy2 = fy; r2 < 6; r2++) { yy2 = fy + (H - fy) * Math.pow(r2 / 6, 1.6); o += '<line x1="0" y1="' + yy2.toFixed(1) + '" x2="1000" y2="' + yy2.toFixed(1) + '" stroke="' + lnk + '" stroke-opacity=".26" stroke-width="1.3"/>' }
    }
    /* 바닥에 비친 빛 · 벽 밑 그늘 · 가장자리 어둡게 */
    o += '<rect y="' + fy + '" width="1000" height="' + (H - fy) + '" fill="' + F.rad([[0, '#FFF3D6', dark ? .12 : .4], [1, '#FFF3D6', 0]], .22, .3, .6) + '"/>';
    o += '<rect y="' + fy + '" width="1000" height="' + (out ? 10 : 18) + '" fill="' + F.lin([[0, '#1A0E06', out ? .12 : .26], [1, '#1A0E06', 0]]) + '"/>';
    /* 누르지 않는 장면 소품(러그·의자·화분 등, bg.props = [[그림, x, y, w, h, p]]) */
    (b.props || []).forEach(function (q) { if (A[q[0]]) o += '<g transform="translate(' + q[1] + ' ' + q[2] + ')" pointer-events="none">' + A[q[0]](q[3], q[4], q[5] || {}, false) + '</g>' });
    o += '<rect width="1000" height="' + H + '" fill="' + F.rad([[.6, '#1A0E06', 0], [1, '#1A0E06', dark ? .3 : .16]], .45, .4, .75) + '" pointer-events="none"/>';
    return o;
  }
  function objG(o, cls) { var op = ok(o) && (o.lock || o.need); return '<g class="es-obj' + (cls || '') + (op ? ' es-done' : '') + '" data-o="' + o.id + '" transform="translate(' + o.x + ' ' + o.y + ')" tabindex="0" role="button" aria-label="' + esc(o.nm) + '"><g class="es-art">' + A[o.art](o.w, o.h, o.p || {}, op) + '</g><rect class="es-hot" x="-8" y="-8" width="' + (o.w + 16) + '" height="' + (o.h + 16) + '" rx="10"/></g>' }
  /* 놀이 화면 */
  function draw() {
    if (!st.t0) return startView();
    if (st.done) return win();
    var S = SCN[st.scene], dn = nLocks(), sel = st.sel, first = !st.drawn[S.id];
    var LK = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
    var top = '<span class="es-top">' + (R.scenes.length > 1 ? '<span class="es-tabs" role="tablist" aria-label="장소">' + R.scenes.map(function (s) { var on = sceneOpen(s.id); return '<button type="button" role="tab" class="es-tab" data-sc="' + s.id + '" aria-selected="' + (s.id === st.scene) + '"' + (on ? '' : ' disabled aria-label="잠긴 곳" title="잠긴 곳"') + '>' + (on ? esc(s.nm) : LK) + '</button>' }).join('') + '</span>' : '<span class="es-tabs"><b class="es-tab1">' + esc(S.nm) + '</b></span>')
      + '<span class="es-stat">' + (team ? '<span class="es-team">' + esc(team) + '</span>' : '') + '<span class="es-time"></span><span class="es-prog" title="연 자물쇠·장치">열림 <b>' + dn[0] + '</b>/' + dn[1] + '<i class="es-pbar"><i style="width:' + Math.round(dn[0] / Math.max(1, dn[1]) * 100) + '%"></i></i></span><button type="button" class="tl-btn es-where" data-a="where">어디를 볼까?</button>' + sndBtn() + (KOV ? fvBtn() : '') + '</span></span>';
    var h = '';
    h += '<div class="es-main"><div class="es-room"><svg class="es-scene" viewBox="0 0 1000 560" role="group" aria-label="' + esc(S.nm) + '">' + bg(S.bg) + S.objs.filter(function (o) { return !o.in && vis(o) }).map(function (o) {
      var c = st.shown[o.id] || first ? '' : ' es-appear'; st.shown[o.id] = 1; return objG(o, c);
    }).join('') + '</svg><p class="es-say" aria-live="polite">' + (sel ? '<b>' + esc(R.items[sel].nm) + '</b>' + jo(R.items[sel].nm, '을', '를').slice(-1) + ' 들었어요. 쓸 곳을 누르거나, 가방의 다른 물건을 눌러 합쳐 봐요.' : '물건을 눌러 살펴봐요.') + '</p></div>';
    st.drawn[S.id] = 1;
    h += '<aside class="es-side"><div class="es-bud" aria-live="polite">' + budSide(BUD) + '</div><h3>가방</h3><div class="es-inv">' + (st.inv.length ? st.inv.map(function (id) { var it = R.items[id]; return '<button type="button" class="es-it" data-it="' + id + '" aria-pressed="' + (sel === id) + '" title="' + esc(it.de || it.nm) + '">' + ART.item(it.k, it.c) + '<span>' + esc(it.nm) + '</span></button>' }).join('') : '<p class="es-empty">상자·서랍에서 찾은 물건이 여기에 들어가요</p>') + '</div>'
      + '<h3>수첩 <small>' + st.notes.length + '</small></h3><div class="es-notes">' + (st.notes.length ? st.notes.map(function (n, i) { return '<button type="button" class="es-nt" data-nt="' + i + '"><b>' + esc(n.t) + '</b></button>' }).join('') : '<p class="es-empty">단서를 찾으면 여기에 모여요</p>') + '</div></aside></div>';
    h += '<div class="es-modal" hidden></div>';
    host.innerHTML = h; api.bar(top); timer();
    if (st.open) openObj(st.open, true);
    else paintBud();
  }
  function say(t, cls) { var p = host.querySelector('.es-say'); if (p) { p.innerHTML = t; p.className = 'es-say' + (cls ? ' ' + cls : '') } }
  /* 물건 크게 보기 — 크게 본 그림 안의 숨은 곳(KIDS)도 누를 수 있음 */
  function openObj(id, keep) {
    var o = OBJ[id], m = host.querySelector('.es-modal'), firstLook = !st.seen[id], gv = !(o.lock || o.need) && o.give && o.give.length && !st.given[o.id]; st.open = id; st.seen[id] = 1;
    var kids = (KIDS[id] || []).filter(vis), op = ok(o) && (o.lock || o.need);
    /* 연(쓴) 뒤에는 처음 모습 글(잠겨 있어요·열쇠 구멍이 있어요)을 빼고 — 단서 물건(keep)은 그대로 */
    var showLook = o.look && !(op && !o.keep && (o.after || o.need || o.useMsg));
    /* 단서 그림이 물건과 같은 그림이면 두 번 보이지 않게 단서 그림(설정 포함)을 큰 그림으로 */
    var bf = showLook && o.lookFig && o.lookFig.art === o.art ? o.lookFig : null;
    /* 숨은 곳(kids)이 있으면 그 자리가 물건 크기에 맞춰져 있으므로, 단서 그림 설정을 물건 크기로 그려 한 번만 보여 줌 */
    var BW = bf && !kids.length ? (bf.w || 300) : o.w, BH = bf && !kids.length ? (bf.h || 200) : o.h, bigArt = bf ? A[bf.art](BW, BH, bf.p || {}, bf.open) : A[o.art](o.w, o.h, o.p || {}, op);
    var h = '<div class="es-card' + (BW / BH >= 2.4 ? ' es-wide' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(o.nm) + '"><div class="es-chd"><b>' + esc(o.nm) + '</b><span>' + (o.in ? '<button type="button" class="tl-btn" data-back="' + o.in + '">◀ ' + esc(OBJ[o.in].nm) + '</button> ' : '') + '<button type="button" class="tl-btn es-x" data-a="close">닫기</button></span></div><div class="es-cbody"><div class="es-bigw"><div class="es-big" title="그림을 누르면 더 크게 보여요"><svg viewBox="-20 -30 ' + (BW + 40) + ' ' + (BH + 50) + '" role="group" aria-label="' + esc(o.nm) + ' 크게 보기"><g class="es-art' + (op && st.fresh === id ? ' es-opening' : '') + '">' + bigArt + '</g>' + kids.map(function (k) { return objG(k, ' es-spot' + (st.seen[k.id] ? '' : ' es-new')) }).join('') + '</svg></div>' + (kids.length ? '<p class="es-peek">그림 속 작은 곳도 눌러 볼 수 있어요.</p>' : '') + '</div><div class="es-ctext"><div class="es-mbud" hidden></div>';
    st.fresh = null;
    if (o.need && st.used[o.id] && o.useMsg && !(o.lock && st.solved[o.id])) h += '<p class="es-used">' + frac(o.useMsg) + '</p>';
    if (showLook) { h += '<p class="es-look">' + spk() + frac(o.look) + '</p>' + (bf ? '' : fig(o.lookFig)); if (o.keep) note(o.nm, '<p>' + frac(o.look) + '</p>' + fig(o.lookFig)) }
    if (o.need && !st.used[o.id]) {
      h += '<div class="es-need"><p>' + spk() + frac(o.needMsg || '무언가가 필요해 보여요.') + '</p>' + (st.inv.length ? '<p class="es-try">가방에서 써 볼 물건:</p><div class="es-inv es-inv2">' + st.inv.map(function (iid) { var it = R.items[iid]; return '<button type="button" class="es-it" data-use="' + iid + '">' + ART.item(it.k, it.c) + '<span>' + esc(it.nm) + '</span></button>' }).join('') + '</div>' : '<p class="es-try">가방이 비어 있어요. 다른 곳을 먼저 살펴봐요.</p>') + '<p class="es-umsg" aria-live="polite"></p></div>';
    } else if (o.lock && !st.solved[o.id]) h += lockUI(o);
    else if (o.lock || o.need || o.after) h += done(o);
    h += '</div></div></div>';
    m.innerHTML = h; m.hidden = false;
    if (!keep) { var f = m.querySelector('.es-dial button, .es-it, .es-x'); if (f) f.focus({ preventScroll: true }) }
    if (!(o.lock || o.need) && o.give) give(o);
    /* 친구 한마디: 처음 볼 때 그 물건의 say, 없으면 물건을 얻었을 때 */
    if (!keep && !(firstLook && o.say) && BUD && !BUD.hint) { BUD = null; clearTimeout(BUDT) }   /* 이 물건에 할 말이 없으면 앞 물건의 말풍선을 남기지 않음 */
    if (firstLook && o.say && !keep) buddy(o.say[0], frac(o.say[1]), { mood: o.say[0] === 'tori' ? 'wow' : 'base' });
    else if (gv && !keep) fl('item', { mood: 'joy' });
    else paintBud();
  }
  function give(o) { if (st.given[o.id]) return; st.given[o.id] = 1; (o.give || []).forEach(function (iid) { if (st.inv.indexOf(iid) < 0) st.inv.push(iid) }); if (o.give && o.give.length) { toast('가방에 넣었어요: ' + o.give.map(function (i) { return R.items[i].nm }).join(', ')); setTimeout(function () { sfx('pick') }, 350) } }
  function done(o) {
    var h = '';
    if (o.after) { h += '<div class="es-after"><p>' + spk() + frac(o.after) + '</p>' + fig(o.afterFig) + '</div>'; note(o.nm, '<p>' + frac(o.after) + '</p>' + fig(o.afterFig)) }
    if (o.go === 'exit') h += '<button type="button" class="tl-btn tl-go es-goexit" data-a="exit">밖으로 나가기</button>';
    else if (o.go) h += '<button type="button" class="tl-btn tl-go" data-go="' + o.go + '">' + esc(jo(SCN[o.go].nm, '으로', '로')) + ' 가기</button>';
    return h;
  }
  /* 자물쇠 */
  var SYM = { dir: ['↑', '→', '↓', '←'], shape: ['○', '△', '□', '☆'], color: ['빨강', '노랑', '초록', '파랑'] }, DIRN = { '↑': '위', '→': '오른쪽', '↓': '아래', '←': '왼쪽' };
  var LOW = (R.g || 3) <= 2;
  function lockUI(o) {
    var L = o.lock, e = st.entry[o.id] || (st.entry[o.id] = L.t === 'num' ? L.code.split('').map(function () { return 0 }) : []), h = '<div class="es-lock es-lk-' + L.t + '"><p class="es-lq">' + spk() + frac(L.q) + '</p>';
    if (L.t === 'num') {
      h += '<div class="es-dials">' + e.map(function (d, i) { return '<div class="es-dial"><button type="button" data-d="' + i + '" data-v="1" aria-label="' + (i + 1) + '번째 숫자 올리기">▲</button><b>' + d + '</b><button type="button" data-d="' + i + '" data-v="-1" aria-label="' + (i + 1) + '번째 숫자 내리기">▼</button></div>' }).join('') + '</div>';
      /* 다이얼 쓰는 법: 1·2학년 방은 늘, 그 밖은 숫자 자물쇠를 처음 열기 전까지 */
      if (LOW || !Object.keys(st.solved).some(function (k) { return OBJ[k].lock && OBJ[k].lock.t === 'num' })) h += '<p class="es-dhelp">▲▼를 눌러 숫자를 맞춰요</p>';
    } else {
      var opts = L.opts || SYM[L.t];
      /* 방향 자물쇠: 3학년부터는 빈칸 수로 답의 길이가 드러나지 않게(넣은 것과 다음 칸 하나만), 1·2학년은 칸 수를 보여 줌 */
      var free = L.t === 'dir' && !LOW, sl = free ? e.concat(e.length < cap(L) ? [null] : []) : L.code.map(function (_, i) { return e[i] });
      h += '<div class="es-slots">' + sl.map(function (v, i) { return '<span class="es-slot' + (v == null && (free || i === e.length) ? ' es-cur' : '') + '">' + (v == null ? '' : sym(L.t, v, 22)) + '</span>' }).join('') + '</div><div class="es-keys">' + opts.map(function (v) { return '<button type="button" class="es-key" data-put="' + esc(v) + '" aria-label="' + esc(SHN[v] || DIRN[v] || v) + '">' + sym(L.t, v, 26) + (L.t === 'color' ? '<span>' + esc(v) + '</span>' : '') + '</button>' }).join('') + '<button type="button" class="es-key es-del" data-a="del">한 칸 지우기</button></div>';
    }
    h += '<div class="tl-row"><button type="button" class="tl-btn tl-go es-try" data-a="try">열어 보기</button></div><p class="es-msg" aria-live="polite"></p>';
    var n = st.lh[o.id] || 0;
    h += '<div class="es-lh">' + L.hints.slice(0, n).map(function (t, i) { return '<p>힌트 ' + (i + 1) + '. ' + frac(t) + '</p>' }).join('') + '</div><div class="es-lrow">' + (n < L.hints.length ? '<button type="button" class="tl-btn" data-a="lhint">힌트 보기 (' + (L.hints.length - n) + ')</button>' : '') + '<button type="button" class="es-teach" data-a="ans">정답 보기(선생님)</button></div>';
    if (st.notes.length) h += '<details class="es-nbk"><summary>수첩 보기 <small>' + st.notes.length + '</small></summary>' + st.notes.map(function (n) { return '<div class="es-nbi"><b>' + esc(n.t) + '</b>' + n.h + '</div>' }).join('') + '</details>';
    h += '</div>';
    return h;
  }
  function cap(L) { return L.t === 'dir' && !LOW ? 8 : L.code.length }
  function sym(t, v, s) {
    if (t === 'dir') return '<svg viewBox="0 0 40 40" width="' + s + '" height="' + s + '" aria-hidden="true">' + ART.arrow(v, 20, 20, 15) + '</svg>';
    if (t === 'shape') return '<svg viewBox="0 0 40 40" width="' + s + '" height="' + s + '" aria-hidden="true">' + ART.shape(v, 20, 21, 15) + '</svg>';
    if (t === 'color') return '<i class="es-sw" style="background:' + ART.c(v) + '"></i>';
    return esc(v);
  }
  /* 열린 뒤 친구 한마디: 새 장소가 열렸으면 그 이야기, 아니면 축하 */
  function cheer(before, k) {
    var now = openScenes(), nw = R.scenes.filter(function (s) { return now[s.id] && !before[s.id] })[0];
    if (nw) buddy('tori', '새로운 곳이 열렸어! <b>' + esc(nw.nm) + '</b>에 가 보자!', { mood: 'wow' }); else fl(k, { mood: 'joy' });
  }
  function hc() { var el = root.querySelector('.es-hc'); if (el) el.textContent = '힌트 ' + st.hints + ' · 틀림 ' + st.wrong }
  function tryLock(o) {
    var L = o.lock, e = st.entry[o.id], got = L.t === 'num' ? e.join('') : e.join(','), want = L.t === 'num' ? L.code : L.code.join(','), msg = host.querySelector('.es-msg');
    if (L.t === 'dir' && !e.length) { show(msg, '화살표를 먼저 눌러요.'); return }
    if (L.t !== 'num' && (L.t !== 'dir' || LOW) && e.length < L.code.length) { show(msg, '칸을 모두 채워요(' + L.code.length + '칸).'); return }
    if (got === want) { var bs = openScenes(); st.solved[o.id] = 1; st.lp = sec(); sfx(1); var k = o.id; host.querySelector('.es-modal').hidden = true; fx('unlock', jo(o.nm, '이', '가') + ' 열렸어요!', function () { st.fresh = k; give(o); draw(); openObj(k); cheer(bs, 'unlock') }); save(); return }
    st.wrong++; sfx(0);
    /* 틀린 답을 지운 뒤 자물쇠를 다시 그리고 나서 알림·흔들림을 넣음(다시 그리면 알림이 지워졌음) */
    if (L.t !== 'num') { st.entry[o.id] = []; refreshLock(o) }
    var card = host.querySelector('.es-lock'); card.classList.remove('es-shake'); void card.offsetWidth; card.classList.add('es-shake');
    show(host.querySelector('.es-msg'), '열리지 않아요. 단서를 다시 살펴봐요.'); hc(); save();
    st.lw = st.lw || {}; st.lw[o.id] = (st.lw[o.id] || 0) + 1; fl(st.lw[o.id] >= 2 ? 'wrong2' : 'wrong1');
  }
  /* 알림을 보이게: 글을 넣고 창 안에서 그 자리로 스크롤 */
  function show(el, t, html) { if (!el) return; if (html) el.innerHTML = t; else el.textContent = t; try { el.scrollIntoView({ block: 'nearest', behavior: RM ? 'auto' : 'smooth' }) } catch (er) {} }
  function refreshLock(o) { var box = host.querySelector('.es-lock'); if (!box) return; var nb = box.querySelector('.es-nbk'), was = nb && nb.open, t = document.createElement('div'); t.innerHTML = lockUI(o); box.replaceWith(t.firstChild); if (was) { nb = host.querySelector('.es-nbk'); if (nb) nb.open = true } }
  function toast(t) { var d = document.createElement('div'); d.className = 'es-toast'; d.textContent = t; (host.parentNode || host).appendChild(d); setTimeout(function () { d.remove() }, 2200) }
  function useItem(o, iid) {
    if (o.need === iid) {
      var bs = openScenes(); st.used[o.id] = 1; st.lp = sec(); var it = R.items[iid]; if (!it.keep) st.inv = st.inv.filter(function (x) { return x !== iid }); st.sel = null;
      sfx(1); var k = o.id; host.querySelector('.es-modal').hidden = true;
      fx('unlock', jo(it.nm, '을', '를') + ' 썼어요!', function () {
        if (!o.lock) { st.fresh = k; give(o) } draw(); openObj(k); cheer(bs, 'use');
      });
    } else {
      /* 합치기 재료(반쪽 등)는 틀림으로 세지 않고 합치라고 알려 줌. 알림은 크게 보기 창 안에 */
      var part = COMB.some(function (c) { return c.a === iid || c.b === iid }), nm = R.items[iid].nm;
      if (st.open !== o.id) openObj(o.id, true);
      var um = host.querySelector('.es-umsg');
      if (part) { show(um, '<b>' + esc(nm) + '</b>' + jo(nm, '은', '는').slice(-1) + ' 아직 조각이에요. 가방에서 다른 조각과 먼저 합쳐 봐요.', true); sfx('tap') }
      else { st.wrong++; sfx(0); hc(); show(um, '여기에는 <b>' + esc(nm) + '</b>' + jo(nm, '이', '가').slice(-1) + ' 맞지 않아요.', true); var nd = host.querySelector('.es-need'); if (nd) { nd.classList.remove('es-shake'); void nd.offsetWidth; nd.classList.add('es-shake') } }
      if (!um) toast(part ? '다른 조각과 먼저 합쳐 봐요' : '여기에는 ' + jo(nm, '이', '가') + ' 맞지 않아요');
      if (!part) { st.lw = st.lw || {}; st.lw[o.id] = (st.lw[o.id] || 0) + 1; fl(st.lw[o.id] >= 2 ? 'wrongi' : 'wrong1') }
      save();
    }
  }
  /* 가방 물건 합치기 */
  function combine(a, b) {
    var c = COMB.filter(function (x) { return (x.a === a && x.b === b) || (x.a === b && x.b === a) })[0];
    st.sel = null;
    if (!c) { draw(); toast(jo(R.items[a].nm, '과', '와') + ' ' + jo(R.items[b].nm, '은', '는') + ' 합쳐지지 않아요'); sfx(0); return }
    st.inv = st.inv.filter(function (x) { return x !== a && x !== b }); st.inv.push(c.make); st.made[c.make] = 1; sfx('combine');
    draw(); var m = host.querySelector('.es-modal'), it = R.items[c.make];
    m.innerHTML = '<div class="es-card" role="dialog" aria-modal="true" aria-label="합치기"><div class="es-chd"><b>합쳤어요!</b><button type="button" class="tl-btn es-x" data-a="close">닫기</button></div><div class="es-ctext es-solo es-comb"><div class="es-mbud" hidden></div><div class="es-cmb"><span>' + ART.item(R.items[a].k, R.items[a].c) + '<small>' + esc(R.items[a].nm) + '</small></span><b>+</b><span>' + ART.item(R.items[b].k, R.items[b].c) + '<small>' + esc(R.items[b].nm) + '</small></span><b>=</b><span class="es-cmk">' + ART.item(it.k, it.c) + '<small>' + esc(it.nm) + '</small></span></div><p class="es-look">' + frac(c.msg || (jo(it.nm, '이', '가') + ' 되었어요!')) + '</p></div></div>';
    m.hidden = false; var x = m.querySelector('.es-x'); if (x) x.focus({ preventScroll: true }); st.lp = sec(); fl('comb', { mood: 'joy' });
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
    /* 모모가 반말로 알려 줌. 방 자료의 guide 글('~세요')은 바꾸지 않고 머리말 '여기를 봐!' 아래 따로 줄에 */
    var say = function (t, raw) { buddy('momo', raw ? '여기를 봐!<span class="es-hraw">' + t + '</span>' : t, { hint: true }) };
    if (next.comb) { say('가방의 <b>' + esc(jo(R.items[next.comb.a].nm, '과', '와')) + '</b> <b>' + esc(jo(R.items[next.comb.b].nm, '을', '를')) + '</b> 차례로 눌러서 합쳐 봐.'); [next.comb.a, next.comb.b].forEach(function (i) { var b = host.querySelector('.es-it[data-it="' + i + '"]'); if (b) b.classList.add('es-pulse2') }); return }
    var top = next; while (top.in) top = OBJ[top.in];
    if (top.scene !== st.scene) { say('<b>' + esc(jo(SCN[top.scene].nm, '으로', '로')) + '</b> 가 보자.'); return }
    if (next.in) say('<b>' + esc(jo(top.nm, '을', '를')) + '</b> 크게 보고, 그림 속 작은 곳을 구석구석 눌러 봐.');
    else if (next.guide) say(frac(next.guide), true);
    else say('<b>' + esc(jo(next.nm, '을', '를')) + '</b> 살펴봐.');
    var g = host.querySelector('.es-obj[data-o="' + top.id + '"]'); if (g) g.classList.add('es-pulse');
  }
  /* 모둠 결과 코드: 방 번호·걸린 초·힌트·틀림을 숫자 하나로 섞고 끝에 확인 숫자(점수판 board.html이 풀어 읽음) */
  function rcode(s) {
    var n = ((((R.idx || 0) * 3600 + Math.min(s, 3599)) * 100 + Math.min(st.hints, 99)) * 100 + Math.min(st.wrong, 99)), m = String((BigInt(n) * 7919n + 123457n) % 1000000000n).padStart(9, '0'), k = 0;
    for (var i = 0; i < 9; i++) k += (+m[i]) * (i % 2 ? 3 : 1); m += (10 - k % 10) % 10; return m.slice(0, 3) + '-' + m.slice(3, 6) + '-' + m.slice(6);
  }
  function when() { var d = new Date(), h = d.getHours(); return d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + '일월화수목금토'[d.getDay()] + '요일 · ' + (h < 12 ? '오전 ' : '오후 ') + ((h + 11) % 12 + 1) + '시 ' + String(d.getMinutes()).padStart(2, '0') + '분 탈출' }
  function win() {
    st.done = true; stop(); unsave(); var s = st.sec, na = Object.keys(st.ans || {}).length, stars = st.hints <= 2 && st.wrong <= 3 ? 3 : st.hints <= 5 && st.wrong <= 8 ? 2 : 1, code = '';
    try { code = rcode(s) } catch (e) {}
    var OD = R.outro_dialog || [];
    host.innerHTML = '<div class="es-win"><div class="es-whead"><span class="es-wc es-wc-tori">' + CAST.full('tori', 'joy') + '</span><div class="es-wmid"><p class="es-wroom">' + esc(R.title) + '</p><p class="es-bigt">탈출 성공!</p>' + (team ? '<p class="es-wteam">' + esc(team) + '</p>' : '') + '<p class="es-stars" aria-label="별 ' + stars + '개">' + '★★★'.slice(0, stars) + '<i>' + '★★★'.slice(stars) + '</i></p></div><span class="es-wc es-wc-momo">' + CAST.full('momo', 'joy') + '</span></div>'
      + (OD.length ? '<div class="es-wlines">' + OD.map(function (x) { return '<p class="es-wline es-wl-' + x[0] + '">' + (CAST.NM[x[0]] ? '<b class="es-bnm">' + CAST.NM[x[0]] + '</b>' : '') + frac(x[1]) + '</p>' }).join('') + '</div>' : '') + '<p class="es-outro">' + frac(R.outro) + '</p>'
      + '<div class="es-wres"><div class="es-stats"><span><small>걸린 시간</small><b>' + mmss(s) + '</b></span><span><small>힌트</small><b>' + st.hints + '번</b></span><span><small>틀린 횟수</small><b>' + st.wrong + '번</b></span></div>'
      + (code ? '<div class="es-code"><small>결과 코드</small><b>' + code + '</b></div>' : '') + '</div>'
      + (na ? '<p class="es-wans">정답 보기 ' + na + '번(힌트 ' + na * 3 + '번으로 셈)</p>' : '') + '<p class="es-when">' + when() + '</p><button type="button" class="es-again" data-a="again">처음부터 다시 하기</button></div>';
    api.bar(''); sfx('win'); confetti(); [].forEach.call(document.querySelectorAll('.es-toast'), function (x) { x.remove() });
    BUD = null; clearTimeout(BUDT);
    /* 탈출 뒤 친구 대사를 차례로 읽어 줌(소리 켜짐일 때) — 말하는 친구가 들썩임 */
    var wi = 0, wn = BN; (function nx() {
      if (wn !== BN || wi >= OD.length || !st.done) return; var x = OD[wi++], c = host.querySelector('.es-wc-' + x[0]);
      [].forEach.call(host.querySelectorAll('.es-wc'), function (e) { e.classList.remove('cs-talk') }); if (c) c.classList.add('cs-talk');
      if (!voice(x[0], frac(x[1]), function () { if (c) c.classList.remove('cs-talk'); setTimeout(nx, 400) })) setTimeout(function () { if (c) c.classList.remove('cs-talk'); nx() }, 1600);
    })();
  }
  /* 누르기 */
  root.addEventListener('click', function (e) {
    var t = e.target, b = t.closest('button'), g = t.closest('.es-obj');
    if (st && st.t0 && !(b && (b.dataset.a === 'snd' || b.dataset.a === 'fv'))) { hush(); BN++; if (BUD && BUD.hint) { BUD = null; paintBud() } }
    if (b && b.dataset.a === 'fv') { fv = !fv; try { localStorage.setItem(FVK, fv ? '1' : '0') } catch (er) {} if (!fv) hush(); root.querySelectorAll('.es-fvb').forEach(function (x) { x.outerHTML = fvBtn() }); return }
    if (b && b.dataset.a === 'snd') { snd = !snd; try { localStorage.setItem(SNDK, snd ? '1' : '0') } catch (er) {} root.querySelectorAll('.es-sndb').forEach(function (x) { x.outerHTML = sndBtn(x.classList.contains('es-sndt')) }); if (snd) sfx('tap'); else hush(); if (IN) introShow(); return }
    if (b && b.classList.contains('es-go')) { limit = +root.querySelector('.es-lim').value; team = (root.querySelector('.es-team-in').value || '').trim(); ac(); story(); return }
    if (b && b.dataset.a === 'go' && !st.t0) return begin();
    if (b && b.dataset.a === 'next' && IN) { if (IN.ty && !IN.ty.done()) { hush(); return IN.ty.finish() } IN.i++; return introShow() }
    if (g && g.classList.contains('es-spot')) { sfx('tap'); openObj(g.dataset.o); return }
    var bigw = t.closest('.es-big'); if (bigw && !b) { var cd = bigw.closest('.es-card'); cd.classList.toggle('es-zoom'); bigw.title = cd.classList.contains('es-zoom') ? '그림을 누르면 작게 돌아가요' : '그림을 누르면 더 크게 보여요'; return }
    if (g && !t.closest('.es-modal')) { var o = OBJ[g.dataset.o]; if (st.sel) { var iid = st.sel; if (o.need && !st.used[o.id]) { useItem(o, iid); return } st.sel = null; draw(); toast('여기에는 쓸 수 없어요. 그냥 살펴볼게요') } sfx('tap'); openObj(o.id); return }
    if (!b) { if (t.classList.contains('es-modal')) closeM(); return }
    var a = b.dataset.a, o2 = st.open && OBJ[st.open];
    if (a === 'speak') return speak(b.parentNode);
    if (a === 'close') return closeM();
    if (a === 'resume') { var sv = saved(); if (sv) return resume(sv); return draw() }
    if (a === 'fresh') { unsave(); return draw() }
    if (a === 'again') { if (confirm('처음부터 다시 할까요? 지금 결과 화면은 사라져요.')) reset(); return }
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
    if (b.dataset.put != null) { if (en.length < cap(L)) en.push(b.dataset.put); sfx('tap'); refreshLock(o2); return }
    if (a === 'del') { en.pop(); refreshLock(o2); return }
    if (a === 'try') return tryLock(o2);
    if (a === 'lhint') { st.lh[o2.id] = (st.lh[o2.id] || 0) + 1; st.hints++; refreshLock(o2); hc(); save(); var hp = host.querySelectorAll('.es-lh p'); if (hp.length) try { hp[hp.length - 1].scrollIntoView({ block: 'nearest' }) } catch (er) {} return }
    if (a === 'ans') {
      /* 학생이 눌러도 기록에 남게: 자물쇠마다 처음 볼 때 힌트 3번으로 셈(별·결과 코드에 들어감) */
      if (!st.ans[o2.id] && !confirm('정답을 볼까요? 정답을 보면 힌트 3번으로 세어요.')) return;
      if (!st.ans[o2.id]) { st.ans[o2.id] = 1; st.hints += 3; hc(); save() }
      return show(host.querySelector('.es-msg'), '정답: <b>' + (L.t === 'num' ? esc(L.code) : L.code.map(function (v) { return SHN[v] ? shp(v) : esc(v) }).join(L.t === 'dir' ? ' ' : ' → ')) + '</b> — ' + frac(L.sol), true);
    }
  });
  root.addEventListener('change', function (e) { if (e.target.classList && e.target.classList.contains('es-lim')) { var x = root.querySelector('.es-mlim'); if (x) x.textContent = limTxt(+e.target.value) } });
  function closeM() { try { SS && SS.cancel() } catch (e) {} var m = host.querySelector('.es-modal'); if (m) { m.hidden = true; m.innerHTML = '' } st.open = null; draw() }
  host.addEventListener('keydown', function (e) {
    var g = e.target.closest && e.target.closest('.es-obj'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })) }
  });
  document.addEventListener('keydown', function (e) {
    if (!st || !st.open || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return; var o = OBJ[st.open];
    if (e.key === 'Escape') return closeM();
    if (!o.lock || st.solved[o.id] || (o.need && !st.used[o.id])) return; var L = o.lock, en = st.entry[o.id];
    if (L.t === 'num' && /^[0-9]$/.test(e.key)) { var i = en.__p || 0; en[i] = +e.key; en.__p = (i + 1) % en.length; refreshLock(o); return }
    if (L.t === 'dir') { var k = { ArrowUp: '↑', ArrowRight: '→', ArrowDown: '↓', ArrowLeft: '←' }[e.key]; if (k) { e.preventDefault(); if (en.length < cap(L)) en.push(k); refreshLock(o); return } }
    if (e.key === 'Backspace' && L.t !== 'num') { en.pop(); refreshLock(o); return }
    if (e.key === 'Enter') { e.preventDefault(); tryLock(o) }
  });
  document.getElementById('esPrint').onclick = function () { document.documentElement.classList.add('es-printing'); var off = function () { document.documentElement.classList.remove('es-printing'); window.removeEventListener('afterprint', off) }; window.addEventListener('afterprint', off); setTimeout(function () { window.print() }, 80) };
  /* 어색한 줄바꿈 막기(2026-11-28 선생님 요청): 글 덩어리의 마지막 띄어쓰기를 붙는 빈칸으로 바꿔, 마지막 줄에 낱말 하나만 남지 않게 함 */
  var NOB = '.es-mgoal,.es-tips li,.es-bub,.es-wline,.tl-head p,.tl-how li,.tl-how p,.es-intro,.es-steps li,.es-stlines p,.es-look,.es-lq,.es-after p,.es-need p,.es-used,.es-lh p,.es-nbi p,.es-win p,.es-say,.es-msg,.es-peek';
  function nob(root) {
    [].forEach.call((root || document).querySelectorAll(NOB), function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), ts = [], n; while ((n = w.nextNode())) ts.push(n);
      for (var i = ts.length - 1; i >= 0; i--) {
        var v = ts[i].nodeValue, t = v.replace(/[\s\u00a0]+$/, ''), k = Math.max(t.lastIndexOf(' '), t.lastIndexOf('\u00a0'));
        if (k >= 0) {
          /* 마지막 낱말들이 일곱 글자가 될 때까지(많아야 세 낱말) 붙임 */
          for (var c = 0; c < 3 && k >= 0; c++) {
            if (t[k] === ' ' && (/\S/.test(t.slice(0, k)) || i > 0)) t = t.slice(0, k) + '\u00a0' + t.slice(k + 1);
            if (t.slice(k + 1).replace(/[\s\u00a0]/g, '').length >= 7) break;
            k = t.lastIndexOf(' ', k - 1);
          }
          ts[i].nodeValue = t + v.slice(t.length); return
        }
      }
    });
  }
  new MutationObserver(function () { nob(host) }).observe(host, { childList: true, subtree: true, characterData: false });
  nob(document);
  reset(true);
};
