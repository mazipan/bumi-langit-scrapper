const scrapper = require('./src/scrapper');
const constant = require('./src/constant');
const Characters = require('./src/store/characters');

(async() => {
  const Store = new Characters();
  console.log('> Start scrapping...');

  for(let i=0; i<constant.totalPage; i++) {
    await scrapper.scrapeListOfChar(i+1, Store);
  }

  await scrapper.combineAllChar(Store);
  await scrapper.scrapeDetailChar(Store);

  console.log('> Finish scrapping...');
})();