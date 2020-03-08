/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.jarviscrawlercore.Article2', null, global);
goog.exportSymbol('proto.jarviscrawlercore.Article2Mode', null, global);
goog.exportSymbol('proto.jarviscrawlercore.ArticleList2', null, global);
goog.exportSymbol('proto.jarviscrawlercore.ParagraphNode2', null, global);
goog.exportSymbol('proto.jarviscrawlercore.ReplyArticle2', null, global);
goog.exportSymbol('proto.jarviscrawlercore.RequestArticle2', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jarviscrawlercore.ParagraphNode2 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jarviscrawlercore.ParagraphNode2, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.ParagraphNode2.displayName = 'proto.jarviscrawlercore.ParagraphNode2';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jarviscrawlercore.ParagraphNode2.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.ParagraphNode2.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.ParagraphNode2} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ParagraphNode2.toObject = function(includeInstance, msg) {
  var f, obj = {
    level: jspb.Message.getFieldWithDefault(msg, 1, 0),
    img: jspb.Message.getFieldWithDefault(msg, 2, ""),
    imgurl: jspb.Message.getFieldWithDefault(msg, 3, ""),
    text: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jarviscrawlercore.ParagraphNode2}
 */
proto.jarviscrawlercore.ParagraphNode2.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.ParagraphNode2;
  return proto.jarviscrawlercore.ParagraphNode2.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.ParagraphNode2} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.ParagraphNode2}
 */
proto.jarviscrawlercore.ParagraphNode2.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setLevel(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setImg(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setImgurl(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setText(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jarviscrawlercore.ParagraphNode2.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.ParagraphNode2.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.ParagraphNode2} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ParagraphNode2.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLevel();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getImg();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getImgurl();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getText();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional int32 level = 1;
 * @return {number}
 */
proto.jarviscrawlercore.ParagraphNode2.prototype.getLevel = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.jarviscrawlercore.ParagraphNode2.prototype.setLevel = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string img = 2;
 * @return {string}
 */
proto.jarviscrawlercore.ParagraphNode2.prototype.getImg = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.ParagraphNode2.prototype.setImg = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string imgurl = 3;
 * @return {string}
 */
proto.jarviscrawlercore.ParagraphNode2.prototype.getImgurl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.ParagraphNode2.prototype.setImgurl = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string text = 4;
 * @return {string}
 */
proto.jarviscrawlercore.ParagraphNode2.prototype.getText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.ParagraphNode2.prototype.setText = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jarviscrawlercore.Article2 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jarviscrawlercore.Article2.repeatedFields_, null);
};
goog.inherits(proto.jarviscrawlercore.Article2, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.Article2.displayName = 'proto.jarviscrawlercore.Article2';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jarviscrawlercore.Article2.repeatedFields_ = [2,6,8,9];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jarviscrawlercore.Article2.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.Article2.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.Article2} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.Article2.toObject = function(includeInstance, msg) {
  var f, obj = {
    title: jspb.Message.getFieldWithDefault(msg, 1, ""),
    authorList: jspb.Message.getRepeatedField(msg, 2),
    writetime: jspb.Message.getFieldWithDefault(msg, 3, ""),
    summary: jspb.Message.getFieldWithDefault(msg, 4, ""),
    url: jspb.Message.getFieldWithDefault(msg, 5, ""),
    nodesList: jspb.Message.toObjectList(msg.getNodesList(),
    proto.jarviscrawlercore.ParagraphNode2.toObject, includeInstance),
    website: jspb.Message.getFieldWithDefault(msg, 7, ""),
    headimgsList: jspb.Message.getRepeatedField(msg, 8),
    tagsList: jspb.Message.getRepeatedField(msg, 9),
    srclink: jspb.Message.getFieldWithDefault(msg, 10, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jarviscrawlercore.Article2}
 */
proto.jarviscrawlercore.Article2.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.Article2;
  return proto.jarviscrawlercore.Article2.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.Article2} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.Article2}
 */
proto.jarviscrawlercore.Article2.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addAuthor(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setWritetime(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setSummary(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setUrl(value);
      break;
    case 6:
      var value = new proto.jarviscrawlercore.ParagraphNode2;
      reader.readMessage(value,proto.jarviscrawlercore.ParagraphNode2.deserializeBinaryFromReader);
      msg.addNodes(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setWebsite(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.addHeadimgs(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.addTags(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setSrclink(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jarviscrawlercore.Article2.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.Article2.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.Article2} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.Article2.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAuthorList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
  f = message.getWritetime();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getSummary();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getUrl();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getNodesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      6,
      f,
      proto.jarviscrawlercore.ParagraphNode2.serializeBinaryToWriter
    );
  }
  f = message.getWebsite();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getHeadimgsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      8,
      f
    );
  }
  f = message.getTagsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      9,
      f
    );
  }
  f = message.getSrclink();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
};


/**
 * optional string title = 1;
 * @return {string}
 */
proto.jarviscrawlercore.Article2.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.Article2.prototype.setTitle = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated string author = 2;
 * @return {!Array<string>}
 */
proto.jarviscrawlercore.Article2.prototype.getAuthorList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/** @param {!Array<string>} value */
proto.jarviscrawlercore.Article2.prototype.setAuthorList = function(value) {
  jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.jarviscrawlercore.Article2.prototype.addAuthor = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


proto.jarviscrawlercore.Article2.prototype.clearAuthorList = function() {
  this.setAuthorList([]);
};


/**
 * optional string writeTime = 3;
 * @return {string}
 */
proto.jarviscrawlercore.Article2.prototype.getWritetime = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.Article2.prototype.setWritetime = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string summary = 4;
 * @return {string}
 */
proto.jarviscrawlercore.Article2.prototype.getSummary = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.Article2.prototype.setSummary = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string url = 5;
 * @return {string}
 */
proto.jarviscrawlercore.Article2.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.Article2.prototype.setUrl = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * repeated ParagraphNode2 nodes = 6;
 * @return {!Array<!proto.jarviscrawlercore.ParagraphNode2>}
 */
proto.jarviscrawlercore.Article2.prototype.getNodesList = function() {
  return /** @type{!Array<!proto.jarviscrawlercore.ParagraphNode2>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jarviscrawlercore.ParagraphNode2, 6));
};


/** @param {!Array<!proto.jarviscrawlercore.ParagraphNode2>} value */
proto.jarviscrawlercore.Article2.prototype.setNodesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 6, value);
};


/**
 * @param {!proto.jarviscrawlercore.ParagraphNode2=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jarviscrawlercore.ParagraphNode2}
 */
proto.jarviscrawlercore.Article2.prototype.addNodes = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 6, opt_value, proto.jarviscrawlercore.ParagraphNode2, opt_index);
};


proto.jarviscrawlercore.Article2.prototype.clearNodesList = function() {
  this.setNodesList([]);
};


/**
 * optional string website = 7;
 * @return {string}
 */
proto.jarviscrawlercore.Article2.prototype.getWebsite = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.Article2.prototype.setWebsite = function(value) {
  jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * repeated string headimgs = 8;
 * @return {!Array<string>}
 */
proto.jarviscrawlercore.Article2.prototype.getHeadimgsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 8));
};


/** @param {!Array<string>} value */
proto.jarviscrawlercore.Article2.prototype.setHeadimgsList = function(value) {
  jspb.Message.setField(this, 8, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.jarviscrawlercore.Article2.prototype.addHeadimgs = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 8, value, opt_index);
};


proto.jarviscrawlercore.Article2.prototype.clearHeadimgsList = function() {
  this.setHeadimgsList([]);
};


/**
 * repeated string tags = 9;
 * @return {!Array<string>}
 */
proto.jarviscrawlercore.Article2.prototype.getTagsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 9));
};


/** @param {!Array<string>} value */
proto.jarviscrawlercore.Article2.prototype.setTagsList = function(value) {
  jspb.Message.setField(this, 9, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.jarviscrawlercore.Article2.prototype.addTags = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 9, value, opt_index);
};


proto.jarviscrawlercore.Article2.prototype.clearTagsList = function() {
  this.setTagsList([]);
};


/**
 * optional string srclink = 10;
 * @return {string}
 */
proto.jarviscrawlercore.Article2.prototype.getSrclink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.Article2.prototype.setSrclink = function(value) {
  jspb.Message.setProto3StringField(this, 10, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jarviscrawlercore.ArticleList2 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jarviscrawlercore.ArticleList2.repeatedFields_, null);
};
goog.inherits(proto.jarviscrawlercore.ArticleList2, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.ArticleList2.displayName = 'proto.jarviscrawlercore.ArticleList2';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jarviscrawlercore.ArticleList2.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jarviscrawlercore.ArticleList2.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.ArticleList2.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.ArticleList2} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ArticleList2.toObject = function(includeInstance, msg) {
  var f, obj = {
    articlesList: jspb.Message.toObjectList(msg.getArticlesList(),
    proto.jarviscrawlercore.Article2.toObject, includeInstance),
    website: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jarviscrawlercore.ArticleList2}
 */
proto.jarviscrawlercore.ArticleList2.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.ArticleList2;
  return proto.jarviscrawlercore.ArticleList2.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.ArticleList2} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.ArticleList2}
 */
proto.jarviscrawlercore.ArticleList2.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jarviscrawlercore.Article2;
      reader.readMessage(value,proto.jarviscrawlercore.Article2.deserializeBinaryFromReader);
      msg.addArticles(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setWebsite(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jarviscrawlercore.ArticleList2.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.ArticleList2.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.ArticleList2} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ArticleList2.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getArticlesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.jarviscrawlercore.Article2.serializeBinaryToWriter
    );
  }
  f = message.getWebsite();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * repeated Article2 articles = 1;
 * @return {!Array<!proto.jarviscrawlercore.Article2>}
 */
proto.jarviscrawlercore.ArticleList2.prototype.getArticlesList = function() {
  return /** @type{!Array<!proto.jarviscrawlercore.Article2>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jarviscrawlercore.Article2, 1));
};


/** @param {!Array<!proto.jarviscrawlercore.Article2>} value */
proto.jarviscrawlercore.ArticleList2.prototype.setArticlesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.jarviscrawlercore.Article2=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jarviscrawlercore.Article2}
 */
proto.jarviscrawlercore.ArticleList2.prototype.addArticles = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.jarviscrawlercore.Article2, opt_index);
};


proto.jarviscrawlercore.ArticleList2.prototype.clearArticlesList = function() {
  this.setArticlesList([]);
};


/**
 * optional string website = 2;
 * @return {string}
 */
proto.jarviscrawlercore.ArticleList2.prototype.getWebsite = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.ArticleList2.prototype.setWebsite = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jarviscrawlercore.RequestArticle2 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jarviscrawlercore.RequestArticle2, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.RequestArticle2.displayName = 'proto.jarviscrawlercore.RequestArticle2';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jarviscrawlercore.RequestArticle2.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.RequestArticle2.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.RequestArticle2} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.RequestArticle2.toObject = function(includeInstance, msg) {
  var f, obj = {
    mode: jspb.Message.getFieldWithDefault(msg, 1, 0),
    url: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jarviscrawlercore.RequestArticle2}
 */
proto.jarviscrawlercore.RequestArticle2.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.RequestArticle2;
  return proto.jarviscrawlercore.RequestArticle2.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.RequestArticle2} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.RequestArticle2}
 */
proto.jarviscrawlercore.RequestArticle2.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jarviscrawlercore.Article2Mode} */ (reader.readEnum());
      msg.setMode(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setUrl(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jarviscrawlercore.RequestArticle2.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.RequestArticle2.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.RequestArticle2} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.RequestArticle2.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMode();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getUrl();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Article2Mode mode = 1;
 * @return {!proto.jarviscrawlercore.Article2Mode}
 */
proto.jarviscrawlercore.RequestArticle2.prototype.getMode = function() {
  return /** @type {!proto.jarviscrawlercore.Article2Mode} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.jarviscrawlercore.Article2Mode} value */
proto.jarviscrawlercore.RequestArticle2.prototype.setMode = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string url = 2;
 * @return {string}
 */
proto.jarviscrawlercore.RequestArticle2.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.RequestArticle2.prototype.setUrl = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jarviscrawlercore.ReplyArticle2 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jarviscrawlercore.ReplyArticle2.oneofGroups_);
};
goog.inherits(proto.jarviscrawlercore.ReplyArticle2, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.ReplyArticle2.displayName = 'proto.jarviscrawlercore.ReplyArticle2';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jarviscrawlercore.ReplyArticle2.oneofGroups_ = [[100,101]];

/**
 * @enum {number}
 */
proto.jarviscrawlercore.ReplyArticle2.ReplyCase = {
  REPLY_NOT_SET: 0,
  ARTICLES: 100,
  ARTICLE: 101
};

/**
 * @return {proto.jarviscrawlercore.ReplyArticle2.ReplyCase}
 */
proto.jarviscrawlercore.ReplyArticle2.prototype.getReplyCase = function() {
  return /** @type {proto.jarviscrawlercore.ReplyArticle2.ReplyCase} */(jspb.Message.computeOneofCase(this, proto.jarviscrawlercore.ReplyArticle2.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jarviscrawlercore.ReplyArticle2.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.ReplyArticle2.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.ReplyArticle2} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ReplyArticle2.toObject = function(includeInstance, msg) {
  var f, obj = {
    mode: jspb.Message.getFieldWithDefault(msg, 1, 0),
    articles: (f = msg.getArticles()) && proto.jarviscrawlercore.ArticleList2.toObject(includeInstance, f),
    article: (f = msg.getArticle()) && proto.jarviscrawlercore.Article2.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jarviscrawlercore.ReplyArticle2}
 */
proto.jarviscrawlercore.ReplyArticle2.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.ReplyArticle2;
  return proto.jarviscrawlercore.ReplyArticle2.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.ReplyArticle2} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.ReplyArticle2}
 */
proto.jarviscrawlercore.ReplyArticle2.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jarviscrawlercore.Article2Mode} */ (reader.readEnum());
      msg.setMode(value);
      break;
    case 100:
      var value = new proto.jarviscrawlercore.ArticleList2;
      reader.readMessage(value,proto.jarviscrawlercore.ArticleList2.deserializeBinaryFromReader);
      msg.setArticles(value);
      break;
    case 101:
      var value = new proto.jarviscrawlercore.Article2;
      reader.readMessage(value,proto.jarviscrawlercore.Article2.deserializeBinaryFromReader);
      msg.setArticle(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jarviscrawlercore.ReplyArticle2.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.ReplyArticle2.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.ReplyArticle2} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ReplyArticle2.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMode();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getArticles();
  if (f != null) {
    writer.writeMessage(
      100,
      f,
      proto.jarviscrawlercore.ArticleList2.serializeBinaryToWriter
    );
  }
  f = message.getArticle();
  if (f != null) {
    writer.writeMessage(
      101,
      f,
      proto.jarviscrawlercore.Article2.serializeBinaryToWriter
    );
  }
};


/**
 * optional Article2Mode mode = 1;
 * @return {!proto.jarviscrawlercore.Article2Mode}
 */
proto.jarviscrawlercore.ReplyArticle2.prototype.getMode = function() {
  return /** @type {!proto.jarviscrawlercore.Article2Mode} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.jarviscrawlercore.Article2Mode} value */
proto.jarviscrawlercore.ReplyArticle2.prototype.setMode = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional ArticleList2 articles = 100;
 * @return {?proto.jarviscrawlercore.ArticleList2}
 */
proto.jarviscrawlercore.ReplyArticle2.prototype.getArticles = function() {
  return /** @type{?proto.jarviscrawlercore.ArticleList2} */ (
    jspb.Message.getWrapperField(this, proto.jarviscrawlercore.ArticleList2, 100));
};


/** @param {?proto.jarviscrawlercore.ArticleList2|undefined} value */
proto.jarviscrawlercore.ReplyArticle2.prototype.setArticles = function(value) {
  jspb.Message.setOneofWrapperField(this, 100, proto.jarviscrawlercore.ReplyArticle2.oneofGroups_[0], value);
};


proto.jarviscrawlercore.ReplyArticle2.prototype.clearArticles = function() {
  this.setArticles(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jarviscrawlercore.ReplyArticle2.prototype.hasArticles = function() {
  return jspb.Message.getField(this, 100) != null;
};


/**
 * optional Article2 article = 101;
 * @return {?proto.jarviscrawlercore.Article2}
 */
proto.jarviscrawlercore.ReplyArticle2.prototype.getArticle = function() {
  return /** @type{?proto.jarviscrawlercore.Article2} */ (
    jspb.Message.getWrapperField(this, proto.jarviscrawlercore.Article2, 101));
};


/** @param {?proto.jarviscrawlercore.Article2|undefined} value */
proto.jarviscrawlercore.ReplyArticle2.prototype.setArticle = function(value) {
  jspb.Message.setOneofWrapperField(this, 101, proto.jarviscrawlercore.ReplyArticle2.oneofGroups_[0], value);
};


proto.jarviscrawlercore.ReplyArticle2.prototype.clearArticle = function() {
  this.setArticle(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jarviscrawlercore.ReplyArticle2.prototype.hasArticle = function() {
  return jspb.Message.getField(this, 101) != null;
};


/**
 * @enum {number}
 */
proto.jarviscrawlercore.Article2Mode = {
  A2M_SMZDM_ARTICLES: 0,
  A2M_SMZDM_ARTICLE: 1
};

goog.object.extend(exports, proto.jarviscrawlercore);