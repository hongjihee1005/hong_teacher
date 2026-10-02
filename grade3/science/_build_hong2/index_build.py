#!/usr/bin/env python3
"""../sem2-hong/index.html 목록 만들기 (사회 선생님 버전 목록과 같은 모양)
lessons_u*.py 를 읽어 단원별 카드(SOOP 단계·사고전략)를 만들고, 아직 없는 단원은 '준비 중'으로 둡니다."""
import os, re, sys, glob, importlib, html
B = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, B)
SRC = os.path.join(B, '..', '..', 'social', 'sem1-hong', 'index.html')
s = open(SRC, encoding='utf-8').read()
head = s[:s.find('<body')]
head = re.sub(r'<title>.*?</title>', '<title>3학년 2학기 과학 · 홍지희 선생님 버전</title>', head, flags=re.S)
_tail = s[s.find('</main>'):]
_tail = _tail.split('<!--hj-theme-js-->')[0]  # 메뉴 덮개 스크립트는 apply_theme.py가 따로 넣으므로 빼야 두 번 들어가지 않음
scripts = ''.join(re.findall(r'<script>.*?</script>', _tail, re.S))
SO = {'S': ('S 개념 찾기', '#E0506B'), 'O1': ('O 개념 구축', '#2F74E0'), 'O2': ('O 탐구 정리', '#6A4FC9'), 'P': ('P 발표', '#1F9E63')}
RN = {'see': '보기-생각-궁금', 'sort': '분류', 'define': '우리 반 결론', 'cards': '자료 살펴보기', 'csq': '주장-근거-질문', 'venn': '같은 점·다른 점',
      'cse': '연결-확장-도전', 'iuti': '예전-지금 생각', 'task': '활동', 'check': '개념 확인', 'talk': '생각 나누기',
      'pred': '예상하기', 'lab': '실험·기록', 'pvr': '예상과 결과 비교', 'design': '실험 설계', 'pgrid': '예상 표', 'board': '우리 반 자료판', 'gcmp': '예상과 결과 비교', 'claim': '근거로 결론'}
UNITS = [(1, '1단원 물체와 물질'), (2, '2단원 지구와 바다'), (3, '3단원 소리의 성질'), (4, '4단원 감염병과 건강한 생활')]
e = html.escape
groups, btns, total = [], ['<button type="button" class="ubtn" data-u="0" aria-pressed="true">전체</button>'], 0
for n, name in UNITS:
    btns.append(f'<button type="button" class="ubtn" data-u="{n}" aria-pressed="false">{e(name)}</button>')
    p = os.path.join(B, f'lessons_u{n}.py')
    if not os.path.exists(p):
        groups.append(f'<div class="ugrp" data-u="{n}"><h3 class="unit">{e(name)} <small>준비 중</small></h3><p class="gsub">곧 열려요. 지금은 <a href="../sem2/index.html">2학기 교과서 버전</a>의 탐구 앱을 써 주세요.</p></div>')
        continue
    M = importlib.import_module(f'lessons_u{n}')
    cards = []
    for L in M.LESSONS:
        so, col = SO[L['soop']]
        seen = []
        for st in L['steps']:
            r = RN.get(st['k'])
            if r and r not in seen:
                seen.append(r)
        cards.append(f'<a class="card" href="{L["file"]}"><span class="tag" style="background:{col}">{so} · {e(L["short"])}</span><span class="nm">{e(L["title"])}</span><span class="de">{" · ".join(seen)}</span></a>')
    total += len(cards)
    groups.append(f'<div class="ugrp" data-u="{n}"><h3 class="unit">{e(name)} <small>{len(cards)}개</small></h3><p class="bqx"><small>🌟 핵심 질문</small>{e(M.TOPIC["bq"])}</p><div class="grid">\n' + '\n'.join(cards) + '\n</div></div>')

body = f'''<body><main>
<nav class="crumb"><a class="back" href="../../../index.html">🏠 초등교사 홍지희</a><a class="back" href="../../index.html">🚀 3학년</a><a class="back" href="../index.html">🔬 과학방</a><a class="back" href="index.html">🧑‍🏫 2학기 · 홍지희 선생님 버전</a></nav>
<h1>🧑‍🏫 홍지희 선생님 버전</h1>
<p class="sub"><b>3학년 2학기 과학</b> · 실험·탐구 중심으로 다시 짠 수업이에요. 아이들이 실험 방법과 같게 할 것을 먼저 정하고, 예상하고, 실험한 결과를 우리 반 자료판에 모아 그 자료를 근거로 결론을 쓴 뒤 교과서 문장과 비교해요.</p>
<nav class="tabs" role="tablist" aria-label="자료 종류"><a class="tab" role="tab" href="#lesson" data-pane="lesson">📖 차시별 탐구 수업<span class="cnt">{total}</span></a><a class="tab" role="tab" href="#how" data-pane="how">💡 쓰는 방법</a></nav>
<section class="pane" id="lesson" role="tabpanel">
<h2>📖 차시별 탐구 수업</h2><p class="gsub">단원마다 핵심 질문 하나를 붙잡고 S → O → O → P 순서로 탐구해요. 카드 아래에 그 차시의 탐구 단계와 사고전략이 적혀 있어요. (단원 도입 ‘열려라 과학’과 ‘과학이 톡톡’은 넣지 않았어요)</p><div class="legend"><span style="background:#E0506B">S 개념 찾기</span><span style="background:#2F74E0">O 개념 구축</span><span style="background:#6A4FC9">O 탐구 정리</span><span style="background:#1F9E63">P 발표</span></div><div class="subtabs" role="group" aria-label="단원 고르기">{''.join(btns)}</div>{''.join(groups)}
</section>
<section class="pane" id="how" role="tabpanel">
<h2>💡 쓰는 방법</h2>
<div class="verify" style="margin-top:6px;font-size:clamp(17px,1.7vw,21px);color:var(--ink)">
<p>• 실험하는 차시는 <b>🧭 실험 설계 → 🔮 예상 표 → 🧪 실험하기 → 📊 우리 반 자료판 → ⚖️ 예상과 결과 비교 → ✍️ 근거로 결론 → 📖 교과서 문장과 비교</b> 순서예요. 예상 표와 모둠 결과가 비교·결론 단계에 자동으로 이어져요.</p><p>• <b>📊 우리 반 자료판</b>: 모둠마다 결과를 누르면 반 전체 표가 모여요. 모둠마다 결과가 다른 칸에는 ⚠️가 붙어요. 그 칸이 이야기할 거리예요.</p>
<p>• 실험은 <b>실제 실험</b>이 중심이에요. 준비물이 없거나 다시 볼 때만 실험 화면의 <b>🖥️ 가상 실험실 열기</b>(교과서 버전 앱)를 눌러요.</p>
<p>• <b>💬 질문 판</b>: 아이들이 만든 질문을 모으고, 실험 결과와 자료를 근거로 답을 찾아 ❓ 궁금해요 → 🔎 찾는 중 → ✅ 답 찾음으로 바꿔요. 한 단원의 모든 차시가 같은 질문 판을 써요. 단원 핵심 질문은 처음부터 올라가 있어요.</p>
<p>• 붙임쪽지·기록표·질문 판은 <b>이 기기(교실 화면)</b>에 저장돼요. 같은 컴퓨터, 같은 브라우저로 열어야 다음 차시로 이어져요.</p>
<p>• <b>🎲 발표자</b>는 번호가 겹치지 않게 뽑아요. <b>⏱</b>는 그 단계 시간을 재요. 왼쪽 아래 <b>👩‍🏫 교사 안내</b>에 발문, 예상 반응, 지도서 근거, 안전 유의점, 차시 평가, 성취기준, 단원 지도상의 유의점이 있어요.</p>
<p>• 예상·느낌·설계는 점수를 매기지 않고, 교과서 사실만 확인 문제로 채점해요.</p>
</div>
<div class="verify">
<p><b>모든 차시를 만든 사람과 다른 검토자가 교사용 지도서(교과서 축소본 포함)와 차시 하나씩 대조했습니다.</b> 정답·한눈에 쏙·평가 문항의 근거와 단원 지도상의 유의점, 그리고 실험 전에 답이 먼저 보이지 않는지를 확인했습니다.</p>
<p>사진은 위키미디어 공용의 자유 이용 자료만 넣고 화면에 출처를 표기했습니다. 차시마다 한 화면씩 넘기는 탐구 앱은 <a href="../sem2/index.html">2학기 교과서 버전</a>에 있습니다.</p>
</div>
</section>
<footer class="hjfoot"><p>2022 개정 교육과정, 지도서, 교과서를 바탕으로 만든 학습 자료입니다.</p><p>만든 사람: 초등교사 홍지희</p></footer></main>{scripts}
</body></html>
'''
open(os.path.join(B, '..', 'sem2-hong', 'index.html'), 'w', encoding='utf-8').write(head + body)
print('목록 만듦: 차시', total)
