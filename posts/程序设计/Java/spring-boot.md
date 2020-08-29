---
date: 2020-08-23 10:07:37
tags:
- java
- spring
- spring-boot
---

# Spring Boot 学习笔记

Spring Boot 在 Spring 容器的基础上旨在实现 “开箱即用” 

<!-- more-->

- SPI 和 Conditional 注解提供了可插拔的特性
- application.yml 和 ConfigurationProperties 注解提供了约定大于配置的特性
- maven/gradle 插件和 SpringApplication 类提供了构建独立运行 jar 包的特性

## Boot

> 下面是 Spring Boot 与常见的项目进行整合和使用

## Web

### WebMVC



### WebFlux



### Actuator

Spring Boot Actuator的关键特性是在应用程序里提供众多Web端点，通过它们了解应用程序运行时的内部状况。 

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
> - ABAC：基于属性的访问控制，即用户属性、资源属性、操作属性、环境属性等输入参数动态计算出是否有权限
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
```

> 动态数据源：`com.baomidou:dynamic-datasource-spring-boot-starter`
>
> ```yaml
> spring:
>   datasource:
>     dynamic:
>       primary: master
>       strict: false
>       datasource:
>         master:
>           url: jdbc:mysql://xx.xx.xx.xx:3306/dynamic
>           username: root
>           password: 123456
>           driver-class-name: com.mysql.jdbc.Driver # 3.2.0开始支持SPI可省略此配置
>         slave_1:
>           url: jdbc:mysql://xx.xx.xx.xx:3307/dynamic
>           username: root
>           password: 123456
>           driver-class-name: com.mysql.jdbc.Driver
> ```
>
> ```java
> // 注解在service、mapper、repository的类上或方法上，实现动态切换
> @DS("slave_1")
> ```

### JDBC

### JPA

### Mybatis Plus

### Redis

### MongoDB

### Elasticsearch

## Test

## Logging