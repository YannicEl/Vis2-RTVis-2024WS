import { getContext, setContext } from 'svelte';
import { Camera } from './webGPU/Camera';

export const CameraContexKey = Symbol();

export function setCameraContext(camera: Camera): void {
	setContext(CameraContexKey, camera);
}

export function getCameraContext(): Camera {
	return getContext<Camera>(CameraContexKey);
}
