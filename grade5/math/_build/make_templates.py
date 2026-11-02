#!/usr/bin/env python3
"""3학년 수학 앱에서 공통 엔진만 떼어 5학년 빌드 틀(tpl_tb.html·tpl_st.html)을 만듭니다(2026-10-10).
틀 자리표: {{TITLE}} · /*@@APP@@*/ · /*@@UNIT@@*/
3학년 앱의 엔진을 고쳐 5학년에도 넣고 싶을 때만 다시 돌리세요(보통은 돌릴 일 없음)."""
import re, pathlib
HERE = pathlib.Path(__file__).resolve().parent
G3 = HERE.parents[2] / 'grade3' / 'math'
BASES = {'tb': G3 / 'sem1' / 'u4-mul.html', 'st': G3 / 'sem1-soop' / 'u5-lentime.html'}

def make(kind, path):
    L = path.read_text(encoding='utf-8').split('\n')
    iapp = next(i for i, x in enumerate(L) if x.startswith('const APP'))
    iunit = next(i for i, x in enumerate(L) if i > iapp and re.match(r'/\* ===== 3-1 수학 \d\.', x))
    istory = next(i for i, x in enumerate(L) if x.startswith('const UNIT_STORY'))
    iend = next(i for i, x in enumerate(L) if i > istory and x.startswith('</script>'))
    head, engine, tail = L[:iapp], L[iapp + 1:iunit], L[iend:]
    multi = []
    if kind == 'st':   # 이야기 버전: 활동 둘 이상 계단 처리(hj-multi) 묶음은 LESSONS 바로 앞에 둠
        a = next(i for i, x in enumerate(L) if x.startswith('/*hj-multi*/'))
        b = next(i for i, x in enumerate(L) if x.startswith('/*/hj-multi*/'))
        multi = L[a:b + 1]
    h = '\n'.join(head)
    h = re.sub(r'<title>.*?</title>', '<title>{{TITLE}}</title>', h, count=1)
    h = re.sub(r'<meta name="hj-(list|next)"[^>]*>', '', h)
    engine = [x.replace('{ class: "jua" }, "3학년")', '{ class: "jua" }, "5학년")') for x in engine]
    out = h + '\n/*@@APP@@*/\n' + '\n'.join(engine) + '\n/*@@UNIT@@*/\n' + '\n'.join(multi) + '\n/*@@LESSONS@@*/\n' + '\n'.join(tail)
    (HERE / f'tpl_{kind}.html').write_text(out, encoding='utf-8')
    print(kind, path.name, 'engine lines', len(engine), 'tail', len(tail))

for k, p in BASES.items(): make(k, p)
