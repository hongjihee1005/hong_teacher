window.TOOL = function (host, api) {
  EST.game(host, api, { name: '시간 어림', round: function (st, done) {
    var T = [5, 10, 15, 20, 30, 45, 60][EST.rnd(0, 6)], t0 = 0;
    st.innerHTML = '<p class="es-q">시계를 보지 않고 <b>' + T + '초</b>가 지났다고 생각될 때 멈춤을 눌러요!</p><div class="es-clk"><span class="es-clk-t">?</span></div><div class="tl-row"><button type="button" class="tl-btn tl-go es-go">▶ 시작</button><button type="button" class="tl-btn es-stop" disabled>■ 멈춤</button></div>';
    st.querySelector('.es-go').onclick = function () { t0 = performance.now(); this.disabled = true; st.querySelector('.es-stop').disabled = false; st.querySelector('.es-clk').classList.add('es-run') };
    st.querySelector('.es-stop').onclick = function () { var s = Math.round((performance.now() - t0) / 100) / 10; this.disabled = true; st.querySelector('.es-clk').classList.remove('es-run'); st.querySelector('.es-clk-t').textContent = s + '초'; done(s, T, '💡 “하나 천, 둘 천 …”처럼 일정한 빠르기로 세면 1초에 가까워져요.', '초') };
  } });
};
