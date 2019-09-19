const scrapper = require('./src/scrapper');
const constant = require('./src/constant');

(async() => {
  console.log('> Start scrapping...');

  // for(let i=0; i<constant.totalPage; i++) {
  //   await scrapeTopChar.scrapeListOfChar(i+1);
  // }

  // await scrapeTopChar.combineAllChar();
  await scrapper.scrapeDetailChar();

  console.log('> Finish scrapping...');
})();