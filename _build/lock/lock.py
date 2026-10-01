"""교과연계 계획(평문 HTML)을 비밀번호로 잠근 한 파일 페이지로 만든다.
사용: python3 lock.py 평문.html 결과.html  (비밀번호는 환경변수 LOCK_PW)
PBKDF2-SHA256 600,000회 → AES-GCM 256. 비밀번호는 파일에 남지 않는다."""
import os, sys, base64, html
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

src, out = sys.argv[1], sys.argv[2]
import unicodedata
pw = unicodedata.normalize('NFC', os.environ['LOCK_PW'].strip())
CHO='rRseEfaqQtTdwWczxvg'; JUNG=['k','o','i','O','j','p','u','P','h','hk','ho','hl','y','n','nj','np','nl','b','m','ml','l']
JONG=['','r','R','rt','s','sw','sg','e','f','fr','fa','fq','ft','fx','fv','fg','a','q','qt','t','T','d','w','c','z','x','v','g']
def eng(t):  # 한글 2벌식 자판에서 같은 키를 영문 상태로 눌렀을 때의 글자
    o=''
    for ch in t:
        c=ord(ch)-0xAC00
        if 0<=c<11172: o+=CHO[c//588]+JUNG[(c%588)//28]+JONG[c%28]
        else: o+=ch
    return o
pws=[pw]+([eng(pw)] if eng(pw)!=pw else [])
plain = open(src, encoding='utf-8').read().encode('utf-8')
salt, it = os.urandom(16), 600000
blobs=[]
for p_ in pws:
    iv=os.urandom(12)
    key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=it).derive(p_.encode('utf-8'))
    blobs.append(base64.b64encode(iv + AESGCM(key).encrypt(iv, plain, None)).decode())
b = lambda x: base64.b64encode(x).decode()

page = '''<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>교과연계 수업 계획 · 과학방 (잠금)</title>
<style>
:root{--bg:#F3FAF7;--paper:#fff;--ink:#1F2A44;--soft:#4F5B75;--line:#CFE3DA;--acc:#1C8C7A;--bad:#C0392B}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#13221E;--paper:#1C302A;--ink:#EEF6F2;--soft:#B5C9C1;--line:#2F4A42;--bad:#FF8A7A}}
:root[data-theme="dark"]{--bg:#13221E;--paper:#1C302A;--ink:#EEF6F2;--soft:#B5C9C1;--line:#2F4A42;--bad:#FF8A7A}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:clamp(19px,2.1vw,24px);line-height:1.55;word-break:keep-all}
main{max-width:640px;margin:0 auto;padding:clamp(20px,6vh,72px) 16px}
.back{display:inline-block;color:var(--ink);text-decoration:none;background:var(--paper);border:3px solid var(--line);border-radius:999px;padding:4px 18px;font-size:.85em}
.box{background:var(--paper);border:4px solid var(--line);border-radius:22px;padding:24px;margin-top:18px}
h1{font-size:clamp(26px,3.6vw,38px);margin:0 0 6px}
p{margin:8px 0}.soft{color:var(--soft)}
.row{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
input{flex:1 1 12rem;min-width:0;font:inherit;padding:10px 14px;border:3px solid var(--line);border-radius:14px;background:var(--bg);color:var(--ink)}
input:focus{outline:none;border-color:var(--acc)}
button{font:inherit;font-weight:700;padding:10px 22px;border:0;border-radius:14px;background:var(--acc);color:#fff;cursor:pointer}
button:disabled{opacity:.6}\n.mask{-webkit-text-security:disc;text-security:disc}\nbutton.ghost{background:var(--bg);color:var(--ink);border:3px solid var(--line);font-weight:600;padding:10px 14px}
#msg{min-height:1.6em;color:var(--bad)}
footer{color:var(--soft);font-size:.8em;text-align:center;margin-top:28px}
</style></head><body><main>
<a class="back" href="index.html">🔬 과학방으로</a>
<div class="box">
<h1>🔒 교과연계 수업 계획</h1>
<p class="soft">선생님용 자료입니다. 비밀번호를 넣으면 열려요. 안 열리면 👁 보기를 눌러 입력한 글자를 확인해 보세요.</p>
<form class="row" id="f"><input id="pw" type="text" class="mask" autocomplete="off" autocapitalize="off" spellcheck="false" lang="ko" placeholder="비밀번호" aria-label="비밀번호"><button type="button" id="eye" class="ghost">👁 보기</button><button id="go">열기</button></form>
<p id="msg" role="status"></p>
<p class="soft" style="font-size:.8em">이 페이지의 내용은 비밀번호로 암호화되어 있어, 비밀번호를 모르면 파일을 내려받아도 읽을 수 없어요.</p>
</div>
<footer><p>만든 사람: 초등교사 홍지희</p><p style="opacity:.6">잠금 화면 v3</p></footer>
</main>
<script>
const SALT="__SALT__", IT=__IT__, BLOBS="__BLOB__", SK="hj-linkage-pw";
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function open_(pw){
  const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw.trim().normalize('NFC')),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(SALT),iterations:IT,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['decrypt']);
  for(const B of BLOBS){ const buf=b64(B);
    try{ const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:buf.slice(0,12)},key,buf.slice(12)); return new TextDecoder().decode(plain); }catch(e){} }
  throw new Error('bad');
}
async function go(pw,quiet){
  if(!(window.crypto&&crypto.subtle)){ const m=document.getElementById('msg'); m.style.color=''; m.textContent='이 화면에서는 잠금을 풀 수 없어요. 크롬 브라우저에서 https:// 주소로 열어 주세요.'; return; }
  const m=document.getElementById('msg'), b=document.getElementById('go');
  b.disabled=true; m.style.color='var(--soft)'; m.textContent='여는 중이에요…';
  try{ const h=await open_(pw); try{sessionStorage.setItem(SK,pw)}catch(e){}
       document.open(); document.write(h); document.close(); }
  catch(e){ try{sessionStorage.removeItem(SK)}catch(_){}
       m.style.color=''; m.textContent=quiet?'':'비밀번호가 맞지 않아요. (입력한 글자: '+pw.length+'글자) 👁 보기로 확인해 보세요.'; b.disabled=false; document.getElementById('pw').select(); }
}
document.getElementById('eye').onclick=()=>{ const i=document.getElementById('pw'); const on=i.classList.toggle('mask'); document.getElementById('eye').textContent=on?'👁 보기':'🙈 숨기기'; i.focus(); };\ndocument.getElementById('f').addEventListener('submit',e=>{e.preventDefault(); setTimeout(()=>{ const pw=document.getElementById('pw').value; if(pw) go(pw); },30);});
let saved=null; try{saved=sessionStorage.getItem(SK)}catch(e){}
if(saved) go(saved,true); else document.getElementById('pw').focus();
</script></body></html>
'''
page = page.replace('__SALT__', b(salt)).replace('__IT__', str(it)).replace('"__BLOB__"', '['+','.join('"'+x+'"' for x in blobs)+']')
open(out, 'w', encoding='utf-8').write(page)
print('ok', len(page))
