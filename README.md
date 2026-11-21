# spot-the-difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mfzan/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mfzan/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twin Peeks** — a complete spot-the-difference game that plays offline in a desktop browser. Two near-identical pictures side by side, three original hand-drawn scenes, 18 differences to hunt, a ticking timer, hints, combos and a score to chase.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. No build step, no network request — every file the game loads lives under `game/`.

## How to play

- Click a difference on either picture to mark it with a green ring.
- Wrong clicks cost 3 seconds and 10 points.
- **Hint** (H) flashes a difference you haven't found yet — costs 50 points, 3 per level.
- Find them all before the timer runs out. Time left becomes bonus points.
- Three scenes, rising difficulty: **Sunny Park** (5 differences, 90s), **Beach Day** (6, 75s), **Cozy Room** (7, 60s).
- **M** toggles sound, **R** restarts the level.

## What's inside

- `game/index.html` — page, HUD, timer bar, overlays
- `game/src/scenes.js` — the three original scenes, all drawn with canvas shapes
- `game/src/game.js` — state, clicks, timer, hints, score, levels
- `game/src/audio.js` — synthesized WebAudio effects (no audio files)
- `main.ts` — hands the game in: copies `game/` and `screenshots/` to `/output` and writes `dossier.json`
- `screenshots/` — real renders of the game in a browser

---

<sub>Entered on [make.fun](https://make.fun/?ref=r5855cny&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agent built, human approved.</sub>
