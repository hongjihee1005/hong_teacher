/* 거북이 코딩 수학: 블록 편집기 + 거북이 실행(SVG 400×400). window.TOOL(host, api) */
var TT = (function () {
  var BL = {
    fd: { t: '앞으로', u: '만큼', ic: '⬆', d: 100, min: 1, max: 300 }, bk: { t: '뒤로', u: '만큼', ic: '⬇', d: 50, min: 1, max: 300 },
    rt: { t: '오른쪽으로', u: '° 돌기', ic: '↻', d: 90, min: 1, max: 360 }, lt: { t: '왼쪽으로', u: '° 돌기', ic: '↺', d: 90, min: 1, max: 360 },
    rep: { t: '', u: '번 반복', ic: '🔁', d: 4, min: 1, max: 36 }, end: { t: '반복 끝', ic: '⏹' },
    pu: { t: '펜 들기', ic: '✋' }, pd: { t: '펜 내리기', ic: '✏️' }, col: { t: '색', ic: '🎨', d: 0 }
  };
  var COLS = ['#2A221C', '#D0453B', '#E0861A', '#2E9E5B', '#2B6FB8', '#7B4FB0', '#C2479A'];
  var CNAME = ['검정', '빨강', '주황', '초록', '파랑', '보라', '분홍'];
  /* 실행: 블록 목록 → 선분 목록. 오류면 {err} */
  function run(prog, start, limit) {
    var st = [], i, x = start[0], y = start[1], h = start[2], pen = true, col = 0, segs = [], steps = 0, path = [];
    for (i = 0; i < prog.length; i++) { if (prog[i][0] === 'rep') st.push(i); if (prog[i][0] === 'end') { if (!st.length) return { err: (i + 1) + '번째 ‘반복 끝’ 앞에 ‘반복’이 없어요.' }; st.pop() } }
    if (st.length) return { err: '‘반복’ 블록 ' + st.length + '개에 짝이 되는 ‘반복 끝’이 없어요.' };
    var loop = [], pc = 0;
    while (pc < prog.length) {
      if (++steps > (limit || 6000)) return { err: '명령이 너무 많아요(반복을 줄여 보세요).' };
      var b = prog[pc], k = b[0], v = +b[1];
      if (k === 'rep') { loop.push({ at: pc, left: v }); pc++; continue }
      if (k === 'end') { var L = loop[loop.length - 1]; L.left--; if (L.left > 0) pc = L.at + 1; else { loop.pop(); pc++ } continue }
      if (k === 'fd' || k === 'bk') { var s = k === 'fd' ? v : -v, r = h * Math.PI / 180, nx = x + s * Math.sin(r), ny = y - s * Math.cos(r); if (pen) segs.push([x, y, nx, ny, col]); path.push({ x: nx, y: ny, h: h, seg: pen ? segs.length - 1 : -1 }); x = nx; y = ny }
      else if (k === 'rt') { h += v; path.push({ x: x, y: y, h: h, seg: -1 }) } else if (k === 'lt') { h -= v; path.push({ x: x, y: y, h: h, seg: -1 }) }
      else if (k === 'pu') pen = false; else if (k === 'pd') pen = true; else if (k === 'col') col = v;
      pc++;
    }
    return { segs: segs, path: path, end: [x, y, h] };
  }
  function pts(segs) { var o = []; segs.forEach(function (s) { var d = Math.hypot(s[2] - s[0], s[3] - s[1]), n = Math.max(1, Math.ceil(d / 4)); for (var i = 0; i <= n; i++) o.push([s[0] + (s[2] - s[0]) * i / n, s[1] + (s[3] - s[1]) * i / n]) }); return o }
  function near(p, segs, tol) { for (var i = 0; i < segs.length; i++) { var s = segs[i], dx = s[2] - s[0], dy = s[3] - s[1], L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((p[0] - s[0]) * dx + (p[1] - s[1]) * dy) / L)) : 0; if (Math.hypot(p[0] - s[0] - t * dx, p[1] - s[1] - t * dy) <= tol) return true } return false }
  /* 같은 그림인가: 목표의 모든 점이 내 선 가까이, 내 선의 모든 점이 목표 가까이 */
  function same(mine, goal) { if (!mine.length) return false; return pts(goal).every(function (p) { return near(p, mine, 3) }) && pts(mine).every(function (p) { return near(p, goal, 3) }) }
  function count(prog) { return prog.filter(function (b) { return b[0] !== 'end' }).length }
  function segSvg(segs, cls) { return segs.map(function (s) { return '<line x1="' + s[0].toFixed(1) + '" y1="' + s[1].toFixed(1) + '" x2="' + s[2].toFixed(1) + '" y2="' + s[3].toFixed(1) + '" class="' + cls + '"' + (cls === 'tt-ink' ? ' style="stroke:' + COLS[s[4] || 0] + '"' : '') + '/>' }).join('') }
  function grid() { var h = ''; for (var i = 0; i <= 400; i += 50) h += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="400" class="tt-grid"/><line x1="0" y1="' + i + '" x2="400" y2="' + i + '" class="tt-grid"/>'; return h }
  function turtle(x, y, h) { return '<g class="tt-turtle" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + h + ')"><ellipse cx="0" cy="0" rx="9" ry="11" class="tt-shell"/><circle cx="0" cy="-14" r="4.5" class="tt-head"/><circle cx="-8" cy="-7" r="3" class="tt-leg"/><circle cx="8" cy="-7" r="3" class="tt-leg"/><circle cx="-8" cy="8" r="3" class="tt-leg"/><circle cx="8" cy="8" r="3" class="tt-leg"/></g>' }
  return { BL: BL, COLS: COLS, CNAME: CNAME, run: run, same: same, count: count, segSvg: segSvg, grid: grid, turtle: turtle };
})();

window.TOOL = function (host, api) {
  var D = window.TL, MS = D.missions || null, mode = D.mode, KEY = 'hj-coding-v1';
  function ld() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { return {} } }
  function sv(o) { try { localStorage.setItem(KEY, JSON.stringify(o)) } catch (e) {} }
  var rec = ld(), mi = 0, prog = [], sel = -1, anim = null, speed = 2;
  if (mode === 'mission') { var hm = /#m(\d+)/.exec(location.hash); mi = hm ? Math.min(MS.length - 1, Math.max(0, +hm[1] - 1)) : (rec.last || 0) }
  function M() { return MS[mi] }
  function start() { return mode === 'mission' ? M().start : [200, 260, 0] }
  function palette() {
    var ks = ['fd', 'bk', 'rt', 'lt'];
    if (mode !== 'mission' || M().rep) ks.push('rep', 'end');
    if (mode !== 'mission' || M().pen) ks.push('pu', 'pd');
    if (mode !== 'mission') ks.push('col');
    return ks.map(function (k) { var b = TT.BL[k]; return '<button type="button" class="tt-pal tt-k-' + k + '" data-k="' + k + '">' + b.ic + ' ' + (k === 'rep' ? '반복' : b.t || '') + '</button>' }).join('');
  }
  host.innerHTML = (mode === 'mission' ? '<div class="tt-mnav" role="tablist" aria-label="미션 고르기"></div><div class="tt-goal"></div>' : '<div class="tt-ex tl-row"><b>예시 불러오기</b></div>') +
    '<div class="tt-wrap"><div class="tt-left"><p class="tt-lab">블록 누르기 → 내 프로그램에 들어가요</p><div class="tt-palette"></div>' +
    '<p class="tt-lab">내 프로그램 <span class="tt-cnt"></span></p><ol class="tt-prog" aria-label="내 프로그램"></ol>' +
    '<p class="tl-row"><button type="button" class="tl-btn tl-go tt-run">▶ 실행</button><button type="button" class="tl-btn tt-step">한 줄씩</button><button type="button" class="tl-btn tt-clear">🗑️ 모두 지우기</button></p>' +
    '<p class="tl-row tt-speed"><span>빠르기</span>' + ['느리게', '보통', '빠르게', '바로'].map(function (n, i) { return '<button type="button" class="tl-btn tt-sp" data-s="' + i + '" aria-pressed="' + (i === speed) + '">' + n + '</button>' }).join('') + '</p></div>' +
    '<div class="tt-right"><svg class="tl-svg tt-svg" viewBox="0 0 400 400" role="img" aria-label="거북이 그림판"></svg><p class="tl-msg tt-msg" aria-live="polite"></p>' +
    (mode === 'free' ? '<p class="tl-row"><button type="button" class="tl-btn tt-png">💾 그림 저장</button></p>' : '') + '</div></div>';
  var svg = host.querySelector('.tt-svg'), list = host.querySelector('.tt-prog'), msg = host.querySelector('.tt-msg');
  function goalSegs() { return mode === 'mission' ? TT.run(M().sol, M().start).segs : [] }
  function draw(segs, tur) { var s = start(); svg.innerHTML = TT.grid() + TT.segSvg(goalSegs(), 'tt-goalseg') + '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="5" class="tt-start"/>' + TT.segSvg(segs || [], 'tt-ink') + TT.turtle.apply(null, tur || s) }
  function renderProg() {
    var depth = 0;
    list.innerHTML = prog.map(function (b, i) {
      var k = b[0], B = TT.BL[k]; if (k === 'end') depth = Math.max(0, depth - 1);
      var inp = k === 'col' ? '<select class="tt-v" data-i="' + i + '" aria-label="색">' + TT.CNAME.map(function (n, c) { return '<option value="' + c + '"' + (+b[1] === c ? ' selected' : '') + '>' + n + '</option>' }).join('') + '</select>' : B.d != null ? '<input class="tt-v" data-i="' + i + '" type="number" inputmode="numeric" min="' + B.min + '" max="' + B.max + '" value="' + b[1] + '" aria-label="' + (B.t || '반복') + ' 수">' : '';
      var row = '<li class="tt-b tt-k-' + k + (i === sel ? ' tt-sel' : '') + '" data-i="' + i + '" style="margin-left:' + depth * 22 + 'px"><span class="tt-bl">' + B.ic + ' ' + (k === 'rep' ? '' : B.t) + ' ' + inp + ' ' + (B.u || '') + '</span><span class="tt-ops"><button type="button" data-a="up" aria-label="위로">▲</button><button type="button" data-a="dn" aria-label="아래로">▼</button><button type="button" data-a="del" aria-label="지우기">✕</button></span></li>';
      if (k === 'rep') depth++;
      return row;
    }).join('') || '<li class="tt-empty">위의 블록을 눌러 명령을 넣어요.</li>';
    host.querySelector('.tt-cnt').textContent = '(블록 ' + TT.count(prog) + '개' + (mode === 'mission' ? ' · ★★★ 기준 ' + TT.count(M().sol) + '개 이하' : '') + ')';
  }
  function add(k) { var b = TT.BL[k], nb = b.d != null ? [k, b.d] : [k]; var at = sel >= 0 ? sel + 1 : prog.length; prog.splice(at, 0, nb); if (k === 'rep') prog.splice(at + 1, 0, ['end']); sel = at; renderProg(); }
  host.querySelector('.tt-palette').innerHTML = palette();
  function bindPal() { host.querySelectorAll('.tt-pal').forEach(function (b) { b.onclick = function () { add(b.dataset.k) } }) }
  bindPal();
  list.addEventListener('click', function (e) {
    var li = e.target.closest('.tt-b'); if (!li) return; var i = +li.dataset.i, a = e.target.closest('button') && e.target.closest('button').dataset.a;
    if (a === 'del') { prog.splice(i, 1); sel = Math.min(i, prog.length - 1) } else if (a === 'up' && i > 0) { var t = prog[i]; prog[i] = prog[i - 1]; prog[i - 1] = t; sel = i - 1 } else if (a === 'dn' && i < prog.length - 1) { t = prog[i]; prog[i] = prog[i + 1]; prog[i + 1] = t; sel = i + 1 } else if (!a) { if (e.target.closest('.tt-v')) { sel = i } else sel = sel === i ? -1 : i } else return;
    if (!e.target.closest('.tt-v')) renderProg();
  });
  list.addEventListener('change', function (e) { var x = e.target.closest('.tt-v'); if (!x) return; var i = +x.dataset.i, B = TT.BL[prog[i][0]], v = Math.round(+x.value); if (prog[i][0] !== 'col') { if (!(v >= B.min)) v = B.min; if (v > B.max) v = B.max; x.value = v } prog[i][1] = v });
  function stop() { if (anim) { cancelAnimationFrame(anim.raf); anim = null } }
  function finish(R) {
    draw(R.segs, R.end);
    if (mode !== 'mission') { msg.textContent = '다 그렸어요! 선분 ' + R.segs.length + '개.'; msg.className = 'tl-msg tt-msg'; return }
    var ok = TT.same(R.segs, goalSegs()), n = TT.count(prog), best = TT.count(M().sol);
    if (ok) { var st = n <= best ? 3 : n <= best + 2 ? 2 : 1, r = rec.s || {}; r[mi] = Math.max(r[mi] || 0, st); rec.s = r; sv(rec); nav();
      msg.innerHTML = '⭕ 성공! ' + '★★★'.slice(0, st) + '☆☆☆'.slice(st) + ' (블록 ' + n + '개' + (st < 3 ? ' — ' + best + '개로도 할 수 있어요' + (M().rep ? '. 반복을 써 볼까요?' : '') : '') + ')<br><small>💡 ' + M().idea + '</small>' + (mi < MS.length - 1 ? ' <button type="button" class="tl-btn tl-go tt-nextm">이어서 ▶ 미션 ' + (mi + 2) + '</button>' : ' 🎉 모든 미션 끝!'); msg.className = 'tl-msg tt-msg tt-ok';
      var nb = msg.querySelector('.tt-nextm'); if (nb) { nb.onclick = function () { load(mi + 1) }; setTimeout(function () { nb.focus() }, 400) }
    } else { msg.innerHTML = '❌ 점선 그림과 달라요. 거북이를 따라가며 어디서 달라지는지 찾아봐요.' + (M().hint ? ' <button type="button" class="tl-btn tt-hint">💡 힌트</button>' : ''); msg.className = 'tl-msg tt-msg tt-bad'; var hb = msg.querySelector('.tt-hint'); if (hb) hb.onclick = function () { hb.outerHTML = '<b>' + M().hint + '</b>' } }
  }
  function exec(stepMode) {
    stop(); var R = TT.run(prog, start()); if (R.err) { msg.textContent = '⚠️ ' + R.err; msg.className = 'tl-msg tt-msg tt-bad'; return }
    if (!prog.length) { msg.textContent = '먼저 블록을 넣어요.'; return }
    msg.textContent = ''; msg.className = 'tl-msg tt-msg';
    if (speed === 3 && !stepMode) return finish(R);
    var per = [0.6, 1.8, 6][stepMode ? 0 : speed] * 4, base = start();
    if (stepMode) { anim = { R: R, k: 0 }; stepOne(); return }
    anim = {};
    var done = [], idx = 0, prog2 = 0, from = { x: base[0], y: base[1], h: base[2] };
    function f2() {
      var P = R.path[idx]; if (!P) { anim = null; return finish(R) }
      var len = Math.max(Math.hypot(P.x - from.x, P.y - from.y), Math.abs(P.h - from.h) / 3, 1); prog2 += per;
      var fr = Math.min(1, prog2 / len), nx = from.x + (P.x - from.x) * fr, ny = from.y + (P.y - from.y) * fr, nh = from.h + (P.h - from.h) * fr, extra = [];
      if (P.seg >= 0) { var S0 = R.segs[P.seg]; extra.push([S0[0], S0[1], nx, ny, S0[4]]) }
      draw(done.concat(extra), [nx, ny, nh]);
      if (fr >= 1) { if (P.seg >= 0) done.push(R.segs[P.seg]); from = { x: P.x, y: P.y, h: P.h }; idx++; prog2 = 0 }
      anim.raf = requestAnimationFrame(f2);
    }
    anim.raf = requestAnimationFrame(f2);
  }
  function stepOne() { var A = anim; if (!A) return; A.k++; var R = A.R, P = R.path[A.k - 1]; if (!P) { anim = null; return finish(R) } var segs = R.path.slice(0, A.k).filter(function (q) { return q.seg >= 0 }).map(function (q) { return R.segs[q.seg] }); draw(segs, [P.x, P.y, P.h]); msg.textContent = '한 줄씩: ' + A.k + ' / ' + R.path.length + ' 움직임 (‘한 줄씩’을 또 누르세요)' }
  host.querySelector('.tt-run').onclick = function () { exec(false) };
  host.querySelector('.tt-step').onclick = function () { if (anim && anim.R) stepOne(); else exec(true) };
  host.querySelector('.tt-clear').onclick = function () { if (prog.length && !confirm('프로그램을 모두 지울까요?')) return; stop(); prog = []; sel = -1; renderProg(); draw(); msg.textContent = '' };
  host.querySelectorAll('.tt-sp').forEach(function (b) { b.onclick = function () { speed = +b.dataset.s; host.querySelectorAll('.tt-sp').forEach(function (x) { x.setAttribute('aria-pressed', x === b) }) } });
  function nav() {
    if (mode !== 'mission') return; var r = rec.s || {};
    host.querySelector('.tt-mnav').innerHTML = MS.map(function (m, i) { return '<button type="button" class="tt-mb" role="tab" aria-selected="' + (i === mi) + '" data-i="' + i + '" title="' + m.title + '">' + (i + 1) + (r[i] ? '<small>' + '★★★'.slice(0, r[i]) + '</small>' : '') + '</button>' }).join('');
    host.querySelectorAll('.tt-mb').forEach(function (b) { b.onclick = function () { load(+b.dataset.i) } });
  }
  function load(i) {
    stop(); mi = i; rec.last = i; sv(rec); prog = []; sel = -1; history.replaceState(null, '', '#m' + (i + 1));
    host.querySelector('.tt-goal').innerHTML = '<p class="tt-mt">미션 ' + (i + 1) + '. ' + M().title + '</p><p class="tt-mg">🎯 ' + M().goal + ' <small>(점선을 따라 그려요 · 빨간 점에서 출발' + (M().start[2] ? ', 처음 방향 ' + M().start[2] + '°' : ', 위쪽을 보고 시작') + ')</small></p>';
    host.querySelector('.tt-palette').innerHTML = palette(); bindPal(); nav(); renderProg(); draw(); msg.textContent = ''; msg.className = 'tl-msg tt-msg';
    api.bar('미션 ' + (i + 1) + ' · ' + M().title);
  }
  if (mode === 'free') {
    var EX = D.examples, ex = host.querySelector('.tt-ex');
    ex.innerHTML += EX.map(function (e, i) { return '<button type="button" class="tl-btn tt-exb" data-i="' + i + '">' + e.name + '</button>' }).join('');
    ex.querySelectorAll('.tt-exb').forEach(function (b) { b.onclick = function () { stop(); prog = EX[+b.dataset.i].prog.map(function (x) { return x.slice() }); sel = -1; renderProg(); exec(false) } });
    host.querySelector('.tt-png').onclick = function () {
      var c = document.createElement('canvas'); c.width = 800; c.height = 800; var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 800, 800); g.scale(2, 2); g.lineCap = 'round'; g.lineWidth = 3;
      var R = TT.run(prog, start()); if (R.err) return; R.segs.forEach(function (s) { g.strokeStyle = TT.COLS[s[4] || 0]; g.beginPath(); g.moveTo(s[0], s[1]); g.lineTo(s[2], s[3]); g.stroke() });
      var a = document.createElement('a'); a.download = '거북이그림.png'; a.href = c.toDataURL('image/png'); a.click();
    };
    api.bar('자유 그리기'); renderProg(); draw();
  } else load(mi);
  /* 미션 활동지 인쇄 */
  var pb = document.getElementById('ttPrint');
  if (pb) pb.onclick = function () {
    var sh = document.getElementById('ttSheet'), per = 4, pages = [];
    for (var p = 0; p < MS.length; p += per) pages.push(MS.slice(p, p + per).map(function (m, j) { var R = TT.run(m.sol, m.start), s = m.start; return '<div class="tp-card"><p class="tp-t">미션 ' + (p + j + 1) + '. ' + m.title + '</p><p class="tp-g">' + m.goal + '</p><div class="tp-body"><svg viewBox="0 0 400 400" class="tp-svg">' + TT.grid() + TT.segSvg(R.segs, 'tp-seg') + '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="7" class="tp-start"/>' + TT.turtle(s[0], s[1], s[2]) + '</svg><div class="tp-lines">' + Array(9).join('<div class="tp-line"></div>') + '</div></div></div>' }).join(''));
    sh.innerHTML = pages.map(function (h) { return '<div class="tp-pg"><div class="tp-hd"><b>🐢 거북이 코딩 미션 활동지</b><span>이름 ______________</span></div><div class="tp-grid">' + h + '</div><p class="tp-ft">빨간 점에서 출발해요. 명령을 한 줄에 하나씩 써요(예: 앞으로 100 / 오른쪽으로 90° 돌기 / 4번 반복 … 반복 끝). · 초등교사 홍지희</p></div>' }).join('');
    document.documentElement.classList.add('tt-printing'); var off = function () { document.documentElement.classList.remove('tt-printing'); window.removeEventListener('afterprint', off) }; window.addEventListener('afterprint', off); setTimeout(function () { window.print() }, 80);
  };
};
