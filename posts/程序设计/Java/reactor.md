---
title: Reactor 学习笔记
date: 2020-08-07 15:40:09
tags:
- 学习笔记
- java
- reactive
---

Reactor 是 Reactive Streams 的实现者，全面支持了非阻塞的反应式编程机制。

<!-- more -->

## Reactive Streams 标准

```java
//发布者
public  interface  Publisher < T > {
	public  void  subscribe（Subscriber <？super  T >  s）;
}

//订阅者
public  interface  Subscriber < T > {
	public  void  onSubscribe（Subscription  s）;
	public  void  onNext（T  t）;
	public  void  onError（Throwable  t）;
	public  void  onComplete（）;
}

//下发器
public interface Subscription {
	public void request(long n);
	public void cancel();
}
```

