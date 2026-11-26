window.TOOL = function (host, api) {
  EST.game(host, api, { name: '시간 어림', lv: ['5·10·15초, 처음 3초는 시계가 1·2·3 세어 줘요', '5초~1분', '30초~1분 30초, 처음부터 아무 도움 없이'], round: function (st, done, lv) {
    var L = [[5, 10, 15], [5, 10, 15, 20, 30, 45, 60], [30, 45, 60, 75, 90]][lv], T = L[EST.rnd(0, L.length - 1)], t0 = 0, tm = [];
    st.innerHTML = '<p class="es-q">시계를 보지 않고 <b>' + T + '초</b>가 지났다고 생각될 때 멈춤을 눌러요!</p><div class="es-clk"><span class="es-clk-t">?</span></div><div class="tl-row"><button type="button" class="tl-btn tl-go es-go">▶ 시작</button><button type="button" class="tl-btn es-stop" disabled>■ 멈춤</button></div>';
    st.querySelector('.es-go').onclick = function () { t0 = performance.now(); this.disabled = true; st.querySelector('.es-stop').disabled = false; st.querySelector('.es-clk').classList.add('es-run'); if (lv === 0) { var ct = st.querySelector('.es-clk-t'); [1, 2, 3].forEach(function (i) { tm.push(setTimeout(function () { ct.textContent = i }, i * 1000)) }); tm.push(setTimeout(function () { ct.textContent = '?' }, 3600)) } };
    st.querySelector('.es-stop').onclick = function () { tm.forEach(clearTimeout); var s = Math.round((performance.now() - t0) / 100) / 10; this.disabled = true; st.querySelector('.es-clk').classList.remove('es-run'); st.querySelector('.es-clk-t').textContent = s + '초'; done(s, T, '💡 “하나 천, 둘 천 …”처럼 일정한 빠르기로 세면 1초에 가까워져요.', '초') };
  } });
};
