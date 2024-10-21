import { Camera } from './webGPU/Camera';
import type { ArcballControls } from './webGPU/controls/ArcballControls';

export type GlobalState = {
	fps: number;
	camera?: Camera;
	contols?: ArcballControls;
};

export let globalState = $state<GlobalState>({
	fps: 0,
});
