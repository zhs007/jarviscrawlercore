const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.baijingapp.com/article/21901', {
    waitUntil: 'networkidle2',
  });

  const dom = await page.$eval('.col-sm-8.col-md-8.aw-main-content.aw-article-content', (element) => {
    return element.innerHTML;
  });

  // const dom = page.$('.aw-content-wrap.clearfix');
  // console.log(dom);

  await page.setContent(dom);

  await page.pdf({
    path: 'baijingapp.pdf',
    format: 'A4',
  });

  await browser.close();
})();
