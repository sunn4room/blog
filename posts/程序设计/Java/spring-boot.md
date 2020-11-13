---
date: 2020-08-23 10:07:37
tags:
- java
- spring
- spring-boot
---

# Spring Boot 学习笔记

Spring Boot 在 Spring 容器的基础上，旨在实现 “开箱即用” ，只需要引入相关 jar 包，统一在 application.yaml 做一些必要的配置，其他配置项遵循 “约定大于配置” 原则，就可以直接使用。

<!-- more-->

- 创建独立的 Spring 应用程序
- 嵌入的 Tomcat 、Jetty 或者 Undertow，无须部署 WAR 文件
- 允许通过 Maven 来根据需要获取 starter
- 尽可能地自动配置 Spring
- 提供生产就绪型功能，如指标、健康检查和外部配置
- 绝对没有代码生成，对 XML 没有要求配置 

## Boot

### maven 方式

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.x.x.RELEASE</version>
  </parent>

  <groupId>xxx</groupId>
  <artifactId>xxx</artifactId>
  <version>xxx</version>
  <packaging>jar</packaging>

  <name>xxx</name>
  <url>xxx</url>

  <properties>
    <java.version>11</java.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
```

> 当当前项目已经存在 parent 时，可以使用：
>
> ```xml
>    <dependencyManagement>
>      <dependencies>
>        <dependency>
>          <groupId>org.springframework.boot</groupId>
>          <artifactId>spring-boot-dependencies</artifactId>
>          <version>2.x.x.RELEASE</version>
>          <type>pom</type>
>          <scope>import</scope>
>        </dependency>
>      </dependencies>
>    </dependencyManagement>
> ```

```sh
$ XXX = "xxx" && mvn spring-boot:run -Dspring-boot.run.jvmArguments="..." -Dspring- boot.run.arguments="..."
```

### gradle 方式



### 配置文件（YAML）

Spring Boot 采用 yaml 或者 properties 文件进行配置，通常使用 yaml

```yaml
spring:
  application:
    name: xxx
  xxx:
    xxx: xxx
    xxx: xxx
  xxx:
  - xxx: xxx
  - xxx: xxx
```

> 可以通过添加命令行参数的形式动态修改配置项，如 `--xxx.xxx=xxx`

> yaml 内部也可以引用系统外部的环境变量值赋值配置项，如 `${XXX[:default-value]}`

#### profile

#### 配置项绑定

##### @Value

##### @ConfigurationProperties

### 自动装配

### 条件装配



### spring-boot 生态

- **spring-boot-devtools**
- **spring-boot-starter-parent**
- **spring-boot-starter-test**
- **spring-boot-starter-logging**
- **spring-boot-starter-web**
- **spring-boot-starter-webflux**
- **spring-boot-starter-actuator**
- **spring-boot-starter-security**
- **spring-boot-starter-data-jdbc** 
- **spring-boot-starter-data-jpa**
- **spring-boot-starter-data-redis**
- **spring-boot-starter-data-mongodb**
- **spring-boot-starter-data-elasticsearch**
- **spring-boot-starter-cache**
- **spring-boot-starter-amqp**
- **spring-boot-starter-quartz**

## Web

### 类型转换支持

转换方式有两种，一种是使用PropertyEditor，另外一种是使用Converter。

#### PropertyEditor



#### Converter

```java
public interface Converter<S, T> {
	T convert(S source);
}
```

#### Formatter

### WebMVC

> `spring-boot-starter-web`

ServletContainerInitializer 是 Servlet 3.0 新增的一个接口，主要用于在容器启动阶段通过编程风格进行配置，以取代通web.xml配置注册。Spring提供了一个实现类 SpringServletContainerInitializer，进一步配合 Spring Boot 的优良特性，简化了 Restful 风格的 web 开发。

![](./spring-boot/SpringMVC.png)

```yaml
server:
  port: 8080
```



#### 端点开发

#### 参数绑定

#### 扩展点

注解开发

- @Controller：控制器声明
- @RequestMapping：请求方法映射（捕捉）
- @RequestParam：query 参数映射
- @RequestHeader：header 参数映射
- @RequestAttribute：请求属性参数映射
- @PahVariable：路径参数映射
- @CookieValue：Cookie 参数映射
- @RequestBody：json/xml 请求体参数映射
- @ResponseBody：json/xml 响应体声明
- @RestController：@Controller + @ResponseBody
- @ExceptionHandler：异常处理器
- @ControllerAdvise：控制器增强，通常配合 @ExceptionHandler 实现全局异常处理
- @RestControllerAdvise：@ControllerAdvise + @ResponseBody

参数解析绑定

Controller 方法体的参数是通过 Spring 配好的参数解析器解析出来并传递的，每个解析器都有一个 supportsParameter 方法指示该解析器是否支持指定的参数。

- 根据参数名寻找
- 根据注解指定
- 根据对象的属性名寻找，并自定创建对象并赋值
- ...

解析出来的是字符串，还需要类型转换器转换成参数的类型进行绑定，默认支持

- 基础类型
- String
- 包装类
- ...

> 自定义类型转换器
>
> ```java
> @Component
> public class XxxConverter implements Converter<String, Xxx> {
>     
>        @Override
>        public Xxx convert(String source) {
>            // ...
>        }
> }
> ```

> 有些类型的参数是 MVC 内部类型，可以跳过解析直接绑定，常见的就是两个：HttpServletRequest 和 HttpServletResponse

HandlerInterceptor



ResponseBodyAdvice



### WebFlux

> `spring-boot-starter-webflux`

与 WebMVC 的开发方式完全一致，不同点在于，引入了 Netty 作为默认的服务提供者，拓展了对 Reactor API 的支持，即端点方法可以放回 Mono/Flux ，实现了服务器端的请求异步处理，分离了请求接收线程和业务处理线程。

> 但是，webflux 对于单次请求并没有明显的性能提升，它的意义在于线程资源的整合，降低了应用的内存占用，提高了应用的吞吐量。

### Actuator

Spring Boot Actuator的关键特性是在应用程序里提供众多Web端点，通过它们了解应用程序运行时的内部状况。 

| ID                 | Description                                                  |
| :----------------- | :----------------------------------------------------------- |
| `auditevents`      | Exposes audit events information for the current application. Requires an `AuditEventRepository` bean. |
| `beans`            | Displays a complete list of all the Spring beans in your application. |
| `caches`           | Exposes available caches.                                    |
| `conditions`       | Shows the conditions that were evaluated on configuration and auto-configuration classes and the reasons why they did or did not match. |
| `configprops`      | Displays a collated list of all `@ConfigurationProperties`.  |
| `env`              | Exposes properties from Spring’s `ConfigurableEnvironment`.  |
| `flyway`           | Shows any Flyway database migrations that have been applied. Requires one or more `Flyway` beans. |
| `health`           | Shows application health information.                        |
| `httptrace`        | Displays HTTP trace information (by default, the last 100 HTTP request-response exchanges). Requires an `HttpTraceRepository` bean. |
| `info`             | Displays arbitrary application info.                         |
| `integrationgraph` | Shows the Spring Integration graph. Requires a dependency on `spring-integration-core`. |
| `loggers`          | Shows and modifies the configuration of loggers in the application. |
| `liquibase`        | Shows any Liquibase database migrations that have been applied. Requires one or more `Liquibase` beans. |
| `metrics`          | Shows ‘metrics’ information for the current application.     |
| `mappings`         | Displays a collated list of all `@RequestMapping` paths.     |
| `scheduledtasks`   | Displays the scheduled tasks in your application.            |
| `sessions`         | Allows retrieval and deletion of user sessions from a Spring Session-backed session store. Requires a Servlet-based web application using Spring Session. |
| `shutdown`         | Lets the application be gracefully shutdown. Disabled by default. |
| `threaddump`       | Performs a thread dump.                                      |

| Property                                    | Default        |
| :------------------------------------------ | :------------- |
| `management.endpoints.jmx.exposure.exclude` |                |
| `management.endpoints.jmx.exposure.include` | `*`            |
| `management.endpoints.web.exposure.exclude` |                |
| `management.endpoints.web.exposure.include` | `info, health` |

### Security

> `spring-boot-starter-security`

Spring Security 是 Spring 实现的认证授权框架，随着 Spring Boot 的流行，逐渐成为 Shiro 的替代者。

> 认证：确认用户身份
>
> - 基于 Session 的认证，即服务端维护用户登录信息
> - 基于 Token 的认证，即客户端维护用户登录信息
>
> 授权：确认某个身份是否有权限对某种资源进行某种操作
>
> - ACL：用户直接维护了一个资源操作的列表表示它的权限
> - ABAC：基于属性的访问控制，即用户属性、资源属性、操作属性、环境属性等输入参数计算出是否有权限
> - RBAC：基于角色的访问控制，即资源操作和用户解耦，中间加个角色，资源操作和用户分别与角色进行联系

```java
@EnableWebSecurity
public class MySecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 安全配置
        http.authorizeRequests()
            .antMatchers("/xx/xx").permitAll()
            .antMatchers("/xx/xx").hasRole("xx")
            .anyRequest().authenticated();
        http.formLogin()
            .loginPage("/xx");
            .successForwardUrl("/xx")
            .failureForwardUrl("/xx");
        http.logout()
            .logoutSuccessUrl("/xx");
        http.rememberMe()
            .rememberMeParameter("remeber");
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(xxx)
    }
}

// UserDetailService
@Service
public class MyUserDetailService implements UserDetailService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // ...
        return User.builder()
				.username("xxx")
				.password("xxx")
				.roles("xxx")
                .authorities("xxx")
				.build();
    }
}
```

## Data

```yaml
spring:
  datasource:
    driver-class-name: xxx
    url: xxx
    username: xxx
    password: xxx
    
    hikari:
      minimum-idle: 10
      maximum-pool-size: 20
      idle-timeout: 500000
      connection-timeout: 60000
```

> 动态数据源：`com.baomidou:dynamic-datasource-spring-boot-starter`
>
> ```yaml
> spring:
>     datasource:
>      dynamic:
>        primary: master
>        strict: false
>        datasource:
>          master:
>            url: jdbc:mysql://xx.xx.xx.xx:3306/dynamic
>            username: root
>            password: 123456
>            driver-class-name: com.mysql.jdbc.Driver # 3.2.0开始支持SPI可省略此配置
>          slave_1:
>            url: jdbc:mysql://xx.xx.xx.xx:3307/dynamic
>            username: root
>            password: 123456
>            driver-class-name: com.mysql.jdbc.Driver
> ```
>
> ```java
> // 注解在service、mapper、repository的类上或方法上，实现动态切换
> @DS("slave_1")
> ```

### 事务支持

Spring 提供了一致的事务管理抽象层，具有以下特性：

- 统一了不同框架的事务 API
- 简化了编程式事务管理，同时支持声明式事务管理
- 与 Spring 数据访问模块进行完美整合

#### 核心组件

##### PlatformTransactionManager

```java
public interface PlatformTransactionManager {
    TransactionStatus getTransaction(TransactionDefinition definition)
        	throws TransactionException;
    void commit(TransactionStatus status) throws TransactionException;
    void rollback(TransactionStatus status) throws TransactionException;
}
```

##### TransactionDefinition

```java
public interface TransactionDefinition {
	// 加入到外部事务，如果没有则新建一个事务
	int PROPAGATION_REQUIRED = 0;
    // 加入到外部事务，如果没有则以非事务的形式执行
    int PROPAGATION_SUPPORTS = 1;
    // 加入到外部事务，如果没有则抛出一个异常
    int PROPAGATION_MANDATORY = 2;
    // 新建一个事务，如果有外部事务则挂起
    int PROPAGATION_REQUIRES_NEW = 3;
    // 以非事务的形式执行,如果有外部事务则挂起
    int PROPAGATION_NOT_SUPPORTED = 4;
    // 以非事务的形式执行,如果有外部事务则抛出一个异常
    int PROPAGATION_NEVER = 5;
    // 嵌套到外部事务（可以建立内部的回滚点）,如果没有则新建一个事务
    int PROPAGATION_NESTED = 6;
    
    // 1. 脏读 - 事务A更新记录但未提交，事务B查询出A未提交记录
    // 2. 不可重复读 - 事务A读取一次，此时事务B对数据进行了更新或删除操作，事务A再次查询数据不一致
    // 3. 幻读 - 事务A读取一次，此时事务B插入一条数据事务A再次查询，记录多了
    
    // 1 x 2 x 3 x
    int ISOLATION_READ_UNCOMMITTED = 1;
    // 1 o 2 x 3 x
    int ISOLATION_READ_COMMITTED = 2;
    // 1 o 2 o 3 x
    int ISOLATION_REPEATABLE_READ = 4;
    // 1 o 2 o 3 o
    int ISOLATION_SERIALIZABLE = 8;
    
    int getPropagationBehavior();
    int getIsolationLevel();
    int getTimeout();
    boolean isReadOnly();
    String getName();
}
```

##### TransactionStatus

```java
public interface TransactionStatus 
extends TransactionExecution, SavepointManager, Flushable {
	boolean hasSavepoint();
}
// ---
public interface TransactionExecution {
    boolean isNewTransaction();
    void setRollbackOnly();
    boolean isRollbackOnly();
    boolean isCompleted();
}
// ---
public interface SavepointManager {
    Object createSavepoint();
    void rollbackToSavepoint(Object savepoint);
    void releaseSavepoint(Object savepoint);
}
// ---
public interface Flushable {
    void flush();
}
```

#### 编程式事务管理

TransactionTemplate 位于 org.springframework.transaction.support 下，提供事务管理的模板类

```java
public class SimpleService implements Service {

    private final TransactionTemplate transactionTemplate;

    public SimpleService(PlatformTransactionManager transactionManager) {
        this.transactionTemplate = new TransactionTemplate(transactionManager);
        this.transactionTemplate.setXxx(xxx);
        this.transactionTemplate.setXxx(xxx);
    }

    public Object someServiceMethod() {
        return transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                // ...
                status.setRollbackOnly();
                // ...
            }
        });
    }

    public void someServiceMethodWithoutResult() {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            public void doInTransactionWithoutResult(TransactionStatus status) {
                // ...
                status.setRollbackOnly();
                // ...
            }
        });
    }
}
```

#### 声明式事务管理

```java
// 配置 transaction manager
@Configuration
@ComponentScan
public class XxxConfig {
	@bean
	public PlatformTransactionManager transactionManager() {
    	return new Xxx();
	}
}
// 声明
@Component
public class Xxx {
    @Transactional(value="transactionManager",propagation=xxx,isolation=xxx)
    public Xxx xxx() { ... }
}
```

> 被声明的方法应该是 public 的，否则不会生效

### JDBC

> `spring-boot-starter-data-jdbc`

```java
@Service
public class UserServiceImpl implements UserService {

    private JdbcTemplate jdbcTemplate;

    UserServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int create(String name, Integer age) {
        return jdbcTemplate.update("insert into USER(NAME, AGE) values(?, ?)", name, age);
    }

    @Override
    public List<User> getByName(String name) {
        List<User> users = jdbcTemplate.query("select NAME, AGE from USER where NAME = ?", (resultSet, i) -> {
            User user = new User();
            user.setName(resultSet.getString("NAME"));
            user.setAge(resultSet.getInt("AGE"));
            return user;
        }, name);
        return users;
    }

    @Override
    public int deleteByName(String name) {
        return jdbcTemplate.update("delete from USER where NAME = ?", name);
    }

    @Override
    public int getAllUsers() {
        return jdbcTemplate.queryForObject("select count(1) from USER", Integer.class);
    }

    @Override
    public int deleteAllUsers() {
        return jdbcTemplate.update("delete from USER");
    }

}
```

### JPA

> `spring-boot-starter-data-jpa`

默认采用了 Hibernate 的实现

```yaml
spring:
  jpa:
    properties:
      hibernate:
        hbm2ddl:
          auto: create | create-drop | update
    show-sql: true
```

#### 方法名推断

#### @Query 配置

#### 动态条件查询支持

#### 分页支持

#### 排序支持

### Mybatis（非官方）

> `org.mybatis.spring.boot:mybatis-spring-boot-starter`

```yaml
mybatis:
  type-aliases-package: com.example.domain.model
  type-handlers-package: com.example.typehandler
  configuration:
    map-underscore-to-camel-case: true
    default-fetch-size: 100
    default-statement-timeout: 30
```

```java
@Mapper
public interface CityMapper {
    @Select("SELECT * FROM CITY WHERE state = #{state}")
    City findByState(@Param("state") String state);
}
```

```java
@SpringBootApplication
public class SampleMybatisApplication implements CommandLineRunner {
    private final CityMapper cityMapper;
    public SampleMybatisApplication(CityMapper cityMapper) {
        this.cityMapper = cityMapper;
    }
    public static void main(String[] args) {
        SpringApplication.run(SampleMybatisApplication.class, args);
    }
    @Override
    public void run(String... args) throws Exception {
        System.out.println(this.cityMapper.findByState("CA"));
    }
}
```

> 这里的开发模式沿用了Mybatis 原生的 @Mapper ，而不是经典的 @Repository 

### MongoDB

> `spring-boot-starter-data-mongodb`

### Elasticsearch

> `spring-boot-starter-data-elasticsearch`

## MQ



## Cache

> `spring-boot-starter-cache`

```yaml
spring:
  cache:
    type: xxx # 显式指定缓存提供者
```

```java
@EnableCaching
@SpringBootApplication
public class Xxx {
    // ...
}
```

```java
@CacheConfig(cacheNames = "users") // map 名
public interface UserRepository extends JpaRepository<User, Long> {

    @Cacheable(key = "#p0") // 键值
    User findById(Long id);
    
    @CachePut(key = "#p0.id")
    User updateUser(User);
    
    @CacheEvict(key = "#p0")
    User deleteUserById(Long id);

}
```

缓存提供者缺省时的搜索顺序：

- Generic
- JCache (JSR-107) (EhCache 3, Hazelcast, Infinispan, and others)
- EhCache 2.x
- Hazelcast
- Infinispan
- Couchbase
- Redis
- Caffeine
- Simple

### EhCache

> `net.sf.ehcache:ehcache`

```xml
<!-- ehcache.xml -->
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="ehcache.xsd">

  <cache name="users"
         maxEntriesLocalHeap="200"
         timeToLiveSeconds="600">
  </cache>

</ehcache>
```

> EhCache 是进程级别的缓存方案，虽然也可以进行集群部署，但不适合上生产，生产环境下推荐使用 Redis 缓存方案。

### Redis

> `spring-boot-starter-data-redis`

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    lettuce:
      pool:
        max-idle: 8
        max-active: 8
        max-wait: -1ms
        min-idle: 0
      shutdown-timeout: 100ms
```

RedisTemplate

SessionCallback

RedisCallback

事务

流水线

## Test

>`spring-boot-starter-test`

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*; // 断言
import static org.junit.jupiter.api.Assumptions.*; // 前置条件
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class AppTest {
    @Test
    public void testAppHasAGreeting() {
        // ...
    }
}
```

| JUnit 5     | JUnit 4      | 说明                                                         |
| :---------- | :----------- | :----------------------------------------------------------- |
| @Test       | @Test        | 被注解的方法是一个测试方法。与 JUnit 4 相同。                |
| @BeforeAll  | @BeforeClass | 被注解的（静态）方法将在当前类中的所有 @Test 方法前执行一次。 |
| @BeforeEach | @Before      | 被注解的方法将在当前类中的每个 @Test 方法前执行。            |
| @AfterEach  | @After       | 被注解的方法将在当前类中的每个 @Test 方法后执行。            |
| @AfterAll   | @AfterClass  | 被注解的（静态）方法将在当前类中的所有 @Test 方法后执行一次。 |
| @Disabled   | @Ignore      | 被注解的方法不会执行（将被跳过），但会报告为已执行。         |

| 断言方法                         | 说明                                                 |
| :------------------------------- | :--------------------------------------------------- |
| `assertEquals(expected, actual)` | 如果 *expected* 不等于 *actual* ，则断言失败。       |
| `assertFalse(booleanExpression)` | 如果 *booleanExpression* 不是 `false` ，则断言失败。 |
| `assertNull(actual)`             | 如果 *actual* 不是 `null` ，则断言失败。             |
| `assertNotNull(actual)`          | 如果 *actual* 是 `null` ，则断言失败。               |
| `assertTrue(booleanExpression)`  | 如果 *booleanExpression* 不是 `true` ，则断言失败。  |

## Logging

> `spring-boot-starter-logging`

```yaml
logging:
  path: /path/to/spring.log
  file: spring.log
  level:
    root: debug
    xxx.xxx.xxx: debug
    xxx.xxx.xxx: debug
    xxx.xxx.xxx: debug
  pattern:
    console: %d{yyyy/MM/dd-HH:mm:ss} [%thread] %-5level %logger- %msg%n 
    file: %d{yyyy/MM/dd-HH:mm} [%thread] %-5level %logger- %msg%n
```

```java
// ...
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
// ...
public class Xxx {
    private static final Logger logger = LoggerFactory.getLogger(Xxx.class);
    // ...
    public Xxx xxx() {
        // ...
        // 日志级别: trace/debug/info/warn/error
    	if (logger.isInfoEnabled()) { // if 判断旨在性能优化
            logger.info("xxx" + xxx + "xxx" + xxx);
        }
        // or
        logger.info("xxx{}xxx{}", xxx, xxx);
        // ...
    }
    // ...
}
```

