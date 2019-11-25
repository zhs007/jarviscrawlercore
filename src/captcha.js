const {sleep} = require('./utils');
const log = require('./log');

/**
 * holdBarMove
 * @param {object} page - page
 * @param {object} barBox - bar boundingbox
 * @param {object} rcBox - rect boundingbox
 * @param {int} time - move time in ms
 * @param {int} offtime - offset time in ms
 * @return {error} err - error
 */
async function holdBarMove(page, barBox, rcBox, time, offtime) {
  const ex = Math.floor(rcBox.x + rcBox.width - Math.random() * 16 - 8);
  let bx = Math.floor(barBox.x + barBox.width / 2 + Math.random() * 16 - 8);

  log.debug('holdBarMove', {bx: bx, ex: ex});

  await page.mouse.move(
      bx,
      Math.floor(barBox.y + barBox.height / 2 + Math.random() * 16 - 8)
  );

  await sleep(Math.floor(time * (0.1 + Math.random() * 0.1)));
  await page.mouse.down();

  const pixeltime = (ex - bx) / time;

  let ot = offtime;

  while (bx < ex) {
    const cot = Math.floor((0.7 * Math.random() + 0.6) * ot);

    bx += Math.floor(
        (0.7 * Math.random() + 0.6) * (Math.floor(cot * pixeltime) + 1)
    );
    const cy = Math.floor(
        barBox.y + barBox.height / 2 + Math.random() * 16 - 8
    );

    log.debug('holdBarMove move', {bx: bx, cy: cy, ot: cot});

    await page.mouse.move(bx, cy);

    await sleep(cot);

    ot = Math.floor(ot * 1.1);
  }

  await page.mouse.up();

  return undefined;
}

exports.holdBarMove = holdBarMove;
