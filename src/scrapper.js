const puppeteer = require('puppeteer');
const constant = require('./constant');
const fileUtil = require('./file-util');

async function createBrowser () {
  const browser = await puppeteer.launch({ headless: true });
  console.info('> Browser scrapper version: ', await browser.version());
  const browserPage = await browser.newPage();
  await browserPage.setViewport({ width: 1920, height: 926 });
  return { browser, browserPage };
}

async function scrapeListOfChar(pageToScrap) {
  const { browser, browserPage } = await createBrowser();
  const PAGE_URL = constant.getCharPath;
  const urlWithPage = pageToScrap > 1 ? `${PAGE_URL}/page/${pageToScrap}` : PAGE_URL;
  await browserPage.goto(urlWithPage, { waitUntil: 'networkidle2' });

  let data = await browserPage.evaluate(() => {
    const res = document.querySelectorAll('.container.container-content > .row:last-child > .col.l12.m12.s12 > .col.l3.m4.s6.char_temp');
    const resArr = []
    for (const property in res) {
      if (res.hasOwnProperty(property)) {
        const item = res[property];
        if (item.querySelector) {
          const link = item.querySelector('a');
          const image = item.querySelector('img');
          const name = item.querySelector('h6');

          const generateId = (link) => {
            return (link.toString())
              .replace('https://bumilangit.com/en/characterspods/', '')
              .replace(/[^\w\s]/gi, '');
          }

          resArr.push({
            id: generateId(link.href),
            link: link.href,
            image: image.src,
            name: name.innerText,
          })
        }
      }
    };
    return resArr
  });

  console.log('> Get data from page ' + pageToScrap + '...');
  fileUtil.writeFile(`${constant.getOutputDir}/char${pageToScrap}.json`, JSON.stringify(data));

  await browser.close();
}

function doScrapeWithTimeout (item, index) {
  setTimeout(async () => {
    const { browser, browserPage } = await createBrowser();
    try {
      console.log('> Go to detail page:', item.id);
      await browserPage.goto(item.link, { waitUntil: 'networkidle2' });
      let dataDesc = await browserPage.evaluate(() => {
        const descriptionDOM = document.querySelectorAll('div.container:nth-child(4) > div:nth-child(3) > div:nth-child(1)');
        return descriptionDOM;
      });
      fileUtil.writeFile(`${constant.getOutputDir}/detail/${item.id}.json`, JSON.stringify({ id: item.id, desc: dataDesc }));
    } catch (error) {
      console.error('> Error open detail page', error);
    }
    await browser.close();
  }, 2000 * index)
}
async function scrapeDetailChar () {
  const res = await fileUtil.readFile(`${constant.getOutputDir}/char-all.json`);
  try {
    const resArr = JSON.parse(res);
    resArr.forEach(async (item, index) => {
      if (item.id === 'gundala') {
        doScrapeWithTimeout(item, 0);
      }
    });
  } catch (error) {
    console.error('> Error parsing data', error);
  }
}

async function combineAllChar () {
  let resAll = []
  for(let i=0; i<constant.totalPage; i++) {
    const res = await fileUtil.readFile(`${constant.getOutputDir}/char${i+1}.json`);
    try {
      const resObj = JSON.parse(res);
      resAll = [...resAll, ...resObj];
    } catch (error) {
      console.error('> Error parsing data', error);
    }
  }

  console.log('> Combine all data into one file');
  fileUtil.writeFile(`${constant.getOutputDir}/char-all.json`, JSON.stringify(resAll));
}

module.exports = {
  scrapeListOfChar,
  scrapeDetailChar,
  combineAllChar,
};