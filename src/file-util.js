const fs = require('fs');
const path = require('path');
const appRootDir = require('app-root-dir');

const writeFile = (pathFile, content) => {
  const stream = fs.createWriteStream(pathFile);
  stream.write(content);
  stream.end();
  console.log('Success write file: ', pathFile);
};

module.exports = {
  writeFile,
};
