// Workaround to enable code splitting for cjs format
import { Plugin } from '../plugin';

export const cjsSplitting = (): Plugin => {
  return {
    name: 'cjs-splitting',

    async renderChunk(code, info) {
      if (
        !this.splitting ||
        this.options.treeshake || // <-- handled by rollup
        this.format !== 'cjs' ||
        info.type !== 'chunk' ||
        !/\.(js|cjs)$/.test(info.path)
      ) {
        return;
      }

      const { transform } = await import('sucrase');

      const result = transform(code, {
        filePath: info.path,
        transforms: ['imports'],
        sourceMapOptions: this.options.sourcemap
          ? {
              compiledFilename: info.path,
            }
          : undefined,
      });

      return {
        code: result.code,
        map: result.sourceMap,
      };
    },
  };
};
