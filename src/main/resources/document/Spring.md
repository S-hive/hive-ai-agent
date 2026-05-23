## Spring 的核心定义

Spring 是一款开源的、轻量级（相较于 EJB 等传统重量级框架）的 Java 企业级应用**开发框架**

## Getting Started

### Reference Documentation

For further reference, please consider the following sections:

- [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
- [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/4.0.1/maven-plugin)
- [Create an OCI image](https://docs.spring.io/spring-boot/4.0.1/maven-plugin/build-image.html)
- [Spring Web](https://docs.spring.io/spring-boot/4.0.1/reference/web/servlet.html)

### Guides

The following guides illustrate how to use some features concretely:

- [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
- [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
- [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM. While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent. To prevent this, the project POM contains empty overrides for these elements. If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

## IOC容器

### 概念

1. 控制反转, 是将**对象的创建**以及**对象之间的调用过程**，统一交给 Spring 框架进行管理。
2. 实现程序中各个模块之间的**耦合度降低**，提升代码的灵活性、可维护性与可扩展性。

### 底层原理

xml解析, 工厂模式, 反射

---

**原始方式:** 通过在UserService调用new()方法获得UserDao对象, 通过对象调用add()方法

**缺点:** 耦合度高



**解决一: 工厂模式**

通过一个中间工具类解耦



**缺点:** 工厂还是有耦合度

**解决二: IOC模式**



### 接口(BeanFactory)

IOC 思想是基于 IOC 容器来完成的，而**IOC 容器的底层本质就是 “对象工厂”**（负责对象的创建、管理与依赖注入）

Spring 通过**两个接口**实现 IOC 容器，功能和定位不同：

1. BeanFactory
   - 是 IOC 容器的基本实现，属于 Spring 内部使用的接口，不对外开放给开发人员直接使用。
   - 加载配置文件时不会创建对象, 只有在使用对象时才会创建对象
2. ApplicationContext
   - 是`BeanFactory`接口的子接口，在其基础上扩展了更多、更强大的功能（如国际化支持、事件发布等），通常由开发人员直接使用。
   - 加载配置文件时就会创建配置文件对象

---

**ApplicationContext主要实现类:**

**`FileSystemXmlApplicationContext`**

- **加载路径规则**：基于**操作系统的文件系统路径**（物理路径）加载配置文件，需要指定文件在硬盘上的完整路径（或相对当前项目运行目录的路径）。

**`ClassPathXmlApplicationContext`**

- **加载路径规则**：基于**类路径（classpath）加**载配置文件，直接从项目的`src/main/resources`（Maven/Gradle 项目的资源目录）等类路径目录中查找文件，无需写完整物理路径。



### Bean管理

Bean 管理是 Spring IOC 容器的核心操作之一，具体包含两个核心动作：

1. **Spring 创建对象**：**实例化** Bean 对象（替代传统的`new`关键字创建对象）；
2. **Spring 注入属性**：为 Bean 对象的属性（包括普通属性、对象属性等）**赋值**，实现对象之间的依赖注入。

### 操作方式

### 基于xml

##### 创建对象

```xml
<bean id = "别名" class = "类的全路径"></bean>
```

其他标签:

* `name` : 和`id` 类似, 取一个别名, 区别是可以带上特殊字符

##### 使用方法:

```java
BeanFactory context = new ClassPathXmlApplicationContext("xml配置文件类路径");
Xxx xxx = context.getBean("别名", Xxx.class);
```

注意: 该对象通过无参构造器创建

##### 注入属性 (就是给属性赋值)

DI: **依赖注入（Dependency Injection）** 是属性注入的核心实现方式，基于 XML 配置的属性注入主要有两种方式：

1. **使用 setXxx() 方法注入**

```xml
<!--创建对象-->
<bean id = "别名" class = "类的全路径">  
<!--使用property完成属性注入-->
    <property name="要注入的属性名称" value="值"></property>
</bean>
```

是通过调用对应属性名称的setXxx()方法实现注入, 所以必须要有对应属性的set()

==**`<property>`标签对应 set 注入**==

**==<ref>标签专门处理对象相关的==** 

2. **使用有参数构造器注入**

   通过名称

```xml
<bean id = "别名" class = "类的全路径">  
    <constructor-arg name="形参1" value="值"></constructor-arg>
    <constructor-arg name="形参2" value="值"></constructor-arg>
</bean>
```

​	通过索引

```xml
<bean id = "别名" class = "类的全路径">  
    <!--第一个形参-->
    <constructor-arg index="0" value="值"></constructor-arg>
    <constructor-arg index="1" value="值"></constructor-arg>
</bean>
```

3. **P名称空间注入(简化)**

   1. 配置文件头添加p名称空间

   

   2. 属性注入

   

   底层使用set()方法注入

   ---

4. **注入属性 - 外部Bean**

就是赋值外部类的实例

```java
public interface UserDao {
    
}
public class UserDaoImpl implements UserDao {
    @Override
    public void update() {
        ...
    }
}

public class UserService {
    private UserDao userDao;
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
}
```

通过xml文件在`UserService` 类里调用`UserDaoImpl` 方法

```xml
<!-- service 和 dao 对象创建-->
<bean id = "userDao111" class = "com.UserDaoImpl"></bean>
<bean id = "userService" class = "com.UserService">
	<!-- 注入 userDao 对象-->
    <property name = "userDao" ref="userDao111"></property>
</bean>
```

5. **注入属性 - 内部Bean **

   ```xml
   <bean id = "userService" class = "com.UserService">
       <property name = "userDao">
           <!-- 在内部嵌套创建 userDao 对象-->
           <bean id = "userDao" class = "com.UserDaoImpl">
           	<property name = "name" value = "值"></property>
           </bean>
       </property>
   </bean>
   ```

6. **级联赋值**

当一个 Bean 的属性是另一个对象时，不仅能给这个对象属性本身赋值，还能直接给这个对象的 “内部属性” 赋值

```xml
<bean id = "userDao" class = "com.UserDaoImpl">
	<property name = "age" value = 10></property>
</bean>

<bean id = "userService" class = "com.UserService">
    <!-- 一级级联 -->
    <property name = "userDao" ref="userDao"></property>
</bean>
```

```xml
<bean id = "userDao" class = "com.UserDaoImpl"></bean>
<bean id = "userService" class = "com.UserService">
    <property name = "userDao" ref="userDao"></property>
    <!-- 一级级联 -->
    <property name = "userDao.age" value = 10></property>
</bean>
```

`name = "userDao.age"` 会调用getUserDao(), 要确保有这个方法

##### 其他类型的属性注入

1. `null` 值

```xml
<property name = "属性名">
<null></null>
</property>
```

2. 特殊符号

```xml
<property name = "属性名" value= "&lt;&lt;水浒传&gt;&gt;"></property>
```

把特殊符号内容写到CDATA

```xml
<property name = "属性名">
	<value>
    	<![CDATA[<<水浒传>>]]>
    </value>
</property>
```

3. 数组类型

```xml
<bean id = "userDao" class = "com.UserDaoImpl">
	<property name = "array">
    	<array>
            <value>1</value>
            <value>2</value>
            <value>3</value>
        </array>
    </property>
</bean>
```

4. `list` 类型

```xml
<bean id = "userDao" class = "com.UserDaoImpl">
	<property name = "list">
    	<list>
        	<value>1</value>
            <value>2</value>
        </list>
    </property>
</bean>
```

5. `map` 类型

```xml
<bean id = "userDao" class = "com.UserDaoImpl">
	<property name = "map">
    	<map>
        	<entry key = "1" value = "3"></entry>
            <entry key = "2" value = "3"></entry>
        </map>
    </property>
</bean>
```

6. 集合类型

```xml
<bean id = "userDao" class = "com.UserDaoImpl">
	<property name = "set">
    	<set>
        	<value>1</value>
            <value>2</value>
        </set>
    </property>
</bean>
```

7. `list` 集合里存储对象

```xml
<bean id = "userDao" class = "com.UserDaoImpl">
	<property name = "list">
    	<list>
        	<ref bean = "对象1"></ref>
            <ref bean = "对象2"></ref>
        </list>
    </property>
</bean>
```

8. 把集合注入部分提取出来

* 修改头部配置(`util` 两行)





#### FactoryBean

Spring 容器管理的 Bean 分为两类，核心区别在于 “配置的 Bean 类型” 与 “实际返回的 Bean 类型” 是否一致：

##### 1. 普通 Bean

- **核心特点**：配置文件中定义的`bean`的`class`类型，与 Spring 容器最终返回的 Bean 类型**完全一致**。

```xml
<!-- 配置的class是com.Book，返回的Bean类型就是Book -->
<bean id="book" class="com.Book"></bean>
```

##### 2. 工厂 Bean（FactoryBean）

- **核心特点**：配置文件中定义的`bean`的`class`类型（工厂类），与最终返回的 Bean 类型**可以不一致**（由工厂类决定返回类型）

```java
public class Student {
    public String name;
}
```

```java
public class myBean implements FactoryBean<Student> {

    // 定义放回Bean
    // @Nullable：表示该参数 / 返回值 “可以为 null”
    @Override
    public Student getObject() throws Exception {
        Student student = new Student();
        student.name = "Anni";
        return student;
    }

    // 声明目标 Bean 的类型（Class 对象）
    @Override
    public @Nullable Class<?> getObjectType() {
        return null;
    }

    /*指定工厂 Bean 创建的目标 Bean 是否为单例模式
    （即容器中是否只存在该目标 Bean 的一个实例）*/
    @Override
    public boolean isSingleton() {
        return FactoryBean.super.isSingleton();
    }
}

```

```xml
<bean id= "1" class= "com.MyBeen"></bean>
```

```java
@Test
public void test() {
    ApplicationContext context = 
    new ClassPathXmlApplicationContext("bean.xml");
Student student = context.getBean("1", Student.class);
System.out.println(student);
}
```

#### Bean作用域

作用域: 容器中 Bean 实例的数量（单例 / 多例）以及作用范围（全局 / 局部）





地址一样, 说明是单实例对象

##### 设置单实例, 多实例(属性设置)

通过标签属性`scope` 设置

属性值:

1. `singleton` 默认值, 表示单实例对象
2. `prototype` 多实例对象
3. `request` 请求作用域
4. `session` 会话作用域

```xml
<bean id= "1" class= "com.MyBeen" scope = "prototype"></bean>
```



地址不一样 -> 多实例对象

**注意:** 

**singleton（单例）**加载配置文件（初始化容器）的阶段，就会创建该 Bean 的唯一实例，并将其存入容器中；

**prototype（多例）**只有当调用 `getBean()` 方法时，才会创建一个全新的 Bean 实例；

**request** 每次 HTTP 请求都会创建一个全新的 Bean 实例，请求结束后 Bean 被销毁。

**session** 每个用户会话（Session）对应一个 Bean 实例，会话创建时初始化，会话失效（如超时、手动销毁）后 Bean 被销毁。

#### Bean生命周期( 5 步 )

1. **实例化：创建 Bean 实例**

- **操作**：Spring 容器通过 Bean 对应的类的**无参数构造器**，创建一个 Bean 的原始对象（仅完成对象实例化，属性未赋值）；
- **注意**：若类没有无参构造器，且未配置其他实例化方式（如工厂方法），容器会抛出 `NoSuchMethodException`。

2. **依赖注入：为 Bean 赋值与引用**

- **操作**：Spring 容器根据配置（XML 的 `<property>`、注解的 `@Autowired` 等），为 Bean 的属性设置值，并注入依赖的其他 Bean（本质是调用 Bean 的 `set` 方法或构造器）；
- **结果**：Bean 完成属性初始化，持有依赖的其他对象引用。

3. **初始化：执行自定义初始化逻辑**

- **操作**：调用 Bean 的**初始化方法**（需手动配置），执行自定义的初始化逻辑（如资源加载、数据初始化等）；
- **配置方式**：
  - XML 配置：`<bean init-method="initMethodName">`；
  - 注解配置：类实现 `InitializingBean` 接口，重写 `afterPropertiesSet()` 方法；
- **执行时机**：依赖注入完成后自动调用。

4. **使用：Bean 处于可用状态**

- **操作**：Bean 已完成实例化、依赖注入、初始化，可通过 `getBean()` 从容器中获取并使用；
- **持续时间**：单例 Bean 会一直处于可用状态，直到容器关闭。

5. **销毁：执行自定义销毁逻辑**

- **操作**：当 Spring 容器关闭时，调用 Bean 的**销毁方法**（需手动配置），执行自定义的销毁逻辑（如释放资源、关闭连接等）；









##### Bean的后置处理器 ( 7 步 )



```java
public class myBean implements BeanPostProcessor {
    // 初始化前
    @Override
    public @Nullable Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化前");
    }
    // 初始化后
    @Override
    public @Nullable Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化后");
    }
}

```

配置文件



会给当前文件的所有Bean执行这个后置处理器



#### 自动装配

允许 Spring 容器自动为一个 Bean 注入其依赖的其他 Bean（无需手动在 XML 配置或注解中显式指定依赖关系）

通过`<bean>`标签的`autowire`属性可实现 Bean 的自动装配

**`autowire`属性:**

* `byName`：按属性名称注入, 被注入 Bean 的`id`必须和当前 Bean 的属性名完全相同。

* `byType`：按属性类型注入, 容器中必须只有一个该类型的 Bean（若存在多个同类型 Bean，会抛出异常）

```xml
<!-- 定义Dao Bean，id为userDao -->
<bean id="userDao" class="com.example.UserDaoImpl"/>

<!-- Service Bean通过byName装配：属性名userDao 匹配 id=userDao的Bean -->
<bean id="userService" class="com.example.UserService" autowire="byName"/>

```

```xml
<!-- Service Bean通过byType装配：属性类型UserDao 匹配 类型为UserDaoImpl的Bean -->
<bean id="userService" class="com.example.UserService" autowire="byType"/>
```

### 引用外部属性文件

举例: 引入德鲁伊数据库连接池

##### 普通方法:

```xml
<!--直接配置连接池-->
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="com.mysql.jdbc.Driver"></property>
    <property name="url" value="jdbc:mysql://localhost:3306/userDb"></property>
    <property name="username" value="root"></property>
    <property name="password" value="root"></property>
</bean>
```

##### xml方法

1, 引入context名称空间

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       <!-- context -->
       xmlns:context="http://www.springframework.org/schema/context" 
       xsi:schemaLocation="http://www.springframework.org/schema/beans 	
           http://www.springframework.org/schema/beans/spring-beans.xsd
		  <!-- context -->
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
```

2. 编写properties配置文件

```properties
driverClass=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/theName
userName=root
password=pwd
```

3. `xml` 中配置连接池
   1. 引入外部配置文件
   2. 配置连接池

```xml
<!--引入外部属性文件-->
<context:property-placeholder location="classpath:jdbc.properties"/>

<!--配置连接池-->
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="${对应数据库的键}"></property>
    <property name="url" value="${url}"></property>
    <property name="username" value="${userName}"></property>
    <property name="password" value="${password}"></property>
</bean>
```

4. 配置jdbcTemplate

   ```xml
   <!-- 2. 配置JdbcTemplate：只注入数据源，不写连接属性 -->
   <bean id="jdbcTemplate" 
         class="org.springframework.jdbc.core.JdbcTemplate"
         p:dataSource-ref="dataSource"/>
   ```

   

必须是这些`name` 吗 不能改变吗

> `<property name="XXX">`中的`name`值，对应的是`DruidDataSource`类的**属性名**（或对应的 setter 方法名），Spring 通过反射调用`setXXX()`方法完成属性注入，因此`name`值必须与类的属性 /setter 方法对应，不能随意自定义。
>
> ```java
> public class DruidDataSource extends DruidAbstractDataSource implements DataSource, DruidDataSourceMBean, ManagedDataSource {
>     // ---------------------- 基础数据库配置 ----------------------
>     // JDBC 驱动类名（对应 ${jdbc.driver}）
>     private String driverClassName;
>     // 数据库连接 URL（对应 ${jdbc.url}）
>     private String url;
>     // 数据库用户名（对应 ${jdbc.username}）
>     private String username;
>     // 数据库密码（对应 ${jdbc.password}，支持加密）
>     private String password;
> ```
>
> 

**`<bean>`的`id`属性：完全可以自定义, `<property>`的`name`属性：有严格要求，不能随意修改（但存在兼容 / 替代方案）**

##### 注解方法

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

// 标记为Spring配置类
@Configuration
// 引入类路径下的jdbc.properties文件（多个文件可用数组形式{"xxx.properties", "yyy.properties"}）
@PropertySource("classpath:jdbc.properties")
public class SpringConfig {
    // 配置类其他内容（如组件扫描、数据源等）
}
```



### 基于注解

将 Java 类标记为 Spring 容器管理的 Bean

##### 注解种类

* 通用注解 (其他注解的父注解)

  * ### @Component

* 语义化派生注解 (让代码更清晰)

  * **@Service**  业务逻辑层注解
  * **@Controller** 控制层注解
  * **@Repository** 数据访问层注解



##### 创建对象

1. 引入依赖(spring-aop.jar)

2. 引入名称空间

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          <!-- schemaLocation -->
          xsi:schemaLocation="http://www.springframework.org/schema/beans
              http://www.springframework.org/schema/beans/spring-beans.xsd
   ```

3. 开启组件扫描

   核心作用是自动发现并注册符合条件的 Bean

   对于扫描到的候选组件类，Spring 容器会通过反射自动创建该类的实例（即 Bean 对象），默认创建的是**单例 Bean**（整个容器中仅存在一个该类实例），无需开发者手动通过`new`关键字创建对象。

   ```xml
   <!-- 扫描com.example包及其子包下的所有组件类 -->
   <context:component-scan base-package="com.example, ..."></context:component-scan>
   ```

4. 类上添加注解

   ```java
   @Component(value = "uService") //<bean id="uService"
   public class UserService {
      ...
   }
   ```

   不写`value` 会按默认名称(类名首字母小写)赋值`id` 

   ```java
   @Component //<bean id="userService"
   ```

   

   ###### 开启组件扫描的配置细节

   可以配置扫描范围的哪些类不扫描, 那些类可以扫描 (自定义扫描规则)

   1. 包含过滤：`use-default-filters`

      用来指定需要被扫描的类

      ```xml
      <context:component-scan base-package="com.atguigu" use-default-filters="false"> <!-- 关闭默认过滤规则-->
          <!-- 包含@Controller注解的类 -->
          <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
          <!-- 再包含@Service注解的类 -->
          <context:include-filter type="annotation" expression="org.springframework.stereotype.Service"/>
      </context:component-scan>
      ```

      > 1. 核心标签：`<context:component-scan>` 
      >     这是 Spring XML 中开启组件扫描的标签，基础功能是扫描指定包下的组件类。这里添加了两个关键属性：
      >     `base-package="com.atguigu"` ：指定扫描的根包（递归扫描该包及其子包）。
      >     `use-default-filters="false"` ：关闭默认过滤规则（Spring 默认会扫描包下所有标注了@Component/@Service/@Controller/@Repository的类，这里关闭后默认规则失效，需要手动配置过滤条件）。
      > 2. 过滤规则：`<context:include-filter>` 
      >     这是 “包含过滤” 标签，用来指定需要被扫描的类，属性说明：
      >     `type="annotation"` ：过滤类型为 “按注解匹配”（即根据类上的注解来筛选）。
      >     `expression="org.springframework.stereotype.Controller"` ：匹配条件是 “类上标注了@Controller注解”（org.springframework.stereotype.Controller是@Controller注解的全类名）。

   2. 排除过滤规则：`base-package` 

      用来指定哪些类不参与扫描

      ```xml
      <context:component-scan base-package="com.atguigu">
          <!-- 排除@Controller注解的类 -->
          <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
          <!-- 再排除@Service注解的类 -->
          <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Service"/>
      </context:component-scan>
      ```

   3. 递归扫描: `base-package` 

      

##### 注入属性

1. @Autowired：按类型自动装配

   - **核心逻辑**：默认根据**属性的类型**，在 Spring 容器中查找匹配的 Bean，找到后自动注入。
   - **场景**：当容器中**只有一个该类型的 Bean**时，直接注入；若有多个同类型 Bean，需配合`@Qualifier`指定名称。

   ```java
   @Service // 创建了该类对象 (UserDao类也要通过注解创建对象@Repository)
   public class UserService {
       // 按类型匹配UserDao的实现类，自动注入
       @Autowired
       private UserDao userDao;
   }
   ```

2. @Qualifier：按名称注入（配合@Autowired）

   - **核心逻辑**：单独使用无效，需和`@Autowired`搭配，**指定要注入的 Bean 的名称**。
   - **场景**：容器中存在多个同类型 Bean 时，解决类型冲突问题。

   ```java
   @Service
   public class UserService {
       // 按类型匹配UserDao，再按名称"userDaoImpl2"注入
       @Autowired
       @Qualifier("userDaoImpl2") // value = "userDaoImpl2"也行
       private UserDao userDao;
   }
   ```

3. @Resource：按类型 / 名称注入（JDK 标准注解）

   - **核心逻辑**：默认按**属性名称**匹配 Bean；若名称匹配失败，再按**类型**匹配。也可手动指定`name`或`type`。
   - **特点**：是 JSR-250 标准注解（非 Spring 原生），兼容性更强。

   ```java
   @Service
   public class UserService {
       // 1. 默认按名称"userDao"注入
       @Resource
       private UserDao userDao;
   
       // 2. 手动指定名称注入
       @Resource(name = "userDaoImpl1")
       private UserDao userDao1;
   }
   ```

4. @Value：注入普通类型属性

   普通方法在初始化属性时需要调用`setXxx()`方法, 这里可以直接赋值

   - **核心逻辑**：用于注入**基本类型（如 String、int）、字符串常量**，或读取配置文件中的值（配合`@PropertySource`）。

   ```java
   @Service
   public class UserService {
       // 注入字符串常量
       @Value("默认用户名")  // value = "默认用户名" 也行
       private String defaultName;
   
       // 读取配置文件中的值（需先引入配置文件）
       @Value("${jdbc.url}")
       private String jdbcUrl;
   }
   ```

   

### 完全注解开发

把配置文件的内容放到配置类中

##### 1. 先注册 Bean（明确 Bean 名称和类型）

```java
// 注册 UserService Bean，默认名称为 userService
@Service
public class UserService {
    public void queryUser() {
        System.out.println("用户业务逻辑执行");
    }
}

// 配置类开启组件扫描
@Configuration
@ComponentScan("com.example")
public class SpringConfig {}
```

##### 2. 获取 Bean（使用两个参数的 `getBean` 方法）

```java
public class Test {
    public static void main(String[] args) {
        // 初始化容器
        ApplicationContext context = new AnnotationConfigApplicationContext(SpringConfig.class);
        
        // 第一个参数 "userService"：定位 Bean；第二个参数 UserService.class：类型转换/校验
        UserService userService = context.getBean("userService", UserService.class);
        
        // 直接调用方法，无需类型转换
        userService.queryUser();
    }
}
```

 context.getBean("userService", UserService.class);

一、第一个参数：`"userService"`（调用类的唯一id）

二、第二个参数：`UserService.class`（自动将容器中找到的 Bean 实例转换为该类型，无需开发者手动进行强制类型转换，简化代码）

## AOP

### 概念

传统开发中，非业务逻辑（如日志、事务、权限校验）会分散在各个业务方法中（比如每个 Service 方法都要写日志代码），导致代码重复、业务逻辑被 “污染”。

AOP 的核心是：将这些分散的非业务逻辑（称为 “切面”）单独提取出来，在不修改原有业务代码的前提下，动态地 “织入” 到业务方法的指定位置（比如方法执行前、执行后）。

### 底层

AOP 的底层是通过**动态代理**技术实现的，而动态代理会根据目标对象是否有接口，分成两种实现方式:

* **目标对象有接口的情况**
  此时 AOP 底层会用JDK 动态代理：
  原理：JDK 原生的Proxy类会动态生成一个实现了目标接口的代理类；
  代理对象和目标对象是 “接口实现” 的关系，外部通过接口调用代理对象，代理对象再调用目标对象的方法。
* **目标对象没有接口的情况**
  此时 AOP 底层会用CGLIB 动态代理：
  原理：通过 CGLIB 库动态生成目标对象的子类作为代理类；
  代理对象是目标对象的子类，重写目标方法并插入增强逻辑，外部直接调用子类（代理对象）的方法。

### JDK动态代理模式实现

1. 调用`newProxyInstance` 方法

   动态生成一个实现了指定接口的代理类实例

   ```java
   static Object newProxyInstance(
       ClassLoader loader,       // 目标对象 / 目标接口的类加载器
       Class<?>[] interfaces,    // 被代理对象实现的接口
       InvocationHandler h       // 调用处理器（增强逻辑的载体）
   )
   ```

2. 编写JDK动态代理代码

   1. 创建接口, 定义方法

      ```java
      public interface UserDao {
          public int add (int a, int b);
      }
      ```

   2. 创建接口实现类, 实现方法

      ```java
      public class UserDaoImpl implements UserDao {
          @Override
          public int add (int a, int b) {
              return a + b;
          }
      }
      ```

   3. 通过动态代理增强类方法 (使用Proxy类创建接口代理对象)

      ```java
      // 实现接口
      class UserDaoProxy implements InvocationHandler {
          // 传入被代理对象 有参构造传递
          private Object obj;
          public UserDaoProxy(Object obj) { // 用Object类型复用性更好
              this.obj = obj;
          }
          @Override
          public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
              System.out.println("方法前执行..." +  method.getName());
              // 执行被增强的方法
              Object res = method.inovke(obj, args); // 对象 参数
              System.out.println("方法后执行...");
              return res;
          }
      }
      
      public static void main(String[] args) {
          Class[] interfaces = {UserDao.class};
          UserDaoImpl userDao = new UserDaoImpl();
          // 获取代理方法对象 (核心)
          UserDao dao = (UserDao) Proxy.newProxyInstance(JDKProxy.class.getClassLoader(), interfaces, new UserDaoProxy(userDao));
          // 调用增强后的方法 
          dao.add(1,2);
      }
      ```
      
### 术语

   **连接点（JoinPoint）**

   - 含义：业务方法中可以插入增强逻辑的位置（比如方法执行前、执行后、抛出异常时）。

   **切入点（Pointcut）**

   - 含义：从所有连接点中筛选出需要插入增强逻辑的连接点（即 “哪些方法需要被增强”）。

   **通知（增强，Advice）**

   - 含义：具体的增强逻辑，以及这个逻辑要在 “什么时候执行”（比如方法前、方法后）
   - 前置通知 @Before、后置通知 @AfterReturning、环绕通知 @Around、异常通知 @AfterThrowing、最终通知 @After
   - @After方法执行后执行(有异常也执行) @AfterReturning方法返回值结果后执行 @AfterThrowing有异常才执行

   **切面（Aspect）**

   - 含义：把 “切入点” 和 “通知”打包在一起的类（即 “要增强哪些方法 + 增强什么逻辑” 的集合）。

### 基于 AspectJ 的 AOP 操作

1. AspectJ 的定位
   - AspectJ 不是 Spring 的组成部分，是一个独立的 AOP 框架；通常与 Spring 框架配合使用，完成 AOP 操作。
2. 基于 AspectJ 实现 AOP 的方式
   - 方式 1：基于 xml 配置文件实现
   - 方式 2：基于注解方式实现（实际开发中更常用）

#### 准备操作

1. 导入依赖



2. 切入点表达式

   1. **作用**

      明确要对哪个类中的哪个方法进行增强（即指定 AOP 的增强目标）。

   2. **语法结构**

      格式为：`execution([权限修饰符] [返回类型] [类全路径] [方法名称]([参数列表]))`

      - 权限修饰符：可选（如`public`、`private`，`*` ,  省略则表示匹配所有权限）；
      - 返回类型：必填（如`void`、`String`，`*`表示匹配任意返回类型）；
      - 类全路径：必填（如`com.example.service.UserService`，`*`可用于模糊匹配，如`com.example.service.*`表示该包下所有类）；
      - 方法名称：必填（如`add`，`*`表示匹配任意方法）；
      - 参数列表：必填（`()`表示无参，`(int)`表示单个 int 参数，`(..)`表示任意参数）

### 注解方式

#### 基本操作

创建被增强类

```java
public class UserDao {
    public int add (int a, int b);
}
```

创建增强类

```java
public class UserProxy {
    public int add (int a, int b);
}
```

进行通知配置

1. 在 spring 配置文件中，开启组件扫描。 (组件扫描要包含增强类!!!!)

   * 添加命名空间(context, aop)
   * <context:component-scan base-packave = ""/>

2. 使用注解创建 User 和 UserProxy 对象

   * @Compent //组件注解

3. 在增强类上面添加注解 @Aspect (标记一个普通 Java 类为「切面类（Aspect）」)

   ```java
   @Component
   @Aspect
   public class UserProxy {
       public int add (int a, int b);
   }
   ```

4. 在spring配置文件中开启生成代理对象

```xml
<!-- 开启Aspect生成代理对象-->
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```

​	会在前面的注解扫描的范围查找类注解

5. 配置不同类型的通知

   在增强类的里面，在通知方法上面添加通知类型注解，使用切入点表达式配置。

   ```java
   @Component
   @Aspect
   public class UserProxy {
       public int add (int a, int b);
       // 前置通知
       // @Before表示作为前置通知
       @Before(value= "execution(* com.myspring.User.add(...))")
       public int before();
   }
   ```

   

> **`ProceedingJoinPoint.proceed()` 这个关键方法** —— 它是 “分割线”：`proceed()` 执行前的代码就是**前置逻辑**，`proceed()` 执行后的代码就是**后置逻辑**，异常捕获块里的是**异常逻辑**。

> // 执行目标方法并接收返回值        Object result = proceedingJoinPoint.proceed();
>
> 这个怎么会有放回值啊, 返回什么?返回到哪?
>
> - `proceed()` = 执行目标方法
> - 返回到哪: 调用这个原始方法的上层代码

#### 公共切入点合并

`@Pointcut` 是用于**声明公共切点的注解**，它可以将一段重复使用的切入点表达式提取出来，绑定到一个空方法上，后续各类通知（`@Before`/`@After` 等）只需引用该方法名，即可复用该切点表达式，无需重复编写。

```java
// @Pointcut注解：声明切点
@Pointcut(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
public void pointdemo() {
    // 公共方法
}

// 调用举例
// @Before注解：声明前置通知，关联到pointdemo切点
@Before(value = "pointdemo()")
public void before() {
    System.out.println("before.......");
}

```

#### 设置增强类的优先级

解决多个增强类指向一个类的问题

在增强类（切面类）上添加`@Order(数字类型值)`注解，通过注解中的数字值控制优先级：

- 数字值**越小**，增强类的优先级**越高**（对应的增强逻辑会先执行）

### xml方式

```xml
<!--创建对象-->
<bean id="book" class="com.atguigu.spring5.aopxml.Book"></bean>
<bean id="bookProxy" class="com.atguigu.spring5.aopxml.BookProxy"></bean>

<!--配置aop增强-->
<aop:config>
    <!--切入点-->
    <aop:pointcut id="别名" expression="execution(* com.atguigu.spring5.aopxml.Book.buy(..))"/> <!--切入点-->
    <!--配置切面-->
    <aop:aspect ref="bookProxy">
        <!--增强作用在具体的方法上-->
        <aop:before method="增强方法" pointcut-ref="别名"/>
    </aop:aspect>
</aop:config>
```

### 完全注解开发

创建配置类

```java
// 标记当前类是Spring 的配置类
@Configuration
// 开启组件扫描
@ComponentScan(basePackages = {"com.atguigu"}) 
// 开启AspectJ自动代理 true表示强制使用CGLIB 动态代理
@EnableAspectJAutoProxy(proxyTargetClass = true) 
public class ConfigAop {
}
```

## JdbcTemplate

### 概念

`JdbcTemplate`是Spring 框架对 JDBC 技术的封装工具类，作用是简化 Java 程序对数据库的操作（比如增删改查）

### 准备工作

导入依赖



在xml文件中配置连接池(properties也可以)

```xml
    <bean id = "database" class = "com.alibaba.druid.pool.DruidDataSource"
          destroy-method="close"> <!-- Bean 被销毁（容器关闭时），自动调用该 Bean 的close()方法-->
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="password" value="Root@321"/>
        <property name="username" value="root"/>
        <property name="url" value="jdbc:mysql://localhost:3306/jdbc_template"/>
    </bean>
```

配置`JdbcTemplate` 对象, 注入`DataSource`

```xml
    <!--配置`JdbcTemplate` 对象-->
    <bean id = "jdbcTemplate" class = "org.springframework.jdbc.core.JdbcTemplate">
        <!-- 注入数据库对象(源码构造器之一)-->
        <property name="dataSource" ref="database"/>
    </bean>
```

```xml
    <!-- 组件扫描-->
    <context:component-scan base-package="dao.service"/>
```

创建service 创建dao类, 在dao注入`JdbcTemplate` 对象

```java
public interface bookDao {

}
---------------------------------------------------------------------------------
@Repository
public class bookDaoImpl implements bookDao {
    // 注入jdbcTempleton
    @Autowired
    private JdbcTemplate jdbcTemplate;
}
---------------------------------------------------------------------------------
@Service
public class bookService {
    // 注入dao
    @Autowired
    private bookDao dao;
}
```

### 添加

创建实体类

```java
@AllArgsConstructor
@NoArgsConstructor
@Data
public class jdbc_template {
    private int user_id;
    private String username;
    private String ustatus;
}
```

操作

```java
// 注入JdbcTemplate（Spring自动管理资源）
@Autowired
private JdbcTemplate jdbcTemplate;

// 演示: 一行代码完成查询+结果映射
List<User> userList = jdbcTemplate.query(
    "SELECT id, name FROM user",
    (rs, rowNum) -> { // 内置RowMapper，无需手动遍历
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        return user;
    }
);
```

和JDBCUtil差不多

### 基本操作

```java
public interface JdbcOperations {

    // ------------------------ 增/删/改（Update类操作） ------------------------
    /**
     * 执行增/删/改SQL（返回受影响行数）
     * @param sql 要执行的SQL语句
     * @return 受影响的行数
     */
    int update(String sql);

    /**
     * 带参数的增/删/改SQL
     * @param sql SQL语句（含占位符?）
     * @param args 参数数组
     * @return 受影响的行数
     */
    int update(String sql, Object... args);

    /**
     * 带参数+参数类型的增/删/改SQL
     * @param sql SQL语句
     * @param args 参数数组
     * @param argTypes SQL参数类型（如Types.INTEGER）
     * @return 受影响的行数
     */
    int update(String sql, Object[] args, int[] argTypes);


    // ------------------------ 批量增/删/改（Batch Update） ------------------------
    /**
     * 批量执行增/删/改SQL
     * @param sql SQL语句
     * @param batchArgs 批量参数列表（每个元素是一组参数）
     * @return 每一条SQL受影响的行数数组
     */
    int[] batchUpdate(String sql, List<Object[]> batchArgs);


    // ------------------------ 查询（Query类操作） ------------------------
    /**
     * 查询并映射为单个对象（如单个Integer/String）
     * @param sql SQL语句
     * @param requiredType 返回值类型
     * @return 单个结果对象
     */
    <T> T queryForObject(String sql, Class<T> requiredType);

    /**
     * 带参数的查询，映射为单个对象
     * @param sql SQL语句
     * @param args 参数数组
     * @param requiredType 返回值类型
     * @return 单个结果对象
     */
    <T> T queryForObject(String sql, Object[] args, Class<T> requiredType);

    /**
     * 查询并映射为对象列表（通过RowMapper处理结果集）
     * @param sql SQL语句
     * @param rowMapper 结果集映射器（自定义对象封装逻辑）
     * @return 对象列表
     */
    <T> List<T> query(String sql, RowMapper<T> rowMapper);

    /**
     * 带参数的查询，映射为对象列表
     * @param sql SQL语句
     * @param args 参数数组
     * @param rowMapper 结果集映射器
     * @return 对象列表
     */
    <T> List<T> query(String sql, Object[] args, RowMapper<T> rowMapper);


    // ------------------------ 其他常用方法 ------------------------
    /**
     * 执行SQL（无返回值，如DDL语句）
     * @param sql 要执行的SQL
     */
    void execute(String sql);
}
```

> RowMapper（结果映射器是什么
>
> 和Apache-DBUtils类似
>
> 把数据库查询返回的`ResultSet`（结果集）中的一行数据，映射成你需要的 Java 实体类对象

1. **`BeanPropertyRowMapper`**

   自动映射结果集到实体类（字段名 = 属性名），日常 CRUD 首选。

2. **自定义`RowMapper`**

   手动控制字段→属性映射（解决字段名 / 属性名不一致、复杂类型转换）。

3. **`SingleColumnRowMapper`**

   映射单个列的结果（如查询总数：

   ```
   select count(*) from table
   ```

   ）

### 批量处理

```java
public interface JdbcOperations {
    /**
     * 批量执行SQL（返回每条SQL的受影响行数）
     * @param sql 待执行的SQL语句（含占位符?）
     * @param batchArgs 批量参数列表：每个元素是一组SQL参数（对应一条SQL的参数）
     * @return int[]：数组中每个元素是对应位置SQL的受影响行数
     */
    int[] batchUpdate(String sql, List<Object[]> batchArgs);

    /**
     * 带参数类型的批量执行
     * @param sql SQL语句
     * @param batchArgs 批量参数列表
     * @param argTypes 每个参数对应的SQL类型（如Types.VARCHAR）
     * @return 每条SQL的受影响行数数组
     */
    int[] batchUpdate(String sql, List<Object[]> batchArgs, int[] argTypes);

    /**
     * 自定义批量参数设置的批量执行（通过BatchPreparedStatementSetter控制参数）
     * @param sql SQL语句
     * @param pss 批量参数设置器（自定义参数绑定逻辑）
     * @return 每条SQL的受影响行数数组
     */
    int[] batchUpdate(String sql, BatchPreparedStatementSetter pss);
}
```



## 事务

事务是数据库操作的一个不可分割的执行单元（包含一组SQL操作），它遵循ACID原则，保证这组操作要么全部执行成功（提交），要么全部执行失败（回滚），以此维护数据的一致性和完整性。

### 特性 (ACID)

1. 原子性 : 不可分割
2. 一致性 : 操作前后总量不变
3. 隔离性 : 多事务操作不会互相打扰
4. 持久性 : 改了就是改了

### 事务操作

编程式事务管理

### 事务管理API



根据不同框架用不同的实现类, JDBC就用图里的

### 声明式事务管理 (常用)

#### 注解方式

1. 在`spring` 的配置文件配置事务管理器

   ```xml
   <!--创建事务管理器 JDBC框架用 DataSourceTransactionManager-->
   <bean id="别名"
       class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
       <!--注入数据源-->
       <property name="dataSource" ref="dataSource"></property>
   </bean>
   ```

2. 在`spring` 的配置文件开启事务注解

   1. 引入名称空间(tx)

      ```xml
      <beans xmlns="http://www.springframework.org/schema/beans"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             <!-- 引入tx-->
             xmlns:tx="http://www.springframework.org/schema/tx"
             xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
      <!-- 引入tx-->
                                 http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">
      ```

   2. 开启事务注解

      ```xml
      <!--开启事务注解-->
      <tx:annotation-driven transaction-manager="别名"></tx:annotation-driven>
      ```

3. 在类或方法(通常是`service` 类)添加事务注解

   ```java
   @Transactional
   public class UserService {
       ...
   }
   ```

> 为什么不用扫描也行
>
> 事务注解的生效只要求目标类是 Spring 容器中的 Bean（不管是扫描还是 XML 配置的 Bean），而 “组件扫描” 只是注册 Bean 的一种方式，不是事务生效的必要条件。
>
> **组件扫描（`context:component-scan`）的作用是 “自动注册 Bean”**：
>
> 只有当你用`@Service`/`@Component`等注解标记类（如`UserService`）时，才需要通过组件扫描让 Spring 把这些类创建为容器中的 Bean；
>
> 但如果你的`UserService`是**通过 XML 配置`<bean>`标签手动注册到 Spring 容器**的（而非注解方式），此时不需要组件扫描，事务注解依然能生效 —— 因为事务注解的识别依赖的是 “Bean 在 Spring 容器中”，而非 “Bean 是通过扫描注册的”

#### `@Transactional`注解的核心属性

1. **propagation（事务传播行为）**

   定义**多个事务方法相互调用时，事务如何传递**（比如 A 方法调用 B 方法，B 的事务是否加入 A 的事务）。

   常用值：`REQUIRED`（默认，A 有事务则 B 加入 A 的事务，A 无则 B 新建事务）、`REQUIRES_NEW`（B 强制新建独立事务，与 A 的事务无关）等。

   

2. **isolation（事务隔离级别）**

   控制**事务之间的数据可见性**，解决脏读、不可重复读、幻读等并发问题。

   常用值：`DEFAULT`（默认，跟随数据库隔离级别）、`READ_COMMITTED`（读取已提交数据，避免脏读）等。

   

   > 1. **不可重复读**

   > 指同一事务内，多次读取同一行数据（或同一组数据），得到的结果不一致（数据被其他事务修改并提交了）。
   >
   > 核心是：数据的「修改 / 更新」操作导致的读取不一致（针对已有数据的变更）。
   >
   > 2. **幻读**
   >
   > 指同一事务内，多次执行相同的范围查询（如 `WHERE` 条件查询），查询结果的「行数 / 记录存在性」发生变化（其他事务插入或删除了满足条件的记录并提交了）。

3. **timeout（事务超时时间）**

   设置事务的**最大执行时长（单位：秒）**，超时后事务自动回滚。

   默认值`-1`表示不限制超时时间。

4. **readOnly（只读事务）**

   标记事务为**只读模式**，此时事务中只能执行查询操作，不能执行增删改（数据库可针对只读事务做性能优化）。

   默认值`false`（非只读）。

5. **rollbackFor（指定回滚异常）**

   定义**哪些异常发生时，事务必须回滚**（默认只有运行时异常会触发回滚）。

   例如`rollbackFor = Exception.class`表示所有 Exception 及其子类发生时，事务回滚。

6. **noRollbackFor（指定不回滚异常）**

   定义**哪些异常发生时，事务不回滚**（覆盖默认的回滚规则）。

   例如`noRollbackFor = NullPointerException.class`表示发生空指针异常时，事务不回滚。

### xml方式

配置`Spring`配置文件

1. 配置事务管理器

   1. 在`spring` 的配置文件配置事务管理器

      ```xml
      <!--创建事务管理器 JDBC框架用 DataSourceTransactionManager-->
      <bean id="别名"
          class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
          <!--注入数据源-->
          <property name="dataSource" ref="dataSource"></property>
      </bean>
      ```

2. 配置通知 (事务部分)

   ```xml
   <!---2 配置通知-->
   <tx:advice id="通知别名">
       <!--配置事务参数-->
       <tx:attributes>
           <!--指定哪种规则的方法上面添加事务 一account开头的类 属性-->
           <tx:method name="account*" propagation="REQUIRED"/>
       </tx:attributes>
   </tx:advice>
   ```

   

3. 配置切入点, 切面 (把事务加到方法的过程)

   ```xml
   <!--3 配置切入点和切面-->
   <aop:config>
       <!--配置切入点-->
       <aop:pointcut id="切入点别名" expression="execution(* com.atguigu.spring5.service.UserService.*(..))"/>
       <!--配置切面-->
       <aop:advisor advice-ref="通知别名" pointcut-ref="切入点别名"/>
   </aop:config>
   ```

### 完全注解开发

````java
@ComponentScan(basePackages = "com.atguigu") //组件扫描
@EnableTransactionManagement //开启事务
public class TxConfig {

    //创建数据库连接池
    @Bean
    public DruidDataSource getDruidDataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql:///user_db");
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        return dataSource;
    }

    @Bean
    public JdbcTemplate getJdbcTemplate(DataSource dataSource) {
        //到ioc容器中根据类型找到dataSource
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        //注入dataSource
        jdbcTemplate.setDataSource(dataSource);
        return jdbcTemplate;
    }

    //创建事务管理器
    @Bean
    public DataSourceTransactionManager getDataSourceTransactionManager(DataSource dataSource) {
        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        transactionManager.setDataSource(dataSource);
        return transactionManager;
    }
}
````

## Spring实战-mhl

#### Spring

引入jar包



添加框架

<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251226163108980.png" alt="image-20251226163108980" style="zoom:80%;" />

编写spring配置文件,图中名字为约定俗成的,可以改, (命名空间, 组件扫描)



spring关联配置文件



将配置文件所在软件包标记为资源根目录



编写文件(类注册Bean类, 属性注入)





把@Resource换成@Autowired就不会报错

#### JdbcTemplate



引入名称空间context, p

引入外部配置文件

创建数据库对象

创建jdbc对象, 注入数据库

添加组件扫描



直接调用就好, 执行 SQL 后, JdbcTemplate会自动处理，自动关闭连接、Statement、ResultSet（不管是否发生异常，都会通过`finally`块确保资源释放）；

> jdbctemplate会自动处理抛出错误?
>
> 当前的`queryMuti`方法没有捕获异常，`JdbcTemplate`会把异常转换成`DataAccessException`抛出 —— 如果调用方没处理，程序会崩溃。
>
> 但是我的idea也没有报错之前他都会提醒用trycatch包围的
>
> - 原生 JDBC 的`SQLException`是**编译时异常**，所以 IDEA 会强制你用 try-catch；
> - Spring 把`SQLException`转换成了`DataAccessException`（属于`RuntimeException`子类），是**运行时异常**，IDEA 不会强制捕获，只会在运行时抛出。

#### AOP - Aspect

导入jar包 (sprint-tx, spring-aspects)

编写配置文件(开启增强类的注解扫描, 开启自动代理)



编写增强类

​	注解标记组件, 标记切面类(配置切面表达式)

​	编写增强方法



#### 问题

**使用jdbc username 获取到window账户的用户名**

是因为属性冲突，配置文件里的username换成其他的名字, 如jdbc.username

{jdbc.username}这样就可以唯一识别用户名而不会和Windows冲突。
