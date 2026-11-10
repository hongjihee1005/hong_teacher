#!/usr/bin/env python3
"""탐구 실험관 · 식물의 구조와 기능(6학년 1학기 3단원) — src/ 조각을 합쳐 HTML 한 장으로.
   python3 build.py [출력 경로]  (기본: 저장소 grade6/science/explore/plant.html)"""
import os,sys,re
D=os.path.dirname(os.path.abspath(__file__));S=os.path.join(D,'src')
r=lambda n:open(os.path.join(S,n),encoding='utf-8').read()
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(D,'..','..','..','grade6','science','explore','plant.html')
ic=lambda body:'<svg class="lb-ic" viewBox="0 0 24 24" aria-hidden="true">'+body+'</svg>'
page=r('page.html')
js=r('data.js')+'\n'+r('draw.js')+'\n'+r('app_head.js')+r('app_body.js')
rep={'{{CSS}}':r('app.css'),'{{CONTACTCSS}}':r('contact-css.html'),'{{CONTACT}}':r('contact.html'),'{{JS}}':js,
 '{{IC_HOME}}':ic('<path d="M3.5 10.5 12 3.8l8.5 6.7"/><path d="M5.5 9.2V20h13V9.2"/><path d="M10 20v-5.5h4V20"/>'),
 '{{IC_LIST}}':ic('<rect x="5.2" y="5" width="13.6" height="15.2" rx="2"/><path d="M9 3.8h6v2.6H9ZM8.8 11.2h6.4M8.8 14.8h4.4"/>'),
 '{{IC_GRID}}':ic('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
 '{{IC_LOCK}}':ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>')}
for k,v in rep.items():page=page.replace(k,v)
assert '{{' not in page
# 이모지·금지 글 점검
bad=[c for c in page if 0x1F000<=ord(c)<=0x1FAFF or 0x2600<=ord(c)<=0x27BF]
assert not bad,('emoji',set(bad))
for w in ['다음','다시 하기']:
    for m in re.finditer(r'<button[^>]*>([^<]*(?:<[^/][^>]*>[^<]*)*)</button>',page):
        assert w not in m.group(1),(w,m.group(0)[:80])
# 쓰지 않을 말(6학년 1학기 3단원 범위 밖 — 지도서 266~321쪽·교과서 버전 앱 u3-1~u3-7에 없는 말: 엽록체·공변세포·물관·체관·관다발·포도당·산소 같은 말,
# 광합성 반응식·농도·변인 같은 말은 쓰지 않음. 세포·세포벽·세포막·핵·광합성·녹말·기공·증산 작용·꽃가루받이는 교과서 낱말이라 교과서 결론에서만 — namecheck.js가 막음)
for w in ['엽록체','엽록소','공변세포','물관','체관','관다발','포도당','산소','반응식','빛에너지','농도','변인','조건 통제','세포질','엽육','울타리 조직','해면 조직',
          '생장점','뿌리골무','꽃밥','암술머리','씨방','꽃가루관','수정','표피 조직','증산 속도',
          '이(가)','을(를)','은(는)','이라고(라고)']:
    assert w not in page,('forbidden',w)
# 결론 빈칸 답이 실험 이름·단계 이름·행동 단추에 들어가지 않게
import subprocess
nc=subprocess.run(['node',os.path.join(D,'namecheck.js')],capture_output=True,text=True)
assert nc.returncode==0,('answer word in names',nc.stdout,nc.stderr[:400])
open(out,'w',encoding='utf-8').write(page)
print('wrote',out,len(page.encode()),'bytes')
