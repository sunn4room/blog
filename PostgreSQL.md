---
title: PostgreSQL 学习笔记
date: 2020-06-21 10:07:42
updated: 2020-06-21 10:07:50
categories:
- 数据库
- SQL
tags:
- 学习笔记
- PostgreSQL
- SQL
---

PostgreSQL 是一个开源的对象关系型数据库

<!-- more -->

## 入门

### 架构

软件采用 C/S 架构：

- 一个服务器进程，它管理数据库文件、接受来自客户端应用与数据库的联接并且代表客户端在数据库上执行操作。 该数据库服务器程序叫做`postgres`
- 客户端形式多样，可以是命令行、图形 APP、网页 APP 等，当建立连接后会开启一个新进程`forks`，并与`postgress`进程进行交互完成数据库操作

### 命令行工具

```sh
$ createdb [-U _pg-user] _db-name
$ dropdb [-U _pg-user] _db-name
$ psql [-U _pg-user] _db-name
_db-name=> \h
_db-name=> _sql
_db-name=> \i _sql-file
_db-name=> \q
```

