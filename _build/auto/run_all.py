#!/usr/bin/env python3
"""모두 다시 적용 — 어디서 고치거나 덮어써도 사이트를 '지금 상태'로 맞춥니다 (2026-10-04)

  python3 _build/auto/run_all.py                 # 아직 올리지 않은 변경을 기준으로 전부 맞춤
  python3 _build/auto/run_all.py --since <커밋>   # 그 커밋 뒤에 올라온 변경을 기준으로(GitHub에서 씀)

GitHub에서는 main에 올라올 때마다 .github/workflows/auto-fix.yml이 이것을 돌리고, 바뀐 것이 있으면 '자동 보완' 커밋을 올립니다.
여러 번 돌려도 안전합니다(이미 맞으면 아무것도 바뀌지 않음).

하는 일(차례대로)
 1. 수학 단원 앱에 홈 단추 조각(#hj-home)이 없으면 다시 넣기
 3. 수학 이야기 버전: 사고 전략 예시(apply.py) → 글쓰기 도움(help.py) → 답(ans.py) → 나눗셈 그림(pics.py)
 4. 사회 홍지희 버전 예시·힌트(grade3/social/_ex/apply.py)
 5. 3-1 사회 프로젝트 판 → 메뉴 디자인(apply_theme.py) → 수업 자료 덮개(apply_content_theme.py)
 6. 안전장치: 원본에서 만드는 HTML(과학 3-1·3-2 홍지희 버전, 국어 3-2, 우리 반 교실, 오늘의 교실 산책, 쉬는 시간 종이접기·스도쿠·컬러링·미로찾기·틀린 그림 찾기, 공통 한자 급수·음악이론·기초연산·받아쓰기·속담, 프로젝트 세계시민교육·독서교육)을 원본으로 다시 빌드해
    지금 HTML과 견줌. 원본만 바뀌었으면 새로 만든 것으로 바꾸고, HTML에만 고친 내용이 있으면 HTML을 지키고 '원본에 반영 필요'로 알림
 7. 점검: 링크(href와 "f": 둘 다) / 할 일(내용이 필요한 새 칸, 원본에 반영 필요) → _build/auto/todo.md
문제가 있으면(스크립트 오류·깨진 링크·이번에 올라온 HTML 수정이 원본에 없음) 끝 코드가 1이 되어 GitHub가 실패 메일을 보냅니다.
"""
import os, re, sys, glob, subprocess, traceback
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PY = sys.executable
sys.dont_write_bytecode = True
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'  # 저장소에 .pyc가 섞이거나 바뀌지 않게
os.environ.setdefault('WM_CACHE', os.path.join(ROOT, '_build/wmcache'))  # 과학 사진 캐시(저장소에 둠 → 어디서 빌드해도 같은 결과)
ERR, LOG = [], []


def run(cwd, *args):
    r = subprocess.run([PY, *args], cwd=os.path.join(ROOT, cwd), capture_output=True, text=True)
    tail = (r.stdout.strip().splitlines() or [''])[-1]
    LOG.append(f'{cwd}: {" ".join(args)} → {tail}')
    if r.returncode: ERR.append(f'{cwd}: {" ".join(args)} 실패\n{(r.stderr or r.stdout)[-1500:]}')
    return r


BUILDS = [  # (이름, 원본 폴더, 만들어지는 HTML(손대면 알아챌 곳), [(작업 폴더, 명령)…])
    ('과학 3-2 홍지희 버전', 'grade3/science/_build_hong2/', ['grade3/science/sem2-hong/*.html'],
     [('grade3/science/_build_hong2', ['build.py']), ('grade3/science/_build_hong2', ['index_build.py'])]),
    ('과학 3-1 홍지희 버전', 'grade3/science/_build_hong/', ['grade3/science/sem1-hong/u*.html'],
     [('grade3/science/_build_hong', ['build.py'])]),  # 3-1 목록(index.html)은 손본 HTML이라 index_build.py는 돌리지 않음
    ('국어 3-2', 'grade3/korean/_build/', ['grade3/korean/sem2/u*.html'], [('grade3/korean/_build', ['build.py', '../sem2'])]),
    ('우리 반 교실', '_build/class/', ['class/index.html'], [('.', ['_build/class/build.py'])]),
    ('오늘의 교실 산책', '_build/today/', ['today/index.html', 'index.html'], [('.', ['_build/today/build.py'])]),
    ('쉬는 시간 종이접기', '_build/origami/', ['break/origami/g*.html'], [('.', ['_build/origami/build.py'])]),
    ('쉬는 시간 스도쿠', '_build/sudoku/', ['break/sudoku/g*.html'], [('.', ['_build/sudoku/build.py'])]),
    ('쉬는 시간 컬러링', '_build/coloring/', ['break/coloring/g*.html'], [('.', ['_build/coloring/build.py'])]),
    ('쉬는 시간 미로찾기', '_build/maze/', ['break/maze/g*.html'], [('.', ['_build/maze/build.py'])]),
    ('쉬는 시간 틀린 그림 찾기', '_build/spot/', ['break/spot/g*.html'], [('.', ['_build/spot/build.py'])]),
    ('학년 공통 한자 급수', '_build/hanja/', ['common/hanja/lv*.html'], [('.', ['_build/hanja/build.py'])]),
    ('공통 음악이론', '_build/music/', ['common/music/t*.html'], [('.', ['_build/music/build.py'])]),
    ('공통 기초연산', '_build/arith/', ['common/arith/[!i]*.html'], [('.', ['_build/arith/build.py'])]),
    ('공통 받아쓰기·맞춤법', '_build/dictation/', ['common/dictation/g*.html'], [('.', ['_build/dictation/build.py'])]),
    ('공통 속담·관용어·사자성어', '_build/words/', ['common/words/[!i]*.html'], [('.', ['_build/words/build.py'])]),
    ('프로젝트 세계시민교육', '_build/gced/', ['project/global/t*.html'], [('.', ['_build/gced/build.py'])]),
    ('프로젝트 독서교육', '_build/reading/', ['project/reading/[!i]*.html'], [('.', ['_build/reading/build.py'])]),
    ('기타 교과수학게임', ('_build/mathgame/', '_build/arith/skills.js'), ['project/mathgame/g*.html'], [('.', ['_build/mathgame/build.py'])]),
    ('기타 창의수학게임', ('_build/creative/', '_build/origami/foot.html', '_build/origami/home.html', '_build/origami/head_snip.html'), ['project/creative/magic.html', 'project/creative/tangram.html', 'project/creative/kenken.html', 'project/creative/hanoi.html', 'project/creative/nonogram.html', 'project/creative/make.html'], [('.', ['_build/creative/build.py'])]),
    ('프로젝트 도서 활용 세계시민교육', '_build/gced-books/', ['project/gced-books/*.html', 'project/gced-books/*/*.html'], [('.', ['_build/gced-books/build.py'])]),
]


def changed(since):
    """올라온(또는 아직 올리지 않은) 변경 파일 목록. 알 수 없으면 None"""
    if since and set(since) != {'0'}:
        r = subprocess.run(['git', 'diff', '--name-only', since, 'HEAD'], cwd=ROOT, capture_output=True, text=True)
        return None if r.returncode else r.stdout.split()
    r = subprocess.run(['git', 'status', '--porcelain', '--untracked-files=all'], cwd=ROOT, capture_output=True, text=True)
    return None if r.returncode else [l[3:].split(' -> ')[-1].strip('"') for l in r.stdout.splitlines()]


def files_of(globs):
    return sorted({os.path.relpath(p, ROOT) for g in globs for p in glob.glob(os.path.join(ROOT, g))})


def sha(rel):
    import hashlib
    p = os.path.join(ROOT, rel)
    return hashlib.sha1(open(p, 'rb').read()).hexdigest() if os.path.exists(p) else None


def home_fragment():
    """수학 단원 앱(밖에서 빌드해 덮는 파일)에 홈 단추 조각이 없으면 넣음"""
    tpl = open(os.path.join(ROOT, '_build/auto/hj_home.html'), encoding='utf-8').read().strip()
    n = 0
    for p in sorted(glob.glob(os.path.join(ROOT, 'grade*/math/*/u*.html'))):
        s = open(p, encoding='utf-8').read()
        if 'id="hj-home"' in s or 'http-equiv="refresh"' in s or '</body>' not in s: continue
        href = os.path.relpath(os.path.join(ROOT, 'index.html'), os.path.dirname(p)).replace(os.sep, '/')
        frag = tpl.replace('{HREF}', href) + '\n'
        k = s.find('<!--hj-cicons-->')
        if k < 0: k = s.rfind('</body>')
        s = s[:k] + frag + s[k:]
        open(p, 'w', encoding='utf-8').write(s); n += 1
        LOG.append(f'홈 단추 조각 다시 넣음: {os.path.relpath(p, ROOT)}')
    return n


def math_inject(todo):
    sys.path.insert(0, os.path.join(ROOT, 'grade3/math/_ex'))
    here = os.getcwd(); os.chdir(os.path.join(ROOT, 'grade3/math/_ex'))
    try:
        import importlib
        for name in ('apply', 'help', 'ans'):
            M = importlib.import_module(name)
            pat = {'apply': 'ex_*.py', 'help': 'help_*.py', 'ans': 'ans_*.py'}[name]
            for f in sorted(glob.glob(pat)):
                try:
                    D = importlib.import_module(f[:-3])
                    path = os.path.join(ROOT, 'grade3/math', D.FILE)
                    if not os.path.exists(path): continue
                    if name == 'apply': M.patch(path, D.EX, D.T, getattr(D, 'SIG', None))
                    else: M.patch(path, D)
                except Exception:
                    ERR.append(f'수학 {name}.py — {f}\n' + traceback.format_exc()[-1200:])
            todo += M.TODO
            LOG.append(f'수학 {name}.py 적용')
        P = importlib.import_module('pics')
        try: P.main(); todo += P.TODO
        except Exception: ERR.append('수학 pics.py\n' + traceback.format_exc()[-1200:])
    finally:
        os.chdir(here)


def links():
    bad = []
    for p in glob.glob(os.path.join(ROOT, '**/*.html'), recursive=True):
        rel = os.path.relpath(p, ROOT)
        if rel.startswith('_') or '/_' in rel: continue
        s = open(p, encoding='utf-8', errors='ignore').read(); d = os.path.dirname(p)
        refs = set(re.findall(r'href=["\']([^"\'#?:]+\.html)["\']', s))
        refs |= set(re.findall(r'["\']f["\']\s*:\s*["\']([\w\-./]+\.html)["\']', s))
        refs |= set(re.findall(r'url=([^"\'>:]+\.html)', s))
        for r in refs:
            if not os.path.exists(os.path.normpath(os.path.join(d, r))): bad.append(f'{rel} → {r}')
    return bad


def main():
    a = sys.argv[1:]
    since = a[a.index('--since') + 1] if '--since' in a else None
    ch = changed(since) or []
    todo = []

    def inject():  # 넣기·덮개(여러 번 돌려도 같은 결과)
        home_fragment()
        run('grade3/math/_ex', 'sigmake.py')  # 새 데이터 파일(SIG 없음)에 칸 이름표 적기
        del todo[:]; math_inject(todo)
        run('grade3/social/_ex', 'apply.py')
        run('.', '_build/project/apply.py')    # 3-1 사회 프로젝트 판
        run('.', '_build/theme/apply_theme.py')          # 메뉴 먼저(오늘의 교실 산책처럼 새로 빌드한 메뉴에 표시가 붙어야 덮개가 건너뜀)
        run('.', '_build/theme/apply_content_theme.py')

    # A. 올라온 HTML 그대로 넣기·덮개 → 이것이 '지금 HTML'
    inject()
    # B. 원본에서 다시 빌드해 보고, '지금 HTML'과 견줌 (안전장치)
    #    원본만 바뀌었으면 → 새로 만든 것으로 바꿈(원래 뜻)
    #    HTML에 손댄 흔적이 있는데 원본으로 만든 것과 다르면 → HTML을 그대로 두고 '원본에 반영 필요'로 알림(고친 내용이 사라지지 않게)
    import shutil, tempfile
    keep = tempfile.mkdtemp(); before = {}; plan = []
    for name, src, outs, cmds in BUILDS:
        fs = files_of(outs)
        for f in fs:
            before[f] = sha(f); os.makedirs(os.path.dirname(os.path.join(keep, f)) or keep, exist_ok=True); shutil.copy2(os.path.join(ROOT, f), os.path.join(keep, f))
        plan.append((name, src, fs, any(c.startswith(src) for c in ch)))
        for cwd, args in cmds: run(cwd, *args)
    inject()
    restored, src_todo = [], []
    for name, src, fs, src_changed in plan:
        for f in fs:
            if sha(f) == before[f]: continue
            if src_changed and f not in ch: continue  # 원본을 고친 결과 — 그대로 받아들임
            shutil.copy2(os.path.join(keep, f), os.path.join(ROOT, f)); restored.append(f)
            msg = f'원본에 반영 필요 — {name}: {f} (HTML에 원본에 없는 내용이 있어 HTML을 그대로 두었습니다. 원본 {src}에 같은 수정을 넣어 주세요)'
            src_todo.append(msg)
            if f in ch: ERR.append(msg)  # 이번에 올라온 수정이면 실패 메일로 알림(예전 것은 todo.md에만)
    shutil.rmtree(keep, ignore_errors=True)
    if restored: inject()  # 되돌린 HTML 기준으로 메뉴·덮개를 다시 맞춤
    todo += src_todo
    # 6. 점검
    for b in links(): ERR.append('깨진 링크: ' + b)
    mt = tempfile.mkdtemp(); run('.', '_build/mathsite/export.py', mt); shutil.rmtree(mt, ignore_errors=True)  # 따로 사이트 '초등 수학 게임'이 만들어지는지
    r = run('grade3/social/_ex', 'apply.py', 'check')
    if re.search(r'문제 [1-9]', r.stdout): todo.append('사회 예시: ' + ' / '.join(l for l in r.stdout.splitlines() if '문제 0' not in l)[:400])
    head = ('# 할 일 (자동 점검, 손으로 고치지 마세요)\n\n'
            '- 내용이 필요한 새 칸: 앱이 바뀌어 예시·도움·답이 아직 없는 칸입니다.\n'
            '- 원본에 반영 필요: 원본에서 만드는 HTML만 고쳐져 있는 곳입니다(그대로 두면 다음 빌드 때 사라질 수 있음).\n'
            'Claude에게 "todo.md 채워 줘"라고 하면 처리합니다.\n'
            '(채운 뒤 grade3/math/_ex/sigmake.py 그 파일.py 로 이름표를 새로 적습니다.)\n\n')
    body = ''.join(f'- {t}\n' for t in sorted(set(todo))) or '- 없음\n'
    tp = os.path.join(ROOT, '_build/auto/todo.md')
    old = open(tp, encoding='utf-8').read() if os.path.exists(tp) else ''
    if old != head + body: open(tp, 'w', encoding='utf-8').write(head + body)
    print('\n'.join(LOG))
    print(f'\n새 칸(내용 필요) {len(set(todo))}개 · 문제 {len(ERR)}개')
    for e in ERR: print('\n[문제] ' + e)
    out = os.environ.get('GITHUB_STEP_SUMMARY')
    if out:
        with open(out, 'a', encoding='utf-8') as f:
            f.write(f'## 자동 보완\n- 내용이 필요한 새 칸: {len(set(todo))}개\n- 문제: {len(ERR)}개\n')
            for e in ERR: f.write(f'\n```\n{e}\n```\n')
            if todo: f.write('\n' + body)
    sys.exit(1 if ERR else 0)


if __name__ == '__main__':
    main()
