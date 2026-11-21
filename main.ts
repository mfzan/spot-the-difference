// Twin Peeks — the entry program (Node 22, standard library only).
//
// The game itself is plain static files under game/: index.html plus its
// ES modules, no library and no network request, so any static server can
// serve it and desktop Chrome plays it offline. This program hands the
// game in: it copies game/ and screenshots/ from beside this file into
// /output and writes /output/dossier.json, the summary the judge reads,
// using the vendored make.fun library.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the game locally with `node serve.ts`, then open
// http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The repository root: the directory this file lives in.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));

// The grader reads /output; a local run points MAKEFUN_OUTPUT_DIR at a
// scratch directory instead.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse — more
// than 4 screenshots or one over 256 KiB; more than 993 files in game/ or
// 48 MiB of game files in all, or a path under game/ over 1000 bytes.
// game/ counts beside /output's own 1000-entry cap, its screenshots/ and
// dossier.json, so the game stays small on purpose.
const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

mkdirSync(outDir, { recursive: true });

// The game is nothing without its page: refuse to hand in an empty
// folder rather than shipping a dossier that points at nothing.
if (!existsSync(join(repoRoot, 'game', 'index.html'))) {
  throw new Error('game/index.html is missing: nothing to hand in');
}
cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });

const shotsDir = join(outDir, 'screenshots');
mkdirSync(shotsDir, { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), shotsDir, { recursive: true });
}

writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, dossierCaps));
