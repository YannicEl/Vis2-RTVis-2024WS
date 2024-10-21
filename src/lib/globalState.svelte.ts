import { Camera } from './webGPU/Camera';

export type GlobalState = {
	fps: number;
	camera?: Camera;
};

export let globalState = $state<GlobalState>({
	fps: 0,
});
