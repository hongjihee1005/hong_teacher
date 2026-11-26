"""「처음 배우는 과학」 공용 부품 — 실제 그림(캔바 사진풍) 액자·그림 위 이름표·화살표·동그라미

    import firstkit as F
    p = F.photo('f3ep05/butterfly', width=8.0)            # 둥근 테두리 액자(그림은 photos/f3ep05/butterfly.jpg)
    p = F.photo('f3ep05/carp', width=6, crop=(0.1, 0.0, 0.9, 1.0))   # 잘라 쓰기(왼·위·오른·아래, 0~1)
    pt = p.at(1210, 300)                                  # 원본 그림(1920×1080) 픽셀 → 화면 좌표
    arr, tag = F.callout(p, (1210, 300), "더듬이", to=(2.0, 1.0))   # 화살표 먼저, 이름표는 위에
    self.play(GrowArrow(arr), FadeIn(tag))
    ring = F.ring(p, (1210, 300), r=0.5)

그림 파일이 없으면 회색 '그림 준비 중' 자리를 그려 장면을 미리 만들 수 있습니다.
"""
import os

import numpy as np
from manim import (Arrow, Circle, Group, ImageMobject, RoundedRectangle, VGroup)

from series_style import INK, ORANGE, PAPER, SOFT, T, M

HERE = os.path.dirname(os.path.abspath(__file__))
PHOTOS = os.path.join(HERE, "photos")
CACHE = os.path.join(HERE, "media", "photo_cache")


def _prepared(key, crop, radius_px):
    """잘라 내고 모서리를 둥글게 만든 PNG 경로와 (원본 가로, 세로, 자른 상자 px)"""
    from PIL import Image, ImageDraw
    src = os.path.join(PHOTOS, key + ".jpg")
    os.makedirs(CACHE, exist_ok=True)
    tag = key.replace("/", "_") + ("_%.3f_%.3f_%.3f_%.3f" % crop) + f"_{radius_px}"
    out = os.path.join(CACHE, tag + ".png")
    if os.path.exists(src):
        im = Image.open(src).convert("RGB")
    else:   # 자리 표시
        im = Image.new("RGB", (1920, 1080), (205, 200, 190))
        d = ImageDraw.Draw(im)
        d.line([(0, 0), (1920, 1080)], fill=(170, 165, 155), width=8)
        d.line([(0, 1080), (1920, 0)], fill=(170, 165, 155), width=8)
    W, H = im.size
    box = (int(crop[0] * W), int(crop[1] * H), int(crop[2] * W), int(crop[3] * H))
    if not os.path.exists(out) or (os.path.exists(src) and os.path.getmtime(src) > os.path.getmtime(out)):
        c = im.crop(box).convert("RGBA")
        mask = Image.new("L", c.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, c.size[0] - 1, c.size[1] - 1], radius=radius_px, fill=255)
        c.putalpha(mask)
        c.save(out)
    return out, (W, H), box, os.path.exists(src)


class Photo(Group):
    """둥근 테두리 액자. at(px, py)로 원본 그림 픽셀 자리를 화면 좌표로 바꿈"""

    def __init__(self, key, width=None, height=None, crop=(0, 0, 1, 1), border=INK, border_w=6, radius=0.28):
        cw = (crop[2] - crop[0]) * 1920
        ch = (crop[3] - crop[1]) * 1080
        if width is None and height is None:
            width = 9.0
        if width is None:
            width = height * cw / ch
        # 화면 1단위 ≈ 135px(1080/8) → 둥근 정도를 원본 px로
        rpx = int(radius * cw / width)
        path, (W, H), box, have = _prepared(key, tuple(crop), rpx)
        img = ImageMobject(path)
        img.set_width(width)
        frame = RoundedRectangle(corner_radius=radius, width=img.width, height=img.height,
                                 stroke_color=border, stroke_width=border_w, fill_opacity=0)
        frame.move_to(img)
        items = [img, frame]
        if not have:
            items.append(T("그림 준비 중: " + key, 30, SOFT).move_to(img))
        super().__init__(*items)
        self.img, self.frame = img, frame
        self._W, self._H, self._box = W, H, box
        self.key = key

    def at(self, px, py):
        """원본 그림(가로 W·세로 H 픽셀, 왼쪽 위 0,0)의 한 점 → 지금 화면 좌표"""
        x0, y0, x1, y1 = self._box
        fx = (px - x0) / (x1 - x0)
        fy = (py - y0) / (y1 - y0)
        ul = self.frame.get_corner(np.array([-1, 1, 0]))
        dr = self.frame.get_corner(np.array([1, -1, 0]))
        return np.array([ul[0] + fx * (dr[0] - ul[0]), ul[1] + fy * (dr[1] - ul[1]), 0.0])


def photo(key, width=None, height=None, crop=(0, 0, 1, 1), **kw):
    return Photo(key, width=width, height=height, crop=crop, **kw)


def name_tag(text, size=40, color=INK, fill=PAPER, stroke=None, pad=0.18):
    t = M(text, size, color)
    box = RoundedRectangle(corner_radius=0.16, width=t.width + 2 * pad + 0.1, height=t.height + 2 * pad,
                           fill_color=fill, fill_opacity=0.96, stroke_color=stroke or color, stroke_width=4)
    t.move_to(box)
    g = VGroup(box, t)
    g.box, g.text = box, t
    return g


def callout(ph, pt, text, to=(1.8, 1.0), size=40, color=ORANGE, tag_color=INK, buff=0.08):
    """그림 위 한 점(pt=(px,py) 원본 픽셀 또는 화면 좌표 배열)을 가리키는 화살표 + 이름표.
    to: 점에서 이름표 가운데까지(화면 단위). 화살표를 먼저 그리고 이름표는 위에 얹으세요."""
    p = ph.at(*pt) if isinstance(pt, tuple) else np.array(pt, dtype=float)
    tag = name_tag(text, size, tag_color, stroke=color)
    tag.move_to(p + np.array([to[0], to[1], 0]))
    # 이름표 테두리에서 시작
    d = p - tag.get_center()
    hw, hh = tag.width / 2, tag.height / 2
    s = min(hw / max(abs(d[0]), 1e-6), hh / max(abs(d[1]), 1e-6))
    start = tag.get_center() + d * min(s, 1.0)
    arr = Arrow(start, p, buff=buff, stroke_width=7, color=color, max_tip_length_to_length_ratio=0.25,
                tip_length=0.26)
    tag.set_z_index(5)
    arr.set_z_index(4)
    return arr, tag


def arrow(start, end, color=ORANGE, buff=0.08):
    a = Arrow(np.array(start, dtype=float), np.array(end, dtype=float), buff=buff, stroke_width=7, color=color,
              max_tip_length_to_length_ratio=0.25, tip_length=0.26)
    a.set_z_index(4)
    return a


def ring(ph, pt, r=0.5, color=ORANGE, sw=8, rx=None, ry=None):
    """그림 위 동그라미(타원도 됨)"""
    from manim import Ellipse
    p = ph.at(*pt) if isinstance(pt, tuple) else np.array(pt, dtype=float)
    if rx or ry:
        c = Ellipse(width=2 * (rx or r), height=2 * (ry or r), stroke_color=color, stroke_width=sw)
    else:
        c = Circle(radius=r, stroke_color=color, stroke_width=sw)
    c.move_to(p)
    c.set_z_index(4)
    return c


def caption(ph, text, size=38, color=INK, buff=0.18):
    """액자 아래 이름 글"""
    t = M(text, size, color)
    t.next_to(ph.frame, np.array([0, -1, 0]), buff=buff)
    return t
