---
sidebar_position: 1
---

# 快速上手

> 20 分钟快速上手 ⏱️

## 安装

```bash
# 建议当前项目中安装
pnpm i encode-bundle  -D

# 也可以全局安装，但不推荐
pnpm i encode-bundle -g
```

## 基础使用

```bash
encode-bundle [...files]
```

文件默认会构建至 `dist`目录下。

## 支持多入口

```bash
encode-bundle src/index.ts src/cli.ts
```

会在`dist`目录下产出`index.js`与`cli.js`。

也可以使用`CLI`的指令执行相同的功能

```bash
# 构建结果为 dist/index.js dist/cli.js
encode-bundle --entry src/index.ts --entry src/cli.ts
```

也可以指定构建后的文件名称

```bash
# 构建结果为 dist/foo.js 和 dist/bar.js
encode-bundle --entry.foo src/index.ts --entry.bar src/cli.ts
```

也可以在 `encode-config.ts` 中配置：

```typescript
export default defineConfig({
  // 输出 dist/a.js 和 dist/b.js
  entry: ['src/a.ts', 'src/b.ts'],
  // 输出 dist/foo.js 和 dist/bar.js
  entry: {
    foo: 'src/a.ts',
    bar: 'src/b.ts',
  },
});
```

## 设置 exclude

默认情况下，除了生产环境下所依赖的模块(`peerDependencies`和`dependencies`)外，会自动构建其他的模块，如果不希望构建，可以使用`--external`避免构建。

## 自定义配置

可以使用如下配置

- `encode-bundle.config.ts`
- `encode-bundle.config.js`
- `encode-bundle.config.cjs`
- `encode-bundle.config.json`
- 在`package.json`中的`encode-bundle`

也可以使用`defineConfig`来进行定制化配置。

```typescript
import { defineConfig } from 'encode-bundle';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

也可以在`package.json`中进行配置。

```json
{
  "encode-bundle": {
    "entry": ["src/index.ts"],
    "splitting": false,
    "sourcemap": true,
    "clean": true
  }
}
```

## 生成声明文件

```bash
encode-bundle index.ts --dts
```

以上指令会导出`./dist/index.js`和`./dist/index.d.ts`，当导出多种构建格式时，每种构建格式都会生成一个声明文件。

如果有多个入口文件，每个入口文件都会生成一个对应的`.d.ts`文件。因此，如果想对单个入口文件生成声明文件时，请使用 ` --dts <entry>`` 格式，例如 `--dts src/index.ts`。

请注意，`--dts`不会解析 `.d.ts` 文件中使用的外部（比如`node_modules`）类型，如果这是某种要求，可以使用 `--dts-resolve`。

## 只导出声明文件

`--dts-only` 指令等同于`tsc`的`emitDeclarationOnly`。可以使用此指令只生成声明文件。

## 生成 sourcemap

```bash
encode-bundle index.ts --sourcemap
```

会导出 `./dist/index.js` and `./dist/index.js.map`。

如果有多个入口文件，每个入口文件都会生成相对于的`.map`文件。

## 构建产物格式

支持`ESM`、`CJS`和`IIFE`。

可以一次性构建多种类型：

```bash
encode-bundle src/index.ts --format esm,cjs,iife
```

将会生成以下文件结构：

```bash
dist
├── index.mjs         # esm
├── index.global.js   # iife
└── index.js          # cjs
```

如果`package.json`中的`type`配置为`module`，产出结果会有所不同：

```bash
dist
├── index.js          # esm
├── index.global.js   # iife
└── index.cjs         # cjs
```

如果不想使用诸如`.mjs`或者`.cjs`这类文件后缀，或者当前环境不支持此后缀，可以使用`--legacy-output`

```bash
encode-bundle src/index.ts --format esm,cjs,iife --legacy-output
```

会构建成:

```bash
dist
├── esm
│   └── index.js
├── iife
│   └── index.js
└── index.js
```

## 代码分割

目前代码分隔只支持`ESM`的产物类型，并且默认是开启的，如果想针对`CJS`的文件类型设置代码分隔，请设置`--splitting`，会启用`esbuild`的代码分隔功能。

对应地，如果想关闭代码分隔，请使用`--no-splitting`。

## 目标环境

此处默认使用`tsconfig`中的`compilerOptions.target`，也可以使用`--target`来手动声明。

## 支持 ES5

可以使用`--target es5`指令来将代码编译构建至 ES5 版本，代码首先会构建成`ES2020`，然后借助 SWC 编译成`ES5`。

## watch 模式

```bash
encode-bundle src/index.ts --watch
```

启动`watch`模式，这意味着在初始构建后，encode-bundle 会监听文件变化。

可以使用`--ignore-watch`来取消指定文件的监听。

```bash
encode-bundle src src/index.ts --watch --ignore-watch folder1 --ignore-watch folder2
```

## 成功回调

```bash
encode-bundle src/index.ts --watch --onSuccess "node dist/index.js"
```

`--onSuccess`会返回`Promise`类型的函数，可以执行类似如下功能

```typescript
import { defineConfig } from 'encode-bundle';

export default defineConfig({
  async onSuccess() {
    const server = http.createServer((req, res) => {
      res.end('Encode Studio!');
    });
    server.listen(3000);
    return () => {
      server.close();
    };
  },
});
```

## 压缩代码

可以使用`--minify`来压缩代码

```bash
encode-bundle src/index.ts --minify
```

或者使用`terser`而不是 esbuild 来压缩代码，前提条件是要先安装`terser`

```bash
encode-bundle src/index.ts --minify
```

## tree shaking

`esbuild`默认开启`tree shaking`，但是特殊情况下（如：[external 模块](https://github.com/evanw/esbuild/issues/1794)或者[未使用的引用](https://github.com/evanw/esbuild/issues/1435)）等情况还是有些问题。

提供`--treeshake`指令来启用`rollup`的`tree shaking`。

针对更多帮助，请使用`encode-bundle --help`。
