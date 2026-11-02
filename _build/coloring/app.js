/* 컬러링: 도안 고르기 → 색 고르고 칸 눌러 칠하기 · 칠한 것은 이 기기(localStorage)에만 저장 */
(function () {
  var D = CL, G = D.g, SW = D.sw, $ = function (i) { return document.getElementById(i) };
  var PAL = [['빨강', '#E53935'], ['주황', '#FB8C00'], ['노랑', '#FDD835'], ['연두', '#9CCC65'], ['초록', '#43A047'], ['청록', '#26A69A'],
    ['하늘', '#4FC3F7'], ['파랑', '#1E88E5'], ['남색', '#3949AB'], ['보라', '#8E24AA'], ['분홍', '#F48FB1'], ['자홍', '#D81B60'],
    ['살구', '#FFCC80'], ['갈색', '#8D6E63'], ['고동', '#5D4037'], ['연분홍', '#FCE4EC'], ['연노랑', '#FFF9C4'], ['연하늘', '#E1F5FE'],
    ['연보라', '#E1BEE7'], ['민트', '#B2DFDB'], ['회색', '#9E9E9E'], ['검정', '#212121'], ['살색', '#FFE0C2']];
  var KEY = 'hj-color-v2', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { st = {} }
  st[G] = st[G] || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) { say('저장 공간이 부족해 칠한 내용을 저장하지 못했어요.') } }
  /* 칸 수로 쉬운 것부터 정렬(같은 설정이면 언제나 같은 순서) */
  var L = D.s.map(function (s, i) { return { s: s, i: i, n: CD.make(s).els.filter(function (e) { return !e.line }).length } });
  L.sort(function (a, b) { return a.n - b.n || a.i - b.i });
  L.forEach(function (x, k) { x.no = k + 1; x.id = 'd' + x.i });

  function list() {
    var done = 0;
    var LV = [['쉬움', '칸이 적고 큼직한 도안'], ['보통', '칸이 조금 많아진 도안'], ['도전', '칸이 가장 많고 정교한 도안']], h = '';
    L.forEach(function (x, k) {
      if (k % 30 === 0) { var b = k / 30; h += (k ? '</div>' : '') + '<h3 class="cl-lv">' + LV[b][0] + ' <small>' + (k + 1) + '~' + (k + 30) + '번 · ' + LV[b][1] + '</small></h3><div class="cl-list">' }
      var f = st[G][x.id], c = f ? Object.keys(f).length : 0; if (c) done++;
      h += '<button type="button" class="cl-d' + (c ? ' go' : '') + '" data-k="' + k + '"><span class="cl-th" data-t="' + k + '"></span><b>' + x.no + '. ' + CD.title(x.s) + '</b><small>' + (c ? '색칠 중 · ' : '') + '칸 ' + x.n + '개</small></button>';
    });
    $('clList').innerHTML = h + '</div>';
    $('clProg').textContent = '색칠한 도안 ' + done + ' / ' + L.length;
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { thumb(e.target); io.unobserve(e.target) } })
    }, { rootMargin: '300px' }) : null;
    document.querySelectorAll('.cl-th').forEach(function (t) { if (io) io.observe(t); else thumb(t) });
  }
  function thumb(t) { var x = L[+t.dataset.t]; t.innerHTML = CD.svg(x.s, st[G][x.id], SW * 1.4).html }

  var cur = -1, fills = {}, hist = [], col = PAL[0][1];
  var pal = $('clPal');
  pal.innerHTML = PAL.map(function (p, i) { return '<button type="button" role="radio" aria-checked="' + (i ? 'false' : 'true') + '" aria-label="' + p[0] + '" data-c="' + p[1] + '" data-n="' + p[0] + '" style="background:' + p[1] + '"></button>' }).join('') +
    '<button type="button" role="radio" aria-checked="false" class="er" data-c="#ffffff" data-n="지우개" aria-label="지우개(흰색)">지우개</button>';
  function pick(b) { pal.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false') }); col = b.dataset.c; $('clSw').style.background = col; $('clName').textContent = b.dataset.n }
  pick(pal.firstChild);
  pal.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) pick(b) });

  function open(k) {
    cur = k; var x = L[k]; fills = Object.assign({}, st[G][x.id] || {}); hist = [];
    $('clTitle').textContent = G + '학년 · ' + x.no + '. ' + CD.title(x.s) + ' (' + ['쉬움', '보통', '도전'][Math.floor(k / 30)] + ')';
    $('clArt').innerHTML = CD.svg(x.s, fills, SW).html;
    $('clPrev').disabled = k === 0; $('clNext').disabled = k === L.length - 1;
    $('clPick').hidden = true; $('clPlay').hidden = false; say('');
    history.replaceState(null, '', '#' + x.no); window.scrollTo(0, 0);
  }
  function close() { cur = -1; $('clPlay').hidden = true; $('clPick').hidden = false; list(); history.replaceState(null, '', location.pathname + location.search) }
  function persist() { var id = L[cur].id; if (Object.keys(fills).length) st[G][id] = fills; else delete st[G][id]; save() }
  $('clArt').addEventListener('click', function (e) {
    var p = e.target.closest('.cl-r'); if (!p) return;
    var k = p.dataset.k, old = fills[k] || '#fff', nw = col;
    if (old === nw || (nw === '#ffffff' && !fills[k])) return;
    hist.push([k, fills[k]]);
    if (nw === '#ffffff') delete fills[k]; else fills[k] = nw;
    p.setAttribute('fill', fills[k] || '#fff'); persist();
  });
  $('clUndo').onclick = function () {
    var h = hist.pop(); if (!h) { say('더 되돌릴 것이 없어요.'); return }
    if (h[1]) fills[h[0]] = h[1]; else delete fills[h[0]];
    var p = $('clArt').querySelector('[data-k="' + h[0] + '"]'); if (p) p.setAttribute('fill', fills[h[0]] || '#fff'); persist();
  };
  $('clClear').onclick = function () {
    if (!confirm('칠한 색을 모두 지우고 처음부터 할까요?')) return;
    fills = {}; hist = []; persist(); $('clArt').innerHTML = CD.svg(L[cur].s, fills, SW).html;
  };
  $('clSave').onclick = function () {
    var x = L[cur], s = CD.svg(x.s, fills, SW).html.replace('<svg class="cl-svg"', '<svg width="1200" height="1200"');
    var img = new Image(), url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    img.onload = function () {
      var c = document.createElement('canvas'); c.width = c.height = 1200; var g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, 1200, 1200); g.drawImage(img, 0, 0, 1200, 1200);
      try {
        c.toBlob(function (bl) {
          var a = document.createElement('a'), u = URL.createObjectURL(bl); a.download = G + '학년-컬러링-' + x.no + '.png'; a.href = u;
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u) }, 4000); say('그림을 PNG 파일로 저장했어요.');
        }, 'image/png');
      } catch (e) { say('이 브라우저에서는 저장할 수 없어요.') }
    };
    img.src = url;
  };
  $('clPrint').onclick = function () {
    var x = L[cur];
    $('clSheet').innerHTML = '<p>' + G + '학년 컬러링 ' + x.no + '. ' + CD.title(x.s) + ' &nbsp; 이름: ____________</p>' + CD.svg(x.s, null, Math.max(SW, 1.2)).html;
    setTimeout(function () { window.print() }, 50);
  };
  $('clPrev').onclick = function () { if (cur > 0) open(cur - 1) };
  $('clNext').onclick = function () { if (cur < L.length - 1) open(cur + 1) };
  $('clBack').onclick = close;
  $('clList').addEventListener('click', function (e) { var b = e.target.closest('.cl-d'); if (b) open(+b.dataset.k) });
  document.addEventListener('keydown', function (e) {
    if (cur < 0) return;
    if (e.key === 'Escape') close();
    else if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); $('clUndo').click() }
  });
  function say(t) { $('clMsg').textContent = t }
  list();
  function fromHash() { var h = parseInt(location.hash.slice(1), 10); if (h >= 1 && h <= L.length && h - 1 !== cur) open(h - 1) }
  window.addEventListener('hashchange', fromHash); fromHash();
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
