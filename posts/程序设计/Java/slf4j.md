---
title: SLF4J 学习笔记
date: 2020-08-08 10:54:24
tags:
- 学习笔记
- logging
---

SLF4J 为各种 logging APIs 提供一个简单统一的接口。比较常见的实现有 logback、log4j、slf4j-simple 等。

<!-- more -->

## 引入 API 依赖

groupId `org.slf4j` artifactId `slf4j-api`

## SLF4J 的使用

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloWorld {
    private static final Logger logger = LoggerFactory.getLogger(HelloWorld.class);
    
  	public static void main(String[] args) {
        // 日志级别: trace/debug/info/warn/error
    	if (logger.isInfoEnabled()) { // if 判断旨在性能优化
            logger.info("xxx" + xxx + "xxx" + xxx);
        }
        // or
        logger.info("xxx{}xxx{}", xxx, xxx);
  	}
}
```

## 采用 Log4j2 实现

groupId `org.apache.logging.log4j` artifactId `log4j-slf4j-impl`

**log4j2.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration>
  <properties>
  	<property name="xxx">xxx</property>
  </properties>
  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
    </Console>
    <File name="File" fileName="xxx">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
    </File>
    <RollingFile name="RollingFile" fileName="D:/logs/web.log"
        filePattern="logs/$${date:yyyy-MM}/web-%d{MM-dd-yyyy}-%i.log.gz">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
      <SizeBasedTriggeringPolicy size="2MB"/>
    </RollingFile>
  </Appenders>
  <Loggers>
    <Root level="error">
      <AppenderRef ref="Console"/>
    </Root>
    <Logger name="com.example" level="INFO"/>
  </Loggers>
</Configuration>
```

> Pattern 说明
>
> ```
> %c 输出所属类的全名，可写为 %c{Num} ,Num类名输出的范围 如："com.sun.aaa.classB",%C{2}将使日志输出输出范围为：aaa.classB
> %d 输出日志时间其格式为 可指定格式 如 %d{HH:mm:ss}等
> %l 输出日志事件发生位置，包括类目名、发生线程，在代码中的行数
> %n 换行符
> %m 输出代码指定信息，如info(“message”),输出message
> %p 输出日志的优先级，即 FATAL ,ERROR 等
> %r 输出从启动到显示该条日志信息所耗费的时间（毫秒数）
> %t 输出产生该日志事件的线程名
> ```

### 初始模板

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">

	<Properties>
		<Property name="LOG_LEVEL_PATTERN">%-5p</Property>
		<Property name="LOG_TIME_PATTERN">%d{yyyy-MM-dd HH:mm:ss.SSS}</Property>
		<Property name="LOG_THREAD_PATTERN">%-15.15t</Property>
		<Property name="LOG_CLASS_PATTERN">%20.20c{1.}</Property>
		<Property name="LOG_THROWABLE_PATTERN">%throwable</Property>

		<Property name="CONSOLE_LOG_PATTERN">
			%highlight{${sys:LOG_LEVEL_PATTERN}} | %style{${sys:LOG_TIME_PATTERN}}{cyan} | %style{${sys:LOG_THREAD_PATTERN}}{blue} | %style{${sys:LOG_CLASS_PATTERN}}{blue} | %msg%n%style{${sys:LOG_THROWABLE_PATTERN}}{red}
		</Property>
		<Property name="FILE_LOG_PATTERN">
			${sys:LOG_LEVEL_PATTERN} | ${sys:LOG_TIME_PATTERN} | ${sys:LOG_THREAD_PATTERN} | ${sys:LOG_CLASS_PATTERN} | %msg%n${sys:LOG_THROWABLE_PATTERN}
		</Property>
	</Properties>

	<Appenders>
		<Console name="Console" target="SYSTEM_OUT">
			<PatternLayout pattern="${sys:CONSOLE_LOG_PATTERN}"/>
		</Console>
	</Appenders>
	
	<Loggers>
		<Root level="info">
			<AppenderRef ref="Console" />
		</Root>
	</Loggers>
</Configuration>
```

