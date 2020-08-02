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
use <user> <group>;
worker_processes <num>;

error_log <log-file> debug/info/notice/warn/error/erit;

pid <pid-file>;

events {
    use epoll;
    worker_connections <num>;
}

http {
    include mime.types;
    default_type application/octet-stream;

    log_format <fmt-name> xxx;
    access_log <access-log-file> <fmt-name>;

    sendfile on;

    keepalive_timeout <sec-num>;

    gzip on;

    upstream <upstream-str> {
        ip_hash;
        least_conn;
        server <host>:<port> weight=x;
        server <host>:<port> weight=x;
    }

    include <external-http-config>;

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
            index <index-html-file>;

            proxy_pass http://<upstream-str>;
        }

        location = <精确uri> {
            ...
        }

        location ~ <正则uri> { # 后缀写法   \.<后缀>$
            ...
        }
        # 优先级: 精确>正则>前缀
    }

}
```
