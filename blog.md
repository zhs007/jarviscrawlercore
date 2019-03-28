# JarvisCrawlerCore Development Log

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