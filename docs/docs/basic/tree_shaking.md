---
sidebar_position: 12
---

# Tree Shaking

在插件初始化时，设置 treeShaking 插件

```typescript
treeShakingPlugin({
  treeshake: options.treeshake,
  name: options.globalName,
  silent: options.silent,
}),
```

通过自定义插件，使用`rollup`进行 `tree-shaking`。

```typescript
export const treeShakingPlugin = ({
  treeshake,
  name,
  silent,
}: {
  treeshake?: TreeshakingStrategy;
  name?: string;
  silent?: boolean;
}): Plugin => {
  return {
    name: 'tree-shaking',

    async renderChunk(code, info) {
      if (!treeshake || !/\.(cjs|js|mjs)$/.test(info.path)) return;

      const bundle = await rollup({
        input: [info.path],
        plugins: [
          hashbang(),
          {
            name: 'encode-bundle',
            resolveId(source) {
              if (source === info.path) return source;
              return false;
            },
            load(id) {
              if (id === info.path) return code;
            },
          },
        ],
        treeshake: treeshake,
        makeAbsoluteExternalsRelative: false,
        preserveEntrySignatures: 'exports-only',
        onwarn: silent ? () => {} : undefined,
      });

      const result = await bundle.generate({
        interop: 'auto',
        format: this.format,
        file: 'out.js',
        sourcemap: !!this.options.sourcemap,
        name,
      });

      for (const file of result.output) {
        if (file.type === 'chunk') {
          if (file.fileName.endsWith('out.js')) {
            return {
              code: file.code,
              map: file.map,
            };
          }
        }
      }
    },
  };
};
```
