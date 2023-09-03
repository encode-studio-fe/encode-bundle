import { defineConfig } from 'encode-bundle';

export default defineConfig({
  name: 'encode-bundle',
  target: 'node16.14',
  dts: {
    resolve: true,
    entry: './src/index.ts',
  },
});
