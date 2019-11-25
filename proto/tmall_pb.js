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

goog.exportSymbol('proto.jarviscrawlercore.ReplyTmall', null, global);
goog.exportSymbol('proto.jarviscrawlercore.RequestTmall', null, global);
goog.exportSymbol('proto.jarviscrawlercore.TmallMode', null, global);
goog.exportSymbol('proto.jarviscrawlercore.TmallProduct', null, global);
goog.exportSymbol('proto.jarviscrawlercore.TmallReviewTag', null, global);
goog.exportSymbol('proto.jarviscrawlercore.TmallSKUInfo', null, global);

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
proto.jarviscrawlercore.TmallSKUInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jarviscrawlercore.TmallSKUInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.TmallSKUInfo.displayName = 'proto.jarviscrawlercore.TmallSKUInfo';
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
proto.jarviscrawlercore.TmallSKUInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.TmallSKUInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.TmallSKUInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.TmallSKUInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    skuid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    price: +jspb.Message.getFieldWithDefault(msg, 2, 0.0),
    title: jspb.Message.getFieldWithDefault(msg, 3, ""),
    img: jspb.Message.getFieldWithDefault(msg, 4, ""),
    stock: jspb.Message.getFieldWithDefault(msg, 5, 0)
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
 * @return {!proto.jarviscrawlercore.TmallSKUInfo}
 */
proto.jarviscrawlercore.TmallSKUInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.TmallSKUInfo;
  return proto.jarviscrawlercore.TmallSKUInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.TmallSKUInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.TmallSKUInfo}
 */
proto.jarviscrawlercore.TmallSKUInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSkuid(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPrice(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setImg(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setStock(value);
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
proto.jarviscrawlercore.TmallSKUInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.TmallSKUInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.TmallSKUInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.TmallSKUInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSkuid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPrice();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getImg();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getStock();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
};


/**
 * optional string skuid = 1;
 * @return {string}
 */
proto.jarviscrawlercore.TmallSKUInfo.prototype.getSkuid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallSKUInfo.prototype.setSkuid = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional float price = 2;
 * @return {number}
 */
proto.jarviscrawlercore.TmallSKUInfo.prototype.getPrice = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 2, 0.0));
};


/** @param {number} value */
proto.jarviscrawlercore.TmallSKUInfo.prototype.setPrice = function(value) {
  jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional string title = 3;
 * @return {string}
 */
proto.jarviscrawlercore.TmallSKUInfo.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallSKUInfo.prototype.setTitle = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string img = 4;
 * @return {string}
 */
proto.jarviscrawlercore.TmallSKUInfo.prototype.getImg = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallSKUInfo.prototype.setImg = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional int32 stock = 5;
 * @return {number}
 */
proto.jarviscrawlercore.TmallSKUInfo.prototype.getStock = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {number} value */
proto.jarviscrawlercore.TmallSKUInfo.prototype.setStock = function(value) {
  jspb.Message.setProto3IntField(this, 5, value);
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
proto.jarviscrawlercore.TmallReviewTag = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jarviscrawlercore.TmallReviewTag, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.TmallReviewTag.displayName = 'proto.jarviscrawlercore.TmallReviewTag';
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
proto.jarviscrawlercore.TmallReviewTag.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.TmallReviewTag.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.TmallReviewTag} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.TmallReviewTag.toObject = function(includeInstance, msg) {
  var f, obj = {
    tag: jspb.Message.getFieldWithDefault(msg, 1, ""),
    times: jspb.Message.getFieldWithDefault(msg, 2, 0)
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
 * @return {!proto.jarviscrawlercore.TmallReviewTag}
 */
proto.jarviscrawlercore.TmallReviewTag.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.TmallReviewTag;
  return proto.jarviscrawlercore.TmallReviewTag.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.TmallReviewTag} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.TmallReviewTag}
 */
proto.jarviscrawlercore.TmallReviewTag.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTag(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTimes(value);
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
proto.jarviscrawlercore.TmallReviewTag.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.TmallReviewTag.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.TmallReviewTag} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.TmallReviewTag.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTag();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTimes();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * optional string tag = 1;
 * @return {string}
 */
proto.jarviscrawlercore.TmallReviewTag.prototype.getTag = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallReviewTag.prototype.setTag = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int32 times = 2;
 * @return {number}
 */
proto.jarviscrawlercore.TmallReviewTag.prototype.getTimes = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.jarviscrawlercore.TmallReviewTag.prototype.setTimes = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
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
proto.jarviscrawlercore.TmallProduct = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jarviscrawlercore.TmallProduct.repeatedFields_, null);
};
goog.inherits(proto.jarviscrawlercore.TmallProduct, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.TmallProduct.displayName = 'proto.jarviscrawlercore.TmallProduct';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jarviscrawlercore.TmallProduct.repeatedFields_ = [2,10];



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
proto.jarviscrawlercore.TmallProduct.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.TmallProduct.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.TmallProduct} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.TmallProduct.toObject = function(includeInstance, msg) {
  var f, obj = {
    itemid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    skusList: jspb.Message.toObjectList(msg.getSkusList(),
    proto.jarviscrawlercore.TmallSKUInfo.toObject, includeInstance),
    brand: jspb.Message.getFieldWithDefault(msg, 3, ""),
    brandid: jspb.Message.getFieldWithDefault(msg, 4, ""),
    categoryid: jspb.Message.getFieldWithDefault(msg, 5, ""),
    title: jspb.Message.getFieldWithDefault(msg, 6, ""),
    newinfo: jspb.Message.getFieldWithDefault(msg, 7, ""),
    reviews: jspb.Message.getFieldWithDefault(msg, 8, 0),
    rating: +jspb.Message.getFieldWithDefault(msg, 9, 0.0),
    reviewtagsList: jspb.Message.toObjectList(msg.getReviewtagsList(),
    proto.jarviscrawlercore.TmallReviewTag.toObject, includeInstance),
    lastupdatedtime: jspb.Message.getFieldWithDefault(msg, 11, 0)
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
 * @return {!proto.jarviscrawlercore.TmallProduct}
 */
proto.jarviscrawlercore.TmallProduct.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.TmallProduct;
  return proto.jarviscrawlercore.TmallProduct.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.TmallProduct} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.TmallProduct}
 */
proto.jarviscrawlercore.TmallProduct.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setItemid(value);
      break;
    case 2:
      var value = new proto.jarviscrawlercore.TmallSKUInfo;
      reader.readMessage(value,proto.jarviscrawlercore.TmallSKUInfo.deserializeBinaryFromReader);
      msg.addSkus(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setBrand(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setBrandid(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setCategoryid(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setNewinfo(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setReviews(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setRating(value);
      break;
    case 10:
      var value = new proto.jarviscrawlercore.TmallReviewTag;
      reader.readMessage(value,proto.jarviscrawlercore.TmallReviewTag.deserializeBinaryFromReader);
      msg.addReviewtags(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLastupdatedtime(value);
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
proto.jarviscrawlercore.TmallProduct.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.TmallProduct.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.TmallProduct} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.TmallProduct.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getItemid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSkusList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.jarviscrawlercore.TmallSKUInfo.serializeBinaryToWriter
    );
  }
  f = message.getBrand();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getBrandid();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getCategoryid();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getNewinfo();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getReviews();
  if (f !== 0) {
    writer.writeInt32(
      8,
      f
    );
  }
  f = message.getRating();
  if (f !== 0.0) {
    writer.writeFloat(
      9,
      f
    );
  }
  f = message.getReviewtagsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      10,
      f,
      proto.jarviscrawlercore.TmallReviewTag.serializeBinaryToWriter
    );
  }
  f = message.getLastupdatedtime();
  if (f !== 0) {
    writer.writeInt64(
      11,
      f
    );
  }
};


/**
 * optional string itemID = 1;
 * @return {string}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getItemid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallProduct.prototype.setItemid = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated TmallSKUInfo skus = 2;
 * @return {!Array<!proto.jarviscrawlercore.TmallSKUInfo>}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getSkusList = function() {
  return /** @type{!Array<!proto.jarviscrawlercore.TmallSKUInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jarviscrawlercore.TmallSKUInfo, 2));
};


/** @param {!Array<!proto.jarviscrawlercore.TmallSKUInfo>} value */
proto.jarviscrawlercore.TmallProduct.prototype.setSkusList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.jarviscrawlercore.TmallSKUInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jarviscrawlercore.TmallSKUInfo}
 */
proto.jarviscrawlercore.TmallProduct.prototype.addSkus = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.jarviscrawlercore.TmallSKUInfo, opt_index);
};


proto.jarviscrawlercore.TmallProduct.prototype.clearSkusList = function() {
  this.setSkusList([]);
};


/**
 * optional string brand = 3;
 * @return {string}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getBrand = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallProduct.prototype.setBrand = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string brandID = 4;
 * @return {string}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getBrandid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallProduct.prototype.setBrandid = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string categoryID = 5;
 * @return {string}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getCategoryid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallProduct.prototype.setCategoryid = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string title = 6;
 * @return {string}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallProduct.prototype.setTitle = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string newinfo = 7;
 * @return {string}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getNewinfo = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.TmallProduct.prototype.setNewinfo = function(value) {
  jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional int32 reviews = 8;
 * @return {number}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getReviews = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/** @param {number} value */
proto.jarviscrawlercore.TmallProduct.prototype.setReviews = function(value) {
  jspb.Message.setProto3IntField(this, 8, value);
};


/**
 * optional float rating = 9;
 * @return {number}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getRating = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 9, 0.0));
};


/** @param {number} value */
proto.jarviscrawlercore.TmallProduct.prototype.setRating = function(value) {
  jspb.Message.setProto3FloatField(this, 9, value);
};


/**
 * repeated TmallReviewTag reviewTags = 10;
 * @return {!Array<!proto.jarviscrawlercore.TmallReviewTag>}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getReviewtagsList = function() {
  return /** @type{!Array<!proto.jarviscrawlercore.TmallReviewTag>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jarviscrawlercore.TmallReviewTag, 10));
};


/** @param {!Array<!proto.jarviscrawlercore.TmallReviewTag>} value */
proto.jarviscrawlercore.TmallProduct.prototype.setReviewtagsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 10, value);
};


/**
 * @param {!proto.jarviscrawlercore.TmallReviewTag=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jarviscrawlercore.TmallReviewTag}
 */
proto.jarviscrawlercore.TmallProduct.prototype.addReviewtags = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 10, opt_value, proto.jarviscrawlercore.TmallReviewTag, opt_index);
};


proto.jarviscrawlercore.TmallProduct.prototype.clearReviewtagsList = function() {
  this.setReviewtagsList([]);
};


/**
 * optional int64 lastUpdatedTime = 11;
 * @return {number}
 */
proto.jarviscrawlercore.TmallProduct.prototype.getLastupdatedtime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 11, 0));
};


/** @param {number} value */
proto.jarviscrawlercore.TmallProduct.prototype.setLastupdatedtime = function(value) {
  jspb.Message.setProto3IntField(this, 11, value);
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
proto.jarviscrawlercore.RequestTmall = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jarviscrawlercore.RequestTmall, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.RequestTmall.displayName = 'proto.jarviscrawlercore.RequestTmall';
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
proto.jarviscrawlercore.RequestTmall.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.RequestTmall.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.RequestTmall} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.RequestTmall.toObject = function(includeInstance, msg) {
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
 * @return {!proto.jarviscrawlercore.RequestTmall}
 */
proto.jarviscrawlercore.RequestTmall.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.RequestTmall;
  return proto.jarviscrawlercore.RequestTmall.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.RequestTmall} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.RequestTmall}
 */
proto.jarviscrawlercore.RequestTmall.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jarviscrawlercore.TmallMode} */ (reader.readEnum());
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
proto.jarviscrawlercore.RequestTmall.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.RequestTmall.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.RequestTmall} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.RequestTmall.serializeBinaryToWriter = function(message, writer) {
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
 * optional TmallMode mode = 1;
 * @return {!proto.jarviscrawlercore.TmallMode}
 */
proto.jarviscrawlercore.RequestTmall.prototype.getMode = function() {
  return /** @type {!proto.jarviscrawlercore.TmallMode} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.jarviscrawlercore.TmallMode} value */
proto.jarviscrawlercore.RequestTmall.prototype.setMode = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string url = 2;
 * @return {string}
 */
proto.jarviscrawlercore.RequestTmall.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.RequestTmall.prototype.setUrl = function(value) {
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
proto.jarviscrawlercore.ReplyTmall = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jarviscrawlercore.ReplyTmall.oneofGroups_);
};
goog.inherits(proto.jarviscrawlercore.ReplyTmall, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.ReplyTmall.displayName = 'proto.jarviscrawlercore.ReplyTmall';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jarviscrawlercore.ReplyTmall.oneofGroups_ = [[100]];

/**
 * @enum {number}
 */
proto.jarviscrawlercore.ReplyTmall.ReplyCase = {
  REPLY_NOT_SET: 0,
  PRODUCT: 100
};

/**
 * @return {proto.jarviscrawlercore.ReplyTmall.ReplyCase}
 */
proto.jarviscrawlercore.ReplyTmall.prototype.getReplyCase = function() {
  return /** @type {proto.jarviscrawlercore.ReplyTmall.ReplyCase} */(jspb.Message.computeOneofCase(this, proto.jarviscrawlercore.ReplyTmall.oneofGroups_[0]));
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
proto.jarviscrawlercore.ReplyTmall.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.ReplyTmall.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.ReplyTmall} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ReplyTmall.toObject = function(includeInstance, msg) {
  var f, obj = {
    mode: jspb.Message.getFieldWithDefault(msg, 1, 0),
    product: (f = msg.getProduct()) && proto.jarviscrawlercore.TmallProduct.toObject(includeInstance, f)
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
 * @return {!proto.jarviscrawlercore.ReplyTmall}
 */
proto.jarviscrawlercore.ReplyTmall.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.ReplyTmall;
  return proto.jarviscrawlercore.ReplyTmall.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.ReplyTmall} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.ReplyTmall}
 */
proto.jarviscrawlercore.ReplyTmall.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jarviscrawlercore.TmallMode} */ (reader.readEnum());
      msg.setMode(value);
      break;
    case 100:
      var value = new proto.jarviscrawlercore.TmallProduct;
      reader.readMessage(value,proto.jarviscrawlercore.TmallProduct.deserializeBinaryFromReader);
      msg.setProduct(value);
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
proto.jarviscrawlercore.ReplyTmall.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.ReplyTmall.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.ReplyTmall} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ReplyTmall.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMode();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getProduct();
  if (f != null) {
    writer.writeMessage(
      100,
      f,
      proto.jarviscrawlercore.TmallProduct.serializeBinaryToWriter
    );
  }
};


/**
 * optional TmallMode mode = 1;
 * @return {!proto.jarviscrawlercore.TmallMode}
 */
proto.jarviscrawlercore.ReplyTmall.prototype.getMode = function() {
  return /** @type {!proto.jarviscrawlercore.TmallMode} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.jarviscrawlercore.TmallMode} value */
proto.jarviscrawlercore.ReplyTmall.prototype.setMode = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional TmallProduct product = 100;
 * @return {?proto.jarviscrawlercore.TmallProduct}
 */
proto.jarviscrawlercore.ReplyTmall.prototype.getProduct = function() {
  return /** @type{?proto.jarviscrawlercore.TmallProduct} */ (
    jspb.Message.getWrapperField(this, proto.jarviscrawlercore.TmallProduct, 100));
};


/** @param {?proto.jarviscrawlercore.TmallProduct|undefined} value */
proto.jarviscrawlercore.ReplyTmall.prototype.setProduct = function(value) {
  jspb.Message.setOneofWrapperField(this, 100, proto.jarviscrawlercore.ReplyTmall.oneofGroups_[0], value);
};


proto.jarviscrawlercore.ReplyTmall.prototype.clearProduct = function() {
  this.setProduct(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jarviscrawlercore.ReplyTmall.prototype.hasProduct = function() {
  return jspb.Message.getField(this, 100) != null;
};


/**
 * @enum {number}
 */
proto.jarviscrawlercore.TmallMode = {
  TMM_PRODUCT: 0
};

goog.object.extend(exports, proto.jarviscrawlercore);