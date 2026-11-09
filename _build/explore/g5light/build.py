#!/usr/bin/env python3
"""탐구 실험관 · 빛의 성질(5학년 1학기 2단원) — src/ 조각을 합쳐 HTML 한 장으로.
   python3 build.py [출력 경로]  (기본: 저장소 grade5/science/explore/light.html)"""
import os,sys,re
D=os.path.dirname(os.path.abspath(__file__));S=os.path.join(D,'src')
r=lambda n:open(os.path.join(S,n),encoding='utf-8').read()
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(D,'..','..','..','grade5','science','explore','light.html')
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
# 쓰지 않을 말(5학년 1학기 2단원 범위 밖 — 교과서 버전 앱 u2-1~u2-4와 지도서 범위: 빛의 직진·반사·굴절, 볼록·오목 렌즈까지.
# 들어오고 나가는 각의 이름, 꺾이는 정도를 나타내는 수, 렌즈가 빛을 모으는 점과 그 거리, 빛의 파동·알갱이, 빛의 빠르기, 무지개 빛 나눔,
# 눈의 구조, 실험 조건을 부르는 어려운 말은 쓰지 않음)
for w in ['입사','반사각','굴절각','굴절률','법선','초점','파장','광자','광선','전반사','프리즘','분산','속력','진공','스넬','수정체','망막',
          '빛의 속도','볼록 거울','오목 거울','실상','허상','배율','변인','조건 통제','에너지',
          '이(가)','을(를)','은(는)','이라고(라고)','물의 상태','얼음','수증기','증발','끓음']:
    assert w not in page,('forbidden',w)
# 결론 빈칸 답이 실험 이름·단계 이름·행동 단추에 들어가지 않게
import subprocess
nc=subprocess.run(['node',os.path.join(D,'namecheck.js')],capture_output=True,text=True)
assert nc.returncode==0,('answer word in names',nc.stdout,nc.stderr[:400])
open(out,'w',encoding='utf-8').write(page)
print('wrote',out,len(page.encode()),'bytes')
