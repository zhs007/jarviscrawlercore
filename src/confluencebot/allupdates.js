/**
 * all updates
 * @param {object} page - page
 * @return {ExportArticleResult} result - result
 */
async function allUpdates(page) {
  return await page.evaluate(async () => {
    const ret = {};
    ret.updates = [];

    const objupdates = getElement('.list-container.list-container-all-updates');
    if (objupdates) {
    //   console.log(objupdates.children.length);
      //   objupdates = objupdates.children[0];
      // console.log(objupdates.children.length);

      for (let i = 0; i < objupdates.children.length; ++i) {
        const curgrouping = objupdates.children[i];
        if (curgrouping.className === 'grouping') {
          const cc = {};
          const cg1 = curgrouping.children[1];
          // h4
          const author = cg1.children[0].innerText;

          cc.author = author;
          cc.items = [];

          // ul -> li
          for (let j = 0; j < cg1.children[1].children.length; ++j) {
            const itemtitle =
              cg1.children[1].children[j].getElementsByClassName(
                  'update-item-title');

            if (itemtitle[0].parentNode.tagName === 'A') {
              const curl = itemtitle[0].parentNode.href;
              const ctitle = itemtitle[0].parentNode.innerText;

              cc.items.push({
                url: curl,
                title: ctitle,
              });
            } else {
              const curl = itemtitle[0].parentNode.parentNode.href;
              const ctitle = itemtitle[0].innerText;
              const csummary = itemtitle[0].parentNode.children[1].innerText;

              cc.items.push({
                url: curl,
                title: ctitle,
                summary: csummary,
              });
            }
          }

          ret.updates.push(cc);

          // console.log(i, cc);
        }
      }
    }

    return ret;
  });
}

exports.allUpdates = allUpdates;
