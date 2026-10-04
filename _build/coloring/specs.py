"""학년별 컬러링 도안 50개 설정 — 같은 설정이면 언제나 같은 그림(designs.js가 그림).
k: 'obj'(사물, o 이름, lv 1·2, fr 테두리) / 무늬 'big','grid','flowerbig','truchet','hexgrid','twist','stars','scales','weave' / 'man'(만다라)
"""
OBJS = ['sun', 'flower', 'tree', 'house', 'fish', 'cat', 'heart', 'star', 'apple', 'balloon', 'car', 'boat', 'butterfly', 'rocket', 'icecream', 'cupcake',
        'rainbow', 'umbrella', 'snail', 'owl', 'turtle', 'mushroom', 'moon', 'leaf', 'train', 'bear', 'penguin', 'gift', 'cake', 'dog', 'rabbit']

def man(layers, nmin, nmax, nest, seed, frame=0):
    return dict(k='man', layers=layers, nmin=nmin, nmax=nmax, nest=nest, seed=seed, frame=frame)

def grade(g):
    S = []
    if g == 1:
        S += [dict(k='obj', o=o, lv=1) for o in OBJS]
        S += [dict(k='big', v=v, layers=L) for L in (1, 2) for v in range(6) if not (L == 1 and v in (1, 2))]
        S += [dict(k='grid', n=2, shape='s'), dict(k='flowerbig', n=8, layers=1)]
        S += [dict(k='grid', n=2, shape='c'), dict(k='grid', n=2, shape='h'), dict(k='grid', n=3, shape='s'), dict(k='grid', n=3, shape='c'), dict(k='grid', n=3, shape='h')]
        S += [dict(k='flowerbig', n=5, layers=1), dict(k='flowerbig', n=6, layers=1)]
    elif g == 2:
        S += [dict(k='obj', o=o, lv=2, fr=i % 2) for i, o in enumerate(OBJS)]
        S += [dict(k='grid', n=4, shape='mix', inner=1, seed=s) for s in (1, 2, 3, 4)]
        S += [dict(k='stars', n=n, max=26, seed=s) for n, s in ((9, 5), (11, 6), (13, 7))]
        S += [dict(k='flowerbig', n=8, layers=2), dict(k='flowerbig', n=10, layers=2)]
        S += [dict(k='big', v=v, layers=3) for v in range(6)]
        S += [dict(k='twist', sides=4, n=6, t=.2), dict(k='twist', sides=6, n=6, t=.2)]
        S += [man(2, 6, 8, 0, 21), man(2, 6, 8, 0, 22)]
    elif g == 3:
        S += [dict(k='truchet', n=n, seed=s) for n in (4, 5, 6) for s in (31, 32)]
        S += [dict(k='hexgrid', s=s, inner=i) for s in (46, 38) for i in (0, 1)]
        S += [dict(k='twist', sides=sd, n=12, t=.15) for sd in (3, 4, 5, 6)]
        S += [dict(k='scales', s=s) for s in (72, 60)]
        S += [dict(k='weave', n=n) for n in (4, 5)]
        S += [dict(k='stars', n=18, max=22, inner=1, seed=s) for s in (33, 34)]
        S += [man(3 + i % 2, 6, 12, 0, 300 + i) for i in range(30)]
    elif g == 4:
        S += [dict(k='truchet', n=n, seed=s) for n in (7, 8) for s in (41, 42)]
        S += [dict(k='hexgrid', s=30, inner=1, dot=d) for d in (0, 1)] + [dict(k='hexgrid', s=26, dot=1)]
        S += [dict(k='twist', sides=sd, n=30, t=t) for sd, t in ((4, .08), (5, .09), (6, .1), (8, .12))]
        S += [dict(k='scales', s=64, inner=1), dict(k='scales', s=56, inner=1)]
        S += [dict(k='weave', n=6), dict(k='weave', n=7)]
        S += [man(5 + i % 2, 6, 16, .2, 400 + i, i % 5 == 4) for i in range(35)]
    elif g == 5:
        S += [man(7 + i % 2, 8, 20, .4, 500 + i, i % 3 == 2) for i in range(50)]
    else:
        S += [man(9 + i % 3, 10, 24, .7, 600 + i, i % 2) for i in range(50)]
    assert len(S) == 50, (g, len(S))
    return S
