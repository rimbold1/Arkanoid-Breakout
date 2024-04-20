import { clamp } from "./clamp";

export function movePlatform(platform, clampMin, clampMax) {
    let isDown = false;
	window.addEventListener('mousedown', function() {
		isDown = true;
	});

	window.addEventListener('mousemove', (event) => {
		let pos = event.clientX;
		if (isDown) {
			platform.x = clamp(pos, clampMin, clampMax);
		}
	});
}