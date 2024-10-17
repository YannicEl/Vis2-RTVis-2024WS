import { sveltekit } from '@sveltejs/kit/vite';
import TailwindCSS from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), TailwindCSS(), Icons({ compiler: 'svelte', autoInstall: true })],
});
