/* 수학게임 화면 (2026-10-07)
   window.MG = { g:학년, units:[{id,nm,sem?,k:[단계 id…]}] }, 문제는 window.AR(기초연산 skills.js), 보기는 window.MGC(choices.js)
   게임: balloon 풍선 터뜨리기 · mole 두더지 잡기 · rocket 60초 우주 도전 · tug 줄다리기(2명)
   문제의 씨앗은 Math.random()이라 할 때마다 새 숫자가 나옵니다(학습지와 달리 인쇄용이 아님).
   기록: localStorage 'hj-mgame-v1' { '학년|단원|게임': 최고 점수 }, 소리 끔 'hj-mgame-v1-mute', 마지막 고른 것 'hj-mgame-v1-last'
   게임 그림(풍선·두더지·로켓·줄다리기)은 SVG라 공통 덮개의 이모지 바꾸기가 건드리지 않습니다.
*/
(function () {
  'use strict';
  var D = window.MG, AR = window.AR, MGC = window.MGC, KEY = 'hj-mgame-v1';
  var $ = function (id) { return document.getElementById(id) };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function load(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch (e) { return d } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} }
  function rnd32() { return Math.floor(Math.random() * 4294967296) }
  function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t } return a }

  var GAMES = [
    { id: 'balloon', pl: [1, 1], nm: '풍선 터뜨리기', de: '정답이 적힌 풍선을 하늘로 날아가기 전에 톡! 하트 3개로 오래 버텨요.', stars: [5, 12, 20] },
    { id: 'mole', pl: [1, 1], nm: '두더지 잡기', de: '정답 팻말을 든 두더지를 뿅망치로 콩! 숨기 전에 빨리 잡아요.', stars: [5, 12, 20] },
    { id: 'tower', pl: [1, 1], nm: '탑 쌓기', de: '맞힐 때마다 블록이 한 층씩! 틀리거나 시간이 지나면 맨 위 블록이 떨어져요.', stars: [5, 12, 20] },
    { id: 'rocket', pl: [1, 1], timer: true, nm: '60초 우주 도전', de: '60초 동안 몇 문제를 맞힐까요? 맞힐수록 로켓이 높이 올라가요.', stars: [8, 15, 22] },
    { id: 'invader', pl: [1, 1], nm: '우주 침공 막기', de: '식을 들고 내려오는 외계인을 정답 레이저로 맞혀요. 땅에 닿기 전에!', stars: [5, 12, 20] },
    { id: 'memory', pl: [1, 1], pill: '뒤집은 횟수', nm: '짝 맞추기 카드', de: '카드 16장을 두 장씩 뒤집어 식과 답을 짝지어요. 시간 제한 없이 천천히! 적게 틀릴수록 별이 많아요.', noTxt: '크기 비교·여러 수 쓰기 문제는 카드로 만들지 않아요.' },
    { id: 'vault', pl: [1, 1], nm: '금고 열기', de: '보기 없이 답을 숫자판으로 직접 써요. 맞힐 때마다 자물쇠가 하나씩, 5개를 열면 금고가 열려요.', stars: [5, 12, 20] },
    { id: 'sort', pl: [1, 1], nm: '크기 순서로 줄 세우기', de: '식 카드 4장을 계산한 값이 작은(또는 큰) 것부터 차례로 눌러요. 어림하는 힘이 쑥쑥!', stars: [3, 7, 12], noTxt: '줄 세우기는 값이 나오는 계산(자연수·소수·분수)에서만 해요.' },
    { id: 'race', pl: [2, 4], timer: true, nm: '달리기 경주', de: '2~4명이 화면을 나눠 각자 문제를 풀어요. 맞힐 때마다 한 칸씩, 먼저 결승선(10칸)에 닿으면 이겨요.', two: true, how: '인원을 고르면 화면이 2~4칸으로 나뉘어요' },
    { id: 'buzz', pl: [4, 4], nm: '골든벨 버저', de: '같은 문제를 보고 네 귀퉁이 버저를 먼저 눌러 답해요. 틀리면 다른 사람에게 기회! 먼저 10점이면 이겨요.', two: true, how: '버저는 먼저 누른 한 사람만 받아요 · 모둠 대표 4명도 좋아요' },
    { id: 'land', pl: [2, 2], nm: '땅따먹기', de: '차례대로 칸을 골라 그 칸의 식을 풀어요. 맞히면 내 땅! 판이 다 차면 땅이 많은 쪽이 이겨요.', two: true, how: '한 번에 한 사람씩 · 빠르기보다 차례대로' },
    { id: 'tug', pl: [2, 2], timer: true, nm: '줄다리기', de: '두 사람(두 팀)이 화면 양쪽에서 동시에 풀어요. 먼저 5번 당기는 쪽이 이겨요.', two: true, how: '파랑 팀 · 빨강 팀, 한 사람씩 또는 모둠 대표로' }
  ];
  var GBY = {}; GAMES.forEach(function (x) { GBY[x.id] = x });

  /* ── 그림(SVG) ── */
  var ICO = {
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13M15.5 5.5v13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    vol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3Z" fill="currentColor"/><path d="M15.8 9a4.2 4.2 0 0 1 0 6M18.4 6.4a8 8 0 0 1 0 11.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3Z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 4.2 12.9a4.9 4.9 0 0 1 7-6.9l.8.8.8-.8a4.9 4.9 0 0 1 7 6.9Z"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9Z"/></svg>',
    full: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var BCOL = ['#FF6B6B', '#FFB238', '#4DA3FF', '#6BCB77', '#B07CFF', '#FF7EB6', '#2EC4B6', '#FF8C42'];
  function balloonSvg(c) {
    return '<svg class="mg-bsvg" viewBox="0 0 100 160" aria-hidden="true"><path d="M50 128q-9 9 0 16t0 16" fill="none" stroke="#7d6f62" stroke-width="2"/>' +
      '<path d="M50 3C22 3 5 25 5 52c0 33 28 58 45 63 17-5 45-30 45-63C95 25 78 3 50 3Z" fill="' + c + '"/><path d="M44 117h12l-6 10Z" fill="' + c + '"/>' +
      '<ellipse cx="31" cy="30" rx="8" ry="15" fill="#fff" opacity=".38" transform="rotate(-28 31 30)"/></svg>';
  }
  var MOLE = '<svg class="mg-msvg" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="78" rx="42" ry="44" fill="#8B5E3C"/><ellipse cx="60" cy="92" rx="26" ry="26" fill="#C99A6E"/>' +
    '<circle cx="45" cy="62" r="7" fill="#2A1B12"/><circle cx="75" cy="62" r="7" fill="#2A1B12"/><circle cx="47" cy="60" r="2.4" fill="#fff"/><circle cx="77" cy="60" r="2.4" fill="#fff"/>' +
    '<ellipse cx="60" cy="76" rx="9" ry="6.5" fill="#F48FB1"/><path d="M52 86q8 6 16 0" fill="none" stroke="#2A1B12" stroke-width="2.6" stroke-linecap="round"/>' +
    '<circle cx="34" cy="78" r="6" fill="#F8B4C8" opacity=".6"/><circle cx="86" cy="78" r="6" fill="#F8B4C8" opacity=".6"/></svg>';
  var HAMMER = '<svg viewBox="0 0 80 80" aria-hidden="true"><rect x="36" y="30" width="9" height="46" rx="4" fill="#B5793F"/><rect x="12" y="8" width="56" height="28" rx="10" fill="#E9524A"/><rect x="12" y="8" width="10" height="28" rx="5" fill="#FFD166"/><rect x="58" y="8" width="10" height="28" rx="5" fill="#FFD166"/></svg>';
  var ROCKET = '<svg viewBox="0 0 60 110" aria-hidden="true"><path class="mg-flame" d="M22 82q8 26 8 26t8-26Z" fill="#FFB238"/><path class="mg-flame" d="M26 82q4 16 4 16t4-16Z" fill="#FFF3B0"/>' +
    '<path d="M30 4C16 18 13 40 15 82h30c2-42-1-64-15-78Z" fill="#F4F6FB"/><path d="M15 64 4 82v8l11-8ZM45 64l11 18v8l-11-8Z" fill="#E9524A"/>' +
    '<circle cx="30" cy="40" r="9" fill="#4DA3FF" stroke="#2B4A7A" stroke-width="3"/><path d="M22 14h16q-3-6-8-10-5 4-8 10Z" fill="#E9524A"/></svg>';
  function kidSvg(c, flip) {
    return '<svg class="mg-kid" viewBox="0 0 70 100" aria-hidden="true"' + (flip ? ' style="transform:scaleX(-1)"' : '') + '>' +
      '<circle cx="28" cy="18" r="13" fill="#FFD9B8"/><path d="M15 15q13-14 26 0" fill="#3B2A20"/><circle cx="33" cy="18" r="2" fill="#2A1B12"/><path d="M30 25q3 2 6 0" fill="none" stroke="#2A1B12" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path d="M18 32h20l6 30H14Z" fill="' + c + '"/><path d="M38 38l26 10" stroke="#FFD9B8" stroke-width="7" stroke-linecap="round"/><path d="M36 46l28 6" stroke="#FFD9B8" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M20 62 8 92M34 62l14 30" stroke="#3B4A6B" stroke-width="8" stroke-linecap="round"/></svg>';
  }
  var ALIEN = '<svg class="mg-asvg" viewBox="0 0 120 90" aria-hidden="true"><ellipse cx="60" cy="62" rx="56" ry="18" fill="#7C83FD"/><ellipse cx="60" cy="58" rx="56" ry="14" fill="#A5A9FF"/>' +
    '<path d="M28 52q32-62 64 0Z" fill="#6BCB77"/><circle cx="48" cy="36" r="8" fill="#fff"/><circle cx="72" cy="36" r="8" fill="#fff"/><circle cx="49" cy="37" r="4" fill="#1B1F4B"/><circle cx="73" cy="37" r="4" fill="#1B1F4B"/>' +
    '<path d="M44 14 36 2M76 14l8-12" stroke="#6BCB77" stroke-width="4" stroke-linecap="round"/><circle cx="36" cy="2" r="4" fill="#FFD93D"/><circle cx="84" cy="2" r="4" fill="#FFD93D"/>' +
    '<circle cx="24" cy="62" r="4" fill="#FFD93D"/><circle cx="44" cy="68" r="4" fill="#FFD93D"/><circle cx="76" cy="68" r="4" fill="#FFD93D"/><circle cx="96" cy="62" r="4" fill="#FFD93D"/></svg>';
  var CANNON = '<svg viewBox="0 0 100 70" aria-hidden="true"><rect x="42" y="0" width="16" height="40" rx="6" fill="#C9D3E8"/><rect x="40" y="0" width="20" height="10" rx="4" fill="#FF6B6B"/><path d="M8 70q4-36 42-36t42 36Z" fill="#4DA3FF"/><circle cx="50" cy="52" r="8" fill="#FFD93D"/></svg>';
  var THUMB = {
    balloon: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#BFE6FF"/><circle cx="132" cy="22" r="12" fill="#FFE07A"/><path d="M0 84q40-16 80 0t80 0v16H0Z" fill="#9BD37C"/>' +
      '<g transform="translate(26 14) scale(.42)">' + balloonSvg('#FF6B6B').replace(/<\/?svg[^>]*>/g, '') + '</g><g transform="translate(66 26) scale(.42)">' + balloonSvg('#4DA3FF').replace(/<\/?svg[^>]*>/g, '') + '</g><g transform="translate(104 10) scale(.42)">' + balloonSvg('#FFB238').replace(/<\/?svg[^>]*>/g, '') + '</g></svg>',
    mole: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#A8DA7E"/><ellipse cx="80" cy="84" rx="44" ry="11" fill="#5B3A22"/><g transform="translate(50 26) scale(.5)">' + MOLE.replace(/<\/?svg[^>]*>/g, '') + '</g>' +
      '<path d="M36 90q44 12 88 0v10H36Z" fill="#7BBF52"/><g transform="translate(104 4) rotate(25) scale(.55)">' + HAMMER.replace(/<\/?svg[^>]*>/g, '') + '</g></svg>',
    tower: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#FFD6A5"/><circle cx="128" cy="30" r="14" fill="#FF9F68"/><path d="M0 70h20V50h18v20h14V44h20v56H0Zm110 30V56h16v-14h18v58Z" fill="#C79BC6" opacity=".7"/><rect y="88" width="160" height="12" fill="#8CCB62"/>' +
      '<rect x="56" y="74" width="48" height="14" rx="3" fill="#FF6B6B"/><rect x="58" y="60" width="44" height="14" rx="3" fill="#FFB238"/><rect x="55" y="46" width="48" height="14" rx="3" fill="#6BCB77"/><rect x="57" y="32" width="45" height="14" rx="3" fill="#4DA3FF"/>' +
      '<path d="M80 4v12" stroke="#5C5047" stroke-width="2"/><rect x="64" y="14" width="34" height="12" rx="3" fill="#B07CFF"/><path d="M20 6h120" stroke="#5C5047" stroke-width="3"/></svg>',
    memory: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#2E7D5B"/>' +
      [0, 1, 2, 3].map(function (c) { return [0, 1].map(function (r) { var up = (c + r) % 3 === 0; return '<rect x="' + (14 + c * 35) + '" y="' + (12 + r * 42) + '" width="29" height="36" rx="5" fill="' + (up ? '#FFFDF7' : '#FF8C6B') + '"/>' + (up ? '<text x="' + (28.5 + c * 35) + '" y="' + (35 + r * 42) + '" font-size="12" text-anchor="middle" fill="#2A221C">' + (r ? '12' : '3×4') + '</text>' : '<circle cx="' + (28.5 + c * 35) + '" cy="' + (30 + r * 42) + '" r="7" fill="none" stroke="#FFD6C9" stroke-width="2"/>') }).join('') }).join('') + '</svg>',
    vault: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#E7EDF5"/><rect x="34" y="10" width="92" height="80" rx="10" fill="#7C8BA3"/><rect x="42" y="18" width="76" height="64" rx="6" fill="#9AA8BF"/>' +
      '<circle cx="66" cy="50" r="16" fill="#C9D3E2" stroke="#5E6C84" stroke-width="3"/><path d="M66 38v24M54 50h24" stroke="#5E6C84" stroke-width="3"/>' + [0, 1, 2, 3, 4].map(function (i) { return '<circle cx="104" cy="' + (26 + i * 12) + '" r="4" fill="' + (i < 2 ? '#6BCB77' : '#3E4A60') + '"/>' }).join('') + '</svg>',
    sort: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#FFF1D6"/><rect y="78" width="160" height="22" fill="#C68A4A"/>' +
      [0, 1, 2, 3].map(function (i) { var h = 18 + i * 14; return '<rect x="' + (18 + i * 34) + '" y="' + (76 - h) + '" width="26" height="' + h + '" rx="5" fill="' + ['#4DA3FF', '#6BCB77', '#FFB238', '#FF6B6B'][i] + '"/><text x="' + (31 + i * 34) + '" y="94" font-size="12" text-anchor="middle" fill="#fff">' + (i + 1) + '</text>' }).join('') + '</svg>',
    invader: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#1B1F4B"/><circle cx="20" cy="18" r="1.5" fill="#fff"/><circle cx="140" cy="26" r="1.5" fill="#fff"/><circle cx="110" cy="10" r="1.2" fill="#fff"/>' +
      '<g transform="translate(52 10) scale(.46)">' + ALIEN.replace(/<\/?svg[^>]*>/g, '') + '</g><path d="M80 82 82 44" stroke="#FF6B6B" stroke-width="3"/><path d="M0 100V84h20V74h16v10h20V70h18v30Zm100 0V78h18V66h16v12h26v22Z" fill="#2E2A73"/><g transform="translate(64 74) scale(.32)">' + CANNON.replace(/<\/?svg[^>]*>/g, '') + '</g></svg>',
    race: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#BFE6FF"/><rect y="40" width="160" height="60" fill="#D9644A"/><path d="M0 55h160M0 70h160M0 85h160" stroke="#fff" stroke-width="1.5" opacity=".8"/>' +
      '<path d="M138 40v60" stroke="#fff" stroke-width="6" stroke-dasharray="5 5"/><circle cx="40" cy="48" r="6" fill="#4DA3FF"/><circle cx="70" cy="63" r="6" fill="#FF6B6B"/><circle cx="56" cy="78" r="6" fill="#3DBE6B"/><circle cx="92" cy="93" r="5" fill="#F5B82E"/><path d="M128 10v26l18-8Z" fill="#FFD93D"/><path d="M128 8v30" stroke="#5C5047" stroke-width="2"/></svg>',
    buzz: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#2B1E66"/><circle cx="80" cy="44" r="40" fill="#FFD93D" opacity=".18"/><path d="M80 18c-11 0-18 8-18 19v12l-6 8h48l-6-8V37c0-11-7-19-18-19Z" fill="#FFC530"/><circle cx="80" cy="64" r="5" fill="#FFC530"/>' +
      '<circle cx="18" cy="22" r="11" fill="#4DA3FF"/><circle cx="142" cy="22" r="11" fill="#FF6B6B"/><circle cx="18" cy="80" r="11" fill="#3DBE6B"/><circle cx="142" cy="80" r="11" fill="#F5B82E"/></svg>',
    land: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#A8DA7E"/><g transform="translate(46 8)">' +
      [0, 1, 2, 3].map(function (r) { return [0, 1, 2, 3].map(function (c) { var k = (r * 4 + c) % 5; return '<rect x="' + c * 17 + '" y="' + r * 21 + '" width="15" height="19" rx="3" fill="' + (k === 1 ? '#4DA3FF' : k === 3 ? '#FF6B6B' : '#FFFDF7') + '"/>' }).join('') }).join('') + '</g></svg>',
    rocket: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#1B1F4B"/><circle cx="28" cy="20" r="1.6" fill="#fff"/><circle cx="60" cy="70" r="1.3" fill="#fff"/><circle cx="140" cy="16" r="1.8" fill="#fff"/><circle cx="118" cy="60" r="1.2" fill="#fff"/><circle cx="20" cy="80" r="1.4" fill="#fff"/>' +
      '<circle cx="130" cy="78" r="18" fill="#B07CFF"/><ellipse cx="130" cy="78" rx="28" ry="5" fill="none" stroke="#E0C9FF" stroke-width="2.5"/><g transform="translate(66 10) rotate(18) scale(.72)">' + ROCKET.replace(/<\/?svg[^>]*>/g, '') + '</g></svg>',
    tug: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" rx="14" fill="#CDEBFF"/><rect y="62" width="160" height="38" fill="#E8C98F"/><path d="M80 52v40" stroke="#fff" stroke-width="3" stroke-dasharray="5 4"/>' +
      '<path d="M30 60h100" stroke="#B5793F" stroke-width="4"/><path d="M80 56l-6 10h12Z" fill="#E9524A"/>' +
      '<g transform="translate(6 30) scale(.5)">' + kidSvg('#4DA3FF').replace(/<\/?svg[^>]*>/g, '') + '</g><g transform="translate(154 30) scale(-.5 .5)">' + kidSvg('#FF6B6B').replace(/<\/?svg[^>]*>/g, '') + '</g></svg>'
  };

  /* ── 문제·보기 그리기 ── */
  function frH(t) {
    if (t.k !== 'f') return '';
    return '<span class="mg-fr">' + (t.w ? '<b class="mg-fw">' + t.w + '</b>' : '') + (t.n || !t.w ? '<span class="mg-fs"><span>' + t.n + '</span><span>' + t.d + '</span></span>' : '') + '</span>';
  }
  function tokH(t) {
    if (typeof t === 'string') {
      if (t === '○') return '<span class="mg-circ" aria-label="빈 동그라미">○</span>';
      return /^[+−×÷=()]$/.test(t) ? '<span class="mg-op">' + t + '</span>' : '<span class="mg-tx">' + esc(t.replace(/쓰세요\./, '고르세요.')) + '</span>';   // 게임은 보기에서 고름
    }
    if (t.k === 'n') return '<span class="mg-n">' + t.v + '</span>';
    if (t.k === 'd') return '<span class="mg-n">' + AR.dstr(t.v, t.p) + '</span>';
    if (t.k === 'f') return frH(t);
    if (t.k === 'b') return '<span class="mg-blank" aria-label="빈칸">?</span>';
    return '';
  }
  function qH(p) {
    var q = p.txt || p.q, h = q.map(tokH).join(''), hasB = q.some(function (t) { return t === '○' || (t && t.k === 'b') });
    if (!hasB && !p.txt) h += (q[q.length - 1] === '=' ? '' : tokH('=')) + '<span class="mg-blank">?</span>';
    return '<span class="mg-q' + (p.txt ? ' tx' : '') + '">' + h + '</span>';
  }
  function hintOf(p) {
    var s = AR.BY[p.s], a = s.ask;
    if (a === 'mixed') return '대분수로'; if (a === 'improper') return '가분수로'; if (a === 'simp') return '기약분수로';
    if (/de03|de16/.test(s.id)) return '소수로'; if (a === 'qr') return '몫 … 나머지'; if (a === 'cmp') return '○ 안에 >, =, <'; if (a === 'blank') return '? 에 알맞은 수';
    return '';
  }
  function aH(o) {
    if (o.t === 'n') return String(o.v);
    if (o.t === 'd') return AR.dstr(o.v, o.p);
    if (o.t === 'qr') return o.q + '<small class="mg-qr">…</small>' + o.r;
    if (o.t === 'cmp') return o.v;
    if (o.t === 'list') return o.v.join(', ');
    if (o.t === 'f') { var t = MGC.fShow(o); return t.k === 'n' ? String(t.v) : frH(t) }
  }
  function aLen(o) {   // 글자 길이(보기 글자 크기 정하기)
    if (o.t === 'list') return o.v.join(', ').length;
    if (o.t === 'f') { var t = MGC.fShow(o); return t.k === 'n' ? String(t.v).length : String(t.w || '').length + Math.max(String(t.n).length, String(t.d).length) + 1 }
    if (o.t === 'qr') return String(o.q).length + String(o.r).length + 2;
    if (o.t === 'd') return AR.dstr(o.v, o.p).length;
    return String(o.v).length;
  }
  function szCls(o) { var n = aLen(o); return n <= 3 ? 's1' : n <= 5 ? 's2' : n <= 9 ? 's3' : n <= 15 ? 's4' : 's5' }
  function plain(o) { var d = document.createElement('div'); d.innerHTML = aH(o); return d.textContent.replace('…', ' … ') }

  /* ── 소리(Web Audio, 짧은 효과음) ── */
  var AC = null, muted = load(KEY + '-mute', false);
  function tone(f, t, dur, type, vol) {
    var o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .15, t + .015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + .02);
  }
  function noise(t, dur, vol, f) {
    var n = Math.floor(AC.sampleRate * dur), b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = AC.createBufferSource(), bp = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = b; bp.type = 'bandpass'; bp.frequency.value = f || 1800; g.gain.value = vol || .4;
    s.connect(bp); bp.connect(g); g.connect(AC.destination); s.start(t);
  }
  function sfx(k) {
    if (muted) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume();
      var t = AC.currentTime + .01;
      if (k === 'ok') { tone(784, t, .1, 'triangle', .2); tone(1175, t + .08, .16, 'triangle', .2) }
      else if (k === 'bad') { tone(220, t, .16, 'square', .06); tone(165, t + .12, .22, 'square', .06) }
      else if (k === 'pop') { noise(t, .12, .5, 2200); tone(1320, t, .06, 'sine', .08) }
      else if (k === 'bonk') { noise(t, .08, .6, 600); tone(392, t, .12, 'triangle', .18) }
      else if (k === 'up') { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, t + i * .08, .14, 'triangle', .16) }) }
      else if (k === 'go') { tone(880, t, .18, 'sine', .14) }
      else if (k === 'tick') { tone(660, t, .08, 'sine', .1) }
      else if (k === 'end') { [784, 659, 523, 659, 784, 1047].forEach(function (f, i) { tone(f, t + i * .11, .16, 'triangle', .15) }) }
      else if (k === 'pull') { tone(330, t, .1, 'sawtooth', .05); tone(494, t + .07, .12, 'triangle', .14) }
    } catch (e) {}
  }

  /* ── 고르기 화면 ── */
  var rec = load(KEY, {}), last = load(KEY + '-last', {}), mine = last[D.g] || {};
  var ALL = { id: 'all', nm: '모두 섞기', k: [] }; D.units.forEach(function (u) { ALL.k = ALL.k.concat(u.k) });
  var units = D.units.concat([ALL]);
  var uSel = units.filter(function (u) { return u.id === mine.u })[0] || units[0];
  var kOn = {}, gSel = GBY[mine.game] ? mine.game : 'balloon', nPl = mine.np || 2;
  function resetK() { kOn = {}; uSel.k.forEach(function (k) { kOn[k] = 1 }) }
  resetK(); if (mine.u === uSel.id && mine.k && mine.k.length) { var kk = mine.k.filter(function (k) { return uSel.k.indexOf(k) >= 0 }); if (kk.length) { kOn = {}; kk.forEach(function (k) { kOn[k] = 1 }) } }
  function kList() { return uSel.k.filter(function (k) { return kOn[k] }) }
  function recKey(game) { var ks = kList(); return D.g + '|' + uSel.id + (ks.length < uSel.k.length ? ':' + ks.join(',') : '') + '|' + game }

  function drawUnits() {   // 단원은 한 줄 알약(짧은 이름), 고른 단원의 온이름은 아래 칸 제목에
    $('mgUnits').innerHTML = units.map(function (u) {
      var on = u === uSel, tag = u.ss || (u.sem && u.sem.indexOf('학기') < 0 ? u.sem : '');
      return '<button type="button" class="mg-unit' + (u.id === 'all' ? ' all' : '') + '" data-u="' + u.id + '" aria-pressed="' + on + '" title="' + esc((u.sem ? u.sem + ' · ' : '') + u.nm + ' (계산 ' + u.k.length + '가지)') + '">' +
        (tag ? '<span class="mg-sem">' + esc(tag) + '</span>' : '') + '<span class="mg-un">' + esc(u.sh || u.nm) + '</span></button>';
    }).join('');
    $('mgSkills').innerHTML = '<p class="mg-sk-h"><b>' + esc((uSel.sem ? uSel.sem + ' ' : uSel.id === 'all' ? D.g + '학년 ' : '') + uSel.nm) + '</b> · 나오는 계산 ' + uSel.k.length + '가지 <small>(누르면 빼거나 넣을 수 있어요)</small></p><div class="mg-chips">' + uSel.k.map(function (k) {
      var s = AR.BY[k], eg = AR.gen(k, 'mg-eg-' + k);
      var egt = (eg.txt || eg.q).map(function (t) { return typeof t === 'string' ? t : t.k === 'n' ? t.v : t.k === 'd' ? AR.dstr(t.v, t.p) : t.k === 'f' ? (t.w ? t.w + ' ' : '') + t.n + '/' + t.d : '□' }).join(' ');
      return '<button type="button" class="mg-chip" data-k="' + k + '" aria-pressed="' + !!kOn[k] + '" title="' + esc(s.de + ' · 예: ' + egt) + '"><span class="mg-ck" aria-hidden="true"></span><span>' + esc(s.nm) + '</span></button>';
    }).join('') + '</div>';
  }
  function pl(x) { return x.pl[0] === x.pl[1] ? x.pl[0] + '명' : x.pl[0] + '~' + x.pl[1] + '명' }
  var PICO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2" fill="currentColor"/><path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6Z" fill="currentColor"/><circle cx="17" cy="9" r="2.6" fill="currentColor" opacity=".55"/><path d="M15.5 14.3c3 .2 5.5 2.4 5.5 5.7h-4.4" fill="currentColor" opacity=".55"/></svg>';
  function gameCard(x) {
    var b = rec[recKey(x.id)], no = !ksFor(x.id).length;
    return '<button type="button" class="mg-game' + (no ? ' no' : '') + '" data-game="' + x.id + '" aria-pressed="' + (x.id === gSel) + '"><span class="mg-thumb">' + THUMB[x.id] + '<span class="mg-pl">' + PICO + pl(x) + '</span></span>' +
      '<span class="mg-gn">' + esc(x.nm) + '</span><span class="mg-gd">' + esc(x.de) + '</span>' +
      (no ? '<span class="mg-best">' + esc(x.noTxt || '이 내용에서는 할 수 없어요') + '</span>' : x.two ? '<span class="mg-best">' + esc(x.how) + '</span>' : '<span class="mg-best">' + (b ? '최고 기록 ' + b + '점' : '아직 기록이 없어요') + '</span>') + '</button>';
  }
  function drawGames() {
    var solo = GAMES.filter(function (x) { return !x.two }), team = GAMES.filter(function (x) { return x.two });
    $('mgGames').innerHTML =
      '<h3 class="mg-gh"><span class="mg-ghi">' + PICO.replace('opacity=".55"', 'opacity="0"').replace('opacity=".55"', 'opacity="0"') + '</span>혼자서 <small>내 점수와 최고 기록에 도전해요 · 1명</small></h3><div class="mg-games">' + solo.map(gameCard).join('') + '</div>' +
      '<h3 class="mg-gh"><span class="mg-ghi">' + PICO + '</span>함께 <small>한 화면에서 여럿이 겨뤄요 · 전자칠판·태블릿</small></h3><div class="mg-games">' + team.map(gameCard).join('') + '</div>';
    var G = GBY[gSel], np = '';
    if (G.pl[0] < G.pl[1]) { np = '<span class="mg-npl">몇 명?</span>'; for (var k = G.pl[0]; k <= G.pl[1]; k++) np += '<button type="button" data-np="' + k + '" aria-pressed="' + (k === Math.min(G.pl[1], Math.max(G.pl[0], nPl))) + '">' + k + '명</button>' }
    $('mgNp').innerHTML = np; $('mgNp').hidden = !np;
    $('mgSel').innerHTML = '<b>' + esc(uSel.sh || uSel.nm) + '</b> · ' + esc(G.nm) + (np ? '' : ' <span class="mg-selpl">' + pl(G) + '</span>');
  }
  function remember() { last[D.g] = { u: uSel.id, k: kList().length < uSel.k.length ? kList() : [], game: gSel, np: nPl }; save(KEY + '-last', last) }
  $('mgUnits').addEventListener('click', function (e) {
    var b = e.target.closest('.mg-unit'); if (!b) return;
    uSel = units.filter(function (u) { return u.id === b.dataset.u })[0]; resetK(); drawUnits(); drawGames(); remember();
  });
  $('mgSkills').addEventListener('click', function (e) {
    var b = e.target.closest('.mg-chip'); if (!b) return; var k = b.dataset.k;
    if (kOn[k] && kList().length === 1) { b.classList.add('mg-nope'); setTimeout(function () { b.classList.remove('mg-nope') }, 500); return }
    kOn[k] = kOn[k] ? 0 : 1; b.setAttribute('aria-pressed', !!kOn[k]); drawGames(); remember();
  });
  $('mgGames').addEventListener('click', function (e) {
    var b = e.target.closest('.mg-game'); if (!b) return; gSel = b.dataset.game; drawGames(); remember();
  });
  $('mgStart').addEventListener('click', function () {
    if (!ksFor(gSel).length) { var m = $('mgSel'); m.innerHTML = '<b class="mg-warn">' + esc(GBY[gSel].nm) + '</b> 게임은 이 내용에서 할 수 없어요. ' + esc(GBY[gSel].noTxt || '') + ' 다른 게임이나 내용을 골라 주세요.'; return }
    start(gSel);
  });
  $('mgNp').addEventListener('click', function (e) { var b = e.target.closest('[data-np]'); if (!b) return; nPl = +b.dataset.np; drawGames(); remember() });
  function fromHash() {
    var m = /^#(u\d+|all)(?:-(\w+))?$/.exec(location.hash); if (!m) return;
    var u = units.filter(function (x) { return x.id === m[1] })[0]; if (u) { uSel = u; resetK() }
    if (m[2] && GBY[m[2]]) gSel = m[2];
    drawUnits(); drawGames();
  }
  drawUnits(); drawGames(); fromHash(); window.addEventListener('hashchange', fromHash);

  /* ── 게임 공통 ── */
  var S = null, raf = 0, lastT = 0, stage = $('mgStage');
  var RECENT = [];
  var PROBE = {};   // 단계마다 답의 꼴(게임마다 쓸 수 있는 계산 고르기)
  function probe(k) { return PROBE[k] || (PROBE[k] = AR.gen(k, 'mg-probe-' + k).a) }
  function ksFor(game) { var g = typeof GM === 'object' && GM[game]; return kList().filter(function (k) { return !g || !g.can || g.can(AR.BY[k], probe(k)) }) }
  function makeP() {
    var ks = S && S.ks && S.ks.length ? S.ks : kList(), p, k;
    for (var i = 0; i < 30; i++) { p = AR.gen(ks[Math.floor(Math.random() * ks.length)], rnd32()); k = JSON.stringify(p.q || p.txt); if (RECENT.indexOf(k) < 0) break }
    RECENT.push(k); if (RECENT.length > 15) RECENT.shift();
    return { p: p, c: MGC.choices(p, AR.rng(rnd32())) };
  }
  function tap(el, fn) {   // 눌렀을 때 바로(여러 손가락 동시에도) — 키보드는 click으로
    el.addEventListener('pointerdown', function (e) { if (e.button > 0) return; e.preventDefault(); el._pt = Date.now(); fn(e) });
    el.addEventListener('click', function (e) { if (Date.now() - (el._pt || 0) < 700) return; fn(e) });
  }
  function hud(game) {
    var one = !GBY[game].two;
    return '<div class="mg-hud">' +
      '<button type="button" class="mg-hb" data-a="quit" aria-label="그만하기">' + ICO.x + '</button>' +
      '<button type="button" class="mg-hb" data-a="pause" aria-label="잠깐 멈추기">' + ICO.pause + '</button>' +
      (one ? '<span class="mg-pill mg-score"><small>점수</small><b id="mgScore">0</b></span><span class="mg-pill mg-combo" id="mgComboP"><small>연속</small><b id="mgCombo">0</b></span><span class="mg-pill"><small>레벨</small><b id="mgLv">1</b></span>' : '<span class="mg-pill"><b class="mg-hud-t">' + esc(GBY[game].nm) + '</b></span>') +
      '<span class="mg-sp"></span>' +
      (GBY[game].timer ? '<span class="mg-pill mg-time"><small>남은 시간</small><b id="mgTime"></b></span>' : GBY[game].pill ? '<span class="mg-pill mg-time"><small>' + GBY[game].pill + '</small><b id="mgPill">0</b></span>' : one ? '<span class="mg-hearts" id="mgHearts" aria-label="하트"></span>' : '') +
      '<button type="button" class="mg-hb" data-a="full" aria-label="전체 화면">' + ICO.full + '</button>' +
      '<button type="button" class="mg-hb" data-a="mute" aria-label="소리 켜기·끄기" aria-pressed="' + muted + '">' + (muted ? ICO.mute : ICO.vol) + '</button></div>';
  }
  function setHud() {
    if (!S || S.two) return;
    $('mgScore').textContent = S.score; $('mgCombo').textContent = S.combo; $('mgLv').textContent = S.level;
    $('mgComboP').classList.toggle('hot', S.combo >= 3);
    var h = $('mgHearts'); if (h) { var s = ''; for (var i = 0; i < S.maxLives; i++) s += '<span class="mg-heart' + (i < S.lives ? '' : ' gone') + '">' + ICO.heart + '</span>'; h.innerHTML = s }
  }
  function float(txt, x, y, cls) {   // 점수 떠오르기
    var f = document.createElement('div'); f.className = 'mg-float ' + (cls || ''); f.innerHTML = txt; f.style.left = x + 'px'; f.style.top = y + 'px';
    stage.appendChild(f); setTimeout(function () { f.remove() }, 1000);
  }
  function burst(x, y, col) {
    for (var i = 0; i < 12; i++) {
      var d = document.createElement('i'), a = Math.PI * 2 * i / 12 + Math.random() * .4, r = 50 + Math.random() * 50;
      d.className = 'mg-bit'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.background = col || BCOL[i % BCOL.length];
      d.style.setProperty('--dx', Math.cos(a) * r + 'px'); d.style.setProperty('--dy', Math.sin(a) * r + 'px');
      stage.appendChild(d); setTimeout(function (dd) { return function () { dd.remove() } }(d), 700);
    }
  }
  function banner(txt, cls) {
    var b = document.createElement('div'); b.className = 'mg-banner ' + (cls || ''); b.innerHTML = txt; stage.appendChild(b);
    setTimeout(function () { b.remove() }, 1300);
  }
  function center(el) { var r = el.getBoundingClientRect(), s = stage.getBoundingClientRect(); return [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2] }
  /* 정답: frac = 남은 시간 비율(0~1) */
  function gain(frac, el) {
    S.combo++; S.right++; if (S.combo > S.bestCombo) S.bestCombo = S.combo;
    var pts = 10 + Math.round(10 * Math.max(0, Math.min(1, frac))) + Math.min(S.combo - 1, 10) * 2;
    S.score += pts; setHud();
    if (el) { var c = center(el); float('+' + pts + (S.combo >= 3 ? '<small>' + S.combo + '연속!</small>' : ''), c[0], c[1] - 30) }
    if (S.right % 5 === 0) { S.level++; setHud(); setTimeout(function () { if (S && !S.over) { banner('레벨 ' + S.level + '!<small>' + (S.game === 'rocket' ? '계속 올라가요' : '조금 더 빨라져요') + '</small>', 'lv'); sfx('up') } }, 250) }
  }
  function wrongRec(q, pick) { if (q.rec) return; q.rec = 1; S.wrong++; S.list.push({ p: q.p, a: q.c.opts[q.c.ok], pick: pick }) }
  function loseLife() {
    S.combo = 0; S.lives--; setHud(); stage.classList.remove('mg-shake'); void stage.offsetWidth; stage.classList.add('mg-shake');
    if (S.lives <= 0) { S.ending = 1; setTimeout(function () { end('하트를 모두 썼어요') }, 700) }
  }
  function qbox(q) { return (hintOf(q.p) ? '<span class="mg-hint">' + esc(hintOf(q.p)) + '</span>' : '') + qH(q.p) }
  function speedOf(base, step, min) { return Math.max(min, base - step * (S.level - 1)) * (D.g <= 2 ? 1.15 : 1) }

  function start(game) {
    var two = !!GBY[game].two;
    var P = GBY[game].pl;
    S = { ks: ksFor(game), game: game, two: two, np: P[0] === P[1] ? P[0] : Math.min(P[1], Math.max(P[0], nPl)), score: 0, combo: 0, bestCombo: 0, right: 0, wrong: 0, level: 1, lives: 3, maxLives: 3, list: [], over: false, paused: true, wait: 0, t: 0 };
    stage.className = 'mg-stage mg-g-' + game; stage.hidden = false; document.body.classList.add('mg-playing');
    stage.innerHTML = hud(game) + '<div class="mg-play" id="mgPlay"></div>';
    GM[game].init(); setHud();
    var my = S;
    countdown(function () { if (S !== my) return; S.paused = !!stage.querySelector('.mg-pause'); S.started = true; GM[game].go(); lastT = performance.now(); loop() });
  }
  function countdown(fn) {
    var n = 3, c = document.createElement('div'), my = S; c.className = 'mg-count'; stage.appendChild(c);
    (function step() {
      if (S !== my) return c.remove();
      c.innerHTML = '<b>' + (n ? n : '시작!') + '</b>'; c.classList.remove('on'); void c.offsetWidth; c.classList.add('on'); sfx(n ? 'tick' : 'go');
      if (n-- > 0) setTimeout(step, 650); else setTimeout(function () { c.remove(); if (S === my) fn() }, 450);
    })();
  }
  function loop() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function f(now) {
      if (!S) return;
      var dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
      if (!S.paused && !S.over && S.started) { S.t += dt; GM[S.game].tick(dt) }
      raf = requestAnimationFrame(f);
    });
  }
  function pause(on) {
    if (!S || S.over) return; S.paused = on; var o = stage.querySelector('.mg-pause');
    if (on && !o) {
      o = document.createElement('div'); o.className = 'mg-pause'; o.innerHTML = '<div class="mg-card"><h2>잠깐 멈췄어요</h2><p>준비되면 계속해요.</p><div class="mg-btns"><button type="button" class="mg-btn go" data-a="resume">계속하기</button><button type="button" class="mg-btn" data-a="stop">그만하고 점수 보기</button></div></div>';
      stage.appendChild(o);
    } else if (!on && o) o.remove();
  }
  function close() {
    cancelAnimationFrame(raf); S = null; stage.hidden = true; stage.innerHTML = ''; document.body.classList.remove('mg-playing');
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    drawGames();
  }
  stage.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return; var a = b.dataset.a;
    if (a === 'quit') { if (!S || S.over || (!S.right && !S.wrong)) close(); else { pause(true) } }
    else if (a === 'pause') pause(true);
    else if (a === 'resume') { pause(false); lastT = performance.now() }
    else if (a === 'stop') { stage.querySelector('.mg-pause').remove(); end('그만했어요') }
    else if (a === 'mute') { muted = !muted; save(KEY + '-mute', muted); b.innerHTML = muted ? ICO.mute : ICO.vol; b.setAttribute('aria-pressed', muted) }
    else if (a === 'full') { try { if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen() } catch (er) {} }
    else if (a === 'again') { var g = S.game; close(); start(g) }
    else if (a === 'menu') close();
  });
  document.addEventListener('keydown', function (e) {
    if (!S) return;
    if (e.key === 'Escape') { if (S.over) close(); else pause(!S.paused) }
    else if (S.started && !S.paused && !S.over && GM[S.game].keyAny && GM[S.game].keyAny(e.key.toLowerCase())) {}
    else if (/^[1-4]$/.test(e.key) && S.started && !S.paused && !S.over && GM[S.game].key) GM[S.game].key(+e.key - 1);
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden && S && !S.over && !S.paused) pause(true) });

  function stars(n, th) { var k = th ? th.filter(function (x) { return n >= x }).length : 0; return k }
  function end(why) {
    if (!S || S.over) return; S.over = true; GM[S.game].stop && GM[S.game].stop();
    var o = document.createElement('div'); o.className = 'mg-over';
    if (S.two) { o.innerHTML = GM[S.game].result(why); stage.appendChild(o); sfx('end'); return }
    var key = recKey(S.game), old = rec[key] || 0, best = S.score > old;
    if (best) { rec[key] = S.score; save(KEY, rec) }
    var st = GM[S.game].stars ? GM[S.game].stars() : stars(S.right, GBY[S.game].stars), sh = '';
    for (var i = 0; i < 3; i++) sh += '<span class="mg-st' + (i < st ? ' on' : '') + '" style="animation-delay:' + (.25 + i * .25) + 's">' + ICO.star + '</span>';
    var wl = S.list.slice(-12).map(function (w) {
      return '<li><span class="mg-wq">' + qH(w.p).replace('<span class="mg-blank">?</span>', '<span class="mg-blank ok">' + aH(w.a) + '</span>') + '</span>' +
        (hintOf(w.p) ? '<span class="mg-hint">' + esc(hintOf(w.p)) + '</span>' : '') + '<span class="mg-wa">정답 <b>' + aH(w.a) + '</b>' + (w.pick ? ' · 내가 고른 답 ' + aH(w.pick) : ' · 놓쳤어요') + '</span></li>';
    }).join('');
    o.innerHTML = '<div class="mg-card mg-res"><p class="mg-why">' + esc(why) + '</p><h2>게임 끝!</h2><div class="mg-stars">' + sh + '</div>' +
      '<p class="mg-big"><b>' + S.score + '</b>점</p>' + (best && S.score ? '<p class="mg-new">새 최고 기록!</p>' : old ? '<p class="mg-old">최고 기록 ' + old + '점</p>' : '') +
      (GM[S.game].endText ? '<p class="mg-old">' + esc(GM[S.game].endText()) + '</p>' : '') +
      (GM[S.game].endText ? '' : '<div class="mg-stats"><span>맞힌 문제 <b>' + S.right + '</b></span><span>틀리거나 놓친 문제 <b>' + S.wrong + '</b></span><span>최고 연속 <b>' + S.bestCombo + '</b></span></div>') +
      (wl ? '<details class="mg-wl"' + (S.wrong <= 4 ? ' open' : '') + '><summary>틀린 문제 다시 보기 (' + S.list.length + ')</summary><ul>' + wl + '</ul></details>' : S.right && !GM[S.game].endText ? '<p class="mg-perfect">하나도 안 틀렸어요! 정말 멋져요.</p>' : '') +
      '<div class="mg-btns"><button type="button" class="mg-btn go" data-a="again">한 판 더</button><button type="button" class="mg-btn" data-a="menu">게임 고르기로</button></div></div>';
    stage.appendChild(o); sfx('end');
  }

  var GM = {};

  /* ── 풍선 터뜨리기 ── */
  GM.balloon = {
    init: function () {
      $('mgPlay').innerHTML = '<div class="mg-sky"><i class="mg-sun"></i><i class="mg-cloud c1"></i><i class="mg-cloud c2"></i><i class="mg-cloud c3"></i>' +
        '<svg class="mg-hills" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90q150-70 300-10t300 0 300-20 300 10v90H0Z" fill="#A6DB86"/><path d="M0 120q200-50 400 0t400-10 400 10v40H0Z" fill="#86C766"/></svg></div>' +
        '<div class="mg-qbox" id="mgQ"></div><div class="mg-field" id="mgField"></div>';
    },
    go: function () { this.next() },
    next: function () {
      var f = $('mgField'); f.innerHTML = ''; var q = this.q = makeP(); q.t = 0; q.done = false; $('mgQ').innerHTML = qbox(q);
      var n = q.c.opts.length, lanes = shuf(n === 3 ? [.2, .5, .8] : [.13, .38, .63, .88]), dl = shuf([0, .45, .9, 1.35].slice(0, n)), cols = shuf(BCOL.slice());
      var H = f.clientHeight, dur = speedOf(9.5, .7, 4.4);
      this.bs = q.c.opts.map(function (o, i) {
        var el = document.createElement('div'); el.className = 'mg-bal'; el.style.left = (lanes[i] * 100) + '%';
        el.innerHTML = balloonSvg(cols[i]) + '<span class="mg-lab ' + szCls(o) + '">' + aH(o) + '</span>';
        el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('aria-label', plain(o));
        f.appendChild(el);
        var b = { el: el, i: i, y: 0, d: dl[i], ph: Math.random() * 6, v: (H + el.offsetHeight + 20) / dur, h: el.offsetHeight, live: true };
        tap(el, function () { GM.balloon.hit(b) });
        el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); GM.balloon.hit(b) } });
        return b;
      });
      this.dur = dur;
    },
    hit: function (b) {
      var q = this.q; if (!S || S.paused || S.over || q.done || !b.live || b.d > 0) return;
      var c = center(b.el);
      if (b.i === q.c.ok) {
        q.done = true; b.live = false; b.el.classList.add('pop'); burst(c[0], c[1] - 20); sfx('pop'); sfx('ok');
        gain(1 - q.t / this.dur, b.el); S.wait = .55;
        this.bs.forEach(function (x) { if (x !== b) { x.live = false; x.el.classList.add('fade') } });
      } else {
        b.live = false; b.el.classList.add('bad'); b.v = -Math.abs(b.v) * 2.2; sfx('bad');
        wrongRec(q, q.c.opts[b.i]); loseLife();
      }
    },
    tick: function (dt) {
      if (S.ending) return;
      if (S.wait > 0) { S.wait -= dt; if (S.wait <= 0) this.next(); return }
      var q = this.q, f = $('mgField'), H = f.clientHeight; q.t += dt;
      this.bs.forEach(function (b) {
        if (b.d > 0) { b.d -= dt; return }
        b.y += b.v * dt; var sw = Math.sin(q.t * 1.7 + b.ph) * 12;
        b.el.style.transform = 'translate(calc(-50% + ' + sw.toFixed(1) + 'px),' + (-b.y).toFixed(1) + 'px)';
      });
      var okb = this.bs[q.c.ok];
      if (!q.done && okb.y > H + okb.h + 10) {   // 정답 풍선이 날아감
        q.done = true; wrongRec(q, null); sfx('bad');
        banner('정답은 <b>' + aH(q.c.opts[q.c.ok]) + '</b>', 'ans'); loseLife(); S.wait = 1.3;
        this.bs.forEach(function (x) { x.live = false; x.el.classList.add('fade') });
      }
    },
    key: function (i) { var b = this.bs && this.bs.slice().sort(function (a, c) { return parseFloat(a.el.style.left) - parseFloat(c.el.style.left) })[i]; if (b) this.hit(b) }
  };

  /* ── 두더지 잡기 ── */
  GM.mole = {
    init: function () {
      var h = ''; for (var i = 0; i < 6; i++) h += '<div class="mg-hole"><svg class="mg-hback" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="100" cy="30" rx="96" ry="26" fill="#4A2E1A"/><ellipse cx="100" cy="34" rx="84" ry="20" fill="#2B190D"/></svg>' +
        '<div class="mg-mwrap"><div class="mg-mole" role="button" tabindex="-1">' + MOLE + '<span class="mg-sign"><span class="mg-lab"></span></span></div></div>' +
        '<svg class="mg-hfront" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 8q100 30 200 0v32H0Z" fill="#6E4524"/><path d="M0 8q100 30 200 0" fill="none" stroke="#8C5A30" stroke-width="5"/></svg></div>';
      $('mgPlay').innerHTML = '<div class="mg-meadow"><i class="mg-cloud c1"></i><svg class="mg-fence" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30h1200M0 60h1200" stroke="#E9D3A8" stroke-width="8"/>' + Array.apply(null, Array(25)).map(function (_, i) { return '<rect x="' + (i * 50 + 10) + '" y="8" width="14" height="72" rx="6" fill="#F3E2BE"/>' }).join('') + '</svg></div>' +
        '<div class="mg-qbox" id="mgQ"></div><div class="mg-holes" id="mgHoles">' + h + '</div><div class="mg-hammer" id="mgHammer">' + HAMMER + '</div>';
      var self = this;
      this.ms = [].slice.call(stage.querySelectorAll('.mg-mole')).map(function (el, i) {
        var m = { el: el, i: -1, up: false };
        tap(el, function (e) { self.swing(e); self.hit(m) });
        el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self.hit(m) } });
        return m;
      });
      tap($('mgHoles'), function (e) { if (!e.target.closest('.mg-mole')) self.swing(e) });
    },
    swing: function (e) {
      var hm = $('mgHammer'), s = stage.getBoundingClientRect(), x = (e.clientX || 0) - s.left, y = (e.clientY || 0) - s.top;
      if (!e.clientX && e.target) { var c = center(e.target); x = c[0]; y = c[1] }
      hm.style.left = x + 'px'; hm.style.top = y + 'px'; hm.classList.remove('hit'); void hm.offsetWidth; hm.classList.add('hit');
    },
    go: function () { this.next() },
    next: function () {
      var q = this.q = makeP(); q.t = 0; q.done = false; $('mgQ').innerHTML = qbox(q);
      var holes = shuf([0, 1, 2, 3, 4, 5]).slice(0, q.c.opts.length), dl = shuf([0, .2, .4, .6].slice(0, q.c.opts.length));
      this.dur = speedOf(7, .5, 3.4);
      this.ms.forEach(function (m) { m.i = -1; m.up = false; m.el.className = 'mg-mole'; m.el.setAttribute('tabindex', '-1') });
      q.c.opts.forEach(function (o, j) {
        var m = this.ms[holes[j]]; m.i = j; m.d = dl[j];
        var lab = m.el.querySelector('.mg-lab'); lab.className = 'mg-lab ' + szCls(o); lab.innerHTML = aH(o); m.el.setAttribute('aria-label', plain(o));
      }, this);
    },
    hide: function (m, cls) { m.up = false; m.el.classList.remove('up'); if (cls) m.el.classList.add(cls); m.el.setAttribute('tabindex', '-1') },
    hit: function (m) {
      var q = this.q; if (!S || S.paused || S.over || q.done || !m.up) return;
      if (m.i === q.c.ok) {
        q.done = true; m.el.classList.add('bonk'); var c = center(m.el); burst(c[0], c[1] - 30, '#FFD166'); sfx('bonk'); sfx('ok');
        gain(1 - Math.max(0, q.t - m.at) / this.dur, m.el); S.wait = .75;
        var self = this; this.ms.forEach(function (x) { if (x !== m && x.up) self.hide(x) });
        setTimeout(function () { if (m.el.classList.contains('bonk')) self.hide(m) }, 450);
      } else {
        this.hide(m, 'laugh'); sfx('bad'); wrongRec(q, q.c.opts[m.i]); loseLife();
      }
    },
    tick: function (dt) {
      if (S.ending) return;
      if (S.wait > 0) { S.wait -= dt; if (S.wait <= 0) this.next(); return }
      var q = this.q, self = this; q.t += dt;
      this.ms.forEach(function (m) { if (m.i >= 0 && !m.up && m.d !== null && q.t >= m.d && !m.el.classList.contains('laugh')) { m.up = true; m.d = null; m.at = q.t; m.el.classList.add('up'); m.el.setAttribute('tabindex', '0') } });
      if (!q.done && q.t > this.dur + .6) {
        q.done = true; wrongRec(q, null); sfx('bad'); banner('정답은 <b>' + aH(q.c.opts[q.c.ok]) + '</b>', 'ans'); loseLife(); S.wait = 1.3;
        this.ms.forEach(function (m) { if (m.up) self.hide(m) });
      }
    },
    key: function (i) { var up = this.ms.filter(function (m) { return m.up }); if (up[i]) this.hit(up[i]) }
  };

  /* ── 60초 우주 도전 ── */
  GM.rocket = {
    T: 60,
    init: function () {
      var st = ''; for (var i = 0; i < 70; i++) st += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 3).toFixed(2) + 's;--s:' + (1 + Math.random() * 2.2).toFixed(1) + 'px"></i>';
      $('mgPlay').innerHTML = '<div class="mg-space"><div class="mg-starf" id="mgStars">' + st + '</div><svg class="mg-planet" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="58" fill="#B07CFF"/><path d="M58 80q42 14 86-6M50 110q50 16 100-4" stroke="#C9A6FF" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="100" rx="96" ry="18" fill="none" stroke="#E7D6FF" stroke-width="7" transform="rotate(-14 100 100)"/></svg>' +
        '</div>' +
        '<div class="mg-tbar"><i id="mgTbar"></i></div>' +
        '<div class="mg-rk"><div class="mg-track"><div class="mg-ship" id="mgRocket">' + ROCKET + '</div></div><p class="mg-alt" id="mgAlt">0 m</p></div>' +
        '<div class="mg-rmain"><div class="mg-qbox" id="mgQ"></div><div class="mg-opts" id="mgOpts"></div></div>';
      this.left = this.T; this.lastSec = -1; this.alt = 0;
    },
    go: function () { this.next() },
    next: function () {
      var q = this.q = makeP(); q.t = 0; q.done = false; $('mgQ').innerHTML = qbox(q);
      var box = $('mgOpts'), self = this; box.className = 'mg-opts n' + q.c.opts.length;
      box.innerHTML = q.c.opts.map(function (o, i) { return '<button type="button" class="mg-opt" data-i="' + i + '" aria-label="' + (i + 1) + '번 ' + esc(plain(o)) + '"><span class="mg-key">' + (i + 1) + '</span><span class="mg-lab ' + szCls(o) + '">' + aH(o) + '</span></button>' }).join('');
      [].forEach.call(box.children, function (b) { tap(b, function () { self.hit(+b.dataset.i) }) });
    },
    hit: function (i) {
      var q = this.q; if (!S || S.paused || S.over || q.done) return;
      var bs = $('mgOpts').children; q.done = true;
      if (i === q.c.ok) {
        bs[i].classList.add('right'); sfx('ok'); gain(1 - q.t / 6, bs[i]); this.climb(); S.wait = .3;
      } else {
        bs[i].classList.add('wrong'); bs[q.c.ok].classList.add('right'); sfx('bad'); wrongRec(q, q.c.opts[i]);
        S.combo = 0; setHud(); this.left = Math.max(0, this.left - 2); float('−2초', center(bs[i])[0], center(bs[i])[1] - 30, 'minus');
        stage.classList.remove('mg-shake'); void stage.offsetWidth; stage.classList.add('mg-shake'); S.wait = 1.1;
      }
    },
    climb: function () {
      var r = S.right, pos = r / (r + 8);
      $('mgRocket').style.bottom = (pos * 82) + '%'; $('mgAlt').textContent = (r * 100).toLocaleString('ko-KR') + ' m';
      var rk = $('mgRocket'); rk.classList.remove('boost'); void rk.offsetWidth; rk.classList.add('boost');
      $('mgStars').style.setProperty('--sp', Math.max(1.2, 8 - r * .3) + 's');
    },
    tick: function (dt) {
      this.left -= dt; var L = Math.max(0, this.left), s = Math.ceil(L);
      $('mgTime').textContent = s + '초'; $('mgTbar').style.width = (L / this.T * 100) + '%'; $('mgTbar').classList.toggle('low', L <= 10);
      if (s !== this.lastSec && s <= 5 && s > 0) sfx('tick'); this.lastSec = s;
      if (L <= 0) { end('시간이 다 됐어요'); return }
      if (S.wait > 0) { S.wait -= dt; if (S.wait <= 0) this.next(); return }
      this.q.t += dt;
    },
    key: function (i) { if (this.q && i < this.q.c.opts.length) this.hit(i) }
  };

  /* ── 아래쪽 보기 단추(탑 쌓기·우주 침공 막기) ── */
  function bottomOpts(q, fn) {
    var box = $('mgOpts'); box.className = 'mg-opts mg-bopts n' + q.c.opts.length;
    box.innerHTML = q.c.opts.map(function (o, i) { return '<button type="button" class="mg-opt" data-i="' + i + '" aria-label="' + (i + 1) + '번 ' + esc(plain(o)) + '"><span class="mg-key">' + (i + 1) + '</span><span class="mg-lab ' + szCls(o) + '">' + aH(o) + '</span></button>' }).join('');
    [].forEach.call(box.children, function (b) { tap(b, function () { fn(+b.dataset.i) }) });
  }
  var BLK = ['#FF6B6B', '#FFB238', '#FFD93D', '#6BCB77', '#4DA3FF', '#B07CFF', '#FF7EB6', '#2EC4B6'];

  /* ── 탑 쌓기 ── */
  GM.tower = {
    init: function () {
      $('mgPlay').innerHTML = '<div class="mg-dusk"><i class="mg-sun2"></i><i class="mg-cloud c0"></i><i class="mg-cloud c1"></i>' +
        '<svg class="mg-sky2" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 200V120h60V80h50v40h40V60h70v60h30V100h60v100Zm400 0V110h50V70h60v50h40V90h70v110Zm300 0V100h40V50h80v70h30V90h60v110Zm300 0V120h50V70h60v60h50v70Z" fill="#B98CB8" opacity=".55"/></svg>' +
        '<div class="mg-gnd"></div></div>' +
        '<div class="mg-qbox" id="mgQ"></div>' +
        '<div class="mg-tw" id="mgTw"><div class="mg-crane"><i class="mg-hook"></i><i class="mg-hang" id="mgHang"></i></div><div class="mg-twin" id="mgTwin"><div class="mg-base"></div></div><p class="mg-fl" id="mgFl">0층</p></div>' +
        '<div id="mgOpts"></div>';
      this.n = 0;
    },
    go: function () { this.next() },
    next: function () {
      var q = this.q = makeP(), self = this; q.t = 0; q.done = false; $('mgQ').innerHTML = qbox(q) + '<span class="mg-qt"><i id="mgQt"></i></span>';
      this.dur = speedOf(10, .6, 5); this.col = BLK[this.n % BLK.length];
      $('mgHang').style.background = this.col;
      bottomOpts(q, function (i) { self.hit(i) });
    },
    floors: function () {
      var tw = $('mgTwin'), bh = tw.querySelector('.mg-blk') ? tw.querySelector('.mg-blk').offsetHeight : 34, vis = Math.max(4, Math.floor(($('mgTw').clientHeight - 120) / bh));
      tw.style.transform = 'translateY(' + Math.max(0, this.n - vis) * bh + 'px)';
      $('mgFl').textContent = this.n + '층';
    },
    hit: function (i) {
      var q = this.q; if (!S || S.paused || S.over || q.done) return;
      var bs = $('mgOpts').children; q.done = true;
      if (i === q.c.ok) {
        bs[i].classList.add('right'); sfx('ok');
        var b = document.createElement('div'); b.className = 'mg-blk drop'; b.style.background = this.col; b.style.marginLeft = (Math.random() * 16 - 8).toFixed(1) + 'px';
        b.style.width = (82 + Math.random() * 14).toFixed(1) + '%';
        $('mgTwin').appendChild(b); this.n++; this.floors();
        gain(1 - q.t / this.dur, b); S.wait = .55;
        if (this.n % 10 === 0) setTimeout(function () { if (S && !S.over) banner(GM.tower.n + '층 돌파!', 'lv') }, 700);
      } else {
        bs[i].classList.add('wrong'); bs[q.c.ok].classList.add('right'); sfx('bad'); wrongRec(q, q.c.opts[i]); this.drop(); S.wait = 1.2;
      }
    },
    drop: function () {   // 틀리거나 시간이 지나면 맨 위 블록이 떨어짐
      var tw = $('mgTwin'), all = tw.querySelectorAll('.mg-blk:not(.fall)'), top = all[all.length - 1];
      $('mgTw').classList.remove('wob'); void $('mgTw').offsetWidth; $('mgTw').classList.add('wob');
      if (top) { top.classList.add('fall'); this.n--; var self = this; setTimeout(function () { top.remove(); if (S) self.floors() }, 650) }
      loseLife();
    },
    tick: function (dt) {
      if (S.ending) return;
      if (S.wait > 0) { S.wait -= dt; if (S.wait <= 0) this.next(); return }
      var q = this.q; q.t += dt; var L = Math.max(0, 1 - q.t / this.dur);
      $('mgQt').style.width = (L * 100) + '%'; $('mgQt').classList.toggle('low', L < .3);
      if (!q.done && q.t >= this.dur) {
        q.done = true; wrongRec(q, null); sfx('bad'); $('mgOpts').children[q.c.ok].classList.add('right');
        banner('시간이 지났어요<small>정답은 ' + plain(q.c.opts[q.c.ok]) + '</small>', 'ans'); this.drop(); S.wait = 1.4;
      }
    },
    key: function (i) { if (this.q && i < this.q.c.opts.length) this.hit(i) }
  };

  /* ── 우주 침공 막기 ── */
  GM.invader = {
    init: function () {
      var st = ''; for (var i = 0; i < 60; i++) st += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 3).toFixed(2) + 's;--s:' + (1 + Math.random() * 2).toFixed(1) + 'px"></i>';
      $('mgPlay').innerHTML = '<div class="mg-space mg-night"><div class="mg-starf">' + st + '</div></div>' +
        '<div class="mg-ifield" id="mgField"><svg class="mg-town" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120V70h50V40h40v30h50V20h60v50h40V50h60v70Zm300 0V60h60V30h50v40h40V45h70v75Zm320 0V55h50V25h60v45h40V60h60v60Zm280 0V65h60V35h60v40h40V50h60v70Z" fill="#2E2A73"/>' +
        Array.apply(null, Array(30)).map(function (_, i) { return '<rect x="' + (i * 40 + 18) + '" y="' + (78 + (i % 3) * 12) + '" width="8" height="8" fill="#FFD93D" opacity=".8"/>' }).join('') + '</svg>' +
        '<div class="mg-cannon" id="mgCannon">' + CANNON + '</div></div><div id="mgOpts"></div>';
    },
    go: function () { this.next() },
    next: function () {
      var q = this.q = makeP(), self = this, f = $('mgField'); q.t = 0; q.done = false;
      var old = f.querySelector('.mg-alien'); if (old) old.remove();
      var a = document.createElement('div'); a.className = 'mg-alien'; a.innerHTML = ALIEN + '<div class="mg-asign">' + qbox(q) + '</div>';
      a.style.left = (22 + Math.random() * 56).toFixed(1) + '%'; f.appendChild(a);
      this.a = a; this.y = 0; this.dur = speedOf(11, .7, 5); this.ph = Math.random() * 6;
      bottomOpts(q, function (i) { self.hit(i) });
    },
    laser: function (hitIt) {
      var f = $('mgField'), fr = f.getBoundingClientRect(), c = $('mgCannon').getBoundingClientRect(), a = this.a.querySelector('.mg-asvg').getBoundingClientRect();
      var x1 = c.left + c.width / 2 - fr.left, y1 = c.top - fr.top, x2 = a.left + a.width / 2 - fr.left, y2 = a.top + a.height * .7 - fr.top;
      if (!hitIt) { x2 = x1 + (Math.random() < .5 ? -1 : 1) * (120 + Math.random() * 120); y2 = 0 }
      var L = document.createElement('i'), len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      L.className = 'mg-laser' + (hitIt ? '' : ' miss'); L.style.left = x1 + 'px'; L.style.top = y1 + 'px'; L.style.width = len + 'px'; L.style.transform = 'rotate(' + ang + 'deg)';
      f.appendChild(L); setTimeout(function () { L.remove() }, 350);
      var cn = $('mgCannon'); cn.style.transform = 'translateX(-50%) rotate(' + (ang + 90).toFixed(1) + 'deg)';
    },
    hit: function (i) {
      var q = this.q; if (!S || S.paused || S.over || q.done) return;
      var bs = $('mgOpts').children;
      if (i === q.c.ok) {
        q.done = true; bs[i].classList.add('right'); this.laser(true); sfx('pop'); sfx('ok');
        var c = center(this.a.querySelector('.mg-asvg')); burst(c[0], c[1], '#FFD93D'); this.a.classList.add('boom');
        gain(1 - this.y, this.a.querySelector('.mg-asvg')); S.wait = .6;
      } else {
        if (bs[i].classList.contains('wrong')) return;
        bs[i].classList.add('wrong'); this.laser(false); sfx('bad'); wrongRec(q, q.c.opts[i]);
        this.y = Math.min(.95, this.y + .12); loseLife();   // 틀리면 외계인이 한 걸음 더 내려옴
      }
    },
    tick: function (dt) {
      if (S.ending) return;
      if (S.wait > 0) { S.wait -= dt; if (S.wait <= 0) this.next(); return }
      var q = this.q, f = $('mgField'), H = f.clientHeight - 110, a = this.a; q.t += dt;
      this.y += dt / this.dur;
      var sw = Math.sin(q.t * 1.4 + this.ph) * 30;
      a.style.transform = 'translate(calc(-50% + ' + sw.toFixed(1) + 'px),' + (this.y * Math.max(0, H - a.offsetHeight)).toFixed(1) + 'px)';
      if (!q.done && this.y >= 1) {
        q.done = true; wrongRec(q, null); sfx('bonk'); a.classList.add('land'); $('mgOpts').children[q.c.ok].classList.add('right');
        banner('외계인이 내려왔어요<small>정답은 ' + plain(q.c.opts[q.c.ok]) + '</small>', 'ans'); loseLife(); S.wait = 1.5;
      }
    },
    key: function (i) { if (this.q && i < this.q.c.opts.length) this.hit(i) }
  };

  /* ── 혼자서 3가지(2026-10-07): 짝 맞추기·금고 열기·줄 세우기 — 빠르기보다 기억·정확·어림 ── */
  function qOnly(p) { return qH(p).replace('<span class="mg-op">=</span><span class="mg-blank">?</span>', '') }   // 식만('= ?' 뺌)
  function aVal(a) { return a.t === 'n' ? a.v : a.t === 'd' ? a.v / AR.P10[a.p] : a.t === 'f' ? a.n / a.d : NaN }

  /* 짝 맞추기 카드: 식 카드와 답 카드 짝짓기 */
  GM.memory = {
    can: function (s, a) { return a.t !== 'cmp' && a.t !== 'list' },
    init: function () {
      $('mgPlay').innerHTML = '<div class="mg-felt"></div><p class="mg-mhelp" id="mgMh">카드 두 장을 뒤집어 <b>식</b>과 그 <b>답</b>을 짝지어요</p><div class="mg-cards" id="mgCards"></div>';
      this.flips = 0; this.miss = 0; this.round = 0;
    },
    go: function () { this.deal() },
    deal: function () {
      var pairs = [], seenA = {}, seenQ = {};
      for (var t = 0; t < 300 && pairs.length < 8; t++) {
        var q = makeP(), ka = MGC.vkey(q.p.a), kq = JSON.stringify(q.p.q || q.p.txt);
        if (seenA[ka] || seenQ[kq]) continue; seenA[ka] = seenQ[kq] = 1; pairs.push(q);
      }
      var cards = [];
      pairs.forEach(function (q, i) { cards.push({ i: i, kind: 'q', h: qOnly(q.p), q: q }); cards.push({ i: i, kind: 'a', h: aH(q.p.a), q: q }) });
      shuf(cards); this.cards = cards; this.open = []; this.left = pairs.length; this.lock = false; this.round++;
      var box = $('mgCards'), self = this; box.className = 'mg-cards n' + cards.length;
      box.innerHTML = cards.map(function (c, k) {
        return '<button type="button" class="mg-card2" data-k="' + k + '" aria-label="' + (k + 1) + '번 카드"><span class="mg-cin"><span class="mg-cback"><i></i></span><span class="mg-cface ' + c.kind + '">' +
          (c.kind === 'q' ? '<small>식</small>' : '<small>답</small>') + '<span class="mg-ctx">' + c.h + '</span></span></span></button>';
      }).join('');
      [].forEach.call(box.children, function (b) { tap(b, function () { self.flip(+b.dataset.k) }) });
    },
    flip: function (k) {
      if (!S || S.paused || S.over || this.lock) return;
      var c = this.cards[k], el = $('mgCards').children[k]; if (c.done || this.open.indexOf(k) >= 0) return;
      el.classList.add('up'); this.open.push(k); this.flips++; $('mgPill').textContent = this.flips; sfx('tick');
      if (this.open.length < 2) return;
      var a = this.cards[this.open[0]], b = c, e0 = $('mgCards').children[this.open[0]], self = this;
      if (a.i === b.i && a.kind !== b.kind) {
        a.done = b.done = true; this.open = []; this.left--;
        setTimeout(function () { e0.classList.add('done'); el.classList.add('done'); sfx('ok') }, 250);
        gain(this.miss ? .3 : 1, el); this.lastMiss = false;
        if (!this.left) { this.lock = true; S.ending = 1; setTimeout(function () { if (S && !S.over) { sfx('up'); end('모두 짝지었어요!') } }, 900) }
      } else {
        this.lock = true; this.miss++; S.combo = 0; S.wrong++; setHud();
        setTimeout(function () { e0.classList.add('nope'); el.classList.add('nope'); sfx('bad') }, 300);
        setTimeout(function () { e0.classList.remove('up', 'nope'); el.classList.remove('up', 'nope'); self.open = []; self.lock = false }, 1100);
      }
    },
    tick: function () {},
    stars: function () { return this.left ? 0 : this.miss <= 4 ? 3 : this.miss <= 9 ? 2 : 1 },
    endText: function () { return '뒤집은 횟수 ' + this.flips + '번 · 짝이 아니었던 때 ' + this.miss + '번' }
  };

  /* 금고 열기: 보기 없이 답을 직접 써요 */
  GM.vault = {
    LOCKS: 5,
    init: function () {
      var lk = ''; for (var i = 0; i < this.LOCKS; i++) lk += '<i class="mg-lk" id="mgLk' + i + '"></i>';
      $('mgPlay').innerHTML = '<div class="mg-bank"></div>' +
        '<div class="mg-vault"><div class="mg-safe" id="mgSafe"><div class="mg-door"><div class="mg-dial"><i></i></div><div class="mg-locks">' + lk + '</div></div><div class="mg-gold2" aria-hidden="true"><i></i><i></i><i></i></div></div><p class="mg-vno" id="mgVno"></p></div>' +
        '<div class="mg-vmain"><div class="mg-qbox" id="mgQ"></div><div class="mg-ans" id="mgAns"></div><p class="mg-vmsg" id="mgVmsg" aria-live="polite"></p>' +
        '<div class="mg-kp" id="mgKp">' + ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '⌫'].map(function (k) { return '<button type="button" data-k="' + k + '">' + k + '</button>' }).join('') +
        '<button type="button" data-k="," class="mg-kc">,</button><button type="button" data-k="tab" class="mg-kw">다음 칸</button><button type="button" data-k="ok" class="mg-kok">열기</button></div></div>';
      this.opened = 0; this.vaults = 0; var self = this;
      [].forEach.call($('mgKp').children, function (b) { b.addEventListener('mousedown', function (e) { e.preventDefault() }); tap(b, function () { self.kp(b.dataset.k) }) });
    },
    go: function () { this.newVault() },
    newVault: function () {
      this.opened = 0; this.vaults++; $('mgVno').textContent = this.vaults + '번째 금고';
      $('mgSafe').classList.remove('open'); for (var i = 0; i < this.LOCKS; i++) $('mgLk' + i).classList.remove('on');
      this.next();
    },
    next: function () {
      var q = this.q = makeP(), a = q.p.a; q.t = 0; q.tries = 0; q.done = false; $('mgQ').innerHTML = qbox(q); $('mgVmsg').textContent = '';
      var h = '', inp = function (id, ph, w) { return '<input class="mg-in' + (w ? ' ' + w : '') + '" id="' + id + '" inputmode="none" autocomplete="off" aria-label="' + ph + '" placeholder="' + ph + '">' };
      if (a.t === 'cmp') h = '<div class="mg-cmp">' + ['>', '=', '<'].map(function (v) { return '<button type="button" data-v="' + v + '">' + v + '</button>' }).join('') + '</div>';
      else if (a.t === 'qr') h = '<span class="mg-row">몫 ' + inp('mgI0', '몫') + ' <span class="mg-qr2">…</span> 나머지 ' + inp('mgI1', '나머지') + '</span>';
      else if (a.t === 'f') h = '<span class="mg-row">' + inp('mgI0', '자연수', 'w') + '<span class="mg-fin">' + inp('mgI1', '분자', 's') + '<i></i>' + inp('mgI2', '분모', 's') + '</span><small class="mg-fh">자연수 칸은 비워도 돼요</small></span>';
      else h = '<span class="mg-row">' + inp('mgI0', a.t === 'list' ? '쉼표로 나누어 써요' : '답', a.t === 'list' ? 'l' : '') + '</span>';
      $('mgAns').innerHTML = h; $('mgKp').classList.toggle('hide', a.t === 'cmp'); $('mgKp').classList.toggle('list', a.t === 'list');
      var self = this;
      $('mgAns').querySelectorAll('.mg-cmp button').forEach(function (b) { tap(b, function () { self.submit(b.dataset.v) }) });
      var ins = $('mgAns').querySelectorAll('.mg-in');
      ins.forEach(function (x, i) { x.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); self.submit() } else if (e.key === 'Tab') { e.preventDefault(); (ins[i + 1] || ins[0]).focus() } }) });
      if (ins.length) ins[a.t === 'f' ? 1 : 0].focus();
    },
    field: function () { var a = document.activeElement; return a && a.classList && a.classList.contains('mg-in') ? a : $('mgAns').querySelector('.mg-in') },
    kp: function (k) {
      if (!S || S.paused || S.over || this.q.done) return;
      if (k === 'ok') return this.submit();
      var f = this.field(); if (!f) return; var ins = [].slice.call($('mgAns').querySelectorAll('.mg-in'));
      if (k === 'tab') { (ins[ins.indexOf(f) + 1] || ins[0]).focus(); return }
      if (k === '⌫') f.value = f.value.slice(0, -1); else f.value += k;
      f.focus();
    },
    input: function () {
      var a = this.q.p.a, g = function (i) { var x = $('mgI' + i); return x ? x.value : '' };
      return a.t === 'qr' ? [g(0), g(1)] : a.t === 'f' ? [g(0), g(1), g(2)] : g(0);
    },
    submit: function (cmpV) {
      var q = this.q; if (!S || S.paused || S.over || q.done) return;
      var a = q.p.a, r = AR.judge(a, cmpV !== undefined ? cmpV : this.input()), msg = $('mgVmsg');
      if (r.empty) { msg.textContent = '답을 써 주세요.'; msg.className = 'mg-vmsg'; return }
      if (r.near && !r.ok) { msg.textContent = '💡 ' + r.near; msg.className = 'mg-vmsg near'; return }
      if (r.ok) {
        q.done = true; sfx('ok'); msg.textContent = '딸깍! 자물쇠가 풀렸어요'; msg.className = 'mg-vmsg ok';
        gain(1 - q.t / 20, $('mgLk' + this.opened)); $('mgLk' + this.opened).classList.add('on'); this.opened++;
        var self = this;
        if (this.opened >= this.LOCKS) { S.wait = 1e9; setTimeout(function () { if (!S || S.over) return; $('mgSafe').classList.add('open'); sfx('up'); banner('금고가 열렸어요!<small>보물을 찾았어요</small>', 'lv'); setTimeout(function () { if (S && !S.over) { S.wait = 0; self.newVault() } }, 1800) }, 500) }
        else S.wait = .8;
        return;
      }
      q.tries++; sfx('bad');
      $('mgAns').classList.remove('mg-shk'); void $('mgAns').offsetWidth; $('mgAns').classList.add('mg-shk');
      if (q.tries < 2) { msg.textContent = '다시 한 번 해 봐요!'; msg.className = 'mg-vmsg bad'; S.combo = 0; setHud(); return }
      q.done = true; wrongRec(q, null); msg.innerHTML = '정답은 <b>' + aH(a) + '</b>'; msg.className = 'mg-vmsg bad'; loseLife(); S.wait = 2;
    },
    tick: function (dt) {
      if (S.ending) return;
      if (S.wait > 0 && S.wait < 1e8) { S.wait -= dt; if (S.wait <= 0) this.next(); return }
      if (this.q) this.q.t += dt;
    }
  };

  /* 크기 순서로 줄 세우기 */
  GM.sort = {
    can: function (s, a) { return (a.t === 'n' || a.t === 'd' || a.t === 'f') && s.ask !== 'blank' },
    T: 30,
    init: function () {
      $('mgPlay').innerHTML = '<div class="mg-shelf"></div><div class="mg-sorthd" id="mgSh"></div><div class="mg-qt mg-sqt"><i id="mgQt"></i></div><div class="mg-sorts" id="mgSorts"></div><div class="mg-slots" id="mgSlots"></div>';
    },
    go: function () { this.next() },
    next: function () {
      var ps = [], seen = {};
      for (var t = 0; t < 200 && ps.length < 4; t++) { var q = makeP(), v = aVal(q.p.a), k = v.toFixed(6); if (seen[k] || !isFinite(v)) continue; seen[k] = 1; q.v = v; ps.push(q) }
      this.up = Math.random() < .65; this.ps = ps; this.order = ps.slice().sort(function (x, y) { return this.up ? x.v - y.v : y.v - x.v }.bind(this)); this.k = 0; this.t = 0; this.done = false;
      $('mgSh').innerHTML = '계산한 값이 <b>' + (this.up ? '작은' : '큰') + '</b> 것부터 차례로 눌러요';
      var self = this, box = $('mgSorts');
      box.innerHTML = ps.map(function (q, i) { return '<button type="button" class="mg-sc" data-i="' + i + '"><span class="mg-sq">' + qOnly(q.p) + '</span><span class="mg-sv">= ' + aH(q.p.a) + '</span><b class="mg-sn"></b></button>' }).join('');
      $('mgSlots').innerHTML = ps.map(function (_, i) { return '<span>' + (i + 1) + '<small>' + (i === 0 ? (self.up ? '가장 작음' : '가장 큼') : i === ps.length - 1 ? (self.up ? '가장 큼' : '가장 작음') : '') + '</small></span>' }).join('<i>' + (this.up ? '&lt;' : '&gt;') + '</i>');
      [].forEach.call(box.children, function (b) { tap(b, function () { self.hit(+b.dataset.i, b) }) });
    },
    hit: function (i, b) {
      if (!S || S.paused || S.over || this.done || b.classList.contains('ok')) return;
      if (this.order[this.k] === this.ps[i]) {
        b.classList.add('ok'); b.querySelector('.mg-sn').textContent = ++this.k; sfx('tick');
        if (this.k >= this.ps.length) { this.done = true; sfx('ok'); this.reveal(); gain(1 - this.t / this.T, $('mgSorts')); S.wait = 1.8 }
      } else {
        sfx('bad'); b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad');
        wrongRec(this.ps[i], null); loseLife();
        if (S.lives > 0) { $('mgSh').innerHTML = '앗! 그 식은 아직이에요. 다시 계산해 봐요'; }
      }
    },
    reveal: function () { [].forEach.call($('mgSorts').children, function (b) { b.classList.add('show') }) },
    tick: function (dt) {
      if (S.ending) return;
      if (S.wait > 0) { S.wait -= dt; if (S.wait <= 0) this.next(); return }
      this.t += dt; var L = Math.max(0, 1 - this.t / this.T), bar = $('mgQt'); bar.style.width = L * 100 + '%'; bar.classList.toggle('low', L < .3);
      if (!this.done && this.t >= this.T) {
        this.done = true; sfx('bad'); this.reveal(); var self = this;
        this.order.forEach(function (q, n) { var b = $('mgSorts').children[self.ps.indexOf(q)]; b.querySelector('.mg-sn').textContent = n + 1 });
        banner('시간이 지났어요<small>값을 보고 차례를 확인해요</small>', 'ans'); loseLife(); S.wait = 2.6;
      }
    }
  };

  /* ── 함께 하는 게임 공통: 팀 색·보기 단추·결과 ── */
  var TEAM = [{ nm: '파랑', c: '#4DA3FF', d: '#1F6FC4' }, { nm: '빨강', c: '#FF6B6B', d: '#C93C3C' }, { nm: '초록', c: '#3DBE6B', d: '#1F8A47' }, { nm: '노랑', c: '#F5B82E', d: '#9A6A00' }];
  function tv(i) { return '--pc:' + TEAM[i].c + ';--pd:' + TEAM[i].d }
  function optBtns(box, q, fn, keys) {
    box.className = 'mg-opts n' + q.c.opts.length;
    box.innerHTML = q.c.opts.map(function (o, i) { return '<button type="button" class="mg-opt" data-i="' + i + '" aria-label="' + (keys ? (i + 1) + '번 ' : '') + esc(plain(o)) + '">' + (keys ? '<span class="mg-key">' + (i + 1) + '</span>' : '') + '<span class="mg-lab ' + szCls(o) + '">' + aH(o) + '</span></button>' }).join('');
    [].forEach.call(box.children, function (b) { tap(b, function () { fn(+b.dataset.i) }) });
  }
  function teamRes(why, sc, unit, msg) {   // sc: 팀마다 점수, 가장 높은 팀(들)이 이김
    var mx = Math.max.apply(null, sc), win = mx > 0 ? sc.map(function (v, i) { return v === mx ? i : -1 }).filter(function (i) { return i >= 0 }) : [];
    var h = win.length === 1 ? TEAM[win[0]].nm + ' 승리!' : win.length ? win.map(function (i) { return TEAM[i].nm }).join('·') + ' 공동 1등!' : '비겼어요!';
    var col = win.length === 1 ? TEAM[win[0]] : null;
    return '<div class="mg-card mg-res">' + (why ? '<p class="mg-why">' + esc(why) + '</p>' : '') + '<h2>' + h + '</h2>' +
      '<div class="mg-stars">' + [0, 1, 2].map(function (i) { return '<span class="mg-st on" style="animation-delay:' + (.25 + i * .25) + 's' + (col ? ';--sc:' + col.c + ';--sd:' + col.d : '') + '">' + ICO.star + '</span>' }).join('') + '</div>' +
      '<div class="mg-stats">' + sc.map(function (v, i) { return '<span style="background:color-mix(in srgb,' + TEAM[i].c + ' 22%,#fff)">' + TEAM[i].nm + ' <b>' + v + '</b>' + unit + '</span>' }).join('') + '</div>' +
      '<p class="mg-old">' + (msg || (win.length === 1 ? '모두 수고했어요! 한 판 더 겨뤄 볼까요?' : '실력이 비슷하네요! 한 판 더 겨뤄 봐요.')) + '</p>' +
      '<div class="mg-btns"><button type="button" class="mg-btn go" data-a="again">한 판 더</button><button type="button" class="mg-btn" data-a="menu">게임 고르기로</button></div></div>';
  }

  /* ── 달리기 경주 (2~4명) ── */
  GM.race = {
    T: 180, GOAL: 10,
    init: function () {
      var n = this.n = S.np, i, lanes = '', pp = '';
      for (i = 0; i < n; i++) {
        lanes += '<div class="mg-lane" style="' + tv(i) + '"><span class="mg-ln">' + TEAM[i].nm + '</span><div class="mg-lrun"><i class="mg-finish"></i><div class="mg-runner" id="mgRun' + i + '">' + kidSvg(TEAM[i].c) + '</div></div></div>';
        pp += '<div class="mg-pp" id="mgPP' + i + '" style="' + tv(i) + '"><p class="mg-team">' + TEAM[i].nm + ' <b id="mgPts' + i + '">0</b><small> / ' + this.GOAL + '칸</small></p><div class="mg-qbox" id="mgQ' + i + '"></div><div class="mg-opts" id="mgOpts' + i + '"></div><div class="mg-freeze">앗! 잠깐 쉬어요</div></div>';
      }
      $('mgPlay').innerHTML = '<div class="mg-stadium"><i class="mg-cloud c0"></i></div><div class="mg-track2 n' + n + '">' + lanes + '</div><div class="mg-pps n' + n + '">' + pp + '</div>';
      this.pos = []; this.q = []; this.fz = []; this.wait = []; for (i = 0; i < n; i++) { this.pos.push(0); this.fz.push(0); this.wait.push(0) }
      this.left = this.T; this.lastSec = -1;
    },
    go: function () { for (var i = 0; i < this.n; i++) this.next(i) },
    next: function (i) {
      var q = this.q[i] = makeP(), self = this; q.done = false; $('mgQ' + i).innerHTML = qbox(q);
      optBtns($('mgOpts' + i), q, function (j) { self.hit(i, j) });
    },
    hit: function (i, j) {
      var q = this.q[i]; if (!S || S.paused || S.over || S.ending || q.done || this.fz[i] > 0) return;
      var bs = $('mgOpts' + i).children; q.done = true;
      if (j === q.c.ok) {
        bs[j].classList.add('right'); sfx('pull'); S.right++; this.pos[i]++; $('mgPts' + i).textContent = this.pos[i];
        var r = $('mgRun' + i); r.style.left = 'calc(' + (this.pos[i] / this.GOAL) + ' * (100% - 56px))'; r.classList.remove('hop'); void r.offsetWidth; r.classList.add('hop');
        this.wait[i] = .35;
        if (this.pos[i] >= this.GOAL) { S.ending = 1; sfx('up'); setTimeout(function () { end('') }, 700) }
      } else {
        bs[j].classList.add('wrong'); bs[q.c.ok].classList.add('right'); sfx('bad'); S.wrong++;
        this.fz[i] = 1.5; $('mgPP' + i).classList.add('frozen'); this.wait[i] = 1.5;
      }
    },
    tick: function (dt) {
      this.left -= dt; var L = Math.max(0, this.left), s = Math.ceil(L);
      $('mgTime').textContent = s + '초'; if (s !== this.lastSec && s <= 5 && s > 0) sfx('tick'); this.lastSec = s;
      if (L <= 0 && !S.ending) { end('시간이 다 됐어요'); return }
      if (S.ending) return;
      for (var i = 0; i < this.n; i++) {
        if (this.fz[i] > 0) { this.fz[i] -= dt; if (this.fz[i] <= 0) $('mgPP' + i).classList.remove('frozen') }
        if (this.wait[i] > 0) { this.wait[i] -= dt; if (this.wait[i] <= 0) this.next(i) }
      }
    },
    result: function (why) { return teamRes(why, this.pos, '칸') }
  };

  /* ── 골든벨 버저 (4명) ── */
  GM.buzz = {
    GOAL: 10, ANS: 7, IDLE: 25, KEYS: ['q', 'p', 'z', 'm'],
    init: function () {
      var h = '', self = this;
      for (var i = 0; i < 4; i++) h += '<button type="button" class="mg-buzz b' + i + '" id="mgBz' + i + '" style="' + tv(i) + '" aria-label="' + TEAM[i].nm + ' 버저"><span class="mg-bn">' + TEAM[i].nm + '</span><b id="mgBs' + i + '">0</b><span class="mg-bk">점 · 키 ' + this.KEYS[i].toUpperCase() + '</span></button>';
      $('mgPlay').innerHTML = '<div class="mg-gold"><i class="mg-spot"></i></div>' + h +
        '<div class="mg-bcenter"><p class="mg-bmsg" id="mgBmsg"></p><div class="mg-qbox" id="mgQ"></div><div class="mg-opts" id="mgOpts"></div><span class="mg-qt"><i id="mgQt"></i></span></div>';
      this.pts = [0, 0, 0, 0];
      for (i = 0; i < 4; i++) (function (k) { tap($('mgBz' + k), function () { self.buzz(k) }) })(i);
    },
    go: function () { this.next() },
    msg: function (t, i) { var m = $('mgBmsg'); m.innerHTML = t; m.style.color = i >= 0 ? TEAM[i].c : '' },
    next: function () {
      var q = this.q = makeP(), self = this; q.out = {}; q.done = false; this.who = -1; this.idle = 0;
      $('mgQ').innerHTML = qbox(q); optBtns($('mgOpts'), q, function (j) { self.hit(j) }, true);
      $('mgOpts').classList.add('mg-off');
      for (var i = 0; i < 4; i++) $('mgBz' + i).classList.remove('on', 'out');
      this.msg('버저를 먼저 누르세요!');
    },
    buzz: function (i) {
      var q = this.q; if (!S || S.paused || S.over || S.ending || !q || q.done || this.who >= 0 || q.out[i]) return;
      this.who = i; this.ta = 0; sfx('go');
      $('mgBz' + i).classList.add('on'); $('mgOpts').classList.remove('mg-off');
      this.msg(TEAM[i].nm + ' 차례! ' + this.ANS + '초 안에 골라요', i);
    },
    hit: function (j) {
      var q = this.q, w = this.who; if (!S || S.paused || S.over || q.done || w < 0) return;
      var bs = $('mgOpts').children;
      if (j === q.c.ok) {
        q.done = true; bs[j].classList.add('right'); sfx('ok'); S.right++; this.pts[w]++; $('mgBs' + w).textContent = this.pts[w];
        var c = center($('mgBz' + w)); burst(c[0], c[1], TEAM[w].c); this.msg(TEAM[w].nm + ' 정답! +1점', w); S.wait = 1.3;
        if (this.pts[w] >= this.GOAL) { S.ending = 1; setTimeout(function () { end('') }, 900) }
      } else this.miss(j);
    },
    miss: function (j) {   // 틀리거나 시간 안에 못 고름 → 이 문제에서 빠지고 다른 사람에게 기회
      var q = this.q, w = this.who, bs = $('mgOpts').children; sfx('bad'); S.wrong++;
      if (j >= 0) bs[j].classList.add('wrong', 'mg-dead');
      q.out[w] = 1; $('mgBz' + w).classList.remove('on'); $('mgBz' + w).classList.add('out'); this.who = -1; this.idle = 0;
      $('mgOpts').classList.add('mg-off');
      if (Object.keys(q.out).length >= 4) this.reveal('모두 기회를 썼어요'); else this.msg((j >= 0 ? '땡! ' : '시간 끝! ') + '다른 사람이 버저를 눌러요');
    },
    reveal: function (t) { var q = this.q; q.done = true; $('mgOpts').classList.remove('mg-off'); $('mgOpts').children[q.c.ok].classList.add('right'); this.msg(t + ' · 정답은 ' + plain(q.c.opts[q.c.ok])); S.wait = 2 },
    tick: function (dt) {
      if (S.ending) return;
      if (S.wait > 0) { S.wait -= dt; if (S.wait <= 0) this.next(); return }
      var q = this.q, bar = $('mgQt');
      if (this.who >= 0) { this.ta += dt; bar.style.width = Math.max(0, 1 - this.ta / this.ANS) * 100 + '%'; bar.classList.toggle('low', this.ta > this.ANS * .6); if (this.ta >= this.ANS) this.miss(-1) }
      else if (!q.done) { this.idle += dt; bar.style.width = Math.max(0, 1 - this.idle / this.IDLE) * 100 + '%'; bar.classList.remove('low'); if (this.idle >= this.IDLE) { sfx('bad'); this.reveal('아무도 누르지 않았어요') } }
    },
    key: function (i) { this.hit(i) },
    keyAny: function (k) { var i = this.KEYS.indexOf(k); if (i < 0) return false; this.buzz(i); return true },
    result: function (why) { return teamRes(why, this.pts, '점') }
  };

  /* ── 땅따먹기 (2명, 차례대로) ── */
  GM.land = {
    N: 4, ANS: 20,
    init: function () {
      var h = '', n = this.N * this.N;
      for (var i = 0; i < n; i++) h += '<button type="button" class="mg-cell" id="mgCell' + i + '" data-i="' + i + '"></button>';
      function side(k) { return '<div class="mg-lside s' + k + '" id="mgLs' + k + '" style="' + tv(k) + '"><span class="mg-ltn">' + TEAM[k].nm + '</span><b id="mgLc' + k + '">0</b><span>칸</span><em class="mg-lturn">내 차례!</em></div>' }
      $('mgPlay').innerHTML = '<div class="mg-meadow2"></div>' + side(0) + '<div class="mg-board" id="mgBoard">' + h + '</div>' + side(1) +
        '<div class="mg-lpop" id="mgPop" hidden><div class="mg-lcard" id="mgLcard"><p class="mg-lwho" id="mgLwho"></p><div class="mg-qbox" id="mgQ"></div><div class="mg-opts" id="mgOpts"></div><span class="mg-qt"><i id="mgQt"></i></span></div></div>';
      this.cells = []; this.cnt = [0, 0]; this.turn = 0; this.open = -1;
      var self = this;
      for (i = 0; i < n; i++) { this.cells.push({ p: null, own: -1 }); (function (k) { tap($('mgCell' + k), function () { self.pick(k) }) })(i) }
    },
    go: function () { for (var i = 0; i < this.cells.length; i++) this.fill(i); this.setTurn(0) },
    fill: function (i) {   // 칸에 새 문제
      var c = this.cells[i]; c.q = makeP(); var el = $('mgCell' + i), n = (c.q.p.txt || c.q.p.q).length;
      el.className = 'mg-cell' + (c.q.p.txt || n > 5 ? ' long' : '');
      el.innerHTML = qH(c.q.p).replace('<span class="mg-op">=</span><span class="mg-blank">?</span>', '').replace(/<span class="mg-blank">\?<\/span>$/, '');   // 칸에는 '= ?'를 빼고 식만
      el.setAttribute('aria-label', (i + 1) + '번 칸');
    },
    setTurn: function (t) {
      this.turn = t; for (var k = 0; k < 2; k++) $('mgLs' + k).classList.toggle('turn', k === t);
      $('mgBoard').style.setProperty('--pc', TEAM[t].c);
    },
    pick: function (i) {
      if (!S || S.paused || S.over || S.ending || this.open >= 0 || S.wait > 0 || this.cells[i].own >= 0) return;
      var q = this.cells[i].q, self = this; q.done = false; this.open = i; this.ta = 0;
      $('mgLwho').textContent = TEAM[this.turn].nm + ' 차례 · ' + this.ANS + '초 안에 골라요'; $('mgLcard').setAttribute('style', tv(this.turn));
      $('mgQ').innerHTML = qbox(q); optBtns($('mgOpts'), q, function (j) { self.hit(j) }, true);
      $('mgPop').hidden = false; sfx('go');
    },
    hit: function (j) {
      var i = this.open; if (!S || S.paused || S.over || i < 0) return; var q = this.cells[i].q; if (q.done) return; q.done = true;
      var bs = $('mgOpts').children, t = this.turn, self = this;
      if (j === q.c.ok) {
        bs[j].classList.add('right'); sfx('ok'); S.right++;
        this.cells[i].own = t; this.cnt[t]++; $('mgLc' + t).textContent = this.cnt[t];
        var el = $('mgCell' + i); el.classList.add('own'); el.setAttribute('style', tv(t));
      } else {
        if (j >= 0) bs[j].classList.add('wrong'); bs[q.c.ok].classList.add('right'); sfx('bad'); S.wrong++;
      }
      setTimeout(function () {
        if (!S || S.over) return;
        $('mgPop').hidden = true; self.open = -1;
        if (j !== q.c.ok) self.fill(i);   // 틀린 칸은 새 문제로 바뀜
        if (self.cnt[0] + self.cnt[1] >= self.cells.length) { S.ending = 1; end(''); return }
        self.setTurn(1 - t);
      }, j === q.c.ok ? 800 : 1500);
    },
    tick: function (dt) {
      if (S.ending || this.open < 0 || this.cells[this.open].q.done) return;
      this.ta += dt; var bar = $('mgQt'); bar.style.width = Math.max(0, 1 - this.ta / this.ANS) * 100 + '%'; bar.classList.toggle('low', this.ta > this.ANS * .7);
      if (this.ta >= this.ANS) this.hit(-1);
    },
    key: function (i) { if (this.open >= 0) this.hit(i) },
    result: function (why) { return teamRes(why, this.cnt, '칸') }
  };

  /* ── 줄다리기 (2명) ── */
  GM.tug = {
    T: 120, WIN: 5,
    init: function () {
      S.lives = S.maxLives = 0;
      function side(k, nm) { return '<div class="mg-side ' + k + '" id="mgSide' + k + '"><p class="mg-team">' + nm + ' <b id="mgPts' + k + '">0</b></p><div class="mg-qbox" id="mgQ' + k + '"></div><div class="mg-opts n4" id="mgOpts' + k + '"></div><div class="mg-freeze">앗! 잠깐 쉬어요</div></div>' }
      $('mgPlay').innerHTML = '<div class="mg-ground"><i class="mg-cloud c0"></i></div>' +
        '<div class="mg-rope"><svg class="mg-lines" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="M500 0v120" stroke="#fff" stroke-width="5" stroke-dasharray="12 9"/><path d="M270 0v120M730 0v120" stroke="#fff" stroke-width="4" opacity=".7"/></svg>' +
        '<div class="mg-ropeg" id="mgRopeG"><div class="mg-kids L">' + kidSvg('#4DA3FF') + kidSvg('#4DA3FF') + '</div><div class="mg-line"><i class="mg-flag"></i></div><div class="mg-kids R">' + kidSvg('#FF6B6B', 1) + kidSvg('#FF6B6B', 1) + '</div></div></div>' +
        '<div class="mg-sides">' + side('L', '파랑 팀') + side('R', '빨강 팀') + '</div>';
      this.pos = 0; this.left = this.T; this.pts = { L: 0, R: 0 }; this.q = {}; this.fz = { L: 0, R: 0 }; this.wait = { L: 0, R: 0 }; this.lastSec = -1;
    },
    go: function () { this.next('L'); this.next('R') },
    next: function (k) {
      var q = this.q[k] = makeP(), self = this; q.done = false; $('mgQ' + k).innerHTML = qbox(q);
      var box = $('mgOpts' + k); box.className = 'mg-opts n' + q.c.opts.length;
      box.innerHTML = q.c.opts.map(function (o, i) { return '<button type="button" class="mg-opt" data-i="' + i + '" aria-label="' + esc(plain(o)) + '"><span class="mg-lab ' + szCls(o) + '">' + aH(o) + '</span></button>' }).join('');
      [].forEach.call(box.children, function (b) { tap(b, function () { self.hit(k, +b.dataset.i) }) });
    },
    hit: function (k, i) {
      var q = this.q[k]; if (!S || S.paused || S.over || q.done || this.fz[k] > 0) return;
      var bs = $('mgOpts' + k).children; q.done = true;
      if (i === q.c.ok) {
        bs[i].classList.add('right'); sfx('pull'); this.pts[k]++; $('mgPts' + k).textContent = this.pts[k]; S.right++;
        this.pos += k === 'L' ? -1 : 1; this.draw(k); this.wait[k] = .35;
        if (Math.abs(this.pos) >= this.WIN) { S.ending = 1; setTimeout(function () { end('') }, 600) }
      } else {
        bs[i].classList.add('wrong'); bs[q.c.ok].classList.add('right'); sfx('bad'); S.wrong++;
        this.fz[k] = 1.5; $('mgSide' + k).classList.add('frozen'); this.wait[k] = 1.5;
      }
    },
    draw: function (k) {
      var g = $('mgRopeG'); g.style.setProperty('--pos', this.pos); g.classList.remove('yankL', 'yankR'); void g.offsetWidth; g.classList.add('yank' + k);
    },
    tick: function (dt) {
      this.left -= dt; var L = Math.max(0, this.left), s = Math.ceil(L);
      $('mgTime').textContent = s + '초'; if (s !== this.lastSec && s <= 5 && s > 0) sfx('tick'); this.lastSec = s;
      if (L <= 0 && !S.ending) { end('시간이 다 됐어요'); return }
      if (S.ending) return;
      ['L', 'R'].forEach(function (k) {
        if (this.fz[k] > 0) { this.fz[k] -= dt; if (this.fz[k] <= 0) $('mgSide' + k).classList.remove('frozen') }
        if (this.wait[k] > 0) { this.wait[k] -= dt; if (this.wait[k] <= 0) this.next(k) }
      }, this);
    },
    result: function (why) {
      var w = this.pos < 0 ? 'L' : this.pos > 0 ? 'R' : '', nm = { L: '파랑 팀', R: '빨강 팀' };
      return '<div class="mg-card mg-res">' + (why ? '<p class="mg-why">' + esc(why) + '</p>' : '') + '<h2>' + (w ? nm[w] + ' 승리!' : '비겼어요!') + '</h2>' +
        '<div class="mg-stars">' + [0, 1, 2].map(function (i) { return '<span class="mg-st on' + (w === 'R' ? ' red' : w === 'L' ? ' blue' : '') + '" style="animation-delay:' + (.25 + i * .25) + 's">' + ICO.star + '</span>' }).join('') + '</div>' +
        '<div class="mg-stats"><span class="blue">파랑 팀 맞힌 문제 <b>' + this.pts.L + '</b></span><span class="red">빨강 팀 맞힌 문제 <b>' + this.pts.R + '</b></span></div>' +
        '<p class="mg-old">' + (w ? '두 팀 모두 수고했어요. 진 팀은 한 판 더 도전해 볼까요?' : '실력이 똑같네요! 한 판 더 겨뤄 봐요.') + '</p>' +
        '<div class="mg-btns"><button type="button" class="mg-btn go" data-a="again">한 판 더</button><button type="button" class="mg-btn" data-a="menu">게임 고르기로</button></div></div>';
    }
  };
  drawGames();   // 게임 정의(GM.*.can)가 다 읽힌 뒤 한 번 더 그림
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
