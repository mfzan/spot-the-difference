// Twin Peeks — scene art. Every scene is drawn twice: once for the left
// panel (the original) and once for the right panel (with differences
// applied). Each scene lists its differences as { x, y, r, name }; the
// draw function takes a side (0 = left, 1 = right) and draws that side's
// version. All art is original, drawn with canvas shapes — no images.

export const PANEL_W = 520;
export const PANEL_H = 360;

// ---------- shared helpers ----------
function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}
function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}
function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}
function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 16 * s, y - 6 * s, 13 * s, 0, Math.PI * 2);
  ctx.arc(x + 32 * s, y, 15 * s, 0, Math.PI * 2);
  ctx.arc(x + 16 * s, y + 6 * s, 14 * s, 0, Math.PI * 2);
  ctx.fill();
}
function sun(ctx, x, y, rays) {
  ctx.strokeStyle = '#f7b731';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * 30, y + Math.sin(a) * 30);
    ctx.lineTo(x + Math.cos(a) * 42, y + Math.sin(a) * 42);
    ctx.stroke();
  }
  circle(ctx, x, y, 26, '#f7b731');
  circle(ctx, x - 8, y - 6, 4, '#7a4a00');
  circle(ctx, x + 8, y - 6, 4, '#7a4a00');
  ctx.strokeStyle = '#7a4a00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y + 4, 9, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}
function bird(ctx, x, y) {
  ctx.strokeStyle = '#2d3436';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 8, y, 8, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 8, y, 8, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}
function flower(ctx, x, y, petal) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
  }
  circle(ctx, x, y, 6, '#f7b731');
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x, y + 22);
  ctx.stroke();
}
function tree(ctx, x, y) {
  rect(ctx, x - 7, y, 14, 46, '#8b5a2b');
  circle(ctx, x, y - 12, 34, '#27ae60');
  circle(ctx, x - 24, y + 6, 24, '#2ecc71');
  circle(ctx, x + 24, y + 6, 24, '#2ecc71');
  circle(ctx, x, y - 34, 22, '#2ecc71');
}

// ---------- Scene 1: Sunny Park ----------
function drawPark(ctx, side) {
  // sky + grass
  const sky = ctx.createLinearGradient(0, 0, 0, 240);
  sky.addColorStop(0, '#74b9ff');
  sky.addColorStop(1, '#aee2ff');
  rect(ctx, 0, 0, PANEL_W, 240, sky);
  rect(ctx, 0, 240, PANEL_W, 120, '#55c96b');
  rect(ctx, 0, 240, PANEL_W, 8, '#3da34f');
  // sun: 8 rays left, 5 rays right
  sun(ctx, 82, 62, side === 0 ? 8 : 5);
  // clouds: second cloud missing on the right
  cloud(ctx, 220, 58, 1);
  if (side === 0) cloud(ctx, 380, 44, 0.8);
  // bird: missing on the right
  if (side === 0) bird(ctx, 400, 108);
  bird(ctx, 300, 84);
  // house
  rect(ctx, 360, 190, 110, 80, '#fdcb6e');
  poly(ctx, [[350, 190], [415, 140], [480, 190]], '#e17055');
  rect(ctx, 398, 224, 34, 46, '#6c5ce7');
  circle(ctx, 428, 248, 3, '#f7b731');
  rect(ctx, 372, 206, 26, 22, '#dfe6e9');
  rect(ctx, 432, 206, 26, 22, '#dfe6e9');
  // tree + flowers + path + ball
  tree(ctx, 90, 210);
  flower(ctx, 170, 300, '#e84393');
  flower(ctx, 230, 316, side === 0 ? '#e84393' : '#0984e3');
  flower(ctx, 300, 296, '#e84393');
  poly(ctx, [[250, 360], [300, 270], [330, 270], [380, 360]], '#d8c49a');
  // ball: moved on the right
  const bx = side === 0 ? 150 : 182;
  circle(ctx, bx, 322, 16, '#e74c3c');
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(bx, 322, 16, 0.3, 1.8);
  ctx.stroke();
}
const parkDiffs = [
  { x: 82, y: 62, r: 44, name: 'sun rays' },
  { x: 380, y: 44, r: 26, name: 'cloud' },
  { x: 230, y: 316, r: 18, name: 'flower colour' },
  { x: 400, y: 108, r: 18, name: 'bird' },
  { x: 166, y: 322, r: 20, name: 'ball position' },
];

// ---------- Scene 2: Beach Day ----------
function drawBeach(ctx, side) {
  const sky = ctx.createLinearGradient(0, 0, 0, 150);
  sky.addColorStop(0, '#74b9ff');
  sky.addColorStop(1, '#ffeaa7');
  rect(ctx, 0, 0, PANEL_W, 150, sky);
  sun(ctx, 452, 52, 8);
  cloud(ctx, 110, 46, 0.9);
  // sea + sand
  rect(ctx, 0, 150, PANEL_W, 80, '#00cec9');
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 130, 168 + (i % 2) * 14);
    ctx.quadraticCurveTo(50 + i * 130, 160 + (i % 2) * 14, 80 + i * 130, 168 + (i % 2) * 14);
    ctx.stroke();
  }
  rect(ctx, 0, 230, PANEL_W, 130, '#f7d794');
  // boat: sail white left, yellow right
  poly(ctx, [[330, 176], [330, 128], [362, 176]], side === 0 ? '#ffffff' : '#f7b731');
  poly(ctx, [[326, 176], [326, 140], [300, 176]], '#dfe6e9');
  rect(ctx, 296, 176, 72, 12, '#6c5ce7');
  rect(ctx, 328, 128, 4, 48, '#636e72');
  // umbrella: stripes red left, blue right
  const stripe = side === 0 ? '#e74c3c' : '#0984e3';
  ctx.beginPath();
  ctx.arc(150, 220, 62, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = stripe;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150, 220, 62, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  // redraw stripes properly: alternate wedges
  for (let i = 0; i < 6; i++) {
    if (i % 2 === 0) continue;
    ctx.beginPath();
    ctx.moveTo(150, 220);
    ctx.arc(150, 220, 62, Math.PI + (i * Math.PI) / 6, Math.PI + ((i + 1) * Math.PI) / 6);
    ctx.closePath();
    ctx.fillStyle = stripe;
    ctx.fill();
  }
  rect(ctx, 148, 220, 4, 74, '#636e72');
  // palm tree
  rect(ctx, 420, 190, 12, 80, '#8b5a2b');
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    const a = Math.PI * (1.05 + i * 0.22);
    ctx.beginPath();
    ctx.moveTo(426, 190);
    ctx.quadraticCurveTo(426 + Math.cos(a) * 34, 190 + Math.sin(a) * 26 - 12, 426 + Math.cos(a) * 52, 190 + Math.sin(a) * 30);
    ctx.stroke();
  }
  // coconut: missing on the right
  if (side === 0) circle(ctx, 414, 196, 7, '#6c4a2f');
  circle(ctx, 438, 198, 7, '#6c4a2f');
  // starfish: missing on the right
  if (side === 0) {
    ctx.fillStyle = '#e17055';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const a2 = a + Math.PI / 5;
      ctx.lineTo(90 + Math.cos(a) * 14, 300 + Math.sin(a) * 14);
      ctx.lineTo(90 + Math.cos(a2) * 6, 300 + Math.sin(a2) * 6);
    }
    ctx.closePath();
    ctx.fill();
  }
  // bucket: moved on the right
  const bukX = side === 0 ? 250 : 282;
  poly(ctx, [[bukX - 16, 296], [bukX + 16, 296], [bukX + 11, 326], [bukX - 11, 326]], '#e84393');
  rect(ctx, bukX - 16, 292, 32, 6, '#c0392b');
  // crab: one eye missing on the right
  ellipse(ctx, 360, 318, 22, 14, '#e74c3c');
  circle(ctx, 352, 302, 4, '#ffffff');
  circle(ctx, 352, 302, 2, '#2d3436');
  if (side === 0) {
    circle(ctx, 368, 302, 4, '#ffffff');
    circle(ctx, 368, 302, 2, '#2d3436');
  }
  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(340, 318);
  ctx.lineTo(326, 306);
  ctx.moveTo(380, 318);
  ctx.lineTo(394, 306);
  ctx.stroke();
  // shells
  circle(ctx, 470, 320, 8, '#ffffff');
  circle(ctx, 486, 332, 6, '#fdcb6e');
}
const beachDiffs = [
  { x: 150, y: 190, r: 46, name: 'umbrella stripes' },
  { x: 90, y: 300, r: 18, name: 'starfish' },
  { x: 340, y: 152, r: 30, name: 'sail colour' },
  { x: 368, y: 302, r: 12, name: 'crab eye' },
  { x: 414, y: 196, r: 12, name: 'coconut' },
  { x: 266, y: 310, r: 22, name: 'bucket position' },
];

// ---------- Scene 3: Cozy Room ----------
function drawRoom(ctx, side) {
  rect(ctx, 0, 0, PANEL_W, 260, '#f5d7a1');
  rect(ctx, 0, 260, PANEL_W, 100, '#b07a4a');
  rect(ctx, 0, 256, PANEL_W, 6, '#8b5a2b');
  // window: 4 panes left, 2 panes right (curtain covers)
  rect(ctx, 60, 40, 130, 130, '#74b9ff');
  rect(ctx, 60, 40, 130, 130, '#aee2ff');
  circle(ctx, 92, 70, 18, '#f7b731');
  cloud(ctx, 150, 66, 0.5);
  ctx.strokeStyle = '#636e72';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(125, 40);
  ctx.lineTo(125, 170);
  ctx.moveTo(60, 105);
  ctx.lineTo(190, 105);
  ctx.stroke();
  if (side === 1) {
    // curtain covers right half on the right panel
    rect(ctx, 125, 36, 70, 138, '#e17055');
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(136 + i * 16, 38);
      ctx.lineTo(136 + i * 16, 172);
      ctx.stroke();
    }
  } else {
    rect(ctx, 48, 36, 16, 138, '#e17055');
    rect(ctx, 190, 36, 16, 138, '#e17055');
  }
  // clock: 3:00 left, 4:30 right
  circle(ctx, 300, 80, 34, '#ffffff');
  ctx.strokeStyle = '#2d3436';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(300, 80, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(300, 80);
  ctx.lineTo(300, 56);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(300, 80);
  if (side === 0) ctx.lineTo(322, 80);
  else ctx.lineTo(300, 100);
  ctx.stroke();
  // bookshelf
  rect(ctx, 380, 60, 100, 180, '#8b5a2b');
  rect(ctx, 388, 116, 84, 8, '#6c4a2f');
  rect(ctx, 388, 176, 84, 8, '#6c4a2f');
  const bookCols = ['#e74c3c', '#0984e3', '#27ae60', '#f7b731'];
  for (let i = 0; i < 4; i++) {
    // second book: red left, green right
    let c = bookCols[i];
    if (i === 1) c = side === 0 ? '#e74c3c' : '#27ae60';
    rect(ctx, 392 + i * 20, 84, 16, 32, c);
  }
  rect(ctx, 392, 144, 16, 32, '#6c5ce7');
  rect(ctx, 412, 144, 16, 32, '#e84393');
  rect(ctx, 432, 144, 16, 32, '#00cec9');
  circle(ctx, 452, 152, 10, '#fdcb6e');
  // rug: stripe left, plain right
  rect(ctx, 180, 300, 180, 44, '#e17055');
  if (side === 0) rect(ctx, 180, 314, 180, 10, '#fdcb6e');
  // table + lamp
  rect(ctx, 60, 240, 150, 12, '#6c4a2f');
  rect(ctx, 70, 252, 10, 60, '#6c4a2f');
  rect(ctx, 190, 252, 10, 60, '#6c4a2f');
  rect(ctx, 96, 214, 8, 26, '#636e72');
  poly(ctx, [[84, 214], [116, 214], [106, 188], [94, 188]], side === 0 ? '#f7b731' : '#95a5a6');
  if (side === 0) {
    ctx.fillStyle = 'rgba(247, 183, 49, 0.25)';
    ctx.beginPath();
    ctx.arc(100, 214, 44, 0, Math.PI * 2);
    ctx.fill();
  }
  // plant: 5 leaves left, 3 right
  rect(ctx, 430, 292, 34, 22, '#e84393');
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const leaves = side === 0 ? 5 : 3;
  for (let i = 0; i < leaves; i++) {
    const a = -Math.PI / 2 + (i - (leaves - 1) / 2) * 0.5;
    ctx.beginPath();
    ctx.moveTo(447, 292);
    ctx.quadraticCurveTo(447 + Math.cos(a) * 16, 292 + Math.sin(a) * 22, 447 + Math.cos(a) * 26, 292 + Math.sin(a) * 34);
    ctx.stroke();
  }
  // cat on the rug: tail up left, tail down right
  ellipse(ctx, 270, 292, 30, 16, '#636e72');
  circle(ctx, 296, 282, 13, '#636e72');
  poly(ctx, [[288, 272], [292, 262], [296, 272]], '#636e72');
  poly(ctx, [[300, 272], [304, 262], [306, 272]], '#636e72');
  circle(ctx, 300, 280, 2, '#2d3436');
  ctx.strokeStyle = '#636e72';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(242, 290);
  if (side === 0) ctx.quadraticCurveTo(224, 272, 232, 258);
  else ctx.quadraticCurveTo(226, 306, 238, 310);
  ctx.stroke();
}
const roomDiffs = [
  { x: 300, y: 80, r: 36, name: 'clock hands' },
  { x: 420, y: 100, r: 18, name: 'book colour' },
  { x: 232, y: 272, r: 18, name: 'cat tail' },
  { x: 100, y: 200, r: 24, name: 'lamp light' },
  { x: 447, y: 272, r: 24, name: 'plant leaves' },
  { x: 270, y: 319, r: 22, name: 'rug stripe' },
  { x: 158, y: 105, r: 34, name: 'window curtain' },
];

export const SCENES = [
  { id: 'park', name: 'Sunny Park', time: 90, draw: drawPark, diffs: parkDiffs },
  { id: 'beach', name: 'Beach Day', time: 75, draw: drawBeach, diffs: beachDiffs },
  { id: 'room', name: 'Cozy Room', time: 60, draw: drawRoom, diffs: roomDiffs },
];
