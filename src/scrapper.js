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

async function scrapeListOfChar(pageToScrap, store) {
  const { browser, browserPage } = await createBrowser();
  const PAGE_URL = constant.getCharPath;
  const urlWithPage = pageToScrap > 1 ? `${PAGE_URL}/page/${pageToScrap}` : PAGE_URL;
  await browserPage.goto(urlWithPage, { waitUntil: 'networkidle2' });

  let data = await browserPage.evaluate(() => {
    try {
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
    } catch (error) {
      console.error('Error run selector: .container.container-content > .row:last-child > .col.l12.m12.s12 > .col.l3.m4.s6.char_temp');
      return [];
    }
  });

  console.log('> Get data from page ' + pageToScrap + '...');
  store.addChars(data); // push data into store
  await browser.close();
}

function doScrapeWithTimeout ({ item, index, store, isLastItem }) {
  setTimeout(async () => {
    const { browser, browserPage } = await createBrowser();
    try {
      console.log('> Go to detail page:', item.id);
      await browserPage.goto(item.link, { waitUntil: 'networkidle2' });
      let dataDesc = await browserPage.evaluate(() => {
        try {
          const descriptionDOM = document.querySelector('div.container:nth-child(4) > div:nth-child(3) > div:nth-child(1) > p:nth-child(2)');
          return descriptionDOM.innerText;
        } catch (error) {
          console.error('> Error querySelector for get description');
          return '';
        }
      });
      store.setDetail(item.id, dataDesc);
      fileUtil.writeFile(`${constant.getOutputDir}/detail/${item.id}.json`, JSON.stringify({ ...item, desc: dataDesc || '' }));
      if (isLastItem) {
        combineAllChar(store);
      }
    } catch (error) {
      console.error('> Error open detail page', error);
    }
    await browser.close();
  }, 2000 * index)
}

async function scrapeDetailChar (store) {
  try {
    store.getChars.forEach(async (item, index) => {
      const isLastItem = (index === store.getChars.length - 1);
      doScrapeWithTimeout({
        item,
        index,
        store,
        isLastItem
      });
    });
  } catch (error) {
    console.error('> Error parsing data', error);
  }
}

async function combineAllChar (store) {
  console.log('> Combine all data into one file');
  fileUtil.writeFile(`${constant.getOutputDir}/characters.json`, JSON.stringify(store.getChars));
}

module.exports = {
  scrapeListOfChar,
  scrapeDetailChar,
  combineAllChar,
};