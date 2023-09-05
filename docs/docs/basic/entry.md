---
sidebar_position: 1
---

# 入口处理

`CLI`使用`cac`做命令行交互，根据 files 和 flags（`CLI`打标选项）获取最终的`options`。

```typescript
.action(async (files: string[], flags) => {
  const { build } = await import('.')
  Object.assign(options, {
    ...flags,
  })
  if (!options.entry && files.length > 0) {
    options.entry = files.map(slash)
  }
  // ...
  await build(options) // 进行bundle
```

```typescript
export async function build(_options: Options) {
  const config =
    _options.config === false
      ? {}
      : await loadEncodeBuildConfig(
          process.cwd(),
          _options.config === true ? undefined : _options.config,
        );

  const configData = typeof config.data === 'function' ? await config.data(_options) : config.data;

  await Promise.all(
    [...(Array.isArray(configData) ? configData : [configData])].map(async (item) => {
      const logger = createLogger(item?.name);
      const options = await normalizeOptions(logger, item, _options);

      const dtsTask = async () => {
        if (options.dts) {
          await new Promise<void>((resolve, reject) => {
            const worker = new Worker(path.join(__dirname, './rollup.js'));
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
            });
            worker.on('message', (data) => {
              if (data === 'error') {
                reject(new Error('error occured in dts build'));
              } else if (data === 'success') {
                resolve();
              } else {
                const { type, text } = data;
                if (type === 'log') {
                  console.log(text);
                } else if (type === 'error') {
                  console.error(text);
                }
              }
            });
          });
        }
      };

      const mainTasks = async () => {
        if (!options.dts?.only) {
          let onSuccessProcess: ChildProcess | undefined;
          let onSuccessCleanup: (() => any) | undefined | void;
          /** Files imported by the entry */
          const buildDependencies: Set<string> = new Set();

          let depsHash = await getAllDepsHash(process.cwd());

          const doOnSuccessCleanup = async () => {
            if (onSuccessProcess) {
              await killProcess({
                pid: onSuccessProcess.pid,
                signal: options.killSignal || 'SIGTERM',
              });
            } else if (onSuccessCleanup) {
              await onSuccessCleanup();
            }
            // reset them in all occasions anyway
            onSuccessProcess = undefined;
            onSuccessCleanup = undefined;
          };

          const buildAll = async () => {
            await doOnSuccessCleanup();
            // Store previous build dependencies in case the build failed
            // So we can restore it
            const previousBuildDependencies = new Set(buildDependencies);
            buildDependencies.clear();

            if (options.clean) {
              const extraPatterns = Array.isArray(options.clean) ? options.clean : [];
              // .d.ts files are removed in the `dtsTask` instead
              // `dtsTask` is a separate process, which might start before `mainTasks`
              if (options.dts) {
                extraPatterns.unshift('!**/*.d.{ts,cts,mts}');
              }
              await removeFiles(['**/*', ...extraPatterns], options.outDir);
              logger.info('CLI', 'Cleaning output folder');
            }

            const css: Map<string, string> = new Map();
            await Promise.all([
              ...options.format.map(async (format, index) => {
                const pluginContainer = new PluginContainer([
                  shebang(),
                  ...(options.plugins || []),
                  treeShakingPlugin({
                    treeshake: options.treeshake,
                    name: options.globalName,
                    silent: options.silent,
                  }),
                  cjsSplitting(),
                  cjsInterop(),
                  es5(),
                  sizeReporter(),
                  terserPlugin({
                    minifyOptions: options.minify,
                    format,
                    terserOptions: options.terserOptions,
                    globalName: options.globalName,
                    logger,
                  }),
                ]);
                await runEsbuild(options, {
                  pluginContainer,
                  format,
                  css: index === 0 || options.injectStyle ? css : undefined,
                  logger,
                  buildDependencies,
                }).catch((error) => {
                  previousBuildDependencies.forEach((v) => buildDependencies.add(v));
                  throw error;
                });
              }),
            ]);

            if (options.onSuccess) {
              if (typeof options.onSuccess === 'function') {
                onSuccessCleanup = await options.onSuccess();
              } else {
                onSuccessProcess = execa(options.onSuccess, {
                  shell: true,
                  stdio: 'inherit',
                });
                onSuccessProcess.on('exit', (code) => {
                  if (code && code !== 0) {
                    process.exitCode = code;
                  }
                });
              }
            }
          };

          await buildAll();
        }
      };

      await Promise.all([dtsTask(), mainTasks()]);
    }),
  );
}
```

其中，`mainTask`用于执行构建的逻辑，`dtsTask`使用`Web Worker`创建新的线程，借助`rollup`，根据`CLI`的选项，判断是否产出 dts。

入口文件在`runEsbuild`中作为`entry`传入。

```typescript
export async function runEsbuild(
  options: NormalizedOptions,
  { format, css, logger, buildDependencies, pluginContainer },
) {
  try {
    result = await esbuild({
      entryPoints: options.entry,
    });
  } catch (error) {
    logger.error(format, 'Build failed');
    throw error;
  }
}
```
