const {sleep, isElementVisible} = require('../utils');

const URLLogin = 'https://www.alimama.com/member/login.htm';

/**
 * procNoCaptcha - procNoCaptcha
 * @param {object} page - page
 * @param {string} frame - frame
 */
async function procNoCaptcha(page, frame) {
  const lstnocaptcha = await frame.$$('#nocaptcha');
  if (lstnocaptcha.length > 0) {
    const isvisible = await isElementVisible(frame, lstnocaptcha[0]);
    if (isvisible) {
      const lstbtn = await frame.$$('.nc_iconfont.btn_slide');

      const bbbox = await lstnocaptcha[0].boundingBox();

      if (lstbtn.length > 0) {
        const bbox = await lstbtn[0].boundingBox();
        const ex = Math.floor(bbbox.x + bbbox.width - Math.random() * 10 - 5);
        let bx = Math.floor(bbox.x + bbox.width / 2 + Math.random() * 10 - 5);

        console.log('bx ', bx);
        console.log('ex ', ex);

        await page.mouse.move(
            bx,
            Math.floor(bbox.y + bbox.height / 2 + Math.random() * 10 - 5)
        );

        await sleep(Math.floor(100 + Math.random() * 50));
        await page.mouse.down();

        const ft = 300;
        const pixeltime = bbbox.width / ft;

        while (bx < ex) {
          bx += Math.floor(30 * pixeltime) + 1;
          // console.log('bx ', bx);
          await page.mouse.move(
              bx,
              Math.floor(bbox.y + bbox.height / 2 + Math.random() * 10 - 5)
          );
          await sleep(30);
        }

        await page.mouse.up();
      }
    }
  }
}

/**
 * login - login
 * @param {object} page - page
 * @param {string} username - username
 * @param {string} passwd - passwd
 */
async function login(page, username, passwd) {
  if (page.url().indexOf(URLLogin) == 0) {
    const frame = page
        .frames()
        .find((frame) => frame.name() === 'taobaoLoginIfr');

    const isneedchg2input = await frame.evaluate(() => {
      const lstb = document.getElementsByClassName('forget-pwd J_Quick2Static');
      if (lstb.length > 0) {
        if (lstb[0].innerText == '密码登录') {
          return true;
        }
      }

      return false;
    });

    if (isneedchg2input) {
      const lstbtn = await frame.$$('.forget-pwd.J_Quick2Static');
      if (lstbtn.length > 0) {
        await lstbtn[0].hover();

        await lstbtn[0].click();

        const lstuname = await frame.$$('#TPL_username_1');
        const lstpasswd = await frame.$$('#TPL_password_1');
        const lstsubmit = await frame.$$('#J_SubmitStatic');
        if (
          lstuname.length > 0 &&
          lstpasswd.length > 0 &&
          lstsubmit.length > 0
        ) {
          await lstuname[0].hover();
          await lstuname[0].type(username, {delay: 100});

          await lstpasswd[0].hover();
          await lstpasswd[0].type(passwd, {delay: 100});

          await procNoCaptcha(page, frame);

          console.log('end!');
        }
      }
    }
  }
}

/**
 * checkNeedLogin - check if page is need login
 * @param {object} page - page
 * @param {string} url - url
 * @param {string} waitAllResponse - waitAllResponse
 */
function checkNeedLogin(page, url, waitAllResponse) {
  page.on('framenavigated', async (frame) => {
    if (frame == page.mainFrame()) {
      // waitAllResponse.reset();

      if (frame.url().indexOf(url) == 0) {
        return;
      }

      if (
        frame.url().indexOf('https://www.alimama.com/member/login.htm') == 0
      ) {
        return;
      }
    }
  });
}

exports.checkNeedLogin = checkNeedLogin;
exports.login = login;
