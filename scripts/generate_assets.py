#!/usr/bin/env python3
"""Generates every original asset in public/assets (pixel sprites, scenes, textures, audio).
Run from project root:  python3 scripts/generate_assets.py
All output is original work released under CC0 (see ASSET_CREDITS.md)."""
import math, os, random, struct, wave

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets')
random.seed(1717)

# ---------- palette ----------
P = dict(
    void='#0A0D18', console='#141A2E', bake='#5B4B8A', bakeHi='#7A68A8', bakeLo='#3A2F5E', bakeDk='#271F42',
    teal='#3F8F8B', tealLo='#2A5F5C', tealDk='#183836', cream='#E8DFC8', creamLo='#B9AE92',
    green='#7CFFB2', amber='#FFB347', amberLo='#9A6420', red='#FF3B3B', ink='#0A0D18',
)

# ---------- pixel sprite builder ----------
def sprite_svg(px, w, h, scale=1, bg=None):
    """px: dict[(x,y)] -> hex. Merges horizontal runs into rects."""
    rows = {}
    for (x, y), c in px.items():
        rows.setdefault(y, {})[x] = c
    parts = []
    for y in sorted(rows):
        xs = sorted(rows[y]); i = 0
        while i < len(xs):
            j = i
            while j + 1 < len(xs) and xs[j + 1] == xs[j] + 1 and rows[y][xs[j + 1]] == rows[y][xs[i]]:
                j += 1
            parts.append(f'<rect x="{xs[i]}" y="{y}" width="{xs[j]-xs[i]+1}" height="1" fill="{rows[y][xs[i]]}"/>')
            i = j + 1
    bgr = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w*scale}" height="{h*scale}" '
            f'shape-rendering="crispEdges">{bgr}{"".join(parts)}</svg>')

def rect(px, x0, y0, x1, y1, c):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[(x, y)] = c

def disc(px, cx, cy, r, c):
    for y in range(cy - r, cy + r + 1):
        for x in range(cx - r, cx + r + 1):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r * r + r * 0.6:
                px[(x, y)] = c

def line(px, x0, y0, x1, y1, c):
    n = max(abs(x1 - x0), abs(y1 - y0), 1)
    for i in range(n + 1):
        px[(round(x0 + (x1 - x0) * i / n), round(y0 + (y1 - y0) * i / n))] = c

# ---------- Squelch ----------
def squelch(state='idle'):
    px = {}
    W = 48
    # feet
    for fx in (9, 15, 31, 37):
        rect(px, fx, 41, fx + 2, 44, P['bakeDk'])
        rect(px, fx, 41, fx + 2, 41, P['bakeLo'])
    # antenna (slightly bent) + base
    bend = {'idle': 1, 'listening': 0, 'signal': 0, 'surprised': 0, 'sleepy': 2, 'happy': 1}[state]
    rect(px, 30, 11, 31, 16, P['bakeHi'])
    if bend == 0:
        rect(px, 30, 3, 31, 11, P['bakeHi'])
        rect(px, 29, 1, 32, 2, P['cream'])
    elif bend == 1:
        rect(px, 30, 6, 31, 11, P['bakeHi']); rect(px, 31, 4, 32, 6, P['bakeHi']); rect(px, 33, 2, 34, 4, P['bakeHi'])
        rect(px, 33, 0, 36, 1, P['cream'])
    else:  # droopy
        rect(px, 30, 8, 31, 11, P['bakeHi']); rect(px, 31, 6, 33, 8, P['bakeHi']); rect(px, 34, 7, 35, 10, P['bakeHi'])
        rect(px, 34, 11, 36, 12, P['cream'])
    # body, chunky with cut corners
    rect(px, 5, 17, 42, 40, P['bake'])
    for (x, y) in [(5, 17), (6, 17), (5, 18), (42, 17), (41, 17), (42, 18), (5, 40), (6, 40), (5, 39), (42, 40), (41, 40), (42, 39)]:
        px.pop((x, y), None)
    rect(px, 7, 16, 40, 16, P['bakeHi']); rect(px, 6, 17, 41, 17, P['bakeHi']); rect(px, 5, 18, 5, 38, P['bakeHi'])
    rect(px, 7, 41, 40, 41, P['bakeLo']) if False else None
    rect(px, 6, 40, 41, 40, P['bakeLo']); rect(px, 42, 19, 42, 38, P['bakeLo'])
    # heart / ON AIR light
    lamp = {'idle': P['amber'], 'listening': P['amber'], 'signal': P['green'], 'surprised': P['amber'],
            'sleepy': P['amberLo'], 'happy': P['amber']}[state]
    rect(px, 21, 18, 26, 20, P['bakeDk']); rect(px, 22, 19, 25, 19, lamp)
    if state in ('idle', 'listening', 'surprised', 'happy', 'signal'):
        px[(22, 18)] = lamp; px[(25, 18)] = lamp
    # frequency window
    rect(px, 18, 22, 29, 28, P['bakeDk'])
    rect(px, 19, 23, 28, 27, P['cream'])
    for tx in (20, 22, 24, 26):
        rect(px, tx, 25, tx, 27, P['creamLo'])
    needle = {'idle': 23, 'listening': 25, 'signal': 26, 'surprised': 21, 'sleepy': 20, 'happy': 27}[state]
    rect(px, needle, 23, needle, 27, P['green'] if state == 'signal' else P['red'])
    # knobs = eyes
    ey = 24
    for ex in (11, 36):
        r = 5 if state == 'surprised' else 4
        disc(px, ex, ey, r + 1, P['bakeDk'])
        if state == 'sleepy':
            rect(px, ex - 4, ey, ex + 4, ey + 1, P['bakeLo'])
            rect(px, ex - 3, ey - 1, ex + 3, ey - 1, P['cream'])
            continue
        if state == 'happy':
            line(px, ex - 3, ey + 1, ex - 1, ey - 2, P['cream']); line(px, ex - 1, ey - 2, ex, ey - 2, P['cream'])
            line(px, ex, ey - 2, ex + 1, ey - 2, P['cream']); line(px, ex + 1, ey - 2, ex + 3, ey + 1, P['cream'])
            continue
        disc(px, ex, ey, r, P['cream'])
        if state == 'signal':
            disc(px, ex, ey, 2, P['green'])
        else:
            ox = {'idle': 1, 'listening': 2, 'surprised': 0}[state]
            oy = {'idle': 0, 'listening': -1, 'surprised': 0}[state]
            disc(px, ex + ox, ey + oy, 2 if state != 'surprised' else 1, P['ink'])
            px[(ex + ox - 1, ey + oy - 1)] = P['cream']
    # speaker grille = mouth
    rect(px, 11, 31, 36, 38, P['tealDk'])
    rect(px, 12, 32, 35, 37, P['teal'])
    if state == 'surprised':
        rect(px, 21, 33, 26, 36, P['tealDk']); rect(px, 22, 32, 25, 37, P['tealDk'])
    else:
        for gy in (33, 35, 37):
            rect(px, 12, gy, 35, gy, P['tealLo'])
        if state == 'happy':
            for gx in (14, 20, 26, 32):
                rect(px, gx, 32, gx + 1, 37, P['tealLo'])
    # extras
    if state == 'signal':
        for i, r in enumerate((3, 5, 7)):
            for a in range(-60, 61, 6):
                x = int(35 + r * math.cos(math.radians(a - 90 + 45))); y = int(2 + r * math.sin(math.radians(a - 90 + 45)))
                if 0 <= x < W and 0 <= y < 16: px[(x, y)] = P['green']
    if state == 'sleepy':
        rect(px, 38, 6, 41, 6, P['cream']); px[(40, 7)] = P['cream']; px[(39, 8)] = P['cream']; rect(px, 38, 9, 41, 9, P['cream'])
        rect(px, 43, 1, 45, 1, P['creamLo']); px[(44, 2)] = P['creamLo']; rect(px, 43, 3, 45, 3, P['creamLo'])
    if state == 'happy':
        px[(5, 14)] = P['amber']; px[(4, 13)] = P['amber']; px[(6, 13)] = P['amber']; px[(5, 12)] = P['amber']
        px[(42, 16)] = P['green'];
    return sprite_svg(px, W, 48, 8)

os.makedirs(f'{OUT}/characters', exist_ok=True)
for s in ('idle', 'listening', 'signal', 'surprised', 'sleepy', 'happy'):
    open(f'{OUT}/characters/squelch-{s}.svg', 'w').write(squelch(s))

# ---------- scenes (160x90 pixel dioramas) ----------
def sky(px, top, bot, w=160, h=90, horizon=62):
    def mix(a, b, t):
        a = [int(a[i:i+2], 16) for i in (1, 3, 5)]; b = [int(b[i:i+2], 16) for i in (1, 3, 5)]
        return '#%02x%02x%02x' % tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
    for y in range(h):
        c = mix(top, bot, min(1, y / horizon))
        rect(px, 0, y, w - 1, y, c)
    for _ in range(40):
        x, y = random.randrange(w), random.randrange(0, 40)
        px[(x, y)] = random.choice([P['cream'], P['creamLo'], P['bakeHi']])

def building(px, x, w, h, base=70, c=P['console'], lit=0.0, litc=P['amber']):
    rect(px, x, base - h, x + w - 1, base, c)
    rect(px, x, base - h, x + w - 1, base - h, P['bakeDk'])
    for wy in range(base - h + 3, base - 3, 5):
        for wx in range(x + 2, x + w - 2, 4):
            if random.random() < lit: rect(px, wx, wy, wx + 1, wy + 2, litc)

def ground(px, w=160, y0=70, h=90):
    rect(px, 0, y0, w - 1, h - 1, P['void'])
    rect(px, 0, y0, w - 1, y0, P['bakeDk'])

def fog(px, y, w=160, thick=4, c='#2a3150'):
    for yy in range(y, y + thick):
        for x in range(w):
            if (x // 3 + yy) % 3 != 0: px[(x, yy)] = c

def tower(px, x, base=70, h=40):
    line(px, x - 6, base, x, base - h, P['bakeHi']); line(px, x + 6, base, x, base - h, P['bakeHi'])
    for k in range(8, h, 8):
        w = int(6 * (1 - k / h)); rect(px, x - w, base - k, x + w, base - k, P['bakeLo'])
    rect(px, x, base - h - 3, x, base - h, P['bakeHi'])
    px[(x, base - h - 4)] = P['red']

def moon(px, x, y, r=6):
    disc(px, x, y, r, P['cream']); disc(px, x + 2, y - 1, r - 2, P['creamLo']) if False else None
    for _ in range(6): px[(x + random.randint(-3, 3), y + random.randint(-3, 3))] = P['creamLo']

def save_scene(name, px, w=160, h=90):
    open(f'{OUT}/backgrounds/{name}.svg', 'w').write(sprite_svg(px, w, h, 1, bg=P['void']).replace('width="160" height="90"', 'width="160" height="90" preserveAspectRatio="xMidYMid slice"'))

os.makedirs(f'{OUT}/backgrounds', exist_ok=True)

# main background: the hollow at night
px = {}; sky(px, '#0A0D18', '#2a2650'); moon(px, 118, 20)
for x, w, h in [(2, 10, 18), (14, 8, 26), (24, 12, 20), (40, 9, 30), (96, 10, 22), (108, 13, 17), (124, 9, 28), (136, 12, 21), (150, 9, 16)]:
    building(px, x, w, h, lit=0.05)
building(px, 54, 28, 24, c='#1b2140', lit=0.0)
for chx in (58, 66, 74): rect(px, chx, 38, chx + 2, 46, '#1b2140')
tower(px, 90, h=46); ground(px); fog(px, 66, thick=5); fog(px, 74, thick=3, c='#1a2040')
rect(px, 82, 60, 83, 70, P['bakeDk']); rect(px, 80, 59, 85, 60, P['amber']); rect(px, 81, 61, 84, 61, P['amberLo'])
save_scene('lowtide-hollow', px)

# scene 1: factory, once busy
px = {}; sky(px, '#10142a', '#3a2f5e')
building(px, 30, 100, 38, c='#1b2140', lit=0.5)
for chx in (40, 60, 108):
    rect(px, chx, 14, chx + 5, 32, '#1b2140')
    for k in range(3): disc(px, chx + 3 + k * 2, 11 - k * 4, 2 + k, '#2a3150')
ground(px)
for x in range(34, 128, 6): rect(px, x, 66, x + 3, 68, P['bake'])  # radios on the line
save_scene('scene-factory', px)

# scene 2: emptied street
px = {}; sky(px, '#0A0D18', '#1d2142'); moon(px, 40, 18, 5)
for x, w, h in [(0, 22, 36), (26, 16, 28), (110, 18, 34), (132, 28, 30)]: building(px, x, w, h, lit=0.0)
ground(px); rect(px, 0, 71, 159, 74, '#141a2e')
for x in range(8, 160, 24): rect(px, x, 80, x + 8, 80, P['bakeDk'])
rect(px, 70, 62, 71, 70, P['bakeDk']); rect(px, 72, 61, 78, 63, P['bakeLo'])  # sign
fog(px, 68, thick=6)
save_scene('scene-empty', px)

# scene 3: the station room
px = {}; rect(px, 0, 0, 159, 89, '#0f1326'); rect(px, 0, 66, 159, 89, '#0a0d18'); rect(px, 0, 66, 159, 66, P['bakeDk'])
rect(px, 18, 14, 60, 50, '#1b2140'); rect(px, 20, 16, 58, 48, '#0d1f30')   # window
for _ in range(25): px[(random.randint(21, 57), random.randint(17, 47))] = random.choice([P['cream'], P['creamLo']])
rect(px, 80, 40, 140, 64, P['bakeLo']); rect(px, 80, 40, 140, 41, P['bake'])   # desk console
for i in range(6): disc(px, 88 + i * 9, 52, 2, P['cream']); px[(88 + i * 9, 51)] = P['ink']
rect(px, 120, 44, 136, 48, P['tealDk']); rect(px, 121, 45, 135, 47, P['teal'])
rect(px, 96, 30, 112, 38, P['bakeDk']); rect(px, 98, 32, 110, 36, P['cream'])      # dial window
px[(104, 32)] = px[(104, 33)] = px[(104, 34)] = P['red']
save_scene('scene-station', px)

# scene 4: the lamp
px = {}; sky(px, '#0A0D18', '#141a2e'); ground(px, y0=70)
for r, c in ((26, '#1d1a2c'), (18, '#2b2230'), (11, '#4a3322'), (6, '#8a5a24')):
    disc(px, 80, 50, r, c)
rect(px, 79, 40, 81, 71, P['bakeDk']); rect(px, 74, 36, 86, 41, P['bakeLo'])
rect(px, 76, 38, 84, 40, P['amber']); rect(px, 78, 39, 82, 39, P['cream'])
fog(px, 72, thick=4)
save_scene('scene-lamp', px)

# ---------- textures ----------
os.makedirs(f'{OUT}/textures', exist_ok=True)
open(f'{OUT}/textures/scanlines.svg', 'w').write('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="2" fill="#000" fill-opacity="0.28"/></svg>')
open(f'{OUT}/textures/noise.svg', 'w').write('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/></filter><rect width="200" height="200" filter="url(#n)"/></svg>')
open(f'{OUT}/textures/grille.svg', 'w').write('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#183836"/><rect y="1" width="8" height="2" fill="#2A5F5C"/></svg>')

# ---------- audio (procedural, original, CC0) ----------
os.makedirs(f'{OUT}/audio', exist_ok=True)
SR = 22050
def write_wav(name, samples):
    with wave.open(f'{OUT}/audio/{name}', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(b''.join(struct.pack('<h', max(-32767, min(32767, int(s * 32767)))) for s in samples))

# soft static loop (2.0s, filtered noise, crossfaded for seamless loop)
n = SR * 2; raw = [random.uniform(-1, 1) for _ in range(n)]; lp = []; a = 0.0
for v in raw: a = a * 0.55 + v * 0.45; lp.append(a)
fade = SR // 20
for i in range(fade):
    t = i / fade; lp[i] = lp[i] * t + lp[n - fade + i] * (1 - t)
write_wav('static-loop.wav', [s * 0.35 for s in lp[:n - fade]])
# dial click
click = []
for i in range(int(SR * 0.09)):
    t = i / SR; env = math.exp(-t * 60)
    click.append((random.uniform(-1, 1) * 0.4 + math.sin(2 * math.pi * 180 * t) * 0.6) * env * 0.8)
write_wav('dial-click.wav', click)
# tune-in: sweep with noise bursts then soft two-note chime
tune = []; T = 1.3
for i in range(int(SR * T)):
    t = i / SR; f = 200 + 900 * (t / 0.7) ** 2 if t < 0.7 else 0
    s = 0.0
    if t < 0.7: s = math.sin(2 * math.pi * f * t) * 0.18 + random.uniform(-1, 1) * 0.12 * (1 - t / 0.7)
    else:
        tt = t - 0.7; env = math.exp(-tt * 4)
        s = (math.sin(2 * math.pi * 523.25 * tt) + 0.5 * math.sin(2 * math.pi * 784 * tt)) * 0.22 * env
    tune.append(s)
write_wav('tune-in.wav', tune)
print('assets generated')
