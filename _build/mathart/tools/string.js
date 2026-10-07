/* 실 그림: ① 각 안에 실 걸기(직선만으로 곡선) ② 곱셈 원(점 k → k × m) */
window.TOOL = function (host, api) {
  var S = 640, mode = 'angle', n = 20, m = 2, pts = 120, deg = 90, col = '#7B4FB0';
  host.innerHTML = '<div class="tl-row"><button type="button" class="tl-btn" data-m="angle">각 안에 실 걸기</button><button type="button" class="tl-btn" data-m="circle">곱셈 원</button><label>색 <input type="color" class="st-c" value="' + col + '"></label><button type="button" class="tl-btn" data-a="save">💾 그림 저장</button><button type="button" class="tl-btn" data-a="print">🖨️ 인쇄</button></div><div class="st-ctl"></div><canvas class="ar-cv st-cv" width="' + S + '" height="' + S + '"></canvas><p class="tl-msg"></p>';
  var cv = host.querySelector('canvas'), ctx = cv.getContext('2d');
  function ctl() {
    host.querySelector('.st-ctl').innerHTML = mode === 'angle' ? '<label>한 변의 점 수 <input type="range" min="4" max="40" value="' + n + '" data-k="n"> <b>' + n + '</b></label><label>각도 <input type="range" min="30" max="150" step="5" value="' + deg + '" data-k="deg"> <b>' + deg + '°</b></label>'
      : '<label>원 위의 점 수 <input type="range" min="10" max="300" value="' + pts + '" data-k="pts"> <b>' + pts + '</b></label><label>곱하는 수 <input type="range" min="2" max="40" value="' + m + '" data-k="m"> <b>' + m + '</b></label>';
  }
  function draw() {
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, S, S); ctx.strokeStyle = col; ctx.lineWidth = 1.2;
    if (mode === 'angle') {
      var O = [90, 560], L = 470, a = deg * Math.PI / 180, A = function (i) { return [O[0] + L * i / n, O[1]] }, B = function (i) { return [O[0] + L * i / n * Math.cos(a), O[1] - L * i / n * Math.sin(a)] };
      ctx.lineWidth = 2.5; ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(A(n)[0], A(n)[1]); ctx.lineTo(O[0], O[1]); ctx.lineTo(B(n)[0], B(n)[1]); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 1.3;
      for (var i = 1; i <= n; i++) { var p = A(i), q = B(n + 1 - i); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke() }
      ctx.fillStyle = '#333'; for (i = 1; i <= n; i++) { [A(i), B(i)].forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 2.5, 0, 7); ctx.fill() }) }
      host.querySelector('.tl-msg').innerHTML = '두 변에 점을 ' + n + '개씩 찍고, 한쪽 변의 1번 점과 다른 변의 ' + n + '번 점, 2번과 ' + (n - 1) + '번 … 차례로 이어요. <b>곧은 선분만으로 굽은 곡선</b>이 나타나요! 점이 많을수록 곡선이 부드러워요.';
    } else {
      var c = S / 2, r = S / 2 - 30, P = function (k) { var t = 2 * Math.PI * k / pts - Math.PI / 2; return [c + r * Math.cos(t), c + r * Math.sin(t)] };
      ctx.strokeStyle = '#ccc'; ctx.beginPath(); ctx.arc(c, c, r, 0, 7); ctx.stroke(); ctx.strokeStyle = col;
      for (var k = 0; k < pts; k++) { var a1 = P(k), b1 = P((k * m) % pts); ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(b1[0], b1[1]); ctx.stroke() }
      var name = { 2: '하트 모양 곡선(카디오이드)', 3: '잎 두 장 모양(네프로이드)' }[m];
      host.querySelector('.tl-msg').innerHTML = '원 위에 점 ' + pts + '개를 0, 1, 2 …로 번호 매기고, 점 <b>k</b>와 점 <b>k × ' + m + '</b>(' + pts + '을 넘으면 ' + pts + '으로 나눈 나머지)를 이어요. 예: 3 → ' + (3 * m % pts) + ', 10 → ' + (10 * m % pts) + '.' + (name ? ' 곱하는 수 ' + m + '이면 <b>' + name + '</b>이 나타나요!' : '');
    }
    host.querySelectorAll('[data-m]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.m === mode ? 'true' : 'false') });
    api.bar('실 그림 · ' + (mode === 'angle' ? '각 안에 실 걸기' : '곱셈 원'));
  }
  host.addEventListener('input', function (e) { var k = e.target.dataset.k; if (!k) return; if (k === 'n') n = +e.target.value; if (k === 'deg') deg = +e.target.value; if (k === 'pts') pts = +e.target.value; if (k === 'm') m = +e.target.value; e.target.nextElementSibling.textContent = e.target.value + (k === 'deg' ? '°' : ''); draw() });
  host.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.m) { mode = b.dataset.m; ctl(); draw() } if (b.dataset.a === 'save') ART.save(cv, '실그림'); if (b.dataset.a === 'print') ART.print(cv, mode === 'angle' ? '실 그림 — 각 안에 실 걸기' : '실 그림 — 곱셈 원 (점 ' + pts + '개, × ' + m + ')') });
  host.querySelector('.st-c').oninput = function () { col = this.value; draw() };
  ctl(); draw();
};
