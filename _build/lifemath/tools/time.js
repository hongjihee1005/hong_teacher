window.TOOL = function (host, api) {
  var EV = [['🎬 영화', [80, 130]], ['⚽ 축구 경기', [90, 110]], ['🚌 버스 여행', [35, 150]], ['📚 도서관 공부', [40, 100]], ['🏊 수영 강습', [50, 70]], ['🎹 피아노 연습', [25, 55]]];
  function jo(w, a, b) { var s = String(w), c = s.charCodeAt(s.length - 1), m = s.match(/\d+$/), f; if (m) { var n = m[0], t = n.replace(/0+$/, ''); f = n.length > t.length || '013678'.indexOf(t.slice(-1)) >= 0 } else f = c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0; return s + (f ? a : b) } // 받침에 따라 조사(2026-10-29)
  function hm(m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 12 ? '오전 ' : '오후 ') + (h > 12 ? h - 12 : h) + '시' + (mm ? ' ' + mm + '분' : '') }
  function dur(m) { return ((Math.floor(m / 60) ? Math.floor(m / 60) + '시간 ' : '') + (m % 60 ? m % 60 + '분' : '')).trim() }
  LF.run(host, api, '생활 시간 계산', function (lv) {
    var e, s, d, end, t;
    if (lv === 0) { e = LF.pick(EV.filter(function (x) { return x[1][0] <= 50 })); s = LF.rnd(9, 15) * 60 + LF.pick([0, 30]); d = LF.rnd(2, 5) * 10; t = LF.rnd(0, 1) }   // 쉬움: 정각·30분 시작, 몇십 분
    else if (lv === 1) { e = LF.pick(EV); s = LF.rnd(9, 16) * 60 + LF.rnd(0, 11) * 5; d = LF.rnd(e[1][0] / 5, e[1][1] / 5) * 5; t = LF.rnd(0, 1) }
    else { e = LF.pick(EV); s = LF.rnd(9, 16) * 60 + LF.rnd(1, 59); d = LF.rnd(e[1][0], e[1][1] + 40); t = LF.rnd(0, 2) }   // 도전: 1분 단위, 시작 시각 거꾸로 구하기도
    end = s + d;
    if (t === 0) return { html: '<p class="lf-q">' + jo(e[0], '이', '가') + ' <b>' + hm(s) + '</b>에 시작해서 <b>' + dur(d) + '</b> 동안 해요. <b>끝나는 시각</b>은?</p>', inputs: [{ label: '', unit: '시' }, { label: '', unit: '분' }],
      ok: function (v) { var h = Math.floor(end / 60), H = h > 12 ? h - 12 : h; return [(v[0] === H || v[0] === h) && v[1] === end % 60, hm(s) + ' + ' + dur(d) + ' = <b>' + hm(end) + '</b>' + (h > 12 ? ' (오후 ' + H + '시 = ' + h + '시)' : ''), '분끼리 더해서 60분이 넘으면 1시간으로 올려요.'] } };
    if (t === 2) return { html: '<p class="lf-q">' + jo(e[0], '이', '가') + ' <b>' + dur(d) + '</b> 동안 하고 <b>' + hm(end) + '</b>에 끝났어요. <b>시작한 시각</b>은?</p>', inputs: [{ label: '', unit: '시' }, { label: '', unit: '분' }],
      ok: function (v) { var h = Math.floor(s / 60), H = h > 12 ? h - 12 : h; return [(v[0] === H || v[0] === h) && v[1] === s % 60, hm(end) + ' − ' + dur(d) + ' = <b>' + hm(s) + '</b>' + (h > 12 ? ' (오후 ' + H + '시 = ' + h + '시)' : ''), '끝난 시각에서 걸린 시간을 거꾸로 빼요. 분끼리 뺄 수 없으면 1시간을 60분으로 바꿔요.'] } };
    return { html: '<p class="lf-q">' + jo(e[0], '이', '가') + ' <b>' + hm(s) + '</b>에 시작해서 <b>' + hm(end) + '</b>에 끝났어요. <b>걸린 시간</b>은?</p>', inputs: [{ label: '', unit: '시간' }, { label: '', unit: '분' }],
      ok: function (v) { return [v[0] * 60 + v[1] === d && v[1] < 60, hm(end) + ' − ' + hm(s) + ' = <b>' + dur(d) + '</b>', '끝난 시각에서 시작한 시각을 빼요. 분끼리 뺄 수 없으면 1시간을 60분으로 바꿔요.'] } };
  }, 10, ['정각·30분에 시작, 몇십 분 동안', '5분 단위, 1~2시간쯤', '1분 단위 · 시작한 시각을 거꾸로 구하기도']);
};
