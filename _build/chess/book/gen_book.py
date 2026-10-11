# -*- coding: utf-8 -*-
"""체스 학습관 교재(한글 HWPX) 만들기 — 학생용 교재(끝에 정답) · 선생님용 지도서

    python3 _build/chess/book/gen_book.py m1        # special/chess/book/체스_1마당_학생용교재.hwpx · 체스_1마당_지도서.hwpx

- 내용은 학습관 원본(_build/chess/m1.js …)에서 export.js로 뽑아 씁니다(학습관을 고치면 교재도 다시 만들면 됨).
  연습 문제는 차시마다 정해진 씨앗으로 만든 5문제라 다시 만들어도 같습니다.
- 판 그림은 학습관과 같은 board.js로 shots.js가 PNG를 찍어 넣습니다(그림 이름 = 내용의 해시, 캐시 _build/chess/book/img/).
- 지도서의 자주 하는 실수·지도 도움말·발문은 guide_m1.py …에 손으로 씁니다.
- 한글 파일 틀은 4학년 수학 활동지 도구(grade4/math/_build/sheets/hwpxgen.py, 3학년 활동지와 같은 글꼴·표 모양)를 그대로 씁니다.
"""
import sys, os, re, json, hashlib, subprocess, datetime, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'grade4', 'math', '_build', 'sheets'))
import hwpxgen as H  # noqa: E402

IMG = os.path.join(HERE, 'img')
OUT = os.path.join(ROOT, 'special', 'chess', 'book')
SITE = 'https://hongjihee1005.github.io/hong_teacher/special/chess/'
STAMP = datetime.datetime(2026, 10, 11, 0, 0, 0, tzinfo=datetime.timezone.utc)   # 같은 내용이면 같은 파일이 나오게
KIND = {'easy': ('쉬운 조작', '10초 · 10초 · 10초'), 'one': ('한 수 생각', '15초 · 15초 · 15초'), 'deep': ('깊은 생각', '20초 · 20초 · 20초')}
NUM = '①②③④⑤⑥⑦⑧⑨⑩'
EMOJI = re.compile('[\U0001F000-\U0001FFFF️‍☀-☄☇-✒✔-➿⬀-⯿⏩-⏿]')


def clean(t):
    """한글 문서에 맞게: 그림 글자(이모지) 빼기(★☆○● 등은 남김)."""
    return re.sub(r'\s+', ' ', EMOJI.sub('', t or '')).strip()


# ---------------------------------------------------------------- 그림
class Pics:
    def __init__(self):
        self.list = []

    def board(self, b, marks=None):
        b = dict(b)
        if marks is not None:
            b['marks'] = marks
        key = json.dumps(b, sort_keys=True, ensure_ascii=False)
        f = 'b' + hashlib.sha1(key.encode('utf-8')).hexdigest()[:14] + '.png'
        self.list.append({'f': f, 'board': b})
        return os.path.join(IMG, f)

    def big(self, cs):
        f = 'p' + ''.join('w' + c if c.isupper() else 'b' + c for c in cs) + '.png'
        self.list.append({'f': f, 'big': cs})
        return os.path.join(IMG, f)

    def shoot(self):
        os.makedirs(IMG, exist_ok=True)
        uniq = {x['f']: x for x in self.list}
        lf = os.path.join(IMG, '_list.json')
        with open(lf, 'w', encoding='utf-8') as f:
            json.dump(list(uniq.values()), f, ensure_ascii=False)
        r = subprocess.run(['node', os.path.join(HERE, 'shots.js'), lf, IMG], capture_output=True, text=True)
        os.remove(lf)
        if r.returncode:
            sys.exit('그림 찍기 실패\n' + r.stderr[-2000:])
        print(r.stdout.strip().splitlines()[-1])
        # 색을 64가지로 줄여 파일 크기를 1/3쯤으로(판 그림은 색이 적어 보기에는 같음)
        from PIL import Image
        for x in uniq.values():
            p = os.path.join(IMG, x['f'])
            im = Image.open(p)
            if im.mode != 'P':
                im.convert('RGB').quantize(colors=64, method=Image.Quantize.MEDIANCUT).save(p, optimize=True)


def meaningful(b):
    """판 그림이 문제에 필요한가(빈 판에 표시도 없으면 그림을 넣지 않음)"""
    return b and (b['marks'] or b['arrows'] or b['swap'] or b['flip'] or b['pos'] != '8/8/8/8/8/8/8/8')


def click_q(q, all_):
    q = q.replace('찾아 눌러요', '찾아 ○표 하세요').replace('찾아 눌러 보세요', '찾아 ○표 해 보세요')
    q = q.replace('눌러 보세요', '찾아 ○표 해 보세요').replace('눌러요', '찾아 ○표 하세요')
    return q


def place_marks(t):
    m = {}
    for i, s in enumerate(sorted(t['need'], key=lambda s: (-int(s[1]), s[0]))):
        m[s] = {'t': 'label', 's': str(i + 1)}
    return m


def name_of(c, names):
    return ('백 ' if c.isupper() else '흑 ') + names[c.upper()]


# ---------------------------------------------------------------- 한글 문서 틀
class Book(H.Sheet):
    dry = False   # 첫 번째로 돌 때는 그림 목록만 모음(그림은 그다음에 한꺼번에 찍음)

    def __init__(self, label):
        super().__init__(unit_label=label, level='기본형', seed=label)

    def picture(self, png_path, width_mm=120, align='center'):
        if not Book.dry:
            super().picture(png_path, width_mm=width_mm, align=align)

    def title_page(self, big, sub, lines):
        for _ in range(6):
            self._blank(H.CH_TITLE)
        self._add(self._para(big, H.CH_TITLE, H.PP_CENTER))
        self._blank()
        self._add(self._para(sub, H.CH_LEVEL, H.PP_CENTER))
        for _ in range(4):
            self._blank(H.CH_TITLE)
        for t in lines:
            self._add(self._para(t, H.CH_ASK, H.PP_CENTER))

    def lesson_head(self, mlabel, no, unit, title, goal, name_box=True):
        if self._lessons:
            self._add(self._para('', H.CH_BREAK, pb=1))
        self._lessons += 1
        widths = [11339, 8504, 31181]
        right = (['(   )학년 (   )반', '이름 (            )'] if name_box else '선생님용 지도서')
        rows = [
            [(mlabel, H.BF_HEAD, H.PP_CENTER, H.CH_UNIT, 1), ('%d차시' % no, H.BF_HEAD, H.PP_CENTER, H.CH_LESSON, 1),
             (unit, H.BF_HEAD, H.PP_CENTER, H.CH_SOOP, 1)],
            [(title, H.BF_HEAD, H.PP_LEFT, H.CH_TITLE, 2), (right, H.BF_HEAD, H.PP_LEFT, H.CH_SMALL, 1)],
        ]
        self._table(rows, widths, [3600, 3600], outer_bf=H.BF_HEAD)
        self._add(self._para('', H.CH_GAP4))
        self._table([[('오늘의 목표  ' + clean(goal), H.BF_GRAY, H.PP_LEFT, H.CH_TABLE, 1)]], [H.TEXT_W], [3600])

    def head(self, t):
        self._blank()
        self._add(self._para(t, H.CH_STEP))

    def bullet(self, t, mark='•'):
        self._add(self._para(mark + ' ' + clean(t), H.CH_BODY))

    def small(self, t):
        self._add(self._para(clean(t), H.CH_SMALL))


# ---------------------------------------------------------------- 학생용 교재
def student(D, P, G):
    names = D['pieceNames']
    mlabel = '체스 %d마당' % D['no']
    b = Book('체스 학습관 %d마당 학생용 교재' % D['no'])
    b.title_page('체스 학습관 %d마당' % D['no'], '「%s」 학생용 교재' % D['title'],
                 ['(   )학년 (   )반 (   )번   이름 (                    )', '', '체스판과 체스말부터 차근차근 · 초등교사 홍지희',
                  '학습관: ' + SITE + D['id'] + '.html'])
    b.page_break()
    b._add(b._para('이 교재를 쓰는 방법', H.CH_LESSON))
    b._blank()
    for t in ['차시마다 ■ 배워요 → ■ 예시로 보기 → ■ 풀어 봐요 → ■ 정리해요 차례로 공부해요.',
              '학습관(컴퓨터·태블릿)에서 같은 차시를 함께 하면 판 위에서 직접 눌러 보고, 힌트도 받을 수 있어요.',
              '문제의 ○표는 그림의 칸에 직접 동그라미를 그려요. 정답은 교재 맨 뒤에 있어요.',
              '다 한 차시는 아래 차례 표에 ✓ 표시를 해요.']:
        b.bullet(t)
    b._blank()
    rows = [['차시', '단원', '제목', '다 했어요']]
    for ui, U in enumerate(D['units']):
        for L in U['lessons']:
            rows.append(['%d' % L['no'], '%d. %s' % (ui + 1, U['title']), L['title'], '□'])
    b.table(rows, col_mm=[18, 40, 92, 30], row_h=2268, head_h=2268)
    keys = []
    for ui, U in enumerate(D['units']):
        for L in U['lessons']:
            b.lesson_head(mlabel, L['no'], '%d단원 %s' % (ui + 1, U['title']), L['title'], L['sum'])
            # 배워요: 글은 모두, 그림은 표시가 있는 판 2장까지 + 말 그림
            b.head('■ 배워요')
            pics = 0
            for s in L['say']:
                b.bullet(s['text'])
                if s.get('big'):
                    b.picture(P.big(s['big']), width_mm=22 * len(s['big']) + 6)
                elif s['board'] and pics < 2 and (s['board']['marks'] or s['board']['arrows'] or s['board']['swap']):
                    b.picture(P.board(s['board']), width_mm=62)
                    pics += 1
            # 예시로 보기: 장면 설명을 차례로, 그림은 마지막(또는 표시가 가장 많은) 장면 한 장
            b.head('■ 예시로 보기')
            for e in L['ex']:
                b.bullet(e['text'])
                caps = [f['cap'] for f in e['frames'] if f['cap']]
                for i, c in enumerate(caps):
                    b._add(b._para('    %d) %s' % (i + 1, clean(c)), H.CH_BODY))
                fr = max(e['frames'], key=lambda f: (len(f['board']['marks']) + 2 * len(f['board']['arrows']), e['frames'].index(f)))
                b.picture(P.board(fr['board']), width_mm=58)
            # 풀어 봐요: 따라 하기 + 연습 5문제
            b.head('■ 풀어 봐요')
            key = []
            for qi, t in enumerate(L['do'] + L['pr']):
                n = qi + 1
                if t['type'] == 'click':
                    b.text('%d. %s' % (n, clean(click_q(t['q'], t['all']))))
                    b.picture(P.board(t['board']), width_mm=58)
                    am = dict(t['board']['marks'])
                    for s in t['ans']:
                        am[s] = 'ok'
                    many = len(t['ans']) > 1 and not t['all']
                    txt = ('색칠한 칸 가운데 하나' if many else ', '.join(t['ans']) if t['board']['coords'] else '색칠한 칸')
                    key.append(('%d. %s' % (n, txt), P.board(t['board'], am)))
                elif t['type'] == 'pick':
                    b.text('%d. %s' % (n, clean(t['q'])))
                    if meaningful(t['board']):
                        b.picture(P.board(t['board']), width_mm=52)
                    b.text('      ' + '    '.join('%s %s' % (NUM[i], clean(o)) for i, o in enumerate(t['opts'])))
                    b.ask('      ', blank=True)
                    key.append(('%d. %s %s' % (n, NUM[t['opts'].index(t['ans'])], clean(t['ans'])), None))
                else:
                    lm = place_marks(t)
                    b.text('%d. 처음 배치에서 그림의 번호 칸에 들어갈 말의 이름을 쓰세요. (넣을 말: %s)' % (n, ', '.join(name_of(c, names) for c in t['tray'])))
                    b.picture(P.board(dict(t['board'], marks=lm)), width_mm=58)
                    order = sorted(t['need'], key=lambda s: (-int(s[1]), s[0]))
                    b.text('      ' + '   '.join('%d (          )' % (i + 1) for i in range(len(order))))
                    key.append(('%d. ' % n + ' · '.join('%d %s' % (i + 1, name_of(t['need'][s], names)) for i, s in enumerate(order)), None))
            b.head('■ 정리해요')
            b.fill([clean(L['sum'])])
            b._blank()
            b.text('□ 설명과 예시를 읽었어요    □ 문제를 다 풀었어요    □ 학습관에서도 연습했어요')
            keys.append((L, key))
    # 정답
    b.page_break()
    b._add(b._para('정답', H.CH_LESSON))
    for L, key in keys:
        b._blank()
        b._add(b._para('%d차시 %s' % (L['no'], L['title']), H.CH_STEP))
        for t, img in key:
            b._add(b._para(t, H.CH_KEY))
            if img:
                b.picture(img, width_mm=34, align='left')
    return b


# ---------------------------------------------------------------- 선생님용 지도서
def teacher(D, P, G):
    names = D['pieceNames']
    mlabel = '체스 %d마당' % D['no']
    b = Book('체스 학습관 %d마당 지도서' % D['no'])
    b.title_page('체스 학습관 %d마당' % D['no'], '「%s」 선생님용 지도서' % D['title'],
                 ['학생용 교재 · 학습관(' + SITE + D['id'] + '.html)과 함께 씁니다.', '', '초등교사 홍지희'])
    b.page_break()
    b._add(b._para('1. 체스 학습관은 이렇게 짜여 있어요', H.CH_LESSON))
    for t in ['학년 구분 없이 모든 학생이 1마당 1차시부터 차례대로 배웁니다(6마당 · 약 170차시 계획, 지금 열린 마당부터 차례로 공개).',
              '차시 흐름: 설명 → 예시(판 위에서 차례로 움직이는 장면) → 따라 하기 → 연습(할 때마다 새 문제) → 마무리.',
              '맞히면 저절로 다음 문제로 넘어가고, 틀리면 처음엔 실마리와 틀린 까닭을, 두 번째엔 정답을 보여 준 뒤 비슷한 문제를 하나 더 냅니다.',
              '어느 차시든 골라서 들어갈 수 있고, 연습을 끝까지 마쳐야 완료 표시(별)가 붙습니다. 기록은 그 기기에만 저장됩니다.',
              '마당을 마치면 확인 시험(15문제 중 12문제 통과, 힌트 없음)을 보고, 통과하면 등급(폰 → 나이트 → 비숍 → 룩 → 퀸 → 킹)과 수료증을 받습니다.',
              '읽어 주기(브라우저 한국어 음성)를 켜고 끌 수 있습니다.']:
        b.bullet(t)
    b._blank()
    b._add(b._para('2. 저절로 나오는 힌트', H.CH_STEP))
    b.table([['문제 종류', '1번째 힌트', '2번째 힌트', '3번째(정답)'], ['쉬운 조작', '10초', '+10초', '+10초'], ['한 수 생각', '15초', '+15초', '+15초'], ['깊은 생각', '20초', '+20초', '+20초']],
            col_mm=[45, 45, 45, 45], row_h=2268, head_h=2268)
    for t in ['아무것도 누르지 않을 때 시간을 셉니다. 화면을 누르면 처음부터 다시 셉니다.',
              '읽어 주기가 켜져 있으면 다 읽은 뒤부터, 꺼져 있으면 글을 읽을 시간(글자 수 ÷ 5초, 최소 3초)이 지난 뒤부터 셉니다.',
              '학습관의 ⚙ 선생님 설정에서 빠르게(절반)·보통·느긋하게(두 배)·끄기를 고를 수 있습니다. 확인 시험에는 힌트가 없습니다.']:
        b.bullet(t)
    b._blank()
    b._add(b._para('3. 교재와 학습관을 함께 쓰는 방법', H.CH_STEP))
    for t in ['교실 수업: 전자칠판으로 학습관의 설명·예시를 함께 보고 → 학생용 교재의 ‘풀어 봐요’를 풀고 → 개인 기기로 연습합니다.',
              '가정 학습: 교재의 ‘배워요·예시로 보기’를 읽고 학습관에서 같은 차시를 해 봅니다.',
              '교재의 문제는 학습관 연습 문제에서 고른 것이라 학습관과 같은 꼴입니다. 정답은 학생용 교재 맨 뒤에 있습니다.',
              '실물 체스판이 있으면 처음 배치(3단원)는 꼭 실물로도 해 보게 합니다.']:
        b.bullet(t)
    b.page_break()
    b._add(b._para('4. %d마당 차시 한눈에 보기' % D['no'], H.CH_LESSON))
    b._blank()
    rows = [['차시', '단원', '제목', '문제 종류', '학습관']]
    for ui, U in enumerate(D['units']):
        for L in U['lessons']:
            rows.append(['%d' % L['no'], U['title'], L['title'], KIND[L['kind']][0], '%s.html#l%d' % (D['id'], L['no'])])
    b.table(rows, col_mm=[14, 32, 62, 28, 44], row_h=2268, head_h=2268)
    for ui, U in enumerate(D['units']):
        for L in U['lessons']:
            g = G.get(L['id'], {})
            b.lesson_head(mlabel, L['no'], '%d단원 %s' % (ui + 1, U['title']), L['title'], L['sum'], name_box=False)
            k = KIND[L['kind']]
            b.labeled([('문제 종류', '%s · 저절로 힌트 %s' % k), ('학습관', SITE + '%s.html#l%d' % (D['id'], L['no'])),
                       ('교재', '학생용 교재 %d차시 · 풀어 봐요 %d문제' % (L['no'], len(L['do']) + len(L['pr'])))], label_mm=30, row_h=2835)
            b.head('■ 지도 흐름')
            b._add(b._para('① 설명', H.CH_ASK))
            for s in L['say']:
                b.bullet(s['text'], '-')
            b._add(b._para('② 예시', H.CH_ASK))
            for e in L['ex']:
                caps = ' → '.join(clean(f['cap']) for f in e['frames'] if f['cap'])
                b.bullet(e['text'] + (' (' + caps + ')' if caps else ''), '-')
            b._add(b._para('③ 따라 하기와 힌트', H.CH_ASK))
            for t in L['do']:
                b.bullet(t['q'] + (' — 힌트: ' + ' / '.join(t['hint']) if t['hint'] else ''), '-')
            b._add(b._para('④ 연습 (학습관은 할 때마다 새 문제, 교재는 고정 5문제)', H.CH_ASK))
            kinds = sorted(set(t['q'] for t in L['pr']))
            for q in kinds[:5]:
                b.bullet(click_q(q, False) if '눌러' in q else q, '-')
            if g.get('mis'):
                b.head('■ 자주 하는 실수')
                for t in g['mis']:
                    b.bullet(t)
            if g.get('tip'):
                b.head('■ 지도 도움말')
                for t in g['tip']:
                    b.bullet(t)
            if g.get('ask'):
                b.head('■ 생각을 여는 질문(발문)')
                for t in g['ask']:
                    b.bullet(t, 'Q.')
    b.page_break()
    b._add(b._para('5. 확인 시험과 수료증', H.CH_LESSON))
    for t in ['학습관 차시 목록 맨 아래 ‘확인 시험’: %d마당의 모든 차시에서 고른 15문제, 12문제 이상 맞히면 통과(%s 등급).' % (D['no'], D['rank']),
              '확인 시험은 힌트가 없고, 틀리면 정답을 보여 준 뒤 바로 다음 문제로 넘어갑니다. 결과 화면에 ‘다시 보면 좋은 차시’가 나옵니다.',
              '통과하면 학습관에서 이름을 넣어 수료증(A4 가로)을 인쇄할 수 있습니다.']:
        b.bullet(t)
    return b


def main(mid):
    exp = subprocess.run(['node', os.path.join(HERE, 'export.js'), mid], capture_output=True, text=True)
    if exp.returncode:
        sys.exit('자료 뽑기 실패\n' + exp.stderr[-2000:])
    D = json.loads(exp.stdout)
    G = importlib.import_module('guide_' + mid).G if os.path.exists(os.path.join(HERE, 'guide_%s.py' % mid)) else {}
    sys.path.insert(0, HERE)
    miss = [L['id'] for U in D['units'] for L in U['lessons'] if L['id'] not in G]
    if miss:
        sys.exit('지도서 글이 없는 차시: ' + ', '.join(miss) + ' (guide_%s.py)' % mid)
    P = Pics()
    Book.dry = True
    student(D, P, G); teacher(D, P, G)
    P.shoot()   # 필요한 그림을 모두 모아 한 번에 찍은 뒤
    Book.dry = False
    s = student(D, P, G)
    t = teacher(D, P, G)
    os.makedirs(OUT, exist_ok=True)
    out = []
    for doc, name in [(s, '체스_%d마당_학생용교재.hwpx' % D['no']), (t, '체스_%d마당_지도서.hwpx' % D['no'])]:
        p = os.path.join(OUT, name)
        doc.save(p, now=STAMP)
        bad = H.check(p)
        if bad:
            sys.exit('점검 실패 %s: %s' % (name, bad[:5]))
        out.append(p)
    print('교재 %d개 만듦: %s' % (len(out), ', '.join(os.path.basename(x) for x in out)))


if __name__ == '__main__':
    sys.path.insert(0, HERE)
    main(sys.argv[1] if len(sys.argv) > 1 else 'm1')
