/* 시계: 긴바늘·짧은바늘을 끌어 시각 맞추기(긴바늘을 돌리면 짧은바늘도 따라 움직임), 디지털 시계, 몇 분 뒤 */
window.TOOL = function (host, api) {
  var M = 9 * 60 + 30, dig = true, goal = null, R = 170, C = 200, nums = true;
  host.innerHTML = '<div class="ck-wrap"><svg class="tl-svg ck-svg" viewBox="0 0 400 400" role="img" aria-label="바늘 시계"></svg><div class="ck-side"><p class="ck-dig tl-big"></p><p class="ck-say"></p>'
    + '<div class="tl-row">' + [['-60', '−1시간'], ['-10', '−10분'], ['-1', '−1분'], ['1', '+1분'], ['5', '+5분'], ['10', '+10분'], ['30', '+30분'], ['60', '+1시간']].map(function (x) { return '<button type="button" class="tl-btn" data-m="' + x[0] + '">' + x[1] + '</button>' }).join('') + '</div>'
    + '<div class="tl-row"><button type="button" class="tl-btn" data-a="dig" aria-pressed="true">디지털 시계 보이기</button><button type="button" class="tl-btn" data-a="min" aria-pressed="true">분 숫자 보이기</button><button type="button" class="tl-btn tl-go" data-a="q">🎯 시각 맞추기 문제</button></div><p class="tl-msg">바늘을 끌어서 돌려 보세요. 긴바늘을 한 바퀴 돌리면 짧은바늘은 숫자 한 칸을 가요.</p></div></div>';
  var svg = host.querySelector('svg'), msg = host.querySelector('.tl-msg');
  function P(deg, r) { var t = (deg - 90) * Math.PI / 180; return [C + r * Math.cos(t), C + r * Math.sin(t)] }
  function hm(m) { m = ((m % 720) + 720) % 720; var h = Math.floor(m / 60), mi = m % 60; return [h === 0 ? 12 : h, mi] }
  function draw() {
    var h = '<circle cx="' + C + '" cy="' + C + '" r="' + R + '" class="ck-face"/>';
    for (var i = 0; i < 60; i++) { var a = P(i * 6, R - 4), b = P(i * 6, R - (i % 5 ? 12 : 22)); h += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" class="' + (i % 5 ? 'ck-t' : 'ck-t5') + '"/>' }
    for (i = 1; i <= 12; i++) { var p = P(i * 30, R - 46); h += '<text x="' + p[0] + '" y="' + (p[1] + 11) + '" class="ck-n" text-anchor="middle">' + i + '</text>'; if (nums) { var q = P(i * 30, R + 16); h += '<text x="' + q[0] + '" y="' + (q[1] + 5) + '" class="ck-mn" text-anchor="middle">' + (i * 5 % 60) + '</text>' } }
    var t = hm(M), hd = P((M % 720) / 2, R * .5), md = P((M % 60) * 6, R * .8);
    h += '<line x1="' + C + '" y1="' + C + '" x2="' + hd[0] + '" y2="' + hd[1] + '" class="ck-hh"/><line x1="' + C + '" y1="' + C + '" x2="' + md[0] + '" y2="' + md[1] + '" class="ck-mh"/><circle cx="' + hd[0] + '" cy="' + hd[1] + '" r="14" class="ck-grab ck-gh" data-h="h"/><circle cx="' + md[0] + '" cy="' + md[1] + '" r="14" class="ck-grab ck-gm" data-h="m"/><circle cx="' + C + '" cy="' + C + '" r="8" class="ck-pin"/>';
    svg.innerHTML = h;
    var hide = goal != null;
    host.querySelector('.ck-dig').textContent = dig && !hide ? t[0] + ':' + String(t[1]).padStart(2, '0') : hide ? goal[0] + ':' + String(goal[1]).padStart(2, '0') : '';
    host.querySelector('.ck-say').textContent = hide ? '바늘을 이 시각으로 맞춰요!' : t[0] + '시 ' + (t[1] ? t[1] + '분' : '정각');
    api.bar('시계');
    if (goal && t[0] === goal[0] && t[1] === goal[1]) { msg.innerHTML = '🎉 맞아요! <b>' + goal[0] + '시 ' + goal[1] + '분</b>이에요.'; msg.style.color = 'var(--ok)'; goal = null; setTimeout(draw, 0) }
  }
  var hand = null, last = null;
  function ang(e) { var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) * 400 / r.width - C, y = (e.clientY - r.top) * 400 / r.height - C; return (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360 }
  svg.addEventListener('pointerdown', function (e) { var g = e.target.closest('.ck-grab'); hand = g ? g.dataset.h : 'm'; last = ang(e); svg.setPointerCapture(e.pointerId) });
  svg.addEventListener('pointermove', function (e) {
    if (!hand) return; var a = ang(e), d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360; last = a;
    if (hand === 'h') M = Math.round(M + d * 2);
    if (hand === 'm') { var base = Math.floor(M / 60) * 60, mm = Math.round(a / 6) % 60; var cand = [base - 60 + mm, base + mm, base + 60 + mm]; M = cand.reduce(function (x, y) { return Math.abs(y - M) < Math.abs(x - M) ? y : x }) }
    M = ((M % 720) + 720) % 720; draw();
  });
  svg.addEventListener('pointerup', function () { hand = null });
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.m) { M = ((M + +b.dataset.m) % 720 + 720) % 720 }
    if (b.dataset.a === 'dig') { dig = !dig; b.setAttribute('aria-pressed', dig ? 'true' : 'false') }
    if (b.dataset.a === 'min') { nums = !nums; b.setAttribute('aria-pressed', nums ? 'true' : 'false') }
    if (b.dataset.a === 'q') { goal = [1 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 12) * 5]; msg.style.color = ''; msg.textContent = '디지털 시계에 나온 시각으로 바늘을 맞춰 보세요.' }
    draw();
  });
  draw();
};
