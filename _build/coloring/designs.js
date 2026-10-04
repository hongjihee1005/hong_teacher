/* 컬러링 도안 생성기 — 같은 설정(종류·씨앗 수)이면 언제나 같은 그림. 화면 400×400.
   도안 = 칸(색칠할 수 있는 닫힌 모양) 목록. 뒤에 그린 칸이 앞의 칸을 가리므로, 보이는 부분이 곧 색칠 칸이 됩니다. */
var CD = (function () {
  var PI = Math.PI;
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
  function f(n) { return Math.round(n * 10) / 10 }
  /* 기본 모양 → path d */
  function circ(cx, cy, r) { return 'M' + f(cx - r) + ' ' + f(cy) + 'a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(2 * r) + ' 0a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(-2 * r) + ' 0Z' }
  function ell(cx, cy, rx, ry, rot) {
    rot = rot || 0; var a = rot * PI / 180, dx = rx * Math.cos(a), dy = rx * Math.sin(a);
    return 'M' + f(cx - dx) + ' ' + f(cy - dy) + 'A' + f(rx) + ' ' + f(ry) + ' ' + rot + ' 1 0 ' + f(cx + dx) + ' ' + f(cy + dy) + 'A' + f(rx) + ' ' + f(ry) + ' ' + rot + ' 1 0 ' + f(cx - dx) + ' ' + f(cy - dy) + 'Z';
  }
  function rect(x, y, w, h, r) {
    r = Math.min(r || 0, w / 2, h / 2);
    if (!r) return 'M' + f(x) + ' ' + f(y) + 'h' + f(w) + 'v' + f(h) + 'h' + f(-w) + 'Z';
    return 'M' + f(x + r) + ' ' + f(y) + 'h' + f(w - 2 * r) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + 'v' + f(h - 2 * r) + 'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + r + 'h' + f(-(w - 2 * r)) + 'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + (-r) + 'v' + f(-(h - 2 * r)) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + (-r) + 'Z';
  }
  function poly(p) { return 'M' + p.map(function (q) { return f(q[0]) + ' ' + f(q[1]) }).join('L') + 'Z' }
  function pol(cx, cy, r, a) { a = a * PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] }
  function star(cx, cy, n, r1, r2, rot) { var p = []; for (var i = 0; i < 2 * n; i++) p.push(pol(cx, cy, i % 2 ? r2 : r1, (rot || -90) + i * 180 / n)); return poly(p) }
  function ngon(cx, cy, n, r, rot) { var p = []; for (var i = 0; i < n; i++) p.push(pol(cx, cy, r, (rot || -90) + i * 360 / n)); return poly(p) }
  function heart(cx, cy, s) {
    return 'M' + f(cx) + ' ' + f(cy + s * .9) + 'C' + f(cx - s * 1.3) + ' ' + f(cy + s * .1) + ' ' + f(cx - s * .9) + ' ' + f(cy - s * .95) + ' ' + f(cx) + ' ' + f(cy - s * .35) +
      'C' + f(cx + s * .9) + ' ' + f(cy - s * .95) + ' ' + f(cx + s * 1.3) + ' ' + f(cy + s * .1) + ' ' + f(cx) + ' ' + f(cy + s * .9) + 'Z';
  }
  /* 꽃잎: 중심(cx,cy)에서 각도 a 방향, 반지름 r0~r1, 너비 w(라디안 비율), 모양 k(0 둥글게,1 뾰족) */
  function petal(cx, cy, a, r0, r1, w, k) {
    var A = a * PI / 180, b0 = pol(cx, cy, r0, a - w), b1 = pol(cx, cy, r0, a + w), tip = pol(cx, cy, r1, a);
    var mr = r0 + (r1 - r0) * (k ? .55 : .75), sp = w * (k ? 1.1 : 1.6) * (r0 + (r1 - r0) * .4) / Math.max(mr, 1);
    var c0 = pol(cx, cy, mr, a - sp), c1 = pol(cx, cy, mr, a + sp);
    return 'M' + f(b0[0]) + ' ' + f(b0[1]) + 'Q' + f(c0[0]) + ' ' + f(c0[1]) + ' ' + f(tip[0]) + ' ' + f(tip[1]) + 'Q' + f(c1[0]) + ' ' + f(c1[1]) + ' ' + f(b1[0]) + ' ' + f(b1[1]) + 'Z';
  }
  function seg(cx, cy, r0, r1, a0, a1) {
    var p0 = pol(cx, cy, r1, a0), p1 = pol(cx, cy, r1, a1), p2 = pol(cx, cy, r0, a1), p3 = pol(cx, cy, r0, a0), lg = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + f(p0[0]) + ' ' + f(p0[1]) + 'A' + f(r1) + ' ' + f(r1) + ' 0 ' + lg + ' 1 ' + f(p1[0]) + ' ' + f(p1[1]) + 'L' + f(p2[0]) + ' ' + f(p2[1]) + 'A' + f(r0) + ' ' + f(r0) + ' 0 ' + lg + ' 0 ' + f(p3[0]) + ' ' + f(p3[1]) + 'Z';
  }
  function L(d) { return { d: d, line: 1 } }   // 색칠하지 않는 선

  /* ── 사물 32가지 (lv 1: 큰 칸, lv 2: 무늬·장식 더) ── */
  var OBJ = {
    sun: ['해', function (o, lv) {
      var n = lv > 1 ? 16 : 10; for (var i = 0; i < n; i++) o.push(poly([pol(200, 200, 105, i * 360 / n - 8), pol(200, 200, 175, i * 360 / n), pol(200, 200, 105, i * 360 / n + 8)]));
      o.push(circ(200, 200, 110)); if (lv > 1) { o.push(circ(200, 200, 85)); for (var j = 0; j < 8; j++) o.push(circ.apply(null, pol(200, 200, 97, j * 45).concat([7]))) }
      o.push(circ(165, 185, 12), circ(235, 185, 12)); o.push(L('M160 225q40 35 80 0'));
    }],
    flower: ['꽃', function (o, lv) {
      o.push(rect(193, 220, 14, 160, 6)); o.push(ell(150, 310, 45, 18, -30), ell(250, 290, 45, 18, 30));
      var n = lv > 1 ? 8 : 6; for (var i = 0; i < n; i++) o.push(ell.apply(null, pol(200, 150, 62, i * 360 / n).concat([42, 26, i * 360 / n])));
      if (lv > 1) for (var j = 0; j < n; j++) o.push(ell.apply(null, pol(200, 150, 62, j * 360 / n).concat([22, 11, j * 360 / n])));
      o.push(circ(200, 150, 38)); if (lv > 1) o.push(circ(200, 150, 20));
    }],
    tree: ['나무', function (o, lv) {
      o.push(rect(175, 220, 50, 150, 8)); [[200, 120, 80], [130, 175, 60], [270, 175, 60], [200, 200, 70]].forEach(function (c) { o.push(circ(c[0], c[1], c[2])) });
      if (lv > 1) { [[150, 130], [245, 140], [200, 180], [160, 205], [240, 210], [200, 95]].forEach(function (c) { o.push(circ(c[0], c[1], 13)) }); o.push(ell(200, 375, 120, 18)); o.push(ell(200, 280, 10, 16)) }
    }],
    house: ['집', function (o, lv) {
      if (lv > 1) o.push(rect(250, 60, 30, 70)); o.push(poly([[80, 190], [200, 80], [320, 190]])); o.push(rect(100, 190, 200, 170));
      o.push(rect(175, 270, 50, 90, 4)); o.push(rect(120, 215, 45, 45), rect(235, 215, 45, 45));
      if (lv > 1) { o.push(rect(122, 217, 20, 20), rect(144, 217, 20, 20), rect(122, 239, 20, 20), rect(144, 239, 20, 20), rect(237, 217, 20, 20), rect(259, 217, 20, 20), rect(237, 239, 20, 20), rect(259, 239, 20, 20)); o.push(circ(200, 145, 18)); o.push(rect(40, 360, 320, 20)) }
    }],
    fish: ['물고기', function (o, lv) {
      o.push(poly([[280, 200], [360, 140], [345, 200], [360, 260]])); o.push(poly([[170, 125], [230, 90], [240, 140]]));
      o.push(ell(190, 200, 120, 80)); if (lv > 1) { for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) o.push(circ(180 + i * 35, 165 + j * 35, 15)); o.push(circ(370, 90, 10), circ(345, 60, 7), circ(375, 35, 5)) }
      o.push(L('M125 140q-25 60 0 120')); o.push(circ(105, 185, 14)); o.push(circ(108, 183, 5));
    }],
    cat: ['고양이', function (o, lv) {
      o.push(poly([[95, 140], [110, 40], [180, 100]]), poly([[305, 140], [290, 40], [220, 100]]));
      if (lv > 1) o.push(poly([[110, 120], [117, 65], [158, 103]]), poly([[290, 120], [283, 65], [242, 103]]));
      o.push(ell(200, 200, 125, 110)); o.push(ell(155, 180, 20, 26), ell(245, 180, 20, 26)); o.push(poly([[185, 225], [215, 225], [200, 242]]));
      o.push(L('M200 242q-15 22-35 10M200 242q15 22 35 10M140 230l-80-10M140 245l-80 10M260 230l80-10M260 245l80 10'));
      if (lv > 1) { o.push(ell(155, 180, 8, 15), ell(245, 180, 8, 15)); o.push(rect(140, 300, 120, 30, 15)); o.push(circ(200, 335, 18)) }
    }],
    heart: ['하트', function (o, lv) {
      o.push(heart(200, 210, 150)); if (lv > 1) { o.push(heart(200, 205, 100)); o.push(heart(200, 200, 50)); [[60, 70], [340, 70], [60, 340], [340, 340]].forEach(function (c) { o.push(heart(c[0], c[1], 28)) }) }
    }],
    star: ['별', function (o, lv) {
      o.push(star(200, 210, 5, 180, 75)); if (lv > 1) { o.push(star(200, 210, 5, 115, 48)); o.push(star(200, 210, 5, 55, 23)); [[60, 60], [345, 60], [55, 350], [350, 345]].forEach(function (c) { o.push(star(c[0], c[1], 5, 28, 12)) }) }
    }],
    apple: ['사과', function (o, lv) {
      o.push(rect(194, 60, 12, 60, 5)); o.push(ell(245, 85, 45, 20, -25));
      o.push('M200 125C140 85 60 120 70 220C80 320 150 365 200 335C250 365 320 320 330 220C340 120 260 85 200 125Z');
      if (lv > 1) { o.push(ell(130, 190, 18, 35, 20)); for (var i = 0; i < 6; i++) o.push(circ(140 + (i % 3) * 60, 250 + Math.floor(i / 3) * 45, 9)) }
    }],
    balloon: ['풍선', function (o, lv) {
      o.push(L('M130 230q-10 80 70 150M200 210q-5 90 0 170M270 230q20 80-70 150'));
      [[130, 150, 60, 75], [270, 150, 60, 75], [200, 120, 65, 82]].forEach(function (b) { o.push(ell(b[0], b[1], b[2], b[3])); o.push(poly([[b[0] - 8, b[1] + b[3] + 10], [b[0] + 8, b[1] + b[3] + 10], [b[0], b[1] + b[3] - 3]])) });
      if (lv > 1) { o.push(ell(110, 120, 12, 22, 25), ell(250, 120, 12, 22, 25), ell(180, 85, 12, 22, 25)); o.push(star(200, 120, 5, 28, 12)) }
    }],
    car: ['자동차', function (o, lv) {
      o.push('M90 210L130 140H270L310 210Z'); o.push(rect(50, 200, 300, 90, 25));
      o.push(poly([[140, 155], [195, 155], [195, 205], [115, 205]]), poly([[205, 155], [262, 155], [287, 205], [205, 205]]));
      o.push(circ(120, 295, 42), circ(280, 295, 42)); o.push(circ(120, 295, 18), circ(280, 295, 18));
      if (lv > 1) { o.push(rect(55, 225, 30, 20, 6), rect(315, 225, 30, 20, 6)); o.push(rect(190, 235, 30, 8, 4)); o.push(rect(60, 255, 280, 14, 7)) }
    }],
    boat: ['배', function (o, lv) {
      o.push(rect(195, 60, 10, 220)); o.push(poly([[210, 70], [210, 255], [330, 255]]), poly([[190, 90], [190, 255], [90, 255]]));
      o.push('M50 270H350L305 340H95Z'); if (lv > 1) { o.push(circ(140, 305, 14), circ(200, 305, 14), circ(260, 305, 14)); o.push(poly([[210, 60], [250, 70], [210, 80]])); o.push('M0 345q50-20 100 0t100 0t100 0t100 0V400H0Z') }
    }],
    butterfly: ['나비', function (o, lv) {
      o.push(ell(130, 140, 85, 65, -30), ell(270, 140, 85, 65, 30), ell(145, 265, 60, 50, 30), ell(255, 265, 60, 50, -30));
      if (lv > 1) { o.push(circ(120, 135, 30), circ(280, 135, 30), circ(145, 265, 22), circ(255, 265, 22), circ(120, 135, 12), circ(280, 135, 12)) }
      o.push(ell(200, 205, 16, 95)); o.push(L('M195 115q-20-50-45-60M205 115q20-50 45-60')); o.push(circ(150, 55, 8), circ(250, 55, 8));
    }],
    rocket: ['로켓', function (o, lv) {
      o.push('M175 300q-10 60 25 90q35-30 25-90Z'); o.push(poly([[150, 230], [100, 310], [150, 300]]), poly([[250, 230], [300, 310], [250, 300]]));
      o.push('M150 310V160Q150 70 200 20Q250 70 250 160V310Z'); o.push(circ(200, 150, 30)); if (lv > 1) { o.push(circ(200, 150, 18)); o.push(rect(150, 230, 100, 18)); o.push(rect(150, 270, 100, 18)); [[60, 80], [330, 60], [70, 300], [340, 250]].forEach(function (c) { o.push(star(c[0], c[1], 5, 20, 8)) }) }
    }],
    icecream: ['아이스크림', function (o, lv) {
      o.push(poly([[130, 200], [270, 200], [200, 385]])); if (lv > 1) { for (var i = 0; i < 4; i++) o.push(poly([[150 + i * 25, 200], [170 + i * 25, 200], [160 + i * 22, 250]])) }
      o.push(circ(150, 175, 50), circ(250, 175, 50), circ(200, 120, 58)); o.push(circ(200, 50, 18)); o.push(L('M200 35q10-25 25-25'));
      if (lv > 1) { [[175, 105], [225, 100], [200, 140], [140, 165], [260, 165]].forEach(function (c) { o.push(ell(c[0], c[1], 9, 4, 30)) }) }
    }],
    cupcake: ['컵케이크', function (o, lv) {
      o.push(poly([[110, 220], [290, 220], [260, 370], [140, 370]])); if (lv > 1) for (var i = 0; i < 5; i++) o.push(poly([[118 + i * 36, 220], [136 + i * 36, 220], [158 + i * 26, 370], [146 + i * 26, 370]]));
      o.push(circ(130, 205, 38), circ(270, 205, 38), circ(200, 200, 50), circ(165, 150, 45), circ(235, 150, 45), circ(200, 105, 40)); o.push(circ(200, 55, 20));
      if (lv > 1) [[160, 140], [240, 140], [200, 185], [130, 200], [270, 200], [200, 100]].forEach(function (c) { o.push(rect(c[0] - 8, c[1] - 3, 16, 6, 3)) });
    }],
    rainbow: ['무지개', function (o, lv) {
      var n = lv > 1 ? 7 : 4; for (var i = 0; i < n; i++) { var r = 170 - i * (lv > 1 ? 14 : 22); o.push('M' + (200 - r) + ' 280A' + r + ' ' + r + ' 0 0 1 ' + (200 + r) + ' 280Z') }
      o.push('M' + (200 - (170 - n * (lv > 1 ? 14 : 22))) + ' 280A1 1 0 0 1 ' + (200 + (170 - n * (lv > 1 ? 14 : 22))) + ' 280Z');
      [[50, 280], [350, 280]].forEach(function (c) { o.push(circ(c[0] - 25, c[1], 30), circ(c[0] + 25, c[1], 30), circ(c[0], c[1] - 20, 35)) });
    }],
    umbrella: ['우산', function (o, lv) {
      o.push(L('M200 200V340q0 30-30 30q-25 0-25-25')); var n = lv > 1 ? 8 : 4;
      for (var i = 0; i < n; i++) { var a0 = 180 + i * 180 / n, a1 = a0 + 180 / n, p0 = pol(200, 200, 160, a0), p1 = pol(200, 200, 160, a1); o.push('M200 200L' + f(p0[0]) + ' ' + f(p0[1]) + 'A160 160 0 0 1 ' + f(p1[0]) + ' ' + f(p1[1]) + 'Z') }
      o.push(circ(200, 40, 10)); if (lv > 1) { for (var j = 0; j < 12; j++) o.push(ell(60 + (j % 4) * 90, 270 + Math.floor(j / 4) * 45, 5, 12, 15)) }
    }],
    snail: ['달팽이', function (o, lv) {
      o.push('M60 330Q60 280 120 280H330Q360 280 360 250V230Q380 240 380 280Q380 340 320 340H70Z'); o.push(L('M345 235l-15-50M362 240l15-50')); o.push(circ(330, 185, 9), circ(377, 190, 9));
      var n = lv > 1 ? 5 : 3; for (var i = 0; i < n; i++) o.push(circ(190 + i * 6, 200 + i * 4, 110 - i * (lv > 1 ? 20 : 32)));
    }],
    owl: ['부엉이', function (o, lv) {
      o.push(poly([[110, 120], [120, 40], [170, 95]]), poly([[290, 120], [280, 40], [230, 95]])); o.push(ell(200, 220, 120, 150));
      o.push(ell(95, 240, 30, 85, 15), ell(305, 240, 30, 85, -15)); o.push(ell(200, 270, 75, 90));
      if (lv > 1) for (var i = 0; i < 9; i++) o.push('M' + (165 + (i % 3) * 35) + ' ' + (230 + Math.floor(i / 3) * 35) + 'q17 20 34 0Z');
      o.push(circ(155, 160, 40), circ(245, 160, 40), circ(155, 160, 16), circ(245, 160, 16)); o.push(poly([[188, 190], [212, 190], [200, 215]]));
      o.push(rect(150, 360, 30, 15, 7), rect(220, 360, 30, 15, 7));
    }],
    turtle: ['거북이', function (o, lv) {
      o.push(ell(80, 230, 40, 30)); o.push(circ(65, 222, 6)); o.push(ell(130, 300, 25, 35), ell(270, 300, 25, 35), poly([[330, 260], [370, 280], [330, 290]]));
      o.push('M90 270Q90 120 210 120Q330 120 330 270Z');
      if (lv > 1) { o.push(ngon(210, 210, 6, 38, 0)); [[150, 240], [270, 240], [180, 160], [240, 160]].forEach(function (c) { o.push(ngon(c[0], c[1], 6, 28, 0)) }) } else o.push(ngon(210, 210, 6, 45, 0));
      o.push(rect(85, 262, 250, 18, 9));
    }],
    mushroom: ['버섯', function (o, lv) {
      o.push(rect(160, 210, 80, 150, 25)); o.push('M60 230Q60 70 200 70Q340 70 340 230Z');
      [[140, 140, 22], [230, 120, 28], [290, 190, 18], [110, 200, 15]].forEach(function (c) { o.push(circ(c[0], c[1], c[2])) });
      if (lv > 1) { o.push(circ(190, 185, 14)); o.push(ell(185, 280, 10, 14), ell(215, 280, 10, 14)); o.push(L('M185 310q15 12 30 0')); o.push('M20 380q60-40 120 0Z', 'M260 380q60-40 120 0Z') }
    }],
    moon: ['달과 별', function (o, lv) {
      o.push('M240 50A150 150 0 0 0 240 350A190 190 0 0 1 240 50Z'); if (lv > 1) { o.push(circ(140, 160, 15), circ(110, 240, 10), circ(160, 290, 12)) }
      [[300, 110, 30], [330, 250, 22], [260, 200, 16]].forEach(function (c) { o.push(star(c[0], c[1], 5, c[2], c[2] * .42)) });
      if (lv > 1) [[350, 50], [370, 170], [290, 330], [60, 40]].forEach(function (c) { o.push(star(c[0], c[1], 4, 14, 5)) });
    }],
    leaf: ['나뭇잎', function (o, lv) {
      o.push(rect(195, 320, 10, 60, 5)); var d = 'M200 330C80 280 80 120 200 30C320 120 320 280 200 330Z'; o.push(d);
      if (lv > 1) { for (var i = 0; i < 4; i++) { var y = 100 + i * 50; o.push('M200 ' + (y + 40) + 'Q' + (150 - i * 3) + ' ' + (y + 10) + ' ' + (125 + i * 5) + ' ' + (y - 10) + 'Q170 ' + y + ' 200 ' + (y + 15) + 'Z', 'M200 ' + (y + 40) + 'Q' + (250 + i * 3) + ' ' + (y + 10) + ' ' + (275 - i * 5) + ' ' + (y - 10) + 'Q230 ' + y + ' 200 ' + (y + 15) + 'Z') } }
      o.push(L('M200 330V60'));
    }],
    train: ['기차', function (o, lv) {
      o.push(rect(70, 90, 40, 70)); o.push(rect(50, 150, 190, 140, 10)); o.push(rect(220, 100, 130, 190, 10)); o.push(rect(245, 125, 80, 60, 6));
      o.push(circ(100, 300, 38), circ(195, 300, 38), circ(300, 300, 38)); if (lv > 1) { o.push(circ(100, 300, 14), circ(195, 300, 14), circ(300, 300, 14)); o.push(rect(70, 185, 40, 40, 5), rect(130, 185, 40, 40, 5)); o.push(circ(70, 60, 22), circ(105, 35, 16), circ(135, 18, 10)); o.push(rect(20, 345, 360, 16)) }
    }],
    bear: ['곰', function (o, lv) {
      o.push(circ(100, 100, 50), circ(300, 100, 50)); if (lv > 1) o.push(circ(100, 100, 25), circ(300, 100, 25));
      o.push(circ(200, 210, 150)); o.push(ell(200, 270, 65, 50)); o.push(ell(200, 245, 24, 16)); o.push(circ(145, 180, 16), circ(255, 180, 16));
      o.push(L('M200 262v18M200 280q-20 18-35 5M200 280q20 18 35 5')); if (lv > 1) o.push(ell(120, 240, 22, 14), ell(280, 240, 22, 14));
    }],
    penguin: ['펭귄', function (o, lv) {
      o.push(ell(150, 370, 40, 15), ell(250, 370, 40, 15)); o.push(ell(200, 220, 120, 160)); o.push(ell(85, 230, 25, 90, 15), ell(315, 230, 25, 90, -15));
      o.push(ell(200, 250, 80, 120)); o.push(circ(165, 140, 18), circ(235, 140, 18)); o.push(poly([[180, 165], [220, 165], [200, 195]]));
      if (lv > 1) { o.push(circ(165, 140, 7), circ(235, 140, 7)); o.push(rect(130, 210, 140, 22, 6)); o.push(rect(185, 200, 30, 70, 6)) }
    }],
    gift: ['선물', function (o, lv) {
      o.push(ell(160, 105, 50, 30, -20), ell(240, 105, 50, 30, 20)); o.push(rect(70, 180, 260, 190)); o.push(rect(55, 130, 290, 60)); o.push(rect(180, 130, 40, 240)); o.push(circ(200, 125, 20));
      if (lv > 1) { for (var i = 0; i < 4; i++) o.push(circ(110 + (i % 2) * 180, 230 + Math.floor(i / 2) * 80, 18)); o.push(star(110, 160, 5, 14, 6), star(290, 160, 5, 14, 6)) }
    }],
    cake: ['케이크', function (o, lv) {
      [150, 200, 250].forEach(function (x) { o.push(ell(x, 70, 10, 18)); o.push(rect(x - 8, 85, 16, 60, 4)) });
      o.push(rect(90, 145, 220, 90, 10)); o.push(rect(50, 230, 300, 120, 10)); o.push(rect(30, 345, 340, 20, 8));
      if (lv > 1) { for (var i = 0; i < 6; i++) o.push(circ(75 + i * 50, 235, 22)); for (var j = 0; j < 4; j++) o.push(circ(120 + j * 53, 150, 18)); o.push(heart(200, 295, 30)) }
    }],
    dog: ['강아지', function (o, lv) {
      o.push(ell(95, 180, 45, 95, 20), ell(305, 180, 45, 95, -20)); o.push(circ(200, 200, 135)); o.push(ell(200, 265, 70, 55));
      o.push(ell(200, 235, 28, 20)); o.push(circ(150, 175, 17), circ(250, 175, 17)); o.push('M185 300h30v25a15 15 0 0 1-30 0Z');
      if (lv > 1) { o.push(ell(255, 145, 40, 32)); o.push(circ(250, 175, 17)); o.push(rect(120, 330, 160, 30, 15)); o.push(circ(200, 365, 16)) }
    }],
    rabbit: ['토끼', function (o, lv) {
      o.push(ell(150, 100, 32, 90, -10), ell(250, 100, 32, 90, 10)); o.push(ell(150, 105, 15, 65, -10), ell(250, 105, 15, 65, 10));
      o.push(circ(200, 250, 120)); o.push(circ(160, 230, 15), circ(240, 230, 15)); o.push(ell(200, 270, 15, 10)); o.push(L('M200 280v15M200 295q-15 15-30 5M200 295q15 15 30 5'));
      if (lv > 1) { o.push(ell(140, 280, 22, 13), ell(260, 280, 22, 13)); o.push(heart(330, 350, 25), heart(70, 350, 25)) }
    }],
  };
  var OBJ_KEYS = Object.keys(OBJ);

  /* ── 무늬 ── */
  function frame(o, k) { o.push(rect(8, 8, 384, 384, 18)); o.push(rect(8 + k, 8 + k, 384 - 2 * k, 384 - 2 * k, 12)) }
  var PAT = {
    big: function (o, r, p) {   // 큰 도형 하나와 안쪽 몇 겹
      var t = p.v % 6, n = p.layers || 2;
      for (var i = 0; i < n; i++) {
        var s = 1 - i / (n + .4);
        if (t === 0) o.push(circ(200, 200, 180 * s)); else if (t === 1) o.push(star(200, 210, 5, 185 * s, 78 * s)); else if (t === 2) o.push(heart(200, 205, 155 * s));
        else if (t === 3) o.push(ngon(200, 200, 6, 185 * s, 0)); else if (t === 4) o.push(rect(200 - 170 * s, 200 - 170 * s, 340 * s, 340 * s, 20 * s)); else o.push(ngon(200, 210, 3, 190 * s));
      }
    },
    grid: function (o, r, p) {  // 바둑판 칸 + 칸마다 도형
      var n = p.n, w = 360 / n; o.push(rect(20, 20, 360, 360));
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
        var x = 20 + j * w, y = 20 + i * w, k = (p.shape === 'mix') ? Math.floor(r() * 4) : p.shape; o.push(rect(x, y, w, w));
        if (k === 0 || k === 'c') o.push(circ(x + w / 2, y + w / 2, w * .34)); else if (k === 1 || k === 's') o.push(star(x + w / 2, y + w / 2 + w * .03, 5, w * .4, w * .17)); else if (k === 2 || k === 'h') o.push(heart(x + w / 2, y + w / 2, w * .33)); else if (k === 3) o.push(rect(x + w * .2, y + w * .2, w * .6, w * .6, w * .1));
        if (p.inner) o.push(circ(x + w / 2, y + w / 2, w * .14));
      }
    },
    flowerbig: function (o, r, p) {  // 큰 꽃 한 송이(꽃잎 수만 바꿈)
      var n = p.n; for (var i = 0; i < n; i++) o.push(petal(200, 200, i * 360 / n, 40, 185, 180 / n * .9, 0));
      o.push(circ(200, 200, 60)); if (p.layers > 1) { for (var j = 0; j < n; j++) o.push(petal(200, 200, j * 360 / n + 180 / n, 40, 120, 180 / n * .8, 0)); o.push(circ(200, 200, 45)); o.push(circ(200, 200, 20)) }
    },
    truchet: function (o, r, p) {   // 사분원 타일
      var n = p.n, w = 360 / n; o.push(rect(20, 20, 360, 360));
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
        var x = 20 + j * w, y = 20 + i * w, flip = r() < .5; o.push(rect(x, y, w, w));
        var cs = flip ? [[x, y, 0], [x + w, y + w, 180]] : [[x + w, y, 90], [x, y + w, 270]];
        cs.forEach(function (c) { var a0 = c[2], p0 = pol(c[0], c[1], w / 2, a0), p1 = pol(c[0], c[1], w / 2, a0 + 90); o.push('M' + f(c[0]) + ' ' + f(c[1]) + 'L' + f(p0[0]) + ' ' + f(p0[1]) + 'A' + f(w / 2) + ' ' + f(w / 2) + ' 0 0 1 ' + f(p1[0]) + ' ' + f(p1[1]) + 'Z') });
      }
    },
    hexgrid: function (o, r, p) {
      var s = p.s, h = s * Math.sqrt(3); o.push(rect(10, 10, 380, 380));
      for (var row = -1; row * h * .5 < 400 + h; row++) for (var col = -1; col * s * 1.5 < 400 + s; col++) {
        var cx = 10 + col * s * 1.5, cy = 10 + row * h + (col % 2 ? h / 2 : 0);
        if (cx < 10 - s || cx > 390 + s || cy < 10 - s || cy > 390 + s) continue;
        o.push(ngon(cx, cy, 6, s - 2, 0)); if (p.inner) o.push(ngon(cx, cy, 6, s * .5, 30)); if (p.dot) o.push(circ(cx, cy, s * .2));
      }
      o.clip = 1;
    },
    twist: function (o, r, p) {   // 변을 따라 조금씩 들어가며 작아지는 다각형(소용돌이)
      var v = []; for (var i = 0; i < p.sides; i++) v.push(pol(200, p.sides === 3 ? 225 : 200, p.sides === 3 ? 215 : 190, -90 + i * 360 / p.sides));
      var t = p.t || .15;
      for (var k = 0; k < p.n; k++) {
        o.push(poly(v)); var nv = [];
        for (var j = 0; j < v.length; j++) { var q = v[(j + 1) % v.length]; nv.push([v[j][0] + (q[0] - v[j][0]) * t, v[j][1] + (q[1] - v[j][1]) * t]) }
        v = nv; if (Math.hypot(v[0][0] - v[1][0], v[0][1] - v[1][1]) < 14) break;
      }
    },
    stars: function (o, r, p) {   // 흩어진 별·동그라미 밤하늘
      o.push(rect(10, 10, 380, 380, 16)); var pts = [];
      for (var t = 0; t < 400 && pts.length < p.n; t++) {
        var x = 30 + r() * 340, y = 30 + r() * 340, s = 12 + r() * p.max;
        if (pts.every(function (q) { return Math.hypot(q[0] - x, q[1] - y) > q[2] + s + 4 }) && x - s > 12 && x + s < 388 && y - s > 12 && y + s < 388) pts.push([x, y, s]);
      }
      pts.forEach(function (q, i) { var k = i % 3; o.push(k === 0 ? star(q[0], q[1], 5, q[2], q[2] * .42) : k === 1 ? circ(q[0], q[1], q[2] * .8) : heart(q[0], q[1], q[2] * .8)); if (p.inner) o.push(circ(q[0], q[1], q[2] * .3)) });
    },
    scales: function (o, r, p) {   // 물고기 비늘
      var s = p.s; o.push(rect(10, 10, 380, 380)); for (var row = 0; row * s * .5 < 400 + s; row++) for (var col = -1; col * s < 420; col++) {
        var cx = 10 + col * s + (row % 2 ? s / 2 : 0), cy = 10 + row * s * .5; o.push(circ(cx, cy, s * .55)); if (p.inner) o.push(circ(cx, cy, s * .3));
      } o.clip = 1;
    },
    weave: function (o, r, p) {   // 벽돌·바구니
      var n = p.n, w = 380 / n; o.push(rect(10, 10, 380, 380));
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) { var x = 10 + j * w, y = 10 + i * w; if ((i + j) % 2) { for (var k = 0; k < 3; k++) o.push(rect(x, y + k * w / 3, w, w / 3)) } else { for (var m = 0; m < 3; m++) o.push(rect(x + m * w / 3, y, w / 3, w)) } }
    },
  };

  /* ── 만다라 ── 바깥 층부터 안쪽으로. p: {layers, nmin, nmax, nest, seed} */
  function mandala(o, r, p) {
    var L = p.layers, Rs = [192], ns = [6, 8, 10, 12, 16, 18, 20, 24].filter(function (n) { return n >= p.nmin && n <= p.nmax });
    for (var i = 1; i <= L; i++) Rs.push(192 * Math.pow(1 - i / (L + 1.3), 1.15));
    var types = ['petal', 'point', 'round', 'seg', 'scallop', 'star', 'double', 'drop'];
    var n = ns[Math.floor(r() * ns.length)];
    if (p.frame) { o.push(rect(4, 4, 392, 392, 10)); for (var c = 0; c < 4; c++) { var cx = c % 2 ? 360 : 40, cy = c < 2 ? 40 : 360; o.push(circ(cx, cy, 30)); o.push(star(cx, cy, 8, 26, 12)); o.push(circ(cx, cy, 8)) } }
    for (var l = 0; l < L; l++) {
      var Ro = Rs[l], Ri = Rs[l + 1], t = types[Math.floor(r() * types.length)], step, k;
      if (l > 0 && r() < .5) n = ns[Math.floor(r() * ns.length)];
      if (Ro < 40 && n > 12) n = 8;
      if (Ro < 25) t = 'petal';
      step = 360 / n; var off = r() < .5 ? 0 : step / 2, w = step / 2 * .92;
      if (t === 'scallop') { for (k = 0; k < n * 2; k++) o.push(circ.apply(null, pol(200, 200, Ro - (Ro - Ri) * .35, k * step / 2 + off).concat([Math.min((Ro - Ri) * .4, Ro * PI / (n * 2) * 1.05)]))); o.push(circ(200, 200, Ro - (Ro - Ri) * .35)); continue }
      o.push(circ(200, 200, Ro));
      if (t === 'petal' || t === 'point' || t === 'drop') {
        for (k = 0; k < n; k++) { var a = k * step + off; o.push(petal(200, 200, a, Ri * .96, Ro * .985, w * (t === 'drop' ? .75 : 1), t === 'point' ? 1 : 0)); if (p.nest && r() < p.nest + .2 && Ro - Ri > 18) o.push(petal(200, 200, a, Ri * .96 + (Ro - Ri) * .15, Ri + (Ro - Ri) * .7, w * .5, t === 'point' ? 1 : 0)); }
        if (t === 'drop') for (k = 0; k < n; k++) o.push(circ.apply(null, pol(200, 200, Ro - (Ro - Ri) * .12, k * step + off + step / 2).concat([Math.min((Ro - Ri) * .1, 6)])));
      } else if (t === 'round') {
        var rr = Math.min((Ro - Ri) / 2 * .95, (Ri + Ro) / 2 * Math.sin(PI / n) * .95);
        for (k = 0; k < n; k++) { var cp = pol(200, 200, (Ro + Ri) / 2, k * step + off); o.push(circ(cp[0], cp[1], rr)); if (p.nest && rr > 9) o.push(circ(cp[0], cp[1], rr * .5)) }
      } else if (t === 'seg') {
        for (k = 0; k < n; k++) { o.push(seg(200, 200, Ri, Ro, k * step + off, (k + 1) * step + off)); if (p.nest && (Ro - Ri) > 16) o.push(seg(200, 200, Ri + (Ro - Ri) * .3, Ro - (Ro - Ri) * .3, k * step + off + step * .2, (k + 1) * step + off - step * .2)) }
      } else if (t === 'star') {
        o.push(star(200, 200, n, Ro * .985, Ri, -90 + off)); if (p.nest) o.push(star(200, 200, n, Ri + (Ro - Ri) * .6, Ri, -90 + off));
      } else if (t === 'double') {
        for (k = 0; k < n; k++) o.push(petal(200, 200, k * step + off + step / 2, Ri * .96, Ro * .985, w * .9, 1));
        for (k = 0; k < n; k++) o.push(petal(200, 200, k * step + off, Ri * .96, Ri + (Ro - Ri) * .75, w * .8, 0));
      }
    }
    var Rc = Rs[L]; o.push(circ(200, 200, Rc)); if (Rc > 14) { o.push(star(200, 200, ns[0] || 6, Rc * .9, Rc * .5)); o.push(circ(200, 200, Rc * .3)) }
  }

  function make(spec) {
    var o = [], r = rng(spec.seed || 1);
    if (spec.k === 'obj') { var lv = spec.lv || 1; if (lv > 1 && spec.fr) frame(o, 26); OBJ[spec.o][1](o, lv) }
    else if (spec.k === 'pair' || spec.k === 'quad') {   // 사물 2개(나란히)·4개(2×2)를 작게 한 장에
      o.push(rect(8, 8, 384, 384, 16));
      var pos = spec.k === 'pair' ? [[0, 70, .5], [200, 70, .5]] : [[6, 6, .47], [206, 6, .47], [6, 206, .47], [206, 206, .47]];
      if (spec.k === 'pair') o.push(rect(8, 300, 384, 92, 0));
      spec.os.forEach(function (name, j) {
        var t = [], p = pos[j]; OBJ[name][1](t, spec.lv || 1);
        t.forEach(function (e) { var x = typeof e === 'string' ? { d: e } : e; x.tf = 'translate(' + p[0] + ' ' + p[1] + ') scale(' + p[2] + ')'; o.push(x) });
      });
    }
    else if (spec.k === 'man') mandala(o, r, spec);
    else PAT[spec.k](o, r, spec);
    return { els: o.map(function (e) { return typeof e === 'string' ? { d: e } : e }), clip: !!o.clip };
  }
  function title(spec) {
    if (spec.k === 'obj') return OBJ[spec.o][0];
    if (spec.k === 'pair') { var a = OBJ[spec.os[0]][0], c = a.charCodeAt(a.length - 1) - 0xAC00; return a + ((c >= 0 && c % 28) ? '과 ' : '와 ') + OBJ[spec.os[1]][0] }
    if (spec.k === 'quad') return spec.os.map(function (n) { return OBJ[n][0] }).join('·');
    if (spec.k === 'big') return ['동그라미', '큰 별', '큰 하트', '육각형', '네모', '세모'][spec.v % 6] + (spec.layers > 1 ? ' 겹무늬' : '');
    return { pair: '사물 둘', quad: '사물 넷', big: '큰 도형', grid: '바둑판 무늬', flowerbig: '큰 꽃', truchet: '물결 타일', hexgrid: '벌집 무늬', twist: '빙글빙글 도형', stars: '밤하늘', scales: '비늘 무늬', weave: '바구니 무늬', man: '만다라' }[spec.k];
  }
  /* SVG 만들기: fills = {칸 번호: 색}, sw = 선 굵기 */
  function svg(spec, fills, sw, cls) {
    var m = make(spec), s = '', k = 0;
    m.els.forEach(function (e) {
      var tf = e.tf ? ' transform="' + e.tf + '" vector-effect="non-scaling-stroke"' : '';
      if (e.line) s += '<path class="cl-ln" d="' + e.d + '"' + tf + ' fill="none" stroke="#2A221C" stroke-width="' + sw + '" stroke-linecap="round"/>';
      else { s += '<path class="cl-r" data-k="' + k + '" d="' + e.d + '"' + tf + ' fill="' + ((fills && fills[k]) || '#fff') + '" stroke="#2A221C" stroke-width="' + sw + '" stroke-linejoin="round"/>'; k++ }
    });
    var clip = m.clip ? '<defs><clipPath id="clc"><rect x="10" y="10" width="380" height="380"/></clipPath></defs><g clip-path="url(#clc)">' + s + '</g><rect x="10" y="10" width="380" height="380" fill="none" stroke="#2A221C" stroke-width="' + sw * 1.4 + '"/>' : s;
    return { html: '<svg class="' + (cls || 'cl-svg') + '" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">' + clip + '</svg>', n: k };
  }
  return { make: make, svg: svg, title: title, OBJ_KEYS: OBJ_KEYS };
})();
if (typeof module !== 'undefined') module.exports = CD;
