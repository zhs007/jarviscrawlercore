const messages = require('../../proto/result_pb');

/**
 * new JRJFunds with object
 * @param {object} obj - JRJFunds object
 * @return {messages.JRJFunds} result - JRJFunds
 */
function newJRJFunds(obj) {
  const result = new messages.JRJFunds();

  if (Array.isArray(obj.codes) && obj.codes.length > 0) {
    result.setCodesList(obj.codes);
  }

  return result;
}

/**
 * new JRJFundValue with object
 * @param {object} obj - JRJFundValue object
 * @return {messages.JRJFundValue} result - JRJFundValue
 */
function newJRJFundValue(obj) {
  const result = new messages.JRJFundValue();

  if (obj.code) {
    result.setCode(obj.code);
  }

  if (Array.isArray(obj.value) && obj.value.length > 0) {
    result.setValueList(obj.value);
  }

  if (Array.isArray(obj.totalValue) && obj.totalValue.length > 0) {
    result.setTotalvalueList(obj.totalValue);
  }

  if (Array.isArray(obj.iValue) && obj.iValue.length > 0) {
    result.setIvalueList(obj.iValue);
  }

  if (Array.isArray(obj.iTotalValue) && obj.iTotalValue.length > 0) {
    result.setItotalvalueList(obj.iTotalValue);
  }

  if (Array.isArray(obj.data) && obj.data.length > 0) {
    result.setDataList(obj.data);
  }

  return result;
}

/**
 * new JRJFundSize with object
 * @param {object} obj - JRJFundSize object
 * @return {messages.JRJFundSize} result - JRJFundSize
 */
function newJRJFundSize(obj) {
  const result = new messages.JRJFundSize();

  if (obj.size) {
    result.setSize(obj.size);
  }

  if (obj.time) {
    result.setTime(obj.time);
  }

  return result;
}

/**
 * new JRJFundManager with object
 * @param {object} obj - JRJFundManager object
 * @return {messages.JRJFundManager} result - JRJFundManager
 */
function newJRJFundManager(obj) {
  const result = new messages.JRJFundManager();

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.startTime) {
    result.setStarttime(obj.startTime);
  }

  if (obj.endTime) {
    result.setEndtime(obj.endTime);
  }

  if (obj.birthYear) {
    result.setBirthyear(obj.birthYear);
  }

  if (obj.sex) {
    result.setSex(obj.sex);
  }

  if (obj.education) {
    result.setEducation(obj.education);
  }

  if (obj.country) {
    result.setCountry(obj.country);
  }

  if (obj.resume) {
    result.setResume(obj.resume);
  }

  return result;
}

/**
 * new JRJFund with object
 * @param {object} obj - JRJFund object
 * @return {messages.JRJFund} result - JRJFund
 */
function newJRJFund(obj) {
  const result = new messages.JRJFund();

  if (obj.code) {
    result.setCode(obj.code);
  }

  if (obj.name) {
    result.setName(obj.name);
  }

  if (Array.isArray(obj.tags) && obj.tags.length > 0) {
    result.setTagsList(obj.tags);
  }

  if (obj.createTime) {
    result.setCreatetime(obj.createTime);
  }

  if (Array.isArray(obj.size) && obj.size.length > 0) {
    for (let i = 0; i < obj.size.length; ++i) {
      result.addSize(newJRJFundSize(obj.size[i], i));
    }
  }

  if (obj.company) {
    result.setCompany(obj.company);
  }

  if (Array.isArray(obj.managers) && obj.managers.length > 0) {
    for (let i = 0; i < obj.managers.length; ++i) {
      result.addManagers(newJRJFundManager(obj.managers[i], i));
    }
  }

  return result;
}

/**
 * new ReplyJRJ with object
 * @param {number} mode - messages.JRJMode
 * @param {object} obj - JRJFunds | JRJFund | JRJFundValue object
 * @return {messages.ReplyJRJ} result - ReplyJRJ
 */
function newReplyJRJ(mode, obj) {
  const result = new messages.ReplyJRJ();

  result.setMode(mode);

  if (
    mode == messages.JRJMode.JRJM_FUND ||
    mode == messages.JRJMode.JRJM_FUNDMANAGER
  ) {
    result.setFund(newJRJFund(obj));
  } else if (mode == messages.JRJMode.JRJM_FUNDS) {
    result.setFunds(newJRJFunds(obj));
  } else if (mode == messages.JRJMode.JRJM_FUNDVALUE) {
    result.setFundvalue(newJRJFundValue(obj));
  }

  return result;
}

exports.newReplyJRJ = newReplyJRJ;
