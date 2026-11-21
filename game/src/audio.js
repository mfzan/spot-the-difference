// Twin Peeks — sound. All effects are synthesized with WebAudio, so the
// game ships no audio files and makes no network request.

let actx = null;
let muted = false;

function ac() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}

function tone(freq, start, dur, type, vol) {
  if (muted) return;
  try {
    const ctx = ac();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.12, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(ctx.currentTime + start);
    o.stop(ctx.currentTime + start + dur);
  } catch (e) { /* audio unavailable: play silent */ }
}

export const sfx = {
  click() { tone(660, 0, 0.07, 'triangle', 0.06); },
  found() { tone(523, 0, 0.12, 'sine', 0.14); tone(784, 0.09, 0.18, 'sine', 0.14); },
  wrong() { tone(160, 0, 0.18, 'sawtooth', 0.08); },
  hint() { tone(880, 0, 0.1, 'sine', 0.1); tone(1174, 0.08, 0.14, 'sine', 0.1); },
  level() { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.1, 0.16, 'sine', 0.13)); },
  win() { [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, i * 0.11, 0.2, 'sine', 0.13)); },
  lose() { [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.22, 'triangle', 0.11)); },
  tick() { tone(980, 0, 0.05, 'square', 0.04); },
};

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }
