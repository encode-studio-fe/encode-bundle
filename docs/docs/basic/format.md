---
sidebar_position: 6
---

# 构建产物

在`CLI`指令解析时，格式化 format 相关配置

```typescript
if (flags.format) {
  const format = ensureArray(flags.format) as Format[]
  options.format = format
}
```

设置在执行构建时，格式化`options`传参，默认导出路径为`dist`，针对`format`格式化

```typescript
const options: Partial<NormalizedOptions> = {
  outDir: 'dist',
  ..._options,
  format:
    typeof _options.format === 'string'
      ? [_options.format as Format]
      : _options.format || ['cjs'],
  dts:
    typeof _options.dts === 'boolean'
      ? _options.dts
        ? {}
        : undefined
      : typeof _options.dts === 'string'
      ? { entry: _options.dts }
      : _options.dts,
}
```

格式化后，在`runEsbuild`方法中，传给`esbuild`的`format`方法。

```typescript
esbuild({
  entryPoints: options.entry,
  format: (format === 'cjs' && splitting) || options.treeshake ? 'esm' : format,
})
```

针对`--legacy-output`，也在`esbuild`中进行对应配置，针对非`CJS`模式创建对应的文档目录。

```typescript
esbuild({
  outdir:
    options.legacyOutput && format !== 'cjs'
      ? path.join(outDir, format)
      : outDir,
  outExtension: options.legacyOutput ? undefined : outExtension,
})
```

```typescript
const outExtension = getOutputExtensionMap(options, format, pkg.type)

const getOutputExtensionMap = (
  options: NormalizedOptions,
  format: Format,
  pkgType: string | undefined
) => {
  const outExtension: OutExtensionFactory =
    options.outExtension || defaultOutExtension

  const defaultExtension = defaultOutExtension({ format, pkgType })
  const extension = outExtension({ options, format, pkgType })
  return {
    '.js': extension.js || defaultExtension.js,
  }
}
```
