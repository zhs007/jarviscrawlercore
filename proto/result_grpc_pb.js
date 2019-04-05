// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var proto_result_pb = require('../proto/result_pb.js');

function serialize_jarviscrawlercore_ReplyTranslate(arg) {
  if (!(arg instanceof proto_result_pb.ReplyTranslate)) {
    throw new Error('Expected argument of type jarviscrawlercore.ReplyTranslate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_ReplyTranslate(buffer_arg) {
  return proto_result_pb.ReplyTranslate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jarviscrawlercore_RequestTranslate(arg) {
  if (!(arg instanceof proto_result_pb.RequestTranslate)) {
    throw new Error('Expected argument of type jarviscrawlercore.RequestTranslate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jarviscrawlercore_RequestTranslate(buffer_arg) {
  return proto_result_pb.RequestTranslate.deserializeBinary(new Uint8Array(buffer_arg));
}


// JarvisCrawlerService - JarvisCrawler service
var JarvisCrawlerServiceService = exports.JarvisCrawlerServiceService = {
  // translate - translate text
  translate: {
    path: '/jarviscrawlercore.JarvisCrawlerService/translate',
    requestStream: false,
    responseStream: false,
    requestType: proto_result_pb.RequestTranslate,
    responseType: proto_result_pb.ReplyTranslate,
    requestSerialize: serialize_jarviscrawlercore_RequestTranslate,
    requestDeserialize: deserialize_jarviscrawlercore_RequestTranslate,
    responseSerialize: serialize_jarviscrawlercore_ReplyTranslate,
    responseDeserialize: deserialize_jarviscrawlercore_ReplyTranslate,
  },
};

exports.JarvisCrawlerServiceClient = grpc.makeGenericClientConstructor(JarvisCrawlerServiceService);
