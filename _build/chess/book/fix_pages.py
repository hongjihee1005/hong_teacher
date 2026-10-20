# -*- coding: utf-8 -*-
"""한글에서 고쳐 저장한 '체스 학습관 1~6마당' 한 권 파일의 쪽 번호(CONTENT·용어 풀이의 쪽)를 실제 쪽에 맞게 다시 적기

    python3 _build/chess/book/fix_pages.py 고친파일.hwpx [출력.hwpx]

한글이 저장할 때 문단마다 남기는 줄 위치(linesegarray의 vertpos)가 작아지는 곳과 쪽 나눔으로 문단마다 실제 쪽을 셉니다
(쪽 번호는 꼬리말 autoNum과 같이 첫 쪽이 1). 바꾸는 것은 CONTENT의 끝 숫자와 용어 풀이의 '(N쪽)'뿐이고, 나머지는 그대로 둡니다.
한 표가 두 쪽에 걸쳐 나뉘면 그 뒤 쪽을 하나 적게 셀 수 있습니다(이 책은 표를 한 줄씩 나눠 두어 거의 없음).
"""
import re, json, sys, os, zipfile
src = sys.argv[1]
dst = sys.argv[2] if len(sys.argv) > 2 else src
Z = zipfile.ZipFile(src)
s = Z.read('Contents/section0.xml').decode('utf-8')
b0=s.index('<hs:sec'); body=s[b0:]
tops=[]; depth=0
for m in re.finditer(r'<hp:p [^>]*>|</hp:p>', body):
    if m.group(0).startswith('<hp:p '):
        if depth==0: start=m.start()
        depth+=1
    else:
        depth-=1
        if depth==0: tops.append((b0+start, b0+m.end()))
def own(p):
    m=re.search(r'<hp:linesegarray>((?:(?!<hp:linesegarray>).)*?)</hp:linesegarray></hp:p>$', p, re.S)
    return [int(v) for v in re.findall(r'vertpos="(-?\d+)"', m.group(1))] if m else []
page=1; last=None; out=[]
for k,(a,e) in enumerate(tops):
    p=s[a:e]
    if k and re.match(r'<hp:p [^>]*pageBreak="1"', p): page+=1; last=None
    vs=own(p); ps=None
    for v in vs:
        if last is not None and v < last: page+=1
        last=v
        if ps is None: ps=page
    txt=''.join(re.findall(r'<hp:t>([^<]*)</hp:t>',p))
    out.append((a,e,ps or page,txt))
T=out
print('pages',page, 'no-lineseg paras', sum(1 for (a,e) in tops if not own(s[a:e])))
TOC=[i for i,(a,e,p,t) in enumerate(T) if re.match(r'^\s*.+\s\s\d+$',t) and i<120]
start=max(TOC)+1
mk={}
cur=0
for i,(a,e,p,t) in enumerate(T):
    if i<start: continue
    m=re.search(r'체스 학습관(\d)마당',t)
    if m: cur=int(m.group(1)); mk.setdefault('m%d:open'%cur,p); continue
    m=re.match(r'(\d)마당(\d+)단원',t)
    if m: mk.setdefault('m%s:u%d'%(m.group(1),int(m.group(2))-1),p); continue
    m=re.match(r'확인 평가(\d)마당 확인 평가',t)
    if m: mk.setdefault('m%s:exam'%m.group(1),p); continue
    m=re.match(r'(\d+)차시(.+)$',t)
    if m and cur and i+1<len(T) and T[i+1][3].startswith('오늘의 목표'): mk.setdefault('m%d:l%s'%(cur,m.group(1)),p)
    for key,word in [('pre','머리말'),('how','이 책을 쓰는 방법'),('struct','이 책의 짜임'),('ans','정답과 풀이'),('terms','용어 풀이')]:
        if t.strip().endswith(word) and key not in mk and len(t)<40: mk[key]=p
print(len(mk), {k:mk[k] for k in ['pre','how','struct','ans','terms','m1:open','m2:open','m6:exam']})
print('lessons', sum(1 for k in mk if ':l' in k))
# TOC fixes
order=['pre','how','struct']
for no in range(1,7):
    import importlib
names=[]
out=s; repl=[]
tockeys=[]
for i in TOC:
    a,e,p,t=T[i]
    tt=t.strip()
    if tt.startswith('머리말'): k='pre'
    elif tt.startswith('이 책을'): k='how'
    elif tt.startswith('이 책의'): k='struct'
    elif tt.startswith('정답과'): k='ans'
    elif tt.startswith('용어'): k='terms'
    else:
        m=re.match(r'(\d)마당   ',tt)
        if m: no=int(m.group(1)); k='m%d:open'%no
        else:
            m=re.match(r'(\d+)단원',tt)
            if m: k='m%d:u%d'%(no,int(m.group(1))-1)
            else:
                m=re.match(r'(\d)마당 확인 평가',tt); k='m%s:exam'%m.group(1)
    tockeys.append((i,k))
missing=[k for i,k in tockeys if k not in mk]
assert not missing, missing
edits=[]
for i,k in tockeys:
    a,e,p,t=T[i]; para=s[a:e]
    new=re.sub(r'(\s)\d+(</hp:t>)', lambda m:m.group(1)+str(mk[k])+m.group(2), para, count=0)
    # only the last number in last hp:t
    idx=para.rfind('</hp:t>'); seg=para[:idx]
    seg2=re.sub(r'\d+$', str(mk[k]), seg)
    new=seg2+para[idx:]
    new=re.sub(r'<hp:linesegarray>.*?</hp:linesegarray>','',new)
    edits.append((a,e,new))
# glossary
cnt=0
for m in re.finditer(r'(\d)마당 (\d+)차시<hp:lineBreak/>\((\d+)쪽\)', s):
    k='m%s:l%s'%(m.group(1),m.group(2))
    if k not in mk: print('no lesson',k); continue
    edits.append((m.start(),m.end(),'%s마당 %s차시<hp:lineBreak/>(%d쪽)'%(m.group(1),m.group(2),mk[k]))); cnt+=1
print('toc',len(tockeys),'glossary',cnt)
edits.sort()
res=[];pos=0
for a,e,new in edits:
    assert a>=pos; res.append(s[pos:a]); res.append(new); pos=e
res.append(s[pos:])
NEW=''.join(res)
for i,k in tockeys: print(T[i][3].strip()[:30],'→',mk[k])

tmp = dst + '.tmp'
with zipfile.ZipFile(tmp, 'w') as z:
    for zi in Z.infolist():
        data = NEW.encode('utf-8') if zi.filename == 'Contents/section0.xml' else Z.read(zi.filename)
        z.writestr(zi, data, compress_type=zi.compress_type)
os.replace(tmp, dst)
print('쪽 번호 고침:', dst)
