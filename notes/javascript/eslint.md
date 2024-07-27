# Eslint

Eslint 是一个 javascript 代码报错和修复工具。

## 安装

```sh
npm install -D eslint
```

## 配置

```sh
touch eslint.config.js
```

```javascript
export default [
  // ... presets
  {
    files: [
      "src/**/*.js",
      "src/**/*.ts",
    ],
    ignores: [
      "src/public/index.js",
    ],
    rules: {
      "no-unreachable": "off",
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
```

## 命令行

```sh
# eslint [options] [file|dir|glob]*
eslint index.js
eslint src/
eslint # 等价于 eslint ./
eslint src/**/*.js
eslint --fix index.js
```

## 预设

### `@eslint/js`

```sh
npm install -D @eslint/js
```

```javascript
import js from '@eslint/js'
export default [
  // ...
  js.configs.recommended,
  // ...
]
```

