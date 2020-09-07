---
date: 2020-09-01 20:32:18
tags:
- service-mesh
- microservice
---

# Istio 学习笔记

istio 作为 k8s 系统的附件，是服务网格化的实践者，提供了跨平台的无侵入的微服务连接、治理、安全和监控特性。

<!-- more -->



## 架构

- Istio 本身并不提供服务发现功能，依赖于底层平台，比如 k8s 的服务和端点
- Pilot 组件监视底层的服务和端点，并即时维护自己的服务注册表
- istio 的 pod 代理监视服务注册表，生成自己的配置

## 部署

## 新增资源

### Gateway

类似 k8s 的 Ingress 组件，istio 也提供了 ingressgateway 组件来接管外界流量，pod 中只有 Envoy 代理容器，由 Gateway 资源配置 4-6 层负载平衡属性，例如要公开的 port 和 tls 设置等，而将 L7 层（即应用层）流量路由使用 Istio 虚拟服务（virtual service）绑定网关来实现。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: xxx
spec:
  selector:
    istio: ingressgateway # 使用istio默认提供的组件，够用了，也可以自定义包含proxy的pod的标签
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - xxx.com # 支持的虚拟主机列表,“*”表示不限制
  - port:
      number: 443
      name: https
      protocol: HTTPS
    hosts:
    - xxx.com # 支持的虚拟主机列表
    tls:
      mode: SIMPLE/MUTUAL
      serverCertificate: /tmp/tls.crt
      privateKey: /tmp/tls.key
      caCertificates: /tmp/tls.crt
```

> 必须和 VirtualService 绑定，才能生效

### VirtualService

VirtualService 是对 k8s 的 Service 的加强，实现更加复杂、丰富、细粒度的流量路由分发。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: xxx
spec:
  hosts:
  - xxx # service名 或 gateway 的虚拟主机 或 service entry 的外部地址
  gateways:
  - xxx
  http:
  - match:
    - port: xx
    - uri:
        prefix: /xxx
    - queryParams:
        xxx:
          exact: xxx
    - method:
        exact: GET
    - headers:
        xxx:
          exact: xxx
    - authority:
        exact: xxx
    rewrite: # 重写相关信息
      uri: "/xxx"
    corsPolicy: # CORS
      allowOrigin:
      - example.com
      allowMethods:
      - POST
      - GET
      allowCredentials: false
      allowHeaders:
      - X-Foo-Bar
      maxAge: "24h"
    route: # 配置真实路由地址
    - destination:
        host: xxx #
        subset: xxx # 路由规则的子集名
      weight: xx
    mirror: # 镜像流量，响应会被丢弃
      host: httpbin
      subset: v2
    mirror_percent: 100 # 镜像百分比
    redirect:
      uri: /xxx
    timeout: 5s # 超时
    retries: # 重试
      attempts: 3
      perTryTimeout: 2s
    fault: # 故障注入用于测试
      abort:
        percentage:
          value: 0.1
        httpStatus: 400
      delay:
        percentage:
          value: 0.1
        fixedDelay: 5s
  
  tls:
  - match:
    - port: 443
    route:
    - destination:
        host: xxx
  
  tcp:
  - match:
    - port: 31400
    route:
    - destination:
        host: tcp-echo
        port:
          number: 9000
        subset: v1
      weight: 80
    - destination:
        host: tcp-echo
        port:
          number: 9000
        subset: v2
      weight: 20
```

### DestinationRule

定制个性化的流量策略，并且可以定义目标子集，配合 VirtualService 使用

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: xxx
spec:
  host: xxx # service名
  trafficPolicy:
    connectionPool: # 链接池
      http:
        http1MaxPendingRequests: xx # 允许等待的最大请求数
        maxRequestsPerConnection: xx # 每次连接的最大请求数
    outlierDetection: # 一种断路器实现，异常检测并排除出服务列表
      interval: 5m # 时间间隔
      consecutiveErrors: 7 # 间隔内失败次数上限
      maxEjectionPercent: 10% # 间隔内失败百分比上限
      baseEjectionTime: 15m # 熔断时长
    loadBalancer:
      simple: RANDOM/LEAST_CONN/ROUND_ROBIN
    portLevelSettings: # 端口单独生效
    - port:
        number: xx
      loadBalancer:
        simple: xxx
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
    trafficPolicy: # 子集单独生效
      ...
  - name: v3
    labels:
      version: v3
```

### ServiceEntry

接入外部服务

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: xxx
spec:
  hosts:
  - api.dropboxapi.com
  - www.googleapis.com
  - api.facebook.com
  location: MESH_EXTERNAL
  ports:
  - number: 443
    name: https
    protocol: TLS
  resolution: DNS
```

> 也可以将流量发送给 egressgateway 并对外访问，具体做法略。

### Sidecar

- 微调 Envoy 代理接受的端口和协议集。
- 限制 Envoy 代理可以访问的服务集合。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Sidecar
metadata:
  name: default
  namespace: bookinfo
spec:
  egress:
  - hosts:
    - "./*"
    - "istio-system/*"
  ingress:
  - hosts:
    - "./*"
    - "istio-system/*"
```

