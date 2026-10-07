#!/usr/bin/env python3
"""기타 › 수학게임 › 우리 반 그래프 페이지 만들기 (2026-10-07)

    python3 _build/classgraph/build.py          # project/classgraph/survey.html · graph.html · sheet.html
    python3 _build/classgraph/build.py check

화면 틀은 수학 교구실의 page.css·shell.js를 같이 쓰고(page.html은 이 폴더), 쪽마다 <id>.js(window.TOOL)·<id>.css, 공통 자료 common.js(localStorage hj-cgraph-v1).
메뉴 project/classgraph/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'classgraph'
ACC = '#2B8C9E'
PAGES = [
 dict(id='survey', title='우리 반 설문하기', ico='🗳️', desc='질문과 보기를 정하고, 학생이 한 명씩 나와 단추를 눌러 답해요. 다 모으면 바로 그래프로 보내요.',
      rec='어울리는 때: 2~6학년 · 자료와 가능성(자료를 모으기)',
      how=['<b>질문</b>과 <b>보기</b>(쉼표로 나눠 2~8개)를 쓰고 ‘보기 바꾸기’를 눌러요.', '학생이 앞에 나와 자기 답의 큰 단추를 한 번 눌러요. 잘못 누르면 ‘한 표 되돌리기’.', '‘결과 숨기기’를 켜면 수가 ?로 보여 친구 선택에 끌리지 않아요.', '다 모으면 <b>📊 그래프로 보내기</b> → 그래프 만들기 쪽에 표가 채워져요. 설문은 이 기기에만 저장돼요.'],
      ideas=['“좋아하는 급식 반찬은?” 설문 → 막대그래프 → 가장 많은 것과 적은 것의 차 구하기.', '결과를 숨긴 채 설문하고, 공개하기 전에 결과를 예상해 보기.', '모둠별로 질문을 정해 설문하고 발표하기.']),
 dict(id='graph', title='그래프 만들기', ico='📊', desc='표에 항목과 수를 쓰면 그림그래프·막대그래프·꺾은선그래프·띠그래프·원그래프와 합계·평균이 바로 나와요.',
      rec='교과서에서 주로 배우는 때(참고): 그림그래프 3학년 · 막대·꺾은선그래프 4학년 · 평균 5학년 · 띠·원그래프 6학년',
      how=['왼쪽 표에 <b>제목·단위·항목과 수</b>를 써요(12개까지). 예시 자료를 골라 시작해도 돼요.', '위의 단추로 <b>그래프 종류</b>를 바꿔요. 같은 자료를 여러 그래프로 견줘 보세요.', '그림그래프는 ‘그림 하나가’ 10·5·2를 골라요. 띠·원그래프의 백분율은 반올림해도 합이 100%가 되게 맞춰요.', '아래에 합계·가장 많은 것·가장 적은 것·<b>평균</b>(합계 ÷ 항목 수)이 나와요. 🖨️로 그래프만 인쇄해요.'],
      ideas=['같은 자료를 막대그래프와 원그래프로 보고, 어떤 것을 알기에 어느 그래프가 좋은지 이야기하기.', '‘수 보이기’를 끄고 눈금을 읽어 수 맞히기.', '모둠별 읽은 책 수로 평균을 구하고, 평균보다 많은 모둠 찾기.', '교실 온도처럼 시간에 따라 변하는 자료는 꺾은선그래프로.']),
 dict(id='sheet', title='빈 그래프 활동지', ico='📄', desc='표와 빈 막대·꺾은선·그림·띠·원그래프 칸을 인쇄해 손으로 그려요.',
      rec='어울리는 때: 3~6학년 · 자료와 가능성(표와 그래프 그리기)',
      how=['그래프 종류, 항목 수, 세로 눈금 칸 수를 골라요.', '‘그래프 만들기의 자료 넣기’를 켜면 표에 우리 반 자료가 미리 들어가요.', '🖨️ 활동지 인쇄 — A4 한 장, 맨 아래는 ‘알 수 있는 것’ 쓰는 줄.'],
      ideas=['설문 결과를 활동지에 직접 그려 보고 화면의 그래프와 맞는지 확인하기.', '세로 눈금 한 칸을 1·2·5로 바꿔 그려 보며 눈금 정하기 연습.']),
]

def build(p):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is p else '') + f'>{x["title"]}</a>' for x in PAGES)
    rep = {'TITLE': p['title'], 'DESC': p['desc'], 'ICO': p['ico'], 'REC': p['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in p['how']) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in p['ideas']),
           'DATA': json.dumps({'id': p['id']}), 'TOOL': rd(HERE / 'common.js') + rd(HERE / f"{p['id']}.js"), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', ACC).replace('{TOOLCSS}', rd(HERE / f"{p['id']}.css") + (rd(HERE / 'graph.css').split('@page')[0] if p['id'] == 'survey' else '')),
           'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '우리 반 자료로 표와 그래프를 만드는 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{p['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

def check():
    bad = []
    for p in PAGES:
        for f in (f"{p['id']}.js", f"{p['id']}.css"):
            if not (HERE / f).exists(): bad.append(f'{f} 없음')
        if 'window.TOOL = function' not in (HERE / f"{p['id']}.js").read_text(encoding='utf-8'): bad.append(f"{p['id']}.js: TOOL 없음")
    return bad

if __name__ == '__main__':
    bad = check()
    if bad: print('\n'.join(bad)); sys.exit('우리 반 그래프 점검 실패')
    print('우리 반 그래프 점검 통과')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(p) for p in PAGES)
    print(f'우리 반 그래프 {n}쪽 다시 만듦 (모두 {len(PAGES)}쪽)')
