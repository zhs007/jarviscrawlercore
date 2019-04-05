const messages = require('../../proto/result_pb');
const services = require('../../proto/result_grpc_pb');

const grpc = require('grpc');

/**
 * startClient
 * @param {string} servAddr - service addr
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @param {string} text - text
 */
function startClient(servAddr, srclang, destlang, text) {
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

startClient('127.0.01:7051', 'en', 'zh-CN',
    '@Peter Walker I am sure there is a problem with excel file, I need more time to check it.');
