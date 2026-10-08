/* 장기 규칙·인공지능. 가로 9줄 × 세로 10줄 교차점, 자리 번호 = 줄(r, 0 맨 위) × 9 + 칸(c).
   0 빈칸, 말 = 편 × 8 + 종류. 편 1 초(아래, 먼저) · 2 한(위). 종류 1 궁 2 사 3 상 4 마 5 차 6 포 7 졸(병).
   수 = 떠나는 자리 × 100 + 가는 자리, -1 = 한 수 쉼(둘 수 있는 수가 없을 때). makeJanggi()은 화면과 워커 둘 다에서 씀 */
function makeJanggi() {
  var K = 1, A = 2, E = 3, H = 4, R = 5, C = 6, P = 7, LIMIT = 200;
  var PTS = [0, 0, 3, 3, 5, 13, 7, 2], VAL = [0, 0, 300, 300, 500, 1300, 700, 200], ORTH = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  function sd(v) { return v >> 3 } function kd(v) { return v & 7 }
  function on(r, c) { return r >= 0 && r < 10 && c >= 0 && c < 9 }
  function pal(r, c) { return c >= 3 && c <= 5 && r >= 0 && r <= 9 && (r <= 2 || r >= 7) }
  function ownPal(r, c, s) { return c >= 3 && c <= 5 && (s === 1 ? r >= 7 && r <= 9 : r >= 0 && r <= 2) }
  /* 궁성 대각선: 가운데에서는 네 방향, 귀퉁이에서는 가운데 쪽 한 방향 */
  function pdiag(r, c) {
    if (!pal(r, c)) return [];
    var dr = r - (r <= 2 ? 1 : 8), dc = c - 4;
    if (!dr && !dc) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    if (dr && dc) return [[-dr, -dc]];
    return [];
  }
  function samePal(r1, r2) { return (r1 <= 2) === (r2 <= 2) }
  var SETUP = { mshm: [R, H, E, A, 0, A, H, E, R], hmhm: [R, E, H, A, 0, A, E, H, R], mhhm: [R, H, E, A, 0, A, E, H, R], hmmh: [R, E, H, A, 0, A, H, E, R] };
  function init(o) {
    var b = []; for (var i = 0; i < 90; i++) b.push(0);
    var s1 = SETUP[(o && o.cho) || 'mshm'], s2 = SETUP[(o && o.han) || 'mshm'];
    for (var c = 0; c < 9; c++) { if (s2[c]) b[c] = 16 + s2[c]; if (s1[c]) b[81 + c] = 8 + s1[c] }
    b[13] = 16 + K; b[76] = 8 + K;
    b[19] = b[25] = 16 + C; b[64] = b[70] = 8 + C;
    [0, 2, 4, 6, 8].forEach(function (c) { b[27 + c] = 16 + P; b[54 + c] = 8 + P });
    return { b: b, turn: 1, n: 0, last: -1, pass: 0 };
  }
  /* 둘 수 있는 수(궁이 잡히는지는 아직 따지지 않음) */
  function gen(b, s, capsOnly) {
    var out = [];
    for (var p = 0; p < 90; p++) {
      var v = b[p]; if (!v || sd(v) !== s) continue;
      var r = (p / 9) | 0, c = p % 9, k = kd(v), i, d, rr, cc, q, t;
      var add = function (rr, cc) { var q = rr * 9 + cc, t = b[q]; if (t && sd(t) === s) return; if (capsOnly && !t) return; out.push(p * 100 + q) };
      if (k === K || k === A) {
        for (i = 0; i < 4; i++) { rr = r + ORTH[i][0]; cc = c + ORTH[i][1]; if (ownPal(rr, cc, s)) add(rr, cc) }
        pdiag(r, c).forEach(function (d) { if (ownPal(r + d[0], c + d[1], s)) add(r + d[0], c + d[1]) });
      } else if (k === R) {
        for (i = 0; i < 4; i++) { rr = r + ORTH[i][0]; cc = c + ORTH[i][1]; while (on(rr, cc)) { add(rr, cc); if (b[rr * 9 + cc]) break; rr += ORTH[i][0]; cc += ORTH[i][1] } }
        pdiag(r, c).forEach(function (d) { var rr = r + d[0], cc = c + d[1]; while (pal(rr, cc) && samePal(r, rr)) { add(rr, cc); if (b[rr * 9 + cc]) break; rr += d[0]; cc += d[1] } });
      } else if (k === C) {
        for (i = 0; i < 4; i++) {
          rr = r + ORTH[i][0]; cc = c + ORTH[i][1];
          while (on(rr, cc) && !b[rr * 9 + cc]) { rr += ORTH[i][0]; cc += ORTH[i][1] }
          if (!on(rr, cc) || kd(b[rr * 9 + cc]) === C) continue;   // 넘을 말이 없거나 포는 못 넘음
          rr += ORTH[i][0]; cc += ORTH[i][1];
          while (on(rr, cc)) { t = b[rr * 9 + cc]; if (!t) add(rr, cc); else { if (kd(t) !== C) add(rr, cc); break } rr += ORTH[i][0]; cc += ORTH[i][1] }
        }
        pdiag(r, c).forEach(function (d) {
          if (pdiag(r, c).length !== 1) return;   // 귀퉁이에서만: 가운데를 넘어 맞은편 귀퉁이로
          var m = (r + d[0]) * 9 + c + d[1], tr = r + 2 * d[0], tc = c + 2 * d[1], t = b[tr * 9 + tc];
          if (b[m] && kd(b[m]) !== C && (!t || kd(t) !== C)) add(tr, tc);
        });
      } else if (k === H) {
        for (i = 0; i < 4; i++) {
          var r1 = r + ORTH[i][0], c1 = c + ORTH[i][1]; if (!on(r1, c1) || b[r1 * 9 + c1]) continue;
          for (var sgn = -1; sgn <= 1; sgn += 2) { if (ORTH[i][0]) { rr = r1 + ORTH[i][0]; cc = c1 + sgn } else { rr = r1 + sgn; cc = c1 + ORTH[i][1] } if (on(rr, cc)) add(rr, cc) }
        }
      } else if (k === E) {
        for (i = 0; i < 4; i++) {
          var e1r = r + ORTH[i][0], e1c = c + ORTH[i][1]; if (!on(e1r, e1c) || b[e1r * 9 + e1c]) continue;
          for (var sg = -1; sg <= 1; sg += 2) {
            var ddr = ORTH[i][0] || sg, ddc = ORTH[i][1] || sg, m2r = e1r + ddr, m2c = e1c + ddc;
            if (!on(m2r, m2c) || b[m2r * 9 + m2c]) continue;
            if (on(m2r + ddr, m2c + ddc)) add(m2r + ddr, m2c + ddc);
          }
        }
      } else if (k === P) {
        var fw = s === 1 ? -1 : 1;
        [[fw, 0], [0, -1], [0, 1]].forEach(function (d) { if (on(r + d[0], c + d[1])) add(r + d[0], c + d[1]) });
        if (pal(r, c) && (s === 1 ? r <= 2 : r >= 7)) pdiag(r, c).forEach(function (d) { if (d[0] === fw && pal(r + d[0], c + d[1])) add(r + d[0], c + d[1]) });
      }
    }
    return out;
  }
  function kingAt(b, s) { for (var p = 0; p < 90; p++) if (b[p] === s * 8 + K) return p; return -1 }
  function attacked(b, q, by) { var g = gen(b, by, true); for (var i = 0; i < g.length; i++) if (g[i] % 100 === q) return true; return false }
  function inCheck(b, s) { var k = kingAt(b, s); return k < 0 || attacked(b, k, 3 - s) }
  function mk(b, m) { var f = (m / 100) | 0, t = m % 100, x = b.slice(); x[t] = x[f]; x[f] = 0; return x }
  function legalB(b, s) { return gen(b, s, false).filter(function (m) { return !inCheck(mk(b, m), s) }) }
  function points(b) { var t = [0, 0, 1.5]; for (var p = 0; p < 90; p++) if (b[p]) t[sd(b[p])] += PTS[kd(b[p])]; return t }
  function over(st) {
    if (st.n >= LIMIT || st.pass >= 2) { var t = points(st.b); return { w: t[1] > t[2] ? 1 : 2, why: (st.n >= LIMIT ? '수가 ' + LIMIT + '번이 되어' : '둘 다 둘 수가 없어') + ' 남은 말 점수로 정해요. 초 ' + t[1] + ' · 한 ' + t[2] + '(덤 1.5 포함)' } }
    if (!legalB(st.b, st.turn).length && inCheck(st.b, st.turn)) return { w: 3 - st.turn, why: '외통수예요(장군을 피할 길이 없어요).' };
    return null;
  }
  function moves(st) { if (over(st)) return []; return legalB(st.b, st.turn) }
  function play(st, m) {
    if (m < 0) return { b: st.b.slice(), turn: 3 - st.turn, n: st.n + 1, last: -1, pass: st.pass + 1 };
    return { b: mk(st.b, m), turn: 3 - st.turn, n: st.n + 1, last: m, pass: 0, cap: st.b[m % 100] };
  }
  /* 점수: 말 값 + 졸이 앞으로 나간 만큼 + 마·포가 가운데에 가까울수록 조금 */
  function evalB(b, me) {
    var s = 0;
    for (var p = 0; p < 90; p++) {
      var v = b[p]; if (!v) continue;
      var k = kd(v), w = VAL[k], r = (p / 9) | 0, c = p % 9;
      if (k === P) { var adv = sd(v) === 1 ? 6 - r : r - 3; w += adv * 8 + (pal(r, c) ? 20 : 0) - Math.abs(c - 4) * 2 }
      else if (k === H || k === C) w += 12 - Math.abs(c - 4) * 3;
      else if (k === K) w = 0;
      s += sd(v) === me ? w : -w;
    }
    return s;
  }
  var stop = 0, nodes = 0, WIN = 100000;
  function order(b, ms) { return ms.map(function (m) { var t = b[m % 100]; return [m, t ? VAL[kd(t)] * 10 + (kd(t) === K ? 1e5 : 0) - VAL[kd(b[(m / 100) | 0])] / 10 : 0] }).sort(function (x, y) { return y[1] - x[1] }).map(function (x) { return x[0] }) }
  function quies(b, me, a, bt, qd) {
    if ((++nodes & 1023) === 0 && stop && Date.now() > stop) throw 'time';
    var sp = evalB(b, me); if (sp >= bt) return sp; if (sp > a) a = sp; if (qd <= 0) return a;
    var ms = order(b, gen(b, me, true));
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i], f = (m / 100) | 0, t = m % 100, cap = b[t];
      if (kd(cap) === K) return WIN;
      b[t] = b[f]; b[f] = 0; var v = -quies(b, 3 - me, -bt, -a, qd - 1); b[f] = b[t]; b[t] = cap;
      if (v > a) { a = v; if (a >= bt) break }
    }
    return a;
  }
  function nega(b, me, depth, a, bt, ply, q) {
    if ((++nodes & 1023) === 0 && stop && Date.now() > stop) throw 'time';
    if (depth <= 0) return q ? quies(b, me, a, bt, 4) : evalB(b, me);
    var ms = order(b, gen(b, me, false)), any = false;
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i], f = (m / 100) | 0, t = m % 100, cap = b[t];
      if (kd(cap) === K) return WIN - ply;
      b[t] = b[f]; b[f] = 0; var v = -nega(b, 3 - me, depth - 1, -bt, -a, ply + 1, q); b[f] = b[t]; b[t] = cap;
      if (v > -WIN + 1000) any = true;
      if (v > a) { a = v; if (a >= bt) break }
    }
    return a;
  }
  function rootScores(st, depth, q) {
    var b = st.b.slice(), me = st.turn;
    return order(b, legalB(b, me)).map(function (m) {
      var f = (m / 100) | 0, t = m % 100, cap = b[t]; b[t] = b[f]; b[f] = 0;
      var v = legalB(b, 3 - me).length ? -nega(b, 3 - me, depth - 1, -WIN - 1, WIN + 1, 1, q) : (inCheck(b, 3 - me) ? WIN : 0);
      b[f] = b[t]; b[t] = cap; return { c: m, v: v };
    });
  }
  /* 단계: 1 아무 수나(잡을 수 있으면 반쯤 잡음) · 2~4 한두 수 앞을 보되 흔들림 · 5~10 잡고 잡히는 것까지 따지며 더 멀리 */
  var LV = [null, { rnd: 1 }, { d: 1, noise: 250 }, { d: 1, q: 1, noise: 80 }, { d: 2, q: 1, noise: 60, err: .2 }, { d: 2, q: 1, noise: 20, err: .1 }, { d: 3, q: 1, noise: 30, ms: 2500, err: .1 }, { d: 3, q: 1, ms: 2500, err: .03 }, { d: 4, q: 1, ms: 3500, err: .03 }, { d: 5, q: 1, ms: 4500 }, { d: 6, q: 1, ms: 4500 }];
  function pick(L, noise, err) {
    var S = L.map(function (o) { return { c: o.c, v: o.v + (noise ? Math.random() * noise : 0), w: o.v } }).sort(function (a, b) { return b.v - a.v });
    if (err && S.length > 1 && S[0].w < WIN - 50 && Math.random() < err) { var k = Math.min(3, S.length) - 1; return S[1 + ((Math.random() * k) | 0)].c }   // 가끔 2~3번째 수
    var bs = S.filter(function (o) { return Math.abs(o.v - S[0].v) < 1e-9 }); return bs[(Math.random() * bs.length) | 0].c;
  }

  function ai(st, level) {
    var Cf = LV[level], ms = moves(st);
    if (!ms.length) return -1;
    if (Cf.rnd) { var caps = ms.filter(function (m) { return st.b[m % 100] }); if (caps.length && Math.random() < .5) return caps[(Math.random() * caps.length) | 0]; return ms[(Math.random() * ms.length) | 0] }
    var best = null; stop = Cf.ms ? Date.now() + Cf.ms : 0; nodes = 0;
    try { for (var d = Cf.ms ? 1 : Cf.d; d <= Cf.d; d++) { best = rootScores(st, d, Cf.q); if (best.some(function (o) { return o.v >= WIN - 50 })) break } } catch (e) { if (e !== 'time') throw e }
    stop = 0;
    if (!best) best = ms.map(function (m) { return { c: m, v: 0 } });
    return pick(best, Cf.noise ? Cf.noise : 3, Cf.err);
  }
  return { init: init, moves: moves, play: play, over: over, ai: ai, inCheck: inCheck, points: points, kd: kd, sd: sd, pdiag: pdiag, LIMIT: LIMIT, SETUP: SETUP, LV: LV, gen: gen };
}
