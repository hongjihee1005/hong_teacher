window.TOOL = function (host, api) {
  var EV = [['🎬 영화', [80, 130]], ['⚽ 축구 경기', [90, 110]], ['🚌 버스 여행', [35, 150]], ['📚 도서관 공부', [40, 100]], ['🏊 수영 강습', [50, 70]], ['🎹 피아노 연습', [25, 55]]];
  function hm(m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 12 ? '오전 ' : '오후 ') + (h > 12 ? h - 12 : h) + '시' + (mm ? ' ' + mm + '분' : '') }
  function dur(m) { return ((Math.floor(m / 60) ? Math.floor(m / 60) + '시간 ' : '') + (m % 60 ? m % 60 + '분' : '')).trim() }
  LF.run(host, api, '생활 시간 계산', function () {
    var e = LF.pick(EV), s = LF.rnd(9, 16) * 60 + LF.rnd(0, 11) * 5, d = LF.rnd(e[1][0] / 5, e[1][1] / 5) * 5, end = s + d, t = LF.rnd(0, 1);
    if (t === 0) return { html: '<p class="lf-q">' + e[0] + '이(가) <b>' + hm(s) + '</b>에 시작해서 <b>' + dur(d) + '</b> 동안 해요. <b>끝나는 시각</b>은?</p>', inputs: [{ label: '', unit: '시' }, { label: '', unit: '분' }],
      ok: function (v) { var h = Math.floor(end / 60), H = h > 12 ? h - 12 : h; return [(v[0] === H || v[0] === h) && v[1] === end % 60, hm(s) + ' + ' + dur(d) + ' = <b>' + hm(end) + '</b>' + (h > 12 ? ' (오후 ' + H + '시 = ' + h + '시)' : ''), '분끼리 더해서 60분이 넘으면 1시간으로 올려요.'] } };
    return { html: '<p class="lf-q">' + e[0] + '이(가) <b>' + hm(s) + '</b>에 시작해서 <b>' + hm(end) + '</b>에 끝났어요. <b>걸린 시간</b>은?</p>', inputs: [{ label: '', unit: '시간' }, { label: '', unit: '분' }],
      ok: function (v) { return [v[0] * 60 + v[1] === d && v[1] < 60, hm(end) + ' − ' + hm(s) + ' = <b>' + dur(d) + '</b>', '끝난 시각에서 시작한 시각을 빼요. 분끼리 뺄 수 없으면 1시간을 60분으로 바꿔요.'] } };
  });
};
