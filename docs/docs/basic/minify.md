---
sidebar_position: 11
---

# 压缩代码

在`runEsbuild`执行过程中，针对`minify`默认行为，设置为`esbuild`中`minify`。

```typescript
esbuild({
  minify: options.minify === 'terser' ? false : options.minify,
})
```

针对设置`terser`配置，通过自定义插件，使用`terser`进行压缩。

```typescript
export const terserPlugin = ({
  minifyOptions,
  format,
  terserOptions = {},
  globalName,
  logger,
}: {
  minifyOptions: Options['minify']
  format: Format
  terserOptions?: MinifyOptions
  globalName?: string
  logger: Logger
}): Plugin => {
  return {
    name: 'terser',

    async renderChunk(code, info) {
      if (minifyOptions !== 'terser' || !/\.(cjs|js|mjs)$/.test(info.path))
        return

      const terser: typeof import('terser') | undefined = localRequire('terser')

      if (!terser) {
        throw new PrettyError(
          'terser is required for terser minification. Please install it with `npm install terser -D`'
        )
      }

      const { minify } = terser

      const defaultOptions: MinifyOptions = {}

      if (format === 'esm') {
        defaultOptions.module = true
      } else if (!(format === 'iife' && globalName !== undefined)) {
        defaultOptions.toplevel = true
      }

      try {
        const minifiedOutput = await minify(
          { [info.path]: code },
          { ...defaultOptions, ...terserOptions }
        )

        return { code: minifiedOutput.code!, map: minifiedOutput.map }
      } catch (e) {}

      return { code, map: info.map }
    },
  }
}
```
