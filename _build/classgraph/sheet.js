/* 우리 반 그래프 › 빈 그래프 활동지: 표 + 막대(또는 꺾은선)·그림그래프·띠·원그래프 빈 칸을 인쇄 */
window.TOOL = function (host, api) {
  var K = 'bar', cols = 5, maxv = 10, useData = false;
  host.innerHTML = '<div class="tl-row"><button type="button" class="tl-btn" data-k="bar">막대그래프</button><button type="button" class="tl-btn" data-k="line">꺾은선그래프</button><button type="button" class="tl-btn" data-k="pic">그림그래프</button><button type="button" class="tl-btn" data-k="circle">띠·원그래프</button></div>'
    + '<div class="tl-row"><label>항목 수 <select class="sh-c">' + [3, 4, 5, 6, 7, 8].map(function (n) { return '<option' + (n === 5 ? ' selected' : '') + '>' + n + '</option>' }).join('') + '</select></label><label>세로 눈금 <select class="sh-m">' + [5, 10, 15, 20, 30].map(function (n) { return '<option' + (n === 10 ? ' selected' : '') + '>' + n + '</option>' }).join('') + '</select>칸</label><label><input type="checkbox" class="sh-d"> ‘그래프 만들기’의 자료 넣기</label><button type="button" class="tl-btn tl-go" data-a="print">🖨️ 활동지 인쇄</button></div>'
    + '<div class="sh-prev" id="shSheet"></div>';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function sheet() {
    var D = useData ? CG.load() : null, R = D ? D.rows.filter(function (r) { return r[0] !== '' }) : null, n = R ? R.length : cols, nm = function (i) { return R ? esc(R[i][0]) : '' }, vv = function (i) { return R ? esc(R[i][1]) : '' };
    var title = { bar: '막대그래프로 나타내기', line: '꺾은선그래프로 나타내기', pic: '그림그래프로 나타내기', circle: '띠그래프와 원그래프로 나타내기' }[K];
    var h = '<div class="sh-pg"><div class="sh-hd"><b>' + title + '</b><span>____학년 ____반 ____번 이름 ____________</span></div><p class="sh-line">조사한 것(제목): <span class="sh-fill">' + (D ? esc(D.t) : '') + '</span></p>';
    h += '<p class="sh-cap">① 표로 정리해요</p><table class="sh-tbl"><tr><th>항목</th>' + Array.from({ length: n }, function (_, i) { return '<td>' + nm(i) + '</td>' }).join('') + '<td>합계</td></tr><tr><th>수' + (D ? '(' + esc(D.u) + ')' : '') + '</th>' + Array.from({ length: n }, function (_, i) { return '<td>' + vv(i) + '</td>' }).join('') + '<td></td></tr>' + (K === 'circle' ? '<tr><th>백분율(%)</th>' + Array.from({ length: n + 1 }, function () { return '<td></td>' }).join('') + '</tr>' : '') + '</table>';
    if (K === 'bar' || K === 'line') {
      var g = '<div class="sh-grid" style="--c:' + n + ';--r:' + maxv + '">';
      for (var r = 0; r < maxv; r++) for (var c = 0; c < n; c++) g += '<i></i>';
      g += '</div>';
      var xl = '<div class="sh-xl" style="--c:' + n + '">' + Array.from({ length: n }, function (_, i) { return '<span>' + nm(i) + '</span>' }).join('') + '</div>';
      h += '<p class="sh-cap">② ' + (K === 'bar' ? '막대그래프' : '꺾은선그래프') + '로 나타내요 <small>(세로 눈금 한 칸의 크기: ______ )</small></p><div class="sh-gwrap"><div class="sh-yl">(' + (D ? esc(D.u) : '　　') + ')</div>' + g + '</div>' + xl;
    } else if (K === 'pic') {
      h += '<p class="sh-cap">② 그림그래프로 나타내요 <small>(큰 그림 = ______ , 작은 그림 = ______ )</small></p><table class="sh-ptbl">' + Array.from({ length: n }, function (_, i) { return '<tr><th>' + nm(i) + '</th><td></td></tr>' }).join('') + '</table>';
    } else {
      var s = '<svg viewBox="0 0 640 110" class="sh-strip"><rect x="20" y="40" width="600" height="56" fill="none" stroke="#000" stroke-width="2"/>';
      for (var t = 1; t < 20; t++) s += '<line x1="' + (20 + t * 30) + '" y1="' + (t % 2 ? 84 : 40) + '" x2="' + (20 + t * 30) + '" y2="96" stroke="#888" stroke-width="1"/>';
      for (t = 0; t <= 10; t++) s += '<text x="' + (20 + t * 60) + '" y="30" font-size="14" text-anchor="middle">' + t * 10 + '</text>';
      s += '</svg>';
      var c = '<svg viewBox="0 0 320 320" class="sh-circle"><circle cx="160" cy="160" r="130" fill="none" stroke="#000" stroke-width="2"/>';
      for (t = 0; t < 20; t++) { var q = -Math.PI / 2 + t * Math.PI / 10; c += '<line x1="' + (160 + 130 * Math.cos(q)) + '" y1="' + (160 + 130 * Math.sin(q)) + '" x2="' + (160 + (t % 2 ? 140 : 148) * Math.cos(q)) + '" y2="' + (160 + (t % 2 ? 140 : 148) * Math.sin(q)) + '" stroke="#000" stroke-width="1.5"/>'; if (t % 2 === 0) c += '<text x="' + (160 + 156 * Math.cos(q)) + '" y="' + (165 + 156 * Math.sin(q)) + '" font-size="11" text-anchor="middle">' + t * 5 + '</text>' }
      c += '<circle cx="160" cy="160" r="2.5"/></svg>';
      h += '<p class="sh-cap">② 띠그래프로 나타내요</p>' + s + '<p class="sh-cap">③ 원그래프로 나타내요</p>' + c;
    }
    h += '<div class="sh-wr"><p class="sh-cap">' + (K === 'circle' ? '④' : '③') + ' 그래프를 보고 알 수 있는 것을 써요</p><div class="sh-lines"></div></div></div>';
    return h;
  }
  function draw() {
    host.querySelector('#shSheet').innerHTML = sheet();
    host.querySelectorAll('[data-k]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.k === K ? 'true' : 'false') });
    api.bar('빈 그래프 활동지');
  }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.k) { K = b.dataset.k; draw() }
    if (b.dataset.a === 'print') { document.documentElement.classList.add('sh-printing'); setTimeout(function () { window.print(); setTimeout(function () { document.documentElement.classList.remove('sh-printing') }, 500) }, 60) }
  });
  host.querySelector('.sh-c').onchange = function () { cols = +this.value; draw() };
  host.querySelector('.sh-m').onchange = function () { maxv = +this.value; draw() };
  host.querySelector('.sh-d').onchange = function () { useData = this.checked && !!CG.load(); draw() };
  draw();
};
