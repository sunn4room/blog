---
title: Nginx 学习笔记
date: 2020-05-23 00:17:45
updated: 2020-05-23 00:17:45
tags:
- 学习笔记
- nginx
- load balance
- http
---

Nginx 是一个高性能的 http 和 反向代理的 web 服务器，占用内存少，并发能力强

<!-- more -->

## 常用命令

```sh
nginx -v
nginx
nginx -s stop
nginx -s reload
```

## nginx.conf

```nginx
use <user> <group>; # 指定nginx进程所属
worker_processes <num>/auto; # 指定nginx子进程数
error_log <log-file> debug/info/notice/warn/error/erit; # 存储日志到文件
pid <pid-file>; # 存储pid到文件

events {
    use epoll; # 线程轮询方式
    worker_connections <num>; # 连接数上限
}

http {
    types {
        xxx xxx;
    }
    default_type application/octet-stream;

    log_format <fmt-name> xxx; # 日志格式
    access_log <access-log-file> <fmt-name>; # 访问日志

    sendfile on/off; # 是否开启高效文件传输模式

    keepalive_timeout <sec-num>; # 长连接超时时间

    gzip on/off; # 是否开启数据压缩传输
    
    include <external-http-config>;

    upstream <upstream-str> {
        ip_hash/least_conn;
        server <host>:<port> weight=x;
        server <host>:<port> weight=x;
    }

    server {
        listen <port>;
        server_name <host>;

        charset utf-8;

        access_log <access-log-file> <fmt-name>;

        error_page <status-nums> <error-html-file>;

        ssl_certificate <pem-file>;
        ssl_certificate_key <key-file>;

        location <前缀uri> {
            root <root-folder>;
            index <index-file>;
            autoindex on; # 列表展示所有

            proxy_pass http://<host>:<port>...; # 反向代理
            # - 如果proxy_pass配置值包含 / 就去掉匹配路径部分
			# - 如果proxy_pass配置值不包含 / 就保留匹配路径部分
            # 反向代理时，针对一个用户请求，nginx需要维护两个链接，一个是连用户，一个是连后台服务，所以并发能力会减半
        }

        location = <精确uri> {
            ...
        }

        location ~ <正则uri> { # 后缀写法   \.<后缀>$
            ...
        }
        
        location ^~ <优先前缀uri> { # 直接处理，不测试正则
            ...
        }
        # 优先级: 精确>正则>前缀
        # - 先判断精准命中，如果命中，立即返回结果并结束解析过程。
        # - 判断普通命中，如果有多个命中，“记录”下来“最长”的命中结果（记录但不结束，最长的为准）。
        # - 继续判断正则表达式的解析结果，按配置里的正则表达式顺序为准，由上至下开始匹配，一旦匹配成功1个，立即返回结果，并结束解析过程。
        # - 普通命中顺序无所谓，是因为按命中的长短来确定。正则命中，顺序有所谓，因为是从前入往后命中的。
    }

}
```
