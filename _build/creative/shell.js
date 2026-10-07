/* 창의수학게임 공통 틀 (2026-10-07)
   window.CR = { game, levels:[{id,nm,rec,de,n}], data:{레벨 id:[문제…]} } , 게임은 window.CRG = { render(host, p, ctx), hint(), reveal(), info?() }
   ctx: done(글), msg(글, 종류), level, no(문제 번호)
   기록: localStorage 'hj-creative-v1' { 게임: { '레벨-번호': {d:1, b:최고 기록 숫자(작을수록 좋음)} } }, 마지막 연 것 'hj-creative-v1-last'
   주소 #easy-3 처럼 단계·번호로 바로 열기 */
(function () {
  'use strict';
  var D = window.CR, KEY = 'hj-creative-v1', $ = function (id) { return document.getElementById(id) };
  function load(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch (e) { return d } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} }
  var rec = load(KEY, {}), mine = rec[D.game] || (rec[D.game] = {});
  var last = load(KEY + '-last', {}), cur = { lv: D.levels[0].id, no: 1 };
  if (last[D.game]) cur = last[D.game];
  function lvOf(id) { return D.levels.filter(function (l) { return l.id === id })[0] || D.levels[0] }
  function list() { return D.data[cur.lv] || [] }

  function drawLevels() {
    $('crLevels').innerHTML = D.levels.map(function (l) {
      var n = (D.data[l.id] || []).length, d = 0; for (var i = 1; i <= n; i++) if (mine[l.id + '-' + i]) d++;
      return '<button type="button" role="tab" class="cr-lv ' + l.id + '" data-lv="' + l.id + '" aria-selected="' + (l.id === cur.lv) + '"><b>' + l.nm + '</b><span class="cr-rec">추천 ' + l.rec + '</span><small>' + l.de + '</small><span class="cr-cnt">' + d + ' / ' + n + ' 해결</span></button>';
    }).join('');
  }
  function drawNums() {
    var n = list().length, h = '';
    for (var i = 1; i <= n; i++) { var r = mine[cur.lv + '-' + i]; h += '<button type="button" data-no="' + i + '" aria-pressed="' + (i === cur.no) + '"' + (r ? ' class="ok"' : '') + '>' + i + (r ? '<i>✓</i>' : '') + '</button>' }
    $('crNums').innerHTML = h; $('crNums').hidden = n <= 1;
  }
  var solved = false, used = { hint: 0, ans: false };
  var ctx = {
    msg: function (t, k) { var m = $('crMsg'); m.innerHTML = t || ''; m.className = 'cr-msg' + (k ? ' ' + k : '') },
    done: function (t, score) {   // score: 작을수록 좋은 기록(움직인 횟수 등), 없어도 됨
      if (solved) return; solved = true;
      var key = cur.lv + '-' + cur.no, old = mine[key];
      if (!used.ans) { var r = { d: 1 }; if (score != null) r.b = old && old.b != null ? Math.min(old.b, score) : score; mine[key] = r; save(KEY, rec) }
      $('crDoneT').innerHTML = (t || '') + (used.ans ? ' <small>(정답 보기를 써서 기록은 남지 않아요)</small>' : used.hint ? ' <small>(힌트 ' + used.hint + '번)</small>' : '');
      $('crDone').hidden = false; $('crNext').hidden = cur.no >= list().length && D.levels[D.levels.length - 1].id === cur.lv;
      drawLevels(); drawNums(); chime();
    }
  };
  function open(lv, no) {
    var n = (D.data[lv] || []).length; cur = { lv: lv, no: Math.max(1, Math.min(no || 1, n)) }; last[D.game] = cur; save(KEY + '-last', last);
    solved = false; used = { hint: 0, ans: false }; $('crDone').hidden = true; ctx.msg('');
    var L = lvOf(lv); ctx.level = L; ctx.no = cur.no;
    $('crTitle').textContent = L.nm + (list().length > 1 ? ' ' + cur.no + '번' : '');
    $('crInfo').textContent = '추천 ' + L.rec;
    drawLevels(); drawNums();
    window.CRG.render($('crHost'), list()[cur.no - 1], ctx);
    if (history.replaceState) history.replaceState(null, '', '#' + lv + '-' + cur.no);
  }
  $('crLevels').addEventListener('click', function (e) { var b = e.target.closest('[data-lv]'); if (b) open(b.dataset.lv, 1) });
  $('crNums').addEventListener('click', function (e) { var b = e.target.closest('[data-no]'); if (b) open(cur.lv, +b.dataset.no) });
  $('crReset').addEventListener('click', function () { open(cur.lv, cur.no) });
  $('crHint').addEventListener('click', function () { if (solved) return; if (window.CRG.hint() !== false) used.hint++ });
  $('crAns').addEventListener('click', function () { if (solved || !confirm('정답을 볼까요? 정답을 보면 이 문제는 해결 기록이 남지 않아요.')) return; used.ans = true; window.CRG.reveal() });
  $('crNext').addEventListener('click', function () {
    if (cur.no < list().length) open(cur.lv, cur.no + 1);
    else { var i = D.levels.map(function (l) { return l.id }).indexOf(cur.lv); if (i < D.levels.length - 1) open(D.levels[i + 1].id, 1) }
  });
  function fromHash() { var m = /^#(\w+)-(\d+)$/.exec(location.hash); if (m && D.data[m[1]]) { open(m[1], +m[2]); return true } return false }
  window.addEventListener('hashchange', fromHash);
  if (!fromHash()) open(D.data[cur.lv] ? cur.lv : D.levels[0].id, cur.no || 1);

  var AC = null;
  function chime() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); var t = AC.currentTime + .02; [523, 659, 784, 1047].forEach(function (f, i) { var o = AC.createOscillator(), g = AC.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(.0001, t + i * .1); g.gain.exponentialRampToValueAtTime(.15, t + i * .1 + .02); g.gain.exponentialRampToValueAtTime(.0001, t + i * .1 + .25); o.connect(g); g.connect(AC.destination); o.start(t + i * .1); o.stop(t + i * .1 + .3) }) } catch (e) {} }
  window.CRctx = ctx;
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
