#!/usr/bin/env python3
"""유튜브 채널 '초등교사 홍지희'(@hongjihee1005)의 공개 영상 정보를 channel.json으로 받기

    python3 _build/youtube/fetch.py

- 새로 올린 영상: 채널 RSS(최근 15편, 올린 날짜 포함) + 채널 '동영상' 페이지(최근 30편쯤)
- 재생목록: 채널 '재생목록' 페이지 → 재생목록마다 그 페이지(앞쪽 100편까지)
- 모두 누구나 볼 수 있는 공개 페이지만 읽습니다(로그인·API 키 없음).
- 다른 채널의 영상(재생목록에 저장해 둔 것)은 빼고, 이 채널(CHANNEL_ID)이 올린 영상만 싣습니다.
- 받기에 실패하면(인터넷이 막힌 곳 등) 이전 channel.json을 그대로 둡니다 → 빌드는 그 자료로 계속됩니다.
자동: GitHub Actions '유튜브 영상 가져오기'(.github/workflows/youtube.yml)가 하루에 한 번 돌립니다.
"""
import json, os, re, sys, time, urllib.request
import xml.etree.ElementTree as ET

HANDLE = "@hongjihee1005"
CHANNEL_ID = "UC46YYcaAMauFIT7XyDjQNTQ"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "channel.json")
UA = {"User-Agent": "Mozilla/5.0 (hong_teacher site builder)", "Accept-Language": "ko-KR,ko;q=0.9"}


def get(url):
    err = None
    for k in range(3):
        try:
            req = urllib.request.Request(url, headers=UA)
            return urllib.request.urlopen(req, timeout=40).read().decode("utf-8")
        except Exception as e:
            err = e
            time.sleep(2 + 4 * k)
    raise err


def initial(html):
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html, re.S)
    return json.loads(m.group(1)) if m else {}


def walk(o, key):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == key:
                yield v
            yield from walk(v, key)
    elif isinstance(o, list):
        for v in o:
            yield from walk(v, key)


def text(t):
    if isinstance(t, str):
        return t
    if not isinstance(t, dict):
        return ""
    if "simpleText" in t:
        return t["simpleText"]
    if "content" in t:
        return t["content"]
    return "".join(r.get("text", "") for r in t.get("runs", []))


def lockups(d, kind):
    """페이지 자료에서 영상(kind='VIDEO') 또는 재생목록('PLAYLIST') 카드를 차례대로"""
    out, seen = [], set()
    for v in walk(d, "lockupViewModel"):
        if not isinstance(v, dict) or v.get("contentType") != f"LOCKUP_CONTENT_TYPE_{kind}":
            continue
        cid = v.get("contentId")
        if not cid or cid in seen:
            continue
        seen.add(cid)
        owners = {b.get("browseId") for b in walk(v, "browseEndpoint") if isinstance(b, dict) and str(b.get("browseId", "")).startswith("UC")}
        if kind == "VIDEO" and owners and CHANNEL_ID not in owners:
            continue                         # 재생목록에 저장해 둔 다른 채널의 영상은 싣지 않음(2026-11-27)
        md = v.get("metadata", {}).get("lockupMetadataViewModel", {})
        badges = [text(b.get("text")) for b in walk(v, "thumbnailBadgeViewModel") if isinstance(b, dict)]
        out.append({"id": cid, "title": text(md.get("title")).strip(), "badge": next((b for b in badges if b), "")})
    if kind == "VIDEO":                      # 옛 모양의 페이지
        for v in walk(d, "videoRenderer"):
            owners = {b.get("browseId") for b in walk(v, "browseEndpoint") if isinstance(b, dict) and str(b.get("browseId", "")).startswith("UC")}
            if owners and CHANNEL_ID not in owners:
                continue
            if isinstance(v, dict) and v.get("videoId") and v["videoId"] not in seen:
                seen.add(v["videoId"])
                out.append({"id": v["videoId"], "title": text(v.get("title")).strip(), "badge": text(v.get("lengthText"))})
    return out


def rss():
    x = get(f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}")
    ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    root = ET.fromstring(x)
    out = []
    for e in root.findall("a:entry", ns):
        out.append({"id": e.find("yt:videoId", ns).text, "title": e.find("a:title", ns).text.strip(),
                    "date": e.find("a:published", ns).text[:10]})
    return out


def main():
    try:
        latest = rss()
        page = initial(get(f"https://www.youtube.com/{HANDLE}/videos"))
        recent = lockups(page, "VIDEO")
        total = next((m for m in re.findall(r'"content":"동영상 ([\d,]+)개"', json.dumps(page, ensure_ascii=False, separators=(",", ":")))), "")
        pls = []
        for p in lockups(initial(get(f"https://www.youtube.com/{HANDLE}/playlists")), "PLAYLIST"):
            vids = lockups(initial(get(f"https://www.youtube.com/playlist?list={p['id']}")), "VIDEO")
            n = int(re.sub(r"[^\d]", "", p["badge"]) or len(vids))
            if n <= 100:
                n = len(vids)                # 다른 채널 영상을 뺀 수
            pls.append({"id": p["id"], "title": p["title"], "count": n, "videos": [{"id": v["id"], "title": v["title"], "len": v["badge"]} for v in vids]})
            time.sleep(0.5)
    except Exception as e:
        print(f"[알림] 유튜브에서 받지 못함({e.__class__.__name__}: {e}) — 이전 channel.json을 그대로 씁니다.")
        return 0
    if not latest and not recent:
        print("[알림] 영상을 하나도 못 읽음(유튜브 페이지 모양이 바뀌었을 수 있음) — 이전 channel.json을 그대로 씁니다.")
        return 0
    when = {v["id"]: v["date"] for v in latest}
    old = {}
    if os.path.exists(OUT):
        old = json.load(open(OUT, encoding="utf-8"))
    data = {"channel": CHANNEL_ID, "handle": HANDLE, "total": int(total.replace(",", "")) if total else None,
            "latest": latest,
            "recent": [{"id": v["id"], "title": v["title"], "len": v["badge"], "date": when.get(v["id"], "")} for v in recent],
            "playlists": pls}
    same = {k: v for k, v in old.items() if k != "fetched"} == data
    data["fetched"] = old.get("fetched") if same else time.strftime("%Y-%m-%d")
    json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"channel.json: 새 영상 {len(latest)} · 최근 {len(recent)} · 재생목록 {len(pls)}개(영상 {sum(len(p['videos']) for p in pls)}편)"
          + (" — 바뀐 것 없음" if same else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
