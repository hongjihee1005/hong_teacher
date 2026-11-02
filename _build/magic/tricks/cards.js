/* 생각한 수 맞히기 카드 (1~31, 다섯 장 = 2진법) */
window.TRICK = function (host, api) {
  var K = [1, 2, 4, 8, 16], on = {};
  host.innerHTML = '<p class="mj-say">1부터 31까지의 수 하나를 마음속으로 정해요. 그 수가 들어 있는 카드를 <b>모두</b> 눌러요.</p><div class="mj-cards">' + K.map(function (k, i) {
    var ns = []; for (var n = 1; n <= 31; n++) if (n & k) ns.push(n);
    return '<button type="button" class="mj-card" data-k="' + k + '" aria-pressed="false"><b>카드 ' + '①②③④⑤'[i] + '</b><span>' + ns.map(function (n) { return '<i>' + n + '</i>' }).join('') + '</span></button>';
  }).join('') + '</div><div class="tl-row"><button type="button" class="tl-btn tl-go mj-go">🎩 맞혀 보세요!</button><button type="button" class="tl-btn mj-rst">처음부터</button></div><p class="mj-big tl-big" aria-live="polite"></p>';
  host.querySelectorAll('.mj-card').forEach(function (b) { b.onclick = function () { var k = +b.dataset.k; on[k] = !on[k]; b.setAttribute('aria-pressed', on[k] ? 'true' : 'false') } });
  host.querySelector('.mj-go').onclick = function () { var s = K.filter(function (k) { return on[k] }).reduce(function (a, b) { return a + b }, 0); host.querySelector('.mj-big').innerHTML = s ? '당신이 생각한 수는… <b>' + s + '</b>!' : '카드를 하나도 안 골랐어요. 1~31의 수는 꼭 한 장 이상에 있어요.'; if (s) api.done() };
  host.querySelector('.mj-rst').onclick = function () { on = {}; host.querySelectorAll('.mj-card').forEach(function (b) { b.setAttribute('aria-pressed', 'false') }); host.querySelector('.mj-big').textContent = '' };
};
