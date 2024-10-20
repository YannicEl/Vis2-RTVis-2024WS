import { Camera } from './webGPU/Camera';

export type GlobalState = {
	camera: Camera;
};

export let globalState = $state<Partial<GlobalState>>({});
