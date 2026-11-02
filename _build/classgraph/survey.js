/* 우리 반 그래프 › 설문하기: 질문과 보기를 정하고, 학생이 앞에 나와 하나씩 눌러 투표 → 그래프로 보내기 */
window.TOOL = function (host, api) {
  var COL = ['#E5534B', '#E0861A', '#D9B21A', '#3E9A3E', '#2B8C9E', '#3B6FD6', '#7B4FB0', '#C2479A'];
  var S = { q: '우리 반이 가장 좋아하는 계절은?', o: ['봄', '여름', '가을', '겨울'], n: [0, 0, 0, 0], hide: false }, hist = [];
  try { var o = JSON.parse(localStorage.getItem('hj-cgraph-survey')); if (o && o.o) S = o } catch (e) { }
  function save() { try { localStorage.setItem('hj-cgraph-survey', JSON.stringify(S)) } catch (e) { } }
  host.innerHTML = '<div class="sv-set"><label class="cg-lab">질문 <input class="sv-q" maxlength="50"></label><label class="cg-lab">보기 <input class="sv-o" maxlength="80" placeholder="쉼표로 나눠 써요: 봄, 여름, 가을, 겨울"></label><div class="tl-row"><button type="button" class="tl-btn" data-a="apply">보기 바꾸기(수는 0부터)</button><button type="button" class="tl-btn" data-a="hide" aria-pressed="false">결과 숨기기</button></div></div>'
    + '<h3 class="sv-title"></h3><div class="sv-opts"></div><p class="tl-row sv-total"></p>'
    + '<div class="tl-row"><button type="button" class="tl-btn" data-a="undo">한 표 되돌리기</button><button type="button" class="tl-btn" data-a="zero">수를 모두 0으로</button><button type="button" class="tl-btn tl-go" data-a="send">📊 그래프로 보내기</button></div><p class="tl-msg">학생이 한 명씩 나와 자기 생각에 맞는 단추를 한 번 눌러요. ‘결과 숨기기’를 켜면 수가 보이지 않아 다른 친구의 선택에 끌리지 않아요.</p>';
  function draw() {
    host.querySelector('.sv-q').value = S.q; host.querySelector('.sv-o').value = S.o.join(', ');
    host.querySelector('.sv-title').textContent = S.q;
    host.querySelector('.sv-opts').innerHTML = S.o.map(function (o, i) { return '<button type="button" class="sv-b" data-i="' + i + '" style="--c:' + COL[i % COL.length] + '"><span>' + o.replace(/</g, '&lt;') + '</span><b>' + (S.hide ? '?' : S.n[i]) + '</b></button>' }).join('');
    var t = S.n.reduce(function (a, b) { return a + b }, 0); host.querySelector('.sv-total').innerHTML = '모두 <b>' + t + '</b>명이 답했어요';
    host.querySelector('[data-a="hide"]').setAttribute('aria-pressed', S.hide ? 'true' : 'false');
    save(); api.bar('우리 반 설문하기');
  }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var a = b.dataset.a;
    if (b.dataset.i != null) { var i = +b.dataset.i; S.n[i]++; hist.push(i); b.classList.remove('sv-pop'); void b.offsetWidth; b.classList.add('sv-pop'); draw(); var nb = host.querySelector('.sv-b[data-i="' + i + '"]'); nb.classList.add('sv-pop'); return }
    if (a === 'apply') { var o = host.querySelector('.sv-o').value.split(/[,，]/).map(function (x) { return x.trim() }).filter(Boolean).slice(0, 8); if (o.length < 2) { host.querySelector('.tl-msg').textContent = '보기는 쉼표로 나눠 2개 넘게 써 주세요.'; return } S.q = host.querySelector('.sv-q').value || '질문'; S.o = o; S.n = o.map(function () { return 0 }); hist = [] }
    if (a === 'hide') S.hide = !S.hide;
    if (a === 'undo' && hist.length) S.n[hist.pop()]--;
    if (a === 'zero' && confirm('수를 모두 0으로 할까요?')) { S.n = S.n.map(function () { return 0 }); hist = [] }
    if (a === 'send') { CG.save({ t: S.q.replace(/[?？]$/, ''), u: '명', rows: S.o.map(function (o, i) { return [o, S.n[i]] }), type: 'bar' }); location.href = 'graph.html#from-survey'; return }
    draw();
  });
  host.querySelector('.sv-q').addEventListener('input', function () { S.q = this.value; host.querySelector('.sv-title').textContent = S.q; save() });
  draw();
};
