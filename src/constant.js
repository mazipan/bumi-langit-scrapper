const path = require('path');
const appRootDir = require('app-root-dir');

module.exports = {
  totalPage: 4,
  getCharPath: 'https://bumilangit.com/en/characters-database/',
  getCharLinkPrefix: 'https://bumilangit.com/en/characterspods/',
  getOutputDir: path.resolve(appRootDir.get(), './output'),
}