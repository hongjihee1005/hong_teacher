# 기본형 글 조각 가운데 도전형에 똑같이 있는 비율(%) · 기본형 조각 수 · 도전형 조각 수 · 도전형에만 있는 조각 수
#   python3 _build/sheets_hard/simil.py [경로에 들어 있는 글자]
import zipfile,re,glob,os
def txt(p):
    z=zipfile.ZipFile(p);s=''.join(z.read(n).decode('utf8') for n in z.namelist() if re.match(r'Contents/section\d+\.xml',n))
    return [t.strip() for t in re.findall(r'<hp:t>([^<]*)</hp:t>',s) if t.strip()]
rows=[]
import sys
for b in sorted(glob.glob("grade*/math/*/sheets/*기본형.hwpx")):
    if len(sys.argv) > 1 and sys.argv[1] not in b: continue
    c=b.replace('기본형','도전형')
    if not os.path.exists(c): continue
    B,C=txt(b),txt(c);sc=set(C)
    same=sum(1 for x in B if x in sc)
    extra=len([x for x in C if x not in set(B)])
    rows.append((round(same/len(B)*100),b,len(B),len(C),extra))
for r in rows: print(*r)
