#!/usr/bin/env python3
"""4~6학년 과학 실험 준비 길잡이(선생님용) — 교과서 버전 앱 원본으로 만들기 (2026-11-25)

    python3 _build/labguide/build.py 4        # grade4/science/labs.html (먼저 점검)
    python3 _build/labguide/build.py check 4  # 점검만

저절로 읽는 것
  · 교과서 버전 앱 원본 gradeN/science/_build_tb/src/uN-M.html(1학기)·src2/(2학기)
      머리 주석 title·unit·lesson·total·goal·pages, 실험 부분(stage가 실험해요·관찰해요·탐구해요·모형실험·실험하기·
      같은 주제 다른 탐구, 또는 '준비물:'이 있는 활동해요)의 제목(h2), 모든 부분의 '준비물: …'(' · ' 앞까지, 쉼표로 나눔),
      '⚠️ …' 안전 문장(같은 문단의 '💡 …'은 알아 두기로, '※ …'은 버림). 스크립트 안의 글은 읽지 않음.
  · 단원 이름 gradeN/science/_build_tb/units.py(UNITS_BY) — 원본이 하나도 없는 단원은 '곧 열려요' 한 장
  · 탐구 실험관 원본 _build/explore/gN<이름>/src/data.js의 EXPS(node로 읽음): 실험 이름·준비물(tools)·차례(how)
      → prepN.py의 ex로 이은 차시에만. 실험 순서는 이것을 보여 줌(교과서 버전 앱은 차례가 스크립트 안에 있어 못 읽음).
      준비물은 교과서 버전 앱 준비물에 없는 것만 덧붙임.
  · (있으면) 홍지희 버전 원본 lessons_uN.py: 같은 차시의 성취기준 + 수업 링크 (prepN.py의 HONG)
손으로 쓰는 것: prepN.py (kind·why·lead·tip·ex·prep·steps — 짜임은 prep4.py 맨 위)
화면 page_tb.html + page.css + page_tb.css + app.js(저장 키만 학년별로 바꿈). 아래쪽 조각은 _build/origami/의 것.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py gradeN/science/labs.html
"""
import re, sys, json, html, pathlib, subprocess, importlib.util

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))
from prep import WHEN  # 3학년과 같은 때 이름

KINDS = {'실험': '🧪', '측정': '📏', '관찰': '🔍', '조사': '💻', '만들기': '🛠️', '기르기': '🌱', '토의': '💬', '실천': '🤝'}
HANDS = {'실험', '측정', '관찰', '기르기'}  # '손으로 하는 탐구만' 거르기
SEMNAME = {1: '1학기', 2: '2학기'}
# 머리말의 '며칠 걸리는 실험' 예 (학년마다 prepN.py의 '며칠 전'·'일주일 전'·'단원 전' 할 일에서 고름)
LONG = {4: '<b>며칠 걸리는 실험</b>(물의 증발 관찰, 버섯·곰팡이 기르기, 해캄 구하기 등)은',
        5: '<b>날을 골라야 하거나 미리 갖출 것이 많은 실험</b>(햇빛이 드는 날 하는 빛 실험·햇빛과 그늘의 온도 재기, 레이저 지시기·퇴적암 표본·손난로 갖추기 등)은',
        6: '<b>며칠 걸리는 실험</b>(용액에 넣은 물질 일주일 관찰, 파 뿌리 3일 관찰, 백합 줄기·포일 씌운 잎 하루 전 준비, 맑은 날 하루 동안 태양 관찰 등)은'}
EXP_RE = re.compile(r'^(실험해요|관찰해요|탐구해요|모형실험|실험하기(?! 전)|같은 주제 다른 탐구)')
SKIP_RE = re.compile(r'^(형성|스스로|함께|한눈에|평가)')  # 평가 부분은 읽지 않음
NUM_RE = re.compile(r'^[①-⑳]\s*')
LEAD_RE = re.compile(r'^\W+')
esc = lambda s: html.escape(s, quote=True)
INLINE = r'(?:a|abbr|b|bdi|code|em|i|mark|q|s|small|span|strong|sub|sup|u|ruby|rt)'


def txt(h):
    """태그를 지운 글: 글자 안에 붙는 태그(b·span 등)는 빈칸 없이, 그 밖의 태그(p·br·div …)는 빈칸으로"""
    h = re.sub(r'</?' + INLINE + r'\b[^>]*>', '', h)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()


norm = lambda s: re.sub(r'[\s,·()（）/]', '', s)
EX_JS = r"""
const fs=require('fs'),vm=require('vm'),out={};
for(const f of process.argv.slice(1)){const c={};vm.createContext(c);
 vm.runInContext(fs.readFileSync(f,'utf8')+'\n;this.__E=EXPS;',c);
 out[f]=Object.values(c.__E).map(e=>({no:e.no,name:e.name,tools:(e.tools||[]).map(t=>t[1]),how:(e.how||[]).map(t=>t[1])}));}
process.stdout.write(JSON.stringify(out));
"""


def load_py(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


def split_items(s):
    """쉼표로 나누되 괄호 안의 쉼표는 그대로"""
    out, depth, cur = [], 0, ''
    for ch in s:
        if ch in '(（': depth += 1
        elif ch in ')）': depth = max(0, depth - 1)
        if ch == ',' and depth == 0:
            out.append(cur); cur = ''
        else: cur += ch
    out.append(cur)
    return [x.strip().rstrip('.') for x in out if x.strip().rstrip('.')]


TAG_RE = re.compile(r"""<(/?)([a-zA-Z][\w-]*)(?:\s+(?:"[^"]*"|'[^']*'|[^'">])*)?\s*/?>""")
BLOCK_RE = re.compile(r'<(?:/?(?:p|div|li|ul|ol|h\d|table|tr|td|th|section|figure|figcaption|details|summary)|br)\b[^>]*>')
MARK_RE = re.compile(r'(⚠️?|💡|🗓️?|※|[\U0001F300-\U0001FAFF\u2600-\u27BF\u2B50\u23E9-\u23FA]\ufe0f?)')
# 안전·알아 두기에 들어가면 안 되는 '이 화면' 안내 문장 (안전에는 아래 둘 다, 알아 두기에는 SCREEN_RE만)
SCREEN_RE = re.compile(r'(그림을 위한|꾸민 것|흉내 낸|연습용|연습 화면|그림으로 대신|이 화면|이 자료에서 그린|대강의 위치|▶를|영상처럼 봐요)')
SAFE_OUT_RE = re.compile(r'(예시 ?값|예시를 따른|어림값|^실제 (?:측정)?값은|조사하지 않아도|만들어도 좋아요|^준비물\s*[:：])')
NOTEXP_NAV = re.compile(r'(정리|결과|기록|예상|관련|그래프|장단점|까닭|정체|뜻할|기준 정하기|분리 방법|이용할 성질|하는 일|운동하는 물체|빠르기 비교|비교해요|모형과 우리 몸)')
NOTEXP_NAME = re.compile(r'(관련지어|정리해요|기록해요|예상하기|예상해요|이야기해요|나타내요$|기준을 정해요)')
FRONT_RE = re.compile(r'^(도우미|도움말|참고)\s*[:：]\s*')


def plain_tags(h):
    """태그의 속성을 지움(속성 값 안의 ⚠️·💡·'준비물:'을 읽지 않게)"""
    return TAG_RE.sub(lambda m: f'<{m.group(1)}{m.group(2).lower()}>', h)


DROPPED = []  # 점검용: 뺀 문장


def drop_sentences(t, bad):
    """글을 문장(마침표 뒤 빈칸·' · ')으로 나눠 bad에 걸리는 문장을 뺌"""
    parts = re.split(r'(\s+·\s+|(?:(?<=[.!?])|(?<=[.!?]\)))\s+(?=\S))', t)
    keep = []
    for i in range(0, len(parts), 2):
        sent = parts[i].strip()
        if not sent: continue
        if bad.search(sent): DROPPED.append(sent); continue
        keep.append((parts[i - 1] if i and keep else '', sent))
    return ''.join(sep + x for sep, x in keep).strip(' ·')


def marked(chunk):
    """한 문단을 표시 글자로 나눔 → [(표시, 글)] (표시가 없는 앞부분은 '')"""
    t = txt(chunk)
    parts = MARK_RE.split(t)
    out = [('', parts[0].strip())]
    for i in range(1, len(parts), 2):
        out.append((parts[i].rstrip('\ufe0f'), parts[i + 1].strip()))
    return out


def parse_src(path):
    s = path.read_text(encoding='utf-8')
    m = re.match(r'\s*<!--(.*?)-->', s, re.S)
    if not m: raise SystemExit(f'{path}: 맨 앞에 머리 주석이 없음')
    meta = {}
    for line in m.group(1).strip().splitlines():
        if ':' in line:
            k, v = line.split(':', 1); meta[k.strip()] = v.strip()
    body = re.sub(r'<script\b.*?</script>', '', s[m.end():], flags=re.S)
    body = re.sub(r'<style\b.*?</style>', '', body, flags=re.S)
    secs = []
    for sm in re.finditer(r'<section\b[^>]*data-nav="([^"]*)"[^>]*>(.*?)</section>', body, re.S):
        b = sm.group(2)
        st = re.search(r'<span class="stage">(.*?)</span>', b, re.S)
        stage = txt(st.group(1)) if st else ''
        h2 = re.search(r'<h2[^>]*>(.*?)</h2>', b, re.S)
        name = txt(h2.group(1)) if h2 else sm.group(1)
        if SKIP_RE.match(stage) or SKIP_RE.match(sm.group(1)): continue
        # 단추 안 글·속성 값은 읽지 않음 (화면에서 눌러야 나오는 글)
        b = plain_tags(re.sub(r'<button\b.*?</button>', ' ', b, flags=re.S))
        prep = []
        for pm in re.finditer(r'준비물\s*[:：](.*?)(?:<br|</p>|</div>|</li>)', b, re.S):
            t = txt(pm.group(1)).split(' · ')[0]
            t = re.split(r'(?<![\d.])\.\s', t)[0]  # '면장갑. 실험 순서대로 …' 같은 문장 꼬리
            prep += split_items(t)
        is_exp = bool(EXP_RE.match(stage) or EXP_RE.match(sm.group(1)) or (prep and stage.startswith('활동해요')))
        rep = is_exp and not NOTEXP_NAV.search(sm.group(1)) and not NOTEXP_NAME.search(name) and not re.search(r'정리해요|관련짓기', stage)
        safe, note = [], []
        for chunk in BLOCK_RE.split(b):
            if not re.search(r'⚠|💡|🗓', chunk): continue
            segs = marked(chunk)
            has_warn = any(k.startswith('⚠') for k, _ in segs)
            for k, t in segs:
                if not t: continue
                if k.startswith('⚠'):
                    t = drop_sentences(t, re.compile(SCREEN_RE.pattern + '|' + SAFE_OUT_RE.pattern))
                    if t: safe.append(t)
                elif k in ('💡', '🗓'):
                    t = drop_sentences(FRONT_RE.sub('', t), SCREEN_RE)
                    if not t: continue
                    # 따로 있는 '💡 …'은 실험 부분의 긴 글만 (짧은 단추 글·예시 보기는 뺌), 🗓️은 어디서나
                    if k == '💡' and not has_warn and not (is_exp and len(t) >= 12 and '예시' not in t): continue
                    if t not in note: note.append(t)
                # 그 밖의 표시(※, 🖍️·🗺️ 같은 화면 안내)와 표시 앞 글은 버림
        secs.append(dict(nav=sm.group(1), stage=stage, name=name, prep=prep, safe=safe, note=note, exp=is_exp, rep=rep))
    return meta, secs


def explore_data(g, names):
    files = sorted({str(ROOT / '_build' / 'explore' / f'g{g}{n}' / 'src' / 'data.js') for n in names})
    if not files: return {}
    for f in files:
        if not pathlib.Path(f).exists(): sys.exit(f'탐구 실험관 원본이 없음: {f}')
    r = subprocess.run(['node', '-e', EX_JS] + files, capture_output=True, text=True)
    if r.returncode: sys.exit('탐구 실험관 원본을 읽지 못함(node):\n' + r.stderr[-2000:])
    d = json.loads(r.stdout)
    return {pathlib.Path(f).parents[1].name[len(f'g{g}'):]: {e['no']: e for e in v} for f, v in d.items()}


def lessons(g):
    SCI = ROOT / f'grade{g}' / 'science'
    P = load_py(HERE / f'prep{g}.py', f'lg_prep{g}')
    U = load_py(SCI / '_build_tb' / 'units.py', f'lg_units{g}')
    hong = getattr(P, 'HONG', {})
    exnames = {n for sem in P.SEMS.values() for d in sem.values() for n, _ in d.get('ex', [])}
    EX = explore_data(g, exnames)
    LS, SOON = [], []
    for s in (1, 2):
        srcdir = SCI / '_build_tb' / ('src' if s == 1 else 'src2')
        prep = P.SEMS.get(s, {})
        files = sorted(srcdir.glob('u*-*.html'), key=lambda p: [int(x) for x in re.findall(r'\d+', p.stem)])
        hmods = {}
        for f in files:
            meta, secs = parse_src(f)
            for k in ('title', 'unit', 'lesson', 'goal'):
                if not meta.get(k): sys.exit(f'{f}: 머리 주석에 {k} 없음')
            u = int(meta['unit']); stem = f.stem; lesson = meta['lesson']
            uname = re.sub(r'^\d+단원\s*', '', U.UNITS_BY[s][u][0])
            std, hhref = '', ''
            if s in hong:  # 홍지희 버전(같은 차시 묶음)이 있으면 성취기준과 링크
                hdir, hpage = hong[s]
                if u not in hmods: hmods[u] = load_py(SCI / hdir / f'lessons_u{u}.py', f'lg_h{g}{s}{u}')
                hf = f'u{u}-l' + lesson.replace('~', '') + '.html'
                for L in hmods[u].LESSONS:
                    if L['file'] == hf:
                        m = re.search(r'\[\d과\d\d-\d\d\][^<]*', L.get('notes0', ''))
                        std = txt(m.group(0)) if m else ''
                        hhref = f'{hpage}/{hf}'
            D = prep.get(stem)
            exs = []
            for nm, no in (D or {}).get('ex', []):
                e = EX.get(nm, {}).get(no)
                exs.append(dict(page=nm, no=no, e=e))
            LS.append(dict(s=s, sname=SEMNAME[s], u=u, uname=uname, stem=stem, href=f'sem{s}/{f.name}', key=f'tb{g}{s}-{stem}',
                           title=meta['title'], lesson=lesson, cha=f'{lesson}차시', total=meta.get('total', ''),
                           goal=[x.strip() for x in meta['goal'].split('<br>') if x.strip()], pages=meta.get('pages', ''),
                           secs=secs, std=std, hong=hhref, exs=exs, P=D, src=f))
        have = {L['u'] for L in LS if L['s'] == s}
        for u, (nm, *_rest) in U.UNITS_BY[s].items():
            if u not in have: SOON.append(dict(s=s, u=u, uname=re.sub(r'^\d+단원\s*', '', nm) or f'{u}단원'))
    return LS, SOON, P


GEAR = ['햇빛 보안경', '레이저 보안경', '실험용 장갑', '안전 장갑', '면장갑', '실험복', '보안경', '마스크', '장갑']
GEAR_RE = re.compile(r'\s*(' + '|'.join(GEAR) + r')(?=\s|[·,]|와\s|과\s|$)\s*(?:[·,]|와\s|과\s)?\s*')
COUNT_RE = re.compile(r'\s*(?:\d+|한|두|세|네|다섯|여섯)\s*(?:개|장|대|쌍|병|벌)$')


def split_gear(t):
    """'실험복 보안경 실험용 장갑'·'마스크와 보안경'처럼 안전 장비만 이어 적은 항목을 나눔 (다른 것이 섞이면 그대로)"""
    out, i = [], 0
    while i < len(t):
        m = GEAR_RE.match(t, i)
        if not m or m.end() == i: return [t]
        out.append(m.group(1)); i = m.end()
    return out or [t]


def base(t):
    """'홈판 2개'·'홈판과 뚜껑' → '홈판' (겹침 견주기용)"""
    t = COUNT_RE.sub('', t.strip())
    return norm(re.split(r'(?:와|과)\s', t)[0])


def gather(L):
    """한 차시의 준비물 묶음·안전·알아 두기·실험 이름·실험 순서"""
    P = L['P'] or {}
    groups, alltxt = [], ''
    for sc in L['secs']:
        if sc['prep']:
            groups.append((sc['name'], sc['prep'])); alltxt += norm(''.join(sc['prep']))
    extra, bases = [], set()
    notool = set(P.get('notool', []))
    for x in L['exs']:
        for t0 in (x['e'] or {}).get('tools', []):
            for t in split_gear(t0):
                if t in notool or t0 in notool: continue
                if norm(t) in alltxt or base(t) in bases: continue
                toks = [re.sub(r'(가|이|에|을|를|은|는)$', '', w) for w in re.split(r'[\s·,()와과]+', t)]
                toks = [w for w in toks if len(w) >= 2]
                if toks and all(w in alltxt for w in toks): continue  # 낱말이 모두 앱 준비물에 있으면 같은 것으로 봄
                extra.append(t); bases.add(base(t))
    if extra: groups.append(('탐구 실험관에서 더 쓰는 것' if groups else '탐구 실험관 준비물', extra))
    if P.get('prep'): groups.append(('더 챙길 것' if groups else '준비물', P['prep']))
    safe, note = [], []
    for sc in L['secs']:
        for t in sc['safe']:
            if t not in safe: safe.append(t)
        for t in sc['note']:
            if t not in note and not any(t in y for y in safe): note.append(t)
    exps = [sc['name'] for sc in L['secs'] if sc['rep']]
    steps = [(f"탐구 실험관 실험 {x['no']} · {x['e']['name']}", x['e']['how']) for x in L['exs'] if x['e'] and x['e'].get('how')]
    for nm, lst in P.get('steps', []): steps.append((nm + ' (이 자료)', lst))
    return groups, safe, note, exps, steps


def check(g, LS, P):
    bad = []
    stems = {s: {L['stem'] for L in LS if L['s'] == s} for s in (1, 2)}
    for s, d in P.SEMS.items():
        for k in d:
            if k not in stems.get(s, set()): bad.append(f'{SEMNAME[s]} prep{g}.py에 있으나 원본에 없는 차시: {k}')
    for L in LS:
        w = f"{L['sname']} {L['stem']}"
        D = L['P']
        if not D: bad.append(f'{w}: prep{g}.py에 없음(새 차시면 kind·why·lead를 적어 주세요)'); continue
        k = D.get('kind')
        if k not in KINDS: bad.append(f"{w}: kind '{k}'")
        if not D.get('why', '').strip(): bad.append(f'{w}: why 빔')
        for when, what in D.get('lead', []):
            if when not in WHEN: bad.append(f"{w}: lead 때 '{when}'")
            if not what.strip(): bad.append(f'{w}: lead 내용 빔')
        for x in L['exs']:
            if not x['e']: bad.append(f"{w}: 탐구 실험관 {x['page']} 실험 {x['no']}이 원본에 없음")
            elif not (ROOT / f'grade{g}' / 'science' / 'explore' / f"{x['page']}.html").exists(): bad.append(f"{w}: explore/{x['page']}.html 없음")
        groups, safe, note, exps, steps = gather(L)
        if not any(txt(x) for x in L['goal']): bad.append(f'{w}: 학습 목표를 못 찾음')
        if k in HANDS:
            if not groups: bad.append(f'{w}: 손으로 하는 탐구인데 준비물을 못 찾음(원본 \'준비물:\'·탐구 실험관 ex·prep 중 하나)')
            if not exps and not L['exs']: bad.append(f'{w}: 손으로 하는 탐구인데 원본에서 실험 부분을 못 찾음')
        if k in ('실험', '측정') and not steps: bad.append(f'{w}: 실험·측정인데 실험 순서가 없음(탐구 실험관 ex나 prep의 steps)')
        if not (ROOT / f'grade{g}' / 'science' / L['href']).exists(): bad.append(f"{w}: 앱 파일 {L['href']} 없음(교과서 버전 앱을 먼저 빌드)")
        if L['hong'] and not (ROOT / f'grade{g}' / 'science' / L['hong']).exists(): bad.append(f"{w}: 홍지희 버전 {L['hong']} 없음")
    return bad


def card(L):
    P = L['P']; k = P['kind']
    groups, safe, note, exps, steps = gather(L)
    names = ' · '.join(esc(x) for x in exps)
    if not names:  # 실험 부분이 없으면 도입 다음 부분 둘
        rest = [sc['name'] for sc in L['secs'] if not re.match(r'^(도입|정리)', sc['stage'])][:2]
        names = ' · '.join(esc(x) for x in rest)
    lead = ''.join(f'<li><span class="lg-when lg-w{WHEN.index(w)}">{esc(w)}</span>{esc(t)}</li>' for w, t in P.get('lead', []))
    parts = [f'<div class="lg-why"><b>목표와 이어지는 점</b> {esc(P["why"])}</div>']
    if lead: parts.append(f'<div class="lg-box lg-lead"><h3>⏰ 미리 할 일</h3><ul>{lead}</ul></div>')
    if groups:
        items = []
        for gname, lst in groups:
            items.append(f'<li class="lg-pn">{esc(gname)}</li>')
            items += [f'<li><label><input type="checkbox" class="lg-pc"><span>{esc(x)}</span></label></li>' for x in lst]
        parts.append('<div class="lg-box lg-prep"><h3>🧺 준비물</h3><ul>' + ''.join(items) + '</ul></div>')
    if safe: parts.append('<div class="lg-box lg-safe"><h3>⚠️ 안전</h3><ul>' + ''.join(f'<li>{esc(x)}</li>' for x in safe) + '</ul></div>')
    if steps:
        sh = ''.join(f'<h4>{esc(nm)}</h4><ol>' + ''.join(f'<li>{esc(NUM_RE.sub("", x))}</li>' for x in lst) + '</ol>' for nm, lst in steps)
        parts.append(f'<details class="lg-box lg-steps"><summary>🧪 실험 순서</summary>{sh}</details>')
    if note: parts.append('<div class="lg-box lg-note2"><h3>💡 알아 두기 <small>교과서 버전 앱</small></h3><ul>' + ''.join(f'<li>{esc(x)}</li>' for x in note) + '</ul></div>')
    if P.get('tip'): parts.append(f'<div class="lg-box lg-tip"><h3>💡 다르게 나올 때 · 대신 쓸 것</h3><p>{esc(P["tip"])}</p></div>')
    goal = ''.join(f'<li>{esc(txt(x))}</li>' for x in L['goal'])
    links = [f'<a href="{L["href"]}">교과서 버전 앱 →</a>']
    if L['hong']: links.append(f'<a href="{L["hong"]}">홍지희 선생님 버전 →</a>')
    seen = []
    for x in L['exs']:
        if x['page'] in seen: continue
        seen.append(x['page'])
        nos = ', '.join(str(y['no']) for y in L['exs'] if y['page'] == x['page'])
        links.append(f'<a href="explore/{x["page"]}.html">탐구 실험관(실험 {nos}) →</a>')
    tot = f' · {L["lesson"]}/{L["total"]}' if L['total'] else ''
    return (f'<article class="lg-card" id="{L["key"]}" data-s="{L["s"]}" data-u="{L["u"]}" data-hand="{1 if k in HANDS else 0}">'
            f'<header class="lg-ch"><span class="lg-tag">{L["u"]}단원 · {esc(L["cha"])}</span><span class="lg-kind lg-k-{k}">{KINDS[k]} {k}</span>'
            f'<label class="lg-done"><input type="checkbox" class="lg-ok" data-key="{L["key"]}"> 준비 끝</label></header>'
            f'<h2><span class="lg-pt">{L["u"]}단원 {esc(L["cha"])}</span><a href="{L["href"]}">{esc(L["title"])}</a></h2>'
            f'<p class="lg-sub">{L["u"]}단원 {esc(L["uname"])}{esc(tot)}' + (f' · {esc(L["pages"])}' if L['pages'] else '') + '</p>'
            f'<div class="lg-goal"><b>학습 목표</b><ul>{goal}</ul></div>'
            + (f'<p class="lg-std"><b>성취기준</b> {esc(L["std"])}</p>' if L['std'] else '')
            + f'<p class="lg-main"><b>{"대표 실험" if exps and k in HANDS else "주요 활동"}</b> {names}</p>'
            + ''.join(parts) + '<p class="lg-open lg-links">' + ''.join(links) + '</p></article>')


def soon_card(S):
    return (f'<article class="lg-card lg-soon" data-s="{S["s"]}" data-u="{S["u"]}" data-hand="0">'
            f'<header class="lg-ch"><span class="lg-tag">{S["u"]}단원</span></header>'
            f'<h2>' + (f'{S["u"]}단원 ' if S['uname'] != f'{S["u"]}단원' else '') + f'{esc(S["uname"])} <small>곧 열려요</small></h2>'
            '<p class="lg-sub">이 단원의 교과서 버전 앱을 아직 만들지 않았어요. 앱이 생기면 이 길잡이에도 차시가 저절로 들어와요.</p></article>')


def timeline(LS, s):
    rows = []
    for wi, w in enumerate(WHEN):
        if w in ('전날', '수업 직전'): continue  # 차시 카드에서 봄
        items = [(L, t) for L in LS if L['s'] == s for ww, t in L['P'].get('lead', []) if ww == w]
        if not items: continue
        rows.append(f'<div class="lg-tl-row"><h3><span class="lg-when lg-w{wi}">{w}</span></h3><ul>' + ''.join(
            f'<li><a href="#{L["key"]}">{L["u"]}단원 {esc(L["cha"])} · {esc(LEAD_RE.sub("", L["title"]))}</a> — {esc(t)}</li>' for L, t in items) + '</ul></div>')
    return ''.join(rows) or '<p class="lg-note">이 학기에는 미리 시작할 일이 따로 없어요. ‘전날’·‘수업 직전’ 할 일은 차시 카드에 있어요.</p>'


def must_replace(s, a, b, what):
    if a not in s: sys.exit(f'{what}: 바꿀 글을 찾지 못함 — {a[:60]}')
    return s.replace(a, b)


def build(g, LS, SOON, P):
    rd = lambda f: f.read_text(encoding='utf-8')
    OUT = ROOT / f'grade{g}' / 'science' / 'labs.html'
    cards, tls, ubtns = '', '', ''
    for s in (1, 2):
        tls += f'<div class="lg-tl" data-s="{s}">{timeline(LS, s)}</div>'
        units = []
        for L in LS:
            if L['s'] == s and (L['u'], L['uname']) not in units: units.append((L['u'], L['uname']))
        for S in SOON:
            if S['s'] == s: units.append((S['u'], S['uname']))
        units.sort()
        ubtns += f'<div class="lg-units" data-s="{s}"><button type="button" class="lg-ub" data-u="0" aria-pressed="true">전체</button>' + ''.join(
            f'<button type="button" class="lg-ub" data-u="{u}" aria-pressed="false">{esc(nm)}</button>' for u, nm in units) + '</div>'
        cs = [(L['u'], 0, card(L)) for L in LS if L['s'] == s] + [(S['u'], 1, soon_card(S)) for S in SOON if S['s'] == s]
        cards += ''.join(c for *_k, c in sorted(cs, key=lambda x: (x[0], x[1])))
    app = must_replace(rd(HERE / 'app.js'), "var KEY = 'hj-labguide-v1';", f"var KEY = 'hj-labguide-g{g}-v1';", 'app.js')
    app = must_replace(app, 'if (on) { n++;', "if (on && !c.classList.contains('lg-soon')) { n++;", 'app.js')
    foot = must_replace(rd(OG / 'foot.html'), '쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.',
                        f'{g}학년 과학 실험을 준비하는 선생님을 위한 자료입니다. 2022 개정 교육과정, 지도서, 교과서를 바탕으로 했습니다.', 'foot.html')
    soon_txt = ''
    if SOON:
        soon_txt = '<li>아직 교과서 버전 앱이 없는 단원(' + ', '.join(f'{S["s"]}학기 {S["u"]}단원' for S in SOON) + ')은 ‘곧 열려요’로 두었어요.</li>'
    n_hand = sum(1 for L in LS if L['P']['kind'] in HANDS)
    n_ex = sum(1 for L in LS if L['exs'])
    hs = sorted({L['s'] for L in LS if L['hong']})
    hong_txt = ('·홍지희 선생님 버전 수업(' + '·'.join(SEMNAME[x] for x in hs) + ')') if hs else ''
    hongprep = '·홍지희 선생님 버전 교사 안내(' + '·'.join(SEMNAME[x] for x in sorted(getattr(P, 'HONG', {}))) + ')' if getattr(P, 'HONG', None) else ''
    rep = {'HONGTXT': hong_txt, 'HONGPREP': hongprep, 'LONG': LONG[g], 'CARDS': cards, 'TL': tls, 'UBTNS': ubtns, 'G': str(g), 'NALL': str(len(LS)), 'NHAND': str(n_hand), 'NEX': str(n_ex),
           'NS1': str(sum(1 for L in LS if L['s'] == 1)), 'NS2': str(sum(1 for L in LS if L['s'] == 2)), 'SOON': soon_txt,
           'CSS': rd(HERE / 'page.css') + rd(HERE / 'page_tb.css'), 'APP': app, 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': foot, 'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z0-9]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page_tb.html'))
    if '종이접기' in s: sys.exit('꼬리말에 종이접기 문장이 남음')
    old = OUT.read_text(encoding='utf-8') if OUT.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-(c(?:theme|icons)|emfont)-->.*?<!--/hj-\1-->', '', t, flags=re.S)
    if strip(old) == s: return False
    OUT.write_text(s, encoding='utf-8'); return True


def main(g, only_check):
    if not (HERE / f'prep{g}.py').exists(): sys.exit(f'{g}학년: _build/labguide/prep{g}.py가 없음')
    LS, SOON, P = lessons(g)
    bad = check(g, LS, P)
    if bad: print('\n'.join(bad)); sys.exit(f'{g}학년 실험 준비 길잡이 점검 실패')
    print(f'{g}학년 실험 준비 길잡이 점검 통과 (차시 {len(LS)}개' + (f', 곧 열려요 단원 {len(SOON)}개' if SOON else '') + ')')
    if only_check: return
    print(f'{g}학년 실험 준비 길잡이 ' + ('다시 만듦' if build(g, LS, SOON, P) else '바뀐 것 없음') + f': grade{g}/science/labs.html')
