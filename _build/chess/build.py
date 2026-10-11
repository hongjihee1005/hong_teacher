#!/usr/bin/env python3
"""특색교육 › 체스 학습관 (2026-10-11)

    python3 _build/chess/build.py          # special/chess/m1.html … (마당마다 한 쪽)
    python3 _build/chess/build.py check    # 점검만(node check.js)

규칙 rules.js(window.CH, perft 점검) · 말 그림 pieces.js · 판 그리기 board.js · 학습 틀 learn.js · 마당 내용 m1.js …
화면 틀 page.html, 모양 chess.css(+ 수학 교구실 page.css). 메뉴 special/chess/index.html(과 특색교육 메뉴 special/index.html)은 손으로 고치는 메뉴(apply_theme.py).
계획·현황은 PLAN.md. 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import json, re, sys, pathlib, subprocess
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'special' / 'chess'

MADANG = [  # (번호, 파일, 제목, 설명) — 원본 파일이 있는 마당만 만듦
    (1, 'm1', '1마당 · 체스판과 체스말', '체스판의 칸과 줄, 칸 이름, 여섯 가지 체스말의 이름과 모양, 처음 배치를 23차시로 차근차근 배워요.'),
    (2, 'm2', '2마당 · 말이 움직이는 법', '룩·비숍·퀸·킹·나이트·폰이 움직이는 길과 막히는 곳을 34차시로 배우고, 별 모으기와 폰 전쟁으로 연습해요.'),
    (3, 'm3', '3마당 · 잡기와 지키기', '말로 상대 말을 잡는 법, 공격과 지킴, 말의 값과 교환, 위험한 말 구하기를 29차시로 배우고, 인공지능과 작은 대결을 해요.'),
    (4, 'm4', '4마당 · 체크와 체크메이트', '체크와 체크 벗어나기, 체크메이트와 스테일메이트, 캐슬링·프로모션·앙파상, 기본 메이트를 40차시로 배우고, 인공지능과 첫 정식 대국을 해요.'),
    (5, 'm5', '5마당 · 전술', '포크·핀·스큐어·디스커버드 공격·더블 체크·지키는 말 없애기·유인·과부하·백랭크·스머더드 메이트, 2수 메이트를 22차시로 풀고, 인공지능 4~6단계와 대국해요.'),
    (6, 'm6', '6마당 · 경기 운영', '기보 읽고 쓰기, 오프닝 원칙과 이름난 오프닝, 중반 계획, 엔드게임(정사각형 규칙·오포지션·패스트 폰), 비기는 규칙, 대국 예절을 27차시로 배우고, 인공지능 7~10단계와 대국해요.'),
]
HOW = [
    '학생은 1차시부터 차례대로 배우면 좋아요. 어느 차시·단계든 골라 들어갈 수 있지만, 완료 표시(★)는 그 차시의 연습까지 마쳐야 생겨요. 별과 진도는 <b>이 기기</b>에만 저장돼요(다른 기기와 나누지 않아요).',
    '차시마다 📖 설명 → 👀 예시(움직이는 보기) → 👆 따라 하기 → ✏️ 연습(할 때마다 새 문제) → ⭐ 마무리 차례예요. 연습을 한 번에 많이 맞힐수록 별이 많아요.',
    '틀리면 처음엔 실마리와 틀린 까닭을, 두 번째엔 정답을 보여 주고 비슷한 문제를 하나 더 내요.',
    '아무것도 누르지 않고 있으면 힌트가 저절로 나와요(쉬운 문제 10초씩, 한 수 생각 15초씩, 깊은 생각 20초씩). 화면을 누르면 시간을 처음부터 다시 세요. ⚙️ 선생님 설정에서 빠르게·느긋하게·끄기를 고를 수 있어요.',
    '🔊 읽어 주기는 브라우저의 한국어 음성이라 기기마다 목소리가 달라요. 켜져 있으면 읽기가 끝난 뒤부터 힌트 시간을 세요.',
    '모든 차시를 마치면 확인 시험(15문제, 힌트 없음)을 볼 수 있고, 12문제 이상 맞히면 등급과 수료증(인쇄)을 받아요.',
    '주소 끝에 <code>#l5</code>처럼 붙이면 5차시가 바로 열려요. 문제를 맞히면 저절로 다음 화면으로 넘어가요.',
]

def build(no, fid, title, desc):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = '<a href="index.html">♞ 체스 학습관</a>' + ''.join(f'<a href="{f}.html"' + (' aria-current="page"' if f == fid else '') + f'>{n}마당</a>' for n, f, *_ in MADANG)
    js = '\n'.join(rd(HERE / f) for f in ['rules.js', 'pieces.js', 'board.js'] + (['ai.js'] if no >= 4 else []) + ([f'{fid}_data.js'] if (HERE / f'{fid}_data.js').exists() else []) + [f'{fid}.js', 'learn.js'])  # ai.js: 정식 대국 인공지능(4마당부터)
    if no >= 4:  # 정식 대국 인공지능을 웹 워커에서 돌릴 수 있게 규칙·인공지능 원본을 글로 넣음(learn.js의 aiWorker)
        js = 'window.CS_AI_SRC = ' + json.dumps(rd(HERE / 'rules.js') + '\n' + rd(HERE / 'ai.js'), ensure_ascii=False) + ';\n' + js
    rep = {'TITLE': title, 'DESC': desc, 'GNAV': gnav, 'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in HOW) + '</ul>',
           'JS': js.replace('</script', '<\\/script'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', '#7A5230').replace('{TOOLCSS}', rd(HERE / 'chess.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '체스판과 체스말부터 차근차근, 혼자서도 배우는 체스 학습관입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f'{fid}.html'; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    r = subprocess.run(['node', str(HERE / 'check.js')], capture_output=True, text=True)
    print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else '')
    if r.returncode: sys.exit('체스 학습관 점검 실패\n' + (r.stdout + r.stderr)[-3000:])
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(*m) for m in MADANG)
    print(f'체스 학습관 {n}쪽 다시 만듦 (모두 {len(MADANG)}쪽)')
