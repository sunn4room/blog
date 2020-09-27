---
date: 2020-05-24 17:56:40
updated: 2020-05-24 17:56:52
tags:
- gRPC
- RPC
---

# gRPC 学习笔记

gRPC 是一个开源的高性能的语言无关的平台无关的 RPC 框架。

<!-- more -->

> RPC 远程过程调用，是一种请求响应模型（http）的一种拓展，即抽象出统一的接口，并封装请求响应，使得客户端调用远程过程和调用本地过程的方式一致。

## protobuf 协议

服务端与客户端的统一接口就是由 protobuf 完成的，平台无关是因为它提供了多平台的编译工具 protoc，语言无关是因为 protoc 可以把 proto 文件翻译成多种语言的版本。这个工具的下载地址如下：

https://github.com/protocolbuffers/protobuf/releases

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

```go
import "google.golang.org/grpc"
```

```sh
$ go get github.com/golang/protobuf/protoc-gen-go
$ protoc --go_out=plugins=grpc:xxx xxx.proto 
```

### server

```go
import {
    "google.golang.org/grpc"
	pb "xxx"
}

// implement

func main() {
	lis, err := net.Listen("tcp", port)
	s := grpc.NewServer()
	pb.RegisterGreeterService(s, &pb.GreeterService{Xxx: xxx})
	s.Serve(lis)
}
```

### client

```go
import {
    "google.golang.org/grpc"
	pb "xxx"
}

func main() {
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	c := pb.NewXxxClient(conn)
	r, err := c.SayHello(ctx, &xxx)
}
```

## Java

**maven**

```xml
<dependencies>
  <dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-netty-shaded</artifactId>
    <version>1.31.1</version>
  </dependency>
  <dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-protobuf</artifactId>
    <version>1.31.1</version>
  </dependency>
  <dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-stub</artifactId>
    <version>1.31.1</version>
  </dependency>
  <dependency> <!-- necessary for Java 9+ -->
    <groupId>org.apache.tomcat</groupId>
    <artifactId>annotations-api</artifactId>
    <version>6.0.53</version>
    <scope>provided</scope>
  </dependency>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>3.8.1</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

```xml
<build>
  <extensions>
    <extension>
      <groupId>kr.motd.maven</groupId>
      <artifactId>os-maven-plugin</artifactId>
      <version>1.6.2</version>
    </extension>
  </extensions>
  <plugins>
    <plugin>
      <groupId>org.xolstice.maven.plugins</groupId>
      <artifactId>protobuf-maven-plugin</artifactId>
      <version>0.6.1</version>
      <configuration>
        <protocArtifact>com.google.protobuf:protoc:3.12.0:exe:${os.detected.classifier}</protocArtifact>
        <pluginId>grpc-java</pluginId>
        <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.32.1:exe:${os.detected.classifier}</pluginArtifact>
      </configuration>
      <executions>
        <execution>
          <goals>
            <goal>compile</goal>
            <goal>compile-custom</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

```sh
$ mvn clean compile
```

**gradle**

```groovy
implementation 'io.grpc:grpc-netty-shaded:1.32.1'
implementation 'io.grpc:grpc-protobuf:1.32.1'
implementation 'io.grpc:grpc-stub:1.32.1'
compileOnly 'org.apache.tomcat:annotations-api:6.0.53' // necessary for Java 9+
```

```groovy
plugins {
    id 'com.google.protobuf' version '0.8.8'
}

protobuf {
  protoc {
    artifact = "com.google.protobuf:protoc:3.12.0"
  }
  plugins {
    grpc {
      artifact = 'io.grpc:protoc-gen-grpc-java:1.32.1'
    }
  }
  generateProtoTasks {
    all()*.plugins {
      grpc {}
    }
  }
}
```

```sh
$ gradle build
```

### server

实现接口

```java
public class XxxImpl extends XxxGrpc.XxxImplBase {
    @Override
    public void xxx(Xxx xxx, StreamObserver<Xxx> responseObserver) {
        Xxx xxx = ...;
        responseObserver.onNext(xxx);
        responseObserver.onCompleted();
    }
}
```

开启服务端

```java
public class XxxServer {
    public static void main(String[] args) {
        ServerBuilder.forPort(port).addService(new XxxImpl()).build().start()
    }
}
```

### client

客户端访问服务端

```java
public class XxxClient {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forTarget(target)
            .usePlaintext()
            .build();
        XxxGrpc.XxxBlockingStub blockingStub = XxxGrpc.newBlockingStub(channel);
        Xxx xxx = ...;
        Xxx xxx = blockingStub.xxx(xxx);
    }
}
```

