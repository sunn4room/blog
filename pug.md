---
title: pug 学习笔记
date: 2020-05-21 09:19:54
updated: 2020-05-21 09:19:54
categories:
- 前端渲染
tags:
- 学习笔记
- pug
- html
---

pug 是从 jade 衍变过来的，是使用 JavaScript 实现的标记语言模板引擎，其语法和 yaml 非常类似。

<!-- more -->

## 安装

```bash
npm install pug
```

## 用法

```javascript
import pug from "pug";
const compiledFunction = pug.compile("p hello #{name}");
console.log(
  compiledFunction({
    name: "sunnyroom",
  })
);
// [print]: <p>hello sunnyroom</p>

// 另一种写法
console.log(
  pug.render("p hello #{name}", {
    name: "sunnyroom",
  })
);
// [print]: <p>hello sunnyroom</p>
```

## 语法

### 标签

```jade
<tag>(<attr>=xxx <attr>=xxx) <content>
<tag>(<attr>=xxx <attr>=xxx) = <expression>
<tag>(<attr>=xxx <attr>=xxx) != <expression> // 不转义
// 也可以嵌入，即在content中使用#{}语法

// 类和ID的特殊写法
<tag>.<class>(<attr>=xxx <attr>=xxx) <content>
<tag>#<id>(<attr>=xxx <attr>=xxx) <content>
```

### 流控制

```jade
case <varible>
  when <v1>
    ...
  when <v2>
    ...
  default
    ...
```

```jade
for (...)
  ...

each item in <list>
  ...
```

```jade
if (...)
  ...
else if (...)
  ...
else
  ...
```

```jade
unless (...)
  ...
```

### 继承

```jade
// a.pug
...
block <blk-name>
  ...
```

```jade
// b.pug
extends a.pug
block <blk-name>
  ... // 覆盖
block prepend <blk-name>
  ... // 开头插入
block append <blk-name>
  ... // 尾部插入
```

### 混入

```jade
mixin <mx-name>(<param>)
  ...
  block // 原内容
  ...

+<mx-name>(<param>)
  ... // 内容
```

### 其他

```jade
doctype html // <!DOCTYPE html>
```

```jade
include xxx.pug/css/js
```
