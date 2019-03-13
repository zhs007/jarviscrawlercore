const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 768, height: 1024, isMobile: true});
  await page.goto('https://www.huxiu.com/article/288704.html', {
    waitUntil: 'networkidle2',
  });

  // const dom = await page.$eval('.article-wrap', (element) => {
  //   return element.innerHTML;
  // });

  // const dom = page.$('.aw-content-wrap.clearfix');
  // console.log(dom);

  // await page.setContent(dom);

  // await page.pdf({path: 'huxiu.pdf', format: 'A4'});
  await page.screenshot({path: 'huxiu.png', fullPage: true});

  await browser.close();
})();
