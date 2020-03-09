# jarviscrawlercore

JarvisCrawlerCore 是一套分布式 爬虫服务框架 / 操作页面的机器人 。  
它可以用于构建一套数据爬取集群，也可以用于Web项目的自动化测试，或用于其它机器人操作web项目的子服务。

前期测试使用命令行，后期主要维护grpc服务模式。  

建议使用docker部署，多节点并行获取数据，目前仅有golang的一个客户端（jccclient）可以提供基本的任务分派。  
进一步的分布式抓取和任务管理，封装在Charles项目（未开源）里。  

如果需要多节点的统一运维，可以使用Jarvis。

下面的命令可以直接使用DockerHub官方源部署。  

``` sh
docker push zerrozhao/jarviscrawlercore:latest
```

需要修改配置文件，``service.yaml``，建议放在 ``cfg`` 目录下。

``` yaml
servAddr: 0.0.0.0:7051
headless: true

slowMo: 10

clientToken:
  - wzDkh9h2fhfUVuS9jZ8uVbhV3vC5AWX3
```

其中，clientToken，是用来校验权限的，可以配置多个，每次响应请求都会需要校验token，一个token可以提供给多个客户端使用。  

### node.js Client 开发

``nodejs``调用的例子，见``src/service/client2.js``。  

可以通过 npm 安装依赖，即可使用。

``` sh
npm i jarviscrawlercore --save
```

### Golang Client 开发

使用 ``jccclient`` 即可。

### 更新说明

##### v0.5

- 重构新闻功能
- 漫画下载
- 图片打包
- 支持更多的网站

##### v0.3

- 代码结构调整
- 支持移动设备网页抓取
- 支持直接attach到已存在的chrome
- 发布到dockerhub
- 支持更多的网站

##### v0.2

- 极大的提升了节点的稳定性
- 支持更多类型的网页抓取
- 支持多节点（需要配合jccclient）
- 支持更多的网站

##### v0.1

- 支持新闻抓取
- 支持grpc服务
- 支持翻译
