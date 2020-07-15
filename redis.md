---
title: Redis 学习笔记
date: 2020-06-23 21:52:41
categories:
- 数据库
tags:
- 学习笔记
- redis
---

Redis 是一个开源的基于内存的 k - v 数据库，其中 value 有五种数据结构 string、hash、list、set、sorted set ，支持事务、集群部署、数据持久化、订阅/发布、原子性操作等特性。Redis 使用 C 语言开发，可运行在 Linux、BSD、OS X 等。

<!-- more -->

## Redis 配置

- `port <port>`
- `slaveof <ip> <port>`
- `maxclients <num>`
- `maxmemory <bytes>`
- `maxmemory-policy <policy>`

## 命令行客户端

```shell
redis-cli -h host -p port -a password
```

### key 命令

```bash
DEL key
EXISTS key
EXPIRE key seconds
KEYS pattern
MOVE key db
PERSIST key # 移除过期时间
TTL key # 剩余过期时间
RENAME key newkey
RENAMENX key newkey
TYPE key
```

### String 命令

```bash
SET key value
SETNX key value
SETEX key seconds value
SETRANGE key offset value
GET key
MGET key1 [key2..]
GETBIT key offset
GETRANGE key start end
GETSET key value # 将给定 key 的值设为 value ，并返回 key 的旧值
STRLEN key
INCR key
DECR key
APPEND key value
```

### Hash 命令

```bash
HSET key field value
HSETNX key field value
HGET key field
HGETALL key
HVALS key
HDEL key field2 [field2]
HEXISTS key field
HKEYS key
HVALS key
HLEN key
HSETNX key field value
```

### List 命令

```bash
LPUSH key value
LPUSHX key value # 当且仅当 key 存在并且是一个列表
RPUSH key value
RPUSHX key value # 当且仅当 key 存在并且是一个列表
LSET key index value
LPOP key
RPOP key
BLPOP key timeout
BRPOP key timeout
LINDEX key index
LRANGE key start stop
LREM key count value # 根据参数 count 的值，移除列表中与参数 value 相等的元素
LTRIM key start stop # 修剪
LLEN key
```

### Set 命令

```bash
SADD key member [member ...]
SMEMBERS key
SISMEMBER key member
SMOVE source destination member
SREM key member [member ...]
SRANDMEMBER key
SPOP key # 移除并返回集合中的一个随机元素
SCARD key # 元素数量
SDIFF key [key ...] # 第一个集合与后面所有集合的差集
SDIFFSTORE destination key [key ...]
SINTER key [key ...] # 所有集合的交集
SINTERSTORE destination key [key ...]
SUNION key [key ...] # 所有集合的并集
SUNIONSTORE destination key [key ...]
```

### SortedSet 命令

```bash
ZADD key score member [[score member] [score member] ...]
ZSCORE key member
ZRANGE key start stop [WITHSCORES]
ZREVRANGE key start stop [WITHSCORES]
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]
ZRANK key member
ZREVRANK key member
ZREM key member [member ...]
ZREMRANGEBYRANK key start stop
ZREMRANGEBYSCORE key min max
ZINCRBY key increment member # 为有序集 key 的成员 member 的 score 值加上增量 increment
ZCARD key # 元素数量
ZCOUNT key min max
ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
```

### Pub/Sub 命令

```bash
PUBLISH channel message
SUBSCRIBE channel [channel ...]
PSUBSCRIBE pattern [pattern ...]
UNSUBSCRIBE [channel [channel ...]]
PUNSUBSCRIBE [pattern [pattern ...]]
```

### 事务命令

```bash
MULTI # 标记一个事务块的开始
WATCH key [key ...] # 监视指定key，如果在事务执行之前这个(或这些) key 被其他命令所改动，那么事务将被打断
UNWATCH # 取消 WATCH 命令对所有 key 的监视
DISCARD # 取消事务
EXEC # 开始执行
```

## Redis 持久化

### RDB

### AOF

## Redis 集群

### 主从复制

### 哨兵监控

### 槽位分配

## Redis 内存管理

### 过期策略

### 删除策略

## Redis 线程模型

Redis是基于内存的操作，CPU不是Redis的瓶颈，Redis的瓶颈最有可能是机器内存的大小或者网络带宽。既然单线程容易实现，而且CPU不会成为瓶颈，那就顺理成章地采用单线程的方案。

- 内存操作本身就非常快
- 采用哈希构造数据，查找复杂度 O(1)
- 避免了不必要的上下文切换和竞争条件，也不存在多进程或者多线程导致的切换而消耗 CPU，不用去考虑各种锁的问题，不存在加锁释放锁操作，没有因为可能出现死锁而导致的性能消耗
- 使用多路I/O复用模型

> 为了充分发挥多核 CPU 的性能优势，可以启动多个 Redis 实例。

## 应用场景

### 缓存

#### 缓存击穿

#### 缓存穿透

#### 缓存雪崩

#### 缓存更新策略

删缓存 - 更新数据库 - 删缓存

### 分布式锁

### 消息队列

### 布隆过滤器

## Java 客户端

### Jedis

### Spring Data Redis



