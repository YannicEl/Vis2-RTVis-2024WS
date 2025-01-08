export const degToRad = (degree: number): number => {
	return degree * (Math.PI / 180);
};

export const radToDeg = (radians: number): number => {
	return (180 / Math.PI) * radians;
};
