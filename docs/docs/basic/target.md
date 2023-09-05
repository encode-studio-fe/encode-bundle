---
sidebar_position: 8
---

# 目标环境

在`CLI`指令解析时，格式化`target`相关配置

```typescript
if (flags.target) {
  options.target = flags.target.indexOf(',') >= 0 ? flags.target.split(',') : flags.target;
}
```

在构建格式化时，如果没有设置`target`时，默认读取`tsconfig`中的`compilerOptions.target`。

```typescript
if (!options.target) {
  options.target = tsconfig.data?.compilerOptions?.target?.toLowerCase();
}
```

在`runEsbuild`方法中，传给`esbuild`的`target`属性。

```typescript

esbuild({
  target: options.target,,
})
```
