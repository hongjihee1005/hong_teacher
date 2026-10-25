"""앱 HTML에서 화면 글만 뽑아 보기(영상 만들기 전 차시 내용 확인용)
    python3 _build/scivideo/apptext.py grade3/science/sem1/u2-1.html [글자 수]
"""
import re,html,sys
s=open(sys.argv[1]).read()
s=re.sub(r'<script.*?</script>|<style.*?</style>|<svg.*?</svg>','',s,flags=re.S)
s=re.sub(r'data:[^"\']+','',s)
t=html.unescape(re.sub(r'<[^>]+>','\n',s))
t=re.sub(r'\n\s*\n+','\n',t)
t=t.split('스스로 평가하기')[0]
print(t[:int(sys.argv[2]) if len(sys.argv)>2 else 5000])
