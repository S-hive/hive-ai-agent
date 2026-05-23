# 简介

## MVC

MVC 是一种软件架构思想，将软件划分为**模型（Model）、视图（View）、控制器（Controller）** 三个部分。

### 2. 各部分组成及作用

- **M（Model，模型层）**：对应工程中的 JavaBean，负责处理数据，分为两类：
  - 实体类 Bean：存储业务数据（如 Student、User）；
  - 业务处理 Bean：处理业务逻辑、数据访问（如 Service、Dao 对象）。
- **V（View，视图层）**：对应工程中的 html 或 jsp 页面，负责与用户交互、展示数据。
- **C（Controller，控制层）**：对应工程中的 servlet，负责接收请求、响应浏览器。

### 3. MVC 工作流程

1. 用户通过视图层发送请求到服务器；
2. 控制器（Controller）接收请求；
3. 控制器调用模型层（Model）处理请求；
4. 模型层处理后将结果返回给控制器；
5. 控制器根据结果选择对应的视图，渲染数据后响应给浏览器。

## SpringMVC

SpringMVC 是 Spring 的**后续产品、子项目**。

### 2. SpringMVC 的作用

是 Spring 为**表述层开发**提供的完整解决方案，是当前 Java EE 项目表述层开发的业界首选框架（替代了 Struts、WebWork、Struts2 等旧框架）。

### 3. 关联三层架构

三层架构包含**表述层（表示层）、业务逻辑层、数据访问层**，其中表述层对应前台页面 + 后台 servlet，SpringMVC 负责的正是表述层开发。

# HelloWorld

### **添加依赖**

配置pom.xml文件

### **配置 Web 项目 “部署描述符”**

（即`web.xml`）的位置


### **配置web.xml**


#### **默认配置方式**

SpringMVC配置文件位置默认, 名称默认

- SpringMVC 的配置文件（如`springMVC-servlet.xml`）会**默认放在`WEB-INF`目录下**；
- 文件名规则是：`[servlet-name]-servlet.xml`（比如这里`servlet-name`是`springMVC`，所以配置文件名是`springMVC-servlet.xml`）。

```xml
    <!--配置springMVC的前端控制器, 对浏览器发送的请求统一处理-->
    <servlet>
        <servlet-name>springMVC</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>springMVC</servlet-name>
        <url-pattern>/</url-pattern> <!--统一处理-->
        <!--
            设置springMVC的核心控制器所能处理的请求的请求路径
            /所匹配的请求可以是/login或.html或.js或.css方式的请求路径
            但是/不能匹配.jsp请求路径的请求(jsp本质是一个servlet, 需要特殊servlet处理)
            /* 代表所有请求, 包含jsp
        -->
    </servlet-mapping>
```

新增一个`springMVC-servlet.xml`([servlet-name]-servlet.xml) 文件

不足: 在maven工程下的配置文件应该放在resource目录下

> 为什么要新增文件?
>
> ![image-20251229114151847](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251229114151847.png)

#### **拓展配置方式**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!--配置springMVC的前端控制器, 对浏览器发送的请求统一处理-->
    <servlet>
        <servlet-name>springMVC</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!--配置SpringMVC配置文件的位置和名称-->
        <init-param>
            <!--SpringMVC 规定的固定参数名, 指定排至文件位置,名字-->
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springMVC.xml</param-value>
            <!--src/main/resources, src/main/java-->
        </init-param>
        <!--默认初始化在第一次访问是初始化, 但是要初始化的内容很多, 会需要很多时间, 最好把初始化时间提前到服务器启动时 -->
        <load-on-startup>6</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>springMVC</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

##### **编辑SpringMVC配置文件**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc https://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd"
>
    <!--扫描组件-->
    <context:component-scan base-package="com"/>
    <!-- 配置Thymeleaf视图解析器 -->
    <bean id="viewResolver" class="org.thymeleaf.spring5.view.ThymeleafViewResolver">
        <property name="order" value="1"/>
        <property name="characterEncoding" value="UTF-8"/>
        <property name="templateEngine">
            <bean class="org.thymeleaf.spring5.SpringTemplateEngine">
                <property name="templateResolver">
                    <bean class="org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver">
                        <!-- 视图前缀 -->
                        <property name="prefix" value="/WEB-INF/templates/"/>
                        <!-- 视图后缀 -->
                        <property name="suffix" value=".html"/>
                        <property name="templateMode" value="HTML5"/>
                        <property name="characterEncoding" value="UTF-8"/>
                    </bean>
                </property>
            </bean>
        </property>
    </bean>
    <!--
处理静态资源，例如html、js、css、jpg
若只设置该标签，则只能访问静态资源，其他请求则无法访问
此时必须设置<mvc:annotation-driven解决问题
-->
    <mvc:default-servlet-handler/>

    <!-- 开启mvc注解驱动 -->
    <mvc:annotation-driven>
        <mvc:message-converters>
            <!-- 处理响应中文乱码 -->
            <bean class="org.springframework.http.converter.StringHttpMessageConverter">
                <property name="defaultCharset" value="UTF-8"/>
                <property name="supportedMediaTypes">
                    <list>
                        <value>text/html</value>
                        <value>application/json</value>
                    </list>
                </property>
            </bean>
        </mvc:message-converters>
    </mvc:annotation-driven>
</beans>
```

### 编写html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<h1>首页</h1>
<a th:href="@{/target}">页面target.html</a>
</body>
</html>
```

### **创建请求控制器**


1. **控制器的作用**

前端控制器（DispatcherServlet）会统一接收浏览器请求，但**不同请求有不同的业务处理逻辑**，因此需要专门的 “请求控制器” 类，负责处理具体请求。

2. **控制器的核心概念**

- **控制器类**：处理具体请求的类。
- **控制器方法**：控制器类中，专门对应某个请求的方法（一个方法处理一个 / 一类请求）。

3. **控制器的实现规则**

​	SpringMVC 的控制器是**普通 Java 类（POJO）**，需满足以下条件才能被识别：

- 必须添加`@Controller`注解，将该类标识为 “控制层组件”；
- 该类会被 Spring 的 IOC 容器管理，SpringMVC 才能感知到它的存在并调用其方法。

```java
/**
 * 创建一个控制器
 */
@Controller
public class HelloController {

    @RequestMapping(value = "/") //映射请求路径与控制器方法
    public String index() {
        // 返回视图名称
        return "index";
    }

    @RequestMapping("/target")
    public String toTarget() {
        return "target";
    }
}
```

### 部署`tomcat`启动项目

### 总结

浏览器发送请求，若请求地址符合前端控制器的 url-pattern，该请求就会被前端控制器 DispatcherServlet 处理。

前端控制器会读取 SpringMVC 的核心配置文件，通过扫描组件找到控制器，将请求地址和控制器中

@RequestMapping 注解的 value 属性值进行匹配，若匹配成功，该注解所标识的控制器方法就是处理请求的方法。处理请求的方法需要返回一个字符串类型的视图名称，该视图名称会被视图解析器解析，加上前缀和后缀组成

视图的路径，通过 Thymeleaf 对视图进行渲染，最终转发到视图所对应页面

> 为什么springmvc是转发不是重定向, url不是变化了吗从/ 变成/target
>
> ![image-20251229211230844](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251229211230844.png)

---

**URL 链接语法**

`th:href="@{/target}"` 是 Thymeleaf 的**URL 链接语法**：

- `@{}` 是 Thymeleaf 的 URL 表达式标记，用于生成动态的、带上下文路径的链接；
- `/target` 是请求路径（对应控制器中`@RequestMapping("/target")`的方法）；
- Thymeleaf 会自动拼接**项目的上下文路径（Context Path）**，比如项目上下文是`/SpringMVC-demo1`，最终生成的链接会是 `/SpringMVC-demo1/target`。

# @RequestMapping注解

## 位置

在类上: 请求路径的初始信息

在方法上: 具体信息

## 属性

#### a. `value` 或 `path` (请求路径)

这是最常用的属性，用于指定请求的 URL 路径。

- `value` 和 `path` 是别名，可以互换使用。
- 可以是一个字符串，也可以是一个字符串数组，用于匹配多个路径。

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class MyController {

    // 当访问 http://localhost:8080/hello 时，此方法会被调用
    @RequestMapping("/hello")
    @ResponseBody // 表示直接将方法的返回值作为 HTTP 响应体
    public String sayHello() {
        return "Hello, Spring MVC!";
    }

    // 也可以使用 path 属性，效果完全相同
    @RequestMapping(path = "/greet")
    @ResponseBody
    public String greet() {
        return "Welcome!";
    }

    // 一个方法可以匹配多个路径
    @RequestMapping({"/hi", "/hey"})
    @ResponseBody
    public String sayHi() {
        return "Hi there!";
    }
}
```

#### b. `method` (请求方法)

用于指定 HTTP 请求的方法（如 GET, POST, PUT, DELETE 等）。如果不指定，该方法将处理所有类型的 HTTP 请求。

```java
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class UserController {

    // 只处理针对 /users 的 GET 请求
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    @ResponseBody
    public String getAllUsers() {
        return "Getting all users...";
    }

    // 只处理针对 /users 的 POST 请求
    @RequestMapping(value = "/users", method = RequestMethod.POST)
    @ResponseBody
    public String createUser() {
        return "Creating a new user...";
    }
}
```

> form表单不能发送除了get和post之外的其他请求, 其他请求默认按get处理

#### c. `params` (请求参数)

用于指定请求中必须包含的参数, 严格匹配。

- `"param"`：请求必须携带`param`参数
- `"!param"`：请求必须**不能**携带`param`参数
- `"param=value"`：请求必须携带`param`参数，且参数值为`value`
- `"param!=value"`：请求必须携带`param`参数，但参数值**不等于**`value`

```java
@Controller
public class SearchController {

    // 仅当请求 URL 中包含 "type=book" 参数时才匹配，例如 /search?type=book
    @RequestMapping(value = "/search", params = "type=book")
    @ResponseBody
    public String searchBooks() {
        return "Searching for books...";
    }

    // 仅当请求 URL 中包含 "name" 参数时才匹配，例如 /search?name=java
    @RequestMapping(value = "/search", params = "name")
    @ResponseBody
    public String searchByName() {
        return "Searching by name...";
    }
}
```

![image-20251230161716573](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251230161716573.png)

![image-20251230161726588](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251230161726588.png)

#### d. `headers` (请求头)

用于指定请求中必须包含的 HTTP 头信息, 严格匹配。

- `"header"`：请求必须携带`header`请求头信息
- `"!header"`：请求必须**不能**携带`header`请求头信息
- `"header=value"`：请求必须携带`header`请求头信息，且头信息值为`value`
- `"header!=value"`：请求必须携带`header`请求头信息，但头信息值**不等于**`value`

```java
@Controller
public class ApiController {

    // 仅当请求头中包含 "X-API-VERSION=1" 时才匹配
    @RequestMapping(value = "/api/data", headers = "X-API-VERSION=1")
    @ResponseBody
    public String getV1Data() {
        return "Data from API v1";
    }
}
```

#### e. `consumes` 和 `produces`

- `consumes`: 指定处理请求的内容类型（Content-Type），例如 `application/json`, `application/xml`。
- `produces`: 指定方法可以生成的响应内容类型，它会影响 HTTP 响应头的 `Content-Type`。

```java
import org.springframework.http.MediaType;

@Controller
public class DataController {

    // 处理 Content-Type 为 application/json 的 POST 请求
    @RequestMapping(value = "/data", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String handleJsonData() {
        return "JSON data received";
    }

    // 生成的响应内容类型为 application/json
    @RequestMapping(value = "/data/json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getJsonData() {
        return "{\"message\": \"Hello JSON\"}";
    }
}
```

---

### 4. 组合注解 (Composed Annotations)

为了简化代码，Spring 3.1 引入了一系列组合注解，它们本质上是 `@RequestMapping` 的特定形式。

| 组合注解         | 等效的 `@RequestMapping`                         |
| ---------------- | ------------------------------------------------ |
| `@GetMapping`    | `@RequestMapping(method = RequestMethod.GET)`    |
| `@PostMapping`   | `@RequestMapping(method = RequestMethod.POST)`   |
| `@PutMapping`    | `@RequestMapping(method = RequestMethod.PUT)`    |
| `@DeleteMapping` | `@RequestMapping(method = RequestMethod.DELETE)` |
| `@PatchMapping`  | `@RequestMapping(method = RequestMethod.PATCH)`  |

## value属性里路径的其他写法

**ant风格**

* `?`：匹配任意单个字符

* `*`：匹配任意0 个或多个字符

* `**`：匹配任意一层或多层目录

注意：`**`只能用`/**/xxx`的格式, `**`前后不能有字符

**占位符**

- 作用：用于 RESTful 风格，将数据通过路径传递（替代传统的`?参数=值`方式）
- 对比：
  - 原始方式：`/deleteUser?id=1`
  - REST 方式：`/deleteUser/1`
- 使用方式：
  1. 在`@RequestMapping`的`value`中用`{xxx}`定义占位符（如`@RequestMapping("/deleteUser/{id}")`）
  2. 用`@PathVariable`注解，将路径中占位符的值赋值给控制器方法的形参

前端请求

```html
<a th:href="@{/testRest/1/admin}">测试路径中的占位符</a>
```

后端`Controller `方法

```java
@RequestMapping("/testRest/{id}/{username}")
public String testRest(
    @PathVariable("id") String id, 
    @PathVariable("username") String username
) {
    System.out.println("id:"+id+", username:"+username);
    return "success";
}
```

# 获取请求参数

## **通过`servleAPIt`获取**

![image-20251230184820684](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251230184820684.png)

dispartservlet会自动放入形参

## **通过控制器方法的形参**

形参的参数名和请求参数名一致, 会自动注入

![image-20251230190040450](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251230190040450.png)

如果获取的是同名的多个值, 会把每个值通过逗号隔开

![image-20251230190752303](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251230190752303.png)

也可以在参数声明时声明数组

![image-20251230190922459](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251230190922459.png)

会获得一个数组

![image-20251230190942858](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251230190942858.png)

### 如果请求参数和形参名字不一致怎么办?

### 修改请求参数或形参的名字

### @RequesParam

将 HTTP 请求中的**参数绑定**到控制器方法的参数上。

![image-20251230191707692](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251230191707692.png)

此时`user_name`参数必须传递, 否则就会报错

把注解参数`required`改成`false`就不会报错, 找不到会补充`null`

`defaultValues`会指定当值没有时返回的默认值

### @RequestHeader

- 作用：将**请求头信息**与控制器方法的形参建立映射关系
- 属性：包含`value`（指定请求头名称）、`required`（是否必需，默认 true）、`defaultValue`（默认值），用法和`@RequestParam`一致

### CookieValue

- 作用：将**Cookie 数据**与控制器方法的形参建立映射关系
- 属性：包含`value`（指定 Cookie 名称）、`required`（是否必需，默认 true）、`defaultValue`（默认值），用法和`@RequestParam`一致

## 实体类

请求参数名和实体类的属性名一致, 会自动注入值

实体类:

```java
public class User{
    private Integer id;
    private Integer age;
    private String name;
    private String password;
    private String sex;
}
```

发送请求的`html`页面:

```html
<form th:action="@{/testPOJO}" method="post">
    用户名: <input type="text" name="username"><br>
    密码: <input type="password" name="password"><br>
    性别: <input type="radio" name="sex" value="男">男<input type="radio" name="sex" value="女">女<br>
    年龄: <input type="text" name="age"><br>
    <input type="submit" value="使用实体类接收请求参数">
</form>
```

获取参数信息:

```java
@ReauesMapping("/")
public String test(User user) { // 会自动注入user实体类
    ...
}
```

# 乱码问题

通过CharacterEncodingFilter处理获取请求参数的乱码问题

针对`post`请求的乱码问题, `get`请求的乱码问题在tomcat配置文件中已经被解决

在获取请求参数后再设置编码不会生效, `dispatchservlet`获取请求方法在我们获取参数信息前, 所以在获取参数信息类里设置编码没用

所以应该找比`servlet`启动更早的: 监听器->过滤器->`servlet`

![image-20251230202053826](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251230202053826.png)

```xml
<filter>
    <filter-name>CharacterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
    	<param-name>encoding</param-name> <!--固定, 设置filter的encoding -->
    	<param-value>UTF-8</param-value>
	</init-param>
    <init-param>
    	<param-name>forceResponseEncoding</param-name> <!--响应代码 -->
    	<param-value>true</param-value>
	</init-param>
</filter>
<filter-mapping>
    <filter-name>CharacterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

响应代码可以不写, 通过`response.setContentType()`服务器向客户端输出文本内容:

```java
response.setContentType("text/html;charset=UTF-8");
```

# 向域对象中共享数据

1. 配置`web.xml`文件
   * 编码过滤器
   * `springMVC`前端控制器`DispatcherServlet`
     * 核心入口
     * 配置文件自定义路径
     * 加载顺序
   * 前端控制器的配置文件
     * 扫描组件
     * 视图解析器

## 通过`servleAPI`获取

```java
@Controller
public class ScopeController {
    @RequestMapping("/testRequestByServletAPI")
    // 直接作为参数, 会自动注入
    public String teset(HttpServletRequest req) {
        request.setAttribute("test", "value")
            return "testRequestByServletAPI";
    }
}
```

获取: (success.index)

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
	...
    <body>
        <P th:test="${test}"/> <!--@{}用于解析路径, ${}用于解析参数 -->
    </body>
</html>
```

访问: (index.html)

```xml
<html lang="en" xmlns:th="http://www.thymeleaf.org">
	...
    <body>
        <a th:href="@{/testRequestByServletAPI}">通过servletAPI向request对象共享</a>
    </body>
</html>
```

## 使用`ModelAndView`

它是 Spring MVC 中**同时封装数据和视图信息**的对象，整合了`Model`（数据）和`View`（视图）的功能：

1. **Model 部分**：负责向请求的作用域（如请求域）中添加共享数据，供前端页面（如 Thymeleaf 模板）获取并展示。
2. **View 部分**：负责指定要跳转的视图名称（如页面文件名），由 Spring MVC 的视图解析器解析为实际的页面路径，实现页面跳转。

```java
@RequestMapping("/testModelAndView")
public ModelAndView test() {
    ModelAndView mav = new ModelAndView();
    //处理模型数据, 向请求域中共享数据
    mav.addObject("name", "value");
    // 设置视图名称
    mav.setViewName("success");
    return mav;
}
```

在源码中, 无论用什么方法, 最终都会封装到`ModelAndView`中

## 使用`Model`

就是`ModelAndViev`中的`Model`

```java
@RequestMapping("/testModelAndView")
public String test(Model mod) {
    model.addAttribute("test", "vlaue");
    return "success";
}
```

## 使用`Map`集合

```java
@RequestMapping("/testMap")
public String testMap(Map<String, Object> map) {
    map.put("testScope", "hello,Map");
    return "success";
}
```

## 使用`ModelMap`

```java
@RequestMapping("/testModelMap")
public String testMap(ModelMap modMap) {
    modMap.addAttribute("testScope", "hello,Map");
    return "success";
}
```

## `ModelAndView` ` Model` ` ModelMap` 关系


可以发现是一样的

`ctrl+H`查看实现的类型


源码:

![image-20251231115356334](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251231115356334.png)

这个方法会调用控制器方法, 最终返回一个`ModelAndView`类型对象

## 向`session`域共享数据

servletAPI

```java
@RequestMapping("/testSession")
public String testSession(HttpSession session) {
    session.setAttribute("testSessionScope", "hello,session");
    return "success";
}
```

## 向`application`域共享数据

```java
@RequestMapping("/testApplication")
public String testApplication(HttpSession session){
    ServletContext application = session.getServletContext();
    application.setAttribute("testApplicationScope", "hello,application");
    return "success";
}
```

# 视图

对应`ModelAndView`的`view`

## ThymeleafView

当控制器方法中所设置的视图名称**没有任何前缀**时，此时的视图名称会被 SpringMVC 配置文件中所配置的视图解析器解析，视图名称拼接视图前缀和视图后缀所得到的最终路径，会通过转发的方式实现跳转

```java
@Controller
public class ViewController {
    @RequestMapping("/testApplication")
	public String testApplication(HttpSession session){
    	ServletContext application = session.getServletContext();
    	application.setAttribute("testApplicationScope", "hello,application");
    	return "success";
}
}
```

## InternalResourveView 转发视图

视图前缀为`forward:`时

会创建两个视图: 转发视图(InternalResourveView)+目标 视图

## RedirectView 重定向视图

视图前缀为`redirect:`时

会创建两个视图

## xml方式配置

没有其他请求映射处理, 只需要映射路径和视图名时可以在`springMVC`配置文件配置视图控制器:

```xml
<mvc:view-controller path="处理的请求地址" view-name="请求地址所对应的视图名称"/>
```

在控制器中写的请求映射会全部失效, 解决:

```xml
<!--开启mvc的注解驱动 -->
<mvc:annotation-driven/>
```

# RESTFul

一种**设计风格**或**指导思想**，用于构建网络应用程序的 API（应用程序编程接口）。它不是一个标准或协议，而是一套约束和最佳实践。

### 什么是 RESTful？

RESTful 是 **REST (Representational State Transfer，表述性状态转移)** 的形容词形式。一个遵循 REST 原则设计的 API 就可以被称为 RESTful API。

1. **资源 (Resource)**
   - **万物皆资源**：在 REST 的世界里，一切都被看作是 “资源”。比如，一个用户、一篇文章、一个订单、一张图片，都是资源。
   - **用 URI 标识**：每个资源都有一个唯一的地址，叫做 **URI (Uniform Resource Identifier)**。
2. **表述 (Representation)**
   - 当你通过 URI 请求一个资源时，服务器不会把资源本身（比如数据库里的原始数据）直接给你，而是会给你这个资源的 **“表述”**。
   - 这个表述可以是多种格式，最常见的是 **JSON** 或 **XML**。

1. **状态转移 (State Transfer)**
   - 客户端通过发送 HTTP 请求来操作服务器上的资源，这个过程就是 “状态转移”。
   - 客户端的状态是变化的（比如从 “未登录” 到 “已登录”），而服务器上的资源状态也可能随之改变（比如一篇文章从 “草稿” 变为 “已发布”）。
   - 这种转移是**无状态 (Stateless)** 的。这意味着服务器**不会保存**任何关于客户端会话的信息。**每一次请求都必须包含所有必要的信息**（比如身份验证令牌），服务器才能理解并处理它。

## RESTful API 的核心设计原则

一个真正的 RESTful API 会遵循以下几个关键原则：

#### 1. 使用 HTTP 方法表达操作意图

这是 RESTful 最显著的特征。我们不再使用 `getUser`, `deleteUser` 这样的动词来命名 URL，而是使用标准的 **HTTP 方法**来表示对资源的操作。

- **GET**：获取资源。（**安全、幂等**）
  - `GET /users`：获取所有用户列表。
  - `GET /users/123`：获取 ID 为 123 的用户信息。
- **POST**：创建新资源。（**不安全、不幂等**）
  - `POST /users`：创建一个新用户。请求体中包含新用户的数据。
- **PUT**：更新或替换资源。（**不安全、幂等**）
  - `PUT /users/123`：用请求体中的数据**完全替换** ID 为 123 的用户信息。
- **DELETE**：删除资源。（**不安全、幂等**）
  - `DELETE /users/123`：删除 ID 为 123 的用户。

> **安全 (Safe)**：指操作不会改变服务器上的资源状态（比如 `GET` 只是读取，不会创建、修改或删除）。
>
> **幂等 (Idempotent)**：指多次执行同一个操作，结果都是相同的。比如 `DELETE /users/123`，无论执行一次还是十次，最终结果都是用户 123 被删除了。而 `POST /users` 不是幂等的，因为每次调用都会创建一个新的用户。

#### 2. 资源使用名词复数形式

URL 应该只包含名词，用来表示资源，而不是动词。使用复数形式是一种常见的最佳实践。

- **推荐**：`/users`, `/products`, `/orders`
- **不推荐**：`/getUser`, `/createProduct`, `/deleteOrder`

#### 3. 利用 URI 路径层级表示资源间的关系

可以通过嵌套的 URI 来表示资源之间的父子关系。

- `GET /users/123/orders`：获取 ID 为 123 的用户的所有订单。
- `GET /users/123/orders/456`：获取 ID 为 123 的用户的 ID 为 456 的订单。

#### 4. 使用查询参数进行过滤、排序和分页

当需要对资源列表进行筛选时，使用查询参数（Query Parameters）。

- `GET /users?role=admin`：获取所有角色为 "admin" 的用户。
- `GET /products?category=electronics&sort=price_asc`：获取电子产品分类下按价格升序排列的产品。
- `GET /articles?page=2&size=10`：获取文章列表的第 2 页，每页 10 条。

#### 5. 返回合适的 HTTP 状态码

服务器应该使用标准的 HTTP 状态码来告知客户端请求的处理结果。

- `200 OK`：请求成功。
- `201 Created`：资源创建成功（通常用于 `POST` 请求）。
- `204 No Content`：请求成功，但没有响应体（通常用于 `DELETE` 请求）。
- `400 Bad Request`：请求参数错误。
- `401 Unauthorized`：未认证，需要登录。
- `403 Forbidden`：已认证，但没有权限。
- `404 Not Found`：请求的资源不存在。
- `500 Internal Server Error`：服务器内部错误。

---

## 操作

使用 RESTFul 模拟用户资源的增删改查
/user 	GET 	查询所有用户信息
/user/1      GET 	根据用户 id 查询用户信息
/user         POST       添加用户信息
/user/1     DELETE    删除用户信息
/user        PUT           修改用户信息

### GET

```java
@Controller
public class UseraaController {
    @RequestMapping(value = "/user", method=RequestMethod.GET)
	public String getUser(){
        ...
        return "success"
	}
}
```

---

```java
@Controller
public class UseraaController {
    @RequestMapping(value = "/user/{id}", method=RequestMethod.GET)
	public String getUserById(){
        ...
        return "success"
	}
}
```

```xml
<a th:href="@{/user/3}">根据用户id查询信息</a>
```

### POST

```java
    @RequestMapping(value = "/user", method=RequestMethod.POST)
	public String insertUser(String username){
        ...
        return "success"
	}
```

```xml
<form th:action="@{/user}" method="post">
	用户名: <input type="text" name="username"/><br/>
</form>
```

### DELETE PUT

**问题**: 在 Web 开发中，**浏览器默认只能发送 GET 和 POST 请求**，无法直接发送 DELETE 和 PUT 请求, 会默认按照GET处理

> 浏览器的表单（`<form>`）只支持`method="get"`和`method="post"`两种请求方式；而通过地址栏访问、超链接点击等操作，本质上都是 GET 请求。因此浏览器本身不提供直接触发 DELETE、PUT 请求的原生能力。

**解决**1: 请求伪装, 在前端通过 POST 请求携带一个特殊参数（如`_method=DELETE`），后端通过`HiddenHttpMethodFilter`（SpringMVC 提供的过滤器）将 POST 请求 “伪装” 成 DELETE/PUT 请求，从而支持 RESTful 的请求方式。

**通过过滤器**

1. xml配置过滤器 HiddenHttpMethodFilter

   ```xml
   <!-- 配置HiddenHttpMethodFilter-->
   <filter>
       <filter-name>HiddenHttpMethodFilter</filter-name>
       <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
   </filter>
   <filter-mapping>
       <filter-name>HiddenHttpMethodFilter</filter-name>
       <url-pattern>/*</url-pattern>
   </filter-mapping>
   ```

2. http_PUT

   ```html
   <form th:action="@{/user}" method="post">
       <input type="hidden" name="_method" value="PUT"> <!--也可以是DELETE -->
       
       用户名: <input type="text" name="username"><br>
       密码: <input type="password" name="password"><br>
       <input type="submit" value="修改"><br>
   </form>
   ```

3. java_PUT

   ```java
       @RequestMapping(value = "/user", method=RequestMethod.PUT)
   	public String insertUser(String username){
           ...
           return "success"
   	}
   ```

   ![image-20251231193933154](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20251231193933154.png)

# 过滤器配置顺序

`HiddenHttpMethodFilter`(处理请求过滤器)和配置编码过滤

设置编码过滤器应该在请求过滤器前

# HttpMessageConverter

报文信息转换器, 将请求报文转换成Java对象, 把Java对象转换成请求报文

 提供了两个注解和两个类型: @RequestBody, @ResponseBody, RequestEntity, ResponseEntity

## @RequestBody

专注于获取请求体的**内容**。

```java
@Controller
public class HttpController {
    @RequestMapping("/testRequestBody")
    public String testRequsetryBody(@RequestBody String req){
        System.out.println("req = " + req);
        return "success";
    }
}
```

![image-20260103140121250](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260103140121250.png)

## RequestEntity

用于获取包含**请求头和请求体**的完整请求信息。

```java
    @RequestMapping("/testRequestEntity")
    public String testRequestEntity(RequestEntity<String> req){
        System.out.println("req = " + req);
        System.out.println("req.getHeaders() = " + req.getHeaders());
        System.out.println("req.getBody() = " + req.getBody());
        System.out.println("req.getMethod() = " + req.getMethod());
        return "success";
    }
```

![image-20260103141811066](D:\Liyalin\NodeBook\image-20260103141811066.png)

## @ResponseBody

将控制器方法的返回值，直接作为 HTTP 响应体（Response Body）发送给浏览器，而不是去解析成一个视图名称。

```java
    @RequestMapping("/testResponseBody")
    @ResponseBody
    public String testResponseBody(Employee employee) {
        String str = employee.toString();
        return str;
    }
```

![image-20260103150425357](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260103150425357.png)

和servlet方法一样:

```java
    @RequestMapping("/testResponseServlet")
    public void testResponseServlet(HttpServletResponse response, Employee employee) throws IOException {
        response.getWriter().print(employee);
    }
```

---

## 处理json

**问题:**无法写入对象:

```java
    @RequestMapping(value = "/testResponseBody")
    @ResponseBody
    public Employee testResponseBody(Employee employee) {
        return employee;
    }
```

![image-20260103152318252](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260103152318252.png)

解决: 导入`Jason` 

前提:

1. 开启`SpringMVC`注解依赖
2. 在处理器方法上使用`@ResponseBody`
3. 将java对象直接作为控制器方法的返回值返回, 会自动转换成`json`格式的字符串

```java
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.19.2</version>
</dependency
```

![image-20260103152537169](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260103152537169.png)

## @RestController

相当于`@Controller`+`@ResponseBody` 

## ResponseEntity

响应实体, 封装了整个 HTTP 响应的对象。它让你能够完全控制响应的状态码（Status Code）、响应头（Headers）和响应体（Body）

通常实现文件下载功能:

```java
@RequestMapping("/testDown")
public ResponseEntity<byte[]> testResponseEntity(HttpSession session) throws IOException {
    // 获取ServletContext对象
    ServletContext servletContext = session.getServletContext();
    // 获取服务器中文件的真实路径
    String realPath = servletContext.getRealPath("/static/img/1.jpg");
    System.out.println(realPath);
    // 创建输入流
    InputStream is = new FileInputStream(realPath);
    // 创建字节数组
    byte[] bytes = new byte[is.available()];
    // 将流读到字节数组中
    is.read(bytes);
    // 创建HttpHeaders对象设置响应头信息
    MultiValueMap<String, String> headers = new HttpHeaders();
    // 设置要下载方式以及下载文件的名字
    headers.add("Content-Disposition", "attachment;filename=1.jpg");
    // 设置响应状态码
    HttpStatus statusCode = HttpStatus.OK;
    // 创建ResponseEntity对象
    ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(bytes, headers, statusCode);
    // 关闭输入流
    is.close();
    return responseEntity;
}
```

## 文件相关

# 拦截器

## 三个方法解析

1. `preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)`

   在**控制器方法执行之前**调用，主要用于身份验证、权限检查、日志记录等。

2.  `postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)` 

   在**控制器方法执行之后，视图渲染之前**调用，主要用于修改视图数据。

3. afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)

   在**整个请求处理完成后**（包括视图渲染）调用，主要用于资源清理。

## HelloWorld

重写方法快捷键:`Ctrl`+`o`

1. **继承接口,实现方法**

   ```java
   public class First implements HandlerInterceptor {
   }
   ```

2. **xml配置文件**

![image-20260103165920960](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260103165920960.png)

`bean`:

```xml
    <mvc:interceptors>
        <bean class="com.interceptors.First"></bean>
    </mvc:interceptors>
```

`ref`:

```xml
<!-- 先定义拦截器Bean 也可以使用注解+扫描的方式: @Component-->
<bean id="loginInterceptor" class="com.example.interceptor.LoginInterceptor"/>

<!-- 再引用这个Bean注册为拦截器 -->
<mvc:interceptors>
    <ref bean="loginInterceptor"/>
</mvc:interceptors>
```

`interceptor`:

```xml
<mvc:interceptors>
    <mvc:interceptor>
        <!-- 指定要注册的拦截器（用bean或ref） -->
        <bean class="com.interceptors.First"/>
        <mvc:mapping path="/*"/> <!--/**拦截所有 -->
        <mvc:exclude-mapping path="/"/> <!--拦截所一层目录的跳转排除初始界面 -->
    </mvc:interceptor>
</mvc:interceptors>
```

3. **写上对应的方法就行**

   ```java
   public class First implements HandlerInterceptor {
       @Override
       public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
           System.out.println("-------preHandle() START--------");
           return true; // 是否放行
       }
   
       @Override
       public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
           System.out.println("--------postHandle() DOING--------");
       }
   
       @Override
       public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
           System.out.println("--------afterCompletion() END-------");
       }
   }
   ```

   ## 多个拦截器执行顺序
   
    `prehandle`按照xml文件配置的顺序执行, `postHandle`, `afterCompletion`按照反序执行
   

![image-20260103190517688](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260103190517688.png)

![image-20260103190501331](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260103190501331.png)

![image-20260103190946371](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260103190946371.png)

假设拦截器1,2,3,4,5, 其中4返回false, 执行情况:

preHandle:1,2,3,4

postHandle:都不执行

afterCompletion:3,2,1

# 异常处理器

在错误时不导向默认的错误页面 而是导向事先配置的页面

## xml

```xml
    <!--异常处理-->
    <bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
        <property name="exceptionMappings">
            <props><!--要处理的异常 视图解析器ViewResolver处理的路径-->
                <prop key="java.lang.ArithmeticException">Error</prop>
            </props>
        </property><!--展示异常 默认存储到请求域-->
        <property name="exceptionAttribute" value="ex"/>
    </bean>
```

 配置阶段：`name="exceptionAttribute"`

在 Spring 的 XML 配置中，`<property name="...">` 是一种**依赖注入**的方式。

- **`name="exceptionAttribute"`**：这行代码告诉 Spring 容器：“请调用 `SimpleMappingExceptionResolver` 这个 Bean 实例的 `setExceptionAttribute(...)` 方法。”
- **`value="ex"`**：这行代码告诉 Spring 容器：“在调用 `setExceptionAttribute` 方法时，请把字符串 `"ex"` 作为参数传进去。”

```xml
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<h1>Error</h1>
<p th:text="${ex}"></p>
</body>
</html>
```

![image-20260103200211074](C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260103200211074.png)

## 注解

```java
@ControllerAdvice //全局增强器,为所有控制器提供全局的辅助功能
public class errorTest {
    // 异常数组
    @ExceptionHandler(value = {ArithmeticException.class, NullPointerException.class})
    public String error(Exception exception, Model model) {
        /* 记录异常日志（非常重要！）。
		根据不同的异常类型，构建并返回一个统一、友好的错误响应（JSON 或错误页面）。
		设置正确的 HTTP 状态码（如 404, 400, 500）。*/
        model.addAttribute("ex", exception);
        return "Error";
    }
}
```

# 完全注解开发

### 创建初始化类, 代替web.xml

```java
public class WebInit extends AbstractAnnotationConfigDispatcherServletInitializer {
    /**
     * 获取根配置(指定spring配置类)
     * @return
     */
    @Nullable
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{SpringConfig.class};
    }

    /**
     * 设置SpringMVC的配置类
     * @return
     */
    @Nullable
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{WebConfig.class};
    }

    /**
     *DispatcherServlet映射规则,即url-pattern
     * @return
     */
    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
    /*过滤器*/
    @Nullable
    @Override
    protected Filter[] getServletFilters() {
        CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        characterEncodingFilter.setEncoding("UTF-8");
        characterEncodingFilter.setForceResponseEncoding(true);
        return new Filter[]{characterEncodingFilter};
    }
}
```

`Filter`不设置路径可以吗

当你通过重写 `getServletFilters()` 方法来注册过滤器时，Spring MVC 框架有一个默认约定：

这个过滤器会自动映射到与 `DispatcherServlet` 相同的 URL 路径上。写在xml里就必须配置路径

### 设置SpringMVC的配置类

```java
/**
 * 设置SpringMVC的配置类
 * 1、扫描组件 2、视图解析器 3、view-controller 4、default-servlet-handler
 * 5、mvc 注解驱动 6、文件上传解析器 7、异常处理 8、拦截器
 */
@Configurable // 声明配置类
@ComponentScan("com") // 扫描组件
@EnableWebMvc // 开启mvc的注解驱动
public class WebConfig implements WebMvcConfigurer {// default-servlet-handler------------------------------------------

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }
    // 拦截器------------------------------------------------------------------------------------------------------------
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        test testInterceptor = new test();
        InterceptorRegistration interceptorRegistration = registry.addInterceptor(testInterceptor);
        interceptorRegistration.addPathPatterns("/**"); // 配置拦截路径
    }
    // view-controller--------------------------------------------------------------------------------------------------
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("index");
    }
    // 异常处理(也可以直接创建一个bean)--------------------------------------------------------------------------------------
    @Override
    public void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
        SimpleMappingExceptionResolver simpleMappingExceptionResolver = new SimpleMappingExceptionResolver();
        Properties properties = new Properties();
        properties.setProperty("java.lang.ArithmeticException","index"); // 不允许使用put get方法 因为prop操作文件时只允许传入和读取String
        simpleMappingExceptionResolver.setExceptionMappings(properties);
        simpleMappingExceptionResolver.setExceptionAttribute("ex");
        resolvers.add(simpleMappingExceptionResolver);
    }

    // 文件上传解析器------------------------------------------------------------------------------------------------------
    @Bean
    public MultipartResolver multipartResolver(){
        CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
        return  commonsMultipartResolver;
    }
    // 配置生成模板解析器---------------------------------------------------------------------------------------------------
    @Bean
    public ITemplateResolver templateResolver() {
        WebApplicationContext webApplicationContext = ContextLoader.getCurrentWebApplicationContext();
        // ServletContextTemplateResolver需要一个ServletContext作为构造参数,可通过webApplicationContext 的方法获得
        ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver(webApplicationContext.getServletContext());

        templateResolver.setPrefix("/WEB-INF/templates/");
        templateResolver.setSuffix(".html");
        templateResolver.setCharacterEncoding("UTF-8");
        templateResolver.setTemplateMode(TemplateMode.HTML);
        return templateResolver;
    }

    //生成模板引擎并为模板引擎注入模板解析器
    @Bean
    public SpringTemplateEngine templateEngine(ITemplateResolver templateResolver) {
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver);
        return templateEngine;
    }

    //生成视图解析器并为解析器注入模板引擎
    @Bean
    public ViewResolver viewResolver(SpringTemplateEngine templateEngine) {
        ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
        viewResolver.setCharacterEncoding("UTF-8");
        viewResolver.setTemplateEngine(templateEngine);
        return viewResolver;
    }
}

```

# 执行流程

## 常用组件

| 组件名称                            | 开发主体            | 核心职责                                                     |
| ----------------------------------- | ------------------- | ------------------------------------------------------------ |
| **DispatcherServlet**（前端控制器） | 框架提供            | 作为 Spring MVC 的**中央调度器**，统一接收请求、分发请求至对应组件，并最终响应结果 |
| **HandlerMapping**（处理器映射器）  | 框架提供            | 基于请求的**URL、HTTP 方法**等信息，匹配并返回对应的 **Handler（处理器，即控制器方法）** 及拦截器链 |
| **Handler**（处理器）               | 开发者实现          | 业务逻辑载体，在 DispatcherServlet 调度下，**具体处理用户请求**（对应`@Controller`中的请求映射方法） |
| **HandlerAdapter**（处理器适配器）  | 框架提供            | 作为适配层，**执行 Handler**（解决不同 Handler 的参数、返回值格式差异问题） |
| **ViewResolver**（视图解析器）      | 框架提供            | 根据逻辑视图名，**解析生成具体视图对象**（如 ThymeleafView、InternalResourceView） |
| **View**（视图）                    | 框架 / 视图技术提供 | 负责**模型数据的渲染**，将业务数据以页面形式呈现给客户端     |

ViewResolver是生产者 View是产品

## DispatcherServlet 初始化过程

核心分为3个阶段：

#### 1. 基础参数绑定（HttpServletBean阶段）

- **触发点**：Servlet容器（如Tomcat）调用`init()`方法
- **核心操作**：
  解析`web.xml`/注解中的初始化参数（如`contextConfigLocation`），并绑定到`DispatcherServlet`的属性中；
  通过`initServletBean()`触发子类初始化。

#### 2. 创建Web容器（FrameworkServlet阶段）

- **核心操作**：

1. 初始化`WebApplicationContext`（Spring MVC专属子容器，通常以根容器为父）；
2. 将容器存入`ServletContext`，供后续使用；
3. 调用`onRefresh()`触发组件初始化。

#### 3. 初始化策略组件（DispatcherServlet阶段）

- **核心操作**：
  在`onRefresh()`中调用`initStrategies()`，初始化Spring MVC的核心组件：

- `HandlerMapping`（处理器映射器）
- `HandlerAdapter`（处理器适配器）
- `ViewResolver`（视图解析器）
- `HandlerExceptionResolver`（异常解析器）等。

#### 最终结果

`DispatcherServlet`完成初始化，绑定到Servlet容器，等待接收HTTP请求。

## DispatcherServlet调用组件处理请求

## doDispatch()

## 执行流程

### Spring MVC 请求处理核心流程

1. **请求捕获**

   用户请求被前端控制器`DispatcherServlet`接收。

2. **URL 解析与映射判断**

   - `DispatcherServlet`解析请求 URL，得到请求资源标识符（URI），判断是否存在对应的映射：
     - **映射不存在**：
       1. 检查是否配置了`mvc:default-servlet-handler`；
       2. 未配置：返回 404 错误；
       3. 已配置：尝试访问静态资源（JS/CSS/HTML 等），找不到仍返回 404。
     - **映射存在**：进入后续流程。

3. **获取处理器执行链**

   通过`HandlerMapping`根据 URI，获取对应的`Handler`（控制器方法）及拦截器，封装为`HandlerExecutionChain`对象返回。

4. **选择处理器适配器**

   `DispatcherServlet`根据`Handler`，匹配合适的`HandlerAdapter`（用于执行`Handler`）。

5. **执行拦截器前置方法**

   若获取到`HandlerAdapter`，执行拦截器的`preHandle()`方法。

6. **执行 Handler（控制器方法）**

   提取请求数据，填充`Handler`入参并执行，过程中 Spring 自动完成：

   - `HttpMessageConverter`：请求 / 响应数据与对象的转换（如 JSON 转对象）；
   - 数据转换：类型转换（如 String 转 Integer）；
   - 数据格式化：格式处理（如字符串转日期）；
   - 数据验证：参数有效性校验，结果存入`BindingResult`/`Error`。

7. **返回处理结果**

   `Handler`执行完成后，向`DispatcherServlet`返回`ModelAndView`对象（包含逻辑视图名 + 模型数据）。





