/* 음악이론 엔진: 악보 그리기(SVG) · 소리 내기(Web Audio) — window.MU
   악보 문자열: 'c4/4 d4/4 | e4/2. r/4 ||'  (음이름+옥타브/길이, 점음표 '.', 쉼표 r, 올림 #, 내림 b, 제자리 n)
   (c4/8 d4/8) 묶어 잇기(빔), c4/4~ 붙임줄, c4/2^ 늘임표, [c4 e4 g4]/1 화음, // 다음 줄
   마디줄 | 겹세로줄 || 마침줄 |] 도돌이 시작 |: 도돌이 끝 :|, 글자 $segno $coda $fine $dc $ds $1 $2 (1·2번 괄호 시작)
   음자리표 clef 'g'(높은음)·'f'(낮은음)·'n'(없음), 조 key 'C','G','D','F','Bb','Am','Em','Dm', 박자 time '4/4' */
var MU = (function () {
  var G = window.MU_GLYPHS, SP = 10, K = SP / 250;
  var LET = 'cdefgab', GYE = ['도', '레', '미', '파', '솔', '라', '시'], EUM = ['다', '라', '마', '바', '사', '가', '나'], EN = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  var KEYS = { C: [0, 0], G: [1, 4], D: [2, 1], F: [-1, 3], Bb: [-2, 6], Am: [0, 5], Em: [1, 2], Dm: [-1, 1] };   // [올림(+)/내림(-) 개수, 으뜸음(계이름 기준음: 장조는 도, 단조는 라가 되는 음)의 글자 번호]
  var SHARPS = ['f5', 'c5', 'g5', 'd5'], FLATS = ['b4', 'e5', 'a4', 'd5'], SHARPS_F = ['f3', 'c3', 'g3', 'd3'], FLATS_F = ['b2', 'e3', 'a2', 'd3'];
  function glyph(k, x, y, s, cls) { var g = G[k]; return '<path' + (cls ? ' class="' + cls + '"' : '') + ' transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + f(s * K) + ' ' + f(-s * K) + ')" d="' + g.d + '"/>' }
  function f(n) { return Math.round(n * 100) / 100 }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  /* 음 → 오선 단계(다 아래 0부터) */
  function parsePitch(p) {
    var m = /^([a-g])(#|b|n)?(\d)$/.exec(p); if (!m) return null;
    return { l: LET.indexOf(m[1]), acc: m[2] || '', oct: +m[3], step: +m[3] * 7 + LET.indexOf(m[1]) };
  }
  function keyAcc(key, l) {   // 조표가 이 글자에 붙이는 올림·내림
    var k = KEYS[key] || KEYS.C, n = k[0];
    if (n > 0) return 'fcgd'.slice(0, n).indexOf(LET[l]) >= 0 ? 1 : 0;
    if (n < 0) return 'bead'.slice(0, -n).indexOf(LET[l]) >= 0 ? -1 : 0;
    return 0;
  }
  function midi(pp, key) {
    var base = [0, 2, 4, 5, 7, 9, 11][pp.l] + 12 * (pp.oct + 1);
    var a = pp.acc === '#' ? 1 : pp.acc === 'b' ? -1 : pp.acc === 'n' ? 0 : keyAcc(key, pp.l);
    return base + a;
  }
  function gyeName(pp, key) {   // 계이름(이동도법: 장조는 으뜸음이 도, 단조는 으뜸음이 라)
    var k = KEYS[key] || KEYS.C, minor = /m$/.test(key || ''), tonic = k[1], off = minor ? 5 : 0;
    var doL = (tonic - off + 7) % 7;
    return GYE[(pp.l - doL + 7) % 7];
  }
  function eumName(pp, key) {
    var a = pp.acc === '#' ? 1 : pp.acc === 'b' ? -1 : pp.acc === 'n' ? 0 : keyAcc(key, pp.l);
    return (a > 0 ? '올림' : a < 0 ? '내림' : '') + EUM[pp.l];
  }
  /* 문자열 → 토큰 */
  function tokens(src) {
    var out = [], beam = 0, slur = 0, re = /\{|\}|\(|\)|\/\/|\|\]|\|\||\|:|:\||\||\$\w+|\[[^\]]+\]\/[\d.]+[~^*_>]*|[a-gr][#bn]?\d?\/[\d.]+[~^*_>]*/g, m, bid = 0;
    while ((m = re.exec(src))) {
      var t = m[0];
      if (t === '{') { slur = 1; continue; }
      if (t === '}') { if (out.length) out[out.length - 1].slurEnd = true; continue; }
      if (t === '(') { beam = ++bid; continue; }
      if (t === ')') { beam = 0; continue; }
      if (/^[|:\/]/.test(t)) { out.push({ k: 'bar', v: t }); continue; }
      if (t[0] === '$') { out.push({ k: 'mark', v: t.slice(1) }); continue; }
      var mm = /^(\[[^\]]+\]|[a-gr][#bn]?\d?)\/(\d+)(\.?)([~^*_>]*)$/.exec(t);
      var ps = mm[1][0] === '[' ? mm[1].slice(1, -1).trim().split(/\s+/) : [mm[1]];
      var d = +mm[2], dot = !!mm[3]; var wasSlur = slur; slur = slur === 1 ? 2 : slur;
      out.push({ k: ps[0] === 'r' ? 'rest' : 'note', ps: ps[0] === 'r' ? [] : ps.map(parsePitch), d: d, dot: dot, tie: mm[4].indexOf('~') >= 0, ferm: mm[4].indexOf('^') >= 0, stac: mm[4].indexOf('*') >= 0, ten: mm[4].indexOf('_') >= 0, accent: mm[4].indexOf('>') >= 0, slurStart: wasSlur === 1, beam: beam, beats: 4 / d * (dot ? 1.5 : 1) });
    }
    return out;
  }
  var WID = { 1: 54, 2: 40, 4: 30, 8: 22, 16: 18 };
  /* 악보 그리기. o: {n, clef, key, time, names:'gye'|'eum'|'en'|'blank'|false, scale, play:true} */
  function staff(o) {
    var T = tokens(o.n || ''), clef = o.clef || 'g', key = o.key || 'C', lines = [[]];
    T.forEach(function (t) { if (t.k === 'bar' && t.v === '//') lines.push([]); else lines[lines.length - 1].push(t) });
    var bottom = clef === 'f' ? 2 * 7 + 4 : 4 * 7 + 2;   // 맨 아랫줄 음: 낮은음자리 사2, 높은음자리 마4
    var sysH = SP * 4, top = SP * 4.5, gap = o.names ? SP * 9.5 : SP * 7.5, svg = '', idx = 0, W = 0, rows = [];
    lines.forEach(function (L, li) {
      var y0 = top + li * (sysH + gap), yB = y0 + sysH, x = 6, s = '';
      var Y = function (step) { return yB - (step - bottom) * SP / 2 };
      if (clef === 'g') { s += glyph('gclef', x, yB - SP, 1); x += 34; }
      else if (clef === 'f') { s += glyph('fclef', x, yB - SP * 1 + 0, 1); x += 36; }
      var ka = KEYS[key] || KEYS.C;
      if (clef !== 'n' && ka[0]) {
        var lst = ka[0] > 0 ? (clef === 'f' ? SHARPS_F : SHARPS) : (clef === 'f' ? FLATS_F : FLATS);
        for (var i = 0; i < Math.abs(ka[0]); i++) { var pp = parsePitch(lst[i]); s += glyph(ka[0] > 0 ? 'sharp' : 'flat', x, Y(pp.step) - (ka[0] > 0 ? 131 : 100) * K + (ka[0] > 0 ? 0 : 0), 1, 'acc'); x += 10; }
        x += 6;
      }
      if (o.time && li === 0) { var tt = o.time.split('/'); s += '<text class="ts" x="' + (x + 8) + '" y="' + f(yB - SP * 2.2) + '">' + tt[0] + '</text><text class="ts" x="' + (x + 8) + '" y="' + f(yB + SP * -0.15) + '">' + tt[1] + '</text>'; x += 24; }
      x += 8;
      var beams = {}, ties = [], slurs = [], openSlur = null;
      L.forEach(function (t) {
        if (t.k === 'bar') {
          var v = t.v;
          if (v === '|') s += '<line class="bl" x1="' + x + '" x2="' + x + '" y1="' + y0 + '" y2="' + yB + '"/>';
          else if (v === '||') s += '<line class="bl" x1="' + x + '" x2="' + x + '" y1="' + y0 + '" y2="' + yB + '"/><line class="bl" x1="' + (x + 4) + '" x2="' + (x + 4) + '" y1="' + y0 + '" y2="' + yB + '"/>';
          else if (v === '|]') { s += '<line class="bl" x1="' + x + '" x2="' + x + '" y1="' + y0 + '" y2="' + yB + '"/><rect x="' + (x + 4) + '" y="' + y0 + '" width="4.5" height="' + sysH + '"/>'; x += 6; }
          else if (v === '|:') { s += glyph('repL', x, yB, 1); x += 22; }
          else if (v === ':|') { s += glyph('repR', x - 4, yB, 1); x += 18; }
          x += 12; return;
        }
        if (t.k === 'mark') {
          var mk = { segno: ['segno', 0], coda: ['coda', 0] }[t.v];
          if (mk) s += glyph(mk[0], x - 6, y0 - SP * 0.6, .8);
          else if (t.v === '1' || t.v === '2') s += '<path class="volta" d="M' + x + ' ' + (y0 - SP * 1.2) + 'V' + (y0 - SP * 2.4) + 'H' + (x + 70) + '"/><text class="mk" x="' + (x + 4) + '" y="' + (y0 - SP * 1.4) + '">' + t.v + '.</text>';
          else s += '<text class="mk it" x="' + x + '" y="' + (y0 - SP * 2.6) + '">' + esc({ fine: 'Fine', dc: 'D.C.', ds: 'D.S.', tocoda: 'To Coda' }[t.v] || t.v) + '</text>';
          return;
        }
        var w = WID[t.d] * (t.dot ? 1.25 : 1), cx = x + 9, my = { i: idx++ };
        if (t.k === 'rest') {
          var rk = { 1: 'rw', 2: 'rh', 4: 'rq', 8: 'r8', 16: 'r16' }[t.d], ry = yB + (t.d === 1 ? -SP : 0);
          s += '<g class="nt" data-i="' + my.i + '">' + glyph(rk, cx - 5, ry, 1) + (t.dot ? '<circle cx="' + (cx + 10) + '" cy="' + (yB - SP * 2.5) + '" r="1.6"/>' : '') + '</g>';
          if (o.names) s += '<text class="nm" x="' + cx + '" y="' + (yB + SP * 4.3) + '">' + (o.names === 'blank' ? '' : '쉼') + '</text>';
        } else {
          var g = '<g class="nt" data-i="' + my.i + '">', steps = t.ps.map(function (p) { return p.step }), mid = bottom + 4;
          var up = (Math.max.apply(0, steps) + Math.min.apply(0, steps)) / 2 < mid;
          if (t.beam && beams[t.beam]) up = beams[t.beam].up;
          t.ps.forEach(function (p) {
            var y = Y(p.step);
            for (var ls = bottom - 2; ls >= p.step; ls -= 2) g += '<line class="led" x1="' + (cx - 8) + '" x2="' + (cx + 8) + '" y1="' + Y(ls) + '" y2="' + Y(ls) + '"/>';
            for (ls = bottom + 10; ls <= p.step; ls += 2) g += '<line class="led" x1="' + (cx - 8) + '" x2="' + (cx + 8) + '" y1="' + Y(ls) + '" y2="' + Y(ls) + '"/>';
            if (p.acc) g += glyph({ '#': 'sharp', b: 'flat', n: 'natural' }[p.acc], cx - 19, y - ({ '#': 131, b: 100, n: 132 }[p.acc]) * K, 1, 'acc');
            g += t.d <= 2 ? '<ellipse class="hd o" cx="' + cx + '" cy="' + f(y) + '" rx="5.6" ry="3.9" transform="rotate(-20 ' + cx + ' ' + f(y) + ')"/>' : '<ellipse class="hd" cx="' + cx + '" cy="' + f(y) + '" rx="5.6" ry="3.9" transform="rotate(-20 ' + cx + ' ' + f(y) + ')"/>';
            if (t.dot) g += '<circle cx="' + (cx + 10) + '" cy="' + f(p.step % 2 === bottom % 2 ? y - SP / 2 : y) + '" r="1.6"/>';
          });
          var lo = Y(Math.min.apply(0, steps)), hi = Y(Math.max.apply(0, steps)), sx = up ? cx + 5.2 : cx - 5.2;
          if (t.d > 1) {
            var tip = up ? hi - SP * 3.4 : lo + SP * 3.4;
            if (t.beam) { var B = beams[t.beam] = beams[t.beam] || { up: up, pts: [] }; B.pts.push({ x: sx, y0: up ? lo : hi, tip: tip, d: t.d }); }
            else {
              g += '<line class="stem" x1="' + f(sx) + '" x2="' + f(sx) + '" y1="' + f(up ? lo : hi) + '" y2="' + f(tip) + '"/>';
              for (var fl = 0; fl < (t.d === 8 ? 1 : t.d === 16 ? 2 : 0); fl++) {
                var fy = tip + (up ? 1 : -1) * fl * 7;
                g += up ? '<path class="flag" d="M' + f(sx) + ' ' + f(fy) + 'c2 6 10 8 8 17c0-6-4-9-8-10z"/>' : '<path class="flag" d="M' + f(sx) + ' ' + f(fy) + 'c2 -6 10 -8 8 -17c0 6-4 9-8 10z"/>';
              }
            }
          }
          var ay = up ? lo + SP * 1.3 : hi - SP * 1.3;
          if (t.stac) g += '<circle cx="' + cx + '" cy="' + f(ay) + '" r="1.8"/>';
          if (t.ten) g += '<line class="stem" x1="' + (cx - 5) + '" x2="' + (cx + 5) + '" y1="' + f(ay) + '" y2="' + f(ay) + '" style="stroke-width:1.8"/>';
          if (t.accent) g += '<path class="tie" d="M' + (cx - 6) + ' ' + f(ay - 3) + 'L' + (cx + 6) + ' ' + f(ay) + 'L' + (cx - 6) + ' ' + f(ay + 3) + '" style="stroke-width:1.5"/>';
          if (t.slurStart) openSlur = { x: cx, y: up ? lo : hi, up: up };
          if (t.slurEnd && openSlur) { var sy = openSlur.up ? Math.max(openSlur.y, up ? lo : hi) + 9 : Math.min(openSlur.y, up ? lo : hi) - 9, bend = openSlur.up ? 12 : -12; s += '<path class="tie" d="M' + f(openSlur.x) + ' ' + f(sy) + 'Q' + f((openSlur.x + cx) / 2) + ' ' + f(sy + bend) + ' ' + f(cx) + ' ' + f(sy) + '"/>'; openSlur = null; }
          if (t.ferm) g += glyph('fermata', cx - 7, Math.min(y0, hi) - SP * 1.2 + 0, .55);
          g += '</g>'; s += g;
          if (ties.length) { var tp = ties.pop(), ty2 = tp.y + (tp.up ? 7 : -7), cy2 = tp.y + (tp.up ? 15 : -15); s += '<path class="tie" d="M' + f(tp.x + 5) + ' ' + f(ty2) + 'Q' + f((tp.x + cx) / 2) + ' ' + f(cy2) + ' ' + f(cx - 5) + ' ' + f(ty2) + '"/>'; }
          if (t.tie) ties.push({ x: cx, y: Y(t.ps[0].step), up: up });
          if (o.names) {
            var nm = o.names === 'blank' ? '' : t.ps.map(function (p) { return o.names === 'eum' ? eumName(p, key) : o.names === 'en' ? EN[p.l] + (p.acc === '#' ? '♯' : p.acc === 'b' ? '♭' : '') : gyeName(p, key) }).reverse().join('<tspan x="' + cx + '" dy="1.2em">');
            s += o.names === 'blank' ? '<rect class="nmb" x="' + (cx - 10) + '" y="' + (yB + SP * 2.6) + '" width="20" height="16" rx="3"/>' : '<text class="nm" x="' + cx + '" y="' + (yB + SP * 4.3) + '">' + nm + '</text>';
          }
        }
        x += w;
      });
      for (var b in beams) {
        var P = beams[b].pts, up2 = beams[b].up; if (!P.length) continue;
        var ty = up2 ? Math.min.apply(0, P.map(function (p) { return p.tip })) : Math.max.apply(0, P.map(function (p) { return p.tip }));
        P.forEach(function (p) { s += '<line class="stem" x1="' + f(p.x) + '" x2="' + f(p.x) + '" y1="' + f(p.y0) + '" y2="' + f(ty) + '"/>' });
        s += '<path class="beam" d="M' + f(P[0].x - (up2 ? 0.7 : -0.7)) + ' ' + f(ty) + 'H' + f(P[P.length - 1].x + 0.7) + 'v' + (up2 ? 4.5 : -4.5) + 'H' + f(P[0].x - 0.7) + 'z"/>';
        if (P.every(function (p) { return p.d === 16 })) s += '<path class="beam" d="M' + f(P[0].x) + ' ' + f(ty + (up2 ? 7 : -7)) + 'H' + f(P[P.length - 1].x + 0.7) + 'v' + (up2 ? 4.5 : -4.5) + 'H' + f(P[0].x) + 'z"/>';
      }
      var lastMark = L.length && L[L.length - 1].k === 'mark';
      var lineEnd = Math.max(x + 4, o.minW || 0); if (lastMark) W = Math.max(W, x + 40);
      for (var k = 0; k < 5; k++) s = '<line class="sl" x1="0" x2="' + lineEnd + '" y1="' + (yB - k * SP) + '" y2="' + (yB - k * SP) + '"/>' + s;
      W = Math.max(W, lineEnd + 2); rows.push(s);
    });
    var H = top + lines.length * (sysH + gap) - gap + (o.names ? SP * 6 : SP * 3.5);
    return '<svg class="mu-staff" viewBox="0 0 ' + f(W) + ' ' + f(H) + '" style="max-width:' + f(W * (o.scale || 1.6)) + 'px" role="img" aria-label="' + esc(o.label || '악보') + '">' + rows.join('') + '</svg>';
  }
  /* ── 소리 ── */
  var AC = null, master = null, playing = [];
  function ctx() { if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); master = AC.createGain(); master.gain.value = .8; master.connect(AC.destination); } if (AC.state === 'suspended') AC.resume(); return AC }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12) }
  function tone(m, t, dur, vol) {
    var a = ctx(); if (!a) return;
    var g = a.createGain(), o1 = a.createOscillator(), o2 = a.createOscillator(), g2 = a.createGain();
    o1.type = 'triangle'; o2.type = 'sine'; o1.frequency.value = hz(m); o2.frequency.value = hz(m) * 2; g2.gain.value = .25;
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
    var v = .32 * (vol == null ? 1 : vol), end = t + Math.max(.12, dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(v * .35, t + Math.min(.5, dur * .6)); g.gain.exponentialRampToValueAtTime(.0005, end + .25);
    o1.start(t); o2.start(t); o1.stop(end + .3); o2.stop(end + .3); playing.push(o1, o2);
  }
  function noise(t, dur, freq, vol, q) {
    var a = ctx(); if (!a) return;
    var n = Math.floor(a.sampleRate * dur), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain();
    s.buffer = b; fl.type = 'bandpass'; fl.frequency.value = freq; fl.Q.value = q || 1.2; g.gain.value = vol;
    s.connect(fl); fl.connect(g); g.connect(master); s.start(t); playing.push(s);
  }
  function drum(t, f0, f1, dur, vol) {
    var a = ctx(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05); playing.push(o);
  }
  /* 장구 소리(컴퓨터로 흉내 낸 소리) */
  function janggu(sym, t, beat) {
    var kung = function (tt, v) { drum(tt, 140, 55, .45, .9 * v) }, deok = function (tt, v) { noise(tt, .09, 2600, 1.1 * v, 1.5); drum(tt, 520, 300, .06, .25 * v) };
    if (sym === '덩') { kung(t, 1); deok(t, 1) }
    else if (sym === '쿵') kung(t, 1);
    else if (sym === '덕' || sym === '따') deok(t, 1);
    else if (sym === '기덕') { deok(t, .6); deok(t + beat / 2, 1) }
    else if (sym === '더러러러') { for (var i = 0; i < 4; i++) deok(t + i * beat / 4, .55) }
  }
  function click(t, strong) { var a = ctx(); if (!a) return; drum(t, strong ? 1500 : 1000, strong ? 1200 : 800, .05, strong ? .5 : .3) }
  function stop() { playing.forEach(function (o) { try { o.stop() } catch (e) { } }); playing = []; clearTimers() }
  var timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; document.querySelectorAll('.mu-staff .nt.on').forEach(function (e) { e.classList.remove('on') }) }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)) }
  /* 악보 문자열 연주. o: {n, key, bpm, vol, el(악보 svg, 지금 음 표시), done} */
  function play(o) {
    stop(); var a = ctx(); if (!a) return;
    var T = tokens(o.n || '').filter(function (t) { return t.k === 'note' || t.k === 'rest' }), bpm = o.bpm || 96, beat = 60 / bpm, t0 = a.currentTime + .08, t = t0, i = 0;
    var vol = o.vol, svg = o.el;
    if (typeof vol === 'string') { var va = vol.split('-').map(Number); vol = function (k, n) { return va[0] + (va[1] - va[0]) * k / Math.max(1, n - 1) } }
    T.forEach(function (tk, k) {
      if (o.bpmTo) beat = 60 / (bpm + (o.bpmTo - bpm) * k / Math.max(1, T.length - 1));
      var dur = tk.beats * beat;
      if (tk.k === 'note') {
        var hold = dur; for (var j = k; T[j] && T[j].tie && T[j + 1]; j++) hold += T[j + 1].beats * beat;
        var prevTie = k > 0 && T[k - 1].tie;
        var vv = (typeof vol === 'function' ? vol(k, T.length) : vol == null ? 1 : vol) * (tk.accent ? 1.7 : 1);
        if (!prevTie) tk.ps.forEach(function (p) { tone(midi(p, o.key), t, hold * (tk.stac ? .3 : tk.ten ? 1 : .92) * (tk.ferm ? 1.6 : 1), vv) });
      }
      if (svg) (function (kk, tt) { later(function () { svg.querySelectorAll('.nt.on').forEach(function (e) { e.classList.remove('on') }); var e = svg.querySelector('.nt[data-i="' + kk + '"]'); if (e) e.classList.add('on') }, (tt - a.currentTime) * 1000) })(k, t);
      t += dur * (tk.ferm ? 1.6 : 1);
    });
    later(function () { if (svg) svg.querySelectorAll('.nt.on').forEach(function (e) { e.classList.remove('on') }); if (o.done) o.done() }, (t - a.currentTime) * 1000 + 100);
    return t - t0;
  }
  function playMidi(m, dur) { var a = ctx(); if (a) tone(m, a.currentTime + .02, dur || .6) }
  return { staff: staff, play: play, stop: stop, playMidi: playMidi, janggu: janggu, click: click, ctx: ctx, tokens: tokens, parsePitch: parsePitch, midi: midi, gyeName: gyeName, eumName: eumName, GYE: GYE, EUM: EUM, EN: EN, esc: esc, later: later };
})();
