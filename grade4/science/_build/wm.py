#!/usr/bin/env python3
"""위키미디어 공용 사진 도구 (교육용 앱 제작)
사용법:
  python3 wm.py search "검색어(영어 권장)" [개수]   -> OK/NO, 파일 제목, 라이선스, 저작자
  python3 wm.py info "File:Name.jpg"             -> 저작자, 라이선스, 원본 링크 (사진도 캐시에 내려받음)
  python3 wm.py embed in.html out.html           -> src="wm:File:Name.jpg" 를 base64 JPEG(가로 900px 이하)로 바꿈
허용 라이선스: CC0, Public domain, CC BY, CC BY-SA (NC/ND 금지)
여러 작업자가 동시에 써도 요청 사이 간격을 지키도록 잠금 파일을 씁니다.
API가 막히면(429) HTML 페이지로 자동 전환합니다.
"""
import sys, json, time, os, re, base64, io, html, fcntl
import urllib.request, urllib.parse, urllib.error
UA = "HongTeacherEduApps/1.0 (https://github.com/hongjihee1005/hong_teacher; elementary science education)"
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.environ.get('WM_CACHE') or os.path.join(os.path.expanduser('~'), '.cache', 'wm_imgcache')
os.makedirs(CACHE, exist_ok=True)
LOCK = os.path.join(CACHE, '.lock')
C = "https://commons.wikimedia.org"


def get(url, binary=True, tries=10, gap=1.6):
    """한 번에 한 요청, 요청 사이 gap초 이상. 429면 기다렸다 다시."""
    for t in range(tries):
        with open(LOCK, 'a+') as lf:
            fcntl.flock(lf, fcntl.LOCK_EX)
            lf.seek(0)
            try:
                last = float(lf.read() or 0)
            except ValueError:
                last = 0
            wait = last + gap - time.time()
            if wait > 0:
                time.sleep(wait)
            err = None
            d = None
            try:
                req = urllib.request.Request(url, headers={'User-Agent': UA})
                with urllib.request.urlopen(req, timeout=60) as r:
                    d = r.read()
            except Exception as e:
                err = e
            pen = 10 if (err is not None and getattr(err, 'code', 0) == 429) else 0
            lf.seek(0); lf.truncate(); lf.write(str(time.time() + pen)); lf.flush()
            fcntl.flock(lf, fcntl.LOCK_UN)
        if err is None:
            return d
        code = getattr(err, 'code', 0)
        if code in (400, 403, 404):
            raise err
        time.sleep(min(40, 5 * (t + 1)))
    raise RuntimeError('여러 번 시도했지만 실패(잠시 뒤 다시 해 보세요): ' + url)


def strip(h):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()


def ok_license(l):
    l = (l or '').lower().replace('-', ' ')
    if re.search(r'\bnc\b|\bnd\b|noncommercial|noderiv', l):
        return False
    return any(k in l for k in ['cc0', 'public domain', 'pd ', 'cc by', 'attribution', 'pdm']) or l.strip() in ('pd',)


def title_norm(t):
    t = t.strip()
    if not t.startswith('File:'):
        t = 'File:' + t
    return t.replace(' ', '_')


def page_meta(title):
    """File: 페이지 HTML에서 원본 주소, 크기, 라이선스, 저작자 읽기"""
    t = title_norm(title)
    s = get(C + '/wiki/' + urllib.parse.quote(t, safe=':_()\',.-'), binary=True).decode('utf-8', 'replace')
    m = re.search(r'class="fullMedia"><bdi[^>]*><a href="([^"?]+)', s) or \
        re.search(r'href="(https://upload\.wikimedia\.org/wikipedia/commons/[0-9a-f]/[0-9a-f]{2}/[^"?]+)', s)
    url = html.unescape(m.group(1)) if m else None
    wh = re.search(r'class="fileInfo">\(([\d,]+) × ([\d,]+)', s)
    w, h = (int(wh.group(1).replace(',', '')), int(wh.group(2).replace(',', ''))) if wh else (0, 0)
    lic = [strip(x) for x in re.findall(r'licensetpl&#95;short"[^>]*>(.*?)</span>', s)]
    lic = [x for x in lic if x]
    good = [x for x in lic if ok_license(x)]
    license = (good or lic or [''])[0]
    if not license and re.search(r'public domain', s, re.I):
        license = 'Public domain'
    a = re.search(r'id="fileinfotpl&#95;aut"[^>]*>.*?</td>\s*<td[^>]*>(.*?)</td>', s, re.S)
    artist = strip(a.group(1))[:80] if a else ''
    if not artist:
        a = re.search(r'id="fileinfotpl&#95;src"[^>]*>.*?</td>\s*<td[^>]*>(.*?)</td>', s, re.S)
        artist = strip(a.group(1))[:80] if a else ''
    d = re.search(r'class="description[^"]*"[^>]*>(.*?)</div>', s, re.S)
    return dict(title=t.replace('_', ' '), w=w, h=h, url=url, page=C + '/wiki/' + urllib.parse.quote(t, safe=':_()\',.-'),
                artist=artist or '작자 미상', license=license, all_licenses=lic, desc=strip(d.group(1))[:140] if d else '')


def cmd_search(q, n=10):
    n = int(n)
    u = C + '/w/index.php?' + urllib.parse.urlencode(dict(search=q, title='Special:Search', profile='advanced', fulltext=1, ns6=1, limit=max(n, 10)))
    s = get(u).decode('utf-8', 'replace')
    ts = []
    for x in re.findall(r'href="/wiki/(File:[^"#?]+)"', s):
        x = urllib.parse.unquote(html.unescape(x))
        if x not in ts and re.search(r'\.(jpe?g|png|tiff?|webp|gif)$', x, re.I):
            ts.append(x)
    if not ts:
        print('결과 없음 (다른 영어 검색어로 해 보세요)')
        return
    for t in ts[:n]:
        try:
            m = page_meta(t)
        except Exception as e:
            print('ERR', t, e)
            continue
        flag = 'OK ' if ok_license(m['license']) and m['url'] else 'NO '
        print(f"{flag}{m['title']} | {m['w']}x{m['h']} | {m['license']} | {m['artist'][:40]} | {m['desc'][:70]}")


def fname(t):
    return os.path.join(CACHE, re.sub(r'[^A-Za-z0-9._-]', '_', title_norm(t))[:150] + '.jpg')


def fetch(title):
    fn = fname(title)
    js = fn + '.json'
    if os.path.exists(fn) and os.path.exists(js):
        return json.load(open(js)), fn
    m = page_meta(title)
    if not m['url']:
        raise SystemExit('사진을 찾지 못함: ' + title)
    if not ok_license(m['license']):
        raise SystemExit('허용되지 않는 라이선스(%s): %s' % (m['license'] or '알 수 없음', title))
    u0 = m['url']
    base = u0.rsplit('/', 1)[1]
    T = u0.replace('/wikipedia/commons/', '/wikipedia/commons/thumb/', 1)
    low = u0.lower()
    if low.endswith(('.tif', '.tiff')):
        cands = [T + '/lossy-page1-%dpx-%s.jpg' % (w, base) for w in (960, 1280, 500)]
    elif low.endswith('.svg'):
        cands = [T + '/%dpx-%s.png' % (w, base) for w in (960, 500)]
    else:
        cands = [T + '/%dpx-%s' % (w, base) for w in (960, 1280, 500)] if m['w'] > 1300 else []
        cands.append(u0)
    data = None
    last = None
    for u in cands:
        try:
            data = get(u)
            break
        except urllib.error.HTTPError as e:
            last = e
    if data is None:
        raise SystemExit('사진 내려받기 실패: %s (%s)' % (title, last))
    from PIL import Image
    im = Image.open(io.BytesIO(data))
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert('RGB')
    if im.width > 900:
        im = im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
    im.save(fn, 'JPEG', quality=78, optimize=True, progressive=True)
    m['ow'], m['oh'] = im.width, im.height
    json.dump(m, open(js, 'w'), ensure_ascii=False)
    return m, fn


def cmd_info(title):
    m, fn = fetch(title)
    print(json.dumps({k: m[k] for k in ['title', 'artist', 'license', 'page', 'ow', 'oh']}, ensure_ascii=False))
    print('캡션 출처: <span class="cr">사진: %s · %s · <a href="%s" target="_blank" rel="noopener">위키미디어 공용</a></span>' % (
        html.escape(m['artist']), m['license'], m['page']))
    print('사진 크기 속성: width="%d" height="%d"' % (m['ow'], m['oh']))


def cmd_embed(inp, out):
    s = open(inp, encoding='utf-8').read()

    def rep(mo):
        m, fn = fetch(html.unescape(mo.group(1)))
        return 'src="data:image/jpeg;base64,' + base64.b64encode(open(fn, 'rb').read()).decode() + '"'
    s2, n = re.subn(r'src="wm:([^"]+)"', rep, s)
    open(out, 'w', encoding='utf-8').write(s2)
    print('사진 %d장 넣음 → %s (%.0f KB)' % (n, out, len(s2.encode()) / 1024))


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        print(__doc__); sys.exit()
    {'search': lambda: cmd_search(*a[1:]), 'info': lambda: cmd_info(a[1]), 'embed': lambda: cmd_embed(a[1], a[2])}[a[0]]()
