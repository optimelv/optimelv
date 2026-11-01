import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import { H, TOTAL, W } from './timeline';

// cinetic:brand-supplied warm ivory, North Sea greens and Newsreader from the portfolio.
const ink = '#eef1e8';
const fonts = `@font-face {font-family:Newsreader;src:url('${staticFile('assets/newsreader.woff2')}') format('woff2');font-weight:200 800;font-style:normal;}`;

function drawGull(ctx: CanvasRenderingContext2D, frame: number) {
  const phase = frame / TOTAL * Math.PI * 2;
  const span = 29;
  const beat = Math.sin(phase * 2) * 0.8;
  ctx.save();
  ctx.translate(915 + Math.sin(phase) * 45, 76 + Math.sin(phase * 2 + 0.4) * 4);
  ctx.rotate(Math.sin(phase) * 0.06);
  ctx.globalAlpha = 0.83;
  for (const side of [-1, 1]) {
    const wing = span * (side < 0 ? 1 : 0.9);
    const reach = wing * (1 - Math.abs(beat) * 0.22);
    const elbow = -wing * 0.18 + beat * wing * 0.38;
    const tip = -wing * 0.12 + beat * wing * 0.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(side * reach * 0.22, -wing * 0.14, side * reach * 0.43, elbow - 1, side * reach * 0.57, elbow);
    ctx.quadraticCurveTo(side * reach * 0.86, tip - 1.5, side * reach, tip);
    ctx.quadraticCurveTo(side * reach * 0.77, tip + 3, side * reach * 0.5, elbow + 2.7);
    ctx.quadraticCurveTo(side * reach * 0.25, 3, 0, 2.2);
    ctx.closePath();
    ctx.fillStyle = side < 0 ? '#e7e6d7' : '#a9aea4';
    ctx.fill();
    ctx.strokeStyle = '#525b50';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  ctx.fillStyle = '#e6e5d5';
  ctx.beginPath();
  ctx.ellipse(0, 1.8, 1.7, 3.5, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const CoastCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [painting, setPainting] = useState<HTMLImageElement | null>(null);
  const [handle] = useState(() => delayRender('Loading coastal artwork'));
  useEffect(() => {
    const img = new Image();
    img.onload = () => { setPainting(img); continueRender(handle); };
    img.onerror = () => { cancelRender(new Error('Coastal artwork could not be loaded')); };
    img.src = staticFile('assets/coast.webp');
  }, [handle]);
  useLayoutEffect(() => {
    if (!canvas.current || !painting) return;
    const ctx = canvas.current.getContext('2d');
    if (!ctx) return;
    const cropX = (painting.naturalWidth - W) / 2;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(painting, cropX, 0, W, H, 0, 0, W, H);
    // Shift narrow horizontal water details independently; the land and sky stay still.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 236); ctx.lineTo(925, 236); ctx.lineTo(780, 330); ctx.lineTo(0, 365); ctx.closePath();
    ctx.clip();
    for (let y = 239; y < 346; y += 3) {
      const edge = Math.sin(Math.PI * (y - 239) / 107);
      const phase = frame / TOTAL * Math.PI * 2;
      const drift = Math.sin(phase * 2 + y * 0.15) * 4.5 + Math.sin(phase + y * 0.046) * 2.5;
      ctx.globalAlpha = Math.max(0, edge) * 0.8;
      ctx.drawImage(painting, cropX + 4 + drift, y, W - 8, 3, 4, y, W - 8, 3);
    }
    ctx.restore();
    // Keep the supplied dark-green treatment under the individual water highlights.
    const shade = ctx.createLinearGradient(0, 0, W, 0);
    shade.addColorStop(0, '#121a16');
    shade.addColorStop(0.46, 'rgba(18,26,22,0.94)');
    shade.addColorStop(0.74, 'rgba(18,26,22,0.5)');
    shade.addColorStop(1, 'rgba(18,26,22,0.14)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, W, H);
    // Soft, independently shifting reflections, placed in the painted water channels.
    const glints: [number, number, number][] = [
      [26, 247, 58], [165, 252, 79], [345, 251, 54], [72, 264, 48],
      [532, 268, 42], [704, 258, 42], [432, 313, 52], [526, 320, 72],
      [244, 330, 58], [45, 349, 84], [158, 361, 61], [48, 380, 62],
    ];
    const time = frame / TOTAL * Math.PI * 2;
    ctx.save();
    ctx.lineCap = 'round';
    glints.forEach(([x, y, length], i) => {
      const shift = Math.sin(time + i * 1.71) * (5 + (i % 3) * 2);
      const glimmer = 0.18 + 0.10 * Math.sin(time * 2 + i * 1.23);
      ctx.globalAlpha = glimmer * Math.max(0, Math.min(1, (x - 360) / 440));
      ctx.strokeStyle = '#f3f2e9';
      ctx.lineWidth = i % 3 === 0 ? 1.4 : 1;
      ctx.beginPath();
      ctx.moveTo(x + shift, y);
      ctx.quadraticCurveTo(x + shift + length * 0.47, y - 0.8, x + shift + length, y + 0.1);
      ctx.stroke();
    });
    ctx.restore();
    drawGull(ctx, frame);
  }, [frame, painting]);
  return <canvas ref={canvas} width={W} height={H} style={{width: W, height: H, position: 'absolute', inset: 0}} />;
};

export const Coast: React.FC = () => {
  const [fontHandle] = useState(() => delayRender('Loading brand fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load('400 16px Newsreader')])
      .then(() => continueRender(fontHandle))
      .catch((error: Error) => cancelRender(error));
  }, [fontHandle]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#e9e9df', overflow: 'hidden' }}>
      <style>{fonts}</style>
      <CoastCanvas />
      <div style={{ position: 'absolute', left: 58, top: 54, fontFamily: 'Newsreader, Georgia, serif', color: ink, fontSize: 104, fontWeight: 400, lineHeight: 1, letterSpacing: '-0.035em', whiteSpace: 'nowrap' }}>Melvin</div>
    </AbsoluteFill>
  );
};
