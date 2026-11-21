// Twin Peeks — game logic. Two near-identical pictures side by side;
// click a difference on either panel to mark it. Find them all before
// the timer runs out.

import { SCENES, PANEL_W, PANEL_H } from './scenes.js';
import { sfx, setMuted, isMuted } from './audio.js';

const $ = (id) => document.getElementById(id);
const leftCv = $('left');
const rightCv = $('right');
const lctx = leftCv.getContext('2d');
const rctx = rightCv.getContext('2d');

let phase = 'title'; // title | playing | levelDone | win | over
let level = 0;
let found = new Set();
let score = 0;
let hintsLeft = 3;
let timeLeft = 0;
let timerId = null;
let flash = null; // { x, y, side, kind, until }
let hintPulse = null; // { idx, until }
let combo = 0;
let lastTickSecond = -1;

function scene() { return SCENES[level]; }

function drawPanels() {
  const s = scene();
  s.draw(lctx, 0);
  s.draw(rctx, 1);
  // found markers on both panels
  for (const idx of found) {
    const d = s.diffs[idx];
    ring(lctx, d.x, d.y, d.r + 6);
    ring(rctx, d.x, d.y, d.r + 6);
  }
  // hint pulse
  if (hintPulse && Date.now() < hintPulse.until) {
    const d = s.diffs[hintPulse.idx];
    const a = 0.5 + 0.5 * Math.sin(Date.now() / 120);
    lctx.save();
    lctx.globalAlpha = a;
    ring(lctx, d.x, d.y, d.r + 8, '#f7b731');
    rctx.save();
    rctx.globalAlpha = a;
    ring(rctx, d.x, d.y, d.r + 8, '#f7b731');
    lctx.restore();
    rctx.restore();
  }
  // wrong-click flash
  if (flash && Date.now() < flash.until) {
    const c = flash.side === 0 ? lctx : rctx;
    c.save();
    c.strokeStyle = '#e74c3c';
    c.lineWidth = 4;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(flash.x - 12, flash.y - 12);
    c.lineTo(flash.x + 12, flash.y + 12);
    c.moveTo(flash.x + 12, flash.y - 12);
    c.lineTo(flash.x - 12, flash.y + 12);
    c.stroke();
    c.restore();
  }
}

function ring(ctx, x, y, r, color) {
  ctx.save();
  ctx.strokeStyle = color || '#2ecc71';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function renderLoop() {
  if (phase !== 'playing' && phase !== 'levelDone') return;
  drawPanels();
  requestAnimationFrame(renderLoop);
}

function updateHUD() {
  const s = scene();
  $('levelName').textContent = 'Level ' + (level + 1) + ' · ' + s.name;
  $('foundCount').textContent = found.size + ' / ' + s.diffs.length;
  $('score').textContent = score;
  $('timeLeft').textContent = Math.max(0, Math.ceil(timeLeft)) + 's';
  $('hintsLeft').textContent = hintsLeft;
  $('timeBar').style.width = Math.max(0, (timeLeft / s.time) * 100) + '%';
  $('timeBar').classList.toggle('low', timeLeft <= 10);
  $('hintBtn').disabled = hintsLeft <= 0 || phase !== 'playing';
  // level dots
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('done', i < level);
    d.classList.toggle('now', i === level);
  });
}

function showOverlay(html) {
  $('overlay').innerHTML = html;
  $('overlay').classList.remove('hidden');
}
function hideOverlay() { $('overlay').classList.add('hidden'); }

function startLevel(i) {
  level = i;
  found = new Set();
  hintsLeft = 3;
  timeLeft = scene().time;
  combo = 0;
  flash = null;
  hintPulse = null;
  phase = 'playing';
  hideOverlay();
  updateHUD();
  drawPanels();
  renderLoop();
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (phase !== 'playing') return;
    timeLeft -= 0.1;
    if (timeLeft <= 10 && Math.ceil(timeLeft) !== lastTickSecond) {
      lastTickSecond = Math.ceil(timeLeft);
      if (timeLeft > 0) sfx.tick();
    }
    if (timeLeft <= 0) {
      timeLeft = 0;
      gameOver();
    }
    updateHUD();
  }, 100);
}

function levelComplete() {
  phase = 'levelDone';
  clearInterval(timerId);
  const bonus = Math.ceil(timeLeft) * 10;
  score += bonus;
  sfx.level();
  updateHUD();
  if (level + 1 >= SCENES.length) {
    setTimeout(winGame, 900);
    showOverlay(
      '<h2>Level complete!</h2>' +
      '<p>Time bonus: <b>+' + bonus + '</b></p>' +
      '<p class="muted">One moment…</p>'
    );
  } else {
    showOverlay(
      '<h2>Level ' + (level + 1) + ' complete!</h2>' +
      '<p>Time bonus: <b>+' + bonus + '</b></p>' +
      '<p>Next up: <b>' + SCENES[level + 1].name + '</b></p>' +
      '<button id="nextBtn">Next level →</button>'
    );
    $('nextBtn').onclick = () => startLevel(level + 1);
  }
}

function winGame() {
  phase = 'win';
  clearInterval(timerId);
  sfx.win();
  showOverlay(
    '<h2>You found them all!</h2>' +
    '<p class="big">Final score: <b>' + score + '</b></p>' +
    '<p>Three scenes, ' + SCENES.reduce((n, s) => n + s.diffs.length, 0) + ' differences — sharp eyes!</p>' +
    '<button id="againBtn">Play again</button>'
  );
  $('againBtn').onclick = () => { score = 0; startLevel(0); };
}

function gameOver() {
  phase = 'over';
  clearInterval(timerId);
  sfx.lose();
  const s = scene();
  showOverlay(
    '<h2>Time\'s up!</h2>' +
    '<p>You found <b>' + found.size + ' / ' + s.diffs.length + '</b> in ' + s.name + '.</p>' +
    '<button id="retryBtn">Retry level</button> ' +
    '<button id="restartBtn" class="ghost">Start over</button>'
  );
  $('retryBtn').onclick = () => startLevel(level);
  $('restartBtn').onclick = () => { score = 0; startLevel(0); };
}

function onPanelClick(ev, side) {
  if (phase !== 'playing') return;
  const cv = side === 0 ? leftCv : rightCv;
  const rect = cv.getBoundingClientRect();
  const x = ((ev.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((ev.clientY - rect.top) / rect.height) * PANEL_H;
  const s = scene();
  let hit = -1;
  for (let i = 0; i < s.diffs.length; i++) {
    if (found.has(i)) continue;
    const d = s.diffs[i];
    const dx = x - d.x, dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) { hit = i; break; }
  }
  if (hit >= 0) {
    found.add(hit);
    combo += 1;
    const pts = 100 + Math.min(combo - 1, 4) * 25;
    score += pts;
    sfx.found();
    $('msg').textContent = 'Found: ' + s.diffs[hit].name + '  (+' + pts + ')';
    if (found.size === s.diffs.length) {
      updateHUD();
      drawPanels();
      setTimeout(levelComplete, 500);
      return;
    }
  } else {
    combo = 0;
    score = Math.max(0, score - 10);
    timeLeft = Math.max(0, timeLeft - 3);
    flash = { x, y, side, kind: 'x', until: Date.now() + 450 };
    sfx.wrong();
    $('msg').textContent = 'Not a difference — minus 3 seconds!';
  }
  updateHUD();
  drawPanels();
}

function useHint() {
  if (phase !== 'playing' || hintsLeft <= 0) return;
  const s = scene();
  const remaining = s.diffs.map((_, i) => i).filter((i) => !found.has(i));
  if (!remaining.length) return;
  hintsLeft -= 1;
  score = Math.max(0, score - 50);
  const idx = remaining[Math.floor(Math.random() * remaining.length)];
  hintPulse = { idx, until: Date.now() + 1600 };
  sfx.hint();
  $('msg').textContent = 'Hint: look near the glowing circle… (−50)';
  updateHUD();
}

function showTitle() {
  phase = 'title';
  drawPanels();
  const total = SCENES.reduce((n, s) => n + s.diffs.length, 0);
  showOverlay(
    '<h1>Twin Peeks</h1>' +
    '<p class="tag">Spot the difference — two pictures, one sneaky twin.</p>' +
    '<p>Three scenes · <b>' + total + ' differences</b> to find.<br>' +
    'Click a difference on either picture. Wrong clicks cost 3 seconds.<br>' +
    'Hints cost 50 points — you get 3 per level.</p>' +
    '<button id="playBtn">▶ Start playing</button>' +
    '<p class="muted small">Keyboard: H = hint · M = mute · R = restart level</p>'
  );
  $('playBtn').onclick = () => { score = 0; startLevel(0); };
}

// wire up
leftCv.addEventListener('click', (e) => onPanelClick(e, 0));
rightCv.addEventListener('click', (e) => onPanelClick(e, 1));
$('hintBtn').onclick = useHint;
$('muteBtn').onclick = () => {
  setMuted(!isMuted());
  $('muteBtn').textContent = isMuted() ? '🔇 Muted' : '🔊 Sound';
};
document.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') useHint();
  if (e.key === 'm' || e.key === 'M') $('muteBtn').click();
  if (e.key === 'r' || e.key === 'R') { if (phase === 'playing' || phase === 'over') startLevel(level); }
});

// boot: draw the first scene behind the title
drawPanels();
showTitle();
