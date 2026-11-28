/* 수학 방탈출 함께하는 친구(2026-11-28 선생님: '다른 캐릭터도 나와서 같이 방탈출을 하는 느낌') — 30방 모두 같은 둘.
   토리(tori): 호기심 많은 아기 다람쥐 탐험가 — 초록 목수건·작은 배낭·돋보기.  모모(momo): 꼼꼼한 작은 로봇 — 둥근 머리·안테나·화면 얼굴.
   이 자료에서 직접 그린 SVG(이모지·바깥 그림 없음). CAST.face(누구, 표정) 얼굴만 / CAST.full(누구, 표정) 몸 전체.
   표정: 'base'(기본) · 'wow'(놀람) · 'joy'(기쁨). 입은 class "cm-m"(말할 때 CSS가 움직임). */
var CAST = (function () {
  var NM = { tori: '토리', momo: '모모', nar: '' };
  var INK = '#4A2A14';
  /* B안(그림책 삽화, 2026-11-28): 납작한 색을 ART.fx 그러데이션으로 바꿈 — 털빛(왼쪽 위가 밝음)·금속 광택·화면 유리, 테두리는 같은 계열 어두운 색.
     ART.fx가 없으면(다른 쪽에서 쓸 때) 예전 납작한 색 그대로 */
  function B(s) {
    var F = typeof ART !== 'undefined' && ART.fx;
    if (!F) return s.replace(/<[^>]*fill="@[A-Z]+"[^>]*\/>/g, '');
    var G = {
      VOL: F.rad([[.55, '#3A1A08', 0], [1, '#3A1A08', .36]], .5, .5, .5, .32, .28), VOLM: F.rad([[.5, '#1A2A48', 0], [1, '#1A2A48', .3]], .5, .5, .55, .3, .25),
      GND: F.rad([[0, '#2A140A', .35], [1, '#2A140A', 0]])
    };
    return s.replace(/fill="@([A-Z]+)"/g, function (a, k) { return 'fill="' + G[k] + '"' })
      .replace(/fill="#C8743A"/g, 'fill="' + F.rad([[0, '#F0A866'], [.55, '#C8743A'], [1, '#8E4A1E']], .5, .5, .6, .3, .25) + '"')
      .replace(/fill="#B5652E"/g, 'fill="' + F.rad([[0, '#E39A5A'], [.6, '#B5652E'], [1, '#7A3E16']], .5, .5, .6, .3, .3) + '"')
      .replace(/fill="#A65A26"/g, 'fill="' + F.lin([[0, '#C0743A'], [1, '#7E4018']]) + '"')
      .replace(/fill="#F7E6C8"/g, 'fill="' + F.rad([[0, '#FFF8EA'], [1, '#E9CFA4']], .5, .4, .6) + '"')
      .replace(/fill="#3F9A5B"/g, 'fill="' + F.lin([[0, '#5DBB7A'], [1, '#2D7A47']]) + '"').replace(/fill="#4C8F5E"/g, 'fill="' + F.lin([[0, '#5FA872'], [1, '#2F6B42']]) + '"')
      .replace(/fill="#DCEAF5"/g, 'fill="' + F.rad([[0, '#FFFFFF'], [.45, '#DCEAF5'], [1, '#93A9BF']], .5, .5, .65, .3, .25) + '"')
      .replace(/fill="#1F2C46"/g, 'fill="' + F.lin([[0, '#2D3F62'], [1, '#121B2E']]) + '"')
      .replace(/fill="#8FA8C0"/g, 'fill="' + F.lin([[0, '#B7C9DA'], [1, '#6F86A0']], 0, 0, 1, 1) + '"')
      .replace(/fill="#FFD54A" stroke/g, 'fill="' + F.ball('#FFD54A') + '" stroke')
      .replace(/stroke="#4A2A14"/g, 'stroke="#6B3A1C"').replace(/stroke="#2E3D55"/g, 'stroke="#46566E"');
  }
  function toriHead(m) {
    var o = '';
    /* 귀(끝에 털 뭉치) */
    o += '<path d="M23 38 L17 9 Q26 8 42 26Z" fill="#C8743A" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M25 32 L22 15 Q28 15 36 26Z" fill="#F2A98F"/>';
    o += '<path d="M77 38 L83 9 Q74 8 58 26Z" fill="#C8743A" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M75 32 L78 15 Q72 15 64 26Z" fill="#F2A98F"/>';
    o += '<path d="M17 9 Q14 3 19 1 Q19 6 22 8Z M83 9 Q86 3 81 1 Q81 6 78 8Z" fill="#8E4A1E"/>';
    /* 머리 · 얼굴 밝은 부분 */
    o += '<ellipse cx="50" cy="55" rx="34" ry="30" fill="#C8743A" stroke="' + INK + '" stroke-width="3"/>' + '<ellipse cx="50" cy="55" rx="34" ry="30" fill="@VOL"/>';
    o += '<g fill="none" stroke="#8E4A1E" stroke-opacity=".45" stroke-width="1.2" stroke-linecap="round"><path d="M18 52l-4 2M19 59l-4 2M82 52l4 2M81 59l4 2M30 33l-2 -3M70 33l2 -3"/></g><path d="M26 42Q36 30 50 29" fill="none" stroke="#FFE0B8" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>';
    o += '<path d="M50 34 Q44 40 46 46 M50 34 Q56 40 54 46" fill="none" stroke="#A65A26" stroke-width="2.4" stroke-linecap="round"/>';
    o += '<ellipse cx="50" cy="68" rx="21" ry="15" fill="#F7E6C8"/>';
    /* 눈 */
    if (m === 'joy') o += '<path d="M30 54 Q37 45 44 54 M56 54 Q63 45 70 54" fill="none" stroke="#2B1A10" stroke-width="3.6" stroke-linecap="round"/>';
    else {
      var ry = m === 'wow' ? 9 : 7.2, rx = m === 'wow' ? 7 : 5.8;
      o += '<ellipse cx="37" cy="52" rx="' + rx + '" ry="' + ry + '" fill="#2B1A10"/><ellipse cx="63" cy="52" rx="' + rx + '" ry="' + ry + '" fill="#2B1A10"/>';
      o += '<circle cx="39.5" cy="48.5" r="2.4" fill="#fff"/><circle cx="65.5" cy="48.5" r="2.4" fill="#fff"/><circle cx="35.5" cy="55.5" r="1.1" fill="#fff"/><circle cx="61.5" cy="55.5" r="1.1" fill="#fff"/>';
      if (m === 'wow') o += '<path d="M29 38 Q36 33 43 37 M57 37 Q64 33 71 38" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
    }
    /* 볼 · 코 · 입 */
    o += '<ellipse cx="25" cy="64" rx="6" ry="4.2" fill="#F08C7E" opacity=".75"/><ellipse cx="75" cy="64" rx="6" ry="4.2" fill="#F08C7E" opacity=".75"/>';
    o += '<path d="M46 60 Q50 57 54 60 Q50 65 46 60Z" fill="' + INK + '"/>';
    if (m === 'wow') o += '<ellipse class="cm-m" cx="50" cy="72" rx="4.2" ry="5.2" fill="#7A2E22" stroke="' + INK + '" stroke-width="1.6"/>';
    else if (m === 'joy') o += '<path class="cm-m" d="M41 66 Q50 80 59 66Z" fill="#7A2E22" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><rect x="47" y="66" width="6" height="4" rx="1" fill="#fff"/>';
    else o += '<g class="cm-m"><path d="M43 66 Q46.5 70 50 66 Q53.5 70 57 66" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/><rect x="47.4" y="66.6" width="5.2" height="4" rx="1" fill="#fff" stroke="' + INK + '" stroke-width="1"/></g>';
    /* 초록 탐험 목수건 */
    o += '<path d="M24 80 Q50 93 76 80 L74 90 Q50 101 26 90Z" fill="#3F9A5B" stroke="#245E37" stroke-width="2.4" stroke-linejoin="round"/><path d="M60 89 L68 99 L56 96Z" fill="#3F9A5B" stroke="#245E37" stroke-width="2" stroke-linejoin="round"/>';
    return o;
  }
  function momoHead(m) {
    var E = '#7DF3E1', o = '';
    o += '<line x1="50" y1="22" x2="50" y2="9" stroke="#2E3D55" stroke-width="3"/><circle cx="50" cy="7" r="5.5" fill="#FFD54A" stroke="#2E3D55" stroke-width="2.4"/>';
    o += '<rect x="7" y="44" width="12" height="20" rx="5" fill="#8FA8C0" stroke="#2E3D55" stroke-width="2.4"/><rect x="81" y="44" width="12" height="20" rx="5" fill="#8FA8C0" stroke="#2E3D55" stroke-width="2.4"/>';
    o += '<rect x="15" y="21" width="70" height="62" rx="28" fill="#DCEAF5" stroke="#2E3D55" stroke-width="3"/><rect x="15" y="21" width="70" height="62" rx="28" fill="@VOLM"/>';
    o += '<path d="M24 34 Q30 26 40 25" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>';
    o += '<rect x="25" y="33" width="50" height="38" rx="13" fill="#1F2C46" stroke="#2E3D55" stroke-width="2"/>';
    if (m === 'joy') o += '<path d="M33 52 Q39 43 45 52 M55 52 Q61 43 67 52" fill="none" stroke="' + E + '" stroke-width="3.6" stroke-linecap="round"/>';
    else if (m === 'wow') o += '<circle cx="39" cy="48" r="6.5" fill="none" stroke="' + E + '" stroke-width="3.2"/><circle cx="61" cy="48" r="6.5" fill="none" stroke="' + E + '" stroke-width="3.2"/><circle cx="39" cy="48" r="2.2" fill="' + E + '"/><circle cx="61" cy="48" r="2.2" fill="' + E + '"/>';
    else o += '<rect x="34.5" y="42" width="8" height="12" rx="4" fill="' + E + '"/><rect x="57.5" y="42" width="8" height="12" rx="4" fill="' + E + '"/>';
    o += '<ellipse cx="31" cy="61" rx="3" ry="2" fill="#FF8FB1" opacity=".85"/><ellipse cx="69" cy="61" rx="3" ry="2" fill="#FF8FB1" opacity=".85"/>';
    if (m === 'wow') o += '<circle class="cm-m" cx="50" cy="62" r="3.4" fill="none" stroke="' + E + '" stroke-width="2.6"/>';
    else if (m === 'joy') o += '<path class="cm-m" d="M42 59 Q50 68 58 59" fill="none" stroke="' + E + '" stroke-width="3" stroke-linecap="round"/>';
    else o += '<path class="cm-m" d="M44 61 Q50 64.5 56 61" fill="none" stroke="' + E + '" stroke-width="2.8" stroke-linecap="round"/>';
    o += '<rect x="40" y="83" width="20" height="7" rx="2" fill="#8FA8C0" stroke="#2E3D55" stroke-width="2"/>';
    o += '<path d="M29 35L45 35L34 69L28 69Z" fill="#fff" opacity=".12"/><path d="M50 35L56 35L45 69L39 69Z" fill="#fff" opacity=".07"/>';   /* 화면 유리 반사 */
    return o;
  }
  function face(who, m, cls, at) {
    var inner = who === 'momo' ? momoHead(m) : toriHead(m);
    if (who === 'tori') inner = '<path d="M74 96 C98 92 104 56 90 38 C83 30 73 34 79 43 C87 55 84 74 70 84Z" fill="#B5652E" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' + inner;
    return '<svg ' + (at || '') + ' class="cs-face ' + (cls || '') + '" viewBox="-2 -2 104 104" role="img" aria-label="' + NM[who] + '">' + B(inner) + '</svg>';
  }
  function full(who, m, cls, at) {
    var o = '';
    if (who === 'tori') {
      /* 큰 꼬리 · 배낭 · 몸 · 돋보기 */
      o += '<path d="M80 150 C122 150 132 96 112 64 C100 46 82 54 90 70 C102 92 96 122 74 132Z" fill="#B5652E" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>';
      o += '<path d="M94 74 C104 90 102 112 90 126" fill="none" stroke="#8E4A1E" stroke-width="2.4" stroke-linecap="round"/><path d="M84 148 C120 148 128 98 110 68" fill="none" stroke="#5A2A0C" stroke-opacity=".22" stroke-width="6" stroke-linecap="round"/><g fill="none" stroke="#7A3E16" stroke-opacity=".4" stroke-width="1.2" stroke-linecap="round"><path d="M112 80l5 -2M117 96l5 0M114 112l5 2M104 128l4 3M100 66l2 -4"/></g><path d="M98 62 Q108 64 112 74" fill="none" stroke="#F3BE8A" stroke-opacity=".6" stroke-width="2.4" stroke-linecap="round"/>';
      o += '<rect x="18" y="98" width="22" height="34" rx="7" fill="#4C8F5E" stroke="#245E37" stroke-width="2.6"/><rect x="18" y="98" width="22" height="12" rx="6" fill="#5FAE73" stroke="#245E37" stroke-width="2.4"/>';
      o += '<ellipse cx="58" cy="122" rx="24" ry="26" fill="#C8743A" stroke="' + INK + '" stroke-width="3"/><ellipse cx="58" cy="122" rx="24" ry="26" fill="@VOL"/><ellipse cx="58" cy="127" rx="14" ry="17" fill="#F7E6C8"/><g fill="none" stroke="#8E4A1E" stroke-opacity=".4" stroke-width="1.1" stroke-linecap="round"><path d="M35 118l-4 1M36 126l-4 2M81 118l4 1M80 126l4 2"/></g>';
      o += '<path d="M40 104 L50 132" stroke="#245E37" stroke-width="4" stroke-linecap="round"/>';
      o += '<ellipse cx="46" cy="148" rx="9" ry="5" fill="#A65A26" stroke="' + INK + '" stroke-width="2.4"/><ellipse cx="70" cy="148" rx="9" ry="5" fill="#A65A26" stroke="' + INK + '" stroke-width="2.4"/>';
      o += '<path d="M76 116 Q86 110 88 100" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/><path d="M76 116 Q86 110 88 100" fill="none" stroke="#C8743A" stroke-width="5" stroke-linecap="round"/>';
      o += '<line x1="90" y1="98" x2="98" y2="84" stroke="#6B4A2A" stroke-width="5" stroke-linecap="round"/><circle cx="104" cy="74" r="12" fill="#CFEFFF" fill-opacity=".7" stroke="#3A2C22" stroke-width="4"/><path d="M98 70 Q101 66 106 66" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>';
      o += '<g transform="translate(8 2) scale(1)">' + toriHead(m) + '</g>';
      return '<svg ' + (at || '') + ' class="cs-full ' + (cls || '') + '" viewBox="0 -4 132 160" role="img" aria-label="토리">' + B('<ellipse cx="62" cy="152" rx="46" ry="6" fill="@GND"/>' + o) + '</svg>';
    }
    o += '<rect x="30" y="96" width="60" height="44" rx="16" fill="#DCEAF5" stroke="#2E3D55" stroke-width="3"/><rect x="30" y="96" width="60" height="44" rx="16" fill="@VOLM"/><path d="M40 101Q55 97 70 99" stroke="#fff" stroke-opacity=".85" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    o += '<rect x="42" y="106" width="36" height="20" rx="6" fill="#1F2C46"/><circle cx="51" cy="116" r="3.4" fill="#FF8FB1"/><circle cx="60" cy="116" r="3.4" fill="#FFD54A"/><circle cx="69" cy="116" r="3.4" fill="#7DF3E1"/>';
    o += '<path d="M30 110 Q18 112 14 100" fill="none" stroke="#2E3D55" stroke-width="7" stroke-linecap="round"/><path d="M30 110 Q18 112 14 100" fill="none" stroke="#8FA8C0" stroke-width="3.6" stroke-linecap="round"/><circle cx="13" cy="97" r="6" fill="#DCEAF5" stroke="#2E3D55" stroke-width="2.6"/>';
    o += '<path d="M90 110 Q102 112 106 100" fill="none" stroke="#2E3D55" stroke-width="7" stroke-linecap="round"/><path d="M90 110 Q102 112 106 100" fill="none" stroke="#8FA8C0" stroke-width="3.6" stroke-linecap="round"/><circle cx="107" cy="97" r="6" fill="#DCEAF5" stroke="#2E3D55" stroke-width="2.6"/>';
    o += '<rect x="36" y="139" width="18" height="12" rx="6" fill="#2E3D55"/><rect x="66" y="139" width="18" height="12" rx="6" fill="#2E3D55"/>';
    o += '<g transform="translate(10 4)">' + momoHead(m) + '</g>';
    return '<svg ' + (at || '') + ' class="cs-full ' + (cls || '') + '" viewBox="0 -4 120 160" role="img" aria-label="모모">' + B('<ellipse cx="60" cy="152" rx="40" ry="6" fill="@GND"/>' + o) + '</svg>';
  }
  return { face: face, full: full, NM: NM };
})();
