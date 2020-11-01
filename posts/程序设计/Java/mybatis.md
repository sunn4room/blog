---
date: 2020-07-28 10:50:22
tags:
- 学习笔记
- orm
- java
---

# Mybatis 学习笔记

MyBatis 是一个 “半自动” 的持久层框架，支持 XML 和注解配置，在保证原生 SQL 的灵活性的基础上，避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。

<!-- more -->

## Hello MyBatis

添加依赖

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>x.x.x</version>
</dependency>
```

```groovy
// build.gradle
implementation group: 'org.mybatis', name: 'mybatis', version: 'x.x.x'
```

准备数据库和表

```mysql
create database mybatis;
use mybatis;
drop table if exists tb_user;
create table tb_user (
	id int primary key auto_increment,
	name varchar(255) default null
);
```

定义 POJO

```java
package com.sunny.demo.mybatis;

import java.io.Serializable;

public class User implements Serializable {
    private static final long serialVersionUID = -2148527769397552575L;
    private Integer id;
    private String name;

    public User() {}
    public User(String name) { this.name = name; }
    public User(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() { return this.id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }
}
```

添加 Mapper 和 Mapper XML

```java
package com.sunny.demo.mybatis;

public interface UserMapper {
    void insertUser(User user);
    void deleteUser(int id);
    User selectUserById(int id);
    void updateUser(User user);
}
```

```xml
<!-- com/sunny/demo/mybatis/user-mapper.xml -->
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.sunny.demo.mybatis.UserMapper">

  <insert id="insertUser" useGeneratedKeys="true" keyProperty="id">
    insert into tb_user(name) values(#{name})
  </insert>

  <delete id="deleteUser">
    delete from tb_user where id=#{id}
  </delete>

  <select id="selectUserById" resultType="com.sunny.demo.mybatis.User">
    select * from tb_user where id = #{id}
  </select>

  <update id="updateUser">
    update tb_user set name=#{name} where id=#{id}
  </update>
</mapper>
```

> 默认情况下，maven 不会加载 java 目录下的 xml 文件，需要配置如下：
>
> ```xml
> <build>
>      <resources>
>        <resource>
>          <directory>src/main/java</directory>
>          <includes>
>            <include>**/*.properties</include>
>            <include>**/*.xml</include>
>          </includes>
>          <filtering>false</filtering>
>        </resource>
>      </resources>
> </build>
> ```

配置 Mybatis

```xml
<!-- mybatis-config.xml -->
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/mybatis"/>
        <property name="username" value="root"/>
        <property name="password" value="888888"/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
    <mapper resource="com/sunny/demo/mybatis/user-mapper.xml"/>
  </mappers>
</configuration>
```

运行

```java
package com.sunny.demo.mybatis;

import java.io.InputStream;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class App {
    public static void main(String[] args) throws Exception {
        SqlSessionFactory sqlSessionFactory = null;
        try (InputStream is = Resources.getResourceAsStream("mybatis-config.xml")) {
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(is);
        }
        try (
            SqlSession sqlSession = sqlSessionFactory.openSession();
        ) {
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            User u1 = new User("sunny");
            userMapper.insertUser(u1);
            sqlSession.commit();

            User u2 = new User(1, "newSunny");
            userMapper.updateUser(u2);
            sqlSession.commit();

            User u3 = userMapper.selectUserById(1);
            System.out.println(u3.getName());

            userMapper.deleteUser(1);
            sqlSession.commit();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
```

## Mybatis 配置

> 配置模板
>
> ```xml
> <?xml version="1.0" encoding="UTF-8" ?>
> <!DOCTYPE configuration PUBLIC
>     "-//mybatis.org//DTD Config 3.0//EN"
>     "http://mybatis.org/dtd/mybatis-3-config.dtd"/>
> 
> <configuration>
>   <properties resource="xxx/xxx.properties">
>     <property name="xxx" value="xxx"/><!--${xxx}-->
>   </properties>
>   <!-- 改变 MyBatis 的运行时行为 -->
>   <settings>
>     <setting name="cacheEnabled" value="true|false"/><!--二级缓存开关-->
>     <setting name="lazyLoadingEnabled" value="true"/><!--懒加载开关-->
>     <setting name="aggressiveLazyLoading" value="true|false"/><!--激进加载开关-->
>     <!-- ... -->
>   </settings>
>   <!-- 为 Java 类型设置一个短的名字 -->
>   <typeAliases>
>     <typeAlias alias="xxx" type="xxx.xxx.Xxx"/>
>     <!-- ... -->
>   </typeAliases>
>   <!-- 类型处理器 -->
>   <typeHandlers>
>     <typeHandler handler="xxx.xxx.Xxx"/><!--org.apache.ibatis.type.TypeHandler-->
>     <!-- ... -->
>   </typeHandlers>
>   <!--插件-->
>   <plugins>
>     <plugin interceptor="xxx.xxx.Xxx"><!--org.apache.ibatis.plugin.Interceptor-->
>       <property name="xxx" value="xxx"/>
>       <!-- ... -->
>     </plugin>
>     <!-- ... -->
>   </plugins>
>   <!-- 多环境配置 -->
>   <environments default="xxx">
>     <environment id="xxx">
>       <transactionManager type="[JDBC|MANAGED]" />
>       <dataSource type="[UNPOOLED|POOLED|JNDI]">
>         <property name="driver" value="xxx"/>
>         <property name="url" value="xxx"/>
>         <property name="username" value="xxx"/>
>         <property name="password" value="xxx"/>
>       </dataSource>
>     </environment>
>     <!-- ... -->
>   </environments>
>   <!-- 定义sql映射 -->
>   <mappers>
>     <mapper resource="xxx/xxx-mapper.xml"/>
>     <mapper class="xxx.xxx.Xxx"/>
>   </mappers>
> </configuration>
> ```

> 详情：[https://mybatis.org/mybatis-3/zh/configuration.html](https://mybatis.org/mybatis-3/zh/configuration.html)

### Mybatis 选项

```xml
<settings>
  <setting name="cacheEnabled" value="true"/>
  <setting name="lazyLoadingEnabled" value="true"/>
  <setting name="multipleResultSetsEnabled" value="true"/>
  <setting name="useColumnLabel" value="true"/>
  <setting name="useGeneratedKeys" value="false"/>
  <setting name="autoMappingBehavior" value="PARTIAL"/>
  <setting name="autoMappingUnknownColumnBehavior" value="WARNING"/>
  <setting name="defaultExecutorType" value="SIMPLE"/>
  <setting name="defaultStatementTimeout" value="25"/>
  <setting name="defaultFetchSize" value="100"/>
  <setting name="safeRowBoundsEnabled" value="false"/>
  <setting name="mapUnderscoreToCamelCase" value="false"/>
  <setting name="localCacheScope" value="SESSION"/>
  <setting name="jdbcTypeForNull" value="OTHER"/>
  <setting name="lazyLoadTriggerMethods" value="equals,clone,hashCode,toString"/>
</settings>
```

### 类型处理器

MyBatis 在设置预处理语句（PreparedStatement）中的参数或从结果集中取出一个值时， 都会用类型处理器将获取到的值以合适的方式转换成 Java 类型。类型处理器是 `org.apache.ibatis.type.TypeHandler` 的实现类

```java
public interface TypeHandler<T> {

    void setParameter(PreparedStatement ps, int i,
                      T parameter, JdbcType jdbcType) throws SQLException;
    T getResult(ResultSet rs, String columnName) throws SQLException;
    T getResult(ResultSet rs, int columnIndex) throws SQLException;
    T getResult(CallableStatement cs, int columnIndex) throws SQLException;
}
```

### 插件机制

可以拦截的方法有：

- Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed)
- ParameterHandler (getParameterObject, setParameters)
- ResultSetHandler (handleResultSets, handleOutputParameters)
- StatementHandler (prepare, parameterize, batch, update, query)

插件是 `org.apache.ibatis.plugin.Interceptor` 的实现类

```java
@Intercepts({@Signature(
  type= Executor.class,
  method = "update",
  args = {MappedStatement.class,Object.class})})
public class ExamplePlugin implements Interceptor {
  private Properties properties = new Properties();
  public Object intercept(Invocation invocation) throws Throwable {
    // implement pre processing if need
    Object returnObject = invocation.proceed();
    // implement post processing if need
    return returnObject;
  }
  public void setProperties(Properties properties) {
    this.properties = properties;
  }
}
```

## 映射配置

> 配置模板
>
> ```xml
> <?xml version="1.0" encoding="UTF-8"?>
> <!DOCTYPE mapper PUBLIC
>     "-//mybatis.org/dtd/DTD Mapper 3.0//EN"
>     "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
> 
> <mapper namespace="xxx.xxx.Xxx">
>   <select id="xxx">
>     select ...
>   </select>
>   <insert id="xxx">
>     insert into ...
>   </insert>
>   <update id="xxx">
>     update ...
>   </update>
>   <delete id="xxx">
>     delete from ...
>   </delete>
>   <!-- 外部sql -->
>   <sql id="xxx">...</sql>
>   <resultMap id="xxx" type="xxx">
>     <!--属性列名映射定义-->
>   </resultMap>
>   <!-- 全局缓存 -->
>   <cache />
> </mapper>
> ```

> 详情：[https://mybatis.org/mybatis-3/zh/sqlmap-xml.html](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html)

### CRUD

```xml
<select id="selectPerson" parameterType="int" resultType="hashmap">
  SELECT * FROM PERSON WHERE ID = #{id}
</select>

<insert id="insertAuthor">
  insert into Author (id,username,password,email,bio)
  values (#{id},#{username},#{password},#{email},#{bio})
</insert>

<update id="updateAuthor">
  update Author set
    username = #{username},
    password = #{password},
    email = #{email},
    bio = #{bio}
  where id = #{id}
</update>

<delete id="deleteAuthor">
  delete from Author where id = #{id}
</delete>
```

```java
@Select("select ...")
@Insert("insert into ...")
@Update("update ...")
@Delete("delete from ...")
```

#### 动态 SQL

```xml
<!-- if 示例 -->
<select id="findActiveBlogWithTitleLike"
     resultType="Blog">
  SELECT * FROM BLOG
  WHERE state = ‘ACTIVE’
  <if test="title != null">
    AND title like #{title}
  </if>
</select>

<!-- choose 示例 -->
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select>

<!-- where 示例 -->
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  <where>
    <if test="state != null">
         state = #{state}
    </if>
    <if test="title != null">
        AND title like #{title}
    </if>
    <if test="author != null and author.name != null">
        AND author_name like #{author.name}
    </if>
  </where>
</select>

<!-- foreach 示例 -->
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  WHERE ID in
  <foreach item="item" index="index" collection="list"
      open="(" separator="," close=")">
        #{item}
  </foreach>
</select>
```

```java
@SelectProvider(type = SqlProvider.class, method = "xxx")
@InsertProvider(type = SqlProvider.class, method = "xxx")
@UpdateProvider(type = SqlProvider.class, method = "xxx")
@DeleteProvider(type = SqlProvider.class, method = "xxx")

String xxx(Xxx xxx) { // 参数是映射方法本身的参数
    return new SQL() {{
        ...
    }}.toString()
}
```

### 参数映射

如果传入一个复杂的对象，可以引用其属性

```xml
<insert id="insertUser" parameterType="User">
  insert into users (id, username, password)
  values (#{id}, #{username}, #{password})
</insert>
```

如果传入多个参数，可以利用注解，并引用相应的名称

```java
@Param("username")
```

### 结果映射

当实际方法的返回值是 POJO 领域模型时，定义 select 语句返回结果和返回值的映射关系。

- 解决列名和属性名不相同的情景
- 解决复杂的关联映射和子查询映射情景

```xml
<resultMap id="detailedBlogResultMap" type="Blog">
  <id property="id" column="blog_id"/>
  <result property="title" column="blog_title"/>
  <association property="author" javaType="Author">
    <id property="id" column="author_id"/>
    <result property="username" column="author_username"/>
    <result property="password" column="author_password"/>
  </association>
  <collection property="posts" ofType="Post">
    <id property="id" column="post_id"/>
    <result property="subject" column="post_subject"/>
  </collection>
</resultMap>
```

```java
@Results({
  @Result(property="id", column="blog_id", id=true),
  @Result(property="title", column="blog_title"),
  @Result(property="author", column="author_id",
          one=@One(select="selectAuthorById", fetchType=FetchType.LAZY)
  ),
  @Result(property="posts", column="author_id",
          many=@Many(select="selectPostsByAuthorId", fetchType=FetchType.LAZY)
  )
})
```

### 全局缓存

> 默认情况下，只启用了本地的会话缓存，它仅仅对一个会话中的数据进行缓存

全局缓存将在多个会话中缓存数据。

- 映射语句文件中的所有 select 语句的结果将会被缓存
- 映射语句文件中的所有 insert、update 和 delete 语句会刷新缓存

```xml
<cache eviction="LRU" flushInterval="60000" size="512" readOnly="true"/>
```

```java
// 定义在接口上
@CacheNamespace(eviction="LRU", flushInterval="60000", size="512", readWrite="true")
```

## Java API

### SqlSessionFactoryBuilder

从 XML、注解或手动配置 Java 代码来创建 SqlSessionFactory

```java
// 主要 API
SqlSessionFactory build(InputStream inputStream)
SqlSessionFactory build(InputStream inputStream, String environment)
SqlSessionFactory build(InputStream inputStream, Properties properties)
SqlSessionFactory build(InputStream inputStream, String env, Properties props)
SqlSessionFactory build(Configuration config)
    
// 普通用法示例
String resource = "org/mybatis/builder/mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
SqlSessionFactory factory = builder.build(inputStream);

// config用法示例
DataSource dataSource = BaseDataTest.createBlogDataSource();
TransactionFactory transactionFactory = new JdbcTransactionFactory();

Environment environment = new Environment("development", transactionFactory, dataSource);

Configuration configuration = new Configuration(environment);
configuration.setLazyLoadingEnabled(true);
configuration.setEnhancementEnabled(true);
configuration.getTypeAliasRegistry().registerAlias(Blog.class);
configuration.getTypeAliasRegistry().registerAlias(Post.class);
configuration.getTypeAliasRegistry().registerAlias(Author.class);
configuration.addMapper(BoundBlogMapper.class);
configuration.addMapper(BoundAuthorMapper.class);

SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
SqlSessionFactory factory = builder.build(configuration);
```

### SqlSessionFactory

创建 SqlSession 实例

```java
// 主要 API
SqlSession openSession()
SqlSession openSession(boolean autoCommit)
SqlSession openSession(Connection connection)
SqlSession openSession(TransactionIsolationLevel level)
SqlSession openSession(ExecutorType execType, TransactionIsolationLevel level)
SqlSession openSession(ExecutorType execType)
SqlSession openSession(ExecutorType execType, boolean autoCommit)
SqlSession openSession(ExecutorType execType, Connection connection)
Configuration getConfiguration();
```

### SqlSession

执行命令，获取映射器和管理事务

```java
// 主要 API
<T> T selectOne(String statement, Object parameter)
<E> List<E> selectList(String statement, Object parameter)
<T> Cursor<T> selectCursor(String statement, Object parameter) // 延迟抓取
<K,V> Map<K,V> selectMap(String statement, Object parameter, String mapKey)
int insert(String statement, Object parameter)
int update(String statement, Object parameter)
int delete(String statement, Object parameter)

<E> List<E> selectList (String statement, Object parameter, RowBounds rowBounds)
<T> Cursor<T> selectCursor(String statement, Object parameter, RowBounds rowBounds)
<K,V> Map<K,V> selectMap(String statement, Object parameter, String mapKey, RowBounds rowbounds)
void select (String statement, Object parameter, ResultHandler<T> handler)
void select (String statement, Object parameter, RowBounds rowBounds, ResultHandler<T> handler)

void commit()
void commit(boolean force)
void rollback()
void rollback(boolean force)

void clearCache()

void close()

<T> T getMapper(Class<T> type)
```

## 与 Spring 整合

## 与 Spring Boot 整合



