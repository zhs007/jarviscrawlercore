const messages = require('../../pbjs/result_pb');

/**
 * new OABTResInfo with object
 * @param {object} obj - OABTResInfo
 * @return {messages.OABTResInfo} result - OABTResInfo
 */
function newOABTResInfo(obj) {
  const result = new messages.OABTResInfo();

  if (obj.type) {
    result.setType(obj.type);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  return result;
}

/**
 * new OABTNode with object
 * @param {object} obj - OABTNode
 * @return {messages.OABTNode} result - OABTNode
 */
function newOABTNode(obj) {
  const result = new messages.OABTNode();

  if (obj.fullname) {
    result.setFullname(obj.fullname);
  }

  if (obj.resid) {
    result.setResid(obj.resid);
  }

  if (obj.cat) {
    result.setCat(obj.cat);
  }

  if (Array.isArray(obj.lst) && obj.lst.length > 0) {
    for (let i = 0; i < obj.lst.length; ++i) {
      result.addLst(newOABTResInfo(obj.lst[i], i));
    }
  }

  return result;
}

/**
 * new OABTPage with object
 * @param {object} obj - OABTPage
 * @return {messages.OABTPage} result - OABTPage
 */
function newOABTPage(obj) {
  const result = new messages.OABTPage();

  if (Array.isArray(obj.lst) && obj.lst.length > 0) {
    for (let i = 0; i < obj.lst.length; ++i) {
      result.addLst(newOABTNode(obj.lst[i], i));
    }
  }

  return result;
}

/**
 * new ReplyOABT with object
 * @param {number} mode - messages.OABTMode
 * @param {object} obj - OABTPage
 * @return {messages.ReplyOABT} result - ReplyOABT
 */
function newReplyOABT(mode, obj) {
  const result = new messages.ReplyOABT();

  result.setMode(mode);

  if (mode == messages.OABTMode.OABTM_PAGE) {
    result.setPage(newOABTPage(obj));
  }

  return result;
}

/**
 * new RequestOABT for page
 * @param {int} pageindex - pageindex
 * @return {messages.RequestOABT} result - RequestOABT
 */
function newRequestOABTPage(pageindex) {
  const result = new messages.RequestOABT();

  result.setMode(messages.OABTMode.OABTM_PAGE);
  result.setPageindex(pageindex);

  return result;
}

exports.newReplyOABT = newReplyOABT;

exports.newRequestOABTPage = newRequestOABTPage;
