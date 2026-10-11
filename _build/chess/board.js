/* 체스판 그리기 — window.CB.make(host, {coords, flip, onSq})
   view.set({pos, marks, arrows, coords, swap, flip, hideCoords}) : pos = 말 놓인 자리 글(FEN 앞부분) 또는 64칸 배열
   marks = {e4: 'hi' | ['dot','ring'] | {t:'label', s:'글'}}  종류: hi(노랑) ok(초록) bad(빨강) sel(파랑 테) dot ring star x hint(깜빡임) row(줄 칠하기) dim
   arrows = [['e2','e4','#색']] */
(function (G) {
  'use strict';
  var S = 100, M = 34, NS = 'http://www.w3.org/2000/svg', CH = G.CH, PC = G.PIECES;
  var LIGHT = '#F0D9B5', DARK = '#B58863';
  function toIdx(k) { return typeof k === 'number' ? k : CH.idx(k); }
  function make(host, opts) {
    opts = opts || {};
    if (!document.getElementById('csPcCss')) { var css = document.createElement('style'); css.id = 'csPcCss'; css.textContent = PC.CSS; document.head.appendChild(css); }
    var wrap = document.createElement('div'); wrap.className = 'cs-board'; host.appendChild(wrap);
    var st = { pos: CH.board('8/8/8/8/8/8/8/8'), marks: {}, arrows: [], coords: opts.coords !== false, flip: !!opts.flip, swap: false };
    var svg;
    function xy(i) { var r = i >> 3, f = i & 7; if (st.flip) { r = 7 - r; f = 7 - f; } return [f * S, r * S]; }
    function draw() {
      var m = st.coords ? M : 0, h = [], i, k;
      h.push('<svg class="cs-svg" viewBox="' + (-m) + ' 0 ' + (800 + m) + ' ' + (800 + m) + '" xmlns="' + NS + '" role="img" aria-label="체스판">');
      h.push('<defs><marker id="csArr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="context-stroke"/></marker></defs>');
      for (i = 0; i < 64; i++) {
        var p = xy(i), light = (((i >> 3) + (i & 7)) & 1) === 0; if (st.swap) light = !light;
        h.push('<rect x="' + p[0] + '" y="' + p[1] + '" width="' + S + '" height="' + S + '" fill="' + (light ? LIGHT : DARK) + '"/>');
      }
      var mk = {}; Object.keys(st.marks).forEach(function (key) { var v = st.marks[key]; mk[toIdx(key)] = Array.isArray(v) ? v : [v]; });
      var FILL = { hi: 'rgba(255,214,10,.55)', ok: 'rgba(46,170,90,.55)', bad: 'rgba(225,60,50,.55)', row: 'rgba(80,140,255,.38)', dim: 'rgba(0,0,0,.35)', hint: 'rgba(255,140,0,.6)', soft: 'rgba(255,255,255,.45)' };
      Object.keys(mk).forEach(function (i) { var p = xy(+i); mk[i].forEach(function (t) { if (typeof t === 'string' && FILL[t]) h.push('<rect class="' + (t === 'hint' ? 'cs-blink' : '') + '" x="' + p[0] + '" y="' + p[1] + '" width="' + S + '" height="' + S + '" fill="' + FILL[t] + '"/>'); }); });
      h.push('<rect x="0" y="0" width="800" height="800" fill="none" stroke="#6B4A2E" stroke-width="4"/>');
      if (st.coords) for (k = 0; k < 8; k++) {
        var fl = st.flip ? 7 - k : k;
        h.push('<text class="cs-co" x="' + (k * S + S / 2) + '" y="' + (800 + m - 8) + '" text-anchor="middle">' + 'abcdefgh'[fl] + '</text>');
        h.push('<text class="cs-co" x="' + (-m / 2) + '" y="' + (k * S + S / 2 + 10) + '" text-anchor="middle">' + (st.flip ? k + 1 : 8 - k) + '</text>');
      }
      for (i = 0; i < 64; i++) if (st.pos[i] !== '.') { var q = xy(i); h.push('<g class="cs-at" data-sq="' + i + '" transform="translate(' + q[0] + ' ' + q[1] + ')">' + PC.svg(st.pos[i]) + '</g>'); }
      Object.keys(mk).forEach(function (i) {
        var p = xy(+i), cx = p[0] + S / 2, cy = p[1] + S / 2;
        mk[i].forEach(function (t) {
          if (t === 'dot') h.push('<circle cx="' + cx + '" cy="' + cy + '" r="15" fill="rgba(30,130,70,.75)"/>');
          else if (t === 'ring') h.push('<circle cx="' + cx + '" cy="' + cy + '" r="44" fill="none" stroke="rgba(30,130,70,.85)" stroke-width="8"/>');
          else if (t === 'sel') h.push('<rect x="' + (p[0] + 4) + '" y="' + (p[1] + 4) + '" width="' + (S - 8) + '" height="' + (S - 8) + '" fill="none" stroke="#1F6FE0" stroke-width="8" rx="6"/>');
          else if (t === 'star') h.push('<path transform="' + (st.pos[+i] !== '.' ? 'translate(' + (p[0] + S - 24) + ' ' + (p[1] + 24) + ') scale(.6)' : 'translate(' + cx + ' ' + cy + ')') + '" d="M0-34 10-11 34-10 15 5 21 30 0 16-21 30-15 5-34-10-10-11Z" fill="#FFC21A" stroke="#B07800" stroke-width="3" stroke-linejoin="round"/>');
          else if (t === 'x') h.push('<path d="M' + (cx - 26) + ' ' + (cy - 26) + 'l52 52M' + (cx + 26) + ' ' + (cy - 26) + 'l-52 52" stroke="#D0453B" stroke-width="10" stroke-linecap="round"/>');
          else if (t && t.t === 'label') h.push('<text class="cs-lb" x="' + cx + '" y="' + (cy + (t.small ? 9 : 14)) + '" text-anchor="middle" font-size="' + (t.small ? 28 : 40) + '">' + t.s + '</text>');
        });
      });
      st.arrows.forEach(function (a) {
        var p = xy(toIdx(a[0])), q = xy(toIdx(a[1])), x1 = p[0] + S / 2, y1 = p[1] + S / 2, x2 = q[0] + S / 2, y2 = q[1] + S / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
        x2 -= dx / L * 22; y2 -= dy / L * 22;
        h.push('<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (a[2] || 'rgba(230,110,20,.85)') + '" stroke-width="16" stroke-linecap="round" marker-end="url(#csArr)"/>');
      });
      h.push('</svg>');
      wrap.innerHTML = h.join('');
      svg = wrap.firstChild;
    }
    function set(o) {
      if (o.pos !== undefined) st.pos = typeof o.pos === 'string' ? CH.board(o.pos.split(' ')[0]) : o.pos.slice();
      st.marks = o.marks || {}; st.arrows = o.arrows || [];
      st.coords = o.coords !== false; st.flip = !!o.flip; st.swap = !!o.swap; /* 부를 때마다 판 모양을 모두 정함(앞 화면의 뒤집기가 남지 않게) */
      draw();
    }
    wrap.addEventListener('pointerdown', function (e) {
      if (!opts.onSq || !svg) return;
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var q = pt.matrixTransform(svg.getScreenCTM().inverse()), f = Math.floor(q.x / S), r = Math.floor(q.y / S);
      if (f < 0 || f > 7 || r < 0 || r > 7) return;
      if (st.flip) { f = 7 - f; r = 7 - r; }
      e.preventDefault(); opts.onSq(r * 8 + f, e);
    });
    /* 말 옮기기 그림(ms 동안) */
    function anim(from, to, ms, cb) {
      from = toIdx(from); to = toIdx(to);
      var g = wrap.querySelector('.cs-at[data-sq="' + from + '"]'), a = xy(from), b = xy(to), t0 = 0;
      if (!g) { if (cb) cb(); return; }
      g.parentNode.appendChild(g);
      function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        g.setAttribute('transform', 'translate(' + (a[0] + (b[0] - a[0]) * e) + ' ' + (a[1] + (b[1] - a[1]) * e) + ')');
        if (k < 1) requestAnimationFrame(step); else if (cb) cb(); }
      requestAnimationFrame(step);
    }
    draw();
    return { set: set, anim: anim, el: wrap, state: st };
  }
  G.CB = { make: make, LIGHT: LIGHT, DARK: DARK };
})(typeof window !== 'undefined' ? window : globalThis);
