/* 패턴 블록: 여섯 가지 조각을 꺼내 끌어 옮기고 30°씩 돌리기 — 꼭짓점끼리 가까우면 저절로 붙음 */
window.TOOL = function (host, api) {
  var s = 56, h = s * Math.sqrt(3) / 2, c30 = s * Math.cos(Math.PI / 6), s30 = s * Math.sin(Math.PI / 6);
  var T = {
    hex: { nm: '육각형', c: '#F2C230', f: '1', p: [0, 1, 2, 3, 4, 5].map(function (k) { var a = Math.PI / 3 * k; return [s * Math.cos(a), s * Math.sin(a)] }) },
    trap: { nm: '사다리꼴', c: '#E5534B', f: '1/2', p: [[-s, 0], [s, 0], [s / 2, -h], [-s / 2, -h]] },
    rho: { nm: '파란 마름모', c: '#3B6FD6', f: '1/3', p: [[0, 0], [s, 0], [s * 1.5, -h], [s / 2, -h]] },
    tri: { nm: '삼각형', c: '#2EAA6A', f: '1/6', p: [[0, 0], [s, 0], [s / 2, -h]] },
    sq: { nm: '정사각형', c: '#E0861A', f: '', p: [[0, 0], [s, 0], [s, -s], [0, -s]] },
    thin: { nm: '얇은 마름모', c: '#D8C4A0', f: '', p: [[0, 0], [s, 0], [s + c30, -s30], [c30, -s30]] }
  };
  Object.keys(T).forEach(function (k) { var p = T[k].p, cx = 0, cy = 0; p.forEach(function (q) { cx += q[0]; cy += q[1] }); cx /= p.length; cy /= p.length; T[k].p = p.map(function (q) { return [q[0] - cx, q[1] - cy] }) });
  var P = [], sel = -1, nid = 0, frac = false, W = 1000, H = 560;
  host.innerHTML = '<div class="tl-row pb-pal">' + Object.keys(T).map(function (k) { var t = T[k], pts = t.p.map(function (q) { return (q[0] * .45 + 36) + ',' + (q[1] * .45 + 30) }).join(' '); return '<button type="button" class="pb-pick" data-t="' + k + '" aria-label="' + t.nm + ' 꺼내기"><svg viewBox="0 0 72 60" width="62" height="52" aria-hidden="true"><polygon points="' + pts + '" fill="' + t.c + '" stroke="#333" stroke-width="1.5"/></svg><small>' + t.nm + '<b class="pb-f">' + (t.f ? ' = ' + t.f : '') + '</b></small></button>' }).join('') + '</div>'
    + '<svg class="tl-svg pb-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="패턴 블록 판"></svg>'
    + '<div class="tl-row"><button type="button" class="tl-btn" data-a="l">⟲ 왼쪽으로 30°</button><button type="button" class="tl-btn" data-a="r">⟳ 오른쪽으로 30°</button><button type="button" class="tl-btn" data-a="dup">복사</button><button type="button" class="tl-btn" data-a="del">지우기</button><button type="button" class="tl-btn" data-a="frac" aria-pressed="false">육각형 = 1로 보기</button><button type="button" class="tl-btn" data-a="clr">모두 치우기</button></div><p class="tl-msg">위의 조각을 누르면 판에 나와요. 끌어서 옮기고, 조각을 누른 뒤 돌리기 단추를 써요. 꼭짓점이 가까우면 저절로 붙어요.</p>';
  var svg = host.querySelector('.pb-svg');
  function world(pc) { var t = T[pc.t], a = pc.r * Math.PI / 180, c = Math.cos(a), si = Math.sin(a); return t.p.map(function (q) { return [pc.x + q[0] * c - q[1] * si, pc.y + q[0] * si + q[1] * c] }) }
  function draw() {
    svg.innerHTML = '<rect width="' + W + '" height="' + H + '" class="pb-bg"/>' + P.map(function (pc, i) { return '<polygon points="' + world(pc).map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1) }).join(' ') + '" fill="' + T[pc.t].c + '" class="pb-pc' + (i === sel ? ' pb-sel' : '') + '" data-i="' + i + '"/>' }).join('');
    api.bar('패턴 블록 · 조각 ' + P.length + '개');
  }
  function pt(e) { var r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height] }
  function snap(i) {
    var me = world(P[i]), best = null;
    P.forEach(function (o, j) { if (j === i) return; world(o).forEach(function (q) { me.forEach(function (m) { var d = Math.hypot(q[0] - m[0], q[1] - m[1]); if (d < 16 && (!best || d < best.d)) best = { d: d, dx: q[0] - m[0], dy: q[1] - m[1] } }) }) });
    if (best) { P[i].x += best.dx; P[i].y += best.dy }
  }
  var drag = null;
  svg.addEventListener('pointerdown', function (e) {
    var g = e.target.closest('.pb-pc'); if (!g) { sel = -1; draw(); return }
    var i = +g.dataset.i, p = pt(e); P.push(P.splice(i, 1)[0]); sel = P.length - 1;
    drag = { ox: p[0] - P[sel].x, oy: p[1] - P[sel].y, moved: false }; svg.setPointerCapture(e.pointerId); draw();
  });
  svg.addEventListener('pointermove', function (e) { if (!drag) return; var p = pt(e); P[sel].x = Math.max(0, Math.min(W, p[0] - drag.ox)); P[sel].y = Math.max(0, Math.min(H, p[1] - drag.oy)); drag.moved = true; draw() });
  svg.addEventListener('pointerup', function () { if (drag && drag.moved) { snap(sel); draw() } drag = null });
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.t) { P.push({ t: b.dataset.t, x: 200 + (nid % 6) * 110, y: 140 + Math.floor(nid / 6) % 3 * 120, r: 0 }); nid++; sel = P.length - 1 }
    var a = b.dataset.a;
    if ((a === 'l' || a === 'r') && sel >= 0) { P[sel].r += a === 'r' ? 30 : -30; snap(sel) }
    if (a === 'dup' && sel >= 0) { var c = Object.assign({}, P[sel]); c.x += 30; c.y += 30; P.push(c); sel = P.length - 1 }
    if (a === 'del' && sel >= 0) { P.splice(sel, 1); sel = -1 }
    if (a === 'frac') { frac = !frac; b.setAttribute('aria-pressed', frac ? 'true' : 'false'); host.classList.toggle('pb-showf', frac) }
    if (a === 'clr') { P = []; sel = -1 }
    if (b.dataset.t || a) draw();
  });
  document.addEventListener('keydown', function (e) { if (sel < 0 || /INPUT|SELECT/.test(e.target.tagName)) return; if (e.key === 'r' || e.key === 'R') { P[sel].r += 30; draw() } if (e.key === 'Delete' || e.key === 'Backspace') { P.splice(sel, 1); sel = -1; draw() } });
  draw();
};
