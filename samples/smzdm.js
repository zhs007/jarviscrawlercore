const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 768, height: 1024, isMobile: true});
  await page.goto('https://post.smzdm.com/p/amm0xo7d/', {
    waitUntil: 'networkidle2',
  });

  const dom = await page.$eval('article', (element) => {
    return element.innerHTML;
  });

  // const dom = page.$('.aw-content-wrap.clearfix');
  // console.log(dom);

  await page.setContent(dom);

  await page.pdf({path: 'smzdm.pdf', format: 'A4'});
  // await page.screenshot({path: 'smzdm.png'});

  await browser.close();
})();
