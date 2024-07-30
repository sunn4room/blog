# Prettier

前端项目格式化工具，支持 javascript、typescript、json、yaml、html、css 等。

## 安装

```sh
npm install -D prettier
```

## 配置

```sh
touch .prettierrc
```

```json
{
  "printWidth": 80,
  "useTabs": false,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "overrides": [
    {
      "files": [],
      "options": {}
    }
  ]
}
```

::: tip
可以额外创建 `.prettierignore` 文件，让 prettier 跳过某些文件。prettier 默认会跳过 `.gitignore` 声明的文件。
:::

::: tip 官方链接
[options](https://prettier.io/docs/en/options)

[configuration](https://prettier.io/docs/en/configuration)
:::

## 命令行

```sh
prettier --check
prettier --write
```

