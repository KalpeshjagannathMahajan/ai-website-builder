import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
	plugins: [react()],
	publicDir: 'public',
	resolve: {
		alias: {
			src: '/src',
		},
	},
	build: {
		assetsInlineLimit: 0,
		cssCodeSplit: true,
		sourcemap: false,
		chunkSizeWarningLimit: 3000,
		rollupOptions: {
			input: 'index.html',
			output: {
				inlineDynamicImports: true,
				entryFileNames: 'bundle.js',
				format: 'iife',
			},
		},
	},
});
