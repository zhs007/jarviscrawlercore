/**
 * base64 encode
 * @param {ArrayBuffer} arrayBuffer - arraubuffer
 * @return {string} base64 string
 */
function base64ArrayBuffer(arrayBuffer) {
  let base64 = '';
  const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a;
  let b;
  let c;
  let d;
  let chunk;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i += 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += `${encodings[a]}${encodings[b]}==`;
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
  }

  return base64;
}

/**
 * fetch image
 * @param {string} url - url
 * @return {ImageInfo} image info
 */
async function fetchImage(url) {
  // const response = await fetch(url);
  // const imgbuf = await response.arrayBuffer();

  return {
    url: url,
    // base64data: base64ArrayBuffer(imgbuf),
  };
}

/**
 * getElement
 * @param {string} selector - selector
 * @return {Element} element - element, it maybe is undefined
 */
function getElement(selector) {
  const lst = $(selector);
  if (lst.length > 0) {
    return lst[0];
  }

  return undefined;
}

/**
 * getElementWithText
 * @param {string} selector - selector
 * @param {string} text - text
 * @return {Element} element - element, it maybe is undefined
 */
function getElementWithText(selector, text) {
  const lst = $(selector);
  if (lst.length > 0) {
    for (let i = 0; i < lst.length; ++i) {
      if (lst[i].innerText === text) {
        return lst[i];
      }
    }
  }

  return undefined;
}

/**
 * clearArticleElement
 * @param {Element} body - body
 */
function clearArticleElement(body) {
  for (let i = 0; i < body.childNodes.length; ) {
    if (body.childNodes[i].className != 'article-head' &&
    body.childNodes[i].className != 'article-body') {
      body.childNodes[i].remove();
    } else {
      ++i;
    }
  }
}

/**
 * getElementAttributes
 * @param {Element} ele - element
 * @param {string} key - key
 */
function getElementAttributes(ele, key) {
  const attrs = ele.attributes;
  for (let i = 0; i < attrs.length; ++i) {
    if (attrs[i].name == key) {
      return attrs[i].value;
    }
  }
}

/**
 * getElementChildWithTagAndText
 * @param {object} ele - element
 * @param {string} tag - tag
 * @param {string} text - text
 * @return {Element} element - element, it maybe is undefined
 */
function getElementChildWithTagAndText(ele, tag, text) {
  const lst = ele.getElementsByTagName(tag);
  for (let i = 0; i < lst.length; ++i) {
    if (lst[i].innerText === text) {
      return lst[i];
    }
  }

  return undefined;
}

/**
 * getElementWithDefaultValue
 * @param {string} selector - selector
 * @param {string} value - default value
 * @return {Element} element - element, it maybe is undefined
 */
function getElementWithDefaultValue(selector, value) {
  const lst = $(selector);
  if (lst.length > 0) {
    for (let i = 0; i < lst.length; ++i) {
      if (lst[i].defaultValue === value) {
        return lst[i];
      }
    }
  }

  return undefined;
}

const jarvisCrawlerCoreVer = '0.1.33';
