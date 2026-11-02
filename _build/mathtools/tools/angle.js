/* 각도기: 한 변을 끌어 각을 만들고 각도기로 재기 — 예각·직각·둔각, 각 만들기 문제 */
window.TOOL = function (host, api) {
  var A = 50, pro = true, goal = null, done = false, W = 640, H = 380, O = [320, 320], R = 260;
  host.innerHTML = '<svg class="tl-svg ag-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="각과 각도기"></svg><p class="tl-row"><span class="tl-big ag-val"></span><span class="ag-kind"></span></p>'
    + '<div class="tl-row"><button type="button" class="tl-btn" data-a="pro" aria-pressed="true">각도기 보이기</button><button type="button" class="tl-btn" data-d="-5">−5°</button><button type="button" class="tl-btn" data-d="-1">−1°</button><button type="button" class="tl-btn" data-d="1">+1°</button><button type="button" class="tl-btn" data-d="5">+5°</button><button type="button" class="tl-btn tl-go" data-a="q">🎯 각 만들기 문제</button></div><p class="tl-msg">빨간 점을 끌어 각을 만들어 보세요.</p>';
  var svg = host.querySelector('svg'), msg = host.querySelector('.tl-msg');
  function P(a, r) { var t = a * Math.PI / 180; return [O[0] + r * Math.cos(t), O[1] - r * Math.sin(t)] }
  function draw() {
    var h = '';
    if (pro) {
      h += '<path d="M' + P(0, R + 20) + ' A' + (R + 20) + ' ' + (R + 20) + ' 0 0 0 ' + P(180, R + 20) + ' Z" class="ag-pro"/>';
      for (var d = 0; d <= 180; d++) { var l = d % 10 === 0 ? 18 : d % 5 === 0 ? 12 : 6, a = P(d, R + 20), b = P(d, R + 20 - l); h += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" class="ag-tick"/>'; if (d % 10 === 0) { var t = P(d, R - 12), u = P(d, R - 38); h += '<text x="' + t[0] + '" y="' + (t[1] + 5) + '" class="ag-n" text-anchor="middle">' + d + '</text><text x="' + u[0] + '" y="' + (u[1] + 4) + '" class="ag-n2" text-anchor="middle">' + (180 - d) + '</text>' } }
    }
    var e1 = P(0, R), e2 = P(A, R), ar = P(A, 60);
    h += '<path d="M' + P(0, 60) + ' A60 60 0 0 0 ' + ar + '" class="ag-arc"/>';
    if (A === 90) h += '<path d="M' + P(0, 26) + ' L' + [O[0] + 26, O[1] - 26] + ' L' + P(90, 26) + '" class="ag-right"/>';
    h += '<line x1="' + O[0] + '" y1="' + O[1] + '" x2="' + e1[0] + '" y2="' + e1[1] + '" class="ag-ray"/><line x1="' + O[0] + '" y1="' + O[1] + '" x2="' + e2[0] + '" y2="' + e2[1] + '" class="ag-ray"/><circle cx="' + O[0] + '" cy="' + O[1] + '" r="6" class="ag-o"/><circle cx="' + e2[0] + '" cy="' + e2[1] + '" r="16" class="ag-h"/>';
    svg.innerHTML = h;
    host.querySelector('.ag-val').textContent = goal != null && !done ? '?°' : A + '°';
    host.querySelector('.ag-kind').textContent = goal != null && !done ? '' : A === 0 ? '' : A < 90 ? '예각 (0°보다 크고 90°보다 작은 각)' : A === 90 ? '직각' : A < 180 ? '둔각 (90°보다 크고 180°보다 작은 각)' : '평각(180°)';
    api.bar(goal != null ? '각 만들기: ' + goal + '°' : '각도기');
  }
  function setA(a) { A = Math.max(0, Math.min(180, Math.round(a))); if (goal != null && !done && A === goal) { done = true; msg.innerHTML = '🎉 <b>' + goal + '°</b>를 만들었어요!'; msg.style.color = 'var(--ok)' } draw() }
  var dragging = false;
  function angAt(e) { var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width - O[0], y = O[1] - (e.clientY - r.top) * H / r.height; var a = Math.atan2(y, x) * 180 / Math.PI; if (a < 0) a = x > 0 ? 0 : 180; return a }
  svg.addEventListener('pointerdown', function (e) { dragging = true; svg.setPointerCapture(e.pointerId); setA(angAt(e)) });
  svg.addEventListener('pointermove', function (e) { if (dragging) setA(angAt(e)) });
  svg.addEventListener('pointerup', function () { dragging = false });
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.d) setA(A + +b.dataset.d);
    if (b.dataset.a === 'pro') { pro = !pro; b.setAttribute('aria-pressed', pro ? 'true' : 'false'); draw() }
    if (b.dataset.a === 'q') { goal = (2 + Math.floor(Math.random() * 33)) * 5; done = false; msg.style.color = ''; msg.innerHTML = '<b>' + goal + '°</b>인 각을 만들어 보세요! 각도기 눈금을 읽어요.'; draw() }
  });
  draw();
};
