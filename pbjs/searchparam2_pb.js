// source: searchparam2.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.jarviscrawlercore.SearchParam2', null, global);
goog.exportSymbol('proto.jarviscrawlercore.SearchParam2Type', null, global);
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
proto.jarviscrawlercore.SearchParam2 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jarviscrawlercore.SearchParam2.repeatedFields_, null);
};
goog.inherits(proto.jarviscrawlercore.SearchParam2, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jarviscrawlercore.SearchParam2.displayName = 'proto.jarviscrawlercore.SearchParam2';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jarviscrawlercore.SearchParam2.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jarviscrawlercore.SearchParam2.prototype.toObject = function(opt_includeInstance) {
  return proto.jarviscrawlercore.SearchParam2.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jarviscrawlercore.SearchParam2} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.SearchParam2.toObject = function(includeInstance, msg) {
  var f, obj = {
    text: jspb.Message.getFieldWithDefault(msg, 1, ""),
    type: jspb.Message.getFieldWithDefault(msg, 2, 0),
    childtype: jspb.Message.getFieldWithDefault(msg, 3, 0),
    childrenList: jspb.Message.toObjectList(msg.getChildrenList(),
    proto.jarviscrawlercore.SearchParam2.toObject, includeInstance)
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
 * @return {!proto.jarviscrawlercore.SearchParam2}
 */
proto.jarviscrawlercore.SearchParam2.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jarviscrawlercore.SearchParam2;
  return proto.jarviscrawlercore.SearchParam2.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jarviscrawlercore.SearchParam2} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jarviscrawlercore.SearchParam2}
 */
proto.jarviscrawlercore.SearchParam2.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setText(value);
      break;
    case 2:
      var value = /** @type {!proto.jarviscrawlercore.SearchParam2Type} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 3:
      var value = /** @type {!proto.jarviscrawlercore.SearchParam2Type} */ (reader.readEnum());
      msg.setChildtype(value);
      break;
    case 4:
      var value = new proto.jarviscrawlercore.SearchParam2;
      reader.readMessage(value,proto.jarviscrawlercore.SearchParam2.deserializeBinaryFromReader);
      msg.addChildren(value);
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
proto.jarviscrawlercore.SearchParam2.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jarviscrawlercore.SearchParam2.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jarviscrawlercore.SearchParam2} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jarviscrawlercore.SearchParam2.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getText();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getChildtype();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getChildrenList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.jarviscrawlercore.SearchParam2.serializeBinaryToWriter
    );
  }
};


/**
 * optional string text = 1;
 * @return {string}
 */
proto.jarviscrawlercore.SearchParam2.prototype.getText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jarviscrawlercore.SearchParam2} returns this
 */
proto.jarviscrawlercore.SearchParam2.prototype.setText = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional SearchParam2Type type = 2;
 * @return {!proto.jarviscrawlercore.SearchParam2Type}
 */
proto.jarviscrawlercore.SearchParam2.prototype.getType = function() {
  return /** @type {!proto.jarviscrawlercore.SearchParam2Type} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.jarviscrawlercore.SearchParam2Type} value
 * @return {!proto.jarviscrawlercore.SearchParam2} returns this
 */
proto.jarviscrawlercore.SearchParam2.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional SearchParam2Type childType = 3;
 * @return {!proto.jarviscrawlercore.SearchParam2Type}
 */
proto.jarviscrawlercore.SearchParam2.prototype.getChildtype = function() {
  return /** @type {!proto.jarviscrawlercore.SearchParam2Type} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.jarviscrawlercore.SearchParam2Type} value
 * @return {!proto.jarviscrawlercore.SearchParam2} returns this
 */
proto.jarviscrawlercore.SearchParam2.prototype.setChildtype = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * repeated SearchParam2 children = 4;
 * @return {!Array<!proto.jarviscrawlercore.SearchParam2>}
 */
proto.jarviscrawlercore.SearchParam2.prototype.getChildrenList = function() {
  return /** @type{!Array<!proto.jarviscrawlercore.SearchParam2>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jarviscrawlercore.SearchParam2, 4));
};


/**
 * @param {!Array<!proto.jarviscrawlercore.SearchParam2>} value
 * @return {!proto.jarviscrawlercore.SearchParam2} returns this
*/
proto.jarviscrawlercore.SearchParam2.prototype.setChildrenList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.jarviscrawlercore.SearchParam2=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jarviscrawlercore.SearchParam2}
 */
proto.jarviscrawlercore.SearchParam2.prototype.addChildren = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.jarviscrawlercore.SearchParam2, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jarviscrawlercore.SearchParam2} returns this
 */
proto.jarviscrawlercore.SearchParam2.prototype.clearChildrenList = function() {
  return this.setChildrenList([]);
};


/**
 * @enum {number}
 */
proto.jarviscrawlercore.SearchParam2Type = {
  SP2T_NONE: 0,
  SP2T_AND: 1,
  SP2T_OR: 2,
  SP2T_EXCLUDE: 3,
  SP2T_COMBINATION: 4
};

goog.object.extend(exports, proto.jarviscrawlercore);
