---
sidebar_position: 10
---

# watch 模式

在`mainTask`执行过程中，根据`options`来判断是否添加`watcher`，此处使用`chokidar`实现监听模式。

```typescript
const startWatcher = async () => {
  if (!options.watch) return

  const { watch } = await import('chokidar')

  const customIgnores = options.ignoreWatch
    ? Array.isArray(options.ignoreWatch)
      ? options.ignoreWatch
      : [options.ignoreWatch]
    : []

  const ignored = [
    '**/{.git,node_modules}/**',
    options.outDir,
    ...customIgnores,
  ]

  const watchPaths =
    typeof options.watch === 'boolean'
      ? '.'
      : Array.isArray(options.watch)
      ? options.watch.filter((path): path is string => typeof path === 'string')
      : options.watch

  const watcher = watch(watchPaths, {
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ignored,
  })
  watcher.on('all', async (type, file) => {
    file = slash(file)

    if (options.publicDir && isInPublicDir(options.publicDir, file)) {
      logger.info('CLI', `Change in public dir: ${file}`)
      copyPublicDir(options.publicDir, options.outDir)
      return
    }

    // By default we only rebuild when imported files change
    // If you specify custom `watch`, a string or multiple strings
    // We rebuild when those files change
    let shouldSkipChange = false

    if (options.watch === true) {
      if (file === 'package.json' && !buildDependencies.has(file)) {
        const currentHash = await getAllDepsHash(process.cwd())
        shouldSkipChange = currentHash === depsHash
        depsHash = currentHash
      } else if (!buildDependencies.has(file)) {
        shouldSkipChange = true
      }
    }

    if (shouldSkipChange) {
      return
    }

    debouncedBuildAll()
  })
}
```
