/* 교실 수학 놀이 공통: 섞기, 주사위, 인쇄할 쪽 미리 보기·인쇄 */
var CP = (function () {
  function rnd(n) { return Math.floor(Math.random() * n) }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t } return a }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function frac(s) { return esc(s).replace(/(\d+)\/(\d+)/g, '<span class="fd-fr"><i>$1</i><i>$2</i></span>') }
  function die(v) { var P = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] }[v]; return '<svg class="cp-die" viewBox="0 0 80 80" aria-label="주사위 ' + v + '"><rect x="3" y="3" width="74" height="74" rx="14"/>' + P.map(function (p) { return '<circle cx="' + p[0] * 20 + '" cy="' + p[1] * 20 + '" r="7"/>' }).join('') + '</svg>' }
  /* 주사위 굴리기 도우미: el 안에 n개 주사위, 굴리면 cb(값들) */
  function dice(el, n, cb) {
    el.innerHTML = '<div class="cp-dice"></div><button type="button" class="tl-btn tl-go cp-roll">🎲 주사위 굴리기</button>';
    var box = el.querySelector('.cp-dice'), v = []; function show() { box.innerHTML = v.map(die).join('') }
    v = Array.from({ length: n }, function () { return 1 }); show();
    el.querySelector('.cp-roll').onclick = function () { v = v.map(function () { return 1 + rnd(6) }); box.classList.remove('cp-pop'); void box.offsetWidth; box.classList.add('cp-pop'); show(); cb && cb(v) };
  }
  /* 인쇄: html(쪽들) → #cpSheet에 넣고 인쇄 */
  function print(html) {
    var s = document.getElementById('cpSheet'); s.innerHTML = html; document.documentElement.classList.add('cp-printing');
    var off = function () { document.documentElement.classList.remove('cp-printing'); window.removeEventListener('afterprint', off) }; window.addEventListener('afterprint', off);
    setTimeout(function () { window.print() }, 120);
  }
  function page(inner, title, name) { return '<div class="cp-pg">' + (title ? '<div class="cp-hd"><b>' + title + '</b>' + (name === false ? '' : '<span>이름 ______________</span>') + '</div>' : '') + inner + '<p class="cp-ft">교실 수학 놀이 · 초등교사 홍지희</p></div>' }
  /* 단계 쉬움·보통·도전(2026-11-26): lvSel(놀이 id) → 고르기 칸 HTML, lv(host) → 0·1·2 (고른 단계는 이 기기에 기억) */
  var LVN = ['쉬움', '보통', '도전'], LK = 'hj-play-lv';
  function lvLoad(id) { try { var v = JSON.parse(localStorage.getItem(LK) || '{}')[id]; return v >= 0 && v <= 2 ? v : 1 } catch (e) { return 1 } }
  function lvSel(id) { var v = lvLoad(id); return '<label>단계 <select class="cp-lv" data-id="' + id + '">' + LVN.map(function (n, i) { return '<option value="' + i + '"' + (i === v ? ' selected' : '') + '>' + n + '</option>' }).join('') + '</select></label>' }
  function lv(host) { var s = host.querySelector('.cp-lv'); if (!s) return 1; var v = +s.value; try { var o = JSON.parse(localStorage.getItem(LK) || '{}'); o[s.dataset.id] = v; localStorage.setItem(LK, JSON.stringify(o)) } catch (e) {} return v }
  return { LVN: LVN, lvSel: lvSel, lv: lv, rnd: rnd, shuffle: shuffle, esc: esc, frac: frac, die: die, dice: dice, print: print, page: page };
})();
