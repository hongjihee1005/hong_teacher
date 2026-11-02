/* 체스말 그림(이 자료에서 새로 그린 단순한 모양, 100×100) — window.PIECES.svg(글자) */
(function (G) {
  'use strict';
  var BASE = '<path d="M22 92h56a3 3 0 0 0 3-3v-5a3 3 0 0 0-3-3H22a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3Z"/>';
  var P = {
    K: BASE + '<path d="M30 81 35 50h30l5 31Z"/><path d="M33 50c-6-14 4-24 17-24s23 10 17 24Z"/><path d="M45.5 5h9v8.5H63v9h-8.5V27h-9v-4.5H37v-9h8.5Z"/><path class="d" d="M38 62h24M37 71h26"/>',
    Q: BASE + '<path d="M30 81 35 52h30l5 31Z"/><path d="M33 52 22 25l14 13 6-22 8 19 8-19 6 22 14-13-11 27Z"/><circle cx="22" cy="23" r="5"/><circle cx="42" cy="14" r="5"/><circle cx="58" cy="14" r="5"/><circle cx="78" cy="23" r="5"/><path class="d" d="M37 64h26M36 73h28"/>',
    R: BASE + '<path d="M30 81 34 44h32l4 37Z"/><path d="M27 18h11v8h6v-8h12v8h6v-8h11v20l-5 6H32l-5-6Z"/><path class="d" d="M34 44h32M37 60h26"/>',
    B: BASE + '<path d="M31 81c0-14 6-22 11-25h16c5 3 11 11 11 25Z"/><path d="M50 13c13 10 18 22 14 33-2 6-7 10-14 10s-12-4-14-10c-4-11 1-23 14-33Z"/><circle cx="50" cy="9" r="5"/><path class="d" d="M56 26 45 40M40 56h20"/>',
    N: BASE + '<path d="M28 81c1-14 9-22 18-29-8 2-15 6-20 3-5-3-5-8-2-12l16-17c2-6 6-11 12-13l2-7 5 8c13 5 20 18 19 35-1 13-5 21-4 32Z"/><circle class="e" cx="50" cy="29" r="3.2"/><path class="d" d="M63 26c4 8 5 17 3 27"/>',
    P: BASE + '<path d="M33 81c0-14 6-22 12-26h10c6 4 12 12 12 26Z"/><path d="M36 54h28a3 3 0 0 0 0-6H36a3 3 0 0 0 0 6Z"/><circle cx="50" cy="32" r="14"/>'
  };
  function svg(c, extra) {
    var t = c.toUpperCase(), w = c === t;
    return '<g class="cs-pc ' + (w ? 'cs-w' : 'cs-b') + '"' + (extra || '') + '>' + P[t] + '</g>';
  }
  /* 받침에 맞는 조사: jo('킹', '이에요') → '킹이에요', jo('나이트', '을') → '나이트를', jo('e4', '을') → 'e4를'(이 사) */
  var PAIR = { '을': ['을', '를'], '은': ['은', '는'], '이': ['이', '가'], '이에요': ['이에요', '예요'], '과': ['과', '와'], '으로': ['으로', '로'] };
  function batchim(w) {
    var c = String(w).replace(/<[^>]*>/g, '').replace(/[\s)\]’'"]+$/, '').slice(-1), k = c.charCodeAt(0);
    if (k >= 0xAC00 && k <= 0xD7A3) return (k - 0xAC00) % 28;
    if (/[0-9]/.test(c)) return '013678'.indexOf(c) >= 0 ? (c === '8' || c === '1' || c === '7' ? 8 : 1) : 0;
    return 0;
  }
  function jo(w, t) { var b = batchim(w), pr = PAIR[t]; if (!pr) return w + t; if (t === '으로') return w + (b && b !== 8 ? '으로' : '로'); return w + (b ? pr[0] : pr[1]); }
  G.PIECES = { svg: svg, jo: jo, NAME: { K: '킹', Q: '퀸', R: '룩', B: '비숍', N: '나이트', P: '폰' },
    CSS: '.cs-pc path,.cs-pc circle{stroke-width:3;stroke-linejoin:round;stroke-linecap:round}' +
      '.cs-w path,.cs-w circle{fill:#FFFDF8;stroke:#2A221C}.cs-b path,.cs-b circle{fill:#3A332D;stroke:#0E0B09}' +
      '.cs-pc .d{fill:none!important}.cs-w .d{stroke:#2A221C}.cs-b .d{stroke:#E9DDD0}.cs-w .e{fill:#2A221C!important;stroke:none!important}.cs-b .e{fill:#E9DDD0!important;stroke:none!important}' };
})(typeof window !== 'undefined' ? window : globalThis);
