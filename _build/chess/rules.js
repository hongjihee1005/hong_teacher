/* 체스 규칙 엔진 (FIDE Laws of Chess) — window.CH
   칸 번호: 0 = a8 … 7 = h8, 56 = a1 … 63 = h1 (위에서 아래, 왼쪽에서 오른쪽)
   말 글자: 백 KQRBNP, 흑 kqrbnp, 빈칸 '.'
   국면 p = {b: 64칸 배열, turn: 'w'|'b', cast: 'KQkq' 중 남은 것, ep: 앙파상 칸(-1), half: 50수 셈, full: 수 번호}
   수 m = {from, to, pc, cap, promo, flag: ''|'double'|'ep'|'castle'} */
(function (G) {
  'use strict';
  var FILES = 'abcdefgh';
  function name(i) { return FILES[i & 7] + (8 - (i >> 3)); }
  function idx(n) { return (8 - +n[1]) * 8 + FILES.indexOf(n[0]); }
  function isW(c) { return c >= 'A' && c <= 'Z'; }
  function side(c) { return c === '.' ? '' : isW(c) ? 'w' : 'b'; }
  function up(c) { return c.toUpperCase(); }
  var START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  var D8 = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  var DN = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  var DB = [[-1, -1], [-1, 1], [1, -1], [1, 1]], DR = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  function board(pl) { var b = [], i; for (i = 0; i < 64; i++) b.push('.'); i = 0; pl.split('').forEach(function (c) { if (c === '/') return; if (/\d/.test(c)) i += +c; else b[i++] = c; }); return b; }
  function placement(b) { var s = '', r, f, e; for (r = 0; r < 8; r++) { e = 0; for (f = 0; f < 8; f++) { var c = b[r * 8 + f]; if (c === '.') e++; else { if (e) s += e; e = 0; s += c; } } if (e) s += e; if (r < 7) s += '/'; } return s; }
  function parse(fen) {
    var a = (fen || START).trim().split(/\s+/);
    return { b: board(a[0]), turn: a[1] || 'w', cast: a[2] && a[2] !== '-' ? a[2] : '', ep: a[3] && a[3] !== '-' ? idx(a[3]) : -1, half: +a[4] || 0, full: +a[5] || 1 };
  }
  function fen(p) { return [placement(p.b), p.turn, p.cast || '-', p.ep >= 0 ? name(p.ep) : '-', p.half, p.full].join(' '); }
  function at(r, f) { return r >= 0 && r < 8 && f >= 0 && f < 8 ? r * 8 + f : -1; }

  /* 칸 sq에 있는 말이 '공격하는'(잡을 수 있는) 칸들 — 내 편 말이 있는 칸도 넣음(지켜 주기) */
  function attacks(b, sq) {
    var c = b[sq], out = []; if (c === '.') return out;
    var r = sq >> 3, f = sq & 7, t = up(c), k, j, s;
    if (t === 'P') { var dr = isW(c) ? -1 : 1; [-1, 1].forEach(function (df) { var s2 = at(r + dr, f + df); if (s2 >= 0) out.push(s2); }); return out; }
    if (t === 'N' || t === 'K') { (t === 'N' ? DN : D8).forEach(function (d) { var s2 = at(r + d[0], f + d[1]); if (s2 >= 0) out.push(s2); }); return out; }
    var dirs = t === 'B' ? DB : t === 'R' ? DR : D8;
    for (k = 0; k < dirs.length; k++) for (j = 1; j < 8; j++) { s = at(r + dirs[k][0] * j, f + dirs[k][1] * j); if (s < 0) break; out.push(s); if (b[s] !== '.') break; }
    return out;
  }
  /* 칸 sq를 side('w'|'b') 편이 공격하는지 */
  function attacked(b, sq, by) {
    var r = sq >> 3, f = sq & 7, k, j, s, c, W = by === 'w';
    function is(c, t) { return c !== '.' && up(c) === t && isW(c) === W; }
    for (k = 0; k < 8; k++) { s = at(r + DN[k][0], f + DN[k][1]); if (s >= 0 && is(b[s], 'N')) return true; s = at(r + D8[k][0], f + D8[k][1]); if (s >= 0 && is(b[s], 'K')) return true; }
    var pr = W ? 1 : -1; s = at(r + pr, f - 1); if (s >= 0 && is(b[s], 'P')) return true; s = at(r + pr, f + 1); if (s >= 0 && is(b[s], 'P')) return true;
    for (k = 0; k < 4; k++) {
      for (j = 1; j < 8; j++) { s = at(r + DR[k][0] * j, f + DR[k][1] * j); if (s < 0) break; c = b[s]; if (c !== '.') { if (is(c, 'R') || is(c, 'Q')) return true; break; } }
      for (j = 1; j < 8; j++) { s = at(r + DB[k][0] * j, f + DB[k][1] * j); if (s < 0) break; c = b[s]; if (c !== '.') { if (is(c, 'B') || is(c, 'Q')) return true; break; } }
    }
    return false;
  }
  function attackers(b, sq, by) { var out = []; for (var i = 0; i < 64; i++) if (side(b[i]) === by && attacks(b, i).indexOf(sq) >= 0) out.push(i); return out; }
  function kingSq(b, s) { var k = s === 'w' ? 'K' : 'k'; return b.indexOf(k); }
  function inCheck(p, s) { s = s || p.turn; var k = kingSq(p.b, s); return k >= 0 && attacked(p.b, k, s === 'w' ? 'b' : 'w'); }

  /* 한 말의 수(킹이 위험해지는지는 보지 않음) */
  function pieceMoves(p, sq) {
    var b = p.b, c = b[sq], out = []; if (c === '.') return out;
    var me = side(c), r = sq >> 3, f = sq & 7, t = up(c);
    function add(to, flag) {
      if (t === 'P' && (to >> 3 === 0 || to >> 3 === 7)) ['Q', 'R', 'B', 'N'].forEach(function (q) { out.push({ from: sq, to: to, pc: c, cap: b[to], promo: me === 'w' ? q : q.toLowerCase(), flag: '' }); });
      else out.push({ from: sq, to: to, pc: c, cap: flag === 'ep' ? (me === 'w' ? 'p' : 'P') : b[to], promo: '', flag: flag || '' });
    }
    if (t === 'P') {
      var dr = me === 'w' ? -1 : 1, s1 = at(r + dr, f);
      if (s1 >= 0 && b[s1] === '.') { add(s1); var home = me === 'w' ? 6 : 1, s2 = at(r + 2 * dr, f); if (r === home && b[s2] === '.') add(s2, 'double'); }
      [-1, 1].forEach(function (df) { var s = at(r + dr, f + df); if (s < 0) return; if (b[s] !== '.' && side(b[s]) !== me) add(s); else if (s === p.ep) add(s, 'ep'); });
      return out;
    }
    attacks(b, sq).forEach(function (s) { if (side(b[s]) !== me) add(s); });
    if (t === 'K') {
      var op = me === 'w' ? 'b' : 'w', R = me === 'w' ? 7 : 0, e = R * 8 + 4;
      if (sq === e && !attacked(b, e, op)) {
        var K = me === 'w' ? 'K' : 'k', Q = me === 'w' ? 'Q' : 'q', rook = me === 'w' ? 'R' : 'r';
        if (p.cast.indexOf(K) >= 0 && b[e + 1] === '.' && b[e + 2] === '.' && b[e + 3] === rook && !attacked(b, e + 1, op) && !attacked(b, e + 2, op)) add(e + 2, 'castle');
        if (p.cast.indexOf(Q) >= 0 && b[e - 1] === '.' && b[e - 2] === '.' && b[e - 3] === '.' && b[e - 4] === rook && !attacked(b, e - 1, op) && !attacked(b, e - 2, op)) add(e - 2, 'castle');
      }
    }
    return out;
  }
  function make(p, m) {
    var b = p.b.slice(), me = side(m.pc), q = { b: b, turn: me === 'w' ? 'b' : 'w', cast: p.cast, ep: -1, half: p.half + 1, full: p.full + (me === 'b' ? 1 : 0) };
    b[m.to] = m.promo || m.pc; b[m.from] = '.';
    if (m.flag === 'ep') b[m.to + (me === 'w' ? 8 : -8)] = '.';
    if (m.flag === 'double') q.ep = (m.from + m.to) >> 1;
    if (m.flag === 'castle') { if (m.to > m.from) { b[m.to - 1] = b[m.to + 1]; b[m.to + 1] = '.'; } else { b[m.to + 1] = b[m.to - 2]; b[m.to - 2] = '.'; } }
    if (up(m.pc) === 'P' || m.cap !== '.') q.half = 0;
    var c = q.cast;
    [[60, 'KQ'], [4, 'kq'], [63, 'K'], [56, 'Q'], [7, 'k'], [0, 'q']].forEach(function (x) { if (m.from === x[0] || m.to === x[0]) c = c.replace(new RegExp('[' + x[1] + ']', 'g'), ''); });
    q.cast = c; return q;
  }
  function legalFrom(p, sq) { var s = side(p.b[sq]); return pieceMoves(p, sq).filter(function (m) { var q = make(p, m); return !inCheck(q, s); }); }
  function legal(p) { var out = []; for (var i = 0; i < 64; i++) if (side(p.b[i]) === p.turn) out = out.concat(legalFrom(p, i)); return out; }
  function insufficient(b) {
    var rest = b.filter(function (c) { return c !== '.' && up(c) !== 'K'; });
    if (!rest.length) return true;
    if (rest.length === 1 && /[BN]/i.test(rest[0])) return true;
    if (rest.every(function (c) { return up(c) === 'B'; })) { var col = {}; b.forEach(function (c, i) { if (up(c) === 'B') col[((i >> 3) + (i & 7)) & 1] = 1; }); return Object.keys(col).length === 1; }
    return false;
  }
  /* 'mate' 체크메이트, 'stale' 스테일메이트, 'fifty' 50수, 'material' 말 부족, '' 계속 */
  function status(p) {
    if (!legal(p).length) return inCheck(p) ? 'mate' : 'stale';
    if (p.half >= 100) return 'fifty';
    if (insufficient(p.b)) return 'material';
    return '';
  }
  function perft(p, d) { if (!d) return 1; var n = 0; legal(p).forEach(function (m) { n += perft(make(p, m), d - 1); }); return n; }
  /* 대수 기보(SAN) */
  function san(p, m) {
    var t = up(m.pc), s;
    if (m.flag === 'castle') s = m.to > m.from ? 'O-O' : 'O-O-O';
    else {
      s = '';
      if (t !== 'P') {
        s = t; var amb = legal(p).filter(function (o) { return o.to === m.to && o.pc === m.pc && o.from !== m.from; });
        if (amb.length) { var sf = amb.some(function (o) { return (o.from & 7) === (m.from & 7); }), sr = amb.some(function (o) { return (o.from >> 3) === (m.from >> 3); }); s += !sf ? FILES[m.from & 7] : !sr ? name(m.from)[1] : name(m.from); }
      } else if (m.cap !== '.') s = FILES[m.from & 7];
      if (m.cap !== '.') s += 'x'; s += name(m.to); if (m.promo) s += '=' + up(m.promo);
    }
    var q = make(p, m); if (inCheck(q)) s += legal(q).length ? '+' : '#';
    return s;
  }
  G.CH = { START: START, name: name, idx: idx, side: side, isW: isW, parse: parse, fen: fen, board: board, placement: placement, attacks: attacks, attacked: attacked, attackers: attackers, kingSq: kingSq, inCheck: inCheck, pieceMoves: pieceMoves, legalFrom: legalFrom, legal: legal, make: make, status: status, insufficient: insufficient, perft: perft, san: san };
})(typeof window !== 'undefined' ? window : globalThis);
