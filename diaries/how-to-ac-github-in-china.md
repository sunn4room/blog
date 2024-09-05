# 如何在国内优化 github 访问速度

众所周知，github 在国内遭到了 DNS 污染，使得其访问很慢且不稳定，有时候甚至打不开网页。

```bash
# 使用国内服务查询github
dig +short @114.114.114.114 github.com
# 使用国外服务查询github
dig +short @1.1.1.1 github.com
```

```
20.205.243.166
140.82.116.3
```

可以看出两个查询结果是不一样的。如何解决这个问题呢？这里有两个方法。

- 最简单粗暴的方法就是配置一个国外的 DNS 地址，常用的有 `1.1.1.1`、`9.9.9.9`。
- 上一个方法有一个缺点，那就是如果配置了国外的 DNS 地址，那么国内网站的访问速度就会下降，这时候就需要为指定域名配置专属的 DNS 地址。
  - linux 用户可以在本地启动一个 dnsmasq 服务并将 DNS 地址配置为 `127.0.0.1`，我的 dnsmasq 配置是
    ```
    server=/github.com/1.1.1.1
    server=/github.io/1.1.1.1
    server=/githubusercontent.com/1.1.1.1
    server=/githubassets.com/1.1.1.1
    server=/githubstatus.com/1.1.1.1
    server=114.114.114.114
    server=223.5.5.5
    ```
  - windows 用户可以浏览这个网址
    `https://blog.csdn.net/Lumiadragon/article/details/131360096`
