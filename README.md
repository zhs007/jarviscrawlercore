# Jarvis Crawler Core

JarvisCrawlerCore 是一套分布式 爬虫服务框架 / 页面编程机器人 。  

它可以用于构建一套数据爬取集群，也可以用于Web项目的自动化测试，或用于其它机器人操作web项目的子服务。  
它用于多个机器人项目，包括群内自动翻译机器人、新闻推送频道、动漫影视资源推送频道、后台数据监控系统、页面分析、行业数据抓取等。

我们仅在前期测试使用命令行，主要维护grpc服务模式。  

建议用docker部署，多节点并行获取数据，目前仅有golang客户端（jccclient）可以提供基本的任务分派。  

如果需要多节点的统一运维，可以使用Jarvis。

机器配置要求，建议使用linux，能装docker。  
内存2g及以上（1g内存也可以用，不要一次请求太多任务，chrome内存占用较严重，每隔一段时间重启服务会有好处，我们也有个翻译服务数月不重启的）。

### M1 Mac下安装注意事项

暂时需要用下面的指令安装。

```
npm install --target_arch=x64
```

### 安装

[这里](https://github.com/zhs007/dockerscripts/tree/master/jarviscrawlerserv) 是一个可以直接用于部署的脚本项目。

下面的命令可以直接使用DockerHub源部署。  

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

其中，clientToken，是用来校验权限的，可以配置多个，每次响应请求都会校验token，一个token可以提供给多个客户端使用。  

### node.js Client 开发

``nodejs``调用的例子，见``src/service/client2.js``。  

可以通过 npm 安装依赖，即可使用。

``` sh
npm i jarviscrawlercore --save
```

这里还有一个直接用 ``jarviscrawlercore`` 项目来打包漫画的项目，[这里](https://github.com/zhs007/getcomic) 。  

### Golang Client 开发

使用 ``jccclient`` 即可。

### 更新说明

##### v0.7

- 依赖大幅更新

##### v0.6

- 调整``protos``结构
- 配合``Charles``线上部署
- 逐步开放API服务
- 配合``jccclient``实现更高效的抓取工作
- 支持更多的网站

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
