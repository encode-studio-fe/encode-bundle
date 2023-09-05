---
sidebar_position: 4
---

# dts

在`CLI`指令解析时，格式化 dts 相关配置

```typescript
if (flags.dts || flags.dtsResolve || flags.dtsOnly) {
  options.dts = {}
  if (typeof flags.dts === 'string') {
    options.dts.entry = flags.dts
  }
  if (flags.dtsResolve) {
    options.dts.resolve = flags.dtsResolve
  }
  if (flags.dtsOnly) {
    options.dts.only = true
  }
}
```

设置在执行构建时，根据`options`的选项，创建新的线程执行 rollup 指令。

```typescript
const dtsTask = async () => {
  if (options.dts) {
    await new Promise<void>((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, './rollup.js'))
      worker.postMessage({
        configName: item?.name,
        options: {
          ...options, // functions cannot be cloned
          banner: undefined,
          footer: undefined,
          esbuildPlugins: undefined,
          esbuildOptions: undefined,
          plugins: undefined,
          treeshake: undefined,
          onSuccess: undefined,
          outExtension: undefined,
        },
      })
      worker.on('message', (data) => {
        if (data === 'error') {
          reject(new Error('error occured in dts build'))
        } else if (data === 'success') {
          resolve()
        } else {
          const { type, text } = data
          if (type === 'log') {
            console.log(text)
          } else if (type === 'error') {
            console.error(text)
          }
        }
      })
    })
  }
}
```

根据配置，生成 dts

```typescript
async function runRollup(options: RollupConfig) {
  const { rollup } = await import('rollup')
  try {
    const start = Date.now()
    const getDuration = () => {
      return `${Math.floor(Date.now() - start)}ms`
    }
    logger.info('dts', 'Build start')
    const bundle = await rollup(options.inputConfig)
    const results = await Promise.all(options.outputConfig.map(bundle.write))
    const outputs = results.flatMap((result) => result.output)
    logger.success('dts', `⚡️ Build success in ${getDuration()}`)
    reportSize(
      logger,
      'dts',
      outputs.reduce((res, info) => {
        const name = path.relative(
          process.cwd(),
          path.join(options.outputConfig[0].dir || '.', info.fileName)
        )
        return {
          ...res,
          [name]: info.type === 'chunk' ? info.code.length : info.source.length,
        }
      }, {})
    )
  } catch (error) {
    handleError(error)
    logger.error('dts', 'Build error')
  }
}
```

使用`JoyCon`识别指定文件或 package.json 中的`encode-bundle`，作为相对用户配置项的返回。
