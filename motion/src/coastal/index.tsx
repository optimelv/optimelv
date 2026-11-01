import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Coast } from './Coast';
import { FPS, H, TOTAL, W } from './timeline';
const Root = () => <Composition id="Coast" component={Coast} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />;
registerRoot(Root);
