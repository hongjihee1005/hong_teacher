#!/usr/bin/env python3
"""4학년 수학 단원 앱 빌드 (2026-10-10)

  python3 build.py            → units/ 의 모든 단원을 만듦
  python3 build.py u2-angle   → 그 단원만 (두 버전)

원본: units/<단원>.tb.js (교과서 차시 버전 → ../sem1/<단원>.html)
      units/<단원>.st.js (이야기 버전     → ../sem1-soop/<단원>.html)
한 파일은 세 묶음입니다:  //@@APP  (const APP={…}; 한 줄)  //@@UNIT  (단원 조작 부품)  //@@LESSONS  (UNIT_STORY·UNIT_KEYWORDS·LESSONS)
공통 엔진은 tpl_tb.html·tpl_st.html(3학년 앱에서 make_templates.py로 떼어 냄). 만든 뒤 루트에서 apply_content_theme.py.
"""
import re, sys, json, pathlib, subprocess
HERE = pathlib.Path(__file__).resolve().parent
OUT = {'tb': HERE.parent / 'sem1', 'st': HERE.parent / 'sem1-soop'}
OUT2 = {'tb': HERE.parent / 'sem2', 'st': HERE.parent / 'sem2-soop'}   # units/sem2/ → 2학기

def parts(src):
    m = re.split(r'^//@@(APP|UNIT|LESSONS)\s*$', src, flags=re.M)
    d = {m[i]: m[i + 1].strip('\n') for i in range(1, len(m), 2)}
    for k in ('APP', 'UNIT', 'LESSONS'):
        if k not in d: raise SystemExit(f'묶음 //@@{k} 이 없어요')
    return d

def build(path):
    slug, kind = path.name.split('.')[0], path.name.split('.')[1]
    d = parts(path.read_text(encoding='utf-8'))
    t = re.search(r'title\s*:\s*"([^"]+)"', d['APP']).group(1)
    u = re.search(r'unit\s*:\s*"([^"]+)"', d['APP']).group(1)
    tpl = (HERE / f'tpl_{kind}.html').read_text(encoding='utf-8')
    html = (tpl.replace('{{TITLE}}', f'{t} · {u}').replace('/*@@APP@@*/', d['APP'])
               .replace('/*@@UNIT@@*/', d['UNIT']).replace('/*@@LESSONS@@*/', d['LESSONS']))
    # 묶은 차시(no: "5~6")도 #5·#6으로 열리게
    a = 'return LESSONS.find(L => String(L.no) === key || L.id === key) || null;'
    b = 'return LESSONS.find(L => String(L.no) === key || L.id === key) || LESSONS.find(L => { const m = String(L.no).match(/^(\\d+)~(\\d+)$/); return m && +key >= +m[1] && +key <= +m[2]; }) || null;'
    assert html.count(a) == 1; html = html.replace(a, b)
    # 활동 안 '확인하기'·'다 썼어요' 줄과 엔진 '다음 계단' 막대가 둘 다 화면 아래에 붙어 겹치지 않게, 막대 높이만큼 위에 쌓음(2026-10-10)
    BAR = ('<style id="hj-actbar">.work > div .actions{bottom:var(--hjbar,0px)}</style>\n<script id="hj-actbar-js">(function(){let w=false;'
           'const f=()=>{if(w)return;w=true;requestAnimationFrame(()=>{w=false;const a=document.querySelector(".work > .actions");'
           'document.documentElement.style.setProperty("--hjbar",(a?a.offsetHeight:0)+"px");});};'
           '["scroll","resize","click","input","pointerup","load"].forEach(e=>window.addEventListener(e,f,{passive:true}));f();})();</script>\n')
    assert html.count('</body>') == 1; html = html.replace('</body>', BAR + '</body>')
    out = (OUT2 if path.parent.name == 'sem2' else OUT)[kind] / f'{slug}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    # 이미 덮개가 입혀진 옛 파일이 있으면 덮개 조각만 지우고 다시 씀(덮개는 apply_content_theme.py가 다시 입힘)
    out.write_text(html, encoding='utf-8')
    # 문법 점검: 본 스크립트를 node로 읽어 봄
    js = re.search(r'<script>\n(const APP.*?)\n</script>', html, re.S).group(1)
    import os; tmp = HERE / f'.check-{os.getpid()}.js'; tmp.write_text(js, encoding='utf-8')
    r = subprocess.run(['node', '--check', str(tmp)], capture_output=True, text=True); tmp.unlink()
    if r.returncode: raise SystemExit(f'[문제] {path.name} 자바스크립트 문법 오류\n{r.stderr[:1500]}')
    print('만듦', out.relative_to(HERE.parents[2]))

want = sys.argv[1:]
files = sorted((HERE / 'units').glob('*.*.js')) + sorted((HERE / 'units' / 'sem2').glob('*.*.js'))
# 2학기 단원만: python3 build.py sem2   (1학기·2학기 이름이 겹치면 둘 다 만듦)
for f in files:
    if not want or f.name.split('.')[0] in want or f.parent.name in want: build(f)
