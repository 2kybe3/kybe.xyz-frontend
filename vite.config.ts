import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
	root: 'src',
	publicDir: path.resolve(__dirname, 'public'),
	build: {
		outDir: path.resolve(__dirname, 'dist'),
		minify: true,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'src/index.html'),
				matrix: path.resolve(__dirname, 'src/matrix.html'),
				ssh: path.resolve(__dirname, 'src/ssh.html')
			},
			output: {
				entryFileNames: 'assets/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]',
				chunkFileNames: 'assets/[name]-[hash].js',
			}
		}
	}
});
