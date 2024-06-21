import config from './src/config.json';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve('src/index.ts'),
            name: 'DataPosApplicationEmulatorConnector',
            formats: ['es'],
            fileName: (format) => `${config.id}-${format}.js`
        },
        target: 'ESNext',
        rollupOptions: {
            output: {
                chunkFileNames: (chunkInfo) => {
                    console.log('@@@@', chunkInfo);
                    return `${chunkInfo.name}.js`;
                },
                manualChunks(id) {
                    if (id.includes('/node_modules/highcharts')) return 'vendor-highcharts';
                    else console.log('####', id);
                }
            }
        }
    },
    plugins: [dts({ outDir: 'dist/types' })]
});
