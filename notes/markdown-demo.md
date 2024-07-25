# Markdown Demo

## Heading 1

Content 1

### Heading 2

Content 2

#### Heading 3

Content 3

##### Heading 4

Content 4

###### Heading 5

Content 5

## Paragraph

First paragraph.
First paragraph.
First paragraph.

Second paragraph.
Second paragraph.
Second paragraph.

# Style

*Italic text*

**Bold text**

***Italic and bold text***

~~Strikethrough text~~

## Code

`Enter` `Shift` `Ctrl` `Alt`

```html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

## Alert

> Normal information.

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

## Link

[Go to home page](/)

[Go to welcome page](./welcome)

[VitePress](https://vitepress.dev/)

![VitePress Logo](https://vitepress.dev/vitepress-logo-large.webp "VitePress")

vitepress [^1]

## List

- Item 1
- Item 2
- Item 3
  - Subitem 1

1. Item 1
1. Item 2
1. Item 3
   1. Subitem 1

## Table

| Name | Score | Level |
| ---- | ----: | :---: |
| John | 100 | `A+` |
| Sarah | 90 | `A` |
| Tom | 80 | `A-` |

## Sub & Sup

21^st^ H~2~O

## Math

When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

**Maxwell's equations:**

| equation                                                                                                                                                                  | description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| $\nabla \cdot \vec{\mathbf{B}}  = 0$                                                                                                                                      | divergence of $\vec{\mathbf{B}}$ is zero                                               |
| $\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t}  = \vec{\mathbf{0}}$                                                          | curl of $\vec{\mathbf{E}}$ is proportional to the rate of change of $\vec{\mathbf{B}}$ |
| $\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} = 4 \pi \rho$ | _wha?_                                                                                 |

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

## Chartjs

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
