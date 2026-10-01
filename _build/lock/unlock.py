"""잠긴 페이지를 평문 HTML로 되돌린다(고친 뒤 lock.py로 다시 잠그기).
사용: LOCK_PW=비밀번호 python3 unlock.py 잠긴.html 평문.html   ※ 평문 파일은 저장소에 올리지 마세요."""
import os, sys, re, base64, unicodedata
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
s = open(sys.argv[1], encoding='utf-8').read()
salt = base64.b64decode(re.search(r'SALT="([^"]+)"', s).group(1)); it = int(re.search(r'IT=(\d+)', s).group(1))
buf = base64.b64decode(re.search(r'BLOBS?=\[?"([^"]+)"', s).group(1))
pw = unicodedata.normalize('NFC', os.environ['LOCK_PW'].strip())
key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=it).derive(pw.encode('utf-8'))
open(sys.argv[2], 'w', encoding='utf-8').write(AESGCM(key).decrypt(buf[:12], buf[12:], None).decode('utf-8'))
print('ok')
