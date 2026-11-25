"""나레이션 글을 음성 합성용 한국어 읽기로 바꿉니다 (숫자·단위·영문 글자).

    python3 tts_norm.py "오후 3시에 26화, 1.5 미터, N극"   # 확인용
"""
import re

D = '영일이삼사오육칠팔구'
NATIVE1 = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉']
NATIVE10 = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔']
# 고유어 수로 읽는 단위 (1~99만)
NATIVE_UNITS = ('시간', '시', '마리', '방울', '칸', '장', '명', '개', '컵', '가지', '살', '번째', '그루', '송이', '군데', '줄')


def sino(n: int) -> str:
    if n == 0:
        return '영'
    out = ''
    for unit, size in (('억', 10 ** 8), ('만', 10 ** 4)):
        q, n = divmod(n, size)
        if q:
            out += ('' if q == 1 and unit == '만' else sino(q)) + unit
    for unit, size in (('천', 1000), ('백', 100), ('십', 10)):
        q, n = divmod(n, size)
        if q:
            out += ('' if q == 1 else D[q]) + unit
    if n:
        out += D[n]
    return out


def native(n: int) -> str:
    if n == 20:
        return '스무'
    t, o = divmod(n, 10)
    return NATIVE10[t] + NATIVE1[o]


def num(s: str) -> str:
    s = s.replace(',', '')
    if '.' in s:
        a, b = s.split('.', 1)
        return sino(int(a)) + ' 점 ' + ''.join(D[int(c)] for c in b)
    return sino(int(s))


LETTERS = {'N극': '엔극', 'S극': '에스극', 'LED': '엘이디', 'U 자': '유 자'}
UNIT_WORDS = [(r'km/h', '킬로미터 매 시'), (r'm/s', '미터 매 초'), (r'kg', '킬로그램'), (r'mL', '밀리리터'),
              (r'cm', '센티미터'), (r'mm', '밀리미터'), (r'km', '킬로미터'), (r'g', '그램'), (r'm', '미터'),
              (r'℃', '도'), (r'°C', '도'), (r'°', '도'), (r'%', '퍼센트')]
SINGLE = {'A': '에이', 'B': '비', 'C': '씨', 'D': '디'}


def normalize(t: str) -> str:
    for k, v in LETTERS.items():
        t = t.replace(k, v)
    # 숫자 + 영문 단위
    for u, w in UNIT_WORDS:
        t = re.sub(r'(\d[\d,.]*)\s*' + re.escape(u) + r'(?![A-Za-z])', lambda m: m.group(1) + ' ' + w, t)
    # 고유어 단위
    def nat(m):
        n, unit = m.group(1), m.group(2)
        if '.' in n or int(n.replace(',', '')) >= 100 or int(n.replace(',', '')) == 0:
            return num(n) + ' ' + unit
        return native(int(n.replace(',', ''))) + ' ' + unit
    t = re.sub(r'(\d[\d,]*(?:\.\d+)?)\s*(' + '|'.join(NATIVE_UNITS) + ')', nat, t)
    # 나머지 숫자는 한자어 수
    t = re.sub(r'\d[\d,]*(?:\.\d+)?', lambda m: num(m.group(0)) + ' ', t)
    t = re.sub(r'(?<![A-Za-z])([A-D])(?![A-Za-z])', lambda m: SINGLE[m.group(1)], t)
    t = t.replace('~', '').replace('……', ', ').replace('…', ', ').replace('·', ', ')
    t = re.sub(r'[“”「」『』]', '', t)
    t = re.sub(r',\s*\.', '.', t)
    t = re.sub(r'\s+', ' ', t).replace(' ,', ',').replace(' .', '.').strip()
    return t


if __name__ == '__main__':
    import sys
    for a in sys.argv[1:]:
        print(normalize(a))
