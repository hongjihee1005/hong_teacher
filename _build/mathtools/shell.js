/* 수학 교구실 공통: 크게 보기(전체 화면), 자료 목록 단추. 교구는 window.TOOL(host, api)를 만듦 */
(function () {
  'use strict';
  var st = document.getElementById('tlStage'), fb = document.getElementById('tlFull');
  var api = { bar: function (t) { document.getElementById('tlBarT').innerHTML = t || '' } };
  fb.onclick = function () {
    var on = document.fullscreenElement === st;
    if (on) document.exitFullscreen(); else if (st.requestFullscreen) st.requestFullscreen().catch(function () { st.classList.toggle('tl-max') }); else st.classList.toggle('tl-max');
  };
  document.addEventListener('fullscreenchange', function () { fb.textContent = document.fullscreenElement === st ? '✕ 작게 보기' : '⛶ 크게 보기'; window.dispatchEvent(new Event('resize')) });
  if (window.TOOL) window.TOOL(document.getElementById('tlHost'), api);
  var tl = document.querySelector('.tolist'); if (tl && (location.protocol === 'file:' || /github\.io$/.test(location.hostname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname))) tl.classList.add('on');
})();
