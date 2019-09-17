const scrapeTopChar = require('./src/top-char');

(async() => {
  await scrapeTopChar.scrapeChar(1);
  await scrapeTopChar.scrapeChar(2);
  await scrapeTopChar.scrapeChar(3);
  await scrapeTopChar.scrapeChar(4);
})();