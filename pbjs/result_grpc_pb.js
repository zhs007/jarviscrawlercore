// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var result_pb = require('./result_pb.js');
var alimama_pb = require('./alimama_pb.js');
var steepandcheap_pb = require('./steepandcheap_pb.js');
var mountainsteals_pb = require('./mountainsteals_pb.js');
var tmall_pb = require('./tmall_pb.js');
var taobao_pb = require('./taobao_pb.js');
var manhuadb_pb = require('./manhuadb_pb.js');
var douban_pb = require('./douban_pb.js');
var jrj_pb = require('./jrj_pb.js');
var telegraph_pb = require('./telegraph_pb.js');
var oabt_pb = require('./oabt_pb.js');
var hao6v_pb = require('./hao6v_pb.js');
var publictransit_pb = require('./publictransit_pb.js');
var jd_pb = require('./jd_pb.js');
var techinasia_pb = require('./techinasia_pb.js');
var geoip_pb = require('./geoip_pb.js');
var dt_pb = require('./dt_pb.js');
var article2_pb = require('./article2_pb.js');
var p6vdy_pb = require('./p6vdy_pb.js');
var investing_pb = require('./investing_pb.js');

function serialize_jarviscrawlercore_ReplyArticle(arg) {
  if (!(arg instanceof result_pb.ReplyArticle)) {
    throw new Error('Expected argument of type jarviscrawlercore.ReplyArticle');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_ReplyArticle(buffer_arg) {
  return result_pb.ReplyArticle.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_ReplyArticles(arg) {
  if (!(arg instanceof result_pb.ReplyArticles)) {
    throw new Error('Expected argument of type jarviscrawlercore.ReplyArticles');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_ReplyArticles(buffer_arg) {
  return result_pb.ReplyArticles.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_ReplyCrawlerStream(arg) {
  if (!(arg instanceof result_pb.ReplyCrawlerStream)) {
    throw new Error('Expected argument of type jarviscrawlercore.ReplyCrawlerStream');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_ReplyCrawlerStream(buffer_arg) {
  return result_pb.ReplyCrawlerStream.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_ReplyDTData(arg) {
  if (!(arg instanceof dt_pb.ReplyDTData)) {
    throw new Error('Expected argument of type jarviscrawlercore.ReplyDTData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_ReplyDTData(buffer_arg) {
  return dt_pb.ReplyDTData.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_ReplyTranslate(arg) {
  if (!(arg instanceof result_pb.ReplyTranslate)) {
    throw new Error('Expected argument of type jarviscrawlercore.ReplyTranslate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_ReplyTranslate(buffer_arg) {
  return result_pb.ReplyTranslate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_RequestArticle(arg) {
  if (!(arg instanceof result_pb.RequestArticle)) {
    throw new Error('Expected argument of type jarviscrawlercore.RequestArticle');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_RequestArticle(buffer_arg) {
  return result_pb.RequestArticle.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_RequestArticles(arg) {
  if (!(arg instanceof result_pb.RequestArticles)) {
    throw new Error('Expected argument of type jarviscrawlercore.RequestArticles');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_RequestArticles(buffer_arg) {
  return result_pb.RequestArticles.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_RequestCrawler(arg) {
  if (!(arg instanceof result_pb.RequestCrawler)) {
    throw new Error('Expected argument of type jarviscrawlercore.RequestCrawler');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_RequestCrawler(buffer_arg) {
  return result_pb.RequestCrawler.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_RequestDTData(arg) {
  if (!(arg instanceof dt_pb.RequestDTData)) {
    throw new Error('Expected argument of type jarviscrawlercore.RequestDTData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_RequestDTData(buffer_arg) {
  return dt_pb.RequestDTData.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_RequestTranslate(arg) {
  if (!(arg instanceof result_pb.RequestTranslate)) {
    throw new Error('Expected argument of type jarviscrawlercore.RequestTranslate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_RequestTranslate(buffer_arg) {
  return result_pb.RequestTranslate.deserializeBinary(new Uint8Array(buffer_arg));
}


// JarvisCrawlerService - JarvisCrawler service
var JarvisCrawlerServiceService = exports.JarvisCrawlerServiceService = {
  // translate - translate text
translate: {
    path: '/jarviscrawlercore.JarvisCrawlerService/translate',
    requestStream: false,
    responseStream: false,
    requestType: result_pb.RequestTranslate,
    responseType: result_pb.ReplyTranslate,
    requestSerialize: serialize_jarviscrawlercore_RequestTranslate,
    requestDeserialize: deserialize_jarviscrawlercore_RequestTranslate,
    responseSerialize: serialize_jarviscrawlercore_ReplyTranslate,
    responseDeserialize: deserialize_jarviscrawlercore_ReplyTranslate,
  },
  // exportArticle - export article
exportArticle: {
    path: '/jarviscrawlercore.JarvisCrawlerService/exportArticle',
    requestStream: false,
    responseStream: true,
    requestType: result_pb.RequestArticle,
    responseType: result_pb.ReplyArticle,
    requestSerialize: serialize_jarviscrawlercore_RequestArticle,
    requestDeserialize: deserialize_jarviscrawlercore_RequestArticle,
    responseSerialize: serialize_jarviscrawlercore_ReplyArticle,
    responseDeserialize: deserialize_jarviscrawlercore_ReplyArticle,
  },
  // getArticles - get articles
getArticles: {
    path: '/jarviscrawlercore.JarvisCrawlerService/getArticles',
    requestStream: false,
    responseStream: false,
    requestType: result_pb.RequestArticles,
    responseType: result_pb.ReplyArticles,
    requestSerialize: serialize_jarviscrawlercore_RequestArticles,
    requestDeserialize: deserialize_jarviscrawlercore_RequestArticles,
    responseSerialize: serialize_jarviscrawlercore_ReplyArticles,
    responseDeserialize: deserialize_jarviscrawlercore_ReplyArticles,
  },
  // getDTData - get DT data
getDTData: {
    path: '/jarviscrawlercore.JarvisCrawlerService/getDTData',
    requestStream: false,
    responseStream: false,
    requestType: dt_pb.RequestDTData,
    responseType: dt_pb.ReplyDTData,
    requestSerialize: serialize_jarviscrawlercore_RequestDTData,
    requestDeserialize: deserialize_jarviscrawlercore_RequestDTData,
    responseSerialize: serialize_jarviscrawlercore_ReplyDTData,
    responseDeserialize: deserialize_jarviscrawlercore_ReplyDTData,
  },
  // requestCrawler - request crawler
requestCrawler: {
    path: '/jarviscrawlercore.JarvisCrawlerService/requestCrawler',
    requestStream: false,
    responseStream: true,
    requestType: result_pb.RequestCrawler,
    responseType: result_pb.ReplyCrawlerStream,
    requestSerialize: serialize_jarviscrawlercore_RequestCrawler,
    requestDeserialize: deserialize_jarviscrawlercore_RequestCrawler,
    responseSerialize: serialize_jarviscrawlercore_ReplyCrawlerStream,
    responseDeserialize: deserialize_jarviscrawlercore_ReplyCrawlerStream,
  },
};

exports.JarvisCrawlerServiceClient = grpc.makeGenericClientConstructor(JarvisCrawlerServiceService);
