const path = require('path');
const appRootDir = require('app-root-dir');

module.exports = {
  getCharPath: 'https://bumilangit.com/en/characters-database/',
  getOutputDir: path.resolve(appRootDir.get(), './output'),
}