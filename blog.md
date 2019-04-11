# JarvisCrawlerCore Development Log

### 2019-04-08

这几天把翻译的功能接入到``JarvisTeleBot``，现在双向翻译方便很多了。

这几天简单处理了一下电商网站，有几个小技巧，其实就是改本地``DOM``，怎么方便怎么来，没必要太拘泥于一些”好“的实现，浏览器都在手上了，能控制住的就控制住，省得进一步折腾。

今天开始将``exportarticle``移植到``service``里去，支持了长消息（``grpc``不允许大于4mb的消息）。

然后就是，代码量越来越大了，需要有单元测试才好，否则后面代码重构风险越来越大。  
目前想到的还是单独写单元测试，一方面可以测代码本身，另外还可以测网站是否升级，尽可能用现成的代码来做单元测试。

### 2019-04-05

切换到``grpc-tools``了，如果要重新buildproto，需要先装``grpc-tools``。

```
npm install -g grpc-tools
```

今天把服务也写好了，你可以通过

```
node ./bin/jarviscrawler.js startservice ./cfg/service.yaml
```

写了个简单的client，可以这样

```
node ./src/service/client.js
```

### 2019-04-11

```
node ./bin/jarviscrawler.js getarticles -o 123.pb http://www.baijingapp.com

node ./bin/jarviscrawler.js getarticles -o 123.pb -q true https://36kr.com

node ./bin/jarviscrawler.js getarticles -o 123.pb https://www.geekpark.net

node ./bin/jarviscrawler.js getarticles -o 123.pb https://www.huxiu.com

node ./bin/jarviscrawler.js getarticles -o 123.pb https://www.lieyunwang.com

node ./bin/jarviscrawler.js getarticles -o 123.pb https://www.tmtpost.com
```

### 2019-04-04

今天把google翻译支持了。

```
node ./bin/jarviscrawler.js googletranslate "你好 你很好,哈哈" -h true -s zh-CN -d en

node ./bin/jarviscrawler.js googletranslate "@Peter Walker I am sure there is a problem with excel file, I need more time to check it." -h true -s en -d zh-CN
```

### 2019-04-02

今天调整了``exparticle``的参数。  
取消了以前可以同时输出``protobuf``、``pdf``、``jpg``的方案，现在一次只能输出一种格式。  

```
node ./bin/jarviscrawler.js exparticle https://post.smzdm.com/p/alpzl63o/ -o ./output/abc.pdf -m pdf -h true -i true

node ./bin/jarviscrawler.js exparticle https://post.smzdm.com/p/alpzl63o/ -o ./output/abc.jpg -m jpg -h true -j 80

node ./bin/jarviscrawler.js exparticle https://post.smzdm.com/p/alpzl63o/ -o ./output/abc.pb -m pb -h true -i true

node ./bin/jarviscrawler.js exparticle https://zhuanlan.zhihu.com/p/60881398 -o ./output/abc.pdf -m pdf -h true -i true -q true

node ./bin/jarviscrawler.js exparticle https://www.zhihu.com/question/295675918/answer/600007589 -o ./output/abc.pdf -m pdf -h true -i true -q true

node ./bin/jarviscrawler.js exparticle https://36kr.com/p/5191170 -o ./output/abc.pdf -m pdf -h true -i true -q true

node ./bin/jarviscrawler.js exparticle http://www.baijingapp.com/article/22290 -o ./output/abc.pdf -m pdf -h true -i true

node ./bin/jarviscrawler.js exparticle https://www.huxiu.com/article/292563.html -o ./output/abc.pdf -m pdf -h true -i true

node ./bin/jarviscrawler.js exparticle https://www.tmtpost.com/3859873.html -o ./output/abc.pdf -pdf -h true -i true

node ./bin/jarviscrawler.js exparticle https://www.geekpark.net/news/240120 -o ./output/abc.pdf -pdf -h true -i true

node ./bin/jarviscrawler.js exparticle https://www.lieyunwang.com/archives/453240 -o ./output/abcdf -m pdf -h true -i true
```

### 2019-03-29

今天加了confluence的bot，现在可以获取更新。

```
node ./bin/jarviscrawler.js confluencebot ./cfg/confluence.yaml -h false
```

### 2019-03-28

这几天还在考虑数据存储到底是用``html``还是``markdown``，``html``的格式化现在做得差不多了，但如果最后要自己渲染的话，``markdown``其实还是有些优势的，特别是代码段这些，会方便很多。  

今天支持了smzdm，发现几个新的问题，包括当前页面请求图片可能也会出现跨域问题(#15)，和images库对图片格式支持不全(#16)。

```
node ./bin/jarviscrawler.js exparticle https://post.smzdm.com/p/alpzl63o/ -o ./output/abc.pb -p ./output/abc.pdf -f A4 -h true
```

今天还支持了知乎，解决了CSP的问题，解决了jquery加载的问题，解决了图片延迟加载的问题。

```
node ./bin/jarviscrawler.js exparticle https://zhuanlan.zhihu.com/p/59909721 -o ./output/abc. -p output/abc.pdf -f A4 -h true
```

### 2019-03-27

今天把``exparticle``重构了一版，这个版本功能基本能达到目前的需求了。  
数据没有用``json``的，而是直接用了``protobuf``，支持未压缩的文件和zip压缩文件，把图片打包进去了。

今天把baijingapp的处理完了，可以通过下面命令行使用。

```
node ./bin/jarviscrawler.js exparticle http://www.baijingapp.com/article/22156 -p ./output/abc.pdf -f A4 -h true -o ./output/abc.pb
```

今天晚上把huxiu也处理完了，huxiu的代码质量更好一些，这个可以作为后续的样板。

```
node ./bin/jarviscrawler.js exparticle https://www.huxiu.com/article/291141.html -o ./output/abc.pb -p ./output/abc.pdf -f A4 -h true
```

### 2019-03-26

关于puppeteer，留点记录。

首先，``$()``和``$eval()``是不一样的，``$()``返回一个nodejs对象，``$eval()``其实是做页面操作，而且``$eval()``里面的输出也在浏览器里面。  
还有点需要注意的，就是``$eval()``的返回值是你自己控制的，可以用来传递跨域对象。

如果需要加载页面以外的js，可以用  
``` js
// url
await page.addScriptTag({url: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/index.js'});
// local file
await page.addScriptTag({path: './browser/base64.js'});
```

运行js代码，用``page.evaluate``，这个里面是页面的js空间，类似chrome控制台操作，这个函数的返回值是你自己控制的，可以用来传递js对象。  

页面可以用``fetch``取数据，没有跨域问题。  
```
const response = await fetch(curimg[0].src);
```
返回是一个``ReadableStream``，可以转``arrayBuffer``、``json``、``text``等。

关于``chrome``和``nodejs``层变量传递问题，``ArrayBuffer``是传不过来的，可以通过``base64``以后传``string``。

### 2019-03-25

今天发现知乎的图片是延迟加载的，本来想到的是移动屏幕，等加载完就好，后来看别人提了个思路，是直接改img的css，改成直接加载就好，可以试试。

### 2019-03-20

今天把Docker部署完成了，最折腾的其实是字体问题，最后找到了Adobe的SourceHanSans，看起来效果还不错。

### 2019-03-19

这算是第3次写爬虫框架了，现在各种基础库比上次写的时候要完善很多，希望这次能做出点东西来。  

现在几乎完全基于puppeteer的，轻量级的后面如果有需要再加。

核心是插件系统。  
接下来应该还会做开放的插件管理器，就是不放代码库里的插件。