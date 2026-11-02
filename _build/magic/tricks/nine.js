/* 사라진 숫자 맞히기(9의 마술): 수 − 각 자리 숫자의 합 → 9의 배수 */
window.TRICK = function (host, api) {
  host.innerHTML = '<ol class="mj-steps"><li>네 자리 수를 하나 생각해요. <input class="mj-in" inputmode="numeric" maxlength="4" aria-label="네 자리 수"></li></ol><div class="mj-digs"></div><div class="mj-env" hidden><span>🎩 사라진 숫자는</span><b class="mj-pred">?</b></div><p class="tl-msg" aria-live="polite"></p>';
  var ol = host.querySelector('.mj-steps'), D = host.querySelector('.mj-digs'), msg = host.querySelector('.tl-msg'), env = host.querySelector('.mj-env');
  host.querySelector('input').addEventListener('input', function () {
    var v = this.value.replace(/\D/g, ''); this.value = v; while (ol.children.length > 1) ol.lastChild.remove(); D.innerHTML = ''; env.hidden = true; msg.textContent = '';
    if (v.length < 4 || v[0] === '0') return;
    var n = +v, s = v.split('').reduce(function (a, b) { return a + +b }, 0), r = n - s, rs = String(r);
    var li = document.createElement('li'); li.innerHTML = '각 자리 숫자를 모두 더해요: ' + v.split('').join(' + ') + ' = <b>' + s + '</b>'; ol.appendChild(li);
    li = document.createElement('li'); li.innerHTML = '처음 수에서 그 합을 빼요: ' + n + ' − ' + s + ' = <b>' + r + '</b>'; ol.appendChild(li);
    li = document.createElement('li'); li.innerHTML = '답에서 <b>0이 아닌 숫자 하나</b>를 눌러 숨겨요. 마술사는 나머지 숫자만 봐요.'; ol.appendChild(li);
    D.innerHTML = rs.split('').map(function (d, i) { return '<button type="button" class="mj-dg" data-i="' + i + '"' + (d === '0' ? ' disabled' : '') + '>' + d + '</button>' }).join('');
    D.onclick = function (e) {
      var b = e.target.closest('.mj-dg'); if (!b || D.dataset.done) return; D.dataset.done = 1; var i = +b.dataset.i;
      D.querySelectorAll('.mj-dg').forEach(function (x, j) { x.textContent = j === i ? '?' : rs[j]; x.classList.toggle('mj-hid', j === i) });
      var rest = rs.split('').filter(function (_, j) { return j !== i }).reduce(function (a, b) { return a + +b }, 0), m = 9 - rest % 9; if (m === 0) m = 9;
      env.hidden = false; host.querySelector('.mj-pred').textContent = m;
      msg.innerHTML = '보이는 숫자의 합은 ' + rest + '. 숨긴 숫자는 <b>' + m + '</b>! <button type="button" class="tl-btn mj-show">숨긴 숫자 보기</button>';
      msg.querySelector('.mj-show').onclick = function () { D.querySelector('.mj-hid').textContent = rs[i]; D.querySelector('.mj-hid').classList.add('mj-ok') };
      api.done();
    };
    delete D.dataset.done;
  });
};
