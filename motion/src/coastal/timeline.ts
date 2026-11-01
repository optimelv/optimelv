// Four complete two-second bars: 480 frames at 60 fps and 120 BPM.
export const FPS = 60;
export const BPM = 120;
export const W = 1280;
export const H = 480;
export const BEAT = 30;
export const BAR = 120;
export const TOTAL = 480;
export const TAIL = 0;
export const PACE_NAME = 'calm';
export const ACT = { coast: { from: 0, dur: TOTAL } };
export const CUE = { coast: 0, wingA: 60, travelA: 120, wingB: 180, crossing: 240, wingC: 300, travelB: 360, wingD: 420 };
export const COPY = [
  { id: 'name', text: 'Melvin', in: 0, resolved: 0, out: TOTAL, kind: 'ui' },
];
