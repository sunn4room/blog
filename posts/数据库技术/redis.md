---
date: 2020-06-23 21:52:41
tags:
- 学习笔记
- redis
---

# Redis 学习笔记

Redis 是一个开源的分布式的基于内存的高性能 k - v 数据库

<!-- more -->

- value 有五种数据结构 string、hash、list、set、sorted set 
- 支持事务、集群部署、数据持久化、订阅/发布、原子性操作等特性
- Redis 使用 C 语言开发，可运行在 Linux、BSD、OS X 等。

## Redis 配置

```ini
# redis.conf

# 密码
requirepass xxx
# 端口
port 6379
# 限制来访ip
bind 192.168.1.100 10.0.0.1
# 客户端闲置秒数上限
timeout 0
# debug -> verbose -> notice -> warning
loglevel notice
# RDB自动持久化(注意是触发 bgsave 命令)
save 900 1
save 300 10
save 60 10000
# 关闭RDB自动持久化
save ""
# RDB文件名
dbfilename dump.rdb
# 是否开启增量持久化（可能导致持久化文件过大）
appendonly no
# AOP文件名
appendfilename appendonly.aof
# 增量持久化频率
# always   不缓冲
# everysec 每一秒清空缓冲
# no       缓冲满后再清空
appendfsync everysec
# rewrite期间是否可以fsync
no-appendfsync-on-rewrite no
# 当前AOF文件大小是上次日志重写得到AOF文件大小的二倍（设置为100）时，自动启动新的日志重写过程
auto-aof-rewrite-percentage 100
# rewrite最小限制
auto-aof-rewrite-min-size 64mb
# 持久化路径
dir ./
# 配置主redis地址和端口
replicaof x.x.x.x 6379
# 主redis密码
masterauth xxx
# 从连不上主时，是否处理请求
replica-serve-stale-data yes
# 连接数上限
maxclients 100
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
maxmemory 2mb
# 内存满后的数据淘汰策略
# volatile-lru     只对设置了过期时间的key进行LRU
# allkeys-lru      LRU
# volatile-lfu     只对设置了过期时间的key进行LFU
# allkeys-lfu      LFU
# volatile-random  随机删除即将过期key
# allkeys-random   随机删除
# volatile-ttl     删除即将过期的
# noeviction       永不过期，返回错误
maxmemory-policy noeviction
# 开启集群功能
cluster-enabled yes
# 集群通信超时毫秒数
cluster-node-timeout 15000
```

## 命令行客户端

```sh
$ redis-server /path/to/redis.conf
```

> 配置项也可以通过命令行传递，例如：
>
> ```sh
> $ redis-server --port 6380 --slaveof 127.0.0.1 6379
> ```
>
> 在运行期可以通过 `CONFIG SET` 来修改部分配置项，`CONFIG GET` 查看配置项
>
> ```sh
> redis> config get *
> redis> config get *max-*-entries*
> redis> config get port
> redis> config set save "900 1 300 10"
> ```

```sh
$ redis-cli -h 127.0.0.1 -p 6379 -a ***
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

> string 类型是二进制安全的，最大 512M

> string 类型是其他类型的基础

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

RDB 是把当前内存中的数据集快照写入磁盘。

#### 备份

- 自动触发：在配置文件中 `save <duration> <changed-keys-count>`
- 手动触发：`SAVE` 阻塞 `BGSAVE` 非阻塞（fork）

#### 恢复

只需要在备份路径上有快照文件即可被加载恢复，注意这里的恢复是阻塞的。

### AOF

AOF 则是通过保存Redis服务器所执行的写命令来记录数据库状态。

#### 备份

为了提高性能，设置了 AOF 缓冲区，满足一定条件后才进行 AOF，

时间长了，AOF 文件可能会过大，因此引入 rewrite 机制：直接读取服务器现有的键值对，然后用一条命令去代替之前记录这个键值对的多条命令，生成一个新的文件后去替换原来的 AOF 文件。这个处理是在子进程中进行的，非阻塞。

#### 恢复

当开启 AOF 后，将采用 AOF 恢复数据而不是 RDB

## Redis 集群

### 主从复制

#### 全量同步

发生在Slave初始化阶段

1. 从服务器连接主服务器，发送SYNC命令； 
2. 主服务器接收到SYNC命名后，开始执行BGSAVE命令生成RDB文件并使用缓冲区记录此后执行的所有写命令； 
3. 主服务器BGSAVE执行完后，向所有从服务器发送快照文件，并在发送期间继续记录被执行的写命令； 
4. 从服务器收到快照文件后丢弃所有旧数据，载入收到的快照； 
5. 主服务器快照发送完毕后开始向从服务器发送缓冲区中的写命令； 
6. 从服务器完成对快照的载入，开始接收命令请求，并执行来自主服务器缓冲区的写命令；

#### 增量同步

Redis增量复制是指Slave初始化后开始正常工作时主服务器发生的写操作同步到从服务器的过程。增量复制的过程主要是主服务器每执行一个写命令就会向从服务器发送相同的写命令，从服务器接收并执行收到的写命令。

#### 延迟问题

### 哨兵监控



### 槽位分配

redis 为了适应更高的并发要求，引入“槽位”的概念：预先安排了序号为 0-16383 的槽位，并分配给多个节点，每个数据都会通过 hash 函数计算出一个槽位序号，并存储都对应的节点上。

#### 初始化流程

#### 新增节点流程

#### 删除节点流程

## Redis 内存管理

### 过期策略

- 惰性删除：所有键读写命令执行之前都会调用 expireIfNeeded 函数对其进行检查，如果过期，则删除该键，然后执行键不存在的操作；未过期则不作操作，继续执行原有的命令
- 定期删除：都从一定数量的数据库中取出一定数量的随机键进行检查，并删除其中的过期键

### 删除策略

- volatile-lru  利用LRU算法移除设置过过期时间的key (LRU:最近使用 Least Recently Used ) 
- allkeys-lru  利用LRU算法移除任何key （和上一个相比，删除的key包括设置过期时间和不设置过期时间的）。**通常使用该方式**
- volatile-random 移除设置过过期时间的随机key 
- allkeys-random 无差别的随机移除。
- volatile-ttl  移除即将过期的key(minor TTL) 
- noeviction 不移除任何key，只是返回一个写错误 ，**默认选项**

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

Redis中一个热点key在失效的同时，大量的请求过来，从而会全部到达数据库，压垮数据库。

- **设置热点数据永不过期**：对于某个需要频繁获取的信息，缓存在Redis中，并设置其永不过期。当然这种方式比较粗暴，对于某些业务场景是不适合的。
- **定时更新**：比如这个热点数据的过期时间是1h，那么每到59minutes时，通过定时任务去更新这个热点key，并重新设置其过期时间。
- **互斥锁**：在Redis中根据key获得的value值为空时，先锁上，然后从数据库加载，加载完毕，释放锁。若其他线程也在请求该key时，发现获取锁失败，则睡眠一段时间（比如100ms）后重试。

#### 缓存穿透

缓存和数据库中都没有的数据，可用户还是源源不断的发起请求，导致每次请求都会到数据库，从而压垮数据库。

- **业务层校验**：用户发过来的请求，根据请求参数进行校验，对于明显错误的参数，直接拦截返回。
- **不存在数据设置短过期时间**：对于某个查询为空的数据，可以将这个空结果进行Redis缓存，但是设置很短的过期时间，比如30s。
- **布隆过滤器**：对于缓存击穿，我们可以将查询的数据条件都哈希到一个足够大的布隆过滤器中，用户发送的请求会先被布隆过滤器拦截，一定不存在的数据就直接拦截返回了，从而避免下一步对数据库的压力。

#### 缓存雪崩

Redis中缓存的数据大面积同时失效，或者Redis宕机，从而会导致大量请求直接到数据库，压垮数据库。

- **设置有效期均匀分布**：避免缓存设置相近的有效期，我们可以在设置有效期时增加随机值。
- **数据预热**：对于即将来临的大量请求，我们可以提前走一遍系统，将数据提前缓存在Redis中，并设置不同的过期时间。

#### 缓存更新策略

删缓存 - 更新数据库 - 删缓存

### 分布式锁



### 消息队列



### 布隆过滤器

redis 可以用来实现布隆过滤器，即一种可以判断大量数据 “一定不存在和可能存在” 的数据结构

## Java 客户端

### Jedis

### Spring Data Redis

## Go 客户端

