/* 숨은 그림 찾기 생성기 — 같은 학년·번호면 언제나 같은 그림. 화면 400×400.
   장면(배경 그림) 위에 물건 그림을 숨김. 쉬움: 흰 바탕으로 또렷하게 / 보통: 선만, 배경과 겹침 / 도전: 작고 기울어지고 위에 무늬가 덮임 */
var HP = (function () {
  var PI = Math.PI;
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
  function rn(r, a, b) { return a + r() * (b - a) }
  function pick(r, a) { return a[Math.floor(r() * a.length)] }
  function shuf(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t } return a }
  function f(n) { return Math.round(n * 10) / 10 }
  function circ(cx, cy, r) { return 'M' + f(cx - r) + ' ' + f(cy) + 'a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(2 * r) + ' 0a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(-2 * r) + ' 0Z' }
  function ell(cx, cy, rx, ry) { return 'M' + f(cx - rx) + ' ' + f(cy) + 'a' + f(rx) + ' ' + f(ry) + ' 0 1 0 ' + f(2 * rx) + ' 0a' + f(rx) + ' ' + f(ry) + ' 0 1 0 ' + f(-2 * rx) + ' 0Z' }
  function star(cx, cy, n, r1, r2) { var p = []; for (var i = 0; i < 2 * n; i++) { var a = -PI / 2 + i * PI / n, q = i % 2 ? r2 : r1; p.push(f(cx + q * Math.cos(a)) + ' ' + f(cy + q * Math.sin(a))) } return 'M' + p.join('L') + 'Z' }

  /* ── 숨길 물건(가운데 0,0, 크기 약 40). 'L:'로 시작하면 선만 ── */
  var ICONS = {
    heart: ['하트', ['M0 14C-18 2-16-14-6-14C-2-14 0-10 0-8C0-10 2-14 6-14C16-14 18 2 0 14Z']],
    star: ['별', [star(0, 2, 5, 19, 8)]],
    moon: ['초승달', ['M4-17A17 17 0 1 0 4 17A13 13 0 1 1 4-17Z']],
    fish: ['물고기', ['M-17 0C-8-11 6-11 12 0C6 11-8 11-17 0Z', 'M12 0L20-8V8Z', circ(-8, -2, 2)]],
    umbrella: ['우산', ['M-18 2A18 18 0 0 1 18 2Q12-3 6 2Q0-3-6 2Q-12-3-18 2Z', 'L:M0 2V15Q0 19-4 19Q-7 19-7 16']],
    key: ['열쇠', [circ(-11, 0, 7), 'L:M-4 0H19M13 0V7M18 0V6']],
    pencil: ['연필', ['M-18-4H9L18 0L9 4H-18Z', 'L:M9-4V4M-13-4V4']],
    cup: ['컵', ['M-12-12H9V8Q9 14 3 14H-6Q-12 14-12 8Z', 'L:M9-6Q17-6 17 1Q17 7 9 7']],
    partyhat: ['고깔모자', ['M0-17L12 14H-12Z', circ(0, -19, 3), 'L:M-6 0L6 4M-9 8L9 11']],
    sock: ['양말', ['M-7-17H5V1L13 7Q16 13 10 16L-3 12Q-7 10-7 5Z']],
    banana: ['바나나', ['M-17-8Q-6 15 17-5Q15 2 8 6Q-8 15-17-8Z']],
    carrot: ['당근', ['M-5-8H5L0 18Z', 'L:M-2-8L-6-17M0-8V-19M2-8L6-17M-2 0H1M-1 7H1']],
    bell: ['종', ['M-12 8Q-12-14 0-14Q12-14 12 8Z', 'M-15 8H15V11H-15Z', circ(0, 14, 3)]],
    mushroom: ['버섯', ['M-17 0Q-17-17 0-17Q17-17 17 0Z', 'M-6 0V14H6V0Z', circ(-6, -8, 3)]],
    spoon: ['숟가락', [ell(0, -10, 6, 9), 'L:M0-1V19']],
    glasses: ['안경', [circ(-9, 0, 7), circ(9, 0, 7), 'L:M-2 0H2M-16 0L-20-5M16 0L20-5']],
    button: ['단추', [circ(0, 0, 13), circ(-4, -4, 2), circ(4, -4, 2), circ(-4, 4, 2), circ(4, 4, 2)]],
    kite: ['연', ['M0-19L12 0L0 14L-12 0Z', 'L:M0-19V14M-12 0H12M0 14Q5 18 0 21Q-4 24 0 27']],
    leaf: ['나뭇잎', ['M0 17Q-15 0 0-19Q15 0 0 17Z', 'L:M0 17V-13M0 2L-6-4M0 7L6 1']],
    bird: ['새', ['L:M-16-2Q-8-12 0-2Q8-12 16-2']],
    shoe: ['신발', ['M-17-8V8H17Q17 1 8-1L-2-3V-8Z', 'L:M-17 3H17']],
    book: ['책', ['M-14-12H14V12H-14Z', 'L:M0-12V12M-10-6H-4M4-6H10']],
    apple: ['사과', ['M0-8C-15-14-17 3-10 11C-6 16-2 14 0 12C2 14 6 16 10 11C17 3 15-14 0-8Z', 'L:M0-8V-15M0-12Q6-19 10-14']],
    candy: ['막대사탕', [circ(0, -6, 11), 'L:M0 5V20M-6-6Q0-12 6-6Q0 0-3-5']],
    flag: ['깃발', ['M-9-16H13L7-8L13 0H-9Z', 'L:M-9-16V19']],
    crown: ['왕관', ['M-15 9V-9L-7 0L0-13L7 0L15-9V9Z']],
    gem: ['보석', ['M-13-4L-7-12H7L13-4L0 14Z', 'L:M-13-4H13M-4-4L0 14L4-4']],
    hammer: ['망치', ['M-15-11H7V-3H-15Z', 'M-5-3H-1V19H-5Z']],
    balloon: ['풍선', [ell(0, -6, 11, 13), 'M-3 7H3L0 10Z', 'L:M0 10Q-4 15 0 20']],
    icecream: ['아이스크림', ['M-9-3L0 18L9-3Z', circ(0, -8, 9)]],
    boat: ['돛단배', ['M-17 6H17L11 15H-11Z', 'M1 4V-19L14 4Z', 'L:M1 4V6']],
    snail: ['달팽이', ['M-17 12H15Q19 12 19 8V2Q16 6 13 6Z', circ(-2, 1, 11), 'L:M-2 1m-5 0a5 5 0 1 0 5-5M15 2L13-8M18 3L19-7']],
    scissors: ['가위', [circ(-8, 10, 5), circ(8, 10, 5), 'L:M-5 6L8-17M5 6L-8-17']],
    clock: ['시계', [circ(0, 0, 14), 'L:M0 0V-9M0 0L6 4']],
    tshirt: ['티셔츠', ['M-7-14L-18-7L-13 1L-9-2V15H9V-2L13 1L18-7L7-14Q0-8-7-14Z']],
  };
  var ICON_KEYS = Object.keys(ICONS);

  /* ── 장면 꾸밈 그림 ── 반환: [d, 채움?] */
  var C = {
    tree: function (r, x, y, s) { return [['M' + f(x - 5 * s) + ' ' + f(y) + 'h' + f(10 * s) + 'v' + f(28 * s) + 'h' + f(-10 * s) + 'Z', 1], [circ(x - 9 * s, y - 2 * s, 12 * s), 1], [circ(x + 9 * s, y - 2 * s, 12 * s), 1], [circ(x, y - 14 * s, 14 * s), 1]] },
    bush: function (r, x, y, s) { return [['M' + f(x - 24 * s) + ' ' + f(y) + 'a' + f(9 * s) + ' ' + f(9 * s) + ' 0 0 1 ' + f(14 * s) + ' -' + f(8 * s) + 'a' + f(11 * s) + ' ' + f(11 * s) + ' 0 0 1 ' + f(20 * s) + ' 0a' + f(9 * s) + ' ' + f(9 * s) + ' 0 0 1 ' + f(14 * s) + ' ' + f(8 * s) + 'Z', 1]] },
    house: function (r, x, y, s) { return [['M' + f(x - 18 * s) + ' ' + f(y - 6 * s) + 'L' + f(x) + ' ' + f(y - 24 * s) + 'L' + f(x + 18 * s) + ' ' + f(y - 6 * s) + 'Z', 1], ['M' + f(x - 14 * s) + ' ' + f(y - 6 * s) + 'h' + f(28 * s) + 'v' + f(26 * s) + 'h' + f(-28 * s) + 'Z', 1], ['M' + f(x - 4 * s) + ' ' + f(y + 20 * s) + 'v' + f(-12 * s) + 'h' + f(8 * s) + 'v' + f(12 * s), 0], ['M' + f(x + 6 * s) + ' ' + f(y) + 'h' + f(6 * s) + 'v' + f(6 * s) + 'h' + f(-6 * s) + 'Z', 1]] },
    cloud: function (r, x, y, s) { return [[circ(x - 12 * s, y + 2 * s, 9 * s), 1], [circ(x + 12 * s, y + 2 * s, 9 * s), 1], [circ(x, y - 4 * s, 13 * s), 1], ['M' + f(x - 12 * s) + ' ' + f(y + 11 * s) + 'H' + f(x + 12 * s), 0]] },
    flower: function (r, x, y, s) { var o = [['M' + f(x) + ' ' + f(y + 6 * s) + 'v' + f(22 * s), 0]]; for (var i = 0; i < 5; i++) { var a = i * 2 * PI / 5; o.push([circ(x + 7 * s * Math.cos(a), y + 7 * s * Math.sin(a), 5 * s), 1]) } o.push([circ(x, y, 4 * s), 1]); return o },
    grass: function (r, x, y, s) { return [['M' + f(x - 9 * s) + ' ' + f(y) + 'l' + f(3 * s) + ' ' + f(-9 * s) + 'l' + f(3 * s) + ' ' + f(9 * s) + 'l' + f(3 * s) + ' ' + f(-12 * s) + 'l' + f(3 * s) + ' ' + f(12 * s) + 'l' + f(3 * s) + ' ' + f(-8 * s) + 'l' + f(3 * s) + ' ' + f(8 * s), 0]] },
    rock: function (r, x, y, s) { var p = []; for (var i = 0; i < 7; i++) { var a = i * 2 * PI / 7, q = rn(r, 8, 14) * s; p.push(f(x + q * Math.cos(a)) + ' ' + f(y + q * Math.sin(a) * .7)) } return [['M' + p.join('L') + 'Z', 1]] },
    bubble: function (r, x, y, s) { return [[circ(x, y, rn(r, 3, 7) * s), 1], [circ(x + 9 * s, y - 8 * s, rn(r, 2, 4) * s), 1]] },
    weed: function (r, x, y, s) { return [['M' + f(x) + ' ' + f(y) + 'q' + f(-8 * s) + ' ' + f(-10 * s) + ' 0 ' + f(-20 * s) + 't0 ' + f(-20 * s), 0], ['M' + f(x + 6 * s) + ' ' + f(y) + 'q' + f(8 * s) + ' ' + f(-8 * s) + ' 0 ' + f(-16 * s), 0]] },
    shell: function (r, x, y, s) { return [['M' + f(x) + ' ' + f(y + 8 * s) + 'L' + f(x - 12 * s) + ' ' + f(y - 4 * s) + 'A' + f(12 * s) + ' ' + f(12 * s) + ' 0 0 1 ' + f(x + 12 * s) + ' ' + f(y - 4 * s) + 'Z', 1], ['M' + f(x) + ' ' + f(y + 8 * s) + 'L' + f(x - 5 * s) + ' ' + f(y - 14 * s) + 'M' + f(x) + ' ' + f(y + 8 * s) + 'L' + f(x + 5 * s) + ' ' + f(y - 14 * s), 0]] },
    sfish: function (r, x, y, s) { return [['M' + f(x - 10 * s) + ' ' + f(y) + 'q' + f(10 * s) + ' ' + f(-9 * s) + ' ' + f(18 * s) + ' 0q' + f(-8 * s) + ' ' + f(9 * s) + ' ' + f(-18 * s) + ' 0Z', 1], ['M' + f(x + 8 * s) + ' ' + f(y) + 'l' + f(6 * s) + ' ' + f(-5 * s) + 'v' + f(10 * s) + 'Z', 1]] },
    planet: function (r, x, y, s) { return [[circ(x, y, 12 * s), 1], ['M' + f(x - 20 * s) + ' ' + f(y + 3 * s) + 'q' + f(20 * s) + ' ' + f(10 * s) + ' ' + f(40 * s) + ' ' + f(-6 * s), 0]] },
    crater: function (r, x, y, s) { return [[ell(x, y, 9 * s, 6 * s), 1], [ell(x + 3 * s, y + 1 * s, 4 * s, 2.5 * s), 1]] },
    twinkle: function (r, x, y, s) { return [['M' + f(x) + ' ' + f(y - 7 * s) + 'V' + f(y + 7 * s) + 'M' + f(x - 7 * s) + ' ' + f(y) + 'H' + f(x + 7 * s), 0]] },
    fence: function (r, x, y, s) { var o = []; for (var i = 0; i < 4; i++) o.push(['M' + f(x - 16 * s + i * 10 * s) + ' ' + f(y + 12 * s) + 'v' + f(-20 * s) + 'l' + f(3 * s) + ' ' + f(-4 * s) + 'l' + f(3 * s) + ' ' + f(4 * s) + 'v' + f(20 * s) + 'Z', 1]); o.push(['M' + f(x - 18 * s) + ' ' + f(y - 2 * s) + 'H' + f(x + 22 * s), 0]); return o },
    vbird: function (r, x, y, s) { return [['M' + f(x - 7 * s) + ' ' + f(y) + 'q' + f(4 * s) + ' ' + f(-5 * s) + ' ' + f(7 * s) + ' 0q' + f(3 * s) + ' ' + f(-5 * s) + ' ' + f(7 * s) + ' 0', 0]] },
    sunc: function (r, x, y, s) { var o = []; for (var i = 0; i < 8; i++) { var a = i * PI / 4; o.push(['M' + f(x + 15 * s * Math.cos(a)) + ' ' + f(y + 15 * s * Math.sin(a)) + 'L' + f(x + 22 * s * Math.cos(a)) + ' ' + f(y + 22 * s * Math.sin(a)), 0]) } o.push([circ(x, y, 11 * s), 1]); return o },
    hatch: function (r, x, y, s) { var a = rn(r, 0, PI), d = ''; for (var i = -2; i <= 2; i++) { var ox = -Math.sin(a) * i * 4 * s, oy = Math.cos(a) * i * 4 * s; d += 'M' + f(x + ox - Math.cos(a) * 8 * s) + ' ' + f(y + oy - Math.sin(a) * 8 * s) + 'l' + f(Math.cos(a) * 16 * s) + ' ' + f(Math.sin(a) * 16 * s) } return [[d, 0]] },
    curl: function (r, x, y, s) { return [['M' + f(x) + ' ' + f(y) + 'a' + f(4 * s) + ' ' + f(4 * s) + ' 0 1 1 ' + f(8 * s) + ' 0a' + f(8 * s) + ' ' + f(8 * s) + ' 0 1 1 ' + f(-16 * s) + ' 0', 0]] },
    dots: function (r, x, y, s) { return [[circ(x, y, 1.6 * s), 1], [circ(x + 7 * s, y + 3 * s, 1.6 * s), 1], [circ(x - 4 * s, y + 8 * s, 1.6 * s), 1]] },
    mush: function (r, x, y, s) { return [['M' + f(x - 9 * s) + ' ' + f(y) + 'a' + f(9 * s) + ' ' + f(8 * s) + ' 0 0 1 ' + f(18 * s) + ' 0Z', 1], ['M' + f(x - 3 * s) + ' ' + f(y) + 'v' + f(9 * s) + 'h' + f(6 * s) + 'v' + f(-9 * s), 0]] },
    pebble: function (r, x, y, s) { return [[ell(x, y, 8 * s, 5 * s), 1]] },
  };
  var SCENES = [
    { name: '숲 속', bg: 'forest', items: ['tree', 'tree', 'bush', 'grass', 'grass', 'rock', 'mush', 'flower', 'cloud'], over: ['grass', 'hatch', 'curl', 'dots'], no: ['leaf', 'mushroom'] },
    { name: '바닷속', bg: 'sea', items: ['sfish', 'weed', 'weed', 'bubble', 'shell', 'rock', 'pebble', 'bubble'], over: ['bubble', 'curl', 'hatch', 'dots'], no: ['fish', 'boat'] },
    { name: '우리 마을', bg: 'town', items: ['house', 'house', 'tree', 'cloud', 'fence', 'bush', 'grass', 'pebble'], over: ['hatch', 'grass', 'dots', 'vbird'], no: [] },
    { name: '하늘', bg: 'sky', items: ['cloud', 'cloud', 'vbird', 'vbird', 'sunc', 'twinkle', 'curl'], over: ['vbird', 'curl', 'hatch', 'twinkle'], no: ['bird', 'balloon', 'kite'] },
    { name: '꽃밭', bg: 'garden', items: ['flower', 'flower', 'flower', 'grass', 'fence', 'pebble', 'bush', 'vbird'], over: ['grass', 'dots', 'curl', 'hatch'], no: ['leaf'] },
    { name: '우주', bg: 'space', items: ['planet', 'crater', 'twinkle', 'twinkle', 'dots', 'curl', 'planet'], over: ['twinkle', 'dots', 'hatch', 'curl'], no: ['star', 'moon'] },
  ];
  function background(sc, r) {
    var o = [];
    if (sc.bg === 'forest' || sc.bg === 'town' || sc.bg === 'garden') { o.push(['M8 ' + f(rn(r, 250, 280)) + 'Q120 ' + f(rn(r, 220, 260)) + ' 220 ' + f(rn(r, 250, 275)) + 'T392 ' + f(rn(r, 240, 270)) + 'V392H8Z', 1]) }
    if (sc.bg === 'town') o.push(['M8 330Q200 300 392 335', 0], ['M8 350Q200 322 392 357', 0]);
    if (sc.bg === 'sea') for (var i = 0; i < 4; i++) { var y = 50 + i * 90 + rn(r, -10, 10), d = 'M8 ' + f(y); for (var x = 8; x < 392; x += 40) d += 'q10 -8 20 0t20 0'; o.push([d, 0]) }
    if (sc.bg === 'sky') o.push(['M8 ' + f(rn(r, 320, 340)) + 'Q100 ' + f(rn(r, 290, 310)) + ' 200 ' + f(rn(r, 330, 345)) + 'T392 ' + f(rn(r, 315, 335)) + 'V392H8Z', 1]);
    if (sc.bg === 'space') { o.push([circ(rn(r, 60, 340), rn(r, 60, 340), 40), 1]) }
    return o;
  }

  /* ── 학년·단계 설정 ── */
  function specs(g) {
    var S = [];
    for (var b = 0; b < 3; b++) for (var k = 0; k < 30; k++) {
      var t = k / 29;
      S.push({
        seed: g * 1000 + b * 100 + k + 1, lv: ['쉬움', '보통', '도전'][b], sc: (k + g + b * 2) % 6,
        n: [4, 6, 8][b] + Math.floor((g - 1) / 2) + (t > .66 ? 1 : 0),
        size: Math.max(.62, [1.45, 1.12, .92][b] - (g - 1) * .07 - t * .1),
        rot: [g <= 2 ? 0 : 15, 35 + g * 5, 180][b], fill: b === 0, hard: b === 2,
        clutter: [16, 24, 32][b] + g * 3 + Math.round(t * 8), over: [0, 6 + g * 2, 16 + g * 4][b] + Math.round(t * 6),
        sw: Math.max(1.3, 2.5 - g * .18)
      });
    }
    return S;
  }
  function make(s) {
    var r = rng(s.seed), sc = SCENES[s.sc], R = 21 * s.size, pool = shuf(r, ICON_KEYS.filter(function (k) { return sc.no.indexOf(k) < 0 })), T = [];
    for (var i = 0; i < s.n; i++) {
      var p, ok = false;
      for (var tr = 0; tr < 400 && !ok; tr++) { p = [rn(r, R + 14, 400 - R - 14), rn(r, R + 14, 400 - R - 14)]; ok = T.every(function (q) { return Math.hypot(q.x - p[0], q.y - p[1]) > 2 * R + 16 }) }
      T.push({ k: pool[i], x: p[0], y: p[1], a: s.rot ? rn(r, -s.rot, s.rot) : 0, s: s.size * rn(r, .92, 1.08) });
    }
    var back = background(sc, r), clut = [], over = [];
    for (i = 0; i < s.clutter; i++) { var it = pick(r, sc.items); clut = clut.concat(C[it](r, rn(r, 20, 380), rn(r, 24, 380), rn(r, .8, 1.6))) }
    var ov = sc.over.filter(function (k) { return s.hard || k !== 'hatch' });
    for (i = 0; i < s.over; i++) { var t = T[i % T.length], near = r() < .3, x = near ? t.x + rn(r, -R, R) : rn(r, 20, 380), y = near ? t.y + rn(r, -R, R) : rn(r, 20, 380); over = over.concat(C[pick(r, ov)](r, x, y, rn(r, .7, 1.1))) }
    return { s: s, sc: sc, T: T, R: R, back: back, clut: clut, over: over };
  }
  function iconSvg(k, sw, fill) {
    return ICONS[k][1].map(function (d) { var line = d.indexOf('L:') === 0; return '<path d="' + (line ? d.slice(2) : d) + '" fill="' + (line ? 'none' : (fill ? '#fff' : 'none')) + '"/>' }).join('');
  }
  function svg(m, o) {
    o = o || {}; var sw = m.s.sw, st = ' stroke="#2A221C" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"', h = '<rect width="400" height="400" fill="#fff"/>';
    function draw(list) { return list.map(function (e) { return '<path d="' + e[0] + '" fill="' + (e[1] ? '#fff' : 'none') + '"/>' }).join('') }
    h += '<g' + st + '>' + draw(m.back) + draw(m.clut);
    m.T.forEach(function (t) { h += '<g transform="translate(' + f(t.x) + ' ' + f(t.y) + ') rotate(' + f(t.a) + ') scale(' + f(t.s) + ')" vector-effect="non-scaling-stroke">' + iconSvg(t.k, sw, m.s.fill).replace(/<path /g, '<path vector-effect="non-scaling-stroke" ') + '</g>' });
    h += draw(m.over) + '</g><rect x="4" y="4" width="392" height="392" rx="10" fill="none" stroke="#2A221C" stroke-width="2"/>';
    h += '<g class="hp-marks" pointer-events="none"></g>';
    if (o.ans) h += m.T.map(function (t) { return '<circle cx="' + f(t.x) + '" cy="' + f(t.y) + '" r="' + f(m.R + 6) + '" fill="none" stroke="#F2A93B" stroke-width="4" opacity=".8"/>' }).join('');
    return '<svg class="hp-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">' + h + '</svg>';
  }
  function icon(k, cls) { return '<svg class="' + (cls || 'hp-ic') + '" viewBox="-24 -24 48 48"><g stroke="#2A221C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + iconSvg(k, 2.4, true) + '</g></svg>' }
  function hit(m, x, y) { var tol = m.R * 1.05 + 9, best = -1, bd = 1e9; m.T.forEach(function (t, i) { var d = Math.hypot(t.x - x, t.y - y); if (d < tol && d < bd) { bd = d; best = i } }); return best }
  function title(s) { return SCENES[s.sc].name + ' 숨은 그림' }
  return { specs: specs, make: make, svg: svg, icon: icon, hit: hit, title: title, ICONS: ICONS, SCENES: SCENES };
})();
if (typeof module !== 'undefined') module.exports = HP;
