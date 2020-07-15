---
title: Golang 学习笔记
date: 2020-07-15 08:27:08
categories:
- golang
tags:
- 学习笔记
- golang
---

Golang 设计原则是在保证程序性能的前提下满足快速开发的需求。

<!-- more -->

- 静态类型语言
- 编译型语言
- 并发
- 内存管理
- 开源、包管理

## 注释

- `//` 单行注释
- `/* ... */` 多行注释

## 格式化

像 Java C 等语言为了自由的追求，对源码的格式并没有做强制限制。但 go 语言则不同，内置了格式化工具，不符合规则的源码是不会顺利通过编译的。

- 程序元素前被建议添加适当的注释，没有则会被警告
- 不建议使用分号结尾，分号会在编译前根据行末符号自动添加或不添加
  - `{` 后不会添加分号，所以 `func` 和 `{` 要同行，否则报错
  - `+` 后不会添加分号，可以起到换行的目的，其他运算符同理
- 格式化默认会使用缩进符，可以酌情替换成空格

## 声明

### 包声明

```go
package _pkg-name
```

- Go 使用文件夹的形式组织源代码，每一个源码文件必须以包定义开头
- 同一个文件夹下的源码文件必须具有相同的包名
- main 包代表一个可执行的包，除了 main 包，建议包名与文件夹名称保持一致
- 一个包对应的文件夹下可以包含一个子包的文件夹
- 包名是外部访问的标识符

### 引入声明

```go
import "_pkg-path"
import (
	"_pkg-path"
    _alias "_pkg-path"
)
```

- import 语句出现在 package 后，程序实体前，用于引入外部包
- 子包的写法是在父包路径后加 `/子包名`

> 不同的包管理工具会根据包路径采用不同的方式去寻找外部包

### 常量声明 const

```go
const _name _type = _expr
```

### 变量声明 var

```go
var _name _type //
var _name = _expr // 变量的类型由后面的表达式决定
```

> 当未提供表达式时，默认赋初始值
>
> - 整型和浮点型变量的默认值为 0 和 0.0。
> - 字符串变量的默认值为空字符串。
> - 布尔型变量默认为 false。
> - 切片、函数、指针变量等的默认为 nil。

> 在函数体内部，可以不使用 `var` 而使用 `:=` 来表示声明且赋值，如：
>
> ```go
> func xxx() {
>     _name := _expr // 变量的类型由后面的表达式决定
> }
> ```

>多变量声明，用 `,` 间隔，如：
>
>```go
>var _name _type, _name _type
>var _name, _name _type // 省略第一个类型
>
>func xxx() {
>    _name, _name := _expr, _expr
>}
>```
>
>const 同理
>
>```go
>const _name _type, _name _type
>const _name, _name _type // 省略第一个类型
>```

### 函数声明 func

```go
func _fname() {...}
func _fname(_t _type) {...}
func _fname(_t _type) (_type) {...}
func (_t _type) _fname(_t _type) (_type) {...}
```

### 派生类型声明 type

```go
type _tname struct {...}
type _tname interface {...}
type _tname func(_type) (_type)
type _tname int/string/float/bool
```

## 标识符

### 关键字

break、default、func、interface、select、case、defer、go、map、struct、chan、else、goto、package、switch、const、fallthrough、if、range、type、continue、for、import、return、var

### 自定义标识符

- 不能和关键字同名
- 以字符或者下划线开头，由字符、数字和下划线组成

- 推荐 “驼峰式” 风格

> `_` 是个特殊的标识符，表示空位

### 其他标识符

- 内置常量：true、false、iota、nil
- 内置类型：int、int8、int16、int32、int64、uint、uint8、uint16、uint32、uint64、uintptr、float32、float64、complex128、complex64、bool、byte、rune、string、error
- 内置函数：make、len、cap、new、append、copy、close、delete、complex、real、imag、panic、recover

## 类型系统

### 内置类型

- int

  ```go
  var i = 1
  var i = 0b101
  var i = 0303
  var i = 0xa0a
  ```

- uint

- float

  ```go
  var f = 1.1
  var f = 1.1e5
  ```

- complex

  ```go
  var c = complex(_real, _imag)
  ```

- bool

  ```go
  var b = true
  var b = false
  ```

- byte

  ```go
  // byte 是 uint8 的包装类型
  ```

- rune

  ```go
  // rune 是 int32 的包装类型
  ```

- string

  ```go
  var s = "xxx"
  ```

### 聚合类型

- 数组

  ```go
  var a [_length]_type
  var a = [...]_type{_expr, _expr ...}
  ```

- struct

  ```go
  type A struct {
      a int
  }
  var a A = A{a:1}
  ```
  
  > 空结构体 `struct{}`

### 指针类型

以上类型在声明的时候就已经分配的内存空间，直接存的就是值，而指针类型在声明的时候只分配一个指针空间，存的是指针

- 普通指针类型

  ```go
  var a *_type = &expr
  fmt.Println(*a)
  ```

- slice

  ```go
  var s []_type
  var s = []_type{_expr, _expr ...}
  var a = [...]int{0,1,2,3,4,5}
  var s = a[0:3]
  var ss = s[0:6] // 重新制定范围
  append(s, _expr, _expr)
  copy(ss, s)
  ```

- map

  ```go
  var m map[_ktype]_vtype
  var m = map[_ktype]_vtype{_expr:_expr, _expr:_expr ...}
  m[_expr] = _expr
  delete(m, _kexpr)
  ```

- func

  ```go
  var f func(_type, _type) (_type, _type)
  ```

- interface

  ```go
  type I interface {
      _fname(_type, _type) (_type, _type)
  }
  type A struct {}
  func (a A) _fname( p1 _type, p2 _type) (_type, _type) {
      ...
  }
  var i I = A{}
  i._fname(xxx, xxx)
  ```

  > 空接口 `interface{}`

- chan

  ```go
  var c chan/<-chan/chan<- _type
  var c = make(chan _type,_buf)
  // 无缓冲的通道会阻塞至接受者和发送者配对成功
  close(c)
  ```

### 类型包装

```go
type _new-type-name _old-type
```

### 类型转换

```go
_type(xxx)
```

## 运算符

### 算术运算符

+、-、*、/、&、++、--

### 关系运算符

==、!=、<、>、<=、>=

### 逻辑运算符

&&、||、!

### 位运算符

&、|、^、<<、>>

### 赋值运算符

=、+=、-=、*=、/=、%=、<<=、>>=、&=、^=、|=

### 指针运算符

&、*

## 流控制

### main() 和 init()

```go
package main
...
func main() {
    ...
}
func init() {
    ...
}
```

main 包下的 main 方法是程序启动的入口，如果存在 init 方法，则会在 main 方法执行之前被执行。

### for

```go
for _init;_condition;_post {...}
for _condition {...}
for {...}
for index, item := range _string/_array/_slice {...}
for key, value := range _map {...}
for element := range _chan {...} // 直到 _chan 关闭
```

### if

```go
if <init>;<condition> {
    ...
} else if <condition> {
    ...
} else {
    ...
}
```
### switch


```go
switch <init>;<varible> {
    case <value1>:
    	...
    case <value2>:
    	...
    	// fallthrough 表示继续执行下面的判断
    default:
    	...
}

switch <init> {
    case <condition>:
    	...
    case <condition>:
    	...
    default:
    	...
}
```

### select

```go
select { // 阻塞到某个分支可以继续执行为止。当多个分支都准备好时会随机选择一个执行 
    case _element, ok := <- _chan: // _chan 有数据或被关闭
    	...
    case _chan <- _expr: // _chan 可接受数据
    	...
    default: // 上面的操作条件都不满足
    	...
}
```

### goto

```go
goto label
...
label: xxx
```

goto 语句可以无条件地转移到过程中指定的行

### defer

```go
func xxx() {
    ...
    defer _f1()
    defer _f2()
    defer _f3()
    ...
} // 函数结束后的执行顺序是 f3 f2 f1
```

defer 的执行时机

- 包裹defer的函数返回时
- 包裹defer的函数执行到末尾时
- 所在的goroutine发生 panic 时

## 协程

```go
go <func-name>(<param-list>)
go func(<param-list>) (<ret-list>) {
    ...
}(<param-list>)
```

### GMP 模型



## 命令行工具

```sh
$ go run _main_package_path _arg1 _arg2 ...
$ go fmt
$ go get
```



## 标准包

### os

```go
os.Args[0] // 命令名
os.Args[1:] // 命令参数
```



### logger

```go
log.Print(xx, xx)
log.Fatal(xx, xx) // print(xx,xx)   os.Exit(1)
log.Panic(xx, xx) // print(xx,xx)   panic()

log.Printf(format, xx, xx)
log.Println(xx, xx)
// Fatal Panic 同 Print

log.Prefix()
log.Flags()
log.Writer()

log.SetPrefix("<prefix>")
log.SetFlags(<flag>)
log.SetOutput(<io.Writer>)

log.New(<io.Writer>, "<prefix>", <flag>) // 自定义log

// ------------flags-------------
// Ldate: the date in the local time zone: 2009/01/23
// Ltime: the time in the local time zone: 01:23:23
// Lmicroseconds: microsecond resolution: 01:23:23.123123.  assumes Ltime.
// Llongfile: full file name and line number: /a/b/c/d.go:23
// Lshortfile: final file name element and line number: d.go:23. overrides Llongfile
// LUTC: if Ldate or Ltime is set, use UTC rather than the local time zone
// Lmsgprefix: move the "prefix" from the beginning of the line to before the message
// LstdFlags: initial values for the standard logger
```

### reflect

类似于 Java ，Go 提供了反射机制，可以在运行期间动态获取和修改一个变量的类型信息和值信息。

```go
import "reflect"
```

### testing

`*_test.go` 文件用于 `go test` 测试

#### Test

```go
func TestXxx(t *testing.T) {
    t.Log("xxx") // 日志
    t.Error("xxx") // 错误日志
    t.Fail() // 标记不通过
    f.FailNow() // 标记不通过，且立即停止执行
    ...
}
```

TestMain

```go
func TestMain(m *testing.M) {
    ... // before
    ret := m.Run() // 执行测试，包括单元测试、性能测试和示例测试
    ... // after
    os.Exit(ret)
}
```

#### Benchmark

```go
func BenchmarkXxx(b *testing.B) {
    for i := 0; i < b.N; i++ {
		...
        b.ResetTimer() // 重置计时器
    	b.StopTimer() // 停止计时器
    	b.StartTimer() // 开始计时器
	}
}
```

### sync

```go
var <mutex> sync.Mutex

<mutex>.Lock()
[defer] <mutex>.Unlock()
```

```go
var <rwmutex> sync.RWMutex

<rwmutex>.Rlock()
<rwmutex>.RUnlock()
<rwmutex>.lock()
<rwmutex>.Unlock()
```

### context