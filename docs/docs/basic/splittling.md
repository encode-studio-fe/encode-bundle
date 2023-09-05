---
sidebar_position: 7
---

# 代码分隔

在`runEsbuild`方法中，针对 ESM 的模块，默认设置`splitting`为`true`。

否则，根据 CLI 指令传给`esbuild`的`splitting`属性。

```typescript
const splitting =
  format === 'iife'
    ? false
    : typeof options.splitting === 'boolean'
    ? options.splitting
    : format === 'esm'

esbuild({
  splitting,
})
```

针对`CJS`，使用自定义插件，基于`sucrase`进行构建。

```typescript
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
        return
      }

      const { transform } = await import('sucrase')

      const result = transform(code, {
        filePath: info.path,
        transforms: ['imports'],
        sourceMapOptions: this.options.sourcemap
          ? {
              compiledFilename: info.path,
            }
          : undefined,
      })

      return {
        code: result.code,
        map: result.sourceMap,
      }
    },
  }
}
```
