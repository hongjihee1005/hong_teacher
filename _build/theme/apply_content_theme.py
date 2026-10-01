#!/usr/bin/env python3
"""수업 자료(메뉴가 아닌 페이지)에 공통 글꼴·색 덮개를 씌웁니다. 여러 번 실행해도 안전합니다.

    python3 _build/theme/apply_content_theme.py            # 모든 자료 페이지
    python3 _build/theme/apply_content_theme.py a.html     # 지정한 파일만

원본: _build/theme/content.css (Jua·Gowun Dodum 이름에 Pretendard 글꼴을 연결하고, 바탕·글자색 변수를 밝고 따뜻하게 덮어씀)
"""
import pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
CSS = (pathlib.Path(__file__).with_name('content.css')).read_text(encoding='utf-8')
BLOCK = f'<!--hj-ctheme--><style id="hj-ctheme">{CSS}</style><!--/hj-ctheme-->'
JS = (pathlib.Path(__file__).with_name('content.js')).read_text(encoding='utf-8')
JBLOCK = f'<!--hj-cicons--><script>{JS}</script><!--/hj-cicons-->'

def target(f, s):
    rel = f.relative_to(ROOT).as_posix()
    if rel.startswith(('_', 'class/', '.git')) or '/_' in rel: return False
    if 'http-equiv="refresh"' in s or 'id="hj-theme"' in s: return False   # 옛 주소 안내, 메뉴 페이지
    return '</head>' in s

def apply(f):
    s = f.read_text(encoding='utf-8'); o = s
    if not target(f, s): return False
    s = re.sub(r'<!--hj-ctheme-->.*?<!--/hj-ctheme-->', '', s, flags=re.S)
    i = s.find('</head>'); s = s[:i] + BLOCK + s[i:]
    s = re.sub(r'<!--hj-cicons-->.*?<!--/hj-cicons-->', '', s, flags=re.S)
    j = s.rfind('</body>')
    if j > 0: s = s[:j] + JBLOCK + s[j:]
    if s != o: f.write_text(s, encoding='utf-8'); return True
    return False

if __name__ == '__main__':
    files = [pathlib.Path(a).resolve() for a in sys.argv[1:]] or sorted(ROOT.rglob('*.html'))
    print(f'{sum(apply(f) for f in files)}개 자료 페이지에 적용')
