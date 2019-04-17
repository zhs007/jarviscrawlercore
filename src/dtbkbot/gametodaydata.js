
/**
 * onRightFrameLoaded GTDS
 * @param {object} rightFrame - rightFrame
 */
async function onRightFrameLoadedGTDS(rightFrame) {
  // 等待页面加载
  await rightFrame.waitForFunction(() => {
    if (typeof jarvisCrawlerCoreVer === 'string') {
      const btncx = getElementWithDefaultValue('.scbtn', '查询');
      if (btncx) {
        btncx.className = 'scbtn cx';

        return true;
      }
    }

    return false;
  });

  //   // 标记
  //   await rightFrame.evaluate(()=>{
  //     console.log('I am start...');

//     const btncx = getElementWithDefaultValue('.scbtn', '查询');
//     if (btncx) {
//       btncx.className = 'scbtn cx';
//     }
//   });
}

/**
 * Game Today Data Summary
 * @param {object} page - page
 * @param {object} leftFrame - leftFrame
 * @param {object} rightFrame - rightFrame
 */
async function getGameTodayDataSummary(page, leftFrame, rightFrame) {
//   page.on('framenavigated', async (frame) => {
//     if (frame.name() === 'rightFrame') {
//       // 等待页面加载
//     //   await waitForBtn(rightFrame);
//       await rightFrame.waitForFunction(() => {
//         if (typeof jarvisCrawlerCoreVer === 'string') {
//           const btncx = getElementWithDefaultValue('.scbtn', '查询');
//           if (btncx) {
//             return true;
//           }
//         }

  //         return false;
  //       });

  //       // 标记
  //       await rightFrame.evaluate(()=>{
  //         console.log('I am start...');

  //         const btncx = getElementWithDefaultValue('.scbtn', '查询');
  //         if (btncx) {
  //           btncx.className = 'scbtn cx';
  //         }
  //       });
  //     }
  //   });

  // 打开一级菜单
  await leftFrame.click('.title.jlxx');

  // 等待一级菜单打开
  await leftFrame.waitForFunction(() => {
    const jlxxmenu = getElement('.menuson.jlxx');
    if (jlxxmenu) {
      if (jlxxmenu.style.cssText === 'display: block;') {
        return true;
      }
    }

    return false;
  });

  // 点击二级菜单
  await leftFrame.click('.yxjl');

  //   await page.waitForSelector('.scbtn.cx');

  // 等待页面加载
  await rightFrame.waitForFunction(() => {
    if (typeof jarvisCrawlerCoreVer === 'string') {
      const btncx = getElementWithDefaultValue('.scbtn', '查询');
      if (btncx) {
        return true;
      }
    }

    return false;
  });

  //   await waitForBtn(rightFrame);

  //   // 标记
  //   await rightFrame.evaluate(()=>{
  //     console.log('I am start...');

  //     const btncx = getElementWithDefaultValue('.scbtn', '查询');
  //     if (btncx) {
  //       btncx.className = 'scbtn cx';
  //     }
  //   });

  await rightFrame.click('.scbtn.cx');

  // 等待页面加载
  await rightFrame.waitForFunction(() => {
    if (typeof jarvisCrawlerCoreVer === 'string') {
      const btncx = getElementWithDefaultValue('.scbtn', '查询');
      if (btncx) {
        const paginList = getElement('.paginList');
        if (paginList) {
          const paginListI = paginList.getElementsByTagName('I');
          if (paginListI.length > 0) {
            if (parseInt(paginListI[0].innerText) > 0) {
              paginListI[0].className = 'blue gamenums';
              return true;
            }
          }
        }
      }
    }

    return false;
  });

  const gamenums = await rightFrame.$eval('.blue.gamenums', (ele) => {
    return parseInt(ele.innerText);
  });

  const {bet, win} = await rightFrame.$$eval('tr', (eles) => {
    if (eles.length > 2) {
      const curtr = eles[eles.length - 1];
      if (curtr.children.length == 6) {
        return {
          bet: parseFloat(curtr.children[2].innerText.replace(/,/g, '')),
          win: parseFloat(curtr.children[3].innerText.replace(/,/g, '')),
        };
      }
    }
  });

  console.log('gamenums - ' + gamenums);
  console.log('bet - ' + bet);
  console.log('win - ' + win);

  //   // 标记
  //   await rightFrame.evaluate(()=>{
  //     console.log('I am start...');

//     const btncx = getElementWithDefaultValue('.scbtn', '查询');
//     if (btncx) {
//       btncx.className = 'scbtn cx';
//     }
//   });
}

exports.onRightFrameLoadedGTDS = onRightFrameLoadedGTDS;
exports.getGameTodayDataSummary = getGameTodayDataSummary;
