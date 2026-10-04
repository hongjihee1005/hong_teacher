/* 틀린 그림 찾기 생성기 — 같은 학년·번호면 언제나 같은 그림. 그림 한 장 400×300(왼쪽 원래, 오른쪽 바뀐 그림).
   사물 = 여러 조각(모양·색). 다른 곳 = 사라짐·색 바뀜·새로 생김·크기·위치·부분 없어짐·좌우 뒤집힘 */
var SD = (function () {
  var PI = Math.PI;
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
  function rn(r, a, b) { return a + r() * (b - a) }
  function pick(r, a) { return a[Math.floor(r() * a.length)] }
  function shuf(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t } return a }
  function f(n) { return Math.round(n * 10) / 10 }
  function C(cx, cy, r) { return 'M' + f(cx - r) + ' ' + f(cy) + 'a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(2 * r) + ' 0a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(-2 * r) + ' 0Z' }
  function E(cx, cy, rx, ry) { return 'M' + f(cx - rx) + ' ' + f(cy) + 'a' + f(rx) + ' ' + f(ry) + ' 0 1 0 ' + f(2 * rx) + ' 0a' + f(rx) + ' ' + f(ry) + ' 0 1 0 ' + f(-2 * rx) + ' 0Z' }
  function R(x, y, w, h, r) { r = r || 0; if (!r) return 'M' + x + ' ' + y + 'h' + w + 'v' + h + 'h' + (-w) + 'Z'; return 'M' + (x + r) + ' ' + y + 'h' + (w - 2 * r) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + 'v' + (h - 2 * r) + 'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + r + 'h' + (-(w - 2 * r)) + 'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + (-r) + 'v' + (-(h - 2 * r)) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + (-r) + 'Z' }
  function P(p) { return 'M' + p.map(function (q) { return f(q[0]) + ' ' + f(q[1]) }).join('L') + 'Z' }
  function ST(cx, cy, n, r1, r2) { var p = []; for (var i = 0; i < 2 * n; i++) { var a = -PI / 2 + i * PI / n, q = i % 2 ? r2 : r1; p.push([cx + q * Math.cos(a), cy + q * Math.sin(a)]) } return P(p) }
  /* 조각: [d, 색, 표시]  표시: 'o' 없어질 수 있는 부분, 'l' 선(색칠 안 함) */
  var OBJ = {
    blossom: ['벚꽃나무', 1, function () { return [[R(44, 55, 12, 40), '#8D6E63'], [C(50, 42, 30), '#F8BBD0'], [C(36, 34, 5), '#EC407A', 'o'], [C(60, 30, 5), '#EC407A', 'o'], [C(52, 52, 5), '#EC407A', 'o'], [C(68, 46, 4), '#EC407A', 'o']] }],
    tulip: ['튤립', 0, function () { return [['M50 95V45', '#2E7D32', 'l'], ['M50 80Q30 70 32 55Q46 62 50 78Z', '#66BB6A', 'o'], ['M32 22L40 36L50 20L60 36L68 22V44Q68 56 50 56Q32 56 32 44Z', '#E53935']] }],
    butterfly: ['나비', 1, function () { return [[E(33, 38, 16, 13), '#AB47BC'], [E(67, 38, 16, 13), '#AB47BC'], [E(36, 62, 11, 10), '#FFB74D'], [E(64, 62, 11, 10), '#FFB74D'], [E(50, 50, 4, 22), '#5D4037'], ['M48 29Q42 18 38 16M52 29Q58 18 62 16', '#5D4037', 'l'], [C(33, 38, 5), '#FFF59D', 'o']] }],
    chick: ['병아리', 0, function () { return [[C(50, 62, 25), '#FFEB3B'], [C(50, 32, 17), '#FFEB3B'], ['M64 30L76 34L64 38Z', '#FB8C00'], [C(56, 28, 2.6), '#212121'], [E(42, 64, 10, 6), '#FDD835', 'o'], ['M42 86V94M58 86V94', '#FB8C00', 'l']] }],
    sprout: ['새싹', 0, function () { return [[E(50, 90, 28, 8), '#8D6E63'], ['M50 88V52', '#388E3C', 'l'], ['M50 56Q28 54 24 36Q44 36 50 56Z', '#7CB342'], ['M50 62Q72 60 76 42Q56 42 50 62Z', '#9CCC65', 'o']] }],
    kite: ['연', 1, function () { return [[P([[50, 8], [78, 40], [50, 46]]), '#E53935'], [P([[50, 8], [22, 40], [50, 46]]), '#FDD835'], [P([[22, 40], [50, 46], [50, 82]]), '#1E88E5'], [P([[78, 40], [50, 46], [50, 82]]), '#43A047'], ['M50 82Q40 88 50 94Q60 98 54 100', '#5D4037', 'l'], [P([[44, 88], [50, 92], [44, 96]]), '#E53935', 'o']] }],
    cloud: ['구름', 1, function () { return [[C(34, 56, 16), '#FFFFFF'], [C(66, 56, 16), '#FFFFFF'], [C(50, 44, 20), '#FFFFFF'], [R(30, 56, 40, 16), '#FFFFFF']] }],
    sun: ['해', 1, function () { var o = []; for (var i = 0; i < 8; i++) { var a = i * PI / 4; o.push(['M' + f(50 + 30 * Math.cos(a)) + ' ' + f(50 + 30 * Math.sin(a)) + 'L' + f(50 + 44 * Math.cos(a)) + ' ' + f(50 + 44 * Math.sin(a)), '#F9A825', i % 2 ? 'lo' : 'l']) } o.push([C(50, 50, 24), '#FDD835']); return o }],
    bird: ['새', 0, function () { return [[E(48, 54, 26, 18), '#42A5F5'], [C(72, 40, 12), '#42A5F5'], ['M83 40L94 44L83 47Z', '#FB8C00'], [C(75, 38, 2.4), '#212121'], ['M36 50Q50 34 60 52Z', '#1E88E5', 'o'], ['M22 50L8 42L12 58Z', '#1E88E5']] }],
    bee: ['꿀벌', 0, function () { return [[E(40, 36, 12, 16), '#E3F2FD'], [E(58, 34, 12, 16), '#E3F2FD'], [E(50, 58, 26, 18), '#FDD835'], [R(40, 42, 6, 32), '#212121', 'o'], [R(54, 42, 6, 32), '#212121', 'o'], [C(74, 54, 3), '#212121']] }],
    watermelon: ['수박', 1, function () { return [['M10 40A40 40 0 0 0 90 40Z', '#43A047'], ['M16 40A34 34 0 0 0 84 40Z', '#EF5350'], [E(36, 52, 2.5, 4), '#212121', 'o'], [E(50, 60, 2.5, 4), '#212121', 'o'], [E(64, 52, 2.5, 4), '#212121', 'o']] }],
    parasol: ['파라솔', 1, function () { return [['M49 40H51V96H49Z', '#6D4C41'], ['M10 44A40 30 0 0 1 30 18L50 44Z', '#E53935'], ['M30 18A40 30 0 0 1 70 18L50 44Z', '#FFFFFF'], ['M70 18A40 30 0 0 1 90 44L50 44Z', '#E53935'], [C(50, 12, 4), '#FDD835', 'o']] }],
    icecream: ['아이스크림', 1, function () { return [[P([[34, 50], [66, 50], [50, 96]]), '#D7A86E'], [C(40, 42, 14), '#F48FB1'], [C(60, 42, 14), '#A5D6A7'], [C(50, 26, 14), '#FFF59D'], [C(50, 10, 5), '#E53935', 'o']] }],
    crab: ['게', 1, function () { return [[E(50, 60, 28, 18), '#E53935'], [C(18, 40, 9), '#E53935'], [C(82, 40, 9), '#E53935'], ['M26 50L20 46M74 50L80 46M30 74L22 86M70 74L78 86', '#C62828', 'l'], [C(42, 46, 4), '#FFFFFF', 'o'], [C(58, 46, 4), '#FFFFFF', 'o']] }],
    sailboat: ['돛단배', 0, function () { return [['M10 70H90L78 88H22Z', '#8D6E63'], ['M52 66V10L84 66Z', '#FFFFFF'], ['M48 66V22L22 66Z', '#4FC3F7'], ['M52 10L66 15L52 20Z', '#E53935', 'o']] }],
    beachball: ['비치볼', 1, function () { return [[C(50, 50, 34), '#FFFFFF'], ['M50 16A34 34 0 0 1 84 50L50 50Z', '#E53935'], ['M16 50A34 34 0 0 1 50 16L50 50Z', '#1E88E5'], ['M50 84A34 34 0 0 1 16 50L50 50Z', '#FDD835'], [C(50, 50, 6), '#FFFFFF', 'o']] }],
    elfan: ['선풍기', 1, function () { return [[R(46, 56, 8, 30), '#90A4AE'], [E(50, 90, 22, 6), '#78909C'], [C(50, 36, 28), '#E3F2FD'], [E(50, 22, 7, 12), '#29B6F6'], [E(38, 44, 12, 7), '#29B6F6'], [E(62, 44, 12, 7), '#29B6F6'], [C(50, 36, 5), '#546E7A'], [R(42, 84, 6, 4), '#E53935', 'o']] }],
    palm: ['야자나무', 0, function () { return [['M46 96L52 40H58L54 96Z', '#8D6E63'], ['M55 40Q30 24 12 36Q34 28 55 44Z', '#43A047'], ['M55 40Q78 22 92 34Q72 30 55 44Z', '#43A047'], ['M55 40Q54 14 40 6Q60 16 58 40Z', '#66BB6A'], [C(52, 46, 5), '#6D4C41', 'o'], [C(60, 46, 5), '#6D4C41', 'o']] }],
    maple: ['단풍잎', 1, function () { return [[P([[50, 8], [58, 28], [76, 20], [70, 40], [90, 46], [70, 56], [76, 74], [56, 64], [50, 84], [44, 64], [24, 74], [30, 56], [10, 46], [30, 40], [24, 20], [42, 28]]), '#E64A19'], ['M50 84V96', '#6D4C41', 'l'], ['M50 30V78', '#BF360C', 'lo']] }],
    acorn: ['도토리', 1, function () { return [[E(50, 62, 20, 26), '#A1887F'], ['M26 44Q50 20 74 44Z', '#5D4037'], ['M48 26V16', '#5D4037', 'l'], [E(42, 60, 4, 8), '#D7CCC8', 'o']] }],
    scarecrow: ['허수아비', 1, function () { return [['M48 40H52V96H48Z', '#8D6E63'], ['M14 50H86V56H14Z', '#8D6E63'], [R(34, 44, 32, 30, 4), '#1E88E5'], [C(50, 30, 13), '#FFE0B2'], ['M30 22H70L60 10H40Z', '#FDD835'], [R(40, 54, 8, 8), '#E53935', 'o'], [C(45, 30, 2), '#212121'], [C(55, 30, 2), '#212121']] }],
    persimmon: ['감', 1, function () { return [[E(50, 58, 32, 28), '#FB8C00'], [P([[50, 30], [36, 24], [44, 36], [30, 40], [50, 38], [70, 40], [56, 36], [64, 24]]), '#558B2F'], ['M50 30V20', '#5D4037', 'l'], [E(38, 54, 5, 8), '#FFCC80', 'o']] }],
    dragonfly: ['잠자리', 1, function () { return [[E(32, 40, 18, 6), '#B3E5FC'], [E(68, 40, 18, 6), '#B3E5FC'], [E(32, 52, 16, 5), '#B3E5FC', 'o'], [E(68, 52, 16, 5), '#B3E5FC'], [R(47, 36, 6, 56, 3), '#E53935'], [C(50, 32, 6), '#E53935']] }],
    pumpkin: ['호박', 1, function () { return [[E(32, 60, 18, 26), '#FB8C00'], [E(68, 60, 18, 26), '#FB8C00'], [E(50, 60, 20, 28), '#FFA726'], [R(46, 24, 8, 12, 2), '#558B2F'], ['M58 28Q70 18 74 26', '#558B2F', 'lo']] }],
    mushroom: ['버섯', 1, function () { return [[R(40, 50, 20, 40, 6), '#FFF3E0'], ['M12 54Q12 14 50 14Q88 14 88 54Z', '#E53935'], [C(34, 34, 6), '#FFFFFF', 'o'], [C(58, 26, 7), '#FFFFFF', 'o'], [C(72, 42, 5), '#FFFFFF', 'o']] }],
    appletree: ['사과나무', 1, function () { return [[R(43, 58, 14, 38), '#8D6E63'], [C(50, 40, 32), '#66BB6A'], [C(36, 36, 5), '#E53935', 'o'], [C(60, 28, 5), '#E53935', 'o'], [C(56, 52, 5), '#E53935', 'o'], [C(70, 42, 5), '#E53935', 'o']] }],
    snowman: ['눈사람', 1, function () { return [[C(50, 72, 24), '#FFFFFF'], [C(50, 36, 16), '#FFFFFF'], [R(38, 8, 24, 16), '#424242'], [R(34, 22, 32, 4), '#424242'], ['M50 38L62 41L50 43Z', '#FB8C00'], [R(36, 48, 28, 6, 3), '#E53935', 'o'], [C(50, 66, 2.6), '#212121', 'o'], [C(50, 78, 2.6), '#212121'], [C(45, 32, 2), '#212121'], [C(55, 32, 2), '#212121']] }],
    xtree: ['크리스마스 트리', 1, function () { return [[R(44, 82, 12, 14), '#8D6E63'], [P([[50, 14], [80, 52], [20, 52]]), '#2E7D32'], [P([[50, 34], [86, 84], [14, 84]]), '#388E3C'], [ST(50, 12, 5, 9, 4), '#FDD835'], [C(36, 70, 4), '#E53935', 'o'], [C(62, 62, 4), '#1E88E5', 'o'], [C(52, 44, 4), '#FDD835', 'o']] }],
    mitten: ['벙어리장갑', 0, function () { return [['M30 70V36Q30 16 50 16Q66 16 66 36V50Q78 42 82 52Q84 60 70 70Z', '#E53935'], [R(26, 70, 46, 16, 4), '#FFFFFF'], ['M38 34H58M38 44H58', '#FFFFFF', 'lo']] }],
    penguin: ['펭귄', 1, function () { return [[E(50, 56, 28, 36), '#37474F'], [E(50, 62, 18, 28), '#FFFFFF'], [P([[44, 36], [56, 36], [50, 44]]), '#FB8C00'], [C(43, 30, 2.6), '#FFFFFF'], [C(57, 30, 2.6), '#FFFFFF'], [E(38, 92, 9, 4), '#FB8C00'], [E(62, 92, 9, 4), '#FB8C00'], [R(36, 46, 28, 5, 2), '#E53935', 'o']] }],
    snowhouse: ['눈 덮인 집', 0, function () { return [[R(20, 46, 60, 46), '#FFCC80'], [P([[12, 48], [50, 16], [88, 48]]), '#8D6E63'], ['M12 48Q30 40 50 16Q70 40 88 48Q70 44 50 30Q30 44 12 48Z', '#FFFFFF'], [R(42, 64, 16, 28), '#6D4C41'], [R(26, 56, 12, 12), '#81D4FA', 'o'], [R(66, 22, 8, 16), '#8D6E63', 'o']] }],
    cactus: ['선인장', 1, function () { return [['M28 76H72L66 96H34Z', '#D84315'], [R(42, 20, 16, 58, 8), '#43A047'], [R(24, 36, 10, 24, 5), '#43A047', 'o'], [R(66, 30, 10, 24, 5), '#43A047'], [C(50, 18, 5), '#F06292', 'o']] }],
    sunflower: ['해바라기', 1, function () { var o = [['M50 50V96', '#2E7D32', 'l'], [E(62, 78, 10, 5), '#43A047', 'o']]; for (var i = 0; i < 10; i++) { var a = i * PI / 5; o.push([E(50 + 18 * Math.cos(a), 34 + 18 * Math.sin(a), 8, 8), '#FDD835']) } o.push([C(50, 34, 13), '#6D4C41']); return o }],
    potplant: ['화분', 1, function () { return [[P([[30, 64], [70, 64], [64, 96], [36, 96]]), '#FF8A65'], [E(38, 46, 8, 18), '#66BB6A'], [E(62, 46, 8, 18), '#66BB6A'], [E(50, 38, 8, 22), '#43A047'], [R(28, 60, 44, 6), '#E64A19', 'o']] }],
    flowerpot: ['꽃 화분', 1, function () { return [[R(32, 66, 36, 30, 3), '#5C6BC0'], ['M42 66V44M50 66V30M58 66V44', '#2E7D32', 'l'], [C(42, 42, 7), '#F06292'], [C(50, 28, 7), '#FFD54F'], [C(58, 42, 7), '#BA68C8', 'o']] }],
    cat: ['고양이', 0, function () { return [[E(52, 70, 26, 20), '#FFB74D'], [C(36, 44, 18), '#FFB74D'], [P([[22, 36], [24, 18], [34, 30]]), '#FFB74D'], [P([[50, 36], [48, 18], [38, 30]]), '#FFB74D'], [C(30, 44, 2.6), '#212121'], [C(42, 44, 2.6), '#212121'], ['M76 70Q92 60 86 44', '#FB8C00', 'l'], [R(40, 64, 26, 5, 2), '#1E88E5', 'o']] }],
    dog: ['강아지', 0, function () { return [[E(56, 70, 28, 18), '#D7A86E'], [C(32, 46, 18), '#D7A86E'], [E(20, 46, 6, 14), '#8D6E63'], [E(44, 42, 6, 14), '#8D6E63', 'o'], [C(26, 44, 2.6), '#212121'], [C(20, 54, 4), '#212121'], [R(70, 82, 6, 12), '#D7A86E'], [R(42, 82, 6, 12), '#D7A86E'], ['M84 66L94 56', '#8D6E63', 'l']] }],
    fish: ['물고기', 0, function () { return [['M70 50L94 32V68Z', '#FB8C00'], [E(46, 50, 30, 20), '#FFA726'], [C(30, 46, 3.5), '#212121'], ['M50 34Q58 44 50 66', '#E65100', 'lo'], ['M44 30L56 22L60 32Z', '#FB8C00', 'o']] }],
    turtle: ['거북이', 0, function () { return [[C(84, 60, 9), '#9CCC65'], [E(28, 76, 8, 6), '#9CCC65'], [E(70, 78, 8, 6), '#9CCC65'], ['M18 70Q18 30 50 30Q82 30 82 70Z', '#43A047'], [P([[50, 40], [60, 48], [56, 62], [44, 62], [40, 48]]), '#7CB342', 'o'], [C(87, 57, 1.8), '#212121']] }],
    rabbit: ['토끼', 0, function () { return [[E(40, 22, 7, 20), '#FFFFFF'], [E(56, 22, 7, 20), '#FFFFFF'], [E(40, 24, 3, 14), '#F8BBD0', 'o'], [C(48, 50, 18), '#FFFFFF'], [E(52, 80, 22, 16), '#FFFFFF'], [C(42, 48, 2.4), '#212121'], [C(54, 48, 2.4), '#212121'], [C(48, 56, 2.4), '#F06292'], [C(74, 84, 5), '#FFFFFF', 'o']] }],
    fridge: ['냉장고', 1, function () { return [[R(26, 6, 48, 90, 6), '#ECEFF1'], ['M26 40H74', '#90A4AE', 'l'], [R(64, 14, 4, 18, 2), '#78909C'], [R(64, 48, 4, 26, 2), '#78909C'], [C(40, 24, 4), '#E53935', 'o'], [R(34, 54, 10, 8), '#FDD835', 'o']] }],
    tv: ['텔레비전', 1, function () { return [[R(10, 22, 80, 54, 6), '#424242'], [R(16, 28, 68, 42, 2), '#4FC3F7'], [R(44, 76, 12, 10), '#616161'], [R(30, 86, 40, 6, 3), '#616161'], ['M40 22L30 6M60 22L70 6', '#616161', 'lo'], [C(78, 72, 2), '#E53935', 'o']] }],
    washer: ['세탁기', 1, function () { return [[R(18, 8, 64, 86, 6), '#FAFAFA'], ['M18 26H82', '#B0BEC5', 'l'], [C(50, 60, 22), '#B0BEC5'], [C(50, 60, 15), '#81D4FA'], [C(30, 17, 4), '#1E88E5', 'o'], [R(54, 14, 20, 6, 2), '#90A4AE']] }],
    microwave: ['전자레인지', 1, function () { return [[R(8, 26, 84, 52, 6), '#CFD8DC'], [R(14, 32, 54, 40, 3), '#37474F'], [C(80, 40, 4), '#90A4AE', 'o'], [C(80, 54, 4), '#90A4AE'], [R(74, 64, 12, 6, 2), '#43A047']] }],
    lamp: ['스탠드', 0, function () { return [[P([[24, 46], [54, 18], [70, 34], [40, 62]]), '#FFD54F'], ['M50 50L66 62V92', '#5D4037', 'l'], [E(66, 92, 18, 5), '#5D4037'], [C(36, 56, 6), '#FFF59D', 'o']] }],
    computer: ['컴퓨터', 1, function () { return [[R(14, 10, 72, 50, 4), '#455A64'], [R(20, 16, 60, 38, 2), '#90CAF9'], [R(44, 60, 12, 12), '#607D8B'], [R(16, 76, 68, 14, 3), '#B0BEC5'], [R(30, 26, 18, 12), '#FFFFFF', 'o']] }],
    ricecooker: ['전기밥솥', 1, function () { return [[R(18, 40, 64, 52, 12), '#FAFAFA'], ['M18 46Q50 20 82 46Z', '#E0E0E0'], [R(40, 22, 20, 6, 3), '#9E9E9E'], [R(38, 58, 24, 12, 3), '#E53935'], [C(50, 80, 3), '#43A047', 'o']] }],
    toaster: ['토스터', 1, function () { return [[R(18, 26, 18, 30, 3), '#FFE0B2', 'o'], [R(54, 22, 18, 34, 3), '#FFE0B2'], [R(10, 44, 80, 46, 12), '#B0BEC5'], [R(76, 56, 8, 14, 3), '#424242'], ['M22 76H72', '#78909C', 'l']] }],
    clock: ['시계', 1, function () { return [[C(50, 50, 38), '#FFFFFF'], [C(50, 50, 38), 'none'], ['M50 50V24M50 50L66 60', '#212121', 'l'], [C(50, 16, 3), '#E53935', 'o'], [C(84, 50, 3), '#212121'], [C(50, 84, 3), '#212121'], [C(16, 50, 3), '#212121']] }],
  };
  var EXTRA = {   // 새로 생기는 작은 그림
    star: ['별', function () { return [[ST(50, 52, 5, 40, 17), '#FDD835']] }], heart: ['하트', function () { return [['M50 88C10 60 14 22 34 22C44 22 50 32 50 36C50 32 56 22 66 22C86 22 90 60 50 88Z', '#EC407A']] }],
    ball: ['공', function () { return [[C(50, 50, 36), '#42A5F5'], ['M14 50H86', '#FFFFFF', 'l']] }], flower: ['꽃', function () { var o = []; for (var i = 0; i < 5; i++) { var a = i * 2 * PI / 5; o.push([C(50 + 20 * Math.cos(a), 50 + 20 * Math.sin(a), 14), '#F48FB1']) } o.push([C(50, 50, 12), '#FFEB3B']); return o }],
    leaf: ['나뭇잎', function () { return [['M50 92Q8 50 50 8Q92 50 50 92Z', '#7CB342']] }], apple: ['사과', function () { return [[C(50, 56, 32), '#E53935'], ['M50 26V12', '#5D4037', 'l']] }],
    snow: ['눈송이', function () { return [['M50 10V90M15 30L85 70M15 70L85 30', '#4FC3F7', 'l']] }], bubble: ['방울', function () { return [[C(50, 50, 30), '#E1F5FE'], [C(40, 40, 8), '#FFFFFF']] }],
    note: ['음표', function () { return [[E(36, 74, 14, 10), '#5E35B1'], ['M48 74V16L72 26', '#5E35B1', 'l']] }], cup: ['컵', function () { return [[R(28, 30, 40, 50, 6), '#26A69A'], ['M68 42Q86 42 86 56Q86 68 68 68', '#26A69A', 'l']] }],
  };
  var THEMES = [
    { name: '봄 동산', sky: '#E1F5FE', ground: '#C5E1A5', gy: 190, items: ['blossom', 'tulip', 'butterfly', 'chick', 'sprout', 'kite', 'cloud', 'sun', 'bird', 'bee', 'rabbit'], add: ['flower', 'heart', 'leaf', 'star'] },
    { name: '여름 바닷가', sky: '#B3E5FC', ground: '#FFE0B2', gy: 200, sea: '#4FC3F7', items: ['watermelon', 'parasol', 'icecream', 'crab', 'sailboat', 'beachball', 'palm', 'sun', 'cloud', 'fish'], add: ['ball', 'star', 'bubble', 'heart'] },
    { name: '가을 들판', sky: '#FFF3E0', ground: '#F0D27A', gy: 185, items: ['maple', 'acorn', 'scarecrow', 'persimmon', 'dragonfly', 'pumpkin', 'mushroom', 'appletree', 'bird', 'cloud'], add: ['leaf', 'apple', 'star', 'flower'] },
    { name: '겨울 마을', sky: '#E3F2FD', ground: '#FFFFFF', gy: 195, items: ['snowman', 'xtree', 'mitten', 'penguin', 'snowhouse', 'cloud', 'bird', 'rabbit'], add: ['snow', 'star', 'heart', 'ball'] },
    { name: '식물 베란다', sky: '#FFF8E1', ground: '#D7CCC8', gy: 215, items: ['cactus', 'sunflower', 'potplant', 'flowerpot', 'tulip', 'sprout', 'mushroom', 'butterfly', 'bee'], add: ['leaf', 'flower', 'star', 'note'] },
    { name: '동물 친구들', sky: '#E8F5E9', ground: '#AED581', gy: 190, items: ['cat', 'dog', 'rabbit', 'turtle', 'bird', 'chick', 'penguin', 'butterfly', 'fish', 'bee'], add: ['ball', 'heart', 'flower', 'note'] },
    { name: '거실 가전', sky: '#FFF3E0', ground: '#BCAAA4', gy: 220, items: ['tv', 'lamp', 'elfan', 'clock', 'computer', 'washer', 'potplant', 'cat'], add: ['star', 'note', 'cup', 'heart'] },
    { name: '부엌 가전', sky: '#E0F2F1', ground: '#CFD8DC', gy: 220, items: ['fridge', 'microwave', 'ricecooker', 'toaster', 'clock', 'watermelon', 'icecream', 'flowerpot'], add: ['apple', 'cup', 'star', 'heart'] },
  ];
  var SKY = ['sun', 'cloud', 'kite', 'bird', 'butterfly', 'bee', 'dragonfly', 'clock'];
  var GROUND = ['blossom', 'tulip', 'sprout', 'palm', 'parasol', 'scarecrow', 'pumpkin', 'mushroom', 'appletree', 'snowman', 'xtree', 'snowhouse', 'cactus', 'sunflower', 'potplant', 'flowerpot', 'cat', 'dog', 'rabbit', 'turtle', 'chick', 'penguin', 'crab', 'fridge', 'washer', 'lamp', 'ricecooker', 'acorn', 'watermelon', 'beachball', 'elfan', 'tv'];
  var ALT = ['#E53935', '#FB8C00', '#FDD835', '#43A047', '#1E88E5', '#8E24AA', '#F06292', '#6D4C41', '#212121', '#26C6DA', '#FFFFFF'];
  var KIND = { gone: '사라졌어요', color: '색이 바뀌었어요', add: '새로 생겼어요', size: '크기가 달라요', move: '자리가 옮겨졌어요', part: '한 부분이 없어졌어요', flip: '방향이 반대예요' };

  function specs(g) {
    var S = [];
    for (var b = 0; b < 3; b++) for (var k = 0; k < 30; k++) {
      var t = k / 29;
      S.push({ seed: g * 1000 + b * 100 + k + 1, lv: ['쉬움', '보통', '도전'][b], th: (k * 3 + g + b) % 8,
        n: [3, 5, 7][b] + Math.floor((g - 1) / 2) + (t > .6 ? 1 : 0),
        objs: [5, 8, 11][b] + Math.floor(g / 2) + Math.round(t * 2),
        size: Math.max(.42, [1, .8, .62][b] - (g - 1) * .04 - t * .06),
        kinds: [['gone', 'color', 'add'], ['gone', 'color', 'add', 'size', 'part', 'move'], ['color', 'add', 'size', 'part', 'move', 'flip', 'gone']][b] });
    }
    return S;
  }
  function make(s) {
    var r = rng(s.seed), th = THEMES[s.th], O = [], base = 92 * s.size, tries = 0;
    var pool = shuf(r, th.items.concat(th.items));
    while (O.length < s.objs && tries++ < 3000) {
      var k = pool[O.length % pool.length], sc = base * rn(r, .85, 1.15) / 100, rad = 50 * sc;
      var x = rn(r, rad + 6, 400 - rad - 6), y = rn(r, rad + 6, 300 - rad - 6), z = SKY.indexOf(k) >= 0 ? 's' : GROUND.indexOf(k) >= 0 ? 'g' : '';
      if (tries < 2000 && z === 's') y = rn(r, rad + 6, Math.max(rad + 7, th.gy - rad * .4));
      if (tries < 2000 && z === 'g') y = rn(r, Math.min(300 - rad - 7, th.gy - rad * .3), 300 - rad - 6);
      if (O.every(function (o) { return Math.hypot(o.x - x, o.y - y) > o.rad + rad + 4 })) O.push({ k: k, x: x, y: y, sc: sc, rad: rad, flip: r() < .3 && !OBJ[k][1] ? 1 : 0, parts: OBJ[k][2]() });
    }
    var Rt = O.map(function (o) { return JSON.parse(JSON.stringify(o)) }), D = [], used = {}, kinds = shuf(r, s.kinds), ki = 0;
    for (var guard = 0; D.length < s.n && guard < 300; guard++) {
      var kind = kinds[ki++ % kinds.length], cand = shuf(r, Rt.map(function (o, i) { return i }).filter(function (i) { return !used[i] }));
      if (kind === 'add') {
        var ek = pick(r, th.add), es = base * .45 / 100, er = 50 * es, ok = false, ax, ay;
        for (var t2 = 0; t2 < 200 && !ok; t2++) { ax = rn(r, er + 6, 400 - er - 6); ay = rn(r, er + 6, 300 - er - 6); ok = Rt.concat(D.filter(function (d) { return d.kind === 'add' }).map(function (d) { return d.obj })).every(function (o) { return Math.hypot(o.x - ax, o.y - ay) > o.rad + er + 4 }) }
        if (!ok) continue;
        var no = { k: ek, x: ax, y: ay, sc: es, rad: er, flip: 0, parts: EXTRA[ek][1](), extra: 1 };
        D.push({ kind: 'add', at: [[ax, ay]], r: er, obj: no }); continue;
      }
      var i = -1;
      for (var c = 0; c < cand.length; c++) {
        var o = Rt[cand[c]], P = o.parts;
        if (kind === 'flip' && OBJ[o.k][1]) continue;
        if (kind === 'part' && !P.some(function (p) { return /o/.test(p[2] || '') })) continue;
        if (D.some(function (d) { return d.at.some(function (q) { return Math.hypot(q[0] - o.x, q[1] - o.y) < o.rad + d.r + 6 }) })) continue;
        i = cand[c]; break;
      }
      if (i < 0) continue;
      var o2 = Rt[i], d = { kind: kind, at: [[o2.x, o2.y]], r: o2.rad, idx: i }; used[i] = 1;
      if (kind === 'gone') o2.gone = 1;
      else if (kind === 'color') { var ps = o2.parts.map(function (p, j) { return j }).filter(function (j) { var p = o2.parts[j]; return !/l/.test(p[2] || '') && p[1] !== 'none' }); var j = ps[0]; if (s.lv === '도전' && ps.length > 1) j = pick(r, ps); var old = o2.parts[j][1]; o2.parts[j][1] = pick(r, ALT.filter(function (a) { return a.toLowerCase() !== old.toLowerCase() })) }
      else if (kind === 'size') { o2.sc *= o2.rad > 30 ? .7 : 1.3 }
      else if (kind === 'part') { var op = o2.parts.map(function (p, j) { return j }).filter(function (j) { return /o/.test(o2.parts[j][2] || '') }); o2.parts.splice(pick(r, op), 1) }
      else if (kind === 'flip') o2.flip = o2.flip ? 0 : 1;
      else if (kind === 'move') {
        var mv = false;
        for (var t3 = 0; t3 < 60 && !mv; t3++) {
          var nx = o2.x + rn(r, -40, 40), ny = o2.y + rn(r, -30, 30);
          if (nx < o2.rad + 4 || nx > 400 - o2.rad - 4 || ny < o2.rad + 4 || ny > 300 - o2.rad - 4 || Math.hypot(nx - o2.x, ny - o2.y) < o2.rad * .45) continue;
          if (Rt.every(function (q, qi) { return qi === i || Math.hypot(q.x - nx, q.y - ny) > q.rad + o2.rad }) && D.every(function (dd) { return dd.at.every(function (q) { return Math.hypot(q[0] - nx, q[1] - ny) > dd.r + o2.rad + 4 }) })) { o2.x = nx; o2.y = ny; mv = true }
        }
        if (!mv) { delete used[i]; continue }
        d.at.push([o2.x, o2.y]);
      }
      D.push(d);
    }
    D.forEach(function (d) { if (d.kind === 'add') Rt.push(d.obj) });
    return { s: s, th: th, L: O, R: Rt, D: D };
  }
  function objSvg(o) {
    if (o.gone) return '';
    var fl = o.flip ? -1 : 1, h = '<g transform="translate(' + f(o.x) + ' ' + f(o.y) + ') scale(' + (fl * o.sc).toFixed(3) + ' ' + o.sc.toFixed(3) + ') translate(-50 -50)">';
    o.parts.forEach(function (p) { var line = /l/.test(p[2] || ''); h += '<path d="' + p[0] + '" fill="' + (line ? 'none' : p[1]) + '" stroke="' + (line ? p[1] : '#3A3028') + '" stroke-width="' + (line ? 3 : 1.6) + '" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>' });
    return h + '</g>';
  }
  function scene(m, side) {
    var th = m.th, h = '<rect width="400" height="300" fill="' + th.sky + '"/>';
    if (th.sea) h += '<rect y="' + (th.gy - 40) + '" width="400" height="40" fill="' + th.sea + '"/>';
    h += '<path d="M0 ' + th.gy + 'Q200 ' + (th.gy - 18) + ' 400 ' + th.gy + 'V300H0Z" fill="' + th.ground + '"/>';
    (side ? m.R : m.L).forEach(function (o) { h += objSvg(o) });
    return h;
  }
  function svg(m, side) { return '<svg class="sd-svg" data-side="' + side + '" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' + scene(m, side) + '<rect x="1" y="1" width="398" height="298" fill="none" stroke="#3A3028" stroke-width="2"/><g class="sd-marks" pointer-events="none"></g></svg>' }
  function hit(m, x, y) { var best = -1, bd = 1e9; m.D.forEach(function (d, i) { d.at.forEach(function (q) { var t = Math.hypot(q[0] - x, q[1] - y); if (t < Math.max(d.r * 1.1, 16) + 8 && t < bd) { bd = t; best = i } }) }); return best }
  function title(s) { return THEMES[s.th].name }
  return { specs: specs, make: make, svg: svg, hit: hit, title: title, objSvg: objSvg, KIND: KIND, OBJ: OBJ, THEMES: THEMES };
})();
if (typeof module !== 'undefined') module.exports = SD;
