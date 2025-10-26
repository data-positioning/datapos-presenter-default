// Dependencies - Vendor
import config from './config.json';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// Configuration
export default defineConfig({
    build: {
        lib: {
            entry: resolve('src/index.ts'),
            name: 'DataPosDefaultPresenter',
            formats: ['es'],
            fileName: (format) => `${config.id}-${format}.js`
        },
        target: 'ESNext'
        // rollupOptions: {
        //     output: {
        //         chunkFileNames: (chunkInfo) => {
        //             return `presentors/${chunkInfo.name}.js`;
        //         },
        //         manualChunks(id) {
        //             if (id.includes('/node_modules/highcharts')) return 'vendor-highcharts';
        //         }
        //     }
        // }
    },
    plugins: [dts({ outDir: 'dist/types' })]
});
