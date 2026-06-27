# Come to My Window

A two-sided poster reveal. The artwork is a single window painted on both faces
of one wall: **Part I** looks out from night onto a daytime sky; **Part II** is
its reverse, looking from day into the cosmos. The site treats the two posters
as exactly that — back-to-back on a single wall — and lets you walk around it.

## Experience

1. **Lock screen.** Enter the passphrase **`window`** to open it.
2. **Unlock.** The lock fades, the soundtrack begins, and Part I faces you.
3. **Scroll.** Scrolling turns the wall horizontally (like a revolving door).
   At the midpoint you see the **edge of the wall itself** between the two
   posters; keep going and Part II settles into view. Scroll back to reverse it.

## Stack

Plain HTML / CSS / JS — no build step, no dependencies. The turn is a real CSS
3D box (`transform-style: preserve-3d`): the poster front, poster back, and four
edge faces give the wall genuine thickness. A tall scroll track with a sticky
stage maps scroll position to `rotateY` from 0° → 180°.

```
index.html        markup: lock screen + 3D stage + HUD
styles.css        all styling and the 3D geometry
script.js         lock logic, scroll→rotation, audio toggle
assets/images/    web-optimized art (desktop + @mobile variants)
assets/audio/     soundtrack location (see its README)
vercel.json       static hosting config
```

## Audio

The player loads `assets/audio/song.mp3`, which is intentionally **not
committed** — add your own track there (see `assets/audio/README.md`). The site
works without it; playback just stays paused until the file exists.

## Deploy

Static, deploys to Vercel as-is (no build / output directory needed). Push the
branch and import the repo, or `vercel` from the project root.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
