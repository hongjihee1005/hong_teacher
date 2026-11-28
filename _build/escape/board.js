/* 수학 방탈출 · 모둠 대항 점수판 (2026-11-27 선생님 요청)
   정적 누리집이라 모둠 기기끼리 자동으로 이어지지 않음 → 선생님 화면에서 ① 다 같이 출발 시계 ② 모둠마다 진행(자물쇠 몇 개) 누르기
   ③ 탈출한 모둠은 '탈출!'로 시각을 적고, 모둠 화면에 뜬 결과 코드를 넣으면 그 기기의 걸린 시간·힌트·틀림·별을 읽어 순위를 냄.
   자료 window.EB = { rooms:[{id,title,n(자물쇠·장치 수),acc}] }. 기록은 이 기기 localStorage(hj-escape-board-v1). */
window.TOOL = function (host, api) {
  var RM = window.EB.rooms, BYI = {}; RM.forEach(function (r, j) { BYI[r.i] = j }); var KEY = 'hj-escape-board-v1', S, tick = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x] }) }
  function load() { try { S = JSON.parse(localStorage.getItem(KEY)) } catch (e) {} if (!S || !S.teams) S = { room: first(), t0: 0, teams: [1, 2, 3, 4].map(function (i) { return { nm: i + '모둠', p: 0, esc: 0, code: '' } }) } }
  /* 처음 고른 방: 1학년 줄의 첫 방(과자 가게) */
  function first() { var g = Math.min.apply(null, RM.map(function (r) { return r.g })); for (var i = 0; i < RM.length; i++) if (RM[i].g === g) return i; return 0 }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) {} }
  function mmss(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }
  function now() { return S.t0 ? (Date.now() - S.t0) / 1000 : 0 }
  function stars(h, w) { return h <= 2 && w <= 3 ? 3 : h <= 5 && w <= 8 ? 2 : 1 }
  /* 결과 코드 풀기(escape.js의 rcode와 짝) */
  function decode(code) {
    var d = String(code || '').replace(/\D/g, ''); if (d.length !== 10) return { err: '숫자 10개를 넣어요' };
    var k = 0; for (var i = 0; i < 9; i++) k += (+d[i]) * (i % 2 ? 3 : 1); if ((10 - k % 10) % 10 !== +d[9]) return { err: '코드를 다시 확인해요(숫자가 틀린 것 같아요)' };
    var n = Number(((BigInt(d.slice(0, 9)) - 123457n + 1000000000n) * 940017679n) % 1000000000n), w = n % 100, h = Math.floor(n / 100) % 100, s = Math.floor(n / 1e4) % 3600, ri = BYI[Math.floor(n / 3.6e7)];
    if (ri == null) return { err: '이 점수판의 방이 아니에요' };
    return { ri: ri, s: s, h: h, w: w, st: stars(h, w) };
  }
  function info(t) { var r = t.code ? decode(t.code) : null; if (r && r.err) r = null; if (r && r.ri !== S.room) return { bad: '다른 방(' + RM[r.ri].title + ')의 코드예요' }; return r || {} }
  /* 결과 코드의 걸린 시간이 선생님 시계(탈출! 누른 시각, 없으면 지금)보다 1분 넘게 길면 알림 */
  function long(r, t) { var c = t.esc || (S.t0 ? now() : 0); return c && r.s > c + 60 }
  function rank() {
    return S.teams.map(function (t, i) { var r = info(t); return { i: i, t: t, s: r.s != null ? r.s : (t.esc || null), r: r } }).filter(function (x) { return x.s != null })
      .sort(function (a, b) { return a.s - b.s || (a.r.h || 0) - (b.r.h || 0) });
  }
  function draw() {
    var R = RM[S.room], rk = rank(), pos = {}; rk.forEach(function (x, j) { pos[x.i] = j + 1 });
    var h = '<div class="eb-top"><label>방 <select class="eb-room">' + [1, 2, 3, 4, 5, 6].map(function (g) { return '<optgroup label="' + g + '학년">' + RM.map(function (r, i) { return r.g === g ? '<option value="' + i + '"' + (i === S.room ? ' selected' : '') + '>' + esc(r.title) + '</option>' : '' }).join('') + '</optgroup>' }).join('') + '</select></label>'
      + '<label>모둠 수 <select class="eb-n">' + [2, 3, 4, 5, 6, 7, 8].map(function (n) { return '<option' + (n === S.teams.length ? ' selected' : '') + '>' + n + '</option>' }).join('') + '</select></label>'
      + '<b class="eb-clock">' + (S.t0 ? mmss(now()) : '0:00') + '</b>'
      + (S.t0 ? '<button type="button" class="tl-btn" data-a="stop">시계 멈추고 처음부터</button>' : '<button type="button" class="tl-btn tl-go" data-a="start">모두 출발!</button>') + '</div>';
    h += '<div class="eb-grid">' + S.teams.map(function (t, i) {
      var r = info(t), done = t.esc || r.s != null, n = R.n, p = done ? n : t.p;
      return '<div class="eb-card' + (done ? ' eb-done' : '') + '" style="--acc:' + R.acc + '"><div class="eb-hd"><label class="eb-nmw" title="눌러서 모둠 이름 고치기"><input class="eb-nm" data-i="' + i + '" value="' + esc(t.nm) + '" maxlength="12" placeholder="' + (i + 1) + '모둠" aria-label="모둠 이름(눌러서 고치기)"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></label>' + (pos[i] ? '<span class="eb-rk">' + pos[i] + '등</span>' : '') + '</div>'
        + '<div class="eb-prog"><button type="button" class="tl-btn" data-a="m" data-i="' + i + '" aria-label="진행 하나 빼기">−</button><span><b>' + p + '</b> / ' + n + '<i class="eb-bar"><i style="width:' + Math.round(p / n * 100) + '%"></i></i><small>자물쇠·장치</small></span><button type="button" class="tl-btn" data-a="p" data-i="' + i + '" aria-label="진행 하나 더하기">+</button></div>'
        + (t.esc ? '<p class="eb-esc">탈출 ' + mmss(t.esc) + '</p>' : done ? '<p class="eb-esc">탈출!</p>' : '<button type="button" class="tl-btn tl-go eb-escb" data-a="esc" data-i="' + i + '"' + (S.t0 ? '' : ' disabled') + '>탈출!</button>')
        + '<label class="eb-cl">결과 코드 <input class="eb-code" data-i="' + i + '" value="' + esc(t.code) + '" inputmode="numeric" placeholder="000-000-0000"></label>'
        + (r.bad ? '<p class="eb-err">' + esc(r.bad) + '</p>' : t.code && r.s == null ? '<p class="eb-err">' + esc(decode(t.code).err || '') + '</p>' : r.s != null ? '<p class="eb-res">코드 시간 <b>' + mmss(r.s) + '</b>' + (t.esc ? ' · 선생님 시계 ' + mmss(t.esc) : '') + ' · 힌트 ' + r.h + ' · 틀림 ' + r.w + ' · <span class="eb-st">' + '★★★'.slice(0, r.st) + '<i>' + '★★★'.slice(r.st) + '</i></span></p>' + (long(r, t) ? '<p class="eb-err">코드 시간이 선생님 시계보다 길어요. 먼저 시작했거나 다른 판의 코드인지 확인해요.</p>' : '') : '')
        + (done ? '<button type="button" class="tl-btn eb-undo" data-a="undo" data-i="' + i + '">탈출 기록 지우기</button>' : '') + '</div>';
    }).join('') + '</div>';
    h += '<details class="eb-chk"' + (S.one ? ' open' : '') + '><summary>결과 코드 확인하기 <small>개별 활동 · 캡쳐 확인용</small></summary><p class="tl-row"><input class="eb-one" inputmode="numeric" placeholder="000-000-0000" aria-label="확인할 결과 코드" value="' + esc(S.one || '') + '"><button type="button" class="tl-btn tl-go" data-a="one">확인</button></p><p class="eb-oneres" aria-live="polite">' + oneRes() + '</p></details>';
    if (rk.length) h += '<div class="eb-rank"><h3>순위</h3><ol>' + rk.map(function (x) { return '<li><b>' + esc(x.t.nm) + '</b> ' + mmss(x.s) + (x.r.s != null ? ' (코드 시간' + (x.t.esc ? ' · 선생님 시계 ' + mmss(x.t.esc) : '') + ') · 힌트 ' + x.r.h + ' · 별 ' + x.r.st : ' (선생님 시계)') + '</li>' }).join('') + '</ol><p class="eb-note">순위 기준: 결과 코드를 넣은 모둠은 <b>코드 시간</b>(그 기기에서 이야기 뒤 탈출 시작부터 잰 시간)으로, 넣지 않은 모둠은 선생님이 \'탈출!\'을 누른 <b>선생님 시계</b>로 셉니다. 시간이 같으면 힌트를 적게 쓴 모둠이 앞이에요.</p></div>';
    host.innerHTML = h; api.bar(esc(R.title));
  }
  function oneRes() {
    if (!S.one) return '학생 화면의 결과 코드(숫자 10개)를 넣으면 어느 방을, 몇 분에, 힌트·틀림 몇 번으로 탈출했는지 나와요.';
    var r = decode(S.one); if (r.err) return '<b class="eb-errt">' + esc(r.err) + '</b>';
    return '<b>' + esc(RM[r.ri].title) + '</b> · 걸린 시간 <b>' + mmss(r.s) + '</b> · 힌트 ' + r.h + '번 · 틀림 ' + r.w + '번 · <span class="eb-st">' + '★★★'.slice(0, r.st) + '<i>' + '★★★'.slice(r.st) + '</i></span>';
  }
  function clock() { var c = host.querySelector('.eb-clock'); if (c && S.t0) c.textContent = mmss(now()) }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var a = b.dataset.a, i = +b.dataset.i, t = S.teams[i];
    if (a === 'start') { S.t0 = Date.now(); S.teams.forEach(function (x) { x.p = 0; x.esc = 0; x.code = '' }) }
    else if (a === 'stop') { if (!confirm('시계를 멈추고 모든 기록을 지울까요?')) return; S.t0 = 0; S.teams.forEach(function (x) { x.p = 0; x.esc = 0; x.code = '' }) }
    else if (a === 'p') t.p = Math.min(RM[S.room].n, t.p + 1);
    else if (a === 'm') t.p = Math.max(0, t.p - 1);
    else if (a === 'esc') t.esc = Math.max(1, Math.round(now()));
    else if (a === 'undo') { t.esc = 0; t.code = '' }
    else if (a === 'one') { S.one = (host.querySelector('.eb-one').value || '').trim() }
    else return;
    save(); draw();
  });
  host.addEventListener('change', function (e) {
    var el = e.target;
    if (el.classList.contains('eb-room')) { S.room = +el.value; S.teams.forEach(function (x) { x.p = 0 }) }
    else if (el.classList.contains('eb-n')) { var n = +el.value; while (S.teams.length < n) S.teams.push({ nm: (S.teams.length + 1) + '모둠', p: 0, esc: 0, code: '' }); S.teams.length = n }
    else if (el.classList.contains('eb-nm')) S.teams[+el.dataset.i].nm = el.value.trim() || ((+el.dataset.i + 1) + '모둠');
    else if (el.classList.contains('eb-one')) S.one = el.value.trim();
    else if (el.classList.contains('eb-code')) S.teams[+el.dataset.i].code = el.value.trim();
    else return;
    save(); draw();
  });
  host.addEventListener('focusin', function (e) { if (e.target.classList.contains('eb-nm')) setTimeout(function () { try { e.target.select() } catch (er) {} }, 0) });
  load(); draw(); tick = setInterval(clock, 1000);
};
