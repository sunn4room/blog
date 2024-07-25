# Rust

Rust 作为未来 C++ 的替代者，可以在编译期保证内存安全。

## Hello World

```rust
fn main() { // main 函数是 rust 程序入口
    println!("hello world");
}
```

## 注释

```rust
// 单行注释

/* 单行注释 */

/*
 * 多行注释
 * 多行注释
 * 多行注释
 */

/// 文档注释
```

## 表达式与语句

```rust
fn main() {
    let y = {
        let x = 3;
        x + 1
    };
    println!("The value of y is: {y}");
}
```

## 常量与变量

```rust
fn main() {
    const MY_CONST: i32 = 0; // 常量，类型必须显式指定，值必须在编译期确定
    let my_var: i32 = 1; // 不可变变量
    let mut my_mut_var: i32 = 2; // 可变变量
    my_mut_var = 3; // 修改可变变量
    println!("{} {} {}", MY_CONST, my_var, my_mut_var);
}
```

### 所有权

- Rust 中的每一个值都有一个变量作为所有者。
- 值在任一时刻有且只有一个所有者。
- 当所有者离开作用域，这个值将被丢弃。

```rust
fn main() {
    let s = String::from("hello"); // s 拥有 hello 的所有权
    println!("{}", s); // 打印 s
    // s 被丢弃，String 类型实现了 Drop 特性，这里会隐式调用其 drop 方法，释放堆内存
}
```

### 所有权转移

```rust
fn main() {
    let s1 = String::from("hello");
    {
        let s2 = s1; // String 类型没有实现 Copy 特征，将 hello 的所有权转移至 s2
        println!("{}", s2); // 打印s2
        // s2 被丢弃
    }
    // s1 丧失所有权
}
```

### 引用

```rust
fn main() {
    let mut s = String::from("hello");
    {
        let r1 = &s; // s 被不可变引用为 r1，hello 的所有权依然属于 s
        println!("{}", r1); // 打印 r1，这里会自动解引用
    }
    {
        let r2 = &mut s; // s 被可变借用为 r2，可变借用具有独占性
        r2.push_str(" world"); // 调用方法，这里会自动解引用
        println!("{}", r2);
    }
    // s 被丢弃
}
```

### 再引用

```rust
fn main() {
    let mut i: i32 = 0;
    let r1 = &mut i;
    let r2: &mut i32 = r1;
    *r2 = 1;
    println!("{}", r2);
    *r1 = 2;
    println!("{}", r1);
    i = 3;
    println!("{}", i);
}
```

## 流程控制

### if

```rust
fn main() {
    let n = 1;
    if n > 0 {
        println!("n > 0");
    } else if n < 0 {
        println!("n < 0");
    } else {
        println!("n = 0");
    }

    // 当具有 else 时，if 表达式是有值的，可以和 let 结合使用
    let r = if n >= 0 {
        n
    } else {
        -n
    };
    println!("{}", r);
}
```

### loop

```rust
fn main() {
    let mut count = 0;
    loop {
        count += 1;
        println!("count: {}", count);
        if count >= 7 {
            break;
        }
    }

    // loop 表达式是有值的
    let r = loop {
        if count < 3 {
            break count;
        }
        count -= 3;
    }
    println!("leave {}", r);
}
```

### while

```rust
fn main() {
    let mut i = 3;
    while i > 0 {
        println!("{}", i);
        i -= 1;
    }
}
```

### for

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];
    for e in a { // 目标必须实现 Iterator 或者 IntoIterator
        println!("{}", e);
    }
}
```

### panic!

```rust
fn main() {
    // 程序终止运行
    panic!("crash and burn");
}
```

## 基本类型

```rust
fn main() {
    // 整型
    // 无符号 u8, u16, u32, u64, u128, usize
    // 有符号 i8, i16, i32, i64, i128, isize
    // 默认为 i32
    let mut my_int: i32;
    my_int= 99;
    my_int = 0b11;
    my_int = 0o77;
    my_int = 0xff;
    my_int = 123_456;
    my_int = 1_i32

    // 浮点型 f32, f64
    // 默认为 f64
    let mut my_float: f64;
    my_float = 3.0;

    // 布尔型(8bit) bool
    let mut my_bool: bool;
    my_bool = true;
    my_bool = false;

    // 字符型(32bit) char
    let mut my_char: char;
    my_char = 'a';
    my_char = '中';
}
```

## 元组

```rust
fn main() {
    let t: (i32, bool) = (0, false);
    println!("{} {}", t.0, t.1);
}
```

## 数组

```rust
fn main() {
    let arr: [i32; 3] = [1, 2, 3];
    println!("{} {} {}", arr[0], arr[1], arr[2]);
}
```

## 函数

```rust
fn largest(a: i32, b: i32) -> i32 {
    if a > b {
        a
    } else {
        b
    }
}
```

> largest 的类型是 `fn(i32, i32) -> i32` ，代表一个函数指针

## 结构体

```rust
struct User {
    username: String,
    email: String,
}

impl User {
    fn new(username: String) -> User {
        let mut email = username.clone();
        email.push_str("@google.com");
        User { username, email }
    }
    fn print(&self) {
        println!("{}: {}", self.username, self.email);
    }
    fn set(&mut self, username: String) {
        let mut email = username.clone();
        email.push_str("@google.com");
        self.username = username;
        self.email = email;
    }
    fn get(self) -> String {
        self.username
    }
}

struct Color(u32, u32, u32);

fn main() {
    let u1 = User {
        username: String::from("foo"),
        email: String::from("foo@google.com"),
    };
    u1.print();

    let User { username: username, email: email } = u1;
    // 可简化为 let User { username, email } = u1;
    println!("{}: {}", username, email);

    let username = String::from("foo");
    let u2 = User {
        username,
        email: String::from("foo@google.com"),
    };
    u2.print();

    let u3 = User {
        username: String::from("foofoo"),
        ..u2
    };
    u3.print();

    let mut u4 = User::new(String::from("foo"));
    u4.set(String::from("foofoo"));
    u4.print();
    // TODO partial move and borrow

    let black = Color(0, 0, 0);
    println!("{} {} {}", black.0, black.1, black.2);
    let Color(c1, c2, c3) = black;
    println!("{} {} {}", c1, c2, c3);
}
```

## 枚举

```rust
enum Shape {
    Dot,
    Circle(u32),
    Rectangle { width: u32, height: u32 },
}

fn main() {
    let s = Shape::Rectangle {
        width: 2,
        height: 4,
    };

    match s {
        Shape::Dot => println!("dot"),
        Shape::Circle(r) => println!("circle with {}", r),
        Shape::Rectangle { width, height } => println!("rectangle with {} {}", width, height),
    }
}
```

if let & while let 处理枚举

```rust
fn main() {
    let mut o: Option<i32> = Some(1);
    while let Some(i) = o {
        println!("{}", i);
        if i == 3 {
            o = None;
        } else {
            o = Some(i + 1);
        }
    }
    println!("end")
}
```

## 泛型

```
fn my_fn<T>(arg: T) {
    // ...
}

struct MyStruct<T> {
    // ...
}

enum MyEnum<T> {
    // ...
}

impl<T> ... {
    // ...
}
```

### 特征

```rust
trait Summary {
    type Author;

    fn summarize_author(&self, author: Author) -> String;

    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

struct Tweet;

impl Summary for Tweet {
    type Author = String;

    fn summarize_author(&self, author: Self::Author) -> String {
        format!("@{}", author)
    }
}

pub fn notify<T: Summary>(item: T) { // fn notify(item: impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

fn main() {
    notify(Tweet { username: String::from("foo") });
}
```

### 生命周期

引用变量的生命周期不应该超过被引用变量的生命周期，因此生命周期约束是很有必要的。

```rust
fn largest<'a, 'b, 'c>(a: &'a i32, b: &'b i32) -> &'c i32
where
    'a: 'c,
    'b: 'c,
{
    if a > b {
        a
    } else {
        b
    }
}

fn main() {
    let a = 1;
    let ar = &a;
    {
        let b = 2;
        let br = &b;
        let cr = largest(ar, br);
        println!("{}", cr);
    }
}
```

## 类型别名

```rust
type MyResult<T> = Result<T, u32>;
```

## 动态类型

Rust 中有的类型不能在编译器确定其内存大小，需要使用胖指针包装成内存大小确定的类型。

### 切片

```rust
fn main() {
    let l1 = [1, 2, 3];
    let mut r: &[i32] = &l1;
    println!("{}", r.len());
    let l2 = [1, 2, 3, 4];
    r = &l2;
    println!("{}", r.len());
}
```

### 特征对象

```rust
trait Animal {
    fn print_name(&self);
}

struct Cat;
impl Animal for Cat {
    fn print_name(&self) {
        println!("Cat");
    }
}

struct Dog;
impl Animal for Dog {
    fn print_name(&self) {
        println!("Dog");
    }
}

fn main() {
    let mut v: Vec<Box<dyn Animal>> = Vec::new();
    v.push(Box::new(Cat {}));
    v.push(Box::new(Dog {}));
    for a in v {
        a.print_name();
    }
}
```

> 对象安全 TODO

## 模块

```rust
mod internal_mod {
    // pub 表示可以被模块外部代码访问
    // pub 可以修饰模块、函数、结构体、枚举、字段、方法等
    pub fn print_hello() {
        do_print_hello();
    }

    // 默认都是不能被模块外部代码访问
    fn do_print_hello() {
        println!("hello");
    }
}

mod external_mod;
/* external_mod.rs 或者 external_mod/mod.rs
pub fn print_hello() {
    do_print_hello();
}
fn do_print_hello() {
    println!("hello");
}
*/

use internal_mod::print_hello;

fn main() {
    internal_mod::print_hello();
    external_mod::print_hello();

    print_hello(); // this is internal!
}
```
