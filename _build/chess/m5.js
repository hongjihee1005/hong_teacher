/* 체스 학습관 5마당 · 전술 (22차시) — window.MADANG
   문제는 gen_m5.js가 미리 만들어 검증한 문제 은행(m5_data.js, window.M5DATA)에서 골라, 반은 좌우를 뒤집어 냅니다.
   전술 문제는 여러 수 풀이(type 'line'): 정답 → 흑의 대답(은행에 저장) → 이득을 챙기는 수. 메이트 문제는 메이트로 끝남. */
(function () {
  'use strict';
  var CH = window.CH, PN = window.PIECES.NAME, jo = window.PIECES.jo, AI = window.CAI, BK = window.M5DATA || {}, F = 'abcdefgh';
  var E = '8/8/8/8/8/8/8/8';
  function M(list, v) { var o = {}; list.forEach(function (s) { o[s] = v; }); return o; }
  function J() { var o = {}; [].forEach.call(arguments, function (m) { Object.keys(m || {}).forEach(function (k) { o[k] = (o[k] || []).concat(Array.isArray(m[k]) ? m[k] : [m[k]]); }); }); return o; }
  function B(o) { var b = CH.board(E); Object.keys(o).forEach(function (s) { b[CH.idx(s)] = o[s]; }); return b; }
  function pickQ(q, opts, ans, board, hint, extra) { return Object.assign({ type: 'pick', q: q, opts: opts, ans: ans, board: board, hint: hint }, extra || {}); }
  /* 좌우 뒤집기(캐슬링·앙파상 없는 국면만) */
  function mirSq(s) { return F[7 - F.indexOf(s[0])] + s[1]; }
  function mirFen(fen) { var a = fen.split(' '); a[0] = a[0].split('/').map(function (r) { var x = ''; r.split('').forEach(function (c) { x += /\d/.test(c) ? '.'.repeat(+c) : c; }); x = x.split('').reverse().join(''); return x.replace(/\.+/g, function (d) { return d.length; }); }).join('/'); return a.join(' '); }
  function mirMv(g) { return [mirSq(g[0]), mirSq(g[1])].concat(g.slice(2)); }
  function get(kind, R, mir) {
    var list = BK[kind] || []; if (!list.length) return null;
    var it = R.pick(list), m = mir === undefined ? R.int(2) === 1 : mir;
    if (!m) return it;
    return { fen: mirFen(it.fen), good: it.good.map(mirMv), reply: it.reply && mirMv(it.reply), good2: it.good2 && it.good2.map(mirMv) };
  }
  var NAME = { dbl: '이중 공격', nfork: '나이트 포크', pfork: '폰 포크', qfork: '퀸 포크', pinabs: '절대 핀', pinrel: '상대 핀', skewer: '스큐어', disatk: '디스커버드 공격', dischk: '디스커버드 체크', dblchk: '더블 체크', remdef: '지키는 말 없애기', decoy: '유인', overload: '과부하', backrank: '백랭크 메이트', smother: '스머더드 메이트', mate2: '2수 메이트' };
  var TQ = {
    dbl: '한 수로 흑 말 <b>두 개를 한꺼번에</b> 공격해요(이중 공격).', nfork: '<b>나이트 포크</b>를 찾아요! 나이트 하나로 흑 말 두 개를 노려요.', pfork: '<b>폰 포크</b>를 찾아요! 폰 하나로 흑 말 두 개를 노려요.', qfork: '<b>퀸 포크</b>를 찾아요! 퀸으로 두 곳을 한꺼번에 노려요.',
    pinabs: '흑 말을 킹 앞에 묶는 <b>핀</b>을 걸어요.', pinrel: '흑 말을 더 값진 말 앞에 묶는 <b>핀</b>을 걸어요.', skewer: '<b>스큐어</b>! 앞의 값진 말을 공격해 비키게 하고, 뒤의 말을 노려요.',
    disatk: '<b>디스커버드 공격</b>! 말 하나를 비켜서 뒤에 있던 말의 길을 열어요.', dischk: '<b>디스커버드 체크</b>! 말을 비켜서 뒤의 말이 체크하게 해요.', dblchk: '<b>더블 체크</b>! 두 말로 한꺼번에 체크해요.',
    remdef: '<b>지키는 말 없애기</b>! 흑 말을 지켜 주는 말을 먼저 없애요.', decoy: '<b>유인</b>! 내 말을 내주며 흑 말(킹)을 나쁜 칸으로 끌어내요.', overload: '<b>과부하</b>! 두 가지를 혼자 지키는 흑 말을 노려요.',
    backrank: '<b>백랭크 메이트</b>를 해요!', smother: '<b>스머더드 메이트</b>! 나이트로 메이트해요.', mate2: '<b>2수 메이트</b>! 두 수 만에 메이트해요.', mix: '전술을 찾아 이득을 보거나 메이트해요! (어떤 전술인지는 스스로 찾아요)'
  };
  var TH = {
    dbl: ['한 칸에서 두 흑 말을 함께 공격할 수 있는 곳을 찾아요.', '킹을 체크하면서 다른 말도 노리면 더 좋아요.'],
    nfork: ['나이트가 L자로 뛰어 킹·퀸·룩 가운데 둘을 동시에 노리는 칸을 찾아요.', '그 칸이 흑 말에게 잡히지 않는지도 봐요.'],
    pfork: ['폰이 한 칸 앞으로 가면 대각선 앞 두 칸을 공격해요.', '흑 말 두 개 사이 바로 아래 칸을 찾아요.'],
    qfork: ['퀸은 여덟 방향을 노려요. 체크하면서 다른 말도 노리는 칸을 찾아요.', '지켜 주는 말이 없는 흑 말을 노려요.'],
    pinabs: ['흑 킹과 흑 말이 한 줄에 있나요? 그 줄 끝에서 공격해요.', '핀에 걸린 말은 움직이면 킹이 공격받아서 움직일 수 없어요.'],
    pinrel: ['흑 퀸이나 룩 앞에 값싼 흑 말이 있는 줄을 찾아요.', '앞의 말이 비키면 뒤의 값진 말을 잡을 수 있게 해요.'],
    skewer: ['흑 킹이나 퀸과 다른 흑 말이 한 줄에 있나요? 앞의 값진 말을 공격해요.', '앞의 말이 비키면 뒤의 말을 잡아요.'],
    disatk: ['내 룩·비숍·퀸 앞을 막고 있는 내 말을 찾아요.', '그 말을 옮기면서 다른 것도 노리면 상대는 둘 다 막지 못해요.'],
    dischk: ['내 룩·비숍·퀸과 흑 킹 사이에 내 말이 하나 있나요?', '그 말을 옮기면 체크! 옮기면서 다른 말을 노려요.'],
    dblchk: ['디스커버드 체크인데, 옮긴 말도 체크를 주면 더블 체크예요.', '더블 체크에는 킹이 피하는 수밖에 없어요.'],
    remdef: ['내가 노리는 흑 말을 지켜 주는 흑 말이 누구인가요?', '그 지킴이를 먼저 잡거나 쫓아내요.'],
    decoy: ['내 말을 내주어서라도 흑 킹이나 퀸을 원하는 칸으로 끌어낼 수 있나요?', '끌어낸 다음 수에 포크나 메이트가 있는지 봐요.'],
    overload: ['한 흑 말이 두 개를 지키고 있나요?', '하나를 잡게 하면 다른 하나를 지킬 수 없어요.'],
    backrank: ['흑 킹이 끝 줄에 자기 폰들에 갇혀 있나요?', '룩이나 퀸으로 끝 줄에서 체크해요.'],
    smother: ['흑 킹 둘레가 자기 말들로 꽉 막혀 있나요?', '나이트 체크는 막을 수 없어요.'],
    mate2: ['첫 수는 체크가 아닐 수도 있어요. 흑 킹이 갈 칸을 미리 막아요.', '흑이 어떻게 받아도 다음 수에 메이트가 있는 수를 찾아요.']
  };
  function task(kind, R, q) {
    /* 문제가 적은 모양은 가까운 모양과 함께 냄(이중 공격 = 모든 포크, 상대 핀 = 핀, 과부하 = 지키는 말 없애기와 함께) */
    var POOL = { dbl: ['dbl', 'nfork', 'qfork', 'pfork'], pinrel: ['pinrel', 'pinabs'], overload: ['overload', 'remdef'] };
    var real = kind === 'mix' ? R.pick(Object.keys(BK).filter(function (k) { return BK[k].length && k !== 'mate2'; })) : POOL[kind] ? R.pick(POOL[kind].filter(function (k) { return (BK[k] || []).length; }).concat([kind]).filter(function (k) { return (BK[k] || []).length; })) || kind : kind;
    var it = get(real, R);
    if (!it) return pickQ('이 전술 문제는 아직 준비 중이에요. 전술의 이름을 골라요: 나이트로 두 말을 한꺼번에 노리는 것은?', ['나이트 포크', '스큐어', '핀'], '나이트 포크', { pos: E }, ['포크는 두 갈래로 노리는 것이에요.']);
    var mateK = real === 'mate2' || real === 'backrank' || real === 'smother';
    var T = { type: it.reply ? 'line' : 'play', kind: 'deep', state: it.fen, good: it.good, moves: it.reply ? 2 : 1, mate: real === 'mate2',
      q: q || TQ[kind], hint: (TH[real] || TH.dbl).slice(),
      ok: mateK ? '체크메이트! ' + jo(NAME[real], '을') + ' 해냈어요.' : jo(NAME[real], '으로') + ' 이득을 봤어요!',
      stepQ: real === 'mate2' ? '이제 메이트해요!' : '이제 이득을 챙겨요!',
      why: function (f, s) { return { text: '그 수도 둘 수 있지만 ' + (kind === 'mix' ? '전술이' : jo(NAME[real], '이')) + ' 아니에요. ' + (TH[real] || TH.dbl)[0], marks: M([s], 'bad') }; } };
    if (it.reply) { var rp = it.reply, g2 = it.good2; T.reply = function (p) { return CH.legal(p).filter(function (m) { return CH.name(m.from) === rp[0] && CH.name(m.to) === rp[1]; })[0]; }; T.goodAt = function () { return g2; }; }
    return T;
  }
  /* 예시: 은행 첫 문제를 정답 → 대답 → 이득까지 움직여 보여 줌 */
  function exFrom(kind, text) {
    var it = (BK[kind] || []).filter(function (x) { var b0 = CH.board(x.fen.split(' ')[0]), mv = [x.good[0]].concat(x.reply ? [x.reply, x.good2[0]] : []); return mv.every(function (g) { return !g[2] && !(/p/i.test(b0[CH.idx(g[0])]) && /[18]/.test(g[1][1])); }); })[0]; /* 예시는 프로모션 없는 문제로 */ if (!it) return { t: 'ex', text: text + ' (예시 준비 중)', board: { pos: E }, frames: [{ cap: '' }] };
    var fen = it.fen.split(' ')[0], b = CH.board(fen), g = it.good[0], fr = [{ marks: M([g[0]], 'ring'), cap: '이 판에서 ' + jo(NAME[kind], '을') + ' 찾아볼까요? 동그라미 말이 열쇠예요.' }];
    var b2 = b.slice(); b2[CH.idx(g[1])] = b2[CH.idx(g[0])]; b2[CH.idx(g[0])] = '.';
    var tg = CH.attacks(b2, CH.idx(g[1])).filter(function (i) { return b2[i] !== '.' && !CH.isW(b2[i]); }).map(CH.name);
    fr.push({ mv: [g[0], g[1]], marks: J(M([g[1]], 'hi'), M(tg, 'ring')), cap: '① ' + jo(PN[b[CH.idx(g[0])].toUpperCase()], '이') + ' ' + jo(g[1], '으로') + '! ' + (kind === 'mate2' ? '흑 킹이 갈 곳을 줄여요.' : '동그라미 흑 말들을 노려요.') });
    if (it.reply) { fr.push({ mv: it.reply, marks: M([it.reply[1]], 'hi'), cap: '② 흑은 ' + jo(it.reply[1], '으로') + ' 받아요.' }); var g2 = it.good2[0]; fr.push({ mv: [g2[0], g2[1]], marks: M([g2[1]], 'ok'), cap: kind === 'mate2' ? '③ 체크메이트!' : '③ 이득을 챙겼어요!' }); }
    return { t: 'ex', text: text, board: { pos: fen }, frames: fr };
  }
  function tacLesson(id, title, kind, says, sumText, n) {
    return { id: id, title: title, kind: 'deep', screens: says.concat([exFrom(kind, '실제 문제로 ' + jo(NAME[kind], '을') + ' 봐요.'), { t: 'do', task: function (R) { return task(kind, R); } }, { t: 'do', task: function (R) { return task(kind, R); } }]),
      practice: { n: n || 6, gen: function (R) { return task(kind, R); } }, sum: sumText };
  }
  var u25 = [
    tacLesson('tac-dbl', '이중 공격', 'dbl',
      [{ t: 'say', text: '5마당에서는 <b>전술</b>을 배워요. 전술은 한두 수로 상대 말을 얻거나 메이트하는 <b>작전</b>이에요. 첫 번째는 <b>이중 공격</b>: 한 수로 <b>두 개를 한꺼번에</b> 공격하는 거예요.', board: { pos: B({ d5: 'R', b5: 'n', g5: 'b', e1: 'K', e8: 'k' }), marks: J(M(['d5'], 'sel'), M(['b5', 'g5'], 'ring')), arrows: [['d5', 'b5'], ['d5', 'g5']] } },
       { t: 'say', text: '상대는 한 번에 한 수만 둘 수 있으니, 하나를 구하면 다른 하나를 잃어요. 이중 공격을 영어로 <b>포크</b>(fork, 갈퀴)라고도 해요. 두 갈래로 찌르는 갈퀴처럼요!', board: { pos: B({ d4: 'Q', a7: 'r', g7: 'b', e1: 'K', h8: 'k' }), marks: J(M(['d4'], 'sel'), M(['a7', 'g7'], 'ring')), arrows: [['d4', 'a7'], ['d4', 'g7']] } }],
      '<b>이중 공격(포크)</b>: 한 수로 두 개를 한꺼번에 공격해요. 상대는 하나만 구할 수 있어요.', 6),
    tacLesson('tac-nfork', '나이트 포크', 'nfork',
      [{ t: 'say', text: '포크를 가장 잘하는 말은 <b>나이트</b>예요. L자로 뛰어 여러 방향을 노리고, 상대 말이 나이트를 같은 방법으로 공격하기 어렵거든요.', board: { pos: B({ c7: 'N', e8: 'k', a8: 'r', e1: 'K' }), marks: J(M(['c7'], 'sel'), M(['e8', 'a8'], 'ring')) } },
       { t: 'say', text: '킹과 퀸(또는 룩)을 한꺼번에 노리는 나이트 포크는 아주 강해요. 킹은 체크라서 꼭 피해야 하고, 그러면 나이트가 퀸이나 룩을 잡아요.', board: { pos: B({ c7: 'N', e8: 'k', a8: 'r', e1: 'K' }), marks: M(['e8'], 'bad'), arrows: [['c7', 'e8'], ['c7', 'a8']] } }],
      '<b>나이트 포크</b>: 나이트가 L자로 두 말을 한꺼번에 노려요. 킹+퀸, 킹+룩이면 최고!'),
    tacLesson('tac-pfork', '폰 포크', 'pfork',
      [{ t: 'say', text: '가장 값싼 <b>폰</b>도 포크를 할 수 있어요. 폰이 한 칸 나아가 <b>대각선 앞 두 칸</b>의 흑 말을 한꺼번에 노려요.', board: { pos: B({ d5: 'P', c6: 'n', e6: 'b', e1: 'K', e8: 'k' }), marks: J(M(['d5'], 'sel'), M(['c6', 'e6'], 'ring')), arrows: [['d5', 'c6'], ['d5', 'e6']] } },
       { t: 'say', text: '폰은 1점이라, 나이트나 비숍이 폰을 잡아도 손해가 아니에요. 흑은 둘 중 하나를 잃어요.', board: { pos: B({ d5: 'P', c6: 'n', e6: 'b', e1: 'K', e8: 'k' }) } }],
      '<b>폰 포크</b>: 폰 하나로 대각선 앞 두 말을 노려요. 값싼 폰이라 더 강해요.'),
    tacLesson('tac-qfork', '퀸 포크', 'qfork',
      [{ t: 'say', text: '<b>퀸</b>은 여덟 방향으로 노리니 포크를 잘해요. 특히 <b>체크하면서</b> 지켜지지 않은 말을 함께 노리는 퀸 포크가 많아요.', board: { pos: B({ d4: 'Q', g7: 'k', a7: 'r', e1: 'K' }), marks: J(M(['g7'], 'bad'), M(['a7'], 'ring')), arrows: [['d4', 'g7'], ['d4', 'a7']] } },
       { t: 'say', text: '⚠️ 퀸은 값진 말이라, 지켜진 말을 노리면 소용없어요. <b>혼자 있는 말</b>을 노려요.', board: { pos: B({ d4: 'Q', g7: 'k', a7: 'r', e1: 'K' }) } }],
      '<b>퀸 포크</b>: 체크하면서 혼자 있는 말을 함께 노려요.'),
    tacLesson('tac-pinabs', '절대 핀', 'pinabs',
      [{ t: 'say', text: '<b>핀</b>: 상대 말이 더 중요한 말 앞에 묶여서 움직이지 못하는 것이에요. 뒤에 <b>킹</b>이 있으면 그 말은 규칙상 절대 못 움직여요. 이것이 <b>절대 핀</b>이에요.', board: { pos: B({ b5: 'B', c6: 'n', e8: 'k', e1: 'K' }), marks: J(M(['c6'], 'ring'), M(['e8'], 'bad')), arrows: [['b5', 'e8']] } },
       { t: 'say', text: '핀을 거는 말은 <b>룩·비숍·퀸</b>(줄을 따라 멀리 가는 말)이에요. 핀에 걸린 말을 다른 말로 한 번 더 공격하면 그 말을 얻어요.', board: { pos: B({ b5: 'B', c6: 'n', e8: 'k', d4: 'P', e1: 'K' }), marks: J(M(['c6'], 'ring')), arrows: [['d4', 'd5']] } }],
      '<b>절대 핀</b>: 뒤에 킹이 있어 움직일 수 없는 말. 핀에 걸린 말을 한 번 더 공격하면 얻어요.'),
    tacLesson('tac-pinrel', '상대 핀', 'pinrel',
      [{ t: 'say', text: '뒤에 킹이 아니라 <b>퀸이나 룩</b> 같은 값진 말이 있으면 <b>상대 핀</b>이에요. 움직일 수는 있지만, 움직이면 뒤의 값진 말을 잃어요.', board: { pos: B({ b5: 'B', c6: 'n', d7: 'q', g8: 'k', g1: 'K' }), marks: J(M(['c6'], 'ring'), M(['d7'], 'bad')), arrows: [['b5', 'd7']] } }],
      '<b>상대 핀</b>: 뒤에 값진 말이 있어 움직이면 손해인 말. 움직일 수는 있어요.'),
    tacLesson('tac-pinuse', '핀 이용하기', 'pinabs',
      [{ t: 'say', text: '핀에 걸린 말은 <b>지킴이 노릇도 못 해요.</b> 핀에 걸린 말이 지키던 칸은 사실 비어 있는 것과 같아요.', board: { pos: B({ b5: 'B', c6: 'n', e8: 'k', e1: 'K' }), marks: J(M(['c6'], 'ring')) } },
       { t: 'say', text: '그리고 핀에 걸린 말을 <b>값싼 말로 공격</b>하면 그 말은 도망가지 못해요. 폰으로 핀 걸린 말을 공격하는 것이 대표적이에요.', board: { pos: B({ b5: 'B', c6: 'n', e8: 'k', d4: 'P', e1: 'K' }), arrows: [['d4', 'd5']] } }],
      '핀에 걸린 말은 <b>도망가지도, 지키지도</b> 못해요. 값싼 말로 공격해요.'),
    tacLesson('tac-skewer', '스큐어', 'skewer',
      [{ t: 'say', text: '<b>스큐어</b>(꼬챙이)는 핀의 반대예요. <b>앞에 값진 말</b>(킹·퀸)이 있고 뒤에 다른 말이 있어요. 앞의 말을 공격하면 비켜야 하고, 그러면 뒤의 말을 잡아요.', board: { pos: B({ a1: 'R', e5: 'k', e8: 'q', h1: 'K' }), marks: J(M(['e5'], 'bad'), M(['e8'], 'ring')), arrows: [['a1', 'e1']] } },
       { t: 'say', text: '룩 e1 체크! 흑 킹이 e줄에서 비키면, 룩이 e8의 퀸을 잡아요.', board: { pos: B({ e1: 'R', e5: 'k', e8: 'q', h1: 'K' }), marks: J(M(['e5'], 'bad'), M(['e8'], 'ring')), arrows: [['e1', 'e8']] } }],
      '<b>스큐어</b>: 앞의 값진 말을 공격해 비키게 하고, 뒤의 말을 잡아요.'),
    tacLesson('tac-disatk', '디스커버드 공격', 'disatk',
      [{ t: 'say', text: '내 룩·비숍·퀸 앞을 <b>내 말</b>이 막고 있을 때, 그 말을 <b>비키면</b> 숨어 있던 공격이 드러나요. 이것이 <b>디스커버드 공격</b>(드러난 공격)이에요.', board: { pos: B({ d1: 'R', d4: 'N', d8: 'q', e1: 'K', g8: 'k' }), marks: J(M(['d4'], 'ring'), M(['d8'], 'bad')), arrows: [['d1', 'd8']] } },
       { t: 'say', text: '비키는 말도 다른 것을 공격하면 <b>두 군데를 한꺼번에</b> 노리게 돼요. 상대는 둘 다 막기 어려워요.', board: { pos: B({ d1: 'R', d4: 'N', d8: 'q', e1: 'K', g8: 'k' }) } }],
      '<b>디스커버드 공격</b>: 앞을 막던 내 말이 비키며 숨은 공격을 드러내요. 비키는 말도 무언가를 노리면 최고!'),
    tacLesson('tac-dischk', '디스커버드 체크', 'dischk',
      [{ t: 'say', text: '드러난 공격이 <b>흑 킹</b>을 향하면 <b>디스커버드 체크</b>예요. 흑은 체크부터 벗어나야 해서, 비킨 말이 무엇을 노리든 막을 수 없어요!', board: { pos: B({ e1: 'R', e4: 'N', e8: 'k', g1: 'K', a6: 'q' }), marks: J(M(['e4'], 'ring'), M(['e8'], 'bad')), arrows: [['e4', 'c5']] } },
       { t: 'say', text: '나이트 c5! 룩이 체크하고, 나이트는 a6의 퀸을 노려요. 흑 킹이 피하면 퀸을 잡아요.', board: { pos: B({ e1: 'R', c5: 'N', e8: 'k', g1: 'K', a6: 'q' }), marks: J(M(['e8'], 'bad'), M(['a6'], 'ring')) } }],
      '<b>디스커버드 체크</b>: 비킨 말 뒤에서 체크가 드러나요. 상대는 체크부터 막아야 해요.'),
    tacLesson('tac-dblchk', '더블 체크', 'dblchk',
      [{ t: 'say', text: '디스커버드 체크를 하면서 <b>비킨 말도 체크</b>를 주면 <b>더블 체크</b>! 4마당에서 배웠듯이 더블 체크는 막거나 잡을 수 없고 <b>킹이 피해야만</b> 해요.', board: { pos: B({ e1: 'R', e4: 'N', e8: 'k', g1: 'K' }), arrows: [['e4', 'd6']] } },
       { t: 'say', text: '나이트 d6: 나이트도 체크, 룩도 체크! 아주 무서운 전술이에요.', board: { pos: B({ e1: 'R', d6: 'N', e8: 'k', g1: 'K' }), marks: M(['e8'], 'bad') } }],
      '<b>더블 체크</b>: 두 말이 한꺼번에 체크. 킹이 피하는 수밖에 없어요.'),
    tacLesson('tac-remdef', '지키는 말 없애기', 'remdef',
      [{ t: 'say', text: '노리는 흑 말이 지켜지고 있으면? <b>지켜 주는 말을 먼저</b> 잡거나 쫓아내요. 그러면 노리던 말이 혼자가 돼요.', board: { pos: B({ e1: 'R', b5: 'B', e5: 'b', c6: 'n', b7: 'p', g1: 'K', g8: 'k' }), marks: J(M(['e5'], 'ring'), M(['c6'], 'bad')) } },
       { t: 'say', text: '비숍으로 c6의 나이트를 잡아요. 흑이 다시 잡아도(b7 폰) 이제 e5의 비숍을 지켜 줄 말이 없어서 룩이 잡아요.', board: { pos: B({ e1: 'R', b5: 'B', e5: 'b', c6: 'n', b7: 'p', g1: 'K', g8: 'k' }), arrows: [['b5', 'c6'], ['e1', 'e5']] } }],
      '<b>지키는 말 없애기</b>: 지킴이를 먼저 없애면 노리던 말이 혼자가 돼요.'),
    tacLesson('tac-decoy', '유인', 'decoy',
      [{ t: 'say', text: '<b>유인</b>: 내 말을 일부러 내주어 상대 말(특히 킹)을 <b>나쁜 칸으로 끌어내는</b> 전술이에요. 끌려 나온 다음에 포크나 메이트가 기다려요.', board: { pos: B({ g8: 'k', c7: 'q', f1: 'R', d4: 'N', g1: 'K', g7: 'p', h7: 'p' }), arrows: [['f1', 'f8']] } },
       { t: 'say', text: '룩 f8 체크! 흑 킹은 룩을 잡을 수밖에 없어요(f8). 그러면 나이트 e6 체크가 킹과 c7의 퀸을 한꺼번에 노려요. 룩(5)을 주고 퀸(9)을 얻어요!', board: { pos: B({ f8: 'k', c7: 'q', d4: 'N', g1: 'K', g7: 'p', h7: 'p' }), marks: J(M(['f8'], 'bad'), M(['c7'], 'ring')), arrows: [['d4', 'e6']] } }],
      '<b>유인</b>: 말을 내주어 상대를 나쁜 칸으로 끌어낸 뒤 포크·메이트를 해요.'),
    tacLesson('tac-overload', '과부하', 'overload',
      [{ t: 'say', text: '<b>과부하</b>: 흑 말 하나가 <b>두 가지를 혼자</b> 지키고 있으면, 하나를 잡게 해서 다른 하나를 못 지키게 해요.', board: { pos: B({ e8: 'r', e5: 'b', b8: 'n', g8: 'k', e1: 'R', b1: 'R', g1: 'K', f7: 'p', g7: 'p', h7: 'p' }), marks: J(M(['e8'], 'ring'), M(['e5', 'b8'], 'soft')) } },
       { t: 'say', text: '흑 룩 e8이 e5의 비숍과 b8의 나이트를 혼자 지켜요. 백 룩이 e5를 잡고, 흑 룩이 다시 잡으면 이제 b8을 못 지켜서 룩 b8 체크로 나이트를 얻어요.', board: { pos: B({ e8: 'r', e5: 'b', b8: 'n', g8: 'k', e1: 'R', b1: 'R', g1: 'K', f7: 'p', g7: 'p', h7: 'p' }), arrows: [['e1', 'e5'], ['b1', 'b8']] } }],
      '<b>과부하</b>: 두 가지를 혼자 지키는 말은 하나밖에 못 지켜요.'),
    tacLesson('tac-backrank', '백랭크 메이트', 'backrank',
      [{ t: 'say', text: '4마당에서 본 <b>백랭크 메이트</b>를 다시 봐요. 킹이 끝 줄에서 자기 폰에 갇혀 있으면, 룩이나 퀸이 끝 줄로 와서 메이트해요.', board: { pos: B({ g8: 'k', f7: 'p', g7: 'p', h7: 'p', a1: 'R', g1: 'K' }), marks: M(['g8'], 'ring'), arrows: [['a1', 'a8']] } },
       { t: 'say', text: '막는 흑 말이 있으면 먼저 그 말을 없애거나 끌어내요. 그리고 내 킹도 끝 줄에 갇히지 않게 폰 하나를 미리 밀어 두는 것이 좋아요(‘숨구멍’).', board: { pos: B({ g8: 'k', f7: 'p', g7: 'p', h6: 'p', a1: 'R', g1: 'K' }), marks: M(['h7'], 'ok') } }],
      '<b>백랭크 메이트</b>: 끝 줄에 갇힌 킹을 룩·퀸으로 메이트. 내 킹에는 숨구멍을!', 6),
    tacLesson('tac-smother', '스머더드 메이트', 'smother',
      [{ t: 'say', text: '<b>스머더드 메이트</b>(숨 막힌 메이트): 킹 둘레가 <b>자기 말들로 꽉 막혀</b> 있을 때 나이트가 체크하면, 피할 곳도 막을 방법도 없어요.', board: { pos: B({ h8: 'k', g8: 'r', g7: 'p', h7: 'p', g5: 'N', g1: 'K' }), marks: M(['h8'], 'ring'), arrows: [['g5', 'f7']] } },
       { t: 'say', text: '나이트 f7 메이트! 나이트 체크는 사이를 막을 수 없거든요.', board: { pos: B({ h8: 'k', g8: 'r', g7: 'p', h7: 'p', f7: 'N', g1: 'K' }), marks: M(['h8'], 'bad') } }],
      '<b>스머더드 메이트</b>: 자기 말에 둘러싸인 킹을 나이트로 메이트!', 6)
  ];
  /* ===== 26단원 ===== */
  function mate2Lesson(id, title, filter, says) {
    return { id: id, title: title, kind: 'deep', screens: says.concat([exFrom('mate2', '2수 메이트를 끝까지 봐요.'), { t: 'do', task: function (R) { return task('mate2', R); } }]),
      practice: { n: 6, gen: function (R) { return task('mate2', R); } }, sum: '2수 메이트: 첫 수로 <b>흑 킹의 도망길을 막고</b>, 다음 수에 메이트해요. 흑이 어떻게 받아도 메이트가 있어야 해요.' };
  }
  function midGame(lv) {
    return { type: 'game', kind: 'deep', unit: '말', state: CH.START, game: AI.game(lv, { goal: 'win', lim: 50, lead: 3 }), level: lv,
      q: '🤖 인공지능(' + lv + '단계)과 정식 대국! 전술을 노려 봐요. 50수까지 끝나지 않으면 말 값이 3점 이상 앞서야 이겨요.',
      winText: '이겼어요! 전술이 빛났어요. 🎉', loseTip: '상대의 포크·핀·디스커버드 공격도 조심해요. 내 킹과 퀸이 한 줄에 서 있지 않나요?',
      hint: ['포크·핀·스큐어를 노릴 수 있는 곳이 있나요?', '내 말이 혼자 있거나, 핀에 걸리지 않았나요?'] };
  }
  var u26 = [
    mate2Lesson('m2-1', '2수 메이트 ①', null, [{ t: 'say', text: '이제 <b>두 수 만에</b> 메이트하는 문제예요. 내가 한 수, 흑이 한 수, 그리고 내가 메이트! 첫 수가 체크가 아닐 수도 있어요.', board: { pos: B({ g8: 'k', f7: 'p', g7: 'p', h7: 'p', a1: 'R', b1: 'R', g1: 'K' }) } },
      { t: 'say', text: '첫 수를 찾을 때는 <b>“흑이 어떻게 받아도 다음에 메이트가 있나?”</b> 하고 흑의 대답을 모두 생각해요.', board: { pos: B({ g8: 'k', f7: 'p', g7: 'p', h7: 'p', a1: 'R', b1: 'R', g1: 'K' }) } }]),
    mate2Lesson('m2-2', '2수 메이트 ②', null, [{ t: 'say', text: '2수 메이트의 흔한 첫 수: ① 체크로 킹을 끝 줄로 몰기 ② 킹이 피할 칸을 막는 조용한 수 ③ 말을 내주는 유인.', board: { pos: E } }]),
    mate2Lesson('m2-3', '2수 메이트 ③', null, [{ t: 'say', text: '어려워도 괜찮아요. 💡 힌트를 보면 첫 수가 반짝여요. 왜 그 수인지 흑의 대답을 따라가 보며 생각해요.', board: { pos: E } }]),
    { id: 'mix-1', title: '전술 섞어 풀기 ①', kind: 'deep',
      screens: [{ t: 'say', text: '이제 어떤 전술인지 <b>알려 주지 않아요.</b> 판을 보고 스스로 찾아요. 차례로 물어봐요: 체크할 수 있나? 두 개를 한꺼번에 노릴 수 있나? 한 줄에 선 흑 말들이 있나? 혼자 있는 흑 말은?', board: { pos: E } },
        exFrom('nfork', '이런 순서로 찾아요.'), { t: 'do', task: function (R) { return task('mix', R); } }],
      practice: { n: 8, gen: function (R) { return task('mix', R); } }, sum: '전술 찾기 순서: <b>체크 → 두 곳 노리기 → 한 줄의 말 → 혼자 있는 말.</b>' },
    { id: 'mix-2', title: '전술 섞어 풀기 ②', kind: 'deep',
      screens: [{ t: 'say', text: '메이트 문제도 섞여 나와요. 이길 수 있는 가장 빠른 길을 찾아요!', board: { pos: E } }, exFrom('skewer', '스큐어도 다시 봐요.'), { t: 'do', task: function (R) { return task(R.int(4) ? 'mix' : 'mate2', R); } }],
      practice: { n: 8, gen: function (R) { return task(R.int(4) ? 'mix' : 'mate2', R); } }, sum: '전술은 <b>많이 풀어 볼수록</b> 빨리 보여요.' },
    { id: 'ai-mid', title: '인공지능과 대국 4~6단계', kind: 'deep',
      screens: [{ t: 'say', text: '배운 전술을 실제 대국에서 써 봐요! 이번 인공지능은 <b>4~6단계</b>로 실수가 거의 없어요. 상대의 전술도 조심해요.', board: { pos: CH.START.split(' ')[0] } },
        { t: 'say', text: '대국 중에는 늘 <b>내 킹·퀸이 한 줄에 서 있지 않은지</b>(스큐어·핀), <b>나이트가 노리는 칸</b>(포크)은 없는지 살펴요.', board: { pos: CH.START.split(' ')[0] } },
        { t: 'ex', text: '대국 속 전술', board: { pos: CH.START.split(' ')[0] }, frames: [{ mv: ['e2', 'e4'], cap: '1. e4' }, { mv: ['e7', 'e5'], cap: '…e5' }, { mv: ['g1', 'f3'], cap: '2. Nf3' }, { mv: ['d7', 'd6'], cap: '…d6' }, { mv: ['f1', 'c4'], cap: '3. Bc4' }, { mv: ['c8', 'g4'], cap: '…Bg4 (f3 나이트를 퀸 앞에 핀!)' }, { mv: ['b1', 'c3'], cap: '4. Nc3' }, { mv: ['g7', 'g6'], marks: M(['g4', 'd1'], 'ring'), cap: '…g6? 이제 백에게 전술이 있어요: Nxe5! (핀은 상대 핀이라 나이트가 움직일 수 있어요)' }] },
        { t: 'do', task: midGame(4) }],
      practice: { n: 6, gen: function (R) { return R.int(2) ? midGame(R.pick([4, 5, 6])) : task('mix', R); } }, sum: '대국에서는 <b>내 전술도, 상대 전술도</b> 늘 살펴요.' }
  ];
  window.MADANG = { id: 'm5', no: 5, title: '전술', rank: '퀸', rankPc: 'Q', examN: 15,
    units: [{ title: '전술', lessons: u25 }, { title: '메이트와 실전', lessons: u26 }] };
})();
