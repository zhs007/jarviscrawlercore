# JarvisCrawlerCore Development Log

### 2019-10-24

``node.js`` 版本更新非常频繁，大部分时候大版本升级都是向下兼容的，但``node-gyp``相关的没那么快，所以``package-lock.json``最好还是同步一下，然后 ``Dockerfile`` 里的node版本号，至少也要给到大版本，今天``dockerhub``发布就遇到问题了，一查才发现``node.js``升级到13了，按照``node.js``的规划，奇数版本属于开发版，还是用现在的LTS版比较好。  

### 2019-10-22

JD，如果 ``.activity-banner`` 的 id 是 ``J_atmosphere_banner``，可能是双十一。  
如果是 ``banner-shangou``，则是闪购。  
``$$('.activity-message')[0].innerText``是闪购的剩余时间，好像可以取到更细的值，但估计用处不大。  
``$$('.summary-price-wrap')[0].getElementsByClassName('p-price')`` 这个是闪购价格。  
``document.getElementById('page_opprice').innerText``是原始价格。
只要不是``pingou`` 和 ``banner-shangou``，估计都是正常商品。  
这时，取``#jd-price``是价格。  
这里的价格类似￥279.30，如果要转浮点数，需要特殊处理一下。  
``#page_maprice`` 这是原价。  
``.quan-item`` 这是优惠券。  
``.prom-item`` 可以取到促销信息。  
这可能有多个，每个节点下面，前面2个em，一个是类型，一个是内容。  

如果不是pingou，这样可以找到服务提供商。  

``` js
$$('#summary-service')[0].getElementsByClassName('hl_red')
```

### 2019-10-19

jd的促销活动页面，一般是这样的，https://pro.jd.com/mall/active/3nTQQZ66AGtiwwtRcikGFnT1DVjX/index.html 。  
这个页面，其实没有太多结构化数据，简单的找到 ``a`` 即可。  

如果是 ``https://item.jd.com/`` 开头的就是商品页。  
如果是 ``https://pro.jd.com/mall/active/`` 开头的就是活动页。  

mountainsteals 商品页，下面是商品类型。  

``` js
$$('.breadcrumb-itm')
```

下面是价格购买区。  

``` js
$$('#widget_product_info_viewer')
```

下面是商品名。  
商品名里有品牌。

``` js
$$('.product_name')
```

这是品牌。  

``` js
$$('.brand')
```

商品评分。  

``` js
$$('.RatingAddtlInfo')
```

当前价格。  

``` js
$$('.price-set')
```

原价

``` js
$$('.pdp-strike-extra')
```

这个是大小、颜色的选框，可能多个，也可能是大小颜色以外的。  

``` js
$$('.po-link.po-size-link')
```

这个是选项内容。  

``` js
$$('.selector-itm-box')
```

取到这个节点的class以后，可以根据class是否有 js-size-product-thumb 或 js-color-product-thumb 判断是 size 还是 color。  

``` js
$$('.selector-itm-box')[0].getElementsByClassName('po-row')[0].getElementsByClassName('product-thumb')
```

如果是size，这样可以取到size内容。

``` js
$$('.selector-itm-box')[0].getElementsByClassName('po-row')[0].getElementsByClassName('js-size-name')
```

如果是color，这样可以取到color内容。

``` js
$$('.selector-itm-box')[1].getElementsByClassName('po-row')[0].getElementsByClassName('js-color-name')
```

下面是各种评分的人数。  
这里面，``data-bv-histogram-rating-value``是星，``data-bv-histogram-rating-count``是人数。

``` js
$$('.bv-inline-histogram-ratings-bar')
```

平均明细评分，一个标题 ``$$('.bv-secondary-rating-summary-id.bv-td')``，一个评分 ``$$('.bv-secondary-rating-summary-rating')``。  
其中，如果是 Fit，则没有数字的评分。  
Fit 还要找一些例子看。

评论，``$$('.bv-content-item.bv-content-top-review.bv-content-review')`` 这样可以找到。  

作者名。  
可能会找到多个，取第一个即可。

``` js
$$('.bv-content-item.bv-content-top-review.bv-content-review')[0].getElementsByClassName('bv-author')
```

作者位置，字符串的。  

``` js
$$('.bv-content-item.bv-content-top-review.bv-content-review')[0].getElementsByClassName('bv-author-location')
```

下面是这个用户对这件商品的评分。  
children[0] 的 attributes 里，应该有 itemprop ，且该值为 ratingValue 。

``` js
$$('.bv-content-item.bv-content-top-review.bv-content-review')[0].getElementsByClassName('bv-content-rating bv-rating-ratio')[0].children[0].content
```

评价的标题。  

``` js
$$('.bv-content-item.bv-content-top-review.bv-content-review')[0].getElementsByClassName('bv-content-title')
```

评价的内容。  

``` js
$$('.bv-content-item.bv-content-top-review.bv-content-review')[0].getElementsByClassName('bv-content-summary-body-text')
```

是否推荐，找到这个节点。  
如果有 ``bv-content-data-recommend-no`` 节点，表示不推荐。  
``'bv-content-data-recommend-yes'`` 表示推荐。

``` js
$$('.bv-content-item.bv-content-top-review.bv-content-review')[3].getElementsByClassName('bv-content-data')
```

评论时间，字符串方式的。  
几年以前几个月以前这样的。  

``` js
$$('.bv-content-item.bv-content-top-review.bv-content-review')[2].getElementsByClassName('bv-content-datetime-stamp')
```

### 2019-10-18

jd的商品页面，在 https://item.jd.com/下面，一般是html页面，譬如https://item.jd.com/100006585530.html。  
商品类别，可以找这个 ``#crumb-wrap``，或者直接找这个 ``.crumb.fl.clearfix``。  

``` js
$$('.crumb.fl.clearfix')[0].getElementsByClassName('item')
```

这样的结果，里面去掉class包含sep的，也就是``.item.sep``的。  
里面品牌那里是个select，但我们只要文本，所以也可以很方便取到。  

``` js
$$('.crumb.fl.clearfix')[0].getElementsByClassName('item')[6].innerText
```

取名字。  

``` js
$$('.sku-name')[0].innerText
```

这里，如果里面有img，最好把alt取出来，做tag用。  

``` js
$$('.sku-name')[0].getElementsByTagName('img')[0].alt
```

下面是产品描述，不知道为啥叫new。  

``` js
$$('.news')[0].innerText
```

接下来是banner，这个应该是分类型的。

``` js
$$('.activity-banner')
```

类型，我估计可以通过这个id来判断。  
或者，取到下面的innerText也可以的。  

``` js
$$('.activity-type')[0].innerText
```

然后，估计不同的类型，会有不同的数据。

``` js
$$('.activity-message')[0].getElementsByClassName('item')
```

这里，如果是预售，第一个是预定量，第二个是剩余时间，时间是中文的剩余时间，要反推出结束时间来。

然后是价格，我估计要根据类型来。  
下面这个是尽量回避类型的取值了。

``` js
$$('.summary-price-wrap')[0].getElementsByClassName('summary-price')
```

商品摘要信息。  

``` js
$$('.summary.p-choose-wrap')
```

这个是售后提供者。  

``` js
$$('.summary-service')[0].getElementsByTagName('span')[0].innerText
```

这个是发货时间。  

``` js
$$('#summary-yushou-ship')[0].getElementsByClassName('dd')[0].innerText
```

这个是重量。  

``` js
$$('#summary-weight')[0].getElementsByClassName('dd')[0].innerText
```

下面是选择项，估计可能有多个，这个children里面，id会类似``choose-attr-1``这样。  

``` js
$$('#choose-attrs')[0].children
```

或者，这样  

``` js
$$('#choose-attrs')[0].getElementsByClassName('li p-choose')
```

取选项数据  

``` js
$$('#choose-attrs')[0].getElementsByClassName('li p-choose')[0].getElementsByClassName('item')
```

评论数据。  

``` js
$$('.comment-info.J-comment-info')
```

好评百分比。  

``` js
$$('.percent-con')[0].innerText
```

这里是评论的tag列表。  

``` js
$$('.percent-info')[0].getElementsByTagName('span')
```

这里是评论的统计。  

``` js
$$('.J-comments-list.comments-list.ETab')[0].getElementsByClassName('tab-main small')[0].getElementsByTagName('li')
```

其中，class为current的是总计，class为J-addComment的是追评，剩下的有class的都可以放弃掉。

``#detail``这个里面，找``li``。  
里面找 商品评价 。

``` js
$$('#detail')[0].getElementsByTagName('li')
```

### 2019-10-16

这几天一直发现Charles可能会卡，以为是Charles的问题，今天仔细查了一下，还是crawler的bug，有时候chrome还是会卡住。

最初想法是从grpc这边加超时，后来想到这样crawler这边还是可能会慢慢积累chrome进程，时间长了，内存会受不了的。

实际测了一下，这种情况下，很多是websocket的一个错误，因为现在一个请求，可能要几分钟时间才能返回，有可能是grpc底层网络问题吧，但如果这时重启jarviscrawlerserv，客户端那边能很快得到响应，原因待查。  

有个正确的判断element是否可视的接口。

``` js
/**
 * isElementVisible
 * @param {object} page - page
 * @param {object} ele - element
 * @return {bool} isvisible - is visible
 */
async function isElementVisible(page, ele) {
  const isVisibleHandle = await page.evaluateHandle((e) => {
    const style = window.getComputedStyle(e);
    return (
      style &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    );
  }, ele);
  const visible = await isVisibleHandle.jsonValue();
  const box = await ele.boxModel();
  if (visible && box) {
    return true;
  }
  return false;
}
```

### 2019-10-08

关于``puppeteer``，特别需要注意要waitFor，会有大量的element都不是马上构建好的，切记一定要waitFor以后再操作。

然后就是click，最好先hover，这时会移动滚动条，保证该element可见。  
这时可能还会有些页面级的bug，譬如分页的表单，页数为1位数甚至2位数都可见，但到3位数时，可能就会看不见，这时hover或者click都会报错，这时就只能自己特殊处理了。

### 2019-09-09

今天部署了一台国内的机器，整个流程都非常的不顺，需要加各种镜像映射才行，后来还是将dockerhub弄好了，这样就不用走build docker的流程，会好很多吧。

dockerhub非常慢，build一次要18分钟。

### 2019-08-25

前几天开始把npm提交放到github的action了，这几天测了一下，没啥问题，每次合并master时，就会自动发布到npm。

然后，基于golang的jccclient差不多也完善了。

接下来，计划会升级到v0.3，主要是彻底的插件化，现在代码越来越多，不容易维护了。  
升级到v0.3以后，还有个很重要的，就是会考虑私有插件的问题。  
现在的想法比较简单，私有插件的话，自己做个私有bin就好了。  
到v0.3，就不支持v0.1的grpc接口了。

### 2019-08-07

今天开始，npm的提交基于github上的release包了。

``` sh
npm publish https://github.com/zhs007/jarviscrawlercore/archive/v0.2.62.tar.gz
```

``puppeteer``的``networkidle2``这一组感觉也不怎么靠谱，可以自己侦听 request 和 response 来处理，这样比较容易控制一些。

``` js
  page.on('request', (req) => {
    let url = req.url();
    if (url.indexOf('data:image') == 0) {
      url = 'local:imgdata-' + hashMD5(url);
    }

    const oldreq = findReq(lstReq, url);
    if (oldreq) {
      return;
    }

    console.log('request - ', url);

    lstReq.push({
      url: url,
      st: Date.now(),
      et: -1,
      status: 0,
      buflen: 0,
    });
  });

  page.on('response', async (res) => {
    let url = res.url();
    if (url.indexOf('data:image') == 0) {
      url = 'local:imgdata-' + hashMD5(url);
    }

    console.log('response - ', url);

    const req = findReq(lstReq, url);
    if (req) {
      const buf = await res.buffer();
      req.buflen = buf.byteLength;

      req.et = Date.now();
      req.status = res.status();
    } else {
      console.log('no response', url);
    }
  });
```

还有几个简单的处理函数，在这里。

``` js
/**
 * findReq - find a request
 * @param {array} reqs - request list
 * @param {string} url - url
 * @return {object} req - request
 */
function findReq(reqs, url) {
  for (let i = 0; i < reqs.length; ++i) {
    if (reqs[i].url == url) {
      return reqs[i];
    }
  }

  return undefined;
}

/**
 * isReqFinished - is request finished?
 * @param {array} reqs - request list
 * @return {bool} isfinished - is finished
 */
function isReqFinished(reqs) {
  for (let i = 0; i < reqs.length; ++i) {
    if (reqs[i].status == 0) {
      return false;
    }
  }

  return true;
}
```

其实需要特殊考虑的主要就是多次的request请求，特殊处理一下就好。

### 2019-07-23

最近在日本，dtbkbot的测试用``service+dtclient2``。

### 2019-07-09

关于``puppeteer``，最近又有些感想：

1. 自己通过``page``来侦听``domcontentloaded``这些事件会比``page.waitFor``要稳定一些，细节更可控，官方的``waitFor``实现应该是太简单了，所以导致某些复杂逻辑下经常会卡主。
2. ``frame``的处理，我一般是等待该页面的``response``彻底完成，这个只能在``page``来处理。
3. ``frame``内部的``reCAPTCHA``是可以处理对的，基本上可以通过``page``处理对，但切记，要确定彻底加载成功，这个步骤非常重要，我一般通过``response``和``domcontentloaded``来确定彻底加载成功，然后通过clientRect计算出点击位置或hold位置。
4. ``page``的``viewport``在某些时候非常重要，如果element不可见，可能会导致后面的操作报错。
5. ``click``操作其实会移动屏幕，当然只限于有滚动条的情况，如果页面写得不好，对``viewport``有要求，``click``是可能报错的，这时只能通过改变``viewport``避免bug。
6. 安全稳定的操作，一定是逻辑严密的，不能所有事都依赖于sleep时间，而最后从逻辑层避免sleep。
7. 业务逻辑上，一定要处理所有的异常状况，一些未考虑的异常保留足够的输出，并安全退出，为下一次做准备。

```
node ./bin/jarviscrawler.js bt ./cfg/btcfg.yaml -n oabt
```

豆瓣查找  

```
node ./bin/jarviscrawler.js douban search -s "蜘蛛 侠" -d true -t movie
```

### 2019-06-23

关于爬虫，其实这次写这个项目，并不是希望把数据全拉下来（不现实也没啥必要）。  
只是想能有个更方便的查询方式而已。  
目的是自动化，不是拿到数据。

### 2019-06-22

今天新开了``0.2``的分支，主要是下面几个结构调整：

1. 命令行模式切换到具体模块内，这样 ``bin/jarviscrawler.js`` 代码结构会更清晰。
2. ``service``模式下，增加统一的请求协议，统一来处理协议过长需要``stream``的情况。

### 2019-06-21

crunchbase organization 页面的一点记录：

- ``cb-overflow-ellipsis`` 名字。
- 大栏目 ``layout-row section-header ng-star-inserted`` ，该元素的父节点才是card节点。
- 在 overview 和 IPO 分栏里， ``cb-text-color-medium field-label flex-100 flex-gt-sm-25 ng-star-inserted`` 是所有的小栏目，该节点的next是内容。
- 剩下几个表格card里，``tr.ng-star-inserted``取到行。

crunchbase login 页面的一点记录：
- ``tag``为``mat-form-field``的是输入框，search也是一个输入框。
- ``id``为``mat-input-1``是email，``mat-input-2``是密码。
- ``.cb-text-transform-upper.mat-raised-button.mat-primary``这个是登录按钮。

怎么判断``reCAPTCHA``？  
crunchbase页面会多产生一次跳转，且如果第二次跳转返回403，就会进入``reCAPTCHA``流程。  
譬如我们访问``https://www.crunchbase.com/organization/slack``，当mainframe第二次定位到这个url时，如果response的status是403的话，就是``reCAPTCHA``。  
今天实现了这个，但有个小问题，再登录时，有可能点击登录按钮再跳转页面的时候出现``reCAPTCHA``。

处理``captcha``  
通过``#px-captcha``得到区域，然后模拟鼠标操作。  
鼠标操作有问题，如果页面比较大，不能直接用mouse来操作，而应该自己发送event，因为client坐标需要写对。  
在控制台，这个指令可以查看``event``，``monitorEvents(document.body, "click");``。

### 2019-06-20

这个可以通过crunchbase查询公司情况，这个接口是查询公司的，可以根据常规的名字查到公司代码。
```
node ./bin/jarviscrawler.js crunchbase companies -c Facebook
```

这个用来查询公司明细，需要传入companycode才行。

```
node ./bin/jarviscrawler.js crunchbase company -c slack
```

crunchbase前面有个检查，暂时没有处理，有些时候需要主动点一下。

这个可以下载blob的图片。  
```
node ./bin/jarviscrawler.js playngo blobimg -g gameofgladiators
```

### 2019-06-03

```
node ./bin/jarviscrawler.js yc company
```

### 2019-05-23

今天增加了zdreview.com

```
node ./bin/jarviscrawler.js getarticle -o 123.pb https://zdreview.com -d true
```

### 2019-04-23

今天发布了一个非docker版本，这样发布，可以直接安装。

```
npm publish https://github.com/zhs007/jarviscrawlercore/archive/v0.1.41.tar.gz
```

后来处理了techinasia, iheima, smzdm。

```
node ./bin/jarviscrawler.js getarticles -o 123.pb https://www.techinasia.com

node ./bin/jarviscrawler.js getarticles -o 123.pb http://www.iheima.com -d true

node ./bin/jarviscrawler.js getarticles -o 123.pb https://post.smzdm.com -d true

node ./bin/jarviscrawler.js getarticles -o 123.pb https://news.smzdm.com -d true
```

### 2019-04-18

```
node ./bin/jarviscrawler.js dtbkbot ./cfg/dttestbot.yaml -h false -d false -m gametodaydata

node ./bin/jarviscrawler.js dtbkbot ./cfg/dttestbot.yaml -h false -d false -m gamedatareport -s 2019-04-17 -e 2019-04-17
```

### 2019-04-17

从昨天开始，我发现其实很多``evaluate``的事情，其实``$eval``和``$$eval``也都能做。

### 2019-04-15

关于``puppeteer``的几个问题：  

1. 感觉一直在wait那块有bug，我的感觉是有些时候，调用的时间点，event已经触发过了，所以就只能timeout，其实这种可以用我们zhihu的一些处理方法，就是在浏览器环境里，加标志量，在nodejs里wait那个变量就好，这样不会出问题。  
2. 还有就是前几天处理``techinasia``遇到的，那个是页面动态加载的，如果取了动态加载部分，再来设置``setContent``就会卡timeout，后来回避了这个问题，就好了。  
3. 就是可能会出现``$ is not defined``的错误，我觉得是``addScriptTag``没有等待加载完成，就返回导致的，现在可以用``attachJQuery``这个接口来加载``jquery``了，这个接口会检查是否需要加载，并等待加载完成。
4. 尽量用``waitForFunction``，这个目前看来是最不容易timeout的了，然后这个里面其实也可以改浏览器环境下的值，只是依靠返回值决定是否放开waitfor而已。
5. 今天尝试过侦听2个``framenavigated``事件，发现很容易卡住，感觉并发处理有些问题，这个对调用先后有要求，所以尽量顺序调用吧。

### 2019-04-13

今天处理了``medium``、``techcrunch``。

```
node ./bin/jarviscrawler.js exparticle https://medium.com/@sean22492249/%E5%88%A9%E7%94%A8-rasa-n-rasa-core-%E4%BE%86%E5%BB%BA%E7%AB%8B%E4%B8%AD%E6%96%87%E7%9A%84-chatbot-aa65436efa5f -o ./output/abc.pdf -m pdf -h false -i true -q true -d true

node ./bin/jarviscrawler.js exparticle https://techcrunch.com/2019/04/03/ruhnn-ipo/ -o ./output/a.pdf -m pdf -h false -i true -q true -d true

node ./bin/jarviscrawler.js exparticle https://www.techinasia.com/3-vietnamese-platforms-visited-ommerce-sites-sea -o ./output/abc.pdf -m pdf -h false -i true -q true -d true
```

### 2019-04-12

今天articles也支持了service。

### 2019-04-11

```
node ./bin/jarviscrawler.js getarticles -o 123.pb http://www.baijingapp.com

node ./bin/jarviscrawler.js getarticles -o 123.pb -q true https://36kr.com

node ./bin/jarviscrawler.js getarticles -o 123.pb https://www.geekpark.net

node ./bin/jarviscrawler.js getarticles -o 123.pb https://www.huxiu.com

node ./bin/jarviscrawler.js getarticles -o 123.pb https://www.lieyunwang.com

node ./bin/jarviscrawler.js getarticles -o 123.pb https://www.tmtpost.com

node ./bin/jarviscrawler.js getarticles -o 123.pb https://techcrunch.com
```

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