#!/usr/bin/env python3
"""탐구 실험관 · 날씨와 우리 생활(5학년 2학기 2단원) — src/ 조각을 합쳐 HTML 한 장으로.
   python3 build.py [출력 경로]  (기본: 저장소 grade5/science/explore/weather.html)"""
import os,sys,re
D=os.path.dirname(os.path.abspath(__file__));S=os.path.join(D,'src')
r=lambda n:open(os.path.join(S,n),encoding='utf-8').read()
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(D,'..','..','..','grade5','science','explore','weather.html')
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
# 쓰지 않을 말(5학년 2학기 2단원 범위 밖 — 교과서 버전 앱 u2-1~u2-5와 지도서 범위: 기상 요소, 이슬·안개·구름(응결),
# 고기압·저기압, 바람은 고기압에서 저기압으로. 이슬이 맺히는 온도, 공기가 품을 수 있는 수증기의 양, 기압의 숫자와 단위,
# 공기 덩어리의 경계, 응결을 돕는 알갱이의 이름, 공기의 오르내림 이름, 실험 조건을 부르는 어려운 말은 쓰지 않음)
for w in ['이슬점','포화','수증기량','헥토파스칼','hPa','전선','변인','조건 통제','상대 습도','절대 습도','습도표','건습구',
          '응결핵','응결 핵','기단','대류','상승 기류','하강 기류','단열','팽창','밀도','분자','입자','에너지','열에너지',
          '기화','액화','기압골','등압선','해륙풍','편서풍','계절풍','코리올리','에어로졸','미세 먼지',
          '이(가)','을(를)','은(는)','이라고(라고)']:
    assert w not in page,('forbidden',w)
# 결론 빈칸 답이 실험 이름·단계 이름·행동 단추에 들어가지 않게
import subprocess
nc=subprocess.run(['node',os.path.join(D,'namecheck.js')],capture_output=True,text=True)
assert nc.returncode==0,('answer word in names',nc.stdout,nc.stderr[:400])
open(out,'w',encoding='utf-8').write(page)
print('wrote',out,len(page.encode()),'bytes')
