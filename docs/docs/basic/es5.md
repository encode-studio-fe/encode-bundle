---
sidebar_position: 9
---

# 支持 ES5

在`CLI`指令解析时，读取`target`配置，针对`esbuild`加入自定义`ES5 Plugin`。

```typescript
const buildAll = async () => {
  await Promise.all([
    ...options.format.map(async (format, index) => {
      const pluginContainer = new PluginContainer([es5()]);
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
};
```

此时做两件事：

1. 代码首先会构建成`ES2020`；
2. 使用 SWC 编译成`ES5`；

```typescript
export const es5 = (): Plugin => {
  let enabled = false;
  return {
    name: 'es5-target',

    esbuildOptions(options) {
      if (options.target === 'es5') {
        options.target = 'es2020';
        enabled = true;
      }
    },

    async renderChunk(code, info) {
      if (!enabled || !/\.(cjs|js)$/.test(info.path)) {
        return;
      }
      const swc: typeof import('@swc/core') = localRequire('@swc/core');

      if (!swc) {
        throw new PrettyError(
          '@swc/core is required for es5 target. Please install it with `npm install @swc/core -D`',
        );
      }

      const result = await swc.transform(code, {
        filename: info.path,
        sourceMaps: this.options.sourcemap,
        minify: Boolean(this.options.minify),
        jsc: {
          target: 'es5',
          parser: {
            syntax: 'ecmascript',
          },
          minify:
            this.options.minify === true
              ? {
                  compress: false,
                  mangle: {
                    reserved: this.options.globalName ? [this.options.globalName] : [],
                  },
                }
              : undefined,
        },
      });
      return {
        code: result.code,
        map: result.map,
      };
    },
  };
};
```
