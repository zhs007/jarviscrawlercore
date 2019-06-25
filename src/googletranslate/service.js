const {googletranslate} = require('./googletranslate');

/**
 * translateInGoogle
 * @param {object} browser - browser
 * @param {string} srctext - source text
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @return {object} result - {error: string, text: text}
 */
async function translateInGoogle(browser, srctext, srclang, destlang) {
  let errstr = undefined;

  const text = googletranslate(browser, srctext, srclang, destlang).catch(
      (err) => {
        errstr = err.toString();
      }
  );

  if (errstr) {
    return {error: errstr};
  }

  return {text: text};
}

exports.translateInGoogle = translateInGoogle;
