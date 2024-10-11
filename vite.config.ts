import { sveltekit } from '@sveltejs/kit/vite';
import unoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), unoCSS()],
});
