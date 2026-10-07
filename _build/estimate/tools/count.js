window.TOOL = function (host, api) {
  var sec = 3;
  EST.game(host, api, { name: '개수 어림', round: function (st, done) {
    var n = EST.rnd(15, 160), W = 640, H = 320, pts = [], tries = 0;
    while (pts.length < n && tries < 20000) { tries++; var p = [EST.rnd(12, W - 12), EST.rnd(12, H - 12)]; if (pts.every(function (q) { return Math.hypot(q[0] - p[0], q[1] - p[1]) > 15 })) pts.push(p) } n = pts.length;
    st.innerHTML = '<p class="es-q">점이 <b>' + sec + '초</b> 동안만 보여요. 모두 몇 개일까요? <button type="button" class="tl-btn tl-go es-show">보기 시작</button></p><svg class="tl-svg es-svg es-dots" viewBox="0 0 ' + W + ' ' + H + '"><rect width="' + W + '" height="' + H + '" rx="14" fill="#F6F1EA"/><g class="es-g" style="visibility:hidden">' + pts.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#3B6FD6"/>' }).join('') + '</g><g class="es-ov"></g></svg>';
    st.querySelector('.es-show').onclick = function () { this.remove(); var g = st.querySelector('.es-g'); g.style.visibility = 'visible'; setTimeout(function () { g.style.visibility = 'hidden'; EST.ask(st, '점의 수', function (v) { g.style.display = 'none'; var srt = pts.slice().sort(function (a, b) { return a[0] - b[0] }), o = ''; srt.forEach(function (p, i) { var gi = Math.floor(i / 10); o += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="' + (gi % 2 ? '#E0861A' : '#3B6FD6') + '"/>'; if (i % 10 === 9 || i === srt.length - 1) o += '<text x="' + p[0] + '" y="' + (p[1] - 9) + '" font-size="12" font-weight="700" fill="#C8402F" text-anchor="middle">' + (i + 1) + '</text>' }); st.querySelector('.es-ov').innerHTML = o; done(v, n, '왼쪽부터 10개씩 파랑·주황으로 번갈아 칠해 보였어요. 💡 작은 묶음(예: 10개쯤)을 하나 눈으로 정하고, 그런 묶음이 몇 개쯤 있는지 세면 빨라요.', '개') }) }, sec * 1000) };
  } });
};
