---
sidebar_position: 2
---

# external

`CLI`支持两种功能：

1. encode-bundle: 构建除了`dependencies`和`peerDependencies`外的依赖；
2. encode-bundle-node: 除了不构建`dependencies`和`peerDependencies`的依赖外，还可以跳过所有的 Node.js 依赖包；

除了以上默认的使用外，还可以使用`--external`避免打特定的包。

## encode-bundle 与 encode-bundle-node

其中，`package.json`中指定特定 CLI 入口:

```json
"bin": {
  "encode-bundle": "dist/cli-default.js",
  "encode-bundle-node": "dist/cli-node.js"
}
```

两者区别在于`encode-bundle-node`传入了以下 option：

```typescript
skipNodeModulesBundle: true,
```

此处因为`esbuild`的`external`不支持正则，创建`externalPlugin`。

```typescript
import { Plugin } from 'esbuild';
import { tsconfigPathsToRegExp, match } from 'bundle-require';

// Must not start with "/" or "./" or "../" or "C:\" or be the exact strings ".." or "."
const NON_NODE_MODULE_RE = /^[A-Z]:[\\\/]|^\.{0,2}[\/]|^\.{1,2}$/;

export const externalPlugin = ({
  external,
  noExternal,
  skipNodeModulesBundle,
  tsconfigResolvePaths,
}: {
  external?: (string | RegExp)[];
  noExternal?: (string | RegExp)[];
  skipNodeModulesBundle?: boolean;
  tsconfigResolvePaths?: Record<string, string[]>;
}): Plugin => {
  return {
    name: `external`,

    setup(build) {
      if (skipNodeModulesBundle) {
        const resolvePatterns = tsconfigPathsToRegExp(tsconfigResolvePaths || {});
        build.onResolve({ filter: /.*/ }, (args) => {
          // Resolve `paths` from tsconfig
          if (match(args.path, resolvePatterns)) {
            return;
          }
          // Respect explicit external/noExternal conditions
          if (match(args.path, noExternal)) {
            return;
          }
          if (match(args.path, external)) {
            return { external: true };
          }
          // Exclude any other import that looks like a Node module
          if (!NON_NODE_MODULE_RE.test(args.path)) {
            return {
              path: args.path,
              external: true,
            };
          }
        });
      } else {
        build.onResolve({ filter: /.*/ }, (args) => {
          // Respect explicit external/noExternal conditions
          if (match(args.path, noExternal)) {
            return;
          }
          if (match(args.path, external)) {
            return { external: true };
          }
        });
      }
    },
  };
};
```

其中，针对`skipNodeModulesBundle`为`true`的情况下，额外过滤`tsconfig`中所有`path`的文件

```typescript
const resolvePatterns = tsconfigPathsToRegExp(tsconfigResolvePaths || {});

if (match(args.path, resolvePatterns)) {
  return;
}
```

## 过滤 dependencies/peerDependencies 与 external 依赖

1. 获取对应依赖

```typescript
const external = [
  // Exclude dependencies, e.g. `lodash`, `lodash/get`
  ...deps.map((dep) => new RegExp(`^${dep}($|\\/|\\\\)`)),
  ...(await generateExternal(options.external || [])),
```

2. 获取要`external`的依赖项，先处理`options.external`选项中的依赖，处理完后默认过滤线上依赖项

```typescript
/**
 * Support to exclude special package.json
 */
const generateExternal = async (external: (string | RegExp)[]) => {
  const result: (string | RegExp)[] = [];

  for (const item of external) {
    if (typeof item !== 'string' || !item.endsWith('package.json')) {
      result.push(item);
      continue;
    }

    let pkgPath: string = path.isAbsolute(item)
      ? path.dirname(item)
      : path.dirname(path.resolve(process.cwd(), item));

    const deps = await getProductionDeps(pkgPath);
    result.push(...deps);
  }

  return result;
};
```

3. 获取`dependencies`和`peerDependencies`

```typescript
/*
 * Production deps should be excluded from the bundle
 */
export async function getProductionDeps(cwd: string, clearCache: boolean = false) {
  const data = await loadPkg(cwd, clearCache);

  const deps = Array.from(
    new Set([...Object.keys(data.dependencies || {}), ...Object.keys(data.peerDependencies || {})]),
  );

  return deps;
}
```
