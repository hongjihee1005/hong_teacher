#!/usr/bin/env python3
"""한자 급수(한국어문회) — 급수별 자료 만들기 (2026-10-04)

    python3 gen.py check        # 13개 급 × 모의시험 20회를 만들어 점검(문항 수·정답·중복·글자 범위)
    python3 gen.py show 8 1     # 8급 1회 시험지를 글로 보기 (급 id: 8, 7-2, 7, 6-2, 6, 5-2, 5, 4-2, 4, 3-2, 3, 2, 1)

자료: data/hanja.csv(한국어문회 급수별 배정한자 — 공식 홈페이지 엑셀을 rycont/hanja-grade-dataset이 CSV로 옮긴 것),
      data/words.tsv(한자어·독음, words.py가 libhangul에서 고름), extra.py(반대·상대 한자 짝, 약자, 부수 이름표).
같은 자료면 언제나 같은 시험지가 나옵니다(급·회차마다 정해진 씨앗으로 섞음).
"""
import ast, csv, sys, json, random, pathlib, unicodedata as ud
from extra import PAIRS, YAK, RADV
HERE = pathlib.Path(__file__).resolve().parent
N = lambda s: ud.normalize('NFC', s)

# (id, 이름, 문항 수, 합격 문항 수, 유형별 문항 수, 쓰기 범위(이 급까지의 한자에서 한자 쓰기 문제를 냄))
# 문항 수·합격 기준은 한국어문회 안내(2~8급 70%, 1급 80%). 유형 나눔은 연습용으로 정한 것입니다.
LEVELS = [
  ('8',   '8급',  50,  35, dict(R=24, H=24, A=2), None),
  ('7-2', '7급Ⅱ', 60,  42, dict(R=22, H=30, A=4, C=4), None),
  ('7',   '7급',  70,  49, dict(R=32, H=30, A=4, C=4), None),
  ('6-2', '6급Ⅱ', 80,  56, dict(R=32, H=28, W=10, A=4, C=6), 0),
  ('6',   '6급',  90,  63, dict(R=33, H=30, W=15, A=4, C=8), 2),
  ('5-2', '5급Ⅱ', 100, 70, dict(R=35, H=23, W=20, A=6, C=8, S=4, Y=4), 3),
  ('5',   '5급',  100, 70, dict(R=35, H=23, W=20, A=6, C=8, S=4, Y=4), 4),
  ('4-2', '4급Ⅱ', 100, 70, dict(R=30, H=22, W=20, A=6, C=8, B=4, S=4, Y=6), 5),
  ('4',   '4급',  100, 70, dict(R=30, H=22, W=20, A=6, C=8, B=4, S=4, Y=6), 6),
  ('3-2', '3급Ⅱ', 150, 105, dict(R=45, H=27, W=30, A=10, C=15, B=6, S=6, Y=11), 7),
  ('3',   '3급',  150, 105, dict(R=45, H=27, W=30, A=10, C=15, B=6, S=6, Y=11), 8),
  ('2',   '2급',  150, 105, dict(R=45, H=27, W=30, A=10, C=15, B=6, S=6, Y=11), 10),
  ('1',   '1급',  200, 160, dict(R=60, H=42, W=40, A=10, C=15, B=10, S=13, Y=10), 11),
]
LVNAME = [x[1] for x in LEVELS]
EXAMS = 20
ORDER = 'RHWACBSY'
GUIDE = {
  'R': '다음 한자어(漢字語)의 독음(讀音: 읽는 소리)을 쓰세요.',
  'H': '다음 한자(漢字)의 훈(訓: 뜻)과 음(音: 소리)을 쓰세요.',
  'W': '다음 훈(訓)과 음(音)에 맞는 한자(漢字)를 쓰세요.',
  'A': '다음 한자와 뜻이 반대(또는 상대)되는 한자를 골라 번호를 쓰세요.',
  'C': '(   ) 안에 알맞은 한자를 골라 한자어를 완성하세요. [ ] 안은 읽는 소리예요.',
  'B': '다음 한자의 부수(部首)를 골라 번호를 쓰세요.',
  'S': '다음 한자어와 소리는 같지만 뜻이 다른 한자어를 골라 번호를 쓰세요.',
  'Y': '다음 한자의 약자(略字: 획을 줄인 글자)를 골라 번호를 쓰세요.',
}

def clean(s):
    for b in '([':
        i = s.find(b)
        if i > 0: s = s[:i]
    return s.strip()

CH = {}   # 한자 → dict(lv, hun=[(훈, 음)…], rad, st)
for r in csv.DictReader(open(HERE / 'data' / 'hanja.csv', encoding='utf-8')):
    if r['level'] not in LVNAME: continue
    h = N(r['hanja']); m = ast.literal_eval(r['meaning'])
    CH[h] = dict(lv=LVNAME.index(r['level']), hun=[(hs, [clean(x) for x in ss]) for hs, ss in m], rad=N(r['radical']), st=int(r['total_strokes']))
WORDS = []   # (한자어, 독음, 빈도, 가장 높은 급)
for line in open(HERE / 'data' / 'words.tsv', encoding='utf-8'):
    if line.startswith('#'): continue
    w, rd, f = line.rstrip('\n').split('\t')
    WORDS.append((w, rd, int(f), max(CH[c]['lv'] for c in w)))
BYREAD = {}
for w in WORDS: BYREAD.setdefault(w[1], []).append(w[0])

from dueum import dueum
def sounds(h):
    """그 한자의 음 모두(두음법칙 꼴 포함)"""
    out = set()
    for hs, ss in CH[h]['hun']:
        for s in ss: out |= {s, dueum(s)}
    return out
def hun_text(h):
    """'집 가' 꼴 정답 목록(첫째가 대표)"""
    out = []
    for hs, ss in CH[h]['hun']:
        for t in hs:
            for s in ss:
                for tt in dict.fromkeys([clean(t), t]):
                    for x in dict.fromkeys([s, dueum(s)]): out.append(tt + ' ' + x)
    return list(dict.fromkeys(out))
def rad_label(r): return RADV.get(r, r)

def deal(pool, k, rng, key=lambda x: x):
    """pool을 섞어 차례로 나눠 줌(다 쓰면 다시 섞음). 한 회 안에서는 겹치지 않게."""
    st = {'q': [], 'pool': pool}
    def take(n, ok=lambda x: True):
        got, seen, guard = [], set(), 0
        if not st['pool']: return got
        while len(got) < n and guard < 50 * (n + 5):
            guard += 1
            if not st['q']: st['q'] = st['pool'][:]; rng.shuffle(st['q'])
            x = st['q'].pop()
            if key(x) in seen or not ok(x): continue
            seen.add(key(x)); got.append(x)
        return got
    return take

def level(i):
    lid, name, total, pas, mix, wr = LEVELS[i]
    new = [h for h, c in CH.items() if c['lv'] == i]
    cum = [h for h, c in CH.items() if c['lv'] <= i]
    low = [h for h in cum if CH[h]['lv'] < i]
    words = [w for w in WORDS if w[3] <= i]
    # 익히기: 새 한자 + 그 한자가 든 낱말(빈도 높은 3개)
    learn = []
    for h in new:
        ws = [(w[0], w[1]) for w in words if h in w[0]][:3]
        learn.append([h, [[hs, ss] for hs, ss in CH[h]['hun']], rad_label(CH[h]['rad']), CH[h]['st'], ws])
    rng = random.Random(1000 + i)
    # 섞어 나눠 줄 꾸러미
    wnew = [w for w in words if w[3] == i]; wlow = [w for w in words if w[3] < i]
    topn = lambda L, n: L[:max(n, len(L) * 2 // 3)]
    takeRn = deal(topn(wnew, 300), 0, rng, key=lambda w: w[0]); takeRl = deal(topn(wlow, 400), 0, rng, key=lambda w: w[0])
    takeHn = deal(new, 0, rng); takeHl = deal(low or new, 0, rng)
    wrange = [h for h in cum if wr is not None and CH[h]['lv'] <= wr]
    huns = {}
    for h in wrange: huns.setdefault(hun_text(h)[0], []).append(h)
    wok = [h for h in wrange if len(huns[hun_text(h)[0]]) == 1]
    wtop = [h for h in wok if wr is not None and CH[h]['lv'] >= max(0, wr - 1)]
    takeW = deal(wtop if len(wtop) >= 60 else wok, 0, rng)
    pairs = [p for p in PAIRS if all(c in CH and CH[c]['lv'] <= i for c in p)]
    takeA = deal(pairs, 0, rng)
    partner = {}
    for a, b in pairs: partner.setdefault(a, set()).add(b); partner.setdefault(b, set()).add(a)
    allpair = {}
    for a, b in PAIRS: allpair.setdefault(a, set()).add(b); allpair.setdefault(b, set()).add(a)
    takeC = deal(topn(wnew, 200) + topn(wlow, 150), 0, rng, key=lambda w: w[0])
    near = [h for h in cum if CH[h]['lv'] >= i - 2] or cum
    radn = [h for h in cum if CH[h]['lv'] >= i - 1 and CH[h]['rad'] != h]
    takeB = deal(radn, 0, rng)
    rads = sorted({CH[h]['rad'] for h in cum})
    homo = [w for w in words if len(BYREAD[w[1]]) > 1 and any(x != w[0] and all(CH[c]['lv'] <= i for c in x) for x in BYREAD[w[1]])]
    homo = [w for w in homo if w[2] >= 3000] or homo
    takeS = deal(homo, 0, rng, key=lambda w: w[0])
    yak = [h for h in YAK if h in CH and CH[h]['lv'] <= i]
    takeY = deal(yak, 0, rng)
    exams = []
    for e in range(EXAMS):
        r = random.Random((i + 1) * 7919 + e)
        sec = []
        for t in ORDER:
            n = mix.get(t, 0)
            if not n: continue
            items = []
            if t == 'R':
                k = round(n * .6) if wnew else 0
                got = takeRn(k) + takeRl(n - k)
                if len(got) < n:
                    have = {x[0] for x in got}; got += takeRn(n - len(got), lambda w: w[0] not in have)
                r.shuffle(got)
                items = [dict(q=w[0], a=w[1]) for w in got]
            elif t == 'H':
                k = round(n * .6)
                got = takeHn(k) + (takeHl(n - k) if low else [])
                if len(got) < n:
                    have = set(got); got += takeHn(n - len(got), lambda h: h not in have)
                r.shuffle(got)
                items = [dict(q=h, a=hun_text(h)) for h in got]
            elif t == 'W':
                items = [dict(q=hun_text(h)[0], a=h) for h in takeW(n)]
            elif t == 'A':
                usedq = set()
                for a, b in takeA(n * 3):
                    if len(items) == n: break
                    q, ans = (a, b) if r.random() < .5 else (b, a)
                    if q in usedq: q, ans = ans, q
                    if q in usedq: continue
                    usedq.add(q)
                    bad = allpair.get(q, set()) | {q}
                    ds = [h for h in r.sample(near, min(len(near), 40)) if h not in bad and h != ans][:3]
                    o = ds + [ans]; r.shuffle(o)
                    items.append(dict(q=q, o=o, a=o.index(ans)))
            elif t == 'C':
                usedq = set()
                for w in takeC(n * 2):
                    if len(items) == n: break
                    pos = [k for k, c in enumerate(w[0]) if CH[c]['lv'] == max(CH[x]['lv'] for x in w[0])]
                    p = r.choice(pos); ans = w[0][p]; syl = w[1][p] if len(w[1]) == len(w[0]) else None
                    if syl is None: continue
                    ds = []
                    for h in r.sample(near, min(len(near), 60)):
                        if h == ans or h in w[0] or syl in sounds(h) or dueum(syl) in sounds(h): continue
                        ds.append(h)
                        if len(ds) == 3: break
                    q = w[0][:p] + '（　）' + w[0][p + 1:]
                    if q in usedq or len(ds) < 3: continue
                    usedq.add(q); o = ds + [ans]; r.shuffle(o)
                    items.append(dict(q=q, r=w[1], o=o, a=o.index(ans), w=w[0]))
            elif t == 'B':
                for h in takeB(n):
                    ans = CH[h]['rad']
                    ds = [x for x in r.sample(rads, min(len(rads), 20)) if x != ans and x != h][:3]
                    o = [rad_label(x) for x in ds + [ans]]; r.shuffle(o)
                    items.append(dict(q=h, o=o, a=o.index(rad_label(ans))))
            elif t == 'S':
                for w in takeS(n):
                    mates = [x for x in BYREAD[w[1]] if x != w[0] and all(CH[c]['lv'] <= i for c in x)]
                    ans = r.choice(mates)
                    ds = []
                    for x in r.sample(words, 80):
                        if x[1] != w[1] and x[0] != w[0] and len(x[0]) == len(w[0]) and x[0] not in ds: ds.append(x[0])
                        if len(ds) == 3: break
                    o = ds + [ans]; r.shuffle(o)
                    items.append(dict(q=w[0], o=o, a=o.index(ans), r=w[1]))
            elif t == 'Y':
                for h in takeY(n):
                    ans = YAK[h]
                    ds = [YAK[x] for x in r.sample(list(YAK), 12) if x != h][:3]
                    o = ds + [ans]; r.shuffle(o)
                    items.append(dict(q=h, o=o, a=o.index(ans)))
            sec.append(dict(t=t, g=GUIDE[t], items=items))
        exams.append(sec)
    return dict(id=lid, name=name, total=total, pass_=pas, nnew=len(new), ncum=len(cum), learn=learn, exams=exams,
                wr=LVNAME[wr] if wr is not None else None)

def check():
    bad = 0
    for i, L in enumerate(LEVELS):
        d = level(i); tot = 0
        for e, sec in enumerate(d['exams']):
            n = sum(len(s['items']) for s in sec)
            if n != L[2]: print(L[1], e + 1, '문항 수', n, '≠', L[2]); bad += 1
            for s in sec:
                if len(s['items']) != L[4][s['t']]: print(L[1], e + 1, s['t'], len(s['items']), '≠', L[4][s['t']]); bad += 1
                qs = [x['q'] for x in s['items']]
                if len(set(qs)) != len(qs): print(L[1], e + 1, s['t'], '겹침'); bad += 1
                for x in s['items']:
                    for c in (x.get('w') or x['q']):
                        if c in CH and CH[c]['lv'] > i: print(L[1], '범위 밖 글자', c); bad += 1
                    if 'o' in x:
                        if len(x['o']) != 4 or len(set(x['o'])) != 4 or not 0 <= x['a'] < 4: print(L[1], e + 1, s['t'], '보기 오류', x); bad += 1
            tot += n
        print(f"{L[1]}: 새 한자 {d['nnew']} · 누적 {d['ncum']} · 시험 {EXAMS}회 × {L[2]}문항")
    miss = [c for p in PAIRS for c in p if c not in CH] + [c for c in YAK if c not in CH]
    if miss: print('배정한자에 없는 글자(문제로 안 나옴):', ''.join(dict.fromkeys(miss)))
    print('문제', bad); return bad

def show(lid, e):
    i = [x[0] for x in LEVELS].index(lid); d = level(i)
    n = 0
    for s in d['exams'][e - 1]:
        print('■', s['g'])
        for x in s['items']:
            n += 1; o = ' '.join('①②③④'[k] + v for k, v in enumerate(x['o'])) if 'o' in x else ''
            a = '①②③④'[x['a']] if 'o' in x else (x['a'] if isinstance(x['a'], str) else x['a'][0])
            print(f"  {n}. {x['q']} {('['+x['r']+']') if x.get('r') and s['t']=='C' else ''} {o}  → {a}")

if __name__ == '__main__':
    if sys.argv[1:2] == ['check']: sys.exit(1 if check() else 0)
    if sys.argv[1:2] == ['show']: show(sys.argv[2], int(sys.argv[3]))
