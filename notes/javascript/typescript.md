# TypeScript

TypeScript 为 JavaScript 代码提供类型检查支持。

## hello, typescript

### 安装

```sh
npm install -D typescript
```

### 配置

```sh
touch tsconfig.json
```

```json
{
  "strict": false,
  // "strict": true, 严格检查，包括不允许隐式推断为any、必须处理null和undefined等
}
```

### 命令行

```sh
tsc
```

