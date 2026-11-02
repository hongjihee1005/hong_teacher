/* 지오보드: 못을 차례로 눌러 고무줄 도형 만들기 — 처음 못을 다시 누르면 닫힘, 넓이(칸) 보기 */
window.TOOL = function (host, api) {
  var COL = ['#E5534B', '#3B82D6', '#2EAA6A', '#E0A21A', '#7B4FB0', '#C2479A'], N = 6, bands = [], cur = null, area = false;
  host.innerHTML = '<svg class="tl-svg gb-svg" role="img" aria-label="지오보드"></svg><div class="tl-row"><label>못 <select class="gb-n">' + [5, 6, 7, 9, 11].map(function (n) { return '<option value="' + n + '"' + (n === N ? ' selected' : '') + '>' + n + '×' + n + '</option>' }).join('') + '</select></label><button type="button" class="tl-btn" data-a="undo">한 번 되돌리기</button><button type="button" class="tl-btn" data-a="area" aria-pressed="false">넓이·둘레 보기</button><button type="button" class="tl-btn" data-a="clr">모두 지우기</button></div><p class="tl-msg"></p>';
  var svg = host.querySelector('svg'), msg = host.querySelector('.tl-msg'), G = 60, P = 30;
  function polyArea(p) { var s = 0; for (var i = 0; i < p.length; i++) { var a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1] } return Math.abs(s) / 2 }
  function straight(p) { var c = 0, d = 0; for (var i = 0; i < p.length; i++) { var a = p[i], b = p[(i + 1) % p.length]; if (a[0] === b[0] || a[1] === b[1]) c += Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); else d++ } return [c, d] }
  function draw() {
    var W = (N - 1) * G + 2 * P; svg.setAttribute('viewBox', '0 0 ' + W + ' ' + W); svg.style.maxWidth = Math.min(620, W * 1.2) + 'px';
    var h = '<rect x="4" y="4" width="' + (W - 8) + '" height="' + (W - 8) + '" rx="18" class="gb-bd"/>';
    var lab = '';
    bands.concat(cur ? [cur] : []).forEach(function (b, i) {
      var pts = b.p.map(function (q) { return (P + q[0] * G) + ',' + (P + q[1] * G) }).join(' ');
      h += b.closed ? '<polygon points="' + pts + '" class="gb-band" style="--c:' + b.c + '"/>' : '<polyline points="' + pts + '" class="gb-band gb-open" style="--c:' + b.c + '"/>';
      if (b.closed && area) { var cx = 0, cy = 0; b.p.forEach(function (q) { cx += q[0]; cy += q[1] }); cx = P + cx / b.p.length * G; cy = P + cy / b.p.length * G; var a = polyArea(b.p), sd = straight(b.p); lab += '<text x="' + cx + '" y="' + cy + '" class="gb-a" text-anchor="middle">넓이 ' + a + '칸</text>' + (sd[1] ? '' : '<text x="' + cx + '" y="' + (cy + 22) + '" class="gb-a gb-a2" text-anchor="middle">둘레 ' + sd[0] + '칸</text>') }
    });
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) h += '<circle cx="' + (P + x * G) + '" cy="' + (P + y * G) + '" r="9" class="gb-peg' + (cur && cur.p[0][0] === x && cur.p[0][1] === y ? ' gb-first' : '') + '" data-x="' + x + '" data-y="' + y + '"/>';
    svg.innerHTML = h + lab; api.bar('지오보드 · 고무줄 ' + bands.length + '개');
  }
  svg.addEventListener('pointerdown', function (e) {
    var c = e.target.closest('.gb-peg'); if (!c) return; var x = +c.dataset.x, y = +c.dataset.y;
    if (!cur) { cur = { p: [[x, y]], c: COL[bands.length % COL.length] }; msg.textContent = '다음 못을 눌러요. 처음 못(크게 보이는 못)을 다시 누르면 도형이 닫혀요.' }
    else if (cur.p[0][0] === x && cur.p[0][1] === y) {
      if (cur.p.length < 3) { msg.textContent = '도형이 되려면 못이 3개 넘게 필요해요.'; return }
      if (polyArea(cur.p) === 0) { msg.textContent = '한 줄 위에만 있어서 도형이 안 돼요.'; return }
      cur.closed = true; bands.push(cur); cur = null; msg.textContent = '도형 완성! 새 못을 누르면 다른 색 고무줄로 또 만들 수 있어요.';
    } else { var l = cur.p[cur.p.length - 1]; if (l[0] === x && l[1] === y) return; cur.p.push([x, y]) }
    draw();
  });
  host.querySelector('.gb-n').onchange = function () { N = +this.value; bands = []; cur = null; draw() };
  host.querySelector('.tl-row').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'undo') { if (cur) { cur.p.pop(); if (!cur.p.length) cur = null } else if (bands.length) { cur = bands.pop(); cur.closed = false } }
    if (b.dataset.a === 'area') { area = !area; b.setAttribute('aria-pressed', area ? 'true' : 'false') }
    if (b.dataset.a === 'clr') { bands = []; cur = null }
    draw();
  });
  draw(); msg.textContent = '못을 눌러 고무줄을 걸어 보세요.';
};
