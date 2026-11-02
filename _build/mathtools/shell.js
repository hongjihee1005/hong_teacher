/* 수학 교구실 공통: 크게 보기(전체 화면), 자료 목록 단추. 교구는 window.TOOL(host, api)를 만듦 */
(function () {
  'use strict';
  var st = document.getElementById('tlStage'), fb = document.getElementById('tlFull');
  var api = { bar: function (t) { document.getElementById('tlBarT').innerHTML = t || '' } };
  fb.onclick = function () {
    var on = document.fullscreenElement === st;
    if (on) document.exitFullscreen(); else if (st.requestFullscreen) st.requestFullscreen().catch(function () { st.classList.toggle('tl-max') }); else st.classList.toggle('tl-max');
  };
  /* 크게 보기: 판 안의 교구를 화면에 맞게 비율대로 키움(2026-10-30 선생님 요청) — 원래 크기를 재고 zoom, 폭은 거꾸로 줄여 가로로 넘치지 않게 */
  var host = document.getElementById('tlHost'), bar = st.querySelector('.tl-bar'), fitting = false;
  function big() { return document.fullscreenElement === st || st.classList.contains('tl-max') }
  function fit() {
    if (fitting) return; fitting = true;
    host.style.zoom = ''; host.style.width = '';
    if (big()) {
      var cs = getComputedStyle(st), aw = st.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
        ah = st.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (bar ? bar.offsetHeight + 8 : 0), nw = 0;
      /* 실제로 보이는 것(그림·글·단추)의 범위를 재서 그만큼만 키움 */
      var L = 1e9, T = 1e9, R = -1e9, B = -1e9;
      [].forEach.call(host.querySelectorAll('svg,canvas,img,button,input,select,textarea,table,label,b,strong,span'), function (c) {
        if (c.closest('svg') && c.tagName.toLowerCase() !== 'svg') return;
        var r = c.getBoundingClientRect(); if (!r.width || !r.height) return;
        if (r.left < L) L = r.left; if (r.top < T) T = r.top; if (r.right > R) R = r.right; if (r.bottom > B) B = r.bottom });
      if (R > L) {
        var z = Math.min(aw / (R - L + 32), ah / (B - T + 72));
        z = Math.max(1, Math.min(z, 2.4));
        if (z > 1.04) host.style.zoom = z;
      }
    }
    fitting = false;
  }
  new MutationObserver(function () { setTimeout(fit, 0) }).observe(st, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('fullscreenchange', function () { fb.textContent = big() ? '✕ 작게 보기' : '⛶ 크게 보기'; window.dispatchEvent(new Event('resize')); setTimeout(fit, 60) });
  window.addEventListener('resize', function () { if (big()) setTimeout(fit, 30) });
  if (window.TOOL) window.TOOL(document.getElementById('tlHost'), api);
  var tl = document.querySelector('.tolist'); if (tl && (location.protocol === 'file:' || /github\.io$/.test(location.hostname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname))) tl.classList.add('on');
})();
