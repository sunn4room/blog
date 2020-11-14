---
date: 2020-11-14
tags:
- java
- DI
- 学习笔记
---

# Guice 学习笔记

Guice 是一个超轻量级的专注于 DI (dependency injection) 的框架，由 Google 开发。

<!-- more -->

## Hello Guice

```java
public interface Food {}

public class Apple implements Food {
    @Override
    public String toString() {
        return "apple";
    }
}
```

```java
public interface Person {
    void eat();
}

public class RealPerson implements Person {
    private Food food;

    @Inject
    public RealPerson(Food food) {
        this.food = food;
    }
    
    public void eat() {
        System.out.println("I'm eating " + this.food);
    }
}
```

```java
public DemoModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(Food.class).to(Apple.class);
        bind(Person.class).to(RealPerson.class);
    }
}
```

```java
public class Demo {
    public static void main(String[] args) {
        Injector injector = Guice.createInjector(new DemoModule());
        Person person = injector.getInstance(Person.class);
        person.eat(); // I'm eating apple
    }
}
```

## 类型绑定

```java
// Module
void configure() {
    bind(A.class).to(B.class)
}

// or

@Providers
A a(B b) {
    return b;
}
```

```java
// use
injector.getInstance(A.class);

// or

@Inject
public Xxx(A.class) {
    // ...
}
```

> 当绑定类型和被绑定类型一致且非接口和非抽象的话，默认可以不做任何显示绑定，即可得到相关实例。

## 注解绑定

```java
// Module
void configure() {
    bind(A.class).annotatedWith(Names.named("xxx")).to(B.class)
}

// or

@Providers
@Named("xxx")
A a(B b) {
    return b;
}
```

```java
// use
injector.getInstance(Key.get(A.class, Names.named("xxx")));

// or

@Inject
public Xxx(@Named("xxx") A a) {
    // ...
}
```

### 常量绑定

```java
// Module
void configure() {
    bindConstant().annotatedWith(Names.named("xxx")).to("xxx xxx")
}

// or

@Providers
@Named("xxx")
String str() {
    return "xxx xxx";
}
```

## Provider 绑定

```java
// Provider implementation
public class XxxProvider implements Provider<Xxx> {
  // ...

  @Inject
  public XxxProvider(Xxx xxx...) {
    // ...
  }

  @Override
  public Xxx get() {
    // ...
  }
}
```

```java
// Module
protected void configure() {
    bind(Xxx.class).toProvider(XxxProvider.class);
}
```

> 这种形式等价于 @Providers 的注解形式

## 单例模式

```java
// Module
protected void configure() {
    bind(Xxx.class).to(Xxx.class).in(Singleton.class);
}

// or

@Provides
@Singleton
Xxx provideTransactionLog(Xxx xxx) {
    // ...
}
```