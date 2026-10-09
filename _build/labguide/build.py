#!/usr/bin/env python3
"""3학년 과학 실험 준비 길잡이(선생님용) 만들기 (2026-10-09)

    python3 _build/labguide/build.py          # grade3/science/labs.html (먼저 점검)
    python3 _build/labguide/build.py check    # 점검만

학습 목표·준비물·실험 순서·안전은 두 학기 원본에서 저절로 읽습니다:
  1학기 grade3/science/_build_hong/lessons_uN.py · 2학기 grade3/science/_build_hong2/lessons_uN.py
차시마다 실험 종류·목표와 이어지는 점·미리 할 일·대신 쓸 것은 prep.py(손으로 씀).
화면 page.html·page.css·app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씀.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import re, sys, html, pathlib, importlib.util
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
SCI = ROOT / 'grade3' / 'science'
OUT = SCI / 'labs.html'
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))
from prep import S1, S2, WHEN

KINDS = {'실험': '🧪', '측정': '📏', '관찰': '🔍', '조사': '💻', '만들기': '🛠️', '기르기': '🌱', '토의': '💬'}
HANDS = {'실험', '측정', '관찰', '기르기'}  # '손으로 하는 탐구만' 거르기
SEMS = [(1, '1학기', '_build_hong', 'sem1-hong', S1), (2, '2학기', '_build_hong2', 'sem2-hong', S2)]
esc = lambda s: html.escape(s, quote=True)
txt = lambda h: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()

def load(sem_dir, n):
    p = SCI / sem_dir / f'lessons_u{n}.py'
    spec = importlib.util.spec_from_file_location(f'lg_{sem_dir}_{n}', p)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m

def section(notes, head):
    """notes0에서 <h3>head…</h3> 바로 뒤의 <ul>…</ul> 또는 <p>…</p> (제목 괄호 속 출처도 돌려줌)"""
    m = re.search(r'<h3>(' + head + r'[^<]*)</h3>\s*(<ul>.*?</ul>|<p>.*?</p>)', notes, re.S)
    if not m: return '', ''
    body = m.group(2)
    src = re.search(r'\(([^)]*)\)', m.group(1))
    src = src.group(1) if src else ''
    if body.startswith('<p>'):  # 문단 하나 → 항목 하나, 끝의 '(지도서 ○쪽)'은 출처로
        t = body[3:-4].strip(); e = re.search(r'\s*\((지도서[^)]*)\)$', t)
        if e: t, src = t[:e.start()], src or e.group(1)
        body = f'<ul><li>{t}</li></ul>'
    return body, src

def clean_ul(u):
    """원본 목록을 그대로 쓰되 b·i·br만 남기고 나머지 태그는 지움"""
    items = re.findall(r'<li>(.*?)</li>', u, re.S)
    keep = lambda s: re.sub(r'<(?!/?(?:b|i|br)\b)[^>]+>', '', s).strip()
    return [keep(i) for i in items if txt(i)]

def lessons():
    out = []
    for s, sname, bdir, adir, prep in SEMS:
        for n in range(1, 5):
            m = load(bdir, n)
            for L in m.LESSONS:
                P = prep.get(L['file'])
                notes = L.get('notes0', '')
                goal_ul, goal_src = section(notes, '학습 목표')
                prep_ul, prep_src = section(notes, '준비물')
                labs = [st for st in L['steps'] if st['k'] == 'lab']
                safe = []
                for st in L['steps']:
                    for x in st.get('safe', []):
                        if x not in safe: safe.append(x)
                for li in re.findall(r'<li>(.*?)</li>', notes, re.S):  # 지도상의 유의점 속 '안전:' 문장
                    t = txt(li)
                    if t.startswith('안전'):
                        t = re.sub(r'^안전\s*(\([^)]*\))?\s*[:：]?\s*', '', t)
                        if t and t not in safe: safe.append(t)
                main = labs or [st for st in L['steps'] if st['k'] in ('task', 'cards', 'design')][:1]
                short = re.search(r'(\d+(?:~\d+)?차시)', L['sub'])
                std = re.search(r'\[4과\d\d-\d\d\][^<]*', notes)
                out.append(dict(s=s, sname=sname, u=n, uname=m.TOPIC['name'], file=L['file'], href=f'{adir}/{L["file"]}',
                                key=L['lessonKey'], title=L['title'], sub=L['sub'], cha=short.group(1) if short else L['short'],
                                goal=clean_ul(goal_ul) or [L.get('goal', '')], goal_src=goal_src,
                                prep=clean_ul(prep_ul), prep_src=prep_src, std=txt(std.group(0)) if std else '', labs=labs, main=main, safe=safe, P=P))
    return out

def check(LS):
    bad = []
    for s, sname, bdir, adir, prep in SEMS:
        files = {L['file'] for L in LS if L['s'] == s}
        for f in prep:
            if f not in files: bad.append(f'{sname} prep.py에 있으나 원본에 없는 차시: {f}')
    for L in LS:
        w = f"{L['sname']} {L['file']}"
        P = L['P']
        if not P: bad.append(f'{w}: prep.py에 없음(새 차시면 kind·why·lead를 적어 주세요)'); continue
        if P.get('kind') not in KINDS: bad.append(f"{w}: kind '{P.get('kind')}'")
        if not P.get('why', '').strip(): bad.append(f'{w}: why 빔')
        for when, what in P.get('lead', []):
            if when not in WHEN: bad.append(f"{w}: lead 때 '{when}'")
            if not what.strip(): bad.append(f'{w}: lead 내용 빔')
        if not L['std']: bad.append(f'{w}: 원본 교사 안내에서 성취기준을 못 찾음')
        if not L['prep']: bad.append(f'{w}: 원본 교사 안내에서 준비물을 못 찾음')
        if not any(txt(g) for g in L['goal']): bad.append(f'{w}: 학습 목표를 못 찾음')
        if P.get('kind') in ('실험', '측정') and not L['labs']: bad.append(f'{w}: 실험·측정인데 원본에 실험 단계(lab)가 없음')
        if not (SCI / L['href']).exists(): bad.append(f"{w}: 수업 파일 {L['href']} 없음")
    return bad

def is_note(t):
    """준비물 목록 가운데 체크할 물건이 아니라 설명 문장인 줄 (준비물 길잡이·지도상의 유의점 등)"""
    if re.match(r'(준비물 길잡이|지도상의 유의점|참고 누리집|「실험관찰」 \d)', t) and not re.search(r'(모둠별|개인별|학급별)', t[:30]): return True
    return bool(re.search(r'(다|요|음)\.?\s*(\([^)]*\))?\.?$', t)) and not re.match(r'(모둠별|개인별|학급별|실험 ①|실험 ②|공기 실험|물·책상 실험|\[)', t)

def card(L):
    P = L['P']; k = P['kind']
    names = ' · '.join(esc(st.get('hd') or st['t']) for st in L['main'])
    mins = sum(st.get('min', 0) for st in L['labs'])
    steps = ''
    for st in L['labs']:
        steps += f'<h4>{esc(st.get("hd") or st["t"])}' + (f' <small>{st.get("min")}분</small>' if st.get('min') else '') + '</h4>'
        steps += '<ol>' + ''.join(f'<li>{esc(re.sub(r"^[①-⑳]\s*", "", x))}</li>' for x in st.get('list', [])) + '</ol>'
    lead = ''.join(f'<li><span class="lg-when lg-w{WHEN.index(w)}">{esc(w)}</span>{esc(t)}</li>' for w, t in P.get('lead', []))
    parts = [f'<div class="lg-why"><b>목표와 이어지는 점</b> {esc(P["why"])}</div>']
    if lead: parts.append(f'<div class="lg-box lg-lead"><h3>⏰ 미리 할 일</h3><ul>{lead}</ul></div>')
    items = []
    for x in L['prep']:
        t = txt(x)
        if re.match(r'안전\s*(\([^)]*\))?\s*[:：]', t): continue  # 안전 상자로
        if is_note(t): items.append(f'<li class="lg-pn">{x}</li>')
        else: items.append(f'<li><label><input type="checkbox" class="lg-pc"><span>{x}</span></label></li>')
    parts.append(f'<div class="lg-box lg-prep"><h3>🧺 준비물' + (f' <small>{esc(L["prep_src"])}</small>' if L['prep_src'] else '') + '</h3><ul>' + ''.join(items) + '</ul></div>')
    if L['safe']: parts.append('<div class="lg-box lg-safe"><h3>⚠️ 안전</h3><ul>' + ''.join(f'<li>{esc(x)}</li>' for x in L['safe']) + '</ul></div>')
    if steps: parts.append(f'<details class="lg-box lg-steps"><summary>🧪 실험 순서 (수업 화면과 같음)</summary>{steps}</details>')
    if P.get('tip'): parts.append(f'<div class="lg-box lg-tip"><h3>💡 다르게 나올 때 · 대신 쓸 것</h3><p>{esc(P["tip"])}</p></div>')
    goal = ''.join(f'<li>{g}</li>' for g in L['goal'])
    return (f'<article class="lg-card" id="{L["key"]}" data-s="{L["s"]}" data-u="{L["u"]}" data-hand="{1 if k in HANDS else 0}">'
            f'<header class="lg-ch"><span class="lg-tag">{L["u"]}단원 · {esc(L["cha"])}</span><span class="lg-kind lg-k-{k}">{KINDS[k]} {k}</span>'
            f'<label class="lg-done"><input type="checkbox" class="lg-ok" data-key="{L["key"]}"> 준비 끝</label></header>'
            f'<h2><span class="lg-pt">{L["u"]}단원 {esc(L["cha"])}</span><a href="{L["href"]}">{esc(L["title"])}</a></h2>'
            f'<p class="lg-sub">{esc(L["sub"])}</p>'
            f'<div class="lg-goal"><b>학습 목표</b>' + (f' <small>{esc(L["goal_src"])}</small>' if L['goal_src'] else '') + f'<ul>{goal}</ul></div>'
            f'<p class="lg-std"><b>성취기준</b> {esc(L["std"])}</p>'
            f'<p class="lg-main"><b>{"대표 실험" if L["labs"] else "주요 활동"}</b> {names}' + (f' <small>· 실험 시간 약 {mins}분</small>' if mins else '') + '</p>'
            + ''.join(parts) + f'<p class="lg-open"><a href="{L["href"]}">수업 화면 열기 →</a></p></article>')

def timeline(LS, s):
    rows = []
    for wi, w in enumerate(WHEN):
        if w in ('전날', '수업 직전'): continue  # 차시 카드에서 봄
        items = [(L, t) for L in LS if L['s'] == s for ww, t in L['P'].get('lead', []) if ww == w]
        if not items: continue
        rows.append(f'<div class="lg-tl-row"><h3><span class="lg-when lg-w{wi}">{w}</span></h3><ul>' + ''.join(
            f'<li><a href="#{L["key"]}">{L["u"]}단원 {esc(L["cha"])} · {esc(re.sub(r"^\W+", "", L["title"]))}</a> — {esc(t)}</li>' for L, t in items) + '</ul></div>')
    return ''.join(rows)

def build(LS):
    rd = lambda f: f.read_text(encoding='utf-8')
    cards, tls, ubtns = '', '', ''
    for s, sname, *_ in SEMS:
        tls += f'<div class="lg-tl" data-s="{s}">{timeline(LS, s)}</div>'
        units = []
        for L in LS:
            if L['s'] == s and (L['u'], L['uname']) not in units: units.append((L['u'], L['uname']))
        ubtns += f'<div class="lg-units" data-s="{s}"><button type="button" class="lg-ub" data-u="0" aria-pressed="true">전체</button>' + ''.join(
            f'<button type="button" class="lg-ub" data-u="{u}" aria-pressed="false">{esc(nm)}</button>' for u, nm in units) + '</div>'
        cards += ''.join(card(L) for L in LS if L['s'] == s)
    n_hand = sum(1 for L in LS if L['P']['kind'] in HANDS)
    n_lab = sum(1 for L in LS if L['labs'])
    rep = {'CARDS': cards, 'TL': tls, 'UBTNS': ubtns, 'NALL': str(len(LS)), 'NHAND': str(n_hand), 'NLAB': str(n_lab),
           'NS1': str(sum(1 for L in LS if L['s'] == 1)), 'NS2': str(sum(1 for L in LS if L['s'] == 2)),
           'CSS': rd(HERE / 'page.css'), 'APP': rd(HERE / 'app.js'), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '3학년 과학 실험을 준비하는 선생님을 위한 자료입니다. 2022 개정 교육과정, 지도서, 교과서를 바탕으로 했습니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z0-9]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    old = OUT.read_text(encoding='utf-8') if OUT.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    OUT.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    LS = lessons()
    bad = check(LS)
    if bad: print('\n'.join(bad)); sys.exit('실험 준비 길잡이 점검 실패')
    print(f'실험 준비 길잡이 점검 통과 (차시 {len(LS)}개)')
    if sys.argv[1:] == ['check']: sys.exit(0)
    print('실험 준비 길잡이 ' + ('다시 만듦' if build(LS) else '바뀐 것 없음') + ': grade3/science/labs.html')
