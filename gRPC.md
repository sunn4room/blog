---
title: gRPC 学习笔记
date: 2020-05-24 17:56:40
updated: 2020-05-24 17:56:52
categories:
  - 网络技术
tags:
  - gRPC
  - RPC
---

gRPC 是一个开源的高性能的语言无关的平台无关的 RPC 框架。

<!-- more -->

> RPC 远程过程调用，是一种请求响应模型（http）的一种拓展，即抽象出统一的接口，并封装请求响应，使得客户端调用远程过程和调用本地过程的方式一致。

## protobuf 协议

服务端与客户端的统一接口就是由 protobuf 完成的，平台无关是因为它提供了多平台的工具 protoc，语言无关是因为 protoc 可以把 proto 文件翻译成多种语言的版本。这个工具的下载地址如下：

```http
https://github.com/protocolbuffers/protobuf/releases
```

## proto 文件

```protobuf
syntax="proto3";
package xxx; // proto 的包名，且默认会被用作不同语言的包名
import "<外部proto文件>";
option xxx = "xxx";

message <msg-name> {
	<type> <field-name> = 1;
	// 常用类型 string int32 bool float 自定义type ，详情：
	//     https://developers.google.cn/protocol-buffers/docs/proto3#scalar
	// 后面是标识序号，最好不要超过15
	repeated <type> <field-name> = 2;
	// repeated 表示多个
	map<key_type, value_type> <field-name> = 3;
	// 表示映射类型
}

service <svc-name> {
	rpc <func-name> (<param-list>) returns (<ret-list>);
}
```

```sh
protoc --<lang>_out=plugins=grpc:<path-to-dist> <path-to-proto-src>
```

## go

通过 ptotoc 命令可以生成 xxx.pb.go 文件

### server

- 实现 `<package>.<svc-name>Server` 接口 `<implementor>`
- `rpcServer := grpc.NewServer()`
- `<package>.Register<svc-name>Server(rpcServer, &<implementor>{})`
- `lis, _ := net.Listen("tcp", "<addr>")`
- `rpcServer.Serve(lis)`

### client

- `conn, _ := grpc.Dial("<addr>", grpc.WithInsecure())`
- `rpcClient := <package>.New<svc-name>Client(conn)`
- 通过 `rpcClient` 调用指定的服务方法