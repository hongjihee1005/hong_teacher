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

EMO = re.compile(r'[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\u2300-\u23FF\uFE0F\u200D]+')
_NEXT = {}
_LIST = {}
import html as _html, json as _json
def list_of(f):
    d = f.parent
    if d not in _LIST:
        idx = d / 'index.html'; out = []
        if idx.exists():
            t = idx.read_text(encoding='utf-8')
            clean = lambda x: EMO.sub('', re.sub(r'<[^>]+>', '', x)).strip()
            for h, body in re.findall(r'<a class="card[^"]*" href="([\w\-]+\.html)"[^>]*>(.*?)</a>', t, re.S):
                if h in [o[0] for o in out] or not (d / h).exists(): continue
                nm = re.search(r'<span class="nm">(.*?)</span>', body, re.S)
                tg = re.search(r'<span class="tag"[^>]*>(.*?)</span>', body, re.S)
                out.append([h, clean(nm.group(1)) if nm else h, clean(tg.group(1)) if tg else ''])
        _LIST[d] = out
    return _LIST[d]
def next_of(f):
    """같은 폴더 자료 목록(index.html)의 차시 순서에서 다음 차시(주소, 제목)."""
    d = f.parent
    if d not in _NEXT:
        idx = d / 'index.html'; m = {}
        if idx.exists():
            t = idx.read_text(encoding='utf-8'); order = []
            for h, body in re.findall(r'<a class="card[^"]*" href="(u\d+-l?\d+\.html)"[^>]*>(.*?)</a>', t, re.S):
                if h in [o[0] for o in order] or not (d / h).exists(): continue
                nm = re.search(r'<span class="nm">(.*?)</span>', body, re.S)
                tg = re.search(r'<span class="tag"[^>]*>(.*?)</span>', body, re.S)
                clean = lambda x: EMO.sub('', re.sub(r'<[^>]+>', '', x)).strip()
                order.append((h, clean(nm.group(1)) if nm else h, clean(tg.group(1)) if tg else ''))
            for a, b in zip(order, order[1:]): m[a[0]] = b
            for a in order: m.setdefault(a[0], None)
        _NEXT[d] = m
    return _NEXT[d].get(f.name, False)

def target(f, s):
    rel = f.relative_to(ROOT).as_posix()
    if rel.startswith(('_', '.git')) or '/_' in rel: return False
    if rel.startswith('class/') and rel != 'class/index.html': return False
    if 'http-equiv="refresh"' in s or 'id="hj-theme"' in s: return False   # 옛 주소 안내, 메뉴 페이지
    return '</head>' in s

def apply(f):
    s = f.read_text(encoding='utf-8'); o = s
    if not target(f, s): return False
    s = re.sub(r'<!--hj-ctheme-->.*?<!--/hj-ctheme-->', '', s, flags=re.S)
    # 진짜 Jua·Gowun Dodum 글꼴은 받지 않음(같은 이름에 Pretendard를 연결해 두었으므로, 섞여 보이지 않게)
    s = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?family=Jua&(?:amp;)?family=Gowun\+Dodum&(?:amp;)?display=swap" rel="stylesheet">', '', s)
    nx = next_of(f); meta = ''
    if nx: meta = f'<meta name="hj-next" content="{nx[0]}" data-t="{nx[1]}" data-tag="{nx[2]}">'
    elif nx is None: meta = '<meta name="hj-next" content="">'
    lst = list_of(f)
    if lst: meta += '<meta name="hj-list" content="' + _html.escape(_json.dumps(lst, ensure_ascii=False), quote=True) + '">'
    blk = BLOCK.replace('<!--/hj-ctheme-->', meta + '<!--/hj-ctheme-->')
    i = s.find('</head>'); s = s[:i] + blk + s[i:]
    s = re.sub(r'<!--hj-cicons-->.*?<!--/hj-cicons-->', '', s, flags=re.S)
    j = s.rfind('</body>')
    if j > 0: s = s[:j] + JBLOCK + s[j:]
    if s != o: f.write_text(s, encoding='utf-8'); return True
    return False

if __name__ == '__main__':
    files = [pathlib.Path(a).resolve() for a in sys.argv[1:]] or sorted(ROOT.rglob('*.html'))
    print(f'{sum(apply(f) for f in files)}개 자료 페이지에 적용')
