# Markdown 示例

## 一级标题

一级内容。

### 二级标题

二级内容。

#### 三级标题

三级内容。

##### 四级标题

四级内容。

###### 五级标题

五级内容。

## 段落

段落内容。
段落内容。
段落内容。

# Style

*斜体*

**粗体**

***斜粗体***

~~删除体~~

## 代码

`Enter` `Shift` `Ctrl` `Alt`

```java
class Main {
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}
```

## 引用

> 引用内容。

## 标记

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## 链接

[主页](/)

[索引页](./)

[VitePress](https://vitepress.dev/)

![VitePress Logo](https://vitepress.dev/vitepress-logo-large.webp "VitePress")

vitepress [^1]

## 列表

- 项目 1
- 项目 2
- 项目 3
  - 子项目 1

1. 项目 1
1. 项目 2
1. 项目 3
   1. 子项目 1

## 表格

| 姓名 | 得分 | 等级 |
| ---- | ----: | :---: |
| John | 100 | `A+` |
| Sarah | 90 | `A` |
| Tom | 80 | `A-` |

## 上下标

21^st^

H~2~O

## 公式

$ax^2 + bx + c = 0$ ， $a \ne 0$ ：

$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

## Emoji

:joy:

## Mermaid

```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```

## Chart.js

```chart
{
  "type": "bar",
  "data": {
    "labels": ["Chinese", "English", "Math", "Physics", "Chemistry", "Biology"],
    "datasets": [
      {
        "label": "Daved",
        "data": [80, 90, 70, 50, 70, 30],
        "borderWidth": 1
      },
      {
        "label": "Votes",
        "data": [40, 60, 80, 90, 30, 50],
        "borderWidth": 1
      }
    ]
  },
  "options": {
    "scales": {
      "y": {
        "min": 0,
        "max": 100
      }
    }
  }
}
```

## PlantUML

```plantuml
Bob -> Alice : hello
```

[^1]: https://vitepress.dev/
