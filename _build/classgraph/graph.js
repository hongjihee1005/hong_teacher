/* 우리 반 그래프 › 그래프 만들기: 표를 넣으면 그림그래프·막대그래프·꺾은선그래프·띠그래프·원그래프·평균 */
window.TOOL = function (host, api) {
  var COL = ['#E5534B', '#E0861A', '#D9B21A', '#3E9A3E', '#2B8C9E', '#3B6FD6', '#7B4FB0', '#C2479A', '#8A6A4A', '#5C8A1E', '#1F6F8B', '#B8432F'];
  var TYPES = [['table', '표'], ['pic', '그림그래프'], ['bar', '막대그래프'], ['hbar', '가로 막대그래프'], ['line', '꺾은선그래프'], ['strip', '띠그래프'], ['pie', '원그래프']];
  var TIP = { table: '표: 조사한 수를 한눈에 정리해요. 합계도 함께 써요.', pic: '그림그래프: 큰 그림과 작은 그림으로 수를 나타내요. 큰 그림이 몇을 나타내는지 꼭 살펴요.',
    bar: '막대그래프: 막대의 길이로 수를 견줘요. 세로 눈금 한 칸이 몇인지 먼저 읽어요.', hbar: '가로 막대그래프: 항목 이름이 길 때 보기 좋아요.',
    line: '꺾은선그래프: 시간에 따라 변하는 모습(기온·키 등)을 나타낼 때 알맞아요.', strip: '띠그래프: 전체를 100%로 보고 각 항목이 차지하는 비율을 띠로 나타내요.', pie: '원그래프: 전체를 원으로 보고 각 항목의 비율을 부채꼴로 나타내요.' };
  var D = CG.load() || JSON.parse(JSON.stringify(CG.SAMPLES[0])), type = D.type || 'bar', showV = true, big = 10;
  if (/from-survey/.test(location.hash)) type = 'bar';
  host.innerHTML = '<div class="cg-wrap"><div class="cg-edit"><label class="cg-lab">제목 <input class="cg-t" maxlength="40"></label><label class="cg-lab cg-u">단위 <input class="cg-un" maxlength="6"></label>'
    + '<table class="cg-tbl"><thead><tr><th>항목</th><th>수</th><th></th></tr></thead><tbody></tbody></table>'
    + '<div class="tl-row"><button type="button" class="tl-btn" data-a="add">+ 항목 더하기</button><label>예시 <select class="cg-smp"><option value="">고르기</option>' + CG.SAMPLES.map(function (s, i) { return '<option value="' + i + '">' + s.t + '</option>' }).join('') + '</select></label></div></div>'
    + '<div class="cg-view"><div class="tl-row cg-types">' + TYPES.map(function (t) { return '<button type="button" class="tl-btn" data-ty="' + t[0] + '">' + t[1] + '</button>' }).join('') + '</div><p class="cg-tip"></p><div class="cg-out" id="cgOut"></div>'
    + '<div class="tl-row"><button type="button" class="tl-btn" data-a="v" aria-pressed="true">수 보이기</button><label class="cg-bigl">그림 하나가 <select class="cg-big"><option value="10">10</option><option value="5">5</option><option value="2">2</option></select></label><button type="button" class="tl-btn" data-a="print">🖨️ 그래프 인쇄</button></div><div class="cg-stat"></div></div></div>';
  var tb = host.querySelector('tbody');
  function rows() { return D.rows.filter(function (r) { return r[0] !== '' || r[1] !== '' }) }
  function vals() { return rows().map(function (r) { return Math.max(0, +r[1] || 0) }) }
  function fmt(x) { return Math.round(x * 10) / 10 }
  function editor() {
    host.querySelector('.cg-t').value = D.t; host.querySelector('.cg-un').value = D.u;
    tb.innerHTML = D.rows.map(function (r, i) { return '<tr><td><input data-i="' + i + '" data-c="0" value="' + String(r[0]).replace(/"/g, '&quot;') + '" maxlength="12" aria-label="항목 이름"></td><td><input data-i="' + i + '" data-c="1" value="' + r[1] + '" inputmode="decimal" maxlength="6" class="cg-num" aria-label="수"></td><td><button type="button" class="cg-del" data-del="' + i + '" aria-label="이 항목 빼기">✕</button></td></tr>' }).join('');
  }
  function nice(max) { var c = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]; for (var i = 0; i < c.length; i++) if (max / c[i] <= 10) return c[i]; return Math.pow(10, Math.ceil(Math.log10(max / 10))) }
  function pct(v) {   // 반올림해도 합이 100이 되게(나머지 큰 차례로 1씩)
    var s = v.reduce(function (a, b) { return a + b }, 0); if (!s) return v.map(function () { return 0 });
    var raw = v.map(function (x) { return x / s * 100 }), fl = raw.map(Math.floor), left = 100 - fl.reduce(function (a, b) { return a + b }, 0);
    raw.map(function (x, i) { return [x - fl[i], i] }).sort(function (a, b) { return b[0] - a[0] }).slice(0, left).forEach(function (p) { fl[p[1]]++ }); return fl;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function axes(W, H, L, B, T, max, step, unit, horiz) {
    var h = '', n = Math.ceil(max / step) || 1;
    for (var i = 0; i <= n; i++) {
      var v = i * step;
      if (!horiz) { var y = H - B - (H - B - T) * i / n; h += '<line x1="' + L + '" y1="' + y + '" x2="' + (W - 14) + '" y2="' + y + '" class="cg-grid"/><text x="' + (L - 8) + '" y="' + (y + 5) + '" class="cg-ax" text-anchor="end">' + v + '</text>' }
      else { var x = L + (W - L - 30) * i / n; h += '<line x1="' + x + '" y1="' + T + '" x2="' + x + '" y2="' + (H - B) + '" class="cg-grid"/><text x="' + x + '" y="' + (H - B + 20) + '" class="cg-ax" text-anchor="middle">' + v + '</text>' }
    }
    h += horiz ? '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '" class="cg-axl"/><line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - 30) + '" y2="' + (H - B) + '" class="cg-axl"/><text x="' + (W - 26) + '" y="' + (H - B + 20) + '" class="cg-ax">(' + esc(unit) + ')</text>'
      : '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '" class="cg-axl"/><line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - 14) + '" y2="' + (H - B) + '" class="cg-axl"/><text x="' + (L - 8) + '" y="' + (T - 12) + '" class="cg-ax" text-anchor="end">(' + esc(unit) + ')</text>';
    return { h: h, n: n };
  }
  function graph() {
    var R = rows(), V = vals(), N = R.length, max = Math.max.apply(null, V.concat([1])), step = nice(max), title = '<h3 class="cg-gt">' + esc(D.t) + '</h3>';
    if (!N) return '<p class="tl-msg">왼쪽 표에 항목과 수를 써 주세요.</p>';
    if (type === 'table') return title + '<table class="cg-otbl"><tr><th>항목</th>' + R.map(function (r) { return '<th>' + esc(r[0]) + '</th>' }).join('') + '<th>합계</th></tr><tr><th>' + esc(D.u === '명' ? '학생 수(명)' : '수(' + D.u + ')') + '</th>' + V.map(function (v) { return '<td>' + v + '</td>' }).join('') + '<td>' + fmt(V.reduce(function (a, b) { return a + b }, 0)) + '</td></tr></table>';
    if (type === 'pic') {
      var ico = function (k, c) { return '<svg class="cg-ico ' + k + '" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="' + (k === 'cg-b' ? 9 : 5.5) + '" fill="' + c + '"/></svg>' };
      return title + '<table class="cg-pic"><tr><th>항목</th><th>' + esc(D.u === '명' ? '학생 수' : '수') + '</th></tr>' + R.map(function (r, i) { var v = V[i], b = Math.floor(v / big), s = Math.round(v - b * big), h = ''; for (var k = 0; k < b; k++) h += ico('cg-b', COL[i % COL.length]); for (k = 0; k < s; k++) h += ico('cg-s', COL[i % COL.length]); return '<tr><th>' + esc(r[0]) + '</th><td>' + h + (showV ? '<span class="cg-pv">' + v + '</span>' : '') + '</td></tr>' }).join('') + '</table><p class="cg-leg">' + ico('cg-b', '#555') + ' ' + big + D.u + ' &nbsp; ' + ico('cg-s', '#555') + ' 1' + D.u + '</p>' + (V.some(function (v) { return v % 1 }) ? '<p class="tl-msg">그림그래프는 자연수 자료에 알맞아요.</p>' : '');
    }
    if (type === 'bar' || type === 'line') {
      var W = 760, H = 420, L = 70, B = 50, T = 40, a = axes(W, H, L, B, T, max, step, D.u), top = a.n * step, cw = (W - 14 - L) / N, h = a.h, pts = [];
      R.forEach(function (r, i) {
        var v = V[i], x = L + cw * (i + .5), y = H - B - (H - B - T) * v / top;
        if (type === 'bar') { var bw = Math.min(70, cw * .6); h += '<rect x="' + (x - bw / 2) + '" y="' + y + '" width="' + bw + '" height="' + (H - B - y) + '" fill="' + COL[i % COL.length] + '" class="cg-bar"/>' }
        else pts.push([x, y]);
        h += '<text x="' + x + '" y="' + (H - B + 24) + '" class="cg-cat" text-anchor="middle">' + esc(r[0]) + '</text>';
        if (showV) h += '<text x="' + x + '" y="' + (y - 10) + '" class="cg-val" text-anchor="middle">' + v + '</text>';
      });
      if (type === 'line') h += '<polyline points="' + pts.map(function (p) { return p.join(',') }).join(' ') + '" class="cg-line"/>' + pts.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" class="cg-dot"/>' }).join('');
      return title + '<svg class="tl-svg cg-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(D.t) + '">' + h + '</svg>';
    }
    if (type === 'hbar') {
      var W2 = 760, rh = 46, T2 = 20, B2 = 40, H2 = T2 + B2 + N * rh, L2 = 130, a2 = axes(W2, H2, L2, B2, T2, max, step, D.u, true), top2 = a2.n * step, h2 = a2.h;
      R.forEach(function (r, i) { var v = V[i], y = T2 + i * rh + rh * .2, w = (W2 - L2 - 30) * v / top2; h2 += '<rect x="' + L2 + '" y="' + y + '" width="' + w + '" height="' + rh * .6 + '" fill="' + COL[i % COL.length] + '" class="cg-bar"/><text x="' + (L2 - 10) + '" y="' + (y + rh * .42) + '" class="cg-cat" text-anchor="end">' + esc(r[0]) + '</text>' + (showV ? '<text x="' + (L2 + w + 8) + '" y="' + (y + rh * .42) + '" class="cg-val">' + v + '</text>' : '') });
      return title + '<svg class="tl-svg cg-svg" viewBox="0 0 ' + W2 + ' ' + H2 + '" role="img" aria-label="' + esc(D.t) + '">' + h2 + '</svg>';
    }
    var P = pct(V), sum = V.reduce(function (a, b) { return a + b }, 0);
    if (!sum) return '<p class="tl-msg">수가 모두 0이에요.</p>';
    if (type === 'strip') {
      var x0 = 20, hs = '';
      for (var t = 0; t <= 10; t++) hs += '<line x1="' + (20 + t * 72) + '" y1="56" x2="' + (20 + t * 72) + '" y2="' + (t % 5 ? 64 : 70) + '" class="cg-axl"/><text x="' + (20 + t * 72) + '" y="88" class="cg-ax" text-anchor="middle">' + t * 10 + '</text>';
      R.forEach(function (r, i) { var w = 720 * V[i] / sum; hs += '<rect x="' + x0 + '" y="100" width="' + w + '" height="70" fill="' + COL[i % COL.length] + '" class="cg-seg"/>' + (w > 34 ? '<text x="' + (x0 + w / 2) + '" y="130" class="cg-in" text-anchor="middle">' + esc(r[0]) + '</text>' + (showV ? '<text x="' + (x0 + w / 2) + '" y="154" class="cg-in" text-anchor="middle">' + P[i] + '%</text>' : '') : ''); x0 += w });
      return title + '<svg class="tl-svg cg-svg" viewBox="0 0 760 200" role="img" aria-label="' + esc(D.t) + ' 띠그래프"><text x="20" y="40" class="cg-ax">(%)</text>' + hs + '</svg>' + legend(R, P);
    }
    var cx = 230, cy = 210, rr = 180, ang = -Math.PI / 2, hp = '';
    R.forEach(function (r, i) {
      var f = V[i] / sum, a1 = ang + f * Math.PI * 2, large = f > .5 ? 1 : 0;
      if (f >= 0.9999) hp += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="' + COL[i % COL.length] + '" class="cg-seg"/>';
      else if (f > 0) hp += '<path d="M' + cx + ' ' + cy + ' L' + (cx + rr * Math.cos(ang)) + ' ' + (cy + rr * Math.sin(ang)) + ' A' + rr + ' ' + rr + ' 0 ' + large + ' 1 ' + (cx + rr * Math.cos(a1)) + ' ' + (cy + rr * Math.sin(a1)) + ' Z" fill="' + COL[i % COL.length] + '" class="cg-seg"/>';
      var m = (ang + a1) / 2; if (f > .06) hp += '<text x="' + (cx + rr * .62 * Math.cos(m)) + '" y="' + (cy + rr * .62 * Math.sin(m)) + '" class="cg-in" text-anchor="middle">' + esc(r[0]) + '</text>' + (showV ? '<text x="' + (cx + rr * .62 * Math.cos(m)) + '" y="' + (cy + rr * .62 * Math.sin(m) + 22) + '" class="cg-in" text-anchor="middle">' + P[i] + '%</text>' : '');
      ang = a1;
    });
    for (var k = 0; k < 20; k++) { var q = -Math.PI / 2 + k * Math.PI / 10; hp += '<line x1="' + (cx + rr * Math.cos(q)) + '" y1="' + (cy + rr * Math.sin(q)) + '" x2="' + (cx + (rr + (k % 5 ? 7 : 12)) * Math.cos(q)) + '" y2="' + (cy + (rr + (k % 5 ? 7 : 12)) * Math.sin(q)) + '" class="cg-axl"/>' }
    return title + '<div class="cg-pie"><svg class="tl-svg cg-svg cg-psvg" viewBox="0 0 460 420" role="img" aria-label="' + esc(D.t) + ' 원그래프">' + hp + '</svg>' + legend(R, P) + '</div>';
  }
  function legend(R, P) { return '<ul class="cg-legend">' + R.map(function (r, i) { return '<li><i style="background:' + COL[i % COL.length] + '"></i>' + esc(r[0]) + ' <b>' + P[i] + '%</b></li>' }).join('') + '</ul>' }
  function stat() {
    var R = rows(), V = vals(); if (!R.length) return '';
    var s = V.reduce(function (a, b) { return a + b }, 0), mx = Math.max.apply(null, V), mn = Math.min.apply(null, V), avg = s / V.length, ex = Math.abs(avg - Math.round(avg * 10) / 10) < 1e-9;
    var who = function (v) { return R.filter(function (r, i) { return V[i] === v }).map(function (r) { return esc(r[0]) }).join(', ') };
    return '<span>합계 <b>' + fmt(s) + D.u + '</b></span><span>가장 많은 것 <b>' + who(mx) + '</b> (' + mx + ')</span><span>가장 적은 것 <b>' + who(mn) + '</b> (' + mn + ')</span><span>평균 <b>' + (ex ? '' : '약 ') + fmt(avg) + D.u + '</b> <small>= ' + fmt(s) + ' ÷ ' + V.length + '</small></span>';
  }
  function draw(keepEditor) {
    if (!keepEditor) editor();
    host.querySelector('.cg-out').innerHTML = graph(); host.querySelector('.cg-stat').innerHTML = stat();
    host.querySelector('.cg-tip').textContent = TIP[type];
    host.querySelectorAll('[data-ty]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.ty === type ? 'true' : 'false') });
    host.querySelector('.cg-bigl').hidden = type !== 'pic';
    D.type = type; CG.save(D); api.bar('그래프 만들기');
  }
  host.addEventListener('input', function (e) {
    var t = e.target;
    if (t.classList.contains('cg-t')) D.t = t.value; else if (t.classList.contains('cg-un')) D.u = t.value;
    else if (t.dataset.i != null) { var v = t.value; if (t.dataset.c === '1') { v = v.replace(/[^0-9.]/g, ''); if (v !== t.value) t.value = v } D.rows[+t.dataset.i][+t.dataset.c] = v }
    draw(true);
  });
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.ty) { type = b.dataset.ty; draw(true) }
    else if (b.dataset.del != null) { D.rows.splice(+b.dataset.del, 1); draw() }
    else if (b.dataset.a === 'add') { if (D.rows.length < 12) D.rows.push(['', '']); draw(); var ins = tb.querySelectorAll('input[data-c="0"]'); ins[ins.length - 1].focus() }
    else if (b.dataset.a === 'v') { showV = !showV; b.setAttribute('aria-pressed', showV ? 'true' : 'false'); draw(true) }
    else if (b.dataset.a === 'print') { document.documentElement.classList.add('cg-printing'); setTimeout(function () { window.print(); setTimeout(function () { document.documentElement.classList.remove('cg-printing') }, 500) }, 60) }
  });
  host.querySelector('.cg-smp').onchange = function () { if (this.value === '') return; var s = CG.SAMPLES[+this.value]; D = JSON.parse(JSON.stringify(s)); if (+this.value === 4) type = 'line'; this.value = ''; draw() };
  host.querySelector('.cg-big').onchange = function () { big = +this.value; draw(true) };
  draw();
};
