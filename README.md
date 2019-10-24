# jarviscrawlercore

Jarvis的数据爬取模块。  
有命令行和grpc服务2种方式。  

建议使用docker部署，多节点并行获取数据，需要Charles支持。

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

其中，clientToken，是用来校验权限的，可以配置多个，响应请求是会校验token。  

### NodeJs Client 开发

``nodejs``调用的例子，见``src/service/client2.js``。  

可以通过 npm 安装依赖，即可使用。

``` sh
npm i jarviscrawlercore --save
```

### Golang Client 开发

使用 ``jccclient`` 即可。

