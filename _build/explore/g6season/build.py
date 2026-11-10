#!/usr/bin/env python3
"""탐구 실험관 · 계절의 변화(6학년 2학기 1단원) — src/ 조각을 합쳐 HTML 한 장으로.
   python3 build.py [출력 경로]  (기본: 저장소 grade6/science/explore/season.html)"""
import os,sys,re
D=os.path.dirname(os.path.abspath(__file__));S=os.path.join(D,'src')
r=lambda n:open(os.path.join(S,n),encoding='utf-8').read()
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(D,'..','..','..','grade6','science','explore','season.html')
ic=lambda body:'<svg class="lb-ic" viewBox="0 0 24 24" aria-hidden="true">'+body+'</svg>'
page=r('page.html')
js=r('data.js')+'\n'+r('draw.js')+'\n'+r('app_head.js')+r('app_body.js')
rep={'{{CSS}}':re.sub(r'/\*[\s\S]*?\*/','',r('app.css')),'{{CONTACTCSS}}':r('contact-css.html'),'{{CONTACT}}':r('contact.html'),'{{JS}}':js,
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
# 쓰지 않을 말(6학년 2학기 1단원 범위 밖 — 지도서 112~163쪽: 태양 고도·남중 고도·자전축·공전·태양 에너지양까지만 다루고,
# 위도·적도·자전축 기울기의 각도 수치·일사량·복사 에너지·입사각·방위각·동지·춘분·추분·회귀선·근일점·원일점·조도의 단위·'변인' 같은 말은 쓰지 않음)
for w in ['위도','적도','23.5','66.5','일사량','태양 복사','복사 에너지','입사각','방위각','하짓날','동짓날','동지','춘분','추분','회귀선','근일점','원일점','럭스','변인','조건 통제',
          '이(가)','을(를)','은(는)','이라고(라고)','(으)로']:
    assert w not in page,('forbidden',w)
# 복사해 온 다른 실험관의 흔적이 없게
for w in ['자원과 에너지','집 모형','손난로','뽁뽁이','물체의 운동','생물의 한살이','기후변화','힘 실험관','물의 상태 변화','energy']:
    assert w not in page,('copied trace',w)
# 결론 빈칸 답이 실험 이름·단계 이름·행동 단추에 들어가지 않게
import subprocess
nc=subprocess.run(['node',os.path.join(D,'namecheck.js')],capture_output=True,text=True)
assert nc.returncode==0,('answer word in names',nc.stdout,nc.stderr[:400])
open(out,'w',encoding='utf-8').write(page)
print('wrote',out,len(page.encode()),'bytes')
