# Cloud组件的停更/升级/替换



# 注册中心

注册中心是微服务架构中的「**服务通讯录 / 地址簿**」，核心作用是：

- 服务提供者（如订单服务、支付服务）启动时，把自己的**IP、端口、服务名**等信息「注册」到注册中心；
- 服务消费者（如购物车服务）调用其他服务时，先从注册中心「查询」目标服务的所有可用实例地址；
- 注册中心还会实时监控服务实例的健康状态，剔除故障实例，保证消费者拿到的都是可用地址。

# cloud-provider-payment8001

> 通过网址`/payment/create` 插入数据
> 通过网址`/payment/get/{id}` 查询数据

## 建 module

创建项目

java8, 

## 改 POM

## 写 YML

## 主启动

## 业务类


# 热部署Devtools

监测代码变动后自动重启应用 / 刷新静态资源，无需手动重启项目

## Adding devtools to your project

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

## Adding plugin to your pom.xml

```xml
<!-- 构建配置节点：包含项目打包、插件等核心配置 -->
<build>
    <!-- 配置打包后的文件名（自定义，替换成你的工程名即可） -->
    <finalName>cloud-provider-payment8001</finalName>

    <!-- 插件配置列表 -->
    <plugins>
        <!-- Spring Boot 核心打包插件 -->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <!-- 关键：开启fork模式（DevTools必备）
                     作用：让Spring Boot应用在独立的JVM进程中运行，支持热重启
                     不配置此项，DevTools的自动重启功能会失效 -->
                <fork>true</fork>
                
                <!-- 开启静态资源自动添加（可选但推荐）
                     作用：修改HTML/CSS/JS等静态资源时，无需重启项目即可实时生效 -->
                <addResources>true</addResources>
            </configuration>
        </plugin>
    </plugins>
</build>

<!-- DevTools依赖配置（放在dependencies节点下） -->
<dependencies>
    <!-- Spring Boot 开发者工具：实现代码修改后自动重启、静态资源热更新 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <!-- scope=runtime：仅运行时生效，编译/打包时不参与，避免引入生产环境 -->
        <scope>runtime</scope>
        <!-- optional=true：标记为可选依赖，防止被其他模块传递依赖引入 -->
        <optional>true</optional>
    </dependency>
</dependencies>
```



## Enabling automatic build


## Update the value of


## 重启 IDEA

# cloud-consumer-order80

## 建 module

## 改 POM

## 写 YML


## 主启动


## 业务类


## 问题

> 调试后发现在运行 
> `return restTemplate.postForObject(PAYMENT_URL+"/payment/create", payment, CommonResult.class);`
> 之前都是正常的 有参数 运行之后就没有参数了

你的服务端 `create` 接口是这样写的：

```java
@PostMapping("/payment/create")
public CommonResult<Integer> create(Payment payment) { ... }
```

**问题**：参数不加 `@RequestBody`，Spring 会默认从 **URL 参数 / 表单参数** 绑定，而不是从 JSON 请求体绑定。

```java
//正确示例
@PostMapping("/payment/create")		//注意加注解
public CommonResult<Integer> create(@RequestBody Payment payment) {...}
```

> 我已经在类里添加了注解
> `@RestController @Slf4j public class PaymentController {...}`
> 为什么还要在方法里面添加啊

`@RestController` 管「返回值」，`@RequestBody` 管「入参」

| 注解              | 作用范围     | 核心功能                                                     |
| ----------------- | ------------ | ------------------------------------------------------------ |
| `@RestController` | 类级别       | 1. 等价于 `@Controller + @ResponseBody`；2. 只负责：把**方法返回值**（如 `CommonResult`）转成 JSON 响应给前端；3. 和「接收参数」完全无关。 |
| `@RequestBody`    | 方法参数级别 | 1. 只负责：告诉 Spring，从 **HTTP 请求体（Body）** 中读取 JSON/XML 数据；2. 把请求体数据绑定到当前参数（如 `Payment` 对象）；3. 和「返回值」完全无关。 |

# 工程重构

系统中有重复使用的代码(实体类), 需要单独提取出来

## 建 module


## 填充类

把重复的代码复制到类里

## 打包上传到共用本地库

先对共享模块用`clean`, 没有报错后用`install` 打包

## 改造调用类

1. 删除各自原先有的共同类

2. `pom`引入刚打包的`jar`包

   ```xml
   <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
   <dependency>
       <groupId>lyl</groupId>
       <artifactId>cloud-api-commons</artifactId>
       <version>${project.version}</version>
   </dependency>
   ```


注意引用类要重新导入包名


注意xml文件里的也要改

还有数据库连接要开启"公钥检索"

添加 `allowPublicKeyRetrieval=true` 参数


# Eureka服务注册与发现

## Eureka单节点搭建



### 单机注册

#### 建 Modle

#### 改POM

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

#### 写YML


#### 主启动


#### 测试

#### 注册服务提供者

##### 改POM

```xml
<!--eureka-client-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

##### 改YML

```yml
eureka:
  client:
    #表示是否将自己注册进EurekaServer默认为true。
    register-with-eureka: true
    #是否从EurekaServer抓取已有的注册信息，默认为true。单节点无所谓，集群必须设置为true才能配合ribbon使用负载均衡
    fetchRegistry: true
    service-url:
    # 入住地址
      defaultZone: http://localhost:7001/eureka
```

##### 主启动


##### 测试

要先启动EurekaServer


#### 注册服务消费者

##### 改POM

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

##### 改YML

##### 主启动


##### 测试


## Eureka集群搭建

参考7001搭建7002

### 修改映射文件

C:\Windows\System32\drivers\etc





### 写YML



### 测试







启动服务提供者和服务消费者, 可以看到两台注册中心都能看到:





### 将微服务发布到集群中



### 服务提供者集群构建



参考8001创建8002(注意修改配置类端口)

修改8001/8002的`Controller`



微服务名称不变, 调用时就要指定时哪个端口



服务消费端修改url



服务消费端添加负载均衡注解

> `@LoadBalanced` 是 Spring Cloud 提供的**负载均衡注解**，作用是给 `RestTemplate` 实例添加负载均衡能力，让它能根据服务名（如 `CLOUD-PAYMENT-SERVICE`）从 Eureka/Nacos 等注册中心获取服务实例列表，并按规则分发请求



测试



成功轮询查询





## 细节

### 修改主机名称



测试:



### 访问信息有IP提示



测试:



修改后:



## 服务发现 Discovery

**让服务消费者自动找到服务提供者的过程**，不用手动配置服务的 IP 和端口。

你可以把它理解成「微服务的通讯录」—— 所有服务启动后会把自己的 `IP+端口+服务名` 登记到「通讯录」（注册中心），消费者需要调用服务时，直接查「通讯录」就能找到目标服务的地址，不用记具体的 IP

### 主启动



### 业务类

```java
public class PaymentController {
    @Resource
    private PaymentService paymentService;

    @Value("${server.port}")
    private String serverPort;

    @Resource // 服务发现核心接口
    private DiscoveryClient discoveryClient;

    @GetMapping("playment/discovery")
    public Object discovery() {
        //得到服务清单列表
        List<String> services = discoveryClient.getServices();
        services.forEach(service -> log.info("....element1: " + service));
        //通过微服务名称获得其下所有微服务
        List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
        instances.forEach(instance -> log.info(instance.getServiceId() + "\t" + instance.getHost() + "\t" + instance.getPort() + "\t" + instance.getUri()));
        return this.discoveryClient;
    }
    ...
}
```

### 测试





## 自我保护



一句话：某时刻某一个微服务不可用了(心跳检测没有反应)，Eureka不会立刻清理，依旧会对该微服务的信息进行保存

属于CAP里面的AP分支



### 禁止自我保护

注册中心禁止自我保护



客户端修改发送心跳包时间, 服务端超时剔除服务





# Zookeeper

## 服务提供者

### 建Model

### POM

```xml
<!-- SpringBoot整合zookeeper客户端 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zookeeper-discovery</artifactId>
</dependency>
```



### YML

```yml
#8004表示注册到zookeeper服务器的支付服务提供者端口号
server:
  port: 8004
#服务别名----注册zookeeper到注册中心名称
spring:
  application:
    name: cloud-provider-payment
  cloud:
    zookeeper:
      connect-string: 112.124.110.1:2181
```



### 主启动类



### Controller

```java
public class PaymentController {
    @Value("${server.port}")
    private String serverPort;

    @RequestMapping(value = "/payment/zk")
    public String paymentzk() {
        return "springcloud with zookeeper: " + serverPort + "\t" + UUID.randomUUID().toString();
    }
}
```

### 注册进zookeeper





### 测试

查看 Zookeeper 服务注册是否成功





---

http://localhost:8004/payment/zk



> 注意启动类和业务类要在同一包下
>
> `PaymentController`包名是`package controller;`，但启动类包名是`com.springCloud`，这两个包**完全不在同一个层级**，Spring 默认只扫描启动类所在包（`com.springCloud`），根本扫不到`controller`包！

---



## 思考

> 服务节点是临时还是持久的





是临时的

## 服务消费者

### 建Model

### POM

### YML



### 主启动



### 业务类



```java
@RestController
@Slf4j
public class OrderZKController {
    public static final String INVOKE_URL = "http://cloud-provider-payment";
    @Resource
    private RestTemplate restTemplate;

    @GetMapping("/consumer/payment/zk")
    public String paymentInfo() {
        // （URL模板, (URL参数数组), 返回值类型）
        String result = restTemplate.getForObject(INVOKE_URL + "/payment/zk", String.class);
        return result;
    }
}
```

测试





#  Consul



中文文档: https://www.springcloud.cc/spring-cloud-consul.html

安装consul



## 微服务提供者

### 建Model

### POM

```xml
<!--SpringCloud consul-server -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-consul-discovery</artifactId>
</dependency>
<!-- SpringBoot整合Web组件 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### YML

```yml
###consul服务端口号
server:
  port: 8006

spring:
  application:
    name: consul-provider-payment
  ###consul注册中心地址
  cloud:
    consul:
      host: 112.124.110.1
      port: 8500
      discovery:
        #hostname: 127.0.0.1
        service-name: ${spring.application.name}
```

### 启动类



### 业务类



### 测试







## 服务消费者

### POM

### YML



### 主启动



### 配置Bean



### 业务类



### 测试

<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260321212024520.png" alt="image-20260321212024520" style="zoom:80%;" />



# 三个注册中心异同点



### CAP 理论详解（分布式系统核心理论）

CAP 是分布式系统设计中最基础也最核心的理论，由加州大学伯克利分校的 Eric Brewer 教授提出，后被证明为定理。它指出：**一个分布式系统不可能同时满足以下三个特性，最多只能满足其中两个**。

##### (1) C - Consistency（一致性）

- **通俗解释**：分布式系统中，所有节点在同一时间看到的数据是**完全相同的**，就像只有一个数据源。
- **举例**：你在淘宝买东西，付款后，不管刷新哪个终端（手机 / 电脑），订单状态都立刻显示 “已付款”，这就是一致性。
- **技术解读**：数据更新后，所有副本必须同步更新，更新过程中整个系统对外不可用（强一致性）；反之如果允许临时数据不一致，就是弱一致性 / 最终一致性。

##### (2) A - Availability（可用性）

- **通俗解释**：分布式系统中，只要用户发起请求（不管请求哪个节点），系统**总能在有限时间内返回结果**（成功 / 失败都算，只要有响应），不会出现 “卡死” 或 “无响应”。
- **举例**：双 11 期间淘宝服务器压力极大，但你每次点击商品都能加载出页面（哪怕数据不是最新的），这就是可用性。
- **技术解读**：节点故障时，剩余节点仍能正常提供服务，响应时间在可接受范围内。

##### (3) P - Partition tolerance（分区容错性）

- **通俗解释**：分布式系统的节点之间通过网络通信，当网络出现故障（比如断网、延迟过高），导致节点被分成多个 “分区”（彼此无法通信），系统**仍能继续运行**。
- **举例**：微信的服务器分布在不同机房，即使北京机房和上海机房的网络断了，两个机房内的用户仍能正常发消息（只是跨机房消息暂时延迟），这就是分区容错性。
- **技术解读**：网络分区是分布式系统必然会遇到的问题（网络不可靠是常态），所以**P 是分布式系统必须满足的特性**，CAP 选择本质是 “CP” 还是 “AP”。

因为网络分区（P）无法避免，所以实际设计中只有两种选择：

| 选择                    | 核心特点                                                     | 适用场景                               | 典型案例                                        |
| ----------------------- | ------------------------------------------------------------ | -------------------------------------- | ----------------------------------------------- |
| CP（一致性 + 分区容错） | 牺牲可用性，保证数据一致；网络分区时，暂停服务直到分区恢复   | 数据一致性要求极高的场景               | 银行转账、分布式数据库（MySQL 集群）、Zookeeper |
| AP（可用性 + 分区容错） | 牺牲强一致性，保证服务可用；网络分区时，允许临时数据不一致，最终同步 | 用户体验优先、允许短暂数据不一致的场景 | 电商商品展示、社交软件消息、Consul/Eureka       |

**关键提醒**：不存在 “CA” 选择！因为如果要放弃 P（分区容错），就意味着系统是单机的（没有分布式节点），也就谈不上分布式系统了。

# Ribbon 负载均衡

## 简介

Spring Cloud Ribbon 是基于 Netflix Ribbon 实现的一套**客户端**负载均衡的工具。

简单的说，Ribbon 是 Netflix 发布的开源项目，主要功能是提供**客户端的软件负载均衡算法和服务调用**。Ribbon 客户端组件提供一系列完善的配置项如连接超时，重试等。简单的说，就是在配置文件中列出 Load Balancer（简称 LB）后面所有的机器，Ribbon 会自动的帮助你基于某种规则（如简单轮询，随机连接等）去连接这些机器。我们很容易使用 Ribbon 实现自定义的负载均衡算法。







一句话: Ribbon = 负载均衡 + RestTemplate

## 架构



## POM



## RestTemplate

RestTemplate 是 Spring 框架提供的**同步 HTTP 客户端工具**，专门用于在 Java 代码中发送 HTTP 请求（GET/POST/PUT/DELETE 等），并自动处理请求 / 响应的序列化 / 反序列化（比如把 JSON 字符串转成 Java 对象）

### `getForObject `方法` /getForEntity `方法  



### `postForObject`/`postForEntity`

### GET 请求方法

### POST 请求方法

## 核心组件 IRule

### 简介

IRule：根据特定算法中从服务列表中选取一个要访问的服务



| 策略类全限定名 / 类名                     | 名称             | 策略说明                                                     |
| ----------------------------------------- | ---------------- | ------------------------------------------------------------ |
| `com.netflix.loadbalancer.RoundRobinRule` | 轮询             | 按顺序依次循环调用服务实例                                   |
| `com.netflix.loadbalancer.RandomRule`     | 随机             | 从可用服务实例中随机选择一个                                 |
| `com.netflix.loadbalancer.RetryRule`      | 重试             | 先按 `RoundRobinRule` 策略获取服务，若获取失败则在指定时间内重试，直到获取可用服务 |
| `WeightedResponseTimeRule`                | 加权响应时间     | 对 `RoundRobinRule` 的扩展，根据实例响应时间计算权重，响应越快的实例被选中概率越高 |
| `BestAvailableRule`                       | 最佳可用         | 先过滤掉因多次访问故障而处于断路器跳闸状态的服务，再选择并发量最小的实例 |
| `AvailabilityFilteringRule`               | 可用性过滤       | 先过滤掉故障实例，再选择并发连接数较小的实例                 |
| `ZoneAvoidanceRule`                       | 区域感知（默认） | Ribbon 默认规则，复合判断服务所在区域的性能和实例可用性，优先选择同区域可用实例 |

### 替换规则

官方文档明确给出了警告：
这个**自定义配置类不能放在 @ComponentScan 所扫描的当前包下以及子包下**，
否则我们自定义的这个配置类就会被所有的 Ribbon 客户端所共享，达不到特殊化定制的目的。

#### 规则类



```java
@Configuration //标记一个配置类
public class MySelfRule {
    @Bean
    public IRule myRule() {
        return new RandomRule();//定义为随机
    }
}
```

### 自启动

```java
@SpringBootApplication
@EnableEurekaClient
// 要访问 CLOUD-PAYMENT-SERVICE 服务, 规则是 MySelfRule
@RibbonClient(name = "CLOUD-PAYMENT-SERVICE", configuration = MySelfRule.class)
public class OrderMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain80.class, args);
    }
}
```

## 负载均衡算法

### 原理

**算法：第几次请求数 % 服务器集群总数量 = 实际调用服务器位置下标**

每次服务启动后从1开始计数



### 源码

### 模拟

```java
public interface LoadBalancer {
    ServiceInstance instances(List<ServiceInstance> serviceInstances);
}
```

```java
@Component
public class MyLB implements LoadBalancer {
    // 每次重启 atomicInteger 都会为0
    private AtomicInteger atomicInteger = new AtomicInteger(0);
    public final int getAndIncrement() {
        int current;
        int next;
        do {
            current = this.atomicInteger.get();
            next = current >= Integer.MAX_VALUE ? 0 : current + 1;
            //compareAndSet(current, next) = 把值从current改成next（自增）
        } while (!this.atomicInteger.compareAndSet(current, next));
        System.out.println("next = " + next);
        return next;
    }
    @Override
    public ServiceInstance instances(List<ServiceInstance> serviceInstances) {
        int index = getAndIncrement() % serviceInstances.size();
        return serviceInstances.get(index);
    }
}
```

```java
    @GetMapping(value = "/consumer/payment/lb")
    public String getPaymentLB() {
        List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
        if (instances == null || instances.size() <= 0) {
            return null;
        }
        ServiceInstance serviceInstance = loadBalancer.instances(instances);
        URI uri = serviceInstance.getUri();
        return restTemplate.getForObject(uri+"/payment/lb", String.class);
    }
```

### 测试

http://localhost/consumer/payment/lb

成功:



# OpenFeigon 服务调用2

## 简介

**1. 背景：Ribbon + RestTemplate 的痛点**

在没有 Feign 之前，我们用 `Ribbon + RestTemplate` 调用微服务：

- 每次调用都要手动拼 URL、写请求参数、处理响应转换；
- 同一个接口如果被多处调用，代码会大量重复，需要自己封装客户端类；
- 开发繁琐，容易出错，维护成本高。

**2. Feign 的核心价值：声明式调用，像写本地接口一样调远程服务**

Feign 在 `Ribbon + RestTemplate` 的基础上做了**进一步封装**：

- 你只需要**定义一个接口**，在接口上标注 `@FeignClient` 等注解；
- 不需要写任何 HTTP 请求的具体代码（拼 URL、发请求、解析 JSON）；
- Feign 会自动帮你生成实现类，完成 HTTP 请求的发送和响应处理。

> 类比：以前 DAO 接口上标 `@Mapper` 就能自动实现数据库操作，现在微服务接口上标 `@FeignClient` 就能自动实现远程服务调用。

## cloud-consumer-feign-order80



### 建Model

cloud-consumer-feign-order80

### POM

```xml
<!--openfeign-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

### YML

```yml
server:
  port: 80

eureka:
  client:
    # 禁止当前服务注册到 Eureka 注册中心
    register-with-eureka: false
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka
```

### 主启动

```java
@SpringBootApplication
/* 开启当前服务的「服务发现」能力 —— 让当前服务能连接到注册中心
   要么把自己注册进去，要么从里面拉取其他服务的地址列表*/
@EnableDiscoveryClient
// 开启 Spring 对 Feign 声明式客户端的扫描和自动配置
@EnableFeignClients
public class OrderFeignMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderFeignMain80.class, args);
    }
}
```

### 业务类

```java
@Component
@FeignClient("CLOUD-PAYMENT-SERVICE") // 会去指定的远程服务里找方法
public interface PaymentFeignService {

    @GetMapping("/payment/get/{id}")
    //Feign 接口中@PathVariable 注解必须写显式的变量名
    public CommonResult<Payment> getPaymentById(@PathVariable("id") Long id);
}
```

```java
@RestController
@Slf4j
public class OrderFeignController {
    @Resource
    private PaymentFeignService paymentFeignService;

    @GetMapping("/consumer/payment/get/{id}")
    public CommonResult<Payment> getPaymentById(@PathVariable Long id) {
        return paymentFeignService.getPaymentById(id);
    }
}
```

### 测试



## 超时控制

```yml
# 设置feign客户端超时时间(OpenFeign默认支持ribbon)
feign:
  client:
    config:
      default:
        # 读超时时间
        read-timeout: 5000
        # 连接超时时间
        connect-timeout: 5000
```

## 日志打印

`NONE`：不输出任何日志（默认）

`BASIC`：只输出最基础的请求信息

`HEADERS`：在 BASIC 基础上增加请求 / 响应头

`FULL`：输出最完整的日志（包括请求 / 响应正文）

### 配置日志Bean

```java
@Configuration
public class FeignConfig {
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
```

### YML

```yml
logging:
  level:
    # feign日志以什么级别监控哪个接口
    com.springcloud.service.PaymentFeignService: debug
```

### 测试



# Hystrix 服务降级

## 简介



Hystrix 是 Netflix 开源的**熔断器 / 容错框架**，核心作用是：**当微服务调用出现故障（超时、报错、服务不可用）时，保护你的系统不被拖垮，同时提供降级 / 熔断 / 限流等容错能力**。

可以用一个生活例子理解：

- 你去咖啡店买咖啡，咖啡机坏了（服务故障），如果所有人都排队等，队伍会越来越长（请求堆积），整个店都没法正常运作；
- Hystrix 就像咖啡店的服务员，看到咖啡机坏了，直接告诉你 “咖啡机坏了，暂时买不了”（降级返回），而不是让你一直等，这样既不耽误你时间，也避免队伍堆积导致整个系统崩溃。

##  核心功能

#### 1. 服务降级（Fallback）

- **场景**：调用的服务超时、报错、不可用，或当前服务压力过大；
- **作用**：不返回错误，而是返回一个 “友好的**兜底**结果”（比如默认值、提示语）；
- **例子**：调用支付服务超时，降级返回 “支付暂时不可用，请稍后重试”。

#### 2. 服务熔断（Circuit Breaker）

- **场景**：某个服务故障比例超过阈值（比如 50% 的请求失败）；
- **作用**：直接 **“断开”** 对该服务的调用（熔断器打开），避免持续请求失败拖垮系统；
- **恢复机制**：熔断器打开一段时间后，会尝试 “半开” 状态，放少量请求测试服务是否恢复，恢复则关闭熔断器，否则继续打开。

#### 3. 线程隔离

- **场景**：不同服务的调用用不同的线程池；
- **作用**：即使 A 服务调用失败导致线程池满了，也不会影响 B 服务的调用（避免 “一损俱损”）。

#### 4. 请求限流 (flowlimit)

- **场景**：某个服务的请求量突增；
- **作用**：**限制**每秒 / 每分钟的请求数，避免服务被压垮。

## cloud-consumer-feign-hystrix-order80

### POM

### YML

### 主启动

### 业务类

### 测试

## 服务降级

`@HystrixCommand` 是 **Netflix Hystrix** 框架的核心注解，用于标记需要被熔断 / 降级保护的方法，是实现服务容错（熔断、降级、线程隔离）的关键。

### 服务提供者

#### 主启动



#### 业务类



### 服务消费者

#### YML

```yml
feign:
  hystrix:
    enabled: true
```

#### 主启动



####  业务类



### 测试





## 代码膨胀

### `@DefaultProperties(defaultFallback = "")` 注解

这是 **Hystrix 提供的类级别全局降级配置注解**，用于统一管理当前类中所有 `@HystrixCommand` 方法的默认降级规则。



## 代码混乱

和业务逻辑混合在一起



### YML

```yml
feign:
  hystrix:
    enabled: true
```

### 主启动



`@EnableHystrix` 是 `@EnableCircuitBreaker` 的**专属简化版**（仅适配 Hystrix），两者功能等价

### 业务类





### 测试





为什么一个返回远程调用服务降级, 一个放回本地自定义服务降级, 因为远程调用时需要时间, 而已经超过等待时间(默认1秒), 直接判定为超时, 于是返回本地服务降级方法

## 服务熔断



martinfowler.com/bliki/CircuitBreaker.html

> Martin Fowler 关于 ** 断路器模式（Circuit Breaker Pattern）** 的经典文章

**流程**

`CLOSED`（正常接收请求）

→ 满足「请求量 + 错误率」阈值 → `OPEN`（熔断，拒绝所有请求）

→ 经过 `sleepWindow` 时间 → `HALF-OPEN`（尝试恢复，放行单个请求）

→ 尝试成功 → `CLOSED`（恢复正常）

→ 尝试失败 → `OPEN`（继续熔断）



### 业务类





## 流程图



**Hystrix 执行流程（中文提取）**

1. 构造 `HystrixCommand` 或 `HystrixObservableCommand` 对象
2. 执行命令
3. 响应是否已缓存？
4. 熔断器是否打开？
5. 线程池 / 队列 / 信号量是否已满？
6. 执行 `HystrixObservableCommand.construct()` 或 `HystrixCommand.run()`
7. 计算熔断器健康状态
8. 获取降级（Fallback）响应
9. 返回成功响应

## 图形监控



### POM

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
</dependency>
```

### YML



### 主启动

```java
@SpringBootApplication
@EnableHystrixDashboard //启用 Hystrix 仪表盘
@EnableCircuitBreaker // 熔断器
public class HystrixDashboardMain9001 {
    public static void main(String[] args) {
        SpringApplication.run(HystrixDashboardMain9001.class, args);
    }
```



### 被监控类



### 测试

http://localhost:9001/hystrix

<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260323161446200.png" alt="image-20260323161446200" style="zoom:80%;" />

### 监控

监控8001

#### 修改8001端口`PaymentHystrixMain8001` 



#### 填充要被监控的服务地址



#### 测试

```
http://localhost:8001/payment/circuit/31
http://localhost:8001/payment/circuit/-31
```

监控界面:







# Gateway服务网关

Gateway（网关）在微服务架构中，是**所有客户端请求的统一入口**，相当于整个系统的 “门卫” 和 “调度中心”

SpringCloud Gateway 使用的 Webflux 中的 Reactor-Netty 响应式编程



基于 Spring Framework 5, Project Reactor 和 Spring Boot 2.0 进行构建；
动态路由：能够匹配任何请求属性；
可以对路由指定 Predicate（断言）和 Filter（过滤器）；
集成 Hystrix 的断路器功能；
集成 Spring Cloud 服务发现功能；
易于编写的 Predicate（断言）和 Filter（过滤器）；
请求限流功能；
支持路径重写

## Gateway 和 Zuul 的区别



## Zuul 模型及缺点





## Gateway 模型--异步非阻塞模型



## Gateway 概念

### Route 路由

**本质**：请求转发的规则 + 目标地址

**作用**：定义 “什么样的请求，要转发到哪个微服务”

**组成**：

- 唯一 ID（标识这条路由）
- 目标 URI（要转发到的服务地址，比如 `lb://payment-service`）
- 一组断言（匹配规则）
- 一组过滤器（请求处理逻辑）

### Predicate（断言）

**本质**：请求匹配的条件判断

**作用**：判断 “当前请求是否符合这条路由的规则”，符合才会走这个路由

**常见规则**：

- 路径匹配：`Path=/payment/**`
- 请求头匹配：`Header=X-Request-Id, \d+`
- 请求方法匹配：`Method=GET`
- 时间匹配：`Before=2025-12-31T23:59:59+08:00[Asia/Shanghai]`

### Filter（过滤器）

- **本质**：对请求 / 响应的加工处理逻辑
- **作用**：在请求转发前 / 后，对请求或响应做修改、增强、校验
- **分类**：
  - **GatewayFilter**：作用于单个路由
  - **GlobalFilter**：作用于所有路由

### 三者协作流程

1. 客户端请求到达 **Gateway**
2. **Predicate** 逐一匹配：判断请求符合哪条路由规则
3. 匹配成功后，**Filter** 对请求进行加工处理
4. 最后按 **Route** 配置的目标 URI，转发到对应的微服务

## 工作流程



**请求入口**：客户端向 Spring Cloud Gateway 发起请求。

**路由匹配**：请求到达 `Gateway Handler Mapping`，根据断言（Predicate）匹配到对应的路由。

**分发处理**：匹配成功后，请求被转发到 `Gateway Web Handler`。

**过滤链执行**：Handler 会通过 过滤器链（Filter Chain） 对请求进行预处理，再转发到实际微服务执行业务逻辑，最后对响应进行后处理并返回给客户端。

过滤器分为 **pre（前置）** 和 **post（后置）** 两种类型，虚线分隔表示它们在请求生命周期的不同阶段执行

## 配置

### 建Module

cloud-gateway-gateway9527

### POM

```xml
<!--gateway-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

### YML

```yml
server:
  port: 9527

spring:
  application:
    name: cloud-gateway

eureka:
  instance:
    hostname: cloud-gateway-service
  client: #服务提供者provider注册进eureka服务列表内
    service-url:
      register-with-eureka: true
      fetch-registry: true
      defaultZone: http://eureka7001.com:7001/eureka
```

配置网关:

```yml
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      routes:
        - id: payment_routh #payment_route    #路由的ID，没有固定规则但要求唯一，建议配合服务名
          uri: http://localhost:8001          #匹配后提供服务的路由地址
          predicates:
            - Path=/payment/get/**         # 断言，路径相匹配的进行路由

        - id: payment_routh2 #payment_route    #路由的ID，没有固定规则但要求唯一，建议配合服务名
          uri: http://localhost:8001          #匹配后提供服务的路由地址
          predicates:
            - Path=/payment/lb/**         # 断言，路径相匹配的进行路由
```

### 测试

添加网关前

http://localhost:8001/payment/get/31



添加网关后

http://localhost:9527/payment/get/31



## 网关配置的两种方法

1. 在配置文件yml中配置
2. 代码总注入`Routelocator`的`Bean` :

当访问地址http://localhost:9527/guonei时会自动转发到地址：http://news.baidu.com/guonei

```java
@Configuration
public class GetWayConfig {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder routeLocatorBuilder) {
        RouteLocatorBuilder.Builder routes = routeLocatorBuilder.routes();
        routes.route("Path_route",
                r -> r.path("/guonei")
                        .uri("http://news.baidu.com/guonei")).build();
        return routes.build();
    }
}
```



## 动态路由

路由规则不是固定写死的，而是可以根据变量（如 URL 参数、用户输入、状态等）动态生成或匹配

默认情况下，Gateway 会根据注册中心（如 Nacos、Eureka）里注册的所有微服务列表，**自动以微服务名作为请求路径前缀**，生成动态路由规则，把请求转发到对应的微服务实例上，从而实现**无需手动配置路由**的动态转发能力

---

一个 eureka7001 + 两个服务提供者 8001/8002

### YML



lb是load balance，负载均衡的意思

Spring Cloud Netflix Ribbon会在定义lb前缀的目标URI上实现负载平衡(官方文档翻译)

## 常用 Predicate (断言)

Spring Cloud Gateway 将路由匹配作为 Spring WebFlux HandlerMapping 基础架构的一部分

Spring Cloud Gateway 包括许多内置的 Route Predicate 工厂。所有这些 Predicate 都与 HTTP 请求的不同属性匹配。多个 Route Predicate 工厂可以进行组合



Spring Cloud Gateway 创建 Route 对象时，使用 RoutePredicateFactory 创建 Predicate 对象，Predicate 对象可以赋值给 Route。Spring Cloud Gateway 包含许多内置的 Route Predicate Factories

所有这些谓词都匹配 HTTP 请求的不同属性。多种谓词工厂可以组合，并通过逻辑 and

| Predicate 名称          | 匹配规则（作用）                                |
| ----------------------- | ----------------------------------------------- |
| After Route Predicate   | 匹配**指定时间之后**的请求                      |
| Before Route Predicate  | 匹配**指定时间之前**的请求                      |
| Between Route Predicate | 匹配**两个指定时间之间**的请求                  |
| Cookie Route Predicate  | 匹配请求中包含指定 Cookie 的请求                |
| Header Route Predicate  | 匹配请求中包含指定请求头的请求                  |
| Host Route Predicate    | 匹配请求中指定 Host 域名的请求                  |
| Method Route Predicate  | 匹配指定 HTTP 方法（GET/POST 等）的请求         |
| Path Route Predicate    | 匹配指定 URL 路径模式的请求（如 `/payment/**`） |
| Query Route Predicate   | 匹配请求中包含指定查询参数的请求                |





## 路由过滤器

可以在请求被路由的前或后对路由进行修改, 路由过滤器只能由指定路由使用

官方文档: https://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/2.2.1.RELEASE/reference/html/#gateway-request-predicates-factories



### 自定义过滤器

```java
@Component
@Slf4j
public class MyLogGateWayFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info(new Date() + " ......filter启动了");
        // 从请求的URL参数中获取第一个 uname 参数
        String uname = exchange.getRequest().getQueryParams().getFirst("uname");
        if (uname == null) {
            log.info("用户名为null....");
            // 设置响应状态码：406 不接受
            exchange.getResponse().setStatusCode(HttpStatus.NOT_ACCEPTABLE);
            // 直接结束响应，不继续往后走
            return exchange.getResponse().setComplete();
        }

        // 参数合法，放行，继续执行后面的过滤器/业务
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() { // 加载过滤器的优先级 数字小,优先级高
        return 0;
    }
}
```

#### 测试

http://localhost:9527/payment/lb?uname=z3



# Config Server 分布式配置中心

## 简介

**微服务架构下的配置痛点**

- 微服务会将单体应用拆分为**多个细粒度子服务**，导致系统中服务数量激增。
- 每个微服务都需要独立的配置信息才能正常运行，传统分散在各个服务本地的配置文件（如 `application.yml`）会带来**管理混乱、修改繁琐、无法动态更新**等问题。
- 因此，微服务架构必须依赖**集中式、动态化**的配置管理设施。

**Spring Cloud 的解决方案：Config Server**

- Spring Cloud 提供 **Spring Cloud Config**（Config Server）来统一管理微服务配置。
- 它将所有微服务的配置文件集中存储（通常放在 Git 仓库中），实现配置的**集中管理、版本控制、动态刷新**。
- 微服务启动时会从 Config Server 拉取对应配置，无需在每个服务中维护独立的 `application.yml`，解决了上百个配置文件的管理难题。



Spring Cloud Config 分为 **服务端** 和 **客户端** 两部分。

---

**服务端（分布式配置中心）**

- **定位**：是一个独立的微服务应用，也叫**分布式配置中心**。
- **核心职责**：
  - 连接配置存储服务器（默认 Git）
  - 为客户端提供配置获取接口
  - 提供配置信息的加密 / 解密能力
- **本质**：将存储在 Git（或其他外部源）中的配置信息，以 **RESTful API 接口** 的形式对外暴露

---

**客户端**

- **定位**：各个微服务应用本身。
- **核心职责**：
  - 指向指定的配置中心
  - 管理自身应用资源与业务配置
  - **启动时自动从配置中心获取并加载配置**

---

**配置存储特性**

- **默认存储方式**：采用 **Git** 存储配置信息。
- **优势**：
  - 天然支持**版本管理**，可追溯配置修改历史、快速回滚
  - 可通过 Git 客户端工具方便地管理、查看、修改配置内容

## POM

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-server</artifactId>
</dependency>
```


## YML

```yml
server:
  port: 3344

spring:
  application:
    name: cloud-config-center #注册进Eureka服务器的微服务名
  cloud:
    config:
      server:
        git:   # token
          uri:  https://ghp_springcloud@github.com/S-hive/springcloud-config.git
          # uri: git@github.com:S-hive/springcloud-config.git #GitHub上面的git仓库名字
          ####搜索目录
          search-paths:
            - springcloud-config

      ####读取分支
      label: main

#服务注册到eureka地址
eureka:
  client:
    service-url:
      defaultZone: http://localhost:7001/eureka
```

## 主启动

```java
@SpringBootApplication
@EnableConfigServer //分布式配置中心
public class ConfigCenterMain3344 {
    public static void main(String[] args) {
        SpringApplication.run(ConfigCenterMain3344.class, args);
    }
}
```

## window修改hosts文件, 增加映射



## 测试



## 配置读取规则 (3/5)

```
/{label}/{application}-{profile}.yml
```

- `label`：Git 分支（如 `main`/`master`）
- `application`：微服务名称（如 `config`）
- `profile`：环境标识（如 `dev`/`test`/`prod`）
- 示例：`/main/config-dev.yml` → 读取 `main` 分支下 `config-dev.yml`

```
/{application}-{profile}.yml
```

- 省略 `label`，默认读取配置文件中指定的分支

```
/{application}/{profile}[/{label}]
```

- 另一种格式，返回 JSON 格式的配置信息

## 客户端

**服务端定位**

- 也称为**分布式配置中心**，是一个**独立的微服务应用**。
- 核心职责：连接配置服务器，为客户端提供**获取配置信息、加密 / 解密信息**等接口。

**客户端作用**

- 通过指定的配置中心**管理应用资源**与业务相关配置内容。
- 应用启动时，会从配置中心**获取并加载配置信息**。

**配置存储特性**

- 配置服务器默认采用 **Git** 存储配置信息。
- 优势：支持环境配置的**版本管理**，可通过 Git 客户端工具**便捷管理与访问配置**。

---

### 配置

#### 建Model

cloud-config-client-3355

#### POM

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter</artifactId>
</dependency>
```

#### Bootstrap.yml

**配置文件级别与优先级**

- `application.yml`：**用户级**资源配置项。
- `bootstrap.yml`：**系统级**配置文件，**优先级更高**，加载顺序早于 `application.yml`。
- 关键操作：Client 模块下必须将 `application.yml` 改为 `bootstrap.yml`，否则无法正确加载外部配置。

**上下文机制**

- Spring Cloud 会创建 `Bootstrap Context`，作为 Spring 应用 `Application Context` 的**父上下文**。
- 初始化时，`Bootstrap Context` 负责从**外部源**加载并解析配置属性。
- 两个上下文共享同一个从外部获取的 `Environment`。

**Bootstrap 属性特性**

- `Bootstrap` 属性具有**高优先级**，默认情况下不会被本地配置覆盖。
- 新增 `bootstrap.yml` 的目的：保证 `Bootstrap Context` 和 `Application Context` 的配置**分离**，遵循不同的约定。

---

```yml
server:
  port: 3355

spring:
  application:
    name: config-client
  cloud:
    #Config客户端配置
    config:
      label: main #分支名称
      name: config #配置文件名称
      profile: dev #读取后缀名称
      uri: http://localhost:3344 #配置中心地址

#服务注册到eureka地址
eureka:
  client:
    service-url:
      defaultZone: http://localhost:7001/eureka
```



#### 主启动



#### 业务类



#### 测试

localhost:3355/configInfo



## 动态刷新

github上配置文件改了, 服务端数据随之改变, 客户端没有改变

### POM引入actuator监控

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### 修改YML, 暴露端口

```yml
# 暴露监控端点
management:
  endpoints:
    web:
      exposure:
        include: "*" # 暴露所有监控端点
```

### 业务类

`@RefreshScope` 是 Spring Cloud 提供的核心注解，用于实现**配置动态刷新**

标记的 Bean 会被放入**刷新作用域**，当配置中心的配置发生变化时，调用 `/actuator/refresh` 接口后，这个 Bean 会被重新初始化，加载最新的配置值。

不需要重启服务，就能让应用感知并使用最新的配置



### 测试

3355还是没有变化

需要发送Post请求刷新3355

```bash
curl -X POST http://localhost:3355/actuator/refresh
```





### 问题

修改配置后客户端和服务端都没有变化

1. Config 服务端 3344 连接 GitHub 超时了！连不上！

   * 延长 Git 超时时间
   * 改用 HTTPS 地址

   



如果有多个请求, 就需要写多条命令

# 消息总线 SpringCloud Bus

## 简介

分布式自动刷新配置功能, 一次刷新通知 → 所有服务自动同步更新！

**什么是总线**

在微服务架构的系统中，通常会使用轻量级的消息代理来构建一个共用的消息主题，并让系统中所有微服务实例都连接上来。由于该主题中产生的消息会被所有实例监听和消费，所以称它为消息总线。在总线上的各个实例，都可以方便地广播一些需要让其他连接在该主题上的实例都知道的消息。

**基本原理**

1. 修改 GitHub 配置
2. 发送 一个刷新请求
3. 请求发给 Spring Cloud Bus
4. Bus 通过 MQ 广播给所有服务
5. 所有服务自动更新配置

ConfigClient 实例都监听 MQ 中同一个 topic (默认是 springCloudBus)。当一个服务刷新数据的时候，它会把这个信息放入到 Topic 中，这样其它监听同一 Topic 的服务就能得到通知，然后去更新自身的配置

---

Rabbit Mq: http://localhost:15672

## 设计思想

**利用消息总线触发一个客户端 `/bus/refresh`，而刷新所有客户端的配置**



**利用消息总线触发一个服务端 ConfigServer 的 `/bus/refresh` 端点，而刷新所有客户端的配置**(推荐)



## 实践



### 3344-服务端

#### POM

```xml
<!-- 添加消息总线RabbitMQ支持 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

#### YML

```yml
spring:
 ## RabbitMq相关配置
  rabbitmq:
    host: localhost
    port: 5672
    username: lyl
    password: Root@321
## rabbitmq相关配置，暴露bus刷新配置的端点
management:
  endpoints: # 暴露bus刷新配置的端点
    web:
      exposure:
        include: 'bus-refresh' # 暴露bus-refresh端点，用于触发配置刷新
```

### 客户端

#### POM

```xml
<!-- 添加消息总线RabbitMQ支持 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

#### YML

```yml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    password: Root@321
    username: lyl
```

### 测试

修改GitHub配置文件

服务端3344也会立即更改:



客户端 3355, 3366 不变

向**服务端**输入更新命令

```bash
curl -X POST http://localhost:3344/actuator/bus-refresh
```

客户端 3355, 3366 更新:





---



## 定点通知

只通知某一个微服务实例，不通知全部



/bus/refresh 请求不再发送到具体的服务实例上，而是发给 config server 并通过 destination 参数类指定需要更新配置的服务或实例

### 实操

> 只通知3355, 不通知3366

1. 修改GitHub配置文件

2. 命令更新3344, 指定要更新的客户端

   ```bash
   curl -X POST http://localhost:3344/actuator/bus-refresh/config-client:3355
   ```

#### 测试

客户端3355成功更新



客户端3366没有更新



---





# 消息驱动 SpringCloud Stream

微服务的「消息中间件统一适配器」

一个统一的插座，不管你插 RabbitMQ、Kafka、RocketMQ，都能用同一套代码收发消息

**一套代码，适配所有消息中间件**, 切换 MQ 只需要改配置，**不用改业务代码**

文档: https://m.wang1314.com/doc/webapp/topic/20971999.html

通过定义绑定器作为中间层，完美地实现了应用程序与消息中间件细节之间的隔离。 通过向应用程序暴露统一的Channel通道，使得应用程序不需要再考虑各种不同的消息中间件实现。

## Binder



<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260324202728089.png" alt="image-20260324202728089" style="zoom: 67%;" />

## 实操



### 生产者-8801

#### 建Moudle

cloud-stream-rabbitmq-provider8801

#### POM

```xml
<!-- stream+rabbitmq绑定器 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
</dependency>
```

#### YML

```yml
server:
  port: 8801

spring:
  application:
    name: cloud-stream-provider
  cloud:
    stream:
      binders: # 配置要绑定的rabbitmq服务信息
        defaultRabbit: # 定义的名称，用于binding整合
          type: rabbit # 消息组件类型
          environment: # 设置rabbitmq的相关环境配置
            spring:
              rabbitmq:
                host: localhost
                port: 5672
                username: guest
                password: guest
      bindings: # 服务的整合处理
        output: # 通道名称
          destination: studyExchange # 要使用的Exchange名称
          content-type: application/json # 消息类型，文本为"text/plain"
          binder: defaultRabbit # 绑定的消息服务

eureka:
  client: # 客户端注册配置
    service-url:
      defaultZone: http://localhost:7001/eureka
  instance:
    lease-renewal-interval-in-seconds: 2 # 心跳间隔（默认30秒）
    lease-expiration-duration-in-seconds: 5 # 过期时间（默认90秒）
    instance-id: send-8801.com # 列表显示的主机名
    prefer-ip-address: true # 访问路径显示IP地址
```



#### 主启动



#### 业务类

##### 发送消息接口



##### 发送消息接口实现类



##### Controller



#### 测试

http://localhost:8801/sendMessage





### 消费者-8802

#### 建Moudle

cloud-stream-rabbitmq-consumer8802

#### POM

#### YML

```yml
server:
  port: 8802

spring:
  application:
    name: cloud-stream-consumer
  cloud:
    stream:
      binders: # 配置要绑定的rabbitmq服务信息
        defaultRabbit: # 定义的名称，用于binding整合
          type: rabbit # 消息组件类型
          environment: # 设置rabbitmq的相关环境配置
            spring:
              rabbitmq:
                host: localhost
                port: 5672
                username: lyl
                password: Root@321
      bindings: # 服务的整合处理
        input: # 通道名称
          destination: studyExchange # 要使用的Exchange名称
          content-type: application/json # 消息类型，文本为"text/plain"
          binder: defaultRabbit # 绑定的消息服务

eureka:
  client: # 客户端注册配置
    service-url:
      defaultZone: http://localhost:7001/eureka
  instance:
    lease-renewal-interval-in-seconds: 2 # 心跳间隔（默认30秒）
    lease-expiration-duration-in-seconds: 5 # 过期时间（默认90秒）
    instance-id: send-8802.com # 列表显示的主机名
    prefer-ip-address: true # 访问路径显示IP地址
```

#### 主启动



#### 业务类

```java
@Component
@EnableBinding(Sink.class)
public class ReceiveMessageListenerController {
    @Value("${server.port}")
    private String serverPort;

    @StreamListener(Sink.INPUT)
    public void input(Message<String> message) {
        System.out.println("消费者1号: ----> 收到的消息: " + message.getPayload() + "\t port: " + serverPort);
    }
}
```

### 测试

http://localhost:8801/sendMessage





## 问题

**重复消费** 

8802 和8803 同时都收到消息 (消息分组)

原因: 客户端默认分组group是不同的, 组号不同, 被认为不同组, 可以消费

---

**持久化**





## 消息分组



## 持久化

分了组的服务重启后消息不会丢失, 不分组的消息丢失

没有设置分组属性的情况下，是stream自动帮你生成一个**临时队列**，服务器下线就会删除队列

分了组的重启 RabbitMQ、重启服务，队列都**不会消失**, 消息确认（ack）后，才标记为已消费, 没确认的 → 重启后**重新投递**

# 分布式请求链路跟踪 SpringCloud Sleuth

在微服务框架中，一个由客户端发起的请求在后端系统中会经过多个不同的服务节点调用来协同生产最终的请求结果，每一次请求都会形成一条复杂的分布式服务调用链路，链路中的任何一环出现高延时或错误请求都会造成请求最终的失败

Zipkin 是一款开源的分布式链路追踪（Distributed Tracing）系统，专门用来追踪一次请求在微服务之间走过的完整调用路径，方便定位哪里慢、哪里报错

## 下载安装

下载jar包

[Central Repository: io/zipkin/zipkin-server](https://repo1.maven.org/maven2/io/zipkin/zipkin-server/)



访问:

http://localhost:9411/zipkin/

## 链路调用



**Trace**：类似于树结构的 Span 集合，表示一条调用链路，存在唯一标识

**Span**：表示调用链路来源，通俗的理解 span 就是一次请求信息

## 实操

### 服务提供者

#### POM

```xml
<!--包含了sleuth+zipkin-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
</dependency>
```

#### YML



#### 业务类

```java
    @GetMapping("/payment/zipkin")
    public String paymentZipkin() {
        return "zipkin!!!";
    }
```

### 服务消费者

#### POM

```xml
<!--包含了sleuth+zipkin-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
</dependency>
```

#### YML



#### 业务类

```java
// =====================> zipkin+sleuth
@GetMapping("/consumer/payment/zipkin")
public String paymentZipkin()
{
    String result = restTemplate.getForObject("http://localhost:8001"+"/payment/zipkin/", String.class);
    return result;
}
```

测试







# SpringCloud Alibaba

git官网: https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md

## Nacos 作为服务注册

一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。
Nacos 就是注册中心 + 配置中心的组合

下载: https://github.com/alibaba/Nacos

官网: [Nacos官网| Nacos 配置中心 | Nacos 下载| Nacos 官方社区 | Nacos 官网](https://nacos.io/)

开启:

* 单机模式

  * ```bash
    startup.cmd -m standalone
    ```

* 集群模式

  * ```bash
    startup.cmd
    ```

默认账号密码都是nacos

### 服务提供者

cloudalibaba-provider-payment9001

#### POM

```xml
<!--SpringCloud alibaba nacos -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

#### YML

```yml
server:
  port: 9001

spring:
  application:
    name: nacos-payment-provider
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #配置Nacos地址

management:
  endpoints:
    web:
      exposure:
        include: '*'
```

#### 主启动



@EnableDiscoveryClient : 通用服务注册注解
@EnableEurekaClient : Eureka 专用注册注解

#### 业务类



#### 测试

http://localhost:9001/payment/nacos/1



IEDEA端口映射

<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260325142647731.png" alt="image-20260325142647731" style="zoom:67%;" />





### 服务消费者

#### POM

新版本 Nacos（2020 年后的版本）不再自带 Ribbon / LoadBalancer！

```xml
<!-- 负载均衡器（新版Nacos必须加！）-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>

<!--SpringCloud alibaba nacos -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

#### YML

```yml
server:
  port: 83

spring:
  application:
    name: nacos-order-consumer
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848

# 消费者将要去访问的微服务名称(注册成功进nacos的微服务提供者)
service-url:
  nacos-user-service: http://nacos-payment-provider
```

#### 主启动



#### 业务类



### 与其他服务中心对比



Nacos 支持 AP 和 CP 模式的切换



## Nacos 作为配置中心

Nacos 中的 dataid 的组成格式及与 SpringBoot **配置文件**的对应





### 基础配置

#### POM

```xml
<!-- nacos-config -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>

<!-- nacos-discovery -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

#### YML



```yml
# boostrap.yml
# nacos配置
server:
  port: 3377

spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
      config:
        server-addr: localhost:8848 #Nacos作为配置中心地址
        file-extension: yaml #指定yaml格式的配置

# ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
# nacos-config-client.dev-yaml
```

#### 主启动



#### 业务类

```java
@RestController
@RefreshScope // 支持Nacos的动态刷新功能。
public class ConfigClientController
{
    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/config/info")
    public String getConfigInfo() {
        return configInfo;
    }
}
```

#### 编写配置



#### 测试



自带动态刷新

### 分类配置



#### Namespace + Group + Data ID 



**Namespace（命名空间）**：

- 默认值：`public`
- 作用：用于环境隔离（如 dev/test/prod）或业务线隔离，不同 Namespace 之间的配置 / 服务完全不可见。

**Group（分组）**：

- 默认值：`DEFAULT_GROUP`
- 作用：对同 Namespace 下的配置 / 服务进行逻辑分组（如按微服务模块分组）。

**Cluster（集群）**：

- 默认值：`DEFAULT`
- 作用：对同服务下的实例进行集群划分，实现就近访问或容灾。

#### 示例

##### DataID方案

指定 spring.profile.active 和配置文件的 DataID 来使不同环境下读取不同的配置
默认空间 + 默认分组 + 新建 dev 和 test 两个 DataID
通过 spring.profile.active 属性就能进行多环境下配置文件的读取

**测试:**



##### Group方案





**测试:** 



##### namespace方案







**测试:**



## Nacos集群和持久化配置



官方文档: https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html

**默认存储问题**

默认 Nacos 使用嵌入式数据库存储，多节点部署时会存在**数据一致性问题**。

**集群存储解决方案**

采用**集中式存储**支持集群化部署，目前仅支持 **MySQL** 存储。

**三种部署模式**

- **单机模式**：用于测试和单机试用。
- **集群模式**：用于生产环境，确保高可用（重点推荐）。
- **多集群模式**：用于多数据中心场景。

**Windows 启动方式**

执行 `cmd startup.cmd` 或双击 `startup.cmd` 文件启动 Nacos。

**单机模式 MySQL 支持**

- 0.7 版本之前：单机模式使用嵌入式数据库，不便观察数据存储。
- 0.7 版本及之后：新增支持 MySQL 数据源，可通过配置切换。

## Sentinel 实现熔断与断流



安装与部署



### 示例

#### POM 

```xml
<!--SpringCloud ailibaba sentinel-datasource-nacos 后续做持久化用到-->
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
</dependency>

<!--SpringCloud ailibaba sentinel -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>

<!--openfeign-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### YML 

```yml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        #Nacos服务注册中心地址
        server-addr: localhost:8848
    sentinel:
      transport:
        #配置Sentinel dashboard地址
        dashboard: localhost:8080
        #默认8719端口，假如被占用会自动从8719开始依次+1扫描,直至找到未被占用的端口
        port: 8719

management:
  endpoints:
    web:
      exposure:
        include: '*'
```

#### 主启动 



#### 业务类FlowLimitController



测试

是懒加载机制

执行: http://localhost:8401/testA http://localhost:8401/testB





### 流控规则

流控规则是用于**限制资源访问流量、防止系统过载**的核心配置，通过**阈值类型、流控模式、流控效果**三大维度组合，实现精细化流量管控

官网: https://sentinelguard.io/zh-cn/docs/flow-control.html?f_link_type=f_linkinlinenote&flow_extra=eyJpbmxpbmVfZGlzcGxheV9wb3NpdGlvbiI6MCwiZG9jX3Bvc2l0aW9uIjowLCJkb2NfaWQiOiIyODkzMTk0YTI5MjdhMGEwLTdmZjVkNTVkYjBkZWNjMjYifQ%3D%3D

**核心配置项:** 

| 配置项                | 说明                   | 可选值 / 示例                            |
| --------------------- | ---------------------- | ---------------------------------------- |
| **resource**          | 资源名（限流对象）     | `order:create`、`user:login`             |
| **grade**             | 阈值类型（控制维度）   | 1=**QPS**（默认）、0=**线程数**          |
| **count**             | 限流阈值               | QPS=100、线程数 = 20                     |
| **strategy**          | 流控模式（控制范围）   | 0 = 直接、1 = 关联、2 = 链路             |
| **controlBehavior**   | 流控效果（控制方式）   | 0 = 快速失败、1=Warm Up、2 = 排队等待    |
| **limitApp**          | 调用来源限制           | `default`（不限）、`appA`（仅限制 appA） |
| **warmUpPeriodSec**   | 预热时长（仅 Warm Up） | 10（秒）                                 |
| **maxQueueingTimeMs** | 排队超时（仅排队等待） | 500（毫秒）                              |



#### 两大阈值类型（grade）

##### 1. QPS 限流（默认）

- **原理**：用**滑动时间窗口**统计每秒请求数，超过阈值则限流。
- **适用**：接口总调用量限制、秒杀 / 活动峰值、第三方接口配额。
- **示例**：`grade=1, count=100` → 每秒最多 100 个请求。

##### 2. 线程数限流

- **原理**：统计当前处理该资源的**并发线程数**，超过则拒绝新请求。
- **适用**：慢调用防护（DB / 慢 RPC）、资源密集型任务（报表 / 图片处理）。
- **示例**：`grade=0, count=20` → 最多 20 个线程同时处理。

#### 三种流控模式（strategy）

##### 1. 直接模式（默认）

- 只对**当前资源**自身指标做判断，达到阈值直接限流。
- 场景：通用接口限流。

##### 2. 关联模式

- 当**关联资源**达到阈值时，限流当前资源。
- 示例：`resource=pay, refResource=db-write, strategy=1` → 数据库写压力大时，限制支付接口。
- 场景：保护核心依赖、优先级资源调度。

##### 3. 链路模式

- 仅对**指定入口资源**发起的调用统计限流，不同入口独立计算。
- 示例：入口 A→服务 X 限流 100，入口 B→服务 X 限流 50。
- 场景：多入口服务、按调用路径精细化控制。

#### 三种流控效果（controlBehavior）

##### 1. 快速失败（默认）

- 超过阈值**立即拒绝**，抛出`FlowException`。
- 场景：实时性要求高、快速响应。

##### 2. Warm Up（预热 / 冷启动）

- 基于**令牌桶**，阈值从 1/3 逐步升至设定值（如 10 秒），避免冷启动过载。
- 场景：服务刚启动、缓存未预热、避免流量突增打垮系统。

##### 3. 排队等待（匀速排队）

- 按**固定间隔**放行（漏桶），请求排队等待，超时则拒绝。
- 示例：`maxQueueingTimeMs=500` → 排队超 500ms 拒绝。
- 场景：削峰填谷、消息队列、流量平滑处理。

### 降级规则

| 字段                   | 含义                                       |
| ---------------------- | ------------------------------------------ |
| **resource**           | 资源名称，即需要降级的调用目标             |
| **grade**              | 降级策略（熔断判断依据）                   |
| **count**              | 阈值（RT 阈值 ms / 比例阈值 / 异常数阈值） |
| **timeWindow**         | 熔断时长，单位 s                           |
| **slowRatioThreshold** | 慢调用比例阈值，仅慢调用策略有效           |
| **minRequestAmount**   | 统计周期内最小请求数，低于该数不触发熔断   |
| **statIntervalMs**     | 统计窗口时长，单位 ms，默认 1000           |

#### 慢调用比例（DEGRADE_GRADE_RT）

- 以**平均响应时间**或**慢调用比例**作为依据
- 当请求**平均 RT > count**，且在统计周期内请求数 ≥ minRequestAmount 时触发熔断
- 熔断期间所有请求直接降级
- 熔断时长结束后进入**半开状态**，放行少量请求试探，恢复正常则关闭熔断

#### 异常比例（DEGRADE_GRADE_EXCEPTION_RATIO）

- 统计周期内，**异常请求数 / 总请求数**的比例超过阈值（0.0~1.0）时触发熔断
- 需满足最小请求数条件才生效
- 熔断后进入 Open 状态，超时后进入 Half-Open 试探恢复

#### 异常数（DEGRADE_GRADE_EXCEPTION_COUNT）

- 统计周期内**异常请求总数**超过阈值时触发熔断
- 只要异常数达到 count 即熔断
- 同样支持熔断时长与半开恢复机制

---

### 熔断器状态机

1. **Closed（关闭）**

   正常调用，持续统计 RT、异常数 / 比例。

   

2. **Open（开启）**

   达到降级阈值 → 熔断器打开，**直接拒绝所有请求**，持续 timeWindow 时长。

   

3. **Half-Open（半开）**

   熔断时间结束后自动进入半开状态，**放行少量请求探测**：

   - 探测成功 → 熔断器恢复 Closed
   - 探测失败 → 重新切换为 Open

### 热点 Key 限流

@SentinelResource - 处理的是sentinel控制台配置的违规情况，有blockHandler方法配置的兜底处理;





**我们期望p1参数当它是某个特殊值时，它的限流值和平时不一样**

特例 - 假如当p1的值等于5时，它的阈值可以达到200



### 系统规则

Sentinel 系统自适应限流从整体维度对应用入口流量进行控制，结合应用的 Load、CPU 使用率、总体平均 RT、入口 QPS 和并发线程数等几个维度的监控指标，通过自适应的流控策略，让系统的入口流量和系统的负载达到一个平衡，让系统尽可能跑在最大吞吐量的同时保证系统整体的稳定性。[系统自适应限流 · alibaba/Sentinel Wiki](https://github.com/alibaba/Sentinel/wiki/系统自适应限流)

**从整个应用系统维度** 进行流量控制与自我保护的规则，用于**防止系统因整体负载过高而崩溃**

* Load 自适应（仅对 Linux/Unix-like 机器生效）：系统的 load1 作为启发指标，进行自适应系统保护。当系统 load1 超过设定的启发值，且系统当前的并发线程数超过估算的系统容量时才会触发系统保护（BBR 阶段）。系统容量由系统的 maxQps * minRt 估算得出。设定参考值一般是 CPU cores * 2.5。
* CPU usage（1.5.0+ 版本）：当系统 CPU 使用率超过阈值即触发系统保护（取值范围 0.0-1.0），比较灵敏。
* 平均 RT：当单台机器上所有入口流量的平均 RT 达到阈值即触发系统保护，单位是毫秒。
* 并发线程数：当单台机器上所有入口流量的并发线程数达到阈值即触发系统保护。
* 入口 QPS：当单台机器上所有入口流量的 QPS 达到阈值即触发系统保护。

### SentinelResource配置

#### 按资源名限流

```java
@RestController
public class RateLimitController {
    
    @GetMapping("/byResource")
    @SentinelResource(value = "byResource",blockHandler = "handleException")
    public CommonResult byResource() {
        return new CommonResult(200,"按资源名称限流测试OK",new Payment(2020L,"serial001"));
    }
    
    public CommonResult handleException(BlockException exception) {
        return new CommonResult(444,exception.getClass().getCanonicalName()+"\t 服务不可用");
    }
}
```



#### 通过访问的URL来限流，会返回Sentinel自带默认的限流处理信息



```java
@RestController
public class RateLimitController {
	...

    @GetMapping("/rateLimit/byUrl")
    @SentinelResource(value = "byUrl")
    public CommonResult byUrl() {
        return new CommonResult(200,"按url限流测试OK",new Payment(2020L,"serial002"));
    }
}
```

**上面兜底方案面临的问题**

1. 系统默认的，没有体现我们自己的业务要求。
2. 依照现有条件，我们自定义的处理方法又和业务代码耦合在一块，不直观。
3. 每个业务方法都添加—个兜底的，那代码膨胀加剧。
4. 全局统—的处理方法没有体现。

#### 自定义限流处理类

自定义限流处理类 - 创建CustomerBlockHandler类用于自定义限流处理逻辑

```java
public class CustomerBlockHandler {
    public static CommonResult handlerException(BlockException exception) {
        return new CommonResult(4444,"按客戶自定义,global handlerException----1");
    }
    
    public static CommonResult handlerException2(BlockException exception) {
        return new CommonResult(4444,"按客戶自定义,global handlerException----2");
    }
}
```

```java
@RestController
public class RateLimitController {
	...

    @GetMapping("/rateLimit/customerBlockHandler")
    @SentinelResource(value = "customerBlockHandler",
            blockHandlerClass = CustomerBlockHandler.class,//<-------- 自定义限流处理类
            blockHandler = "handlerException2")//<-----------
    public CommonResult customerBlockHandler() {
        return new CommonResult(200,"按客戶自定义",new Payment(2020L,"serial003"));
    }
}
```



<img src="C:\Users\Liyal\AppData\Roaming\Typora\typora-user-images\image-20260326162957902.png" alt="image-20260326162957902" style="zoom:80%;" />



> **@SentinelResource 注解** [注解支持 · alibaba/Sentinel Wiki](https://github.com/alibaba/Sentinel/wiki/注解支持#sentinelresource-注解)
>
> 注意：注解方式埋点不支持 private 方法。
>
> @SentinelResource 用于定义资源，并提供可选的异常处理和 fallback 配置项。 @SentinelResource 注解包含以下属性：
>
> value：资源名称，必需项（不能为空）
> entryType：entry 类型，可选项（默认为 EntryType.OUT）
> blockHandler / blockHandlerClass: blockHandler 对应处理 BlockException 的函数名称，可选项。blockHandler 函数访问范围需要是 public，返回类型需要与原方法相匹配，参数类型需要和原方法相匹配并且最后加一个额外的参数，类型为 BlockException。blockHandler 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 blockHandlerClass 为对应的类的 Class 对象，注意对应的函数必需为 static 函数，否则无法解析。
> fallback /fallbackClass：fallback 函数名称，可选项，用于在抛出异常的时候提供 fallback 处理逻辑。fallback 函数可以针对所有类型的异常（除了exceptionsToIgnore里面排除掉的异常类型）进行处理。fallback 函数签名和位置要求：
> 返回值类型必须与原函数返回值类型一致；
> 方法参数列表需要和原函数一致，或者可以额外多一个 Throwable 类型的参数用于接收对应的异常。
> fallback 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 fallbackClass 为对应的类的 Class 对象，注意对应的函数必需为 static 函数，否则无法解析。
> defaultFallback（since 1.6.0）：默认的 fallback 函数名称，可选项，通常用于通用的 fallback 逻辑（即可以用于很多服务或方法）。默认 fallback 函数可以针对所有类型的异常（除了exceptionsToIgnore里面排除掉的异常类型）进行处理。若同时配置了 fallback 和 defaultFallback，则只有 fallback 会生效。defaultFallback 函数签名要求：
> 返回值类型必须与原函数返回值类型一致；
> 方法参数列表需要为空，或者可以额外多一个 Throwable 类型的参数用于接收对应的异常。
> defaultFallback 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 fallbackClass 为对应的类的 Class 对象，注意对应的函数必需为 static 函数，否则无法解析。
> exceptionsToIgnore（since 1.6.0）：用于指定哪些异常被排除掉，不会计入异常统计中，也不会进入 fallback 逻辑中，而是会原样抛出。

Sentinel主要有三个核心Api：

1. SphU定义资源
2. Tracer定义统计
3. ContextUtil定义了上下文

### 服务熔断

- fallback管运行异常
- blockHandler管配置违规

若blockHandler和fallback 都进行了配置，则被限流降级而抛出BlockException时只会进入blockHandler处理逻辑。



### 持久化规则

一旦我们重启应用，sentinel规则将消失，生产环境需要将配置规则进行持久化。

将限流配置规则持久化进Nacos保存，只要刷新8401某个rest地址，sentinel控制台的流控规则就能看到，只要Nacos里面的配置不删除，针对8401上sentinel上的流控规则持续有效。

#### 实操

##### Pom

```xml
<!--SpringCloud ailibaba sentinel-datasource-nacos 后续做持久化用到-->
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
</dependency>
```

##### YML

```yml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
    sentinel:
      transport:
        dashboard: localhost:8080 #配置Sentinel dashboard地址
        port: 8719
      datasource: #<---------------------------关注点，添加Nacos数据源配置
        ds1:
          nacos:
            server-addr: localhost:8848
            dataId: cloudalibaba-sentinel-service
            groupId: DEFAULT_GROUP
            data-type: json
            rule-type: flow

management:
  endpoints:
    web:
      exposure:
        include: '*'

feign:
  sentinel:
    enabled: true # 激活Sentinel对Feign的支持

```

添加Nacos业务规则配置



```json
[{
    "resource": "/rateLimit/byUrl",
    "limitApp": "default",
    "grade": 1,
    "count": 1, 
    "strategy": 0,
    "controlBehavior": 0,
    "clusterMode": false
}]

```

resource：资源名称；
limitApp：来源应用；
grade：阈值类型，0表示线程数, 1表示QPS；
count：单机阈值；
strategy：流控模式，0表示直接，1表示关联，2表示链路；
controlBehavior：流控效果，0表示快速失败，1表示Warm Up，2表示排队等待；
clusterMode：是否集群。

## Seata处理分布式事务



Seata是一款开源的分布式事务解决方案，致力于在微服务架构下提供高性能和简易的分布式事务服务

分布式事务处理过程的一ID+三组件模型：

Transaction ID XID 全局唯一的事务ID
三组件概念

* TC (Transaction Coordinator) - 事务协调者：维护全局和分支事务的状态，驱动全局事务提交或回滚。
* TM (Transaction Manager) - 事务管理器：定义全局事务的范围：开始全局事务、提交或回滚全局事务。
* RM (Resource Manager) - 资源管理器：管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。
* 





### 注解

####  本地事务（@Transactional）

- **范围**：**单个服务、单个数据库**内的事务

- **实现**：由 Spring 的 `@Transactional` 注解或数据库原生事务（如 MySQL 的 InnoDB 事务）管理

- **特性**：

  - 满足 ACID 特性，保证单库数据一致性
  - 只作用于当前服务的本地数据库，**无法跨服务、跨库**

  

- **局限**：在微服务架构下，一旦调用多个服务，就无法保证整体数据一致（会出现部分成功、部分失败的问题）

------

####  全局事务（@GlobalTransactional）

- **范围**：**跨多个微服务、多个数据库**的分布式事务

- **实现**：由 Seata 提供的 `@GlobalTransactional` 注解管理，是 Seata 核心的分布式事务解决方案

- **特性**：

  - 协调多个分支事务（每个服务的本地事务），保证**全局一致性**：要么全部成功，要么全部回滚
  - 底层通过 Seata 的 TM（事务管理器）、RM（资源管理器）、TC（事务协调器）协同工作

  **作用**：解决微服务架构下的分布式事务问题，比如「下单扣库存」「转账」等跨服务场景

---

### 实操

