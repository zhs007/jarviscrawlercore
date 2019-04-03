/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.jarviscrawlercore = (function() {

    /**
     * Namespace jarviscrawlercore.
     * @exports jarviscrawlercore
     * @namespace
     */
    var jarviscrawlercore = {};

    /**
     * ParagraphType enum.
     * @name jarviscrawlercore.ParagraphType
     * @enum {string}
     * @property {number} PT_TEXT=1 PT_TEXT value
     * @property {number} PT_IMAGE=2 PT_IMAGE value
     * @property {number} PT_HEADLINE=3 PT_HEADLINE value
     */
    jarviscrawlercore.ParagraphType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[1] = "PT_TEXT"] = 1;
        values[valuesById[2] = "PT_IMAGE"] = 2;
        values[valuesById[3] = "PT_HEADLINE"] = 3;
        return values;
    })();

    jarviscrawlercore.ImageInfo = (function() {

        /**
         * Properties of an ImageInfo.
         * @memberof jarviscrawlercore
         * @interface IImageInfo
         * @property {string|null} [hashName] ImageInfo hashName
         * @property {string|null} [url] ImageInfo url
         * @property {number|null} [width] ImageInfo width
         * @property {number|null} [height] ImageInfo height
         * @property {Uint8Array|null} [data] ImageInfo data
         */

        /**
         * Constructs a new ImageInfo.
         * @memberof jarviscrawlercore
         * @classdesc Represents an ImageInfo.
         * @implements IImageInfo
         * @constructor
         * @param {jarviscrawlercore.IImageInfo=} [properties] Properties to set
         */
        function ImageInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ImageInfo hashName.
         * @member {string} hashName
         * @memberof jarviscrawlercore.ImageInfo
         * @instance
         */
        ImageInfo.prototype.hashName = "";

        /**
         * ImageInfo url.
         * @member {string} url
         * @memberof jarviscrawlercore.ImageInfo
         * @instance
         */
        ImageInfo.prototype.url = "";

        /**
         * ImageInfo width.
         * @member {number} width
         * @memberof jarviscrawlercore.ImageInfo
         * @instance
         */
        ImageInfo.prototype.width = 0;

        /**
         * ImageInfo height.
         * @member {number} height
         * @memberof jarviscrawlercore.ImageInfo
         * @instance
         */
        ImageInfo.prototype.height = 0;

        /**
         * ImageInfo data.
         * @member {Uint8Array} data
         * @memberof jarviscrawlercore.ImageInfo
         * @instance
         */
        ImageInfo.prototype.data = $util.newBuffer([]);

        /**
         * Creates a new ImageInfo instance using the specified properties.
         * @function create
         * @memberof jarviscrawlercore.ImageInfo
         * @static
         * @param {jarviscrawlercore.IImageInfo=} [properties] Properties to set
         * @returns {jarviscrawlercore.ImageInfo} ImageInfo instance
         */
        ImageInfo.create = function create(properties) {
            return new ImageInfo(properties);
        };

        /**
         * Encodes the specified ImageInfo message. Does not implicitly {@link jarviscrawlercore.ImageInfo.verify|verify} messages.
         * @function encode
         * @memberof jarviscrawlercore.ImageInfo
         * @static
         * @param {jarviscrawlercore.IImageInfo} message ImageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ImageInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hashName != null && message.hasOwnProperty("hashName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.hashName);
            if (message.url != null && message.hasOwnProperty("url"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.url);
            if (message.width != null && message.hasOwnProperty("width"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.width);
            if (message.height != null && message.hasOwnProperty("height"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.height);
            if (message.data != null && message.hasOwnProperty("data"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.data);
            return writer;
        };

        /**
         * Encodes the specified ImageInfo message, length delimited. Does not implicitly {@link jarviscrawlercore.ImageInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jarviscrawlercore.ImageInfo
         * @static
         * @param {jarviscrawlercore.IImageInfo} message ImageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ImageInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ImageInfo message from the specified reader or buffer.
         * @function decode
         * @memberof jarviscrawlercore.ImageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jarviscrawlercore.ImageInfo} ImageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ImageInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.jarviscrawlercore.ImageInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.hashName = reader.string();
                    break;
                case 2:
                    message.url = reader.string();
                    break;
                case 3:
                    message.width = reader.int32();
                    break;
                case 4:
                    message.height = reader.int32();
                    break;
                case 5:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ImageInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jarviscrawlercore.ImageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jarviscrawlercore.ImageInfo} ImageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ImageInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ImageInfo message.
         * @function verify
         * @memberof jarviscrawlercore.ImageInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ImageInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hashName != null && message.hasOwnProperty("hashName"))
                if (!$util.isString(message.hashName))
                    return "hashName: string expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            return null;
        };

        /**
         * Creates an ImageInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jarviscrawlercore.ImageInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jarviscrawlercore.ImageInfo} ImageInfo
         */
        ImageInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.jarviscrawlercore.ImageInfo)
                return object;
            var message = new $root.jarviscrawlercore.ImageInfo();
            if (object.hashName != null)
                message.hashName = String(object.hashName);
            if (object.url != null)
                message.url = String(object.url);
            if (object.width != null)
                message.width = object.width | 0;
            if (object.height != null)
                message.height = object.height | 0;
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length)
                    message.data = object.data;
            return message;
        };

        /**
         * Creates a plain object from an ImageInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jarviscrawlercore.ImageInfo
         * @static
         * @param {jarviscrawlercore.ImageInfo} message ImageInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ImageInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.hashName = "";
                object.url = "";
                object.width = 0;
                object.height = 0;
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
            }
            if (message.hashName != null && message.hasOwnProperty("hashName"))
                object.hashName = message.hashName;
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            return object;
        };

        /**
         * Converts this ImageInfo to JSON.
         * @function toJSON
         * @memberof jarviscrawlercore.ImageInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ImageInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ImageInfo;
    })();

    jarviscrawlercore.Paragraph = (function() {

        /**
         * Properties of a Paragraph.
         * @memberof jarviscrawlercore
         * @interface IParagraph
         * @property {jarviscrawlercore.ParagraphType|null} [pt] Paragraph pt
         * @property {string|null} [imgHashName] Paragraph imgHashName
         * @property {string|null} [text] Paragraph text
         * @property {string|null} [imgURL] Paragraph imgURL
         */

        /**
         * Constructs a new Paragraph.
         * @memberof jarviscrawlercore
         * @classdesc Represents a Paragraph.
         * @implements IParagraph
         * @constructor
         * @param {jarviscrawlercore.IParagraph=} [properties] Properties to set
         */
        function Paragraph(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Paragraph pt.
         * @member {jarviscrawlercore.ParagraphType} pt
         * @memberof jarviscrawlercore.Paragraph
         * @instance
         */
        Paragraph.prototype.pt = 1;

        /**
         * Paragraph imgHashName.
         * @member {string} imgHashName
         * @memberof jarviscrawlercore.Paragraph
         * @instance
         */
        Paragraph.prototype.imgHashName = "";

        /**
         * Paragraph text.
         * @member {string} text
         * @memberof jarviscrawlercore.Paragraph
         * @instance
         */
        Paragraph.prototype.text = "";

        /**
         * Paragraph imgURL.
         * @member {string} imgURL
         * @memberof jarviscrawlercore.Paragraph
         * @instance
         */
        Paragraph.prototype.imgURL = "";

        /**
         * Creates a new Paragraph instance using the specified properties.
         * @function create
         * @memberof jarviscrawlercore.Paragraph
         * @static
         * @param {jarviscrawlercore.IParagraph=} [properties] Properties to set
         * @returns {jarviscrawlercore.Paragraph} Paragraph instance
         */
        Paragraph.create = function create(properties) {
            return new Paragraph(properties);
        };

        /**
         * Encodes the specified Paragraph message. Does not implicitly {@link jarviscrawlercore.Paragraph.verify|verify} messages.
         * @function encode
         * @memberof jarviscrawlercore.Paragraph
         * @static
         * @param {jarviscrawlercore.IParagraph} message Paragraph message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Paragraph.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pt != null && message.hasOwnProperty("pt"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pt);
            if (message.imgHashName != null && message.hasOwnProperty("imgHashName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.imgHashName);
            if (message.text != null && message.hasOwnProperty("text"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.text);
            if (message.imgURL != null && message.hasOwnProperty("imgURL"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.imgURL);
            return writer;
        };

        /**
         * Encodes the specified Paragraph message, length delimited. Does not implicitly {@link jarviscrawlercore.Paragraph.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jarviscrawlercore.Paragraph
         * @static
         * @param {jarviscrawlercore.IParagraph} message Paragraph message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Paragraph.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Paragraph message from the specified reader or buffer.
         * @function decode
         * @memberof jarviscrawlercore.Paragraph
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jarviscrawlercore.Paragraph} Paragraph
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Paragraph.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.jarviscrawlercore.Paragraph();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.pt = reader.int32();
                    break;
                case 2:
                    message.imgHashName = reader.string();
                    break;
                case 3:
                    message.text = reader.string();
                    break;
                case 4:
                    message.imgURL = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Paragraph message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jarviscrawlercore.Paragraph
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jarviscrawlercore.Paragraph} Paragraph
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Paragraph.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Paragraph message.
         * @function verify
         * @memberof jarviscrawlercore.Paragraph
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Paragraph.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pt != null && message.hasOwnProperty("pt"))
                switch (message.pt) {
                default:
                    return "pt: enum value expected";
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.imgHashName != null && message.hasOwnProperty("imgHashName"))
                if (!$util.isString(message.imgHashName))
                    return "imgHashName: string expected";
            if (message.text != null && message.hasOwnProperty("text"))
                if (!$util.isString(message.text))
                    return "text: string expected";
            if (message.imgURL != null && message.hasOwnProperty("imgURL"))
                if (!$util.isString(message.imgURL))
                    return "imgURL: string expected";
            return null;
        };

        /**
         * Creates a Paragraph message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jarviscrawlercore.Paragraph
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jarviscrawlercore.Paragraph} Paragraph
         */
        Paragraph.fromObject = function fromObject(object) {
            if (object instanceof $root.jarviscrawlercore.Paragraph)
                return object;
            var message = new $root.jarviscrawlercore.Paragraph();
            switch (object.pt) {
            case "PT_TEXT":
            case 1:
                message.pt = 1;
                break;
            case "PT_IMAGE":
            case 2:
                message.pt = 2;
                break;
            case "PT_HEADLINE":
            case 3:
                message.pt = 3;
                break;
            }
            if (object.imgHashName != null)
                message.imgHashName = String(object.imgHashName);
            if (object.text != null)
                message.text = String(object.text);
            if (object.imgURL != null)
                message.imgURL = String(object.imgURL);
            return message;
        };

        /**
         * Creates a plain object from a Paragraph message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jarviscrawlercore.Paragraph
         * @static
         * @param {jarviscrawlercore.Paragraph} message Paragraph
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Paragraph.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.pt = options.enums === String ? "PT_TEXT" : 1;
                object.imgHashName = "";
                object.text = "";
                object.imgURL = "";
            }
            if (message.pt != null && message.hasOwnProperty("pt"))
                object.pt = options.enums === String ? $root.jarviscrawlercore.ParagraphType[message.pt] : message.pt;
            if (message.imgHashName != null && message.hasOwnProperty("imgHashName"))
                object.imgHashName = message.imgHashName;
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = message.text;
            if (message.imgURL != null && message.hasOwnProperty("imgURL"))
                object.imgURL = message.imgURL;
            return object;
        };

        /**
         * Converts this Paragraph to JSON.
         * @function toJSON
         * @memberof jarviscrawlercore.Paragraph
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Paragraph.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Paragraph;
    })();

    jarviscrawlercore.ExportArticleResult = (function() {

        /**
         * Properties of an ExportArticleResult.
         * @memberof jarviscrawlercore
         * @interface IExportArticleResult
         * @property {string|null} [title] ExportArticleResult title
         * @property {string|null} [author] ExportArticleResult author
         * @property {string|null} [writeTime] ExportArticleResult writeTime
         * @property {string|null} [article] ExportArticleResult article
         * @property {string|null} [url] ExportArticleResult url
         * @property {Array.<jarviscrawlercore.IImageInfo>|null} [imgs] ExportArticleResult imgs
         * @property {jarviscrawlercore.IImageInfo|null} [titleImage] ExportArticleResult titleImage
         * @property {Array.<string>|null} [tags] ExportArticleResult tags
         * @property {Array.<jarviscrawlercore.IParagraph>|null} [paragraphs] ExportArticleResult paragraphs
         * @property {string|null} [summary] ExportArticleResult summary
         */

        /**
         * Constructs a new ExportArticleResult.
         * @memberof jarviscrawlercore
         * @classdesc Represents an ExportArticleResult.
         * @implements IExportArticleResult
         * @constructor
         * @param {jarviscrawlercore.IExportArticleResult=} [properties] Properties to set
         */
        function ExportArticleResult(properties) {
            this.imgs = [];
            this.tags = [];
            this.paragraphs = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExportArticleResult title.
         * @member {string} title
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.title = "";

        /**
         * ExportArticleResult author.
         * @member {string} author
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.author = "";

        /**
         * ExportArticleResult writeTime.
         * @member {string} writeTime
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.writeTime = "";

        /**
         * ExportArticleResult article.
         * @member {string} article
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.article = "";

        /**
         * ExportArticleResult url.
         * @member {string} url
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.url = "";

        /**
         * ExportArticleResult imgs.
         * @member {Array.<jarviscrawlercore.IImageInfo>} imgs
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.imgs = $util.emptyArray;

        /**
         * ExportArticleResult titleImage.
         * @member {jarviscrawlercore.IImageInfo|null|undefined} titleImage
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.titleImage = null;

        /**
         * ExportArticleResult tags.
         * @member {Array.<string>} tags
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.tags = $util.emptyArray;

        /**
         * ExportArticleResult paragraphs.
         * @member {Array.<jarviscrawlercore.IParagraph>} paragraphs
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.paragraphs = $util.emptyArray;

        /**
         * ExportArticleResult summary.
         * @member {string} summary
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         */
        ExportArticleResult.prototype.summary = "";

        /**
         * Creates a new ExportArticleResult instance using the specified properties.
         * @function create
         * @memberof jarviscrawlercore.ExportArticleResult
         * @static
         * @param {jarviscrawlercore.IExportArticleResult=} [properties] Properties to set
         * @returns {jarviscrawlercore.ExportArticleResult} ExportArticleResult instance
         */
        ExportArticleResult.create = function create(properties) {
            return new ExportArticleResult(properties);
        };

        /**
         * Encodes the specified ExportArticleResult message. Does not implicitly {@link jarviscrawlercore.ExportArticleResult.verify|verify} messages.
         * @function encode
         * @memberof jarviscrawlercore.ExportArticleResult
         * @static
         * @param {jarviscrawlercore.IExportArticleResult} message ExportArticleResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExportArticleResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.title != null && message.hasOwnProperty("title"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.title);
            if (message.author != null && message.hasOwnProperty("author"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.author);
            if (message.writeTime != null && message.hasOwnProperty("writeTime"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.writeTime);
            if (message.article != null && message.hasOwnProperty("article"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.article);
            if (message.url != null && message.hasOwnProperty("url"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.url);
            if (message.imgs != null && message.imgs.length)
                for (var i = 0; i < message.imgs.length; ++i)
                    $root.jarviscrawlercore.ImageInfo.encode(message.imgs[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.titleImage != null && message.hasOwnProperty("titleImage"))
                $root.jarviscrawlercore.ImageInfo.encode(message.titleImage, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.tags != null && message.tags.length)
                for (var i = 0; i < message.tags.length; ++i)
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.tags[i]);
            if (message.paragraphs != null && message.paragraphs.length)
                for (var i = 0; i < message.paragraphs.length; ++i)
                    $root.jarviscrawlercore.Paragraph.encode(message.paragraphs[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.summary != null && message.hasOwnProperty("summary"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.summary);
            return writer;
        };

        /**
         * Encodes the specified ExportArticleResult message, length delimited. Does not implicitly {@link jarviscrawlercore.ExportArticleResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jarviscrawlercore.ExportArticleResult
         * @static
         * @param {jarviscrawlercore.IExportArticleResult} message ExportArticleResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExportArticleResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExportArticleResult message from the specified reader or buffer.
         * @function decode
         * @memberof jarviscrawlercore.ExportArticleResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jarviscrawlercore.ExportArticleResult} ExportArticleResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExportArticleResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.jarviscrawlercore.ExportArticleResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.author = reader.string();
                    break;
                case 3:
                    message.writeTime = reader.string();
                    break;
                case 4:
                    message.article = reader.string();
                    break;
                case 5:
                    message.url = reader.string();
                    break;
                case 6:
                    if (!(message.imgs && message.imgs.length))
                        message.imgs = [];
                    message.imgs.push($root.jarviscrawlercore.ImageInfo.decode(reader, reader.uint32()));
                    break;
                case 7:
                    message.titleImage = $root.jarviscrawlercore.ImageInfo.decode(reader, reader.uint32());
                    break;
                case 8:
                    if (!(message.tags && message.tags.length))
                        message.tags = [];
                    message.tags.push(reader.string());
                    break;
                case 9:
                    if (!(message.paragraphs && message.paragraphs.length))
                        message.paragraphs = [];
                    message.paragraphs.push($root.jarviscrawlercore.Paragraph.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.summary = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExportArticleResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jarviscrawlercore.ExportArticleResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jarviscrawlercore.ExportArticleResult} ExportArticleResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExportArticleResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExportArticleResult message.
         * @function verify
         * @memberof jarviscrawlercore.ExportArticleResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExportArticleResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.title != null && message.hasOwnProperty("title"))
                if (!$util.isString(message.title))
                    return "title: string expected";
            if (message.author != null && message.hasOwnProperty("author"))
                if (!$util.isString(message.author))
                    return "author: string expected";
            if (message.writeTime != null && message.hasOwnProperty("writeTime"))
                if (!$util.isString(message.writeTime))
                    return "writeTime: string expected";
            if (message.article != null && message.hasOwnProperty("article"))
                if (!$util.isString(message.article))
                    return "article: string expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.imgs != null && message.hasOwnProperty("imgs")) {
                if (!Array.isArray(message.imgs))
                    return "imgs: array expected";
                for (var i = 0; i < message.imgs.length; ++i) {
                    var error = $root.jarviscrawlercore.ImageInfo.verify(message.imgs[i]);
                    if (error)
                        return "imgs." + error;
                }
            }
            if (message.titleImage != null && message.hasOwnProperty("titleImage")) {
                var error = $root.jarviscrawlercore.ImageInfo.verify(message.titleImage);
                if (error)
                    return "titleImage." + error;
            }
            if (message.tags != null && message.hasOwnProperty("tags")) {
                if (!Array.isArray(message.tags))
                    return "tags: array expected";
                for (var i = 0; i < message.tags.length; ++i)
                    if (!$util.isString(message.tags[i]))
                        return "tags: string[] expected";
            }
            if (message.paragraphs != null && message.hasOwnProperty("paragraphs")) {
                if (!Array.isArray(message.paragraphs))
                    return "paragraphs: array expected";
                for (var i = 0; i < message.paragraphs.length; ++i) {
                    var error = $root.jarviscrawlercore.Paragraph.verify(message.paragraphs[i]);
                    if (error)
                        return "paragraphs." + error;
                }
            }
            if (message.summary != null && message.hasOwnProperty("summary"))
                if (!$util.isString(message.summary))
                    return "summary: string expected";
            return null;
        };

        /**
         * Creates an ExportArticleResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jarviscrawlercore.ExportArticleResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jarviscrawlercore.ExportArticleResult} ExportArticleResult
         */
        ExportArticleResult.fromObject = function fromObject(object) {
            if (object instanceof $root.jarviscrawlercore.ExportArticleResult)
                return object;
            var message = new $root.jarviscrawlercore.ExportArticleResult();
            if (object.title != null)
                message.title = String(object.title);
            if (object.author != null)
                message.author = String(object.author);
            if (object.writeTime != null)
                message.writeTime = String(object.writeTime);
            if (object.article != null)
                message.article = String(object.article);
            if (object.url != null)
                message.url = String(object.url);
            if (object.imgs) {
                if (!Array.isArray(object.imgs))
                    throw TypeError(".jarviscrawlercore.ExportArticleResult.imgs: array expected");
                message.imgs = [];
                for (var i = 0; i < object.imgs.length; ++i) {
                    if (typeof object.imgs[i] !== "object")
                        throw TypeError(".jarviscrawlercore.ExportArticleResult.imgs: object expected");
                    message.imgs[i] = $root.jarviscrawlercore.ImageInfo.fromObject(object.imgs[i]);
                }
            }
            if (object.titleImage != null) {
                if (typeof object.titleImage !== "object")
                    throw TypeError(".jarviscrawlercore.ExportArticleResult.titleImage: object expected");
                message.titleImage = $root.jarviscrawlercore.ImageInfo.fromObject(object.titleImage);
            }
            if (object.tags) {
                if (!Array.isArray(object.tags))
                    throw TypeError(".jarviscrawlercore.ExportArticleResult.tags: array expected");
                message.tags = [];
                for (var i = 0; i < object.tags.length; ++i)
                    message.tags[i] = String(object.tags[i]);
            }
            if (object.paragraphs) {
                if (!Array.isArray(object.paragraphs))
                    throw TypeError(".jarviscrawlercore.ExportArticleResult.paragraphs: array expected");
                message.paragraphs = [];
                for (var i = 0; i < object.paragraphs.length; ++i) {
                    if (typeof object.paragraphs[i] !== "object")
                        throw TypeError(".jarviscrawlercore.ExportArticleResult.paragraphs: object expected");
                    message.paragraphs[i] = $root.jarviscrawlercore.Paragraph.fromObject(object.paragraphs[i]);
                }
            }
            if (object.summary != null)
                message.summary = String(object.summary);
            return message;
        };

        /**
         * Creates a plain object from an ExportArticleResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jarviscrawlercore.ExportArticleResult
         * @static
         * @param {jarviscrawlercore.ExportArticleResult} message ExportArticleResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExportArticleResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.imgs = [];
                object.tags = [];
                object.paragraphs = [];
            }
            if (options.defaults) {
                object.title = "";
                object.author = "";
                object.writeTime = "";
                object.article = "";
                object.url = "";
                object.titleImage = null;
                object.summary = "";
            }
            if (message.title != null && message.hasOwnProperty("title"))
                object.title = message.title;
            if (message.author != null && message.hasOwnProperty("author"))
                object.author = message.author;
            if (message.writeTime != null && message.hasOwnProperty("writeTime"))
                object.writeTime = message.writeTime;
            if (message.article != null && message.hasOwnProperty("article"))
                object.article = message.article;
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.imgs && message.imgs.length) {
                object.imgs = [];
                for (var j = 0; j < message.imgs.length; ++j)
                    object.imgs[j] = $root.jarviscrawlercore.ImageInfo.toObject(message.imgs[j], options);
            }
            if (message.titleImage != null && message.hasOwnProperty("titleImage"))
                object.titleImage = $root.jarviscrawlercore.ImageInfo.toObject(message.titleImage, options);
            if (message.tags && message.tags.length) {
                object.tags = [];
                for (var j = 0; j < message.tags.length; ++j)
                    object.tags[j] = message.tags[j];
            }
            if (message.paragraphs && message.paragraphs.length) {
                object.paragraphs = [];
                for (var j = 0; j < message.paragraphs.length; ++j)
                    object.paragraphs[j] = $root.jarviscrawlercore.Paragraph.toObject(message.paragraphs[j], options);
            }
            if (message.summary != null && message.hasOwnProperty("summary"))
                object.summary = message.summary;
            return object;
        };

        /**
         * Converts this ExportArticleResult to JSON.
         * @function toJSON
         * @memberof jarviscrawlercore.ExportArticleResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExportArticleResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ExportArticleResult;
    })();

    jarviscrawlercore.ConfluenceUpdateItem = (function() {

        /**
         * Properties of a ConfluenceUpdateItem.
         * @memberof jarviscrawlercore
         * @interface IConfluenceUpdateItem
         * @property {string|null} [title] ConfluenceUpdateItem title
         * @property {string|null} [url] ConfluenceUpdateItem url
         * @property {string|null} [summary] ConfluenceUpdateItem summary
         */

        /**
         * Constructs a new ConfluenceUpdateItem.
         * @memberof jarviscrawlercore
         * @classdesc Represents a ConfluenceUpdateItem.
         * @implements IConfluenceUpdateItem
         * @constructor
         * @param {jarviscrawlercore.IConfluenceUpdateItem=} [properties] Properties to set
         */
        function ConfluenceUpdateItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ConfluenceUpdateItem title.
         * @member {string} title
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @instance
         */
        ConfluenceUpdateItem.prototype.title = "";

        /**
         * ConfluenceUpdateItem url.
         * @member {string} url
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @instance
         */
        ConfluenceUpdateItem.prototype.url = "";

        /**
         * ConfluenceUpdateItem summary.
         * @member {string} summary
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @instance
         */
        ConfluenceUpdateItem.prototype.summary = "";

        /**
         * Creates a new ConfluenceUpdateItem instance using the specified properties.
         * @function create
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @static
         * @param {jarviscrawlercore.IConfluenceUpdateItem=} [properties] Properties to set
         * @returns {jarviscrawlercore.ConfluenceUpdateItem} ConfluenceUpdateItem instance
         */
        ConfluenceUpdateItem.create = function create(properties) {
            return new ConfluenceUpdateItem(properties);
        };

        /**
         * Encodes the specified ConfluenceUpdateItem message. Does not implicitly {@link jarviscrawlercore.ConfluenceUpdateItem.verify|verify} messages.
         * @function encode
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @static
         * @param {jarviscrawlercore.IConfluenceUpdateItem} message ConfluenceUpdateItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConfluenceUpdateItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.title != null && message.hasOwnProperty("title"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.title);
            if (message.url != null && message.hasOwnProperty("url"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.url);
            if (message.summary != null && message.hasOwnProperty("summary"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.summary);
            return writer;
        };

        /**
         * Encodes the specified ConfluenceUpdateItem message, length delimited. Does not implicitly {@link jarviscrawlercore.ConfluenceUpdateItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @static
         * @param {jarviscrawlercore.IConfluenceUpdateItem} message ConfluenceUpdateItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConfluenceUpdateItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ConfluenceUpdateItem message from the specified reader or buffer.
         * @function decode
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jarviscrawlercore.ConfluenceUpdateItem} ConfluenceUpdateItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConfluenceUpdateItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.jarviscrawlercore.ConfluenceUpdateItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.url = reader.string();
                    break;
                case 3:
                    message.summary = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ConfluenceUpdateItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jarviscrawlercore.ConfluenceUpdateItem} ConfluenceUpdateItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConfluenceUpdateItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ConfluenceUpdateItem message.
         * @function verify
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ConfluenceUpdateItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.title != null && message.hasOwnProperty("title"))
                if (!$util.isString(message.title))
                    return "title: string expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.summary != null && message.hasOwnProperty("summary"))
                if (!$util.isString(message.summary))
                    return "summary: string expected";
            return null;
        };

        /**
         * Creates a ConfluenceUpdateItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jarviscrawlercore.ConfluenceUpdateItem} ConfluenceUpdateItem
         */
        ConfluenceUpdateItem.fromObject = function fromObject(object) {
            if (object instanceof $root.jarviscrawlercore.ConfluenceUpdateItem)
                return object;
            var message = new $root.jarviscrawlercore.ConfluenceUpdateItem();
            if (object.title != null)
                message.title = String(object.title);
            if (object.url != null)
                message.url = String(object.url);
            if (object.summary != null)
                message.summary = String(object.summary);
            return message;
        };

        /**
         * Creates a plain object from a ConfluenceUpdateItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @static
         * @param {jarviscrawlercore.ConfluenceUpdateItem} message ConfluenceUpdateItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ConfluenceUpdateItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.title = "";
                object.url = "";
                object.summary = "";
            }
            if (message.title != null && message.hasOwnProperty("title"))
                object.title = message.title;
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.summary != null && message.hasOwnProperty("summary"))
                object.summary = message.summary;
            return object;
        };

        /**
         * Converts this ConfluenceUpdateItem to JSON.
         * @function toJSON
         * @memberof jarviscrawlercore.ConfluenceUpdateItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ConfluenceUpdateItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ConfluenceUpdateItem;
    })();

    jarviscrawlercore.ConfluenceUpdateGrouping = (function() {

        /**
         * Properties of a ConfluenceUpdateGrouping.
         * @memberof jarviscrawlercore
         * @interface IConfluenceUpdateGrouping
         * @property {string|null} [author] ConfluenceUpdateGrouping author
         * @property {Array.<jarviscrawlercore.IConfluenceUpdateItem>|null} [items] ConfluenceUpdateGrouping items
         */

        /**
         * Constructs a new ConfluenceUpdateGrouping.
         * @memberof jarviscrawlercore
         * @classdesc Represents a ConfluenceUpdateGrouping.
         * @implements IConfluenceUpdateGrouping
         * @constructor
         * @param {jarviscrawlercore.IConfluenceUpdateGrouping=} [properties] Properties to set
         */
        function ConfluenceUpdateGrouping(properties) {
            this.items = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ConfluenceUpdateGrouping author.
         * @member {string} author
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @instance
         */
        ConfluenceUpdateGrouping.prototype.author = "";

        /**
         * ConfluenceUpdateGrouping items.
         * @member {Array.<jarviscrawlercore.IConfluenceUpdateItem>} items
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @instance
         */
        ConfluenceUpdateGrouping.prototype.items = $util.emptyArray;

        /**
         * Creates a new ConfluenceUpdateGrouping instance using the specified properties.
         * @function create
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @static
         * @param {jarviscrawlercore.IConfluenceUpdateGrouping=} [properties] Properties to set
         * @returns {jarviscrawlercore.ConfluenceUpdateGrouping} ConfluenceUpdateGrouping instance
         */
        ConfluenceUpdateGrouping.create = function create(properties) {
            return new ConfluenceUpdateGrouping(properties);
        };

        /**
         * Encodes the specified ConfluenceUpdateGrouping message. Does not implicitly {@link jarviscrawlercore.ConfluenceUpdateGrouping.verify|verify} messages.
         * @function encode
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @static
         * @param {jarviscrawlercore.IConfluenceUpdateGrouping} message ConfluenceUpdateGrouping message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConfluenceUpdateGrouping.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.author != null && message.hasOwnProperty("author"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.author);
            if (message.items != null && message.items.length)
                for (var i = 0; i < message.items.length; ++i)
                    $root.jarviscrawlercore.ConfluenceUpdateItem.encode(message.items[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ConfluenceUpdateGrouping message, length delimited. Does not implicitly {@link jarviscrawlercore.ConfluenceUpdateGrouping.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @static
         * @param {jarviscrawlercore.IConfluenceUpdateGrouping} message ConfluenceUpdateGrouping message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConfluenceUpdateGrouping.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ConfluenceUpdateGrouping message from the specified reader or buffer.
         * @function decode
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jarviscrawlercore.ConfluenceUpdateGrouping} ConfluenceUpdateGrouping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConfluenceUpdateGrouping.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.jarviscrawlercore.ConfluenceUpdateGrouping();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.author = reader.string();
                    break;
                case 2:
                    if (!(message.items && message.items.length))
                        message.items = [];
                    message.items.push($root.jarviscrawlercore.ConfluenceUpdateItem.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ConfluenceUpdateGrouping message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jarviscrawlercore.ConfluenceUpdateGrouping} ConfluenceUpdateGrouping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConfluenceUpdateGrouping.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ConfluenceUpdateGrouping message.
         * @function verify
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ConfluenceUpdateGrouping.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.author != null && message.hasOwnProperty("author"))
                if (!$util.isString(message.author))
                    return "author: string expected";
            if (message.items != null && message.hasOwnProperty("items")) {
                if (!Array.isArray(message.items))
                    return "items: array expected";
                for (var i = 0; i < message.items.length; ++i) {
                    var error = $root.jarviscrawlercore.ConfluenceUpdateItem.verify(message.items[i]);
                    if (error)
                        return "items." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ConfluenceUpdateGrouping message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jarviscrawlercore.ConfluenceUpdateGrouping} ConfluenceUpdateGrouping
         */
        ConfluenceUpdateGrouping.fromObject = function fromObject(object) {
            if (object instanceof $root.jarviscrawlercore.ConfluenceUpdateGrouping)
                return object;
            var message = new $root.jarviscrawlercore.ConfluenceUpdateGrouping();
            if (object.author != null)
                message.author = String(object.author);
            if (object.items) {
                if (!Array.isArray(object.items))
                    throw TypeError(".jarviscrawlercore.ConfluenceUpdateGrouping.items: array expected");
                message.items = [];
                for (var i = 0; i < object.items.length; ++i) {
                    if (typeof object.items[i] !== "object")
                        throw TypeError(".jarviscrawlercore.ConfluenceUpdateGrouping.items: object expected");
                    message.items[i] = $root.jarviscrawlercore.ConfluenceUpdateItem.fromObject(object.items[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ConfluenceUpdateGrouping message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @static
         * @param {jarviscrawlercore.ConfluenceUpdateGrouping} message ConfluenceUpdateGrouping
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ConfluenceUpdateGrouping.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.items = [];
            if (options.defaults)
                object.author = "";
            if (message.author != null && message.hasOwnProperty("author"))
                object.author = message.author;
            if (message.items && message.items.length) {
                object.items = [];
                for (var j = 0; j < message.items.length; ++j)
                    object.items[j] = $root.jarviscrawlercore.ConfluenceUpdateItem.toObject(message.items[j], options);
            }
            return object;
        };

        /**
         * Converts this ConfluenceUpdateGrouping to JSON.
         * @function toJSON
         * @memberof jarviscrawlercore.ConfluenceUpdateGrouping
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ConfluenceUpdateGrouping.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ConfluenceUpdateGrouping;
    })();

    jarviscrawlercore.ConfluenceAllUpdates = (function() {

        /**
         * Properties of a ConfluenceAllUpdates.
         * @memberof jarviscrawlercore
         * @interface IConfluenceAllUpdates
         * @property {Array.<jarviscrawlercore.IConfluenceUpdateGrouping>|null} [updates] ConfluenceAllUpdates updates
         */

        /**
         * Constructs a new ConfluenceAllUpdates.
         * @memberof jarviscrawlercore
         * @classdesc Represents a ConfluenceAllUpdates.
         * @implements IConfluenceAllUpdates
         * @constructor
         * @param {jarviscrawlercore.IConfluenceAllUpdates=} [properties] Properties to set
         */
        function ConfluenceAllUpdates(properties) {
            this.updates = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ConfluenceAllUpdates updates.
         * @member {Array.<jarviscrawlercore.IConfluenceUpdateGrouping>} updates
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @instance
         */
        ConfluenceAllUpdates.prototype.updates = $util.emptyArray;

        /**
         * Creates a new ConfluenceAllUpdates instance using the specified properties.
         * @function create
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @static
         * @param {jarviscrawlercore.IConfluenceAllUpdates=} [properties] Properties to set
         * @returns {jarviscrawlercore.ConfluenceAllUpdates} ConfluenceAllUpdates instance
         */
        ConfluenceAllUpdates.create = function create(properties) {
            return new ConfluenceAllUpdates(properties);
        };

        /**
         * Encodes the specified ConfluenceAllUpdates message. Does not implicitly {@link jarviscrawlercore.ConfluenceAllUpdates.verify|verify} messages.
         * @function encode
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @static
         * @param {jarviscrawlercore.IConfluenceAllUpdates} message ConfluenceAllUpdates message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConfluenceAllUpdates.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.updates != null && message.updates.length)
                for (var i = 0; i < message.updates.length; ++i)
                    $root.jarviscrawlercore.ConfluenceUpdateGrouping.encode(message.updates[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ConfluenceAllUpdates message, length delimited. Does not implicitly {@link jarviscrawlercore.ConfluenceAllUpdates.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @static
         * @param {jarviscrawlercore.IConfluenceAllUpdates} message ConfluenceAllUpdates message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConfluenceAllUpdates.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ConfluenceAllUpdates message from the specified reader or buffer.
         * @function decode
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jarviscrawlercore.ConfluenceAllUpdates} ConfluenceAllUpdates
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConfluenceAllUpdates.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.jarviscrawlercore.ConfluenceAllUpdates();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.updates && message.updates.length))
                        message.updates = [];
                    message.updates.push($root.jarviscrawlercore.ConfluenceUpdateGrouping.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ConfluenceAllUpdates message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jarviscrawlercore.ConfluenceAllUpdates} ConfluenceAllUpdates
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConfluenceAllUpdates.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ConfluenceAllUpdates message.
         * @function verify
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ConfluenceAllUpdates.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.updates != null && message.hasOwnProperty("updates")) {
                if (!Array.isArray(message.updates))
                    return "updates: array expected";
                for (var i = 0; i < message.updates.length; ++i) {
                    var error = $root.jarviscrawlercore.ConfluenceUpdateGrouping.verify(message.updates[i]);
                    if (error)
                        return "updates." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ConfluenceAllUpdates message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jarviscrawlercore.ConfluenceAllUpdates} ConfluenceAllUpdates
         */
        ConfluenceAllUpdates.fromObject = function fromObject(object) {
            if (object instanceof $root.jarviscrawlercore.ConfluenceAllUpdates)
                return object;
            var message = new $root.jarviscrawlercore.ConfluenceAllUpdates();
            if (object.updates) {
                if (!Array.isArray(object.updates))
                    throw TypeError(".jarviscrawlercore.ConfluenceAllUpdates.updates: array expected");
                message.updates = [];
                for (var i = 0; i < object.updates.length; ++i) {
                    if (typeof object.updates[i] !== "object")
                        throw TypeError(".jarviscrawlercore.ConfluenceAllUpdates.updates: object expected");
                    message.updates[i] = $root.jarviscrawlercore.ConfluenceUpdateGrouping.fromObject(object.updates[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ConfluenceAllUpdates message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @static
         * @param {jarviscrawlercore.ConfluenceAllUpdates} message ConfluenceAllUpdates
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ConfluenceAllUpdates.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.updates = [];
            if (message.updates && message.updates.length) {
                object.updates = [];
                for (var j = 0; j < message.updates.length; ++j)
                    object.updates[j] = $root.jarviscrawlercore.ConfluenceUpdateGrouping.toObject(message.updates[j], options);
            }
            return object;
        };

        /**
         * Converts this ConfluenceAllUpdates to JSON.
         * @function toJSON
         * @memberof jarviscrawlercore.ConfluenceAllUpdates
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ConfluenceAllUpdates.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ConfluenceAllUpdates;
    })();

    return jarviscrawlercore;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                var message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
