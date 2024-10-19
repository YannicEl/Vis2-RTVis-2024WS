import type { Camera } from '../Camera';
import { degToRad } from '../helpers/helpers';

export class ArcballControls {
	constructor(canvas: HTMLCanvasElement, camera: Camera) {
		canvas.onmousemove = (event) => {
			const { movementX, movementY } = event;

			const sensitivity = 0.2;
			camera.yaw += degToRad(movementX * sensitivity);
			camera.pitch -= degToRad(movementY * sensitivity);

			if (camera.pitch > 89) camera.pitch = 89;
			if (camera.pitch < -89) camera.pitch = -89;

			// SmoothingCursorFactor = Clamp(SmoothingCursorFactor, 0.1f, 10.f);
			//   SmoothedCursorPos = Vector2::Lerp(SmoothedCursorPos, Vector2(MousePosX, MousePosY), SmoothingCursorFactor * 0.0001f);

			//   Vector2 MouseDelta = SmoothedCursorPos - PreviousCursorPos;
			//   PreviousCursorPos = SmoothedCursorPos;

			//   Yaw += MouseDelta.x;
			//   Pitch -= MouseDelta.y;

			//   // without it it's shit
			//   Pitch = Clamp(Pitch, -89, 89);

			//   Quaternion orientation = Quaternion::CreateFromYawPitchRoll(DegreesToRadians(Yaw), DegreesToRadians(Pitch), 0);

			//   Front   = Vector3::Transform(Vector3::UnitZ, orientation);
			//   Right   = Front.Cross(Vector3::UnitY); Right.Normalize();
			//   Up  = Right.Cross(Front); Up.Normalize();
			//   Position = TargetPosition - Front * Clamp(Distance, 1.f, 100.f);

			//   GenerateMatrices();
		};
	}
}
