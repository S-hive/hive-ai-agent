# 简述



# HelloWorld

1. Maven 项目中声明**父 POM** 的核心配置

   ```xml
   	<parent>
   		<groupId>org.springframework.boot</groupId>
   		<artifactId>spring-boot-starter-parent</artifactId>
   		<version>4.0.1</version>
   	</parent>
   ```

2. 添加类路径依赖项

   ```xml
   <dependencies>
   	<dependency>
   		<groupId>org.springframework.boot</groupId>
   		<artifactId>spring-boot-starter-web</artifactId>
   	</dependency>
   </dependencies>
   ```

   运行`mvn dependency:tree`:以树状结构显示项目依赖关系

   前:

   

​	后:



3. 编写代码

   ```java
   package com.example;
   
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;
   
   @RestController //构造型注解
   @SpringBootApplication // 此注解被称为元注解 ，它结合了 @SpringBootConfiguration 、 @EnableAutoConfiguration 和 @ComponentScan 。
   public class MyApplication {
   
       @RequestMapping("/") //提供“路由”信息
       String home() {
           return "Hello World!";
       }
   
       public static void main(String[] args) {
           SpringApplication.run(MyApplication.class, args);
       }
   
   }
   ```

   > `@SpringBootApplication` 被称为元注解 ，它结合了 `@SpringBootConfiguration` 、 `@EnableAutoConfiguration `和 `@ComponentScan 。
   >
   >  [`@EnableAutoConfiguration`](https://docs.spring.io/spring-boot/4.0.1/api/java/org/springframework/boot/autoconfigure/EnableAutoConfiguration.html) 告诉 Spring Boot 根据你添加的 JAR 依赖项“猜测”你想要如何配置 Spring
   >
   > 

4. 运行`mvn spring-boot:run`

---

1. 简化整合

   导入相关的场景，拥有相关的功能。场景启动器

   默认支持的所有场景：

   https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using-build-systems.starters

- 官方提供的场景：命名为：spring-boot-starter-*
- 第三方提供场景：命名为：*-spring-boot-starte

2. 简化配置
application.properties：
- 集中式管理配置。只需要修改这个文件就行。
- 配置基本都有默认值
- 能写的所有配置都在：https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties

`Spring Initializr` 创建向导



## 解析

### 依赖管理机制思考:

1. 为什么导入 starter-web 所有相关依赖都导入进来？

- 开发什么场景，导入什么场景启动器。
- maven 依赖传递原则。A-B-C: A 就拥有 B 和 C
- 导入 场景启动器。场景启动器 自动把这个场景的所有核心依赖全部导入进来

2. 为什么版本号都不用写？

- 每个 boot 项目都有一个父项目 spring-boot-starter-parent
- parent 的父项目是 spring-boot-dependencies
- 父项目 版本仲裁中心，把所有常见的 jar 的依赖版本都声明好了。

3. 自定义版本号

- 利用 maven 的就近原则

- 直接在当前项目 properties 标签中声明父项目用的版本属性的 key
- 直接在导入依赖的时候声明版本

4. 第三方jar包
   * boot父项目没有管理的需要自行声明好

### **自动配置机制**

1. 初步理解

- 自动配置的 Tomcat、SpringMVC 等
  - 导入场景，容器中就会自动配置好这个场景的核心组件。
  - 以前：DispatcherServlet、ViewResolver、CharacterEncodingFilter...
  - 现在：自动配置好的这些组件
  - 验证：容器中有了什么组件，就具有什么功能

### 默认的包扫描规则

- `@SpringBootApplication` 标注的类就是主程序类
- SpringBoot 只会扫描主程序所在的包及其下面的子包，自动的 component-scan 功能
- 自定义扫描路径
  - `@SpringBootApplication(scanBasePackages = "com.atguigu")`
  - `@ComponentScan("com.atguigu")`

### 配置默认值

- 配置文件的所有配置项是和某个类的对象进行一一绑定的。
- 绑定了配置文件每一项值的类：属性类。
- 比如：
  - ServerProperties 绑定了所有 Tomcat 服务器有关的配置
  - MultipartProperties 绑定了所有文件上传相关的配置
  - …… 参照官方文档：或者参照 绑定的 属性类。

### 按需加载自动配置

- 导入场景 spring-boot-starter-web
- 场景启动器除了会导入相关功能依赖，导入一个 spring-boot-starter，是所有 starter 的 starter，基础核心 starter
- spring-boot-starter 导入了一个包 spring-boot-autoconfigure。包里面都是各种场景的 AutoConfiguration 自动配置类
- 虽然全场景的自动配置都在 spring-boot-autoconfigure 这个包，但是不是全都开启的。
  - 导入哪个场景就开启哪个自动配置

# 核心技能

## 常用注解

### 组件注册

   @Configuration、@SpringBootConfiguration

   @Bean、@Scope

   @Controller、@Service、@Repository、@Component

   @Import

   @ComponentScan

步骤：

1、@Configuration 编写一个配置类

2、在配置类中，自定义方法给容器中注册组件。配合 @Bean

3、或使用 @Import 导入第三方的组件

示例:

```java
@Import(FastsqlException.class) //给容器中放指定类型的组件，组件的名字默认是全类名
```

### 条件注解

如果注解指定的条件成立, 则触发指定行为

@ConditionalOnXxx

> @ConditionalOnClass：如果类路径中存在这个类，则触发指定行为
> @ConditionalOnMissingClass：如果类路径中不存在这个类，则触发指定行为
> @ConditionalOnBean：如果容器中存在这个 Bean（组件），则触发指定行为
> @ConditionalOnMissingBean：如果容器中不存在这个 Bean（组件），则触发指定行为

@ConditionalOnMissingXxx

### 属性绑定

**@configurationProperties**



**@EnableConfigurationProperties(Sheep.Class)**

* 开启Sheep组件的属性绑定 
* 默认会把这个组件自己放到容器中

> 一般用于导入第三方写好的组件进行属性绑定 (SpringBoot默认只扫描自己主程序所在的包)

# 流程

**一、导入`starter-web`流程（Web 开发场景）**

1. 场景启动器导入相关依赖：`starter-json`、`starter-tomcat`、`springmvc`
2. 每个场景启动器引入`spring-boot-starter`（核心场景启动器）
3. 核心场景启动器引入`spring-boot-autoconfigure`包
4. `spring-boot-autoconfigure`包涵盖所有场景的配置
5. 若该包下类生效，SpringBoot 官方整合功能即生效
6. SpringBoot 默认扫描不到`spring-boot-autoconfigure`包的配置类，仅扫描主程序所在包

**二、主程序（`@SpringBootApplication`）**

1. `@SpringBootApplication`由 3 个注解组成：`@SpringBootConfiguration`、`@EnableAutoConfiguration`、`@ComponentScan`

2. SpringBoot 默认仅扫描主程序所在包及子包，无法扫描`spring-boot-autoconfigure`包的官方配置类

3. `@EnableAutoConfiguration`（自动配置核心）：

   - 由`@Import(AutoConfigurationImportSelector.class)`提供功能：批量向容器导入组件
   - SpringBoot 启动默认加载 142 个配置类
   - 142 个配置类来自`spring-boot-autoconfigure`下的`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`文件
   - 项目启动时，通过`@Import`机制将`autoconfigure`包下的 142 个`xxxAutoConfiguration`类（自动配置类）导入容器

   

**三、`xxxAutoConfiguration`（自动配置类）**

1. 通过`@Bean`向容器注册组件

2. 可能包含`@EnableConfigurationProperties(xxxProperties.class)`：将配置文件中指定前缀的属性封装到`xxxProperties`属性类中

3. 以 Tomcat 为例：服务器配置以`server`开头，会封装到对应的属性类中

4. 组件的核心参数来自`xxxProperties`，而`xxxProperties`与配置文件绑定

   - 修改配置文件的值，即可修改核心组件的底层参数

   

**四、业务开发**

全程无需关注底层整合（已由 SpringBoot 自动完成并生效）

**核心流程 :**
1、导入 starter，就会导入 autoconfigure 包。
2、autoconfigure 包里面有一个文件 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports，里面指定的所有启动要加载的自动配置类
3、@EnableAutoConfiguration 会自动的把上面文件里面写的所有自动配置类都导入进来。xxxAutoConfiguration 是有条件注解进行按需加载
4、xxxAutoConfiguration 给容器中导入一堆组件，组件都是从 xxxProperties 中提取属性值
5、xxxProperties 又是和配置文件进行了绑定
效果：导入 starter、修改配置文件，就能修改底层行为。



# YMAL

> 痛点: SpringBoot 集中化管理配置，application.properties
> 问题：配置多以后难阅读和修改，层级结构辨识度不高

<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260111183440599.png" alt="image-20260111183440599" style="zoom:80%;" />

<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260111184817037.png" alt="image-20260111184817037" style="zoom:80%;" />

1. 细节

- birthDay 推荐写为 birth-day
- **文本**:

- 单引号内文本不会转义【\n 则为普通字符串显示】
- 双引号内文本会转义【\n 会显示为换行符】

- **大文本**

- `|`开头，大文本写在下层，保留文本格式，换行符正确显示
- `>`开头，大文本写在下层，换行会压缩成空格

- **多文档合并**

- 使用 `---` 可以把多个 yaml 文档合并在一个文档中，每个文档区依然认为内容独立

# 日志

## 简介

Spring 使用 commons-logging 作为内部日志，但底层日志实现是开放的。可对接其他日志框架。

spring5 及以后 commons-logging 被 spring 直接自己写了。

支持 jul, log4j2,logback。SpringBoot 提供了默认的控制台输出配置，也可以配置输出为文件。

logback 是默认使用的。

显然日志框架很多，但是我们不用担心，使用 SpringBoot 的默认配置就能工作的很好。

**SpringBoot 怎么把日志默认配置好的**

1、每个 starter 场景，都会导入一个核心场景 spring-boot-starter

2、核心场景引入了日志的所用功能 spring-boot-starter-logging

3、默认使用了 logback + slf4j 组合作为默认底层日志

4、日志是系统一启动就要用， xxxAutoConfiguration 是系统启动好了以后放好的组件，后来用的。

5、日志是利用监听器机制配置好的。ApplicationListener。

6、日志所有的配置都可以通过修改配置文件实现。以 logging 开始的所有配置。

## 日志格式

```shell
2026-01-11T19:14:00.169+08:00  INFO 900 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
```

默认输出格式:

- 时间和日期：毫秒级精度
- 日志级别: ERROR, WARN, INFO, DEBUG, or TRACE
- 进程 ID
- `----`: 消息分割符
- 线程名：使用 `[ ]`包含
- Logger 名：通常是产生日志的类名
- 消息：日志记录的内容

注意: logback 没有 FATAL 级别，对应的是 ERROR

**修改配置:**

在`application.properties`文件中添加:

```properties
logging.pattern....=...
```

**日志记录类信息**

```java
@RestController
public class HelloController {

    @GetMapping("/h")
    public String hello(){
        logger.info("哈哈哈，方法进来了"); //
        return "hello";
    }
}
```

```java
@Slf4j // 注解
@RestController
public class HelloController {

    @GetMapping("/h")
    public String hello(){
        log.info("哈哈哈，方法进来了"); //
        // log.info("info 日志..... 参数:{}, {}", a, b);
        return "hello";
    }
}
```

## 日志级别

由低到高: ALL,TRACE, DEBUG, INFO, WARN, ERROR,FATAL,OFF ;

- 只会打印指定级别及以上级别的日志
- ALL: 打印所有日志
- TRACE: 追踪框架详细流程日志，一般不使用
- DEBUG: 开发调试细节日志
- INFO: 关键、感兴趣信息日志
- WARN: 警告但不是错误的信息日志，比如：版本过时
- ERROR: 业务错误日志，比如出现各种异常
- FATAL: 致命错误日志，比如 jvm 系统崩溃
- OFF: 关闭所有日志记录

不指定级别的所有类，都使用 root 指定的级别作为默认级别

SpringBoot 日志默认级别是 INFO

**修改日志级别(某个包下, 某个类)**

```properties
logging.level...(位置)=...
```

## 日志分组

```properties
logging.group.组名1=地址1,地址2
logging.level.组名1=级别
```

springBoot提供的默认组:

| **Name** | **Loggers**                                                  |
| -------- | ------------------------------------------------------------ |
| web      | org.springframework.core.codec, org.springframework.http, org.springframework.web, org.springframework.boot.actuate.endpoint.web, org.springframework.boot.web.servlet.ServletContextInitializerBeans |
| sql      | org.springframework.jdbc.core, org.hibernate.SQL, org.jooq.tools.LoggerListener |

## 日志文件保存

```properties
#指定日志文件的路径(默认路径为项目同路径)
logging.file.path=
#指定日志文件的名 / 路径+名字 (默认名为 spring.log)
logging.file.name=
```

## 文件归档和滚动切割

> 归档：每天的日志单独存到一个文档中。
> 切割：每个文件 10MB，超过大小切割成另外一个文件。

| **配置项**                                           | **描述**                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| logging.logback.rollingpolicy.file-name-pattern      | 日志存档的文件名格式（默认值: `${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz`） |
| logging.logback.rollingpolicy.clean-history-on-start | 应用启动时是否清除以前存档（默认值: false）                  |
| logging.logback.rollingpolicy.max-file-size          | 存档前，每个日志文件的最大大小（默认值: 10MB）               |
| logging.logback.rollingpolicy.total-size-cap         | 日志文件被删除之前，可以容纳的最大大小（默认值: 0B）。设置 1GB 则磁盘存储超过 1GB 日志后就会删除旧日志文件 |
| logging.logback.rollingpolicy.max-history            | 日志文件保存的最大天数 (默认值: 7)                           |

## 自定义配置

引入对应的日志依赖后直接编写配置文件就行

| **日志系统**            | **自定义配置文件名**                                         |
| ----------------------- | ------------------------------------------------------------ |
| Logback                 | **logback-spring.xml**, logback-spring.groovy, logback.xml, or logback.groovy |
| Log4j2                  | **log4j2-spring.xml** , log4j2.xml                           |
| JDK (Java Util Logging) | logging.properties                                           |

> 配置文件名最好写成`xx-spring.xx`,`spring`可以控制它

## 切换日志框架

pom.xml

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <exclusions>
        <exclusion> <!--排除默认日志 -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<dependency><!--添加日志 -->
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
</dependency>
```

# Web开发

```java
org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.HttpEncodingAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
org.springframework.boot.autoconfigure.websocket.reactive.WebSocketReactiveAutoConfiguration
org.springframework.boot.autoconfigure.websocket.servlet.WebSocketServletAutoConfiguration
org.springframework.boot.autoconfigure.websocket.servlet.WebSocketMessagingAutoConfiguration
org.springframework.boot.autoconfigure.webservices.WebServicesAutoConfiguration
org.springframework.boot.autoconfigure.webservices.client.WebServiceTemplateAutoConfiguration
org.springframework.boot.autoconfigure.web.client.RestTemplateAutoConfiguration
org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration
```



绑定了配置文件的一堆配置项

- 1、SpringMVC 的所有配置 spring.mvc
- 2、Web 场景通用配置 spring.web
- 3、文件上传配置 spring.servlet.multipart
- 4、服务器的配置 server：比如：编码方式

---

## **默认配置：**

1. 包含了 ContentNegotiatingViewResolver 和 BeanNameViewResolver 组件，方便视图解析
2. 默认静态资源处理机制：静态资源放在 static 文件夹下即可直接访问
3. 自动注册了 Converter、GenericConverter、Formatter 组件，适配常见数据类型转换和格式化需求
4. 支持 HttpMessageConverters，可以方便返回 json 等数据类型
5. 注册 MessageCodesResolver，方便国际化及错误消息处理
6. 支持静态 index.html
7. 自动使用 ConfigurableWebBindingInitializer，实现消息处理、数据绑定、类型转化等功能

重要：

- 如果想保持 boot mvc 的默认配置，并且自定义更多的 mvc 配置，如: interceptors, formatters, view controllers 等。可以使用 @Configuration 注解添加一个 WebMvcConfigurer 类型的配置类，并且不要标注 @EnableWebMvc
- 如果想保持 boot mvc 的默认配置，但要自定义核心组件实例，比如: RequestMappingHandlerMapping, RequestMappingHandlerAdapter, 或 ExceptionHandlerExceptionResolver，给容器中放一个 WebMvcRegistrations 组件即可
- 如果想全面接管 Spring MVC，@Configuration 标注一个配置类，并加上 @EnableWebMvc 注解，实现 WebMvcConfigurer 接口

## 三种方式

| **方式** | **配置内容**                                                 | **注意事项**           | **效果描述**                                  |
| -------- | ------------------------------------------------------------ | ---------------------- | --------------------------------------------- |
| 全自动   | 直接编写控制器逻辑                                           | -                      | 全部使用自动配置默认效果                      |
| 手自一体 | @Configuration +配置 WebMvcConfigurer +配置 WebMvcRegistrations | 不要标注 @EnableWebMvc | 自动配置效果手动设置部分功能定义 MVC 底层组件 |
| 全手动   | @Configuration +配置 WebMvcConfigurer                        | 标注 @EnableWebMvc     | 禁用自动配置效果全手动设置                    |

## 静态资源

WebServiceTemplateAutoConfiguration

### 生效条件

```java
@AutoConfiguration(after = { DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class,
        ValidationAutoConfiguration.class })// 在这些配置之后
@ConditionalOnWebApplication(type = Type.SERVLET)// 如果是web应用,类型是servlet时应用
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })// 存在这些类才生效
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)// 没有这个Bean才生效
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)// 优先级
@ImportRuntimeHints(WebResourcesRuntimeHints.class)
public class WebMvcAutoConfiguration {
}
```

### 效果

放了两个 Filter：
	a. HiddenHttpMethodFilter：页面表单提交 Rest 请求（GET、POST、PUT、DELETE）
	b. FormContentFilter：表单内容 Filter，GET（数据放 URL 后面）、POST（数据放请求体）请求可以携带数据，PUT、DELETE 的请求体数据会被忽略
给容器中放了 WebMvcConfigurer 组件；给 SpringMVC 添加各种定制功能
	所有的功能最终会和配置文件进行绑定
	WebMvcProperties：spring.mvc 配置文件
	WebProperties：spring.web 配置文件

```java
@Configuration(proxyBeanMethods = false)
@Import(EnableWebMvcConfiguration.class)// 导入其他配置
@EnableConfigurationProperties({ WebMvcProperties.class, WebProperties.class })
@Order(0)
public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer, ServletContextAware {}
```

### WebMvcConfigurer接口



### 静态资源源码

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
	if (!this.resourceProperties.isAddMappings()) {
		logger.debug("Default resource handling disabled");
		return;
	}
	//1.
	addResourceHandler(registry, this.mvcProperties.getWebjarsPathPattern(),
			"classpath:/META-INF/resources/webjars/");
	addResourceHandler(registry, this.mvcProperties.getStaticPathPattern(), (registration) -> {
		registration.addResourceLocations(this.resourceProperties.getStaticLocations());
		if (this.servletContext != null) {
			ServletContextResource resource = new ServletContextResource(this.servletContext, SERVLET_LO
			registration.addResourceLocations(resource);
		}
	});
}
```

1. 规则一：访问：/webjars/** 路径就去 classpath:/META-INF/resources/webjars/ 下找资源

   a. maven 导入依赖

   b.

   规则二：访问：/** 路径就去 静态资源默认的四个位置找资源

   a. classpath:/META-INF/resources/

   b. classpath:/resources/

   c. classpath:/static/

   d. classpath:/public/

> 什么是`classpath` 就是图标带颜色的 比如`java`,`resource`

1. 规则三：静态资源默认都有缓存规则的设置

   a. 所有缓存的设置，直接通过配置文件：spring.web

   b. cachePeriod：缓存周期；多久不用找服务器要新的。默认没有，以 s 为单位

   c. cacheControl：HTTP 缓存控制；

   https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching

   d. useLastModified：是否使用最后一次修改。配合 HTTP Cache 规则

如果浏览器访问了一个静态资源 index.js，如果服务这个资源没有发生变化，下次访问的时候就可以直接让浏览器用自己缓存中的东西，而不用给服务器发请求。

```java
registration.setCachePeriod(getSeconds(this.resourceProperties.getCache()).getPeriod()));
registration.setCacheControl(this.resourceProperties.getCache().getCachecontrol().toHttpCacheControl());
registration.setUseLastModified(this.resourceProperties.getCache().isUseLastModified());
```

### 欢迎页

EnableWebMvcConfiguration

```java
//SpringBoot 给容器中放 WebMvcConfigurationSupport 组件。
//我们如果自己放了 WebMvcConfigurationSupport 组件，Boot的WebMvcAutoConfiguration都会失效。
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(WebProperties.class)
public static class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration implements ResourceLoaderAware{}
```
● HandlerMapping：根据请求路径 /a 找那个 handler 能处理请求
  ○  WelcomePageHandlerMapping：
    ■  访问 /** 路径下的所有请求，都在以前四个静态资源路径下找，欢迎页也一样
    ■ 找 index.html：只要静态资源的位置有一个 index.html 页面，项目启动

### Favicon

Spring Boot 会在配置好的静态内容目录中检查是否存在 `favicon.ico` 文件。如果存在这样的文件，它会被自动用作应用程序的图标。

> 是浏览器自动请求 `favicon.ico`的, 和`springBoot`关系不大

## 自定义静态资源规则

> 自定义静态资源路径, 自定义规则

### 配置方式

- spring.mvc：静态资源访问前缀路径

- spring.web：

  - 静态资源目录

  - 静态资源缓存策略

### 代码方式

容器中只要有一个 WebMvcConfigurer 组件，配置的底层行为都会生效
@EnableWebMvc // 禁用 boot 的默认配置

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    //保留以前
    WebMvcConfigurer.super.addResourceHandlers(registry);

    //自己写
    registry.addResourceHandler("/static/**")
            .addResourceLocations("classpath:/a/", "classpath:/b/")
            .setCacheControl(CacheControl.maxAge(1180, TimeUnit.SECONDS));
}
```

## 路径匹配

Spring5.3 之后加入了更多的请求路径匹配的实现策略：以前只支持 AntPathMatcher 策略，现在提供了 PathPatternParser 策略。并且可以让我们指定到底使用那种策略。

1. Ant 风格路径用法Ant 风格的路径模式语法具有以下规则：

- *：表示任意数量的字符。
- ?：表示任意一个字符。
- **：表示任意数量的目录。
- {}：表示一个命名的模式占位符。
- []：表示字符集合，例如 [a-z] 表示小写字母。

新版策略默认不匹配中间路径带`**`的, 需要配置:

```properties
# 改变路径匹配策略:
# ant_path_matcher 老版策略;
# path_pattern_parser 新版策略;
spring.mvc.pathmatch.matching-strategy=ant_path_matcher
```

## 内容协商

### 多端适配

**一、基于请求头的内容协商**(默认)

1. 触发方式：客户端请求时携带 HTTP 标准的 `Accept` 请求头
2. 请求头示例：
   - 期望 JSON：`Accept: application/json`
   - 期望 XML：`Accept: text/xml`
   - 期望 YAML：`Accept: text/yaml`
3. 处理逻辑：服务端根据 `Accept` 头指定的期望类型，动态返回对应格式数据

**二、基于请求参数的内容协商（需提前开启配置）**

1. 触发方式：请求 URL 后拼接 `format=格式` 参数
2. 请求示例：
   - 期望 JSON：`GET /projects/spring-boot?format=json`
   - 期望 XML：`GET /projects/spring-boot?format=xml`
3. 匹配逻辑：
   - 先匹配后端接口（如 `@GetMapping("/projects/spring-boot")`）
   - 再根据 `format` 参数值，优先返回对应格式数据

**操作:**

1. 导入对应格式的包(xml)

2. 注解标注

   ```java
   @JacksonXmlRootElement // 可以写出xml文档
   @Data
   public class Person {
       private long id;
       private String userName;
       private String email;
       private Integer age;
   }
   ```

3. 开启内容协商

```properties
# 开启基于请求参数的内容协商功能。默认参数名: format
spring.mvc.contentnegotiation.favor-parameter=true
# 指定内容协商时使用的参数名type。默认是 format
spring.mvc.contentnegotiation.parameter-name=type
```

**源码**





**支持类型**

WebMvcAutoConfiguration 提供的默认 HttpMessageConverters

`EnableWebMvcConfiguration` 通过 `addDefaultHttpMessageConverters` 方法，添加了以下默认的消息转换器：

- `ByteArrayHttpMessageConverter`：支持字节数据读写
- `StringHttpMessageConverter`：支持字符串读写
- `ResourceHttpMessageConverter`：支持资源读写
- `ResourceRegionHttpMessageConverter`：支持分区资源写出
- `AllEncompassingFormHttpMessageConverter`：支持表单 /xml/json 读写
- `MappingJackson2HttpMessageConverter`：支持请求 / 响应 json 读写

### 自定义内容返回

**1. 导入依赖（添加 YAML 解析能力）**

这段 Maven 依赖是引入 Jackson 的 YAML 格式解析包，让项目能处理 YAML 数据的读写：

```xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-yaml</artifactId>
</dependency>
```

2. **编写配置（注册 YAML 的媒体类型）**

这行配置是告诉 SpringBoot：当内容协商时，`yaml`对应的媒体类型是`text/yaml`，这样客户端就能通过`Accept: text/yaml`（请求头）或`format=yaml`（请求参数）获取 YAML 格式的数据：

```properties
spring.mvc.contentnegotiation.media-types.yaml=text/yaml
```

3. 

## 模板引擎



### 导入`thyneleaf`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

### 自动配置

1. 开启了自动配置类：`org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration`

2. 配置属性绑定在`ThymeleafProperties`类中，对应配置文件的`spring.thymeleaf`前缀配置项

3. 模板页面默认存放路径：`classpath:/templates`文件夹下

4. 默认效果

   **模板位置**：项目会默认在`classpath:/templates/`目录下查找所有模板页面

   **文件后缀**：优先匹配后缀为`.html`的页面文件

###  基础语法

#### **核心用法**

Thymeleaf 通过`th:xxx`语法实现动态渲染，功能包括：

- `th:text`：渲染标签体内的文本值（会转义特殊字符）
- `th:utext`：渲染标签体内的文本值（不转义，保留 HTML 原格式）
- `th:属性`：渲染标签的指定属性（如`th:href`渲染链接）
- `th:attr`：渲染标签的任意属性
- 指令类：如`th:if`（条件判断）、`th:each`（循环遍历）等

#### 表达式

- `${}`：变量取值，直接使用 model 共享给页面的值
- `@{}`：URL 路径拼接
- `#{}`：国际化消息（加载多语言文本）
- `~{}`：片段引用（复用页面公共模块）
- `*{}`：变量选择，需配合`th:object`绑定对象后使用

#### **系统工具与内置对象**

1. 上下文对象

- `param`：获取请求参数（如`${param.id}`取请求参数`id`）
- `session`：操作 Session 域中的数据
- `application`：操作 Application 域（全局上下文）中的数据

2. 模板与消息工具

- `#execInfo`：获取模板执行过程中的信息（如模板名称、当前行号）
- `#messages`：加载国际化消息（配合`#{}`表达式使用）
- `#uris`：URL/URI 的编码、拼接等工具

3. 类型转换与数据工具

- `#conversions`：类型转换工具（实现不同数据类型的转换）
- `#dates`：操作`java.util.Date`类型的工具（如格式化日期）
- `#calendars`：操作`java.util.Calendar`类型的工具
- `#temporals`：JDK8 + 中`java.time`（如 LocalDate）的操作工具
- `#numbers`：数字格式化、运算等操作工具
- `#strings`：字符串的拼接、截取、判空等操作工具
- `#objects`：对象的判空、默认值设置等操作工具
- `#bools`：布尔值的处理工具

4. 集合与结构工具

- `#arrays`：数组的遍历、长度获取等操作工具
- `#lists`：List 集合的操作工具（如判空、获取元素）
- `#sets`：Set 集合的操作工具
- `#maps`：Map 集合的操作工具（如获取键值对）
- `#aggregates`：集合聚合工具（如求和`sum`、求平均值`avg`）

5. 其他工具

- `#ids`：生成唯一 ID 的工具（用于页面元素的 ID 标识）

#### **语法**

一、核心表达式

用于页面与后端数据的动态绑定：

- 变量取值：`${变量名}`（获取 Model 传递的变量）
- URL 取值：`@{/路径}`（拼接项目上下文的 URL）
- 国际化消息：`#{消息键}`（加载多语言配置文本）
- 变量选择：`*{属性名}`（配合`th:object`绑定对象后，直接取对象属性）
- 片段引用：`~{片段路径::片段名}`（复用页面公共模块）

二、基础数据类型

模板中可直接使用的常量数据：

- 文本：`one text`、`another one!`（字符串常量）
- 数字：`0`、`34`、`3.0`、`12.3`（数值常量）
- 布尔：`true`、`false`（布尔常量）
- null：`null`（空值常量）
- 变量名：`one`、`someText`、`main`（模板中定义的变量）

三、文本操作

实现字符串的拼接、替换：

- 拼串：使用`+`（如`${'Hello ' + name}`）
- 文本替换：`|The name is ${name}|`（简化字符串与变量的拼接）

四、布尔与比较运算

用于条件判断、数据比较：

- 布尔运算：
  - 二进制：`and`（且）、`or`（或）
  - 取反：`!`、`not`
- 比较运算：
  - 大小比较：`>`（gt）、`<`（lt）、`>=`（ge）、`<=`（le）
  - 等值运算：`==`（eq）、`!=`（ne）

五、条件运算

实现分支逻辑与默认值设置：

- if-then：`(条件)?(结果)`（条件为真时返回结果）
- if-then-else：`(条件)?(结果1):(结果2)`（条件为真返回结果 1，否则返回结果 2）
- default：`(变量名)?:(默认值)`（变量为空时返回默认值）

六、特殊语法与组合规则

- 无操作：使用`_`（表示空操作，常用于不需要渲染内容的场景）
- 嵌套组合：以上所有语法可嵌套使用（如`${(age > 18) ? '成年' : '未成年'}`）

#### 遍历

通过`th:each`指令实现集合遍历，语法格式：

```html
th:each="元素名, 迭代状态 : ${集合}"
```

* 元素名：每次循环取到的集合元素（自定义命名）
* 迭代状态（可选）：记录循环过程的状态对象（通常命名为iterStat）
* ${集合}：后端传递到页面的集合数据（如 List、数组等）

示例（带迭代状态）

```html
<tr th:each="prod,iterStat : ${prods}" th:class="${iterStat.odd}? 'odd'">
  <td th:text="${prod.name}">Onions</td>
  <td th:text="${prod.price}">2.41</td>
  <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
</tr>
```

通过`iterStat`（迭代状态对象）实现奇偶行样式区分：`iterStat.odd`表示当前是奇数行，满足时添加`odd`样式类。

**迭代状态`iterStat`的常用属性 :**

`iterStat`包含循环过程的元信息，常用属性：

- `index`：当前元素的索引（从 0 开始）
- `count`：当前元素的计数（从 1 开始）
- `size`：集合的总元素数量
- `current`：当前遍历到的元素对象
- `even/odd`：是否为偶数行 / 奇数行（布尔值）
- `first`：是否为第一个元素
- `last`：是否为最后一个元素

#### 判断

**`th:if`：单条件判断**

根据表达式的布尔结果，**决定元素是否渲染**（表达式为`true`则渲染元素，否则不渲染）

```html
<a href="comments.html"
   th:href="@{/product/comments(prodid=${prod.id})}"
   th:if="${not #lists.isEmpty(prod.comments)}"><!--判断prod.comments集合是否不为空 -->
  view
</a>
```

只有当商品的评论集合非空时，才渲染这个 “view” 链接；若评论为空，该链接不会显示在页面中

**`th:switch`：多分支条件判断**

类似 Java 中的`switch-case`，根据一个变量的值，匹配对应的分支并渲染（仅渲染第一个匹配的分支）

```html
<div th:switch="${user.role}">
  <p th:case="'admin'">User is an administrator</p>
  <p th:case="${roles.manager}">User is a manager</p>
  <p th:case="*">User is some other thing</p> <!--默认分支 -->
</div>
```

#### 属性优先级

当一个 HTML 元素同时包含多个`th:`指令时，Thymeleaf 会按照 “优先级从高到低” 的顺序执行这些指令

**优先级列表（按执行顺序从高到低）**

| **优先级（Order）** | **功能（Feature）** | **对应指令（Attributes）**                                   |
| ------------------- | ------------------- | ------------------------------------------------------------ |
| 1                   | 片段包含            | `th:insert`、`th:replace`                                    |
| 2                   | 遍历                | `th:each`                                                    |
| 3                   | 判断                | `th:if`、`th:unless`、`th:switch`、`th:case`                 |
| 4                   | 定义本地变量        | `th:object`、`th:with`                                       |
| 5                   | 通用属性修改        | `th:attr`、`th:attrprepend`、`th:attrappend`                 |
| 6                   | 指定属性修改        | `th:value`、`th:href`、`th:src`等（针对特定 HTML 属性的指令） |
| 7                   | 文本值              | `th:text`、`th:utext`                                        |
| 8                   | 片段指定            | `th:fragment`                                                |
| 9                   | 片段移除            | `th:remove`                                                  |

#### 行内写法

在 HTML 文本中直接嵌入 Thymeleaf 表达式，替代`th:text`等指令，让模板更简洁

语法为`[[表达式]]`或`[(表达式)]`

语法区别

- `[[${表达式}]]`：等价于`th:text`，会转义特殊字符（适合普通文本）
- `[(${表达式})]`：等价于`th:utext`，不转义特殊字符（适合包含 HTML 标签的文本）

#### 变量选择

通过`th:object`绑定一个对象后，用`*{属性名}`替代`${对象.属性名}`，简化对象属性的重复书写。

```html
<div th:object="${session.user}">
  <p>Name: <span th:text="*{firstName}">Sebastian</span></p>
  <p>Surname: <span th:text="*{lastName}">Pepper</span></p>
</div>
```

#### 模板布局

通过定义公共模板片段，在多个页面中重复引用，实现页面布局的复用（比如公共头部、底部）

**定义模板：`th:fragment`**

- 作用：标记一个 HTML 片段为可复用的 “模板片段”，需指定片段名称。

  ```html
  <!-- 在footer.html中定义名为“copy”的模板片段 -->
  <footer th:fragment="copy">
    &copy; 2011 The Good Thymes Virtual Grocery
  </footer>
  ```

**引用模板：`~{模板文件路径::片段名称}`**

- 作用：指定要引用的模板片段
- 示例：`~{footer :: copy}`表示引用`footer.html`中名为 “copy” 的片段

**插入模板：`th:insert` / `th:replace`**

- 作用：将引用的模板片段插入到当前页面中，两者的区别是**插入方式不同**：
  - `th:insert`：将模板片段**作为子元素插入**到当前元素中；
  - `th:replace`：将模板片段**替换当前元素**（当前元素会被模板片段替代）

## DevTools 

**自动重启 / 刷新**，避免开发过程中频繁手动重启项目，提升调试效率

在项目的`pom.xml`中引入依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```

修改模板文件（如 HTML）后，按下`Ctrl+F9`（或 IDE 的 “构建项目” 快捷键），页面会自动刷新，无需重启项目即可看到修改效果

## 国际化

让项目根据不同语言环境自动切换文本内容

**配置消息资源文件**

Spring Boot 会在类路径根目录下（通常是`resources`文件夹）查找以`messages`命名的属性文件，作为多语言文本的配置源：

- 命名规则：`messages.区域代码.properties`
  - `messages.properties`：默认语言（未匹配到其他语言时使用）
  - `messages_zh_CN.properties`：中文环境的文本配置
  - `messages_en_US.properties`：英语环境的文本配置
- 在程序中可以自动注入 MessageSource 组件，获取国际化的配置项值
- 在页面中可以使用表达式 #{} 获取国际化的配置项值



- `messages_en_US.properties`（英文）：

```properties
login=Login
sign=Sign-Up
```

- `messages_zh_CN.properties`（中文）：

```properties
login=登录
sign=注册
```

2. Thymeleaf 页面代码

```html
<button type="button" class="btn btn-outline-light me-2" th:text="#{login}"></button>
<button type="button" class="btn btn-warning" th:text="#{sign}">Sign-up</button>
```

## 错误处理

> SpringBoot 会自适应处理错误，响应页面或 JSON 数据
> SpringMVC 的错误处理机制依然保留，MVC 处理不了，才会交给 boot 进行处理



#### 前后台分离

- 后台发生的所有错误，通过 `@ControllerAdvice + @ExceptionHandler` 进行统一异常处理。

#### 服务端页面渲染

- 不可预知的、HTTP 码表示的服务器或客户端错误

- 在 `classpath:/templates/error/` 目录下，放置常用精确错误码页面：`500.html`、`404.html`
- 在 `classpath:/templates/error/` 目录下，放置通用模糊匹配错误码页面：`5xx.html`、`4xx.html`

- 发生业务错误

- 核心业务：每一种错误，通过代码控制跳转到自定义错误页
- 通用业务：使用 `classpath:/templates/error.html` 页面显示错误信息



## 嵌入式容器

### 自动配置原理

源码..

### 用法：

- 修改 `server` 下的相关配置，即可修改服务器参数
- 通过给容器中添加一个 `ServletWebServerFactory`，来禁用 SpringBoot 默认的服务器工厂，实现自定义 / 注入任意服务器

### 自定义

...

## 全面接管`SpringMVC`

#### WebMvcAutoConfiguration 到底自动配置了哪些规则

1. WebMvcAutoConfiguration：web 场景的自动配置类

​	1.1 支持 RESTful 的 Filter：HiddenHttpMethodFilter
​	1.2 支持非 POST 请求、请求体携带数据：FormContentFilter
​	1.3 导入 EnableWebMvcConfiguration：
​		1.3.1 RequestMappingHandlerAdapter
​		1.3.2 WelcomePageHandlerMapping：欢迎功能支持（模板引擎目录、静态资源目录放 index.html），项目访问 / 就默认展示这个页面
​		1.3.3 RequestMappingHandlerMapping：找每个请求由谁处理的映射关系
​		1.3.4 ExceptionHandlerExceptionResolver：默认的异常解析器
​		1.3.5 LocaleResolver：国际化解析器
​		1.3.6 ThemeResolver：主题解析器
​		1.3.7 FlashMapManager：临时数据共享
​		1.3.8 FormattingConversionService：数据格式化、类型转化
​		1.3.9 Validator：数据校验（JSR303 提供的数据校验功能）
​		1.3.10 WebBindingInitializer：请求参数的封装与绑定
​		1.3.11 ContentNegotiationManager：内容协商管理器
​	1.4 WebMvcAutoConfigurationAdapter 配置生效，它是一个 WebMvcConfigurer，定义 mvc 底层组件
​		1.4.1 定义好 WebMvcConfigurer 底层组件默认功能
​		1.4.2 视图解析器：InternalResourceViewResolver
​		1.4.3 视图解析器：BeanNameViewResolver（视图名即 controller 方法的返回值字符串，对应组件名）
​		1.4.4 内容协商解析器：ContentNegotiatingViewResolver
​		1.4.5 请求上下过滤器：RequestContextFilter（任意位置直接获取当前请求）
​		1.4.6 静态资源规则
​		1.4.7 ProblemDetailsExceptionHandler：错误详情
​		1.4.7.1 SpringMVC 内部场景异常被它捕获
1.5 定义了 MVC 默认的底层行为：WebMvcConfigurer

#### WebMvcConfigurer功能

P49

#### @EnableWebMvc 禁用默认行为

1. @EnableWebMvc 会给容器中导入 DelegatingWebMvcConfiguration 组件，它是 WebMvcConfigurationSupport 的实现类
2. WebMvcAutoConfiguration 有一个核心条件注解：@ConditionalOnMissingBean (WebMvcConfigurationSupport.class)，即容器中没有 WebMvcConfigurationSupport 时，WebMvcAutoConfiguration 才会生效
3. @EnableWebMvc 导入了 WebMvcConfigurationSupport，导致 WebMvcAutoConfiguration 失效，从而禁用了 Spring Boot 对 MVC 的默认自动配置行为

## Web新特性

### Problemdetails

这是 Spring Boot（或 Spring MVC）引入的 Web 新特性，核心是**统一错误信息返回格式**：

1. **规范依据**：遵循 RFC 7807 标准（https://www.rfc-editor.org/rfc/rfc7807）；
2. **功能作用**：当接口返回错误时，会按照 RFC 7807 定义的统一格式返回错误信息（比如包含`type`、`title`、`status`、`detail`等字段），让错误响应更标准化、易读。

```properties
# 开启ProblemDetails（针对Spring Boot 3.x+）
spring.mvc.problemdetails.enabled=true
```

#### 函数式Web

# SSM场景

## 操作

1. 安装依赖

2. 写入数据源 (application.properties)

   ```properties
   spring.application.name=demo02
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   # 数据源
   spring.datasource.type=com.zaxxer.hikari.HikariDataSource
   spring.datasource.url=jdbc:mysql://localhost:3306/mybatis
   spring.datasource.password=Root@321
   spring.datasource.username=root
   ```

3. mapper扫描和controller扫描

   ```java
   @SpringBootApplication
   @MapperScan(basePackages = "com.mapper")
   @ComponentScan(basePackages = "com.controller")
   public class Demo02Application {}
   ```

   mybatis里以包为单位引入`mapper`要遵守两个一致

4. 配置接口的xml文件 (application.properties) 

   ```properties
   mybatis.mapper-locations=classpath:com/mapper/*.xml
   ```

5. 编写实体类(注意mybatisplus的id用`Long`)

6. 编写mapper

7. 编写controller类, 配置`@RestController`

8. 编写方法, 配置`@RequestMapping`

9. 编写xml,sql

其他:

开启驼峰命名:

```properties
mybatis.configuration.map-underscore-to-camel-case=true
```

# 基础特性

## 自定义banner

banner就是:



```properties
spring.banner.location=classpath:banner.txt # 默认就是这个值 也可以改成别的
```

在线banner生成: https://www.bootschool.net/ascii

**关闭banner:**

```properties
spring.main.banner-mode=off
```

## 自定义`SpringApplication`

SpringApplication: Boot应用的核心API入口

```java
// 自定义SpringApplication的底层设置
SpringApplication application = new SpringApplication(Boot306FeaturesApplication.class);
//程序化调整【SpringApplication的参数】
application.setDefaultProperties();
//这个配置不优先
application.setBannerMode(Banner.Mode.OFF);

//【配置文件优先级高于程序化调整的优先级】

//2. SpringApplication 运行起来
application.run(args);
```

```java
// Builder方式构建 SpringApplication； 通过FluentAPI进行设置
new SpringApplicationBuilder()
        // 1. 指定应用的主类（等价于SpringApplication的构造参数）
        .main(Boot306FeaturesApplication.class)
        // 2. 指定Spring Boot应用的核心配置类（启动类）
        .sources(Boot306FeaturesApplication.class)
        // 3. 设置Banner显示模式（控制台输出）
        .bannerMode(Banner.Mode.CONSOLE)
        // 4. 自定义应用环境（示例中传null表示使用默认环境）
        .environment(null)
        // 5. 自定义应用监听器（示例中传null表示使用默认监听器）
        .listeners(null)
        // 6. 执行启动（等价于SpringApplication.run(args)）
        .run(args);
```

## 环境隔离

`@Profile` 标记某个组件（类 / 方法）只在指定环境下生效，只有当 Spring 激活了对应的环境（比如 dev），被该注解标记的组件才会被加载到 IOC 容器中；未激活时，组件会被忽略。

### 标识环境

1. **环境分类**
   - 区分 3 类环境：`dev`（开发环境）、`test`（测试环境）、`prod`（生产环境），另有 `default`（默认环境）
2. **组件环境绑定**
   - 通过 `@Profile({"环境名"})` 标注组件，指定其生效的环境（例如 `@Profile({"test"})` 表示组件仅在测试环境生效）
3. **未标注组件的规则**
   - 组件未加 `@Profile` 注解时，代表在**所有环境下都生效**
4. **生效逻辑**
   - 只有激活指定环境后，对应环境的组件才会生效

### 激活环境

1. **配置文件激活（常用）**

   在 `application.properties`中配置：

   ```properties
   spring.profiles.active=dev,test
   ```

2. **命令行激活（动态切换）**

   启动项目时通过命令行参数指定：

   ```properties
   java -jar xxx.jar --spring.profiles.active=dev
   ```

### 包含环境

```properties
# 包含指定环境,不管你激活哪个环境,这个都要有。总是要生效的环境
spring.profiles.include=dev,test
```

---

 最佳实战: 

- 生效的环境 = 激活的环境/默认环境 + 包含的环境 

- 项目里面这么用: 

  - 基础的配置 mybatis、log、xxx：写到包含环境中 

  - 需要动态切换变化的 db、redis：写到激活的环境中  

### Profile分组

```properties
spring.profiles.group.组名=dev,test # 定义组
spring.profiles.active=组名 # 使用组
```

### 配置文件的隔离

配置文件怎么使用Profile功能
1)、application.properties：主配置文件。任何情况下都生效
2)、其他Profile环境下命名规范：application-{profile标识}.properties：
    比如：application-dev.properties
3)、激活指定环境即可：配置文件激活、命令行激活
4)、项目的所有生效配置项 = 激活环境配置文件的所有 + 主配置文件和激活文件不冲突的所有项
    如果发生了配置冲突，以激活的环境配置文件为准。
    application-{profile标识}.properties 优先级 > application.properties
主配和激活的配置都生效，优先以激活的配置为准

## 外部化配置

> 场景: 线上应用如何快速修改配置, 并应用最新配置? • SpringBoot 使用 配置优先级 + 外部配置 简化配置更新、简化运维。 • 只需要给 jar 应用所在的文件夹放一个 application.properties 最新配置文件, 重启项目就能自动应用最新配置

#### 配置优先级

我们可以使用各种外部配置源，包括 Java Properties 文件、YAML 文件、环境变量和命令行参数。
@Value 可以获取值，也可以用 @ConfigurationProperties 将所有属性绑定到 java object 中

以下是 SpringBoot 属性源加载顺序。后面的会覆盖前面的值。**由低到高**，高优先级配置覆盖低优先级

1. 默认属性（通过 SpringApplication.setDefaultProperties 指定的）
2. @PropertySource 指定加载的配置（需要写在 @Configuration 类上才生效）
3. 配置文件（application.properties/yml 等）
4. RandomValuePropertySource 支持的 random.* 配置（如: @Value ("${random.int}")）
5. OS 环境变量
6. Java 系统属性（System.getProperties ()）
7. JNDI 属性（来自 java:comp/env）
8. ServletContext 初始化参数
9. ServletConfig 初始化参数
10. SPRING_APPLICATION_JSON 属性（内置在环境变量或系统属性中的 JSON）
11. 命令行参数
12. 测试属性。（@SpringBootTest 进行测试时指定的属性）
13. 测试类 @PropertySource 注解
14. Devtools 设置的全局属性。（$HOME/.config/spring-boot）

> 常见的优先级顺序: `命令行`>`配置文件` >`springapplication配置`

配置文件优先级如下:（后面覆盖前面）

1. jar 包内的 Application.properties/yml
2. jar 包内的 application-{profile}.properties/yml
3. jar 包外的 application.properties/yml
4. jar 包外的 application-{profile}.properties/yml

建议：用一种格式的配置文件。如果.properties 和.yml 同时存在，则.properties 优先
所有参数均可由命令行传入，使用 -- 参数项 = 参数值，将会被添加到环境变量中，并优先于配置文件。
比如 java -jar app.jar --name="Spring", 可以使用 @Value ("${name}") 获取

---

SpringBoot 应用启动时会自动寻找 application.properties 和 application.yaml 位置，进行加载。顺序如下:（后面覆盖前面）

1. 类路径:

   a. 类根路径

   b. 类下 /config 包

2. 当前路径（项目所在的位置）

   a. 当前路径

   b. 当前下 /config 子目录

   c. /config 目录的直接子目录

<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260113195623141.png" alt="image-20260113195623141" style="zoom:80%;" />

## 导入配置

```properties
# 导入指定的配置
spring.config.import=classpath:/aaaa.properties
# 导入配置优先级低于配置文件的优先级
```

## 属性占位符

`${ : }`

```properties
server.port=8000
haha=${server.port:这里写如果找不到的默认值}
```

```java
public class HelloController {
    @Value("${haha:这里写如果找不到的默认值}")
    String haha;
}
```

# 单元测试

### 简介

`@SpringBootTest`:标记这是SpringBoot的单元测试，会加载Spring上下文

```java
//测试类也必须在主程序所在的包及其子包
@SpringBootTest //具备测试SpringBoot应用容器中所有组件的功能
class Boot306FeaturesApplicationTests {

    @Test
    void contextLoads() {
        System.out.println("a");
    }
}
```

<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260113201543795.png" alt="image-20260113201543795" style="zoom:80%;" />

如果 SpringBoot 测试类和主程序**不在同一个包下**，需要通过`@SpringBootTest`的`classes`属性指定**主程序的启动类**，让测试框架能加载到 Spring 上下文

```java
@SpringBootTest(classes = Demo02Application.class) // 指定主程序启动类
class MyTest {
    @Test
    void test() {
        System.out.println("测试类与主程序不同包，成功运行");
    }
}
```

---

### 测试注解

@Test : 表示方法是测试方法。但是与 JUnit4 的 @Test 不同，他的职责非常单一 — 不能声明任何属性，拓展的测试将会由 Jupiter 提供额外测试

@ParameterizedTest : 表示方法是参数化测试，下方会有详细介绍

@RepeatedTest : 表示方法可重复执行，下方会有详细介绍

@DisplayName : 为测试类或者测试方法设置展示名称

@BeforeEach : 表示在每个单元测试之前执行

@AfterEach : 表示在每个单元测试之后执行

@BeforeAll : 表示在所有单元测试之前执行

@AfterAll : 表示在所有单元测试之后执行

@Tag : 表示单元测试类别，类似于 JUnit4 中的 @Categories

@Disabled : 表示测试类或测试方法不执行，类似于 JUnit4 中的 @lgnore

@Timeout : 表示测试方法运行如果超过了指定时间将会返回错误

@ExtendWith : 为测试类或测试方法提供扩展类引用

### 断言

| Assertions**方法** | **说明**                             |
| ------------------ | ------------------------------------ |
| assertEquals       | 判断两个对象或两个原始类型是否相等   |
| assertNotEquals    | 判断两个对象或两个原始类型是否不相等 |
| assertSame         | 判断两个对象引用是否指向同一个对象   |
| assertNotSame      | 判断两个对象引用是否指向不同的对象   |
| assertTrue         | 判断给定的布尔值是否为 true          |
| assertFalse        | 判断给定的布尔值是否为 false         |
| assertNull         | 判断给定的对象引用是否为 null        |
| assertNotNull      | 判断给定的对象引用是否不为 null      |
| assertArrayEquals  | 数组断言                             |
| assertAll          | 组合断言                             |
| assertThrows       | 异常断言                             |
| assertTimeout      | 超时断言                             |
| fail               | 快速失败                             |

### 嵌套测试

### 参数化测试

参数化测试是 JUnit5 很重要的一个新特性，它使得用不同的参数多次运行测试成为了可能，也为我们的单元测试带来许多便利。
利用 @ValueSource 等注解，指定入参，我们将可以使用不同的参数进行多次单元测试，而不需要每新增一个参数就新增一个单元测试，省去了很多冗余代码。
@ValueSource: 为参数化测试指定入参来源，支持八大基础类以及 String 类型，Class 类型
@NullSource: 表示为参数化测试提供一个 null 的入参
@EnumSource: 表示为参数化测试提供一个枚举入参
@CsvFileSource: 表示读取指定 CSV 文件内容作为参数化测试入参
@MethodSource: 表示读取指定方法的返回值作为参数化测试入参 (注意方法返回需要是一个流)

```java
@ParameterizedTest
@ValueSource(strings = {"one", "two", "three"})
@DisplayName("参数化测试1")
public void parameterizedTest1(String string) {
    System.out.println(string);
    Assertions.assertTrue(StringUtils.isNotBlank(string));
}


@ParameterizedTest
@MethodSource("method") //指定方法名
@DisplayName("方法来源参数")
public void testWithExplicitLocalMethodSource(String name) {
    System.out.println(name);
    Assertions.assertNotNull(name);
}

static Stream<String> method() {
    return Stream.of("apple", "banana");
}
```

# 核心原理

## 事件和监听器

### 生命周期监听



## 事件触发时机

### 回调监听器



#### 完整触发流程

（9 种事件的触发顺序 & 时机）

1. **ApplicationStartingEvent**

   触发时机：应用启动，但未执行任何操作（仅完成 listeners 和 initializers 的注册）

2. **ApplicationEnvironmentPreparedEvent**

   触发时机：Environment 准备完成，但 ApplicationContext 尚未创建

3. **ApplicationContextInitializedEvent**

   触发时机：ApplicationContext 准备完成，已调用 ApplicationContextInitializers，但未加载任何 Bean

4. **ApplicationPreparedEvent**

   触发时机：容器刷新前，Bean 定义信息已加载

5. **ApplicationStartedEvent**

   触发时机：容器刷新完成，但未调用 runner

6. **AvailabilityChangeEvent**

   触发时机：应用进入存活状态（LivenessState.CORRECT）**存活探针**

7. **ApplicationReadyEvent**

   触发时机：所有 runner 已被调用

8. **AvailabilityChangeEvent**

   触发时机：应用进入就绪状态（ReadinessState.ACCEPTING_TRAFFIC），可接收请求, **就绪探针**

9. **ApplicationFailedEvent**

   触发时机：应用启动过程中出现错误



感知应用是否**存活**: 植物状态

感知应用是否**就绪**: 响应请求

最佳实战:

- 如果项目启动前做事: BootstrapRegistryInitializer 和 ApplicationContextInitializer
- 如果想要在项目启动完成后做事: ApplicationRunner 和 CommandLineRunner
- 如果要干涉生命周期做事: SpringApplicationRunListener
- 如果想要用事件机制: ApplicationListener

#### 事件驱动开发

应用启动过程生命周期事件感知（9 大事件）、应用运行中事件感知（）

- 事件发布：ApplicationEventPublisherAware 或 注入：ApplicationEventMulticaster
- 事件监听：组件 + @EventListener

## 自动配置原理



**导入依赖**

- 导入 `starter`
- 依赖导入 `autoconfigure`

**定位配置文件**

寻找类路径下的配置文件：`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

**加载自动配置类**

应用启动时，加载所有自动配置类（`xxxAutoConfiguration`），并执行以下操作：

- a. 向容器中配置功能组件
- b. 将组件参数绑定到属性类（`xxxProperties`）中
- c. 实现属性类与配置文件的前缀绑定
- d. 通过`@Conditional`派生的条件注解，判断组件是否生效

**最终效果**

- a. 可通过修改配置文件，调整底层参数
- b. 所有场景自动配置完成，可直接使用
- c. 可注入 SpringBoot 已配置好的组件，随时使用

#### SPI机制

#### 功能开关

- 自动配置：全部都配置好，什么都不用管。自动批量导入
  -  项目一启动，spi 文件中指定的所有都加载。

- @EnableXxx：手动控制哪些功能的开启；手动导入。
  - 开启 xxx 功能◦ 都是利用 @Import 把此 xxx 要用的组件导入进去

## 进阶理解

### @SpringBootApplication

### @SpringBootConfiguration

就是@Congiguration, 容器中的组件, 配置类, spring ioc容器就会加载创建这个类对象

### @EnableAutoConfiguration

开启自动配置

#### @AutoConfigurationPackage

 扫描主程序包：加载自己的组件 

* 利用 @Import(AutoConfigurationPackages.Registrar.class) 想要给容器中导入组件。 

* 把主程序所在的包的所有组件导入进来。 

 为什么SpringBoot默认只扫描主程序所在的包及其子包 

#### @Import(AutoConfigurationImportSelector.class)

加载所有自动配置类 加载starter导入的组件

> 扫描SPI文件: `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

#### @ComponentScan

> 组件扫描：排除一些组件（哪些不要） 排除前面已经扫描进来的配置类、和自动配置类。



# 自定义start

## 基础业务代码

```properties
robot.name = Anni
robot.age = 10
```

```java
@Component
@ConfigurationProperties("robot")
@Data
public class RobotProperties {
    private String name;
    private Integer age;
}
```

```java
@Service
public class RobotService {

    @Autowired
    RobotProperties robot;

    public String sayHello() {
        return "姓名: " + robot.getName() + "  年龄: " + robot.getAge();
    }
}
```

```java
@RestController
public class RobotController {

    @Autowired
    RobotService robotService;

    @RequestMapping("/robot/hello")
    public String sayHello() {
        return robotService.sayHello();
    }
}
```

在`properties`编写自定义`start`参数时也有提示:

导入配置处理器

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

## 基本抽取

创建模块start, 把业务代码加入, 注意开启组件扫描



注意删掉类上的类引入, 重新引入

```java
import com.robot.service.RobotService;
import org.springframework.beans.factory.annotation.Autowired;
```

引用测试:

```xml
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>boot3-robot-start</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
```

运行访问:



无法访问

原因: demo2的类默认扫描主程序所在的包及其子包, 不会扫描robot包

解决: 编写配置类, 通过`@Input`导入

```java
@SpringBootApplication
@MapperScan(basePackages = "com.mapper")
@ComponentScan(basePackages = "com.controller")
@Import(RobotAutoConfiguration.class)
public class Demo02Application {

    public static void main(String[] args) {
        SpringApplication.run(Demo02Application.class, args);
    }

}
```



```java
@Configuration
@Import({RobotController.class, RobotService.class, RobotProperties.class})
public class RobotAutoConfiguration {
}
```

生效:



## 使用Enable机制

`start`创建注解

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Documented
@Import({RobotController.class, RobotService.class, RobotProperties.class})
public @interface EnableRobot {
}
```

在`demo2`的启动类上添加注解

```java
@EnableRobot // 添加
@SpringBootApplication
@ComponentScan(basePackages = "com.robot")
public class Boot3RobotStartApplication {

    public static void main(String[] args) {
        SpringApplication.run(Boot3RobotStartApplication.class, args);
    }

}
```

成功

## 完全自动

> `demo2`的启动类上添加`@ComponentScan(basePackages = "com")`

依赖 SpringBoot 的 SPI 机制

会扫描每一个jar包的`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`





成功

# 场景整合

## NoSQL

### Redies整合

## 接口文档

Swagger 可以快速生成实时接口文档，方便前后开发人员进行协调沟通。遵循 OpenAPI 规范。

文档: https://springdoc.org/v2/

### open3架构



### 整合

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.1.0</version>
</dependency>
```



<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260115151453347.png" alt="image-20260115151453347" style="zoom:80%;" />

### 使用

| **注解**     | **标注位置**        | **作用**               |
| ------------ | ------------------- | ---------------------- |
| @Tag         | controller 类       | 标识 controller 作用   |
| @Parameter   | 参数                | 标识参数作用           |
| @Parameters  | 参数                | 参数多重说明           |
| @Schema      | model 层的 JavaBean | 描述模型作用及每个属性 |
| @Operation   | 方法                | 描述方法作用           |
| @ApiResponse | 方法                | 描述响应状态码等       |



## 远程调用

RPC（Remote Procedure Call）：远程过程调用



## 消息服务



## Web安全

* Apache Shiro
* Spring Security

## 可观测性

对线上应用进行观测、监控、预警...

- 健康状况【组件状态、存活状态】Health
- 运行指标【cpu、内存、垃圾回收、吞吐量、响应成功率...】Metrics
- 链路追踪
- ......

### SpringBoot  Actuator

可观测性场景启动器:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

创建项目:



访问: `localhost:8080/actuator`, 展示所有可用的监控端点

**暴露指标**

```properties
#通过web方式暴露所有监控端点
management.endpoints.web.exposure.include=*
```



## AOT

AOT：Ahead-of-Time（提前编译）：程序执行前，全部被编译成机器码

JIT：Just in Time（即时编译）：程序边编译，边运行

# 前提知识

## Lambda

## 函数式编程

常用函数式接口





## Stream API

声明式处理集合数据, 包括: 筛选, 转换, 组合

**流的分类:**

* Stream Pipeline：流管道、流水线
* Intermediate Operations：中间操作
* Terminal Operation：终止操作

Stream 所有数据和操作被组合成**流管道**

**流管道组成：**

- 一个数据源（可以是一个数组、集合、生成器函数、I/O 管道）
- 零或多个中间操作（将一个流变形成另一个流）
- 一个终止操作（产生最终结果）

> 流是惰性的: 只有在启动最终操作时才会对源数据进行计算，而且只在需要时才会消耗源元素；

```java
// 假设list是一个Integer类型的集合（如List<Integer> list = Arrays.asList(1,2,3,4)）
list.stream() // 获取集合的Stream流，类型为Stream<Integer>
    // 中间操作：filter（过滤），只保留偶数元素
    .filter(ele -> {
        // 打印当前正在过滤的元素（验证流的惰性执行）
        System.out.println("正在filter: " + ele);
        // 过滤条件：元素是偶数（ele % 2 == 0）
        return ele % 2 == 0;
    })
    // 终止操作：max（求最大值），通过Integer的比较器获取流中最大元素，返回Optional<Integer>
    .max(Integer::compareTo)
    // 终止操作的后续处理：如果存在最大值，则打印该值
    .ifPresent(System.out::println);
```

```java
// 1）、创建流
Stream<Integer> stream = Stream.of(1, 2, 3);
Stream<Integer> concat = Stream.concat(Stream.of(2, 3, 4), stream);
Stream<Object> build = Stream.builder().add("11").add("22").build();

// 2）、从集合容器中获取这个流, List、Set、Map
List<Integer> integers = List.of(1, 2);
Stream<Integer> stream1 = integers.stream();

Set<Integer> integers1 = Set.of(1, 2);
integers1.stream();

Map<Object, Object> of = Map.of();
of.keySet().stream();
of.values().stream();
```

**流默认不并发**, 通过`.parallel()`可以并发, 并发后要解决多线程安全问题

流在非并发情况下, 只有一个元素通过了流水线上的所有操作后, 才会轮到下一个元素

**流的所有操作都是无状态**: Stream 的中间操作（如 `filter`、`map`）在处理元素时，不会依赖或修改外部的变量 / 状态，也不会将处理过程中的数据状态 “传递” 到其他操作或函数外部。

**数据状态仅在此函数内有效，不溢出至函数外**: Stream 操作中处理元素时产生的 “临时数据状态”，只在当前操作的函数（Lambda 表达式）内部有效，不会 “泄露” 到函数外部影响其他逻辑。

### 中间操作

filter、
map、mapToInt、mapToLong、mapToDouble
flatMap、flatMapToInt、flatMapToLong、flatMapToDouble
mapMulti、mapMultiToInt、mapMultiToLong、mapMultiToDouble、
parallel、unordered、onClose、sequential
distinct、sorted、peek、limit、skip、takeWhile、dropWhile、

## Reactive-Stream规范











