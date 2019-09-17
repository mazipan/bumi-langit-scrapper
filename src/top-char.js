const puppeteer = require('puppeteer');
const constant = require('./constant');
const fileUtil = require('./file-util');

async function scrapeListOfChar(pageToScrap) {
  const browser = await puppeteer.launch({ headless: true });
  console.log('> Browser version: ', await browser.version());

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });

  const PAGE_URL = constant.getCharPath;
  const urlWithPage = pageToScrap > 1 ? `${PAGE_URL}/page/${pageToScrap}` : PAGE_URL;
  await page.goto(urlWithPage, { waitUntil: 'networkidle2' });

  let data = await page.evaluate(() => {
    const res = document.querySelectorAll('.container.container-content > .row:last-child > .col.l12.m12.s12 > .col.l3.m4.s6.char_temp');
    const resArr = []
    for (const property in res) {
      if (res.hasOwnProperty(property)) {
        const item = res[property];
        const link = item.querySelector('a');
        const image = item.querySelector('img');
        const name = item.querySelector('h6');
        resArr.push({
          link: link.href,
          image: image.src,
          name: name.innerText
        })
      }
    };
    return resArr
  });

  console.log('> Get data from page ' + pageToScrap + '...');
  fileUtil.writeFile(`${constant.getOutputDir}/char${pageToScrap}.json`, JSON.stringify(data));
  await browser.close();
}

async function scrapeDetailChar (urlDetailPage) {

}

async function combineAllChar () {
  let resAll = []
  for(let i=0; i<constant.totalPage; i++) {
    const res = await fileUtil.readFile(`${constant.getOutputDir}/char${i+1}.json`);
    const resObj = JSON.parse(res);
    resAll = [...resAll, ...resObj];
  }

  console.log('> Combine all data into one file');
  fileUtil.writeFile(`${constant.getOutputDir}/char-all.json`, JSON.stringify(resAll));
}

module.exports = {
  scrapeListOfChar,
  scrapeDetailChar,
  combineAllChar,
};