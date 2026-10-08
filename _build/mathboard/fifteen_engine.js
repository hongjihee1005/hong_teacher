/* 15 만들기 규칙·인공지능. 1~9 수 카드를 번갈아 하나씩 가져가고, 내 카드 가운데 세 장의 합이 15가 되면 승리(9장을 다 가져가면 비김).
   사실은 마방진 위의 틱택토와 같은 게임. 수 = 가져갈 수(1~9). makeFifteen()은 화면과 워커 둘 다에서 씀 */
function makeFifteen() {
  var T = []; for (var a = 1; a <= 9; a++) for (var b = a + 1; b <= 9; b++) { var c = 15 - a - b; if (c > b && c <= 9) T.push([a, b, c]) }
  function init() { return { o: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], turn: 1, n: 0, last: -1 } }
  function winner(o) { for (var i = 0; i < T.length; i++) { var t = T[i], v = o[t[0]]; if (v && o[t[1]] === v && o[t[2]] === v) return [v, t] } return null }
  function over(st) { var w = winner(st.o); if (w) return { w: w[0], why: w[1].join(' + ') + ' = 15를 만들었어요.', line: w[1] }; if (st.n >= 9) return { w: 0, why: '카드를 다 가져갔는데 15를 만든 사람이 없어요.' }; return null }
  function moves(st) { if (over(st)) return []; var m = []; for (var v = 1; v <= 9; v++) if (!st.o[v]) m.push(v); return m }
  function play(st, v) { var o = st.o.slice(); o[v] = st.turn; return { o: o, turn: 3 - st.turn, n: st.n + 1, last: v } }
  /* 끝까지 모두 따져 보기(경우가 적어 금방 끝남): 이기면 +, 지면 −, 빨리 이길수록 큼 */
  var memo = {};
  function solve(o, me, n) {
    var k = o.join('') + me; if (k in memo) return memo[k];
    var best = -100;
    for (var v = 1; v <= 9; v++) if (!o[v]) {
      o[v] = me; var w = winner(o), s = w ? 10 - n : n + 1 >= 9 ? 0 : -solve(o, 3 - me, n + 1); o[v] = 0;
      if (s > best) best = s;
    }
    return memo[k] = best === -100 ? 0 : best;
  }
  function scores(st) { var o = st.o.slice(); return moves(st).map(function (v) { o[v] = st.turn; var w = winner(o), s = w ? 10 - st.n : st.n + 1 >= 9 ? 0 : -solve(o, 3 - st.turn, st.n + 1); o[v] = 0; return { c: v, v: s } }) }
  function winNow(st, who) { var o = st.o.slice(), r = []; for (var v = 1; v <= 9; v++) if (!o[v]) { o[v] = who; if (winner(o)) r.push(v); o[v] = 0 } return r }
  /* 단계: 1 아무 카드 · 2 이기는 카드는 꼭 · 3 막기도 반쯤 · 4 이기기·막기 · 5~10 끝까지 따지되 실수가 줄어듦(7단계부터는 비겨도 통과) */
  var LV = [null, { rnd: 1 }, { win: 1 }, { win: 1, block: .5 }, { win: 1, block: 1 }, { err: .6 }, { err: .4 }, { err: .25 }, { err: .12 }, { err: .05 }, { err: 0 }];
  function ai(st, level) {
    var C = LV[level], ms = moves(st), r = function (a) { return a[(Math.random() * a.length) | 0] };
    if (!ms.length) return -1;
    if (C.rnd) return r(ms);
    if (C.win != null) {
      var w = winNow(st, st.turn); if (w.length) return r(w);
      var bl = winNow(st, 3 - st.turn); if (bl.length && Math.random() < (C.block || 0)) return r(bl);
      return r(ms);
    }
    var sc = scores(st), best = Math.max.apply(null, sc.map(function (o) { return o.v }));
    if (best > 0 && sc.some(function (o) { return o.v === best && best >= 10 - st.n })) return r(sc.filter(function (o) { return o.v === best }).map(function (o) { return o.c }));   // 바로 이기는 수는 놓치지 않음
    if (Math.random() < C.err) { var ok = ms.filter(function (v) { var o = st.o.slice(); o[v] = st.turn; return !winNow({ o: o }, 3 - st.turn).length }); return r(ok.length ? ok : ms) }   // 실수: 바로 지지는 않는 아무 카드
    return r(sc.filter(function (o) { return o.v === best }).map(function (o) { return o.c }));
  }
  return { T: T, init: init, moves: moves, play: play, over: over, ai: ai, LV: LV, SQ: [2, 7, 6, 9, 5, 1, 4, 3, 8] };
}
