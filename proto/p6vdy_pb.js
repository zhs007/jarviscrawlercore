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

goog.exportSymbol('proto.jarviscrawlercore.P6vdyMode', null, global);
goog.exportSymbol('proto.jarviscrawlercore.P6vdyMovies', null, global);
goog.exportSymbol('proto.jarviscrawlercore.P6vdyResInfo', null, global);
goog.exportSymbol('proto.jarviscrawlercore.ReplyP6vdy', null, global);
goog.exportSymbol('proto.jarviscrawlercore.RequestP6vdy', null, global);

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
proto.jarviscrawlercore.P6vdyResInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jarviscrawlercore.P6vdyResInfo.repeatedFields_, null);
};
goog.inherits(proto.jarviscrawlercore.P6vdyResInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.P6vdyResInfo.displayName = 'proto.jarviscrawlercore.P6vdyResInfo';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jarviscrawlercore.P6vdyResInfo.repeatedFields_ = [3,4];



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
proto.jarviscrawlercore.P6vdyResInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.P6vdyResInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.P6vdyResInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.P6vdyResInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    fullname: jspb.Message.getFieldWithDefault(msg, 1, ""),
    resid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    titleList: jspb.Message.getRepeatedField(msg, 3),
    directorList: jspb.Message.getRepeatedField(msg, 4),
    url: jspb.Message.getFieldWithDefault(msg, 5, ""),
    cover: jspb.Message.getFieldWithDefault(msg, 6, ""),
    fulldirector: jspb.Message.getFieldWithDefault(msg, 7, ""),
    category: jspb.Message.getFieldWithDefault(msg, 8, ""),
    season: jspb.Message.getFieldWithDefault(msg, 9, 0),
    episode: jspb.Message.getFieldWithDefault(msg, 10, 0)
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
 * @return {!proto.jarviscrawlercore.P6vdyResInfo}
 */
proto.jarviscrawlercore.P6vdyResInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.P6vdyResInfo;
  return proto.jarviscrawlercore.P6vdyResInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.P6vdyResInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.P6vdyResInfo}
 */
proto.jarviscrawlercore.P6vdyResInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setFullname(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setResid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addTitle(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.addDirector(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setUrl(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setCover(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setFulldirector(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setCategory(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setSeason(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setEpisode(value);
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
proto.jarviscrawlercore.P6vdyResInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.P6vdyResInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.P6vdyResInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.P6vdyResInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFullname();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getResid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTitleList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
  f = message.getDirectorList();
  if (f.length > 0) {
    writer.writeRepeatedString(
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
  f = message.getCover();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getFulldirector();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getCategory();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getSeason();
  if (f !== 0) {
    writer.writeInt32(
      9,
      f
    );
  }
  f = message.getEpisode();
  if (f !== 0) {
    writer.writeInt32(
      10,
      f
    );
  }
};


/**
 * optional string fullname = 1;
 * @return {string}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getFullname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setFullname = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string resid = 2;
 * @return {string}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getResid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setResid = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated string title = 3;
 * @return {!Array<string>}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getTitleList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/** @param {!Array<string>} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setTitleList = function(value) {
  jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.addTitle = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


proto.jarviscrawlercore.P6vdyResInfo.prototype.clearTitleList = function() {
  this.setTitleList([]);
};


/**
 * repeated string director = 4;
 * @return {!Array<string>}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getDirectorList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/** @param {!Array<string>} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setDirectorList = function(value) {
  jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.addDirector = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


proto.jarviscrawlercore.P6vdyResInfo.prototype.clearDirectorList = function() {
  this.setDirectorList([]);
};


/**
 * optional string url = 5;
 * @return {string}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setUrl = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string cover = 6;
 * @return {string}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getCover = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setCover = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string fulldirector = 7;
 * @return {string}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getFulldirector = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setFulldirector = function(value) {
  jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional string category = 8;
 * @return {string}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getCategory = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setCategory = function(value) {
  jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional int32 season = 9;
 * @return {number}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getSeason = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/** @param {number} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setSeason = function(value) {
  jspb.Message.setProto3IntField(this, 9, value);
};


/**
 * optional int32 episode = 10;
 * @return {number}
 */
proto.jarviscrawlercore.P6vdyResInfo.prototype.getEpisode = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
};


/** @param {number} value */
proto.jarviscrawlercore.P6vdyResInfo.prototype.setEpisode = function(value) {
  jspb.Message.setProto3IntField(this, 10, value);
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
proto.jarviscrawlercore.P6vdyMovies = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jarviscrawlercore.P6vdyMovies.repeatedFields_, null);
};
goog.inherits(proto.jarviscrawlercore.P6vdyMovies, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.P6vdyMovies.displayName = 'proto.jarviscrawlercore.P6vdyMovies';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jarviscrawlercore.P6vdyMovies.repeatedFields_ = [1];



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
proto.jarviscrawlercore.P6vdyMovies.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.P6vdyMovies.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.P6vdyMovies} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.P6vdyMovies.toObject = function(includeInstance, msg) {
  var f, obj = {
    lstList: jspb.Message.toObjectList(msg.getLstList(),
    proto.jarviscrawlercore.P6vdyResInfo.toObject, includeInstance)
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
 * @return {!proto.jarviscrawlercore.P6vdyMovies}
 */
proto.jarviscrawlercore.P6vdyMovies.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.P6vdyMovies;
  return proto.jarviscrawlercore.P6vdyMovies.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.P6vdyMovies} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.P6vdyMovies}
 */
proto.jarviscrawlercore.P6vdyMovies.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jarviscrawlercore.P6vdyResInfo;
      reader.readMessage(value,proto.jarviscrawlercore.P6vdyResInfo.deserializeBinaryFromReader);
      msg.addLst(value);
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
proto.jarviscrawlercore.P6vdyMovies.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.P6vdyMovies.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.P6vdyMovies} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.P6vdyMovies.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLstList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.jarviscrawlercore.P6vdyResInfo.serializeBinaryToWriter
    );
  }
};


/**
 * repeated P6vdyResInfo lst = 1;
 * @return {!Array<!proto.jarviscrawlercore.P6vdyResInfo>}
 */
proto.jarviscrawlercore.P6vdyMovies.prototype.getLstList = function() {
  return /** @type{!Array<!proto.jarviscrawlercore.P6vdyResInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jarviscrawlercore.P6vdyResInfo, 1));
};


/** @param {!Array<!proto.jarviscrawlercore.P6vdyResInfo>} value */
proto.jarviscrawlercore.P6vdyMovies.prototype.setLstList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.jarviscrawlercore.P6vdyResInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jarviscrawlercore.P6vdyResInfo}
 */
proto.jarviscrawlercore.P6vdyMovies.prototype.addLst = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.jarviscrawlercore.P6vdyResInfo, opt_index);
};


proto.jarviscrawlercore.P6vdyMovies.prototype.clearLstList = function() {
  this.setLstList([]);
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
proto.jarviscrawlercore.RequestP6vdy = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jarviscrawlercore.RequestP6vdy, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.RequestP6vdy.displayName = 'proto.jarviscrawlercore.RequestP6vdy';
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
proto.jarviscrawlercore.RequestP6vdy.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.RequestP6vdy.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.RequestP6vdy} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.RequestP6vdy.toObject = function(includeInstance, msg) {
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
 * @return {!proto.jarviscrawlercore.RequestP6vdy}
 */
proto.jarviscrawlercore.RequestP6vdy.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.RequestP6vdy;
  return proto.jarviscrawlercore.RequestP6vdy.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.RequestP6vdy} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.RequestP6vdy}
 */
proto.jarviscrawlercore.RequestP6vdy.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jarviscrawlercore.P6vdyMode} */ (reader.readEnum());
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
proto.jarviscrawlercore.RequestP6vdy.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.RequestP6vdy.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.RequestP6vdy} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.RequestP6vdy.serializeBinaryToWriter = function(message, writer) {
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
 * optional P6vdyMode mode = 1;
 * @return {!proto.jarviscrawlercore.P6vdyMode}
 */
proto.jarviscrawlercore.RequestP6vdy.prototype.getMode = function() {
  return /** @type {!proto.jarviscrawlercore.P6vdyMode} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.jarviscrawlercore.P6vdyMode} value */
proto.jarviscrawlercore.RequestP6vdy.prototype.setMode = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string url = 2;
 * @return {string}
 */
proto.jarviscrawlercore.RequestP6vdy.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.jarviscrawlercore.RequestP6vdy.prototype.setUrl = function(value) {
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
proto.jarviscrawlercore.ReplyP6vdy = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jarviscrawlercore.ReplyP6vdy.oneofGroups_);
};
goog.inherits(proto.jarviscrawlercore.ReplyP6vdy, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.jarviscrawlercore.ReplyP6vdy.displayName = 'proto.jarviscrawlercore.ReplyP6vdy';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jarviscrawlercore.ReplyP6vdy.oneofGroups_ = [[100,101]];

/**
 * @enum {number}
 */
proto.jarviscrawlercore.ReplyP6vdy.ReplyCase = {
  REPLY_NOT_SET: 0,
  MOVIES: 100,
  MOVIE: 101
};

/**
 * @return {proto.jarviscrawlercore.ReplyP6vdy.ReplyCase}
 */
proto.jarviscrawlercore.ReplyP6vdy.prototype.getReplyCase = function() {
  return /** @type {proto.jarviscrawlercore.ReplyP6vdy.ReplyCase} */(jspb.Message.computeOneofCase(this, proto.jarviscrawlercore.ReplyP6vdy.oneofGroups_[0]));
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
proto.jarviscrawlercore.ReplyP6vdy.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.ReplyP6vdy.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.ReplyP6vdy} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ReplyP6vdy.toObject = function(includeInstance, msg) {
  var f, obj = {
    mode: jspb.Message.getFieldWithDefault(msg, 1, 0),
    movies: (f = msg.getMovies()) && proto.jarviscrawlercore.P6vdyMovies.toObject(includeInstance, f),
    movie: (f = msg.getMovie()) && proto.jarviscrawlercore.P6vdyResInfo.toObject(includeInstance, f)
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
 * @return {!proto.jarviscrawlercore.ReplyP6vdy}
 */
proto.jarviscrawlercore.ReplyP6vdy.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.ReplyP6vdy;
  return proto.jarviscrawlercore.ReplyP6vdy.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.ReplyP6vdy} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.ReplyP6vdy}
 */
proto.jarviscrawlercore.ReplyP6vdy.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jarviscrawlercore.P6vdyMode} */ (reader.readEnum());
      msg.setMode(value);
      break;
    case 100:
      var value = new proto.jarviscrawlercore.P6vdyMovies;
      reader.readMessage(value,proto.jarviscrawlercore.P6vdyMovies.deserializeBinaryFromReader);
      msg.setMovies(value);
      break;
    case 101:
      var value = new proto.jarviscrawlercore.P6vdyResInfo;
      reader.readMessage(value,proto.jarviscrawlercore.P6vdyResInfo.deserializeBinaryFromReader);
      msg.setMovie(value);
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
proto.jarviscrawlercore.ReplyP6vdy.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.ReplyP6vdy.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.ReplyP6vdy} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.ReplyP6vdy.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMode();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getMovies();
  if (f != null) {
    writer.writeMessage(
      100,
      f,
      proto.jarviscrawlercore.P6vdyMovies.serializeBinaryToWriter
    );
  }
  f = message.getMovie();
  if (f != null) {
    writer.writeMessage(
      101,
      f,
      proto.jarviscrawlercore.P6vdyResInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional P6vdyMode mode = 1;
 * @return {!proto.jarviscrawlercore.P6vdyMode}
 */
proto.jarviscrawlercore.ReplyP6vdy.prototype.getMode = function() {
  return /** @type {!proto.jarviscrawlercore.P6vdyMode} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.jarviscrawlercore.P6vdyMode} value */
proto.jarviscrawlercore.ReplyP6vdy.prototype.setMode = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional P6vdyMovies movies = 100;
 * @return {?proto.jarviscrawlercore.P6vdyMovies}
 */
proto.jarviscrawlercore.ReplyP6vdy.prototype.getMovies = function() {
  return /** @type{?proto.jarviscrawlercore.P6vdyMovies} */ (
    jspb.Message.getWrapperField(this, proto.jarviscrawlercore.P6vdyMovies, 100));
};


/** @param {?proto.jarviscrawlercore.P6vdyMovies|undefined} value */
proto.jarviscrawlercore.ReplyP6vdy.prototype.setMovies = function(value) {
  jspb.Message.setOneofWrapperField(this, 100, proto.jarviscrawlercore.ReplyP6vdy.oneofGroups_[0], value);
};


proto.jarviscrawlercore.ReplyP6vdy.prototype.clearMovies = function() {
  this.setMovies(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jarviscrawlercore.ReplyP6vdy.prototype.hasMovies = function() {
  return jspb.Message.getField(this, 100) != null;
};


/**
 * optional P6vdyResInfo movie = 101;
 * @return {?proto.jarviscrawlercore.P6vdyResInfo}
 */
proto.jarviscrawlercore.ReplyP6vdy.prototype.getMovie = function() {
  return /** @type{?proto.jarviscrawlercore.P6vdyResInfo} */ (
    jspb.Message.getWrapperField(this, proto.jarviscrawlercore.P6vdyResInfo, 101));
};


/** @param {?proto.jarviscrawlercore.P6vdyResInfo|undefined} value */
proto.jarviscrawlercore.ReplyP6vdy.prototype.setMovie = function(value) {
  jspb.Message.setOneofWrapperField(this, 101, proto.jarviscrawlercore.ReplyP6vdy.oneofGroups_[0], value);
};


proto.jarviscrawlercore.ReplyP6vdy.prototype.clearMovie = function() {
  this.setMovie(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jarviscrawlercore.ReplyP6vdy.prototype.hasMovie = function() {
  return jspb.Message.getField(this, 101) != null;
};


/**
 * @enum {number}
 */
proto.jarviscrawlercore.P6vdyMode = {
  P6VDY_MOVIES: 0,
  P6VDY_MOVIE: 1
};

goog.object.extend(exports, proto.jarviscrawlercore);
