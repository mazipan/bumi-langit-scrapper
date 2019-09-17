const scrapeTopChar = require('./src/top-char');
const constant = require('./src/constant');

(async() => {
  console.log('> Start scrapping...');
  for(let i=0; i<constant.totalPage; i++) {
    await scrapeTopChar.scrapeListOfChar(i+1);
  }
  await scrapeTopChar.combineAllChar();
  console.log('> Finish scrapping...');
})();