# Golang

Golang 设计原则是在保证程序性能的前提下满足快速开发的需求。

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

> iota 是一个特殊的常量，只能被编译器修改，const 内部随着行不断递增
>
> ```go
> const (
> 	a = iota // 0
>     b // 1
>     c // 2
>     d // 3
> )
> ```

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
>        _name, _name := _expr, _expr
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
// 所有的执行者和形参在运行时都是值传递，所以必要时要考虑用指针类型
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

### 其他标识符

- 内置常量：true、false、iota、nil
- 内置类型：int、int8、int16、int32、int64、uint、uint8、uint16、uint32、uint64、uintptr、float32、float64、complex128、complex64、bool、byte、rune、string、error
- 内置函数：make、len、cap、new、append、copy、close、delete、complex、real、imag、panic、recover
- 空位符：_

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
      a int `_tag`
  }
  var a A = A{a:1}
  ```
  
  > **匿名结构体**，即结构体嵌套一个匿名的结构体，可以将其属性和方法继承过来，直接使用
  
  > 空结构体 `struct{}`

> **聚合类型的值传递**：数组会遍历元素并赋值到一个新的数组，结构体也会遍历属性并赋值到一个新的结构体

### 指针类型

以上类型在声明的时候就已经分配的内存空间，直接存的就是值，而指针类型在声明的时候只分配一个指针空间，存的是指针

- 普通指针类型

  ```go
  var a *_type = &expr
  var a = new(_type) // new 分配内存，赋初值，返回指针
  ```

  > 指针变量可以通过 `.` 直接访问源类型的方法；结构体的指针变量还可以直接访问源类型的属性，也正是因为这个缘故，下面的写法会报错：
  >
  > ```go
  > type A struct {...}
  > func (a A) set() {...}
  > func (a *A) set() {...} // 与上一个方法重名了
  > ```

- slice

  ```go
  var s []_type
  var s = []_type{_expr, _expr ...}
  var a = [...]int{0,1,2,3,4,5}
  var s = a[0:3]
  var ss = s[0:6] // 重新制定范围
  var s = make([]int, _len, _cap)
  append(s, _expr, _expr)
  copy(ss, s)
  ```

- map

  ```go
  var m map[_ktype]_vtype
  var m = map[_ktype]_vtype{_expr:_expr, _expr:_expr ...}
  var m = make(map[_ktype]_vtype, _size)
  m[_expr] = _expr
  delete(m, _kexpr)
  ```

- func

  ```go
  var f func(_type, _type) (_type, _type)
  ```

  > **闭包**，即函数返回函数，其意义在于：函数内部定义的局部变量无状态，而将有状态变量定义在外部又造成了外部命名空间的污染，闭包可以解决这个问题，如：
  >
  > ```go
  > func outer() func() {
  >     var i int
  >     return func() {
  >         i++
  >         fmt.Println(i)
  >     }
  > }
  > 
  > func main() {
  >     var f = outer()
  >     f() // 1
  >     f() // 2
  >     f() // 3
  > }
  > ```

- interface

  ```go
  type I interface {
      _fname(_type, _type) (_type, _type)
  }
  type A struct {}
  func (a A) _fname( p1 _type, p2 _type) (_type, _type) {// 类型要完全一致，和Java不同
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

> **指针类型的值传递**：就是简单的赋值存储的地址

### 类型包装

```go
type _new-type-name _old-type
```

### 类型转换

```go
_type(xxx)
```

### 类型断言

```go
// 目标必须是接口类型，通常 interface{} 可以接受所有类型的值，并转为接口类型

if v,ok := _target.(_type); ok {
    // 断言成功
} else {
    // 断言失败
}

switch v := _target.(type) {
case _type:
    ...
case _type:
    ...
default:
    ...
}
```

> 断言规则
>
> - 如果要断言的类型是接口类型，会判断目标的实际类型是否满足断言类型，如果满足会返回一个断言类型的值，而不是直接返回实际类型的值
> - 否则，会判断目标的实际类型是否就是断言类型，如果是则会直接返回实际类型的值

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

main 包下的 main 方法是程序启动的入口。如果存在 init 方法，则会在 main 方法执行之前被执行。

init 的执行顺序：

- 如果文件内定义了多个 init 则从上到下执行
- 如果同一个包下，不同文件内有多个 init ，则按照字典序执行多个文件内的 init
- 如果导入的包里也有 init 方法，则按顺序先执行导入包中的 init 方法

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
    defer func() {
        ...
    }()
    defer _f1()
    defer _f2()
    defer _f3()
    ...
} // 函数结束后的执行顺序是 f3 f2 f1 func
```

defer 的执行时机

- 包裹defer的函数返回时
- 包裹defer的函数执行到末尾时
- 所在的goroutine发生 panic 时

### panic 和 recover

```go
func xxx() {
    ...
    panic(_error)
    ...
    defer func() {
        if e := recover(); e != nil {
            ...
        }
    }()
}
```

当 panic 发生时，将暂停当前进程的所有活动，然后运行 defer 栈中的方法，如果遇到了 recover 将恢复当前进程的活动，继续执行相应 defer 的外围程序，否则将终止程序并将错误信息打印出来。

## 协程

```go
go _fname(_param)
go func(_param-list) (_ret-list) {
    ...
}(_param)
```

> **GMP模型**
>
> - G：代表一个协程
> - M：代表一个线程
> - P：代表 G 的一个队列，负责调度，即当 P 中存在 G 时就会绑定一个 M 用来执行 G 的任务
>
> **调度机制**
>
> - 当一个 P 队列里没有 G 了，会先到全局 P 中抢一个 G 过来执行，当全局 P 中也没有 G ，那么会到其他 P 的末尾抢一个 G 过来执行（全局 P 的意义在于减少了 P 与 P 之间的相互竞争）
> - P 会自动捕捉运行中的 G 的状态，当发现阻塞时间过程时，会重新绑定另一个 M，执行后续的 G ，而当阻塞完成或者认为其已经死掉时回收旧的 M
>
> 由此可知，go 实现了用户态下的协程调度（轻量级），减少了系统级别的线程调度（重量级）带来的性能损耗，提高了系统的并发能力。

## 错误处理

```go
// 内置 error 类型
type error interface {
    Error() string
}
```

```go
type MyError struct {...}
func (me *MyError) Error() string {
	...
}

func test() (r _type, e error) {
	...
    return nil, &MyError{...}
    ...
    return xxx, nil
}

func main() {
    ...
    if r, e := test(); e != nil {
        if ee, ok := e.(*MyError); ok {
            ...
        }
    }
}
```

## 命令行工具

```sh
$ go run _main_package_path _arg1 _arg2 ...
$ go fmt
$ go get
$ go build
# CGO_ENABLED=0 GOOS=linux GOARCH=amd64
```

## 标准库

### fmt

```go
Print(a ...interface{}) (n int, err error)
Println(a ...interface{}) (n int, err error)
Printf(format string, a ...interface{}) (n int, err error)

Scan(a ...interface{}) (n int, err error)
Scanln(a ...interface{}) (n int, err error)
Scanf(format string, a ...interface{}) (n int, err error)

// 相应的都有 Fxx Sxx 的版本，分别代表Writer/Reader、字符串

// %%  百分号
// %v  值
// %T  值的类型
// %t  true false
// %b  二进制
// %o  八进制
// %d  十进制
// %x  十六进制
// %c  字符
// %f  浮点计数法
// %e  科学计数法
// %s  字符串
// %p  指针
```

### os

```go
os.Args[0] // 命令名
os.Args[1:] // 命令参数

```

### path



### runtime

### io

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}
type Writer interface {
    Write(p []byte) (n int, err error)
}
```

```go
type ReaderFrom interface {
    ReadFrom(r Reader) (n int64, err error)
}
type WriterTo interface {
    WriteTo(w Writer) (n int64, err error)
}
```

### ioutil

```go
ReadFile(filename string) ([]byte, error)
WriteFile(filename string, data []byte, perm os.FileMode) error
```

### bufio

```go
NewReader(rd io.Reader) *Reader
NewReaderSize(rd io.Reader, size int) *Reader
	ReadString(delim byte) (string, error)
NewWriter(w io.Writer) *Writer
NewWriterSize(w io.Writer, size int) *Writer
	WriteString(s string) (int, error)
```

### bytes

```go
Compare(a, b []byte) int
Contains(b, subslice []byte) bool
Equal(a, b []byte) bool
HasPrefix(s, prefix []byte) bool
HasSuffix(s, suffix []byte) bool
Index(s, sep []byte) int
LastIndex(s, sep []byte) int
Repeat(b []byte, count int) []byte
Replace(s, old, new []byte, n int) []byte
ToLower(s []byte) []byte
ToUpper(s []byte) []byte
Trim(s []byte, cutset string) []byte
NewBuffer(buf []byte) *Buffer
	ReadString(delim byte) (line string, err error)
	WriteString(s string) (n int, err error)
	String() string
NewReader(b []byte) *Reader
```

### strings

```go
Compare(a, b string) int
Contains(s, substr string) bool
EqualFold(s, t string) bool
HasPrefix(s, prefix string) bool
HasSuffix(s, suffix string) bool
Index(s, substr string) int
Join(elems []string, sep string) string
LastIndex(s, substr string) int
Repeat(s string, count int) string
Replace(s, old, new string, n int) string
ReplaceAll(s, old, new string) string
Split(s, sep string) []string
ToLower(s string) string
ToUpper(s string) string
Trim(s string, cutset string) string
new(strings.Builder) *strings.Builder
	WriteString(s string) (int, error)
	String() string
```

### strconv

```go
Atoi(s string) (int, error)
ParseBool(str string) (bool, error)
ParseFloat(s string, bitSize int) (float64, error)
ParseInt(s string, base int, bitSize int) (i int64, err error)
ParseUint(s string, base int, bitSize int) (uint64, error)
Itoa(i int) string
FormatBool(b bool) string
FormatFloat(f float64, fmt byte, prec, bitSize int) string
FormatInt(i int64, base int) string
FormatUint(i uint64, base int) string
```

### json



### template



### net



### time

```go
Nanosecond
Microsecond
Millisecond
Second
Minute
Hour

Sleep(d Duration)
Now() Time
```

### regexp



### reflect

当向接口变量赋予一个实体类型的时候，接口会存储实体的类型信息，反射就是通过接口的类型信息实现的，反射建立在类型的基础上。

```go
// 主要 API
TypeOf(i interface{}) Type
    Name() string // 类型名称
    PkgPath() string // 类型包路径
    Kind() Kind // 类型分类 （Int/Struct/Prt...）
    NumField() int // 结构体类型的属性个数
    Field(int) StructField // 指定索引的属性
    FieldByName(name string) (StructField, bool) // 指定名称的属性
    FieldByIndex(index []int) StructField // 针对结构体嵌套
		Name string // 属性名称
		Type Type // 属性类型
	NumMethod() int // 方法个数
	Method(int) Method // 指定索引的方法
	MethodByName(string) (Method, bool) // 指定名称的方法
		Name string // 方法名称
		Type Type // 方法类型
	NumIn() int // 函数类型的形参个数
	In(int) Type // 指定索引的形参类型
	NumOut() int // 函数类型的形参个数
	Out(int) Type // 指定索引的形参类型
	ChanDir() ChanDir // 通道类型的方向性
	Key() Type // Map 的key类型
	Elem() Type // Array, Chan, Map, Ptr, or Slice 的元素类型
	Len() int // Array的个数
ValueOf(i interface{}) Value
	Type() Type
	Interface() (interface{}) // 以空接口的形式返回值
	Set(x Value)
	Call(in []Value) []Value // 执行函数值
	Close() // 关闭通道值对应的通道
	Convert(t Type) Value
	Field(i int) Value
	FieldByIndex(index []int) Value
	FieldByName(name string) Value
	Method(i int) Value
	MethodByName(name string) Value
	Index(i int) Value
	MapIndex(key Value) Value
	Recv() (x Value, ok bool)
	Send(x Value)
```

### sync

```go
var mutex sync.Mutex
mutex.Lock()
mutex.Unlock()
```

```go
var _rwmutex sync.RWMutex
rwmutex.Rlock()
rwmutex.RUnlock()
rwmutex.lock()
rwmutex.Unlock()
```

```go
var wg sync.WaitGroup
wg.Add(1)
go func() {
    ...
    wg.Done()
}()
wg.Wait()
```

```go
type _Struct struct {...}
var structPool = sync.Pool {
    New: func() interface{} {
        return &_Struct{}
    }
}
...
sp := structPool.Get().(*_Struct)
...
structPool.Put(sp)
...
```

```go
var once sync.Once
onceBody := func() {
    fmt.Println("Only once")
}
for i := 0; i < 10; i++ {
    go func() {
        once.Do(onceBody) // 只会执行一次，且 Do返回后可以确保第一次执行完毕
    }()
}
```

#### atomic

```go
AddInt32(addr *int32, delta int32) (new int32)
CompareAndSwapInt32(addr *int32, old, new int32) (swapped bool)
LoadInt32(addr *int32) (val int32)
StoreInt32(addr *int32, val int32)
SwapInt32(addr *int32, new int32) (old int32)
```

> 不推荐使用这个包，尽量使用 sync 包中的 API 。

### math

### errors

```go
New(string) error
// fmt.Errorf("%w xxx", _error) 包装 _error
Unwrap(error) error // 解包
Is(error, error) bool // 判断前者里是否包装着后者
```



### context

```go
var ctx, cancel = context.WithCancel(context.Background())
go func() {
    for {
        select {
            case <- ctx.Done():
            	return
            default:
            	...
        }
    }
}
...
cancel() // 通知协程停止
```

```go
Background() Context
WithCancel(Context) (Context, CancelFunc)
WithTimeout(Context, time.Duration) (Context, CancelFunc)
WithDeadline(Context, time.Time) (Context, CancelFunc)
	Deadline() (deadline time.Time, ok bool)
	Done() <-chan struct{}
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

### testing

`*_test.go` 文件用于 `go test` 测试

```sh
$ go test -v
$ go test -run "xx/xx"
$ go test -bench "xx/xx"
```

#### TestMain

```go
func TestMain(m *testing.M) {
    ... // before
    ret := m.Run() // 执行测试，包括单元测试、性能测试和示例测试
    ... // after
    os.Exit(ret)
}
```

#### TestXxx

```go
func TestXxx(t *testing.T) {
    t.Log("xxx") // 日志
    t.Error("xxx") // 错误日志
    t.Fail() // 标记不通过
    f.FailNow() // 标记不通过，且立即停止执行
    ...
    t.Run("_name", func(t *testing.T) {...})
}
```

#### BenchmarkXxx

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

