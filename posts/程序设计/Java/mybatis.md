---
title: MyBatis 学习笔记
date: 2020-07-28 10:50:22
tags:
- 学习笔记
- DAO
---

MMyBatis 是一款优秀的持久层框架，它支持定制化 SQL、存储过程以及高级映射。MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。MyBatis 可以使用简单的 XML 或注解来配置和映射原生类型、接口和 Java 的 POJO 为数据库中的记录。

<!-- more -->

## Hello MyBatis

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

POJO

```java
import java.io.Serializable;

public class User implements Serializable {
    private static final long serialVersionUID = -2148527769397552575L;
    private Integer id;
    private String name;

    public User() {}
    public User(String name) { this.name = name; }

    public Integer getId() { return this.id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }
}
```

添加 Mapper

```java
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;

public interface UserMapper {
    @Insert("insert into tb_user(name) values(#{name})")
    @Options(useGeneratedKeys = true)
    int insertUser(User user);
}
```

配置 Mybatis

```properties
# mysql.properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
username=root
password=888888
```

```xml
<!-- mybatis-config.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC 
    "-//mybatis.org/dtd/DTD Config 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
  <properties resource="mysql.properties" />

  <environments default="mysql">
    <environment id="mysql">
      <transactionManager type="JDBC" />
      <dataSource type="POOLED">
        <property name="driver" value="${driver}" />
        <property name="url" value="${url}" />
        <property name="username" value="${username}" />
        <property name="password" value="${password}" />
      </dataSource>
    </environment>
  </environments>

  <mappers>
    <mapper class="UserMapper" />
  </mappers>
</configuration>
```

测试

```java
import java.io.InputStream;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class MyBatisTest {
    public static void main(String[] args) {
        SqlSession sqlSession = null;
        try (
            InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
        ) {
            SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(is);
            sqlSession = sqlSessionFactory.openSession();
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            User user = new User("hzt");
            userMapper.insertUser(user);
            sqlSession.commit();
        } catch (Exception ex) {
            System.out.println("operation failed!!");
        } finally {
            if (sqlSession != null) sqlSession.close();
        }
    }
}
```

## 核心组件

### SqlSessionFactoryBuilder

用于根据配置信息构建会话工厂，用完可丢弃或构建其他会话工厂。

### SqlSessionFactory

用于建立会话，会话工厂一旦构建，应该参与到整个应用的声明周期，线程安全，不可轻易丢弃。

### SqlSession

代表一个 JDBC 会话，可以产生配置的 Mapper 实例，不是线程安全的，应与建立连接的线程绑定，不可轻易与其他线程共享。

### Mapper Interface

代表一个 Mybatis 映射，用于通过调用方法隐式地执行 SQL 语句，不是线程安全的，与 SqlSession 绑定，在 SqlSession 生命周期内部使用后直接丢弃，不需关闭。

### MappedStatement

### MapperMethod

### Executor

### ParameterHandler

### StatementHandler

### ResultSetHandler

### Interceptor

## Mybatis 配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC
    "-//mybatis.org//DTD Config 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-config.dtd"/>

<configuration>
  <properties resource="_path_to_properties_file">
    <property name="_name" value="_value"/>
  </properties>
  <!-- 改变 MyBatis 的运行时行为 -->
  <settings>
    <setting name="cacheEnabled" value="true|false"/><!--二级缓存开关-->
    <setting name="lazyLoadingEnabled" value="true"/><!--懒加载开关-->
    <setting name="aggressiveLazyLoading" value="true|false"/><!--激进加载开关-->
  </settings>
  <!-- 为 Java 类型设置一个短的名字 -->
  <typeAliases>
    <typeAlias alias="_alias" type="_full_class_name"/>
  </typeAliases>
  <!-- 类型处理器 -->
  <typeHandlers>
    <typeHandler handler="_TypeHandler<T>_implementation"/>
  </typeHandlers>
  <!-- 多环境配置 -->
  <environments default="默认环境名">
    <environment id="环境名">
      <transactionManager type="[JDBC|MANAGED]">
        <property name="属性名" value="属性值"/>
        <!-- ... -->
      </transactionManager>
      <dataSource type="[UNPOOLED|POOLED|JNDI]">
        <property name="属性名" value="属性值"/>
        <!-- ... -->
      </dataSource>
    </environment>
  </environments>
  <!-- 定义sql映射 -->
  <mappers>
    <mapper resource="xxx"/>
    <mapper package="xxx"/>
    <mapper class="xxx"/>
  </mappers>
</configuration>
```

## Mapper 配置

### Mapper 接口

一个仅需声明与 SqlSession 方法相匹配的方法的接口类。

### 语义映射

```java
public interface AuthorMapper {
  // (Author) selectOne("selectAuthor",5);
  Author selectAuthor(int id);
  // (List<Author>) selectList(“selectAuthors”)
  List<Author> selectAuthors();
  // (Map<Integer,Author>) selectMap("selectAuthors", "id")
  @MapKey("id")
  Map<Integer, Author> selectAuthors();
  // insert("insertAuthor", author)
  int insertAuthor(Author author);
  // updateAuthor("updateAuthor", author)
  int updateAuthor(Author author);
  // delete("deleteAuthor",5)
  int deleteAuthor(int id);
}
```

### XML 映射

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC
    "-//mybatis.org/dtd/DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="命名空间">
    <!-- 配置java属性名和列名的对应关系 -->
    <!-- 如果都同名，可以省略定义resultMap -->
	<resultMap id="标签" type="返回的Java类型">
    	<id property="属性名" column="主键列名"/>
        <result property="属性名" column="普通列名"/>
        <association property="属性名" column="列名" javaType="属性类型" select="xxx"/>
        <collection property="属性名" column="列名" javaType="集合类型" ofType="元素类型" select="xxx"/>
    </resultMap>
    <!--! select delete insert update -->
    <!-- 参数形式为 #{xxx} -->
    <delete ...>
    	delete ...
    </delete>
    <insert ... useGeneratedKeys="xxx">
    	insert into ...
    </insert>
    <update ... useGeneratedKeys="xxx">
    	update ...
    </update>
    <select ...>
    	select ...
    </select>
    <!-- 可重用sql语句 -->
    <!-- 参数形式为 ${xxx} -->
    <sql id="标签"> xxx </sql><!-- 通过include标签使用 -->
    <select ...>
        select ...
        <include refid="xxx">
            <property name="xxx" value="xxx"/>
        </include>
        ...
    </select>
    <!-- 配置mapper缓存 -->
    <cache
  		eviction="LRU"
  		flushInterval="60000"
  		size="512"
  		readOnly="true"/>
</mapper>
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

### 注解映射

```java
@Mapper
public interface UserMapper {
    @ConstructorArgs({@Arg()})
    @Results({@Result()})
    @ResultMap()
    @Select
    @SelectProvider
    public List<User> findUserById(@Param() int id);
    
    @Insert
    @InsertProvider
    public User insert(User user);
    
    @Update
    @UpdateProvider
    public User update(@Param()int id, @Param()String name);
    
    @Delete
    @DeleteProvider
    public User delete(@Param()int id);
}
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

## 类型转换机制

## 懒加载机制

## 缓存机制

- Session 缓存 
- Mapper 缓存

## 插件机制

## Mybatis Plus

### SQL注入器

#### BaseMapper 与 AutoSqlInjector

#### 自定义注入器

### 条件构造器

### ActiveRecord 支持

### 代码生成器

### 插件集成

### Spring boot 集成

## 附录

### Mybatis Settings

| 配置项                                 | 作用                                                         | 配置选项                                              | 默认值                                                       |
| -------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| cacheEnabled                           | 该配置影响所有映射器中配置缓存的全局开关                     | true\|false                                           | true                                                         |
| lazyLoadingEnabled                     | 延迟加载的全局开关。当开启时，所有关联对象都会延迟加载。在特定关联关系中可通过设置 fetchType 属性来覆盖该项的开关状态 | true\|false                                           | false                                                        |
| aggressiveLazyLoading                  | 当启用时，对任意延迟属性的调用会使带有延迟加载属性的对象完整加载；反之，每种属性将会按需加载 | true\|felse                                           | 版本3.4.1 （不包含） 之前 true，之后 false                   |
| multipleResultSetsEnabled              | 是否允许单一语句返回多结果集（需要兼容驱动）                 | true\|false                                           | true                                                         |
| useColumnLabel                         | 使用列标签代替列名。不同的驱动会有不同的表现，具体可参考相关驱动文档或通过测试这两种不同的模式来观察所用驱动的结果 | true\|false                                           | true                                                         |
| useGeneratedKeys                       | 允许JDBC 支持自动生成主键，需要驱动兼容。如果设置为 true，则这个设置强制使用自动生成主键，尽管一些驱动不能兼容但仍可正常工作（比如 Derby） | true\|false                                           | false                                                        |
| autoMappingBehavior                    | 指定 MyBatis 应如何自动映射列到字段或属性。 NONE 表示取消自动映射。 PARTIAL 表示只会自动映射，没有定义嵌套结果集和映射结果集。 FULL 会自动映射任意复杂的结果集（无论是否嵌套） | NONE<br/>PARTIAL<br/>FULL                             | PARTIAL                                                      |
| autoMapping-<br/>UnknownColumnBehavior | 指定自动映射当中未知列（或未知属性类型）时的行为。 默认是不处理，只有当日志级别达到 WARN 级别或者以下，才会显示相关日志，如果处理失败会抛出 SqlSessionException 异常 | NONE<br/>WARNING<br/>FAILING                          | NONE                                                         |
| defaultExecutorType                    | 配置默认的执行器。SIMPLE 是普通的执行器；REUSE 会重用预处理语句（prepared statements）；BATCH 执行器将重用语句并执行批量更新 | SIMPLE<br/>REUSE<br/>BATCH                            | SIMPLE                                                       |
| defaultStatementTimeout                | 设置超时时间，它决定驱动等待数据库响应的秒数                 | 任何正整数                                            | Not Set (null)                                               |
| defaultFetchSize                       | 设置数据库驱动程序默认返回的条数限制，此参数可以重新设置     | 任何正整数                                            | Not Set (null)                                               |
| safeRowBoundsEnabled                   | 允许在嵌套语句中使用分页（RowBounds）。如果允许，设置 false  | true\|false                                           | false                                                        |
| safeResultHandlerEnabled               | 允许在嵌套语句中使用分页（ResultHandler）。如果允许，设置false | true\|false                                           | true                                                         |
| mapUnderscoreToCamelCase               | 是否开启自动驼峰命名规则映射，即从经典数据库列名 A_COLUMN 到经典 [Java](http://c.biancheng.net/java/) 属性名 aColumn 的类似映射 | true\|false                                           | false                                                        |
| localCacheScope                        | MyBatis 利用本地缓存机制（Local Cache）防止循环引用（circular references）和加速联复嵌套査询。 默认值为 SESSION，这种情况下会缓存一个会话中执行的所有查询。若设置值为 STATEMENT，本地会话仅用在语句执行上，对相同 SqlScssion 的不同调用将不会共享数据 | SESSION<br/>STATEMENT                                 | SESSION                                                      |
| jdbcTypeForNull                        | 当没有为参数提供特定的 JDBC 类型时，为空值指定 JDBC 类型。某些驱动需要指定列的 JDBC 类型，多数情况直接用一般类型即可，比如 NULL、VARCHAR 或 OTHER | NULL<br/>VARCHAR<br/>OTHER                            | OTHER                                                        |
| lazyLoadTriggerMethods                 | 指定哪个对象的方法触发一次延迟加载                           | —                                                     | equals、clone、hashCode、toString                            |
| defaultScriptingLanguage               | 指定动态 SQL 生成的默认语言                                  | —                                                     | org.apache.ibatis .script.ing.xmltags .XMLDynamicLanguageDriver |
| callSettersOnNulls                     | 指定当结果集中值为 null 时，是否调用映射对象的 setter（map 对象时为 put）方法，这对于 Map.kcySet() 依赖或 null 值初始化时是有用的。注意，基本类型（int、boolean 等）不能设置成 null | true\|false                                           | false                                                        |
| logPrefix                              | 指定 MyBatis 增加到日志名称的前缀                            | 任何字符串                                            | Not set                                                      |
| loglmpl                                | 指定 MyBatis 所用日志的具体实现，未指定时将自动査找          | SLF4J<br/>LOG4J                                       | Not set                                                      |
| proxyFactory                           | 指定 MyBatis 创建具有延迟加栽能力的对象所用到的代理工具      | CGLIB<br/>JAVASSIST                                   | JAVASSIST （MyBatis 版本为 3.3 及以上的）                    |
| vfsImpl                                | 指定 VFS 的实现类                                            | 提供 VFS 类的全限定名，如果存在多个，可以使用逗号分隔 | Not set                                                      |
| useActualParamName                     | 允许用方法参数中声明的实际名称引用参数。要使用此功能，项目必须被编译为 Java 8 参数的选择。（从版本 3.4.1 开始可以使用） | true\|false                                           | true                                                         |

### Mybatis 注解支持

| 注解                                                         | 使用对象 | 描述                                                         |
| :----------------------------------------------------------- | :------- | :----------------------------------------------------------- |
| `@ConstructorArgs`                                           | 方法     | 收集一组结果传递给一个结果对象的构造方法。属性有：`value`，它是形式参数数组。 |
| `@Arg`                                                       | N/A      | 单参数构造方法，是 ConstructorArgs 集合的一部分。属性有：`id`, `column`, `javaType`, `jdbcType`, `typeHandler`, `select` 和 `resultMap`。id 属性是布尔值，来标识用于比较的属性，和`` XML 元素相似。 |
| `@TypeDiscriminator`                                         | 方法     | 一组实例值被用来决定结果映射的表现。属性有：`column`, `javaType`, `jdbcType`, `typeHandler` 和 `cases`。cases 属性是实例数组。 |
| `@Case`                                                      | N/A      | 单独实例的值和它对应的映射。属性有：`value`, `type`, `results`。results 属性是结果数组，因此这个注解和实际的 `ResultMap` 很相似，由下面的 `Results` 注解指定。 |
| `@Results`                                                   | 方法     | 结果映射的列表，包含了一个特别结果列如何被映射到属性或字段的详情。属性有：`value`, `id`。value 属性是 `Result` 注解的数组。这个 id 的属性是结果映射的名称。 |
| `@Result`                                                    | N/A      | 在列和属性或字段之间的单独结果映射。属性有：`id`, `column`, `javaType`, `jdbcType`, `typeHandler`, `one`, `many`。id 属性是一个布尔值，来标识应该被用于比较（和在 XML 映射中的``相似）的属性。one 属性是单独的联系，和 `` 相似，而 many 属性是对集合而言的，和``相似。它们这样命名是为了避免名称冲突。 |
| `@One`                                                       | N/A      | 复杂类型的单独属性值映射。属性有：`select`，已映射语句（也就是映射器方法）的全限定名，它可以加载合适类型的实例。`fetchType`会覆盖全局的配置参数 `lazyLoadingEnabled`。**注意** 联合映射在注解 API中是不支持的。这是因为 Java 注解的限制,不允许循环引用。 |
| `@Many`                                                      | N/A      | 映射到复杂类型的集合属性。属性有：`select`，已映射语句（也就是映射器方法）的全限定名，它可以加载合适类型的实例的集合，`fetchType` 会覆盖全局的配置参数 `lazyLoadingEnabled`。**注意** 联合映射在注解 API中是不支持的。这是因为 Java 注解的限制，不允许循环引用 |
| `@MapKey`                                                    | 方法     | 这是一个用在返回值为 Map 的方法上的注解。它能够将存放对象的 List 转化为 key 值为对象的某一属性的 Map。属性有： `value`，填入的是对象的属性名，作为 Map 的 key 值。 |
| `@Options`                                                   | 方法     | 这个注解提供访问大范围的交换和配置选项的入口，它们通常在映射语句上作为属性出现。`Options` 注解提供了通俗易懂的方式来访问它们，而不是让每条语句注解变复杂。属性有：`useCache=true`, `flushCache=FlushCachePolicy.DEFAULT`, `resultSetType=DEFAULT`, `statementType=PREPARED`, `fetchSize=-1`, `timeout=-1`, `useGeneratedKeys=false`, `keyProperty=""`, `keyColumn=""`, `resultSets=""`。值得一提的是， Java 注解无法指定 `null` 值。因此，一旦你使用了 `Options` 注解，你的语句就会被上述属性的默认值所影响。要注意避免默认值带来的预期以外的行为。  注意： `keyColumn` 属性只在某些数据库中有效（如 Oracle、PostgreSQL等）。请在插入语句一节查看更多关于 `keyColumn` 和 `keyProperty` 两者的有效值详情。 |
| `@Insert`<br />`@Update`<br />`@Delete`<br />`@Select`       | 方法     | 这四个注解分别代表将会被执行的 SQL 语句。它们用字符串数组（或单个字符串）作为参数。如果传递的是字符串数组，字符串之间先会被填充一个空格再连接成单个完整的字符串。这有效避免了以 Java 代码构建 SQL 语句时的“丢失空格”的问题。然而，你也可以提前手动连接好字符串。属性有：`value`，填入的值是用来组成单个 SQL 语句的字符串数组。 |
| `@InsertProvider`<br />`@UpdateProvider`<br />`@DeleteProvider`<br />`@SelectProvider` | 方法     | 允许构建动态 SQL。这些备选的 SQL 注解允许你指定类名和返回在运行时执行的 SQL 语句的方法。（自从MyBatis 3.4.6开始，你可以用 `CharSequence` 代替 `String` 来返回类型返回值了。）当执行映射语句的时候，MyBatis 会实例化类并执行方法，类和方法就是填入了注解的值。你可以把已经传递给映射方法了的对象作为参数，"Mapper interface type" 和 "Mapper method" and "Database ID" 会经过 `ProviderContext` （仅在MyBatis 3.4.5及以上支持）作为参数值。（MyBatis 3.4及以上的版本，支持多参数传入） 属性有： `value`, `type`, `method`。 `value` and `type` 属性需填入类(The `type` attribute is alias for `value`, you must be specify either one)。 `method` 需填入该类定义了的方法名 (Since 3.5.1, you can omit `method` attribute, the MyBatis will resolve a target method via the `ProviderMethodResolver` interface. If not resolve by it, the MyBatis use the reserved fallback method that named `provideSql`)。 **注意** 接下来的小节将会讨论类，能帮助你更轻松地构建动态 SQL。 |
| `@Param`                                                     | 参数     | 如果你的映射方法的形参有多个，这个注解使用在映射方法的参数上就能为它们取自定义名字。若不给出自定义名字，多参数（不包括 `RowBounds` 参数）则先以 "param" 作前缀，再加上它们的参数位置作为参数别名。例如 `#{param1}`, `#{param2}`，这个是默认值。如果注解是 `@Param("person")`，那么参数就会被命名为 `#{person}`。 |
| `@SelectKey`                                                 | 方法     | 这个注解的功能与 `` 标签完全一致，用在已经被 `@Insert` 或 `@InsertProvider` 或 `@Update` 或 `@UpdateProvider` 注解了的方法上。若在未被上述四个注解的方法上作 `@SelectKey` 注解则视为无效。如果你指定了 `@SelectKey` 注解，那么 MyBatis 就会忽略掉由 `@Options` 注解所设置的生成主键或设置（configuration）属性。属性有：`statement` 填入将会被执行的 SQL 字符串数组，`keyProperty` 填入将会被更新的参数对象的属性的值，`before` 填入 `true` 或 `false` 以指明 SQL 语句应被在插入语句的之前还是之后执行。`resultType` 填入 `keyProperty` 的 Java 类型和用 `Statement`、 `PreparedStatement` 和 `CallableStatement` 中的 `STATEMENT`、 `PREPARED` 或 `CALLABLE` 中任一值填入 `statementType`。默认值是 `PREPARED`。 |
| `@ResultMap`                                                 | 方法     | 这个注解给 `@Select` 或者 `@SelectProvider` 提供在 XML 映射中的 `` 的id。这使得注解的 select 可以复用那些定义在 XML 中的 ResultMap。如果同一 select 注解中还存在 `@Results` 或者 `@ConstructorArgs`，那么这两个注解将被此注解覆盖。 |
| `@ResultType`                                                | 方法     | 此注解在使用了结果处理器的情况下使用。在这种情况下，返回类型为 void，所以 Mybatis 必须有一种方式决定对象的类型，用于构造每行数据。如果有 XML 的结果映射，请使用 `@ResultMap` 注解。如果结果类型在 XML 的 `` 节点中指定了，就不需要其他的注解了。其他情况下则使用此注解。比如，如果 @Select 注解在一个将使用结果处理器的方法上，那么返回类型必须是 void 并且这个注解（或者@ResultMap）必选。这个注解仅在方法返回类型是 void 的情况下生效。 |
| `@Flush`                                                     | 方法     | 如果使用了这个注解，定义在 Mapper 接口中的方法能够调用 `SqlSession#flushStatements()` 方法。（Mybatis 3.3及以上） |
