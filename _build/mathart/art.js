/* 수학 미술 공통: 캔버스 그리기 도구(색·굵기·지우기·되돌리기·PNG 저장·인쇄) */
var ART = (function () {
  var COLS = ['#2A221C', '#E5534B', '#E0861A', '#E0B21A', '#3E9A3E', '#2B8C9E', '#3B6FD6', '#7B4FB0', '#C2479A', '#8A6A4A'];
  function bar(host, st, on) {
    var h = '<div class="ar-tools"><span class="ar-cols">' + COLS.map(function (c) { return '<button type="button" class="ar-col" data-c="' + c + '" style="background:' + c + '" aria-label="색 ' + c + '"></button>' }).join('') + '</span><label>굵기 <input type="range" min="1" max="24" value="' + st.w + '" class="ar-w"></label><button type="button" class="tl-btn" data-a="undo">↶ 되돌리기</button><button type="button" class="tl-btn" data-a="clear">처음부터</button><button type="button" class="tl-btn" data-a="save">💾 그림 저장</button><button type="button" class="tl-btn" data-a="print">🖨️ 인쇄</button></div>';
    host.insertAdjacentHTML('afterbegin', h);
    function paint() { host.querySelectorAll('.ar-col').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.c === st.c ? 'true' : 'false') }) }
    host.querySelector('.ar-tools').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.c) { st.c = b.dataset.c; paint() } if (b.dataset.a) on(b.dataset.a) });
    host.querySelector('.ar-w').oninput = function () { st.w = +this.value };
    paint();
  }
  /* strokes: [{c, w, pts:[[x,y],…]}] 를 변환 함수 목록 T로 여러 번 그림 */
  function render(ctx, W, H, strokes, T) {
    ctx.clearRect(0, 0, W, H); ctx.lineCap = ctx.lineJoin = 'round';
    strokes.forEach(function (s) { T.forEach(function (f) { ctx.strokeStyle = s.c; ctx.lineWidth = s.w; ctx.beginPath(); s.pts.forEach(function (p, i) { var q = f(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]) }); if (s.pts.length === 1) { var q = f(s.pts[0]); ctx.lineTo(q[0] + .1, q[1]) } ctx.stroke() }) });
  }
  function pos(cv, e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height] }
  function drawable(cv, strokes, st, redraw, map) {
    var cur = null;
    cv.addEventListener('pointerdown', function (e) { cv.setPointerCapture(e.pointerId); var p = pos(cv, e); if (map) p = map(p); if (!p) return; cur = { c: st.c, w: st.w, pts: [p] }; strokes.push(cur); redraw() });
    cv.addEventListener('pointermove', function (e) { if (!cur) return; var p = pos(cv, e); if (map) p = map(p); if (!p) return; cur.pts.push(p); redraw() });
    cv.addEventListener('pointerup', function () { cur = null });
  }
  function save(cv, name) { var a = document.createElement('a'); a.download = name + '.png'; a.href = cv.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove() }
  function print(cv, title) {
    var s = document.getElementById('arSheet'); s.innerHTML = '<div class="ap-pg"><div class="ap-hd"><b>' + title + '</b><span>이름 ______________</span></div><img src="' + cv.toDataURL('image/png') + '" alt=""><p class="ap-ft">수학 미술 · 초등교사 홍지희</p></div>';
    document.documentElement.classList.add('ar-printing'); var off = function () { document.documentElement.classList.remove('ar-printing'); window.removeEventListener('afterprint', off) }; window.addEventListener('afterprint', off); setTimeout(function () { window.print() }, 150);
  }
  return { bar: bar, render: render, drawable: drawable, save: save, print: print, pos: pos, COLS: COLS };
})();
