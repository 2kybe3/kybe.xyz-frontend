import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	root: 'src',
	build: {
		outDir: path.resolve(__dirname, 'dist'),
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'src/index.html'),
				matrix: path.resolve(__dirname, 'src/matrix.html')
			},
			output: {
				entryFileNames: 'app.js',
				assetFileNames: '[name].[ext]',
			}
		}
	}
});
