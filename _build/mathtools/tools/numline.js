/* 수직선: 범위를 고르고 눌러서 점 찍기, 뛰어 세기(시작·한 번에·몇 번) 화살표 */
window.TOOL = function (host, api) {
  var R = [
    { id: 'a', nm: '0~10', a: 0, b: 10, maj: 1, min: 1, d: 0 },
    { id: 'b', nm: '0~20', a: 0, b: 20, maj: 5, min: 1, d: 0 },
    { id: 'c', nm: '0~100', a: 0, b: 100, maj: 10, min: 1, d: 0 },
    { id: 'd', nm: '0~1000', a: 0, b: 1000, maj: 100, min: 10, d: 0 },
    { id: 'e', nm: '0~1 (소수 한 자리)', a: 0, b: 1, maj: .1, min: .1, d: 1 },
    { id: 'f', nm: '0~2 (소수 두 자리)', a: 0, b: 2, maj: .1, min: .01, d: 2 },
    { id: 'g', nm: '0~3 (분수)', a: 0, b: 3, maj: 1, min: 0, d: 0, frac: true }];
  var cur = R[0], den = 4, marks = [], hops = null, W = 1000, H = 230, X0 = 50, X1 = 950, Y = 150;
  host.innerHTML = '<div class="tl-row nl-ranges">' + R.map(function (r) { return '<button type="button" class="tl-btn" data-r="' + r.id + '">' + r.nm + '</button>' }).join('') + '<label class="nl-den" hidden>분모 <select>' + [2, 3, 4, 5, 6, 8, 10].map(function (n) { return '<option' + (n === 4 ? ' selected' : '') + '>' + n + '</option>' }).join('') + '</select></label></div>'
    + '<svg class="tl-svg nl-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="수직선"></svg>'
    + '<div class="tl-row nl-hop"><b>뛰어 세기</b><label>시작 <input data-k="s" value="0" inputmode="decimal"></label><label>한 번에 <input data-k="j" value="2" inputmode="decimal"></label><label>몇 번 <input data-k="n" value="4" inputmode="numeric"></label><button type="button" class="tl-btn tl-go" data-a="hop">뛰기</button><button type="button" class="tl-btn" data-a="clr">지우기</button></div><p class="tl-msg">수직선을 누르면 그 자리에 점이 찍혀요(가장 가까운 눈금).</p>';
  var svg = host.querySelector('svg'), msg = host.querySelector('.tl-msg');
  function x(v) { return X0 + (v - cur.a) / (cur.b - cur.a) * (X1 - X0) }
  function fmt(v) { if (cur.frac) { var w = Math.round(v * den), n = Math.floor(w / den), r = w % den; return r === 0 ? String(n) : (n ? n + ' ' : '') + r + '/' + den } return (+v.toFixed(cur.d)).toString() }
  function step() { return cur.frac ? 1 / den : cur.min }
  function draw() {
    var h = '<line x1="' + (X0 - 25) + '" y1="' + Y + '" x2="' + (X1 + 30) + '" y2="' + Y + '" class="nl-ax"/><path d="M' + (X1 + 30) + ' ' + Y + ' l-14 -8 v16 Z" class="nl-arw"/>', st = step(), n = Math.round((cur.b - cur.a) / st);
    for (var i = 0; i <= n; i++) {
      var v = cur.a + i * st, big = cur.frac ? Math.abs(v - Math.round(v)) < 1e-9 : Math.abs(v / cur.maj - Math.round(v / cur.maj)) < 1e-9, xx = x(v);
      h += '<line x1="' + xx + '" y1="' + (Y - (big ? 16 : 8)) + '" x2="' + xx + '" y2="' + (Y + (big ? 16 : 8)) + '" class="' + (big ? 'nl-tb' : 'nl-ts') + '"/>';
      if (big || (cur.frac && n <= 30)) h += '<text x="' + xx + '" y="' + (Y + 42) + '" class="' + (big ? 'nl-lb' : 'nl-ls') + '" text-anchor="middle">' + fmt(v) + '</text>';
    }
    if (hops) hops.forEach(function (p, k) { var a = x(p[0]), b = x(p[1]), m = (a + b) / 2, hh = Math.min(90, Math.abs(b - a) * .6 + 20); h += '<path d="M' + a + ' ' + (Y - 4) + ' Q' + m + ' ' + (Y - hh) + ' ' + b + ' ' + (Y - 4) + '" class="nl-hp"/><path d="M' + b + ' ' + (Y - 4) + ' l' + (b > a ? -10 : 10) + ' -7 l0 9 Z" class="nl-hpa"/><text x="' + m + '" y="' + (Y - hh / 2 - 8) + '" class="nl-hl" text-anchor="middle">' + (k + 1) + '</text>' });
    marks.forEach(function (v) { h += '<circle cx="' + x(v) + '" cy="' + Y + '" r="9" class="nl-pt"/><text x="' + x(v) + '" y="' + (Y - 22) + '" class="nl-pl" text-anchor="middle">' + fmt(v) + '</text>' });
    svg.innerHTML = h;
    host.querySelectorAll('[data-r]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.r === cur.id ? 'true' : 'false') });
    host.querySelector('.nl-den').hidden = !cur.frac; api.bar('수직선 ' + cur.nm);
  }
  svg.addEventListener('pointerdown', function (e) {
    var r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * W / r.width, v = cur.a + (px - X0) / (X1 - X0) * (cur.b - cur.a), st = step();
    v = Math.round(v / st) * st; if (v < cur.a - 1e-9 || v > cur.b + 1e-9) return;
    var i = marks.findIndex(function (m) { return Math.abs(m - v) < st / 2 }); if (i >= 0) marks.splice(i, 1); else marks.push(v); draw();
  });
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.r) { cur = R.filter(function (r) { return r.id === b.dataset.r })[0]; marks = []; hops = null }
    if (b.dataset.a === 'clr') { marks = []; hops = null; msg.textContent = '' }
    if (b.dataset.a === 'hop') {
      var g = function (k) { return parseFloat(host.querySelector('[data-k="' + k + '"]').value) }, s0 = g('s'), j = g('j'), n = Math.round(g('n'));
      if (!(n >= 1 && n <= 40) || isNaN(s0) || isNaN(j) || j === 0) { msg.textContent = '시작 수, 한 번에 뛰는 수, 뛰는 횟수(1~40)를 써 주세요.'; return }
      var end = s0 + j * n; if (Math.min(s0, end) < cur.a - 1e-9 || Math.max(s0, end) > cur.b + 1e-9) { msg.textContent = '수직선 밖으로 나가요. 범위를 바꾸거나 수를 줄여 보세요.'; return }
      hops = []; for (var i = 0; i < n; i++) hops.push([s0 + j * i, s0 + j * (i + 1)]); marks = [s0, end];
      msg.innerHTML = fmt(s0) + '에서 ' + fmt(Math.abs(j)) + '씩 ' + n + '번 ' + (j > 0 ? '앞으로' : '뒤로') + ' 뛰면 <b>' + fmt(end) + '</b> → 식: ' + fmt(s0) + (j > 0 ? ' + ' : ' − ') + fmt(Math.abs(j)) + ' × ' + n + ' = ' + fmt(end);
    }
    draw();
  });
  host.querySelector('.nl-den select').onchange = function () { den = +this.value; marks = []; hops = null; draw() };
  draw();
};
