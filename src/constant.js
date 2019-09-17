const path = require('path');
const appRootDir = require('app-root-dir');

module.exports = {
  totalPage: 4,
  getCharPath: 'https://bumilangit.com/en/characters-database/',
  getOutputDir: path.resolve(appRootDir.get(), './output'),
}