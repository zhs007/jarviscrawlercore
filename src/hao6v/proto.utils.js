const messages = require('../../pbjs/result_pb');

/**
 * new Hao6vResInfo with object
 * @param {object} obj - Hao6vResInfo
 * @return {messages.Hao6vResInfo} result - Hao6vResInfo
 */
function newHao6vResInfo(obj) {
  const result = new messages.Hao6vResInfo();

  if (obj.type) {
    result.setType(obj.type);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.code) {
    result.setCode(obj.code);
  }

  return result;
}

/**
 * new Hao6vNode with object
 * @param {object} obj - Hao6vNode
 * @return {messages.Hao6vNode} result - Hao6vNode
 */
function newHao6vNode(obj) {
  const result = new messages.Hao6vNode();

  if (obj.fullname) {
    result.setFullname(obj.fullname);
  }

  if (obj.resid) {
    result.setResid(obj.resid);
  }

  if (Array.isArray(obj.lst) && obj.lst.length > 0) {
    for (let i = 0; i < obj.lst.length; ++i) {
      result.addLst(newHao6vResInfo(obj.lst[i], i));
    }
  }

  if (Array.isArray(obj.title) && obj.title.length > 0) {
    result.setTitleList(obj.title);
  }

  if (Array.isArray(obj.director) && obj.director.length > 0) {
    result.setDirectorList(obj.director);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.cover) {
    result.setCover(obj.cover);
  }

  if (obj.fulldirector) {
    result.setFulldirector(obj.fulldirector);
  }

  return result;
}

/**
 * new Hao6vNewPage with object
 * @param {object} obj - Hao6vNewPage
 * @return {messages.Hao6vNewPage} result - Hao6vNewPage
 */
function newHao6vNewPage(obj) {
  const result = new messages.Hao6vNewPage();

  if (Array.isArray(obj.lst) && obj.lst.length > 0) {
    for (let i = 0; i < obj.lst.length; ++i) {
      result.addLst(newHao6vNode(obj.lst[i], i));
    }
  }

  return result;
}

/**
 * new ReplyHao6v with object
 * @param {number} mode - messages.Hao6vMode
 * @param {object} obj - OABTPage
 * @return {messages.ReplyHao6v} result - ReplyHao6v
 */
function newReplyHao6v(mode, obj) {
  const result = new messages.ReplyHao6v();

  result.setMode(mode);

  if (mode == messages.Hao6vMode.H6VM_NEWPAGE) {
    result.setNewpage(newHao6vNewPage(obj));
  } else if (mode == messages.Hao6vMode.H6VM_RESPAGE) {
    result.setRes(newHao6vNode(obj));
  }

  return result;
}

/**
 * new RequestHao6v for newpage
 * @return {messages.RequestHao6v} result - RequestHao6v
 */
function newRequestHao6vNewPage() {
  const result = new messages.RequestHao6v();

  result.setMode(messages.Hao6vMode.H6VM_NEWPAGE);

  return result;
}

/**
 * new RequestHao6v for respage
 * @param {string} url - url
 * @return {messages.RequestHao6v} result - RequestHao6v
 */
function newRequestHao6vResPage(url) {
  const result = new messages.RequestHao6v();

  result.setMode(messages.Hao6vMode.H6VM_RESPAGE);
  result.setUrl(url);

  return result;
}

exports.newReplyHao6v = newReplyHao6v;

exports.newRequestHao6vNewPage = newRequestHao6vNewPage;
exports.newRequestHao6vResPage = newRequestHao6vResPage;
