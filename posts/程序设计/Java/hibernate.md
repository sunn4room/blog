---
date: 2020-08-29 09:45:58
tags:
- jpa
- java
- hibernate
---

# Hibernate

Hibernate 解决了关系数据库和面向对象程序设计之间的映射问题，使得开发者可以通过面向对象的方式解决持久化问题。但 Hibernate 绝对不是面向对象的数据库，而是基于 JDBC 的，针对关系数据库的。

<!-- more -->

![1567412910234](Hibernate/1567412910234-1598665457270.png)

## Hello Hibernate

### Hello Hibernate

持久化对象

```java
/* package、import */
@Entity
@Table("person_inf")
public class Person {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column("id")
    private Integer id;
    
    @Column("name")
    private String name;
    
    /* 构造器、getter、setter */
}
```

hibernate.cfg.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
    "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
    "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">

<hibernate-configuration>
	<session-factory>
		<property name="connection.driver_class">com.mysql.cj.jdbc.Driver</property>
		<property name="connection.username">root</property>
		<property name="connection.password">888888</property>
		<property name="connection.url">jdbc:mysql://localhost:3306/hibernate?useSSL=false&amp;serverTimezone=Asia/Shanghai&amp;allowPublicKeyRetrieval=true</property>
		<property name="c3p0.max_size">20</property>
		<property name="c3p0.min_size">1</property>
		<property name="c3p0.timeout">5000</property>
		<property name="c3p0.max_statements">100</property>
		<property name="c3p0.idle_test_period">3000</property>
		<property name="c3p0.acquire_increment">2</property>
		<property name="c3p0.validate">true</property>
		<property name="show_sql">true</property>
		<property name="format_sql">true</property>
		<property name="hbm2ddl.auto">update</property>
		<property name="dialect">org.hibernate.dialect.MySQL5InnoDBDialect</property>
		<!--property name="hibernate.connection.autocommit">true</property-->
		<!--property name="hibernate.current_session_context_class">thread</property-->
		<mapping class="xxx.xxx.Person"/>
  </session-factory>
</hibernate-configuration>
```

操作数据库

```java
/* package、import */
public class Main {
    public static void main(String[] args) {
        Configuration conf = new Configuration().configure();
        try (
        	SessionFactory sessionFactory = conf.buildSessionFactory();
            Session session = sessionFactory.openSession();
        ) {
            Transaction tx = session.beginTransaction();
            Person person = new Person();
            person.setName("xxx");
            session.save(person);
            tx.commit();
        }
    }
}
```

## Hibernate 配置

### 配置方式

- hibernate.properties 只能配置属性参数
- hibernate.cfg.xml 可以配置属性参数和持久化类
- 调用对象方法进行配置
  - `setProperty(String name, String value)`
  - `setProperties(Properties properties)`
  - `addAnnotatedClass(Class clazz)`
  - `addPackage(String package)`

### 属性参数配置

| 属性                                  | **描述**                                                  |
| :------------------------------------ | :-------------------------------------------------------- |
| **hibernate.dialect**                 | 这个属性使 Hibernate 应用为被选择的数据库生成适当的 SQL。 |
| **hibernate.connection.driver_class** | JDBC 驱动程序类。                                         |
| **hibernate.connection.url**          | 数据库实例的 JDBC URL。                                   |
| **hibernate.connection.username**     | 数据库用户名。                                            |
| **hibernate.connection.password**     | 数据库密码。                                              |
| **hibernate.connection.autocommit**   | 允许在 JDBC 连接中使用自动提交模式。                      |
| **hibernate.max_fetch_depth**         | 关联映射中的外连接抓取深度                                |
| **hibernate.show_sql**                | 输出所有SQL语句到控制台                                   |
| **hibernate.format_sql**              | 在log和console中打印出更漂亮的SQL                         |
| **hibernate.jdbc.fetch_size**         | 指定JDBC抓取数量的大小                                    |
| **hibernate.jdbc.batch_size**         | 允许Hibernate使用JDBC2的批量更新的大小                    |
| **hibernate.hbm2ddl.auto**            | update、create、create-drop                               |

## PO 详解

### PO 映射配置（注解）

Hibernate 的 PO 映射可以采用 JPA 的映射注解

#### 类映射

##### @Entity

声明实体，实体就是持久类对象。

| 属性名 | 描述   |
| ------ | ------ |
| name   | 实体名 |

##### @Table

映射表

| 属性名           | 描述                                   |
| ---------------- | -------------------------------------- |
| name             | 表名                                   |
| indexes          | 设置索引，@Index 数组                  |
| uniqueConstaints | 设置唯一性约束，@UniqueConstraint 数组 |

##### @Index

映射索引

| 属性名     | 描述           |
| ---------- | -------------- |
| name       | 索引名         |
| columnList | 索引列名数组   |
| unique     | 是否具有唯一性 |

##### @UniqueConstraints

映射唯一约束

| 属性名      | 描述               |
| ----------- | ------------------ |
| columnNames | 唯一性约束列名数组 |

#### 属性映射

##### @Id

映射主键列

##### @GeneratedValue

自动生成主键值

| 属性名   | 描述                    |
| -------- | ----------------------- |
| strategy | GenerationType.IDENTITY |

##### @Column

映射列

| 属性名   | 描述               |
| -------- | ------------------ |
| name     | 列名               |
| length   | 存储数据的最大长度 |
| nullable | 是否可以为 null    |
| unique   | 是否具有唯一性     |

##### @Temporal

##### @Lob

##### @Basic

##### 组件属性映射

###### @Embeddable

修饰组件类，并使用 @Parent 修饰一个宿主类型的属性

###### @Embedded

修饰组件属性

###### @AttributeOverrides

组件属性的映射配置

##### 集合属性映射

###### @ElementCollection

映射集合属性

| 属性名      | 描述                             |
| ----------- | -------------------------------- |
| targetClass | 元素类型                         |
| fetch       | 抓取策略 FetchType.LAZY \| EAGER |

###### @CollectionTable

映射集合属性对应的外部表

| 属性名      | 描述                         |
| ----------- | ---------------------------- |
| name        | 元素类型                     |
| joinColumns | 设置外键列，@JoinColumn 数组 |

> - 如果元素类型是普通类型，可以使用 @Column 设置外部表中的列名
> - 如果元素类型是组件，不需要额外配置

###### @OrderColumn

设置 List 集合的索引列名

###### @MapKeyColumn

如果 Map 的 key 是普通类型，指定 key 列名

###### @MapKeyClass

指定 key 的类型

##### @Transient

#### 关联映射

> 关联映射是实体和实体之间的相互关联，二者在系统中的地位是平等的；集合属性映射的对象不能当做实体来使用，所有的数据库持久化操作都要依托与宿主实体来完成。但不管怎么说，二者在对应关系和数据库底层实现上有很多共同点。

##### @JoinColumn

外键列

| 属性名               | 描述                 |
| -------------------- | -------------------- |
| name                 | 外键列名             |
| referencedColumnName | 指定所参照的主键列名 |

##### @JoinTable

连接表

| 属性名             | 描述                   |
| ------------------ | ---------------------- |
| name               | 连接表名               |
| joinColumns        | 配置当前实体           |
| inverseJoinColumns | 配置当前实体的关联实体 |

##### 通用属性

| 属性名       | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| targetEntity | 对应的实体类                                                 |
| fetch        | 抓取策略 FetchType.LAZY \| EAGER                             |
| cascade      | 级联策略 CascadeType.ALL \| MERGE \| PERSIST \| REFRESH \| REMOVE |

##### @OneToOne

##### @ManyToOne

##### @OneToMany

##### @ManyToMany

#### 继承映射

##### 单一表策略

###### @DiscriminatorColumn

在根类中增加辨别者列

| 属性名          | 描述                                      |
| --------------- | ----------------------------------------- |
| discrimatorType | DiscrimatorType.CHAR \| INTEGER \| STRING |

###### @DiscrimatorValue

##### 多表策略

###### @Inheritance

| 属性名   | 描述                                      |
| -------- | ----------------------------------------- |
| strategy | InheritanceType.JOINED \| TABLE_PER_CLASS |

- JOINED 子类中的父类属性将被保存在父类表中
- TABLE_PER_CLASS 子类的父类属性依然被保存在子类表中

### PO 操作

#### PO 的三种状态

- 瞬态：在内存中已创建，但未与 Session 关联，对它的修改不会转换成持久化操作。
- 持久化态：当瞬态对象关联 Session 或者刚从 Session 里加载的对象，都将进入持久化态。持久化态对象在数据库中都有对应的一条记录，对它的修改都将被 Hibernate 检测到，并转换成持久化操作。
- 脱管态：与之关联的 Session 关闭后，对象将进入脱管状态，而并不会被 JVM 处理掉。对它的修改不会立即生效，直到再次和 Session 关联，还是会转换成持久化操作的。

#### 常用方法

这些操作都是由 Session 对象完成的

- 瞬态 --->  持久化态
  - `Serializable save(Object obj)` 立即生效，并返回标识属性值
  - `void persist(Object obj)` 延迟生效
- 加载持久化态对象
  - `<T> T get(Class<T> entityType, Serializable id)` 立即生效，未找到时返回 null
  - `<T> T load(Class<T> theClass, Serializable id)` 延迟生效，返回未初始化的代理对象
- 更新持久化态对象
  - 对象的 setter 方法，必然会在 flush 或者连接关闭前自动生效
  - `void flush()` 强制更新
- 删除持久化态对象
  - `void delete(Object object)` 
- 脱管态  --->  持久化态
  - `void update(Object object)` or  `void updateOrSave(Object object)`
  - `Object merge(Object object)` 返回一个处于持久化态的副本

## JPQL查询

JPQL 是 Java 官方给出的面向对象的查询语言。

### JPQL 语法



## 动态条件查询

## 事务管理



## 缓存机制