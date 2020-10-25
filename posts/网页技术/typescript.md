---
date: 2020-10-17 09:35:16
tags:
- js
- ts
---

# TypeScript 学习笔记

Typescript 是 Javascript 的超集，可以编译成 Javascript ，并且提供编译时的静态类型检查

<!-- more -->

## 类型系统

### 原始类型

#### number

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

#### string

```typescript
let name: string = "bob";
let sentence: string = `Hello, my name is ${ name }.`;
```

#### boolean

#### symbol

#### null

#### undefined

### 非原始类型

#### object

#### interface

接口的作用就是为一个类型命名并定义这个类型的 “契约”。

```typescript
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```



#### class

> javascript 也有 class 的概念，相比之下，实现了私有成员、抽象类、抽象方法等特性

### 数组

```typescript
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

### 元组

```typescript
let x: [string, number];
```

### 枚举

```typescript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

### any

```typescript
let notSure: any;
```

### void

```typescript
function warnUser(): void {
    console.log("This is my warning message");
}
```

### never



### 联合类型

```typescript
let notSure: string | number | Color;
```

> **类型断言**
>
> 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript会假设你，程序员，已经进行了必须的检查。
>
> ```typescript
> let someValue: any = "this is a string";
> let strLength: number = (<string>someValue).length;
> // or
> let someValue: any = "this is a string";
> let strLength: number = (someValue as string).length;
> ```
>

## 接口

### 对象接口

### 函数接口

### 映射接口

## 函数

## 字面量

## 联合类型

## 类

## 枚举

## 泛型