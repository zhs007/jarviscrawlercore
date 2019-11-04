const chromeLauncher = require('chrome-launcher');
const axios = require('axios');

(async () => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: [],
  });

  console.log(`http://localhost:${chrome.port}/json/version`);

  const response = await axios.get(
      `http://localhost:${chrome.port}/json/version`
  );
  const {webSocketDebuggerUrl} = response.data;

  console.log(webSocketDebuggerUrl);
})();
