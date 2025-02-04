import { defineConfig, presetUno, transformerDirectives } from 'unocss';

export default defineConfig({
	presets: [presetUno()],
	transformers: [
		transformerDirectives({
			applyVariable: ['--apply'],
		}),
	],
	theme: {
		fontFamily: {
			sans: 'Courier Prime, serif',
		},
	},
});
