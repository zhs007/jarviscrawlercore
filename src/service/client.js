const messages = require('../../proto/result_pb');
const services = require('../../proto/result_grpc_pb');

const grpc = require('grpc');

/**
 * startTranslate
 * @param {string} servAddr - service addr
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @param {string} text - text
 */
function startTranslate(servAddr, srclang, destlang, text) {
  const client = new services.JarvisCrawlerServiceClient(servAddr,
      grpc.credentials.createInsecure());

  const request = new messages.RequestTranslate();
  request.setText(text);
  request.setSrclang(srclang);
  request.setDestlang(destlang);

  client.translate(request, function(err, response) {
    if (err) {
      console.log('err:', err);
    }

    if (response) {
      console.log('text:', response.getText());
    }
  });
}

/**
 * startArticle
 * @param {string} servAddr - service addr
 * @param {string} url - url
 * @param {bool} attachJQuery - is attach jquery
 */
function startArticle(servAddr, url, attachJQuery) {
  const client = new services.JarvisCrawlerServiceClient(servAddr,
      grpc.credentials.createInsecure());

  const request = new messages.RequestArticle();
  request.setUrl(url);
  request.setAttachjquery(attachJQuery);

  const call = client.exportArticle(request);
  call.on('data', (msg) =>{
    const result = msg.getResult();
    if (result) {
      console.log(result.getTitle());
    } else {
      console.log(msg.getTotallength(), msg.getCurlength());
    }
  });
  call.on('end', ()=>{
    console.log('end.');
  });
  call.on('error', (err)=>{
    console.log('err', err);
  });
}

/**
 * startGetArticles
 * @param {string} servAddr - service addr
 * @param {string} url - url
 * @param {bool} jquery - jquery
 */
function startGetArticles(servAddr, url, jquery) {
  const client = new services.JarvisCrawlerServiceClient(servAddr,
      grpc.credentials.createInsecure());

  const request = new messages.RequestArticles();
  request.setUrl(url);
  request.setAttachjquery(jquery);

  client.getArticles(request, function(err, response) {
    if (err) {
      console.log('err:', err);
    }

    if (response) {
      console.log('text:', JSON.stringify(response.getArticles().toObject()));
    }
  });
}

startTranslate('127.0.0.1:7051', 'en', 'zh-CN',
    '@Peter Walker I am sure there is a problem with excel file, I need more time to check it.');

startGetArticles('127.0.0.1:7051', 'https://www.huxiu.com', true);

startArticle('127.0.0.1:7051', 'https://post.smzdm.com/p/alpzl63o/', true);
