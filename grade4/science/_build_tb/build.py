#!/usr/bin/env python3
"""4학년 1학기 과학 교과서 버전 앱 만들기.

src/uN-M.html (머리 주석 + 앱 CSS + section들 + 앱 script) → ../sem1/uN-M.html
공통 틀(parts/head_css.html, parts/tail.html)은 3학년 2학기 교과서 버전 앱에서 떼어 온 것
(한 화면 모드·빈칸 확인·홈 단추·연락처 줄). 앱마다 쓰는 도우미 $ $$ fb doneNav faces는 여기서 넣음.

  python3 build.py            # 모두
  python3 build.py u1-1 u2-3  # 몇 개만
  python3 build.py check      # 만들지 않고 원본만 점검
"""
import base64, glob, html, json, os, re, sys

B = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(B, '..', 'sem1')
WM = os.environ.get('WM_CACHE') or os.path.join(B, '..', '..', '..', '_build', 'wmcache')
ROOM = '1학기 과학방으로'

UNITS = {
    1: ('1단원 자석의 이용', '#b8452f', 'magnet'),
    2: ('2단원 물의 상태 변화', '#1c6fa8', 'drop'),
    3: ('3단원 땅의 변화', '#8a5a2b', 'volcano'),
    4: ('4단원 다양한 생물과 우리 생활', '#2f7d4a', 'mushroom'),
}

ICON = {
    'magnet': '<svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true"><path d="M20 18 v28 a23 23 0 0 0 46 0 v-28 h-14 v28 a9 9 0 0 1 -18 0 v-28 z" fill="#e2573f" stroke="#fff" stroke-width="3"/><rect x="20" y="12" width="14" height="10" fill="#dfe7ee" stroke="#fff" stroke-width="3"/><rect x="52" y="12" width="14" height="10" fill="#dfe7ee" stroke="#fff" stroke-width="3"/></svg>',
    'drop': '<svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true"><path d="M43 10 C30 30 20 42 20 54 a23 23 0 0 0 46 0 C66 42 56 30 43 10z" fill="#6ec3f0" stroke="#fff" stroke-width="3"/><path d="M33 56 a10 10 0 0 0 10 10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
    'volcano': '<svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true"><path d="M8 74 L32 34 h22 L78 74z" fill="#a0673a" stroke="#fff" stroke-width="3"/><path d="M32 34 q11 8 22 0" fill="#e2573f"/><circle cx="36" cy="20" r="7" fill="#c9d3da"/><circle cx="48" cy="14" r="9" fill="#c9d3da"/></svg>',
    'mushroom': '<svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true"><path d="M12 44 a31 26 0 0 1 62 0z" fill="#e2573f" stroke="#fff" stroke-width="3"/><circle cx="30" cy="32" r="5" fill="#fff"/><circle cx="52" cy="28" r="6" fill="#fff"/><path d="M34 44 h18 l3 30 h-24z" fill="#f4e6cf" stroke="#fff" stroke-width="3"/></svg>',
}

HELPERS = r"""
var $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function fb(el,msg,ok){if(typeof el==='string')el=$(el);if(!el)return;el.textContent=msg;el.className='fb '+(ok===true?'ok':ok===false?'no':'info');}
function doneNav(id){const a=$(`nav a[href="#${id}"]`); if(a) a.classList.add('done');}
/* 고르기 묶음: pickOne('#box', 맞을 때 글, 틀릴 때 글, 섹션id) — 버튼의 data-a="1"이 정답 */
function pickOne(box,okMsg,noMsg,sec,after){const bs=$$(box+' button');const out=$(box).nextElementSibling;
  bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>x.classList.remove('right','wrong'));
    if(b.dataset.a==='1'){b.classList.add('right');fb(out,b.dataset.m||okMsg,true);if(sec)doneNav(sec);if(after)after(b);}
    else{b.classList.add('wrong');fb(out,b.dataset.m||noMsg,false);}});}
/* 스스로 평가: 섹션 안 td.face[data-r] 칸에 얼굴 단추, 다 고르면 글 */
function faces(sec,goodMsg,lowMsg){const fs=['😀','🙂','😐'],rate=[];const tds=$$('#'+sec+' td.face');
  tds.forEach(td=>{const r=+td.dataset.r;fs.forEach((f,i)=>{const b=document.createElement('button');b.textContent=f;b.setAttribute('aria-label',['잘함','보통','노력 필요'][i]);
    b.onclick=()=>{$$('button',td).forEach(x=>x.classList.remove('sel'));b.classList.add('sel');rate[r]=i;
      if(tds.every(t=>rate[+t.dataset.r]!=null)){const low=rate.some(x=>x===2);fb($('#'+sec+' .fb:last-of-type')||$('#selfFb'),low?lowMsg:goodMsg,low?'info':true);doneNav(sec);}};
    td.appendChild(b);});});}
/* 글쓰기 확인: keyCheck('#ta','#btn','#fb',[[/정규식/,'이름'],…],필요 수,섹션id,힌트) */
function keyCheck(ta,btn,out,keys,need,sec,hint){$(btn).onclick=()=>{const t=$(ta).value.trim();if(!t){fb(out,'먼저 답을 써 보세요.',false);return;}
  const hits=keys.filter(([r])=>r.test(t)).map(x=>x[1]);
  if(hits.length>=need){fb(out,'잘 썼어요! 찾은 내용: '+hits.join(', ')+'.',true);if(sec)doneNav(sec);}
  else if(hits.length)fb(out,'찾은 내용: '+hits.join(', ')+'. '+(hint||'조금 더 자세히 써 볼까요?'),'info');
  else fb(out,hint||'오늘 배운 낱말을 넣어 다시 써 봐요.',false);};}
"""

CONTACT = '<p class="hj-contact"><a href="mailto:hongjihee1005@gmail.com" aria-label="이메일 보내기: hongjihee1005@gmail.com">'

FRONT = ('title', 'unit', 'lesson', 'total', 'goal', 'pages', 'blanks')


def parse(path):
    s = open(path, encoding='utf-8').read()
    m = re.match(r'\s*<!--(.*?)-->', s, re.S)
    if not m:
        raise SystemExit(f'{path}: 맨 앞에 머리 주석이 없음')
    meta = {}
    for line in m.group(1).strip().splitlines():
        if ':' in line:
            k, v = line.split(':', 1)
            meta[k.strip()] = v.strip()
    for k in ('title', 'unit', 'lesson', 'total', 'goal', 'pages'):
        if not meta.get(k):
            raise SystemExit(f'{path}: 머리 주석에 {k} 없음')
    body = s[m.end():]
    css = ''.join(re.findall(r'<style[^>]*>.*?</style>', body, re.S))
    body = re.sub(r'<style[^>]*>.*?</style>', '', body, flags=re.S)
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', body, re.S)
    body = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.S).strip()
    return meta, css, body, '\n'.join(scripts)


def wm_img(name):
    """@wm:File:이름.jpg → base64와 출처"""
    key = name.replace('File:', 'File_').replace(' ', '_')
    cands = [p for p in glob.glob(os.path.join(WM, '*')) if not p.endswith('.json')
             and os.path.basename(p).startswith(re.sub(r'[^\w.\-]', '_', key)[:60])]
    if not cands:
        raise SystemExit(f'사진 캐시에 없음: {name}')
    p = cands[0]
    info = {}
    if os.path.exists(p + '.json'):
        info = json.load(open(p + '.json', encoding='utf-8'))
    mime = 'image/png' if p.lower().endswith('.png') else 'image/jpeg'
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(p, 'rb').read()).decode()), info, name


def check(key, meta, css, body, js):
    errs = []
    secs = re.findall(r'<section\b[^>]*>', body)
    if len(secs) < 3:
        errs.append('section이 3개보다 적음')
    for t in secs:
        if 'id="' not in t or 'data-nav="' not in t:
            errs.append('section에 id·data-nav가 없음: ' + t)
    ids = re.findall(r'\bid="([^"]+)"', body)
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        errs.append('겹치는 id: ' + ', '.join(sorted(dup)))
    for name in re.findall(r'\b(?:const|let)\s+(\$\$?|fb|doneNav|faces|pickOne|keyCheck)\b', js):
        errs.append(f'도우미 {name}을(를) 다시 선언함(이미 있음)')
    if re.search(r'https?://(?!commons\.wikimedia\.org|www\.w3\.org)', body + js):
        errs.append('바깥 주소를 씀(사진 출처 말고는 넣지 말 것)')
    if meta.get('blanks'):
        try:
            cfg = json.loads(meta['blanks'])
            for c in cfg:
                for bid in c['ans']:
                    if f'id="{bid}"' not in body:
                        errs.append('blanks의 칸이 본문에 없음: ' + bid)
                if f'id="{c["btn"]}"' not in body:
                    errs.append('blanks의 단추가 본문에 없음: ' + c['btn'])
        except Exception as e:
            errs.append('blanks JSON 오류: %s' % e)
    if errs:
        raise SystemExit(key + ':\n  ' + '\n  '.join(errs))


def build(key, write=True):
    meta, css, body, js = parse(os.path.join(B, 'src', key + '.html'))
    check(key, meta, css, body, js)
    u = int(meta['unit'])
    uname, col, icon = UNITS[u]
    nav = ''.join('<a href="#%s">%s</a>' % (i, html.escape(n))
                  for i, n in re.findall(r'<section\b[^>]*\bid="([^"]+)"[^>]*\bdata-nav="([^"]+)"', body))
    if not nav:
        nav = ''.join('<a href="#%s">%s</a>' % (i, html.escape(n))
                      for n, i in re.findall(r'<section\b[^>]*\bdata-nav="([^"]+)"[^>]*\bid="([^"]+)"', body))
    credits = []

    def img(m):
        data, info, name = wm_img(m.group(1))
        credits.append('<li>%s — %s, %s, <a href="https://commons.wikimedia.org/wiki/%s" target="_blank" rel="noopener">%s</a></li>' % (
            html.escape(info.get('title', name).replace('File:', '')), html.escape(info.get('artist', '')), html.escape(info.get('license') or info.get('lic', '')),
            html.escape(name.replace(' ', '_')), html.escape(name.replace('File:', ''))))
        return 'src="%s"' % data
    body = re.sub(r'src="@wm:([^"]+)"', img, body)
    cred = ''
    if credits:
        cred = '<details class="credits"><summary>📷 사진 출처 (위키미디어 공용 자유 이용 사진)</summary><ul>%s</ul></details>' % ''.join(credits)
    lesson = meta['lesson']
    sub = '4학년 1학기 과학 · %s · %s/%s차시' % (uname, lesson, meta['total'])
    head = open(os.path.join(B, 'parts', 'head_css.html'), encoding='utf-8').read()
    head = head.replace('--navy:#0f3b5c;', '--navy:%s;' % col, 1)
    tail = open(os.path.join(B, 'parts', 'tail.html'), encoding='utf-8').read()
    tail = tail.replace('/*CFG*/[]', meta.get('blanks') or '[]').replace('/*ROOM*/', ROOM)
    out = f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(meta['title'])}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
{head}
{css}
</head>
<body>
<header><div class="wrap">
  {ICON[icon]}
  <div><h1>{html.escape(meta['title'])}</h1><p>{sub}</p></div>
</div></header>
<nav><div class="wrap" id="nav">
  {nav}
</div></nav>

<main class="wrap">
<p class="goal">🎯 <b>학습 목표</b><br>{meta['goal']}</p>

{body}
{cred}
<p class="tip" style="text-align:center">{html.escape(meta['pages'])} 바탕</p>
</main>

<script>{HELPERS}
{js}
</script>
{tail}
</body>
</html>
'''
    assert CONTACT in out
    if write:
        os.makedirs(OUT, exist_ok=True)
        open(os.path.join(OUT, key + '.html'), 'w', encoding='utf-8').write(out)
    return key


def keys():
    return sorted(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(B, 'src', 'u*-*.html')))


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['check']:
        for k in args[1:] or keys():
            build(k, write=False)
        print('점검 끝:', len(args[1:] or keys()), '개')
    else:
        for k in args or keys():
            build(k)
            print('만듦', k)
