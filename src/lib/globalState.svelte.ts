import { Camera } from './webGPU/Camera';
import type { ArcballControls } from './webGPU/controls/ArcballControls';

export type GlobalState = {
	showFps?: boolean;
	fps: number;
	camera?: Camera;
	contols?: ArcballControls;
};

export let globalState = $state<GlobalState>({
	showFps: true,
	fps: 0,
});
